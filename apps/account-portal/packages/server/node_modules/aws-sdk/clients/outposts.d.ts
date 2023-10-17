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
   * Cancels the specified order for an Outpost.
   */
  cancelOrder(params: Outposts.Types.CancelOrderInput, callback?: (err: AWSError, data: Outposts.Types.CancelOrderOutput) => void): Request<Outposts.Types.CancelOrderOutput, AWSError>;
  /**
   * Cancels the specified order for an Outpost.
   */
  cancelOrder(callback?: (err: AWSError, data: Outposts.Types.CancelOrderOutput) => void): Request<Outposts.Types.CancelOrderOutput, AWSError>;
  /**
   * Creates an order for an Outpost.
   */
  createOrder(params: Outposts.Types.CreateOrderInput, callback?: (err: AWSError, data: Outposts.Types.CreateOrderOutput) => void): Request<Outposts.Types.CreateOrderOutput, AWSError>;
  /**
   * Creates an order for an Outpost.
   */
  createOrder(callback?: (err: AWSError, data: Outposts.Types.CreateOrderOutput) => void): Request<Outposts.Types.CreateOrderOutput, AWSError>;
  /**
   * Creates an Outpost. You can specify either an Availability one or an AZ ID.
   */
  createOutpost(params: Outposts.Types.CreateOutpostInput, callback?: (err: AWSError, data: Outposts.Types.CreateOutpostOutput) => void): Request<Outposts.Types.CreateOutpostOutput, AWSError>;
  /**
   * Creates an Outpost. You can specify either an Availability one or an AZ ID.
   */
  createOutpost(callback?: (err: AWSError, data: Outposts.Types.CreateOutpostOutput) => void): Request<Outposts.Types.CreateOutpostOutput, AWSError>;
  /**
   *  Creates a site for an Outpost. 
   */
  createSite(params: Outposts.Types.CreateSiteInput, callback?: (err: AWSError, data: Outposts.Types.CreateSiteOutput) => void): Request<Outposts.Types.CreateSiteOutput, AWSError>;
  /**
   *  Creates a site for an Outpost. 
   */
  createSite(callback?: (err: AWSError, data: Outposts.Types.CreateSiteOutput) => void): Request<Outposts.Types.CreateSiteOutput, AWSError>;
  /**
   * Deletes the specified Outpost.
   */
  deleteOutpost(params: Outposts.Types.DeleteOutpostInput, callback?: (err: AWSError, data: Outposts.Types.DeleteOutpostOutput) => void): Request<Outposts.Types.DeleteOutpostOutput, AWSError>;
  /**
   * Deletes the specified Outpost.
   */
  deleteOutpost(callback?: (err: AWSError, data: Outposts.Types.DeleteOutpostOutput) => void): Request<Outposts.Types.DeleteOutpostOutput, AWSError>;
  /**
   * Deletes the specified site.
   */
  deleteSite(params: Outposts.Types.DeleteSiteInput, callback?: (err: AWSError, data: Outposts.Types.DeleteSiteOutput) => void): Request<Outposts.Types.DeleteSiteOutput, AWSError>;
  /**
   * Deletes the specified site.
   */
  deleteSite(callback?: (err: AWSError, data: Outposts.Types.DeleteSiteOutput) => void): Request<Outposts.Types.DeleteSiteOutput, AWSError>;
  /**
   * Gets information about the specified catalog item.
   */
  getCatalogItem(params: Outposts.Types.GetCatalogItemInput, callback?: (err: AWSError, data: Outposts.Types.GetCatalogItemOutput) => void): Request<Outposts.Types.GetCatalogItemOutput, AWSError>;
  /**
   * Gets information about the specified catalog item.
   */
  getCatalogItem(callback?: (err: AWSError, data: Outposts.Types.GetCatalogItemOutput) => void): Request<Outposts.Types.GetCatalogItemOutput, AWSError>;
  /**
   *   Amazon Web Services uses this action to install Outpost servers.   Gets information about the specified connection.   Use CloudTrail to monitor this action or Amazon Web Services managed policy for Amazon Web Services Outposts to secure it. For more information, see  Amazon Web Services managed policies for Amazon Web Services Outposts and  Logging Amazon Web Services Outposts API calls with Amazon Web Services CloudTrail in the Amazon Web Services Outposts User Guide. 
   */
  getConnection(params: Outposts.Types.GetConnectionRequest, callback?: (err: AWSError, data: Outposts.Types.GetConnectionResponse) => void): Request<Outposts.Types.GetConnectionResponse, AWSError>;
  /**
   *   Amazon Web Services uses this action to install Outpost servers.   Gets information about the specified connection.   Use CloudTrail to monitor this action or Amazon Web Services managed policy for Amazon Web Services Outposts to secure it. For more information, see  Amazon Web Services managed policies for Amazon Web Services Outposts and  Logging Amazon Web Services Outposts API calls with Amazon Web Services CloudTrail in the Amazon Web Services Outposts User Guide. 
   */
  getConnection(callback?: (err: AWSError, data: Outposts.Types.GetConnectionResponse) => void): Request<Outposts.Types.GetConnectionResponse, AWSError>;
  /**
   * Gets information about the specified order.
   */
  getOrder(params: Outposts.Types.GetOrderInput, callback?: (err: AWSError, data: Outposts.Types.GetOrderOutput) => void): Request<Outposts.Types.GetOrderOutput, AWSError>;
  /**
   * Gets information about the specified order.
   */
  getOrder(callback?: (err: AWSError, data: Outposts.Types.GetOrderOutput) => void): Request<Outposts.Types.GetOrderOutput, AWSError>;
  /**
   * Gets information about the specified Outpost.
   */
  getOutpost(params: Outposts.Types.GetOutpostInput, callback?: (err: AWSError, data: Outposts.Types.GetOutpostOutput) => void): Request<Outposts.Types.GetOutpostOutput, AWSError>;
  /**
   * Gets information about the specified Outpost.
   */
  getOutpost(callback?: (err: AWSError, data: Outposts.Types.GetOutpostOutput) => void): Request<Outposts.Types.GetOutpostOutput, AWSError>;
  /**
   * Gets the instance types for the specified Outpost.
   */
  getOutpostInstanceTypes(params: Outposts.Types.GetOutpostInstanceTypesInput, callback?: (err: AWSError, data: Outposts.Types.GetOutpostInstanceTypesOutput) => void): Request<Outposts.Types.GetOutpostInstanceTypesOutput, AWSError>;
  /**
   * Gets the instance types for the specified Outpost.
   */
  getOutpostInstanceTypes(callback?: (err: AWSError, data: Outposts.Types.GetOutpostInstanceTypesOutput) => void): Request<Outposts.Types.GetOutpostInstanceTypesOutput, AWSError>;
  /**
   * Gets information about the specified Outpost site.
   */
  getSite(params: Outposts.Types.GetSiteInput, callback?: (err: AWSError, data: Outposts.Types.GetSiteOutput) => void): Request<Outposts.Types.GetSiteOutput, AWSError>;
  /**
   * Gets information about the specified Outpost site.
   */
  getSite(callback?: (err: AWSError, data: Outposts.Types.GetSiteOutput) => void): Request<Outposts.Types.GetSiteOutput, AWSError>;
  /**
   *  Gets the site address of the specified site. 
   */
  getSiteAddress(params: Outposts.Types.GetSiteAddressInput, callback?: (err: AWSError, data: Outposts.Types.GetSiteAddressOutput) => void): Request<Outposts.Types.GetSiteAddressOutput, AWSError>;
  /**
   *  Gets the site address of the specified site. 
   */
  getSiteAddress(callback?: (err: AWSError, data: Outposts.Types.GetSiteAddressOutput) => void): Request<Outposts.Types.GetSiteAddressOutput, AWSError>;
  /**
   * Lists the hardware assets for the specified Outpost. Use filters to return specific results. If you specify multiple filters, the results include only the resources that match all of the specified filters. For a filter where you can specify multiple values, the results include items that match any of the values that you specify for the filter.
   */
  listAssets(params: Outposts.Types.ListAssetsInput, callback?: (err: AWSError, data: Outposts.Types.ListAssetsOutput) => void): Request<Outposts.Types.ListAssetsOutput, AWSError>;
  /**
   * Lists the hardware assets for the specified Outpost. Use filters to return specific results. If you specify multiple filters, the results include only the resources that match all of the specified filters. For a filter where you can specify multiple values, the results include items that match any of the values that you specify for the filter.
   */
  listAssets(callback?: (err: AWSError, data: Outposts.Types.ListAssetsOutput) => void): Request<Outposts.Types.ListAssetsOutput, AWSError>;
  /**
   * Lists the items in the catalog. Use filters to return specific results. If you specify multiple filters, the results include only the resources that match all of the specified filters. For a filter where you can specify multiple values, the results include items that match any of the values that you specify for the filter.
   */
  listCatalogItems(params: Outposts.Types.ListCatalogItemsInput, callback?: (err: AWSError, data: Outposts.Types.ListCatalogItemsOutput) => void): Request<Outposts.Types.ListCatalogItemsOutput, AWSError>;
  /**
   * Lists the items in the catalog. Use filters to return specific results. If you specify multiple filters, the results include only the resources that match all of the specified filters. For a filter where you can specify multiple values, the results include items that match any of the values that you specify for the filter.
   */
  listCatalogItems(callback?: (err: AWSError, data: Outposts.Types.ListCatalogItemsOutput) => void): Request<Outposts.Types.ListCatalogItemsOutput, AWSError>;
  /**
   * Lists the Outpost orders for your Amazon Web Services account.
   */
  listOrders(params: Outposts.Types.ListOrdersInput, callback?: (err: AWSError, data: Outposts.Types.ListOrdersOutput) => void): Request<Outposts.Types.ListOrdersOutput, AWSError>;
  /**
   * Lists the Outpost orders for your Amazon Web Services account.
   */
  listOrders(callback?: (err: AWSError, data: Outposts.Types.ListOrdersOutput) => void): Request<Outposts.Types.ListOrdersOutput, AWSError>;
  /**
   * Lists the Outposts for your Amazon Web Services account. Use filters to return specific results. If you specify multiple filters, the results include only the resources that match all of the specified filters. For a filter where you can specify multiple values, the results include items that match any of the values that you specify for the filter.
   */
  listOutposts(params: Outposts.Types.ListOutpostsInput, callback?: (err: AWSError, data: Outposts.Types.ListOutpostsOutput) => void): Request<Outposts.Types.ListOutpostsOutput, AWSError>;
  /**
   * Lists the Outposts for your Amazon Web Services account. Use filters to return specific results. If you specify multiple filters, the results include only the resources that match all of the specified filters. For a filter where you can specify multiple values, the results include items that match any of the values that you specify for the filter.
   */
  listOutposts(callback?: (err: AWSError, data: Outposts.Types.ListOutpostsOutput) => void): Request<Outposts.Types.ListOutpostsOutput, AWSError>;
  /**
   * Lists the Outpost sites for your Amazon Web Services account. Use filters to return specific results. Use filters to return specific results. If you specify multiple filters, the results include only the resources that match all of the specified filters. For a filter where you can specify multiple values, the results include items that match any of the values that you specify for the filter.
   */
  listSites(params: Outposts.Types.ListSitesInput, callback?: (err: AWSError, data: Outposts.Types.ListSitesOutput) => void): Request<Outposts.Types.ListSitesOutput, AWSError>;
  /**
   * Lists the Outpost sites for your Amazon Web Services account. Use filters to return specific results. Use filters to return specific results. If you specify multiple filters, the results include only the resources that match all of the specified filters. For a filter where you can specify multiple values, the results include items that match any of the values that you specify for the filter.
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
   *   Amazon Web Services uses this action to install Outpost servers.   Starts the connection required for Outpost server installation.   Use CloudTrail to monitor this action or Amazon Web Services managed policy for Amazon Web Services Outposts to secure it. For more information, see  Amazon Web Services managed policies for Amazon Web Services Outposts and  Logging Amazon Web Services Outposts API calls with Amazon Web Services CloudTrail in the Amazon Web Services Outposts User Guide. 
   */
  startConnection(params: Outposts.Types.StartConnectionRequest, callback?: (err: AWSError, data: Outposts.Types.StartConnectionResponse) => void): Request<Outposts.Types.StartConnectionResponse, AWSError>;
  /**
   *   Amazon Web Services uses this action to install Outpost servers.   Starts the connection required for Outpost server installation.   Use CloudTrail to monitor this action or Amazon Web Services managed policy for Amazon Web Services Outposts to secure it. For more information, see  Amazon Web Services managed policies for Amazon Web Services Outposts and  Logging Amazon Web Services Outposts API calls with Amazon Web Services CloudTrail in the Amazon Web Services Outposts User Guide. 
   */
  startConnection(callback?: (err: AWSError, data: Outposts.Types.StartConnectionResponse) => void): Request<Outposts.Types.StartConnectionResponse, AWSError>;
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
  /**
   *  Updates an Outpost. 
   */
  updateOutpost(params: Outposts.Types.UpdateOutpostInput, callback?: (err: AWSError, data: Outposts.Types.UpdateOutpostOutput) => void): Request<Outposts.Types.UpdateOutpostOutput, AWSError>;
  /**
   *  Updates an Outpost. 
   */
  updateOutpost(callback?: (err: AWSError, data: Outposts.Types.UpdateOutpostOutput) => void): Request<Outposts.Types.UpdateOutpostOutput, AWSError>;
  /**
   * Updates the specified site.
   */
  updateSite(params: Outposts.Types.UpdateSiteInput, callback?: (err: AWSError, data: Outposts.Types.UpdateSiteOutput) => void): Request<Outposts.Types.UpdateSiteOutput, AWSError>;
  /**
   * Updates the specified site.
   */
  updateSite(callback?: (err: AWSError, data: Outposts.Types.UpdateSiteOutput) => void): Request<Outposts.Types.UpdateSiteOutput, AWSError>;
  /**
   * Updates the address of the specified site. You can't update a site address if there is an order in progress. You must wait for the order to complete or cancel the order. You can update the operating address before you place an order at the site, or after all Outposts that belong to the site have been deactivated.
   */
  updateSiteAddress(params: Outposts.Types.UpdateSiteAddressInput, callback?: (err: AWSError, data: Outposts.Types.UpdateSiteAddressOutput) => void): Request<Outposts.Types.UpdateSiteAddressOutput, AWSError>;
  /**
   * Updates the address of the specified site. You can't update a site address if there is an order in progress. You must wait for the order to complete or cancel the order. You can update the operating address before you place an order at the site, or after all Outposts that belong to the site have been deactivated.
   */
  updateSiteAddress(callback?: (err: AWSError, data: Outposts.Types.UpdateSiteAddressOutput) => void): Request<Outposts.Types.UpdateSiteAddressOutput, AWSError>;
  /**
   * Update the physical and logistical details for a rack at a site. For more information about hardware requirements for racks, see Network readiness checklist in the Amazon Web Services Outposts User Guide.  To update a rack at a site with an order of IN_PROGRESS, you must wait for the order to complete or cancel the order.
   */
  updateSiteRackPhysicalProperties(params: Outposts.Types.UpdateSiteRackPhysicalPropertiesInput, callback?: (err: AWSError, data: Outposts.Types.UpdateSiteRackPhysicalPropertiesOutput) => void): Request<Outposts.Types.UpdateSiteRackPhysicalPropertiesOutput, AWSError>;
  /**
   * Update the physical and logistical details for a rack at a site. For more information about hardware requirements for racks, see Network readiness checklist in the Amazon Web Services Outposts User Guide.  To update a rack at a site with an order of IN_PROGRESS, you must wait for the order to complete or cancel the order.
   */
  updateSiteRackPhysicalProperties(callback?: (err: AWSError, data: Outposts.Types.UpdateSiteRackPhysicalPropertiesOutput) => void): Request<Outposts.Types.UpdateSiteRackPhysicalPropertiesOutput, AWSError>;
}
declare namespace Outposts {
  export type AccountId = string;
  export interface Address {
    /**
     * The name of the contact.
     */
    ContactName?: ContactName;
    /**
     * The phone number of the contact.
     */
    ContactPhoneNumber?: ContactPhoneNumber;
    /**
     * The first line of the address.
     */
    AddressLine1: AddressLine1;
    /**
     * The second line of the address.
     */
    AddressLine2?: AddressLine2;
    /**
     * The third line of the address.
     */
    AddressLine3?: AddressLine3;
    /**
     * The city for the address.
     */
    City: City;
    /**
     * The state for the address.
     */
    StateOrRegion: StateOrRegion;
    /**
     * The district or county for the address.
     */
    DistrictOrCounty?: DistrictOrCounty;
    /**
     * The postal code for the address.
     */
    PostalCode: PostalCode;
    /**
     * The ISO-3166 two-letter country code for the address.
     */
    CountryCode: CountryCode;
    /**
     * The municipality for the address.
     */
    Municipality?: Municipality;
  }
  export type AddressLine1 = string;
  export type AddressLine2 = string;
  export type AddressLine3 = string;
  export type AddressType = "SHIPPING_ADDRESS"|"OPERATING_ADDRESS"|string;
  export type Arn = string;
  export type AssetId = string;
  export interface AssetInfo {
    /**
     *  The ID of the asset. 
     */
    AssetId?: AssetId;
    /**
     *  The rack ID of the asset. 
     */
    RackId?: RackId;
    /**
     *  The type of the asset. 
     */
    AssetType?: AssetType;
    /**
     *  Information about compute hardware assets. 
     */
    ComputeAttributes?: ComputeAttributes;
    /**
     *  The position of an asset in a rack. 
     */
    AssetLocation?: AssetLocation;
  }
  export type AssetListDefinition = AssetInfo[];
  export interface AssetLocation {
    /**
     *  The position of an asset in a rack measured in rack units. 
     */
    RackElevation?: RackElevation;
  }
  export type AssetState = "ACTIVE"|"RETIRING"|"ISOLATED"|string;
  export type AssetType = "COMPUTE"|string;
  export type AvailabilityZone = string;
  export type AvailabilityZoneId = string;
  export type AvailabilityZoneIdList = AvailabilityZoneId[];
  export type AvailabilityZoneList = AvailabilityZone[];
  export type CIDR = string;
  export type CIDRList = CIDR[];
  export interface CancelOrderInput {
    /**
     *  The ID of the order. 
     */
    OrderId: OrderId;
  }
  export interface CancelOrderOutput {
  }
  export interface CatalogItem {
    /**
     *  The ID of the catalog item. 
     */
    CatalogItemId?: SkuCode;
    /**
     *  The status of a catalog item. 
     */
    ItemStatus?: CatalogItemStatus;
    /**
     *  Information about the EC2 capacity of an item. 
     */
    EC2Capacities?: EC2CapacityListDefinition;
    /**
     *  Information about the power draw of an item. 
     */
    PowerKva?: CatalogItemPowerKva;
    /**
     *  The weight of the item in pounds. 
     */
    WeightLbs?: CatalogItemWeightLbs;
    /**
     *  The uplink speed this catalog item requires for the connection to the Region. 
     */
    SupportedUplinkGbps?: SupportedUplinkGbpsListDefinition;
    /**
     *  The supported storage options for the catalog item. 
     */
    SupportedStorage?: SupportedStorageList;
  }
  export type CatalogItemClass = "RACK"|"SERVER"|string;
  export type CatalogItemClassList = CatalogItemClass[];
  export type CatalogItemListDefinition = CatalogItem[];
  export type CatalogItemPowerKva = number;
  export type CatalogItemStatus = "AVAILABLE"|"DISCONTINUED"|string;
  export type CatalogItemWeightLbs = number;
  export type City = string;
  export type CityList = City[];
  export type ComputeAssetState = "ACTIVE"|"ISOLATED"|"RETIRING"|string;
  export interface ComputeAttributes {
    /**
     *  The host ID of the Dedicated Host on the asset. 
     */
    HostId?: HostId;
    /**
     * The state.   ACTIVE - The asset is available and can provide capacity for new compute resources.   ISOLATED - The asset is undergoing maintenance and can't provide capacity for new compute resources. Existing compute resources on the asset are not affected.   RETIRING - The underlying hardware for the asset is degraded. Capacity for new compute resources is reduced. Amazon Web Services sends notifications for resources that must be stopped before the asset can be replaced.  
     */
    State?: ComputeAssetState;
    /**
     * A list of the names of instance families that are currently associated with a given asset.
     */
    InstanceFamilies?: InstanceFamilies;
  }
  export interface ConnectionDetails {
    /**
     *  The public key of the client. 
     */
    ClientPublicKey?: WireGuardPublicKey;
    /**
     *  The public key of the server. 
     */
    ServerPublicKey?: WireGuardPublicKey;
    /**
     *  The endpoint for the server. 
     */
    ServerEndpoint?: ServerEndpoint;
    /**
     *  The client tunnel address. 
     */
    ClientTunnelAddress?: CIDR;
    /**
     *  The server tunnel address. 
     */
    ServerTunnelAddress?: CIDR;
    /**
     *  The allowed IP addresses. 
     */
    AllowedIps?: CIDRList;
  }
  export type ConnectionId = string;
  export type ContactName = string;
  export type ContactPhoneNumber = string;
  export type CountryCode = string;
  export type CountryCodeList = CountryCode[];
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
     * The payment option.
     */
    PaymentOption: PaymentOption;
    /**
     * The payment terms.
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
    /**
     *  The ID or the Amazon Resource Name (ARN) of the site. 
     */
    SiteId: SiteId;
    AvailabilityZone?: AvailabilityZone;
    AvailabilityZoneId?: AvailabilityZoneId;
    /**
     * The tags to apply to the Outpost.
     */
    Tags?: TagMap;
    /**
     *  The type of hardware for this Outpost. 
     */
    SupportedHardwareType?: SupportedHardwareType;
  }
  export interface CreateOutpostOutput {
    Outpost?: Outpost;
  }
  export interface CreateSiteInput {
    Name: SiteName;
    Description?: SiteDescription;
    /**
     * Additional information that you provide about site access requirements, electrician scheduling, personal protective equipment, or regulation of equipment materials that could affect your installation process. 
     */
    Notes?: SiteNotes;
    /**
     *  The tags to apply to a site. 
     */
    Tags?: TagMap;
    /**
     *  The location to install and power on the hardware. This address might be different from the shipping address. 
     */
    OperatingAddress?: Address;
    /**
     *  The location to ship the hardware. This address might be different from the operating address. 
     */
    ShippingAddress?: Address;
    /**
     *  Information about the physical and logistical details for the rack at this site. For more information about hardware requirements for racks, see Network readiness checklist in the Amazon Web Services Outposts User Guide. 
     */
    RackPhysicalProperties?: RackPhysicalProperties;
  }
  export interface CreateSiteOutput {
    Site?: Site;
  }
  export interface DeleteOutpostInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the Outpost. 
     */
    OutpostId: OutpostId;
  }
  export interface DeleteOutpostOutput {
  }
  export interface DeleteSiteInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the site. 
     */
    SiteId: SiteId;
  }
  export interface DeleteSiteOutput {
  }
  export type DeviceSerialNumber = string;
  export type DistrictOrCounty = string;
  export interface EC2Capacity {
    /**
     *  The family of the EC2 capacity. 
     */
    Family?: Family;
    /**
     *  The maximum size of the EC2 capacity. 
     */
    MaxSize?: MaxSize;
    /**
     *  The quantity of the EC2 capacity. 
     */
    Quantity?: Quantity;
  }
  export type EC2CapacityListDefinition = EC2Capacity[];
  export type EC2FamilyList = Family[];
  export type Family = string;
  export type FiberOpticCableType = "SINGLE_MODE"|"MULTI_MODE"|string;
  export interface GetCatalogItemInput {
    /**
     * The ID of the catalog item.
     */
    CatalogItemId: SkuCode;
  }
  export interface GetCatalogItemOutput {
    /**
     * Information about this catalog item.
     */
    CatalogItem?: CatalogItem;
  }
  export interface GetConnectionRequest {
    /**
     *  The ID of the connection. 
     */
    ConnectionId: ConnectionId;
  }
  export interface GetConnectionResponse {
    /**
     *  The ID of the connection. 
     */
    ConnectionId?: ConnectionId;
    /**
     *  Information about the connection. 
     */
    ConnectionDetails?: ConnectionDetails;
  }
  export interface GetOrderInput {
    /**
     * The ID of the order.
     */
    OrderId: OrderId;
  }
  export interface GetOrderOutput {
    Order?: Order;
  }
  export interface GetOutpostInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the Outpost. 
     */
    OutpostId: OutpostId;
  }
  export interface GetOutpostInstanceTypesInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the Outpost. 
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
  export interface GetSiteAddressInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the site. 
     */
    SiteId: SiteId;
    /**
     * The type of the address you request. 
     */
    AddressType: AddressType;
  }
  export interface GetSiteAddressOutput {
    SiteId?: SiteId;
    /**
     * The type of the address you receive. 
     */
    AddressType?: AddressType;
    /**
     *  Information about the address. 
     */
    Address?: Address;
  }
  export interface GetSiteInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the site. 
     */
    SiteId: SiteId;
  }
  export interface GetSiteOutput {
    Site?: Site;
  }
  export type HostId = string;
  export type HostIdList = HostId[];
  export type ISO8601Timestamp = Date;
  export type InstanceFamilies = InstanceFamilyName[];
  export type InstanceFamilyName = string;
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
    Status?: LineItemStatus;
    /**
     *  Information about a line item shipment. 
     */
    ShipmentInformation?: ShipmentInformation;
    /**
     *  Information about assets. 
     */
    AssetInformationList?: LineItemAssetInformationList;
    /**
     * The ID of the previous line item.
     */
    PreviousLineItemId?: LineItemId;
    /**
     * The ID of the previous order.
     */
    PreviousOrderId?: OrderId;
  }
  export interface LineItemAssetInformation {
    /**
     *  The ID of the asset. 
     */
    AssetId?: AssetId;
    /**
     *  The MAC addresses of the asset. 
     */
    MacAddressList?: MacAddressList;
  }
  export type LineItemAssetInformationList = LineItemAssetInformation[];
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
  export type LineItemStatus = "PREPARING"|"BUILDING"|"SHIPPED"|"DELIVERED"|"INSTALLING"|"INSTALLED"|"ERROR"|"CANCELLED"|"REPLACED"|string;
  export type LineItemStatusCounts = {[key: string]: LineItemQuantity};
  export interface ListAssetsInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the Outpost. 
     */
    OutpostIdentifier: OutpostIdentifier;
    /**
     * Filters the results by the host ID of a Dedicated Host.
     */
    HostIdFilter?: HostIdList;
    MaxResults?: MaxResults1000;
    NextToken?: Token;
    /**
     * Filters the results by state.
     */
    StatusFilter?: StatusList;
  }
  export interface ListAssetsOutput {
    /**
     * Information about the hardware assets.
     */
    Assets?: AssetListDefinition;
    NextToken?: Token;
  }
  export interface ListCatalogItemsInput {
    NextToken?: Token;
    MaxResults?: MaxResults1000;
    /**
     * Filters the results by item class.
     */
    ItemClassFilter?: CatalogItemClassList;
    /**
     * Filters the results by storage option.
     */
    SupportedStorageFilter?: SupportedStorageList;
    /**
     * Filters the results by EC2 family (for example, M5).
     */
    EC2FamilyFilter?: EC2FamilyList;
  }
  export interface ListCatalogItemsOutput {
    /**
     * Information about the catalog items.
     */
    CatalogItems?: CatalogItemListDefinition;
    NextToken?: Token;
  }
  export interface ListOrdersInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the Outpost. 
     */
    OutpostIdentifierFilter?: OutpostIdentifier;
    NextToken?: Token;
    MaxResults?: MaxResults1000;
  }
  export interface ListOrdersOutput {
    /**
     *  Information about the orders. 
     */
    Orders?: OrderSummaryListDefinition;
    NextToken?: Token;
  }
  export interface ListOutpostsInput {
    NextToken?: Token;
    MaxResults?: MaxResults1000;
    /**
     * Filters the results by the lifecycle status.
     */
    LifeCycleStatusFilter?: LifeCycleStatusList;
    /**
     * Filters the results by Availability Zone (for example, us-east-1a).
     */
    AvailabilityZoneFilter?: AvailabilityZoneList;
    /**
     * Filters the results by AZ ID (for example, use1-az1).
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
    /**
     * Filters the results by country code.
     */
    OperatingAddressCountryCodeFilter?: CountryCodeList;
    /**
     * Filters the results by state or region.
     */
    OperatingAddressStateOrRegionFilter?: StateOrRegionList;
    /**
     * Filters the results by city.
     */
    OperatingAddressCityFilter?: CityList;
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
  export type MacAddress = string;
  export type MacAddressList = MacAddress[];
  export type MaxResults1000 = number;
  export type MaxSize = string;
  export type MaximumSupportedWeightLbs = "NO_LIMIT"|"MAX_1400_LBS"|"MAX_1600_LBS"|"MAX_1800_LBS"|"MAX_2000_LBS"|string;
  export type Municipality = string;
  export type NetworkInterfaceDeviceIndex = number;
  export type OpticalStandard = "OPTIC_10GBASE_SR"|"OPTIC_10GBASE_IR"|"OPTIC_10GBASE_LR"|"OPTIC_40GBASE_SR"|"OPTIC_40GBASE_ESR"|"OPTIC_40GBASE_IR4_LR4L"|"OPTIC_40GBASE_LR4"|"OPTIC_100GBASE_SR4"|"OPTIC_100GBASE_CWDM4"|"OPTIC_100GBASE_LR4"|"OPTIC_100G_PSM4_MSA"|"OPTIC_1000BASE_LX"|"OPTIC_1000BASE_SX"|string;
  export interface Order {
    /**
     *  The ID of the Outpost in the order. 
     */
    OutpostId?: OutpostIdOnly;
    /**
     * The ID of the order.
     */
    OrderId?: OrderId;
    /**
     * The status of the order.    PREPARING - Order is received and being prepared.    IN_PROGRESS - Order is either being built, shipped, or installed. To get more details, see the line item status.    COMPLETED - Order is complete.    CANCELLED - Order is cancelled.    ERROR - Customer should contact support.    The following status are deprecated: RECEIVED, PENDING, PROCESSING, INSTALLING, and FULFILLED.  
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
    /**
     * The payment term.
     */
    PaymentTerm?: PaymentTerm;
    /**
     * The type of order.
     */
    OrderType?: OrderType;
  }
  export type OrderId = string;
  export type OrderStatus = "RECEIVED"|"PENDING"|"PROCESSING"|"INSTALLING"|"FULFILLED"|"CANCELLED"|"PREPARING"|"IN_PROGRESS"|"COMPLETED"|"ERROR"|string;
  export interface OrderSummary {
    /**
     *  The ID of the Outpost. 
     */
    OutpostId?: OutpostIdOnly;
    /**
     *  The ID of the order. 
     */
    OrderId?: OrderId;
    /**
     * The type of order.
     */
    OrderType?: OrderType;
    /**
     * The status of the order.    PREPARING - Order is received and is being prepared.    IN_PROGRESS - Order is either being built, shipped, or installed. For more information, see the LineItem status.    COMPLETED - Order is complete.    CANCELLED - Order is cancelled.    ERROR - Customer should contact support.    The following statuses are deprecated: RECEIVED, PENDING, PROCESSING, INSTALLING, and FULFILLED.  
     */
    Status?: OrderStatus;
    /**
     *  The status of all line items in the order. 
     */
    LineItemCountsByStatus?: LineItemStatusCounts;
    /**
     *  The submission date for the order. 
     */
    OrderSubmissionDate?: ISO8601Timestamp;
    /**
     *  The fulfilment date for the order. 
     */
    OrderFulfilledDate?: ISO8601Timestamp;
  }
  export type OrderSummaryListDefinition = OrderSummary[];
  export type OrderType = "OUTPOST"|"REPLACEMENT"|string;
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
    /**
     *  The hardware type. 
     */
    SupportedHardwareType?: SupportedHardwareType;
  }
  export type OutpostArn = string;
  export type OutpostDescription = string;
  export type OutpostId = string;
  export type OutpostIdOnly = string;
  export type OutpostIdentifier = string;
  export type OutpostName = string;
  export type OwnerId = string;
  export type PaymentOption = "ALL_UPFRONT"|"NO_UPFRONT"|"PARTIAL_UPFRONT"|string;
  export type PaymentTerm = "THREE_YEARS"|"ONE_YEAR"|string;
  export type PostalCode = string;
  export type PowerConnector = "L6_30P"|"IEC309"|"AH530P7W"|"AH532P6W"|string;
  export type PowerDrawKva = "POWER_5_KVA"|"POWER_10_KVA"|"POWER_15_KVA"|"POWER_30_KVA"|string;
  export type PowerFeedDrop = "ABOVE_RACK"|"BELOW_RACK"|string;
  export type PowerPhase = "SINGLE_PHASE"|"THREE_PHASE"|string;
  export type Quantity = string;
  export type RackElevation = number;
  export type RackId = string;
  export interface RackPhysicalProperties {
    /**
     * The power draw available at the hardware placement position for the rack. 
     */
    PowerDrawKva?: PowerDrawKva;
    /**
     * The power option that you can provide for hardware.
     */
    PowerPhase?: PowerPhase;
    /**
     * The power connector for the hardware. 
     */
    PowerConnector?: PowerConnector;
    /**
     * The position of the power feed.
     */
    PowerFeedDrop?: PowerFeedDrop;
    /**
     * The uplink speed the rack supports for the connection to the Region. 
     */
    UplinkGbps?: UplinkGbps;
    /**
     * The number of uplinks each Outpost network device.
     */
    UplinkCount?: UplinkCount;
    /**
     * The type of fiber used to attach the Outpost to the network. 
     */
    FiberOpticCableType?: FiberOpticCableType;
    /**
     * The type of optical standard used to attach the Outpost to the network. This field is dependent on uplink speed, fiber type, and distance to the upstream device. For more information about networking requirements for racks, see Network in the Amazon Web Services Outposts User Guide. 
     */
    OpticalStandard?: OpticalStandard;
    /**
     * The maximum rack weight that this site can support. NO_LIMIT is over 2000 lbs (907 kg). 
     */
    MaximumSupportedWeightLbs?: MaximumSupportedWeightLbs;
  }
  export type ServerEndpoint = string;
  export type ShipmentCarrier = "DHL"|"DBS"|"FEDEX"|"UPS"|string;
  export interface ShipmentInformation {
    /**
     *  The tracking number of the shipment. 
     */
    ShipmentTrackingNumber?: TrackingId;
    /**
     *  The carrier of the shipment. 
     */
    ShipmentCarrier?: ShipmentCarrier;
  }
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
    /**
     *  Notes about a site. 
     */
    Notes?: SiteNotes;
    /**
     *  The ISO-3166 two-letter country code where the hardware is installed and powered on. 
     */
    OperatingAddressCountryCode?: CountryCode;
    /**
     *  State or region where the hardware is installed and powered on. 
     */
    OperatingAddressStateOrRegion?: StateOrRegion;
    /**
     *  City where the hardware is installed and powered on. 
     */
    OperatingAddressCity?: City;
    /**
     *  Information about the physical and logistical details for a rack at the site. 
     */
    RackPhysicalProperties?: RackPhysicalProperties;
  }
  export type SiteArn = string;
  export type SiteDescription = string;
  export type SiteId = string;
  export type SiteName = string;
  export type SiteNotes = string;
  export type SkuCode = string;
  export interface StartConnectionRequest {
    /**
     *  The serial number of the dongle. 
     */
    DeviceSerialNumber: DeviceSerialNumber;
    /**
     *  The ID of the Outpost server. 
     */
    AssetId: AssetId;
    /**
     *  The public key of the client. 
     */
    ClientPublicKey: WireGuardPublicKey;
    /**
     *  The device index of the network interface on the Outpost server. 
     */
    NetworkInterfaceDeviceIndex: NetworkInterfaceDeviceIndex;
  }
  export interface StartConnectionResponse {
    /**
     *  The ID of the connection. 
     */
    ConnectionId?: ConnectionId;
    /**
     *  The underlay IP address. 
     */
    UnderlayIpAddress?: UnderlayIpAddress;
  }
  export type StateOrRegion = string;
  export type StateOrRegionList = StateOrRegion[];
  export type StatusList = AssetState[];
  export type SupportedHardwareType = "RACK"|"SERVER"|string;
  export type SupportedStorageEnum = "EBS"|"S3"|string;
  export type SupportedStorageList = SupportedStorageEnum[];
  export type SupportedUplinkGbps = number;
  export type SupportedUplinkGbpsListDefinition = SupportedUplinkGbps[];
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
  export type TrackingId = string;
  export type UnderlayIpAddress = string;
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
  export interface UpdateOutpostInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the Outpost. 
     */
    OutpostId: OutpostId;
    Name?: OutpostName;
    Description?: OutpostDescription;
    /**
     *  The type of hardware for this Outpost. 
     */
    SupportedHardwareType?: SupportedHardwareType;
  }
  export interface UpdateOutpostOutput {
    Outpost?: Outpost;
  }
  export interface UpdateSiteAddressInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the site. 
     */
    SiteId: SiteId;
    /**
     *  The type of the address. 
     */
    AddressType: AddressType;
    /**
     *  The address for the site. 
     */
    Address: Address;
  }
  export interface UpdateSiteAddressOutput {
    /**
     *  The type of the address. 
     */
    AddressType?: AddressType;
    /**
     *  Information about an address. 
     */
    Address?: Address;
  }
  export interface UpdateSiteInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the site. 
     */
    SiteId: SiteId;
    Name?: SiteName;
    Description?: SiteDescription;
    /**
     * Notes about a site.
     */
    Notes?: SiteNotes;
  }
  export interface UpdateSiteOutput {
    Site?: Site;
  }
  export interface UpdateSiteRackPhysicalPropertiesInput {
    /**
     *  The ID or the Amazon Resource Name (ARN) of the site. 
     */
    SiteId: SiteId;
    /**
     * The power draw, in kVA, available at the hardware placement position for the rack.
     */
    PowerDrawKva?: PowerDrawKva;
    /**
     * The power option that you can provide for hardware.    Single-phase AC feed: 200 V to 277 V, 50 Hz or 60 Hz   Three-phase AC feed: 346 V to 480 V, 50 Hz or 60 Hz  
     */
    PowerPhase?: PowerPhase;
    /**
     * The power connector that Amazon Web Services should plan to provide for connections to the hardware. Note the correlation between PowerPhase and PowerConnector.    Single-phase AC feed    L6-30P – (common in US); 30A; single phase    IEC309 (blue) – P+N+E, 6hr; 32 A; single phase     Three-phase AC feed    AH530P7W (red) – 3P+N+E, 7hr; 30A; three phase    AH532P6W (red) – 3P+N+E, 6hr; 32A; three phase    
     */
    PowerConnector?: PowerConnector;
    /**
     * Indicates whether the power feed comes above or below the rack. 
     */
    PowerFeedDrop?: PowerFeedDrop;
    /**
     * The uplink speed the rack should support for the connection to the Region. 
     */
    UplinkGbps?: UplinkGbps;
    /**
     * Racks come with two Outpost network devices. Depending on the supported uplink speed at the site, the Outpost network devices provide a variable number of uplinks. Specify the number of uplinks for each Outpost network device that you intend to use to connect the rack to your network. Note the correlation between UplinkGbps and UplinkCount.    1Gbps - Uplinks available: 1, 2, 4, 6, 8   10Gbps - Uplinks available: 1, 2, 4, 8, 12, 16   40 and 100 Gbps- Uplinks available: 1, 2, 4  
     */
    UplinkCount?: UplinkCount;
    /**
     * The type of fiber that you will use to attach the Outpost to your network. 
     */
    FiberOpticCableType?: FiberOpticCableType;
    /**
     * The type of optical standard that you will use to attach the Outpost to your network. This field is dependent on uplink speed, fiber type, and distance to the upstream device. For more information about networking requirements for racks, see Network in the Amazon Web Services Outposts User Guide.     OPTIC_10GBASE_SR: 10GBASE-SR    OPTIC_10GBASE_IR: 10GBASE-IR    OPTIC_10GBASE_LR: 10GBASE-LR    OPTIC_40GBASE_SR: 40GBASE-SR    OPTIC_40GBASE_ESR: 40GBASE-ESR    OPTIC_40GBASE_IR4_LR4L: 40GBASE-IR (LR4L)    OPTIC_40GBASE_LR4: 40GBASE-LR4    OPTIC_100GBASE_SR4: 100GBASE-SR4    OPTIC_100GBASE_CWDM4: 100GBASE-CWDM4    OPTIC_100GBASE_LR4: 100GBASE-LR4    OPTIC_100G_PSM4_MSA: 100G PSM4 MSA    OPTIC_1000BASE_LX: 1000Base-LX    OPTIC_1000BASE_SX : 1000Base-SX  
     */
    OpticalStandard?: OpticalStandard;
    /**
     * The maximum rack weight that this site can support. NO_LIMIT is over 2000lbs. 
     */
    MaximumSupportedWeightLbs?: MaximumSupportedWeightLbs;
  }
  export interface UpdateSiteRackPhysicalPropertiesOutput {
    Site?: Site;
  }
  export type UplinkCount = "UPLINK_COUNT_1"|"UPLINK_COUNT_2"|"UPLINK_COUNT_3"|"UPLINK_COUNT_4"|"UPLINK_COUNT_5"|"UPLINK_COUNT_6"|"UPLINK_COUNT_7"|"UPLINK_COUNT_8"|"UPLINK_COUNT_12"|"UPLINK_COUNT_16"|string;
  export type UplinkGbps = "UPLINK_1G"|"UPLINK_10G"|"UPLINK_40G"|"UPLINK_100G"|string;
  export type WireGuardPublicKey = string;
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
