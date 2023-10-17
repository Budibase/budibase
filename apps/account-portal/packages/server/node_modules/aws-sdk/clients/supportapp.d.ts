import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SupportApp extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SupportApp.Types.ClientConfiguration)
  config: Config & SupportApp.Types.ClientConfiguration;
  /**
   * Creates a Slack channel configuration for your Amazon Web Services account.    You can add up to 5 Slack workspaces for your account.   You can add up to 20 Slack channels for your account.    A Slack channel can have up to 100 Amazon Web Services accounts. This means that only 100 accounts can add the same Slack channel to the Amazon Web Services Support App. We recommend that you only add the accounts that you need to manage support cases for your organization. This can reduce the notifications about case updates that you receive in the Slack channel.  We recommend that you choose a private Slack channel so that only members in that channel have read and write access to your support cases. Anyone in your Slack channel can create, update, or resolve support cases for your account. Users require an invitation to join private channels.  
   */
  createSlackChannelConfiguration(params: SupportApp.Types.CreateSlackChannelConfigurationRequest, callback?: (err: AWSError, data: SupportApp.Types.CreateSlackChannelConfigurationResult) => void): Request<SupportApp.Types.CreateSlackChannelConfigurationResult, AWSError>;
  /**
   * Creates a Slack channel configuration for your Amazon Web Services account.    You can add up to 5 Slack workspaces for your account.   You can add up to 20 Slack channels for your account.    A Slack channel can have up to 100 Amazon Web Services accounts. This means that only 100 accounts can add the same Slack channel to the Amazon Web Services Support App. We recommend that you only add the accounts that you need to manage support cases for your organization. This can reduce the notifications about case updates that you receive in the Slack channel.  We recommend that you choose a private Slack channel so that only members in that channel have read and write access to your support cases. Anyone in your Slack channel can create, update, or resolve support cases for your account. Users require an invitation to join private channels.  
   */
  createSlackChannelConfiguration(callback?: (err: AWSError, data: SupportApp.Types.CreateSlackChannelConfigurationResult) => void): Request<SupportApp.Types.CreateSlackChannelConfigurationResult, AWSError>;
  /**
   * Deletes an alias for an Amazon Web Services account ID. The alias appears in the Amazon Web Services Support App page of the Amazon Web Services Support Center. The alias also appears in Slack messages from the Amazon Web Services Support App.
   */
  deleteAccountAlias(params: SupportApp.Types.DeleteAccountAliasRequest, callback?: (err: AWSError, data: SupportApp.Types.DeleteAccountAliasResult) => void): Request<SupportApp.Types.DeleteAccountAliasResult, AWSError>;
  /**
   * Deletes an alias for an Amazon Web Services account ID. The alias appears in the Amazon Web Services Support App page of the Amazon Web Services Support Center. The alias also appears in Slack messages from the Amazon Web Services Support App.
   */
  deleteAccountAlias(callback?: (err: AWSError, data: SupportApp.Types.DeleteAccountAliasResult) => void): Request<SupportApp.Types.DeleteAccountAliasResult, AWSError>;
  /**
   * Deletes a Slack channel configuration from your Amazon Web Services account. This operation doesn't delete your Slack channel.
   */
  deleteSlackChannelConfiguration(params: SupportApp.Types.DeleteSlackChannelConfigurationRequest, callback?: (err: AWSError, data: SupportApp.Types.DeleteSlackChannelConfigurationResult) => void): Request<SupportApp.Types.DeleteSlackChannelConfigurationResult, AWSError>;
  /**
   * Deletes a Slack channel configuration from your Amazon Web Services account. This operation doesn't delete your Slack channel.
   */
  deleteSlackChannelConfiguration(callback?: (err: AWSError, data: SupportApp.Types.DeleteSlackChannelConfigurationResult) => void): Request<SupportApp.Types.DeleteSlackChannelConfigurationResult, AWSError>;
  /**
   * Deletes a Slack workspace configuration from your Amazon Web Services account. This operation doesn't delete your Slack workspace.
   */
  deleteSlackWorkspaceConfiguration(params: SupportApp.Types.DeleteSlackWorkspaceConfigurationRequest, callback?: (err: AWSError, data: SupportApp.Types.DeleteSlackWorkspaceConfigurationResult) => void): Request<SupportApp.Types.DeleteSlackWorkspaceConfigurationResult, AWSError>;
  /**
   * Deletes a Slack workspace configuration from your Amazon Web Services account. This operation doesn't delete your Slack workspace.
   */
  deleteSlackWorkspaceConfiguration(callback?: (err: AWSError, data: SupportApp.Types.DeleteSlackWorkspaceConfigurationResult) => void): Request<SupportApp.Types.DeleteSlackWorkspaceConfigurationResult, AWSError>;
  /**
   * Retrieves the alias from an Amazon Web Services account ID. The alias appears in the Amazon Web Services Support App page of the Amazon Web Services Support Center. The alias also appears in Slack messages from the Amazon Web Services Support App.
   */
  getAccountAlias(params: SupportApp.Types.GetAccountAliasRequest, callback?: (err: AWSError, data: SupportApp.Types.GetAccountAliasResult) => void): Request<SupportApp.Types.GetAccountAliasResult, AWSError>;
  /**
   * Retrieves the alias from an Amazon Web Services account ID. The alias appears in the Amazon Web Services Support App page of the Amazon Web Services Support Center. The alias also appears in Slack messages from the Amazon Web Services Support App.
   */
  getAccountAlias(callback?: (err: AWSError, data: SupportApp.Types.GetAccountAliasResult) => void): Request<SupportApp.Types.GetAccountAliasResult, AWSError>;
  /**
   * Lists the Slack channel configurations for an Amazon Web Services account.
   */
  listSlackChannelConfigurations(params: SupportApp.Types.ListSlackChannelConfigurationsRequest, callback?: (err: AWSError, data: SupportApp.Types.ListSlackChannelConfigurationsResult) => void): Request<SupportApp.Types.ListSlackChannelConfigurationsResult, AWSError>;
  /**
   * Lists the Slack channel configurations for an Amazon Web Services account.
   */
  listSlackChannelConfigurations(callback?: (err: AWSError, data: SupportApp.Types.ListSlackChannelConfigurationsResult) => void): Request<SupportApp.Types.ListSlackChannelConfigurationsResult, AWSError>;
  /**
   * Lists the Slack workspace configurations for an Amazon Web Services account.
   */
  listSlackWorkspaceConfigurations(params: SupportApp.Types.ListSlackWorkspaceConfigurationsRequest, callback?: (err: AWSError, data: SupportApp.Types.ListSlackWorkspaceConfigurationsResult) => void): Request<SupportApp.Types.ListSlackWorkspaceConfigurationsResult, AWSError>;
  /**
   * Lists the Slack workspace configurations for an Amazon Web Services account.
   */
  listSlackWorkspaceConfigurations(callback?: (err: AWSError, data: SupportApp.Types.ListSlackWorkspaceConfigurationsResult) => void): Request<SupportApp.Types.ListSlackWorkspaceConfigurationsResult, AWSError>;
  /**
   * Creates or updates an individual alias for each Amazon Web Services account ID. The alias appears in the Amazon Web Services Support App page of the Amazon Web Services Support Center. The alias also appears in Slack messages from the Amazon Web Services Support App.
   */
  putAccountAlias(params: SupportApp.Types.PutAccountAliasRequest, callback?: (err: AWSError, data: SupportApp.Types.PutAccountAliasResult) => void): Request<SupportApp.Types.PutAccountAliasResult, AWSError>;
  /**
   * Creates or updates an individual alias for each Amazon Web Services account ID. The alias appears in the Amazon Web Services Support App page of the Amazon Web Services Support Center. The alias also appears in Slack messages from the Amazon Web Services Support App.
   */
  putAccountAlias(callback?: (err: AWSError, data: SupportApp.Types.PutAccountAliasResult) => void): Request<SupportApp.Types.PutAccountAliasResult, AWSError>;
  /**
   * Registers a Slack workspace for your Amazon Web Services account. To call this API, your account must be part of an organization in Organizations. If you're the management account and you want to register Slack workspaces for your organization, you must complete the following tasks:   Sign in to the Amazon Web Services Support Center and authorize the Slack workspaces where you want your organization to have access to. See Authorize a Slack workspace in the Amazon Web Services Support User Guide.   Call the RegisterSlackWorkspaceForOrganization API to authorize each Slack workspace for the organization.   After the management account authorizes the Slack workspace, member accounts can call this API to authorize the same Slack workspace for their individual accounts. Member accounts don't need to authorize the Slack workspace manually through the Amazon Web Services Support Center. To use the Amazon Web Services Support App, each account must then complete the following tasks:   Create an Identity and Access Management (IAM) role with the required permission. For more information, see Managing access to the Amazon Web Services Support App.   Configure a Slack channel to use the Amazon Web Services Support App for support cases for that account. For more information, see Configuring a Slack channel.  
   */
  registerSlackWorkspaceForOrganization(params: SupportApp.Types.RegisterSlackWorkspaceForOrganizationRequest, callback?: (err: AWSError, data: SupportApp.Types.RegisterSlackWorkspaceForOrganizationResult) => void): Request<SupportApp.Types.RegisterSlackWorkspaceForOrganizationResult, AWSError>;
  /**
   * Registers a Slack workspace for your Amazon Web Services account. To call this API, your account must be part of an organization in Organizations. If you're the management account and you want to register Slack workspaces for your organization, you must complete the following tasks:   Sign in to the Amazon Web Services Support Center and authorize the Slack workspaces where you want your organization to have access to. See Authorize a Slack workspace in the Amazon Web Services Support User Guide.   Call the RegisterSlackWorkspaceForOrganization API to authorize each Slack workspace for the organization.   After the management account authorizes the Slack workspace, member accounts can call this API to authorize the same Slack workspace for their individual accounts. Member accounts don't need to authorize the Slack workspace manually through the Amazon Web Services Support Center. To use the Amazon Web Services Support App, each account must then complete the following tasks:   Create an Identity and Access Management (IAM) role with the required permission. For more information, see Managing access to the Amazon Web Services Support App.   Configure a Slack channel to use the Amazon Web Services Support App for support cases for that account. For more information, see Configuring a Slack channel.  
   */
  registerSlackWorkspaceForOrganization(callback?: (err: AWSError, data: SupportApp.Types.RegisterSlackWorkspaceForOrganizationResult) => void): Request<SupportApp.Types.RegisterSlackWorkspaceForOrganizationResult, AWSError>;
  /**
   * Updates the configuration for a Slack channel, such as case update notifications.
   */
  updateSlackChannelConfiguration(params: SupportApp.Types.UpdateSlackChannelConfigurationRequest, callback?: (err: AWSError, data: SupportApp.Types.UpdateSlackChannelConfigurationResult) => void): Request<SupportApp.Types.UpdateSlackChannelConfigurationResult, AWSError>;
  /**
   * Updates the configuration for a Slack channel, such as case update notifications.
   */
  updateSlackChannelConfiguration(callback?: (err: AWSError, data: SupportApp.Types.UpdateSlackChannelConfigurationResult) => void): Request<SupportApp.Types.UpdateSlackChannelConfigurationResult, AWSError>;
}
declare namespace SupportApp {
  export type AccountType = "management"|"member"|string;
  export interface CreateSlackChannelConfigurationRequest {
    /**
     * The channel ID in Slack. This ID identifies a channel within a Slack workspace.
     */
    channelId: channelId;
    /**
     * The name of the Slack channel that you configure for the Amazon Web Services Support App.
     */
    channelName?: channelName;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that you want to use to perform operations on Amazon Web Services. For more information, see Managing access to the Amazon Web Services Support App in the Amazon Web Services Support User Guide.
     */
    channelRoleArn: roleArn;
    /**
     * Whether you want to get notified when a support case has a new correspondence.
     */
    notifyOnAddCorrespondenceToCase?: booleanValue;
    /**
     * The case severity for a support case that you want to receive notifications. If you specify high or all, you must specify true for at least one of the following parameters:    notifyOnAddCorrespondenceToCase     notifyOnCreateOrReopenCase     notifyOnResolveCase    If you specify none, the following parameters must be null or false:    notifyOnAddCorrespondenceToCase     notifyOnCreateOrReopenCase     notifyOnResolveCase     If you don't specify these parameters in your request, they default to false. 
     */
    notifyOnCaseSeverity: NotificationSeverityLevel;
    /**
     * Whether you want to get notified when a support case is created or reopened.
     */
    notifyOnCreateOrReopenCase?: booleanValue;
    /**
     * Whether you want to get notified when a support case is resolved.
     */
    notifyOnResolveCase?: booleanValue;
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as T012ABCDEFG.
     */
    teamId: teamId;
  }
  export interface CreateSlackChannelConfigurationResult {
  }
  export interface DeleteAccountAliasRequest {
  }
  export interface DeleteAccountAliasResult {
  }
  export interface DeleteSlackChannelConfigurationRequest {
    /**
     * The channel ID in Slack. This ID identifies a channel within a Slack workspace.
     */
    channelId: channelId;
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as T012ABCDEFG.
     */
    teamId: teamId;
  }
  export interface DeleteSlackChannelConfigurationResult {
  }
  export interface DeleteSlackWorkspaceConfigurationRequest {
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as T012ABCDEFG.
     */
    teamId: teamId;
  }
  export interface DeleteSlackWorkspaceConfigurationResult {
  }
  export interface GetAccountAliasRequest {
  }
  export interface GetAccountAliasResult {
    /**
     * An alias or short name for an Amazon Web Services account.
     */
    accountAlias?: awsAccountAlias;
  }
  export interface ListSlackChannelConfigurationsRequest {
    /**
     * If the results of a search are large, the API only returns a portion of the results and includes a nextToken pagination token in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When the API returns the last set of results, the response doesn't include a pagination token value.
     */
    nextToken?: paginationToken;
  }
  export interface ListSlackChannelConfigurationsResult {
    /**
     * The point where pagination should resume when the response returns only partial results.
     */
    nextToken?: paginationToken;
    /**
     * The configurations for a Slack channel.
     */
    slackChannelConfigurations: slackChannelConfigurationList;
  }
  export interface ListSlackWorkspaceConfigurationsRequest {
    /**
     * If the results of a search are large, the API only returns a portion of the results and includes a nextToken pagination token in the response. To retrieve the next batch of results, reissue the search request and include the returned token. When the API returns the last set of results, the response doesn't include a pagination token value.
     */
    nextToken?: paginationToken;
  }
  export interface ListSlackWorkspaceConfigurationsResult {
    /**
     * The point where pagination should resume when the response returns only partial results.
     */
    nextToken?: paginationToken;
    /**
     * The configurations for a Slack workspace.
     */
    slackWorkspaceConfigurations?: SlackWorkspaceConfigurationList;
  }
  export type NotificationSeverityLevel = "none"|"all"|"high"|string;
  export interface PutAccountAliasRequest {
    /**
     * An alias or short name for an Amazon Web Services account.
     */
    accountAlias: awsAccountAlias;
  }
  export interface PutAccountAliasResult {
  }
  export interface RegisterSlackWorkspaceForOrganizationRequest {
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as T012ABCDEFG. Specify the Slack workspace that you want to use for your organization.
     */
    teamId: teamId;
  }
  export interface RegisterSlackWorkspaceForOrganizationResult {
    /**
     * Whether the Amazon Web Services account is a management or member account that's part of an organization in Organizations.
     */
    accountType?: AccountType;
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as T012ABCDEFG.
     */
    teamId?: teamId;
    /**
     * The name of the Slack workspace.
     */
    teamName?: teamName;
  }
  export interface SlackChannelConfiguration {
    /**
     * The channel ID in Slack. This ID identifies a channel within a Slack workspace.
     */
    channelId: channelId;
    /**
     * The name of the Slack channel that you configured with the Amazon Web Services Support App for your Amazon Web Services account.
     */
    channelName?: channelName;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that you want to use to perform operations on Amazon Web Services. For more information, see Managing access to the Amazon Web Services Support App in the Amazon Web Services Support User Guide.
     */
    channelRoleArn?: roleArn;
    /**
     * Whether you want to get notified when a support case has a new correspondence.
     */
    notifyOnAddCorrespondenceToCase?: booleanValue;
    /**
     * The case severity for a support case that you want to receive notifications.
     */
    notifyOnCaseSeverity?: NotificationSeverityLevel;
    /**
     * Whether you want to get notified when a support case is created or reopened.
     */
    notifyOnCreateOrReopenCase?: booleanValue;
    /**
     * Whether you want to get notified when a support case is resolved.
     */
    notifyOnResolveCase?: booleanValue;
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as T012ABCDEFG.
     */
    teamId: teamId;
  }
  export interface SlackWorkspaceConfiguration {
    /**
     * Whether to allow member accounts to authorize Slack workspaces. Member accounts must be part of an organization in Organizations.
     */
    allowOrganizationMemberAccount?: booleanValue;
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as T012ABCDEFG.
     */
    teamId: teamId;
    /**
     * The name of the Slack workspace.
     */
    teamName?: teamName;
  }
  export type SlackWorkspaceConfigurationList = SlackWorkspaceConfiguration[];
  export interface UpdateSlackChannelConfigurationRequest {
    /**
     * The channel ID in Slack. This ID identifies a channel within a Slack workspace.
     */
    channelId: channelId;
    /**
     * The Slack channel name that you want to update.
     */
    channelName?: channelName;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that you want to use to perform operations on Amazon Web Services. For more information, see Managing access to the Amazon Web Services Support App in the Amazon Web Services Support User Guide.
     */
    channelRoleArn?: roleArn;
    /**
     * Whether you want to get notified when a support case has a new correspondence.
     */
    notifyOnAddCorrespondenceToCase?: booleanValue;
    /**
     * The case severity for a support case that you want to receive notifications. If you specify high or all, at least one of the following parameters must be true:    notifyOnAddCorrespondenceToCase     notifyOnCreateOrReopenCase     notifyOnResolveCase    If you specify none, any of the following parameters that you specify in your request must be false:    notifyOnAddCorrespondenceToCase     notifyOnCreateOrReopenCase     notifyOnResolveCase     If you don't specify these parameters in your request, the Amazon Web Services Support App uses the current values by default. 
     */
    notifyOnCaseSeverity?: NotificationSeverityLevel;
    /**
     * Whether you want to get notified when a support case is created or reopened.
     */
    notifyOnCreateOrReopenCase?: booleanValue;
    /**
     * Whether you want to get notified when a support case is resolved.
     */
    notifyOnResolveCase?: booleanValue;
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as T012ABCDEFG.
     */
    teamId: teamId;
  }
  export interface UpdateSlackChannelConfigurationResult {
    /**
     * The channel ID in Slack. This ID identifies a channel within a Slack workspace.
     */
    channelId?: channelId;
    /**
     * The name of the Slack channel that you configure for the Amazon Web Services Support App.
     */
    channelName?: channelName;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that you want to use to perform operations on Amazon Web Services. For more information, see Managing access to the Amazon Web Services Support App in the Amazon Web Services Support User Guide.
     */
    channelRoleArn?: roleArn;
    /**
     * Whether you want to get notified when a support case has a new correspondence.
     */
    notifyOnAddCorrespondenceToCase?: booleanValue;
    /**
     * The case severity for a support case that you want to receive notifications.
     */
    notifyOnCaseSeverity?: NotificationSeverityLevel;
    /**
     * Whether you want to get notified when a support case is created or reopened.
     */
    notifyOnCreateOrReopenCase?: booleanValue;
    /**
     * Whether you want to get notified when a support case is resolved.
     */
    notifyOnResolveCase?: booleanValue;
    /**
     * The team ID in Slack. This ID uniquely identifies a Slack workspace, such as T012ABCDEFG.
     */
    teamId?: teamId;
  }
  export type awsAccountAlias = string;
  export type booleanValue = boolean;
  export type channelId = string;
  export type channelName = string;
  export type paginationToken = string;
  export type roleArn = string;
  export type slackChannelConfigurationList = SlackChannelConfiguration[];
  export type teamId = string;
  export type teamName = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-08-20"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SupportApp client.
   */
  export import Types = SupportApp;
}
export = SupportApp;
