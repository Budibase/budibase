import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ResourceExplorer2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ResourceExplorer2.Types.ClientConfiguration)
  config: Config & ResourceExplorer2.Types.ClientConfiguration;
  /**
   * Sets the specified view as the default for the Amazon Web Services Region in which you call this operation. When a user performs a Search that doesn't explicitly specify which view to use, then Amazon Web Services Resource Explorer automatically chooses this default view for searches performed in this Amazon Web Services Region. If an Amazon Web Services Region doesn't have a default view configured, then users must explicitly specify a view with every Search operation performed in that Region.
   */
  associateDefaultView(params: ResourceExplorer2.Types.AssociateDefaultViewInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.AssociateDefaultViewOutput) => void): Request<ResourceExplorer2.Types.AssociateDefaultViewOutput, AWSError>;
  /**
   * Sets the specified view as the default for the Amazon Web Services Region in which you call this operation. When a user performs a Search that doesn't explicitly specify which view to use, then Amazon Web Services Resource Explorer automatically chooses this default view for searches performed in this Amazon Web Services Region. If an Amazon Web Services Region doesn't have a default view configured, then users must explicitly specify a view with every Search operation performed in that Region.
   */
  associateDefaultView(callback?: (err: AWSError, data: ResourceExplorer2.Types.AssociateDefaultViewOutput) => void): Request<ResourceExplorer2.Types.AssociateDefaultViewOutput, AWSError>;
  /**
   * Retrieves details about a list of views.
   */
  batchGetView(params: ResourceExplorer2.Types.BatchGetViewInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.BatchGetViewOutput) => void): Request<ResourceExplorer2.Types.BatchGetViewOutput, AWSError>;
  /**
   * Retrieves details about a list of views.
   */
  batchGetView(callback?: (err: AWSError, data: ResourceExplorer2.Types.BatchGetViewOutput) => void): Request<ResourceExplorer2.Types.BatchGetViewOutput, AWSError>;
  /**
   * Turns on Amazon Web Services Resource Explorer in the Amazon Web Services Region in which you called this operation by creating an index. Resource Explorer begins discovering the resources in this Region and stores the details about the resources in the index so that they can be queried by using the Search operation. You can create only one index in a Region.  This operation creates only a local index. To promote the local index in one Amazon Web Services Region into the aggregator index for the Amazon Web Services account, use the UpdateIndexType operation. For more information, see Turning on cross-Region search by creating an aggregator index in the Amazon Web Services Resource Explorer User Guide.  For more details about what happens when you turn on Resource Explorer in an Amazon Web Services Region, see Turn on Resource Explorer to index your resources in an Amazon Web Services Region in the Amazon Web Services Resource Explorer User Guide. If this is the first Amazon Web Services Region in which you've created an index for Resource Explorer, then this operation also creates a service-linked role in your Amazon Web Services account that allows Resource Explorer to enumerate your resources to populate the index.    Action: resource-explorer-2:CreateIndex   Resource: The ARN of the index (as it will exist after the operation completes) in the Amazon Web Services Region and account in which you're trying to create the index. Use the wildcard character (*) at the end of the string to match the eventual UUID. For example, the following Resource element restricts the role or user to creating an index in only the us-east-2 Region of the specified account.  "Resource": "arn:aws:resource-explorer-2:us-west-2:&lt;account-id&gt;:index/*"  Alternatively, you can use "Resource": "*" to allow the role or user to create an index in any Region.    Action: iam:CreateServiceLinkedRole   Resource: No specific resource (*).  This permission is required only the first time you create an index to turn on Resource Explorer in the account. Resource Explorer uses this to create the service-linked role needed to index the resources in your account. Resource Explorer uses the same service-linked role for all additional indexes you create afterwards.  
   */
  createIndex(params: ResourceExplorer2.Types.CreateIndexInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.CreateIndexOutput) => void): Request<ResourceExplorer2.Types.CreateIndexOutput, AWSError>;
  /**
   * Turns on Amazon Web Services Resource Explorer in the Amazon Web Services Region in which you called this operation by creating an index. Resource Explorer begins discovering the resources in this Region and stores the details about the resources in the index so that they can be queried by using the Search operation. You can create only one index in a Region.  This operation creates only a local index. To promote the local index in one Amazon Web Services Region into the aggregator index for the Amazon Web Services account, use the UpdateIndexType operation. For more information, see Turning on cross-Region search by creating an aggregator index in the Amazon Web Services Resource Explorer User Guide.  For more details about what happens when you turn on Resource Explorer in an Amazon Web Services Region, see Turn on Resource Explorer to index your resources in an Amazon Web Services Region in the Amazon Web Services Resource Explorer User Guide. If this is the first Amazon Web Services Region in which you've created an index for Resource Explorer, then this operation also creates a service-linked role in your Amazon Web Services account that allows Resource Explorer to enumerate your resources to populate the index.    Action: resource-explorer-2:CreateIndex   Resource: The ARN of the index (as it will exist after the operation completes) in the Amazon Web Services Region and account in which you're trying to create the index. Use the wildcard character (*) at the end of the string to match the eventual UUID. For example, the following Resource element restricts the role or user to creating an index in only the us-east-2 Region of the specified account.  "Resource": "arn:aws:resource-explorer-2:us-west-2:&lt;account-id&gt;:index/*"  Alternatively, you can use "Resource": "*" to allow the role or user to create an index in any Region.    Action: iam:CreateServiceLinkedRole   Resource: No specific resource (*).  This permission is required only the first time you create an index to turn on Resource Explorer in the account. Resource Explorer uses this to create the service-linked role needed to index the resources in your account. Resource Explorer uses the same service-linked role for all additional indexes you create afterwards.  
   */
  createIndex(callback?: (err: AWSError, data: ResourceExplorer2.Types.CreateIndexOutput) => void): Request<ResourceExplorer2.Types.CreateIndexOutput, AWSError>;
  /**
   * Creates a view that users can query by using the Search operation. Results from queries that you make using this view include only resources that match the view's Filters. For more information about Amazon Web Services Resource Explorer views, see Managing views in the Amazon Web Services Resource Explorer User Guide. Only the principals with an IAM identity-based policy that grants Allow to the Search action on a Resource with the Amazon resource name (ARN) of this view can Search using views you create with this operation.
   */
  createView(params: ResourceExplorer2.Types.CreateViewInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.CreateViewOutput) => void): Request<ResourceExplorer2.Types.CreateViewOutput, AWSError>;
  /**
   * Creates a view that users can query by using the Search operation. Results from queries that you make using this view include only resources that match the view's Filters. For more information about Amazon Web Services Resource Explorer views, see Managing views in the Amazon Web Services Resource Explorer User Guide. Only the principals with an IAM identity-based policy that grants Allow to the Search action on a Resource with the Amazon resource name (ARN) of this view can Search using views you create with this operation.
   */
  createView(callback?: (err: AWSError, data: ResourceExplorer2.Types.CreateViewOutput) => void): Request<ResourceExplorer2.Types.CreateViewOutput, AWSError>;
  /**
   * Deletes the specified index and turns off Amazon Web Services Resource Explorer in the specified Amazon Web Services Region. When you delete an index, Resource Explorer stops discovering and indexing resources in that Region. Resource Explorer also deletes all views in that Region. These actions occur as asynchronous background tasks. You can check to see when the actions are complete by using the GetIndex operation and checking the Status response value.  If the index you delete is the aggregator index for the Amazon Web Services account, you must wait 24 hours before you can promote another local index to be the aggregator index for the account. Users can't perform account-wide searches using Resource Explorer until another aggregator index is configured. 
   */
  deleteIndex(params: ResourceExplorer2.Types.DeleteIndexInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.DeleteIndexOutput) => void): Request<ResourceExplorer2.Types.DeleteIndexOutput, AWSError>;
  /**
   * Deletes the specified index and turns off Amazon Web Services Resource Explorer in the specified Amazon Web Services Region. When you delete an index, Resource Explorer stops discovering and indexing resources in that Region. Resource Explorer also deletes all views in that Region. These actions occur as asynchronous background tasks. You can check to see when the actions are complete by using the GetIndex operation and checking the Status response value.  If the index you delete is the aggregator index for the Amazon Web Services account, you must wait 24 hours before you can promote another local index to be the aggregator index for the account. Users can't perform account-wide searches using Resource Explorer until another aggregator index is configured. 
   */
  deleteIndex(callback?: (err: AWSError, data: ResourceExplorer2.Types.DeleteIndexOutput) => void): Request<ResourceExplorer2.Types.DeleteIndexOutput, AWSError>;
  /**
   * Deletes the specified view. If the specified view is the default view for its Amazon Web Services Region, then all Search operations in that Region must explicitly specify the view to use until you configure a new default by calling the AssociateDefaultView operation.
   */
  deleteView(params: ResourceExplorer2.Types.DeleteViewInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.DeleteViewOutput) => void): Request<ResourceExplorer2.Types.DeleteViewOutput, AWSError>;
  /**
   * Deletes the specified view. If the specified view is the default view for its Amazon Web Services Region, then all Search operations in that Region must explicitly specify the view to use until you configure a new default by calling the AssociateDefaultView operation.
   */
  deleteView(callback?: (err: AWSError, data: ResourceExplorer2.Types.DeleteViewOutput) => void): Request<ResourceExplorer2.Types.DeleteViewOutput, AWSError>;
  /**
   * After you call this operation, the affected Amazon Web Services Region no longer has a default view. All Search operations in that Region must explicitly specify a view or the operation fails. You can configure a new default by calling the AssociateDefaultView operation. If an Amazon Web Services Region doesn't have a default view configured, then users must explicitly specify a view with every Search operation performed in that Region.
   */
  disassociateDefaultView(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves the Amazon Resource Name (ARN) of the view that is the default for the Amazon Web Services Region in which you call this operation. You can then call GetView to retrieve the details of that view.
   */
  getDefaultView(callback?: (err: AWSError, data: ResourceExplorer2.Types.GetDefaultViewOutput) => void): Request<ResourceExplorer2.Types.GetDefaultViewOutput, AWSError>;
  /**
   * Retrieves details about the Amazon Web Services Resource Explorer index in the Amazon Web Services Region in which you invoked the operation.
   */
  getIndex(callback?: (err: AWSError, data: ResourceExplorer2.Types.GetIndexOutput) => void): Request<ResourceExplorer2.Types.GetIndexOutput, AWSError>;
  /**
   * Retrieves details of the specified view.
   */
  getView(params: ResourceExplorer2.Types.GetViewInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.GetViewOutput) => void): Request<ResourceExplorer2.Types.GetViewOutput, AWSError>;
  /**
   * Retrieves details of the specified view.
   */
  getView(callback?: (err: AWSError, data: ResourceExplorer2.Types.GetViewOutput) => void): Request<ResourceExplorer2.Types.GetViewOutput, AWSError>;
  /**
   * Retrieves a list of all of the indexes in Amazon Web Services Regions that are currently collecting resource information for Amazon Web Services Resource Explorer.
   */
  listIndexes(params: ResourceExplorer2.Types.ListIndexesInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.ListIndexesOutput) => void): Request<ResourceExplorer2.Types.ListIndexesOutput, AWSError>;
  /**
   * Retrieves a list of all of the indexes in Amazon Web Services Regions that are currently collecting resource information for Amazon Web Services Resource Explorer.
   */
  listIndexes(callback?: (err: AWSError, data: ResourceExplorer2.Types.ListIndexesOutput) => void): Request<ResourceExplorer2.Types.ListIndexesOutput, AWSError>;
  /**
   * Retrieves a list of all resource types currently supported by Amazon Web Services Resource Explorer.
   */
  listSupportedResourceTypes(params: ResourceExplorer2.Types.ListSupportedResourceTypesInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.ListSupportedResourceTypesOutput) => void): Request<ResourceExplorer2.Types.ListSupportedResourceTypesOutput, AWSError>;
  /**
   * Retrieves a list of all resource types currently supported by Amazon Web Services Resource Explorer.
   */
  listSupportedResourceTypes(callback?: (err: AWSError, data: ResourceExplorer2.Types.ListSupportedResourceTypesOutput) => void): Request<ResourceExplorer2.Types.ListSupportedResourceTypesOutput, AWSError>;
  /**
   * Lists the tags that are attached to the specified resource.
   */
  listTagsForResource(params: ResourceExplorer2.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.ListTagsForResourceOutput) => void): Request<ResourceExplorer2.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists the tags that are attached to the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ResourceExplorer2.Types.ListTagsForResourceOutput) => void): Request<ResourceExplorer2.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists the Amazon resource names (ARNs) of the views available in the Amazon Web Services Region in which you call this operation.  Always check the NextToken response parameter for a null value when calling a paginated operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display. 
   */
  listViews(params: ResourceExplorer2.Types.ListViewsInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.ListViewsOutput) => void): Request<ResourceExplorer2.Types.ListViewsOutput, AWSError>;
  /**
   * Lists the Amazon resource names (ARNs) of the views available in the Amazon Web Services Region in which you call this operation.  Always check the NextToken response parameter for a null value when calling a paginated operation. These operations can occasionally return an empty set of results even when there are more results available. The NextToken response parameter value is null only when there are no more results to display. 
   */
  listViews(callback?: (err: AWSError, data: ResourceExplorer2.Types.ListViewsOutput) => void): Request<ResourceExplorer2.Types.ListViewsOutput, AWSError>;
  /**
   * Searches for resources and displays details about all resources that match the specified criteria. You must specify a query string. All search queries must use a view. If you don't explicitly specify a view, then Amazon Web Services Resource Explorer uses the default view for the Amazon Web Services Region in which you call this operation. The results are the logical intersection of the results that match both the QueryString parameter supplied to this operation and the SearchFilter parameter attached to the view. For the complete syntax supported by the QueryString parameter, see Search query syntax reference for Resource Explorer. If your search results are empty, or are missing results that you think should be there, see Troubleshooting Resource Explorer search.
   */
  search(params: ResourceExplorer2.Types.SearchInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.SearchOutput) => void): Request<ResourceExplorer2.Types.SearchOutput, AWSError>;
  /**
   * Searches for resources and displays details about all resources that match the specified criteria. You must specify a query string. All search queries must use a view. If you don't explicitly specify a view, then Amazon Web Services Resource Explorer uses the default view for the Amazon Web Services Region in which you call this operation. The results are the logical intersection of the results that match both the QueryString parameter supplied to this operation and the SearchFilter parameter attached to the view. For the complete syntax supported by the QueryString parameter, see Search query syntax reference for Resource Explorer. If your search results are empty, or are missing results that you think should be there, see Troubleshooting Resource Explorer search.
   */
  search(callback?: (err: AWSError, data: ResourceExplorer2.Types.SearchOutput) => void): Request<ResourceExplorer2.Types.SearchOutput, AWSError>;
  /**
   * Adds one or more tag key and value pairs to an Amazon Web Services Resource Explorer view or index.
   */
  tagResource(params: ResourceExplorer2.Types.TagResourceInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.TagResourceOutput) => void): Request<ResourceExplorer2.Types.TagResourceOutput, AWSError>;
  /**
   * Adds one or more tag key and value pairs to an Amazon Web Services Resource Explorer view or index.
   */
  tagResource(callback?: (err: AWSError, data: ResourceExplorer2.Types.TagResourceOutput) => void): Request<ResourceExplorer2.Types.TagResourceOutput, AWSError>;
  /**
   * Removes one or more tag key and value pairs from an Amazon Web Services Resource Explorer view or index.
   */
  untagResource(params: ResourceExplorer2.Types.UntagResourceInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.UntagResourceOutput) => void): Request<ResourceExplorer2.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes one or more tag key and value pairs from an Amazon Web Services Resource Explorer view or index.
   */
  untagResource(callback?: (err: AWSError, data: ResourceExplorer2.Types.UntagResourceOutput) => void): Request<ResourceExplorer2.Types.UntagResourceOutput, AWSError>;
  /**
   * Changes the type of the index from one of the following types to the other. For more information about indexes and the role they perform in Amazon Web Services Resource Explorer, see Turning on cross-Region search by creating an aggregator index in the Amazon Web Services Resource Explorer User Guide.     AGGREGATOR index type  The index contains information about resources from all Amazon Web Services Regions in the Amazon Web Services account in which you've created a Resource Explorer index. Resource information from all other Regions is replicated to this Region's index. When you change the index type to AGGREGATOR, Resource Explorer turns on replication of all discovered resource information from the other Amazon Web Services Regions in your account to this index. You can then, from this Region only, perform resource search queries that span all Amazon Web Services Regions in the Amazon Web Services account. Turning on replication from all other Regions is performed by asynchronous background tasks. You can check the status of the asynchronous tasks by using the GetIndex operation. When the asynchronous tasks complete, the Status response of that operation changes from UPDATING to ACTIVE. After that, you can start to see results from other Amazon Web Services Regions in query results. However, it can take several hours for replication from all other Regions to complete.  You can have only one aggregator index per Amazon Web Services account. Before you can promote a different index to be the aggregator index for the account, you must first demote the existing aggregator index to type LOCAL.      LOCAL index type  The index contains information about resources in only the Amazon Web Services Region in which the index exists. If an aggregator index in another Region exists, then information in this local index is replicated to the aggregator index. When you change the index type to LOCAL, Resource Explorer turns off the replication of resource information from all other Amazon Web Services Regions in the Amazon Web Services account to this Region. The aggregator index remains in the UPDATING state until all replication with other Regions successfully stops. You can check the status of the asynchronous task by using the GetIndex operation. When Resource Explorer successfully stops all replication with other Regions, the Status response of that operation changes from UPDATING to ACTIVE. Separately, the resource information from other Regions that was previously stored in the index is deleted within 30 days by another background task. Until that asynchronous task completes, some results from other Regions can continue to appear in search results.  After you demote an aggregator index to a local index, you must wait 24 hours before you can promote another index to be the new aggregator index for the account.   
   */
  updateIndexType(params: ResourceExplorer2.Types.UpdateIndexTypeInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.UpdateIndexTypeOutput) => void): Request<ResourceExplorer2.Types.UpdateIndexTypeOutput, AWSError>;
  /**
   * Changes the type of the index from one of the following types to the other. For more information about indexes and the role they perform in Amazon Web Services Resource Explorer, see Turning on cross-Region search by creating an aggregator index in the Amazon Web Services Resource Explorer User Guide.     AGGREGATOR index type  The index contains information about resources from all Amazon Web Services Regions in the Amazon Web Services account in which you've created a Resource Explorer index. Resource information from all other Regions is replicated to this Region's index. When you change the index type to AGGREGATOR, Resource Explorer turns on replication of all discovered resource information from the other Amazon Web Services Regions in your account to this index. You can then, from this Region only, perform resource search queries that span all Amazon Web Services Regions in the Amazon Web Services account. Turning on replication from all other Regions is performed by asynchronous background tasks. You can check the status of the asynchronous tasks by using the GetIndex operation. When the asynchronous tasks complete, the Status response of that operation changes from UPDATING to ACTIVE. After that, you can start to see results from other Amazon Web Services Regions in query results. However, it can take several hours for replication from all other Regions to complete.  You can have only one aggregator index per Amazon Web Services account. Before you can promote a different index to be the aggregator index for the account, you must first demote the existing aggregator index to type LOCAL.      LOCAL index type  The index contains information about resources in only the Amazon Web Services Region in which the index exists. If an aggregator index in another Region exists, then information in this local index is replicated to the aggregator index. When you change the index type to LOCAL, Resource Explorer turns off the replication of resource information from all other Amazon Web Services Regions in the Amazon Web Services account to this Region. The aggregator index remains in the UPDATING state until all replication with other Regions successfully stops. You can check the status of the asynchronous task by using the GetIndex operation. When Resource Explorer successfully stops all replication with other Regions, the Status response of that operation changes from UPDATING to ACTIVE. Separately, the resource information from other Regions that was previously stored in the index is deleted within 30 days by another background task. Until that asynchronous task completes, some results from other Regions can continue to appear in search results.  After you demote an aggregator index to a local index, you must wait 24 hours before you can promote another index to be the new aggregator index for the account.   
   */
  updateIndexType(callback?: (err: AWSError, data: ResourceExplorer2.Types.UpdateIndexTypeOutput) => void): Request<ResourceExplorer2.Types.UpdateIndexTypeOutput, AWSError>;
  /**
   * Modifies some of the details of a view. You can change the filter string and the list of included properties. You can't change the name of the view.
   */
  updateView(params: ResourceExplorer2.Types.UpdateViewInput, callback?: (err: AWSError, data: ResourceExplorer2.Types.UpdateViewOutput) => void): Request<ResourceExplorer2.Types.UpdateViewOutput, AWSError>;
  /**
   * Modifies some of the details of a view. You can change the filter string and the list of included properties. You can't change the name of the view.
   */
  updateView(callback?: (err: AWSError, data: ResourceExplorer2.Types.UpdateViewOutput) => void): Request<ResourceExplorer2.Types.UpdateViewOutput, AWSError>;
}
declare namespace ResourceExplorer2 {
  export interface AssociateDefaultViewInput {
    /**
     * The Amazon resource name (ARN) of the view to set as the default for the Amazon Web Services Region and Amazon Web Services account in which you call this operation. The specified view must already exist in the called Region.
     */
    ViewArn: AssociateDefaultViewInputViewArnString;
  }
  export type AssociateDefaultViewInputViewArnString = string;
  export interface AssociateDefaultViewOutput {
    /**
     * The Amazon resource name (ARN) of the view that the operation set as the default for queries made in the Amazon Web Services Region and Amazon Web Services account in which you called this operation.
     */
    ViewArn?: String;
  }
  export interface BatchGetViewError {
    /**
     * The description of the error for the specified view.
     */
    ErrorMessage: String;
    /**
     * The Amazon resource name (ARN) of the view for which Resource Explorer failed to retrieve details.
     */
    ViewArn: String;
  }
  export type BatchGetViewErrors = BatchGetViewError[];
  export interface BatchGetViewInput {
    /**
     * A list of Amazon resource names (ARNs) that identify the views you want details for.
     */
    ViewArns?: BatchGetViewInputViewArnsList;
  }
  export type BatchGetViewInputViewArnsList = String[];
  export interface BatchGetViewOutput {
    /**
     * If any of the specified ARNs result in an error, then this structure describes the error.
     */
    Errors?: BatchGetViewErrors;
    /**
     * A structure with a list of objects with details for each of the specified views.
     */
    Views?: ViewList;
  }
  export type Boolean = boolean;
  export interface CreateIndexInput {
    /**
     * This value helps ensure idempotency. Resource Explorer uses this value to prevent the accidental creation of duplicate versions. We recommend that you generate a UUID-type value to ensure the uniqueness of your views.
     */
    ClientToken?: String;
    /**
     * The specified tags are attached only to the index created in this Amazon Web Services Region. The tags aren't attached to any of the resources listed in the index.
     */
    Tags?: TagMap;
  }
  export interface CreateIndexOutput {
    /**
     * The ARN of the new local index for the Region. You can reference this ARN in IAM permission policies to authorize the following operations: DeleteIndex | GetIndex | UpdateIndexType | CreateView 
     */
    Arn?: String;
    /**
     * The date and timestamp when the index was created.
     */
    CreatedAt?: SyntheticTimestamp_date_time;
    /**
     * Indicates the current state of the index. You can check for changes to the state for asynchronous operations by calling the GetIndex operation.  The state can remain in the CREATING or UPDATING state for several hours as Resource Explorer discovers the information about your resources and populates the index. 
     */
    State?: IndexState;
  }
  export interface CreateViewInput {
    /**
     * This value helps ensure idempotency. Resource Explorer uses this value to prevent the accidental creation of duplicate versions. We recommend that you generate a UUID-type value to ensure the uniqueness of your views.
     */
    ClientToken?: CreateViewInputClientTokenString;
    /**
     * An array of strings that specify which resources are included in the results of queries made using this view. When you use this view in a Search operation, the filter string is combined with the search's QueryString parameter using a logical AND operator. For information about the supported syntax, see Search query reference for Resource Explorer in the Amazon Web Services Resource Explorer User Guide.  This query string in the context of this operation supports only filter prefixes with optional operators. It doesn't support free-form text. For example, the string region:us* service:ec2 -tag:stage=prod includes all Amazon EC2 resources in any Amazon Web Services Region that begins with the letters us and is not tagged with a key Stage that has the value prod. 
     */
    Filters?: SearchFilter;
    /**
     * Specifies optional fields that you want included in search results from this view. It is a list of objects that each describe a field to include. The default is an empty list, with no optional fields included in the results.
     */
    IncludedProperties?: IncludedPropertyList;
    /**
     * Tag key and value pairs that are attached to the view.
     */
    Tags?: TagMap;
    /**
     * The name of the new view. This name appears in the list of views in Resource Explorer. The name must be no more than 64 characters long, and can include letters, digits, and the dash (-) character. The name must be unique within its Amazon Web Services Region.
     */
    ViewName: ViewName;
  }
  export type CreateViewInputClientTokenString = string;
  export interface CreateViewOutput {
    /**
     * A structure that contains the details about the new view.
     */
    View?: View;
  }
  export interface DeleteIndexInput {
    /**
     * The Amazon resource name (ARN) of the index that you want to delete.
     */
    Arn: String;
  }
  export interface DeleteIndexOutput {
    /**
     * The Amazon resource name (ARN) of the index that you successfully started the deletion process.  This operation is asynchronous. To check its status, call the GetIndex operation. 
     */
    Arn?: String;
    /**
     * The date and time when you last updated this index.
     */
    LastUpdatedAt?: SyntheticTimestamp_date_time;
    /**
     * Indicates the current state of the index. 
     */
    State?: IndexState;
  }
  export interface DeleteViewInput {
    /**
     * The Amazon resource name (ARN) of the view that you want to delete.
     */
    ViewArn: DeleteViewInputViewArnString;
  }
  export type DeleteViewInputViewArnString = string;
  export interface DeleteViewOutput {
    /**
     * The Amazon resource name (ARN) of the view that you successfully deleted.
     */
    ViewArn?: String;
  }
  export interface Document {
  }
  export interface GetDefaultViewOutput {
    /**
     * The Amazon resource name (ARN) of the view that is the current default for the Amazon Web Services Region in which you called this operation.
     */
    ViewArn?: String;
  }
  export interface GetIndexOutput {
    /**
     * The Amazon resource name (ARN) of the index.
     */
    Arn?: String;
    /**
     * The date and time when the index was originally created.
     */
    CreatedAt?: SyntheticTimestamp_date_time;
    /**
     * The date and time when the index was last updated.
     */
    LastUpdatedAt?: SyntheticTimestamp_date_time;
    /**
     * This response value is present only if this index is Type=AGGREGATOR. A list of the Amazon Web Services Regions that replicate their content to the index in this Region.
     */
    ReplicatingFrom?: RegionList;
    /**
     * This response value is present only if this index is Type=LOCAL. The Amazon Web Services Region that contains the aggregator index, if one exists. If an aggregator index does exist then the Region in which you called this operation replicates its index information to the Region specified in this response value. 
     */
    ReplicatingTo?: RegionList;
    /**
     * The current state of the index in this Amazon Web Services Region.
     */
    State?: IndexState;
    /**
     * Tag key and value pairs that are attached to the index.
     */
    Tags?: TagMap;
    /**
     * The type of the index in this Region. For information about the aggregator index and how it differs from a local index, see Turning on cross-Region search by creating an aggregator index.
     */
    Type?: IndexType;
  }
  export interface GetViewInput {
    /**
     * The Amazon resource name (ARN) of the view that you want information about.
     */
    ViewArn: GetViewInputViewArnString;
  }
  export type GetViewInputViewArnString = string;
  export interface GetViewOutput {
    /**
     * Tag key and value pairs that are attached to the view.
     */
    Tags?: TagMap;
    /**
     * A structure that contains the details for the requested view.
     */
    View?: View;
  }
  export interface IncludedProperty {
    /**
     * The name of the property that is included in this view. You can specify the following property names for this field:    Tags   
     */
    Name: IncludedPropertyNameString;
  }
  export type IncludedPropertyList = IncludedProperty[];
  export type IncludedPropertyNameString = string;
  export interface Index {
    /**
     * The Amazon resource name (ARN) of the index.
     */
    Arn?: String;
    /**
     * The Amazon Web Services Region in which the index exists.
     */
    Region?: String;
    /**
     * The type of index. It can be one of the following values:    LOCAL – The index contains information about resources from only the same Amazon Web Services Region.    AGGREGATOR – Resource Explorer replicates copies of the indexed information about resources in all other Amazon Web Services Regions to the aggregator index. This lets search results in the Region with the aggregator index to include resources from all Regions in the account where Resource Explorer is turned on.  
     */
    Type?: IndexType;
  }
  export type IndexList = Index[];
  export type IndexState = "CREATING"|"ACTIVE"|"DELETING"|"DELETED"|"UPDATING"|string;
  export type IndexType = "LOCAL"|"AGGREGATOR"|string;
  export interface ListIndexesInput {
    /**
     * The maximum number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value appropriate to the operation. If additional items exist beyond those included in the current response, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results.  An API operation can return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. 
     */
    MaxResults?: ListIndexesInputMaxResultsInteger;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: ListIndexesInputNextTokenString;
    /**
     * If specified, limits the response to only information about the index in the specified list of Amazon Web Services Regions.
     */
    Regions?: ListIndexesInputRegionsList;
    /**
     * If specified, limits the output to only indexes of the specified Type, either LOCAL or AGGREGATOR. Use this option to discover the aggregator index for your account.
     */
    Type?: IndexType;
  }
  export type ListIndexesInputMaxResultsInteger = number;
  export type ListIndexesInputNextTokenString = string;
  export type ListIndexesInputRegionsList = String[];
  export interface ListIndexesOutput {
    /**
     * A structure that contains the details and status of each index.
     */
    Indexes?: IndexList;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: String;
  }
  export interface ListSupportedResourceTypesInput {
    /**
     * The maximum number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value appropriate to the operation. If additional items exist beyond those included in the current response, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results.  An API operation can return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. 
     */
    MaxResults?: ListSupportedResourceTypesInputMaxResultsInteger;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: String;
  }
  export type ListSupportedResourceTypesInputMaxResultsInteger = number;
  export interface ListSupportedResourceTypesOutput {
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: String;
    /**
     * The list of resource types supported by Resource Explorer.
     */
    ResourceTypes?: ResourceTypeList;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon resource name (ARN) of the view or index that you want to attach tags to.
     */
    resourceArn: String;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The tag key and value pairs that you want to attach to the specified view or index.
     */
    Tags?: TagMap;
  }
  export interface ListViewsInput {
    /**
     * The maximum number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value appropriate to the operation. If additional items exist beyond those included in the current response, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results.  An API operation can return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. 
     */
    MaxResults?: ListViewsInputMaxResultsInteger;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: String;
  }
  export type ListViewsInputMaxResultsInteger = number;
  export interface ListViewsOutput {
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: String;
    /**
     * The list of views available in the Amazon Web Services Region in which you called this operation.
     */
    Views?: ViewArnList;
  }
  export type Long = number;
  export type QueryString = string;
  export type RegionList = String[];
  export interface Resource {
    /**
     * The Amazon resource name (ARN) of the resource.
     */
    Arn?: String;
    /**
     * The date and time that Resource Explorer last queried this resource and updated the index with the latest information about the resource.
     */
    LastReportedAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon Web Services account that owns the resource.
     */
    OwningAccountId?: String;
    /**
     * A structure with additional type-specific details about the resource. These properties can be added by turning on integration between Resource Explorer and other Amazon Web Services services.
     */
    Properties?: ResourcePropertyList;
    /**
     * The Amazon Web Services Region in which the resource was created and exists.
     */
    Region?: String;
    /**
     * The type of the resource.
     */
    ResourceType?: String;
    /**
     * The Amazon Web Service that owns the resource and is responsible for creating and updating it.
     */
    Service?: String;
  }
  export interface ResourceCount {
    /**
     * Indicates whether the TotalResources value represents an exhaustive count of search results.   If True, it indicates that the search was exhaustive. Every resource that matches the query was counted.   If False, then the search reached the limit of 1,000 matching results, and stopped counting.  
     */
    Complete?: Boolean;
    /**
     * The number of resources that match the search query. This value can't exceed 1,000. If there are more than 1,000 resources that match the query, then only 1,000 are counted and the Complete field is set to false. We recommend that you refine your query to return a smaller number of results.
     */
    TotalResources?: Long;
  }
  export type ResourceList = Resource[];
  export interface ResourceProperty {
    /**
     * Details about this property. The content of this field is a JSON object that varies based on the resource type.
     */
    Data?: Document;
    /**
     * The date and time that the information about this resource property was last updated.
     */
    LastReportedAt?: SyntheticTimestamp_date_time;
    /**
     * The name of this property of the resource.
     */
    Name?: String;
  }
  export type ResourcePropertyList = ResourceProperty[];
  export type ResourceTypeList = SupportedResourceType[];
  export interface SearchFilter {
    /**
     * The string that contains the search keywords, prefixes, and operators to control the results that can be returned by a Search operation. For more details, see Search query syntax.
     */
    FilterString: SearchFilterFilterStringString;
  }
  export type SearchFilterFilterStringString = string;
  export interface SearchInput {
    /**
     * The maximum number of results that you want included on each page of the response. If you do not include this parameter, it defaults to a value appropriate to the operation. If additional items exist beyond those included in the current response, the NextToken response element is present and has a value (is not null). Include that value as the NextToken request parameter in the next call to the operation to get the next part of the results.  An API operation can return fewer results than the maximum even when there are more results available. You should check NextToken after every operation to ensure that you receive all of the results. 
     */
    MaxResults?: SearchInputMaxResultsInteger;
    /**
     * The parameter for receiving additional results if you receive a NextToken response in a previous request. A NextToken response indicates that more output is available. Set this parameter to the value of the previous call's NextToken response to indicate where the output should continue from.
     */
    NextToken?: SearchInputNextTokenString;
    /**
     * A string that includes keywords and filters that specify the resources that you want to include in the results. For the complete syntax supported by the QueryString parameter, see Search query syntax reference for Resource Explorer. The search is completely case insensitive. You can specify an empty string to return all results up to the limit of 1,000 total results.  The operation can return only the first 1,000 results. If the resource you want is not included, then use a different value for QueryString to refine the results. 
     */
    QueryString: QueryString;
    /**
     * Specifies the Amazon resource name (ARN) of the view to use for the query. If you don't specify a value for this parameter, then the operation automatically uses the default view for the Amazon Web Services Region in which you called this operation. If the Region either doesn't have a default view or if you don't have permission to use the default view, then the operation fails with a 401 Unauthorized exception.
     */
    ViewArn?: SearchInputViewArnString;
  }
  export type SearchInputMaxResultsInteger = number;
  export type SearchInputNextTokenString = string;
  export type SearchInputViewArnString = string;
  export interface SearchOutput {
    /**
     * The number of resources that match the query.
     */
    Count?: ResourceCount;
    /**
     * If present, indicates that more output is available than is included in the current response. Use this value in the NextToken request parameter in a subsequent call to the operation to get the next part of the output. You should repeat this until the NextToken response element comes back as null.
     */
    NextToken?: SearchOutputNextTokenString;
    /**
     * The list of structures that describe the resources that match the query.
     */
    Resources?: ResourceList;
    /**
     * The Amazon resource name (ARN) of the view that this operation used to perform the search.
     */
    ViewArn?: SearchOutputViewArnString;
  }
  export type SearchOutputNextTokenString = string;
  export type SearchOutputViewArnString = string;
  export type String = string;
  export type StringList = String[];
  export interface SupportedResourceType {
    /**
     * The unique identifier of the resource type.
     */
    ResourceType?: String;
    /**
     * The Amazon Web Service that is associated with the resource type. This is the primary service that lets you create and interact with resources of this type.
     */
    Service?: String;
  }
  export type SyntheticTimestamp_date_time = Date;
  export type TagMap = {[key: string]: String};
  export interface TagResourceInput {
    /**
     * A list of tag key and value pairs that you want to attach to the specified view or index.
     */
    Tags?: TagMap;
    /**
     * The Amazon Resource Name (ARN) of the view or index that you want to attach tags to.
     */
    resourceArn: String;
  }
  export interface TagResourceOutput {
  }
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the view or index that you want to remove tags from.
     */
    resourceArn: String;
    /**
     * A list of the keys for the tags that you want to remove from the specified view or index.
     */
    tagKeys: StringList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateIndexTypeInput {
    /**
     * The Amazon resource name (ARN) of the index that you want to update.
     */
    Arn: String;
    /**
     * The type of the index. To understand the difference between LOCAL and AGGREGATOR, see Turning on cross-Region search in the Amazon Web Services Resource Explorer User Guide.
     */
    Type: IndexType;
  }
  export interface UpdateIndexTypeOutput {
    /**
     * The Amazon resource name (ARN) of the index that you updated.
     */
    Arn?: String;
    /**
     * The date and timestamp when the index was last updated.
     */
    LastUpdatedAt?: SyntheticTimestamp_date_time;
    /**
     * Indicates the state of the request to update the index. This operation is asynchronous. Call the GetIndex operation to check for changes.
     */
    State?: IndexState;
    /**
     * Specifies the type of the specified index after the operation completes.
     */
    Type?: IndexType;
  }
  export interface UpdateViewInput {
    /**
     * An array of strings that specify which resources are included in the results of queries made using this view. When you use this view in a Search operation, the filter string is combined with the search's QueryString parameter using a logical AND operator. For information about the supported syntax, see Search query reference for Resource Explorer in the Amazon Web Services Resource Explorer User Guide.  This query string in the context of this operation supports only filter prefixes with optional operators. It doesn't support free-form text. For example, the string region:us* service:ec2 -tag:stage=prod includes all Amazon EC2 resources in any Amazon Web Services Region that begins with the letters us and is not tagged with a key Stage that has the value prod. 
     */
    Filters?: SearchFilter;
    /**
     * Specifies optional fields that you want included in search results from this view. It is a list of objects that each describe a field to include. The default is an empty list, with no optional fields included in the results.
     */
    IncludedProperties?: IncludedPropertyList;
    /**
     * The Amazon resource name (ARN) of the view that you want to modify.
     */
    ViewArn: UpdateViewInputViewArnString;
  }
  export type UpdateViewInputViewArnString = string;
  export interface UpdateViewOutput {
    /**
     * Details about the view that you changed with this operation.
     */
    View?: View;
  }
  export interface View {
    /**
     * An array of SearchFilter objects that specify which resources can be included in the results of queries made using this view.
     */
    Filters?: SearchFilter;
    /**
     * A structure that contains additional information about the view.
     */
    IncludedProperties?: IncludedPropertyList;
    /**
     * The date and time when this view was last modified.
     */
    LastUpdatedAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon Web Services account that owns this view.
     */
    Owner?: String;
    /**
     * An Amazon resource name (ARN) of an Amazon Web Services account, an organization, or an organizational unit (OU) that specifies whether this view includes resources from only the specified Amazon Web Services account, all accounts in the specified organization, or all accounts in the specified OU. If not specified, the value defaults to the Amazon Web Services account used to call this operation.
     */
    Scope?: String;
    /**
     * The Amazon resource name (ARN) of the view.
     */
    ViewArn?: String;
  }
  export type ViewArnList = String[];
  export type ViewList = View[];
  export type ViewName = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-07-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ResourceExplorer2 client.
   */
  export import Types = ResourceExplorer2;
}
export = ResourceExplorer2;
