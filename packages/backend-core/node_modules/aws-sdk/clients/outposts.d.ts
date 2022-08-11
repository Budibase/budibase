import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Outposts extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Outposts.Types.ClientConfiguration)
  config: Config & Outposts.Types.ClientConfiguration;
  /**
   * Creates an order for an Outpost.
   */
  createOrder(params: Outposts.Types.CreateOrderInput, callback?: (err: AWSError, data: Outposts.Types.CreateOrderOutput) => void): Request<Outposts.Types.CreateOrderOutput, AWSError>;
  /**
   * Creates an order for an Outpost.
   */
  createOrder(callback?: (err: AWSError, data: Outposts.Types.CreateOrderOutput) => void): Request<Outposts.Types.CreateOrderOutput, AWSError>;
  /**
   * Creates an Outpost. You can specify AvailabilityZone or AvailabilityZoneId.
   */
  createOutpost(params: Outposts.Types.CreateOutpostInput, callback?: (err: AWSError, data: Outposts.Types.CreateOutpostOutput) => void): Request<Outposts.Types.CreateOutpostOutput, AWSError>;
  /**
   * Creates an Outpost. You can specify AvailabilityZone or AvailabilityZoneId.
   */
  createOutpost(callback?: (err: AWSError, data: Outposts.Types.CreateOutpostOutput) => void): Request<Outposts.Types.CreateOutpostOutput, AWSError>;
  /**
   * Deletes the Outpost.
   */
  deleteOutpost(params: Outposts.Types.DeleteOutpostInput, callback?: (err: AWSError, data: Outposts.Types.DeleteOutpostOutput) => void): Request<Outposts.Types.DeleteOutpostOutput, AWSError>;
  /**
   * Deletes the Outpost.
   */
  deleteOutpost(callback?: (err: AWSError, data: Outposts.Types.DeleteOutpostOutput) => void): Request<Outposts.Types.DeleteOutpostOutput, AWSError>;
  /**
   * Deletes the site.
   */
  deleteSite(params: Outposts.Types.DeleteSiteInput, callback?: (err: AWSError, data: Outposts.Types.DeleteSiteOutput) => void): Request<Outposts.Types.DeleteSiteOutput, AWSError>;
  /**
   * Deletes the site.
   */
  deleteSite(callback?: (err: AWSError, data: Outposts.Types.DeleteSiteOutput) => void): Request<Outposts.Types.DeleteSiteOutput, AWSError>;
  /**
   * Gets information about the specified Outpost.
   */
  getOutpost(params: Outposts.Types.GetOutpostInput, callback?: (err: AWSError, data: Outposts.Types.GetOutpostOutput) => void): Request<Outposts.Types.GetOutpostOutput, AWSError>;
  /**
   * Gets information about the specified Outpost.
   */
  getOutpost(callback?: (err: AWSError, data: Outposts.Types.GetOutpostOutput) => void): Request<Outposts.Types.GetOutpostOutput, AWSError>;
  /**
   * Lists the instance types for the specified Outpost.
   */
  getOutpostInstanceTypes(params: Outposts.Types.GetOutpostInstanceTypesInput, callback?: (err: AWSError, data: Outposts.Types.GetOutpostInstanceTypesOutput) => void): Request<Outposts.Types.GetOutpostInstanceTypesOutput, AWSError>;
  /**
   * Lists the instance types for the specified Outpost.
   */
  getOutpostInstanceTypes(callback?: (err: AWSError, data: Outposts.Types.GetOutpostInstanceTypesOutput) => void): Request<Outposts.Types.GetOutpostInstanceTypesOutput, AWSError>;
  /**
   * Create a list of the Outposts for your AWS account. Add filters to your request to return a more specific list of results. Use filters to match an Outpost lifecycle status, Availibility Zone (us-east-1a), and AZ ID (use1-az1).  If you specify multiple filters, the filters are joined with an AND, and the request returns only results that match all of the specified filters.
   */
  listOutposts(params: Outposts.Types.ListOutpostsInput, callback?: (err: AWSError, data: Outposts.Types.ListOutpostsOutput) => void): Request<Outposts.Types.ListOutpostsOutput, AWSError>;
  /**
   * Create a list of the Outposts for your AWS account. Add filters to your request to return a more specific list of results. Use filters to match an Outpost lifecycle status, Availibility Zone (us-east-1a), and AZ ID (use1-az1).  If you specify multiple filters, the filters are joined with an AND, and the request returns only results that match all of the specified filters.
   */
  listOutposts(callback?: (err: AWSError, data: Outposts.Types.ListOutpostsOutput) => void): Request<Outposts.Types.ListOutpostsOutput, AWSError>;
  /**
   * Lists the sites for the specified AWS account.
   */
  listSites(params: Outposts.Types.ListSitesInput, callback?: (err: AWSError, data: Outposts.Types.ListSitesOutput) => void): Request<Outposts.Types.ListSitesOutput, AWSError>;
  /**
   * Lists the sites for the specified AWS account.
   */
  listSites(callback?: (err: AWSError, data: Outposts.Types.ListSitesOutput) => void): Request<Outposts.Types.ListSitesOutput, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(params: Outposts.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Outposts.Types.ListTagsForResourceResponse) => void): Request<Outposts.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Outposts.Types.ListTagsForResourceResponse) => void): Request<Outposts.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds tags to the specified resource.
   */
  tagResource(params: Outposts.Types.TagResourceRequest, callback?: (err: AWSError, data: Outposts.Types.TagResourceResponse) => void): Request<Outposts.Types.TagResourceResponse, AWSError>;
  /**
   * Adds tags to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: Outposts.Types.TagResourceResponse) => void): Request<Outposts.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from the specified resource.
   */
  untagResource(params: Outposts.Types.UntagResourceRequest, callback?: (err: AWSError, data: Outposts.Types.UntagResourceResponse) => void): Request<Outposts.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: Outposts.Types.UntagResourceResponse) => void): Request<Outposts.Types.UntagResourceResponse, AWSError>;
}
declare namespace Outposts {
  export type AccountId = string;
  export type Arn = string;
  export type AvailabilityZone = string;
  export type AvailabilityZoneId = string;
  export type AvailabilityZoneIdList = AvailabilityZoneId[];
  export type AvailabilityZoneList = AvailabilityZone[];
  export interface CreateOrderInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the Outpost. 
     */
    OutpostIdentifier: OutpostIdentifier;
    /**
     * The line items that make up the order.
     */
    LineItems: LineItemRequestListDefinition;
    /**
     * The payment option for the order.
     */
    PaymentOption: PaymentOption;
    /**
     * The payment terms for the order.
     */
    PaymentTerm?: PaymentTerm;
  }
  export interface CreateOrderOutput {
    /**
     * Information about this order.
     */
    Order?: Order;
  }
  export interface CreateOutpostInput {
    Name: OutpostName;
    Description?: OutpostDescription;
    SiteId: SiteId;
    AvailabilityZone?: AvailabilityZone;
    AvailabilityZoneId?: AvailabilityZoneId;
    /**
     * The tags to apply to the Outpost.
     */
    Tags?: TagMap;
  }
  export interface CreateOutpostOutput {
    Outpost?: Outpost;
  }
  export interface DeleteOutpostInput {
    /**
     *  The ID of the Outpost. 
     */
    OutpostId: OutpostId;
  }
  export interface DeleteOutpostOutput {
  }
  export interface DeleteSiteInput {
    SiteId: SiteId;
  }
  export interface DeleteSiteOutput {
  }
  export interface GetOutpostInput {
    /**
     *  The ID of the Outpost. 
     */
    OutpostId: OutpostId;
  }
  export interface GetOutpostInstanceTypesInput {
    /**
     *  The ID of the Outpost. 
     */
    OutpostId: OutpostId;
    NextToken?: Token;
    MaxResults?: MaxResults1000;
  }
  export interface GetOutpostInstanceTypesOutput {
    InstanceTypes?: InstanceTypeListDefinition;
    NextToken?: Token;
    /**
     *  The ID of the Outpost. 
     */
    OutpostId?: OutpostId;
    OutpostArn?: OutpostArn;
  }
  export interface GetOutpostOutput {
    Outpost?: Outpost;
  }
  export type ISO8601Timestamp = Date;
  export type InstanceType = string;
  export interface InstanceTypeItem {
    InstanceType?: InstanceType;
  }
  export type InstanceTypeListDefinition = InstanceTypeItem[];
  export type LifeCycleStatus = string;
  export type LifeCycleStatusList = LifeCycleStatus[];
  export interface LineItem {
    /**
     *  The ID of the catalog item. 
     */
    CatalogItemId?: SkuCode;
    /**
     * The ID of the line item.
     */
    LineItemId?: LineItemId;
    /**
     * The quantity of the line item.
     */
    Quantity?: LineItemQuantity;
    /**
     * The status of the line item.
     */
    Status?: Status;
  }
  export type LineItemId = string;
  export type LineItemListDefinition = LineItem[];
  export type LineItemQuantity = number;
  export interface LineItemRequest {
    /**
     * The ID of the catalog item.
     */
    CatalogItemId?: SkuCode;
    /**
     * The quantity of a line item request.
     */
    Quantity?: LineItemQuantity;
  }
  export type LineItemRequestListDefinition = LineItemRequest[];
  export interface ListOutpostsInput {
    NextToken?: Token;
    MaxResults?: MaxResults1000;
    /**
     *  A filter for the lifecycle status of the Outpost.   Filter values are case sensitive. If you specify multiple values for a filter, the values are joined with an OR, and the request returns all results that match any of the specified values. 
     */
    LifeCycleStatusFilter?: LifeCycleStatusList;
    /**
     *  A filter for the Availibility Zone (us-east-1a) of the Outpost.   Filter values are case sensitive. If you specify multiple values for a filter, the values are joined with an OR, and the request returns all results that match any of the specified values. 
     */
    AvailabilityZoneFilter?: AvailabilityZoneList;
    /**
     *  A filter for the AZ IDs (use1-az1) of the Outpost.   Filter values are case sensitive. If you specify multiple values for a filter, the values are joined with an OR, and the request returns all results that match any of the specified values. 
     */
    AvailabilityZoneIdFilter?: AvailabilityZoneIdList;
  }
  export interface ListOutpostsOutput {
    Outposts?: outpostListDefinition;
    NextToken?: Token;
  }
  export interface ListSitesInput {
    NextToken?: Token;
    MaxResults?: MaxResults1000;
  }
  export interface ListSitesOutput {
    Sites?: siteListDefinition;
    NextToken?: Token;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The resource tags.
     */
    Tags?: TagMap;
  }
  export type MaxResults1000 = number;
  export interface Order {
    /**
     *  The ID of the Outpost. 
     */
    OutpostId?: OutpostIdOnly;
    /**
     * The ID of the order.
     */
    OrderId?: OrderId;
    /**
     * The status of the order
     */
    Status?: OrderStatus;
    /**
     * The line items for the order
     */
    LineItems?: LineItemListDefinition;
    /**
     * The payment option for the order.
     */
    PaymentOption?: PaymentOption;
    /**
     * The submission date for the order.
     */
    OrderSubmissionDate?: ISO8601Timestamp;
    /**
     * The fulfillment date of the order.
     */
    OrderFulfilledDate?: ISO8601Timestamp;
  }
  export type OrderId = string;
  export type OrderStatus = "RECEIVED"|"PENDING"|"PROCESSING"|"INSTALLING"|"FULFILLED"|"CANCELLED"|string;
  export interface Outpost {
    /**
     *  The ID of the Outpost. 
     */
    OutpostId?: OutpostId;
    OwnerId?: OwnerId;
    OutpostArn?: OutpostArn;
    SiteId?: SiteId;
    Name?: OutpostName;
    Description?: OutpostDescription;
    LifeCycleStatus?: LifeCycleStatus;
    AvailabilityZone?: AvailabilityZone;
    AvailabilityZoneId?: AvailabilityZoneId;
    /**
     * The Outpost tags.
     */
    Tags?: TagMap;
    SiteArn?: SiteArn;
  }
  export type OutpostArn = string;
  export type OutpostDescription = string;
  export type OutpostId = string;
  export type OutpostIdOnly = string;
  export type OutpostIdentifier = string;
  export type OutpostName = string;
  export type OwnerId = string;
  export type PaymentOption = "ALL_UPFRONT"|"NO_UPFRONT"|"PARTIAL_UPFRONT"|string;
  export type PaymentTerm = "THREE_YEARS"|string;
  export interface Site {
    SiteId?: SiteId;
    AccountId?: AccountId;
    Name?: SiteName;
    Description?: SiteDescription;
    /**
     * The site tags.
     */
    Tags?: TagMap;
    SiteArn?: SiteArn;
  }
  export type SiteArn = string;
  export type SiteDescription = string;
  export type SiteId = string;
  export type SiteName = string;
  export type SkuCode = string;
  export type Status = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: Arn;
    /**
     * The tags to add to the resource.
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Token = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: Arn;
    /**
     * The tag keys.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export type outpostListDefinition = Outpost[];
  export type siteListDefinition = Site[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-12-03"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Outposts client.
   */
  export import Types = Outposts;
}
export = Outposts;
