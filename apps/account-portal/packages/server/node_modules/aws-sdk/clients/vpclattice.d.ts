import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class VPCLattice extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: VPCLattice.Types.ClientConfiguration)
  config: Config & VPCLattice.Types.ClientConfiguration;
  /**
   * Updates the listener rules in a batch. You can use this operation to change the priority of listener rules. This can be useful when bulk updating or swapping rule priority. 
   */
  batchUpdateRule(params: VPCLattice.Types.BatchUpdateRuleRequest, callback?: (err: AWSError, data: VPCLattice.Types.BatchUpdateRuleResponse) => void): Request<VPCLattice.Types.BatchUpdateRuleResponse, AWSError>;
  /**
   * Updates the listener rules in a batch. You can use this operation to change the priority of listener rules. This can be useful when bulk updating or swapping rule priority. 
   */
  batchUpdateRule(callback?: (err: AWSError, data: VPCLattice.Types.BatchUpdateRuleResponse) => void): Request<VPCLattice.Types.BatchUpdateRuleResponse, AWSError>;
  /**
   * Enables access logs to be sent to Amazon CloudWatch, Amazon S3, and Amazon Kinesis Data Firehose. The service network owner can use the access logs to audit the services in the network. The service network owner will only see access logs from clients and services that are associated with their service network. Access log entries represent traffic originated from VPCs associated with that network. For more information, see Access logs in the Amazon VPC Lattice User Guide.
   */
  createAccessLogSubscription(params: VPCLattice.Types.CreateAccessLogSubscriptionRequest, callback?: (err: AWSError, data: VPCLattice.Types.CreateAccessLogSubscriptionResponse) => void): Request<VPCLattice.Types.CreateAccessLogSubscriptionResponse, AWSError>;
  /**
   * Enables access logs to be sent to Amazon CloudWatch, Amazon S3, and Amazon Kinesis Data Firehose. The service network owner can use the access logs to audit the services in the network. The service network owner will only see access logs from clients and services that are associated with their service network. Access log entries represent traffic originated from VPCs associated with that network. For more information, see Access logs in the Amazon VPC Lattice User Guide.
   */
  createAccessLogSubscription(callback?: (err: AWSError, data: VPCLattice.Types.CreateAccessLogSubscriptionResponse) => void): Request<VPCLattice.Types.CreateAccessLogSubscriptionResponse, AWSError>;
  /**
   * Creates a listener for a service. Before you start using your Amazon VPC Lattice service, you must add one or more listeners. A listener is a process that checks for connection requests to your services. For more information, see Listeners in the Amazon VPC Lattice User Guide.
   */
  createListener(params: VPCLattice.Types.CreateListenerRequest, callback?: (err: AWSError, data: VPCLattice.Types.CreateListenerResponse) => void): Request<VPCLattice.Types.CreateListenerResponse, AWSError>;
  /**
   * Creates a listener for a service. Before you start using your Amazon VPC Lattice service, you must add one or more listeners. A listener is a process that checks for connection requests to your services. For more information, see Listeners in the Amazon VPC Lattice User Guide.
   */
  createListener(callback?: (err: AWSError, data: VPCLattice.Types.CreateListenerResponse) => void): Request<VPCLattice.Types.CreateListenerResponse, AWSError>;
  /**
   * Creates a listener rule. Each listener has a default rule for checking connection requests, but you can define additional rules. Each rule consists of a priority, one or more actions, and one or more conditions. For more information, see Listener rules in the Amazon VPC Lattice User Guide.
   */
  createRule(params: VPCLattice.Types.CreateRuleRequest, callback?: (err: AWSError, data: VPCLattice.Types.CreateRuleResponse) => void): Request<VPCLattice.Types.CreateRuleResponse, AWSError>;
  /**
   * Creates a listener rule. Each listener has a default rule for checking connection requests, but you can define additional rules. Each rule consists of a priority, one or more actions, and one or more conditions. For more information, see Listener rules in the Amazon VPC Lattice User Guide.
   */
  createRule(callback?: (err: AWSError, data: VPCLattice.Types.CreateRuleResponse) => void): Request<VPCLattice.Types.CreateRuleResponse, AWSError>;
  /**
   * Creates a service. A service is any software application that can run on instances containers, or serverless functions within an account or virtual private cloud (VPC). For more information, see Services in the Amazon VPC Lattice User Guide.
   */
  createService(params: VPCLattice.Types.CreateServiceRequest, callback?: (err: AWSError, data: VPCLattice.Types.CreateServiceResponse) => void): Request<VPCLattice.Types.CreateServiceResponse, AWSError>;
  /**
   * Creates a service. A service is any software application that can run on instances containers, or serverless functions within an account or virtual private cloud (VPC). For more information, see Services in the Amazon VPC Lattice User Guide.
   */
  createService(callback?: (err: AWSError, data: VPCLattice.Types.CreateServiceResponse) => void): Request<VPCLattice.Types.CreateServiceResponse, AWSError>;
  /**
   * Creates a service network. A service network is a logical boundary for a collection of services. You can associate services and VPCs with a service network. For more information, see Service networks in the Amazon VPC Lattice User Guide.
   */
  createServiceNetwork(params: VPCLattice.Types.CreateServiceNetworkRequest, callback?: (err: AWSError, data: VPCLattice.Types.CreateServiceNetworkResponse) => void): Request<VPCLattice.Types.CreateServiceNetworkResponse, AWSError>;
  /**
   * Creates a service network. A service network is a logical boundary for a collection of services. You can associate services and VPCs with a service network. For more information, see Service networks in the Amazon VPC Lattice User Guide.
   */
  createServiceNetwork(callback?: (err: AWSError, data: VPCLattice.Types.CreateServiceNetworkResponse) => void): Request<VPCLattice.Types.CreateServiceNetworkResponse, AWSError>;
  /**
   * Associates a service with a service network. You can't use this operation if the service and service network are already associated or if there is a disassociation or deletion in progress. If the association fails, you can retry the operation by deleting the association and recreating it. You cannot associate a service and service network that are shared with a caller. The caller must own either the service or the service network. As a result of this operation, the association is created in the service network account and the association owner account.
   */
  createServiceNetworkServiceAssociation(params: VPCLattice.Types.CreateServiceNetworkServiceAssociationRequest, callback?: (err: AWSError, data: VPCLattice.Types.CreateServiceNetworkServiceAssociationResponse) => void): Request<VPCLattice.Types.CreateServiceNetworkServiceAssociationResponse, AWSError>;
  /**
   * Associates a service with a service network. You can't use this operation if the service and service network are already associated or if there is a disassociation or deletion in progress. If the association fails, you can retry the operation by deleting the association and recreating it. You cannot associate a service and service network that are shared with a caller. The caller must own either the service or the service network. As a result of this operation, the association is created in the service network account and the association owner account.
   */
  createServiceNetworkServiceAssociation(callback?: (err: AWSError, data: VPCLattice.Types.CreateServiceNetworkServiceAssociationResponse) => void): Request<VPCLattice.Types.CreateServiceNetworkServiceAssociationResponse, AWSError>;
  /**
   * Associates a VPC with a service network. When you associate a VPC with the service network, it enables all the resources within that VPC to be clients and communicate with other services in the service network. For more information, see Manage VPC associations in the Amazon VPC Lattice User Guide. You can't use this operation if there is a disassociation in progress. If the association fails, retry by deleting the association and recreating it. As a result of this operation, the association gets created in the service network account and the VPC owner account. Once a security group is added to the VPC association it cannot be removed. You can add or update the security groups being used for the VPC association once a security group is attached. To remove all security groups you must reassociate the VPC.
   */
  createServiceNetworkVpcAssociation(params: VPCLattice.Types.CreateServiceNetworkVpcAssociationRequest, callback?: (err: AWSError, data: VPCLattice.Types.CreateServiceNetworkVpcAssociationResponse) => void): Request<VPCLattice.Types.CreateServiceNetworkVpcAssociationResponse, AWSError>;
  /**
   * Associates a VPC with a service network. When you associate a VPC with the service network, it enables all the resources within that VPC to be clients and communicate with other services in the service network. For more information, see Manage VPC associations in the Amazon VPC Lattice User Guide. You can't use this operation if there is a disassociation in progress. If the association fails, retry by deleting the association and recreating it. As a result of this operation, the association gets created in the service network account and the VPC owner account. Once a security group is added to the VPC association it cannot be removed. You can add or update the security groups being used for the VPC association once a security group is attached. To remove all security groups you must reassociate the VPC.
   */
  createServiceNetworkVpcAssociation(callback?: (err: AWSError, data: VPCLattice.Types.CreateServiceNetworkVpcAssociationResponse) => void): Request<VPCLattice.Types.CreateServiceNetworkVpcAssociationResponse, AWSError>;
  /**
   * Creates a target group. A target group is a collection of targets, or compute resources, that run your application or service. A target group can only be used by a single service. For more information, see Target groups in the Amazon VPC Lattice User Guide.
   */
  createTargetGroup(params: VPCLattice.Types.CreateTargetGroupRequest, callback?: (err: AWSError, data: VPCLattice.Types.CreateTargetGroupResponse) => void): Request<VPCLattice.Types.CreateTargetGroupResponse, AWSError>;
  /**
   * Creates a target group. A target group is a collection of targets, or compute resources, that run your application or service. A target group can only be used by a single service. For more information, see Target groups in the Amazon VPC Lattice User Guide.
   */
  createTargetGroup(callback?: (err: AWSError, data: VPCLattice.Types.CreateTargetGroupResponse) => void): Request<VPCLattice.Types.CreateTargetGroupResponse, AWSError>;
  /**
   * Deletes the specified access log subscription.
   */
  deleteAccessLogSubscription(params: VPCLattice.Types.DeleteAccessLogSubscriptionRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeleteAccessLogSubscriptionResponse) => void): Request<VPCLattice.Types.DeleteAccessLogSubscriptionResponse, AWSError>;
  /**
   * Deletes the specified access log subscription.
   */
  deleteAccessLogSubscription(callback?: (err: AWSError, data: VPCLattice.Types.DeleteAccessLogSubscriptionResponse) => void): Request<VPCLattice.Types.DeleteAccessLogSubscriptionResponse, AWSError>;
  /**
   * Deletes the specified auth policy. If an auth is set to Amazon Web Services_IAM and the auth policy is deleted, all requests will be denied by default. If you are trying to remove the auth policy completely, you must set the auth_type to NONE. If auth is enabled on the resource, but no auth policy is set, all requests will be denied.
   */
  deleteAuthPolicy(params: VPCLattice.Types.DeleteAuthPolicyRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeleteAuthPolicyResponse) => void): Request<VPCLattice.Types.DeleteAuthPolicyResponse, AWSError>;
  /**
   * Deletes the specified auth policy. If an auth is set to Amazon Web Services_IAM and the auth policy is deleted, all requests will be denied by default. If you are trying to remove the auth policy completely, you must set the auth_type to NONE. If auth is enabled on the resource, but no auth policy is set, all requests will be denied.
   */
  deleteAuthPolicy(callback?: (err: AWSError, data: VPCLattice.Types.DeleteAuthPolicyResponse) => void): Request<VPCLattice.Types.DeleteAuthPolicyResponse, AWSError>;
  /**
   * Deletes the specified listener.
   */
  deleteListener(params: VPCLattice.Types.DeleteListenerRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeleteListenerResponse) => void): Request<VPCLattice.Types.DeleteListenerResponse, AWSError>;
  /**
   * Deletes the specified listener.
   */
  deleteListener(callback?: (err: AWSError, data: VPCLattice.Types.DeleteListenerResponse) => void): Request<VPCLattice.Types.DeleteListenerResponse, AWSError>;
  /**
   * Deletes the specified resource policy.
   */
  deleteResourcePolicy(params: VPCLattice.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeleteResourcePolicyResponse) => void): Request<VPCLattice.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes the specified resource policy.
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: VPCLattice.Types.DeleteResourcePolicyResponse) => void): Request<VPCLattice.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes a listener rule. Each listener has a default rule for checking connection requests, but you can define additional rules. Each rule consists of a priority, one or more actions, and one or more conditions. You can delete additional listener rules, but you cannot delete the default rule. For more information, see Listener rules in the Amazon VPC Lattice User Guide.
   */
  deleteRule(params: VPCLattice.Types.DeleteRuleRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeleteRuleResponse) => void): Request<VPCLattice.Types.DeleteRuleResponse, AWSError>;
  /**
   * Deletes a listener rule. Each listener has a default rule for checking connection requests, but you can define additional rules. Each rule consists of a priority, one or more actions, and one or more conditions. You can delete additional listener rules, but you cannot delete the default rule. For more information, see Listener rules in the Amazon VPC Lattice User Guide.
   */
  deleteRule(callback?: (err: AWSError, data: VPCLattice.Types.DeleteRuleResponse) => void): Request<VPCLattice.Types.DeleteRuleResponse, AWSError>;
  /**
   * Deletes a service. A service can't be deleted if it's associated with a service network. If you delete a service, all resources related to the service, such as the resource policy, auth policy, listeners, listener rules, and access log subscriptions, are also deleted. For more information, see Delete a service in the Amazon VPC Lattice User Guide.
   */
  deleteService(params: VPCLattice.Types.DeleteServiceRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeleteServiceResponse) => void): Request<VPCLattice.Types.DeleteServiceResponse, AWSError>;
  /**
   * Deletes a service. A service can't be deleted if it's associated with a service network. If you delete a service, all resources related to the service, such as the resource policy, auth policy, listeners, listener rules, and access log subscriptions, are also deleted. For more information, see Delete a service in the Amazon VPC Lattice User Guide.
   */
  deleteService(callback?: (err: AWSError, data: VPCLattice.Types.DeleteServiceResponse) => void): Request<VPCLattice.Types.DeleteServiceResponse, AWSError>;
  /**
   * Deletes a service network. You can only delete the service network if there is no service or VPC associated with it. If you delete a service network, all resources related to the service network, such as the resource policy, auth policy, and access log subscriptions, are also deleted. For more information, see Delete a service network in the Amazon VPC Lattice User Guide.
   */
  deleteServiceNetwork(params: VPCLattice.Types.DeleteServiceNetworkRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeleteServiceNetworkResponse) => void): Request<VPCLattice.Types.DeleteServiceNetworkResponse, AWSError>;
  /**
   * Deletes a service network. You can only delete the service network if there is no service or VPC associated with it. If you delete a service network, all resources related to the service network, such as the resource policy, auth policy, and access log subscriptions, are also deleted. For more information, see Delete a service network in the Amazon VPC Lattice User Guide.
   */
  deleteServiceNetwork(callback?: (err: AWSError, data: VPCLattice.Types.DeleteServiceNetworkResponse) => void): Request<VPCLattice.Types.DeleteServiceNetworkResponse, AWSError>;
  /**
   * Deletes the association between a specified service and the specific service network. This request will fail if an association is still in progress.
   */
  deleteServiceNetworkServiceAssociation(params: VPCLattice.Types.DeleteServiceNetworkServiceAssociationRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeleteServiceNetworkServiceAssociationResponse) => void): Request<VPCLattice.Types.DeleteServiceNetworkServiceAssociationResponse, AWSError>;
  /**
   * Deletes the association between a specified service and the specific service network. This request will fail if an association is still in progress.
   */
  deleteServiceNetworkServiceAssociation(callback?: (err: AWSError, data: VPCLattice.Types.DeleteServiceNetworkServiceAssociationResponse) => void): Request<VPCLattice.Types.DeleteServiceNetworkServiceAssociationResponse, AWSError>;
  /**
   * Disassociates the VPC from the service network. You can't disassociate the VPC if there is a create or update association in progress.
   */
  deleteServiceNetworkVpcAssociation(params: VPCLattice.Types.DeleteServiceNetworkVpcAssociationRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeleteServiceNetworkVpcAssociationResponse) => void): Request<VPCLattice.Types.DeleteServiceNetworkVpcAssociationResponse, AWSError>;
  /**
   * Disassociates the VPC from the service network. You can't disassociate the VPC if there is a create or update association in progress.
   */
  deleteServiceNetworkVpcAssociation(callback?: (err: AWSError, data: VPCLattice.Types.DeleteServiceNetworkVpcAssociationResponse) => void): Request<VPCLattice.Types.DeleteServiceNetworkVpcAssociationResponse, AWSError>;
  /**
   * Deletes a target group. You can't delete a target group if it is used in a listener rule or if the target group creation is in progress.
   */
  deleteTargetGroup(params: VPCLattice.Types.DeleteTargetGroupRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeleteTargetGroupResponse) => void): Request<VPCLattice.Types.DeleteTargetGroupResponse, AWSError>;
  /**
   * Deletes a target group. You can't delete a target group if it is used in a listener rule or if the target group creation is in progress.
   */
  deleteTargetGroup(callback?: (err: AWSError, data: VPCLattice.Types.DeleteTargetGroupResponse) => void): Request<VPCLattice.Types.DeleteTargetGroupResponse, AWSError>;
  /**
   * Deregisters the specified targets from the specified target group.
   */
  deregisterTargets(params: VPCLattice.Types.DeregisterTargetsRequest, callback?: (err: AWSError, data: VPCLattice.Types.DeregisterTargetsResponse) => void): Request<VPCLattice.Types.DeregisterTargetsResponse, AWSError>;
  /**
   * Deregisters the specified targets from the specified target group.
   */
  deregisterTargets(callback?: (err: AWSError, data: VPCLattice.Types.DeregisterTargetsResponse) => void): Request<VPCLattice.Types.DeregisterTargetsResponse, AWSError>;
  /**
   * Retrieves information about the specified access log subscription.
   */
  getAccessLogSubscription(params: VPCLattice.Types.GetAccessLogSubscriptionRequest, callback?: (err: AWSError, data: VPCLattice.Types.GetAccessLogSubscriptionResponse) => void): Request<VPCLattice.Types.GetAccessLogSubscriptionResponse, AWSError>;
  /**
   * Retrieves information about the specified access log subscription.
   */
  getAccessLogSubscription(callback?: (err: AWSError, data: VPCLattice.Types.GetAccessLogSubscriptionResponse) => void): Request<VPCLattice.Types.GetAccessLogSubscriptionResponse, AWSError>;
  /**
   * Retrieves information about the auth policy for the specified service or service network.
   */
  getAuthPolicy(params: VPCLattice.Types.GetAuthPolicyRequest, callback?: (err: AWSError, data: VPCLattice.Types.GetAuthPolicyResponse) => void): Request<VPCLattice.Types.GetAuthPolicyResponse, AWSError>;
  /**
   * Retrieves information about the auth policy for the specified service or service network.
   */
  getAuthPolicy(callback?: (err: AWSError, data: VPCLattice.Types.GetAuthPolicyResponse) => void): Request<VPCLattice.Types.GetAuthPolicyResponse, AWSError>;
  /**
   * Retrieves information about the specified listener for the specified service.
   */
  getListener(params: VPCLattice.Types.GetListenerRequest, callback?: (err: AWSError, data: VPCLattice.Types.GetListenerResponse) => void): Request<VPCLattice.Types.GetListenerResponse, AWSError>;
  /**
   * Retrieves information about the specified listener for the specified service.
   */
  getListener(callback?: (err: AWSError, data: VPCLattice.Types.GetListenerResponse) => void): Request<VPCLattice.Types.GetListenerResponse, AWSError>;
  /**
   * Retrieves information about the resource policy. The resource policy is an IAM policy created by AWS RAM on behalf of the resource owner when they share a resource.
   */
  getResourcePolicy(params: VPCLattice.Types.GetResourcePolicyRequest, callback?: (err: AWSError, data: VPCLattice.Types.GetResourcePolicyResponse) => void): Request<VPCLattice.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Retrieves information about the resource policy. The resource policy is an IAM policy created by AWS RAM on behalf of the resource owner when they share a resource.
   */
  getResourcePolicy(callback?: (err: AWSError, data: VPCLattice.Types.GetResourcePolicyResponse) => void): Request<VPCLattice.Types.GetResourcePolicyResponse, AWSError>;
  /**
   * Retrieves information about listener rules. You can also retrieve information about the default listener rule. For more information, see Listener rules in the Amazon VPC Lattice User Guide.
   */
  getRule(params: VPCLattice.Types.GetRuleRequest, callback?: (err: AWSError, data: VPCLattice.Types.GetRuleResponse) => void): Request<VPCLattice.Types.GetRuleResponse, AWSError>;
  /**
   * Retrieves information about listener rules. You can also retrieve information about the default listener rule. For more information, see Listener rules in the Amazon VPC Lattice User Guide.
   */
  getRule(callback?: (err: AWSError, data: VPCLattice.Types.GetRuleResponse) => void): Request<VPCLattice.Types.GetRuleResponse, AWSError>;
  /**
   * Retrieves information about the specified service.
   */
  getService(params: VPCLattice.Types.GetServiceRequest, callback?: (err: AWSError, data: VPCLattice.Types.GetServiceResponse) => void): Request<VPCLattice.Types.GetServiceResponse, AWSError>;
  /**
   * Retrieves information about the specified service.
   */
  getService(callback?: (err: AWSError, data: VPCLattice.Types.GetServiceResponse) => void): Request<VPCLattice.Types.GetServiceResponse, AWSError>;
  /**
   * Retrieves information about the specified service network.
   */
  getServiceNetwork(params: VPCLattice.Types.GetServiceNetworkRequest, callback?: (err: AWSError, data: VPCLattice.Types.GetServiceNetworkResponse) => void): Request<VPCLattice.Types.GetServiceNetworkResponse, AWSError>;
  /**
   * Retrieves information about the specified service network.
   */
  getServiceNetwork(callback?: (err: AWSError, data: VPCLattice.Types.GetServiceNetworkResponse) => void): Request<VPCLattice.Types.GetServiceNetworkResponse, AWSError>;
  /**
   * Retrieves information about the specified association between a service network and a service.
   */
  getServiceNetworkServiceAssociation(params: VPCLattice.Types.GetServiceNetworkServiceAssociationRequest, callback?: (err: AWSError, data: VPCLattice.Types.GetServiceNetworkServiceAssociationResponse) => void): Request<VPCLattice.Types.GetServiceNetworkServiceAssociationResponse, AWSError>;
  /**
   * Retrieves information about the specified association between a service network and a service.
   */
  getServiceNetworkServiceAssociation(callback?: (err: AWSError, data: VPCLattice.Types.GetServiceNetworkServiceAssociationResponse) => void): Request<VPCLattice.Types.GetServiceNetworkServiceAssociationResponse, AWSError>;
  /**
   * Retrieves information about the association between a service network and a VPC.
   */
  getServiceNetworkVpcAssociation(params: VPCLattice.Types.GetServiceNetworkVpcAssociationRequest, callback?: (err: AWSError, data: VPCLattice.Types.GetServiceNetworkVpcAssociationResponse) => void): Request<VPCLattice.Types.GetServiceNetworkVpcAssociationResponse, AWSError>;
  /**
   * Retrieves information about the association between a service network and a VPC.
   */
  getServiceNetworkVpcAssociation(callback?: (err: AWSError, data: VPCLattice.Types.GetServiceNetworkVpcAssociationResponse) => void): Request<VPCLattice.Types.GetServiceNetworkVpcAssociationResponse, AWSError>;
  /**
   * Retrieves information about the specified target group.
   */
  getTargetGroup(params: VPCLattice.Types.GetTargetGroupRequest, callback?: (err: AWSError, data: VPCLattice.Types.GetTargetGroupResponse) => void): Request<VPCLattice.Types.GetTargetGroupResponse, AWSError>;
  /**
   * Retrieves information about the specified target group.
   */
  getTargetGroup(callback?: (err: AWSError, data: VPCLattice.Types.GetTargetGroupResponse) => void): Request<VPCLattice.Types.GetTargetGroupResponse, AWSError>;
  /**
   * Lists all access log subscriptions for the specified service network or service.
   */
  listAccessLogSubscriptions(params: VPCLattice.Types.ListAccessLogSubscriptionsRequest, callback?: (err: AWSError, data: VPCLattice.Types.ListAccessLogSubscriptionsResponse) => void): Request<VPCLattice.Types.ListAccessLogSubscriptionsResponse, AWSError>;
  /**
   * Lists all access log subscriptions for the specified service network or service.
   */
  listAccessLogSubscriptions(callback?: (err: AWSError, data: VPCLattice.Types.ListAccessLogSubscriptionsResponse) => void): Request<VPCLattice.Types.ListAccessLogSubscriptionsResponse, AWSError>;
  /**
   * Lists the listeners for the specified service.
   */
  listListeners(params: VPCLattice.Types.ListListenersRequest, callback?: (err: AWSError, data: VPCLattice.Types.ListListenersResponse) => void): Request<VPCLattice.Types.ListListenersResponse, AWSError>;
  /**
   * Lists the listeners for the specified service.
   */
  listListeners(callback?: (err: AWSError, data: VPCLattice.Types.ListListenersResponse) => void): Request<VPCLattice.Types.ListListenersResponse, AWSError>;
  /**
   * Lists the rules for the listener.
   */
  listRules(params: VPCLattice.Types.ListRulesRequest, callback?: (err: AWSError, data: VPCLattice.Types.ListRulesResponse) => void): Request<VPCLattice.Types.ListRulesResponse, AWSError>;
  /**
   * Lists the rules for the listener.
   */
  listRules(callback?: (err: AWSError, data: VPCLattice.Types.ListRulesResponse) => void): Request<VPCLattice.Types.ListRulesResponse, AWSError>;
  /**
   * Lists the associations between the service network and the service. You can filter the list either by service or service network. You must provide either the service network identifier or the service identifier. Every association in Amazon VPC Lattice is given a unique Amazon Resource Name (ARN), such as when a service network is associated with a VPC or when a service is associated with a service network. If the association is for a resource that is shared with another account, the association will include the local account ID as the prefix in the ARN for each account the resource is shared with.
   */
  listServiceNetworkServiceAssociations(params: VPCLattice.Types.ListServiceNetworkServiceAssociationsRequest, callback?: (err: AWSError, data: VPCLattice.Types.ListServiceNetworkServiceAssociationsResponse) => void): Request<VPCLattice.Types.ListServiceNetworkServiceAssociationsResponse, AWSError>;
  /**
   * Lists the associations between the service network and the service. You can filter the list either by service or service network. You must provide either the service network identifier or the service identifier. Every association in Amazon VPC Lattice is given a unique Amazon Resource Name (ARN), such as when a service network is associated with a VPC or when a service is associated with a service network. If the association is for a resource that is shared with another account, the association will include the local account ID as the prefix in the ARN for each account the resource is shared with.
   */
  listServiceNetworkServiceAssociations(callback?: (err: AWSError, data: VPCLattice.Types.ListServiceNetworkServiceAssociationsResponse) => void): Request<VPCLattice.Types.ListServiceNetworkServiceAssociationsResponse, AWSError>;
  /**
   * Lists the service network and VPC associations. You can filter the list either by VPC or service network. You must provide either the service network identifier or the VPC identifier.
   */
  listServiceNetworkVpcAssociations(params: VPCLattice.Types.ListServiceNetworkVpcAssociationsRequest, callback?: (err: AWSError, data: VPCLattice.Types.ListServiceNetworkVpcAssociationsResponse) => void): Request<VPCLattice.Types.ListServiceNetworkVpcAssociationsResponse, AWSError>;
  /**
   * Lists the service network and VPC associations. You can filter the list either by VPC or service network. You must provide either the service network identifier or the VPC identifier.
   */
  listServiceNetworkVpcAssociations(callback?: (err: AWSError, data: VPCLattice.Types.ListServiceNetworkVpcAssociationsResponse) => void): Request<VPCLattice.Types.ListServiceNetworkVpcAssociationsResponse, AWSError>;
  /**
   * Lists the service networks owned by the caller account or shared with the caller account. Also includes the account ID in the ARN to show which account owns the service network.
   */
  listServiceNetworks(params: VPCLattice.Types.ListServiceNetworksRequest, callback?: (err: AWSError, data: VPCLattice.Types.ListServiceNetworksResponse) => void): Request<VPCLattice.Types.ListServiceNetworksResponse, AWSError>;
  /**
   * Lists the service networks owned by the caller account or shared with the caller account. Also includes the account ID in the ARN to show which account owns the service network.
   */
  listServiceNetworks(callback?: (err: AWSError, data: VPCLattice.Types.ListServiceNetworksResponse) => void): Request<VPCLattice.Types.ListServiceNetworksResponse, AWSError>;
  /**
   * Lists the services owned by the caller account or shared with the caller account.
   */
  listServices(params: VPCLattice.Types.ListServicesRequest, callback?: (err: AWSError, data: VPCLattice.Types.ListServicesResponse) => void): Request<VPCLattice.Types.ListServicesResponse, AWSError>;
  /**
   * Lists the services owned by the caller account or shared with the caller account.
   */
  listServices(callback?: (err: AWSError, data: VPCLattice.Types.ListServicesResponse) => void): Request<VPCLattice.Types.ListServicesResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(params: VPCLattice.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: VPCLattice.Types.ListTagsForResourceResponse) => void): Request<VPCLattice.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: VPCLattice.Types.ListTagsForResourceResponse) => void): Request<VPCLattice.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists your target groups. You can narrow your search by using the filters below in your request.
   */
  listTargetGroups(params: VPCLattice.Types.ListTargetGroupsRequest, callback?: (err: AWSError, data: VPCLattice.Types.ListTargetGroupsResponse) => void): Request<VPCLattice.Types.ListTargetGroupsResponse, AWSError>;
  /**
   * Lists your target groups. You can narrow your search by using the filters below in your request.
   */
  listTargetGroups(callback?: (err: AWSError, data: VPCLattice.Types.ListTargetGroupsResponse) => void): Request<VPCLattice.Types.ListTargetGroupsResponse, AWSError>;
  /**
   * Lists the targets for the target group. By default, all targets are included. You can use this API to check the health status of targets. You can also ﬁlter the results by target. 
   */
  listTargets(params: VPCLattice.Types.ListTargetsRequest, callback?: (err: AWSError, data: VPCLattice.Types.ListTargetsResponse) => void): Request<VPCLattice.Types.ListTargetsResponse, AWSError>;
  /**
   * Lists the targets for the target group. By default, all targets are included. You can use this API to check the health status of targets. You can also ﬁlter the results by target. 
   */
  listTargets(callback?: (err: AWSError, data: VPCLattice.Types.ListTargetsResponse) => void): Request<VPCLattice.Types.ListTargetsResponse, AWSError>;
  /**
   * Creates or updates the auth policy.
   */
  putAuthPolicy(params: VPCLattice.Types.PutAuthPolicyRequest, callback?: (err: AWSError, data: VPCLattice.Types.PutAuthPolicyResponse) => void): Request<VPCLattice.Types.PutAuthPolicyResponse, AWSError>;
  /**
   * Creates or updates the auth policy.
   */
  putAuthPolicy(callback?: (err: AWSError, data: VPCLattice.Types.PutAuthPolicyResponse) => void): Request<VPCLattice.Types.PutAuthPolicyResponse, AWSError>;
  /**
   * Attaches a resource-based permission policy to a service or service network. The policy must contain the same actions and condition statements as the Amazon Web Services Resource Access Manager permission for sharing services and service networks.
   */
  putResourcePolicy(params: VPCLattice.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: VPCLattice.Types.PutResourcePolicyResponse) => void): Request<VPCLattice.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Attaches a resource-based permission policy to a service or service network. The policy must contain the same actions and condition statements as the Amazon Web Services Resource Access Manager permission for sharing services and service networks.
   */
  putResourcePolicy(callback?: (err: AWSError, data: VPCLattice.Types.PutResourcePolicyResponse) => void): Request<VPCLattice.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Registers the targets with the target group. If it's a Lambda target, you can only have one target in a target group.
   */
  registerTargets(params: VPCLattice.Types.RegisterTargetsRequest, callback?: (err: AWSError, data: VPCLattice.Types.RegisterTargetsResponse) => void): Request<VPCLattice.Types.RegisterTargetsResponse, AWSError>;
  /**
   * Registers the targets with the target group. If it's a Lambda target, you can only have one target in a target group.
   */
  registerTargets(callback?: (err: AWSError, data: VPCLattice.Types.RegisterTargetsResponse) => void): Request<VPCLattice.Types.RegisterTargetsResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource.
   */
  tagResource(params: VPCLattice.Types.TagResourceRequest, callback?: (err: AWSError, data: VPCLattice.Types.TagResourceResponse) => void): Request<VPCLattice.Types.TagResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: VPCLattice.Types.TagResourceResponse) => void): Request<VPCLattice.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(params: VPCLattice.Types.UntagResourceRequest, callback?: (err: AWSError, data: VPCLattice.Types.UntagResourceResponse) => void): Request<VPCLattice.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: VPCLattice.Types.UntagResourceResponse) => void): Request<VPCLattice.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the specified access log subscription.
   */
  updateAccessLogSubscription(params: VPCLattice.Types.UpdateAccessLogSubscriptionRequest, callback?: (err: AWSError, data: VPCLattice.Types.UpdateAccessLogSubscriptionResponse) => void): Request<VPCLattice.Types.UpdateAccessLogSubscriptionResponse, AWSError>;
  /**
   * Updates the specified access log subscription.
   */
  updateAccessLogSubscription(callback?: (err: AWSError, data: VPCLattice.Types.UpdateAccessLogSubscriptionResponse) => void): Request<VPCLattice.Types.UpdateAccessLogSubscriptionResponse, AWSError>;
  /**
   * Updates the specified listener for the specified service.
   */
  updateListener(params: VPCLattice.Types.UpdateListenerRequest, callback?: (err: AWSError, data: VPCLattice.Types.UpdateListenerResponse) => void): Request<VPCLattice.Types.UpdateListenerResponse, AWSError>;
  /**
   * Updates the specified listener for the specified service.
   */
  updateListener(callback?: (err: AWSError, data: VPCLattice.Types.UpdateListenerResponse) => void): Request<VPCLattice.Types.UpdateListenerResponse, AWSError>;
  /**
   * Updates a rule for the listener. You can't modify a default listener rule. To modify a default listener rule, use UpdateListener.
   */
  updateRule(params: VPCLattice.Types.UpdateRuleRequest, callback?: (err: AWSError, data: VPCLattice.Types.UpdateRuleResponse) => void): Request<VPCLattice.Types.UpdateRuleResponse, AWSError>;
  /**
   * Updates a rule for the listener. You can't modify a default listener rule. To modify a default listener rule, use UpdateListener.
   */
  updateRule(callback?: (err: AWSError, data: VPCLattice.Types.UpdateRuleResponse) => void): Request<VPCLattice.Types.UpdateRuleResponse, AWSError>;
  /**
   * Updates the specified service.
   */
  updateService(params: VPCLattice.Types.UpdateServiceRequest, callback?: (err: AWSError, data: VPCLattice.Types.UpdateServiceResponse) => void): Request<VPCLattice.Types.UpdateServiceResponse, AWSError>;
  /**
   * Updates the specified service.
   */
  updateService(callback?: (err: AWSError, data: VPCLattice.Types.UpdateServiceResponse) => void): Request<VPCLattice.Types.UpdateServiceResponse, AWSError>;
  /**
   * Updates the specified service network.
   */
  updateServiceNetwork(params: VPCLattice.Types.UpdateServiceNetworkRequest, callback?: (err: AWSError, data: VPCLattice.Types.UpdateServiceNetworkResponse) => void): Request<VPCLattice.Types.UpdateServiceNetworkResponse, AWSError>;
  /**
   * Updates the specified service network.
   */
  updateServiceNetwork(callback?: (err: AWSError, data: VPCLattice.Types.UpdateServiceNetworkResponse) => void): Request<VPCLattice.Types.UpdateServiceNetworkResponse, AWSError>;
  /**
   * Updates the service network and VPC association. Once you add a security group, it cannot be removed.
   */
  updateServiceNetworkVpcAssociation(params: VPCLattice.Types.UpdateServiceNetworkVpcAssociationRequest, callback?: (err: AWSError, data: VPCLattice.Types.UpdateServiceNetworkVpcAssociationResponse) => void): Request<VPCLattice.Types.UpdateServiceNetworkVpcAssociationResponse, AWSError>;
  /**
   * Updates the service network and VPC association. Once you add a security group, it cannot be removed.
   */
  updateServiceNetworkVpcAssociation(callback?: (err: AWSError, data: VPCLattice.Types.UpdateServiceNetworkVpcAssociationResponse) => void): Request<VPCLattice.Types.UpdateServiceNetworkVpcAssociationResponse, AWSError>;
  /**
   * Updates the specified target group.
   */
  updateTargetGroup(params: VPCLattice.Types.UpdateTargetGroupRequest, callback?: (err: AWSError, data: VPCLattice.Types.UpdateTargetGroupResponse) => void): Request<VPCLattice.Types.UpdateTargetGroupResponse, AWSError>;
  /**
   * Updates the specified target group.
   */
  updateTargetGroup(callback?: (err: AWSError, data: VPCLattice.Types.UpdateTargetGroupResponse) => void): Request<VPCLattice.Types.UpdateTargetGroupResponse, AWSError>;
}
declare namespace VPCLattice {
  export type AccessLogDestinationArn = string;
  export type AccessLogSubscriptionArn = string;
  export type AccessLogSubscriptionId = string;
  export type AccessLogSubscriptionIdentifier = string;
  export type AccessLogSubscriptionList = AccessLogSubscriptionSummary[];
  export interface AccessLogSubscriptionSummary {
    /**
     * The Amazon Resource Name (ARN) of the access log subscription
     */
    arn: AccessLogSubscriptionArn;
    /**
     * The date and time that the access log subscription was created, specified in ISO-8601 format.
     */
    createdAt: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the destination.
     */
    destinationArn: AccessLogDestinationArn;
    /**
     * The ID of the access log subscription.
     */
    id: AccessLogSubscriptionId;
    /**
     * The date and time that the access log subscription was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the service or service network.
     */
    resourceArn: ResourceArn;
    /**
     * The ID of the service or service network.
     */
    resourceId: ResourceId;
  }
  export type AccountId = string;
  export type Arn = string;
  export type AuthPolicyState = "Active"|"Inactive"|string;
  export type AuthPolicyString = string;
  export type AuthType = "NONE"|"AWS_IAM"|string;
  export interface BatchUpdateRuleRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the listener.
     */
    listenerIdentifier: ListenerIdentifier;
    /**
     * The rules for the specified listener.
     */
    rules: RuleUpdateList;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface BatchUpdateRuleResponse {
    /**
     * The rules that were successfully updated.
     */
    successful?: RuleUpdateSuccessList;
    /**
     * The rules that the operation couldn't update.
     */
    unsuccessful?: RuleUpdateFailureList;
  }
  export type Boolean = boolean;
  export type CertificateArn = string;
  export type ClientToken = string;
  export interface CreateAccessLogSubscriptionRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you retry a request that completed successfully using the same client token and parameters, the retry succeeds without performing any actions. If the parameters aren't identical, the retry fails.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the destination. The supported destination types are CloudWatch Log groups, Kinesis Data Firehose delivery streams, and Amazon S3 buckets.
     */
    destinationArn: AccessLogDestinationArn;
    /**
     * The ID or Amazon Resource Name (ARN) of the service network or service.
     */
    resourceIdentifier: ResourceIdentifier;
    /**
     * The tags for the access log subscription.
     */
    tags?: TagMap;
  }
  export interface CreateAccessLogSubscriptionResponse {
    /**
     * The Amazon Resource Name (ARN) of the access log subscription.
     */
    arn: AccessLogSubscriptionArn;
    /**
     * The Amazon Resource Name (ARN) of the log destination.
     */
    destinationArn: AccessLogDestinationArn;
    /**
     * The ID of the access log subscription.
     */
    id: AccessLogSubscriptionId;
    /**
     * The Amazon Resource Name (ARN) of the service network or service.
     */
    resourceArn: ResourceArn;
    /**
     * The ID of the service network or service.
     */
    resourceId: ResourceId;
  }
  export interface CreateListenerRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you retry a request that completed successfully using the same client token and parameters, the retry succeeds without performing any actions. If the parameters aren't identical, the retry fails.
     */
    clientToken?: ClientToken;
    /**
     * The action for the default rule. Each listener has a default rule. Each rule consists of a priority, one or more actions, and one or more conditions. The default rule is the rule that's used if no other rules match. Each rule must include exactly one of the following types of actions: forward or fixed-response, and it must be the last action to be performed. 
     */
    defaultAction: RuleAction;
    /**
     * The name of the listener. A listener name must be unique within a service. The valid characters are a-z, 0-9, and hyphens (-). You can't use a hyphen as the first or last character, or immediately after another hyphen.
     */
    name: ListenerName;
    /**
     * The listener port. You can specify a value from 1 to 65535. For HTTP, the default is 80. For HTTPS, the default is 443.
     */
    port?: Port;
    /**
     * The listener protocol HTTP or HTTPS.
     */
    protocol: ListenerProtocol;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
    /**
     * The tags for the listener.
     */
    tags?: TagMap;
  }
  export interface CreateListenerResponse {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    arn?: ListenerArn;
    /**
     * The action for the default rule.
     */
    defaultAction?: RuleAction;
    /**
     * The ID of the listener.
     */
    id?: ListenerId;
    /**
     * The name of the listener.
     */
    name?: ListenerName;
    /**
     * The port number of the listener.
     */
    port?: Port;
    /**
     * The protocol of the listener.
     */
    protocol?: ListenerProtocol;
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    serviceArn?: ServiceArn;
    /**
     * The ID of the service.
     */
    serviceId?: ServiceId;
  }
  export interface CreateRuleRequest {
    /**
     * The action for the default rule.
     */
    action: RuleAction;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you retry a request that completed successfully using the same client token and parameters, the retry succeeds without performing any actions. If the parameters aren't identical, the retry fails.
     */
    clientToken?: ClientToken;
    /**
     * The ID or Amazon Resource Name (ARN) of the listener.
     */
    listenerIdentifier: ListenerIdentifier;
    /**
     * The rule match.
     */
    match: RuleMatch;
    /**
     * The name of the rule. The name must be unique within the listener. The valid characters are a-z, 0-9, and hyphens (-). You can't use a hyphen as the first or last character, or immediately after another hyphen.
     */
    name: RuleName;
    /**
     * The priority assigned to the rule. Each rule for a specific listener must have a unique priority. The lower the priority number the higher the priority.
     */
    priority: RulePriority;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
    /**
     * The tags for the rule.
     */
    tags?: TagMap;
  }
  export interface CreateRuleResponse {
    /**
     * The rule action. Each rule must include exactly one of the following types of actions: forward or fixed-response, and it must be the last action to be performed.
     */
    action?: RuleAction;
    /**
     * The Amazon Resource Name (ARN) of the rule.
     */
    arn?: RuleArn;
    /**
     * The ID of the rule.
     */
    id?: RuleId;
    /**
     * The rule match. The RuleMatch must be an HttpMatch. This means that the rule should be an exact match on HTTP constraints which are made up of the HTTP method, path, and header.
     */
    match?: RuleMatch;
    /**
     * The name of the rule.
     */
    name?: RuleName;
    /**
     * The priority assigned to the rule. The lower the priority number the higher the priority.
     */
    priority?: RulePriority;
  }
  export interface CreateServiceNetworkRequest {
    /**
     * The type of IAM policy.    NONE: The resource does not use an IAM policy. This is the default.    AWS_IAM: The resource uses an IAM policy. When this type is used, auth is enabled and an auth policy is required.  
     */
    authType?: AuthType;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you retry a request that completed successfully using the same client token and parameters, the retry succeeds without performing any actions. If the parameters aren't identical, the retry fails.
     */
    clientToken?: ClientToken;
    /**
     * The name of the service network. The name must be unique to the account. The valid characters are a-z, 0-9, and hyphens (-). You can't use a hyphen as the first or last character, or immediately after another hyphen.
     */
    name: ServiceNetworkName;
    /**
     * The tags for the service network.
     */
    tags?: TagMap;
  }
  export interface CreateServiceNetworkResponse {
    /**
     * The Amazon Resource Name (ARN) of the service network.
     */
    arn?: ServiceNetworkArn;
    /**
     * The type of IAM policy.
     */
    authType?: AuthType;
    /**
     * The ID of the service network.
     */
    id?: ServiceNetworkId;
    /**
     * The name of the service network.
     */
    name?: ServiceNetworkName;
  }
  export interface CreateServiceNetworkServiceAssociationRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you retry a request that completed successfully using the same client token and parameters, the retry succeeds without performing any actions. If the parameters aren't identical, the retry fails.
     */
    clientToken?: ClientToken;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the service network. You must use the ARN if the resources specified in the operation are in different accounts.
     */
    serviceNetworkIdentifier: ServiceNetworkIdentifier;
    /**
     * The tags for the association.
     */
    tags?: TagMap;
  }
  export interface CreateServiceNetworkServiceAssociationResponse {
    /**
     * The Amazon Resource Name (ARN) of the association.
     */
    arn?: ServiceNetworkServiceAssociationArn;
    /**
     * The account that created the association.
     */
    createdBy?: AccountId;
    /**
     * The custom domain name of the service.
     */
    customDomainName?: ServiceCustomDomainName;
    /**
     * The DNS name of the service.
     */
    dnsEntry?: DnsEntry;
    /**
     * The ID of the association.
     */
    id?: ServiceNetworkServiceAssociationIdentifier;
    /**
     * The operation's status.
     */
    status?: ServiceNetworkServiceAssociationStatus;
  }
  export interface CreateServiceNetworkVpcAssociationRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you retry a request that completed successfully using the same client token and parameters, the retry succeeds without performing any actions. If the parameters aren't identical, the retry fails.
     */
    clientToken?: ClientToken;
    /**
     * The IDs of the security groups. Security groups aren't added by default. You can add a security group to apply network level controls to control which resources in a VPC are allowed to access the service network and its services. For more information, see Control traffic to resources using security groups in the Amazon VPC User Guide.
     */
    securityGroupIds?: CreateServiceNetworkVpcAssociationRequestSecurityGroupIdsList;
    /**
     * The ID or Amazon Resource Name (ARN) of the service network. You must use the ARN when the resources specified in the operation are in different accounts.
     */
    serviceNetworkIdentifier: ServiceNetworkIdentifier;
    /**
     * The tags for the association.
     */
    tags?: TagMap;
    /**
     * The ID of the VPC.
     */
    vpcIdentifier: VpcId;
  }
  export type CreateServiceNetworkVpcAssociationRequestSecurityGroupIdsList = SecurityGroupId[];
  export interface CreateServiceNetworkVpcAssociationResponse {
    /**
     * The Amazon Resource Name (ARN) of the association.
     */
    arn?: ServiceNetworkVpcAssociationArn;
    /**
     * The account that created the association.
     */
    createdBy?: AccountId;
    /**
     * The ID of the association.
     */
    id?: ServiceNetworkVpcAssociationId;
    /**
     * The IDs of the security groups.
     */
    securityGroupIds?: SecurityGroupList;
    /**
     * The operation's status.
     */
    status?: ServiceNetworkVpcAssociationStatus;
  }
  export interface CreateServiceRequest {
    /**
     * The type of IAM policy.    NONE: The resource does not use an IAM policy. This is the default.    AWS_IAM: The resource uses an IAM policy. When this type is used, auth is enabled and an auth policy is required.  
     */
    authType?: AuthType;
    /**
     * The Amazon Resource Name (ARN) of the certificate.
     */
    certificateArn?: CertificateArn;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you retry a request that completed successfully using the same client token and parameters, the retry succeeds without performing any actions. If the parameters aren't identical, the retry fails.
     */
    clientToken?: ClientToken;
    /**
     * The custom domain name of the service.
     */
    customDomainName?: ServiceCustomDomainName;
    /**
     * The name of the service. The name must be unique within the account. The valid characters are a-z, 0-9, and hyphens (-). You can't use a hyphen as the first or last character, or immediately after another hyphen.
     */
    name: ServiceName;
    /**
     * The tags for the service.
     */
    tags?: TagMap;
  }
  export interface CreateServiceResponse {
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    arn?: ServiceArn;
    /**
     * The type of IAM policy.
     */
    authType?: AuthType;
    /**
     * The Amazon Resource Name (ARN) of the certificate.
     */
    certificateArn?: CertificateArn;
    /**
     * The custom domain name of the service.
     */
    customDomainName?: ServiceCustomDomainName;
    /**
     * The public DNS name of the service.
     */
    dnsEntry?: DnsEntry;
    /**
     * The ID of the service.
     */
    id?: ServiceId;
    /**
     * The name of the service.
     */
    name?: ServiceName;
    /**
     * The status. If the status is CREATE_FAILED, you will have to delete and recreate the service.
     */
    status?: ServiceStatus;
  }
  export interface CreateTargetGroupRequest {
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. If you retry a request that completed successfully using the same client token and parameters, the retry succeeds without performing any actions. If the parameters aren't identical, the retry fails.
     */
    clientToken?: ClientToken;
    /**
     * The target group configuration. If type is set to LAMBDA, this parameter doesn't apply.
     */
    config?: TargetGroupConfig;
    /**
     * The name of the target group. The name must be unique within the account. The valid characters are a-z, 0-9, and hyphens (-). You can't use a hyphen as the first or last character, or immediately after another hyphen.
     */
    name: TargetGroupName;
    /**
     * The tags for the target group.
     */
    tags?: TagMap;
    /**
     * The type of target group.
     */
    type: TargetGroupType;
  }
  export interface CreateTargetGroupResponse {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    arn?: TargetGroupArn;
    /**
     * The target group configuration. If type is set to LAMBDA, this parameter doesn't apply.
     */
    config?: TargetGroupConfig;
    /**
     * The ID of the target group.
     */
    id?: TargetGroupId;
    /**
     * The name of the target group.
     */
    name?: TargetGroupName;
    /**
     * The operation's status. You can retry the operation if the status is CREATE_FAILED. However, if you retry it while the status is CREATE_IN_PROGRESS, there is no change in the status. 
     */
    status?: TargetGroupStatus;
    /**
     * The type of target group.
     */
    type?: TargetGroupType;
  }
  export interface DeleteAccessLogSubscriptionRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the access log subscription.
     */
    accessLogSubscriptionIdentifier: AccessLogSubscriptionIdentifier;
  }
  export interface DeleteAccessLogSubscriptionResponse {
  }
  export interface DeleteAuthPolicyRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the resource.
     */
    resourceIdentifier: ResourceIdentifier;
  }
  export interface DeleteAuthPolicyResponse {
  }
  export interface DeleteListenerRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the listener.
     */
    listenerIdentifier: ListenerIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface DeleteListenerResponse {
  }
  export interface DeleteResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: ResourceArn;
  }
  export interface DeleteResourcePolicyResponse {
  }
  export interface DeleteRuleRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the listener.
     */
    listenerIdentifier: ListenerIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the rule.
     */
    ruleIdentifier: RuleIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface DeleteRuleResponse {
  }
  export interface DeleteServiceNetworkRequest {
    /**
     * The Amazon Resource Name (ARN) or ID of the service network.
     */
    serviceNetworkIdentifier: ServiceNetworkIdentifier;
  }
  export interface DeleteServiceNetworkResponse {
  }
  export interface DeleteServiceNetworkServiceAssociationRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the association.
     */
    serviceNetworkServiceAssociationIdentifier: ServiceNetworkServiceAssociationIdentifier;
  }
  export interface DeleteServiceNetworkServiceAssociationResponse {
    /**
     * The Amazon Resource Name (ARN) of the association.
     */
    arn?: ServiceNetworkServiceAssociationArn;
    /**
     * The ID of the association.
     */
    id?: ServiceNetworkServiceAssociationIdentifier;
    /**
     * The operation's status. You can retry the operation if the status is DELETE_FAILED. However, if you retry it when the status is DELETE_IN_PROGRESS, there is no change in the status.
     */
    status?: ServiceNetworkServiceAssociationStatus;
  }
  export interface DeleteServiceNetworkVpcAssociationRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the association.
     */
    serviceNetworkVpcAssociationIdentifier: ServiceNetworkVpcAssociationIdentifier;
  }
  export interface DeleteServiceNetworkVpcAssociationResponse {
    /**
     * The Amazon Resource Name (ARN) of the association.
     */
    arn?: ServiceNetworkVpcAssociationArn;
    /**
     * The ID of the association.
     */
    id?: ServiceNetworkVpcAssociationId;
    /**
     * The status. You can retry the operation if the status is DELETE_FAILED. However, if you retry it when the status is DELETE_IN_PROGRESS, there is no change in the status.
     */
    status?: ServiceNetworkVpcAssociationStatus;
  }
  export interface DeleteServiceRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface DeleteServiceResponse {
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    arn?: ServiceArn;
    /**
     * The ID of the service.
     */
    id?: ServiceId;
    /**
     * The name of the service.
     */
    name?: ServiceName;
    /**
     * The status. You can retry the operation if the status is DELETE_FAILED. However, if you retry it while the status is DELETE_IN_PROGRESS, the status doesn't change.
     */
    status?: ServiceStatus;
  }
  export interface DeleteTargetGroupRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the target group.
     */
    targetGroupIdentifier: TargetGroupIdentifier;
  }
  export interface DeleteTargetGroupResponse {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    arn?: TargetGroupArn;
    /**
     * The ID of the target group.
     */
    id?: TargetGroupId;
    /**
     * The status. You can retry the operation if the status is DELETE_FAILED. However, if you retry it while the status is DELETE_IN_PROGRESS, the status doesn't change.
     */
    status?: TargetGroupStatus;
  }
  export interface DeregisterTargetsRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the target group.
     */
    targetGroupIdentifier: TargetGroupIdentifier;
    /**
     * The targets to deregister.
     */
    targets: DeregisterTargetsRequestTargetsList;
  }
  export type DeregisterTargetsRequestTargetsList = Target[];
  export interface DeregisterTargetsResponse {
    /**
     * The targets that were successfully deregistered.
     */
    successful?: TargetList;
    /**
     * The targets that the operation couldn't deregister.
     */
    unsuccessful?: TargetFailureList;
  }
  export interface DnsEntry {
    /**
     * The domain name of the service.
     */
    domainName?: String;
    /**
     * The ID of the hosted zone.
     */
    hostedZoneId?: String;
  }
  export type FailureCode = string;
  export type FailureMessage = string;
  export interface FixedResponseAction {
    /**
     * The HTTP response code.
     */
    statusCode: HttpStatusCode;
  }
  export interface ForwardAction {
    /**
     * The target groups. Traffic matching the rule is forwarded to the specified target groups. With forward actions, you can assign a weight that controls the prioritization and selection of each target group. This means that requests are distributed to individual target groups based on their weights. For example, if two target groups have the same weight, each target group receives half of the traffic. The default value is 1. This means that if only one target group is provided, there is no need to set the weight; 100% of traffic will go to that target group.
     */
    targetGroups: WeightedTargetGroupList;
  }
  export interface GetAccessLogSubscriptionRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the access log subscription.
     */
    accessLogSubscriptionIdentifier: AccessLogSubscriptionIdentifier;
  }
  export interface GetAccessLogSubscriptionResponse {
    /**
     * The Amazon Resource Name (ARN) of the access log subscription.
     */
    arn: AccessLogSubscriptionArn;
    /**
     * The date and time that the access log subscription was created, specified in ISO-8601 format.
     */
    createdAt: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the access log destination.
     */
    destinationArn: AccessLogDestinationArn;
    /**
     * The ID of the access log subscription.
     */
    id: AccessLogSubscriptionId;
    /**
     * The date and time that the access log subscription was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the service network or service.
     */
    resourceArn: ResourceArn;
    /**
     * The ID of the service network or service.
     */
    resourceId: ResourceId;
  }
  export interface GetAuthPolicyRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the service network or service.
     */
    resourceIdentifier: ResourceIdentifier;
  }
  export interface GetAuthPolicyResponse {
    /**
     * The date and time that the auth policy was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The date and time that the auth policy was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The auth policy.
     */
    policy?: AuthPolicyString;
    /**
     * The state of the auth policy. The auth policy is only active when the auth type is set to Amazon Web Services_IAM. If you provide a policy, then authentication and authorization decisions are made based on this policy and the client's IAM policy. If the auth type is NONE, then any auth policy you provide will remain inactive. For more information, see Create a service network in the Amazon VPC Lattice User Guide.
     */
    state?: AuthPolicyState;
  }
  export interface GetListenerRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the listener.
     */
    listenerIdentifier: ListenerIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface GetListenerResponse {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    arn?: ListenerArn;
    /**
     * The date and time that the listener was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The actions for the default listener rule.
     */
    defaultAction?: RuleAction;
    /**
     * The ID of the listener.
     */
    id?: ListenerId;
    /**
     * The date and time that the listener was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The name of the listener.
     */
    name?: ListenerName;
    /**
     * The listener port.
     */
    port?: Port;
    /**
     * The listener protocol.
     */
    protocol?: ListenerProtocol;
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    serviceArn?: ServiceArn;
    /**
     * The ID of the service.
     */
    serviceId?: ServiceId;
  }
  export interface GetResourcePolicyRequest {
    /**
     * An IAM policy.
     */
    resourceArn: ResourceArn;
  }
  export interface GetResourcePolicyResponse {
    /**
     * The Amazon Resource Name (ARN) of the service network or service.
     */
    policy?: PolicyString;
  }
  export interface GetRuleRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the listener.
     */
    listenerIdentifier: ListenerIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the listener rule.
     */
    ruleIdentifier: RuleIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface GetRuleResponse {
    /**
     * The action for the default rule.
     */
    action?: RuleAction;
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    arn?: RuleArn;
    /**
     * The date and time that the listener rule was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The ID of the listener.
     */
    id?: RuleId;
    /**
     * Indicates whether this is the default rule.
     */
    isDefault?: Boolean;
    /**
     * The date and time that the listener rule was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The rule match.
     */
    match?: RuleMatch;
    /**
     * The name of the listener.
     */
    name?: RuleName;
    /**
     * The priority level for the specified rule.
     */
    priority?: RulePriority;
  }
  export interface GetServiceNetworkRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the service network.
     */
    serviceNetworkIdentifier: ServiceNetworkIdentifier;
  }
  export interface GetServiceNetworkResponse {
    /**
     * The Amazon Resource Name (ARN) of the service network.
     */
    arn?: ServiceNetworkArn;
    /**
     * The type of IAM policy.
     */
    authType?: AuthType;
    /**
     * The date and time that the service network was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The ID of the service network.
     */
    id?: ServiceNetworkId;
    /**
     * The date and time of the last update, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The name of the service network.
     */
    name?: ServiceNetworkName;
    /**
     * The number of services associated with the service network.
     */
    numberOfAssociatedServices?: Long;
    /**
     * The number of VPCs associated with the service network.
     */
    numberOfAssociatedVPCs?: Long;
  }
  export interface GetServiceNetworkServiceAssociationRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the association.
     */
    serviceNetworkServiceAssociationIdentifier: ServiceNetworkServiceAssociationIdentifier;
  }
  export interface GetServiceNetworkServiceAssociationResponse {
    /**
     * The Amazon Resource Name (ARN) of the association.
     */
    arn?: ServiceNetworkServiceAssociationArn;
    /**
     * The date and time that the association was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The account that created the association.
     */
    createdBy?: AccountId;
    /**
     * The custom domain name of the service. 
     */
    customDomainName?: ServiceCustomDomainName;
    /**
     * The DNS name of the service.
     */
    dnsEntry?: DnsEntry;
    /**
     * The failure code.
     */
    failureCode?: String;
    /**
     * The failure message.
     */
    failureMessage?: String;
    /**
     * The ID of the service network and service association.
     */
    id?: ServiceNetworkServiceAssociationIdentifier;
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    serviceArn?: ServiceArn;
    /**
     * The ID of the service.
     */
    serviceId?: ServiceId;
    /**
     * The name of the service.
     */
    serviceName?: ServiceName;
    /**
     * The Amazon Resource Name (ARN) of the service network.
     */
    serviceNetworkArn?: ServiceNetworkArn;
    /**
     * The ID of the service network.
     */
    serviceNetworkId?: ServiceNetworkId;
    /**
     * The name of the service network.
     */
    serviceNetworkName?: ServiceNetworkName;
    /**
     * The status of the association.
     */
    status?: ServiceNetworkServiceAssociationStatus;
  }
  export interface GetServiceNetworkVpcAssociationRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the association.
     */
    serviceNetworkVpcAssociationIdentifier: ServiceNetworkVpcAssociationIdentifier;
  }
  export interface GetServiceNetworkVpcAssociationResponse {
    /**
     * The Amazon Resource Name (ARN) of the association.
     */
    arn?: ServiceNetworkVpcAssociationArn;
    /**
     * The date and time that the association was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The account that created the association.
     */
    createdBy?: AccountId;
    /**
     * The failure code.
     */
    failureCode?: String;
    /**
     * The failure message.
     */
    failureMessage?: String;
    /**
     * The ID of the specified association between the service network and the VPC.
     */
    id?: ServiceNetworkVpcAssociationId;
    /**
     * The date and time that the association was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The IDs of the security groups.
     */
    securityGroupIds?: SecurityGroupList;
    /**
     * The Amazon Resource Name (ARN) of the service network.
     */
    serviceNetworkArn?: ServiceNetworkArn;
    /**
     * The ID of the service network.
     */
    serviceNetworkId?: ServiceNetworkId;
    /**
     * The name of the service network.
     */
    serviceNetworkName?: ServiceNetworkName;
    /**
     * The status of the association.
     */
    status?: ServiceNetworkVpcAssociationStatus;
    /**
     * The ID of the VPC.
     */
    vpcId?: VpcId;
  }
  export interface GetServiceRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface GetServiceResponse {
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    arn?: ServiceArn;
    /**
     * The type of IAM policy.
     */
    authType?: AuthType;
    /**
     * The Amazon Resource Name (ARN) of the certificate.
     */
    certificateArn?: CertificateArn;
    /**
     * The date and time that the service was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The custom domain name of the service.
     */
    customDomainName?: ServiceCustomDomainName;
    /**
     * The DNS name of the service.
     */
    dnsEntry?: DnsEntry;
    /**
     * The failure code.
     */
    failureCode?: FailureCode;
    /**
     * The failure message.
     */
    failureMessage?: FailureMessage;
    /**
     * The ID of the service.
     */
    id?: ServiceId;
    /**
     * The date and time that the service was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The name of the service.
     */
    name?: ServiceName;
    /**
     * The status of the service.
     */
    status?: ServiceStatus;
  }
  export interface GetTargetGroupRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the target group.
     */
    targetGroupIdentifier: TargetGroupIdentifier;
  }
  export interface GetTargetGroupResponse {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    arn?: TargetGroupArn;
    /**
     * The target group configuration.
     */
    config?: TargetGroupConfig;
    /**
     * The date and time that the target group was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The failure code.
     */
    failureCode?: String;
    /**
     * The failure message.
     */
    failureMessage?: String;
    /**
     * The ID of the target group.
     */
    id?: TargetGroupId;
    /**
     * The date and time that the target group was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The name of the target group.
     */
    name?: TargetGroupName;
    /**
     * The Amazon Resource Names (ARNs) of the service.
     */
    serviceArns?: ServiceArnList;
    /**
     * The status.
     */
    status?: TargetGroupStatus;
    /**
     * The target group type.
     */
    type?: TargetGroupType;
  }
  export interface HeaderMatch {
    /**
     * Indicates whether the match is case sensitive. Defaults to false.
     */
    caseSensitive?: Boolean;
    /**
     * The header match type.
     */
    match: HeaderMatchType;
    /**
     * The name of the header.
     */
    name: HeaderMatchName;
  }
  export type HeaderMatchContains = string;
  export type HeaderMatchExact = string;
  export type HeaderMatchList = HeaderMatch[];
  export type HeaderMatchName = string;
  export type HeaderMatchPrefix = string;
  export interface HeaderMatchType {
    /**
     * Specifies a contains type match.
     */
    contains?: HeaderMatchContains;
    /**
     * Specifies an exact type match.
     */
    exact?: HeaderMatchExact;
    /**
     * Specifies a prefix type match. Matches the value with the prefix.
     */
    prefix?: HeaderMatchPrefix;
  }
  export interface HealthCheckConfig {
    /**
     * Indicates whether health checking is enabled.
     */
    enabled?: Boolean;
    /**
     * The approximate amount of time, in seconds, between health checks of an individual target. The range is 5–300 seconds. The default is 30 seconds.
     */
    healthCheckIntervalSeconds?: HealthCheckIntervalSeconds;
    /**
     * The amount of time, in seconds, to wait before reporting a target as unhealthy. The range is 1–120 seconds. The default is 5 seconds.
     */
    healthCheckTimeoutSeconds?: HealthCheckTimeoutSeconds;
    /**
     * The number of consecutive successful health checks required before considering an unhealthy target healthy. The range is 2–10. The default is 5.
     */
    healthyThresholdCount?: HealthyThresholdCount;
    /**
     * The codes to use when checking for a successful response from a target. These are called Success codes in the console.
     */
    matcher?: Matcher;
    /**
     * The destination for health checks on the targets. If the protocol version is HTTP/1.1 or HTTP/2, specify a valid URI (for example, /path?query). The default path is /. Health checks are not supported if the protocol version is gRPC, however, you can choose HTTP/1.1 or HTTP/2 and specify a valid URI.
     */
    path?: HealthCheckPath;
    /**
     * The port used when performing health checks on targets. The default setting is the port that a target receives traffic on.
     */
    port?: HealthCheckPort;
    /**
     * The protocol used when performing health checks on targets. The possible protocols are HTTP and HTTPS. The default is HTTP.
     */
    protocol?: TargetGroupProtocol;
    /**
     * The protocol version used when performing health checks on targets. The possible protocol versions are HTTP1 and HTTP2.
     */
    protocolVersion?: HealthCheckProtocolVersion;
    /**
     * The number of consecutive failed health checks required before considering a target unhealthy. The range is 2–10. The default is 2.
     */
    unhealthyThresholdCount?: UnhealthyThresholdCount;
  }
  export type HealthCheckIntervalSeconds = number;
  export type HealthCheckPath = string;
  export type HealthCheckPort = number;
  export type HealthCheckProtocolVersion = "HTTP1"|"HTTP2"|string;
  export type HealthCheckTimeoutSeconds = number;
  export type HealthyThresholdCount = number;
  export type HttpCodeMatcher = string;
  export interface HttpMatch {
    /**
     * The header matches. Matches incoming requests with rule based on request header value before applying rule action.
     */
    headerMatches?: HeaderMatchList;
    /**
     * The HTTP method type.
     */
    method?: HttpMethod;
    /**
     * The path match.
     */
    pathMatch?: PathMatch;
  }
  export type HttpMethod = string;
  export type HttpStatusCode = number;
  export type IpAddressType = "IPV4"|"IPV6"|string;
  export type LambdaEventStructureVersion = "V1"|"V2"|string;
  export interface ListAccessLogSubscriptionsRequest {
    /**
     * The maximum number of results to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token for the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The ID or Amazon Resource Name (ARN) of the service network or service.
     */
    resourceIdentifier: ResourceIdentifier;
  }
  export interface ListAccessLogSubscriptionsResponse {
    /**
     * The access log subscriptions.
     */
    items: AccessLogSubscriptionList;
    /**
     * A pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListListenersRequest {
    /**
     * The maximum number of results to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token for the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface ListListenersResponse {
    /**
     * Information about the listeners.
     */
    items: ListenerSummaryList;
    /**
     * If there are additional results, a pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListRulesRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the listener.
     */
    listenerIdentifier: ListenerIdentifier;
    /**
     * The maximum number of results to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token for the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface ListRulesResponse {
    /**
     * Information about the rules.
     */
    items: RuleSummaryList;
    /**
     * If there are additional results, a pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListServiceNetworkServiceAssociationsRequest {
    /**
     * The maximum number of results to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token for the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier?: ServiceIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the service network.
     */
    serviceNetworkIdentifier?: ServiceNetworkIdentifier;
  }
  export interface ListServiceNetworkServiceAssociationsResponse {
    /**
     * Information about the associations.
     */
    items: ServiceNetworkServiceAssociationList;
    /**
     * If there are additional results, a pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListServiceNetworkVpcAssociationsRequest {
    /**
     * The maximum number of results to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token for the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The ID or Amazon Resource Name (ARN) of the service network.
     */
    serviceNetworkIdentifier?: ServiceNetworkIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the VPC.
     */
    vpcIdentifier?: VpcId;
  }
  export interface ListServiceNetworkVpcAssociationsResponse {
    /**
     * Information about the associations.
     */
    items: ServiceNetworkVpcAssociationList;
    /**
     * If there are additional results, a pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListServiceNetworksRequest {
    /**
     * The maximum number of results to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListServiceNetworksResponse {
    /**
     * Information about the service networks.
     */
    items: ServiceNetworkList;
    /**
     * If there are additional results, a pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListServicesRequest {
    /**
     * The maximum number of results to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListServicesResponse {
    /**
     * The services.
     */
    items?: ServiceList;
    /**
     * If there are additional results, a pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags.
     */
    tags?: TagMap;
  }
  export interface ListTargetGroupsRequest {
    /**
     * The maximum number of results to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token for the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The target group type.
     */
    targetGroupType?: TargetGroupType;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    vpcIdentifier?: VpcId;
  }
  export interface ListTargetGroupsResponse {
    /**
     * Information about the target groups.
     */
    items?: TargetGroupList;
    /**
     * If there are additional results, a pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export interface ListTargetsRequest {
    /**
     * The maximum number of results to return.
     */
    maxResults?: MaxResults;
    /**
     * A pagination token for the next page of results.
     */
    nextToken?: NextToken;
    /**
     * The ID or Amazon Resource Name (ARN) of the target group.
     */
    targetGroupIdentifier: TargetGroupIdentifier;
    /**
     * The targets to list.
     */
    targets?: ListTargetsRequestTargetsList;
  }
  export type ListTargetsRequestTargetsList = Target[];
  export interface ListTargetsResponse {
    /**
     * Information about the targets.
     */
    items: TargetSummaryList;
    /**
     * If there are additional results, a pagination token for the next page of results.
     */
    nextToken?: NextToken;
  }
  export type ListenerArn = string;
  export type ListenerId = string;
  export type ListenerIdentifier = string;
  export type ListenerName = string;
  export type ListenerProtocol = "HTTP"|"HTTPS"|string;
  export interface ListenerSummary {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    arn?: ListenerArn;
    /**
     * The date and time that the listener was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The ID of the listener.
     */
    id?: ListenerId;
    /**
     * The date and time that the listener was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The name of the listener.
     */
    name?: ListenerName;
    /**
     * The listener port.
     */
    port?: Port;
    /**
     * The listener protocol.
     */
    protocol?: ListenerProtocol;
  }
  export type ListenerSummaryList = ListenerSummary[];
  export type Long = number;
  export interface Matcher {
    /**
     * The HTTP code to use when checking for a successful response from a target.
     */
    httpCode?: HttpCodeMatcher;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export interface PathMatch {
    /**
     * Indicates whether the match is case sensitive. Defaults to false.
     */
    caseSensitive?: Boolean;
    /**
     * The type of path match.
     */
    match: PathMatchType;
  }
  export type PathMatchExact = string;
  export type PathMatchPrefix = string;
  export interface PathMatchType {
    /**
     * An exact match of the path.
     */
    exact?: PathMatchExact;
    /**
     * A prefix match of the path.
     */
    prefix?: PathMatchPrefix;
  }
  export type PolicyString = string;
  export type Port = number;
  export interface PutAuthPolicyRequest {
    /**
     * The auth policy.
     */
    policy: AuthPolicyString;
    /**
     * The ID or Amazon Resource Name (ARN) of the service network or service for which the policy is created.
     */
    resourceIdentifier: ResourceIdentifier;
  }
  export interface PutAuthPolicyResponse {
    /**
     * The auth policy.
     */
    policy?: AuthPolicyString;
    /**
     * The state of the auth policy. The auth policy is only active when the auth type is set to Amazon Web Services_IAM. If you provide a policy, then authentication and authorization decisions are made based on this policy and the client's IAM policy. If the Auth type is NONE, then, any auth policy you provide will remain inactive. For more information, see Create a service network in the Amazon VPC Lattice User Guide.
     */
    state?: AuthPolicyState;
  }
  export interface PutResourcePolicyRequest {
    /**
     * An IAM policy.
     */
    policy: PolicyString;
    /**
     * The ID or Amazon Resource Name (ARN) of the service network or service for which the policy is created.
     */
    resourceArn: ResourceArn;
  }
  export interface PutResourcePolicyResponse {
  }
  export interface RegisterTargetsRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the target group.
     */
    targetGroupIdentifier: TargetGroupIdentifier;
    /**
     * The targets.
     */
    targets: RegisterTargetsRequestTargetsList;
  }
  export type RegisterTargetsRequestTargetsList = Target[];
  export interface RegisterTargetsResponse {
    /**
     * The targets that were successfully registered.
     */
    successful?: TargetList;
    /**
     * The targets that were not registered.
     */
    unsuccessful?: TargetFailureList;
  }
  export type ResourceArn = string;
  export type ResourceId = string;
  export type ResourceIdentifier = string;
  export interface RuleAction {
    /**
     *  Describes the rule action that returns a custom HTTP response. 
     */
    fixedResponse?: FixedResponseAction;
    /**
     * The forward action. Traffic that matches the rule is forwarded to the specified target groups.
     */
    forward?: ForwardAction;
  }
  export type RuleArn = string;
  export type RuleId = string;
  export type RuleIdentifier = string;
  export interface RuleMatch {
    /**
     * The HTTP criteria that a rule must match.
     */
    httpMatch?: HttpMatch;
  }
  export type RuleName = string;
  export type RulePriority = number;
  export interface RuleSummary {
    /**
     * The Amazon Resource Name (ARN) of the rule.
     */
    arn?: RuleArn;
    /**
     * The date and time that the listener rule was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The ID of the rule.
     */
    id?: RuleId;
    /**
     * Indicates whether this is the default rule. Listener rules are created when you create a listener. Each listener has a default rule for checking connection requests. 
     */
    isDefault?: Boolean;
    /**
     * The date and time that the listener rule was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The name of the rule.
     */
    name?: RuleName;
    /**
     *  The priority of the rule. 
     */
    priority?: RulePriority;
  }
  export type RuleSummaryList = RuleSummary[];
  export interface RuleUpdate {
    /**
     * The rule action.
     */
    action?: RuleAction;
    /**
     * The rule match.
     */
    match?: RuleMatch;
    /**
     * The rule priority. A listener can't have multiple rules with the same priority.
     */
    priority?: RulePriority;
    /**
     * The ID or Amazon Resource Name (ARN) of the rule.
     */
    ruleIdentifier: RuleIdentifier;
  }
  export interface RuleUpdateFailure {
    /**
     * The failure code.
     */
    failureCode?: FailureCode;
    /**
     * The failure message.
     */
    failureMessage?: FailureMessage;
    /**
     * The ID or Amazon Resource Name (ARN) of the rule.
     */
    ruleIdentifier?: RuleIdentifier;
  }
  export type RuleUpdateFailureList = RuleUpdateFailure[];
  export type RuleUpdateList = RuleUpdate[];
  export interface RuleUpdateSuccess {
    /**
     * The action for the default rule.
     */
    action?: RuleAction;
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    arn?: RuleArn;
    /**
     * The ID of the listener.
     */
    id?: RuleId;
    /**
     * Indicates whether this is the default rule.
     */
    isDefault?: Boolean;
    /**
     * The rule match.
     */
    match?: RuleMatch;
    /**
     * The name of the listener.
     */
    name?: RuleName;
    /**
     * The rule priority.
     */
    priority?: RulePriority;
  }
  export type RuleUpdateSuccessList = RuleUpdateSuccess[];
  export type SecurityGroupId = string;
  export type SecurityGroupList = SecurityGroupId[];
  export type ServiceArn = string;
  export type ServiceArnList = ServiceArn[];
  export type ServiceCustomDomainName = string;
  export type ServiceId = string;
  export type ServiceIdentifier = string;
  export type ServiceList = ServiceSummary[];
  export type ServiceName = string;
  export type ServiceNetworkArn = string;
  export type ServiceNetworkId = string;
  export type ServiceNetworkIdentifier = string;
  export type ServiceNetworkList = ServiceNetworkSummary[];
  export type ServiceNetworkName = string;
  export type ServiceNetworkServiceAssociationArn = string;
  export type ServiceNetworkServiceAssociationIdentifier = string;
  export type ServiceNetworkServiceAssociationList = ServiceNetworkServiceAssociationSummary[];
  export type ServiceNetworkServiceAssociationStatus = "CREATE_IN_PROGRESS"|"ACTIVE"|"DELETE_IN_PROGRESS"|"CREATE_FAILED"|"DELETE_FAILED"|string;
  export interface ServiceNetworkServiceAssociationSummary {
    /**
     * The Amazon Resource Name (ARN) of the association.
     */
    arn?: ServiceNetworkServiceAssociationArn;
    /**
     * The date and time that the association was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The account that created the association.
     */
    createdBy?: AccountId;
    /**
     *  The custom domain name of the service. 
     */
    customDomainName?: ServiceCustomDomainName;
    /**
     * DNS information about the service.
     */
    dnsEntry?: DnsEntry;
    /**
     * The ID of the association.
     */
    id?: ServiceNetworkServiceAssociationIdentifier;
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    serviceArn?: ServiceArn;
    /**
     * The ID of the service.
     */
    serviceId?: ServiceId;
    /**
     * The name of the service.
     */
    serviceName?: ServiceName;
    /**
     * The Amazon Resource Name (ARN) of the service network.
     */
    serviceNetworkArn?: ServiceNetworkArn;
    /**
     * The ID of the service network.
     */
    serviceNetworkId?: ServiceNetworkId;
    /**
     * The name of the service network.
     */
    serviceNetworkName?: ServiceNetworkName;
    /**
     * The status. If the deletion fails, try to delete again.
     */
    status?: ServiceNetworkServiceAssociationStatus;
  }
  export interface ServiceNetworkSummary {
    /**
     * The Amazon Resource Name (ARN) of the service network.
     */
    arn?: ServiceNetworkArn;
    /**
     * The date and time that the service network was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The ID of the service network.
     */
    id?: ServiceNetworkId;
    /**
     * The date and time that the service network was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The name of the service network.
     */
    name?: ServiceNetworkName;
    /**
     * The number of services associated with the service network.
     */
    numberOfAssociatedServices?: Long;
    /**
     * The number of VPCs associated with the service network.
     */
    numberOfAssociatedVPCs?: Long;
  }
  export type ServiceNetworkVpcAssociationArn = string;
  export type ServiceNetworkVpcAssociationId = string;
  export type ServiceNetworkVpcAssociationIdentifier = string;
  export type ServiceNetworkVpcAssociationList = ServiceNetworkVpcAssociationSummary[];
  export type ServiceNetworkVpcAssociationStatus = "CREATE_IN_PROGRESS"|"ACTIVE"|"UPDATE_IN_PROGRESS"|"DELETE_IN_PROGRESS"|"CREATE_FAILED"|"DELETE_FAILED"|"UPDATE_FAILED"|string;
  export interface ServiceNetworkVpcAssociationSummary {
    /**
     * The Amazon Resource Name (ARN) of the association.
     */
    arn?: ServiceNetworkVpcAssociationArn;
    /**
     * The date and time that the association was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The account that created the association.
     */
    createdBy?: AccountId;
    /**
     * The ID of the association.
     */
    id?: ServiceNetworkVpcAssociationId;
    /**
     * The date and time that the association was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the service network.
     */
    serviceNetworkArn?: ServiceNetworkArn;
    /**
     * The ID of the service network.
     */
    serviceNetworkId?: ServiceNetworkId;
    /**
     * The name of the service network.
     */
    serviceNetworkName?: ServiceNetworkName;
    /**
     * The status.
     */
    status?: ServiceNetworkVpcAssociationStatus;
    /**
     * The ID of the VPC.
     */
    vpcId?: VpcId;
  }
  export type ServiceStatus = "ACTIVE"|"CREATE_IN_PROGRESS"|"DELETE_IN_PROGRESS"|"CREATE_FAILED"|"DELETE_FAILED"|string;
  export interface ServiceSummary {
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    arn?: ServiceArn;
    /**
     * The date and time that the service was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     *  The custom domain name of the service. 
     */
    customDomainName?: ServiceCustomDomainName;
    /**
     * DNS information about the service.
     */
    dnsEntry?: DnsEntry;
    /**
     * The ID of the service.
     */
    id?: ServiceId;
    /**
     * The date and time that the service was last updated. The format is ISO-8601.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The name of the service.
     */
    name?: ServiceName;
    /**
     * The status.
     */
    status?: ServiceStatus;
  }
  export type String = string;
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
    /**
     * The tags for the resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface Target {
    /**
     * The ID of the target. If the target type of the target group is INSTANCE, this is an instance ID. If the target type is IP , this is an IP address. If the target type is LAMBDA, this is the ARN of the Lambda function. If the target type is ALB, this is the ARN of the Application Load Balancer.
     */
    id: TargetIdString;
    /**
     * The port on which the target is listening. For HTTP, the default is 80. For HTTPS, the default is 443.
     */
    port?: Port;
  }
  export interface TargetFailure {
    /**
     * The failure code.
     */
    failureCode?: String;
    /**
     * The failure message.
     */
    failureMessage?: String;
    /**
     * The ID of the target. If the target type of the target group is INSTANCE, this is an instance ID. If the target type is IP , this is an IP address. If the target type is LAMBDA, this is the ARN of the Lambda function. If the target type is ALB, this is the ARN of the Application Load Balancer.
     */
    id?: String;
    /**
     * The port on which the target is listening. This parameter doesn't apply if the target is a Lambda function.
     */
    port?: Port;
  }
  export type TargetFailureList = TargetFailure[];
  export type TargetGroupArn = string;
  export interface TargetGroupConfig {
    /**
     * The health check configuration.
     */
    healthCheck?: HealthCheckConfig;
    /**
     * The type of IP address used for the target group. The possible values are ipv4 and ipv6. This is an optional parameter. If not specified, the IP address type defaults to ipv4.
     */
    ipAddressType?: IpAddressType;
    /**
     * Lambda event structure version
     */
    lambdaEventStructureVersion?: LambdaEventStructureVersion;
    /**
     * The port on which the targets are listening. For HTTP, the default is 80. For HTTPS, the default is 443 
     */
    port?: Port;
    /**
     * The protocol to use for routing traffic to the targets. Default is the protocol of a target group.
     */
    protocol?: TargetGroupProtocol;
    /**
     * The protocol version. Default value is HTTP1.
     */
    protocolVersion?: TargetGroupProtocolVersion;
    /**
     * The ID of the VPC.
     */
    vpcIdentifier?: VpcId;
  }
  export type TargetGroupId = string;
  export type TargetGroupIdentifier = string;
  export type TargetGroupList = TargetGroupSummary[];
  export type TargetGroupName = string;
  export type TargetGroupProtocol = "HTTP"|"HTTPS"|string;
  export type TargetGroupProtocolVersion = "HTTP1"|"HTTP2"|"GRPC"|string;
  export type TargetGroupStatus = "CREATE_IN_PROGRESS"|"ACTIVE"|"DELETE_IN_PROGRESS"|"CREATE_FAILED"|"DELETE_FAILED"|string;
  export interface TargetGroupSummary {
    /**
     * The ARN (Amazon Resource Name) of the target group.
     */
    arn?: TargetGroupArn;
    /**
     * The date and time that the target group was created, specified in ISO-8601 format.
     */
    createdAt?: Timestamp;
    /**
     * The ID of the target group.
     */
    id?: TargetGroupId;
    /**
     * The type of IP address used for the target group. The possible values are ipv4 and ipv6. This is an optional parameter. If not specified, the IP address type defaults to ipv4.
     */
    ipAddressType?: IpAddressType;
    /**
     * Lambda event structure version
     */
    lambdaEventStructureVersion?: LambdaEventStructureVersion;
    /**
     * The date and time that the target group was last updated, specified in ISO-8601 format.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * The name of the target group.
     */
    name?: TargetGroupName;
    /**
     * The port of the target group.
     */
    port?: Port;
    /**
     * The protocol of the target group.
     */
    protocol?: TargetGroupProtocol;
    /**
     * The list of Amazon Resource Names (ARNs) of the service.
     */
    serviceArns?: ServiceArnList;
    /**
     * The status.
     */
    status?: TargetGroupStatus;
    /**
     * The target group type.
     */
    type?: TargetGroupType;
    /**
     * The ID of the VPC of the target group.
     */
    vpcIdentifier?: VpcId;
  }
  export type TargetGroupType = "IP"|"LAMBDA"|"INSTANCE"|"ALB"|string;
  export type TargetGroupWeight = number;
  export type TargetIdString = string;
  export type TargetList = Target[];
  export type TargetStatus = "DRAINING"|"UNAVAILABLE"|"HEALTHY"|"UNHEALTHY"|"INITIAL"|"UNUSED"|string;
  export interface TargetSummary {
    /**
     * The ID of the target. If the target type of the target group is INSTANCE, this is an instance ID. If the target type is IP , this is an IP address. If the target type is LAMBDA, this is the ARN of the Lambda function. If the target type is ALB, this is the ARN of the Application Load Balancer.
     */
    id?: String;
    /**
     * The port on which the target is listening.
     */
    port?: Port;
    /**
     * The code for why the target status is what it is.
     */
    reasonCode?: String;
    /**
     * The status of the target.    Draining: The target is being deregistered. No new connections will be sent to this target while current connections are being drained. Default draining time is 5 minutes.    Unavailable: Health checks are unavailable for the target group.    Healthy: The target is healthy.     Unhealthy: The target is unhealthy.    Initial: Initial health checks on the target are being performed.    Unused: Target group is not used in a service.  
     */
    status?: TargetStatus;
  }
  export type TargetSummaryList = TargetSummary[];
  export type Timestamp = Date;
  export type UnhealthyThresholdCount = number;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: Arn;
    /**
     * The tag keys of the tags to remove.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAccessLogSubscriptionRequest {
    /**
     * The ID or Amazon Resource Name (ARN) of the access log subscription.
     */
    accessLogSubscriptionIdentifier: AccessLogSubscriptionIdentifier;
    /**
     * The Amazon Resource Name (ARN) of the access log destination.
     */
    destinationArn: AccessLogDestinationArn;
  }
  export interface UpdateAccessLogSubscriptionResponse {
    /**
     * The Amazon Resource Name (ARN) of the access log subscription.
     */
    arn: AccessLogSubscriptionArn;
    /**
     * The Amazon Resource Name (ARN) of the access log destination.
     */
    destinationArn: AccessLogDestinationArn;
    /**
     * The ID of the access log subscription.
     */
    id: AccessLogSubscriptionId;
    /**
     * The Amazon Resource Name (ARN) of the access log subscription.
     */
    resourceArn: ResourceArn;
    /**
     * The ID of the resource.
     */
    resourceId: ResourceId;
  }
  export interface UpdateListenerRequest {
    /**
     * The action for the default rule.
     */
    defaultAction: RuleAction;
    /**
     * The ID or Amazon Resource Name (ARN) of the listener.
     */
    listenerIdentifier: ListenerIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface UpdateListenerResponse {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    arn?: ListenerArn;
    /**
     * The action for the default rule.
     */
    defaultAction?: RuleAction;
    /**
     * The ID of the listener.
     */
    id?: ListenerId;
    /**
     * The name of the listener.
     */
    name?: ListenerName;
    /**
     * The listener port.
     */
    port?: Port;
    /**
     * The protocol of the listener.
     */
    protocol?: ListenerProtocol;
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    serviceArn?: ServiceArn;
    /**
     * The ID of the service.
     */
    serviceId?: ServiceId;
  }
  export interface UpdateRuleRequest {
    /**
     * Information about the action for the specified listener rule.
     */
    action?: RuleAction;
    /**
     * The ID or Amazon Resource Name (ARN) of the listener.
     */
    listenerIdentifier: ListenerIdentifier;
    /**
     * The rule match.
     */
    match?: RuleMatch;
    /**
     * The rule priority. A listener can't have multiple rules with the same priority.
     */
    priority?: RulePriority;
    /**
     * The ID or Amazon Resource Name (ARN) of the rule.
     */
    ruleIdentifier: RuleIdentifier;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface UpdateRuleResponse {
    /**
     * Information about the action for the specified listener rule.
     */
    action?: RuleAction;
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    arn?: RuleArn;
    /**
     * The ID of the listener.
     */
    id?: RuleId;
    /**
     * Indicates whether this is the default rule.
     */
    isDefault?: Boolean;
    /**
     * The rule match.
     */
    match?: RuleMatch;
    /**
     * The name of the listener.
     */
    name?: RuleName;
    /**
     * The rule priority.
     */
    priority?: RulePriority;
  }
  export interface UpdateServiceNetworkRequest {
    /**
     * The type of IAM policy.    NONE: The resource does not use an IAM policy. This is the default.    AWS_IAM: The resource uses an IAM policy. When this type is used, auth is enabled and an auth policy is required.  
     */
    authType: AuthType;
    /**
     * The ID or Amazon Resource Name (ARN) of the service network.
     */
    serviceNetworkIdentifier: ServiceNetworkIdentifier;
  }
  export interface UpdateServiceNetworkResponse {
    /**
     * The Amazon Resource Name (ARN) of the service network.
     */
    arn?: ServiceNetworkArn;
    /**
     * The type of IAM policy.
     */
    authType?: AuthType;
    /**
     * The ID of the service network.
     */
    id?: ServiceNetworkId;
    /**
     * The name of the service network.
     */
    name?: ServiceNetworkName;
  }
  export interface UpdateServiceNetworkVpcAssociationRequest {
    /**
     * The IDs of the security groups. Once you add a security group, it cannot be removed.
     */
    securityGroupIds: UpdateServiceNetworkVpcAssociationRequestSecurityGroupIdsList;
    /**
     * The ID or Amazon Resource Name (ARN) of the association.
     */
    serviceNetworkVpcAssociationIdentifier: ServiceNetworkVpcAssociationIdentifier;
  }
  export type UpdateServiceNetworkVpcAssociationRequestSecurityGroupIdsList = SecurityGroupId[];
  export interface UpdateServiceNetworkVpcAssociationResponse {
    /**
     * The Amazon Resource Name (ARN) of the association.
     */
    arn?: ServiceNetworkVpcAssociationArn;
    /**
     * The account that created the association.
     */
    createdBy?: AccountId;
    /**
     * The ID of the association.
     */
    id?: ServiceNetworkVpcAssociationId;
    /**
     * The IDs of the security groups.
     */
    securityGroupIds?: SecurityGroupList;
    /**
     * The status. You can retry the operation if the status is DELETE_FAILED. However, if you retry it while the status is DELETE_IN_PROGRESS, there is no change in the status.
     */
    status?: ServiceNetworkVpcAssociationStatus;
  }
  export interface UpdateServiceRequest {
    /**
     * The type of IAM policy.    NONE: The resource does not use an IAM policy. This is the default.    AWS_IAM: The resource uses an IAM policy. When this type is used, auth is enabled and an auth policy is required.  
     */
    authType?: AuthType;
    /**
     * The Amazon Resource Name (ARN) of the certificate. 
     */
    certificateArn?: CertificateArn;
    /**
     * The ID or Amazon Resource Name (ARN) of the service.
     */
    serviceIdentifier: ServiceIdentifier;
  }
  export interface UpdateServiceResponse {
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    arn?: ServiceArn;
    /**
     * The type of IAM policy.
     */
    authType?: AuthType;
    /**
     * The Amazon Resource Name (ARN) of the certificate. 
     */
    certificateArn?: CertificateArn;
    /**
     * The custom domain name of the service.
     */
    customDomainName?: ServiceCustomDomainName;
    /**
     * The ID of the service.
     */
    id?: ServiceId;
    /**
     * The name of the service.
     */
    name?: ServiceName;
  }
  export interface UpdateTargetGroupRequest {
    /**
     * The health check configuration.
     */
    healthCheck: HealthCheckConfig;
    /**
     * The ID or Amazon Resource Name (ARN) of the target group.
     */
    targetGroupIdentifier: TargetGroupIdentifier;
  }
  export interface UpdateTargetGroupResponse {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    arn?: TargetGroupArn;
    /**
     * The target group configuration.
     */
    config?: TargetGroupConfig;
    /**
     * The ID of the target group.
     */
    id?: TargetGroupId;
    /**
     * The name of the target group.
     */
    name?: TargetGroupName;
    /**
     * The status.
     */
    status?: TargetGroupStatus;
    /**
     * The target group type.
     */
    type?: TargetGroupType;
  }
  export type VpcId = string;
  export interface WeightedTargetGroup {
    /**
     * The ID or Amazon Resource Name (ARN) of the target group.
     */
    targetGroupIdentifier: TargetGroupIdentifier;
    /**
     * Only required if you specify multiple target groups for a forward action. The "weight" determines how requests are distributed to the target group. For example, if you specify two target groups, each with a weight of 10, each target group receives half the requests. If you specify two target groups, one with a weight of 10 and the other with a weight of 20, the target group with a weight of 20 receives twice as many requests as the other target group. If there's only one target group specified, then the default value is 100.
     */
    weight?: TargetGroupWeight;
  }
  export type WeightedTargetGroupList = WeightedTargetGroup[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-11-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the VPCLattice client.
   */
  export import Types = VPCLattice;
}
export = VPCLattice;
