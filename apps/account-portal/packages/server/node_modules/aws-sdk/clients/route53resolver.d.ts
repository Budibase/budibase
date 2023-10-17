import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Route53Resolver extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Route53Resolver.Types.ClientConfiguration)
  config: Config & Route53Resolver.Types.ClientConfiguration;
  /**
   * Associates a FirewallRuleGroup with a VPC, to provide DNS filtering for the VPC. 
   */
  associateFirewallRuleGroup(params: Route53Resolver.Types.AssociateFirewallRuleGroupRequest, callback?: (err: AWSError, data: Route53Resolver.Types.AssociateFirewallRuleGroupResponse) => void): Request<Route53Resolver.Types.AssociateFirewallRuleGroupResponse, AWSError>;
  /**
   * Associates a FirewallRuleGroup with a VPC, to provide DNS filtering for the VPC. 
   */
  associateFirewallRuleGroup(callback?: (err: AWSError, data: Route53Resolver.Types.AssociateFirewallRuleGroupResponse) => void): Request<Route53Resolver.Types.AssociateFirewallRuleGroupResponse, AWSError>;
  /**
   * Adds IP addresses to an inbound or an outbound Resolver endpoint. If you want to add more than one IP address, submit one AssociateResolverEndpointIpAddress request for each IP address. To remove an IP address from an endpoint, see DisassociateResolverEndpointIpAddress. 
   */
  associateResolverEndpointIpAddress(params: Route53Resolver.Types.AssociateResolverEndpointIpAddressRequest, callback?: (err: AWSError, data: Route53Resolver.Types.AssociateResolverEndpointIpAddressResponse) => void): Request<Route53Resolver.Types.AssociateResolverEndpointIpAddressResponse, AWSError>;
  /**
   * Adds IP addresses to an inbound or an outbound Resolver endpoint. If you want to add more than one IP address, submit one AssociateResolverEndpointIpAddress request for each IP address. To remove an IP address from an endpoint, see DisassociateResolverEndpointIpAddress. 
   */
  associateResolverEndpointIpAddress(callback?: (err: AWSError, data: Route53Resolver.Types.AssociateResolverEndpointIpAddressResponse) => void): Request<Route53Resolver.Types.AssociateResolverEndpointIpAddressResponse, AWSError>;
  /**
   * Associates an Amazon VPC with a specified query logging configuration. Route 53 Resolver logs DNS queries that originate in all of the Amazon VPCs that are associated with a specified query logging configuration. To associate more than one VPC with a configuration, submit one AssociateResolverQueryLogConfig request for each VPC.  The VPCs that you associate with a query logging configuration must be in the same Region as the configuration.  To remove a VPC from a query logging configuration, see DisassociateResolverQueryLogConfig. 
   */
  associateResolverQueryLogConfig(params: Route53Resolver.Types.AssociateResolverQueryLogConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.AssociateResolverQueryLogConfigResponse) => void): Request<Route53Resolver.Types.AssociateResolverQueryLogConfigResponse, AWSError>;
  /**
   * Associates an Amazon VPC with a specified query logging configuration. Route 53 Resolver logs DNS queries that originate in all of the Amazon VPCs that are associated with a specified query logging configuration. To associate more than one VPC with a configuration, submit one AssociateResolverQueryLogConfig request for each VPC.  The VPCs that you associate with a query logging configuration must be in the same Region as the configuration.  To remove a VPC from a query logging configuration, see DisassociateResolverQueryLogConfig. 
   */
  associateResolverQueryLogConfig(callback?: (err: AWSError, data: Route53Resolver.Types.AssociateResolverQueryLogConfigResponse) => void): Request<Route53Resolver.Types.AssociateResolverQueryLogConfigResponse, AWSError>;
  /**
   * Associates a Resolver rule with a VPC. When you associate a rule with a VPC, Resolver forwards all DNS queries for the domain name that is specified in the rule and that originate in the VPC. The queries are forwarded to the IP addresses for the DNS resolvers that are specified in the rule. For more information about rules, see CreateResolverRule. 
   */
  associateResolverRule(params: Route53Resolver.Types.AssociateResolverRuleRequest, callback?: (err: AWSError, data: Route53Resolver.Types.AssociateResolverRuleResponse) => void): Request<Route53Resolver.Types.AssociateResolverRuleResponse, AWSError>;
  /**
   * Associates a Resolver rule with a VPC. When you associate a rule with a VPC, Resolver forwards all DNS queries for the domain name that is specified in the rule and that originate in the VPC. The queries are forwarded to the IP addresses for the DNS resolvers that are specified in the rule. For more information about rules, see CreateResolverRule. 
   */
  associateResolverRule(callback?: (err: AWSError, data: Route53Resolver.Types.AssociateResolverRuleResponse) => void): Request<Route53Resolver.Types.AssociateResolverRuleResponse, AWSError>;
  /**
   * Creates an empty firewall domain list for use in DNS Firewall rules. You can populate the domains for the new list with a file, using ImportFirewallDomains, or with domain strings, using UpdateFirewallDomains. 
   */
  createFirewallDomainList(params: Route53Resolver.Types.CreateFirewallDomainListRequest, callback?: (err: AWSError, data: Route53Resolver.Types.CreateFirewallDomainListResponse) => void): Request<Route53Resolver.Types.CreateFirewallDomainListResponse, AWSError>;
  /**
   * Creates an empty firewall domain list for use in DNS Firewall rules. You can populate the domains for the new list with a file, using ImportFirewallDomains, or with domain strings, using UpdateFirewallDomains. 
   */
  createFirewallDomainList(callback?: (err: AWSError, data: Route53Resolver.Types.CreateFirewallDomainListResponse) => void): Request<Route53Resolver.Types.CreateFirewallDomainListResponse, AWSError>;
  /**
   * Creates a single DNS Firewall rule in the specified rule group, using the specified domain list.
   */
  createFirewallRule(params: Route53Resolver.Types.CreateFirewallRuleRequest, callback?: (err: AWSError, data: Route53Resolver.Types.CreateFirewallRuleResponse) => void): Request<Route53Resolver.Types.CreateFirewallRuleResponse, AWSError>;
  /**
   * Creates a single DNS Firewall rule in the specified rule group, using the specified domain list.
   */
  createFirewallRule(callback?: (err: AWSError, data: Route53Resolver.Types.CreateFirewallRuleResponse) => void): Request<Route53Resolver.Types.CreateFirewallRuleResponse, AWSError>;
  /**
   * Creates an empty DNS Firewall rule group for filtering DNS network traffic in a VPC. You can add rules to the new rule group by calling CreateFirewallRule. 
   */
  createFirewallRuleGroup(params: Route53Resolver.Types.CreateFirewallRuleGroupRequest, callback?: (err: AWSError, data: Route53Resolver.Types.CreateFirewallRuleGroupResponse) => void): Request<Route53Resolver.Types.CreateFirewallRuleGroupResponse, AWSError>;
  /**
   * Creates an empty DNS Firewall rule group for filtering DNS network traffic in a VPC. You can add rules to the new rule group by calling CreateFirewallRule. 
   */
  createFirewallRuleGroup(callback?: (err: AWSError, data: Route53Resolver.Types.CreateFirewallRuleGroupResponse) => void): Request<Route53Resolver.Types.CreateFirewallRuleGroupResponse, AWSError>;
  /**
   * Creates an Route 53 Resolver on an Outpost.
   */
  createOutpostResolver(params: Route53Resolver.Types.CreateOutpostResolverRequest, callback?: (err: AWSError, data: Route53Resolver.Types.CreateOutpostResolverResponse) => void): Request<Route53Resolver.Types.CreateOutpostResolverResponse, AWSError>;
  /**
   * Creates an Route 53 Resolver on an Outpost.
   */
  createOutpostResolver(callback?: (err: AWSError, data: Route53Resolver.Types.CreateOutpostResolverResponse) => void): Request<Route53Resolver.Types.CreateOutpostResolverResponse, AWSError>;
  /**
   * Creates a Resolver endpoint. There are two types of Resolver endpoints, inbound and outbound:   An inbound Resolver endpoint forwards DNS queries to the DNS service for a VPC from your network.   An outbound Resolver endpoint forwards DNS queries from the DNS service for a VPC to your network.  
   */
  createResolverEndpoint(params: Route53Resolver.Types.CreateResolverEndpointRequest, callback?: (err: AWSError, data: Route53Resolver.Types.CreateResolverEndpointResponse) => void): Request<Route53Resolver.Types.CreateResolverEndpointResponse, AWSError>;
  /**
   * Creates a Resolver endpoint. There are two types of Resolver endpoints, inbound and outbound:   An inbound Resolver endpoint forwards DNS queries to the DNS service for a VPC from your network.   An outbound Resolver endpoint forwards DNS queries from the DNS service for a VPC to your network.  
   */
  createResolverEndpoint(callback?: (err: AWSError, data: Route53Resolver.Types.CreateResolverEndpointResponse) => void): Request<Route53Resolver.Types.CreateResolverEndpointResponse, AWSError>;
  /**
   * Creates a Resolver query logging configuration, which defines where you want Resolver to save DNS query logs that originate in your VPCs. Resolver can log queries only for VPCs that are in the same Region as the query logging configuration. To specify which VPCs you want to log queries for, you use AssociateResolverQueryLogConfig. For more information, see AssociateResolverQueryLogConfig.  You can optionally use Resource Access Manager (RAM) to share a query logging configuration with other Amazon Web Services accounts. The other accounts can then associate VPCs with the configuration. The query logs that Resolver creates for a configuration include all DNS queries that originate in all VPCs that are associated with the configuration.
   */
  createResolverQueryLogConfig(params: Route53Resolver.Types.CreateResolverQueryLogConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.CreateResolverQueryLogConfigResponse) => void): Request<Route53Resolver.Types.CreateResolverQueryLogConfigResponse, AWSError>;
  /**
   * Creates a Resolver query logging configuration, which defines where you want Resolver to save DNS query logs that originate in your VPCs. Resolver can log queries only for VPCs that are in the same Region as the query logging configuration. To specify which VPCs you want to log queries for, you use AssociateResolverQueryLogConfig. For more information, see AssociateResolverQueryLogConfig.  You can optionally use Resource Access Manager (RAM) to share a query logging configuration with other Amazon Web Services accounts. The other accounts can then associate VPCs with the configuration. The query logs that Resolver creates for a configuration include all DNS queries that originate in all VPCs that are associated with the configuration.
   */
  createResolverQueryLogConfig(callback?: (err: AWSError, data: Route53Resolver.Types.CreateResolverQueryLogConfigResponse) => void): Request<Route53Resolver.Types.CreateResolverQueryLogConfigResponse, AWSError>;
  /**
   * For DNS queries that originate in your VPCs, specifies which Resolver endpoint the queries pass through, one domain name that you want to forward to your network, and the IP addresses of the DNS resolvers in your network.
   */
  createResolverRule(params: Route53Resolver.Types.CreateResolverRuleRequest, callback?: (err: AWSError, data: Route53Resolver.Types.CreateResolverRuleResponse) => void): Request<Route53Resolver.Types.CreateResolverRuleResponse, AWSError>;
  /**
   * For DNS queries that originate in your VPCs, specifies which Resolver endpoint the queries pass through, one domain name that you want to forward to your network, and the IP addresses of the DNS resolvers in your network.
   */
  createResolverRule(callback?: (err: AWSError, data: Route53Resolver.Types.CreateResolverRuleResponse) => void): Request<Route53Resolver.Types.CreateResolverRuleResponse, AWSError>;
  /**
   * Deletes the specified domain list. 
   */
  deleteFirewallDomainList(params: Route53Resolver.Types.DeleteFirewallDomainListRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DeleteFirewallDomainListResponse) => void): Request<Route53Resolver.Types.DeleteFirewallDomainListResponse, AWSError>;
  /**
   * Deletes the specified domain list. 
   */
  deleteFirewallDomainList(callback?: (err: AWSError, data: Route53Resolver.Types.DeleteFirewallDomainListResponse) => void): Request<Route53Resolver.Types.DeleteFirewallDomainListResponse, AWSError>;
  /**
   * Deletes the specified firewall rule.
   */
  deleteFirewallRule(params: Route53Resolver.Types.DeleteFirewallRuleRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DeleteFirewallRuleResponse) => void): Request<Route53Resolver.Types.DeleteFirewallRuleResponse, AWSError>;
  /**
   * Deletes the specified firewall rule.
   */
  deleteFirewallRule(callback?: (err: AWSError, data: Route53Resolver.Types.DeleteFirewallRuleResponse) => void): Request<Route53Resolver.Types.DeleteFirewallRuleResponse, AWSError>;
  /**
   * Deletes the specified firewall rule group. 
   */
  deleteFirewallRuleGroup(params: Route53Resolver.Types.DeleteFirewallRuleGroupRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DeleteFirewallRuleGroupResponse) => void): Request<Route53Resolver.Types.DeleteFirewallRuleGroupResponse, AWSError>;
  /**
   * Deletes the specified firewall rule group. 
   */
  deleteFirewallRuleGroup(callback?: (err: AWSError, data: Route53Resolver.Types.DeleteFirewallRuleGroupResponse) => void): Request<Route53Resolver.Types.DeleteFirewallRuleGroupResponse, AWSError>;
  /**
   * Deletes a Resolver on the Outpost.
   */
  deleteOutpostResolver(params: Route53Resolver.Types.DeleteOutpostResolverRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DeleteOutpostResolverResponse) => void): Request<Route53Resolver.Types.DeleteOutpostResolverResponse, AWSError>;
  /**
   * Deletes a Resolver on the Outpost.
   */
  deleteOutpostResolver(callback?: (err: AWSError, data: Route53Resolver.Types.DeleteOutpostResolverResponse) => void): Request<Route53Resolver.Types.DeleteOutpostResolverResponse, AWSError>;
  /**
   * Deletes a Resolver endpoint. The effect of deleting a Resolver endpoint depends on whether it's an inbound or an outbound Resolver endpoint:    Inbound: DNS queries from your network are no longer routed to the DNS service for the specified VPC.    Outbound: DNS queries from a VPC are no longer routed to your network.  
   */
  deleteResolverEndpoint(params: Route53Resolver.Types.DeleteResolverEndpointRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DeleteResolverEndpointResponse) => void): Request<Route53Resolver.Types.DeleteResolverEndpointResponse, AWSError>;
  /**
   * Deletes a Resolver endpoint. The effect of deleting a Resolver endpoint depends on whether it's an inbound or an outbound Resolver endpoint:    Inbound: DNS queries from your network are no longer routed to the DNS service for the specified VPC.    Outbound: DNS queries from a VPC are no longer routed to your network.  
   */
  deleteResolverEndpoint(callback?: (err: AWSError, data: Route53Resolver.Types.DeleteResolverEndpointResponse) => void): Request<Route53Resolver.Types.DeleteResolverEndpointResponse, AWSError>;
  /**
   * Deletes a query logging configuration. When you delete a configuration, Resolver stops logging DNS queries for all of the Amazon VPCs that are associated with the configuration. This also applies if the query logging configuration is shared with other Amazon Web Services accounts, and the other accounts have associated VPCs with the shared configuration. Before you can delete a query logging configuration, you must first disassociate all VPCs from the configuration. See DisassociateResolverQueryLogConfig. If you used Resource Access Manager (RAM) to share a query logging configuration with other accounts, you must stop sharing the configuration before you can delete a configuration. The accounts that you shared the configuration with can first disassociate VPCs that they associated with the configuration, but that's not necessary. If you stop sharing the configuration, those VPCs are automatically disassociated from the configuration.
   */
  deleteResolverQueryLogConfig(params: Route53Resolver.Types.DeleteResolverQueryLogConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DeleteResolverQueryLogConfigResponse) => void): Request<Route53Resolver.Types.DeleteResolverQueryLogConfigResponse, AWSError>;
  /**
   * Deletes a query logging configuration. When you delete a configuration, Resolver stops logging DNS queries for all of the Amazon VPCs that are associated with the configuration. This also applies if the query logging configuration is shared with other Amazon Web Services accounts, and the other accounts have associated VPCs with the shared configuration. Before you can delete a query logging configuration, you must first disassociate all VPCs from the configuration. See DisassociateResolverQueryLogConfig. If you used Resource Access Manager (RAM) to share a query logging configuration with other accounts, you must stop sharing the configuration before you can delete a configuration. The accounts that you shared the configuration with can first disassociate VPCs that they associated with the configuration, but that's not necessary. If you stop sharing the configuration, those VPCs are automatically disassociated from the configuration.
   */
  deleteResolverQueryLogConfig(callback?: (err: AWSError, data: Route53Resolver.Types.DeleteResolverQueryLogConfigResponse) => void): Request<Route53Resolver.Types.DeleteResolverQueryLogConfigResponse, AWSError>;
  /**
   * Deletes a Resolver rule. Before you can delete a Resolver rule, you must disassociate it from all the VPCs that you associated the Resolver rule with. For more information, see DisassociateResolverRule.
   */
  deleteResolverRule(params: Route53Resolver.Types.DeleteResolverRuleRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DeleteResolverRuleResponse) => void): Request<Route53Resolver.Types.DeleteResolverRuleResponse, AWSError>;
  /**
   * Deletes a Resolver rule. Before you can delete a Resolver rule, you must disassociate it from all the VPCs that you associated the Resolver rule with. For more information, see DisassociateResolverRule.
   */
  deleteResolverRule(callback?: (err: AWSError, data: Route53Resolver.Types.DeleteResolverRuleResponse) => void): Request<Route53Resolver.Types.DeleteResolverRuleResponse, AWSError>;
  /**
   * Disassociates a FirewallRuleGroup from a VPC, to remove DNS filtering from the VPC. 
   */
  disassociateFirewallRuleGroup(params: Route53Resolver.Types.DisassociateFirewallRuleGroupRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DisassociateFirewallRuleGroupResponse) => void): Request<Route53Resolver.Types.DisassociateFirewallRuleGroupResponse, AWSError>;
  /**
   * Disassociates a FirewallRuleGroup from a VPC, to remove DNS filtering from the VPC. 
   */
  disassociateFirewallRuleGroup(callback?: (err: AWSError, data: Route53Resolver.Types.DisassociateFirewallRuleGroupResponse) => void): Request<Route53Resolver.Types.DisassociateFirewallRuleGroupResponse, AWSError>;
  /**
   * Removes IP addresses from an inbound or an outbound Resolver endpoint. If you want to remove more than one IP address, submit one DisassociateResolverEndpointIpAddress request for each IP address. To add an IP address to an endpoint, see AssociateResolverEndpointIpAddress. 
   */
  disassociateResolverEndpointIpAddress(params: Route53Resolver.Types.DisassociateResolverEndpointIpAddressRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DisassociateResolverEndpointIpAddressResponse) => void): Request<Route53Resolver.Types.DisassociateResolverEndpointIpAddressResponse, AWSError>;
  /**
   * Removes IP addresses from an inbound or an outbound Resolver endpoint. If you want to remove more than one IP address, submit one DisassociateResolverEndpointIpAddress request for each IP address. To add an IP address to an endpoint, see AssociateResolverEndpointIpAddress. 
   */
  disassociateResolverEndpointIpAddress(callback?: (err: AWSError, data: Route53Resolver.Types.DisassociateResolverEndpointIpAddressResponse) => void): Request<Route53Resolver.Types.DisassociateResolverEndpointIpAddressResponse, AWSError>;
  /**
   * Disassociates a VPC from a query logging configuration.  Before you can delete a query logging configuration, you must first disassociate all VPCs from the configuration. If you used Resource Access Manager (RAM) to share a query logging configuration with other accounts, VPCs can be disassociated from the configuration in the following ways:   The accounts that you shared the configuration with can disassociate VPCs from the configuration.   You can stop sharing the configuration.   
   */
  disassociateResolverQueryLogConfig(params: Route53Resolver.Types.DisassociateResolverQueryLogConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DisassociateResolverQueryLogConfigResponse) => void): Request<Route53Resolver.Types.DisassociateResolverQueryLogConfigResponse, AWSError>;
  /**
   * Disassociates a VPC from a query logging configuration.  Before you can delete a query logging configuration, you must first disassociate all VPCs from the configuration. If you used Resource Access Manager (RAM) to share a query logging configuration with other accounts, VPCs can be disassociated from the configuration in the following ways:   The accounts that you shared the configuration with can disassociate VPCs from the configuration.   You can stop sharing the configuration.   
   */
  disassociateResolverQueryLogConfig(callback?: (err: AWSError, data: Route53Resolver.Types.DisassociateResolverQueryLogConfigResponse) => void): Request<Route53Resolver.Types.DisassociateResolverQueryLogConfigResponse, AWSError>;
  /**
   * Removes the association between a specified Resolver rule and a specified VPC.  If you disassociate a Resolver rule from a VPC, Resolver stops forwarding DNS queries for the domain name that you specified in the Resolver rule.  
   */
  disassociateResolverRule(params: Route53Resolver.Types.DisassociateResolverRuleRequest, callback?: (err: AWSError, data: Route53Resolver.Types.DisassociateResolverRuleResponse) => void): Request<Route53Resolver.Types.DisassociateResolverRuleResponse, AWSError>;
  /**
   * Removes the association between a specified Resolver rule and a specified VPC.  If you disassociate a Resolver rule from a VPC, Resolver stops forwarding DNS queries for the domain name that you specified in the Resolver rule.  
   */
  disassociateResolverRule(callback?: (err: AWSError, data: Route53Resolver.Types.DisassociateResolverRuleResponse) => void): Request<Route53Resolver.Types.DisassociateResolverRuleResponse, AWSError>;
  /**
   * Retrieves the configuration of the firewall behavior provided by DNS Firewall for a single VPC from Amazon Virtual Private Cloud (Amazon VPC). 
   */
  getFirewallConfig(params: Route53Resolver.Types.GetFirewallConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetFirewallConfigResponse) => void): Request<Route53Resolver.Types.GetFirewallConfigResponse, AWSError>;
  /**
   * Retrieves the configuration of the firewall behavior provided by DNS Firewall for a single VPC from Amazon Virtual Private Cloud (Amazon VPC). 
   */
  getFirewallConfig(callback?: (err: AWSError, data: Route53Resolver.Types.GetFirewallConfigResponse) => void): Request<Route53Resolver.Types.GetFirewallConfigResponse, AWSError>;
  /**
   * Retrieves the specified firewall domain list.
   */
  getFirewallDomainList(params: Route53Resolver.Types.GetFirewallDomainListRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetFirewallDomainListResponse) => void): Request<Route53Resolver.Types.GetFirewallDomainListResponse, AWSError>;
  /**
   * Retrieves the specified firewall domain list.
   */
  getFirewallDomainList(callback?: (err: AWSError, data: Route53Resolver.Types.GetFirewallDomainListResponse) => void): Request<Route53Resolver.Types.GetFirewallDomainListResponse, AWSError>;
  /**
   * Retrieves the specified firewall rule group. 
   */
  getFirewallRuleGroup(params: Route53Resolver.Types.GetFirewallRuleGroupRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetFirewallRuleGroupResponse) => void): Request<Route53Resolver.Types.GetFirewallRuleGroupResponse, AWSError>;
  /**
   * Retrieves the specified firewall rule group. 
   */
  getFirewallRuleGroup(callback?: (err: AWSError, data: Route53Resolver.Types.GetFirewallRuleGroupResponse) => void): Request<Route53Resolver.Types.GetFirewallRuleGroupResponse, AWSError>;
  /**
   * Retrieves a firewall rule group association, which enables DNS filtering for a VPC with one rule group. A VPC can have more than one firewall rule group association, and a rule group can be associated with more than one VPC.
   */
  getFirewallRuleGroupAssociation(params: Route53Resolver.Types.GetFirewallRuleGroupAssociationRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetFirewallRuleGroupAssociationResponse) => void): Request<Route53Resolver.Types.GetFirewallRuleGroupAssociationResponse, AWSError>;
  /**
   * Retrieves a firewall rule group association, which enables DNS filtering for a VPC with one rule group. A VPC can have more than one firewall rule group association, and a rule group can be associated with more than one VPC.
   */
  getFirewallRuleGroupAssociation(callback?: (err: AWSError, data: Route53Resolver.Types.GetFirewallRuleGroupAssociationResponse) => void): Request<Route53Resolver.Types.GetFirewallRuleGroupAssociationResponse, AWSError>;
  /**
   * Returns the Identity and Access Management (Amazon Web Services IAM) policy for sharing the specified rule group. You can use the policy to share the rule group using Resource Access Manager (RAM). 
   */
  getFirewallRuleGroupPolicy(params: Route53Resolver.Types.GetFirewallRuleGroupPolicyRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetFirewallRuleGroupPolicyResponse) => void): Request<Route53Resolver.Types.GetFirewallRuleGroupPolicyResponse, AWSError>;
  /**
   * Returns the Identity and Access Management (Amazon Web Services IAM) policy for sharing the specified rule group. You can use the policy to share the rule group using Resource Access Manager (RAM). 
   */
  getFirewallRuleGroupPolicy(callback?: (err: AWSError, data: Route53Resolver.Types.GetFirewallRuleGroupPolicyResponse) => void): Request<Route53Resolver.Types.GetFirewallRuleGroupPolicyResponse, AWSError>;
  /**
   * Gets information about a specified Resolver on the Outpost, such as its instance count and type, name, and the current status of the Resolver.
   */
  getOutpostResolver(params: Route53Resolver.Types.GetOutpostResolverRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetOutpostResolverResponse) => void): Request<Route53Resolver.Types.GetOutpostResolverResponse, AWSError>;
  /**
   * Gets information about a specified Resolver on the Outpost, such as its instance count and type, name, and the current status of the Resolver.
   */
  getOutpostResolver(callback?: (err: AWSError, data: Route53Resolver.Types.GetOutpostResolverResponse) => void): Request<Route53Resolver.Types.GetOutpostResolverResponse, AWSError>;
  /**
   * Retrieves the behavior configuration of Route 53 Resolver behavior for a single VPC from Amazon Virtual Private Cloud.
   */
  getResolverConfig(params: Route53Resolver.Types.GetResolverConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverConfigResponse) => void): Request<Route53Resolver.Types.GetResolverConfigResponse, AWSError>;
  /**
   * Retrieves the behavior configuration of Route 53 Resolver behavior for a single VPC from Amazon Virtual Private Cloud.
   */
  getResolverConfig(callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverConfigResponse) => void): Request<Route53Resolver.Types.GetResolverConfigResponse, AWSError>;
  /**
   * Gets DNSSEC validation information for a specified resource.
   */
  getResolverDnssecConfig(params: Route53Resolver.Types.GetResolverDnssecConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverDnssecConfigResponse) => void): Request<Route53Resolver.Types.GetResolverDnssecConfigResponse, AWSError>;
  /**
   * Gets DNSSEC validation information for a specified resource.
   */
  getResolverDnssecConfig(callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverDnssecConfigResponse) => void): Request<Route53Resolver.Types.GetResolverDnssecConfigResponse, AWSError>;
  /**
   * Gets information about a specified Resolver endpoint, such as whether it's an inbound or an outbound Resolver endpoint, and the current status of the endpoint.
   */
  getResolverEndpoint(params: Route53Resolver.Types.GetResolverEndpointRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverEndpointResponse) => void): Request<Route53Resolver.Types.GetResolverEndpointResponse, AWSError>;
  /**
   * Gets information about a specified Resolver endpoint, such as whether it's an inbound or an outbound Resolver endpoint, and the current status of the endpoint.
   */
  getResolverEndpoint(callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverEndpointResponse) => void): Request<Route53Resolver.Types.GetResolverEndpointResponse, AWSError>;
  /**
   * Gets information about a specified Resolver query logging configuration, such as the number of VPCs that the configuration is logging queries for and the location that logs are sent to. 
   */
  getResolverQueryLogConfig(params: Route53Resolver.Types.GetResolverQueryLogConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverQueryLogConfigResponse) => void): Request<Route53Resolver.Types.GetResolverQueryLogConfigResponse, AWSError>;
  /**
   * Gets information about a specified Resolver query logging configuration, such as the number of VPCs that the configuration is logging queries for and the location that logs are sent to. 
   */
  getResolverQueryLogConfig(callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverQueryLogConfigResponse) => void): Request<Route53Resolver.Types.GetResolverQueryLogConfigResponse, AWSError>;
  /**
   * Gets information about a specified association between a Resolver query logging configuration and an Amazon VPC. When you associate a VPC with a query logging configuration, Resolver logs DNS queries that originate in that VPC.
   */
  getResolverQueryLogConfigAssociation(params: Route53Resolver.Types.GetResolverQueryLogConfigAssociationRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverQueryLogConfigAssociationResponse) => void): Request<Route53Resolver.Types.GetResolverQueryLogConfigAssociationResponse, AWSError>;
  /**
   * Gets information about a specified association between a Resolver query logging configuration and an Amazon VPC. When you associate a VPC with a query logging configuration, Resolver logs DNS queries that originate in that VPC.
   */
  getResolverQueryLogConfigAssociation(callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverQueryLogConfigAssociationResponse) => void): Request<Route53Resolver.Types.GetResolverQueryLogConfigAssociationResponse, AWSError>;
  /**
   * Gets information about a query logging policy. A query logging policy specifies the Resolver query logging operations and resources that you want to allow another Amazon Web Services account to be able to use.
   */
  getResolverQueryLogConfigPolicy(params: Route53Resolver.Types.GetResolverQueryLogConfigPolicyRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverQueryLogConfigPolicyResponse) => void): Request<Route53Resolver.Types.GetResolverQueryLogConfigPolicyResponse, AWSError>;
  /**
   * Gets information about a query logging policy. A query logging policy specifies the Resolver query logging operations and resources that you want to allow another Amazon Web Services account to be able to use.
   */
  getResolverQueryLogConfigPolicy(callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverQueryLogConfigPolicyResponse) => void): Request<Route53Resolver.Types.GetResolverQueryLogConfigPolicyResponse, AWSError>;
  /**
   * Gets information about a specified Resolver rule, such as the domain name that the rule forwards DNS queries for and the ID of the outbound Resolver endpoint that the rule is associated with.
   */
  getResolverRule(params: Route53Resolver.Types.GetResolverRuleRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverRuleResponse) => void): Request<Route53Resolver.Types.GetResolverRuleResponse, AWSError>;
  /**
   * Gets information about a specified Resolver rule, such as the domain name that the rule forwards DNS queries for and the ID of the outbound Resolver endpoint that the rule is associated with.
   */
  getResolverRule(callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverRuleResponse) => void): Request<Route53Resolver.Types.GetResolverRuleResponse, AWSError>;
  /**
   * Gets information about an association between a specified Resolver rule and a VPC. You associate a Resolver rule and a VPC using AssociateResolverRule. 
   */
  getResolverRuleAssociation(params: Route53Resolver.Types.GetResolverRuleAssociationRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverRuleAssociationResponse) => void): Request<Route53Resolver.Types.GetResolverRuleAssociationResponse, AWSError>;
  /**
   * Gets information about an association between a specified Resolver rule and a VPC. You associate a Resolver rule and a VPC using AssociateResolverRule. 
   */
  getResolverRuleAssociation(callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverRuleAssociationResponse) => void): Request<Route53Resolver.Types.GetResolverRuleAssociationResponse, AWSError>;
  /**
   * Gets information about the Resolver rule policy for a specified rule. A Resolver rule policy includes the rule that you want to share with another account, the account that you want to share the rule with, and the Resolver operations that you want to allow the account to use. 
   */
  getResolverRulePolicy(params: Route53Resolver.Types.GetResolverRulePolicyRequest, callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverRulePolicyResponse) => void): Request<Route53Resolver.Types.GetResolverRulePolicyResponse, AWSError>;
  /**
   * Gets information about the Resolver rule policy for a specified rule. A Resolver rule policy includes the rule that you want to share with another account, the account that you want to share the rule with, and the Resolver operations that you want to allow the account to use. 
   */
  getResolverRulePolicy(callback?: (err: AWSError, data: Route53Resolver.Types.GetResolverRulePolicyResponse) => void): Request<Route53Resolver.Types.GetResolverRulePolicyResponse, AWSError>;
  /**
   * Imports domain names from a file into a domain list, for use in a DNS firewall rule group.  Each domain specification in your domain list must satisfy the following requirements:    It can optionally start with * (asterisk).   With the exception of the optional starting asterisk, it must only contain the following characters: A-Z, a-z, 0-9, - (hyphen).   It must be from 1-255 characters in length.   
   */
  importFirewallDomains(params: Route53Resolver.Types.ImportFirewallDomainsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ImportFirewallDomainsResponse) => void): Request<Route53Resolver.Types.ImportFirewallDomainsResponse, AWSError>;
  /**
   * Imports domain names from a file into a domain list, for use in a DNS firewall rule group.  Each domain specification in your domain list must satisfy the following requirements:    It can optionally start with * (asterisk).   With the exception of the optional starting asterisk, it must only contain the following characters: A-Z, a-z, 0-9, - (hyphen).   It must be from 1-255 characters in length.   
   */
  importFirewallDomains(callback?: (err: AWSError, data: Route53Resolver.Types.ImportFirewallDomainsResponse) => void): Request<Route53Resolver.Types.ImportFirewallDomainsResponse, AWSError>;
  /**
   * Retrieves the firewall configurations that you have defined. DNS Firewall uses the configurations to manage firewall behavior for your VPCs.  A single call might return only a partial list of the configurations. For information, see MaxResults. 
   */
  listFirewallConfigs(params: Route53Resolver.Types.ListFirewallConfigsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallConfigsResponse) => void): Request<Route53Resolver.Types.ListFirewallConfigsResponse, AWSError>;
  /**
   * Retrieves the firewall configurations that you have defined. DNS Firewall uses the configurations to manage firewall behavior for your VPCs.  A single call might return only a partial list of the configurations. For information, see MaxResults. 
   */
  listFirewallConfigs(callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallConfigsResponse) => void): Request<Route53Resolver.Types.ListFirewallConfigsResponse, AWSError>;
  /**
   * Retrieves the firewall domain lists that you have defined. For each firewall domain list, you can retrieve the domains that are defined for a list by calling ListFirewallDomains.  A single call to this list operation might return only a partial list of the domain lists. For information, see MaxResults. 
   */
  listFirewallDomainLists(params: Route53Resolver.Types.ListFirewallDomainListsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallDomainListsResponse) => void): Request<Route53Resolver.Types.ListFirewallDomainListsResponse, AWSError>;
  /**
   * Retrieves the firewall domain lists that you have defined. For each firewall domain list, you can retrieve the domains that are defined for a list by calling ListFirewallDomains.  A single call to this list operation might return only a partial list of the domain lists. For information, see MaxResults. 
   */
  listFirewallDomainLists(callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallDomainListsResponse) => void): Request<Route53Resolver.Types.ListFirewallDomainListsResponse, AWSError>;
  /**
   * Retrieves the domains that you have defined for the specified firewall domain list.  A single call might return only a partial list of the domains. For information, see MaxResults. 
   */
  listFirewallDomains(params: Route53Resolver.Types.ListFirewallDomainsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallDomainsResponse) => void): Request<Route53Resolver.Types.ListFirewallDomainsResponse, AWSError>;
  /**
   * Retrieves the domains that you have defined for the specified firewall domain list.  A single call might return only a partial list of the domains. For information, see MaxResults. 
   */
  listFirewallDomains(callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallDomainsResponse) => void): Request<Route53Resolver.Types.ListFirewallDomainsResponse, AWSError>;
  /**
   * Retrieves the firewall rule group associations that you have defined. Each association enables DNS filtering for a VPC with one rule group.  A single call might return only a partial list of the associations. For information, see MaxResults. 
   */
  listFirewallRuleGroupAssociations(params: Route53Resolver.Types.ListFirewallRuleGroupAssociationsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallRuleGroupAssociationsResponse) => void): Request<Route53Resolver.Types.ListFirewallRuleGroupAssociationsResponse, AWSError>;
  /**
   * Retrieves the firewall rule group associations that you have defined. Each association enables DNS filtering for a VPC with one rule group.  A single call might return only a partial list of the associations. For information, see MaxResults. 
   */
  listFirewallRuleGroupAssociations(callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallRuleGroupAssociationsResponse) => void): Request<Route53Resolver.Types.ListFirewallRuleGroupAssociationsResponse, AWSError>;
  /**
   * Retrieves the minimal high-level information for the rule groups that you have defined.  A single call might return only a partial list of the rule groups. For information, see MaxResults. 
   */
  listFirewallRuleGroups(params: Route53Resolver.Types.ListFirewallRuleGroupsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallRuleGroupsResponse) => void): Request<Route53Resolver.Types.ListFirewallRuleGroupsResponse, AWSError>;
  /**
   * Retrieves the minimal high-level information for the rule groups that you have defined.  A single call might return only a partial list of the rule groups. For information, see MaxResults. 
   */
  listFirewallRuleGroups(callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallRuleGroupsResponse) => void): Request<Route53Resolver.Types.ListFirewallRuleGroupsResponse, AWSError>;
  /**
   * Retrieves the firewall rules that you have defined for the specified firewall rule group. DNS Firewall uses the rules in a rule group to filter DNS network traffic for a VPC.  A single call might return only a partial list of the rules. For information, see MaxResults. 
   */
  listFirewallRules(params: Route53Resolver.Types.ListFirewallRulesRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallRulesResponse) => void): Request<Route53Resolver.Types.ListFirewallRulesResponse, AWSError>;
  /**
   * Retrieves the firewall rules that you have defined for the specified firewall rule group. DNS Firewall uses the rules in a rule group to filter DNS network traffic for a VPC.  A single call might return only a partial list of the rules. For information, see MaxResults. 
   */
  listFirewallRules(callback?: (err: AWSError, data: Route53Resolver.Types.ListFirewallRulesResponse) => void): Request<Route53Resolver.Types.ListFirewallRulesResponse, AWSError>;
  /**
   * Lists all the Resolvers on Outposts that were created using the current Amazon Web Services account.
   */
  listOutpostResolvers(params: Route53Resolver.Types.ListOutpostResolversRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListOutpostResolversResponse) => void): Request<Route53Resolver.Types.ListOutpostResolversResponse, AWSError>;
  /**
   * Lists all the Resolvers on Outposts that were created using the current Amazon Web Services account.
   */
  listOutpostResolvers(callback?: (err: AWSError, data: Route53Resolver.Types.ListOutpostResolversResponse) => void): Request<Route53Resolver.Types.ListOutpostResolversResponse, AWSError>;
  /**
   * Retrieves the Resolver configurations that you have defined. Route 53 Resolver uses the configurations to manage DNS resolution behavior for your VPCs.
   */
  listResolverConfigs(params: Route53Resolver.Types.ListResolverConfigsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverConfigsResponse) => void): Request<Route53Resolver.Types.ListResolverConfigsResponse, AWSError>;
  /**
   * Retrieves the Resolver configurations that you have defined. Route 53 Resolver uses the configurations to manage DNS resolution behavior for your VPCs.
   */
  listResolverConfigs(callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverConfigsResponse) => void): Request<Route53Resolver.Types.ListResolverConfigsResponse, AWSError>;
  /**
   * Lists the configurations for DNSSEC validation that are associated with the current Amazon Web Services account.
   */
  listResolverDnssecConfigs(params: Route53Resolver.Types.ListResolverDnssecConfigsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverDnssecConfigsResponse) => void): Request<Route53Resolver.Types.ListResolverDnssecConfigsResponse, AWSError>;
  /**
   * Lists the configurations for DNSSEC validation that are associated with the current Amazon Web Services account.
   */
  listResolverDnssecConfigs(callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverDnssecConfigsResponse) => void): Request<Route53Resolver.Types.ListResolverDnssecConfigsResponse, AWSError>;
  /**
   * Gets the IP addresses for a specified Resolver endpoint.
   */
  listResolverEndpointIpAddresses(params: Route53Resolver.Types.ListResolverEndpointIpAddressesRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverEndpointIpAddressesResponse) => void): Request<Route53Resolver.Types.ListResolverEndpointIpAddressesResponse, AWSError>;
  /**
   * Gets the IP addresses for a specified Resolver endpoint.
   */
  listResolverEndpointIpAddresses(callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverEndpointIpAddressesResponse) => void): Request<Route53Resolver.Types.ListResolverEndpointIpAddressesResponse, AWSError>;
  /**
   * Lists all the Resolver endpoints that were created using the current Amazon Web Services account.
   */
  listResolverEndpoints(params: Route53Resolver.Types.ListResolverEndpointsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverEndpointsResponse) => void): Request<Route53Resolver.Types.ListResolverEndpointsResponse, AWSError>;
  /**
   * Lists all the Resolver endpoints that were created using the current Amazon Web Services account.
   */
  listResolverEndpoints(callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverEndpointsResponse) => void): Request<Route53Resolver.Types.ListResolverEndpointsResponse, AWSError>;
  /**
   * Lists information about associations between Amazon VPCs and query logging configurations.
   */
  listResolverQueryLogConfigAssociations(params: Route53Resolver.Types.ListResolverQueryLogConfigAssociationsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverQueryLogConfigAssociationsResponse) => void): Request<Route53Resolver.Types.ListResolverQueryLogConfigAssociationsResponse, AWSError>;
  /**
   * Lists information about associations between Amazon VPCs and query logging configurations.
   */
  listResolverQueryLogConfigAssociations(callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverQueryLogConfigAssociationsResponse) => void): Request<Route53Resolver.Types.ListResolverQueryLogConfigAssociationsResponse, AWSError>;
  /**
   * Lists information about the specified query logging configurations. Each configuration defines where you want Resolver to save DNS query logs and specifies the VPCs that you want to log queries for.
   */
  listResolverQueryLogConfigs(params: Route53Resolver.Types.ListResolverQueryLogConfigsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverQueryLogConfigsResponse) => void): Request<Route53Resolver.Types.ListResolverQueryLogConfigsResponse, AWSError>;
  /**
   * Lists information about the specified query logging configurations. Each configuration defines where you want Resolver to save DNS query logs and specifies the VPCs that you want to log queries for.
   */
  listResolverQueryLogConfigs(callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverQueryLogConfigsResponse) => void): Request<Route53Resolver.Types.ListResolverQueryLogConfigsResponse, AWSError>;
  /**
   * Lists the associations that were created between Resolver rules and VPCs using the current Amazon Web Services account.
   */
  listResolverRuleAssociations(params: Route53Resolver.Types.ListResolverRuleAssociationsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverRuleAssociationsResponse) => void): Request<Route53Resolver.Types.ListResolverRuleAssociationsResponse, AWSError>;
  /**
   * Lists the associations that were created between Resolver rules and VPCs using the current Amazon Web Services account.
   */
  listResolverRuleAssociations(callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverRuleAssociationsResponse) => void): Request<Route53Resolver.Types.ListResolverRuleAssociationsResponse, AWSError>;
  /**
   * Lists the Resolver rules that were created using the current Amazon Web Services account.
   */
  listResolverRules(params: Route53Resolver.Types.ListResolverRulesRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverRulesResponse) => void): Request<Route53Resolver.Types.ListResolverRulesResponse, AWSError>;
  /**
   * Lists the Resolver rules that were created using the current Amazon Web Services account.
   */
  listResolverRules(callback?: (err: AWSError, data: Route53Resolver.Types.ListResolverRulesResponse) => void): Request<Route53Resolver.Types.ListResolverRulesResponse, AWSError>;
  /**
   * Lists the tags that you associated with the specified resource.
   */
  listTagsForResource(params: Route53Resolver.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Route53Resolver.Types.ListTagsForResourceResponse) => void): Request<Route53Resolver.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags that you associated with the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Route53Resolver.Types.ListTagsForResourceResponse) => void): Request<Route53Resolver.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Attaches an Identity and Access Management (Amazon Web Services IAM) policy for sharing the rule group. You can use the policy to share the rule group using Resource Access Manager (RAM). 
   */
  putFirewallRuleGroupPolicy(params: Route53Resolver.Types.PutFirewallRuleGroupPolicyRequest, callback?: (err: AWSError, data: Route53Resolver.Types.PutFirewallRuleGroupPolicyResponse) => void): Request<Route53Resolver.Types.PutFirewallRuleGroupPolicyResponse, AWSError>;
  /**
   * Attaches an Identity and Access Management (Amazon Web Services IAM) policy for sharing the rule group. You can use the policy to share the rule group using Resource Access Manager (RAM). 
   */
  putFirewallRuleGroupPolicy(callback?: (err: AWSError, data: Route53Resolver.Types.PutFirewallRuleGroupPolicyResponse) => void): Request<Route53Resolver.Types.PutFirewallRuleGroupPolicyResponse, AWSError>;
  /**
   * Specifies an Amazon Web Services account that you want to share a query logging configuration with, the query logging configuration that you want to share, and the operations that you want the account to be able to perform on the configuration.
   */
  putResolverQueryLogConfigPolicy(params: Route53Resolver.Types.PutResolverQueryLogConfigPolicyRequest, callback?: (err: AWSError, data: Route53Resolver.Types.PutResolverQueryLogConfigPolicyResponse) => void): Request<Route53Resolver.Types.PutResolverQueryLogConfigPolicyResponse, AWSError>;
  /**
   * Specifies an Amazon Web Services account that you want to share a query logging configuration with, the query logging configuration that you want to share, and the operations that you want the account to be able to perform on the configuration.
   */
  putResolverQueryLogConfigPolicy(callback?: (err: AWSError, data: Route53Resolver.Types.PutResolverQueryLogConfigPolicyResponse) => void): Request<Route53Resolver.Types.PutResolverQueryLogConfigPolicyResponse, AWSError>;
  /**
   * Specifies an Amazon Web Services rule that you want to share with another account, the account that you want to share the rule with, and the operations that you want the account to be able to perform on the rule.
   */
  putResolverRulePolicy(params: Route53Resolver.Types.PutResolverRulePolicyRequest, callback?: (err: AWSError, data: Route53Resolver.Types.PutResolverRulePolicyResponse) => void): Request<Route53Resolver.Types.PutResolverRulePolicyResponse, AWSError>;
  /**
   * Specifies an Amazon Web Services rule that you want to share with another account, the account that you want to share the rule with, and the operations that you want the account to be able to perform on the rule.
   */
  putResolverRulePolicy(callback?: (err: AWSError, data: Route53Resolver.Types.PutResolverRulePolicyResponse) => void): Request<Route53Resolver.Types.PutResolverRulePolicyResponse, AWSError>;
  /**
   * Adds one or more tags to a specified resource.
   */
  tagResource(params: Route53Resolver.Types.TagResourceRequest, callback?: (err: AWSError, data: Route53Resolver.Types.TagResourceResponse) => void): Request<Route53Resolver.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more tags to a specified resource.
   */
  tagResource(callback?: (err: AWSError, data: Route53Resolver.Types.TagResourceResponse) => void): Request<Route53Resolver.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a specified resource.
   */
  untagResource(params: Route53Resolver.Types.UntagResourceRequest, callback?: (err: AWSError, data: Route53Resolver.Types.UntagResourceResponse) => void): Request<Route53Resolver.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a specified resource.
   */
  untagResource(callback?: (err: AWSError, data: Route53Resolver.Types.UntagResourceResponse) => void): Request<Route53Resolver.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the configuration of the firewall behavior provided by DNS Firewall for a single VPC from Amazon Virtual Private Cloud (Amazon VPC). 
   */
  updateFirewallConfig(params: Route53Resolver.Types.UpdateFirewallConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.UpdateFirewallConfigResponse) => void): Request<Route53Resolver.Types.UpdateFirewallConfigResponse, AWSError>;
  /**
   * Updates the configuration of the firewall behavior provided by DNS Firewall for a single VPC from Amazon Virtual Private Cloud (Amazon VPC). 
   */
  updateFirewallConfig(callback?: (err: AWSError, data: Route53Resolver.Types.UpdateFirewallConfigResponse) => void): Request<Route53Resolver.Types.UpdateFirewallConfigResponse, AWSError>;
  /**
   * Updates the firewall domain list from an array of domain specifications. 
   */
  updateFirewallDomains(params: Route53Resolver.Types.UpdateFirewallDomainsRequest, callback?: (err: AWSError, data: Route53Resolver.Types.UpdateFirewallDomainsResponse) => void): Request<Route53Resolver.Types.UpdateFirewallDomainsResponse, AWSError>;
  /**
   * Updates the firewall domain list from an array of domain specifications. 
   */
  updateFirewallDomains(callback?: (err: AWSError, data: Route53Resolver.Types.UpdateFirewallDomainsResponse) => void): Request<Route53Resolver.Types.UpdateFirewallDomainsResponse, AWSError>;
  /**
   * Updates the specified firewall rule. 
   */
  updateFirewallRule(params: Route53Resolver.Types.UpdateFirewallRuleRequest, callback?: (err: AWSError, data: Route53Resolver.Types.UpdateFirewallRuleResponse) => void): Request<Route53Resolver.Types.UpdateFirewallRuleResponse, AWSError>;
  /**
   * Updates the specified firewall rule. 
   */
  updateFirewallRule(callback?: (err: AWSError, data: Route53Resolver.Types.UpdateFirewallRuleResponse) => void): Request<Route53Resolver.Types.UpdateFirewallRuleResponse, AWSError>;
  /**
   * Changes the association of a FirewallRuleGroup with a VPC. The association enables DNS filtering for the VPC. 
   */
  updateFirewallRuleGroupAssociation(params: Route53Resolver.Types.UpdateFirewallRuleGroupAssociationRequest, callback?: (err: AWSError, data: Route53Resolver.Types.UpdateFirewallRuleGroupAssociationResponse) => void): Request<Route53Resolver.Types.UpdateFirewallRuleGroupAssociationResponse, AWSError>;
  /**
   * Changes the association of a FirewallRuleGroup with a VPC. The association enables DNS filtering for the VPC. 
   */
  updateFirewallRuleGroupAssociation(callback?: (err: AWSError, data: Route53Resolver.Types.UpdateFirewallRuleGroupAssociationResponse) => void): Request<Route53Resolver.Types.UpdateFirewallRuleGroupAssociationResponse, AWSError>;
  /**
   * You can use UpdateOutpostResolver to update the instance count, type, or name of a Resolver on an Outpost.
   */
  updateOutpostResolver(params: Route53Resolver.Types.UpdateOutpostResolverRequest, callback?: (err: AWSError, data: Route53Resolver.Types.UpdateOutpostResolverResponse) => void): Request<Route53Resolver.Types.UpdateOutpostResolverResponse, AWSError>;
  /**
   * You can use UpdateOutpostResolver to update the instance count, type, or name of a Resolver on an Outpost.
   */
  updateOutpostResolver(callback?: (err: AWSError, data: Route53Resolver.Types.UpdateOutpostResolverResponse) => void): Request<Route53Resolver.Types.UpdateOutpostResolverResponse, AWSError>;
  /**
   * Updates the behavior configuration of Route 53 Resolver behavior for a single VPC from Amazon Virtual Private Cloud.
   */
  updateResolverConfig(params: Route53Resolver.Types.UpdateResolverConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.UpdateResolverConfigResponse) => void): Request<Route53Resolver.Types.UpdateResolverConfigResponse, AWSError>;
  /**
   * Updates the behavior configuration of Route 53 Resolver behavior for a single VPC from Amazon Virtual Private Cloud.
   */
  updateResolverConfig(callback?: (err: AWSError, data: Route53Resolver.Types.UpdateResolverConfigResponse) => void): Request<Route53Resolver.Types.UpdateResolverConfigResponse, AWSError>;
  /**
   * Updates an existing DNSSEC validation configuration. If there is no existing DNSSEC validation configuration, one is created.
   */
  updateResolverDnssecConfig(params: Route53Resolver.Types.UpdateResolverDnssecConfigRequest, callback?: (err: AWSError, data: Route53Resolver.Types.UpdateResolverDnssecConfigResponse) => void): Request<Route53Resolver.Types.UpdateResolverDnssecConfigResponse, AWSError>;
  /**
   * Updates an existing DNSSEC validation configuration. If there is no existing DNSSEC validation configuration, one is created.
   */
  updateResolverDnssecConfig(callback?: (err: AWSError, data: Route53Resolver.Types.UpdateResolverDnssecConfigResponse) => void): Request<Route53Resolver.Types.UpdateResolverDnssecConfigResponse, AWSError>;
  /**
   * Updates the name, or enpoint type for an inbound or an outbound Resolver endpoint. You can only update between IPV4 and DUALSTACK, IPV6 endpoint type can't be updated to other type. 
   */
  updateResolverEndpoint(params: Route53Resolver.Types.UpdateResolverEndpointRequest, callback?: (err: AWSError, data: Route53Resolver.Types.UpdateResolverEndpointResponse) => void): Request<Route53Resolver.Types.UpdateResolverEndpointResponse, AWSError>;
  /**
   * Updates the name, or enpoint type for an inbound or an outbound Resolver endpoint. You can only update between IPV4 and DUALSTACK, IPV6 endpoint type can't be updated to other type. 
   */
  updateResolverEndpoint(callback?: (err: AWSError, data: Route53Resolver.Types.UpdateResolverEndpointResponse) => void): Request<Route53Resolver.Types.UpdateResolverEndpointResponse, AWSError>;
  /**
   * Updates settings for a specified Resolver rule. ResolverRuleId is required, and all other parameters are optional. If you don't specify a parameter, it retains its current value.
   */
  updateResolverRule(params: Route53Resolver.Types.UpdateResolverRuleRequest, callback?: (err: AWSError, data: Route53Resolver.Types.UpdateResolverRuleResponse) => void): Request<Route53Resolver.Types.UpdateResolverRuleResponse, AWSError>;
  /**
   * Updates settings for a specified Resolver rule. ResolverRuleId is required, and all other parameters are optional. If you don't specify a parameter, it retains its current value.
   */
  updateResolverRule(callback?: (err: AWSError, data: Route53Resolver.Types.UpdateResolverRuleResponse) => void): Request<Route53Resolver.Types.UpdateResolverRuleResponse, AWSError>;
}
declare namespace Route53Resolver {
  export type AccountId = string;
  export type Action = "ALLOW"|"BLOCK"|"ALERT"|string;
  export type Arn = string;
  export interface AssociateFirewallRuleGroupRequest {
    /**
     * A unique string that identifies the request and that allows failed requests to be retried without the risk of running the operation twice. CreatorRequestId can be any unique string, for example, a date/time stamp. 
     */
    CreatorRequestId: CreatorRequestId;
    /**
     * The unique identifier of the firewall rule group. 
     */
    FirewallRuleGroupId: ResourceId;
    /**
     * The unique identifier of the VPC that you want to associate with the rule group. 
     */
    VpcId: ResourceId;
    /**
     * The setting that determines the processing order of the rule group among the rule groups that you associate with the specified VPC. DNS Firewall filters VPC traffic starting from the rule group with the lowest numeric priority setting.  You must specify a unique priority for each rule group that you associate with a single VPC. To make it easier to insert rule groups later, leave space between the numbers, for example, use 101, 200, and so on. You can change the priority setting for a rule group association after you create it. The allowed values for Priority are between 100 and 9900.
     */
    Priority: Priority;
    /**
     * A name that lets you identify the association, to manage and use it.
     */
    Name: Name;
    /**
     * If enabled, this setting disallows modification or removal of the association, to help prevent against accidentally altering DNS firewall protections. When you create the association, the default setting is DISABLED. 
     */
    MutationProtection?: MutationProtectionStatus;
    /**
     * A list of the tag keys and values that you want to associate with the rule group association. 
     */
    Tags?: TagList;
  }
  export interface AssociateFirewallRuleGroupResponse {
    /**
     * The association that you just created. The association has an ID that you can use to identify it in other requests, like update and delete.
     */
    FirewallRuleGroupAssociation?: FirewallRuleGroupAssociation;
  }
  export interface AssociateResolverEndpointIpAddressRequest {
    /**
     * The ID of the Resolver endpoint that you want to associate IP addresses with.
     */
    ResolverEndpointId: ResourceId;
    /**
     * Either the IPv4 address that you want to add to a Resolver endpoint or a subnet ID. If you specify a subnet ID, Resolver chooses an IP address for you from the available IPs in the specified subnet.
     */
    IpAddress: IpAddressUpdate;
  }
  export interface AssociateResolverEndpointIpAddressResponse {
    /**
     * The response to an AssociateResolverEndpointIpAddress request.
     */
    ResolverEndpoint?: ResolverEndpoint;
  }
  export interface AssociateResolverQueryLogConfigRequest {
    /**
     * The ID of the query logging configuration that you want to associate a VPC with.
     */
    ResolverQueryLogConfigId: ResourceId;
    /**
     * The ID of an Amazon VPC that you want this query logging configuration to log queries for.  The VPCs and the query logging configuration must be in the same Region. 
     */
    ResourceId: ResourceId;
  }
  export interface AssociateResolverQueryLogConfigResponse {
    /**
     * A complex type that contains settings for a specified association between an Amazon VPC and a query logging configuration.
     */
    ResolverQueryLogConfigAssociation?: ResolverQueryLogConfigAssociation;
  }
  export interface AssociateResolverRuleRequest {
    /**
     * The ID of the Resolver rule that you want to associate with the VPC. To list the existing Resolver rules, use ListResolverRules.
     */
    ResolverRuleId: ResourceId;
    /**
     * A name for the association that you're creating between a Resolver rule and a VPC.
     */
    Name?: Name;
    /**
     * The ID of the VPC that you want to associate the Resolver rule with.
     */
    VPCId: ResourceId;
  }
  export interface AssociateResolverRuleResponse {
    /**
     * Information about the AssociateResolverRule request, including the status of the request.
     */
    ResolverRuleAssociation?: ResolverRuleAssociation;
  }
  export type AutodefinedReverseFlag = "ENABLE"|"DISABLE"|"USE_LOCAL_RESOURCE_SETTING"|string;
  export type BlockOverrideDnsType = "CNAME"|string;
  export type BlockOverrideDomain = string;
  export type BlockOverrideTtl = number;
  export type BlockResponse = "NODATA"|"NXDOMAIN"|"OVERRIDE"|string;
  export type Boolean = boolean;
  export type Count = number;
  export interface CreateFirewallDomainListRequest {
    /**
     * A unique string that identifies the request and that allows you to retry failed requests without the risk of running the operation twice. CreatorRequestId can be any unique string, for example, a date/time stamp. 
     */
    CreatorRequestId: CreatorRequestId;
    /**
     * A name that lets you identify the domain list to manage and use it.
     */
    Name: Name;
    /**
     * A list of the tag keys and values that you want to associate with the domain list. 
     */
    Tags?: TagList;
  }
  export interface CreateFirewallDomainListResponse {
    /**
     * The domain list that you just created.
     */
    FirewallDomainList?: FirewallDomainList;
  }
  export interface CreateFirewallRuleGroupRequest {
    /**
     * A unique string defined by you to identify the request. This allows you to retry failed requests without the risk of running the operation twice. This can be any unique string, for example, a timestamp. 
     */
    CreatorRequestId: CreatorRequestId;
    /**
     * A name that lets you identify the rule group, to manage and use it.
     */
    Name: Name;
    /**
     * A list of the tag keys and values that you want to associate with the rule group. 
     */
    Tags?: TagList;
  }
  export interface CreateFirewallRuleGroupResponse {
    /**
     * A collection of rules used to filter DNS network traffic. 
     */
    FirewallRuleGroup?: FirewallRuleGroup;
  }
  export interface CreateFirewallRuleRequest {
    /**
     * A unique string that identifies the request and that allows you to retry failed requests without the risk of running the operation twice. CreatorRequestId can be any unique string, for example, a date/time stamp. 
     */
    CreatorRequestId: CreatorRequestId;
    /**
     * The unique identifier of the firewall rule group where you want to create the rule. 
     */
    FirewallRuleGroupId: ResourceId;
    /**
     * The ID of the domain list that you want to use in the rule. 
     */
    FirewallDomainListId: ResourceId;
    /**
     * The setting that determines the processing order of the rule in the rule group. DNS Firewall processes the rules in a rule group by order of priority, starting from the lowest setting. You must specify a unique priority for each rule in a rule group. To make it easier to insert rules later, leave space between the numbers, for example, use 100, 200, and so on. You can change the priority setting for the rules in a rule group at any time.
     */
    Priority: Priority;
    /**
     * The action that DNS Firewall should take on a DNS query when it matches one of the domains in the rule's domain list:    ALLOW - Permit the request to go through.    ALERT - Permit the request and send metrics and logs to Cloud Watch.    BLOCK - Disallow the request. This option requires additional details in the rule's BlockResponse.   
     */
    Action: Action;
    /**
     * The way that you want DNS Firewall to block the request, used with the rule action setting BLOCK.     NODATA - Respond indicating that the query was successful, but no response is available for it.    NXDOMAIN - Respond indicating that the domain name that's in the query doesn't exist.    OVERRIDE - Provide a custom override in the response. This option requires custom handling details in the rule's BlockOverride* settings.    This setting is required if the rule action setting is BLOCK.
     */
    BlockResponse?: BlockResponse;
    /**
     * The custom DNS record to send back in response to the query. Used for the rule action BLOCK with a BlockResponse setting of OVERRIDE. This setting is required if the BlockResponse setting is OVERRIDE.
     */
    BlockOverrideDomain?: BlockOverrideDomain;
    /**
     * The DNS record's type. This determines the format of the record value that you provided in BlockOverrideDomain. Used for the rule action BLOCK with a BlockResponse setting of OVERRIDE. This setting is required if the BlockResponse setting is OVERRIDE.
     */
    BlockOverrideDnsType?: BlockOverrideDnsType;
    /**
     * The recommended amount of time, in seconds, for the DNS resolver or web browser to cache the provided override record. Used for the rule action BLOCK with a BlockResponse setting of OVERRIDE. This setting is required if the BlockResponse setting is OVERRIDE.
     */
    BlockOverrideTtl?: BlockOverrideTtl;
    /**
     * A name that lets you identify the rule in the rule group.
     */
    Name: Name;
  }
  export interface CreateFirewallRuleResponse {
    /**
     * The firewall rule that you just created. 
     */
    FirewallRule?: FirewallRule;
  }
  export interface CreateOutpostResolverRequest {
    /**
     * A unique string that identifies the request and that allows failed requests to be retried without the risk of running the operation twice.   CreatorRequestId can be any unique string, for example, a date/time stamp.
     */
    CreatorRequestId: CreatorRequestId;
    /**
     * A friendly name that lets you easily find a configuration in the Resolver dashboard in the Route 53 console.
     */
    Name: OutpostResolverName;
    /**
     * Number of Amazon EC2 instances for the Resolver on Outpost. The default and minimal value is 4.
     */
    InstanceCount?: InstanceCount;
    /**
     *  The Amazon EC2 instance type. If you specify this, you must also specify a value for the OutpostArn. 
     */
    PreferredInstanceType: OutpostInstanceType;
    /**
     * The Amazon Resource Name (ARN) of the Outpost. If you specify this, you must also specify a value for the PreferredInstanceType.
     */
    OutpostArn: OutpostArn;
    /**
     *  A string that helps identify the Route 53 Resolvers on Outpost. 
     */
    Tags?: TagList;
  }
  export interface CreateOutpostResolverResponse {
    /**
     * Information about the CreateOutpostResolver request, including the status of the request.
     */
    OutpostResolver?: OutpostResolver;
  }
  export interface CreateResolverEndpointRequest {
    /**
     * A unique string that identifies the request and that allows failed requests to be retried without the risk of running the operation twice. CreatorRequestId can be any unique string, for example, a date/time stamp. 
     */
    CreatorRequestId: CreatorRequestId;
    /**
     * A friendly name that lets you easily find a configuration in the Resolver dashboard in the Route 53 console.
     */
    Name?: Name;
    /**
     * The ID of one or more security groups that you want to use to control access to this VPC. The security group that you specify must include one or more inbound rules (for inbound Resolver endpoints) or outbound rules (for outbound Resolver endpoints). Inbound and outbound rules must allow TCP and UDP access. For inbound access, open port 53. For outbound access, open the port that you're using for DNS queries on your network.
     */
    SecurityGroupIds: SecurityGroupIds;
    /**
     * Specify the applicable value:    INBOUND: Resolver forwards DNS queries to the DNS service for a VPC from your network    OUTBOUND: Resolver forwards DNS queries from the DNS service for a VPC to your network  
     */
    Direction: ResolverEndpointDirection;
    /**
     * The subnets and IP addresses in your VPC that DNS queries originate from (for outbound endpoints) or that you forward DNS queries to (for inbound endpoints). The subnet ID uniquely identifies a VPC. 
     */
    IpAddresses: IpAddressesRequest;
    /**
     * A list of the tag keys and values that you want to associate with the endpoint.
     */
    Tags?: TagList;
    /**
     *  For the endpoint type you can choose either IPv4, IPv6, or dual-stack. A dual-stack endpoint means that it will resolve via both IPv4 and IPv6. This endpoint type is applied to all IP addresses. 
     */
    ResolverEndpointType?: ResolverEndpointType;
    /**
     * The Amazon Resource Name (ARN) of the Outpost. If you specify this, you must also specify a value for the PreferredInstanceType. 
     */
    OutpostArn?: OutpostArn;
    /**
     * The instance type. If you specify this, you must also specify a value for the OutpostArn.
     */
    PreferredInstanceType?: OutpostInstanceType;
  }
  export interface CreateResolverEndpointResponse {
    /**
     * Information about the CreateResolverEndpoint request, including the status of the request.
     */
    ResolverEndpoint?: ResolverEndpoint;
  }
  export interface CreateResolverQueryLogConfigRequest {
    /**
     * The name that you want to give the query logging configuration.
     */
    Name: ResolverQueryLogConfigName;
    /**
     * The ARN of the resource that you want Resolver to send query logs. You can send query logs to an S3 bucket, a CloudWatch Logs log group, or a Kinesis Data Firehose delivery stream. Examples of valid values include the following:    S3 bucket:   arn:aws:s3:::examplebucket  You can optionally append a file prefix to the end of the ARN.  arn:aws:s3:::examplebucket/development/     CloudWatch Logs log group:   arn:aws:logs:us-west-1:123456789012:log-group:/mystack-testgroup-12ABC1AB12A1:*     Kinesis Data Firehose delivery stream:  arn:aws:kinesis:us-east-2:0123456789:stream/my_stream_name   
     */
    DestinationArn: DestinationArn;
    /**
     * A unique string that identifies the request and that allows failed requests to be retried without the risk of running the operation twice. CreatorRequestId can be any unique string, for example, a date/time stamp. 
     */
    CreatorRequestId: CreatorRequestId;
    /**
     * A list of the tag keys and values that you want to associate with the query logging configuration.
     */
    Tags?: TagList;
  }
  export interface CreateResolverQueryLogConfigResponse {
    /**
     * Information about the CreateResolverQueryLogConfig request, including the status of the request.
     */
    ResolverQueryLogConfig?: ResolverQueryLogConfig;
  }
  export interface CreateResolverRuleRequest {
    /**
     * A unique string that identifies the request and that allows failed requests to be retried without the risk of running the operation twice. CreatorRequestId can be any unique string, for example, a date/time stamp. 
     */
    CreatorRequestId: CreatorRequestId;
    /**
     * A friendly name that lets you easily find a rule in the Resolver dashboard in the Route 53 console.
     */
    Name?: Name;
    /**
     * When you want to forward DNS queries for specified domain name to resolvers on your network, specify FORWARD. When you have a forwarding rule to forward DNS queries for a domain to your network and you want Resolver to process queries for a subdomain of that domain, specify SYSTEM. For example, to forward DNS queries for example.com to resolvers on your network, you create a rule and specify FORWARD for RuleType. To then have Resolver process queries for apex.example.com, you create a rule and specify SYSTEM for RuleType. Currently, only Resolver can create rules that have a value of RECURSIVE for RuleType.
     */
    RuleType: RuleTypeOption;
    /**
     * DNS queries for this domain name are forwarded to the IP addresses that you specify in TargetIps. If a query matches multiple Resolver rules (example.com and www.example.com), outbound DNS queries are routed using the Resolver rule that contains the most specific domain name (www.example.com).
     */
    DomainName: DomainName;
    /**
     * The IPs that you want Resolver to forward DNS queries to. You can specify either Ipv4 or Ipv6 addresses but not both in the same rule. Separate IP addresses with a space.  TargetIps is available only when the value of Rule type is FORWARD.
     */
    TargetIps?: TargetList;
    /**
     * The ID of the outbound Resolver endpoint that you want to use to route DNS queries to the IP addresses that you specify in TargetIps.
     */
    ResolverEndpointId?: ResourceId;
    /**
     * A list of the tag keys and values that you want to associate with the endpoint.
     */
    Tags?: TagList;
  }
  export interface CreateResolverRuleResponse {
    /**
     * Information about the CreateResolverRule request, including the status of the request.
     */
    ResolverRule?: ResolverRule;
  }
  export type CreatorRequestId = string;
  export interface DeleteFirewallDomainListRequest {
    /**
     * The ID of the domain list that you want to delete. 
     */
    FirewallDomainListId: ResourceId;
  }
  export interface DeleteFirewallDomainListResponse {
    /**
     * The domain list that you just deleted. 
     */
    FirewallDomainList?: FirewallDomainList;
  }
  export interface DeleteFirewallRuleGroupRequest {
    /**
     * The unique identifier of the firewall rule group that you want to delete. 
     */
    FirewallRuleGroupId: ResourceId;
  }
  export interface DeleteFirewallRuleGroupResponse {
    /**
     * A collection of rules used to filter DNS network traffic. 
     */
    FirewallRuleGroup?: FirewallRuleGroup;
  }
  export interface DeleteFirewallRuleRequest {
    /**
     * The unique identifier of the firewall rule group that you want to delete the rule from. 
     */
    FirewallRuleGroupId: ResourceId;
    /**
     * The ID of the domain list that's used in the rule. 
     */
    FirewallDomainListId: ResourceId;
  }
  export interface DeleteFirewallRuleResponse {
    /**
     * The specification for the firewall rule that you just deleted.
     */
    FirewallRule?: FirewallRule;
  }
  export interface DeleteOutpostResolverRequest {
    /**
     * A unique string that identifies the Resolver on the Outpost.
     */
    Id: ResourceId;
  }
  export interface DeleteOutpostResolverResponse {
    /**
     * Information about the DeleteOutpostResolver request, including the status of the request.
     */
    OutpostResolver?: OutpostResolver;
  }
  export interface DeleteResolverEndpointRequest {
    /**
     * The ID of the Resolver endpoint that you want to delete.
     */
    ResolverEndpointId: ResourceId;
  }
  export interface DeleteResolverEndpointResponse {
    /**
     * Information about the DeleteResolverEndpoint request, including the status of the request.
     */
    ResolverEndpoint?: ResolverEndpoint;
  }
  export interface DeleteResolverQueryLogConfigRequest {
    /**
     * The ID of the query logging configuration that you want to delete.
     */
    ResolverQueryLogConfigId: ResourceId;
  }
  export interface DeleteResolverQueryLogConfigResponse {
    /**
     * Information about the query logging configuration that you deleted, including the status of the request.
     */
    ResolverQueryLogConfig?: ResolverQueryLogConfig;
  }
  export interface DeleteResolverRuleRequest {
    /**
     * The ID of the Resolver rule that you want to delete.
     */
    ResolverRuleId: ResourceId;
  }
  export interface DeleteResolverRuleResponse {
    /**
     * Information about the DeleteResolverRule request, including the status of the request.
     */
    ResolverRule?: ResolverRule;
  }
  export type DestinationArn = string;
  export interface DisassociateFirewallRuleGroupRequest {
    /**
     * The identifier of the FirewallRuleGroupAssociation. 
     */
    FirewallRuleGroupAssociationId: ResourceId;
  }
  export interface DisassociateFirewallRuleGroupResponse {
    /**
     * The firewall rule group association that you just removed. 
     */
    FirewallRuleGroupAssociation?: FirewallRuleGroupAssociation;
  }
  export interface DisassociateResolverEndpointIpAddressRequest {
    /**
     * The ID of the Resolver endpoint that you want to disassociate an IP address from.
     */
    ResolverEndpointId: ResourceId;
    /**
     * The IPv4 address that you want to remove from a Resolver endpoint.
     */
    IpAddress: IpAddressUpdate;
  }
  export interface DisassociateResolverEndpointIpAddressResponse {
    /**
     * The response to an DisassociateResolverEndpointIpAddress request.
     */
    ResolverEndpoint?: ResolverEndpoint;
  }
  export interface DisassociateResolverQueryLogConfigRequest {
    /**
     * The ID of the query logging configuration that you want to disassociate a specified VPC from.
     */
    ResolverQueryLogConfigId: ResourceId;
    /**
     * The ID of the Amazon VPC that you want to disassociate from a specified query logging configuration.
     */
    ResourceId: ResourceId;
  }
  export interface DisassociateResolverQueryLogConfigResponse {
    /**
     * A complex type that contains settings for the association that you deleted between an Amazon VPC and a query logging configuration.
     */
    ResolverQueryLogConfigAssociation?: ResolverQueryLogConfigAssociation;
  }
  export interface DisassociateResolverRuleRequest {
    /**
     * The ID of the VPC that you want to disassociate the Resolver rule from.
     */
    VPCId: ResourceId;
    /**
     * The ID of the Resolver rule that you want to disassociate from the specified VPC.
     */
    ResolverRuleId: ResourceId;
  }
  export interface DisassociateResolverRuleResponse {
    /**
     * Information about the DisassociateResolverRule request, including the status of the request.
     */
    ResolverRuleAssociation?: ResolverRuleAssociation;
  }
  export type DomainListFileUrl = string;
  export type DomainName = string;
  export interface Filter {
    /**
     * The name of the parameter that you want to use to filter objects. The valid values for Name depend on the action that you're including the filter in, ListResolverEndpoints, ListResolverRules, ListResolverRuleAssociations, ListResolverQueryLogConfigs, or ListResolverQueryLogConfigAssociations.  In early versions of Resolver, values for Name were listed as uppercase, with underscore (_) delimiters. For example, CreatorRequestId was originally listed as CREATOR_REQUEST_ID. Uppercase values for Name are still supported.   ListResolverEndpoints  Valid values for Name include the following:    CreatorRequestId: The value that you specified when you created the Resolver endpoint.    Direction: Whether you want to return inbound or outbound Resolver endpoints. If you specify DIRECTION for Name, specify INBOUND or OUTBOUND for Values.    HostVPCId: The ID of the VPC that inbound DNS queries pass through on the way from your network to your VPCs in a region, or the VPC that outbound queries pass through on the way from your VPCs to your network. In a CreateResolverEndpoint request, SubnetId indirectly identifies the VPC. In a GetResolverEndpoint request, the VPC ID for a Resolver endpoint is returned in the HostVPCId element.     IpAddressCount: The number of IP addresses that you have associated with the Resolver endpoint.    Name: The name of the Resolver endpoint.    SecurityGroupIds: The IDs of the VPC security groups that you specified when you created the Resolver endpoint.    Status: The status of the Resolver endpoint. If you specify Status for Name, specify one of the following status codes for Values: CREATING, OPERATIONAL, UPDATING, AUTO_RECOVERING, ACTION_NEEDED, or DELETING. For more information, see Status in ResolverEndpoint.    ListResolverRules  Valid values for Name include the following:    CreatorRequestId: The value that you specified when you created the Resolver rule.    DomainName: The domain name for which Resolver is forwarding DNS queries to your network. In the value that you specify for Values, include a trailing dot (.) after the domain name. For example, if the domain name is example.com, specify the following value. Note the "." after com:  example.com.     Name: The name of the Resolver rule.    ResolverEndpointId: The ID of the Resolver endpoint that the Resolver rule is associated with.  You can filter on the Resolver endpoint only for rules that have a value of FORWARD for RuleType.     Status: The status of the Resolver rule. If you specify Status for Name, specify one of the following status codes for Values: COMPLETE, DELETING, UPDATING, or FAILED.    Type: The type of the Resolver rule. If you specify TYPE for Name, specify FORWARD or SYSTEM for Values.    ListResolverRuleAssociations  Valid values for Name include the following:    Name: The name of the Resolver rule association.    ResolverRuleId: The ID of the Resolver rule that is associated with one or more VPCs.    Status: The status of the Resolver rule association. If you specify Status for Name, specify one of the following status codes for Values: CREATING, COMPLETE, DELETING, or FAILED.    VPCId: The ID of the VPC that the Resolver rule is associated with.    ListResolverQueryLogConfigs  Valid values for Name include the following:    Arn: The ARN for the query logging configuration.    AssociationCount: The number of VPCs that are associated with the query logging configuration.    CreationTime: The date and time that the query logging configuration was created, in Unix time format and Coordinated Universal Time (UTC).     CreatorRequestId: A unique string that identifies the request that created the query logging configuration.    Destination: The Amazon Web Services service that you want to forward query logs to. Valid values include the following:    S3     CloudWatchLogs     KinesisFirehose       DestinationArn: The ARN of the location that Resolver is sending query logs to. This value can be the ARN for an S3 bucket, a CloudWatch Logs log group, or a Kinesis Data Firehose delivery stream.    Id: The ID of the query logging configuration    Name: The name of the query logging configuration    OwnerId: The Amazon Web Services account ID for the account that created the query logging configuration.    ShareStatus: An indication of whether the query logging configuration is shared with other Amazon Web Services accounts, or was shared with the current account by another Amazon Web Services account. Valid values include: NOT_SHARED, SHARED_WITH_ME, or SHARED_BY_ME.    Status: The status of the query logging configuration. If you specify Status for Name, specify the applicable status code for Values: CREATING, CREATED, DELETING, or FAILED. For more information, see Status.     ListResolverQueryLogConfigAssociations  Valid values for Name include the following:    CreationTime: The date and time that the VPC was associated with the query logging configuration, in Unix time format and Coordinated Universal Time (UTC).    Error: If the value of Status is FAILED, specify the cause: DESTINATION_NOT_FOUND or ACCESS_DENIED.    Id: The ID of the query logging association.    ResolverQueryLogConfigId: The ID of the query logging configuration that a VPC is associated with.    ResourceId: The ID of the Amazon VPC that is associated with the query logging configuration.    Status: The status of the query logging association. If you specify Status for Name, specify the applicable status code for Values: CREATING, CREATED, DELETING, or FAILED. For more information, see Status.   
     */
    Name?: FilterName;
    /**
     * When you're using a List operation and you want the operation to return a subset of objects, such as Resolver endpoints or Resolver rules, the value of the parameter that you want to use to filter objects. For example, to list only inbound Resolver endpoints, specify Direction for Name and specify INBOUND for Values.
     */
    Values?: FilterValues;
  }
  export type FilterName = string;
  export type FilterValue = string;
  export type FilterValues = FilterValue[];
  export type Filters = Filter[];
  export interface FirewallConfig {
    /**
     * The ID of the firewall configuration.
     */
    Id?: ResourceId;
    /**
     * The ID of the VPC that this firewall configuration applies to.
     */
    ResourceId?: ResourceId;
    /**
     * The Amazon Web Services account ID of the owner of the VPC that this firewall configuration applies to.
     */
    OwnerId?: AccountId;
    /**
     * Determines how DNS Firewall operates during failures, for example when all traffic that is sent to DNS Firewall fails to receive a reply.    By default, fail open is disabled, which means the failure mode is closed. This approach favors security over availability. DNS Firewall returns a failure error when it is unable to properly evaluate a query.    If you enable this option, the failure mode is open. This approach favors availability over security. DNS Firewall allows queries to proceed if it is unable to properly evaluate them.    This behavior is only enforced for VPCs that have at least one DNS Firewall rule group association. 
     */
    FirewallFailOpen?: FirewallFailOpenStatus;
  }
  export type FirewallConfigList = FirewallConfig[];
  export type FirewallDomainImportOperation = "REPLACE"|string;
  export interface FirewallDomainList {
    /**
     * The ID of the domain list. 
     */
    Id?: ResourceId;
    /**
     * The Amazon Resource Name (ARN) of the firewall domain list.
     */
    Arn?: Arn;
    /**
     * The name of the domain list. 
     */
    Name?: Name;
    /**
     * The number of domain names that are specified in the domain list.
     */
    DomainCount?: Unsigned;
    /**
     * The status of the domain list. 
     */
    Status?: FirewallDomainListStatus;
    /**
     * Additional information about the status of the list, if available.
     */
    StatusMessage?: StatusMessage;
    /**
     * The owner of the list, used only for lists that are not managed by you. For example, the managed domain list AWSManagedDomainsMalwareDomainList has the managed owner name Route 53 Resolver DNS Firewall.
     */
    ManagedOwnerName?: ServicePrinciple;
    /**
     * A unique string defined by you to identify the request. This allows you to retry failed requests without the risk of running the operation twice. This can be any unique string, for example, a timestamp. 
     */
    CreatorRequestId?: CreatorRequestId;
    /**
     * The date and time that the domain list was created, in Unix time format and Coordinated Universal Time (UTC). 
     */
    CreationTime?: Rfc3339TimeString;
    /**
     * The date and time that the domain list was last modified, in Unix time format and Coordinated Universal Time (UTC). 
     */
    ModificationTime?: Rfc3339TimeString;
  }
  export interface FirewallDomainListMetadata {
    /**
     * The ID of the domain list. 
     */
    Id?: ResourceId;
    /**
     * The Amazon Resource Name (ARN) of the firewall domain list metadata.
     */
    Arn?: Arn;
    /**
     * The name of the domain list. 
     */
    Name?: Name;
    /**
     * A unique string defined by you to identify the request. This allows you to retry failed requests without the risk of running the operation twice. This can be any unique string, for example, a timestamp. 
     */
    CreatorRequestId?: CreatorRequestId;
    /**
     * The owner of the list, used only for lists that are not managed by you. For example, the managed domain list AWSManagedDomainsMalwareDomainList has the managed owner name Route 53 Resolver DNS Firewall.
     */
    ManagedOwnerName?: ServicePrinciple;
  }
  export type FirewallDomainListMetadataList = FirewallDomainListMetadata[];
  export type FirewallDomainListStatus = "COMPLETE"|"COMPLETE_IMPORT_FAILED"|"IMPORTING"|"DELETING"|"UPDATING"|string;
  export type FirewallDomainName = string;
  export type FirewallDomainUpdateOperation = "ADD"|"REMOVE"|"REPLACE"|string;
  export type FirewallDomains = FirewallDomainName[];
  export type FirewallFailOpenStatus = "ENABLED"|"DISABLED"|"USE_LOCAL_RESOURCE_SETTING"|string;
  export interface FirewallRule {
    /**
     * The unique identifier of the firewall rule group of the rule. 
     */
    FirewallRuleGroupId?: ResourceId;
    /**
     * The ID of the domain list that's used in the rule. 
     */
    FirewallDomainListId?: ResourceId;
    /**
     * The name of the rule. 
     */
    Name?: Name;
    /**
     * The priority of the rule in the rule group. This value must be unique within the rule group. DNS Firewall processes the rules in a rule group by order of priority, starting from the lowest setting.
     */
    Priority?: Priority;
    /**
     * The action that DNS Firewall should take on a DNS query when it matches one of the domains in the rule's domain list:    ALLOW - Permit the request to go through.    ALERT - Permit the request to go through but send an alert to the logs.    BLOCK - Disallow the request. If this is specified, additional handling details are provided in the rule's BlockResponse setting.   
     */
    Action?: Action;
    /**
     * The way that you want DNS Firewall to block the request. Used for the rule action setting BLOCK.    NODATA - Respond indicating that the query was successful, but no response is available for it.    NXDOMAIN - Respond indicating that the domain name that's in the query doesn't exist.    OVERRIDE - Provide a custom override in the response. This option requires custom handling details in the rule's BlockOverride* settings.   
     */
    BlockResponse?: BlockResponse;
    /**
     * The custom DNS record to send back in response to the query. Used for the rule action BLOCK with a BlockResponse setting of OVERRIDE.
     */
    BlockOverrideDomain?: BlockOverrideDomain;
    /**
     * The DNS record's type. This determines the format of the record value that you provided in BlockOverrideDomain. Used for the rule action BLOCK with a BlockResponse setting of OVERRIDE.
     */
    BlockOverrideDnsType?: BlockOverrideDnsType;
    /**
     * The recommended amount of time, in seconds, for the DNS resolver or web browser to cache the provided override record. Used for the rule action BLOCK with a BlockResponse setting of OVERRIDE.
     */
    BlockOverrideTtl?: Unsigned;
    /**
     * A unique string defined by you to identify the request. This allows you to retry failed requests without the risk of executing the operation twice. This can be any unique string, for example, a timestamp. 
     */
    CreatorRequestId?: CreatorRequestId;
    /**
     * The date and time that the rule was created, in Unix time format and Coordinated Universal Time (UTC). 
     */
    CreationTime?: Rfc3339TimeString;
    /**
     * The date and time that the rule was last modified, in Unix time format and Coordinated Universal Time (UTC).
     */
    ModificationTime?: Rfc3339TimeString;
  }
  export interface FirewallRuleGroup {
    /**
     * The ID of the rule group. 
     */
    Id?: ResourceId;
    /**
     * The ARN (Amazon Resource Name) of the rule group.
     */
    Arn?: Arn;
    /**
     * The name of the rule group.
     */
    Name?: Name;
    /**
     * The number of rules in the rule group.
     */
    RuleCount?: Unsigned;
    /**
     * The status of the domain list. 
     */
    Status?: FirewallRuleGroupStatus;
    /**
     * Additional information about the status of the rule group, if available.
     */
    StatusMessage?: StatusMessage;
    /**
     * The Amazon Web Services account ID for the account that created the rule group. When a rule group is shared with your account, this is the account that has shared the rule group with you. 
     */
    OwnerId?: AccountId;
    /**
     * A unique string defined by you to identify the request. This allows you to retry failed requests without the risk of running the operation twice. This can be any unique string, for example, a timestamp. 
     */
    CreatorRequestId?: CreatorRequestId;
    /**
     * Whether the rule group is shared with other Amazon Web Services accounts, or was shared with the current account by another Amazon Web Services account. Sharing is configured through Resource Access Manager (RAM).
     */
    ShareStatus?: ShareStatus;
    /**
     * The date and time that the rule group was created, in Unix time format and Coordinated Universal Time (UTC). 
     */
    CreationTime?: Rfc3339TimeString;
    /**
     * The date and time that the rule group was last modified, in Unix time format and Coordinated Universal Time (UTC).
     */
    ModificationTime?: Rfc3339TimeString;
  }
  export interface FirewallRuleGroupAssociation {
    /**
     * The identifier for the association.
     */
    Id?: ResourceId;
    /**
     * The Amazon Resource Name (ARN) of the firewall rule group association.
     */
    Arn?: Arn;
    /**
     * The unique identifier of the firewall rule group. 
     */
    FirewallRuleGroupId?: ResourceId;
    /**
     * The unique identifier of the VPC that is associated with the rule group. 
     */
    VpcId?: ResourceId;
    /**
     * The name of the association.
     */
    Name?: Name;
    /**
     * The setting that determines the processing order of the rule group among the rule groups that are associated with a single VPC. DNS Firewall filters VPC traffic starting from rule group with the lowest numeric priority setting. 
     */
    Priority?: Priority;
    /**
     * If enabled, this setting disallows modification or removal of the association, to help prevent against accidentally altering DNS firewall protections. 
     */
    MutationProtection?: MutationProtectionStatus;
    /**
     * The owner of the association, used only for associations that are not managed by you. If you use Firewall Manager to manage your DNS Firewalls, then this reports Firewall Manager as the managed owner.
     */
    ManagedOwnerName?: ServicePrinciple;
    /**
     * The current status of the association.
     */
    Status?: FirewallRuleGroupAssociationStatus;
    /**
     * Additional information about the status of the response, if available.
     */
    StatusMessage?: StatusMessage;
    /**
     * A unique string defined by you to identify the request. This allows you to retry failed requests without the risk of running the operation twice. This can be any unique string, for example, a timestamp. 
     */
    CreatorRequestId?: CreatorRequestId;
    /**
     * The date and time that the association was created, in Unix time format and Coordinated Universal Time (UTC). 
     */
    CreationTime?: Rfc3339TimeString;
    /**
     * The date and time that the association was last modified, in Unix time format and Coordinated Universal Time (UTC).
     */
    ModificationTime?: Rfc3339TimeString;
  }
  export type FirewallRuleGroupAssociationStatus = "COMPLETE"|"DELETING"|"UPDATING"|string;
  export type FirewallRuleGroupAssociations = FirewallRuleGroupAssociation[];
  export interface FirewallRuleGroupMetadata {
    /**
     * The ID of the rule group. 
     */
    Id?: ResourceId;
    /**
     * The ARN (Amazon Resource Name) of the rule group.
     */
    Arn?: Arn;
    /**
     * The name of the rule group.
     */
    Name?: Name;
    /**
     * The Amazon Web Services account ID for the account that created the rule group. When a rule group is shared with your account, this is the account that has shared the rule group with you. 
     */
    OwnerId?: AccountId;
    /**
     * A unique string defined by you to identify the request. This allows you to retry failed requests without the risk of running the operation twice. This can be any unique string, for example, a timestamp. 
     */
    CreatorRequestId?: CreatorRequestId;
    /**
     * Whether the rule group is shared with other Amazon Web Services accounts, or was shared with the current account by another Amazon Web Services account. Sharing is configured through Resource Access Manager (RAM).
     */
    ShareStatus?: ShareStatus;
  }
  export type FirewallRuleGroupMetadataList = FirewallRuleGroupMetadata[];
  export type FirewallRuleGroupPolicy = string;
  export type FirewallRuleGroupStatus = "COMPLETE"|"DELETING"|"UPDATING"|string;
  export type FirewallRules = FirewallRule[];
  export interface GetFirewallConfigRequest {
    /**
     * The ID of the VPC from Amazon VPC that the configuration is for.
     */
    ResourceId: ResourceId;
  }
  export interface GetFirewallConfigResponse {
    /**
     * Configuration of the firewall behavior provided by DNS Firewall for a single VPC from AmazonVPC. 
     */
    FirewallConfig?: FirewallConfig;
  }
  export interface GetFirewallDomainListRequest {
    /**
     * The ID of the domain list. 
     */
    FirewallDomainListId: ResourceId;
  }
  export interface GetFirewallDomainListResponse {
    /**
     * The domain list that you requested. 
     */
    FirewallDomainList?: FirewallDomainList;
  }
  export interface GetFirewallRuleGroupAssociationRequest {
    /**
     * The identifier of the FirewallRuleGroupAssociation. 
     */
    FirewallRuleGroupAssociationId: ResourceId;
  }
  export interface GetFirewallRuleGroupAssociationResponse {
    /**
     * The association that you requested. 
     */
    FirewallRuleGroupAssociation?: FirewallRuleGroupAssociation;
  }
  export interface GetFirewallRuleGroupPolicyRequest {
    /**
     * The ARN (Amazon Resource Name) for the rule group.
     */
    Arn: Arn;
  }
  export interface GetFirewallRuleGroupPolicyResponse {
    /**
     * The Identity and Access Management (Amazon Web Services IAM) policy for sharing the specified rule group. You can use the policy to share the rule group using Resource Access Manager (RAM). 
     */
    FirewallRuleGroupPolicy?: FirewallRuleGroupPolicy;
  }
  export interface GetFirewallRuleGroupRequest {
    /**
     * The unique identifier of the firewall rule group. 
     */
    FirewallRuleGroupId: ResourceId;
  }
  export interface GetFirewallRuleGroupResponse {
    /**
     * A collection of rules used to filter DNS network traffic. 
     */
    FirewallRuleGroup?: FirewallRuleGroup;
  }
  export interface GetOutpostResolverRequest {
    /**
     * The ID of the Resolver on the Outpost.
     */
    Id: ResourceId;
  }
  export interface GetOutpostResolverResponse {
    /**
     * Information about the GetOutpostResolver request, including the status of the request.
     */
    OutpostResolver?: OutpostResolver;
  }
  export interface GetResolverConfigRequest {
    /**
     * Resource ID of the Amazon VPC that you want to get information about.
     */
    ResourceId: ResourceId;
  }
  export interface GetResolverConfigResponse {
    /**
     * Information about the behavior configuration of Route 53 Resolver behavior for the VPC you specified in the GetResolverConfig request.
     */
    ResolverConfig?: ResolverConfig;
  }
  export interface GetResolverDnssecConfigRequest {
    /**
     * The ID of the virtual private cloud (VPC) for the DNSSEC validation status.
     */
    ResourceId: ResourceId;
  }
  export interface GetResolverDnssecConfigResponse {
    /**
     * The information about a configuration for DNSSEC validation.
     */
    ResolverDNSSECConfig?: ResolverDnssecConfig;
  }
  export interface GetResolverEndpointRequest {
    /**
     * The ID of the Resolver endpoint that you want to get information about.
     */
    ResolverEndpointId: ResourceId;
  }
  export interface GetResolverEndpointResponse {
    /**
     * Information about the Resolver endpoint that you specified in a GetResolverEndpoint request.
     */
    ResolverEndpoint?: ResolverEndpoint;
  }
  export interface GetResolverQueryLogConfigAssociationRequest {
    /**
     * The ID of the Resolver query logging configuration association that you want to get information about.
     */
    ResolverQueryLogConfigAssociationId: ResourceId;
  }
  export interface GetResolverQueryLogConfigAssociationResponse {
    /**
     * Information about the Resolver query logging configuration association that you specified in a GetQueryLogConfigAssociation request.
     */
    ResolverQueryLogConfigAssociation?: ResolverQueryLogConfigAssociation;
  }
  export interface GetResolverQueryLogConfigPolicyRequest {
    /**
     * The ARN of the query logging configuration that you want to get the query logging policy for.
     */
    Arn: Arn;
  }
  export interface GetResolverQueryLogConfigPolicyResponse {
    /**
     * Information about the query logging policy for the query logging configuration that you specified in a GetResolverQueryLogConfigPolicy request.
     */
    ResolverQueryLogConfigPolicy?: ResolverQueryLogConfigPolicy;
  }
  export interface GetResolverQueryLogConfigRequest {
    /**
     * The ID of the Resolver query logging configuration that you want to get information about.
     */
    ResolverQueryLogConfigId: ResourceId;
  }
  export interface GetResolverQueryLogConfigResponse {
    /**
     * Information about the Resolver query logging configuration that you specified in a GetQueryLogConfig request.
     */
    ResolverQueryLogConfig?: ResolverQueryLogConfig;
  }
  export interface GetResolverRuleAssociationRequest {
    /**
     * The ID of the Resolver rule association that you want to get information about.
     */
    ResolverRuleAssociationId: ResourceId;
  }
  export interface GetResolverRuleAssociationResponse {
    /**
     * Information about the Resolver rule association that you specified in a GetResolverRuleAssociation request.
     */
    ResolverRuleAssociation?: ResolverRuleAssociation;
  }
  export interface GetResolverRulePolicyRequest {
    /**
     * The ID of the Resolver rule that you want to get the Resolver rule policy for.
     */
    Arn: Arn;
  }
  export interface GetResolverRulePolicyResponse {
    /**
     * The Resolver rule policy for the rule that you specified in a GetResolverRulePolicy request.
     */
    ResolverRulePolicy?: ResolverRulePolicy;
  }
  export interface GetResolverRuleRequest {
    /**
     * The ID of the Resolver rule that you want to get information about.
     */
    ResolverRuleId: ResourceId;
  }
  export interface GetResolverRuleResponse {
    /**
     * Information about the Resolver rule that you specified in a GetResolverRule request.
     */
    ResolverRule?: ResolverRule;
  }
  export interface ImportFirewallDomainsRequest {
    /**
     * The ID of the domain list that you want to modify with the import operation.
     */
    FirewallDomainListId: ResourceId;
    /**
     * What you want DNS Firewall to do with the domains that are listed in the file. This must be set to REPLACE, which updates the domain list to exactly match the list in the file. 
     */
    Operation: FirewallDomainImportOperation;
    /**
     * The fully qualified URL or URI of the file stored in Amazon Simple Storage Service (Amazon S3) that contains the list of domains to import. The file must be in an S3 bucket that's in the same Region as your DNS Firewall. The file must be a text file and must contain a single domain per line.
     */
    DomainFileUrl: DomainListFileUrl;
  }
  export interface ImportFirewallDomainsResponse {
    /**
     * The Id of the firewall domain list that DNS Firewall just updated.
     */
    Id?: ResourceId;
    /**
     * The name of the domain list. 
     */
    Name?: Name;
    /**
     * Status of the import request.
     */
    Status?: FirewallDomainListStatus;
    /**
     * Additional information about the status of the list, if available.
     */
    StatusMessage?: StatusMessage;
  }
  export type InstanceCount = number;
  export type Ip = string;
  export type IpAddressCount = number;
  export interface IpAddressRequest {
    /**
     * The ID of the subnet that contains the IP address. 
     */
    SubnetId: SubnetId;
    /**
     * The IPv4 address that you want to use for DNS queries.
     */
    Ip?: Ip;
    /**
     *  The IPv6 address that you want to use for DNS queries. 
     */
    Ipv6?: Ipv6;
  }
  export interface IpAddressResponse {
    /**
     * The ID of one IP address.
     */
    IpId?: ResourceId;
    /**
     * The ID of one subnet.
     */
    SubnetId?: SubnetId;
    /**
     * One IPv4 address that the Resolver endpoint uses for DNS queries.
     */
    Ip?: Ip;
    /**
     *  One IPv6 address that the Resolver endpoint uses for DNS queries. 
     */
    Ipv6?: Ipv6;
    /**
     * A status code that gives the current status of the request.
     */
    Status?: IpAddressStatus;
    /**
     * A message that provides additional information about the status of the request.
     */
    StatusMessage?: StatusMessage;
    /**
     * The date and time that the IP address was created, in Unix time format and Coordinated Universal Time (UTC).
     */
    CreationTime?: Rfc3339TimeString;
    /**
     * The date and time that the IP address was last modified, in Unix time format and Coordinated Universal Time (UTC).
     */
    ModificationTime?: Rfc3339TimeString;
  }
  export type IpAddressStatus = "CREATING"|"FAILED_CREATION"|"ATTACHING"|"ATTACHED"|"REMAP_DETACHING"|"REMAP_ATTACHING"|"DETACHING"|"FAILED_RESOURCE_GONE"|"DELETING"|"DELETE_FAILED_FAS_EXPIRED"|"UPDATING"|"UPDATE_FAILED"|string;
  export interface IpAddressUpdate {
    /**
     *  Only when removing an IP address from a Resolver endpoint: The ID of the IP address that you want to remove. To get this ID, use GetResolverEndpoint.
     */
    IpId?: ResourceId;
    /**
     * The ID of the subnet that includes the IP address that you want to update. To get this ID, use GetResolverEndpoint.
     */
    SubnetId?: SubnetId;
    /**
     * The new IPv4 address.
     */
    Ip?: Ip;
    /**
     *  The new IPv6 address. 
     */
    Ipv6?: Ipv6;
  }
  export type IpAddressesRequest = IpAddressRequest[];
  export type IpAddressesResponse = IpAddressResponse[];
  export type Ipv6 = string;
  export type ListDomainMaxResults = number;
  export type ListFirewallConfigsMaxResult = number;
  export interface ListFirewallConfigsRequest {
    /**
     * The maximum number of objects that you want Resolver to return for this request. If more objects are available, in the response, Resolver provides a NextToken value that you can use in a subsequent call to get the next batch of objects. If you don't specify a value for MaxResults, Resolver returns up to 100 objects. 
     */
    MaxResults?: ListFirewallConfigsMaxResult;
    /**
     * For the first call to this list request, omit this value. When you request a list of objects, Resolver returns at most the number of objects specified in MaxResults. If more objects are available for retrieval, Resolver returns a NextToken value in the response. To retrieve the next batch of objects, use the token that was returned for the prior request in your next request.
     */
    NextToken?: NextToken;
  }
  export interface ListFirewallConfigsResponse {
    /**
     * If objects are still available for retrieval, Resolver returns this token in the response. To retrieve the next batch of objects, provide this token in your next request.
     */
    NextToken?: NextToken;
    /**
     * The configurations for the firewall behavior provided by DNS Firewall for VPCs from Amazon Virtual Private Cloud (Amazon VPC). 
     */
    FirewallConfigs?: FirewallConfigList;
  }
  export interface ListFirewallDomainListsRequest {
    /**
     * The maximum number of objects that you want Resolver to return for this request. If more objects are available, in the response, Resolver provides a NextToken value that you can use in a subsequent call to get the next batch of objects. If you don't specify a value for MaxResults, Resolver returns up to 100 objects. 
     */
    MaxResults?: MaxResults;
    /**
     * For the first call to this list request, omit this value. When you request a list of objects, Resolver returns at most the number of objects specified in MaxResults. If more objects are available for retrieval, Resolver returns a NextToken value in the response. To retrieve the next batch of objects, use the token that was returned for the prior request in your next request.
     */
    NextToken?: NextToken;
  }
  export interface ListFirewallDomainListsResponse {
    /**
     * If objects are still available for retrieval, Resolver returns this token in the response. To retrieve the next batch of objects, provide this token in your next request.
     */
    NextToken?: NextToken;
    /**
     * A list of the domain lists that you have defined.  This might be a partial list of the domain lists that you've defined. For information, see MaxResults. 
     */
    FirewallDomainLists?: FirewallDomainListMetadataList;
  }
  export interface ListFirewallDomainsRequest {
    /**
     * The ID of the domain list whose domains you want to retrieve. 
     */
    FirewallDomainListId: ResourceId;
    /**
     * The maximum number of objects that you want Resolver to return for this request. If more objects are available, in the response, Resolver provides a NextToken value that you can use in a subsequent call to get the next batch of objects. If you don't specify a value for MaxResults, Resolver returns up to 100 objects. 
     */
    MaxResults?: ListDomainMaxResults;
    /**
     * For the first call to this list request, omit this value. When you request a list of objects, Resolver returns at most the number of objects specified in MaxResults. If more objects are available for retrieval, Resolver returns a NextToken value in the response. To retrieve the next batch of objects, use the token that was returned for the prior request in your next request.
     */
    NextToken?: NextToken;
  }
  export interface ListFirewallDomainsResponse {
    /**
     * If objects are still available for retrieval, Resolver returns this token in the response. To retrieve the next batch of objects, provide this token in your next request.
     */
    NextToken?: NextToken;
    /**
     * A list of the domains in the firewall domain list.  This might be a partial list of the domains that you've defined in the domain list. For information, see MaxResults. 
     */
    Domains?: FirewallDomains;
  }
  export interface ListFirewallRuleGroupAssociationsRequest {
    /**
     * The unique identifier of the firewall rule group that you want to retrieve the associations for. Leave this blank to retrieve associations for any rule group. 
     */
    FirewallRuleGroupId?: ResourceId;
    /**
     * The unique identifier of the VPC that you want to retrieve the associations for. Leave this blank to retrieve associations for any VPC. 
     */
    VpcId?: ResourceId;
    /**
     * The setting that determines the processing order of the rule group among the rule groups that are associated with a single VPC. DNS Firewall filters VPC traffic starting from the rule group with the lowest numeric priority setting. 
     */
    Priority?: Priority;
    /**
     * The association Status setting that you want DNS Firewall to filter on for the list. If you don't specify this, then DNS Firewall returns all associations, regardless of status.
     */
    Status?: FirewallRuleGroupAssociationStatus;
    /**
     * The maximum number of objects that you want Resolver to return for this request. If more objects are available, in the response, Resolver provides a NextToken value that you can use in a subsequent call to get the next batch of objects. If you don't specify a value for MaxResults, Resolver returns up to 100 objects. 
     */
    MaxResults?: MaxResults;
    /**
     * For the first call to this list request, omit this value. When you request a list of objects, Resolver returns at most the number of objects specified in MaxResults. If more objects are available for retrieval, Resolver returns a NextToken value in the response. To retrieve the next batch of objects, use the token that was returned for the prior request in your next request.
     */
    NextToken?: NextToken;
  }
  export interface ListFirewallRuleGroupAssociationsResponse {
    /**
     * If objects are still available for retrieval, Resolver returns this token in the response. To retrieve the next batch of objects, provide this token in your next request.
     */
    NextToken?: NextToken;
    /**
     * A list of your firewall rule group associations. This might be a partial list of the associations that you have defined. For information, see MaxResults. 
     */
    FirewallRuleGroupAssociations?: FirewallRuleGroupAssociations;
  }
  export interface ListFirewallRuleGroupsRequest {
    /**
     * The maximum number of objects that you want Resolver to return for this request. If more objects are available, in the response, Resolver provides a NextToken value that you can use in a subsequent call to get the next batch of objects. If you don't specify a value for MaxResults, Resolver returns up to 100 objects. 
     */
    MaxResults?: MaxResults;
    /**
     * For the first call to this list request, omit this value. When you request a list of objects, Resolver returns at most the number of objects specified in MaxResults. If more objects are available for retrieval, Resolver returns a NextToken value in the response. To retrieve the next batch of objects, use the token that was returned for the prior request in your next request.
     */
    NextToken?: NextToken;
  }
  export interface ListFirewallRuleGroupsResponse {
    /**
     * If objects are still available for retrieval, Resolver returns this token in the response. To retrieve the next batch of objects, provide this token in your next request.
     */
    NextToken?: NextToken;
    /**
     * A list of your firewall rule groups. This might be a partial list of the rule groups that you have defined. For information, see MaxResults. 
     */
    FirewallRuleGroups?: FirewallRuleGroupMetadataList;
  }
  export interface ListFirewallRulesRequest {
    /**
     * The unique identifier of the firewall rule group that you want to retrieve the rules for. 
     */
    FirewallRuleGroupId: ResourceId;
    /**
     * Optional additional filter for the rules to retrieve. The setting that determines the processing order of the rules in a rule group. DNS Firewall processes the rules in a rule group by order of priority, starting from the lowest setting.
     */
    Priority?: Priority;
    /**
     * Optional additional filter for the rules to retrieve. The action that DNS Firewall should take on a DNS query when it matches one of the domains in the rule's domain list:    ALLOW - Permit the request to go through.    ALERT - Permit the request to go through but send an alert to the logs.    BLOCK - Disallow the request. If this is specified, additional handling details are provided in the rule's BlockResponse setting.   
     */
    Action?: Action;
    /**
     * The maximum number of objects that you want Resolver to return for this request. If more objects are available, in the response, Resolver provides a NextToken value that you can use in a subsequent call to get the next batch of objects. If you don't specify a value for MaxResults, Resolver returns up to 100 objects. 
     */
    MaxResults?: MaxResults;
    /**
     * For the first call to this list request, omit this value. When you request a list of objects, Resolver returns at most the number of objects specified in MaxResults. If more objects are available for retrieval, Resolver returns a NextToken value in the response. To retrieve the next batch of objects, use the token that was returned for the prior request in your next request.
     */
    NextToken?: NextToken;
  }
  export interface ListFirewallRulesResponse {
    /**
     * If objects are still available for retrieval, Resolver returns this token in the response. To retrieve the next batch of objects, provide this token in your next request.
     */
    NextToken?: NextToken;
    /**
     * A list of the rules that you have defined.  This might be a partial list of the firewall rules that you've defined. For information, see MaxResults. 
     */
    FirewallRules?: FirewallRules;
  }
  export interface ListOutpostResolversRequest {
    /**
     * The Amazon Resource Name (ARN) of the Outpost.
     */
    OutpostArn?: OutpostArn;
    /**
     * The maximum number of Resolvers on the Outpost that you want to return in the response to a ListOutpostResolver request. If you don't specify a value for MaxResults, the request returns up to 100 Resolvers.
     */
    MaxResults?: MaxResults;
    /**
     * For the first ListOutpostResolver request, omit this value. 
     */
    NextToken?: NextToken;
  }
  export interface ListOutpostResolversResponse {
    /**
     * The Resolvers on Outposts that were created by using the current Amazon Web Services account, and that match the specified filters, if any.
     */
    OutpostResolvers?: OutpostResolverList;
    /**
     * If more than MaxResults Resolvers match the specified criteria, you can submit another ListOutpostResolver request to get the next group of results. In the next request, specify the value of NextToken from the previous response.
     */
    NextToken?: NextToken;
  }
  export type ListResolverConfigsMaxResult = number;
  export interface ListResolverConfigsRequest {
    /**
     * The maximum number of Resolver configurations that you want to return in the response to a ListResolverConfigs request. If you don't specify a value for MaxResults, up to 100 Resolver configurations are returned.
     */
    MaxResults?: ListResolverConfigsMaxResult;
    /**
     * (Optional) If the current Amazon Web Services account has more than MaxResults Resolver configurations, use NextToken to get the second and subsequent pages of results. For the first ListResolverConfigs request, omit this value. For the second and subsequent requests, get the value of NextToken from the previous response and specify that value for NextToken in the request.
     */
    NextToken?: NextToken;
  }
  export interface ListResolverConfigsResponse {
    /**
     * If a response includes the last of the Resolver configurations that are associated with the current Amazon Web Services account, NextToken doesn't appear in the response. If a response doesn't include the last of the configurations, you can get more configurations by submitting another ListResolverConfigs request. Get the value of NextToken that Amazon Route 53 returned in the previous response and include it in NextToken in the next request.
     */
    NextToken?: NextToken;
    /**
     * An array that contains one ResolverConfigs element for each Resolver configuration that is associated with the current Amazon Web Services account.
     */
    ResolverConfigs?: ResolverConfigList;
  }
  export interface ListResolverDnssecConfigsRequest {
    /**
     *  Optional: An integer that specifies the maximum number of DNSSEC configuration results that you want Amazon Route 53 to return. If you don't specify a value for MaxResults, Route 53 returns up to 100 configuration per page.
     */
    MaxResults?: MaxResults;
    /**
     * (Optional) If the current Amazon Web Services account has more than MaxResults DNSSEC configurations, use NextToken to get the second and subsequent pages of results. For the first ListResolverDnssecConfigs request, omit this value. For the second and subsequent requests, get the value of NextToken from the previous response and specify that value for NextToken in the request.
     */
    NextToken?: NextToken;
    /**
     * An optional specification to return a subset of objects.
     */
    Filters?: Filters;
  }
  export interface ListResolverDnssecConfigsResponse {
    /**
     * If a response includes the last of the DNSSEC configurations that are associated with the current Amazon Web Services account, NextToken doesn't appear in the response. If a response doesn't include the last of the configurations, you can get more configurations by submitting another ListResolverDnssecConfigs request. Get the value of NextToken that Amazon Route 53 returned in the previous response and include it in NextToken in the next request.
     */
    NextToken?: NextToken;
    /**
     * An array that contains one ResolverDnssecConfig element for each configuration for DNSSEC validation that is associated with the current Amazon Web Services account.
     */
    ResolverDnssecConfigs?: ResolverDnssecConfigList;
  }
  export interface ListResolverEndpointIpAddressesRequest {
    /**
     * The ID of the Resolver endpoint that you want to get IP addresses for.
     */
    ResolverEndpointId: ResourceId;
    /**
     * The maximum number of IP addresses that you want to return in the response to a ListResolverEndpointIpAddresses request. If you don't specify a value for MaxResults, Resolver returns up to 100 IP addresses. 
     */
    MaxResults?: MaxResults;
    /**
     * For the first ListResolverEndpointIpAddresses request, omit this value. If the specified Resolver endpoint has more than MaxResults IP addresses, you can submit another ListResolverEndpointIpAddresses request to get the next group of IP addresses. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
  }
  export interface ListResolverEndpointIpAddressesResponse {
    /**
     * If the specified endpoint has more than MaxResults IP addresses, you can submit another ListResolverEndpointIpAddresses request to get the next group of IP addresses. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * The value that you specified for MaxResults in the request.
     */
    MaxResults?: MaxResults;
    /**
     * Information about the IP addresses in your VPC that DNS queries originate from (for outbound endpoints) or that you forward DNS queries to (for inbound endpoints).
     */
    IpAddresses?: IpAddressesResponse;
  }
  export interface ListResolverEndpointsRequest {
    /**
     * The maximum number of Resolver endpoints that you want to return in the response to a ListResolverEndpoints request. If you don't specify a value for MaxResults, Resolver returns up to 100 Resolver endpoints. 
     */
    MaxResults?: MaxResults;
    /**
     * For the first ListResolverEndpoints request, omit this value. If you have more than MaxResults Resolver endpoints, you can submit another ListResolverEndpoints request to get the next group of Resolver endpoints. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * An optional specification to return a subset of Resolver endpoints, such as all inbound Resolver endpoints.  If you submit a second or subsequent ListResolverEndpoints request and specify the NextToken parameter, you must use the same values for Filters, if any, as in the previous request. 
     */
    Filters?: Filters;
  }
  export interface ListResolverEndpointsResponse {
    /**
     * If more than MaxResults IP addresses match the specified criteria, you can submit another ListResolverEndpoint request to get the next group of results. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * The value that you specified for MaxResults in the request.
     */
    MaxResults?: MaxResults;
    /**
     * The Resolver endpoints that were created by using the current Amazon Web Services account, and that match the specified filters, if any.
     */
    ResolverEndpoints?: ResolverEndpoints;
  }
  export interface ListResolverQueryLogConfigAssociationsRequest {
    /**
     * The maximum number of query logging associations that you want to return in the response to a ListResolverQueryLogConfigAssociations request. If you don't specify a value for MaxResults, Resolver returns up to 100 query logging associations. 
     */
    MaxResults?: MaxResults;
    /**
     * For the first ListResolverQueryLogConfigAssociations request, omit this value. If there are more than MaxResults query logging associations that match the values that you specify for Filters, you can submit another ListResolverQueryLogConfigAssociations request to get the next group of associations. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * An optional specification to return a subset of query logging associations.  If you submit a second or subsequent ListResolverQueryLogConfigAssociations request and specify the NextToken parameter, you must use the same values for Filters, if any, as in the previous request. 
     */
    Filters?: Filters;
    /**
     * The element that you want Resolver to sort query logging associations by.   If you submit a second or subsequent ListResolverQueryLogConfigAssociations request and specify the NextToken parameter, you must use the same value for SortBy, if any, as in the previous request.  Valid values include the following elements:    CreationTime: The ID of the query logging association.    Error: If the value of Status is FAILED, the value of Error indicates the cause:     DESTINATION_NOT_FOUND: The specified destination (for example, an Amazon S3 bucket) was deleted.    ACCESS_DENIED: Permissions don't allow sending logs to the destination.   If Status is a value other than FAILED, ERROR is null.    Id: The ID of the query logging association    ResolverQueryLogConfigId: The ID of the query logging configuration    ResourceId: The ID of the VPC that is associated with the query logging configuration    Status: The current status of the configuration. Valid values include the following:    CREATING: Resolver is creating an association between an Amazon VPC and a query logging configuration.    CREATED: The association between an Amazon VPC and a query logging configuration was successfully created. Resolver is logging queries that originate in the specified VPC.    DELETING: Resolver is deleting this query logging association.    FAILED: Resolver either couldn't create or couldn't delete the query logging association. Here are two common causes:   The specified destination (for example, an Amazon S3 bucket) was deleted.   Permissions don't allow sending logs to the destination.      
     */
    SortBy?: SortByKey;
    /**
     * If you specified a value for SortBy, the order that you want query logging associations to be listed in, ASCENDING or DESCENDING.  If you submit a second or subsequent ListResolverQueryLogConfigAssociations request and specify the NextToken parameter, you must use the same value for SortOrder, if any, as in the previous request. 
     */
    SortOrder?: SortOrder;
  }
  export interface ListResolverQueryLogConfigAssociationsResponse {
    /**
     * If there are more than MaxResults query logging associations, you can submit another ListResolverQueryLogConfigAssociations request to get the next group of associations. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * The total number of query logging associations that were created by the current account in the specified Region. This count can differ from the number of associations that are returned in a ListResolverQueryLogConfigAssociations response, depending on the values that you specify in the request.
     */
    TotalCount?: Count;
    /**
     * The total number of query logging associations that were created by the current account in the specified Region and that match the filters that were specified in the ListResolverQueryLogConfigAssociations request. For the total number of associations that were created by the current account in the specified Region, see TotalCount.
     */
    TotalFilteredCount?: Count;
    /**
     * A list that contains one ResolverQueryLogConfigAssociations element for each query logging association that matches the values that you specified for Filter.
     */
    ResolverQueryLogConfigAssociations?: ResolverQueryLogConfigAssociationList;
  }
  export interface ListResolverQueryLogConfigsRequest {
    /**
     * The maximum number of query logging configurations that you want to return in the response to a ListResolverQueryLogConfigs request. If you don't specify a value for MaxResults, Resolver returns up to 100 query logging configurations. 
     */
    MaxResults?: MaxResults;
    /**
     * For the first ListResolverQueryLogConfigs request, omit this value. If there are more than MaxResults query logging configurations that match the values that you specify for Filters, you can submit another ListResolverQueryLogConfigs request to get the next group of configurations. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * An optional specification to return a subset of query logging configurations.  If you submit a second or subsequent ListResolverQueryLogConfigs request and specify the NextToken parameter, you must use the same values for Filters, if any, as in the previous request. 
     */
    Filters?: Filters;
    /**
     * The element that you want Resolver to sort query logging configurations by.   If you submit a second or subsequent ListResolverQueryLogConfigs request and specify the NextToken parameter, you must use the same value for SortBy, if any, as in the previous request.  Valid values include the following elements:    Arn: The ARN of the query logging configuration    AssociationCount: The number of VPCs that are associated with the specified configuration     CreationTime: The date and time that Resolver returned when the configuration was created    CreatorRequestId: The value that was specified for CreatorRequestId when the configuration was created    DestinationArn: The location that logs are sent to    Id: The ID of the configuration    Name: The name of the configuration    OwnerId: The Amazon Web Services account number of the account that created the configuration    ShareStatus: Whether the configuration is shared with other Amazon Web Services accounts or shared with the current account by another Amazon Web Services account. Sharing is configured through Resource Access Manager (RAM).    Status: The current status of the configuration. Valid values include the following:    CREATING: Resolver is creating the query logging configuration.    CREATED: The query logging configuration was successfully created. Resolver is logging queries that originate in the specified VPC.    DELETING: Resolver is deleting this query logging configuration.    FAILED: Resolver either couldn't create or couldn't delete the query logging configuration. Here are two common causes:   The specified destination (for example, an Amazon S3 bucket) was deleted.   Permissions don't allow sending logs to the destination.      
     */
    SortBy?: SortByKey;
    /**
     * If you specified a value for SortBy, the order that you want query logging configurations to be listed in, ASCENDING or DESCENDING.  If you submit a second or subsequent ListResolverQueryLogConfigs request and specify the NextToken parameter, you must use the same value for SortOrder, if any, as in the previous request. 
     */
    SortOrder?: SortOrder;
  }
  export interface ListResolverQueryLogConfigsResponse {
    /**
     * If there are more than MaxResults query logging configurations, you can submit another ListResolverQueryLogConfigs request to get the next group of configurations. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * The total number of query logging configurations that were created by the current account in the specified Region. This count can differ from the number of query logging configurations that are returned in a ListResolverQueryLogConfigs response, depending on the values that you specify in the request.
     */
    TotalCount?: Count;
    /**
     * The total number of query logging configurations that were created by the current account in the specified Region and that match the filters that were specified in the ListResolverQueryLogConfigs request. For the total number of query logging configurations that were created by the current account in the specified Region, see TotalCount.
     */
    TotalFilteredCount?: Count;
    /**
     * A list that contains one ResolverQueryLogConfig element for each query logging configuration that matches the values that you specified for Filter.
     */
    ResolverQueryLogConfigs?: ResolverQueryLogConfigList;
  }
  export interface ListResolverRuleAssociationsRequest {
    /**
     * The maximum number of rule associations that you want to return in the response to a ListResolverRuleAssociations request. If you don't specify a value for MaxResults, Resolver returns up to 100 rule associations. 
     */
    MaxResults?: MaxResults;
    /**
     * For the first ListResolverRuleAssociation request, omit this value. If you have more than MaxResults rule associations, you can submit another ListResolverRuleAssociation request to get the next group of rule associations. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * An optional specification to return a subset of Resolver rules, such as Resolver rules that are associated with the same VPC ID.  If you submit a second or subsequent ListResolverRuleAssociations request and specify the NextToken parameter, you must use the same values for Filters, if any, as in the previous request. 
     */
    Filters?: Filters;
  }
  export interface ListResolverRuleAssociationsResponse {
    /**
     * If more than MaxResults rule associations match the specified criteria, you can submit another ListResolverRuleAssociation request to get the next group of results. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * The value that you specified for MaxResults in the request.
     */
    MaxResults?: MaxResults;
    /**
     * The associations that were created between Resolver rules and VPCs using the current Amazon Web Services account, and that match the specified filters, if any.
     */
    ResolverRuleAssociations?: ResolverRuleAssociations;
  }
  export interface ListResolverRulesRequest {
    /**
     * The maximum number of Resolver rules that you want to return in the response to a ListResolverRules request. If you don't specify a value for MaxResults, Resolver returns up to 100 Resolver rules.
     */
    MaxResults?: MaxResults;
    /**
     * For the first ListResolverRules request, omit this value. If you have more than MaxResults Resolver rules, you can submit another ListResolverRules request to get the next group of Resolver rules. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * An optional specification to return a subset of Resolver rules, such as all Resolver rules that are associated with the same Resolver endpoint.  If you submit a second or subsequent ListResolverRules request and specify the NextToken parameter, you must use the same values for Filters, if any, as in the previous request. 
     */
    Filters?: Filters;
  }
  export interface ListResolverRulesResponse {
    /**
     * If more than MaxResults Resolver rules match the specified criteria, you can submit another ListResolverRules request to get the next group of results. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
    /**
     * The value that you specified for MaxResults in the request.
     */
    MaxResults?: MaxResults;
    /**
     * The Resolver rules that were created using the current Amazon Web Services account and that match the specified filters, if any.
     */
    ResolverRules?: ResolverRules;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the resource that you want to list tags for.
     */
    ResourceArn: Arn;
    /**
     * The maximum number of tags that you want to return in the response to a ListTagsForResource request. If you don't specify a value for MaxResults, Resolver returns up to 100 tags.
     */
    MaxResults?: MaxResults;
    /**
     * For the first ListTagsForResource request, omit this value. If you have more than MaxResults tags, you can submit another ListTagsForResource request to get the next group of tags for the resource. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags that are associated with the resource that you specified in the ListTagsForResource request.
     */
    Tags?: TagList;
    /**
     * If more than MaxResults tags match the specified criteria, you can submit another ListTagsForResource request to get the next group of results. In the next request, specify the value of NextToken from the previous response. 
     */
    NextToken?: NextToken;
  }
  export type MaxResults = number;
  export type MutationProtectionStatus = "ENABLED"|"DISABLED"|string;
  export type Name = string;
  export type NextToken = string;
  export type OutpostArn = string;
  export type OutpostInstanceType = string;
  export interface OutpostResolver {
    /**
     * The ARN (Amazon Resource Name) for the Resolver on an Outpost.
     */
    Arn?: Arn;
    /**
     * The date and time that the Outpost Resolver was created, in Unix time format and Coordinated Universal Time (UTC).
     */
    CreationTime?: Rfc3339TimeString;
    /**
     * The date and time that the Outpost Resolver was modified, in Unix time format and Coordinated Universal Time (UTC).
     */
    ModificationTime?: Rfc3339TimeString;
    /**
     * A unique string that identifies the request that created the Resolver endpoint. The CreatorRequestId allows failed requests to be retried without the risk of running the operation twice.
     */
    CreatorRequestId?: CreatorRequestId;
    /**
     * The ID of the Resolver on Outpost.
     */
    Id?: ResourceId;
    /**
     * Amazon EC2 instance count for the Resolver on the Outpost.
     */
    InstanceCount?: InstanceCount;
    /**
     *  The Amazon EC2 instance type. 
     */
    PreferredInstanceType?: OutpostInstanceType;
    /**
     * Name of the Resolver.
     */
    Name?: OutpostResolverName;
    /**
     * Status of the Resolver.
     */
    Status?: OutpostResolverStatus;
    /**
     * A detailed description of the Resolver.
     */
    StatusMessage?: OutpostResolverStatusMessage;
    /**
     * The ARN (Amazon Resource Name) for the Outpost.
     */
    OutpostArn?: OutpostArn;
  }
  export type OutpostResolverList = OutpostResolver[];
  export type OutpostResolverName = string;
  export type OutpostResolverStatus = "CREATING"|"OPERATIONAL"|"UPDATING"|"DELETING"|"ACTION_NEEDED"|"FAILED_CREATION"|"FAILED_DELETION"|string;
  export type OutpostResolverStatusMessage = string;
  export type Port = number;
  export type Priority = number;
  export interface PutFirewallRuleGroupPolicyRequest {
    /**
     * The ARN (Amazon Resource Name) for the rule group that you want to share.
     */
    Arn: Arn;
    /**
     * The Identity and Access Management (Amazon Web Services IAM) policy to attach to the rule group.
     */
    FirewallRuleGroupPolicy: FirewallRuleGroupPolicy;
  }
  export interface PutFirewallRuleGroupPolicyResponse {
    /**
     * 
     */
    ReturnValue?: Boolean;
  }
  export interface PutResolverQueryLogConfigPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the account that you want to share rules with.
     */
    Arn: Arn;
    /**
     * An Identity and Access Management policy statement that lists the query logging configurations that you want to share with another Amazon Web Services account and the operations that you want the account to be able to perform. You can specify the following operations in the Actions section of the statement:    route53resolver:AssociateResolverQueryLogConfig     route53resolver:DisassociateResolverQueryLogConfig     route53resolver:ListResolverQueryLogConfigs    In the Resource section of the statement, you specify the ARNs for the query logging configurations that you want to share with the account that you specified in Arn. 
     */
    ResolverQueryLogConfigPolicy: ResolverQueryLogConfigPolicy;
  }
  export interface PutResolverQueryLogConfigPolicyResponse {
    /**
     * Whether the PutResolverQueryLogConfigPolicy request was successful.
     */
    ReturnValue?: Boolean;
  }
  export interface PutResolverRulePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the rule that you want to share with another account.
     */
    Arn: Arn;
    /**
     * An Identity and Access Management policy statement that lists the rules that you want to share with another Amazon Web Services account and the operations that you want the account to be able to perform. You can specify the following operations in the Action section of the statement:    route53resolver:GetResolverRule     route53resolver:AssociateResolverRule     route53resolver:DisassociateResolverRule     route53resolver:ListResolverRules     route53resolver:ListResolverRuleAssociations    In the Resource section of the statement, specify the ARN for the rule that you want to share with another account. Specify the same ARN that you specified in Arn.
     */
    ResolverRulePolicy: ResolverRulePolicy;
  }
  export interface PutResolverRulePolicyResponse {
    /**
     * Whether the PutResolverRulePolicy request was successful.
     */
    ReturnValue?: Boolean;
  }
  export type ResolverAutodefinedReverseStatus = "ENABLING"|"ENABLED"|"DISABLING"|"DISABLED"|"UPDATING_TO_USE_LOCAL_RESOURCE_SETTING"|"USE_LOCAL_RESOURCE_SETTING"|string;
  export interface ResolverConfig {
    /**
     * ID for the Resolver configuration.
     */
    Id?: ResourceId;
    /**
     * The ID of the Amazon Virtual Private Cloud VPC that you're configuring Resolver for.
     */
    ResourceId?: ResourceId;
    /**
     * The owner account ID of the Amazon Virtual Private Cloud VPC.
     */
    OwnerId?: AccountId;
    /**
     *  The status of whether or not the Resolver will create autodefined rules for reverse DNS lookups. This is enabled by default. The status can be one of following:    ENABLING: Autodefined rules for reverse DNS lookups are being enabled but are not complete.    ENABLED: Autodefined rules for reverse DNS lookups are enabled.    DISABLING: Autodefined rules for reverse DNS lookups are being disabled but are not complete.    DISABLED: Autodefined rules for reverse DNS lookups are disabled.  
     */
    AutodefinedReverse?: ResolverAutodefinedReverseStatus;
  }
  export type ResolverConfigList = ResolverConfig[];
  export type ResolverDNSSECValidationStatus = "ENABLING"|"ENABLED"|"DISABLING"|"DISABLED"|"UPDATING_TO_USE_LOCAL_RESOURCE_SETTING"|"USE_LOCAL_RESOURCE_SETTING"|string;
  export interface ResolverDnssecConfig {
    /**
     * The ID for a configuration for DNSSEC validation.
     */
    Id?: ResourceId;
    /**
     * The owner account ID of the virtual private cloud (VPC) for a configuration for DNSSEC validation.
     */
    OwnerId?: AccountId;
    /**
     * The ID of the virtual private cloud (VPC) that you're configuring the DNSSEC validation status for.
     */
    ResourceId?: ResourceId;
    /**
     * The validation status for a DNSSEC configuration. The status can be one of the following:    ENABLING: DNSSEC validation is being enabled but is not complete.    ENABLED: DNSSEC validation is enabled.    DISABLING: DNSSEC validation is being disabled but is not complete.    DISABLED DNSSEC validation is disabled.  
     */
    ValidationStatus?: ResolverDNSSECValidationStatus;
  }
  export type ResolverDnssecConfigList = ResolverDnssecConfig[];
  export interface ResolverEndpoint {
    /**
     * The ID of the Resolver endpoint.
     */
    Id?: ResourceId;
    /**
     * A unique string that identifies the request that created the Resolver endpoint. The CreatorRequestId allows failed requests to be retried without the risk of running the operation twice.
     */
    CreatorRequestId?: CreatorRequestId;
    /**
     * The ARN (Amazon Resource Name) for the Resolver endpoint.
     */
    Arn?: Arn;
    /**
     * The name that you assigned to the Resolver endpoint when you submitted a CreateResolverEndpoint request.
     */
    Name?: Name;
    /**
     * The ID of one or more security groups that control access to this VPC. The security group must include one or more inbound rules (for inbound endpoints) or outbound rules (for outbound endpoints). Inbound and outbound rules must allow TCP and UDP access. For inbound access, open port 53. For outbound access, open the port that you're using for DNS queries on your network.
     */
    SecurityGroupIds?: SecurityGroupIds;
    /**
     * Indicates whether the Resolver endpoint allows inbound or outbound DNS queries:    INBOUND: allows DNS queries to your VPC from your network    OUTBOUND: allows DNS queries from your VPC to your network  
     */
    Direction?: ResolverEndpointDirection;
    /**
     * The number of IP addresses that the Resolver endpoint can use for DNS queries.
     */
    IpAddressCount?: IpAddressCount;
    /**
     * The ID of the VPC that you want to create the Resolver endpoint in.
     */
    HostVPCId?: ResourceId;
    /**
     * A code that specifies the current status of the Resolver endpoint. Valid values include the following:    CREATING: Resolver is creating and configuring one or more Amazon VPC network interfaces for this endpoint.    OPERATIONAL: The Amazon VPC network interfaces for this endpoint are correctly configured and able to pass inbound or outbound DNS queries between your network and Resolver.    UPDATING: Resolver is associating or disassociating one or more network interfaces with this endpoint.    AUTO_RECOVERING: Resolver is trying to recover one or more of the network interfaces that are associated with this endpoint. During the recovery process, the endpoint functions with limited capacity because of the limit on the number of DNS queries per IP address (per network interface). For the current limit, see Limits on Route 53 Resolver.    ACTION_NEEDED: This endpoint is unhealthy, and Resolver can't automatically recover it. To resolve the problem, we recommend that you check each IP address that you associated with the endpoint. For each IP address that isn't available, add another IP address and then delete the IP address that isn't available. (An endpoint must always include at least two IP addresses.) A status of ACTION_NEEDED can have a variety of causes. Here are two common causes:   One or more of the network interfaces that are associated with the endpoint were deleted using Amazon VPC.   The network interface couldn't be created for some reason that's outside the control of Resolver.      DELETING: Resolver is deleting this endpoint and the associated network interfaces.  
     */
    Status?: ResolverEndpointStatus;
    /**
     * A detailed description of the status of the Resolver endpoint.
     */
    StatusMessage?: StatusMessage;
    /**
     * The date and time that the endpoint was created, in Unix time format and Coordinated Universal Time (UTC).
     */
    CreationTime?: Rfc3339TimeString;
    /**
     * The date and time that the endpoint was last modified, in Unix time format and Coordinated Universal Time (UTC).
     */
    ModificationTime?: Rfc3339TimeString;
    /**
     *  The Resolver endpoint IP address type. 
     */
    ResolverEndpointType?: ResolverEndpointType;
    /**
     * The ARN (Amazon Resource Name) for the Outpost.
     */
    OutpostArn?: OutpostArn;
    /**
     *  The Amazon EC2 instance type. 
     */
    PreferredInstanceType?: OutpostInstanceType;
  }
  export type ResolverEndpointDirection = "INBOUND"|"OUTBOUND"|string;
  export type ResolverEndpointStatus = "CREATING"|"OPERATIONAL"|"UPDATING"|"AUTO_RECOVERING"|"ACTION_NEEDED"|"DELETING"|string;
  export type ResolverEndpointType = "IPV6"|"IPV4"|"DUALSTACK"|string;
  export type ResolverEndpoints = ResolverEndpoint[];
  export interface ResolverQueryLogConfig {
    /**
     * The ID for the query logging configuration.
     */
    Id?: ResourceId;
    /**
     * The Amazon Web Services account ID for the account that created the query logging configuration. 
     */
    OwnerId?: AccountId;
    /**
     * The status of the specified query logging configuration. Valid values include the following:    CREATING: Resolver is creating the query logging configuration.    CREATED: The query logging configuration was successfully created. Resolver is logging queries that originate in the specified VPC.    DELETING: Resolver is deleting this query logging configuration.    FAILED: Resolver can't deliver logs to the location that is specified in the query logging configuration. Here are two common causes:   The specified destination (for example, an Amazon S3 bucket) was deleted.   Permissions don't allow sending logs to the destination.    
     */
    Status?: ResolverQueryLogConfigStatus;
    /**
     * An indication of whether the query logging configuration is shared with other Amazon Web Services accounts, or was shared with the current account by another Amazon Web Services account. Sharing is configured through Resource Access Manager (RAM).
     */
    ShareStatus?: ShareStatus;
    /**
     * The number of VPCs that are associated with the query logging configuration.
     */
    AssociationCount?: Count;
    /**
     * The ARN for the query logging configuration.
     */
    Arn?: Arn;
    /**
     * The name of the query logging configuration. 
     */
    Name?: ResolverQueryLogConfigName;
    /**
     * The ARN of the resource that you want Resolver to send query logs: an Amazon S3 bucket, a CloudWatch Logs log group, or a Kinesis Data Firehose delivery stream.
     */
    DestinationArn?: DestinationArn;
    /**
     * A unique string that identifies the request that created the query logging configuration. The CreatorRequestId allows failed requests to be retried without the risk of running the operation twice.
     */
    CreatorRequestId?: CreatorRequestId;
    /**
     * The date and time that the query logging configuration was created, in Unix time format and Coordinated Universal Time (UTC).
     */
    CreationTime?: Rfc3339TimeString;
  }
  export interface ResolverQueryLogConfigAssociation {
    /**
     * The ID of the query logging association.
     */
    Id?: ResourceId;
    /**
     * The ID of the query logging configuration that a VPC is associated with.
     */
    ResolverQueryLogConfigId?: ResourceId;
    /**
     * The ID of the Amazon VPC that is associated with the query logging configuration.
     */
    ResourceId?: ResourceId;
    /**
     * The status of the specified query logging association. Valid values include the following:    CREATING: Resolver is creating an association between an Amazon VPC and a query logging configuration.    CREATED: The association between an Amazon VPC and a query logging configuration was successfully created. Resolver is logging queries that originate in the specified VPC.    DELETING: Resolver is deleting this query logging association.    FAILED: Resolver either couldn't create or couldn't delete the query logging association.  
     */
    Status?: ResolverQueryLogConfigAssociationStatus;
    /**
     * If the value of Status is FAILED, the value of Error indicates the cause:    DESTINATION_NOT_FOUND: The specified destination (for example, an Amazon S3 bucket) was deleted.    ACCESS_DENIED: Permissions don't allow sending logs to the destination.   If the value of Status is a value other than FAILED, Error is null. 
     */
    Error?: ResolverQueryLogConfigAssociationError;
    /**
     * Contains additional information about the error. If the value or Error is null, the value of ErrorMessage also is null.
     */
    ErrorMessage?: ResolverQueryLogConfigAssociationErrorMessage;
    /**
     * The date and time that the VPC was associated with the query logging configuration, in Unix time format and Coordinated Universal Time (UTC).
     */
    CreationTime?: Rfc3339TimeString;
  }
  export type ResolverQueryLogConfigAssociationError = "NONE"|"DESTINATION_NOT_FOUND"|"ACCESS_DENIED"|"INTERNAL_SERVICE_ERROR"|string;
  export type ResolverQueryLogConfigAssociationErrorMessage = string;
  export type ResolverQueryLogConfigAssociationList = ResolverQueryLogConfigAssociation[];
  export type ResolverQueryLogConfigAssociationStatus = "CREATING"|"ACTIVE"|"ACTION_NEEDED"|"DELETING"|"FAILED"|string;
  export type ResolverQueryLogConfigList = ResolverQueryLogConfig[];
  export type ResolverQueryLogConfigName = string;
  export type ResolverQueryLogConfigPolicy = string;
  export type ResolverQueryLogConfigStatus = "CREATING"|"CREATED"|"DELETING"|"FAILED"|string;
  export interface ResolverRule {
    /**
     * The ID that Resolver assigned to the Resolver rule when you created it.
     */
    Id?: ResourceId;
    /**
     * A unique string that you specified when you created the Resolver rule. CreatorRequestId identifies the request and allows failed requests to be retried without the risk of running the operation twice. 
     */
    CreatorRequestId?: CreatorRequestId;
    /**
     * The ARN (Amazon Resource Name) for the Resolver rule specified by Id.
     */
    Arn?: Arn;
    /**
     * DNS queries for this domain name are forwarded to the IP addresses that are specified in TargetIps. If a query matches multiple Resolver rules (example.com and www.example.com), the query is routed using the Resolver rule that contains the most specific domain name (www.example.com).
     */
    DomainName?: DomainName;
    /**
     * A code that specifies the current status of the Resolver rule.
     */
    Status?: ResolverRuleStatus;
    /**
     * A detailed description of the status of a Resolver rule.
     */
    StatusMessage?: StatusMessage;
    /**
     * When you want to forward DNS queries for specified domain name to resolvers on your network, specify FORWARD. When you have a forwarding rule to forward DNS queries for a domain to your network and you want Resolver to process queries for a subdomain of that domain, specify SYSTEM. For example, to forward DNS queries for example.com to resolvers on your network, you create a rule and specify FORWARD for RuleType. To then have Resolver process queries for apex.example.com, you create a rule and specify SYSTEM for RuleType. Currently, only Resolver can create rules that have a value of RECURSIVE for RuleType.
     */
    RuleType?: RuleTypeOption;
    /**
     * The name for the Resolver rule, which you specified when you created the Resolver rule.
     */
    Name?: Name;
    /**
     * An array that contains the IP addresses and ports that an outbound endpoint forwards DNS queries to. Typically, these are the IP addresses of DNS resolvers on your network. 
     */
    TargetIps?: TargetList;
    /**
     * The ID of the endpoint that the rule is associated with.
     */
    ResolverEndpointId?: ResourceId;
    /**
     * When a rule is shared with another Amazon Web Services account, the account ID of the account that the rule is shared with.
     */
    OwnerId?: AccountId;
    /**
     * Whether the rule is shared and, if so, whether the current account is sharing the rule with another account, or another account is sharing the rule with the current account.
     */
    ShareStatus?: ShareStatus;
    /**
     * The date and time that the Resolver rule was created, in Unix time format and Coordinated Universal Time (UTC).
     */
    CreationTime?: Rfc3339TimeString;
    /**
     * The date and time that the Resolver rule was last updated, in Unix time format and Coordinated Universal Time (UTC).
     */
    ModificationTime?: Rfc3339TimeString;
  }
  export interface ResolverRuleAssociation {
    /**
     * The ID of the association between a Resolver rule and a VPC. Resolver assigns this value when you submit an AssociateResolverRule request.
     */
    Id?: ResourceId;
    /**
     * The ID of the Resolver rule that you associated with the VPC that is specified by VPCId.
     */
    ResolverRuleId?: ResourceId;
    /**
     * The name of an association between a Resolver rule and a VPC.
     */
    Name?: Name;
    /**
     * The ID of the VPC that you associated the Resolver rule with.
     */
    VPCId?: ResourceId;
    /**
     * A code that specifies the current status of the association between a Resolver rule and a VPC.
     */
    Status?: ResolverRuleAssociationStatus;
    /**
     * A detailed description of the status of the association between a Resolver rule and a VPC.
     */
    StatusMessage?: StatusMessage;
  }
  export type ResolverRuleAssociationStatus = "CREATING"|"COMPLETE"|"DELETING"|"FAILED"|"OVERRIDDEN"|string;
  export type ResolverRuleAssociations = ResolverRuleAssociation[];
  export interface ResolverRuleConfig {
    /**
     * The new name for the Resolver rule. The name that you specify appears in the Resolver dashboard in the Route 53 console. 
     */
    Name?: Name;
    /**
     * For DNS queries that originate in your VPC, the new IP addresses that you want to route outbound DNS queries to.
     */
    TargetIps?: TargetList;
    /**
     * The ID of the new outbound Resolver endpoint that you want to use to route DNS queries to the IP addresses that you specify in TargetIps.
     */
    ResolverEndpointId?: ResourceId;
  }
  export type ResolverRulePolicy = string;
  export type ResolverRuleStatus = "COMPLETE"|"DELETING"|"UPDATING"|"FAILED"|string;
  export type ResolverRules = ResolverRule[];
  export type ResourceId = string;
  export type Rfc3339TimeString = string;
  export type RuleTypeOption = "FORWARD"|"SYSTEM"|"RECURSIVE"|string;
  export type SecurityGroupIds = ResourceId[];
  export type ServicePrinciple = string;
  export type ShareStatus = "NOT_SHARED"|"SHARED_WITH_ME"|"SHARED_BY_ME"|string;
  export type SortByKey = string;
  export type SortOrder = "ASCENDING"|"DESCENDING"|string;
  export type StatusMessage = string;
  export type SubnetId = string;
  export interface Tag {
    /**
     * The name for the tag. For example, if you want to associate Resolver resources with the account IDs of your customers for billing purposes, the value of Key might be account-id.
     */
    Key: TagKey;
    /**
     * The value for the tag. For example, if Key is account-id, then Value might be the ID of the customer account that you're creating the resource for.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the resource that you want to add tags to. To get the ARN for a resource, use the applicable Get or List command:     GetResolverEndpoint     GetResolverRule     GetResolverRuleAssociation     ListResolverEndpoints     ListResolverRuleAssociations     ListResolverRules   
     */
    ResourceArn: Arn;
    /**
     * The tags that you want to add to the specified resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TargetAddress {
    /**
     * One IPv4 address that you want to forward DNS queries to.
     */
    Ip?: Ip;
    /**
     * The port at Ip that you want to forward DNS queries to.
     */
    Port?: Port;
    /**
     *  One IPv6 address that you want to forward DNS queries to. 
     */
    Ipv6?: Ipv6;
  }
  export type TargetList = TargetAddress[];
  export type Unsigned = number;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the resource that you want to remove tags from. To get the ARN for a resource, use the applicable Get or List command:     GetResolverEndpoint     GetResolverRule     GetResolverRuleAssociation     ListResolverEndpoints     ListResolverRuleAssociations     ListResolverRules   
     */
    ResourceArn: Arn;
    /**
     * The tags that you want to remove to the specified resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateFirewallConfigRequest {
    /**
     * The ID of the VPC that the configuration is for.
     */
    ResourceId: ResourceId;
    /**
     * Determines how Route 53 Resolver handles queries during failures, for example when all traffic that is sent to DNS Firewall fails to receive a reply.    By default, fail open is disabled, which means the failure mode is closed. This approach favors security over availability. DNS Firewall blocks queries that it is unable to evaluate properly.    If you enable this option, the failure mode is open. This approach favors availability over security. DNS Firewall allows queries to proceed if it is unable to properly evaluate them.    This behavior is only enforced for VPCs that have at least one DNS Firewall rule group association. 
     */
    FirewallFailOpen: FirewallFailOpenStatus;
  }
  export interface UpdateFirewallConfigResponse {
    /**
     * Configuration of the firewall behavior provided by DNS Firewall for a single VPC. 
     */
    FirewallConfig?: FirewallConfig;
  }
  export interface UpdateFirewallDomainsRequest {
    /**
     * The ID of the domain list whose domains you want to update. 
     */
    FirewallDomainListId: ResourceId;
    /**
     * What you want DNS Firewall to do with the domains that you are providing:     ADD - Add the domains to the ones that are already in the domain list.     REMOVE - Search the domain list for the domains and remove them from the list.    REPLACE - Update the domain list to exactly match the list that you are providing.   
     */
    Operation: FirewallDomainUpdateOperation;
    /**
     * A list of domains to use in the update operation.  There is a limit of 1000 domains per request.  Each domain specification in your domain list must satisfy the following requirements:    It can optionally start with * (asterisk).   With the exception of the optional starting asterisk, it must only contain the following characters: A-Z, a-z, 0-9, - (hyphen).   It must be from 1-255 characters in length.   
     */
    Domains: FirewallDomains;
  }
  export interface UpdateFirewallDomainsResponse {
    /**
     * The ID of the firewall domain list that DNS Firewall just updated.
     */
    Id?: ResourceId;
    /**
     * The name of the domain list. 
     */
    Name?: Name;
    /**
     * Status of the UpdateFirewallDomains request.
     */
    Status?: FirewallDomainListStatus;
    /**
     * Additional information about the status of the list, if available.
     */
    StatusMessage?: StatusMessage;
  }
  export interface UpdateFirewallRuleGroupAssociationRequest {
    /**
     * The identifier of the FirewallRuleGroupAssociation. 
     */
    FirewallRuleGroupAssociationId: ResourceId;
    /**
     * The setting that determines the processing order of the rule group among the rule groups that you associate with the specified VPC. DNS Firewall filters VPC traffic starting from the rule group with the lowest numeric priority setting.  You must specify a unique priority for each rule group that you associate with a single VPC. To make it easier to insert rule groups later, leave space between the numbers, for example, use 100, 200, and so on. You can change the priority setting for a rule group association after you create it.
     */
    Priority?: Priority;
    /**
     * If enabled, this setting disallows modification or removal of the association, to help prevent against accidentally altering DNS firewall protections. 
     */
    MutationProtection?: MutationProtectionStatus;
    /**
     * The name of the rule group association.
     */
    Name?: Name;
  }
  export interface UpdateFirewallRuleGroupAssociationResponse {
    /**
     * The association that you just updated. 
     */
    FirewallRuleGroupAssociation?: FirewallRuleGroupAssociation;
  }
  export interface UpdateFirewallRuleRequest {
    /**
     * The unique identifier of the firewall rule group for the rule. 
     */
    FirewallRuleGroupId: ResourceId;
    /**
     * The ID of the domain list to use in the rule. 
     */
    FirewallDomainListId: ResourceId;
    /**
     * The setting that determines the processing order of the rule in the rule group. DNS Firewall processes the rules in a rule group by order of priority, starting from the lowest setting. You must specify a unique priority for each rule in a rule group. To make it easier to insert rules later, leave space between the numbers, for example, use 100, 200, and so on. You can change the priority setting for the rules in a rule group at any time.
     */
    Priority?: Priority;
    /**
     * The action that DNS Firewall should take on a DNS query when it matches one of the domains in the rule's domain list:    ALLOW - Permit the request to go through.    ALERT - Permit the request to go through but send an alert to the logs.    BLOCK - Disallow the request. This option requires additional details in the rule's BlockResponse.   
     */
    Action?: Action;
    /**
     * The way that you want DNS Firewall to block the request. Used for the rule action setting BLOCK.    NODATA - Respond indicating that the query was successful, but no response is available for it.    NXDOMAIN - Respond indicating that the domain name that's in the query doesn't exist.    OVERRIDE - Provide a custom override in the response. This option requires custom handling details in the rule's BlockOverride* settings.   
     */
    BlockResponse?: BlockResponse;
    /**
     * The custom DNS record to send back in response to the query. Used for the rule action BLOCK with a BlockResponse setting of OVERRIDE.
     */
    BlockOverrideDomain?: BlockOverrideDomain;
    /**
     * The DNS record's type. This determines the format of the record value that you provided in BlockOverrideDomain. Used for the rule action BLOCK with a BlockResponse setting of OVERRIDE.
     */
    BlockOverrideDnsType?: BlockOverrideDnsType;
    /**
     * The recommended amount of time, in seconds, for the DNS resolver or web browser to cache the provided override record. Used for the rule action BLOCK with a BlockResponse setting of OVERRIDE.
     */
    BlockOverrideTtl?: BlockOverrideTtl;
    /**
     * The name of the rule.
     */
    Name?: Name;
  }
  export interface UpdateFirewallRuleResponse {
    /**
     * The firewall rule that you just updated. 
     */
    FirewallRule?: FirewallRule;
  }
  export interface UpdateIpAddress {
    /**
     *  The ID of the IP address, specified by the ResolverEndpointId. 
     */
    IpId: ResourceId;
    /**
     *  The IPv6 address that you want to use for DNS queries. 
     */
    Ipv6: Ipv6;
  }
  export type UpdateIpAddresses = UpdateIpAddress[];
  export interface UpdateOutpostResolverRequest {
    /**
     * A unique string that identifies Resolver on an Outpost.
     */
    Id: ResourceId;
    /**
     * Name of the Resolver on the Outpost.
     */
    Name?: OutpostResolverName;
    /**
     * The Amazon EC2 instance count for a Resolver on the Outpost.
     */
    InstanceCount?: InstanceCount;
    /**
     *  Amazon EC2 instance type. 
     */
    PreferredInstanceType?: OutpostInstanceType;
  }
  export interface UpdateOutpostResolverResponse {
    /**
     * The response to an UpdateOutpostResolver request.
     */
    OutpostResolver?: OutpostResolver;
  }
  export interface UpdateResolverConfigRequest {
    /**
     * Resource ID of the Amazon VPC that you want to update the Resolver configuration for.
     */
    ResourceId: ResourceId;
    /**
     * Indicates whether or not the Resolver will create autodefined rules for reverse DNS lookups. This is enabled by default. Disabling this option will also affect EC2-Classic instances using ClassicLink. For more information, see ClassicLink in the Amazon EC2 guide.  We are retiring EC2-Classic on August 15, 2022. We recommend that you migrate from EC2-Classic to a VPC. For more information, see Migrate from EC2-Classic to a VPC in the Amazon EC2 guide and the blog EC2-Classic Networking is Retiring – Here’s How to Prepare.   It can take some time for the status change to be completed.  
     */
    AutodefinedReverseFlag: AutodefinedReverseFlag;
  }
  export interface UpdateResolverConfigResponse {
    /**
     * An array that contains settings for the specified Resolver configuration.
     */
    ResolverConfig?: ResolverConfig;
  }
  export interface UpdateResolverDnssecConfigRequest {
    /**
     * The ID of the virtual private cloud (VPC) that you're updating the DNSSEC validation status for.
     */
    ResourceId: ResourceId;
    /**
     * The new value that you are specifying for DNSSEC validation for the VPC. The value can be ENABLE or DISABLE. Be aware that it can take time for a validation status change to be completed.
     */
    Validation: Validation;
  }
  export interface UpdateResolverDnssecConfigResponse {
    /**
     * A complex type that contains settings for the specified DNSSEC configuration.
     */
    ResolverDNSSECConfig?: ResolverDnssecConfig;
  }
  export interface UpdateResolverEndpointRequest {
    /**
     * The ID of the Resolver endpoint that you want to update.
     */
    ResolverEndpointId: ResourceId;
    /**
     * The name of the Resolver endpoint that you want to update.
     */
    Name?: Name;
    /**
     *  Specifies the endpoint type for what type of IP address the endpoint uses to forward DNS queries.  Updating to IPV6 type isn't currently supported.
     */
    ResolverEndpointType?: ResolverEndpointType;
    /**
     *  Specifies the IPv6 address when you update the Resolver endpoint from IPv4 to dual-stack. If you don't specify an IPv6 address, one will be automatically chosen from your subnet. 
     */
    UpdateIpAddresses?: UpdateIpAddresses;
  }
  export interface UpdateResolverEndpointResponse {
    /**
     * The response to an UpdateResolverEndpoint request.
     */
    ResolverEndpoint?: ResolverEndpoint;
  }
  export interface UpdateResolverRuleRequest {
    /**
     * The ID of the Resolver rule that you want to update.
     */
    ResolverRuleId: ResourceId;
    /**
     * The new settings for the Resolver rule.
     */
    Config: ResolverRuleConfig;
  }
  export interface UpdateResolverRuleResponse {
    /**
     * The response to an UpdateResolverRule request.
     */
    ResolverRule?: ResolverRule;
  }
  export type Validation = "ENABLE"|"DISABLE"|"USE_LOCAL_RESOURCE_SETTING"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-04-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Route53Resolver client.
   */
  export import Types = Route53Resolver;
}
export = Route53Resolver;
