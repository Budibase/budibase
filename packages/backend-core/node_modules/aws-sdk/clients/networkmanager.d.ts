import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class NetworkManager extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: NetworkManager.Types.ClientConfiguration)
  config: Config & NetworkManager.Types.ClientConfiguration;
  /**
   * Associates a customer gateway with a device and optionally, with a link. If you specify a link, it must be associated with the specified device.  You can only associate customer gateways that are connected to a VPN attachment on a transit gateway. The transit gateway must be registered in your global network. When you register a transit gateway, customer gateways that are connected to the transit gateway are automatically included in the global network. To list customer gateways that are connected to a transit gateway, use the DescribeVpnConnections EC2 API and filter by transit-gateway-id. You cannot associate a customer gateway with more than one device and link. 
   */
  associateCustomerGateway(params: NetworkManager.Types.AssociateCustomerGatewayRequest, callback?: (err: AWSError, data: NetworkManager.Types.AssociateCustomerGatewayResponse) => void): Request<NetworkManager.Types.AssociateCustomerGatewayResponse, AWSError>;
  /**
   * Associates a customer gateway with a device and optionally, with a link. If you specify a link, it must be associated with the specified device.  You can only associate customer gateways that are connected to a VPN attachment on a transit gateway. The transit gateway must be registered in your global network. When you register a transit gateway, customer gateways that are connected to the transit gateway are automatically included in the global network. To list customer gateways that are connected to a transit gateway, use the DescribeVpnConnections EC2 API and filter by transit-gateway-id. You cannot associate a customer gateway with more than one device and link. 
   */
  associateCustomerGateway(callback?: (err: AWSError, data: NetworkManager.Types.AssociateCustomerGatewayResponse) => void): Request<NetworkManager.Types.AssociateCustomerGatewayResponse, AWSError>;
  /**
   * Associates a link to a device. A device can be associated to multiple links and a link can be associated to multiple devices. The device and link must be in the same global network and the same site.
   */
  associateLink(params: NetworkManager.Types.AssociateLinkRequest, callback?: (err: AWSError, data: NetworkManager.Types.AssociateLinkResponse) => void): Request<NetworkManager.Types.AssociateLinkResponse, AWSError>;
  /**
   * Associates a link to a device. A device can be associated to multiple links and a link can be associated to multiple devices. The device and link must be in the same global network and the same site.
   */
  associateLink(callback?: (err: AWSError, data: NetworkManager.Types.AssociateLinkResponse) => void): Request<NetworkManager.Types.AssociateLinkResponse, AWSError>;
  /**
   * Associates a transit gateway Connect peer with a device, and optionally, with a link. If you specify a link, it must be associated with the specified device.  You can only associate transit gateway Connect peers that have been created on a transit gateway that's registered in your global network. You cannot associate a transit gateway Connect peer with more than one device and link. 
   */
  associateTransitGatewayConnectPeer(params: NetworkManager.Types.AssociateTransitGatewayConnectPeerRequest, callback?: (err: AWSError, data: NetworkManager.Types.AssociateTransitGatewayConnectPeerResponse) => void): Request<NetworkManager.Types.AssociateTransitGatewayConnectPeerResponse, AWSError>;
  /**
   * Associates a transit gateway Connect peer with a device, and optionally, with a link. If you specify a link, it must be associated with the specified device.  You can only associate transit gateway Connect peers that have been created on a transit gateway that's registered in your global network. You cannot associate a transit gateway Connect peer with more than one device and link. 
   */
  associateTransitGatewayConnectPeer(callback?: (err: AWSError, data: NetworkManager.Types.AssociateTransitGatewayConnectPeerResponse) => void): Request<NetworkManager.Types.AssociateTransitGatewayConnectPeerResponse, AWSError>;
  /**
   * Creates a connection between two devices. The devices can be a physical or virtual appliance that connects to a third-party appliance in a VPC, or a physical appliance that connects to another physical appliance in an on-premises network.
   */
  createConnection(params: NetworkManager.Types.CreateConnectionRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateConnectionResponse) => void): Request<NetworkManager.Types.CreateConnectionResponse, AWSError>;
  /**
   * Creates a connection between two devices. The devices can be a physical or virtual appliance that connects to a third-party appliance in a VPC, or a physical appliance that connects to another physical appliance in an on-premises network.
   */
  createConnection(callback?: (err: AWSError, data: NetworkManager.Types.CreateConnectionResponse) => void): Request<NetworkManager.Types.CreateConnectionResponse, AWSError>;
  /**
   * Creates a new device in a global network. If you specify both a site ID and a location, the location of the site is used for visualization in the Network Manager console.
   */
  createDevice(params: NetworkManager.Types.CreateDeviceRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateDeviceResponse) => void): Request<NetworkManager.Types.CreateDeviceResponse, AWSError>;
  /**
   * Creates a new device in a global network. If you specify both a site ID and a location, the location of the site is used for visualization in the Network Manager console.
   */
  createDevice(callback?: (err: AWSError, data: NetworkManager.Types.CreateDeviceResponse) => void): Request<NetworkManager.Types.CreateDeviceResponse, AWSError>;
  /**
   * Creates a new, empty global network.
   */
  createGlobalNetwork(params: NetworkManager.Types.CreateGlobalNetworkRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateGlobalNetworkResponse) => void): Request<NetworkManager.Types.CreateGlobalNetworkResponse, AWSError>;
  /**
   * Creates a new, empty global network.
   */
  createGlobalNetwork(callback?: (err: AWSError, data: NetworkManager.Types.CreateGlobalNetworkResponse) => void): Request<NetworkManager.Types.CreateGlobalNetworkResponse, AWSError>;
  /**
   * Creates a new link for a specified site.
   */
  createLink(params: NetworkManager.Types.CreateLinkRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateLinkResponse) => void): Request<NetworkManager.Types.CreateLinkResponse, AWSError>;
  /**
   * Creates a new link for a specified site.
   */
  createLink(callback?: (err: AWSError, data: NetworkManager.Types.CreateLinkResponse) => void): Request<NetworkManager.Types.CreateLinkResponse, AWSError>;
  /**
   * Creates a new site in a global network.
   */
  createSite(params: NetworkManager.Types.CreateSiteRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateSiteResponse) => void): Request<NetworkManager.Types.CreateSiteResponse, AWSError>;
  /**
   * Creates a new site in a global network.
   */
  createSite(callback?: (err: AWSError, data: NetworkManager.Types.CreateSiteResponse) => void): Request<NetworkManager.Types.CreateSiteResponse, AWSError>;
  /**
   * Deletes the specified connection in your global network.
   */
  deleteConnection(params: NetworkManager.Types.DeleteConnectionRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteConnectionResponse) => void): Request<NetworkManager.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Deletes the specified connection in your global network.
   */
  deleteConnection(callback?: (err: AWSError, data: NetworkManager.Types.DeleteConnectionResponse) => void): Request<NetworkManager.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Deletes an existing device. You must first disassociate the device from any links and customer gateways.
   */
  deleteDevice(params: NetworkManager.Types.DeleteDeviceRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteDeviceResponse) => void): Request<NetworkManager.Types.DeleteDeviceResponse, AWSError>;
  /**
   * Deletes an existing device. You must first disassociate the device from any links and customer gateways.
   */
  deleteDevice(callback?: (err: AWSError, data: NetworkManager.Types.DeleteDeviceResponse) => void): Request<NetworkManager.Types.DeleteDeviceResponse, AWSError>;
  /**
   * Deletes an existing global network. You must first delete all global network objects (devices, links, and sites) and deregister all transit gateways.
   */
  deleteGlobalNetwork(params: NetworkManager.Types.DeleteGlobalNetworkRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteGlobalNetworkResponse) => void): Request<NetworkManager.Types.DeleteGlobalNetworkResponse, AWSError>;
  /**
   * Deletes an existing global network. You must first delete all global network objects (devices, links, and sites) and deregister all transit gateways.
   */
  deleteGlobalNetwork(callback?: (err: AWSError, data: NetworkManager.Types.DeleteGlobalNetworkResponse) => void): Request<NetworkManager.Types.DeleteGlobalNetworkResponse, AWSError>;
  /**
   * Deletes an existing link. You must first disassociate the link from any devices and customer gateways.
   */
  deleteLink(params: NetworkManager.Types.DeleteLinkRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteLinkResponse) => void): Request<NetworkManager.Types.DeleteLinkResponse, AWSError>;
  /**
   * Deletes an existing link. You must first disassociate the link from any devices and customer gateways.
   */
  deleteLink(callback?: (err: AWSError, data: NetworkManager.Types.DeleteLinkResponse) => void): Request<NetworkManager.Types.DeleteLinkResponse, AWSError>;
  /**
   * Deletes an existing site. The site cannot be associated with any device or link.
   */
  deleteSite(params: NetworkManager.Types.DeleteSiteRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteSiteResponse) => void): Request<NetworkManager.Types.DeleteSiteResponse, AWSError>;
  /**
   * Deletes an existing site. The site cannot be associated with any device or link.
   */
  deleteSite(callback?: (err: AWSError, data: NetworkManager.Types.DeleteSiteResponse) => void): Request<NetworkManager.Types.DeleteSiteResponse, AWSError>;
  /**
   * Deregisters a transit gateway from your global network. This action does not delete your transit gateway, or modify any of its attachments. This action removes any customer gateway associations.
   */
  deregisterTransitGateway(params: NetworkManager.Types.DeregisterTransitGatewayRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeregisterTransitGatewayResponse) => void): Request<NetworkManager.Types.DeregisterTransitGatewayResponse, AWSError>;
  /**
   * Deregisters a transit gateway from your global network. This action does not delete your transit gateway, or modify any of its attachments. This action removes any customer gateway associations.
   */
  deregisterTransitGateway(callback?: (err: AWSError, data: NetworkManager.Types.DeregisterTransitGatewayResponse) => void): Request<NetworkManager.Types.DeregisterTransitGatewayResponse, AWSError>;
  /**
   * Describes one or more global networks. By default, all global networks are described. To describe the objects in your global network, you must use the appropriate Get* action. For example, to list the transit gateways in your global network, use GetTransitGatewayRegistrations.
   */
  describeGlobalNetworks(params: NetworkManager.Types.DescribeGlobalNetworksRequest, callback?: (err: AWSError, data: NetworkManager.Types.DescribeGlobalNetworksResponse) => void): Request<NetworkManager.Types.DescribeGlobalNetworksResponse, AWSError>;
  /**
   * Describes one or more global networks. By default, all global networks are described. To describe the objects in your global network, you must use the appropriate Get* action. For example, to list the transit gateways in your global network, use GetTransitGatewayRegistrations.
   */
  describeGlobalNetworks(callback?: (err: AWSError, data: NetworkManager.Types.DescribeGlobalNetworksResponse) => void): Request<NetworkManager.Types.DescribeGlobalNetworksResponse, AWSError>;
  /**
   * Disassociates a customer gateway from a device and a link.
   */
  disassociateCustomerGateway(params: NetworkManager.Types.DisassociateCustomerGatewayRequest, callback?: (err: AWSError, data: NetworkManager.Types.DisassociateCustomerGatewayResponse) => void): Request<NetworkManager.Types.DisassociateCustomerGatewayResponse, AWSError>;
  /**
   * Disassociates a customer gateway from a device and a link.
   */
  disassociateCustomerGateway(callback?: (err: AWSError, data: NetworkManager.Types.DisassociateCustomerGatewayResponse) => void): Request<NetworkManager.Types.DisassociateCustomerGatewayResponse, AWSError>;
  /**
   * Disassociates an existing device from a link. You must first disassociate any customer gateways that are associated with the link.
   */
  disassociateLink(params: NetworkManager.Types.DisassociateLinkRequest, callback?: (err: AWSError, data: NetworkManager.Types.DisassociateLinkResponse) => void): Request<NetworkManager.Types.DisassociateLinkResponse, AWSError>;
  /**
   * Disassociates an existing device from a link. You must first disassociate any customer gateways that are associated with the link.
   */
  disassociateLink(callback?: (err: AWSError, data: NetworkManager.Types.DisassociateLinkResponse) => void): Request<NetworkManager.Types.DisassociateLinkResponse, AWSError>;
  /**
   * Disassociates a transit gateway Connect peer from a device and link.
   */
  disassociateTransitGatewayConnectPeer(params: NetworkManager.Types.DisassociateTransitGatewayConnectPeerRequest, callback?: (err: AWSError, data: NetworkManager.Types.DisassociateTransitGatewayConnectPeerResponse) => void): Request<NetworkManager.Types.DisassociateTransitGatewayConnectPeerResponse, AWSError>;
  /**
   * Disassociates a transit gateway Connect peer from a device and link.
   */
  disassociateTransitGatewayConnectPeer(callback?: (err: AWSError, data: NetworkManager.Types.DisassociateTransitGatewayConnectPeerResponse) => void): Request<NetworkManager.Types.DisassociateTransitGatewayConnectPeerResponse, AWSError>;
  /**
   * Gets information about one or more of your connections in a global network.
   */
  getConnections(params: NetworkManager.Types.GetConnectionsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetConnectionsResponse) => void): Request<NetworkManager.Types.GetConnectionsResponse, AWSError>;
  /**
   * Gets information about one or more of your connections in a global network.
   */
  getConnections(callback?: (err: AWSError, data: NetworkManager.Types.GetConnectionsResponse) => void): Request<NetworkManager.Types.GetConnectionsResponse, AWSError>;
  /**
   * Gets the association information for customer gateways that are associated with devices and links in your global network.
   */
  getCustomerGatewayAssociations(params: NetworkManager.Types.GetCustomerGatewayAssociationsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetCustomerGatewayAssociationsResponse) => void): Request<NetworkManager.Types.GetCustomerGatewayAssociationsResponse, AWSError>;
  /**
   * Gets the association information for customer gateways that are associated with devices and links in your global network.
   */
  getCustomerGatewayAssociations(callback?: (err: AWSError, data: NetworkManager.Types.GetCustomerGatewayAssociationsResponse) => void): Request<NetworkManager.Types.GetCustomerGatewayAssociationsResponse, AWSError>;
  /**
   * Gets information about one or more of your devices in a global network.
   */
  getDevices(params: NetworkManager.Types.GetDevicesRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetDevicesResponse) => void): Request<NetworkManager.Types.GetDevicesResponse, AWSError>;
  /**
   * Gets information about one or more of your devices in a global network.
   */
  getDevices(callback?: (err: AWSError, data: NetworkManager.Types.GetDevicesResponse) => void): Request<NetworkManager.Types.GetDevicesResponse, AWSError>;
  /**
   * Gets the link associations for a device or a link. Either the device ID or the link ID must be specified.
   */
  getLinkAssociations(params: NetworkManager.Types.GetLinkAssociationsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetLinkAssociationsResponse) => void): Request<NetworkManager.Types.GetLinkAssociationsResponse, AWSError>;
  /**
   * Gets the link associations for a device or a link. Either the device ID or the link ID must be specified.
   */
  getLinkAssociations(callback?: (err: AWSError, data: NetworkManager.Types.GetLinkAssociationsResponse) => void): Request<NetworkManager.Types.GetLinkAssociationsResponse, AWSError>;
  /**
   * Gets information about one or more links in a specified global network. If you specify the site ID, you cannot specify the type or provider in the same request. You can specify the type and provider in the same request.
   */
  getLinks(params: NetworkManager.Types.GetLinksRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetLinksResponse) => void): Request<NetworkManager.Types.GetLinksResponse, AWSError>;
  /**
   * Gets information about one or more links in a specified global network. If you specify the site ID, you cannot specify the type or provider in the same request. You can specify the type and provider in the same request.
   */
  getLinks(callback?: (err: AWSError, data: NetworkManager.Types.GetLinksResponse) => void): Request<NetworkManager.Types.GetLinksResponse, AWSError>;
  /**
   * Gets the count of network resources, by resource type, for the specified global network.
   */
  getNetworkResourceCounts(params: NetworkManager.Types.GetNetworkResourceCountsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetNetworkResourceCountsResponse) => void): Request<NetworkManager.Types.GetNetworkResourceCountsResponse, AWSError>;
  /**
   * Gets the count of network resources, by resource type, for the specified global network.
   */
  getNetworkResourceCounts(callback?: (err: AWSError, data: NetworkManager.Types.GetNetworkResourceCountsResponse) => void): Request<NetworkManager.Types.GetNetworkResourceCountsResponse, AWSError>;
  /**
   * Gets the network resource relationships for the specified global network.
   */
  getNetworkResourceRelationships(params: NetworkManager.Types.GetNetworkResourceRelationshipsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetNetworkResourceRelationshipsResponse) => void): Request<NetworkManager.Types.GetNetworkResourceRelationshipsResponse, AWSError>;
  /**
   * Gets the network resource relationships for the specified global network.
   */
  getNetworkResourceRelationships(callback?: (err: AWSError, data: NetworkManager.Types.GetNetworkResourceRelationshipsResponse) => void): Request<NetworkManager.Types.GetNetworkResourceRelationshipsResponse, AWSError>;
  /**
   * Describes the network resources for the specified global network. The results include information from the corresponding Describe call for the resource, minus any sensitive information such as pre-shared keys.
   */
  getNetworkResources(params: NetworkManager.Types.GetNetworkResourcesRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetNetworkResourcesResponse) => void): Request<NetworkManager.Types.GetNetworkResourcesResponse, AWSError>;
  /**
   * Describes the network resources for the specified global network. The results include information from the corresponding Describe call for the resource, minus any sensitive information such as pre-shared keys.
   */
  getNetworkResources(callback?: (err: AWSError, data: NetworkManager.Types.GetNetworkResourcesResponse) => void): Request<NetworkManager.Types.GetNetworkResourcesResponse, AWSError>;
  /**
   * Gets the network routes of the specified global network.
   */
  getNetworkRoutes(params: NetworkManager.Types.GetNetworkRoutesRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetNetworkRoutesResponse) => void): Request<NetworkManager.Types.GetNetworkRoutesResponse, AWSError>;
  /**
   * Gets the network routes of the specified global network.
   */
  getNetworkRoutes(callback?: (err: AWSError, data: NetworkManager.Types.GetNetworkRoutesResponse) => void): Request<NetworkManager.Types.GetNetworkRoutesResponse, AWSError>;
  /**
   * Gets the network telemetry of the specified global network.
   */
  getNetworkTelemetry(params: NetworkManager.Types.GetNetworkTelemetryRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetNetworkTelemetryResponse) => void): Request<NetworkManager.Types.GetNetworkTelemetryResponse, AWSError>;
  /**
   * Gets the network telemetry of the specified global network.
   */
  getNetworkTelemetry(callback?: (err: AWSError, data: NetworkManager.Types.GetNetworkTelemetryResponse) => void): Request<NetworkManager.Types.GetNetworkTelemetryResponse, AWSError>;
  /**
   * Gets information about the specified route analysis.
   */
  getRouteAnalysis(params: NetworkManager.Types.GetRouteAnalysisRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetRouteAnalysisResponse) => void): Request<NetworkManager.Types.GetRouteAnalysisResponse, AWSError>;
  /**
   * Gets information about the specified route analysis.
   */
  getRouteAnalysis(callback?: (err: AWSError, data: NetworkManager.Types.GetRouteAnalysisResponse) => void): Request<NetworkManager.Types.GetRouteAnalysisResponse, AWSError>;
  /**
   * Gets information about one or more of your sites in a global network.
   */
  getSites(params: NetworkManager.Types.GetSitesRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetSitesResponse) => void): Request<NetworkManager.Types.GetSitesResponse, AWSError>;
  /**
   * Gets information about one or more of your sites in a global network.
   */
  getSites(callback?: (err: AWSError, data: NetworkManager.Types.GetSitesResponse) => void): Request<NetworkManager.Types.GetSitesResponse, AWSError>;
  /**
   * Gets information about one or more of your transit gateway Connect peer associations in a global network.
   */
  getTransitGatewayConnectPeerAssociations(params: NetworkManager.Types.GetTransitGatewayConnectPeerAssociationsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetTransitGatewayConnectPeerAssociationsResponse) => void): Request<NetworkManager.Types.GetTransitGatewayConnectPeerAssociationsResponse, AWSError>;
  /**
   * Gets information about one or more of your transit gateway Connect peer associations in a global network.
   */
  getTransitGatewayConnectPeerAssociations(callback?: (err: AWSError, data: NetworkManager.Types.GetTransitGatewayConnectPeerAssociationsResponse) => void): Request<NetworkManager.Types.GetTransitGatewayConnectPeerAssociationsResponse, AWSError>;
  /**
   * Gets information about the transit gateway registrations in a specified global network.
   */
  getTransitGatewayRegistrations(params: NetworkManager.Types.GetTransitGatewayRegistrationsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetTransitGatewayRegistrationsResponse) => void): Request<NetworkManager.Types.GetTransitGatewayRegistrationsResponse, AWSError>;
  /**
   * Gets information about the transit gateway registrations in a specified global network.
   */
  getTransitGatewayRegistrations(callback?: (err: AWSError, data: NetworkManager.Types.GetTransitGatewayRegistrationsResponse) => void): Request<NetworkManager.Types.GetTransitGatewayRegistrationsResponse, AWSError>;
  /**
   * Lists the tags for a specified resource.
   */
  listTagsForResource(params: NetworkManager.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: NetworkManager.Types.ListTagsForResourceResponse) => void): Request<NetworkManager.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for a specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: NetworkManager.Types.ListTagsForResourceResponse) => void): Request<NetworkManager.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Registers a transit gateway in your global network. The transit gateway can be in any Amazon Web Services Region, but it must be owned by the same Amazon Web Services account that owns the global network. You cannot register a transit gateway in more than one global network.
   */
  registerTransitGateway(params: NetworkManager.Types.RegisterTransitGatewayRequest, callback?: (err: AWSError, data: NetworkManager.Types.RegisterTransitGatewayResponse) => void): Request<NetworkManager.Types.RegisterTransitGatewayResponse, AWSError>;
  /**
   * Registers a transit gateway in your global network. The transit gateway can be in any Amazon Web Services Region, but it must be owned by the same Amazon Web Services account that owns the global network. You cannot register a transit gateway in more than one global network.
   */
  registerTransitGateway(callback?: (err: AWSError, data: NetworkManager.Types.RegisterTransitGatewayResponse) => void): Request<NetworkManager.Types.RegisterTransitGatewayResponse, AWSError>;
  /**
   * Starts analyzing the routing path between the specified source and destination. For more information, see Route Analyzer.
   */
  startRouteAnalysis(params: NetworkManager.Types.StartRouteAnalysisRequest, callback?: (err: AWSError, data: NetworkManager.Types.StartRouteAnalysisResponse) => void): Request<NetworkManager.Types.StartRouteAnalysisResponse, AWSError>;
  /**
   * Starts analyzing the routing path between the specified source and destination. For more information, see Route Analyzer.
   */
  startRouteAnalysis(callback?: (err: AWSError, data: NetworkManager.Types.StartRouteAnalysisResponse) => void): Request<NetworkManager.Types.StartRouteAnalysisResponse, AWSError>;
  /**
   * Tags a specified resource.
   */
  tagResource(params: NetworkManager.Types.TagResourceRequest, callback?: (err: AWSError, data: NetworkManager.Types.TagResourceResponse) => void): Request<NetworkManager.Types.TagResourceResponse, AWSError>;
  /**
   * Tags a specified resource.
   */
  tagResource(callback?: (err: AWSError, data: NetworkManager.Types.TagResourceResponse) => void): Request<NetworkManager.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a specified resource.
   */
  untagResource(params: NetworkManager.Types.UntagResourceRequest, callback?: (err: AWSError, data: NetworkManager.Types.UntagResourceResponse) => void): Request<NetworkManager.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a specified resource.
   */
  untagResource(callback?: (err: AWSError, data: NetworkManager.Types.UntagResourceResponse) => void): Request<NetworkManager.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the information for an existing connection. To remove information for any of the parameters, specify an empty string.
   */
  updateConnection(params: NetworkManager.Types.UpdateConnectionRequest, callback?: (err: AWSError, data: NetworkManager.Types.UpdateConnectionResponse) => void): Request<NetworkManager.Types.UpdateConnectionResponse, AWSError>;
  /**
   * Updates the information for an existing connection. To remove information for any of the parameters, specify an empty string.
   */
  updateConnection(callback?: (err: AWSError, data: NetworkManager.Types.UpdateConnectionResponse) => void): Request<NetworkManager.Types.UpdateConnectionResponse, AWSError>;
  /**
   * Updates the details for an existing device. To remove information for any of the parameters, specify an empty string.
   */
  updateDevice(params: NetworkManager.Types.UpdateDeviceRequest, callback?: (err: AWSError, data: NetworkManager.Types.UpdateDeviceResponse) => void): Request<NetworkManager.Types.UpdateDeviceResponse, AWSError>;
  /**
   * Updates the details for an existing device. To remove information for any of the parameters, specify an empty string.
   */
  updateDevice(callback?: (err: AWSError, data: NetworkManager.Types.UpdateDeviceResponse) => void): Request<NetworkManager.Types.UpdateDeviceResponse, AWSError>;
  /**
   * Updates an existing global network. To remove information for any of the parameters, specify an empty string.
   */
  updateGlobalNetwork(params: NetworkManager.Types.UpdateGlobalNetworkRequest, callback?: (err: AWSError, data: NetworkManager.Types.UpdateGlobalNetworkResponse) => void): Request<NetworkManager.Types.UpdateGlobalNetworkResponse, AWSError>;
  /**
   * Updates an existing global network. To remove information for any of the parameters, specify an empty string.
   */
  updateGlobalNetwork(callback?: (err: AWSError, data: NetworkManager.Types.UpdateGlobalNetworkResponse) => void): Request<NetworkManager.Types.UpdateGlobalNetworkResponse, AWSError>;
  /**
   * Updates the details for an existing link. To remove information for any of the parameters, specify an empty string.
   */
  updateLink(params: NetworkManager.Types.UpdateLinkRequest, callback?: (err: AWSError, data: NetworkManager.Types.UpdateLinkResponse) => void): Request<NetworkManager.Types.UpdateLinkResponse, AWSError>;
  /**
   * Updates the details for an existing link. To remove information for any of the parameters, specify an empty string.
   */
  updateLink(callback?: (err: AWSError, data: NetworkManager.Types.UpdateLinkResponse) => void): Request<NetworkManager.Types.UpdateLinkResponse, AWSError>;
  /**
   * Updates the resource metadata for the specified global network.
   */
  updateNetworkResourceMetadata(params: NetworkManager.Types.UpdateNetworkResourceMetadataRequest, callback?: (err: AWSError, data: NetworkManager.Types.UpdateNetworkResourceMetadataResponse) => void): Request<NetworkManager.Types.UpdateNetworkResourceMetadataResponse, AWSError>;
  /**
   * Updates the resource metadata for the specified global network.
   */
  updateNetworkResourceMetadata(callback?: (err: AWSError, data: NetworkManager.Types.UpdateNetworkResourceMetadataResponse) => void): Request<NetworkManager.Types.UpdateNetworkResourceMetadataResponse, AWSError>;
  /**
   * Updates the information for an existing site. To remove information for any of the parameters, specify an empty string.
   */
  updateSite(params: NetworkManager.Types.UpdateSiteRequest, callback?: (err: AWSError, data: NetworkManager.Types.UpdateSiteResponse) => void): Request<NetworkManager.Types.UpdateSiteResponse, AWSError>;
  /**
   * Updates the information for an existing site. To remove information for any of the parameters, specify an empty string.
   */
  updateSite(callback?: (err: AWSError, data: NetworkManager.Types.UpdateSiteResponse) => void): Request<NetworkManager.Types.UpdateSiteResponse, AWSError>;
}
declare namespace NetworkManager {
  export interface AWSLocation {
    /**
     * The Zone that the device is located in. Specify the ID of an Availability Zone, Local Zone, Wavelength Zone, or an Outpost.
     */
    Zone?: String;
    /**
     * The Amazon Resource Name (ARN) of the subnet that the device is located in.
     */
    SubnetArn?: String;
  }
  export interface AssociateCustomerGatewayRequest {
    /**
     * The Amazon Resource Name (ARN) of the customer gateway.
     */
    CustomerGatewayArn: String;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the device.
     */
    DeviceId: String;
    /**
     * The ID of the link.
     */
    LinkId?: String;
  }
  export interface AssociateCustomerGatewayResponse {
    /**
     * The customer gateway association.
     */
    CustomerGatewayAssociation?: CustomerGatewayAssociation;
  }
  export interface AssociateLinkRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the device.
     */
    DeviceId: String;
    /**
     * The ID of the link.
     */
    LinkId: String;
  }
  export interface AssociateLinkResponse {
    /**
     * The link association.
     */
    LinkAssociation?: LinkAssociation;
  }
  export interface AssociateTransitGatewayConnectPeerRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The Amazon Resource Name (ARN) of the Connect peer.
     */
    TransitGatewayConnectPeerArn: String;
    /**
     * The ID of the device.
     */
    DeviceId: String;
    /**
     * The ID of the link.
     */
    LinkId?: String;
  }
  export interface AssociateTransitGatewayConnectPeerResponse {
    /**
     * The transit gateway Connect peer association.
     */
    TransitGatewayConnectPeerAssociation?: TransitGatewayConnectPeerAssociation;
  }
  export interface Bandwidth {
    /**
     * Upload speed in Mbps.
     */
    UploadSpeed?: Integer;
    /**
     * Download speed in Mbps.
     */
    DownloadSpeed?: Integer;
  }
  export type Boolean = boolean;
  export interface Connection {
    /**
     * The ID of the connection.
     */
    ConnectionId?: String;
    /**
     * The Amazon Resource Name (ARN) of the connection.
     */
    ConnectionArn?: String;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: String;
    /**
     * The ID of the first device in the connection.
     */
    DeviceId?: String;
    /**
     * The ID of the second device in the connection.
     */
    ConnectedDeviceId?: String;
    /**
     * The ID of the link for the first device in the connection.
     */
    LinkId?: String;
    /**
     * The ID of the link for the second device in the connection.
     */
    ConnectedLinkId?: String;
    /**
     * The description of the connection.
     */
    Description?: String;
    /**
     * The date and time that the connection was created.
     */
    CreatedAt?: DateTime;
    /**
     * The state of the connection.
     */
    State?: ConnectionState;
    /**
     * The tags for the connection.
     */
    Tags?: TagList;
  }
  export interface ConnectionHealth {
    /**
     * The connection type.
     */
    Type?: ConnectionType;
    /**
     * The connection status.
     */
    Status?: ConnectionStatus;
    /**
     * The time the status was last updated.
     */
    Timestamp?: DateTime;
  }
  export type ConnectionList = Connection[];
  export type ConnectionState = "PENDING"|"AVAILABLE"|"DELETING"|"UPDATING"|string;
  export type ConnectionStatus = "UP"|"DOWN"|string;
  export type ConnectionType = "BGP"|"IPSEC"|string;
  export interface CreateConnectionRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the first device in the connection.
     */
    DeviceId: String;
    /**
     * The ID of the second device in the connection.
     */
    ConnectedDeviceId: String;
    /**
     * The ID of the link for the first device.
     */
    LinkId?: String;
    /**
     * The ID of the link for the second device.
     */
    ConnectedLinkId?: String;
    /**
     * A description of the connection. Length Constraints: Maximum length of 256 characters.
     */
    Description?: String;
    /**
     * The tags to apply to the resource during creation.
     */
    Tags?: TagList;
  }
  export interface CreateConnectionResponse {
    /**
     * Information about the connection.
     */
    Connection?: Connection;
  }
  export interface CreateDeviceRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The Amazon Web Services location of the device, if applicable. For an on-premises device, you can omit this parameter.
     */
    AWSLocation?: AWSLocation;
    /**
     * A description of the device. Constraints: Maximum length of 256 characters.
     */
    Description?: String;
    /**
     * The type of the device.
     */
    Type?: String;
    /**
     * The vendor of the device. Constraints: Maximum length of 128 characters.
     */
    Vendor?: String;
    /**
     * The model of the device. Constraints: Maximum length of 128 characters.
     */
    Model?: String;
    /**
     * The serial number of the device. Constraints: Maximum length of 128 characters.
     */
    SerialNumber?: String;
    /**
     * The location of the device.
     */
    Location?: Location;
    /**
     * The ID of the site.
     */
    SiteId?: String;
    /**
     * The tags to apply to the resource during creation.
     */
    Tags?: TagList;
  }
  export interface CreateDeviceResponse {
    /**
     * Information about the device.
     */
    Device?: Device;
  }
  export interface CreateGlobalNetworkRequest {
    /**
     * A description of the global network. Constraints: Maximum length of 256 characters.
     */
    Description?: String;
    /**
     * The tags to apply to the resource during creation.
     */
    Tags?: TagList;
  }
  export interface CreateGlobalNetworkResponse {
    /**
     * Information about the global network object.
     */
    GlobalNetwork?: GlobalNetwork;
  }
  export interface CreateLinkRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * A description of the link. Constraints: Maximum length of 256 characters.
     */
    Description?: String;
    /**
     * The type of the link. Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
     */
    Type?: String;
    /**
     *  The upload speed and download speed in Mbps. 
     */
    Bandwidth: Bandwidth;
    /**
     * The provider of the link. Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
     */
    Provider?: String;
    /**
     * The ID of the site.
     */
    SiteId: String;
    /**
     * The tags to apply to the resource during creation.
     */
    Tags?: TagList;
  }
  export interface CreateLinkResponse {
    /**
     * Information about the link.
     */
    Link?: Link;
  }
  export interface CreateSiteRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * A description of your site. Constraints: Maximum length of 256 characters.
     */
    Description?: String;
    /**
     * The site location. This information is used for visualization in the Network Manager console. If you specify the address, the latitude and longitude are automatically calculated.    Address: The physical address of the site.    Latitude: The latitude of the site.     Longitude: The longitude of the site.  
     */
    Location?: Location;
    /**
     * The tags to apply to the resource during creation.
     */
    Tags?: TagList;
  }
  export interface CreateSiteResponse {
    /**
     * Information about the site.
     */
    Site?: Site;
  }
  export interface CustomerGatewayAssociation {
    /**
     * The Amazon Resource Name (ARN) of the customer gateway.
     */
    CustomerGatewayArn?: String;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: String;
    /**
     * The ID of the device.
     */
    DeviceId?: String;
    /**
     * The ID of the link.
     */
    LinkId?: String;
    /**
     * The association state.
     */
    State?: CustomerGatewayAssociationState;
  }
  export type CustomerGatewayAssociationList = CustomerGatewayAssociation[];
  export type CustomerGatewayAssociationState = "PENDING"|"AVAILABLE"|"DELETING"|"DELETED"|string;
  export type DateTime = Date;
  export interface DeleteConnectionRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the connection.
     */
    ConnectionId: String;
  }
  export interface DeleteConnectionResponse {
    /**
     * Information about the connection.
     */
    Connection?: Connection;
  }
  export interface DeleteDeviceRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the device.
     */
    DeviceId: String;
  }
  export interface DeleteDeviceResponse {
    /**
     * Information about the device.
     */
    Device?: Device;
  }
  export interface DeleteGlobalNetworkRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
  }
  export interface DeleteGlobalNetworkResponse {
    /**
     * Information about the global network.
     */
    GlobalNetwork?: GlobalNetwork;
  }
  export interface DeleteLinkRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the link.
     */
    LinkId: String;
  }
  export interface DeleteLinkResponse {
    /**
     * Information about the link.
     */
    Link?: Link;
  }
  export interface DeleteSiteRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the site.
     */
    SiteId: String;
  }
  export interface DeleteSiteResponse {
    /**
     * Information about the site.
     */
    Site?: Site;
  }
  export interface DeregisterTransitGatewayRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The Amazon Resource Name (ARN) of the transit gateway.
     */
    TransitGatewayArn: String;
  }
  export interface DeregisterTransitGatewayResponse {
    /**
     * The transit gateway registration information.
     */
    TransitGatewayRegistration?: TransitGatewayRegistration;
  }
  export interface DescribeGlobalNetworksRequest {
    /**
     * The IDs of one or more global networks. The maximum is 10.
     */
    GlobalNetworkIds?: StringList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface DescribeGlobalNetworksResponse {
    /**
     * Information about the global networks.
     */
    GlobalNetworks?: GlobalNetworkList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface Device {
    /**
     * The ID of the device.
     */
    DeviceId?: String;
    /**
     * The Amazon Resource Name (ARN) of the device.
     */
    DeviceArn?: String;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: String;
    /**
     * The Amazon Web Services location of the device.
     */
    AWSLocation?: AWSLocation;
    /**
     * The description of the device.
     */
    Description?: String;
    /**
     * The device type.
     */
    Type?: String;
    /**
     * The device vendor.
     */
    Vendor?: String;
    /**
     * The device model.
     */
    Model?: String;
    /**
     * The device serial number.
     */
    SerialNumber?: String;
    /**
     * The site location.
     */
    Location?: Location;
    /**
     * The site ID.
     */
    SiteId?: String;
    /**
     * The date and time that the site was created.
     */
    CreatedAt?: DateTime;
    /**
     * The device state.
     */
    State?: DeviceState;
    /**
     * The tags for the device.
     */
    Tags?: TagList;
  }
  export type DeviceList = Device[];
  export type DeviceState = "PENDING"|"AVAILABLE"|"DELETING"|"UPDATING"|string;
  export interface DisassociateCustomerGatewayRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The Amazon Resource Name (ARN) of the customer gateway.
     */
    CustomerGatewayArn: String;
  }
  export interface DisassociateCustomerGatewayResponse {
    /**
     * Information about the customer gateway association.
     */
    CustomerGatewayAssociation?: CustomerGatewayAssociation;
  }
  export interface DisassociateLinkRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the device.
     */
    DeviceId: String;
    /**
     * The ID of the link.
     */
    LinkId: String;
  }
  export interface DisassociateLinkResponse {
    /**
     * Information about the link association.
     */
    LinkAssociation?: LinkAssociation;
  }
  export interface DisassociateTransitGatewayConnectPeerRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The Amazon Resource Name (ARN) of the transit gateway Connect peer.
     */
    TransitGatewayConnectPeerArn: String;
  }
  export interface DisassociateTransitGatewayConnectPeerResponse {
    /**
     * The transit gateway Connect peer association.
     */
    TransitGatewayConnectPeerAssociation?: TransitGatewayConnectPeerAssociation;
  }
  export type FilterMap = {[key: string]: FilterValues};
  export type FilterName = string;
  export type FilterValue = string;
  export type FilterValues = FilterValue[];
  export interface GetConnectionsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * One or more connection IDs.
     */
    ConnectionIds?: StringList;
    /**
     * The ID of the device.
     */
    DeviceId?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetConnectionsResponse {
    /**
     * Information about the connections.
     */
    Connections?: ConnectionList;
    /**
     * The token to use for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetCustomerGatewayAssociationsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * One or more customer gateway Amazon Resource Names (ARNs). The maximum is 10.
     */
    CustomerGatewayArns?: StringList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetCustomerGatewayAssociationsResponse {
    /**
     * The customer gateway associations.
     */
    CustomerGatewayAssociations?: CustomerGatewayAssociationList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetDevicesRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * One or more device IDs. The maximum is 10.
     */
    DeviceIds?: StringList;
    /**
     * The ID of the site.
     */
    SiteId?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetDevicesResponse {
    /**
     * The devices.
     */
    Devices?: DeviceList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetLinkAssociationsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the device.
     */
    DeviceId?: String;
    /**
     * The ID of the link.
     */
    LinkId?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetLinkAssociationsResponse {
    /**
     * The link associations.
     */
    LinkAssociations?: LinkAssociationList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetLinksRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * One or more link IDs. The maximum is 10.
     */
    LinkIds?: StringList;
    /**
     * The ID of the site.
     */
    SiteId?: String;
    /**
     * The link type.
     */
    Type?: String;
    /**
     * The link provider.
     */
    Provider?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetLinksResponse {
    /**
     * The links.
     */
    Links?: LinkList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetNetworkResourceCountsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The resource type. The following are the supported resource types for Direct Connect:    dxcon     dx-gateway     dx-vif    The following are the supported resource types for Network Manager:    connection     device     link     site    The following are the supported resource types for Amazon VPC:    customer-gateway     transit-gateway     transit-gateway-attachment     transit-gateway-connect-peer     transit-gateway-route-table     vpn-connection   
     */
    ResourceType?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetNetworkResourceCountsResponse {
    /**
     * The count of resources.
     */
    NetworkResourceCounts?: NetworkResourceCountList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetNetworkResourceRelationshipsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ARN of the registered gateway.
     */
    RegisteredGatewayArn?: String;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: String;
    /**
     * The Amazon Web Services account ID.
     */
    AccountId?: String;
    /**
     * The resource type. The following are the supported resource types for Direct Connect:    dxcon     dx-gateway     dx-vif    The following are the supported resource types for Network Manager:    connection     device     link     site    The following are the supported resource types for Amazon VPC:    customer-gateway     transit-gateway     transit-gateway-attachment     transit-gateway-connect-peer     transit-gateway-route-table     vpn-connection   
     */
    ResourceType?: String;
    /**
     * The ARN of the gateway.
     */
    ResourceArn?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetNetworkResourceRelationshipsResponse {
    /**
     * The resource relationships.
     */
    Relationships?: RelationshipList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetNetworkResourcesRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ARN of the gateway.
     */
    RegisteredGatewayArn?: String;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: String;
    /**
     * The Amazon Web Services account ID.
     */
    AccountId?: String;
    /**
     * The resource type. The following are the supported resource types for Direct Connect:    dxcon - The definition model is Connection.    dx-gateway - The definition model is DirectConnectGateway.    dx-vif - The definition model is VirtualInterface.   The following are the supported resource types for Network Manager:    connection - The definition model is Connection.    device - The definition model is Device.    link - The definition model is Link.    site - The definition model is Site.   The following are the supported resource types for Amazon VPC:    customer-gateway - The definition model is CustomerGateway.    transit-gateway - The definition model is TransitGateway.    transit-gateway-attachment - The definition model is TransitGatewayAttachment.    transit-gateway-connect-peer - The definition model is TransitGatewayConnectPeer.    transit-gateway-route-table - The definition model is TransitGatewayRouteTable.    vpn-connection - The definition model is VpnConnection.  
     */
    ResourceType?: String;
    /**
     * The ARN of the resource.
     */
    ResourceArn?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetNetworkResourcesResponse {
    /**
     * The network resources.
     */
    NetworkResources?: NetworkResourceList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetNetworkRoutesRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the route table.
     */
    RouteTableIdentifier: RouteTableIdentifier;
    /**
     * An exact CIDR block.
     */
    ExactCidrMatches?: StringList;
    /**
     * The most specific route that matches the traffic (longest prefix match).
     */
    LongestPrefixMatches?: StringList;
    /**
     * The routes with a subnet that match the specified CIDR filter.
     */
    SubnetOfMatches?: StringList;
    /**
     * The routes with a CIDR that encompasses the CIDR filter. Example: If you specify 10.0.1.0/30, then the result returns 10.0.1.0/29.
     */
    SupernetOfMatches?: StringList;
    /**
     * The IDs of the prefix lists.
     */
    PrefixListIds?: StringList;
    /**
     * The route states.
     */
    States?: RouteStateList;
    /**
     * The route types.
     */
    Types?: RouteTypeList;
    /**
     * Filter by route table destination. Possible Values: TRANSIT_GATEWAY_ATTACHMENT_ID, RESOURCE_ID, or RESOURCE_TYPE.
     */
    DestinationFilters?: FilterMap;
  }
  export interface GetNetworkRoutesResponse {
    /**
     * The ARN of the route table.
     */
    RouteTableArn?: String;
    /**
     * The route table type.
     */
    RouteTableType?: RouteTableType;
    /**
     * The route table creation time.
     */
    RouteTableTimestamp?: DateTime;
    /**
     * The network routes.
     */
    NetworkRoutes?: NetworkRouteList;
  }
  export interface GetNetworkTelemetryRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ARN of the gateway.
     */
    RegisteredGatewayArn?: String;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: String;
    /**
     * The Amazon Web Services account ID.
     */
    AccountId?: String;
    /**
     * The resource type. The following are the supported resource types for Direct Connect:    dxcon     dx-gateway     dx-vif    The following are the supported resource types for Network Manager:    connection     device     link     site    The following are the supported resource types for Amazon VPC:    customer-gateway     transit-gateway     transit-gateway-attachment     transit-gateway-connect-peer     transit-gateway-route-table     vpn-connection   
     */
    ResourceType?: String;
    /**
     * The ARN of the resource.
     */
    ResourceArn?: String;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetNetworkTelemetryResponse {
    /**
     * The network telemetry.
     */
    NetworkTelemetry?: NetworkTelemetryList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetRouteAnalysisRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the route analysis.
     */
    RouteAnalysisId: String;
  }
  export interface GetRouteAnalysisResponse {
    /**
     * The route analysis.
     */
    RouteAnalysis?: RouteAnalysis;
  }
  export interface GetSitesRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * One or more site IDs. The maximum is 10.
     */
    SiteIds?: StringList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetSitesResponse {
    /**
     * The sites.
     */
    Sites?: SiteList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetTransitGatewayConnectPeerAssociationsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * One or more transit gateway Connect peer Amazon Resource Names (ARNs).
     */
    TransitGatewayConnectPeerArns?: StringList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetTransitGatewayConnectPeerAssociationsResponse {
    /**
     * Information about the transit gateway Connect peer associations.
     */
    TransitGatewayConnectPeerAssociations?: TransitGatewayConnectPeerAssociationList;
    /**
     * The token to use for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetTransitGatewayRegistrationsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The Amazon Resource Names (ARNs) of one or more transit gateways. The maximum is 10.
     */
    TransitGatewayArns?: StringList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GetTransitGatewayRegistrationsResponse {
    /**
     * The transit gateway registrations.
     */
    TransitGatewayRegistrations?: TransitGatewayRegistrationList;
    /**
     * The token for the next page of results.
     */
    NextToken?: String;
  }
  export interface GlobalNetwork {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: String;
    /**
     * The Amazon Resource Name (ARN) of the global network.
     */
    GlobalNetworkArn?: String;
    /**
     * The description of the global network.
     */
    Description?: String;
    /**
     * The date and time that the global network was created.
     */
    CreatedAt?: DateTime;
    /**
     * The state of the global network.
     */
    State?: GlobalNetworkState;
    /**
     * The tags for the global network.
     */
    Tags?: TagList;
  }
  export type GlobalNetworkList = GlobalNetwork[];
  export type GlobalNetworkState = "PENDING"|"AVAILABLE"|"DELETING"|"UPDATING"|string;
  export type Integer = number;
  export interface Link {
    /**
     * The ID of the link.
     */
    LinkId?: String;
    /**
     * The Amazon Resource Name (ARN) of the link.
     */
    LinkArn?: String;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: String;
    /**
     * The ID of the site.
     */
    SiteId?: String;
    /**
     * The description of the link.
     */
    Description?: String;
    /**
     * The type of the link.
     */
    Type?: String;
    /**
     * The bandwidth for the link.
     */
    Bandwidth?: Bandwidth;
    /**
     * The provider of the link.
     */
    Provider?: String;
    /**
     * The date and time that the link was created.
     */
    CreatedAt?: DateTime;
    /**
     * The state of the link.
     */
    State?: LinkState;
    /**
     * The tags for the link.
     */
    Tags?: TagList;
  }
  export interface LinkAssociation {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: String;
    /**
     * The device ID for the link association.
     */
    DeviceId?: String;
    /**
     * The ID of the link.
     */
    LinkId?: String;
    /**
     * The state of the association.
     */
    LinkAssociationState?: LinkAssociationState;
  }
  export type LinkAssociationList = LinkAssociation[];
  export type LinkAssociationState = "PENDING"|"AVAILABLE"|"DELETING"|"DELETED"|string;
  export type LinkList = Link[];
  export type LinkState = "PENDING"|"AVAILABLE"|"DELETING"|"UPDATING"|string;
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: ResourceARN;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tags.
     */
    TagList?: TagList;
  }
  export interface Location {
    /**
     * The physical address.
     */
    Address?: String;
    /**
     * The latitude.
     */
    Latitude?: String;
    /**
     * The longitude.
     */
    Longitude?: String;
  }
  export type MaxResults = number;
  export interface NetworkResource {
    /**
     * The ARN of the gateway.
     */
    RegisteredGatewayArn?: String;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: String;
    /**
     * The Amazon Web Services account ID.
     */
    AccountId?: String;
    /**
     * The resource type. The following are the supported resource types for Direct Connect:    dxcon     dx-gateway     dx-vif    The following are the supported resource types for Network Manager:    connection     device     link     site    The following are the supported resource types for Amazon VPC:    customer-gateway     transit-gateway     transit-gateway-attachment     transit-gateway-connect-peer     transit-gateway-route-table     vpn-connection   
     */
    ResourceType?: String;
    /**
     * The ID of the resource.
     */
    ResourceId?: String;
    /**
     * The ARN of the resource.
     */
    ResourceArn?: String;
    /**
     * Information about the resource, in JSON format. Network Manager gets this information by describing the resource using its Describe API call.
     */
    Definition?: String;
    /**
     * The time that the resource definition was retrieved.
     */
    DefinitionTimestamp?: DateTime;
    /**
     * The tags.
     */
    Tags?: TagList;
    /**
     * The resource metadata.
     */
    Metadata?: NetworkResourceMetadataMap;
  }
  export interface NetworkResourceCount {
    /**
     * The resource type.
     */
    ResourceType?: String;
    /**
     * The resource count.
     */
    Count?: Integer;
  }
  export type NetworkResourceCountList = NetworkResourceCount[];
  export type NetworkResourceList = NetworkResource[];
  export type NetworkResourceMetadataKey = string;
  export type NetworkResourceMetadataMap = {[key: string]: NetworkResourceMetadataValue};
  export type NetworkResourceMetadataValue = string;
  export interface NetworkResourceSummary {
    /**
     * The ARN of the gateway.
     */
    RegisteredGatewayArn?: String;
    /**
     * The ARN of the resource.
     */
    ResourceArn?: String;
    /**
     * The resource type.
     */
    ResourceType?: String;
    /**
     * Information about the resource, in JSON format. Network Manager gets this information by describing the resource using its Describe API call.
     */
    Definition?: String;
    /**
     * The value for the Name tag.
     */
    NameTag?: String;
    /**
     * Indicates whether this is a middlebox appliance.
     */
    IsMiddlebox?: Boolean;
  }
  export interface NetworkRoute {
    /**
     * A unique identifier for the route, such as a CIDR block.
     */
    DestinationCidrBlock?: String;
    /**
     * The destinations.
     */
    Destinations?: NetworkRouteDestinationList;
    /**
     * The ID of the prefix list.
     */
    PrefixListId?: String;
    /**
     * The route state. The possible values are active and blackhole.
     */
    State?: RouteState;
    /**
     * The route type. The possible values are propagated and static.
     */
    Type?: RouteType;
  }
  export interface NetworkRouteDestination {
    /**
     * The ID of the transit gateway attachment.
     */
    TransitGatewayAttachmentId?: String;
    /**
     * The resource type.
     */
    ResourceType?: String;
    /**
     * The ID of the resource.
     */
    ResourceId?: String;
  }
  export type NetworkRouteDestinationList = NetworkRouteDestination[];
  export type NetworkRouteList = NetworkRoute[];
  export interface NetworkTelemetry {
    /**
     * The ARN of the gateway.
     */
    RegisteredGatewayArn?: String;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: String;
    /**
     * The Amazon Web Services account ID.
     */
    AccountId?: String;
    /**
     * The resource type.
     */
    ResourceType?: String;
    /**
     * The ID of the resource.
     */
    ResourceId?: String;
    /**
     * The ARN of the resource.
     */
    ResourceArn?: String;
    /**
     * The address.
     */
    Address?: String;
    /**
     * The connection health.
     */
    Health?: ConnectionHealth;
  }
  export type NetworkTelemetryList = NetworkTelemetry[];
  export interface PathComponent {
    /**
     * The sequence number in the path. The destination is 0.
     */
    Sequence?: Integer;
    /**
     * The resource.
     */
    Resource?: NetworkResourceSummary;
    /**
     * The destination CIDR block in the route table.
     */
    DestinationCidrBlock?: String;
  }
  export type PathComponentList = PathComponent[];
  export type ReasonContextKey = string;
  export type ReasonContextMap = {[key: string]: ReasonContextValue};
  export type ReasonContextValue = string;
  export interface RegisterTransitGatewayRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The Amazon Resource Name (ARN) of the transit gateway.
     */
    TransitGatewayArn: String;
  }
  export interface RegisterTransitGatewayResponse {
    /**
     * Information about the transit gateway registration.
     */
    TransitGatewayRegistration?: TransitGatewayRegistration;
  }
  export interface Relationship {
    /**
     * The ARN of the resource.
     */
    From?: String;
    /**
     * The ARN of the resource.
     */
    To?: String;
  }
  export type RelationshipList = Relationship[];
  export type ResourceARN = string;
  export interface RouteAnalysis {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: String;
    /**
     * The ID of the AWS account that created the route analysis.
     */
    OwnerAccountId?: String;
    /**
     * The ID of the route analysis.
     */
    RouteAnalysisId?: String;
    /**
     * The time that the analysis started.
     */
    StartTimestamp?: DateTime;
    /**
     * The status of the route analysis.
     */
    Status?: RouteAnalysisStatus;
    /**
     * The source.
     */
    Source?: RouteAnalysisEndpointOptions;
    /**
     * The destination.
     */
    Destination?: RouteAnalysisEndpointOptions;
    /**
     * Indicates whether to analyze the return path. The return path is not analyzed if the forward path analysis does not succeed.
     */
    IncludeReturnPath?: Boolean;
    /**
     * Indicates whether to include the location of middlebox appliances in the route analysis.
     */
    UseMiddleboxes?: Boolean;
    /**
     * The forward path.
     */
    ForwardPath?: RouteAnalysisPath;
    /**
     * The return path.
     */
    ReturnPath?: RouteAnalysisPath;
  }
  export interface RouteAnalysisCompletion {
    /**
     * The result of the analysis. If the status is NOT_CONNECTED, check the reason code.
     */
    ResultCode?: RouteAnalysisCompletionResultCode;
    /**
     * The reason code. Available only if a connection is not found.    BLACKHOLE_ROUTE_FOR_DESTINATION_FOUND - Found a black hole route with the destination CIDR block.    CYCLIC_PATH_DETECTED - Found the same resource multiple times while traversing the path.    INACTIVE_ROUTE_FOR_DESTINATION_FOUND - Found an inactive route with the destination CIDR block.    MAX_HOPS_EXCEEDED - Analysis exceeded 64 hops without finding the destination.    ROUTE_NOT_FOUND - Cannot find a route table with the destination CIDR block.    TGW_ATTACH_ARN_NO_MATCH - Found an attachment, but not with the correct destination ARN.    TGW_ATTACH_NOT_FOUND - Cannot find an attachment.    TGW_ATTACH_NOT_IN_TGW - Found an attachment, but not to the correct transit gateway.    TGW_ATTACH_STABLE_ROUTE_TABLE_NOT_FOUND - The state of the route table association is not associated.  
     */
    ReasonCode?: RouteAnalysisCompletionReasonCode;
    /**
     * Additional information about the path. Available only if a connection is not found.
     */
    ReasonContext?: ReasonContextMap;
  }
  export type RouteAnalysisCompletionReasonCode = "TRANSIT_GATEWAY_ATTACHMENT_NOT_FOUND"|"TRANSIT_GATEWAY_ATTACHMENT_NOT_IN_TRANSIT_GATEWAY"|"CYCLIC_PATH_DETECTED"|"TRANSIT_GATEWAY_ATTACHMENT_STABLE_ROUTE_TABLE_NOT_FOUND"|"ROUTE_NOT_FOUND"|"BLACKHOLE_ROUTE_FOR_DESTINATION_FOUND"|"INACTIVE_ROUTE_FOR_DESTINATION_FOUND"|"TRANSIT_GATEWAY_ATTACHMENT_ATTACH_ARN_NO_MATCH"|"MAX_HOPS_EXCEEDED"|"POSSIBLE_MIDDLEBOX"|"NO_DESTINATION_ARN_PROVIDED"|string;
  export type RouteAnalysisCompletionResultCode = "CONNECTED"|"NOT_CONNECTED"|string;
  export interface RouteAnalysisEndpointOptions {
    /**
     * The ARN of the transit gateway attachment.
     */
    TransitGatewayAttachmentArn?: String;
    /**
     * The ARN of the transit gateway.
     */
    TransitGatewayArn?: String;
    /**
     * The IP address.
     */
    IpAddress?: String;
  }
  export interface RouteAnalysisEndpointOptionsSpecification {
    /**
     * The ARN of the transit gateway attachment.
     */
    TransitGatewayAttachmentArn?: String;
    /**
     * The IP address.
     */
    IpAddress?: String;
  }
  export interface RouteAnalysisPath {
    /**
     * The status of the analysis at completion.
     */
    CompletionStatus?: RouteAnalysisCompletion;
    /**
     * The route analysis path.
     */
    Path?: PathComponentList;
  }
  export type RouteAnalysisStatus = "RUNNING"|"COMPLETED"|"FAILED"|string;
  export type RouteState = "ACTIVE"|"BLACKHOLE"|string;
  export type RouteStateList = RouteState[];
  export interface RouteTableIdentifier {
    /**
     * The ARN of the transit gateway route table.
     */
    TransitGatewayRouteTableArn?: String;
  }
  export type RouteTableType = "TRANSIT_GATEWAY_ROUTE_TABLE"|string;
  export type RouteType = "PROPAGATED"|"STATIC"|string;
  export type RouteTypeList = RouteType[];
  export interface Site {
    /**
     * The ID of the site.
     */
    SiteId?: String;
    /**
     * The Amazon Resource Name (ARN) of the site.
     */
    SiteArn?: String;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: String;
    /**
     * The description of the site.
     */
    Description?: String;
    /**
     * The location of the site.
     */
    Location?: Location;
    /**
     * The date and time that the site was created.
     */
    CreatedAt?: DateTime;
    /**
     * The state of the site.
     */
    State?: SiteState;
    /**
     * The tags for the site.
     */
    Tags?: TagList;
  }
  export type SiteList = Site[];
  export type SiteState = "PENDING"|"AVAILABLE"|"DELETING"|"UPDATING"|string;
  export interface StartRouteAnalysisRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The source from which traffic originates.
     */
    Source: RouteAnalysisEndpointOptionsSpecification;
    /**
     * The destination.
     */
    Destination: RouteAnalysisEndpointOptionsSpecification;
    /**
     * Indicates whether to analyze the return path. The default is false.
     */
    IncludeReturnPath?: Boolean;
    /**
     * Indicates whether to include the location of middlebox appliances in the route analysis. The default is false.
     */
    UseMiddleboxes?: Boolean;
  }
  export interface StartRouteAnalysisResponse {
    /**
     * The route analysis.
     */
    RouteAnalysis?: RouteAnalysis;
  }
  export type String = string;
  export type StringList = String[];
  export interface Tag {
    /**
     * The tag key. Constraints: Maximum length of 128 characters.
     */
    Key?: TagKey;
    /**
     * The tag value. Constraints: Maximum length of 256 characters.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: ResourceARN;
    /**
     * The tags to apply to the specified resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TransitGatewayConnectPeerAssociation {
    /**
     * The Amazon Resource Name (ARN) of the transit gateway Connect peer.
     */
    TransitGatewayConnectPeerArn?: String;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: String;
    /**
     * The ID of the device.
     */
    DeviceId?: String;
    /**
     * The ID of the link.
     */
    LinkId?: String;
    /**
     * The state of the association.
     */
    State?: TransitGatewayConnectPeerAssociationState;
  }
  export type TransitGatewayConnectPeerAssociationList = TransitGatewayConnectPeerAssociation[];
  export type TransitGatewayConnectPeerAssociationState = "PENDING"|"AVAILABLE"|"DELETING"|"DELETED"|string;
  export interface TransitGatewayRegistration {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: String;
    /**
     * The Amazon Resource Name (ARN) of the transit gateway.
     */
    TransitGatewayArn?: String;
    /**
     * The state of the transit gateway registration.
     */
    State?: TransitGatewayRegistrationStateReason;
  }
  export type TransitGatewayRegistrationList = TransitGatewayRegistration[];
  export type TransitGatewayRegistrationState = "PENDING"|"AVAILABLE"|"DELETING"|"DELETED"|"FAILED"|string;
  export interface TransitGatewayRegistrationStateReason {
    /**
     * The code for the state reason.
     */
    Code?: TransitGatewayRegistrationState;
    /**
     * The message for the state reason.
     */
    Message?: String;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: ResourceARN;
    /**
     * The tag keys to remove from the specified resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateConnectionRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the connection.
     */
    ConnectionId: String;
    /**
     * The ID of the link for the first device in the connection.
     */
    LinkId?: String;
    /**
     * The ID of the link for the second device in the connection.
     */
    ConnectedLinkId?: String;
    /**
     * A description of the connection. Length Constraints: Maximum length of 256 characters.
     */
    Description?: String;
  }
  export interface UpdateConnectionResponse {
    /**
     * Information about the connection.
     */
    Connection?: Connection;
  }
  export interface UpdateDeviceRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the device.
     */
    DeviceId: String;
    /**
     * The Amazon Web Services location of the device, if applicable. For an on-premises device, you can omit this parameter.
     */
    AWSLocation?: AWSLocation;
    /**
     * A description of the device. Constraints: Maximum length of 256 characters.
     */
    Description?: String;
    /**
     * The type of the device.
     */
    Type?: String;
    /**
     * The vendor of the device. Constraints: Maximum length of 128 characters.
     */
    Vendor?: String;
    /**
     * The model of the device. Constraints: Maximum length of 128 characters.
     */
    Model?: String;
    /**
     * The serial number of the device. Constraints: Maximum length of 128 characters.
     */
    SerialNumber?: String;
    Location?: Location;
    /**
     * The ID of the site.
     */
    SiteId?: String;
  }
  export interface UpdateDeviceResponse {
    /**
     * Information about the device.
     */
    Device?: Device;
  }
  export interface UpdateGlobalNetworkRequest {
    /**
     * The ID of your global network.
     */
    GlobalNetworkId: String;
    /**
     * A description of the global network. Constraints: Maximum length of 256 characters.
     */
    Description?: String;
  }
  export interface UpdateGlobalNetworkResponse {
    /**
     * Information about the global network object.
     */
    GlobalNetwork?: GlobalNetwork;
  }
  export interface UpdateLinkRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of the link.
     */
    LinkId: String;
    /**
     * A description of the link. Constraints: Maximum length of 256 characters.
     */
    Description?: String;
    /**
     * The type of the link. Constraints: Maximum length of 128 characters.
     */
    Type?: String;
    /**
     * The upload and download speed in Mbps. 
     */
    Bandwidth?: Bandwidth;
    /**
     * The provider of the link. Constraints: Maximum length of 128 characters.
     */
    Provider?: String;
  }
  export interface UpdateLinkResponse {
    /**
     * Information about the link.
     */
    Link?: Link;
  }
  export interface UpdateNetworkResourceMetadataRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ARN of the resource.
     */
    ResourceArn: String;
    /**
     * The resource metadata.
     */
    Metadata: NetworkResourceMetadataMap;
  }
  export interface UpdateNetworkResourceMetadataResponse {
    /**
     * The ARN of the resource.
     */
    ResourceArn?: String;
    /**
     * The updated resource metadata.
     */
    Metadata?: NetworkResourceMetadataMap;
  }
  export interface UpdateSiteRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: String;
    /**
     * The ID of your site.
     */
    SiteId: String;
    /**
     * A description of your site. Constraints: Maximum length of 256 characters.
     */
    Description?: String;
    /**
     * The site location:    Address: The physical address of the site.    Latitude: The latitude of the site.     Longitude: The longitude of the site.  
     */
    Location?: Location;
  }
  export interface UpdateSiteResponse {
    /**
     * Information about the site.
     */
    Site?: Site;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-07-05"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the NetworkManager client.
   */
  export import Types = NetworkManager;
}
export = NetworkManager;
