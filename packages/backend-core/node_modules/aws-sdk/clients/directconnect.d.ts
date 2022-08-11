import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class DirectConnect extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: DirectConnect.Types.ClientConfiguration)
  config: Config & DirectConnect.Types.ClientConfiguration;
  /**
   * Accepts a proposal request to attach a virtual private gateway or transit gateway to a Direct Connect gateway.
   */
  acceptDirectConnectGatewayAssociationProposal(params: DirectConnect.Types.AcceptDirectConnectGatewayAssociationProposalRequest, callback?: (err: AWSError, data: DirectConnect.Types.AcceptDirectConnectGatewayAssociationProposalResult) => void): Request<DirectConnect.Types.AcceptDirectConnectGatewayAssociationProposalResult, AWSError>;
  /**
   * Accepts a proposal request to attach a virtual private gateway or transit gateway to a Direct Connect gateway.
   */
  acceptDirectConnectGatewayAssociationProposal(callback?: (err: AWSError, data: DirectConnect.Types.AcceptDirectConnectGatewayAssociationProposalResult) => void): Request<DirectConnect.Types.AcceptDirectConnectGatewayAssociationProposalResult, AWSError>;
  /**
   * Deprecated. Use AllocateHostedConnection instead. Creates a hosted connection on an interconnect. Allocates a VLAN number and a specified amount of bandwidth for use by a hosted connection on the specified interconnect.  Intended for use by Direct Connect Partners only. 
   */
  allocateConnectionOnInterconnect(params: DirectConnect.Types.AllocateConnectionOnInterconnectRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Deprecated. Use AllocateHostedConnection instead. Creates a hosted connection on an interconnect. Allocates a VLAN number and a specified amount of bandwidth for use by a hosted connection on the specified interconnect.  Intended for use by Direct Connect Partners only. 
   */
  allocateConnectionOnInterconnect(callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Creates a hosted connection on the specified interconnect or a link aggregation group (LAG) of interconnects. Allocates a VLAN number and a specified amount of capacity (bandwidth) for use by a hosted connection on the specified interconnect or LAG of interconnects. Amazon Web Services polices the hosted connection for the specified capacity and the Direct Connect Partner must also police the hosted connection for the specified capacity.  Intended for use by Direct Connect Partners only. 
   */
  allocateHostedConnection(params: DirectConnect.Types.AllocateHostedConnectionRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Creates a hosted connection on the specified interconnect or a link aggregation group (LAG) of interconnects. Allocates a VLAN number and a specified amount of capacity (bandwidth) for use by a hosted connection on the specified interconnect or LAG of interconnects. Amazon Web Services polices the hosted connection for the specified capacity and the Direct Connect Partner must also police the hosted connection for the specified capacity.  Intended for use by Direct Connect Partners only. 
   */
  allocateHostedConnection(callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Provisions a private virtual interface to be owned by the specified Amazon Web Services account. Virtual interfaces created using this action must be confirmed by the owner using ConfirmPrivateVirtualInterface. Until then, the virtual interface is in the Confirming state and is not available to handle traffic.
   */
  allocatePrivateVirtualInterface(params: DirectConnect.Types.AllocatePrivateVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Provisions a private virtual interface to be owned by the specified Amazon Web Services account. Virtual interfaces created using this action must be confirmed by the owner using ConfirmPrivateVirtualInterface. Until then, the virtual interface is in the Confirming state and is not available to handle traffic.
   */
  allocatePrivateVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Provisions a public virtual interface to be owned by the specified Amazon Web Services account. The owner of a connection calls this function to provision a public virtual interface to be owned by the specified Amazon Web Services account. Virtual interfaces created using this function must be confirmed by the owner using ConfirmPublicVirtualInterface. Until this step has been completed, the virtual interface is in the confirming state and is not available to handle traffic. When creating an IPv6 public virtual interface, omit the Amazon address and customer address. IPv6 addresses are automatically assigned from the Amazon pool of IPv6 addresses; you cannot specify custom IPv6 addresses.
   */
  allocatePublicVirtualInterface(params: DirectConnect.Types.AllocatePublicVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Provisions a public virtual interface to be owned by the specified Amazon Web Services account. The owner of a connection calls this function to provision a public virtual interface to be owned by the specified Amazon Web Services account. Virtual interfaces created using this function must be confirmed by the owner using ConfirmPublicVirtualInterface. Until this step has been completed, the virtual interface is in the confirming state and is not available to handle traffic. When creating an IPv6 public virtual interface, omit the Amazon address and customer address. IPv6 addresses are automatically assigned from the Amazon pool of IPv6 addresses; you cannot specify custom IPv6 addresses.
   */
  allocatePublicVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Provisions a transit virtual interface to be owned by the specified Amazon Web Services account. Use this type of interface to connect a transit gateway to your Direct Connect gateway. The owner of a connection provisions a transit virtual interface to be owned by the specified Amazon Web Services account. After you create a transit virtual interface, it must be confirmed by the owner using ConfirmTransitVirtualInterface. Until this step has been completed, the transit virtual interface is in the requested state and is not available to handle traffic.
   */
  allocateTransitVirtualInterface(params: DirectConnect.Types.AllocateTransitVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.AllocateTransitVirtualInterfaceResult) => void): Request<DirectConnect.Types.AllocateTransitVirtualInterfaceResult, AWSError>;
  /**
   * Provisions a transit virtual interface to be owned by the specified Amazon Web Services account. Use this type of interface to connect a transit gateway to your Direct Connect gateway. The owner of a connection provisions a transit virtual interface to be owned by the specified Amazon Web Services account. After you create a transit virtual interface, it must be confirmed by the owner using ConfirmTransitVirtualInterface. Until this step has been completed, the transit virtual interface is in the requested state and is not available to handle traffic.
   */
  allocateTransitVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.AllocateTransitVirtualInterfaceResult) => void): Request<DirectConnect.Types.AllocateTransitVirtualInterfaceResult, AWSError>;
  /**
   * Associates an existing connection with a link aggregation group (LAG). The connection is interrupted and re-established as a member of the LAG (connectivity to Amazon Web Services is interrupted). The connection must be hosted on the same Direct Connect endpoint as the LAG, and its bandwidth must match the bandwidth for the LAG. You can re-associate a connection that's currently associated with a different LAG; however, if removing the connection would cause the original LAG to fall below its setting for minimum number of operational connections, the request fails. Any virtual interfaces that are directly associated with the connection are automatically re-associated with the LAG. If the connection was originally associated with a different LAG, the virtual interfaces remain associated with the original LAG. For interconnects, any hosted connections are automatically re-associated with the LAG. If the interconnect was originally associated with a different LAG, the hosted connections remain associated with the original LAG.
   */
  associateConnectionWithLag(params: DirectConnect.Types.AssociateConnectionWithLagRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Associates an existing connection with a link aggregation group (LAG). The connection is interrupted and re-established as a member of the LAG (connectivity to Amazon Web Services is interrupted). The connection must be hosted on the same Direct Connect endpoint as the LAG, and its bandwidth must match the bandwidth for the LAG. You can re-associate a connection that's currently associated with a different LAG; however, if removing the connection would cause the original LAG to fall below its setting for minimum number of operational connections, the request fails. Any virtual interfaces that are directly associated with the connection are automatically re-associated with the LAG. If the connection was originally associated with a different LAG, the virtual interfaces remain associated with the original LAG. For interconnects, any hosted connections are automatically re-associated with the LAG. If the interconnect was originally associated with a different LAG, the hosted connections remain associated with the original LAG.
   */
  associateConnectionWithLag(callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Associates a hosted connection and its virtual interfaces with a link aggregation group (LAG) or interconnect. If the target interconnect or LAG has an existing hosted connection with a conflicting VLAN number or IP address, the operation fails. This action temporarily interrupts the hosted connection's connectivity to Amazon Web Services as it is being migrated.  Intended for use by Direct Connect Partners only. 
   */
  associateHostedConnection(params: DirectConnect.Types.AssociateHostedConnectionRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Associates a hosted connection and its virtual interfaces with a link aggregation group (LAG) or interconnect. If the target interconnect or LAG has an existing hosted connection with a conflicting VLAN number or IP address, the operation fails. This action temporarily interrupts the hosted connection's connectivity to Amazon Web Services as it is being migrated.  Intended for use by Direct Connect Partners only. 
   */
  associateHostedConnection(callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Associates a MAC Security (MACsec) Connection Key Name (CKN)/ Connectivity Association Key (CAK) pair with an Direct Connect dedicated connection. You must supply either the secretARN, or the CKN/CAK (ckn and cak) pair in the request. For information about MAC Security (MACsec) key considerations, see MACsec pre-shared CKN/CAK key considerations  in the Direct Connect User Guide.
   */
  associateMacSecKey(params: DirectConnect.Types.AssociateMacSecKeyRequest, callback?: (err: AWSError, data: DirectConnect.Types.AssociateMacSecKeyResponse) => void): Request<DirectConnect.Types.AssociateMacSecKeyResponse, AWSError>;
  /**
   * Associates a MAC Security (MACsec) Connection Key Name (CKN)/ Connectivity Association Key (CAK) pair with an Direct Connect dedicated connection. You must supply either the secretARN, or the CKN/CAK (ckn and cak) pair in the request. For information about MAC Security (MACsec) key considerations, see MACsec pre-shared CKN/CAK key considerations  in the Direct Connect User Guide.
   */
  associateMacSecKey(callback?: (err: AWSError, data: DirectConnect.Types.AssociateMacSecKeyResponse) => void): Request<DirectConnect.Types.AssociateMacSecKeyResponse, AWSError>;
  /**
   * Associates a virtual interface with a specified link aggregation group (LAG) or connection. Connectivity to Amazon Web Services is temporarily interrupted as the virtual interface is being migrated. If the target connection or LAG has an associated virtual interface with a conflicting VLAN number or a conflicting IP address, the operation fails. Virtual interfaces associated with a hosted connection cannot be associated with a LAG; hosted connections must be migrated along with their virtual interfaces using AssociateHostedConnection. To reassociate a virtual interface to a new connection or LAG, the requester must own either the virtual interface itself or the connection to which the virtual interface is currently associated. Additionally, the requester must own the connection or LAG for the association.
   */
  associateVirtualInterface(params: DirectConnect.Types.AssociateVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Associates a virtual interface with a specified link aggregation group (LAG) or connection. Connectivity to Amazon Web Services is temporarily interrupted as the virtual interface is being migrated. If the target connection or LAG has an associated virtual interface with a conflicting VLAN number or a conflicting IP address, the operation fails. Virtual interfaces associated with a hosted connection cannot be associated with a LAG; hosted connections must be migrated along with their virtual interfaces using AssociateHostedConnection. To reassociate a virtual interface to a new connection or LAG, the requester must own either the virtual interface itself or the connection to which the virtual interface is currently associated. Additionally, the requester must own the connection or LAG for the association.
   */
  associateVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Confirms the creation of the specified hosted connection on an interconnect. Upon creation, the hosted connection is initially in the Ordering state, and remains in this state until the owner confirms creation of the hosted connection.
   */
  confirmConnection(params: DirectConnect.Types.ConfirmConnectionRequest, callback?: (err: AWSError, data: DirectConnect.Types.ConfirmConnectionResponse) => void): Request<DirectConnect.Types.ConfirmConnectionResponse, AWSError>;
  /**
   * Confirms the creation of the specified hosted connection on an interconnect. Upon creation, the hosted connection is initially in the Ordering state, and remains in this state until the owner confirms creation of the hosted connection.
   */
  confirmConnection(callback?: (err: AWSError, data: DirectConnect.Types.ConfirmConnectionResponse) => void): Request<DirectConnect.Types.ConfirmConnectionResponse, AWSError>;
  /**
   *  The confirmation of the terms of agreement when creating the connection/link aggregation group (LAG). 
   */
  confirmCustomerAgreement(params: DirectConnect.Types.ConfirmCustomerAgreementRequest, callback?: (err: AWSError, data: DirectConnect.Types.ConfirmCustomerAgreementResponse) => void): Request<DirectConnect.Types.ConfirmCustomerAgreementResponse, AWSError>;
  /**
   *  The confirmation of the terms of agreement when creating the connection/link aggregation group (LAG). 
   */
  confirmCustomerAgreement(callback?: (err: AWSError, data: DirectConnect.Types.ConfirmCustomerAgreementResponse) => void): Request<DirectConnect.Types.ConfirmCustomerAgreementResponse, AWSError>;
  /**
   * Accepts ownership of a private virtual interface created by another Amazon Web Services account. After the virtual interface owner makes this call, the virtual interface is created and attached to the specified virtual private gateway or Direct Connect gateway, and is made available to handle traffic.
   */
  confirmPrivateVirtualInterface(params: DirectConnect.Types.ConfirmPrivateVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.ConfirmPrivateVirtualInterfaceResponse) => void): Request<DirectConnect.Types.ConfirmPrivateVirtualInterfaceResponse, AWSError>;
  /**
   * Accepts ownership of a private virtual interface created by another Amazon Web Services account. After the virtual interface owner makes this call, the virtual interface is created and attached to the specified virtual private gateway or Direct Connect gateway, and is made available to handle traffic.
   */
  confirmPrivateVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.ConfirmPrivateVirtualInterfaceResponse) => void): Request<DirectConnect.Types.ConfirmPrivateVirtualInterfaceResponse, AWSError>;
  /**
   * Accepts ownership of a public virtual interface created by another Amazon Web Services account. After the virtual interface owner makes this call, the specified virtual interface is created and made available to handle traffic.
   */
  confirmPublicVirtualInterface(params: DirectConnect.Types.ConfirmPublicVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.ConfirmPublicVirtualInterfaceResponse) => void): Request<DirectConnect.Types.ConfirmPublicVirtualInterfaceResponse, AWSError>;
  /**
   * Accepts ownership of a public virtual interface created by another Amazon Web Services account. After the virtual interface owner makes this call, the specified virtual interface is created and made available to handle traffic.
   */
  confirmPublicVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.ConfirmPublicVirtualInterfaceResponse) => void): Request<DirectConnect.Types.ConfirmPublicVirtualInterfaceResponse, AWSError>;
  /**
   * Accepts ownership of a transit virtual interface created by another Amazon Web Services account.  After the owner of the transit virtual interface makes this call, the specified transit virtual interface is created and made available to handle traffic.
   */
  confirmTransitVirtualInterface(params: DirectConnect.Types.ConfirmTransitVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.ConfirmTransitVirtualInterfaceResponse) => void): Request<DirectConnect.Types.ConfirmTransitVirtualInterfaceResponse, AWSError>;
  /**
   * Accepts ownership of a transit virtual interface created by another Amazon Web Services account.  After the owner of the transit virtual interface makes this call, the specified transit virtual interface is created and made available to handle traffic.
   */
  confirmTransitVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.ConfirmTransitVirtualInterfaceResponse) => void): Request<DirectConnect.Types.ConfirmTransitVirtualInterfaceResponse, AWSError>;
  /**
   * Creates a BGP peer on the specified virtual interface. You must create a BGP peer for the corresponding address family (IPv4/IPv6) in order to access Amazon Web Services resources that also use that address family. If logical redundancy is not supported by the connection, interconnect, or LAG, the BGP peer cannot be in the same address family as an existing BGP peer on the virtual interface. When creating a IPv6 BGP peer, omit the Amazon address and customer address. IPv6 addresses are automatically assigned from the Amazon pool of IPv6 addresses; you cannot specify custom IPv6 addresses. For a public virtual interface, the Autonomous System Number (ASN) must be private or already on the allow list for the virtual interface.
   */
  createBGPPeer(params: DirectConnect.Types.CreateBGPPeerRequest, callback?: (err: AWSError, data: DirectConnect.Types.CreateBGPPeerResponse) => void): Request<DirectConnect.Types.CreateBGPPeerResponse, AWSError>;
  /**
   * Creates a BGP peer on the specified virtual interface. You must create a BGP peer for the corresponding address family (IPv4/IPv6) in order to access Amazon Web Services resources that also use that address family. If logical redundancy is not supported by the connection, interconnect, or LAG, the BGP peer cannot be in the same address family as an existing BGP peer on the virtual interface. When creating a IPv6 BGP peer, omit the Amazon address and customer address. IPv6 addresses are automatically assigned from the Amazon pool of IPv6 addresses; you cannot specify custom IPv6 addresses. For a public virtual interface, the Autonomous System Number (ASN) must be private or already on the allow list for the virtual interface.
   */
  createBGPPeer(callback?: (err: AWSError, data: DirectConnect.Types.CreateBGPPeerResponse) => void): Request<DirectConnect.Types.CreateBGPPeerResponse, AWSError>;
  /**
   * Creates a connection between a customer network and a specific Direct Connect location. A connection links your internal network to an Direct Connect location over a standard Ethernet fiber-optic cable. One end of the cable is connected to your router, the other to an Direct Connect router. To find the locations for your Region, use DescribeLocations. You can automatically add the new connection to a link aggregation group (LAG) by specifying a LAG ID in the request. This ensures that the new connection is allocated on the same Direct Connect endpoint that hosts the specified LAG. If there are no available ports on the endpoint, the request fails and no connection is created.
   */
  createConnection(params: DirectConnect.Types.CreateConnectionRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Creates a connection between a customer network and a specific Direct Connect location. A connection links your internal network to an Direct Connect location over a standard Ethernet fiber-optic cable. One end of the cable is connected to your router, the other to an Direct Connect router. To find the locations for your Region, use DescribeLocations. You can automatically add the new connection to a link aggregation group (LAG) by specifying a LAG ID in the request. This ensures that the new connection is allocated on the same Direct Connect endpoint that hosts the specified LAG. If there are no available ports on the endpoint, the request fails and no connection is created.
   */
  createConnection(callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Creates a Direct Connect gateway, which is an intermediate object that enables you to connect a set of virtual interfaces and virtual private gateways. A Direct Connect gateway is global and visible in any Amazon Web Services Region after it is created. The virtual interfaces and virtual private gateways that are connected through a Direct Connect gateway can be in different Amazon Web Services Regions. This enables you to connect to a VPC in any Region, regardless of the Region in which the virtual interfaces are located, and pass traffic between them.
   */
  createDirectConnectGateway(params: DirectConnect.Types.CreateDirectConnectGatewayRequest, callback?: (err: AWSError, data: DirectConnect.Types.CreateDirectConnectGatewayResult) => void): Request<DirectConnect.Types.CreateDirectConnectGatewayResult, AWSError>;
  /**
   * Creates a Direct Connect gateway, which is an intermediate object that enables you to connect a set of virtual interfaces and virtual private gateways. A Direct Connect gateway is global and visible in any Amazon Web Services Region after it is created. The virtual interfaces and virtual private gateways that are connected through a Direct Connect gateway can be in different Amazon Web Services Regions. This enables you to connect to a VPC in any Region, regardless of the Region in which the virtual interfaces are located, and pass traffic between them.
   */
  createDirectConnectGateway(callback?: (err: AWSError, data: DirectConnect.Types.CreateDirectConnectGatewayResult) => void): Request<DirectConnect.Types.CreateDirectConnectGatewayResult, AWSError>;
  /**
   * Creates an association between a Direct Connect gateway and a virtual private gateway. The virtual private gateway must be attached to a VPC and must not be associated with another Direct Connect gateway.
   */
  createDirectConnectGatewayAssociation(params: DirectConnect.Types.CreateDirectConnectGatewayAssociationRequest, callback?: (err: AWSError, data: DirectConnect.Types.CreateDirectConnectGatewayAssociationResult) => void): Request<DirectConnect.Types.CreateDirectConnectGatewayAssociationResult, AWSError>;
  /**
   * Creates an association between a Direct Connect gateway and a virtual private gateway. The virtual private gateway must be attached to a VPC and must not be associated with another Direct Connect gateway.
   */
  createDirectConnectGatewayAssociation(callback?: (err: AWSError, data: DirectConnect.Types.CreateDirectConnectGatewayAssociationResult) => void): Request<DirectConnect.Types.CreateDirectConnectGatewayAssociationResult, AWSError>;
  /**
   * Creates a proposal to associate the specified virtual private gateway or transit gateway with the specified Direct Connect gateway. You can associate a Direct Connect gateway and virtual private gateway or transit gateway that is owned by any Amazon Web Services account. 
   */
  createDirectConnectGatewayAssociationProposal(params: DirectConnect.Types.CreateDirectConnectGatewayAssociationProposalRequest, callback?: (err: AWSError, data: DirectConnect.Types.CreateDirectConnectGatewayAssociationProposalResult) => void): Request<DirectConnect.Types.CreateDirectConnectGatewayAssociationProposalResult, AWSError>;
  /**
   * Creates a proposal to associate the specified virtual private gateway or transit gateway with the specified Direct Connect gateway. You can associate a Direct Connect gateway and virtual private gateway or transit gateway that is owned by any Amazon Web Services account. 
   */
  createDirectConnectGatewayAssociationProposal(callback?: (err: AWSError, data: DirectConnect.Types.CreateDirectConnectGatewayAssociationProposalResult) => void): Request<DirectConnect.Types.CreateDirectConnectGatewayAssociationProposalResult, AWSError>;
  /**
   * Creates an interconnect between an Direct Connect Partner's network and a specific Direct Connect location. An interconnect is a connection that is capable of hosting other connections. The Direct Connect Partner can use an interconnect to provide Direct Connect hosted connections to customers through their own network services. Like a standard connection, an interconnect links the partner's network to an Direct Connect location over a standard Ethernet fiber-optic cable. One end is connected to the partner's router, the other to an Direct Connect router. You can automatically add the new interconnect to a link aggregation group (LAG) by specifying a LAG ID in the request. This ensures that the new interconnect is allocated on the same Direct Connect endpoint that hosts the specified LAG. If there are no available ports on the endpoint, the request fails and no interconnect is created. For each end customer, the Direct Connect Partner provisions a connection on their interconnect by calling AllocateHostedConnection. The end customer can then connect to Amazon Web Services resources by creating a virtual interface on their connection, using the VLAN assigned to them by the Direct Connect Partner.  Intended for use by Direct Connect Partners only. 
   */
  createInterconnect(params: DirectConnect.Types.CreateInterconnectRequest, callback?: (err: AWSError, data: DirectConnect.Types.Interconnect) => void): Request<DirectConnect.Types.Interconnect, AWSError>;
  /**
   * Creates an interconnect between an Direct Connect Partner's network and a specific Direct Connect location. An interconnect is a connection that is capable of hosting other connections. The Direct Connect Partner can use an interconnect to provide Direct Connect hosted connections to customers through their own network services. Like a standard connection, an interconnect links the partner's network to an Direct Connect location over a standard Ethernet fiber-optic cable. One end is connected to the partner's router, the other to an Direct Connect router. You can automatically add the new interconnect to a link aggregation group (LAG) by specifying a LAG ID in the request. This ensures that the new interconnect is allocated on the same Direct Connect endpoint that hosts the specified LAG. If there are no available ports on the endpoint, the request fails and no interconnect is created. For each end customer, the Direct Connect Partner provisions a connection on their interconnect by calling AllocateHostedConnection. The end customer can then connect to Amazon Web Services resources by creating a virtual interface on their connection, using the VLAN assigned to them by the Direct Connect Partner.  Intended for use by Direct Connect Partners only. 
   */
  createInterconnect(callback?: (err: AWSError, data: DirectConnect.Types.Interconnect) => void): Request<DirectConnect.Types.Interconnect, AWSError>;
  /**
   * Creates a link aggregation group (LAG) with the specified number of bundled physical dedicated connections between the customer network and a specific Direct Connect location. A LAG is a logical interface that uses the Link Aggregation Control Protocol (LACP) to aggregate multiple interfaces, enabling you to treat them as a single interface. All connections in a LAG must use the same bandwidth (either 1Gbps or 10Gbps) and must terminate at the same Direct Connect endpoint. You can have up to 10 dedicated connections per LAG. Regardless of this limit, if you request more connections for the LAG than Direct Connect can allocate on a single endpoint, no LAG is created. You can specify an existing physical dedicated connection or interconnect to include in the LAG (which counts towards the total number of connections). Doing so interrupts the current physical dedicated connection, and re-establishes them as a member of the LAG. The LAG will be created on the same Direct Connect endpoint to which the dedicated connection terminates. Any virtual interfaces associated with the dedicated connection are automatically disassociated and re-associated with the LAG. The connection ID does not change. If the Amazon Web Services account used to create a LAG is a registered Direct Connect Partner, the LAG is automatically enabled to host sub-connections. For a LAG owned by a partner, any associated virtual interfaces cannot be directly configured.
   */
  createLag(params: DirectConnect.Types.CreateLagRequest, callback?: (err: AWSError, data: DirectConnect.Types.Lag) => void): Request<DirectConnect.Types.Lag, AWSError>;
  /**
   * Creates a link aggregation group (LAG) with the specified number of bundled physical dedicated connections between the customer network and a specific Direct Connect location. A LAG is a logical interface that uses the Link Aggregation Control Protocol (LACP) to aggregate multiple interfaces, enabling you to treat them as a single interface. All connections in a LAG must use the same bandwidth (either 1Gbps or 10Gbps) and must terminate at the same Direct Connect endpoint. You can have up to 10 dedicated connections per LAG. Regardless of this limit, if you request more connections for the LAG than Direct Connect can allocate on a single endpoint, no LAG is created. You can specify an existing physical dedicated connection or interconnect to include in the LAG (which counts towards the total number of connections). Doing so interrupts the current physical dedicated connection, and re-establishes them as a member of the LAG. The LAG will be created on the same Direct Connect endpoint to which the dedicated connection terminates. Any virtual interfaces associated with the dedicated connection are automatically disassociated and re-associated with the LAG. The connection ID does not change. If the Amazon Web Services account used to create a LAG is a registered Direct Connect Partner, the LAG is automatically enabled to host sub-connections. For a LAG owned by a partner, any associated virtual interfaces cannot be directly configured.
   */
  createLag(callback?: (err: AWSError, data: DirectConnect.Types.Lag) => void): Request<DirectConnect.Types.Lag, AWSError>;
  /**
   * Creates a private virtual interface. A virtual interface is the VLAN that transports Direct Connect traffic. A private virtual interface can be connected to either a Direct Connect gateway or a Virtual Private Gateway (VGW). Connecting the private virtual interface to a Direct Connect gateway enables the possibility for connecting to multiple VPCs, including VPCs in different Amazon Web Services Regions. Connecting the private virtual interface to a VGW only provides access to a single VPC within the same Region. Setting the MTU of a virtual interface to 9001 (jumbo frames) can cause an update to the underlying physical connection if it wasn't updated to support jumbo frames. Updating the connection disrupts network connectivity for all virtual interfaces associated with the connection for up to 30 seconds. To check whether your connection supports jumbo frames, call DescribeConnections. To check whether your virtual interface supports jumbo frames, call DescribeVirtualInterfaces.
   */
  createPrivateVirtualInterface(params: DirectConnect.Types.CreatePrivateVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Creates a private virtual interface. A virtual interface is the VLAN that transports Direct Connect traffic. A private virtual interface can be connected to either a Direct Connect gateway or a Virtual Private Gateway (VGW). Connecting the private virtual interface to a Direct Connect gateway enables the possibility for connecting to multiple VPCs, including VPCs in different Amazon Web Services Regions. Connecting the private virtual interface to a VGW only provides access to a single VPC within the same Region. Setting the MTU of a virtual interface to 9001 (jumbo frames) can cause an update to the underlying physical connection if it wasn't updated to support jumbo frames. Updating the connection disrupts network connectivity for all virtual interfaces associated with the connection for up to 30 seconds. To check whether your connection supports jumbo frames, call DescribeConnections. To check whether your virtual interface supports jumbo frames, call DescribeVirtualInterfaces.
   */
  createPrivateVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Creates a public virtual interface. A virtual interface is the VLAN that transports Direct Connect traffic. A public virtual interface supports sending traffic to public services of Amazon Web Services such as Amazon S3. When creating an IPv6 public virtual interface (addressFamily is ipv6), leave the customer and amazon address fields blank to use auto-assigned IPv6 space. Custom IPv6 addresses are not supported.
   */
  createPublicVirtualInterface(params: DirectConnect.Types.CreatePublicVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Creates a public virtual interface. A virtual interface is the VLAN that transports Direct Connect traffic. A public virtual interface supports sending traffic to public services of Amazon Web Services such as Amazon S3. When creating an IPv6 public virtual interface (addressFamily is ipv6), leave the customer and amazon address fields blank to use auto-assigned IPv6 space. Custom IPv6 addresses are not supported.
   */
  createPublicVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Creates a transit virtual interface. A transit virtual interface should be used to access one or more transit gateways associated with Direct Connect gateways. A transit virtual interface enables the connection of multiple VPCs attached to a transit gateway to a Direct Connect gateway.  If you associate your transit gateway with one or more Direct Connect gateways, the Autonomous System Number (ASN) used by the transit gateway and the Direct Connect gateway must be different. For example, if you use the default ASN 64512 for both your the transit gateway and Direct Connect gateway, the association request fails.  Setting the MTU of a virtual interface to 8500 (jumbo frames) can cause an update to the underlying physical connection if it wasn't updated to support jumbo frames. Updating the connection disrupts network connectivity for all virtual interfaces associated with the connection for up to 30 seconds. To check whether your connection supports jumbo frames, call DescribeConnections. To check whether your virtual interface supports jumbo frames, call DescribeVirtualInterfaces.
   */
  createTransitVirtualInterface(params: DirectConnect.Types.CreateTransitVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.CreateTransitVirtualInterfaceResult) => void): Request<DirectConnect.Types.CreateTransitVirtualInterfaceResult, AWSError>;
  /**
   * Creates a transit virtual interface. A transit virtual interface should be used to access one or more transit gateways associated with Direct Connect gateways. A transit virtual interface enables the connection of multiple VPCs attached to a transit gateway to a Direct Connect gateway.  If you associate your transit gateway with one or more Direct Connect gateways, the Autonomous System Number (ASN) used by the transit gateway and the Direct Connect gateway must be different. For example, if you use the default ASN 64512 for both your the transit gateway and Direct Connect gateway, the association request fails.  Setting the MTU of a virtual interface to 8500 (jumbo frames) can cause an update to the underlying physical connection if it wasn't updated to support jumbo frames. Updating the connection disrupts network connectivity for all virtual interfaces associated with the connection for up to 30 seconds. To check whether your connection supports jumbo frames, call DescribeConnections. To check whether your virtual interface supports jumbo frames, call DescribeVirtualInterfaces.
   */
  createTransitVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.CreateTransitVirtualInterfaceResult) => void): Request<DirectConnect.Types.CreateTransitVirtualInterfaceResult, AWSError>;
  /**
   * Deletes the specified BGP peer on the specified virtual interface with the specified customer address and ASN. You cannot delete the last BGP peer from a virtual interface.
   */
  deleteBGPPeer(params: DirectConnect.Types.DeleteBGPPeerRequest, callback?: (err: AWSError, data: DirectConnect.Types.DeleteBGPPeerResponse) => void): Request<DirectConnect.Types.DeleteBGPPeerResponse, AWSError>;
  /**
   * Deletes the specified BGP peer on the specified virtual interface with the specified customer address and ASN. You cannot delete the last BGP peer from a virtual interface.
   */
  deleteBGPPeer(callback?: (err: AWSError, data: DirectConnect.Types.DeleteBGPPeerResponse) => void): Request<DirectConnect.Types.DeleteBGPPeerResponse, AWSError>;
  /**
   * Deletes the specified connection. Deleting a connection only stops the Direct Connect port hour and data transfer charges. If you are partnering with any third parties to connect with the Direct Connect location, you must cancel your service with them separately.
   */
  deleteConnection(params: DirectConnect.Types.DeleteConnectionRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Deletes the specified connection. Deleting a connection only stops the Direct Connect port hour and data transfer charges. If you are partnering with any third parties to connect with the Direct Connect location, you must cancel your service with them separately.
   */
  deleteConnection(callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Deletes the specified Direct Connect gateway. You must first delete all virtual interfaces that are attached to the Direct Connect gateway and disassociate all virtual private gateways associated with the Direct Connect gateway.
   */
  deleteDirectConnectGateway(params: DirectConnect.Types.DeleteDirectConnectGatewayRequest, callback?: (err: AWSError, data: DirectConnect.Types.DeleteDirectConnectGatewayResult) => void): Request<DirectConnect.Types.DeleteDirectConnectGatewayResult, AWSError>;
  /**
   * Deletes the specified Direct Connect gateway. You must first delete all virtual interfaces that are attached to the Direct Connect gateway and disassociate all virtual private gateways associated with the Direct Connect gateway.
   */
  deleteDirectConnectGateway(callback?: (err: AWSError, data: DirectConnect.Types.DeleteDirectConnectGatewayResult) => void): Request<DirectConnect.Types.DeleteDirectConnectGatewayResult, AWSError>;
  /**
   * Deletes the association between the specified Direct Connect gateway and virtual private gateway. We recommend that you specify the associationID to delete the association. Alternatively, if you own virtual gateway and a Direct Connect gateway association, you can specify the virtualGatewayId and directConnectGatewayId to delete an association.
   */
  deleteDirectConnectGatewayAssociation(params: DirectConnect.Types.DeleteDirectConnectGatewayAssociationRequest, callback?: (err: AWSError, data: DirectConnect.Types.DeleteDirectConnectGatewayAssociationResult) => void): Request<DirectConnect.Types.DeleteDirectConnectGatewayAssociationResult, AWSError>;
  /**
   * Deletes the association between the specified Direct Connect gateway and virtual private gateway. We recommend that you specify the associationID to delete the association. Alternatively, if you own virtual gateway and a Direct Connect gateway association, you can specify the virtualGatewayId and directConnectGatewayId to delete an association.
   */
  deleteDirectConnectGatewayAssociation(callback?: (err: AWSError, data: DirectConnect.Types.DeleteDirectConnectGatewayAssociationResult) => void): Request<DirectConnect.Types.DeleteDirectConnectGatewayAssociationResult, AWSError>;
  /**
   * Deletes the association proposal request between the specified Direct Connect gateway and virtual private gateway or transit gateway.
   */
  deleteDirectConnectGatewayAssociationProposal(params: DirectConnect.Types.DeleteDirectConnectGatewayAssociationProposalRequest, callback?: (err: AWSError, data: DirectConnect.Types.DeleteDirectConnectGatewayAssociationProposalResult) => void): Request<DirectConnect.Types.DeleteDirectConnectGatewayAssociationProposalResult, AWSError>;
  /**
   * Deletes the association proposal request between the specified Direct Connect gateway and virtual private gateway or transit gateway.
   */
  deleteDirectConnectGatewayAssociationProposal(callback?: (err: AWSError, data: DirectConnect.Types.DeleteDirectConnectGatewayAssociationProposalResult) => void): Request<DirectConnect.Types.DeleteDirectConnectGatewayAssociationProposalResult, AWSError>;
  /**
   * Deletes the specified interconnect.  Intended for use by Direct Connect Partners only. 
   */
  deleteInterconnect(params: DirectConnect.Types.DeleteInterconnectRequest, callback?: (err: AWSError, data: DirectConnect.Types.DeleteInterconnectResponse) => void): Request<DirectConnect.Types.DeleteInterconnectResponse, AWSError>;
  /**
   * Deletes the specified interconnect.  Intended for use by Direct Connect Partners only. 
   */
  deleteInterconnect(callback?: (err: AWSError, data: DirectConnect.Types.DeleteInterconnectResponse) => void): Request<DirectConnect.Types.DeleteInterconnectResponse, AWSError>;
  /**
   * Deletes the specified link aggregation group (LAG). You cannot delete a LAG if it has active virtual interfaces or hosted connections.
   */
  deleteLag(params: DirectConnect.Types.DeleteLagRequest, callback?: (err: AWSError, data: DirectConnect.Types.Lag) => void): Request<DirectConnect.Types.Lag, AWSError>;
  /**
   * Deletes the specified link aggregation group (LAG). You cannot delete a LAG if it has active virtual interfaces or hosted connections.
   */
  deleteLag(callback?: (err: AWSError, data: DirectConnect.Types.Lag) => void): Request<DirectConnect.Types.Lag, AWSError>;
  /**
   * Deletes a virtual interface.
   */
  deleteVirtualInterface(params: DirectConnect.Types.DeleteVirtualInterfaceRequest, callback?: (err: AWSError, data: DirectConnect.Types.DeleteVirtualInterfaceResponse) => void): Request<DirectConnect.Types.DeleteVirtualInterfaceResponse, AWSError>;
  /**
   * Deletes a virtual interface.
   */
  deleteVirtualInterface(callback?: (err: AWSError, data: DirectConnect.Types.DeleteVirtualInterfaceResponse) => void): Request<DirectConnect.Types.DeleteVirtualInterfaceResponse, AWSError>;
  /**
   * Deprecated. Use DescribeLoa instead. Gets the LOA-CFA for a connection. The Letter of Authorization - Connecting Facility Assignment (LOA-CFA) is a document that your APN partner or service provider uses when establishing your cross connect to Amazon Web Services at the colocation facility. For more information, see Requesting Cross Connects at Direct Connect Locations in the Direct Connect User Guide.
   */
  describeConnectionLoa(params: DirectConnect.Types.DescribeConnectionLoaRequest, callback?: (err: AWSError, data: DirectConnect.Types.DescribeConnectionLoaResponse) => void): Request<DirectConnect.Types.DescribeConnectionLoaResponse, AWSError>;
  /**
   * Deprecated. Use DescribeLoa instead. Gets the LOA-CFA for a connection. The Letter of Authorization - Connecting Facility Assignment (LOA-CFA) is a document that your APN partner or service provider uses when establishing your cross connect to Amazon Web Services at the colocation facility. For more information, see Requesting Cross Connects at Direct Connect Locations in the Direct Connect User Guide.
   */
  describeConnectionLoa(callback?: (err: AWSError, data: DirectConnect.Types.DescribeConnectionLoaResponse) => void): Request<DirectConnect.Types.DescribeConnectionLoaResponse, AWSError>;
  /**
   * Displays the specified connection or all connections in this Region.
   */
  describeConnections(params: DirectConnect.Types.DescribeConnectionsRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connections) => void): Request<DirectConnect.Types.Connections, AWSError>;
  /**
   * Displays the specified connection or all connections in this Region.
   */
  describeConnections(callback?: (err: AWSError, data: DirectConnect.Types.Connections) => void): Request<DirectConnect.Types.Connections, AWSError>;
  /**
   * Deprecated. Use DescribeHostedConnections instead. Lists the connections that have been provisioned on the specified interconnect.  Intended for use by Direct Connect Partners only. 
   */
  describeConnectionsOnInterconnect(params: DirectConnect.Types.DescribeConnectionsOnInterconnectRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connections) => void): Request<DirectConnect.Types.Connections, AWSError>;
  /**
   * Deprecated. Use DescribeHostedConnections instead. Lists the connections that have been provisioned on the specified interconnect.  Intended for use by Direct Connect Partners only. 
   */
  describeConnectionsOnInterconnect(callback?: (err: AWSError, data: DirectConnect.Types.Connections) => void): Request<DirectConnect.Types.Connections, AWSError>;
  /**
   * Get and view a list of customer agreements, along with their signed status and whether the customer is an NNIPartner, NNIPartnerV2, or a nonPartner. 
   */
  describeCustomerMetadata(callback?: (err: AWSError, data: DirectConnect.Types.DescribeCustomerMetadataResponse) => void): Request<DirectConnect.Types.DescribeCustomerMetadataResponse, AWSError>;
  /**
   * Describes one or more association proposals for connection between a virtual private gateway or transit gateway and a Direct Connect gateway. 
   */
  describeDirectConnectGatewayAssociationProposals(params: DirectConnect.Types.DescribeDirectConnectGatewayAssociationProposalsRequest, callback?: (err: AWSError, data: DirectConnect.Types.DescribeDirectConnectGatewayAssociationProposalsResult) => void): Request<DirectConnect.Types.DescribeDirectConnectGatewayAssociationProposalsResult, AWSError>;
  /**
   * Describes one or more association proposals for connection between a virtual private gateway or transit gateway and a Direct Connect gateway. 
   */
  describeDirectConnectGatewayAssociationProposals(callback?: (err: AWSError, data: DirectConnect.Types.DescribeDirectConnectGatewayAssociationProposalsResult) => void): Request<DirectConnect.Types.DescribeDirectConnectGatewayAssociationProposalsResult, AWSError>;
  /**
   * Lists the associations between your Direct Connect gateways and virtual private gateways and transit gateways. You must specify one of the following:   A Direct Connect gateway The response contains all virtual private gateways and transit gateways associated with the Direct Connect gateway.   A virtual private gateway The response contains the Direct Connect gateway.   A transit gateway The response contains the Direct Connect gateway.   A Direct Connect gateway and a virtual private gateway The response contains the association between the Direct Connect gateway and virtual private gateway.   A Direct Connect gateway and a transit gateway The response contains the association between the Direct Connect gateway and transit gateway.  
   */
  describeDirectConnectGatewayAssociations(params: DirectConnect.Types.DescribeDirectConnectGatewayAssociationsRequest, callback?: (err: AWSError, data: DirectConnect.Types.DescribeDirectConnectGatewayAssociationsResult) => void): Request<DirectConnect.Types.DescribeDirectConnectGatewayAssociationsResult, AWSError>;
  /**
   * Lists the associations between your Direct Connect gateways and virtual private gateways and transit gateways. You must specify one of the following:   A Direct Connect gateway The response contains all virtual private gateways and transit gateways associated with the Direct Connect gateway.   A virtual private gateway The response contains the Direct Connect gateway.   A transit gateway The response contains the Direct Connect gateway.   A Direct Connect gateway and a virtual private gateway The response contains the association between the Direct Connect gateway and virtual private gateway.   A Direct Connect gateway and a transit gateway The response contains the association between the Direct Connect gateway and transit gateway.  
   */
  describeDirectConnectGatewayAssociations(callback?: (err: AWSError, data: DirectConnect.Types.DescribeDirectConnectGatewayAssociationsResult) => void): Request<DirectConnect.Types.DescribeDirectConnectGatewayAssociationsResult, AWSError>;
  /**
   * Lists the attachments between your Direct Connect gateways and virtual interfaces. You must specify a Direct Connect gateway, a virtual interface, or both. If you specify a Direct Connect gateway, the response contains all virtual interfaces attached to the Direct Connect gateway. If you specify a virtual interface, the response contains all Direct Connect gateways attached to the virtual interface. If you specify both, the response contains the attachment between the Direct Connect gateway and the virtual interface.
   */
  describeDirectConnectGatewayAttachments(params: DirectConnect.Types.DescribeDirectConnectGatewayAttachmentsRequest, callback?: (err: AWSError, data: DirectConnect.Types.DescribeDirectConnectGatewayAttachmentsResult) => void): Request<DirectConnect.Types.DescribeDirectConnectGatewayAttachmentsResult, AWSError>;
  /**
   * Lists the attachments between your Direct Connect gateways and virtual interfaces. You must specify a Direct Connect gateway, a virtual interface, or both. If you specify a Direct Connect gateway, the response contains all virtual interfaces attached to the Direct Connect gateway. If you specify a virtual interface, the response contains all Direct Connect gateways attached to the virtual interface. If you specify both, the response contains the attachment between the Direct Connect gateway and the virtual interface.
   */
  describeDirectConnectGatewayAttachments(callback?: (err: AWSError, data: DirectConnect.Types.DescribeDirectConnectGatewayAttachmentsResult) => void): Request<DirectConnect.Types.DescribeDirectConnectGatewayAttachmentsResult, AWSError>;
  /**
   * Lists all your Direct Connect gateways or only the specified Direct Connect gateway. Deleted Direct Connect gateways are not returned.
   */
  describeDirectConnectGateways(params: DirectConnect.Types.DescribeDirectConnectGatewaysRequest, callback?: (err: AWSError, data: DirectConnect.Types.DescribeDirectConnectGatewaysResult) => void): Request<DirectConnect.Types.DescribeDirectConnectGatewaysResult, AWSError>;
  /**
   * Lists all your Direct Connect gateways or only the specified Direct Connect gateway. Deleted Direct Connect gateways are not returned.
   */
  describeDirectConnectGateways(callback?: (err: AWSError, data: DirectConnect.Types.DescribeDirectConnectGatewaysResult) => void): Request<DirectConnect.Types.DescribeDirectConnectGatewaysResult, AWSError>;
  /**
   * Lists the hosted connections that have been provisioned on the specified interconnect or link aggregation group (LAG).  Intended for use by Direct Connect Partners only. 
   */
  describeHostedConnections(params: DirectConnect.Types.DescribeHostedConnectionsRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connections) => void): Request<DirectConnect.Types.Connections, AWSError>;
  /**
   * Lists the hosted connections that have been provisioned on the specified interconnect or link aggregation group (LAG).  Intended for use by Direct Connect Partners only. 
   */
  describeHostedConnections(callback?: (err: AWSError, data: DirectConnect.Types.Connections) => void): Request<DirectConnect.Types.Connections, AWSError>;
  /**
   * Deprecated. Use DescribeLoa instead. Gets the LOA-CFA for the specified interconnect. The Letter of Authorization - Connecting Facility Assignment (LOA-CFA) is a document that is used when establishing your cross connect to Amazon Web Services at the colocation facility. For more information, see Requesting Cross Connects at Direct Connect Locations in the Direct Connect User Guide.
   */
  describeInterconnectLoa(params: DirectConnect.Types.DescribeInterconnectLoaRequest, callback?: (err: AWSError, data: DirectConnect.Types.DescribeInterconnectLoaResponse) => void): Request<DirectConnect.Types.DescribeInterconnectLoaResponse, AWSError>;
  /**
   * Deprecated. Use DescribeLoa instead. Gets the LOA-CFA for the specified interconnect. The Letter of Authorization - Connecting Facility Assignment (LOA-CFA) is a document that is used when establishing your cross connect to Amazon Web Services at the colocation facility. For more information, see Requesting Cross Connects at Direct Connect Locations in the Direct Connect User Guide.
   */
  describeInterconnectLoa(callback?: (err: AWSError, data: DirectConnect.Types.DescribeInterconnectLoaResponse) => void): Request<DirectConnect.Types.DescribeInterconnectLoaResponse, AWSError>;
  /**
   * Lists the interconnects owned by the Amazon Web Services account or only the specified interconnect.
   */
  describeInterconnects(params: DirectConnect.Types.DescribeInterconnectsRequest, callback?: (err: AWSError, data: DirectConnect.Types.Interconnects) => void): Request<DirectConnect.Types.Interconnects, AWSError>;
  /**
   * Lists the interconnects owned by the Amazon Web Services account or only the specified interconnect.
   */
  describeInterconnects(callback?: (err: AWSError, data: DirectConnect.Types.Interconnects) => void): Request<DirectConnect.Types.Interconnects, AWSError>;
  /**
   * Describes all your link aggregation groups (LAG) or the specified LAG.
   */
  describeLags(params: DirectConnect.Types.DescribeLagsRequest, callback?: (err: AWSError, data: DirectConnect.Types.Lags) => void): Request<DirectConnect.Types.Lags, AWSError>;
  /**
   * Describes all your link aggregation groups (LAG) or the specified LAG.
   */
  describeLags(callback?: (err: AWSError, data: DirectConnect.Types.Lags) => void): Request<DirectConnect.Types.Lags, AWSError>;
  /**
   * Gets the LOA-CFA for a connection, interconnect, or link aggregation group (LAG). The Letter of Authorization - Connecting Facility Assignment (LOA-CFA) is a document that is used when establishing your cross connect to Amazon Web Services at the colocation facility. For more information, see Requesting Cross Connects at Direct Connect Locations in the Direct Connect User Guide.
   */
  describeLoa(params: DirectConnect.Types.DescribeLoaRequest, callback?: (err: AWSError, data: DirectConnect.Types.Loa) => void): Request<DirectConnect.Types.Loa, AWSError>;
  /**
   * Gets the LOA-CFA for a connection, interconnect, or link aggregation group (LAG). The Letter of Authorization - Connecting Facility Assignment (LOA-CFA) is a document that is used when establishing your cross connect to Amazon Web Services at the colocation facility. For more information, see Requesting Cross Connects at Direct Connect Locations in the Direct Connect User Guide.
   */
  describeLoa(callback?: (err: AWSError, data: DirectConnect.Types.Loa) => void): Request<DirectConnect.Types.Loa, AWSError>;
  /**
   * Lists the Direct Connect locations in the current Amazon Web Services Region. These are the locations that can be selected when calling CreateConnection or CreateInterconnect.
   */
  describeLocations(callback?: (err: AWSError, data: DirectConnect.Types.Locations) => void): Request<DirectConnect.Types.Locations, AWSError>;
  /**
   *  Details about the router. 
   */
  describeRouterConfiguration(params: DirectConnect.Types.DescribeRouterConfigurationRequest, callback?: (err: AWSError, data: DirectConnect.Types.DescribeRouterConfigurationResponse) => void): Request<DirectConnect.Types.DescribeRouterConfigurationResponse, AWSError>;
  /**
   *  Details about the router. 
   */
  describeRouterConfiguration(callback?: (err: AWSError, data: DirectConnect.Types.DescribeRouterConfigurationResponse) => void): Request<DirectConnect.Types.DescribeRouterConfigurationResponse, AWSError>;
  /**
   * Describes the tags associated with the specified Direct Connect resources.
   */
  describeTags(params: DirectConnect.Types.DescribeTagsRequest, callback?: (err: AWSError, data: DirectConnect.Types.DescribeTagsResponse) => void): Request<DirectConnect.Types.DescribeTagsResponse, AWSError>;
  /**
   * Describes the tags associated with the specified Direct Connect resources.
   */
  describeTags(callback?: (err: AWSError, data: DirectConnect.Types.DescribeTagsResponse) => void): Request<DirectConnect.Types.DescribeTagsResponse, AWSError>;
  /**
   * Lists the virtual private gateways owned by the Amazon Web Services account. You can create one or more Direct Connect private virtual interfaces linked to a virtual private gateway.
   */
  describeVirtualGateways(callback?: (err: AWSError, data: DirectConnect.Types.VirtualGateways) => void): Request<DirectConnect.Types.VirtualGateways, AWSError>;
  /**
   * Displays all virtual interfaces for an Amazon Web Services account. Virtual interfaces deleted fewer than 15 minutes before you make the request are also returned. If you specify a connection ID, only the virtual interfaces associated with the connection are returned. If you specify a virtual interface ID, then only a single virtual interface is returned. A virtual interface (VLAN) transmits the traffic between the Direct Connect location and the customer network.
   */
  describeVirtualInterfaces(params: DirectConnect.Types.DescribeVirtualInterfacesRequest, callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterfaces) => void): Request<DirectConnect.Types.VirtualInterfaces, AWSError>;
  /**
   * Displays all virtual interfaces for an Amazon Web Services account. Virtual interfaces deleted fewer than 15 minutes before you make the request are also returned. If you specify a connection ID, only the virtual interfaces associated with the connection are returned. If you specify a virtual interface ID, then only a single virtual interface is returned. A virtual interface (VLAN) transmits the traffic between the Direct Connect location and the customer network.
   */
  describeVirtualInterfaces(callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterfaces) => void): Request<DirectConnect.Types.VirtualInterfaces, AWSError>;
  /**
   * Disassociates a connection from a link aggregation group (LAG). The connection is interrupted and re-established as a standalone connection (the connection is not deleted; to delete the connection, use the DeleteConnection request). If the LAG has associated virtual interfaces or hosted connections, they remain associated with the LAG. A disassociated connection owned by an Direct Connect Partner is automatically converted to an interconnect. If disassociating the connection would cause the LAG to fall below its setting for minimum number of operational connections, the request fails, except when it's the last member of the LAG. If all connections are disassociated, the LAG continues to exist as an empty LAG with no physical connections. 
   */
  disassociateConnectionFromLag(params: DirectConnect.Types.DisassociateConnectionFromLagRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Disassociates a connection from a link aggregation group (LAG). The connection is interrupted and re-established as a standalone connection (the connection is not deleted; to delete the connection, use the DeleteConnection request). If the LAG has associated virtual interfaces or hosted connections, they remain associated with the LAG. A disassociated connection owned by an Direct Connect Partner is automatically converted to an interconnect. If disassociating the connection would cause the LAG to fall below its setting for minimum number of operational connections, the request fails, except when it's the last member of the LAG. If all connections are disassociated, the LAG continues to exist as an empty LAG with no physical connections. 
   */
  disassociateConnectionFromLag(callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Removes the association between a MAC Security (MACsec) security key and an Direct Connect dedicated connection.
   */
  disassociateMacSecKey(params: DirectConnect.Types.DisassociateMacSecKeyRequest, callback?: (err: AWSError, data: DirectConnect.Types.DisassociateMacSecKeyResponse) => void): Request<DirectConnect.Types.DisassociateMacSecKeyResponse, AWSError>;
  /**
   * Removes the association between a MAC Security (MACsec) security key and an Direct Connect dedicated connection.
   */
  disassociateMacSecKey(callback?: (err: AWSError, data: DirectConnect.Types.DisassociateMacSecKeyResponse) => void): Request<DirectConnect.Types.DisassociateMacSecKeyResponse, AWSError>;
  /**
   * Lists the virtual interface failover test history.
   */
  listVirtualInterfaceTestHistory(params: DirectConnect.Types.ListVirtualInterfaceTestHistoryRequest, callback?: (err: AWSError, data: DirectConnect.Types.ListVirtualInterfaceTestHistoryResponse) => void): Request<DirectConnect.Types.ListVirtualInterfaceTestHistoryResponse, AWSError>;
  /**
   * Lists the virtual interface failover test history.
   */
  listVirtualInterfaceTestHistory(callback?: (err: AWSError, data: DirectConnect.Types.ListVirtualInterfaceTestHistoryResponse) => void): Request<DirectConnect.Types.ListVirtualInterfaceTestHistoryResponse, AWSError>;
  /**
   * Starts the virtual interface failover test that verifies your configuration meets your resiliency requirements by placing the BGP peering session in the DOWN state. You can then send traffic to verify that there are no outages. You can run the test on public, private, transit, and hosted virtual interfaces. You can use ListVirtualInterfaceTestHistory to view the virtual interface test history. If you need to stop the test before the test interval completes, use StopBgpFailoverTest.
   */
  startBgpFailoverTest(params: DirectConnect.Types.StartBgpFailoverTestRequest, callback?: (err: AWSError, data: DirectConnect.Types.StartBgpFailoverTestResponse) => void): Request<DirectConnect.Types.StartBgpFailoverTestResponse, AWSError>;
  /**
   * Starts the virtual interface failover test that verifies your configuration meets your resiliency requirements by placing the BGP peering session in the DOWN state. You can then send traffic to verify that there are no outages. You can run the test on public, private, transit, and hosted virtual interfaces. You can use ListVirtualInterfaceTestHistory to view the virtual interface test history. If you need to stop the test before the test interval completes, use StopBgpFailoverTest.
   */
  startBgpFailoverTest(callback?: (err: AWSError, data: DirectConnect.Types.StartBgpFailoverTestResponse) => void): Request<DirectConnect.Types.StartBgpFailoverTestResponse, AWSError>;
  /**
   * Stops the virtual interface failover test.
   */
  stopBgpFailoverTest(params: DirectConnect.Types.StopBgpFailoverTestRequest, callback?: (err: AWSError, data: DirectConnect.Types.StopBgpFailoverTestResponse) => void): Request<DirectConnect.Types.StopBgpFailoverTestResponse, AWSError>;
  /**
   * Stops the virtual interface failover test.
   */
  stopBgpFailoverTest(callback?: (err: AWSError, data: DirectConnect.Types.StopBgpFailoverTestResponse) => void): Request<DirectConnect.Types.StopBgpFailoverTestResponse, AWSError>;
  /**
   * Adds the specified tags to the specified Direct Connect resource. Each resource can have a maximum of 50 tags. Each tag consists of a key and an optional value. If a tag with the same key is already associated with the resource, this action updates its value.
   */
  tagResource(params: DirectConnect.Types.TagResourceRequest, callback?: (err: AWSError, data: DirectConnect.Types.TagResourceResponse) => void): Request<DirectConnect.Types.TagResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified Direct Connect resource. Each resource can have a maximum of 50 tags. Each tag consists of a key and an optional value. If a tag with the same key is already associated with the resource, this action updates its value.
   */
  tagResource(callback?: (err: AWSError, data: DirectConnect.Types.TagResourceResponse) => void): Request<DirectConnect.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified Direct Connect resource.
   */
  untagResource(params: DirectConnect.Types.UntagResourceRequest, callback?: (err: AWSError, data: DirectConnect.Types.UntagResourceResponse) => void): Request<DirectConnect.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified Direct Connect resource.
   */
  untagResource(callback?: (err: AWSError, data: DirectConnect.Types.UntagResourceResponse) => void): Request<DirectConnect.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the Direct Connect dedicated connection configuration. You can update the following parameters for a connection:   The connection name   The connection's MAC Security (MACsec) encryption mode.  
   */
  updateConnection(params: DirectConnect.Types.UpdateConnectionRequest, callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Updates the Direct Connect dedicated connection configuration. You can update the following parameters for a connection:   The connection name   The connection's MAC Security (MACsec) encryption mode.  
   */
  updateConnection(callback?: (err: AWSError, data: DirectConnect.Types.Connection) => void): Request<DirectConnect.Types.Connection, AWSError>;
  /**
   * Updates the name of a current Direct Connect gateway.
   */
  updateDirectConnectGateway(params: DirectConnect.Types.UpdateDirectConnectGatewayRequest, callback?: (err: AWSError, data: DirectConnect.Types.UpdateDirectConnectGatewayResponse) => void): Request<DirectConnect.Types.UpdateDirectConnectGatewayResponse, AWSError>;
  /**
   * Updates the name of a current Direct Connect gateway.
   */
  updateDirectConnectGateway(callback?: (err: AWSError, data: DirectConnect.Types.UpdateDirectConnectGatewayResponse) => void): Request<DirectConnect.Types.UpdateDirectConnectGatewayResponse, AWSError>;
  /**
   * Updates the specified attributes of the Direct Connect gateway association. Add or remove prefixes from the association.
   */
  updateDirectConnectGatewayAssociation(params: DirectConnect.Types.UpdateDirectConnectGatewayAssociationRequest, callback?: (err: AWSError, data: DirectConnect.Types.UpdateDirectConnectGatewayAssociationResult) => void): Request<DirectConnect.Types.UpdateDirectConnectGatewayAssociationResult, AWSError>;
  /**
   * Updates the specified attributes of the Direct Connect gateway association. Add or remove prefixes from the association.
   */
  updateDirectConnectGatewayAssociation(callback?: (err: AWSError, data: DirectConnect.Types.UpdateDirectConnectGatewayAssociationResult) => void): Request<DirectConnect.Types.UpdateDirectConnectGatewayAssociationResult, AWSError>;
  /**
   * Updates the attributes of the specified link aggregation group (LAG). You can update the following LAG attributes:   The name of the LAG.   The value for the minimum number of connections that must be operational for the LAG itself to be operational.    The LAG's MACsec encryption mode. Amazon Web Services assigns this value to each connection which is part of the LAG.   The tags    If you adjust the threshold value for the minimum number of operational connections, ensure that the new value does not cause the LAG to fall below the threshold and become non-operational. 
   */
  updateLag(params: DirectConnect.Types.UpdateLagRequest, callback?: (err: AWSError, data: DirectConnect.Types.Lag) => void): Request<DirectConnect.Types.Lag, AWSError>;
  /**
   * Updates the attributes of the specified link aggregation group (LAG). You can update the following LAG attributes:   The name of the LAG.   The value for the minimum number of connections that must be operational for the LAG itself to be operational.    The LAG's MACsec encryption mode. Amazon Web Services assigns this value to each connection which is part of the LAG.   The tags    If you adjust the threshold value for the minimum number of operational connections, ensure that the new value does not cause the LAG to fall below the threshold and become non-operational. 
   */
  updateLag(callback?: (err: AWSError, data: DirectConnect.Types.Lag) => void): Request<DirectConnect.Types.Lag, AWSError>;
  /**
   * Updates the specified attributes of the specified virtual private interface. Setting the MTU of a virtual interface to 9001 (jumbo frames) can cause an update to the underlying physical connection if it wasn't updated to support jumbo frames. Updating the connection disrupts network connectivity for all virtual interfaces associated with the connection for up to 30 seconds. To check whether your connection supports jumbo frames, call DescribeConnections. To check whether your virtual q interface supports jumbo frames, call DescribeVirtualInterfaces.
   */
  updateVirtualInterfaceAttributes(params: DirectConnect.Types.UpdateVirtualInterfaceAttributesRequest, callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
  /**
   * Updates the specified attributes of the specified virtual private interface. Setting the MTU of a virtual interface to 9001 (jumbo frames) can cause an update to the underlying physical connection if it wasn't updated to support jumbo frames. Updating the connection disrupts network connectivity for all virtual interfaces associated with the connection for up to 30 seconds. To check whether your connection supports jumbo frames, call DescribeConnections. To check whether your virtual q interface supports jumbo frames, call DescribeVirtualInterfaces.
   */
  updateVirtualInterfaceAttributes(callback?: (err: AWSError, data: DirectConnect.Types.VirtualInterface) => void): Request<DirectConnect.Types.VirtualInterface, AWSError>;
}
declare namespace DirectConnect {
  export type ASN = number;
  export interface AcceptDirectConnectGatewayAssociationProposalRequest {
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId: DirectConnectGatewayId;
    /**
     * The ID of the request proposal.
     */
    proposalId: DirectConnectGatewayAssociationProposalId;
    /**
     * The ID of the Amazon Web Services account that owns the virtual private gateway or transit gateway.
     */
    associatedGatewayOwnerAccount: OwnerAccount;
    /**
     * Overrides the Amazon VPC prefixes advertised to the Direct Connect gateway. For information about how to set the prefixes, see Allowed Prefixes in the Direct Connect User Guide.
     */
    overrideAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
  }
  export interface AcceptDirectConnectGatewayAssociationProposalResult {
    directConnectGatewayAssociation?: DirectConnectGatewayAssociation;
  }
  export type AddressFamily = "ipv4"|"ipv6"|string;
  export type AgreementList = CustomerAgreement[];
  export type AgreementName = string;
  export interface AllocateConnectionOnInterconnectRequest {
    /**
     * The bandwidth of the connection. The possible values are 50Mbps, 100Mbps, 200Mbps, 300Mbps, 400Mbps, 500Mbps, 1Gbps, 2Gbps, 5Gbps, and 10Gbps. Note that only those Direct Connect Partners who have met specific requirements are allowed to create a 1Gbps, 2Gbps, 5Gbps or 10Gbps hosted connection.
     */
    bandwidth: Bandwidth;
    /**
     * The name of the provisioned connection.
     */
    connectionName: ConnectionName;
    /**
     * The ID of the Amazon Web Services account of the customer for whom the connection will be provisioned.
     */
    ownerAccount: OwnerAccount;
    /**
     * The ID of the interconnect on which the connection will be provisioned.
     */
    interconnectId: InterconnectId;
    /**
     * The dedicated VLAN provisioned to the connection.
     */
    vlan: VLAN;
  }
  export interface AllocateHostedConnectionRequest {
    /**
     * The ID of the interconnect or LAG.
     */
    connectionId: ConnectionId;
    /**
     * The ID of the Amazon Web Services account ID of the customer for the connection.
     */
    ownerAccount: OwnerAccount;
    /**
     * The bandwidth of the connection. The possible values are 50Mbps, 100Mbps, 200Mbps, 300Mbps, 400Mbps, 500Mbps, 1Gbps, 2Gbps, 5Gbps, and 10Gbps. Note that only those Direct Connect Partners who have met specific requirements are allowed to create a 1Gbps, 2Gbps, 5Gbps or 10Gbps hosted connection. 
     */
    bandwidth: Bandwidth;
    /**
     * The name of the hosted connection.
     */
    connectionName: ConnectionName;
    /**
     * The dedicated VLAN provisioned to the hosted connection.
     */
    vlan: VLAN;
    /**
     * The tags associated with the connection.
     */
    tags?: TagList;
  }
  export interface AllocatePrivateVirtualInterfaceRequest {
    /**
     * The ID of the connection on which the private virtual interface is provisioned.
     */
    connectionId: ConnectionId;
    /**
     * The ID of the Amazon Web Services account that owns the virtual private interface.
     */
    ownerAccount: OwnerAccount;
    /**
     * Information about the private virtual interface.
     */
    newPrivateVirtualInterfaceAllocation: NewPrivateVirtualInterfaceAllocation;
  }
  export interface AllocatePublicVirtualInterfaceRequest {
    /**
     * The ID of the connection on which the public virtual interface is provisioned.
     */
    connectionId: ConnectionId;
    /**
     * The ID of the Amazon Web Services account that owns the public virtual interface.
     */
    ownerAccount: OwnerAccount;
    /**
     * Information about the public virtual interface.
     */
    newPublicVirtualInterfaceAllocation: NewPublicVirtualInterfaceAllocation;
  }
  export interface AllocateTransitVirtualInterfaceRequest {
    /**
     * The ID of the connection on which the transit virtual interface is provisioned.
     */
    connectionId: ConnectionId;
    /**
     * The ID of the Amazon Web Services account that owns the transit virtual interface.
     */
    ownerAccount: OwnerAccount;
    /**
     * Information about the transit virtual interface.
     */
    newTransitVirtualInterfaceAllocation: NewTransitVirtualInterfaceAllocation;
  }
  export interface AllocateTransitVirtualInterfaceResult {
    virtualInterface?: VirtualInterface;
  }
  export type AmazonAddress = string;
  export interface AssociateConnectionWithLagRequest {
    /**
     * The ID of the connection.
     */
    connectionId: ConnectionId;
    /**
     * The ID of the LAG with which to associate the connection.
     */
    lagId: LagId;
  }
  export interface AssociateHostedConnectionRequest {
    /**
     * The ID of the hosted connection.
     */
    connectionId: ConnectionId;
    /**
     * The ID of the interconnect or the LAG.
     */
    parentConnectionId: ConnectionId;
  }
  export interface AssociateMacSecKeyRequest {
    /**
     * The ID of the dedicated connection (dxcon-xxxx), or the ID of the LAG (dxlag-xxxx). You can use DescribeConnections or DescribeLags to retrieve connection ID.
     */
    connectionId: ConnectionId;
    /**
     * The Amazon Resource Name (ARN) of the MAC Security (MACsec) secret key to associate with the dedicated connection. You can use DescribeConnections or DescribeLags to retrieve the MAC Security (MACsec) secret key. If you use this request parameter, you do not use the ckn and cak request parameters.
     */
    secretARN?: SecretARN;
    /**
     * The MAC Security (MACsec) CKN to associate with the dedicated connection. You can create the CKN/CAK pair using an industry standard tool.  The valid values are 64 hexadecimal characters (0-9, A-E). If you use this request parameter, you must use the cak request parameter and not use the secretARN request parameter.
     */
    ckn?: Ckn;
    /**
     * The MAC Security (MACsec) CAK to associate with the dedicated connection. You can create the CKN/CAK pair using an industry standard tool.  The valid values are 64 hexadecimal characters (0-9, A-E). If you use this request parameter, you must use the ckn request parameter and not use the secretARN request parameter.
     */
    cak?: Cak;
  }
  export interface AssociateMacSecKeyResponse {
    /**
     * The ID of the dedicated connection (dxcon-xxxx), or the ID of the LAG (dxlag-xxxx).
     */
    connectionId?: ConnectionId;
    /**
     * The MAC Security (MACsec) security keys associated with the dedicated connection.
     */
    macSecKeys?: MacSecKeyList;
  }
  export interface AssociateVirtualInterfaceRequest {
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId: VirtualInterfaceId;
    /**
     * The ID of the LAG or connection.
     */
    connectionId: ConnectionId;
  }
  export interface AssociatedGateway {
    /**
     * The ID of the associated gateway.
     */
    id?: GatewayIdentifier;
    /**
     * The type of associated gateway.
     */
    type?: GatewayType;
    /**
     * The ID of the Amazon Web Services account that owns the associated virtual private gateway or transit gateway.
     */
    ownerAccount?: OwnerAccount;
    /**
     * The Region where the associated gateway is located.
     */
    region?: Region;
  }
  export type AssociatedGatewayId = string;
  export type AvailableMacSecPortSpeeds = PortSpeed[];
  export type AvailablePortSpeeds = PortSpeed[];
  export type AwsDevice = string;
  export type AwsDeviceV2 = string;
  export type AwsLogicalDeviceId = string;
  export type BGPAuthKey = string;
  export interface BGPPeer {
    /**
     * The ID of the BGP peer.
     */
    bgpPeerId?: BGPPeerId;
    /**
     * The autonomous system (AS) number for Border Gateway Protocol (BGP) configuration.
     */
    asn?: ASN;
    /**
     * The authentication key for BGP configuration. This string has a minimum length of 6 characters and and a maximun lenth of 80 characters.
     */
    authKey?: BGPAuthKey;
    /**
     * The address family for the BGP peer.
     */
    addressFamily?: AddressFamily;
    /**
     * The IP address assigned to the Amazon interface.
     */
    amazonAddress?: AmazonAddress;
    /**
     * The IP address assigned to the customer interface.
     */
    customerAddress?: CustomerAddress;
    /**
     * The state of the BGP peer. The following are the possible values:    verifying: The BGP peering addresses or ASN require validation before the BGP peer can be created. This state applies only to public virtual interfaces.    pending: The BGP peer is created, and remains in this state until it is ready to be established.    available: The BGP peer is ready to be established.    deleting: The BGP peer is being deleted.    deleted: The BGP peer is deleted and cannot be established.  
     */
    bgpPeerState?: BGPPeerState;
    /**
     * The status of the BGP peer. The following are the possible values:    up: The BGP peer is established. This state does not indicate the state of the routing function. Ensure that you are receiving routes over the BGP session.    down: The BGP peer is down.    unknown: The BGP peer status is not available.  
     */
    bgpStatus?: BGPStatus;
    /**
     * The Direct Connect endpoint that terminates the BGP peer.
     */
    awsDeviceV2?: AwsDeviceV2;
    /**
     * The Direct Connect endpoint that terminates the logical connection. This device might be different than the device that terminates the physical connection.
     */
    awsLogicalDeviceId?: AwsLogicalDeviceId;
  }
  export type BGPPeerId = string;
  export type BGPPeerIdList = BGPPeerId[];
  export type BGPPeerList = BGPPeer[];
  export type BGPPeerState = "verifying"|"pending"|"available"|"deleting"|"deleted"|string;
  export type BGPStatus = "up"|"down"|"unknown"|string;
  export type Bandwidth = string;
  export type BooleanFlag = boolean;
  export type CIDR = string;
  export type Cak = string;
  export type Ckn = string;
  export interface ConfirmConnectionRequest {
    /**
     * The ID of the hosted connection.
     */
    connectionId: ConnectionId;
  }
  export interface ConfirmConnectionResponse {
    /**
     * The state of the connection. The following are the possible values:    ordering: The initial state of a hosted connection provisioned on an interconnect. The connection stays in the ordering state until the owner of the hosted connection confirms or declines the connection order.    requested: The initial state of a standard connection. The connection stays in the requested state until the Letter of Authorization (LOA) is sent to the customer.    pending: The connection has been approved and is being initialized.    available: The network link is up and the connection is ready for use.    down: The network link is down.    deleting: The connection is being deleted.    deleted: The connection has been deleted.    rejected: A hosted connection in the ordering state enters the rejected state if it is deleted by the customer.    unknown: The state of the connection is not available.  
     */
    connectionState?: ConnectionState;
  }
  export interface ConfirmCustomerAgreementRequest {
    /**
     *  The name of the customer agreement. 
     */
    agreementName?: AgreementName;
  }
  export interface ConfirmCustomerAgreementResponse {
    /**
     *  The status of the customer agreement when the connection was created. This will be either signed or unsigned. 
     */
    status?: Status;
  }
  export interface ConfirmPrivateVirtualInterfaceRequest {
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId: VirtualInterfaceId;
    /**
     * The ID of the virtual private gateway.
     */
    virtualGatewayId?: VirtualGatewayId;
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
  }
  export interface ConfirmPrivateVirtualInterfaceResponse {
    /**
     * The state of the virtual interface. The following are the possible values:    confirming: The creation of the virtual interface is pending confirmation from the virtual interface owner. If the owner of the virtual interface is different from the owner of the connection on which it is provisioned, then the virtual interface will remain in this state until it is confirmed by the virtual interface owner.    verifying: This state only applies to public virtual interfaces. Each public virtual interface needs validation before the virtual interface can be created.    pending: A virtual interface is in this state from the time that it is created until the virtual interface is ready to forward traffic.    available: A virtual interface that is able to forward traffic.    down: A virtual interface that is BGP down.    deleting: A virtual interface is in this state immediately after calling DeleteVirtualInterface until it can no longer forward traffic.    deleted: A virtual interface that cannot forward traffic.    rejected: The virtual interface owner has declined creation of the virtual interface. If a virtual interface in the Confirming state is deleted by the virtual interface owner, the virtual interface enters the Rejected state.    unknown: The state of the virtual interface is not available.  
     */
    virtualInterfaceState?: VirtualInterfaceState;
  }
  export interface ConfirmPublicVirtualInterfaceRequest {
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId: VirtualInterfaceId;
  }
  export interface ConfirmPublicVirtualInterfaceResponse {
    /**
     * The state of the virtual interface. The following are the possible values:    confirming: The creation of the virtual interface is pending confirmation from the virtual interface owner. If the owner of the virtual interface is different from the owner of the connection on which it is provisioned, then the virtual interface will remain in this state until it is confirmed by the virtual interface owner.    verifying: This state only applies to public virtual interfaces. Each public virtual interface needs validation before the virtual interface can be created.    pending: A virtual interface is in this state from the time that it is created until the virtual interface is ready to forward traffic.    available: A virtual interface that is able to forward traffic.    down: A virtual interface that is BGP down.    deleting: A virtual interface is in this state immediately after calling DeleteVirtualInterface until it can no longer forward traffic.    deleted: A virtual interface that cannot forward traffic.    rejected: The virtual interface owner has declined creation of the virtual interface. If a virtual interface in the Confirming state is deleted by the virtual interface owner, the virtual interface enters the Rejected state.    unknown: The state of the virtual interface is not available.  
     */
    virtualInterfaceState?: VirtualInterfaceState;
  }
  export interface ConfirmTransitVirtualInterfaceRequest {
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId: VirtualInterfaceId;
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId: DirectConnectGatewayId;
  }
  export interface ConfirmTransitVirtualInterfaceResponse {
    /**
     * The state of the virtual interface. The following are the possible values:    confirming: The creation of the virtual interface is pending confirmation from the virtual interface owner. If the owner of the virtual interface is different from the owner of the connection on which it is provisioned, then the virtual interface will remain in this state until it is confirmed by the virtual interface owner.    verifying: This state only applies to public virtual interfaces. Each public virtual interface needs validation before the virtual interface can be created.    pending: A virtual interface is in this state from the time that it is created until the virtual interface is ready to forward traffic.    available: A virtual interface that is able to forward traffic.    down: A virtual interface that is BGP down.    deleting: A virtual interface is in this state immediately after calling DeleteVirtualInterface until it can no longer forward traffic.    deleted: A virtual interface that cannot forward traffic.    rejected: The virtual interface owner has declined creation of the virtual interface. If a virtual interface in the Confirming state is deleted by the virtual interface owner, the virtual interface enters the Rejected state.    unknown: The state of the virtual interface is not available.  
     */
    virtualInterfaceState?: VirtualInterfaceState;
  }
  export interface Connection {
    /**
     * The ID of the Amazon Web Services account that owns the connection.
     */
    ownerAccount?: OwnerAccount;
    /**
     * The ID of the connection.
     */
    connectionId?: ConnectionId;
    /**
     * The name of the connection.
     */
    connectionName?: ConnectionName;
    /**
     * The state of the connection. The following are the possible values:    ordering: The initial state of a hosted connection provisioned on an interconnect. The connection stays in the ordering state until the owner of the hosted connection confirms or declines the connection order.    requested: The initial state of a standard connection. The connection stays in the requested state until the Letter of Authorization (LOA) is sent to the customer.    pending: The connection has been approved and is being initialized.    available: The network link is up and the connection is ready for use.    down: The network link is down.    deleting: The connection is being deleted.    deleted: The connection has been deleted.    rejected: A hosted connection in the ordering state enters the rejected state if it is deleted by the customer.    unknown: The state of the connection is not available.  
     */
    connectionState?: ConnectionState;
    /**
     * The Amazon Web Services Region where the connection is located.
     */
    region?: Region;
    /**
     * The location of the connection.
     */
    location?: LocationCode;
    /**
     * The bandwidth of the connection.
     */
    bandwidth?: Bandwidth;
    /**
     * The ID of the VLAN.
     */
    vlan?: VLAN;
    /**
     * The name of the Direct Connect service provider associated with the connection.
     */
    partnerName?: PartnerName;
    /**
     * The time of the most recent call to DescribeLoa for this connection.
     */
    loaIssueTime?: LoaIssueTime;
    /**
     * The ID of the LAG.
     */
    lagId?: LagId;
    /**
     * The Direct Connect endpoint on which the physical connection terminates.
     */
    awsDevice?: AwsDevice;
    /**
     * Indicates whether jumbo frames (9001 MTU) are supported.
     */
    jumboFrameCapable?: JumboFrameCapable;
    /**
     * The Direct Connect endpoint that terminates the physical connection.
     */
    awsDeviceV2?: AwsDeviceV2;
    /**
     * The Direct Connect endpoint that terminates the logical connection. This device might be different than the device that terminates the physical connection.
     */
    awsLogicalDeviceId?: AwsLogicalDeviceId;
    /**
     * Indicates whether the connection supports a secondary BGP peer in the same address family (IPv4/IPv6).
     */
    hasLogicalRedundancy?: HasLogicalRedundancy;
    /**
     * The tags associated with the connection.
     */
    tags?: TagList;
    /**
     * The name of the service provider associated with the connection.
     */
    providerName?: ProviderName;
    /**
     * Indicates whether the connection supports MAC Security (MACsec).
     */
    macSecCapable?: MacSecCapable;
    /**
     * The MAC Security (MACsec) port link status of the connection. The valid values are Encryption Up, which means that there is an active Connection Key Name, or Encryption Down.
     */
    portEncryptionStatus?: PortEncryptionStatus;
    /**
     * The MAC Security (MACsec) connection encryption mode. The valid values are no_encrypt, should_encrypt, and must_encrypt.
     */
    encryptionMode?: EncryptionMode;
    /**
     * The MAC Security (MACsec) security keys associated with the connection.
     */
    macSecKeys?: MacSecKeyList;
  }
  export type ConnectionId = string;
  export type ConnectionList = Connection[];
  export type ConnectionName = string;
  export type ConnectionState = "ordering"|"requested"|"pending"|"available"|"down"|"deleting"|"deleted"|"rejected"|"unknown"|string;
  export interface Connections {
    /**
     * The connections.
     */
    connections?: ConnectionList;
  }
  export type Count = number;
  export interface CreateBGPPeerRequest {
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId?: VirtualInterfaceId;
    /**
     * Information about the BGP peer.
     */
    newBGPPeer?: NewBGPPeer;
  }
  export interface CreateBGPPeerResponse {
    /**
     * The virtual interface.
     */
    virtualInterface?: VirtualInterface;
  }
  export interface CreateConnectionRequest {
    /**
     * The location of the connection.
     */
    location: LocationCode;
    /**
     * The bandwidth of the connection.
     */
    bandwidth: Bandwidth;
    /**
     * The name of the connection.
     */
    connectionName: ConnectionName;
    /**
     * The ID of the LAG.
     */
    lagId?: LagId;
    /**
     * The tags to associate with the lag.
     */
    tags?: TagList;
    /**
     * The name of the service provider associated with the requested connection.
     */
    providerName?: ProviderName;
    /**
     * Indicates whether you want the connection to support MAC Security (MACsec). MAC Security (MACsec) is only available on dedicated connections. For information about MAC Security (MACsec) prerequisties, see MACsec prerequisties in the Direct Connect User Guide.
     */
    requestMACSec?: RequestMACSec;
  }
  export interface CreateDirectConnectGatewayAssociationProposalRequest {
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId: DirectConnectGatewayId;
    /**
     * The ID of the Amazon Web Services account that owns the Direct Connect gateway.
     */
    directConnectGatewayOwnerAccount: OwnerAccount;
    /**
     * The ID of the virtual private gateway or transit gateway.
     */
    gatewayId: GatewayIdToAssociate;
    /**
     * The Amazon VPC prefixes to advertise to the Direct Connect gateway.
     */
    addAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
    /**
     * The Amazon VPC prefixes to no longer advertise to the Direct Connect gateway.
     */
    removeAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
  }
  export interface CreateDirectConnectGatewayAssociationProposalResult {
    /**
     * Information about the Direct Connect gateway proposal.
     */
    directConnectGatewayAssociationProposal?: DirectConnectGatewayAssociationProposal;
  }
  export interface CreateDirectConnectGatewayAssociationRequest {
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId: DirectConnectGatewayId;
    /**
     * The ID of the virtual private gateway or transit gateway.
     */
    gatewayId?: GatewayIdToAssociate;
    /**
     * The Amazon VPC prefixes to advertise to the Direct Connect gateway This parameter is required when you create an association to a transit gateway. For information about how to set the prefixes, see Allowed Prefixes in the Direct Connect User Guide.
     */
    addAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
    /**
     * The ID of the virtual private gateway.
     */
    virtualGatewayId?: VirtualGatewayId;
  }
  export interface CreateDirectConnectGatewayAssociationResult {
    /**
     * The association to be created.
     */
    directConnectGatewayAssociation?: DirectConnectGatewayAssociation;
  }
  export interface CreateDirectConnectGatewayRequest {
    /**
     * The name of the Direct Connect gateway.
     */
    directConnectGatewayName: DirectConnectGatewayName;
    /**
     * The autonomous system number (ASN) for Border Gateway Protocol (BGP) to be configured on the Amazon side of the connection. The ASN must be in the private range of 64,512 to 65,534 or 4,200,000,000 to 4,294,967,294. The default is 64512.
     */
    amazonSideAsn?: LongAsn;
  }
  export interface CreateDirectConnectGatewayResult {
    /**
     * The Direct Connect gateway.
     */
    directConnectGateway?: DirectConnectGateway;
  }
  export interface CreateInterconnectRequest {
    /**
     * The name of the interconnect.
     */
    interconnectName: InterconnectName;
    /**
     * The port bandwidth, in Gbps. The possible values are 1 and 10.
     */
    bandwidth: Bandwidth;
    /**
     * The location of the interconnect.
     */
    location: LocationCode;
    /**
     * The ID of the LAG.
     */
    lagId?: LagId;
    /**
     * The tags to associate with the interconnect.
     */
    tags?: TagList;
    /**
     * The name of the service provider associated with the interconnect.
     */
    providerName?: ProviderName;
  }
  export interface CreateLagRequest {
    /**
     * The number of physical dedicated connections initially provisioned and bundled by the LAG.
     */
    numberOfConnections: Count;
    /**
     * The location for the LAG.
     */
    location: LocationCode;
    /**
     * The bandwidth of the individual physical dedicated connections bundled by the LAG. The possible values are 1Gbps and 10Gbps. 
     */
    connectionsBandwidth: Bandwidth;
    /**
     * The name of the LAG.
     */
    lagName: LagName;
    /**
     * The ID of an existing dedicated connection to migrate to the LAG.
     */
    connectionId?: ConnectionId;
    /**
     * The tags to associate with the LAG.
     */
    tags?: TagList;
    /**
     * The tags to associate with the automtically created LAGs.
     */
    childConnectionTags?: TagList;
    /**
     * The name of the service provider associated with the LAG.
     */
    providerName?: ProviderName;
    /**
     * Indicates whether the connection will support MAC Security (MACsec).  All connections in the LAG must be capable of supporting MAC Security (MACsec). For information about MAC Security (MACsec) prerequisties, see MACsec prerequisties in the Direct Connect User Guide. 
     */
    requestMACSec?: RequestMACSec;
  }
  export interface CreatePrivateVirtualInterfaceRequest {
    /**
     * The ID of the connection.
     */
    connectionId: ConnectionId;
    /**
     * Information about the private virtual interface.
     */
    newPrivateVirtualInterface: NewPrivateVirtualInterface;
  }
  export interface CreatePublicVirtualInterfaceRequest {
    /**
     * The ID of the connection.
     */
    connectionId: ConnectionId;
    /**
     * Information about the public virtual interface.
     */
    newPublicVirtualInterface: NewPublicVirtualInterface;
  }
  export interface CreateTransitVirtualInterfaceRequest {
    /**
     * The ID of the connection.
     */
    connectionId: ConnectionId;
    /**
     * Information about the transit virtual interface.
     */
    newTransitVirtualInterface: NewTransitVirtualInterface;
  }
  export interface CreateTransitVirtualInterfaceResult {
    virtualInterface?: VirtualInterface;
  }
  export type CustomerAddress = string;
  export interface CustomerAgreement {
    /**
     * The name of the agreement.
     */
    agreementName?: AgreementName;
    /**
     * The status of the customer agreement. This will be either signed or unsigned 
     */
    status?: Status;
  }
  export interface DeleteBGPPeerRequest {
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId?: VirtualInterfaceId;
    /**
     * The autonomous system (AS) number for Border Gateway Protocol (BGP) configuration.
     */
    asn?: ASN;
    /**
     * The IP address assigned to the customer interface.
     */
    customerAddress?: CustomerAddress;
    /**
     * The ID of the BGP peer.
     */
    bgpPeerId?: BGPPeerId;
  }
  export interface DeleteBGPPeerResponse {
    /**
     * The virtual interface.
     */
    virtualInterface?: VirtualInterface;
  }
  export interface DeleteConnectionRequest {
    /**
     * The ID of the connection.
     */
    connectionId: ConnectionId;
  }
  export interface DeleteDirectConnectGatewayAssociationProposalRequest {
    /**
     * The ID of the proposal.
     */
    proposalId: DirectConnectGatewayAssociationProposalId;
  }
  export interface DeleteDirectConnectGatewayAssociationProposalResult {
    /**
     * The ID of the associated gateway.
     */
    directConnectGatewayAssociationProposal?: DirectConnectGatewayAssociationProposal;
  }
  export interface DeleteDirectConnectGatewayAssociationRequest {
    /**
     * The ID of the Direct Connect gateway association.
     */
    associationId?: DirectConnectGatewayAssociationId;
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The ID of the virtual private gateway.
     */
    virtualGatewayId?: VirtualGatewayId;
  }
  export interface DeleteDirectConnectGatewayAssociationResult {
    /**
     * Information about the deleted association.
     */
    directConnectGatewayAssociation?: DirectConnectGatewayAssociation;
  }
  export interface DeleteDirectConnectGatewayRequest {
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId: DirectConnectGatewayId;
  }
  export interface DeleteDirectConnectGatewayResult {
    /**
     * The Direct Connect gateway.
     */
    directConnectGateway?: DirectConnectGateway;
  }
  export interface DeleteInterconnectRequest {
    /**
     * The ID of the interconnect.
     */
    interconnectId: InterconnectId;
  }
  export interface DeleteInterconnectResponse {
    /**
     * The state of the interconnect. The following are the possible values:    requested: The initial state of an interconnect. The interconnect stays in the requested state until the Letter of Authorization (LOA) is sent to the customer.    pending: The interconnect is approved, and is being initialized.    available: The network link is up, and the interconnect is ready for use.    down: The network link is down.    deleting: The interconnect is being deleted.    deleted: The interconnect is deleted.    unknown: The state of the interconnect is not available.  
     */
    interconnectState?: InterconnectState;
  }
  export interface DeleteLagRequest {
    /**
     * The ID of the LAG.
     */
    lagId: LagId;
  }
  export interface DeleteVirtualInterfaceRequest {
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId: VirtualInterfaceId;
  }
  export interface DeleteVirtualInterfaceResponse {
    /**
     * The state of the virtual interface. The following are the possible values:    confirming: The creation of the virtual interface is pending confirmation from the virtual interface owner. If the owner of the virtual interface is different from the owner of the connection on which it is provisioned, then the virtual interface will remain in this state until it is confirmed by the virtual interface owner.    verifying: This state only applies to public virtual interfaces. Each public virtual interface needs validation before the virtual interface can be created.    pending: A virtual interface is in this state from the time that it is created until the virtual interface is ready to forward traffic.    available: A virtual interface that is able to forward traffic.    down: A virtual interface that is BGP down.    deleting: A virtual interface is in this state immediately after calling DeleteVirtualInterface until it can no longer forward traffic.    deleted: A virtual interface that cannot forward traffic.    rejected: The virtual interface owner has declined creation of the virtual interface. If a virtual interface in the Confirming state is deleted by the virtual interface owner, the virtual interface enters the Rejected state.    unknown: The state of the virtual interface is not available.  
     */
    virtualInterfaceState?: VirtualInterfaceState;
  }
  export interface DescribeConnectionLoaRequest {
    /**
     * The ID of the connection.
     */
    connectionId: ConnectionId;
    /**
     * The name of the APN partner or service provider who establishes connectivity on your behalf. If you specify this parameter, the LOA-CFA lists the provider name alongside your company name as the requester of the cross connect.
     */
    providerName?: ProviderName;
    /**
     * The standard media type for the LOA-CFA document. The only supported value is application/pdf.
     */
    loaContentType?: LoaContentType;
  }
  export interface DescribeConnectionLoaResponse {
    /**
     * The Letter of Authorization - Connecting Facility Assignment (LOA-CFA).
     */
    loa?: Loa;
  }
  export interface DescribeConnectionsOnInterconnectRequest {
    /**
     * The ID of the interconnect.
     */
    interconnectId: InterconnectId;
  }
  export interface DescribeConnectionsRequest {
    /**
     * The ID of the connection.
     */
    connectionId?: ConnectionId;
  }
  export interface DescribeCustomerMetadataResponse {
    /**
     * The list of customer agreements.
     */
    agreements?: AgreementList;
    /**
     * The type of network-to-network interface (NNI) partner. The partner type will be one of the following:   V1: This partner can only allocate 50Mbps, 100Mbps, 200Mbps, 300Mbps, 400Mbps, or 500Mbps subgigabit connections.   V2: This partner can only allocate 1GB, 2GB, 5GB, or 10GB hosted connections.   nonPartner: The customer is not a partner.  
     */
    nniPartnerType?: NniPartnerType;
  }
  export interface DescribeDirectConnectGatewayAssociationProposalsRequest {
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The ID of the proposal.
     */
    proposalId?: DirectConnectGatewayAssociationProposalId;
    /**
     * The ID of the associated gateway.
     */
    associatedGatewayId?: AssociatedGatewayId;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value. If MaxResults is given a value larger than 100, only 100 results are returned.
     */
    maxResults?: MaxResultSetSize;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeDirectConnectGatewayAssociationProposalsResult {
    /**
     * Describes the Direct Connect gateway association proposals.
     */
    directConnectGatewayAssociationProposals?: DirectConnectGatewayAssociationProposalList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeDirectConnectGatewayAssociationsRequest {
    /**
     * The ID of the Direct Connect gateway association.
     */
    associationId?: DirectConnectGatewayAssociationId;
    /**
     * The ID of the associated gateway.
     */
    associatedGatewayId?: AssociatedGatewayId;
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value. If MaxResults is given a value larger than 100, only 100 results are returned.
     */
    maxResults?: MaxResultSetSize;
    /**
     * The token provided in the previous call to retrieve the next page.
     */
    nextToken?: PaginationToken;
    /**
     * The ID of the virtual private gateway or transit gateway.
     */
    virtualGatewayId?: VirtualGatewayId;
  }
  export interface DescribeDirectConnectGatewayAssociationsResult {
    /**
     * Information about the associations.
     */
    directConnectGatewayAssociations?: DirectConnectGatewayAssociationList;
    /**
     * The token to retrieve the next page.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeDirectConnectGatewayAttachmentsRequest {
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId?: VirtualInterfaceId;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value. If MaxResults is given a value larger than 100, only 100 results are returned.
     */
    maxResults?: MaxResultSetSize;
    /**
     * The token provided in the previous call to retrieve the next page.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeDirectConnectGatewayAttachmentsResult {
    /**
     * The attachments.
     */
    directConnectGatewayAttachments?: DirectConnectGatewayAttachmentList;
    /**
     * The token to retrieve the next page.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeDirectConnectGatewaysRequest {
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value. If MaxResults is given a value larger than 100, only 100 results are returned.
     */
    maxResults?: MaxResultSetSize;
    /**
     * The token provided in the previous call to retrieve the next page.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeDirectConnectGatewaysResult {
    /**
     * The Direct Connect gateways.
     */
    directConnectGateways?: DirectConnectGatewayList;
    /**
     * The token to retrieve the next page.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeHostedConnectionsRequest {
    /**
     * The ID of the interconnect or LAG.
     */
    connectionId: ConnectionId;
  }
  export interface DescribeInterconnectLoaRequest {
    /**
     * The ID of the interconnect.
     */
    interconnectId: InterconnectId;
    /**
     * The name of the service provider who establishes connectivity on your behalf. If you supply this parameter, the LOA-CFA lists the provider name alongside your company name as the requester of the cross connect.
     */
    providerName?: ProviderName;
    /**
     * The standard media type for the LOA-CFA document. The only supported value is application/pdf.
     */
    loaContentType?: LoaContentType;
  }
  export interface DescribeInterconnectLoaResponse {
    /**
     * The Letter of Authorization - Connecting Facility Assignment (LOA-CFA).
     */
    loa?: Loa;
  }
  export interface DescribeInterconnectsRequest {
    /**
     * The ID of the interconnect.
     */
    interconnectId?: InterconnectId;
  }
  export interface DescribeLagsRequest {
    /**
     * The ID of the LAG.
     */
    lagId?: LagId;
  }
  export interface DescribeLoaRequest {
    /**
     * The ID of a connection, LAG, or interconnect.
     */
    connectionId: ConnectionId;
    /**
     * The name of the service provider who establishes connectivity on your behalf. If you specify this parameter, the LOA-CFA lists the provider name alongside your company name as the requester of the cross connect.
     */
    providerName?: ProviderName;
    /**
     * The standard media type for the LOA-CFA document. The only supported value is application/pdf.
     */
    loaContentType?: LoaContentType;
  }
  export interface DescribeRouterConfigurationRequest {
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId: VirtualInterfaceId;
    /**
     * Identifies the router by a combination of vendor, platform, and software version. For example, CiscoSystemsInc-2900SeriesRouters-IOS124.
     */
    routerTypeIdentifier?: RouterTypeIdentifier;
  }
  export interface DescribeRouterConfigurationResponse {
    /**
     * The customer router configuration.
     */
    customerRouterConfig?: RouterConfig;
    /**
     * The details about the router.
     */
    router?: RouterType;
    /**
     * The ID assigned to the virtual interface.
     */
    virtualInterfaceId?: VirtualInterfaceId;
    /**
     * The name of the virtual interface assigned by the customer network.
     */
    virtualInterfaceName?: VirtualInterfaceName;
  }
  export interface DescribeTagsRequest {
    /**
     * The Amazon Resource Names (ARNs) of the resources.
     */
    resourceArns: ResourceArnList;
  }
  export interface DescribeTagsResponse {
    /**
     * Information about the tags.
     */
    resourceTags?: ResourceTagList;
  }
  export interface DescribeVirtualInterfacesRequest {
    /**
     * The ID of the connection.
     */
    connectionId?: ConnectionId;
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId?: VirtualInterfaceId;
  }
  export interface DirectConnectGateway {
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The name of the Direct Connect gateway.
     */
    directConnectGatewayName?: DirectConnectGatewayName;
    /**
     * The autonomous system number (ASN) for the Amazon side of the connection.
     */
    amazonSideAsn?: LongAsn;
    /**
     * The ID of the Amazon Web Services account that owns the Direct Connect gateway.
     */
    ownerAccount?: OwnerAccount;
    /**
     * The state of the Direct Connect gateway. The following are the possible values:    pending: The initial state after calling CreateDirectConnectGateway.    available: The Direct Connect gateway is ready for use.    deleting: The initial state after calling DeleteDirectConnectGateway.    deleted: The Direct Connect gateway is deleted and cannot pass traffic.  
     */
    directConnectGatewayState?: DirectConnectGatewayState;
    /**
     * The error message if the state of an object failed to advance.
     */
    stateChangeError?: StateChangeError;
  }
  export interface DirectConnectGatewayAssociation {
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The ID of the Amazon Web Services account that owns the associated gateway.
     */
    directConnectGatewayOwnerAccount?: OwnerAccount;
    /**
     * The state of the association. The following are the possible values:    associating: The initial state after calling CreateDirectConnectGatewayAssociation.    associated: The Direct Connect gateway and virtual private gateway or transit gateway are successfully associated and ready to pass traffic.    disassociating: The initial state after calling DeleteDirectConnectGatewayAssociation.    disassociated: The virtual private gateway or transit gateway is disassociated from the Direct Connect gateway. Traffic flow between the Direct Connect gateway and virtual private gateway or transit gateway is stopped.  
     */
    associationState?: DirectConnectGatewayAssociationState;
    /**
     * The error message if the state of an object failed to advance.
     */
    stateChangeError?: StateChangeError;
    /**
     * Information about the associated gateway.
     */
    associatedGateway?: AssociatedGateway;
    /**
     * The ID of the Direct Connect gateway association.
     */
    associationId?: DirectConnectGatewayAssociationId;
    /**
     * The Amazon VPC prefixes to advertise to the Direct Connect gateway.
     */
    allowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
    /**
     * The ID of the virtual private gateway. Applies only to private virtual interfaces.
     */
    virtualGatewayId?: VirtualGatewayId;
    /**
     * The Amazon Web Services Region where the virtual private gateway is located.
     */
    virtualGatewayRegion?: VirtualGatewayRegion;
    /**
     * The ID of the Amazon Web Services account that owns the virtual private gateway.
     */
    virtualGatewayOwnerAccount?: OwnerAccount;
  }
  export type DirectConnectGatewayAssociationId = string;
  export type DirectConnectGatewayAssociationList = DirectConnectGatewayAssociation[];
  export interface DirectConnectGatewayAssociationProposal {
    /**
     * The ID of the association proposal.
     */
    proposalId?: DirectConnectGatewayAssociationProposalId;
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The ID of the Amazon Web Services account that owns the Direct Connect gateway.
     */
    directConnectGatewayOwnerAccount?: OwnerAccount;
    /**
     * The state of the proposal. The following are possible values:    accepted: The proposal has been accepted. The Direct Connect gateway association is available to use in this state.    deleted: The proposal has been deleted by the owner that made the proposal. The Direct Connect gateway association cannot be used in this state.    requested: The proposal has been requested. The Direct Connect gateway association cannot be used in this state.  
     */
    proposalState?: DirectConnectGatewayAssociationProposalState;
    /**
     * Information about the associated gateway.
     */
    associatedGateway?: AssociatedGateway;
    /**
     * The existing Amazon VPC prefixes advertised to the Direct Connect gateway.
     */
    existingAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
    /**
     * The Amazon VPC prefixes to advertise to the Direct Connect gateway.
     */
    requestedAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
  }
  export type DirectConnectGatewayAssociationProposalId = string;
  export type DirectConnectGatewayAssociationProposalList = DirectConnectGatewayAssociationProposal[];
  export type DirectConnectGatewayAssociationProposalState = "requested"|"accepted"|"deleted"|string;
  export type DirectConnectGatewayAssociationState = "associating"|"associated"|"disassociating"|"disassociated"|"updating"|string;
  export interface DirectConnectGatewayAttachment {
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId?: VirtualInterfaceId;
    /**
     * The Amazon Web Services Region where the virtual interface is located.
     */
    virtualInterfaceRegion?: VirtualInterfaceRegion;
    /**
     * The ID of the Amazon Web Services account that owns the virtual interface.
     */
    virtualInterfaceOwnerAccount?: OwnerAccount;
    /**
     * The state of the attachment. The following are the possible values:    attaching: The initial state after a virtual interface is created using the Direct Connect gateway.    attached: The Direct Connect gateway and virtual interface are attached and ready to pass traffic.    detaching: The initial state after calling DeleteVirtualInterface.    detached: The virtual interface is detached from the Direct Connect gateway. Traffic flow between the Direct Connect gateway and virtual interface is stopped.  
     */
    attachmentState?: DirectConnectGatewayAttachmentState;
    /**
     * The type of attachment.
     */
    attachmentType?: DirectConnectGatewayAttachmentType;
    /**
     * The error message if the state of an object failed to advance.
     */
    stateChangeError?: StateChangeError;
  }
  export type DirectConnectGatewayAttachmentList = DirectConnectGatewayAttachment[];
  export type DirectConnectGatewayAttachmentState = "attaching"|"attached"|"detaching"|"detached"|string;
  export type DirectConnectGatewayAttachmentType = "TransitVirtualInterface"|"PrivateVirtualInterface"|string;
  export type DirectConnectGatewayId = string;
  export type DirectConnectGatewayList = DirectConnectGateway[];
  export type DirectConnectGatewayName = string;
  export type DirectConnectGatewayState = "pending"|"available"|"deleting"|"deleted"|string;
  export interface DisassociateConnectionFromLagRequest {
    /**
     * The ID of the connection.
     */
    connectionId: ConnectionId;
    /**
     * The ID of the LAG.
     */
    lagId: LagId;
  }
  export interface DisassociateMacSecKeyRequest {
    /**
     * The ID of the dedicated connection (dxcon-xxxx), or the ID of the LAG (dxlag-xxxx). You can use DescribeConnections or DescribeLags to retrieve connection ID.
     */
    connectionId: ConnectionId;
    /**
     * The Amazon Resource Name (ARN) of the MAC Security (MACsec) secret key. You can use DescribeConnections to retrieve the ARN of the MAC Security (MACsec) secret key.
     */
    secretARN: SecretARN;
  }
  export interface DisassociateMacSecKeyResponse {
    /**
     * The ID of the dedicated connection (dxcon-xxxx), or the ID of the LAG (dxlag-xxxx).
     */
    connectionId?: ConnectionId;
    /**
     * The MAC Security (MACsec) security keys no longer associated with the dedicated connection.
     */
    macSecKeys?: MacSecKeyList;
  }
  export type EncryptionMode = string;
  export type EndTime = Date;
  export type FailureTestHistoryStatus = string;
  export type GatewayIdToAssociate = string;
  export type GatewayIdentifier = string;
  export type GatewayType = "virtualPrivateGateway"|"transitGateway"|string;
  export type HasLogicalRedundancy = "unknown"|"yes"|"no"|string;
  export interface Interconnect {
    /**
     * The ID of the interconnect.
     */
    interconnectId?: InterconnectId;
    /**
     * The name of the interconnect.
     */
    interconnectName?: InterconnectName;
    /**
     * The state of the interconnect. The following are the possible values:    requested: The initial state of an interconnect. The interconnect stays in the requested state until the Letter of Authorization (LOA) is sent to the customer.    pending: The interconnect is approved, and is being initialized.    available: The network link is up, and the interconnect is ready for use.    down: The network link is down.    deleting: The interconnect is being deleted.    deleted: The interconnect is deleted.    unknown: The state of the interconnect is not available.  
     */
    interconnectState?: InterconnectState;
    /**
     * The Amazon Web Services Region where the connection is located.
     */
    region?: Region;
    /**
     * The location of the connection.
     */
    location?: LocationCode;
    /**
     * The bandwidth of the connection.
     */
    bandwidth?: Bandwidth;
    /**
     * The time of the most recent call to DescribeLoa for this connection.
     */
    loaIssueTime?: LoaIssueTime;
    /**
     * The ID of the LAG.
     */
    lagId?: LagId;
    /**
     * The Direct Connect endpoint on which the physical connection terminates.
     */
    awsDevice?: AwsDevice;
    /**
     * Indicates whether jumbo frames (9001 MTU) are supported.
     */
    jumboFrameCapable?: JumboFrameCapable;
    /**
     * The Direct Connect endpoint that terminates the physical connection.
     */
    awsDeviceV2?: AwsDeviceV2;
    /**
     * The Direct Connect endpoint that terminates the logical connection. This device might be different than the device that terminates the physical connection.
     */
    awsLogicalDeviceId?: AwsLogicalDeviceId;
    /**
     * Indicates whether the interconnect supports a secondary BGP in the same address family (IPv4/IPv6).
     */
    hasLogicalRedundancy?: HasLogicalRedundancy;
    /**
     * The tags associated with the interconnect.
     */
    tags?: TagList;
    /**
     * The name of the service provider associated with the interconnect.
     */
    providerName?: ProviderName;
  }
  export type InterconnectId = string;
  export type InterconnectList = Interconnect[];
  export type InterconnectName = string;
  export type InterconnectState = "requested"|"pending"|"available"|"down"|"deleting"|"deleted"|"unknown"|string;
  export interface Interconnects {
    /**
     * The interconnects.
     */
    interconnects?: InterconnectList;
  }
  export type JumboFrameCapable = boolean;
  export interface Lag {
    /**
     * The individual bandwidth of the physical connections bundled by the LAG. The possible values are 1Gbps and 10Gbps. 
     */
    connectionsBandwidth?: Bandwidth;
    /**
     * The number of physical dedicated connections bundled by the LAG, up to a maximum of 10.
     */
    numberOfConnections?: Count;
    /**
     * The ID of the LAG.
     */
    lagId?: LagId;
    /**
     * The ID of the Amazon Web Services account that owns the LAG.
     */
    ownerAccount?: OwnerAccount;
    /**
     * The name of the LAG.
     */
    lagName?: LagName;
    /**
     * The state of the LAG. The following are the possible values:    requested: The initial state of a LAG. The LAG stays in the requested state until the Letter of Authorization (LOA) is available.    pending: The LAG has been approved and is being initialized.    available: The network link is established and the LAG is ready for use.    down: The network link is down.    deleting: The LAG is being deleted.    deleted: The LAG is deleted.    unknown: The state of the LAG is not available.  
     */
    lagState?: LagState;
    /**
     * The location of the LAG.
     */
    location?: LocationCode;
    /**
     * The Amazon Web Services Region where the connection is located.
     */
    region?: Region;
    /**
     * The minimum number of physical dedicated connections that must be operational for the LAG itself to be operational.
     */
    minimumLinks?: Count;
    /**
     * The Direct Connect endpoint that hosts the LAG.
     */
    awsDevice?: AwsDevice;
    /**
     * The Direct Connect endpoint that hosts the LAG.
     */
    awsDeviceV2?: AwsDeviceV2;
    /**
     * The Direct Connect endpoint that terminates the logical connection. This device might be different than the device that terminates the physical connection.
     */
    awsLogicalDeviceId?: AwsLogicalDeviceId;
    /**
     * The connections bundled by the LAG.
     */
    connections?: ConnectionList;
    /**
     * Indicates whether the LAG can host other connections.
     */
    allowsHostedConnections?: BooleanFlag;
    /**
     * Indicates whether jumbo frames (9001 MTU) are supported.
     */
    jumboFrameCapable?: JumboFrameCapable;
    /**
     * Indicates whether the LAG supports a secondary BGP peer in the same address family (IPv4/IPv6).
     */
    hasLogicalRedundancy?: HasLogicalRedundancy;
    /**
     * The tags associated with the LAG.
     */
    tags?: TagList;
    /**
     * The name of the service provider associated with the LAG.
     */
    providerName?: ProviderName;
    /**
     * Indicates whether the LAG supports MAC Security (MACsec).
     */
    macSecCapable?: MacSecCapable;
    /**
     * The LAG MAC Security (MACsec) encryption mode. The valid values are no_encrypt, should_encrypt, and must_encrypt.
     */
    encryptionMode?: EncryptionMode;
    /**
     * The MAC Security (MACsec) security keys associated with the LAG.
     */
    macSecKeys?: MacSecKeyList;
  }
  export type LagId = string;
  export type LagList = Lag[];
  export type LagName = string;
  export type LagState = "requested"|"pending"|"available"|"down"|"deleting"|"deleted"|"unknown"|string;
  export interface Lags {
    /**
     * The LAGs.
     */
    lags?: LagList;
  }
  export interface ListVirtualInterfaceTestHistoryRequest {
    /**
     * The ID of the virtual interface failover test.
     */
    testId?: TestId;
    /**
     * The ID of the virtual interface that was tested.
     */
    virtualInterfaceId?: VirtualInterfaceId;
    /**
     * The BGP peers that were placed in the DOWN state during the virtual interface failover test.
     */
    bgpPeers?: BGPPeerIdList;
    /**
     * The status of the virtual interface failover test.
     */
    status?: FailureTestHistoryStatus;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value. If MaxResults is given a value larger than 100, only 100 results are returned.
     */
    maxResults?: MaxResultSetSize;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListVirtualInterfaceTestHistoryResponse {
    /**
     * The ID of the tested virtual interface.
     */
    virtualInterfaceTestHistory?: VirtualInterfaceTestHistoryList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export interface Loa {
    /**
     * The binary contents of the LOA-CFA document.
     */
    loaContent?: LoaContent;
    /**
     * The standard media type for the LOA-CFA document. The only supported value is application/pdf.
     */
    loaContentType?: LoaContentType;
  }
  export type LoaContent = Buffer|Uint8Array|Blob|string;
  export type LoaContentType = "application/pdf"|string;
  export type LoaIssueTime = Date;
  export interface Location {
    /**
     * The code for the location.
     */
    locationCode?: LocationCode;
    /**
     * The name of the location. This includes the name of the colocation partner and the physical site of the building.
     */
    locationName?: LocationName;
    /**
     * The Amazon Web Services Region for the location.
     */
    region?: Region;
    /**
     * The available port speeds for the location.
     */
    availablePortSpeeds?: AvailablePortSpeeds;
    /**
     * The name of the service provider for the location.
     */
    availableProviders?: ProviderList;
    /**
     * The available MAC Security (MACsec) port speeds for the location.
     */
    availableMacSecPortSpeeds?: AvailableMacSecPortSpeeds;
  }
  export type LocationCode = string;
  export type LocationList = Location[];
  export type LocationName = string;
  export interface Locations {
    /**
     * The locations.
     */
    locations?: LocationList;
  }
  export type LongAsn = number;
  export type MTU = number;
  export type MacSecCapable = boolean;
  export interface MacSecKey {
    /**
     * The Amazon Resource Name (ARN) of the MAC Security (MACsec) secret key.
     */
    secretARN?: SecretARN;
    /**
     * The Connection Key Name (CKN) for the MAC Security secret key.
     */
    ckn?: Ckn;
    /**
     * The state of the MAC Security (MACsec) secret key. The possible values are:    associating: The MAC Security (MACsec) secret key is being validated and not yet associated with the connection or LAG.    associated: The MAC Security (MACsec) secret key is validated and associated with the connection or LAG.    disassociating: The MAC Security (MACsec) secret key is being disassociated from the connection or LAG    disassociated: The MAC Security (MACsec) secret key is no longer associated with the connection or LAG.  
     */
    state?: State;
    /**
     * The date that the MAC Security (MACsec) secret key takes effect. The value is displayed in UTC format.
     */
    startOn?: StartOnDate;
  }
  export type MacSecKeyList = MacSecKey[];
  export type MaxResultSetSize = number;
  export interface NewBGPPeer {
    /**
     * The autonomous system (AS) number for Border Gateway Protocol (BGP) configuration.
     */
    asn?: ASN;
    /**
     * The authentication key for BGP configuration. This string has a minimum length of 6 characters and and a maximun lenth of 80 characters.
     */
    authKey?: BGPAuthKey;
    /**
     * The address family for the BGP peer.
     */
    addressFamily?: AddressFamily;
    /**
     * The IP address assigned to the Amazon interface.
     */
    amazonAddress?: AmazonAddress;
    /**
     * The IP address assigned to the customer interface.
     */
    customerAddress?: CustomerAddress;
  }
  export interface NewPrivateVirtualInterface {
    /**
     * The name of the virtual interface assigned by the customer network. The name has a maximum of 100 characters. The following are valid characters: a-z, 0-9 and a hyphen (-).
     */
    virtualInterfaceName: VirtualInterfaceName;
    /**
     * The ID of the VLAN.
     */
    vlan: VLAN;
    /**
     * The autonomous system (AS) number for Border Gateway Protocol (BGP) configuration. The valid values are 1-2147483647.
     */
    asn: ASN;
    /**
     * The maximum transmission unit (MTU), in bytes. The supported values are 1500 and 9001. The default value is 1500.
     */
    mtu?: MTU;
    /**
     * The authentication key for BGP configuration. This string has a minimum length of 6 characters and and a maximun lenth of 80 characters.
     */
    authKey?: BGPAuthKey;
    /**
     * The IP address assigned to the Amazon interface.
     */
    amazonAddress?: AmazonAddress;
    /**
     * The IP address assigned to the customer interface.
     */
    customerAddress?: CustomerAddress;
    /**
     * The address family for the BGP peer.
     */
    addressFamily?: AddressFamily;
    /**
     * The ID of the virtual private gateway.
     */
    virtualGatewayId?: VirtualGatewayId;
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The tags associated with the private virtual interface.
     */
    tags?: TagList;
  }
  export interface NewPrivateVirtualInterfaceAllocation {
    /**
     * The name of the virtual interface assigned by the customer network. The name has a maximum of 100 characters. The following are valid characters: a-z, 0-9 and a hyphen (-).
     */
    virtualInterfaceName: VirtualInterfaceName;
    /**
     * The ID of the VLAN.
     */
    vlan: VLAN;
    /**
     * The autonomous system (AS) number for Border Gateway Protocol (BGP) configuration. The valid values are 1-2147483647.
     */
    asn: ASN;
    /**
     * The maximum transmission unit (MTU), in bytes. The supported values are 1500 and 9001. The default value is 1500.
     */
    mtu?: MTU;
    /**
     * The authentication key for BGP configuration. This string has a minimum length of 6 characters and and a maximun lenth of 80 characters.
     */
    authKey?: BGPAuthKey;
    /**
     * The IP address assigned to the Amazon interface.
     */
    amazonAddress?: AmazonAddress;
    /**
     * The address family for the BGP peer.
     */
    addressFamily?: AddressFamily;
    /**
     * The IP address assigned to the customer interface.
     */
    customerAddress?: CustomerAddress;
    /**
     * The tags associated with the private virtual interface.
     */
    tags?: TagList;
  }
  export interface NewPublicVirtualInterface {
    /**
     * The name of the virtual interface assigned by the customer network. The name has a maximum of 100 characters. The following are valid characters: a-z, 0-9 and a hyphen (-).
     */
    virtualInterfaceName: VirtualInterfaceName;
    /**
     * The ID of the VLAN.
     */
    vlan: VLAN;
    /**
     * The autonomous system (AS) number for Border Gateway Protocol (BGP) configuration. The valid values are 1-2147483647.
     */
    asn: ASN;
    /**
     * The authentication key for BGP configuration. This string has a minimum length of 6 characters and and a maximun lenth of 80 characters.
     */
    authKey?: BGPAuthKey;
    /**
     * The IP address assigned to the Amazon interface.
     */
    amazonAddress?: AmazonAddress;
    /**
     * The IP address assigned to the customer interface.
     */
    customerAddress?: CustomerAddress;
    /**
     * The address family for the BGP peer.
     */
    addressFamily?: AddressFamily;
    /**
     * The routes to be advertised to the Amazon Web Services network in this Region. Applies to public virtual interfaces.
     */
    routeFilterPrefixes?: RouteFilterPrefixList;
    /**
     * The tags associated with the public virtual interface.
     */
    tags?: TagList;
  }
  export interface NewPublicVirtualInterfaceAllocation {
    /**
     * The name of the virtual interface assigned by the customer network. The name has a maximum of 100 characters. The following are valid characters: a-z, 0-9 and a hyphen (-).
     */
    virtualInterfaceName: VirtualInterfaceName;
    /**
     * The ID of the VLAN.
     */
    vlan: VLAN;
    /**
     * The autonomous system (AS) number for Border Gateway Protocol (BGP) configuration. The valid values are 1-2147483647.
     */
    asn: ASN;
    /**
     * The authentication key for BGP configuration. This string has a minimum length of 6 characters and and a maximun lenth of 80 characters.
     */
    authKey?: BGPAuthKey;
    /**
     * The IP address assigned to the Amazon interface.
     */
    amazonAddress?: AmazonAddress;
    /**
     * The IP address assigned to the customer interface.
     */
    customerAddress?: CustomerAddress;
    /**
     * The address family for the BGP peer.
     */
    addressFamily?: AddressFamily;
    /**
     * The routes to be advertised to the Amazon Web Services network in this Region. Applies to public virtual interfaces.
     */
    routeFilterPrefixes?: RouteFilterPrefixList;
    /**
     * The tags associated with the public virtual interface.
     */
    tags?: TagList;
  }
  export interface NewTransitVirtualInterface {
    /**
     * The name of the virtual interface assigned by the customer network. The name has a maximum of 100 characters. The following are valid characters: a-z, 0-9 and a hyphen (-).
     */
    virtualInterfaceName?: VirtualInterfaceName;
    /**
     * The ID of the VLAN.
     */
    vlan?: VLAN;
    /**
     * The autonomous system (AS) number for Border Gateway Protocol (BGP) configuration. The valid values are 1-2147483647.
     */
    asn?: ASN;
    /**
     * The maximum transmission unit (MTU), in bytes. The supported values are 1500 and 9001. The default value is 1500.
     */
    mtu?: MTU;
    /**
     * The authentication key for BGP configuration. This string has a minimum length of 6 characters and and a maximun lenth of 80 characters.
     */
    authKey?: BGPAuthKey;
    /**
     * The IP address assigned to the Amazon interface.
     */
    amazonAddress?: AmazonAddress;
    /**
     * The IP address assigned to the customer interface.
     */
    customerAddress?: CustomerAddress;
    /**
     * The address family for the BGP peer.
     */
    addressFamily?: AddressFamily;
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The tags associated with the transitive virtual interface.
     */
    tags?: TagList;
  }
  export interface NewTransitVirtualInterfaceAllocation {
    /**
     * The name of the virtual interface assigned by the customer network. The name has a maximum of 100 characters. The following are valid characters: a-z, 0-9 and a hyphen (-).
     */
    virtualInterfaceName?: VirtualInterfaceName;
    /**
     * The ID of the VLAN.
     */
    vlan?: VLAN;
    /**
     * The autonomous system (AS) number for Border Gateway Protocol (BGP) configuration. The valid values are 1-2147483647.
     */
    asn?: ASN;
    /**
     * The maximum transmission unit (MTU), in bytes. The supported values are 1500 and 9001. The default value is 1500. 
     */
    mtu?: MTU;
    /**
     * The authentication key for BGP configuration. This string has a minimum length of 6 characters and and a maximun lenth of 80 characters.
     */
    authKey?: BGPAuthKey;
    /**
     * The IP address assigned to the Amazon interface.
     */
    amazonAddress?: AmazonAddress;
    /**
     * The IP address assigned to the customer interface.
     */
    customerAddress?: CustomerAddress;
    /**
     * The address family for the BGP peer.
     */
    addressFamily?: AddressFamily;
    /**
     * The tags associated with the transitive virtual interface.
     */
    tags?: TagList;
  }
  export type NniPartnerType = "v1"|"v2"|"nonPartner"|string;
  export type OwnerAccount = string;
  export type PaginationToken = string;
  export type PartnerName = string;
  export type Platform = string;
  export type PortEncryptionStatus = string;
  export type PortSpeed = string;
  export type ProviderList = ProviderName[];
  export type ProviderName = string;
  export type Region = string;
  export type RequestMACSec = boolean;
  export type ResourceArn = string;
  export type ResourceArnList = ResourceArn[];
  export interface ResourceTag {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn?: ResourceArn;
    /**
     * The tags.
     */
    tags?: TagList;
  }
  export type ResourceTagList = ResourceTag[];
  export interface RouteFilterPrefix {
    /**
     * The CIDR block for the advertised route. Separate multiple routes using commas. An IPv6 CIDR must use /64 or shorter.
     */
    cidr?: CIDR;
  }
  export type RouteFilterPrefixList = RouteFilterPrefix[];
  export type RouterConfig = string;
  export interface RouterType {
    /**
     * The vendor for the virtual interface's router.
     */
    vendor?: Vendor;
    /**
     * The virtual interface router platform.
     */
    platform?: Platform;
    /**
     * The router software. 
     */
    software?: Software;
    /**
     * The template for the virtual interface's router.
     */
    xsltTemplateName?: XsltTemplateName;
    /**
     * The MAC Security (MACsec) template for the virtual interface's router.
     */
    xsltTemplateNameForMacSec?: XsltTemplateNameForMacSec;
    /**
     * Identifies the router by a combination of vendor, platform, and software version. For example, CiscoSystemsInc-2900SeriesRouters-IOS124.
     */
    routerTypeIdentifier?: RouterTypeIdentifier;
  }
  export type RouterTypeIdentifier = string;
  export type SecretARN = string;
  export type Software = string;
  export interface StartBgpFailoverTestRequest {
    /**
     * The ID of the virtual interface you want to test.
     */
    virtualInterfaceId: VirtualInterfaceId;
    /**
     * The BGP peers to place in the DOWN state.
     */
    bgpPeers?: BGPPeerIdList;
    /**
     * The time in minutes that the virtual interface failover test will last. Maximum value: 180 minutes (3 hours). Default: 180 minutes (3 hours).
     */
    testDurationInMinutes?: TestDuration;
  }
  export interface StartBgpFailoverTestResponse {
    /**
     * Information about the virtual interface failover test.
     */
    virtualInterfaceTest?: VirtualInterfaceTestHistory;
  }
  export type StartOnDate = string;
  export type StartTime = Date;
  export type State = string;
  export type StateChangeError = string;
  export type Status = string;
  export interface StopBgpFailoverTestRequest {
    /**
     * The ID of the virtual interface you no longer want to test.
     */
    virtualInterfaceId: VirtualInterfaceId;
  }
  export interface StopBgpFailoverTestResponse {
    /**
     * Information about the virtual interface failover test.
     */
    virtualInterfaceTest?: VirtualInterfaceTestHistory;
  }
  export interface Tag {
    /**
     * The key.
     */
    key: TagKey;
    /**
     * The value.
     */
    value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: ResourceArn;
    /**
     * The tags to add.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TestDuration = number;
  export type TestId = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: ResourceArn;
    /**
     * The tag keys of the tags to remove.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateConnectionRequest {
    /**
     * The ID of the dedicated connection. You can use DescribeConnections to retrieve the connection ID.
     */
    connectionId: ConnectionId;
    /**
     * The name of the connection.
     */
    connectionName?: ConnectionName;
    /**
     * The connection MAC Security (MACsec) encryption mode. The valid values are no_encrypt, should_encrypt, and must_encrypt.
     */
    encryptionMode?: EncryptionMode;
  }
  export interface UpdateDirectConnectGatewayAssociationRequest {
    /**
     * The ID of the Direct Connect gateway association.
     */
    associationId?: DirectConnectGatewayAssociationId;
    /**
     * The Amazon VPC prefixes to advertise to the Direct Connect gateway.
     */
    addAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
    /**
     * The Amazon VPC prefixes to no longer advertise to the Direct Connect gateway.
     */
    removeAllowedPrefixesToDirectConnectGateway?: RouteFilterPrefixList;
  }
  export interface UpdateDirectConnectGatewayAssociationResult {
    directConnectGatewayAssociation?: DirectConnectGatewayAssociation;
  }
  export interface UpdateDirectConnectGatewayRequest {
    /**
     * The ID of the Direct Connect gateway to update.
     */
    directConnectGatewayId: DirectConnectGatewayId;
    /**
     * The new name for the Direct Connect gateway.
     */
    newDirectConnectGatewayName: DirectConnectGatewayName;
  }
  export interface UpdateDirectConnectGatewayResponse {
    directConnectGateway?: DirectConnectGateway;
  }
  export interface UpdateLagRequest {
    /**
     * The ID of the LAG.
     */
    lagId: LagId;
    /**
     * The name of the LAG.
     */
    lagName?: LagName;
    /**
     * The minimum number of physical connections that must be operational for the LAG itself to be operational.
     */
    minimumLinks?: Count;
    /**
     * The LAG MAC Security (MACsec) encryption mode. Amazon Web Services applies the value to all connections which are part of the LAG.
     */
    encryptionMode?: EncryptionMode;
  }
  export interface UpdateVirtualInterfaceAttributesRequest {
    /**
     * The ID of the virtual private interface.
     */
    virtualInterfaceId: VirtualInterfaceId;
    /**
     * The maximum transmission unit (MTU), in bytes. The supported values are 1500 and 9001. The default value is 1500.
     */
    mtu?: MTU;
  }
  export type VLAN = number;
  export type Vendor = string;
  export interface VirtualGateway {
    /**
     * The ID of the virtual private gateway.
     */
    virtualGatewayId?: VirtualGatewayId;
    /**
     * The state of the virtual private gateway. The following are the possible values:    pending: Initial state after creating the virtual private gateway.    available: Ready for use by a private virtual interface.    deleting: Initial state after deleting the virtual private gateway.    deleted: The virtual private gateway is deleted. The private virtual interface is unable to send traffic over this gateway.  
     */
    virtualGatewayState?: VirtualGatewayState;
  }
  export type VirtualGatewayId = string;
  export type VirtualGatewayList = VirtualGateway[];
  export type VirtualGatewayRegion = string;
  export type VirtualGatewayState = string;
  export interface VirtualGateways {
    /**
     * The virtual private gateways.
     */
    virtualGateways?: VirtualGatewayList;
  }
  export interface VirtualInterface {
    /**
     * The ID of the Amazon Web Services account that owns the virtual interface.
     */
    ownerAccount?: OwnerAccount;
    /**
     * The ID of the virtual interface.
     */
    virtualInterfaceId?: VirtualInterfaceId;
    /**
     * The location of the connection.
     */
    location?: LocationCode;
    /**
     * The ID of the connection.
     */
    connectionId?: ConnectionId;
    /**
     * The type of virtual interface. The possible values are private and public.
     */
    virtualInterfaceType?: VirtualInterfaceType;
    /**
     * The name of the virtual interface assigned by the customer network. The name has a maximum of 100 characters. The following are valid characters: a-z, 0-9 and a hyphen (-).
     */
    virtualInterfaceName?: VirtualInterfaceName;
    /**
     * The ID of the VLAN.
     */
    vlan?: VLAN;
    /**
     * The autonomous system (AS) number for Border Gateway Protocol (BGP) configuration. The valid values are 1-2147483647.
     */
    asn?: ASN;
    /**
     * The autonomous system number (ASN) for the Amazon side of the connection.
     */
    amazonSideAsn?: LongAsn;
    /**
     * The authentication key for BGP configuration. This string has a minimum length of 6 characters and and a maximun lenth of 80 characters.
     */
    authKey?: BGPAuthKey;
    /**
     * The IP address assigned to the Amazon interface.
     */
    amazonAddress?: AmazonAddress;
    /**
     * The IP address assigned to the customer interface.
     */
    customerAddress?: CustomerAddress;
    /**
     * The address family for the BGP peer.
     */
    addressFamily?: AddressFamily;
    /**
     * The state of the virtual interface. The following are the possible values:    confirming: The creation of the virtual interface is pending confirmation from the virtual interface owner. If the owner of the virtual interface is different from the owner of the connection on which it is provisioned, then the virtual interface will remain in this state until it is confirmed by the virtual interface owner.    verifying: This state only applies to public virtual interfaces. Each public virtual interface needs validation before the virtual interface can be created.    pending: A virtual interface is in this state from the time that it is created until the virtual interface is ready to forward traffic.    available: A virtual interface that is able to forward traffic.    down: A virtual interface that is BGP down.    deleting: A virtual interface is in this state immediately after calling DeleteVirtualInterface until it can no longer forward traffic.    deleted: A virtual interface that cannot forward traffic.    rejected: The virtual interface owner has declined creation of the virtual interface. If a virtual interface in the Confirming state is deleted by the virtual interface owner, the virtual interface enters the Rejected state.    unknown: The state of the virtual interface is not available.  
     */
    virtualInterfaceState?: VirtualInterfaceState;
    /**
     * The customer router configuration.
     */
    customerRouterConfig?: RouterConfig;
    /**
     * The maximum transmission unit (MTU), in bytes. The supported values are 1500 and 9001. The default value is 1500.
     */
    mtu?: MTU;
    /**
     * Indicates whether jumbo frames (9001 MTU) are supported.
     */
    jumboFrameCapable?: JumboFrameCapable;
    /**
     * The ID of the virtual private gateway. Applies only to private virtual interfaces.
     */
    virtualGatewayId?: VirtualGatewayId;
    /**
     * The ID of the Direct Connect gateway.
     */
    directConnectGatewayId?: DirectConnectGatewayId;
    /**
     * The routes to be advertised to the Amazon Web Services network in this Region. Applies to public virtual interfaces.
     */
    routeFilterPrefixes?: RouteFilterPrefixList;
    /**
     * The BGP peers configured on this virtual interface.
     */
    bgpPeers?: BGPPeerList;
    /**
     * The Amazon Web Services Region where the virtual interface is located.
     */
    region?: Region;
    /**
     * The Direct Connect endpoint that terminates the physical connection.
     */
    awsDeviceV2?: AwsDeviceV2;
    /**
     * The Direct Connect endpoint that terminates the logical connection. This device might be different than the device that terminates the physical connection.
     */
    awsLogicalDeviceId?: AwsLogicalDeviceId;
    /**
     * The tags associated with the virtual interface.
     */
    tags?: TagList;
  }
  export type VirtualInterfaceId = string;
  export type VirtualInterfaceList = VirtualInterface[];
  export type VirtualInterfaceName = string;
  export type VirtualInterfaceRegion = string;
  export type VirtualInterfaceState = "confirming"|"verifying"|"pending"|"available"|"down"|"deleting"|"deleted"|"rejected"|"unknown"|string;
  export interface VirtualInterfaceTestHistory {
    /**
     * The ID of the virtual interface failover test.
     */
    testId?: TestId;
    /**
     * The ID of the tested virtual interface.
     */
    virtualInterfaceId?: VirtualInterfaceId;
    /**
     * The BGP peers that were put in the DOWN state as part of the virtual interface failover test.
     */
    bgpPeers?: BGPPeerIdList;
    /**
     * The status of the virtual interface failover test.
     */
    status?: FailureTestHistoryStatus;
    /**
     * The owner ID of the tested virtual interface.
     */
    ownerAccount?: OwnerAccount;
    /**
     * The time that the virtual interface failover test ran in minutes.
     */
    testDurationInMinutes?: TestDuration;
    /**
     * The time that the virtual interface moves to the DOWN state.
     */
    startTime?: StartTime;
    /**
     * The time that the virtual interface moves out of the DOWN state.
     */
    endTime?: EndTime;
  }
  export type VirtualInterfaceTestHistoryList = VirtualInterfaceTestHistory[];
  export type VirtualInterfaceType = string;
  export interface VirtualInterfaces {
    /**
     * The virtual interfaces
     */
    virtualInterfaces?: VirtualInterfaceList;
  }
  export type XsltTemplateName = string;
  export type XsltTemplateNameForMacSec = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2012-10-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the DirectConnect client.
   */
  export import Types = DirectConnect;
}
export = DirectConnect;
