import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ConnectCases extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ConnectCases.Types.ClientConfiguration)
  config: Config & ConnectCases.Types.ClientConfiguration;
  /**
   * Returns the description for the list of fields in the request parameters. 
   */
  batchGetField(params: ConnectCases.Types.BatchGetFieldRequest, callback?: (err: AWSError, data: ConnectCases.Types.BatchGetFieldResponse) => void): Request<ConnectCases.Types.BatchGetFieldResponse, AWSError>;
  /**
   * Returns the description for the list of fields in the request parameters. 
   */
  batchGetField(callback?: (err: AWSError, data: ConnectCases.Types.BatchGetFieldResponse) => void): Request<ConnectCases.Types.BatchGetFieldResponse, AWSError>;
  /**
   * Creates and updates a set of field options for a single select field in a Cases domain.
   */
  batchPutFieldOptions(params: ConnectCases.Types.BatchPutFieldOptionsRequest, callback?: (err: AWSError, data: ConnectCases.Types.BatchPutFieldOptionsResponse) => void): Request<ConnectCases.Types.BatchPutFieldOptionsResponse, AWSError>;
  /**
   * Creates and updates a set of field options for a single select field in a Cases domain.
   */
  batchPutFieldOptions(callback?: (err: AWSError, data: ConnectCases.Types.BatchPutFieldOptionsResponse) => void): Request<ConnectCases.Types.BatchPutFieldOptionsResponse, AWSError>;
  /**
   * Creates a case in the specified Cases domain. Case system and custom fields are taken as an array id/value pairs with a declared data types.  The following fields are required when creating a case:  &lt;ul&gt; &lt;li&gt; &lt;p&gt; &lt;code&gt;customer_id&lt;/code&gt; - You must provide the full customer profile ARN in this format: &lt;code&gt;arn:aws:profile:your AWS Region:your AWS account ID:domains/profiles domain name/profiles/profile ID&lt;/code&gt; &lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; &lt;code&gt;title&lt;/code&gt; &lt;/p&gt; &lt;/li&gt; &lt;/ul&gt; &lt;/note&gt; 
   */
  createCase(params: ConnectCases.Types.CreateCaseRequest, callback?: (err: AWSError, data: ConnectCases.Types.CreateCaseResponse) => void): Request<ConnectCases.Types.CreateCaseResponse, AWSError>;
  /**
   * Creates a case in the specified Cases domain. Case system and custom fields are taken as an array id/value pairs with a declared data types.  The following fields are required when creating a case:  &lt;ul&gt; &lt;li&gt; &lt;p&gt; &lt;code&gt;customer_id&lt;/code&gt; - You must provide the full customer profile ARN in this format: &lt;code&gt;arn:aws:profile:your AWS Region:your AWS account ID:domains/profiles domain name/profiles/profile ID&lt;/code&gt; &lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; &lt;code&gt;title&lt;/code&gt; &lt;/p&gt; &lt;/li&gt; &lt;/ul&gt; &lt;/note&gt; 
   */
  createCase(callback?: (err: AWSError, data: ConnectCases.Types.CreateCaseResponse) => void): Request<ConnectCases.Types.CreateCaseResponse, AWSError>;
  /**
   * Creates a domain, which is a container for all case data, such as cases, fields, templates and layouts. Each Amazon Connect instance can be associated with only one Cases domain.  This will not associate your connect instance to Cases domain. Instead, use the Amazon Connect CreateIntegrationAssociation API. You need specific IAM permissions to successfully associate the Cases domain. For more information, see Onboard to Cases.  &lt;/important&gt; 
   */
  createDomain(params: ConnectCases.Types.CreateDomainRequest, callback?: (err: AWSError, data: ConnectCases.Types.CreateDomainResponse) => void): Request<ConnectCases.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates a domain, which is a container for all case data, such as cases, fields, templates and layouts. Each Amazon Connect instance can be associated with only one Cases domain.  This will not associate your connect instance to Cases domain. Instead, use the Amazon Connect CreateIntegrationAssociation API. You need specific IAM permissions to successfully associate the Cases domain. For more information, see Onboard to Cases.  &lt;/important&gt; 
   */
  createDomain(callback?: (err: AWSError, data: ConnectCases.Types.CreateDomainResponse) => void): Request<ConnectCases.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates a field in the Cases domain. This field is used to define the case object model (that is, defines what data can be captured on cases) in a Cases domain. 
   */
  createField(params: ConnectCases.Types.CreateFieldRequest, callback?: (err: AWSError, data: ConnectCases.Types.CreateFieldResponse) => void): Request<ConnectCases.Types.CreateFieldResponse, AWSError>;
  /**
   * Creates a field in the Cases domain. This field is used to define the case object model (that is, defines what data can be captured on cases) in a Cases domain. 
   */
  createField(callback?: (err: AWSError, data: ConnectCases.Types.CreateFieldResponse) => void): Request<ConnectCases.Types.CreateFieldResponse, AWSError>;
  /**
   * Creates a layout in the Cases domain. Layouts define the following configuration in the top section and More Info tab of the Cases user interface:   Fields to display to the users   Field ordering    Title and Status fields cannot be part of layouts since they are not configurable. 
   */
  createLayout(params: ConnectCases.Types.CreateLayoutRequest, callback?: (err: AWSError, data: ConnectCases.Types.CreateLayoutResponse) => void): Request<ConnectCases.Types.CreateLayoutResponse, AWSError>;
  /**
   * Creates a layout in the Cases domain. Layouts define the following configuration in the top section and More Info tab of the Cases user interface:   Fields to display to the users   Field ordering    Title and Status fields cannot be part of layouts since they are not configurable. 
   */
  createLayout(callback?: (err: AWSError, data: ConnectCases.Types.CreateLayoutResponse) => void): Request<ConnectCases.Types.CreateLayoutResponse, AWSError>;
  /**
   * Creates a related item (comments, tasks, and contacts) and associates it with a case.  A Related Item is a resource that is associated with a case. It may or may not have an external identifier linking it to an external resource (for example, a contactArn). All Related Items have their own internal identifier, the relatedItemArn. Examples of related items include comments and contacts. 
   */
  createRelatedItem(params: ConnectCases.Types.CreateRelatedItemRequest, callback?: (err: AWSError, data: ConnectCases.Types.CreateRelatedItemResponse) => void): Request<ConnectCases.Types.CreateRelatedItemResponse, AWSError>;
  /**
   * Creates a related item (comments, tasks, and contacts) and associates it with a case.  A Related Item is a resource that is associated with a case. It may or may not have an external identifier linking it to an external resource (for example, a contactArn). All Related Items have their own internal identifier, the relatedItemArn. Examples of related items include comments and contacts. 
   */
  createRelatedItem(callback?: (err: AWSError, data: ConnectCases.Types.CreateRelatedItemResponse) => void): Request<ConnectCases.Types.CreateRelatedItemResponse, AWSError>;
  /**
   * Creates a template in the Cases domain. This template is used to define the case object model (that is, to define what data can be captured on cases) in a Cases domain. A template must have a unique name within a domain, and it must reference existing field IDs and layout IDs. Additionally, multiple fields with same IDs are not allowed within the same Template. A template can be either Active or Inactive, as indicated by its status. Inactive templates cannot be used to create cases.
   */
  createTemplate(params: ConnectCases.Types.CreateTemplateRequest, callback?: (err: AWSError, data: ConnectCases.Types.CreateTemplateResponse) => void): Request<ConnectCases.Types.CreateTemplateResponse, AWSError>;
  /**
   * Creates a template in the Cases domain. This template is used to define the case object model (that is, to define what data can be captured on cases) in a Cases domain. A template must have a unique name within a domain, and it must reference existing field IDs and layout IDs. Additionally, multiple fields with same IDs are not allowed within the same Template. A template can be either Active or Inactive, as indicated by its status. Inactive templates cannot be used to create cases.
   */
  createTemplate(callback?: (err: AWSError, data: ConnectCases.Types.CreateTemplateResponse) => void): Request<ConnectCases.Types.CreateTemplateResponse, AWSError>;
  /**
   * Deletes a Cases domain.  &lt;note&gt; &lt;p&gt;After deleting your domain you must disassociate the deleted domain from your Amazon Connect instance with another API call before being able to use Cases again with this Amazon Connect instance. See &lt;a href=&quot;https://docs.aws.amazon.com/connect/latest/APIReference/API_DeleteIntegrationAssociation.html&quot;&gt;DeleteIntegrationAssociation&lt;/a&gt;.&lt;/p&gt; &lt;/note&gt; 
   */
  deleteDomain(params: ConnectCases.Types.DeleteDomainRequest, callback?: (err: AWSError, data: ConnectCases.Types.DeleteDomainResponse) => void): Request<ConnectCases.Types.DeleteDomainResponse, AWSError>;
  /**
   * Deletes a Cases domain.  &lt;note&gt; &lt;p&gt;After deleting your domain you must disassociate the deleted domain from your Amazon Connect instance with another API call before being able to use Cases again with this Amazon Connect instance. See &lt;a href=&quot;https://docs.aws.amazon.com/connect/latest/APIReference/API_DeleteIntegrationAssociation.html&quot;&gt;DeleteIntegrationAssociation&lt;/a&gt;.&lt;/p&gt; &lt;/note&gt; 
   */
  deleteDomain(callback?: (err: AWSError, data: ConnectCases.Types.DeleteDomainResponse) => void): Request<ConnectCases.Types.DeleteDomainResponse, AWSError>;
  /**
   * Returns information about a specific case if it exists. 
   */
  getCase(params: ConnectCases.Types.GetCaseRequest, callback?: (err: AWSError, data: ConnectCases.Types.GetCaseResponse) => void): Request<ConnectCases.Types.GetCaseResponse, AWSError>;
  /**
   * Returns information about a specific case if it exists. 
   */
  getCase(callback?: (err: AWSError, data: ConnectCases.Types.GetCaseResponse) => void): Request<ConnectCases.Types.GetCaseResponse, AWSError>;
  /**
   * Returns the case event publishing configuration.
   */
  getCaseEventConfiguration(params: ConnectCases.Types.GetCaseEventConfigurationRequest, callback?: (err: AWSError, data: ConnectCases.Types.GetCaseEventConfigurationResponse) => void): Request<ConnectCases.Types.GetCaseEventConfigurationResponse, AWSError>;
  /**
   * Returns the case event publishing configuration.
   */
  getCaseEventConfiguration(callback?: (err: AWSError, data: ConnectCases.Types.GetCaseEventConfigurationResponse) => void): Request<ConnectCases.Types.GetCaseEventConfigurationResponse, AWSError>;
  /**
   * Returns information about a specific domain if it exists. 
   */
  getDomain(params: ConnectCases.Types.GetDomainRequest, callback?: (err: AWSError, data: ConnectCases.Types.GetDomainResponse) => void): Request<ConnectCases.Types.GetDomainResponse, AWSError>;
  /**
   * Returns information about a specific domain if it exists. 
   */
  getDomain(callback?: (err: AWSError, data: ConnectCases.Types.GetDomainResponse) => void): Request<ConnectCases.Types.GetDomainResponse, AWSError>;
  /**
   * Returns the details for the requested layout.
   */
  getLayout(params: ConnectCases.Types.GetLayoutRequest, callback?: (err: AWSError, data: ConnectCases.Types.GetLayoutResponse) => void): Request<ConnectCases.Types.GetLayoutResponse, AWSError>;
  /**
   * Returns the details for the requested layout.
   */
  getLayout(callback?: (err: AWSError, data: ConnectCases.Types.GetLayoutResponse) => void): Request<ConnectCases.Types.GetLayoutResponse, AWSError>;
  /**
   * Returns the details for the requested template. 
   */
  getTemplate(params: ConnectCases.Types.GetTemplateRequest, callback?: (err: AWSError, data: ConnectCases.Types.GetTemplateResponse) => void): Request<ConnectCases.Types.GetTemplateResponse, AWSError>;
  /**
   * Returns the details for the requested template. 
   */
  getTemplate(callback?: (err: AWSError, data: ConnectCases.Types.GetTemplateResponse) => void): Request<ConnectCases.Types.GetTemplateResponse, AWSError>;
  /**
   * Lists cases for a given contact.
   */
  listCasesForContact(params: ConnectCases.Types.ListCasesForContactRequest, callback?: (err: AWSError, data: ConnectCases.Types.ListCasesForContactResponse) => void): Request<ConnectCases.Types.ListCasesForContactResponse, AWSError>;
  /**
   * Lists cases for a given contact.
   */
  listCasesForContact(callback?: (err: AWSError, data: ConnectCases.Types.ListCasesForContactResponse) => void): Request<ConnectCases.Types.ListCasesForContactResponse, AWSError>;
  /**
   * Lists all cases domains in the Amazon Web Services account. Each list item is a condensed summary object of the domain.
   */
  listDomains(params: ConnectCases.Types.ListDomainsRequest, callback?: (err: AWSError, data: ConnectCases.Types.ListDomainsResponse) => void): Request<ConnectCases.Types.ListDomainsResponse, AWSError>;
  /**
   * Lists all cases domains in the Amazon Web Services account. Each list item is a condensed summary object of the domain.
   */
  listDomains(callback?: (err: AWSError, data: ConnectCases.Types.ListDomainsResponse) => void): Request<ConnectCases.Types.ListDomainsResponse, AWSError>;
  /**
   * Lists all of the field options for a field identifier in the domain. 
   */
  listFieldOptions(params: ConnectCases.Types.ListFieldOptionsRequest, callback?: (err: AWSError, data: ConnectCases.Types.ListFieldOptionsResponse) => void): Request<ConnectCases.Types.ListFieldOptionsResponse, AWSError>;
  /**
   * Lists all of the field options for a field identifier in the domain. 
   */
  listFieldOptions(callback?: (err: AWSError, data: ConnectCases.Types.ListFieldOptionsResponse) => void): Request<ConnectCases.Types.ListFieldOptionsResponse, AWSError>;
  /**
   * Lists all fields in a Cases domain.
   */
  listFields(params: ConnectCases.Types.ListFieldsRequest, callback?: (err: AWSError, data: ConnectCases.Types.ListFieldsResponse) => void): Request<ConnectCases.Types.ListFieldsResponse, AWSError>;
  /**
   * Lists all fields in a Cases domain.
   */
  listFields(callback?: (err: AWSError, data: ConnectCases.Types.ListFieldsResponse) => void): Request<ConnectCases.Types.ListFieldsResponse, AWSError>;
  /**
   * Lists all layouts in the given cases domain. Each list item is a condensed summary object of the layout.
   */
  listLayouts(params: ConnectCases.Types.ListLayoutsRequest, callback?: (err: AWSError, data: ConnectCases.Types.ListLayoutsResponse) => void): Request<ConnectCases.Types.ListLayoutsResponse, AWSError>;
  /**
   * Lists all layouts in the given cases domain. Each list item is a condensed summary object of the layout.
   */
  listLayouts(callback?: (err: AWSError, data: ConnectCases.Types.ListLayoutsResponse) => void): Request<ConnectCases.Types.ListLayoutsResponse, AWSError>;
  /**
   * Lists tags for a resource.
   */
  listTagsForResource(params: ConnectCases.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ConnectCases.Types.ListTagsForResourceResponse) => void): Request<ConnectCases.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists tags for a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ConnectCases.Types.ListTagsForResourceResponse) => void): Request<ConnectCases.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all of the templates in a Cases domain. Each list item is a condensed summary object of the template. 
   */
  listTemplates(params: ConnectCases.Types.ListTemplatesRequest, callback?: (err: AWSError, data: ConnectCases.Types.ListTemplatesResponse) => void): Request<ConnectCases.Types.ListTemplatesResponse, AWSError>;
  /**
   * Lists all of the templates in a Cases domain. Each list item is a condensed summary object of the template. 
   */
  listTemplates(callback?: (err: AWSError, data: ConnectCases.Types.ListTemplatesResponse) => void): Request<ConnectCases.Types.ListTemplatesResponse, AWSError>;
  /**
   * API for adding case event publishing configuration
   */
  putCaseEventConfiguration(params: ConnectCases.Types.PutCaseEventConfigurationRequest, callback?: (err: AWSError, data: ConnectCases.Types.PutCaseEventConfigurationResponse) => void): Request<ConnectCases.Types.PutCaseEventConfigurationResponse, AWSError>;
  /**
   * API for adding case event publishing configuration
   */
  putCaseEventConfiguration(callback?: (err: AWSError, data: ConnectCases.Types.PutCaseEventConfigurationResponse) => void): Request<ConnectCases.Types.PutCaseEventConfigurationResponse, AWSError>;
  /**
   * Searches for cases within their associated Cases domain. Search results are returned as a paginated list of abridged case documents.  For customer_id you must provide the full customer profile ARN in this format:  arn:aws:profile:your AWS Region:your AWS account ID:domains/profiles domain name/profiles/profile ID.  
   */
  searchCases(params: ConnectCases.Types.SearchCasesRequest, callback?: (err: AWSError, data: ConnectCases.Types.SearchCasesResponse) => void): Request<ConnectCases.Types.SearchCasesResponse, AWSError>;
  /**
   * Searches for cases within their associated Cases domain. Search results are returned as a paginated list of abridged case documents.  For customer_id you must provide the full customer profile ARN in this format:  arn:aws:profile:your AWS Region:your AWS account ID:domains/profiles domain name/profiles/profile ID.  
   */
  searchCases(callback?: (err: AWSError, data: ConnectCases.Types.SearchCasesResponse) => void): Request<ConnectCases.Types.SearchCasesResponse, AWSError>;
  /**
   * Searches for related items that are associated with a case.  If no filters are provided, this returns all related items associated with a case. 
   */
  searchRelatedItems(params: ConnectCases.Types.SearchRelatedItemsRequest, callback?: (err: AWSError, data: ConnectCases.Types.SearchRelatedItemsResponse) => void): Request<ConnectCases.Types.SearchRelatedItemsResponse, AWSError>;
  /**
   * Searches for related items that are associated with a case.  If no filters are provided, this returns all related items associated with a case. 
   */
  searchRelatedItems(callback?: (err: AWSError, data: ConnectCases.Types.SearchRelatedItemsResponse) => void): Request<ConnectCases.Types.SearchRelatedItemsResponse, AWSError>;
  /**
   * Adds tags to a resource.
   */
  tagResource(params: ConnectCases.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds tags to a resource.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Untags a resource.
   */
  untagResource(params: ConnectCases.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Untags a resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the values of fields on a case. Fields to be updated are received as an array of id/value pairs identical to the CreateCase input . If the action is successful, the service sends back an HTTP 200 response with an empty HTTP body.
   */
  updateCase(params: ConnectCases.Types.UpdateCaseRequest, callback?: (err: AWSError, data: ConnectCases.Types.UpdateCaseResponse) => void): Request<ConnectCases.Types.UpdateCaseResponse, AWSError>;
  /**
   * Updates the values of fields on a case. Fields to be updated are received as an array of id/value pairs identical to the CreateCase input . If the action is successful, the service sends back an HTTP 200 response with an empty HTTP body.
   */
  updateCase(callback?: (err: AWSError, data: ConnectCases.Types.UpdateCaseResponse) => void): Request<ConnectCases.Types.UpdateCaseResponse, AWSError>;
  /**
   * Updates the properties of an existing field. 
   */
  updateField(params: ConnectCases.Types.UpdateFieldRequest, callback?: (err: AWSError, data: ConnectCases.Types.UpdateFieldResponse) => void): Request<ConnectCases.Types.UpdateFieldResponse, AWSError>;
  /**
   * Updates the properties of an existing field. 
   */
  updateField(callback?: (err: AWSError, data: ConnectCases.Types.UpdateFieldResponse) => void): Request<ConnectCases.Types.UpdateFieldResponse, AWSError>;
  /**
   * Updates the attributes of an existing layout. If the action is successful, the service sends back an HTTP 200 response with an empty HTTP body. A ValidationException is returned when you add non-existent fieldIds to a layout.  Title and Status fields cannot be part of layouts because they are not configurable. 
   */
  updateLayout(params: ConnectCases.Types.UpdateLayoutRequest, callback?: (err: AWSError, data: ConnectCases.Types.UpdateLayoutResponse) => void): Request<ConnectCases.Types.UpdateLayoutResponse, AWSError>;
  /**
   * Updates the attributes of an existing layout. If the action is successful, the service sends back an HTTP 200 response with an empty HTTP body. A ValidationException is returned when you add non-existent fieldIds to a layout.  Title and Status fields cannot be part of layouts because they are not configurable. 
   */
  updateLayout(callback?: (err: AWSError, data: ConnectCases.Types.UpdateLayoutResponse) => void): Request<ConnectCases.Types.UpdateLayoutResponse, AWSError>;
  /**
   * Updates the attributes of an existing template. The template attributes that can be modified include name, description, layoutConfiguration, requiredFields, and status. At least one of these attributes must not be null. If a null value is provided for a given attribute, that attribute is ignored and its current value is preserved.
   */
  updateTemplate(params: ConnectCases.Types.UpdateTemplateRequest, callback?: (err: AWSError, data: ConnectCases.Types.UpdateTemplateResponse) => void): Request<ConnectCases.Types.UpdateTemplateResponse, AWSError>;
  /**
   * Updates the attributes of an existing template. The template attributes that can be modified include name, description, layoutConfiguration, requiredFields, and status. At least one of these attributes must not be null. If a null value is provided for a given attribute, that attribute is ignored and its current value is preserved.
   */
  updateTemplate(callback?: (err: AWSError, data: ConnectCases.Types.UpdateTemplateResponse) => void): Request<ConnectCases.Types.UpdateTemplateResponse, AWSError>;
}
declare namespace ConnectCases {
  export type Arn = string;
  export type AssociationTime = Date;
  export interface BasicLayout {
    /**
     * This represents sections in a tab of the page layout.
     */
    moreInfo?: LayoutSections;
    /**
     * This represents sections in a panel of the page layout.
     */
    topPanel?: LayoutSections;
  }
  export type BatchGetFieldIdentifierList = FieldIdentifier[];
  export interface BatchGetFieldRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * A list of unique field identifiers. 
     */
    fields: BatchGetFieldIdentifierList;
  }
  export interface BatchGetFieldResponse {
    /**
     * A list of field errors. 
     */
    errors: BatchGetFieldResponseErrorsList;
    /**
     * A list of detailed field information. 
     */
    fields: BatchGetFieldResponseFieldsList;
  }
  export type BatchGetFieldResponseErrorsList = FieldError[];
  export type BatchGetFieldResponseFieldsList = GetFieldResponse[];
  export interface BatchPutFieldOptionsRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The unique identifier of a field.
     */
    fieldId: FieldId;
    /**
     * A list of FieldOption objects.
     */
    options: BatchPutFieldOptionsRequestOptionsList;
  }
  export type BatchPutFieldOptionsRequestOptionsList = FieldOption[];
  export interface BatchPutFieldOptionsResponse {
    /**
     * A list of field errors. 
     */
    errors?: BatchPutFieldOptionsResponseErrorsList;
  }
  export type BatchPutFieldOptionsResponseErrorsList = FieldOptionError[];
  export type Boolean = boolean;
  export type CaseArn = string;
  export interface CaseEventIncludedData {
    /**
     * List of field identifiers.
     */
    fields: CaseEventIncludedDataFieldsList;
  }
  export type CaseEventIncludedDataFieldsList = FieldIdentifier[];
  export interface CaseFilter {
    /**
     * Provides "and all" filtering.
     */
    andAll?: CaseFilterAndAllList;
    /**
     * A list of fields to filter on.
     */
    field?: FieldFilter;
    not?: CaseFilter;
    /**
     * Provides "or all" filtering.
     */
    orAll?: CaseFilterOrAllList;
  }
  export type CaseFilterAndAllList = CaseFilter[];
  export type CaseFilterOrAllList = CaseFilter[];
  export type CaseId = string;
  export interface CaseSummary {
    /**
     * A unique identifier of the case.
     */
    caseId: CaseId;
    /**
     * A unique identifier of a template.
     */
    templateId: TemplateId;
  }
  export type Channel = string;
  export type CommentBody = string;
  export type CommentBodyTextType = "Text/Plain"|string;
  export interface CommentContent {
    /**
     * Text in the body of a Comment on a case.
     */
    body: CommentBody;
    /**
     * Type of the text in the box of a Comment on a case.
     */
    contentType: CommentBodyTextType;
  }
  export interface CommentFilter {
  }
  export type ConnectedToSystemTime = Date;
  export interface Contact {
    /**
     * A unique identifier of a contact in Amazon Connect.
     */
    contactArn: ContactArn;
  }
  export type ContactArn = string;
  export interface ContactContent {
    /**
     * A list of channels to filter on for related items of type Contact.
     */
    channel: Channel;
    /**
     * The difference between the InitiationTimestamp and the DisconnectTimestamp of the contact.
     */
    connectedToSystemTime: ConnectedToSystemTime;
    /**
     * A unique identifier of a contact in Amazon Connect.
     */
    contactArn: ContactArn;
  }
  export interface ContactFilter {
    /**
     * A list of channels to filter on for related items of type Contact.
     */
    channel?: ContactFilterChannelList;
    /**
     * A unique identifier of a contact in Amazon Connect.
     */
    contactArn?: ContactArn;
  }
  export type ContactFilterChannelList = Channel[];
  export interface CreateCaseRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If not provided, the Amazon Web Services SDK populates this field. For more information about idempotency, see Making retries safe with idempotent APIs.
     */
    clientToken?: CreateCaseRequestClientTokenString;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * An array of objects with field ID (matching ListFields/DescribeField) and value union data.
     */
    fields: CreateCaseRequestFieldsList;
    /**
     * A unique identifier of a template.
     */
    templateId: TemplateId;
  }
  export type CreateCaseRequestClientTokenString = string;
  export type CreateCaseRequestFieldsList = FieldValue[];
  export interface CreateCaseResponse {
    /**
     * The Amazon Resource Name (ARN) of the case.
     */
    caseArn: CaseArn;
    /**
     * A unique identifier of the case.
     */
    caseId: CaseId;
  }
  export interface CreateDomainRequest {
    /**
     * The name for your Cases domain. It must be unique for your Amazon Web Services account.
     */
    name: DomainName;
  }
  export interface CreateDomainResponse {
    /**
     * The Amazon Resource Name (ARN) for the Cases domain.
     */
    domainArn: DomainArn;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The status of the domain.
     */
    domainStatus: DomainStatus;
  }
  export interface CreateFieldRequest {
    /**
     * The description of the field.
     */
    description?: FieldDescription;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The name of the field.
     */
    name: FieldName;
    /**
     * Defines the data type, some system constraints, and default display of the field.
     */
    type: FieldType;
  }
  export interface CreateFieldResponse {
    /**
     * The Amazon Resource Name (ARN) of the field.
     */
    fieldArn: FieldArn;
    /**
     * The unique identifier of a field.
     */
    fieldId: FieldId;
  }
  export interface CreateLayoutRequest {
    /**
     * Information about which fields will be present in the layout, and information about the order of the fields.
     */
    content: LayoutContent;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The name of the layout. It must be unique for the Cases domain.
     */
    name: LayoutName;
  }
  export interface CreateLayoutResponse {
    /**
     * The Amazon Resource Name (ARN) of the newly created layout.
     */
    layoutArn: LayoutArn;
    /**
     * The unique identifier of the layout.
     */
    layoutId: LayoutId;
  }
  export interface CreateRelatedItemRequest {
    /**
     * A unique identifier of the case.
     */
    caseId: CaseId;
    /**
     * The content of a related item to be created.
     */
    content: RelatedItemInputContent;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The type of a related item.
     */
    type: RelatedItemType;
  }
  export interface CreateRelatedItemResponse {
    /**
     * The Amazon Resource Name (ARN) of the related item.
     */
    relatedItemArn: RelatedItemArn;
    /**
     * The unique identifier of the related item.
     */
    relatedItemId: RelatedItemId;
  }
  export interface CreateTemplateRequest {
    /**
     * A brief description of the template.
     */
    description?: TemplateDescription;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * Configuration of layouts associated to the template.
     */
    layoutConfiguration?: LayoutConfiguration;
    /**
     * A name for the template. It must be unique per domain.
     */
    name: TemplateName;
    /**
     * A list of fields that must contain a value for a case to be successfully created with this template.
     */
    requiredFields?: RequiredFieldList;
    /**
     * The status of the template.
     */
    status?: TemplateStatus;
  }
  export interface CreateTemplateResponse {
    /**
     * The Amazon Resource Name (ARN) of the newly created template.
     */
    templateArn: TemplateArn;
    /**
     * A unique identifier of a template.
     */
    templateId: TemplateId;
  }
  export type CreatedTime = Date;
  export interface DeleteDomainRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
  }
  export interface DeleteDomainResponse {
  }
  export type DomainArn = string;
  export type DomainId = string;
  export type DomainName = string;
  export type DomainStatus = "Active"|"CreationInProgress"|"CreationFailed"|string;
  export interface DomainSummary {
    /**
     * The Amazon Resource Name (ARN) of the domain.
     */
    domainArn: DomainArn;
    /**
     * The unique identifier of the domain.
     */
    domainId: DomainId;
    /**
     * The name of the domain.
     */
    name: DomainName;
  }
  export type DomainSummaryList = DomainSummary[];
  export type Double = number;
  export interface EmptyFieldValue {
  }
  export interface EventBridgeConfiguration {
    /**
     * Indicates whether the to broadcast case event data to the customer.
     */
    enabled: Boolean;
    /**
     * Details of what case and related item data is published through the case event stream.
     */
    includedData?: EventIncludedData;
  }
  export interface EventIncludedData {
    /**
     * Details of what case data is published through the case event stream.
     */
    caseData?: CaseEventIncludedData;
    /**
     * Details of what related item data is published through the case event stream.
     */
    relatedItemData?: RelatedItemEventIncludedData;
  }
  export type FieldArn = string;
  export type FieldDescription = string;
  export interface FieldError {
    /**
     * The error code from getting a field.
     */
    errorCode: String;
    /**
     * The field identifier that caused the error.
     */
    id: FieldId;
    /**
     * The error message from getting a field.
     */
    message?: String;
  }
  export interface FieldFilter {
    /**
     * Object containing field identifier and value information.
     */
    contains?: FieldValue;
    /**
     * Object containing field identifier and value information.
     */
    equalTo?: FieldValue;
    /**
     * Object containing field identifier and value information.
     */
    greaterThan?: FieldValue;
    /**
     * Object containing field identifier and value information.
     */
    greaterThanOrEqualTo?: FieldValue;
    /**
     * Object containing field identifier and value information.
     */
    lessThan?: FieldValue;
    /**
     * Object containing field identifier and value information. 
     */
    lessThanOrEqualTo?: FieldValue;
  }
  export interface FieldGroup {
    /**
     * Represents an ordered list containing field related information.
     */
    fields: FieldGroupFieldsList;
    /**
     * Name of the field group.
     */
    name?: FieldGroupNameString;
  }
  export type FieldGroupFieldsList = FieldItem[];
  export type FieldGroupNameString = string;
  export type FieldId = string;
  export interface FieldIdentifier {
    /**
     * Unique identifier of a field.
     */
    id: FieldId;
  }
  export interface FieldItem {
    /**
     * Unique identifier of a field.
     */
    id: FieldId;
  }
  export type FieldName = string;
  export type FieldNamespace = "System"|"Custom"|string;
  export interface FieldOption {
    /**
     * Describes whether the FieldOption is active (displayed) or inactive.
     */
    active: Boolean;
    /**
     *  FieldOptionName has max length 100 and disallows trailing spaces.
     */
    name: FieldOptionName;
    /**
     *  FieldOptionValue has max length 100 and must be alphanumeric with hyphens and underscores.
     */
    value: FieldOptionValue;
  }
  export interface FieldOptionError {
    /**
     * Error code from creating or updating field option.
     */
    errorCode: String;
    /**
     * Error message from creating or updating field option.
     */
    message: String;
    /**
     * The field option value that caused the error.
     */
    value: FieldOptionValue;
  }
  export type FieldOptionName = string;
  export type FieldOptionValue = string;
  export type FieldOptionsList = FieldOption[];
  export interface FieldSummary {
    /**
     * The Amazon Resource Name (ARN) of the field.
     */
    fieldArn: FieldArn;
    /**
     * The unique identifier of a field.
     */
    fieldId: FieldId;
    /**
     * Name of the field.
     */
    name: FieldName;
    /**
     * The namespace of a field.
     */
    namespace: FieldNamespace;
    /**
     * The type of a field.
     */
    type: FieldType;
  }
  export type FieldType = "Text"|"Number"|"Boolean"|"DateTime"|"SingleSelect"|"Url"|string;
  export interface FieldValue {
    /**
     * Unique identifier of a field.
     */
    id: FieldId;
    /**
     * Union of potential field value types.
     */
    value: FieldValueUnion;
  }
  export interface FieldValueUnion {
    /**
     * Can be either null, or have a Boolean value type. Only one value can be provided.
     */
    booleanValue?: Boolean;
    /**
     * Can be either null, or have a Double number value type. Only one value can be provided.
     */
    doubleValue?: Double;
    /**
     * An empty value.
     */
    emptyValue?: EmptyFieldValue;
    /**
     * String value type.
     */
    stringValue?: FieldValueUnionStringValueString;
  }
  export type FieldValueUnionStringValueString = string;
  export interface GetCaseEventConfigurationRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
  }
  export interface GetCaseEventConfigurationResponse {
    /**
     * Configuration to enable EventBridge case event delivery and determine what data is delivered.
     */
    eventBridge: EventBridgeConfiguration;
  }
  export interface GetCaseRequest {
    /**
     * A unique identifier of the case.
     */
    caseId: CaseId;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * A list of unique field identifiers. 
     */
    fields: GetCaseRequestFieldsList;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export type GetCaseRequestFieldsList = FieldIdentifier[];
  export interface GetCaseResponse {
    /**
     * A list of detailed field information. 
     */
    fields: GetCaseResponseFieldsList;
    /**
     * The token for the next set of results. This is null if there are no more results to return.
     */
    nextToken?: NextToken;
    /**
     * A map of of key-value pairs that represent tags on a resource. Tags are used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * A unique identifier of a template.
     */
    templateId: TemplateId;
  }
  export type GetCaseResponseFieldsList = FieldValue[];
  export interface GetDomainRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
  }
  export interface GetDomainResponse {
    /**
     * The timestamp when the Cases domain was created.
     */
    createdTime: CreatedTime;
    /**
     * The Amazon Resource Name (ARN) for the Cases domain.
     */
    domainArn: DomainArn;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The status of the Cases domain.
     */
    domainStatus: DomainStatus;
    /**
     * The name of the Cases domain.
     */
    name: DomainName;
    /**
     * A map of of key-value pairs that represent tags on a resource. Tags are used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export interface GetFieldResponse {
    /**
     * Description of the field.
     */
    description?: FieldDescription;
    /**
     * The Amazon Resource Name (ARN) of the field.
     */
    fieldArn: FieldArn;
    /**
     * Unique identifier of the field.
     */
    fieldId: FieldId;
    /**
     * Name of the field.
     */
    name: FieldName;
    /**
     * Namespace of the field.
     */
    namespace: FieldNamespace;
    /**
     * A map of of key-value pairs that represent tags on a resource. Tags are used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * Type of the field.
     */
    type: FieldType;
  }
  export interface GetLayoutRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The unique identifier of the layout.
     */
    layoutId: LayoutId;
  }
  export interface GetLayoutResponse {
    /**
     * Information about which fields will be present in the layout, the order of the fields, and read-only attribute of the field. 
     */
    content: LayoutContent;
    /**
     * The Amazon Resource Name (ARN) of the newly created layout.
     */
    layoutArn: LayoutArn;
    /**
     * The unique identifier of the layout.
     */
    layoutId: LayoutId;
    /**
     * The name of the layout. It must be unique.
     */
    name: LayoutName;
    /**
     * A map of of key-value pairs that represent tags on a resource. Tags are used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export interface GetTemplateRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * A unique identifier of a template.
     */
    templateId: TemplateId;
  }
  export interface GetTemplateResponse {
    /**
     * A brief description of the template.
     */
    description?: TemplateDescription;
    /**
     * Configuration of layouts associated to the template.
     */
    layoutConfiguration?: LayoutConfiguration;
    /**
     * The name of the template.
     */
    name: TemplateName;
    /**
     * A list of fields that must contain a value for a case to be successfully created with this template.
     */
    requiredFields?: RequiredFieldList;
    /**
     * The status of the template.
     */
    status: TemplateStatus;
    /**
     * A map of of key-value pairs that represent tags on a resource. Tags are used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * The Amazon Resource Name (ARN) of the template.
     */
    templateArn: TemplateArn;
    /**
     * A unique identifier of a template.
     */
    templateId: TemplateId;
  }
  export type LayoutArn = string;
  export interface LayoutConfiguration {
    /**
     *  Unique identifier of a layout. 
     */
    defaultLayout?: LayoutId;
  }
  export interface LayoutContent {
    /**
     * Content specific to BasicLayout type. It configures fields in the top panel and More Info tab of Cases user interface.
     */
    basic?: BasicLayout;
  }
  export type LayoutId = string;
  export type LayoutName = string;
  export interface LayoutSections {
    sections?: SectionsList;
  }
  export interface LayoutSummary {
    /**
     * The Amazon Resource Name (ARN) of the layout.
     */
    layoutArn: LayoutArn;
    /**
     * The unique identifier for of the layout.
     */
    layoutId: LayoutId;
    /**
     * The name of the layout.
     */
    name: LayoutName;
  }
  export type LayoutSummaryList = LayoutSummary[];
  export interface ListCasesForContactRequest {
    /**
     * A unique identifier of a contact in Amazon Connect.
     */
    contactArn: ContactArn;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: ListCasesForContactRequestMaxResultsInteger;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export type ListCasesForContactRequestMaxResultsInteger = number;
  export interface ListCasesForContactResponse {
    /**
     * A list of Case summary information.
     */
    cases: ListCasesForContactResponseCasesList;
    /**
     * The token for the next set of results. This is null if there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export type ListCasesForContactResponseCasesList = CaseSummary[];
  export interface ListDomainsRequest {
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: ListDomainsRequestMaxResultsInteger;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export type ListDomainsRequestMaxResultsInteger = number;
  export interface ListDomainsResponse {
    /**
     * The Cases domain.
     */
    domains: DomainSummaryList;
    /**
     * The token for the next set of results. This is null if there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface ListFieldOptionsRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The unique identifier of a field.
     */
    fieldId: FieldId;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * A list of FieldOption values to filter on for ListFieldOptions.
     */
    values?: ValuesList;
  }
  export interface ListFieldOptionsResponse {
    /**
     * The token for the next set of results. This is null if there are no more results to return.
     */
    nextToken?: NextToken;
    /**
     * A list of FieldOption objects.
     */
    options: FieldOptionsList;
  }
  export interface ListFieldsRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListFieldsResponse {
    /**
     * List of detailed field information.
     */
    fields: ListFieldsResponseFieldsList;
    /**
     * The token for the next set of results. This is null if there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export type ListFieldsResponseFieldsList = FieldSummary[];
  export interface ListLayoutsRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export interface ListLayoutsResponse {
    /**
     * The layouts for the domain.
     */
    layouts: LayoutSummaryList;
    /**
     * The token for the next set of results. This is null if there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN)
     */
    arn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A map of of key-value pairs that represent tags on a resource. Tags are used to organize, track, or control access for this resource.
     */
    tags?: Tags;
  }
  export interface ListTemplatesRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: MaxResults;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * A list of status values to filter on.
     */
    status?: TemplateStatusFilters;
  }
  export interface ListTemplatesResponse {
    /**
     * The token for the next set of results. This is null if there are no more results to return.
     */
    nextToken?: NextToken;
    /**
     * List of template summary objects.
     */
    templates: ListTemplatesResponseTemplatesList;
  }
  export type ListTemplatesResponseTemplatesList = TemplateSummary[];
  export type MaxResults = number;
  export type NextToken = string;
  export type Order = "Asc"|"Desc"|string;
  export interface PutCaseEventConfigurationRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * Configuration to enable EventBridge case event delivery and determine what data is delivered.
     */
    eventBridge: EventBridgeConfiguration;
  }
  export interface PutCaseEventConfigurationResponse {
  }
  export type RelatedItemArn = string;
  export interface RelatedItemContent {
    /**
     * Represents the content of a comment to be returned to agents.
     */
    comment?: CommentContent;
    /**
     * Represents the content of a contact to be returned to agents.
     */
    contact?: ContactContent;
  }
  export interface RelatedItemEventIncludedData {
    /**
     * Details of what related item data is published through the case event stream.
     */
    includeContent: Boolean;
  }
  export type RelatedItemId = string;
  export interface RelatedItemInputContent {
    /**
     * Represents the content of a comment to be returned to agents.
     */
    comment?: CommentContent;
    /**
     * Object representing a contact in Amazon Connect as an API request field.
     */
    contact?: Contact;
  }
  export type RelatedItemType = "Contact"|"Comment"|string;
  export interface RelatedItemTypeFilter {
    /**
     * A filter for related items of type Comment.
     */
    comment?: CommentFilter;
    /**
     * A filter for related items of type Contact.
     */
    contact?: ContactFilter;
  }
  export interface RequiredField {
    /**
     * Unique identifier of a field.
     */
    fieldId: FieldId;
  }
  export type RequiredFieldList = RequiredField[];
  export interface SearchCasesRequest {
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The list of field identifiers to be returned as part of the response.
     */
    fields?: SearchCasesRequestFieldsList;
    /**
     * A list of filter objects.
     */
    filter?: CaseFilter;
    /**
     * The maximum number of cases to return. The current maximum supported value is 25. This is also the default value when no other value is provided.
     */
    maxResults?: SearchCasesRequestMaxResultsInteger;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
    /**
     * A word or phrase used to perform a quick search.
     */
    searchTerm?: SearchCasesRequestSearchTermString;
    /**
     * A list of sorts where each sort specifies a field and their sort order to be applied to the results. 
     */
    sorts?: SearchCasesRequestSortsList;
  }
  export type SearchCasesRequestFieldsList = FieldIdentifier[];
  export type SearchCasesRequestMaxResultsInteger = number;
  export type SearchCasesRequestSearchTermString = string;
  export type SearchCasesRequestSortsList = Sort[];
  export interface SearchCasesResponse {
    /**
     * A list of case documents where each case contains the properties CaseId and Fields where each field is a complex union structure. 
     */
    cases: SearchCasesResponseCasesList;
    /**
     * The token for the next set of results. This is null if there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export type SearchCasesResponseCasesList = SearchCasesResponseItem[];
  export interface SearchCasesResponseItem {
    /**
     * A unique identifier of the case.
     */
    caseId: CaseId;
    /**
     * List of case field values.
     */
    fields: SearchCasesResponseItemFieldsList;
    /**
     * A map of of key-value pairs that represent tags on a resource. Tags are used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * A unique identifier of a template.
     */
    templateId: TemplateId;
  }
  export type SearchCasesResponseItemFieldsList = FieldValue[];
  export interface SearchRelatedItemsRequest {
    /**
     * A unique identifier of the case.
     */
    caseId: CaseId;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The list of types of related items and their parameters to use for filtering.
     */
    filters?: SearchRelatedItemsRequestFiltersList;
    /**
     * The maximum number of results to return per page.
     */
    maxResults?: SearchRelatedItemsRequestMaxResultsInteger;
    /**
     * The token for the next set of results. Use the value returned in the previous response in the next request to retrieve the next set of results.
     */
    nextToken?: NextToken;
  }
  export type SearchRelatedItemsRequestFiltersList = RelatedItemTypeFilter[];
  export type SearchRelatedItemsRequestMaxResultsInteger = number;
  export interface SearchRelatedItemsResponse {
    /**
     * The token for the next set of results. This is null if there are no more results to return.
     */
    nextToken?: NextToken;
    /**
     * A list of items related to a case. 
     */
    relatedItems: SearchRelatedItemsResponseRelatedItemsList;
  }
  export interface SearchRelatedItemsResponseItem {
    /**
     * Time at which a related item was associated with a case.
     */
    associationTime: AssociationTime;
    /**
     * Represents the content of a particular type of related item.
     */
    content: RelatedItemContent;
    /**
     * Unique identifier of a related item.
     */
    relatedItemId: RelatedItemId;
    /**
     * A map of of key-value pairs that represent tags on a resource. Tags are used to organize, track, or control access for this resource.
     */
    tags?: Tags;
    /**
     * Type of a related item.
     */
    type: RelatedItemType;
  }
  export type SearchRelatedItemsResponseRelatedItemsList = SearchRelatedItemsResponseItem[];
  export interface Section {
    /**
     * Consists of a group of fields and associated properties.
     */
    fieldGroup?: FieldGroup;
  }
  export type SectionsList = Section[];
  export interface Sort {
    /**
     * Unique identifier of a field.
     */
    fieldId: FieldId;
    /**
     * A structured set of sort terms
     */
    sortOrder: Order;
  }
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN)
     */
    arn: Arn;
    /**
     * A map of of key-value pairs that represent tags on a resource. Tags are used to organize, track, or control access for this resource.
     */
    tags: Tags;
  }
  export type Tags = {[key: string]: String};
  export type TemplateArn = string;
  export type TemplateDescription = string;
  export type TemplateId = string;
  export type TemplateName = string;
  export type TemplateStatus = "Active"|"Inactive"|string;
  export type TemplateStatusFilters = TemplateStatus[];
  export interface TemplateSummary {
    /**
     * The template name.
     */
    name: TemplateName;
    /**
     * The status of the template.
     */
    status: TemplateStatus;
    /**
     * The Amazon Resource Name (ARN) of the template.
     */
    templateArn: TemplateArn;
    /**
     * The unique identifier for the template.
     */
    templateId: TemplateId;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN)
     */
    arn: Arn;
    /**
     * List of tag keys.
     */
    tagKeys: TagKeyList;
  }
  export interface UpdateCaseRequest {
    /**
     * A unique identifier of the case.
     */
    caseId: CaseId;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * An array of objects with fieldId (matching ListFields/DescribeField) and value union data, structured identical to CreateCase.
     */
    fields: UpdateCaseRequestFieldsList;
  }
  export type UpdateCaseRequestFieldsList = FieldValue[];
  export interface UpdateCaseResponse {
  }
  export interface UpdateFieldRequest {
    /**
     * The description of a field.
     */
    description?: FieldDescription;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The unique identifier of a field.
     */
    fieldId: FieldId;
    /**
     * The name of the field.
     */
    name?: FieldName;
  }
  export interface UpdateFieldResponse {
  }
  export interface UpdateLayoutRequest {
    /**
     * Information about which fields will be present in the layout, the order of the fields, and a read-only attribute of the field. 
     */
    content?: LayoutContent;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * The unique identifier of the layout.
     */
    layoutId: LayoutId;
    /**
     * The name of the layout. It must be unique per domain.
     */
    name?: LayoutName;
  }
  export interface UpdateLayoutResponse {
  }
  export interface UpdateTemplateRequest {
    /**
     * A brief description of the template.
     */
    description?: TemplateDescription;
    /**
     * The unique identifier of the Cases domain. 
     */
    domainId: DomainId;
    /**
     * Configuration of layouts associated to the template.
     */
    layoutConfiguration?: LayoutConfiguration;
    /**
     * The name of the template. It must be unique per domain.
     */
    name?: TemplateName;
    /**
     * A list of fields that must contain a value for a case to be successfully created with this template.
     */
    requiredFields?: RequiredFieldList;
    /**
     * The status of the template.
     */
    status?: TemplateStatus;
    /**
     * A unique identifier for the template.
     */
    templateId: TemplateId;
  }
  export interface UpdateTemplateResponse {
  }
  export type Value = string;
  export type ValuesList = Value[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-10-03"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ConnectCases client.
   */
  export import Types = ConnectCases;
}
export = ConnectCases;
