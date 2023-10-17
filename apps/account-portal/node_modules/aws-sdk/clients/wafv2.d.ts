import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class WAFV2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: WAFV2.Types.ClientConfiguration)
  config: Config & WAFV2.Types.ClientConfiguration;
  /**
   * Associates a web ACL with a regional application resource, to protect the resource. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  For Amazon CloudFront, don't use this call. Instead, use your CloudFront distribution configuration. To associate a web ACL, in the CloudFront call UpdateDistribution, set the web ACL ID to the Amazon Resource Name (ARN) of the web ACL. For information, see UpdateDistribution.
   */
  associateWebACL(params: WAFV2.Types.AssociateWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.AssociateWebACLResponse) => void): Request<WAFV2.Types.AssociateWebACLResponse, AWSError>;
  /**
   * Associates a web ACL with a regional application resource, to protect the resource. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  For Amazon CloudFront, don't use this call. Instead, use your CloudFront distribution configuration. To associate a web ACL, in the CloudFront call UpdateDistribution, set the web ACL ID to the Amazon Resource Name (ARN) of the web ACL. For information, see UpdateDistribution.
   */
  associateWebACL(callback?: (err: AWSError, data: WAFV2.Types.AssociateWebACLResponse) => void): Request<WAFV2.Types.AssociateWebACLResponse, AWSError>;
  /**
   * Returns the web ACL capacity unit (WCU) requirements for a specified scope and set of rules. You can use this to check the capacity requirements for the rules you want to use in a RuleGroup or WebACL.  WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500. 
   */
  checkCapacity(params: WAFV2.Types.CheckCapacityRequest, callback?: (err: AWSError, data: WAFV2.Types.CheckCapacityResponse) => void): Request<WAFV2.Types.CheckCapacityResponse, AWSError>;
  /**
   * Returns the web ACL capacity unit (WCU) requirements for a specified scope and set of rules. You can use this to check the capacity requirements for the rules you want to use in a RuleGroup or WebACL.  WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500. 
   */
  checkCapacity(callback?: (err: AWSError, data: WAFV2.Types.CheckCapacityResponse) => void): Request<WAFV2.Types.CheckCapacityResponse, AWSError>;
  /**
   * Creates an IPSet, which you use to identify web requests that originate from specific IP addresses or ranges of IP addresses. For example, if you're receiving a lot of requests from a ranges of IP addresses, you can configure WAF to block them using an IPSet that lists those IP addresses. 
   */
  createIPSet(params: WAFV2.Types.CreateIPSetRequest, callback?: (err: AWSError, data: WAFV2.Types.CreateIPSetResponse) => void): Request<WAFV2.Types.CreateIPSetResponse, AWSError>;
  /**
   * Creates an IPSet, which you use to identify web requests that originate from specific IP addresses or ranges of IP addresses. For example, if you're receiving a lot of requests from a ranges of IP addresses, you can configure WAF to block them using an IPSet that lists those IP addresses. 
   */
  createIPSet(callback?: (err: AWSError, data: WAFV2.Types.CreateIPSetResponse) => void): Request<WAFV2.Types.CreateIPSetResponse, AWSError>;
  /**
   * Creates a RegexPatternSet, which you reference in a RegexPatternSetReferenceStatement, to have WAF inspect a web request component for the specified patterns.
   */
  createRegexPatternSet(params: WAFV2.Types.CreateRegexPatternSetRequest, callback?: (err: AWSError, data: WAFV2.Types.CreateRegexPatternSetResponse) => void): Request<WAFV2.Types.CreateRegexPatternSetResponse, AWSError>;
  /**
   * Creates a RegexPatternSet, which you reference in a RegexPatternSetReferenceStatement, to have WAF inspect a web request component for the specified patterns.
   */
  createRegexPatternSet(callback?: (err: AWSError, data: WAFV2.Types.CreateRegexPatternSetResponse) => void): Request<WAFV2.Types.CreateRegexPatternSetResponse, AWSError>;
  /**
   * Creates a RuleGroup per the specifications provided.   A rule group defines a collection of rules to inspect and control web requests that you can use in a WebACL. When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements. 
   */
  createRuleGroup(params: WAFV2.Types.CreateRuleGroupRequest, callback?: (err: AWSError, data: WAFV2.Types.CreateRuleGroupResponse) => void): Request<WAFV2.Types.CreateRuleGroupResponse, AWSError>;
  /**
   * Creates a RuleGroup per the specifications provided.   A rule group defines a collection of rules to inspect and control web requests that you can use in a WebACL. When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements. 
   */
  createRuleGroup(callback?: (err: AWSError, data: WAFV2.Types.CreateRuleGroupResponse) => void): Request<WAFV2.Types.CreateRuleGroupResponse, AWSError>;
  /**
   * Creates a WebACL per the specifications provided.  A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has an action defined (allow, block, or count) for requests that match the statement of the rule. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resources can be an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer, or an AppSync GraphQL API. 
   */
  createWebACL(params: WAFV2.Types.CreateWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.CreateWebACLResponse) => void): Request<WAFV2.Types.CreateWebACLResponse, AWSError>;
  /**
   * Creates a WebACL per the specifications provided.  A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has an action defined (allow, block, or count) for requests that match the statement of the rule. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resources can be an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer, or an AppSync GraphQL API. 
   */
  createWebACL(callback?: (err: AWSError, data: WAFV2.Types.CreateWebACLResponse) => void): Request<WAFV2.Types.CreateWebACLResponse, AWSError>;
  /**
   * Deletes all rule groups that are managed by Firewall Manager for the specified web ACL.  You can only use this if ManagedByFirewallManager is false in the specified WebACL. 
   */
  deleteFirewallManagerRuleGroups(params: WAFV2.Types.DeleteFirewallManagerRuleGroupsRequest, callback?: (err: AWSError, data: WAFV2.Types.DeleteFirewallManagerRuleGroupsResponse) => void): Request<WAFV2.Types.DeleteFirewallManagerRuleGroupsResponse, AWSError>;
  /**
   * Deletes all rule groups that are managed by Firewall Manager for the specified web ACL.  You can only use this if ManagedByFirewallManager is false in the specified WebACL. 
   */
  deleteFirewallManagerRuleGroups(callback?: (err: AWSError, data: WAFV2.Types.DeleteFirewallManagerRuleGroupsResponse) => void): Request<WAFV2.Types.DeleteFirewallManagerRuleGroupsResponse, AWSError>;
  /**
   * Deletes the specified IPSet. 
   */
  deleteIPSet(params: WAFV2.Types.DeleteIPSetRequest, callback?: (err: AWSError, data: WAFV2.Types.DeleteIPSetResponse) => void): Request<WAFV2.Types.DeleteIPSetResponse, AWSError>;
  /**
   * Deletes the specified IPSet. 
   */
  deleteIPSet(callback?: (err: AWSError, data: WAFV2.Types.DeleteIPSetResponse) => void): Request<WAFV2.Types.DeleteIPSetResponse, AWSError>;
  /**
   * Deletes the LoggingConfiguration from the specified web ACL.
   */
  deleteLoggingConfiguration(params: WAFV2.Types.DeleteLoggingConfigurationRequest, callback?: (err: AWSError, data: WAFV2.Types.DeleteLoggingConfigurationResponse) => void): Request<WAFV2.Types.DeleteLoggingConfigurationResponse, AWSError>;
  /**
   * Deletes the LoggingConfiguration from the specified web ACL.
   */
  deleteLoggingConfiguration(callback?: (err: AWSError, data: WAFV2.Types.DeleteLoggingConfigurationResponse) => void): Request<WAFV2.Types.DeleteLoggingConfigurationResponse, AWSError>;
  /**
   * Permanently deletes an IAM policy from the specified rule group. You must be the owner of the rule group to perform this operation.
   */
  deletePermissionPolicy(params: WAFV2.Types.DeletePermissionPolicyRequest, callback?: (err: AWSError, data: WAFV2.Types.DeletePermissionPolicyResponse) => void): Request<WAFV2.Types.DeletePermissionPolicyResponse, AWSError>;
  /**
   * Permanently deletes an IAM policy from the specified rule group. You must be the owner of the rule group to perform this operation.
   */
  deletePermissionPolicy(callback?: (err: AWSError, data: WAFV2.Types.DeletePermissionPolicyResponse) => void): Request<WAFV2.Types.DeletePermissionPolicyResponse, AWSError>;
  /**
   * Deletes the specified RegexPatternSet.
   */
  deleteRegexPatternSet(params: WAFV2.Types.DeleteRegexPatternSetRequest, callback?: (err: AWSError, data: WAFV2.Types.DeleteRegexPatternSetResponse) => void): Request<WAFV2.Types.DeleteRegexPatternSetResponse, AWSError>;
  /**
   * Deletes the specified RegexPatternSet.
   */
  deleteRegexPatternSet(callback?: (err: AWSError, data: WAFV2.Types.DeleteRegexPatternSetResponse) => void): Request<WAFV2.Types.DeleteRegexPatternSetResponse, AWSError>;
  /**
   * Deletes the specified RuleGroup.
   */
  deleteRuleGroup(params: WAFV2.Types.DeleteRuleGroupRequest, callback?: (err: AWSError, data: WAFV2.Types.DeleteRuleGroupResponse) => void): Request<WAFV2.Types.DeleteRuleGroupResponse, AWSError>;
  /**
   * Deletes the specified RuleGroup.
   */
  deleteRuleGroup(callback?: (err: AWSError, data: WAFV2.Types.DeleteRuleGroupResponse) => void): Request<WAFV2.Types.DeleteRuleGroupResponse, AWSError>;
  /**
   * Deletes the specified WebACL. You can only use this if ManagedByFirewallManager is false in the specified WebACL. 
   */
  deleteWebACL(params: WAFV2.Types.DeleteWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.DeleteWebACLResponse) => void): Request<WAFV2.Types.DeleteWebACLResponse, AWSError>;
  /**
   * Deletes the specified WebACL. You can only use this if ManagedByFirewallManager is false in the specified WebACL. 
   */
  deleteWebACL(callback?: (err: AWSError, data: WAFV2.Types.DeleteWebACLResponse) => void): Request<WAFV2.Types.DeleteWebACLResponse, AWSError>;
  /**
   * Provides high-level information for a managed rule group, including descriptions of the rules. 
   */
  describeManagedRuleGroup(params: WAFV2.Types.DescribeManagedRuleGroupRequest, callback?: (err: AWSError, data: WAFV2.Types.DescribeManagedRuleGroupResponse) => void): Request<WAFV2.Types.DescribeManagedRuleGroupResponse, AWSError>;
  /**
   * Provides high-level information for a managed rule group, including descriptions of the rules. 
   */
  describeManagedRuleGroup(callback?: (err: AWSError, data: WAFV2.Types.DescribeManagedRuleGroupResponse) => void): Request<WAFV2.Types.DescribeManagedRuleGroupResponse, AWSError>;
  /**
   * Disassociates a web ACL from a regional application resource. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  For Amazon CloudFront, don't use this call. Instead, use your CloudFront distribution configuration. To disassociate a web ACL, provide an empty web ACL ID in the CloudFront call UpdateDistribution. For information, see UpdateDistribution.
   */
  disassociateWebACL(params: WAFV2.Types.DisassociateWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.DisassociateWebACLResponse) => void): Request<WAFV2.Types.DisassociateWebACLResponse, AWSError>;
  /**
   * Disassociates a web ACL from a regional application resource. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  For Amazon CloudFront, don't use this call. Instead, use your CloudFront distribution configuration. To disassociate a web ACL, provide an empty web ACL ID in the CloudFront call UpdateDistribution. For information, see UpdateDistribution.
   */
  disassociateWebACL(callback?: (err: AWSError, data: WAFV2.Types.DisassociateWebACLResponse) => void): Request<WAFV2.Types.DisassociateWebACLResponse, AWSError>;
  /**
   * Retrieves the specified IPSet.
   */
  getIPSet(params: WAFV2.Types.GetIPSetRequest, callback?: (err: AWSError, data: WAFV2.Types.GetIPSetResponse) => void): Request<WAFV2.Types.GetIPSetResponse, AWSError>;
  /**
   * Retrieves the specified IPSet.
   */
  getIPSet(callback?: (err: AWSError, data: WAFV2.Types.GetIPSetResponse) => void): Request<WAFV2.Types.GetIPSetResponse, AWSError>;
  /**
   * Returns the LoggingConfiguration for the specified web ACL.
   */
  getLoggingConfiguration(params: WAFV2.Types.GetLoggingConfigurationRequest, callback?: (err: AWSError, data: WAFV2.Types.GetLoggingConfigurationResponse) => void): Request<WAFV2.Types.GetLoggingConfigurationResponse, AWSError>;
  /**
   * Returns the LoggingConfiguration for the specified web ACL.
   */
  getLoggingConfiguration(callback?: (err: AWSError, data: WAFV2.Types.GetLoggingConfigurationResponse) => void): Request<WAFV2.Types.GetLoggingConfigurationResponse, AWSError>;
  /**
   * Retrieves the specified managed rule set.   This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.  Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are ListManagedRuleSets, GetManagedRuleSet, PutManagedRuleSetVersions, and UpdateManagedRuleSetVersionExpiryDate. 
   */
  getManagedRuleSet(params: WAFV2.Types.GetManagedRuleSetRequest, callback?: (err: AWSError, data: WAFV2.Types.GetManagedRuleSetResponse) => void): Request<WAFV2.Types.GetManagedRuleSetResponse, AWSError>;
  /**
   * Retrieves the specified managed rule set.   This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.  Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are ListManagedRuleSets, GetManagedRuleSet, PutManagedRuleSetVersions, and UpdateManagedRuleSetVersionExpiryDate. 
   */
  getManagedRuleSet(callback?: (err: AWSError, data: WAFV2.Types.GetManagedRuleSetResponse) => void): Request<WAFV2.Types.GetManagedRuleSetResponse, AWSError>;
  /**
   * Returns the IAM policy that is attached to the specified rule group. You must be the owner of the rule group to perform this operation.
   */
  getPermissionPolicy(params: WAFV2.Types.GetPermissionPolicyRequest, callback?: (err: AWSError, data: WAFV2.Types.GetPermissionPolicyResponse) => void): Request<WAFV2.Types.GetPermissionPolicyResponse, AWSError>;
  /**
   * Returns the IAM policy that is attached to the specified rule group. You must be the owner of the rule group to perform this operation.
   */
  getPermissionPolicy(callback?: (err: AWSError, data: WAFV2.Types.GetPermissionPolicyResponse) => void): Request<WAFV2.Types.GetPermissionPolicyResponse, AWSError>;
  /**
   * Retrieves the keys that are currently blocked by a rate-based rule instance. The maximum number of managed keys that can be blocked for a single rate-based rule instance is 10,000. If more than 10,000 addresses exceed the rate limit, those with the highest rates are blocked. For a rate-based rule that you've defined inside a rule group, provide the name of the rule group reference statement in your request, in addition to the rate-based rule name and the web ACL name.  WAF monitors web requests and manages keys independently for each unique combination of web ACL, optional rule group, and rate-based rule. For example, if you define a rate-based rule inside a rule group, and then use the rule group in a web ACL, WAF monitors web requests and manages keys for that web ACL, rule group reference statement, and rate-based rule instance. If you use the same rule group in a second web ACL, WAF monitors web requests and manages keys for this second usage completely independent of your first. 
   */
  getRateBasedStatementManagedKeys(params: WAFV2.Types.GetRateBasedStatementManagedKeysRequest, callback?: (err: AWSError, data: WAFV2.Types.GetRateBasedStatementManagedKeysResponse) => void): Request<WAFV2.Types.GetRateBasedStatementManagedKeysResponse, AWSError>;
  /**
   * Retrieves the keys that are currently blocked by a rate-based rule instance. The maximum number of managed keys that can be blocked for a single rate-based rule instance is 10,000. If more than 10,000 addresses exceed the rate limit, those with the highest rates are blocked. For a rate-based rule that you've defined inside a rule group, provide the name of the rule group reference statement in your request, in addition to the rate-based rule name and the web ACL name.  WAF monitors web requests and manages keys independently for each unique combination of web ACL, optional rule group, and rate-based rule. For example, if you define a rate-based rule inside a rule group, and then use the rule group in a web ACL, WAF monitors web requests and manages keys for that web ACL, rule group reference statement, and rate-based rule instance. If you use the same rule group in a second web ACL, WAF monitors web requests and manages keys for this second usage completely independent of your first. 
   */
  getRateBasedStatementManagedKeys(callback?: (err: AWSError, data: WAFV2.Types.GetRateBasedStatementManagedKeysResponse) => void): Request<WAFV2.Types.GetRateBasedStatementManagedKeysResponse, AWSError>;
  /**
   * Retrieves the specified RegexPatternSet.
   */
  getRegexPatternSet(params: WAFV2.Types.GetRegexPatternSetRequest, callback?: (err: AWSError, data: WAFV2.Types.GetRegexPatternSetResponse) => void): Request<WAFV2.Types.GetRegexPatternSetResponse, AWSError>;
  /**
   * Retrieves the specified RegexPatternSet.
   */
  getRegexPatternSet(callback?: (err: AWSError, data: WAFV2.Types.GetRegexPatternSetResponse) => void): Request<WAFV2.Types.GetRegexPatternSetResponse, AWSError>;
  /**
   * Retrieves the specified RuleGroup.
   */
  getRuleGroup(params: WAFV2.Types.GetRuleGroupRequest, callback?: (err: AWSError, data: WAFV2.Types.GetRuleGroupResponse) => void): Request<WAFV2.Types.GetRuleGroupResponse, AWSError>;
  /**
   * Retrieves the specified RuleGroup.
   */
  getRuleGroup(callback?: (err: AWSError, data: WAFV2.Types.GetRuleGroupResponse) => void): Request<WAFV2.Types.GetRuleGroupResponse, AWSError>;
  /**
   * Gets detailed information about a specified number of requests--a sample--that WAF randomly selects from among the first 5,000 requests that your Amazon Web Services resource received during a time range that you choose. You can specify a sample size of up to 500 requests, and you can specify any time range in the previous three hours.  GetSampledRequests returns a time range, which is usually the time range that you specified. However, if your resource (such as a CloudFront distribution) received 5,000 requests before the specified time range elapsed, GetSampledRequests returns an updated time range. This new time range indicates the actual period during which WAF selected the requests in the sample.
   */
  getSampledRequests(params: WAFV2.Types.GetSampledRequestsRequest, callback?: (err: AWSError, data: WAFV2.Types.GetSampledRequestsResponse) => void): Request<WAFV2.Types.GetSampledRequestsResponse, AWSError>;
  /**
   * Gets detailed information about a specified number of requests--a sample--that WAF randomly selects from among the first 5,000 requests that your Amazon Web Services resource received during a time range that you choose. You can specify a sample size of up to 500 requests, and you can specify any time range in the previous three hours.  GetSampledRequests returns a time range, which is usually the time range that you specified. However, if your resource (such as a CloudFront distribution) received 5,000 requests before the specified time range elapsed, GetSampledRequests returns an updated time range. This new time range indicates the actual period during which WAF selected the requests in the sample.
   */
  getSampledRequests(callback?: (err: AWSError, data: WAFV2.Types.GetSampledRequestsResponse) => void): Request<WAFV2.Types.GetSampledRequestsResponse, AWSError>;
  /**
   * Retrieves the specified WebACL.
   */
  getWebACL(params: WAFV2.Types.GetWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.GetWebACLResponse) => void): Request<WAFV2.Types.GetWebACLResponse, AWSError>;
  /**
   * Retrieves the specified WebACL.
   */
  getWebACL(callback?: (err: AWSError, data: WAFV2.Types.GetWebACLResponse) => void): Request<WAFV2.Types.GetWebACLResponse, AWSError>;
  /**
   * Retrieves the WebACL for the specified resource. 
   */
  getWebACLForResource(params: WAFV2.Types.GetWebACLForResourceRequest, callback?: (err: AWSError, data: WAFV2.Types.GetWebACLForResourceResponse) => void): Request<WAFV2.Types.GetWebACLForResourceResponse, AWSError>;
  /**
   * Retrieves the WebACL for the specified resource. 
   */
  getWebACLForResource(callback?: (err: AWSError, data: WAFV2.Types.GetWebACLForResourceResponse) => void): Request<WAFV2.Types.GetWebACLForResourceResponse, AWSError>;
  /**
   * Returns a list of the available versions for the specified managed rule group. 
   */
  listAvailableManagedRuleGroupVersions(params: WAFV2.Types.ListAvailableManagedRuleGroupVersionsRequest, callback?: (err: AWSError, data: WAFV2.Types.ListAvailableManagedRuleGroupVersionsResponse) => void): Request<WAFV2.Types.ListAvailableManagedRuleGroupVersionsResponse, AWSError>;
  /**
   * Returns a list of the available versions for the specified managed rule group. 
   */
  listAvailableManagedRuleGroupVersions(callback?: (err: AWSError, data: WAFV2.Types.ListAvailableManagedRuleGroupVersionsResponse) => void): Request<WAFV2.Types.ListAvailableManagedRuleGroupVersionsResponse, AWSError>;
  /**
   * Retrieves an array of managed rule groups that are available for you to use. This list includes all Amazon Web Services Managed Rules rule groups and all of the Amazon Web Services Marketplace managed rule groups that you're subscribed to.
   */
  listAvailableManagedRuleGroups(params: WAFV2.Types.ListAvailableManagedRuleGroupsRequest, callback?: (err: AWSError, data: WAFV2.Types.ListAvailableManagedRuleGroupsResponse) => void): Request<WAFV2.Types.ListAvailableManagedRuleGroupsResponse, AWSError>;
  /**
   * Retrieves an array of managed rule groups that are available for you to use. This list includes all Amazon Web Services Managed Rules rule groups and all of the Amazon Web Services Marketplace managed rule groups that you're subscribed to.
   */
  listAvailableManagedRuleGroups(callback?: (err: AWSError, data: WAFV2.Types.ListAvailableManagedRuleGroupsResponse) => void): Request<WAFV2.Types.ListAvailableManagedRuleGroupsResponse, AWSError>;
  /**
   * Retrieves an array of IPSetSummary objects for the IP sets that you manage.
   */
  listIPSets(params: WAFV2.Types.ListIPSetsRequest, callback?: (err: AWSError, data: WAFV2.Types.ListIPSetsResponse) => void): Request<WAFV2.Types.ListIPSetsResponse, AWSError>;
  /**
   * Retrieves an array of IPSetSummary objects for the IP sets that you manage.
   */
  listIPSets(callback?: (err: AWSError, data: WAFV2.Types.ListIPSetsResponse) => void): Request<WAFV2.Types.ListIPSetsResponse, AWSError>;
  /**
   * Retrieves an array of your LoggingConfiguration objects.
   */
  listLoggingConfigurations(params: WAFV2.Types.ListLoggingConfigurationsRequest, callback?: (err: AWSError, data: WAFV2.Types.ListLoggingConfigurationsResponse) => void): Request<WAFV2.Types.ListLoggingConfigurationsResponse, AWSError>;
  /**
   * Retrieves an array of your LoggingConfiguration objects.
   */
  listLoggingConfigurations(callback?: (err: AWSError, data: WAFV2.Types.ListLoggingConfigurationsResponse) => void): Request<WAFV2.Types.ListLoggingConfigurationsResponse, AWSError>;
  /**
   * Retrieves the managed rule sets that you own.   This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.  Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are ListManagedRuleSets, GetManagedRuleSet, PutManagedRuleSetVersions, and UpdateManagedRuleSetVersionExpiryDate. 
   */
  listManagedRuleSets(params: WAFV2.Types.ListManagedRuleSetsRequest, callback?: (err: AWSError, data: WAFV2.Types.ListManagedRuleSetsResponse) => void): Request<WAFV2.Types.ListManagedRuleSetsResponse, AWSError>;
  /**
   * Retrieves the managed rule sets that you own.   This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.  Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are ListManagedRuleSets, GetManagedRuleSet, PutManagedRuleSetVersions, and UpdateManagedRuleSetVersionExpiryDate. 
   */
  listManagedRuleSets(callback?: (err: AWSError, data: WAFV2.Types.ListManagedRuleSetsResponse) => void): Request<WAFV2.Types.ListManagedRuleSetsResponse, AWSError>;
  /**
   * Retrieves an array of RegexPatternSetSummary objects for the regex pattern sets that you manage.
   */
  listRegexPatternSets(params: WAFV2.Types.ListRegexPatternSetsRequest, callback?: (err: AWSError, data: WAFV2.Types.ListRegexPatternSetsResponse) => void): Request<WAFV2.Types.ListRegexPatternSetsResponse, AWSError>;
  /**
   * Retrieves an array of RegexPatternSetSummary objects for the regex pattern sets that you manage.
   */
  listRegexPatternSets(callback?: (err: AWSError, data: WAFV2.Types.ListRegexPatternSetsResponse) => void): Request<WAFV2.Types.ListRegexPatternSetsResponse, AWSError>;
  /**
   * Retrieves an array of the Amazon Resource Names (ARNs) for the regional resources that are associated with the specified web ACL. If you want the list of Amazon CloudFront resources, use the CloudFront call ListDistributionsByWebACLId. 
   */
  listResourcesForWebACL(params: WAFV2.Types.ListResourcesForWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.ListResourcesForWebACLResponse) => void): Request<WAFV2.Types.ListResourcesForWebACLResponse, AWSError>;
  /**
   * Retrieves an array of the Amazon Resource Names (ARNs) for the regional resources that are associated with the specified web ACL. If you want the list of Amazon CloudFront resources, use the CloudFront call ListDistributionsByWebACLId. 
   */
  listResourcesForWebACL(callback?: (err: AWSError, data: WAFV2.Types.ListResourcesForWebACLResponse) => void): Request<WAFV2.Types.ListResourcesForWebACLResponse, AWSError>;
  /**
   * Retrieves an array of RuleGroupSummary objects for the rule groups that you manage. 
   */
  listRuleGroups(params: WAFV2.Types.ListRuleGroupsRequest, callback?: (err: AWSError, data: WAFV2.Types.ListRuleGroupsResponse) => void): Request<WAFV2.Types.ListRuleGroupsResponse, AWSError>;
  /**
   * Retrieves an array of RuleGroupSummary objects for the rule groups that you manage. 
   */
  listRuleGroups(callback?: (err: AWSError, data: WAFV2.Types.ListRuleGroupsResponse) => void): Request<WAFV2.Types.ListRuleGroupsResponse, AWSError>;
  /**
   * Retrieves the TagInfoForResource for the specified resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a resource. You can tag the Amazon Web Services resources that you manage through WAF: web ACLs, rule groups, IP sets, and regex pattern sets. You can't manage or view tags through the WAF console. 
   */
  listTagsForResource(params: WAFV2.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: WAFV2.Types.ListTagsForResourceResponse) => void): Request<WAFV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves the TagInfoForResource for the specified resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a resource. You can tag the Amazon Web Services resources that you manage through WAF: web ACLs, rule groups, IP sets, and regex pattern sets. You can't manage or view tags through the WAF console. 
   */
  listTagsForResource(callback?: (err: AWSError, data: WAFV2.Types.ListTagsForResourceResponse) => void): Request<WAFV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves an array of WebACLSummary objects for the web ACLs that you manage.
   */
  listWebACLs(params: WAFV2.Types.ListWebACLsRequest, callback?: (err: AWSError, data: WAFV2.Types.ListWebACLsResponse) => void): Request<WAFV2.Types.ListWebACLsResponse, AWSError>;
  /**
   * Retrieves an array of WebACLSummary objects for the web ACLs that you manage.
   */
  listWebACLs(callback?: (err: AWSError, data: WAFV2.Types.ListWebACLsResponse) => void): Request<WAFV2.Types.ListWebACLsResponse, AWSError>;
  /**
   * Enables the specified LoggingConfiguration, to start logging from a web ACL, according to the configuration provided. You can access information about all traffic that WAF inspects using the following steps:   Create an Amazon Kinesis Data Firehose.  Create the data firehose with a PUT source and in the Region that you are operating. If you are capturing logs for Amazon CloudFront, always create the firehose in US East (N. Virginia).  Give the data firehose a name that starts with the prefix aws-waf-logs-. For example, aws-waf-logs-us-east-2-analytics.  Do not create the data firehose using a Kinesis stream as your source.    Associate that firehose to your web ACL using a PutLoggingConfiguration request.   When you successfully enable logging using a PutLoggingConfiguration request, WAF will create a service linked role with the necessary permissions to write logs to the Amazon Kinesis Data Firehose. For more information, see Logging Web ACL Traffic Information in the WAF Developer Guide.  This operation completely replaces the mutable specifications that you already have for the logging configuration with the ones that you provide to this call. To modify the logging configuration, retrieve it by calling GetLoggingConfiguration, update the settings as needed, and then provide the complete logging configuration specification to this call. 
   */
  putLoggingConfiguration(params: WAFV2.Types.PutLoggingConfigurationRequest, callback?: (err: AWSError, data: WAFV2.Types.PutLoggingConfigurationResponse) => void): Request<WAFV2.Types.PutLoggingConfigurationResponse, AWSError>;
  /**
   * Enables the specified LoggingConfiguration, to start logging from a web ACL, according to the configuration provided. You can access information about all traffic that WAF inspects using the following steps:   Create an Amazon Kinesis Data Firehose.  Create the data firehose with a PUT source and in the Region that you are operating. If you are capturing logs for Amazon CloudFront, always create the firehose in US East (N. Virginia).  Give the data firehose a name that starts with the prefix aws-waf-logs-. For example, aws-waf-logs-us-east-2-analytics.  Do not create the data firehose using a Kinesis stream as your source.    Associate that firehose to your web ACL using a PutLoggingConfiguration request.   When you successfully enable logging using a PutLoggingConfiguration request, WAF will create a service linked role with the necessary permissions to write logs to the Amazon Kinesis Data Firehose. For more information, see Logging Web ACL Traffic Information in the WAF Developer Guide.  This operation completely replaces the mutable specifications that you already have for the logging configuration with the ones that you provide to this call. To modify the logging configuration, retrieve it by calling GetLoggingConfiguration, update the settings as needed, and then provide the complete logging configuration specification to this call. 
   */
  putLoggingConfiguration(callback?: (err: AWSError, data: WAFV2.Types.PutLoggingConfigurationResponse) => void): Request<WAFV2.Types.PutLoggingConfigurationResponse, AWSError>;
  /**
   * Defines the versions of your managed rule set that you are offering to the customers. Customers see your offerings as managed rule groups with versioning.  This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.  Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are ListManagedRuleSets, GetManagedRuleSet, PutManagedRuleSetVersions, and UpdateManagedRuleSetVersionExpiryDate.  Customers retrieve their managed rule group list by calling ListAvailableManagedRuleGroups. The name that you provide here for your managed rule set is the name the customer sees for the corresponding managed rule group. Customers can retrieve the available versions for a managed rule group by calling ListAvailableManagedRuleGroupVersions. You provide a rule group specification for each version. For each managed rule set, you must specify a version that you recommend using.  To initiate the expiration of a managed rule group version, use UpdateManagedRuleSetVersionExpiryDate.
   */
  putManagedRuleSetVersions(params: WAFV2.Types.PutManagedRuleSetVersionsRequest, callback?: (err: AWSError, data: WAFV2.Types.PutManagedRuleSetVersionsResponse) => void): Request<WAFV2.Types.PutManagedRuleSetVersionsResponse, AWSError>;
  /**
   * Defines the versions of your managed rule set that you are offering to the customers. Customers see your offerings as managed rule groups with versioning.  This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.  Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are ListManagedRuleSets, GetManagedRuleSet, PutManagedRuleSetVersions, and UpdateManagedRuleSetVersionExpiryDate.  Customers retrieve their managed rule group list by calling ListAvailableManagedRuleGroups. The name that you provide here for your managed rule set is the name the customer sees for the corresponding managed rule group. Customers can retrieve the available versions for a managed rule group by calling ListAvailableManagedRuleGroupVersions. You provide a rule group specification for each version. For each managed rule set, you must specify a version that you recommend using.  To initiate the expiration of a managed rule group version, use UpdateManagedRuleSetVersionExpiryDate.
   */
  putManagedRuleSetVersions(callback?: (err: AWSError, data: WAFV2.Types.PutManagedRuleSetVersionsResponse) => void): Request<WAFV2.Types.PutManagedRuleSetVersionsResponse, AWSError>;
  /**
   * Attaches an IAM policy to the specified resource. Use this to share a rule group across accounts. You must be the owner of the rule group to perform this operation. This action is subject to the following restrictions:   You can attach only one policy with each PutPermissionPolicy request.   The ARN in the request must be a valid WAF RuleGroup ARN and the rule group must exist in the same Region.   The user making the request must be the owner of the rule group.  
   */
  putPermissionPolicy(params: WAFV2.Types.PutPermissionPolicyRequest, callback?: (err: AWSError, data: WAFV2.Types.PutPermissionPolicyResponse) => void): Request<WAFV2.Types.PutPermissionPolicyResponse, AWSError>;
  /**
   * Attaches an IAM policy to the specified resource. Use this to share a rule group across accounts. You must be the owner of the rule group to perform this operation. This action is subject to the following restrictions:   You can attach only one policy with each PutPermissionPolicy request.   The ARN in the request must be a valid WAF RuleGroup ARN and the rule group must exist in the same Region.   The user making the request must be the owner of the rule group.  
   */
  putPermissionPolicy(callback?: (err: AWSError, data: WAFV2.Types.PutPermissionPolicyResponse) => void): Request<WAFV2.Types.PutPermissionPolicyResponse, AWSError>;
  /**
   * Associates tags with the specified Amazon Web Services resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a resource. You can tag the Amazon Web Services resources that you manage through WAF: web ACLs, rule groups, IP sets, and regex pattern sets. You can't manage or view tags through the WAF console. 
   */
  tagResource(params: WAFV2.Types.TagResourceRequest, callback?: (err: AWSError, data: WAFV2.Types.TagResourceResponse) => void): Request<WAFV2.Types.TagResourceResponse, AWSError>;
  /**
   * Associates tags with the specified Amazon Web Services resource. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a resource. You can tag the Amazon Web Services resources that you manage through WAF: web ACLs, rule groups, IP sets, and regex pattern sets. You can't manage or view tags through the WAF console. 
   */
  tagResource(callback?: (err: AWSError, data: WAFV2.Types.TagResourceResponse) => void): Request<WAFV2.Types.TagResourceResponse, AWSError>;
  /**
   * Disassociates tags from an Amazon Web Services resource. Tags are key:value pairs that you can associate with Amazon Web Services resources. For example, the tag key might be "customer" and the tag value might be "companyA." You can specify one or more tags to add to each container. You can add up to 50 tags to each Amazon Web Services resource.
   */
  untagResource(params: WAFV2.Types.UntagResourceRequest, callback?: (err: AWSError, data: WAFV2.Types.UntagResourceResponse) => void): Request<WAFV2.Types.UntagResourceResponse, AWSError>;
  /**
   * Disassociates tags from an Amazon Web Services resource. Tags are key:value pairs that you can associate with Amazon Web Services resources. For example, the tag key might be "customer" and the tag value might be "companyA." You can specify one or more tags to add to each container. You can add up to 50 tags to each Amazon Web Services resource.
   */
  untagResource(callback?: (err: AWSError, data: WAFV2.Types.UntagResourceResponse) => void): Request<WAFV2.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the specified IPSet.   This operation completely replaces the mutable specifications that you already have for the IP set with the ones that you provide to this call. To modify the IP set, retrieve it by calling GetIPSet, update the settings as needed, and then provide the complete IP set specification to this call. 
   */
  updateIPSet(params: WAFV2.Types.UpdateIPSetRequest, callback?: (err: AWSError, data: WAFV2.Types.UpdateIPSetResponse) => void): Request<WAFV2.Types.UpdateIPSetResponse, AWSError>;
  /**
   * Updates the specified IPSet.   This operation completely replaces the mutable specifications that you already have for the IP set with the ones that you provide to this call. To modify the IP set, retrieve it by calling GetIPSet, update the settings as needed, and then provide the complete IP set specification to this call. 
   */
  updateIPSet(callback?: (err: AWSError, data: WAFV2.Types.UpdateIPSetResponse) => void): Request<WAFV2.Types.UpdateIPSetResponse, AWSError>;
  /**
   * Updates the expiration information for your managed rule set. Use this to initiate the expiration of a managed rule group version. After you initiate expiration for a version, WAF excludes it from the reponse to ListAvailableManagedRuleGroupVersions for the managed rule group.   This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.  Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are ListManagedRuleSets, GetManagedRuleSet, PutManagedRuleSetVersions, and UpdateManagedRuleSetVersionExpiryDate. 
   */
  updateManagedRuleSetVersionExpiryDate(params: WAFV2.Types.UpdateManagedRuleSetVersionExpiryDateRequest, callback?: (err: AWSError, data: WAFV2.Types.UpdateManagedRuleSetVersionExpiryDateResponse) => void): Request<WAFV2.Types.UpdateManagedRuleSetVersionExpiryDateResponse, AWSError>;
  /**
   * Updates the expiration information for your managed rule set. Use this to initiate the expiration of a managed rule group version. After you initiate expiration for a version, WAF excludes it from the reponse to ListAvailableManagedRuleGroupVersions for the managed rule group.   This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.  Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are ListManagedRuleSets, GetManagedRuleSet, PutManagedRuleSetVersions, and UpdateManagedRuleSetVersionExpiryDate. 
   */
  updateManagedRuleSetVersionExpiryDate(callback?: (err: AWSError, data: WAFV2.Types.UpdateManagedRuleSetVersionExpiryDateResponse) => void): Request<WAFV2.Types.UpdateManagedRuleSetVersionExpiryDateResponse, AWSError>;
  /**
   * Updates the specified RegexPatternSet.  This operation completely replaces the mutable specifications that you already have for the regex pattern set with the ones that you provide to this call. To modify the regex pattern set, retrieve it by calling GetRegexPatternSet, update the settings as needed, and then provide the complete regex pattern set specification to this call. 
   */
  updateRegexPatternSet(params: WAFV2.Types.UpdateRegexPatternSetRequest, callback?: (err: AWSError, data: WAFV2.Types.UpdateRegexPatternSetResponse) => void): Request<WAFV2.Types.UpdateRegexPatternSetResponse, AWSError>;
  /**
   * Updates the specified RegexPatternSet.  This operation completely replaces the mutable specifications that you already have for the regex pattern set with the ones that you provide to this call. To modify the regex pattern set, retrieve it by calling GetRegexPatternSet, update the settings as needed, and then provide the complete regex pattern set specification to this call. 
   */
  updateRegexPatternSet(callback?: (err: AWSError, data: WAFV2.Types.UpdateRegexPatternSetResponse) => void): Request<WAFV2.Types.UpdateRegexPatternSetResponse, AWSError>;
  /**
   * Updates the specified RuleGroup.  This operation completely replaces the mutable specifications that you already have for the rule group with the ones that you provide to this call. To modify the rule group, retrieve it by calling GetRuleGroup, update the settings as needed, and then provide the complete rule group specification to this call.   A rule group defines a collection of rules to inspect and control web requests that you can use in a WebACL. When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements. 
   */
  updateRuleGroup(params: WAFV2.Types.UpdateRuleGroupRequest, callback?: (err: AWSError, data: WAFV2.Types.UpdateRuleGroupResponse) => void): Request<WAFV2.Types.UpdateRuleGroupResponse, AWSError>;
  /**
   * Updates the specified RuleGroup.  This operation completely replaces the mutable specifications that you already have for the rule group with the ones that you provide to this call. To modify the rule group, retrieve it by calling GetRuleGroup, update the settings as needed, and then provide the complete rule group specification to this call.   A rule group defines a collection of rules to inspect and control web requests that you can use in a WebACL. When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements. 
   */
  updateRuleGroup(callback?: (err: AWSError, data: WAFV2.Types.UpdateRuleGroupResponse) => void): Request<WAFV2.Types.UpdateRuleGroupResponse, AWSError>;
  /**
   * Updates the specified WebACL.  This operation completely replaces the mutable specifications that you already have for the web ACL with the ones that you provide to this call. To modify the web ACL, retrieve it by calling GetWebACL, update the settings as needed, and then provide the complete web ACL specification to this call.   A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has an action defined (allow, block, or count) for requests that match the statement of the rule. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resources can be an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer, or an AppSync GraphQL API. 
   */
  updateWebACL(params: WAFV2.Types.UpdateWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.UpdateWebACLResponse) => void): Request<WAFV2.Types.UpdateWebACLResponse, AWSError>;
  /**
   * Updates the specified WebACL.  This operation completely replaces the mutable specifications that you already have for the web ACL with the ones that you provide to this call. To modify the web ACL, retrieve it by calling GetWebACL, update the settings as needed, and then provide the complete web ACL specification to this call.   A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has an action defined (allow, block, or count) for requests that match the statement of the rule. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resources can be an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer, or an AppSync GraphQL API. 
   */
  updateWebACL(callback?: (err: AWSError, data: WAFV2.Types.UpdateWebACLResponse) => void): Request<WAFV2.Types.UpdateWebACLResponse, AWSError>;
}
declare namespace WAFV2 {
  export type Action = string;
  export interface ActionCondition {
    /**
     * The action setting that a log record must contain in order to meet the condition. 
     */
    Action: ActionValue;
  }
  export type ActionValue = "ALLOW"|"BLOCK"|"COUNT"|string;
  export interface All {
  }
  export interface AllQueryArguments {
  }
  export interface AllowAction {
    /**
     * Defines custom handling for the web request. For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide. 
     */
    CustomRequestHandling?: CustomRequestHandling;
  }
  export interface AndStatement {
    /**
     * The statements to combine with AND logic. You can use any statements that can be nested. 
     */
    Statements: Statements;
  }
  export interface AssociateWebACLRequest {
    /**
     * The Amazon Resource Name (ARN) of the web ACL that you want to associate with the resource.
     */
    WebACLArn: ResourceArn;
    /**
     * The Amazon Resource Name (ARN) of the resource to associate with the web ACL.  The ARN must be in one of the following formats:   For an Application Load Balancer: arn:aws:elasticloadbalancing:region:account-id:loadbalancer/app/load-balancer-name/load-balancer-id     For an Amazon API Gateway REST API: arn:aws:apigateway:region::/restapis/api-id/stages/stage-name     For an AppSync GraphQL API: arn:aws:appsync:region:account-id:apis/GraphQLApiId    
     */
    ResourceArn: ResourceArn;
  }
  export interface AssociateWebACLResponse {
  }
  export interface BlockAction {
    /**
     * Defines a custom response for the web request. For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide. 
     */
    CustomResponse?: CustomResponse;
  }
  export interface Body {
  }
  export type BodyParsingFallbackBehavior = "MATCH"|"NO_MATCH"|"EVALUATE_AS_STRING"|string;
  export type Boolean = boolean;
  export interface ByteMatchStatement {
    /**
     * A string value that you want WAF to search for. WAF searches only in the part of web requests that you designate for inspection in FieldToMatch. The maximum length of the value is 50 bytes. Valid values depend on the component that you specify for inspection in FieldToMatch:    Method: The HTTP method that you want WAF to search for. This indicates the type of operation specified in the request.     UriPath: The value that you want WAF to search for in the URI path, for example, /images/daily-ad.jpg.    If SearchString includes alphabetic characters A-Z and a-z, note that the value is case sensitive.  If you're using the WAF API  Specify a base64-encoded version of the value. The maximum length of the value before you base64-encode it is 50 bytes. For example, suppose the value of Type is HEADER and the value of Data is User-Agent. If you want to search the User-Agent header for the value BadBot, you base64-encode BadBot using MIME base64-encoding and include the resulting value, QmFkQm90, in the value of SearchString.  If you're using the CLI or one of the Amazon Web Services SDKs  The value that you want WAF to search for. The SDK automatically base64 encodes the value.
     */
    SearchString: SearchString;
    /**
     * The part of a web request that you want WAF to inspect. For more information, see FieldToMatch. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, WAF performs all transformations on the content of the request component identified by FieldToMatch, starting from the lowest priority setting, before inspecting the content for a match.
     */
    TextTransformations: TextTransformations;
    /**
     * The area within the portion of a web request that you want WAF to search for SearchString. Valid values include the following:  CONTAINS  The specified part of the web request must include the value of SearchString, but the location doesn't matter.  CONTAINS_WORD  The specified part of the web request must include the value of SearchString, and SearchString must contain only alphanumeric characters or underscore (A-Z, a-z, 0-9, or _). In addition, SearchString must be a word, which means that both of the following are true:    SearchString is at the beginning of the specified part of the web request or is preceded by a character other than an alphanumeric character or underscore (_). Examples include the value of a header and ;BadBot.    SearchString is at the end of the specified part of the web request or is followed by a character other than an alphanumeric character or underscore (_), for example, BadBot; and -BadBot;.    EXACTLY  The value of the specified part of the web request must exactly match the value of SearchString.  STARTS_WITH  The value of SearchString must appear at the beginning of the specified part of the web request.  ENDS_WITH  The value of SearchString must appear at the end of the specified part of the web request.
     */
    PositionalConstraint: PositionalConstraint;
  }
  export type CapacityUnit = number;
  export interface CheckCapacityRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * An array of Rule that you're configuring to use in a rule group or web ACL. 
     */
    Rules: Rules;
  }
  export interface CheckCapacityResponse {
    /**
     * The capacity required by the rules and scope.
     */
    Capacity?: ConsumedCapacity;
  }
  export type ComparisonOperator = "EQ"|"NE"|"LE"|"LT"|"GE"|"GT"|string;
  export interface Condition {
    /**
     * A single action condition.
     */
    ActionCondition?: ActionCondition;
    /**
     * A single label name condition.
     */
    LabelNameCondition?: LabelNameCondition;
  }
  export type Conditions = Condition[];
  export type ConsumedCapacity = number;
  export interface CountAction {
    /**
     * Defines custom handling for the web request. For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide. 
     */
    CustomRequestHandling?: CustomRequestHandling;
  }
  export type Country = string;
  export type CountryCode = "AF"|"AX"|"AL"|"DZ"|"AS"|"AD"|"AO"|"AI"|"AQ"|"AG"|"AR"|"AM"|"AW"|"AU"|"AT"|"AZ"|"BS"|"BH"|"BD"|"BB"|"BY"|"BE"|"BZ"|"BJ"|"BM"|"BT"|"BO"|"BQ"|"BA"|"BW"|"BV"|"BR"|"IO"|"BN"|"BG"|"BF"|"BI"|"KH"|"CM"|"CA"|"CV"|"KY"|"CF"|"TD"|"CL"|"CN"|"CX"|"CC"|"CO"|"KM"|"CG"|"CD"|"CK"|"CR"|"CI"|"HR"|"CU"|"CW"|"CY"|"CZ"|"DK"|"DJ"|"DM"|"DO"|"EC"|"EG"|"SV"|"GQ"|"ER"|"EE"|"ET"|"FK"|"FO"|"FJ"|"FI"|"FR"|"GF"|"PF"|"TF"|"GA"|"GM"|"GE"|"DE"|"GH"|"GI"|"GR"|"GL"|"GD"|"GP"|"GU"|"GT"|"GG"|"GN"|"GW"|"GY"|"HT"|"HM"|"VA"|"HN"|"HK"|"HU"|"IS"|"IN"|"ID"|"IR"|"IQ"|"IE"|"IM"|"IL"|"IT"|"JM"|"JP"|"JE"|"JO"|"KZ"|"KE"|"KI"|"KP"|"KR"|"KW"|"KG"|"LA"|"LV"|"LB"|"LS"|"LR"|"LY"|"LI"|"LT"|"LU"|"MO"|"MK"|"MG"|"MW"|"MY"|"MV"|"ML"|"MT"|"MH"|"MQ"|"MR"|"MU"|"YT"|"MX"|"FM"|"MD"|"MC"|"MN"|"ME"|"MS"|"MA"|"MZ"|"MM"|"NA"|"NR"|"NP"|"NL"|"NC"|"NZ"|"NI"|"NE"|"NG"|"NU"|"NF"|"MP"|"NO"|"OM"|"PK"|"PW"|"PS"|"PA"|"PG"|"PY"|"PE"|"PH"|"PN"|"PL"|"PT"|"PR"|"QA"|"RE"|"RO"|"RU"|"RW"|"BL"|"SH"|"KN"|"LC"|"MF"|"PM"|"VC"|"WS"|"SM"|"ST"|"SA"|"SN"|"RS"|"SC"|"SL"|"SG"|"SX"|"SK"|"SI"|"SB"|"SO"|"ZA"|"GS"|"SS"|"ES"|"LK"|"SD"|"SR"|"SJ"|"SZ"|"SE"|"CH"|"SY"|"TW"|"TJ"|"TZ"|"TH"|"TL"|"TG"|"TK"|"TO"|"TT"|"TN"|"TR"|"TM"|"TC"|"TV"|"UG"|"UA"|"AE"|"GB"|"US"|"UM"|"UY"|"UZ"|"VU"|"VE"|"VN"|"VG"|"VI"|"WF"|"EH"|"YE"|"ZM"|"ZW"|string;
  export type CountryCodes = CountryCode[];
  export interface CreateIPSetRequest {
    /**
     * The name of the IP set. You cannot change the name of an IPSet after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A description of the IP set that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The version of the IP addresses, either IPV4 or IPV6. 
     */
    IPAddressVersion: IPAddressVersion;
    /**
     * Contains an array of strings that specify one or more IP addresses or blocks of IP addresses in Classless Inter-Domain Routing (CIDR) notation. WAF supports all IPv4 and IPv6 CIDR ranges except for /0.  Examples:    To configure WAF to allow, block, or count requests that originated from the IP address 192.0.2.44, specify 192.0.2.44/32.   To configure WAF to allow, block, or count requests that originated from IP addresses from 192.0.2.0 to 192.0.2.255, specify 192.0.2.0/24.   To configure WAF to allow, block, or count requests that originated from the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify 1111:0000:0000:0000:0000:0000:0000:0111/128.   To configure WAF to allow, block, or count requests that originated from IP addresses 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify 1111:0000:0000:0000:0000:0000:0000:0000/64.   For more information about CIDR notation, see the Wikipedia entry Classless Inter-Domain Routing.
     */
    Addresses: IPAddresses;
    /**
     * An array of key:value pairs to associate with the resource.
     */
    Tags?: TagList;
  }
  export interface CreateIPSetResponse {
    /**
     * High-level information about an IPSet, returned by operations like create and list. This provides information like the ID, that you can use to retrieve and manage an IPSet, and the ARN, that you provide to the IPSetReferenceStatement to use the address set in a Rule.
     */
    Summary?: IPSetSummary;
  }
  export interface CreateRegexPatternSetRequest {
    /**
     * The name of the set. You cannot change the name after you create the set.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A description of the set that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * Array of regular expression strings. 
     */
    RegularExpressionList: RegularExpressionList;
    /**
     * An array of key:value pairs to associate with the resource.
     */
    Tags?: TagList;
  }
  export interface CreateRegexPatternSetResponse {
    /**
     * High-level information about a RegexPatternSet, returned by operations like create and list. This provides information like the ID, that you can use to retrieve and manage a RegexPatternSet, and the ARN, that you provide to the RegexPatternSetReferenceStatement to use the pattern set in a Rule.
     */
    Summary?: RegexPatternSetSummary;
  }
  export interface CreateRuleGroupRequest {
    /**
     * The name of the rule group. You cannot change the name of a rule group after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The web ACL capacity units (WCUs) required for this rule group. When you create your own rule group, you define this, and you cannot change it after creation. When you add or modify the rules in a rule group, WAF enforces this limit. You can check the capacity for a set of rules using CheckCapacity. WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500. 
     */
    Capacity: CapacityUnit;
    /**
     * A description of the rule group that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The Rule statements used to identify the web requests that you want to allow, block, or count. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
     */
    Rules?: Rules;
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection. 
     */
    VisibilityConfig: VisibilityConfig;
    /**
     * An array of key:value pairs to associate with the resource.
     */
    Tags?: TagList;
    /**
     * A map of custom response keys and content bodies. When you create a rule with a block action, you can send a custom response to the web request. You define these for the rule group, and then use them in the rules that you define in the rule group.  For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide.  For information about the limits on count and size for custom request and response settings, see WAF quotas in the WAF Developer Guide. 
     */
    CustomResponseBodies?: CustomResponseBodies;
  }
  export interface CreateRuleGroupResponse {
    /**
     * High-level information about a RuleGroup, returned by operations like create and list. This provides information like the ID, that you can use to retrieve and manage a RuleGroup, and the ARN, that you provide to the RuleGroupReferenceStatement to use the rule group in a Rule.
     */
    Summary?: RuleGroupSummary;
  }
  export interface CreateWebACLRequest {
    /**
     * The name of the web ACL. You cannot change the name of a web ACL after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The action to perform if none of the Rules contained in the WebACL match. 
     */
    DefaultAction: DefaultAction;
    /**
     * A description of the web ACL that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The Rule statements used to identify the web requests that you want to allow, block, or count. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
     */
    Rules?: Rules;
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection. 
     */
    VisibilityConfig: VisibilityConfig;
    /**
     * An array of key:value pairs to associate with the resource.
     */
    Tags?: TagList;
    /**
     * A map of custom response keys and content bodies. When you create a rule with a block action, you can send a custom response to the web request. You define these for the web ACL, and then use them in the rules and default actions that you define in the web ACL.  For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide.  For information about the limits on count and size for custom request and response settings, see WAF quotas in the WAF Developer Guide. 
     */
    CustomResponseBodies?: CustomResponseBodies;
  }
  export interface CreateWebACLResponse {
    /**
     * High-level information about a WebACL, returned by operations like create and list. This provides information like the ID, that you can use to retrieve and manage a WebACL, and the ARN, that you provide to operations like AssociateWebACL.
     */
    Summary?: WebACLSummary;
  }
  export interface CustomHTTPHeader {
    /**
     * The name of the custom header.  For custom request header insertion, when WAF inserts the header into the request, it prefixes this name x-amzn-waf-, to avoid confusion with the headers that are already in the request. For example, for the header name sample, WAF inserts the header x-amzn-waf-sample.
     */
    Name: CustomHTTPHeaderName;
    /**
     * The value of the custom header.
     */
    Value: CustomHTTPHeaderValue;
  }
  export type CustomHTTPHeaderName = string;
  export type CustomHTTPHeaderValue = string;
  export type CustomHTTPHeaders = CustomHTTPHeader[];
  export interface CustomRequestHandling {
    /**
     * The HTTP headers to insert into the request. Duplicate header names are not allowed.  For information about the limits on count and size for custom request and response settings, see WAF quotas in the WAF Developer Guide. 
     */
    InsertHeaders: CustomHTTPHeaders;
  }
  export interface CustomResponse {
    /**
     * The HTTP status code to return to the client.  For a list of status codes that you can use in your custom reqponses, see Supported status codes for custom response in the WAF Developer Guide. 
     */
    ResponseCode: ResponseStatusCode;
    /**
     * References the response body that you want WAF to return to the web request client. You can define a custom response for a rule action or a default web ACL action that is set to block. To do this, you first define the response body key and value in the CustomResponseBodies setting for the WebACL or RuleGroup where you want to use it. Then, in the rule action or web ACL default action BlockAction setting, you reference the response body using this key. 
     */
    CustomResponseBodyKey?: EntityName;
    /**
     * The HTTP headers to use in the response. Duplicate header names are not allowed.  For information about the limits on count and size for custom request and response settings, see WAF quotas in the WAF Developer Guide. 
     */
    ResponseHeaders?: CustomHTTPHeaders;
  }
  export type CustomResponseBodies = {[key: string]: CustomResponseBody};
  export interface CustomResponseBody {
    /**
     * The type of content in the payload that you are defining in the Content string.
     */
    ContentType: ResponseContentType;
    /**
     * The payload of the custom response.  You can use JSON escape strings in JSON content. To do this, you must specify JSON content in the ContentType setting.  For information about the limits on count and size for custom request and response settings, see WAF quotas in the WAF Developer Guide. 
     */
    Content: ResponseContent;
  }
  export interface DefaultAction {
    /**
     * Specifies that WAF should block requests by default. 
     */
    Block?: BlockAction;
    /**
     * Specifies that WAF should allow requests by default.
     */
    Allow?: AllowAction;
  }
  export interface DeleteFirewallManagerRuleGroupsRequest {
    /**
     * The Amazon Resource Name (ARN) of the web ACL.
     */
    WebACLArn: ResourceArn;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    WebACLLockToken: LockToken;
  }
  export interface DeleteFirewallManagerRuleGroupsResponse {
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    NextWebACLLockToken?: LockToken;
  }
  export interface DeleteIPSetRequest {
    /**
     * The name of the IP set. You cannot change the name of an IPSet after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken: LockToken;
  }
  export interface DeleteIPSetResponse {
  }
  export interface DeleteLoggingConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the web ACL from which you want to delete the LoggingConfiguration.
     */
    ResourceArn: ResourceArn;
  }
  export interface DeleteLoggingConfigurationResponse {
  }
  export interface DeletePermissionPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the rule group from which you want to delete the policy. You must be the owner of the rule group to perform this operation.
     */
    ResourceArn: ResourceArn;
  }
  export interface DeletePermissionPolicyResponse {
  }
  export interface DeleteRegexPatternSetRequest {
    /**
     * The name of the set. You cannot change the name after you create the set.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken: LockToken;
  }
  export interface DeleteRegexPatternSetResponse {
  }
  export interface DeleteRuleGroupRequest {
    /**
     * The name of the rule group. You cannot change the name of a rule group after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the rule group. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken: LockToken;
  }
  export interface DeleteRuleGroupResponse {
  }
  export interface DeleteWebACLRequest {
    /**
     * The name of the web ACL. You cannot change the name of a web ACL after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The unique identifier for the web ACL. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken: LockToken;
  }
  export interface DeleteWebACLResponse {
  }
  export interface DescribeManagedRuleGroupRequest {
    /**
     * The name of the managed rule group vendor. You use this, along with the rule group name, to identify the rule group.
     */
    VendorName: VendorName;
    /**
     * The name of the managed rule group. You use this, along with the vendor name, to identify the rule group.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The version of the rule group. You can only use a version that is not scheduled for expiration. If you don't provide this, WAF uses the vendor's default version. 
     */
    VersionName?: VersionKeyString;
  }
  export interface DescribeManagedRuleGroupResponse {
    /**
     * The managed rule group's version. 
     */
    VersionName?: VersionKeyString;
    /**
     * The Amazon resource name (ARN) of the Amazon Simple Notification Service SNS topic that's used to record changes to the managed rule group. You can subscribe to the SNS topic to receive notifications when the managed rule group is modified, such as for new versions and for version expiration. For more information, see the Amazon Simple Notification Service Developer Guide.
     */
    SnsTopicArn?: ResourceArn;
    /**
     * The web ACL capacity units (WCUs) required for this rule group. WAF uses web ACL capacity units (WCU) to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect each rule's relative cost. Rule group capacity is fixed at creation, so users can plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500. 
     */
    Capacity?: CapacityUnit;
    /**
     * 
     */
    Rules?: RuleSummaries;
    /**
     * The label namespace prefix for this rule group. All labels added by rules in this rule group have this prefix.    The syntax for the label namespace prefix for a managed rule group is the following:   awswaf:managed:&lt;vendor&gt;:&lt;rule group name&gt;:   When a rule with a label matches a web request, WAF adds the fully qualified label to the request. A fully qualified label is made up of the label namespace from the rule group or web ACL where the rule is defined and the label from the rule, separated by a colon:   &lt;label namespace&gt;:&lt;label from rule&gt;   
     */
    LabelNamespace?: LabelName;
    /**
     * The labels that one or more rules in this rule group add to matching web requests. These labels are defined in the RuleLabels for a Rule.
     */
    AvailableLabels?: LabelSummaries;
    /**
     * The labels that one or more rules in this rule group match against in label match statements. These labels are defined in a LabelMatchStatement specification, in the Statement definition of a rule. 
     */
    ConsumedLabels?: LabelSummaries;
  }
  export interface DisassociateWebACLRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to disassociate from the web ACL.  The ARN must be in one of the following formats:   For an Application Load Balancer: arn:aws:elasticloadbalancing:region:account-id:loadbalancer/app/load-balancer-name/load-balancer-id     For an Amazon API Gateway REST API: arn:aws:apigateway:region::/restapis/api-id/stages/stage-name     For an AppSync GraphQL API: arn:aws:appsync:region:account-id:apis/GraphQLApiId    
     */
    ResourceArn: ResourceArn;
  }
  export interface DisassociateWebACLResponse {
  }
  export type EntityDescription = string;
  export type EntityId = string;
  export type EntityName = string;
  export interface ExcludedRule {
    /**
     * The name of the rule to exclude.
     */
    Name: EntityName;
  }
  export type ExcludedRules = ExcludedRule[];
  export type FallbackBehavior = "MATCH"|"NO_MATCH"|string;
  export interface FieldToMatch {
    /**
     * Inspect a single header. Provide the name of the header to inspect, for example, User-Agent or Referer. This setting isn't case sensitive. Example JSON: "SingleHeader": { "Name": "haystack" } 
     */
    SingleHeader?: SingleHeader;
    /**
     * Inspect a single query argument. Provide the name of the query argument to inspect, such as UserName or SalesRegion. The name can be up to 30 characters long and isn't case sensitive.  This is used only to indicate the web request component for WAF to inspect, in the FieldToMatch specification.  Example JSON: "SingleQueryArgument": { "Name": "myArgument" } 
     */
    SingleQueryArgument?: SingleQueryArgument;
    /**
     * Inspect all query arguments. 
     */
    AllQueryArguments?: AllQueryArguments;
    /**
     * Inspect the request URI path. This is the part of a web request that identifies a resource, for example, /images/daily-ad.jpg.
     */
    UriPath?: UriPath;
    /**
     * Inspect the query string. This is the part of a URL that appears after a ? character, if any.
     */
    QueryString?: QueryString;
    /**
     * Inspect the request body as plain text. The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.  Note that only the first 8 KB (8192 bytes) of the request body are forwarded to WAF for inspection by the underlying host service. If you don't need to inspect more than 8 KB, you can guarantee that you don't allow additional bytes in by combining a statement that inspects the body of the web request, such as ByteMatchStatement or RegexPatternSetReferenceStatement, with a SizeConstraintStatement that enforces an 8 KB size limit on the body of the request. WAF doesn't support inspecting the entire contents of web requests whose bodies exceed the 8 KB limit.
     */
    Body?: Body;
    /**
     * Inspect the HTTP method. The method indicates the type of operation that the request is asking the origin to perform. 
     */
    Method?: Method;
    /**
     * Inspect the request body as JSON. The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.  Note that only the first 8 KB (8192 bytes) of the request body are forwarded to WAF for inspection by the underlying host service. If you don't need to inspect more than 8 KB, you can guarantee that you don't allow additional bytes in by combining a statement that inspects the body of the web request, such as ByteMatchStatement or RegexPatternSetReferenceStatement, with a SizeConstraintStatement that enforces an 8 KB size limit on the body of the request. WAF doesn't support inspecting the entire contents of web requests whose bodies exceed the 8 KB limit.
     */
    JsonBody?: JsonBody;
  }
  export type FieldToMatchData = string;
  export interface Filter {
    /**
     * How to handle logs that satisfy the filter's conditions and requirement. 
     */
    Behavior: FilterBehavior;
    /**
     * Logic to apply to the filtering conditions. You can specify that, in order to satisfy the filter, a log must match all conditions or must match at least one condition.
     */
    Requirement: FilterRequirement;
    /**
     * Match conditions for the filter.
     */
    Conditions: Conditions;
  }
  export type FilterBehavior = "KEEP"|"DROP"|string;
  export type FilterRequirement = "MEETS_ALL"|"MEETS_ANY"|string;
  export type Filters = Filter[];
  export interface FirewallManagerRuleGroup {
    /**
     * The name of the rule group. You cannot change the name of a rule group after you create it.
     */
    Name: EntityName;
    /**
     * If you define more than one rule group in the first or last Firewall Manager rule groups, WAF evaluates each request against the rule groups in order, starting from the lowest priority setting. The priorities don't need to be consecutive, but they must all be different.
     */
    Priority: RulePriority;
    /**
     * The processing guidance for an Firewall Manager rule. This is like a regular rule Statement, but it can only contain a rule group reference.
     */
    FirewallManagerStatement: FirewallManagerStatement;
    /**
     * The override action to apply to the rules in a rule group. Used only for rule statements that reference a rule group, like RuleGroupReferenceStatement and ManagedRuleGroupStatement.  Set the override action to none to leave the rule actions in effect. Set it to count to only count matches, regardless of the rule action settings.  In a Rule, you must specify either this OverrideAction setting or the rule Action setting, but not both:   If the rule statement references a rule group, use this override action setting and not the action setting.    If the rule statement does not reference a rule group, use the rule action setting and not this rule override action setting.   
     */
    OverrideAction: OverrideAction;
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection. 
     */
    VisibilityConfig: VisibilityConfig;
  }
  export type FirewallManagerRuleGroups = FirewallManagerRuleGroup[];
  export interface FirewallManagerStatement {
    /**
     * A rule statement used to run the rules that are defined in a managed rule group. To use this, provide the vendor name and the name of the rule group in this statement. You can retrieve the required names by calling ListAvailableManagedRuleGroups. You cannot nest a ManagedRuleGroupStatement, for example for use inside a NotStatement or OrStatement. It can only be referenced as a top-level statement within a rule.
     */
    ManagedRuleGroupStatement?: ManagedRuleGroupStatement;
    /**
     * A rule statement used to run the rules that are defined in a RuleGroup. To use this, create a rule group with your rules, then provide the ARN of the rule group in this statement. You cannot nest a RuleGroupReferenceStatement, for example for use inside a NotStatement or OrStatement. You can only use a rule group reference statement at the top level inside a web ACL. 
     */
    RuleGroupReferenceStatement?: RuleGroupReferenceStatement;
  }
  export interface ForwardedIPConfig {
    /**
     * The name of the HTTP header to use for the IP address. For example, to use the X-Forwarded-For (XFF) header, set this to X-Forwarded-For.  If the specified header isn't present in the request, WAF doesn't apply the rule to the web request at all. 
     */
    HeaderName: ForwardedIPHeaderName;
    /**
     * The match status to assign to the web request if the request doesn't have a valid IP address in the specified position.  If the specified header isn't present in the request, WAF doesn't apply the rule to the web request at all.  You can specify the following fallback behaviors:    MATCH - Treat the web request as matching the rule statement. WAF applies the rule action to the request.    NO_MATCH - Treat the web request as not matching the rule statement.  
     */
    FallbackBehavior: FallbackBehavior;
  }
  export type ForwardedIPHeaderName = string;
  export type ForwardedIPPosition = "FIRST"|"LAST"|"ANY"|string;
  export interface GeoMatchStatement {
    /**
     * An array of two-character country codes, for example, [ "US", "CN" ], from the alpha-2 country ISO codes of the ISO 3166 international standard. 
     */
    CountryCodes?: CountryCodes;
    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.   If the specified header isn't present in the request, WAF doesn't apply the rule to the web request at all. 
     */
    ForwardedIPConfig?: ForwardedIPConfig;
  }
  export interface GetIPSetRequest {
    /**
     * The name of the IP set. You cannot change the name of an IPSet after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
  }
  export interface GetIPSetResponse {
    /**
     * 
     */
    IPSet?: IPSet;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken?: LockToken;
  }
  export interface GetLoggingConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the web ACL for which you want to get the LoggingConfiguration.
     */
    ResourceArn: ResourceArn;
  }
  export interface GetLoggingConfigurationResponse {
    /**
     * The LoggingConfiguration for the specified web ACL.
     */
    LoggingConfiguration?: LoggingConfiguration;
  }
  export interface GetManagedRuleSetRequest {
    /**
     * The name of the managed rule set. You use this, along with the rule set ID, to identify the rule set. This name is assigned to the corresponding managed rule group, which your customers can access and use. 
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the managed rule set. The ID is returned in the responses to commands like list. You provide it to operations like get and update.
     */
    Id: EntityId;
  }
  export interface GetManagedRuleSetResponse {
    /**
     * The managed rule set that you requested. 
     */
    ManagedRuleSet?: ManagedRuleSet;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken?: LockToken;
  }
  export interface GetPermissionPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the rule group for which you want to get the policy.
     */
    ResourceArn: ResourceArn;
  }
  export interface GetPermissionPolicyResponse {
    /**
     * The IAM policy that is attached to the specified rule group.
     */
    Policy?: PolicyString;
  }
  export interface GetRateBasedStatementManagedKeysRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The name of the web ACL. You cannot change the name of a web ACL after you create it.
     */
    WebACLName: EntityName;
    /**
     * The unique identifier for the web ACL. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    WebACLId: EntityId;
    /**
     * The name of the rule group reference statement in your web ACL. This is required only when you have the rate-based rule nested inside a rule group. 
     */
    RuleGroupRuleName?: EntityName;
    /**
     * The name of the rate-based rule to get the keys for. If you have the rule defined inside a rule group that you're using in your web ACL, also provide the name of the rule group reference statement in the request parameter RuleGroupRuleName.
     */
    RuleName: EntityName;
  }
  export interface GetRateBasedStatementManagedKeysResponse {
    /**
     * The keys that are of Internet Protocol version 4 (IPv4). 
     */
    ManagedKeysIPV4?: RateBasedStatementManagedKeysIPSet;
    /**
     * The keys that are of Internet Protocol version 6 (IPv6). 
     */
    ManagedKeysIPV6?: RateBasedStatementManagedKeysIPSet;
  }
  export interface GetRegexPatternSetRequest {
    /**
     * The name of the set. You cannot change the name after you create the set.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
  }
  export interface GetRegexPatternSetResponse {
    /**
     * 
     */
    RegexPatternSet?: RegexPatternSet;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken?: LockToken;
  }
  export interface GetRuleGroupRequest {
    /**
     * The name of the rule group. You cannot change the name of a rule group after you create it.
     */
    Name?: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope?: Scope;
    /**
     * A unique identifier for the rule group. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id?: EntityId;
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN?: ResourceArn;
  }
  export interface GetRuleGroupResponse {
    /**
     * 
     */
    RuleGroup?: RuleGroup;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken?: LockToken;
  }
  export interface GetSampledRequestsRequest {
    /**
     * The Amazon resource name (ARN) of the WebACL for which you want a sample of requests.
     */
    WebAclArn: ResourceArn;
    /**
     * The metric name assigned to the Rule or RuleGroup for which you want a sample of requests.
     */
    RuleMetricName: MetricName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The start date and time and the end date and time of the range for which you want GetSampledRequests to return a sample of requests. You must specify the times in Coordinated Universal Time (UTC) format. UTC format includes the special designator, Z. For example, "2016-09-27T14:50Z". You can specify any time range in the previous three hours. If you specify a start time that's earlier than three hours ago, WAF sets it to three hours ago.
     */
    TimeWindow: TimeWindow;
    /**
     * The number of requests that you want WAF to return from among the first 5,000 requests that your Amazon Web Services resource received during the time range. If your resource received fewer requests than the value of MaxItems, GetSampledRequests returns information about all of them. 
     */
    MaxItems: ListMaxItems;
  }
  export interface GetSampledRequestsResponse {
    /**
     * A complex type that contains detailed information about each of the requests in the sample.
     */
    SampledRequests?: SampledHTTPRequests;
    /**
     * The total number of requests from which GetSampledRequests got a sample of MaxItems requests. If PopulationSize is less than MaxItems, the sample includes every request that your Amazon Web Services resource received during the specified time range.
     */
    PopulationSize?: PopulationSize;
    /**
     * Usually, TimeWindow is the time range that you specified in the GetSampledRequests request. However, if your Amazon Web Services resource received more than 5,000 requests during the time range that you specified in the request, GetSampledRequests returns the time range for the first 5,000 requests. Times are in Coordinated Universal Time (UTC) format.
     */
    TimeWindow?: TimeWindow;
  }
  export interface GetWebACLForResourceRequest {
    /**
     * The ARN (Amazon Resource Name) of the resource.
     */
    ResourceArn: ResourceArn;
  }
  export interface GetWebACLForResourceResponse {
    /**
     * The web ACL that is associated with the resource. If there is no associated resource, WAF returns a null web ACL.
     */
    WebACL?: WebACL;
  }
  export interface GetWebACLRequest {
    /**
     * The name of the web ACL. You cannot change the name of a web ACL after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The unique identifier for the web ACL. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
  }
  export interface GetWebACLResponse {
    /**
     * The web ACL specification. You can modify the settings in this web ACL and use it to update this web ACL or create a new one.
     */
    WebACL?: WebACL;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken?: LockToken;
  }
  export interface HTTPHeader {
    /**
     * The name of the HTTP header.
     */
    Name?: HeaderName;
    /**
     * The value of the HTTP header.
     */
    Value?: HeaderValue;
  }
  export type HTTPHeaders = HTTPHeader[];
  export type HTTPMethod = string;
  export interface HTTPRequest {
    /**
     * The IP address that the request originated from. If the web ACL is associated with a CloudFront distribution, this is the value of one of the following fields in CloudFront access logs:    c-ip, if the viewer did not use an HTTP proxy or a load balancer to send the request    x-forwarded-for, if the viewer did use an HTTP proxy or a load balancer to send the request  
     */
    ClientIP?: IPString;
    /**
     * The two-letter country code for the country that the request originated from. For a current list of country codes, see the Wikipedia entry ISO 3166-1 alpha-2.
     */
    Country?: Country;
    /**
     * The URI path of the request, which identifies the resource, for example, /images/daily-ad.jpg.
     */
    URI?: URIString;
    /**
     * The HTTP method specified in the sampled web request. 
     */
    Method?: HTTPMethod;
    /**
     * The HTTP version specified in the sampled web request, for example, HTTP/1.1.
     */
    HTTPVersion?: HTTPVersion;
    /**
     * A complex type that contains the name and value for each header in the sampled web request.
     */
    Headers?: HTTPHeaders;
  }
  export type HTTPVersion = string;
  export type HeaderName = string;
  export type HeaderValue = string;
  export type IPAddress = string;
  export type IPAddressVersion = "IPV4"|"IPV6"|string;
  export type IPAddresses = IPAddress[];
  export interface IPSet {
    /**
     * The name of the IP set. You cannot change the name of an IPSet after you create it.
     */
    Name: EntityName;
    /**
     * A unique identifier for the set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN: ResourceArn;
    /**
     * A description of the IP set that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The version of the IP addresses, either IPV4 or IPV6. 
     */
    IPAddressVersion: IPAddressVersion;
    /**
     * Contains an array of strings that specify one or more IP addresses or blocks of IP addresses in Classless Inter-Domain Routing (CIDR) notation. WAF supports all IPv4 and IPv6 CIDR ranges except for /0.  Examples:    To configure WAF to allow, block, or count requests that originated from the IP address 192.0.2.44, specify 192.0.2.44/32.   To configure WAF to allow, block, or count requests that originated from IP addresses from 192.0.2.0 to 192.0.2.255, specify 192.0.2.0/24.   To configure WAF to allow, block, or count requests that originated from the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify 1111:0000:0000:0000:0000:0000:0000:0111/128.   To configure WAF to allow, block, or count requests that originated from IP addresses 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify 1111:0000:0000:0000:0000:0000:0000:0000/64.   For more information about CIDR notation, see the Wikipedia entry Classless Inter-Domain Routing.
     */
    Addresses: IPAddresses;
  }
  export interface IPSetForwardedIPConfig {
    /**
     * The name of the HTTP header to use for the IP address. For example, to use the X-Forwarded-For (XFF) header, set this to X-Forwarded-For.  If the specified header isn't present in the request, WAF doesn't apply the rule to the web request at all. 
     */
    HeaderName: ForwardedIPHeaderName;
    /**
     * The match status to assign to the web request if the request doesn't have a valid IP address in the specified position.  If the specified header isn't present in the request, WAF doesn't apply the rule to the web request at all.  You can specify the following fallback behaviors:    MATCH - Treat the web request as matching the rule statement. WAF applies the rule action to the request.    NO_MATCH - Treat the web request as not matching the rule statement.  
     */
    FallbackBehavior: FallbackBehavior;
    /**
     * The position in the header to search for the IP address. The header can contain IP addresses of the original client and also of proxies. For example, the header value could be 10.1.1.1, 127.0.0.0, 10.10.10.10 where the first IP address identifies the original client and the rest identify proxies that the request went through.  The options for this setting are the following:    FIRST - Inspect the first IP address in the list of IP addresses in the header. This is usually the client's original IP.   LAST - Inspect the last IP address in the list of IP addresses in the header.   ANY - Inspect all IP addresses in the header for a match. If the header contains more than 10 IP addresses, WAF inspects the last 10.  
     */
    Position: ForwardedIPPosition;
  }
  export interface IPSetReferenceStatement {
    /**
     * The Amazon Resource Name (ARN) of the IPSet that this statement references.
     */
    ARN: ResourceArn;
    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.   If the specified header isn't present in the request, WAF doesn't apply the rule to the web request at all. 
     */
    IPSetForwardedIPConfig?: IPSetForwardedIPConfig;
  }
  export type IPSetSummaries = IPSetSummary[];
  export interface IPSetSummary {
    /**
     * The name of the IP set. You cannot change the name of an IPSet after you create it.
     */
    Name?: EntityName;
    /**
     * A unique identifier for the set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id?: EntityId;
    /**
     * A description of the IP set that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken?: LockToken;
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN?: ResourceArn;
  }
  export type IPString = string;
  export interface JsonBody {
    /**
     * The patterns to look for in the JSON body. WAF inspects the results of these pattern matches against the rule inspection criteria. 
     */
    MatchPattern: JsonMatchPattern;
    /**
     * The parts of the JSON to match against using the MatchPattern. If you specify All, WAF matches against keys and values. 
     */
    MatchScope: JsonMatchScope;
    /**
     * What WAF should do if it fails to completely parse the JSON body. The options are the following:    EVALUATE_AS_STRING - Inspect the body as plain text. WAF applies the text transformations and inspection criteria that you defined for the JSON inspection to the body text string.    MATCH - Treat the web request as matching the rule statement. WAF applies the rule action to the request.    NO_MATCH - Treat the web request as not matching the rule statement.   If you don't provide this setting, WAF parses and evaluates the content only up to the first parsing failure that it encounters.  WAF does its best to parse the entire JSON body, but might be forced to stop for reasons such as invalid characters, duplicate keys, truncation, and any content whose root node isn't an object or an array.  WAF parses the JSON in the following examples as two valid key, value pairs:    Missing comma: {"key1":"value1""key2":"value2"}    Missing colon: {"key1":"value1","key2""value2"}    Extra colons: {"key1"::"value1","key2""value2"}   
     */
    InvalidFallbackBehavior?: BodyParsingFallbackBehavior;
  }
  export interface JsonMatchPattern {
    /**
     * Match all of the elements. See also MatchScope in JsonBody.  You must specify either this setting or the IncludedPaths setting, but not both.
     */
    All?: All;
    /**
     * Match only the specified include paths. See also MatchScope in JsonBody.  Provide the include paths using JSON Pointer syntax. For example, "IncludedPaths": ["/dogs/0/name", "/dogs/1/name"]. For information about this syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  You must specify either this setting or the All setting, but not both.  Don't use this option to include all paths. Instead, use the All setting.  
     */
    IncludedPaths?: JsonPointerPaths;
  }
  export type JsonMatchScope = "ALL"|"KEY"|"VALUE"|string;
  export type JsonPointerPath = string;
  export type JsonPointerPaths = JsonPointerPath[];
  export interface Label {
    /**
     * The label string. 
     */
    Name: LabelName;
  }
  export type LabelMatchKey = string;
  export type LabelMatchScope = "LABEL"|"NAMESPACE"|string;
  export interface LabelMatchStatement {
    /**
     * Specify whether you want to match using the label name or just the namespace. 
     */
    Scope: LabelMatchScope;
    /**
     * The string to match against. The setting you provide for this depends on the match statement's Scope setting:    If the Scope indicates LABEL, then this specification must include the name and can include any number of preceding namespace specifications and prefix up to providing the fully qualified label name.    If the Scope indicates NAMESPACE, then this specification can include any number of contiguous namespace strings, and can include the entire label namespace prefix from the rule group or web ACL where the label originates.   Labels are case sensitive and components of a label must be separated by colon, for example NS1:NS2:name.
     */
    Key: LabelMatchKey;
  }
  export type LabelName = string;
  export interface LabelNameCondition {
    /**
     * The label name that a log record must contain in order to meet the condition. This must be a fully qualified label name. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. 
     */
    LabelName: LabelName;
  }
  export type LabelSummaries = LabelSummary[];
  export interface LabelSummary {
    /**
     * An individual label specification.
     */
    Name?: LabelName;
  }
  export type Labels = Label[];
  export interface ListAvailableManagedRuleGroupVersionsRequest {
    /**
     * The name of the managed rule group vendor. You use this, along with the rule group name, to identify the rule group.
     */
    VendorName: VendorName;
    /**
     * The name of the managed rule group. You use this, along with the vendor name, to identify the rule group.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The maximum number of objects that you want WAF to return for this request. If more objects are available, in the response, WAF provides a NextMarker value that you can use in a subsequent call to get the next batch of objects.
     */
    Limit?: PaginationLimit;
  }
  export interface ListAvailableManagedRuleGroupVersionsResponse {
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The versions that are currently available for the specified managed rule group. 
     */
    Versions?: ManagedRuleGroupVersions;
  }
  export interface ListAvailableManagedRuleGroupsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The maximum number of objects that you want WAF to return for this request. If more objects are available, in the response, WAF provides a NextMarker value that you can use in a subsequent call to get the next batch of objects.
     */
    Limit?: PaginationLimit;
  }
  export interface ListAvailableManagedRuleGroupsResponse {
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * 
     */
    ManagedRuleGroups?: ManagedRuleGroupSummaries;
  }
  export interface ListIPSetsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The maximum number of objects that you want WAF to return for this request. If more objects are available, in the response, WAF provides a NextMarker value that you can use in a subsequent call to get the next batch of objects.
     */
    Limit?: PaginationLimit;
  }
  export interface ListIPSetsResponse {
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * Array of IPSets. This may not be the full list of IPSets that you have defined. See the Limit specification for this request.
     */
    IPSets?: IPSetSummaries;
  }
  export interface ListLoggingConfigurationsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope?: Scope;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The maximum number of objects that you want WAF to return for this request. If more objects are available, in the response, WAF provides a NextMarker value that you can use in a subsequent call to get the next batch of objects.
     */
    Limit?: PaginationLimit;
  }
  export interface ListLoggingConfigurationsResponse {
    /**
     * 
     */
    LoggingConfigurations?: LoggingConfigurations;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
  }
  export interface ListManagedRuleSetsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The maximum number of objects that you want WAF to return for this request. If more objects are available, in the response, WAF provides a NextMarker value that you can use in a subsequent call to get the next batch of objects.
     */
    Limit?: PaginationLimit;
  }
  export interface ListManagedRuleSetsResponse {
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * Your managed rule sets. 
     */
    ManagedRuleSets?: ManagedRuleSetSummaries;
  }
  export type ListMaxItems = number;
  export interface ListRegexPatternSetsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The maximum number of objects that you want WAF to return for this request. If more objects are available, in the response, WAF provides a NextMarker value that you can use in a subsequent call to get the next batch of objects.
     */
    Limit?: PaginationLimit;
  }
  export interface ListRegexPatternSetsResponse {
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * 
     */
    RegexPatternSets?: RegexPatternSetSummaries;
  }
  export interface ListResourcesForWebACLRequest {
    /**
     * The Amazon Resource Name (ARN) of the web ACL.
     */
    WebACLArn: ResourceArn;
    /**
     * Used for web ACLs that are scoped for regional applications. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API. 
     */
    ResourceType?: ResourceType;
  }
  export interface ListResourcesForWebACLResponse {
    /**
     * The array of Amazon Resource Names (ARNs) of the associated resources.
     */
    ResourceArns?: ResourceArns;
  }
  export interface ListRuleGroupsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The maximum number of objects that you want WAF to return for this request. If more objects are available, in the response, WAF provides a NextMarker value that you can use in a subsequent call to get the next batch of objects.
     */
    Limit?: PaginationLimit;
  }
  export interface ListRuleGroupsResponse {
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * 
     */
    RuleGroups?: RuleGroupSummaries;
  }
  export interface ListTagsForResourceRequest {
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The maximum number of objects that you want WAF to return for this request. If more objects are available, in the response, WAF provides a NextMarker value that you can use in a subsequent call to get the next batch of objects.
     */
    Limit?: PaginationLimit;
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceARN: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The collection of tagging definitions for the resource. 
     */
    TagInfoForResource?: TagInfoForResource;
  }
  export interface ListWebACLsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The maximum number of objects that you want WAF to return for this request. If more objects are available, in the response, WAF provides a NextMarker value that you can use in a subsequent call to get the next batch of objects.
     */
    Limit?: PaginationLimit;
  }
  export interface ListWebACLsResponse {
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * 
     */
    WebACLs?: WebACLSummaries;
  }
  export type LockToken = string;
  export type LogDestinationConfigs = ResourceArn[];
  export interface LoggingConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the web ACL that you want to associate with LogDestinationConfigs.
     */
    ResourceArn: ResourceArn;
    /**
     * The Amazon Kinesis Data Firehose Amazon Resource Name (ARNs) that you want to associate with the web ACL.
     */
    LogDestinationConfigs: LogDestinationConfigs;
    /**
     * The parts of the request that you want to keep out of the logs. For example, if you redact the SingleHeader field, the HEADER field in the firehose will be xxx.   You can specify only the following fields for redaction: UriPath, QueryString, SingleHeader, Method, and JsonBody. 
     */
    RedactedFields?: RedactedFields;
    /**
     * Indicates whether the logging configuration was created by Firewall Manager, as part of an WAF policy configuration. If true, only Firewall Manager can modify or delete the configuration. 
     */
    ManagedByFirewallManager?: Boolean;
    /**
     * Filtering that specifies which web requests are kept in the logs and which are dropped. You can filter on the rule action and on the web request labels that were applied by matching rules during web ACL evaluation. 
     */
    LoggingFilter?: LoggingFilter;
  }
  export type LoggingConfigurations = LoggingConfiguration[];
  export interface LoggingFilter {
    /**
     * The filters that you want to apply to the logs. 
     */
    Filters: Filters;
    /**
     * Default handling for logs that don't match any of the specified filtering conditions. 
     */
    DefaultBehavior: FilterBehavior;
  }
  export interface ManagedRuleGroupStatement {
    /**
     * The name of the managed rule group vendor. You use this, along with the rule group name, to identify the rule group.
     */
    VendorName: VendorName;
    /**
     * The name of the managed rule group. You use this, along with the vendor name, to identify the rule group.
     */
    Name: EntityName;
    /**
     * The version of the managed rule group to use. If you specify this, the version setting is fixed until you change it. If you don't specify this, WAF uses the vendor's default version, and then keeps the version at the vendor's default when the vendor updates the managed rule group settings. 
     */
    Version?: VersionKeyString;
    /**
     * The rules whose actions are set to COUNT by the web ACL, regardless of the action that is set on the rule. This effectively excludes the rule from acting on web requests. 
     */
    ExcludedRules?: ExcludedRules;
    /**
     * An optional nested statement that narrows the scope of the web requests that are evaluated by the managed rule group. Requests are only evaluated by the rule group if they match the scope-down statement. You can use any nestable Statement in the scope-down statement, and you can nest statements at any level, the same as you can for a rule statement. 
     */
    ScopeDownStatement?: Statement;
  }
  export type ManagedRuleGroupSummaries = ManagedRuleGroupSummary[];
  export interface ManagedRuleGroupSummary {
    /**
     * The name of the managed rule group vendor. You use this, along with the rule group name, to identify the rule group.
     */
    VendorName?: VendorName;
    /**
     * The name of the managed rule group. You use this, along with the vendor name, to identify the rule group.
     */
    Name?: EntityName;
    /**
     * The description of the managed rule group, provided by Amazon Web Services Managed Rules or the Amazon Web Services Marketplace seller who manages it.
     */
    Description?: EntityDescription;
  }
  export interface ManagedRuleGroupVersion {
    /**
     * The version name. 
     */
    Name?: VersionKeyString;
    /**
     * The date and time that the managed rule group owner updated the rule group version information. 
     */
    LastUpdateTimestamp?: Timestamp;
  }
  export type ManagedRuleGroupVersions = ManagedRuleGroupVersion[];
  export interface ManagedRuleSet {
    /**
     * The name of the managed rule set. You use this, along with the rule set ID, to identify the rule set. This name is assigned to the corresponding managed rule group, which your customers can access and use. 
     */
    Name: EntityName;
    /**
     * A unique identifier for the managed rule set. The ID is returned in the responses to commands like list. You provide it to operations like get and update.
     */
    Id: EntityId;
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN: ResourceArn;
    /**
     * A description of the set that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The versions of this managed rule set that are available for use by customers. 
     */
    PublishedVersions?: PublishedVersions;
    /**
     * The version that you would like your customers to use.
     */
    RecommendedVersion?: VersionKeyString;
    /**
     * The label namespace prefix for the managed rule groups that are offered to customers from this managed rule set. All labels that are added by rules in the managed rule group have this prefix.    The syntax for the label namespace prefix for a managed rule group is the following:   awswaf:managed:&lt;vendor&gt;:&lt;rule group name&gt;:   When a rule with a label matches a web request, WAF adds the fully qualified label to the request. A fully qualified label is made up of the label namespace from the rule group or web ACL where the rule is defined and the label from the rule, separated by a colon:   &lt;label namespace&gt;:&lt;label from rule&gt;   
     */
    LabelNamespace?: LabelName;
  }
  export type ManagedRuleSetSummaries = ManagedRuleSetSummary[];
  export interface ManagedRuleSetSummary {
    /**
     * The name of the managed rule set. You use this, along with the rule set ID, to identify the rule set. This name is assigned to the corresponding managed rule group, which your customers can access and use. 
     */
    Name?: EntityName;
    /**
     * A unique identifier for the managed rule set. The ID is returned in the responses to commands like list. You provide it to operations like get and update.
     */
    Id?: EntityId;
    /**
     * A description of the set that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken?: LockToken;
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN?: ResourceArn;
    /**
     * The label namespace prefix for the managed rule groups that are offered to customers from this managed rule set. All labels that are added by rules in the managed rule group have this prefix.    The syntax for the label namespace prefix for a managed rule group is the following:   awswaf:managed:&lt;vendor&gt;:&lt;rule group name&gt;:   When a rule with a label matches a web request, WAF adds the fully qualified label to the request. A fully qualified label is made up of the label namespace from the rule group or web ACL where the rule is defined and the label from the rule, separated by a colon:   &lt;label namespace&gt;:&lt;label from rule&gt;   
     */
    LabelNamespace?: LabelName;
  }
  export interface ManagedRuleSetVersion {
    /**
     * The Amazon Resource Name (ARN) of the vendor rule group that's used to define the published version of your managed rule group. 
     */
    AssociatedRuleGroupArn?: ResourceArn;
    /**
     * The web ACL capacity units (WCUs) required for this rule group. WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500. 
     */
    Capacity?: CapacityUnit;
    /**
     * The amount of time you expect this version of your managed rule group to last, in days. 
     */
    ForecastedLifetime?: TimeWindowDay;
    /**
     * The time that you first published this version.  Times are in Coordinated Universal Time (UTC) format. UTC format includes the special designator, Z. For example, "2016-09-27T14:50Z". 
     */
    PublishTimestamp?: Timestamp;
    /**
     * The last time that you updated this version.  Times are in Coordinated Universal Time (UTC) format. UTC format includes the special designator, Z. For example, "2016-09-27T14:50Z". 
     */
    LastUpdateTimestamp?: Timestamp;
    /**
     * The time that this version is set to expire. Times are in Coordinated Universal Time (UTC) format. UTC format includes the special designator, Z. For example, "2016-09-27T14:50Z". 
     */
    ExpiryTimestamp?: Timestamp;
  }
  export interface Method {
  }
  export type MetricName = string;
  export type NextMarker = string;
  export interface NoneAction {
  }
  export interface NotStatement {
    /**
     * The statement to negate. You can use any statement that can be nested.
     */
    Statement: Statement;
  }
  export interface OrStatement {
    /**
     * The statements to combine with OR logic. You can use any statements that can be nested.
     */
    Statements: Statements;
  }
  export interface OverrideAction {
    /**
     * Override the rule action setting to count.
     */
    Count?: CountAction;
    /**
     * Don't override the rule action setting.
     */
    None?: NoneAction;
  }
  export type PaginationLimit = number;
  export type PolicyString = string;
  export type PopulationSize = number;
  export type PositionalConstraint = "EXACTLY"|"STARTS_WITH"|"ENDS_WITH"|"CONTAINS"|"CONTAINS_WORD"|string;
  export type PublishedVersions = {[key: string]: ManagedRuleSetVersion};
  export interface PutLoggingConfigurationRequest {
    /**
     * 
     */
    LoggingConfiguration: LoggingConfiguration;
  }
  export interface PutLoggingConfigurationResponse {
    /**
     * 
     */
    LoggingConfiguration?: LoggingConfiguration;
  }
  export interface PutManagedRuleSetVersionsRequest {
    /**
     * The name of the managed rule set. You use this, along with the rule set ID, to identify the rule set. This name is assigned to the corresponding managed rule group, which your customers can access and use. 
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the managed rule set. The ID is returned in the responses to commands like list. You provide it to operations like get and update.
     */
    Id: EntityId;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken: LockToken;
    /**
     * The version of the named managed rule group that you'd like your customers to choose, from among your version offerings. 
     */
    RecommendedVersion?: VersionKeyString;
    /**
     * The versions of the named managed rule group that you want to offer to your customers. 
     */
    VersionsToPublish?: VersionsToPublish;
  }
  export interface PutManagedRuleSetVersionsResponse {
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    NextLockToken?: LockToken;
  }
  export interface PutPermissionPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the RuleGroup to which you want to attach the policy.
     */
    ResourceArn: ResourceArn;
    /**
     * The policy to attach to the specified rule group.  The policy specifications must conform to the following:   The policy must be composed using IAM Policy version 2012-10-17 or version 2015-01-01.   The policy must include specifications for Effect, Action, and Principal.    Effect must specify Allow.    Action must specify wafv2:CreateWebACL, wafv2:UpdateWebACL, and wafv2:PutFirewallManagerRuleGroups. WAF rejects any extra actions or wildcard actions in the policy.   The policy must not include a Resource parameter.   For more information, see IAM Policies. 
     */
    Policy: PolicyString;
  }
  export interface PutPermissionPolicyResponse {
  }
  export interface QueryString {
  }
  export interface RateBasedStatement {
    /**
     * The limit on requests per 5-minute period for a single originating IP address. If the statement includes a ScopeDownStatement, this limit is applied only to the requests that match the statement.
     */
    Limit: RateLimit;
    /**
     * Setting that indicates how to aggregate the request counts. The options are the following:   IP - Aggregate the request counts on the IP address from the web request origin.   FORWARDED_IP - Aggregate the request counts on the first IP address in an HTTP header. If you use this, configure the ForwardedIPConfig, to specify the header to use.   
     */
    AggregateKeyType: RateBasedStatementAggregateKeyType;
    /**
     * An optional nested statement that narrows the scope of the web requests that are evaluated by the rate-based statement. Requests are only tracked by the rate-based statement if they match the scope-down statement. You can use any nestable Statement in the scope-down statement, and you can nest statements at any level, the same as you can for a rule statement. 
     */
    ScopeDownStatement?: Statement;
    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.   If the specified header isn't present in the request, WAF doesn't apply the rule to the web request at all.  This is required if AggregateKeyType is set to FORWARDED_IP.
     */
    ForwardedIPConfig?: ForwardedIPConfig;
  }
  export type RateBasedStatementAggregateKeyType = "IP"|"FORWARDED_IP"|string;
  export interface RateBasedStatementManagedKeysIPSet {
    /**
     * The version of the IP addresses, either IPV4 or IPV6. 
     */
    IPAddressVersion?: IPAddressVersion;
    /**
     * The IP addresses that are currently blocked.
     */
    Addresses?: IPAddresses;
  }
  export type RateLimit = number;
  export type RedactedFields = FieldToMatch[];
  export interface Regex {
    /**
     * The string representing the regular expression.
     */
    RegexString?: RegexPatternString;
  }
  export interface RegexMatchStatement {
    /**
     * The string representing the regular expression.
     */
    RegexString: RegexPatternString;
    /**
     * The part of a web request that you want WAF to inspect. For more information, see FieldToMatch. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, WAF performs all transformations on the content of the request component identified by FieldToMatch, starting from the lowest priority setting, before inspecting the content for a match.
     */
    TextTransformations: TextTransformations;
  }
  export interface RegexPatternSet {
    /**
     * The name of the set. You cannot change the name after you create the set.
     */
    Name?: EntityName;
    /**
     * A unique identifier for the set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id?: EntityId;
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN?: ResourceArn;
    /**
     * A description of the set that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The regular expression patterns in the set.
     */
    RegularExpressionList?: RegularExpressionList;
  }
  export interface RegexPatternSetReferenceStatement {
    /**
     * The Amazon Resource Name (ARN) of the RegexPatternSet that this statement references.
     */
    ARN: ResourceArn;
    /**
     * The part of a web request that you want WAF to inspect. For more information, see FieldToMatch. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, WAF performs all transformations on the content of the request component identified by FieldToMatch, starting from the lowest priority setting, before inspecting the content for a match.
     */
    TextTransformations: TextTransformations;
  }
  export type RegexPatternSetSummaries = RegexPatternSetSummary[];
  export interface RegexPatternSetSummary {
    /**
     * The name of the data type instance. You cannot change the name after you create the instance.
     */
    Name?: EntityName;
    /**
     * A unique identifier for the set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id?: EntityId;
    /**
     * A description of the set that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken?: LockToken;
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN?: ResourceArn;
  }
  export type RegexPatternString = string;
  export type RegularExpressionList = Regex[];
  export type ResourceArn = string;
  export type ResourceArns = ResourceArn[];
  export type ResourceType = "APPLICATION_LOAD_BALANCER"|"API_GATEWAY"|"APPSYNC"|string;
  export type ResponseContent = string;
  export type ResponseContentType = "TEXT_PLAIN"|"TEXT_HTML"|"APPLICATION_JSON"|string;
  export type ResponseStatusCode = number;
  export interface Rule {
    /**
     * The name of the rule. You can't change the name of a Rule after you create it. 
     */
    Name: EntityName;
    /**
     * If you define more than one Rule in a WebACL, WAF evaluates each request against the Rules in order based on the value of Priority. WAF processes rules with lower priority first. The priorities don't need to be consecutive, but they must all be different.
     */
    Priority: RulePriority;
    /**
     * The WAF processing statement for the rule, for example ByteMatchStatement or SizeConstraintStatement. 
     */
    Statement: Statement;
    /**
     * The action that WAF should take on a web request when it matches the rule statement. Settings at the web ACL level can override the rule action setting.  This is used only for rules whose statements do not reference a rule group. Rule statements that reference a rule group include RuleGroupReferenceStatement and ManagedRuleGroupStatement.  You must specify either this Action setting or the rule OverrideAction setting, but not both:   If the rule statement does not reference a rule group, use this rule action setting and not the rule override action setting.    If the rule statement references a rule group, use the override action setting and not this action setting.   
     */
    Action?: RuleAction;
    /**
     * The override action to apply to the rules in a rule group. Used only for rule statements that reference a rule group, like RuleGroupReferenceStatement and ManagedRuleGroupStatement.  Set the override action to none to leave the rule actions in effect. Set it to count to only count matches, regardless of the rule action settings.  In a Rule, you must specify either this OverrideAction setting or the rule Action setting, but not both:   If the rule statement references a rule group, use this override action setting and not the action setting.    If the rule statement does not reference a rule group, use the rule action setting and not this rule override action setting.   
     */
    OverrideAction?: OverrideAction;
    /**
     * Labels to apply to web requests that match the rule match statement. WAF applies fully qualified labels to matching web requests. A fully qualified label is the concatenation of a label namespace and a rule label. The rule's rule group or web ACL defines the label namespace.  Rules that run after this rule in the web ACL can match against these labels using a LabelMatchStatement. For each label, provide a case-sensitive string containing optional namespaces and a label name, according to the following guidelines:   Separate each component of the label with a colon.    Each namespace or name can have up to 128 characters.   You can specify up to 5 namespaces in a label.   Don't use the following reserved words in your label specification: aws, waf, managed, rulegroup, webacl, regexpatternset, or ipset.   For example, myLabelName or nameSpace1:nameSpace2:myLabelName. 
     */
    RuleLabels?: Labels;
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection. 
     */
    VisibilityConfig: VisibilityConfig;
  }
  export interface RuleAction {
    /**
     * Instructs WAF to block the web request.
     */
    Block?: BlockAction;
    /**
     * Instructs WAF to allow the web request.
     */
    Allow?: AllowAction;
    /**
     * Instructs WAF to count the web request and allow it.
     */
    Count?: CountAction;
  }
  export interface RuleGroup {
    /**
     * The name of the rule group. You cannot change the name of a rule group after you create it.
     */
    Name: EntityName;
    /**
     * A unique identifier for the rule group. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
    /**
     * The web ACL capacity units (WCUs) required for this rule group. When you create your own rule group, you define this, and you cannot change it after creation. When you add or modify the rules in a rule group, WAF enforces this limit. You can check the capacity for a set of rules using CheckCapacity. WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500. 
     */
    Capacity: CapacityUnit;
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN: ResourceArn;
    /**
     * A description of the rule group that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The Rule statements used to identify the web requests that you want to allow, block, or count. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
     */
    Rules?: Rules;
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection. 
     */
    VisibilityConfig: VisibilityConfig;
    /**
     * The label namespace prefix for this rule group. All labels added by rules in this rule group have this prefix.    The syntax for the label namespace prefix for your rule groups is the following:   awswaf:&lt;account ID&gt;:rulegroup:&lt;rule group name&gt;:    When a rule with a label matches a web request, WAF adds the fully qualified label to the request. A fully qualified label is made up of the label namespace from the rule group or web ACL where the rule is defined and the label from the rule, separated by a colon:   &lt;label namespace&gt;:&lt;label from rule&gt;   
     */
    LabelNamespace?: LabelName;
    /**
     * A map of custom response keys and content bodies. When you create a rule with a block action, you can send a custom response to the web request. You define these for the rule group, and then use them in the rules that you define in the rule group.  For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide.  For information about the limits on count and size for custom request and response settings, see WAF quotas in the WAF Developer Guide. 
     */
    CustomResponseBodies?: CustomResponseBodies;
    /**
     * The labels that one or more rules in this rule group add to matching web requests. These labels are defined in the RuleLabels for a Rule.
     */
    AvailableLabels?: LabelSummaries;
    /**
     * The labels that one or more rules in this rule group match against in label match statements. These labels are defined in a LabelMatchStatement specification, in the Statement definition of a rule. 
     */
    ConsumedLabels?: LabelSummaries;
  }
  export interface RuleGroupReferenceStatement {
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN: ResourceArn;
    /**
     * The names of rules that are in the referenced rule group, but that you want WAF to exclude from processing for this rule statement. 
     */
    ExcludedRules?: ExcludedRules;
  }
  export type RuleGroupSummaries = RuleGroupSummary[];
  export interface RuleGroupSummary {
    /**
     * The name of the data type instance. You cannot change the name after you create the instance.
     */
    Name?: EntityName;
    /**
     * A unique identifier for the rule group. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id?: EntityId;
    /**
     * A description of the rule group that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken?: LockToken;
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN?: ResourceArn;
  }
  export type RulePriority = number;
  export type RuleSummaries = RuleSummary[];
  export interface RuleSummary {
    /**
     * The name of the rule. 
     */
    Name?: EntityName;
    /**
     * The action that WAF should take on a web request when it matches a rule's statement. Settings at the web ACL level can override the rule action setting. 
     */
    Action?: RuleAction;
  }
  export type Rules = Rule[];
  export type SampleWeight = number;
  export interface SampledHTTPRequest {
    /**
     * A complex type that contains detailed information about the request.
     */
    Request: HTTPRequest;
    /**
     * A value that indicates how one result in the response relates proportionally to other results in the response. For example, a result that has a weight of 2 represents roughly twice as many web requests as a result that has a weight of 1.
     */
    Weight: SampleWeight;
    /**
     * The time at which WAF received the request from your Amazon Web Services resource, in Unix time format (in seconds).
     */
    Timestamp?: Timestamp;
    /**
     * The action for the Rule that the request matched: ALLOW, BLOCK, or COUNT.
     */
    Action?: Action;
    /**
     * The name of the Rule that the request matched. For managed rule groups, the format for this name is &lt;vendor name&gt;#&lt;managed rule group name&gt;#&lt;rule name&gt;. For your own rule groups, the format for this name is &lt;rule group name&gt;#&lt;rule name&gt;. If the rule is not in a rule group, this field is absent. 
     */
    RuleNameWithinRuleGroup?: EntityName;
    /**
     * Custom request headers inserted by WAF into the request, according to the custom request configuration for the matching rule action.
     */
    RequestHeadersInserted?: HTTPHeaders;
    /**
     * The response code that was sent for the request.
     */
    ResponseCodeSent?: ResponseStatusCode;
    /**
     * Labels applied to the web request by matching rules. WAF applies fully qualified labels to matching web requests. A fully qualified label is the concatenation of a label namespace and a rule label. The rule's rule group or web ACL defines the label namespace.  For example, awswaf:111122223333:myRuleGroup:testRules:testNS1:testNS2:labelNameA or awswaf:managed:aws:managed-rule-set:header:encoding:utf8. 
     */
    Labels?: Labels;
  }
  export type SampledHTTPRequests = SampledHTTPRequest[];
  export type Scope = "CLOUDFRONT"|"REGIONAL"|string;
  export type SearchString = Buffer|Uint8Array|Blob|string;
  export interface SingleHeader {
    /**
     * The name of the query header to inspect.
     */
    Name: FieldToMatchData;
  }
  export interface SingleQueryArgument {
    /**
     * The name of the query argument to inspect.
     */
    Name: FieldToMatchData;
  }
  export type Size = number;
  export interface SizeConstraintStatement {
    /**
     * The part of a web request that you want WAF to inspect. For more information, see FieldToMatch. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * The operator to use to compare the request part to the size setting. 
     */
    ComparisonOperator: ComparisonOperator;
    /**
     * The size, in byte, to compare to the request part, after any transformations.
     */
    Size: Size;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, WAF performs all transformations on the content of the request component identified by FieldToMatch, starting from the lowest priority setting, before inspecting the content for a match.
     */
    TextTransformations: TextTransformations;
  }
  export interface SqliMatchStatement {
    /**
     * The part of a web request that you want WAF to inspect. For more information, see FieldToMatch. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, WAF performs all transformations on the content of the request component identified by FieldToMatch, starting from the lowest priority setting, before inspecting the content for a match.
     */
    TextTransformations: TextTransformations;
  }
  export interface Statement {
    /**
     * A rule statement that defines a string match search for WAF to apply to web requests. The byte match statement provides the bytes to search for, the location in requests that you want WAF to search, and other settings. The bytes to search for are typically a string that corresponds with ASCII characters. In the WAF console and the developer guide, this is refered to as a string match statement.
     */
    ByteMatchStatement?: ByteMatchStatement;
    /**
     * Attackers sometimes insert malicious SQL code into web requests in an effort to extract data from your database. To allow or block web requests that appear to contain malicious SQL code, create one or more SQL injection match conditions. An SQL injection match condition identifies the part of web requests, such as the URI or the query string, that you want WAF to inspect. Later in the process, when you create a web ACL, you specify whether to allow or block requests that appear to contain malicious SQL code.
     */
    SqliMatchStatement?: SqliMatchStatement;
    /**
     * A rule statement that defines a cross-site scripting (XSS) match search for WAF to apply to web requests. XSS attacks are those where the attacker uses vulnerabilities in a benign website as a vehicle to inject malicious client-site scripts into other legitimate web browsers. The XSS match statement provides the location in requests that you want WAF to search and text transformations to use on the search area before WAF searches for character sequences that are likely to be malicious strings. 
     */
    XssMatchStatement?: XssMatchStatement;
    /**
     * A rule statement that compares a number of bytes against the size of a request component, using a comparison operator, such as greater than (&gt;) or less than (&lt;). For example, you can use a size constraint statement to look for query strings that are longer than 100 bytes.  If you configure WAF to inspect the request body, WAF inspects only the first 8192 bytes (8 KB). If the request body for your web requests never exceeds 8192 bytes, you can create a size constraint condition and block requests that have a request body greater than 8192 bytes. If you choose URI for the value of Part of the request to filter on, the slash (/) in the URI counts as one character. For example, the URI /logo.jpg is nine characters long.
     */
    SizeConstraintStatement?: SizeConstraintStatement;
    /**
     * A rule statement used to identify web requests based on country of origin. 
     */
    GeoMatchStatement?: GeoMatchStatement;
    /**
     * A rule statement used to run the rules that are defined in a RuleGroup. To use this, create a rule group with your rules, then provide the ARN of the rule group in this statement. You cannot nest a RuleGroupReferenceStatement, for example for use inside a NotStatement or OrStatement. You can only use a rule group reference statement at the top level inside a web ACL. 
     */
    RuleGroupReferenceStatement?: RuleGroupReferenceStatement;
    /**
     * A rule statement used to detect web requests coming from particular IP addresses or address ranges. To use this, create an IPSet that specifies the addresses you want to detect, then use the ARN of that set in this statement. To create an IP set, see CreateIPSet. Each IP set rule statement references an IP set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, WAF automatically updates all rules that reference it.
     */
    IPSetReferenceStatement?: IPSetReferenceStatement;
    /**
     * A rule statement used to search web request components for matches with regular expressions. To use this, create a RegexPatternSet that specifies the expressions that you want to detect, then use the ARN of that set in this statement. A web request matches the pattern set rule statement if the request component matches any of the patterns in the set. To create a regex pattern set, see CreateRegexPatternSet. Each regex pattern set rule statement references a regex pattern set. You create and maintain the set independent of your rules. This allows you to use the single set in multiple rules. When you update the referenced set, WAF automatically updates all rules that reference it.
     */
    RegexPatternSetReferenceStatement?: RegexPatternSetReferenceStatement;
    /**
     * A rate-based rule tracks the rate of requests for each originating IP address, and triggers the rule action when the rate exceeds a limit that you specify on the number of requests in any 5-minute time span. You can use this to put a temporary block on requests from an IP address that is sending excessive requests.  WAF tracks and manages web requests separately for each instance of a rate-based rule that you use. For example, if you provide the same rate-based rule settings in two web ACLs, each of the two rule statements represents a separate instance of the rate-based rule and gets its own tracking and management by WAF. If you define a rate-based rule inside a rule group, and then use that rule group in multiple places, each use creates a separate instance of the rate-based rule that gets its own tracking and management by WAF.  When the rule action triggers, WAF blocks additional requests from the IP address until the request rate falls below the limit. You can optionally nest another statement inside the rate-based statement, to narrow the scope of the rule so that it only counts requests that match the nested statement. For example, based on recent requests that you have seen from an attacker, you might create a rate-based rule with a nested AND rule statement that contains the following nested statements:   An IP match statement with an IP set that specified the address 192.0.2.44.   A string match statement that searches in the User-Agent header for the string BadBot.   In this rate-based rule, you also define a rate limit. For this example, the rate limit is 1,000. Requests that meet both of the conditions in the statements are counted. If the count exceeds 1,000 requests per five minutes, the rule action triggers. Requests that do not meet both conditions are not counted towards the rate limit and are not affected by this rule. You cannot nest a RateBasedStatement inside another statement, for example inside a NotStatement or OrStatement. You can define a RateBasedStatement inside a web ACL and inside a rule group. 
     */
    RateBasedStatement?: RateBasedStatement;
    /**
     * A logical rule statement used to combine other rule statements with AND logic. You provide more than one Statement within the AndStatement. 
     */
    AndStatement?: AndStatement;
    /**
     * A logical rule statement used to combine other rule statements with OR logic. You provide more than one Statement within the OrStatement. 
     */
    OrStatement?: OrStatement;
    /**
     * A logical rule statement used to negate the results of another rule statement. You provide one Statement within the NotStatement.
     */
    NotStatement?: NotStatement;
    /**
     * A rule statement used to run the rules that are defined in a managed rule group. To use this, provide the vendor name and the name of the rule group in this statement. You can retrieve the required names by calling ListAvailableManagedRuleGroups. You cannot nest a ManagedRuleGroupStatement, for example for use inside a NotStatement or OrStatement. It can only be referenced as a top-level statement within a rule.
     */
    ManagedRuleGroupStatement?: ManagedRuleGroupStatement;
    /**
     * A rule statement that defines a string match search against labels that have been added to the web request by rules that have already run in the web ACL.  The label match statement provides the label or namespace string to search for. The label string can represent a part or all of the fully qualified label name that had been added to the web request. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. If you do not provide the fully qualified name in your label match string, WAF performs the search for labels that were added in the same context as the label match statement. 
     */
    LabelMatchStatement?: LabelMatchStatement;
    /**
     * A rule statement used to search web request components for a match against a single regular expression. 
     */
    RegexMatchStatement?: RegexMatchStatement;
  }
  export type Statements = Statement[];
  export interface Tag {
    /**
     * Part of the key:value pair that defines a tag. You can use a tag key to describe a category of information, such as "customer." Tag keys are case-sensitive.
     */
    Key: TagKey;
    /**
     * Part of the key:value pair that defines a tag. You can use a tag value to describe a specific value within a category, such as "companyA" or "companyB." Tag values are case-sensitive.
     */
    Value: TagValue;
  }
  export interface TagInfoForResource {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceARN?: ResourceArn;
    /**
     * The array of Tag objects defined for the resource. 
     */
    TagList?: TagList;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceARN: ResourceArn;
    /**
     * An array of key:value pairs to associate with the resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TextTransformation {
    /**
     * Sets the relative processing order for multiple transformations that are defined for a rule statement. WAF processes all transformations, from lowest priority to highest, before inspecting the transformed content. The priorities don't need to be consecutive, but they must all be different. 
     */
    Priority: TextTransformationPriority;
    /**
     * You can specify the following transformation types:  BASE64_DECODE - Decode a Base64-encoded string.  BASE64_DECODE_EXT - Decode a Base64-encoded string, but use a forgiving implementation that ignores characters that aren't valid.  CMD_LINE - Command-line transformations. These are helpful in reducing effectiveness of attackers who inject an operating system command-line command and use unusual formatting to disguise some or all of the command.    Delete the following characters: \ " ' ^    Delete spaces before the following characters: / (    Replace the following characters with a space: , ;    Replace multiple spaces with one space   Convert uppercase letters (A-Z) to lowercase (a-z)    COMPRESS_WHITE_SPACE - Replace these characters with a space character (decimal 32):     \f, formfeed, decimal 12    \t, tab, decimal 9    \n, newline, decimal 10    \r, carriage return, decimal 13    \v, vertical tab, decimal 11   Non-breaking space, decimal 160    COMPRESS_WHITE_SPACE also replaces multiple spaces with one space.  CSS_DECODE - Decode characters that were encoded using CSS 2.x escape rules syndata.html#characters. This function uses up to two bytes in the decoding process, so it can help to uncover ASCII characters that were encoded using CSS encoding that wouldn’t typically be encoded. It's also useful in countering evasion, which is a combination of a backslash and non-hexadecimal characters. For example, ja\vascript for javascript.   ESCAPE_SEQ_DECODE - Decode the following ANSI C escape sequences: \a, \b, \f, \n, \r, \t, \v, \\, \?, \', \", \xHH (hexadecimal), \0OOO (octal). Encodings that aren't valid remain in the output.   HEX_DECODE - Decode a string of hexadecimal characters into a binary.  HTML_ENTITY_DECODE - Replace HTML-encoded characters with unencoded characters. HTML_ENTITY_DECODE performs these operations:    Replaces (ampersand)quot; with "    Replaces (ampersand)nbsp; with a non-breaking space, decimal 160   Replaces (ampersand)lt; with a "less than" symbol   Replaces (ampersand)gt; with &gt;    Replaces characters that are represented in hexadecimal format, (ampersand)#xhhhh;, with the corresponding characters   Replaces characters that are represented in decimal format, (ampersand)#nnnn;, with the corresponding characters    JS_DECODE - Decode JavaScript escape sequences. If a \ u HHHH code is in the full-width ASCII code range of FF01-FF5E, then the higher byte is used to detect and adjust the lower byte. If not, only the lower byte is used and the higher byte is zeroed, causing a possible loss of information.   LOWERCASE - Convert uppercase letters (A-Z) to lowercase (a-z).   MD5 - Calculate an MD5 hash from the data in the input. The computed hash is in a raw binary form.   NONE - Specify NONE if you don't want any text transformations.   NORMALIZE_PATH - Remove multiple slashes, directory self-references, and directory back-references that are not at the beginning of the input from an input string.   NORMALIZE_PATH_WIN - This is the same as NORMALIZE_PATH, but first converts backslash characters to forward slashes.   REMOVE_NULLS - Remove all NULL bytes from the input.   REPLACE_COMMENTS - Replace each occurrence of a C-style comment (/* ... *) with a single space. Multiple consecutive occurrences are not compressed. Unterminated comments are also replaced with a space (ASCII 0x20). However, a standalone termination of a comment (*) is not acted upon.   REPLACE_NULLS - Replace NULL bytes in the input with space characters (ASCII 0x20).   SQL_HEX_DECODE - Decode SQL hex data. Example (0x414243) will be decoded to (ABC).  URL_DECODE - Decode a URL-encoded value.   URL_DECODE_UNI - Like URL_DECODE, but with support for Microsoft-specific %u encoding. If the code is in the full-width ASCII code range of FF01-FF5E, the higher byte is used to detect and adjust the lower byte. Otherwise, only the lower byte is used and the higher byte is zeroed.   UTF8_TO_UNICODE - Convert all UTF-8 character sequences to Unicode. This helps input normalization, and minimizing false-positives and false-negatives for non-English languages.
     */
    Type: TextTransformationType;
  }
  export type TextTransformationPriority = number;
  export type TextTransformationType = "NONE"|"COMPRESS_WHITE_SPACE"|"HTML_ENTITY_DECODE"|"LOWERCASE"|"CMD_LINE"|"URL_DECODE"|"BASE64_DECODE"|"HEX_DECODE"|"MD5"|"REPLACE_COMMENTS"|"ESCAPE_SEQ_DECODE"|"SQL_HEX_DECODE"|"CSS_DECODE"|"JS_DECODE"|"NORMALIZE_PATH"|"NORMALIZE_PATH_WIN"|"REMOVE_NULLS"|"REPLACE_NULLS"|"BASE64_DECODE_EXT"|"URL_DECODE_UNI"|"UTF8_TO_UNICODE"|string;
  export type TextTransformations = TextTransformation[];
  export interface TimeWindow {
    /**
     * The beginning of the time range from which you want GetSampledRequests to return a sample of the requests that your Amazon Web Services resource received. You must specify the times in Coordinated Universal Time (UTC) format. UTC format includes the special designator, Z. For example, "2016-09-27T14:50Z". You can specify any time range in the previous three hours.
     */
    StartTime: Timestamp;
    /**
     * The end of the time range from which you want GetSampledRequests to return a sample of the requests that your Amazon Web Services resource received. You must specify the times in Coordinated Universal Time (UTC) format. UTC format includes the special designator, Z. For example, "2016-09-27T14:50Z". You can specify any time range in the previous three hours.
     */
    EndTime: Timestamp;
  }
  export type TimeWindowDay = number;
  export type Timestamp = Date;
  export type URIString = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceARN: ResourceArn;
    /**
     * An array of keys identifying the tags to disassociate from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateIPSetRequest {
    /**
     * The name of the IP set. You cannot change the name of an IPSet after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
    /**
     * A description of the IP set that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * Contains an array of strings that specify one or more IP addresses or blocks of IP addresses in Classless Inter-Domain Routing (CIDR) notation. WAF supports all IPv4 and IPv6 CIDR ranges except for /0.  Examples:    To configure WAF to allow, block, or count requests that originated from the IP address 192.0.2.44, specify 192.0.2.44/32.   To configure WAF to allow, block, or count requests that originated from IP addresses from 192.0.2.0 to 192.0.2.255, specify 192.0.2.0/24.   To configure WAF to allow, block, or count requests that originated from the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify 1111:0000:0000:0000:0000:0000:0000:0111/128.   To configure WAF to allow, block, or count requests that originated from IP addresses 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify 1111:0000:0000:0000:0000:0000:0000:0000/64.   For more information about CIDR notation, see the Wikipedia entry Classless Inter-Domain Routing.
     */
    Addresses: IPAddresses;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken: LockToken;
  }
  export interface UpdateIPSetResponse {
    /**
     * A token used for optimistic locking. WAF returns this token to your update requests. You use NextLockToken in the same manner as you use LockToken. 
     */
    NextLockToken?: LockToken;
  }
  export interface UpdateManagedRuleSetVersionExpiryDateRequest {
    /**
     * The name of the managed rule set. You use this, along with the rule set ID, to identify the rule set. This name is assigned to the corresponding managed rule group, which your customers can access and use. 
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the managed rule set. The ID is returned in the responses to commands like list. You provide it to operations like get and update.
     */
    Id: EntityId;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken: LockToken;
    /**
     * The version that you want to remove from your list of offerings for the named managed rule group. 
     */
    VersionToExpire: VersionKeyString;
    /**
     * The time that you want the version to expire. Times are in Coordinated Universal Time (UTC) format. UTC format includes the special designator, Z. For example, "2016-09-27T14:50Z". 
     */
    ExpiryTimestamp: Timestamp;
  }
  export interface UpdateManagedRuleSetVersionExpiryDateResponse {
    /**
     * The version that is set to expire. 
     */
    ExpiringVersion?: VersionKeyString;
    /**
     * The time that the version will expire.  Times are in Coordinated Universal Time (UTC) format. UTC format includes the special designator, Z. For example, "2016-09-27T14:50Z". 
     */
    ExpiryTimestamp?: Timestamp;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    NextLockToken?: LockToken;
  }
  export interface UpdateRegexPatternSetRequest {
    /**
     * The name of the set. You cannot change the name after you create the set.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
    /**
     * A description of the set that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * 
     */
    RegularExpressionList: RegularExpressionList;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken: LockToken;
  }
  export interface UpdateRegexPatternSetResponse {
    /**
     * A token used for optimistic locking. WAF returns this token to your update requests. You use NextLockToken in the same manner as you use LockToken. 
     */
    NextLockToken?: LockToken;
  }
  export interface UpdateRuleGroupRequest {
    /**
     * The name of the rule group. You cannot change the name of a rule group after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * A unique identifier for the rule group. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
    /**
     * A description of the rule group that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The Rule statements used to identify the web requests that you want to allow, block, or count. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
     */
    Rules?: Rules;
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection. 
     */
    VisibilityConfig: VisibilityConfig;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken: LockToken;
    /**
     * A map of custom response keys and content bodies. When you create a rule with a block action, you can send a custom response to the web request. You define these for the rule group, and then use them in the rules that you define in the rule group.  For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide.  For information about the limits on count and size for custom request and response settings, see WAF quotas in the WAF Developer Guide. 
     */
    CustomResponseBodies?: CustomResponseBodies;
  }
  export interface UpdateRuleGroupResponse {
    /**
     * A token used for optimistic locking. WAF returns this token to your update requests. You use NextLockToken in the same manner as you use LockToken. 
     */
    NextLockToken?: LockToken;
  }
  export interface UpdateWebACLRequest {
    /**
     * The name of the web ACL. You cannot change the name of a web ACL after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, or an AppSync GraphQL API.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The unique identifier for the web ACL. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id: EntityId;
    /**
     * The action to perform if none of the Rules contained in the WebACL match. 
     */
    DefaultAction: DefaultAction;
    /**
     * A description of the web ACL that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The Rule statements used to identify the web requests that you want to allow, block, or count. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
     */
    Rules?: Rules;
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection. 
     */
    VisibilityConfig: VisibilityConfig;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken: LockToken;
    /**
     * A map of custom response keys and content bodies. When you create a rule with a block action, you can send a custom response to the web request. You define these for the web ACL, and then use them in the rules and default actions that you define in the web ACL.  For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide.  For information about the limits on count and size for custom request and response settings, see WAF quotas in the WAF Developer Guide. 
     */
    CustomResponseBodies?: CustomResponseBodies;
  }
  export interface UpdateWebACLResponse {
    /**
     * A token used for optimistic locking. WAF returns this token to your update requests. You use NextLockToken in the same manner as you use LockToken. 
     */
    NextLockToken?: LockToken;
  }
  export interface UriPath {
  }
  export type VendorName = string;
  export type VersionKeyString = string;
  export interface VersionToPublish {
    /**
     * The Amazon Resource Name (ARN) of the vendor's rule group that's used in the published managed rule group version. 
     */
    AssociatedRuleGroupArn?: ResourceArn;
    /**
     * The amount of time the vendor expects this version of the managed rule group to last, in days. 
     */
    ForecastedLifetime?: TimeWindowDay;
  }
  export type VersionsToPublish = {[key: string]: VersionToPublish};
  export interface VisibilityConfig {
    /**
     * A boolean indicating whether WAF should store a sampling of the web requests that match the rules. You can view the sampled requests through the WAF console. 
     */
    SampledRequestsEnabled: Boolean;
    /**
     * A boolean indicating whether the associated resource sends metrics to Amazon CloudWatch. For the list of available metrics, see WAF Metrics.
     */
    CloudWatchMetricsEnabled: Boolean;
    /**
     * A name of the Amazon CloudWatch metric. The name can contain only the characters: A-Z, a-z, 0-9, - (hyphen), and _ (underscore). The name can be from one to 128 characters long. It can't contain whitespace or metric names reserved for WAF, for example "All" and "Default_Action." 
     */
    MetricName: MetricName;
  }
  export interface WebACL {
    /**
     * The name of the web ACL. You cannot change the name of a web ACL after you create it.
     */
    Name: EntityName;
    /**
     * A unique identifier for the WebACL. This ID is returned in the responses to create and list commands. You use this ID to do things like get, update, and delete a WebACL.
     */
    Id: EntityId;
    /**
     * The Amazon Resource Name (ARN) of the web ACL that you want to associate with the resource.
     */
    ARN: ResourceArn;
    /**
     * The action to perform if none of the Rules contained in the WebACL match. 
     */
    DefaultAction: DefaultAction;
    /**
     * A description of the web ACL that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The Rule statements used to identify the web requests that you want to allow, block, or count. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
     */
    Rules?: Rules;
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection. 
     */
    VisibilityConfig: VisibilityConfig;
    /**
     * The web ACL capacity units (WCUs) currently being used by this web ACL.  WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. The WCU limit for web ACLs is 1,500. 
     */
    Capacity?: ConsumedCapacity;
    /**
     * The first set of rules for WAF to process in the web ACL. This is defined in an Firewall Manager WAF policy and contains only rule group references. You can't alter these. Any rules and rule groups that you define for the web ACL are prioritized after these.  In the Firewall Manager WAF policy, the Firewall Manager administrator can define a set of rule groups to run first in the web ACL and a set of rule groups to run last. Within each set, the administrator prioritizes the rule groups, to determine their relative processing order.
     */
    PreProcessFirewallManagerRuleGroups?: FirewallManagerRuleGroups;
    /**
     * The last set of rules for WAF to process in the web ACL. This is defined in an Firewall Manager WAF policy and contains only rule group references. You can't alter these. Any rules and rule groups that you define for the web ACL are prioritized before these.  In the Firewall Manager WAF policy, the Firewall Manager administrator can define a set of rule groups to run first in the web ACL and a set of rule groups to run last. Within each set, the administrator prioritizes the rule groups, to determine their relative processing order.
     */
    PostProcessFirewallManagerRuleGroups?: FirewallManagerRuleGroups;
    /**
     * Indicates whether this web ACL is managed by Firewall Manager. If true, then only Firewall Manager can delete the web ACL or any Firewall Manager rule groups in the web ACL. 
     */
    ManagedByFirewallManager?: Boolean;
    /**
     * The label namespace prefix for this web ACL. All labels added by rules in this web ACL have this prefix.    The syntax for the label namespace prefix for a web ACL is the following:   awswaf:&lt;account ID&gt;:webacl:&lt;web ACL name&gt;:    When a rule with a label matches a web request, WAF adds the fully qualified label to the request. A fully qualified label is made up of the label namespace from the rule group or web ACL where the rule is defined and the label from the rule, separated by a colon:   &lt;label namespace&gt;:&lt;label from rule&gt;   
     */
    LabelNamespace?: LabelName;
    /**
     * A map of custom response keys and content bodies. When you create a rule with a block action, you can send a custom response to the web request. You define these for the web ACL, and then use them in the rules and default actions that you define in the web ACL.  For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide.  For information about the limits on count and size for custom request and response settings, see WAF quotas in the WAF Developer Guide. 
     */
    CustomResponseBodies?: CustomResponseBodies;
  }
  export type WebACLSummaries = WebACLSummary[];
  export interface WebACLSummary {
    /**
     * The name of the web ACL. You cannot change the name of a web ACL after you create it.
     */
    Name?: EntityName;
    /**
     * The unique identifier for the web ACL. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id?: EntityId;
    /**
     * A description of the web ACL that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * A token used for optimistic locking. WAF returns a token to your get and list requests, to mark the state of the entity at the time of the request. To make changes to the entity associated with the token, you provide the token to operations like update and delete. WAF uses the token to ensure that no changes have been made to the entity since you last retrieved it. If a change has been made, the update fails with a WAFOptimisticLockException. If this happens, perform another get, and use the new token returned by that operation. 
     */
    LockToken?: LockToken;
    /**
     * The Amazon Resource Name (ARN) of the entity.
     */
    ARN?: ResourceArn;
  }
  export interface XssMatchStatement {
    /**
     * The part of a web request that you want WAF to inspect. For more information, see FieldToMatch. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. If you specify one or more transformations in a rule statement, WAF performs all transformations on the content of the request component identified by FieldToMatch, starting from the lowest priority setting, before inspecting the content for a match.
     */
    TextTransformations: TextTransformations;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-07-29"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the WAFV2 client.
   */
  export import Types = WAFV2;
}
export = WAFV2;
