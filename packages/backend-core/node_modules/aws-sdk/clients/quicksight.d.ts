import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class QuickSight extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: QuickSight.Types.ClientConfiguration)
  config: Config & QuickSight.Types.ClientConfiguration;
  /**
   * Cancels an ongoing ingestion of data into SPICE.
   */
  cancelIngestion(params: QuickSight.Types.CancelIngestionRequest, callback?: (err: AWSError, data: QuickSight.Types.CancelIngestionResponse) => void): Request<QuickSight.Types.CancelIngestionResponse, AWSError>;
  /**
   * Cancels an ongoing ingestion of data into SPICE.
   */
  cancelIngestion(callback?: (err: AWSError, data: QuickSight.Types.CancelIngestionResponse) => void): Request<QuickSight.Types.CancelIngestionResponse, AWSError>;
  /**
   * Creates Amazon QuickSight customizations the current Amazon Web Services Region. Currently, you can add a custom default theme by using the CreateAccountCustomization or UpdateAccountCustomization API operation. To further customize Amazon QuickSight by removing Amazon QuickSight sample assets and videos for all new users, see Customizing Amazon QuickSight in the Amazon QuickSight User Guide.  You can create customizations for your Amazon Web Services account or, if you specify a namespace, for a Amazon QuickSight namespace instead. Customizations that apply to a namespace always override customizations that apply to an Amazon Web Services account. To find out which customizations apply, use the DescribeAccountCustomization API operation. Before you use the CreateAccountCustomization API operation to add a theme as the namespace default, make sure that you first share the theme with the namespace. If you don't share it with the namespace, the theme isn't visible to your users even if you make it the default theme. To check if the theme is shared, view the current permissions by using the  DescribeThemePermissions  API operation. To share the theme, grant permissions by using the  UpdateThemePermissions  API operation. 
   */
  createAccountCustomization(params: QuickSight.Types.CreateAccountCustomizationRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateAccountCustomizationResponse) => void): Request<QuickSight.Types.CreateAccountCustomizationResponse, AWSError>;
  /**
   * Creates Amazon QuickSight customizations the current Amazon Web Services Region. Currently, you can add a custom default theme by using the CreateAccountCustomization or UpdateAccountCustomization API operation. To further customize Amazon QuickSight by removing Amazon QuickSight sample assets and videos for all new users, see Customizing Amazon QuickSight in the Amazon QuickSight User Guide.  You can create customizations for your Amazon Web Services account or, if you specify a namespace, for a Amazon QuickSight namespace instead. Customizations that apply to a namespace always override customizations that apply to an Amazon Web Services account. To find out which customizations apply, use the DescribeAccountCustomization API operation. Before you use the CreateAccountCustomization API operation to add a theme as the namespace default, make sure that you first share the theme with the namespace. If you don't share it with the namespace, the theme isn't visible to your users even if you make it the default theme. To check if the theme is shared, view the current permissions by using the  DescribeThemePermissions  API operation. To share the theme, grant permissions by using the  UpdateThemePermissions  API operation. 
   */
  createAccountCustomization(callback?: (err: AWSError, data: QuickSight.Types.CreateAccountCustomizationResponse) => void): Request<QuickSight.Types.CreateAccountCustomizationResponse, AWSError>;
  /**
   * Creates an analysis in Amazon QuickSight.
   */
  createAnalysis(params: QuickSight.Types.CreateAnalysisRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateAnalysisResponse) => void): Request<QuickSight.Types.CreateAnalysisResponse, AWSError>;
  /**
   * Creates an analysis in Amazon QuickSight.
   */
  createAnalysis(callback?: (err: AWSError, data: QuickSight.Types.CreateAnalysisResponse) => void): Request<QuickSight.Types.CreateAnalysisResponse, AWSError>;
  /**
   * Creates a dashboard from a template. To first create a template, see the  CreateTemplate  API operation. A dashboard is an entity in Amazon QuickSight that identifies Amazon QuickSight reports, created from analyses. You can share Amazon QuickSight dashboards. With the right permissions, you can create scheduled email reports from them. If you have the correct permissions, you can create a dashboard from a template that exists in a different Amazon Web Services account.
   */
  createDashboard(params: QuickSight.Types.CreateDashboardRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateDashboardResponse) => void): Request<QuickSight.Types.CreateDashboardResponse, AWSError>;
  /**
   * Creates a dashboard from a template. To first create a template, see the  CreateTemplate  API operation. A dashboard is an entity in Amazon QuickSight that identifies Amazon QuickSight reports, created from analyses. You can share Amazon QuickSight dashboards. With the right permissions, you can create scheduled email reports from them. If you have the correct permissions, you can create a dashboard from a template that exists in a different Amazon Web Services account.
   */
  createDashboard(callback?: (err: AWSError, data: QuickSight.Types.CreateDashboardResponse) => void): Request<QuickSight.Types.CreateDashboardResponse, AWSError>;
  /**
   * Creates a dataset.
   */
  createDataSet(params: QuickSight.Types.CreateDataSetRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateDataSetResponse) => void): Request<QuickSight.Types.CreateDataSetResponse, AWSError>;
  /**
   * Creates a dataset.
   */
  createDataSet(callback?: (err: AWSError, data: QuickSight.Types.CreateDataSetResponse) => void): Request<QuickSight.Types.CreateDataSetResponse, AWSError>;
  /**
   * Creates a data source.
   */
  createDataSource(params: QuickSight.Types.CreateDataSourceRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateDataSourceResponse) => void): Request<QuickSight.Types.CreateDataSourceResponse, AWSError>;
  /**
   * Creates a data source.
   */
  createDataSource(callback?: (err: AWSError, data: QuickSight.Types.CreateDataSourceResponse) => void): Request<QuickSight.Types.CreateDataSourceResponse, AWSError>;
  /**
   * Creates an empty shared folder.
   */
  createFolder(params: QuickSight.Types.CreateFolderRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateFolderResponse) => void): Request<QuickSight.Types.CreateFolderResponse, AWSError>;
  /**
   * Creates an empty shared folder.
   */
  createFolder(callback?: (err: AWSError, data: QuickSight.Types.CreateFolderResponse) => void): Request<QuickSight.Types.CreateFolderResponse, AWSError>;
  /**
   * Adds an asset, such as a dashboard, analysis, or dataset into a folder.
   */
  createFolderMembership(params: QuickSight.Types.CreateFolderMembershipRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateFolderMembershipResponse) => void): Request<QuickSight.Types.CreateFolderMembershipResponse, AWSError>;
  /**
   * Adds an asset, such as a dashboard, analysis, or dataset into a folder.
   */
  createFolderMembership(callback?: (err: AWSError, data: QuickSight.Types.CreateFolderMembershipResponse) => void): Request<QuickSight.Types.CreateFolderMembershipResponse, AWSError>;
  /**
   * Creates an Amazon QuickSight group. The permissions resource is arn:aws:quicksight:us-east-1:&lt;relevant-aws-account-id&gt;:group/default/&lt;group-name&gt; . The response is a group object.
   */
  createGroup(params: QuickSight.Types.CreateGroupRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateGroupResponse) => void): Request<QuickSight.Types.CreateGroupResponse, AWSError>;
  /**
   * Creates an Amazon QuickSight group. The permissions resource is arn:aws:quicksight:us-east-1:&lt;relevant-aws-account-id&gt;:group/default/&lt;group-name&gt; . The response is a group object.
   */
  createGroup(callback?: (err: AWSError, data: QuickSight.Types.CreateGroupResponse) => void): Request<QuickSight.Types.CreateGroupResponse, AWSError>;
  /**
   * Adds an Amazon QuickSight user to an Amazon QuickSight group. 
   */
  createGroupMembership(params: QuickSight.Types.CreateGroupMembershipRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateGroupMembershipResponse) => void): Request<QuickSight.Types.CreateGroupMembershipResponse, AWSError>;
  /**
   * Adds an Amazon QuickSight user to an Amazon QuickSight group. 
   */
  createGroupMembership(callback?: (err: AWSError, data: QuickSight.Types.CreateGroupMembershipResponse) => void): Request<QuickSight.Types.CreateGroupMembershipResponse, AWSError>;
  /**
   * Creates an assignment with one specified IAMpolicy, identified by its Amazon Resource Name (ARN). This policy assignment is attached to the specified groups or users of Amazon QuickSight. Assignment names are unique per Amazon Web Services account. To avoid overwriting rules in other namespaces, use assignment names that are unique.
   */
  createIAMPolicyAssignment(params: QuickSight.Types.CreateIAMPolicyAssignmentRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateIAMPolicyAssignmentResponse) => void): Request<QuickSight.Types.CreateIAMPolicyAssignmentResponse, AWSError>;
  /**
   * Creates an assignment with one specified IAMpolicy, identified by its Amazon Resource Name (ARN). This policy assignment is attached to the specified groups or users of Amazon QuickSight. Assignment names are unique per Amazon Web Services account. To avoid overwriting rules in other namespaces, use assignment names that are unique.
   */
  createIAMPolicyAssignment(callback?: (err: AWSError, data: QuickSight.Types.CreateIAMPolicyAssignmentResponse) => void): Request<QuickSight.Types.CreateIAMPolicyAssignmentResponse, AWSError>;
  /**
   * Creates and starts a new SPICE ingestion on a dataset Any ingestions operating on tagged datasets inherit the same tags automatically for use in access control. For an example, see How do I create an IAM policy to control access to Amazon EC2 resources using tags? in the Amazon Web Services Knowledge Center. Tags are visible on the tagged dataset, but not on the ingestion resource.
   */
  createIngestion(params: QuickSight.Types.CreateIngestionRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateIngestionResponse) => void): Request<QuickSight.Types.CreateIngestionResponse, AWSError>;
  /**
   * Creates and starts a new SPICE ingestion on a dataset Any ingestions operating on tagged datasets inherit the same tags automatically for use in access control. For an example, see How do I create an IAM policy to control access to Amazon EC2 resources using tags? in the Amazon Web Services Knowledge Center. Tags are visible on the tagged dataset, but not on the ingestion resource.
   */
  createIngestion(callback?: (err: AWSError, data: QuickSight.Types.CreateIngestionResponse) => void): Request<QuickSight.Types.CreateIngestionResponse, AWSError>;
  /**
   * (Enterprise edition only) Creates a new namespace for you to use with Amazon QuickSight. A namespace allows you to isolate the Amazon QuickSight users and groups that are registered for that namespace. Users that access the namespace can share assets only with other users or groups in the same namespace. They can't see users and groups in other namespaces. You can create a namespace after your Amazon Web Services account is subscribed to Amazon QuickSight. The namespace must be unique within the Amazon Web Services account. By default, there is a limit of 100 namespaces per Amazon Web Services account. To increase your limit, create a ticket with Amazon Web Services Support. 
   */
  createNamespace(params: QuickSight.Types.CreateNamespaceRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateNamespaceResponse) => void): Request<QuickSight.Types.CreateNamespaceResponse, AWSError>;
  /**
   * (Enterprise edition only) Creates a new namespace for you to use with Amazon QuickSight. A namespace allows you to isolate the Amazon QuickSight users and groups that are registered for that namespace. Users that access the namespace can share assets only with other users or groups in the same namespace. They can't see users and groups in other namespaces. You can create a namespace after your Amazon Web Services account is subscribed to Amazon QuickSight. The namespace must be unique within the Amazon Web Services account. By default, there is a limit of 100 namespaces per Amazon Web Services account. To increase your limit, create a ticket with Amazon Web Services Support. 
   */
  createNamespace(callback?: (err: AWSError, data: QuickSight.Types.CreateNamespaceResponse) => void): Request<QuickSight.Types.CreateNamespaceResponse, AWSError>;
  /**
   * Creates a template from an existing Amazon QuickSight analysis or template. You can use the resulting template to create a dashboard. A template is an entity in Amazon QuickSight that encapsulates the metadata required to create an analysis and that you can use to create s dashboard. A template adds a layer of abstraction by using placeholders to replace the dataset associated with the analysis. You can use templates to create dashboards by replacing dataset placeholders with datasets that follow the same schema that was used to create the source analysis and template.
   */
  createTemplate(params: QuickSight.Types.CreateTemplateRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateTemplateResponse) => void): Request<QuickSight.Types.CreateTemplateResponse, AWSError>;
  /**
   * Creates a template from an existing Amazon QuickSight analysis or template. You can use the resulting template to create a dashboard. A template is an entity in Amazon QuickSight that encapsulates the metadata required to create an analysis and that you can use to create s dashboard. A template adds a layer of abstraction by using placeholders to replace the dataset associated with the analysis. You can use templates to create dashboards by replacing dataset placeholders with datasets that follow the same schema that was used to create the source analysis and template.
   */
  createTemplate(callback?: (err: AWSError, data: QuickSight.Types.CreateTemplateResponse) => void): Request<QuickSight.Types.CreateTemplateResponse, AWSError>;
  /**
   * Creates a template alias for a template.
   */
  createTemplateAlias(params: QuickSight.Types.CreateTemplateAliasRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateTemplateAliasResponse) => void): Request<QuickSight.Types.CreateTemplateAliasResponse, AWSError>;
  /**
   * Creates a template alias for a template.
   */
  createTemplateAlias(callback?: (err: AWSError, data: QuickSight.Types.CreateTemplateAliasResponse) => void): Request<QuickSight.Types.CreateTemplateAliasResponse, AWSError>;
  /**
   * Creates a theme. A theme is set of configuration options for color and layout. Themes apply to analyses and dashboards. For more information, see Using Themes in Amazon QuickSight in the Amazon QuickSight User Guide.
   */
  createTheme(params: QuickSight.Types.CreateThemeRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateThemeResponse) => void): Request<QuickSight.Types.CreateThemeResponse, AWSError>;
  /**
   * Creates a theme. A theme is set of configuration options for color and layout. Themes apply to analyses and dashboards. For more information, see Using Themes in Amazon QuickSight in the Amazon QuickSight User Guide.
   */
  createTheme(callback?: (err: AWSError, data: QuickSight.Types.CreateThemeResponse) => void): Request<QuickSight.Types.CreateThemeResponse, AWSError>;
  /**
   * Creates a theme alias for a theme.
   */
  createThemeAlias(params: QuickSight.Types.CreateThemeAliasRequest, callback?: (err: AWSError, data: QuickSight.Types.CreateThemeAliasResponse) => void): Request<QuickSight.Types.CreateThemeAliasResponse, AWSError>;
  /**
   * Creates a theme alias for a theme.
   */
  createThemeAlias(callback?: (err: AWSError, data: QuickSight.Types.CreateThemeAliasResponse) => void): Request<QuickSight.Types.CreateThemeAliasResponse, AWSError>;
  /**
   * Deletes all Amazon QuickSight customizations in this Amazon Web Services Region for the specified Amazon Web Services account and Amazon QuickSight namespace.
   */
  deleteAccountCustomization(params: QuickSight.Types.DeleteAccountCustomizationRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteAccountCustomizationResponse) => void): Request<QuickSight.Types.DeleteAccountCustomizationResponse, AWSError>;
  /**
   * Deletes all Amazon QuickSight customizations in this Amazon Web Services Region for the specified Amazon Web Services account and Amazon QuickSight namespace.
   */
  deleteAccountCustomization(callback?: (err: AWSError, data: QuickSight.Types.DeleteAccountCustomizationResponse) => void): Request<QuickSight.Types.DeleteAccountCustomizationResponse, AWSError>;
  /**
   * Deletes an analysis from Amazon QuickSight. You can optionally include a recovery window during which you can restore the analysis. If you don't specify a recovery window value, the operation defaults to 30 days. Amazon QuickSight attaches a DeletionTime stamp to the response that specifies the end of the recovery window. At the end of the recovery window, Amazon QuickSight deletes the analysis permanently. At any time before recovery window ends, you can use the RestoreAnalysis API operation to remove the DeletionTime stamp and cancel the deletion of the analysis. The analysis remains visible in the API until it's deleted, so you can describe it but you can't make a template from it. An analysis that's scheduled for deletion isn't accessible in the Amazon QuickSight console. To access it in the console, restore it. Deleting an analysis doesn't delete the dashboards that you publish from it.
   */
  deleteAnalysis(params: QuickSight.Types.DeleteAnalysisRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteAnalysisResponse) => void): Request<QuickSight.Types.DeleteAnalysisResponse, AWSError>;
  /**
   * Deletes an analysis from Amazon QuickSight. You can optionally include a recovery window during which you can restore the analysis. If you don't specify a recovery window value, the operation defaults to 30 days. Amazon QuickSight attaches a DeletionTime stamp to the response that specifies the end of the recovery window. At the end of the recovery window, Amazon QuickSight deletes the analysis permanently. At any time before recovery window ends, you can use the RestoreAnalysis API operation to remove the DeletionTime stamp and cancel the deletion of the analysis. The analysis remains visible in the API until it's deleted, so you can describe it but you can't make a template from it. An analysis that's scheduled for deletion isn't accessible in the Amazon QuickSight console. To access it in the console, restore it. Deleting an analysis doesn't delete the dashboards that you publish from it.
   */
  deleteAnalysis(callback?: (err: AWSError, data: QuickSight.Types.DeleteAnalysisResponse) => void): Request<QuickSight.Types.DeleteAnalysisResponse, AWSError>;
  /**
   * Deletes a dashboard.
   */
  deleteDashboard(params: QuickSight.Types.DeleteDashboardRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteDashboardResponse) => void): Request<QuickSight.Types.DeleteDashboardResponse, AWSError>;
  /**
   * Deletes a dashboard.
   */
  deleteDashboard(callback?: (err: AWSError, data: QuickSight.Types.DeleteDashboardResponse) => void): Request<QuickSight.Types.DeleteDashboardResponse, AWSError>;
  /**
   * Deletes a dataset.
   */
  deleteDataSet(params: QuickSight.Types.DeleteDataSetRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteDataSetResponse) => void): Request<QuickSight.Types.DeleteDataSetResponse, AWSError>;
  /**
   * Deletes a dataset.
   */
  deleteDataSet(callback?: (err: AWSError, data: QuickSight.Types.DeleteDataSetResponse) => void): Request<QuickSight.Types.DeleteDataSetResponse, AWSError>;
  /**
   * Deletes the data source permanently. This operation breaks all the datasets that reference the deleted data source.
   */
  deleteDataSource(params: QuickSight.Types.DeleteDataSourceRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteDataSourceResponse) => void): Request<QuickSight.Types.DeleteDataSourceResponse, AWSError>;
  /**
   * Deletes the data source permanently. This operation breaks all the datasets that reference the deleted data source.
   */
  deleteDataSource(callback?: (err: AWSError, data: QuickSight.Types.DeleteDataSourceResponse) => void): Request<QuickSight.Types.DeleteDataSourceResponse, AWSError>;
  /**
   * Deletes an empty folder.
   */
  deleteFolder(params: QuickSight.Types.DeleteFolderRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteFolderResponse) => void): Request<QuickSight.Types.DeleteFolderResponse, AWSError>;
  /**
   * Deletes an empty folder.
   */
  deleteFolder(callback?: (err: AWSError, data: QuickSight.Types.DeleteFolderResponse) => void): Request<QuickSight.Types.DeleteFolderResponse, AWSError>;
  /**
   * Removes an asset, such as a dashboard, analysis, or dataset, from a folder.
   */
  deleteFolderMembership(params: QuickSight.Types.DeleteFolderMembershipRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteFolderMembershipResponse) => void): Request<QuickSight.Types.DeleteFolderMembershipResponse, AWSError>;
  /**
   * Removes an asset, such as a dashboard, analysis, or dataset, from a folder.
   */
  deleteFolderMembership(callback?: (err: AWSError, data: QuickSight.Types.DeleteFolderMembershipResponse) => void): Request<QuickSight.Types.DeleteFolderMembershipResponse, AWSError>;
  /**
   * Removes a user group from Amazon QuickSight. 
   */
  deleteGroup(params: QuickSight.Types.DeleteGroupRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteGroupResponse) => void): Request<QuickSight.Types.DeleteGroupResponse, AWSError>;
  /**
   * Removes a user group from Amazon QuickSight. 
   */
  deleteGroup(callback?: (err: AWSError, data: QuickSight.Types.DeleteGroupResponse) => void): Request<QuickSight.Types.DeleteGroupResponse, AWSError>;
  /**
   * Removes a user from a group so that the user is no longer a member of the group.
   */
  deleteGroupMembership(params: QuickSight.Types.DeleteGroupMembershipRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteGroupMembershipResponse) => void): Request<QuickSight.Types.DeleteGroupMembershipResponse, AWSError>;
  /**
   * Removes a user from a group so that the user is no longer a member of the group.
   */
  deleteGroupMembership(callback?: (err: AWSError, data: QuickSight.Types.DeleteGroupMembershipResponse) => void): Request<QuickSight.Types.DeleteGroupMembershipResponse, AWSError>;
  /**
   * Deletes an existing IAMpolicy assignment.
   */
  deleteIAMPolicyAssignment(params: QuickSight.Types.DeleteIAMPolicyAssignmentRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteIAMPolicyAssignmentResponse) => void): Request<QuickSight.Types.DeleteIAMPolicyAssignmentResponse, AWSError>;
  /**
   * Deletes an existing IAMpolicy assignment.
   */
  deleteIAMPolicyAssignment(callback?: (err: AWSError, data: QuickSight.Types.DeleteIAMPolicyAssignmentResponse) => void): Request<QuickSight.Types.DeleteIAMPolicyAssignmentResponse, AWSError>;
  /**
   * Deletes a namespace and the users and groups that are associated with the namespace. This is an asynchronous process. Assets including dashboards, analyses, datasets and data sources are not deleted. To delete these assets, you use the API operations for the relevant asset. 
   */
  deleteNamespace(params: QuickSight.Types.DeleteNamespaceRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteNamespaceResponse) => void): Request<QuickSight.Types.DeleteNamespaceResponse, AWSError>;
  /**
   * Deletes a namespace and the users and groups that are associated with the namespace. This is an asynchronous process. Assets including dashboards, analyses, datasets and data sources are not deleted. To delete these assets, you use the API operations for the relevant asset. 
   */
  deleteNamespace(callback?: (err: AWSError, data: QuickSight.Types.DeleteNamespaceResponse) => void): Request<QuickSight.Types.DeleteNamespaceResponse, AWSError>;
  /**
   * Deletes a template.
   */
  deleteTemplate(params: QuickSight.Types.DeleteTemplateRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteTemplateResponse) => void): Request<QuickSight.Types.DeleteTemplateResponse, AWSError>;
  /**
   * Deletes a template.
   */
  deleteTemplate(callback?: (err: AWSError, data: QuickSight.Types.DeleteTemplateResponse) => void): Request<QuickSight.Types.DeleteTemplateResponse, AWSError>;
  /**
   * Deletes the item that the specified template alias points to. If you provide a specific alias, you delete the version of the template that the alias points to.
   */
  deleteTemplateAlias(params: QuickSight.Types.DeleteTemplateAliasRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteTemplateAliasResponse) => void): Request<QuickSight.Types.DeleteTemplateAliasResponse, AWSError>;
  /**
   * Deletes the item that the specified template alias points to. If you provide a specific alias, you delete the version of the template that the alias points to.
   */
  deleteTemplateAlias(callback?: (err: AWSError, data: QuickSight.Types.DeleteTemplateAliasResponse) => void): Request<QuickSight.Types.DeleteTemplateAliasResponse, AWSError>;
  /**
   * Deletes a theme.
   */
  deleteTheme(params: QuickSight.Types.DeleteThemeRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteThemeResponse) => void): Request<QuickSight.Types.DeleteThemeResponse, AWSError>;
  /**
   * Deletes a theme.
   */
  deleteTheme(callback?: (err: AWSError, data: QuickSight.Types.DeleteThemeResponse) => void): Request<QuickSight.Types.DeleteThemeResponse, AWSError>;
  /**
   * Deletes the version of the theme that the specified theme alias points to. If you provide a specific alias, you delete the version of the theme that the alias points to.
   */
  deleteThemeAlias(params: QuickSight.Types.DeleteThemeAliasRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteThemeAliasResponse) => void): Request<QuickSight.Types.DeleteThemeAliasResponse, AWSError>;
  /**
   * Deletes the version of the theme that the specified theme alias points to. If you provide a specific alias, you delete the version of the theme that the alias points to.
   */
  deleteThemeAlias(callback?: (err: AWSError, data: QuickSight.Types.DeleteThemeAliasResponse) => void): Request<QuickSight.Types.DeleteThemeAliasResponse, AWSError>;
  /**
   * Deletes the Amazon QuickSight user that is associated with the identity of the Identity and Access Management (IAM) user or role that's making the call. The IAM user isn't deleted as a result of this call. 
   */
  deleteUser(params: QuickSight.Types.DeleteUserRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteUserResponse) => void): Request<QuickSight.Types.DeleteUserResponse, AWSError>;
  /**
   * Deletes the Amazon QuickSight user that is associated with the identity of the Identity and Access Management (IAM) user or role that's making the call. The IAM user isn't deleted as a result of this call. 
   */
  deleteUser(callback?: (err: AWSError, data: QuickSight.Types.DeleteUserResponse) => void): Request<QuickSight.Types.DeleteUserResponse, AWSError>;
  /**
   * Deletes a user identified by its principal ID. 
   */
  deleteUserByPrincipalId(params: QuickSight.Types.DeleteUserByPrincipalIdRequest, callback?: (err: AWSError, data: QuickSight.Types.DeleteUserByPrincipalIdResponse) => void): Request<QuickSight.Types.DeleteUserByPrincipalIdResponse, AWSError>;
  /**
   * Deletes a user identified by its principal ID. 
   */
  deleteUserByPrincipalId(callback?: (err: AWSError, data: QuickSight.Types.DeleteUserByPrincipalIdResponse) => void): Request<QuickSight.Types.DeleteUserByPrincipalIdResponse, AWSError>;
  /**
   * Describes the customizations associated with the provided Amazon Web Services account and Amazon Amazon QuickSight namespace in an Amazon Web Services Region. The Amazon QuickSight console evaluates which customizations to apply by running this API operation with the Resolved flag included.  To determine what customizations display when you run this command, it can help to visualize the relationship of the entities involved.     Amazon Web Services account - The Amazon Web Services account exists at the top of the hierarchy. It has the potential to use all of the Amazon Web Services Regions and AWS Services. When you subscribe to Amazon QuickSight, you choose one Amazon Web Services Region to use as your home Region. That's where your free SPICE capacity is located. You can use Amazon QuickSight in any supported Amazon Web Services Region.     Amazon Web Services Region - In each Amazon Web Services Region where you sign in to Amazon QuickSight at least once, Amazon QuickSight acts as a separate instance of the same service. If you have a user directory, it resides in us-east-1, which is the US East (N. Virginia). Generally speaking, these users have access to Amazon QuickSight in any Amazon Web Services Region, unless they are constrained to a namespace.  To run the command in a different Amazon Web Services Region, you change your Region settings. If you're using the AWS CLI, you can use one of the following options:   Use command line options.    Use named profiles.    Run aws configure to change your default Amazon Web Services Region. Use Enter to key the same settings for your keys. For more information, see Configuring the AWS CLI.      Namespace - A Amazon QuickSight namespace is a partition that contains users and assets (data sources, datasets, dashboards, and so on). To access assets that are in a specific namespace, users and groups must also be part of the same namespace. People who share a namespace are completely isolated from users and assets in other namespaces, even if they are in the same Amazon Web Services account and Amazon Web Services Region.    Applied customizations - Within an Amazon Web Services Region, a set of Amazon QuickSight customizations can apply to an Amazon Web Services account or to a namespace. Settings that you apply to a namespace override settings that you apply to an Amazon Web Services account. All settings are isolated to a single Amazon Web Services Region. To apply them in other Amazon Web Services Regions, run the CreateAccountCustomization command in each Amazon Web Services Region where you want to apply the same customizations.   
   */
  describeAccountCustomization(params: QuickSight.Types.DescribeAccountCustomizationRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeAccountCustomizationResponse) => void): Request<QuickSight.Types.DescribeAccountCustomizationResponse, AWSError>;
  /**
   * Describes the customizations associated with the provided Amazon Web Services account and Amazon Amazon QuickSight namespace in an Amazon Web Services Region. The Amazon QuickSight console evaluates which customizations to apply by running this API operation with the Resolved flag included.  To determine what customizations display when you run this command, it can help to visualize the relationship of the entities involved.     Amazon Web Services account - The Amazon Web Services account exists at the top of the hierarchy. It has the potential to use all of the Amazon Web Services Regions and AWS Services. When you subscribe to Amazon QuickSight, you choose one Amazon Web Services Region to use as your home Region. That's where your free SPICE capacity is located. You can use Amazon QuickSight in any supported Amazon Web Services Region.     Amazon Web Services Region - In each Amazon Web Services Region where you sign in to Amazon QuickSight at least once, Amazon QuickSight acts as a separate instance of the same service. If you have a user directory, it resides in us-east-1, which is the US East (N. Virginia). Generally speaking, these users have access to Amazon QuickSight in any Amazon Web Services Region, unless they are constrained to a namespace.  To run the command in a different Amazon Web Services Region, you change your Region settings. If you're using the AWS CLI, you can use one of the following options:   Use command line options.    Use named profiles.    Run aws configure to change your default Amazon Web Services Region. Use Enter to key the same settings for your keys. For more information, see Configuring the AWS CLI.      Namespace - A Amazon QuickSight namespace is a partition that contains users and assets (data sources, datasets, dashboards, and so on). To access assets that are in a specific namespace, users and groups must also be part of the same namespace. People who share a namespace are completely isolated from users and assets in other namespaces, even if they are in the same Amazon Web Services account and Amazon Web Services Region.    Applied customizations - Within an Amazon Web Services Region, a set of Amazon QuickSight customizations can apply to an Amazon Web Services account or to a namespace. Settings that you apply to a namespace override settings that you apply to an Amazon Web Services account. All settings are isolated to a single Amazon Web Services Region. To apply them in other Amazon Web Services Regions, run the CreateAccountCustomization command in each Amazon Web Services Region where you want to apply the same customizations.   
   */
  describeAccountCustomization(callback?: (err: AWSError, data: QuickSight.Types.DescribeAccountCustomizationResponse) => void): Request<QuickSight.Types.DescribeAccountCustomizationResponse, AWSError>;
  /**
   * Describes the settings that were used when your Amazon QuickSight subscription was first created in this Amazon Web Services account.
   */
  describeAccountSettings(params: QuickSight.Types.DescribeAccountSettingsRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeAccountSettingsResponse) => void): Request<QuickSight.Types.DescribeAccountSettingsResponse, AWSError>;
  /**
   * Describes the settings that were used when your Amazon QuickSight subscription was first created in this Amazon Web Services account.
   */
  describeAccountSettings(callback?: (err: AWSError, data: QuickSight.Types.DescribeAccountSettingsResponse) => void): Request<QuickSight.Types.DescribeAccountSettingsResponse, AWSError>;
  /**
   * Provides a summary of the metadata for an analysis.
   */
  describeAnalysis(params: QuickSight.Types.DescribeAnalysisRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeAnalysisResponse) => void): Request<QuickSight.Types.DescribeAnalysisResponse, AWSError>;
  /**
   * Provides a summary of the metadata for an analysis.
   */
  describeAnalysis(callback?: (err: AWSError, data: QuickSight.Types.DescribeAnalysisResponse) => void): Request<QuickSight.Types.DescribeAnalysisResponse, AWSError>;
  /**
   * Provides the read and write permissions for an analysis.
   */
  describeAnalysisPermissions(params: QuickSight.Types.DescribeAnalysisPermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeAnalysisPermissionsResponse) => void): Request<QuickSight.Types.DescribeAnalysisPermissionsResponse, AWSError>;
  /**
   * Provides the read and write permissions for an analysis.
   */
  describeAnalysisPermissions(callback?: (err: AWSError, data: QuickSight.Types.DescribeAnalysisPermissionsResponse) => void): Request<QuickSight.Types.DescribeAnalysisPermissionsResponse, AWSError>;
  /**
   * Provides a summary for a dashboard.
   */
  describeDashboard(params: QuickSight.Types.DescribeDashboardRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeDashboardResponse) => void): Request<QuickSight.Types.DescribeDashboardResponse, AWSError>;
  /**
   * Provides a summary for a dashboard.
   */
  describeDashboard(callback?: (err: AWSError, data: QuickSight.Types.DescribeDashboardResponse) => void): Request<QuickSight.Types.DescribeDashboardResponse, AWSError>;
  /**
   * Describes read and write permissions for a dashboard.
   */
  describeDashboardPermissions(params: QuickSight.Types.DescribeDashboardPermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeDashboardPermissionsResponse) => void): Request<QuickSight.Types.DescribeDashboardPermissionsResponse, AWSError>;
  /**
   * Describes read and write permissions for a dashboard.
   */
  describeDashboardPermissions(callback?: (err: AWSError, data: QuickSight.Types.DescribeDashboardPermissionsResponse) => void): Request<QuickSight.Types.DescribeDashboardPermissionsResponse, AWSError>;
  /**
   * Describes a dataset. 
   */
  describeDataSet(params: QuickSight.Types.DescribeDataSetRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeDataSetResponse) => void): Request<QuickSight.Types.DescribeDataSetResponse, AWSError>;
  /**
   * Describes a dataset. 
   */
  describeDataSet(callback?: (err: AWSError, data: QuickSight.Types.DescribeDataSetResponse) => void): Request<QuickSight.Types.DescribeDataSetResponse, AWSError>;
  /**
   * Describes the permissions on a dataset. The permissions resource is arn:aws:quicksight:region:aws-account-id:dataset/data-set-id.
   */
  describeDataSetPermissions(params: QuickSight.Types.DescribeDataSetPermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeDataSetPermissionsResponse) => void): Request<QuickSight.Types.DescribeDataSetPermissionsResponse, AWSError>;
  /**
   * Describes the permissions on a dataset. The permissions resource is arn:aws:quicksight:region:aws-account-id:dataset/data-set-id.
   */
  describeDataSetPermissions(callback?: (err: AWSError, data: QuickSight.Types.DescribeDataSetPermissionsResponse) => void): Request<QuickSight.Types.DescribeDataSetPermissionsResponse, AWSError>;
  /**
   * Describes a data source.
   */
  describeDataSource(params: QuickSight.Types.DescribeDataSourceRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeDataSourceResponse) => void): Request<QuickSight.Types.DescribeDataSourceResponse, AWSError>;
  /**
   * Describes a data source.
   */
  describeDataSource(callback?: (err: AWSError, data: QuickSight.Types.DescribeDataSourceResponse) => void): Request<QuickSight.Types.DescribeDataSourceResponse, AWSError>;
  /**
   * Describes the resource permissions for a data source.
   */
  describeDataSourcePermissions(params: QuickSight.Types.DescribeDataSourcePermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeDataSourcePermissionsResponse) => void): Request<QuickSight.Types.DescribeDataSourcePermissionsResponse, AWSError>;
  /**
   * Describes the resource permissions for a data source.
   */
  describeDataSourcePermissions(callback?: (err: AWSError, data: QuickSight.Types.DescribeDataSourcePermissionsResponse) => void): Request<QuickSight.Types.DescribeDataSourcePermissionsResponse, AWSError>;
  /**
   * Describes a folder.
   */
  describeFolder(params: QuickSight.Types.DescribeFolderRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeFolderResponse) => void): Request<QuickSight.Types.DescribeFolderResponse, AWSError>;
  /**
   * Describes a folder.
   */
  describeFolder(callback?: (err: AWSError, data: QuickSight.Types.DescribeFolderResponse) => void): Request<QuickSight.Types.DescribeFolderResponse, AWSError>;
  /**
   * Describes permissions for a folder.
   */
  describeFolderPermissions(params: QuickSight.Types.DescribeFolderPermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeFolderPermissionsResponse) => void): Request<QuickSight.Types.DescribeFolderPermissionsResponse, AWSError>;
  /**
   * Describes permissions for a folder.
   */
  describeFolderPermissions(callback?: (err: AWSError, data: QuickSight.Types.DescribeFolderPermissionsResponse) => void): Request<QuickSight.Types.DescribeFolderPermissionsResponse, AWSError>;
  /**
   * Describes the folder resolved permissions. Permissions consists of both folder direct permissions and the inherited permissions from the ancestor folders.
   */
  describeFolderResolvedPermissions(params: QuickSight.Types.DescribeFolderResolvedPermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeFolderResolvedPermissionsResponse) => void): Request<QuickSight.Types.DescribeFolderResolvedPermissionsResponse, AWSError>;
  /**
   * Describes the folder resolved permissions. Permissions consists of both folder direct permissions and the inherited permissions from the ancestor folders.
   */
  describeFolderResolvedPermissions(callback?: (err: AWSError, data: QuickSight.Types.DescribeFolderResolvedPermissionsResponse) => void): Request<QuickSight.Types.DescribeFolderResolvedPermissionsResponse, AWSError>;
  /**
   * Returns an Amazon QuickSight group's description and Amazon Resource Name (ARN). 
   */
  describeGroup(params: QuickSight.Types.DescribeGroupRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeGroupResponse) => void): Request<QuickSight.Types.DescribeGroupResponse, AWSError>;
  /**
   * Returns an Amazon QuickSight group's description and Amazon Resource Name (ARN). 
   */
  describeGroup(callback?: (err: AWSError, data: QuickSight.Types.DescribeGroupResponse) => void): Request<QuickSight.Types.DescribeGroupResponse, AWSError>;
  /**
   * Describes an existing IAMpolicy assignment, as specified by the assignment name.
   */
  describeIAMPolicyAssignment(params: QuickSight.Types.DescribeIAMPolicyAssignmentRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeIAMPolicyAssignmentResponse) => void): Request<QuickSight.Types.DescribeIAMPolicyAssignmentResponse, AWSError>;
  /**
   * Describes an existing IAMpolicy assignment, as specified by the assignment name.
   */
  describeIAMPolicyAssignment(callback?: (err: AWSError, data: QuickSight.Types.DescribeIAMPolicyAssignmentResponse) => void): Request<QuickSight.Types.DescribeIAMPolicyAssignmentResponse, AWSError>;
  /**
   * Describes a SPICE ingestion.
   */
  describeIngestion(params: QuickSight.Types.DescribeIngestionRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeIngestionResponse) => void): Request<QuickSight.Types.DescribeIngestionResponse, AWSError>;
  /**
   * Describes a SPICE ingestion.
   */
  describeIngestion(callback?: (err: AWSError, data: QuickSight.Types.DescribeIngestionResponse) => void): Request<QuickSight.Types.DescribeIngestionResponse, AWSError>;
  /**
   * Provides a summary and status of IP Rules.
   */
  describeIpRestriction(params: QuickSight.Types.DescribeIpRestrictionRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeIpRestrictionResponse) => void): Request<QuickSight.Types.DescribeIpRestrictionResponse, AWSError>;
  /**
   * Provides a summary and status of IP Rules.
   */
  describeIpRestriction(callback?: (err: AWSError, data: QuickSight.Types.DescribeIpRestrictionResponse) => void): Request<QuickSight.Types.DescribeIpRestrictionResponse, AWSError>;
  /**
   * Describes the current namespace.
   */
  describeNamespace(params: QuickSight.Types.DescribeNamespaceRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeNamespaceResponse) => void): Request<QuickSight.Types.DescribeNamespaceResponse, AWSError>;
  /**
   * Describes the current namespace.
   */
  describeNamespace(callback?: (err: AWSError, data: QuickSight.Types.DescribeNamespaceResponse) => void): Request<QuickSight.Types.DescribeNamespaceResponse, AWSError>;
  /**
   * Describes a template's metadata.
   */
  describeTemplate(params: QuickSight.Types.DescribeTemplateRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeTemplateResponse) => void): Request<QuickSight.Types.DescribeTemplateResponse, AWSError>;
  /**
   * Describes a template's metadata.
   */
  describeTemplate(callback?: (err: AWSError, data: QuickSight.Types.DescribeTemplateResponse) => void): Request<QuickSight.Types.DescribeTemplateResponse, AWSError>;
  /**
   * Describes the template alias for a template.
   */
  describeTemplateAlias(params: QuickSight.Types.DescribeTemplateAliasRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeTemplateAliasResponse) => void): Request<QuickSight.Types.DescribeTemplateAliasResponse, AWSError>;
  /**
   * Describes the template alias for a template.
   */
  describeTemplateAlias(callback?: (err: AWSError, data: QuickSight.Types.DescribeTemplateAliasResponse) => void): Request<QuickSight.Types.DescribeTemplateAliasResponse, AWSError>;
  /**
   * Describes read and write permissions on a template.
   */
  describeTemplatePermissions(params: QuickSight.Types.DescribeTemplatePermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeTemplatePermissionsResponse) => void): Request<QuickSight.Types.DescribeTemplatePermissionsResponse, AWSError>;
  /**
   * Describes read and write permissions on a template.
   */
  describeTemplatePermissions(callback?: (err: AWSError, data: QuickSight.Types.DescribeTemplatePermissionsResponse) => void): Request<QuickSight.Types.DescribeTemplatePermissionsResponse, AWSError>;
  /**
   * Describes a theme.
   */
  describeTheme(params: QuickSight.Types.DescribeThemeRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeThemeResponse) => void): Request<QuickSight.Types.DescribeThemeResponse, AWSError>;
  /**
   * Describes a theme.
   */
  describeTheme(callback?: (err: AWSError, data: QuickSight.Types.DescribeThemeResponse) => void): Request<QuickSight.Types.DescribeThemeResponse, AWSError>;
  /**
   * Describes the alias for a theme.
   */
  describeThemeAlias(params: QuickSight.Types.DescribeThemeAliasRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeThemeAliasResponse) => void): Request<QuickSight.Types.DescribeThemeAliasResponse, AWSError>;
  /**
   * Describes the alias for a theme.
   */
  describeThemeAlias(callback?: (err: AWSError, data: QuickSight.Types.DescribeThemeAliasResponse) => void): Request<QuickSight.Types.DescribeThemeAliasResponse, AWSError>;
  /**
   * Describes the read and write permissions for a theme.
   */
  describeThemePermissions(params: QuickSight.Types.DescribeThemePermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeThemePermissionsResponse) => void): Request<QuickSight.Types.DescribeThemePermissionsResponse, AWSError>;
  /**
   * Describes the read and write permissions for a theme.
   */
  describeThemePermissions(callback?: (err: AWSError, data: QuickSight.Types.DescribeThemePermissionsResponse) => void): Request<QuickSight.Types.DescribeThemePermissionsResponse, AWSError>;
  /**
   * Returns information about a user, given the user name. 
   */
  describeUser(params: QuickSight.Types.DescribeUserRequest, callback?: (err: AWSError, data: QuickSight.Types.DescribeUserResponse) => void): Request<QuickSight.Types.DescribeUserResponse, AWSError>;
  /**
   * Returns information about a user, given the user name. 
   */
  describeUser(callback?: (err: AWSError, data: QuickSight.Types.DescribeUserResponse) => void): Request<QuickSight.Types.DescribeUserResponse, AWSError>;
  /**
   * Generates an embed URL that you can use to embed an Amazon QuickSight dashboard in your website, without having to register any reader users. Before you use this action, make sure that you have configured the dashboards and permissions. The following rules apply to the generated URL:   It contains a temporary bearer token. It is valid for 5 minutes after it is generated. Once redeemed within this period, it cannot be re-used again.   The URL validity period should not be confused with the actual session lifetime that can be customized using the  SessionLifetimeInMinutes  parameter. The resulting user session is valid for 15 minutes (default) to 10 hours (maximum).   You are charged only when the URL is used or there is interaction with Amazon QuickSight.   For more information, see Embedded Analytics in the Amazon QuickSight User Guide. For more information about the high-level steps for embedding and for an interactive demo of the ways you can customize embedding, visit the Amazon QuickSight Developer Portal.
   */
  generateEmbedUrlForAnonymousUser(params: QuickSight.Types.GenerateEmbedUrlForAnonymousUserRequest, callback?: (err: AWSError, data: QuickSight.Types.GenerateEmbedUrlForAnonymousUserResponse) => void): Request<QuickSight.Types.GenerateEmbedUrlForAnonymousUserResponse, AWSError>;
  /**
   * Generates an embed URL that you can use to embed an Amazon QuickSight dashboard in your website, without having to register any reader users. Before you use this action, make sure that you have configured the dashboards and permissions. The following rules apply to the generated URL:   It contains a temporary bearer token. It is valid for 5 minutes after it is generated. Once redeemed within this period, it cannot be re-used again.   The URL validity period should not be confused with the actual session lifetime that can be customized using the  SessionLifetimeInMinutes  parameter. The resulting user session is valid for 15 minutes (default) to 10 hours (maximum).   You are charged only when the URL is used or there is interaction with Amazon QuickSight.   For more information, see Embedded Analytics in the Amazon QuickSight User Guide. For more information about the high-level steps for embedding and for an interactive demo of the ways you can customize embedding, visit the Amazon QuickSight Developer Portal.
   */
  generateEmbedUrlForAnonymousUser(callback?: (err: AWSError, data: QuickSight.Types.GenerateEmbedUrlForAnonymousUserResponse) => void): Request<QuickSight.Types.GenerateEmbedUrlForAnonymousUserResponse, AWSError>;
  /**
   * Generates an embed URL that you can use to embed an Amazon QuickSight experience in your website. This action can be used for any type of user registered in an Amazon QuickSight account. Before you use this action, make sure that you have configured the relevant Amazon QuickSight resource and permissions. The following rules apply to the generated URL:   It contains a temporary bearer token. It is valid for 5 minutes after it is generated. Once redeemed within this period, it cannot be re-used again.   The URL validity period should not be confused with the actual session lifetime that can be customized using the  SessionLifetimeInMinutes  parameter. The resulting user session is valid for 15 minutes (default) to 10 hours (maximum).   You are charged only when the URL is used or there is interaction with Amazon QuickSight.   For more information, see Embedded Analytics in the Amazon QuickSight User Guide. For more information about the high-level steps for embedding and for an interactive demo of the ways you can customize embedding, visit the Amazon QuickSight Developer Portal.
   */
  generateEmbedUrlForRegisteredUser(params: QuickSight.Types.GenerateEmbedUrlForRegisteredUserRequest, callback?: (err: AWSError, data: QuickSight.Types.GenerateEmbedUrlForRegisteredUserResponse) => void): Request<QuickSight.Types.GenerateEmbedUrlForRegisteredUserResponse, AWSError>;
  /**
   * Generates an embed URL that you can use to embed an Amazon QuickSight experience in your website. This action can be used for any type of user registered in an Amazon QuickSight account. Before you use this action, make sure that you have configured the relevant Amazon QuickSight resource and permissions. The following rules apply to the generated URL:   It contains a temporary bearer token. It is valid for 5 minutes after it is generated. Once redeemed within this period, it cannot be re-used again.   The URL validity period should not be confused with the actual session lifetime that can be customized using the  SessionLifetimeInMinutes  parameter. The resulting user session is valid for 15 minutes (default) to 10 hours (maximum).   You are charged only when the URL is used or there is interaction with Amazon QuickSight.   For more information, see Embedded Analytics in the Amazon QuickSight User Guide. For more information about the high-level steps for embedding and for an interactive demo of the ways you can customize embedding, visit the Amazon QuickSight Developer Portal.
   */
  generateEmbedUrlForRegisteredUser(callback?: (err: AWSError, data: QuickSight.Types.GenerateEmbedUrlForRegisteredUserResponse) => void): Request<QuickSight.Types.GenerateEmbedUrlForRegisteredUserResponse, AWSError>;
  /**
   * Generates a session URL and authorization code that you can use to embed an Amazon Amazon QuickSight read-only dashboard in your web server code. Before you use this command, make sure that you have configured the dashboards and permissions.  Currently, you can use GetDashboardEmbedURL only from the server, not from the user's browser. The following rules apply to the combination of URL and authorization code:   They must be used together.   They can be used one time only.   They are valid for 5 minutes after you run this command.   The resulting user session is valid for 10 hours.   For more information, see Embedding Analytics Using GetDashboardEmbedUrl in the Amazon QuickSight User Guide. For more information about the high-level steps for embedding and for an interactive demo of the ways you can customize embedding, visit the Amazon QuickSight Developer Portal.
   */
  getDashboardEmbedUrl(params: QuickSight.Types.GetDashboardEmbedUrlRequest, callback?: (err: AWSError, data: QuickSight.Types.GetDashboardEmbedUrlResponse) => void): Request<QuickSight.Types.GetDashboardEmbedUrlResponse, AWSError>;
  /**
   * Generates a session URL and authorization code that you can use to embed an Amazon Amazon QuickSight read-only dashboard in your web server code. Before you use this command, make sure that you have configured the dashboards and permissions.  Currently, you can use GetDashboardEmbedURL only from the server, not from the user's browser. The following rules apply to the combination of URL and authorization code:   They must be used together.   They can be used one time only.   They are valid for 5 minutes after you run this command.   The resulting user session is valid for 10 hours.   For more information, see Embedding Analytics Using GetDashboardEmbedUrl in the Amazon QuickSight User Guide. For more information about the high-level steps for embedding and for an interactive demo of the ways you can customize embedding, visit the Amazon QuickSight Developer Portal.
   */
  getDashboardEmbedUrl(callback?: (err: AWSError, data: QuickSight.Types.GetDashboardEmbedUrlResponse) => void): Request<QuickSight.Types.GetDashboardEmbedUrlResponse, AWSError>;
  /**
   * Generates a session URL and authorization code that you can use to embed the Amazon Amazon QuickSight console in your web server code. Use GetSessionEmbedUrl where you want to provide an authoring portal that allows users to create data sources, datasets, analyses, and dashboards. The users who access an embedded Amazon QuickSight console need belong to the author or admin security cohort. If you want to restrict permissions to some of these features, add a custom permissions profile to the user with the  UpdateUser  API operation. Use  RegisterUser  API operation to add a new user with a custom permission profile attached. For more information, see the following sections in the Amazon QuickSight User Guide:    Embedding Analytics     Customizing Access to the Amazon QuickSight Console   
   */
  getSessionEmbedUrl(params: QuickSight.Types.GetSessionEmbedUrlRequest, callback?: (err: AWSError, data: QuickSight.Types.GetSessionEmbedUrlResponse) => void): Request<QuickSight.Types.GetSessionEmbedUrlResponse, AWSError>;
  /**
   * Generates a session URL and authorization code that you can use to embed the Amazon Amazon QuickSight console in your web server code. Use GetSessionEmbedUrl where you want to provide an authoring portal that allows users to create data sources, datasets, analyses, and dashboards. The users who access an embedded Amazon QuickSight console need belong to the author or admin security cohort. If you want to restrict permissions to some of these features, add a custom permissions profile to the user with the  UpdateUser  API operation. Use  RegisterUser  API operation to add a new user with a custom permission profile attached. For more information, see the following sections in the Amazon QuickSight User Guide:    Embedding Analytics     Customizing Access to the Amazon QuickSight Console   
   */
  getSessionEmbedUrl(callback?: (err: AWSError, data: QuickSight.Types.GetSessionEmbedUrlResponse) => void): Request<QuickSight.Types.GetSessionEmbedUrlResponse, AWSError>;
  /**
   * Lists Amazon QuickSight analyses that exist in the specified Amazon Web Services account.
   */
  listAnalyses(params: QuickSight.Types.ListAnalysesRequest, callback?: (err: AWSError, data: QuickSight.Types.ListAnalysesResponse) => void): Request<QuickSight.Types.ListAnalysesResponse, AWSError>;
  /**
   * Lists Amazon QuickSight analyses that exist in the specified Amazon Web Services account.
   */
  listAnalyses(callback?: (err: AWSError, data: QuickSight.Types.ListAnalysesResponse) => void): Request<QuickSight.Types.ListAnalysesResponse, AWSError>;
  /**
   * Lists all the versions of the dashboards in the Amazon QuickSight subscription.
   */
  listDashboardVersions(params: QuickSight.Types.ListDashboardVersionsRequest, callback?: (err: AWSError, data: QuickSight.Types.ListDashboardVersionsResponse) => void): Request<QuickSight.Types.ListDashboardVersionsResponse, AWSError>;
  /**
   * Lists all the versions of the dashboards in the Amazon QuickSight subscription.
   */
  listDashboardVersions(callback?: (err: AWSError, data: QuickSight.Types.ListDashboardVersionsResponse) => void): Request<QuickSight.Types.ListDashboardVersionsResponse, AWSError>;
  /**
   * Lists dashboards in an Amazon Web Services account.
   */
  listDashboards(params: QuickSight.Types.ListDashboardsRequest, callback?: (err: AWSError, data: QuickSight.Types.ListDashboardsResponse) => void): Request<QuickSight.Types.ListDashboardsResponse, AWSError>;
  /**
   * Lists dashboards in an Amazon Web Services account.
   */
  listDashboards(callback?: (err: AWSError, data: QuickSight.Types.ListDashboardsResponse) => void): Request<QuickSight.Types.ListDashboardsResponse, AWSError>;
  /**
   * Lists all of the datasets belonging to the current Amazon Web Services account in an Amazon Web Services Region. The permissions resource is arn:aws:quicksight:region:aws-account-id:dataset/*.
   */
  listDataSets(params: QuickSight.Types.ListDataSetsRequest, callback?: (err: AWSError, data: QuickSight.Types.ListDataSetsResponse) => void): Request<QuickSight.Types.ListDataSetsResponse, AWSError>;
  /**
   * Lists all of the datasets belonging to the current Amazon Web Services account in an Amazon Web Services Region. The permissions resource is arn:aws:quicksight:region:aws-account-id:dataset/*.
   */
  listDataSets(callback?: (err: AWSError, data: QuickSight.Types.ListDataSetsResponse) => void): Request<QuickSight.Types.ListDataSetsResponse, AWSError>;
  /**
   * Lists data sources in current Amazon Web Services Region that belong to this Amazon Web Services account.
   */
  listDataSources(params: QuickSight.Types.ListDataSourcesRequest, callback?: (err: AWSError, data: QuickSight.Types.ListDataSourcesResponse) => void): Request<QuickSight.Types.ListDataSourcesResponse, AWSError>;
  /**
   * Lists data sources in current Amazon Web Services Region that belong to this Amazon Web Services account.
   */
  listDataSources(callback?: (err: AWSError, data: QuickSight.Types.ListDataSourcesResponse) => void): Request<QuickSight.Types.ListDataSourcesResponse, AWSError>;
  /**
   * List all assets (DASHBOARD, ANALYSIS, and DATASET) in a folder. 
   */
  listFolderMembers(params: QuickSight.Types.ListFolderMembersRequest, callback?: (err: AWSError, data: QuickSight.Types.ListFolderMembersResponse) => void): Request<QuickSight.Types.ListFolderMembersResponse, AWSError>;
  /**
   * List all assets (DASHBOARD, ANALYSIS, and DATASET) in a folder. 
   */
  listFolderMembers(callback?: (err: AWSError, data: QuickSight.Types.ListFolderMembersResponse) => void): Request<QuickSight.Types.ListFolderMembersResponse, AWSError>;
  /**
   * Lists all folders in an account.
   */
  listFolders(params: QuickSight.Types.ListFoldersRequest, callback?: (err: AWSError, data: QuickSight.Types.ListFoldersResponse) => void): Request<QuickSight.Types.ListFoldersResponse, AWSError>;
  /**
   * Lists all folders in an account.
   */
  listFolders(callback?: (err: AWSError, data: QuickSight.Types.ListFoldersResponse) => void): Request<QuickSight.Types.ListFoldersResponse, AWSError>;
  /**
   * Lists member users in a group.
   */
  listGroupMemberships(params: QuickSight.Types.ListGroupMembershipsRequest, callback?: (err: AWSError, data: QuickSight.Types.ListGroupMembershipsResponse) => void): Request<QuickSight.Types.ListGroupMembershipsResponse, AWSError>;
  /**
   * Lists member users in a group.
   */
  listGroupMemberships(callback?: (err: AWSError, data: QuickSight.Types.ListGroupMembershipsResponse) => void): Request<QuickSight.Types.ListGroupMembershipsResponse, AWSError>;
  /**
   * Lists all user groups in Amazon QuickSight. 
   */
  listGroups(params: QuickSight.Types.ListGroupsRequest, callback?: (err: AWSError, data: QuickSight.Types.ListGroupsResponse) => void): Request<QuickSight.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists all user groups in Amazon QuickSight. 
   */
  listGroups(callback?: (err: AWSError, data: QuickSight.Types.ListGroupsResponse) => void): Request<QuickSight.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists IAMpolicy assignments in the current Amazon QuickSight account.
   */
  listIAMPolicyAssignments(params: QuickSight.Types.ListIAMPolicyAssignmentsRequest, callback?: (err: AWSError, data: QuickSight.Types.ListIAMPolicyAssignmentsResponse) => void): Request<QuickSight.Types.ListIAMPolicyAssignmentsResponse, AWSError>;
  /**
   * Lists IAMpolicy assignments in the current Amazon QuickSight account.
   */
  listIAMPolicyAssignments(callback?: (err: AWSError, data: QuickSight.Types.ListIAMPolicyAssignmentsResponse) => void): Request<QuickSight.Types.ListIAMPolicyAssignmentsResponse, AWSError>;
  /**
   * Lists all the IAMpolicy assignments, including the Amazon Resource Names (ARNs) for the IAM policies assigned to the specified user and group or groups that the user belongs to.
   */
  listIAMPolicyAssignmentsForUser(params: QuickSight.Types.ListIAMPolicyAssignmentsForUserRequest, callback?: (err: AWSError, data: QuickSight.Types.ListIAMPolicyAssignmentsForUserResponse) => void): Request<QuickSight.Types.ListIAMPolicyAssignmentsForUserResponse, AWSError>;
  /**
   * Lists all the IAMpolicy assignments, including the Amazon Resource Names (ARNs) for the IAM policies assigned to the specified user and group or groups that the user belongs to.
   */
  listIAMPolicyAssignmentsForUser(callback?: (err: AWSError, data: QuickSight.Types.ListIAMPolicyAssignmentsForUserResponse) => void): Request<QuickSight.Types.ListIAMPolicyAssignmentsForUserResponse, AWSError>;
  /**
   * Lists the history of SPICE ingestions for a dataset.
   */
  listIngestions(params: QuickSight.Types.ListIngestionsRequest, callback?: (err: AWSError, data: QuickSight.Types.ListIngestionsResponse) => void): Request<QuickSight.Types.ListIngestionsResponse, AWSError>;
  /**
   * Lists the history of SPICE ingestions for a dataset.
   */
  listIngestions(callback?: (err: AWSError, data: QuickSight.Types.ListIngestionsResponse) => void): Request<QuickSight.Types.ListIngestionsResponse, AWSError>;
  /**
   * Lists the namespaces for the specified Amazon Web Services account.
   */
  listNamespaces(params: QuickSight.Types.ListNamespacesRequest, callback?: (err: AWSError, data: QuickSight.Types.ListNamespacesResponse) => void): Request<QuickSight.Types.ListNamespacesResponse, AWSError>;
  /**
   * Lists the namespaces for the specified Amazon Web Services account.
   */
  listNamespaces(callback?: (err: AWSError, data: QuickSight.Types.ListNamespacesResponse) => void): Request<QuickSight.Types.ListNamespacesResponse, AWSError>;
  /**
   * Lists the tags assigned to a resource.
   */
  listTagsForResource(params: QuickSight.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: QuickSight.Types.ListTagsForResourceResponse) => void): Request<QuickSight.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags assigned to a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: QuickSight.Types.ListTagsForResourceResponse) => void): Request<QuickSight.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all the aliases of a template.
   */
  listTemplateAliases(params: QuickSight.Types.ListTemplateAliasesRequest, callback?: (err: AWSError, data: QuickSight.Types.ListTemplateAliasesResponse) => void): Request<QuickSight.Types.ListTemplateAliasesResponse, AWSError>;
  /**
   * Lists all the aliases of a template.
   */
  listTemplateAliases(callback?: (err: AWSError, data: QuickSight.Types.ListTemplateAliasesResponse) => void): Request<QuickSight.Types.ListTemplateAliasesResponse, AWSError>;
  /**
   * Lists all the versions of the templates in the current Amazon QuickSight account.
   */
  listTemplateVersions(params: QuickSight.Types.ListTemplateVersionsRequest, callback?: (err: AWSError, data: QuickSight.Types.ListTemplateVersionsResponse) => void): Request<QuickSight.Types.ListTemplateVersionsResponse, AWSError>;
  /**
   * Lists all the versions of the templates in the current Amazon QuickSight account.
   */
  listTemplateVersions(callback?: (err: AWSError, data: QuickSight.Types.ListTemplateVersionsResponse) => void): Request<QuickSight.Types.ListTemplateVersionsResponse, AWSError>;
  /**
   * Lists all the templates in the current Amazon QuickSight account.
   */
  listTemplates(params: QuickSight.Types.ListTemplatesRequest, callback?: (err: AWSError, data: QuickSight.Types.ListTemplatesResponse) => void): Request<QuickSight.Types.ListTemplatesResponse, AWSError>;
  /**
   * Lists all the templates in the current Amazon QuickSight account.
   */
  listTemplates(callback?: (err: AWSError, data: QuickSight.Types.ListTemplatesResponse) => void): Request<QuickSight.Types.ListTemplatesResponse, AWSError>;
  /**
   * Lists all the aliases of a theme.
   */
  listThemeAliases(params: QuickSight.Types.ListThemeAliasesRequest, callback?: (err: AWSError, data: QuickSight.Types.ListThemeAliasesResponse) => void): Request<QuickSight.Types.ListThemeAliasesResponse, AWSError>;
  /**
   * Lists all the aliases of a theme.
   */
  listThemeAliases(callback?: (err: AWSError, data: QuickSight.Types.ListThemeAliasesResponse) => void): Request<QuickSight.Types.ListThemeAliasesResponse, AWSError>;
  /**
   * Lists all the versions of the themes in the current Amazon Web Services account.
   */
  listThemeVersions(params: QuickSight.Types.ListThemeVersionsRequest, callback?: (err: AWSError, data: QuickSight.Types.ListThemeVersionsResponse) => void): Request<QuickSight.Types.ListThemeVersionsResponse, AWSError>;
  /**
   * Lists all the versions of the themes in the current Amazon Web Services account.
   */
  listThemeVersions(callback?: (err: AWSError, data: QuickSight.Types.ListThemeVersionsResponse) => void): Request<QuickSight.Types.ListThemeVersionsResponse, AWSError>;
  /**
   * Lists all the themes in the current Amazon Web Services account.
   */
  listThemes(params: QuickSight.Types.ListThemesRequest, callback?: (err: AWSError, data: QuickSight.Types.ListThemesResponse) => void): Request<QuickSight.Types.ListThemesResponse, AWSError>;
  /**
   * Lists all the themes in the current Amazon Web Services account.
   */
  listThemes(callback?: (err: AWSError, data: QuickSight.Types.ListThemesResponse) => void): Request<QuickSight.Types.ListThemesResponse, AWSError>;
  /**
   * Lists the Amazon QuickSight groups that an Amazon QuickSight user is a member of.
   */
  listUserGroups(params: QuickSight.Types.ListUserGroupsRequest, callback?: (err: AWSError, data: QuickSight.Types.ListUserGroupsResponse) => void): Request<QuickSight.Types.ListUserGroupsResponse, AWSError>;
  /**
   * Lists the Amazon QuickSight groups that an Amazon QuickSight user is a member of.
   */
  listUserGroups(callback?: (err: AWSError, data: QuickSight.Types.ListUserGroupsResponse) => void): Request<QuickSight.Types.ListUserGroupsResponse, AWSError>;
  /**
   * Returns a list of all of the Amazon QuickSight users belonging to this account. 
   */
  listUsers(params: QuickSight.Types.ListUsersRequest, callback?: (err: AWSError, data: QuickSight.Types.ListUsersResponse) => void): Request<QuickSight.Types.ListUsersResponse, AWSError>;
  /**
   * Returns a list of all of the Amazon QuickSight users belonging to this account. 
   */
  listUsers(callback?: (err: AWSError, data: QuickSight.Types.ListUsersResponse) => void): Request<QuickSight.Types.ListUsersResponse, AWSError>;
  /**
   * Creates an Amazon QuickSight user, whose identity is associated with the AWS Identity and Access Management (IAM) identity or role specified in the request. 
   */
  registerUser(params: QuickSight.Types.RegisterUserRequest, callback?: (err: AWSError, data: QuickSight.Types.RegisterUserResponse) => void): Request<QuickSight.Types.RegisterUserResponse, AWSError>;
  /**
   * Creates an Amazon QuickSight user, whose identity is associated with the AWS Identity and Access Management (IAM) identity or role specified in the request. 
   */
  registerUser(callback?: (err: AWSError, data: QuickSight.Types.RegisterUserResponse) => void): Request<QuickSight.Types.RegisterUserResponse, AWSError>;
  /**
   * Restores an analysis.
   */
  restoreAnalysis(params: QuickSight.Types.RestoreAnalysisRequest, callback?: (err: AWSError, data: QuickSight.Types.RestoreAnalysisResponse) => void): Request<QuickSight.Types.RestoreAnalysisResponse, AWSError>;
  /**
   * Restores an analysis.
   */
  restoreAnalysis(callback?: (err: AWSError, data: QuickSight.Types.RestoreAnalysisResponse) => void): Request<QuickSight.Types.RestoreAnalysisResponse, AWSError>;
  /**
   * Searches for analyses that belong to the user specified in the filter.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  searchAnalyses(params: QuickSight.Types.SearchAnalysesRequest, callback?: (err: AWSError, data: QuickSight.Types.SearchAnalysesResponse) => void): Request<QuickSight.Types.SearchAnalysesResponse, AWSError>;
  /**
   * Searches for analyses that belong to the user specified in the filter.  This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  searchAnalyses(callback?: (err: AWSError, data: QuickSight.Types.SearchAnalysesResponse) => void): Request<QuickSight.Types.SearchAnalysesResponse, AWSError>;
  /**
   * Searches for dashboards that belong to a user.   This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  searchDashboards(params: QuickSight.Types.SearchDashboardsRequest, callback?: (err: AWSError, data: QuickSight.Types.SearchDashboardsResponse) => void): Request<QuickSight.Types.SearchDashboardsResponse, AWSError>;
  /**
   * Searches for dashboards that belong to a user.   This operation is eventually consistent. The results are best effort and may not reflect very recent updates and changes. 
   */
  searchDashboards(callback?: (err: AWSError, data: QuickSight.Types.SearchDashboardsResponse) => void): Request<QuickSight.Types.SearchDashboardsResponse, AWSError>;
  /**
   * Searches the subfolders in a folder.
   */
  searchFolders(params: QuickSight.Types.SearchFoldersRequest, callback?: (err: AWSError, data: QuickSight.Types.SearchFoldersResponse) => void): Request<QuickSight.Types.SearchFoldersResponse, AWSError>;
  /**
   * Searches the subfolders in a folder.
   */
  searchFolders(callback?: (err: AWSError, data: QuickSight.Types.SearchFoldersResponse) => void): Request<QuickSight.Types.SearchFoldersResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified Amazon QuickSight resource.  Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values. You can use the TagResource operation with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a resource. Amazon QuickSight supports tagging on data set, data source, dashboard, and template.  Tagging for Amazon QuickSight works in a similar way to tagging for other AWS services, except for the following:   You can't use tags to track AWS costs for Amazon QuickSight. This restriction is because Amazon QuickSight costs are based on users and SPICE capacity, which aren't taggable resources.   Amazon QuickSight doesn't currently support the Tag Editor for Resource Groups.  
   */
  tagResource(params: QuickSight.Types.TagResourceRequest, callback?: (err: AWSError, data: QuickSight.Types.TagResourceResponse) => void): Request<QuickSight.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified Amazon QuickSight resource.  Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values. You can use the TagResource operation with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a resource. Amazon QuickSight supports tagging on data set, data source, dashboard, and template.  Tagging for Amazon QuickSight works in a similar way to tagging for other AWS services, except for the following:   You can't use tags to track AWS costs for Amazon QuickSight. This restriction is because Amazon QuickSight costs are based on users and SPICE capacity, which aren't taggable resources.   Amazon QuickSight doesn't currently support the Tag Editor for Resource Groups.  
   */
  tagResource(callback?: (err: AWSError, data: QuickSight.Types.TagResourceResponse) => void): Request<QuickSight.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a tag or tags from a resource.
   */
  untagResource(params: QuickSight.Types.UntagResourceRequest, callback?: (err: AWSError, data: QuickSight.Types.UntagResourceResponse) => void): Request<QuickSight.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a tag or tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: QuickSight.Types.UntagResourceResponse) => void): Request<QuickSight.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates Amazon QuickSight customizations the current Amazon Web Services Region. Currently, the only customization you can use is a theme. You can use customizations for your Amazon Web Services account or, if you specify a namespace, for a Amazon QuickSight namespace instead. Customizations that apply to a namespace override customizations that apply to an Amazon Web Services account. To find out which customizations apply, use the DescribeAccountCustomization API operation. 
   */
  updateAccountCustomization(params: QuickSight.Types.UpdateAccountCustomizationRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateAccountCustomizationResponse) => void): Request<QuickSight.Types.UpdateAccountCustomizationResponse, AWSError>;
  /**
   * Updates Amazon QuickSight customizations the current Amazon Web Services Region. Currently, the only customization you can use is a theme. You can use customizations for your Amazon Web Services account or, if you specify a namespace, for a Amazon QuickSight namespace instead. Customizations that apply to a namespace override customizations that apply to an Amazon Web Services account. To find out which customizations apply, use the DescribeAccountCustomization API operation. 
   */
  updateAccountCustomization(callback?: (err: AWSError, data: QuickSight.Types.UpdateAccountCustomizationResponse) => void): Request<QuickSight.Types.UpdateAccountCustomizationResponse, AWSError>;
  /**
   * Updates the Amazon QuickSight settings in your Amazon Web Services account.
   */
  updateAccountSettings(params: QuickSight.Types.UpdateAccountSettingsRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateAccountSettingsResponse) => void): Request<QuickSight.Types.UpdateAccountSettingsResponse, AWSError>;
  /**
   * Updates the Amazon QuickSight settings in your Amazon Web Services account.
   */
  updateAccountSettings(callback?: (err: AWSError, data: QuickSight.Types.UpdateAccountSettingsResponse) => void): Request<QuickSight.Types.UpdateAccountSettingsResponse, AWSError>;
  /**
   * Updates an analysis in Amazon QuickSight
   */
  updateAnalysis(params: QuickSight.Types.UpdateAnalysisRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateAnalysisResponse) => void): Request<QuickSight.Types.UpdateAnalysisResponse, AWSError>;
  /**
   * Updates an analysis in Amazon QuickSight
   */
  updateAnalysis(callback?: (err: AWSError, data: QuickSight.Types.UpdateAnalysisResponse) => void): Request<QuickSight.Types.UpdateAnalysisResponse, AWSError>;
  /**
   * Updates the read and write permissions for an analysis.
   */
  updateAnalysisPermissions(params: QuickSight.Types.UpdateAnalysisPermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateAnalysisPermissionsResponse) => void): Request<QuickSight.Types.UpdateAnalysisPermissionsResponse, AWSError>;
  /**
   * Updates the read and write permissions for an analysis.
   */
  updateAnalysisPermissions(callback?: (err: AWSError, data: QuickSight.Types.UpdateAnalysisPermissionsResponse) => void): Request<QuickSight.Types.UpdateAnalysisPermissionsResponse, AWSError>;
  /**
   * Updates a dashboard in an Amazon Web Services account.  Updating a Dashboard creates a new dashboard version but does not immediately publish the new version. You can update the published version of a dashboard by using the UpdateDashboardPublishedVersion API operation. 
   */
  updateDashboard(params: QuickSight.Types.UpdateDashboardRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateDashboardResponse) => void): Request<QuickSight.Types.UpdateDashboardResponse, AWSError>;
  /**
   * Updates a dashboard in an Amazon Web Services account.  Updating a Dashboard creates a new dashboard version but does not immediately publish the new version. You can update the published version of a dashboard by using the UpdateDashboardPublishedVersion API operation. 
   */
  updateDashboard(callback?: (err: AWSError, data: QuickSight.Types.UpdateDashboardResponse) => void): Request<QuickSight.Types.UpdateDashboardResponse, AWSError>;
  /**
   * Updates read and write permissions on a dashboard.
   */
  updateDashboardPermissions(params: QuickSight.Types.UpdateDashboardPermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateDashboardPermissionsResponse) => void): Request<QuickSight.Types.UpdateDashboardPermissionsResponse, AWSError>;
  /**
   * Updates read and write permissions on a dashboard.
   */
  updateDashboardPermissions(callback?: (err: AWSError, data: QuickSight.Types.UpdateDashboardPermissionsResponse) => void): Request<QuickSight.Types.UpdateDashboardPermissionsResponse, AWSError>;
  /**
   * Updates the published version of a dashboard.
   */
  updateDashboardPublishedVersion(params: QuickSight.Types.UpdateDashboardPublishedVersionRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateDashboardPublishedVersionResponse) => void): Request<QuickSight.Types.UpdateDashboardPublishedVersionResponse, AWSError>;
  /**
   * Updates the published version of a dashboard.
   */
  updateDashboardPublishedVersion(callback?: (err: AWSError, data: QuickSight.Types.UpdateDashboardPublishedVersionResponse) => void): Request<QuickSight.Types.UpdateDashboardPublishedVersionResponse, AWSError>;
  /**
   * Updates a dataset.
   */
  updateDataSet(params: QuickSight.Types.UpdateDataSetRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateDataSetResponse) => void): Request<QuickSight.Types.UpdateDataSetResponse, AWSError>;
  /**
   * Updates a dataset.
   */
  updateDataSet(callback?: (err: AWSError, data: QuickSight.Types.UpdateDataSetResponse) => void): Request<QuickSight.Types.UpdateDataSetResponse, AWSError>;
  /**
   * Updates the permissions on a dataset. The permissions resource is arn:aws:quicksight:region:aws-account-id:dataset/data-set-id.
   */
  updateDataSetPermissions(params: QuickSight.Types.UpdateDataSetPermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateDataSetPermissionsResponse) => void): Request<QuickSight.Types.UpdateDataSetPermissionsResponse, AWSError>;
  /**
   * Updates the permissions on a dataset. The permissions resource is arn:aws:quicksight:region:aws-account-id:dataset/data-set-id.
   */
  updateDataSetPermissions(callback?: (err: AWSError, data: QuickSight.Types.UpdateDataSetPermissionsResponse) => void): Request<QuickSight.Types.UpdateDataSetPermissionsResponse, AWSError>;
  /**
   * Updates a data source.
   */
  updateDataSource(params: QuickSight.Types.UpdateDataSourceRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateDataSourceResponse) => void): Request<QuickSight.Types.UpdateDataSourceResponse, AWSError>;
  /**
   * Updates a data source.
   */
  updateDataSource(callback?: (err: AWSError, data: QuickSight.Types.UpdateDataSourceResponse) => void): Request<QuickSight.Types.UpdateDataSourceResponse, AWSError>;
  /**
   * Updates the permissions to a data source.
   */
  updateDataSourcePermissions(params: QuickSight.Types.UpdateDataSourcePermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateDataSourcePermissionsResponse) => void): Request<QuickSight.Types.UpdateDataSourcePermissionsResponse, AWSError>;
  /**
   * Updates the permissions to a data source.
   */
  updateDataSourcePermissions(callback?: (err: AWSError, data: QuickSight.Types.UpdateDataSourcePermissionsResponse) => void): Request<QuickSight.Types.UpdateDataSourcePermissionsResponse, AWSError>;
  /**
   * Updates the name of a folder.
   */
  updateFolder(params: QuickSight.Types.UpdateFolderRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateFolderResponse) => void): Request<QuickSight.Types.UpdateFolderResponse, AWSError>;
  /**
   * Updates the name of a folder.
   */
  updateFolder(callback?: (err: AWSError, data: QuickSight.Types.UpdateFolderResponse) => void): Request<QuickSight.Types.UpdateFolderResponse, AWSError>;
  /**
   * Updates permissions of a folder.
   */
  updateFolderPermissions(params: QuickSight.Types.UpdateFolderPermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateFolderPermissionsResponse) => void): Request<QuickSight.Types.UpdateFolderPermissionsResponse, AWSError>;
  /**
   * Updates permissions of a folder.
   */
  updateFolderPermissions(callback?: (err: AWSError, data: QuickSight.Types.UpdateFolderPermissionsResponse) => void): Request<QuickSight.Types.UpdateFolderPermissionsResponse, AWSError>;
  /**
   * Changes a group description. 
   */
  updateGroup(params: QuickSight.Types.UpdateGroupRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateGroupResponse) => void): Request<QuickSight.Types.UpdateGroupResponse, AWSError>;
  /**
   * Changes a group description. 
   */
  updateGroup(callback?: (err: AWSError, data: QuickSight.Types.UpdateGroupResponse) => void): Request<QuickSight.Types.UpdateGroupResponse, AWSError>;
  /**
   * Updates an existing IAMpolicy assignment. This operation updates only the optional parameter or parameters that are specified in the request. This overwrites all of the users included in Identities. 
   */
  updateIAMPolicyAssignment(params: QuickSight.Types.UpdateIAMPolicyAssignmentRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateIAMPolicyAssignmentResponse) => void): Request<QuickSight.Types.UpdateIAMPolicyAssignmentResponse, AWSError>;
  /**
   * Updates an existing IAMpolicy assignment. This operation updates only the optional parameter or parameters that are specified in the request. This overwrites all of the users included in Identities. 
   */
  updateIAMPolicyAssignment(callback?: (err: AWSError, data: QuickSight.Types.UpdateIAMPolicyAssignmentResponse) => void): Request<QuickSight.Types.UpdateIAMPolicyAssignmentResponse, AWSError>;
  /**
   * Updates content and status of IP Rules.
   */
  updateIpRestriction(params: QuickSight.Types.UpdateIpRestrictionRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateIpRestrictionResponse) => void): Request<QuickSight.Types.UpdateIpRestrictionResponse, AWSError>;
  /**
   * Updates content and status of IP Rules.
   */
  updateIpRestriction(callback?: (err: AWSError, data: QuickSight.Types.UpdateIpRestrictionResponse) => void): Request<QuickSight.Types.UpdateIpRestrictionResponse, AWSError>;
  /**
   * Updates a template from an existing Amazon QuickSight analysis or another template.
   */
  updateTemplate(params: QuickSight.Types.UpdateTemplateRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateTemplateResponse) => void): Request<QuickSight.Types.UpdateTemplateResponse, AWSError>;
  /**
   * Updates a template from an existing Amazon QuickSight analysis or another template.
   */
  updateTemplate(callback?: (err: AWSError, data: QuickSight.Types.UpdateTemplateResponse) => void): Request<QuickSight.Types.UpdateTemplateResponse, AWSError>;
  /**
   * Updates the template alias of a template.
   */
  updateTemplateAlias(params: QuickSight.Types.UpdateTemplateAliasRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateTemplateAliasResponse) => void): Request<QuickSight.Types.UpdateTemplateAliasResponse, AWSError>;
  /**
   * Updates the template alias of a template.
   */
  updateTemplateAlias(callback?: (err: AWSError, data: QuickSight.Types.UpdateTemplateAliasResponse) => void): Request<QuickSight.Types.UpdateTemplateAliasResponse, AWSError>;
  /**
   * Updates the resource permissions for a template.
   */
  updateTemplatePermissions(params: QuickSight.Types.UpdateTemplatePermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateTemplatePermissionsResponse) => void): Request<QuickSight.Types.UpdateTemplatePermissionsResponse, AWSError>;
  /**
   * Updates the resource permissions for a template.
   */
  updateTemplatePermissions(callback?: (err: AWSError, data: QuickSight.Types.UpdateTemplatePermissionsResponse) => void): Request<QuickSight.Types.UpdateTemplatePermissionsResponse, AWSError>;
  /**
   * Updates a theme.
   */
  updateTheme(params: QuickSight.Types.UpdateThemeRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateThemeResponse) => void): Request<QuickSight.Types.UpdateThemeResponse, AWSError>;
  /**
   * Updates a theme.
   */
  updateTheme(callback?: (err: AWSError, data: QuickSight.Types.UpdateThemeResponse) => void): Request<QuickSight.Types.UpdateThemeResponse, AWSError>;
  /**
   * Updates an alias of a theme.
   */
  updateThemeAlias(params: QuickSight.Types.UpdateThemeAliasRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateThemeAliasResponse) => void): Request<QuickSight.Types.UpdateThemeAliasResponse, AWSError>;
  /**
   * Updates an alias of a theme.
   */
  updateThemeAlias(callback?: (err: AWSError, data: QuickSight.Types.UpdateThemeAliasResponse) => void): Request<QuickSight.Types.UpdateThemeAliasResponse, AWSError>;
  /**
   * Updates the resource permissions for a theme. Permissions apply to the action to grant or revoke permissions on, for example "quicksight:DescribeTheme". Theme permissions apply in groupings. Valid groupings include the following for the three levels of permissions, which are user, owner, or no permissions:    User    "quicksight:DescribeTheme"     "quicksight:DescribeThemeAlias"     "quicksight:ListThemeAliases"     "quicksight:ListThemeVersions"      Owner    "quicksight:DescribeTheme"     "quicksight:DescribeThemeAlias"     "quicksight:ListThemeAliases"     "quicksight:ListThemeVersions"     "quicksight:DeleteTheme"     "quicksight:UpdateTheme"     "quicksight:CreateThemeAlias"     "quicksight:DeleteThemeAlias"     "quicksight:UpdateThemeAlias"     "quicksight:UpdateThemePermissions"     "quicksight:DescribeThemePermissions"      To specify no permissions, omit the permissions list.  
   */
  updateThemePermissions(params: QuickSight.Types.UpdateThemePermissionsRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateThemePermissionsResponse) => void): Request<QuickSight.Types.UpdateThemePermissionsResponse, AWSError>;
  /**
   * Updates the resource permissions for a theme. Permissions apply to the action to grant or revoke permissions on, for example "quicksight:DescribeTheme". Theme permissions apply in groupings. Valid groupings include the following for the three levels of permissions, which are user, owner, or no permissions:    User    "quicksight:DescribeTheme"     "quicksight:DescribeThemeAlias"     "quicksight:ListThemeAliases"     "quicksight:ListThemeVersions"      Owner    "quicksight:DescribeTheme"     "quicksight:DescribeThemeAlias"     "quicksight:ListThemeAliases"     "quicksight:ListThemeVersions"     "quicksight:DeleteTheme"     "quicksight:UpdateTheme"     "quicksight:CreateThemeAlias"     "quicksight:DeleteThemeAlias"     "quicksight:UpdateThemeAlias"     "quicksight:UpdateThemePermissions"     "quicksight:DescribeThemePermissions"      To specify no permissions, omit the permissions list.  
   */
  updateThemePermissions(callback?: (err: AWSError, data: QuickSight.Types.UpdateThemePermissionsResponse) => void): Request<QuickSight.Types.UpdateThemePermissionsResponse, AWSError>;
  /**
   * Updates an Amazon QuickSight user.
   */
  updateUser(params: QuickSight.Types.UpdateUserRequest, callback?: (err: AWSError, data: QuickSight.Types.UpdateUserResponse) => void): Request<QuickSight.Types.UpdateUserResponse, AWSError>;
  /**
   * Updates an Amazon QuickSight user.
   */
  updateUser(callback?: (err: AWSError, data: QuickSight.Types.UpdateUserResponse) => void): Request<QuickSight.Types.UpdateUserResponse, AWSError>;
}
declare namespace QuickSight {
  export interface AccountCustomization {
    /**
     * The default theme for this Amazon QuickSight subscription.
     */
    DefaultTheme?: Arn;
  }
  export interface AccountSettings {
    /**
     * The "account name" you provided for the Amazon QuickSight subscription in your Amazon Web Services account. You create this name when you sign up for Amazon QuickSight. It is unique in all of Amazon Web Services and it appears only when users sign in.
     */
    AccountName?: String;
    /**
     * The edition of Amazon QuickSight that you're currently subscribed to: Enterprise edition or Standard edition.
     */
    Edition?: Edition;
    /**
     * The default Amazon QuickSight namespace for your Amazon Web Services account. 
     */
    DefaultNamespace?: Namespace;
    /**
     * The main notification email for your Amazon QuickSight subscription.
     */
    NotificationEmail?: String;
  }
  export type ActionList = String[];
  export interface ActiveIAMPolicyAssignment {
    /**
     * A name for the IAMpolicy assignment.
     */
    AssignmentName?: IAMPolicyAssignmentName;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    PolicyArn?: Arn;
  }
  export type ActiveIAMPolicyAssignmentList = ActiveIAMPolicyAssignment[];
  export interface AdHocFilteringOption {
    /**
     * Availability status.
     */
    AvailabilityStatus?: DashboardBehavior;
  }
  export type AdditionalDashboardIdList = RestrictiveResourceId[];
  export type AliasName = string;
  export interface AmazonElasticsearchParameters {
    /**
     * The OpenSearch domain.
     */
    Domain: Domain;
  }
  export interface AmazonOpenSearchParameters {
    Domain: Domain;
  }
  export interface Analysis {
    /**
     * The ID of the analysis.
     */
    AnalysisId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the analysis.
     */
    Arn?: Arn;
    /**
     * The descriptive name of the analysis.
     */
    Name?: AnalysisName;
    /**
     * Status associated with the analysis.
     */
    Status?: ResourceStatus;
    /**
     * Errors associated with the analysis.
     */
    Errors?: AnalysisErrorList;
    /**
     * The ARNs of the datasets of the analysis.
     */
    DataSetArns?: DataSetArnsList;
    /**
     * The ARN of the theme of the analysis.
     */
    ThemeArn?: Arn;
    /**
     * The time that the analysis was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The time that the analysis was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * A list of the associated sheets with the unique identifier and name of each sheet.
     */
    Sheets?: SheetList;
  }
  export interface AnalysisError {
    /**
     * The type of the analysis error.
     */
    Type?: AnalysisErrorType;
    /**
     * The message associated with the analysis error.
     */
    Message?: NonEmptyString;
  }
  export type AnalysisErrorList = AnalysisError[];
  export type AnalysisErrorType = "ACCESS_DENIED"|"SOURCE_NOT_FOUND"|"DATA_SET_NOT_FOUND"|"INTERNAL_FAILURE"|"PARAMETER_VALUE_INCOMPATIBLE"|"PARAMETER_TYPE_INVALID"|"PARAMETER_NOT_FOUND"|"COLUMN_TYPE_MISMATCH"|"COLUMN_GEOGRAPHIC_ROLE_MISMATCH"|"COLUMN_REPLACEMENT_MISSING"|string;
  export type AnalysisFilterAttribute = "QUICKSIGHT_USER"|string;
  export type AnalysisName = string;
  export interface AnalysisSearchFilter {
    /**
     * The comparison operator that you want to use as a filter, for example "Operator": "StringEquals".
     */
    Operator?: FilterOperator;
    /**
     * The name of the value that you want to use as a filter, for example "Name": "QUICKSIGHT_USER".
     */
    Name?: AnalysisFilterAttribute;
    /**
     * The value of the named item, in this case QUICKSIGHT_USER, that you want to use as a filter, for example "Value". An example is "arn:aws:quicksight:us-east-1:1:user/default/UserName1".
     */
    Value?: String;
  }
  export type AnalysisSearchFilterList = AnalysisSearchFilter[];
  export interface AnalysisSourceEntity {
    /**
     * The source template for the source entity of the analysis.
     */
    SourceTemplate?: AnalysisSourceTemplate;
  }
  export interface AnalysisSourceTemplate {
    /**
     * The dataset references of the source template of an analysis.
     */
    DataSetReferences: DataSetReferenceList;
    /**
     * The Amazon Resource Name (ARN) of the source template of an analysis.
     */
    Arn: Arn;
  }
  export interface AnalysisSummary {
    /**
     * The Amazon Resource Name (ARN) for the analysis.
     */
    Arn?: Arn;
    /**
     * The ID of the analysis. This ID displays in the URL.
     */
    AnalysisId?: RestrictiveResourceId;
    /**
     * The name of the analysis. This name is displayed in the Amazon QuickSight console. 
     */
    Name?: AnalysisName;
    /**
     * The last known status for the analysis.
     */
    Status?: ResourceStatus;
    /**
     * The time that the analysis was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The time that the analysis was last updated.
     */
    LastUpdatedTime?: Timestamp;
  }
  export type AnalysisSummaryList = AnalysisSummary[];
  export interface AnonymousUserDashboardEmbeddingConfiguration {
    /**
     * The dashboard ID for the dashboard that you want the user to see first. This ID is included in the output URL. When the URL in response is accessed, Amazon QuickSight renders this dashboard. The Amazon Resource Name (ARN) of this dashboard must be included in the AuthorizedResourceArns parameter. Otherwise, the request will fail with InvalidParameterValueException.
     */
    InitialDashboardId: RestrictiveResourceId;
  }
  export interface AnonymousUserEmbeddingExperienceConfiguration {
    /**
     * The type of embedding experience. In this case, an Amazon QuickSight dashboard.
     */
    Dashboard?: AnonymousUserDashboardEmbeddingConfiguration;
  }
  export type Arn = string;
  export type ArnList = Arn[];
  export type AssignmentStatus = "ENABLED"|"DRAFT"|"DISABLED"|string;
  export interface AthenaParameters {
    /**
     * The workgroup that Amazon Athena uses.
     */
    WorkGroup?: WorkGroup;
  }
  export interface AuroraParameters {
    /**
     * Host.
     */
    Host: Host;
    /**
     * Port.
     */
    Port: Port;
    /**
     * Database.
     */
    Database: Database;
  }
  export interface AuroraPostgreSqlParameters {
    /**
     * The Amazon Aurora PostgreSQL-Compatible host to connect to.
     */
    Host: Host;
    /**
     * The port that Amazon Aurora PostgreSQL is listening on.
     */
    Port: Port;
    /**
     * The Amazon Aurora PostgreSQL database to connect to.
     */
    Database: Database;
  }
  export type AwsAccountId = string;
  export type AwsAndAccountId = string;
  export interface AwsIotAnalyticsParameters {
    /**
     * Dataset name.
     */
    DataSetName: DataSetName;
  }
  export type Boolean = boolean;
  export interface BorderStyle {
    /**
     * The option to enable display of borders for visuals.
     */
    Show?: boolean;
  }
  export type CIDR = string;
  export interface CalculatedColumn {
    /**
     * Column name.
     */
    ColumnName: ColumnName;
    /**
     * A unique ID to identify a calculated column. During a dataset update, if the column ID of a calculated column matches that of an existing calculated column, Amazon QuickSight preserves the existing calculated column.
     */
    ColumnId: ColumnId;
    /**
     * An expression that defines the calculated column.
     */
    Expression: Expression;
  }
  export type CalculatedColumnList = CalculatedColumn[];
  export interface CancelIngestionRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the dataset used in the ingestion.
     */
    DataSetId: String;
    /**
     * An ID for the ingestion.
     */
    IngestionId: IngestionId;
  }
  export interface CancelIngestionResponse {
    /**
     * The Amazon Resource Name (ARN) for the data ingestion.
     */
    Arn?: Arn;
    /**
     * An ID for the ingestion.
     */
    IngestionId?: IngestionId;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface CastColumnTypeOperation {
    /**
     * Column name.
     */
    ColumnName: ColumnName;
    /**
     * New column data type.
     */
    NewColumnType: ColumnDataType;
    /**
     * When casting a column from string to datetime type, you can supply a string in a format supported by Amazon QuickSight to denote the source data format.
     */
    Format?: TypeCastFormat;
  }
  export type Catalog = string;
  export type ClusterId = string;
  export type ColorList = HexColor[];
  export type ColumnDataType = "STRING"|"INTEGER"|"DECIMAL"|"DATETIME"|string;
  export interface ColumnDescription {
    /**
     * The text of a description for a column.
     */
    Text?: ColumnDescriptiveText;
  }
  export type ColumnDescriptiveText = string;
  export interface ColumnGroup {
    /**
     * Geospatial column group that denotes a hierarchy.
     */
    GeoSpatialColumnGroup?: GeoSpatialColumnGroup;
  }
  export interface ColumnGroupColumnSchema {
    /**
     * The name of the column group's column schema.
     */
    Name?: String;
  }
  export type ColumnGroupColumnSchemaList = ColumnGroupColumnSchema[];
  export type ColumnGroupList = ColumnGroup[];
  export type ColumnGroupName = string;
  export interface ColumnGroupSchema {
    /**
     * The name of the column group schema.
     */
    Name?: String;
    /**
     * A structure containing the list of schemas for column group columns.
     */
    ColumnGroupColumnSchemaList?: ColumnGroupColumnSchemaList;
  }
  export type ColumnGroupSchemaList = ColumnGroupSchema[];
  export type ColumnId = string;
  export interface ColumnLevelPermissionRule {
    /**
     * An array of Amazon Resource Names (ARNs) for Amazon QuickSight users or groups.
     */
    Principals?: PrincipalList;
    /**
     * An array of column names.
     */
    ColumnNames?: ColumnNameList;
  }
  export type ColumnLevelPermissionRuleList = ColumnLevelPermissionRule[];
  export type ColumnList = ColumnName[];
  export type ColumnName = string;
  export type ColumnNameList = String[];
  export interface ColumnSchema {
    /**
     * The name of the column schema.
     */
    Name?: String;
    /**
     * The data type of the column schema.
     */
    DataType?: String;
    /**
     * The geographic role of the column schema.
     */
    GeographicRole?: String;
  }
  export type ColumnSchemaList = ColumnSchema[];
  export interface ColumnTag {
    /**
     * A geospatial role for a column.
     */
    ColumnGeographicRole?: GeoSpatialDataRole;
    /**
     * A description for a column.
     */
    ColumnDescription?: ColumnDescription;
  }
  export type ColumnTagList = ColumnTag[];
  export type ColumnTagName = "COLUMN_GEOGRAPHIC_ROLE"|"COLUMN_DESCRIPTION"|string;
  export type ColumnTagNames = ColumnTagName[];
  export type CopySourceArn = string;
  export interface CreateAccountCustomizationRequest {
    /**
     * The ID for the Amazon Web Services account that you want to customize Amazon QuickSight for.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The Amazon QuickSight namespace that you want to add customizations to.
     */
    Namespace?: Namespace;
    /**
     * The Amazon QuickSight customizations you're adding in the current Amazon Web Services Region. You can add these to an Amazon Web Services account and a Amazon QuickSight namespace.  For example, you can add a default theme by setting AccountCustomization to the midnight theme: "AccountCustomization": { "DefaultTheme": "arn:aws:quicksight::aws:theme/MIDNIGHT" }. Or, you can add a custom theme by specifying "AccountCustomization": { "DefaultTheme": "arn:aws:quicksight:us-west-2:111122223333:theme/bdb844d0-0fe9-4d9d-b520-0fe602d93639" }. 
     */
    AccountCustomization: AccountCustomization;
    /**
     * A list of the tags that you want to attach to this resource.
     */
    Tags?: TagList;
  }
  export interface CreateAccountCustomizationResponse {
    /**
     * The Amazon Resource Name (ARN) for the customization that you created for this Amazon Web Services account.
     */
    Arn?: Arn;
    /**
     * The ID for the Amazon Web Services account that you want to customize Amazon QuickSight for.
     */
    AwsAccountId?: AwsAccountId;
    /**
     * The namespace associated with the customization you're creating. 
     */
    Namespace?: Namespace;
    /**
     * The Amazon QuickSight customizations you're adding in the current Amazon Web Services Region. 
     */
    AccountCustomization?: AccountCustomization;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface CreateAnalysisRequest {
    /**
     * The ID of the Amazon Web Services account where you are creating an analysis.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the analysis that you're creating. This ID displays in the URL of the analysis.
     */
    AnalysisId: RestrictiveResourceId;
    /**
     * A descriptive name for the analysis that you're creating. This name displays for the analysis in the Amazon QuickSight console. 
     */
    Name: AnalysisName;
    /**
     * The parameter names and override values that you want to use. An analysis can have any parameter type, and some parameters might accept multiple values. 
     */
    Parameters?: Parameters;
    /**
     * A structure that describes the principals and the resource-level permissions on an analysis. You can use the Permissions structure to grant permissions by providing a list of Identity and Access Management (IAM) action information for each principal listed by Amazon Resource Name (ARN).  To specify no permissions, omit Permissions.
     */
    Permissions?: ResourcePermissionList;
    /**
     * A source entity to use for the analysis that you're creating. This metadata structure contains details that describe a source template and one or more datasets.
     */
    SourceEntity: AnalysisSourceEntity;
    /**
     * The ARN for the theme to apply to the analysis that you're creating. To see the theme in the Amazon QuickSight console, make sure that you have access to it.
     */
    ThemeArn?: Arn;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the analysis.
     */
    Tags?: TagList;
  }
  export interface CreateAnalysisResponse {
    /**
     * The ARN for the analysis.
     */
    Arn?: Arn;
    /**
     * The ID of the analysis.
     */
    AnalysisId?: RestrictiveResourceId;
    /**
     * The status of the creation of the analysis. 
     */
    CreationStatus?: ResourceStatus;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface CreateColumnsOperation {
    /**
     * Calculated columns to create.
     */
    Columns: CalculatedColumnList;
  }
  export interface CreateDashboardRequest {
    /**
     * The ID of the Amazon Web Services account where you want to create the dashboard.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dashboard, also added to the IAMpolicy.
     */
    DashboardId: RestrictiveResourceId;
    /**
     * The display name of the dashboard.
     */
    Name: DashboardName;
    /**
     * The parameters for the creation of the dashboard, which you want to use to override the default settings. A dashboard can have any type of parameters, and some parameters might accept multiple values. 
     */
    Parameters?: Parameters;
    /**
     * A structure that contains the permissions of the dashboard. You can use this structure for granting permissions by providing a list of IAMaction information for each principal ARN.  To specify no permissions, omit the permissions list.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The entity that you are using as a source when you create the dashboard. In SourceEntity, you specify the type of object you're using as source. You can only create a dashboard from a template, so you use a SourceTemplate entity. If you need to create a dashboard from an analysis, first convert the analysis to a template by using the CreateTemplate API operation. For SourceTemplate, specify the Amazon Resource Name (ARN) of the source template. The SourceTemplateARN can contain any Amazon Web Services account and any Amazon QuickSight-supported Amazon Web Services Region.  Use the DataSetReferences entity within SourceTemplate to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder. 
     */
    SourceEntity: DashboardSourceEntity;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the dashboard.
     */
    Tags?: TagList;
    /**
     * A description for the first version of the dashboard being created.
     */
    VersionDescription?: VersionDescription;
    /**
     * Options for publishing the dashboard when you create it:    AvailabilityStatus for AdHocFilteringOption - This status can be either ENABLED or DISABLED. When this is set to DISABLED, Amazon QuickSight disables the left filter pane on the published dashboard, which can be used for ad hoc (one-time) filtering. This option is ENABLED by default.     AvailabilityStatus for ExportToCSVOption - This status can be either ENABLED or DISABLED. The visual option to export data to .CSV format isn't enabled when this is set to DISABLED. This option is ENABLED by default.     VisibilityState for SheetControlsOption - This visibility state can be either COLLAPSED or EXPANDED. This option is COLLAPSED by default.   
     */
    DashboardPublishOptions?: DashboardPublishOptions;
    /**
     * The Amazon Resource Name (ARN) of the theme that is being used for this dashboard. If you add a value for this field, it overrides the value that is used in the source entity. The theme ARN must exist in the same Amazon Web Services account where you create the dashboard.
     */
    ThemeArn?: Arn;
  }
  export interface CreateDashboardResponse {
    /**
     * The ARN of the dashboard.
     */
    Arn?: Arn;
    /**
     * The ARN of the dashboard, including the version number of the first version that is created.
     */
    VersionArn?: Arn;
    /**
     * The ID for the dashboard.
     */
    DashboardId?: RestrictiveResourceId;
    /**
     * The status of the dashboard creation request.
     */
    CreationStatus?: ResourceStatus;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface CreateDataSetRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * An ID for the dataset that you want to create. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId: ResourceId;
    /**
     * The display name for the dataset.
     */
    Name: ResourceName;
    /**
     * Declares the physical tables that are available in the underlying data sources.
     */
    PhysicalTableMap: PhysicalTableMap;
    /**
     * Configures the combination and transformation of the data from the physical tables.
     */
    LogicalTableMap?: LogicalTableMap;
    /**
     * Indicates whether you want to import the data into SPICE.
     */
    ImportMode: DataSetImportMode;
    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. Currently, only geospatial hierarchy is supported.
     */
    ColumnGroups?: ColumnGroupList;
    /**
     * The folder that contains fields and nested subfolders for your dataset.
     */
    FieldFolders?: FieldFolderMap;
    /**
     * A list of resource permissions on the dataset.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The row-level security configuration for the data that you want to create.
     */
    RowLevelPermissionDataSet?: RowLevelPermissionDataSet;
    /**
     * The configuration of tags on a dataset to set row-level security. Row-level security tags are currently supported for anonymous embedding only.
     */
    RowLevelPermissionTagConfiguration?: RowLevelPermissionTagConfiguration;
    /**
     * A set of one or more definitions of a  ColumnLevelPermissionRule .
     */
    ColumnLevelPermissionRules?: ColumnLevelPermissionRuleList;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the dataset.
     */
    Tags?: TagList;
    DataSetUsageConfiguration?: DataSetUsageConfiguration;
  }
  export interface CreateDataSetResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    Arn?: Arn;
    /**
     * The ID for the dataset that you want to create. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId?: ResourceId;
    /**
     * The ARN for the ingestion, which is triggered as a result of dataset creation if the import mode is SPICE.
     */
    IngestionArn?: Arn;
    /**
     * The ID of the ingestion, which is triggered as a result of dataset creation if the import mode is SPICE.
     */
    IngestionId?: ResourceId;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface CreateDataSourceRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * An ID for the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account. 
     */
    DataSourceId: ResourceId;
    /**
     * A display name for the data source.
     */
    Name: ResourceName;
    /**
     * The type of the data source. To return a list of all data sources, use ListDataSources. Use AMAZON_ELASTICSEARCH for Amazon OpenSearch Service.
     */
    Type: DataSourceType;
    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying source.
     */
    DataSourceParameters?: DataSourceParameters;
    /**
     * The credentials Amazon QuickSight that uses to connect to your underlying source. Currently, only credentials based on user name and password are supported.
     */
    Credentials?: DataSourceCredentials;
    /**
     * A list of resource permissions on the data source.
     */
    Permissions?: ResourcePermissionList;
    /**
     * Use this parameter only when you want Amazon QuickSight to use a VPC connection when connecting to your underlying source.
     */
    VpcConnectionProperties?: VpcConnectionProperties;
    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying source.
     */
    SslProperties?: SslProperties;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the data source.
     */
    Tags?: TagList;
  }
  export interface CreateDataSourceResponse {
    /**
     * The Amazon Resource Name (ARN) of the data source.
     */
    Arn?: Arn;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSourceId?: ResourceId;
    /**
     * The status of creating the data source.
     */
    CreationStatus?: ResourceStatus;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface CreateFolderMembershipRequest {
    /**
     * The AWS Account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The folder ID.
     */
    FolderId: RestrictiveResourceId;
    /**
     * The ID of the asset (the dashboard, analysis, or dataset).
     */
    MemberId: RestrictiveResourceId;
    /**
     * The type of the member, including DASHBOARD, ANALYSIS, and DATASET.
     */
    MemberType: MemberType;
  }
  export interface CreateFolderMembershipResponse {
    /**
     * The status of the folder membership. If succeeded, the status is SC_OK (200).
     */
    Status?: StatusCode;
    /**
     * Information about the member in the folder.
     */
    FolderMember?: FolderMember;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface CreateFolderRequest {
    /**
     * The AWS Account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The folder ID.
     */
    FolderId: RestrictiveResourceId;
    /**
     * The name of the folder.
     */
    Name?: FolderName;
    /**
     * The type of folder. By default, folderType is SHARED.
     */
    FolderType?: FolderType;
    /**
     * The Amazon Resource Name (ARN) for the parent folder.  ParentFolderArn can be null. An empty parentFolderArn creates a root-level folder.
     */
    ParentFolderArn?: Arn;
    /**
     * A structure that describes the principals and the resource-level permissions of a folder. To specify no permissions, omit Permissions.
     */
    Permissions?: ResourcePermissionList;
    /**
     * Tags for the folder.
     */
    Tags?: TagList;
  }
  export interface CreateFolderResponse {
    /**
     * The status of the newly created folder. If succeeded, the status is SC_OK (200).
     */
    Status?: StatusCode;
    /**
     * The Amazon Resource Name (ARN) for the newly created folder.
     */
    Arn?: Arn;
    /**
     * The folder ID for the newly created folder.
     */
    FolderId?: RestrictiveResourceId;
    /**
     * The request ID for the newly created folder.
     */
    RequestId?: String;
  }
  export interface CreateGroupMembershipRequest {
    /**
     * The name of the user that you want to add to the group membership.
     */
    MemberName: GroupMemberName;
    /**
     * The name of the group that you want to add the user to.
     */
    GroupName: GroupName;
    /**
     * The ID for the Amazon Web Services account that the group is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface CreateGroupMembershipResponse {
    /**
     * The group member.
     */
    GroupMember?: GroupMember;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface CreateGroupRequest {
    /**
     * A name for the group that you want to create.
     */
    GroupName: GroupName;
    /**
     * A description for the group that you want to create.
     */
    Description?: GroupDescription;
    /**
     * The ID for the Amazon Web Services account that the group is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface CreateGroupResponse {
    /**
     * The name of the group.
     */
    Group?: Group;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface CreateIAMPolicyAssignmentRequest {
    /**
     * The ID of the Amazon Web Services account where you want to assign an IAMpolicy to Amazon QuickSight users or groups.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The name of the assignment, also called a rule. It must be unique within an Amazon Web Services account.
     */
    AssignmentName: IAMPolicyAssignmentName;
    /**
     * The status of the assignment. Possible values are as follows:    ENABLED - Anything specified in this assignment is used when creating the data source.    DISABLED - This assignment isn't used when creating the data source.    DRAFT - This assignment is an unfinished draft and isn't used when creating the data source.  
     */
    AssignmentStatus: AssignmentStatus;
    /**
     * The ARN for the IAMpolicy to apply to the Amazon QuickSight users and groups specified in this assignment.
     */
    PolicyArn?: Arn;
    /**
     * The Amazon QuickSight users, groups, or both that you want to assign the policy to.
     */
    Identities?: IdentityMap;
    /**
     * The namespace that contains the assignment.
     */
    Namespace: Namespace;
  }
  export interface CreateIAMPolicyAssignmentResponse {
    /**
     * The name of the assignment. This name must be unique within the Amazon Web Services account.
     */
    AssignmentName?: IAMPolicyAssignmentName;
    /**
     * The ID for the assignment.
     */
    AssignmentId?: String;
    /**
     * The status of the assignment. Possible values are as follows:    ENABLED - Anything specified in this assignment is used when creating the data source.    DISABLED - This assignment isn't used when creating the data source.    DRAFT - This assignment is an unfinished draft and isn't used when creating the data source.  
     */
    AssignmentStatus?: AssignmentStatus;
    /**
     * The ARN for the IAMpolicy that is applied to the Amazon QuickSight users and groups specified in this assignment.
     */
    PolicyArn?: Arn;
    /**
     * The Amazon QuickSight users, groups, or both that the IAMpolicy is assigned to.
     */
    Identities?: IdentityMap;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface CreateIngestionRequest {
    /**
     * The ID of the dataset used in the ingestion.
     */
    DataSetId: String;
    /**
     * An ID for the ingestion.
     */
    IngestionId: IngestionId;
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The type of ingestion that you want to create.
     */
    IngestionType?: IngestionType;
  }
  export interface CreateIngestionResponse {
    /**
     * The Amazon Resource Name (ARN) for the data ingestion.
     */
    Arn?: Arn;
    /**
     * An ID for the ingestion.
     */
    IngestionId?: IngestionId;
    /**
     * The ingestion status.
     */
    IngestionStatus?: IngestionStatus;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface CreateNamespaceRequest {
    /**
     * The ID for the Amazon Web Services account that you want to create the Amazon QuickSight namespace in.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The name that you want to use to describe the new namespace.
     */
    Namespace: Namespace;
    /**
     * Specifies the type of your user identity directory. Currently, this supports users with an identity type of QUICKSIGHT.
     */
    IdentityStore: IdentityStore;
    /**
     * The tags that you want to associate with the namespace that you're creating.
     */
    Tags?: TagList;
  }
  export interface CreateNamespaceResponse {
    /**
     * The ARN of the Amazon QuickSight namespace you created. 
     */
    Arn?: Arn;
    /**
     * The name of the new namespace that you created.
     */
    Name?: Namespace;
    /**
     * The Amazon Web Services Region; that you want to use for the free SPICE capacity for the new namespace. This is set to the region that you run CreateNamespace in. 
     */
    CapacityRegion?: String;
    /**
     * The status of the creation of the namespace. This is an asynchronous process. A status of CREATED means that your namespace is ready to use. If an error occurs, it indicates if the process is retryable or non-retryable. In the case of a non-retryable error, refer to the error message for follow-up tasks.
     */
    CreationStatus?: NamespaceStatus;
    /**
     * Specifies the type of your user identity directory. Currently, this supports users with an identity type of QUICKSIGHT.
     */
    IdentityStore?: IdentityStore;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface CreateTemplateAliasRequest {
    /**
     * The ID of the Amazon Web Services account that contains the template that you creating an alias for.
     */
    AwsAccountId: AwsAccountId;
    /**
     * An ID for the template.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * The name that you want to give to the template alias that you're creating. Don't start the alias name with the $ character. Alias names that start with $ are reserved by Amazon QuickSight. 
     */
    AliasName: AliasName;
    /**
     * The version number of the template.
     */
    TemplateVersionNumber: VersionNumber;
  }
  export interface CreateTemplateAliasResponse {
    /**
     * Information about the template alias.
     */
    TemplateAlias?: TemplateAlias;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface CreateTemplateRequest {
    /**
     * The ID for the Amazon Web Services account that the group is in. You use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * An ID for the template that you want to create. This template is unique per Amazon Web Services Region; in each Amazon Web Services account.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * A display name for the template.
     */
    Name?: TemplateName;
    /**
     * A list of resource permissions to be set on the template. 
     */
    Permissions?: ResourcePermissionList;
    /**
     * The entity that you are using as a source when you create the template. In SourceEntity, you specify the type of object you're using as source: SourceTemplate for a template or SourceAnalysis for an analysis. Both of these require an Amazon Resource Name (ARN). For SourceTemplate, specify the ARN of the source template. For SourceAnalysis, specify the ARN of the source analysis. The SourceTemplate ARN can contain any Amazon Web Services account and any Amazon QuickSight-supported Amazon Web Services Region.  Use the DataSetReferences entity within SourceTemplate or SourceAnalysis to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder. 
     */
    SourceEntity: TemplateSourceEntity;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the resource.
     */
    Tags?: TagList;
    /**
     * A description of the current template version being created. This API operation creates the first version of the template. Every time UpdateTemplate is called, a new version is created. Each version of the template maintains a description of the version in the VersionDescription field.
     */
    VersionDescription?: VersionDescription;
  }
  export interface CreateTemplateResponse {
    /**
     * The ARN for the template.
     */
    Arn?: Arn;
    /**
     * The ARN for the template, including the version information of the first version.
     */
    VersionArn?: Arn;
    /**
     * The ID of the template.
     */
    TemplateId?: RestrictiveResourceId;
    /**
     * The template creation status.
     */
    CreationStatus?: ResourceStatus;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface CreateThemeAliasRequest {
    /**
     * The ID of the Amazon Web Services account that contains the theme for the new theme alias.
     */
    AwsAccountId: AwsAccountId;
    /**
     * An ID for the theme alias.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * The name that you want to give to the theme alias that you are creating. The alias name can't begin with a $. Alias names that start with $ are reserved by Amazon QuickSight. 
     */
    AliasName: AliasName;
    /**
     * The version number of the theme.
     */
    ThemeVersionNumber: VersionNumber;
  }
  export interface CreateThemeAliasResponse {
    /**
     * Information about the theme alias.
     */
    ThemeAlias?: ThemeAlias;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface CreateThemeRequest {
    /**
     * The ID of the Amazon Web Services account where you want to store the new theme. 
     */
    AwsAccountId: AwsAccountId;
    /**
     * An ID for the theme that you want to create. The theme ID is unique per Amazon Web Services Region in each Amazon Web Services account.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * A display name for the theme.
     */
    Name: ThemeName;
    /**
     * The ID of the theme that a custom theme will inherit from. All themes inherit from one of the starting themes defined by Amazon QuickSight. For a list of the starting themes, use ListThemes or choose Themes from within a Amazon QuickSight analysis. 
     */
    BaseThemeId: RestrictiveResourceId;
    /**
     * A description of the first version of the theme that you're creating. Every time UpdateTheme is called, a new version is created. Each version of the theme has a description of the version in the VersionDescription field.
     */
    VersionDescription?: VersionDescription;
    /**
     * The theme configuration, which contains the theme display properties.
     */
    Configuration: ThemeConfiguration;
    /**
     * A valid grouping of resource permissions to apply to the new theme. 
     */
    Permissions?: ResourcePermissionList;
    /**
     * A map of the key-value pairs for the resource tag or tags that you want to add to the resource.
     */
    Tags?: TagList;
  }
  export interface CreateThemeResponse {
    /**
     * The Amazon Resource Name (ARN) for the theme.
     */
    Arn?: Arn;
    /**
     * The Amazon Resource Name (ARN) for the new theme.
     */
    VersionArn?: Arn;
    /**
     * The ID of the theme.
     */
    ThemeId?: RestrictiveResourceId;
    /**
     * The theme creation status.
     */
    CreationStatus?: ResourceStatus;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface CredentialPair {
    /**
     * User name.
     */
    Username: Username;
    /**
     * Password.
     */
    Password: Password;
    /**
     * A set of alternate data source parameters that you want to share for these credentials. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the DataSourceParameters structure that's in the request with the structures in the AlternateDataSourceParameters allow list. If the structures are an exact match, the request is allowed to use the new data source with the existing credentials. If the AlternateDataSourceParameters list is null, the DataSourceParameters originally used with these Credentials is automatically allowed.
     */
    AlternateDataSourceParameters?: DataSourceParametersList;
  }
  export interface CustomSql {
    /**
     * The Amazon Resource Name (ARN) of the data source.
     */
    DataSourceArn: Arn;
    /**
     * A display name for the SQL query result.
     */
    Name: CustomSqlName;
    /**
     * The SQL query.
     */
    SqlQuery: SqlQuery;
    /**
     * The column schema from the SQL query result set.
     */
    Columns?: InputColumnList;
  }
  export type CustomSqlName = string;
  export interface Dashboard {
    /**
     * Dashboard ID.
     */
    DashboardId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: Arn;
    /**
     * A display name for the dashboard.
     */
    Name?: DashboardName;
    /**
     * Version.
     */
    Version?: DashboardVersion;
    /**
     * The time that this dataset was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The last time that this dataset was published.
     */
    LastPublishedTime?: Timestamp;
    /**
     * The last time that this dataset was updated.
     */
    LastUpdatedTime?: Timestamp;
  }
  export type DashboardBehavior = "ENABLED"|"DISABLED"|string;
  export interface DashboardError {
    /**
     * Type.
     */
    Type?: DashboardErrorType;
    /**
     * Message.
     */
    Message?: NonEmptyString;
  }
  export type DashboardErrorList = DashboardError[];
  export type DashboardErrorType = "ACCESS_DENIED"|"SOURCE_NOT_FOUND"|"DATA_SET_NOT_FOUND"|"INTERNAL_FAILURE"|"PARAMETER_VALUE_INCOMPATIBLE"|"PARAMETER_TYPE_INVALID"|"PARAMETER_NOT_FOUND"|"COLUMN_TYPE_MISMATCH"|"COLUMN_GEOGRAPHIC_ROLE_MISMATCH"|"COLUMN_REPLACEMENT_MISSING"|string;
  export type DashboardFilterAttribute = "QUICKSIGHT_USER"|string;
  export type DashboardName = string;
  export interface DashboardPublishOptions {
    /**
     * Ad hoc (one-time) filtering option.
     */
    AdHocFilteringOption?: AdHocFilteringOption;
    /**
     * Export to .csv option.
     */
    ExportToCSVOption?: ExportToCSVOption;
    /**
     * Sheet controls option.
     */
    SheetControlsOption?: SheetControlsOption;
  }
  export interface DashboardSearchFilter {
    /**
     * The comparison operator that you want to use as a filter, for example, "Operator": "StringEquals".
     */
    Operator: FilterOperator;
    /**
     * The name of the value that you want to use as a filter, for example, "Name": "QUICKSIGHT_USER". 
     */
    Name?: DashboardFilterAttribute;
    /**
     * The value of the named item, in this case QUICKSIGHT_USER, that you want to use as a filter, for example, "Value": "arn:aws:quicksight:us-east-1:1:user/default/UserName1". 
     */
    Value?: String;
  }
  export type DashboardSearchFilterList = DashboardSearchFilter[];
  export interface DashboardSourceEntity {
    /**
     * Source template.
     */
    SourceTemplate?: DashboardSourceTemplate;
  }
  export interface DashboardSourceTemplate {
    /**
     * Dataset references.
     */
    DataSetReferences: DataSetReferenceList;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn: Arn;
  }
  export interface DashboardSummary {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: Arn;
    /**
     * Dashboard ID.
     */
    DashboardId?: RestrictiveResourceId;
    /**
     * A display name for the dashboard.
     */
    Name?: DashboardName;
    /**
     * The time that this dashboard was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The last time that this dashboard was updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * Published version number.
     */
    PublishedVersionNumber?: VersionNumber;
    /**
     * The last time that this dashboard was published.
     */
    LastPublishedTime?: Timestamp;
  }
  export type DashboardSummaryList = DashboardSummary[];
  export type DashboardUIState = "EXPANDED"|"COLLAPSED"|string;
  export interface DashboardVersion {
    /**
     * The time that this dashboard version was created.
     */
    CreatedTime?: Timestamp;
    /**
     * Errors associated with this dashboard version.
     */
    Errors?: DashboardErrorList;
    /**
     * Version number for this version of the dashboard.
     */
    VersionNumber?: VersionNumber;
    /**
     * The HTTP status of the request.
     */
    Status?: ResourceStatus;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: Arn;
    /**
     * Source entity ARN.
     */
    SourceEntityArn?: Arn;
    /**
     * The Amazon Resource Numbers (ARNs) for the datasets that are associated with this version of the dashboard.
     */
    DataSetArns?: DataSetArnsList;
    /**
     * Description.
     */
    Description?: VersionDescription;
    /**
     * The ARN of the theme associated with a version of the dashboard.
     */
    ThemeArn?: Arn;
    /**
     * A list of the associated sheets with the unique identifier and name of each sheet.
     */
    Sheets?: SheetList;
  }
  export interface DashboardVersionSummary {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: Arn;
    /**
     * The time that this dashboard version was created.
     */
    CreatedTime?: Timestamp;
    /**
     * Version number.
     */
    VersionNumber?: VersionNumber;
    /**
     * The HTTP status of the request.
     */
    Status?: ResourceStatus;
    /**
     * Source entity ARN.
     */
    SourceEntityArn?: Arn;
    /**
     * Description.
     */
    Description?: VersionDescription;
  }
  export type DashboardVersionSummaryList = DashboardVersionSummary[];
  export interface DataColorPalette {
    /**
     * The hexadecimal codes for the colors.
     */
    Colors?: ColorList;
    /**
     * The minimum and maximum hexadecimal codes that describe a color gradient. 
     */
    MinMaxGradient?: ColorList;
    /**
     * The hexadecimal code of a color that applies to charts where a lack of data is highlighted.
     */
    EmptyFillColor?: HexColor;
  }
  export interface DataSet {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: Arn;
    /**
     * The ID of the dataset.
     */
    DataSetId?: ResourceId;
    /**
     * A display name for the dataset.
     */
    Name?: ResourceName;
    /**
     * The time that this dataset was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The last time that this dataset was updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * Declares the physical tables that are available in the underlying data sources.
     */
    PhysicalTableMap?: PhysicalTableMap;
    /**
     * Configures the combination and transformation of the data from the physical tables.
     */
    LogicalTableMap?: LogicalTableMap;
    /**
     * The list of columns after all transforms. These columns are available in templates, analyses, and dashboards.
     */
    OutputColumns?: OutputColumnList;
    /**
     * A value that indicates whether you want to import the data into SPICE.
     */
    ImportMode?: DataSetImportMode;
    /**
     * The amount of SPICE capacity used by this dataset. This is 0 if the dataset isn't imported into SPICE.
     */
    ConsumedSpiceCapacityInBytes?: Long;
    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. Currently, only geospatial hierarchy is supported.
     */
    ColumnGroups?: ColumnGroupList;
    /**
     * The folder that contains fields and nested subfolders for your dataset.
     */
    FieldFolders?: FieldFolderMap;
    /**
     * The row-level security configuration for the dataset.
     */
    RowLevelPermissionDataSet?: RowLevelPermissionDataSet;
    /**
     * The element you can use to define tags for row-level security.
     */
    RowLevelPermissionTagConfiguration?: RowLevelPermissionTagConfiguration;
    /**
     * A set of one or more definitions of a  ColumnLevelPermissionRule .
     */
    ColumnLevelPermissionRules?: ColumnLevelPermissionRuleList;
    /**
     * The usage configuration to apply to child datasets that reference this dataset as a source.
     */
    DataSetUsageConfiguration?: DataSetUsageConfiguration;
  }
  export type DataSetArnsList = Arn[];
  export interface DataSetConfiguration {
    /**
     * Placeholder.
     */
    Placeholder?: String;
    /**
     * Dataset schema.
     */
    DataSetSchema?: DataSetSchema;
    /**
     * A structure containing the list of column group schemas.
     */
    ColumnGroupSchemaList?: ColumnGroupSchemaList;
  }
  export type DataSetConfigurationList = DataSetConfiguration[];
  export type DataSetImportMode = "SPICE"|"DIRECT_QUERY"|string;
  export type DataSetName = string;
  export interface DataSetReference {
    /**
     * Dataset placeholder.
     */
    DataSetPlaceholder: NonEmptyString;
    /**
     * Dataset Amazon Resource Name (ARN).
     */
    DataSetArn: Arn;
  }
  export type DataSetReferenceList = DataSetReference[];
  export interface DataSetSchema {
    /**
     * A structure containing the list of column schemas.
     */
    ColumnSchemaList?: ColumnSchemaList;
  }
  export interface DataSetSummary {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    Arn?: Arn;
    /**
     * The ID of the dataset.
     */
    DataSetId?: ResourceId;
    /**
     * A display name for the dataset.
     */
    Name?: ResourceName;
    /**
     * The time that this dataset was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The last time that this dataset was updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * A value that indicates whether you want to import the data into SPICE.
     */
    ImportMode?: DataSetImportMode;
    /**
     * The row-level security configuration for the dataset.
     */
    RowLevelPermissionDataSet?: RowLevelPermissionDataSet;
    /**
     * Whether or not the row level permission tags are applied.
     */
    RowLevelPermissionTagConfigurationApplied?: Boolean;
    /**
     * A value that indicates if the dataset has column level permission configured.
     */
    ColumnLevelPermissionRulesApplied?: Boolean;
  }
  export type DataSetSummaryList = DataSetSummary[];
  export interface DataSetUsageConfiguration {
    /**
     * An option that controls whether a child dataset of a direct query can use this dataset as a source.
     */
    DisableUseAsDirectQuerySource?: Boolean;
    /**
     * An option that controls whether a child dataset that's stored in QuickSight can use this dataset as a source.
     */
    DisableUseAsImportedSource?: Boolean;
  }
  export interface DataSource {
    /**
     * The Amazon Resource Name (ARN) of the data source.
     */
    Arn?: Arn;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSourceId?: ResourceId;
    /**
     * A display name for the data source.
     */
    Name?: ResourceName;
    /**
     * The type of the data source. This type indicates which database engine the data source connects to.
     */
    Type?: DataSourceType;
    /**
     * The HTTP status of the request.
     */
    Status?: ResourceStatus;
    /**
     * The time that this data source was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The last time that this data source was updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying source. This is a variant type structure. For this structure to be valid, only one of the attributes can be non-null.
     */
    DataSourceParameters?: DataSourceParameters;
    /**
     * A set of alternate data source parameters that you want to share for the credentials stored with this data source. The credentials are applied in tandem with the data source parameters when you copy a data source by using a create or update request. The API operation compares the DataSourceParameters structure that's in the request with the structures in the AlternateDataSourceParameters allow list. If the structures are an exact match, the request is allowed to use the credentials from this existing data source. If the AlternateDataSourceParameters list is null, the Credentials originally used with this DataSourceParameters are automatically allowed.
     */
    AlternateDataSourceParameters?: DataSourceParametersList;
    /**
     * The VPC connection information. You need to use this parameter only when you want Amazon QuickSight to use a VPC connection when connecting to your underlying source.
     */
    VpcConnectionProperties?: VpcConnectionProperties;
    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying source.
     */
    SslProperties?: SslProperties;
    /**
     * Error information from the last update or the creation of the data source.
     */
    ErrorInfo?: DataSourceErrorInfo;
  }
  export interface DataSourceCredentials {
    /**
     * Credential pair. For more information, see CredentialPair.
     */
    CredentialPair?: CredentialPair;
    /**
     * The Amazon Resource Name (ARN) of a data source that has the credential pair that you want to use. When CopySourceArn is not null, the credential pair from the data source in the ARN is used as the credentials for the DataSourceCredentials structure.
     */
    CopySourceArn?: CopySourceArn;
  }
  export interface DataSourceErrorInfo {
    /**
     * Error type.
     */
    Type?: DataSourceErrorInfoType;
    /**
     * Error message.
     */
    Message?: String;
  }
  export type DataSourceErrorInfoType = "ACCESS_DENIED"|"COPY_SOURCE_NOT_FOUND"|"TIMEOUT"|"ENGINE_VERSION_NOT_SUPPORTED"|"UNKNOWN_HOST"|"GENERIC_SQL_FAILURE"|"CONFLICT"|"UNKNOWN"|string;
  export type DataSourceList = DataSource[];
  export interface DataSourceParameters {
    /**
     * The parameters for OpenSearch.
     */
    AmazonElasticsearchParameters?: AmazonElasticsearchParameters;
    /**
     * The parameters for Amazon Athena.
     */
    AthenaParameters?: AthenaParameters;
    /**
     * The parameters for Amazon Aurora MySQL.
     */
    AuroraParameters?: AuroraParameters;
    /**
     * The parameters for Amazon Aurora.
     */
    AuroraPostgreSqlParameters?: AuroraPostgreSqlParameters;
    /**
     * The parameters for IoT Analytics.
     */
    AwsIotAnalyticsParameters?: AwsIotAnalyticsParameters;
    /**
     * The parameters for Jira.
     */
    JiraParameters?: JiraParameters;
    /**
     * The parameters for MariaDB.
     */
    MariaDbParameters?: MariaDbParameters;
    /**
     * The parameters for MySQL.
     */
    MySqlParameters?: MySqlParameters;
    /**
     * The parameters for Oracle.
     */
    OracleParameters?: OracleParameters;
    /**
     * The parameters for PostgreSQL.
     */
    PostgreSqlParameters?: PostgreSqlParameters;
    /**
     * The parameters for Presto.
     */
    PrestoParameters?: PrestoParameters;
    /**
     * The parameters for Amazon RDS.
     */
    RdsParameters?: RdsParameters;
    /**
     * The parameters for Amazon Redshift.
     */
    RedshiftParameters?: RedshiftParameters;
    /**
     * The parameters for S3.
     */
    S3Parameters?: S3Parameters;
    /**
     * The parameters for ServiceNow.
     */
    ServiceNowParameters?: ServiceNowParameters;
    /**
     * The parameters for Snowflake.
     */
    SnowflakeParameters?: SnowflakeParameters;
    /**
     * The parameters for Spark.
     */
    SparkParameters?: SparkParameters;
    /**
     * The parameters for SQL Server.
     */
    SqlServerParameters?: SqlServerParameters;
    /**
     * The parameters for Teradata.
     */
    TeradataParameters?: TeradataParameters;
    /**
     * The parameters for Twitter.
     */
    TwitterParameters?: TwitterParameters;
    AmazonOpenSearchParameters?: AmazonOpenSearchParameters;
  }
  export type DataSourceParametersList = DataSourceParameters[];
  export type DataSourceType = "ADOBE_ANALYTICS"|"AMAZON_ELASTICSEARCH"|"ATHENA"|"AURORA"|"AURORA_POSTGRESQL"|"AWS_IOT_ANALYTICS"|"GITHUB"|"JIRA"|"MARIADB"|"MYSQL"|"ORACLE"|"POSTGRESQL"|"PRESTO"|"REDSHIFT"|"S3"|"SALESFORCE"|"SERVICENOW"|"SNOWFLAKE"|"SPARK"|"SQLSERVER"|"TERADATA"|"TWITTER"|"TIMESTREAM"|"AMAZON_OPENSEARCH"|string;
  export type Database = string;
  export interface DateTimeParameter {
    /**
     * A display name for the date-time parameter.
     */
    Name: NonEmptyString;
    /**
     * The values for the date-time parameter.
     */
    Values: TimestampList;
  }
  export type DateTimeParameterList = DateTimeParameter[];
  export interface DecimalParameter {
    /**
     * A display name for the decimal parameter.
     */
    Name: NonEmptyString;
    /**
     * The values for the decimal parameter.
     */
    Values: DoubleList;
  }
  export type DecimalParameterList = DecimalParameter[];
  export interface DeleteAccountCustomizationRequest {
    /**
     * The ID for the Amazon Web Services account that you want to delete Amazon QuickSight customizations from in this Amazon Web Services Region.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The Amazon QuickSight namespace that you're deleting the customizations from.
     */
    Namespace?: Namespace;
  }
  export interface DeleteAccountCustomizationResponse {
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DeleteAnalysisRequest {
    /**
     * The ID of the Amazon Web Services account where you want to delete an analysis.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the analysis that you're deleting.
     */
    AnalysisId: RestrictiveResourceId;
    /**
     * A value that specifies the number of days that Amazon QuickSight waits before it deletes the analysis. You can't use this parameter with the ForceDeleteWithoutRecovery option in the same API call. The default value is 30.
     */
    RecoveryWindowInDays?: RecoveryWindowInDays;
    /**
     * This option defaults to the value NoForceDeleteWithoutRecovery. To immediately delete the analysis, add the ForceDeleteWithoutRecovery option. You can't restore an analysis after it's deleted. 
     */
    ForceDeleteWithoutRecovery?: boolean;
  }
  export interface DeleteAnalysisResponse {
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Resource Name (ARN) of the deleted analysis.
     */
    Arn?: Arn;
    /**
     * The ID of the deleted analysis.
     */
    AnalysisId?: RestrictiveResourceId;
    /**
     * The date and time that the analysis is scheduled to be deleted.
     */
    DeletionTime?: Timestamp;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DeleteDashboardRequest {
    /**
     * The ID of the Amazon Web Services account that contains the dashboard that you're deleting.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dashboard.
     */
    DashboardId: RestrictiveResourceId;
    /**
     * The version number of the dashboard. If the version number property is provided, only the specified version of the dashboard is deleted.
     */
    VersionNumber?: VersionNumber;
  }
  export interface DeleteDashboardResponse {
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Secure Socket Layer (SSL) properties that apply for the resource.
     */
    Arn?: Arn;
    /**
     * The ID of the dashboard.
     */
    DashboardId?: RestrictiveResourceId;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DeleteDataSetRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dataset that you want to create. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId: ResourceId;
  }
  export interface DeleteDataSetResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    Arn?: Arn;
    /**
     * The ID for the dataset that you want to create. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId?: ResourceId;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DeleteDataSourceRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSourceId: ResourceId;
  }
  export interface DeleteDataSourceResponse {
    /**
     * The Amazon Resource Name (ARN) of the data source that you deleted.
     */
    Arn?: Arn;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSourceId?: ResourceId;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DeleteFolderMembershipRequest {
    /**
     * The AWS Account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The Folder ID.
     */
    FolderId: RestrictiveResourceId;
    /**
     * The ID of the asset (the dashboard, analysis, or dataset) that you want to delete.
     */
    MemberId: RestrictiveResourceId;
    /**
     * The type of the member, including DASHBOARD, ANALYSIS, and DATASET 
     */
    MemberType: MemberType;
  }
  export interface DeleteFolderMembershipResponse {
    /**
     * The status of deleting the asset. If succeeded, the status is SC_OK (200).
     */
    Status?: StatusCode;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface DeleteFolderRequest {
    /**
     * The AWS Account ID for the folder.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The folder ID.
     */
    FolderId: RestrictiveResourceId;
  }
  export interface DeleteFolderResponse {
    /**
     * The status of deleting the folder. If succeeded, the status is SC_OK (200).
     */
    Status?: StatusCode;
    /**
     * The Amazon Resource Name of the deleted folder.
     */
    Arn?: Arn;
    /**
     * The folder ID.
     */
    FolderId?: RestrictiveResourceId;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface DeleteGroupMembershipRequest {
    /**
     * The name of the user that you want to delete from the group membership.
     */
    MemberName: GroupMemberName;
    /**
     * The name of the group that you want to delete the user from.
     */
    GroupName: GroupName;
    /**
     * The ID for the Amazon Web Services account that the group is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface DeleteGroupMembershipResponse {
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DeleteGroupRequest {
    /**
     * The name of the group that you want to delete.
     */
    GroupName: GroupName;
    /**
     * The ID for the Amazon Web Services account that the group is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface DeleteGroupResponse {
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DeleteIAMPolicyAssignmentRequest {
    /**
     * The Amazon Web Services account ID where you want to delete the IAMpolicy assignment.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The name of the assignment. 
     */
    AssignmentName: IAMPolicyAssignmentName;
    /**
     * The namespace that contains the assignment.
     */
    Namespace: Namespace;
  }
  export interface DeleteIAMPolicyAssignmentResponse {
    /**
     * The name of the assignment. 
     */
    AssignmentName?: IAMPolicyAssignmentName;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DeleteNamespaceRequest {
    /**
     * The ID for the Amazon Web Services account that you want to delete the Amazon QuickSight namespace from.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace that you want to delete.
     */
    Namespace: Namespace;
  }
  export interface DeleteNamespaceResponse {
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DeleteTemplateAliasRequest {
    /**
     * The ID of the Amazon Web Services account that contains the item to delete.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the template that the specified alias is for.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * The name for the template alias. To delete a specific alias, you delete the version that the alias points to. You can specify the alias name, or specify the latest version of the template by providing the keyword $LATEST in the AliasName parameter. 
     */
    AliasName: AliasName;
  }
  export interface DeleteTemplateAliasResponse {
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * An ID for the template associated with the deletion.
     */
    TemplateId?: RestrictiveResourceId;
    /**
     * The name for the template alias.
     */
    AliasName?: AliasName;
    /**
     * The Amazon Resource Name (ARN) of the template you want to delete.
     */
    Arn?: Arn;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DeleteTemplateRequest {
    /**
     * The ID of the Amazon Web Services account that contains the template that you're deleting.
     */
    AwsAccountId: AwsAccountId;
    /**
     * An ID for the template you want to delete.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * Specifies the version of the template that you want to delete. If you don't provide a version number, DeleteTemplate deletes all versions of the template. 
     */
    VersionNumber?: VersionNumber;
  }
  export interface DeleteTemplateResponse {
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: Arn;
    /**
     * An ID for the template.
     */
    TemplateId?: RestrictiveResourceId;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DeleteThemeAliasRequest {
    /**
     * The ID of the Amazon Web Services account that contains the theme alias to delete.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the theme that the specified alias is for.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * The unique name for the theme alias to delete.
     */
    AliasName: AliasName;
  }
  export interface DeleteThemeAliasResponse {
    /**
     * The name for the theme alias.
     */
    AliasName?: AliasName;
    /**
     * The Amazon Resource Name (ARN) of the theme resource using the deleted alias.
     */
    Arn?: Arn;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * An ID for the theme associated with the deletion.
     */
    ThemeId?: RestrictiveResourceId;
  }
  export interface DeleteThemeRequest {
    /**
     * The ID of the Amazon Web Services account that contains the theme that you're deleting.
     */
    AwsAccountId: AwsAccountId;
    /**
     * An ID for the theme that you want to delete.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * The version of the theme that you want to delete.   Note: If you don't provide a version number, you're using this call to DeleteTheme to delete all versions of the theme.
     */
    VersionNumber?: VersionNumber;
  }
  export interface DeleteThemeResponse {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: Arn;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * An ID for the theme.
     */
    ThemeId?: RestrictiveResourceId;
  }
  export interface DeleteUserByPrincipalIdRequest {
    /**
     * The principal ID of the user.
     */
    PrincipalId: String;
    /**
     * The ID for the Amazon Web Services account that the user is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface DeleteUserByPrincipalIdResponse {
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DeleteUserRequest {
    /**
     * The name of the user that you want to delete.
     */
    UserName: UserName;
    /**
     * The ID for the Amazon Web Services account that the user is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface DeleteUserResponse {
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export type Delimiter = string;
  export interface DescribeAccountCustomizationRequest {
    /**
     * The ID for the Amazon Web Services account that you want to describe Amazon QuickSight customizations for.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The Amazon QuickSight namespace that you want to describe Amazon QuickSight customizations for.
     */
    Namespace?: Namespace;
    /**
     * The Resolved flag works with the other parameters to determine which view of Amazon QuickSight customizations is returned. You can add this flag to your command to use the same view that Amazon QuickSight uses to identify which customizations to apply to the console. Omit this flag, or set it to no-resolved, to reveal customizations that are configured at different levels. 
     */
    Resolved?: boolean;
  }
  export interface DescribeAccountCustomizationResponse {
    /**
     * The Amazon Resource Name (ARN) of the customization that's associated with this Amazon Web Services account.
     */
    Arn?: Arn;
    /**
     * The ID for the Amazon Web Services account that you're describing.
     */
    AwsAccountId?: AwsAccountId;
    /**
     * The Amazon QuickSight namespace that you're describing. 
     */
    Namespace?: Namespace;
    /**
     * The Amazon QuickSight customizations that exist in the current Amazon Web Services Region. 
     */
    AccountCustomization?: AccountCustomization;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeAccountSettingsRequest {
    /**
     * The ID for the Amazon Web Services account that contains the settings that you want to list.
     */
    AwsAccountId: AwsAccountId;
  }
  export interface DescribeAccountSettingsResponse {
    /**
     * The Amazon QuickSight settings for this Amazon Web Services account. This information includes the edition of Amazon Amazon QuickSight that you subscribed to (Standard or Enterprise) and the notification email for the Amazon QuickSight subscription. In the Amazon QuickSight console, the Amazon QuickSight subscription is sometimes referred to as a Amazon QuickSight "account" even though it's technically not an account by itself. Instead, it's a subscription to the Amazon QuickSight service for your Amazon Web Services account. The edition that you subscribe to applies to Amazon QuickSight in every Amazon Web Services Region where you use it.
     */
    AccountSettings?: AccountSettings;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeAnalysisPermissionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the analysis whose permissions you're describing. You must be using the Amazon Web Services account that the analysis is in.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the analysis whose permissions you're describing. The ID is part of the analysis URL.
     */
    AnalysisId: RestrictiveResourceId;
  }
  export interface DescribeAnalysisPermissionsResponse {
    /**
     * The ID of the analysis whose permissions you're describing.
     */
    AnalysisId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the analysis whose permissions you're describing.
     */
    AnalysisArn?: Arn;
    /**
     * A structure that describes the principals and the resource-level permissions on an analysis.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DescribeAnalysisRequest {
    /**
     * The ID of the Amazon Web Services account that contains the analysis. You must be using the Amazon Web Services account that the analysis is in.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the analysis that you're describing. The ID is part of the URL of the analysis.
     */
    AnalysisId: RestrictiveResourceId;
  }
  export interface DescribeAnalysisResponse {
    /**
     * A metadata structure that contains summary information for the analysis that you're describing.
     */
    Analysis?: Analysis;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DescribeDashboardPermissionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the dashboard that you're describing permissions for.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dashboard, also added to the IAMpolicy.
     */
    DashboardId: RestrictiveResourceId;
  }
  export interface DescribeDashboardPermissionsResponse {
    /**
     * The ID for the dashboard.
     */
    DashboardId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the dashboard.
     */
    DashboardArn?: Arn;
    /**
     * A structure that contains the permissions for the dashboard.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DescribeDashboardRequest {
    /**
     * The ID of the Amazon Web Services account that contains the dashboard that you're describing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dashboard.
     */
    DashboardId: RestrictiveResourceId;
    /**
     * The version number for the dashboard. If a version number isn't passed, the latest published dashboard version is described. 
     */
    VersionNumber?: VersionNumber;
    /**
     * The alias name.
     */
    AliasName?: AliasName;
  }
  export interface DescribeDashboardResponse {
    /**
     * Information about the dashboard.
     */
    Dashboard?: Dashboard;
    /**
     * The HTTP status of this request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DescribeDataSetPermissionsRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dataset that you want to create. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId: ResourceId;
  }
  export interface DescribeDataSetPermissionsResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    DataSetArn?: Arn;
    /**
     * The ID for the dataset that you want to create. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId?: ResourceId;
    /**
     * A list of resource permissions on the dataset.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeDataSetRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dataset that you want to create. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId: ResourceId;
  }
  export interface DescribeDataSetResponse {
    /**
     * Information on the dataset.
     */
    DataSet?: DataSet;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeDataSourcePermissionsRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSourceId: ResourceId;
  }
  export interface DescribeDataSourcePermissionsResponse {
    /**
     * The Amazon Resource Name (ARN) of the data source.
     */
    DataSourceArn?: Arn;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSourceId?: ResourceId;
    /**
     * A list of resource permissions on the data source.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeDataSourceRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSourceId: ResourceId;
  }
  export interface DescribeDataSourceResponse {
    /**
     * The information on the data source.
     */
    DataSource?: DataSource;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeFolderPermissionsRequest {
    /**
     * The AWS Account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The folder ID.
     */
    FolderId: RestrictiveResourceId;
  }
  export interface DescribeFolderPermissionsResponse {
    /**
     * The status. If succeeded, the status is SC_OK.
     */
    Status?: StatusCode;
    /**
     * The folder ID.
     */
    FolderId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) for the folder.
     */
    Arn?: Arn;
    /**
     * Information about the permissions on the folder.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface DescribeFolderRequest {
    /**
     * The AWS account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The folder ID.
     */
    FolderId: RestrictiveResourceId;
  }
  export interface DescribeFolderResolvedPermissionsRequest {
    /**
     * The AWS account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The folder ID.
     */
    FolderId: RestrictiveResourceId;
  }
  export interface DescribeFolderResolvedPermissionsResponse {
    /**
     * The status. If succeeded, the status is SC_OK 
     */
    Status?: StatusCode;
    /**
     * The folder ID.
     */
    FolderId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN).
     */
    Arn?: Arn;
    /**
     * Information about the permissions on the dashboard.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface DescribeFolderResponse {
    /**
     * The status. If succeeded, the status is SC_OK (200).
     */
    Status?: StatusCode;
    /**
     * Information about the folder.
     */
    Folder?: Folder;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface DescribeGroupRequest {
    /**
     * The name of the group that you want to describe.
     */
    GroupName: GroupName;
    /**
     * The ID for the Amazon Web Services account that the group is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface DescribeGroupResponse {
    /**
     * The name of the group.
     */
    Group?: Group;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeIAMPolicyAssignmentRequest {
    /**
     * The ID of the Amazon Web Services account that contains the assignment that you want to describe.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The name of the assignment, also called a rule.
     */
    AssignmentName: IAMPolicyAssignmentName;
    /**
     * The namespace that contains the assignment.
     */
    Namespace: Namespace;
  }
  export interface DescribeIAMPolicyAssignmentResponse {
    /**
     * Information describing the IAMpolicy assignment.
     */
    IAMPolicyAssignment?: IAMPolicyAssignment;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeIngestionRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the dataset used in the ingestion.
     */
    DataSetId: String;
    /**
     * An ID for the ingestion.
     */
    IngestionId: IngestionId;
  }
  export interface DescribeIngestionResponse {
    /**
     * Information about the ingestion.
     */
    Ingestion?: Ingestion;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeIpRestrictionRequest {
    /**
     * Your AWS account ID.
     */
    AwsAccountId: AwsAccountId;
  }
  export interface DescribeIpRestrictionResponse {
    /**
     * Your AWS account ID.
     */
    AwsAccountId?: AwsAccountId;
    /**
     * Describes the IP rules with CIDR range and description.
     */
    IpRestrictionRuleMap?: IpRestrictionRuleMap;
    /**
     * Whether or not IP rules are enabled.
     */
    Enabled?: NullableBoolean;
    /**
     * The ID of the describe request.
     */
    RequestId?: String;
    /**
     * The status of a set of IP restrictions. A successful request returns a 200 status code.
     */
    Status?: StatusCode;
  }
  export interface DescribeNamespaceRequest {
    /**
     * The ID for the Amazon Web Services account that contains the Amazon QuickSight namespace that you want to describe.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace that you want to describe.
     */
    Namespace: Namespace;
  }
  export interface DescribeNamespaceResponse {
    /**
     * The information about the namespace that you're describing. The response includes the namespace ARN, name, Amazon Web Services Region, creation status, and identity store. DescribeNamespace also works for namespaces that are in the process of being created. For incomplete namespaces, this API operation lists the namespace error types and messages associated with the creation process.
     */
    Namespace?: NamespaceInfoV2;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeTemplateAliasRequest {
    /**
     * The ID of the Amazon Web Services account that contains the template alias that you're describing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the template.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * The name of the template alias that you want to describe. If you name a specific alias, you describe the version that the alias points to. You can specify the latest version of the template by providing the keyword $LATEST in the AliasName parameter. The keyword $PUBLISHED doesn't apply to templates.
     */
    AliasName: AliasName;
  }
  export interface DescribeTemplateAliasResponse {
    /**
     * Information about the template alias.
     */
    TemplateAlias?: TemplateAlias;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DescribeTemplatePermissionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the template that you're describing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the template.
     */
    TemplateId: RestrictiveResourceId;
  }
  export interface DescribeTemplatePermissionsResponse {
    /**
     * The ID for the template.
     */
    TemplateId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the template.
     */
    TemplateArn?: Arn;
    /**
     * A list of resource permissions to be set on the template. 
     */
    Permissions?: ResourcePermissionList;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeTemplateRequest {
    /**
     * The ID of the Amazon Web Services account that contains the template that you're describing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the template.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * (Optional) The number for the version to describe. If a VersionNumber parameter value isn't provided, the latest version of the template is described.
     */
    VersionNumber?: VersionNumber;
    /**
     * The alias of the template that you want to describe. If you name a specific alias, you describe the version that the alias points to. You can specify the latest version of the template by providing the keyword $LATEST in the AliasName parameter. The keyword $PUBLISHED doesn't apply to templates.
     */
    AliasName?: AliasName;
  }
  export interface DescribeTemplateResponse {
    /**
     * The template structure for the object you want to describe.
     */
    Template?: Template;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DescribeThemeAliasRequest {
    /**
     * The ID of the Amazon Web Services account that contains the theme alias that you're describing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the theme.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * The name of the theme alias that you want to describe.
     */
    AliasName: AliasName;
  }
  export interface DescribeThemeAliasResponse {
    /**
     * Information about the theme alias.
     */
    ThemeAlias?: ThemeAlias;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DescribeThemePermissionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the theme that you're describing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the theme that you want to describe permissions for.
     */
    ThemeId: RestrictiveResourceId;
  }
  export interface DescribeThemePermissionsResponse {
    /**
     * The ID for the theme.
     */
    ThemeId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the theme.
     */
    ThemeArn?: Arn;
    /**
     * A list of resource permissions set on the theme. 
     */
    Permissions?: ResourcePermissionList;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface DescribeThemeRequest {
    /**
     * The ID of the Amazon Web Services account that contains the theme that you're describing.
     */
    AwsAccountId: AwsAndAccountId;
    /**
     * The ID for the theme.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * The version number for the version to describe. If a VersionNumber parameter value isn't provided, the latest version of the theme is described.
     */
    VersionNumber?: VersionNumber;
    /**
     * The alias of the theme that you want to describe. If you name a specific alias, you describe the version that the alias points to. You can specify the latest version of the theme by providing the keyword $LATEST in the AliasName parameter. The keyword $PUBLISHED doesn't apply to themes.
     */
    AliasName?: AliasName;
  }
  export interface DescribeThemeResponse {
    /**
     * The information about the theme that you are describing.
     */
    Theme?: Theme;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface DescribeUserRequest {
    /**
     * The name of the user that you want to describe.
     */
    UserName: UserName;
    /**
     * The ID for the Amazon Web Services account that the user is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface DescribeUserResponse {
    /**
     * The user name.
     */
    User?: User;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export type Domain = string;
  export type Double = number;
  export type DoubleList = Double[];
  export type Edition = "STANDARD"|"ENTERPRISE"|string;
  export type EmbeddingIdentityType = "IAM"|"QUICKSIGHT"|"ANONYMOUS"|string;
  export type EmbeddingUrl = string;
  export type EntryPath = string;
  export type EntryPoint = string;
  export interface ErrorInfo {
    /**
     * Error type.
     */
    Type?: IngestionErrorType;
    /**
     * Error message.
     */
    Message?: String;
  }
  export interface ExportToCSVOption {
    /**
     * Availability status.
     */
    AvailabilityStatus?: DashboardBehavior;
  }
  export type Expression = string;
  export interface FieldFolder {
    /**
     * The description for a field folder.
     */
    description?: FieldFolderDescription;
    /**
     * A folder has a list of columns. A column can only be in one folder.
     */
    columns?: FolderColumnList;
  }
  export type FieldFolderDescription = string;
  export type FieldFolderMap = {[key: string]: FieldFolder};
  export type FieldFolderPath = string;
  export type FileFormat = "CSV"|"TSV"|"CLF"|"ELF"|"XLSX"|"JSON"|string;
  export interface FilterOperation {
    /**
     * An expression that must evaluate to a Boolean value. Rows for which the expression evaluates to true are kept in the dataset.
     */
    ConditionExpression: Expression;
  }
  export type FilterOperator = "StringEquals"|string;
  export interface Folder {
    /**
     * The folder ID.
     */
    FolderId?: RestrictiveResourceId;
    /**
     * The folder Amazon Resource Name (ARN).
     */
    Arn?: Arn;
    /**
     * A display name for the folder.
     */
    Name?: FolderName;
    /**
     * The type of the folder.
     */
    FolderType?: FolderType;
    /**
     * An array of ancestor folder ARN strings.
     */
    FolderPath?: Path;
    /**
     * The time that the folder was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The time that the folder was last updated.
     */
    LastUpdatedTime?: Timestamp;
  }
  export type FolderColumnList = String[];
  export type FolderFilterAttribute = "PARENT_FOLDER_ARN"|string;
  export interface FolderMember {
    /**
     * The ID of the asset.
     */
    MemberId?: RestrictiveResourceId;
    /**
     * The type of the asset.
     */
    MemberType?: MemberType;
  }
  export type FolderMemberList = MemberIdArnPair[];
  export type FolderName = string;
  export interface FolderSearchFilter {
    /**
     * The comparison operator that you want to use as a filter. For example, "Operator": "StringEquals".
     */
    Operator?: FilterOperator;
    /**
     * The name of the value that you want to use as a filter. For example, "Name": "PARENT_FOLDER_ARN".
     */
    Name?: FolderFilterAttribute;
    /**
     * The value of the named item (in this example, PARENT_FOLDER_ARN), that you want to use as a filter. For example, "Value": "arn:aws:quicksight:us-east-1:1:folder/folderId".
     */
    Value?: String;
  }
  export type FolderSearchFilterList = FolderSearchFilter[];
  export interface FolderSummary {
    /**
     * The Amazon Resource Name (ARN).
     */
    Arn?: Arn;
    /**
     * The folder ID.
     */
    FolderId?: RestrictiveResourceId;
    /**
     * The display name of the folder.
     */
    Name?: FolderName;
    /**
     * The type of folder.
     */
    FolderType?: FolderType;
    /**
     * The time that the folder was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The time that the folder was last updated.
     */
    LastUpdatedTime?: Timestamp;
  }
  export type FolderSummaryList = FolderSummary[];
  export type FolderType = "SHARED"|string;
  export interface GenerateEmbedUrlForAnonymousUserRequest {
    /**
     * The ID for the Amazon Web Services account that contains the dashboard that you're embedding.
     */
    AwsAccountId: AwsAccountId;
    /**
     * How many minutes the session is valid. The session lifetime must be in [15-600] minutes range.
     */
    SessionLifetimeInMinutes?: SessionLifetimeInMinutes;
    /**
     * The Amazon QuickSight namespace that the anonymous user virtually belongs to. If you are not using an Amazon QuickSight custom namespace, set this to default.
     */
    Namespace: Namespace;
    /**
     * The session tags used for row-level security. Before you use this parameter, make sure that you have configured the relevant datasets using the DataSet$RowLevelPermissionTagConfiguration parameter so that session tags can be used to provide row-level security. These are not the tags used for the Amazon Web Services resource tagging feature. For more information, see Using Row-Level Security (RLS) with Tags.
     */
    SessionTags?: SessionTagList;
    /**
     * The Amazon Resource Names for the Amazon QuickSight resources that the user is authorized to access during the lifetime of the session. If you choose Dashboard embedding experience, pass the list of dashboard ARNs in the account that you want the user to be able to view.
     */
    AuthorizedResourceArns: ArnList;
    /**
     * The configuration of the experience you are embedding.
     */
    ExperienceConfiguration: AnonymousUserEmbeddingExperienceConfiguration;
  }
  export interface GenerateEmbedUrlForAnonymousUserResponse {
    /**
     * The embed URL for the dashboard.
     */
    EmbedUrl: EmbeddingUrl;
    /**
     * The HTTP status of the request.
     */
    Status: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId: String;
  }
  export interface GenerateEmbedUrlForRegisteredUserRequest {
    /**
     * The ID for the Amazon Web Services account that contains the dashboard that you're embedding.
     */
    AwsAccountId: AwsAccountId;
    /**
     * How many minutes the session is valid. The session lifetime must be in [15-600] minutes range.
     */
    SessionLifetimeInMinutes?: SessionLifetimeInMinutes;
    /**
     * The Amazon Resource Name for the registered user.
     */
    UserArn: Arn;
    /**
     * The experience you are embedding. For registered users, you can embed Amazon QuickSight dashboards, the entire Amazon QuickSight console, or the Amazon QuickSight Q search bar.
     */
    ExperienceConfiguration: RegisteredUserEmbeddingExperienceConfiguration;
  }
  export interface GenerateEmbedUrlForRegisteredUserResponse {
    /**
     * The embed URL for the Amazon QuickSight dashboard, console, or Q search bar.
     */
    EmbedUrl: EmbeddingUrl;
    /**
     * The HTTP status of the request.
     */
    Status: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId: String;
  }
  export interface GeoSpatialColumnGroup {
    /**
     * A display name for the hierarchy.
     */
    Name: ColumnGroupName;
    /**
     * Country code.
     */
    CountryCode: GeoSpatialCountryCode;
    /**
     * Columns in this hierarchy.
     */
    Columns: ColumnList;
  }
  export type GeoSpatialCountryCode = "US"|string;
  export type GeoSpatialDataRole = "COUNTRY"|"STATE"|"COUNTY"|"CITY"|"POSTCODE"|"LONGITUDE"|"LATITUDE"|string;
  export interface GetDashboardEmbedUrlRequest {
    /**
     * The ID for the Amazon Web Services account that contains the dashboard that you're embedding.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dashboard, also added to the Identity and Access Management (IAM) policy.
     */
    DashboardId: RestrictiveResourceId;
    /**
     * The authentication method that the user uses to sign in.
     */
    IdentityType: EmbeddingIdentityType;
    /**
     * How many minutes the session is valid. The session lifetime must be 15-600 minutes.
     */
    SessionLifetimeInMinutes?: SessionLifetimeInMinutes;
    /**
     * Remove the undo/redo button on the embedded dashboard. The default is FALSE, which enables the undo/redo button.
     */
    UndoRedoDisabled?: Boolean;
    /**
     * Remove the reset button on the embedded dashboard. The default is FALSE, which enables the reset button.
     */
    ResetDisabled?: Boolean;
    /**
     * Adds persistence of state for the user session in an embedded dashboard. Persistence applies to the sheet and the parameter settings. These are control settings that the dashboard subscriber (Amazon QuickSight reader) chooses while viewing the dashboard. If this is set to TRUE, the settings are the same when the subscriber reopens the same dashboard URL. The state is stored in Amazon QuickSight, not in a browser cookie. If this is set to FALSE, the state of the user session is not persisted. The default is FALSE.
     */
    StatePersistenceEnabled?: Boolean;
    /**
     * The Amazon QuickSight user's Amazon Resource Name (ARN), for use with QUICKSIGHT identity type. You can use this for any Amazon QuickSight users in your account (readers, authors, or admins) authenticated as one of the following:   Active Directory (AD) users or group members   Invited nonfederated users   IAMusers and IAMrole-based sessions authenticated through Federated Single Sign-On using SAML, OpenID Connect, or IAMfederation.   Omit this parameter for users in the third group – IAMusers and IAM role-based sessions.
     */
    UserArn?: Arn;
    /**
     * The Amazon QuickSight namespace that contains the dashboard IDs in this request. If you're not using a custom namespace, set Namespace = default.
     */
    Namespace?: Namespace;
    /**
     * A list of one or more dashboard IDs that you want to add to a session that includes anonymous users. The IdentityType parameter must be set to ANONYMOUS for this to work, because other identity types authenticate as Amazon QuickSight or IAMusers. For example, if you set "--dashboard-id dash_id1 --dashboard-id dash_id2 dash_id3 identity-type ANONYMOUS", the session can access all three dashboards. 
     */
    AdditionalDashboardIds?: AdditionalDashboardIdList;
  }
  export interface GetDashboardEmbedUrlResponse {
    /**
     * A single-use URL that you can put into your server-side webpage to embed your dashboard. This URL is valid for 5 minutes. The API operation provides the URL with an auth_code value that enables one (and only one) sign-on to a user session that is valid for 10 hours. 
     */
    EmbedUrl?: EmbeddingUrl;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface GetSessionEmbedUrlRequest {
    /**
     * The ID for the Amazon Web Services account associated with your Amazon QuickSight subscription.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The URL you use to access the embedded session. The entry point URL is constrained to the following paths:    /start     /start/analyses     /start/dashboards     /start/favorites     /dashboards/DashboardId  - where DashboardId is the actual ID key from the Amazon QuickSight console URL of the dashboard    /analyses/AnalysisId  - where AnalysisId is the actual ID key from the Amazon QuickSight console URL of the analysis  
     */
    EntryPoint?: EntryPoint;
    /**
     * How many minutes the session is valid. The session lifetime must be 15-600 minutes.
     */
    SessionLifetimeInMinutes?: SessionLifetimeInMinutes;
    /**
     * The Amazon QuickSight user's Amazon Resource Name (ARN), for use with QUICKSIGHT identity type. You can use this for any type of Amazon QuickSight users in your account (readers, authors, or admins). They need to be authenticated as one of the following:   Active Directory (AD) users or group members   Invited nonfederated users   Identity and Access Management (IAM) users and IAM role-based sessions authenticated through Federated Single Sign-On using SAML, OpenID Connect, or IAM federation   Omit this parameter for users in the third group, IAM users and IAM role-based sessions.
     */
    UserArn?: Arn;
  }
  export interface GetSessionEmbedUrlResponse {
    /**
     * A single-use URL that you can put into your server-side web page to embed your Amazon QuickSight session. This URL is valid for 5 minutes. The API operation provides the URL with an auth_code value that enables one (and only one) sign-on to a user session that is valid for 10 hours. 
     */
    EmbedUrl?: EmbeddingUrl;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface Group {
    /**
     * The Amazon Resource Name (ARN) for the group.
     */
    Arn?: Arn;
    /**
     * The name of the group.
     */
    GroupName?: GroupName;
    /**
     * The group description.
     */
    Description?: GroupDescription;
    /**
     * The principal ID of the group.
     */
    PrincipalId?: String;
  }
  export type GroupDescription = string;
  export type GroupList = Group[];
  export interface GroupMember {
    /**
     * The Amazon Resource Name (ARN) for the group member (user).
     */
    Arn?: Arn;
    /**
     * The name of the group member (user).
     */
    MemberName?: GroupMemberName;
  }
  export type GroupMemberList = GroupMember[];
  export type GroupMemberName = string;
  export type GroupName = string;
  export interface GutterStyle {
    /**
     * This Boolean value controls whether to display a gutter space between sheet tiles. 
     */
    Show?: boolean;
  }
  export type HexColor = string;
  export type Host = string;
  export interface IAMPolicyAssignment {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId?: AwsAccountId;
    /**
     * Assignment ID.
     */
    AssignmentId?: String;
    /**
     * Assignment name.
     */
    AssignmentName?: IAMPolicyAssignmentName;
    /**
     * The Amazon Resource Name (ARN) for the IAMpolicy.
     */
    PolicyArn?: Arn;
    /**
     * Identities.
     */
    Identities?: IdentityMap;
    /**
     * Assignment status.
     */
    AssignmentStatus?: AssignmentStatus;
  }
  export type IAMPolicyAssignmentName = string;
  export interface IAMPolicyAssignmentSummary {
    /**
     * Assignment name.
     */
    AssignmentName?: IAMPolicyAssignmentName;
    /**
     * Assignment status.
     */
    AssignmentStatus?: AssignmentStatus;
  }
  export type IAMPolicyAssignmentSummaryList = IAMPolicyAssignmentSummary[];
  export type IdentityMap = {[key: string]: IdentityNameList};
  export type IdentityName = string;
  export type IdentityNameList = IdentityName[];
  export type IdentityStore = "QUICKSIGHT"|string;
  export type IdentityType = "IAM"|"QUICKSIGHT"|string;
  export interface Ingestion {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn: Arn;
    /**
     * Ingestion ID.
     */
    IngestionId?: IngestionId;
    /**
     * Ingestion status.
     */
    IngestionStatus: IngestionStatus;
    /**
     * Error information for this ingestion.
     */
    ErrorInfo?: ErrorInfo;
    RowInfo?: RowInfo;
    QueueInfo?: QueueInfo;
    /**
     * The time that this ingestion started.
     */
    CreatedTime: Timestamp;
    /**
     * The time that this ingestion took, measured in seconds.
     */
    IngestionTimeInSeconds?: Long;
    /**
     * The size of the data ingested, in bytes.
     */
    IngestionSizeInBytes?: Long;
    /**
     * Event source for this ingestion.
     */
    RequestSource?: IngestionRequestSource;
    /**
     * Type of this ingestion.
     */
    RequestType?: IngestionRequestType;
  }
  export type IngestionErrorType = "FAILURE_TO_ASSUME_ROLE"|"INGESTION_SUPERSEDED"|"INGESTION_CANCELED"|"DATA_SET_DELETED"|"DATA_SET_NOT_SPICE"|"S3_UPLOADED_FILE_DELETED"|"S3_MANIFEST_ERROR"|"DATA_TOLERANCE_EXCEPTION"|"SPICE_TABLE_NOT_FOUND"|"DATA_SET_SIZE_LIMIT_EXCEEDED"|"ROW_SIZE_LIMIT_EXCEEDED"|"ACCOUNT_CAPACITY_LIMIT_EXCEEDED"|"CUSTOMER_ERROR"|"DATA_SOURCE_NOT_FOUND"|"IAM_ROLE_NOT_AVAILABLE"|"CONNECTION_FAILURE"|"SQL_TABLE_NOT_FOUND"|"PERMISSION_DENIED"|"SSL_CERTIFICATE_VALIDATION_FAILURE"|"OAUTH_TOKEN_FAILURE"|"SOURCE_API_LIMIT_EXCEEDED_FAILURE"|"PASSWORD_AUTHENTICATION_FAILURE"|"SQL_SCHEMA_MISMATCH_ERROR"|"INVALID_DATE_FORMAT"|"INVALID_DATAPREP_SYNTAX"|"SOURCE_RESOURCE_LIMIT_EXCEEDED"|"SQL_INVALID_PARAMETER_VALUE"|"QUERY_TIMEOUT"|"SQL_NUMERIC_OVERFLOW"|"UNRESOLVABLE_HOST"|"UNROUTABLE_HOST"|"SQL_EXCEPTION"|"S3_FILE_INACCESSIBLE"|"IOT_FILE_NOT_FOUND"|"IOT_DATA_SET_FILE_EMPTY"|"INVALID_DATA_SOURCE_CONFIG"|"DATA_SOURCE_AUTH_FAILED"|"DATA_SOURCE_CONNECTION_FAILED"|"FAILURE_TO_PROCESS_JSON_FILE"|"INTERNAL_SERVICE_ERROR"|"REFRESH_SUPPRESSED_BY_EDIT"|"PERMISSION_NOT_FOUND"|"ELASTICSEARCH_CURSOR_NOT_ENABLED"|"CURSOR_NOT_ENABLED"|string;
  export type IngestionId = string;
  export type IngestionMaxResults = number;
  export type IngestionRequestSource = "MANUAL"|"SCHEDULED"|string;
  export type IngestionRequestType = "INITIAL_INGESTION"|"EDIT"|"INCREMENTAL_REFRESH"|"FULL_REFRESH"|string;
  export type IngestionStatus = "INITIALIZED"|"QUEUED"|"RUNNING"|"FAILED"|"COMPLETED"|"CANCELLED"|string;
  export type IngestionType = "INCREMENTAL_REFRESH"|"FULL_REFRESH"|string;
  export type Ingestions = Ingestion[];
  export interface InputColumn {
    /**
     * The name of this column in the underlying data source.
     */
    Name: ColumnName;
    /**
     * The data type of the column.
     */
    Type: InputColumnDataType;
  }
  export type InputColumnDataType = "STRING"|"INTEGER"|"DECIMAL"|"DATETIME"|"BIT"|"BOOLEAN"|"JSON"|string;
  export type InputColumnList = InputColumn[];
  export type InstanceId = string;
  export interface IntegerParameter {
    /**
     * The name of the integer parameter.
     */
    Name: NonEmptyString;
    /**
     * The values for the integer parameter.
     */
    Values: LongList;
  }
  export type IntegerParameterList = IntegerParameter[];
  export type IpRestrictionRuleDescription = string;
  export type IpRestrictionRuleMap = {[key: string]: IpRestrictionRuleDescription};
  export interface JiraParameters {
    /**
     * The base URL of the Jira site.
     */
    SiteBaseUrl: SiteBaseUrl;
  }
  export interface JoinInstruction {
    /**
     * The operand on the left side of a join.
     */
    LeftOperand: LogicalTableId;
    /**
     * The operand on the right side of a join.
     */
    RightOperand: LogicalTableId;
    /**
     * Join key properties of the left operand.
     */
    LeftJoinKeyProperties?: JoinKeyProperties;
    /**
     * Join key properties of the right operand.
     */
    RightJoinKeyProperties?: JoinKeyProperties;
    /**
     * The type of join that it is.
     */
    Type: JoinType;
    /**
     * The join instructions provided in the ON clause of a join.
     */
    OnClause: OnClause;
  }
  export interface JoinKeyProperties {
    /**
     * A value that indicates that a row in a table is uniquely identified by the columns in a join key. This is used by Amazon QuickSight to optimize query performance.
     */
    UniqueKey?: Boolean;
  }
  export type JoinType = "INNER"|"OUTER"|"LEFT"|"RIGHT"|string;
  export interface ListAnalysesRequest {
    /**
     * The ID of the Amazon Web Services account that contains the analyses.
     */
    AwsAccountId: AwsAccountId;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
  }
  export interface ListAnalysesResponse {
    /**
     * Metadata describing each of the analyses that are listed.
     */
    AnalysisSummaryList?: AnalysisSummaryList;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface ListDashboardVersionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the dashboard that you're listing versions for.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dashboard.
     */
    DashboardId: RestrictiveResourceId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDashboardVersionsResponse {
    /**
     * A structure that contains information about each version of the dashboard.
     */
    DashboardVersionSummaryList?: DashboardVersionSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface ListDashboardsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the dashboards that you're listing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDashboardsResponse {
    /**
     * A structure that contains all of the dashboards in your Amazon Web Services account. This structure provides basic information about the dashboards.
     */
    DashboardSummaryList?: DashboardSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface ListDataSetsRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDataSetsResponse {
    /**
     * The list of dataset summaries.
     */
    DataSetSummaries?: DataSetSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface ListDataSourcesRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDataSourcesResponse {
    /**
     * A list of data sources.
     */
    DataSources?: DataSourceList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface ListFolderMembersRequest {
    /**
     * The AWS account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The folder ID.
     */
    FolderId: RestrictiveResourceId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListFolderMembersResponse {
    /**
     * The status. If succeeded, the status is SC_OK 
     */
    Status?: StatusCode;
    /**
     * A structure that contains all of the folder members (dashboards, analyses, and datasets) in the folder.
     */
    FolderMemberList?: FolderMemberList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface ListFoldersRequest {
    /**
     * The AWS account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListFoldersResponse {
    /**
     * The status. If succeeded, the status is SC_OK 
     */
    Status?: StatusCode;
    /**
     * A structure that contains all of the folders in your AWS account. This structure provides basic information about the folders.
     */
    FolderSummaryList?: FolderSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface ListGroupMembershipsRequest {
    /**
     * The name of the group that you want to see a membership list of.
     */
    GroupName: GroupName;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return from this request.
     */
    MaxResults?: MaxResults;
    /**
     * The ID for the Amazon Web Services account that the group is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface ListGroupMembershipsResponse {
    /**
     * The list of the members of the group.
     */
    GroupMemberList?: GroupMemberList;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface ListGroupsRequest {
    /**
     * The ID for the Amazon Web Services account that the group is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface ListGroupsResponse {
    /**
     * The list of the groups.
     */
    GroupList?: GroupList;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface ListIAMPolicyAssignmentsForUserRequest {
    /**
     * The ID of the Amazon Web Services account that contains the assignments.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The name of the user.
     */
    UserName: UserName;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
    /**
     * The namespace of the assignment.
     */
    Namespace: Namespace;
  }
  export interface ListIAMPolicyAssignmentsForUserResponse {
    /**
     * The active assignments for this user.
     */
    ActiveAssignments?: ActiveIAMPolicyAssignmentList;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface ListIAMPolicyAssignmentsRequest {
    /**
     * The ID of the Amazon Web Services account that contains these IAMpolicy assignments.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The status of the assignments.
     */
    AssignmentStatus?: AssignmentStatus;
    /**
     * The namespace for the assignments.
     */
    Namespace: Namespace;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListIAMPolicyAssignmentsResponse {
    /**
     * Information describing the IAMpolicy assignments.
     */
    IAMPolicyAssignments?: IAMPolicyAssignmentSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface ListIngestionsRequest {
    /**
     * The ID of the dataset used in the ingestion.
     */
    DataSetId: String;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: IngestionMaxResults;
  }
  export interface ListIngestionsResponse {
    /**
     * A list of the ingestions.
     */
    Ingestions?: Ingestions;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface ListNamespacesRequest {
    /**
     * The ID for the Amazon Web Services account that contains the Amazon QuickSight namespaces that you want to list.
     */
    AwsAccountId: AwsAccountId;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
  }
  export interface ListNamespacesResponse {
    /**
     * The information about the namespaces in this Amazon Web Services account. The response includes the namespace ARN, name, Amazon Web Services Region, notification email address, creation status, and identity store.
     */
    Namespaces?: Namespaces;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want a list of tags for.
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the resource.
     */
    Tags?: TagList;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface ListTemplateAliasesRequest {
    /**
     * The ID of the Amazon Web Services account that contains the template aliases that you're listing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the template.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTemplateAliasesResponse {
    /**
     * A structure containing the list of the template's aliases.
     */
    TemplateAliasList?: TemplateAliasList;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
  }
  export interface ListTemplateVersionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the templates that you're listing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the template.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTemplateVersionsResponse {
    /**
     * A structure containing a list of all the versions of the specified template.
     */
    TemplateVersionSummaryList?: TemplateVersionSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface ListTemplatesRequest {
    /**
     * The ID of the Amazon Web Services account that contains the templates that you're listing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTemplatesResponse {
    /**
     * A structure containing information about the templates in the list.
     */
    TemplateSummaryList?: TemplateSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface ListThemeAliasesRequest {
    /**
     * The ID of the Amazon Web Services account that contains the theme aliases that you're listing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the theme.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListThemeAliasesResponse {
    /**
     * A structure containing the list of the theme's aliases.
     */
    ThemeAliasList?: ThemeAliasList;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
  }
  export interface ListThemeVersionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the themes that you're listing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the theme.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListThemeVersionsResponse {
    /**
     * A structure containing a list of all the versions of the specified theme.
     */
    ThemeVersionSummaryList?: ThemeVersionSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface ListThemesRequest {
    /**
     * The ID of the Amazon Web Services account that contains the themes that you're listing.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
    /**
     * The type of themes that you want to list. Valid options include the following:    ALL (default)- Display all existing themes.    CUSTOM - Display only the themes created by people using Amazon QuickSight.    QUICKSIGHT - Display only the starting themes defined by Amazon QuickSight.  
     */
    Type?: ThemeType;
  }
  export interface ListThemesResponse {
    /**
     * Information about the themes in the list.
     */
    ThemeSummaryList?: ThemeSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface ListUserGroupsRequest {
    /**
     * The Amazon QuickSight user name that you want to list group memberships for.
     */
    UserName: UserName;
    /**
     * The Amazon Web Services account ID that the user is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return from this request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListUserGroupsResponse {
    /**
     * The list of groups the user is a member of.
     */
    GroupList?: GroupList;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface ListUsersRequest {
    /**
     * The ID for the Amazon Web Services account that the user is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return from this request.
     */
    MaxResults?: MaxResults;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface ListUsersResponse {
    /**
     * The list of users.
     */
    UserList?: UserList;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface LogicalTable {
    /**
     * A display name for the logical table.
     */
    Alias: LogicalTableAlias;
    /**
     * Transform operations that act on this logical table.
     */
    DataTransforms?: TransformOperationList;
    /**
     * Source of this logical table.
     */
    Source: LogicalTableSource;
  }
  export type LogicalTableAlias = string;
  export type LogicalTableId = string;
  export type LogicalTableMap = {[key: string]: LogicalTable};
  export interface LogicalTableSource {
    /**
     * Specifies the result of a join of two logical tables.
     */
    JoinInstruction?: JoinInstruction;
    /**
     * Physical table ID.
     */
    PhysicalTableId?: PhysicalTableId;
    /**
     * The Amazon Resource Number (ARN) of the parent dataset.
     */
    DataSetArn?: Arn;
  }
  export type Long = number;
  export type LongList = Long[];
  export interface ManifestFileLocation {
    /**
     * Amazon S3 bucket.
     */
    Bucket: S3Bucket;
    /**
     * Amazon S3 key that identifies an object.
     */
    Key: S3Key;
  }
  export interface MarginStyle {
    /**
     * This Boolean value controls whether to display sheet margins.
     */
    Show?: boolean;
  }
  export interface MariaDbParameters {
    /**
     * Host.
     */
    Host: Host;
    /**
     * Port.
     */
    Port: Port;
    /**
     * Database.
     */
    Database: Database;
  }
  export type MaxResults = number;
  export interface MemberIdArnPair {
    /**
     * The ID of the member.
     */
    MemberId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the member.
     */
    MemberArn?: Arn;
  }
  export type MemberType = "DASHBOARD"|"ANALYSIS"|"DATASET"|string;
  export interface MySqlParameters {
    /**
     * Host.
     */
    Host: Host;
    /**
     * Port.
     */
    Port: Port;
    /**
     * Database.
     */
    Database: Database;
  }
  export type Namespace = string;
  export interface NamespaceError {
    /**
     * The error type.
     */
    Type?: NamespaceErrorType;
    /**
     * The message for the error.
     */
    Message?: String;
  }
  export type NamespaceErrorType = "PERMISSION_DENIED"|"INTERNAL_SERVICE_ERROR"|string;
  export interface NamespaceInfoV2 {
    /**
     * The name of the error.
     */
    Name?: Namespace;
    /**
     * The namespace ARN.
     */
    Arn?: Arn;
    /**
     * The namespace Amazon Web Services Region.
     */
    CapacityRegion?: String;
    /**
     * The creation status of a namespace that is not yet completely created.
     */
    CreationStatus?: NamespaceStatus;
    /**
     * The identity store used for the namespace.
     */
    IdentityStore?: IdentityStore;
    /**
     * An error that occurred when the namespace was created.
     */
    NamespaceError?: NamespaceError;
  }
  export type NamespaceStatus = "CREATED"|"CREATING"|"DELETING"|"RETRYABLE_FAILURE"|"NON_RETRYABLE_FAILURE"|string;
  export type Namespaces = NamespaceInfoV2[];
  export type NonEmptyString = string;
  export type NullableBoolean = boolean;
  export type OnClause = string;
  export type OptionalPort = number;
  export interface OracleParameters {
    /**
     * An Oracle host.
     */
    Host: Host;
    /**
     * Port.
     */
    Port: Port;
    /**
     * Database.
     */
    Database: Database;
  }
  export interface OutputColumn {
    /**
     * A display name for the dataset.
     */
    Name?: ColumnName;
    /**
     * A description for a column.
     */
    Description?: ColumnDescriptiveText;
    /**
     * Type.
     */
    Type?: ColumnDataType;
  }
  export type OutputColumnList = OutputColumn[];
  export interface Parameters {
    /**
     * The parameters that have a data type of string.
     */
    StringParameters?: StringParameterList;
    /**
     * The parameters that have a data type of integer.
     */
    IntegerParameters?: IntegerParameterList;
    /**
     * The parameters that have a data type of decimal.
     */
    DecimalParameters?: DecimalParameterList;
    /**
     * The parameters that have a data type of date-time.
     */
    DateTimeParameters?: DateTimeParameterList;
  }
  export type Password = string;
  export type Path = Arn[];
  export interface PhysicalTable {
    /**
     * A physical table type for relational data sources.
     */
    RelationalTable?: RelationalTable;
    /**
     * A physical table type built from the results of the custom SQL query.
     */
    CustomSql?: CustomSql;
    /**
     * A physical table type for as S3 data source.
     */
    S3Source?: S3Source;
  }
  export type PhysicalTableId = string;
  export type PhysicalTableMap = {[key: string]: PhysicalTable};
  export type Port = number;
  export type PositiveInteger = number;
  export interface PostgreSqlParameters {
    /**
     * Host.
     */
    Host: Host;
    /**
     * Port.
     */
    Port: Port;
    /**
     * Database.
     */
    Database: Database;
  }
  export interface PrestoParameters {
    /**
     * Host.
     */
    Host: Host;
    /**
     * Port.
     */
    Port: Port;
    /**
     * Catalog.
     */
    Catalog: Catalog;
  }
  export type Principal = string;
  export type PrincipalList = String[];
  export interface ProjectOperation {
    /**
     * Projected columns.
     */
    ProjectedColumns: ProjectedColumnList;
  }
  export type ProjectedColumnList = String[];
  export type Query = string;
  export interface QueueInfo {
    /**
     * The ID of the queued ingestion.
     */
    WaitingOnIngestion: String;
    /**
     * The ID of the ongoing ingestion. The queued ingestion is waiting for the ongoing ingestion to complete.
     */
    QueuedIngestion: String;
  }
  export interface RdsParameters {
    /**
     * Instance ID.
     */
    InstanceId: InstanceId;
    /**
     * Database.
     */
    Database: Database;
  }
  export type RecoveryWindowInDays = number;
  export interface RedshiftParameters {
    /**
     * Host. This field can be blank if ClusterId is provided.
     */
    Host?: Host;
    /**
     * Port. This field can be blank if the ClusterId is provided.
     */
    Port?: OptionalPort;
    /**
     * Database.
     */
    Database: Database;
    /**
     * Cluster ID. This field can be blank if the Host and Port are provided.
     */
    ClusterId?: ClusterId;
  }
  export interface RegisterUserRequest {
    /**
     * Amazon QuickSight supports several ways of managing the identity of users. This parameter accepts two values:    IAM: A user whose identity maps to an existing IAMuser or role.     QUICKSIGHT: A user whose identity is owned and managed internally by Amazon QuickSight.   
     */
    IdentityType: IdentityType;
    /**
     * The email address of the user that you want to register.
     */
    Email: String;
    /**
     * The Amazon QuickSight role for the user. The user role can be one of the following:    READER: A user who has read-only access to dashboards.    AUTHOR: A user who can create data sources, datasets, analyses, and dashboards.    ADMIN: A user who is an author, who can also manage Amazon QuickSight settings.    RESTRICTED_READER: This role isn't currently available for use.    RESTRICTED_AUTHOR: This role isn't currently available for use.  
     */
    UserRole: UserRole;
    /**
     * The ARN of the IAMuser or role that you are registering with Amazon QuickSight. 
     */
    IamArn?: String;
    /**
     * You need to use this parameter only when you register one or more users using an assumed IAMrole. You don't need to provide the session name for other scenarios, for example when you are registering an IAMuser or an Amazon QuickSight user. You can register multiple users using the same IAMrole if each user has a different session name. For more information on assuming IAMroles, see  assume-role  in the AWS CLI Reference. 
     */
    SessionName?: RoleSessionName;
    /**
     * The ID for the Amazon Web Services account that the user is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
    /**
     * The Amazon QuickSight user name that you want to create for the user you are registering.
     */
    UserName?: UserName;
    /**
     * (Enterprise edition only) The name of the custom permissions profile that you want to assign to this user. Customized permissions allows you to control a user's access by restricting access the following operations:   Create and update data sources   Create and update datasets   Create and update email reports   Subscribe to email reports   To add custom permissions to an existing user, use  UpdateUser  instead. A set of custom permissions includes any combination of these restrictions. Currently, you need to create the profile names for custom permission sets by using the Amazon QuickSight console. Then, you use the RegisterUser API operation to assign the named set of permissions to a Amazon QuickSight user.  Amazon QuickSight custom permissions are applied through IAMpolicies. Therefore, they override the permissions typically granted by assigning Amazon QuickSight users to one of the default security cohorts in Amazon QuickSight (admin, author, reader). This feature is available only to Amazon QuickSight Enterprise edition subscriptions.
     */
    CustomPermissionsName?: RoleName;
    /**
     * The type of supported external login provider that provides identity to let a user federate into Amazon QuickSight with an associated Identity and Access Management(IAM) role. The type of supported external login provider can be one of the following.    COGNITO: Amazon Cognito. The provider URL is cognito-identity.amazonaws.com. When choosing the COGNITO provider type, don’t use the "CustomFederationProviderUrl" parameter which is only needed when the external provider is custom.    CUSTOM_OIDC: Custom OpenID Connect (OIDC) provider. When choosing CUSTOM_OIDC type, use the CustomFederationProviderUrl parameter to provide the custom OIDC provider URL.  
     */
    ExternalLoginFederationProviderType?: String;
    /**
     * The URL of the custom OpenID Connect (OIDC) provider that provides identity to let a user federate into Amazon QuickSight with an associated Identity and Access Management(IAM) role. This parameter should only be used when ExternalLoginFederationProviderType parameter is set to CUSTOM_OIDC.
     */
    CustomFederationProviderUrl?: String;
    /**
     * The identity ID for a user in the external login provider.
     */
    ExternalLoginId?: String;
  }
  export interface RegisterUserResponse {
    /**
     * The user's user name.
     */
    User?: User;
    /**
     * The URL the user visits to complete registration and provide a password. This is returned only for users with an identity type of QUICKSIGHT.
     */
    UserInvitationUrl?: String;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface RegisteredUserDashboardEmbeddingConfiguration {
    /**
     * The dashboard ID for the dashboard that you want the user to see first. This ID is included in the output URL. When the URL in response is accessed, Amazon QuickSight renders this dashboard if the user has permissions to view it. If the user does not have permission to view this dashboard, they see a permissions error message.
     */
    InitialDashboardId: RestrictiveResourceId;
  }
  export interface RegisteredUserEmbeddingExperienceConfiguration {
    /**
     * The configuration details for providing a dashboard embedding experience.
     */
    Dashboard?: RegisteredUserDashboardEmbeddingConfiguration;
    /**
     * The configuration details for providing an Amazon QuickSight console embedding experience. This can be used along with custom permissions to restrict access to certain features. For more information, see Customizing Access to the Amazon QuickSight Console in the Amazon QuickSight User Guide. Use GenerateEmbedUrlForRegisteredUser where you want to provide an authoring portal that allows users to create data sources, datasets, analyses, and dashboards. The users who accesses an embedded Amazon QuickSight console needs to belong to the author or admin security cohort. If you want to restrict permissions to some of these features, add a custom permissions profile to the user with the  UpdateUser  API operation. Use  RegisterUser  API operation to add a new user with a custom permission profile attached. For more information, see the following sections in the Amazon QuickSight User Guide:    Embedding the Full Functionality of the Amazon QuickSight Console for Authenticated Users     Customizing Access to the Amazon QuickSight Console    For more information about the high-level steps for embedding and for an interactive demo of the ways you can customize embedding, visit the Amazon QuickSight Developer Portal.
     */
    QuickSightConsole?: RegisteredUserQuickSightConsoleEmbeddingConfiguration;
    /**
     * The configuration details for embedding the Q search bar. For more information about embedding the Q search bar, see Embedding Overview.
     */
    QSearchBar?: RegisteredUserQSearchBarEmbeddingConfiguration;
  }
  export interface RegisteredUserQSearchBarEmbeddingConfiguration {
    /**
     * The ID of the Q topic that you want to make the starting topic in the Q search bar. You can find a topic ID by navigating to the Topics pane in the Amazon QuickSight application and opening a topic. The ID is in the URL for the topic that you open. If you don't specify an initial topic, a list of all shared topics is shown in the Q bar for your readers. When you select an initial topic, you can specify whether or not readers are allowed to select other topics from the available ones in the list.
     */
    InitialTopicId?: RestrictiveResourceId;
  }
  export interface RegisteredUserQuickSightConsoleEmbeddingConfiguration {
    /**
     * The initial URL path for the Amazon QuickSight console. InitialPath is required. The entry point URL is constrained to the following paths:    /start     /start/analyses     /start/dashboards     /start/favorites     /dashboards/DashboardId. DashboardId is the actual ID key from the Amazon QuickSight console URL of the dashboard.    /analyses/AnalysisId. AnalysisId is the actual ID key from the Amazon QuickSight console URL of the analysis.  
     */
    InitialPath?: EntryPath;
  }
  export interface RelationalTable {
    /**
     * The Amazon Resource Name (ARN) for the data source.
     */
    DataSourceArn: Arn;
    /**
     * The catalog associated with a table.
     */
    Catalog?: RelationalTableCatalog;
    /**
     * The schema name. This name applies to certain relational database engines.
     */
    Schema?: RelationalTableSchema;
    /**
     * The name of the relational table.
     */
    Name: RelationalTableName;
    /**
     * The column schema of the table.
     */
    InputColumns: InputColumnList;
  }
  export type RelationalTableCatalog = string;
  export type RelationalTableName = string;
  export type RelationalTableSchema = string;
  export interface RenameColumnOperation {
    /**
     * The name of the column to be renamed.
     */
    ColumnName: ColumnName;
    /**
     * The new name for the column.
     */
    NewColumnName: ColumnName;
  }
  export type ResourceId = string;
  export type ResourceName = string;
  export interface ResourcePermission {
    /**
     * The Amazon Resource Name (ARN) of the principal. This can be one of the following:   The ARN of an Amazon QuickSight user or group associated with a data source or dataset. (This is common.)   The ARN of an Amazon QuickSight user, group, or namespace associated with an analysis, dashboard, template, or theme. (This is common.)   The ARN of an Amazon Web Services account root: This is an IAMARN rather than a Amazon QuickSight ARN. Use this option only to share resources (templates) across Amazon Web Services accounts. (This is less common.)   
     */
    Principal: Principal;
    /**
     * The IAMaction to grant or revoke permissions on.
     */
    Actions: ActionList;
  }
  export type ResourcePermissionList = ResourcePermission[];
  export type ResourceStatus = "CREATION_IN_PROGRESS"|"CREATION_SUCCESSFUL"|"CREATION_FAILED"|"UPDATE_IN_PROGRESS"|"UPDATE_SUCCESSFUL"|"UPDATE_FAILED"|"DELETED"|string;
  export interface RestoreAnalysisRequest {
    /**
     * The ID of the Amazon Web Services account that contains the analysis.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the analysis that you're restoring.
     */
    AnalysisId: RestrictiveResourceId;
  }
  export interface RestoreAnalysisResponse {
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Resource Name (ARN) of the analysis that you're restoring.
     */
    Arn?: Arn;
    /**
     * The ID of the analysis that you're restoring. 
     */
    AnalysisId?: RestrictiveResourceId;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export type RestrictiveResourceId = string;
  export type RoleName = string;
  export type RoleSessionName = string;
  export interface RowInfo {
    /**
     * The number of rows that were ingested.
     */
    RowsIngested?: Long;
    /**
     * The number of rows that were not ingested.
     */
    RowsDropped?: Long;
    /**
     * The total number of rows in the dataset.
     */
    TotalRowsInDataset?: Long;
  }
  export interface RowLevelPermissionDataSet {
    /**
     * The namespace associated with the dataset that contains permissions for RLS.
     */
    Namespace?: Namespace;
    /**
     * The Amazon Resource Name (ARN) of the dataset that contains permissions for RLS.
     */
    Arn: Arn;
    /**
     * The type of permissions to use when interpreting the permissions for RLS. DENY_ACCESS is included for backward compatibility only.
     */
    PermissionPolicy: RowLevelPermissionPolicy;
    /**
     * The user or group rules associated with the dataset that contains permissions for RLS. By default, FormatVersion is VERSION_1. When FormatVersion is VERSION_1, UserName and GroupName are required. When FormatVersion is VERSION_2, UserARN and GroupARN are required, and Namespace must not exist.
     */
    FormatVersion?: RowLevelPermissionFormatVersion;
    /**
     * The status of the row-level security permission dataset. If enabled, the status is ENABLED. If disabled, the status is DISABLED.
     */
    Status?: Status;
  }
  export type RowLevelPermissionFormatVersion = "VERSION_1"|"VERSION_2"|string;
  export type RowLevelPermissionPolicy = "GRANT_ACCESS"|"DENY_ACCESS"|string;
  export interface RowLevelPermissionTagConfiguration {
    /**
     * The status of row-level security tags. If enabled, the status is ENABLED. If disabled, the status is DISABLED.
     */
    Status?: Status;
    /**
     * A set of rules associated with row-level security, such as the tag names and columns that they are assigned to.
     */
    TagRules: RowLevelPermissionTagRuleList;
  }
  export type RowLevelPermissionTagDelimiter = string;
  export interface RowLevelPermissionTagRule {
    /**
     * The unique key for a tag.
     */
    TagKey: SessionTagKey;
    /**
     * The column name that a tag key is assigned to.
     */
    ColumnName: String;
    /**
     * A string that you want to use to delimit the values when you pass the values at run time. For example, you can delimit the values with a comma.
     */
    TagMultiValueDelimiter?: RowLevelPermissionTagDelimiter;
    /**
     * A string that you want to use to filter by all the values in a column in the dataset and don’t want to list the values one by one. For example, you can use an asterisk as your match all value.
     */
    MatchAllValue?: SessionTagValue;
  }
  export type RowLevelPermissionTagRuleList = RowLevelPermissionTagRule[];
  export type S3Bucket = string;
  export type S3Key = string;
  export interface S3Parameters {
    /**
     * Location of the Amazon S3 manifest file. This is NULL if the manifest file was uploaded into Amazon QuickSight.
     */
    ManifestFileLocation: ManifestFileLocation;
  }
  export interface S3Source {
    /**
     * The Amazon Resource Name (ARN) for the data source.
     */
    DataSourceArn: Arn;
    /**
     * Information about the format for the S3 source file or files.
     */
    UploadSettings?: UploadSettings;
    /**
     * A physical table type for an S3 data source.  For files that aren't JSON, only STRING data types are supported in input columns. 
     */
    InputColumns: InputColumnList;
  }
  export interface SearchAnalysesRequest {
    /**
     * The ID of the Amazon Web Services account that contains the analyses that you're searching for.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The structure for the search filters that you want to apply to your search. 
     */
    Filters: AnalysisSearchFilterList;
    /**
     * A pagination token that can be used in a subsequent request.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
  }
  export interface SearchAnalysesResponse {
    /**
     * Metadata describing the analyses that you searched for.
     */
    AnalysisSummaryList?: AnalysisSummaryList;
    /**
     * A pagination token that can be used in a subsequent request. 
     */
    NextToken?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface SearchDashboardsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the user whose dashboards you're searching for. 
     */
    AwsAccountId: AwsAccountId;
    /**
     * The filters to apply to the search. Currently, you can search only by user name, for example, "Filters": [ { "Name": "QUICKSIGHT_USER", "Operator": "StringEquals", "Value": "arn:aws:quicksight:us-east-1:1:user/default/UserName1" } ] 
     */
    Filters: DashboardSearchFilterList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface SearchDashboardsResponse {
    /**
     * The list of dashboards owned by the user specified in Filters in your request.
     */
    DashboardSummaryList?: DashboardSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface SearchFoldersRequest {
    /**
     * The AWS account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The filters to apply to the search. Currently, you can search only by the parent folder ARN. For example, "Filters": [ { "Name": "PARENT_FOLDER_ARN", "Operator": "StringEquals", "Value": "arn:aws:quicksight:us-east-1:1:folder/folderId" } ].
     */
    Filters: FolderSearchFilterList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: MaxResults;
  }
  export interface SearchFoldersResponse {
    /**
     * The status. If succeeded, the status is SC_OK.
     */
    Status?: StatusCode;
    /**
     * A structure that contains all of the folders in your AWS account. This structure provides basic information about the folders.
     */
    FolderSummaryList?: FolderSummaryList;
    /**
     * The token for the next set of results, or null if there are no more results.
     */
    NextToken?: String;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface ServiceNowParameters {
    /**
     * URL of the base site.
     */
    SiteBaseUrl: SiteBaseUrl;
  }
  export type SessionLifetimeInMinutes = number;
  export interface SessionTag {
    /**
     * The key for the tag.
     */
    Key: SessionTagKey;
    /**
     * The value that you want to assign the tag.
     */
    Value: SessionTagValue;
  }
  export type SessionTagKey = string;
  export type SessionTagList = SessionTag[];
  export type SessionTagValue = string;
  export interface Sheet {
    /**
     * The unique identifier associated with a sheet.
     */
    SheetId?: RestrictiveResourceId;
    /**
     * The name of a sheet. This name is displayed on the sheet's tab in the Amazon QuickSight console.
     */
    Name?: NonEmptyString;
  }
  export interface SheetControlsOption {
    /**
     * Visibility state.
     */
    VisibilityState?: DashboardUIState;
  }
  export type SheetList = Sheet[];
  export interface SheetStyle {
    /**
     * The display options for tiles.
     */
    Tile?: TileStyle;
    /**
     * The layout options for tiles.
     */
    TileLayout?: TileLayoutStyle;
  }
  export type SiteBaseUrl = string;
  export interface SnowflakeParameters {
    /**
     * Host.
     */
    Host: Host;
    /**
     * Database.
     */
    Database: Database;
    /**
     * Warehouse.
     */
    Warehouse: Warehouse;
  }
  export interface SparkParameters {
    /**
     * Host.
     */
    Host: Host;
    /**
     * Port.
     */
    Port: Port;
  }
  export type SqlQuery = string;
  export interface SqlServerParameters {
    /**
     * Host.
     */
    Host: Host;
    /**
     * Port.
     */
    Port: Port;
    /**
     * Database.
     */
    Database: Database;
  }
  export interface SslProperties {
    /**
     * A Boolean option to control whether SSL should be disabled.
     */
    DisableSsl?: Boolean;
  }
  export type Status = "ENABLED"|"DISABLED"|string;
  export type StatusCode = number;
  export type String = string;
  export type StringList = String[];
  export interface StringParameter {
    /**
     * A display name for a string parameter.
     */
    Name: NonEmptyString;
    /**
     * The values of a string parameter.
     */
    Values: StringList;
  }
  export type StringParameterList = StringParameter[];
  export interface Tag {
    /**
     * Tag key.
     */
    Key: TagKey;
    /**
     * Tag value.
     */
    Value: TagValue;
  }
  export interface TagColumnOperation {
    /**
     * The column that this operation acts on.
     */
    ColumnName: ColumnName;
    /**
     * The dataset column tag, currently only used for geospatial type tagging.  This is not tags for the Amazon Web Services tagging feature. 
     */
    Tags: ColumnTagList;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to tag.
     */
    ResourceArn: Arn;
    /**
     * Contains a map of the key-value pairs for the resource tag or tags assigned to the resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export type TagValue = string;
  export interface Template {
    /**
     * The Amazon Resource Name (ARN) of the template.
     */
    Arn?: Arn;
    /**
     * The display name of the template.
     */
    Name?: TemplateName;
    /**
     * A structure describing the versions of the template.
     */
    Version?: TemplateVersion;
    /**
     * The ID for the template. This is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    TemplateId?: RestrictiveResourceId;
    /**
     * Time when this was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * Time when this was created.
     */
    CreatedTime?: Timestamp;
  }
  export interface TemplateAlias {
    /**
     * The display name of the template alias.
     */
    AliasName?: AliasName;
    /**
     * The Amazon Resource Name (ARN) of the template alias.
     */
    Arn?: Arn;
    /**
     * The version number of the template alias.
     */
    TemplateVersionNumber?: VersionNumber;
  }
  export type TemplateAliasList = TemplateAlias[];
  export interface TemplateError {
    /**
     * Type of error.
     */
    Type?: TemplateErrorType;
    /**
     * Description of the error type.
     */
    Message?: NonEmptyString;
  }
  export type TemplateErrorList = TemplateError[];
  export type TemplateErrorType = "SOURCE_NOT_FOUND"|"DATA_SET_NOT_FOUND"|"INTERNAL_FAILURE"|"ACCESS_DENIED"|string;
  export type TemplateName = string;
  export interface TemplateSourceAnalysis {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn: Arn;
    /**
     * A structure containing information about the dataset references used as placeholders in the template.
     */
    DataSetReferences: DataSetReferenceList;
  }
  export interface TemplateSourceEntity {
    /**
     * The source analysis, if it is based on an analysis.
     */
    SourceAnalysis?: TemplateSourceAnalysis;
    /**
     * The source template, if it is based on an template.
     */
    SourceTemplate?: TemplateSourceTemplate;
  }
  export interface TemplateSourceTemplate {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn: Arn;
  }
  export interface TemplateSummary {
    /**
     * A summary of a template.
     */
    Arn?: Arn;
    /**
     * The ID of the template. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    TemplateId?: RestrictiveResourceId;
    /**
     * A display name for the template.
     */
    Name?: TemplateName;
    /**
     * A structure containing a list of version numbers for the template summary.
     */
    LatestVersionNumber?: VersionNumber;
    /**
     * The last time that this template was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The last time that this template was updated.
     */
    LastUpdatedTime?: Timestamp;
  }
  export type TemplateSummaryList = TemplateSummary[];
  export interface TemplateVersion {
    /**
     * The time that this template version was created.
     */
    CreatedTime?: Timestamp;
    /**
     * Errors associated with this template version.
     */
    Errors?: TemplateErrorList;
    /**
     * The version number of the template version.
     */
    VersionNumber?: VersionNumber;
    /**
     * The HTTP status of the request.
     */
    Status?: ResourceStatus;
    /**
     * Schema of the dataset identified by the placeholder. Any dashboard created from this template should be bound to new datasets matching the same schema described through this API operation.
     */
    DataSetConfigurations?: DataSetConfigurationList;
    /**
     * The description of the template.
     */
    Description?: VersionDescription;
    /**
     * The Amazon Resource Name (ARN) of an analysis or template that was used to create this template.
     */
    SourceEntityArn?: Arn;
    /**
     * The ARN of the theme associated with this version of the template.
     */
    ThemeArn?: Arn;
    /**
     * A list of the associated sheets with the unique identifier and name of each sheet.
     */
    Sheets?: SheetList;
  }
  export interface TemplateVersionSummary {
    /**
     * The Amazon Resource Name (ARN) of the template version.
     */
    Arn?: Arn;
    /**
     * The version number of the template version.
     */
    VersionNumber?: VersionNumber;
    /**
     * The time that this template version was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The status of the template version.
     */
    Status?: ResourceStatus;
    /**
     * The description of the template version.
     */
    Description?: VersionDescription;
  }
  export type TemplateVersionSummaryList = TemplateVersionSummary[];
  export interface TeradataParameters {
    /**
     * Host.
     */
    Host: Host;
    /**
     * Port.
     */
    Port: Port;
    /**
     * Database.
     */
    Database: Database;
  }
  export type TextQualifier = "DOUBLE_QUOTE"|"SINGLE_QUOTE"|string;
  export interface Theme {
    /**
     * The Amazon Resource Name (ARN) of the theme.
     */
    Arn?: Arn;
    /**
     * The name that the user gives to the theme.
     */
    Name?: ThemeName;
    /**
     * The identifier that the user gives to the theme.
     */
    ThemeId?: RestrictiveResourceId;
    Version?: ThemeVersion;
    /**
     * The date and time that the theme was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The date and time that the theme was last updated.
     */
    LastUpdatedTime?: Timestamp;
    /**
     * The type of theme, based on how it was created. Valid values include: QUICKSIGHT and CUSTOM.
     */
    Type?: ThemeType;
  }
  export interface ThemeAlias {
    /**
     * The Amazon Resource Name (ARN) of the theme alias.
     */
    Arn?: Arn;
    /**
     * The display name of the theme alias.
     */
    AliasName?: AliasName;
    /**
     * The version number of the theme alias.
     */
    ThemeVersionNumber?: VersionNumber;
  }
  export type ThemeAliasList = ThemeAlias[];
  export interface ThemeConfiguration {
    /**
     * Color properties that apply to chart data colors.
     */
    DataColorPalette?: DataColorPalette;
    /**
     * Color properties that apply to the UI and to charts, excluding the colors that apply to data. 
     */
    UIColorPalette?: UIColorPalette;
    /**
     * Display options related to sheets.
     */
    Sheet?: SheetStyle;
  }
  export interface ThemeError {
    /**
     * The type of error.
     */
    Type?: ThemeErrorType;
    /**
     * The error message.
     */
    Message?: NonEmptyString;
  }
  export type ThemeErrorList = ThemeError[];
  export type ThemeErrorType = "INTERNAL_FAILURE"|string;
  export type ThemeName = string;
  export interface ThemeSummary {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: Arn;
    /**
     * the display name for the theme.
     */
    Name?: ThemeName;
    /**
     * The ID of the theme. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    ThemeId?: RestrictiveResourceId;
    /**
     * The latest version number for the theme. 
     */
    LatestVersionNumber?: VersionNumber;
    /**
     * The date and time that this theme was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The last date and time that this theme was updated.
     */
    LastUpdatedTime?: Timestamp;
  }
  export type ThemeSummaryList = ThemeSummary[];
  export type ThemeType = "QUICKSIGHT"|"CUSTOM"|"ALL"|string;
  export interface ThemeVersion {
    /**
     * The version number of the theme.
     */
    VersionNumber?: VersionNumber;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: Arn;
    /**
     * The description of the theme.
     */
    Description?: VersionDescription;
    /**
     * The Amazon QuickSight-defined ID of the theme that a custom theme inherits from. All themes initially inherit from a default Amazon QuickSight theme.
     */
    BaseThemeId?: RestrictiveResourceId;
    /**
     * The date and time that this theme version was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The theme configuration, which contains all the theme display properties.
     */
    Configuration?: ThemeConfiguration;
    /**
     * Errors associated with the theme.
     */
    Errors?: ThemeErrorList;
    /**
     * The status of the theme version.
     */
    Status?: ResourceStatus;
  }
  export interface ThemeVersionSummary {
    /**
     * The version number of the theme version.
     */
    VersionNumber?: VersionNumber;
    /**
     * The Amazon Resource Name (ARN) of the theme version.
     */
    Arn?: Arn;
    /**
     * The description of the theme version.
     */
    Description?: VersionDescription;
    /**
     * The date and time that this theme version was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The status of the theme version.
     */
    Status?: ResourceStatus;
  }
  export type ThemeVersionSummaryList = ThemeVersionSummary[];
  export interface TileLayoutStyle {
    /**
     * The gutter settings that apply between tiles. 
     */
    Gutter?: GutterStyle;
    /**
     * The margin settings that apply around the outside edge of sheets.
     */
    Margin?: MarginStyle;
  }
  export interface TileStyle {
    /**
     * The border around a tile.
     */
    Border?: BorderStyle;
  }
  export type Timestamp = Date;
  export type TimestampList = Timestamp[];
  export interface TransformOperation {
    /**
     * An operation that projects columns. Operations that come after a projection can only refer to projected columns.
     */
    ProjectOperation?: ProjectOperation;
    /**
     * An operation that filters rows based on some condition.
     */
    FilterOperation?: FilterOperation;
    /**
     * An operation that creates calculated columns. Columns created in one such operation form a lexical closure.
     */
    CreateColumnsOperation?: CreateColumnsOperation;
    /**
     * An operation that renames a column.
     */
    RenameColumnOperation?: RenameColumnOperation;
    /**
     * A transform operation that casts a column to a different type.
     */
    CastColumnTypeOperation?: CastColumnTypeOperation;
    /**
     * An operation that tags a column with additional information.
     */
    TagColumnOperation?: TagColumnOperation;
    UntagColumnOperation?: UntagColumnOperation;
  }
  export type TransformOperationList = TransformOperation[];
  export interface TwitterParameters {
    /**
     * Twitter query string.
     */
    Query: Query;
    /**
     * Maximum number of rows to query Twitter.
     */
    MaxRows: PositiveInteger;
  }
  export type TypeCastFormat = string;
  export interface UIColorPalette {
    /**
     * The color of text and other foreground elements that appear over the primary background regions, such as grid lines, borders, table banding, icons, and so on.
     */
    PrimaryForeground?: HexColor;
    /**
     * The background color that applies to visuals and other high emphasis UI.
     */
    PrimaryBackground?: HexColor;
    /**
     * The foreground color that applies to any sheet title, sheet control text, or UI that appears over the secondary background.
     */
    SecondaryForeground?: HexColor;
    /**
     * The background color that applies to the sheet background and sheet controls.
     */
    SecondaryBackground?: HexColor;
    /**
     * This color is that applies to selected states and buttons.
     */
    Accent?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the accent color.
     */
    AccentForeground?: HexColor;
    /**
     * The color that applies to error messages.
     */
    Danger?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the error color.
     */
    DangerForeground?: HexColor;
    /**
     * This color that applies to warning and informational messages.
     */
    Warning?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the warning color.
     */
    WarningForeground?: HexColor;
    /**
     * The color that applies to success messages, for example the check mark for a successful download.
     */
    Success?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the success color.
     */
    SuccessForeground?: HexColor;
    /**
     * The color that applies to the names of fields that are identified as dimensions.
     */
    Dimension?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the dimension color.
     */
    DimensionForeground?: HexColor;
    /**
     * The color that applies to the names of fields that are identified as measures.
     */
    Measure?: HexColor;
    /**
     * The foreground color that applies to any text or other elements that appear over the measure color.
     */
    MeasureForeground?: HexColor;
  }
  export interface UntagColumnOperation {
    /**
     * The column that this operation acts on.
     */
    ColumnName: ColumnName;
    /**
     * The column tags to remove from this column.
     */
    TagNames: ColumnTagNames;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to untag.
     */
    ResourceArn: Arn;
    /**
     * The keys of the key-value pairs for the resource tag or tags assigned to the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateAccountCustomizationRequest {
    /**
     * The ID for the Amazon Web Services account that you want to update Amazon QuickSight customizations for.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace that you want to update Amazon QuickSight customizations for.
     */
    Namespace?: Namespace;
    /**
     * The Amazon QuickSight customizations you're updating in the current Amazon Web Services Region. 
     */
    AccountCustomization: AccountCustomization;
  }
  export interface UpdateAccountCustomizationResponse {
    /**
     * The Amazon Resource Name (ARN) for the updated customization for this Amazon Web Services account.
     */
    Arn?: Arn;
    /**
     * The ID for the Amazon Web Services account that you want to update Amazon QuickSight customizations for.
     */
    AwsAccountId?: AwsAccountId;
    /**
     * The namespace associated with the customization that you're updating.
     */
    Namespace?: Namespace;
    /**
     * The Amazon QuickSight customizations you're updating in the current Amazon Web Services Region. 
     */
    AccountCustomization?: AccountCustomization;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateAccountSettingsRequest {
    /**
     * The ID for the Amazon Web Services account that contains the Amazon QuickSight settings that you want to list.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The default namespace for this Amazon Web Services account. Currently, the default is default. Identity and Access Management (IAM) users that register for the first time with Amazon QuickSight provide an email that becomes associated with the default namespace.
     */
    DefaultNamespace: Namespace;
    /**
     * The email address that you want Amazon QuickSight to send notifications to regarding your Amazon Web Services account or Amazon QuickSight subscription.
     */
    NotificationEmail?: String;
  }
  export interface UpdateAccountSettingsResponse {
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateAnalysisPermissionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the analysis whose permissions you're updating. You must be using the Amazon Web Services account that the analysis is in.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the analysis whose permissions you're updating. The ID is part of the analysis URL.
     */
    AnalysisId: RestrictiveResourceId;
    /**
     * A structure that describes the permissions to add and the principal to add them to.
     */
    GrantPermissions?: UpdateResourcePermissionList;
    /**
     * A structure that describes the permissions to remove and the principal to remove them from.
     */
    RevokePermissions?: UpdateResourcePermissionList;
  }
  export interface UpdateAnalysisPermissionsResponse {
    /**
     * The Amazon Resource Name (ARN) of the analysis that you updated.
     */
    AnalysisArn?: Arn;
    /**
     * The ID of the analysis that you updated permissions for.
     */
    AnalysisId?: RestrictiveResourceId;
    /**
     * A structure that describes the principals and the resource-level permissions on an analysis.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateAnalysisRequest {
    /**
     * The ID of the Amazon Web Services account that contains the analysis that you're updating.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the analysis that you're updating. This ID displays in the URL of the analysis.
     */
    AnalysisId: RestrictiveResourceId;
    /**
     * A descriptive name for the analysis that you're updating. This name displays for the analysis in the Amazon QuickSight console.
     */
    Name: AnalysisName;
    /**
     * The parameter names and override values that you want to use. An analysis can have any parameter type, and some parameters might accept multiple values. 
     */
    Parameters?: Parameters;
    /**
     * A source entity to use for the analysis that you're updating. This metadata structure contains details that describe a source template and one or more datasets.
     */
    SourceEntity: AnalysisSourceEntity;
    /**
     * The Amazon Resource Name (ARN) for the theme to apply to the analysis that you're creating. To see the theme in the Amazon QuickSight console, make sure that you have access to it.
     */
    ThemeArn?: Arn;
  }
  export interface UpdateAnalysisResponse {
    /**
     * The ARN of the analysis that you're updating.
     */
    Arn?: Arn;
    /**
     * The ID of the analysis.
     */
    AnalysisId?: RestrictiveResourceId;
    /**
     * The update status of the last update that was made to the analysis.
     */
    UpdateStatus?: ResourceStatus;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface UpdateDashboardPermissionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the dashboard whose permissions you're updating.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dashboard.
     */
    DashboardId: RestrictiveResourceId;
    /**
     * The permissions that you want to grant on this resource.
     */
    GrantPermissions?: UpdateResourcePermissionList;
    /**
     * The permissions that you want to revoke from this resource.
     */
    RevokePermissions?: UpdateResourcePermissionList;
  }
  export interface UpdateDashboardPermissionsResponse {
    /**
     * The Amazon Resource Name (ARN) of the dashboard.
     */
    DashboardArn?: Arn;
    /**
     * The ID for the dashboard.
     */
    DashboardId?: RestrictiveResourceId;
    /**
     * Information about the permissions on the dashboard.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateDashboardPublishedVersionRequest {
    /**
     * The ID of the Amazon Web Services account that contains the dashboard that you're updating.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dashboard.
     */
    DashboardId: RestrictiveResourceId;
    /**
     * The version number of the dashboard.
     */
    VersionNumber: VersionNumber;
  }
  export interface UpdateDashboardPublishedVersionResponse {
    /**
     * The ID for the dashboard.
     */
    DashboardId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the dashboard.
     */
    DashboardArn?: Arn;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface UpdateDashboardRequest {
    /**
     * The ID of the Amazon Web Services account that contains the dashboard that you're updating.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dashboard.
     */
    DashboardId: RestrictiveResourceId;
    /**
     * The display name of the dashboard.
     */
    Name: DashboardName;
    /**
     * The entity that you are using as a source when you update the dashboard. In SourceEntity, you specify the type of object you're using as source. You can only update a dashboard from a template, so you use a SourceTemplate entity. If you need to update a dashboard from an analysis, first convert the analysis to a template by using the CreateTemplate API operation. For SourceTemplate, specify the Amazon Resource Name (ARN) of the source template. The SourceTemplate ARN can contain any Amazon Web Services account and any Amazon QuickSight-supported Amazon Web Services Region.  Use the DataSetReferences entity within SourceTemplate to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder. 
     */
    SourceEntity: DashboardSourceEntity;
    /**
     * A structure that contains the parameters of the dashboard. These are parameter overrides for a dashboard. A dashboard can have any type of parameters, and some parameters might accept multiple values.
     */
    Parameters?: Parameters;
    /**
     * A description for the first version of the dashboard being created.
     */
    VersionDescription?: VersionDescription;
    /**
     * Options for publishing the dashboard when you create it:    AvailabilityStatus for AdHocFilteringOption - This status can be either ENABLED or DISABLED. When this is set to DISABLED, Amazon QuickSight disables the left filter pane on the published dashboard, which can be used for ad hoc (one-time) filtering. This option is ENABLED by default.     AvailabilityStatus for ExportToCSVOption - This status can be either ENABLED or DISABLED. The visual option to export data to .CSV format isn't enabled when this is set to DISABLED. This option is ENABLED by default.     VisibilityState for SheetControlsOption - This visibility state can be either COLLAPSED or EXPANDED. This option is COLLAPSED by default.   
     */
    DashboardPublishOptions?: DashboardPublishOptions;
    /**
     * The Amazon Resource Name (ARN) of the theme that is being used for this dashboard. If you add a value for this field, it overrides the value that was originally associated with the entity. The theme ARN must exist in the same Amazon Web Services account where you create the dashboard.
     */
    ThemeArn?: Arn;
  }
  export interface UpdateDashboardResponse {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    Arn?: Arn;
    /**
     * The ARN of the dashboard, including the version number.
     */
    VersionArn?: Arn;
    /**
     * The ID for the dashboard.
     */
    DashboardId?: RestrictiveResourceId;
    /**
     * The creation status of the request.
     */
    CreationStatus?: ResourceStatus;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface UpdateDataSetPermissionsRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dataset whose permissions you want to update. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId: ResourceId;
    /**
     * The resource permissions that you want to grant to the dataset.
     */
    GrantPermissions?: ResourcePermissionList;
    /**
     * The resource permissions that you want to revoke from the dataset.
     */
    RevokePermissions?: ResourcePermissionList;
  }
  export interface UpdateDataSetPermissionsResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    DataSetArn?: Arn;
    /**
     * The ID for the dataset whose permissions you want to update. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId?: ResourceId;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateDataSetRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the dataset that you want to update. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId: ResourceId;
    /**
     * The display name for the dataset.
     */
    Name: ResourceName;
    /**
     * Declares the physical tables that are available in the underlying data sources.
     */
    PhysicalTableMap: PhysicalTableMap;
    /**
     * Configures the combination and transformation of the data from the physical tables.
     */
    LogicalTableMap?: LogicalTableMap;
    /**
     * Indicates whether you want to import the data into SPICE.
     */
    ImportMode: DataSetImportMode;
    /**
     * Groupings of columns that work together in certain Amazon QuickSight features. Currently, only geospatial hierarchy is supported.
     */
    ColumnGroups?: ColumnGroupList;
    /**
     * The folder that contains fields and nested subfolders for your dataset.
     */
    FieldFolders?: FieldFolderMap;
    /**
     * The row-level security configuration for the data you want to create.
     */
    RowLevelPermissionDataSet?: RowLevelPermissionDataSet;
    /**
     * The configuration of tags on a dataset to set row-level security. Row-level security tags are currently supported for anonymous embedding only.
     */
    RowLevelPermissionTagConfiguration?: RowLevelPermissionTagConfiguration;
    /**
     * A set of one or more definitions of a  ColumnLevelPermissionRule .
     */
    ColumnLevelPermissionRules?: ColumnLevelPermissionRuleList;
    DataSetUsageConfiguration?: DataSetUsageConfiguration;
  }
  export interface UpdateDataSetResponse {
    /**
     * The Amazon Resource Name (ARN) of the dataset.
     */
    Arn?: Arn;
    /**
     * The ID for the dataset that you want to create. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSetId?: ResourceId;
    /**
     * The ARN for the ingestion, which is triggered as a result of dataset creation if the import mode is SPICE.
     */
    IngestionArn?: Arn;
    /**
     * The ID of the ingestion, which is triggered as a result of dataset creation if the import mode is SPICE.
     */
    IngestionId?: ResourceId;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateDataSourcePermissionsRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account. 
     */
    DataSourceId: ResourceId;
    /**
     * A list of resource permissions that you want to grant on the data source.
     */
    GrantPermissions?: ResourcePermissionList;
    /**
     * A list of resource permissions that you want to revoke on the data source.
     */
    RevokePermissions?: ResourcePermissionList;
  }
  export interface UpdateDataSourcePermissionsResponse {
    /**
     * The Amazon Resource Name (ARN) of the data source.
     */
    DataSourceArn?: Arn;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSourceId?: ResourceId;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateDataSourceRequest {
    /**
     * The Amazon Web Services account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account. 
     */
    DataSourceId: ResourceId;
    /**
     * A display name for the data source.
     */
    Name: ResourceName;
    /**
     * The parameters that Amazon QuickSight uses to connect to your underlying source.
     */
    DataSourceParameters?: DataSourceParameters;
    /**
     * The credentials that Amazon QuickSight that uses to connect to your underlying source. Currently, only credentials based on user name and password are supported.
     */
    Credentials?: DataSourceCredentials;
    /**
     * Use this parameter only when you want Amazon QuickSight to use a VPC connection when connecting to your underlying source.
     */
    VpcConnectionProperties?: VpcConnectionProperties;
    /**
     * Secure Socket Layer (SSL) properties that apply when Amazon QuickSight connects to your underlying source.
     */
    SslProperties?: SslProperties;
  }
  export interface UpdateDataSourceResponse {
    /**
     * The Amazon Resource Name (ARN) of the data source.
     */
    Arn?: Arn;
    /**
     * The ID of the data source. This ID is unique per Amazon Web Services Region for each Amazon Web Services account.
     */
    DataSourceId?: ResourceId;
    /**
     * The update status of the data source's last update.
     */
    UpdateStatus?: ResourceStatus;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateFolderPermissionsRequest {
    /**
     * The AWS account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The folder ID.
     */
    FolderId: RestrictiveResourceId;
    /**
     * The permissions that you want to grant on a resource.
     */
    GrantPermissions?: ResourcePermissionList;
    /**
     * The permissions that you want to revoke from a resource.
     */
    RevokePermissions?: ResourcePermissionList;
  }
  export interface UpdateFolderPermissionsResponse {
    /**
     * The status. If succeeded, the status is SC_OK.
     */
    Status?: StatusCode;
    /**
     * The Amazon Resource Name (ARN).
     */
    Arn?: Arn;
    /**
     * The folder ID.
     */
    FolderId?: RestrictiveResourceId;
    /**
     * Information about the permissions on the dashboard.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface UpdateFolderRequest {
    /**
     * The AWS account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The folder ID.
     */
    FolderId: RestrictiveResourceId;
    /**
     * The name of the folder.
     */
    Name: FolderName;
  }
  export interface UpdateFolderResponse {
    /**
     * The status. If succeeded, the status is SC_OK.
     */
    Status?: StatusCode;
    /**
     * The Amazon Resource Name (ARN).
     */
    Arn?: Arn;
    /**
     * The folder ID.
     */
    FolderId?: RestrictiveResourceId;
    /**
     * The request ID.
     */
    RequestId?: String;
  }
  export interface UpdateGroupRequest {
    /**
     * The name of the group that you want to update.
     */
    GroupName: GroupName;
    /**
     * The description for the group that you want to update.
     */
    Description?: GroupDescription;
    /**
     * The ID for the Amazon Web Services account that the group is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
  }
  export interface UpdateGroupResponse {
    /**
     * The name of the group.
     */
    Group?: Group;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateIAMPolicyAssignmentRequest {
    /**
     * The ID of the Amazon Web Services account that contains the IAMpolicy assignment. 
     */
    AwsAccountId: AwsAccountId;
    /**
     * The name of the assignment, also called a rule. This name must be unique within an Amazon Web Services account.
     */
    AssignmentName: IAMPolicyAssignmentName;
    /**
     * The namespace of the assignment.
     */
    Namespace: Namespace;
    /**
     * The status of the assignment. Possible values are as follows:    ENABLED - Anything specified in this assignment is used when creating the data source.    DISABLED - This assignment isn't used when creating the data source.    DRAFT - This assignment is an unfinished draft and isn't used when creating the data source.  
     */
    AssignmentStatus?: AssignmentStatus;
    /**
     * The ARN for the IAMpolicy to apply to the Amazon QuickSight users and groups specified in this assignment.
     */
    PolicyArn?: Arn;
    /**
     * The Amazon QuickSight users, groups, or both that you want to assign the policy to.
     */
    Identities?: IdentityMap;
  }
  export interface UpdateIAMPolicyAssignmentResponse {
    /**
     * The name of the assignment or rule.
     */
    AssignmentName?: IAMPolicyAssignmentName;
    /**
     * The ID of the assignment.
     */
    AssignmentId?: String;
    /**
     * The ARN for the IAMpolicy applied to the Amazon QuickSight users and groups specified in this assignment.
     */
    PolicyArn?: Arn;
    /**
     * The Amazon QuickSight users, groups, or both that the IAMpolicy is assigned to.
     */
    Identities?: IdentityMap;
    /**
     * The status of the assignment. Possible values are as follows:    ENABLED - Anything specified in this assignment is used when creating the data source.    DISABLED - This assignment isn't used when creating the data source.    DRAFT - This assignment is an unfinished draft and isn't used when creating the data source.  
     */
    AssignmentStatus?: AssignmentStatus;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateIpRestrictionRequest {
    /**
     * Your AWS account ID.
     */
    AwsAccountId: AwsAccountId;
    /**
     * Describes updated IP rules.
     */
    IpRestrictionRuleMap?: IpRestrictionRuleMap;
    /**
     * Whether or not IP rules are enabled.
     */
    Enabled?: NullableBoolean;
  }
  export interface UpdateIpRestrictionResponse {
    /**
     * Your AWS account ID.
     */
    AwsAccountId?: AwsAccountId;
    /**
     * The ID of the update request.
     */
    RequestId?: String;
    /**
     * The status of the updated IP rules. A successful request returns a 200 code.
     */
    Status?: StatusCode;
  }
  export type UpdateResourcePermissionList = ResourcePermission[];
  export interface UpdateTemplateAliasRequest {
    /**
     * The ID of the Amazon Web Services account that contains the template alias that you're updating.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the template.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * The alias of the template that you want to update. If you name a specific alias, you update the version that the alias points to. You can specify the latest version of the template by providing the keyword $LATEST in the AliasName parameter. The keyword $PUBLISHED doesn't apply to templates.
     */
    AliasName: AliasName;
    /**
     * The version number of the template.
     */
    TemplateVersionNumber: VersionNumber;
  }
  export interface UpdateTemplateAliasResponse {
    /**
     * The template alias.
     */
    TemplateAlias?: TemplateAlias;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface UpdateTemplatePermissionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the template.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the template.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * A list of resource permissions to be granted on the template. 
     */
    GrantPermissions?: UpdateResourcePermissionList;
    /**
     * A list of resource permissions to be revoked from the template. 
     */
    RevokePermissions?: UpdateResourcePermissionList;
  }
  export interface UpdateTemplatePermissionsResponse {
    /**
     * The ID for the template.
     */
    TemplateId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the template.
     */
    TemplateArn?: Arn;
    /**
     * A list of resource permissions to be set on the template.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateTemplateRequest {
    /**
     * The ID of the Amazon Web Services account that contains the template that you're updating.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the template.
     */
    TemplateId: RestrictiveResourceId;
    /**
     * The entity that you are using as a source when you update the template. In SourceEntity, you specify the type of object you're using as source: SourceTemplate for a template or SourceAnalysis for an analysis. Both of these require an Amazon Resource Name (ARN). For SourceTemplate, specify the ARN of the source template. For SourceAnalysis, specify the ARN of the source analysis. The SourceTemplate ARN can contain any Amazon Web Services account and any Amazon QuickSight-supported Amazon Web Services Region;.  Use the DataSetReferences entity within SourceTemplate or SourceAnalysis to list the replacement datasets for the placeholders listed in the original. The schema in each dataset must match its placeholder. 
     */
    SourceEntity: TemplateSourceEntity;
    /**
     * A description of the current template version that is being updated. Every time you call UpdateTemplate, you create a new version of the template. Each version of the template maintains a description of the version in the VersionDescription field.
     */
    VersionDescription?: VersionDescription;
    /**
     * The name for the template.
     */
    Name?: TemplateName;
  }
  export interface UpdateTemplateResponse {
    /**
     * The ID for the template.
     */
    TemplateId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) for the template.
     */
    Arn?: Arn;
    /**
     * The ARN for the template, including the version information of the first version.
     */
    VersionArn?: Arn;
    /**
     * The creation status of the template.
     */
    CreationStatus?: ResourceStatus;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface UpdateThemeAliasRequest {
    /**
     * The ID of the Amazon Web Services account that contains the theme alias that you're updating.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the theme.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * The name of the theme alias that you want to update.
     */
    AliasName: AliasName;
    /**
     * The version number of the theme that the alias should reference.
     */
    ThemeVersionNumber: VersionNumber;
  }
  export interface UpdateThemeAliasResponse {
    /**
     * Information about the theme alias.
     */
    ThemeAlias?: ThemeAlias;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface UpdateThemePermissionsRequest {
    /**
     * The ID of the Amazon Web Services account that contains the theme.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the theme.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * A list of resource permissions to be granted for the theme.
     */
    GrantPermissions?: UpdateResourcePermissionList;
    /**
     * A list of resource permissions to be revoked from the theme.
     */
    RevokePermissions?: UpdateResourcePermissionList;
  }
  export interface UpdateThemePermissionsResponse {
    /**
     * The ID for the theme.
     */
    ThemeId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) of the theme.
     */
    ThemeArn?: Arn;
    /**
     * The resulting list of resource permissions for the theme.
     */
    Permissions?: ResourcePermissionList;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UpdateThemeRequest {
    /**
     * The ID of the Amazon Web Services account that contains the theme that you're updating.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The ID for the theme.
     */
    ThemeId: RestrictiveResourceId;
    /**
     * The name for the theme.
     */
    Name?: ThemeName;
    /**
     * The theme ID, defined by Amazon QuickSight, that a custom theme inherits from. All themes initially inherit from a default Amazon QuickSight theme.
     */
    BaseThemeId: RestrictiveResourceId;
    /**
     * A description of the theme version that you're updating Every time that you call UpdateTheme, you create a new version of the theme. Each version of the theme maintains a description of the version in VersionDescription.
     */
    VersionDescription?: VersionDescription;
    /**
     * The theme configuration, which contains the theme display properties.
     */
    Configuration?: ThemeConfiguration;
  }
  export interface UpdateThemeResponse {
    /**
     * The ID for the theme.
     */
    ThemeId?: RestrictiveResourceId;
    /**
     * The Amazon Resource Name (ARN) for the theme.
     */
    Arn?: Arn;
    /**
     * The Amazon Resource Name (ARN) for the new version of the theme.
     */
    VersionArn?: Arn;
    /**
     * The creation status of the theme.
     */
    CreationStatus?: ResourceStatus;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
  }
  export interface UpdateUserRequest {
    /**
     * The Amazon QuickSight user name that you want to update.
     */
    UserName: UserName;
    /**
     * The ID for the Amazon Web Services account that the user is in. Currently, you use the ID for the Amazon Web Services account that contains your Amazon QuickSight account.
     */
    AwsAccountId: AwsAccountId;
    /**
     * The namespace. Currently, you should set this to default.
     */
    Namespace: Namespace;
    /**
     * The email address of the user that you want to update.
     */
    Email: String;
    /**
     * The Amazon QuickSight role of the user. The role can be one of the following default security cohorts:    READER: A user who has read-only access to dashboards.    AUTHOR: A user who can create data sources, datasets, analyses, and dashboards.    ADMIN: A user who is an author, who can also manage Amazon QuickSight settings.   The name of the Amazon QuickSight role is invisible to the user except for the console screens dealing with permissions.
     */
    Role: UserRole;
    /**
     * (Enterprise edition only) The name of the custom permissions profile that you want to assign to this user. Customized permissions allows you to control a user's access by restricting access the following operations:   Create and update data sources   Create and update datasets   Create and update email reports   Subscribe to email reports   A set of custom permissions includes any combination of these restrictions. Currently, you need to create the profile names for custom permission sets by using the Amazon QuickSight console. Then, you use the RegisterUser API operation to assign the named set of permissions to a Amazon QuickSight user.  Amazon QuickSight custom permissions are applied through IAMpolicies. Therefore, they override the permissions typically granted by assigning Amazon QuickSight users to one of the default security cohorts in Amazon QuickSight (admin, author, reader). This feature is available only to Amazon QuickSight Enterprise edition subscriptions.
     */
    CustomPermissionsName?: RoleName;
    /**
     * A flag that you use to indicate that you want to remove all custom permissions from this user. Using this parameter resets the user to the state it was in before a custom permissions profile was applied. This parameter defaults to NULL and it doesn't accept any other value.
     */
    UnapplyCustomPermissions?: Boolean;
    /**
     * The type of supported external login provider that provides identity to let a user federate into Amazon QuickSight with an associated Identity and Access Management(IAM) role. The type of supported external login provider can be one of the following.    COGNITO: Amazon Cognito. The provider URL is cognito-identity.amazonaws.com. When choosing the COGNITO provider type, don’t use the "CustomFederationProviderUrl" parameter which is only needed when the external provider is custom.    CUSTOM_OIDC: Custom OpenID Connect (OIDC) provider. When choosing CUSTOM_OIDC type, use the CustomFederationProviderUrl parameter to provide the custom OIDC provider URL.    NONE: This clears all the previously saved external login information for a user. Use  DescribeUser  API to check the external login information.  
     */
    ExternalLoginFederationProviderType?: String;
    /**
     * The URL of the custom OpenID Connect (OIDC) provider that provides identity to let a user federate into Amazon QuickSight with an associated Identity and Access Management(IAM) role. This parameter should only be used when ExternalLoginFederationProviderType parameter is set to CUSTOM_OIDC.
     */
    CustomFederationProviderUrl?: String;
    /**
     * The identity ID for a user in the external login provider.
     */
    ExternalLoginId?: String;
  }
  export interface UpdateUserResponse {
    /**
     * The Amazon QuickSight user.
     */
    User?: User;
    /**
     * The Amazon Web Services request ID for this operation.
     */
    RequestId?: String;
    /**
     * The HTTP status of the request.
     */
    Status?: StatusCode;
  }
  export interface UploadSettings {
    /**
     * File format.
     */
    Format?: FileFormat;
    /**
     * A row number to start reading data from.
     */
    StartFromRow?: PositiveInteger;
    /**
     * Whether the file has a header row, or the files each have a header row.
     */
    ContainsHeader?: Boolean;
    /**
     * Text qualifier.
     */
    TextQualifier?: TextQualifier;
    /**
     * The delimiter between values in the file.
     */
    Delimiter?: Delimiter;
  }
  export interface User {
    /**
     * The Amazon Resource Name (ARN) for the user.
     */
    Arn?: Arn;
    /**
     * The user's user name.
     */
    UserName?: UserName;
    /**
     * The user's email address.
     */
    Email?: String;
    /**
     * The Amazon QuickSight role for the user. The user role can be one of the following:.    READER: A user who has read-only access to dashboards.    AUTHOR: A user who can create data sources, datasets, analyses, and dashboards.    ADMIN: A user who is an author, who can also manage Amazon Amazon QuickSight settings.    RESTRICTED_READER: This role isn't currently available for use.    RESTRICTED_AUTHOR: This role isn't currently available for use.  
     */
    Role?: UserRole;
    /**
     * The type of identity authentication used by the user.
     */
    IdentityType?: IdentityType;
    /**
     * The active status of user. When you create an Amazon QuickSight user that’s not an IAM user or an Active Directory user, that user is inactive until they sign in and provide a password.
     */
    Active?: Boolean;
    /**
     * The principal ID of the user.
     */
    PrincipalId?: String;
    /**
     * The custom permissions profile associated with this user.
     */
    CustomPermissionsName?: RoleName;
    /**
     * The type of supported external login provider that provides identity to let the user federate into Amazon QuickSight with an associated IAMrole. The type can be one of the following.    COGNITO: Amazon Cognito. The provider URL is cognito-identity.amazonaws.com.    CUSTOM_OIDC: Custom OpenID Connect (OIDC) provider.  
     */
    ExternalLoginFederationProviderType?: String;
    /**
     * The URL of the external login provider.
     */
    ExternalLoginFederationProviderUrl?: String;
    /**
     * The identity ID for the user in the external login provider.
     */
    ExternalLoginId?: String;
  }
  export type UserList = User[];
  export type UserName = string;
  export type UserRole = "ADMIN"|"AUTHOR"|"READER"|"RESTRICTED_AUTHOR"|"RESTRICTED_READER"|string;
  export type Username = string;
  export type VersionDescription = string;
  export type VersionNumber = number;
  export interface VpcConnectionProperties {
    /**
     * The Amazon Resource Name (ARN) for the VPC connection.
     */
    VpcConnectionArn: Arn;
  }
  export type Warehouse = string;
  export type WorkGroup = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-04-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the QuickSight client.
   */
  export import Types = QuickSight;
}
export = QuickSight;
