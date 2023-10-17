import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Appflow extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Appflow.Types.ClientConfiguration)
  config: Config & Appflow.Types.ClientConfiguration;
  /**
   * Cancels active runs for a flow. You can cancel all of the active runs for a flow, or you can cancel specific runs by providing their IDs. You can cancel a flow run only when the run is in progress. You can't cancel a run that has already completed or failed. You also can't cancel a run that's scheduled to occur but hasn't started yet. To prevent a scheduled run, you can deactivate the flow with the StopFlow action. You cannot resume a run after you cancel it. When you send your request, the status for each run becomes CancelStarted. When the cancellation completes, the status becomes Canceled.  When you cancel a run, you still incur charges for any data that the run already processed before the cancellation. If the run had already written some data to the flow destination, then that data remains in the destination. If you configured the flow to use a batch API (such as the Salesforce Bulk API 2.0), then the run will finish reading or writing its entire batch of data after the cancellation. For these operations, the data processing charges for Amazon AppFlow apply. For the pricing information, see Amazon AppFlow pricing. 
   */
  cancelFlowExecutions(params: Appflow.Types.CancelFlowExecutionsRequest, callback?: (err: AWSError, data: Appflow.Types.CancelFlowExecutionsResponse) => void): Request<Appflow.Types.CancelFlowExecutionsResponse, AWSError>;
  /**
   * Cancels active runs for a flow. You can cancel all of the active runs for a flow, or you can cancel specific runs by providing their IDs. You can cancel a flow run only when the run is in progress. You can't cancel a run that has already completed or failed. You also can't cancel a run that's scheduled to occur but hasn't started yet. To prevent a scheduled run, you can deactivate the flow with the StopFlow action. You cannot resume a run after you cancel it. When you send your request, the status for each run becomes CancelStarted. When the cancellation completes, the status becomes Canceled.  When you cancel a run, you still incur charges for any data that the run already processed before the cancellation. If the run had already written some data to the flow destination, then that data remains in the destination. If you configured the flow to use a batch API (such as the Salesforce Bulk API 2.0), then the run will finish reading or writing its entire batch of data after the cancellation. For these operations, the data processing charges for Amazon AppFlow apply. For the pricing information, see Amazon AppFlow pricing. 
   */
  cancelFlowExecutions(callback?: (err: AWSError, data: Appflow.Types.CancelFlowExecutionsResponse) => void): Request<Appflow.Types.CancelFlowExecutionsResponse, AWSError>;
  /**
   *  Creates a new connector profile associated with your Amazon Web Services account. There is a soft quota of 100 connector profiles per Amazon Web Services account. If you need more connector profiles than this quota allows, you can submit a request to the Amazon AppFlow team through the Amazon AppFlow support channel. In each connector profile that you create, you can provide the credentials and properties for only one connector.
   */
  createConnectorProfile(params: Appflow.Types.CreateConnectorProfileRequest, callback?: (err: AWSError, data: Appflow.Types.CreateConnectorProfileResponse) => void): Request<Appflow.Types.CreateConnectorProfileResponse, AWSError>;
  /**
   *  Creates a new connector profile associated with your Amazon Web Services account. There is a soft quota of 100 connector profiles per Amazon Web Services account. If you need more connector profiles than this quota allows, you can submit a request to the Amazon AppFlow team through the Amazon AppFlow support channel. In each connector profile that you create, you can provide the credentials and properties for only one connector.
   */
  createConnectorProfile(callback?: (err: AWSError, data: Appflow.Types.CreateConnectorProfileResponse) => void): Request<Appflow.Types.CreateConnectorProfileResponse, AWSError>;
  /**
   *  Enables your application to create a new flow using Amazon AppFlow. You must create a connector profile before calling this API. Please note that the Request Syntax below shows syntax for multiple destinations, however, you can only transfer data to one item in this list at a time. Amazon AppFlow does not currently support flows to multiple destinations at once. 
   */
  createFlow(params: Appflow.Types.CreateFlowRequest, callback?: (err: AWSError, data: Appflow.Types.CreateFlowResponse) => void): Request<Appflow.Types.CreateFlowResponse, AWSError>;
  /**
   *  Enables your application to create a new flow using Amazon AppFlow. You must create a connector profile before calling this API. Please note that the Request Syntax below shows syntax for multiple destinations, however, you can only transfer data to one item in this list at a time. Amazon AppFlow does not currently support flows to multiple destinations at once. 
   */
  createFlow(callback?: (err: AWSError, data: Appflow.Types.CreateFlowResponse) => void): Request<Appflow.Types.CreateFlowResponse, AWSError>;
  /**
   *  Enables you to delete an existing connector profile. 
   */
  deleteConnectorProfile(params: Appflow.Types.DeleteConnectorProfileRequest, callback?: (err: AWSError, data: Appflow.Types.DeleteConnectorProfileResponse) => void): Request<Appflow.Types.DeleteConnectorProfileResponse, AWSError>;
  /**
   *  Enables you to delete an existing connector profile. 
   */
  deleteConnectorProfile(callback?: (err: AWSError, data: Appflow.Types.DeleteConnectorProfileResponse) => void): Request<Appflow.Types.DeleteConnectorProfileResponse, AWSError>;
  /**
   *  Enables your application to delete an existing flow. Before deleting the flow, Amazon AppFlow validates the request by checking the flow configuration and status. You can delete flows one at a time. 
   */
  deleteFlow(params: Appflow.Types.DeleteFlowRequest, callback?: (err: AWSError, data: Appflow.Types.DeleteFlowResponse) => void): Request<Appflow.Types.DeleteFlowResponse, AWSError>;
  /**
   *  Enables your application to delete an existing flow. Before deleting the flow, Amazon AppFlow validates the request by checking the flow configuration and status. You can delete flows one at a time. 
   */
  deleteFlow(callback?: (err: AWSError, data: Appflow.Types.DeleteFlowResponse) => void): Request<Appflow.Types.DeleteFlowResponse, AWSError>;
  /**
   * Describes the given custom connector registered in your Amazon Web Services account. This API can be used for custom connectors that are registered in your account and also for Amazon authored connectors.
   */
  describeConnector(params: Appflow.Types.DescribeConnectorRequest, callback?: (err: AWSError, data: Appflow.Types.DescribeConnectorResponse) => void): Request<Appflow.Types.DescribeConnectorResponse, AWSError>;
  /**
   * Describes the given custom connector registered in your Amazon Web Services account. This API can be used for custom connectors that are registered in your account and also for Amazon authored connectors.
   */
  describeConnector(callback?: (err: AWSError, data: Appflow.Types.DescribeConnectorResponse) => void): Request<Appflow.Types.DescribeConnectorResponse, AWSError>;
  /**
   *  Provides details regarding the entity used with the connector, with a description of the data model for each field in that entity. 
   */
  describeConnectorEntity(params: Appflow.Types.DescribeConnectorEntityRequest, callback?: (err: AWSError, data: Appflow.Types.DescribeConnectorEntityResponse) => void): Request<Appflow.Types.DescribeConnectorEntityResponse, AWSError>;
  /**
   *  Provides details regarding the entity used with the connector, with a description of the data model for each field in that entity. 
   */
  describeConnectorEntity(callback?: (err: AWSError, data: Appflow.Types.DescribeConnectorEntityResponse) => void): Request<Appflow.Types.DescribeConnectorEntityResponse, AWSError>;
  /**
   *  Returns a list of connector-profile details matching the provided connector-profile names and connector-types. Both input lists are optional, and you can use them to filter the result.  If no names or connector-types are provided, returns all connector profiles in a paginated form. If there is no match, this operation returns an empty list.
   */
  describeConnectorProfiles(params: Appflow.Types.DescribeConnectorProfilesRequest, callback?: (err: AWSError, data: Appflow.Types.DescribeConnectorProfilesResponse) => void): Request<Appflow.Types.DescribeConnectorProfilesResponse, AWSError>;
  /**
   *  Returns a list of connector-profile details matching the provided connector-profile names and connector-types. Both input lists are optional, and you can use them to filter the result.  If no names or connector-types are provided, returns all connector profiles in a paginated form. If there is no match, this operation returns an empty list.
   */
  describeConnectorProfiles(callback?: (err: AWSError, data: Appflow.Types.DescribeConnectorProfilesResponse) => void): Request<Appflow.Types.DescribeConnectorProfilesResponse, AWSError>;
  /**
   *  Describes the connectors vended by Amazon AppFlow for specified connector types. If you don't specify a connector type, this operation describes all connectors vended by Amazon AppFlow. If there are more connectors than can be returned in one page, the response contains a nextToken object, which can be be passed in to the next call to the DescribeConnectors API operation to retrieve the next page. 
   */
  describeConnectors(params: Appflow.Types.DescribeConnectorsRequest, callback?: (err: AWSError, data: Appflow.Types.DescribeConnectorsResponse) => void): Request<Appflow.Types.DescribeConnectorsResponse, AWSError>;
  /**
   *  Describes the connectors vended by Amazon AppFlow for specified connector types. If you don't specify a connector type, this operation describes all connectors vended by Amazon AppFlow. If there are more connectors than can be returned in one page, the response contains a nextToken object, which can be be passed in to the next call to the DescribeConnectors API operation to retrieve the next page. 
   */
  describeConnectors(callback?: (err: AWSError, data: Appflow.Types.DescribeConnectorsResponse) => void): Request<Appflow.Types.DescribeConnectorsResponse, AWSError>;
  /**
   *  Provides a description of the specified flow. 
   */
  describeFlow(params: Appflow.Types.DescribeFlowRequest, callback?: (err: AWSError, data: Appflow.Types.DescribeFlowResponse) => void): Request<Appflow.Types.DescribeFlowResponse, AWSError>;
  /**
   *  Provides a description of the specified flow. 
   */
  describeFlow(callback?: (err: AWSError, data: Appflow.Types.DescribeFlowResponse) => void): Request<Appflow.Types.DescribeFlowResponse, AWSError>;
  /**
   *  Fetches the execution history of the flow. 
   */
  describeFlowExecutionRecords(params: Appflow.Types.DescribeFlowExecutionRecordsRequest, callback?: (err: AWSError, data: Appflow.Types.DescribeFlowExecutionRecordsResponse) => void): Request<Appflow.Types.DescribeFlowExecutionRecordsResponse, AWSError>;
  /**
   *  Fetches the execution history of the flow. 
   */
  describeFlowExecutionRecords(callback?: (err: AWSError, data: Appflow.Types.DescribeFlowExecutionRecordsResponse) => void): Request<Appflow.Types.DescribeFlowExecutionRecordsResponse, AWSError>;
  /**
   *  Returns the list of available connector entities supported by Amazon AppFlow. For example, you can query Salesforce for Account and Opportunity entities, or query ServiceNow for the Incident entity. 
   */
  listConnectorEntities(params: Appflow.Types.ListConnectorEntitiesRequest, callback?: (err: AWSError, data: Appflow.Types.ListConnectorEntitiesResponse) => void): Request<Appflow.Types.ListConnectorEntitiesResponse, AWSError>;
  /**
   *  Returns the list of available connector entities supported by Amazon AppFlow. For example, you can query Salesforce for Account and Opportunity entities, or query ServiceNow for the Incident entity. 
   */
  listConnectorEntities(callback?: (err: AWSError, data: Appflow.Types.ListConnectorEntitiesResponse) => void): Request<Appflow.Types.ListConnectorEntitiesResponse, AWSError>;
  /**
   * Returns the list of all registered custom connectors in your Amazon Web Services account. This API lists only custom connectors registered in this account, not the Amazon Web Services authored connectors. 
   */
  listConnectors(params: Appflow.Types.ListConnectorsRequest, callback?: (err: AWSError, data: Appflow.Types.ListConnectorsResponse) => void): Request<Appflow.Types.ListConnectorsResponse, AWSError>;
  /**
   * Returns the list of all registered custom connectors in your Amazon Web Services account. This API lists only custom connectors registered in this account, not the Amazon Web Services authored connectors. 
   */
  listConnectors(callback?: (err: AWSError, data: Appflow.Types.ListConnectorsResponse) => void): Request<Appflow.Types.ListConnectorsResponse, AWSError>;
  /**
   *  Lists all of the flows associated with your account. 
   */
  listFlows(params: Appflow.Types.ListFlowsRequest, callback?: (err: AWSError, data: Appflow.Types.ListFlowsResponse) => void): Request<Appflow.Types.ListFlowsResponse, AWSError>;
  /**
   *  Lists all of the flows associated with your account. 
   */
  listFlows(callback?: (err: AWSError, data: Appflow.Types.ListFlowsResponse) => void): Request<Appflow.Types.ListFlowsResponse, AWSError>;
  /**
   *  Retrieves the tags that are associated with a specified flow. 
   */
  listTagsForResource(params: Appflow.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Appflow.Types.ListTagsForResourceResponse) => void): Request<Appflow.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Retrieves the tags that are associated with a specified flow. 
   */
  listTagsForResource(callback?: (err: AWSError, data: Appflow.Types.ListTagsForResourceResponse) => void): Request<Appflow.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Registers a new custom connector with your Amazon Web Services account. Before you can register the connector, you must deploy the associated AWS lambda function in your account.
   */
  registerConnector(params: Appflow.Types.RegisterConnectorRequest, callback?: (err: AWSError, data: Appflow.Types.RegisterConnectorResponse) => void): Request<Appflow.Types.RegisterConnectorResponse, AWSError>;
  /**
   * Registers a new custom connector with your Amazon Web Services account. Before you can register the connector, you must deploy the associated AWS lambda function in your account.
   */
  registerConnector(callback?: (err: AWSError, data: Appflow.Types.RegisterConnectorResponse) => void): Request<Appflow.Types.RegisterConnectorResponse, AWSError>;
  /**
   * Resets metadata about your connector entities that Amazon AppFlow stored in its cache. Use this action when you want Amazon AppFlow to return the latest information about the data that you have in a source application. Amazon AppFlow returns metadata about your entities when you use the ListConnectorEntities or DescribeConnectorEntities actions. Following these actions, Amazon AppFlow caches the metadata to reduce the number of API requests that it must send to the source application. Amazon AppFlow automatically resets the cache once every hour, but you can use this action when you want to get the latest metadata right away.
   */
  resetConnectorMetadataCache(params: Appflow.Types.ResetConnectorMetadataCacheRequest, callback?: (err: AWSError, data: Appflow.Types.ResetConnectorMetadataCacheResponse) => void): Request<Appflow.Types.ResetConnectorMetadataCacheResponse, AWSError>;
  /**
   * Resets metadata about your connector entities that Amazon AppFlow stored in its cache. Use this action when you want Amazon AppFlow to return the latest information about the data that you have in a source application. Amazon AppFlow returns metadata about your entities when you use the ListConnectorEntities or DescribeConnectorEntities actions. Following these actions, Amazon AppFlow caches the metadata to reduce the number of API requests that it must send to the source application. Amazon AppFlow automatically resets the cache once every hour, but you can use this action when you want to get the latest metadata right away.
   */
  resetConnectorMetadataCache(callback?: (err: AWSError, data: Appflow.Types.ResetConnectorMetadataCacheResponse) => void): Request<Appflow.Types.ResetConnectorMetadataCacheResponse, AWSError>;
  /**
   *  Activates an existing flow. For on-demand flows, this operation runs the flow immediately. For schedule and event-triggered flows, this operation activates the flow. 
   */
  startFlow(params: Appflow.Types.StartFlowRequest, callback?: (err: AWSError, data: Appflow.Types.StartFlowResponse) => void): Request<Appflow.Types.StartFlowResponse, AWSError>;
  /**
   *  Activates an existing flow. For on-demand flows, this operation runs the flow immediately. For schedule and event-triggered flows, this operation activates the flow. 
   */
  startFlow(callback?: (err: AWSError, data: Appflow.Types.StartFlowResponse) => void): Request<Appflow.Types.StartFlowResponse, AWSError>;
  /**
   *  Deactivates the existing flow. For on-demand flows, this operation returns an unsupportedOperationException error message. For schedule and event-triggered flows, this operation deactivates the flow. 
   */
  stopFlow(params: Appflow.Types.StopFlowRequest, callback?: (err: AWSError, data: Appflow.Types.StopFlowResponse) => void): Request<Appflow.Types.StopFlowResponse, AWSError>;
  /**
   *  Deactivates the existing flow. For on-demand flows, this operation returns an unsupportedOperationException error message. For schedule and event-triggered flows, this operation deactivates the flow. 
   */
  stopFlow(callback?: (err: AWSError, data: Appflow.Types.StopFlowResponse) => void): Request<Appflow.Types.StopFlowResponse, AWSError>;
  /**
   *  Applies a tag to the specified flow. 
   */
  tagResource(params: Appflow.Types.TagResourceRequest, callback?: (err: AWSError, data: Appflow.Types.TagResourceResponse) => void): Request<Appflow.Types.TagResourceResponse, AWSError>;
  /**
   *  Applies a tag to the specified flow. 
   */
  tagResource(callback?: (err: AWSError, data: Appflow.Types.TagResourceResponse) => void): Request<Appflow.Types.TagResourceResponse, AWSError>;
  /**
   * Unregisters the custom connector registered in your account that matches the connector label provided in the request.
   */
  unregisterConnector(params: Appflow.Types.UnregisterConnectorRequest, callback?: (err: AWSError, data: Appflow.Types.UnregisterConnectorResponse) => void): Request<Appflow.Types.UnregisterConnectorResponse, AWSError>;
  /**
   * Unregisters the custom connector registered in your account that matches the connector label provided in the request.
   */
  unregisterConnector(callback?: (err: AWSError, data: Appflow.Types.UnregisterConnectorResponse) => void): Request<Appflow.Types.UnregisterConnectorResponse, AWSError>;
  /**
   *  Removes a tag from the specified flow. 
   */
  untagResource(params: Appflow.Types.UntagResourceRequest, callback?: (err: AWSError, data: Appflow.Types.UntagResourceResponse) => void): Request<Appflow.Types.UntagResourceResponse, AWSError>;
  /**
   *  Removes a tag from the specified flow. 
   */
  untagResource(callback?: (err: AWSError, data: Appflow.Types.UntagResourceResponse) => void): Request<Appflow.Types.UntagResourceResponse, AWSError>;
  /**
   *  Updates a given connector profile associated with your account. 
   */
  updateConnectorProfile(params: Appflow.Types.UpdateConnectorProfileRequest, callback?: (err: AWSError, data: Appflow.Types.UpdateConnectorProfileResponse) => void): Request<Appflow.Types.UpdateConnectorProfileResponse, AWSError>;
  /**
   *  Updates a given connector profile associated with your account. 
   */
  updateConnectorProfile(callback?: (err: AWSError, data: Appflow.Types.UpdateConnectorProfileResponse) => void): Request<Appflow.Types.UpdateConnectorProfileResponse, AWSError>;
  /**
   * Updates a custom connector that you've previously registered. This operation updates the connector with one of the following:   The latest version of the AWS Lambda function that's assigned to the connector   A new AWS Lambda function that you specify  
   */
  updateConnectorRegistration(params: Appflow.Types.UpdateConnectorRegistrationRequest, callback?: (err: AWSError, data: Appflow.Types.UpdateConnectorRegistrationResponse) => void): Request<Appflow.Types.UpdateConnectorRegistrationResponse, AWSError>;
  /**
   * Updates a custom connector that you've previously registered. This operation updates the connector with one of the following:   The latest version of the AWS Lambda function that's assigned to the connector   A new AWS Lambda function that you specify  
   */
  updateConnectorRegistration(callback?: (err: AWSError, data: Appflow.Types.UpdateConnectorRegistrationResponse) => void): Request<Appflow.Types.UpdateConnectorRegistrationResponse, AWSError>;
  /**
   *  Updates an existing flow. 
   */
  updateFlow(params: Appflow.Types.UpdateFlowRequest, callback?: (err: AWSError, data: Appflow.Types.UpdateFlowResponse) => void): Request<Appflow.Types.UpdateFlowResponse, AWSError>;
  /**
   *  Updates an existing flow. 
   */
  updateFlow(callback?: (err: AWSError, data: Appflow.Types.UpdateFlowResponse) => void): Request<Appflow.Types.UpdateFlowResponse, AWSError>;
}
declare namespace Appflow {
  export type ARN = string;
  export type AccessKeyId = string;
  export type AccessToken = string;
  export type AccountName = string;
  export interface AggregationConfig {
    /**
     *  Specifies whether Amazon AppFlow aggregates the flow records into a single file, or leave them unaggregated. 
     */
    aggregationType?: AggregationType;
    /**
     * The desired file size, in MB, for each output file that Amazon AppFlow writes to the flow destination. For each file, Amazon AppFlow attempts to achieve the size that you specify. The actual file sizes might differ from this target based on the number and size of the records that each file contains.
     */
    targetFileSize?: Long;
  }
  export type AggregationType = "None"|"SingleFile"|string;
  export type AmplitudeConnectorOperator = "BETWEEN"|string;
  export interface AmplitudeConnectorProfileCredentials {
    /**
     *  A unique alphanumeric identifier used to authenticate a user, developer, or calling program to your API. 
     */
    apiKey: ApiKey;
    /**
     *  The Secret Access Key portion of the credentials. 
     */
    secretKey: SecretKey;
  }
  export interface AmplitudeConnectorProfileProperties {
  }
  export interface AmplitudeMetadata {
  }
  export interface AmplitudeSourceProperties {
    /**
     *  The object specified in the Amplitude flow source. 
     */
    object: Object;
  }
  export type ApiKey = string;
  export interface ApiKeyCredentials {
    /**
     * The API key required for API key authentication.
     */
    apiKey: ApiKey;
    /**
     * The API secret key required for API key authentication.
     */
    apiSecretKey?: ApiSecretKey;
  }
  export type ApiSecretKey = string;
  export type ApiToken = string;
  export type ApiVersion = string;
  export type ApplicationHostUrl = string;
  export type ApplicationKey = string;
  export type ApplicationServicePath = string;
  export type ApplicationType = string;
  export type AuthCode = string;
  export type AuthCodeUrl = string;
  export type AuthCodeUrlList = AuthCodeUrl[];
  export interface AuthParameter {
    /**
     * The authentication key required to authenticate with the connector.
     */
    key?: Key;
    /**
     * Indicates whether this authentication parameter is required.
     */
    isRequired?: Boolean;
    /**
     * Label used for authentication parameter.
     */
    label?: Label;
    /**
     * A description about the authentication parameter.
     */
    description?: Description;
    /**
     * Indicates whether this authentication parameter is a sensitive field.
     */
    isSensitiveField?: Boolean;
    /**
     * Contains default values for this authentication parameter that are supplied by the connector.
     */
    connectorSuppliedValues?: ConnectorSuppliedValueList;
  }
  export type AuthParameterList = AuthParameter[];
  export interface AuthenticationConfig {
    /**
     * Indicates whether basic authentication is supported by the connector.
     */
    isBasicAuthSupported?: Boolean;
    /**
     * Indicates whether API key authentication is supported by the connector
     */
    isApiKeyAuthSupported?: Boolean;
    /**
     * Indicates whether OAuth 2.0 authentication is supported by the connector.
     */
    isOAuth2Supported?: Boolean;
    /**
     * Indicates whether custom authentication is supported by the connector
     */
    isCustomAuthSupported?: Boolean;
    /**
     * Contains the default values required for OAuth 2.0 authentication.
     */
    oAuth2Defaults?: OAuth2Defaults;
    /**
     * Contains information required for custom authentication.
     */
    customAuthConfigs?: CustomAuthConfigList;
  }
  export type AuthenticationType = "OAUTH2"|"APIKEY"|"BASIC"|"CUSTOM"|string;
  export interface BasicAuthCredentials {
    /**
     *  The username to use to connect to a resource. 
     */
    username: Username;
    /**
     *  The password to use to connect to a resource.
     */
    password: Password;
  }
  export type Boolean = boolean;
  export type BucketName = string;
  export type BucketPrefix = string;
  export type BusinessUnitId = string;
  export interface CancelFlowExecutionsRequest {
    /**
     * The name of a flow with active runs that you want to cancel.
     */
    flowName: FlowName;
    /**
     * The ID of each active run to cancel. These runs must belong to the flow you specify in your request. If you omit this parameter, your request ends all active runs that belong to the flow.
     */
    executionIds?: ExecutionIds;
  }
  export interface CancelFlowExecutionsResponse {
    /**
     * The IDs of runs that Amazon AppFlow couldn't cancel. These runs might be ineligible for canceling because they haven't started yet or have already completed.
     */
    invalidExecutions?: ExecutionIds;
  }
  export type CatalogType = "GLUE"|string;
  export type ClientCredentialsArn = string;
  export type ClientId = string;
  export type ClientNumber = string;
  export type ClientSecret = string;
  export type ClientToken = string;
  export type ClusterIdentifier = string;
  export type ConnectionMode = "Public"|"Private"|string;
  export interface ConnectorConfiguration {
    /**
     *  Specifies whether the connector can be used as a source. 
     */
    canUseAsSource?: Boolean;
    /**
     *  Specifies whether the connector can be used as a destination. 
     */
    canUseAsDestination?: Boolean;
    /**
     *  Lists the connectors that are available for use as destinations. 
     */
    supportedDestinationConnectors?: ConnectorTypeList;
    /**
     *  Specifies the supported flow frequency for that connector. 
     */
    supportedSchedulingFrequencies?: SchedulingFrequencyTypeList;
    /**
     *  Specifies if PrivateLink is enabled for that connector. 
     */
    isPrivateLinkEnabled?: Boolean;
    /**
     *  Specifies if a PrivateLink endpoint URL is required. 
     */
    isPrivateLinkEndpointUrlRequired?: Boolean;
    /**
     *  Specifies the supported trigger types for the flow. 
     */
    supportedTriggerTypes?: TriggerTypeList;
    /**
     *  Specifies connector-specific metadata such as oAuthScopes, supportedRegions, privateLinkServiceUrl, and so on. 
     */
    connectorMetadata?: ConnectorMetadata;
    /**
     * The connector type.
     */
    connectorType?: ConnectorType;
    /**
     * The label used for registering the connector.
     */
    connectorLabel?: ConnectorLabel;
    /**
     * A description about the connector.
     */
    connectorDescription?: ConnectorDescription;
    /**
     * The owner who developed the connector.
     */
    connectorOwner?: ConnectorOwner;
    /**
     * The connector name.
     */
    connectorName?: ConnectorName;
    /**
     * The connector version.
     */
    connectorVersion?: ConnectorVersion;
    /**
     * The Amazon Resource Name (ARN) for the registered connector.
     */
    connectorArn?: ARN;
    /**
     * The connection modes that the connector supports.
     */
    connectorModes?: ConnectorModeList;
    /**
     * The authentication config required for the connector.
     */
    authenticationConfig?: AuthenticationConfig;
    /**
     * The required connector runtime settings.
     */
    connectorRuntimeSettings?: ConnectorRuntimeSettingList;
    /**
     * A list of API versions that are supported by the connector.
     */
    supportedApiVersions?: SupportedApiVersionList;
    /**
     * A list of operators supported by the connector.
     */
    supportedOperators?: SupportedOperatorList;
    /**
     * A list of write operations supported by the connector.
     */
    supportedWriteOperations?: SupportedWriteOperationList;
    /**
     * The provisioning type used to register the connector.
     */
    connectorProvisioningType?: ConnectorProvisioningType;
    /**
     * The configuration required for registering the connector.
     */
    connectorProvisioningConfig?: ConnectorProvisioningConfig;
    /**
     * Logo URL of the connector.
     */
    logoURL?: LogoURL;
    /**
     * The date on which the connector was registered.
     */
    registeredAt?: _Date;
    /**
     * Information about who registered the connector.
     */
    registeredBy?: RegisteredBy;
    /**
     * The data transfer types that the connector supports.  RECORD  Structured records.  FILE  Files or binary data.  
     */
    supportedDataTransferTypes?: SupportedDataTransferTypeList;
    /**
     * The APIs of the connector application that Amazon AppFlow can use to transfer your data.
     */
    supportedDataTransferApis?: SupportedDataTransferApis;
  }
  export type ConnectorConfigurationsMap = {[key: string]: ConnectorConfiguration};
  export type ConnectorDescription = string;
  export interface ConnectorDetail {
    /**
     * A description about the registered connector.
     */
    connectorDescription?: ConnectorDescription;
    /**
     * The name of the connector.
     */
    connectorName?: ConnectorName;
    /**
     * The owner of the connector.
     */
    connectorOwner?: ConnectorOwner;
    /**
     * The connector version.
     */
    connectorVersion?: ConnectorVersion;
    /**
     * The application type of the connector.
     */
    applicationType?: ApplicationType;
    /**
     * The connector type.
     */
    connectorType?: ConnectorType;
    /**
     * A label used for the connector.
     */
    connectorLabel?: ConnectorLabel;
    /**
     * The time at which the connector was registered.
     */
    registeredAt?: _Date;
    /**
     * The user who registered the connector.
     */
    registeredBy?: RegisteredBy;
    /**
     * The provisioning type that the connector uses.
     */
    connectorProvisioningType?: ConnectorProvisioningType;
    /**
     * The connection mode that the connector supports.
     */
    connectorModes?: ConnectorModeList;
    /**
     * The data transfer types that the connector supports.  RECORD  Structured records.  FILE  Files or binary data.  
     */
    supportedDataTransferTypes?: SupportedDataTransferTypeList;
  }
  export interface ConnectorEntity {
    /**
     *  The name of the connector entity. 
     */
    name: Name;
    /**
     *  The label applied to the connector entity. 
     */
    label?: Label;
    /**
     *  Specifies whether the connector entity is a parent or a category and has more entities nested underneath it. If another call is made with entitiesPath = "the_current_entity_name_with_hasNestedEntities_true", then it returns the nested entities underneath it. This provides a way to retrieve all supported entities in a recursive fashion. 
     */
    hasNestedEntities?: Boolean;
  }
  export interface ConnectorEntityField {
    /**
     *  The unique identifier of the connector field. 
     */
    identifier: Identifier;
    /**
     * The parent identifier of the connector field.
     */
    parentIdentifier?: Identifier;
    /**
     *  The label applied to a connector entity field. 
     */
    label?: Label;
    /**
     * Booelan value that indicates whether this field can be used as a primary key.
     */
    isPrimaryKey?: Boolean;
    /**
     * Default value that can be assigned to this field.
     */
    defaultValue?: String;
    /**
     * Booelan value that indicates whether this field is deprecated or not.
     */
    isDeprecated?: Boolean;
    /**
     *  Contains details regarding the supported FieldType, including the corresponding filterOperators and supportedValues. 
     */
    supportedFieldTypeDetails?: SupportedFieldTypeDetails;
    /**
     *  A description of the connector entity field. 
     */
    description?: Description;
    /**
     *  The properties that can be applied to a field when the connector is being used as a source. 
     */
    sourceProperties?: SourceFieldProperties;
    /**
     *  The properties applied to a field when the connector is being used as a destination. 
     */
    destinationProperties?: DestinationFieldProperties;
    /**
     * A map that has specific properties related to the ConnectorEntityField.
     */
    customProperties?: CustomProperties;
  }
  export type ConnectorEntityFieldList = ConnectorEntityField[];
  export type ConnectorEntityList = ConnectorEntity[];
  export type ConnectorEntityMap = {[key: string]: ConnectorEntityList};
  export type ConnectorLabel = string;
  export type ConnectorList = ConnectorDetail[];
  export interface ConnectorMetadata {
    /**
     *  The connector metadata specific to Amplitude. 
     */
    Amplitude?: AmplitudeMetadata;
    /**
     *  The connector metadata specific to Datadog. 
     */
    Datadog?: DatadogMetadata;
    /**
     *  The connector metadata specific to Dynatrace. 
     */
    Dynatrace?: DynatraceMetadata;
    /**
     *  The connector metadata specific to Google Analytics. 
     */
    GoogleAnalytics?: GoogleAnalyticsMetadata;
    /**
     *  The connector metadata specific to Infor Nexus. 
     */
    InforNexus?: InforNexusMetadata;
    /**
     *  The connector metadata specific to Marketo. 
     */
    Marketo?: MarketoMetadata;
    /**
     *  The connector metadata specific to Amazon Redshift. 
     */
    Redshift?: RedshiftMetadata;
    /**
     *  The connector metadata specific to Amazon S3. 
     */
    S3?: S3Metadata;
    /**
     *  The connector metadata specific to Salesforce. 
     */
    Salesforce?: SalesforceMetadata;
    /**
     *  The connector metadata specific to ServiceNow. 
     */
    ServiceNow?: ServiceNowMetadata;
    /**
     *  The connector metadata specific to Singular. 
     */
    Singular?: SingularMetadata;
    /**
     *  The connector metadata specific to Slack. 
     */
    Slack?: SlackMetadata;
    /**
     *  The connector metadata specific to Snowflake. 
     */
    Snowflake?: SnowflakeMetadata;
    /**
     *  The connector metadata specific to Trend Micro. 
     */
    Trendmicro?: TrendmicroMetadata;
    /**
     *  The connector metadata specific to Veeva. 
     */
    Veeva?: VeevaMetadata;
    /**
     *  The connector metadata specific to Zendesk. 
     */
    Zendesk?: ZendeskMetadata;
    /**
     *  The connector metadata specific to Amazon EventBridge. 
     */
    EventBridge?: EventBridgeMetadata;
    /**
     *  The connector metadata specific to Upsolver. 
     */
    Upsolver?: UpsolverMetadata;
    /**
     *  The connector metadata specific to Amazon Connect Customer Profiles. 
     */
    CustomerProfiles?: CustomerProfilesMetadata;
    /**
     *  The connector metadata specific to Amazon Honeycode. 
     */
    Honeycode?: HoneycodeMetadata;
    SAPOData?: SAPODataMetadata;
    /**
     * The connector metadata specific to Salesforce Pardot.
     */
    Pardot?: PardotMetadata;
  }
  export type ConnectorMode = string;
  export type ConnectorModeList = ConnectorMode[];
  export type ConnectorName = string;
  export interface ConnectorOAuthRequest {
    /**
     *  The code provided by the connector when it has been authenticated via the connected app. 
     */
    authCode?: AuthCode;
    /**
     *  The URL to which the authentication server redirects the browser after authorization has been granted. 
     */
    redirectUri?: RedirectUri;
  }
  export interface ConnectorOperator {
    /**
     *  The operation to be performed on the provided Amplitude source fields. 
     */
    Amplitude?: AmplitudeConnectorOperator;
    /**
     *  The operation to be performed on the provided Datadog source fields. 
     */
    Datadog?: DatadogConnectorOperator;
    /**
     *  The operation to be performed on the provided Dynatrace source fields. 
     */
    Dynatrace?: DynatraceConnectorOperator;
    /**
     *  The operation to be performed on the provided Google Analytics source fields. 
     */
    GoogleAnalytics?: GoogleAnalyticsConnectorOperator;
    /**
     *  The operation to be performed on the provided Infor Nexus source fields. 
     */
    InforNexus?: InforNexusConnectorOperator;
    /**
     *  The operation to be performed on the provided Marketo source fields. 
     */
    Marketo?: MarketoConnectorOperator;
    /**
     *  The operation to be performed on the provided Amazon S3 source fields. 
     */
    S3?: S3ConnectorOperator;
    /**
     *  The operation to be performed on the provided Salesforce source fields. 
     */
    Salesforce?: SalesforceConnectorOperator;
    /**
     *  The operation to be performed on the provided ServiceNow source fields. 
     */
    ServiceNow?: ServiceNowConnectorOperator;
    /**
     *  The operation to be performed on the provided Singular source fields. 
     */
    Singular?: SingularConnectorOperator;
    /**
     *  The operation to be performed on the provided Slack source fields. 
     */
    Slack?: SlackConnectorOperator;
    /**
     *  The operation to be performed on the provided Trend Micro source fields. 
     */
    Trendmicro?: TrendmicroConnectorOperator;
    /**
     *  The operation to be performed on the provided Veeva source fields. 
     */
    Veeva?: VeevaConnectorOperator;
    /**
     *  The operation to be performed on the provided Zendesk source fields. 
     */
    Zendesk?: ZendeskConnectorOperator;
    /**
     *  The operation to be performed on the provided SAPOData source fields. 
     */
    SAPOData?: SAPODataConnectorOperator;
    /**
     * Operators supported by the custom connector.
     */
    CustomConnector?: Operator;
    /**
     * The operation to be performed on the provided Salesforce Pardot source fields.
     */
    Pardot?: PardotConnectorOperator;
  }
  export type ConnectorOwner = string;
  export interface ConnectorProfile {
    /**
     *  The Amazon Resource Name (ARN) of the connector profile. 
     */
    connectorProfileArn?: ConnectorProfileArn;
    /**
     *  The name of the connector profile. The name is unique for each ConnectorProfile in the Amazon Web Services account. 
     */
    connectorProfileName?: ConnectorProfileName;
    /**
     *  The type of connector, such as Salesforce, Amplitude, and so on. 
     */
    connectorType?: ConnectorType;
    /**
     * The label for the connector profile being created.
     */
    connectorLabel?: ConnectorLabel;
    /**
     *  Indicates the connection mode and if it is public or private. 
     */
    connectionMode?: ConnectionMode;
    /**
     *  The Amazon Resource Name (ARN) of the connector profile credentials. 
     */
    credentialsArn?: ARN;
    /**
     *  The connector-specific properties of the profile configuration. 
     */
    connectorProfileProperties?: ConnectorProfileProperties;
    /**
     *  Specifies when the connector profile was created. 
     */
    createdAt?: _Date;
    /**
     *  Specifies when the connector profile was last updated. 
     */
    lastUpdatedAt?: _Date;
    /**
     *  Specifies the private connection provisioning state. 
     */
    privateConnectionProvisioningState?: PrivateConnectionProvisioningState;
  }
  export type ConnectorProfileArn = string;
  export interface ConnectorProfileConfig {
    /**
     *  The connector-specific properties of the profile configuration. 
     */
    connectorProfileProperties: ConnectorProfileProperties;
    /**
     *  The connector-specific credentials required by each connector. 
     */
    connectorProfileCredentials?: ConnectorProfileCredentials;
  }
  export interface ConnectorProfileCredentials {
    /**
     *  The connector-specific credentials required when using Amplitude. 
     */
    Amplitude?: AmplitudeConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Datadog. 
     */
    Datadog?: DatadogConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Dynatrace. 
     */
    Dynatrace?: DynatraceConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Google Analytics. 
     */
    GoogleAnalytics?: GoogleAnalyticsConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Amazon Honeycode. 
     */
    Honeycode?: HoneycodeConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Infor Nexus. 
     */
    InforNexus?: InforNexusConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Marketo. 
     */
    Marketo?: MarketoConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Amazon Redshift. 
     */
    Redshift?: RedshiftConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Salesforce. 
     */
    Salesforce?: SalesforceConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using ServiceNow. 
     */
    ServiceNow?: ServiceNowConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Singular. 
     */
    Singular?: SingularConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Slack. 
     */
    Slack?: SlackConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Snowflake. 
     */
    Snowflake?: SnowflakeConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Trend Micro. 
     */
    Trendmicro?: TrendmicroConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Veeva. 
     */
    Veeva?: VeevaConnectorProfileCredentials;
    /**
     *  The connector-specific credentials required when using Zendesk. 
     */
    Zendesk?: ZendeskConnectorProfileCredentials;
    SAPOData?: SAPODataConnectorProfileCredentials;
    CustomConnector?: CustomConnectorProfileCredentials;
    /**
     * The connector-specific credentials required when using Salesforce Pardot.
     */
    Pardot?: PardotConnectorProfileCredentials;
  }
  export type ConnectorProfileDetailList = ConnectorProfile[];
  export type ConnectorProfileName = string;
  export type ConnectorProfileNameList = ConnectorProfileName[];
  export interface ConnectorProfileProperties {
    /**
     *  The connector-specific properties required by Amplitude. 
     */
    Amplitude?: AmplitudeConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Datadog. 
     */
    Datadog?: DatadogConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Dynatrace. 
     */
    Dynatrace?: DynatraceConnectorProfileProperties;
    /**
     *  The connector-specific properties required Google Analytics. 
     */
    GoogleAnalytics?: GoogleAnalyticsConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Amazon Honeycode. 
     */
    Honeycode?: HoneycodeConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Infor Nexus. 
     */
    InforNexus?: InforNexusConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Marketo. 
     */
    Marketo?: MarketoConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Amazon Redshift. 
     */
    Redshift?: RedshiftConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Salesforce. 
     */
    Salesforce?: SalesforceConnectorProfileProperties;
    /**
     *  The connector-specific properties required by serviceNow. 
     */
    ServiceNow?: ServiceNowConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Singular. 
     */
    Singular?: SingularConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Slack. 
     */
    Slack?: SlackConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Snowflake. 
     */
    Snowflake?: SnowflakeConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Trend Micro. 
     */
    Trendmicro?: TrendmicroConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Veeva. 
     */
    Veeva?: VeevaConnectorProfileProperties;
    /**
     *  The connector-specific properties required by Zendesk. 
     */
    Zendesk?: ZendeskConnectorProfileProperties;
    SAPOData?: SAPODataConnectorProfileProperties;
    /**
     * The properties required by the custom connector.
     */
    CustomConnector?: CustomConnectorProfileProperties;
    /**
     * The connector-specific properties required by Salesforce Pardot.
     */
    Pardot?: PardotConnectorProfileProperties;
  }
  export interface ConnectorProvisioningConfig {
    /**
     * Contains information about the configuration of the lambda which is being registered as the connector.
     */
    lambda?: LambdaConnectorProvisioningConfig;
  }
  export type ConnectorProvisioningType = "LAMBDA"|string;
  export interface ConnectorRuntimeSetting {
    /**
     * Contains value information about the connector runtime setting.
     */
    key?: Key;
    /**
     * Data type of the connector runtime setting.
     */
    dataType?: ConnectorRuntimeSettingDataType;
    /**
     * Indicates whether this connector runtime setting is required.
     */
    isRequired?: Boolean;
    /**
     * A label used for connector runtime setting.
     */
    label?: Label;
    /**
     * A description about the connector runtime setting.
     */
    description?: Description;
    /**
     * Indicates the scope of the connector runtime setting.
     */
    scope?: ConnectorRuntimeSettingScope;
    /**
     * Contains default values for the connector runtime setting that are supplied by the connector.
     */
    connectorSuppliedValueOptions?: ConnectorSuppliedValueOptionList;
  }
  export type ConnectorRuntimeSettingDataType = string;
  export type ConnectorRuntimeSettingList = ConnectorRuntimeSetting[];
  export type ConnectorRuntimeSettingScope = string;
  export type ConnectorSuppliedValue = string;
  export type ConnectorSuppliedValueList = ConnectorSuppliedValue[];
  export type ConnectorSuppliedValueOptionList = ConnectorSuppliedValue[];
  export type ConnectorType = "Salesforce"|"Singular"|"Slack"|"Redshift"|"S3"|"Marketo"|"Googleanalytics"|"Zendesk"|"Servicenow"|"Datadog"|"Trendmicro"|"Snowflake"|"Dynatrace"|"Infornexus"|"Amplitude"|"Veeva"|"EventBridge"|"LookoutMetrics"|"Upsolver"|"Honeycode"|"CustomerProfiles"|"SAPOData"|"CustomConnector"|"Pardot"|string;
  export type ConnectorTypeList = ConnectorType[];
  export type ConnectorVersion = string;
  export interface CreateConnectorProfileRequest {
    /**
     *  The name of the connector profile. The name is unique for each ConnectorProfile in your Amazon Web Services account. 
     */
    connectorProfileName: ConnectorProfileName;
    /**
     *  The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption. This is required if you do not want to use the Amazon AppFlow-managed KMS key. If you don't provide anything here, Amazon AppFlow uses the Amazon AppFlow-managed KMS key. 
     */
    kmsArn?: KMSArn;
    /**
     *  The type of connector, such as Salesforce, Amplitude, and so on. 
     */
    connectorType: ConnectorType;
    /**
     * The label of the connector. The label is unique for each ConnectorRegistration in your Amazon Web Services account. Only needed if calling for CUSTOMCONNECTOR connector type/.
     */
    connectorLabel?: ConnectorLabel;
    /**
     *  Indicates the connection mode and specifies whether it is public or private. Private flows use Amazon Web Services PrivateLink to route data over Amazon Web Services infrastructure without exposing it to the public internet. 
     */
    connectionMode: ConnectionMode;
    /**
     *  Defines the connector-specific configuration and credentials. 
     */
    connectorProfileConfig: ConnectorProfileConfig;
    /**
     * The clientToken parameter is an idempotency token. It ensures that your CreateConnectorProfile request completes only once. You choose the value to pass. For example, if you don't receive a response from your request, you can safely retry the request with the same clientToken parameter value. If you omit a clientToken value, the Amazon Web Services SDK that you are using inserts a value for you. This way, the SDK can safely retry requests multiple times after a network error. You must provide your own value for other use cases. If you specify input parameters that differ from your first request, an error occurs. If you use a different value for clientToken, Amazon AppFlow considers it a new call to CreateConnectorProfile. The token is active for 8 hours.
     */
    clientToken?: ClientToken;
  }
  export interface CreateConnectorProfileResponse {
    /**
     *  The Amazon Resource Name (ARN) of the connector profile. 
     */
    connectorProfileArn?: ConnectorProfileArn;
  }
  export interface CreateFlowRequest {
    /**
     *  The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only. 
     */
    flowName: FlowName;
    /**
     *  A description of the flow you want to create. 
     */
    description?: FlowDescription;
    /**
     *  The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption. This is required if you do not want to use the Amazon AppFlow-managed KMS key. If you don't provide anything here, Amazon AppFlow uses the Amazon AppFlow-managed KMS key. 
     */
    kmsArn?: KMSArn;
    /**
     *  The trigger settings that determine how and when the flow runs. 
     */
    triggerConfig: TriggerConfig;
    /**
     *  The configuration that controls how Amazon AppFlow retrieves data from the source connector. 
     */
    sourceFlowConfig: SourceFlowConfig;
    /**
     *  The configuration that controls how Amazon AppFlow places data in the destination connector. 
     */
    destinationFlowConfigList: DestinationFlowConfigList;
    /**
     *  A list of tasks that Amazon AppFlow performs while transferring the data in the flow run. 
     */
    tasks: Tasks;
    /**
     *  The tags used to organize, track, or control access for your flow. 
     */
    tags?: TagMap;
    /**
     * Specifies the configuration that Amazon AppFlow uses when it catalogs the data that's transferred by the associated flow. When Amazon AppFlow catalogs the data from a flow, it stores metadata in a data catalog.
     */
    metadataCatalogConfig?: MetadataCatalogConfig;
    /**
     * The clientToken parameter is an idempotency token. It ensures that your CreateFlow request completes only once. You choose the value to pass. For example, if you don't receive a response from your request, you can safely retry the request with the same clientToken parameter value. If you omit a clientToken value, the Amazon Web Services SDK that you are using inserts a value for you. This way, the SDK can safely retry requests multiple times after a network error. You must provide your own value for other use cases. If you specify input parameters that differ from your first request, an error occurs. If you use a different value for clientToken, Amazon AppFlow considers it a new call to CreateFlow. The token is active for 8 hours.
     */
    clientToken?: ClientToken;
  }
  export interface CreateFlowResponse {
    /**
     *  The flow's Amazon Resource Name (ARN). 
     */
    flowArn?: FlowArn;
    /**
     *  Indicates the current status of the flow. 
     */
    flowStatus?: FlowStatus;
  }
  export type CreatedBy = string;
  export type CredentialsMap = {[key: string]: CredentialsMapValue};
  export type CredentialsMapKey = string;
  export type CredentialsMapValue = string;
  export interface CustomAuthConfig {
    /**
     * The authentication type that the custom connector uses.
     */
    customAuthenticationType?: CustomAuthenticationType;
    /**
     * Information about authentication parameters required for authentication.
     */
    authParameters?: AuthParameterList;
  }
  export type CustomAuthConfigList = CustomAuthConfig[];
  export interface CustomAuthCredentials {
    /**
     * The custom authentication type that the connector uses.
     */
    customAuthenticationType: CustomAuthenticationType;
    /**
     * A map that holds custom authentication credentials.
     */
    credentialsMap?: CredentialsMap;
  }
  export type CustomAuthenticationType = string;
  export interface CustomConnectorDestinationProperties {
    /**
     * The entity specified in the custom connector as a destination in the flow.
     */
    entityName: EntityName;
    /**
     * The settings that determine how Amazon AppFlow handles an error when placing data in the custom connector as destination.
     */
    errorHandlingConfig?: ErrorHandlingConfig;
    /**
     * Specifies the type of write operation to be performed in the custom connector when it's used as destination.
     */
    writeOperationType?: WriteOperationType;
    /**
     * The name of the field that Amazon AppFlow uses as an ID when performing a write operation such as update, delete, or upsert.
     */
    idFieldNames?: IdFieldNameList;
    /**
     * The custom properties that are specific to the connector when it's used as a destination in the flow.
     */
    customProperties?: CustomProperties;
  }
  export interface CustomConnectorProfileCredentials {
    /**
     * The authentication type that the custom connector uses for authenticating while creating a connector profile.
     */
    authenticationType: AuthenticationType;
    /**
     * The basic credentials that are required for the authentication of the user.
     */
    basic?: BasicAuthCredentials;
    /**
     * The OAuth 2.0 credentials required for the authentication of the user.
     */
    oauth2?: OAuth2Credentials;
    /**
     * The API keys required for the authentication of the user.
     */
    apiKey?: ApiKeyCredentials;
    /**
     * If the connector uses the custom authentication mechanism, this holds the required credentials.
     */
    custom?: CustomAuthCredentials;
  }
  export interface CustomConnectorProfileProperties {
    /**
     * A map of properties that are required to create a profile for the custom connector.
     */
    profileProperties?: ProfilePropertiesMap;
    oAuth2Properties?: OAuth2Properties;
  }
  export interface CustomConnectorSourceProperties {
    /**
     * The entity specified in the custom connector as a source in the flow.
     */
    entityName: EntityName;
    /**
     * Custom properties that are required to use the custom connector as a source.
     */
    customProperties?: CustomProperties;
    /**
     * The API of the connector application that Amazon AppFlow uses to transfer your data.
     */
    dataTransferApi?: DataTransferApi;
  }
  export type CustomProperties = {[key: string]: CustomPropertyValue};
  export type CustomPropertyKey = string;
  export type CustomPropertyValue = string;
  export interface CustomerProfilesDestinationProperties {
    /**
     *  The unique name of the Amazon Connect Customer Profiles domain. 
     */
    domainName: DomainName;
    /**
     *  The object specified in the Amazon Connect Customer Profiles flow destination. 
     */
    objectTypeName?: ObjectTypeName;
  }
  export interface CustomerProfilesMetadata {
  }
  export type DataApiRoleArn = string;
  export type DataPullMode = "Incremental"|"Complete"|string;
  export interface DataTransferApi {
    /**
     * The name of the connector application API.
     */
    Name?: DataTransferApiTypeName;
    /**
     * You can specify one of the following types:  AUTOMATIC  The default. Optimizes a flow for datasets that fluctuate in size from small to large. For each flow run, Amazon AppFlow chooses to use the SYNC or ASYNC API type based on the amount of data that the run transfers.  SYNC  A synchronous API. This type of API optimizes a flow for small to medium-sized datasets.  ASYNC  An asynchronous API. This type of API optimizes a flow for large datasets.  
     */
    Type?: DataTransferApiType;
  }
  export type DataTransferApiType = "SYNC"|"ASYNC"|"AUTOMATIC"|string;
  export type DataTransferApiTypeName = string;
  export type DatabaseName = string;
  export type DatabaseUrl = string;
  export type DatadogConnectorOperator = "PROJECTION"|"BETWEEN"|"EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface DatadogConnectorProfileCredentials {
    /**
     *  A unique alphanumeric identifier used to authenticate a user, developer, or calling program to your API. 
     */
    apiKey: ApiKey;
    /**
     *  Application keys, in conjunction with your API key, give you full access to Datadog’s programmatic API. Application keys are associated with the user account that created them. The application key is used to log all requests made to the API. 
     */
    applicationKey: ApplicationKey;
  }
  export interface DatadogConnectorProfileProperties {
    /**
     *  The location of the Datadog resource. 
     */
    instanceUrl: InstanceUrl;
  }
  export interface DatadogMetadata {
  }
  export interface DatadogSourceProperties {
    /**
     *  The object specified in the Datadog flow source. 
     */
    object: Object;
  }
  export type _Date = Date;
  export type DatetimeTypeFieldName = string;
  export interface DeleteConnectorProfileRequest {
    /**
     *  The name of the connector profile. The name is unique for each ConnectorProfile in your account. 
     */
    connectorProfileName: ConnectorProfileName;
    /**
     *  Indicates whether Amazon AppFlow should delete the profile, even if it is currently in use in one or more flows. 
     */
    forceDelete?: Boolean;
  }
  export interface DeleteConnectorProfileResponse {
  }
  export interface DeleteFlowRequest {
    /**
     *  The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only. 
     */
    flowName: FlowName;
    /**
     *  Indicates whether Amazon AppFlow should delete the flow, even if it is currently in use. 
     */
    forceDelete?: Boolean;
  }
  export interface DeleteFlowResponse {
  }
  export interface DescribeConnectorEntityRequest {
    /**
     *  The entity name for that connector. 
     */
    connectorEntityName: EntityName;
    /**
     *  The type of connector application, such as Salesforce, Amplitude, and so on. 
     */
    connectorType?: ConnectorType;
    /**
     *  The name of the connector profile. The name is unique for each ConnectorProfile in the Amazon Web Services account. 
     */
    connectorProfileName?: ConnectorProfileName;
    /**
     * The version of the API that's used by the connector.
     */
    apiVersion?: ApiVersion;
  }
  export interface DescribeConnectorEntityResponse {
    /**
     *  Describes the fields for that connector entity. For example, for an account entity, the fields would be account name, account ID, and so on. 
     */
    connectorEntityFields: ConnectorEntityFieldList;
  }
  export interface DescribeConnectorProfilesRequest {
    /**
     *  The name of the connector profile. The name is unique for each ConnectorProfile in the Amazon Web Services account. 
     */
    connectorProfileNames?: ConnectorProfileNameList;
    /**
     *  The type of connector, such as Salesforce, Amplitude, and so on. 
     */
    connectorType?: ConnectorType;
    /**
     * The name of the connector. The name is unique for each ConnectorRegistration in your Amazon Web Services account. Only needed if calling for CUSTOMCONNECTOR connector type/.
     */
    connectorLabel?: ConnectorLabel;
    /**
     *  Specifies the maximum number of items that should be returned in the result set. The default for maxResults is 20 (for all paginated API operations). 
     */
    maxResults?: MaxResults;
    /**
     *  The pagination token for the next page of data. 
     */
    nextToken?: NextToken;
  }
  export interface DescribeConnectorProfilesResponse {
    /**
     *  Returns information about the connector profiles associated with the flow. 
     */
    connectorProfileDetails?: ConnectorProfileDetailList;
    /**
     *  The pagination token for the next page of data. If nextToken=null, this means that all records have been fetched. 
     */
    nextToken?: NextToken;
  }
  export interface DescribeConnectorRequest {
    /**
     * The connector type, such as CUSTOMCONNECTOR, Saleforce, Marketo. Please choose CUSTOMCONNECTOR for Lambda based custom connectors.
     */
    connectorType: ConnectorType;
    /**
     * The label of the connector. The label is unique for each ConnectorRegistration in your Amazon Web Services account. Only needed if calling for CUSTOMCONNECTOR connector type/.
     */
    connectorLabel?: ConnectorLabel;
  }
  export interface DescribeConnectorResponse {
    /**
     * Configuration info of all the connectors that the user requested.
     */
    connectorConfiguration?: ConnectorConfiguration;
  }
  export interface DescribeConnectorsRequest {
    /**
     *  The type of connector, such as Salesforce, Amplitude, and so on. 
     */
    connectorTypes?: ConnectorTypeList;
    /**
     * The maximum number of items that should be returned in the result set. The default is 20.
     */
    maxResults?: MaxResults;
    /**
     *  The pagination token for the next page of data. 
     */
    nextToken?: NextToken;
  }
  export interface DescribeConnectorsResponse {
    /**
     *  The configuration that is applied to the connectors used in the flow. 
     */
    connectorConfigurations?: ConnectorConfigurationsMap;
    /**
     * Information about the connectors supported in Amazon AppFlow.
     */
    connectors?: ConnectorList;
    /**
     *  The pagination token for the next page of data. 
     */
    nextToken?: NextToken;
  }
  export interface DescribeFlowExecutionRecordsRequest {
    /**
     *  The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only. 
     */
    flowName: FlowName;
    /**
     *  Specifies the maximum number of items that should be returned in the result set. The default for maxResults is 20 (for all paginated API operations). 
     */
    maxResults?: MaxResults;
    /**
     *  The pagination token for the next page of data. 
     */
    nextToken?: NextToken;
  }
  export interface DescribeFlowExecutionRecordsResponse {
    /**
     *  Returns a list of all instances when this flow was run. 
     */
    flowExecutions?: FlowExecutionList;
    /**
     *  The pagination token for the next page of data. 
     */
    nextToken?: NextToken;
  }
  export interface DescribeFlowRequest {
    /**
     *  The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only. 
     */
    flowName: FlowName;
  }
  export interface DescribeFlowResponse {
    /**
     *  The flow's Amazon Resource Name (ARN). 
     */
    flowArn?: FlowArn;
    /**
     *  A description of the flow. 
     */
    description?: FlowDescription;
    /**
     *  The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only. 
     */
    flowName?: FlowName;
    /**
     *  The ARN (Amazon Resource Name) of the Key Management Service (KMS) key you provide for encryption. This is required if you do not want to use the Amazon AppFlow-managed KMS key. If you don't provide anything here, Amazon AppFlow uses the Amazon AppFlow-managed KMS key. 
     */
    kmsArn?: KMSArn;
    /**
     *  Indicates the current status of the flow. 
     */
    flowStatus?: FlowStatus;
    /**
     *  Contains an error message if the flow status is in a suspended or error state. This applies only to scheduled or event-triggered flows. 
     */
    flowStatusMessage?: FlowStatusMessage;
    /**
     *  The configuration that controls how Amazon AppFlow retrieves data from the source connector. 
     */
    sourceFlowConfig?: SourceFlowConfig;
    /**
     *  The configuration that controls how Amazon AppFlow transfers data to the destination connector. 
     */
    destinationFlowConfigList?: DestinationFlowConfigList;
    /**
     *  Describes the details of the most recent flow run. 
     */
    lastRunExecutionDetails?: ExecutionDetails;
    /**
     *  The trigger settings that determine how and when the flow runs. 
     */
    triggerConfig?: TriggerConfig;
    /**
     *  A list of tasks that Amazon AppFlow performs while transferring the data in the flow run. 
     */
    tasks?: Tasks;
    /**
     *  Specifies when the flow was created. 
     */
    createdAt?: _Date;
    /**
     *  Specifies when the flow was last updated. 
     */
    lastUpdatedAt?: _Date;
    /**
     *  The ARN of the user who created the flow. 
     */
    createdBy?: CreatedBy;
    /**
     *  Specifies the user name of the account that performed the most recent update. 
     */
    lastUpdatedBy?: UpdatedBy;
    /**
     *  The tags used to organize, track, or control access for your flow. 
     */
    tags?: TagMap;
    /**
     * Specifies the configuration that Amazon AppFlow uses when it catalogs the data that's transferred by the associated flow. When Amazon AppFlow catalogs the data from a flow, it stores metadata in a data catalog.
     */
    metadataCatalogConfig?: MetadataCatalogConfig;
    /**
     * Describes the metadata catalog, metadata table, and data partitions that Amazon AppFlow used for the associated flow run.
     */
    lastRunMetadataCatalogDetails?: MetadataCatalogDetails;
    /**
     * The version number of your data schema. Amazon AppFlow assigns this version number. The version number increases by one when you change any of the following settings in your flow configuration:   Source-to-destination field mappings   Field data types   Partition keys  
     */
    schemaVersion?: Long;
  }
  export type Description = string;
  export interface DestinationConnectorProperties {
    /**
     *  The properties required to query Amazon Redshift. 
     */
    Redshift?: RedshiftDestinationProperties;
    /**
     *  The properties required to query Amazon S3. 
     */
    S3?: S3DestinationProperties;
    /**
     *  The properties required to query Salesforce. 
     */
    Salesforce?: SalesforceDestinationProperties;
    /**
     *  The properties required to query Snowflake. 
     */
    Snowflake?: SnowflakeDestinationProperties;
    /**
     *  The properties required to query Amazon EventBridge. 
     */
    EventBridge?: EventBridgeDestinationProperties;
    /**
     *  The properties required to query Amazon Lookout for Metrics. 
     */
    LookoutMetrics?: LookoutMetricsDestinationProperties;
    /**
     *  The properties required to query Upsolver. 
     */
    Upsolver?: UpsolverDestinationProperties;
    /**
     *  The properties required to query Amazon Honeycode. 
     */
    Honeycode?: HoneycodeDestinationProperties;
    /**
     *  The properties required to query Amazon Connect Customer Profiles. 
     */
    CustomerProfiles?: CustomerProfilesDestinationProperties;
    /**
     * The properties required to query Zendesk.
     */
    Zendesk?: ZendeskDestinationProperties;
    /**
     * The properties required to query Marketo.
     */
    Marketo?: MarketoDestinationProperties;
    /**
     * The properties that are required to query the custom Connector.
     */
    CustomConnector?: CustomConnectorDestinationProperties;
    /**
     * The properties required to query SAPOData.
     */
    SAPOData?: SAPODataDestinationProperties;
  }
  export type DestinationField = string;
  export interface DestinationFieldProperties {
    /**
     *  Specifies if the destination field can be created by the current user. 
     */
    isCreatable?: Boolean;
    /**
     *  Specifies if the destination field can have a null value. 
     */
    isNullable?: Boolean;
    /**
     *  Specifies if the flow run can either insert new rows in the destination field if they do not already exist, or update them if they do. 
     */
    isUpsertable?: Boolean;
    /**
     *  Specifies whether the field can be updated during an UPDATE or UPSERT write operation. 
     */
    isUpdatable?: Boolean;
    /**
     * Specifies whether the field can use the default value during a Create operation.
     */
    isDefaultedOnCreate?: Boolean;
    /**
     *  A list of supported write operations. For each write operation listed, this field can be used in idFieldNames when that write operation is present as a destination option. 
     */
    supportedWriteOperations?: SupportedWriteOperationList;
  }
  export interface DestinationFlowConfig {
    /**
     *  The type of connector, such as Salesforce, Amplitude, and so on. 
     */
    connectorType: ConnectorType;
    /**
     * The API version that the destination connector uses.
     */
    apiVersion?: ApiVersion;
    /**
     *  The name of the connector profile. This name must be unique for each connector profile in the Amazon Web Services account. 
     */
    connectorProfileName?: ConnectorProfileName;
    /**
     *  This stores the information that is required to query a particular connector. 
     */
    destinationConnectorProperties: DestinationConnectorProperties;
  }
  export type DestinationFlowConfigList = DestinationFlowConfig[];
  export type DocumentType = string;
  export type DomainName = string;
  export type Double = number;
  export type DynatraceConnectorOperator = "PROJECTION"|"BETWEEN"|"EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface DynatraceConnectorProfileCredentials {
    /**
     *  The API tokens used by Dynatrace API to authenticate various API calls. 
     */
    apiToken: ApiToken;
  }
  export interface DynatraceConnectorProfileProperties {
    /**
     *  The location of the Dynatrace resource. 
     */
    instanceUrl: InstanceUrl;
  }
  export interface DynatraceMetadata {
  }
  export interface DynatraceSourceProperties {
    /**
     *  The object specified in the Dynatrace flow source. 
     */
    object: Object;
  }
  export type EntitiesPath = string;
  export type EntityName = string;
  export interface ErrorHandlingConfig {
    /**
     *  Specifies if the flow should fail after the first instance of a failure when attempting to place data in the destination. 
     */
    failOnFirstDestinationError?: Boolean;
    /**
     *  Specifies the Amazon S3 bucket prefix. 
     */
    bucketPrefix?: BucketPrefix;
    /**
     *  Specifies the name of the Amazon S3 bucket. 
     */
    bucketName?: BucketName;
  }
  export interface ErrorInfo {
    /**
     *  Specifies the failure count for the attempted flow. 
     */
    putFailuresCount?: Long;
    /**
     *  Specifies the error message that appears if a flow fails. 
     */
    executionMessage?: ExecutionMessage;
  }
  export interface EventBridgeDestinationProperties {
    /**
     *  The object specified in the Amazon EventBridge flow destination. 
     */
    object: Object;
    errorHandlingConfig?: ErrorHandlingConfig;
  }
  export interface EventBridgeMetadata {
  }
  export interface ExecutionDetails {
    /**
     *  Describes the details of the most recent flow run. 
     */
    mostRecentExecutionMessage?: MostRecentExecutionMessage;
    /**
     *  Specifies the time of the most recent flow run. 
     */
    mostRecentExecutionTime?: _Date;
    /**
     *  Specifies the status of the most recent flow run. 
     */
    mostRecentExecutionStatus?: ExecutionStatus;
  }
  export type ExecutionId = string;
  export type ExecutionIds = ExecutionId[];
  export type ExecutionMessage = string;
  export interface ExecutionRecord {
    /**
     *  Specifies the identifier of the given flow run. 
     */
    executionId?: ExecutionId;
    /**
     *  Specifies the flow run status and whether it is in progress, has completed successfully, or has failed. 
     */
    executionStatus?: ExecutionStatus;
    /**
     *  Describes the result of the given flow run. 
     */
    executionResult?: ExecutionResult;
    /**
     *  Specifies the start time of the flow run. 
     */
    startedAt?: _Date;
    /**
     *  Specifies the time of the most recent update. 
     */
    lastUpdatedAt?: _Date;
    /**
     *  The timestamp that determines the first new or updated record to be transferred in the flow run. 
     */
    dataPullStartTime?: _Date;
    /**
     *  The timestamp that indicates the last new or updated record to be transferred in the flow run. 
     */
    dataPullEndTime?: _Date;
    /**
     * Describes the metadata catalog, metadata table, and data partitions that Amazon AppFlow used for the associated flow run.
     */
    metadataCatalogDetails?: MetadataCatalogDetails;
  }
  export interface ExecutionResult {
    /**
     *  Provides any error message information related to the flow run. 
     */
    errorInfo?: ErrorInfo;
    /**
     *  The total number of bytes processed by the flow run. 
     */
    bytesProcessed?: Long;
    /**
     *  The total number of bytes written as a result of the flow run. 
     */
    bytesWritten?: Long;
    /**
     *  The number of records processed in the flow run. 
     */
    recordsProcessed?: Long;
    /**
     * The number of processes that Amazon AppFlow ran at the same time when it retrieved your data.
     */
    numParallelProcesses?: Long;
    /**
     * The maximum number of records that Amazon AppFlow receives in each page of the response from your SAP application.
     */
    maxPageSize?: Long;
  }
  export type ExecutionStatus = "InProgress"|"Successful"|"Error"|"CancelStarted"|"Canceled"|string;
  export type FieldType = string;
  export interface FieldTypeDetails {
    /**
     *  The type of field, such as string, integer, date, and so on. 
     */
    fieldType: FieldType;
    /**
     *  The list of operators supported by a field. 
     */
    filterOperators: FilterOperatorList;
    /**
     *  The list of values that a field can contain. For example, a Boolean fieldType can have two values: "true" and "false". 
     */
    supportedValues?: SupportedValueList;
    /**
     * The regular expression pattern for the field name.
     */
    valueRegexPattern?: String;
    /**
     * The date format that the field supports.
     */
    supportedDateFormat?: String;
    /**
     * The range of values this field can hold.
     */
    fieldValueRange?: Range;
    /**
     * This is the allowable length range for this field's value.
     */
    fieldLengthRange?: Range;
  }
  export type FileType = "CSV"|"JSON"|"PARQUET"|string;
  export type FilterOperatorList = Operator[];
  export type FlowArn = string;
  export interface FlowDefinition {
    /**
     *  The flow's Amazon Resource Name (ARN). 
     */
    flowArn?: FlowArn;
    /**
     *  A user-entered description of the flow. 
     */
    description?: FlowDescription;
    /**
     *  The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only. 
     */
    flowName?: FlowName;
    /**
     *  Indicates the current status of the flow. 
     */
    flowStatus?: FlowStatus;
    /**
     *  Specifies the source connector type, such as Salesforce, Amazon S3, Amplitude, and so on. 
     */
    sourceConnectorType?: ConnectorType;
    /**
     * The label of the source connector in the flow.
     */
    sourceConnectorLabel?: ConnectorLabel;
    /**
     *  Specifies the destination connector type, such as Salesforce, Amazon S3, Amplitude, and so on. 
     */
    destinationConnectorType?: ConnectorType;
    /**
     * The label of the destination connector in the flow.
     */
    destinationConnectorLabel?: ConnectorLabel;
    /**
     *  Specifies the type of flow trigger. This can be OnDemand, Scheduled, or Event. 
     */
    triggerType?: TriggerType;
    /**
     *  Specifies when the flow was created. 
     */
    createdAt?: _Date;
    /**
     *  Specifies when the flow was last updated. 
     */
    lastUpdatedAt?: _Date;
    /**
     *  The ARN of the user who created the flow. 
     */
    createdBy?: CreatedBy;
    /**
     *  Specifies the account user name that most recently updated the flow. 
     */
    lastUpdatedBy?: UpdatedBy;
    /**
     *  The tags used to organize, track, or control access for your flow. 
     */
    tags?: TagMap;
    /**
     *  Describes the details of the most recent flow run. 
     */
    lastRunExecutionDetails?: ExecutionDetails;
  }
  export type FlowDescription = string;
  export type FlowErrorDeactivationThreshold = number;
  export type FlowExecutionList = ExecutionRecord[];
  export type FlowList = FlowDefinition[];
  export type FlowName = string;
  export type FlowStatus = "Active"|"Deprecated"|"Deleted"|"Draft"|"Errored"|"Suspended"|string;
  export type FlowStatusMessage = string;
  export interface GlueDataCatalogConfig {
    /**
     * The Amazon Resource Name (ARN) of an IAM role that grants Amazon AppFlow the permissions it needs to create Data Catalog tables, databases, and partitions. For an example IAM policy that has the required permissions, see Identity-based policy examples for Amazon AppFlow.
     */
    roleArn: GlueDataCatalogIAMRole;
    /**
     * The name of the Data Catalog database that stores the metadata tables that Amazon AppFlow creates in your Amazon Web Services account. These tables contain metadata for the data that's transferred by the flow that you configure with this parameter.  When you configure a new flow with this parameter, you must specify an existing database. 
     */
    databaseName: GlueDataCatalogDatabaseName;
    /**
     * A naming prefix for each Data Catalog table that Amazon AppFlow creates for the flow that you configure with this setting. Amazon AppFlow adds the prefix to the beginning of the each table name.
     */
    tablePrefix: GlueDataCatalogTablePrefix;
  }
  export type GlueDataCatalogDatabaseName = string;
  export type GlueDataCatalogIAMRole = string;
  export type GlueDataCatalogTablePrefix = string;
  export type GoogleAnalyticsConnectorOperator = "PROJECTION"|"BETWEEN"|string;
  export interface GoogleAnalyticsConnectorProfileCredentials {
    /**
     *  The identifier for the desired client. 
     */
    clientId: ClientId;
    /**
     *  The client secret used by the OAuth client to authenticate to the authorization server. 
     */
    clientSecret: ClientSecret;
    /**
     *  The credentials used to access protected Google Analytics resources. 
     */
    accessToken?: AccessToken;
    /**
     *  The credentials used to acquire new access tokens. This is required only for OAuth2 access tokens, and is not required for OAuth1 access tokens. 
     */
    refreshToken?: RefreshToken;
    /**
     *  The OAuth requirement needed to request security tokens from the connector endpoint. 
     */
    oAuthRequest?: ConnectorOAuthRequest;
  }
  export interface GoogleAnalyticsConnectorProfileProperties {
  }
  export interface GoogleAnalyticsMetadata {
    /**
     *  The desired authorization scope for the Google Analytics account. 
     */
    oAuthScopes?: OAuthScopeList;
  }
  export interface GoogleAnalyticsSourceProperties {
    /**
     *  The object specified in the Google Analytics flow source. 
     */
    object: Object;
  }
  export type Group = string;
  export interface HoneycodeConnectorProfileCredentials {
    /**
     *  The credentials used to access protected Amazon Honeycode resources. 
     */
    accessToken?: AccessToken;
    /**
     *  The credentials used to acquire new access tokens. 
     */
    refreshToken?: RefreshToken;
    oAuthRequest?: ConnectorOAuthRequest;
  }
  export interface HoneycodeConnectorProfileProperties {
  }
  export interface HoneycodeDestinationProperties {
    /**
     *  The object specified in the Amazon Honeycode flow destination. 
     */
    object: Object;
    errorHandlingConfig?: ErrorHandlingConfig;
  }
  export interface HoneycodeMetadata {
    /**
     *  The desired authorization scope for the Amazon Honeycode account. 
     */
    oAuthScopes?: OAuthScopeList;
  }
  export type IdFieldNameList = Name[];
  export type Identifier = string;
  export interface IncrementalPullConfig {
    /**
     *  A field that specifies the date time or timestamp field as the criteria to use when importing incremental records from the source. 
     */
    datetimeTypeFieldName?: DatetimeTypeFieldName;
  }
  export type InforNexusConnectorOperator = "PROJECTION"|"BETWEEN"|"EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface InforNexusConnectorProfileCredentials {
    /**
     *  The Access Key portion of the credentials. 
     */
    accessKeyId: AccessKeyId;
    /**
     *  The identifier for the user. 
     */
    userId: Username;
    /**
     *  The secret key used to sign requests. 
     */
    secretAccessKey: Key;
    /**
     *  The encryption keys used to encrypt data. 
     */
    datakey: Key;
  }
  export interface InforNexusConnectorProfileProperties {
    /**
     *  The location of the Infor Nexus resource. 
     */
    instanceUrl: InstanceUrl;
  }
  export interface InforNexusMetadata {
  }
  export interface InforNexusSourceProperties {
    /**
     *  The object specified in the Infor Nexus flow source. 
     */
    object: Object;
  }
  export type InstanceUrl = string;
  export type JavaBoolean = boolean;
  export type JwtToken = string;
  export type KMSArn = string;
  export type Key = string;
  export type Label = string;
  export interface LambdaConnectorProvisioningConfig {
    /**
     * Lambda ARN of the connector being registered.
     */
    lambdaArn: ARN;
  }
  export interface ListConnectorEntitiesRequest {
    /**
     *  The name of the connector profile. The name is unique for each ConnectorProfile in the Amazon Web Services account, and is used to query the downstream connector. 
     */
    connectorProfileName?: ConnectorProfileName;
    /**
     *  The type of connector, such as Salesforce, Amplitude, and so on. 
     */
    connectorType?: ConnectorType;
    /**
     *  This optional parameter is specific to connector implementation. Some connectors support multiple levels or categories of entities. You can find out the list of roots for such providers by sending a request without the entitiesPath parameter. If the connector supports entities at different roots, this initial request returns the list of roots. Otherwise, this request returns all entities supported by the provider. 
     */
    entitiesPath?: EntitiesPath;
    /**
     * The version of the API that's used by the connector.
     */
    apiVersion?: ApiVersion;
    /**
     * The maximum number of items that the operation returns in the response.
     */
    maxResults?: ListEntitiesMaxResults;
    /**
     * A token that was provided by your prior ListConnectorEntities operation if the response was too big for the page size. You specify this token to get the next page of results in paginated response.
     */
    nextToken?: NextToken;
  }
  export interface ListConnectorEntitiesResponse {
    /**
     *  The response of ListConnectorEntities lists entities grouped by category. This map's key represents the group name, and its value contains the list of entities belonging to that group. 
     */
    connectorEntityMap: ConnectorEntityMap;
    /**
     * A token that you specify in your next ListConnectorEntities operation to get the next page of results in paginated response. The ListConnectorEntities operation provides this token if the response is too big for the page size.
     */
    nextToken?: NextToken;
  }
  export interface ListConnectorsRequest {
    /**
     * Specifies the maximum number of items that should be returned in the result set. The default for maxResults is 20 (for all paginated API operations).
     */
    maxResults?: MaxResults;
    /**
     * The pagination token for the next page of data.
     */
    nextToken?: NextToken;
  }
  export interface ListConnectorsResponse {
    /**
     * Contains information about the connectors supported by Amazon AppFlow.
     */
    connectors?: ConnectorList;
    /**
     * The pagination token for the next page of data. If nextToken=null, this means that all records have been fetched.
     */
    nextToken?: NextToken;
  }
  export type ListEntitiesMaxResults = number;
  export interface ListFlowsRequest {
    /**
     *  Specifies the maximum number of items that should be returned in the result set. 
     */
    maxResults?: MaxResults;
    /**
     *  The pagination token for next page of data. 
     */
    nextToken?: NextToken;
  }
  export interface ListFlowsResponse {
    /**
     *  The list of flows associated with your account. 
     */
    flows?: FlowList;
    /**
     *  The pagination token for next page of data. 
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the specified flow. 
     */
    resourceArn: ARN;
  }
  export interface ListTagsForResourceResponse {
    /**
     *  The tags used to organize, track, or control access for your flow. 
     */
    tags?: TagMap;
  }
  export type LogoURL = string;
  export type LogonLanguage = string;
  export type Long = number;
  export interface LookoutMetricsDestinationProperties {
  }
  export type MarketoConnectorOperator = "PROJECTION"|"LESS_THAN"|"GREATER_THAN"|"BETWEEN"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface MarketoConnectorProfileCredentials {
    /**
     *  The identifier for the desired client. 
     */
    clientId: ClientId;
    /**
     *  The client secret used by the OAuth client to authenticate to the authorization server. 
     */
    clientSecret: ClientSecret;
    /**
     *  The credentials used to access protected Marketo resources. 
     */
    accessToken?: AccessToken;
    /**
     *  The OAuth requirement needed to request security tokens from the connector endpoint. 
     */
    oAuthRequest?: ConnectorOAuthRequest;
  }
  export interface MarketoConnectorProfileProperties {
    /**
     *  The location of the Marketo resource. 
     */
    instanceUrl: InstanceUrl;
  }
  export interface MarketoDestinationProperties {
    /**
     * The object specified in the Marketo flow destination.
     */
    object: Object;
    errorHandlingConfig?: ErrorHandlingConfig;
  }
  export interface MarketoMetadata {
  }
  export interface MarketoSourceProperties {
    /**
     *  The object specified in the Marketo flow source. 
     */
    object: Object;
  }
  export type MaxResults = number;
  export interface MetadataCatalogConfig {
    /**
     * Specifies the configuration that Amazon AppFlow uses when it catalogs your data with the Glue Data Catalog.
     */
    glueDataCatalog?: GlueDataCatalogConfig;
  }
  export interface MetadataCatalogDetail {
    /**
     * The type of metadata catalog that Amazon AppFlow used for the associated flow run. This parameter returns the following value:  GLUE  The metadata catalog is provided by the Glue Data Catalog. Glue includes the Glue Data Catalog as a component.  
     */
    catalogType?: CatalogType;
    /**
     * The name of the table that stores the metadata for the associated flow run. The table stores metadata that represents the data that the flow transferred. Amazon AppFlow stores the table in the metadata catalog.
     */
    tableName?: String;
    /**
     * Describes the status of the attempt from Amazon AppFlow to register the metadata table with the metadata catalog. Amazon AppFlow creates or updates this table for the associated flow run.
     */
    tableRegistrationOutput?: RegistrationOutput;
    /**
     * Describes the status of the attempt from Amazon AppFlow to register the data partitions with the metadata catalog. The data partitions organize the flow output into a hierarchical path, such as a folder path in an S3 bucket. Amazon AppFlow creates the partitions (if they don't already exist) based on your flow configuration.
     */
    partitionRegistrationOutput?: RegistrationOutput;
  }
  export type MetadataCatalogDetails = MetadataCatalogDetail[];
  export type MostRecentExecutionMessage = string;
  export type Name = string;
  export type NextToken = string;
  export interface OAuth2Credentials {
    /**
     * The identifier for the desired client.
     */
    clientId?: ClientId;
    /**
     * The client secret used by the OAuth client to authenticate to the authorization server.
     */
    clientSecret?: ClientSecret;
    /**
     * The access token used to access the connector on your behalf.
     */
    accessToken?: AccessToken;
    /**
     * The refresh token used to refresh an expired access token.
     */
    refreshToken?: RefreshToken;
    oAuthRequest?: ConnectorOAuthRequest;
  }
  export interface OAuth2CustomParameter {
    /**
     * The key of the custom parameter required for OAuth 2.0 authentication.
     */
    key?: Key;
    /**
     * Indicates whether the custom parameter for OAuth 2.0 authentication is required.
     */
    isRequired?: Boolean;
    /**
     * The label of the custom parameter used for OAuth 2.0 authentication.
     */
    label?: Label;
    /**
     * A description about the custom parameter used for OAuth 2.0 authentication.
     */
    description?: Description;
    /**
     * Indicates whether this authentication custom parameter is a sensitive field.
     */
    isSensitiveField?: Boolean;
    /**
     * Contains default values for this authentication parameter that are supplied by the connector.
     */
    connectorSuppliedValues?: ConnectorSuppliedValueList;
    /**
     * Indicates whether custom parameter is used with TokenUrl or AuthUrl.
     */
    type?: OAuth2CustomPropType;
  }
  export type OAuth2CustomPropType = "TOKEN_URL"|"AUTH_URL"|string;
  export type OAuth2CustomPropertiesList = OAuth2CustomParameter[];
  export interface OAuth2Defaults {
    /**
     * OAuth 2.0 scopes that the connector supports.
     */
    oauthScopes?: OAuthScopeList;
    /**
     * Token URLs that can be used for OAuth 2.0 authentication.
     */
    tokenUrls?: TokenUrlList;
    /**
     * Auth code URLs that can be used for OAuth 2.0 authentication.
     */
    authCodeUrls?: AuthCodeUrlList;
    /**
     * OAuth 2.0 grant types supported by the connector.
     */
    oauth2GrantTypesSupported?: OAuth2GrantTypeSupportedList;
    /**
     * List of custom parameters required for OAuth 2.0 authentication.
     */
    oauth2CustomProperties?: OAuth2CustomPropertiesList;
  }
  export type OAuth2GrantType = "CLIENT_CREDENTIALS"|"AUTHORIZATION_CODE"|"JWT_BEARER"|string;
  export type OAuth2GrantTypeSupportedList = OAuth2GrantType[];
  export interface OAuth2Properties {
    /**
     * The token URL required for OAuth 2.0 authentication.
     */
    tokenUrl: TokenUrl;
    /**
     * The OAuth 2.0 grant type used by connector for OAuth 2.0 authentication.
     */
    oAuth2GrantType: OAuth2GrantType;
    /**
     * Associates your token URL with a map of properties that you define. Use this parameter to provide any additional details that the connector requires to authenticate your request.
     */
    tokenUrlCustomProperties?: TokenUrlCustomProperties;
  }
  export interface OAuthCredentials {
    /**
     *  The identifier for the desired client. 
     */
    clientId: ClientId;
    /**
     *  The client secret used by the OAuth client to authenticate to the authorization server. 
     */
    clientSecret: ClientSecret;
    /**
     *  The access token used to access protected SAPOData resources. 
     */
    accessToken?: AccessToken;
    /**
     *  The refresh token used to refresh expired access token. 
     */
    refreshToken?: RefreshToken;
    /**
     *  The OAuth requirement needed to request security tokens from the connector endpoint. 
     */
    oAuthRequest?: ConnectorOAuthRequest;
  }
  export interface OAuthProperties {
    /**
     *  The token url required to fetch access/refresh tokens using authorization code and also to refresh expired access token using refresh token.
     */
    tokenUrl: TokenUrl;
    /**
     *  The authorization code url required to redirect to SAP Login Page to fetch authorization code for OAuth type authentication. 
     */
    authCodeUrl: AuthCodeUrl;
    /**
     *  The OAuth scopes required for OAuth type authentication. 
     */
    oAuthScopes: OAuthScopeList;
  }
  export type OAuthScope = string;
  export type OAuthScopeList = OAuthScope[];
  export type Object = string;
  export type ObjectTypeName = string;
  export type Operator = "PROJECTION"|"LESS_THAN"|"GREATER_THAN"|"CONTAINS"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export type OperatorPropertiesKeys = "VALUE"|"VALUES"|"DATA_TYPE"|"UPPER_BOUND"|"LOWER_BOUND"|"SOURCE_DATA_TYPE"|"DESTINATION_DATA_TYPE"|"VALIDATION_ACTION"|"MASK_VALUE"|"MASK_LENGTH"|"TRUNCATE_LENGTH"|"MATH_OPERATION_FIELDS_ORDER"|"CONCAT_FORMAT"|"SUBFIELD_CATEGORY_MAP"|"EXCLUDE_SOURCE_FIELDS_LIST"|"INCLUDE_NEW_FIELDS"|"ORDERED_PARTITION_KEYS_LIST"|string;
  export type Operators = "PROJECTION"|"LESS_THAN"|"GREATER_THAN"|"CONTAINS"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export type PardotConnectorOperator = "PROJECTION"|"EQUAL_TO"|"NO_OP"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|string;
  export interface PardotConnectorProfileCredentials {
    /**
     * The credentials used to access protected Salesforce Pardot resources.
     */
    accessToken?: AccessToken;
    /**
     * The credentials used to acquire new access tokens.
     */
    refreshToken?: RefreshToken;
    oAuthRequest?: ConnectorOAuthRequest;
    /**
     * The secret manager ARN, which contains the client ID and client secret of the connected app.
     */
    clientCredentialsArn?: ClientCredentialsArn;
  }
  export interface PardotConnectorProfileProperties {
    /**
     * The location of the Salesforce Pardot resource.
     */
    instanceUrl?: InstanceUrl;
    /**
     * Indicates whether the connector profile applies to a sandbox or production environment.
     */
    isSandboxEnvironment?: Boolean;
    /**
     * The business unit id of Salesforce Pardot instance.
     */
    businessUnitId?: BusinessUnitId;
  }
  export interface PardotMetadata {
  }
  export interface PardotSourceProperties {
    /**
     * The object specified in the Salesforce Pardot flow source.
     */
    object: Object;
  }
  export type Password = string;
  export type PathPrefix = "EXECUTION_ID"|"SCHEMA_VERSION"|string;
  export type PathPrefixHierarchy = PathPrefix[];
  export type PortNumber = number;
  export interface PrefixConfig {
    /**
     * Determines the format of the prefix, and whether it applies to the file name, file path, or both. 
     */
    prefixType?: PrefixType;
    /**
     * Determines the level of granularity for the date and time that's included in the prefix. 
     */
    prefixFormat?: PrefixFormat;
    /**
     * Specifies whether the destination file path includes either or both of the following elements:  EXECUTION_ID  The ID that Amazon AppFlow assigns to the flow run.  SCHEMA_VERSION  The version number of your data schema. Amazon AppFlow assigns this version number. The version number increases by one when you change any of the following settings in your flow configuration:   Source-to-destination field mappings   Field data types   Partition keys    
     */
    pathPrefixHierarchy?: PathPrefixHierarchy;
  }
  export type PrefixFormat = "YEAR"|"MONTH"|"DAY"|"HOUR"|"MINUTE"|string;
  export type PrefixType = "FILENAME"|"PATH"|"PATH_AND_FILENAME"|string;
  export type PrivateConnectionProvisioningFailureCause = "CONNECTOR_AUTHENTICATION"|"CONNECTOR_SERVER"|"INTERNAL_SERVER"|"ACCESS_DENIED"|"VALIDATION"|string;
  export type PrivateConnectionProvisioningFailureMessage = string;
  export interface PrivateConnectionProvisioningState {
    /**
     *  Specifies the private connection provisioning status. 
     */
    status?: PrivateConnectionProvisioningStatus;
    /**
     *  Specifies the private connection provisioning failure reason. 
     */
    failureMessage?: PrivateConnectionProvisioningFailureMessage;
    /**
     *  Specifies the private connection provisioning failure cause. 
     */
    failureCause?: PrivateConnectionProvisioningFailureCause;
  }
  export type PrivateConnectionProvisioningStatus = "FAILED"|"PENDING"|"CREATED"|string;
  export type PrivateLinkServiceName = string;
  export type ProfilePropertiesMap = {[key: string]: ProfilePropertyValue};
  export type ProfilePropertyKey = string;
  export type ProfilePropertyValue = string;
  export type Property = string;
  export interface Range {
    /**
     * Maximum value supported by the field.
     */
    maximum?: Double;
    /**
     * Minimum value supported by the field.
     */
    minimum?: Double;
  }
  export type RedirectUri = string;
  export interface RedshiftConnectorProfileCredentials {
    /**
     *  The name of the user. 
     */
    username?: String;
    /**
     *  The password that corresponds to the user name. 
     */
    password?: Password;
  }
  export interface RedshiftConnectorProfileProperties {
    /**
     *  The JDBC URL of the Amazon Redshift cluster. 
     */
    databaseUrl?: DatabaseUrl;
    /**
     *  A name for the associated Amazon S3 bucket. 
     */
    bucketName: BucketName;
    /**
     *  The object key for the destination bucket in which Amazon AppFlow places the files. 
     */
    bucketPrefix?: BucketPrefix;
    /**
     *  The Amazon Resource Name (ARN) of IAM role that grants Amazon Redshift read-only access to Amazon S3. For more information, and for the polices that you attach to this role, see Allow Amazon Redshift to access your Amazon AppFlow data in Amazon S3.
     */
    roleArn: RoleArn;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that permits Amazon AppFlow to access your Amazon Redshift database through the Data API. For more information, and for the polices that you attach to this role, see Allow Amazon AppFlow to access Amazon Redshift databases with the Data API.
     */
    dataApiRoleArn?: DataApiRoleArn;
    /**
     * Indicates whether the connector profile defines a connection to an Amazon Redshift Serverless data warehouse.
     */
    isRedshiftServerless?: Boolean;
    /**
     * The unique ID that's assigned to an Amazon Redshift cluster.
     */
    clusterIdentifier?: ClusterIdentifier;
    /**
     * The name of an Amazon Redshift workgroup.
     */
    workgroupName?: WorkgroupName;
    /**
     * The name of an Amazon Redshift database.
     */
    databaseName?: DatabaseName;
  }
  export interface RedshiftDestinationProperties {
    /**
     *  The object specified in the Amazon Redshift flow destination. 
     */
    object: Object;
    /**
     *  The intermediate bucket that Amazon AppFlow uses when moving data into Amazon Redshift. 
     */
    intermediateBucketName: BucketName;
    /**
     *  The object key for the bucket in which Amazon AppFlow places the destination files. 
     */
    bucketPrefix?: BucketPrefix;
    /**
     *  The settings that determine how Amazon AppFlow handles an error when placing data in the Amazon Redshift destination. For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. ErrorHandlingConfig is a part of the destination connector details. 
     */
    errorHandlingConfig?: ErrorHandlingConfig;
  }
  export interface RedshiftMetadata {
  }
  export type RefreshToken = string;
  export type Region = string;
  export type RegionList = Region[];
  export interface RegisterConnectorRequest {
    /**
     *  The name of the connector. The name is unique for each ConnectorRegistration in your Amazon Web Services account.
     */
    connectorLabel?: ConnectorLabel;
    /**
     * A description about the connector that's being registered.
     */
    description?: Description;
    /**
     * The provisioning type of the connector. Currently the only supported value is LAMBDA. 
     */
    connectorProvisioningType?: ConnectorProvisioningType;
    /**
     * The provisioning type of the connector. Currently the only supported value is LAMBDA.
     */
    connectorProvisioningConfig?: ConnectorProvisioningConfig;
    /**
     * The clientToken parameter is an idempotency token. It ensures that your RegisterConnector request completes only once. You choose the value to pass. For example, if you don't receive a response from your request, you can safely retry the request with the same clientToken parameter value. If you omit a clientToken value, the Amazon Web Services SDK that you are using inserts a value for you. This way, the SDK can safely retry requests multiple times after a network error. You must provide your own value for other use cases. If you specify input parameters that differ from your first request, an error occurs. If you use a different value for clientToken, Amazon AppFlow considers it a new call to RegisterConnector. The token is active for 8 hours.
     */
    clientToken?: ClientToken;
  }
  export interface RegisterConnectorResponse {
    /**
     * The ARN of the connector being registered.
     */
    connectorArn?: ARN;
  }
  export type RegisteredBy = string;
  export interface RegistrationOutput {
    /**
     * Explains the status of the registration attempt from Amazon AppFlow. If the attempt fails, the message explains why.
     */
    message?: String;
    /**
     * Indicates the number of resources that Amazon AppFlow created or updated. Possible resources include metadata tables and data partitions.
     */
    result?: String;
    /**
     * Indicates the status of the registration attempt from Amazon AppFlow.
     */
    status?: ExecutionStatus;
  }
  export interface ResetConnectorMetadataCacheRequest {
    /**
     * The name of the connector profile that you want to reset cached metadata for. You can omit this parameter if you're resetting the cache for any of the following connectors: Amazon Connect, Amazon EventBridge, Amazon Lookout for Metrics, Amazon S3, or Upsolver. If you're resetting the cache for any other connector, you must include this parameter in your request.
     */
    connectorProfileName?: ConnectorProfileName;
    /**
     * The type of connector to reset cached metadata for. You must include this parameter in your request if you're resetting the cache for any of the following connectors: Amazon Connect, Amazon EventBridge, Amazon Lookout for Metrics, Amazon S3, or Upsolver. If you're resetting the cache for any other connector, you can omit this parameter from your request. 
     */
    connectorType?: ConnectorType;
    /**
     * Use this parameter if you want to reset cached metadata about the details for an individual entity. If you don't include this parameter in your request, Amazon AppFlow only resets cached metadata about entity names, not entity details.
     */
    connectorEntityName?: EntityName;
    /**
     * Use this parameter only if you’re resetting the cached metadata about a nested entity. Only some connectors support nested entities. A nested entity is one that has another entity as a parent. To use this parameter, specify the name of the parent entity. To look up the parent-child relationship of entities, you can send a ListConnectorEntities request that omits the entitiesPath parameter. Amazon AppFlow will return a list of top-level entities. For each one, it indicates whether the entity has nested entities. Then, in a subsequent ListConnectorEntities request, you can specify a parent entity name for the entitiesPath parameter. Amazon AppFlow will return a list of the child entities for that parent.
     */
    entitiesPath?: EntitiesPath;
    /**
     * The API version that you specified in the connector profile that you’re resetting cached metadata for. You must use this parameter only if the connector supports multiple API versions or if the connector type is CustomConnector. To look up how many versions a connector supports, use the DescribeConnectors action. In the response, find the value that Amazon AppFlow returns for the connectorVersion parameter. To look up the connector type, use the DescribeConnectorProfiles action. In the response, find the value that Amazon AppFlow returns for the connectorType parameter. To look up the API version that you specified in a connector profile, use the DescribeConnectorProfiles action.
     */
    apiVersion?: ApiVersion;
  }
  export interface ResetConnectorMetadataCacheResponse {
  }
  export type RoleArn = string;
  export type S3ConnectorOperator = "PROJECTION"|"LESS_THAN"|"GREATER_THAN"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface S3DestinationProperties {
    /**
     *  The Amazon S3 bucket name in which Amazon AppFlow places the transferred data. 
     */
    bucketName: BucketName;
    /**
     *  The object key for the destination bucket in which Amazon AppFlow places the files. 
     */
    bucketPrefix?: BucketPrefix;
    s3OutputFormatConfig?: S3OutputFormatConfig;
  }
  export type S3InputFileType = "CSV"|"JSON"|string;
  export interface S3InputFormatConfig {
    /**
     *  The file type that Amazon AppFlow gets from your Amazon S3 bucket. 
     */
    s3InputFileType?: S3InputFileType;
  }
  export interface S3Metadata {
  }
  export interface S3OutputFormatConfig {
    /**
     *  Indicates the file type that Amazon AppFlow places in the Amazon S3 bucket. 
     */
    fileType?: FileType;
    /**
     *  Determines the prefix that Amazon AppFlow applies to the folder name in the Amazon S3 bucket. You can name folders according to the flow frequency and date. 
     */
    prefixConfig?: PrefixConfig;
    aggregationConfig?: AggregationConfig;
    /**
     * If your file output format is Parquet, use this parameter to set whether Amazon AppFlow preserves the data types in your source data when it writes the output to Amazon S3.     true: Amazon AppFlow preserves the data types when it writes to Amazon S3. For example, an integer or 1 in your source data is still an integer in your output.    false: Amazon AppFlow converts all of the source data into strings when it writes to Amazon S3. For example, an integer of 1 in your source data becomes the string "1" in the output.  
     */
    preserveSourceDataTyping?: JavaBoolean;
  }
  export interface S3SourceProperties {
    /**
     *  The Amazon S3 bucket name where the source files are stored. 
     */
    bucketName: BucketName;
    /**
     *  The object key for the Amazon S3 bucket in which the source files are stored. 
     */
    bucketPrefix?: BucketPrefix;
    s3InputFormatConfig?: S3InputFormatConfig;
  }
  export type SAPODataConnectorOperator = "PROJECTION"|"LESS_THAN"|"CONTAINS"|"GREATER_THAN"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface SAPODataConnectorProfileCredentials {
    /**
     *  The SAPOData basic authentication credentials. 
     */
    basicAuthCredentials?: BasicAuthCredentials;
    /**
     *  The SAPOData OAuth type authentication credentials. 
     */
    oAuthCredentials?: OAuthCredentials;
  }
  export interface SAPODataConnectorProfileProperties {
    /**
     *  The location of the SAPOData resource. 
     */
    applicationHostUrl: ApplicationHostUrl;
    /**
     *  The application path to catalog service. 
     */
    applicationServicePath: ApplicationServicePath;
    /**
     *  The port number of the SAPOData instance. 
     */
    portNumber: PortNumber;
    /**
     *  The client number for the client creating the connection. 
     */
    clientNumber: ClientNumber;
    /**
     *  The logon language of SAPOData instance. 
     */
    logonLanguage?: LogonLanguage;
    /**
     *  The SAPOData Private Link service name to be used for private data transfers. 
     */
    privateLinkServiceName?: PrivateLinkServiceName;
    /**
     *  The SAPOData OAuth properties required for OAuth type authentication. 
     */
    oAuthProperties?: OAuthProperties;
    /**
     * If you set this parameter to true, Amazon AppFlow bypasses the single sign-on (SSO) settings in your SAP account when it accesses your SAP OData instance. Whether you need this option depends on the types of credentials that you applied to your SAP OData connection profile. If your profile uses basic authentication credentials, SAP SSO can prevent Amazon AppFlow from connecting to your account with your username and password. In this case, bypassing SSO makes it possible for Amazon AppFlow to connect successfully. However, if your profile uses OAuth credentials, this parameter has no affect.
     */
    disableSSO?: Boolean;
  }
  export interface SAPODataDestinationProperties {
    /**
     * The object path specified in the SAPOData flow destination.
     */
    objectPath: Object;
    /**
     * Determines how Amazon AppFlow handles the success response that it gets from the connector after placing data. For example, this setting would determine where to write the response from a destination connector upon a successful insert operation.
     */
    successResponseHandlingConfig?: SuccessResponseHandlingConfig;
    idFieldNames?: IdFieldNameList;
    errorHandlingConfig?: ErrorHandlingConfig;
    writeOperationType?: WriteOperationType;
  }
  export type SAPODataMaxPageSize = number;
  export type SAPODataMaxParallelism = number;
  export interface SAPODataMetadata {
  }
  export interface SAPODataPaginationConfig {
    /**
     * The maximum number of records that Amazon AppFlow receives in each page of the response from your SAP application. For transfers of OData records, the maximum page size is 3,000. For transfers of data that comes from an ODP provider, the maximum page size is 10,000.
     */
    maxPageSize: SAPODataMaxPageSize;
  }
  export interface SAPODataParallelismConfig {
    /**
     * The maximum number of processes that Amazon AppFlow runs at the same time when it retrieves your data from your SAP application.
     */
    maxParallelism: SAPODataMaxParallelism;
  }
  export interface SAPODataSourceProperties {
    /**
     *  The object path specified in the SAPOData flow source. 
     */
    objectPath?: Object;
    /**
     * Sets the number of concurrent processes that transfers OData records from your SAP instance.
     */
    parallelismConfig?: SAPODataParallelismConfig;
    /**
     * Sets the page size for each concurrent process that transfers OData records from your SAP instance.
     */
    paginationConfig?: SAPODataPaginationConfig;
  }
  export type SalesforceConnectorOperator = "PROJECTION"|"LESS_THAN"|"CONTAINS"|"GREATER_THAN"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface SalesforceConnectorProfileCredentials {
    /**
     *  The credentials used to access protected Salesforce resources. 
     */
    accessToken?: AccessToken;
    /**
     *  The credentials used to acquire new access tokens. 
     */
    refreshToken?: RefreshToken;
    /**
     *  The OAuth requirement needed to request security tokens from the connector endpoint. 
     */
    oAuthRequest?: ConnectorOAuthRequest;
    /**
     *  The secret manager ARN, which contains the client ID and client secret of the connected app. 
     */
    clientCredentialsArn?: ClientCredentialsArn;
    /**
     * Specifies the OAuth 2.0 grant type that Amazon AppFlow uses when it requests an access token from Salesforce. Amazon AppFlow requires an access token each time it attempts to access your Salesforce records. You can specify one of the following values:  AUTHORIZATION_CODE  Amazon AppFlow passes an authorization code when it requests the access token from Salesforce. Amazon AppFlow receives the authorization code from Salesforce after you log in to your Salesforce account and authorize Amazon AppFlow to access your records.  CLIENT_CREDENTIALS  Amazon AppFlow passes client credentials (a client ID and client secret) when it requests the access token from Salesforce. You provide these credentials to Amazon AppFlow when you define the connection to your Salesforce account.  JWT_BEARER  Amazon AppFlow passes a JSON web token (JWT) when it requests the access token from Salesforce. You provide the JWT to Amazon AppFlow when you define the connection to your Salesforce account. When you use this grant type, you don't need to log in to your Salesforce account to authorize Amazon AppFlow to access your records.  
     */
    oAuth2GrantType?: OAuth2GrantType;
    /**
     * A JSON web token (JWT) that authorizes Amazon AppFlow to access your Salesforce records.
     */
    jwtToken?: JwtToken;
  }
  export interface SalesforceConnectorProfileProperties {
    /**
     *  The location of the Salesforce resource. 
     */
    instanceUrl?: InstanceUrl;
    /**
     *  Indicates whether the connector profile applies to a sandbox or production environment. 
     */
    isSandboxEnvironment?: Boolean;
    /**
     * If the connection mode for the connector profile is private, this parameter sets whether Amazon AppFlow uses the private network to send metadata and authorization calls to Salesforce. Amazon AppFlow sends private calls through Amazon Web Services PrivateLink. These calls travel through Amazon Web Services infrastructure without being exposed to the public internet. Set either of the following values:  true  Amazon AppFlow sends all calls to Salesforce over the private network. These private calls are:   Calls to get metadata about your Salesforce records. This metadata describes your Salesforce objects and their fields.   Calls to get or refresh access tokens that allow Amazon AppFlow to access your Salesforce records.   Calls to transfer your Salesforce records as part of a flow run.    false  The default value. Amazon AppFlow sends some calls to Salesforce privately and other calls over the public internet. The public calls are:    Calls to get metadata about your Salesforce records.   Calls to get or refresh access tokens.   The private calls are:   Calls to transfer your Salesforce records as part of a flow run.    
     */
    usePrivateLinkForMetadataAndAuthorization?: Boolean;
  }
  export type SalesforceDataTransferApi = "AUTOMATIC"|"BULKV2"|"REST_SYNC"|string;
  export type SalesforceDataTransferApiList = SalesforceDataTransferApi[];
  export interface SalesforceDestinationProperties {
    /**
     *  The object specified in the Salesforce flow destination. 
     */
    object: Object;
    /**
     *  The name of the field that Amazon AppFlow uses as an ID when performing a write operation such as update or delete. 
     */
    idFieldNames?: IdFieldNameList;
    /**
     *  The settings that determine how Amazon AppFlow handles an error when placing data in the Salesforce destination. For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. ErrorHandlingConfig is a part of the destination connector details. 
     */
    errorHandlingConfig?: ErrorHandlingConfig;
    /**
     *  This specifies the type of write operation to be performed in Salesforce. When the value is UPSERT, then idFieldNames is required. 
     */
    writeOperationType?: WriteOperationType;
    /**
     * Specifies which Salesforce API is used by Amazon AppFlow when your flow transfers data to Salesforce.  AUTOMATIC  The default. Amazon AppFlow selects which API to use based on the number of records that your flow transfers to Salesforce. If your flow transfers fewer than 1,000 records, Amazon AppFlow uses Salesforce REST API. If your flow transfers 1,000 records or more, Amazon AppFlow uses Salesforce Bulk API 2.0. Each of these Salesforce APIs structures data differently. If Amazon AppFlow selects the API automatically, be aware that, for recurring flows, the data output might vary from one flow run to the next. For example, if a flow runs daily, it might use REST API on one day to transfer 900 records, and it might use Bulk API 2.0 on the next day to transfer 1,100 records. For each of these flow runs, the respective Salesforce API formats the data differently. Some of the differences include how dates are formatted and null values are represented. Also, Bulk API 2.0 doesn't transfer Salesforce compound fields. By choosing this option, you optimize flow performance for both small and large data transfers, but the tradeoff is inconsistent formatting in the output.  BULKV2  Amazon AppFlow uses only Salesforce Bulk API 2.0. This API runs asynchronous data transfers, and it's optimal for large sets of data. By choosing this option, you ensure that your flow writes consistent output, but you optimize performance only for large data transfers. Note that Bulk API 2.0 does not transfer Salesforce compound fields.  REST_SYNC  Amazon AppFlow uses only Salesforce REST API. By choosing this option, you ensure that your flow writes consistent output, but you decrease performance for large data transfers that are better suited for Bulk API 2.0. In some cases, if your flow attempts to transfer a vary large set of data, it might fail with a timed out error.  
     */
    dataTransferApi?: SalesforceDataTransferApi;
  }
  export interface SalesforceMetadata {
    /**
     *  The desired authorization scope for the Salesforce account. 
     */
    oAuthScopes?: OAuthScopeList;
    /**
     * The Salesforce APIs that you can have Amazon AppFlow use when your flows transfers data to or from Salesforce.
     */
    dataTransferApis?: SalesforceDataTransferApiList;
    /**
     * The OAuth 2.0 grant types that Amazon AppFlow can use when it requests an access token from Salesforce. Amazon AppFlow requires an access token each time it attempts to access your Salesforce records.  AUTHORIZATION_CODE  Amazon AppFlow passes an authorization code when it requests the access token from Salesforce. Amazon AppFlow receives the authorization code from Salesforce after you log in to your Salesforce account and authorize Amazon AppFlow to access your records.  CLIENT_CREDENTIALS  Amazon AppFlow passes client credentials (a client ID and client secret) when it requests the access token from Salesforce. You provide these credentials to Amazon AppFlow when you define the connection to your Salesforce account.  JWT_BEARER  Amazon AppFlow passes a JSON web token (JWT) when it requests the access token from Salesforce. You provide the JWT to Amazon AppFlow when you define the connection to your Salesforce account. When you use this grant type, you don't need to log in to your Salesforce account to authorize Amazon AppFlow to access your records.  
     */
    oauth2GrantTypesSupported?: OAuth2GrantTypeSupportedList;
  }
  export interface SalesforceSourceProperties {
    /**
     *  The object specified in the Salesforce flow source. 
     */
    object: Object;
    /**
     *  The flag that enables dynamic fetching of new (recently added) fields in the Salesforce objects while running a flow. 
     */
    enableDynamicFieldUpdate?: Boolean;
    /**
     *  Indicates whether Amazon AppFlow includes deleted files in the flow run. 
     */
    includeDeletedRecords?: Boolean;
    /**
     * Specifies which Salesforce API is used by Amazon AppFlow when your flow transfers data from Salesforce.  AUTOMATIC  The default. Amazon AppFlow selects which API to use based on the number of records that your flow transfers from Salesforce. If your flow transfers fewer than 1,000,000 records, Amazon AppFlow uses Salesforce REST API. If your flow transfers 1,000,000 records or more, Amazon AppFlow uses Salesforce Bulk API 2.0. Each of these Salesforce APIs structures data differently. If Amazon AppFlow selects the API automatically, be aware that, for recurring flows, the data output might vary from one flow run to the next. For example, if a flow runs daily, it might use REST API on one day to transfer 900,000 records, and it might use Bulk API 2.0 on the next day to transfer 1,100,000 records. For each of these flow runs, the respective Salesforce API formats the data differently. Some of the differences include how dates are formatted and null values are represented. Also, Bulk API 2.0 doesn't transfer Salesforce compound fields. By choosing this option, you optimize flow performance for both small and large data transfers, but the tradeoff is inconsistent formatting in the output.  BULKV2  Amazon AppFlow uses only Salesforce Bulk API 2.0. This API runs asynchronous data transfers, and it's optimal for large sets of data. By choosing this option, you ensure that your flow writes consistent output, but you optimize performance only for large data transfers. Note that Bulk API 2.0 does not transfer Salesforce compound fields.  REST_SYNC  Amazon AppFlow uses only Salesforce REST API. By choosing this option, you ensure that your flow writes consistent output, but you decrease performance for large data transfers that are better suited for Bulk API 2.0. In some cases, if your flow attempts to transfer a vary large set of data, it might fail wituh a timed out error.  
     */
    dataTransferApi?: SalesforceDataTransferApi;
  }
  export type ScheduleExpression = string;
  export type ScheduleFrequencyType = "BYMINUTE"|"HOURLY"|"DAILY"|"WEEKLY"|"MONTHLY"|"ONCE"|string;
  export type ScheduleOffset = number;
  export interface ScheduledTriggerProperties {
    /**
     *  The scheduling expression that determines the rate at which the schedule will run, for example rate(5minutes). 
     */
    scheduleExpression: ScheduleExpression;
    /**
     *  Specifies whether a scheduled flow has an incremental data transfer or a complete data transfer for each flow run. 
     */
    dataPullMode?: DataPullMode;
    /**
     * The time at which the scheduled flow starts. The time is formatted as a timestamp that follows the ISO 8601 standard, such as 2022-04-26T13:00:00-07:00.
     */
    scheduleStartTime?: _Date;
    /**
     * The time at which the scheduled flow ends. The time is formatted as a timestamp that follows the ISO 8601 standard, such as 2022-04-27T13:00:00-07:00.
     */
    scheduleEndTime?: _Date;
    /**
     * Specifies the time zone used when referring to the dates and times of a scheduled flow, such as America/New_York. This time zone is only a descriptive label. It doesn't affect how Amazon AppFlow interprets the timestamps that you specify to schedule the flow. If you want to schedule a flow by using times in a particular time zone, indicate the time zone as a UTC offset in your timestamps. For example, the UTC offsets for the America/New_York timezone are -04:00 EDT and -05:00 EST.
     */
    timezone?: Timezone;
    /**
     *  Specifies the optional offset that is added to the time interval for a schedule-triggered flow. 
     */
    scheduleOffset?: ScheduleOffset;
    /**
     *  Specifies the date range for the records to import from the connector in the first flow run. 
     */
    firstExecutionFrom?: _Date;
    /**
     * Defines how many times a scheduled flow fails consecutively before Amazon AppFlow deactivates it.
     */
    flowErrorDeactivationThreshold?: FlowErrorDeactivationThreshold;
  }
  export type SchedulingFrequencyTypeList = ScheduleFrequencyType[];
  export type SecretKey = string;
  export type ServiceNowConnectorOperator = "PROJECTION"|"CONTAINS"|"LESS_THAN"|"GREATER_THAN"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface ServiceNowConnectorProfileCredentials {
    /**
     *  The name of the user. 
     */
    username?: Username;
    /**
     *  The password that corresponds to the user name. 
     */
    password?: Password;
    /**
     *  The OAuth 2.0 credentials required to authenticate the user. 
     */
    oAuth2Credentials?: OAuth2Credentials;
  }
  export interface ServiceNowConnectorProfileProperties {
    /**
     *  The location of the ServiceNow resource. 
     */
    instanceUrl: InstanceUrl;
  }
  export interface ServiceNowMetadata {
  }
  export interface ServiceNowSourceProperties {
    /**
     *  The object specified in the ServiceNow flow source. 
     */
    object: Object;
  }
  export type SingularConnectorOperator = "PROJECTION"|"EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface SingularConnectorProfileCredentials {
    /**
     *  A unique alphanumeric identifier used to authenticate a user, developer, or calling program to your API. 
     */
    apiKey: ApiKey;
  }
  export interface SingularConnectorProfileProperties {
  }
  export interface SingularMetadata {
  }
  export interface SingularSourceProperties {
    /**
     *  The object specified in the Singular flow source. 
     */
    object: Object;
  }
  export type SlackConnectorOperator = "PROJECTION"|"LESS_THAN"|"GREATER_THAN"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface SlackConnectorProfileCredentials {
    /**
     *  The identifier for the client. 
     */
    clientId: ClientId;
    /**
     *  The client secret used by the OAuth client to authenticate to the authorization server. 
     */
    clientSecret: ClientSecret;
    /**
     *  The credentials used to access protected Slack resources. 
     */
    accessToken?: AccessToken;
    /**
     *  The OAuth requirement needed to request security tokens from the connector endpoint. 
     */
    oAuthRequest?: ConnectorOAuthRequest;
  }
  export interface SlackConnectorProfileProperties {
    /**
     *  The location of the Slack resource. 
     */
    instanceUrl: InstanceUrl;
  }
  export interface SlackMetadata {
    /**
     *  The desired authorization scope for the Slack account. 
     */
    oAuthScopes?: OAuthScopeList;
  }
  export interface SlackSourceProperties {
    /**
     *  The object specified in the Slack flow source. 
     */
    object: Object;
  }
  export interface SnowflakeConnectorProfileCredentials {
    /**
     *  The name of the user. 
     */
    username: Username;
    /**
     *  The password that corresponds to the user name. 
     */
    password: Password;
  }
  export interface SnowflakeConnectorProfileProperties {
    /**
     *  The name of the Snowflake warehouse. 
     */
    warehouse: Warehouse;
    /**
     *  The name of the Amazon S3 stage that was created while setting up an Amazon S3 stage in the Snowflake account. This is written in the following format: &lt; Database&gt;&lt; Schema&gt;&lt;Stage Name&gt;. 
     */
    stage: Stage;
    /**
     *  The name of the Amazon S3 bucket associated with Snowflake. 
     */
    bucketName: BucketName;
    /**
     *  The bucket path that refers to the Amazon S3 bucket associated with Snowflake. 
     */
    bucketPrefix?: BucketPrefix;
    /**
     *  The Snowflake Private Link service name to be used for private data transfers. 
     */
    privateLinkServiceName?: PrivateLinkServiceName;
    /**
     *  The name of the account. 
     */
    accountName?: AccountName;
    /**
     *  The Amazon Web Services Region of the Snowflake account. 
     */
    region?: Region;
  }
  export interface SnowflakeDestinationProperties {
    /**
     *  The object specified in the Snowflake flow destination. 
     */
    object: Object;
    /**
     *  The intermediate bucket that Amazon AppFlow uses when moving data into Snowflake. 
     */
    intermediateBucketName: BucketName;
    /**
     *  The object key for the destination bucket in which Amazon AppFlow places the files. 
     */
    bucketPrefix?: BucketPrefix;
    /**
     *  The settings that determine how Amazon AppFlow handles an error when placing data in the Snowflake destination. For example, this setting would determine if the flow should fail after one insertion error, or continue and attempt to insert every record regardless of the initial failure. ErrorHandlingConfig is a part of the destination connector details. 
     */
    errorHandlingConfig?: ErrorHandlingConfig;
  }
  export interface SnowflakeMetadata {
    /**
     *  Specifies the supported Amazon Web Services Regions when using Snowflake. 
     */
    supportedRegions?: RegionList;
  }
  export interface SourceConnectorProperties {
    /**
     *  Specifies the information that is required for querying Amplitude. 
     */
    Amplitude?: AmplitudeSourceProperties;
    /**
     *  Specifies the information that is required for querying Datadog. 
     */
    Datadog?: DatadogSourceProperties;
    /**
     *  Specifies the information that is required for querying Dynatrace. 
     */
    Dynatrace?: DynatraceSourceProperties;
    /**
     *  Specifies the information that is required for querying Google Analytics. 
     */
    GoogleAnalytics?: GoogleAnalyticsSourceProperties;
    /**
     *  Specifies the information that is required for querying Infor Nexus. 
     */
    InforNexus?: InforNexusSourceProperties;
    /**
     *  Specifies the information that is required for querying Marketo. 
     */
    Marketo?: MarketoSourceProperties;
    /**
     *  Specifies the information that is required for querying Amazon S3. 
     */
    S3?: S3SourceProperties;
    /**
     *  Specifies the information that is required for querying Salesforce. 
     */
    Salesforce?: SalesforceSourceProperties;
    /**
     *  Specifies the information that is required for querying ServiceNow. 
     */
    ServiceNow?: ServiceNowSourceProperties;
    /**
     *  Specifies the information that is required for querying Singular. 
     */
    Singular?: SingularSourceProperties;
    /**
     *  Specifies the information that is required for querying Slack. 
     */
    Slack?: SlackSourceProperties;
    /**
     *  Specifies the information that is required for querying Trend Micro. 
     */
    Trendmicro?: TrendmicroSourceProperties;
    /**
     *  Specifies the information that is required for querying Veeva. 
     */
    Veeva?: VeevaSourceProperties;
    /**
     *  Specifies the information that is required for querying Zendesk. 
     */
    Zendesk?: ZendeskSourceProperties;
    SAPOData?: SAPODataSourceProperties;
    CustomConnector?: CustomConnectorSourceProperties;
    /**
     * Specifies the information that is required for querying Salesforce Pardot.
     */
    Pardot?: PardotSourceProperties;
  }
  export interface SourceFieldProperties {
    /**
     *  Indicates whether the field can be returned in a search result. 
     */
    isRetrievable?: Boolean;
    /**
     *  Indicates if the field can be queried. 
     */
    isQueryable?: Boolean;
    /**
     * Indicates if this timestamp field can be used for incremental queries.
     */
    isTimestampFieldForIncrementalQueries?: Boolean;
  }
  export type SourceFields = String[];
  export interface SourceFlowConfig {
    /**
     *  The type of connector, such as Salesforce, Amplitude, and so on. 
     */
    connectorType: ConnectorType;
    /**
     * The API version of the connector when it's used as a source in the flow.
     */
    apiVersion?: ApiVersion;
    /**
     *  The name of the connector profile. This name must be unique for each connector profile in the Amazon Web Services account. 
     */
    connectorProfileName?: ConnectorProfileName;
    /**
     *  Specifies the information that is required to query a particular source connector. 
     */
    sourceConnectorProperties: SourceConnectorProperties;
    /**
     *  Defines the configuration for a scheduled incremental data pull. If a valid configuration is provided, the fields specified in the configuration are used when querying for the incremental data pull. 
     */
    incrementalPullConfig?: IncrementalPullConfig;
  }
  export type Stage = string;
  export interface StartFlowRequest {
    /**
     *  The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only. 
     */
    flowName: FlowName;
    /**
     * The clientToken parameter is an idempotency token. It ensures that your StartFlow request completes only once. You choose the value to pass. For example, if you don't receive a response from your request, you can safely retry the request with the same clientToken parameter value. If you omit a clientToken value, the Amazon Web Services SDK that you are using inserts a value for you. This way, the SDK can safely retry requests multiple times after a network error. You must provide your own value for other use cases. If you specify input parameters that differ from your first request, an error occurs for flows that run on a schedule or based on an event. However, the error doesn't occur for flows that run on demand. You set the conditions that initiate your flow for the triggerConfig parameter. If you use a different value for clientToken, Amazon AppFlow considers it a new call to StartFlow. The token is active for 8 hours.
     */
    clientToken?: ClientToken;
  }
  export interface StartFlowResponse {
    /**
     *  The flow's Amazon Resource Name (ARN). 
     */
    flowArn?: FlowArn;
    /**
     *  Indicates the current status of the flow. 
     */
    flowStatus?: FlowStatus;
    /**
     *  Returns the internal execution ID of an on-demand flow when the flow is started. For scheduled or event-triggered flows, this value is null. 
     */
    executionId?: ExecutionId;
  }
  export interface StopFlowRequest {
    /**
     *  The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only. 
     */
    flowName: FlowName;
  }
  export interface StopFlowResponse {
    /**
     *  The flow's Amazon Resource Name (ARN). 
     */
    flowArn?: FlowArn;
    /**
     *  Indicates the current status of the flow. 
     */
    flowStatus?: FlowStatus;
  }
  export type String = string;
  export interface SuccessResponseHandlingConfig {
    /**
     * The Amazon S3 bucket prefix.
     */
    bucketPrefix?: BucketPrefix;
    /**
     * The name of the Amazon S3 bucket.
     */
    bucketName?: BucketName;
  }
  export type SupportedApiVersion = string;
  export type SupportedApiVersionList = SupportedApiVersion[];
  export type SupportedDataTransferApis = DataTransferApi[];
  export type SupportedDataTransferType = "RECORD"|"FILE"|string;
  export type SupportedDataTransferTypeList = SupportedDataTransferType[];
  export interface SupportedFieldTypeDetails {
    /**
     *  The initial supported version for fieldType. If this is later changed to a different version, v2 will be introduced. 
     */
    v1: FieldTypeDetails;
  }
  export type SupportedOperatorList = Operators[];
  export type SupportedValueList = Value[];
  export type SupportedWriteOperationList = WriteOperationType[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the flow that you want to tag. 
     */
    resourceArn: ARN;
    /**
     *  The tags used to organize, track, or control access for your flow. 
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface Task {
    /**
     *  The source fields to which a particular task is applied. 
     */
    sourceFields: SourceFields;
    /**
     *  The operation to be performed on the provided source fields. 
     */
    connectorOperator?: ConnectorOperator;
    /**
     *  A field in a destination connector, or a field value against which Amazon AppFlow validates a source field. 
     */
    destinationField?: DestinationField;
    /**
     *  Specifies the particular task implementation that Amazon AppFlow performs. 
     */
    taskType: TaskType;
    /**
     *  A map used to store task-related information. The execution service looks for particular information based on the TaskType. 
     */
    taskProperties?: TaskPropertiesMap;
  }
  export type TaskPropertiesMap = {[key: string]: Property};
  export type TaskType = "Arithmetic"|"Filter"|"Map"|"Map_all"|"Mask"|"Merge"|"Passthrough"|"Truncate"|"Validate"|"Partition"|string;
  export type Tasks = Task[];
  export type Timezone = string;
  export type TokenUrl = string;
  export type TokenUrlCustomProperties = {[key: string]: CustomPropertyValue};
  export type TokenUrlList = TokenUrl[];
  export type TrendmicroConnectorOperator = "PROJECTION"|"EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface TrendmicroConnectorProfileCredentials {
    /**
     *  The Secret Access Key portion of the credentials. 
     */
    apiSecretKey: ApiSecretKey;
  }
  export interface TrendmicroConnectorProfileProperties {
  }
  export interface TrendmicroMetadata {
  }
  export interface TrendmicroSourceProperties {
    /**
     *  The object specified in the Trend Micro flow source. 
     */
    object: Object;
  }
  export interface TriggerConfig {
    /**
     *  Specifies the type of flow trigger. This can be OnDemand, Scheduled, or Event. 
     */
    triggerType: TriggerType;
    /**
     *  Specifies the configuration details of a schedule-triggered flow as defined by the user. Currently, these settings only apply to the Scheduled trigger type. 
     */
    triggerProperties?: TriggerProperties;
  }
  export interface TriggerProperties {
    /**
     *  Specifies the configuration details of a schedule-triggered flow as defined by the user. 
     */
    Scheduled?: ScheduledTriggerProperties;
  }
  export type TriggerType = "Scheduled"|"Event"|"OnDemand"|string;
  export type TriggerTypeList = TriggerType[];
  export interface UnregisterConnectorRequest {
    /**
     * The label of the connector. The label is unique for each ConnectorRegistration in your Amazon Web Services account.
     */
    connectorLabel: ConnectorLabel;
    /**
     * Indicates whether Amazon AppFlow should unregister the connector, even if it is currently in use in one or more connector profiles. The default value is false.
     */
    forceDelete?: Boolean;
  }
  export interface UnregisterConnectorResponse {
  }
  export interface UntagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the flow that you want to untag. 
     */
    resourceArn: ARN;
    /**
     *  The tag keys associated with the tag that you want to remove from your flow. 
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateConnectorProfileRequest {
    /**
     *  The name of the connector profile and is unique for each ConnectorProfile in the Amazon Web Services account. 
     */
    connectorProfileName: ConnectorProfileName;
    /**
     *  Indicates the connection mode and if it is public or private. 
     */
    connectionMode: ConnectionMode;
    /**
     *  Defines the connector-specific profile configuration and credentials. 
     */
    connectorProfileConfig: ConnectorProfileConfig;
    /**
     * The clientToken parameter is an idempotency token. It ensures that your UpdateConnectorProfile request completes only once. You choose the value to pass. For example, if you don't receive a response from your request, you can safely retry the request with the same clientToken parameter value. If you omit a clientToken value, the Amazon Web Services SDK that you are using inserts a value for you. This way, the SDK can safely retry requests multiple times after a network error. You must provide your own value for other use cases. If you specify input parameters that differ from your first request, an error occurs. If you use a different value for clientToken, Amazon AppFlow considers it a new call to UpdateConnectorProfile. The token is active for 8 hours.
     */
    clientToken?: ClientToken;
  }
  export interface UpdateConnectorProfileResponse {
    /**
     *  The Amazon Resource Name (ARN) of the connector profile. 
     */
    connectorProfileArn?: ConnectorProfileArn;
  }
  export interface UpdateConnectorRegistrationRequest {
    /**
     * The name of the connector. The name is unique for each connector registration in your AWS account.
     */
    connectorLabel: ConnectorLabel;
    /**
     * A description about the update that you're applying to the connector.
     */
    description?: Description;
    connectorProvisioningConfig?: ConnectorProvisioningConfig;
    /**
     * The clientToken parameter is an idempotency token. It ensures that your UpdateConnectorRegistration request completes only once. You choose the value to pass. For example, if you don't receive a response from your request, you can safely retry the request with the same clientToken parameter value. If you omit a clientToken value, the Amazon Web Services SDK that you are using inserts a value for you. This way, the SDK can safely retry requests multiple times after a network error. You must provide your own value for other use cases. If you specify input parameters that differ from your first request, an error occurs. If you use a different value for clientToken, Amazon AppFlow considers it a new call to UpdateConnectorRegistration. The token is active for 8 hours.
     */
    clientToken?: ClientToken;
  }
  export interface UpdateConnectorRegistrationResponse {
    /**
     * The ARN of the connector being updated.
     */
    connectorArn?: ARN;
  }
  export interface UpdateFlowRequest {
    /**
     *  The specified name of the flow. Spaces are not allowed. Use underscores (_) or hyphens (-) only. 
     */
    flowName: FlowName;
    /**
     *  A description of the flow. 
     */
    description?: FlowDescription;
    /**
     *  The trigger settings that determine how and when the flow runs. 
     */
    triggerConfig: TriggerConfig;
    sourceFlowConfig: SourceFlowConfig;
    /**
     *  The configuration that controls how Amazon AppFlow transfers data to the destination connector. 
     */
    destinationFlowConfigList: DestinationFlowConfigList;
    /**
     *  A list of tasks that Amazon AppFlow performs while transferring the data in the flow run. 
     */
    tasks: Tasks;
    /**
     * Specifies the configuration that Amazon AppFlow uses when it catalogs the data that's transferred by the associated flow. When Amazon AppFlow catalogs the data from a flow, it stores metadata in a data catalog.
     */
    metadataCatalogConfig?: MetadataCatalogConfig;
    /**
     * The clientToken parameter is an idempotency token. It ensures that your UpdateFlow request completes only once. You choose the value to pass. For example, if you don't receive a response from your request, you can safely retry the request with the same clientToken parameter value. If you omit a clientToken value, the Amazon Web Services SDK that you are using inserts a value for you. This way, the SDK can safely retry requests multiple times after a network error. You must provide your own value for other use cases. If you specify input parameters that differ from your first request, an error occurs. If you use a different value for clientToken, Amazon AppFlow considers it a new call to UpdateFlow. The token is active for 8 hours.
     */
    clientToken?: ClientToken;
  }
  export interface UpdateFlowResponse {
    /**
     * Indicates the current status of the flow. 
     */
    flowStatus?: FlowStatus;
  }
  export type UpdatedBy = string;
  export type UpsolverBucketName = string;
  export interface UpsolverDestinationProperties {
    /**
     *  The Upsolver Amazon S3 bucket name in which Amazon AppFlow places the transferred data. 
     */
    bucketName: UpsolverBucketName;
    /**
     *  The object key for the destination Upsolver Amazon S3 bucket in which Amazon AppFlow places the files. 
     */
    bucketPrefix?: BucketPrefix;
    /**
     *  The configuration that determines how data is formatted when Upsolver is used as the flow destination. 
     */
    s3OutputFormatConfig: UpsolverS3OutputFormatConfig;
  }
  export interface UpsolverMetadata {
  }
  export interface UpsolverS3OutputFormatConfig {
    /**
     *  Indicates the file type that Amazon AppFlow places in the Upsolver Amazon S3 bucket. 
     */
    fileType?: FileType;
    prefixConfig: PrefixConfig;
    aggregationConfig?: AggregationConfig;
  }
  export type Username = string;
  export type Value = string;
  export type VeevaConnectorOperator = "PROJECTION"|"LESS_THAN"|"GREATER_THAN"|"CONTAINS"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface VeevaConnectorProfileCredentials {
    /**
     *  The name of the user. 
     */
    username: Username;
    /**
     *  The password that corresponds to the user name. 
     */
    password: Password;
  }
  export interface VeevaConnectorProfileProperties {
    /**
     *  The location of the Veeva resource. 
     */
    instanceUrl: InstanceUrl;
  }
  export interface VeevaMetadata {
  }
  export interface VeevaSourceProperties {
    /**
     *  The object specified in the Veeva flow source. 
     */
    object: Object;
    /**
     * The document type specified in the Veeva document extract flow.
     */
    documentType?: DocumentType;
    /**
     * Boolean value to include source files in Veeva document extract flow.
     */
    includeSourceFiles?: Boolean;
    /**
     * Boolean value to include file renditions in Veeva document extract flow.
     */
    includeRenditions?: Boolean;
    /**
     * Boolean value to include All Versions of files in Veeva document extract flow.
     */
    includeAllVersions?: Boolean;
  }
  export type Warehouse = string;
  export type WorkgroupName = string;
  export type WriteOperationType = "INSERT"|"UPSERT"|"UPDATE"|"DELETE"|string;
  export type ZendeskConnectorOperator = "PROJECTION"|"GREATER_THAN"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface ZendeskConnectorProfileCredentials {
    /**
     *  The identifier for the desired client. 
     */
    clientId: ClientId;
    /**
     *  The client secret used by the OAuth client to authenticate to the authorization server. 
     */
    clientSecret: ClientSecret;
    /**
     *  The credentials used to access protected Zendesk resources. 
     */
    accessToken?: AccessToken;
    /**
     *  The OAuth requirement needed to request security tokens from the connector endpoint. 
     */
    oAuthRequest?: ConnectorOAuthRequest;
  }
  export interface ZendeskConnectorProfileProperties {
    /**
     *  The location of the Zendesk resource. 
     */
    instanceUrl: InstanceUrl;
  }
  export interface ZendeskDestinationProperties {
    /**
     * The object specified in the Zendesk flow destination.
     */
    object: Object;
    idFieldNames?: IdFieldNameList;
    errorHandlingConfig?: ErrorHandlingConfig;
    writeOperationType?: WriteOperationType;
  }
  export interface ZendeskMetadata {
    /**
     *  The desired authorization scope for the Zendesk account. 
     */
    oAuthScopes?: OAuthScopeList;
  }
  export interface ZendeskSourceProperties {
    /**
     *  The object specified in the Zendesk flow source. 
     */
    object: Object;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-08-23"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Appflow client.
   */
  export import Types = Appflow;
}
export = Appflow;
