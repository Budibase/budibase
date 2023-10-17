import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class KendraRanking extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: KendraRanking.Types.ClientConfiguration)
  config: Config & KendraRanking.Types.ClientConfiguration;
  /**
   * Creates a rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API. You set the number of capacity units that you require for Amazon Kendra Intelligent Ranking to rescore or re-rank a search service's results. For an example of using the CreateRescoreExecutionPlan API, including using the Python and Java SDKs, see Semantically ranking a search service's results.
   */
  createRescoreExecutionPlan(params: KendraRanking.Types.CreateRescoreExecutionPlanRequest, callback?: (err: AWSError, data: KendraRanking.Types.CreateRescoreExecutionPlanResponse) => void): Request<KendraRanking.Types.CreateRescoreExecutionPlanResponse, AWSError>;
  /**
   * Creates a rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API. You set the number of capacity units that you require for Amazon Kendra Intelligent Ranking to rescore or re-rank a search service's results. For an example of using the CreateRescoreExecutionPlan API, including using the Python and Java SDKs, see Semantically ranking a search service's results.
   */
  createRescoreExecutionPlan(callback?: (err: AWSError, data: KendraRanking.Types.CreateRescoreExecutionPlanResponse) => void): Request<KendraRanking.Types.CreateRescoreExecutionPlanResponse, AWSError>;
  /**
   * Deletes a rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API.
   */
  deleteRescoreExecutionPlan(params: KendraRanking.Types.DeleteRescoreExecutionPlanRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API.
   */
  deleteRescoreExecutionPlan(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets information about a rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API.
   */
  describeRescoreExecutionPlan(params: KendraRanking.Types.DescribeRescoreExecutionPlanRequest, callback?: (err: AWSError, data: KendraRanking.Types.DescribeRescoreExecutionPlanResponse) => void): Request<KendraRanking.Types.DescribeRescoreExecutionPlanResponse, AWSError>;
  /**
   * Gets information about a rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API.
   */
  describeRescoreExecutionPlan(callback?: (err: AWSError, data: KendraRanking.Types.DescribeRescoreExecutionPlanResponse) => void): Request<KendraRanking.Types.DescribeRescoreExecutionPlanResponse, AWSError>;
  /**
   * Lists your rescore execution plans. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API.
   */
  listRescoreExecutionPlans(params: KendraRanking.Types.ListRescoreExecutionPlansRequest, callback?: (err: AWSError, data: KendraRanking.Types.ListRescoreExecutionPlansResponse) => void): Request<KendraRanking.Types.ListRescoreExecutionPlansResponse, AWSError>;
  /**
   * Lists your rescore execution plans. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API.
   */
  listRescoreExecutionPlans(callback?: (err: AWSError, data: KendraRanking.Types.ListRescoreExecutionPlansResponse) => void): Request<KendraRanking.Types.ListRescoreExecutionPlansResponse, AWSError>;
  /**
   * Gets a list of tags associated with a specified resource. A rescore execution plan is an example of a resource that can have tags associated with it.
   */
  listTagsForResource(params: KendraRanking.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: KendraRanking.Types.ListTagsForResourceResponse) => void): Request<KendraRanking.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Gets a list of tags associated with a specified resource. A rescore execution plan is an example of a resource that can have tags associated with it.
   */
  listTagsForResource(callback?: (err: AWSError, data: KendraRanking.Types.ListTagsForResourceResponse) => void): Request<KendraRanking.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Rescores or re-ranks search results from a search service such as OpenSearch (self managed). You use the semantic search capabilities of Amazon Kendra Intelligent Ranking to improve the search service's results.
   */
  rescore(params: KendraRanking.Types.RescoreRequest, callback?: (err: AWSError, data: KendraRanking.Types.RescoreResult) => void): Request<KendraRanking.Types.RescoreResult, AWSError>;
  /**
   * Rescores or re-ranks search results from a search service such as OpenSearch (self managed). You use the semantic search capabilities of Amazon Kendra Intelligent Ranking to improve the search service's results.
   */
  rescore(callback?: (err: AWSError, data: KendraRanking.Types.RescoreResult) => void): Request<KendraRanking.Types.RescoreResult, AWSError>;
  /**
   * Adds a specified tag to a specified rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API. If the tag already exists, the existing value is replaced with the new value.
   */
  tagResource(params: KendraRanking.Types.TagResourceRequest, callback?: (err: AWSError, data: KendraRanking.Types.TagResourceResponse) => void): Request<KendraRanking.Types.TagResourceResponse, AWSError>;
  /**
   * Adds a specified tag to a specified rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API. If the tag already exists, the existing value is replaced with the new value.
   */
  tagResource(callback?: (err: AWSError, data: KendraRanking.Types.TagResourceResponse) => void): Request<KendraRanking.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a tag from a rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore operation.
   */
  untagResource(params: KendraRanking.Types.UntagResourceRequest, callback?: (err: AWSError, data: KendraRanking.Types.UntagResourceResponse) => void): Request<KendraRanking.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a tag from a rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore operation.
   */
  untagResource(callback?: (err: AWSError, data: KendraRanking.Types.UntagResourceResponse) => void): Request<KendraRanking.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API. You can update the number of capacity units you require for Amazon Kendra Intelligent Ranking to rescore or re-rank a search service's results.
   */
  updateRescoreExecutionPlan(params: KendraRanking.Types.UpdateRescoreExecutionPlanRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API. You can update the number of capacity units you require for Amazon Kendra Intelligent Ranking to rescore or re-rank a search service's results.
   */
  updateRescoreExecutionPlan(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace KendraRanking {
  export type AmazonResourceName = string;
  export type BodyTokensList = Tokens[];
  export interface CapacityUnitsConfiguration {
    /**
     * The amount of extra capacity for your rescore execution plan. A single extra capacity unit for a rescore execution plan provides 0.01 rescore requests per second. You can add up to 1000 extra capacity units.
     */
    RescoreCapacityUnits: RescoreCapacityUnit;
  }
  export type ClientTokenName = string;
  export interface CreateRescoreExecutionPlanRequest {
    /**
     * A name for the rescore execution plan.
     */
    Name: RescoreExecutionPlanName;
    /**
     * A description for the rescore execution plan.
     */
    Description?: Description;
    /**
     * You can set additional capacity units to meet the needs of your rescore execution plan. You are given a single capacity unit by default. If you want to use the default capacity, you don't set additional capacity units. For more information on the default capacity and additional capacity units, see Adjusting capacity.
     */
    CapacityUnits?: CapacityUnitsConfiguration;
    /**
     * A list of key-value pairs that identify or categorize your rescore execution plan. You can also use tags to help control access to the rescore execution plan. Tag keys and values can consist of Unicode letters, digits, white space, and any of the following symbols: _ . : / = + - @.
     */
    Tags?: TagList;
    /**
     * A token that you provide to identify the request to create a rescore execution plan. Multiple calls to the CreateRescoreExecutionPlanRequest API with the same client token will create only one rescore execution plan.
     */
    ClientToken?: ClientTokenName;
  }
  export interface CreateRescoreExecutionPlanResponse {
    /**
     * The identifier of the rescore execution plan.
     */
    Id: RescoreExecutionPlanId;
    /**
     * The Amazon Resource Name (ARN) of the rescore execution plan.
     */
    Arn: RescoreExecutionPlanArn;
  }
  export interface DeleteRescoreExecutionPlanRequest {
    /**
     * The identifier of the rescore execution plan that you want to delete.
     */
    Id: RescoreExecutionPlanId;
  }
  export interface DescribeRescoreExecutionPlanRequest {
    /**
     * The identifier of the rescore execution plan that you want to get information on.
     */
    Id: RescoreExecutionPlanId;
  }
  export interface DescribeRescoreExecutionPlanResponse {
    /**
     * The identifier of the rescore execution plan.
     */
    Id?: RescoreExecutionPlanId;
    /**
     * The Amazon Resource Name (ARN) of the rescore execution plan.
     */
    Arn?: RescoreExecutionPlanArn;
    /**
     * The name for the rescore execution plan.
     */
    Name?: RescoreExecutionPlanName;
    /**
     * The description for the rescore execution plan.
     */
    Description?: Description;
    /**
     * The capacity units set for the rescore execution plan. A capacity of zero indicates that the rescore execution plan is using the default capacity. For more information on the default capacity and additional capacity units, see Adjusting capacity.
     */
    CapacityUnits?: CapacityUnitsConfiguration;
    /**
     * The Unix timestamp of when the rescore execution plan was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The Unix timestamp of when the rescore execution plan was last updated.
     */
    UpdatedAt?: Timestamp;
    /**
     * The current status of the rescore execution plan. When the value is ACTIVE, the rescore execution plan is ready for use. If the Status field value is FAILED, the ErrorMessage field contains a message that explains why.
     */
    Status?: RescoreExecutionPlanStatus;
    /**
     * When the Status field value is FAILED, the ErrorMessage field contains a message that explains why.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type Description = string;
  export interface Document {
    /**
     * The identifier of the document from the search service.
     */
    Id: DocumentId;
    /**
     * The optional group identifier of the document from the search service. Documents with the same group identifier are grouped together and processed as one document within the service.
     */
    GroupId?: GroupId;
    /**
     * The title of the search service's document.
     */
    Title?: DocumentTitle;
    /**
     * The body text of the search service's document.
     */
    Body?: DocumentBody;
    /**
     * The title of the search service's document represented as a list of tokens or words. You must choose to provide Title or TokenizedTitle. You cannot provide both.
     */
    TokenizedTitle?: TitleTokensList;
    /**
     * The body text of the search service's document represented as a list of tokens or words. You must choose to provide Body or TokenizedBody. You cannot provide both.
     */
    TokenizedBody?: BodyTokensList;
    /**
     * The original document score or rank from the search service. Amazon Kendra Intelligent Ranking gives the document a new score or rank based on its intelligent search algorithms.
     */
    OriginalScore: Float;
  }
  export type DocumentBody = string;
  export type DocumentId = string;
  export type DocumentList = Document[];
  export type DocumentTitle = string;
  export type ErrorMessage = string;
  export type Float = number;
  export type GroupId = string;
  export interface ListRescoreExecutionPlansRequest {
    /**
     * If the response is truncated, Amazon Kendra Intelligent Ranking returns a pagination token in the response. You can use this pagination token to retrieve the next set of rescore execution plans.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of rescore execution plans to return.
     */
    MaxResults?: MaxResultsIntegerForListRescoreExecutionPlansRequest;
  }
  export interface ListRescoreExecutionPlansResponse {
    /**
     * An array of summary information for one or more rescore execution plans.
     */
    SummaryItems?: RescoreExecutionPlanSummaryList;
    /**
     * If the response is truncated, Amazon Kendra Intelligent Ranking returns a pagination token in the response.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the rescore execution plan to get a list of tags for.
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of tags associated with the rescore execution plan.
     */
    Tags?: TagList;
  }
  export type MaxResultsIntegerForListRescoreExecutionPlansRequest = number;
  export type NextToken = string;
  export type RescoreCapacityUnit = number;
  export type RescoreExecutionPlanArn = string;
  export type RescoreExecutionPlanId = string;
  export type RescoreExecutionPlanName = string;
  export type RescoreExecutionPlanStatus = "CREATING"|"UPDATING"|"ACTIVE"|"DELETING"|"FAILED"|string;
  export interface RescoreExecutionPlanSummary {
    /**
     * The name of the rescore execution plan.
     */
    Name?: RescoreExecutionPlanName;
    /**
     * The identifier of the rescore execution plan.
     */
    Id?: RescoreExecutionPlanId;
    /**
     * The Unix timestamp when the rescore execution plan was created.
     */
    CreatedAt?: Timestamp;
    /**
     * The Unix timestamp when the rescore execution plan was last updated.
     */
    UpdatedAt?: Timestamp;
    /**
     * The current status of the rescore execution plan. When the value is ACTIVE, the rescore execution plan is ready for use.
     */
    Status?: RescoreExecutionPlanStatus;
  }
  export type RescoreExecutionPlanSummaryList = RescoreExecutionPlanSummary[];
  export type RescoreId = string;
  export interface RescoreRequest {
    /**
     * The identifier of the rescore execution plan. A rescore execution plan is an Amazon Kendra Intelligent Ranking resource used for provisioning the Rescore API.
     */
    RescoreExecutionPlanId: RescoreExecutionPlanId;
    /**
     * The input query from the search service.
     */
    SearchQuery: SearchQuery;
    /**
     * The list of documents for Amazon Kendra Intelligent Ranking to rescore or rank on.
     */
    Documents: DocumentList;
  }
  export interface RescoreResult {
    /**
     * The identifier associated with the scores that Amazon Kendra Intelligent Ranking gives to the results. Amazon Kendra Intelligent Ranking rescores or re-ranks the results for the search service.
     */
    RescoreId?: RescoreId;
    /**
     * A list of result items for documents with new relevancy scores. The results are in descending order.
     */
    ResultItems?: RescoreResultItemList;
  }
  export interface RescoreResultItem {
    /**
     * The identifier of the document from the search service.
     */
    DocumentId?: DocumentId;
    /**
     * The relevancy score or rank that Amazon Kendra Intelligent Ranking gives to the result.
     */
    Score?: Float;
  }
  export type RescoreResultItemList = RescoreResultItem[];
  export type SearchQuery = string;
  export interface Tag {
    /**
     * The key for the tag. Keys are not case sensitive and must be unique.
     */
    Key: TagKey;
    /**
     * The value associated with the tag. The value can be an empty string but it can't be null.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the rescore execution plan to tag.
     */
    ResourceARN: AmazonResourceName;
    /**
     * A list of tag keys to add to a rescore execution plan. If a tag already exists, the existing value is replaced with the new value.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type TitleTokensList = Tokens[];
  export type Tokens = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the rescore execution plan to remove the tag.
     */
    ResourceARN: AmazonResourceName;
    /**
     * A list of tag keys to remove from the rescore execution plan. If a tag key does not exist on the resource, it is ignored.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateRescoreExecutionPlanRequest {
    /**
     * The identifier of the rescore execution plan that you want to update.
     */
    Id: RescoreExecutionPlanId;
    /**
     * A new name for the rescore execution plan.
     */
    Name?: RescoreExecutionPlanName;
    /**
     * A new description for the rescore execution plan.
     */
    Description?: Description;
    /**
     * You can set additional capacity units to meet the needs of your rescore execution plan. You are given a single capacity unit by default. If you want to use the default capacity, you don't set additional capacity units. For more information on the default capacity and additional capacity units, see Adjusting capacity.
     */
    CapacityUnits?: CapacityUnitsConfiguration;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-10-19"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the KendraRanking client.
   */
  export import Types = KendraRanking;
}
export = KendraRanking;
