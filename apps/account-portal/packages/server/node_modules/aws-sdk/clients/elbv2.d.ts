import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ELBv2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ELBv2.Types.ClientConfiguration)
  config: Config & ELBv2.Types.ClientConfiguration;
  /**
   * Adds the specified SSL server certificate to the certificate list for the specified HTTPS or TLS listener. If the certificate in already in the certificate list, the call is successful but the certificate is not added again. For more information, see HTTPS listeners in the Application Load Balancers Guide or TLS listeners in the Network Load Balancers Guide.
   */
  addListenerCertificates(params: ELBv2.Types.AddListenerCertificatesInput, callback?: (err: AWSError, data: ELBv2.Types.AddListenerCertificatesOutput) => void): Request<ELBv2.Types.AddListenerCertificatesOutput, AWSError>;
  /**
   * Adds the specified SSL server certificate to the certificate list for the specified HTTPS or TLS listener. If the certificate in already in the certificate list, the call is successful but the certificate is not added again. For more information, see HTTPS listeners in the Application Load Balancers Guide or TLS listeners in the Network Load Balancers Guide.
   */
  addListenerCertificates(callback?: (err: AWSError, data: ELBv2.Types.AddListenerCertificatesOutput) => void): Request<ELBv2.Types.AddListenerCertificatesOutput, AWSError>;
  /**
   * Adds the specified tags to the specified Elastic Load Balancing resource. You can tag your Application Load Balancers, Network Load Balancers, Gateway Load Balancers, target groups, listeners, and rules. Each tag consists of a key and an optional value. If a resource already has a tag with the same key, AddTags updates its value.
   */
  addTags(params: ELBv2.Types.AddTagsInput, callback?: (err: AWSError, data: ELBv2.Types.AddTagsOutput) => void): Request<ELBv2.Types.AddTagsOutput, AWSError>;
  /**
   * Adds the specified tags to the specified Elastic Load Balancing resource. You can tag your Application Load Balancers, Network Load Balancers, Gateway Load Balancers, target groups, listeners, and rules. Each tag consists of a key and an optional value. If a resource already has a tag with the same key, AddTags updates its value.
   */
  addTags(callback?: (err: AWSError, data: ELBv2.Types.AddTagsOutput) => void): Request<ELBv2.Types.AddTagsOutput, AWSError>;
  /**
   * Creates a listener for the specified Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. For more information, see the following:    Listeners for your Application Load Balancers     Listeners for your Network Load Balancers     Listeners for your Gateway Load Balancers    This operation is idempotent, which means that it completes at most one time. If you attempt to create multiple listeners with the same settings, each call succeeds.
   */
  createListener(params: ELBv2.Types.CreateListenerInput, callback?: (err: AWSError, data: ELBv2.Types.CreateListenerOutput) => void): Request<ELBv2.Types.CreateListenerOutput, AWSError>;
  /**
   * Creates a listener for the specified Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. For more information, see the following:    Listeners for your Application Load Balancers     Listeners for your Network Load Balancers     Listeners for your Gateway Load Balancers    This operation is idempotent, which means that it completes at most one time. If you attempt to create multiple listeners with the same settings, each call succeeds.
   */
  createListener(callback?: (err: AWSError, data: ELBv2.Types.CreateListenerOutput) => void): Request<ELBv2.Types.CreateListenerOutput, AWSError>;
  /**
   * Creates an Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. For more information, see the following:    Application Load Balancers     Network Load Balancers     Gateway Load Balancers    This operation is idempotent, which means that it completes at most one time. If you attempt to create multiple load balancers with the same settings, each call succeeds.
   */
  createLoadBalancer(params: ELBv2.Types.CreateLoadBalancerInput, callback?: (err: AWSError, data: ELBv2.Types.CreateLoadBalancerOutput) => void): Request<ELBv2.Types.CreateLoadBalancerOutput, AWSError>;
  /**
   * Creates an Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. For more information, see the following:    Application Load Balancers     Network Load Balancers     Gateway Load Balancers    This operation is idempotent, which means that it completes at most one time. If you attempt to create multiple load balancers with the same settings, each call succeeds.
   */
  createLoadBalancer(callback?: (err: AWSError, data: ELBv2.Types.CreateLoadBalancerOutput) => void): Request<ELBv2.Types.CreateLoadBalancerOutput, AWSError>;
  /**
   * Creates a rule for the specified listener. The listener must be associated with an Application Load Balancer. Each rule consists of a priority, one or more actions, and one or more conditions. Rules are evaluated in priority order, from the lowest value to the highest value. When the conditions for a rule are met, its actions are performed. If the conditions for no rules are met, the actions for the default rule are performed. For more information, see Listener rules in the Application Load Balancers Guide.
   */
  createRule(params: ELBv2.Types.CreateRuleInput, callback?: (err: AWSError, data: ELBv2.Types.CreateRuleOutput) => void): Request<ELBv2.Types.CreateRuleOutput, AWSError>;
  /**
   * Creates a rule for the specified listener. The listener must be associated with an Application Load Balancer. Each rule consists of a priority, one or more actions, and one or more conditions. Rules are evaluated in priority order, from the lowest value to the highest value. When the conditions for a rule are met, its actions are performed. If the conditions for no rules are met, the actions for the default rule are performed. For more information, see Listener rules in the Application Load Balancers Guide.
   */
  createRule(callback?: (err: AWSError, data: ELBv2.Types.CreateRuleOutput) => void): Request<ELBv2.Types.CreateRuleOutput, AWSError>;
  /**
   * Creates a target group. For more information, see the following:    Target groups for your Application Load Balancers     Target groups for your Network Load Balancers     Target groups for your Gateway Load Balancers    This operation is idempotent, which means that it completes at most one time. If you attempt to create multiple target groups with the same settings, each call succeeds.
   */
  createTargetGroup(params: ELBv2.Types.CreateTargetGroupInput, callback?: (err: AWSError, data: ELBv2.Types.CreateTargetGroupOutput) => void): Request<ELBv2.Types.CreateTargetGroupOutput, AWSError>;
  /**
   * Creates a target group. For more information, see the following:    Target groups for your Application Load Balancers     Target groups for your Network Load Balancers     Target groups for your Gateway Load Balancers    This operation is idempotent, which means that it completes at most one time. If you attempt to create multiple target groups with the same settings, each call succeeds.
   */
  createTargetGroup(callback?: (err: AWSError, data: ELBv2.Types.CreateTargetGroupOutput) => void): Request<ELBv2.Types.CreateTargetGroupOutput, AWSError>;
  /**
   * Deletes the specified listener. Alternatively, your listener is deleted when you delete the load balancer to which it is attached.
   */
  deleteListener(params: ELBv2.Types.DeleteListenerInput, callback?: (err: AWSError, data: ELBv2.Types.DeleteListenerOutput) => void): Request<ELBv2.Types.DeleteListenerOutput, AWSError>;
  /**
   * Deletes the specified listener. Alternatively, your listener is deleted when you delete the load balancer to which it is attached.
   */
  deleteListener(callback?: (err: AWSError, data: ELBv2.Types.DeleteListenerOutput) => void): Request<ELBv2.Types.DeleteListenerOutput, AWSError>;
  /**
   * Deletes the specified Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. Deleting a load balancer also deletes its listeners. You can't delete a load balancer if deletion protection is enabled. If the load balancer does not exist or has already been deleted, the call succeeds. Deleting a load balancer does not affect its registered targets. For example, your EC2 instances continue to run and are still registered to their target groups. If you no longer need these EC2 instances, you can stop or terminate them.
   */
  deleteLoadBalancer(params: ELBv2.Types.DeleteLoadBalancerInput, callback?: (err: AWSError, data: ELBv2.Types.DeleteLoadBalancerOutput) => void): Request<ELBv2.Types.DeleteLoadBalancerOutput, AWSError>;
  /**
   * Deletes the specified Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. Deleting a load balancer also deletes its listeners. You can't delete a load balancer if deletion protection is enabled. If the load balancer does not exist or has already been deleted, the call succeeds. Deleting a load balancer does not affect its registered targets. For example, your EC2 instances continue to run and are still registered to their target groups. If you no longer need these EC2 instances, you can stop or terminate them.
   */
  deleteLoadBalancer(callback?: (err: AWSError, data: ELBv2.Types.DeleteLoadBalancerOutput) => void): Request<ELBv2.Types.DeleteLoadBalancerOutput, AWSError>;
  /**
   * Deletes the specified rule. You can't delete the default rule.
   */
  deleteRule(params: ELBv2.Types.DeleteRuleInput, callback?: (err: AWSError, data: ELBv2.Types.DeleteRuleOutput) => void): Request<ELBv2.Types.DeleteRuleOutput, AWSError>;
  /**
   * Deletes the specified rule. You can't delete the default rule.
   */
  deleteRule(callback?: (err: AWSError, data: ELBv2.Types.DeleteRuleOutput) => void): Request<ELBv2.Types.DeleteRuleOutput, AWSError>;
  /**
   * Deletes the specified target group. You can delete a target group if it is not referenced by any actions. Deleting a target group also deletes any associated health checks. Deleting a target group does not affect its registered targets. For example, any EC2 instances continue to run until you stop or terminate them.
   */
  deleteTargetGroup(params: ELBv2.Types.DeleteTargetGroupInput, callback?: (err: AWSError, data: ELBv2.Types.DeleteTargetGroupOutput) => void): Request<ELBv2.Types.DeleteTargetGroupOutput, AWSError>;
  /**
   * Deletes the specified target group. You can delete a target group if it is not referenced by any actions. Deleting a target group also deletes any associated health checks. Deleting a target group does not affect its registered targets. For example, any EC2 instances continue to run until you stop or terminate them.
   */
  deleteTargetGroup(callback?: (err: AWSError, data: ELBv2.Types.DeleteTargetGroupOutput) => void): Request<ELBv2.Types.DeleteTargetGroupOutput, AWSError>;
  /**
   * Deregisters the specified targets from the specified target group. After the targets are deregistered, they no longer receive traffic from the load balancer. The load balancer stops sending requests to targets that are deregistering, but uses connection draining to ensure that in-flight traffic completes on the existing connections. This deregistration delay is configured by default but can be updated for each target group. For more information, see the following:     Deregistration delay in the Application Load Balancers User Guide      Deregistration delay in the Network Load Balancers User Guide      Deregistration delay in the Gateway Load Balancers User Guide    Note: If the specified target does not exist, the action returns successfully.
   */
  deregisterTargets(params: ELBv2.Types.DeregisterTargetsInput, callback?: (err: AWSError, data: ELBv2.Types.DeregisterTargetsOutput) => void): Request<ELBv2.Types.DeregisterTargetsOutput, AWSError>;
  /**
   * Deregisters the specified targets from the specified target group. After the targets are deregistered, they no longer receive traffic from the load balancer. The load balancer stops sending requests to targets that are deregistering, but uses connection draining to ensure that in-flight traffic completes on the existing connections. This deregistration delay is configured by default but can be updated for each target group. For more information, see the following:     Deregistration delay in the Application Load Balancers User Guide      Deregistration delay in the Network Load Balancers User Guide      Deregistration delay in the Gateway Load Balancers User Guide    Note: If the specified target does not exist, the action returns successfully.
   */
  deregisterTargets(callback?: (err: AWSError, data: ELBv2.Types.DeregisterTargetsOutput) => void): Request<ELBv2.Types.DeregisterTargetsOutput, AWSError>;
  /**
   * Describes the current Elastic Load Balancing resource limits for your Amazon Web Services account. For more information, see the following:    Quotas for your Application Load Balancers     Quotas for your Network Load Balancers     Quotas for your Gateway Load Balancers   
   */
  describeAccountLimits(params: ELBv2.Types.DescribeAccountLimitsInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeAccountLimitsOutput) => void): Request<ELBv2.Types.DescribeAccountLimitsOutput, AWSError>;
  /**
   * Describes the current Elastic Load Balancing resource limits for your Amazon Web Services account. For more information, see the following:    Quotas for your Application Load Balancers     Quotas for your Network Load Balancers     Quotas for your Gateway Load Balancers   
   */
  describeAccountLimits(callback?: (err: AWSError, data: ELBv2.Types.DescribeAccountLimitsOutput) => void): Request<ELBv2.Types.DescribeAccountLimitsOutput, AWSError>;
  /**
   * Describes the default certificate and the certificate list for the specified HTTPS or TLS listener. If the default certificate is also in the certificate list, it appears twice in the results (once with IsDefault set to true and once with IsDefault set to false). For more information, see SSL certificates in the Application Load Balancers Guide or Server certificates in the Network Load Balancers Guide.
   */
  describeListenerCertificates(params: ELBv2.Types.DescribeListenerCertificatesInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeListenerCertificatesOutput) => void): Request<ELBv2.Types.DescribeListenerCertificatesOutput, AWSError>;
  /**
   * Describes the default certificate and the certificate list for the specified HTTPS or TLS listener. If the default certificate is also in the certificate list, it appears twice in the results (once with IsDefault set to true and once with IsDefault set to false). For more information, see SSL certificates in the Application Load Balancers Guide or Server certificates in the Network Load Balancers Guide.
   */
  describeListenerCertificates(callback?: (err: AWSError, data: ELBv2.Types.DescribeListenerCertificatesOutput) => void): Request<ELBv2.Types.DescribeListenerCertificatesOutput, AWSError>;
  /**
   * Describes the specified listeners or the listeners for the specified Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. You must specify either a load balancer or one or more listeners.
   */
  describeListeners(params: ELBv2.Types.DescribeListenersInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeListenersOutput) => void): Request<ELBv2.Types.DescribeListenersOutput, AWSError>;
  /**
   * Describes the specified listeners or the listeners for the specified Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. You must specify either a load balancer or one or more listeners.
   */
  describeListeners(callback?: (err: AWSError, data: ELBv2.Types.DescribeListenersOutput) => void): Request<ELBv2.Types.DescribeListenersOutput, AWSError>;
  /**
   * Describes the attributes for the specified Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. For more information, see the following:    Load balancer attributes in the Application Load Balancers Guide     Load balancer attributes in the Network Load Balancers Guide     Load balancer attributes in the Gateway Load Balancers Guide   
   */
  describeLoadBalancerAttributes(params: ELBv2.Types.DescribeLoadBalancerAttributesInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeLoadBalancerAttributesOutput) => void): Request<ELBv2.Types.DescribeLoadBalancerAttributesOutput, AWSError>;
  /**
   * Describes the attributes for the specified Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. For more information, see the following:    Load balancer attributes in the Application Load Balancers Guide     Load balancer attributes in the Network Load Balancers Guide     Load balancer attributes in the Gateway Load Balancers Guide   
   */
  describeLoadBalancerAttributes(callback?: (err: AWSError, data: ELBv2.Types.DescribeLoadBalancerAttributesOutput) => void): Request<ELBv2.Types.DescribeLoadBalancerAttributesOutput, AWSError>;
  /**
   * Describes the specified load balancers or all of your load balancers.
   */
  describeLoadBalancers(params: ELBv2.Types.DescribeLoadBalancersInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeLoadBalancersOutput) => void): Request<ELBv2.Types.DescribeLoadBalancersOutput, AWSError>;
  /**
   * Describes the specified load balancers or all of your load balancers.
   */
  describeLoadBalancers(callback?: (err: AWSError, data: ELBv2.Types.DescribeLoadBalancersOutput) => void): Request<ELBv2.Types.DescribeLoadBalancersOutput, AWSError>;
  /**
   * Describes the specified rules or the rules for the specified listener. You must specify either a listener or one or more rules.
   */
  describeRules(params: ELBv2.Types.DescribeRulesInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeRulesOutput) => void): Request<ELBv2.Types.DescribeRulesOutput, AWSError>;
  /**
   * Describes the specified rules or the rules for the specified listener. You must specify either a listener or one or more rules.
   */
  describeRules(callback?: (err: AWSError, data: ELBv2.Types.DescribeRulesOutput) => void): Request<ELBv2.Types.DescribeRulesOutput, AWSError>;
  /**
   * Describes the specified policies or all policies used for SSL negotiation. For more information, see Security policies in the Application Load Balancers Guide or Security policies in the Network Load Balancers Guide.
   */
  describeSSLPolicies(params: ELBv2.Types.DescribeSSLPoliciesInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeSSLPoliciesOutput) => void): Request<ELBv2.Types.DescribeSSLPoliciesOutput, AWSError>;
  /**
   * Describes the specified policies or all policies used for SSL negotiation. For more information, see Security policies in the Application Load Balancers Guide or Security policies in the Network Load Balancers Guide.
   */
  describeSSLPolicies(callback?: (err: AWSError, data: ELBv2.Types.DescribeSSLPoliciesOutput) => void): Request<ELBv2.Types.DescribeSSLPoliciesOutput, AWSError>;
  /**
   * Describes the tags for the specified Elastic Load Balancing resources. You can describe the tags for one or more Application Load Balancers, Network Load Balancers, Gateway Load Balancers, target groups, listeners, or rules.
   */
  describeTags(params: ELBv2.Types.DescribeTagsInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeTagsOutput) => void): Request<ELBv2.Types.DescribeTagsOutput, AWSError>;
  /**
   * Describes the tags for the specified Elastic Load Balancing resources. You can describe the tags for one or more Application Load Balancers, Network Load Balancers, Gateway Load Balancers, target groups, listeners, or rules.
   */
  describeTags(callback?: (err: AWSError, data: ELBv2.Types.DescribeTagsOutput) => void): Request<ELBv2.Types.DescribeTagsOutput, AWSError>;
  /**
   * Describes the attributes for the specified target group. For more information, see the following:    Target group attributes in the Application Load Balancers Guide     Target group attributes in the Network Load Balancers Guide     Target group attributes in the Gateway Load Balancers Guide   
   */
  describeTargetGroupAttributes(params: ELBv2.Types.DescribeTargetGroupAttributesInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeTargetGroupAttributesOutput) => void): Request<ELBv2.Types.DescribeTargetGroupAttributesOutput, AWSError>;
  /**
   * Describes the attributes for the specified target group. For more information, see the following:    Target group attributes in the Application Load Balancers Guide     Target group attributes in the Network Load Balancers Guide     Target group attributes in the Gateway Load Balancers Guide   
   */
  describeTargetGroupAttributes(callback?: (err: AWSError, data: ELBv2.Types.DescribeTargetGroupAttributesOutput) => void): Request<ELBv2.Types.DescribeTargetGroupAttributesOutput, AWSError>;
  /**
   * Describes the specified target groups or all of your target groups. By default, all target groups are described. Alternatively, you can specify one of the following to filter the results: the ARN of the load balancer, the names of one or more target groups, or the ARNs of one or more target groups.
   */
  describeTargetGroups(params: ELBv2.Types.DescribeTargetGroupsInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeTargetGroupsOutput) => void): Request<ELBv2.Types.DescribeTargetGroupsOutput, AWSError>;
  /**
   * Describes the specified target groups or all of your target groups. By default, all target groups are described. Alternatively, you can specify one of the following to filter the results: the ARN of the load balancer, the names of one or more target groups, or the ARNs of one or more target groups.
   */
  describeTargetGroups(callback?: (err: AWSError, data: ELBv2.Types.DescribeTargetGroupsOutput) => void): Request<ELBv2.Types.DescribeTargetGroupsOutput, AWSError>;
  /**
   * Describes the health of the specified targets or all of your targets.
   */
  describeTargetHealth(params: ELBv2.Types.DescribeTargetHealthInput, callback?: (err: AWSError, data: ELBv2.Types.DescribeTargetHealthOutput) => void): Request<ELBv2.Types.DescribeTargetHealthOutput, AWSError>;
  /**
   * Describes the health of the specified targets or all of your targets.
   */
  describeTargetHealth(callback?: (err: AWSError, data: ELBv2.Types.DescribeTargetHealthOutput) => void): Request<ELBv2.Types.DescribeTargetHealthOutput, AWSError>;
  /**
   * Replaces the specified properties of the specified listener. Any properties that you do not specify remain unchanged. Changing the protocol from HTTPS to HTTP, or from TLS to TCP, removes the security policy and default certificate properties. If you change the protocol from HTTP to HTTPS, or from TCP to TLS, you must add the security policy and default certificate properties. To add an item to a list, remove an item from a list, or update an item in a list, you must provide the entire list. For example, to add an action, specify a list with the current actions plus the new action.
   */
  modifyListener(params: ELBv2.Types.ModifyListenerInput, callback?: (err: AWSError, data: ELBv2.Types.ModifyListenerOutput) => void): Request<ELBv2.Types.ModifyListenerOutput, AWSError>;
  /**
   * Replaces the specified properties of the specified listener. Any properties that you do not specify remain unchanged. Changing the protocol from HTTPS to HTTP, or from TLS to TCP, removes the security policy and default certificate properties. If you change the protocol from HTTP to HTTPS, or from TCP to TLS, you must add the security policy and default certificate properties. To add an item to a list, remove an item from a list, or update an item in a list, you must provide the entire list. For example, to add an action, specify a list with the current actions plus the new action.
   */
  modifyListener(callback?: (err: AWSError, data: ELBv2.Types.ModifyListenerOutput) => void): Request<ELBv2.Types.ModifyListenerOutput, AWSError>;
  /**
   * Modifies the specified attributes of the specified Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. If any of the specified attributes can't be modified as requested, the call fails. Any existing attributes that you do not modify retain their current values.
   */
  modifyLoadBalancerAttributes(params: ELBv2.Types.ModifyLoadBalancerAttributesInput, callback?: (err: AWSError, data: ELBv2.Types.ModifyLoadBalancerAttributesOutput) => void): Request<ELBv2.Types.ModifyLoadBalancerAttributesOutput, AWSError>;
  /**
   * Modifies the specified attributes of the specified Application Load Balancer, Network Load Balancer, or Gateway Load Balancer. If any of the specified attributes can't be modified as requested, the call fails. Any existing attributes that you do not modify retain their current values.
   */
  modifyLoadBalancerAttributes(callback?: (err: AWSError, data: ELBv2.Types.ModifyLoadBalancerAttributesOutput) => void): Request<ELBv2.Types.ModifyLoadBalancerAttributesOutput, AWSError>;
  /**
   * Replaces the specified properties of the specified rule. Any properties that you do not specify are unchanged. To add an item to a list, remove an item from a list, or update an item in a list, you must provide the entire list. For example, to add an action, specify a list with the current actions plus the new action.
   */
  modifyRule(params: ELBv2.Types.ModifyRuleInput, callback?: (err: AWSError, data: ELBv2.Types.ModifyRuleOutput) => void): Request<ELBv2.Types.ModifyRuleOutput, AWSError>;
  /**
   * Replaces the specified properties of the specified rule. Any properties that you do not specify are unchanged. To add an item to a list, remove an item from a list, or update an item in a list, you must provide the entire list. For example, to add an action, specify a list with the current actions plus the new action.
   */
  modifyRule(callback?: (err: AWSError, data: ELBv2.Types.ModifyRuleOutput) => void): Request<ELBv2.Types.ModifyRuleOutput, AWSError>;
  /**
   * Modifies the health checks used when evaluating the health state of the targets in the specified target group.
   */
  modifyTargetGroup(params: ELBv2.Types.ModifyTargetGroupInput, callback?: (err: AWSError, data: ELBv2.Types.ModifyTargetGroupOutput) => void): Request<ELBv2.Types.ModifyTargetGroupOutput, AWSError>;
  /**
   * Modifies the health checks used when evaluating the health state of the targets in the specified target group.
   */
  modifyTargetGroup(callback?: (err: AWSError, data: ELBv2.Types.ModifyTargetGroupOutput) => void): Request<ELBv2.Types.ModifyTargetGroupOutput, AWSError>;
  /**
   * Modifies the specified attributes of the specified target group.
   */
  modifyTargetGroupAttributes(params: ELBv2.Types.ModifyTargetGroupAttributesInput, callback?: (err: AWSError, data: ELBv2.Types.ModifyTargetGroupAttributesOutput) => void): Request<ELBv2.Types.ModifyTargetGroupAttributesOutput, AWSError>;
  /**
   * Modifies the specified attributes of the specified target group.
   */
  modifyTargetGroupAttributes(callback?: (err: AWSError, data: ELBv2.Types.ModifyTargetGroupAttributesOutput) => void): Request<ELBv2.Types.ModifyTargetGroupAttributesOutput, AWSError>;
  /**
   * Registers the specified targets with the specified target group. If the target is an EC2 instance, it must be in the running state when you register it. By default, the load balancer routes requests to registered targets using the protocol and port for the target group. Alternatively, you can override the port for a target when you register it. You can register each EC2 instance or IP address with the same target group multiple times using different ports. With a Network Load Balancer, you cannot register instances by instance ID if they have the following instance types: C1, CC1, CC2, CG1, CG2, CR1, CS1, G1, G2, HI1, HS1, M1, M2, M3, and T1. You can register instances of these types by IP address.
   */
  registerTargets(params: ELBv2.Types.RegisterTargetsInput, callback?: (err: AWSError, data: ELBv2.Types.RegisterTargetsOutput) => void): Request<ELBv2.Types.RegisterTargetsOutput, AWSError>;
  /**
   * Registers the specified targets with the specified target group. If the target is an EC2 instance, it must be in the running state when you register it. By default, the load balancer routes requests to registered targets using the protocol and port for the target group. Alternatively, you can override the port for a target when you register it. You can register each EC2 instance or IP address with the same target group multiple times using different ports. With a Network Load Balancer, you cannot register instances by instance ID if they have the following instance types: C1, CC1, CC2, CG1, CG2, CR1, CS1, G1, G2, HI1, HS1, M1, M2, M3, and T1. You can register instances of these types by IP address.
   */
  registerTargets(callback?: (err: AWSError, data: ELBv2.Types.RegisterTargetsOutput) => void): Request<ELBv2.Types.RegisterTargetsOutput, AWSError>;
  /**
   * Removes the specified certificate from the certificate list for the specified HTTPS or TLS listener.
   */
  removeListenerCertificates(params: ELBv2.Types.RemoveListenerCertificatesInput, callback?: (err: AWSError, data: ELBv2.Types.RemoveListenerCertificatesOutput) => void): Request<ELBv2.Types.RemoveListenerCertificatesOutput, AWSError>;
  /**
   * Removes the specified certificate from the certificate list for the specified HTTPS or TLS listener.
   */
  removeListenerCertificates(callback?: (err: AWSError, data: ELBv2.Types.RemoveListenerCertificatesOutput) => void): Request<ELBv2.Types.RemoveListenerCertificatesOutput, AWSError>;
  /**
   * Removes the specified tags from the specified Elastic Load Balancing resources. You can remove the tags for one or more Application Load Balancers, Network Load Balancers, Gateway Load Balancers, target groups, listeners, or rules.
   */
  removeTags(params: ELBv2.Types.RemoveTagsInput, callback?: (err: AWSError, data: ELBv2.Types.RemoveTagsOutput) => void): Request<ELBv2.Types.RemoveTagsOutput, AWSError>;
  /**
   * Removes the specified tags from the specified Elastic Load Balancing resources. You can remove the tags for one or more Application Load Balancers, Network Load Balancers, Gateway Load Balancers, target groups, listeners, or rules.
   */
  removeTags(callback?: (err: AWSError, data: ELBv2.Types.RemoveTagsOutput) => void): Request<ELBv2.Types.RemoveTagsOutput, AWSError>;
  /**
   * Sets the type of IP addresses used by the subnets of the specified load balancer.
   */
  setIpAddressType(params: ELBv2.Types.SetIpAddressTypeInput, callback?: (err: AWSError, data: ELBv2.Types.SetIpAddressTypeOutput) => void): Request<ELBv2.Types.SetIpAddressTypeOutput, AWSError>;
  /**
   * Sets the type of IP addresses used by the subnets of the specified load balancer.
   */
  setIpAddressType(callback?: (err: AWSError, data: ELBv2.Types.SetIpAddressTypeOutput) => void): Request<ELBv2.Types.SetIpAddressTypeOutput, AWSError>;
  /**
   * Sets the priorities of the specified rules. You can reorder the rules as long as there are no priority conflicts in the new order. Any existing rules that you do not specify retain their current priority.
   */
  setRulePriorities(params: ELBv2.Types.SetRulePrioritiesInput, callback?: (err: AWSError, data: ELBv2.Types.SetRulePrioritiesOutput) => void): Request<ELBv2.Types.SetRulePrioritiesOutput, AWSError>;
  /**
   * Sets the priorities of the specified rules. You can reorder the rules as long as there are no priority conflicts in the new order. Any existing rules that you do not specify retain their current priority.
   */
  setRulePriorities(callback?: (err: AWSError, data: ELBv2.Types.SetRulePrioritiesOutput) => void): Request<ELBv2.Types.SetRulePrioritiesOutput, AWSError>;
  /**
   * Associates the specified security groups with the specified Application Load Balancer or Network Load Balancer. The specified security groups override the previously associated security groups. You can't perform this operation on a Network Load Balancer unless you specified a security group for the load balancer when you created it. You can't associate a security group with a Gateway Load Balancer.
   */
  setSecurityGroups(params: ELBv2.Types.SetSecurityGroupsInput, callback?: (err: AWSError, data: ELBv2.Types.SetSecurityGroupsOutput) => void): Request<ELBv2.Types.SetSecurityGroupsOutput, AWSError>;
  /**
   * Associates the specified security groups with the specified Application Load Balancer or Network Load Balancer. The specified security groups override the previously associated security groups. You can't perform this operation on a Network Load Balancer unless you specified a security group for the load balancer when you created it. You can't associate a security group with a Gateway Load Balancer.
   */
  setSecurityGroups(callback?: (err: AWSError, data: ELBv2.Types.SetSecurityGroupsOutput) => void): Request<ELBv2.Types.SetSecurityGroupsOutput, AWSError>;
  /**
   * Enables the Availability Zones for the specified public subnets for the specified Application Load Balancer, Network Load Balancer or Gateway Load Balancer. The specified subnets replace the previously enabled subnets. When you specify subnets for a Network Load Balancer, or Gateway Load Balancer you must include all subnets that were enabled previously, with their existing configurations, plus any additional subnets.
   */
  setSubnets(params: ELBv2.Types.SetSubnetsInput, callback?: (err: AWSError, data: ELBv2.Types.SetSubnetsOutput) => void): Request<ELBv2.Types.SetSubnetsOutput, AWSError>;
  /**
   * Enables the Availability Zones for the specified public subnets for the specified Application Load Balancer, Network Load Balancer or Gateway Load Balancer. The specified subnets replace the previously enabled subnets. When you specify subnets for a Network Load Balancer, or Gateway Load Balancer you must include all subnets that were enabled previously, with their existing configurations, plus any additional subnets.
   */
  setSubnets(callback?: (err: AWSError, data: ELBv2.Types.SetSubnetsOutput) => void): Request<ELBv2.Types.SetSubnetsOutput, AWSError>;
  /**
   * Waits for the loadBalancerExists state by periodically calling the underlying ELBv2.describeLoadBalancersoperation every 15 seconds (at most 40 times).
   */
  waitFor(state: "loadBalancerExists", params: ELBv2.Types.DescribeLoadBalancersInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ELBv2.Types.DescribeLoadBalancersOutput) => void): Request<ELBv2.Types.DescribeLoadBalancersOutput, AWSError>;
  /**
   * Waits for the loadBalancerExists state by periodically calling the underlying ELBv2.describeLoadBalancersoperation every 15 seconds (at most 40 times).
   */
  waitFor(state: "loadBalancerExists", callback?: (err: AWSError, data: ELBv2.Types.DescribeLoadBalancersOutput) => void): Request<ELBv2.Types.DescribeLoadBalancersOutput, AWSError>;
  /**
   * Waits for the loadBalancerAvailable state by periodically calling the underlying ELBv2.describeLoadBalancersoperation every 15 seconds (at most 40 times).
   */
  waitFor(state: "loadBalancerAvailable", params: ELBv2.Types.DescribeLoadBalancersInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ELBv2.Types.DescribeLoadBalancersOutput) => void): Request<ELBv2.Types.DescribeLoadBalancersOutput, AWSError>;
  /**
   * Waits for the loadBalancerAvailable state by periodically calling the underlying ELBv2.describeLoadBalancersoperation every 15 seconds (at most 40 times).
   */
  waitFor(state: "loadBalancerAvailable", callback?: (err: AWSError, data: ELBv2.Types.DescribeLoadBalancersOutput) => void): Request<ELBv2.Types.DescribeLoadBalancersOutput, AWSError>;
  /**
   * Waits for the loadBalancersDeleted state by periodically calling the underlying ELBv2.describeLoadBalancersoperation every 15 seconds (at most 40 times).
   */
  waitFor(state: "loadBalancersDeleted", params: ELBv2.Types.DescribeLoadBalancersInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ELBv2.Types.DescribeLoadBalancersOutput) => void): Request<ELBv2.Types.DescribeLoadBalancersOutput, AWSError>;
  /**
   * Waits for the loadBalancersDeleted state by periodically calling the underlying ELBv2.describeLoadBalancersoperation every 15 seconds (at most 40 times).
   */
  waitFor(state: "loadBalancersDeleted", callback?: (err: AWSError, data: ELBv2.Types.DescribeLoadBalancersOutput) => void): Request<ELBv2.Types.DescribeLoadBalancersOutput, AWSError>;
  /**
   * Waits for the targetInService state by periodically calling the underlying ELBv2.describeTargetHealthoperation every 15 seconds (at most 40 times).
   */
  waitFor(state: "targetInService", params: ELBv2.Types.DescribeTargetHealthInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ELBv2.Types.DescribeTargetHealthOutput) => void): Request<ELBv2.Types.DescribeTargetHealthOutput, AWSError>;
  /**
   * Waits for the targetInService state by periodically calling the underlying ELBv2.describeTargetHealthoperation every 15 seconds (at most 40 times).
   */
  waitFor(state: "targetInService", callback?: (err: AWSError, data: ELBv2.Types.DescribeTargetHealthOutput) => void): Request<ELBv2.Types.DescribeTargetHealthOutput, AWSError>;
  /**
   * Waits for the targetDeregistered state by periodically calling the underlying ELBv2.describeTargetHealthoperation every 15 seconds (at most 40 times).
   */
  waitFor(state: "targetDeregistered", params: ELBv2.Types.DescribeTargetHealthInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ELBv2.Types.DescribeTargetHealthOutput) => void): Request<ELBv2.Types.DescribeTargetHealthOutput, AWSError>;
  /**
   * Waits for the targetDeregistered state by periodically calling the underlying ELBv2.describeTargetHealthoperation every 15 seconds (at most 40 times).
   */
  waitFor(state: "targetDeregistered", callback?: (err: AWSError, data: ELBv2.Types.DescribeTargetHealthOutput) => void): Request<ELBv2.Types.DescribeTargetHealthOutput, AWSError>;
}
declare namespace ELBv2 {
  export interface Action {
    /**
     * The type of action.
     */
    Type: ActionTypeEnum;
    /**
     * The Amazon Resource Name (ARN) of the target group. Specify only when Type is forward and you want to route to a single target group. To route to one or more target groups, use ForwardConfig instead.
     */
    TargetGroupArn?: TargetGroupArn;
    /**
     * [HTTPS listeners] Information about an identity provider that is compliant with OpenID Connect (OIDC). Specify only when Type is authenticate-oidc.
     */
    AuthenticateOidcConfig?: AuthenticateOidcActionConfig;
    /**
     * [HTTPS listeners] Information for using Amazon Cognito to authenticate users. Specify only when Type is authenticate-cognito.
     */
    AuthenticateCognitoConfig?: AuthenticateCognitoActionConfig;
    /**
     * The order for the action. This value is required for rules with multiple actions. The action with the lowest value for order is performed first.
     */
    Order?: ActionOrder;
    /**
     * [Application Load Balancer] Information for creating a redirect action. Specify only when Type is redirect.
     */
    RedirectConfig?: RedirectActionConfig;
    /**
     * [Application Load Balancer] Information for creating an action that returns a custom HTTP response. Specify only when Type is fixed-response.
     */
    FixedResponseConfig?: FixedResponseActionConfig;
    /**
     * Information for creating an action that distributes requests among one or more target groups. For Network Load Balancers, you can specify a single target group. Specify only when Type is forward. If you specify both ForwardConfig and TargetGroupArn, you can specify only one target group using ForwardConfig and it must be the same target group specified in TargetGroupArn.
     */
    ForwardConfig?: ForwardActionConfig;
  }
  export type ActionOrder = number;
  export type ActionTypeEnum = "forward"|"authenticate-oidc"|"authenticate-cognito"|"redirect"|"fixed-response"|string;
  export type Actions = Action[];
  export interface AddListenerCertificatesInput {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn: ListenerArn;
    /**
     * The certificate to add. You can specify one certificate per call. Set CertificateArn to the certificate ARN but do not set IsDefault.
     */
    Certificates: CertificateList;
  }
  export interface AddListenerCertificatesOutput {
    /**
     * Information about the certificates in the certificate list.
     */
    Certificates?: CertificateList;
  }
  export interface AddTagsInput {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArns: ResourceArns;
    /**
     * The tags.
     */
    Tags: TagList;
  }
  export interface AddTagsOutput {
  }
  export type AllocationId = string;
  export type AlpnPolicyName = AlpnPolicyValue[];
  export type AlpnPolicyValue = string;
  export type AuthenticateCognitoActionAuthenticationRequestExtraParams = {[key: string]: AuthenticateCognitoActionAuthenticationRequestParamValue};
  export type AuthenticateCognitoActionAuthenticationRequestParamName = string;
  export type AuthenticateCognitoActionAuthenticationRequestParamValue = string;
  export type AuthenticateCognitoActionConditionalBehaviorEnum = "deny"|"allow"|"authenticate"|string;
  export interface AuthenticateCognitoActionConfig {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Cognito user pool.
     */
    UserPoolArn: AuthenticateCognitoActionUserPoolArn;
    /**
     * The ID of the Amazon Cognito user pool client.
     */
    UserPoolClientId: AuthenticateCognitoActionUserPoolClientId;
    /**
     * The domain prefix or fully-qualified domain name of the Amazon Cognito user pool.
     */
    UserPoolDomain: AuthenticateCognitoActionUserPoolDomain;
    /**
     * The name of the cookie used to maintain session information. The default is AWSELBAuthSessionCookie.
     */
    SessionCookieName?: AuthenticateCognitoActionSessionCookieName;
    /**
     * The set of user claims to be requested from the IdP. The default is openid. To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
     */
    Scope?: AuthenticateCognitoActionScope;
    /**
     * The maximum duration of the authentication session, in seconds. The default is 604800 seconds (7 days).
     */
    SessionTimeout?: AuthenticateCognitoActionSessionTimeout;
    /**
     * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
     */
    AuthenticationRequestExtraParams?: AuthenticateCognitoActionAuthenticationRequestExtraParams;
    /**
     * The behavior if the user is not authenticated. The following are possible values:   deny - Return an HTTP 401 Unauthorized error.   allow - Allow the request to be forwarded to the target.   authenticate - Redirect the request to the IdP authorization endpoint. This is the default value.  
     */
    OnUnauthenticatedRequest?: AuthenticateCognitoActionConditionalBehaviorEnum;
  }
  export type AuthenticateCognitoActionScope = string;
  export type AuthenticateCognitoActionSessionCookieName = string;
  export type AuthenticateCognitoActionSessionTimeout = number;
  export type AuthenticateCognitoActionUserPoolArn = string;
  export type AuthenticateCognitoActionUserPoolClientId = string;
  export type AuthenticateCognitoActionUserPoolDomain = string;
  export type AuthenticateOidcActionAuthenticationRequestExtraParams = {[key: string]: AuthenticateOidcActionAuthenticationRequestParamValue};
  export type AuthenticateOidcActionAuthenticationRequestParamName = string;
  export type AuthenticateOidcActionAuthenticationRequestParamValue = string;
  export type AuthenticateOidcActionAuthorizationEndpoint = string;
  export type AuthenticateOidcActionClientId = string;
  export type AuthenticateOidcActionClientSecret = string;
  export type AuthenticateOidcActionConditionalBehaviorEnum = "deny"|"allow"|"authenticate"|string;
  export interface AuthenticateOidcActionConfig {
    /**
     * The OIDC issuer identifier of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
     */
    Issuer: AuthenticateOidcActionIssuer;
    /**
     * The authorization endpoint of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
     */
    AuthorizationEndpoint: AuthenticateOidcActionAuthorizationEndpoint;
    /**
     * The token endpoint of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
     */
    TokenEndpoint: AuthenticateOidcActionTokenEndpoint;
    /**
     * The user info endpoint of the IdP. This must be a full URL, including the HTTPS protocol, the domain, and the path.
     */
    UserInfoEndpoint: AuthenticateOidcActionUserInfoEndpoint;
    /**
     * The OAuth 2.0 client identifier.
     */
    ClientId: AuthenticateOidcActionClientId;
    /**
     * The OAuth 2.0 client secret. This parameter is required if you are creating a rule. If you are modifying a rule, you can omit this parameter if you set UseExistingClientSecret to true.
     */
    ClientSecret?: AuthenticateOidcActionClientSecret;
    /**
     * The name of the cookie used to maintain session information. The default is AWSELBAuthSessionCookie.
     */
    SessionCookieName?: AuthenticateOidcActionSessionCookieName;
    /**
     * The set of user claims to be requested from the IdP. The default is openid. To verify which scope values your IdP supports and how to separate multiple values, see the documentation for your IdP.
     */
    Scope?: AuthenticateOidcActionScope;
    /**
     * The maximum duration of the authentication session, in seconds. The default is 604800 seconds (7 days).
     */
    SessionTimeout?: AuthenticateOidcActionSessionTimeout;
    /**
     * The query parameters (up to 10) to include in the redirect request to the authorization endpoint.
     */
    AuthenticationRequestExtraParams?: AuthenticateOidcActionAuthenticationRequestExtraParams;
    /**
     * The behavior if the user is not authenticated. The following are possible values:   deny - Return an HTTP 401 Unauthorized error.   allow - Allow the request to be forwarded to the target.   authenticate - Redirect the request to the IdP authorization endpoint. This is the default value.  
     */
    OnUnauthenticatedRequest?: AuthenticateOidcActionConditionalBehaviorEnum;
    /**
     * Indicates whether to use the existing client secret when modifying a rule. If you are creating a rule, you can omit this parameter or set it to false.
     */
    UseExistingClientSecret?: AuthenticateOidcActionUseExistingClientSecret;
  }
  export type AuthenticateOidcActionIssuer = string;
  export type AuthenticateOidcActionScope = string;
  export type AuthenticateOidcActionSessionCookieName = string;
  export type AuthenticateOidcActionSessionTimeout = number;
  export type AuthenticateOidcActionTokenEndpoint = string;
  export type AuthenticateOidcActionUseExistingClientSecret = boolean;
  export type AuthenticateOidcActionUserInfoEndpoint = string;
  export interface AvailabilityZone {
    /**
     * The name of the Availability Zone.
     */
    ZoneName?: ZoneName;
    /**
     * The ID of the subnet. You can specify one subnet per Availability Zone.
     */
    SubnetId?: SubnetId;
    /**
     * [Application Load Balancers on Outposts] The ID of the Outpost.
     */
    OutpostId?: OutpostId;
    /**
     * [Network Load Balancers] If you need static IP addresses for your load balancer, you can specify one Elastic IP address per Availability Zone when you create an internal-facing load balancer. For internal load balancers, you can specify a private IP address from the IPv4 range of the subnet.
     */
    LoadBalancerAddresses?: LoadBalancerAddresses;
  }
  export type AvailabilityZones = AvailabilityZone[];
  export type CanonicalHostedZoneId = string;
  export interface Certificate {
    /**
     * The Amazon Resource Name (ARN) of the certificate.
     */
    CertificateArn?: CertificateArn;
    /**
     * Indicates whether the certificate is the default certificate. Do not set this value when specifying a certificate as an input. This value is not included in the output when describing a listener, but is included when describing listener certificates.
     */
    IsDefault?: Default;
  }
  export type CertificateArn = string;
  export type CertificateList = Certificate[];
  export interface Cipher {
    /**
     * The name of the cipher.
     */
    Name?: CipherName;
    /**
     * The priority of the cipher.
     */
    Priority?: CipherPriority;
  }
  export type CipherName = string;
  export type CipherPriority = number;
  export type Ciphers = Cipher[];
  export type ConditionFieldName = string;
  export interface CreateListenerInput {
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn: LoadBalancerArn;
    /**
     * The protocol for connections from clients to the load balancer. For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocols are TCP, TLS, UDP, and TCP_UDP. You can’t specify the UDP or TCP_UDP protocol if dual-stack mode is enabled. You cannot specify a protocol for a Gateway Load Balancer.
     */
    Protocol?: ProtocolEnum;
    /**
     * The port on which the load balancer is listening. You cannot specify a port for a Gateway Load Balancer.
     */
    Port?: Port;
    /**
     * [HTTPS and TLS listeners] The security policy that defines which protocols and ciphers are supported. For more information, see Security policies in the Application Load Balancers Guide and Security policies in the Network Load Balancers Guide.
     */
    SslPolicy?: SslPolicyName;
    /**
     * [HTTPS and TLS listeners] The default certificate for the listener. You must provide exactly one certificate. Set CertificateArn to the certificate ARN but do not set IsDefault.
     */
    Certificates?: CertificateList;
    /**
     * The actions for the default rule.
     */
    DefaultActions: Actions;
    /**
     * [TLS listeners] The name of the Application-Layer Protocol Negotiation (ALPN) policy. You can specify one policy name. The following are the possible values:    HTTP1Only     HTTP2Only     HTTP2Optional     HTTP2Preferred     None    For more information, see ALPN policies in the Network Load Balancers Guide.
     */
    AlpnPolicy?: AlpnPolicyName;
    /**
     * The tags to assign to the listener.
     */
    Tags?: TagList;
  }
  export interface CreateListenerOutput {
    /**
     * Information about the listener.
     */
    Listeners?: Listeners;
  }
  export interface CreateLoadBalancerInput {
    /**
     * The name of the load balancer. This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, must not begin or end with a hyphen, and must not begin with "internal-".
     */
    Name: LoadBalancerName;
    /**
     * The IDs of the public subnets. You can specify only one subnet per Availability Zone. You must specify either subnets or subnet mappings, but not both. To specify an Elastic IP address, specify subnet mappings instead of subnets. [Application Load Balancers] You must specify subnets from at least two Availability Zones. [Application Load Balancers on Outposts] You must specify one Outpost subnet. [Application Load Balancers on Local Zones] You can specify subnets from one or more Local Zones. [Network Load Balancers] You can specify subnets from one or more Availability Zones. [Gateway Load Balancers] You can specify subnets from one or more Availability Zones.
     */
    Subnets?: Subnets;
    /**
     * The IDs of the public subnets. You can specify only one subnet per Availability Zone. You must specify either subnets or subnet mappings, but not both. [Application Load Balancers] You must specify subnets from at least two Availability Zones. You cannot specify Elastic IP addresses for your subnets. [Application Load Balancers on Outposts] You must specify one Outpost subnet. [Application Load Balancers on Local Zones] You can specify subnets from one or more Local Zones. [Network Load Balancers] You can specify subnets from one or more Availability Zones. You can specify one Elastic IP address per subnet if you need static IP addresses for your internet-facing load balancer. For internal load balancers, you can specify one private IP address per subnet from the IPv4 range of the subnet. For internet-facing load balancer, you can specify one IPv6 address per subnet. [Gateway Load Balancers] You can specify subnets from one or more Availability Zones. You cannot specify Elastic IP addresses for your subnets.
     */
    SubnetMappings?: SubnetMappings;
    /**
     * [Application Load Balancers and Network Load Balancers] The IDs of the security groups for the load balancer.
     */
    SecurityGroups?: SecurityGroups;
    /**
     * The nodes of an Internet-facing load balancer have public IP addresses. The DNS name of an Internet-facing load balancer is publicly resolvable to the public IP addresses of the nodes. Therefore, Internet-facing load balancers can route requests from clients over the internet. The nodes of an internal load balancer have only private IP addresses. The DNS name of an internal load balancer is publicly resolvable to the private IP addresses of the nodes. Therefore, internal load balancers can route requests only from clients with access to the VPC for the load balancer. The default is an Internet-facing load balancer. You cannot specify a scheme for a Gateway Load Balancer.
     */
    Scheme?: LoadBalancerSchemeEnum;
    /**
     * The tags to assign to the load balancer.
     */
    Tags?: TagList;
    /**
     * The type of load balancer. The default is application.
     */
    Type?: LoadBalancerTypeEnum;
    /**
     * The type of IP addresses used by the subnets for your load balancer. The possible values are ipv4 (for IPv4 addresses) and dualstack (for IPv4 and IPv6 addresses). 
     */
    IpAddressType?: IpAddressType;
    /**
     * [Application Load Balancers on Outposts] The ID of the customer-owned address pool (CoIP pool).
     */
    CustomerOwnedIpv4Pool?: CustomerOwnedIpv4Pool;
  }
  export interface CreateLoadBalancerOutput {
    /**
     * Information about the load balancer.
     */
    LoadBalancers?: LoadBalancers;
  }
  export interface CreateRuleInput {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn: ListenerArn;
    /**
     * The conditions.
     */
    Conditions: RuleConditionList;
    /**
     * The rule priority. A listener can't have multiple rules with the same priority.
     */
    Priority: RulePriority;
    /**
     * The actions.
     */
    Actions: Actions;
    /**
     * The tags to assign to the rule.
     */
    Tags?: TagList;
  }
  export interface CreateRuleOutput {
    /**
     * Information about the rule.
     */
    Rules?: Rules;
  }
  export interface CreateTargetGroupInput {
    /**
     * The name of the target group. This name must be unique per region per account, can have a maximum of 32 characters, must contain only alphanumeric characters or hyphens, and must not begin or end with a hyphen.
     */
    Name: TargetGroupName;
    /**
     * The protocol to use for routing traffic to the targets. For Application Load Balancers, the supported protocols are HTTP and HTTPS. For Network Load Balancers, the supported protocols are TCP, TLS, UDP, or TCP_UDP. For Gateway Load Balancers, the supported protocol is GENEVE. A TCP_UDP listener must be associated with a TCP_UDP target group. If the target is a Lambda function, this parameter does not apply.
     */
    Protocol?: ProtocolEnum;
    /**
     * [HTTP/HTTPS protocol] The protocol version. Specify GRPC to send requests to targets using gRPC. Specify HTTP2 to send requests to targets using HTTP/2. The default is HTTP1, which sends requests to targets using HTTP/1.1.
     */
    ProtocolVersion?: ProtocolVersion;
    /**
     * The port on which the targets receive traffic. This port is used unless you specify a port override when registering the target. If the target is a Lambda function, this parameter does not apply. If the protocol is GENEVE, the supported port is 6081.
     */
    Port?: Port;
    /**
     * The identifier of the virtual private cloud (VPC). If the target is a Lambda function, this parameter does not apply. Otherwise, this parameter is required.
     */
    VpcId?: VpcId;
    /**
     * The protocol the load balancer uses when performing health checks on targets. For Application Load Balancers, the default is HTTP. For Network Load Balancers and Gateway Load Balancers, the default is TCP. The TCP protocol is not supported for health checks if the protocol of the target group is HTTP or HTTPS. The GENEVE, TLS, UDP, and TCP_UDP protocols are not supported for health checks.
     */
    HealthCheckProtocol?: ProtocolEnum;
    /**
     * The port the load balancer uses when performing health checks on targets. If the protocol is HTTP, HTTPS, TCP, TLS, UDP, or TCP_UDP, the default is traffic-port, which is the port on which each target receives traffic from the load balancer. If the protocol is GENEVE, the default is port 80.
     */
    HealthCheckPort?: HealthCheckPort;
    /**
     * Indicates whether health checks are enabled. If the target type is lambda, health checks are disabled by default but can be enabled. If the target type is instance, ip, or alb, health checks are always enabled and cannot be disabled.
     */
    HealthCheckEnabled?: HealthCheckEnabled;
    /**
     * [HTTP/HTTPS health checks] The destination for health checks on the targets. [HTTP1 or HTTP2 protocol version] The ping path. The default is /. [GRPC protocol version] The path of a custom health check method with the format /package.service/method. The default is /Amazon Web Services.ALB/healthcheck.
     */
    HealthCheckPath?: Path;
    /**
     * The approximate amount of time, in seconds, between health checks of an individual target. The range is 5-300. If the target group protocol is TCP, TLS, UDP, TCP_UDP, HTTP or HTTPS, the default is 30 seconds. If the target group protocol is GENEVE, the default is 10 seconds. If the target type is lambda, the default is 35 seconds.
     */
    HealthCheckIntervalSeconds?: HealthCheckIntervalSeconds;
    /**
     * The amount of time, in seconds, during which no response from a target means a failed health check. The range is 2–120 seconds. For target groups with a protocol of HTTP, the default is 6 seconds. For target groups with a protocol of TCP, TLS or HTTPS, the default is 10 seconds. For target groups with a protocol of GENEVE, the default is 5 seconds. If the target type is lambda, the default is 30 seconds.
     */
    HealthCheckTimeoutSeconds?: HealthCheckTimeoutSeconds;
    /**
     * The number of consecutive health check successes required before considering a target healthy. The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP or HTTPS, the default is 5. For target groups with a protocol of GENEVE, the default is 5. If the target type is lambda, the default is 5.
     */
    HealthyThresholdCount?: HealthCheckThresholdCount;
    /**
     * The number of consecutive health check failures required before considering a target unhealthy. The range is 2-10. If the target group protocol is TCP, TCP_UDP, UDP, TLS, HTTP or HTTPS, the default is 2. For target groups with a protocol of GENEVE, the default is 2. If the target type is lambda, the default is 5.
     */
    UnhealthyThresholdCount?: HealthCheckThresholdCount;
    /**
     * [HTTP/HTTPS health checks] The HTTP or gRPC codes to use when checking for a successful response from a target. For target groups with a protocol of TCP, TCP_UDP, UDP or TLS the range is 200-599. For target groups with a protocol of HTTP or HTTPS, the range is 200-499. For target groups with a protocol of GENEVE, the range is 200-399.
     */
    Matcher?: Matcher;
    /**
     * The type of target that you must specify when registering targets with this target group. You can't specify targets for a target group using more than one target type.    instance - Register targets by instance ID. This is the default value.    ip - Register targets by IP address. You can specify IP addresses from the subnets of the virtual private cloud (VPC) for the target group, the RFC 1918 range (10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16), and the RFC 6598 range (100.64.0.0/10). You can't specify publicly routable IP addresses.    lambda - Register a single Lambda function as a target.    alb - Register a single Application Load Balancer as a target.  
     */
    TargetType?: TargetTypeEnum;
    /**
     * The tags to assign to the target group.
     */
    Tags?: TagList;
    /**
     * The type of IP address used for this target group. The possible values are ipv4 and ipv6. This is an optional parameter. If not specified, the IP address type defaults to ipv4.
     */
    IpAddressType?: TargetGroupIpAddressTypeEnum;
  }
  export interface CreateTargetGroupOutput {
    /**
     * Information about the target group.
     */
    TargetGroups?: TargetGroups;
  }
  export type CreatedTime = Date;
  export type CustomerOwnedIpv4Pool = string;
  export type DNSName = string;
  export type Default = boolean;
  export interface DeleteListenerInput {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn: ListenerArn;
  }
  export interface DeleteListenerOutput {
  }
  export interface DeleteLoadBalancerInput {
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn: LoadBalancerArn;
  }
  export interface DeleteLoadBalancerOutput {
  }
  export interface DeleteRuleInput {
    /**
     * The Amazon Resource Name (ARN) of the rule.
     */
    RuleArn: RuleArn;
  }
  export interface DeleteRuleOutput {
  }
  export interface DeleteTargetGroupInput {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    TargetGroupArn: TargetGroupArn;
  }
  export interface DeleteTargetGroupOutput {
  }
  export interface DeregisterTargetsInput {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    TargetGroupArn: TargetGroupArn;
    /**
     * The targets. If you specified a port override when you registered a target, you must specify both the target ID and the port when you deregister it.
     */
    Targets: TargetDescriptions;
  }
  export interface DeregisterTargetsOutput {
  }
  export interface DescribeAccountLimitsInput {
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: Marker;
    /**
     * The maximum number of results to return with this call.
     */
    PageSize?: PageSize;
  }
  export interface DescribeAccountLimitsOutput {
    /**
     * Information about the limits.
     */
    Limits?: Limits;
    /**
     * If there are additional results, this is the marker for the next set of results. Otherwise, this is null.
     */
    NextMarker?: Marker;
  }
  export interface DescribeListenerCertificatesInput {
    /**
     * The Amazon Resource Names (ARN) of the listener.
     */
    ListenerArn: ListenerArn;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: Marker;
    /**
     * The maximum number of results to return with this call.
     */
    PageSize?: PageSize;
  }
  export interface DescribeListenerCertificatesOutput {
    /**
     * Information about the certificates.
     */
    Certificates?: CertificateList;
    /**
     * If there are additional results, this is the marker for the next set of results. Otherwise, this is null.
     */
    NextMarker?: Marker;
  }
  export interface DescribeListenersInput {
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn?: LoadBalancerArn;
    /**
     * The Amazon Resource Names (ARN) of the listeners.
     */
    ListenerArns?: ListenerArns;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: Marker;
    /**
     * The maximum number of results to return with this call.
     */
    PageSize?: PageSize;
  }
  export interface DescribeListenersOutput {
    /**
     * Information about the listeners.
     */
    Listeners?: Listeners;
    /**
     * If there are additional results, this is the marker for the next set of results. Otherwise, this is null.
     */
    NextMarker?: Marker;
  }
  export interface DescribeLoadBalancerAttributesInput {
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn: LoadBalancerArn;
  }
  export interface DescribeLoadBalancerAttributesOutput {
    /**
     * Information about the load balancer attributes.
     */
    Attributes?: LoadBalancerAttributes;
  }
  export interface DescribeLoadBalancersInput {
    /**
     * The Amazon Resource Names (ARN) of the load balancers. You can specify up to 20 load balancers in a single call.
     */
    LoadBalancerArns?: LoadBalancerArns;
    /**
     * The names of the load balancers.
     */
    Names?: LoadBalancerNames;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: Marker;
    /**
     * The maximum number of results to return with this call.
     */
    PageSize?: PageSize;
  }
  export interface DescribeLoadBalancersOutput {
    /**
     * Information about the load balancers.
     */
    LoadBalancers?: LoadBalancers;
    /**
     * If there are additional results, this is the marker for the next set of results. Otherwise, this is null.
     */
    NextMarker?: Marker;
  }
  export interface DescribeRulesInput {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn?: ListenerArn;
    /**
     * The Amazon Resource Names (ARN) of the rules.
     */
    RuleArns?: RuleArns;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: Marker;
    /**
     * The maximum number of results to return with this call.
     */
    PageSize?: PageSize;
  }
  export interface DescribeRulesOutput {
    /**
     * Information about the rules.
     */
    Rules?: Rules;
    /**
     * If there are additional results, this is the marker for the next set of results. Otherwise, this is null.
     */
    NextMarker?: Marker;
  }
  export interface DescribeSSLPoliciesInput {
    /**
     * The names of the policies.
     */
    Names?: SslPolicyNames;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: Marker;
    /**
     * The maximum number of results to return with this call.
     */
    PageSize?: PageSize;
    /**
     *  The type of load balancer. The default lists the SSL policies for all load balancers.
     */
    LoadBalancerType?: LoadBalancerTypeEnum;
  }
  export interface DescribeSSLPoliciesOutput {
    /**
     * Information about the security policies.
     */
    SslPolicies?: SslPolicies;
    /**
     * If there are additional results, this is the marker for the next set of results. Otherwise, this is null.
     */
    NextMarker?: Marker;
  }
  export interface DescribeTagsInput {
    /**
     * The Amazon Resource Names (ARN) of the resources. You can specify up to 20 resources in a single call.
     */
    ResourceArns: ResourceArns;
  }
  export interface DescribeTagsOutput {
    /**
     * Information about the tags.
     */
    TagDescriptions?: TagDescriptions;
  }
  export interface DescribeTargetGroupAttributesInput {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    TargetGroupArn: TargetGroupArn;
  }
  export interface DescribeTargetGroupAttributesOutput {
    /**
     * Information about the target group attributes
     */
    Attributes?: TargetGroupAttributes;
  }
  export interface DescribeTargetGroupsInput {
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn?: LoadBalancerArn;
    /**
     * The Amazon Resource Names (ARN) of the target groups.
     */
    TargetGroupArns?: TargetGroupArns;
    /**
     * The names of the target groups.
     */
    Names?: TargetGroupNames;
    /**
     * The marker for the next set of results. (You received this marker from a previous call.)
     */
    Marker?: Marker;
    /**
     * The maximum number of results to return with this call.
     */
    PageSize?: PageSize;
  }
  export interface DescribeTargetGroupsOutput {
    /**
     * Information about the target groups.
     */
    TargetGroups?: TargetGroups;
    /**
     * If there are additional results, this is the marker for the next set of results. Otherwise, this is null.
     */
    NextMarker?: Marker;
  }
  export interface DescribeTargetHealthInput {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    TargetGroupArn: TargetGroupArn;
    /**
     * The targets.
     */
    Targets?: TargetDescriptions;
  }
  export interface DescribeTargetHealthOutput {
    /**
     * Information about the health of the targets.
     */
    TargetHealthDescriptions?: TargetHealthDescriptions;
  }
  export type Description = string;
  export type EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic = string;
  export type EnforceSecurityGroupInboundRulesOnPrivateLinkTrafficEnum = "on"|"off"|string;
  export interface FixedResponseActionConfig {
    /**
     * The message.
     */
    MessageBody?: FixedResponseActionMessage;
    /**
     * The HTTP response code (2XX, 4XX, or 5XX).
     */
    StatusCode: FixedResponseActionStatusCode;
    /**
     * The content type. Valid Values: text/plain | text/css | text/html | application/javascript | application/json
     */
    ContentType?: FixedResponseActionContentType;
  }
  export type FixedResponseActionContentType = string;
  export type FixedResponseActionMessage = string;
  export type FixedResponseActionStatusCode = string;
  export interface ForwardActionConfig {
    /**
     * The target groups. For Network Load Balancers, you can specify a single target group.
     */
    TargetGroups?: TargetGroupList;
    /**
     * The target group stickiness for the rule.
     */
    TargetGroupStickinessConfig?: TargetGroupStickinessConfig;
  }
  export type GrpcCode = string;
  export type HealthCheckEnabled = boolean;
  export type HealthCheckIntervalSeconds = number;
  export type HealthCheckPort = string;
  export type HealthCheckThresholdCount = number;
  export type HealthCheckTimeoutSeconds = number;
  export interface HostHeaderConditionConfig {
    /**
     * The host names. The maximum size of each name is 128 characters. The comparison is case insensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character). If you specify multiple strings, the condition is satisfied if one of the strings matches the host name.
     */
    Values?: ListOfString;
  }
  export type HttpCode = string;
  export interface HttpHeaderConditionConfig {
    /**
     * The name of the HTTP header field. The maximum size is 40 characters. The header name is case insensitive. The allowed characters are specified by RFC 7230. Wildcards are not supported. You can't use an HTTP header condition to specify the host header. Use HostHeaderConditionConfig to specify a host header condition.
     */
    HttpHeaderName?: HttpHeaderConditionName;
    /**
     * The strings to compare against the value of the HTTP header. The maximum size of each string is 128 characters. The comparison strings are case insensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character). If the same header appears multiple times in the request, we search them in order until a match is found. If you specify multiple strings, the condition is satisfied if one of the strings matches the value of the HTTP header. To require that all of the strings are a match, create one condition per string.
     */
    Values?: ListOfString;
  }
  export type HttpHeaderConditionName = string;
  export interface HttpRequestMethodConditionConfig {
    /**
     * The name of the request method. The maximum size is 40 characters. The allowed characters are A-Z, hyphen (-), and underscore (_). The comparison is case sensitive. Wildcards are not supported; therefore, the method name must be an exact match. If you specify multiple strings, the condition is satisfied if one of the strings matches the HTTP request method. We recommend that you route GET and HEAD requests in the same way, because the response to a HEAD request may be cached.
     */
    Values?: ListOfString;
  }
  export type IPv6Address = string;
  export type IpAddress = string;
  export type IpAddressType = "ipv4"|"dualstack"|string;
  export type IsDefault = boolean;
  export interface Limit {
    /**
     * The name of the limit. The possible values are:   application-load-balancers   condition-values-per-alb-rule   condition-wildcards-per-alb-rule   gateway-load-balancers   gateway-load-balancers-per-vpc   geneve-target-groups   listeners-per-application-load-balancer   listeners-per-network-load-balancer   network-load-balancers   rules-per-application-load-balancer   target-groups   target-groups-per-action-on-application-load-balancer   target-groups-per-action-on-network-load-balancer   target-groups-per-application-load-balancer   targets-per-application-load-balancer   targets-per-availability-zone-per-gateway-load-balancer   targets-per-availability-zone-per-network-load-balancer   targets-per-network-load-balancer  
     */
    Name?: Name;
    /**
     * The maximum value of the limit.
     */
    Max?: Max;
  }
  export type Limits = Limit[];
  export type ListOfString = StringValue[];
  export interface Listener {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn?: ListenerArn;
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn?: LoadBalancerArn;
    /**
     * The port on which the load balancer is listening.
     */
    Port?: Port;
    /**
     * The protocol for connections from clients to the load balancer.
     */
    Protocol?: ProtocolEnum;
    /**
     * [HTTPS or TLS listener] The default certificate for the listener.
     */
    Certificates?: CertificateList;
    /**
     * [HTTPS or TLS listener] The security policy that defines which protocols and ciphers are supported.
     */
    SslPolicy?: SslPolicyName;
    /**
     * The default actions for the listener.
     */
    DefaultActions?: Actions;
    /**
     * [TLS listener] The name of the Application-Layer Protocol Negotiation (ALPN) policy.
     */
    AlpnPolicy?: AlpnPolicyName;
  }
  export type ListenerArn = string;
  export type ListenerArns = ListenerArn[];
  export type Listeners = Listener[];
  export interface LoadBalancer {
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn?: LoadBalancerArn;
    /**
     * The public DNS name of the load balancer.
     */
    DNSName?: DNSName;
    /**
     * The ID of the Amazon Route 53 hosted zone associated with the load balancer.
     */
    CanonicalHostedZoneId?: CanonicalHostedZoneId;
    /**
     * The date and time the load balancer was created.
     */
    CreatedTime?: CreatedTime;
    /**
     * The name of the load balancer.
     */
    LoadBalancerName?: LoadBalancerName;
    /**
     * The nodes of an Internet-facing load balancer have public IP addresses. The DNS name of an Internet-facing load balancer is publicly resolvable to the public IP addresses of the nodes. Therefore, Internet-facing load balancers can route requests from clients over the internet. The nodes of an internal load balancer have only private IP addresses. The DNS name of an internal load balancer is publicly resolvable to the private IP addresses of the nodes. Therefore, internal load balancers can route requests only from clients with access to the VPC for the load balancer.
     */
    Scheme?: LoadBalancerSchemeEnum;
    /**
     * The ID of the VPC for the load balancer.
     */
    VpcId?: VpcId;
    /**
     * The state of the load balancer.
     */
    State?: LoadBalancerState;
    /**
     * The type of load balancer.
     */
    Type?: LoadBalancerTypeEnum;
    /**
     * The subnets for the load balancer.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * The IDs of the security groups for the load balancer.
     */
    SecurityGroups?: SecurityGroups;
    /**
     * The type of IP addresses used by the subnets for your load balancer. The possible values are ipv4 (for IPv4 addresses) and dualstack (for IPv4 and IPv6 addresses).
     */
    IpAddressType?: IpAddressType;
    /**
     * [Application Load Balancers on Outposts] The ID of the customer-owned address pool.
     */
    CustomerOwnedIpv4Pool?: CustomerOwnedIpv4Pool;
    /**
     * Indicates whether to evaluate inbound security group rules for traffic sent to a Network Load Balancer through Amazon Web Services PrivateLink.
     */
    EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic?: EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic;
  }
  export interface LoadBalancerAddress {
    /**
     * The static IP address.
     */
    IpAddress?: IpAddress;
    /**
     * [Network Load Balancers] The allocation ID of the Elastic IP address for an internal-facing load balancer.
     */
    AllocationId?: AllocationId;
    /**
     * [Network Load Balancers] The private IPv4 address for an internal load balancer.
     */
    PrivateIPv4Address?: PrivateIPv4Address;
    /**
     * [Network Load Balancers] The IPv6 address.
     */
    IPv6Address?: IPv6Address;
  }
  export type LoadBalancerAddresses = LoadBalancerAddress[];
  export type LoadBalancerArn = string;
  export type LoadBalancerArns = LoadBalancerArn[];
  export interface LoadBalancerAttribute {
    /**
     * The name of the attribute. The following attributes are supported by all load balancers:    deletion_protection.enabled - Indicates whether deletion protection is enabled. The value is true or false. The default is false.    load_balancing.cross_zone.enabled - Indicates whether cross-zone load balancing is enabled. The possible values are true and false. The default for Network Load Balancers and Gateway Load Balancers is false. The default for Application Load Balancers is true, and cannot be changed.   The following attributes are supported by both Application Load Balancers and Network Load Balancers:    access_logs.s3.enabled - Indicates whether access logs are enabled. The value is true or false. The default is false.    access_logs.s3.bucket - The name of the S3 bucket for the access logs. This attribute is required if access logs are enabled. The bucket must exist in the same region as the load balancer and have a bucket policy that grants Elastic Load Balancing permissions to write to the bucket.    access_logs.s3.prefix - The prefix for the location in the S3 bucket for the access logs.    ipv6.deny_all_igw_traffic - Blocks internet gateway (IGW) access to the load balancer. It is set to false for internet-facing load balancers and true for internal load balancers, preventing unintended access to your internal load balancer through an internet gateway.   The following attributes are supported by only Application Load Balancers:    idle_timeout.timeout_seconds - The idle timeout value, in seconds. The valid range is 1-4000 seconds. The default is 60 seconds.    routing.http.desync_mitigation_mode - Determines how the load balancer handles requests that might pose a security risk to your application. The possible values are monitor, defensive, and strictest. The default is defensive.    routing.http.drop_invalid_header_fields.enabled - Indicates whether HTTP headers with invalid header fields are removed by the load balancer (true) or routed to targets (false). The default is false.    routing.http.preserve_host_header.enabled - Indicates whether the Application Load Balancer should preserve the Host header in the HTTP request and send it to the target without any change. The possible values are true and false. The default is false.    routing.http.x_amzn_tls_version_and_cipher_suite.enabled - Indicates whether the two headers (x-amzn-tls-version and x-amzn-tls-cipher-suite), which contain information about the negotiated TLS version and cipher suite, are added to the client request before sending it to the target. The x-amzn-tls-version header has information about the TLS protocol version negotiated with the client, and the x-amzn-tls-cipher-suite header has information about the cipher suite negotiated with the client. Both headers are in OpenSSL format. The possible values for the attribute are true and false. The default is false.    routing.http.xff_client_port.enabled - Indicates whether the X-Forwarded-For header should preserve the source port that the client used to connect to the load balancer. The possible values are true and false. The default is false.    routing.http.xff_header_processing.mode - Enables you to modify, preserve, or remove the X-Forwarded-For header in the HTTP request before the Application Load Balancer sends the request to the target. The possible values are append, preserve, and remove. The default is append.   If the value is append, the Application Load Balancer adds the client IP address (of the last hop) to the X-Forwarded-For header in the HTTP request before it sends it to targets.   If the value is preserve the Application Load Balancer preserves the X-Forwarded-For header in the HTTP request, and sends it to targets without any change.   If the value is remove, the Application Load Balancer removes the X-Forwarded-For header in the HTTP request before it sends it to targets.      routing.http2.enabled - Indicates whether HTTP/2 is enabled. The possible values are true and false. The default is true. Elastic Load Balancing requires that message header names contain only alphanumeric characters and hyphens.    waf.fail_open.enabled - Indicates whether to allow a WAF-enabled load balancer to route requests to targets if it is unable to forward the request to Amazon Web Services WAF. The possible values are true and false. The default is false.   The following attributes are supported by only Network Load Balancers:    dns_record.client_routing_policy - Indicates how traffic is distributed among the load balancer Availability Zones. The possible values are availability_zone_affinity with 100 percent zonal affinity, partial_availability_zone_affinity with 85 percent zonal affinity, and any_availability_zone with 0 percent zonal affinity.  
     */
    Key?: LoadBalancerAttributeKey;
    /**
     * The value of the attribute.
     */
    Value?: LoadBalancerAttributeValue;
  }
  export type LoadBalancerAttributeKey = string;
  export type LoadBalancerAttributeValue = string;
  export type LoadBalancerAttributes = LoadBalancerAttribute[];
  export type LoadBalancerName = string;
  export type LoadBalancerNames = LoadBalancerName[];
  export type LoadBalancerSchemeEnum = "internet-facing"|"internal"|string;
  export interface LoadBalancerState {
    /**
     * The state code. The initial state of the load balancer is provisioning. After the load balancer is fully set up and ready to route traffic, its state is active. If load balancer is routing traffic but does not have the resources it needs to scale, its state isactive_impaired. If the load balancer could not be set up, its state is failed.
     */
    Code?: LoadBalancerStateEnum;
    /**
     * A description of the state.
     */
    Reason?: StateReason;
  }
  export type LoadBalancerStateEnum = "active"|"provisioning"|"active_impaired"|"failed"|string;
  export type LoadBalancerTypeEnum = "application"|"network"|"gateway"|string;
  export type LoadBalancers = LoadBalancer[];
  export type Marker = string;
  export interface Matcher {
    /**
     * For Application Load Balancers, you can specify values between 200 and 499, with the default value being 200. You can specify multiple values (for example, "200,202") or a range of values (for example, "200-299"). For Network Load Balancers, you can specify values between 200 and 599, with the default value being 200-399. You can specify multiple values (for example, "200,202") or a range of values (for example, "200-299"). For Gateway Load Balancers, this must be "200–399". Note that when using shorthand syntax, some values such as commas need to be escaped.
     */
    HttpCode?: HttpCode;
    /**
     * You can specify values between 0 and 99. You can specify multiple values (for example, "0,1") or a range of values (for example, "0-5"). The default value is 12.
     */
    GrpcCode?: GrpcCode;
  }
  export type Max = string;
  export interface ModifyListenerInput {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn: ListenerArn;
    /**
     * The port for connections from clients to the load balancer. You cannot specify a port for a Gateway Load Balancer.
     */
    Port?: Port;
    /**
     * The protocol for connections from clients to the load balancer. Application Load Balancers support the HTTP and HTTPS protocols. Network Load Balancers support the TCP, TLS, UDP, and TCP_UDP protocols. You can’t change the protocol to UDP or TCP_UDP if dual-stack mode is enabled. You cannot specify a protocol for a Gateway Load Balancer.
     */
    Protocol?: ProtocolEnum;
    /**
     * [HTTPS and TLS listeners] The security policy that defines which protocols and ciphers are supported. For more information, see Security policies in the Application Load Balancers Guide or Security policies in the Network Load Balancers Guide.
     */
    SslPolicy?: SslPolicyName;
    /**
     * [HTTPS and TLS listeners] The default certificate for the listener. You must provide exactly one certificate. Set CertificateArn to the certificate ARN but do not set IsDefault.
     */
    Certificates?: CertificateList;
    /**
     * The actions for the default rule.
     */
    DefaultActions?: Actions;
    /**
     * [TLS listeners] The name of the Application-Layer Protocol Negotiation (ALPN) policy. You can specify one policy name. The following are the possible values:    HTTP1Only     HTTP2Only     HTTP2Optional     HTTP2Preferred     None    For more information, see ALPN policies in the Network Load Balancers Guide.
     */
    AlpnPolicy?: AlpnPolicyName;
  }
  export interface ModifyListenerOutput {
    /**
     * Information about the modified listener.
     */
    Listeners?: Listeners;
  }
  export interface ModifyLoadBalancerAttributesInput {
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn: LoadBalancerArn;
    /**
     * The load balancer attributes.
     */
    Attributes: LoadBalancerAttributes;
  }
  export interface ModifyLoadBalancerAttributesOutput {
    /**
     * Information about the load balancer attributes.
     */
    Attributes?: LoadBalancerAttributes;
  }
  export interface ModifyRuleInput {
    /**
     * The Amazon Resource Name (ARN) of the rule.
     */
    RuleArn: RuleArn;
    /**
     * The conditions.
     */
    Conditions?: RuleConditionList;
    /**
     * The actions.
     */
    Actions?: Actions;
  }
  export interface ModifyRuleOutput {
    /**
     * Information about the modified rule.
     */
    Rules?: Rules;
  }
  export interface ModifyTargetGroupAttributesInput {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    TargetGroupArn: TargetGroupArn;
    /**
     * The attributes.
     */
    Attributes: TargetGroupAttributes;
  }
  export interface ModifyTargetGroupAttributesOutput {
    /**
     * Information about the attributes.
     */
    Attributes?: TargetGroupAttributes;
  }
  export interface ModifyTargetGroupInput {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    TargetGroupArn: TargetGroupArn;
    /**
     * The protocol the load balancer uses when performing health checks on targets. For Application Load Balancers, the default is HTTP. For Network Load Balancers and Gateway Load Balancers, the default is TCP. The TCP protocol is not supported for health checks if the protocol of the target group is HTTP or HTTPS. It is supported for health checks only if the protocol of the target group is TCP, TLS, UDP, or TCP_UDP. The GENEVE, TLS, UDP, and TCP_UDP protocols are not supported for health checks.
     */
    HealthCheckProtocol?: ProtocolEnum;
    /**
     * The port the load balancer uses when performing health checks on targets.
     */
    HealthCheckPort?: HealthCheckPort;
    /**
     * [HTTP/HTTPS health checks] The destination for health checks on the targets. [HTTP1 or HTTP2 protocol version] The ping path. The default is /. [GRPC protocol version] The path of a custom health check method with the format /package.service/method. The default is /Amazon Web Services.ALB/healthcheck.
     */
    HealthCheckPath?: Path;
    /**
     * Indicates whether health checks are enabled.
     */
    HealthCheckEnabled?: HealthCheckEnabled;
    /**
     * The approximate amount of time, in seconds, between health checks of an individual target.
     */
    HealthCheckIntervalSeconds?: HealthCheckIntervalSeconds;
    /**
     * [HTTP/HTTPS health checks] The amount of time, in seconds, during which no response means a failed health check.
     */
    HealthCheckTimeoutSeconds?: HealthCheckTimeoutSeconds;
    /**
     * The number of consecutive health checks successes required before considering an unhealthy target healthy.
     */
    HealthyThresholdCount?: HealthCheckThresholdCount;
    /**
     * The number of consecutive health check failures required before considering the target unhealthy.
     */
    UnhealthyThresholdCount?: HealthCheckThresholdCount;
    /**
     * [HTTP/HTTPS health checks] The HTTP or gRPC codes to use when checking for a successful response from a target. For target groups with a protocol of TCP, TCP_UDP, UDP or TLS the range is 200-599. For target groups with a protocol of HTTP or HTTPS, the range is 200-499. For target groups with a protocol of GENEVE, the range is 200-399.
     */
    Matcher?: Matcher;
  }
  export interface ModifyTargetGroupOutput {
    /**
     * Information about the modified target group.
     */
    TargetGroups?: TargetGroups;
  }
  export type Name = string;
  export type OutpostId = string;
  export type PageSize = number;
  export type Path = string;
  export interface PathPatternConditionConfig {
    /**
     * The path patterns to compare against the request URL. The maximum size of each string is 128 characters. The comparison is case sensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character). If you specify multiple strings, the condition is satisfied if one of them matches the request URL. The path pattern is compared only to the path of the URL, not to its query string. To compare against the query string, use QueryStringConditionConfig.
     */
    Values?: ListOfString;
  }
  export type Port = number;
  export type PrivateIPv4Address = string;
  export type ProtocolEnum = "HTTP"|"HTTPS"|"TCP"|"TLS"|"UDP"|"TCP_UDP"|"GENEVE"|string;
  export type ProtocolVersion = string;
  export interface QueryStringConditionConfig {
    /**
     * The key/value pairs or values to find in the query string. The maximum size of each string is 128 characters. The comparison is case insensitive. The following wildcard characters are supported: * (matches 0 or more characters) and ? (matches exactly 1 character). To search for a literal '*' or '?' character in a query string, you must escape these characters in Values using a '\' character. If you specify multiple key/value pairs or values, the condition is satisfied if one of them is found in the query string.
     */
    Values?: QueryStringKeyValuePairList;
  }
  export interface QueryStringKeyValuePair {
    /**
     * The key. You can omit the key.
     */
    Key?: StringValue;
    /**
     * The value.
     */
    Value?: StringValue;
  }
  export type QueryStringKeyValuePairList = QueryStringKeyValuePair[];
  export interface RedirectActionConfig {
    /**
     * The protocol. You can specify HTTP, HTTPS, or #{protocol}. You can redirect HTTP to HTTP, HTTP to HTTPS, and HTTPS to HTTPS. You cannot redirect HTTPS to HTTP.
     */
    Protocol?: RedirectActionProtocol;
    /**
     * The port. You can specify a value from 1 to 65535 or #{port}.
     */
    Port?: RedirectActionPort;
    /**
     * The hostname. This component is not percent-encoded. The hostname can contain #{host}.
     */
    Host?: RedirectActionHost;
    /**
     * The absolute path, starting with the leading "/". This component is not percent-encoded. The path can contain #{host}, #{path}, and #{port}.
     */
    Path?: RedirectActionPath;
    /**
     * The query parameters, URL-encoded when necessary, but not percent-encoded. Do not include the leading "?", as it is automatically added. You can specify any of the reserved keywords.
     */
    Query?: RedirectActionQuery;
    /**
     * The HTTP redirect code. The redirect is either permanent (HTTP 301) or temporary (HTTP 302).
     */
    StatusCode: RedirectActionStatusCodeEnum;
  }
  export type RedirectActionHost = string;
  export type RedirectActionPath = string;
  export type RedirectActionPort = string;
  export type RedirectActionProtocol = string;
  export type RedirectActionQuery = string;
  export type RedirectActionStatusCodeEnum = "HTTP_301"|"HTTP_302"|string;
  export interface RegisterTargetsInput {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    TargetGroupArn: TargetGroupArn;
    /**
     * The targets.
     */
    Targets: TargetDescriptions;
  }
  export interface RegisterTargetsOutput {
  }
  export interface RemoveListenerCertificatesInput {
    /**
     * The Amazon Resource Name (ARN) of the listener.
     */
    ListenerArn: ListenerArn;
    /**
     * The certificate to remove. You can specify one certificate per call. Set CertificateArn to the certificate ARN but do not set IsDefault.
     */
    Certificates: CertificateList;
  }
  export interface RemoveListenerCertificatesOutput {
  }
  export interface RemoveTagsInput {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArns: ResourceArns;
    /**
     * The tag keys for the tags to remove.
     */
    TagKeys: TagKeys;
  }
  export interface RemoveTagsOutput {
  }
  export type ResourceArn = string;
  export type ResourceArns = ResourceArn[];
  export interface Rule {
    /**
     * The Amazon Resource Name (ARN) of the rule.
     */
    RuleArn?: RuleArn;
    /**
     * The priority.
     */
    Priority?: String;
    /**
     * The conditions. Each rule can include zero or one of the following conditions: http-request-method, host-header, path-pattern, and source-ip, and zero or more of the following conditions: http-header and query-string.
     */
    Conditions?: RuleConditionList;
    /**
     * The actions. Each rule must include exactly one of the following types of actions: forward, redirect, or fixed-response, and it must be the last action to be performed.
     */
    Actions?: Actions;
    /**
     * Indicates whether this is the default rule.
     */
    IsDefault?: IsDefault;
  }
  export type RuleArn = string;
  export type RuleArns = RuleArn[];
  export interface RuleCondition {
    /**
     * The field in the HTTP request. The following are the possible values:    http-header     http-request-method     host-header     path-pattern     query-string     source-ip   
     */
    Field?: ConditionFieldName;
    /**
     * The condition value. Specify only when Field is host-header or path-pattern. Alternatively, to specify multiple host names or multiple path patterns, use HostHeaderConfig or PathPatternConfig. If Field is host-header and you are not using HostHeaderConfig, you can specify a single host name (for example, my.example.com) in Values. A host name is case insensitive, can be up to 128 characters in length, and can contain any of the following characters.   A-Z, a-z, 0-9   - .   * (matches 0 or more characters)   ? (matches exactly 1 character)   If Field is path-pattern and you are not using PathPatternConfig, you can specify a single path pattern (for example, /img/*) in Values. A path pattern is case-sensitive, can be up to 128 characters in length, and can contain any of the following characters.   A-Z, a-z, 0-9   _ - . $ / ~ " ' @ : +   &amp; (using &amp;amp;)   * (matches 0 or more characters)   ? (matches exactly 1 character)  
     */
    Values?: ListOfString;
    /**
     * Information for a host header condition. Specify only when Field is host-header.
     */
    HostHeaderConfig?: HostHeaderConditionConfig;
    /**
     * Information for a path pattern condition. Specify only when Field is path-pattern.
     */
    PathPatternConfig?: PathPatternConditionConfig;
    /**
     * Information for an HTTP header condition. Specify only when Field is http-header.
     */
    HttpHeaderConfig?: HttpHeaderConditionConfig;
    /**
     * Information for a query string condition. Specify only when Field is query-string.
     */
    QueryStringConfig?: QueryStringConditionConfig;
    /**
     * Information for an HTTP method condition. Specify only when Field is http-request-method.
     */
    HttpRequestMethodConfig?: HttpRequestMethodConditionConfig;
    /**
     * Information for a source IP condition. Specify only when Field is source-ip.
     */
    SourceIpConfig?: SourceIpConditionConfig;
  }
  export type RuleConditionList = RuleCondition[];
  export type RulePriority = number;
  export type RulePriorityList = RulePriorityPair[];
  export interface RulePriorityPair {
    /**
     * The Amazon Resource Name (ARN) of the rule.
     */
    RuleArn?: RuleArn;
    /**
     * The rule priority.
     */
    Priority?: RulePriority;
  }
  export type Rules = Rule[];
  export type SecurityGroupId = string;
  export type SecurityGroups = SecurityGroupId[];
  export interface SetIpAddressTypeInput {
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn: LoadBalancerArn;
    /**
     * The IP address type. The possible values are ipv4 (for IPv4 addresses) and dualstack (for IPv4 and IPv6 addresses). You can’t specify dualstack for a load balancer with a UDP or TCP_UDP listener.
     */
    IpAddressType: IpAddressType;
  }
  export interface SetIpAddressTypeOutput {
    /**
     * The IP address type.
     */
    IpAddressType?: IpAddressType;
  }
  export interface SetRulePrioritiesInput {
    /**
     * The rule priorities.
     */
    RulePriorities: RulePriorityList;
  }
  export interface SetRulePrioritiesOutput {
    /**
     * Information about the rules.
     */
    Rules?: Rules;
  }
  export interface SetSecurityGroupsInput {
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn: LoadBalancerArn;
    /**
     * The IDs of the security groups.
     */
    SecurityGroups: SecurityGroups;
    /**
     * Indicates whether to evaluate inbound security group rules for traffic sent to a Network Load Balancer through Amazon Web Services PrivateLink. The default is on.
     */
    EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic?: EnforceSecurityGroupInboundRulesOnPrivateLinkTrafficEnum;
  }
  export interface SetSecurityGroupsOutput {
    /**
     * The IDs of the security groups associated with the load balancer.
     */
    SecurityGroupIds?: SecurityGroups;
    /**
     * Indicates whether to evaluate inbound security group rules for traffic sent to a Network Load Balancer through Amazon Web Services PrivateLink.
     */
    EnforceSecurityGroupInboundRulesOnPrivateLinkTraffic?: EnforceSecurityGroupInboundRulesOnPrivateLinkTrafficEnum;
  }
  export interface SetSubnetsInput {
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    LoadBalancerArn: LoadBalancerArn;
    /**
     * The IDs of the public subnets. You can specify only one subnet per Availability Zone. You must specify either subnets or subnet mappings. [Application Load Balancers] You must specify subnets from at least two Availability Zones. [Application Load Balancers on Outposts] You must specify one Outpost subnet. [Application Load Balancers on Local Zones] You can specify subnets from one or more Local Zones. [Network Load Balancers] You can specify subnets from one or more Availability Zones. [Gateway Load Balancers] You can specify subnets from one or more Availability Zones.
     */
    Subnets?: Subnets;
    /**
     * The IDs of the public subnets. You can specify only one subnet per Availability Zone. You must specify either subnets or subnet mappings. [Application Load Balancers] You must specify subnets from at least two Availability Zones. You cannot specify Elastic IP addresses for your subnets. [Application Load Balancers on Outposts] You must specify one Outpost subnet. [Application Load Balancers on Local Zones] You can specify subnets from one or more Local Zones. [Network Load Balancers] You can specify subnets from one or more Availability Zones. You can specify one Elastic IP address per subnet if you need static IP addresses for your internet-facing load balancer. For internal load balancers, you can specify one private IP address per subnet from the IPv4 range of the subnet. For internet-facing load balancer, you can specify one IPv6 address per subnet. [Gateway Load Balancers] You can specify subnets from one or more Availability Zones.
     */
    SubnetMappings?: SubnetMappings;
    /**
     * [Network Load Balancers] The type of IP addresses used by the subnets for your load balancer. The possible values are ipv4 (for IPv4 addresses) and dualstack (for IPv4 and IPv6 addresses). You can’t specify dualstack for a load balancer with a UDP or TCP_UDP listener. [Gateway Load Balancers] The type of IP addresses used by the subnets for your load balancer. The possible values are ipv4 (for IPv4 addresses) and dualstack (for IPv4 and IPv6 addresses).
     */
    IpAddressType?: IpAddressType;
  }
  export interface SetSubnetsOutput {
    /**
     * Information about the subnets.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * [Network Load Balancers] The IP address type. [Gateway Load Balancers] The IP address type.
     */
    IpAddressType?: IpAddressType;
  }
  export interface SourceIpConditionConfig {
    /**
     * The source IP addresses, in CIDR format. You can use both IPv4 and IPv6 addresses. Wildcards are not supported. If you specify multiple addresses, the condition is satisfied if the source IP address of the request matches one of the CIDR blocks. This condition is not satisfied by the addresses in the X-Forwarded-For header. To search for addresses in the X-Forwarded-For header, use HttpHeaderConditionConfig.
     */
    Values?: ListOfString;
  }
  export type SslPolicies = SslPolicy[];
  export interface SslPolicy {
    /**
     * The protocols.
     */
    SslProtocols?: SslProtocols;
    /**
     * The ciphers.
     */
    Ciphers?: Ciphers;
    /**
     * The name of the policy.
     */
    Name?: SslPolicyName;
    /**
     *  The supported load balancers. 
     */
    SupportedLoadBalancerTypes?: ListOfString;
  }
  export type SslPolicyName = string;
  export type SslPolicyNames = SslPolicyName[];
  export type SslProtocol = string;
  export type SslProtocols = SslProtocol[];
  export type StateReason = string;
  export type String = string;
  export type StringValue = string;
  export type SubnetId = string;
  export interface SubnetMapping {
    /**
     * The ID of the subnet.
     */
    SubnetId?: SubnetId;
    /**
     * [Network Load Balancers] The allocation ID of the Elastic IP address for an internet-facing load balancer.
     */
    AllocationId?: AllocationId;
    /**
     * [Network Load Balancers] The private IPv4 address for an internal load balancer.
     */
    PrivateIPv4Address?: PrivateIPv4Address;
    /**
     * [Network Load Balancers] The IPv6 address.
     */
    IPv6Address?: IPv6Address;
  }
  export type SubnetMappings = SubnetMapping[];
  export type Subnets = SubnetId[];
  export interface Tag {
    /**
     * The key of the tag.
     */
    Key: TagKey;
    /**
     * The value of the tag.
     */
    Value?: TagValue;
  }
  export interface TagDescription {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn?: ResourceArn;
    /**
     * Information about the tags.
     */
    Tags?: TagList;
  }
  export type TagDescriptions = TagDescription[];
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export type TagList = Tag[];
  export type TagValue = string;
  export interface TargetDescription {
    /**
     * The ID of the target. If the target type of the target group is instance, specify an instance ID. If the target type is ip, specify an IP address. If the target type is lambda, specify the ARN of the Lambda function. If the target type is alb, specify the ARN of the Application Load Balancer target. 
     */
    Id: TargetId;
    /**
     * The port on which the target is listening. If the target group protocol is GENEVE, the supported port is 6081. If the target type is alb, the targeted Application Load Balancer must have at least one listener whose port matches the target group port. This parameter is not used if the target is a Lambda function.
     */
    Port?: Port;
    /**
     * An Availability Zone or all. This determines whether the target receives traffic from the load balancer nodes in the specified Availability Zone or from all enabled Availability Zones for the load balancer. For Application Load Balancer target groups, the specified Availability Zone value is only applicable when cross-zone load balancing is off. Otherwise the parameter is ignored and treated as all. This parameter is not supported if the target type of the target group is instance or alb. If the target type is ip and the IP address is in a subnet of the VPC for the target group, the Availability Zone is automatically detected and this parameter is optional. If the IP address is outside the VPC, this parameter is required. For Application Load Balancer target groups with cross-zone load balancing off, if the target type is ip and the IP address is outside of the VPC for the target group, this should be an Availability Zone inside the VPC for the target group. If the target type is lambda, this parameter is optional and the only supported value is all.
     */
    AvailabilityZone?: ZoneName;
  }
  export type TargetDescriptions = TargetDescription[];
  export interface TargetGroup {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    TargetGroupArn?: TargetGroupArn;
    /**
     * The name of the target group.
     */
    TargetGroupName?: TargetGroupName;
    /**
     * The protocol to use for routing traffic to the targets.
     */
    Protocol?: ProtocolEnum;
    /**
     * The port on which the targets are listening. This parameter is not used if the target is a Lambda function.
     */
    Port?: Port;
    /**
     * The ID of the VPC for the targets.
     */
    VpcId?: VpcId;
    /**
     * The protocol to use to connect with the target. The GENEVE, TLS, UDP, and TCP_UDP protocols are not supported for health checks.
     */
    HealthCheckProtocol?: ProtocolEnum;
    /**
     * The port to use to connect with the target.
     */
    HealthCheckPort?: HealthCheckPort;
    /**
     * Indicates whether health checks are enabled.
     */
    HealthCheckEnabled?: HealthCheckEnabled;
    /**
     * The approximate amount of time, in seconds, between health checks of an individual target.
     */
    HealthCheckIntervalSeconds?: HealthCheckIntervalSeconds;
    /**
     * The amount of time, in seconds, during which no response means a failed health check.
     */
    HealthCheckTimeoutSeconds?: HealthCheckTimeoutSeconds;
    /**
     * The number of consecutive health checks successes required before considering an unhealthy target healthy.
     */
    HealthyThresholdCount?: HealthCheckThresholdCount;
    /**
     * The number of consecutive health check failures required before considering the target unhealthy.
     */
    UnhealthyThresholdCount?: HealthCheckThresholdCount;
    /**
     * The destination for health checks on the targets.
     */
    HealthCheckPath?: Path;
    /**
     * The HTTP or gRPC codes to use when checking for a successful response from a target.
     */
    Matcher?: Matcher;
    /**
     * The Amazon Resource Name (ARN) of the load balancer that routes traffic to this target group. You can use each target group with only one load balancer.
     */
    LoadBalancerArns?: LoadBalancerArns;
    /**
     * The type of target that you must specify when registering targets with this target group. The possible values are instance (register targets by instance ID), ip (register targets by IP address), lambda (register a single Lambda function as a target), or alb (register a single Application Load Balancer as a target).
     */
    TargetType?: TargetTypeEnum;
    /**
     * [HTTP/HTTPS protocol] The protocol version. The possible values are GRPC, HTTP1, and HTTP2.
     */
    ProtocolVersion?: ProtocolVersion;
    /**
     * The type of IP address used for this target group. The possible values are ipv4 and ipv6. This is an optional parameter. If not specified, the IP address type defaults to ipv4.
     */
    IpAddressType?: TargetGroupIpAddressTypeEnum;
  }
  export type TargetGroupArn = string;
  export type TargetGroupArns = TargetGroupArn[];
  export interface TargetGroupAttribute {
    /**
     * The name of the attribute. The following attributes are supported by all load balancers:    deregistration_delay.timeout_seconds - The amount of time, in seconds, for Elastic Load Balancing to wait before changing the state of a deregistering target from draining to unused. The range is 0-3600 seconds. The default value is 300 seconds. If the target is a Lambda function, this attribute is not supported.    stickiness.enabled - Indicates whether target stickiness is enabled. The value is true or false. The default is false.    stickiness.type - Indicates the type of stickiness. The possible values are:    lb_cookie and app_cookie for Application Load Balancers.    source_ip for Network Load Balancers.    source_ip_dest_ip and source_ip_dest_ip_proto for Gateway Load Balancers.     The following attributes are supported by Application Load Balancers and Network Load Balancers:    load_balancing.cross_zone.enabled - Indicates whether cross zone load balancing is enabled. The value is true, false or use_load_balancer_configuration. The default is use_load_balancer_configuration.    target_group_health.dns_failover.minimum_healthy_targets.count - The minimum number of targets that must be healthy. If the number of healthy targets is below this value, mark the zone as unhealthy in DNS, so that traffic is routed only to healthy zones. The possible values are off or an integer from 1 to the maximum number of targets. The default is off.    target_group_health.dns_failover.minimum_healthy_targets.percentage - The minimum percentage of targets that must be healthy. If the percentage of healthy targets is below this value, mark the zone as unhealthy in DNS, so that traffic is routed only to healthy zones. The possible values are off or an integer from 1 to 100. The default is off.    target_group_health.unhealthy_state_routing.minimum_healthy_targets.count - The minimum number of targets that must be healthy. If the number of healthy targets is below this value, send traffic to all targets, including unhealthy targets. The possible values are 1 to the maximum number of targets. The default is 1.    target_group_health.unhealthy_state_routing.minimum_healthy_targets.percentage - The minimum percentage of targets that must be healthy. If the percentage of healthy targets is below this value, send traffic to all targets, including unhealthy targets. The possible values are off or an integer from 1 to 100. The default is off.   The following attributes are supported only if the load balancer is an Application Load Balancer and the target is an instance or an IP address:    load_balancing.algorithm.type - The load balancing algorithm determines how the load balancer selects targets when routing requests. The value is round_robin or least_outstanding_requests. The default is round_robin.    slow_start.duration_seconds - The time period, in seconds, during which a newly registered target receives an increasing share of the traffic to the target group. After this time period ends, the target receives its full share of traffic. The range is 30-900 seconds (15 minutes). The default is 0 seconds (disabled).    stickiness.app_cookie.cookie_name - Indicates the name of the application-based cookie. Names that start with the following prefixes are not allowed: AWSALB, AWSALBAPP, and AWSALBTG; they're reserved for use by the load balancer.    stickiness.app_cookie.duration_seconds - The time period, in seconds, during which requests from a client should be routed to the same target. After this time period expires, the application-based cookie is considered stale. The range is 1 second to 1 week (604800 seconds). The default value is 1 day (86400 seconds).    stickiness.lb_cookie.duration_seconds - The time period, in seconds, during which requests from a client should be routed to the same target. After this time period expires, the load balancer-generated cookie is considered stale. The range is 1 second to 1 week (604800 seconds). The default value is 1 day (86400 seconds).    The following attribute is supported only if the load balancer is an Application Load Balancer and the target is a Lambda function:    lambda.multi_value_headers.enabled - Indicates whether the request and response headers that are exchanged between the load balancer and the Lambda function include arrays of values or strings. The value is true or false. The default is false. If the value is false and the request contains a duplicate header field name or query parameter key, the load balancer uses the last value sent by the client.   The following attributes are supported only by Network Load Balancers:    deregistration_delay.connection_termination.enabled - Indicates whether the load balancer terminates connections at the end of the deregistration timeout. The value is true or false. For new UDP/TCP_UDP target groups the default is true. Otherwise, the default is false.    preserve_client_ip.enabled - Indicates whether client IP preservation is enabled. The value is true or false. The default is disabled if the target group type is IP address and the target group protocol is TCP or TLS. Otherwise, the default is enabled. Client IP preservation cannot be disabled for UDP and TCP_UDP target groups.    proxy_protocol_v2.enabled - Indicates whether Proxy Protocol version 2 is enabled. The value is true or false. The default is false.     target_health_state.unhealthy.connection_termination.enabled - Indicates whether the load balancer terminates connections to unhealthy targets. The value is true or false. The default is true.   The following attributes are supported only by Gateway Load Balancers:    target_failover.on_deregistration - Indicates how the Gateway Load Balancer handles existing flows when a target is deregistered. The possible values are rebalance and no_rebalance. The default is no_rebalance. The two attributes (target_failover.on_deregistration and target_failover.on_unhealthy) can't be set independently. The value you set for both attributes must be the same.     target_failover.on_unhealthy - Indicates how the Gateway Load Balancer handles existing flows when a target is unhealthy. The possible values are rebalance and no_rebalance. The default is no_rebalance. The two attributes (target_failover.on_deregistration and target_failover.on_unhealthy) cannot be set independently. The value you set for both attributes must be the same.   
     */
    Key?: TargetGroupAttributeKey;
    /**
     * The value of the attribute.
     */
    Value?: TargetGroupAttributeValue;
  }
  export type TargetGroupAttributeKey = string;
  export type TargetGroupAttributeValue = string;
  export type TargetGroupAttributes = TargetGroupAttribute[];
  export type TargetGroupIpAddressTypeEnum = "ipv4"|"ipv6"|string;
  export type TargetGroupList = TargetGroupTuple[];
  export type TargetGroupName = string;
  export type TargetGroupNames = TargetGroupName[];
  export interface TargetGroupStickinessConfig {
    /**
     * Indicates whether target group stickiness is enabled.
     */
    Enabled?: TargetGroupStickinessEnabled;
    /**
     * The time period, in seconds, during which requests from a client should be routed to the same target group. The range is 1-604800 seconds (7 days).
     */
    DurationSeconds?: TargetGroupStickinessDurationSeconds;
  }
  export type TargetGroupStickinessDurationSeconds = number;
  export type TargetGroupStickinessEnabled = boolean;
  export interface TargetGroupTuple {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    TargetGroupArn?: TargetGroupArn;
    /**
     * The weight. The range is 0 to 999.
     */
    Weight?: TargetGroupWeight;
  }
  export type TargetGroupWeight = number;
  export type TargetGroups = TargetGroup[];
  export interface TargetHealth {
    /**
     * The state of the target.
     */
    State?: TargetHealthStateEnum;
    /**
     * The reason code. If the target state is healthy, a reason code is not provided. If the target state is initial, the reason code can be one of the following values:    Elb.RegistrationInProgress - The target is in the process of being registered with the load balancer.    Elb.InitialHealthChecking - The load balancer is still sending the target the minimum number of health checks required to determine its health status.   If the target state is unhealthy, the reason code can be one of the following values:    Target.ResponseCodeMismatch - The health checks did not return an expected HTTP code. Applies only to Application Load Balancers and Gateway Load Balancers.    Target.Timeout - The health check requests timed out. Applies only to Application Load Balancers and Gateway Load Balancers.    Target.FailedHealthChecks - The load balancer received an error while establishing a connection to the target or the target response was malformed.    Elb.InternalError - The health checks failed due to an internal error. Applies only to Application Load Balancers.   If the target state is unused, the reason code can be one of the following values:    Target.NotRegistered - The target is not registered with the target group.    Target.NotInUse - The target group is not used by any load balancer or the target is in an Availability Zone that is not enabled for its load balancer.    Target.InvalidState - The target is in the stopped or terminated state.    Target.IpUnusable - The target IP address is reserved for use by a load balancer.   If the target state is draining, the reason code can be the following value:    Target.DeregistrationInProgress - The target is in the process of being deregistered and the deregistration delay period has not expired.   If the target state is unavailable, the reason code can be the following value:    Target.HealthCheckDisabled - Health checks are disabled for the target group. Applies only to Application Load Balancers.    Elb.InternalError - Target health is unavailable due to an internal error. Applies only to Network Load Balancers.  
     */
    Reason?: TargetHealthReasonEnum;
    /**
     * A description of the target health that provides additional details. If the state is healthy, a description is not provided.
     */
    Description?: Description;
  }
  export interface TargetHealthDescription {
    /**
     * The description of the target.
     */
    Target?: TargetDescription;
    /**
     * The port to use to connect with the target.
     */
    HealthCheckPort?: HealthCheckPort;
    /**
     * The health information for the target.
     */
    TargetHealth?: TargetHealth;
  }
  export type TargetHealthDescriptions = TargetHealthDescription[];
  export type TargetHealthReasonEnum = "Elb.RegistrationInProgress"|"Elb.InitialHealthChecking"|"Target.ResponseCodeMismatch"|"Target.Timeout"|"Target.FailedHealthChecks"|"Target.NotRegistered"|"Target.NotInUse"|"Target.DeregistrationInProgress"|"Target.InvalidState"|"Target.IpUnusable"|"Target.HealthCheckDisabled"|"Elb.InternalError"|string;
  export type TargetHealthStateEnum = "initial"|"healthy"|"unhealthy"|"unused"|"draining"|"unavailable"|string;
  export type TargetId = string;
  export type TargetTypeEnum = "instance"|"ip"|"lambda"|"alb"|string;
  export type VpcId = string;
  export type ZoneName = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-12-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ELBv2 client.
   */
  export import Types = ELBv2;
}
export = ELBv2;
