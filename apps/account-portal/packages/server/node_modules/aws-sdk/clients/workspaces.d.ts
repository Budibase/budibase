import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class WorkSpaces extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: WorkSpaces.Types.ClientConfiguration)
  config: Config & WorkSpaces.Types.ClientConfiguration;
  /**
   * Associates the specified connection alias with the specified directory to enable cross-Region redirection. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.  Before performing this operation, call  DescribeConnectionAliases to make sure that the current state of the connection alias is CREATED. 
   */
  associateConnectionAlias(params: WorkSpaces.Types.AssociateConnectionAliasRequest, callback?: (err: AWSError, data: WorkSpaces.Types.AssociateConnectionAliasResult) => void): Request<WorkSpaces.Types.AssociateConnectionAliasResult, AWSError>;
  /**
   * Associates the specified connection alias with the specified directory to enable cross-Region redirection. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.  Before performing this operation, call  DescribeConnectionAliases to make sure that the current state of the connection alias is CREATED. 
   */
  associateConnectionAlias(callback?: (err: AWSError, data: WorkSpaces.Types.AssociateConnectionAliasResult) => void): Request<WorkSpaces.Types.AssociateConnectionAliasResult, AWSError>;
  /**
   * Associates the specified IP access control group with the specified directory.
   */
  associateIpGroups(params: WorkSpaces.Types.AssociateIpGroupsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.AssociateIpGroupsResult) => void): Request<WorkSpaces.Types.AssociateIpGroupsResult, AWSError>;
  /**
   * Associates the specified IP access control group with the specified directory.
   */
  associateIpGroups(callback?: (err: AWSError, data: WorkSpaces.Types.AssociateIpGroupsResult) => void): Request<WorkSpaces.Types.AssociateIpGroupsResult, AWSError>;
  /**
   * Associates the specified application to the specified WorkSpace.
   */
  associateWorkspaceApplication(params: WorkSpaces.Types.AssociateWorkspaceApplicationRequest, callback?: (err: AWSError, data: WorkSpaces.Types.AssociateWorkspaceApplicationResult) => void): Request<WorkSpaces.Types.AssociateWorkspaceApplicationResult, AWSError>;
  /**
   * Associates the specified application to the specified WorkSpace.
   */
  associateWorkspaceApplication(callback?: (err: AWSError, data: WorkSpaces.Types.AssociateWorkspaceApplicationResult) => void): Request<WorkSpaces.Types.AssociateWorkspaceApplicationResult, AWSError>;
  /**
   * Adds one or more rules to the specified IP access control group. This action gives users permission to access their WorkSpaces from the CIDR address ranges specified in the rules.
   */
  authorizeIpRules(params: WorkSpaces.Types.AuthorizeIpRulesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.AuthorizeIpRulesResult) => void): Request<WorkSpaces.Types.AuthorizeIpRulesResult, AWSError>;
  /**
   * Adds one or more rules to the specified IP access control group. This action gives users permission to access their WorkSpaces from the CIDR address ranges specified in the rules.
   */
  authorizeIpRules(callback?: (err: AWSError, data: WorkSpaces.Types.AuthorizeIpRulesResult) => void): Request<WorkSpaces.Types.AuthorizeIpRulesResult, AWSError>;
  /**
   * Copies the specified image from the specified Region to the current Region. For more information about copying images, see  Copy a Custom WorkSpaces Image. In the China (Ningxia) Region, you can copy images only within the same Region. In Amazon Web Services GovCloud (US), to copy images to and from other Regions, contact Amazon Web Services Support.  Before copying a shared image, be sure to verify that it has been shared from the correct Amazon Web Services account. To determine if an image has been shared and to see the ID of the Amazon Web Services account that owns an image, use the DescribeWorkSpaceImages and DescribeWorkspaceImagePermissions API operations.  
   */
  copyWorkspaceImage(params: WorkSpaces.Types.CopyWorkspaceImageRequest, callback?: (err: AWSError, data: WorkSpaces.Types.CopyWorkspaceImageResult) => void): Request<WorkSpaces.Types.CopyWorkspaceImageResult, AWSError>;
  /**
   * Copies the specified image from the specified Region to the current Region. For more information about copying images, see  Copy a Custom WorkSpaces Image. In the China (Ningxia) Region, you can copy images only within the same Region. In Amazon Web Services GovCloud (US), to copy images to and from other Regions, contact Amazon Web Services Support.  Before copying a shared image, be sure to verify that it has been shared from the correct Amazon Web Services account. To determine if an image has been shared and to see the ID of the Amazon Web Services account that owns an image, use the DescribeWorkSpaceImages and DescribeWorkspaceImagePermissions API operations.  
   */
  copyWorkspaceImage(callback?: (err: AWSError, data: WorkSpaces.Types.CopyWorkspaceImageResult) => void): Request<WorkSpaces.Types.CopyWorkspaceImageResult, AWSError>;
  /**
   * Creates a client-add-in for Amazon Connect within a directory. You can create only one Amazon Connect client add-in within a directory. This client add-in allows WorkSpaces users to seamlessly connect to Amazon Connect.
   */
  createConnectClientAddIn(params: WorkSpaces.Types.CreateConnectClientAddInRequest, callback?: (err: AWSError, data: WorkSpaces.Types.CreateConnectClientAddInResult) => void): Request<WorkSpaces.Types.CreateConnectClientAddInResult, AWSError>;
  /**
   * Creates a client-add-in for Amazon Connect within a directory. You can create only one Amazon Connect client add-in within a directory. This client add-in allows WorkSpaces users to seamlessly connect to Amazon Connect.
   */
  createConnectClientAddIn(callback?: (err: AWSError, data: WorkSpaces.Types.CreateConnectClientAddInResult) => void): Request<WorkSpaces.Types.CreateConnectClientAddInResult, AWSError>;
  /**
   * Creates the specified connection alias for use with cross-Region redirection. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.
   */
  createConnectionAlias(params: WorkSpaces.Types.CreateConnectionAliasRequest, callback?: (err: AWSError, data: WorkSpaces.Types.CreateConnectionAliasResult) => void): Request<WorkSpaces.Types.CreateConnectionAliasResult, AWSError>;
  /**
   * Creates the specified connection alias for use with cross-Region redirection. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.
   */
  createConnectionAlias(callback?: (err: AWSError, data: WorkSpaces.Types.CreateConnectionAliasResult) => void): Request<WorkSpaces.Types.CreateConnectionAliasResult, AWSError>;
  /**
   * Creates an IP access control group. An IP access control group provides you with the ability to control the IP addresses from which users are allowed to access their WorkSpaces. To specify the CIDR address ranges, add rules to your IP access control group and then associate the group with your directory. You can add rules when you create the group or at any time using AuthorizeIpRules. There is a default IP access control group associated with your directory. If you don't associate an IP access control group with your directory, the default group is used. The default group includes a default rule that allows users to access their WorkSpaces from anywhere. You cannot modify the default IP access control group for your directory.
   */
  createIpGroup(params: WorkSpaces.Types.CreateIpGroupRequest, callback?: (err: AWSError, data: WorkSpaces.Types.CreateIpGroupResult) => void): Request<WorkSpaces.Types.CreateIpGroupResult, AWSError>;
  /**
   * Creates an IP access control group. An IP access control group provides you with the ability to control the IP addresses from which users are allowed to access their WorkSpaces. To specify the CIDR address ranges, add rules to your IP access control group and then associate the group with your directory. You can add rules when you create the group or at any time using AuthorizeIpRules. There is a default IP access control group associated with your directory. If you don't associate an IP access control group with your directory, the default group is used. The default group includes a default rule that allows users to access their WorkSpaces from anywhere. You cannot modify the default IP access control group for your directory.
   */
  createIpGroup(callback?: (err: AWSError, data: WorkSpaces.Types.CreateIpGroupResult) => void): Request<WorkSpaces.Types.CreateIpGroupResult, AWSError>;
  /**
   * Creates a standby WorkSpace in a secondary Region.
   */
  createStandbyWorkspaces(params: WorkSpaces.Types.CreateStandbyWorkspacesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.CreateStandbyWorkspacesResult) => void): Request<WorkSpaces.Types.CreateStandbyWorkspacesResult, AWSError>;
  /**
   * Creates a standby WorkSpace in a secondary Region.
   */
  createStandbyWorkspaces(callback?: (err: AWSError, data: WorkSpaces.Types.CreateStandbyWorkspacesResult) => void): Request<WorkSpaces.Types.CreateStandbyWorkspacesResult, AWSError>;
  /**
   * Creates the specified tags for the specified WorkSpaces resource.
   */
  createTags(params: WorkSpaces.Types.CreateTagsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.CreateTagsResult) => void): Request<WorkSpaces.Types.CreateTagsResult, AWSError>;
  /**
   * Creates the specified tags for the specified WorkSpaces resource.
   */
  createTags(callback?: (err: AWSError, data: WorkSpaces.Types.CreateTagsResult) => void): Request<WorkSpaces.Types.CreateTagsResult, AWSError>;
  /**
   * Creates a new updated WorkSpace image based on the specified source image. The new updated WorkSpace image has the latest drivers and other updates required by the Amazon WorkSpaces components. To determine which WorkSpace images need to be updated with the latest Amazon WorkSpaces requirements, use  DescribeWorkspaceImages.    Only Windows 10, Windows Server 2016, and Windows Server 2019 WorkSpace images can be programmatically updated at this time.   Microsoft Windows updates and other application updates are not included in the update process.   The source WorkSpace image is not deleted. You can delete the source image after you've verified your new updated image and created a new bundle.    
   */
  createUpdatedWorkspaceImage(params: WorkSpaces.Types.CreateUpdatedWorkspaceImageRequest, callback?: (err: AWSError, data: WorkSpaces.Types.CreateUpdatedWorkspaceImageResult) => void): Request<WorkSpaces.Types.CreateUpdatedWorkspaceImageResult, AWSError>;
  /**
   * Creates a new updated WorkSpace image based on the specified source image. The new updated WorkSpace image has the latest drivers and other updates required by the Amazon WorkSpaces components. To determine which WorkSpace images need to be updated with the latest Amazon WorkSpaces requirements, use  DescribeWorkspaceImages.    Only Windows 10, Windows Server 2016, and Windows Server 2019 WorkSpace images can be programmatically updated at this time.   Microsoft Windows updates and other application updates are not included in the update process.   The source WorkSpace image is not deleted. You can delete the source image after you've verified your new updated image and created a new bundle.    
   */
  createUpdatedWorkspaceImage(callback?: (err: AWSError, data: WorkSpaces.Types.CreateUpdatedWorkspaceImageResult) => void): Request<WorkSpaces.Types.CreateUpdatedWorkspaceImageResult, AWSError>;
  /**
   * Creates the specified WorkSpace bundle. For more information about creating WorkSpace bundles, see  Create a Custom WorkSpaces Image and Bundle.
   */
  createWorkspaceBundle(params: WorkSpaces.Types.CreateWorkspaceBundleRequest, callback?: (err: AWSError, data: WorkSpaces.Types.CreateWorkspaceBundleResult) => void): Request<WorkSpaces.Types.CreateWorkspaceBundleResult, AWSError>;
  /**
   * Creates the specified WorkSpace bundle. For more information about creating WorkSpace bundles, see  Create a Custom WorkSpaces Image and Bundle.
   */
  createWorkspaceBundle(callback?: (err: AWSError, data: WorkSpaces.Types.CreateWorkspaceBundleResult) => void): Request<WorkSpaces.Types.CreateWorkspaceBundleResult, AWSError>;
  /**
   * Creates a new WorkSpace image from an existing WorkSpace.
   */
  createWorkspaceImage(params: WorkSpaces.Types.CreateWorkspaceImageRequest, callback?: (err: AWSError, data: WorkSpaces.Types.CreateWorkspaceImageResult) => void): Request<WorkSpaces.Types.CreateWorkspaceImageResult, AWSError>;
  /**
   * Creates a new WorkSpace image from an existing WorkSpace.
   */
  createWorkspaceImage(callback?: (err: AWSError, data: WorkSpaces.Types.CreateWorkspaceImageResult) => void): Request<WorkSpaces.Types.CreateWorkspaceImageResult, AWSError>;
  /**
   * Creates one or more WorkSpaces. This operation is asynchronous and returns before the WorkSpaces are created.    The MANUAL running mode value is only supported by Amazon WorkSpaces Core. Contact your account team to be allow-listed to use this value. For more information, see Amazon WorkSpaces Core.   PCoIP is only available for Windows bundles.   
   */
  createWorkspaces(params: WorkSpaces.Types.CreateWorkspacesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.CreateWorkspacesResult) => void): Request<WorkSpaces.Types.CreateWorkspacesResult, AWSError>;
  /**
   * Creates one or more WorkSpaces. This operation is asynchronous and returns before the WorkSpaces are created.    The MANUAL running mode value is only supported by Amazon WorkSpaces Core. Contact your account team to be allow-listed to use this value. For more information, see Amazon WorkSpaces Core.   PCoIP is only available for Windows bundles.   
   */
  createWorkspaces(callback?: (err: AWSError, data: WorkSpaces.Types.CreateWorkspacesResult) => void): Request<WorkSpaces.Types.CreateWorkspacesResult, AWSError>;
  /**
   * Deletes customized client branding. Client branding allows you to customize your WorkSpace's client login portal. You can tailor your login portal company logo, the support email address, support link, link to reset password, and a custom message for users trying to sign in. After you delete your customized client branding, your login portal reverts to the default client branding.
   */
  deleteClientBranding(params: WorkSpaces.Types.DeleteClientBrandingRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DeleteClientBrandingResult) => void): Request<WorkSpaces.Types.DeleteClientBrandingResult, AWSError>;
  /**
   * Deletes customized client branding. Client branding allows you to customize your WorkSpace's client login portal. You can tailor your login portal company logo, the support email address, support link, link to reset password, and a custom message for users trying to sign in. After you delete your customized client branding, your login portal reverts to the default client branding.
   */
  deleteClientBranding(callback?: (err: AWSError, data: WorkSpaces.Types.DeleteClientBrandingResult) => void): Request<WorkSpaces.Types.DeleteClientBrandingResult, AWSError>;
  /**
   * Deletes a client-add-in for Amazon Connect that is configured within a directory.
   */
  deleteConnectClientAddIn(params: WorkSpaces.Types.DeleteConnectClientAddInRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DeleteConnectClientAddInResult) => void): Request<WorkSpaces.Types.DeleteConnectClientAddInResult, AWSError>;
  /**
   * Deletes a client-add-in for Amazon Connect that is configured within a directory.
   */
  deleteConnectClientAddIn(callback?: (err: AWSError, data: WorkSpaces.Types.DeleteConnectClientAddInResult) => void): Request<WorkSpaces.Types.DeleteConnectClientAddInResult, AWSError>;
  /**
   * Deletes the specified connection alias. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.   If you will no longer be using a fully qualified domain name (FQDN) as the registration code for your WorkSpaces users, you must take certain precautions to prevent potential security issues. For more information, see  Security Considerations if You Stop Using Cross-Region Redirection.   To delete a connection alias that has been shared, the shared account must first disassociate the connection alias from any directories it has been associated with. Then you must unshare the connection alias from the account it has been shared with. You can delete a connection alias only after it is no longer shared with any accounts or associated with any directories. 
   */
  deleteConnectionAlias(params: WorkSpaces.Types.DeleteConnectionAliasRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DeleteConnectionAliasResult) => void): Request<WorkSpaces.Types.DeleteConnectionAliasResult, AWSError>;
  /**
   * Deletes the specified connection alias. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.   If you will no longer be using a fully qualified domain name (FQDN) as the registration code for your WorkSpaces users, you must take certain precautions to prevent potential security issues. For more information, see  Security Considerations if You Stop Using Cross-Region Redirection.   To delete a connection alias that has been shared, the shared account must first disassociate the connection alias from any directories it has been associated with. Then you must unshare the connection alias from the account it has been shared with. You can delete a connection alias only after it is no longer shared with any accounts or associated with any directories. 
   */
  deleteConnectionAlias(callback?: (err: AWSError, data: WorkSpaces.Types.DeleteConnectionAliasResult) => void): Request<WorkSpaces.Types.DeleteConnectionAliasResult, AWSError>;
  /**
   * Deletes the specified IP access control group. You cannot delete an IP access control group that is associated with a directory.
   */
  deleteIpGroup(params: WorkSpaces.Types.DeleteIpGroupRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DeleteIpGroupResult) => void): Request<WorkSpaces.Types.DeleteIpGroupResult, AWSError>;
  /**
   * Deletes the specified IP access control group. You cannot delete an IP access control group that is associated with a directory.
   */
  deleteIpGroup(callback?: (err: AWSError, data: WorkSpaces.Types.DeleteIpGroupResult) => void): Request<WorkSpaces.Types.DeleteIpGroupResult, AWSError>;
  /**
   * Deletes the specified tags from the specified WorkSpaces resource.
   */
  deleteTags(params: WorkSpaces.Types.DeleteTagsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DeleteTagsResult) => void): Request<WorkSpaces.Types.DeleteTagsResult, AWSError>;
  /**
   * Deletes the specified tags from the specified WorkSpaces resource.
   */
  deleteTags(callback?: (err: AWSError, data: WorkSpaces.Types.DeleteTagsResult) => void): Request<WorkSpaces.Types.DeleteTagsResult, AWSError>;
  /**
   * Deletes the specified WorkSpace bundle. For more information about deleting WorkSpace bundles, see  Delete a Custom WorkSpaces Bundle or Image.
   */
  deleteWorkspaceBundle(params: WorkSpaces.Types.DeleteWorkspaceBundleRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DeleteWorkspaceBundleResult) => void): Request<WorkSpaces.Types.DeleteWorkspaceBundleResult, AWSError>;
  /**
   * Deletes the specified WorkSpace bundle. For more information about deleting WorkSpace bundles, see  Delete a Custom WorkSpaces Bundle or Image.
   */
  deleteWorkspaceBundle(callback?: (err: AWSError, data: WorkSpaces.Types.DeleteWorkspaceBundleResult) => void): Request<WorkSpaces.Types.DeleteWorkspaceBundleResult, AWSError>;
  /**
   * Deletes the specified image from your account. To delete an image, you must first delete any bundles that are associated with the image and unshare the image if it is shared with other accounts. 
   */
  deleteWorkspaceImage(params: WorkSpaces.Types.DeleteWorkspaceImageRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DeleteWorkspaceImageResult) => void): Request<WorkSpaces.Types.DeleteWorkspaceImageResult, AWSError>;
  /**
   * Deletes the specified image from your account. To delete an image, you must first delete any bundles that are associated with the image and unshare the image if it is shared with other accounts. 
   */
  deleteWorkspaceImage(callback?: (err: AWSError, data: WorkSpaces.Types.DeleteWorkspaceImageResult) => void): Request<WorkSpaces.Types.DeleteWorkspaceImageResult, AWSError>;
  /**
   * Deploys associated applications to the specified WorkSpace
   */
  deployWorkspaceApplications(params: WorkSpaces.Types.DeployWorkspaceApplicationsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DeployWorkspaceApplicationsResult) => void): Request<WorkSpaces.Types.DeployWorkspaceApplicationsResult, AWSError>;
  /**
   * Deploys associated applications to the specified WorkSpace
   */
  deployWorkspaceApplications(callback?: (err: AWSError, data: WorkSpaces.Types.DeployWorkspaceApplicationsResult) => void): Request<WorkSpaces.Types.DeployWorkspaceApplicationsResult, AWSError>;
  /**
   * Deregisters the specified directory. This operation is asynchronous and returns before the WorkSpace directory is deregistered. If any WorkSpaces are registered to this directory, you must remove them before you can deregister the directory.  Simple AD and AD Connector are made available to you free of charge to use with WorkSpaces. If there are no WorkSpaces being used with your Simple AD or AD Connector directory for 30 consecutive days, this directory will be automatically deregistered for use with Amazon WorkSpaces, and you will be charged for this directory as per the Directory Service pricing terms. To delete empty directories, see  Delete the Directory for Your WorkSpaces. If you delete your Simple AD or AD Connector directory, you can always create a new one when you want to start using WorkSpaces again. 
   */
  deregisterWorkspaceDirectory(params: WorkSpaces.Types.DeregisterWorkspaceDirectoryRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DeregisterWorkspaceDirectoryResult) => void): Request<WorkSpaces.Types.DeregisterWorkspaceDirectoryResult, AWSError>;
  /**
   * Deregisters the specified directory. This operation is asynchronous and returns before the WorkSpace directory is deregistered. If any WorkSpaces are registered to this directory, you must remove them before you can deregister the directory.  Simple AD and AD Connector are made available to you free of charge to use with WorkSpaces. If there are no WorkSpaces being used with your Simple AD or AD Connector directory for 30 consecutive days, this directory will be automatically deregistered for use with Amazon WorkSpaces, and you will be charged for this directory as per the Directory Service pricing terms. To delete empty directories, see  Delete the Directory for Your WorkSpaces. If you delete your Simple AD or AD Connector directory, you can always create a new one when you want to start using WorkSpaces again. 
   */
  deregisterWorkspaceDirectory(callback?: (err: AWSError, data: WorkSpaces.Types.DeregisterWorkspaceDirectoryResult) => void): Request<WorkSpaces.Types.DeregisterWorkspaceDirectoryResult, AWSError>;
  /**
   * Retrieves a list that describes the configuration of Bring Your Own License (BYOL) for the specified account.
   */
  describeAccount(params: WorkSpaces.Types.DescribeAccountRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeAccountResult) => void): Request<WorkSpaces.Types.DescribeAccountResult, AWSError>;
  /**
   * Retrieves a list that describes the configuration of Bring Your Own License (BYOL) for the specified account.
   */
  describeAccount(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeAccountResult) => void): Request<WorkSpaces.Types.DescribeAccountResult, AWSError>;
  /**
   * Retrieves a list that describes modifications to the configuration of Bring Your Own License (BYOL) for the specified account.
   */
  describeAccountModifications(params: WorkSpaces.Types.DescribeAccountModificationsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeAccountModificationsResult) => void): Request<WorkSpaces.Types.DescribeAccountModificationsResult, AWSError>;
  /**
   * Retrieves a list that describes modifications to the configuration of Bring Your Own License (BYOL) for the specified account.
   */
  describeAccountModifications(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeAccountModificationsResult) => void): Request<WorkSpaces.Types.DescribeAccountModificationsResult, AWSError>;
  /**
   * Describes the associations between the application and the specified associated resources.
   */
  describeApplicationAssociations(params: WorkSpaces.Types.DescribeApplicationAssociationsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeApplicationAssociationsResult) => void): Request<WorkSpaces.Types.DescribeApplicationAssociationsResult, AWSError>;
  /**
   * Describes the associations between the application and the specified associated resources.
   */
  describeApplicationAssociations(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeApplicationAssociationsResult) => void): Request<WorkSpaces.Types.DescribeApplicationAssociationsResult, AWSError>;
  /**
   * Describes the specified applications by filtering based on their compute types, license availability, operating systems, and owners.
   */
  describeApplications(params: WorkSpaces.Types.DescribeApplicationsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeApplicationsResult) => void): Request<WorkSpaces.Types.DescribeApplicationsResult, AWSError>;
  /**
   * Describes the specified applications by filtering based on their compute types, license availability, operating systems, and owners.
   */
  describeApplications(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeApplicationsResult) => void): Request<WorkSpaces.Types.DescribeApplicationsResult, AWSError>;
  /**
   * Describes the associations between the applications and the specified bundle.
   */
  describeBundleAssociations(params: WorkSpaces.Types.DescribeBundleAssociationsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeBundleAssociationsResult) => void): Request<WorkSpaces.Types.DescribeBundleAssociationsResult, AWSError>;
  /**
   * Describes the associations between the applications and the specified bundle.
   */
  describeBundleAssociations(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeBundleAssociationsResult) => void): Request<WorkSpaces.Types.DescribeBundleAssociationsResult, AWSError>;
  /**
   * Describes the specified client branding. Client branding allows you to customize the log in page of various device types for your users. You can add your company logo, the support email address, support link, link to reset password, and a custom message for users trying to sign in.  Only device types that have branding information configured will be shown in the response. 
   */
  describeClientBranding(params: WorkSpaces.Types.DescribeClientBrandingRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeClientBrandingResult) => void): Request<WorkSpaces.Types.DescribeClientBrandingResult, AWSError>;
  /**
   * Describes the specified client branding. Client branding allows you to customize the log in page of various device types for your users. You can add your company logo, the support email address, support link, link to reset password, and a custom message for users trying to sign in.  Only device types that have branding information configured will be shown in the response. 
   */
  describeClientBranding(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeClientBrandingResult) => void): Request<WorkSpaces.Types.DescribeClientBrandingResult, AWSError>;
  /**
   * Retrieves a list that describes one or more specified Amazon WorkSpaces clients.
   */
  describeClientProperties(params: WorkSpaces.Types.DescribeClientPropertiesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeClientPropertiesResult) => void): Request<WorkSpaces.Types.DescribeClientPropertiesResult, AWSError>;
  /**
   * Retrieves a list that describes one or more specified Amazon WorkSpaces clients.
   */
  describeClientProperties(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeClientPropertiesResult) => void): Request<WorkSpaces.Types.DescribeClientPropertiesResult, AWSError>;
  /**
   * Retrieves a list of Amazon Connect client add-ins that have been created.
   */
  describeConnectClientAddIns(params: WorkSpaces.Types.DescribeConnectClientAddInsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeConnectClientAddInsResult) => void): Request<WorkSpaces.Types.DescribeConnectClientAddInsResult, AWSError>;
  /**
   * Retrieves a list of Amazon Connect client add-ins that have been created.
   */
  describeConnectClientAddIns(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeConnectClientAddInsResult) => void): Request<WorkSpaces.Types.DescribeConnectClientAddInsResult, AWSError>;
  /**
   * Describes the permissions that the owner of a connection alias has granted to another Amazon Web Services account for the specified connection alias. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.
   */
  describeConnectionAliasPermissions(params: WorkSpaces.Types.DescribeConnectionAliasPermissionsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeConnectionAliasPermissionsResult) => void): Request<WorkSpaces.Types.DescribeConnectionAliasPermissionsResult, AWSError>;
  /**
   * Describes the permissions that the owner of a connection alias has granted to another Amazon Web Services account for the specified connection alias. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.
   */
  describeConnectionAliasPermissions(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeConnectionAliasPermissionsResult) => void): Request<WorkSpaces.Types.DescribeConnectionAliasPermissionsResult, AWSError>;
  /**
   * Retrieves a list that describes the connection aliases used for cross-Region redirection. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.
   */
  describeConnectionAliases(params: WorkSpaces.Types.DescribeConnectionAliasesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeConnectionAliasesResult) => void): Request<WorkSpaces.Types.DescribeConnectionAliasesResult, AWSError>;
  /**
   * Retrieves a list that describes the connection aliases used for cross-Region redirection. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.
   */
  describeConnectionAliases(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeConnectionAliasesResult) => void): Request<WorkSpaces.Types.DescribeConnectionAliasesResult, AWSError>;
  /**
   * Describes the associations between the applications and the specified image.
   */
  describeImageAssociations(params: WorkSpaces.Types.DescribeImageAssociationsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeImageAssociationsResult) => void): Request<WorkSpaces.Types.DescribeImageAssociationsResult, AWSError>;
  /**
   * Describes the associations between the applications and the specified image.
   */
  describeImageAssociations(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeImageAssociationsResult) => void): Request<WorkSpaces.Types.DescribeImageAssociationsResult, AWSError>;
  /**
   * Describes one or more of your IP access control groups.
   */
  describeIpGroups(params: WorkSpaces.Types.DescribeIpGroupsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeIpGroupsResult) => void): Request<WorkSpaces.Types.DescribeIpGroupsResult, AWSError>;
  /**
   * Describes one or more of your IP access control groups.
   */
  describeIpGroups(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeIpGroupsResult) => void): Request<WorkSpaces.Types.DescribeIpGroupsResult, AWSError>;
  /**
   * Describes the specified tags for the specified WorkSpaces resource.
   */
  describeTags(params: WorkSpaces.Types.DescribeTagsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeTagsResult) => void): Request<WorkSpaces.Types.DescribeTagsResult, AWSError>;
  /**
   * Describes the specified tags for the specified WorkSpaces resource.
   */
  describeTags(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeTagsResult) => void): Request<WorkSpaces.Types.DescribeTagsResult, AWSError>;
  /**
   * Describes the associations betweens applications and the specified WorkSpace.
   */
  describeWorkspaceAssociations(params: WorkSpaces.Types.DescribeWorkspaceAssociationsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceAssociationsResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceAssociationsResult, AWSError>;
  /**
   * Describes the associations betweens applications and the specified WorkSpace.
   */
  describeWorkspaceAssociations(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceAssociationsResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceAssociationsResult, AWSError>;
  /**
   * Retrieves a list that describes the available WorkSpace bundles. You can filter the results using either bundle ID or owner, but not both.
   */
  describeWorkspaceBundles(params: WorkSpaces.Types.DescribeWorkspaceBundlesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceBundlesResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceBundlesResult, AWSError>;
  /**
   * Retrieves a list that describes the available WorkSpace bundles. You can filter the results using either bundle ID or owner, but not both.
   */
  describeWorkspaceBundles(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceBundlesResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceBundlesResult, AWSError>;
  /**
   * Describes the available directories that are registered with Amazon WorkSpaces.
   */
  describeWorkspaceDirectories(params: WorkSpaces.Types.DescribeWorkspaceDirectoriesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceDirectoriesResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceDirectoriesResult, AWSError>;
  /**
   * Describes the available directories that are registered with Amazon WorkSpaces.
   */
  describeWorkspaceDirectories(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceDirectoriesResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceDirectoriesResult, AWSError>;
  /**
   * Describes the permissions that the owner of an image has granted to other Amazon Web Services accounts for an image.
   */
  describeWorkspaceImagePermissions(params: WorkSpaces.Types.DescribeWorkspaceImagePermissionsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceImagePermissionsResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceImagePermissionsResult, AWSError>;
  /**
   * Describes the permissions that the owner of an image has granted to other Amazon Web Services accounts for an image.
   */
  describeWorkspaceImagePermissions(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceImagePermissionsResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceImagePermissionsResult, AWSError>;
  /**
   * Retrieves a list that describes one or more specified images, if the image identifiers are provided. Otherwise, all images in the account are described. 
   */
  describeWorkspaceImages(params: WorkSpaces.Types.DescribeWorkspaceImagesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceImagesResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceImagesResult, AWSError>;
  /**
   * Retrieves a list that describes one or more specified images, if the image identifiers are provided. Otherwise, all images in the account are described. 
   */
  describeWorkspaceImages(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceImagesResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceImagesResult, AWSError>;
  /**
   * Describes the snapshots for the specified WorkSpace.
   */
  describeWorkspaceSnapshots(params: WorkSpaces.Types.DescribeWorkspaceSnapshotsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceSnapshotsResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceSnapshotsResult, AWSError>;
  /**
   * Describes the snapshots for the specified WorkSpace.
   */
  describeWorkspaceSnapshots(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspaceSnapshotsResult) => void): Request<WorkSpaces.Types.DescribeWorkspaceSnapshotsResult, AWSError>;
  /**
   * Describes the specified WorkSpaces. You can filter the results by using the bundle identifier, directory identifier, or owner, but you can specify only one filter at a time.
   */
  describeWorkspaces(params: WorkSpaces.Types.DescribeWorkspacesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspacesResult) => void): Request<WorkSpaces.Types.DescribeWorkspacesResult, AWSError>;
  /**
   * Describes the specified WorkSpaces. You can filter the results by using the bundle identifier, directory identifier, or owner, but you can specify only one filter at a time.
   */
  describeWorkspaces(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspacesResult) => void): Request<WorkSpaces.Types.DescribeWorkspacesResult, AWSError>;
  /**
   * Describes the connection status of the specified WorkSpaces.
   */
  describeWorkspacesConnectionStatus(params: WorkSpaces.Types.DescribeWorkspacesConnectionStatusRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspacesConnectionStatusResult) => void): Request<WorkSpaces.Types.DescribeWorkspacesConnectionStatusResult, AWSError>;
  /**
   * Describes the connection status of the specified WorkSpaces.
   */
  describeWorkspacesConnectionStatus(callback?: (err: AWSError, data: WorkSpaces.Types.DescribeWorkspacesConnectionStatusResult) => void): Request<WorkSpaces.Types.DescribeWorkspacesConnectionStatusResult, AWSError>;
  /**
   * Disassociates a connection alias from a directory. Disassociating a connection alias disables cross-Region redirection between two directories in different Regions. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.  Before performing this operation, call  DescribeConnectionAliases to make sure that the current state of the connection alias is CREATED. 
   */
  disassociateConnectionAlias(params: WorkSpaces.Types.DisassociateConnectionAliasRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DisassociateConnectionAliasResult) => void): Request<WorkSpaces.Types.DisassociateConnectionAliasResult, AWSError>;
  /**
   * Disassociates a connection alias from a directory. Disassociating a connection alias disables cross-Region redirection between two directories in different Regions. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.  Before performing this operation, call  DescribeConnectionAliases to make sure that the current state of the connection alias is CREATED. 
   */
  disassociateConnectionAlias(callback?: (err: AWSError, data: WorkSpaces.Types.DisassociateConnectionAliasResult) => void): Request<WorkSpaces.Types.DisassociateConnectionAliasResult, AWSError>;
  /**
   * Disassociates the specified IP access control group from the specified directory.
   */
  disassociateIpGroups(params: WorkSpaces.Types.DisassociateIpGroupsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DisassociateIpGroupsResult) => void): Request<WorkSpaces.Types.DisassociateIpGroupsResult, AWSError>;
  /**
   * Disassociates the specified IP access control group from the specified directory.
   */
  disassociateIpGroups(callback?: (err: AWSError, data: WorkSpaces.Types.DisassociateIpGroupsResult) => void): Request<WorkSpaces.Types.DisassociateIpGroupsResult, AWSError>;
  /**
   * Disassociates the specified application from a WorkSpace.
   */
  disassociateWorkspaceApplication(params: WorkSpaces.Types.DisassociateWorkspaceApplicationRequest, callback?: (err: AWSError, data: WorkSpaces.Types.DisassociateWorkspaceApplicationResult) => void): Request<WorkSpaces.Types.DisassociateWorkspaceApplicationResult, AWSError>;
  /**
   * Disassociates the specified application from a WorkSpace.
   */
  disassociateWorkspaceApplication(callback?: (err: AWSError, data: WorkSpaces.Types.DisassociateWorkspaceApplicationResult) => void): Request<WorkSpaces.Types.DisassociateWorkspaceApplicationResult, AWSError>;
  /**
   * Imports client branding. Client branding allows you to customize your WorkSpace's client login portal. You can tailor your login portal company logo, the support email address, support link, link to reset password, and a custom message for users trying to sign in. After you import client branding, the default branding experience for the specified platform type is replaced with the imported experience    You must specify at least one platform type when importing client branding.   You can import up to 6 MB of data with each request. If your request exceeds this limit, you can import client branding for different platform types using separate requests.   In each platform type, the SupportEmail and SupportLink parameters are mutually exclusive. You can specify only one parameter for each platform type, but not both.   Imported data can take up to a minute to appear in the WorkSpaces client.   
   */
  importClientBranding(params: WorkSpaces.Types.ImportClientBrandingRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ImportClientBrandingResult) => void): Request<WorkSpaces.Types.ImportClientBrandingResult, AWSError>;
  /**
   * Imports client branding. Client branding allows you to customize your WorkSpace's client login portal. You can tailor your login portal company logo, the support email address, support link, link to reset password, and a custom message for users trying to sign in. After you import client branding, the default branding experience for the specified platform type is replaced with the imported experience    You must specify at least one platform type when importing client branding.   You can import up to 6 MB of data with each request. If your request exceeds this limit, you can import client branding for different platform types using separate requests.   In each platform type, the SupportEmail and SupportLink parameters are mutually exclusive. You can specify only one parameter for each platform type, but not both.   Imported data can take up to a minute to appear in the WorkSpaces client.   
   */
  importClientBranding(callback?: (err: AWSError, data: WorkSpaces.Types.ImportClientBrandingResult) => void): Request<WorkSpaces.Types.ImportClientBrandingResult, AWSError>;
  /**
   * Imports the specified Windows 10 or 11 Bring Your Own License (BYOL) image into Amazon WorkSpaces. The image must be an already licensed Amazon EC2 image that is in your Amazon Web Services account, and you must own the image. For more information about creating BYOL images, see  Bring Your Own Windows Desktop Licenses.
   */
  importWorkspaceImage(params: WorkSpaces.Types.ImportWorkspaceImageRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ImportWorkspaceImageResult) => void): Request<WorkSpaces.Types.ImportWorkspaceImageResult, AWSError>;
  /**
   * Imports the specified Windows 10 or 11 Bring Your Own License (BYOL) image into Amazon WorkSpaces. The image must be an already licensed Amazon EC2 image that is in your Amazon Web Services account, and you must own the image. For more information about creating BYOL images, see  Bring Your Own Windows Desktop Licenses.
   */
  importWorkspaceImage(callback?: (err: AWSError, data: WorkSpaces.Types.ImportWorkspaceImageResult) => void): Request<WorkSpaces.Types.ImportWorkspaceImageResult, AWSError>;
  /**
   * Retrieves a list of IP address ranges, specified as IPv4 CIDR blocks, that you can use for the network management interface when you enable Bring Your Own License (BYOL).  This operation can be run only by Amazon Web Services accounts that are enabled for BYOL. If your account isn't enabled for BYOL, you'll receive an AccessDeniedException error. The management network interface is connected to a secure Amazon WorkSpaces management network. It is used for interactive streaming of the WorkSpace desktop to Amazon WorkSpaces clients, and to allow Amazon WorkSpaces to manage the WorkSpace.
   */
  listAvailableManagementCidrRanges(params: WorkSpaces.Types.ListAvailableManagementCidrRangesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ListAvailableManagementCidrRangesResult) => void): Request<WorkSpaces.Types.ListAvailableManagementCidrRangesResult, AWSError>;
  /**
   * Retrieves a list of IP address ranges, specified as IPv4 CIDR blocks, that you can use for the network management interface when you enable Bring Your Own License (BYOL).  This operation can be run only by Amazon Web Services accounts that are enabled for BYOL. If your account isn't enabled for BYOL, you'll receive an AccessDeniedException error. The management network interface is connected to a secure Amazon WorkSpaces management network. It is used for interactive streaming of the WorkSpace desktop to Amazon WorkSpaces clients, and to allow Amazon WorkSpaces to manage the WorkSpace.
   */
  listAvailableManagementCidrRanges(callback?: (err: AWSError, data: WorkSpaces.Types.ListAvailableManagementCidrRangesResult) => void): Request<WorkSpaces.Types.ListAvailableManagementCidrRangesResult, AWSError>;
  /**
   * Migrates a WorkSpace from one operating system or bundle type to another, while retaining the data on the user volume. The migration process recreates the WorkSpace by using a new root volume from the target bundle image and the user volume from the last available snapshot of the original WorkSpace. During migration, the original D:\Users\%USERNAME% user profile folder is renamed to D:\Users\%USERNAME%MMddyyTHHmmss%.NotMigrated. A new D:\Users\%USERNAME%\ folder is generated by the new OS. Certain files in the old user profile are moved to the new user profile. For available migration scenarios, details about what happens during migration, and best practices, see Migrate a WorkSpace.
   */
  migrateWorkspace(params: WorkSpaces.Types.MigrateWorkspaceRequest, callback?: (err: AWSError, data: WorkSpaces.Types.MigrateWorkspaceResult) => void): Request<WorkSpaces.Types.MigrateWorkspaceResult, AWSError>;
  /**
   * Migrates a WorkSpace from one operating system or bundle type to another, while retaining the data on the user volume. The migration process recreates the WorkSpace by using a new root volume from the target bundle image and the user volume from the last available snapshot of the original WorkSpace. During migration, the original D:\Users\%USERNAME% user profile folder is renamed to D:\Users\%USERNAME%MMddyyTHHmmss%.NotMigrated. A new D:\Users\%USERNAME%\ folder is generated by the new OS. Certain files in the old user profile are moved to the new user profile. For available migration scenarios, details about what happens during migration, and best practices, see Migrate a WorkSpace.
   */
  migrateWorkspace(callback?: (err: AWSError, data: WorkSpaces.Types.MigrateWorkspaceResult) => void): Request<WorkSpaces.Types.MigrateWorkspaceResult, AWSError>;
  /**
   * Modifies the configuration of Bring Your Own License (BYOL) for the specified account.
   */
  modifyAccount(params: WorkSpaces.Types.ModifyAccountRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ModifyAccountResult) => void): Request<WorkSpaces.Types.ModifyAccountResult, AWSError>;
  /**
   * Modifies the configuration of Bring Your Own License (BYOL) for the specified account.
   */
  modifyAccount(callback?: (err: AWSError, data: WorkSpaces.Types.ModifyAccountResult) => void): Request<WorkSpaces.Types.ModifyAccountResult, AWSError>;
  /**
   * Modifies the properties of the certificate-based authentication you want to use with your WorkSpaces.
   */
  modifyCertificateBasedAuthProperties(params: WorkSpaces.Types.ModifyCertificateBasedAuthPropertiesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ModifyCertificateBasedAuthPropertiesResult) => void): Request<WorkSpaces.Types.ModifyCertificateBasedAuthPropertiesResult, AWSError>;
  /**
   * Modifies the properties of the certificate-based authentication you want to use with your WorkSpaces.
   */
  modifyCertificateBasedAuthProperties(callback?: (err: AWSError, data: WorkSpaces.Types.ModifyCertificateBasedAuthPropertiesResult) => void): Request<WorkSpaces.Types.ModifyCertificateBasedAuthPropertiesResult, AWSError>;
  /**
   * Modifies the properties of the specified Amazon WorkSpaces clients.
   */
  modifyClientProperties(params: WorkSpaces.Types.ModifyClientPropertiesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ModifyClientPropertiesResult) => void): Request<WorkSpaces.Types.ModifyClientPropertiesResult, AWSError>;
  /**
   * Modifies the properties of the specified Amazon WorkSpaces clients.
   */
  modifyClientProperties(callback?: (err: AWSError, data: WorkSpaces.Types.ModifyClientPropertiesResult) => void): Request<WorkSpaces.Types.ModifyClientPropertiesResult, AWSError>;
  /**
   * Modifies multiple properties related to SAML 2.0 authentication, including the enablement status, user access URL, and relay state parameter name that are used for configuring federation with an SAML 2.0 identity provider.
   */
  modifySamlProperties(params: WorkSpaces.Types.ModifySamlPropertiesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ModifySamlPropertiesResult) => void): Request<WorkSpaces.Types.ModifySamlPropertiesResult, AWSError>;
  /**
   * Modifies multiple properties related to SAML 2.0 authentication, including the enablement status, user access URL, and relay state parameter name that are used for configuring federation with an SAML 2.0 identity provider.
   */
  modifySamlProperties(callback?: (err: AWSError, data: WorkSpaces.Types.ModifySamlPropertiesResult) => void): Request<WorkSpaces.Types.ModifySamlPropertiesResult, AWSError>;
  /**
   * Modifies the self-service WorkSpace management capabilities for your users. For more information, see Enable Self-Service WorkSpace Management Capabilities for Your Users.
   */
  modifySelfservicePermissions(params: WorkSpaces.Types.ModifySelfservicePermissionsRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ModifySelfservicePermissionsResult) => void): Request<WorkSpaces.Types.ModifySelfservicePermissionsResult, AWSError>;
  /**
   * Modifies the self-service WorkSpace management capabilities for your users. For more information, see Enable Self-Service WorkSpace Management Capabilities for Your Users.
   */
  modifySelfservicePermissions(callback?: (err: AWSError, data: WorkSpaces.Types.ModifySelfservicePermissionsResult) => void): Request<WorkSpaces.Types.ModifySelfservicePermissionsResult, AWSError>;
  /**
   * Specifies which devices and operating systems users can use to access their WorkSpaces. For more information, see  Control Device Access.
   */
  modifyWorkspaceAccessProperties(params: WorkSpaces.Types.ModifyWorkspaceAccessPropertiesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ModifyWorkspaceAccessPropertiesResult) => void): Request<WorkSpaces.Types.ModifyWorkspaceAccessPropertiesResult, AWSError>;
  /**
   * Specifies which devices and operating systems users can use to access their WorkSpaces. For more information, see  Control Device Access.
   */
  modifyWorkspaceAccessProperties(callback?: (err: AWSError, data: WorkSpaces.Types.ModifyWorkspaceAccessPropertiesResult) => void): Request<WorkSpaces.Types.ModifyWorkspaceAccessPropertiesResult, AWSError>;
  /**
   * Modify the default properties used to create WorkSpaces.
   */
  modifyWorkspaceCreationProperties(params: WorkSpaces.Types.ModifyWorkspaceCreationPropertiesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ModifyWorkspaceCreationPropertiesResult) => void): Request<WorkSpaces.Types.ModifyWorkspaceCreationPropertiesResult, AWSError>;
  /**
   * Modify the default properties used to create WorkSpaces.
   */
  modifyWorkspaceCreationProperties(callback?: (err: AWSError, data: WorkSpaces.Types.ModifyWorkspaceCreationPropertiesResult) => void): Request<WorkSpaces.Types.ModifyWorkspaceCreationPropertiesResult, AWSError>;
  /**
   * Modifies the specified WorkSpace properties. For important information about how to modify the size of the root and user volumes, see  Modify a WorkSpace.   The MANUAL running mode value is only supported by Amazon WorkSpaces Core. Contact your account team to be allow-listed to use this value. For more information, see Amazon WorkSpaces Core. 
   */
  modifyWorkspaceProperties(params: WorkSpaces.Types.ModifyWorkspacePropertiesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ModifyWorkspacePropertiesResult) => void): Request<WorkSpaces.Types.ModifyWorkspacePropertiesResult, AWSError>;
  /**
   * Modifies the specified WorkSpace properties. For important information about how to modify the size of the root and user volumes, see  Modify a WorkSpace.   The MANUAL running mode value is only supported by Amazon WorkSpaces Core. Contact your account team to be allow-listed to use this value. For more information, see Amazon WorkSpaces Core. 
   */
  modifyWorkspaceProperties(callback?: (err: AWSError, data: WorkSpaces.Types.ModifyWorkspacePropertiesResult) => void): Request<WorkSpaces.Types.ModifyWorkspacePropertiesResult, AWSError>;
  /**
   * Sets the state of the specified WorkSpace. To maintain a WorkSpace without being interrupted, set the WorkSpace state to ADMIN_MAINTENANCE. WorkSpaces in this state do not respond to requests to reboot, stop, start, rebuild, or restore. An AutoStop WorkSpace in this state is not stopped. Users cannot log into a WorkSpace in the ADMIN_MAINTENANCE state.
   */
  modifyWorkspaceState(params: WorkSpaces.Types.ModifyWorkspaceStateRequest, callback?: (err: AWSError, data: WorkSpaces.Types.ModifyWorkspaceStateResult) => void): Request<WorkSpaces.Types.ModifyWorkspaceStateResult, AWSError>;
  /**
   * Sets the state of the specified WorkSpace. To maintain a WorkSpace without being interrupted, set the WorkSpace state to ADMIN_MAINTENANCE. WorkSpaces in this state do not respond to requests to reboot, stop, start, rebuild, or restore. An AutoStop WorkSpace in this state is not stopped. Users cannot log into a WorkSpace in the ADMIN_MAINTENANCE state.
   */
  modifyWorkspaceState(callback?: (err: AWSError, data: WorkSpaces.Types.ModifyWorkspaceStateResult) => void): Request<WorkSpaces.Types.ModifyWorkspaceStateResult, AWSError>;
  /**
   * Reboots the specified WorkSpaces. You cannot reboot a WorkSpace unless its state is AVAILABLE or UNHEALTHY. This operation is asynchronous and returns before the WorkSpaces have rebooted.
   */
  rebootWorkspaces(params: WorkSpaces.Types.RebootWorkspacesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.RebootWorkspacesResult) => void): Request<WorkSpaces.Types.RebootWorkspacesResult, AWSError>;
  /**
   * Reboots the specified WorkSpaces. You cannot reboot a WorkSpace unless its state is AVAILABLE or UNHEALTHY. This operation is asynchronous and returns before the WorkSpaces have rebooted.
   */
  rebootWorkspaces(callback?: (err: AWSError, data: WorkSpaces.Types.RebootWorkspacesResult) => void): Request<WorkSpaces.Types.RebootWorkspacesResult, AWSError>;
  /**
   * Rebuilds the specified WorkSpace. You cannot rebuild a WorkSpace unless its state is AVAILABLE, ERROR, UNHEALTHY, STOPPED, or REBOOTING. Rebuilding a WorkSpace is a potentially destructive action that can result in the loss of data. For more information, see Rebuild a WorkSpace. This operation is asynchronous and returns before the WorkSpaces have been completely rebuilt.
   */
  rebuildWorkspaces(params: WorkSpaces.Types.RebuildWorkspacesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.RebuildWorkspacesResult) => void): Request<WorkSpaces.Types.RebuildWorkspacesResult, AWSError>;
  /**
   * Rebuilds the specified WorkSpace. You cannot rebuild a WorkSpace unless its state is AVAILABLE, ERROR, UNHEALTHY, STOPPED, or REBOOTING. Rebuilding a WorkSpace is a potentially destructive action that can result in the loss of data. For more information, see Rebuild a WorkSpace. This operation is asynchronous and returns before the WorkSpaces have been completely rebuilt.
   */
  rebuildWorkspaces(callback?: (err: AWSError, data: WorkSpaces.Types.RebuildWorkspacesResult) => void): Request<WorkSpaces.Types.RebuildWorkspacesResult, AWSError>;
  /**
   * Registers the specified directory. This operation is asynchronous and returns before the WorkSpace directory is registered. If this is the first time you are registering a directory, you will need to create the workspaces_DefaultRole role before you can register a directory. For more information, see  Creating the workspaces_DefaultRole Role.
   */
  registerWorkspaceDirectory(params: WorkSpaces.Types.RegisterWorkspaceDirectoryRequest, callback?: (err: AWSError, data: WorkSpaces.Types.RegisterWorkspaceDirectoryResult) => void): Request<WorkSpaces.Types.RegisterWorkspaceDirectoryResult, AWSError>;
  /**
   * Registers the specified directory. This operation is asynchronous and returns before the WorkSpace directory is registered. If this is the first time you are registering a directory, you will need to create the workspaces_DefaultRole role before you can register a directory. For more information, see  Creating the workspaces_DefaultRole Role.
   */
  registerWorkspaceDirectory(callback?: (err: AWSError, data: WorkSpaces.Types.RegisterWorkspaceDirectoryResult) => void): Request<WorkSpaces.Types.RegisterWorkspaceDirectoryResult, AWSError>;
  /**
   * Restores the specified WorkSpace to its last known healthy state. You cannot restore a WorkSpace unless its state is  AVAILABLE, ERROR, UNHEALTHY, or STOPPED. Restoring a WorkSpace is a potentially destructive action that can result in the loss of data. For more information, see Restore a WorkSpace. This operation is asynchronous and returns before the WorkSpace is completely restored.
   */
  restoreWorkspace(params: WorkSpaces.Types.RestoreWorkspaceRequest, callback?: (err: AWSError, data: WorkSpaces.Types.RestoreWorkspaceResult) => void): Request<WorkSpaces.Types.RestoreWorkspaceResult, AWSError>;
  /**
   * Restores the specified WorkSpace to its last known healthy state. You cannot restore a WorkSpace unless its state is  AVAILABLE, ERROR, UNHEALTHY, or STOPPED. Restoring a WorkSpace is a potentially destructive action that can result in the loss of data. For more information, see Restore a WorkSpace. This operation is asynchronous and returns before the WorkSpace is completely restored.
   */
  restoreWorkspace(callback?: (err: AWSError, data: WorkSpaces.Types.RestoreWorkspaceResult) => void): Request<WorkSpaces.Types.RestoreWorkspaceResult, AWSError>;
  /**
   * Removes one or more rules from the specified IP access control group.
   */
  revokeIpRules(params: WorkSpaces.Types.RevokeIpRulesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.RevokeIpRulesResult) => void): Request<WorkSpaces.Types.RevokeIpRulesResult, AWSError>;
  /**
   * Removes one or more rules from the specified IP access control group.
   */
  revokeIpRules(callback?: (err: AWSError, data: WorkSpaces.Types.RevokeIpRulesResult) => void): Request<WorkSpaces.Types.RevokeIpRulesResult, AWSError>;
  /**
   * Starts the specified WorkSpaces. You cannot start a WorkSpace unless it has a running mode of AutoStop and a state of STOPPED.
   */
  startWorkspaces(params: WorkSpaces.Types.StartWorkspacesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.StartWorkspacesResult) => void): Request<WorkSpaces.Types.StartWorkspacesResult, AWSError>;
  /**
   * Starts the specified WorkSpaces. You cannot start a WorkSpace unless it has a running mode of AutoStop and a state of STOPPED.
   */
  startWorkspaces(callback?: (err: AWSError, data: WorkSpaces.Types.StartWorkspacesResult) => void): Request<WorkSpaces.Types.StartWorkspacesResult, AWSError>;
  /**
   *  Stops the specified WorkSpaces. You cannot stop a WorkSpace unless it has a running mode of AutoStop and a state of AVAILABLE, IMPAIRED, UNHEALTHY, or ERROR.
   */
  stopWorkspaces(params: WorkSpaces.Types.StopWorkspacesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.StopWorkspacesResult) => void): Request<WorkSpaces.Types.StopWorkspacesResult, AWSError>;
  /**
   *  Stops the specified WorkSpaces. You cannot stop a WorkSpace unless it has a running mode of AutoStop and a state of AVAILABLE, IMPAIRED, UNHEALTHY, or ERROR.
   */
  stopWorkspaces(callback?: (err: AWSError, data: WorkSpaces.Types.StopWorkspacesResult) => void): Request<WorkSpaces.Types.StopWorkspacesResult, AWSError>;
  /**
   * Terminates the specified WorkSpaces.  Terminating a WorkSpace is a permanent action and cannot be undone. The user's data is destroyed. If you need to archive any user data, contact Amazon Web Services Support before terminating the WorkSpace.  You can terminate a WorkSpace that is in any state except SUSPENDED. This operation is asynchronous and returns before the WorkSpaces have been completely terminated. After a WorkSpace is terminated, the TERMINATED state is returned only briefly before the WorkSpace directory metadata is cleaned up, so this state is rarely returned. To confirm that a WorkSpace is terminated, check for the WorkSpace ID by using  DescribeWorkSpaces. If the WorkSpace ID isn't returned, then the WorkSpace has been successfully terminated.  Simple AD and AD Connector are made available to you free of charge to use with WorkSpaces. If there are no WorkSpaces being used with your Simple AD or AD Connector directory for 30 consecutive days, this directory will be automatically deregistered for use with Amazon WorkSpaces, and you will be charged for this directory as per the Directory Service pricing terms. To delete empty directories, see  Delete the Directory for Your WorkSpaces. If you delete your Simple AD or AD Connector directory, you can always create a new one when you want to start using WorkSpaces again. 
   */
  terminateWorkspaces(params: WorkSpaces.Types.TerminateWorkspacesRequest, callback?: (err: AWSError, data: WorkSpaces.Types.TerminateWorkspacesResult) => void): Request<WorkSpaces.Types.TerminateWorkspacesResult, AWSError>;
  /**
   * Terminates the specified WorkSpaces.  Terminating a WorkSpace is a permanent action and cannot be undone. The user's data is destroyed. If you need to archive any user data, contact Amazon Web Services Support before terminating the WorkSpace.  You can terminate a WorkSpace that is in any state except SUSPENDED. This operation is asynchronous and returns before the WorkSpaces have been completely terminated. After a WorkSpace is terminated, the TERMINATED state is returned only briefly before the WorkSpace directory metadata is cleaned up, so this state is rarely returned. To confirm that a WorkSpace is terminated, check for the WorkSpace ID by using  DescribeWorkSpaces. If the WorkSpace ID isn't returned, then the WorkSpace has been successfully terminated.  Simple AD and AD Connector are made available to you free of charge to use with WorkSpaces. If there are no WorkSpaces being used with your Simple AD or AD Connector directory for 30 consecutive days, this directory will be automatically deregistered for use with Amazon WorkSpaces, and you will be charged for this directory as per the Directory Service pricing terms. To delete empty directories, see  Delete the Directory for Your WorkSpaces. If you delete your Simple AD or AD Connector directory, you can always create a new one when you want to start using WorkSpaces again. 
   */
  terminateWorkspaces(callback?: (err: AWSError, data: WorkSpaces.Types.TerminateWorkspacesResult) => void): Request<WorkSpaces.Types.TerminateWorkspacesResult, AWSError>;
  /**
   * Updates a Amazon Connect client add-in. Use this action to update the name and endpoint URL of a Amazon Connect client add-in.
   */
  updateConnectClientAddIn(params: WorkSpaces.Types.UpdateConnectClientAddInRequest, callback?: (err: AWSError, data: WorkSpaces.Types.UpdateConnectClientAddInResult) => void): Request<WorkSpaces.Types.UpdateConnectClientAddInResult, AWSError>;
  /**
   * Updates a Amazon Connect client add-in. Use this action to update the name and endpoint URL of a Amazon Connect client add-in.
   */
  updateConnectClientAddIn(callback?: (err: AWSError, data: WorkSpaces.Types.UpdateConnectClientAddInResult) => void): Request<WorkSpaces.Types.UpdateConnectClientAddInResult, AWSError>;
  /**
   * Shares or unshares a connection alias with one account by specifying whether that account has permission to associate the connection alias with a directory. If the association permission is granted, the connection alias is shared with that account. If the association permission is revoked, the connection alias is unshared with the account. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.    Before performing this operation, call  DescribeConnectionAliases to make sure that the current state of the connection alias is CREATED.   To delete a connection alias that has been shared, the shared account must first disassociate the connection alias from any directories it has been associated with. Then you must unshare the connection alias from the account it has been shared with. You can delete a connection alias only after it is no longer shared with any accounts or associated with any directories.   
   */
  updateConnectionAliasPermission(params: WorkSpaces.Types.UpdateConnectionAliasPermissionRequest, callback?: (err: AWSError, data: WorkSpaces.Types.UpdateConnectionAliasPermissionResult) => void): Request<WorkSpaces.Types.UpdateConnectionAliasPermissionResult, AWSError>;
  /**
   * Shares or unshares a connection alias with one account by specifying whether that account has permission to associate the connection alias with a directory. If the association permission is granted, the connection alias is shared with that account. If the association permission is revoked, the connection alias is unshared with the account. For more information, see  Cross-Region Redirection for Amazon WorkSpaces.    Before performing this operation, call  DescribeConnectionAliases to make sure that the current state of the connection alias is CREATED.   To delete a connection alias that has been shared, the shared account must first disassociate the connection alias from any directories it has been associated with. Then you must unshare the connection alias from the account it has been shared with. You can delete a connection alias only after it is no longer shared with any accounts or associated with any directories.   
   */
  updateConnectionAliasPermission(callback?: (err: AWSError, data: WorkSpaces.Types.UpdateConnectionAliasPermissionResult) => void): Request<WorkSpaces.Types.UpdateConnectionAliasPermissionResult, AWSError>;
  /**
   * Replaces the current rules of the specified IP access control group with the specified rules.
   */
  updateRulesOfIpGroup(params: WorkSpaces.Types.UpdateRulesOfIpGroupRequest, callback?: (err: AWSError, data: WorkSpaces.Types.UpdateRulesOfIpGroupResult) => void): Request<WorkSpaces.Types.UpdateRulesOfIpGroupResult, AWSError>;
  /**
   * Replaces the current rules of the specified IP access control group with the specified rules.
   */
  updateRulesOfIpGroup(callback?: (err: AWSError, data: WorkSpaces.Types.UpdateRulesOfIpGroupResult) => void): Request<WorkSpaces.Types.UpdateRulesOfIpGroupResult, AWSError>;
  /**
   * Updates a WorkSpace bundle with a new image. For more information about updating WorkSpace bundles, see  Update a Custom WorkSpaces Bundle.  Existing WorkSpaces aren't automatically updated when you update the bundle that they're based on. To update existing WorkSpaces that are based on a bundle that you've updated, you must either rebuild the WorkSpaces or delete and recreate them. 
   */
  updateWorkspaceBundle(params: WorkSpaces.Types.UpdateWorkspaceBundleRequest, callback?: (err: AWSError, data: WorkSpaces.Types.UpdateWorkspaceBundleResult) => void): Request<WorkSpaces.Types.UpdateWorkspaceBundleResult, AWSError>;
  /**
   * Updates a WorkSpace bundle with a new image. For more information about updating WorkSpace bundles, see  Update a Custom WorkSpaces Bundle.  Existing WorkSpaces aren't automatically updated when you update the bundle that they're based on. To update existing WorkSpaces that are based on a bundle that you've updated, you must either rebuild the WorkSpaces or delete and recreate them. 
   */
  updateWorkspaceBundle(callback?: (err: AWSError, data: WorkSpaces.Types.UpdateWorkspaceBundleResult) => void): Request<WorkSpaces.Types.UpdateWorkspaceBundleResult, AWSError>;
  /**
   * Shares or unshares an image with one account in the same Amazon Web Services Region by specifying whether that account has permission to copy the image. If the copy image permission is granted, the image is shared with that account. If the copy image permission is revoked, the image is unshared with the account. After an image has been shared, the recipient account can copy the image to other Regions as needed. In the China (Ningxia) Region, you can copy images only within the same Region. In Amazon Web Services GovCloud (US), to copy images to and from other Regions, contact Amazon Web Services Support. For more information about sharing images, see  Share or Unshare a Custom WorkSpaces Image.    To delete an image that has been shared, you must unshare the image before you delete it.   Sharing Bring Your Own License (BYOL) images across Amazon Web Services accounts isn't supported at this time in Amazon Web Services GovCloud (US). To share BYOL images across accounts in Amazon Web Services GovCloud (US), contact Amazon Web Services Support.   
   */
  updateWorkspaceImagePermission(params: WorkSpaces.Types.UpdateWorkspaceImagePermissionRequest, callback?: (err: AWSError, data: WorkSpaces.Types.UpdateWorkspaceImagePermissionResult) => void): Request<WorkSpaces.Types.UpdateWorkspaceImagePermissionResult, AWSError>;
  /**
   * Shares or unshares an image with one account in the same Amazon Web Services Region by specifying whether that account has permission to copy the image. If the copy image permission is granted, the image is shared with that account. If the copy image permission is revoked, the image is unshared with the account. After an image has been shared, the recipient account can copy the image to other Regions as needed. In the China (Ningxia) Region, you can copy images only within the same Region. In Amazon Web Services GovCloud (US), to copy images to and from other Regions, contact Amazon Web Services Support. For more information about sharing images, see  Share or Unshare a Custom WorkSpaces Image.    To delete an image that has been shared, you must unshare the image before you delete it.   Sharing Bring Your Own License (BYOL) images across Amazon Web Services accounts isn't supported at this time in Amazon Web Services GovCloud (US). To share BYOL images across accounts in Amazon Web Services GovCloud (US), contact Amazon Web Services Support.   
   */
  updateWorkspaceImagePermission(callback?: (err: AWSError, data: WorkSpaces.Types.UpdateWorkspaceImagePermissionResult) => void): Request<WorkSpaces.Types.UpdateWorkspaceImagePermissionResult, AWSError>;
}
declare namespace WorkSpaces {
  export type ARN = string;
  export type AccessPropertyValue = "ALLOW"|"DENY"|string;
  export interface AccountModification {
    /**
     * The state of the modification to the configuration of BYOL.
     */
    ModificationState?: DedicatedTenancyModificationStateEnum;
    /**
     * The status of BYOL (whether BYOL is being enabled or disabled).
     */
    DedicatedTenancySupport?: DedicatedTenancySupportResultEnum;
    /**
     * The IP address range, specified as an IPv4 CIDR block, for the management network interface used for the account.
     */
    DedicatedTenancyManagementCidrRange?: DedicatedTenancyManagementCidrRange;
    /**
     * The timestamp when the modification of the BYOL configuration was started.
     */
    StartTime?: Timestamp;
    /**
     * The error code that is returned if the configuration of BYOL cannot be modified.
     */
    ErrorCode?: WorkspaceErrorCode;
    /**
     * The text of the error message that is returned if the configuration of BYOL cannot be modified.
     */
    ErrorMessage?: Description;
  }
  export type AccountModificationList = AccountModification[];
  export type AddInName = string;
  export type AddInUrl = string;
  export type Alias = string;
  export type AmazonUuid = string;
  export type Application = "Microsoft_Office_2016"|"Microsoft_Office_2019"|string;
  export type ApplicationAssociatedResourceType = "WORKSPACE"|"BUNDLE"|"IMAGE"|string;
  export type ApplicationAssociatedResourceTypeList = ApplicationAssociatedResourceType[];
  export type ApplicationList = Application[];
  export interface ApplicationResourceAssociation {
    /**
     * The identifier of the application.
     */
    ApplicationId?: WorkSpaceApplicationId;
    /**
     * The identifier of the associated resource.
     */
    AssociatedResourceId?: NonEmptyString;
    /**
     * The resource type of the associated resource.
     */
    AssociatedResourceType?: ApplicationAssociatedResourceType;
    /**
     * The time the association was created.
     */
    Created?: Timestamp;
    /**
     * The time the association status was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The status of the application resource association.
     */
    State?: AssociationState;
    /**
     * The reason the association deployment failed.
     */
    StateReason?: AssociationStateReason;
  }
  export type ApplicationResourceAssociationList = ApplicationResourceAssociation[];
  export interface AssociateConnectionAliasRequest {
    /**
     * The identifier of the connection alias.
     */
    AliasId: ConnectionAliasId;
    /**
     * The identifier of the directory to associate the connection alias with.
     */
    ResourceId: NonEmptyString;
  }
  export interface AssociateConnectionAliasResult {
    /**
     * The identifier of the connection alias association. You use the connection identifier in the DNS TXT record when you're configuring your DNS routing policies. 
     */
    ConnectionIdentifier?: ConnectionIdentifier;
  }
  export interface AssociateIpGroupsRequest {
    /**
     * The identifier of the directory.
     */
    DirectoryId: DirectoryId;
    /**
     * The identifiers of one or more IP access control groups.
     */
    GroupIds: IpGroupIdList;
  }
  export interface AssociateIpGroupsResult {
  }
  export interface AssociateWorkspaceApplicationRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
    /**
     * The identifier of the application.
     */
    ApplicationId: WorkSpaceApplicationId;
  }
  export interface AssociateWorkspaceApplicationResult {
    /**
     * Information about the association between the specified WorkSpace and the specified application.
     */
    Association?: WorkspaceResourceAssociation;
  }
  export type AssociationErrorCode = "ValidationError.InsufficientDiskSpace"|"ValidationError.InsufficientMemory"|"ValidationError.UnsupportedOperatingSystem"|"DeploymentError.InternalServerError"|"DeploymentError.WorkspaceUnreachable"|string;
  export type AssociationState = "PENDING_INSTALL"|"PENDING_INSTALL_DEPLOYMENT"|"PENDING_UNINSTALL"|"PENDING_UNINSTALL_DEPLOYMENT"|"INSTALLING"|"UNINSTALLING"|"ERROR"|"COMPLETED"|"REMOVED"|string;
  export interface AssociationStateReason {
    /**
     * The error code of the association deployment failure.
     */
    ErrorCode?: AssociationErrorCode;
    /**
     * The error message of the association deployment failure.
     */
    ErrorMessage?: String2048;
  }
  export type AssociationStatus = "NOT_ASSOCIATED"|"ASSOCIATED_WITH_OWNER_ACCOUNT"|"ASSOCIATED_WITH_SHARED_ACCOUNT"|"PENDING_ASSOCIATION"|"PENDING_DISASSOCIATION"|string;
  export interface AuthorizeIpRulesRequest {
    /**
     * The identifier of the group.
     */
    GroupId: IpGroupId;
    /**
     * The rules to add to the group.
     */
    UserRules: IpRuleList;
  }
  export interface AuthorizeIpRulesResult {
  }
  export type AwsAccount = string;
  export type BooleanObject = boolean;
  export type BundleAssociatedResourceType = "APPLICATION"|string;
  export type BundleAssociatedResourceTypeList = BundleAssociatedResourceType[];
  export type BundleId = string;
  export type BundleIdList = BundleId[];
  export type BundleList = WorkspaceBundle[];
  export type BundleOwner = string;
  export interface BundleResourceAssociation {
    /**
     * The identifier of the associated resource.
     */
    AssociatedResourceId?: NonEmptyString;
    /**
     * The resource type of the associated resources.
     */
    AssociatedResourceType?: BundleAssociatedResourceType;
    /**
     * The identifier of the bundle.
     */
    BundleId?: BundleId;
    /**
     * The time the association is created.
     */
    Created?: Timestamp;
    /**
     * The time the association status was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The status of the bundle resource association.
     */
    State?: AssociationState;
    /**
     * The reason the association deployment failed.
     */
    StateReason?: AssociationStateReason;
  }
  export type BundleResourceAssociationList = BundleResourceAssociation[];
  export type BundleType = "REGULAR"|"STANDBY"|string;
  export type CertificateAuthorityArn = string;
  export interface CertificateBasedAuthProperties {
    /**
     * The status of the certificate-based authentication properties.
     */
    Status?: CertificateBasedAuthStatusEnum;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Certificate Manager Private CA resource.
     */
    CertificateAuthorityArn?: CertificateAuthorityArn;
  }
  export type CertificateBasedAuthStatusEnum = "DISABLED"|"ENABLED"|string;
  export type ClientDeviceType = "DeviceTypeWindows"|"DeviceTypeOsx"|"DeviceTypeAndroid"|"DeviceTypeIos"|"DeviceTypeLinux"|"DeviceTypeWeb"|string;
  export type ClientDeviceTypeList = ClientDeviceType[];
  export type ClientEmail = string;
  export type ClientLocale = string;
  export type ClientLoginMessage = string;
  export interface ClientProperties {
    /**
     * Specifies whether users can cache their credentials on the Amazon WorkSpaces client. When enabled, users can choose to reconnect to their WorkSpaces without re-entering their credentials. 
     */
    ReconnectEnabled?: ReconnectEnum;
    /**
     * Specifies whether users can upload diagnostic log files of Amazon WorkSpaces client directly to WorkSpaces to troubleshoot issues when using the WorkSpaces client. When enabled, the log files will be sent to WorkSpaces automatically and will be applied to all users in the specified directory.
     */
    LogUploadEnabled?: LogUploadEnum;
  }
  export type ClientPropertiesList = ClientPropertiesResult[];
  export interface ClientPropertiesResult {
    /**
     * The resource identifier, in the form of a directory ID.
     */
    ResourceId?: NonEmptyString;
    /**
     * Information about the Amazon WorkSpaces client.
     */
    ClientProperties?: ClientProperties;
  }
  export type ClientUrl = string;
  export type Compute = "VALUE"|"STANDARD"|"PERFORMANCE"|"POWER"|"GRAPHICS"|"POWERPRO"|"GRAPHICSPRO"|"GRAPHICS_G4DN"|"GRAPHICSPRO_G4DN"|string;
  export type ComputeList = Compute[];
  export interface ComputeType {
    /**
     * The compute type.
     */
    Name?: Compute;
  }
  export type ComputerName = string;
  export interface ConnectClientAddIn {
    /**
     * The client add-in identifier.
     */
    AddInId?: AmazonUuid;
    /**
     * The directory identifier for which the client add-in is configured.
     */
    ResourceId?: DirectoryId;
    /**
     * The name of the client add in.
     */
    Name?: AddInName;
    /**
     * The endpoint URL of the client add-in.
     */
    URL?: AddInUrl;
  }
  export type ConnectClientAddInList = ConnectClientAddIn[];
  export interface ConnectionAlias {
    /**
     * The connection string specified for the connection alias. The connection string must be in the form of a fully qualified domain name (FQDN), such as www.example.com.
     */
    ConnectionString?: ConnectionString;
    /**
     * The identifier of the connection alias.
     */
    AliasId?: ConnectionAliasId;
    /**
     * The current state of the connection alias.
     */
    State?: ConnectionAliasState;
    /**
     * The identifier of the Amazon Web Services account that owns the connection alias.
     */
    OwnerAccountId?: AwsAccount;
    /**
     * The association status of the connection alias.
     */
    Associations?: ConnectionAliasAssociationList;
  }
  export interface ConnectionAliasAssociation {
    /**
     * The association status of the connection alias.
     */
    AssociationStatus?: AssociationStatus;
    /**
     * The identifier of the Amazon Web Services account that associated the connection alias with a directory.
     */
    AssociatedAccountId?: AwsAccount;
    /**
     * The identifier of the directory associated with a connection alias.
     */
    ResourceId?: NonEmptyString;
    /**
     * The identifier of the connection alias association. You use the connection identifier in the DNS TXT record when you're configuring your DNS routing policies.
     */
    ConnectionIdentifier?: ConnectionIdentifier;
  }
  export type ConnectionAliasAssociationList = ConnectionAliasAssociation[];
  export type ConnectionAliasId = string;
  export type ConnectionAliasIdList = ConnectionAliasId[];
  export type ConnectionAliasList = ConnectionAlias[];
  export interface ConnectionAliasPermission {
    /**
     * The identifier of the Amazon Web Services account that the connection alias is shared with.
     */
    SharedAccountId: AwsAccount;
    /**
     * Indicates whether the specified Amazon Web Services account is allowed to associate the connection alias with a directory.
     */
    AllowAssociation: BooleanObject;
  }
  export type ConnectionAliasPermissions = ConnectionAliasPermission[];
  export type ConnectionAliasState = "CREATING"|"CREATED"|"DELETING"|string;
  export type ConnectionIdentifier = string;
  export type ConnectionState = "CONNECTED"|"DISCONNECTED"|"UNKNOWN"|string;
  export type ConnectionString = string;
  export interface CopyWorkspaceImageRequest {
    /**
     * The name of the image.
     */
    Name: WorkspaceImageName;
    /**
     * A description of the image.
     */
    Description?: WorkspaceImageDescription;
    /**
     * The identifier of the source image.
     */
    SourceImageId: WorkspaceImageId;
    /**
     * The identifier of the source Region.
     */
    SourceRegion: Region;
    /**
     * The tags for the image.
     */
    Tags?: TagList;
  }
  export interface CopyWorkspaceImageResult {
    /**
     * The identifier of the image.
     */
    ImageId?: WorkspaceImageId;
  }
  export interface CreateConnectClientAddInRequest {
    /**
     * The directory identifier for which to configure the client add-in.
     */
    ResourceId: DirectoryId;
    /**
     * The name of the client add-in.
     */
    Name: AddInName;
    /**
     * The endpoint URL of the Amazon Connect client add-in.
     */
    URL: AddInUrl;
  }
  export interface CreateConnectClientAddInResult {
    /**
     * The client add-in identifier.
     */
    AddInId?: AmazonUuid;
  }
  export interface CreateConnectionAliasRequest {
    /**
     * A connection string in the form of a fully qualified domain name (FQDN), such as www.example.com.  After you create a connection string, it is always associated to your Amazon Web Services account. You cannot recreate the same connection string with a different account, even if you delete all instances of it from the original account. The connection string is globally reserved for your account. 
     */
    ConnectionString: ConnectionString;
    /**
     * The tags to associate with the connection alias.
     */
    Tags?: TagList;
  }
  export interface CreateConnectionAliasResult {
    /**
     * The identifier of the connection alias.
     */
    AliasId?: ConnectionAliasId;
  }
  export interface CreateIpGroupRequest {
    /**
     * The name of the group.
     */
    GroupName: IpGroupName;
    /**
     * The description of the group.
     */
    GroupDesc?: IpGroupDesc;
    /**
     * The rules to add to the group.
     */
    UserRules?: IpRuleList;
    /**
     * The tags. Each WorkSpaces resource can have a maximum of 50 tags.
     */
    Tags?: TagList;
  }
  export interface CreateIpGroupResult {
    /**
     * The identifier of the group.
     */
    GroupId?: IpGroupId;
  }
  export interface CreateStandbyWorkspacesRequest {
    /**
     * The Region of the primary WorkSpace.
     */
    PrimaryRegion: Region;
    /**
     * Information about the standby WorkSpace to be created.
     */
    StandbyWorkspaces: StandbyWorkspacesList;
  }
  export interface CreateStandbyWorkspacesResult {
    /**
     * Information about the standby WorkSpace that could not be created. 
     */
    FailedStandbyRequests?: FailedCreateStandbyWorkspacesRequestList;
    /**
     * Information about the standby WorkSpace that was created.
     */
    PendingStandbyRequests?: PendingCreateStandbyWorkspacesRequestList;
  }
  export interface CreateTagsRequest {
    /**
     * The identifier of the WorkSpaces resource. The supported resource types are WorkSpaces, registered directories, images, custom bundles, IP access control groups, and connection aliases.
     */
    ResourceId: NonEmptyString;
    /**
     * The tags. Each WorkSpaces resource can have a maximum of 50 tags.
     */
    Tags: TagList;
  }
  export interface CreateTagsResult {
  }
  export interface CreateUpdatedWorkspaceImageRequest {
    /**
     * The name of the new updated WorkSpace image.
     */
    Name: WorkspaceImageName;
    /**
     * A description of whether updates for the WorkSpace image are available.
     */
    Description: WorkspaceImageDescription;
    /**
     * The identifier of the source WorkSpace image.
     */
    SourceImageId: WorkspaceImageId;
    /**
     * The tags that you want to add to the new updated WorkSpace image.  To add tags at the same time when you're creating the updated image, you must create an IAM policy that grants your IAM user permissions to use workspaces:CreateTags.  
     */
    Tags?: TagList;
  }
  export interface CreateUpdatedWorkspaceImageResult {
    /**
     * The identifier of the new updated WorkSpace image.
     */
    ImageId?: WorkspaceImageId;
  }
  export interface CreateWorkspaceBundleRequest {
    /**
     * The name of the bundle.
     */
    BundleName: WorkspaceBundleName;
    /**
     * The description of the bundle.
     */
    BundleDescription: WorkspaceBundleDescription;
    /**
     * The identifier of the image that is used to create the bundle.
     */
    ImageId: WorkspaceImageId;
    ComputeType: ComputeType;
    UserStorage: UserStorage;
    RootStorage?: RootStorage;
    /**
     * The tags associated with the bundle.  To add tags at the same time when you're creating the bundle, you must create an IAM policy that grants your IAM user permissions to use workspaces:CreateTags.  
     */
    Tags?: TagList;
  }
  export interface CreateWorkspaceBundleResult {
    WorkspaceBundle?: WorkspaceBundle;
  }
  export interface CreateWorkspaceImageRequest {
    /**
     * The name of the new WorkSpace image.
     */
    Name: WorkspaceImageName;
    /**
     * The description of the new WorkSpace image.
     */
    Description: WorkspaceImageDescription;
    /**
     * The identifier of the source WorkSpace
     */
    WorkspaceId: WorkspaceId;
    /**
     * The tags that you want to add to the new WorkSpace image. To add tags when you're creating the image, you must create an IAM policy that grants your IAM user permission to use workspaces:CreateTags.
     */
    Tags?: TagList;
  }
  export interface CreateWorkspaceImageResult {
    /**
     * The identifier of the new WorkSpace image.
     */
    ImageId?: WorkspaceImageId;
    /**
     * The name of the image.
     */
    Name?: WorkspaceImageName;
    /**
     * The description of the image.
     */
    Description?: WorkspaceImageDescription;
    /**
     * The operating system that the image is running.
     */
    OperatingSystem?: OperatingSystem;
    /**
     * The availability status of the image.
     */
    State?: WorkspaceImageState;
    /**
     * Specifies whether the image is running on dedicated hardware. When Bring Your Own License (BYOL) is enabled, this value is set to DEDICATED. For more information, see  Bring Your Own Windows Desktop Images..
     */
    RequiredTenancy?: WorkspaceImageRequiredTenancy;
    /**
     * The date when the image was created.
     */
    Created?: Timestamp;
    /**
     * The identifier of the Amazon Web Services account that owns the image.
     */
    OwnerAccountId?: AwsAccount;
  }
  export interface CreateWorkspacesRequest {
    /**
     * The WorkSpaces to create. You can specify up to 25 WorkSpaces.
     */
    Workspaces: WorkspaceRequestList;
  }
  export interface CreateWorkspacesResult {
    /**
     * Information about the WorkSpaces that could not be created.
     */
    FailedRequests?: FailedCreateWorkspaceRequests;
    /**
     * Information about the WorkSpaces that were created. Because this operation is asynchronous, the identifier returned is not immediately available for use with other operations. For example, if you call DescribeWorkspaces before the WorkSpace is created, the information returned can be incomplete.
     */
    PendingRequests?: WorkspaceList;
  }
  export type DedicatedTenancyCidrRangeList = DedicatedTenancyManagementCidrRange[];
  export type DedicatedTenancyManagementCidrRange = string;
  export type DedicatedTenancyModificationStateEnum = "PENDING"|"COMPLETED"|"FAILED"|string;
  export type DedicatedTenancySupportEnum = "ENABLED"|string;
  export type DedicatedTenancySupportResultEnum = "ENABLED"|"DISABLED"|string;
  export interface DefaultClientBrandingAttributes {
    /**
     * The logo. The only image format accepted is a binary data object that is converted from a .png file.
     */
    LogoUrl?: ClientUrl;
    /**
     * The support email. The company's customer support email address.    In each platform type, the SupportEmail and SupportLink parameters are mutually exclusive. You can specify one parameter for each platform type, but not both.   The default email is workspaces-feedback@amazon.com.   
     */
    SupportEmail?: ClientEmail;
    /**
     * The support link. The link for the company's customer support page for their WorkSpace.    In each platform type, the SupportEmail and SupportLink parameters are mutually exclusive.You can specify one parameter for each platform type, but not both.   The default support link is workspaces-feedback@amazon.com.   
     */
    SupportLink?: ClientUrl;
    /**
     * The forgotten password link. This is the web address that users can go to if they forget the password for their WorkSpace.
     */
    ForgotPasswordLink?: ClientUrl;
    /**
     * The login message. Specified as a key value pair, in which the key is a locale and the value is the localized message for that locale. The only key supported is en_US. The HTML tags supported include the following: a, b, blockquote, br, cite, code, dd, dl, dt, div, em, i, li, ol, p, pre, q, small, span, strike, strong, sub, sup, u, ul.
     */
    LoginMessage?: LoginMessage;
  }
  export interface DefaultImportClientBrandingAttributes {
    /**
     * The logo. The only image format accepted is a binary data object that is converted from a .png file.
     */
    Logo?: DefaultLogo;
    /**
     * The support email. The company's customer support email address.    In each platform type, the SupportEmail and SupportLink parameters are mutually exclusive. You can specify one parameter for each platform type, but not both.   The default email is workspaces-feedback@amazon.com.   
     */
    SupportEmail?: ClientEmail;
    /**
     * The support link. The link for the company's customer support page for their WorkSpace.    In each platform type, the SupportEmail and SupportLink parameters are mutually exclusive. You can specify one parameter for each platform type, but not both.   The default support link is workspaces-feedback@amazon.com.   
     */
    SupportLink?: ClientUrl;
    /**
     * The forgotten password link. This is the web address that users can go to if they forget the password for their WorkSpace.
     */
    ForgotPasswordLink?: ClientUrl;
    /**
     * The login message. Specified as a key value pair, in which the key is a locale and the value is the localized message for that locale. The only key supported is en_US. The HTML tags supported include the following: a, b, blockquote, br, cite, code, dd, dl, dt, div, em, i, li, ol, p, pre, q, small, span, strike, strong, sub, sup, u, ul.
     */
    LoginMessage?: LoginMessage;
  }
  export type DefaultLogo = Buffer|Uint8Array|Blob|string;
  export type DefaultOu = string;
  export interface DefaultWorkspaceCreationProperties {
    /**
     * Specifies whether the directory is enabled for Amazon WorkDocs.
     */
    EnableWorkDocs?: BooleanObject;
    /**
     * Specifies whether to automatically assign an Elastic public IP address to WorkSpaces in this directory by default. If enabled, the Elastic public IP address allows outbound internet access from your WorkSpaces when you’re using an internet gateway in the Amazon VPC in which your WorkSpaces are located. If you're using a Network Address Translation (NAT) gateway for outbound internet access from your VPC, or if your WorkSpaces are in public subnets and you manually assign them Elastic IP addresses, you should disable this setting. This setting applies to new WorkSpaces that you launch or to existing WorkSpaces that you rebuild. For more information, see  Configure a VPC for Amazon WorkSpaces.
     */
    EnableInternetAccess?: BooleanObject;
    /**
     * The organizational unit (OU) in the directory for the WorkSpace machine accounts.
     */
    DefaultOu?: DefaultOu;
    /**
     * The identifier of the default security group to apply to WorkSpaces when they are created. For more information, see  Security Groups for Your WorkSpaces.
     */
    CustomSecurityGroupId?: SecurityGroupId;
    /**
     * Specifies whether WorkSpace users are local administrators on their WorkSpaces.
     */
    UserEnabledAsLocalAdministrator?: BooleanObject;
    /**
     * Specifies whether maintenance mode is enabled for WorkSpaces. For more information, see WorkSpace Maintenance.
     */
    EnableMaintenanceMode?: BooleanObject;
  }
  export type DeletableCertificateBasedAuthPropertiesList = DeletableCertificateBasedAuthProperty[];
  export type DeletableCertificateBasedAuthProperty = "CERTIFICATE_BASED_AUTH_PROPERTIES_CERTIFICATE_AUTHORITY_ARN"|string;
  export type DeletableSamlPropertiesList = DeletableSamlProperty[];
  export type DeletableSamlProperty = "SAML_PROPERTIES_USER_ACCESS_URL"|"SAML_PROPERTIES_RELAY_STATE_PARAMETER_NAME"|string;
  export interface DeleteClientBrandingRequest {
    /**
     * The directory identifier of the WorkSpace for which you want to delete client branding.
     */
    ResourceId: DirectoryId;
    /**
     * The device type for which you want to delete client branding.
     */
    Platforms: ClientDeviceTypeList;
  }
  export interface DeleteClientBrandingResult {
  }
  export interface DeleteConnectClientAddInRequest {
    /**
     * The identifier of the client add-in to delete.
     */
    AddInId: AmazonUuid;
    /**
     * The directory identifier for which the client add-in is configured.
     */
    ResourceId: DirectoryId;
  }
  export interface DeleteConnectClientAddInResult {
  }
  export interface DeleteConnectionAliasRequest {
    /**
     * The identifier of the connection alias to delete.
     */
    AliasId: ConnectionAliasId;
  }
  export interface DeleteConnectionAliasResult {
  }
  export interface DeleteIpGroupRequest {
    /**
     * The identifier of the IP access control group.
     */
    GroupId: IpGroupId;
  }
  export interface DeleteIpGroupResult {
  }
  export interface DeleteTagsRequest {
    /**
     * The identifier of the WorkSpaces resource. The supported resource types are WorkSpaces, registered directories, images, custom bundles, IP access control groups, and connection aliases.
     */
    ResourceId: NonEmptyString;
    /**
     * The tag keys.
     */
    TagKeys: TagKeyList;
  }
  export interface DeleteTagsResult {
  }
  export interface DeleteWorkspaceBundleRequest {
    /**
     * The identifier of the bundle.
     */
    BundleId?: BundleId;
  }
  export interface DeleteWorkspaceBundleResult {
  }
  export interface DeleteWorkspaceImageRequest {
    /**
     * The identifier of the image.
     */
    ImageId: WorkspaceImageId;
  }
  export interface DeleteWorkspaceImageResult {
  }
  export interface DeployWorkspaceApplicationsRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
    /**
     * Indicates whether the force flag is applied for the specified WorkSpace. When the force flag is enabled, it allows previously failed deployments to be retried.
     */
    Force?: BooleanObject;
  }
  export interface DeployWorkspaceApplicationsResult {
    /**
     * The list of deployed associations and information about them.
     */
    Deployment?: WorkSpaceApplicationDeployment;
  }
  export interface DeregisterWorkspaceDirectoryRequest {
    /**
     * The identifier of the directory. If any WorkSpaces are registered to this directory, you must remove them before you deregister the directory, or you will receive an OperationNotSupportedException error.
     */
    DirectoryId: DirectoryId;
  }
  export interface DeregisterWorkspaceDirectoryResult {
  }
  export interface DescribeAccountModificationsRequest {
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeAccountModificationsResult {
    /**
     * The list of modifications to the configuration of BYOL.
     */
    AccountModifications?: AccountModificationList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeAccountRequest {
  }
  export interface DescribeAccountResult {
    /**
     * The status of BYOL (whether BYOL is enabled or disabled).
     */
    DedicatedTenancySupport?: DedicatedTenancySupportResultEnum;
    /**
     * The IP address range, specified as an IPv4 CIDR block, used for the management network interface. The management network interface is connected to a secure Amazon WorkSpaces management network. It is used for interactive streaming of the WorkSpace desktop to Amazon WorkSpaces clients, and to allow Amazon WorkSpaces to manage the WorkSpace.
     */
    DedicatedTenancyManagementCidrRange?: DedicatedTenancyManagementCidrRange;
  }
  export interface DescribeApplicationAssociationsRequest {
    /**
     * The maximum number of associations to return.
     */
    MaxResults?: Limit;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * The identifier of the specified application.
     */
    ApplicationId: WorkSpaceApplicationId;
    /**
     * The resource type of the associated resources.
     */
    AssociatedResourceTypes: ApplicationAssociatedResourceTypeList;
  }
  export interface DescribeApplicationAssociationsResult {
    /**
     * List of associations and information about them.
     */
    Associations?: ApplicationResourceAssociationList;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeApplicationsRequest {
    /**
     * The identifiers of one or more applications.
     */
    ApplicationIds?: WorkSpaceApplicationIdList;
    /**
     * The compute types supported by the applications.
     */
    ComputeTypeNames?: ComputeList;
    /**
     * The license availability for the applications.
     */
    LicenseType?: WorkSpaceApplicationLicenseType;
    /**
     * The operating systems supported by the applications.
     */
    OperatingSystemNames?: OperatingSystemNameList;
    /**
     * The owner of the applications.
     */
    Owner?: WorkSpaceApplicationOwner;
    /**
     * The maximum number of applications to return.
     */
    MaxResults?: Limit;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeApplicationsResult {
    /**
     * List of information about the specified applications.
     */
    Applications?: WorkSpaceApplicationList;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeBundleAssociationsRequest {
    /**
     * The identifier of the bundle.
     */
    BundleId: BundleId;
    /**
     * The resource types of the associated resource.
     */
    AssociatedResourceTypes: BundleAssociatedResourceTypeList;
  }
  export interface DescribeBundleAssociationsResult {
    /**
     * List of information about the specified associations.
     */
    Associations?: BundleResourceAssociationList;
  }
  export interface DescribeClientBrandingRequest {
    /**
     * The directory identifier of the WorkSpace for which you want to view client branding information.
     */
    ResourceId: DirectoryId;
  }
  export interface DescribeClientBrandingResult {
    /**
     * The branding information for Windows devices.
     */
    DeviceTypeWindows?: DefaultClientBrandingAttributes;
    /**
     * The branding information for macOS devices.
     */
    DeviceTypeOsx?: DefaultClientBrandingAttributes;
    /**
     * The branding information for Android devices.
     */
    DeviceTypeAndroid?: DefaultClientBrandingAttributes;
    /**
     * The branding information for iOS devices.
     */
    DeviceTypeIos?: IosClientBrandingAttributes;
    /**
     * The branding information for Linux devices.
     */
    DeviceTypeLinux?: DefaultClientBrandingAttributes;
    /**
     * The branding information for Web access.
     */
    DeviceTypeWeb?: DefaultClientBrandingAttributes;
  }
  export interface DescribeClientPropertiesRequest {
    /**
     * The resource identifier, in the form of directory IDs.
     */
    ResourceIds: ResourceIdList;
  }
  export interface DescribeClientPropertiesResult {
    /**
     * Information about the specified Amazon WorkSpaces clients.
     */
    ClientPropertiesList?: ClientPropertiesList;
  }
  export interface DescribeConnectClientAddInsRequest {
    /**
     * The directory identifier for which the client add-in is configured.
     */
    ResourceId: DirectoryId;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of items to return.
     */
    MaxResults?: Limit;
  }
  export interface DescribeConnectClientAddInsResult {
    /**
     * Information about client add-ins.
     */
    AddIns?: ConnectClientAddInList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeConnectionAliasPermissionsRequest {
    /**
     * The identifier of the connection alias.
     */
    AliasId: ConnectionAliasId;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results. 
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: Limit;
  }
  export interface DescribeConnectionAliasPermissionsResult {
    /**
     * The identifier of the connection alias.
     */
    AliasId?: ConnectionAliasId;
    /**
     * The permissions associated with a connection alias.
     */
    ConnectionAliasPermissions?: ConnectionAliasPermissions;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeConnectionAliasesRequest {
    /**
     * The identifiers of the connection aliases to describe.
     */
    AliasIds?: ConnectionAliasIdList;
    /**
     * The identifier of the directory associated with the connection alias.
     */
    ResourceId?: NonEmptyString;
    /**
     * The maximum number of connection aliases to return.
     */
    Limit?: Limit;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results. 
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeConnectionAliasesResult {
    /**
     * Information about the specified connection aliases.
     */
    ConnectionAliases?: ConnectionAliasList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeImageAssociationsRequest {
    /**
     * The identifier of the image.
     */
    ImageId: WorkspaceImageId;
    /**
     * The resource types of the associated resource.
     */
    AssociatedResourceTypes: ImageAssociatedResourceTypeList;
  }
  export interface DescribeImageAssociationsResult {
    /**
     * List of information about the specified associations.
     */
    Associations?: ImageResourceAssociationList;
  }
  export interface DescribeIpGroupsRequest {
    /**
     * The identifiers of one or more IP access control groups.
     */
    GroupIds?: IpGroupIdList;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of items to return.
     */
    MaxResults?: Limit;
  }
  export interface DescribeIpGroupsResult {
    /**
     * Information about the IP access control groups.
     */
    Result?: WorkspacesIpGroupsList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeTagsRequest {
    /**
     * The identifier of the WorkSpaces resource. The supported resource types are WorkSpaces, registered directories, images, custom bundles, IP access control groups, and connection aliases.
     */
    ResourceId: NonEmptyString;
  }
  export interface DescribeTagsResult {
    /**
     * The tags.
     */
    TagList?: TagList;
  }
  export interface DescribeWorkspaceAssociationsRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
    /**
     * The resource types of the associated resources.
     */
    AssociatedResourceTypes: WorkSpaceAssociatedResourceTypeList;
  }
  export interface DescribeWorkspaceAssociationsResult {
    /**
     * List of information about the specified associations.
     */
    Associations?: WorkspaceResourceAssociationList;
  }
  export interface DescribeWorkspaceBundlesRequest {
    /**
     * The identifiers of the bundles. You cannot combine this parameter with any other filter.
     */
    BundleIds?: BundleIdList;
    /**
     * The owner of the bundles. You cannot combine this parameter with any other filter. To describe the bundles provided by Amazon Web Services, specify AMAZON. To describe the bundles that belong to your account, don't specify a value.
     */
    Owner?: BundleOwner;
    /**
     * The token for the next set of results. (You received this token from a previous call.)
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeWorkspaceBundlesResult {
    /**
     * Information about the bundles.
     */
    Bundles?: BundleList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. This token is valid for one day and must be used within that time frame.
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeWorkspaceDirectoriesRequest {
    /**
     * The identifiers of the directories. If the value is null, all directories are retrieved.
     */
    DirectoryIds?: DirectoryIdList;
    /**
     * The maximum number of directories to return.
     */
    Limit?: Limit;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeWorkspaceDirectoriesResult {
    /**
     * Information about the directories.
     */
    Directories?: DirectoryList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeWorkspaceImagePermissionsRequest {
    /**
     * The identifier of the image.
     */
    ImageId: WorkspaceImageId;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of items to return.
     */
    MaxResults?: Limit;
  }
  export interface DescribeWorkspaceImagePermissionsResult {
    /**
     * The identifier of the image.
     */
    ImageId?: WorkspaceImageId;
    /**
     * The identifiers of the Amazon Web Services accounts that the image has been shared with.
     */
    ImagePermissions?: ImagePermissions;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeWorkspaceImagesRequest {
    /**
     * The identifier of the image.
     */
    ImageIds?: WorkspaceImageIdList;
    /**
     * The type (owned or shared) of the image.
     */
    ImageType?: ImageType;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of items to return.
     */
    MaxResults?: Limit;
  }
  export interface DescribeWorkspaceImagesResult {
    /**
     * Information about the images.
     */
    Images?: WorkspaceImageList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeWorkspaceSnapshotsRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
  }
  export interface DescribeWorkspaceSnapshotsResult {
    /**
     * Information about the snapshots that can be used to rebuild a WorkSpace. These snapshots include the user volume.
     */
    RebuildSnapshots?: SnapshotList;
    /**
     * Information about the snapshots that can be used to restore a WorkSpace. These snapshots include both the root volume and the user volume.
     */
    RestoreSnapshots?: SnapshotList;
  }
  export interface DescribeWorkspacesConnectionStatusRequest {
    /**
     * The identifiers of the WorkSpaces. You can specify up to 25 WorkSpaces.
     */
    WorkspaceIds?: WorkspaceIdList;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeWorkspacesConnectionStatusResult {
    /**
     * Information about the connection status of the WorkSpace.
     */
    WorkspacesConnectionStatus?: WorkspaceConnectionStatusList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeWorkspacesRequest {
    /**
     * The identifiers of the WorkSpaces. You cannot combine this parameter with any other filter. Because the CreateWorkspaces operation is asynchronous, the identifier it returns is not immediately available. If you immediately call DescribeWorkspaces with this identifier, no information is returned.
     */
    WorkspaceIds?: WorkspaceIdList;
    /**
     * The identifier of the directory. In addition, you can optionally specify a specific directory user (see UserName). You cannot combine this parameter with any other filter.
     */
    DirectoryId?: DirectoryId;
    /**
     * The name of the directory user. You must specify this parameter with DirectoryId.
     */
    UserName?: UserName;
    /**
     * The identifier of the bundle. All WorkSpaces that are created from this bundle are retrieved. You cannot combine this parameter with any other filter.
     */
    BundleId?: BundleId;
    /**
     * The maximum number of items to return.
     */
    Limit?: Limit;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface DescribeWorkspacesResult {
    /**
     * Information about the WorkSpaces. Because CreateWorkspaces is an asynchronous operation, some of the returned information could be incomplete.
     */
    Workspaces?: WorkspaceList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export type Description = string;
  export type DirectoryId = string;
  export type DirectoryIdList = DirectoryId[];
  export type DirectoryList = WorkspaceDirectory[];
  export type DirectoryName = string;
  export interface DisassociateConnectionAliasRequest {
    /**
     * The identifier of the connection alias to disassociate.
     */
    AliasId: ConnectionAliasId;
  }
  export interface DisassociateConnectionAliasResult {
  }
  export interface DisassociateIpGroupsRequest {
    /**
     * The identifier of the directory.
     */
    DirectoryId: DirectoryId;
    /**
     * The identifiers of one or more IP access control groups.
     */
    GroupIds: IpGroupIdList;
  }
  export interface DisassociateIpGroupsResult {
  }
  export interface DisassociateWorkspaceApplicationRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
    /**
     * The identifier of the application.
     */
    ApplicationId: WorkSpaceApplicationId;
  }
  export interface DisassociateWorkspaceApplicationResult {
    /**
     * Information about the targeted association.
     */
    Association?: WorkspaceResourceAssociation;
  }
  export type DnsIpAddresses = IpAddress[];
  export type Ec2ImageId = string;
  export interface ErrorDetails {
    /**
     * Indicates the error code returned.
     */
    ErrorCode?: WorkspaceImageErrorDetailCode;
    /**
     * The text of the error message related the error code.
     */
    ErrorMessage?: Description;
  }
  export type ErrorDetailsList = ErrorDetails[];
  export type ErrorType = string;
  export interface FailedCreateStandbyWorkspacesRequest {
    /**
     * Information about the standby WorkSpace that could not be created.
     */
    StandbyWorkspaceRequest?: StandbyWorkspace;
    /**
     * The error code that is returned if the standby WorkSpace could not be created.
     */
    ErrorCode?: WorkspaceErrorCode;
    /**
     * The text of the error message that is returned if the standby WorkSpace could not be created.
     */
    ErrorMessage?: Description;
  }
  export type FailedCreateStandbyWorkspacesRequestList = FailedCreateStandbyWorkspacesRequest[];
  export interface FailedCreateWorkspaceRequest {
    /**
     * Information about the WorkSpace.
     */
    WorkspaceRequest?: WorkspaceRequest;
    /**
     * The error code that is returned if the WorkSpace cannot be created.
     */
    ErrorCode?: ErrorType;
    /**
     * The text of the error message that is returned if the WorkSpace cannot be created.
     */
    ErrorMessage?: Description;
  }
  export type FailedCreateWorkspaceRequests = FailedCreateWorkspaceRequest[];
  export type FailedRebootWorkspaceRequests = FailedWorkspaceChangeRequest[];
  export type FailedRebuildWorkspaceRequests = FailedWorkspaceChangeRequest[];
  export type FailedStartWorkspaceRequests = FailedWorkspaceChangeRequest[];
  export type FailedStopWorkspaceRequests = FailedWorkspaceChangeRequest[];
  export type FailedTerminateWorkspaceRequests = FailedWorkspaceChangeRequest[];
  export interface FailedWorkspaceChangeRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId?: WorkspaceId;
    /**
     * The error code that is returned if the WorkSpace cannot be rebooted.
     */
    ErrorCode?: ErrorType;
    /**
     * The text of the error message that is returned if the WorkSpace cannot be rebooted.
     */
    ErrorMessage?: Description;
  }
  export type ImageAssociatedResourceType = "APPLICATION"|string;
  export type ImageAssociatedResourceTypeList = ImageAssociatedResourceType[];
  export interface ImagePermission {
    /**
     * The identifier of the Amazon Web Services account that an image has been shared with.
     */
    SharedAccountId?: AwsAccount;
  }
  export type ImagePermissions = ImagePermission[];
  export interface ImageResourceAssociation {
    /**
     * The identifier of the associated resource.
     */
    AssociatedResourceId?: NonEmptyString;
    /**
     * The resource type of the associated resources.
     */
    AssociatedResourceType?: ImageAssociatedResourceType;
    /**
     * The time the association is created.
     */
    Created?: Timestamp;
    /**
     * The time the association status was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The identifier of the image.
     */
    ImageId?: WorkspaceImageId;
    /**
     * The status of the image resource association.
     */
    State?: AssociationState;
    /**
     * The reason the association deployment failed.
     */
    StateReason?: AssociationStateReason;
  }
  export type ImageResourceAssociationList = ImageResourceAssociation[];
  export type ImageType = "OWNED"|"SHARED"|string;
  export interface ImportClientBrandingRequest {
    /**
     * The directory identifier of the WorkSpace for which you want to import client branding.
     */
    ResourceId: DirectoryId;
    /**
     * The branding information to import for Windows devices.
     */
    DeviceTypeWindows?: DefaultImportClientBrandingAttributes;
    /**
     * The branding information to import for macOS devices.
     */
    DeviceTypeOsx?: DefaultImportClientBrandingAttributes;
    /**
     * The branding information to import for Android devices.
     */
    DeviceTypeAndroid?: DefaultImportClientBrandingAttributes;
    /**
     * The branding information to import for iOS devices.
     */
    DeviceTypeIos?: IosImportClientBrandingAttributes;
    /**
     * The branding information to import for Linux devices.
     */
    DeviceTypeLinux?: DefaultImportClientBrandingAttributes;
    /**
     * The branding information to import for web access.
     */
    DeviceTypeWeb?: DefaultImportClientBrandingAttributes;
  }
  export interface ImportClientBrandingResult {
    /**
     * The branding information configured for Windows devices.
     */
    DeviceTypeWindows?: DefaultClientBrandingAttributes;
    /**
     * The branding information configured for macOS devices.
     */
    DeviceTypeOsx?: DefaultClientBrandingAttributes;
    /**
     * The branding information configured for Android devices.
     */
    DeviceTypeAndroid?: DefaultClientBrandingAttributes;
    /**
     * The branding information configured for iOS devices.
     */
    DeviceTypeIos?: IosClientBrandingAttributes;
    /**
     * The branding information configured for Linux devices.
     */
    DeviceTypeLinux?: DefaultClientBrandingAttributes;
    /**
     * The branding information configured for web access.
     */
    DeviceTypeWeb?: DefaultClientBrandingAttributes;
  }
  export interface ImportWorkspaceImageRequest {
    /**
     * The identifier of the EC2 image.
     */
    Ec2ImageId: Ec2ImageId;
    /**
     * The ingestion process to be used when importing the image, depending on which protocol you want to use for your BYOL Workspace image, either PCoIP, WorkSpaces Streaming Protocol (WSP), or bring your own protocol (BYOP). To use WSP, specify a value that ends in _WSP. To use PCoIP, specify a value that does not end in _WSP. To use BYOP, specify a value that ends in _BYOP. For non-GPU-enabled bundles (bundles other than Graphics or GraphicsPro), specify BYOL_REGULAR, BYOL_REGULAR_WSP, or BYOL_REGULAR_BYOP, depending on the protocol.  The BYOL_REGULAR_BYOP and BYOL_GRAPHICS_G4DN_BYOP values are only supported by Amazon WorkSpaces Core. Contact your account team to be allow-listed to use these values. For more information, see Amazon WorkSpaces Core. 
     */
    IngestionProcess: WorkspaceImageIngestionProcess;
    /**
     * The name of the WorkSpace image.
     */
    ImageName: WorkspaceImageName;
    /**
     * The description of the WorkSpace image.
     */
    ImageDescription: WorkspaceImageDescription;
    /**
     * The tags. Each WorkSpaces resource can have a maximum of 50 tags.
     */
    Tags?: TagList;
    /**
     * If specified, the version of Microsoft Office to subscribe to. Valid only for Windows 10 and 11 BYOL images. For more information about subscribing to Office for BYOL images, see  Bring Your Own Windows Desktop Licenses.    Although this parameter is an array, only one item is allowed at this time.   Windows 11 only supports Microsoft_Office_2019.   
     */
    Applications?: ApplicationList;
  }
  export interface ImportWorkspaceImageResult {
    /**
     * The identifier of the WorkSpace image.
     */
    ImageId?: WorkspaceImageId;
  }
  export type Ios2XLogo = Buffer|Uint8Array|Blob|string;
  export type Ios3XLogo = Buffer|Uint8Array|Blob|string;
  export interface IosClientBrandingAttributes {
    /**
     * The logo. This is the standard-resolution display that has a 1:1 pixel density (or @1x), where one pixel is equal to one point. The only image format accepted is a binary data object that is converted from a .png file.
     */
    LogoUrl?: ClientUrl;
    /**
     * The @2x version of the logo. This is the higher resolution display that offers a scale factor of 2.0 (or @2x). The only image format accepted is a binary data object that is converted from a .png file.   For more information about iOS image size and resolution, see Image Size and Resolution  in the Apple Human Interface Guidelines. 
     */
    Logo2xUrl?: ClientUrl;
    /**
     * The @3x version of the logo. This is the higher resolution display that offers a scale factor of 3.0 (or @3x).The only image format accepted is a binary data object that is converted from a .png file.   For more information about iOS image size and resolution, see Image Size and Resolution  in the Apple Human Interface Guidelines. 
     */
    Logo3xUrl?: ClientUrl;
    /**
     * The support email. The company's customer support email address.    In each platform type, the SupportEmail and SupportLink parameters are mutually exclusive. You can specify one parameter for each platform type, but not both.   The default email is workspaces-feedback@amazon.com.   
     */
    SupportEmail?: ClientEmail;
    /**
     * The support link. The link for the company's customer support page for their WorkSpace.    In each platform type, the SupportEmail and SupportLink parameters are mutually exclusive. You can specify one parameter for each platform type, but not both.   The default support link is workspaces-feedback@amazon.com.   
     */
    SupportLink?: ClientUrl;
    /**
     * The forgotten password link. This is the web address that users can go to if they forget the password for their WorkSpace.
     */
    ForgotPasswordLink?: ClientUrl;
    /**
     * The login message. Specified as a key value pair, in which the key is a locale and the value is the localized message for that locale. The only key supported is en_US. The HTML tags supported include the following: a, b, blockquote, br, cite, code, dd, dl, dt, div, em, i, li, ol, p, pre, q, small, span, strike, strong, sub, sup, u, ul.
     */
    LoginMessage?: LoginMessage;
  }
  export interface IosImportClientBrandingAttributes {
    /**
     * The logo. This is the standard-resolution display that has a 1:1 pixel density (or @1x), where one pixel is equal to one point. The only image format accepted is a binary data object that is converted from a .png file.
     */
    Logo?: IosLogo;
    /**
     * The @2x version of the logo. This is the higher resolution display that offers a scale factor of 2.0 (or @2x). The only image format accepted is a binary data object that is converted from a .png file.   For more information about iOS image size and resolution, see Image Size and Resolution  in the Apple Human Interface Guidelines. 
     */
    Logo2x?: Ios2XLogo;
    /**
     * The @3x version of the logo. This is the higher resolution display that offers a scale factor of 3.0 (or @3x). The only image format accepted is a binary data object that is converted from a .png file.   For more information about iOS image size and resolution, see Image Size and Resolution  in the Apple Human Interface Guidelines. 
     */
    Logo3x?: Ios3XLogo;
    /**
     * The support email. The company's customer support email address.    In each platform type, the SupportEmail and SupportLink parameters are mutually exclusive. You can specify one parameter for each platform type, but not both.   The default email is workspaces-feedback@amazon.com.   
     */
    SupportEmail?: ClientEmail;
    /**
     * The support link. The link for the company's customer support page for their WorkSpace.    In each platform type, the SupportEmail and SupportLink parameters are mutually exclusive. You can specify one parameter for each platform type, but not both.   The default support link is workspaces-feedback@amazon.com.   
     */
    SupportLink?: ClientUrl;
    /**
     * The forgotten password link. This is the web address that users can go to if they forget the password for their WorkSpace.
     */
    ForgotPasswordLink?: ClientUrl;
    /**
     * The login message. Specified as a key value pair, in which the key is a locale and the value is the localized message for that locale. The only key supported is en_US. The HTML tags supported include the following: a, b, blockquote, br, cite, code, dd, dl, dt, div, em, i, li, ol, p, pre, q, small, span, strike, strong, sub, sup, u, ul.
     */
    LoginMessage?: LoginMessage;
  }
  export type IosLogo = Buffer|Uint8Array|Blob|string;
  export type IpAddress = string;
  export type IpGroupDesc = string;
  export type IpGroupId = string;
  export type IpGroupIdList = IpGroupId[];
  export type IpGroupName = string;
  export type IpRevokedRuleList = IpRule[];
  export type IpRule = string;
  export type IpRuleDesc = string;
  export interface IpRuleItem {
    /**
     * The IP address range, in CIDR notation.
     */
    ipRule?: IpRule;
    /**
     * The description.
     */
    ruleDesc?: IpRuleDesc;
  }
  export type IpRuleList = IpRuleItem[];
  export type Limit = number;
  export interface ListAvailableManagementCidrRangesRequest {
    /**
     * The IP address range to search. Specify an IP address range that is compatible with your network and in CIDR notation (that is, specify the range as an IPv4 CIDR block).
     */
    ManagementCidrRangeConstraint: ManagementCidrRangeConstraint;
    /**
     * The maximum number of items to return.
     */
    MaxResults?: ManagementCidrRangeMaxResults;
    /**
     * If you received a NextToken from a previous call that was paginated, provide this token to receive the next set of results.
     */
    NextToken?: PaginationToken;
  }
  export interface ListAvailableManagementCidrRangesResult {
    /**
     * The list of available IP address ranges, specified as IPv4 CIDR blocks.
     */
    ManagementCidrRanges?: DedicatedTenancyCidrRangeList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export type LogUploadEnum = "ENABLED"|"DISABLED"|string;
  export type LoginMessage = {[key: string]: ClientLoginMessage};
  export type ManagementCidrRangeConstraint = string;
  export type ManagementCidrRangeMaxResults = number;
  export interface MigrateWorkspaceRequest {
    /**
     * The identifier of the WorkSpace to migrate from.
     */
    SourceWorkspaceId: WorkspaceId;
    /**
     * The identifier of the target bundle type to migrate the WorkSpace to.
     */
    BundleId: BundleId;
  }
  export interface MigrateWorkspaceResult {
    /**
     * The original identifier of the WorkSpace that is being migrated.
     */
    SourceWorkspaceId?: WorkspaceId;
    /**
     * The new identifier of the WorkSpace that is being migrated. If the migration does not succeed, the target WorkSpace ID will not be used, and the WorkSpace will still have the original WorkSpace ID.
     */
    TargetWorkspaceId?: WorkspaceId;
  }
  export type ModificationResourceEnum = "ROOT_VOLUME"|"USER_VOLUME"|"COMPUTE_TYPE"|string;
  export interface ModificationState {
    /**
     * The resource.
     */
    Resource?: ModificationResourceEnum;
    /**
     * The modification state.
     */
    State?: ModificationStateEnum;
  }
  export type ModificationStateEnum = "UPDATE_INITIATED"|"UPDATE_IN_PROGRESS"|string;
  export type ModificationStateList = ModificationState[];
  export interface ModifyAccountRequest {
    /**
     * The status of BYOL.
     */
    DedicatedTenancySupport?: DedicatedTenancySupportEnum;
    /**
     * The IP address range, specified as an IPv4 CIDR block, for the management network interface. Specify an IP address range that is compatible with your network and in CIDR notation (that is, specify the range as an IPv4 CIDR block). The CIDR block size must be /16 (for example, 203.0.113.25/16). It must also be specified as available by the ListAvailableManagementCidrRanges operation.
     */
    DedicatedTenancyManagementCidrRange?: DedicatedTenancyManagementCidrRange;
  }
  export interface ModifyAccountResult {
  }
  export interface ModifyCertificateBasedAuthPropertiesRequest {
    /**
     * The resource identifiers, in the form of directory IDs.
     */
    ResourceId: DirectoryId;
    /**
     * The properties of the certificate-based authentication.
     */
    CertificateBasedAuthProperties?: CertificateBasedAuthProperties;
    /**
     * The properties of the certificate-based authentication you want to delete.
     */
    PropertiesToDelete?: DeletableCertificateBasedAuthPropertiesList;
  }
  export interface ModifyCertificateBasedAuthPropertiesResult {
  }
  export interface ModifyClientPropertiesRequest {
    /**
     * The resource identifiers, in the form of directory IDs.
     */
    ResourceId: NonEmptyString;
    /**
     * Information about the Amazon WorkSpaces client.
     */
    ClientProperties: ClientProperties;
  }
  export interface ModifyClientPropertiesResult {
  }
  export interface ModifySamlPropertiesRequest {
    /**
     * The directory identifier for which you want to configure SAML properties.
     */
    ResourceId: DirectoryId;
    /**
     * The properties for configuring SAML 2.0 authentication.
     */
    SamlProperties?: SamlProperties;
    /**
     * The SAML properties to delete as part of your request. Specify one of the following options:    SAML_PROPERTIES_USER_ACCESS_URL to delete the user access URL.    SAML_PROPERTIES_RELAY_STATE_PARAMETER_NAME to delete the relay state parameter name.  
     */
    PropertiesToDelete?: DeletableSamlPropertiesList;
  }
  export interface ModifySamlPropertiesResult {
  }
  export interface ModifySelfservicePermissionsRequest {
    /**
     * The identifier of the directory.
     */
    ResourceId: DirectoryId;
    /**
     * The permissions to enable or disable self-service capabilities.
     */
    SelfservicePermissions: SelfservicePermissions;
  }
  export interface ModifySelfservicePermissionsResult {
  }
  export interface ModifyWorkspaceAccessPropertiesRequest {
    /**
     * The identifier of the directory.
     */
    ResourceId: DirectoryId;
    /**
     * The device types and operating systems to enable or disable for access.
     */
    WorkspaceAccessProperties: WorkspaceAccessProperties;
  }
  export interface ModifyWorkspaceAccessPropertiesResult {
  }
  export interface ModifyWorkspaceCreationPropertiesRequest {
    /**
     * The identifier of the directory.
     */
    ResourceId: DirectoryId;
    /**
     * The default properties for creating WorkSpaces.
     */
    WorkspaceCreationProperties: WorkspaceCreationProperties;
  }
  export interface ModifyWorkspaceCreationPropertiesResult {
  }
  export interface ModifyWorkspacePropertiesRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
    /**
     * The properties of the WorkSpace.
     */
    WorkspaceProperties: WorkspaceProperties;
  }
  export interface ModifyWorkspacePropertiesResult {
  }
  export interface ModifyWorkspaceStateRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
    /**
     * The WorkSpace state.
     */
    WorkspaceState: TargetWorkspaceState;
  }
  export interface ModifyWorkspaceStateResult {
  }
  export type NonEmptyString = string;
  export interface OperatingSystem {
    /**
     * The operating system.
     */
    Type?: OperatingSystemType;
  }
  export type OperatingSystemName = "AMAZON_LINUX_2"|"UBUNTU_18_04"|"UBUNTU_20_04"|"UBUNTU_22_04"|"UNKNOWN"|"WINDOWS_10"|"WINDOWS_11"|"WINDOWS_7"|"WINDOWS_SERVER_2016"|"WINDOWS_SERVER_2019"|"WINDOWS_SERVER_2022"|string;
  export type OperatingSystemNameList = OperatingSystemName[];
  export type OperatingSystemType = "WINDOWS"|"LINUX"|string;
  export type PaginationToken = string;
  export interface PendingCreateStandbyWorkspacesRequest {
    /**
     * Describes the standby WorkSpace that was created. Because this operation is asynchronous, the identifier returned is not immediately available for use with other operations. For example, if you call  DescribeWorkspaces before the WorkSpace is created, the information returned can be incomplete. 
     */
    UserName?: UserName;
    /**
     * The identifier of the directory for the standby WorkSpace.
     */
    DirectoryId?: DirectoryId;
    /**
     * The operational state of the standby WorkSpace.
     */
    State?: WorkspaceState;
    /**
     * The identifier of the standby WorkSpace.
     */
    WorkspaceId?: WorkspaceId;
  }
  export type PendingCreateStandbyWorkspacesRequestList = PendingCreateStandbyWorkspacesRequest[];
  export type Protocol = "PCOIP"|"WSP"|string;
  export type ProtocolList = Protocol[];
  export interface RebootRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
  }
  export type RebootWorkspaceRequests = RebootRequest[];
  export interface RebootWorkspacesRequest {
    /**
     * The WorkSpaces to reboot. You can specify up to 25 WorkSpaces.
     */
    RebootWorkspaceRequests: RebootWorkspaceRequests;
  }
  export interface RebootWorkspacesResult {
    /**
     * Information about the WorkSpaces that could not be rebooted.
     */
    FailedRequests?: FailedRebootWorkspaceRequests;
  }
  export interface RebuildRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
  }
  export type RebuildWorkspaceRequests = RebuildRequest[];
  export interface RebuildWorkspacesRequest {
    /**
     * The WorkSpace to rebuild. You can specify a single WorkSpace.
     */
    RebuildWorkspaceRequests: RebuildWorkspaceRequests;
  }
  export interface RebuildWorkspacesResult {
    /**
     * Information about the WorkSpace that could not be rebuilt.
     */
    FailedRequests?: FailedRebuildWorkspaceRequests;
  }
  export type ReconnectEnum = "ENABLED"|"DISABLED"|string;
  export type Region = string;
  export interface RegisterWorkspaceDirectoryRequest {
    /**
     * The identifier of the directory. You cannot register a directory if it does not have a status of Active. If the directory does not have a status of Active, you will receive an InvalidResourceStateException error. If you have already registered the maximum number of directories that you can register with Amazon WorkSpaces, you will receive a ResourceLimitExceededException error. Deregister directories that you are not using for WorkSpaces, and try again.
     */
    DirectoryId: DirectoryId;
    /**
     * The identifiers of the subnets for your virtual private cloud (VPC). Make sure that the subnets are in supported Availability Zones. The subnets must also be in separate Availability Zones. If these conditions are not met, you will receive an OperationNotSupportedException error.
     */
    SubnetIds?: SubnetIds;
    /**
     * Indicates whether Amazon WorkDocs is enabled or disabled. If you have enabled this parameter and WorkDocs is not available in the Region, you will receive an OperationNotSupportedException error. Set EnableWorkDocs to disabled, and try again.
     */
    EnableWorkDocs: BooleanObject;
    /**
     * Indicates whether self-service capabilities are enabled or disabled.
     */
    EnableSelfService?: BooleanObject;
    /**
     * Indicates whether your WorkSpace directory is dedicated or shared. To use Bring Your Own License (BYOL) images, this value must be set to DEDICATED and your Amazon Web Services account must be enabled for BYOL. If your account has not been enabled for BYOL, you will receive an InvalidParameterValuesException error. For more information about BYOL images, see Bring Your Own Windows Desktop Images.
     */
    Tenancy?: Tenancy;
    /**
     * The tags associated with the directory.
     */
    Tags?: TagList;
  }
  export interface RegisterWorkspaceDirectoryResult {
  }
  export type RegistrationCode = string;
  export interface RelatedWorkspaceProperties {
    /**
     * The identifier of the related WorkSpace.
     */
    WorkspaceId?: WorkspaceId;
    /**
     * The Region of the related WorkSpace.
     */
    Region?: Region;
    /**
     * Indicates the state of the WorkSpace.
     */
    State?: WorkspaceState;
    /**
     * Indicates the type of WorkSpace.
     */
    Type?: StandbyWorkspaceRelationshipType;
  }
  export type RelatedWorkspaces = RelatedWorkspaceProperties[];
  export type ResourceIdList = NonEmptyString[];
  export interface RestoreWorkspaceRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
  }
  export interface RestoreWorkspaceResult {
  }
  export interface RevokeIpRulesRequest {
    /**
     * The identifier of the group.
     */
    GroupId: IpGroupId;
    /**
     * The rules to remove from the group.
     */
    UserRules: IpRevokedRuleList;
  }
  export interface RevokeIpRulesResult {
  }
  export interface RootStorage {
    /**
     * The size of the root volume.
     */
    Capacity?: NonEmptyString;
  }
  export type RootVolumeSizeGib = number;
  export type RunningMode = "AUTO_STOP"|"ALWAYS_ON"|"MANUAL"|string;
  export type RunningModeAutoStopTimeoutInMinutes = number;
  export interface SamlProperties {
    /**
     * Indicates the status of SAML 2.0 authentication. These statuses include the following.   If the setting is DISABLED, end users will be directed to login with their directory credentials.   If the setting is ENABLED, end users will be directed to login via the user access URL. Users attempting to connect to WorkSpaces from a client application that does not support SAML 2.0 authentication will not be able to connect.   If the setting is ENABLED_WITH_DIRECTORY_LOGIN_FALLBACK, end users will be directed to login via the user access URL on supported client applications, but will not prevent clients that do not support SAML 2.0 authentication from connecting as if SAML 2.0 authentication was disabled.  
     */
    Status?: SamlStatusEnum;
    /**
     * The SAML 2.0 identity provider (IdP) user access URL is the URL a user would navigate to in their web browser in order to federate from the IdP and directly access the application, without any SAML 2.0 service provider (SP) bindings.
     */
    UserAccessUrl?: SamlUserAccessUrl;
    /**
     * The relay state parameter name supported by the SAML 2.0 identity provider (IdP). When the end user is redirected to the user access URL from the WorkSpaces client application, this relay state parameter name is appended as a query parameter to the URL along with the relay state endpoint to return the user to the client application session. To use SAML 2.0 authentication with WorkSpaces, the IdP must support IdP-initiated deep linking for the relay state URL. Consult your IdP documentation for more information.
     */
    RelayStateParameterName?: NonEmptyString;
  }
  export type SamlStatusEnum = "DISABLED"|"ENABLED"|"ENABLED_WITH_DIRECTORY_LOGIN_FALLBACK"|string;
  export type SamlUserAccessUrl = string;
  export type SecurityGroupId = string;
  export interface SelfservicePermissions {
    /**
     * Specifies whether users can restart their WorkSpace.
     */
    RestartWorkspace?: ReconnectEnum;
    /**
     * Specifies whether users can increase the volume size of the drives on their WorkSpace.
     */
    IncreaseVolumeSize?: ReconnectEnum;
    /**
     * Specifies whether users can change the compute type (bundle) for their WorkSpace.
     */
    ChangeComputeType?: ReconnectEnum;
    /**
     * Specifies whether users can switch the running mode of their WorkSpace.
     */
    SwitchRunningMode?: ReconnectEnum;
    /**
     * Specifies whether users can rebuild the operating system of a WorkSpace to its original state.
     */
    RebuildWorkspace?: ReconnectEnum;
  }
  export interface Snapshot {
    /**
     * The time when the snapshot was created.
     */
    SnapshotTime?: Timestamp;
  }
  export type SnapshotList = Snapshot[];
  export interface StandbyWorkspace {
    /**
     * The identifier of the standby WorkSpace.
     */
    PrimaryWorkspaceId: WorkspaceId;
    /**
     * The volume encryption key of the standby WorkSpace.
     */
    VolumeEncryptionKey?: VolumeEncryptionKey;
    /**
     * The identifier of the directory for the standby WorkSpace.
     */
    DirectoryId: DirectoryId;
    /**
     * The tags associated with the standby WorkSpace.
     */
    Tags?: TagList;
  }
  export type StandbyWorkspaceRelationshipType = "PRIMARY"|"STANDBY"|string;
  export type StandbyWorkspacesList = StandbyWorkspace[];
  export interface StartRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId?: WorkspaceId;
  }
  export type StartWorkspaceRequests = StartRequest[];
  export interface StartWorkspacesRequest {
    /**
     * The WorkSpaces to start. You can specify up to 25 WorkSpaces.
     */
    StartWorkspaceRequests: StartWorkspaceRequests;
  }
  export interface StartWorkspacesResult {
    /**
     * Information about the WorkSpaces that could not be started.
     */
    FailedRequests?: FailedStartWorkspaceRequests;
  }
  export interface StopRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId?: WorkspaceId;
  }
  export type StopWorkspaceRequests = StopRequest[];
  export interface StopWorkspacesRequest {
    /**
     * The WorkSpaces to stop. You can specify up to 25 WorkSpaces.
     */
    StopWorkspaceRequests: StopWorkspaceRequests;
  }
  export interface StopWorkspacesResult {
    /**
     * Information about the WorkSpaces that could not be stopped.
     */
    FailedRequests?: FailedStopWorkspaceRequests;
  }
  export type String2048 = string;
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
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
  export type TagKeyList = NonEmptyString[];
  export type TagList = Tag[];
  export type TagValue = string;
  export type TargetWorkspaceState = "AVAILABLE"|"ADMIN_MAINTENANCE"|string;
  export type Tenancy = "DEDICATED"|"SHARED"|string;
  export interface TerminateRequest {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId: WorkspaceId;
  }
  export type TerminateWorkspaceRequests = TerminateRequest[];
  export interface TerminateWorkspacesRequest {
    /**
     * The WorkSpaces to terminate. You can specify up to 25 WorkSpaces.
     */
    TerminateWorkspaceRequests: TerminateWorkspaceRequests;
  }
  export interface TerminateWorkspacesResult {
    /**
     * Information about the WorkSpaces that could not be terminated.
     */
    FailedRequests?: FailedTerminateWorkspaceRequests;
  }
  export type Timestamp = Date;
  export interface UpdateConnectClientAddInRequest {
    /**
     * The identifier of the client add-in to update.
     */
    AddInId: AmazonUuid;
    /**
     * The directory identifier for which the client add-in is configured.
     */
    ResourceId: DirectoryId;
    /**
     * The name of the client add-in.
     */
    Name?: AddInName;
    /**
     * The endpoint URL of the Amazon Connect client add-in.
     */
    URL?: AddInUrl;
  }
  export interface UpdateConnectClientAddInResult {
  }
  export interface UpdateConnectionAliasPermissionRequest {
    /**
     * The identifier of the connection alias that you want to update permissions for.
     */
    AliasId: ConnectionAliasId;
    /**
     * Indicates whether to share or unshare the connection alias with the specified Amazon Web Services account.
     */
    ConnectionAliasPermission: ConnectionAliasPermission;
  }
  export interface UpdateConnectionAliasPermissionResult {
  }
  export type UpdateDescription = string;
  export interface UpdateResult {
    /**
     * Indicates whether updated drivers or other components are available for the specified WorkSpace image.
     */
    UpdateAvailable?: BooleanObject;
    /**
     * A description of whether updates for the WorkSpace image are pending or available.
     */
    Description?: UpdateDescription;
  }
  export interface UpdateRulesOfIpGroupRequest {
    /**
     * The identifier of the group.
     */
    GroupId: IpGroupId;
    /**
     * One or more rules.
     */
    UserRules: IpRuleList;
  }
  export interface UpdateRulesOfIpGroupResult {
  }
  export interface UpdateWorkspaceBundleRequest {
    /**
     * The identifier of the bundle.
     */
    BundleId?: BundleId;
    /**
     * The identifier of the image.
     */
    ImageId?: WorkspaceImageId;
  }
  export interface UpdateWorkspaceBundleResult {
  }
  export interface UpdateWorkspaceImagePermissionRequest {
    /**
     * The identifier of the image.
     */
    ImageId: WorkspaceImageId;
    /**
     * The permission to copy the image. This permission can be revoked only after an image has been shared.
     */
    AllowCopyImage: BooleanObject;
    /**
     * The identifier of the Amazon Web Services account to share or unshare the image with.  Before sharing the image, confirm that you are sharing to the correct Amazon Web Services account ID. 
     */
    SharedAccountId: AwsAccount;
  }
  export interface UpdateWorkspaceImagePermissionResult {
  }
  export type UserName = string;
  export interface UserStorage {
    /**
     * The size of the user volume.
     */
    Capacity?: NonEmptyString;
  }
  export type UserVolumeSizeGib = number;
  export type VolumeEncryptionKey = string;
  export interface WorkSpaceApplication {
    /**
     * The identifier of the application.
     */
    ApplicationId?: WorkSpaceApplicationId;
    /**
     * The time the application is created.
     */
    Created?: Timestamp;
    /**
     * The description of the WorkSpace application.
     */
    Description?: String2048;
    /**
     * The license availability for the applications.
     */
    LicenseType?: WorkSpaceApplicationLicenseType;
    /**
     * The name of the WorkSpace application.
     */
    Name?: NonEmptyString;
    /**
     * The owner of the WorkSpace application.
     */
    Owner?: WorkSpaceApplicationOwner;
    /**
     * The status of WorkSpace application.
     */
    State?: WorkSpaceApplicationState;
    /**
     * The supported compute types of the WorkSpace application.
     */
    SupportedComputeTypeNames?: ComputeList;
    /**
     * The supported operating systems of the WorkSpace application.
     */
    SupportedOperatingSystemNames?: OperatingSystemNameList;
  }
  export interface WorkSpaceApplicationDeployment {
    /**
     * The associations between the applications and the associated resources.
     */
    Associations?: WorkspaceResourceAssociationList;
  }
  export type WorkSpaceApplicationId = string;
  export type WorkSpaceApplicationIdList = WorkSpaceApplicationId[];
  export type WorkSpaceApplicationLicenseType = "LICENSED"|"UNLICENSED"|string;
  export type WorkSpaceApplicationList = WorkSpaceApplication[];
  export type WorkSpaceApplicationOwner = string;
  export type WorkSpaceApplicationState = "PENDING"|"ERROR"|"AVAILABLE"|"UNINSTALL_ONLY"|string;
  export type WorkSpaceAssociatedResourceType = "APPLICATION"|string;
  export type WorkSpaceAssociatedResourceTypeList = WorkSpaceAssociatedResourceType[];
  export interface Workspace {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId?: WorkspaceId;
    /**
     * The identifier of the Directory Service directory for the WorkSpace.
     */
    DirectoryId?: DirectoryId;
    /**
     * The user for the WorkSpace.
     */
    UserName?: UserName;
    /**
     * The IP address of the WorkSpace.
     */
    IpAddress?: IpAddress;
    /**
     * The operational state of the WorkSpace.  After a WorkSpace is terminated, the TERMINATED state is returned only briefly before the WorkSpace directory metadata is cleaned up, so this state is rarely returned. To confirm that a WorkSpace is terminated, check for the WorkSpace ID by using  DescribeWorkSpaces. If the WorkSpace ID isn't returned, then the WorkSpace has been successfully terminated. 
     */
    State?: WorkspaceState;
    /**
     * The identifier of the bundle used to create the WorkSpace.
     */
    BundleId?: BundleId;
    /**
     * The identifier of the subnet for the WorkSpace.
     */
    SubnetId?: SubnetId;
    /**
     * The text of the error message that is returned if the WorkSpace cannot be created.
     */
    ErrorMessage?: Description;
    /**
     * The error code that is returned if the WorkSpace cannot be created.
     */
    ErrorCode?: WorkspaceErrorCode;
    /**
     * The name of the WorkSpace, as seen by the operating system. The format of this name varies. For more information, see  Launch a WorkSpace. 
     */
    ComputerName?: ComputerName;
    /**
     * The ARN of the symmetric KMS key used to encrypt data stored on your WorkSpace. Amazon WorkSpaces does not support asymmetric KMS keys.
     */
    VolumeEncryptionKey?: VolumeEncryptionKey;
    /**
     * Indicates whether the data stored on the user volume is encrypted.
     */
    UserVolumeEncryptionEnabled?: BooleanObject;
    /**
     * Indicates whether the data stored on the root volume is encrypted.
     */
    RootVolumeEncryptionEnabled?: BooleanObject;
    /**
     * The properties of the WorkSpace.
     */
    WorkspaceProperties?: WorkspaceProperties;
    /**
     * The modification states of the WorkSpace.
     */
    ModificationStates?: ModificationStateList;
    /**
     * The standby WorkSpace or primary WorkSpace related to the specified WorkSpace.
     */
    RelatedWorkspaces?: RelatedWorkspaces;
  }
  export interface WorkspaceAccessProperties {
    /**
     * Indicates whether users can use Windows clients to access their WorkSpaces.
     */
    DeviceTypeWindows?: AccessPropertyValue;
    /**
     * Indicates whether users can use macOS clients to access their WorkSpaces.
     */
    DeviceTypeOsx?: AccessPropertyValue;
    /**
     * Indicates whether users can access their WorkSpaces through a web browser.
     */
    DeviceTypeWeb?: AccessPropertyValue;
    /**
     * Indicates whether users can use iOS devices to access their WorkSpaces.
     */
    DeviceTypeIos?: AccessPropertyValue;
    /**
     * Indicates whether users can use Android and Android-compatible Chrome OS devices to access their WorkSpaces.
     */
    DeviceTypeAndroid?: AccessPropertyValue;
    /**
     * Indicates whether users can use Chromebooks to access their WorkSpaces.
     */
    DeviceTypeChromeOs?: AccessPropertyValue;
    /**
     * Indicates whether users can use zero client devices to access their WorkSpaces.
     */
    DeviceTypeZeroClient?: AccessPropertyValue;
    /**
     * Indicates whether users can use Linux clients to access their WorkSpaces.
     */
    DeviceTypeLinux?: AccessPropertyValue;
  }
  export interface WorkspaceBundle {
    /**
     * The identifier of the bundle.
     */
    BundleId?: BundleId;
    /**
     * The name of the bundle.
     */
    Name?: NonEmptyString;
    /**
     * The owner of the bundle. This is the account identifier of the owner, or AMAZON if the bundle is provided by Amazon Web Services.
     */
    Owner?: BundleOwner;
    /**
     * The description of the bundle.
     */
    Description?: Description;
    /**
     * The identifier of the image that was used to create the bundle.
     */
    ImageId?: WorkspaceImageId;
    /**
     * The size of the root volume.
     */
    RootStorage?: RootStorage;
    /**
     * The size of the user volume.
     */
    UserStorage?: UserStorage;
    /**
     * The compute type of the bundle. For more information, see Amazon WorkSpaces Bundles.
     */
    ComputeType?: ComputeType;
    /**
     * The last time that the bundle was updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The time when the bundle was created.
     */
    CreationTime?: Timestamp;
    /**
     * The state of the WorkSpace bundle.
     */
    State?: WorkspaceBundleState;
    /**
     * The type of WorkSpace bundle.
     */
    BundleType?: BundleType;
  }
  export type WorkspaceBundleDescription = string;
  export type WorkspaceBundleName = string;
  export type WorkspaceBundleState = "AVAILABLE"|"PENDING"|"ERROR"|string;
  export interface WorkspaceConnectionStatus {
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId?: WorkspaceId;
    /**
     * The connection state of the WorkSpace. The connection state is unknown if the WorkSpace is stopped.
     */
    ConnectionState?: ConnectionState;
    /**
     * The timestamp of the connection status check.
     */
    ConnectionStateCheckTimestamp?: Timestamp;
    /**
     * The timestamp of the last known user connection.
     */
    LastKnownUserConnectionTimestamp?: Timestamp;
  }
  export type WorkspaceConnectionStatusList = WorkspaceConnectionStatus[];
  export interface WorkspaceCreationProperties {
    /**
     * Indicates whether Amazon WorkDocs is enabled for your WorkSpaces.  If WorkDocs is already enabled for a WorkSpaces directory and you disable it, new WorkSpaces launched in the directory will not have WorkDocs enabled. However, WorkDocs remains enabled for any existing WorkSpaces, unless you either disable users' access to WorkDocs or you delete the WorkDocs site. To disable users' access to WorkDocs, see Disabling Users in the Amazon WorkDocs Administration Guide. To delete a WorkDocs site, see Deleting a Site in the Amazon WorkDocs Administration Guide. If you enable WorkDocs on a directory that already has existing WorkSpaces, the existing WorkSpaces and any new WorkSpaces that are launched in the directory will have WorkDocs enabled. 
     */
    EnableWorkDocs?: BooleanObject;
    /**
     * Indicates whether internet access is enabled for your WorkSpaces.
     */
    EnableInternetAccess?: BooleanObject;
    /**
     * The default organizational unit (OU) for your WorkSpaces directories. This string must be the full Lightweight Directory Access Protocol (LDAP) distinguished name for the target domain and OU. It must be in the form "OU=value,DC=value,DC=value", where value is any string of characters, and the number of domain components (DCs) is two or more. For example, OU=WorkSpaces_machines,DC=machines,DC=example,DC=com.     To avoid errors, certain characters in the distinguished name must be escaped. For more information, see  Distinguished Names in the Microsoft documentation.   The API doesn't validate whether the OU exists.   
     */
    DefaultOu?: DefaultOu;
    /**
     * The identifier of your custom security group.
     */
    CustomSecurityGroupId?: SecurityGroupId;
    /**
     * Indicates whether users are local administrators of their WorkSpaces.
     */
    UserEnabledAsLocalAdministrator?: BooleanObject;
    /**
     * Indicates whether maintenance mode is enabled for your WorkSpaces. For more information, see WorkSpace Maintenance. 
     */
    EnableMaintenanceMode?: BooleanObject;
  }
  export interface WorkspaceDirectory {
    /**
     * The directory identifier.
     */
    DirectoryId?: DirectoryId;
    /**
     * The directory alias.
     */
    Alias?: Alias;
    /**
     * The name of the directory.
     */
    DirectoryName?: DirectoryName;
    /**
     * The registration code for the directory. This is the code that users enter in their Amazon WorkSpaces client application to connect to the directory.
     */
    RegistrationCode?: RegistrationCode;
    /**
     * The identifiers of the subnets used with the directory.
     */
    SubnetIds?: SubnetIds;
    /**
     * The IP addresses of the DNS servers for the directory.
     */
    DnsIpAddresses?: DnsIpAddresses;
    /**
     * The user name for the service account.
     */
    CustomerUserName?: UserName;
    /**
     * The identifier of the IAM role. This is the role that allows Amazon WorkSpaces to make calls to other services, such as Amazon EC2, on your behalf.
     */
    IamRoleId?: ARN;
    /**
     * The directory type.
     */
    DirectoryType?: WorkspaceDirectoryType;
    /**
     * The identifier of the security group that is assigned to new WorkSpaces.
     */
    WorkspaceSecurityGroupId?: SecurityGroupId;
    /**
     * The state of the directory's registration with Amazon WorkSpaces. After a directory is deregistered, the DEREGISTERED state is returned very briefly before the directory metadata is cleaned up, so this state is rarely returned. To confirm that a directory is deregistered, check for the directory ID by using  DescribeWorkspaceDirectories. If the directory ID isn't returned, then the directory has been successfully deregistered.
     */
    State?: WorkspaceDirectoryState;
    /**
     * The default creation properties for all WorkSpaces in the directory.
     */
    WorkspaceCreationProperties?: DefaultWorkspaceCreationProperties;
    /**
     * The identifiers of the IP access control groups associated with the directory.
     */
    ipGroupIds?: IpGroupIdList;
    /**
     * The devices and operating systems that users can use to access WorkSpaces.
     */
    WorkspaceAccessProperties?: WorkspaceAccessProperties;
    /**
     * Specifies whether the directory is dedicated or shared. To use Bring Your Own License (BYOL), this value must be set to DEDICATED. For more information, see Bring Your Own Windows Desktop Images.
     */
    Tenancy?: Tenancy;
    /**
     * The default self-service permissions for WorkSpaces in the directory.
     */
    SelfservicePermissions?: SelfservicePermissions;
    /**
     * Describes the enablement status, user access URL, and relay state parameter name that are used for configuring federation with an SAML 2.0 identity provider.
     */
    SamlProperties?: SamlProperties;
    /**
     * The certificate-based authentication properties used to authenticate SAML 2.0 Identity Provider (IdP) user identities to Active Directory for WorkSpaces login.
     */
    CertificateBasedAuthProperties?: CertificateBasedAuthProperties;
  }
  export type WorkspaceDirectoryState = "REGISTERING"|"REGISTERED"|"DEREGISTERING"|"DEREGISTERED"|"ERROR"|string;
  export type WorkspaceDirectoryType = "SIMPLE_AD"|"AD_CONNECTOR"|string;
  export type WorkspaceErrorCode = string;
  export type WorkspaceId = string;
  export type WorkspaceIdList = WorkspaceId[];
  export interface WorkspaceImage {
    /**
     * The identifier of the image.
     */
    ImageId?: WorkspaceImageId;
    /**
     * The name of the image.
     */
    Name?: WorkspaceImageName;
    /**
     * The description of the image.
     */
    Description?: WorkspaceImageDescription;
    /**
     * The operating system that the image is running. 
     */
    OperatingSystem?: OperatingSystem;
    /**
     * The status of the image.
     */
    State?: WorkspaceImageState;
    /**
     * Specifies whether the image is running on dedicated hardware. When Bring Your Own License (BYOL) is enabled, this value is set to DEDICATED. For more information, see Bring Your Own Windows Desktop Images.
     */
    RequiredTenancy?: WorkspaceImageRequiredTenancy;
    /**
     * The error code that is returned for the image.
     */
    ErrorCode?: WorkspaceImageErrorCode;
    /**
     * The text of the error message that is returned for the image.
     */
    ErrorMessage?: Description;
    /**
     * The date when the image was created. If the image has been shared, the Amazon Web Services account that the image has been shared with sees the original creation date of the image.
     */
    Created?: Timestamp;
    /**
     * The identifier of the Amazon Web Services account that owns the image.
     */
    OwnerAccountId?: AwsAccount;
    /**
     * The updates (if any) that are available for the specified image.
     */
    Updates?: UpdateResult;
    /**
     * Additional details of the error returned for the image, including the possible causes of the errors and troubleshooting information.
     */
    ErrorDetails?: ErrorDetailsList;
  }
  export type WorkspaceImageDescription = string;
  export type WorkspaceImageErrorCode = string;
  export type WorkspaceImageErrorDetailCode = "OutdatedPowershellVersion"|"OfficeInstalled"|"PCoIPAgentInstalled"|"WindowsUpdatesEnabled"|"AutoMountDisabled"|"WorkspacesBYOLAccountNotFound"|"WorkspacesBYOLAccountDisabled"|"DHCPDisabled"|"DiskFreeSpace"|"AdditionalDrivesAttached"|"OSNotSupported"|"DomainJoined"|"AzureDomainJoined"|"FirewallEnabled"|"VMWareToolsInstalled"|"DiskSizeExceeded"|"IncompatiblePartitioning"|"PendingReboot"|"AutoLogonEnabled"|"RealTimeUniversalDisabled"|"MultipleBootPartition"|"Requires64BitOS"|"ZeroRearmCount"|"InPlaceUpgrade"|"AntiVirusInstalled"|"UEFINotSupported"|string;
  export type WorkspaceImageId = string;
  export type WorkspaceImageIdList = WorkspaceImageId[];
  export type WorkspaceImageIngestionProcess = "BYOL_REGULAR"|"BYOL_GRAPHICS"|"BYOL_GRAPHICSPRO"|"BYOL_GRAPHICS_G4DN"|"BYOL_REGULAR_WSP"|"BYOL_REGULAR_BYOP"|"BYOL_GRAPHICS_G4DN_BYOP"|string;
  export type WorkspaceImageList = WorkspaceImage[];
  export type WorkspaceImageName = string;
  export type WorkspaceImageRequiredTenancy = "DEFAULT"|"DEDICATED"|string;
  export type WorkspaceImageState = "AVAILABLE"|"PENDING"|"ERROR"|string;
  export type WorkspaceList = Workspace[];
  export interface WorkspaceProperties {
    /**
     * The running mode. For more information, see Manage the WorkSpace Running Mode.  The MANUAL value is only supported by Amazon WorkSpaces Core. Contact your account team to be allow-listed to use this value. For more information, see Amazon WorkSpaces Core. 
     */
    RunningMode?: RunningMode;
    /**
     * The time after a user logs off when WorkSpaces are automatically stopped. Configured in 60-minute intervals.
     */
    RunningModeAutoStopTimeoutInMinutes?: RunningModeAutoStopTimeoutInMinutes;
    /**
     * The size of the root volume. For important information about how to modify the size of the root and user volumes, see Modify a WorkSpace.
     */
    RootVolumeSizeGib?: RootVolumeSizeGib;
    /**
     * The size of the user storage. For important information about how to modify the size of the root and user volumes, see Modify a WorkSpace.
     */
    UserVolumeSizeGib?: UserVolumeSizeGib;
    /**
     * The compute type. For more information, see Amazon WorkSpaces Bundles.
     */
    ComputeTypeName?: Compute;
    /**
     * The protocol. For more information, see  Protocols for Amazon WorkSpaces.    Only available for WorkSpaces created with PCoIP bundles.   The Protocols property is case sensitive. Ensure you use PCOIP or WSP.   Unavailable for Windows 7 WorkSpaces and WorkSpaces using GPU-based bundles (Graphics, GraphicsPro, Graphics.g4dn, and GraphicsPro.g4dn).   
     */
    Protocols?: ProtocolList;
    /**
     * The name of the operating system.
     */
    OperatingSystemName?: OperatingSystemName;
  }
  export interface WorkspaceRequest {
    /**
     * The identifier of the Directory Service directory for the WorkSpace. You can use DescribeWorkspaceDirectories to list the available directories.
     */
    DirectoryId: DirectoryId;
    /**
     * The user name of the user for the WorkSpace. This user name must exist in the Directory Service directory for the WorkSpace.
     */
    UserName: UserName;
    /**
     * The identifier of the bundle for the WorkSpace. You can use DescribeWorkspaceBundles to list the available bundles.
     */
    BundleId: BundleId;
    /**
     * The ARN of the symmetric KMS key used to encrypt data stored on your WorkSpace. Amazon WorkSpaces does not support asymmetric KMS keys.
     */
    VolumeEncryptionKey?: VolumeEncryptionKey;
    /**
     * Indicates whether the data stored on the user volume is encrypted.
     */
    UserVolumeEncryptionEnabled?: BooleanObject;
    /**
     * Indicates whether the data stored on the root volume is encrypted.
     */
    RootVolumeEncryptionEnabled?: BooleanObject;
    /**
     * The WorkSpace properties.
     */
    WorkspaceProperties?: WorkspaceProperties;
    /**
     * The tags for the WorkSpace.
     */
    Tags?: TagList;
  }
  export type WorkspaceRequestList = WorkspaceRequest[];
  export interface WorkspaceResourceAssociation {
    /**
     * The identifier of the associated resource.
     */
    AssociatedResourceId?: NonEmptyString;
    /**
     * The resource types of the associated resource.
     */
    AssociatedResourceType?: WorkSpaceAssociatedResourceType;
    /**
     * The time the association is created.
     */
    Created?: Timestamp;
    /**
     * The time the association status was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The status of the WorkSpace resource association.
     */
    State?: AssociationState;
    /**
     * The reason the association deployment failed.
     */
    StateReason?: AssociationStateReason;
    /**
     * The identifier of the WorkSpace.
     */
    WorkspaceId?: WorkspaceId;
  }
  export type WorkspaceResourceAssociationList = WorkspaceResourceAssociation[];
  export type WorkspaceState = "PENDING"|"AVAILABLE"|"IMPAIRED"|"UNHEALTHY"|"REBOOTING"|"STARTING"|"REBUILDING"|"RESTORING"|"MAINTENANCE"|"ADMIN_MAINTENANCE"|"TERMINATING"|"TERMINATED"|"SUSPENDED"|"UPDATING"|"STOPPING"|"STOPPED"|"ERROR"|string;
  export interface WorkspacesIpGroup {
    /**
     * The identifier of the group.
     */
    groupId?: IpGroupId;
    /**
     * The name of the group.
     */
    groupName?: IpGroupName;
    /**
     * The description of the group.
     */
    groupDesc?: IpGroupDesc;
    /**
     * The rules.
     */
    userRules?: IpRuleList;
  }
  export type WorkspacesIpGroupsList = WorkspacesIpGroup[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-04-08"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the WorkSpaces client.
   */
  export import Types = WorkSpaces;
}
export = WorkSpaces;
