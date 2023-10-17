import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MediaConnect extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MediaConnect.Types.ClientConfiguration)
  config: Config & MediaConnect.Types.ClientConfiguration;
  /**
   * Adds outputs to an existing bridge.
   */
  addBridgeOutputs(params: MediaConnect.Types.AddBridgeOutputsRequest, callback?: (err: AWSError, data: MediaConnect.Types.AddBridgeOutputsResponse) => void): Request<MediaConnect.Types.AddBridgeOutputsResponse, AWSError>;
  /**
   * Adds outputs to an existing bridge.
   */
  addBridgeOutputs(callback?: (err: AWSError, data: MediaConnect.Types.AddBridgeOutputsResponse) => void): Request<MediaConnect.Types.AddBridgeOutputsResponse, AWSError>;
  /**
   * Adds sources to an existing bridge.
   */
  addBridgeSources(params: MediaConnect.Types.AddBridgeSourcesRequest, callback?: (err: AWSError, data: MediaConnect.Types.AddBridgeSourcesResponse) => void): Request<MediaConnect.Types.AddBridgeSourcesResponse, AWSError>;
  /**
   * Adds sources to an existing bridge.
   */
  addBridgeSources(callback?: (err: AWSError, data: MediaConnect.Types.AddBridgeSourcesResponse) => void): Request<MediaConnect.Types.AddBridgeSourcesResponse, AWSError>;
  /**
   * Adds media streams to an existing flow. After you add a media stream to a flow, you can associate it with a source and/or an output that uses the ST 2110 JPEG XS or CDI protocol.
   */
  addFlowMediaStreams(params: MediaConnect.Types.AddFlowMediaStreamsRequest, callback?: (err: AWSError, data: MediaConnect.Types.AddFlowMediaStreamsResponse) => void): Request<MediaConnect.Types.AddFlowMediaStreamsResponse, AWSError>;
  /**
   * Adds media streams to an existing flow. After you add a media stream to a flow, you can associate it with a source and/or an output that uses the ST 2110 JPEG XS or CDI protocol.
   */
  addFlowMediaStreams(callback?: (err: AWSError, data: MediaConnect.Types.AddFlowMediaStreamsResponse) => void): Request<MediaConnect.Types.AddFlowMediaStreamsResponse, AWSError>;
  /**
   * Adds outputs to an existing flow. You can create up to 50 outputs per flow.
   */
  addFlowOutputs(params: MediaConnect.Types.AddFlowOutputsRequest, callback?: (err: AWSError, data: MediaConnect.Types.AddFlowOutputsResponse) => void): Request<MediaConnect.Types.AddFlowOutputsResponse, AWSError>;
  /**
   * Adds outputs to an existing flow. You can create up to 50 outputs per flow.
   */
  addFlowOutputs(callback?: (err: AWSError, data: MediaConnect.Types.AddFlowOutputsResponse) => void): Request<MediaConnect.Types.AddFlowOutputsResponse, AWSError>;
  /**
   * Adds Sources to flow
   */
  addFlowSources(params: MediaConnect.Types.AddFlowSourcesRequest, callback?: (err: AWSError, data: MediaConnect.Types.AddFlowSourcesResponse) => void): Request<MediaConnect.Types.AddFlowSourcesResponse, AWSError>;
  /**
   * Adds Sources to flow
   */
  addFlowSources(callback?: (err: AWSError, data: MediaConnect.Types.AddFlowSourcesResponse) => void): Request<MediaConnect.Types.AddFlowSourcesResponse, AWSError>;
  /**
   * Adds VPC interfaces to flow
   */
  addFlowVpcInterfaces(params: MediaConnect.Types.AddFlowVpcInterfacesRequest, callback?: (err: AWSError, data: MediaConnect.Types.AddFlowVpcInterfacesResponse) => void): Request<MediaConnect.Types.AddFlowVpcInterfacesResponse, AWSError>;
  /**
   * Adds VPC interfaces to flow
   */
  addFlowVpcInterfaces(callback?: (err: AWSError, data: MediaConnect.Types.AddFlowVpcInterfacesResponse) => void): Request<MediaConnect.Types.AddFlowVpcInterfacesResponse, AWSError>;
  /**
   * Creates a new bridge. The request must include one source.
   */
  createBridge(params: MediaConnect.Types.CreateBridgeRequest, callback?: (err: AWSError, data: MediaConnect.Types.CreateBridgeResponse) => void): Request<MediaConnect.Types.CreateBridgeResponse, AWSError>;
  /**
   * Creates a new bridge. The request must include one source.
   */
  createBridge(callback?: (err: AWSError, data: MediaConnect.Types.CreateBridgeResponse) => void): Request<MediaConnect.Types.CreateBridgeResponse, AWSError>;
  /**
   * Creates a new flow. The request must include one source. The request optionally can include outputs (up to 50) and entitlements (up to 50).
   */
  createFlow(params: MediaConnect.Types.CreateFlowRequest, callback?: (err: AWSError, data: MediaConnect.Types.CreateFlowResponse) => void): Request<MediaConnect.Types.CreateFlowResponse, AWSError>;
  /**
   * Creates a new flow. The request must include one source. The request optionally can include outputs (up to 50) and entitlements (up to 50).
   */
  createFlow(callback?: (err: AWSError, data: MediaConnect.Types.CreateFlowResponse) => void): Request<MediaConnect.Types.CreateFlowResponse, AWSError>;
  /**
   * Creates a new gateway. The request must include at least one network (up to 4).
   */
  createGateway(params: MediaConnect.Types.CreateGatewayRequest, callback?: (err: AWSError, data: MediaConnect.Types.CreateGatewayResponse) => void): Request<MediaConnect.Types.CreateGatewayResponse, AWSError>;
  /**
   * Creates a new gateway. The request must include at least one network (up to 4).
   */
  createGateway(callback?: (err: AWSError, data: MediaConnect.Types.CreateGatewayResponse) => void): Request<MediaConnect.Types.CreateGatewayResponse, AWSError>;
  /**
   * Deletes a bridge. Before you can delete a bridge, you must stop the bridge.
   */
  deleteBridge(params: MediaConnect.Types.DeleteBridgeRequest, callback?: (err: AWSError, data: MediaConnect.Types.DeleteBridgeResponse) => void): Request<MediaConnect.Types.DeleteBridgeResponse, AWSError>;
  /**
   * Deletes a bridge. Before you can delete a bridge, you must stop the bridge.
   */
  deleteBridge(callback?: (err: AWSError, data: MediaConnect.Types.DeleteBridgeResponse) => void): Request<MediaConnect.Types.DeleteBridgeResponse, AWSError>;
  /**
   * Deletes a flow. Before you can delete a flow, you must stop the flow.
   */
  deleteFlow(params: MediaConnect.Types.DeleteFlowRequest, callback?: (err: AWSError, data: MediaConnect.Types.DeleteFlowResponse) => void): Request<MediaConnect.Types.DeleteFlowResponse, AWSError>;
  /**
   * Deletes a flow. Before you can delete a flow, you must stop the flow.
   */
  deleteFlow(callback?: (err: AWSError, data: MediaConnect.Types.DeleteFlowResponse) => void): Request<MediaConnect.Types.DeleteFlowResponse, AWSError>;
  /**
   * Deletes a gateway. Before you can delete a gateway, you must deregister its instances and delete its bridges.
   */
  deleteGateway(params: MediaConnect.Types.DeleteGatewayRequest, callback?: (err: AWSError, data: MediaConnect.Types.DeleteGatewayResponse) => void): Request<MediaConnect.Types.DeleteGatewayResponse, AWSError>;
  /**
   * Deletes a gateway. Before you can delete a gateway, you must deregister its instances and delete its bridges.
   */
  deleteGateway(callback?: (err: AWSError, data: MediaConnect.Types.DeleteGatewayResponse) => void): Request<MediaConnect.Types.DeleteGatewayResponse, AWSError>;
  /**
   * Deregisters an instance. Before you deregister an instance, all bridges running on the instance must be stopped. If you want to deregister an instance without stopping the bridges, you must use the --force option.
   */
  deregisterGatewayInstance(params: MediaConnect.Types.DeregisterGatewayInstanceRequest, callback?: (err: AWSError, data: MediaConnect.Types.DeregisterGatewayInstanceResponse) => void): Request<MediaConnect.Types.DeregisterGatewayInstanceResponse, AWSError>;
  /**
   * Deregisters an instance. Before you deregister an instance, all bridges running on the instance must be stopped. If you want to deregister an instance without stopping the bridges, you must use the --force option.
   */
  deregisterGatewayInstance(callback?: (err: AWSError, data: MediaConnect.Types.DeregisterGatewayInstanceResponse) => void): Request<MediaConnect.Types.DeregisterGatewayInstanceResponse, AWSError>;
  /**
   * Displays the details of a bridge.
   */
  describeBridge(params: MediaConnect.Types.DescribeBridgeRequest, callback?: (err: AWSError, data: MediaConnect.Types.DescribeBridgeResponse) => void): Request<MediaConnect.Types.DescribeBridgeResponse, AWSError>;
  /**
   * Displays the details of a bridge.
   */
  describeBridge(callback?: (err: AWSError, data: MediaConnect.Types.DescribeBridgeResponse) => void): Request<MediaConnect.Types.DescribeBridgeResponse, AWSError>;
  /**
   * Displays the details of a flow. The response includes the flow ARN, name, and Availability Zone, as well as details about the source, outputs, and entitlements.
   */
  describeFlow(params: MediaConnect.Types.DescribeFlowRequest, callback?: (err: AWSError, data: MediaConnect.Types.DescribeFlowResponse) => void): Request<MediaConnect.Types.DescribeFlowResponse, AWSError>;
  /**
   * Displays the details of a flow. The response includes the flow ARN, name, and Availability Zone, as well as details about the source, outputs, and entitlements.
   */
  describeFlow(callback?: (err: AWSError, data: MediaConnect.Types.DescribeFlowResponse) => void): Request<MediaConnect.Types.DescribeFlowResponse, AWSError>;
  /**
   * Displays the details of a gateway. The response includes the gateway ARN, name, and CIDR blocks, as well as details about the networks.
   */
  describeGateway(params: MediaConnect.Types.DescribeGatewayRequest, callback?: (err: AWSError, data: MediaConnect.Types.DescribeGatewayResponse) => void): Request<MediaConnect.Types.DescribeGatewayResponse, AWSError>;
  /**
   * Displays the details of a gateway. The response includes the gateway ARN, name, and CIDR blocks, as well as details about the networks.
   */
  describeGateway(callback?: (err: AWSError, data: MediaConnect.Types.DescribeGatewayResponse) => void): Request<MediaConnect.Types.DescribeGatewayResponse, AWSError>;
  /**
   * Displays the details of an instance.
   */
  describeGatewayInstance(params: MediaConnect.Types.DescribeGatewayInstanceRequest, callback?: (err: AWSError, data: MediaConnect.Types.DescribeGatewayInstanceResponse) => void): Request<MediaConnect.Types.DescribeGatewayInstanceResponse, AWSError>;
  /**
   * Displays the details of an instance.
   */
  describeGatewayInstance(callback?: (err: AWSError, data: MediaConnect.Types.DescribeGatewayInstanceResponse) => void): Request<MediaConnect.Types.DescribeGatewayInstanceResponse, AWSError>;
  /**
   * Displays the details of an offering. The response includes the offering description, duration, outbound bandwidth, price, and Amazon Resource Name (ARN).
   */
  describeOffering(params: MediaConnect.Types.DescribeOfferingRequest, callback?: (err: AWSError, data: MediaConnect.Types.DescribeOfferingResponse) => void): Request<MediaConnect.Types.DescribeOfferingResponse, AWSError>;
  /**
   * Displays the details of an offering. The response includes the offering description, duration, outbound bandwidth, price, and Amazon Resource Name (ARN).
   */
  describeOffering(callback?: (err: AWSError, data: MediaConnect.Types.DescribeOfferingResponse) => void): Request<MediaConnect.Types.DescribeOfferingResponse, AWSError>;
  /**
   * Displays the details of a reservation. The response includes the reservation name, state, start date and time, and the details of the offering that make up the rest of the reservation (such as price, duration, and outbound bandwidth).
   */
  describeReservation(params: MediaConnect.Types.DescribeReservationRequest, callback?: (err: AWSError, data: MediaConnect.Types.DescribeReservationResponse) => void): Request<MediaConnect.Types.DescribeReservationResponse, AWSError>;
  /**
   * Displays the details of a reservation. The response includes the reservation name, state, start date and time, and the details of the offering that make up the rest of the reservation (such as price, duration, and outbound bandwidth).
   */
  describeReservation(callback?: (err: AWSError, data: MediaConnect.Types.DescribeReservationResponse) => void): Request<MediaConnect.Types.DescribeReservationResponse, AWSError>;
  /**
   * Grants entitlements to an existing flow.
   */
  grantFlowEntitlements(params: MediaConnect.Types.GrantFlowEntitlementsRequest, callback?: (err: AWSError, data: MediaConnect.Types.GrantFlowEntitlementsResponse) => void): Request<MediaConnect.Types.GrantFlowEntitlementsResponse, AWSError>;
  /**
   * Grants entitlements to an existing flow.
   */
  grantFlowEntitlements(callback?: (err: AWSError, data: MediaConnect.Types.GrantFlowEntitlementsResponse) => void): Request<MediaConnect.Types.GrantFlowEntitlementsResponse, AWSError>;
  /**
   * Displays a list of bridges that are associated with this account and an optionally specified Arn. This request returns a paginated result.
   */
  listBridges(params: MediaConnect.Types.ListBridgesRequest, callback?: (err: AWSError, data: MediaConnect.Types.ListBridgesResponse) => void): Request<MediaConnect.Types.ListBridgesResponse, AWSError>;
  /**
   * Displays a list of bridges that are associated with this account and an optionally specified Arn. This request returns a paginated result.
   */
  listBridges(callback?: (err: AWSError, data: MediaConnect.Types.ListBridgesResponse) => void): Request<MediaConnect.Types.ListBridgesResponse, AWSError>;
  /**
   * Displays a list of all entitlements that have been granted to this account. This request returns 20 results per page.
   */
  listEntitlements(params: MediaConnect.Types.ListEntitlementsRequest, callback?: (err: AWSError, data: MediaConnect.Types.ListEntitlementsResponse) => void): Request<MediaConnect.Types.ListEntitlementsResponse, AWSError>;
  /**
   * Displays a list of all entitlements that have been granted to this account. This request returns 20 results per page.
   */
  listEntitlements(callback?: (err: AWSError, data: MediaConnect.Types.ListEntitlementsResponse) => void): Request<MediaConnect.Types.ListEntitlementsResponse, AWSError>;
  /**
   * Displays a list of flows that are associated with this account. This request returns a paginated result.
   */
  listFlows(params: MediaConnect.Types.ListFlowsRequest, callback?: (err: AWSError, data: MediaConnect.Types.ListFlowsResponse) => void): Request<MediaConnect.Types.ListFlowsResponse, AWSError>;
  /**
   * Displays a list of flows that are associated with this account. This request returns a paginated result.
   */
  listFlows(callback?: (err: AWSError, data: MediaConnect.Types.ListFlowsResponse) => void): Request<MediaConnect.Types.ListFlowsResponse, AWSError>;
  /**
   * Displays a list of instances associated with the AWS account. This request returns a paginated result. You can use the filterArn property to display only the instances associated with the selected Gateway Amazon Resource Name (ARN).
   */
  listGatewayInstances(params: MediaConnect.Types.ListGatewayInstancesRequest, callback?: (err: AWSError, data: MediaConnect.Types.ListGatewayInstancesResponse) => void): Request<MediaConnect.Types.ListGatewayInstancesResponse, AWSError>;
  /**
   * Displays a list of instances associated with the AWS account. This request returns a paginated result. You can use the filterArn property to display only the instances associated with the selected Gateway Amazon Resource Name (ARN).
   */
  listGatewayInstances(callback?: (err: AWSError, data: MediaConnect.Types.ListGatewayInstancesResponse) => void): Request<MediaConnect.Types.ListGatewayInstancesResponse, AWSError>;
  /**
   * Displays a list of gateways that are associated with this account. This request returns a paginated result.
   */
  listGateways(params: MediaConnect.Types.ListGatewaysRequest, callback?: (err: AWSError, data: MediaConnect.Types.ListGatewaysResponse) => void): Request<MediaConnect.Types.ListGatewaysResponse, AWSError>;
  /**
   * Displays a list of gateways that are associated with this account. This request returns a paginated result.
   */
  listGateways(callback?: (err: AWSError, data: MediaConnect.Types.ListGatewaysResponse) => void): Request<MediaConnect.Types.ListGatewaysResponse, AWSError>;
  /**
   * Displays a list of all offerings that are available to this account in the current AWS Region. If you have an active reservation (which means you've purchased an offering that has already started and hasn't expired yet), your account isn't eligible for other offerings.
   */
  listOfferings(params: MediaConnect.Types.ListOfferingsRequest, callback?: (err: AWSError, data: MediaConnect.Types.ListOfferingsResponse) => void): Request<MediaConnect.Types.ListOfferingsResponse, AWSError>;
  /**
   * Displays a list of all offerings that are available to this account in the current AWS Region. If you have an active reservation (which means you've purchased an offering that has already started and hasn't expired yet), your account isn't eligible for other offerings.
   */
  listOfferings(callback?: (err: AWSError, data: MediaConnect.Types.ListOfferingsResponse) => void): Request<MediaConnect.Types.ListOfferingsResponse, AWSError>;
  /**
   * Displays a list of all reservations that have been purchased by this account in the current AWS Region. This list includes all reservations in all states (such as active and expired).
   */
  listReservations(params: MediaConnect.Types.ListReservationsRequest, callback?: (err: AWSError, data: MediaConnect.Types.ListReservationsResponse) => void): Request<MediaConnect.Types.ListReservationsResponse, AWSError>;
  /**
   * Displays a list of all reservations that have been purchased by this account in the current AWS Region. This list includes all reservations in all states (such as active and expired).
   */
  listReservations(callback?: (err: AWSError, data: MediaConnect.Types.ListReservationsResponse) => void): Request<MediaConnect.Types.ListReservationsResponse, AWSError>;
  /**
   * List all tags on an AWS Elemental MediaConnect resource
   */
  listTagsForResource(params: MediaConnect.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: MediaConnect.Types.ListTagsForResourceResponse) => void): Request<MediaConnect.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List all tags on an AWS Elemental MediaConnect resource
   */
  listTagsForResource(callback?: (err: AWSError, data: MediaConnect.Types.ListTagsForResourceResponse) => void): Request<MediaConnect.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Submits a request to purchase an offering. If you already have an active reservation, you can't purchase another offering.
   */
  purchaseOffering(params: MediaConnect.Types.PurchaseOfferingRequest, callback?: (err: AWSError, data: MediaConnect.Types.PurchaseOfferingResponse) => void): Request<MediaConnect.Types.PurchaseOfferingResponse, AWSError>;
  /**
   * Submits a request to purchase an offering. If you already have an active reservation, you can't purchase another offering.
   */
  purchaseOffering(callback?: (err: AWSError, data: MediaConnect.Types.PurchaseOfferingResponse) => void): Request<MediaConnect.Types.PurchaseOfferingResponse, AWSError>;
  /**
   * Removes an output from a bridge.
   */
  removeBridgeOutput(params: MediaConnect.Types.RemoveBridgeOutputRequest, callback?: (err: AWSError, data: MediaConnect.Types.RemoveBridgeOutputResponse) => void): Request<MediaConnect.Types.RemoveBridgeOutputResponse, AWSError>;
  /**
   * Removes an output from a bridge.
   */
  removeBridgeOutput(callback?: (err: AWSError, data: MediaConnect.Types.RemoveBridgeOutputResponse) => void): Request<MediaConnect.Types.RemoveBridgeOutputResponse, AWSError>;
  /**
   * Removes a source from a bridge.
   */
  removeBridgeSource(params: MediaConnect.Types.RemoveBridgeSourceRequest, callback?: (err: AWSError, data: MediaConnect.Types.RemoveBridgeSourceResponse) => void): Request<MediaConnect.Types.RemoveBridgeSourceResponse, AWSError>;
  /**
   * Removes a source from a bridge.
   */
  removeBridgeSource(callback?: (err: AWSError, data: MediaConnect.Types.RemoveBridgeSourceResponse) => void): Request<MediaConnect.Types.RemoveBridgeSourceResponse, AWSError>;
  /**
   * Removes a media stream from a flow. This action is only available if the media stream is not associated with a source or output.
   */
  removeFlowMediaStream(params: MediaConnect.Types.RemoveFlowMediaStreamRequest, callback?: (err: AWSError, data: MediaConnect.Types.RemoveFlowMediaStreamResponse) => void): Request<MediaConnect.Types.RemoveFlowMediaStreamResponse, AWSError>;
  /**
   * Removes a media stream from a flow. This action is only available if the media stream is not associated with a source or output.
   */
  removeFlowMediaStream(callback?: (err: AWSError, data: MediaConnect.Types.RemoveFlowMediaStreamResponse) => void): Request<MediaConnect.Types.RemoveFlowMediaStreamResponse, AWSError>;
  /**
   * Removes an output from an existing flow. This request can be made only on an output that does not have an entitlement associated with it. If the output has an entitlement, you must revoke the entitlement instead. When an entitlement is revoked from a flow, the service automatically removes the associated output.
   */
  removeFlowOutput(params: MediaConnect.Types.RemoveFlowOutputRequest, callback?: (err: AWSError, data: MediaConnect.Types.RemoveFlowOutputResponse) => void): Request<MediaConnect.Types.RemoveFlowOutputResponse, AWSError>;
  /**
   * Removes an output from an existing flow. This request can be made only on an output that does not have an entitlement associated with it. If the output has an entitlement, you must revoke the entitlement instead. When an entitlement is revoked from a flow, the service automatically removes the associated output.
   */
  removeFlowOutput(callback?: (err: AWSError, data: MediaConnect.Types.RemoveFlowOutputResponse) => void): Request<MediaConnect.Types.RemoveFlowOutputResponse, AWSError>;
  /**
   * Removes a source from an existing flow. This request can be made only if there is more than one source on the flow.
   */
  removeFlowSource(params: MediaConnect.Types.RemoveFlowSourceRequest, callback?: (err: AWSError, data: MediaConnect.Types.RemoveFlowSourceResponse) => void): Request<MediaConnect.Types.RemoveFlowSourceResponse, AWSError>;
  /**
   * Removes a source from an existing flow. This request can be made only if there is more than one source on the flow.
   */
  removeFlowSource(callback?: (err: AWSError, data: MediaConnect.Types.RemoveFlowSourceResponse) => void): Request<MediaConnect.Types.RemoveFlowSourceResponse, AWSError>;
  /**
   * Removes a VPC Interface from an existing flow. This request can be made only on a VPC interface that does not have a Source or Output associated with it. If the VPC interface is referenced by a Source or Output, you must first delete or update the Source or Output to no longer reference the VPC interface.
   */
  removeFlowVpcInterface(params: MediaConnect.Types.RemoveFlowVpcInterfaceRequest, callback?: (err: AWSError, data: MediaConnect.Types.RemoveFlowVpcInterfaceResponse) => void): Request<MediaConnect.Types.RemoveFlowVpcInterfaceResponse, AWSError>;
  /**
   * Removes a VPC Interface from an existing flow. This request can be made only on a VPC interface that does not have a Source or Output associated with it. If the VPC interface is referenced by a Source or Output, you must first delete or update the Source or Output to no longer reference the VPC interface.
   */
  removeFlowVpcInterface(callback?: (err: AWSError, data: MediaConnect.Types.RemoveFlowVpcInterfaceResponse) => void): Request<MediaConnect.Types.RemoveFlowVpcInterfaceResponse, AWSError>;
  /**
   * Revokes an entitlement from a flow. Once an entitlement is revoked, the content becomes unavailable to the subscriber and the associated output is removed.
   */
  revokeFlowEntitlement(params: MediaConnect.Types.RevokeFlowEntitlementRequest, callback?: (err: AWSError, data: MediaConnect.Types.RevokeFlowEntitlementResponse) => void): Request<MediaConnect.Types.RevokeFlowEntitlementResponse, AWSError>;
  /**
   * Revokes an entitlement from a flow. Once an entitlement is revoked, the content becomes unavailable to the subscriber and the associated output is removed.
   */
  revokeFlowEntitlement(callback?: (err: AWSError, data: MediaConnect.Types.RevokeFlowEntitlementResponse) => void): Request<MediaConnect.Types.RevokeFlowEntitlementResponse, AWSError>;
  /**
   * Starts a flow.
   */
  startFlow(params: MediaConnect.Types.StartFlowRequest, callback?: (err: AWSError, data: MediaConnect.Types.StartFlowResponse) => void): Request<MediaConnect.Types.StartFlowResponse, AWSError>;
  /**
   * Starts a flow.
   */
  startFlow(callback?: (err: AWSError, data: MediaConnect.Types.StartFlowResponse) => void): Request<MediaConnect.Types.StartFlowResponse, AWSError>;
  /**
   * Stops a flow.
   */
  stopFlow(params: MediaConnect.Types.StopFlowRequest, callback?: (err: AWSError, data: MediaConnect.Types.StopFlowResponse) => void): Request<MediaConnect.Types.StopFlowResponse, AWSError>;
  /**
   * Stops a flow.
   */
  stopFlow(callback?: (err: AWSError, data: MediaConnect.Types.StopFlowResponse) => void): Request<MediaConnect.Types.StopFlowResponse, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. When a resource is deleted, the tags associated with that resource are deleted as well.
   */
  tagResource(params: MediaConnect.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. When a resource is deleted, the tags associated with that resource are deleted as well.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes specified tags from a resource.
   */
  untagResource(params: MediaConnect.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes specified tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the bridge
   */
  updateBridge(params: MediaConnect.Types.UpdateBridgeRequest, callback?: (err: AWSError, data: MediaConnect.Types.UpdateBridgeResponse) => void): Request<MediaConnect.Types.UpdateBridgeResponse, AWSError>;
  /**
   * Updates the bridge
   */
  updateBridge(callback?: (err: AWSError, data: MediaConnect.Types.UpdateBridgeResponse) => void): Request<MediaConnect.Types.UpdateBridgeResponse, AWSError>;
  /**
   * Updates an existing bridge output.
   */
  updateBridgeOutput(params: MediaConnect.Types.UpdateBridgeOutputRequest, callback?: (err: AWSError, data: MediaConnect.Types.UpdateBridgeOutputResponse) => void): Request<MediaConnect.Types.UpdateBridgeOutputResponse, AWSError>;
  /**
   * Updates an existing bridge output.
   */
  updateBridgeOutput(callback?: (err: AWSError, data: MediaConnect.Types.UpdateBridgeOutputResponse) => void): Request<MediaConnect.Types.UpdateBridgeOutputResponse, AWSError>;
  /**
   * Updates an existing bridge source.
   */
  updateBridgeSource(params: MediaConnect.Types.UpdateBridgeSourceRequest, callback?: (err: AWSError, data: MediaConnect.Types.UpdateBridgeSourceResponse) => void): Request<MediaConnect.Types.UpdateBridgeSourceResponse, AWSError>;
  /**
   * Updates an existing bridge source.
   */
  updateBridgeSource(callback?: (err: AWSError, data: MediaConnect.Types.UpdateBridgeSourceResponse) => void): Request<MediaConnect.Types.UpdateBridgeSourceResponse, AWSError>;
  /**
   * Updates the bridge state
   */
  updateBridgeState(params: MediaConnect.Types.UpdateBridgeStateRequest, callback?: (err: AWSError, data: MediaConnect.Types.UpdateBridgeStateResponse) => void): Request<MediaConnect.Types.UpdateBridgeStateResponse, AWSError>;
  /**
   * Updates the bridge state
   */
  updateBridgeState(callback?: (err: AWSError, data: MediaConnect.Types.UpdateBridgeStateResponse) => void): Request<MediaConnect.Types.UpdateBridgeStateResponse, AWSError>;
  /**
   * Updates flow
   */
  updateFlow(params: MediaConnect.Types.UpdateFlowRequest, callback?: (err: AWSError, data: MediaConnect.Types.UpdateFlowResponse) => void): Request<MediaConnect.Types.UpdateFlowResponse, AWSError>;
  /**
   * Updates flow
   */
  updateFlow(callback?: (err: AWSError, data: MediaConnect.Types.UpdateFlowResponse) => void): Request<MediaConnect.Types.UpdateFlowResponse, AWSError>;
  /**
   * You can change an entitlement's description, subscribers, and encryption. If you change the subscribers, the service will remove the outputs that are are used by the subscribers that are removed.
   */
  updateFlowEntitlement(params: MediaConnect.Types.UpdateFlowEntitlementRequest, callback?: (err: AWSError, data: MediaConnect.Types.UpdateFlowEntitlementResponse) => void): Request<MediaConnect.Types.UpdateFlowEntitlementResponse, AWSError>;
  /**
   * You can change an entitlement's description, subscribers, and encryption. If you change the subscribers, the service will remove the outputs that are are used by the subscribers that are removed.
   */
  updateFlowEntitlement(callback?: (err: AWSError, data: MediaConnect.Types.UpdateFlowEntitlementResponse) => void): Request<MediaConnect.Types.UpdateFlowEntitlementResponse, AWSError>;
  /**
   * Updates an existing media stream.
   */
  updateFlowMediaStream(params: MediaConnect.Types.UpdateFlowMediaStreamRequest, callback?: (err: AWSError, data: MediaConnect.Types.UpdateFlowMediaStreamResponse) => void): Request<MediaConnect.Types.UpdateFlowMediaStreamResponse, AWSError>;
  /**
   * Updates an existing media stream.
   */
  updateFlowMediaStream(callback?: (err: AWSError, data: MediaConnect.Types.UpdateFlowMediaStreamResponse) => void): Request<MediaConnect.Types.UpdateFlowMediaStreamResponse, AWSError>;
  /**
   * Updates an existing flow output.
   */
  updateFlowOutput(params: MediaConnect.Types.UpdateFlowOutputRequest, callback?: (err: AWSError, data: MediaConnect.Types.UpdateFlowOutputResponse) => void): Request<MediaConnect.Types.UpdateFlowOutputResponse, AWSError>;
  /**
   * Updates an existing flow output.
   */
  updateFlowOutput(callback?: (err: AWSError, data: MediaConnect.Types.UpdateFlowOutputResponse) => void): Request<MediaConnect.Types.UpdateFlowOutputResponse, AWSError>;
  /**
   * Updates the source of a flow.
   */
  updateFlowSource(params: MediaConnect.Types.UpdateFlowSourceRequest, callback?: (err: AWSError, data: MediaConnect.Types.UpdateFlowSourceResponse) => void): Request<MediaConnect.Types.UpdateFlowSourceResponse, AWSError>;
  /**
   * Updates the source of a flow.
   */
  updateFlowSource(callback?: (err: AWSError, data: MediaConnect.Types.UpdateFlowSourceResponse) => void): Request<MediaConnect.Types.UpdateFlowSourceResponse, AWSError>;
  /**
   * Updates the configuration of an existing Gateway Instance.
   */
  updateGatewayInstance(params: MediaConnect.Types.UpdateGatewayInstanceRequest, callback?: (err: AWSError, data: MediaConnect.Types.UpdateGatewayInstanceResponse) => void): Request<MediaConnect.Types.UpdateGatewayInstanceResponse, AWSError>;
  /**
   * Updates the configuration of an existing Gateway Instance.
   */
  updateGatewayInstance(callback?: (err: AWSError, data: MediaConnect.Types.UpdateGatewayInstanceResponse) => void): Request<MediaConnect.Types.UpdateGatewayInstanceResponse, AWSError>;
  /**
   * Waits for the flowActive state by periodically calling the underlying MediaConnect.describeFlowoperation every 3 seconds (at most 40 times). Wait until a flow is active
   */
  waitFor(state: "flowActive", params: MediaConnect.Types.DescribeFlowRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaConnect.Types.DescribeFlowResponse) => void): Request<MediaConnect.Types.DescribeFlowResponse, AWSError>;
  /**
   * Waits for the flowActive state by periodically calling the underlying MediaConnect.describeFlowoperation every 3 seconds (at most 40 times). Wait until a flow is active
   */
  waitFor(state: "flowActive", callback?: (err: AWSError, data: MediaConnect.Types.DescribeFlowResponse) => void): Request<MediaConnect.Types.DescribeFlowResponse, AWSError>;
  /**
   * Waits for the flowStandby state by periodically calling the underlying MediaConnect.describeFlowoperation every 3 seconds (at most 40 times). Wait until a flow is in standby mode
   */
  waitFor(state: "flowStandby", params: MediaConnect.Types.DescribeFlowRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaConnect.Types.DescribeFlowResponse) => void): Request<MediaConnect.Types.DescribeFlowResponse, AWSError>;
  /**
   * Waits for the flowStandby state by periodically calling the underlying MediaConnect.describeFlowoperation every 3 seconds (at most 40 times). Wait until a flow is in standby mode
   */
  waitFor(state: "flowStandby", callback?: (err: AWSError, data: MediaConnect.Types.DescribeFlowResponse) => void): Request<MediaConnect.Types.DescribeFlowResponse, AWSError>;
  /**
   * Waits for the flowDeleted state by periodically calling the underlying MediaConnect.describeFlowoperation every 3 seconds (at most 40 times). Wait until a flow is deleted
   */
  waitFor(state: "flowDeleted", params: MediaConnect.Types.DescribeFlowRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: MediaConnect.Types.DescribeFlowResponse) => void): Request<MediaConnect.Types.DescribeFlowResponse, AWSError>;
  /**
   * Waits for the flowDeleted state by periodically calling the underlying MediaConnect.describeFlowoperation every 3 seconds (at most 40 times). Wait until a flow is deleted
   */
  waitFor(state: "flowDeleted", callback?: (err: AWSError, data: MediaConnect.Types.DescribeFlowResponse) => void): Request<MediaConnect.Types.DescribeFlowResponse, AWSError>;
}
declare namespace MediaConnect {
  export interface AddBridgeFlowSourceRequest {
    /**
     * The Amazon Resource Number (ARN) of the cloud flow to use as a source of this bridge.
     */
    FlowArn: __string;
    /**
     * The name of the VPC interface attachment to use for this source.
     */
    FlowVpcInterfaceAttachment?: VpcInterfaceAttachment;
    /**
     * The name of the flow source. This name is used to reference the source and must be unique among sources in this bridge.
     */
    Name: __string;
  }
  export interface AddBridgeNetworkOutputRequest {
    /**
     * The network output IP Address.
     */
    IpAddress: __string;
    /**
     * The network output name. This name is used to reference the output and must be unique among outputs in this bridge.
     */
    Name: __string;
    /**
     * The network output's gateway network name.
     */
    NetworkName: __string;
    /**
     * The network output port.
     */
    Port: __integer;
    /**
     * The network output protocol.
     */
    Protocol: Protocol;
    /**
     * The network output TTL.
     */
    Ttl: __integer;
  }
  export interface AddBridgeNetworkSourceRequest {
    /**
     * The network source multicast IP.
     */
    MulticastIp: __string;
    /**
     * The name of the network source. This name is used to reference the source and must be unique among sources in this bridge.
     */
    Name: __string;
    /**
     * The network source's gateway network name.
     */
    NetworkName: __string;
    /**
     * The network source port.
     */
    Port: __integer;
    /**
     * The network source protocol.
     */
    Protocol: Protocol;
  }
  export interface AddBridgeOutputRequest {
    NetworkOutput?: AddBridgeNetworkOutputRequest;
  }
  export interface AddBridgeOutputsRequest {
    /**
     * The ARN of the bridge that you want to update.
     */
    BridgeArn: __string;
    /**
     * The outputs that you want to add to this bridge.
     */
    Outputs: __listOfAddBridgeOutputRequest;
  }
  export interface AddBridgeOutputsResponse {
    /**
     * The Amazon Resource Number (ARN) of the bridge.
     */
    BridgeArn?: __string;
    /**
     * The outputs that you added to this bridge.
     */
    Outputs?: __listOfBridgeOutput;
  }
  export interface AddBridgeSourceRequest {
    FlowSource?: AddBridgeFlowSourceRequest;
    NetworkSource?: AddBridgeNetworkSourceRequest;
  }
  export interface AddBridgeSourcesRequest {
    /**
     * The ARN of the bridge that you want to update.
     */
    BridgeArn: __string;
    /**
     * The sources that you want to add to this bridge.
     */
    Sources: __listOfAddBridgeSourceRequest;
  }
  export interface AddBridgeSourcesResponse {
    /**
     * The Amazon Resource Number (ARN) of the bridge.
     */
    BridgeArn?: __string;
    /**
     * The sources that you added to this bridge.
     */
    Sources?: __listOfBridgeSource;
  }
  export interface AddEgressGatewayBridgeRequest {
    /**
     * The maximum expected bitrate (in bps).
     */
    MaxBitrate: __integer;
  }
  export interface AddFlowMediaStreamsRequest {
    /**
     * The Amazon Resource Name (ARN) of the flow.
     */
    FlowArn: __string;
    /**
     * The media streams that you want to add to the flow.
     */
    MediaStreams: __listOfAddMediaStreamRequest;
  }
  export interface AddFlowMediaStreamsResponse {
    /**
     * The ARN of the flow that you added media streams to.
     */
    FlowArn?: __string;
    /**
     * The media streams that you added to the flow.
     */
    MediaStreams?: __listOfMediaStream;
  }
  export interface AddFlowOutputsRequest {
    /**
     * The flow that you want to add outputs to.
     */
    FlowArn: __string;
    /**
     * A list of outputs that you want to add.
     */
    Outputs: __listOfAddOutputRequest;
  }
  export interface AddFlowOutputsResponse {
    /**
     * The ARN of the flow that these outputs were added to.
     */
    FlowArn?: __string;
    /**
     * The details of the newly added outputs.
     */
    Outputs?: __listOfOutput;
  }
  export interface AddFlowSourcesRequest {
    /**
     * The flow that you want to mutate.
     */
    FlowArn: __string;
    /**
     * A list of sources that you want to add.
     */
    Sources: __listOfSetSourceRequest;
  }
  export interface AddFlowSourcesResponse {
    /**
     * The ARN of the flow that these sources were added to.
     */
    FlowArn?: __string;
    /**
     * The details of the newly added sources.
     */
    Sources?: __listOfSource;
  }
  export interface AddFlowVpcInterfacesRequest {
    /**
     * The flow that you want to mutate.
     */
    FlowArn: __string;
    /**
     * A list of VPC interfaces that you want to add.
     */
    VpcInterfaces: __listOfVpcInterfaceRequest;
  }
  export interface AddFlowVpcInterfacesResponse {
    /**
     * The ARN of the flow that these VPC interfaces were added to.
     */
    FlowArn?: __string;
    /**
     * The details of the newly added VPC interfaces.
     */
    VpcInterfaces?: __listOfVpcInterface;
  }
  export interface AddIngressGatewayBridgeRequest {
    /**
     * The maximum expected bitrate (in bps).
     */
    MaxBitrate: __integer;
    /**
     * The maximum number of expected outputs.
     */
    MaxOutputs: __integer;
  }
  export interface AddMaintenance {
    /**
     * A day of a week when the maintenance will happen. Use Monday/Tuesday/Wednesday/Thursday/Friday/Saturday/Sunday.
     */
    MaintenanceDay: MaintenanceDay;
    /**
     * UTC time when the maintenance will happen. Use 24-hour HH:MM format. Minutes must be 00. Example: 13:00. The default value is 02:00.
     */
    MaintenanceStartHour: __string;
  }
  export interface AddMediaStreamRequest {
    /**
     * The attributes that you want to assign to the new media stream.
     */
    Attributes?: MediaStreamAttributesRequest;
    /**
     * The sample rate (in Hz) for the stream. If the media stream type is video or ancillary data, set this value to 90000. If the media stream type is audio, set this value to either 48000 or 96000.
     */
    ClockRate?: __integer;
    /**
     * A description that can help you quickly identify what your media stream is used for.
     */
    Description?: __string;
    /**
     * A unique identifier for the media stream.
     */
    MediaStreamId: __integer;
    /**
     * A name that helps you distinguish one media stream from another.
     */
    MediaStreamName: __string;
    /**
     * The type of media stream.
     */
    MediaStreamType: MediaStreamType;
    /**
     * The resolution of the video.
     */
    VideoFormat?: __string;
  }
  export interface AddOutputRequest {
    /**
     * The range of IP addresses that should be allowed to initiate output requests to this flow. These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     */
    CidrAllowList?: __listOf__string;
    /**
     * A description of the output. This description appears only on the AWS Elemental MediaConnect console and will not be seen by the end user.
     */
    Description?: __string;
    /**
     * The IP address from which video will be sent to output destinations.
     */
    Destination?: __string;
    /**
     * The type of key used for the encryption. If no keyType is provided, the service will use the default setting (static-key). Allowable encryption types: static-key.
     */
    Encryption?: Encryption;
    /**
     * The maximum latency in milliseconds. This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
     */
    MaxLatency?: __integer;
    /**
     * The media streams that are associated with the output, and the parameters for those associations.
     */
    MediaStreamOutputConfigurations?: __listOfMediaStreamOutputConfigurationRequest;
    /**
     * The minimum latency in milliseconds for SRT-based streams. In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
     */
    MinLatency?: __integer;
    /**
     * The name of the output. This value must be unique within the current flow.
     */
    Name?: __string;
    /**
     * The port to use when content is distributed to this output.
     */
    Port?: __integer;
    /**
     * The protocol to use for the output.
     */
    Protocol: Protocol;
    /**
     * The remote ID for the Zixi-pull output stream.
     */
    RemoteId?: __string;
    /**
     * The port that the flow uses to send outbound requests to initiate connection with the sender.
     */
    SenderControlPort?: __integer;
    /**
     * The smoothing latency in milliseconds for RIST, RTP, and RTP-FEC streams.
     */
    SmoothingLatency?: __integer;
    /**
     * The stream ID that you want to use for this transport. This parameter applies only to Zixi and SRT caller-based streams.
     */
    StreamId?: __string;
    /**
     * The name of the VPC interface attachment to use for this output.
     */
    VpcInterfaceAttachment?: VpcInterfaceAttachment;
  }
  export type Algorithm = "aes128"|"aes192"|"aes256"|string;
  export interface Bridge {
    /**
     * The Amazon Resource Number (ARN) of the bridge.
     */
    BridgeArn: __string;
    BridgeMessages?: __listOfMessageDetail;
    BridgeState: BridgeState;
    EgressGatewayBridge?: EgressGatewayBridge;
    IngressGatewayBridge?: IngressGatewayBridge;
    /**
     * The name of the bridge.
     */
    Name: __string;
    /**
     * The outputs on this bridge.
     */
    Outputs?: __listOfBridgeOutput;
    /**
     * The placement Amazon Resource Number (ARN) of the bridge.
     */
    PlacementArn: __string;
    SourceFailoverConfig?: FailoverConfig;
    /**
     * The sources on this bridge.
     */
    Sources?: __listOfBridgeSource;
  }
  export interface BridgeFlowOutput {
    /**
     * The Amazon Resource Number (ARN) of the cloud flow.
     */
    FlowArn: __string;
    /**
     * The Amazon Resource Number (ARN) of the flow source.
     */
    FlowSourceArn: __string;
    /**
     * The name of the bridge's output.
     */
    Name: __string;
  }
  export interface BridgeFlowSource {
    /**
     * The ARN of the cloud flow used as a source of this bridge.
     */
    FlowArn: __string;
    /**
     * The name of the VPC interface attachment to use for this source.
     */
    FlowVpcInterfaceAttachment?: VpcInterfaceAttachment;
    /**
     * The name of the flow source.
     */
    Name: __string;
    /**
     * The Amazon Resource Number (ARN) of the output.
     */
    OutputArn?: __string;
  }
  export interface BridgeNetworkOutput {
    /**
     * The network output IP Address.
     */
    IpAddress: __string;
    /**
     * The network output name.
     */
    Name: __string;
    /**
     * The network output's gateway network name.
     */
    NetworkName: __string;
    /**
     * The network output port.
     */
    Port: __integer;
    /**
     * The network output protocol.
     */
    Protocol: Protocol;
    /**
     * The network output TTL.
     */
    Ttl: __integer;
  }
  export interface BridgeNetworkSource {
    /**
     * The network source multicast IP.
     */
    MulticastIp: __string;
    /**
     * The name of the network source.
     */
    Name: __string;
    /**
     * The network source's gateway network name.
     */
    NetworkName: __string;
    /**
     * The network source port.
     */
    Port: __integer;
    /**
     * The network source protocol.
     */
    Protocol: Protocol;
  }
  export interface BridgeOutput {
    FlowOutput?: BridgeFlowOutput;
    NetworkOutput?: BridgeNetworkOutput;
  }
  export type BridgePlacement = "AVAILABLE"|"LOCKED"|string;
  export interface BridgeSource {
    FlowSource?: BridgeFlowSource;
    NetworkSource?: BridgeNetworkSource;
  }
  export type BridgeState = "CREATING"|"STANDBY"|"STARTING"|"DEPLOYING"|"ACTIVE"|"STOPPING"|"DELETING"|"DELETED"|"START_FAILED"|"START_PENDING"|"STOP_FAILED"|"UPDATING"|string;
  export type Colorimetry = "BT601"|"BT709"|"BT2020"|"BT2100"|"ST2065-1"|"ST2065-3"|"XYZ"|string;
  export type ConnectionStatus = "CONNECTED"|"DISCONNECTED"|string;
  export interface CreateBridgeRequest {
    /**
     * Create a bridge with the egress bridge type. An egress bridge is a cloud-to-ground bridge. The content comes from an existing MediaConnect flow and is delivered to your premises.
     */
    EgressGatewayBridge?: AddEgressGatewayBridgeRequest;
    /**
     * Create a bridge with the ingress bridge type. An ingress bridge is a ground-to-cloud bridge. The content originates at your premises and is delivered to the cloud.
     */
    IngressGatewayBridge?: AddIngressGatewayBridgeRequest;
    /**
     * The name of the bridge. This name can not be modified after the bridge is created.
     */
    Name: __string;
    /**
     * The outputs that you want to add to this bridge.
     */
    Outputs?: __listOfAddBridgeOutputRequest;
    /**
     * The bridge placement Amazon Resource Number (ARN).
     */
    PlacementArn: __string;
    /**
     * The settings for source failover.
     */
    SourceFailoverConfig?: FailoverConfig;
    /**
     * The sources that you want to add to this bridge.
     */
    Sources: __listOfAddBridgeSourceRequest;
  }
  export interface CreateBridgeResponse {
    Bridge?: Bridge;
  }
  export interface CreateFlowRequest {
    /**
     * The Availability Zone that you want to create the flow in. These options are limited to the Availability Zones within the current AWS Region.
     */
    AvailabilityZone?: __string;
    /**
     * The entitlements that you want to grant on a flow.
     */
    Entitlements?: __listOfGrantEntitlementRequest;
    /**
     * The media streams that you want to add to the flow. You can associate these media streams with sources and outputs on the flow.
     */
    MediaStreams?: __listOfAddMediaStreamRequest;
    /**
     * The name of the flow.
     */
    Name: __string;
    /**
     * The outputs that you want to add to this flow.
     */
    Outputs?: __listOfAddOutputRequest;
    Source?: SetSourceRequest;
    SourceFailoverConfig?: FailoverConfig;
    Sources?: __listOfSetSourceRequest;
    /**
     * The VPC interfaces you want on the flow.
     */
    VpcInterfaces?: __listOfVpcInterfaceRequest;
    Maintenance?: AddMaintenance;
  }
  export interface CreateFlowResponse {
    Flow?: Flow;
  }
  export interface CreateGatewayRequest {
    /**
     * The range of IP addresses that are allowed to contribute content or initiate output requests for flows communicating with this gateway. These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     */
    EgressCidrBlocks: __listOf__string;
    /**
     * The name of the gateway. This name can not be modified after the gateway is created.
     */
    Name: __string;
    /**
     * The list of networks that you want to add.
     */
    Networks: __listOfGatewayNetwork;
  }
  export interface CreateGatewayResponse {
    Gateway?: Gateway;
  }
  export interface DeleteBridgeRequest {
    /**
     * The ARN of the bridge that you want to delete.
     */
    BridgeArn: __string;
  }
  export interface DeleteBridgeResponse {
    /**
     * The Amazon Resource Number (ARN) of the deleted bridge.
     */
    BridgeArn?: __string;
  }
  export interface DeleteFlowRequest {
    /**
     * The ARN of the flow that you want to delete.
     */
    FlowArn: __string;
  }
  export interface DeleteFlowResponse {
    /**
     * The ARN of the flow that was deleted.
     */
    FlowArn?: __string;
    /**
     * The status of the flow when the DeleteFlow process begins.
     */
    Status?: Status;
  }
  export interface DeleteGatewayRequest {
    /**
     * The ARN of the gateway that you want to delete.
     */
    GatewayArn: __string;
  }
  export interface DeleteGatewayResponse {
    /**
     * The Amazon Resource Name (ARN) of the gateway that was deleted.
     */
    GatewayArn?: __string;
  }
  export interface DeregisterGatewayInstanceRequest {
    /**
     * Force the deregistration of an instance. Force will deregister an instance, even if there are bridges running on it.
     */
    Force?: __boolean;
    /**
     * The Amazon Resource Name (ARN) of the gateway that contains the instance that you want to deregister.
     */
    GatewayInstanceArn: __string;
  }
  export interface DeregisterGatewayInstanceResponse {
    /**
     * The Amazon Resource Name (ARN) of the instance.
     */
    GatewayInstanceArn?: __string;
    /**
     * The status of the instance.
     */
    InstanceState?: InstanceState;
  }
  export interface DescribeBridgeRequest {
    /**
     * The ARN of the bridge that you want to describe.
     */
    BridgeArn: __string;
  }
  export interface DescribeBridgeResponse {
    Bridge?: Bridge;
  }
  export interface DescribeFlowRequest {
    /**
     * The ARN of the flow that you want to describe.
     */
    FlowArn: __string;
  }
  export interface DescribeFlowResponse {
    Flow?: Flow;
    Messages?: Messages;
  }
  export interface DescribeGatewayInstanceRequest {
    /**
     * The Amazon Resource Name (ARN) of the gateway instance that you want to describe.
     */
    GatewayInstanceArn: __string;
  }
  export interface DescribeGatewayInstanceResponse {
    GatewayInstance?: GatewayInstance;
  }
  export interface DescribeGatewayRequest {
    /**
     * The Amazon Resource Name (ARN) of the gateway that you want to describe.
     */
    GatewayArn: __string;
  }
  export interface DescribeGatewayResponse {
    Gateway?: Gateway;
  }
  export interface DescribeOfferingRequest {
    /**
     * The Amazon Resource Name (ARN) of the offering.
     */
    OfferingArn: __string;
  }
  export interface DescribeOfferingResponse {
    Offering?: Offering;
  }
  export interface DescribeReservationRequest {
    /**
     * The Amazon Resource Name (ARN) of the reservation.
     */
    ReservationArn: __string;
  }
  export interface DescribeReservationResponse {
    Reservation?: Reservation;
  }
  export type DesiredState = "ACTIVE"|"STANDBY"|"DELETED"|string;
  export interface DestinationConfiguration {
    /**
     * The IP address where contents of the media stream will be sent.
     */
    DestinationIp: __string;
    /**
     * The port to use when the content of the media stream is distributed to the output.
     */
    DestinationPort: __integer;
    /**
     * The VPC interface that is used for the media stream associated with the output.
     */
    Interface: Interface;
    /**
     * The IP address that the receiver requires in order to establish a connection with the flow. This value is represented by the elastic network interface IP address of the VPC. This field applies only to outputs that use the CDI or ST 2110 JPEG XS protocol.
     */
    OutboundIp: __string;
  }
  export interface DestinationConfigurationRequest {
    /**
     * The IP address where you want MediaConnect to send contents of the media stream.
     */
    DestinationIp: __string;
    /**
     * The port that you want MediaConnect to use when it distributes the media stream to the output.
     */
    DestinationPort: __integer;
    /**
     * The VPC interface that you want to use for the media stream associated with the output.
     */
    Interface: InterfaceRequest;
  }
  export type DurationUnits = "MONTHS"|string;
  export interface EgressGatewayBridge {
    /**
     * The ID of the instance running this bridge.
     */
    InstanceId?: __string;
    /**
     * The maximum expected bitrate (in bps) of the egress bridge.
     */
    MaxBitrate: __integer;
  }
  export type EncoderProfile = "main"|"high"|string;
  export type EncodingName = "jxsv"|"raw"|"smpte291"|"pcm"|string;
  export interface EncodingParameters {
    /**
     * A value that is used to calculate compression for an output. The bitrate of the output is calculated as follows: Output bitrate = (1 / compressionFactor) * (source bitrate) This property only applies to outputs that use the ST 2110 JPEG XS protocol, with a flow source that uses the CDI protocol. Valid values are floating point numbers in the range of 3.0 to 10.0, inclusive.
     */
    CompressionFactor: __double;
    /**
     * A setting on the encoder that drives compression settings. This property only applies to video media streams associated with outputs that use the ST 2110 JPEG XS protocol, with a flow source that uses the CDI protocol.
     */
    EncoderProfile: EncoderProfile;
  }
  export interface EncodingParametersRequest {
    /**
     * A value that is used to calculate compression for an output. The bitrate of the output is calculated as follows: Output bitrate = (1 / compressionFactor) * (source bitrate) This property only applies to outputs that use the ST 2110 JPEG XS protocol, with a flow source that uses the CDI protocol. Valid values are floating point numbers in the range of 3.0 to 10.0, inclusive.
     */
    CompressionFactor: __double;
    /**
     * A setting on the encoder that drives compression settings. This property only applies to video media streams associated with outputs that use the ST 2110 JPEG XS protocol, if at least one source on the flow uses the CDI protocol.
     */
    EncoderProfile: EncoderProfile;
  }
  export interface Encryption {
    /**
     * The type of algorithm that is used for the encryption (such as aes128, aes192, or aes256).
     */
    Algorithm?: Algorithm;
    /**
     * A 128-bit, 16-byte hex value represented by a 32-character string, to be used with the key for encrypting content. This parameter is not valid for static key encryption.
     */
    ConstantInitializationVector?: __string;
    /**
     * The value of one of the devices that you configured with your digital rights management (DRM) platform key provider. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     */
    DeviceId?: __string;
    /**
     * The type of key that is used for the encryption. If no keyType is provided, the service will use the default setting (static-key).
     */
    KeyType?: KeyType;
    /**
     * The AWS Region that the API Gateway proxy endpoint was created in. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     */
    Region?: __string;
    /**
     * An identifier for the content. The service sends this value to the key server to identify the current endpoint. The resource ID is also known as the content ID. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     */
    ResourceId?: __string;
    /**
     * The ARN of the role that you created during setup (when you set up AWS Elemental MediaConnect as a trusted entity).
     */
    RoleArn: __string;
    /**
     * The ARN of the secret that you created in AWS Secrets Manager to store the encryption key. This parameter is required for static key encryption and is not valid for SPEKE encryption.
     */
    SecretArn?: __string;
    /**
     * The URL from the API Gateway proxy that you set up to talk to your key server. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     */
    Url?: __string;
  }
  export interface Entitlement {
    /**
     * Percentage from 0-100 of the data transfer cost to be billed to the subscriber.
     */
    DataTransferSubscriberFeePercent?: __integer;
    /**
     * A description of the entitlement.
     */
    Description?: __string;
    /**
     * The type of encryption that will be used on the output that is associated with this entitlement.
     */
    Encryption?: Encryption;
    /**
     * The ARN of the entitlement.
     */
    EntitlementArn: __string;
    /**
     * An indication of whether the entitlement is enabled.
     */
    EntitlementStatus?: EntitlementStatus;
    /**
     * The name of the entitlement.
     */
    Name: __string;
    /**
     * The AWS account IDs that you want to share your content with. The receiving accounts (subscribers) will be allowed to create their own flow using your content as the source.
     */
    Subscribers: __listOf__string;
  }
  export type EntitlementStatus = "ENABLED"|"DISABLED"|string;
  export interface FailoverConfig {
    /**
     * The type of failover you choose for this flow. MERGE combines the source streams into a single stream, allowing graceful recovery from any single-source loss. FAILOVER allows switching between different streams.
     */
    FailoverMode?: FailoverMode;
    /**
     * Search window time to look for dash-7 packets
     */
    RecoveryWindow?: __integer;
    /**
     * The priority you want to assign to a source. You can have a primary stream and a backup stream or two equally prioritized streams.
     */
    SourcePriority?: SourcePriority;
    State?: State;
  }
  export type FailoverMode = "MERGE"|"FAILOVER"|string;
  export interface Flow {
    /**
     * The Availability Zone that you want to create the flow in. These options are limited to the Availability Zones within the current AWS.
     */
    AvailabilityZone: __string;
    /**
     * A description of the flow. This value is not used or seen outside of the current AWS Elemental MediaConnect account.
     */
    Description?: __string;
    /**
     * The IP address from which video will be sent to output destinations.
     */
    EgressIp?: __string;
    /**
     * The entitlements in this flow.
     */
    Entitlements: __listOfEntitlement;
    /**
     * The Amazon Resource Name (ARN) of the flow.
     */
    FlowArn: __string;
    /**
     * The media streams that are associated with the flow. After you associate a media stream with a source, you can also associate it with outputs on the flow.
     */
    MediaStreams?: __listOfMediaStream;
    /**
     * The name of the flow.
     */
    Name: __string;
    /**
     * The outputs in this flow.
     */
    Outputs: __listOfOutput;
    Source: Source;
    SourceFailoverConfig?: FailoverConfig;
    Sources?: __listOfSource;
    /**
     * The current status of the flow.
     */
    Status: Status;
    /**
     * The VPC Interfaces for this flow.
     */
    VpcInterfaces?: __listOfVpcInterface;
    Maintenance?: Maintenance;
  }
  export interface Fmtp {
    /**
     * The format of the audio channel.
     */
    ChannelOrder?: __string;
    /**
     * The format that is used for the representation of color.
     */
    Colorimetry?: Colorimetry;
    /**
     * The frame rate for the video stream, in frames/second. For example: 60000/1001. If you specify a whole number, MediaConnect uses a ratio of N/1. For example, if you specify 60, MediaConnect uses 60/1 as the exactFramerate.
     */
    ExactFramerate?: __string;
    /**
     * The pixel aspect ratio (PAR) of the video.
     */
    Par?: __string;
    /**
     * The encoding range of the video.
     */
    Range?: Range;
    /**
     * The type of compression that was used to smooth the video’s appearance
     */
    ScanMode?: ScanMode;
    /**
     * The transfer characteristic system (TCS) that is used in the video.
     */
    Tcs?: Tcs;
  }
  export interface FmtpRequest {
    /**
     * The format of the audio channel.
     */
    ChannelOrder?: __string;
    /**
     * The format that is used for the representation of color.
     */
    Colorimetry?: Colorimetry;
    /**
     * The frame rate for the video stream, in frames/second. For example: 60000/1001. If you specify a whole number, MediaConnect uses a ratio of N/1. For example, if you specify 60, MediaConnect uses 60/1 as the exactFramerate.
     */
    ExactFramerate?: __string;
    /**
     * The pixel aspect ratio (PAR) of the video.
     */
    Par?: __string;
    /**
     * The encoding range of the video.
     */
    Range?: Range;
    /**
     * The type of compression that was used to smooth the video’s appearance.
     */
    ScanMode?: ScanMode;
    /**
     * The transfer characteristic system (TCS) that is used in the video.
     */
    Tcs?: Tcs;
  }
  export interface Gateway {
    /**
     * The range of IP addresses that contribute content or initiate output requests for flows communicating with this gateway. These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     */
    EgressCidrBlocks: __listOf__string;
    /**
     * The Amazon Resource Name (ARN) of the gateway.
     */
    GatewayArn: __string;
    GatewayMessages?: __listOfMessageDetail;
    /**
     * The current status of the gateway.
     */
    GatewayState?: GatewayState;
    /**
     * The name of the gateway. This name can not be modified after the gateway is created.
     */
    Name: __string;
    /**
     * The list of networks in the gateway.
     */
    Networks: __listOfGatewayNetwork;
  }
  export interface GatewayBridgeSource {
    /**
     * The ARN of the bridge feeding this flow.
     */
    BridgeArn: __string;
    /**
     * The name of the VPC interface attachment to use for this bridge source.
     */
    VpcInterfaceAttachment?: VpcInterfaceAttachment;
  }
  export interface GatewayInstance {
    /**
     * The availability of the instance to host new bridges. The bridgePlacement property can be LOCKED or AVAILABLE. If it is LOCKED, no new bridges can be deployed to this instance. If it is AVAILABLE, new bridges can be added to this instance.
     */
    BridgePlacement: BridgePlacement;
    /**
     * The connection state of the instance.
     */
    ConnectionStatus: ConnectionStatus;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     */
    GatewayArn: __string;
    /**
     * The Amazon Resource Name (ARN) of the gateway.
     */
    GatewayInstanceArn: __string;
    /**
     * The managed instance ID generated by the SSM install. This will begin with "mi-".
     */
    InstanceId: __string;
    InstanceMessages?: __listOfMessageDetail;
    /**
     * The status of the instance.
     */
    InstanceState: InstanceState;
    /**
     * The running bridge count.
     */
    RunningBridgeCount: __integer;
  }
  export interface GatewayNetwork {
    /**
     * A unique IP address range to use for this network. These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     */
    CidrBlock: __string;
    /**
     * The name of the network. This name is used to reference the network and must be unique among networks in this gateway.
     */
    Name: __string;
  }
  export type GatewayState = "CREATING"|"ACTIVE"|"UPDATING"|"ERROR"|"DELETING"|"DELETED"|string;
  export interface GrantEntitlementRequest {
    /**
     * Percentage from 0-100 of the data transfer cost to be billed to the subscriber.
     */
    DataTransferSubscriberFeePercent?: __integer;
    /**
     * A description of the entitlement. This description appears only on the AWS Elemental MediaConnect console and will not be seen by the subscriber or end user.
     */
    Description?: __string;
    /**
     * The type of encryption that will be used on the output that is associated with this entitlement. Allowable encryption types: static-key, speke.
     */
    Encryption?: Encryption;
    /**
     * An indication of whether the new entitlement should be enabled or disabled as soon as it is created. If you don’t specify the entitlementStatus field in your request, MediaConnect sets it to ENABLED.
     */
    EntitlementStatus?: EntitlementStatus;
    /**
     * The name of the entitlement. This value must be unique within the current flow.
     */
    Name?: __string;
    /**
     * The AWS account IDs that you want to share your content with. The receiving accounts (subscribers) will be allowed to create their own flows using your content as the source.
     */
    Subscribers: __listOf__string;
  }
  export interface GrantFlowEntitlementsRequest {
    /**
     * The list of entitlements that you want to grant.
     */
    Entitlements: __listOfGrantEntitlementRequest;
    /**
     * The flow that you want to grant entitlements on.
     */
    FlowArn: __string;
  }
  export interface GrantFlowEntitlementsResponse {
    /**
     * The entitlements that were just granted.
     */
    Entitlements?: __listOfEntitlement;
    /**
     * The ARN of the flow that these entitlements were granted to.
     */
    FlowArn?: __string;
  }
  export interface IngressGatewayBridge {
    /**
     * The ID of the instance running this bridge.
     */
    InstanceId?: __string;
    /**
     * The maximum expected bitrate (in bps) of the ingress bridge.
     */
    MaxBitrate: __integer;
    /**
     * The maximum number of outputs on the ingress bridge.
     */
    MaxOutputs: __integer;
  }
  export interface InputConfiguration {
    /**
     * The IP address that the flow listens on for incoming content for a media stream.
     */
    InputIp: __string;
    /**
     * The port that the flow listens on for an incoming media stream.
     */
    InputPort: __integer;
    /**
     * The VPC interface where the media stream comes in from.
     */
    Interface: Interface;
  }
  export interface InputConfigurationRequest {
    /**
     * The port that you want the flow to listen on for an incoming media stream.
     */
    InputPort: __integer;
    /**
     * The VPC interface that you want to use for the incoming media stream.
     */
    Interface: InterfaceRequest;
  }
  export type InstanceState = "REGISTERING"|"ACTIVE"|"DEREGISTERING"|"DEREGISTERED"|"REGISTRATION_ERROR"|"DEREGISTRATION_ERROR"|string;
  export interface Interface {
    /**
     * The name of the VPC interface.
     */
    Name: __string;
  }
  export interface InterfaceRequest {
    /**
     * The name of the VPC interface.
     */
    Name: __string;
  }
  export type KeyType = "speke"|"static-key"|"srt-password"|string;
  export interface ListBridgesRequest {
    /**
     * Filter the list results to display only the bridges associated with the selected Amazon Resource Name (ARN).
     */
    FilterArn?: __string;
    /**
     * The maximum number of results to return per API request. For example, you submit a ListBridges request with MaxResults set at 5. Although 20 items match your request, the service returns no more than the first 5 items. (The service also returns a NextToken value that you can use to fetch the next batch of results.) The service might return fewer results than the MaxResults value. If MaxResults is not included in the request, the service defaults to pagination with a maximum of 10 results per page.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListBridges request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListBridges request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListBridgesResponse {
    /**
     * A list of bridge summaries.
     */
    Bridges?: __listOfListedBridge;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListBridges request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListBridges request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListEntitlementsRequest {
    /**
     * The maximum number of results to return per API request. For example, you submit a ListEntitlements request with MaxResults set at 5. Although 20 items match your request, the service returns no more than the first 5 items. (The service also returns a NextToken value that you can use to fetch the next batch of results.) The service might return fewer results than the MaxResults value. If MaxResults is not included in the request, the service defaults to pagination with a maximum of 20 results per page.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListEntitlements request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListEntitlements request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListEntitlementsResponse {
    /**
     * A list of entitlements that have been granted to you from other AWS accounts.
     */
    Entitlements?: __listOfListedEntitlement;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListEntitlements request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListEntitlements request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListFlowsRequest {
    /**
     * The maximum number of results to return per API request. For example, you submit a ListFlows request with MaxResults set at 5. Although 20 items match your request, the service returns no more than the first 5 items. (The service also returns a NextToken value that you can use to fetch the next batch of results.) The service might return fewer results than the MaxResults value. If MaxResults is not included in the request, the service defaults to pagination with a maximum of 10 results per page.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListFlows request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListFlows request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListFlowsResponse {
    /**
     * A list of flow summaries.
     */
    Flows?: __listOfListedFlow;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListFlows request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListFlows request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListGatewayInstancesRequest {
    /**
     * Filter the list results to display only the instances associated with the selected Gateway Amazon Resource Name (ARN).
     */
    FilterArn?: __string;
    /**
     * The maximum number of results to return per API request. For example, you submit a ListInstances request with MaxResults set at 5. Although 20 items match your request, the service returns no more than the first 5 items. (The service also returns a NextToken value that you can use to fetch the next batch of results.) The service might return fewer results than the MaxResults value. If MaxResults is not included in the request, the service defaults to pagination with a maximum of 10 results per page.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListInstances request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListInstances request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListGatewayInstancesResponse {
    /**
     * A list of instance summaries.
     */
    Instances?: __listOfListedGatewayInstance;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListInstances request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListInstances request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListGatewaysRequest {
    /**
     * The maximum number of results to return per API request. For example, you submit a ListGateways request with MaxResults set at 5. Although 20 items match your request, the service returns no more than the first 5 items. (The service also returns a NextToken value that you can use to fetch the next batch of results.) The service might return fewer results than the MaxResults value. If MaxResults is not included in the request, the service defaults to pagination with a maximum of 10 results per page.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListGateways request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListGateways request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListGatewaysResponse {
    /**
     * A list of gateway summaries.
     */
    Gateways?: __listOfListedGateway;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListGateways request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListGateways request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListOfferingsRequest {
    /**
     * The maximum number of results to return per API request. For example, you submit a ListOfferings request with MaxResults set at 5. Although 20 items match your request, the service returns no more than the first 5 items. (The service also returns a NextToken value that you can use to fetch the next batch of results.) The service might return fewer results than the MaxResults value. If MaxResults is not included in the request, the service defaults to pagination with a maximum of 10 results per page.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListOfferings request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListOfferings request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListOfferingsResponse {
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListOfferings request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListOfferings request a second time and specify the NextToken value.
     */
    NextToken?: __string;
    /**
     * A list of offerings that are available to this account in the current AWS Region.
     */
    Offerings?: __listOfOffering;
  }
  export interface ListReservationsRequest {
    /**
     * The maximum number of results to return per API request. For example, you submit a ListReservations request with MaxResults set at 5. Although 20 items match your request, the service returns no more than the first 5 items. (The service also returns a NextToken value that you can use to fetch the next batch of results.) The service might return fewer results than the MaxResults value. If MaxResults is not included in the request, the service defaults to pagination with a maximum of 10 results per page.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListReservations request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListOfferings request a second time and specify the NextToken value.
     */
    NextToken?: __string;
  }
  export interface ListReservationsResponse {
    /**
     * The token that identifies which batch of results that you want to see. For example, you submit a ListReservations request with MaxResults set at 5. The service returns the first batch of results (up to 5) and a NextToken value. To see the next batch of results, you can submit the ListReservations request a second time and specify the NextToken value.
     */
    NextToken?: __string;
    /**
     * A list of all reservations that have been purchased by this account in the current AWS Region.
     */
    Reservations?: __listOfReservation;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the AWS Elemental MediaConnect resource for which to list the tags.
     */
    ResourceArn: __string;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A map from tag keys to values. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     */
    Tags?: __mapOf__string;
  }
  export interface ListedBridge {
    /**
     * The ARN of the bridge.
     */
    BridgeArn: __string;
    BridgeState: BridgeState;
    /**
     * The type of the bridge.
     */
    BridgeType: __string;
    /**
     * The name of the bridge.
     */
    Name: __string;
    /**
     * The ARN of the gateway associated with the bridge.
     */
    PlacementArn: __string;
  }
  export interface ListedEntitlement {
    /**
     * Percentage from 0-100 of the data transfer cost to be billed to the subscriber.
     */
    DataTransferSubscriberFeePercent?: __integer;
    /**
     * The ARN of the entitlement.
     */
    EntitlementArn: __string;
    /**
     * The name of the entitlement.
     */
    EntitlementName: __string;
  }
  export interface ListedFlow {
    /**
     * The Availability Zone that the flow was created in.
     */
    AvailabilityZone: __string;
    /**
     * A description of the flow.
     */
    Description: __string;
    /**
     * The ARN of the flow.
     */
    FlowArn: __string;
    /**
     * The name of the flow.
     */
    Name: __string;
    /**
     * The type of source. This value is either owned (originated somewhere other than an AWS Elemental MediaConnect flow owned by another AWS account) or entitled (originated at an AWS Elemental MediaConnect flow owned by another AWS account).
     */
    SourceType: SourceType;
    /**
     * The current status of the flow.
     */
    Status: Status;
    Maintenance?: Maintenance;
  }
  export interface ListedGateway {
    /**
     * The Amazon Resource Name (ARN) of the gateway.
     */
    GatewayArn: __string;
    GatewayState: GatewayState;
    /**
     * The name of the gateway.
     */
    Name: __string;
  }
  export interface ListedGatewayInstance {
    /**
     * The Amazon Resource Name (ARN) of the gateway.
     */
    GatewayArn: __string;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     */
    GatewayInstanceArn: __string;
    /**
     * The managed instance ID generated by the SSM install. This will begin with "mi-".
     */
    InstanceId: __string;
    /**
     * The status of the instance.
     */
    InstanceState?: InstanceState;
  }
  export interface Maintenance {
    /**
     * A day of a week when the maintenance will happen. Use Monday/Tuesday/Wednesday/Thursday/Friday/Saturday/Sunday.
     */
    MaintenanceDay?: MaintenanceDay;
    /**
     * The Maintenance has to be performed before this deadline in ISO UTC format. Example: 2021-01-30T08:30:00Z.
     */
    MaintenanceDeadline?: __string;
    /**
     * A scheduled date in ISO UTC format when the maintenance will happen. Use YYYY-MM-DD format. Example: 2021-01-30.
     */
    MaintenanceScheduledDate?: __string;
    /**
     * UTC time when the maintenance will happen. Use 24-hour HH:MM format. Minutes must be 00. Example: 13:00. The default value is 02:00.
     */
    MaintenanceStartHour?: __string;
  }
  export type MaintenanceDay = "Monday"|"Tuesday"|"Wednesday"|"Thursday"|"Friday"|"Saturday"|"Sunday"|string;
  export type MaxResults = number;
  export interface MediaStream {
    /**
     * Attributes that are related to the media stream.
     */
    Attributes?: MediaStreamAttributes;
    /**
     * The sample rate for the stream. This value is measured in Hz.
     */
    ClockRate?: __integer;
    /**
     * A description that can help you quickly identify what your media stream is used for.
     */
    Description?: __string;
    /**
     * The format type number (sometimes referred to as RTP payload type) of the media stream. MediaConnect assigns this value to the media stream. For ST 2110 JPEG XS outputs, you need to provide this value to the receiver.
     */
    Fmt: __integer;
    /**
     * A unique identifier for the media stream.
     */
    MediaStreamId: __integer;
    /**
     * A name that helps you distinguish one media stream from another.
     */
    MediaStreamName: __string;
    /**
     * The type of media stream.
     */
    MediaStreamType: MediaStreamType;
    /**
     * The resolution of the video.
     */
    VideoFormat?: __string;
  }
  export interface MediaStreamAttributes {
    /**
     * A set of parameters that define the media stream.
     */
    Fmtp: Fmtp;
    /**
     * The audio language, in a format that is recognized by the receiver.
     */
    Lang?: __string;
  }
  export interface MediaStreamAttributesRequest {
    /**
     * The settings that you want to use to define the media stream.
     */
    Fmtp?: FmtpRequest;
    /**
     * The audio language, in a format that is recognized by the receiver.
     */
    Lang?: __string;
  }
  export interface MediaStreamOutputConfiguration {
    /**
     * The transport parameters that are associated with each outbound media stream.
     */
    DestinationConfigurations?: __listOfDestinationConfiguration;
    /**
     * The format that was used to encode the data. For ancillary data streams, set the encoding name to smpte291. For audio streams, set the encoding name to pcm. For video, 2110 streams, set the encoding name to raw. For video, JPEG XS streams, set the encoding name to jxsv.
     */
    EncodingName: EncodingName;
    /**
     * Encoding parameters
     */
    EncodingParameters?: EncodingParameters;
    /**
     * The name of the media stream.
     */
    MediaStreamName: __string;
  }
  export interface MediaStreamOutputConfigurationRequest {
    /**
     * The transport parameters that you want to associate with the media stream.
     */
    DestinationConfigurations?: __listOfDestinationConfigurationRequest;
    /**
     * The format that will be used to encode the data. For ancillary data streams, set the encoding name to smpte291. For audio streams, set the encoding name to pcm. For video, 2110 streams, set the encoding name to raw. For video, JPEG XS streams, set the encoding name to jxsv.
     */
    EncodingName: EncodingName;
    /**
     * A collection of parameters that determine how MediaConnect will convert the content. These fields only apply to outputs on flows that have a CDI source.
     */
    EncodingParameters?: EncodingParametersRequest;
    /**
     * The name of the media stream that is associated with the output.
     */
    MediaStreamName: __string;
  }
  export interface MediaStreamSourceConfiguration {
    /**
     * The format that was used to encode the data. For ancillary data streams, set the encoding name to smpte291. For audio streams, set the encoding name to pcm. For video, 2110 streams, set the encoding name to raw. For video, JPEG XS streams, set the encoding name to jxsv.
     */
    EncodingName: EncodingName;
    /**
     * The transport parameters that are associated with an incoming media stream.
     */
    InputConfigurations?: __listOfInputConfiguration;
    /**
     * The name of the media stream.
     */
    MediaStreamName: __string;
  }
  export interface MediaStreamSourceConfigurationRequest {
    /**
     * The format you want to use to encode the data. For ancillary data streams, set the encoding name to smpte291. For audio streams, set the encoding name to pcm. For video, 2110 streams, set the encoding name to raw. For video, JPEG XS streams, set the encoding name to jxsv.
     */
    EncodingName: EncodingName;
    /**
     * The transport parameters that you want to associate with the media stream.
     */
    InputConfigurations?: __listOfInputConfigurationRequest;
    /**
     * The name of the media stream.
     */
    MediaStreamName: __string;
  }
  export type MediaStreamType = "video"|"audio"|"ancillary-data"|string;
  export interface MessageDetail {
    /**
     * The error code.
     */
    Code: __string;
    /**
     * The specific error message that MediaConnect returns to help you understand the reason that the request did not succeed.
     */
    Message: __string;
    /**
     * The name of the resource.
     */
    ResourceName?: __string;
  }
  export interface Messages {
    /**
     * A list of errors that might have been generated from processes on this flow.
     */
    Errors: __listOf__string;
  }
  export type NetworkInterfaceType = "ena"|"efa"|string;
  export interface Offering {
    /**
     * The type of currency that is used for billing. The currencyCode used for all reservations is US dollars.
     */
    CurrencyCode: __string;
    /**
     * The length of time that your reservation would be active.
     */
    Duration: __integer;
    /**
     * The unit of measurement for the duration of the offering.
     */
    DurationUnits: DurationUnits;
    /**
     * The Amazon Resource Name (ARN) that MediaConnect assigns to the offering.
     */
    OfferingArn: __string;
    /**
     * A description of the offering.
     */
    OfferingDescription: __string;
    /**
     * The cost of a single unit. This value, in combination with priceUnits, makes up the rate.
     */
    PricePerUnit: __string;
    /**
     * The unit of measurement that is used for billing. This value, in combination with pricePerUnit, makes up the rate.
     */
    PriceUnits: PriceUnits;
    /**
     * A definition of the amount of outbound bandwidth that you would be reserving if you purchase the offering.
     */
    ResourceSpecification: ResourceSpecification;
  }
  export interface Output {
    /**
     * Percentage from 0-100 of the data transfer cost to be billed to the subscriber.
     */
    DataTransferSubscriberFeePercent?: __integer;
    /**
     * A description of the output.
     */
    Description?: __string;
    /**
     * The address where you want to send the output.
     */
    Destination?: __string;
    /**
     * The type of key used for the encryption. If no keyType is provided, the service will use the default setting (static-key).
     */
    Encryption?: Encryption;
    /**
     * The ARN of the entitlement on the originator''s flow. This value is relevant only on entitled flows.
     */
    EntitlementArn?: __string;
    /**
     * The IP address that the receiver requires in order to establish a connection with the flow. For public networking, the ListenerAddress is represented by the elastic IP address of the flow. For private networking, the ListenerAddress is represented by the elastic network interface IP address of the VPC. This field applies only to outputs that use the Zixi pull or SRT listener protocol.
     */
    ListenerAddress?: __string;
    /**
     * The input ARN of the AWS Elemental MediaLive channel. This parameter is relevant only for outputs that were added by creating a MediaLive input.
     */
    MediaLiveInputArn?: __string;
    /**
     * The configuration for each media stream that is associated with the output.
     */
    MediaStreamOutputConfigurations?: __listOfMediaStreamOutputConfiguration;
    /**
     * The name of the output. This value must be unique within the current flow.
     */
    Name: __string;
    /**
     * The ARN of the output.
     */
    OutputArn: __string;
    /**
     * The port to use when content is distributed to this output.
     */
    Port?: __integer;
    /**
     * Attributes related to the transport stream that are used in the output.
     */
    Transport?: Transport;
    /**
     * The name of the VPC interface attachment to use for this output.
     */
    VpcInterfaceAttachment?: VpcInterfaceAttachment;
    /**
     * The ARN of the bridge that added this output.
     */
    BridgeArn?: __string;
    /**
     * The bridge output ports currently in use.
     */
    BridgePorts?: __listOf__integer;
  }
  export type PriceUnits = "HOURLY"|string;
  export type Protocol = "zixi-push"|"rtp-fec"|"rtp"|"zixi-pull"|"rist"|"st2110-jpegxs"|"cdi"|"srt-listener"|"srt-caller"|"fujitsu-qos"|"udp"|string;
  export interface PurchaseOfferingRequest {
    /**
     * The Amazon Resource Name (ARN) of the offering.
     */
    OfferingArn: __string;
    /**
     * The name that you want to use for the reservation.
     */
    ReservationName: __string;
    /**
     * The date and time that you want the reservation to begin, in Coordinated Universal Time (UTC). You can specify any date and time between 12:00am on the first day of the current month to the current time on today's date, inclusive. Specify the start in a 24-hour notation. Use the following format: YYYY-MM-DDTHH:mm:SSZ, where T and Z are literal characters. For example, to specify 11:30pm on March 5, 2020, enter 2020-03-05T23:30:00Z.
     */
    Start: __string;
  }
  export interface PurchaseOfferingResponse {
    Reservation?: Reservation;
  }
  export type Range = "NARROW"|"FULL"|"FULLPROTECT"|string;
  export interface RemoveBridgeOutputRequest {
    /**
     * The ARN of the bridge that you want to update.
     */
    BridgeArn: __string;
    /**
     * The name of the bridge output that you want to remove.
     */
    OutputName: __string;
  }
  export interface RemoveBridgeOutputResponse {
    BridgeArn?: __string;
    OutputName?: __string;
  }
  export interface RemoveBridgeSourceRequest {
    /**
     * The ARN of the bridge that you want to update.
     */
    BridgeArn: __string;
    /**
     * The name of the bridge source that you want to remove.
     */
    SourceName: __string;
  }
  export interface RemoveBridgeSourceResponse {
    BridgeArn?: __string;
    SourceName?: __string;
  }
  export interface RemoveFlowMediaStreamRequest {
    /**
     * The Amazon Resource Name (ARN) of the flow.
     */
    FlowArn: __string;
    /**
     * The name of the media stream that you want to remove.
     */
    MediaStreamName: __string;
  }
  export interface RemoveFlowMediaStreamResponse {
    /**
     * The Amazon Resource Name (ARN) of the flow.
     */
    FlowArn?: __string;
    /**
     * The name of the media stream that was removed.
     */
    MediaStreamName?: __string;
  }
  export interface RemoveFlowOutputRequest {
    /**
     * The flow that you want to remove an output from.
     */
    FlowArn: __string;
    /**
     * The ARN of the output that you want to remove.
     */
    OutputArn: __string;
  }
  export interface RemoveFlowOutputResponse {
    /**
     * The ARN of the flow that is associated with the output you removed.
     */
    FlowArn?: __string;
    /**
     * The ARN of the output that was removed.
     */
    OutputArn?: __string;
  }
  export interface RemoveFlowSourceRequest {
    /**
     * The flow that you want to remove a source from.
     */
    FlowArn: __string;
    /**
     * The ARN of the source that you want to remove.
     */
    SourceArn: __string;
  }
  export interface RemoveFlowSourceResponse {
    /**
     * The ARN of the flow that is associated with the source you removed.
     */
    FlowArn?: __string;
    /**
     * The ARN of the source that was removed.
     */
    SourceArn?: __string;
  }
  export interface RemoveFlowVpcInterfaceRequest {
    /**
     * The flow that you want to remove a VPC interface from.
     */
    FlowArn: __string;
    /**
     * The name of the VPC interface that you want to remove.
     */
    VpcInterfaceName: __string;
  }
  export interface RemoveFlowVpcInterfaceResponse {
    /**
     * The ARN of the flow that is associated with the VPC interface you removed.
     */
    FlowArn?: __string;
    /**
     * IDs of network interfaces associated with the removed VPC interface that Media Connect was unable to remove.
     */
    NonDeletedNetworkInterfaceIds?: __listOf__string;
    /**
     * The name of the VPC interface that was removed.
     */
    VpcInterfaceName?: __string;
  }
  export interface Reservation {
    /**
     * The type of currency that is used for billing. The currencyCode used for your reservation is US dollars.
     */
    CurrencyCode: __string;
    /**
     * The length of time that this reservation is active. MediaConnect defines this value in the offering.
     */
    Duration: __integer;
    /**
     * The unit of measurement for the duration of the reservation. MediaConnect defines this value in the offering.
     */
    DurationUnits: DurationUnits;
    /**
     * The day and time that this reservation expires. This value is calculated based on the start date and time that you set and the offering's duration.
     */
    End: __string;
    /**
     * The Amazon Resource Name (ARN) that MediaConnect assigns to the offering.
     */
    OfferingArn: __string;
    /**
     * A description of the offering. MediaConnect defines this value in the offering.
     */
    OfferingDescription: __string;
    /**
     * The cost of a single unit. This value, in combination with priceUnits, makes up the rate. MediaConnect defines this value in the offering.
     */
    PricePerUnit: __string;
    /**
     * The unit of measurement that is used for billing. This value, in combination with pricePerUnit, makes up the rate. MediaConnect defines this value in the offering.
     */
    PriceUnits: PriceUnits;
    /**
     * The Amazon Resource Name (ARN) that MediaConnect assigns to the reservation when you purchase an offering.
     */
    ReservationArn: __string;
    /**
     * The name that you assigned to the reservation when you purchased the offering.
     */
    ReservationName: __string;
    /**
     * The status of your reservation.
     */
    ReservationState: ReservationState;
    /**
     * A definition of the amount of outbound bandwidth that you would be reserving if you purchase the offering. MediaConnect defines the values that make up the resourceSpecification in the offering.
     */
    ResourceSpecification: ResourceSpecification;
    /**
     * The day and time that the reservation becomes active. You set this value when you purchase the offering.
     */
    Start: __string;
  }
  export type ReservationState = "ACTIVE"|"EXPIRED"|"PROCESSING"|"CANCELED"|string;
  export interface ResourceSpecification {
    /**
     * The amount of outbound bandwidth that is discounted in the offering.
     */
    ReservedBitrate?: __integer;
    /**
     * The type of resource and the unit that is being billed for.
     */
    ResourceType: ResourceType;
  }
  export type ResourceType = "Mbps_Outbound_Bandwidth"|string;
  export interface RevokeFlowEntitlementRequest {
    /**
     * The ARN of the entitlement that you want to revoke.
     */
    EntitlementArn: __string;
    /**
     * The flow that you want to revoke an entitlement from.
     */
    FlowArn: __string;
  }
  export interface RevokeFlowEntitlementResponse {
    /**
     * The ARN of the entitlement that was revoked.
     */
    EntitlementArn?: __string;
    /**
     * The ARN of the flow that the entitlement was revoked from.
     */
    FlowArn?: __string;
  }
  export type ScanMode = "progressive"|"interlace"|"progressive-segmented-frame"|string;
  export interface SetGatewayBridgeSourceRequest {
    /**
     * The ARN of the bridge feeding this flow.
     */
    BridgeArn: __string;
    /**
     * The name of the VPC interface attachment to use for this bridge source.
     */
    VpcInterfaceAttachment?: VpcInterfaceAttachment;
  }
  export interface SetSourceRequest {
    /**
     * The type of encryption that is used on the content ingested from this source. Allowable encryption types: static-key.
     */
    Decryption?: Encryption;
    /**
     * A description for the source. This value is not used or seen outside of the current AWS Elemental MediaConnect account.
     */
    Description?: __string;
    /**
     * The ARN of the entitlement that allows you to subscribe to this flow. The entitlement is set by the flow originator, and the ARN is generated as part of the originator's flow.
     */
    EntitlementArn?: __string;
    /**
     * The port that the flow will be listening on for incoming content.
     */
    IngestPort?: __integer;
    /**
     * The smoothing max bitrate (in bps) for RIST, RTP, and RTP-FEC streams.
     */
    MaxBitrate?: __integer;
    /**
     * The maximum latency in milliseconds. This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
     */
    MaxLatency?: __integer;
    /**
     * The size of the buffer (in milliseconds) to use to sync incoming source data.
     */
    MaxSyncBuffer?: __integer;
    /**
     * The media streams that are associated with the source, and the parameters for those associations.
     */
    MediaStreamSourceConfigurations?: __listOfMediaStreamSourceConfigurationRequest;
    /**
     * The minimum latency in milliseconds for SRT-based streams. In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
     */
    MinLatency?: __integer;
    /**
     * The name of the source.
     */
    Name?: __string;
    /**
     * The protocol that is used by the source.
     */
    Protocol?: Protocol;
    /**
     * The port that the flow uses to send outbound requests to initiate connection with the sender.
     */
    SenderControlPort?: __integer;
    /**
     * The IP address that the flow communicates with to initiate connection with the sender.
     */
    SenderIpAddress?: __string;
    /**
     * Source IP or domain name for SRT-caller protocol.
     */
    SourceListenerAddress?: __string;
    /**
     * Source port for SRT-caller protocol.
     */
    SourceListenerPort?: __integer;
    /**
     * The stream ID that you want to use for this transport. This parameter applies only to Zixi and SRT caller-based streams.
     */
    StreamId?: __string;
    /**
     * The name of the VPC interface to use for this source.
     */
    VpcInterfaceName?: __string;
    /**
     * The range of IP addresses that should be allowed to contribute content to your source. These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     */
    WhitelistCidr?: __string;
    /**
     * The source configuration for cloud flows receiving a stream from a bridge.
     */
    GatewayBridgeSource?: SetGatewayBridgeSourceRequest;
  }
  export interface Source {
    /**
     * Percentage from 0-100 of the data transfer cost to be billed to the subscriber.
     */
    DataTransferSubscriberFeePercent?: __integer;
    /**
     * The type of encryption that is used on the content ingested from this source.
     */
    Decryption?: Encryption;
    /**
     * A description for the source. This value is not used or seen outside of the current AWS Elemental MediaConnect account.
     */
    Description?: __string;
    /**
     * The ARN of the entitlement that allows you to subscribe to content that comes from another AWS account. The entitlement is set by the content originator and the ARN is generated as part of the originator's flow.
     */
    EntitlementArn?: __string;
    /**
     * The IP address that the flow will be listening on for incoming content.
     */
    IngestIp?: __string;
    /**
     * The port that the flow will be listening on for incoming content.
     */
    IngestPort?: __integer;
    /**
     * The media streams that are associated with the source, and the parameters for those associations.
     */
    MediaStreamSourceConfigurations?: __listOfMediaStreamSourceConfiguration;
    /**
     * The name of the source.
     */
    Name: __string;
    /**
     * The port that the flow uses to send outbound requests to initiate connection with the sender.
     */
    SenderControlPort?: __integer;
    /**
     * The IP address that the flow communicates with to initiate connection with the sender.
     */
    SenderIpAddress?: __string;
    /**
     * The ARN of the source.
     */
    SourceArn: __string;
    /**
     * Attributes related to the transport stream that are used in the source.
     */
    Transport?: Transport;
    /**
     * The name of the VPC interface that is used for this source.
     */
    VpcInterfaceName?: __string;
    /**
     * The range of IP addresses that should be allowed to contribute content to your source. These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     */
    WhitelistCidr?: __string;
    /**
     * The source configuration for cloud flows receiving a stream from a bridge.
     */
    GatewayBridgeSource?: GatewayBridgeSource;
  }
  export interface SourcePriority {
    /**
     * The name of the source you choose as the primary source for this flow.
     */
    PrimarySource?: __string;
  }
  export type SourceType = "OWNED"|"ENTITLED"|string;
  export interface StartFlowRequest {
    /**
     * The ARN of the flow that you want to start.
     */
    FlowArn: __string;
  }
  export interface StartFlowResponse {
    /**
     * The ARN of the flow that you started.
     */
    FlowArn?: __string;
    /**
     * The status of the flow when the StartFlow process begins.
     */
    Status?: Status;
  }
  export type State = "ENABLED"|"DISABLED"|string;
  export type Status = "STANDBY"|"ACTIVE"|"UPDATING"|"DELETING"|"STARTING"|"STOPPING"|"ERROR"|string;
  export interface StopFlowRequest {
    /**
     * The ARN of the flow that you want to stop.
     */
    FlowArn: __string;
  }
  export interface StopFlowResponse {
    /**
     * The ARN of the flow that you stopped.
     */
    FlowArn?: __string;
    /**
     * The status of the flow when the StopFlow process begins.
     */
    Status?: Status;
  }
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the AWS Elemental MediaConnect resource to which to add tags.
     */
    ResourceArn: __string;
    /**
     * A map from tag keys to values. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     */
    Tags: __mapOf__string;
  }
  export type Tcs = "SDR"|"PQ"|"HLG"|"LINEAR"|"BT2100LINPQ"|"BT2100LINHLG"|"ST2065-1"|"ST428-1"|"DENSITY"|string;
  export interface Transport {
    /**
     * The range of IP addresses that should be allowed to initiate output requests to this flow. These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     */
    CidrAllowList?: __listOf__string;
    /**
     * The smoothing max bitrate (in bps) for RIST, RTP, and RTP-FEC streams.
     */
    MaxBitrate?: __integer;
    /**
     * The maximum latency in milliseconds. This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
     */
    MaxLatency?: __integer;
    /**
     * The size of the buffer (in milliseconds) to use to sync incoming source data.
     */
    MaxSyncBuffer?: __integer;
    /**
     * The minimum latency in milliseconds for SRT-based streams. In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
     */
    MinLatency?: __integer;
    /**
     * The protocol that is used by the source or output.
     */
    Protocol: Protocol;
    /**
     * The remote ID for the Zixi-pull stream.
     */
    RemoteId?: __string;
    /**
     * The port that the flow uses to send outbound requests to initiate connection with the sender.
     */
    SenderControlPort?: __integer;
    /**
     * The IP address that the flow communicates with to initiate connection with the sender.
     */
    SenderIpAddress?: __string;
    /**
     * The smoothing latency in milliseconds for RIST, RTP, and RTP-FEC streams.
     */
    SmoothingLatency?: __integer;
    /**
     * Source IP or domain name for SRT-caller protocol.
     */
    SourceListenerAddress?: __string;
    /**
     * Source port for SRT-caller protocol.
     */
    SourceListenerPort?: __integer;
    /**
     * The stream ID that you want to use for this transport. This parameter applies only to Zixi and SRT caller-based streams.
     */
    StreamId?: __string;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the AWS Elemental MediaConnect resource from which to delete tags.
     */
    ResourceArn: __string;
    /**
     * The keys of the tags to be removed.
     */
    TagKeys: __listOf__string;
  }
  export interface UpdateBridgeFlowSourceRequest {
    /**
     * The ARN of the cloud flow to use as a source of this bridge.
     */
    FlowArn?: __string;
    /**
     * The name of the VPC interface attachment to use for this source.
     */
    FlowVpcInterfaceAttachment?: VpcInterfaceAttachment;
  }
  export interface UpdateBridgeNetworkOutputRequest {
    /**
     * The network output IP Address.
     */
    IpAddress?: __string;
    /**
     * The network output's gateway network name.
     */
    NetworkName?: __string;
    /**
     * The network output port.
     */
    Port?: __integer;
    /**
     * The network output protocol.
     */
    Protocol?: Protocol;
    /**
     * The network output TTL.
     */
    Ttl?: __integer;
  }
  export interface UpdateBridgeNetworkSourceRequest {
    /**
     * The network source multicast IP.
     */
    MulticastIp?: __string;
    /**
     * The network source's gateway network name.
     */
    NetworkName?: __string;
    /**
     * The network source port.
     */
    Port?: __integer;
    /**
     * The network source protocol.
     */
    Protocol?: Protocol;
  }
  export interface UpdateBridgeOutputRequest {
    /**
     * The ARN of the bridge that you want to update.
     */
    BridgeArn: __string;
    NetworkOutput?: UpdateBridgeNetworkOutputRequest;
    /**
     * The name of the bridge output that you want to update.
     */
    OutputName: __string;
  }
  export interface UpdateBridgeOutputResponse {
    /**
     * The Amazon Resource Number (ARN) of the bridge.
     */
    BridgeArn?: __string;
    /**
     * The output that you updated.
     */
    Output?: BridgeOutput;
  }
  export interface UpdateBridgeRequest {
    /**
     * The Amazon Resource Number (ARN) of the bridge that you want to update.
     */
    BridgeArn: __string;
    EgressGatewayBridge?: UpdateEgressGatewayBridgeRequest;
    IngressGatewayBridge?: UpdateIngressGatewayBridgeRequest;
    SourceFailoverConfig?: UpdateFailoverConfig;
  }
  export interface UpdateBridgeResponse {
    Bridge?: Bridge;
  }
  export interface UpdateBridgeSourceRequest {
    /**
     * The ARN of the bridge that you want to update.
     */
    BridgeArn: __string;
    FlowSource?: UpdateBridgeFlowSourceRequest;
    NetworkSource?: UpdateBridgeNetworkSourceRequest;
    /**
     * The name of the source that you want to update.
     */
    SourceName: __string;
  }
  export interface UpdateBridgeSourceResponse {
    /**
     * The Amazon Resource Number (ARN) of the bridge.
     */
    BridgeArn?: __string;
    Source?: BridgeSource;
  }
  export interface UpdateBridgeStateRequest {
    /**
     * The ARN of the bridge that you want to update.
     */
    BridgeArn: __string;
    DesiredState: DesiredState;
  }
  export interface UpdateBridgeStateResponse {
    /**
     * The Amazon Resource Number (ARN) of the bridge.
     */
    BridgeArn?: __string;
    /**
     * The state of the bridge. ACTIVE or STANDBY.
     */
    DesiredState?: DesiredState;
  }
  export interface UpdateEgressGatewayBridgeRequest {
    /**
     * Update an existing egress-type bridge.
     */
    MaxBitrate?: __integer;
  }
  export interface UpdateEncryption {
    /**
     * The type of algorithm that is used for the encryption (such as aes128, aes192, or aes256).
     */
    Algorithm?: Algorithm;
    /**
     * A 128-bit, 16-byte hex value represented by a 32-character string, to be used with the key for encrypting content. This parameter is not valid for static key encryption.
     */
    ConstantInitializationVector?: __string;
    /**
     * The value of one of the devices that you configured with your digital rights management (DRM) platform key provider. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     */
    DeviceId?: __string;
    /**
     * The type of key that is used for the encryption. If no keyType is provided, the service will use the default setting (static-key).
     */
    KeyType?: KeyType;
    /**
     * The AWS Region that the API Gateway proxy endpoint was created in. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     */
    Region?: __string;
    /**
     * An identifier for the content. The service sends this value to the key server to identify the current endpoint. The resource ID is also known as the content ID. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     */
    ResourceId?: __string;
    /**
     * The ARN of the role that you created during setup (when you set up AWS Elemental MediaConnect as a trusted entity).
     */
    RoleArn?: __string;
    /**
     * The ARN of the secret that you created in AWS Secrets Manager to store the encryption key. This parameter is required for static key encryption and is not valid for SPEKE encryption.
     */
    SecretArn?: __string;
    /**
     * The URL from the API Gateway proxy that you set up to talk to your key server. This parameter is required for SPEKE encryption and is not valid for static key encryption.
     */
    Url?: __string;
  }
  export interface UpdateFailoverConfig {
    /**
     * The type of failover you choose for this flow. MERGE combines the source streams into a single stream, allowing graceful recovery from any single-source loss. FAILOVER allows switching between different streams.
     */
    FailoverMode?: FailoverMode;
    /**
     * Recovery window time to look for dash-7 packets
     */
    RecoveryWindow?: __integer;
    /**
     * The priority you want to assign to a source. You can have a primary stream and a backup stream or two equally prioritized streams.
     */
    SourcePriority?: SourcePriority;
    State?: State;
  }
  export interface UpdateFlowEntitlementRequest {
    /**
     * A description of the entitlement. This description appears only on the AWS Elemental MediaConnect console and will not be seen by the subscriber or end user.
     */
    Description?: __string;
    /**
     * The type of encryption that will be used on the output associated with this entitlement. Allowable encryption types: static-key, speke.
     */
    Encryption?: UpdateEncryption;
    /**
     * The ARN of the entitlement that you want to update.
     */
    EntitlementArn: __string;
    /**
     * An indication of whether you want to enable the entitlement to allow access, or disable it to stop streaming content to the subscriber’s flow temporarily. If you don’t specify the entitlementStatus field in your request, MediaConnect leaves the value unchanged.
     */
    EntitlementStatus?: EntitlementStatus;
    /**
     * The flow that is associated with the entitlement that you want to update.
     */
    FlowArn: __string;
    /**
     * The AWS account IDs that you want to share your content with. The receiving accounts (subscribers) will be allowed to create their own flow using your content as the source.
     */
    Subscribers?: __listOf__string;
  }
  export interface UpdateFlowEntitlementResponse {
    /**
     * The new configuration of the entitlement that you updated.
     */
    Entitlement?: Entitlement;
    /**
     * The ARN of the flow that this entitlement was granted on.
     */
    FlowArn?: __string;
  }
  export interface UpdateFlowMediaStreamRequest {
    /**
     * The attributes that you want to assign to the media stream.
     */
    Attributes?: MediaStreamAttributesRequest;
    /**
     * The sample rate (in Hz) for the stream. If the media stream type is video or ancillary data, set this value to 90000. If the media stream type is audio, set this value to either 48000 or 96000.
     */
    ClockRate?: __integer;
    /**
     * Description
     */
    Description?: __string;
    /**
     * The Amazon Resource Name (ARN) of the flow.
     */
    FlowArn: __string;
    /**
     * The name of the media stream that you want to update.
     */
    MediaStreamName: __string;
    /**
     * The type of media stream.
     */
    MediaStreamType?: MediaStreamType;
    /**
     * The resolution of the video.
     */
    VideoFormat?: __string;
  }
  export interface UpdateFlowMediaStreamResponse {
    /**
     * The ARN of the flow that is associated with the media stream that you updated.
     */
    FlowArn?: __string;
    /**
     * The media stream that you updated.
     */
    MediaStream?: MediaStream;
  }
  export interface UpdateFlowOutputRequest {
    /**
     * The range of IP addresses that should be allowed to initiate output requests to this flow. These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     */
    CidrAllowList?: __listOf__string;
    /**
     * A description of the output. This description appears only on the AWS Elemental MediaConnect console and will not be seen by the end user.
     */
    Description?: __string;
    /**
     * The IP address where you want to send the output.
     */
    Destination?: __string;
    /**
     * The type of key used for the encryption. If no keyType is provided, the service will use the default setting (static-key). Allowable encryption types: static-key.
     */
    Encryption?: UpdateEncryption;
    /**
     * The flow that is associated with the output that you want to update.
     */
    FlowArn: __string;
    /**
     * The maximum latency in milliseconds. This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
     */
    MaxLatency?: __integer;
    /**
     * The media streams that are associated with the output, and the parameters for those associations.
     */
    MediaStreamOutputConfigurations?: __listOfMediaStreamOutputConfigurationRequest;
    /**
     * The minimum latency in milliseconds for SRT-based streams. In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
     */
    MinLatency?: __integer;
    /**
     * The ARN of the output that you want to update.
     */
    OutputArn: __string;
    /**
     * The port to use when content is distributed to this output.
     */
    Port?: __integer;
    /**
     * The protocol to use for the output.
     */
    Protocol?: Protocol;
    /**
     * The remote ID for the Zixi-pull stream.
     */
    RemoteId?: __string;
    /**
     * The port that the flow uses to send outbound requests to initiate connection with the sender.
     */
    SenderControlPort?: __integer;
    /**
     * The IP address that the flow communicates with to initiate connection with the sender.
     */
    SenderIpAddress?: __string;
    /**
     * The smoothing latency in milliseconds for RIST, RTP, and RTP-FEC streams.
     */
    SmoothingLatency?: __integer;
    /**
     * The stream ID that you want to use for this transport. This parameter applies only to Zixi and SRT caller-based streams.
     */
    StreamId?: __string;
    /**
     * The name of the VPC interface attachment to use for this output.
     */
    VpcInterfaceAttachment?: VpcInterfaceAttachment;
  }
  export interface UpdateFlowOutputResponse {
    /**
     * The ARN of the flow that is associated with the updated output.
     */
    FlowArn?: __string;
    /**
     * The new settings of the output that you updated.
     */
    Output?: Output;
  }
  export interface UpdateFlowRequest {
    /**
     * The flow that you want to update.
     */
    FlowArn: __string;
    SourceFailoverConfig?: UpdateFailoverConfig;
    Maintenance?: UpdateMaintenance;
  }
  export interface UpdateFlowResponse {
    Flow?: Flow;
  }
  export interface UpdateFlowSourceRequest {
    /**
     * The type of encryption used on the content ingested from this source. Allowable encryption types: static-key.
     */
    Decryption?: UpdateEncryption;
    /**
     * A description for the source. This value is not used or seen outside of the current AWS Elemental MediaConnect account.
     */
    Description?: __string;
    /**
     * The ARN of the entitlement that allows you to subscribe to this flow. The entitlement is set by the flow originator, and the ARN is generated as part of the originator's flow.
     */
    EntitlementArn?: __string;
    /**
     * The flow that is associated with the source that you want to update.
     */
    FlowArn: __string;
    /**
     * The port that the flow will be listening on for incoming content.
     */
    IngestPort?: __integer;
    /**
     * The smoothing max bitrate (in bps) for RIST, RTP, and RTP-FEC streams.
     */
    MaxBitrate?: __integer;
    /**
     * The maximum latency in milliseconds. This parameter applies only to RIST-based, Zixi-based, and Fujitsu-based streams.
     */
    MaxLatency?: __integer;
    /**
     * The size of the buffer (in milliseconds) to use to sync incoming source data.
     */
    MaxSyncBuffer?: __integer;
    /**
     * The media streams that are associated with the source, and the parameters for those associations.
     */
    MediaStreamSourceConfigurations?: __listOfMediaStreamSourceConfigurationRequest;
    /**
     * The minimum latency in milliseconds for SRT-based streams. In streams that use the SRT protocol, this value that you set on your MediaConnect source or output represents the minimal potential latency of that connection. The latency of the stream is set to the highest number between the sender’s minimum latency and the receiver’s minimum latency.
     */
    MinLatency?: __integer;
    /**
     * The protocol that is used by the source.
     */
    Protocol?: Protocol;
    /**
     * The port that the flow uses to send outbound requests to initiate connection with the sender.
     */
    SenderControlPort?: __integer;
    /**
     * The IP address that the flow communicates with to initiate connection with the sender.
     */
    SenderIpAddress?: __string;
    /**
     * The ARN of the source that you want to update.
     */
    SourceArn: __string;
    /**
     * Source IP or domain name for SRT-caller protocol.
     */
    SourceListenerAddress?: __string;
    /**
     * Source port for SRT-caller protocol.
     */
    SourceListenerPort?: __integer;
    /**
     * The stream ID that you want to use for this transport. This parameter applies only to Zixi and SRT caller-based streams.
     */
    StreamId?: __string;
    /**
     * The name of the VPC interface to use for this source.
     */
    VpcInterfaceName?: __string;
    /**
     * The range of IP addresses that should be allowed to contribute content to your source. These IP addresses should be in the form of a Classless Inter-Domain Routing (CIDR) block; for example, 10.0.0.0/16.
     */
    WhitelistCidr?: __string;
    /**
     * The source configuration for cloud flows receiving a stream from a bridge.
     */
    GatewayBridgeSource?: UpdateGatewayBridgeSourceRequest;
  }
  export interface UpdateFlowSourceResponse {
    /**
     * The ARN of the flow that you want to update.
     */
    FlowArn?: __string;
    /**
     * The settings for the source of the flow.
     */
    Source?: Source;
  }
  export interface UpdateGatewayBridgeSourceRequest {
    /**
     * The ARN of the bridge feeding this flow.
     */
    BridgeArn?: __string;
    /**
     * The name of the VPC interface attachment to use for this bridge source.
     */
    VpcInterfaceAttachment?: VpcInterfaceAttachment;
  }
  export interface UpdateGatewayInstanceRequest {
    /**
     * The availability of the instance to host new bridges. The bridgePlacement property can be LOCKED or AVAILABLE. If it is LOCKED, no new bridges can be deployed to this instance. If it is AVAILABLE, new bridges can be added to this instance.
     */
    BridgePlacement?: BridgePlacement;
    /**
     * The Amazon Resource Name (ARN) of the instance that you want to update.
     */
    GatewayInstanceArn: __string;
  }
  export interface UpdateGatewayInstanceResponse {
    /**
     * The availability of the instance to host new bridges. The bridgePlacement property can be LOCKED or AVAILABLE. If it is LOCKED, no new bridges can be deployed to this instance. If it is AVAILABLE, new bridges can be added to this instance.
     */
    BridgePlacement?: BridgePlacement;
    /**
     * The Amazon Resource Name (ARN) of the instance.
     */
    GatewayInstanceArn?: __string;
  }
  export interface UpdateIngressGatewayBridgeRequest {
    /**
     * The maximum expected bitrate (in bps).
     */
    MaxBitrate?: __integer;
    /**
     * The maximum number of expected outputs.
     */
    MaxOutputs?: __integer;
  }
  export interface UpdateMaintenance {
    /**
     * A day of a week when the maintenance will happen. use Monday/Tuesday/Wednesday/Thursday/Friday/Saturday/Sunday.
     */
    MaintenanceDay?: MaintenanceDay;
    /**
     * A scheduled date in ISO UTC format when the maintenance will happen. Use YYYY-MM-DD format. Example: 2021-01-30.
     */
    MaintenanceScheduledDate?: __string;
    /**
     * UTC time when the maintenance will happen. Use 24-hour HH:MM format. Minutes must be 00. Example: 13:00. The default value is 02:00.
     */
    MaintenanceStartHour?: __string;
  }
  export interface VpcInterface {
    /**
     * Immutable and has to be a unique against other VpcInterfaces in this Flow.
     */
    Name: __string;
    /**
     * IDs of the network interfaces created in customer's account by MediaConnect.
     */
    NetworkInterfaceIds: __listOf__string;
    /**
     * The type of network interface.
     */
    NetworkInterfaceType: NetworkInterfaceType;
    /**
     * Role Arn MediaConnect can assumes to create ENIs in customer's account
     */
    RoleArn: __string;
    /**
     * Security Group IDs to be used on ENI.
     */
    SecurityGroupIds: __listOf__string;
    /**
     * Subnet must be in the AZ of the Flow
     */
    SubnetId: __string;
  }
  export interface VpcInterfaceAttachment {
    /**
     * The name of the VPC interface to use for this resource.
     */
    VpcInterfaceName?: __string;
  }
  export interface VpcInterfaceRequest {
    /**
     * The name of the VPC Interface. This value must be unique within the current flow.
     */
    Name: __string;
    /**
     * The type of network interface. If this value is not included in the request, MediaConnect uses ENA as the networkInterfaceType.
     */
    NetworkInterfaceType?: NetworkInterfaceType;
    /**
     * Role Arn MediaConnect can assumes to create ENIs in customer's account
     */
    RoleArn: __string;
    /**
     * Security Group IDs to be used on ENI.
     */
    SecurityGroupIds: __listOf__string;
    /**
     * Subnet must be in the AZ of the Flow
     */
    SubnetId: __string;
  }
  export type __boolean = boolean;
  export type __double = number;
  export type __integer = number;
  export type __listOfAddBridgeOutputRequest = AddBridgeOutputRequest[];
  export type __listOfAddBridgeSourceRequest = AddBridgeSourceRequest[];
  export type __listOfAddMediaStreamRequest = AddMediaStreamRequest[];
  export type __listOfAddOutputRequest = AddOutputRequest[];
  export type __listOfBridgeOutput = BridgeOutput[];
  export type __listOfBridgeSource = BridgeSource[];
  export type __listOfDestinationConfiguration = DestinationConfiguration[];
  export type __listOfDestinationConfigurationRequest = DestinationConfigurationRequest[];
  export type __listOfEntitlement = Entitlement[];
  export type __listOfGatewayNetwork = GatewayNetwork[];
  export type __listOfGrantEntitlementRequest = GrantEntitlementRequest[];
  export type __listOfInputConfiguration = InputConfiguration[];
  export type __listOfInputConfigurationRequest = InputConfigurationRequest[];
  export type __listOfListedBridge = ListedBridge[];
  export type __listOfListedEntitlement = ListedEntitlement[];
  export type __listOfListedFlow = ListedFlow[];
  export type __listOfListedGateway = ListedGateway[];
  export type __listOfListedGatewayInstance = ListedGatewayInstance[];
  export type __listOfMediaStream = MediaStream[];
  export type __listOfMediaStreamOutputConfiguration = MediaStreamOutputConfiguration[];
  export type __listOfMediaStreamOutputConfigurationRequest = MediaStreamOutputConfigurationRequest[];
  export type __listOfMediaStreamSourceConfiguration = MediaStreamSourceConfiguration[];
  export type __listOfMediaStreamSourceConfigurationRequest = MediaStreamSourceConfigurationRequest[];
  export type __listOfMessageDetail = MessageDetail[];
  export type __listOfOffering = Offering[];
  export type __listOfOutput = Output[];
  export type __listOfReservation = Reservation[];
  export type __listOfSetSourceRequest = SetSourceRequest[];
  export type __listOfSource = Source[];
  export type __listOfVpcInterface = VpcInterface[];
  export type __listOfVpcInterfaceRequest = VpcInterfaceRequest[];
  export type __listOf__integer = __integer[];
  export type __listOf__string = __string[];
  export type __mapOf__string = {[key: string]: __string};
  export type __string = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-11-14"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MediaConnect client.
   */
  export import Types = MediaConnect;
}
export = MediaConnect;
