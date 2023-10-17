import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class NetworkFirewall extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: NetworkFirewall.Types.ClientConfiguration)
  config: Config & NetworkFirewall.Types.ClientConfiguration;
  /**
   * Associates a FirewallPolicy to a Firewall.  A firewall policy defines how to monitor and manage your VPC network traffic, using a collection of inspection rule groups and other settings. Each firewall requires one firewall policy association, and you can use the same firewall policy for multiple firewalls. 
   */
  associateFirewallPolicy(params: NetworkFirewall.Types.AssociateFirewallPolicyRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.AssociateFirewallPolicyResponse) => void): Request<NetworkFirewall.Types.AssociateFirewallPolicyResponse, AWSError>;
  /**
   * Associates a FirewallPolicy to a Firewall.  A firewall policy defines how to monitor and manage your VPC network traffic, using a collection of inspection rule groups and other settings. Each firewall requires one firewall policy association, and you can use the same firewall policy for multiple firewalls. 
   */
  associateFirewallPolicy(callback?: (err: AWSError, data: NetworkFirewall.Types.AssociateFirewallPolicyResponse) => void): Request<NetworkFirewall.Types.AssociateFirewallPolicyResponse, AWSError>;
  /**
   * Associates the specified subnets in the Amazon VPC to the firewall. You can specify one subnet for each of the Availability Zones that the VPC spans.  This request creates an AWS Network Firewall firewall endpoint in each of the subnets. To enable the firewall's protections, you must also modify the VPC's route tables for each subnet's Availability Zone, to redirect the traffic that's coming into and going out of the zone through the firewall endpoint. 
   */
  associateSubnets(params: NetworkFirewall.Types.AssociateSubnetsRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.AssociateSubnetsResponse) => void): Request<NetworkFirewall.Types.AssociateSubnetsResponse, AWSError>;
  /**
   * Associates the specified subnets in the Amazon VPC to the firewall. You can specify one subnet for each of the Availability Zones that the VPC spans.  This request creates an AWS Network Firewall firewall endpoint in each of the subnets. To enable the firewall's protections, you must also modify the VPC's route tables for each subnet's Availability Zone, to redirect the traffic that's coming into and going out of the zone through the firewall endpoint. 
   */
  associateSubnets(callback?: (err: AWSError, data: NetworkFirewall.Types.AssociateSubnetsResponse) => void): Request<NetworkFirewall.Types.AssociateSubnetsResponse, AWSError>;
  /**
   * Creates an AWS Network Firewall Firewall and accompanying FirewallStatus for a VPC.  The firewall defines the configuration settings for an AWS Network Firewall firewall. The settings that you can define at creation include the firewall policy, the subnets in your VPC to use for the firewall endpoints, and any tags that are attached to the firewall AWS resource.  After you create a firewall, you can provide additional settings, like the logging configuration.  To update the settings for a firewall, you use the operations that apply to the settings themselves, for example UpdateLoggingConfiguration, AssociateSubnets, and UpdateFirewallDeleteProtection.  To manage a firewall's tags, use the standard AWS resource tagging operations, ListTagsForResource, TagResource, and UntagResource. To retrieve information about firewalls, use ListFirewalls and DescribeFirewall.
   */
  createFirewall(params: NetworkFirewall.Types.CreateFirewallRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.CreateFirewallResponse) => void): Request<NetworkFirewall.Types.CreateFirewallResponse, AWSError>;
  /**
   * Creates an AWS Network Firewall Firewall and accompanying FirewallStatus for a VPC.  The firewall defines the configuration settings for an AWS Network Firewall firewall. The settings that you can define at creation include the firewall policy, the subnets in your VPC to use for the firewall endpoints, and any tags that are attached to the firewall AWS resource.  After you create a firewall, you can provide additional settings, like the logging configuration.  To update the settings for a firewall, you use the operations that apply to the settings themselves, for example UpdateLoggingConfiguration, AssociateSubnets, and UpdateFirewallDeleteProtection.  To manage a firewall's tags, use the standard AWS resource tagging operations, ListTagsForResource, TagResource, and UntagResource. To retrieve information about firewalls, use ListFirewalls and DescribeFirewall.
   */
  createFirewall(callback?: (err: AWSError, data: NetworkFirewall.Types.CreateFirewallResponse) => void): Request<NetworkFirewall.Types.CreateFirewallResponse, AWSError>;
  /**
   * Creates the firewall policy for the firewall according to the specifications.  An AWS Network Firewall firewall policy defines the behavior of a firewall, in a collection of stateless and stateful rule groups and other settings. You can use one firewall policy for multiple firewalls. 
   */
  createFirewallPolicy(params: NetworkFirewall.Types.CreateFirewallPolicyRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.CreateFirewallPolicyResponse) => void): Request<NetworkFirewall.Types.CreateFirewallPolicyResponse, AWSError>;
  /**
   * Creates the firewall policy for the firewall according to the specifications.  An AWS Network Firewall firewall policy defines the behavior of a firewall, in a collection of stateless and stateful rule groups and other settings. You can use one firewall policy for multiple firewalls. 
   */
  createFirewallPolicy(callback?: (err: AWSError, data: NetworkFirewall.Types.CreateFirewallPolicyResponse) => void): Request<NetworkFirewall.Types.CreateFirewallPolicyResponse, AWSError>;
  /**
   * Creates the specified stateless or stateful rule group, which includes the rules for network traffic inspection, a capacity setting, and tags.  You provide your rule group specification in your request using either RuleGroup or Rules.
   */
  createRuleGroup(params: NetworkFirewall.Types.CreateRuleGroupRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.CreateRuleGroupResponse) => void): Request<NetworkFirewall.Types.CreateRuleGroupResponse, AWSError>;
  /**
   * Creates the specified stateless or stateful rule group, which includes the rules for network traffic inspection, a capacity setting, and tags.  You provide your rule group specification in your request using either RuleGroup or Rules.
   */
  createRuleGroup(callback?: (err: AWSError, data: NetworkFirewall.Types.CreateRuleGroupResponse) => void): Request<NetworkFirewall.Types.CreateRuleGroupResponse, AWSError>;
  /**
   * Deletes the specified Firewall and its FirewallStatus. This operation requires the firewall's DeleteProtection flag to be FALSE. You can't revert this operation.  You can check whether a firewall is in use by reviewing the route tables for the Availability Zones where you have firewall subnet mappings. Retrieve the subnet mappings by calling DescribeFirewall. You define and update the route tables through Amazon VPC. As needed, update the route tables for the zones to remove the firewall endpoints. When the route tables no longer use the firewall endpoints, you can remove the firewall safely. To delete a firewall, remove the delete protection if you need to using UpdateFirewallDeleteProtection, then delete the firewall by calling DeleteFirewall. 
   */
  deleteFirewall(params: NetworkFirewall.Types.DeleteFirewallRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.DeleteFirewallResponse) => void): Request<NetworkFirewall.Types.DeleteFirewallResponse, AWSError>;
  /**
   * Deletes the specified Firewall and its FirewallStatus. This operation requires the firewall's DeleteProtection flag to be FALSE. You can't revert this operation.  You can check whether a firewall is in use by reviewing the route tables for the Availability Zones where you have firewall subnet mappings. Retrieve the subnet mappings by calling DescribeFirewall. You define and update the route tables through Amazon VPC. As needed, update the route tables for the zones to remove the firewall endpoints. When the route tables no longer use the firewall endpoints, you can remove the firewall safely. To delete a firewall, remove the delete protection if you need to using UpdateFirewallDeleteProtection, then delete the firewall by calling DeleteFirewall. 
   */
  deleteFirewall(callback?: (err: AWSError, data: NetworkFirewall.Types.DeleteFirewallResponse) => void): Request<NetworkFirewall.Types.DeleteFirewallResponse, AWSError>;
  /**
   * Deletes the specified FirewallPolicy. 
   */
  deleteFirewallPolicy(params: NetworkFirewall.Types.DeleteFirewallPolicyRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.DeleteFirewallPolicyResponse) => void): Request<NetworkFirewall.Types.DeleteFirewallPolicyResponse, AWSError>;
  /**
   * Deletes the specified FirewallPolicy. 
   */
  deleteFirewallPolicy(callback?: (err: AWSError, data: NetworkFirewall.Types.DeleteFirewallPolicyResponse) => void): Request<NetworkFirewall.Types.DeleteFirewallPolicyResponse, AWSError>;
  /**
   * Deletes a resource policy that you created in a PutResourcePolicy request. 
   */
  deleteResourcePolicy(params: NetworkFirewall.Types.DeleteResourcePolicyRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.DeleteResourcePolicyResponse) => void): Request<NetworkFirewall.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes a resource policy that you created in a PutResourcePolicy request. 
   */
  deleteResourcePolicy(callback?: (err: AWSError, data: NetworkFirewall.Types.DeleteResourcePolicyResponse) => void): Request<NetworkFirewall.Types.DeleteResourcePolicyResponse, AWSError>;
  /**
   * Deletes the specified RuleGroup. 
   */
  deleteRuleGroup(params: NetworkFirewall.Types.DeleteRuleGroupRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.DeleteRuleGroupResponse) => void): Request<NetworkFirewall.Types.DeleteRuleGroupResponse, AWSError>;
  /**
   * Deletes the specified RuleGroup. 
   */
  deleteRuleGroup(callback?: (err: AWSError, data: NetworkFirewall.Types.DeleteRuleGroupResponse) => void): Request<NetworkFirewall.Types.DeleteRuleGroupResponse, AWSError>;
  /**
   * Returns the data objects for the specified firewall. 
   */
  describeFirewall(params: NetworkFirewall.Types.DescribeFirewallRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.DescribeFirewallResponse) => void): Request<NetworkFirewall.Types.DescribeFirewallResponse, AWSError>;
  /**
   * Returns the data objects for the specified firewall. 
   */
  describeFirewall(callback?: (err: AWSError, data: NetworkFirewall.Types.DescribeFirewallResponse) => void): Request<NetworkFirewall.Types.DescribeFirewallResponse, AWSError>;
  /**
   * Returns the data objects for the specified firewall policy. 
   */
  describeFirewallPolicy(params: NetworkFirewall.Types.DescribeFirewallPolicyRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.DescribeFirewallPolicyResponse) => void): Request<NetworkFirewall.Types.DescribeFirewallPolicyResponse, AWSError>;
  /**
   * Returns the data objects for the specified firewall policy. 
   */
  describeFirewallPolicy(callback?: (err: AWSError, data: NetworkFirewall.Types.DescribeFirewallPolicyResponse) => void): Request<NetworkFirewall.Types.DescribeFirewallPolicyResponse, AWSError>;
  /**
   * Returns the logging configuration for the specified firewall. 
   */
  describeLoggingConfiguration(params: NetworkFirewall.Types.DescribeLoggingConfigurationRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.DescribeLoggingConfigurationResponse) => void): Request<NetworkFirewall.Types.DescribeLoggingConfigurationResponse, AWSError>;
  /**
   * Returns the logging configuration for the specified firewall. 
   */
  describeLoggingConfiguration(callback?: (err: AWSError, data: NetworkFirewall.Types.DescribeLoggingConfigurationResponse) => void): Request<NetworkFirewall.Types.DescribeLoggingConfigurationResponse, AWSError>;
  /**
   * Retrieves a resource policy that you created in a PutResourcePolicy request. 
   */
  describeResourcePolicy(params: NetworkFirewall.Types.DescribeResourcePolicyRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.DescribeResourcePolicyResponse) => void): Request<NetworkFirewall.Types.DescribeResourcePolicyResponse, AWSError>;
  /**
   * Retrieves a resource policy that you created in a PutResourcePolicy request. 
   */
  describeResourcePolicy(callback?: (err: AWSError, data: NetworkFirewall.Types.DescribeResourcePolicyResponse) => void): Request<NetworkFirewall.Types.DescribeResourcePolicyResponse, AWSError>;
  /**
   * Returns the data objects for the specified rule group. 
   */
  describeRuleGroup(params: NetworkFirewall.Types.DescribeRuleGroupRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.DescribeRuleGroupResponse) => void): Request<NetworkFirewall.Types.DescribeRuleGroupResponse, AWSError>;
  /**
   * Returns the data objects for the specified rule group. 
   */
  describeRuleGroup(callback?: (err: AWSError, data: NetworkFirewall.Types.DescribeRuleGroupResponse) => void): Request<NetworkFirewall.Types.DescribeRuleGroupResponse, AWSError>;
  /**
   * Removes the specified subnet associations from the firewall. This removes the firewall endpoints from the subnets and removes any network filtering protections that the endpoints were providing. 
   */
  disassociateSubnets(params: NetworkFirewall.Types.DisassociateSubnetsRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.DisassociateSubnetsResponse) => void): Request<NetworkFirewall.Types.DisassociateSubnetsResponse, AWSError>;
  /**
   * Removes the specified subnet associations from the firewall. This removes the firewall endpoints from the subnets and removes any network filtering protections that the endpoints were providing. 
   */
  disassociateSubnets(callback?: (err: AWSError, data: NetworkFirewall.Types.DisassociateSubnetsResponse) => void): Request<NetworkFirewall.Types.DisassociateSubnetsResponse, AWSError>;
  /**
   * Retrieves the metadata for the firewall policies that you have defined. Depending on your setting for max results and the number of firewall policies, a single call might not return the full list. 
   */
  listFirewallPolicies(params: NetworkFirewall.Types.ListFirewallPoliciesRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.ListFirewallPoliciesResponse) => void): Request<NetworkFirewall.Types.ListFirewallPoliciesResponse, AWSError>;
  /**
   * Retrieves the metadata for the firewall policies that you have defined. Depending on your setting for max results and the number of firewall policies, a single call might not return the full list. 
   */
  listFirewallPolicies(callback?: (err: AWSError, data: NetworkFirewall.Types.ListFirewallPoliciesResponse) => void): Request<NetworkFirewall.Types.ListFirewallPoliciesResponse, AWSError>;
  /**
   * Retrieves the metadata for the firewalls that you have defined. If you provide VPC identifiers in your request, this returns only the firewalls for those VPCs. Depending on your setting for max results and the number of firewalls, a single call might not return the full list. 
   */
  listFirewalls(params: NetworkFirewall.Types.ListFirewallsRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.ListFirewallsResponse) => void): Request<NetworkFirewall.Types.ListFirewallsResponse, AWSError>;
  /**
   * Retrieves the metadata for the firewalls that you have defined. If you provide VPC identifiers in your request, this returns only the firewalls for those VPCs. Depending on your setting for max results and the number of firewalls, a single call might not return the full list. 
   */
  listFirewalls(callback?: (err: AWSError, data: NetworkFirewall.Types.ListFirewallsResponse) => void): Request<NetworkFirewall.Types.ListFirewallsResponse, AWSError>;
  /**
   * Retrieves the metadata for the rule groups that you have defined. Depending on your setting for max results and the number of rule groups, a single call might not return the full list. 
   */
  listRuleGroups(params: NetworkFirewall.Types.ListRuleGroupsRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.ListRuleGroupsResponse) => void): Request<NetworkFirewall.Types.ListRuleGroupsResponse, AWSError>;
  /**
   * Retrieves the metadata for the rule groups that you have defined. Depending on your setting for max results and the number of rule groups, a single call might not return the full list. 
   */
  listRuleGroups(callback?: (err: AWSError, data: NetworkFirewall.Types.ListRuleGroupsResponse) => void): Request<NetworkFirewall.Types.ListRuleGroupsResponse, AWSError>;
  /**
   * Retrieves the tags associated with the specified resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each AWS resource, up to 50 tags for a resource. You can tag the AWS resources that you manage through AWS Network Firewall: firewalls, firewall policies, and rule groups. 
   */
  listTagsForResource(params: NetworkFirewall.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.ListTagsForResourceResponse) => void): Request<NetworkFirewall.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves the tags associated with the specified resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each AWS resource, up to 50 tags for a resource. You can tag the AWS resources that you manage through AWS Network Firewall: firewalls, firewall policies, and rule groups. 
   */
  listTagsForResource(callback?: (err: AWSError, data: NetworkFirewall.Types.ListTagsForResourceResponse) => void): Request<NetworkFirewall.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates or updates an AWS Identity and Access Management policy for your rule group or firewall policy. Use this to share rule groups and firewall policies between accounts. This operation works in conjunction with the AWS Resource Access Manager (RAM) service to manage resource sharing for Network Firewall.  Use this operation to create or update a resource policy for your rule group or firewall policy. In the policy, you specify the accounts that you want to share the resource with and the operations that you want the accounts to be able to perform.  When you add an account in the resource policy, you then run the following Resource Access Manager (RAM) operations to access and accept the shared rule group or firewall policy.     GetResourceShareInvitations - Returns the Amazon Resource Names (ARNs) of the resource share invitations.     AcceptResourceShareInvitation - Accepts the share invitation for a specified resource share.    For additional information about resource sharing using RAM, see AWS Resource Access Manager User Guide.
   */
  putResourcePolicy(params: NetworkFirewall.Types.PutResourcePolicyRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.PutResourcePolicyResponse) => void): Request<NetworkFirewall.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Creates or updates an AWS Identity and Access Management policy for your rule group or firewall policy. Use this to share rule groups and firewall policies between accounts. This operation works in conjunction with the AWS Resource Access Manager (RAM) service to manage resource sharing for Network Firewall.  Use this operation to create or update a resource policy for your rule group or firewall policy. In the policy, you specify the accounts that you want to share the resource with and the operations that you want the accounts to be able to perform.  When you add an account in the resource policy, you then run the following Resource Access Manager (RAM) operations to access and accept the shared rule group or firewall policy.     GetResourceShareInvitations - Returns the Amazon Resource Names (ARNs) of the resource share invitations.     AcceptResourceShareInvitation - Accepts the share invitation for a specified resource share.    For additional information about resource sharing using RAM, see AWS Resource Access Manager User Guide.
   */
  putResourcePolicy(callback?: (err: AWSError, data: NetworkFirewall.Types.PutResourcePolicyResponse) => void): Request<NetworkFirewall.Types.PutResourcePolicyResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each AWS resource, up to 50 tags for a resource. You can tag the AWS resources that you manage through AWS Network Firewall: firewalls, firewall policies, and rule groups. 
   */
  tagResource(params: NetworkFirewall.Types.TagResourceRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.TagResourceResponse) => void): Request<NetworkFirewall.Types.TagResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each AWS resource, up to 50 tags for a resource. You can tag the AWS resources that you manage through AWS Network Firewall: firewalls, firewall policies, and rule groups. 
   */
  tagResource(callback?: (err: AWSError, data: NetworkFirewall.Types.TagResourceResponse) => void): Request<NetworkFirewall.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the tags with the specified keys from the specified resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each AWS resource, up to 50 tags for a resource. You can manage tags for the AWS resources that you manage through AWS Network Firewall: firewalls, firewall policies, and rule groups. 
   */
  untagResource(params: NetworkFirewall.Types.UntagResourceRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.UntagResourceResponse) => void): Request<NetworkFirewall.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the tags with the specified keys from the specified resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each AWS resource, up to 50 tags for a resource. You can manage tags for the AWS resources that you manage through AWS Network Firewall: firewalls, firewall policies, and rule groups. 
   */
  untagResource(callback?: (err: AWSError, data: NetworkFirewall.Types.UntagResourceResponse) => void): Request<NetworkFirewall.Types.UntagResourceResponse, AWSError>;
  /**
   * Modifies the flag, DeleteProtection, which indicates whether it is possible to delete the firewall. If the flag is set to TRUE, the firewall is protected against deletion. This setting helps protect against accidentally deleting a firewall that's in use. 
   */
  updateFirewallDeleteProtection(params: NetworkFirewall.Types.UpdateFirewallDeleteProtectionRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateFirewallDeleteProtectionResponse) => void): Request<NetworkFirewall.Types.UpdateFirewallDeleteProtectionResponse, AWSError>;
  /**
   * Modifies the flag, DeleteProtection, which indicates whether it is possible to delete the firewall. If the flag is set to TRUE, the firewall is protected against deletion. This setting helps protect against accidentally deleting a firewall that's in use. 
   */
  updateFirewallDeleteProtection(callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateFirewallDeleteProtectionResponse) => void): Request<NetworkFirewall.Types.UpdateFirewallDeleteProtectionResponse, AWSError>;
  /**
   * Modifies the description for the specified firewall. Use the description to help you identify the firewall when you're working with it. 
   */
  updateFirewallDescription(params: NetworkFirewall.Types.UpdateFirewallDescriptionRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateFirewallDescriptionResponse) => void): Request<NetworkFirewall.Types.UpdateFirewallDescriptionResponse, AWSError>;
  /**
   * Modifies the description for the specified firewall. Use the description to help you identify the firewall when you're working with it. 
   */
  updateFirewallDescription(callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateFirewallDescriptionResponse) => void): Request<NetworkFirewall.Types.UpdateFirewallDescriptionResponse, AWSError>;
  /**
   * Updates the properties of the specified firewall policy.
   */
  updateFirewallPolicy(params: NetworkFirewall.Types.UpdateFirewallPolicyRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateFirewallPolicyResponse) => void): Request<NetworkFirewall.Types.UpdateFirewallPolicyResponse, AWSError>;
  /**
   * Updates the properties of the specified firewall policy.
   */
  updateFirewallPolicy(callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateFirewallPolicyResponse) => void): Request<NetworkFirewall.Types.UpdateFirewallPolicyResponse, AWSError>;
  /**
   * 
   */
  updateFirewallPolicyChangeProtection(params: NetworkFirewall.Types.UpdateFirewallPolicyChangeProtectionRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateFirewallPolicyChangeProtectionResponse) => void): Request<NetworkFirewall.Types.UpdateFirewallPolicyChangeProtectionResponse, AWSError>;
  /**
   * 
   */
  updateFirewallPolicyChangeProtection(callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateFirewallPolicyChangeProtectionResponse) => void): Request<NetworkFirewall.Types.UpdateFirewallPolicyChangeProtectionResponse, AWSError>;
  /**
   * Sets the logging configuration for the specified firewall.  To change the logging configuration, retrieve the LoggingConfiguration by calling DescribeLoggingConfiguration, then change it and provide the modified object to this update call. You must change the logging configuration one LogDestinationConfig at a time inside the retrieved LoggingConfiguration object.  You can perform only one of the following actions in any call to UpdateLoggingConfiguration:    Create a new log destination object by adding a single LogDestinationConfig array element to LogDestinationConfigs.   Delete a log destination object by removing a single LogDestinationConfig array element from LogDestinationConfigs.   Change the LogDestination setting in a single LogDestinationConfig array element.   You can't change the LogDestinationType or LogType in a LogDestinationConfig. To change these settings, delete the existing LogDestinationConfig object and create a new one, using two separate calls to this update operation.
   */
  updateLoggingConfiguration(params: NetworkFirewall.Types.UpdateLoggingConfigurationRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateLoggingConfigurationResponse) => void): Request<NetworkFirewall.Types.UpdateLoggingConfigurationResponse, AWSError>;
  /**
   * Sets the logging configuration for the specified firewall.  To change the logging configuration, retrieve the LoggingConfiguration by calling DescribeLoggingConfiguration, then change it and provide the modified object to this update call. You must change the logging configuration one LogDestinationConfig at a time inside the retrieved LoggingConfiguration object.  You can perform only one of the following actions in any call to UpdateLoggingConfiguration:    Create a new log destination object by adding a single LogDestinationConfig array element to LogDestinationConfigs.   Delete a log destination object by removing a single LogDestinationConfig array element from LogDestinationConfigs.   Change the LogDestination setting in a single LogDestinationConfig array element.   You can't change the LogDestinationType or LogType in a LogDestinationConfig. To change these settings, delete the existing LogDestinationConfig object and create a new one, using two separate calls to this update operation.
   */
  updateLoggingConfiguration(callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateLoggingConfigurationResponse) => void): Request<NetworkFirewall.Types.UpdateLoggingConfigurationResponse, AWSError>;
  /**
   * Updates the rule settings for the specified rule group. You use a rule group by reference in one or more firewall policies. When you modify a rule group, you modify all firewall policies that use the rule group.  To update a rule group, first call DescribeRuleGroup to retrieve the current RuleGroup object, update the object as needed, and then provide the updated object to this call. 
   */
  updateRuleGroup(params: NetworkFirewall.Types.UpdateRuleGroupRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateRuleGroupResponse) => void): Request<NetworkFirewall.Types.UpdateRuleGroupResponse, AWSError>;
  /**
   * Updates the rule settings for the specified rule group. You use a rule group by reference in one or more firewall policies. When you modify a rule group, you modify all firewall policies that use the rule group.  To update a rule group, first call DescribeRuleGroup to retrieve the current RuleGroup object, update the object as needed, and then provide the updated object to this call. 
   */
  updateRuleGroup(callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateRuleGroupResponse) => void): Request<NetworkFirewall.Types.UpdateRuleGroupResponse, AWSError>;
  /**
   * 
   */
  updateSubnetChangeProtection(params: NetworkFirewall.Types.UpdateSubnetChangeProtectionRequest, callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateSubnetChangeProtectionResponse) => void): Request<NetworkFirewall.Types.UpdateSubnetChangeProtectionResponse, AWSError>;
  /**
   * 
   */
  updateSubnetChangeProtection(callback?: (err: AWSError, data: NetworkFirewall.Types.UpdateSubnetChangeProtectionResponse) => void): Request<NetworkFirewall.Types.UpdateSubnetChangeProtectionResponse, AWSError>;
}
declare namespace NetworkFirewall {
  export interface ActionDefinition {
    /**
     * Stateless inspection criteria that publishes the specified metrics to Amazon CloudWatch for the matching packet. This setting defines a CloudWatch dimension value to be published. You can pair this custom action with any of the standard stateless rule actions. For example, you could pair this in a rule action with the standard action that forwards the packet for stateful inspection. Then, when a packet matches the rule, Network Firewall publishes metrics for the packet and forwards it. 
     */
    PublishMetricAction?: PublishMetricAction;
  }
  export type ActionName = string;
  export interface Address {
    /**
     * Specify an IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation. Network Firewall supports all address ranges for IPv4.  Examples:    To configure Network Firewall to inspect for the IP address 192.0.2.44, specify 192.0.2.44/32.   To configure Network Firewall to inspect for IP addresses from 192.0.2.0 to 192.0.2.255, specify 192.0.2.0/24.   For more information about CIDR notation, see the Wikipedia entry Classless Inter-Domain Routing.
     */
    AddressDefinition: AddressDefinition;
  }
  export type AddressDefinition = string;
  export type Addresses = Address[];
  export interface AssociateFirewallPolicyRequest {
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the firewall policy.
     */
    FirewallPolicyArn: ResourceArn;
  }
  export interface AssociateFirewallPolicyResponse {
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the firewall policy.
     */
    FirewallPolicyArn?: ResourceArn;
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
  }
  export interface AssociateSubnetsRequest {
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
    /**
     * The IDs of the subnets that you want to associate with the firewall. 
     */
    SubnetMappings: SubnetMappings;
  }
  export interface AssociateSubnetsResponse {
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName?: ResourceName;
    /**
     * The IDs of the subnets that are associated with the firewall. 
     */
    SubnetMappings?: SubnetMappings;
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
  }
  export interface Attachment {
    /**
     * The unique identifier of the subnet that you've specified to be used for a firewall endpoint. 
     */
    SubnetId?: AzSubnet;
    /**
     * The identifier of the firewall endpoint that Network Firewall has instantiated in the subnet. You use this to identify the firewall endpoint in the VPC route tables, when you redirect the VPC traffic through the endpoint. 
     */
    EndpointId?: EndpointId;
    /**
     * The current status of the firewall endpoint in the subnet. This value reflects both the instantiation of the endpoint in the VPC subnet and the sync states that are reported in the Config settings. When this value is READY, the endpoint is available and configured properly to handle network traffic. When the endpoint isn't available for traffic, this value will reflect its state, for example CREATING, DELETING, or FAILED.
     */
    Status?: AttachmentStatus;
  }
  export type AttachmentStatus = "CREATING"|"DELETING"|"SCALING"|"READY"|string;
  export type AvailabilityZone = string;
  export type AzSubnet = string;
  export type AzSubnets = AzSubnet[];
  export type Boolean = boolean;
  export type CollectionMember_String = string;
  export type ConfigurationSyncState = "PENDING"|"IN_SYNC"|string;
  export interface CreateFirewallPolicyRequest {
    /**
     * The descriptive name of the firewall policy. You can't change the name of a firewall policy after you create it.
     */
    FirewallPolicyName: ResourceName;
    /**
     * The rule groups and policy actions to use in the firewall policy.
     */
    FirewallPolicy: FirewallPolicy;
    /**
     * A description of the firewall policy.
     */
    Description?: Description;
    /**
     * The key:value pairs to associate with the resource.
     */
    Tags?: TagList;
    /**
     * Indicates whether you want Network Firewall to just check the validity of the request, rather than run the request.  If set to TRUE, Network Firewall checks whether the request can run successfully, but doesn't actually make the requested changes. The call returns the value that the request would return if you ran it with dry run set to FALSE, but doesn't make additions or changes to your resources. This option allows you to make sure that you have the required permissions to run the request and that your request parameters are valid.  If set to FALSE, Network Firewall makes the requested changes to your resources. 
     */
    DryRun?: Boolean;
  }
  export interface CreateFirewallPolicyResponse {
    /**
     * A token used for optimistic locking. Network Firewall returns a token to your requests that access the firewall policy. The token marks the state of the policy resource at the time of the request.  To make changes to the policy, you provide the token in your request. Network Firewall uses the token to ensure that the policy hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall policy again to get a current copy of it with current token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken: UpdateToken;
    /**
     * The high-level properties of a firewall policy. This, along with the FirewallPolicy, define the policy. You can retrieve all objects for a firewall policy by calling DescribeFirewallPolicy. 
     */
    FirewallPolicyResponse: FirewallPolicyResponse;
  }
  export interface CreateFirewallRequest {
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the FirewallPolicy that you want to use for the firewall.
     */
    FirewallPolicyArn: ResourceArn;
    /**
     * The unique identifier of the VPC where Network Firewall should create the firewall.  You can't change this setting after you create the firewall. 
     */
    VpcId: VpcId;
    /**
     * The public subnets to use for your Network Firewall firewalls. Each subnet must belong to a different Availability Zone in the VPC. Network Firewall creates a firewall endpoint in each subnet. 
     */
    SubnetMappings: SubnetMappings;
    /**
     * A flag indicating whether it is possible to delete the firewall. A setting of TRUE indicates that the firewall is protected against deletion. Use this setting to protect against accidentally deleting a firewall that is in use. When you create a firewall, the operation initializes this flag to TRUE.
     */
    DeleteProtection?: Boolean;
    /**
     * A setting indicating whether the firewall is protected against changes to the subnet associations. Use this setting to protect against accidentally modifying the subnet associations for a firewall that is in use. When you create a firewall, the operation initializes this setting to TRUE.
     */
    SubnetChangeProtection?: Boolean;
    /**
     * A setting indicating whether the firewall is protected against a change to the firewall policy association. Use this setting to protect against accidentally modifying the firewall policy for a firewall that is in use. When you create a firewall, the operation initializes this setting to TRUE.
     */
    FirewallPolicyChangeProtection?: Boolean;
    /**
     * A description of the firewall.
     */
    Description?: Description;
    /**
     * The key:value pairs to associate with the resource.
     */
    Tags?: TagList;
  }
  export interface CreateFirewallResponse {
    /**
     * The configuration settings for the firewall. These settings include the firewall policy and the subnets in your VPC to use for the firewall endpoints. 
     */
    Firewall?: Firewall;
    /**
     * Detailed information about the current status of a Firewall. You can retrieve this for a firewall by calling DescribeFirewall and providing the firewall name and ARN.
     */
    FirewallStatus?: FirewallStatus;
  }
  export interface CreateRuleGroupRequest {
    /**
     * The descriptive name of the rule group. You can't change the name of a rule group after you create it.
     */
    RuleGroupName: ResourceName;
    /**
     * An object that defines the rule group rules.   You must provide either this rule group setting or a Rules setting, but not both.  
     */
    RuleGroup?: RuleGroup;
    /**
     * A string containing stateful rule group rules specifications in Suricata flat format, with one rule per line. Use this to import your existing Suricata compatible rule groups.   You must provide either this rules setting or a populated RuleGroup setting, but not both.   You can provide your rule group specification in Suricata flat format through this setting when you create or update your rule group. The call response returns a RuleGroup object that Network Firewall has populated from your string. 
     */
    Rules?: RulesString;
    /**
     * Indicates whether the rule group is stateless or stateful. If the rule group is stateless, it contains stateless rules. If it is stateful, it contains stateful rules. 
     */
    Type: RuleGroupType;
    /**
     * A description of the rule group. 
     */
    Description?: Description;
    /**
     * The maximum operating resources that this rule group can use. Rule group capacity is fixed at creation. When you update a rule group, you are limited to this capacity. When you reference a rule group from a firewall policy, Network Firewall reserves this capacity for the rule group.  You can retrieve the capacity that would be required for a rule group before you create the rule group by calling CreateRuleGroup with DryRun set to TRUE.   You can't change or exceed this capacity when you update the rule group, so leave room for your rule group to grow.    Capacity for a stateless rule group  For a stateless rule group, the capacity required is the sum of the capacity requirements of the individual rules that you expect to have in the rule group.  To calculate the capacity requirement of a single rule, multiply the capacity requirement values of each of the rule's match settings:   A match setting with no criteria specified has a value of 1.    A match setting with Any specified has a value of 1.    All other match settings have a value equal to the number of elements provided in the setting. For example, a protocol setting ["UDP"] and a source setting ["10.0.0.0/24"] each have a value of 1. A protocol setting ["UDP","TCP"] has a value of 2. A source setting ["10.0.0.0/24","10.0.0.1/24","10.0.0.2/24"] has a value of 3.    A rule with no criteria specified in any of its match settings has a capacity requirement of 1. A rule with protocol setting ["UDP","TCP"], source setting ["10.0.0.0/24","10.0.0.1/24","10.0.0.2/24"], and a single specification or no specification for each of the other match settings has a capacity requirement of 6.   Capacity for a stateful rule group  For a stateful rule group, the minimum capacity required is the number of individual rules that you expect to have in the rule group. 
     */
    Capacity: RuleCapacity;
    /**
     * The key:value pairs to associate with the resource.
     */
    Tags?: TagList;
    /**
     * Indicates whether you want Network Firewall to just check the validity of the request, rather than run the request.  If set to TRUE, Network Firewall checks whether the request can run successfully, but doesn't actually make the requested changes. The call returns the value that the request would return if you ran it with dry run set to FALSE, but doesn't make additions or changes to your resources. This option allows you to make sure that you have the required permissions to run the request and that your request parameters are valid.  If set to FALSE, Network Firewall makes the requested changes to your resources. 
     */
    DryRun?: Boolean;
  }
  export interface CreateRuleGroupResponse {
    /**
     * A token used for optimistic locking. Network Firewall returns a token to your requests that access the rule group. The token marks the state of the rule group resource at the time of the request.  To make changes to the rule group, you provide the token in your request. Network Firewall uses the token to ensure that the rule group hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the rule group again to get a current copy of it with a current token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken: UpdateToken;
    /**
     * The high-level properties of a rule group. This, along with the RuleGroup, define the rule group. You can retrieve all objects for a rule group by calling DescribeRuleGroup. 
     */
    RuleGroupResponse: RuleGroupResponse;
  }
  export interface CustomAction {
    /**
     * The descriptive name of the custom action. You can't change the name of a custom action after you create it.
     */
    ActionName: ActionName;
    /**
     * The custom action associated with the action name.
     */
    ActionDefinition: ActionDefinition;
  }
  export type CustomActions = CustomAction[];
  export interface DeleteFirewallPolicyRequest {
    /**
     * The descriptive name of the firewall policy. You can't change the name of a firewall policy after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallPolicyName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the firewall policy. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallPolicyArn?: ResourceArn;
  }
  export interface DeleteFirewallPolicyResponse {
    /**
     * The object containing the definition of the FirewallPolicyResponse that you asked to delete. 
     */
    FirewallPolicyResponse: FirewallPolicyResponse;
  }
  export interface DeleteFirewallRequest {
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
  }
  export interface DeleteFirewallResponse {
    Firewall?: Firewall;
    FirewallStatus?: FirewallStatus;
  }
  export interface DeleteResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the rule group or firewall policy whose resource policy you want to delete. 
     */
    ResourceArn: ResourceArn;
  }
  export interface DeleteResourcePolicyResponse {
  }
  export interface DeleteRuleGroupRequest {
    /**
     * The descriptive name of the rule group. You can't change the name of a rule group after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    RuleGroupName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the rule group. You must specify the ARN or the name, and you can specify both. 
     */
    RuleGroupArn?: ResourceArn;
    /**
     * Indicates whether the rule group is stateless or stateful. If the rule group is stateless, it contains stateless rules. If it is stateful, it contains stateful rules.   This setting is required for requests that do not include the RuleGroupARN. 
     */
    Type?: RuleGroupType;
  }
  export interface DeleteRuleGroupResponse {
    /**
     * The high-level properties of a rule group. This, along with the RuleGroup, define the rule group. You can retrieve all objects for a rule group by calling DescribeRuleGroup. 
     */
    RuleGroupResponse: RuleGroupResponse;
  }
  export interface DescribeFirewallPolicyRequest {
    /**
     * The descriptive name of the firewall policy. You can't change the name of a firewall policy after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallPolicyName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the firewall policy. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallPolicyArn?: ResourceArn;
  }
  export interface DescribeFirewallPolicyResponse {
    /**
     * A token used for optimistic locking. Network Firewall returns a token to your requests that access the firewall policy. The token marks the state of the policy resource at the time of the request.  To make changes to the policy, you provide the token in your request. Network Firewall uses the token to ensure that the policy hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall policy again to get a current copy of it with current token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken: UpdateToken;
    /**
     * The high-level properties of a firewall policy. This, along with the FirewallPolicy, define the policy. You can retrieve all objects for a firewall policy by calling DescribeFirewallPolicy. 
     */
    FirewallPolicyResponse: FirewallPolicyResponse;
    /**
     * The policy for the specified firewall policy. 
     */
    FirewallPolicy?: FirewallPolicy;
  }
  export interface DescribeFirewallRequest {
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
  }
  export interface DescribeFirewallResponse {
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * The configuration settings for the firewall. These settings include the firewall policy and the subnets in your VPC to use for the firewall endpoints. 
     */
    Firewall?: Firewall;
    /**
     * Detailed information about the current status of a Firewall. You can retrieve this for a firewall by calling DescribeFirewall and providing the firewall name and ARN.
     */
    FirewallStatus?: FirewallStatus;
  }
  export interface DescribeLoggingConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
  }
  export interface DescribeLoggingConfigurationResponse {
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
    LoggingConfiguration?: LoggingConfiguration;
  }
  export interface DescribeResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the rule group or firewall policy whose resource policy you want to retrieve. 
     */
    ResourceArn: ResourceArn;
  }
  export interface DescribeResourcePolicyResponse {
    /**
     * The AWS Identity and Access Management policy for the resource. 
     */
    Policy?: PolicyString;
  }
  export interface DescribeRuleGroupRequest {
    /**
     * The descriptive name of the rule group. You can't change the name of a rule group after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    RuleGroupName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the rule group. You must specify the ARN or the name, and you can specify both. 
     */
    RuleGroupArn?: ResourceArn;
    /**
     * Indicates whether the rule group is stateless or stateful. If the rule group is stateless, it contains stateless rules. If it is stateful, it contains stateful rules.   This setting is required for requests that do not include the RuleGroupARN. 
     */
    Type?: RuleGroupType;
  }
  export interface DescribeRuleGroupResponse {
    /**
     * A token used for optimistic locking. Network Firewall returns a token to your requests that access the rule group. The token marks the state of the rule group resource at the time of the request.  To make changes to the rule group, you provide the token in your request. Network Firewall uses the token to ensure that the rule group hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the rule group again to get a current copy of it with a current token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken: UpdateToken;
    /**
     * The object that defines the rules in a rule group. This, along with RuleGroupResponse, define the rule group. You can retrieve all objects for a rule group by calling DescribeRuleGroup.  AWS Network Firewall uses a rule group to inspect and control network traffic. You define stateless rule groups to inspect individual packets and you define stateful rule groups to inspect packets in the context of their traffic flow.  To use a rule group, you include it by reference in an Network Firewall firewall policy, then you use the policy in a firewall. You can reference a rule group from more than one firewall policy, and you can use a firewall policy in more than one firewall. 
     */
    RuleGroup?: RuleGroup;
    /**
     * The high-level properties of a rule group. This, along with the RuleGroup, define the rule group. You can retrieve all objects for a rule group by calling DescribeRuleGroup. 
     */
    RuleGroupResponse: RuleGroupResponse;
  }
  export type Description = string;
  export type Destination = string;
  export interface Dimension {
    /**
     * The value to use in the custom metric dimension.
     */
    Value: DimensionValue;
  }
  export type DimensionValue = string;
  export type Dimensions = Dimension[];
  export interface DisassociateSubnetsRequest {
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
    /**
     * The unique identifiers for the subnets that you want to disassociate. 
     */
    SubnetIds: AzSubnets;
  }
  export interface DisassociateSubnetsResponse {
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName?: ResourceName;
    /**
     * The IDs of the subnets that are associated with the firewall. 
     */
    SubnetMappings?: SubnetMappings;
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
  }
  export type EndpointId = string;
  export interface Firewall {
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
    /**
     * The Amazon Resource Name (ARN) of the firewall policy. The relationship of firewall to firewall policy is many to one. Each firewall requires one firewall policy association, and you can use the same firewall policy for multiple firewalls. 
     */
    FirewallPolicyArn: ResourceArn;
    /**
     * The unique identifier of the VPC where the firewall is in use. 
     */
    VpcId: VpcId;
    /**
     * The public subnets that Network Firewall is using for the firewall. Each subnet must belong to a different Availability Zone. 
     */
    SubnetMappings: SubnetMappings;
    /**
     * A flag indicating whether it is possible to delete the firewall. A setting of TRUE indicates that the firewall is protected against deletion. Use this setting to protect against accidentally deleting a firewall that is in use. When you create a firewall, the operation initializes this flag to TRUE.
     */
    DeleteProtection?: Boolean;
    /**
     * A setting indicating whether the firewall is protected against changes to the subnet associations. Use this setting to protect against accidentally modifying the subnet associations for a firewall that is in use. When you create a firewall, the operation initializes this setting to TRUE.
     */
    SubnetChangeProtection?: Boolean;
    /**
     * A setting indicating whether the firewall is protected against a change to the firewall policy association. Use this setting to protect against accidentally modifying the firewall policy for a firewall that is in use. When you create a firewall, the operation initializes this setting to TRUE.
     */
    FirewallPolicyChangeProtection?: Boolean;
    /**
     * A description of the firewall.
     */
    Description?: Description;
    /**
     * The unique identifier for the firewall. 
     */
    FirewallId: ResourceId;
    /**
     * 
     */
    Tags?: TagList;
  }
  export interface FirewallMetadata {
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
  }
  export type FirewallPolicies = FirewallPolicyMetadata[];
  export interface FirewallPolicy {
    /**
     * References to the stateless rule groups that are used in the policy. These define the matching criteria in stateless rules. 
     */
    StatelessRuleGroupReferences?: StatelessRuleGroupReferences;
    /**
     * The actions to take on a packet if it doesn't match any of the stateless rules in the policy. If you want non-matching packets to be forwarded for stateful inspection, specify aws:forward_to_sfe.  You must specify one of the standard actions: aws:pass, aws:drop, or aws:forward_to_sfe. In addition, you can specify custom actions that are compatible with your standard section choice. For example, you could specify ["aws:pass"] or you could specify ["aws:pass", “customActionName”]. For information about compatibility, see the custom action descriptions under CustomAction.
     */
    StatelessDefaultActions: StatelessActions;
    /**
     * The actions to take on a fragmented UDP packet if it doesn't match any of the stateless rules in the policy. Network Firewall only manages UDP packet fragments and silently drops packet fragments for other protocols. If you want non-matching fragmented UDP packets to be forwarded for stateful inspection, specify aws:forward_to_sfe.  You must specify one of the standard actions: aws:pass, aws:drop, or aws:forward_to_sfe. In addition, you can specify custom actions that are compatible with your standard section choice. For example, you could specify ["aws:pass"] or you could specify ["aws:pass", “customActionName”]. For information about compatibility, see the custom action descriptions under CustomAction.
     */
    StatelessFragmentDefaultActions: StatelessActions;
    /**
     * The custom action definitions that are available for use in the firewall policy's StatelessDefaultActions setting. You name each custom action that you define, and then you can use it by name in your default actions specifications.
     */
    StatelessCustomActions?: CustomActions;
    /**
     * References to the stateful rule groups that are used in the policy. These define the inspection criteria in stateful rules. 
     */
    StatefulRuleGroupReferences?: StatefulRuleGroupReferences;
    /**
     * The default actions to take on a packet that doesn't match any stateful rules.
     */
    StatefulDefaultActions?: StatefulActions;
    /**
     * Additional options governing how Network Firewall handles stateful rules. The stateful rule groups that you use in your policy must have stateful rule options settings that are compatible with these settings.
     */
    StatefulEngineOptions?: StatefulEngineOptions;
  }
  export interface FirewallPolicyMetadata {
    /**
     * The descriptive name of the firewall policy. You can't change the name of a firewall policy after you create it.
     */
    Name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the firewall policy.
     */
    Arn?: ResourceArn;
  }
  export interface FirewallPolicyResponse {
    /**
     * The descriptive name of the firewall policy. You can't change the name of a firewall policy after you create it.
     */
    FirewallPolicyName: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the firewall policy.  If this response is for a create request that had DryRun set to TRUE, then this ARN is a placeholder that isn't attached to a valid resource. 
     */
    FirewallPolicyArn: ResourceArn;
    /**
     * The unique identifier for the firewall policy. 
     */
    FirewallPolicyId: ResourceId;
    /**
     * A description of the firewall policy.
     */
    Description?: Description;
    /**
     * The current status of the firewall policy. You can retrieve this for a firewall policy by calling DescribeFirewallPolicy and providing the firewall policy's name or ARN.
     */
    FirewallPolicyStatus?: ResourceStatus;
    /**
     * The key:value pairs to associate with the resource.
     */
    Tags?: TagList;
    /**
     * The number of capacity units currently consumed by the policy's stateless rules.
     */
    ConsumedStatelessRuleCapacity?: RuleCapacity;
    /**
     * The number of capacity units currently consumed by the policy's stateful rules.
     */
    ConsumedStatefulRuleCapacity?: RuleCapacity;
    /**
     * The number of firewalls that are associated with this firewall policy.
     */
    NumberOfAssociations?: NumberOfAssociations;
  }
  export interface FirewallStatus {
    /**
     * The readiness of the configured firewall to handle network traffic across all of the Availability Zones where you've configured it. This setting is READY only when the ConfigurationSyncStateSummary value is IN_SYNC and the Attachment Status values for all of the configured subnets are READY. 
     */
    Status: FirewallStatusValue;
    /**
     * The configuration sync state for the firewall. This summarizes the sync states reported in the Config settings for all of the Availability Zones where you have configured the firewall.  When you create a firewall or update its configuration, for example by adding a rule group to its firewall policy, Network Firewall distributes the configuration changes to all zones where the firewall is in use. This summary indicates whether the configuration changes have been applied everywhere.  This status must be IN_SYNC for the firewall to be ready for use, but it doesn't indicate that the firewall is ready. The Status setting indicates firewall readiness.
     */
    ConfigurationSyncStateSummary: ConfigurationSyncState;
    /**
     * The subnets that you've configured for use by the Network Firewall firewall. This contains one array element per Availability Zone where you've configured a subnet. These objects provide details of the information that is summarized in the ConfigurationSyncStateSummary and Status, broken down by zone and configuration object. 
     */
    SyncStates?: SyncStates;
  }
  export type FirewallStatusValue = "PROVISIONING"|"DELETING"|"READY"|string;
  export type Firewalls = FirewallMetadata[];
  export type Flags = TCPFlag[];
  export type GeneratedRulesType = "ALLOWLIST"|"DENYLIST"|string;
  export type HashMapKey = string;
  export type HashMapValue = string;
  export interface Header {
    /**
     * The protocol to inspect for. To specify all, you can use IP, because all traffic on AWS and on the internet is IP.
     */
    Protocol: StatefulRuleProtocol;
    /**
     * The source IP address or address range to inspect for, in CIDR notation. To match with any address, specify ANY.  Specify an IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation. Network Firewall supports all address ranges for IPv4.  Examples:    To configure Network Firewall to inspect for the IP address 192.0.2.44, specify 192.0.2.44/32.   To configure Network Firewall to inspect for IP addresses from 192.0.2.0 to 192.0.2.255, specify 192.0.2.0/24.   For more information about CIDR notation, see the Wikipedia entry Classless Inter-Domain Routing.
     */
    Source: Source;
    /**
     * The source port to inspect for. You can specify an individual port, for example 1994 and you can specify a port range, for example 1990:1994. To match with any port, specify ANY. 
     */
    SourcePort: Port;
    /**
     * The direction of traffic flow to inspect. If set to ANY, the inspection matches bidirectional traffic, both from the source to the destination and from the destination to the source. If set to FORWARD, the inspection only matches traffic going from the source to the destination. 
     */
    Direction: StatefulRuleDirection;
    /**
     * The destination IP address or address range to inspect for, in CIDR notation. To match with any address, specify ANY.  Specify an IP address or a block of IP addresses in Classless Inter-Domain Routing (CIDR) notation. Network Firewall supports all address ranges for IPv4.  Examples:    To configure Network Firewall to inspect for the IP address 192.0.2.44, specify 192.0.2.44/32.   To configure Network Firewall to inspect for IP addresses from 192.0.2.0 to 192.0.2.255, specify 192.0.2.0/24.   For more information about CIDR notation, see the Wikipedia entry Classless Inter-Domain Routing.
     */
    Destination: Destination;
    /**
     * The destination port to inspect for. You can specify an individual port, for example 1994 and you can specify a port range, for example 1990:1994. To match with any port, specify ANY. 
     */
    DestinationPort: Port;
  }
  export interface IPSet {
    /**
     * The list of IP addresses and address ranges, in CIDR notation. 
     */
    Definition: VariableDefinitionList;
  }
  export type IPSets = {[key: string]: IPSet};
  export type Keyword = string;
  export interface ListFirewallPoliciesRequest {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Network Firewall returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of objects that you want Network Firewall to return for this request. If more objects are available, in the response, Network Firewall provides a NextToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: PaginationMaxResults;
  }
  export interface ListFirewallPoliciesResponse {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Network Firewall returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The metadata for the firewall policies. Depending on your setting for max results and the number of firewall policies that you have, this might not be the full list. 
     */
    FirewallPolicies?: FirewallPolicies;
  }
  export interface ListFirewallsRequest {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Network Firewall returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The unique identifiers of the VPCs that you want Network Firewall to retrieve the firewalls for. Leave this blank to retrieve all firewalls that you have defined.
     */
    VpcIds?: VpcIds;
    /**
     * The maximum number of objects that you want Network Firewall to return for this request. If more objects are available, in the response, Network Firewall provides a NextToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: PaginationMaxResults;
  }
  export interface ListFirewallsResponse {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Network Firewall returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The firewall metadata objects for the VPCs that you specified. Depending on your setting for max results and the number of firewalls you have, a single call might not be the full list. 
     */
    Firewalls?: Firewalls;
  }
  export interface ListRuleGroupsRequest {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Network Firewall returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of objects that you want Network Firewall to return for this request. If more objects are available, in the response, Network Firewall provides a NextToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: PaginationMaxResults;
  }
  export interface ListRuleGroupsResponse {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Network Firewall returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The rule group metadata objects that you've defined. Depending on your setting for max results and the number of rule groups, this might not be the full list. 
     */
    RuleGroups?: RuleGroups;
  }
  export interface ListTagsForResourceRequest {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Network Firewall returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of objects that you want Network Firewall to return for this request. If more objects are available, in the response, Network Firewall provides a NextToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: TagsPaginationMaxResults;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Network Firewall returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The tags that are associated with the resource. 
     */
    Tags?: TagList;
  }
  export interface LogDestinationConfig {
    /**
     * The type of log to send. Alert logs report traffic that matches a StatefulRule with an action setting that sends an alert log message. Flow logs are standard network traffic flow logs. 
     */
    LogType: LogType;
    /**
     * The type of storage destination to send these logs to. You can send logs to an Amazon S3 bucket, a CloudWatch log group, or a Kinesis Data Firehose delivery stream.
     */
    LogDestinationType: LogDestinationType;
    /**
     * The named location for the logs, provided in a key:value mapping that is specific to the chosen destination type.    For an Amazon S3 bucket, provide the name of the bucket, with key bucketName, and optionally provide a prefix, with key prefix. The following example specifies an Amazon S3 bucket named DOC-EXAMPLE-BUCKET and the prefix alerts:   "LogDestination": { "bucketName": "DOC-EXAMPLE-BUCKET", "prefix": "alerts" }    For a CloudWatch log group, provide the name of the CloudWatch log group, with key logGroup. The following example specifies a log group named alert-log-group:   "LogDestination": { "logGroup": "alert-log-group" }    For a Kinesis Data Firehose delivery stream, provide the name of the delivery stream, with key deliveryStream. The following example specifies a delivery stream named alert-delivery-stream:   "LogDestination": { "deliveryStream": "alert-delivery-stream" }   
     */
    LogDestination: LogDestinationMap;
  }
  export type LogDestinationConfigs = LogDestinationConfig[];
  export type LogDestinationMap = {[key: string]: HashMapValue};
  export type LogDestinationType = "S3"|"CloudWatchLogs"|"KinesisDataFirehose"|string;
  export type LogType = "ALERT"|"FLOW"|string;
  export interface LoggingConfiguration {
    /**
     * Defines the logging destinations for the logs for a firewall. Network Firewall generates logs for stateful rule groups. 
     */
    LogDestinationConfigs: LogDestinationConfigs;
  }
  export interface MatchAttributes {
    /**
     * The source IP addresses and address ranges to inspect for, in CIDR notation. If not specified, this matches with any source address. 
     */
    Sources?: Addresses;
    /**
     * The destination IP addresses and address ranges to inspect for, in CIDR notation. If not specified, this matches with any destination address. 
     */
    Destinations?: Addresses;
    /**
     * The source ports to inspect for. If not specified, this matches with any source port. This setting is only used for protocols 6 (TCP) and 17 (UDP).  You can specify individual ports, for example 1994 and you can specify port ranges, for example 1990:1994. 
     */
    SourcePorts?: PortRanges;
    /**
     * The destination ports to inspect for. If not specified, this matches with any destination port. This setting is only used for protocols 6 (TCP) and 17 (UDP).  You can specify individual ports, for example 1994 and you can specify port ranges, for example 1990:1994. 
     */
    DestinationPorts?: PortRanges;
    /**
     * The protocols to inspect for, specified using each protocol's assigned internet protocol number (IANA). If not specified, this matches with any protocol. 
     */
    Protocols?: ProtocolNumbers;
    /**
     * The TCP flags and masks to inspect for. If not specified, this matches with any settings. This setting is only used for protocol 6 (TCP).
     */
    TCPFlags?: TCPFlags;
  }
  export type NumberOfAssociations = number;
  export type PaginationMaxResults = number;
  export type PaginationToken = string;
  export interface PerObjectStatus {
    /**
     * Indicates whether this object is in sync with the version indicated in the update token.
     */
    SyncStatus?: PerObjectSyncStatus;
    /**
     * The current version of the object that is either in sync or pending synchronization. 
     */
    UpdateToken?: UpdateToken;
  }
  export type PerObjectSyncStatus = "PENDING"|"IN_SYNC"|string;
  export type PolicyString = string;
  export type Port = string;
  export interface PortRange {
    /**
     * The lower limit of the port range. This must be less than or equal to the ToPort specification. 
     */
    FromPort: PortRangeBound;
    /**
     * The upper limit of the port range. This must be greater than or equal to the FromPort specification. 
     */
    ToPort: PortRangeBound;
  }
  export type PortRangeBound = number;
  export type PortRanges = PortRange[];
  export interface PortSet {
    /**
     * The set of port ranges. 
     */
    Definition?: VariableDefinitionList;
  }
  export type PortSets = {[key: string]: PortSet};
  export type Priority = number;
  export type ProtocolNumber = number;
  export type ProtocolNumbers = ProtocolNumber[];
  export interface PublishMetricAction {
    /**
     * 
     */
    Dimensions: Dimensions;
  }
  export interface PutResourcePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the account that you want to share rule groups and firewall policies with.
     */
    ResourceArn: ResourceArn;
    /**
     * The AWS Identity and Access Management policy statement that lists the accounts that you want to share your rule group or firewall policy with and the operations that you want the accounts to be able to perform.  For a rule group resource, you can specify the following operations in the Actions section of the statement:   network-firewall:CreateFirewallPolicy   network-firewall:UpdateFirewallPolicy   network-firewall:ListRuleGroups   For a firewall policy resource, you can specify the following operations in the Actions section of the statement:   network-firewall:CreateFirewall   network-firewall:UpdateFirewall   network-firewall:AssociateFirewallPolicy   network-firewall:ListFirewallPolicies   In the Resource section of the statement, you specify the ARNs for the rule groups and firewall policies that you want to share with the account that you specified in Arn.
     */
    Policy: PolicyString;
  }
  export interface PutResourcePolicyResponse {
  }
  export type ResourceArn = string;
  export type ResourceId = string;
  export type ResourceName = string;
  export type ResourceStatus = "ACTIVE"|"DELETING"|string;
  export type RuleCapacity = number;
  export interface RuleDefinition {
    /**
     * Criteria for Network Firewall to use to inspect an individual packet in stateless rule inspection. Each match attributes set can include one or more items such as IP address, CIDR range, port number, protocol, and TCP flags. 
     */
    MatchAttributes: MatchAttributes;
    /**
     * The actions to take on a packet that matches one of the stateless rule definition's match attributes. You must specify a standard action and you can add custom actions.   Network Firewall only forwards a packet for stateful rule inspection if you specify aws:forward_to_sfe for a rule that the packet matches, or if the packet doesn't match any stateless rule and you specify aws:forward_to_sfe for the StatelessDefaultActions setting for the FirewallPolicy.  For every rule, you must specify exactly one of the following standard actions.     aws:pass - Discontinues all inspection of the packet and permits it to go to its intended destination.    aws:drop - Discontinues all inspection of the packet and blocks it from going to its intended destination.    aws:forward_to_sfe - Discontinues stateless inspection of the packet and forwards it to the stateful rule engine for inspection.    Additionally, you can specify a custom action. To do this, you define a custom action by name and type, then provide the name you've assigned to the action in this Actions setting. For information about the options, see CustomAction.  To provide more than one action in this setting, separate the settings with a comma. For example, if you have a custom PublishMetrics action that you've named MyMetricsAction, then you could specify the standard action aws:pass and the custom action with [“aws:pass”, “MyMetricsAction”]. 
     */
    Actions: StatelessActions;
  }
  export interface RuleGroup {
    /**
     * Settings that are available for use in the rules in the rule group. You can only use these for stateful rule groups. 
     */
    RuleVariables?: RuleVariables;
    /**
     * The stateful rules or stateless rules for the rule group. 
     */
    RulesSource: RulesSource;
    /**
     * Additional options governing how Network Firewall handles stateful rules. The policies where you use your stateful rule group must have stateful rule options settings that are compatible with these settings.
     */
    StatefulRuleOptions?: StatefulRuleOptions;
  }
  export interface RuleGroupMetadata {
    /**
     * The descriptive name of the rule group. You can't change the name of a rule group after you create it.
     */
    Name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the rule group.
     */
    Arn?: ResourceArn;
  }
  export interface RuleGroupResponse {
    /**
     * The Amazon Resource Name (ARN) of the rule group.  If this response is for a create request that had DryRun set to TRUE, then this ARN is a placeholder that isn't attached to a valid resource. 
     */
    RuleGroupArn: ResourceArn;
    /**
     * The descriptive name of the rule group. You can't change the name of a rule group after you create it.
     */
    RuleGroupName: ResourceName;
    /**
     * The unique identifier for the rule group. 
     */
    RuleGroupId: ResourceId;
    /**
     * A description of the rule group. 
     */
    Description?: Description;
    /**
     * Indicates whether the rule group is stateless or stateful. If the rule group is stateless, it contains stateless rules. If it is stateful, it contains stateful rules. 
     */
    Type?: RuleGroupType;
    /**
     * The maximum operating resources that this rule group can use. Rule group capacity is fixed at creation. When you update a rule group, you are limited to this capacity. When you reference a rule group from a firewall policy, Network Firewall reserves this capacity for the rule group.  You can retrieve the capacity that would be required for a rule group before you create the rule group by calling CreateRuleGroup with DryRun set to TRUE. 
     */
    Capacity?: RuleCapacity;
    /**
     * Detailed information about the current status of a rule group. 
     */
    RuleGroupStatus?: ResourceStatus;
    /**
     * The key:value pairs to associate with the resource.
     */
    Tags?: TagList;
    /**
     * The number of capacity units currently consumed by the rule group rules. 
     */
    ConsumedCapacity?: RuleCapacity;
    /**
     * The number of firewall policies that use this rule group.
     */
    NumberOfAssociations?: NumberOfAssociations;
  }
  export type RuleGroupType = "STATELESS"|"STATEFUL"|string;
  export type RuleGroups = RuleGroupMetadata[];
  export interface RuleOption {
    /**
     * 
     */
    Keyword: Keyword;
    /**
     * 
     */
    Settings?: Settings;
  }
  export type RuleOptions = RuleOption[];
  export type RuleOrder = "DEFAULT_ACTION_ORDER"|"STRICT_ORDER"|string;
  export type RuleTargets = CollectionMember_String[];
  export type RuleVariableName = string;
  export interface RuleVariables {
    /**
     * A list of IP addresses and address ranges, in CIDR notation. 
     */
    IPSets?: IPSets;
    /**
     * A list of port ranges. 
     */
    PortSets?: PortSets;
  }
  export interface RulesSource {
    /**
     * Stateful inspection criteria, provided in Suricata compatible intrusion prevention system (IPS) rules. Suricata is an open-source network IPS that includes a standard rule-based language for network traffic inspection. These rules contain the inspection criteria and the action to take for traffic that matches the criteria, so this type of rule group doesn't have a separate action setting.
     */
    RulesString?: RulesString;
    /**
     * Stateful inspection criteria for a domain list rule group. 
     */
    RulesSourceList?: RulesSourceList;
    /**
     * An array of individual stateful rules inspection criteria to be used together in a stateful rule group. Use this option to specify simple Suricata rules with protocol, source and destination, ports, direction, and rule options. For information about the Suricata Rules format, see Rules Format. 
     */
    StatefulRules?: StatefulRules;
    /**
     * Stateless inspection criteria to be used in a stateless rule group. 
     */
    StatelessRulesAndCustomActions?: StatelessRulesAndCustomActions;
  }
  export interface RulesSourceList {
    /**
     * The domains that you want to inspect for in your traffic flows. To provide multiple domains, separate them with commas. Valid domain specifications are the following:   Explicit names. For example, abc.example.com matches only the domain abc.example.com.   Names that use a domain wildcard, which you indicate with an initial '.'. For example,.example.com matches example.com and matches all subdomains of example.com, such as abc.example.com and www.example.com.   
     */
    Targets: RuleTargets;
    /**
     * The protocols you want to inspect. Specify TLS_SNI for HTTPS. Specify HTTP_HOST for HTTP. You can specify either or both. 
     */
    TargetTypes: TargetTypes;
    /**
     * Whether you want to allow or deny access to the domains in your target list.
     */
    GeneratedRulesType: GeneratedRulesType;
  }
  export type RulesString = string;
  export type Setting = string;
  export type Settings = Setting[];
  export type Source = string;
  export type StatefulAction = "PASS"|"DROP"|"ALERT"|string;
  export type StatefulActions = CollectionMember_String[];
  export interface StatefulEngineOptions {
    /**
     * Indicates how to manage the order of stateful rule evaluation for the policy. By default, Network Firewall leaves the rule evaluation order up to the Suricata rule processing engine. If you set this to STRICT_ORDER, your rules are evaluated in the exact order that you provide them in the policy. With strict ordering, the rule groups are evaluated by order of priority, starting from the lowest number, and the rules in each rule group are processed in the order that they're defined. 
     */
    RuleOrder?: RuleOrder;
  }
  export interface StatefulRule {
    /**
     * Defines what Network Firewall should do with the packets in a traffic flow when the flow matches the stateful rule criteria. For all actions, Network Firewall performs the specified action and discontinues stateful inspection of the traffic flow.  The actions for a stateful rule are defined as follows:     PASS - Permits the packets to go to the intended destination.    DROP - Blocks the packets from going to the intended destination and sends an alert log message, if alert logging is configured in the Firewall LoggingConfiguration.     ALERT - Permits the packets to go to the intended destination and sends an alert log message, if alert logging is configured in the Firewall LoggingConfiguration.  You can use this action to test a rule that you intend to use to drop traffic. You can enable the rule with ALERT action, verify in the logs that the rule is filtering as you want, then change the action to DROP.  
     */
    Action: StatefulAction;
    /**
     * The stateful inspection criteria for this rule, used to inspect traffic flows. 
     */
    Header: Header;
    /**
     * Additional options for the rule. These are the Suricata RuleOptions settings.
     */
    RuleOptions: RuleOptions;
  }
  export type StatefulRuleDirection = "FORWARD"|"ANY"|string;
  export interface StatefulRuleGroupReference {
    /**
     * The Amazon Resource Name (ARN) of the stateful rule group.
     */
    ResourceArn: ResourceArn;
    /**
     * An integer setting that indicates the order in which to run the stateful rule groups in a single FirewallPolicy. This setting only applies to firewall policies that specify the STRICT_ORDER rule order in the stateful engine options settings. Network Firewall evalutes each stateful rule group against a packet starting with the group that has the lowest priority setting. You must ensure that the priority settings are unique within each policy. You can change the priority settings of your rule groups at any time. To make it easier to insert rule groups later, number them so there's a wide range in between, for example use 100, 200, and so on. 
     */
    Priority?: Priority;
  }
  export type StatefulRuleGroupReferences = StatefulRuleGroupReference[];
  export interface StatefulRuleOptions {
    /**
     * Indicates how to manage the order of the rule evaluation for the rule group. By default, Network Firewall leaves the rule evaluation order up to the Suricata rule processing engine. If you set this to STRICT_ORDER, your rules are evaluated in the exact order that they're listed in your Suricata rules string. 
     */
    RuleOrder?: RuleOrder;
  }
  export type StatefulRuleProtocol = "IP"|"TCP"|"UDP"|"ICMP"|"HTTP"|"FTP"|"TLS"|"SMB"|"DNS"|"DCERPC"|"SSH"|"SMTP"|"IMAP"|"MSN"|"KRB5"|"IKEV2"|"TFTP"|"NTP"|"DHCP"|string;
  export type StatefulRules = StatefulRule[];
  export type StatelessActions = CollectionMember_String[];
  export interface StatelessRule {
    /**
     * Defines the stateless 5-tuple packet inspection criteria and the action to take on a packet that matches the criteria. 
     */
    RuleDefinition: RuleDefinition;
    /**
     * Indicates the order in which to run this rule relative to all of the rules that are defined for a stateless rule group. Network Firewall evaluates the rules in a rule group starting with the lowest priority setting. You must ensure that the priority settings are unique for the rule group.  Each stateless rule group uses exactly one StatelessRulesAndCustomActions object, and each StatelessRulesAndCustomActions contains exactly one StatelessRules object. To ensure unique priority settings for your rule groups, set unique priorities for the stateless rules that you define inside any single StatelessRules object. You can change the priority settings of your rules at any time. To make it easier to insert rules later, number them so there's a wide range in between, for example use 100, 200, and so on. 
     */
    Priority: Priority;
  }
  export interface StatelessRuleGroupReference {
    /**
     * The Amazon Resource Name (ARN) of the stateless rule group.
     */
    ResourceArn: ResourceArn;
    /**
     * An integer setting that indicates the order in which to run the stateless rule groups in a single FirewallPolicy. Network Firewall applies each stateless rule group to a packet starting with the group that has the lowest priority setting. You must ensure that the priority settings are unique within each policy.
     */
    Priority: Priority;
  }
  export type StatelessRuleGroupReferences = StatelessRuleGroupReference[];
  export type StatelessRules = StatelessRule[];
  export interface StatelessRulesAndCustomActions {
    /**
     * Defines the set of stateless rules for use in a stateless rule group. 
     */
    StatelessRules: StatelessRules;
    /**
     * Defines an array of individual custom action definitions that are available for use by the stateless rules in this StatelessRulesAndCustomActions specification. You name each custom action that you define, and then you can use it by name in your StatelessRule RuleDefinition Actions specification.
     */
    CustomActions?: CustomActions;
  }
  export interface SubnetMapping {
    /**
     * The unique identifier for the subnet. 
     */
    SubnetId: CollectionMember_String;
  }
  export type SubnetMappings = SubnetMapping[];
  export interface SyncState {
    /**
     * The attachment status of the firewall's association with a single VPC subnet. For each configured subnet, Network Firewall creates the attachment by instantiating the firewall endpoint in the subnet so that it's ready to take traffic. This is part of the FirewallStatus.
     */
    Attachment?: Attachment;
    /**
     * The configuration status of the firewall endpoint in a single VPC subnet. Network Firewall provides each endpoint with the rules that are configured in the firewall policy. Each time you add a subnet or modify the associated firewall policy, Network Firewall synchronizes the rules in the endpoint, so it can properly filter network traffic. This is part of the FirewallStatus.
     */
    Config?: SyncStateConfig;
  }
  export type SyncStateConfig = {[key: string]: PerObjectStatus};
  export type SyncStates = {[key: string]: SyncState};
  export type TCPFlag = "FIN"|"SYN"|"RST"|"PSH"|"ACK"|"URG"|"ECE"|"CWR"|string;
  export interface TCPFlagField {
    /**
     * Used in conjunction with the Masks setting to define the flags that must be set and flags that must not be set in order for the packet to match. This setting can only specify values that are also specified in the Masks setting. For the flags that are specified in the masks setting, the following must be true for the packet to match:    The ones that are set in this flags setting must be set in the packet.    The ones that are not set in this flags setting must also not be set in the packet.   
     */
    Flags: Flags;
    /**
     * The set of flags to consider in the inspection. To inspect all flags in the valid values list, leave this with no setting.
     */
    Masks?: Flags;
  }
  export type TCPFlags = TCPFlagField[];
  export interface Tag {
    /**
     * The part of the key:value pair that defines a tag. You can use a tag key to describe a category of information, such as "customer." Tag keys are case-sensitive.
     */
    Key: TagKey;
    /**
     * The part of the key:value pair that defines a tag. You can use a tag value to describe a specific value within a category, such as "companyA" or "companyB." Tag values are case-sensitive.
     */
    Value: TagValue;
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
     * 
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TagsPaginationMaxResults = number;
  export type TargetType = "TLS_SNI"|"HTTP_HOST"|string;
  export type TargetTypes = TargetType[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: ResourceArn;
    /**
     * 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateFirewallDeleteProtectionRequest {
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
    /**
     * A flag indicating whether it is possible to delete the firewall. A setting of TRUE indicates that the firewall is protected against deletion. Use this setting to protect against accidentally deleting a firewall that is in use. When you create a firewall, the operation initializes this flag to TRUE.
     */
    DeleteProtection: Boolean;
  }
  export interface UpdateFirewallDeleteProtectionResponse {
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName?: ResourceName;
    /**
     * 
     */
    DeleteProtection?: Boolean;
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
  }
  export interface UpdateFirewallDescriptionRequest {
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
    /**
     * The new description for the firewall. If you omit this setting, Network Firewall removes the description for the firewall.
     */
    Description?: Description;
  }
  export interface UpdateFirewallDescriptionResponse {
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName?: ResourceName;
    /**
     * A description of the firewall.
     */
    Description?: Description;
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
  }
  export interface UpdateFirewallPolicyChangeProtectionRequest {
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
    /**
     * A setting indicating whether the firewall is protected against a change to the firewall policy association. Use this setting to protect against accidentally modifying the firewall policy for a firewall that is in use. When you create a firewall, the operation initializes this setting to TRUE.
     */
    FirewallPolicyChangeProtection: Boolean;
  }
  export interface UpdateFirewallPolicyChangeProtectionResponse {
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName?: ResourceName;
    /**
     * A setting indicating whether the firewall is protected against a change to the firewall policy association. Use this setting to protect against accidentally modifying the firewall policy for a firewall that is in use. When you create a firewall, the operation initializes this setting to TRUE.
     */
    FirewallPolicyChangeProtection?: Boolean;
  }
  export interface UpdateFirewallPolicyRequest {
    /**
     * A token used for optimistic locking. Network Firewall returns a token to your requests that access the firewall policy. The token marks the state of the policy resource at the time of the request.  To make changes to the policy, you provide the token in your request. Network Firewall uses the token to ensure that the policy hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall policy again to get a current copy of it with current token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the firewall policy. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallPolicyArn?: ResourceArn;
    /**
     * The descriptive name of the firewall policy. You can't change the name of a firewall policy after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallPolicyName?: ResourceName;
    /**
     * The updated firewall policy to use for the firewall. 
     */
    FirewallPolicy: FirewallPolicy;
    /**
     * A description of the firewall policy.
     */
    Description?: Description;
    /**
     * Indicates whether you want Network Firewall to just check the validity of the request, rather than run the request.  If set to TRUE, Network Firewall checks whether the request can run successfully, but doesn't actually make the requested changes. The call returns the value that the request would return if you ran it with dry run set to FALSE, but doesn't make additions or changes to your resources. This option allows you to make sure that you have the required permissions to run the request and that your request parameters are valid.  If set to FALSE, Network Firewall makes the requested changes to your resources. 
     */
    DryRun?: Boolean;
  }
  export interface UpdateFirewallPolicyResponse {
    /**
     * A token used for optimistic locking. Network Firewall returns a token to your requests that access the firewall policy. The token marks the state of the policy resource at the time of the request.  To make changes to the policy, you provide the token in your request. Network Firewall uses the token to ensure that the policy hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall policy again to get a current copy of it with current token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken: UpdateToken;
    /**
     * The high-level properties of a firewall policy. This, along with the FirewallPolicy, define the policy. You can retrieve all objects for a firewall policy by calling DescribeFirewallPolicy. 
     */
    FirewallPolicyResponse: FirewallPolicyResponse;
  }
  export interface UpdateLoggingConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
    /**
     * Defines how Network Firewall performs logging for a firewall. If you omit this setting, Network Firewall disables logging for the firewall.
     */
    LoggingConfiguration?: LoggingConfiguration;
  }
  export interface UpdateLoggingConfigurationResponse {
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName?: ResourceName;
    LoggingConfiguration?: LoggingConfiguration;
  }
  export interface UpdateRuleGroupRequest {
    /**
     * A token used for optimistic locking. Network Firewall returns a token to your requests that access the rule group. The token marks the state of the rule group resource at the time of the request.  To make changes to the rule group, you provide the token in your request. Network Firewall uses the token to ensure that the rule group hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the rule group again to get a current copy of it with a current token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the rule group. You must specify the ARN or the name, and you can specify both. 
     */
    RuleGroupArn?: ResourceArn;
    /**
     * The descriptive name of the rule group. You can't change the name of a rule group after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    RuleGroupName?: ResourceName;
    /**
     * An object that defines the rule group rules.   You must provide either this rule group setting or a Rules setting, but not both.  
     */
    RuleGroup?: RuleGroup;
    /**
     * A string containing stateful rule group rules specifications in Suricata flat format, with one rule per line. Use this to import your existing Suricata compatible rule groups.   You must provide either this rules setting or a populated RuleGroup setting, but not both.   You can provide your rule group specification in Suricata flat format through this setting when you create or update your rule group. The call response returns a RuleGroup object that Network Firewall has populated from your string. 
     */
    Rules?: RulesString;
    /**
     * Indicates whether the rule group is stateless or stateful. If the rule group is stateless, it contains stateless rules. If it is stateful, it contains stateful rules.   This setting is required for requests that do not include the RuleGroupARN. 
     */
    Type?: RuleGroupType;
    /**
     * A description of the rule group. 
     */
    Description?: Description;
    /**
     * Indicates whether you want Network Firewall to just check the validity of the request, rather than run the request.  If set to TRUE, Network Firewall checks whether the request can run successfully, but doesn't actually make the requested changes. The call returns the value that the request would return if you ran it with dry run set to FALSE, but doesn't make additions or changes to your resources. This option allows you to make sure that you have the required permissions to run the request and that your request parameters are valid.  If set to FALSE, Network Firewall makes the requested changes to your resources. 
     */
    DryRun?: Boolean;
  }
  export interface UpdateRuleGroupResponse {
    /**
     * A token used for optimistic locking. Network Firewall returns a token to your requests that access the rule group. The token marks the state of the rule group resource at the time of the request.  To make changes to the rule group, you provide the token in your request. Network Firewall uses the token to ensure that the rule group hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the rule group again to get a current copy of it with a current token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken: UpdateToken;
    /**
     * The high-level properties of a rule group. This, along with the RuleGroup, define the rule group. You can retrieve all objects for a rule group by calling DescribeRuleGroup. 
     */
    RuleGroupResponse: RuleGroupResponse;
  }
  export interface UpdateSubnetChangeProtectionRequest {
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the firewall. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it. You must specify the ARN or the name, and you can specify both. 
     */
    FirewallName?: ResourceName;
    /**
     * A setting indicating whether the firewall is protected against changes to the subnet associations. Use this setting to protect against accidentally modifying the subnet associations for a firewall that is in use. When you create a firewall, the operation initializes this setting to TRUE.
     */
    SubnetChangeProtection: Boolean;
  }
  export interface UpdateSubnetChangeProtectionResponse {
    /**
     * An optional token that you can use for optimistic locking. Network Firewall returns a token to your requests that access the firewall. The token marks the state of the firewall resource at the time of the request.  To make an unconditional change to the firewall, omit the token in your update request. Without the token, Network Firewall performs your updates regardless of whether the firewall has changed since you last retrieved it. To make a conditional change to the firewall, provide the token in your update request. Network Firewall uses the token to ensure that the firewall hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the firewall again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * The Amazon Resource Name (ARN) of the firewall.
     */
    FirewallArn?: ResourceArn;
    /**
     * The descriptive name of the firewall. You can't change the name of a firewall after you create it.
     */
    FirewallName?: ResourceName;
    /**
     * A setting indicating whether the firewall is protected against changes to the subnet associations. Use this setting to protect against accidentally modifying the subnet associations for a firewall that is in use. When you create a firewall, the operation initializes this setting to TRUE.
     */
    SubnetChangeProtection?: Boolean;
  }
  export type UpdateToken = string;
  export type VariableDefinition = string;
  export type VariableDefinitionList = VariableDefinition[];
  export type VpcId = string;
  export type VpcIds = VpcId[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-11-12"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the NetworkFirewall client.
   */
  export import Types = NetworkFirewall;
}
export = NetworkFirewall;
