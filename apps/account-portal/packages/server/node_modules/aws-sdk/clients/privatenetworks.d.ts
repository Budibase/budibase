import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class PrivateNetworks extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: PrivateNetworks.Types.ClientConfiguration)
  config: Config & PrivateNetworks.Types.ClientConfiguration;
  /**
   * Acknowledges that the specified network order was received.
   */
  acknowledgeOrderReceipt(params: PrivateNetworks.Types.AcknowledgeOrderReceiptRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.AcknowledgeOrderReceiptResponse) => void): Request<PrivateNetworks.Types.AcknowledgeOrderReceiptResponse, AWSError>;
  /**
   * Acknowledges that the specified network order was received.
   */
  acknowledgeOrderReceipt(callback?: (err: AWSError, data: PrivateNetworks.Types.AcknowledgeOrderReceiptResponse) => void): Request<PrivateNetworks.Types.AcknowledgeOrderReceiptResponse, AWSError>;
  /**
   * Activates the specified device identifier.
   */
  activateDeviceIdentifier(params: PrivateNetworks.Types.ActivateDeviceIdentifierRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.ActivateDeviceIdentifierResponse) => void): Request<PrivateNetworks.Types.ActivateDeviceIdentifierResponse, AWSError>;
  /**
   * Activates the specified device identifier.
   */
  activateDeviceIdentifier(callback?: (err: AWSError, data: PrivateNetworks.Types.ActivateDeviceIdentifierResponse) => void): Request<PrivateNetworks.Types.ActivateDeviceIdentifierResponse, AWSError>;
  /**
   * Activates the specified network site.
   */
  activateNetworkSite(params: PrivateNetworks.Types.ActivateNetworkSiteRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.ActivateNetworkSiteResponse) => void): Request<PrivateNetworks.Types.ActivateNetworkSiteResponse, AWSError>;
  /**
   * Activates the specified network site.
   */
  activateNetworkSite(callback?: (err: AWSError, data: PrivateNetworks.Types.ActivateNetworkSiteResponse) => void): Request<PrivateNetworks.Types.ActivateNetworkSiteResponse, AWSError>;
  /**
   * Configures the specified network resource.   Use this action to specify the geographic position of the hardware. You must provide Certified Professional Installer (CPI) credentials in the request so that we can obtain spectrum grants. For more information, see Radio units in the Amazon Web Services Private 5G User Guide. 
   */
  configureAccessPoint(params: PrivateNetworks.Types.ConfigureAccessPointRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.ConfigureAccessPointResponse) => void): Request<PrivateNetworks.Types.ConfigureAccessPointResponse, AWSError>;
  /**
   * Configures the specified network resource.   Use this action to specify the geographic position of the hardware. You must provide Certified Professional Installer (CPI) credentials in the request so that we can obtain spectrum grants. For more information, see Radio units in the Amazon Web Services Private 5G User Guide. 
   */
  configureAccessPoint(callback?: (err: AWSError, data: PrivateNetworks.Types.ConfigureAccessPointResponse) => void): Request<PrivateNetworks.Types.ConfigureAccessPointResponse, AWSError>;
  /**
   * Creates a network.
   */
  createNetwork(params: PrivateNetworks.Types.CreateNetworkRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.CreateNetworkResponse) => void): Request<PrivateNetworks.Types.CreateNetworkResponse, AWSError>;
  /**
   * Creates a network.
   */
  createNetwork(callback?: (err: AWSError, data: PrivateNetworks.Types.CreateNetworkResponse) => void): Request<PrivateNetworks.Types.CreateNetworkResponse, AWSError>;
  /**
   * Creates a network site.
   */
  createNetworkSite(params: PrivateNetworks.Types.CreateNetworkSiteRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.CreateNetworkSiteResponse) => void): Request<PrivateNetworks.Types.CreateNetworkSiteResponse, AWSError>;
  /**
   * Creates a network site.
   */
  createNetworkSite(callback?: (err: AWSError, data: PrivateNetworks.Types.CreateNetworkSiteResponse) => void): Request<PrivateNetworks.Types.CreateNetworkSiteResponse, AWSError>;
  /**
   * Deactivates the specified device identifier.
   */
  deactivateDeviceIdentifier(params: PrivateNetworks.Types.DeactivateDeviceIdentifierRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.DeactivateDeviceIdentifierResponse) => void): Request<PrivateNetworks.Types.DeactivateDeviceIdentifierResponse, AWSError>;
  /**
   * Deactivates the specified device identifier.
   */
  deactivateDeviceIdentifier(callback?: (err: AWSError, data: PrivateNetworks.Types.DeactivateDeviceIdentifierResponse) => void): Request<PrivateNetworks.Types.DeactivateDeviceIdentifierResponse, AWSError>;
  /**
   * Deletes the specified network. You must delete network sites before you delete the network. For more information, see DeleteNetworkSite in the API Reference for Amazon Web Services Private 5G.
   */
  deleteNetwork(params: PrivateNetworks.Types.DeleteNetworkRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.DeleteNetworkResponse) => void): Request<PrivateNetworks.Types.DeleteNetworkResponse, AWSError>;
  /**
   * Deletes the specified network. You must delete network sites before you delete the network. For more information, see DeleteNetworkSite in the API Reference for Amazon Web Services Private 5G.
   */
  deleteNetwork(callback?: (err: AWSError, data: PrivateNetworks.Types.DeleteNetworkResponse) => void): Request<PrivateNetworks.Types.DeleteNetworkResponse, AWSError>;
  /**
   * Deletes the specified network site. Return the hardware after you delete the network site. You are responsible for minimum charges. For more information, see Hardware returns in the Amazon Web Services Private 5G User Guide. 
   */
  deleteNetworkSite(params: PrivateNetworks.Types.DeleteNetworkSiteRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.DeleteNetworkSiteResponse) => void): Request<PrivateNetworks.Types.DeleteNetworkSiteResponse, AWSError>;
  /**
   * Deletes the specified network site. Return the hardware after you delete the network site. You are responsible for minimum charges. For more information, see Hardware returns in the Amazon Web Services Private 5G User Guide. 
   */
  deleteNetworkSite(callback?: (err: AWSError, data: PrivateNetworks.Types.DeleteNetworkSiteResponse) => void): Request<PrivateNetworks.Types.DeleteNetworkSiteResponse, AWSError>;
  /**
   * Gets the specified device identifier.
   */
  getDeviceIdentifier(params: PrivateNetworks.Types.GetDeviceIdentifierRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.GetDeviceIdentifierResponse) => void): Request<PrivateNetworks.Types.GetDeviceIdentifierResponse, AWSError>;
  /**
   * Gets the specified device identifier.
   */
  getDeviceIdentifier(callback?: (err: AWSError, data: PrivateNetworks.Types.GetDeviceIdentifierResponse) => void): Request<PrivateNetworks.Types.GetDeviceIdentifierResponse, AWSError>;
  /**
   * Gets the specified network.
   */
  getNetwork(params: PrivateNetworks.Types.GetNetworkRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.GetNetworkResponse) => void): Request<PrivateNetworks.Types.GetNetworkResponse, AWSError>;
  /**
   * Gets the specified network.
   */
  getNetwork(callback?: (err: AWSError, data: PrivateNetworks.Types.GetNetworkResponse) => void): Request<PrivateNetworks.Types.GetNetworkResponse, AWSError>;
  /**
   * Gets the specified network resource.
   */
  getNetworkResource(params: PrivateNetworks.Types.GetNetworkResourceRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.GetNetworkResourceResponse) => void): Request<PrivateNetworks.Types.GetNetworkResourceResponse, AWSError>;
  /**
   * Gets the specified network resource.
   */
  getNetworkResource(callback?: (err: AWSError, data: PrivateNetworks.Types.GetNetworkResourceResponse) => void): Request<PrivateNetworks.Types.GetNetworkResourceResponse, AWSError>;
  /**
   * Gets the specified network site.
   */
  getNetworkSite(params: PrivateNetworks.Types.GetNetworkSiteRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.GetNetworkSiteResponse) => void): Request<PrivateNetworks.Types.GetNetworkSiteResponse, AWSError>;
  /**
   * Gets the specified network site.
   */
  getNetworkSite(callback?: (err: AWSError, data: PrivateNetworks.Types.GetNetworkSiteResponse) => void): Request<PrivateNetworks.Types.GetNetworkSiteResponse, AWSError>;
  /**
   * Gets the specified order.
   */
  getOrder(params: PrivateNetworks.Types.GetOrderRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.GetOrderResponse) => void): Request<PrivateNetworks.Types.GetOrderResponse, AWSError>;
  /**
   * Gets the specified order.
   */
  getOrder(callback?: (err: AWSError, data: PrivateNetworks.Types.GetOrderResponse) => void): Request<PrivateNetworks.Types.GetOrderResponse, AWSError>;
  /**
   * Lists device identifiers. Add filters to your request to return a more specific list of results. Use filters to match the Amazon Resource Name (ARN) of an order, the status of device identifiers, or the ARN of the traffic group. If you specify multiple filters, filters are joined with an OR, and the request returns results that match all of the specified filters.
   */
  listDeviceIdentifiers(params: PrivateNetworks.Types.ListDeviceIdentifiersRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.ListDeviceIdentifiersResponse) => void): Request<PrivateNetworks.Types.ListDeviceIdentifiersResponse, AWSError>;
  /**
   * Lists device identifiers. Add filters to your request to return a more specific list of results. Use filters to match the Amazon Resource Name (ARN) of an order, the status of device identifiers, or the ARN of the traffic group. If you specify multiple filters, filters are joined with an OR, and the request returns results that match all of the specified filters.
   */
  listDeviceIdentifiers(callback?: (err: AWSError, data: PrivateNetworks.Types.ListDeviceIdentifiersResponse) => void): Request<PrivateNetworks.Types.ListDeviceIdentifiersResponse, AWSError>;
  /**
   * Lists network resources. Add filters to your request to return a more specific list of results. Use filters to match the Amazon Resource Name (ARN) of an order or the status of network resources. If you specify multiple filters, filters are joined with an OR, and the request returns results that match all of the specified filters.
   */
  listNetworkResources(params: PrivateNetworks.Types.ListNetworkResourcesRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.ListNetworkResourcesResponse) => void): Request<PrivateNetworks.Types.ListNetworkResourcesResponse, AWSError>;
  /**
   * Lists network resources. Add filters to your request to return a more specific list of results. Use filters to match the Amazon Resource Name (ARN) of an order or the status of network resources. If you specify multiple filters, filters are joined with an OR, and the request returns results that match all of the specified filters.
   */
  listNetworkResources(callback?: (err: AWSError, data: PrivateNetworks.Types.ListNetworkResourcesResponse) => void): Request<PrivateNetworks.Types.ListNetworkResourcesResponse, AWSError>;
  /**
   * Lists network sites. Add filters to your request to return a more specific list of results. Use filters to match the status of the network site.
   */
  listNetworkSites(params: PrivateNetworks.Types.ListNetworkSitesRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.ListNetworkSitesResponse) => void): Request<PrivateNetworks.Types.ListNetworkSitesResponse, AWSError>;
  /**
   * Lists network sites. Add filters to your request to return a more specific list of results. Use filters to match the status of the network site.
   */
  listNetworkSites(callback?: (err: AWSError, data: PrivateNetworks.Types.ListNetworkSitesResponse) => void): Request<PrivateNetworks.Types.ListNetworkSitesResponse, AWSError>;
  /**
   * Lists networks. Add filters to your request to return a more specific list of results. Use filters to match the status of the network.
   */
  listNetworks(params: PrivateNetworks.Types.ListNetworksRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.ListNetworksResponse) => void): Request<PrivateNetworks.Types.ListNetworksResponse, AWSError>;
  /**
   * Lists networks. Add filters to your request to return a more specific list of results. Use filters to match the status of the network.
   */
  listNetworks(callback?: (err: AWSError, data: PrivateNetworks.Types.ListNetworksResponse) => void): Request<PrivateNetworks.Types.ListNetworksResponse, AWSError>;
  /**
   * Lists orders. Add filters to your request to return a more specific list of results. Use filters to match the Amazon Resource Name (ARN) of the network site or the status of the order. If you specify multiple filters, filters are joined with an OR, and the request returns results that match all of the specified filters.
   */
  listOrders(params: PrivateNetworks.Types.ListOrdersRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.ListOrdersResponse) => void): Request<PrivateNetworks.Types.ListOrdersResponse, AWSError>;
  /**
   * Lists orders. Add filters to your request to return a more specific list of results. Use filters to match the Amazon Resource Name (ARN) of the network site or the status of the order. If you specify multiple filters, filters are joined with an OR, and the request returns results that match all of the specified filters.
   */
  listOrders(callback?: (err: AWSError, data: PrivateNetworks.Types.ListOrdersResponse) => void): Request<PrivateNetworks.Types.ListOrdersResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(params: PrivateNetworks.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.ListTagsForResourceResponse) => void): Request<PrivateNetworks.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: PrivateNetworks.Types.ListTagsForResourceResponse) => void): Request<PrivateNetworks.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Checks the health of the service.
   */
  ping(callback?: (err: AWSError, data: PrivateNetworks.Types.PingResponse) => void): Request<PrivateNetworks.Types.PingResponse, AWSError>;
  /**
   * Use this action to do the following tasks:   Update the duration and renewal status of the commitment period for a radio unit. The update goes into effect immediately.   Request a replacement for a network resource.   Request that you return a network resource.   After you submit a request to replace or return a network resource, the status of the network resource changes to CREATING_SHIPPING_LABEL. The shipping label is available when the status of the network resource is PENDING_RETURN. After the network resource is successfully returned, its status changes to DELETED. For more information, see Return a radio unit.
   */
  startNetworkResourceUpdate(params: PrivateNetworks.Types.StartNetworkResourceUpdateRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.StartNetworkResourceUpdateResponse) => void): Request<PrivateNetworks.Types.StartNetworkResourceUpdateResponse, AWSError>;
  /**
   * Use this action to do the following tasks:   Update the duration and renewal status of the commitment period for a radio unit. The update goes into effect immediately.   Request a replacement for a network resource.   Request that you return a network resource.   After you submit a request to replace or return a network resource, the status of the network resource changes to CREATING_SHIPPING_LABEL. The shipping label is available when the status of the network resource is PENDING_RETURN. After the network resource is successfully returned, its status changes to DELETED. For more information, see Return a radio unit.
   */
  startNetworkResourceUpdate(callback?: (err: AWSError, data: PrivateNetworks.Types.StartNetworkResourceUpdateResponse) => void): Request<PrivateNetworks.Types.StartNetworkResourceUpdateResponse, AWSError>;
  /**
   *  Adds tags to the specified resource. 
   */
  tagResource(params: PrivateNetworks.Types.TagResourceRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.TagResourceResponse) => void): Request<PrivateNetworks.Types.TagResourceResponse, AWSError>;
  /**
   *  Adds tags to the specified resource. 
   */
  tagResource(callback?: (err: AWSError, data: PrivateNetworks.Types.TagResourceResponse) => void): Request<PrivateNetworks.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from the specified resource.
   */
  untagResource(params: PrivateNetworks.Types.UntagResourceRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.UntagResourceResponse) => void): Request<PrivateNetworks.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: PrivateNetworks.Types.UntagResourceResponse) => void): Request<PrivateNetworks.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the specified network site.
   */
  updateNetworkSite(params: PrivateNetworks.Types.UpdateNetworkSiteRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.UpdateNetworkSiteResponse) => void): Request<PrivateNetworks.Types.UpdateNetworkSiteResponse, AWSError>;
  /**
   * Updates the specified network site.
   */
  updateNetworkSite(callback?: (err: AWSError, data: PrivateNetworks.Types.UpdateNetworkSiteResponse) => void): Request<PrivateNetworks.Types.UpdateNetworkSiteResponse, AWSError>;
  /**
   * Updates the specified network site plan.
   */
  updateNetworkSitePlan(params: PrivateNetworks.Types.UpdateNetworkSitePlanRequest, callback?: (err: AWSError, data: PrivateNetworks.Types.UpdateNetworkSiteResponse) => void): Request<PrivateNetworks.Types.UpdateNetworkSiteResponse, AWSError>;
  /**
   * Updates the specified network site plan.
   */
  updateNetworkSitePlan(callback?: (err: AWSError, data: PrivateNetworks.Types.UpdateNetworkSiteResponse) => void): Request<PrivateNetworks.Types.UpdateNetworkSiteResponse, AWSError>;
}
declare namespace PrivateNetworks {
  export interface AcknowledgeOrderReceiptRequest {
    /**
     * The Amazon Resource Name (ARN) of the order.
     */
    orderArn: Arn;
  }
  export interface AcknowledgeOrderReceiptResponse {
    /**
     * Information about the order.
     */
    order: Order;
  }
  export type AcknowledgmentStatus = "ACKNOWLEDGING"|"ACKNOWLEDGED"|"UNACKNOWLEDGED"|string;
  export interface ActivateDeviceIdentifierRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. For more information, see How to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the device identifier.
     */
    deviceIdentifierArn: Arn;
  }
  export interface ActivateDeviceIdentifierResponse {
    /**
     * Information about the device identifier.
     */
    deviceIdentifier: DeviceIdentifier;
    /**
     *  The tags on the device identifier. 
     */
    tags?: TagMap;
  }
  export interface ActivateNetworkSiteRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. For more information, see How to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * Determines the duration and renewal status of the commitment period for all pending radio units. If you include commitmentConfiguration in the ActivateNetworkSiteRequest action, you must specify the following:   The commitment period for the radio unit. You can choose a 60-day, 1-year, or 3-year period.   Whether you want your commitment period to automatically renew for one more year after your current commitment period expires.   For pricing, see Amazon Web Services Private 5G Pricing. If you do not include commitmentConfiguration in the ActivateNetworkSiteRequest action, the commitment period is set to 60-days.
     */
    commitmentConfiguration?: CommitmentConfiguration;
    /**
     * The Amazon Resource Name (ARN) of the network site.
     */
    networkSiteArn: Arn;
    /**
     * The shipping address of the network site.
     */
    shippingAddress: Address;
  }
  export interface ActivateNetworkSiteResponse {
    /**
     * Information about the network site.
     */
    networkSite?: NetworkSite;
  }
  export interface Address {
    /**
     * The city for this address.
     */
    city: AddressContent;
    /**
     * The company name for this address.
     */
    company?: AddressContent;
    /**
     * The country for this address.
     */
    country: AddressContent;
    /**
     * The recipient's email address.
     */
    emailAddress?: AddressContent;
    /**
     * The recipient's name for this address.
     */
    name: AddressContent;
    /**
     * The recipient's phone number.
     */
    phoneNumber?: AddressContent;
    /**
     * The postal code for this address.
     */
    postalCode: AddressContent;
    /**
     * The state or province for this address.
     */
    stateOrProvince: AddressContent;
    /**
     * The first line of the street address.
     */
    street1: AddressContent;
    /**
     * The second line of the street address.
     */
    street2?: AddressContent;
    /**
     * The third line of the street address.
     */
    street3?: AddressContent;
  }
  export type AddressContent = string;
  export type Arn = string;
  export type Boolean = boolean;
  export type ClientToken = string;
  export interface CommitmentConfiguration {
    /**
     * Determines whether the commitment period for a radio unit is set to automatically renew for an additional 1 year after your current commitment period expires. Set to True, if you want your commitment period to automatically renew. Set to False if you do not want your commitment to automatically renew. You can do the following:   Set a 1-year commitment to automatically renew for an additional 1 year. The hourly rate for the additional year will continue to be the same as your existing 1-year rate.   Set a 3-year commitment to automatically renew for an additional 1 year. The hourly rate for the additional year will continue to be the same as your existing 3-year rate.   Turn off a previously-enabled automatic renewal on a 1-year or 3-year commitment.   You cannot use the automatic-renewal option for a 60-day commitment.
     */
    automaticRenewal: Boolean;
    /**
     * The duration of the commitment period for the radio unit. You can choose a 60-day, 1-year, or 3-year period.
     */
    commitmentLength: CommitmentLength;
  }
  export interface CommitmentInformation {
    /**
     * The duration and renewal status of the commitment period for the radio unit.
     */
    commitmentConfiguration: CommitmentConfiguration;
    /**
     * The date and time that the commitment period ends. If you do not cancel or renew the commitment before the expiration date, you will be billed at the 60-day-commitment rate.
     */
    expiresOn?: Timestamp;
    /**
     * The date and time that the commitment period started.
     */
    startAt?: Timestamp;
  }
  export type CommitmentLength = "SIXTY_DAYS"|"ONE_YEAR"|"THREE_YEARS"|string;
  export interface ConfigureAccessPointRequest {
    /**
     * The Amazon Resource Name (ARN) of the network resource.
     */
    accessPointArn: Arn;
    /**
     * A Base64 encoded string of the CPI certificate associated with the CPI user who is certifying the coordinates of the network resource. 
     */
    cpiSecretKey?: ConfigureAccessPointRequestCpiSecretKeyString;
    /**
     * The CPI user ID of the CPI user who is certifying the coordinates of the network resource. 
     */
    cpiUserId?: ConfigureAccessPointRequestCpiUserIdString;
    /**
     * The CPI password associated with the CPI certificate in cpiSecretKey.
     */
    cpiUserPassword?: ConfigureAccessPointRequestCpiUserPasswordString;
    /**
     * The CPI user name of the CPI user who is certifying the coordinates of the radio unit.
     */
    cpiUsername?: ConfigureAccessPointRequestCpiUsernameString;
    /**
     * The position of the network resource.
     */
    position?: Position;
  }
  export type ConfigureAccessPointRequestCpiSecretKeyString = string;
  export type ConfigureAccessPointRequestCpiUserIdString = string;
  export type ConfigureAccessPointRequestCpiUserPasswordString = string;
  export type ConfigureAccessPointRequestCpiUsernameString = string;
  export interface ConfigureAccessPointResponse {
    /**
     * Information about the network resource.
     */
    accessPoint: NetworkResource;
  }
  export interface CreateNetworkRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. For more information, see How to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The description of the network.
     */
    description?: Description;
    /**
     * The name of the network. You can't change the name after you create the network.
     */
    networkName: Name;
    /**
     *  The tags to apply to the network. 
     */
    tags?: TagMap;
  }
  export interface CreateNetworkResponse {
    /**
     * Information about the network.
     */
    network: Network;
    /**
     *  The network tags. 
     */
    tags?: TagMap;
  }
  export interface CreateNetworkSiteRequest {
    /**
     * The Availability Zone that is the parent of this site. You can't change the Availability Zone after you create the site.
     */
    availabilityZone?: String;
    /**
     * The ID of the Availability Zone that is the parent of this site. You can't change the Availability Zone after you create the site.
     */
    availabilityZoneId?: String;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. For more information, see How to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The description of the site.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of the network.
     */
    networkArn: Arn;
    /**
     * The name of the site. You can't change the name after you create the site.
     */
    networkSiteName: Name;
    /**
     * Information about the pending plan for this site.
     */
    pendingPlan?: SitePlan;
    /**
     *  The tags to apply to the network site. 
     */
    tags?: TagMap;
  }
  export interface CreateNetworkSiteResponse {
    /**
     * Information about the network site.
     */
    networkSite?: NetworkSite;
    /**
     *  The network site tags. 
     */
    tags?: TagMap;
  }
  export interface DeactivateDeviceIdentifierRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. For more information, see How to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the device identifier.
     */
    deviceIdentifierArn: Arn;
  }
  export interface DeactivateDeviceIdentifierResponse {
    /**
     * Information about the device identifier.
     */
    deviceIdentifier: DeviceIdentifier;
  }
  export interface DeleteNetworkRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. For more information, see How to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the network.
     */
    networkArn: Arn;
  }
  export interface DeleteNetworkResponse {
    /**
     * Information about the network.
     */
    network: Network;
  }
  export interface DeleteNetworkSiteRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. For more information, see How to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the network site.
     */
    networkSiteArn: Arn;
  }
  export interface DeleteNetworkSiteResponse {
    /**
     * Information about the network site.
     */
    networkSite?: NetworkSite;
  }
  export type Description = string;
  export interface DeviceIdentifier {
    /**
     * The creation time of this device identifier.
     */
    createdAt?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the device identifier.
     */
    deviceIdentifierArn?: Arn;
    /**
     * The Integrated Circuit Card Identifier of the device identifier.
     */
    iccid?: String;
    /**
     * The International Mobile Subscriber Identity of the device identifier.
     */
    imsi?: DeviceIdentifierImsiString;
    /**
     * The Amazon Resource Name (ARN) of the network on which the device identifier appears.
     */
    networkArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the order used to purchase the device identifier.
     */
    orderArn?: String;
    /**
     * The status of the device identifier.
     */
    status?: DeviceIdentifierStatus;
    /**
     * The Amazon Resource Name (ARN) of the traffic group to which the device identifier belongs.
     */
    trafficGroupArn?: Arn;
    /**
     * The vendor of the device identifier.
     */
    vendor?: String;
  }
  export type DeviceIdentifierFilterKeys = "STATUS"|"ORDER"|"TRAFFIC_GROUP"|string;
  export type DeviceIdentifierFilterValues = String[];
  export type DeviceIdentifierFilters = {[key: string]: DeviceIdentifierFilterValues};
  export type DeviceIdentifierImsiString = string;
  export type DeviceIdentifierList = DeviceIdentifier[];
  export type DeviceIdentifierStatus = "ACTIVE"|"INACTIVE"|string;
  export type Double = number;
  export type ElevationReference = "AGL"|"AMSL"|string;
  export type ElevationUnit = "FEET"|string;
  export interface GetDeviceIdentifierRequest {
    /**
     * The Amazon Resource Name (ARN) of the device identifier.
     */
    deviceIdentifierArn: Arn;
  }
  export interface GetDeviceIdentifierResponse {
    /**
     * Information about the device identifier.
     */
    deviceIdentifier?: DeviceIdentifier;
    /**
     *  The device identifier tags. 
     */
    tags?: TagMap;
  }
  export interface GetNetworkRequest {
    /**
     * The Amazon Resource Name (ARN) of the network.
     */
    networkArn: Arn;
  }
  export interface GetNetworkResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the network resource.
     */
    networkResourceArn: Arn;
  }
  export interface GetNetworkResourceResponse {
    /**
     * Information about the network resource.
     */
    networkResource: NetworkResource;
    /**
     *  The network resource tags. 
     */
    tags?: TagMap;
  }
  export interface GetNetworkResponse {
    /**
     * Information about the network.
     */
    network: Network;
    /**
     *  The network tags. 
     */
    tags?: TagMap;
  }
  export interface GetNetworkSiteRequest {
    /**
     * The Amazon Resource Name (ARN) of the network site.
     */
    networkSiteArn: Arn;
  }
  export interface GetNetworkSiteResponse {
    /**
     * Information about the network site.
     */
    networkSite?: NetworkSite;
    /**
     *  The network site tags. 
     */
    tags?: TagMap;
  }
  export interface GetOrderRequest {
    /**
     * The Amazon Resource Name (ARN) of the order.
     */
    orderArn: Arn;
  }
  export interface GetOrderResponse {
    /**
     * Information about the order.
     */
    order: Order;
    /**
     *  The order tags. 
     */
    tags?: TagMap;
  }
  export type HealthStatus = "INITIAL"|"HEALTHY"|"UNHEALTHY"|string;
  export interface ListDeviceIdentifiersRequest {
    /**
     * The filters.    ORDER - The Amazon Resource Name (ARN) of the order.    STATUS - The status (ACTIVE | INACTIVE).    TRAFFIC_GROUP - The Amazon Resource Name (ARN) of the traffic group.   Filter values are case sensitive. If you specify multiple values for a filter, the values are joined with an OR, and the request returns all results that match any of the specified values.
     */
    filters?: DeviceIdentifierFilters;
    /**
     * The maximum number of results to return.
     */
    maxResults?: ListDeviceIdentifiersRequestMaxResultsInteger;
    /**
     * The Amazon Resource Name (ARN) of the network.
     */
    networkArn: Arn;
    /**
     * The token for the next page of results.
     */
    startToken?: PaginationToken;
  }
  export type ListDeviceIdentifiersRequestMaxResultsInteger = number;
  export interface ListDeviceIdentifiersResponse {
    /**
     * Information about the device identifiers.
     */
    deviceIdentifiers?: DeviceIdentifierList;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListNetworkResourcesRequest {
    /**
     * The filters.    ORDER - The Amazon Resource Name (ARN) of the order.    STATUS - The status (AVAILABLE | DELETED | DELETING | PENDING | PENDING_RETURN | PROVISIONING | SHIPPED).   Filter values are case sensitive. If you specify multiple values for a filter, the values are joined with an OR, and the request returns all results that match any of the specified values.
     */
    filters?: NetworkResourceFilters;
    /**
     * The maximum number of results to return.
     */
    maxResults?: ListNetworkResourcesRequestMaxResultsInteger;
    /**
     * The Amazon Resource Name (ARN) of the network.
     */
    networkArn: Arn;
    /**
     * The token for the next page of results.
     */
    startToken?: PaginationToken;
  }
  export type ListNetworkResourcesRequestMaxResultsInteger = number;
  export interface ListNetworkResourcesResponse {
    /**
     * Information about network resources.
     */
    networkResources?: NetworkResourceList;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListNetworkSitesRequest {
    /**
     * The filters. Add filters to your request to return a more specific list of results. Use filters to match the status of the network sites.    STATUS - The status (AVAILABLE | CREATED | DELETED | DEPROVISIONING | PROVISIONING).   Filter values are case sensitive. If you specify multiple values for a filter, the values are joined with an OR, and the request returns all results that match any of the specified values.
     */
    filters?: NetworkSiteFilters;
    /**
     * The maximum number of results to return.
     */
    maxResults?: ListNetworkSitesRequestMaxResultsInteger;
    /**
     * The Amazon Resource Name (ARN) of the network.
     */
    networkArn: Arn;
    /**
     * The token for the next page of results.
     */
    startToken?: PaginationToken;
  }
  export type ListNetworkSitesRequestMaxResultsInteger = number;
  export interface ListNetworkSitesResponse {
    /**
     * Information about the network sites.
     */
    networkSites?: NetworkSiteList;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListNetworksRequest {
    /**
     * The filters.    STATUS - The status (AVAILABLE | CREATED | DELETED | DEPROVISIONING | PROVISIONING).   Filter values are case sensitive. If you specify multiple values for a filter, the values are joined with an OR, and the request returns all results that match any of the specified values.
     */
    filters?: NetworkFilters;
    /**
     * The maximum number of results to return.
     */
    maxResults?: ListNetworksRequestMaxResultsInteger;
    /**
     * The token for the next page of results.
     */
    startToken?: PaginationToken;
  }
  export type ListNetworksRequestMaxResultsInteger = number;
  export interface ListNetworksResponse {
    /**
     * The networks.
     */
    networks?: NetworkList;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListOrdersRequest {
    /**
     * The filters.    NETWORK_SITE - The Amazon Resource Name (ARN) of the network site.    STATUS - The status (ACKNOWLEDGING | ACKNOWLEDGED | UNACKNOWLEDGED).   Filter values are case sensitive. If you specify multiple values for a filter, the values are joined with an OR, and the request returns all results that match any of the specified values.
     */
    filters?: OrderFilters;
    /**
     * The maximum number of results to return.
     */
    maxResults?: ListOrdersRequestMaxResultsInteger;
    /**
     * The Amazon Resource Name (ARN) of the network.
     */
    networkArn: Arn;
    /**
     * The token for the next page of results.
     */
    startToken?: PaginationToken;
  }
  export type ListOrdersRequestMaxResultsInteger = number;
  export interface ListOrdersResponse {
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * Information about the orders.
     */
    orders?: OrderList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The resource tags.
     */
    tags?: TagMap;
  }
  export type Name = string;
  export interface NameValuePair {
    /**
     * The name of the pair.
     */
    name: String;
    /**
     * The value of the pair.
     */
    value?: String;
  }
  export type NameValuePairs = NameValuePair[];
  export interface Network {
    /**
     * The creation time of the network.
     */
    createdAt?: Timestamp;
    /**
     * The description of the network.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of the network.
     */
    networkArn: Arn;
    /**
     * The name of the network.
     */
    networkName: Name;
    /**
     * The status of the network.
     */
    status: NetworkStatus;
    /**
     * The status reason of the network.
     */
    statusReason?: String;
  }
  export type NetworkFilterKeys = "STATUS"|string;
  export type NetworkFilterValues = String[];
  export type NetworkFilters = {[key: string]: NetworkFilterValues};
  export type NetworkList = Network[];
  export interface NetworkResource {
    /**
     * The attributes of the network resource.
     */
    attributes?: NameValuePairs;
    /**
     * Information about the commitment period for the radio unit. Shows the duration, the date and time that the contract started and ends, and the renewal status of the commitment period.
     */
    commitmentInformation?: CommitmentInformation;
    /**
     * The creation time of the network resource.
     */
    createdAt?: Timestamp;
    /**
     * The description of the network resource.
     */
    description?: Description;
    /**
     * The health of the network resource.
     */
    health?: HealthStatus;
    /**
     * The model of the network resource.
     */
    model?: String;
    /**
     * The Amazon Resource Name (ARN) of the network on which this network resource appears.
     */
    networkArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the network resource.
     */
    networkResourceArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the network site on which this network resource appears.
     */
    networkSiteArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the order used to purchase this network resource.
     */
    orderArn?: Arn;
    /**
     * The position of the network resource.
     */
    position?: Position;
    /**
     * Information about a request to return the network resource.
     */
    returnInformation?: ReturnInformation;
    /**
     * The serial number of the network resource.
     */
    serialNumber?: String;
    /**
     * The status of the network resource.
     */
    status?: NetworkResourceStatus;
    /**
     * The status reason of the network resource.
     */
    statusReason?: String;
    /**
     * The type of the network resource.
     */
    type?: NetworkResourceType;
    /**
     * The vendor of the network resource.
     */
    vendor?: String;
  }
  export interface NetworkResourceDefinition {
    /**
     * The count in the network resource definition.
     */
    count: NetworkResourceDefinitionCountInteger;
    /**
     * The options in the network resource definition.
     */
    options?: Options;
    /**
     * The type in the network resource definition.
     */
    type: NetworkResourceDefinitionType;
  }
  export type NetworkResourceDefinitionCountInteger = number;
  export type NetworkResourceDefinitionType = "RADIO_UNIT"|"DEVICE_IDENTIFIER"|string;
  export type NetworkResourceDefinitions = NetworkResourceDefinition[];
  export type NetworkResourceFilterKeys = "ORDER"|"STATUS"|string;
  export type NetworkResourceFilterValues = String[];
  export type NetworkResourceFilters = {[key: string]: NetworkResourceFilterValues};
  export type NetworkResourceList = NetworkResource[];
  export type NetworkResourceStatus = "PENDING"|"SHIPPED"|"PROVISIONING"|"PROVISIONED"|"AVAILABLE"|"DELETING"|"PENDING_RETURN"|"DELETED"|"CREATING_SHIPPING_LABEL"|string;
  export type NetworkResourceType = "RADIO_UNIT"|string;
  export interface NetworkSite {
    /**
     *  The parent Availability Zone for the network site. 
     */
    availabilityZone?: String;
    /**
     *  The parent Availability Zone ID for the network site. 
     */
    availabilityZoneId?: String;
    /**
     * The creation time of the network site.
     */
    createdAt?: Timestamp;
    /**
     * The current plan of the network site.
     */
    currentPlan?: SitePlan;
    /**
     * The description of the network site.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of the network to which the network site belongs.
     */
    networkArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of the network site.
     */
    networkSiteArn: Arn;
    /**
     * The name of the network site.
     */
    networkSiteName: Name;
    /**
     * The pending plan of the network site.
     */
    pendingPlan?: SitePlan;
    /**
     * The status of the network site.
     */
    status: NetworkSiteStatus;
    /**
     * The status reason of the network site.
     */
    statusReason?: String;
  }
  export type NetworkSiteFilterKeys = "STATUS"|string;
  export type NetworkSiteFilterValues = String[];
  export type NetworkSiteFilters = {[key: string]: NetworkSiteFilterValues};
  export type NetworkSiteList = NetworkSite[];
  export type NetworkSiteStatus = "CREATED"|"PROVISIONING"|"AVAILABLE"|"DEPROVISIONING"|"DELETED"|string;
  export type NetworkStatus = "CREATED"|"PROVISIONING"|"AVAILABLE"|"DEPROVISIONING"|"DELETED"|string;
  export type Options = NameValuePair[];
  export interface Order {
    /**
     * The acknowledgement status of the order.
     */
    acknowledgmentStatus?: AcknowledgmentStatus;
    /**
     * The creation time of the order.
     */
    createdAt?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the network associated with this order.
     */
    networkArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the network site associated with this order.
     */
    networkSiteArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the order.
     */
    orderArn?: Arn;
    /**
     * A list of the network resources placed in the order.
     */
    orderedResources?: OrderedResourceDefinitions;
    /**
     * The shipping address of the order.
     */
    shippingAddress?: Address;
    /**
     * The tracking information of the order.
     */
    trackingInformation?: TrackingInformationList;
  }
  export type OrderFilterKeys = "STATUS"|"NETWORK_SITE"|string;
  export type OrderFilterValues = String[];
  export type OrderFilters = {[key: string]: OrderFilterValues};
  export type OrderList = Order[];
  export interface OrderedResourceDefinition {
    /**
     * The duration and renewal status of the commitment period for each radio unit in the order. Does not show details if the resource type is DEVICE_IDENTIFIER.
     */
    commitmentConfiguration?: CommitmentConfiguration;
    /**
     * The number of network resources in the order.
     */
    count: OrderedResourceDefinitionCountInteger;
    /**
     * The type of network resource in the order.
     */
    type: NetworkResourceDefinitionType;
  }
  export type OrderedResourceDefinitionCountInteger = number;
  export type OrderedResourceDefinitions = OrderedResourceDefinition[];
  export type PaginationToken = string;
  export interface PingResponse {
    /**
     * Information about the health of the service.
     */
    status?: String;
  }
  export interface Position {
    /**
     * The elevation of the equipment at this position.
     */
    elevation?: Double;
    /**
     * The reference point from which elevation is reported.
     */
    elevationReference?: ElevationReference;
    /**
     * The units used to measure the elevation of the position.
     */
    elevationUnit?: ElevationUnit;
    /**
     * The latitude of the position.
     */
    latitude?: Double;
    /**
     * The longitude of the position.
     */
    longitude?: Double;
  }
  export interface ReturnInformation {
    /**
     * The Amazon Resource Name (ARN) of the replacement order.
     */
    replacementOrderArn?: Arn;
    /**
     * The reason for the return. If the return request did not include a reason for the return, this value is null.
     */
    returnReason?: String;
    /**
     * The shipping address.
     */
    shippingAddress?: Address;
    /**
     * The URL of the shipping label. The shipping label is available for download only if the status of the network resource is PENDING_RETURN. For more information, see Return a radio unit.
     */
    shippingLabel?: String;
  }
  export interface SitePlan {
    /**
     * The options of the plan.
     */
    options?: Options;
    /**
     * The resource definitions of the plan.
     */
    resourceDefinitions?: NetworkResourceDefinitions;
  }
  export interface StartNetworkResourceUpdateRequest {
    /**
     * Use this action to extend and automatically renew the commitment period for the radio unit. You can do the following:   Change a 60-day commitment to a 1-year or 3-year commitment. The change is immediate and the hourly rate decreases to the rate for the new commitment period.   Change a 1-year commitment to a 3-year commitment. The change is immediate and the hourly rate decreases to the rate for the 3-year commitment period.   Set a 1-year commitment to automatically renew for an additional 1 year. The hourly rate for the additional year will continue to be the same as your existing 1-year rate.   Set a 3-year commitment to automatically renew for an additional 1 year. The hourly rate for the additional year will continue to be the same as your existing 3-year rate.   Turn off a previously-enabled automatic renewal on a 1-year or 3-year commitment. You cannot use the automatic-renewal option for a 60-day commitment.   For pricing, see Amazon Web Services Private 5G Pricing.
     */
    commitmentConfiguration?: CommitmentConfiguration;
    /**
     * The Amazon Resource Name (ARN) of the network resource.
     */
    networkResourceArn: Arn;
    /**
     * The reason for the return. Providing a reason for a return is optional.
     */
    returnReason?: StartNetworkResourceUpdateRequestReturnReasonString;
    /**
     * The shipping address. If you don't provide a shipping address when replacing or returning a network resource, we use the address from the original order for the network resource.
     */
    shippingAddress?: Address;
    /**
     * The update type.    REPLACE - Submits a request to replace a defective radio unit. We provide a shipping label that you can use for the return process and we ship a replacement radio unit to you.    RETURN - Submits a request to return a radio unit that you no longer need. We provide a shipping label that you can use for the return process.    COMMITMENT - Submits a request to change or renew the commitment period. If you choose this value, then you must set  commitmentConfiguration .  
     */
    updateType: UpdateType;
  }
  export type StartNetworkResourceUpdateRequestReturnReasonString = string;
  export interface StartNetworkResourceUpdateResponse {
    /**
     * The network resource.
     */
    networkResource?: NetworkResource;
  }
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the resource. 
     */
    resourceArn: Arn;
    /**
     * The tags to add to the resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export interface TrackingInformation {
    /**
     * The tracking number of the shipment.
     */
    trackingNumber?: String;
  }
  export type TrackingInformationList = TrackingInformation[];
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
  export interface UpdateNetworkSitePlanRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. For more information, see How to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the network site.
     */
    networkSiteArn: Arn;
    /**
     * The pending plan.
     */
    pendingPlan: SitePlan;
  }
  export interface UpdateNetworkSiteRequest {
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request. For more information, see How to ensure idempotency.
     */
    clientToken?: ClientToken;
    /**
     * The description.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of the network site.
     */
    networkSiteArn: Arn;
  }
  export interface UpdateNetworkSiteResponse {
    /**
     * Information about the network site.
     */
    networkSite?: NetworkSite;
    /**
     *  The network site tags. 
     */
    tags?: TagMap;
  }
  export type UpdateType = "REPLACE"|"RETURN"|"COMMITMENT"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-12-03"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the PrivateNetworks client.
   */
  export import Types = PrivateNetworks;
}
export = PrivateNetworks;
