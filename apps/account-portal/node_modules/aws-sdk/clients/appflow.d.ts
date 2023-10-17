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
   *  Creates a new connector profile associated with your Amazon Web Services account. There is a soft quota of 100 connector profiles per Amazon Web Services account. If you need more connector profiles than this quota allows, you can submit a request to the Amazon AppFlow team through the Amazon AppFlow support channel. 
   */
  createConnectorProfile(params: Appflow.Types.CreateConnectorProfileRequest, callback?: (err: AWSError, data: Appflow.Types.CreateConnectorProfileResponse) => void): Request<Appflow.Types.CreateConnectorProfileResponse, AWSError>;
  /**
   *  Creates a new connector profile associated with your Amazon Web Services account. There is a soft quota of 100 connector profiles per Amazon Web Services account. If you need more connector profiles than this quota allows, you can submit a request to the Amazon AppFlow team through the Amazon AppFlow support channel. 
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
   *  Provides details regarding the entity used with the connector, with a description of the data model for each entity. 
   */
  describeConnectorEntity(params: Appflow.Types.DescribeConnectorEntityRequest, callback?: (err: AWSError, data: Appflow.Types.DescribeConnectorEntityResponse) => void): Request<Appflow.Types.DescribeConnectorEntityResponse, AWSError>;
  /**
   *  Provides details regarding the entity used with the connector, with a description of the data model for each entity. 
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
  export type ApiSecretKey = string;
  export type ApiToken = string;
  export type ApplicationHostUrl = string;
  export type ApplicationKey = string;
  export type ApplicationServicePath = string;
  export type AuthCode = string;
  export type AuthCodeUrl = string;
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
  export type ClientCredentialsArn = string;
  export type ClientId = string;
  export type ClientNumber = string;
  export type ClientSecret = string;
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
  }
  export type ConnectorConfigurationsMap = {[key: string]: ConnectorConfiguration};
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
     *  The label applied to a connector entity field. 
     */
    label?: Label;
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
  }
  export type ConnectorEntityFieldList = ConnectorEntityField[];
  export type ConnectorEntityList = ConnectorEntity[];
  export type ConnectorEntityMap = {[key: string]: ConnectorEntityList};
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
  }
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
  }
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
    connectorProfileCredentials: ConnectorProfileCredentials;
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
  }
  export type ConnectorType = "Salesforce"|"Singular"|"Slack"|"Redshift"|"S3"|"Marketo"|"Googleanalytics"|"Zendesk"|"Servicenow"|"Datadog"|"Trendmicro"|"Snowflake"|"Dynatrace"|"Infornexus"|"Amplitude"|"Veeva"|"EventBridge"|"LookoutMetrics"|"Upsolver"|"Honeycode"|"CustomerProfiles"|"SAPOData"|string;
  export type ConnectorTypeList = ConnectorType[];
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
     *  Indicates the connection mode and specifies whether it is public or private. Private flows use Amazon Web Services PrivateLink to route data over Amazon Web Services infrastructure without exposing it to the public internet. 
     */
    connectionMode: ConnectionMode;
    /**
     *  Defines the connector-specific configuration and credentials. 
     */
    connectorProfileConfig: ConnectorProfileConfig;
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
  export type DataPullMode = "Incremental"|"Complete"|string;
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
    connectorEntityName: Name;
    /**
     *  The type of connector application, such as Salesforce, Amplitude, and so on. 
     */
    connectorType?: ConnectorType;
    /**
     *  The name of the connector profile. The name is unique for each ConnectorProfile in the Amazon Web Services account. 
     */
    connectorProfileName?: ConnectorProfileName;
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
  export interface DescribeConnectorsRequest {
    /**
     *  The type of connector, such as Salesforce, Amplitude, and so on. 
     */
    connectorTypes?: ConnectorTypeList;
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
  }
  export type ExecutionStatus = "InProgress"|"Successful"|"Error"|string;
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
     *  Specifies the destination connector type, such as Salesforce, Amazon S3, Amplitude, and so on. 
     */
    destinationConnectorType?: ConnectorType;
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
  export type FlowExecutionList = ExecutionRecord[];
  export type FlowList = FlowDefinition[];
  export type FlowName = string;
  export type FlowStatus = "Active"|"Deprecated"|"Deleted"|"Draft"|"Errored"|"Suspended"|string;
  export type FlowStatusMessage = string;
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
  export type KMSArn = string;
  export type Key = string;
  export type Label = string;
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
  }
  export interface ListConnectorEntitiesResponse {
    /**
     *  The response of ListConnectorEntities lists entities grouped by category. This map's key represents the group name, and its value contains the list of entities belonging to that group. 
     */
    connectorEntityMap: ConnectorEntityMap;
  }
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
  export interface MarketoMetadata {
  }
  export interface MarketoSourceProperties {
    /**
     *  The object specified in the Marketo flow source. 
     */
    object: Object;
  }
  export type MaxResults = number;
  export type MostRecentExecutionMessage = string;
  export type Name = string;
  export type NextToken = string;
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
  export type OperatorPropertiesKeys = "VALUE"|"VALUES"|"DATA_TYPE"|"UPPER_BOUND"|"LOWER_BOUND"|"SOURCE_DATA_TYPE"|"DESTINATION_DATA_TYPE"|"VALIDATION_ACTION"|"MASK_VALUE"|"MASK_LENGTH"|"TRUNCATE_LENGTH"|"MATH_OPERATION_FIELDS_ORDER"|"CONCAT_FORMAT"|"SUBFIELD_CATEGORY_MAP"|"EXCLUDE_SOURCE_FIELDS_LIST"|string;
  export type Password = string;
  export type PortNumber = number;
  export interface PrefixConfig {
    /**
     *  Determines the format of the prefix, and whether it applies to the file name, file path, or both. 
     */
    prefixType?: PrefixType;
    /**
     *  Determines the level of granularity that's included in the prefix. 
     */
    prefixFormat?: PrefixFormat;
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
  export type Property = string;
  export type RedirectUri = string;
  export interface RedshiftConnectorProfileCredentials {
    /**
     *  The name of the user. 
     */
    username: Username;
    /**
     *  The password that corresponds to the user name. 
     */
    password: Password;
  }
  export interface RedshiftConnectorProfileProperties {
    /**
     *  The JDBC URL of the Amazon Redshift cluster. 
     */
    databaseUrl: DatabaseUrl;
    /**
     *  A name for the associated Amazon S3 bucket. 
     */
    bucketName: BucketName;
    /**
     *  The object key for the destination bucket in which Amazon AppFlow places the files. 
     */
    bucketPrefix?: BucketPrefix;
    /**
     *  The Amazon Resource Name (ARN) of the IAM role. 
     */
    roleArn: RoleArn;
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
  }
  export interface SAPODataMetadata {
  }
  export interface SAPODataSourceProperties {
    /**
     *  The object path specified in the SAPOData flow source. 
     */
    objectPath?: Object;
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
  }
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
  }
  export interface SalesforceMetadata {
    /**
     *  The desired authorization scope for the Salesforce account. 
     */
    oAuthScopes?: OAuthScopeList;
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
     *  Specifies the scheduled start time for a schedule-triggered flow. 
     */
    scheduleStartTime?: _Date;
    /**
     *  Specifies the scheduled end time for a schedule-triggered flow. 
     */
    scheduleEndTime?: _Date;
    /**
     *  Specifies the time zone used when referring to the date and time of a scheduled-triggered flow, such as America/New_York. 
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
  }
  export type SchedulingFrequencyTypeList = ScheduleFrequencyType[];
  export type SecretKey = string;
  export type ServiceNowConnectorOperator = "PROJECTION"|"CONTAINS"|"LESS_THAN"|"GREATER_THAN"|"BETWEEN"|"LESS_THAN_OR_EQUAL_TO"|"GREATER_THAN_OR_EQUAL_TO"|"EQUAL_TO"|"NOT_EQUAL_TO"|"ADDITION"|"MULTIPLICATION"|"DIVISION"|"SUBTRACTION"|"MASK_ALL"|"MASK_FIRST_N"|"MASK_LAST_N"|"VALIDATE_NON_NULL"|"VALIDATE_NON_ZERO"|"VALIDATE_NON_NEGATIVE"|"VALIDATE_NUMERIC"|"NO_OP"|string;
  export interface ServiceNowConnectorProfileCredentials {
    /**
     *  The name of the user. 
     */
    username: Username;
    /**
     *  The password that corresponds to the user name. 
     */
    password: Password;
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
  }
  export type SourceFields = String[];
  export interface SourceFlowConfig {
    /**
     *  The type of connector, such as Salesforce, Amplitude, and so on. 
     */
    connectorType: ConnectorType;
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
  export interface SupportedFieldTypeDetails {
    /**
     *  The initial supported version for fieldType. If this is later changed to a different version, v2 will be introduced. 
     */
    v1: FieldTypeDetails;
  }
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
  export type TaskType = "Arithmetic"|"Filter"|"Map"|"Map_all"|"Mask"|"Merge"|"Truncate"|"Validate"|string;
  export type Tasks = Task[];
  export type Timezone = string;
  export type TokenUrl = string;
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
  }
  export interface UpdateConnectorProfileResponse {
    /**
     *  The Amazon Resource Name (ARN) of the connector profile. 
     */
    connectorProfileArn?: ConnectorProfileArn;
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
  export type WriteOperationType = "INSERT"|"UPSERT"|"UPDATE"|string;
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
