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
   * Accepts a core network attachment request.  Once the attachment request is accepted by a core network owner, the attachment is created and connected to a core network.
   */
  acceptAttachment(params: NetworkManager.Types.AcceptAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.AcceptAttachmentResponse) => void): Request<NetworkManager.Types.AcceptAttachmentResponse, AWSError>;
  /**
   * Accepts a core network attachment request.  Once the attachment request is accepted by a core network owner, the attachment is created and connected to a core network.
   */
  acceptAttachment(callback?: (err: AWSError, data: NetworkManager.Types.AcceptAttachmentResponse) => void): Request<NetworkManager.Types.AcceptAttachmentResponse, AWSError>;
  /**
   * Associates a core network Connect peer with a device and optionally, with a link.  If you specify a link, it must be associated with the specified device. You can only associate core network Connect peers that have been created on a core network Connect attachment on a core network. 
   */
  associateConnectPeer(params: NetworkManager.Types.AssociateConnectPeerRequest, callback?: (err: AWSError, data: NetworkManager.Types.AssociateConnectPeerResponse) => void): Request<NetworkManager.Types.AssociateConnectPeerResponse, AWSError>;
  /**
   * Associates a core network Connect peer with a device and optionally, with a link.  If you specify a link, it must be associated with the specified device. You can only associate core network Connect peers that have been created on a core network Connect attachment on a core network. 
   */
  associateConnectPeer(callback?: (err: AWSError, data: NetworkManager.Types.AssociateConnectPeerResponse) => void): Request<NetworkManager.Types.AssociateConnectPeerResponse, AWSError>;
  /**
   * Associates a customer gateway with a device and optionally, with a link. If you specify a link, it must be associated with the specified device.  You can only associate customer gateways that are connected to a VPN attachment on a transit gateway or core network registered in your global network. When you register a transit gateway or core network, customer gateways that are connected to the transit gateway are automatically included in the global network. To list customer gateways that are connected to a transit gateway, use the DescribeVpnConnections EC2 API and filter by transit-gateway-id. You cannot associate a customer gateway with more than one device and link. 
   */
  associateCustomerGateway(params: NetworkManager.Types.AssociateCustomerGatewayRequest, callback?: (err: AWSError, data: NetworkManager.Types.AssociateCustomerGatewayResponse) => void): Request<NetworkManager.Types.AssociateCustomerGatewayResponse, AWSError>;
  /**
   * Associates a customer gateway with a device and optionally, with a link. If you specify a link, it must be associated with the specified device.  You can only associate customer gateways that are connected to a VPN attachment on a transit gateway or core network registered in your global network. When you register a transit gateway or core network, customer gateways that are connected to the transit gateway are automatically included in the global network. To list customer gateways that are connected to a transit gateway, use the DescribeVpnConnections EC2 API and filter by transit-gateway-id. You cannot associate a customer gateway with more than one device and link. 
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
   * Creates a core network Connect attachment from a specified core network attachment.  A core network Connect attachment is a GRE-based tunnel attachment that you can use to establish a connection between a core network and an appliance. A core network Connect attachment uses an existing VPC attachment as the underlying transport mechanism.
   */
  createConnectAttachment(params: NetworkManager.Types.CreateConnectAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateConnectAttachmentResponse) => void): Request<NetworkManager.Types.CreateConnectAttachmentResponse, AWSError>;
  /**
   * Creates a core network Connect attachment from a specified core network attachment.  A core network Connect attachment is a GRE-based tunnel attachment that you can use to establish a connection between a core network and an appliance. A core network Connect attachment uses an existing VPC attachment as the underlying transport mechanism.
   */
  createConnectAttachment(callback?: (err: AWSError, data: NetworkManager.Types.CreateConnectAttachmentResponse) => void): Request<NetworkManager.Types.CreateConnectAttachmentResponse, AWSError>;
  /**
   * Creates a core network Connect peer for a specified core network connect attachment between a core network and an appliance. The peer address and transit gateway address must be the same IP address family (IPv4 or IPv6).
   */
  createConnectPeer(params: NetworkManager.Types.CreateConnectPeerRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateConnectPeerResponse) => void): Request<NetworkManager.Types.CreateConnectPeerResponse, AWSError>;
  /**
   * Creates a core network Connect peer for a specified core network connect attachment between a core network and an appliance. The peer address and transit gateway address must be the same IP address family (IPv4 or IPv6).
   */
  createConnectPeer(callback?: (err: AWSError, data: NetworkManager.Types.CreateConnectPeerResponse) => void): Request<NetworkManager.Types.CreateConnectPeerResponse, AWSError>;
  /**
   * Creates a connection between two devices. The devices can be a physical or virtual appliance that connects to a third-party appliance in a VPC, or a physical appliance that connects to another physical appliance in an on-premises network.
   */
  createConnection(params: NetworkManager.Types.CreateConnectionRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateConnectionResponse) => void): Request<NetworkManager.Types.CreateConnectionResponse, AWSError>;
  /**
   * Creates a connection between two devices. The devices can be a physical or virtual appliance that connects to a third-party appliance in a VPC, or a physical appliance that connects to another physical appliance in an on-premises network.
   */
  createConnection(callback?: (err: AWSError, data: NetworkManager.Types.CreateConnectionResponse) => void): Request<NetworkManager.Types.CreateConnectionResponse, AWSError>;
  /**
   * Creates a core network as part of your global network, and optionally, with a core network policy.
   */
  createCoreNetwork(params: NetworkManager.Types.CreateCoreNetworkRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateCoreNetworkResponse) => void): Request<NetworkManager.Types.CreateCoreNetworkResponse, AWSError>;
  /**
   * Creates a core network as part of your global network, and optionally, with a core network policy.
   */
  createCoreNetwork(callback?: (err: AWSError, data: NetworkManager.Types.CreateCoreNetworkResponse) => void): Request<NetworkManager.Types.CreateCoreNetworkResponse, AWSError>;
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
   * Creates an Amazon Web Services site-to-site VPN attachment on an edge location of a core network.
   */
  createSiteToSiteVpnAttachment(params: NetworkManager.Types.CreateSiteToSiteVpnAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateSiteToSiteVpnAttachmentResponse) => void): Request<NetworkManager.Types.CreateSiteToSiteVpnAttachmentResponse, AWSError>;
  /**
   * Creates an Amazon Web Services site-to-site VPN attachment on an edge location of a core network.
   */
  createSiteToSiteVpnAttachment(callback?: (err: AWSError, data: NetworkManager.Types.CreateSiteToSiteVpnAttachmentResponse) => void): Request<NetworkManager.Types.CreateSiteToSiteVpnAttachmentResponse, AWSError>;
  /**
   * Creates a transit gateway peering connection.
   */
  createTransitGatewayPeering(params: NetworkManager.Types.CreateTransitGatewayPeeringRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateTransitGatewayPeeringResponse) => void): Request<NetworkManager.Types.CreateTransitGatewayPeeringResponse, AWSError>;
  /**
   * Creates a transit gateway peering connection.
   */
  createTransitGatewayPeering(callback?: (err: AWSError, data: NetworkManager.Types.CreateTransitGatewayPeeringResponse) => void): Request<NetworkManager.Types.CreateTransitGatewayPeeringResponse, AWSError>;
  /**
   * Creates a transit gateway route table attachment.
   */
  createTransitGatewayRouteTableAttachment(params: NetworkManager.Types.CreateTransitGatewayRouteTableAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateTransitGatewayRouteTableAttachmentResponse) => void): Request<NetworkManager.Types.CreateTransitGatewayRouteTableAttachmentResponse, AWSError>;
  /**
   * Creates a transit gateway route table attachment.
   */
  createTransitGatewayRouteTableAttachment(callback?: (err: AWSError, data: NetworkManager.Types.CreateTransitGatewayRouteTableAttachmentResponse) => void): Request<NetworkManager.Types.CreateTransitGatewayRouteTableAttachmentResponse, AWSError>;
  /**
   * Creates a VPC attachment on an edge location of a core network.
   */
  createVpcAttachment(params: NetworkManager.Types.CreateVpcAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.CreateVpcAttachmentResponse) => void): Request<NetworkManager.Types.CreateVpcAttachmentResponse, AWSError>;
  /**
   * Creates a VPC attachment on an edge location of a core network.
   */
  createVpcAttachment(callback?: (err: AWSError, data: NetworkManager.Types.CreateVpcAttachmentResponse) => void): Request<NetworkManager.Types.CreateVpcAttachmentResponse, AWSError>;
  /**
   * Deletes an attachment. Supports all attachment types.
   */
  deleteAttachment(params: NetworkManager.Types.DeleteAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteAttachmentResponse) => void): Request<NetworkManager.Types.DeleteAttachmentResponse, AWSError>;
  /**
   * Deletes an attachment. Supports all attachment types.
   */
  deleteAttachment(callback?: (err: AWSError, data: NetworkManager.Types.DeleteAttachmentResponse) => void): Request<NetworkManager.Types.DeleteAttachmentResponse, AWSError>;
  /**
   * Deletes a Connect peer.
   */
  deleteConnectPeer(params: NetworkManager.Types.DeleteConnectPeerRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteConnectPeerResponse) => void): Request<NetworkManager.Types.DeleteConnectPeerResponse, AWSError>;
  /**
   * Deletes a Connect peer.
   */
  deleteConnectPeer(callback?: (err: AWSError, data: NetworkManager.Types.DeleteConnectPeerResponse) => void): Request<NetworkManager.Types.DeleteConnectPeerResponse, AWSError>;
  /**
   * Deletes the specified connection in your global network.
   */
  deleteConnection(params: NetworkManager.Types.DeleteConnectionRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteConnectionResponse) => void): Request<NetworkManager.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Deletes the specified connection in your global network.
   */
  deleteConnection(callback?: (err: AWSError, data: NetworkManager.Types.DeleteConnectionResponse) => void): Request<NetworkManager.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Deletes a core network along with all core network policies. This can only be done if there are no attachments on a core network.
   */
  deleteCoreNetwork(params: NetworkManager.Types.DeleteCoreNetworkRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteCoreNetworkResponse) => void): Request<NetworkManager.Types.DeleteCoreNetworkResponse, AWSError>;
  /**
   * Deletes a core network along with all core network policies. This can only be done if there are no attachments on a core network.
   */
  deleteCoreNetwork(callback?: (err: AWSError, data: NetworkManager.Types.DeleteCoreNetworkResponse) => void): Request<NetworkManager.Types.DeleteCoreNetworkResponse, AWSError>;
  /**
   * Deletes a policy version from a core network. You can't delete the current LIVE policy.
   */
  deleteCoreNetworkPolicyVersion(params: NetworkManager.Types.DeleteCoreNetworkPolicyVersionRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteCoreNetworkPolicyVersionResponse) => void): Request<NetworkManager.Types.DeleteCoreNetworkPolicyVersionResponse, AWSError>;
  /**
   * Deletes a policy version from a core network. You can't delete the current LIVE policy.
   */
  deleteCoreNetworkPolicyVersion(callback?: (err: AWSError, data: NetworkManager.Types.DeleteCoreNetworkPolicyVersionResponse) => void): Request<NetworkManager.Types.DeleteCoreNetworkPolicyVersionResponse, AWSError>;
  /**
   * Deletes an existing device. You must first disassociate the device from any links and customer gateways.
   */
  deleteDevice(params: NetworkManager.Types.DeleteDeviceRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteDeviceResponse) => void): Request<NetworkManager.Types.DeleteDeviceResponse, AWSError>;
  /**
   * Deletes an existing device. You must first disassociate the device from any links and customer gateways.
   */
  deleteDevice(callback?: (err: AWSError, data: NetworkManager.Types.DeleteDeviceResponse) => void): Request<NetworkManager.Types.DeleteDeviceResponse, AWSError>;
  /**
   * Deletes an existing global network. You must first delete all global network objects (devices, links, and sites), deregister all transit gateways, and delete any core networks.
   */
  deleteGlobalNetwork(params: NetworkManager.Types.DeleteGlobalNetworkRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteGlobalNetworkResponse) => void): Request<NetworkManager.Types.DeleteGlobalNetworkResponse, AWSError>;
  /**
   * Deletes an existing global network. You must first delete all global network objects (devices, links, and sites), deregister all transit gateways, and delete any core networks.
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
   * Deletes an existing peering connection.
   */
  deletePeering(params: NetworkManager.Types.DeletePeeringRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeletePeeringResponse) => void): Request<NetworkManager.Types.DeletePeeringResponse, AWSError>;
  /**
   * Deletes an existing peering connection.
   */
  deletePeering(callback?: (err: AWSError, data: NetworkManager.Types.DeletePeeringResponse) => void): Request<NetworkManager.Types.DeletePeeringResponse, AWSError>;
  /**
   * Deletes a resource policy for the specified resource. This revokes the access of the principals specified in the resource policy.
   */
  deleteResourcePolicy(params: NetworkManager.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: NetworkManager.Types.DeleteResourcePolicyResponse) => void): Request<NetworkManager.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes a resource policy for the specified resource. This revokes the access of the principals specified in the resource policy.
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: NetworkManager.Types.DeleteResourcePolicyResponse) => void): Request<NetworkManager.Types.DeleteResourcePolicyResponse, AWSError>;
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
   * Disassociates a core network Connect peer from a device and a link. 
   */
  disassociateConnectPeer(params: NetworkManager.Types.DisassociateConnectPeerRequest, callback?: (err: AWSError, data: NetworkManager.Types.DisassociateConnectPeerResponse) => void): Request<NetworkManager.Types.DisassociateConnectPeerResponse, AWSError>;
  /**
   * Disassociates a core network Connect peer from a device and a link. 
   */
  disassociateConnectPeer(callback?: (err: AWSError, data: NetworkManager.Types.DisassociateConnectPeerResponse) => void): Request<NetworkManager.Types.DisassociateConnectPeerResponse, AWSError>;
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
   * Executes a change set on your core network. Deploys changes globally based on the policy submitted..
   */
  executeCoreNetworkChangeSet(params: NetworkManager.Types.ExecuteCoreNetworkChangeSetRequest, callback?: (err: AWSError, data: NetworkManager.Types.ExecuteCoreNetworkChangeSetResponse) => void): Request<NetworkManager.Types.ExecuteCoreNetworkChangeSetResponse, AWSError>;
  /**
   * Executes a change set on your core network. Deploys changes globally based on the policy submitted..
   */
  executeCoreNetworkChangeSet(callback?: (err: AWSError, data: NetworkManager.Types.ExecuteCoreNetworkChangeSetResponse) => void): Request<NetworkManager.Types.ExecuteCoreNetworkChangeSetResponse, AWSError>;
  /**
   * Returns information about a core network Connect attachment.
   */
  getConnectAttachment(params: NetworkManager.Types.GetConnectAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetConnectAttachmentResponse) => void): Request<NetworkManager.Types.GetConnectAttachmentResponse, AWSError>;
  /**
   * Returns information about a core network Connect attachment.
   */
  getConnectAttachment(callback?: (err: AWSError, data: NetworkManager.Types.GetConnectAttachmentResponse) => void): Request<NetworkManager.Types.GetConnectAttachmentResponse, AWSError>;
  /**
   * Returns information about a core network Connect peer.
   */
  getConnectPeer(params: NetworkManager.Types.GetConnectPeerRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetConnectPeerResponse) => void): Request<NetworkManager.Types.GetConnectPeerResponse, AWSError>;
  /**
   * Returns information about a core network Connect peer.
   */
  getConnectPeer(callback?: (err: AWSError, data: NetworkManager.Types.GetConnectPeerResponse) => void): Request<NetworkManager.Types.GetConnectPeerResponse, AWSError>;
  /**
   * Returns information about a core network Connect peer associations.
   */
  getConnectPeerAssociations(params: NetworkManager.Types.GetConnectPeerAssociationsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetConnectPeerAssociationsResponse) => void): Request<NetworkManager.Types.GetConnectPeerAssociationsResponse, AWSError>;
  /**
   * Returns information about a core network Connect peer associations.
   */
  getConnectPeerAssociations(callback?: (err: AWSError, data: NetworkManager.Types.GetConnectPeerAssociationsResponse) => void): Request<NetworkManager.Types.GetConnectPeerAssociationsResponse, AWSError>;
  /**
   * Gets information about one or more of your connections in a global network.
   */
  getConnections(params: NetworkManager.Types.GetConnectionsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetConnectionsResponse) => void): Request<NetworkManager.Types.GetConnectionsResponse, AWSError>;
  /**
   * Gets information about one or more of your connections in a global network.
   */
  getConnections(callback?: (err: AWSError, data: NetworkManager.Types.GetConnectionsResponse) => void): Request<NetworkManager.Types.GetConnectionsResponse, AWSError>;
  /**
   * Returns information about the LIVE policy for a core network.
   */
  getCoreNetwork(params: NetworkManager.Types.GetCoreNetworkRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetCoreNetworkResponse) => void): Request<NetworkManager.Types.GetCoreNetworkResponse, AWSError>;
  /**
   * Returns information about the LIVE policy for a core network.
   */
  getCoreNetwork(callback?: (err: AWSError, data: NetworkManager.Types.GetCoreNetworkResponse) => void): Request<NetworkManager.Types.GetCoreNetworkResponse, AWSError>;
  /**
   * Returns information about a core network change event.
   */
  getCoreNetworkChangeEvents(params: NetworkManager.Types.GetCoreNetworkChangeEventsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetCoreNetworkChangeEventsResponse) => void): Request<NetworkManager.Types.GetCoreNetworkChangeEventsResponse, AWSError>;
  /**
   * Returns information about a core network change event.
   */
  getCoreNetworkChangeEvents(callback?: (err: AWSError, data: NetworkManager.Types.GetCoreNetworkChangeEventsResponse) => void): Request<NetworkManager.Types.GetCoreNetworkChangeEventsResponse, AWSError>;
  /**
   * Returns a change set between the LIVE core network policy and a submitted policy.
   */
  getCoreNetworkChangeSet(params: NetworkManager.Types.GetCoreNetworkChangeSetRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetCoreNetworkChangeSetResponse) => void): Request<NetworkManager.Types.GetCoreNetworkChangeSetResponse, AWSError>;
  /**
   * Returns a change set between the LIVE core network policy and a submitted policy.
   */
  getCoreNetworkChangeSet(callback?: (err: AWSError, data: NetworkManager.Types.GetCoreNetworkChangeSetResponse) => void): Request<NetworkManager.Types.GetCoreNetworkChangeSetResponse, AWSError>;
  /**
   * Returns details about a core network policy. You can get details about your current live policy or any previous policy version.
   */
  getCoreNetworkPolicy(params: NetworkManager.Types.GetCoreNetworkPolicyRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetCoreNetworkPolicyResponse) => void): Request<NetworkManager.Types.GetCoreNetworkPolicyResponse, AWSError>;
  /**
   * Returns details about a core network policy. You can get details about your current live policy or any previous policy version.
   */
  getCoreNetworkPolicy(callback?: (err: AWSError, data: NetworkManager.Types.GetCoreNetworkPolicyResponse) => void): Request<NetworkManager.Types.GetCoreNetworkPolicyResponse, AWSError>;
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
   * Returns information about a resource policy.
   */
  getResourcePolicy(params: NetworkManager.Types.GetResourcePolicyRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetResourcePolicyResponse) => void): Request<NetworkManager.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Returns information about a resource policy.
   */
  getResourcePolicy(callback?: (err: AWSError, data: NetworkManager.Types.GetResourcePolicyResponse) => void): Request<NetworkManager.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Gets information about the specified route analysis.
   */
  getRouteAnalysis(params: NetworkManager.Types.GetRouteAnalysisRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetRouteAnalysisResponse) => void): Request<NetworkManager.Types.GetRouteAnalysisResponse, AWSError>;
  /**
   * Gets information about the specified route analysis.
   */
  getRouteAnalysis(callback?: (err: AWSError, data: NetworkManager.Types.GetRouteAnalysisResponse) => void): Request<NetworkManager.Types.GetRouteAnalysisResponse, AWSError>;
  /**
   * Returns information about a site-to-site VPN attachment.
   */
  getSiteToSiteVpnAttachment(params: NetworkManager.Types.GetSiteToSiteVpnAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetSiteToSiteVpnAttachmentResponse) => void): Request<NetworkManager.Types.GetSiteToSiteVpnAttachmentResponse, AWSError>;
  /**
   * Returns information about a site-to-site VPN attachment.
   */
  getSiteToSiteVpnAttachment(callback?: (err: AWSError, data: NetworkManager.Types.GetSiteToSiteVpnAttachmentResponse) => void): Request<NetworkManager.Types.GetSiteToSiteVpnAttachmentResponse, AWSError>;
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
   * Returns information about a transit gateway peer.
   */
  getTransitGatewayPeering(params: NetworkManager.Types.GetTransitGatewayPeeringRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetTransitGatewayPeeringResponse) => void): Request<NetworkManager.Types.GetTransitGatewayPeeringResponse, AWSError>;
  /**
   * Returns information about a transit gateway peer.
   */
  getTransitGatewayPeering(callback?: (err: AWSError, data: NetworkManager.Types.GetTransitGatewayPeeringResponse) => void): Request<NetworkManager.Types.GetTransitGatewayPeeringResponse, AWSError>;
  /**
   * Gets information about the transit gateway registrations in a specified global network.
   */
  getTransitGatewayRegistrations(params: NetworkManager.Types.GetTransitGatewayRegistrationsRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetTransitGatewayRegistrationsResponse) => void): Request<NetworkManager.Types.GetTransitGatewayRegistrationsResponse, AWSError>;
  /**
   * Gets information about the transit gateway registrations in a specified global network.
   */
  getTransitGatewayRegistrations(callback?: (err: AWSError, data: NetworkManager.Types.GetTransitGatewayRegistrationsResponse) => void): Request<NetworkManager.Types.GetTransitGatewayRegistrationsResponse, AWSError>;
  /**
   * Returns information about a transit gateway route table attachment.
   */
  getTransitGatewayRouteTableAttachment(params: NetworkManager.Types.GetTransitGatewayRouteTableAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetTransitGatewayRouteTableAttachmentResponse) => void): Request<NetworkManager.Types.GetTransitGatewayRouteTableAttachmentResponse, AWSError>;
  /**
   * Returns information about a transit gateway route table attachment.
   */
  getTransitGatewayRouteTableAttachment(callback?: (err: AWSError, data: NetworkManager.Types.GetTransitGatewayRouteTableAttachmentResponse) => void): Request<NetworkManager.Types.GetTransitGatewayRouteTableAttachmentResponse, AWSError>;
  /**
   * Returns information about a VPC attachment.
   */
  getVpcAttachment(params: NetworkManager.Types.GetVpcAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.GetVpcAttachmentResponse) => void): Request<NetworkManager.Types.GetVpcAttachmentResponse, AWSError>;
  /**
   * Returns information about a VPC attachment.
   */
  getVpcAttachment(callback?: (err: AWSError, data: NetworkManager.Types.GetVpcAttachmentResponse) => void): Request<NetworkManager.Types.GetVpcAttachmentResponse, AWSError>;
  /**
   * Returns a list of core network attachments.
   */
  listAttachments(params: NetworkManager.Types.ListAttachmentsRequest, callback?: (err: AWSError, data: NetworkManager.Types.ListAttachmentsResponse) => void): Request<NetworkManager.Types.ListAttachmentsResponse, AWSError>;
  /**
   * Returns a list of core network attachments.
   */
  listAttachments(callback?: (err: AWSError, data: NetworkManager.Types.ListAttachmentsResponse) => void): Request<NetworkManager.Types.ListAttachmentsResponse, AWSError>;
  /**
   * Returns a list of core network Connect peers.
   */
  listConnectPeers(params: NetworkManager.Types.ListConnectPeersRequest, callback?: (err: AWSError, data: NetworkManager.Types.ListConnectPeersResponse) => void): Request<NetworkManager.Types.ListConnectPeersResponse, AWSError>;
  /**
   * Returns a list of core network Connect peers.
   */
  listConnectPeers(callback?: (err: AWSError, data: NetworkManager.Types.ListConnectPeersResponse) => void): Request<NetworkManager.Types.ListConnectPeersResponse, AWSError>;
  /**
   * Returns a list of core network policy versions.
   */
  listCoreNetworkPolicyVersions(params: NetworkManager.Types.ListCoreNetworkPolicyVersionsRequest, callback?: (err: AWSError, data: NetworkManager.Types.ListCoreNetworkPolicyVersionsResponse) => void): Request<NetworkManager.Types.ListCoreNetworkPolicyVersionsResponse, AWSError>;
  /**
   * Returns a list of core network policy versions.
   */
  listCoreNetworkPolicyVersions(callback?: (err: AWSError, data: NetworkManager.Types.ListCoreNetworkPolicyVersionsResponse) => void): Request<NetworkManager.Types.ListCoreNetworkPolicyVersionsResponse, AWSError>;
  /**
   * Returns a list of owned and shared core networks.
   */
  listCoreNetworks(params: NetworkManager.Types.ListCoreNetworksRequest, callback?: (err: AWSError, data: NetworkManager.Types.ListCoreNetworksResponse) => void): Request<NetworkManager.Types.ListCoreNetworksResponse, AWSError>;
  /**
   * Returns a list of owned and shared core networks.
   */
  listCoreNetworks(callback?: (err: AWSError, data: NetworkManager.Types.ListCoreNetworksResponse) => void): Request<NetworkManager.Types.ListCoreNetworksResponse, AWSError>;
  /**
   * Gets the status of the Service Linked Role (SLR) deployment for the accounts in a given Amazon Web Services Organization.
   */
  listOrganizationServiceAccessStatus(params: NetworkManager.Types.ListOrganizationServiceAccessStatusRequest, callback?: (err: AWSError, data: NetworkManager.Types.ListOrganizationServiceAccessStatusResponse) => void): Request<NetworkManager.Types.ListOrganizationServiceAccessStatusResponse, AWSError>;
  /**
   * Gets the status of the Service Linked Role (SLR) deployment for the accounts in a given Amazon Web Services Organization.
   */
  listOrganizationServiceAccessStatus(callback?: (err: AWSError, data: NetworkManager.Types.ListOrganizationServiceAccessStatusResponse) => void): Request<NetworkManager.Types.ListOrganizationServiceAccessStatusResponse, AWSError>;
  /**
   * Lists the peerings for a core network.
   */
  listPeerings(params: NetworkManager.Types.ListPeeringsRequest, callback?: (err: AWSError, data: NetworkManager.Types.ListPeeringsResponse) => void): Request<NetworkManager.Types.ListPeeringsResponse, AWSError>;
  /**
   * Lists the peerings for a core network.
   */
  listPeerings(callback?: (err: AWSError, data: NetworkManager.Types.ListPeeringsResponse) => void): Request<NetworkManager.Types.ListPeeringsResponse, AWSError>;
  /**
   * Lists the tags for a specified resource.
   */
  listTagsForResource(params: NetworkManager.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: NetworkManager.Types.ListTagsForResourceResponse) => void): Request<NetworkManager.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for a specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: NetworkManager.Types.ListTagsForResourceResponse) => void): Request<NetworkManager.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates a new, immutable version of a core network policy. A subsequent change set is created showing the differences between the LIVE policy and the submitted policy.
   */
  putCoreNetworkPolicy(params: NetworkManager.Types.PutCoreNetworkPolicyRequest, callback?: (err: AWSError, data: NetworkManager.Types.PutCoreNetworkPolicyResponse) => void): Request<NetworkManager.Types.PutCoreNetworkPolicyResponse, AWSError>;
  /**
   * Creates a new, immutable version of a core network policy. A subsequent change set is created showing the differences between the LIVE policy and the submitted policy.
   */
  putCoreNetworkPolicy(callback?: (err: AWSError, data: NetworkManager.Types.PutCoreNetworkPolicyResponse) => void): Request<NetworkManager.Types.PutCoreNetworkPolicyResponse, AWSError>;
  /**
   * Creates or updates a resource policy.
   */
  putResourcePolicy(params: NetworkManager.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: NetworkManager.Types.PutResourcePolicyResponse) => void): Request<NetworkManager.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Creates or updates a resource policy.
   */
  putResourcePolicy(callback?: (err: AWSError, data: NetworkManager.Types.PutResourcePolicyResponse) => void): Request<NetworkManager.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Registers a transit gateway in your global network. Not all Regions support transit gateways for global networks. For a list of the supported Regions, see Region Availability in the Amazon Web Services Transit Gateways for Global Networks User Guide. The transit gateway can be in any of the supported Amazon Web Services Regions, but it must be owned by the same Amazon Web Services account that owns the global network. You cannot register a transit gateway in more than one global network.
   */
  registerTransitGateway(params: NetworkManager.Types.RegisterTransitGatewayRequest, callback?: (err: AWSError, data: NetworkManager.Types.RegisterTransitGatewayResponse) => void): Request<NetworkManager.Types.RegisterTransitGatewayResponse, AWSError>;
  /**
   * Registers a transit gateway in your global network. Not all Regions support transit gateways for global networks. For a list of the supported Regions, see Region Availability in the Amazon Web Services Transit Gateways for Global Networks User Guide. The transit gateway can be in any of the supported Amazon Web Services Regions, but it must be owned by the same Amazon Web Services account that owns the global network. You cannot register a transit gateway in more than one global network.
   */
  registerTransitGateway(callback?: (err: AWSError, data: NetworkManager.Types.RegisterTransitGatewayResponse) => void): Request<NetworkManager.Types.RegisterTransitGatewayResponse, AWSError>;
  /**
   * Rejects a core network attachment request.
   */
  rejectAttachment(params: NetworkManager.Types.RejectAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.RejectAttachmentResponse) => void): Request<NetworkManager.Types.RejectAttachmentResponse, AWSError>;
  /**
   * Rejects a core network attachment request.
   */
  rejectAttachment(callback?: (err: AWSError, data: NetworkManager.Types.RejectAttachmentResponse) => void): Request<NetworkManager.Types.RejectAttachmentResponse, AWSError>;
  /**
   * Restores a previous policy version as a new, immutable version of a core network policy. A subsequent change set is created showing the differences between the LIVE policy and restored policy.
   */
  restoreCoreNetworkPolicyVersion(params: NetworkManager.Types.RestoreCoreNetworkPolicyVersionRequest, callback?: (err: AWSError, data: NetworkManager.Types.RestoreCoreNetworkPolicyVersionResponse) => void): Request<NetworkManager.Types.RestoreCoreNetworkPolicyVersionResponse, AWSError>;
  /**
   * Restores a previous policy version as a new, immutable version of a core network policy. A subsequent change set is created showing the differences between the LIVE policy and restored policy.
   */
  restoreCoreNetworkPolicyVersion(callback?: (err: AWSError, data: NetworkManager.Types.RestoreCoreNetworkPolicyVersionResponse) => void): Request<NetworkManager.Types.RestoreCoreNetworkPolicyVersionResponse, AWSError>;
  /**
   * Enables the Network Manager service for an Amazon Web Services Organization. This can only be called by a management account within the organization. 
   */
  startOrganizationServiceAccessUpdate(params: NetworkManager.Types.StartOrganizationServiceAccessUpdateRequest, callback?: (err: AWSError, data: NetworkManager.Types.StartOrganizationServiceAccessUpdateResponse) => void): Request<NetworkManager.Types.StartOrganizationServiceAccessUpdateResponse, AWSError>;
  /**
   * Enables the Network Manager service for an Amazon Web Services Organization. This can only be called by a management account within the organization. 
   */
  startOrganizationServiceAccessUpdate(callback?: (err: AWSError, data: NetworkManager.Types.StartOrganizationServiceAccessUpdateResponse) => void): Request<NetworkManager.Types.StartOrganizationServiceAccessUpdateResponse, AWSError>;
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
   * Updates the description of a core network.
   */
  updateCoreNetwork(params: NetworkManager.Types.UpdateCoreNetworkRequest, callback?: (err: AWSError, data: NetworkManager.Types.UpdateCoreNetworkResponse) => void): Request<NetworkManager.Types.UpdateCoreNetworkResponse, AWSError>;
  /**
   * Updates the description of a core network.
   */
  updateCoreNetwork(callback?: (err: AWSError, data: NetworkManager.Types.UpdateCoreNetworkResponse) => void): Request<NetworkManager.Types.UpdateCoreNetworkResponse, AWSError>;
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
  /**
   * Updates a VPC attachment.
   */
  updateVpcAttachment(params: NetworkManager.Types.UpdateVpcAttachmentRequest, callback?: (err: AWSError, data: NetworkManager.Types.UpdateVpcAttachmentResponse) => void): Request<NetworkManager.Types.UpdateVpcAttachmentResponse, AWSError>;
  /**
   * Updates a VPC attachment.
   */
  updateVpcAttachment(callback?: (err: AWSError, data: NetworkManager.Types.UpdateVpcAttachmentResponse) => void): Request<NetworkManager.Types.UpdateVpcAttachmentResponse, AWSError>;
}
declare namespace NetworkManager {
  export type AWSAccountId = string;
  export interface AWSLocation {
    /**
     * The Zone that the device is located in. Specify the ID of an Availability Zone, Local Zone, Wavelength Zone, or an Outpost.
     */
    Zone?: ConstrainedString;
    /**
     * The Amazon Resource Name (ARN) of the subnet that the device is located in.
     */
    SubnetArn?: SubnetArn;
  }
  export interface AcceptAttachmentRequest {
    /**
     * The ID of the attachment. 
     */
    AttachmentId: AttachmentId;
  }
  export interface AcceptAttachmentResponse {
    /**
     * The response to the attachment request. 
     */
    Attachment?: Attachment;
  }
  export type AccountId = string;
  export interface AccountStatus {
    /**
     * The ID of an account within the Amazon Web Services Organization.
     */
    AccountId?: AccountId;
    /**
     * The status of SLR deployment for the account.
     */
    SLRDeploymentStatus?: SLRDeploymentStatus;
  }
  export type AccountStatusList = AccountStatus[];
  export type Action = string;
  export interface AssociateConnectPeerRequest {
    /**
     * The ID of your global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the Connect peer.
     */
    ConnectPeerId: ConnectPeerId;
    /**
     * The ID of the device.
     */
    DeviceId: DeviceId;
    /**
     * The ID of the link.
     */
    LinkId?: LinkId;
  }
  export interface AssociateConnectPeerResponse {
    /**
     * The response to the Connect peer request.
     */
    ConnectPeerAssociation?: ConnectPeerAssociation;
  }
  export interface AssociateCustomerGatewayRequest {
    /**
     * The Amazon Resource Name (ARN) of the customer gateway.
     */
    CustomerGatewayArn: CustomerGatewayArn;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the device.
     */
    DeviceId: DeviceId;
    /**
     * The ID of the link.
     */
    LinkId?: LinkId;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the device.
     */
    DeviceId: DeviceId;
    /**
     * The ID of the link.
     */
    LinkId: LinkId;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The Amazon Resource Name (ARN) of the Connect peer.
     */
    TransitGatewayConnectPeerArn: TransitGatewayConnectPeerArn;
    /**
     * The ID of the device.
     */
    DeviceId: DeviceId;
    /**
     * The ID of the link.
     */
    LinkId?: LinkId;
  }
  export interface AssociateTransitGatewayConnectPeerResponse {
    /**
     * The transit gateway Connect peer association.
     */
    TransitGatewayConnectPeerAssociation?: TransitGatewayConnectPeerAssociation;
  }
  export interface Attachment {
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ARN of a core network.
     */
    CoreNetworkArn?: CoreNetworkArn;
    /**
     * The ID of the attachment.
     */
    AttachmentId?: AttachmentId;
    /**
     * The ID of the attachment account owner.
     */
    OwnerAccountId?: AWSAccountId;
    /**
     * The type of attachment.
     */
    AttachmentType?: AttachmentType;
    /**
     * The state of the attachment.
     */
    State?: AttachmentState;
    /**
     * The Region where the edge is located.
     */
    EdgeLocation?: ExternalRegionCode;
    /**
     * The attachment resource ARN.
     */
    ResourceArn?: ResourceArn;
    /**
     * The policy rule number associated with the attachment.
     */
    AttachmentPolicyRuleNumber?: Integer;
    /**
     * The name of the segment attachment.
     */
    SegmentName?: ConstrainedString;
    /**
     * The tags associated with the attachment.
     */
    Tags?: TagList;
    /**
     * The attachment to move from one segment to another.
     */
    ProposedSegmentChange?: ProposedSegmentChange;
    /**
     * The timestamp when the attachment was created.
     */
    CreatedAt?: DateTime;
    /**
     * The timestamp when the attachment was last updated.
     */
    UpdatedAt?: DateTime;
  }
  export type AttachmentId = string;
  export type AttachmentList = Attachment[];
  export type AttachmentState = "REJECTED"|"PENDING_ATTACHMENT_ACCEPTANCE"|"CREATING"|"FAILED"|"AVAILABLE"|"UPDATING"|"PENDING_NETWORK_UPDATE"|"PENDING_TAG_ACCEPTANCE"|"DELETING"|string;
  export type AttachmentType = "CONNECT"|"SITE_TO_SITE_VPN"|"VPC"|"TRANSIT_GATEWAY_ROUTE_TABLE"|string;
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
  export interface BgpOptions {
    /**
     * The Peer ASN of the BGP.
     */
    PeerAsn?: Long;
  }
  export type Boolean = boolean;
  export type ChangeAction = "ADD"|"MODIFY"|"REMOVE"|string;
  export type ChangeSetState = "PENDING_GENERATION"|"FAILED_GENERATION"|"READY_TO_EXECUTE"|"EXECUTING"|"EXECUTION_SUCCEEDED"|"OUT_OF_DATE"|string;
  export type ChangeStatus = "NOT_STARTED"|"IN_PROGRESS"|"COMPLETE"|"FAILED"|string;
  export type ChangeType = "CORE_NETWORK_SEGMENT"|"CORE_NETWORK_EDGE"|"ATTACHMENT_MAPPING"|"ATTACHMENT_ROUTE_PROPAGATION"|"ATTACHMENT_ROUTE_STATIC"|"CORE_NETWORK_CONFIGURATION"|"SEGMENTS_CONFIGURATION"|"SEGMENT_ACTIONS_CONFIGURATION"|"ATTACHMENT_POLICIES_CONFIGURATION"|string;
  export type ClientToken = string;
  export interface ConnectAttachment {
    /**
     * The attachment details.
     */
    Attachment?: Attachment;
    /**
     * The ID of the transport attachment.
     */
    TransportAttachmentId?: AttachmentId;
    /**
     * Options for connecting an attachment.
     */
    Options?: ConnectAttachmentOptions;
  }
  export interface ConnectAttachmentOptions {
    /**
     * The protocol used for the attachment connection.
     */
    Protocol?: TunnelProtocol;
  }
  export interface ConnectPeer {
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ID of the attachment to connect.
     */
    ConnectAttachmentId?: AttachmentId;
    /**
     * The ID of the Connect peer.
     */
    ConnectPeerId?: ConnectPeerId;
    /**
     * The Connect peer Regions where edges are located.
     */
    EdgeLocation?: ExternalRegionCode;
    /**
     * The state of the Connect peer.
     */
    State?: ConnectPeerState;
    /**
     * The timestamp when the Connect peer was created.
     */
    CreatedAt?: DateTime;
    /**
     * The configuration of the Connect peer.
     */
    Configuration?: ConnectPeerConfiguration;
    /**
     * The list of key-value tags associated with the Connect peer.
     */
    Tags?: TagList;
  }
  export interface ConnectPeerAssociation {
    /**
     * The ID of the Connect peer.
     */
    ConnectPeerId?: ConnectPeerId;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The ID of the device to connect to.
     */
    DeviceId?: DeviceId;
    /**
     * The ID of the link.
     */
    LinkId?: LinkId;
    /**
     * The state of the Connect peer association.
     */
    State?: ConnectPeerAssociationState;
  }
  export type ConnectPeerAssociationList = ConnectPeerAssociation[];
  export type ConnectPeerAssociationState = "PENDING"|"AVAILABLE"|"DELETING"|"DELETED"|string;
  export interface ConnectPeerBgpConfiguration {
    /**
     * The ASN of the Coret Network.
     */
    CoreNetworkAsn?: Long;
    /**
     * The ASN of the Connect peer.
     */
    PeerAsn?: Long;
    /**
     * The address of a core network.
     */
    CoreNetworkAddress?: IPAddress;
    /**
     * The address of a core network Connect peer.
     */
    PeerAddress?: IPAddress;
  }
  export type ConnectPeerBgpConfigurationList = ConnectPeerBgpConfiguration[];
  export interface ConnectPeerConfiguration {
    /**
     * The IP address of a core network.
     */
    CoreNetworkAddress?: IPAddress;
    /**
     * The IP address of the Connect peer.
     */
    PeerAddress?: IPAddress;
    /**
     * The inside IP addresses used for a Connect peer configuration.
     */
    InsideCidrBlocks?: ConstrainedStringList;
    /**
     * The protocol used for a Connect peer configuration.
     */
    Protocol?: TunnelProtocol;
    /**
     * The Connect peer BGP configurations.
     */
    BgpConfigurations?: ConnectPeerBgpConfigurationList;
  }
  export type ConnectPeerId = string;
  export type ConnectPeerIdList = ConnectPeerId[];
  export type ConnectPeerState = "CREATING"|"FAILED"|"AVAILABLE"|"DELETING"|string;
  export interface ConnectPeerSummary {
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ID of a Connect peer attachment.
     */
    ConnectAttachmentId?: AttachmentId;
    /**
     * The ID of a Connect peer.
     */
    ConnectPeerId?: ConnectPeerId;
    /**
     * The Region where the edge is located.
     */
    EdgeLocation?: ExternalRegionCode;
    /**
     * The state of a Connect peer.
     */
    ConnectPeerState?: ConnectPeerState;
    /**
     * The timestamp when a Connect peer was created.
     */
    CreatedAt?: DateTime;
    /**
     * The list of key-value tags associated with the Connect peer summary.
     */
    Tags?: TagList;
  }
  export type ConnectPeerSummaryList = ConnectPeerSummary[];
  export interface Connection {
    /**
     * The ID of the connection.
     */
    ConnectionId?: ConnectionId;
    /**
     * The Amazon Resource Name (ARN) of the connection.
     */
    ConnectionArn?: ConnectionArn;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The ID of the first device in the connection.
     */
    DeviceId?: DeviceId;
    /**
     * The ID of the second device in the connection.
     */
    ConnectedDeviceId?: DeviceId;
    /**
     * The ID of the link for the first device in the connection.
     */
    LinkId?: LinkId;
    /**
     * The ID of the link for the second device in the connection.
     */
    ConnectedLinkId?: LinkId;
    /**
     * The description of the connection.
     */
    Description?: ConstrainedString;
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
  export type ConnectionArn = string;
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
  export type ConnectionId = string;
  export type ConnectionIdList = ConnectionId[];
  export type ConnectionList = Connection[];
  export type ConnectionState = "PENDING"|"AVAILABLE"|"DELETING"|"UPDATING"|string;
  export type ConnectionStatus = "UP"|"DOWN"|string;
  export type ConnectionType = "BGP"|"IPSEC"|string;
  export type ConstrainedString = string;
  export type ConstrainedStringList = ConstrainedString[];
  export interface CoreNetwork {
    /**
     * The ID of the global network that your core network is a part of. 
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ARN of a core network.
     */
    CoreNetworkArn?: CoreNetworkArn;
    /**
     * The description of a core network.
     */
    Description?: ConstrainedString;
    /**
     * The timestamp when a core network was created.
     */
    CreatedAt?: DateTime;
    /**
     * The current state of a core network.
     */
    State?: CoreNetworkState;
    /**
     * The segments within a core network.
     */
    Segments?: CoreNetworkSegmentList;
    /**
     * The edges within a core network.
     */
    Edges?: CoreNetworkEdgeList;
    /**
     * The list of key-value tags associated with a core network.
     */
    Tags?: TagList;
  }
  export type CoreNetworkArn = string;
  export interface CoreNetworkChange {
    /**
     * The type of change.
     */
    Type?: ChangeType;
    /**
     * The action to take for a core network.
     */
    Action?: ChangeAction;
    /**
     * The resource identifier.
     */
    Identifier?: ConstrainedString;
    /**
     * The previous values for a core network.
     */
    PreviousValues?: CoreNetworkChangeValues;
    /**
     * The new value for a core network
     */
    NewValues?: CoreNetworkChangeValues;
    /**
     * Uniquely identifies the path for a change within the changeset. For example, the IdentifierPath for a core network segment change might be "CORE_NETWORK_SEGMENT/us-east-1/devsegment".
     */
    IdentifierPath?: ConstrainedString;
  }
  export interface CoreNetworkChangeEvent {
    /**
     * Describes the type of change event. 
     */
    Type?: ChangeType;
    /**
     * The action taken for the change event.
     */
    Action?: ChangeAction;
    /**
     * Uniquely identifies the path for a change within the changeset. For example, the IdentifierPath for a core network segment change might be "CORE_NETWORK_SEGMENT/us-east-1/devsegment".
     */
    IdentifierPath?: ConstrainedString;
    /**
     * The timestamp for an event change in status.
     */
    EventTime?: DateTime;
    /**
     * The status of the core network change event.
     */
    Status?: ChangeStatus;
    /**
     * Details of the change event.
     */
    Values?: CoreNetworkChangeEventValues;
  }
  export type CoreNetworkChangeEventList = CoreNetworkChangeEvent[];
  export interface CoreNetworkChangeEventValues {
    /**
     * The edge location for the core network change event.
     */
    EdgeLocation?: ExternalRegionCode;
    /**
     * The segment name if the change event is associated with a segment.
     */
    SegmentName?: ConstrainedString;
    /**
     * The ID of the attachment if the change event is associated with an attachment. 
     */
    AttachmentId?: AttachmentId;
    /**
     * For a STATIC_ROUTE event, this is the IP address.
     */
    Cidr?: ConstrainedString;
  }
  export type CoreNetworkChangeList = CoreNetworkChange[];
  export interface CoreNetworkChangeValues {
    /**
     * The names of the segments in a core network.
     */
    SegmentName?: ConstrainedString;
    /**
     * The Regions where edges are located in a core network. 
     */
    EdgeLocations?: ExternalRegionCodeList;
    /**
     * The ASN of a core network.
     */
    Asn?: Long;
    /**
     * The IP addresses used for a core network.
     */
    Cidr?: ConstrainedString;
    /**
     * The ID of the destination.
     */
    DestinationIdentifier?: ConstrainedString;
    /**
     * The inside IP addresses used for core network change values.
     */
    InsideCidrBlocks?: ConstrainedStringList;
    /**
     * The shared segments for a core network change value. 
     */
    SharedSegments?: ConstrainedStringList;
  }
  export interface CoreNetworkEdge {
    /**
     * The Region where a core network edge is located.
     */
    EdgeLocation?: ExternalRegionCode;
    /**
     * The ASN of a core network edge.
     */
    Asn?: Long;
    /**
     * The inside IP addresses used for core network edges.
     */
    InsideCidrBlocks?: ConstrainedStringList;
  }
  export type CoreNetworkEdgeList = CoreNetworkEdge[];
  export type CoreNetworkId = string;
  export interface CoreNetworkPolicy {
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ID of the policy version.
     */
    PolicyVersionId?: Integer;
    /**
     * Whether a core network policy is the current LIVE policy or the most recently submitted policy.
     */
    Alias?: CoreNetworkPolicyAlias;
    /**
     * The description of a core network policy.
     */
    Description?: ConstrainedString;
    /**
     * The timestamp when a core network policy was created.
     */
    CreatedAt?: DateTime;
    /**
     * The state of a core network policy.
     */
    ChangeSetState?: ChangeSetState;
    /**
     * Describes any errors in a core network policy.
     */
    PolicyErrors?: CoreNetworkPolicyErrorList;
    /**
     * Describes a core network policy.
     */
    PolicyDocument?: CoreNetworkPolicyDocument;
  }
  export type CoreNetworkPolicyAlias = "LIVE"|"LATEST"|string;
  export type CoreNetworkPolicyDocument = string;
  export interface CoreNetworkPolicyError {
    /**
     * The error code associated with a core network policy error.
     */
    ErrorCode: ServerSideString;
    /**
     * The message associated with a core network policy error code.
     */
    Message: ServerSideString;
    /**
     * The JSON path where the error was discovered in the policy document.
     */
    Path?: ServerSideString;
  }
  export type CoreNetworkPolicyErrorList = CoreNetworkPolicyError[];
  export interface CoreNetworkPolicyVersion {
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ID of the policy version.
     */
    PolicyVersionId?: Integer;
    /**
     * Whether a core network policy is the current policy or the most recently submitted policy.
     */
    Alias?: CoreNetworkPolicyAlias;
    /**
     * The description of a core network policy version.
     */
    Description?: ConstrainedString;
    /**
     * The timestamp when a core network policy version was created.
     */
    CreatedAt?: DateTime;
    /**
     * The status of the policy version change set.
     */
    ChangeSetState?: ChangeSetState;
  }
  export type CoreNetworkPolicyVersionList = CoreNetworkPolicyVersion[];
  export interface CoreNetworkSegment {
    /**
     * The name of a core network segment.
     */
    Name?: ConstrainedString;
    /**
     * The Regions where the edges are located.
     */
    EdgeLocations?: ExternalRegionCodeList;
    /**
     * The shared segments of a core network.
     */
    SharedSegments?: ConstrainedStringList;
  }
  export interface CoreNetworkSegmentEdgeIdentifier {
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The name of the segment edge.
     */
    SegmentName?: ConstrainedString;
    /**
     * The Region where the segment edge is located.
     */
    EdgeLocation?: ExternalRegionCode;
  }
  export type CoreNetworkSegmentList = CoreNetworkSegment[];
  export type CoreNetworkState = "CREATING"|"UPDATING"|"AVAILABLE"|"DELETING"|string;
  export interface CoreNetworkSummary {
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * a core network ARN.
     */
    CoreNetworkArn?: CoreNetworkArn;
    /**
     * The global network ID.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The ID of the account owner.
     */
    OwnerAccountId?: AWSAccountId;
    /**
     * The state of a core network.
     */
    State?: CoreNetworkState;
    /**
     * The description of a core network.
     */
    Description?: ConstrainedString;
    /**
     * The key-value tags associated with a core network summary.
     */
    Tags?: TagList;
  }
  export type CoreNetworkSummaryList = CoreNetworkSummary[];
  export interface CreateConnectAttachmentRequest {
    /**
     * The ID of a core network where you want to create the attachment. 
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The Region where the edge is located.
     */
    EdgeLocation: ExternalRegionCode;
    /**
     * The ID of the attachment between the two connections.
     */
    TransportAttachmentId: AttachmentId;
    /**
     * Options for creating an attachment.
     */
    Options: ConnectAttachmentOptions;
    /**
     * The list of key-value tags associated with the request.
     */
    Tags?: TagList;
    /**
     * The client token associated with the request.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateConnectAttachmentResponse {
    /**
     * The response to a Connect attachment request.
     */
    ConnectAttachment?: ConnectAttachment;
  }
  export interface CreateConnectPeerRequest {
    /**
     * The ID of the connection attachment.
     */
    ConnectAttachmentId: AttachmentId;
    /**
     * A Connect peer core network address.
     */
    CoreNetworkAddress?: IPAddress;
    /**
     * The Connect peer address.
     */
    PeerAddress: IPAddress;
    /**
     * The Connect peer BGP options.
     */
    BgpOptions?: BgpOptions;
    /**
     * The inside IP addresses used for BGP peering.
     */
    InsideCidrBlocks: ConstrainedStringList;
    /**
     * The tags associated with the peer request.
     */
    Tags?: TagList;
    /**
     * The client token associated with the request.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateConnectPeerResponse {
    /**
     * The response to the request.
     */
    ConnectPeer?: ConnectPeer;
  }
  export interface CreateConnectionRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the first device in the connection.
     */
    DeviceId: DeviceId;
    /**
     * The ID of the second device in the connection.
     */
    ConnectedDeviceId: DeviceId;
    /**
     * The ID of the link for the first device.
     */
    LinkId?: LinkId;
    /**
     * The ID of the link for the second device.
     */
    ConnectedLinkId?: LinkId;
    /**
     * A description of the connection. Length Constraints: Maximum length of 256 characters.
     */
    Description?: ConstrainedString;
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
  export interface CreateCoreNetworkRequest {
    /**
     * The ID of the global network that a core network will be a part of. 
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The description of a core network.
     */
    Description?: ConstrainedString;
    /**
     * Key-value tags associated with a core network request.
     */
    Tags?: TagList;
    /**
     * The policy document for creating a core network.
     */
    PolicyDocument?: CoreNetworkPolicyDocument;
    /**
     * The client token associated with a core network request.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateCoreNetworkResponse {
    /**
     * Returns details about a core network.
     */
    CoreNetwork?: CoreNetwork;
  }
  export interface CreateDeviceRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The Amazon Web Services location of the device, if applicable. For an on-premises device, you can omit this parameter.
     */
    AWSLocation?: AWSLocation;
    /**
     * A description of the device. Constraints: Maximum length of 256 characters.
     */
    Description?: ConstrainedString;
    /**
     * The type of the device.
     */
    Type?: ConstrainedString;
    /**
     * The vendor of the device. Constraints: Maximum length of 128 characters.
     */
    Vendor?: ConstrainedString;
    /**
     * The model of the device. Constraints: Maximum length of 128 characters.
     */
    Model?: ConstrainedString;
    /**
     * The serial number of the device. Constraints: Maximum length of 128 characters.
     */
    SerialNumber?: ConstrainedString;
    /**
     * The location of the device.
     */
    Location?: Location;
    /**
     * The ID of the site.
     */
    SiteId?: SiteId;
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
    Description?: ConstrainedString;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * A description of the link. Constraints: Maximum length of 256 characters.
     */
    Description?: ConstrainedString;
    /**
     * The type of the link. Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
     */
    Type?: ConstrainedString;
    /**
     *  The upload speed and download speed in Mbps. 
     */
    Bandwidth: Bandwidth;
    /**
     * The provider of the link. Constraints: Maximum length of 128 characters. Cannot include the following characters: | \ ^
     */
    Provider?: ConstrainedString;
    /**
     * The ID of the site.
     */
    SiteId: SiteId;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * A description of your site. Constraints: Maximum length of 256 characters.
     */
    Description?: ConstrainedString;
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
  export interface CreateSiteToSiteVpnAttachmentRequest {
    /**
     * The ID of a core network where you're creating a site-to-site VPN attachment.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The ARN identifying the VPN attachment.
     */
    VpnConnectionArn: VpnConnectionArn;
    /**
     * The tags associated with the request.
     */
    Tags?: TagList;
    /**
     * The client token associated with the request.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateSiteToSiteVpnAttachmentResponse {
    /**
     * Details about a site-to-site VPN attachment.
     */
    SiteToSiteVpnAttachment?: SiteToSiteVpnAttachment;
  }
  export interface CreateTransitGatewayPeeringRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The ARN of the transit gateway for the peering request.
     */
    TransitGatewayArn: TransitGatewayArn;
    /**
     * The list of key-value tags associated with the request.
     */
    Tags?: TagList;
    /**
     * The client token associated with the request.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateTransitGatewayPeeringResponse {
    /**
     * Returns information about the transit gateway peering connection request.
     */
    TransitGatewayPeering?: TransitGatewayPeering;
  }
  export interface CreateTransitGatewayRouteTableAttachmentRequest {
    /**
     * The ID of the peer for the 
     */
    PeeringId: PeeringId;
    /**
     * The ARN of the transit gateway route table for the attachment request. For example, "TransitGatewayRouteTableArn": "arn:aws:ec2:us-west-2:123456789012:transit-gateway-route-table/tgw-rtb-9876543210123456".
     */
    TransitGatewayRouteTableArn: TransitGatewayRouteTableArn;
    /**
     * The list of key-value tags associated with the request.
     */
    Tags?: TagList;
    /**
     * The client token associated with the request.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateTransitGatewayRouteTableAttachmentResponse {
    /**
     * The route table associated with the create transit gateway route table attachment request.
     */
    TransitGatewayRouteTableAttachment?: TransitGatewayRouteTableAttachment;
  }
  export interface CreateVpcAttachmentRequest {
    /**
     * The ID of a core network for the VPC attachment.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The ARN of the VPC.
     */
    VpcArn: VpcArn;
    /**
     * The subnet ARN of the VPC attachment.
     */
    SubnetArns: SubnetArnList;
    /**
     * Options for the VPC attachment.
     */
    Options?: VpcOptions;
    /**
     * The key-value tags associated with the request.
     */
    Tags?: TagList;
    /**
     * The client token associated with the request.
     */
    ClientToken?: ClientToken;
  }
  export interface CreateVpcAttachmentResponse {
    /**
     * Provides details about the VPC attachment.
     */
    VpcAttachment?: VpcAttachment;
  }
  export type CustomerGatewayArn = string;
  export type CustomerGatewayArnList = CustomerGatewayArn[];
  export interface CustomerGatewayAssociation {
    /**
     * The Amazon Resource Name (ARN) of the customer gateway.
     */
    CustomerGatewayArn?: CustomerGatewayArn;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The ID of the device.
     */
    DeviceId?: DeviceId;
    /**
     * The ID of the link.
     */
    LinkId?: LinkId;
    /**
     * The association state.
     */
    State?: CustomerGatewayAssociationState;
  }
  export type CustomerGatewayAssociationList = CustomerGatewayAssociation[];
  export type CustomerGatewayAssociationState = "PENDING"|"AVAILABLE"|"DELETING"|"DELETED"|string;
  export type DateTime = Date;
  export interface DeleteAttachmentRequest {
    /**
     * The ID of the attachment to delete.
     */
    AttachmentId: AttachmentId;
  }
  export interface DeleteAttachmentResponse {
    /**
     * Information about the deleted attachment.
     */
    Attachment?: Attachment;
  }
  export interface DeleteConnectPeerRequest {
    /**
     * The ID of the deleted Connect peer.
     */
    ConnectPeerId: ConnectPeerId;
  }
  export interface DeleteConnectPeerResponse {
    /**
     * Information about the deleted Connect peer.
     */
    ConnectPeer?: ConnectPeer;
  }
  export interface DeleteConnectionRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the connection.
     */
    ConnectionId: ConnectionId;
  }
  export interface DeleteConnectionResponse {
    /**
     * Information about the connection.
     */
    Connection?: Connection;
  }
  export interface DeleteCoreNetworkPolicyVersionRequest {
    /**
     * The ID of a core network for the deleted policy.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The version ID of the deleted policy.
     */
    PolicyVersionId: Integer;
  }
  export interface DeleteCoreNetworkPolicyVersionResponse {
    /**
     * Returns information about the deleted policy version. 
     */
    CoreNetworkPolicy?: CoreNetworkPolicy;
  }
  export interface DeleteCoreNetworkRequest {
    /**
     * The network ID of the deleted core network.
     */
    CoreNetworkId: CoreNetworkId;
  }
  export interface DeleteCoreNetworkResponse {
    /**
     * Information about the deleted core network.
     */
    CoreNetwork?: CoreNetwork;
  }
  export interface DeleteDeviceRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the device.
     */
    DeviceId: DeviceId;
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
    GlobalNetworkId: GlobalNetworkId;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the link.
     */
    LinkId: LinkId;
  }
  export interface DeleteLinkResponse {
    /**
     * Information about the link.
     */
    Link?: Link;
  }
  export interface DeletePeeringRequest {
    /**
     * The ID of the peering connection to delete.
     */
    PeeringId: PeeringId;
  }
  export interface DeletePeeringResponse {
    /**
     * Information about a deleted peering connection.
     */
    Peering?: Peering;
  }
  export interface DeleteResourcePolicyRequest {
    /**
     * The ARN of the policy to delete.
     */
    ResourceArn: ResourceArn;
  }
  export interface DeleteResourcePolicyResponse {
  }
  export interface DeleteSiteRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the site.
     */
    SiteId: SiteId;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The Amazon Resource Name (ARN) of the transit gateway.
     */
    TransitGatewayArn: TransitGatewayArn;
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
    GlobalNetworkIds?: GlobalNetworkIdList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeGlobalNetworksResponse {
    /**
     * Information about the global networks.
     */
    GlobalNetworks?: GlobalNetworkList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface Device {
    /**
     * The ID of the device.
     */
    DeviceId?: DeviceId;
    /**
     * The Amazon Resource Name (ARN) of the device.
     */
    DeviceArn?: DeviceArn;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The Amazon Web Services location of the device.
     */
    AWSLocation?: AWSLocation;
    /**
     * The description of the device.
     */
    Description?: ConstrainedString;
    /**
     * The device type.
     */
    Type?: ConstrainedString;
    /**
     * The device vendor.
     */
    Vendor?: ConstrainedString;
    /**
     * The device model.
     */
    Model?: ConstrainedString;
    /**
     * The device serial number.
     */
    SerialNumber?: ConstrainedString;
    /**
     * The site location.
     */
    Location?: Location;
    /**
     * The site ID.
     */
    SiteId?: SiteId;
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
  export type DeviceArn = string;
  export type DeviceId = string;
  export type DeviceIdList = DeviceId[];
  export type DeviceList = Device[];
  export type DeviceState = "PENDING"|"AVAILABLE"|"DELETING"|"UPDATING"|string;
  export interface DisassociateConnectPeerRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the Connect peer to disassociate from a device.
     */
    ConnectPeerId: ConnectPeerId;
  }
  export interface DisassociateConnectPeerResponse {
    /**
     * Describes the Connect peer association.
     */
    ConnectPeerAssociation?: ConnectPeerAssociation;
  }
  export interface DisassociateCustomerGatewayRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The Amazon Resource Name (ARN) of the customer gateway.
     */
    CustomerGatewayArn: CustomerGatewayArn;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the device.
     */
    DeviceId: DeviceId;
    /**
     * The ID of the link.
     */
    LinkId: LinkId;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The Amazon Resource Name (ARN) of the transit gateway Connect peer.
     */
    TransitGatewayConnectPeerArn: TransitGatewayConnectPeerArn;
  }
  export interface DisassociateTransitGatewayConnectPeerResponse {
    /**
     * The transit gateway Connect peer association.
     */
    TransitGatewayConnectPeerAssociation?: TransitGatewayConnectPeerAssociation;
  }
  export interface ExecuteCoreNetworkChangeSetRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The ID of the policy version.
     */
    PolicyVersionId: Integer;
  }
  export interface ExecuteCoreNetworkChangeSetResponse {
  }
  export type ExternalRegionCode = string;
  export type ExternalRegionCodeList = ExternalRegionCode[];
  export type FilterMap = {[key: string]: FilterValues};
  export type FilterName = string;
  export type FilterValue = string;
  export type FilterValues = FilterValue[];
  export interface GetConnectAttachmentRequest {
    /**
     * The ID of the attachment.
     */
    AttachmentId: AttachmentId;
  }
  export interface GetConnectAttachmentResponse {
    /**
     * Details about the Connect attachment.
     */
    ConnectAttachment?: ConnectAttachment;
  }
  export interface GetConnectPeerAssociationsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The IDs of the Connect peers.
     */
    ConnectPeerIds?: ConnectPeerIdList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetConnectPeerAssociationsResponse {
    /**
     * Displays a list of Connect peer associations.
     */
    ConnectPeerAssociations?: ConnectPeerAssociationList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetConnectPeerRequest {
    /**
     * The ID of the Connect peer.
     */
    ConnectPeerId: ConnectPeerId;
  }
  export interface GetConnectPeerResponse {
    /**
     * Returns information about a core network Connect peer.
     */
    ConnectPeer?: ConnectPeer;
  }
  export interface GetConnectionsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * One or more connection IDs.
     */
    ConnectionIds?: ConnectionIdList;
    /**
     * The ID of the device.
     */
    DeviceId?: DeviceId;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetConnectionsResponse {
    /**
     * Information about the connections.
     */
    Connections?: ConnectionList;
    /**
     * The token to use for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetCoreNetworkChangeEventsRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The ID of the policy version.
     */
    PolicyVersionId: Integer;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetCoreNetworkChangeEventsResponse {
    /**
     * The response to GetCoreNetworkChangeEventsRequest.
     */
    CoreNetworkChangeEvents?: CoreNetworkChangeEventList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetCoreNetworkChangeSetRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The ID of the policy version.
     */
    PolicyVersionId: Integer;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetCoreNetworkChangeSetResponse {
    /**
     * Describes a core network changes.
     */
    CoreNetworkChanges?: CoreNetworkChangeList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetCoreNetworkPolicyRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The ID of a core network policy version.
     */
    PolicyVersionId?: Integer;
    /**
     * The alias of a core network policy 
     */
    Alias?: CoreNetworkPolicyAlias;
  }
  export interface GetCoreNetworkPolicyResponse {
    /**
     * The details about a core network policy.
     */
    CoreNetworkPolicy?: CoreNetworkPolicy;
  }
  export interface GetCoreNetworkRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId: CoreNetworkId;
  }
  export interface GetCoreNetworkResponse {
    /**
     * Details about a core network.
     */
    CoreNetwork?: CoreNetwork;
  }
  export interface GetCustomerGatewayAssociationsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * One or more customer gateway Amazon Resource Names (ARNs). The maximum is 10.
     */
    CustomerGatewayArns?: CustomerGatewayArnList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetCustomerGatewayAssociationsResponse {
    /**
     * The customer gateway associations.
     */
    CustomerGatewayAssociations?: CustomerGatewayAssociationList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetDevicesRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * One or more device IDs. The maximum is 10.
     */
    DeviceIds?: DeviceIdList;
    /**
     * The ID of the site.
     */
    SiteId?: SiteId;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetDevicesResponse {
    /**
     * The devices.
     */
    Devices?: DeviceList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetLinkAssociationsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the device.
     */
    DeviceId?: DeviceId;
    /**
     * The ID of the link.
     */
    LinkId?: LinkId;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetLinkAssociationsResponse {
    /**
     * The link associations.
     */
    LinkAssociations?: LinkAssociationList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetLinksRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * One or more link IDs. The maximum is 10.
     */
    LinkIds?: LinkIdList;
    /**
     * The ID of the site.
     */
    SiteId?: SiteId;
    /**
     * The link type.
     */
    Type?: ConstrainedString;
    /**
     * The link provider.
     */
    Provider?: ConstrainedString;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetLinksResponse {
    /**
     * The links.
     */
    Links?: LinkList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetNetworkResourceCountsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The resource type. The following are the supported resource types for Direct Connect:    dxcon     dx-gateway     dx-vif    The following are the supported resource types for Network Manager:    connection     device     link     site    The following are the supported resource types for Amazon VPC:    customer-gateway     transit-gateway     transit-gateway-attachment     transit-gateway-connect-peer     transit-gateway-route-table     vpn-connection   
     */
    ResourceType?: ConstrainedString;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetNetworkResourceCountsResponse {
    /**
     * The count of resources.
     */
    NetworkResourceCounts?: NetworkResourceCountList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetNetworkResourceRelationshipsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ARN of the registered gateway.
     */
    RegisteredGatewayArn?: ResourceArn;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: ExternalRegionCode;
    /**
     * The Amazon Web Services account ID.
     */
    AccountId?: AWSAccountId;
    /**
     * The resource type. The following are the supported resource types for Direct Connect:    dxcon     dx-gateway     dx-vif    The following are the supported resource types for Network Manager:    connection     device     link     site    The following are the supported resource types for Amazon VPC:    customer-gateway     transit-gateway     transit-gateway-attachment     transit-gateway-connect-peer     transit-gateway-route-table     vpn-connection   
     */
    ResourceType?: ConstrainedString;
    /**
     * The ARN of the gateway.
     */
    ResourceArn?: ResourceArn;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetNetworkResourceRelationshipsResponse {
    /**
     * The resource relationships.
     */
    Relationships?: RelationshipList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetNetworkResourcesRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ARN of the gateway.
     */
    RegisteredGatewayArn?: ResourceArn;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: ExternalRegionCode;
    /**
     * The Amazon Web Services account ID.
     */
    AccountId?: AWSAccountId;
    /**
     * The resource type. The following are the supported resource types for Direct Connect:    dxcon - The definition model is Connection.    dx-gateway - The definition model is DirectConnectGateway.    dx-vif - The definition model is VirtualInterface.   The following are the supported resource types for Network Manager:    connection - The definition model is Connection.    device - The definition model is Device.    link - The definition model is Link.    site - The definition model is Site.   The following are the supported resource types for Amazon VPC:    customer-gateway - The definition model is CustomerGateway.    transit-gateway - The definition model is TransitGateway.    transit-gateway-attachment - The definition model is TransitGatewayAttachment.    transit-gateway-connect-peer - The definition model is TransitGatewayConnectPeer.    transit-gateway-route-table - The definition model is TransitGatewayRouteTable.    vpn-connection - The definition model is VpnConnection.  
     */
    ResourceType?: ConstrainedString;
    /**
     * The ARN of the resource.
     */
    ResourceArn?: ResourceArn;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetNetworkResourcesResponse {
    /**
     * The network resources.
     */
    NetworkResources?: NetworkResourceList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetNetworkRoutesRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the route table.
     */
    RouteTableIdentifier: RouteTableIdentifier;
    /**
     * An exact CIDR block.
     */
    ExactCidrMatches?: ConstrainedStringList;
    /**
     * The most specific route that matches the traffic (longest prefix match).
     */
    LongestPrefixMatches?: ConstrainedStringList;
    /**
     * The routes with a subnet that match the specified CIDR filter.
     */
    SubnetOfMatches?: ConstrainedStringList;
    /**
     * The routes with a CIDR that encompasses the CIDR filter. Example: If you specify 10.0.1.0/30, then the result returns 10.0.1.0/29.
     */
    SupernetOfMatches?: ConstrainedStringList;
    /**
     * The IDs of the prefix lists.
     */
    PrefixListIds?: ConstrainedStringList;
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
    RouteTableArn?: ResourceArn;
    /**
     * Describes a core network segment edge.
     */
    CoreNetworkSegmentEdge?: CoreNetworkSegmentEdgeIdentifier;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ARN of the gateway.
     */
    RegisteredGatewayArn?: ResourceArn;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: ExternalRegionCode;
    /**
     * The Amazon Web Services account ID.
     */
    AccountId?: AWSAccountId;
    /**
     * The resource type. The following are the supported resource types for Direct Connect:    dxcon     dx-gateway     dx-vif    The following are the supported resource types for Network Manager:    connection     device     link     site    The following are the supported resource types for Amazon VPC:    customer-gateway     transit-gateway     transit-gateway-attachment     transit-gateway-connect-peer     transit-gateway-route-table     vpn-connection   
     */
    ResourceType?: ConstrainedString;
    /**
     * The ARN of the resource.
     */
    ResourceArn?: ResourceArn;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetNetworkTelemetryResponse {
    /**
     * The network telemetry.
     */
    NetworkTelemetry?: NetworkTelemetryList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetResourcePolicyRequest {
    /**
     * The ARN of the resource.
     */
    ResourceArn: ResourceArn;
  }
  export interface GetResourcePolicyResponse {
    /**
     * The resource policy document.
     */
    PolicyDocument?: ResourcePolicyDocument;
  }
  export interface GetRouteAnalysisRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the route analysis.
     */
    RouteAnalysisId: ConstrainedString;
  }
  export interface GetRouteAnalysisResponse {
    /**
     * The route analysis.
     */
    RouteAnalysis?: RouteAnalysis;
  }
  export interface GetSiteToSiteVpnAttachmentRequest {
    /**
     * The ID of the attachment.
     */
    AttachmentId: AttachmentId;
  }
  export interface GetSiteToSiteVpnAttachmentResponse {
    /**
     * Describes the site-to-site attachment.
     */
    SiteToSiteVpnAttachment?: SiteToSiteVpnAttachment;
  }
  export interface GetSitesRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * One or more site IDs. The maximum is 10.
     */
    SiteIds?: SiteIdList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetSitesResponse {
    /**
     * The sites.
     */
    Sites?: SiteList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetTransitGatewayConnectPeerAssociationsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * One or more transit gateway Connect peer Amazon Resource Names (ARNs).
     */
    TransitGatewayConnectPeerArns?: TransitGatewayConnectPeerArnList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetTransitGatewayConnectPeerAssociationsResponse {
    /**
     * Information about the transit gateway Connect peer associations.
     */
    TransitGatewayConnectPeerAssociations?: TransitGatewayConnectPeerAssociationList;
    /**
     * The token to use for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetTransitGatewayPeeringRequest {
    /**
     * The ID of the peering request.
     */
    PeeringId: PeeringId;
  }
  export interface GetTransitGatewayPeeringResponse {
    /**
     * Returns information about a transit gateway peering. 
     */
    TransitGatewayPeering?: TransitGatewayPeering;
  }
  export interface GetTransitGatewayRegistrationsRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The Amazon Resource Names (ARNs) of one or more transit gateways. The maximum is 10.
     */
    TransitGatewayArns?: TransitGatewayArnList;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetTransitGatewayRegistrationsResponse {
    /**
     * The transit gateway registrations.
     */
    TransitGatewayRegistrations?: TransitGatewayRegistrationList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetTransitGatewayRouteTableAttachmentRequest {
    /**
     * The ID of the transit gateway route table attachment.
     */
    AttachmentId: AttachmentId;
  }
  export interface GetTransitGatewayRouteTableAttachmentResponse {
    /**
     * Returns information about the transit gateway route table attachment.
     */
    TransitGatewayRouteTableAttachment?: TransitGatewayRouteTableAttachment;
  }
  export interface GetVpcAttachmentRequest {
    /**
     * The ID of the attachment.
     */
    AttachmentId: AttachmentId;
  }
  export interface GetVpcAttachmentResponse {
    /**
     * Returns details about a VPC attachment.
     */
    VpcAttachment?: VpcAttachment;
  }
  export interface GlobalNetwork {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The Amazon Resource Name (ARN) of the global network.
     */
    GlobalNetworkArn?: GlobalNetworkArn;
    /**
     * The description of the global network.
     */
    Description?: ConstrainedString;
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
  export type GlobalNetworkArn = string;
  export type GlobalNetworkId = string;
  export type GlobalNetworkIdList = GlobalNetworkId[];
  export type GlobalNetworkList = GlobalNetwork[];
  export type GlobalNetworkState = "PENDING"|"AVAILABLE"|"DELETING"|"UPDATING"|string;
  export type IPAddress = string;
  export type Integer = number;
  export interface Link {
    /**
     * The ID of the link.
     */
    LinkId?: LinkId;
    /**
     * The Amazon Resource Name (ARN) of the link.
     */
    LinkArn?: LinkArn;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The ID of the site.
     */
    SiteId?: SiteId;
    /**
     * The description of the link.
     */
    Description?: ConstrainedString;
    /**
     * The type of the link.
     */
    Type?: ConstrainedString;
    /**
     * The bandwidth for the link.
     */
    Bandwidth?: Bandwidth;
    /**
     * The provider of the link.
     */
    Provider?: ConstrainedString;
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
  export type LinkArn = string;
  export interface LinkAssociation {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The device ID for the link association.
     */
    DeviceId?: DeviceId;
    /**
     * The ID of the link.
     */
    LinkId?: LinkId;
    /**
     * The state of the association.
     */
    LinkAssociationState?: LinkAssociationState;
  }
  export type LinkAssociationList = LinkAssociation[];
  export type LinkAssociationState = "PENDING"|"AVAILABLE"|"DELETING"|"DELETED"|string;
  export type LinkId = string;
  export type LinkIdList = LinkId[];
  export type LinkList = Link[];
  export type LinkState = "PENDING"|"AVAILABLE"|"DELETING"|"UPDATING"|string;
  export interface ListAttachmentsRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The type of attachment.
     */
    AttachmentType?: AttachmentType;
    /**
     * The Region where the edge is located.
     */
    EdgeLocation?: ExternalRegionCode;
    /**
     * The state of the attachment.
     */
    State?: AttachmentState;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListAttachmentsResponse {
    /**
     * Describes the list of attachments.
     */
    Attachments?: AttachmentList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListConnectPeersRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ID of the attachment.
     */
    ConnectAttachmentId?: AttachmentId;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListConnectPeersResponse {
    /**
     * Describes the Connect peers.
     */
    ConnectPeers?: ConnectPeerSummaryList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListCoreNetworkPolicyVersionsRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListCoreNetworkPolicyVersionsResponse {
    /**
     * Describes core network policy versions.
     */
    CoreNetworkPolicyVersions?: CoreNetworkPolicyVersionList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListCoreNetworksRequest {
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListCoreNetworksResponse {
    /**
     * Describes the list of core networks.
     */
    CoreNetworks?: CoreNetworkSummaryList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListOrganizationServiceAccessStatusRequest {
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListOrganizationServiceAccessStatusResponse {
    /**
     * Displays the status of an Amazon Web Services Organization.
     */
    OrganizationStatus?: OrganizationStatus;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListPeeringsRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * Returns a list of a peering requests.
     */
    PeeringType?: PeeringType;
    /**
     * Returns a list edge locations for the 
     */
    EdgeLocation?: ExternalRegionCode;
    /**
     * Returns a list of the peering request states.
     */
    State?: PeeringState;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListPeeringsResponse {
    /**
     * Lists the transit gateway peerings for the ListPeerings request.
     */
    Peerings?: PeeringList;
    /**
     * The token for the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: ResourceArn;
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
    Address?: ConstrainedString;
    /**
     * The latitude.
     */
    Latitude?: ConstrainedString;
    /**
     * The longitude.
     */
    Longitude?: ConstrainedString;
  }
  export type Long = number;
  export type MaxResults = number;
  export interface NetworkResource {
    /**
     * The ARN of the gateway.
     */
    RegisteredGatewayArn?: ResourceArn;
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: ExternalRegionCode;
    /**
     * The Amazon Web Services account ID.
     */
    AccountId?: AWSAccountId;
    /**
     * The resource type. The following are the supported resource types for Direct Connect:    dxcon     dx-gateway     dx-vif    The following are the supported resource types for Network Manager:    connection     device     link     site    The following are the supported resource types for Amazon VPC:    customer-gateway     transit-gateway     transit-gateway-attachment     transit-gateway-connect-peer     transit-gateway-route-table     vpn-connection   
     */
    ResourceType?: ConstrainedString;
    /**
     * The ID of the resource.
     */
    ResourceId?: ConstrainedString;
    /**
     * The ARN of the resource.
     */
    ResourceArn?: ResourceArn;
    /**
     * Information about the resource, in JSON format. Network Manager gets this information by describing the resource using its Describe API call.
     */
    Definition?: ConstrainedString;
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
    ResourceType?: ConstrainedString;
    /**
     * The resource count.
     */
    Count?: Integer;
  }
  export type NetworkResourceCountList = NetworkResourceCount[];
  export type NetworkResourceList = NetworkResource[];
  export type NetworkResourceMetadataMap = {[key: string]: ConstrainedString};
  export interface NetworkResourceSummary {
    /**
     * The ARN of the gateway.
     */
    RegisteredGatewayArn?: ResourceArn;
    /**
     * The ARN of the resource.
     */
    ResourceArn?: ResourceArn;
    /**
     * The resource type.
     */
    ResourceType?: ConstrainedString;
    /**
     * Information about the resource, in JSON format. Network Manager gets this information by describing the resource using its Describe API call.
     */
    Definition?: ConstrainedString;
    /**
     * The value for the Name tag.
     */
    NameTag?: ConstrainedString;
    /**
     * Indicates whether this is a middlebox appliance.
     */
    IsMiddlebox?: Boolean;
  }
  export interface NetworkRoute {
    /**
     * A unique identifier for the route, such as a CIDR block.
     */
    DestinationCidrBlock?: ConstrainedString;
    /**
     * The destinations.
     */
    Destinations?: NetworkRouteDestinationList;
    /**
     * The ID of the prefix list.
     */
    PrefixListId?: ConstrainedString;
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
     * The ID of a core network attachment.
     */
    CoreNetworkAttachmentId?: AttachmentId;
    /**
     * The ID of the transit gateway attachment.
     */
    TransitGatewayAttachmentId?: TransitGatewayAttachmentId;
    /**
     * The name of the segment.
     */
    SegmentName?: ConstrainedString;
    /**
     * The edge location for the network destination.
     */
    EdgeLocation?: ExternalRegionCode;
    /**
     * The resource type.
     */
    ResourceType?: ConstrainedString;
    /**
     * The ID of the resource.
     */
    ResourceId?: ConstrainedString;
  }
  export type NetworkRouteDestinationList = NetworkRouteDestination[];
  export type NetworkRouteList = NetworkRoute[];
  export interface NetworkTelemetry {
    /**
     * The ARN of the gateway.
     */
    RegisteredGatewayArn?: ResourceArn;
    /**
     * The ID of a core network.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The Amazon Web Services Region.
     */
    AwsRegion?: ExternalRegionCode;
    /**
     * The Amazon Web Services account ID.
     */
    AccountId?: AWSAccountId;
    /**
     * The resource type.
     */
    ResourceType?: ConstrainedString;
    /**
     * The ID of the resource.
     */
    ResourceId?: ConstrainedString;
    /**
     * The ARN of the resource.
     */
    ResourceArn?: ResourceArn;
    /**
     * The address.
     */
    Address?: ConstrainedString;
    /**
     * The connection health.
     */
    Health?: ConnectionHealth;
  }
  export type NetworkTelemetryList = NetworkTelemetry[];
  export type NextToken = string;
  export type OrganizationAwsServiceAccessStatus = string;
  export type OrganizationId = string;
  export interface OrganizationStatus {
    /**
     * The ID of an Amazon Web Services Organization.
     */
    OrganizationId?: OrganizationId;
    /**
     * The status of the organization's AWS service access. This will be ENABLED or DISABLED.
     */
    OrganizationAwsServiceAccessStatus?: OrganizationAwsServiceAccessStatus;
    /**
     * The status of the SLR deployment for the account. This will be either SUCCEEDED or IN_PROGRESS.
     */
    SLRDeploymentStatus?: SLRDeploymentStatus;
    /**
     * The current service-linked role (SLR) deployment status for an Amazon Web Services Organization's accounts. This will be either SUCCEEDED or IN_PROGRESS.
     */
    AccountStatusList?: AccountStatusList;
  }
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
    DestinationCidrBlock?: ConstrainedString;
  }
  export type PathComponentList = PathComponent[];
  export interface Peering {
    /**
     * The ID of the core network for the peering request.
     */
    CoreNetworkId?: CoreNetworkId;
    /**
     * The ARN of a core network.
     */
    CoreNetworkArn?: CoreNetworkArn;
    /**
     * The ID of the peering attachment. 
     */
    PeeringId?: PeeringId;
    /**
     * The ID of the account owner.
     */
    OwnerAccountId?: AWSAccountId;
    /**
     * The type of peering. This will be TRANSIT_GATEWAY.
     */
    PeeringType?: PeeringType;
    /**
     * The current state of the peering connection. 
     */
    State?: PeeringState;
    /**
     * The edge location for the peer.
     */
    EdgeLocation?: ExternalRegionCode;
    /**
     * The resource ARN of the peer.
     */
    ResourceArn?: ResourceArn;
    /**
     * The list of key-value tags associated with the peering.
     */
    Tags?: TagList;
    /**
     * The timestamp when the attachment peer was created.
     */
    CreatedAt?: DateTime;
  }
  export type PeeringId = string;
  export type PeeringList = Peering[];
  export type PeeringState = "CREATING"|"FAILED"|"AVAILABLE"|"DELETING"|string;
  export type PeeringType = "TRANSIT_GATEWAY"|string;
  export interface ProposedSegmentChange {
    /**
     * The list of key-value tags that changed for the segment.
     */
    Tags?: TagList;
    /**
     * The rule number in the policy document that applies to this change.
     */
    AttachmentPolicyRuleNumber?: Integer;
    /**
     * The name of the segment to change.
     */
    SegmentName?: ConstrainedString;
  }
  export interface PutCoreNetworkPolicyRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The policy document.
     */
    PolicyDocument: CoreNetworkPolicyDocument;
    /**
     * a core network policy description.
     */
    Description?: ConstrainedString;
    /**
     * The ID of a core network policy. 
     */
    LatestVersionId?: Integer;
    /**
     * The client token associated with the request.
     */
    ClientToken?: ClientToken;
  }
  export interface PutCoreNetworkPolicyResponse {
    /**
     * Describes the changed core network policy.
     */
    CoreNetworkPolicy?: CoreNetworkPolicy;
  }
  export interface PutResourcePolicyRequest {
    /**
     * The JSON resource policy document.
     */
    PolicyDocument: ResourcePolicyDocument;
    /**
     * The ARN of the resource policy. 
     */
    ResourceArn: ResourceArn;
  }
  export interface PutResourcePolicyResponse {
  }
  export type ReasonContextKey = string;
  export type ReasonContextMap = {[key: string]: ReasonContextValue};
  export type ReasonContextValue = string;
  export interface RegisterTransitGatewayRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The Amazon Resource Name (ARN) of the transit gateway.
     */
    TransitGatewayArn: TransitGatewayArn;
  }
  export interface RegisterTransitGatewayResponse {
    /**
     * Information about the transit gateway registration.
     */
    TransitGatewayRegistration?: TransitGatewayRegistration;
  }
  export interface RejectAttachmentRequest {
    /**
     * The ID of the attachment.
     */
    AttachmentId: AttachmentId;
  }
  export interface RejectAttachmentResponse {
    /**
     * Describes the rejected attachment request.
     */
    Attachment?: Attachment;
  }
  export interface Relationship {
    /**
     * The ARN of the resource.
     */
    From?: ConstrainedString;
    /**
     * The ARN of the resource.
     */
    To?: ConstrainedString;
  }
  export type RelationshipList = Relationship[];
  export type ResourceArn = string;
  export type ResourcePolicyDocument = string;
  export interface RestoreCoreNetworkPolicyVersionRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The ID of the policy version to restore.
     */
    PolicyVersionId: Integer;
  }
  export interface RestoreCoreNetworkPolicyVersionResponse {
    /**
     * Describes the restored core network policy.
     */
    CoreNetworkPolicy?: CoreNetworkPolicy;
  }
  export interface RouteAnalysis {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The ID of the AWS account that created the route analysis.
     */
    OwnerAccountId?: AWSAccountId;
    /**
     * The ID of the route analysis.
     */
    RouteAnalysisId?: ConstrainedString;
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
    TransitGatewayAttachmentArn?: TransitGatewayAttachmentArn;
    /**
     * The ARN of the transit gateway.
     */
    TransitGatewayArn?: TransitGatewayArn;
    /**
     * The IP address.
     */
    IpAddress?: IPAddress;
  }
  export interface RouteAnalysisEndpointOptionsSpecification {
    /**
     * The ARN of the transit gateway attachment.
     */
    TransitGatewayAttachmentArn?: TransitGatewayAttachmentArn;
    /**
     * The IP address.
     */
    IpAddress?: IPAddress;
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
    TransitGatewayRouteTableArn?: TransitGatewayRouteTableArn;
    /**
     * The segment edge in a core network.
     */
    CoreNetworkSegmentEdge?: CoreNetworkSegmentEdgeIdentifier;
  }
  export type RouteTableType = "TRANSIT_GATEWAY_ROUTE_TABLE"|"CORE_NETWORK_SEGMENT"|string;
  export type RouteType = "PROPAGATED"|"STATIC"|string;
  export type RouteTypeList = RouteType[];
  export type SLRDeploymentStatus = string;
  export type ServerSideString = string;
  export interface Site {
    /**
     * The ID of the site.
     */
    SiteId?: SiteId;
    /**
     * The Amazon Resource Name (ARN) of the site.
     */
    SiteArn?: SiteArn;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The description of the site.
     */
    Description?: ConstrainedString;
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
  export type SiteArn = string;
  export type SiteId = string;
  export type SiteIdList = SiteId[];
  export type SiteList = Site[];
  export type SiteState = "PENDING"|"AVAILABLE"|"DELETING"|"UPDATING"|string;
  export interface SiteToSiteVpnAttachment {
    /**
     * Provides details about a site-to-site VPN attachment.
     */
    Attachment?: Attachment;
    /**
     * The ARN of the site-to-site VPN attachment. 
     */
    VpnConnectionArn?: VpnConnectionArn;
  }
  export interface StartOrganizationServiceAccessUpdateRequest {
    /**
     * The action to take for the update request. This can be either ENABLE or DISABLE.
     */
    Action: Action;
  }
  export interface StartOrganizationServiceAccessUpdateResponse {
    /**
     * The status of the service access update request for an Amazon Web Services Organization.
     */
    OrganizationStatus?: OrganizationStatus;
  }
  export interface StartRouteAnalysisRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
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
  export type SubnetArn = string;
  export type SubnetArnList = SubnetArn[];
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
    ResourceArn: ResourceArn;
    /**
     * The tags to apply to the specified resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TransitGatewayArn = string;
  export type TransitGatewayArnList = TransitGatewayArn[];
  export type TransitGatewayAttachmentArn = string;
  export type TransitGatewayAttachmentId = string;
  export type TransitGatewayConnectPeerArn = string;
  export type TransitGatewayConnectPeerArnList = TransitGatewayConnectPeerArn[];
  export interface TransitGatewayConnectPeerAssociation {
    /**
     * The Amazon Resource Name (ARN) of the transit gateway Connect peer.
     */
    TransitGatewayConnectPeerArn?: TransitGatewayConnectPeerArn;
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The ID of the device.
     */
    DeviceId?: DeviceId;
    /**
     * The ID of the link.
     */
    LinkId?: LinkId;
    /**
     * The state of the association.
     */
    State?: TransitGatewayConnectPeerAssociationState;
  }
  export type TransitGatewayConnectPeerAssociationList = TransitGatewayConnectPeerAssociation[];
  export type TransitGatewayConnectPeerAssociationState = "PENDING"|"AVAILABLE"|"DELETING"|"DELETED"|string;
  export interface TransitGatewayPeering {
    /**
     * Describes a transit gateway peer connection.
     */
    Peering?: Peering;
    /**
     * The ARN of the transit gateway.
     */
    TransitGatewayArn?: TransitGatewayArn;
    /**
     * The ID of the transit gateway peering attachment.
     */
    TransitGatewayPeeringAttachmentId?: TransitGatewayPeeringAttachmentId;
  }
  export type TransitGatewayPeeringAttachmentId = string;
  export interface TransitGatewayRegistration {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId?: GlobalNetworkId;
    /**
     * The Amazon Resource Name (ARN) of the transit gateway.
     */
    TransitGatewayArn?: TransitGatewayArn;
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
    Message?: ConstrainedString;
  }
  export type TransitGatewayRouteTableArn = string;
  export interface TransitGatewayRouteTableAttachment {
    Attachment?: Attachment;
    /**
     * The ID of the peering attachment.
     */
    PeeringId?: PeeringId;
    /**
     * The ARN of the transit gateway attachment route table. For example, "TransitGatewayRouteTableArn": "arn:aws:ec2:us-west-2:123456789012:transit-gateway-route-table/tgw-rtb-9876543210123456".
     */
    TransitGatewayRouteTableArn?: TransitGatewayRouteTableArn;
  }
  export type TunnelProtocol = "GRE"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: ResourceArn;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the connection.
     */
    ConnectionId: ConnectionId;
    /**
     * The ID of the link for the first device in the connection.
     */
    LinkId?: LinkId;
    /**
     * The ID of the link for the second device in the connection.
     */
    ConnectedLinkId?: LinkId;
    /**
     * A description of the connection. Length Constraints: Maximum length of 256 characters.
     */
    Description?: ConstrainedString;
  }
  export interface UpdateConnectionResponse {
    /**
     * Information about the connection.
     */
    Connection?: Connection;
  }
  export interface UpdateCoreNetworkRequest {
    /**
     * The ID of a core network.
     */
    CoreNetworkId: CoreNetworkId;
    /**
     * The description of the update.
     */
    Description?: ConstrainedString;
  }
  export interface UpdateCoreNetworkResponse {
    /**
     * Returns information about a core network update.
     */
    CoreNetwork?: CoreNetwork;
  }
  export interface UpdateDeviceRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the device.
     */
    DeviceId: DeviceId;
    /**
     * The Amazon Web Services location of the device, if applicable. For an on-premises device, you can omit this parameter.
     */
    AWSLocation?: AWSLocation;
    /**
     * A description of the device. Constraints: Maximum length of 256 characters.
     */
    Description?: ConstrainedString;
    /**
     * The type of the device.
     */
    Type?: ConstrainedString;
    /**
     * The vendor of the device. Constraints: Maximum length of 128 characters.
     */
    Vendor?: ConstrainedString;
    /**
     * The model of the device. Constraints: Maximum length of 128 characters.
     */
    Model?: ConstrainedString;
    /**
     * The serial number of the device. Constraints: Maximum length of 128 characters.
     */
    SerialNumber?: ConstrainedString;
    Location?: Location;
    /**
     * The ID of the site.
     */
    SiteId?: SiteId;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * A description of the global network. Constraints: Maximum length of 256 characters.
     */
    Description?: ConstrainedString;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of the link.
     */
    LinkId: LinkId;
    /**
     * A description of the link. Constraints: Maximum length of 256 characters.
     */
    Description?: ConstrainedString;
    /**
     * The type of the link. Constraints: Maximum length of 128 characters.
     */
    Type?: ConstrainedString;
    /**
     * The upload and download speed in Mbps. 
     */
    Bandwidth?: Bandwidth;
    /**
     * The provider of the link. Constraints: Maximum length of 128 characters.
     */
    Provider?: ConstrainedString;
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
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ARN of the resource.
     */
    ResourceArn: ResourceArn;
    /**
     * The resource metadata.
     */
    Metadata: NetworkResourceMetadataMap;
  }
  export interface UpdateNetworkResourceMetadataResponse {
    /**
     * The ARN of the resource.
     */
    ResourceArn?: ResourceArn;
    /**
     * The updated resource metadata.
     */
    Metadata?: NetworkResourceMetadataMap;
  }
  export interface UpdateSiteRequest {
    /**
     * The ID of the global network.
     */
    GlobalNetworkId: GlobalNetworkId;
    /**
     * The ID of your site.
     */
    SiteId: SiteId;
    /**
     * A description of your site. Constraints: Maximum length of 256 characters.
     */
    Description?: ConstrainedString;
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
  export interface UpdateVpcAttachmentRequest {
    /**
     * The ID of the attachment.
     */
    AttachmentId: AttachmentId;
    /**
     * Adds a subnet ARN to the VPC attachment.
     */
    AddSubnetArns?: SubnetArnList;
    /**
     * Removes a subnet ARN from the attachment.
     */
    RemoveSubnetArns?: SubnetArnList;
    /**
     * Additional options for updating the VPC attachment. 
     */
    Options?: VpcOptions;
  }
  export interface UpdateVpcAttachmentResponse {
    /**
     * Describes the updated VPC attachment.
     */
    VpcAttachment?: VpcAttachment;
  }
  export type VpcArn = string;
  export interface VpcAttachment {
    /**
     * Provides details about the VPC attachment.
     */
    Attachment?: Attachment;
    /**
     * The subnet ARNs.
     */
    SubnetArns?: SubnetArnList;
    /**
     * Provides details about the VPC attachment.
     */
    Options?: VpcOptions;
  }
  export interface VpcOptions {
    /**
     * Indicates whether IPv6 is supported.
     */
    Ipv6Support?: Boolean;
    /**
     * Indicates whether appliance mode is supported. If enabled, traffic flow between a source and destination use the same Availability Zone for the VPC attachment for the lifetime of that flow. The default value is false.
     */
    ApplianceModeSupport?: Boolean;
  }
  export type VpnConnectionArn = string;
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
