import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AppIntegrations extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AppIntegrations.Types.ClientConfiguration)
  config: Config & AppIntegrations.Types.ClientConfiguration;
  /**
   * This API is in preview release and subject to change. Creates and persists an Application resource.
   */
  createApplication(params: AppIntegrations.Types.CreateApplicationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.CreateApplicationResponse) => void): Request<AppIntegrations.Types.CreateApplicationResponse, AWSError>;
  /**
   * This API is in preview release and subject to change. Creates and persists an Application resource.
   */
  createApplication(callback?: (err: AWSError, data: AppIntegrations.Types.CreateApplicationResponse) => void): Request<AppIntegrations.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates and persists a DataIntegration resource.  You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  createDataIntegration(params: AppIntegrations.Types.CreateDataIntegrationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.CreateDataIntegrationResponse) => void): Request<AppIntegrations.Types.CreateDataIntegrationResponse, AWSError>;
  /**
   * Creates and persists a DataIntegration resource.  You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  createDataIntegration(callback?: (err: AWSError, data: AppIntegrations.Types.CreateDataIntegrationResponse) => void): Request<AppIntegrations.Types.CreateDataIntegrationResponse, AWSError>;
  /**
   * Creates an EventIntegration, given a specified name, description, and a reference to an Amazon EventBridge bus in your account and a partner event source that pushes events to that bus. No objects are created in the your account, only metadata that is persisted on the EventIntegration control plane.
   */
  createEventIntegration(params: AppIntegrations.Types.CreateEventIntegrationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.CreateEventIntegrationResponse) => void): Request<AppIntegrations.Types.CreateEventIntegrationResponse, AWSError>;
  /**
   * Creates an EventIntegration, given a specified name, description, and a reference to an Amazon EventBridge bus in your account and a partner event source that pushes events to that bus. No objects are created in the your account, only metadata that is persisted on the EventIntegration control plane.
   */
  createEventIntegration(callback?: (err: AWSError, data: AppIntegrations.Types.CreateEventIntegrationResponse) => void): Request<AppIntegrations.Types.CreateEventIntegrationResponse, AWSError>;
  /**
   * Deletes the DataIntegration. Only DataIntegrations that don't have any DataIntegrationAssociations can be deleted. Deleting a DataIntegration also deletes the underlying Amazon AppFlow flow and service linked role.   You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  deleteDataIntegration(params: AppIntegrations.Types.DeleteDataIntegrationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.DeleteDataIntegrationResponse) => void): Request<AppIntegrations.Types.DeleteDataIntegrationResponse, AWSError>;
  /**
   * Deletes the DataIntegration. Only DataIntegrations that don't have any DataIntegrationAssociations can be deleted. Deleting a DataIntegration also deletes the underlying Amazon AppFlow flow and service linked role.   You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  deleteDataIntegration(callback?: (err: AWSError, data: AppIntegrations.Types.DeleteDataIntegrationResponse) => void): Request<AppIntegrations.Types.DeleteDataIntegrationResponse, AWSError>;
  /**
   * Deletes the specified existing event integration. If the event integration is associated with clients, the request is rejected.
   */
  deleteEventIntegration(params: AppIntegrations.Types.DeleteEventIntegrationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.DeleteEventIntegrationResponse) => void): Request<AppIntegrations.Types.DeleteEventIntegrationResponse, AWSError>;
  /**
   * Deletes the specified existing event integration. If the event integration is associated with clients, the request is rejected.
   */
  deleteEventIntegration(callback?: (err: AWSError, data: AppIntegrations.Types.DeleteEventIntegrationResponse) => void): Request<AppIntegrations.Types.DeleteEventIntegrationResponse, AWSError>;
  /**
   * This API is in preview release and subject to change. Get an Application resource.
   */
  getApplication(params: AppIntegrations.Types.GetApplicationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.GetApplicationResponse) => void): Request<AppIntegrations.Types.GetApplicationResponse, AWSError>;
  /**
   * This API is in preview release and subject to change. Get an Application resource.
   */
  getApplication(callback?: (err: AWSError, data: AppIntegrations.Types.GetApplicationResponse) => void): Request<AppIntegrations.Types.GetApplicationResponse, AWSError>;
  /**
   * Returns information about the DataIntegration.  You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  getDataIntegration(params: AppIntegrations.Types.GetDataIntegrationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.GetDataIntegrationResponse) => void): Request<AppIntegrations.Types.GetDataIntegrationResponse, AWSError>;
  /**
   * Returns information about the DataIntegration.  You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  getDataIntegration(callback?: (err: AWSError, data: AppIntegrations.Types.GetDataIntegrationResponse) => void): Request<AppIntegrations.Types.GetDataIntegrationResponse, AWSError>;
  /**
   * Returns information about the event integration.
   */
  getEventIntegration(params: AppIntegrations.Types.GetEventIntegrationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.GetEventIntegrationResponse) => void): Request<AppIntegrations.Types.GetEventIntegrationResponse, AWSError>;
  /**
   * Returns information about the event integration.
   */
  getEventIntegration(callback?: (err: AWSError, data: AppIntegrations.Types.GetEventIntegrationResponse) => void): Request<AppIntegrations.Types.GetEventIntegrationResponse, AWSError>;
  /**
   * This API is in preview release and subject to change. Lists applications in the account.
   */
  listApplications(params: AppIntegrations.Types.ListApplicationsRequest, callback?: (err: AWSError, data: AppIntegrations.Types.ListApplicationsResponse) => void): Request<AppIntegrations.Types.ListApplicationsResponse, AWSError>;
  /**
   * This API is in preview release and subject to change. Lists applications in the account.
   */
  listApplications(callback?: (err: AWSError, data: AppIntegrations.Types.ListApplicationsResponse) => void): Request<AppIntegrations.Types.ListApplicationsResponse, AWSError>;
  /**
   * Returns a paginated list of DataIntegration associations in the account.  You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  listDataIntegrationAssociations(params: AppIntegrations.Types.ListDataIntegrationAssociationsRequest, callback?: (err: AWSError, data: AppIntegrations.Types.ListDataIntegrationAssociationsResponse) => void): Request<AppIntegrations.Types.ListDataIntegrationAssociationsResponse, AWSError>;
  /**
   * Returns a paginated list of DataIntegration associations in the account.  You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  listDataIntegrationAssociations(callback?: (err: AWSError, data: AppIntegrations.Types.ListDataIntegrationAssociationsResponse) => void): Request<AppIntegrations.Types.ListDataIntegrationAssociationsResponse, AWSError>;
  /**
   * Returns a paginated list of DataIntegrations in the account.  You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  listDataIntegrations(params: AppIntegrations.Types.ListDataIntegrationsRequest, callback?: (err: AWSError, data: AppIntegrations.Types.ListDataIntegrationsResponse) => void): Request<AppIntegrations.Types.ListDataIntegrationsResponse, AWSError>;
  /**
   * Returns a paginated list of DataIntegrations in the account.  You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  listDataIntegrations(callback?: (err: AWSError, data: AppIntegrations.Types.ListDataIntegrationsResponse) => void): Request<AppIntegrations.Types.ListDataIntegrationsResponse, AWSError>;
  /**
   * Returns a paginated list of event integration associations in the account. 
   */
  listEventIntegrationAssociations(params: AppIntegrations.Types.ListEventIntegrationAssociationsRequest, callback?: (err: AWSError, data: AppIntegrations.Types.ListEventIntegrationAssociationsResponse) => void): Request<AppIntegrations.Types.ListEventIntegrationAssociationsResponse, AWSError>;
  /**
   * Returns a paginated list of event integration associations in the account. 
   */
  listEventIntegrationAssociations(callback?: (err: AWSError, data: AppIntegrations.Types.ListEventIntegrationAssociationsResponse) => void): Request<AppIntegrations.Types.ListEventIntegrationAssociationsResponse, AWSError>;
  /**
   * Returns a paginated list of event integrations in the account.
   */
  listEventIntegrations(params: AppIntegrations.Types.ListEventIntegrationsRequest, callback?: (err: AWSError, data: AppIntegrations.Types.ListEventIntegrationsResponse) => void): Request<AppIntegrations.Types.ListEventIntegrationsResponse, AWSError>;
  /**
   * Returns a paginated list of event integrations in the account.
   */
  listEventIntegrations(callback?: (err: AWSError, data: AppIntegrations.Types.ListEventIntegrationsResponse) => void): Request<AppIntegrations.Types.ListEventIntegrationsResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(params: AppIntegrations.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: AppIntegrations.Types.ListTagsForResourceResponse) => void): Request<AppIntegrations.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: AppIntegrations.Types.ListTagsForResourceResponse) => void): Request<AppIntegrations.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource.
   */
  tagResource(params: AppIntegrations.Types.TagResourceRequest, callback?: (err: AWSError, data: AppIntegrations.Types.TagResourceResponse) => void): Request<AppIntegrations.Types.TagResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: AppIntegrations.Types.TagResourceResponse) => void): Request<AppIntegrations.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(params: AppIntegrations.Types.UntagResourceRequest, callback?: (err: AWSError, data: AppIntegrations.Types.UntagResourceResponse) => void): Request<AppIntegrations.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: AppIntegrations.Types.UntagResourceResponse) => void): Request<AppIntegrations.Types.UntagResourceResponse, AWSError>;
  /**
   * This API is in preview release and subject to change. Updates and persists an Application resource.
   */
  updateApplication(params: AppIntegrations.Types.UpdateApplicationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.UpdateApplicationResponse) => void): Request<AppIntegrations.Types.UpdateApplicationResponse, AWSError>;
  /**
   * This API is in preview release and subject to change. Updates and persists an Application resource.
   */
  updateApplication(callback?: (err: AWSError, data: AppIntegrations.Types.UpdateApplicationResponse) => void): Request<AppIntegrations.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates the description of a DataIntegration.  You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  updateDataIntegration(params: AppIntegrations.Types.UpdateDataIntegrationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.UpdateDataIntegrationResponse) => void): Request<AppIntegrations.Types.UpdateDataIntegrationResponse, AWSError>;
  /**
   * Updates the description of a DataIntegration.  You cannot create a DataIntegration association for a DataIntegration that has been previously associated. Use a different DataIntegration, or recreate the DataIntegration using the CreateDataIntegration API. 
   */
  updateDataIntegration(callback?: (err: AWSError, data: AppIntegrations.Types.UpdateDataIntegrationResponse) => void): Request<AppIntegrations.Types.UpdateDataIntegrationResponse, AWSError>;
  /**
   * Updates the description of an event integration.
   */
  updateEventIntegration(params: AppIntegrations.Types.UpdateEventIntegrationRequest, callback?: (err: AWSError, data: AppIntegrations.Types.UpdateEventIntegrationResponse) => void): Request<AppIntegrations.Types.UpdateEventIntegrationResponse, AWSError>;
  /**
   * Updates the description of an event integration.
   */
  updateEventIntegration(callback?: (err: AWSError, data: AppIntegrations.Types.UpdateEventIntegrationResponse) => void): Request<AppIntegrations.Types.UpdateEventIntegrationResponse, AWSError>;
}
declare namespace AppIntegrations {
  export type ApplicationApprovedOrigins = ApplicationTrustedSource[];
  export type ApplicationName = string;
  export type ApplicationNamespace = string;
  export interface ApplicationSourceConfig {
    /**
     * The external URL source for the application.
     */
    ExternalUrlConfig?: ExternalUrlConfig;
  }
  export interface ApplicationSummary {
    /**
     * The Amazon Resource Name (ARN) of the Application.
     */
    Arn?: Arn;
    /**
     * A unique identifier for the Application.
     */
    Id?: UUID;
    /**
     * The name of the application.
     */
    Name?: ApplicationName;
    /**
     * The namespace of the application.
     */
    Namespace?: ApplicationNamespace;
    /**
     * The time when the application was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The time when the application was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export type ApplicationTrustedSource = string;
  export type ApplicationsList = ApplicationSummary[];
  export type Arn = string;
  export type ArnOrUUID = string;
  export type ClientAssociationMetadata = {[key: string]: NonBlankString};
  export type ClientId = string;
  export interface CreateApplicationRequest {
    /**
     * The name of the application.
     */
    Name: ApplicationName;
    /**
     * The namespace of the application.
     */
    Namespace: ApplicationNamespace;
    /**
     * The description of the application.
     */
    Description?: Description;
    /**
     * The configuration for where the application should be loaded from.
     */
    ApplicationSourceConfig: ApplicationSourceConfig;
    /**
     * The events that the application subscribes.
     */
    Subscriptions?: SubscriptionList;
    /**
     * The events that the application publishes.
     */
    Publications?: PublicationList;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, the Amazon Web Services SDK populates this field. For more information about idempotency, see Making retries safe with idempotent APIs.
     */
    ClientToken?: IdempotencyToken;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    Tags?: TagMap;
  }
  export interface CreateApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the Application.
     */
    Arn?: Arn;
    /**
     * A unique identifier for the Application.
     */
    Id?: UUID;
  }
  export interface CreateDataIntegrationRequest {
    /**
     * The name of the DataIntegration.
     */
    Name: Name;
    /**
     * A description of the DataIntegration.
     */
    Description?: Description;
    /**
     * The KMS key for the DataIntegration.
     */
    KmsKey: NonBlankString;
    /**
     * The URI of the data source.
     */
    SourceURI: SourceURI;
    /**
     * The name of the data and how often it should be pulled from the source.
     */
    ScheduleConfig: ScheduleConfiguration;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    Tags?: TagMap;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, the Amazon Web Services SDK populates this field. For more information about idempotency, see Making retries safe with idempotent APIs.
     */
    ClientToken?: IdempotencyToken;
    /**
     * The configuration for what files should be pulled from the source.
     */
    FileConfiguration?: FileConfiguration;
    /**
     * The configuration for what data should be pulled from the source.
     */
    ObjectConfiguration?: ObjectConfiguration;
  }
  export interface CreateDataIntegrationResponse {
    /**
     * The Amazon Resource Name (ARN)
     */
    Arn?: Arn;
    /**
     * A unique identifier.
     */
    Id?: UUID;
    /**
     * The name of the DataIntegration.
     */
    Name?: Name;
    /**
     * A description of the DataIntegration.
     */
    Description?: Description;
    /**
     * The KMS key for the DataIntegration.
     */
    KmsKey?: NonBlankString;
    /**
     * The URI of the data source.
     */
    SourceURI?: SourceURI;
    /**
     * The name of the data and how often it should be pulled from the source.
     */
    ScheduleConfiguration?: ScheduleConfiguration;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    Tags?: TagMap;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, the Amazon Web Services SDK populates this field. For more information about idempotency, see Making retries safe with idempotent APIs.
     */
    ClientToken?: IdempotencyToken;
    /**
     * The configuration for what files should be pulled from the source.
     */
    FileConfiguration?: FileConfiguration;
    /**
     * The configuration for what data should be pulled from the source.
     */
    ObjectConfiguration?: ObjectConfiguration;
  }
  export interface CreateEventIntegrationRequest {
    /**
     * The name of the event integration.
     */
    Name: Name;
    /**
     * The description of the event integration.
     */
    Description?: Description;
    /**
     * The event filter.
     */
    EventFilter: EventFilter;
    /**
     * The EventBridge bus.
     */
    EventBridgeBus: EventBridgeBus;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, the Amazon Web Services SDK populates this field. For more information about idempotency, see Making retries safe with idempotent APIs.
     */
    ClientToken?: IdempotencyToken;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    Tags?: TagMap;
  }
  export interface CreateEventIntegrationResponse {
    /**
     * The Amazon Resource Name (ARN) of the event integration. 
     */
    EventIntegrationArn?: Arn;
  }
  export interface DataIntegrationAssociationSummary {
    /**
     * The Amazon Resource Name (ARN) of the DataIntegration association.
     */
    DataIntegrationAssociationArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the DataIntegration.
     */
    DataIntegrationArn?: Arn;
    /**
     * The identifier for the client that is associated with the DataIntegration association.
     */
    ClientId?: ClientId;
  }
  export type DataIntegrationAssociationsList = DataIntegrationAssociationSummary[];
  export interface DataIntegrationSummary {
    /**
     * The Amazon Resource Name (ARN) of the DataIntegration.
     */
    Arn?: Arn;
    /**
     * The name of the DataIntegration.
     */
    Name?: Name;
    /**
     * The URI of the data source.
     */
    SourceURI?: SourceURI;
  }
  export type DataIntegrationsList = DataIntegrationSummary[];
  export interface DeleteDataIntegrationRequest {
    /**
     * A unique identifier for the DataIntegration.
     */
    DataIntegrationIdentifier: Identifier;
  }
  export interface DeleteDataIntegrationResponse {
  }
  export interface DeleteEventIntegrationRequest {
    /**
     * The name of the event integration.
     */
    Name: Name;
  }
  export interface DeleteEventIntegrationResponse {
  }
  export type Description = string;
  export type EventBridgeBus = string;
  export type EventBridgeRuleName = string;
  export type EventDefinitionSchema = string;
  export interface EventFilter {
    /**
     * The source of the events.
     */
    Source: Source;
  }
  export interface EventIntegration {
    /**
     * The Amazon Resource Name (ARN) of the event integration.
     */
    EventIntegrationArn?: Arn;
    /**
     * The name of the event integration.
     */
    Name?: Name;
    /**
     * The event integration description.
     */
    Description?: Description;
    /**
     * The event integration filter.
     */
    EventFilter?: EventFilter;
    /**
     * The Amazon EventBridge bus for the event integration.
     */
    EventBridgeBus?: EventBridgeBus;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    Tags?: TagMap;
  }
  export interface EventIntegrationAssociation {
    /**
     * The Amazon Resource Name (ARN) for the event integration association.
     */
    EventIntegrationAssociationArn?: Arn;
    /**
     * The identifier for the event integration association.
     */
    EventIntegrationAssociationId?: UUID;
    /**
     * The name of the event integration.
     */
    EventIntegrationName?: Name;
    /**
     * The identifier for the client that is associated with the event integration.
     */
    ClientId?: ClientId;
    /**
     * The name of the EventBridge rule.
     */
    EventBridgeRuleName?: EventBridgeRuleName;
    /**
     * The metadata associated with the client.
     */
    ClientAssociationMetadata?: ClientAssociationMetadata;
  }
  export type EventIntegrationAssociationsList = EventIntegrationAssociation[];
  export type EventIntegrationsList = EventIntegration[];
  export type EventName = string;
  export interface ExternalUrlConfig {
    /**
     * The URL to access the application.
     */
    AccessUrl: URL;
    /**
     * Additional URLs to allow list if different than the access URL.
     */
    ApprovedOrigins?: ApplicationApprovedOrigins;
  }
  export type Fields = string;
  export type FieldsList = Fields[];
  export type FieldsMap = {[key: string]: FieldsList};
  export interface FileConfiguration {
    /**
     * Identifiers for the source folders to pull all files from recursively.
     */
    Folders: FolderList;
    /**
     * Restrictions for what files should be pulled from the source.
     */
    Filters?: FieldsMap;
  }
  export type FolderList = NonBlankLongString[];
  export interface GetApplicationRequest {
    /**
     * The Amazon Resource Name (ARN) of the Application.
     */
    Arn: ArnOrUUID;
  }
  export interface GetApplicationResponse {
    /**
     * The Amazon Resource Name (ARN) of the Application.
     */
    Arn?: Arn;
    /**
     * A unique identifier for the Application.
     */
    Id?: UUID;
    /**
     * The name of the application.
     */
    Name?: ApplicationName;
    /**
     * The namespace of the application.
     */
    Namespace?: ApplicationNamespace;
    /**
     * The description of the application.
     */
    Description?: Description;
    /**
     * The configuration for where the application should be loaded from.
     */
    ApplicationSourceConfig?: ApplicationSourceConfig;
    /**
     * The events that the application subscribes.
     */
    Subscriptions?: SubscriptionList;
    /**
     * The events that the application publishes.
     */
    Publications?: PublicationList;
    /**
     * The created time of the Application.
     */
    CreatedTime?: Timestamp;
    /**
     * The last modified time of the Application.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    Tags?: TagMap;
  }
  export interface GetDataIntegrationRequest {
    /**
     * A unique identifier.
     */
    Identifier: Identifier;
  }
  export interface GetDataIntegrationResponse {
    /**
     * The Amazon Resource Name (ARN) for the DataIntegration.
     */
    Arn?: Arn;
    /**
     * A unique identifier.
     */
    Id?: UUID;
    /**
     * The name of the DataIntegration.
     */
    Name?: Name;
    /**
     * The KMS key for the DataIntegration.
     */
    Description?: Description;
    /**
     * The KMS key for the DataIntegration.
     */
    KmsKey?: NonBlankString;
    /**
     * The URI of the data source.
     */
    SourceURI?: SourceURI;
    /**
     * The name of the data and how often it should be pulled from the source.
     */
    ScheduleConfiguration?: ScheduleConfiguration;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    Tags?: TagMap;
    /**
     * The configuration for what files should be pulled from the source.
     */
    FileConfiguration?: FileConfiguration;
    /**
     * The configuration for what data should be pulled from the source.
     */
    ObjectConfiguration?: ObjectConfiguration;
  }
  export interface GetEventIntegrationRequest {
    /**
     * The name of the event integration. 
     */
    Name: Name;
  }
  export interface GetEventIntegrationResponse {
    /**
     * The name of the event integration. 
     */
    Name?: Name;
    /**
     * The description of the event integration.
     */
    Description?: Description;
    /**
     * The Amazon Resource Name (ARN) for the event integration.
     */
    EventIntegrationArn?: Arn;
    /**
     * The EventBridge bus.
     */
    EventBridgeBus?: EventBridgeBus;
    /**
     * The event filter.
     */
    EventFilter?: EventFilter;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    Tags?: TagMap;
  }
  export type IdempotencyToken = string;
  export type Identifier = string;
  export interface ListApplicationsRequest {
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResults;
  }
  export interface ListApplicationsResponse {
    /**
     * The Applications associated with this account.
     */
    Applications?: ApplicationsList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListDataIntegrationAssociationsRequest {
    /**
     * A unique identifier for the DataIntegration.
     */
    DataIntegrationIdentifier: Identifier;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDataIntegrationAssociationsResponse {
    /**
     * The Amazon Resource Name (ARN) and unique ID of the DataIntegration association.
     */
    DataIntegrationAssociations?: DataIntegrationAssociationsList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListDataIntegrationsRequest {
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDataIntegrationsResponse {
    /**
     * The DataIntegrations associated with this account.
     */
    DataIntegrations?: DataIntegrationsList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEventIntegrationAssociationsRequest {
    /**
     * The name of the event integration. 
     */
    EventIntegrationName: Name;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResults;
  }
  export interface ListEventIntegrationAssociationsResponse {
    /**
     * The event integration associations.
     */
    EventIntegrationAssociations?: EventIntegrationAssociationsList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEventIntegrationsRequest {
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return per page.
     */
    MaxResults?: MaxResults;
  }
  export interface ListEventIntegrationsResponse {
    /**
     * The event integrations.
     */
    EventIntegrations?: EventIntegrationsList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. 
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Information about the tags.
     */
    tags?: TagMap;
  }
  export type MaxResults = number;
  export type Name = string;
  export type NextToken = string;
  export type NonBlankLongString = string;
  export type NonBlankString = string;
  export type Object = string;
  export type ObjectConfiguration = {[key: string]: FieldsMap};
  export interface Publication {
    /**
     * The name of the publication.
     */
    Event: EventName;
    /**
     * The JSON schema of the publication event.
     */
    Schema: EventDefinitionSchema;
    /**
     * The description of the publication.
     */
    Description?: Description;
  }
  export type PublicationList = Publication[];
  export interface ScheduleConfiguration {
    /**
     * The start date for objects to import in the first flow run as an Unix/epoch timestamp in milliseconds or in ISO-8601 format.
     */
    FirstExecutionFrom?: NonBlankString;
    /**
     * The name of the object to pull from the data source.
     */
    Object?: Object;
    /**
     * How often the data should be pulled from data source.
     */
    ScheduleExpression: NonBlankString;
  }
  export type Source = string;
  export type SourceURI = string;
  export interface Subscription {
    /**
     * The name of the subscription.
     */
    Event: EventName;
    /**
     * The description of the subscription.
     */
    Description?: Description;
  }
  export type SubscriptionList = Subscription[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
    /**
     * The tags used to organize, track, or control access for this resource. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type URL = string;
  export type UUID = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
    /**
     * The tag keys.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateApplicationRequest {
    /**
     * The Amazon Resource Name (ARN) of the Application.
     */
    Arn: ArnOrUUID;
    /**
     * The name of the application.
     */
    Name?: ApplicationName;
    /**
     * The description of the application.
     */
    Description?: Description;
    /**
     * The configuration for where the application should be loaded from.
     */
    ApplicationSourceConfig?: ApplicationSourceConfig;
    /**
     * The events that the application subscribes.
     */
    Subscriptions?: SubscriptionList;
    /**
     * The events that the application publishes.
     */
    Publications?: PublicationList;
  }
  export interface UpdateApplicationResponse {
  }
  export interface UpdateDataIntegrationRequest {
    /**
     * A unique identifier for the DataIntegration.
     */
    Identifier: Identifier;
    /**
     * The name of the DataIntegration.
     */
    Name?: Name;
    /**
     * A description of the DataIntegration.
     */
    Description?: Description;
  }
  export interface UpdateDataIntegrationResponse {
  }
  export interface UpdateEventIntegrationRequest {
    /**
     * The name of the event integration.
     */
    Name: Name;
    /**
     * The description of the event integration.
     */
    Description?: Description;
  }
  export interface UpdateEventIntegrationResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-07-29"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AppIntegrations client.
   */
  export import Types = AppIntegrations;
}
export = AppIntegrations;
