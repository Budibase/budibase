import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Wisdom extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Wisdom.Types.ClientConfiguration)
  config: Config & Wisdom.Types.ClientConfiguration;
  /**
   * Creates an Amazon Connect Wisdom assistant.
   */
  createAssistant(params: Wisdom.Types.CreateAssistantRequest, callback?: (err: AWSError, data: Wisdom.Types.CreateAssistantResponse) => void): Request<Wisdom.Types.CreateAssistantResponse, AWSError>;
  /**
   * Creates an Amazon Connect Wisdom assistant.
   */
  createAssistant(callback?: (err: AWSError, data: Wisdom.Types.CreateAssistantResponse) => void): Request<Wisdom.Types.CreateAssistantResponse, AWSError>;
  /**
   * Creates an association between an Amazon Connect Wisdom assistant and another resource. Currently, the only supported association is with a knowledge base. An assistant can have only a single association.
   */
  createAssistantAssociation(params: Wisdom.Types.CreateAssistantAssociationRequest, callback?: (err: AWSError, data: Wisdom.Types.CreateAssistantAssociationResponse) => void): Request<Wisdom.Types.CreateAssistantAssociationResponse, AWSError>;
  /**
   * Creates an association between an Amazon Connect Wisdom assistant and another resource. Currently, the only supported association is with a knowledge base. An assistant can have only a single association.
   */
  createAssistantAssociation(callback?: (err: AWSError, data: Wisdom.Types.CreateAssistantAssociationResponse) => void): Request<Wisdom.Types.CreateAssistantAssociationResponse, AWSError>;
  /**
   * Creates Wisdom content. Before to calling this API, use StartContentUpload to upload an asset.
   */
  createContent(params: Wisdom.Types.CreateContentRequest, callback?: (err: AWSError, data: Wisdom.Types.CreateContentResponse) => void): Request<Wisdom.Types.CreateContentResponse, AWSError>;
  /**
   * Creates Wisdom content. Before to calling this API, use StartContentUpload to upload an asset.
   */
  createContent(callback?: (err: AWSError, data: Wisdom.Types.CreateContentResponse) => void): Request<Wisdom.Types.CreateContentResponse, AWSError>;
  /**
   * Creates a knowledge base.  When using this API, you cannot reuse Amazon AppIntegrations DataIntegrations with external knowledge bases such as Salesforce and ServiceNow. If you do, you'll get an InvalidRequestException error.   &lt;p&gt;For example, you're programmatically managing your external knowledge base, and you want to add or remove one of the fields that is being ingested from Salesforce. Do the following:&lt;/p&gt; &lt;ol&gt; &lt;li&gt; &lt;p&gt;Call &lt;a href=&quot;https://docs.aws.amazon.com/wisdom/latest/APIReference/API_DeleteKnowledgeBase.html&quot;&gt;DeleteKnowledgeBase&lt;/a&gt;.&lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt;Call &lt;a href=&quot;https://docs.aws.amazon.com/appintegrations/latest/APIReference/API_DeleteDataIntegration.html&quot;&gt;DeleteDataIntegration&lt;/a&gt;.&lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt;Call &lt;a href=&quot;https://docs.aws.amazon.com/appintegrations/latest/APIReference/API_CreateDataIntegration.html&quot;&gt;CreateDataIntegration&lt;/a&gt; to recreate the DataIntegration or a create different one.&lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt;Call CreateKnowledgeBase.&lt;/p&gt; &lt;/li&gt; &lt;/ol&gt; &lt;/note&gt; 
   */
  createKnowledgeBase(params: Wisdom.Types.CreateKnowledgeBaseRequest, callback?: (err: AWSError, data: Wisdom.Types.CreateKnowledgeBaseResponse) => void): Request<Wisdom.Types.CreateKnowledgeBaseResponse, AWSError>;
  /**
   * Creates a knowledge base.  When using this API, you cannot reuse Amazon AppIntegrations DataIntegrations with external knowledge bases such as Salesforce and ServiceNow. If you do, you'll get an InvalidRequestException error.   &lt;p&gt;For example, you're programmatically managing your external knowledge base, and you want to add or remove one of the fields that is being ingested from Salesforce. Do the following:&lt;/p&gt; &lt;ol&gt; &lt;li&gt; &lt;p&gt;Call &lt;a href=&quot;https://docs.aws.amazon.com/wisdom/latest/APIReference/API_DeleteKnowledgeBase.html&quot;&gt;DeleteKnowledgeBase&lt;/a&gt;.&lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt;Call &lt;a href=&quot;https://docs.aws.amazon.com/appintegrations/latest/APIReference/API_DeleteDataIntegration.html&quot;&gt;DeleteDataIntegration&lt;/a&gt;.&lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt;Call &lt;a href=&quot;https://docs.aws.amazon.com/appintegrations/latest/APIReference/API_CreateDataIntegration.html&quot;&gt;CreateDataIntegration&lt;/a&gt; to recreate the DataIntegration or a create different one.&lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt;Call CreateKnowledgeBase.&lt;/p&gt; &lt;/li&gt; &lt;/ol&gt; &lt;/note&gt; 
   */
  createKnowledgeBase(callback?: (err: AWSError, data: Wisdom.Types.CreateKnowledgeBaseResponse) => void): Request<Wisdom.Types.CreateKnowledgeBaseResponse, AWSError>;
  /**
   * Creates a session. A session is a contextual container used for generating recommendations. Amazon Connect creates a new Wisdom session for each contact on which Wisdom is enabled.
   */
  createSession(params: Wisdom.Types.CreateSessionRequest, callback?: (err: AWSError, data: Wisdom.Types.CreateSessionResponse) => void): Request<Wisdom.Types.CreateSessionResponse, AWSError>;
  /**
   * Creates a session. A session is a contextual container used for generating recommendations. Amazon Connect creates a new Wisdom session for each contact on which Wisdom is enabled.
   */
  createSession(callback?: (err: AWSError, data: Wisdom.Types.CreateSessionResponse) => void): Request<Wisdom.Types.CreateSessionResponse, AWSError>;
  /**
   * Deletes an assistant.
   */
  deleteAssistant(params: Wisdom.Types.DeleteAssistantRequest, callback?: (err: AWSError, data: Wisdom.Types.DeleteAssistantResponse) => void): Request<Wisdom.Types.DeleteAssistantResponse, AWSError>;
  /**
   * Deletes an assistant.
   */
  deleteAssistant(callback?: (err: AWSError, data: Wisdom.Types.DeleteAssistantResponse) => void): Request<Wisdom.Types.DeleteAssistantResponse, AWSError>;
  /**
   * Deletes an assistant association.
   */
  deleteAssistantAssociation(params: Wisdom.Types.DeleteAssistantAssociationRequest, callback?: (err: AWSError, data: Wisdom.Types.DeleteAssistantAssociationResponse) => void): Request<Wisdom.Types.DeleteAssistantAssociationResponse, AWSError>;
  /**
   * Deletes an assistant association.
   */
  deleteAssistantAssociation(callback?: (err: AWSError, data: Wisdom.Types.DeleteAssistantAssociationResponse) => void): Request<Wisdom.Types.DeleteAssistantAssociationResponse, AWSError>;
  /**
   * Deletes the content.
   */
  deleteContent(params: Wisdom.Types.DeleteContentRequest, callback?: (err: AWSError, data: Wisdom.Types.DeleteContentResponse) => void): Request<Wisdom.Types.DeleteContentResponse, AWSError>;
  /**
   * Deletes the content.
   */
  deleteContent(callback?: (err: AWSError, data: Wisdom.Types.DeleteContentResponse) => void): Request<Wisdom.Types.DeleteContentResponse, AWSError>;
  /**
   * Deletes the knowledge base.  When you use this API to delete an external knowledge base such as Salesforce or ServiceNow, you must also delete the Amazon AppIntegrations DataIntegration. This is because you can't reuse the DataIntegration after it's been associated with an external knowledge base. However, you can delete and recreate it. See DeleteDataIntegration and CreateDataIntegration in the Amazon AppIntegrations API Reference. 
   */
  deleteKnowledgeBase(params: Wisdom.Types.DeleteKnowledgeBaseRequest, callback?: (err: AWSError, data: Wisdom.Types.DeleteKnowledgeBaseResponse) => void): Request<Wisdom.Types.DeleteKnowledgeBaseResponse, AWSError>;
  /**
   * Deletes the knowledge base.  When you use this API to delete an external knowledge base such as Salesforce or ServiceNow, you must also delete the Amazon AppIntegrations DataIntegration. This is because you can't reuse the DataIntegration after it's been associated with an external knowledge base. However, you can delete and recreate it. See DeleteDataIntegration and CreateDataIntegration in the Amazon AppIntegrations API Reference. 
   */
  deleteKnowledgeBase(callback?: (err: AWSError, data: Wisdom.Types.DeleteKnowledgeBaseResponse) => void): Request<Wisdom.Types.DeleteKnowledgeBaseResponse, AWSError>;
  /**
   * Retrieves information about an assistant.
   */
  getAssistant(params: Wisdom.Types.GetAssistantRequest, callback?: (err: AWSError, data: Wisdom.Types.GetAssistantResponse) => void): Request<Wisdom.Types.GetAssistantResponse, AWSError>;
  /**
   * Retrieves information about an assistant.
   */
  getAssistant(callback?: (err: AWSError, data: Wisdom.Types.GetAssistantResponse) => void): Request<Wisdom.Types.GetAssistantResponse, AWSError>;
  /**
   * Retrieves information about an assistant association.
   */
  getAssistantAssociation(params: Wisdom.Types.GetAssistantAssociationRequest, callback?: (err: AWSError, data: Wisdom.Types.GetAssistantAssociationResponse) => void): Request<Wisdom.Types.GetAssistantAssociationResponse, AWSError>;
  /**
   * Retrieves information about an assistant association.
   */
  getAssistantAssociation(callback?: (err: AWSError, data: Wisdom.Types.GetAssistantAssociationResponse) => void): Request<Wisdom.Types.GetAssistantAssociationResponse, AWSError>;
  /**
   * Retrieves content, including a pre-signed URL to download the content.
   */
  getContent(params: Wisdom.Types.GetContentRequest, callback?: (err: AWSError, data: Wisdom.Types.GetContentResponse) => void): Request<Wisdom.Types.GetContentResponse, AWSError>;
  /**
   * Retrieves content, including a pre-signed URL to download the content.
   */
  getContent(callback?: (err: AWSError, data: Wisdom.Types.GetContentResponse) => void): Request<Wisdom.Types.GetContentResponse, AWSError>;
  /**
   * Retrieves summary information about the content.
   */
  getContentSummary(params: Wisdom.Types.GetContentSummaryRequest, callback?: (err: AWSError, data: Wisdom.Types.GetContentSummaryResponse) => void): Request<Wisdom.Types.GetContentSummaryResponse, AWSError>;
  /**
   * Retrieves summary information about the content.
   */
  getContentSummary(callback?: (err: AWSError, data: Wisdom.Types.GetContentSummaryResponse) => void): Request<Wisdom.Types.GetContentSummaryResponse, AWSError>;
  /**
   * Retrieves information about the knowledge base.
   */
  getKnowledgeBase(params: Wisdom.Types.GetKnowledgeBaseRequest, callback?: (err: AWSError, data: Wisdom.Types.GetKnowledgeBaseResponse) => void): Request<Wisdom.Types.GetKnowledgeBaseResponse, AWSError>;
  /**
   * Retrieves information about the knowledge base.
   */
  getKnowledgeBase(callback?: (err: AWSError, data: Wisdom.Types.GetKnowledgeBaseResponse) => void): Request<Wisdom.Types.GetKnowledgeBaseResponse, AWSError>;
  /**
   * Retrieves recommendations for the specified session. To avoid retrieving the same recommendations in subsequent calls, use NotifyRecommendationsReceived. This API supports long-polling behavior with the waitTimeSeconds parameter. Short poll is the default behavior and only returns recommendations already available. To perform a manual query against an assistant, use QueryAssistant.
   */
  getRecommendations(params: Wisdom.Types.GetRecommendationsRequest, callback?: (err: AWSError, data: Wisdom.Types.GetRecommendationsResponse) => void): Request<Wisdom.Types.GetRecommendationsResponse, AWSError>;
  /**
   * Retrieves recommendations for the specified session. To avoid retrieving the same recommendations in subsequent calls, use NotifyRecommendationsReceived. This API supports long-polling behavior with the waitTimeSeconds parameter. Short poll is the default behavior and only returns recommendations already available. To perform a manual query against an assistant, use QueryAssistant.
   */
  getRecommendations(callback?: (err: AWSError, data: Wisdom.Types.GetRecommendationsResponse) => void): Request<Wisdom.Types.GetRecommendationsResponse, AWSError>;
  /**
   * Retrieves information for a specified session.
   */
  getSession(params: Wisdom.Types.GetSessionRequest, callback?: (err: AWSError, data: Wisdom.Types.GetSessionResponse) => void): Request<Wisdom.Types.GetSessionResponse, AWSError>;
  /**
   * Retrieves information for a specified session.
   */
  getSession(callback?: (err: AWSError, data: Wisdom.Types.GetSessionResponse) => void): Request<Wisdom.Types.GetSessionResponse, AWSError>;
  /**
   * Lists information about assistant associations.
   */
  listAssistantAssociations(params: Wisdom.Types.ListAssistantAssociationsRequest, callback?: (err: AWSError, data: Wisdom.Types.ListAssistantAssociationsResponse) => void): Request<Wisdom.Types.ListAssistantAssociationsResponse, AWSError>;
  /**
   * Lists information about assistant associations.
   */
  listAssistantAssociations(callback?: (err: AWSError, data: Wisdom.Types.ListAssistantAssociationsResponse) => void): Request<Wisdom.Types.ListAssistantAssociationsResponse, AWSError>;
  /**
   * Lists information about assistants.
   */
  listAssistants(params: Wisdom.Types.ListAssistantsRequest, callback?: (err: AWSError, data: Wisdom.Types.ListAssistantsResponse) => void): Request<Wisdom.Types.ListAssistantsResponse, AWSError>;
  /**
   * Lists information about assistants.
   */
  listAssistants(callback?: (err: AWSError, data: Wisdom.Types.ListAssistantsResponse) => void): Request<Wisdom.Types.ListAssistantsResponse, AWSError>;
  /**
   * Lists the content.
   */
  listContents(params: Wisdom.Types.ListContentsRequest, callback?: (err: AWSError, data: Wisdom.Types.ListContentsResponse) => void): Request<Wisdom.Types.ListContentsResponse, AWSError>;
  /**
   * Lists the content.
   */
  listContents(callback?: (err: AWSError, data: Wisdom.Types.ListContentsResponse) => void): Request<Wisdom.Types.ListContentsResponse, AWSError>;
  /**
   * Lists the knowledge bases.
   */
  listKnowledgeBases(params: Wisdom.Types.ListKnowledgeBasesRequest, callback?: (err: AWSError, data: Wisdom.Types.ListKnowledgeBasesResponse) => void): Request<Wisdom.Types.ListKnowledgeBasesResponse, AWSError>;
  /**
   * Lists the knowledge bases.
   */
  listKnowledgeBases(callback?: (err: AWSError, data: Wisdom.Types.ListKnowledgeBasesResponse) => void): Request<Wisdom.Types.ListKnowledgeBasesResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(params: Wisdom.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Wisdom.Types.ListTagsForResourceResponse) => void): Request<Wisdom.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Wisdom.Types.ListTagsForResourceResponse) => void): Request<Wisdom.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Removes the specified recommendations from the specified assistant's queue of newly available recommendations. You can use this API in conjunction with GetRecommendations and a waitTimeSeconds input for long-polling behavior and avoiding duplicate recommendations.
   */
  notifyRecommendationsReceived(params: Wisdom.Types.NotifyRecommendationsReceivedRequest, callback?: (err: AWSError, data: Wisdom.Types.NotifyRecommendationsReceivedResponse) => void): Request<Wisdom.Types.NotifyRecommendationsReceivedResponse, AWSError>;
  /**
   * Removes the specified recommendations from the specified assistant's queue of newly available recommendations. You can use this API in conjunction with GetRecommendations and a waitTimeSeconds input for long-polling behavior and avoiding duplicate recommendations.
   */
  notifyRecommendationsReceived(callback?: (err: AWSError, data: Wisdom.Types.NotifyRecommendationsReceivedResponse) => void): Request<Wisdom.Types.NotifyRecommendationsReceivedResponse, AWSError>;
  /**
   * Performs a manual search against the specified assistant. To retrieve recommendations for an assistant, use GetRecommendations. 
   */
  queryAssistant(params: Wisdom.Types.QueryAssistantRequest, callback?: (err: AWSError, data: Wisdom.Types.QueryAssistantResponse) => void): Request<Wisdom.Types.QueryAssistantResponse, AWSError>;
  /**
   * Performs a manual search against the specified assistant. To retrieve recommendations for an assistant, use GetRecommendations. 
   */
  queryAssistant(callback?: (err: AWSError, data: Wisdom.Types.QueryAssistantResponse) => void): Request<Wisdom.Types.QueryAssistantResponse, AWSError>;
  /**
   * Removes a URI template from a knowledge base.
   */
  removeKnowledgeBaseTemplateUri(params: Wisdom.Types.RemoveKnowledgeBaseTemplateUriRequest, callback?: (err: AWSError, data: Wisdom.Types.RemoveKnowledgeBaseTemplateUriResponse) => void): Request<Wisdom.Types.RemoveKnowledgeBaseTemplateUriResponse, AWSError>;
  /**
   * Removes a URI template from a knowledge base.
   */
  removeKnowledgeBaseTemplateUri(callback?: (err: AWSError, data: Wisdom.Types.RemoveKnowledgeBaseTemplateUriResponse) => void): Request<Wisdom.Types.RemoveKnowledgeBaseTemplateUriResponse, AWSError>;
  /**
   * Searches for content in a specified knowledge base. Can be used to get a specific content resource by its name.
   */
  searchContent(params: Wisdom.Types.SearchContentRequest, callback?: (err: AWSError, data: Wisdom.Types.SearchContentResponse) => void): Request<Wisdom.Types.SearchContentResponse, AWSError>;
  /**
   * Searches for content in a specified knowledge base. Can be used to get a specific content resource by its name.
   */
  searchContent(callback?: (err: AWSError, data: Wisdom.Types.SearchContentResponse) => void): Request<Wisdom.Types.SearchContentResponse, AWSError>;
  /**
   * Searches for sessions.
   */
  searchSessions(params: Wisdom.Types.SearchSessionsRequest, callback?: (err: AWSError, data: Wisdom.Types.SearchSessionsResponse) => void): Request<Wisdom.Types.SearchSessionsResponse, AWSError>;
  /**
   * Searches for sessions.
   */
  searchSessions(callback?: (err: AWSError, data: Wisdom.Types.SearchSessionsResponse) => void): Request<Wisdom.Types.SearchSessionsResponse, AWSError>;
  /**
   * Get a URL to upload content to a knowledge base. To upload content, first make a PUT request to the returned URL with your file, making sure to include the required headers. Then use CreateContent to finalize the content creation process or UpdateContent to modify an existing resource. You can only upload content to a knowledge base of type CUSTOM.
   */
  startContentUpload(params: Wisdom.Types.StartContentUploadRequest, callback?: (err: AWSError, data: Wisdom.Types.StartContentUploadResponse) => void): Request<Wisdom.Types.StartContentUploadResponse, AWSError>;
  /**
   * Get a URL to upload content to a knowledge base. To upload content, first make a PUT request to the returned URL with your file, making sure to include the required headers. Then use CreateContent to finalize the content creation process or UpdateContent to modify an existing resource. You can only upload content to a knowledge base of type CUSTOM.
   */
  startContentUpload(callback?: (err: AWSError, data: Wisdom.Types.StartContentUploadResponse) => void): Request<Wisdom.Types.StartContentUploadResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource.
   */
  tagResource(params: Wisdom.Types.TagResourceRequest, callback?: (err: AWSError, data: Wisdom.Types.TagResourceResponse) => void): Request<Wisdom.Types.TagResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: Wisdom.Types.TagResourceResponse) => void): Request<Wisdom.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(params: Wisdom.Types.UntagResourceRequest, callback?: (err: AWSError, data: Wisdom.Types.UntagResourceResponse) => void): Request<Wisdom.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: Wisdom.Types.UntagResourceResponse) => void): Request<Wisdom.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates information about the content.
   */
  updateContent(params: Wisdom.Types.UpdateContentRequest, callback?: (err: AWSError, data: Wisdom.Types.UpdateContentResponse) => void): Request<Wisdom.Types.UpdateContentResponse, AWSError>;
  /**
   * Updates information about the content.
   */
  updateContent(callback?: (err: AWSError, data: Wisdom.Types.UpdateContentResponse) => void): Request<Wisdom.Types.UpdateContentResponse, AWSError>;
  /**
   * Updates the template URI of a knowledge base. This is only supported for knowledge bases of type EXTERNAL. Include a single variable in ${variable} format; this interpolated by Wisdom using ingested content. For example, if you ingest a Salesforce article, it has an Id value, and you can set the template URI to https://myInstanceName.lightning.force.com/lightning/r/Knowledge__kav/*${Id}*view. 
   */
  updateKnowledgeBaseTemplateUri(params: Wisdom.Types.UpdateKnowledgeBaseTemplateUriRequest, callback?: (err: AWSError, data: Wisdom.Types.UpdateKnowledgeBaseTemplateUriResponse) => void): Request<Wisdom.Types.UpdateKnowledgeBaseTemplateUriResponse, AWSError>;
  /**
   * Updates the template URI of a knowledge base. This is only supported for knowledge bases of type EXTERNAL. Include a single variable in ${variable} format; this interpolated by Wisdom using ingested content. For example, if you ingest a Salesforce article, it has an Id value, and you can set the template URI to https://myInstanceName.lightning.force.com/lightning/r/Knowledge__kav/*${Id}*view. 
   */
  updateKnowledgeBaseTemplateUri(callback?: (err: AWSError, data: Wisdom.Types.UpdateKnowledgeBaseTemplateUriResponse) => void): Request<Wisdom.Types.UpdateKnowledgeBaseTemplateUriResponse, AWSError>;
}
declare namespace Wisdom {
  export interface AppIntegrationsConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the AppIntegrations DataIntegration to use for ingesting content.
     */
    appIntegrationArn: GenericArn;
    /**
     * The fields from the source that are made available to your agents in Wisdom.     For  Salesforce, you must include at least Id, ArticleNumber, VersionNumber, Title, PublishStatus, and IsDeleted.    For  ServiceNow, you must include at least number, short_description, sys_mod_count, workflow_state, and active.    Make sure to include additional field(s); these are indexed and used to source recommendations. 
     */
    objectFields: ObjectFieldsList;
  }
  export type Arn = string;
  export interface AssistantAssociationData {
    /**
     * The Amazon Resource Name (ARN) of the Wisdom assistant
     */
    assistantArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the assistant association.
     */
    assistantAssociationArn: Arn;
    /**
     * The identifier of the assistant association.
     */
    assistantAssociationId: Uuid;
    /**
     * The identifier of the Wisdom assistant.
     */
    assistantId: Uuid;
    /**
     * A union type that currently has a single argument, the knowledge base ID.
     */
    associationData: AssistantAssociationOutputData;
    /**
     * The type of association.
     */
    associationType: AssociationType;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export interface AssistantAssociationInputData {
    /**
     * The the identifier of the knowledge base.
     */
    knowledgeBaseId?: Uuid;
  }
  export interface AssistantAssociationOutputData {
    /**
     * The knowledge base where output data is sent.
     */
    knowledgeBaseAssociation?: KnowledgeBaseAssociationData;
  }
  export interface AssistantAssociationSummary {
    /**
     * The Amazon Resource Name (ARN) of the Wisdom assistant
     */
    assistantArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the assistant association.
     */
    assistantAssociationArn: Arn;
    /**
     * The identifier of the assistant association.
     */
    assistantAssociationId: Uuid;
    /**
     * The identifier of the Wisdom assistant.
     */
    assistantId: Uuid;
    /**
     * The association data.
     */
    associationData: AssistantAssociationOutputData;
    /**
     * The type of association.
     */
    associationType: AssociationType;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export type AssistantAssociationSummaryList = AssistantAssociationSummary[];
  export interface AssistantData {
    /**
     * The Amazon Resource Name (ARN) of the Wisdom assistant
     */
    assistantArn: Arn;
    /**
     * The identifier of the Wisdom assistant.
     */
    assistantId: Uuid;
    /**
     * The description.
     */
    description?: Description;
    /**
     * The name.
     */
    name: Name;
    /**
     * The KMS key used for encryption.
     */
    serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
    /**
     * The status of the assistant.
     */
    status: AssistantStatus;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * The type of assistant.
     */
    type: AssistantType;
  }
  export type AssistantList = AssistantSummary[];
  export type AssistantStatus = "CREATE_IN_PROGRESS"|"CREATE_FAILED"|"ACTIVE"|"DELETE_IN_PROGRESS"|"DELETE_FAILED"|"DELETED"|string;
  export interface AssistantSummary {
    /**
     * The Amazon Resource Name (ARN) of the Wisdom assistant
     */
    assistantArn: Arn;
    /**
     * The identifier of the Wisdom assistant.
     */
    assistantId: Uuid;
    /**
     * The description of the assistant.
     */
    description?: Description;
    /**
     * The name of the assistant.
     */
    name: Name;
    /**
     * The KMS key used for encryption.
     */
    serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
    /**
     * The status of the assistant.
     */
    status: AssistantStatus;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * The type of the assistant.
     */
    type: AssistantType;
  }
  export type AssistantType = "AGENT"|string;
  export type AssociationType = "KNOWLEDGE_BASE"|string;
  export type Boolean = boolean;
  export type ClientToken = string;
  export interface ContentData {
    /**
     * The Amazon Resource Name (ARN) of the content.
     */
    contentArn: Arn;
    /**
     * The identifier of the content.
     */
    contentId: Uuid;
    /**
     * The media type of the content.
     */
    contentType: ContentType;
    /**
     * The Amazon Resource Name (ARN) of the knowledge base.
     */
    knowledgeBaseArn: Arn;
    /**
     * The the identifier of the knowledge base.
     */
    knowledgeBaseId: Uuid;
    /**
     * The URI of the content.
     */
    linkOutUri?: Uri;
    /**
     * A key/value map to store attributes without affecting tagging or recommendations. For example, when synchronizing data between an external system and Wisdom, you can store an external version identifier as metadata to utilize for determining drift.
     */
    metadata: ContentMetadata;
    /**
     * The name of the content.
     */
    name: Name;
    /**
     * The identifier of the content revision.
     */
    revisionId: NonEmptyString;
    /**
     * The status of the content.
     */
    status: ContentStatus;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * The title of the content.
     */
    title: ContentTitle;
    /**
     * The URL of the content.
     */
    url: SyntheticContentDataUrl;
    /**
     * The expiration time of the URL as an epoch timestamp.
     */
    urlExpiry: SyntheticTimestamp_epoch_seconds;
  }
  export type ContentMetadata = {[key: string]: NonEmptyString};
  export interface ContentReference {
    /**
     * The Amazon Resource Name (ARN) of the content.
     */
    contentArn?: Arn;
    /**
     * The identifier of the content.
     */
    contentId?: Uuid;
    /**
     * The Amazon Resource Name (ARN) of the knowledge base.
     */
    knowledgeBaseArn?: Arn;
    /**
     * The the identifier of the knowledge base.
     */
    knowledgeBaseId?: Uuid;
  }
  export type ContentStatus = "CREATE_IN_PROGRESS"|"CREATE_FAILED"|"ACTIVE"|"DELETE_IN_PROGRESS"|"DELETE_FAILED"|"DELETED"|"UPDATE_FAILED"|string;
  export interface ContentSummary {
    /**
     * The Amazon Resource Name (ARN) of the content.
     */
    contentArn: Arn;
    /**
     * The identifier of the content.
     */
    contentId: Uuid;
    /**
     * The media type of the content.
     */
    contentType: ContentType;
    /**
     * The Amazon Resource Name (ARN) of the knowledge base.
     */
    knowledgeBaseArn: Arn;
    /**
     * The the identifier of the knowledge base.
     */
    knowledgeBaseId: Uuid;
    /**
     * A key/value map to store attributes without affecting tagging or recommendations. For example, when synchronizing data between an external system and Wisdom, you can store an external version identifier as metadata to utilize for determining drift.
     */
    metadata: ContentMetadata;
    /**
     * The name of the content.
     */
    name: Name;
    /**
     * The identifier of the revision of the content.
     */
    revisionId: NonEmptyString;
    /**
     * The status of the content.
     */
    status: ContentStatus;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * The title of the content.
     */
    title: ContentTitle;
  }
  export type ContentSummaryList = ContentSummary[];
  export type ContentTitle = string;
  export type ContentType = string;
  export interface CreateAssistantAssociationRequest {
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
    /**
     * The identifier of the associated resource.
     */
    association: AssistantAssociationInputData;
    /**
     * The type of association.
     */
    associationType: AssociationType;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export interface CreateAssistantAssociationResponse {
    /**
     * The assistant association.
     */
    assistantAssociation?: AssistantAssociationData;
  }
  export interface CreateAssistantRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The description of the assistant.
     */
    description?: Description;
    /**
     * The name of the assistant.
     */
    name: Name;
    /**
     * The KMS key used for encryption.
     */
    serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * The type of assistant.
     */
    type: AssistantType;
  }
  export interface CreateAssistantResponse {
    /**
     * Information about the assistant.
     */
    assistant?: AssistantData;
  }
  export interface CreateContentRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: NonEmptyString;
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
    /**
     * A key/value map to store attributes without affecting tagging or recommendations. For example, when synchronizing data between an external system and Wisdom, you can store an external version identifier as metadata to utilize for determining drift.
     */
    metadata?: ContentMetadata;
    /**
     * The name of the content. Each piece of content in a knowledge base must have a unique name. You can retrieve a piece of content using only its knowledge base and its name with the SearchContent API.
     */
    name: Name;
    /**
     * The URI you want to use for the article. If the knowledge base has a templateUri, setting this argument overrides it for this piece of content.
     */
    overrideLinkOutUri?: Uri;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * The title of the content. If not set, the title is equal to the name.
     */
    title?: ContentTitle;
    /**
     * A pointer to the uploaded asset. This value is returned by StartContentUpload.
     */
    uploadId: NonEmptyString;
  }
  export interface CreateContentResponse {
    /**
     * The content.
     */
    content?: ContentData;
  }
  export interface CreateKnowledgeBaseRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: NonEmptyString;
    /**
     * The description.
     */
    description?: Description;
    /**
     * The type of knowledge base. Only CUSTOM knowledge bases allow you to upload your own content. EXTERNAL knowledge bases support integrations with third-party systems whose content is synchronized automatically. 
     */
    knowledgeBaseType: KnowledgeBaseType;
    /**
     * The name of the knowledge base.
     */
    name: Name;
    /**
     * Information about how to render the content.
     */
    renderingConfiguration?: RenderingConfiguration;
    /**
     * The KMS key used for encryption.
     */
    serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
    /**
     * The source of the knowledge base content. Only set this argument for EXTERNAL knowledge bases.
     */
    sourceConfiguration?: SourceConfiguration;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export interface CreateKnowledgeBaseResponse {
    /**
     * The knowledge base.
     */
    knowledgeBase?: KnowledgeBaseData;
  }
  export interface CreateSessionRequest {
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The description.
     */
    description?: Description;
    /**
     * The name of the session.
     */
    name: Name;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export interface CreateSessionResponse {
    /**
     * The session.
     */
    session?: SessionData;
  }
  export interface DeleteAssistantAssociationRequest {
    /**
     * The identifier of the assistant association. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantAssociationId: UuidOrArn;
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
  }
  export interface DeleteAssistantAssociationResponse {
  }
  export interface DeleteAssistantRequest {
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
  }
  export interface DeleteAssistantResponse {
  }
  export interface DeleteContentRequest {
    /**
     * The identifier of the content. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    contentId: UuidOrArn;
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
  }
  export interface DeleteContentResponse {
  }
  export interface DeleteKnowledgeBaseRequest {
    /**
     * The knowledge base to delete content from. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
  }
  export interface DeleteKnowledgeBaseResponse {
  }
  export type Description = string;
  export interface Document {
    /**
     * A reference to the content resource.
     */
    contentReference: ContentReference;
    /**
     * The excerpt from the document.
     */
    excerpt?: DocumentText;
    /**
     * The title of the document.
     */
    title?: DocumentText;
  }
  export interface DocumentText {
    /**
     * Highlights in the document text.
     */
    highlights?: Highlights;
    /**
     * Text in the document.
     */
    text?: SyntheticDocumentTextString;
  }
  export interface Filter {
    /**
     * The field on which to filter.
     */
    field: FilterField;
    /**
     * The operator to use for comparing the field’s value with the provided value.
     */
    operator: FilterOperator;
    /**
     * The desired field value on which to filter.
     */
    value: NonEmptyString;
  }
  export type FilterField = "NAME"|string;
  export type FilterList = Filter[];
  export type FilterOperator = "EQUALS"|string;
  export type GenericArn = string;
  export interface GetAssistantAssociationRequest {
    /**
     * The identifier of the assistant association. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantAssociationId: UuidOrArn;
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
  }
  export interface GetAssistantAssociationResponse {
    /**
     * The assistant association.
     */
    assistantAssociation?: AssistantAssociationData;
  }
  export interface GetAssistantRequest {
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
  }
  export interface GetAssistantResponse {
    /**
     * Information about the assistant.
     */
    assistant?: AssistantData;
  }
  export interface GetContentRequest {
    /**
     * The identifier of the content. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    contentId: UuidOrArn;
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
  }
  export interface GetContentResponse {
    /**
     * The content.
     */
    content?: ContentData;
  }
  export interface GetContentSummaryRequest {
    /**
     * The identifier of the content. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    contentId: UuidOrArn;
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
  }
  export interface GetContentSummaryResponse {
    /**
     * The content summary.
     */
    contentSummary?: ContentSummary;
  }
  export interface GetKnowledgeBaseRequest {
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
  }
  export interface GetKnowledgeBaseResponse {
    /**
     * The knowledge base.
     */
    knowledgeBase?: KnowledgeBaseData;
  }
  export interface GetRecommendationsRequest {
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The identifier of the session. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    sessionId: UuidOrArn;
    /**
     * The duration (in seconds) for which the call waits for a recommendation to be made available before returning. If a recommendation is available, the call returns sooner than WaitTimeSeconds. If no messages are available and the wait time expires, the call returns successfully with an empty list.
     */
    waitTimeSeconds?: WaitTimeSeconds;
  }
  export interface GetRecommendationsResponse {
    /**
     * The recommendations.
     */
    recommendations: RecommendationList;
  }
  export interface GetSessionRequest {
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
    /**
     * The identifier of the session. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    sessionId: UuidOrArn;
  }
  export interface GetSessionResponse {
    /**
     * The session.
     */
    session?: SessionData;
  }
  export type Headers = {[key: string]: NonEmptyString};
  export interface Highlight {
    /**
     * The offset for the start of the highlight.
     */
    beginOffsetInclusive?: HighlightOffset;
    /**
     * The offset for the end of the highlight.
     */
    endOffsetExclusive?: HighlightOffset;
  }
  export type HighlightOffset = number;
  export type Highlights = Highlight[];
  export interface KnowledgeBaseAssociationData {
    /**
     * The Amazon Resource Name (ARN) of the knowledge base.
     */
    knowledgeBaseArn?: Arn;
    /**
     * The the identifier of the knowledge base.
     */
    knowledgeBaseId?: Uuid;
  }
  export interface KnowledgeBaseData {
    /**
     * The description.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of the knowledge base.
     */
    knowledgeBaseArn: Arn;
    /**
     * The the identifier of the knowledge base.
     */
    knowledgeBaseId: Uuid;
    /**
     * The type of knowledge base.
     */
    knowledgeBaseType: KnowledgeBaseType;
    /**
     * An epoch timestamp indicating the most recent content modification inside the knowledge base. If no content exists in a knowledge base, this value is unset.
     */
    lastContentModificationTime?: SyntheticTimestamp_epoch_seconds;
    /**
     * The name of the knowledge base.
     */
    name: Name;
    /**
     * Information about how to render the content.
     */
    renderingConfiguration?: RenderingConfiguration;
    /**
     * The KMS key used for encryption.
     */
    serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
    /**
     * Source configuration information about the knowledge base.
     */
    sourceConfiguration?: SourceConfiguration;
    /**
     * The status of the knowledge base.
     */
    status: KnowledgeBaseStatus;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export type KnowledgeBaseList = KnowledgeBaseSummary[];
  export type KnowledgeBaseStatus = "CREATE_IN_PROGRESS"|"CREATE_FAILED"|"ACTIVE"|"DELETE_IN_PROGRESS"|"DELETE_FAILED"|"DELETED"|string;
  export interface KnowledgeBaseSummary {
    /**
     * The description of the knowledge base.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of the knowledge base.
     */
    knowledgeBaseArn: Arn;
    /**
     * The the identifier of the knowledge base.
     */
    knowledgeBaseId: Uuid;
    /**
     * The type of knowledge base.
     */
    knowledgeBaseType: KnowledgeBaseType;
    /**
     * The name of the knowledge base.
     */
    name: Name;
    /**
     * Information about how to render the content.
     */
    renderingConfiguration?: RenderingConfiguration;
    /**
     * The KMS key used for encryption.
     */
    serverSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
    /**
     * [KEVIN]
     */
    sourceConfiguration?: SourceConfiguration;
    /**
     * The status of the knowledge base summary.
     */
    status: KnowledgeBaseStatus;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export type KnowledgeBaseType = "EXTERNAL"|"CUSTOM"|string;
  export interface ListAssistantAssociationsRequest {
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAssistantAssociationsResponse {
    /**
     * Summary information about assistant associations.
     */
    assistantAssociationSummaries: AssistantAssociationSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAssistantsRequest {
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListAssistantsResponse {
    /**
     * Information about the assistants.
     */
    assistantSummaries: AssistantList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListContentsRequest {
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListContentsResponse {
    /**
     * Information about the content.
     */
    contentSummaries: ContentSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListKnowledgeBasesRequest {
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NonEmptyString;
  }
  export interface ListKnowledgeBasesResponse {
    /**
     * Information about the knowledge bases.
     */
    knowledgeBaseSummaries: KnowledgeBaseList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    nextToken?: NonEmptyString;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export type MaxResults = number;
  export type Name = string;
  export type NextToken = string;
  export type NonEmptyString = string;
  export interface NotifyRecommendationsReceivedError {
    /**
     * A recommendation is causing an error.
     */
    message?: NotifyRecommendationsReceivedErrorMessage;
    /**
     * The identifier of the recommendation that is in error.
     */
    recommendationId?: String;
  }
  export type NotifyRecommendationsReceivedErrorList = NotifyRecommendationsReceivedError[];
  export type NotifyRecommendationsReceivedErrorMessage = string;
  export interface NotifyRecommendationsReceivedRequest {
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
    /**
     * The identifiers of the recommendations.
     */
    recommendationIds: RecommendationIdList;
    /**
     * The identifier of the session. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    sessionId: UuidOrArn;
  }
  export interface NotifyRecommendationsReceivedResponse {
    /**
     * The identifiers of recommendations that are causing errors.
     */
    errors?: NotifyRecommendationsReceivedErrorList;
    /**
     * The identifiers of the recommendations.
     */
    recommendationIds?: RecommendationIdList;
  }
  export type ObjectFieldsList = NonEmptyString[];
  export interface QueryAssistantRequest {
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The text to search for.
     */
    queryText: QueryText;
  }
  export interface QueryAssistantResponse {
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The results of the query.
     */
    results: QueryResultsList;
  }
  export type QueryResultsList = ResultData[];
  export type QueryText = string;
  export interface RecommendationData {
    /**
     * The recommended document.
     */
    document: Document;
    /**
     * The identifier of the recommendation.
     */
    recommendationId: String;
    /**
     * The relevance level of the recommendation.
     */
    relevanceLevel?: RelevanceLevel;
    /**
     * The relevance score of the recommendation.
     */
    relevanceScore?: RelevanceScore;
  }
  export type RecommendationIdList = String[];
  export type RecommendationList = RecommendationData[];
  export type RelevanceLevel = "HIGH"|"MEDIUM"|"LOW"|string;
  export type RelevanceScore = number;
  export interface RemoveKnowledgeBaseTemplateUriRequest {
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
  }
  export interface RemoveKnowledgeBaseTemplateUriResponse {
  }
  export interface RenderingConfiguration {
    /**
     * A URI template containing exactly one variable in ${variableName} format. This can only be set for EXTERNAL knowledge bases. For Salesforce and ServiceNow, the variable must be one of the following:   Salesforce: Id, ArticleNumber, VersionNumber, Title, PublishStatus, or IsDeleted    ServiceNow: number, short_description, sys_mod_count, workflow_state, or active     &lt;p&gt;The variable is replaced with the actual value for a piece of content when calling &lt;a href=&quot;https://docs.aws.amazon.com/wisdom/latest/APIReference/API_GetContent.html&quot;&gt;GetContent&lt;/a&gt;. &lt;/p&gt; 
     */
    templateUri?: Uri;
  }
  export interface ResultData {
    /**
     * The document.
     */
    document: Document;
    /**
     * The relevance score of the results.
     */
    relevanceScore?: RelevanceScore;
    /**
     * The identifier of the result data.
     */
    resultId: Uuid;
  }
  export interface SearchContentRequest {
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The search expression to filter results.
     */
    searchExpression: SearchExpression;
  }
  export interface SearchContentResponse {
    /**
     * Summary information about the content.
     */
    contentSummaries: ContentSummaryList;
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface SearchExpression {
    /**
     * The search expression filters.
     */
    filters: FilterList;
  }
  export interface SearchSessionsRequest {
    /**
     * The identifier of the Wisdom assistant. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    assistantId: UuidOrArn;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * The search expression to filter results.
     */
    searchExpression: SearchExpression;
  }
  export interface SearchSessionsResponse {
    /**
     * If there are additional results, this is the token for the next set of results.
     */
    nextToken?: NextToken;
    /**
     * Summary information about the sessions.
     */
    sessionSummaries: SessionSummaries;
  }
  export interface ServerSideEncryptionConfiguration {
    /**
     * The KMS key. For information about valid ID values, see Key identifiers (KeyId) in the AWS Key Management Service Developer Guide. 
     */
    kmsKeyId?: NonEmptyString;
  }
  export interface SessionData {
    /**
     * The description of the session.
     */
    description?: Description;
    /**
     * The name of the session.
     */
    name: Name;
    /**
     * The Amazon Resource Name (ARN) of the session.
     */
    sessionArn: Arn;
    /**
     * The identifier of the session.
     */
    sessionId: Uuid;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export type SessionSummaries = SessionSummary[];
  export interface SessionSummary {
    /**
     * The Amazon Resource Name (ARN) of the Wisdom assistant
     */
    assistantArn: Arn;
    /**
     * The identifier of the Wisdom assistant.
     */
    assistantId: Uuid;
    /**
     * The Amazon Resource Name (ARN) of the session.
     */
    sessionArn: Arn;
    /**
     * The identifier of the session.
     */
    sessionId: Uuid;
  }
  export interface SourceConfiguration {
    /**
     * Configuration information for Amazon AppIntegrations to automatically ingest content.
     */
    appIntegrations?: AppIntegrationsConfiguration;
  }
  export interface StartContentUploadRequest {
    /**
     * The type of content to upload.
     */
    contentType: ContentType;
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
  }
  export interface StartContentUploadResponse {
    /**
     * The headers to include in the upload.
     */
    headersToInclude: Headers;
    /**
     * The identifier of the upload.
     */
    uploadId: NonEmptyString;
    /**
     * The URL of the upload.
     */
    url: SyntheticStartContentUploadResponseUrl;
    /**
     * The expiration time of the URL as an epoch timestamp.
     */
    urlExpiry: SyntheticTimestamp_epoch_seconds;
  }
  export type String = string;
  export type SyntheticContentDataUrl = string;
  export type SyntheticDocumentTextString = string;
  export type SyntheticStartContentUploadResponseUrl = string;
  export type SyntheticTimestamp_epoch_seconds = Date;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
    /**
     * The tags used to organize, track, or control access for this resource.
     */
    tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = {[key: string]: TagValue};
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
  export interface UpdateContentRequest {
    /**
     * The identifier of the content. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    contentId: UuidOrArn;
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN
     */
    knowledgeBaseId: UuidOrArn;
    /**
     * A key/value map to store attributes without affecting tagging or recommendations. For example, when synchronizing data between an external system and Wisdom, you can store an external version identifier as metadata to utilize for determining drift.
     */
    metadata?: ContentMetadata;
    /**
     * The URI for the article. If the knowledge base has a templateUri, setting this argument overrides it for this piece of content. To remove an existing overrideLinkOurUri, exclude this argument and set removeOverrideLinkOutUri to true.
     */
    overrideLinkOutUri?: Uri;
    /**
     * Unset the existing overrideLinkOutUri if it exists.
     */
    removeOverrideLinkOutUri?: Boolean;
    /**
     * The revisionId of the content resource to update, taken from an earlier call to GetContent, GetContentSummary, SearchContent, or ListContents. If included, this argument acts as an optimistic lock to ensure content was not modified since it was last read. If it has been modified, this API throws a PreconditionFailedException.
     */
    revisionId?: NonEmptyString;
    /**
     * The title of the content.
     */
    title?: ContentTitle;
    /**
     * A pointer to the uploaded asset. This value is returned by StartContentUpload. 
     */
    uploadId?: NonEmptyString;
  }
  export interface UpdateContentResponse {
    /**
     * The content.
     */
    content?: ContentData;
  }
  export interface UpdateKnowledgeBaseTemplateUriRequest {
    /**
     * The the identifier of the knowledge base. Can be either the ID or the ARN. URLs cannot contain the ARN.
     */
    knowledgeBaseId: UuidOrArn;
    /**
     * The template URI to update.
     */
    templateUri: Uri;
  }
  export interface UpdateKnowledgeBaseTemplateUriResponse {
    /**
     * The knowledge base to update.
     */
    knowledgeBase?: KnowledgeBaseData;
  }
  export type Uri = string;
  export type Uuid = string;
  export type UuidOrArn = string;
  export type WaitTimeSeconds = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-10-19"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Wisdom client.
   */
  export import Types = Wisdom;
}
export = Wisdom;
