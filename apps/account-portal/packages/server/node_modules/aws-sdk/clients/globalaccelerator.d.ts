import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class GlobalAccelerator extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: GlobalAccelerator.Types.ClientConfiguration)
  config: Config & GlobalAccelerator.Types.ClientConfiguration;
  /**
   * Associate a virtual private cloud (VPC) subnet endpoint with your custom routing accelerator. The listener port range must be large enough to support the number of IP addresses that can be specified in your subnet. The number of ports required is: subnet size times the number of ports per destination EC2 instances. For example, a subnet defined as /24 requires a listener port range of at least 255 ports.  Note: You must have enough remaining listener ports available to map to the subnet ports, or the call will fail with a LimitExceededException. By default, all destinations in a subnet in a custom routing accelerator cannot receive traffic. To enable all destinations to receive traffic, or to specify individual port mappings that can receive traffic, see the  AllowCustomRoutingTraffic operation.
   */
  addCustomRoutingEndpoints(params: GlobalAccelerator.Types.AddCustomRoutingEndpointsRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.AddCustomRoutingEndpointsResponse) => void): Request<GlobalAccelerator.Types.AddCustomRoutingEndpointsResponse, AWSError>;
  /**
   * Associate a virtual private cloud (VPC) subnet endpoint with your custom routing accelerator. The listener port range must be large enough to support the number of IP addresses that can be specified in your subnet. The number of ports required is: subnet size times the number of ports per destination EC2 instances. For example, a subnet defined as /24 requires a listener port range of at least 255 ports.  Note: You must have enough remaining listener ports available to map to the subnet ports, or the call will fail with a LimitExceededException. By default, all destinations in a subnet in a custom routing accelerator cannot receive traffic. To enable all destinations to receive traffic, or to specify individual port mappings that can receive traffic, see the  AllowCustomRoutingTraffic operation.
   */
  addCustomRoutingEndpoints(callback?: (err: AWSError, data: GlobalAccelerator.Types.AddCustomRoutingEndpointsResponse) => void): Request<GlobalAccelerator.Types.AddCustomRoutingEndpointsResponse, AWSError>;
  /**
   * Add endpoints to an endpoint group. The AddEndpoints API operation is the recommended option for adding endpoints. The alternative options are to add endpoints when you create an endpoint group (with the CreateEndpointGroup API) or when you update an endpoint group (with the UpdateEndpointGroup API).  There are two advantages to using AddEndpoints to add endpoints in Global Accelerator:   It's faster, because Global Accelerator only has to resolve the new endpoints that you're adding, rather than resolving new and existing endpoints.   It's more convenient, because you don't need to specify the current endpoints that are already in the endpoint group, in addition to the new endpoints that you want to add.   For information about endpoint types and requirements for endpoints that you can add to Global Accelerator, see  Endpoints for standard accelerators in the Global Accelerator Developer Guide.
   */
  addEndpoints(params: GlobalAccelerator.Types.AddEndpointsRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.AddEndpointsResponse) => void): Request<GlobalAccelerator.Types.AddEndpointsResponse, AWSError>;
  /**
   * Add endpoints to an endpoint group. The AddEndpoints API operation is the recommended option for adding endpoints. The alternative options are to add endpoints when you create an endpoint group (with the CreateEndpointGroup API) or when you update an endpoint group (with the UpdateEndpointGroup API).  There are two advantages to using AddEndpoints to add endpoints in Global Accelerator:   It's faster, because Global Accelerator only has to resolve the new endpoints that you're adding, rather than resolving new and existing endpoints.   It's more convenient, because you don't need to specify the current endpoints that are already in the endpoint group, in addition to the new endpoints that you want to add.   For information about endpoint types and requirements for endpoints that you can add to Global Accelerator, see  Endpoints for standard accelerators in the Global Accelerator Developer Guide.
   */
  addEndpoints(callback?: (err: AWSError, data: GlobalAccelerator.Types.AddEndpointsResponse) => void): Request<GlobalAccelerator.Types.AddEndpointsResponse, AWSError>;
  /**
   * Advertises an IPv4 address range that is provisioned for use with your Amazon Web Services resources through bring your own IP addresses (BYOIP). It can take a few minutes before traffic to the specified addresses starts routing to Amazon Web Services because of propagation delays.  To stop advertising the BYOIP address range, use  WithdrawByoipCidr. For more information, see Bring your own IP addresses (BYOIP) in the Global Accelerator Developer Guide.
   */
  advertiseByoipCidr(params: GlobalAccelerator.Types.AdvertiseByoipCidrRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.AdvertiseByoipCidrResponse) => void): Request<GlobalAccelerator.Types.AdvertiseByoipCidrResponse, AWSError>;
  /**
   * Advertises an IPv4 address range that is provisioned for use with your Amazon Web Services resources through bring your own IP addresses (BYOIP). It can take a few minutes before traffic to the specified addresses starts routing to Amazon Web Services because of propagation delays.  To stop advertising the BYOIP address range, use  WithdrawByoipCidr. For more information, see Bring your own IP addresses (BYOIP) in the Global Accelerator Developer Guide.
   */
  advertiseByoipCidr(callback?: (err: AWSError, data: GlobalAccelerator.Types.AdvertiseByoipCidrResponse) => void): Request<GlobalAccelerator.Types.AdvertiseByoipCidrResponse, AWSError>;
  /**
   * Specify the Amazon EC2 instance (destination) IP addresses and ports for a VPC subnet endpoint that can receive traffic for a custom routing accelerator. You can allow traffic to all destinations in the subnet endpoint, or allow traffic to a specified list of destination IP addresses and ports in the subnet. Note that you cannot specify IP addresses or ports outside of the range that you configured for the endpoint group. After you make changes, you can verify that the updates are complete by checking the status of your accelerator: the status changes from IN_PROGRESS to DEPLOYED.
   */
  allowCustomRoutingTraffic(params: GlobalAccelerator.Types.AllowCustomRoutingTrafficRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Specify the Amazon EC2 instance (destination) IP addresses and ports for a VPC subnet endpoint that can receive traffic for a custom routing accelerator. You can allow traffic to all destinations in the subnet endpoint, or allow traffic to a specified list of destination IP addresses and ports in the subnet. Note that you cannot specify IP addresses or ports outside of the range that you configured for the endpoint group. After you make changes, you can verify that the updates are complete by checking the status of your accelerator: the status changes from IN_PROGRESS to DEPLOYED.
   */
  allowCustomRoutingTraffic(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Create an accelerator. An accelerator includes one or more listeners that process inbound connections and direct traffic to one or more endpoint groups, each of which includes endpoints, such as Network Load Balancers.   Global Accelerator is a global service that supports endpoints in multiple Amazon Web Services Regions but you must specify the US West (Oregon) Region to create, update, or otherwise work with accelerators. That is, for example, specify --region us-west-2 on Amazon Web Services CLI commands. 
   */
  createAccelerator(params: GlobalAccelerator.Types.CreateAcceleratorRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateAcceleratorResponse) => void): Request<GlobalAccelerator.Types.CreateAcceleratorResponse, AWSError>;
  /**
   * Create an accelerator. An accelerator includes one or more listeners that process inbound connections and direct traffic to one or more endpoint groups, each of which includes endpoints, such as Network Load Balancers.   Global Accelerator is a global service that supports endpoints in multiple Amazon Web Services Regions but you must specify the US West (Oregon) Region to create, update, or otherwise work with accelerators. That is, for example, specify --region us-west-2 on Amazon Web Services CLI commands. 
   */
  createAccelerator(callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateAcceleratorResponse) => void): Request<GlobalAccelerator.Types.CreateAcceleratorResponse, AWSError>;
  /**
   * Create a custom routing accelerator. A custom routing accelerator directs traffic to one of possibly thousands of Amazon EC2 instance destinations running in a single or multiple virtual private clouds (VPC) subnet endpoints. Be aware that, by default, all destination EC2 instances in a VPC subnet endpoint cannot receive traffic. To enable all destinations to receive traffic, or to specify individual port mappings that can receive traffic, see the  AllowCustomRoutingTraffic operation.  Global Accelerator is a global service that supports endpoints in multiple Amazon Web Services Regions but you must specify the US West (Oregon) Region to create, update, or otherwise work with accelerators. That is, for example, specify --region us-west-2 on Amazon Web Services CLI commands. 
   */
  createCustomRoutingAccelerator(params: GlobalAccelerator.Types.CreateCustomRoutingAcceleratorRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateCustomRoutingAcceleratorResponse) => void): Request<GlobalAccelerator.Types.CreateCustomRoutingAcceleratorResponse, AWSError>;
  /**
   * Create a custom routing accelerator. A custom routing accelerator directs traffic to one of possibly thousands of Amazon EC2 instance destinations running in a single or multiple virtual private clouds (VPC) subnet endpoints. Be aware that, by default, all destination EC2 instances in a VPC subnet endpoint cannot receive traffic. To enable all destinations to receive traffic, or to specify individual port mappings that can receive traffic, see the  AllowCustomRoutingTraffic operation.  Global Accelerator is a global service that supports endpoints in multiple Amazon Web Services Regions but you must specify the US West (Oregon) Region to create, update, or otherwise work with accelerators. That is, for example, specify --region us-west-2 on Amazon Web Services CLI commands. 
   */
  createCustomRoutingAccelerator(callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateCustomRoutingAcceleratorResponse) => void): Request<GlobalAccelerator.Types.CreateCustomRoutingAcceleratorResponse, AWSError>;
  /**
   * Create an endpoint group for the specified listener for a custom routing accelerator. An endpoint group is a collection of endpoints in one Amazon Web Services Region. 
   */
  createCustomRoutingEndpointGroup(params: GlobalAccelerator.Types.CreateCustomRoutingEndpointGroupRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateCustomRoutingEndpointGroupResponse) => void): Request<GlobalAccelerator.Types.CreateCustomRoutingEndpointGroupResponse, AWSError>;
  /**
   * Create an endpoint group for the specified listener for a custom routing accelerator. An endpoint group is a collection of endpoints in one Amazon Web Services Region. 
   */
  createCustomRoutingEndpointGroup(callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateCustomRoutingEndpointGroupResponse) => void): Request<GlobalAccelerator.Types.CreateCustomRoutingEndpointGroupResponse, AWSError>;
  /**
   * Create a listener to process inbound connections from clients to a custom routing accelerator. Connections arrive to assigned static IP addresses on the port range that you specify. 
   */
  createCustomRoutingListener(params: GlobalAccelerator.Types.CreateCustomRoutingListenerRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateCustomRoutingListenerResponse) => void): Request<GlobalAccelerator.Types.CreateCustomRoutingListenerResponse, AWSError>;
  /**
   * Create a listener to process inbound connections from clients to a custom routing accelerator. Connections arrive to assigned static IP addresses on the port range that you specify. 
   */
  createCustomRoutingListener(callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateCustomRoutingListenerResponse) => void): Request<GlobalAccelerator.Types.CreateCustomRoutingListenerResponse, AWSError>;
  /**
   * Create an endpoint group for the specified listener. An endpoint group is a collection of endpoints in one Amazon Web Services Region. A resource must be valid and active when you add it as an endpoint. For more information about endpoint types and requirements for endpoints that you can add to Global Accelerator, see  Endpoints for standard accelerators in the Global Accelerator Developer Guide.
   */
  createEndpointGroup(params: GlobalAccelerator.Types.CreateEndpointGroupRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateEndpointGroupResponse) => void): Request<GlobalAccelerator.Types.CreateEndpointGroupResponse, AWSError>;
  /**
   * Create an endpoint group for the specified listener. An endpoint group is a collection of endpoints in one Amazon Web Services Region. A resource must be valid and active when you add it as an endpoint. For more information about endpoint types and requirements for endpoints that you can add to Global Accelerator, see  Endpoints for standard accelerators in the Global Accelerator Developer Guide.
   */
  createEndpointGroup(callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateEndpointGroupResponse) => void): Request<GlobalAccelerator.Types.CreateEndpointGroupResponse, AWSError>;
  /**
   * Create a listener to process inbound connections from clients to an accelerator. Connections arrive to assigned static IP addresses on a port, port range, or list of port ranges that you specify. 
   */
  createListener(params: GlobalAccelerator.Types.CreateListenerRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateListenerResponse) => void): Request<GlobalAccelerator.Types.CreateListenerResponse, AWSError>;
  /**
   * Create a listener to process inbound connections from clients to an accelerator. Connections arrive to assigned static IP addresses on a port, port range, or list of port ranges that you specify. 
   */
  createListener(callback?: (err: AWSError, data: GlobalAccelerator.Types.CreateListenerResponse) => void): Request<GlobalAccelerator.Types.CreateListenerResponse, AWSError>;
  /**
   * Delete an accelerator. Before you can delete an accelerator, you must disable it and remove all dependent resources (listeners and endpoint groups). To disable the accelerator, update the accelerator to set Enabled to false.  When you create an accelerator, by default, Global Accelerator provides you with a set of two static IP addresses. Alternatively, you can bring your own IP address ranges to Global Accelerator and assign IP addresses from those ranges.  The IP addresses are assigned to your accelerator for as long as it exists, even if you disable the accelerator and it no longer accepts or routes traffic. However, when you delete an accelerator, you lose the static IP addresses that are assigned to the accelerator, so you can no longer route traffic by using them. As a best practice, ensure that you have permissions in place to avoid inadvertently deleting accelerators. You can use IAM policies with Global Accelerator to limit the users who have permissions to delete an accelerator. For more information, see Identity and access management in the Global Accelerator Developer Guide. 
   */
  deleteAccelerator(params: GlobalAccelerator.Types.DeleteAcceleratorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an accelerator. Before you can delete an accelerator, you must disable it and remove all dependent resources (listeners and endpoint groups). To disable the accelerator, update the accelerator to set Enabled to false.  When you create an accelerator, by default, Global Accelerator provides you with a set of two static IP addresses. Alternatively, you can bring your own IP address ranges to Global Accelerator and assign IP addresses from those ranges.  The IP addresses are assigned to your accelerator for as long as it exists, even if you disable the accelerator and it no longer accepts or routes traffic. However, when you delete an accelerator, you lose the static IP addresses that are assigned to the accelerator, so you can no longer route traffic by using them. As a best practice, ensure that you have permissions in place to avoid inadvertently deleting accelerators. You can use IAM policies with Global Accelerator to limit the users who have permissions to delete an accelerator. For more information, see Identity and access management in the Global Accelerator Developer Guide. 
   */
  deleteAccelerator(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a custom routing accelerator. Before you can delete an accelerator, you must disable it and remove all dependent resources (listeners and endpoint groups). To disable the accelerator, update the accelerator to set Enabled to false.  When you create a custom routing accelerator, by default, Global Accelerator provides you with a set of two static IP addresses.  The IP addresses are assigned to your accelerator for as long as it exists, even if you disable the accelerator and it no longer accepts or routes traffic. However, when you delete an accelerator, you lose the static IP addresses that are assigned to the accelerator, so you can no longer route traffic by using them. As a best practice, ensure that you have permissions in place to avoid inadvertently deleting accelerators. You can use IAM policies with Global Accelerator to limit the users who have permissions to delete an accelerator. For more information, see Identity and access management in the Global Accelerator Developer Guide. 
   */
  deleteCustomRoutingAccelerator(params: GlobalAccelerator.Types.DeleteCustomRoutingAcceleratorRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a custom routing accelerator. Before you can delete an accelerator, you must disable it and remove all dependent resources (listeners and endpoint groups). To disable the accelerator, update the accelerator to set Enabled to false.  When you create a custom routing accelerator, by default, Global Accelerator provides you with a set of two static IP addresses.  The IP addresses are assigned to your accelerator for as long as it exists, even if you disable the accelerator and it no longer accepts or routes traffic. However, when you delete an accelerator, you lose the static IP addresses that are assigned to the accelerator, so you can no longer route traffic by using them. As a best practice, ensure that you have permissions in place to avoid inadvertently deleting accelerators. You can use IAM policies with Global Accelerator to limit the users who have permissions to delete an accelerator. For more information, see Identity and access management in the Global Accelerator Developer Guide. 
   */
  deleteCustomRoutingAccelerator(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an endpoint group from a listener for a custom routing accelerator.
   */
  deleteCustomRoutingEndpointGroup(params: GlobalAccelerator.Types.DeleteCustomRoutingEndpointGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an endpoint group from a listener for a custom routing accelerator.
   */
  deleteCustomRoutingEndpointGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a listener for a custom routing accelerator.
   */
  deleteCustomRoutingListener(params: GlobalAccelerator.Types.DeleteCustomRoutingListenerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a listener for a custom routing accelerator.
   */
  deleteCustomRoutingListener(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an endpoint group from a listener.
   */
  deleteEndpointGroup(params: GlobalAccelerator.Types.DeleteEndpointGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an endpoint group from a listener.
   */
  deleteEndpointGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a listener from an accelerator.
   */
  deleteListener(params: GlobalAccelerator.Types.DeleteListenerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a listener from an accelerator.
   */
  deleteListener(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Specify the Amazon EC2 instance (destination) IP addresses and ports for a VPC subnet endpoint that cannot receive traffic for a custom routing accelerator. You can deny traffic to all destinations in the VPC endpoint, or deny traffic to a specified list of destination IP addresses and ports. Note that you cannot specify IP addresses or ports outside of the range that you configured for the endpoint group. After you make changes, you can verify that the updates are complete by checking the status of your accelerator: the status changes from IN_PROGRESS to DEPLOYED.
   */
  denyCustomRoutingTraffic(params: GlobalAccelerator.Types.DenyCustomRoutingTrafficRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Specify the Amazon EC2 instance (destination) IP addresses and ports for a VPC subnet endpoint that cannot receive traffic for a custom routing accelerator. You can deny traffic to all destinations in the VPC endpoint, or deny traffic to a specified list of destination IP addresses and ports. Note that you cannot specify IP addresses or ports outside of the range that you configured for the endpoint group. After you make changes, you can verify that the updates are complete by checking the status of your accelerator: the status changes from IN_PROGRESS to DEPLOYED.
   */
  denyCustomRoutingTraffic(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Releases the specified address range that you provisioned to use with your Amazon Web Services resources through bring your own IP addresses (BYOIP) and deletes the corresponding address pool.  Before you can release an address range, you must stop advertising it by using WithdrawByoipCidr and you must not have any accelerators that are using static IP addresses allocated from its address range.  For more information, see Bring your own IP addresses (BYOIP) in the Global Accelerator Developer Guide.
   */
  deprovisionByoipCidr(params: GlobalAccelerator.Types.DeprovisionByoipCidrRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.DeprovisionByoipCidrResponse) => void): Request<GlobalAccelerator.Types.DeprovisionByoipCidrResponse, AWSError>;
  /**
   * Releases the specified address range that you provisioned to use with your Amazon Web Services resources through bring your own IP addresses (BYOIP) and deletes the corresponding address pool.  Before you can release an address range, you must stop advertising it by using WithdrawByoipCidr and you must not have any accelerators that are using static IP addresses allocated from its address range.  For more information, see Bring your own IP addresses (BYOIP) in the Global Accelerator Developer Guide.
   */
  deprovisionByoipCidr(callback?: (err: AWSError, data: GlobalAccelerator.Types.DeprovisionByoipCidrResponse) => void): Request<GlobalAccelerator.Types.DeprovisionByoipCidrResponse, AWSError>;
  /**
   * Describe an accelerator. 
   */
  describeAccelerator(params: GlobalAccelerator.Types.DescribeAcceleratorRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeAcceleratorResponse) => void): Request<GlobalAccelerator.Types.DescribeAcceleratorResponse, AWSError>;
  /**
   * Describe an accelerator. 
   */
  describeAccelerator(callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeAcceleratorResponse) => void): Request<GlobalAccelerator.Types.DescribeAcceleratorResponse, AWSError>;
  /**
   * Describe the attributes of an accelerator. 
   */
  describeAcceleratorAttributes(params: GlobalAccelerator.Types.DescribeAcceleratorAttributesRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeAcceleratorAttributesResponse) => void): Request<GlobalAccelerator.Types.DescribeAcceleratorAttributesResponse, AWSError>;
  /**
   * Describe the attributes of an accelerator. 
   */
  describeAcceleratorAttributes(callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeAcceleratorAttributesResponse) => void): Request<GlobalAccelerator.Types.DescribeAcceleratorAttributesResponse, AWSError>;
  /**
   * Describe a custom routing accelerator. 
   */
  describeCustomRoutingAccelerator(params: GlobalAccelerator.Types.DescribeCustomRoutingAcceleratorRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeCustomRoutingAcceleratorResponse) => void): Request<GlobalAccelerator.Types.DescribeCustomRoutingAcceleratorResponse, AWSError>;
  /**
   * Describe a custom routing accelerator. 
   */
  describeCustomRoutingAccelerator(callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeCustomRoutingAcceleratorResponse) => void): Request<GlobalAccelerator.Types.DescribeCustomRoutingAcceleratorResponse, AWSError>;
  /**
   * Describe the attributes of a custom routing accelerator. 
   */
  describeCustomRoutingAcceleratorAttributes(params: GlobalAccelerator.Types.DescribeCustomRoutingAcceleratorAttributesRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeCustomRoutingAcceleratorAttributesResponse) => void): Request<GlobalAccelerator.Types.DescribeCustomRoutingAcceleratorAttributesResponse, AWSError>;
  /**
   * Describe the attributes of a custom routing accelerator. 
   */
  describeCustomRoutingAcceleratorAttributes(callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeCustomRoutingAcceleratorAttributesResponse) => void): Request<GlobalAccelerator.Types.DescribeCustomRoutingAcceleratorAttributesResponse, AWSError>;
  /**
   * Describe an endpoint group for a custom routing accelerator. 
   */
  describeCustomRoutingEndpointGroup(params: GlobalAccelerator.Types.DescribeCustomRoutingEndpointGroupRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeCustomRoutingEndpointGroupResponse) => void): Request<GlobalAccelerator.Types.DescribeCustomRoutingEndpointGroupResponse, AWSError>;
  /**
   * Describe an endpoint group for a custom routing accelerator. 
   */
  describeCustomRoutingEndpointGroup(callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeCustomRoutingEndpointGroupResponse) => void): Request<GlobalAccelerator.Types.DescribeCustomRoutingEndpointGroupResponse, AWSError>;
  /**
   * The description of a listener for a custom routing accelerator.
   */
  describeCustomRoutingListener(params: GlobalAccelerator.Types.DescribeCustomRoutingListenerRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeCustomRoutingListenerResponse) => void): Request<GlobalAccelerator.Types.DescribeCustomRoutingListenerResponse, AWSError>;
  /**
   * The description of a listener for a custom routing accelerator.
   */
  describeCustomRoutingListener(callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeCustomRoutingListenerResponse) => void): Request<GlobalAccelerator.Types.DescribeCustomRoutingListenerResponse, AWSError>;
  /**
   * Describe an endpoint group. 
   */
  describeEndpointGroup(params: GlobalAccelerator.Types.DescribeEndpointGroupRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeEndpointGroupResponse) => void): Request<GlobalAccelerator.Types.DescribeEndpointGroupResponse, AWSError>;
  /**
   * Describe an endpoint group. 
   */
  describeEndpointGroup(callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeEndpointGroupResponse) => void): Request<GlobalAccelerator.Types.DescribeEndpointGroupResponse, AWSError>;
  /**
   * Describe a listener. 
   */
  describeListener(params: GlobalAccelerator.Types.DescribeListenerRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeListenerResponse) => void): Request<GlobalAccelerator.Types.DescribeListenerResponse, AWSError>;
  /**
   * Describe a listener. 
   */
  describeListener(callback?: (err: AWSError, data: GlobalAccelerator.Types.DescribeListenerResponse) => void): Request<GlobalAccelerator.Types.DescribeListenerResponse, AWSError>;
  /**
   * List the accelerators for an Amazon Web Services account. 
   */
  listAccelerators(params: GlobalAccelerator.Types.ListAcceleratorsRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ListAcceleratorsResponse) => void): Request<GlobalAccelerator.Types.ListAcceleratorsResponse, AWSError>;
  /**
   * List the accelerators for an Amazon Web Services account. 
   */
  listAccelerators(callback?: (err: AWSError, data: GlobalAccelerator.Types.ListAcceleratorsResponse) => void): Request<GlobalAccelerator.Types.ListAcceleratorsResponse, AWSError>;
  /**
   * Lists the IP address ranges that were specified in calls to ProvisionByoipCidr, including the current state and a history of state changes.
   */
  listByoipCidrs(params: GlobalAccelerator.Types.ListByoipCidrsRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ListByoipCidrsResponse) => void): Request<GlobalAccelerator.Types.ListByoipCidrsResponse, AWSError>;
  /**
   * Lists the IP address ranges that were specified in calls to ProvisionByoipCidr, including the current state and a history of state changes.
   */
  listByoipCidrs(callback?: (err: AWSError, data: GlobalAccelerator.Types.ListByoipCidrsResponse) => void): Request<GlobalAccelerator.Types.ListByoipCidrsResponse, AWSError>;
  /**
   * List the custom routing accelerators for an Amazon Web Services account. 
   */
  listCustomRoutingAccelerators(params: GlobalAccelerator.Types.ListCustomRoutingAcceleratorsRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ListCustomRoutingAcceleratorsResponse) => void): Request<GlobalAccelerator.Types.ListCustomRoutingAcceleratorsResponse, AWSError>;
  /**
   * List the custom routing accelerators for an Amazon Web Services account. 
   */
  listCustomRoutingAccelerators(callback?: (err: AWSError, data: GlobalAccelerator.Types.ListCustomRoutingAcceleratorsResponse) => void): Request<GlobalAccelerator.Types.ListCustomRoutingAcceleratorsResponse, AWSError>;
  /**
   * List the endpoint groups that are associated with a listener for a custom routing accelerator. 
   */
  listCustomRoutingEndpointGroups(params: GlobalAccelerator.Types.ListCustomRoutingEndpointGroupsRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ListCustomRoutingEndpointGroupsResponse) => void): Request<GlobalAccelerator.Types.ListCustomRoutingEndpointGroupsResponse, AWSError>;
  /**
   * List the endpoint groups that are associated with a listener for a custom routing accelerator. 
   */
  listCustomRoutingEndpointGroups(callback?: (err: AWSError, data: GlobalAccelerator.Types.ListCustomRoutingEndpointGroupsResponse) => void): Request<GlobalAccelerator.Types.ListCustomRoutingEndpointGroupsResponse, AWSError>;
  /**
   * List the listeners for a custom routing accelerator. 
   */
  listCustomRoutingListeners(params: GlobalAccelerator.Types.ListCustomRoutingListenersRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ListCustomRoutingListenersResponse) => void): Request<GlobalAccelerator.Types.ListCustomRoutingListenersResponse, AWSError>;
  /**
   * List the listeners for a custom routing accelerator. 
   */
  listCustomRoutingListeners(callback?: (err: AWSError, data: GlobalAccelerator.Types.ListCustomRoutingListenersResponse) => void): Request<GlobalAccelerator.Types.ListCustomRoutingListenersResponse, AWSError>;
  /**
   * Provides a complete mapping from the public accelerator IP address and port to destination EC2 instance IP addresses and ports in the virtual public cloud (VPC) subnet endpoint for a custom routing accelerator. For each subnet endpoint that you add, Global Accelerator creates a new static port mapping for the accelerator. The port mappings don't change after Global Accelerator generates them, so you can retrieve and cache the full mapping on your servers.  If you remove a subnet from your accelerator, Global Accelerator removes (reclaims) the port mappings. If you add a subnet to your accelerator, Global Accelerator creates new port mappings (the existing ones don't change). If you add or remove EC2 instances in your subnet, the port mappings don't change, because the mappings are created when you add the subnet to Global Accelerator. The mappings also include a flag for each destination denoting which destination IP addresses and ports are allowed or denied traffic.
   */
  listCustomRoutingPortMappings(params: GlobalAccelerator.Types.ListCustomRoutingPortMappingsRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ListCustomRoutingPortMappingsResponse) => void): Request<GlobalAccelerator.Types.ListCustomRoutingPortMappingsResponse, AWSError>;
  /**
   * Provides a complete mapping from the public accelerator IP address and port to destination EC2 instance IP addresses and ports in the virtual public cloud (VPC) subnet endpoint for a custom routing accelerator. For each subnet endpoint that you add, Global Accelerator creates a new static port mapping for the accelerator. The port mappings don't change after Global Accelerator generates them, so you can retrieve and cache the full mapping on your servers.  If you remove a subnet from your accelerator, Global Accelerator removes (reclaims) the port mappings. If you add a subnet to your accelerator, Global Accelerator creates new port mappings (the existing ones don't change). If you add or remove EC2 instances in your subnet, the port mappings don't change, because the mappings are created when you add the subnet to Global Accelerator. The mappings also include a flag for each destination denoting which destination IP addresses and ports are allowed or denied traffic.
   */
  listCustomRoutingPortMappings(callback?: (err: AWSError, data: GlobalAccelerator.Types.ListCustomRoutingPortMappingsResponse) => void): Request<GlobalAccelerator.Types.ListCustomRoutingPortMappingsResponse, AWSError>;
  /**
   * List the port mappings for a specific EC2 instance (destination) in a VPC subnet endpoint. The response is the mappings for one destination IP address. This is useful when your subnet endpoint has mappings that span multiple custom routing accelerators in your account, or for scenarios where you only want to list the port mappings for a specific destination instance.
   */
  listCustomRoutingPortMappingsByDestination(params: GlobalAccelerator.Types.ListCustomRoutingPortMappingsByDestinationRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ListCustomRoutingPortMappingsByDestinationResponse) => void): Request<GlobalAccelerator.Types.ListCustomRoutingPortMappingsByDestinationResponse, AWSError>;
  /**
   * List the port mappings for a specific EC2 instance (destination) in a VPC subnet endpoint. The response is the mappings for one destination IP address. This is useful when your subnet endpoint has mappings that span multiple custom routing accelerators in your account, or for scenarios where you only want to list the port mappings for a specific destination instance.
   */
  listCustomRoutingPortMappingsByDestination(callback?: (err: AWSError, data: GlobalAccelerator.Types.ListCustomRoutingPortMappingsByDestinationResponse) => void): Request<GlobalAccelerator.Types.ListCustomRoutingPortMappingsByDestinationResponse, AWSError>;
  /**
   * List the endpoint groups that are associated with a listener. 
   */
  listEndpointGroups(params: GlobalAccelerator.Types.ListEndpointGroupsRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ListEndpointGroupsResponse) => void): Request<GlobalAccelerator.Types.ListEndpointGroupsResponse, AWSError>;
  /**
   * List the endpoint groups that are associated with a listener. 
   */
  listEndpointGroups(callback?: (err: AWSError, data: GlobalAccelerator.Types.ListEndpointGroupsResponse) => void): Request<GlobalAccelerator.Types.ListEndpointGroupsResponse, AWSError>;
  /**
   * List the listeners for an accelerator. 
   */
  listListeners(params: GlobalAccelerator.Types.ListListenersRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ListListenersResponse) => void): Request<GlobalAccelerator.Types.ListListenersResponse, AWSError>;
  /**
   * List the listeners for an accelerator. 
   */
  listListeners(callback?: (err: AWSError, data: GlobalAccelerator.Types.ListListenersResponse) => void): Request<GlobalAccelerator.Types.ListListenersResponse, AWSError>;
  /**
   * List all tags for an accelerator.  For more information, see Tagging in Global Accelerator in the Global Accelerator Developer Guide. 
   */
  listTagsForResource(params: GlobalAccelerator.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ListTagsForResourceResponse) => void): Request<GlobalAccelerator.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List all tags for an accelerator.  For more information, see Tagging in Global Accelerator in the Global Accelerator Developer Guide. 
   */
  listTagsForResource(callback?: (err: AWSError, data: GlobalAccelerator.Types.ListTagsForResourceResponse) => void): Request<GlobalAccelerator.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Provisions an IP address range to use with your Amazon Web Services resources through bring your own IP addresses (BYOIP) and creates a corresponding address pool. After the address range is provisioned, it is ready to be advertised using  AdvertiseByoipCidr. For more information, see Bring your own IP addresses (BYOIP) in the Global Accelerator Developer Guide.
   */
  provisionByoipCidr(params: GlobalAccelerator.Types.ProvisionByoipCidrRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.ProvisionByoipCidrResponse) => void): Request<GlobalAccelerator.Types.ProvisionByoipCidrResponse, AWSError>;
  /**
   * Provisions an IP address range to use with your Amazon Web Services resources through bring your own IP addresses (BYOIP) and creates a corresponding address pool. After the address range is provisioned, it is ready to be advertised using  AdvertiseByoipCidr. For more information, see Bring your own IP addresses (BYOIP) in the Global Accelerator Developer Guide.
   */
  provisionByoipCidr(callback?: (err: AWSError, data: GlobalAccelerator.Types.ProvisionByoipCidrResponse) => void): Request<GlobalAccelerator.Types.ProvisionByoipCidrResponse, AWSError>;
  /**
   * Remove endpoints from a custom routing accelerator.
   */
  removeCustomRoutingEndpoints(params: GlobalAccelerator.Types.RemoveCustomRoutingEndpointsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove endpoints from a custom routing accelerator.
   */
  removeCustomRoutingEndpoints(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove endpoints from an endpoint group.  The RemoveEndpoints API operation is the recommended option for removing endpoints. The alternative is to remove endpoints by updating an endpoint group by using the UpdateEndpointGroup API operation. There are two advantages to using AddEndpoints to remove endpoints instead:   It's more convenient, because you only need to specify the endpoints that you want to remove. With the UpdateEndpointGroup API operation, you must specify all of the endpoints in the endpoint group except the ones that you want to remove from the group.   It's faster, because Global Accelerator doesn't need to resolve any endpoints. With the UpdateEndpointGroup API operation, Global Accelerator must resolve all of the endpoints that remain in the group.  
   */
  removeEndpoints(params: GlobalAccelerator.Types.RemoveEndpointsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove endpoints from an endpoint group.  The RemoveEndpoints API operation is the recommended option for removing endpoints. The alternative is to remove endpoints by updating an endpoint group by using the UpdateEndpointGroup API operation. There are two advantages to using AddEndpoints to remove endpoints instead:   It's more convenient, because you only need to specify the endpoints that you want to remove. With the UpdateEndpointGroup API operation, you must specify all of the endpoints in the endpoint group except the ones that you want to remove from the group.   It's faster, because Global Accelerator doesn't need to resolve any endpoints. With the UpdateEndpointGroup API operation, Global Accelerator must resolve all of the endpoints that remain in the group.  
   */
  removeEndpoints(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Add tags to an accelerator resource.  For more information, see Tagging in Global Accelerator in the Global Accelerator Developer Guide. 
   */
  tagResource(params: GlobalAccelerator.Types.TagResourceRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.TagResourceResponse) => void): Request<GlobalAccelerator.Types.TagResourceResponse, AWSError>;
  /**
   * Add tags to an accelerator resource.  For more information, see Tagging in Global Accelerator in the Global Accelerator Developer Guide. 
   */
  tagResource(callback?: (err: AWSError, data: GlobalAccelerator.Types.TagResourceResponse) => void): Request<GlobalAccelerator.Types.TagResourceResponse, AWSError>;
  /**
   * Remove tags from a Global Accelerator resource. When you specify a tag key, the action removes both that key and its associated value. The operation succeeds even if you attempt to remove tags from an accelerator that was already removed. For more information, see Tagging in Global Accelerator in the Global Accelerator Developer Guide.
   */
  untagResource(params: GlobalAccelerator.Types.UntagResourceRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.UntagResourceResponse) => void): Request<GlobalAccelerator.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove tags from a Global Accelerator resource. When you specify a tag key, the action removes both that key and its associated value. The operation succeeds even if you attempt to remove tags from an accelerator that was already removed. For more information, see Tagging in Global Accelerator in the Global Accelerator Developer Guide.
   */
  untagResource(callback?: (err: AWSError, data: GlobalAccelerator.Types.UntagResourceResponse) => void): Request<GlobalAccelerator.Types.UntagResourceResponse, AWSError>;
  /**
   * Update an accelerator to make changes, such as the following:    Change the name of the accelerator.   Disable the accelerator so that it no longer accepts or routes traffic, or so that you can delete it.   Enable the accelerator, if it is disabled.   Change the IP address type to dual-stack if it is IPv4, or change the IP address type to IPv4 if it's dual-stack.   Be aware that static IP addresses remain assigned to your accelerator for as long as it exists, even if you disable the accelerator and it no longer accepts or routes traffic. However, when you delete the accelerator, you lose the static IP addresses that are assigned to it, so you can no longer route traffic by using them.  Global Accelerator is a global service that supports endpoints in multiple Amazon Web Services Regions but you must specify the US West (Oregon) Region to create, update, or otherwise work with accelerators. That is, for example, specify --region us-west-2 on Amazon Web Services CLI commands. 
   */
  updateAccelerator(params: GlobalAccelerator.Types.UpdateAcceleratorRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateAcceleratorResponse) => void): Request<GlobalAccelerator.Types.UpdateAcceleratorResponse, AWSError>;
  /**
   * Update an accelerator to make changes, such as the following:    Change the name of the accelerator.   Disable the accelerator so that it no longer accepts or routes traffic, or so that you can delete it.   Enable the accelerator, if it is disabled.   Change the IP address type to dual-stack if it is IPv4, or change the IP address type to IPv4 if it's dual-stack.   Be aware that static IP addresses remain assigned to your accelerator for as long as it exists, even if you disable the accelerator and it no longer accepts or routes traffic. However, when you delete the accelerator, you lose the static IP addresses that are assigned to it, so you can no longer route traffic by using them.  Global Accelerator is a global service that supports endpoints in multiple Amazon Web Services Regions but you must specify the US West (Oregon) Region to create, update, or otherwise work with accelerators. That is, for example, specify --region us-west-2 on Amazon Web Services CLI commands. 
   */
  updateAccelerator(callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateAcceleratorResponse) => void): Request<GlobalAccelerator.Types.UpdateAcceleratorResponse, AWSError>;
  /**
   * Update the attributes for an accelerator. 
   */
  updateAcceleratorAttributes(params: GlobalAccelerator.Types.UpdateAcceleratorAttributesRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateAcceleratorAttributesResponse) => void): Request<GlobalAccelerator.Types.UpdateAcceleratorAttributesResponse, AWSError>;
  /**
   * Update the attributes for an accelerator. 
   */
  updateAcceleratorAttributes(callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateAcceleratorAttributesResponse) => void): Request<GlobalAccelerator.Types.UpdateAcceleratorAttributesResponse, AWSError>;
  /**
   * Update a custom routing accelerator. 
   */
  updateCustomRoutingAccelerator(params: GlobalAccelerator.Types.UpdateCustomRoutingAcceleratorRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateCustomRoutingAcceleratorResponse) => void): Request<GlobalAccelerator.Types.UpdateCustomRoutingAcceleratorResponse, AWSError>;
  /**
   * Update a custom routing accelerator. 
   */
  updateCustomRoutingAccelerator(callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateCustomRoutingAcceleratorResponse) => void): Request<GlobalAccelerator.Types.UpdateCustomRoutingAcceleratorResponse, AWSError>;
  /**
   * Update the attributes for a custom routing accelerator. 
   */
  updateCustomRoutingAcceleratorAttributes(params: GlobalAccelerator.Types.UpdateCustomRoutingAcceleratorAttributesRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateCustomRoutingAcceleratorAttributesResponse) => void): Request<GlobalAccelerator.Types.UpdateCustomRoutingAcceleratorAttributesResponse, AWSError>;
  /**
   * Update the attributes for a custom routing accelerator. 
   */
  updateCustomRoutingAcceleratorAttributes(callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateCustomRoutingAcceleratorAttributesResponse) => void): Request<GlobalAccelerator.Types.UpdateCustomRoutingAcceleratorAttributesResponse, AWSError>;
  /**
   * Update a listener for a custom routing accelerator. 
   */
  updateCustomRoutingListener(params: GlobalAccelerator.Types.UpdateCustomRoutingListenerRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateCustomRoutingListenerResponse) => void): Request<GlobalAccelerator.Types.UpdateCustomRoutingListenerResponse, AWSError>;
  /**
   * Update a listener for a custom routing accelerator. 
   */
  updateCustomRoutingListener(callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateCustomRoutingListenerResponse) => void): Request<GlobalAccelerator.Types.UpdateCustomRoutingListenerResponse, AWSError>;
  /**
   * Update an endpoint group. A resource must be valid and active when you add it as an endpoint.
   */
  updateEndpointGroup(params: GlobalAccelerator.Types.UpdateEndpointGroupRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateEndpointGroupResponse) => void): Request<GlobalAccelerator.Types.UpdateEndpointGroupResponse, AWSError>;
  /**
   * Update an endpoint group. A resource must be valid and active when you add it as an endpoint.
   */
  updateEndpointGroup(callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateEndpointGroupResponse) => void): Request<GlobalAccelerator.Types.UpdateEndpointGroupResponse, AWSError>;
  /**
   * Update a listener. 
   */
  updateListener(params: GlobalAccelerator.Types.UpdateListenerRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateListenerResponse) => void): Request<GlobalAccelerator.Types.UpdateListenerResponse, AWSError>;
  /**
   * Update a listener. 
   */
  updateListener(callback?: (err: AWSError, data: GlobalAccelerator.Types.UpdateListenerResponse) => void): Request<GlobalAccelerator.Types.UpdateListenerResponse, AWSError>;
  /**
   * Stops advertising an address range that is provisioned as an address pool. You can perform this operation at most once every 10 seconds, even if you specify different address ranges each time. It can take a few minutes before traffic to the specified addresses stops routing to Amazon Web Services because of propagation delays. For more information, see Bring your own IP addresses (BYOIP) in the Global Accelerator Developer Guide.
   */
  withdrawByoipCidr(params: GlobalAccelerator.Types.WithdrawByoipCidrRequest, callback?: (err: AWSError, data: GlobalAccelerator.Types.WithdrawByoipCidrResponse) => void): Request<GlobalAccelerator.Types.WithdrawByoipCidrResponse, AWSError>;
  /**
   * Stops advertising an address range that is provisioned as an address pool. You can perform this operation at most once every 10 seconds, even if you specify different address ranges each time. It can take a few minutes before traffic to the specified addresses stops routing to Amazon Web Services because of propagation delays. For more information, see Bring your own IP addresses (BYOIP) in the Global Accelerator Developer Guide.
   */
  withdrawByoipCidr(callback?: (err: AWSError, data: GlobalAccelerator.Types.WithdrawByoipCidrResponse) => void): Request<GlobalAccelerator.Types.WithdrawByoipCidrResponse, AWSError>;
}
declare namespace GlobalAccelerator {
  export interface Accelerator {
    /**
     * The Amazon Resource Name (ARN) of the accelerator.
     */
    AcceleratorArn?: GenericString;
    /**
     * The name of the accelerator. The name must contain only alphanumeric characters or hyphens (-), and must not begin or end with a hyphen.
     */
    Name?: GenericString;
    /**
     * The IP address type that an accelerator supports. For a standard accelerator, the value can be IPV4 or DUAL_STACK.
     */
    IpAddressType?: IpAddressType;
    /**
     * Indicates whether the accelerator is enabled. The value is true or false. The default value is true.  If the value is set to true, the accelerator cannot be deleted. If set to false, accelerator can be deleted.
     */
    Enabled?: GenericBoolean;
    /**
     * The static IP addresses that Global Accelerator associates with the accelerator.
     */
    IpSets?: IpSets;
    /**
     * The Domain Name System (DNS) name that Global Accelerator creates that points to an accelerator's static IPv4 addresses. The naming convention for the DNS name for an accelerator is the following: A lowercase letter a, followed by a 16-bit random hex string, followed by .awsglobalaccelerator.com. For example: a1234567890abcdef.awsglobalaccelerator.com. If you have a dual-stack accelerator, you also have a second DNS name, DualStackDnsName, that points to both the A record and the AAAA record for all four static addresses for the accelerator: two IPv4 addresses and two IPv6 addresses. For more information about the default DNS name, see  Support for DNS addressing in Global Accelerator in the Global Accelerator Developer Guide.
     */
    DnsName?: GenericString;
    /**
     * Describes the deployment status of the accelerator.
     */
    Status?: AcceleratorStatus;
    /**
     * The date and time that the accelerator was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The date and time that the accelerator was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The Domain Name System (DNS) name that Global Accelerator creates that points to a dual-stack accelerator's four static IP addresses: two IPv4 addresses and two IPv6 addresses. The naming convention for the dual-stack DNS name is the following: A lowercase letter a, followed by a 16-bit random hex string, followed by .dualstack.awsglobalaccelerator.com. For example: a1234567890abcdef.dualstack.awsglobalaccelerator.com. Note: Global Accelerator also assigns a default DNS name, DnsName, to your accelerator that points just to the static IPv4 addresses.  For more information, see  Support for DNS addressing in Global Accelerator in the Global Accelerator Developer Guide.
     */
    DualStackDnsName?: GenericString;
    /**
     * A history of changes that you make to an accelerator in Global Accelerator.
     */
    Events?: AcceleratorEvents;
  }
  export interface AcceleratorAttributes {
    /**
     * Indicates whether flow logs are enabled. The default value is false. If the value is true, FlowLogsS3Bucket and FlowLogsS3Prefix must be specified. For more information, see Flow logs in the Global Accelerator Developer Guide.
     */
    FlowLogsEnabled?: GenericBoolean;
    /**
     * The name of the Amazon S3 bucket for the flow logs. Attribute is required if FlowLogsEnabled is true. The bucket must exist and have a bucket policy that grants Global Accelerator permission to write to the bucket.
     */
    FlowLogsS3Bucket?: GenericString;
    /**
     * The prefix for the location in the Amazon S3 bucket for the flow logs. Attribute is required if FlowLogsEnabled is true. If you specify slash (/) for the S3 bucket prefix, the log file bucket folder structure will include a double slash (//), like the following: s3-bucket_name//AWSLogs/aws_account_id
     */
    FlowLogsS3Prefix?: GenericString;
  }
  export interface AcceleratorEvent {
    /**
     * A string that contains an Event message describing changes or errors when you update an accelerator in Global Accelerator from IPv4 to dual-stack, or dual-stack to IPv4.
     */
    Message?: GenericString;
    /**
     * A timestamp for when you update an accelerator in Global Accelerator from IPv4 to dual-stack, or dual-stack to IPv4.
     */
    Timestamp?: Timestamp;
  }
  export type AcceleratorEvents = AcceleratorEvent[];
  export type AcceleratorStatus = "DEPLOYED"|"IN_PROGRESS"|string;
  export type Accelerators = Accelerator[];
  export interface AddCustomRoutingEndpointsRequest {
    /**
     * The list of endpoint objects to add to a custom routing accelerator.
     */
    EndpointConfigurations: CustomRoutingEndpointConfigurations;
    /**
     * The Amazon Resource Name (ARN) of the endpoint group for the custom routing endpoint.
     */
    EndpointGroupArn: GenericString;
  }
  export interface AddCustomRoutingEndpointsResponse {
    /**
     * The endpoint objects added to the custom routing accelerator.
     */
    EndpointDescriptions?: CustomRoutingEndpointDescriptions;
    /**
     * The Amazon Resource Name (ARN) of the endpoint group for the custom routing endpoint.
     */
    EndpointGroupArn?: GenericString;
  }
  export interface AddEndpointsRequest {
    /**
     * The list of endpoint objects.
     */
    EndpointConfigurations: EndpointConfigurations;
    /**
     * The Amazon Resource Name (ARN) of the endpoint group.
     */
    EndpointGroupArn: GenericString;
  }
  export interface AddEndpointsResponse {
    /**
     * The list of endpoint objects.
     */
    EndpointDescriptions?: EndpointDescriptions;
    /**
     * The Amazon Resource Name (ARN) of the endpoint group.
     */
    EndpointGroupArn?: GenericString;
  }
  export interface AdvertiseByoipCidrRequest {
    /**
     * The address range, in CIDR notation. This must be the exact range that you provisioned. You can't advertise only a portion of the provisioned range.
     */
    Cidr: GenericString;
  }
  export interface AdvertiseByoipCidrResponse {
    /**
     * Information about the address range.
     */
    ByoipCidr?: ByoipCidr;
  }
  export interface AllowCustomRoutingTrafficRequest {
    /**
     * The Amazon Resource Name (ARN) of the endpoint group.
     */
    EndpointGroupArn: GenericString;
    /**
     * An ID for the endpoint. For custom routing accelerators, this is the virtual private cloud (VPC) subnet ID.
     */
    EndpointId: GenericString;
    /**
     * A list of specific Amazon EC2 instance IP addresses (destination addresses) in a subnet that you want to allow to receive traffic. The IP addresses must be a subset of the IP addresses that you specified for the endpoint group.  DestinationAddresses is required if AllowAllTrafficToEndpoint is FALSE or is not specified.
     */
    DestinationAddresses?: DestinationAddresses;
    /**
     * A list of specific Amazon EC2 instance ports (destination ports) that you want to allow to receive traffic.
     */
    DestinationPorts?: DestinationPorts;
    /**
     * Indicates whether all destination IP addresses and ports for a specified VPC subnet endpoint can receive traffic from a custom routing accelerator. The value is TRUE or FALSE.  When set to TRUE, all destinations in the custom routing VPC subnet can receive traffic. Note that you cannot specify destination IP addresses and ports when the value is set to TRUE. When set to FALSE (or not specified), you must specify a list of destination IP addresses that are allowed to receive traffic. A list of ports is optional. If you don't specify a list of ports, the ports that can accept traffic is the same as the ports configured for the endpoint group. The default value is FALSE.
     */
    AllowAllTrafficToEndpoint?: GenericBoolean;
  }
  export interface ByoipCidr {
    /**
     * The address range, in CIDR notation.
     */
    Cidr?: GenericString;
    /**
     * The state of the address pool.
     */
    State?: ByoipCidrState;
    /**
     * A history of status changes for an IP address range that you bring to Global Accelerator through bring your own IP address (BYOIP).
     */
    Events?: ByoipCidrEvents;
  }
  export interface ByoipCidrEvent {
    /**
     * A string that contains an Event message describing changes that you make in the status of an IP address range that you bring to Global Accelerator through bring your own IP address (BYOIP).
     */
    Message?: GenericString;
    /**
     * A timestamp for when you make a status change for an IP address range that you bring to Global Accelerator through bring your own IP address (BYOIP).
     */
    Timestamp?: Timestamp;
  }
  export type ByoipCidrEvents = ByoipCidrEvent[];
  export type ByoipCidrState = "PENDING_PROVISIONING"|"READY"|"PENDING_ADVERTISING"|"ADVERTISING"|"PENDING_WITHDRAWING"|"PENDING_DEPROVISIONING"|"DEPROVISIONED"|"FAILED_PROVISION"|"FAILED_ADVERTISING"|"FAILED_WITHDRAW"|"FAILED_DEPROVISION"|string;
  export type ByoipCidrs = ByoipCidr[];
  export interface CidrAuthorizationContext {
    /**
     * The plain-text authorization message for the prefix and account.
     */
    Message: GenericString;
    /**
     * The signed authorization message for the prefix and account.
     */
    Signature: GenericString;
  }
  export type ClientAffinity = "NONE"|"SOURCE_IP"|string;
  export interface CreateAcceleratorRequest {
    /**
     * The name of the accelerator. The name can have a maximum of 64 characters, must contain only alphanumeric characters, periods (.), or hyphens (-), and must not begin or end with a hyphen or period.
     */
    Name: GenericString;
    /**
     * The IP address type that an accelerator supports. For a standard accelerator, the value can be IPV4 or DUAL_STACK.
     */
    IpAddressType?: IpAddressType;
    /**
     * Optionally, if you've added your own IP address pool to Global Accelerator (BYOIP), you can choose an IPv4 address from your own pool to use for the accelerator's static IPv4 address when you create an accelerator.  After you bring an address range to Amazon Web Services, it appears in your account as an address pool. When you create an accelerator, you can assign one IPv4 address from your range to it. Global Accelerator assigns you a second static IPv4 address from an Amazon IP address range. If you bring two IPv4 address ranges to Amazon Web Services, you can assign one IPv4 address from each range to your accelerator. This restriction is because Global Accelerator assigns each address range to a different network zone, for high availability. You can specify one or two addresses, separated by a space. Do not include the /32 suffix. Note that you can't update IP addresses for an existing accelerator. To change them, you must create a new accelerator with the new addresses. For more information, see Bring your own IP addresses (BYOIP) in the Global Accelerator Developer Guide.
     */
    IpAddresses?: IpAddresses;
    /**
     * Indicates whether an accelerator is enabled. The value is true or false. The default value is true.  If the value is set to true, an accelerator cannot be deleted. If set to false, the accelerator can be deleted.
     */
    Enabled?: GenericBoolean;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency—that is, the uniqueness—of an accelerator.
     */
    IdempotencyToken: IdempotencyToken;
    /**
     * Create tags for an accelerator. For more information, see Tagging in Global Accelerator in the Global Accelerator Developer Guide.
     */
    Tags?: Tags;
  }
  export interface CreateAcceleratorResponse {
    /**
     * The accelerator that is created by specifying a listener and the supported IP address types.
     */
    Accelerator?: Accelerator;
  }
  export interface CreateCustomRoutingAcceleratorRequest {
    /**
     * The name of a custom routing accelerator. The name can have a maximum of 64 characters, must contain only alphanumeric characters or hyphens (-), and must not begin or end with a hyphen.
     */
    Name: GenericString;
    /**
     * The IP address type that an accelerator supports. For a custom routing accelerator, the value must be IPV4.
     */
    IpAddressType?: IpAddressType;
    /**
     * Optionally, if you've added your own IP address pool to Global Accelerator (BYOIP), you can choose an IPv4 address from your own pool to use for the accelerator's static IPv4 address when you create an accelerator.  After you bring an address range to Amazon Web Services, it appears in your account as an address pool. When you create an accelerator, you can assign one IPv4 address from your range to it. Global Accelerator assigns you a second static IPv4 address from an Amazon IP address range. If you bring two IPv4 address ranges to Amazon Web Services, you can assign one IPv4 address from each range to your accelerator. This restriction is because Global Accelerator assigns each address range to a different network zone, for high availability. You can specify one or two addresses, separated by a space. Do not include the /32 suffix. Note that you can't update IP addresses for an existing accelerator. To change them, you must create a new accelerator with the new addresses. For more information, see Bring your own IP addresses (BYOIP) in the Global Accelerator Developer Guide.
     */
    IpAddresses?: IpAddresses;
    /**
     * Indicates whether an accelerator is enabled. The value is true or false. The default value is true.  If the value is set to true, an accelerator cannot be deleted. If set to false, the accelerator can be deleted.
     */
    Enabled?: GenericBoolean;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency—that is, the uniqueness—of the request.
     */
    IdempotencyToken: IdempotencyToken;
    /**
     * Create tags for an accelerator. For more information, see Tagging in Global Accelerator in the Global Accelerator Developer Guide.
     */
    Tags?: Tags;
  }
  export interface CreateCustomRoutingAcceleratorResponse {
    /**
     * The accelerator that is created.
     */
    Accelerator?: CustomRoutingAccelerator;
  }
  export interface CreateCustomRoutingEndpointGroupRequest {
    /**
     * The Amazon Resource Name (ARN) of the listener for a custom routing endpoint.
     */
    ListenerArn: GenericString;
    /**
     * The Amazon Web Services Region where the endpoint group is located. A listener can have only one endpoint group in a specific Region.
     */
    EndpointGroupRegion: GenericString;
    /**
     * Sets the port range and protocol for all endpoints (virtual private cloud subnets) in a custom routing endpoint group to accept client traffic on.
     */
    DestinationConfigurations: CustomRoutingDestinationConfigurations;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency—that is, the uniqueness—of the request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface CreateCustomRoutingEndpointGroupResponse {
    /**
     * The information about the endpoint group created for a custom routing accelerator.
     */
    EndpointGroup?: CustomRoutingEndpointGroup;
  }
  export interface CreateCustomRoutingListenerRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator for a custom routing listener.
     */
    AcceleratorArn: GenericString;
    /**
     * The port range to support for connections from clients to your accelerator. Separately, you set port ranges for endpoints. For more information, see About endpoints for custom routing accelerators.
     */
    PortRanges: PortRanges;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency—that is, the uniqueness—of the request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface CreateCustomRoutingListenerResponse {
    /**
     * The listener that you've created for a custom routing accelerator.
     */
    Listener?: CustomRoutingListener;
  }
  export interface CreateEndpointGroupRequest {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn: GenericString;
    /**
     * The Amazon Web Services Region where the endpoint group is located. A listener can have only one endpoint group in a specific Region.
     */
    EndpointGroupRegion: GenericString;
    /**
     * The list of endpoint objects.
     */
    EndpointConfigurations?: EndpointConfigurations;
    /**
     * The percentage of traffic to send to an Amazon Web Services Region. Additional traffic is distributed to other endpoint groups for this listener.  Use this action to increase (dial up) or decrease (dial down) traffic to a specific Region. The percentage is applied to the traffic that would otherwise have been routed to the Region based on optimal routing. The default value is 100.
     */
    TrafficDialPercentage?: TrafficDialPercentage;
    /**
     * The port that Global Accelerator uses to check the health of endpoints that are part of this endpoint group. The default port is the listener port that this endpoint group is associated with. If listener port is a list of ports, Global Accelerator uses the first port in the list.
     */
    HealthCheckPort?: HealthCheckPort;
    /**
     * The protocol that Global Accelerator uses to check the health of endpoints that are part of this endpoint group. The default value is TCP.
     */
    HealthCheckProtocol?: HealthCheckProtocol;
    /**
     * If the protocol is HTTP/S, then this specifies the path that is the destination for health check targets. The default value is slash (/).
     */
    HealthCheckPath?: HealthCheckPath;
    /**
     * The time—10 seconds or 30 seconds—between each health check for an endpoint. The default value is 30.
     */
    HealthCheckIntervalSeconds?: HealthCheckIntervalSeconds;
    /**
     * The number of consecutive health checks required to set the state of a healthy endpoint to unhealthy, or to set an unhealthy endpoint to healthy. The default value is 3.
     */
    ThresholdCount?: ThresholdCount;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency—that is, the uniqueness—of the request.
     */
    IdempotencyToken: IdempotencyToken;
    /**
     * Override specific listener ports used to route traffic to endpoints that are part of this endpoint group. For example, you can create a port override in which the listener receives user traffic on ports 80 and 443, but your accelerator routes that traffic to ports 1080 and 1443, respectively, on the endpoints. For more information, see  Overriding listener ports in the Global Accelerator Developer Guide.
     */
    PortOverrides?: PortOverrides;
  }
  export interface CreateEndpointGroupResponse {
    /**
     * The information about the endpoint group that was created.
     */
    EndpointGroup?: EndpointGroup;
  }
  export interface CreateListenerRequest {
    /**
     * The Amazon Resource Name (ARN) of your accelerator.
     */
    AcceleratorArn: GenericString;
    /**
     * The list of port ranges to support for connections from clients to your accelerator.
     */
    PortRanges: PortRanges;
    /**
     * The protocol for connections from clients to your accelerator.
     */
    Protocol: Protocol;
    /**
     * Client affinity lets you direct all requests from a user to the same endpoint, if you have stateful applications, regardless of the port and protocol of the client request. Client affinity gives you control over whether to always route each client to the same specific endpoint. Global Accelerator uses a consistent-flow hashing algorithm to choose the optimal endpoint for a connection. If client affinity is NONE, Global Accelerator uses the "five-tuple" (5-tuple) properties—source IP address, source port, destination IP address, destination port, and protocol—to select the hash value, and then chooses the best endpoint. However, with this setting, if someone uses different ports to connect to Global Accelerator, their connections might not be always routed to the same endpoint because the hash value changes.  If you want a given client to always be routed to the same endpoint, set client affinity to SOURCE_IP instead. When you use the SOURCE_IP setting, Global Accelerator uses the "two-tuple" (2-tuple) properties— source (client) IP address and destination IP address—to select the hash value. The default value is NONE.
     */
    ClientAffinity?: ClientAffinity;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency—that is, the uniqueness—of the request.
     */
    IdempotencyToken: IdempotencyToken;
  }
  export interface CreateListenerResponse {
    /**
     * The listener that you've created.
     */
    Listener?: Listener;
  }
  export interface CustomRoutingAccelerator {
    /**
     * The Amazon Resource Name (ARN) of the custom routing accelerator.
     */
    AcceleratorArn?: GenericString;
    /**
     * The name of the accelerator. The name must contain only alphanumeric characters or hyphens (-), and must not begin or end with a hyphen.
     */
    Name?: GenericString;
    /**
     * The IP address type that an accelerator supports. For a custom routing accelerator, the value must be IPV4.
     */
    IpAddressType?: IpAddressType;
    /**
     * Indicates whether the accelerator is enabled. The value is true or false. The default value is true.  If the value is set to true, the accelerator cannot be deleted. If set to false, accelerator can be deleted.
     */
    Enabled?: GenericBoolean;
    /**
     * The static IP addresses that Global Accelerator associates with the accelerator.
     */
    IpSets?: IpSets;
    /**
     * The Domain Name System (DNS) name that Global Accelerator creates that points to an accelerator's static IPv4 addresses.  The naming convention for the DNS name is the following: A lowercase letter a, followed by a 16-bit random hex string, followed by .awsglobalaccelerator.com. For example: a1234567890abcdef.awsglobalaccelerator.com. If you have a dual-stack accelerator, you also have a second DNS name, DualStackDnsName, that points to both the A record and the AAAA record for all four static addresses for the accelerator: two IPv4 addresses and two IPv6 addresses. For more information about the default DNS name, see  Support for DNS addressing in Global Accelerator in the Global Accelerator Developer Guide.
     */
    DnsName?: GenericString;
    /**
     * Describes the deployment status of the accelerator.
     */
    Status?: CustomRoutingAcceleratorStatus;
    /**
     * The date and time that the accelerator was created.
     */
    CreatedTime?: Timestamp;
    /**
     * The date and time that the accelerator was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export interface CustomRoutingAcceleratorAttributes {
    /**
     * Indicates whether flow logs are enabled. The default value is false. If the value is true, FlowLogsS3Bucket and FlowLogsS3Prefix must be specified. For more information, see Flow logs in the Global Accelerator Developer Guide.
     */
    FlowLogsEnabled?: GenericBoolean;
    /**
     * The name of the Amazon S3 bucket for the flow logs. Attribute is required if FlowLogsEnabled is true. The bucket must exist and have a bucket policy that grants Global Accelerator permission to write to the bucket.
     */
    FlowLogsS3Bucket?: GenericString;
    /**
     * The prefix for the location in the Amazon S3 bucket for the flow logs. Attribute is required if FlowLogsEnabled is true. If you don’t specify a prefix, the flow logs are stored in the root of the bucket. If you specify slash (/) for the S3 bucket prefix, the log file bucket folder structure will include a double slash (//), like the following: DOC-EXAMPLE-BUCKET//AWSLogs/aws_account_id
     */
    FlowLogsS3Prefix?: GenericString;
  }
  export type CustomRoutingAcceleratorStatus = "DEPLOYED"|"IN_PROGRESS"|string;
  export type CustomRoutingAccelerators = CustomRoutingAccelerator[];
  export interface CustomRoutingDestinationConfiguration {
    /**
     * The first port, inclusive, in the range of ports for the endpoint group that is associated with a custom routing accelerator.
     */
    FromPort: PortNumber;
    /**
     * The last port, inclusive, in the range of ports for the endpoint group that is associated with a custom routing accelerator.
     */
    ToPort: PortNumber;
    /**
     * The protocol for the endpoint group that is associated with a custom routing accelerator. The protocol can be either TCP or UDP.
     */
    Protocols: CustomRoutingProtocols;
  }
  export type CustomRoutingDestinationConfigurations = CustomRoutingDestinationConfiguration[];
  export interface CustomRoutingDestinationDescription {
    /**
     * The first port, inclusive, in the range of ports for the endpoint group that is associated with a custom routing accelerator.
     */
    FromPort?: PortNumber;
    /**
     * The last port, inclusive, in the range of ports for the endpoint group that is associated with a custom routing accelerator.
     */
    ToPort?: PortNumber;
    /**
     * The protocol for the endpoint group that is associated with a custom routing accelerator. The protocol can be either TCP or UDP.
     */
    Protocols?: Protocols;
  }
  export type CustomRoutingDestinationDescriptions = CustomRoutingDestinationDescription[];
  export type CustomRoutingDestinationTrafficState = "ALLOW"|"DENY"|string;
  export interface CustomRoutingEndpointConfiguration {
    /**
     * An ID for the endpoint. For custom routing accelerators, this is the virtual private cloud (VPC) subnet ID. 
     */
    EndpointId?: GenericString;
  }
  export type CustomRoutingEndpointConfigurations = CustomRoutingEndpointConfiguration[];
  export interface CustomRoutingEndpointDescription {
    /**
     * An ID for the endpoint. For custom routing accelerators, this is the virtual private cloud (VPC) subnet ID. 
     */
    EndpointId?: GenericString;
  }
  export type CustomRoutingEndpointDescriptions = CustomRoutingEndpointDescription[];
  export interface CustomRoutingEndpointGroup {
    /**
     * The Amazon Resource Name (ARN) of the endpoint group.
     */
    EndpointGroupArn?: GenericString;
    /**
     * The Amazon Web Services Region where the endpoint group is located.
     */
    EndpointGroupRegion?: GenericString;
    /**
     * For a custom routing accelerator, describes the port range and protocol for all endpoints (virtual private cloud subnets) in an endpoint group to accept client traffic on.
     */
    DestinationDescriptions?: CustomRoutingDestinationDescriptions;
    /**
     * For a custom routing accelerator, describes the endpoints (virtual private cloud subnets) in an endpoint group to accept client traffic on.
     */
    EndpointDescriptions?: CustomRoutingEndpointDescriptions;
  }
  export type CustomRoutingEndpointGroups = CustomRoutingEndpointGroup[];
  export interface CustomRoutingListener {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn?: GenericString;
    /**
     * The port range to support for connections from clients to your accelerator. Separately, you set port ranges for endpoints. For more information, see About endpoints for custom routing accelerators.
     */
    PortRanges?: PortRanges;
  }
  export type CustomRoutingListeners = CustomRoutingListener[];
  export type CustomRoutingProtocol = "TCP"|"UDP"|string;
  export type CustomRoutingProtocols = CustomRoutingProtocol[];
  export interface DeleteAcceleratorRequest {
    /**
     * The Amazon Resource Name (ARN) of an accelerator.
     */
    AcceleratorArn: GenericString;
  }
  export interface DeleteCustomRoutingAcceleratorRequest {
    /**
     * The Amazon Resource Name (ARN) of the custom routing accelerator to delete.
     */
    AcceleratorArn: GenericString;
  }
  export interface DeleteCustomRoutingEndpointGroupRequest {
    /**
     * The Amazon Resource Name (ARN) of the endpoint group to delete.
     */
    EndpointGroupArn: GenericString;
  }
  export interface DeleteCustomRoutingListenerRequest {
    /**
     * The Amazon Resource Name (ARN) of the listener to delete.
     */
    ListenerArn: GenericString;
  }
  export interface DeleteEndpointGroupRequest {
    /**
     * The Amazon Resource Name (ARN) of the endpoint group to delete.
     */
    EndpointGroupArn: GenericString;
  }
  export interface DeleteListenerRequest {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn: GenericString;
  }
  export interface DenyCustomRoutingTrafficRequest {
    /**
     * The Amazon Resource Name (ARN) of the endpoint group.
     */
    EndpointGroupArn: GenericString;
    /**
     * An ID for the endpoint. For custom routing accelerators, this is the virtual private cloud (VPC) subnet ID.
     */
    EndpointId: GenericString;
    /**
     * A list of specific Amazon EC2 instance IP addresses (destination addresses) in a subnet that you want to prevent from receiving traffic. The IP addresses must be a subset of the IP addresses allowed for the VPC subnet associated with the endpoint group.
     */
    DestinationAddresses?: DestinationAddresses;
    /**
     * A list of specific Amazon EC2 instance ports (destination ports) in a subnet endpoint that you want to prevent from receiving traffic.
     */
    DestinationPorts?: DestinationPorts;
    /**
     * Indicates whether all destination IP addresses and ports for a specified VPC subnet endpoint cannot receive traffic from a custom routing accelerator. The value is TRUE or FALSE.  When set to TRUE, no destinations in the custom routing VPC subnet can receive traffic. Note that you cannot specify destination IP addresses and ports when the value is set to TRUE. When set to FALSE (or not specified), you must specify a list of destination IP addresses that cannot receive traffic. A list of ports is optional. If you don't specify a list of ports, the ports that can accept traffic is the same as the ports configured for the endpoint group. The default value is FALSE.
     */
    DenyAllTrafficToEndpoint?: GenericBoolean;
  }
  export interface DeprovisionByoipCidrRequest {
    /**
     * The address range, in CIDR notation. The prefix must be the same prefix that you specified when you provisioned the address range.
     */
    Cidr: GenericString;
  }
  export interface DeprovisionByoipCidrResponse {
    /**
     * Information about the address range.
     */
    ByoipCidr?: ByoipCidr;
  }
  export interface DescribeAcceleratorAttributesRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator with the attributes that you want to describe.
     */
    AcceleratorArn: GenericString;
  }
  export interface DescribeAcceleratorAttributesResponse {
    /**
     * The attributes of the accelerator.
     */
    AcceleratorAttributes?: AcceleratorAttributes;
  }
  export interface DescribeAcceleratorRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator to describe.
     */
    AcceleratorArn: GenericString;
  }
  export interface DescribeAcceleratorResponse {
    /**
     * The description of the accelerator.
     */
    Accelerator?: Accelerator;
  }
  export interface DescribeCustomRoutingAcceleratorAttributesRequest {
    /**
     * The Amazon Resource Name (ARN) of the custom routing accelerator to describe the attributes for.
     */
    AcceleratorArn: GenericString;
  }
  export interface DescribeCustomRoutingAcceleratorAttributesResponse {
    /**
     * The attributes of the custom routing accelerator.
     */
    AcceleratorAttributes?: CustomRoutingAcceleratorAttributes;
  }
  export interface DescribeCustomRoutingAcceleratorRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator to describe.
     */
    AcceleratorArn: GenericString;
  }
  export interface DescribeCustomRoutingAcceleratorResponse {
    /**
     * The description of the custom routing accelerator.
     */
    Accelerator?: CustomRoutingAccelerator;
  }
  export interface DescribeCustomRoutingEndpointGroupRequest {
    /**
     * The Amazon Resource Name (ARN) of the endpoint group to describe.
     */
    EndpointGroupArn: GenericString;
  }
  export interface DescribeCustomRoutingEndpointGroupResponse {
    /**
     * The description of an endpoint group for a custom routing accelerator.
     */
    EndpointGroup?: CustomRoutingEndpointGroup;
  }
  export interface DescribeCustomRoutingListenerRequest {
    /**
     * The Amazon Resource Name (ARN) of the listener to describe.
     */
    ListenerArn: GenericString;
  }
  export interface DescribeCustomRoutingListenerResponse {
    /**
     * The description of a listener for a custom routing accelerator.
     */
    Listener?: CustomRoutingListener;
  }
  export interface DescribeEndpointGroupRequest {
    /**
     * The Amazon Resource Name (ARN) of the endpoint group to describe.
     */
    EndpointGroupArn: GenericString;
  }
  export interface DescribeEndpointGroupResponse {
    /**
     * The description of an endpoint group.
     */
    EndpointGroup?: EndpointGroup;
  }
  export interface DescribeListenerRequest {
    /**
     * The Amazon Resource Name (ARN) of the listener to describe.
     */
    ListenerArn: GenericString;
  }
  export interface DescribeListenerResponse {
    /**
     * The description of a listener.
     */
    Listener?: Listener;
  }
  export type DestinationAddresses = IpAddress[];
  export interface DestinationPortMapping {
    /**
     * The Amazon Resource Name (ARN) of the custom routing accelerator that you have port mappings for.
     */
    AcceleratorArn?: GenericString;
    /**
     * The IP address/port combinations (sockets) that map to a given destination socket address.
     */
    AcceleratorSocketAddresses?: SocketAddresses;
    /**
     * The Amazon Resource Name (ARN) of the endpoint group.
     */
    EndpointGroupArn?: GenericString;
    /**
     * The ID for the virtual private cloud (VPC) subnet.
     */
    EndpointId?: GenericString;
    /**
     * The Amazon Web Services Region for the endpoint group.
     */
    EndpointGroupRegion?: GenericString;
    /**
     * The endpoint IP address/port combination for traffic received on the accelerator socket address.
     */
    DestinationSocketAddress?: SocketAddress;
    /**
     * The IP address type that an accelerator supports. For a custom routing accelerator, the value must be IPV4.
     */
    IpAddressType?: IpAddressType;
    /**
     * Indicates whether or not a port mapping destination can receive traffic. The value is either ALLOW, if traffic is allowed to the destination, or DENY, if traffic is not allowed to the destination.
     */
    DestinationTrafficState?: CustomRoutingDestinationTrafficState;
  }
  export type DestinationPortMappings = DestinationPortMapping[];
  export type DestinationPorts = PortNumber[];
  export interface EndpointConfiguration {
    /**
     * An ID for the endpoint. If the endpoint is a Network Load Balancer or Application Load Balancer, this is the Amazon Resource Name (ARN) of the resource. If the endpoint is an Elastic IP address, this is the Elastic IP address allocation ID. For Amazon EC2 instances, this is the EC2 instance ID. A resource must be valid and active when you add it as an endpoint. An Application Load Balancer can be either internal or internet-facing.
     */
    EndpointId?: GenericString;
    /**
     * The weight associated with the endpoint. When you add weights to endpoints, you configure Global Accelerator to route traffic based on proportions that you specify. For example, you might specify endpoint weights of 4, 5, 5, and 6 (sum=20). The result is that 4/20 of your traffic, on average, is routed to the first endpoint, 5/20 is routed both to the second and third endpoints, and 6/20 is routed to the last endpoint. For more information, see Endpoint weights in the Global Accelerator Developer Guide.
     */
    Weight?: EndpointWeight;
    /**
     * Indicates whether client IP address preservation is enabled for an endpoint. The value is true or false. The default value is true for new accelerators.  If the value is set to true, the client's IP address is preserved in the X-Forwarded-For request header as traffic travels to applications on the endpoint fronted by the accelerator. Client IP address preservation is supported, in specific Amazon Web Services Regions, for endpoints that are Application Load Balancers, Amazon EC2 instances, and Network Load Balancers with Security Groups. IMPORTANT: You cannot use client IP address preservation with Network Load Balancers with TLS listeners. For more information, see  Preserve client IP addresses in Global Accelerator in the Global Accelerator Developer Guide.
     */
    ClientIPPreservationEnabled?: GenericBoolean;
  }
  export type EndpointConfigurations = EndpointConfiguration[];
  export interface EndpointDescription {
    /**
     * An ID for the endpoint. If the endpoint is a Network Load Balancer or Application Load Balancer, this is the Amazon Resource Name (ARN) of the resource. If the endpoint is an Elastic IP address, this is the Elastic IP address allocation ID. For Amazon EC2 instances, this is the EC2 instance ID.  An Application Load Balancer can be either internal or internet-facing.
     */
    EndpointId?: GenericString;
    /**
     * The weight associated with the endpoint. When you add weights to endpoints, you configure Global Accelerator to route traffic based on proportions that you specify. For example, you might specify endpoint weights of 4, 5, 5, and 6 (sum=20). The result is that 4/20 of your traffic, on average, is routed to the first endpoint, 5/20 is routed both to the second and third endpoints, and 6/20 is routed to the last endpoint. For more information, see Endpoint weights in the Global Accelerator Developer Guide. 
     */
    Weight?: EndpointWeight;
    /**
     * The health status of the endpoint.
     */
    HealthState?: HealthState;
    /**
     * Returns a null result.
     */
    HealthReason?: GenericString;
    /**
     * Indicates whether client IP address preservation is enabled for an endpoint. The value is true or false. The default value is true for new accelerators.  If the value is set to true, the client's IP address is preserved in the X-Forwarded-For request header as traffic travels to applications on the endpoint fronted by the accelerator. Client IP address preservation is supported, in specific Amazon Web Services Regions, for endpoints that are Application Load Balancers, Amazon EC2 instances, and Network Load Balancers with Security Groups. IMPORTANT: You cannot use client IP address preservation with Network Load Balancers with TLS listeners. For more information, see  Preserve client IP addresses in Global Accelerator in the Global Accelerator Developer Guide.
     */
    ClientIPPreservationEnabled?: GenericBoolean;
  }
  export type EndpointDescriptions = EndpointDescription[];
  export interface EndpointGroup {
    /**
     * The Amazon Resource Name (ARN) of the endpoint group.
     */
    EndpointGroupArn?: GenericString;
    /**
     * The Amazon Web Services Region where the endpoint group is located.
     */
    EndpointGroupRegion?: GenericString;
    /**
     * The list of endpoint objects.
     */
    EndpointDescriptions?: EndpointDescriptions;
    /**
     * The percentage of traffic to send to an Amazon Web Services Region. Additional traffic is distributed to other endpoint groups for this listener.  Use this action to increase (dial up) or decrease (dial down) traffic to a specific Region. The percentage is applied to the traffic that would otherwise have been routed to the Region based on optimal routing. The default value is 100.
     */
    TrafficDialPercentage?: TrafficDialPercentage;
    /**
     * The port that Global Accelerator uses to perform health checks on endpoints that are part of this endpoint group.  The default port is the port for the listener that this endpoint group is associated with. If the listener port is a list, Global Accelerator uses the first specified port in the list of ports.
     */
    HealthCheckPort?: HealthCheckPort;
    /**
     * The protocol that Global Accelerator uses to perform health checks on endpoints that are part of this endpoint group. The default value is TCP.
     */
    HealthCheckProtocol?: HealthCheckProtocol;
    /**
     * If the protocol is HTTP/S, then this value provides the ping path that Global Accelerator uses for the destination on the endpoints for health checks. The default is slash (/).
     */
    HealthCheckPath?: HealthCheckPath;
    /**
     * The time—10 seconds or 30 seconds—between health checks for each endpoint. The default value is 30.
     */
    HealthCheckIntervalSeconds?: HealthCheckIntervalSeconds;
    /**
     * The number of consecutive health checks required to set the state of a healthy endpoint to unhealthy, or to set an unhealthy endpoint to healthy. The default value is 3.
     */
    ThresholdCount?: ThresholdCount;
    /**
     * Allows you to override the destination ports used to route traffic to an endpoint. Using a port override lets you map a list of external destination ports (that your users send traffic to) to a list of internal destination ports that you want an application endpoint to receive traffic on. 
     */
    PortOverrides?: PortOverrides;
  }
  export type EndpointGroups = EndpointGroup[];
  export interface EndpointIdentifier {
    /**
     * An ID for the endpoint. If the endpoint is a Network Load Balancer or Application Load Balancer, this is the Amazon Resource Name (ARN) of the resource. If the endpoint is an Elastic IP address, this is the Elastic IP address allocation ID. For Amazon EC2 instances, this is the EC2 instance ID.  An Application Load Balancer can be either internal or internet-facing.
     */
    EndpointId: GenericString;
    /**
     * Indicates whether client IP address preservation is enabled for an endpoint. The value is true or false.  If the value is set to true, the client's IP address is preserved in the X-Forwarded-For request header as traffic travels to applications on the endpoint fronted by the accelerator.
     */
    ClientIPPreservationEnabled?: GenericBoolean;
  }
  export type EndpointIdentifiers = EndpointIdentifier[];
  export type EndpointIds = GenericString[];
  export type EndpointWeight = number;
  export type GenericBoolean = boolean;
  export type GenericString = string;
  export type HealthCheckIntervalSeconds = number;
  export type HealthCheckPath = string;
  export type HealthCheckPort = number;
  export type HealthCheckProtocol = "TCP"|"HTTP"|"HTTPS"|string;
  export type HealthState = "INITIAL"|"HEALTHY"|"UNHEALTHY"|string;
  export type IdempotencyToken = string;
  export type IpAddress = string;
  export type IpAddressFamily = "IPv4"|"IPv6"|string;
  export type IpAddressType = "IPV4"|"DUAL_STACK"|string;
  export type IpAddresses = IpAddress[];
  export interface IpSet {
    /**
     * IpFamily is deprecated and has been replaced by IpAddressFamily.
     */
    IpFamily?: GenericString;
    /**
     * The array of IP addresses in the IP address set. An IP address set can have a maximum of two IP addresses.
     */
    IpAddresses?: IpAddresses;
    /**
     * The types of IP addresses included in this IP set. 
     */
    IpAddressFamily?: IpAddressFamily;
  }
  export type IpSets = IpSet[];
  export interface ListAcceleratorsRequest {
    /**
     * The number of Global Accelerator objects that you want to return with this call. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListAcceleratorsResponse {
    /**
     * The list of accelerators for a customer account.
     */
    Accelerators?: Accelerators;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListByoipCidrsRequest {
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next page of results.
     */
    NextToken?: GenericString;
  }
  export interface ListByoipCidrsResponse {
    /**
     * Information about your address ranges.
     */
    ByoipCidrs?: ByoipCidrs;
    /**
     * The token for the next page of results.
     */
    NextToken?: GenericString;
  }
  export interface ListCustomRoutingAcceleratorsRequest {
    /**
     * The number of custom routing Global Accelerator objects that you want to return with this call. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListCustomRoutingAcceleratorsResponse {
    /**
     * The list of custom routing accelerators for a customer account.
     */
    Accelerators?: CustomRoutingAccelerators;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListCustomRoutingEndpointGroupsRequest {
    /**
     * The Amazon Resource Name (ARN) of the listener to list endpoint groups for.
     */
    ListenerArn: GenericString;
    /**
     * The number of endpoint group objects that you want to return with this call. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListCustomRoutingEndpointGroupsResponse {
    /**
     * The list of the endpoint groups associated with a listener for a custom routing accelerator.
     */
    EndpointGroups?: CustomRoutingEndpointGroups;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListCustomRoutingListenersRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator to list listeners for.
     */
    AcceleratorArn: GenericString;
    /**
     * The number of listener objects that you want to return with this call. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListCustomRoutingListenersResponse {
    /**
     * The list of listeners for a custom routing accelerator.
     */
    Listeners?: CustomRoutingListeners;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListCustomRoutingPortMappingsByDestinationRequest {
    /**
     * The ID for the virtual private cloud (VPC) subnet.
     */
    EndpointId: GenericString;
    /**
     * The endpoint IP address in a virtual private cloud (VPC) subnet for which you want to receive back port mappings.
     */
    DestinationAddress: GenericString;
    /**
     * The number of destination port mappings that you want to return with this call. The default value is 10.
     */
    MaxResults?: PortMappingsMaxResults;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListCustomRoutingPortMappingsByDestinationResponse {
    /**
     * The port mappings for the endpoint IP address that you specified in the request.
     */
    DestinationPortMappings?: DestinationPortMappings;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListCustomRoutingPortMappingsRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator to list the custom routing port mappings for.
     */
    AcceleratorArn: GenericString;
    /**
     * The Amazon Resource Name (ARN) of the endpoint group to list the custom routing port mappings for.
     */
    EndpointGroupArn?: GenericString;
    /**
     * The number of destination port mappings that you want to return with this call. The default value is 10.
     */
    MaxResults?: PortMappingsMaxResults;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListCustomRoutingPortMappingsResponse {
    /**
     * The port mappings for a custom routing accelerator.
     */
    PortMappings?: PortMappings;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListEndpointGroupsRequest {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn: GenericString;
    /**
     * The number of endpoint group objects that you want to return with this call. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListEndpointGroupsResponse {
    /**
     * The list of the endpoint groups associated with a listener.
     */
    EndpointGroups?: EndpointGroups;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListListenersRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator for which you want to list listener objects.
     */
    AcceleratorArn: GenericString;
    /**
     * The number of listener objects that you want to return with this call. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListListenersResponse {
    /**
     * The list of listeners for an accelerator.
     */
    Listeners?: Listeners;
    /**
     * The token for the next set of results. You receive this token from a previous call.
     */
    NextToken?: GenericString;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator to list tags for. An ARN uniquely identifies an accelerator.
     */
    ResourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Root level tag for the Tags parameters.
     */
    Tags?: Tags;
  }
  export interface Listener {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn?: GenericString;
    /**
     * The list of port ranges for the connections from clients to the accelerator.
     */
    PortRanges?: PortRanges;
    /**
     * The protocol for the connections from clients to the accelerator.
     */
    Protocol?: Protocol;
    /**
     * Client affinity lets you direct all requests from a user to the same endpoint, if you have stateful applications, regardless of the port and protocol of the client request. Client affinity gives you control over whether to always route each client to the same specific endpoint. Global Accelerator uses a consistent-flow hashing algorithm to choose the optimal endpoint for a connection. If client affinity is NONE, Global Accelerator uses the "five-tuple" (5-tuple) properties—source IP address, source port, destination IP address, destination port, and protocol—to select the hash value, and then chooses the best endpoint. However, with this setting, if someone uses different ports to connect to Global Accelerator, their connections might not be always routed to the same endpoint because the hash value changes.  If you want a given client to always be routed to the same endpoint, set client affinity to SOURCE_IP instead. When you use the SOURCE_IP setting, Global Accelerator uses the "two-tuple" (2-tuple) properties— source (client) IP address and destination IP address—to select the hash value. The default value is NONE.
     */
    ClientAffinity?: ClientAffinity;
  }
  export type Listeners = Listener[];
  export type MaxResults = number;
  export interface PortMapping {
    /**
     * The accelerator port.
     */
    AcceleratorPort?: PortNumber;
    /**
     * The Amazon Resource Name (ARN) of the endpoint group.
     */
    EndpointGroupArn?: GenericString;
    /**
     * The IP address of the VPC subnet (the subnet ID).
     */
    EndpointId?: GenericString;
    /**
     * The EC2 instance IP address and port number in the virtual private cloud (VPC) subnet.
     */
    DestinationSocketAddress?: SocketAddress;
    /**
     * The protocols supported by the endpoint group.
     */
    Protocols?: CustomRoutingProtocols;
    /**
     * Indicates whether or not a port mapping destination can receive traffic. The value is either ALLOW, if traffic is allowed to the destination, or DENY, if traffic is not allowed to the destination.
     */
    DestinationTrafficState?: CustomRoutingDestinationTrafficState;
  }
  export type PortMappings = PortMapping[];
  export type PortMappingsMaxResults = number;
  export type PortNumber = number;
  export interface PortOverride {
    /**
     * The listener port that you want to map to a specific endpoint port. This is the port that user traffic arrives to the Global Accelerator on.
     */
    ListenerPort?: PortNumber;
    /**
     * The endpoint port that you want a listener port to be mapped to. This is the port on the endpoint, such as the Application Load Balancer or Amazon EC2 instance.
     */
    EndpointPort?: PortNumber;
  }
  export type PortOverrides = PortOverride[];
  export interface PortRange {
    /**
     * The first port in the range of ports, inclusive.
     */
    FromPort?: PortNumber;
    /**
     * The last port in the range of ports, inclusive.
     */
    ToPort?: PortNumber;
  }
  export type PortRanges = PortRange[];
  export type Protocol = "TCP"|"UDP"|string;
  export type Protocols = Protocol[];
  export interface ProvisionByoipCidrRequest {
    /**
     * The public IPv4 address range, in CIDR notation. The most specific IP prefix that you can specify is /24. The address range cannot overlap with another address range that you've brought to this or another Region.
     */
    Cidr: GenericString;
    /**
     * A signed document that proves that you are authorized to bring the specified IP address range to Amazon using BYOIP. 
     */
    CidrAuthorizationContext: CidrAuthorizationContext;
  }
  export interface ProvisionByoipCidrResponse {
    /**
     * Information about the address range.
     */
    ByoipCidr?: ByoipCidr;
  }
  export interface RemoveCustomRoutingEndpointsRequest {
    /**
     * The IDs for the endpoints. For custom routing accelerators, endpoint IDs are the virtual private cloud (VPC) subnet IDs. 
     */
    EndpointIds: EndpointIds;
    /**
     * The Amazon Resource Name (ARN) of the endpoint group to remove endpoints from.
     */
    EndpointGroupArn: GenericString;
  }
  export interface RemoveEndpointsRequest {
    /**
     * The identifiers of the endpoints that you want to remove.
     */
    EndpointIdentifiers: EndpointIdentifiers;
    /**
     * The Amazon Resource Name (ARN) of the endpoint group.
     */
    EndpointGroupArn: GenericString;
  }
  export type ResourceArn = string;
  export interface SocketAddress {
    /**
     * The IP address for the socket address.
     */
    IpAddress?: GenericString;
    /**
     * The port for the socket address.
     */
    Port?: PortNumber;
  }
  export type SocketAddresses = SocketAddress[];
  export interface Tag {
    /**
     * A string that contains a Tag key.
     */
    Key: TagKey;
    /**
     * A string that contains a Tag value.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Global Accelerator resource to add tags to. An ARN uniquely identifies a resource.
     */
    ResourceArn: ResourceArn;
    /**
     * The tags to add to a resource. A tag consists of a key and a value that you define.
     */
    Tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export type ThresholdCount = number;
  export type Timestamp = Date;
  export type TrafficDialPercentage = number;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Global Accelerator resource to remove tags from. An ARN uniquely identifies a resource.
     */
    ResourceArn: ResourceArn;
    /**
     * The tag key pairs that you want to remove from the specified resources.
     */
    TagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAcceleratorAttributesRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator that you want to update.
     */
    AcceleratorArn: GenericString;
    /**
     * Update whether flow logs are enabled. The default value is false. If the value is true, FlowLogsS3Bucket and FlowLogsS3Prefix must be specified. For more information, see Flow Logs in the Global Accelerator Developer Guide.
     */
    FlowLogsEnabled?: GenericBoolean;
    /**
     * The name of the Amazon S3 bucket for the flow logs. Attribute is required if FlowLogsEnabled is true. The bucket must exist and have a bucket policy that grants Global Accelerator permission to write to the bucket.
     */
    FlowLogsS3Bucket?: GenericString;
    /**
     * Update the prefix for the location in the Amazon S3 bucket for the flow logs. Attribute is required if FlowLogsEnabled is true.  If you specify slash (/) for the S3 bucket prefix, the log file bucket folder structure will include a double slash (//), like the following: s3-bucket_name//AWSLogs/aws_account_id
     */
    FlowLogsS3Prefix?: GenericString;
  }
  export interface UpdateAcceleratorAttributesResponse {
    /**
     * Updated attributes for the accelerator.
     */
    AcceleratorAttributes?: AcceleratorAttributes;
  }
  export interface UpdateAcceleratorRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator to update.
     */
    AcceleratorArn: GenericString;
    /**
     * The name of the accelerator. The name can have a maximum of 64 characters, must contain only alphanumeric characters, periods (.), or hyphens (-), and must not begin or end with a hyphen or period.
     */
    Name?: GenericString;
    /**
     * The IP address type that an accelerator supports. For a standard accelerator, the value can be IPV4 or DUAL_STACK.
     */
    IpAddressType?: IpAddressType;
    /**
     * Indicates whether an accelerator is enabled. The value is true or false. The default value is true.  If the value is set to true, the accelerator cannot be deleted. If set to false, the accelerator can be deleted.
     */
    Enabled?: GenericBoolean;
  }
  export interface UpdateAcceleratorResponse {
    /**
     * Information about the updated accelerator.
     */
    Accelerator?: Accelerator;
  }
  export interface UpdateCustomRoutingAcceleratorAttributesRequest {
    /**
     * The Amazon Resource Name (ARN) of the custom routing accelerator to update attributes for.
     */
    AcceleratorArn: GenericString;
    /**
     * Update whether flow logs are enabled. The default value is false. If the value is true, FlowLogsS3Bucket and FlowLogsS3Prefix must be specified. For more information, see Flow logs in the Global Accelerator Developer Guide.
     */
    FlowLogsEnabled?: GenericBoolean;
    /**
     * The name of the Amazon S3 bucket for the flow logs. Attribute is required if FlowLogsEnabled is true. The bucket must exist and have a bucket policy that grants Global Accelerator permission to write to the bucket.
     */
    FlowLogsS3Bucket?: GenericString;
    /**
     * Update the prefix for the location in the Amazon S3 bucket for the flow logs. Attribute is required if FlowLogsEnabled is true.  If you don’t specify a prefix, the flow logs are stored in the root of the bucket. If you specify slash (/) for the S3 bucket prefix, the log file bucket folder structure will include a double slash (//), like the following: DOC-EXAMPLE-BUCKET//AWSLogs/aws_account_id
     */
    FlowLogsS3Prefix?: GenericString;
  }
  export interface UpdateCustomRoutingAcceleratorAttributesResponse {
    /**
     * Updated custom routing accelerator.
     */
    AcceleratorAttributes?: CustomRoutingAcceleratorAttributes;
  }
  export interface UpdateCustomRoutingAcceleratorRequest {
    /**
     * The Amazon Resource Name (ARN) of the accelerator to update.
     */
    AcceleratorArn: GenericString;
    /**
     * The name of the accelerator. The name can have a maximum of 64 characters, must contain only alphanumeric characters, periods (.), or hyphens (-), and must not begin or end with a hyphen or period.
     */
    Name?: GenericString;
    /**
     * The IP address type that an accelerator supports. For a custom routing accelerator, the value must be IPV4.
     */
    IpAddressType?: IpAddressType;
    /**
     * Indicates whether an accelerator is enabled. The value is true or false. The default value is true.  If the value is set to true, the accelerator cannot be deleted. If set to false, the accelerator can be deleted.
     */
    Enabled?: GenericBoolean;
  }
  export interface UpdateCustomRoutingAcceleratorResponse {
    /**
     * Information about the updated custom routing accelerator.
     */
    Accelerator?: CustomRoutingAccelerator;
  }
  export interface UpdateCustomRoutingListenerRequest {
    /**
     * The Amazon Resource Name (ARN) of the listener to update.
     */
    ListenerArn: GenericString;
    /**
     * The updated port range to support for connections from clients to your accelerator. If you remove ports that are currently being used by a subnet endpoint, the call fails. Separately, you set port ranges for endpoints. For more information, see About endpoints for custom routing accelerators.
     */
    PortRanges: PortRanges;
  }
  export interface UpdateCustomRoutingListenerResponse {
    /**
     * Information for the updated listener for a custom routing accelerator.
     */
    Listener?: CustomRoutingListener;
  }
  export interface UpdateEndpointGroupRequest {
    /**
     * The Amazon Resource Name (ARN) of the endpoint group.
     */
    EndpointGroupArn: GenericString;
    /**
     * The list of endpoint objects. A resource must be valid and active when you add it as an endpoint.
     */
    EndpointConfigurations?: EndpointConfigurations;
    /**
     * The percentage of traffic to send to an Amazon Web Services Region. Additional traffic is distributed to other endpoint groups for this listener.  Use this action to increase (dial up) or decrease (dial down) traffic to a specific Region. The percentage is applied to the traffic that would otherwise have been routed to the Region based on optimal routing. The default value is 100.
     */
    TrafficDialPercentage?: TrafficDialPercentage;
    /**
     * The port that Global Accelerator uses to check the health of endpoints that are part of this endpoint group. The default port is the listener port that this endpoint group is associated with. If the listener port is a list of ports, Global Accelerator uses the first port in the list.
     */
    HealthCheckPort?: HealthCheckPort;
    /**
     * The protocol that Global Accelerator uses to check the health of endpoints that are part of this endpoint group. The default value is TCP.
     */
    HealthCheckProtocol?: HealthCheckProtocol;
    /**
     * If the protocol is HTTP/S, then this specifies the path that is the destination for health check targets. The default value is slash (/).
     */
    HealthCheckPath?: HealthCheckPath;
    /**
     * The time—10 seconds or 30 seconds—between each health check for an endpoint. The default value is 30.
     */
    HealthCheckIntervalSeconds?: HealthCheckIntervalSeconds;
    /**
     * The number of consecutive health checks required to set the state of a healthy endpoint to unhealthy, or to set an unhealthy endpoint to healthy. The default value is 3.
     */
    ThresholdCount?: ThresholdCount;
    /**
     * Override specific listener ports used to route traffic to endpoints that are part of this endpoint group. For example, you can create a port override in which the listener receives user traffic on ports 80 and 443, but your accelerator routes that traffic to ports 1080 and 1443, respectively, on the endpoints. For more information, see  Overriding listener ports in the Global Accelerator Developer Guide.
     */
    PortOverrides?: PortOverrides;
  }
  export interface UpdateEndpointGroupResponse {
    /**
     * The information about the endpoint group that was updated.
     */
    EndpointGroup?: EndpointGroup;
  }
  export interface UpdateListenerRequest {
    /**
     * The Amazon Resource Name (ARN) of the listener to update.
     */
    ListenerArn: GenericString;
    /**
     * The updated list of port ranges for the connections from clients to the accelerator.
     */
    PortRanges?: PortRanges;
    /**
     * The updated protocol for the connections from clients to the accelerator.
     */
    Protocol?: Protocol;
    /**
     * Client affinity lets you direct all requests from a user to the same endpoint, if you have stateful applications, regardless of the port and protocol of the client request. Client affinity gives you control over whether to always route each client to the same specific endpoint. Global Accelerator uses a consistent-flow hashing algorithm to choose the optimal endpoint for a connection. If client affinity is NONE, Global Accelerator uses the "five-tuple" (5-tuple) properties—source IP address, source port, destination IP address, destination port, and protocol—to select the hash value, and then chooses the best endpoint. However, with this setting, if someone uses different ports to connect to Global Accelerator, their connections might not be always routed to the same endpoint because the hash value changes.  If you want a given client to always be routed to the same endpoint, set client affinity to SOURCE_IP instead. When you use the SOURCE_IP setting, Global Accelerator uses the "two-tuple" (2-tuple) properties— source (client) IP address and destination IP address—to select the hash value. The default value is NONE.
     */
    ClientAffinity?: ClientAffinity;
  }
  export interface UpdateListenerResponse {
    /**
     * Information for the updated listener.
     */
    Listener?: Listener;
  }
  export interface WithdrawByoipCidrRequest {
    /**
     * The address range, in CIDR notation.
     */
    Cidr: GenericString;
  }
  export interface WithdrawByoipCidrResponse {
    /**
     * Information about the address pool.
     */
    ByoipCidr?: ByoipCidr;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-08-08"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the GlobalAccelerator client.
   */
  export import Types = GlobalAccelerator;
}
export = GlobalAccelerator;
