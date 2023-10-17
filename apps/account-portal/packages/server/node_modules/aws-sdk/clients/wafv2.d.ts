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
   * Associates a web ACL with a regional application resource, to protect the resource. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  For Amazon CloudFront, don't use this call. Instead, use your CloudFront distribution configuration. To associate a web ACL, in the CloudFront call UpdateDistribution, set the web ACL ID to the Amazon Resource Name (ARN) of the web ACL. For information, see UpdateDistribution in the Amazon CloudFront Developer Guide.  When you make changes to web ACLs or web ACL components, like rules and rule groups, WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an Amazon Web Services resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.
   */
  associateWebACL(params: WAFV2.Types.AssociateWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.AssociateWebACLResponse) => void): Request<WAFV2.Types.AssociateWebACLResponse, AWSError>;
  /**
   * Associates a web ACL with a regional application resource, to protect the resource. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  For Amazon CloudFront, don't use this call. Instead, use your CloudFront distribution configuration. To associate a web ACL, in the CloudFront call UpdateDistribution, set the web ACL ID to the Amazon Resource Name (ARN) of the web ACL. For information, see UpdateDistribution in the Amazon CloudFront Developer Guide.  When you make changes to web ACLs or web ACL components, like rules and rule groups, WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an Amazon Web Services resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.
   */
  associateWebACL(callback?: (err: AWSError, data: WAFV2.Types.AssociateWebACLResponse) => void): Request<WAFV2.Types.AssociateWebACLResponse, AWSError>;
  /**
   * Returns the web ACL capacity unit (WCU) requirements for a specified scope and set of rules. You can use this to check the capacity requirements for the rules you want to use in a RuleGroup or WebACL.  WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. For more information, see WAF web ACL capacity units (WCU) in the WAF Developer Guide. 
   */
  checkCapacity(params: WAFV2.Types.CheckCapacityRequest, callback?: (err: AWSError, data: WAFV2.Types.CheckCapacityResponse) => void): Request<WAFV2.Types.CheckCapacityResponse, AWSError>;
  /**
   * Returns the web ACL capacity unit (WCU) requirements for a specified scope and set of rules. You can use this to check the capacity requirements for the rules you want to use in a RuleGroup or WebACL.  WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. For more information, see WAF web ACL capacity units (WCU) in the WAF Developer Guide. 
   */
  checkCapacity(callback?: (err: AWSError, data: WAFV2.Types.CheckCapacityResponse) => void): Request<WAFV2.Types.CheckCapacityResponse, AWSError>;
  /**
   * Creates an API key that contains a set of token domains. API keys are required for the integration of the CAPTCHA API in your JavaScript client applications. The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users. For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the WAF Developer Guide. You can use a single key for up to 5 domains. After you generate a key, you can copy it for use in your JavaScript integration. 
   */
  createAPIKey(params: WAFV2.Types.CreateAPIKeyRequest, callback?: (err: AWSError, data: WAFV2.Types.CreateAPIKeyResponse) => void): Request<WAFV2.Types.CreateAPIKeyResponse, AWSError>;
  /**
   * Creates an API key that contains a set of token domains. API keys are required for the integration of the CAPTCHA API in your JavaScript client applications. The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users. For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the WAF Developer Guide. You can use a single key for up to 5 domains. After you generate a key, you can copy it for use in your JavaScript integration. 
   */
  createAPIKey(callback?: (err: AWSError, data: WAFV2.Types.CreateAPIKeyResponse) => void): Request<WAFV2.Types.CreateAPIKeyResponse, AWSError>;
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
   * Creates a WebACL per the specifications provided.  A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has a statement that defines what to look for in web requests and an action that WAF applies to requests that match the statement. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resources can be an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance. 
   */
  createWebACL(params: WAFV2.Types.CreateWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.CreateWebACLResponse) => void): Request<WAFV2.Types.CreateWebACLResponse, AWSError>;
  /**
   * Creates a WebACL per the specifications provided.  A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has a statement that defines what to look for in web requests and an action that WAF applies to requests that match the statement. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resources can be an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance. 
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
   * Deletes the specified WebACL.  You can only use this if ManagedByFirewallManager is false in the specified WebACL.   Before deleting any web ACL, first disassociate it from all resources.   To retrieve a list of the resources that are associated with a web ACL, use the following calls:   For regional resources, call ListResourcesForWebACL.   For Amazon CloudFront distributions, use the CloudFront call ListDistributionsByWebACLId. For information, see ListDistributionsByWebACLId in the Amazon CloudFront API Reference.      To disassociate a resource from a web ACL, use the following calls:   For regional resources, call DisassociateWebACL.   For Amazon CloudFront distributions, provide an empty web ACL ID in the CloudFront call UpdateDistribution. For information, see UpdateDistribution in the Amazon CloudFront API Reference.      
   */
  deleteWebACL(params: WAFV2.Types.DeleteWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.DeleteWebACLResponse) => void): Request<WAFV2.Types.DeleteWebACLResponse, AWSError>;
  /**
   * Deletes the specified WebACL.  You can only use this if ManagedByFirewallManager is false in the specified WebACL.   Before deleting any web ACL, first disassociate it from all resources.   To retrieve a list of the resources that are associated with a web ACL, use the following calls:   For regional resources, call ListResourcesForWebACL.   For Amazon CloudFront distributions, use the CloudFront call ListDistributionsByWebACLId. For information, see ListDistributionsByWebACLId in the Amazon CloudFront API Reference.      To disassociate a resource from a web ACL, use the following calls:   For regional resources, call DisassociateWebACL.   For Amazon CloudFront distributions, provide an empty web ACL ID in the CloudFront call UpdateDistribution. For information, see UpdateDistribution in the Amazon CloudFront API Reference.      
   */
  deleteWebACL(callback?: (err: AWSError, data: WAFV2.Types.DeleteWebACLResponse) => void): Request<WAFV2.Types.DeleteWebACLResponse, AWSError>;
  /**
   * Provides high-level information for the Amazon Web Services Managed Rules rule groups and Amazon Web Services Marketplace managed rule groups. 
   */
  describeAllManagedProducts(params: WAFV2.Types.DescribeAllManagedProductsRequest, callback?: (err: AWSError, data: WAFV2.Types.DescribeAllManagedProductsResponse) => void): Request<WAFV2.Types.DescribeAllManagedProductsResponse, AWSError>;
  /**
   * Provides high-level information for the Amazon Web Services Managed Rules rule groups and Amazon Web Services Marketplace managed rule groups. 
   */
  describeAllManagedProducts(callback?: (err: AWSError, data: WAFV2.Types.DescribeAllManagedProductsResponse) => void): Request<WAFV2.Types.DescribeAllManagedProductsResponse, AWSError>;
  /**
   * Provides high-level information for the managed rule groups owned by a specific vendor. 
   */
  describeManagedProductsByVendor(params: WAFV2.Types.DescribeManagedProductsByVendorRequest, callback?: (err: AWSError, data: WAFV2.Types.DescribeManagedProductsByVendorResponse) => void): Request<WAFV2.Types.DescribeManagedProductsByVendorResponse, AWSError>;
  /**
   * Provides high-level information for the managed rule groups owned by a specific vendor. 
   */
  describeManagedProductsByVendor(callback?: (err: AWSError, data: WAFV2.Types.DescribeManagedProductsByVendorResponse) => void): Request<WAFV2.Types.DescribeManagedProductsByVendorResponse, AWSError>;
  /**
   * Provides high-level information for a managed rule group, including descriptions of the rules. 
   */
  describeManagedRuleGroup(params: WAFV2.Types.DescribeManagedRuleGroupRequest, callback?: (err: AWSError, data: WAFV2.Types.DescribeManagedRuleGroupResponse) => void): Request<WAFV2.Types.DescribeManagedRuleGroupResponse, AWSError>;
  /**
   * Provides high-level information for a managed rule group, including descriptions of the rules. 
   */
  describeManagedRuleGroup(callback?: (err: AWSError, data: WAFV2.Types.DescribeManagedRuleGroupResponse) => void): Request<WAFV2.Types.DescribeManagedRuleGroupResponse, AWSError>;
  /**
   * Disassociates the specified regional application resource from any existing web ACL association. A resource can have at most one web ACL association. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  For Amazon CloudFront, don't use this call. Instead, use your CloudFront distribution configuration. To disassociate a web ACL, provide an empty web ACL ID in the CloudFront call UpdateDistribution. For information, see UpdateDistribution in the Amazon CloudFront API Reference. 
   */
  disassociateWebACL(params: WAFV2.Types.DisassociateWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.DisassociateWebACLResponse) => void): Request<WAFV2.Types.DisassociateWebACLResponse, AWSError>;
  /**
   * Disassociates the specified regional application resource from any existing web ACL association. A resource can have at most one web ACL association. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  For Amazon CloudFront, don't use this call. Instead, use your CloudFront distribution configuration. To disassociate a web ACL, provide an empty web ACL ID in the CloudFront call UpdateDistribution. For information, see UpdateDistribution in the Amazon CloudFront API Reference. 
   */
  disassociateWebACL(callback?: (err: AWSError, data: WAFV2.Types.DisassociateWebACLResponse) => void): Request<WAFV2.Types.DisassociateWebACLResponse, AWSError>;
  /**
   * Generates a presigned download URL for the specified release of the mobile SDK. The mobile SDK is not generally available. Customers who have access to the mobile SDK can use it to establish and manage WAF tokens for use in HTTP(S) requests from a mobile device to WAF. For more information, see WAF client application integration in the WAF Developer Guide.
   */
  generateMobileSdkReleaseUrl(params: WAFV2.Types.GenerateMobileSdkReleaseUrlRequest, callback?: (err: AWSError, data: WAFV2.Types.GenerateMobileSdkReleaseUrlResponse) => void): Request<WAFV2.Types.GenerateMobileSdkReleaseUrlResponse, AWSError>;
  /**
   * Generates a presigned download URL for the specified release of the mobile SDK. The mobile SDK is not generally available. Customers who have access to the mobile SDK can use it to establish and manage WAF tokens for use in HTTP(S) requests from a mobile device to WAF. For more information, see WAF client application integration in the WAF Developer Guide.
   */
  generateMobileSdkReleaseUrl(callback?: (err: AWSError, data: WAFV2.Types.GenerateMobileSdkReleaseUrlResponse) => void): Request<WAFV2.Types.GenerateMobileSdkReleaseUrlResponse, AWSError>;
  /**
   * Returns your API key in decrypted form. Use this to check the token domains that you have defined for the key.  API keys are required for the integration of the CAPTCHA API in your JavaScript client applications. The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users. For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the WAF Developer Guide.
   */
  getDecryptedAPIKey(params: WAFV2.Types.GetDecryptedAPIKeyRequest, callback?: (err: AWSError, data: WAFV2.Types.GetDecryptedAPIKeyResponse) => void): Request<WAFV2.Types.GetDecryptedAPIKeyResponse, AWSError>;
  /**
   * Returns your API key in decrypted form. Use this to check the token domains that you have defined for the key.  API keys are required for the integration of the CAPTCHA API in your JavaScript client applications. The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users. For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the WAF Developer Guide.
   */
  getDecryptedAPIKey(callback?: (err: AWSError, data: WAFV2.Types.GetDecryptedAPIKeyResponse) => void): Request<WAFV2.Types.GetDecryptedAPIKeyResponse, AWSError>;
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
   * Retrieves information for the specified mobile SDK release, including release notes and tags. The mobile SDK is not generally available. Customers who have access to the mobile SDK can use it to establish and manage WAF tokens for use in HTTP(S) requests from a mobile device to WAF. For more information, see WAF client application integration in the WAF Developer Guide.
   */
  getMobileSdkRelease(params: WAFV2.Types.GetMobileSdkReleaseRequest, callback?: (err: AWSError, data: WAFV2.Types.GetMobileSdkReleaseResponse) => void): Request<WAFV2.Types.GetMobileSdkReleaseResponse, AWSError>;
  /**
   * Retrieves information for the specified mobile SDK release, including release notes and tags. The mobile SDK is not generally available. Customers who have access to the mobile SDK can use it to establish and manage WAF tokens for use in HTTP(S) requests from a mobile device to WAF. For more information, see WAF client application integration in the WAF Developer Guide.
   */
  getMobileSdkRelease(callback?: (err: AWSError, data: WAFV2.Types.GetMobileSdkReleaseResponse) => void): Request<WAFV2.Types.GetMobileSdkReleaseResponse, AWSError>;
  /**
   * Returns the IAM policy that is attached to the specified rule group. You must be the owner of the rule group to perform this operation.
   */
  getPermissionPolicy(params: WAFV2.Types.GetPermissionPolicyRequest, callback?: (err: AWSError, data: WAFV2.Types.GetPermissionPolicyResponse) => void): Request<WAFV2.Types.GetPermissionPolicyResponse, AWSError>;
  /**
   * Returns the IAM policy that is attached to the specified rule group. You must be the owner of the rule group to perform this operation.
   */
  getPermissionPolicy(callback?: (err: AWSError, data: WAFV2.Types.GetPermissionPolicyResponse) => void): Request<WAFV2.Types.GetPermissionPolicyResponse, AWSError>;
  /**
   * Retrieves the IP addresses that are currently blocked by a rate-based rule instance. This is only available for rate-based rules that aggregate solely on the IP address or on the forwarded IP address.  The maximum number of addresses that can be blocked for a single rate-based rule instance is 10,000. If more than 10,000 addresses exceed the rate limit, those with the highest rates are blocked. For a rate-based rule that you've defined inside a rule group, provide the name of the rule group reference statement in your request, in addition to the rate-based rule name and the web ACL name.  WAF monitors web requests and manages keys independently for each unique combination of web ACL, optional rule group, and rate-based rule. For example, if you define a rate-based rule inside a rule group, and then use the rule group in a web ACL, WAF monitors web requests and manages keys for that web ACL, rule group reference statement, and rate-based rule instance. If you use the same rule group in a second web ACL, WAF monitors web requests and manages keys for this second usage completely independent of your first. 
   */
  getRateBasedStatementManagedKeys(params: WAFV2.Types.GetRateBasedStatementManagedKeysRequest, callback?: (err: AWSError, data: WAFV2.Types.GetRateBasedStatementManagedKeysResponse) => void): Request<WAFV2.Types.GetRateBasedStatementManagedKeysResponse, AWSError>;
  /**
   * Retrieves the IP addresses that are currently blocked by a rate-based rule instance. This is only available for rate-based rules that aggregate solely on the IP address or on the forwarded IP address.  The maximum number of addresses that can be blocked for a single rate-based rule instance is 10,000. If more than 10,000 addresses exceed the rate limit, those with the highest rates are blocked. For a rate-based rule that you've defined inside a rule group, provide the name of the rule group reference statement in your request, in addition to the rate-based rule name and the web ACL name.  WAF monitors web requests and manages keys independently for each unique combination of web ACL, optional rule group, and rate-based rule. For example, if you define a rate-based rule inside a rule group, and then use the rule group in a web ACL, WAF monitors web requests and manages keys for that web ACL, rule group reference statement, and rate-based rule instance. If you use the same rule group in a second web ACL, WAF monitors web requests and manages keys for this second usage completely independent of your first. 
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
   * Retrieves a list of the API keys that you've defined for the specified scope.  API keys are required for the integration of the CAPTCHA API in your JavaScript client applications. The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users. For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the WAF Developer Guide.
   */
  listAPIKeys(params: WAFV2.Types.ListAPIKeysRequest, callback?: (err: AWSError, data: WAFV2.Types.ListAPIKeysResponse) => void): Request<WAFV2.Types.ListAPIKeysResponse, AWSError>;
  /**
   * Retrieves a list of the API keys that you've defined for the specified scope.  API keys are required for the integration of the CAPTCHA API in your JavaScript client applications. The API lets you customize the placement and characteristics of the CAPTCHA puzzle for your end users. For more information about the CAPTCHA JavaScript integration, see WAF client application integration in the WAF Developer Guide.
   */
  listAPIKeys(callback?: (err: AWSError, data: WAFV2.Types.ListAPIKeysResponse) => void): Request<WAFV2.Types.ListAPIKeysResponse, AWSError>;
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
   * Retrieves a list of the available releases for the mobile SDK and the specified device platform.  The mobile SDK is not generally available. Customers who have access to the mobile SDK can use it to establish and manage WAF tokens for use in HTTP(S) requests from a mobile device to WAF. For more information, see WAF client application integration in the WAF Developer Guide.
   */
  listMobileSdkReleases(params: WAFV2.Types.ListMobileSdkReleasesRequest, callback?: (err: AWSError, data: WAFV2.Types.ListMobileSdkReleasesResponse) => void): Request<WAFV2.Types.ListMobileSdkReleasesResponse, AWSError>;
  /**
   * Retrieves a list of the available releases for the mobile SDK and the specified device platform.  The mobile SDK is not generally available. Customers who have access to the mobile SDK can use it to establish and manage WAF tokens for use in HTTP(S) requests from a mobile device to WAF. For more information, see WAF client application integration in the WAF Developer Guide.
   */
  listMobileSdkReleases(callback?: (err: AWSError, data: WAFV2.Types.ListMobileSdkReleasesResponse) => void): Request<WAFV2.Types.ListMobileSdkReleasesResponse, AWSError>;
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
   * Enables the specified LoggingConfiguration, to start logging from a web ACL, according to the configuration provided.   This operation completely replaces any mutable specifications that you already have for a logging configuration with the ones that you provide to this call.  To modify an existing logging configuration, do the following:    Retrieve it by calling GetLoggingConfiguration    Update its settings as needed   Provide the complete logging configuration specification to this call     You can define one logging destination per web ACL.  You can access information about the traffic that WAF inspects using the following steps:   Create your logging destination. You can use an Amazon CloudWatch Logs log group, an Amazon Simple Storage Service (Amazon S3) bucket, or an Amazon Kinesis Data Firehose.  The name that you give the destination must start with aws-waf-logs-. Depending on the type of destination, you might need to configure additional settings or permissions.  For configuration requirements and pricing information for each destination type, see Logging web ACL traffic in the WAF Developer Guide.   Associate your logging destination to your web ACL using a PutLoggingConfiguration request.   When you successfully enable logging using a PutLoggingConfiguration request, WAF creates an additional role or policy that is required to write logs to the logging destination. For an Amazon CloudWatch Logs log group, WAF creates a resource policy on the log group. For an Amazon S3 bucket, WAF creates a bucket policy. For an Amazon Kinesis Data Firehose, WAF creates a service-linked role. For additional information about web ACL logging, see Logging web ACL traffic information in the WAF Developer Guide.
   */
  putLoggingConfiguration(params: WAFV2.Types.PutLoggingConfigurationRequest, callback?: (err: AWSError, data: WAFV2.Types.PutLoggingConfigurationResponse) => void): Request<WAFV2.Types.PutLoggingConfigurationResponse, AWSError>;
  /**
   * Enables the specified LoggingConfiguration, to start logging from a web ACL, according to the configuration provided.   This operation completely replaces any mutable specifications that you already have for a logging configuration with the ones that you provide to this call.  To modify an existing logging configuration, do the following:    Retrieve it by calling GetLoggingConfiguration    Update its settings as needed   Provide the complete logging configuration specification to this call     You can define one logging destination per web ACL.  You can access information about the traffic that WAF inspects using the following steps:   Create your logging destination. You can use an Amazon CloudWatch Logs log group, an Amazon Simple Storage Service (Amazon S3) bucket, or an Amazon Kinesis Data Firehose.  The name that you give the destination must start with aws-waf-logs-. Depending on the type of destination, you might need to configure additional settings or permissions.  For configuration requirements and pricing information for each destination type, see Logging web ACL traffic in the WAF Developer Guide.   Associate your logging destination to your web ACL using a PutLoggingConfiguration request.   When you successfully enable logging using a PutLoggingConfiguration request, WAF creates an additional role or policy that is required to write logs to the logging destination. For an Amazon CloudWatch Logs log group, WAF creates a resource policy on the log group. For an Amazon S3 bucket, WAF creates a bucket policy. For an Amazon Kinesis Data Firehose, WAF creates a service-linked role. For additional information about web ACL logging, see Logging web ACL traffic information in the WAF Developer Guide.
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
   * Updates the specified IPSet.   This operation completely replaces the mutable specifications that you already have for the IP set with the ones that you provide to this call.  To modify an IP set, do the following:    Retrieve it by calling GetIPSet    Update its settings as needed   Provide the complete IP set specification to this call    When you make changes to web ACLs or web ACL components, like rules and rule groups, WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an Amazon Web Services resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.
   */
  updateIPSet(params: WAFV2.Types.UpdateIPSetRequest, callback?: (err: AWSError, data: WAFV2.Types.UpdateIPSetResponse) => void): Request<WAFV2.Types.UpdateIPSetResponse, AWSError>;
  /**
   * Updates the specified IPSet.   This operation completely replaces the mutable specifications that you already have for the IP set with the ones that you provide to this call.  To modify an IP set, do the following:    Retrieve it by calling GetIPSet    Update its settings as needed   Provide the complete IP set specification to this call    When you make changes to web ACLs or web ACL components, like rules and rule groups, WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an Amazon Web Services resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.
   */
  updateIPSet(callback?: (err: AWSError, data: WAFV2.Types.UpdateIPSetResponse) => void): Request<WAFV2.Types.UpdateIPSetResponse, AWSError>;
  /**
   * Updates the expiration information for your managed rule set. Use this to initiate the expiration of a managed rule group version. After you initiate expiration for a version, WAF excludes it from the response to ListAvailableManagedRuleGroupVersions for the managed rule group.   This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.  Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are ListManagedRuleSets, GetManagedRuleSet, PutManagedRuleSetVersions, and UpdateManagedRuleSetVersionExpiryDate. 
   */
  updateManagedRuleSetVersionExpiryDate(params: WAFV2.Types.UpdateManagedRuleSetVersionExpiryDateRequest, callback?: (err: AWSError, data: WAFV2.Types.UpdateManagedRuleSetVersionExpiryDateResponse) => void): Request<WAFV2.Types.UpdateManagedRuleSetVersionExpiryDateResponse, AWSError>;
  /**
   * Updates the expiration information for your managed rule set. Use this to initiate the expiration of a managed rule group version. After you initiate expiration for a version, WAF excludes it from the response to ListAvailableManagedRuleGroupVersions for the managed rule group.   This is intended for use only by vendors of managed rule sets. Vendors are Amazon Web Services and Amazon Web Services Marketplace sellers.  Vendors, you can use the managed rule set APIs to provide controlled rollout of your versioned managed rule group offerings for your customers. The APIs are ListManagedRuleSets, GetManagedRuleSet, PutManagedRuleSetVersions, and UpdateManagedRuleSetVersionExpiryDate. 
   */
  updateManagedRuleSetVersionExpiryDate(callback?: (err: AWSError, data: WAFV2.Types.UpdateManagedRuleSetVersionExpiryDateResponse) => void): Request<WAFV2.Types.UpdateManagedRuleSetVersionExpiryDateResponse, AWSError>;
  /**
   * Updates the specified RegexPatternSet.  This operation completely replaces the mutable specifications that you already have for the regex pattern set with the ones that you provide to this call.  To modify a regex pattern set, do the following:    Retrieve it by calling GetRegexPatternSet    Update its settings as needed   Provide the complete regex pattern set specification to this call    When you make changes to web ACLs or web ACL components, like rules and rule groups, WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an Amazon Web Services resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.
   */
  updateRegexPatternSet(params: WAFV2.Types.UpdateRegexPatternSetRequest, callback?: (err: AWSError, data: WAFV2.Types.UpdateRegexPatternSetResponse) => void): Request<WAFV2.Types.UpdateRegexPatternSetResponse, AWSError>;
  /**
   * Updates the specified RegexPatternSet.  This operation completely replaces the mutable specifications that you already have for the regex pattern set with the ones that you provide to this call.  To modify a regex pattern set, do the following:    Retrieve it by calling GetRegexPatternSet    Update its settings as needed   Provide the complete regex pattern set specification to this call    When you make changes to web ACLs or web ACL components, like rules and rule groups, WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an Amazon Web Services resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.
   */
  updateRegexPatternSet(callback?: (err: AWSError, data: WAFV2.Types.UpdateRegexPatternSetResponse) => void): Request<WAFV2.Types.UpdateRegexPatternSetResponse, AWSError>;
  /**
   * Updates the specified RuleGroup.  This operation completely replaces the mutable specifications that you already have for the rule group with the ones that you provide to this call.  To modify a rule group, do the following:    Retrieve it by calling GetRuleGroup    Update its settings as needed   Provide the complete rule group specification to this call    When you make changes to web ACLs or web ACL components, like rules and rule groups, WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an Amazon Web Services resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.  A rule group defines a collection of rules to inspect and control web requests that you can use in a WebACL. When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements. 
   */
  updateRuleGroup(params: WAFV2.Types.UpdateRuleGroupRequest, callback?: (err: AWSError, data: WAFV2.Types.UpdateRuleGroupResponse) => void): Request<WAFV2.Types.UpdateRuleGroupResponse, AWSError>;
  /**
   * Updates the specified RuleGroup.  This operation completely replaces the mutable specifications that you already have for the rule group with the ones that you provide to this call.  To modify a rule group, do the following:    Retrieve it by calling GetRuleGroup    Update its settings as needed   Provide the complete rule group specification to this call    When you make changes to web ACLs or web ACL components, like rules and rule groups, WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an Amazon Web Services resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.  A rule group defines a collection of rules to inspect and control web requests that you can use in a WebACL. When you create a rule group, you define an immutable capacity limit. If you update a rule group, you must stay within the capacity. This allows others to reuse the rule group with confidence in its capacity requirements. 
   */
  updateRuleGroup(callback?: (err: AWSError, data: WAFV2.Types.UpdateRuleGroupResponse) => void): Request<WAFV2.Types.UpdateRuleGroupResponse, AWSError>;
  /**
   * Updates the specified WebACL. While updating a web ACL, WAF provides continuous coverage to the resources that you have associated with the web ACL.   This operation completely replaces the mutable specifications that you already have for the web ACL with the ones that you provide to this call.  To modify a web ACL, do the following:    Retrieve it by calling GetWebACL    Update its settings as needed   Provide the complete web ACL specification to this call    When you make changes to web ACLs or web ACL components, like rules and rule groups, WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an Amazon Web Services resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.  A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has a statement that defines what to look for in web requests and an action that WAF applies to requests that match the statement. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resources can be an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance. 
   */
  updateWebACL(params: WAFV2.Types.UpdateWebACLRequest, callback?: (err: AWSError, data: WAFV2.Types.UpdateWebACLResponse) => void): Request<WAFV2.Types.UpdateWebACLResponse, AWSError>;
  /**
   * Updates the specified WebACL. While updating a web ACL, WAF provides continuous coverage to the resources that you have associated with the web ACL.   This operation completely replaces the mutable specifications that you already have for the web ACL with the ones that you provide to this call.  To modify a web ACL, do the following:    Retrieve it by calling GetWebACL    Update its settings as needed   Provide the complete web ACL specification to this call    When you make changes to web ACLs or web ACL components, like rules and rule groups, WAF propagates the changes everywhere that the web ACL and its components are stored and used. Your changes are applied within seconds, but there might be a brief period of inconsistency when the changes have arrived in some places and not in others. So, for example, if you change a rule action setting, the action might be the old action in one area and the new action in another area. Or if you add an IP address to an IP set used in a blocking rule, the new address might briefly be blocked in one area while still allowed in another. This temporary inconsistency can occur when you first associate a web ACL with an Amazon Web Services resource and when you change a web ACL that is already associated with a resource. Generally, any inconsistencies of this type last only a few seconds.  A web ACL defines a collection of rules to use to inspect and control web requests. Each rule has a statement that defines what to look for in web requests and an action that WAF applies to requests that match the statement. In the web ACL, you assign a default action to take (allow, block) for any request that does not match any of the rules. The rules in a web ACL can be a combination of the types Rule, RuleGroup, and managed rule group. You can associate a web ACL with one or more Amazon Web Services resources to protect. The resources can be an Amazon CloudFront distribution, an Amazon API Gateway REST API, an Application Load Balancer, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance. 
   */
  updateWebACL(callback?: (err: AWSError, data: WAFV2.Types.UpdateWebACLResponse) => void): Request<WAFV2.Types.UpdateWebACLResponse, AWSError>;
}
declare namespace WAFV2 {
  export type APIKey = string;
  export type APIKeySummaries = APIKeySummary[];
  export interface APIKeySummary {
    /**
     * The token domains that are defined in this API key. 
     */
    TokenDomains?: TokenDomains;
    /**
     * The generated, encrypted API key. You can copy this for use in your JavaScript CAPTCHA integration. 
     */
    APIKey?: APIKey;
    /**
     * The date and time that the key was created. 
     */
    CreationTimestamp?: Timestamp;
    /**
     * Internal value used by WAF to manage the key. 
     */
    Version?: APIKeyVersion;
  }
  export type APIKeyTokenDomains = TokenDomain[];
  export type APIKeyVersion = number;
  export interface AWSManagedRulesACFPRuleSet {
    /**
     * The path of the account creation endpoint for your application. This is the page on your website that accepts the completed registration form for a new user. This page must accept POST requests. For example, for the URL https://example.com/web/newaccount, you would provide the path /web/newaccount. Account creation page paths that start with the path that you provide are considered a match. For example /web/newaccount matches the account creation paths /web/newaccount, /web/newaccount/, /web/newaccountPage, and /web/newaccount/thisPage, but doesn't match the path /home/web/newaccount or /website/newaccount. 
     */
    CreationPath: CreationPathString;
    /**
     * The path of the account registration endpoint for your application. This is the page on your website that presents the registration form to new users.   This page must accept GET text/html requests.  For example, for the URL https://example.com/web/registration, you would provide the path /web/registration. Registration page paths that start with the path that you provide are considered a match. For example /web/registration matches the registration paths /web/registration, /web/registration/, /web/registrationPage, and /web/registration/thisPage, but doesn't match the path /home/web/registration or /website/registration. 
     */
    RegistrationPagePath: RegistrationPagePathString;
    /**
     * The criteria for inspecting account creation requests, used by the ACFP rule group to validate and track account creation attempts. 
     */
    RequestInspection: RequestInspectionACFP;
    /**
     * The criteria for inspecting responses to account creation requests, used by the ACFP rule group to track account creation success rates.   Response inspection is available only in web ACLs that protect Amazon CloudFront distributions.  The ACFP rule group evaluates the responses that your protected resources send back to client account creation attempts, keeping count of successful and failed attempts from each IP address and client session. Using this information, the rule group labels and mitigates requests from client sessions and IP addresses that have had too many successful account creation attempts in a short amount of time. 
     */
    ResponseInspection?: ResponseInspection;
    /**
     * Allow the use of regular expressions in the registration page path and the account creation path. 
     */
    EnableRegexInPath?: Boolean;
  }
  export interface AWSManagedRulesATPRuleSet {
    /**
     * The path of the login endpoint for your application. For example, for the URL https://example.com/web/login, you would provide the path /web/login. Login paths that start with the path that you provide are considered a match. For example /web/login matches the login paths /web/login, /web/login/, /web/loginPage, and /web/login/thisPage, but doesn't match the login path /home/web/login or /website/login. The rule group inspects only HTTP POST requests to your specified login endpoint.
     */
    LoginPath: String;
    /**
     * The criteria for inspecting login requests, used by the ATP rule group to validate credentials usage. 
     */
    RequestInspection?: RequestInspection;
    /**
     * The criteria for inspecting responses to login requests, used by the ATP rule group to track login failure rates.   Response inspection is available only in web ACLs that protect Amazon CloudFront distributions.  The ATP rule group evaluates the responses that your protected resources send back to client login attempts, keeping count of successful and failed attempts for each IP address and client session. Using this information, the rule group labels and mitigates requests from client sessions and IP addresses that have had too many failed login attempts in a short amount of time. 
     */
    ResponseInspection?: ResponseInspection;
    /**
     * Allow the use of regular expressions in the login page path. 
     */
    EnableRegexInPath?: Boolean;
  }
  export interface AWSManagedRulesBotControlRuleSet {
    /**
     * The inspection level to use for the Bot Control rule group. The common level is the least expensive. The targeted level includes all common level rules and adds rules with more advanced inspection criteria. For details, see WAF Bot Control rule group in the WAF Developer Guide.
     */
    InspectionLevel: InspectionLevel;
    /**
     * Applies only to the targeted inspection level.  Determines whether to use machine learning (ML) to analyze your web traffic for bot-related activity. Machine learning is required for the Bot Control rules TGT_ML_CoordinatedActivityLow and TGT_ML_CoordinatedActivityMedium, which inspect for anomalous behavior that might indicate distributed, coordinated bot activity. For more information about this choice, see the listing for these rules in the table at Bot Control rules listing in the WAF Developer Guide. Default: TRUE 
     */
    EnableMachineLearning?: Boolean;
  }
  export type Action = string;
  export interface ActionCondition {
    /**
     * The action setting that a log record must contain in order to meet the condition. This is the action that WAF applied to the web request.  For rule groups, this is either the configured rule action setting, or if you've applied a rule action override to the rule, it's the override action. The value EXCLUDED_AS_COUNT matches on excluded rules and also on rules that have a rule action override of Count. 
     */
    Action: ActionValue;
  }
  export type ActionValue = "ALLOW"|"BLOCK"|"COUNT"|"CAPTCHA"|"CHALLENGE"|"EXCLUDED_AS_COUNT"|string;
  export interface AddressField {
    /**
     * The name of a single primary address field.  How you specify the address fields depends on the request inspection payload type.   For JSON payloads, specify the field identifiers in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "primaryaddressline1": "THE_ADDRESS1", "primaryaddressline2": "THE_ADDRESS2", "primaryaddressline3": "THE_ADDRESS3" } }, the address field idenfiers are /form/primaryaddressline1, /form/primaryaddressline2, and /form/primaryaddressline3.   For form encoded payload types, use the HTML form names. For example, for an HTML form with input elements named primaryaddressline1, primaryaddressline2, and primaryaddressline3, the address fields identifiers are primaryaddressline1, primaryaddressline2, and primaryaddressline3.   
     */
    Identifier: FieldIdentifier;
  }
  export type AddressFields = AddressField[];
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
     * The Amazon Resource Name (ARN) of the resource to associate with the web ACL.  The ARN must be in one of the following formats:   For an Application Load Balancer: arn:partition:elasticloadbalancing:region:account-id:loadbalancer/app/load-balancer-name/load-balancer-id     For an Amazon API Gateway REST API: arn:partition:apigateway:region::/restapis/api-id/stages/stage-name     For an AppSync GraphQL API: arn:partition:appsync:region:account-id:apis/GraphQLApiId     For an Amazon Cognito user pool: arn:partition:cognito-idp:region:account-id:userpool/user-pool-id     For an App Runner service: arn:partition:apprunner:region:account-id:service/apprunner-service-name/apprunner-service-id     For an Amazon Web Services Verified Access instance: arn:partition:ec2:region:account-id:verified-access-instance/instance-id    
     */
    ResourceArn: ResourceArn;
  }
  export interface AssociateWebACLResponse {
  }
  export type AssociatedResourceType = "CLOUDFRONT"|string;
  export interface AssociationConfig {
    /**
     * Customizes the maximum size of the request body that your protected CloudFront distributions forward to WAF for inspection. The default size is 16 KB (16,384 bytes).   You are charged additional fees when your protected resources forward body sizes that are larger than the default. For more information, see WAF Pricing. 
     */
    RequestBody?: RequestBody;
  }
  export interface BlockAction {
    /**
     * Defines a custom response for the web request. For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide. 
     */
    CustomResponse?: CustomResponse;
  }
  export interface Body {
    /**
     * What WAF should do if the body is larger than WAF can inspect. WAF does not support inspecting the entire contents of the web request body if the body exceeds the limit for the resource type. If the body is larger than the limit, the underlying host service only forwards the contents that are below the limit to WAF for inspection.  The default limit is 8 KB (8,192 bytes) for regional resources and 16 KB (16,384 bytes) for CloudFront distributions. For CloudFront distributions, you can increase the limit in the web ACL AssociationConfig, for additional processing fees.  The options for oversize handling are the following:    CONTINUE - Inspect the available body contents normally, according to the rule inspection criteria.     MATCH - Treat the web request as matching the rule statement. WAF applies the rule action to the request.    NO_MATCH - Treat the web request as not matching the rule statement.   You can combine the MATCH or NO_MATCH settings for oversize handling with your rule and web ACL action settings, so that you block any request whose body is over the limit.  Default: CONTINUE 
     */
    OversizeHandling?: OversizeHandling;
  }
  export type BodyParsingFallbackBehavior = "MATCH"|"NO_MATCH"|"EVALUATE_AS_STRING"|string;
  export type Boolean = boolean;
  export interface ByteMatchStatement {
    /**
     * A string value that you want WAF to search for. WAF searches only in the part of web requests that you designate for inspection in FieldToMatch. The maximum length of the value is 200 bytes. Valid values depend on the component that you specify for inspection in FieldToMatch:    Method: The HTTP method that you want WAF to search for. This indicates the type of operation specified in the request.     UriPath: The value that you want WAF to search for in the URI path, for example, /images/daily-ad.jpg.     JA3Fingerprint: Match against the request's JA3 fingerprint. The JA3 fingerprint is a 32-character hash derived from the TLS Client Hello of an incoming request. This fingerprint serves as a unique identifier for the client's TLS configuration. You can use this choice only with a string match ByteMatchStatement with the PositionalConstraint set to EXACTLY.  You can obtain the JA3 fingerprint for client requests from the web ACL logs. If WAF is able to calculate the fingerprint, it includes it in the logs. For information about the logging fields, see Log fields in the WAF Developer Guide.     HeaderOrder: The comma-separated list of header names to match for. WAF creates a string that contains the ordered list of header names, from the headers in the web request, and then matches against that string.    If SearchString includes alphabetic characters A-Z and a-z, note that the value is case sensitive.  If you're using the WAF API  Specify a base64-encoded version of the value. The maximum length of the value before you base64-encode it is 200 bytes. For example, suppose the value of Type is HEADER and the value of Data is User-Agent. If you want to search the User-Agent header for the value BadBot, you base64-encode BadBot using MIME base64-encoding and include the resulting value, QmFkQm90, in the value of SearchString.  If you're using the CLI or one of the Amazon Web Services SDKs  The value that you want WAF to search for. The SDK automatically base64 encodes the value.
     */
    SearchString: SearchString;
    /**
     * The part of the web request that you want WAF to inspect. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
     */
    TextTransformations: TextTransformations;
    /**
     * The area within the portion of the web request that you want WAF to search for SearchString. Valid values include the following:  CONTAINS  The specified part of the web request must include the value of SearchString, but the location doesn't matter.  CONTAINS_WORD  The specified part of the web request must include the value of SearchString, and SearchString must contain only alphanumeric characters or underscore (A-Z, a-z, 0-9, or _). In addition, SearchString must be a word, which means that both of the following are true:    SearchString is at the beginning of the specified part of the web request or is preceded by a character other than an alphanumeric character or underscore (_). Examples include the value of a header and ;BadBot.    SearchString is at the end of the specified part of the web request or is followed by a character other than an alphanumeric character or underscore (_), for example, BadBot; and -BadBot;.    EXACTLY  The value of the specified part of the web request must exactly match the value of SearchString.  STARTS_WITH  The value of SearchString must appear at the beginning of the specified part of the web request.  ENDS_WITH  The value of SearchString must appear at the end of the specified part of the web request.
     */
    PositionalConstraint: PositionalConstraint;
  }
  export type CapacityUnit = number;
  export interface CaptchaAction {
    /**
     * Defines custom handling for the web request, used when the CAPTCHA inspection determines that the request's token is valid and unexpired. For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide. 
     */
    CustomRequestHandling?: CustomRequestHandling;
  }
  export interface CaptchaConfig {
    /**
     * Determines how long a CAPTCHA timestamp in the token remains valid after the client successfully solves a CAPTCHA puzzle. 
     */
    ImmunityTimeProperty?: ImmunityTimeProperty;
  }
  export interface CaptchaResponse {
    /**
     * The HTTP response code indicating the status of the CAPTCHA token in the web request. If the token is missing, invalid, or expired, this code is 405 Method Not Allowed.
     */
    ResponseCode?: ResponseCode;
    /**
     * The time that the CAPTCHA was last solved for the supplied token. 
     */
    SolveTimestamp?: SolveTimestamp;
    /**
     * The reason for failure, populated when the evaluation of the token fails.
     */
    FailureReason?: FailureReason;
  }
  export interface ChallengeAction {
    /**
     * Defines custom handling for the web request, used when the challenge inspection determines that the request's token is valid and unexpired. For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide. 
     */
    CustomRequestHandling?: CustomRequestHandling;
  }
  export interface ChallengeConfig {
    /**
     * Determines how long a challenge timestamp in the token remains valid after the client successfully responds to a challenge. 
     */
    ImmunityTimeProperty?: ImmunityTimeProperty;
  }
  export interface ChallengeResponse {
    /**
     * The HTTP response code indicating the status of the challenge token in the web request. If the token is missing, invalid, or expired, this code is 202 Request Accepted.
     */
    ResponseCode?: ResponseCode;
    /**
     * The time that the challenge was last solved for the supplied token. 
     */
    SolveTimestamp?: SolveTimestamp;
    /**
     * The reason for failure, populated when the evaluation of the token fails.
     */
    FailureReason?: FailureReason;
  }
  export interface CheckCapacityRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * A single action condition. This is the action setting that a log record must contain in order to meet the condition.
     */
    ActionCondition?: ActionCondition;
    /**
     * A single label name condition. This is the fully qualified label name that a log record must contain in order to meet the condition. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. 
     */
    LabelNameCondition?: LabelNameCondition;
  }
  export type Conditions = Condition[];
  export type ConsumedCapacity = number;
  export interface CookieMatchPattern {
    /**
     * Inspect all cookies. 
     */
    All?: All;
    /**
     * Inspect only the cookies that have a key that matches one of the strings specified here. 
     */
    IncludedCookies?: CookieNames;
    /**
     * Inspect only the cookies whose keys don't match any of the strings specified here. 
     */
    ExcludedCookies?: CookieNames;
  }
  export type CookieNames = SingleCookieName[];
  export interface Cookies {
    /**
     * The filter to use to identify the subset of cookies to inspect in a web request.  You must specify exactly one setting: either All, IncludedCookies, or ExcludedCookies. Example JSON: "MatchPattern": { "IncludedCookies": [ "session-id-time", "session-id" ] } 
     */
    MatchPattern: CookieMatchPattern;
    /**
     * The parts of the cookies to inspect with the rule inspection criteria. If you specify All, WAF inspects both keys and values. 
     */
    MatchScope: MapMatchScope;
    /**
     * What WAF should do if the cookies of the request are more numerous or larger than WAF can inspect. WAF does not support inspecting the entire contents of request cookies when they exceed 8 KB (8192 bytes) or 200 total cookies. The underlying host service forwards a maximum of 200 cookies and at most 8 KB of cookie contents to WAF.  The options for oversize handling are the following:    CONTINUE - Inspect the available cookies normally, according to the rule inspection criteria.     MATCH - Treat the web request as matching the rule statement. WAF applies the rule action to the request.    NO_MATCH - Treat the web request as not matching the rule statement.  
     */
    OversizeHandling: OversizeHandling;
  }
  export interface CountAction {
    /**
     * Defines custom handling for the web request. For information about customizing web requests and responses, see Customizing web requests and responses in WAF in the WAF Developer Guide. 
     */
    CustomRequestHandling?: CustomRequestHandling;
  }
  export type Country = string;
  export type CountryCode = "AF"|"AX"|"AL"|"DZ"|"AS"|"AD"|"AO"|"AI"|"AQ"|"AG"|"AR"|"AM"|"AW"|"AU"|"AT"|"AZ"|"BS"|"BH"|"BD"|"BB"|"BY"|"BE"|"BZ"|"BJ"|"BM"|"BT"|"BO"|"BQ"|"BA"|"BW"|"BV"|"BR"|"IO"|"BN"|"BG"|"BF"|"BI"|"KH"|"CM"|"CA"|"CV"|"KY"|"CF"|"TD"|"CL"|"CN"|"CX"|"CC"|"CO"|"KM"|"CG"|"CD"|"CK"|"CR"|"CI"|"HR"|"CU"|"CW"|"CY"|"CZ"|"DK"|"DJ"|"DM"|"DO"|"EC"|"EG"|"SV"|"GQ"|"ER"|"EE"|"ET"|"FK"|"FO"|"FJ"|"FI"|"FR"|"GF"|"PF"|"TF"|"GA"|"GM"|"GE"|"DE"|"GH"|"GI"|"GR"|"GL"|"GD"|"GP"|"GU"|"GT"|"GG"|"GN"|"GW"|"GY"|"HT"|"HM"|"VA"|"HN"|"HK"|"HU"|"IS"|"IN"|"ID"|"IR"|"IQ"|"IE"|"IM"|"IL"|"IT"|"JM"|"JP"|"JE"|"JO"|"KZ"|"KE"|"KI"|"KP"|"KR"|"KW"|"KG"|"LA"|"LV"|"LB"|"LS"|"LR"|"LY"|"LI"|"LT"|"LU"|"MO"|"MK"|"MG"|"MW"|"MY"|"MV"|"ML"|"MT"|"MH"|"MQ"|"MR"|"MU"|"YT"|"MX"|"FM"|"MD"|"MC"|"MN"|"ME"|"MS"|"MA"|"MZ"|"MM"|"NA"|"NR"|"NP"|"NL"|"NC"|"NZ"|"NI"|"NE"|"NG"|"NU"|"NF"|"MP"|"NO"|"OM"|"PK"|"PW"|"PS"|"PA"|"PG"|"PY"|"PE"|"PH"|"PN"|"PL"|"PT"|"PR"|"QA"|"RE"|"RO"|"RU"|"RW"|"BL"|"SH"|"KN"|"LC"|"MF"|"PM"|"VC"|"WS"|"SM"|"ST"|"SA"|"SN"|"RS"|"SC"|"SL"|"SG"|"SX"|"SK"|"SI"|"SB"|"SO"|"ZA"|"GS"|"SS"|"ES"|"LK"|"SD"|"SR"|"SJ"|"SZ"|"SE"|"CH"|"SY"|"TW"|"TJ"|"TZ"|"TH"|"TL"|"TG"|"TK"|"TO"|"TT"|"TN"|"TR"|"TM"|"TC"|"TV"|"UG"|"UA"|"AE"|"GB"|"US"|"UM"|"UY"|"UZ"|"VU"|"VE"|"VN"|"VG"|"VI"|"WF"|"EH"|"YE"|"ZM"|"ZW"|"XK"|string;
  export type CountryCodes = CountryCode[];
  export interface CreateAPIKeyRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The client application domains that you want to use this API key for.  Example JSON: "TokenDomains": ["abc.com", "store.abc.com"]  Public suffixes aren't allowed. For example, you can't use usa.gov or co.uk as token domains.
     */
    TokenDomains: APIKeyTokenDomains;
  }
  export interface CreateAPIKeyResponse {
    /**
     * The generated, encrypted API key. You can copy this for use in your JavaScript CAPTCHA integration. 
     */
    APIKey?: APIKey;
  }
  export interface CreateIPSetRequest {
    /**
     * The name of the IP set. You cannot change the name of an IPSet after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Contains an array of strings that specifies zero or more IP addresses or blocks of IP addresses that you want WAF to inspect for in incoming requests. All addresses must be specified using Classless Inter-Domain Routing (CIDR) notation. WAF supports all IPv4 and IPv6 CIDR ranges except for /0.  Example address strings:    For requests that originated from the IP address 192.0.2.44, specify 192.0.2.44/32.   For requests that originated from IP addresses from 192.0.2.0 to 192.0.2.255, specify 192.0.2.0/24.   For requests that originated from the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify 1111:0000:0000:0000:0000:0000:0000:0111/128.   For requests that originated from IP addresses 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify 1111:0000:0000:0000:0000:0000:0000:0000/64.   For more information about CIDR notation, see the Wikipedia entry Classless Inter-Domain Routing. Example JSON Addresses specifications:    Empty array: "Addresses": []    Array with one address: "Addresses": ["192.0.2.44/32"]    Array with three addresses: "Addresses": ["192.0.2.44/32", "192.0.2.0/24", "192.0.0.0/16"]    INVALID specification: "Addresses": [""] INVALID   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The web ACL capacity units (WCUs) required for this rule group. When you create your own rule group, you define this, and you cannot change it after creation. When you add or modify the rules in a rule group, WAF enforces this limit. You can check the capacity for a set of rules using CheckCapacity. WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. For more information, see WAF web ACL capacity units (WCU) in the WAF Developer Guide. 
     */
    Capacity: CapacityUnit;
    /**
     * A description of the rule group that helps with identification. 
     */
    Description?: EntityDescription;
    /**
     * The Rule statements used to identify the web requests that you want to manage. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * The Rule statements used to identify the web requests that you want to manage. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
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
    /**
     * Specifies how WAF should handle CAPTCHA evaluations for rules that don't have their own CaptchaConfig settings. If you don't specify this, WAF uses its default settings for CaptchaConfig. 
     */
    CaptchaConfig?: CaptchaConfig;
    /**
     * Specifies how WAF should handle challenge evaluations for rules that don't have their own ChallengeConfig settings. If you don't specify this, WAF uses its default settings for ChallengeConfig. 
     */
    ChallengeConfig?: ChallengeConfig;
    /**
     * Specifies the domains that WAF should accept in a web request token. This enables the use of tokens across multiple protected websites. When WAF provides a token, it uses the domain of the Amazon Web Services resource that the web ACL is protecting. If you don't specify a list of token domains, WAF accepts tokens only for the domain of the protected resource. With a token domain list, WAF accepts the resource's host domain plus all domains in the token domain list, including their prefixed subdomains. Example JSON: "TokenDomains": { "mywebsite.com", "myotherwebsite.com" }  Public suffixes aren't allowed. For example, you can't use usa.gov or co.uk as token domains.
     */
    TokenDomains?: TokenDomains;
    /**
     * Specifies custom configurations for the associations between the web ACL and protected resources.  Use this to customize the maximum size of the request body that your protected CloudFront distributions forward to WAF for inspection. The default is 16 KB (16,384 bytes).   You are charged additional fees when your protected resources forward body sizes that are larger than the default. For more information, see WAF Pricing. 
     */
    AssociationConfig?: AssociationConfig;
  }
  export interface CreateWebACLResponse {
    /**
     * High-level information about a WebACL, returned by operations like create and list. This provides information like the ID, that you can use to retrieve and manage a WebACL, and the ARN, that you provide to operations like AssociateWebACL.
     */
    Summary?: WebACLSummary;
  }
  export type CreationPathString = string;
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
     * The HTTP status code to return to the client.  For a list of status codes that you can use in your custom responses, see Supported status codes for custom response in the WAF Developer Guide. 
     */
    ResponseCode: ResponseStatusCode;
    /**
     * References the response body that you want WAF to return to the web request client. You can define a custom response for a rule action or a default web ACL action that is set to block. To do this, you first define the response body key and value in the CustomResponseBodies setting for the WebACL or RuleGroup where you want to use it. Then, in the rule action or web ACL default action BlockAction setting, you reference the response body using this key. 
     */
    CustomResponseBodyKey?: EntityName;
    /**
     * The HTTP headers to use in the response. You can specify any header name except for content-type. Duplicate header names are not allowed. For information about the limits on count and size for custom request and response settings, see WAF quotas in the WAF Developer Guide. 
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
  export interface DescribeAllManagedProductsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
  }
  export interface DescribeAllManagedProductsResponse {
    /**
     * High-level information for the Amazon Web Services Managed Rules rule groups and Amazon Web Services Marketplace managed rule groups. 
     */
    ManagedProducts?: ManagedProductDescriptors;
  }
  export interface DescribeManagedProductsByVendorRequest {
    /**
     * The name of the managed rule group vendor. You use this, along with the rule group name, to identify a rule group.
     */
    VendorName: VendorName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
  }
  export interface DescribeManagedProductsByVendorResponse {
    /**
     * High-level information for the managed rule groups owned by the specified vendor. 
     */
    ManagedProducts?: ManagedProductDescriptors;
  }
  export interface DescribeManagedRuleGroupRequest {
    /**
     * The name of the managed rule group vendor. You use this, along with the rule group name, to identify a rule group.
     */
    VendorName: VendorName;
    /**
     * The name of the managed rule group. You use this, along with the vendor name, to identify the rule group.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * The Amazon resource name (ARN) of the Amazon Simple Notification Service SNS topic that's used to provide notification of changes to the managed rule group. You can subscribe to the SNS topic to receive notifications when the managed rule group is modified, such as for new versions and for version expiration. For more information, see the Amazon Simple Notification Service Developer Guide.
     */
    SnsTopicArn?: ResourceArn;
    /**
     * The web ACL capacity units (WCUs) required for this rule group. WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. For more information, see WAF web ACL capacity units (WCU) in the WAF Developer Guide. 
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
     * The Amazon Resource Name (ARN) of the resource to disassociate from the web ACL.  The ARN must be in one of the following formats:   For an Application Load Balancer: arn:partition:elasticloadbalancing:region:account-id:loadbalancer/app/load-balancer-name/load-balancer-id     For an Amazon API Gateway REST API: arn:partition:apigateway:region::/restapis/api-id/stages/stage-name     For an AppSync GraphQL API: arn:partition:appsync:region:account-id:apis/GraphQLApiId     For an Amazon Cognito user pool: arn:partition:cognito-idp:region:account-id:userpool/user-pool-id     For an App Runner service: arn:partition:apprunner:region:account-id:service/apprunner-service-name/apprunner-service-id     For an Amazon Web Services Verified Access instance: arn:partition:ec2:region:account-id:verified-access-instance/instance-id    
     */
    ResourceArn: ResourceArn;
  }
  export interface DisassociateWebACLResponse {
  }
  export type DownloadUrl = string;
  export interface EmailField {
    /**
     * The name of the email field.  How you specify this depends on the request inspection payload type.   For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "email": "THE_EMAIL" } }, the email field specification is /form/email.   For form encoded payload types, use the HTML form names. For example, for an HTML form with the input element named email1, the email field specification is email1.  
     */
    Identifier: FieldIdentifier;
  }
  export type EntityDescription = string;
  export type EntityId = string;
  export type EntityName = string;
  export interface ExcludedRule {
    /**
     * The name of the rule whose action you want to override to Count.
     */
    Name: EntityName;
  }
  export type ExcludedRules = ExcludedRule[];
  export type FailureCode = number;
  export type FailureReason = "TOKEN_MISSING"|"TOKEN_EXPIRED"|"TOKEN_INVALID"|"TOKEN_DOMAIN_MISMATCH"|string;
  export type FailureValue = string;
  export type FallbackBehavior = "MATCH"|"NO_MATCH"|string;
  export type FieldIdentifier = string;
  export interface FieldToMatch {
    /**
     * Inspect a single header. Provide the name of the header to inspect, for example, User-Agent or Referer. This setting isn't case sensitive. Example JSON: "SingleHeader": { "Name": "haystack" }  Alternately, you can filter and inspect all headers with the Headers FieldToMatch setting. 
     */
    SingleHeader?: SingleHeader;
    /**
     * Inspect a single query argument. Provide the name of the query argument to inspect, such as UserName or SalesRegion. The name can be up to 30 characters long and isn't case sensitive.  Example JSON: "SingleQueryArgument": { "Name": "myArgument" } 
     */
    SingleQueryArgument?: SingleQueryArgument;
    /**
     * Inspect all query arguments. 
     */
    AllQueryArguments?: AllQueryArguments;
    /**
     * Inspect the request URI path. This is the part of the web request that identifies a resource, for example, /images/daily-ad.jpg.
     */
    UriPath?: UriPath;
    /**
     * Inspect the query string. This is the part of a URL that appears after a ? character, if any.
     */
    QueryString?: QueryString;
    /**
     * Inspect the request body as plain text. The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.  A limited amount of the request body is forwarded to WAF for inspection by the underlying host service. For regional resources, the limit is 8 KB (8,192 bytes) and for CloudFront distributions, the limit is 16 KB (16,384 bytes). For CloudFront distributions, you can increase the limit in the web ACL's AssociationConfig, for additional processing fees.  For information about how to handle oversized request bodies, see the Body object configuration. 
     */
    Body?: Body;
    /**
     * Inspect the HTTP method. The method indicates the type of operation that the request is asking the origin to perform. 
     */
    Method?: Method;
    /**
     * Inspect the request body as JSON. The request body immediately follows the request headers. This is the part of a request that contains any additional data that you want to send to your web server as the HTTP request body, such as data from a form.  A limited amount of the request body is forwarded to WAF for inspection by the underlying host service. For regional resources, the limit is 8 KB (8,192 bytes) and for CloudFront distributions, the limit is 16 KB (16,384 bytes). For CloudFront distributions, you can increase the limit in the web ACL's AssociationConfig, for additional processing fees.  For information about how to handle oversized request bodies, see the JsonBody object configuration. 
     */
    JsonBody?: JsonBody;
    /**
     * Inspect the request headers. You must configure scope and pattern matching filters in the Headers object, to define the set of headers to and the parts of the headers that WAF inspects.  Only the first 8 KB (8192 bytes) of a request's headers and only the first 200 headers are forwarded to WAF for inspection by the underlying host service. You must configure how to handle any oversize header content in the Headers object. WAF applies the pattern matching filters to the headers that it receives from the underlying host service. 
     */
    Headers?: Headers;
    /**
     * Inspect the request cookies. You must configure scope and pattern matching filters in the Cookies object, to define the set of cookies and the parts of the cookies that WAF inspects.  Only the first 8 KB (8192 bytes) of a request's cookies and only the first 200 cookies are forwarded to WAF for inspection by the underlying host service. You must configure how to handle any oversize cookie content in the Cookies object. WAF applies the pattern matching filters to the cookies that it receives from the underlying host service. 
     */
    Cookies?: Cookies;
    /**
     * Inspect a string containing the list of the request's header names, ordered as they appear in the web request that WAF receives for inspection. WAF generates the string and then uses that as the field to match component in its inspection. WAF separates the header names in the string using colons and no added spaces, for example host:user-agent:accept:authorization:referer.
     */
    HeaderOrder?: HeaderOrder;
    /**
     * Match against the request's JA3 fingerprint. The JA3 fingerprint is a 32-character hash derived from the TLS Client Hello of an incoming request. This fingerprint serves as a unique identifier for the client's TLS configuration. WAF calculates and logs this fingerprint for each request that has enough TLS Client Hello information for the calculation. Almost all web requests include this information.  You can use this choice only with a string match ByteMatchStatement with the PositionalConstraint set to EXACTLY.   You can obtain the JA3 fingerprint for client requests from the web ACL logs. If WAF is able to calculate the fingerprint, it includes it in the logs. For information about the logging fields, see Log fields in the WAF Developer Guide.  Provide the JA3 fingerprint string from the logs in your string match statement specification, to match with any future requests that have the same TLS configuration.
     */
    JA3Fingerprint?: JA3Fingerprint;
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
     * The action to use in the place of the action that results from the rule group evaluation. Set the override action to none to leave the result of the rule group alone. Set it to count to override the result to count only.  You can only use this for rule statements that reference a rule group, like RuleGroupReferenceStatement and ManagedRuleGroupStatement.   This option is usually set to none. It does not affect how the rules in the rule group are evaluated. If you want the rules in the rule group to only count matches, do not use this and instead use the rule action override option, with Count action, in your rule group reference statement settings.  
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
     * A statement used by Firewall Manager to run the rules that are defined in a managed rule group. This is managed by Firewall Manager for an Firewall Manager WAF policy.
     */
    ManagedRuleGroupStatement?: ManagedRuleGroupStatement;
    /**
     * A statement used by Firewall Manager to run the rules that are defined in a rule group. This is managed by Firewall Manager for an Firewall Manager WAF policy.
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
  export interface GenerateMobileSdkReleaseUrlRequest {
    /**
     * The device platform.
     */
    Platform: Platform;
    /**
     * The release version. For the latest available version, specify LATEST.
     */
    ReleaseVersion: VersionKeyString;
  }
  export interface GenerateMobileSdkReleaseUrlResponse {
    /**
     * The presigned download URL for the specified SDK release.
     */
    Url?: DownloadUrl;
  }
  export interface GeoMatchStatement {
    /**
     * An array of two-character country codes that you want to match against, for example, [ "US", "CN" ], from the alpha-2 country ISO codes of the ISO 3166 international standard.  When you use a geo match statement just for the region and country labels that it adds to requests, you still have to supply a country code for the rule to evaluate. In this case, you configure the rule to only count matching requests, but it will still generate logging and count metrics for any matches. You can reduce the logging and metrics that the rule produces by specifying a country that's unlikely to be a source of traffic to your site.
     */
    CountryCodes?: CountryCodes;
    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.   If the specified header isn't present in the request, WAF doesn't apply the rule to the web request at all. 
     */
    ForwardedIPConfig?: ForwardedIPConfig;
  }
  export interface GetDecryptedAPIKeyRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
     */
    Scope: Scope;
    /**
     * The encrypted API key. 
     */
    APIKey: APIKey;
  }
  export interface GetDecryptedAPIKeyResponse {
    /**
     * The token domains that are defined in this API key. 
     */
    TokenDomains?: TokenDomains;
    /**
     * The date and time that the key was created. 
     */
    CreationTimestamp?: Timestamp;
  }
  export interface GetIPSetRequest {
    /**
     * The name of the IP set. You cannot change the name of an IPSet after you create it.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
  export interface GetMobileSdkReleaseRequest {
    /**
     * The device platform.
     */
    Platform: Platform;
    /**
     * The release version. For the latest available version, specify LATEST.
     */
    ReleaseVersion: VersionKeyString;
  }
  export interface GetMobileSdkReleaseResponse {
    /**
     * Information for a specified SDK release, including release notes and tags.
     */
    MobileSdkRelease?: MobileSdkRelease;
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * The metric name assigned to the Rule or RuleGroup dimension for which you want a sample of requests.
     */
    RuleMetricName: MetricName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * The Amazon Resource Name (ARN) of the resource whose web ACL you want to retrieve.  The ARN must be in one of the following formats:   For an Application Load Balancer: arn:partition:elasticloadbalancing:region:account-id:loadbalancer/app/load-balancer-name/load-balancer-id     For an Amazon API Gateway REST API: arn:partition:apigateway:region::/restapis/api-id/stages/stage-name     For an AppSync GraphQL API: arn:partition:appsync:region:account-id:apis/GraphQLApiId     For an Amazon Cognito user pool: arn:partition:cognito-idp:region:account-id:userpool/user-pool-id     For an App Runner service: arn:partition:apprunner:region:account-id:service/apprunner-service-name/apprunner-service-id     For an Amazon Web Services Verified Access instance: arn:partition:ec2:region:account-id:verified-access-instance/instance-id    
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
    /**
     * The URL to use in SDK integrations with Amazon Web Services managed rule groups. For example, you can use the integration SDKs with the account takeover prevention managed rule group AWSManagedRulesATPRuleSet and the account creation fraud prevention managed rule group AWSManagedRulesACFPRuleSet. This is only populated if you are using a rule group in your web ACL that integrates with your applications in this way. For more information, see WAF client application integration in the WAF Developer Guide.
     */
    ApplicationIntegrationURL?: OutputUrl;
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
  export interface HeaderMatchPattern {
    /**
     * Inspect all headers. 
     */
    All?: All;
    /**
     * Inspect only the headers that have a key that matches one of the strings specified here. 
     */
    IncludedHeaders?: HeaderNames;
    /**
     * Inspect only the headers whose keys don't match any of the strings specified here. 
     */
    ExcludedHeaders?: HeaderNames;
  }
  export type HeaderName = string;
  export type HeaderNames = FieldToMatchData[];
  export interface HeaderOrder {
    /**
     * What WAF should do if the headers of the request are more numerous or larger than WAF can inspect. WAF does not support inspecting the entire contents of request headers when they exceed 8 KB (8192 bytes) or 200 total headers. The underlying host service forwards a maximum of 200 headers and at most 8 KB of header contents to WAF.  The options for oversize handling are the following:    CONTINUE - Inspect the available headers normally, according to the rule inspection criteria.     MATCH - Treat the web request as matching the rule statement. WAF applies the rule action to the request.    NO_MATCH - Treat the web request as not matching the rule statement.  
     */
    OversizeHandling: OversizeHandling;
  }
  export type HeaderValue = string;
  export interface Headers {
    /**
     * The filter to use to identify the subset of headers to inspect in a web request.  You must specify exactly one setting: either All, IncludedHeaders, or ExcludedHeaders. Example JSON: "MatchPattern": { "ExcludedHeaders": [ "KeyToExclude1", "KeyToExclude2" ] } 
     */
    MatchPattern: HeaderMatchPattern;
    /**
     * The parts of the headers to match with the rule inspection criteria. If you specify All, WAF inspects both keys and values. 
     */
    MatchScope: MapMatchScope;
    /**
     * What WAF should do if the headers of the request are more numerous or larger than WAF can inspect. WAF does not support inspecting the entire contents of request headers when they exceed 8 KB (8192 bytes) or 200 total headers. The underlying host service forwards a maximum of 200 headers and at most 8 KB of header contents to WAF.  The options for oversize handling are the following:    CONTINUE - Inspect the available headers normally, according to the rule inspection criteria.     MATCH - Treat the web request as matching the rule statement. WAF applies the rule action to the request.    NO_MATCH - Treat the web request as not matching the rule statement.  
     */
    OversizeHandling: OversizeHandling;
  }
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
     * Contains an array of strings that specifies zero or more IP addresses or blocks of IP addresses that you want WAF to inspect for in incoming requests. All addresses must be specified using Classless Inter-Domain Routing (CIDR) notation. WAF supports all IPv4 and IPv6 CIDR ranges except for /0.  Example address strings:    For requests that originated from the IP address 192.0.2.44, specify 192.0.2.44/32.   For requests that originated from IP addresses from 192.0.2.0 to 192.0.2.255, specify 192.0.2.0/24.   For requests that originated from the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify 1111:0000:0000:0000:0000:0000:0000:0111/128.   For requests that originated from IP addresses 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify 1111:0000:0000:0000:0000:0000:0000:0000/64.   For more information about CIDR notation, see the Wikipedia entry Classless Inter-Domain Routing. Example JSON Addresses specifications:    Empty array: "Addresses": []    Array with one address: "Addresses": ["192.0.2.44/32"]    Array with three addresses: "Addresses": ["192.0.2.44/32", "192.0.2.0/24", "192.0.0.0/16"]    INVALID specification: "Addresses": [""] INVALID   
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
  export interface ImmunityTimeProperty {
    /**
     * The amount of time, in seconds, that a CAPTCHA or challenge timestamp is considered valid by WAF. The default setting is 300.  For the Challenge action, the minimum setting is 300. 
     */
    ImmunityTime: TimeWindowSecond;
  }
  export type InspectionLevel = "COMMON"|"TARGETED"|string;
  export interface JA3Fingerprint {
    /**
     * The match status to assign to the web request if the request doesn't have a JA3 fingerprint.  You can specify the following fallback behaviors:    MATCH - Treat the web request as matching the rule statement. WAF applies the rule action to the request.    NO_MATCH - Treat the web request as not matching the rule statement.  
     */
    FallbackBehavior: FallbackBehavior;
  }
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
    /**
     * What WAF should do if the body is larger than WAF can inspect. WAF does not support inspecting the entire contents of the web request body if the body exceeds the limit for the resource type. If the body is larger than the limit, the underlying host service only forwards the contents that are below the limit to WAF for inspection.  The default limit is 8 KB (8,192 bytes) for regional resources and 16 KB (16,384 bytes) for CloudFront distributions. For CloudFront distributions, you can increase the limit in the web ACL AssociationConfig, for additional processing fees.  The options for oversize handling are the following:    CONTINUE - Inspect the available body contents normally, according to the rule inspection criteria.     MATCH - Treat the web request as matching the rule statement. WAF applies the rule action to the request.    NO_MATCH - Treat the web request as not matching the rule statement.   You can combine the MATCH or NO_MATCH settings for oversize handling with your rule and web ACL action settings, so that you block any request whose body is over the limit.  Default: CONTINUE 
     */
    OversizeHandling?: OversizeHandling;
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
  export type LabelNamespace = string;
  export type LabelSummaries = LabelSummary[];
  export interface LabelSummary {
    /**
     * An individual label specification.
     */
    Name?: LabelName;
  }
  export type Labels = Label[];
  export interface ListAPIKeysRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
  export interface ListAPIKeysResponse {
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The array of key summaries. If you specified a Limit in your request, this might not be the full list. 
     */
    APIKeySummaries?: APIKeySummaries;
    /**
     * The CAPTCHA application integration URL, for use in your JavaScript implementation. 
     */
    ApplicationIntegrationURL?: OutputUrl;
  }
  export interface ListAvailableManagedRuleGroupVersionsRequest {
    /**
     * The name of the managed rule group vendor. You use this, along with the rule group name, to identify a rule group.
     */
    VendorName: VendorName;
    /**
     * The name of the managed rule group. You use this, along with the vendor name, to identify the rule group.
     */
    Name: EntityName;
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * The versions that are currently available for the specified managed rule group. If you specified a Limit in your request, this might not be the full list. 
     */
    Versions?: ManagedRuleGroupVersions;
    /**
     * The name of the version that's currently set as the default. 
     */
    CurrentDefaultVersion?: VersionKeyString;
  }
  export interface ListAvailableManagedRuleGroupsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Array of managed rule groups that you can use. If you specified a Limit in your request, this might not be the full list. 
     */
    ManagedRuleGroups?: ManagedRuleGroupSummaries;
  }
  export interface ListIPSetsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Array of IPSets. If you specified a Limit in your request, this might not be the full list. 
     */
    IPSets?: IPSetSummaries;
  }
  export interface ListLoggingConfigurationsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
  export interface ListLoggingConfigurationsResponse {
    /**
     * Array of logging configurations. If you specified a Limit in your request, this might not be the full list. 
     */
    LoggingConfigurations?: LoggingConfigurations;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
  }
  export interface ListManagedRuleSetsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Your managed rule sets. If you specified a Limit in your request, this might not be the full list. 
     */
    ManagedRuleSets?: ManagedRuleSetSummaries;
  }
  export type ListMaxItems = number;
  export interface ListMobileSdkReleasesRequest {
    /**
     * The device platform to retrieve the list for.
     */
    Platform: Platform;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
    /**
     * The maximum number of objects that you want WAF to return for this request. If more objects are available, in the response, WAF provides a NextMarker value that you can use in a subsequent call to get the next batch of objects.
     */
    Limit?: PaginationLimit;
  }
  export interface ListMobileSdkReleasesResponse {
    /**
     * The high level information for the available SDK releases. If you specified a Limit in your request, this might not be the full list. 
     */
    ReleaseSummaries?: ReleaseSummaries;
    /**
     * When you request a list of objects with a Limit setting, if the number of objects that are still available for retrieval exceeds the limit, WAF returns a NextMarker value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextMarker?: NextMarker;
  }
  export interface ListRegexPatternSetsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Array of regex pattern sets. If you specified a Limit in your request, this might not be the full list. 
     */
    RegexPatternSets?: RegexPatternSetSummaries;
  }
  export interface ListResourcesForWebACLRequest {
    /**
     * The Amazon Resource Name (ARN) of the web ACL.
     */
    WebACLArn: ResourceArn;
    /**
     * Used for web ACLs that are scoped for regional applications. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.   If you don't provide a resource type, the call uses the resource type APPLICATION_LOAD_BALANCER.   Default: APPLICATION_LOAD_BALANCER 
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Array of rule groups. If you specified a Limit in your request, this might not be the full list. 
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
     * The collection of tagging definitions for the resource. If you specified a Limit in your request, this might not be the full list. 
     */
    TagInfoForResource?: TagInfoForResource;
  }
  export interface ListWebACLsRequest {
    /**
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Array of web ACLs. If you specified a Limit in your request, this might not be the full list. 
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
     * The logging destination configuration that you want to associate with the web ACL.  You can associate one logging destination to a web ACL. 
     */
    LogDestinationConfigs: LogDestinationConfigs;
    /**
     * The parts of the request that you want to keep out of the logs. For example, if you redact the SingleHeader field, the HEADER field in the logs will be REDACTED for all rules that use the SingleHeader FieldToMatch setting.  Redaction applies only to the component that's specified in the rule's FieldToMatch setting, so the SingleHeader redaction doesn't apply to rules that use the Headers FieldToMatch.  You can specify only the following fields for redaction: UriPath, QueryString, SingleHeader, and Method. 
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
  export type LoginPathString = string;
  export interface ManagedProductDescriptor {
    /**
     * The name of the managed rule group vendor. You use this, along with the rule group name, to identify a rule group.
     */
    VendorName?: VendorName;
    /**
     * The name of the managed rule group. For example, AWSManagedRulesAnonymousIpList or AWSManagedRulesATPRuleSet.
     */
    ManagedRuleSetName?: EntityName;
    /**
     * A unique identifier for the rule group. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    ProductId?: ProductId;
    /**
     * For Amazon Web Services Marketplace managed rule groups only, the link to the rule group product page. 
     */
    ProductLink?: ProductLink;
    /**
     * The display name for the managed rule group. For example, Anonymous IP list or Account takeover prevention.
     */
    ProductTitle?: ProductTitle;
    /**
     * A short description of the managed rule group.
     */
    ProductDescription?: ProductDescription;
    /**
     * The Amazon resource name (ARN) of the Amazon Simple Notification Service SNS topic that's used to provide notification of changes to the managed rule group. You can subscribe to the SNS topic to receive notifications when the managed rule group is modified, such as for new versions and for version expiration. For more information, see the Amazon Simple Notification Service Developer Guide.
     */
    SnsTopicArn?: ResourceArn;
    /**
     * Indicates whether the rule group is versioned. 
     */
    IsVersioningSupported?: Boolean;
    /**
     * Indicates whether the rule group provides an advanced set of protections, such as the the Amazon Web Services Managed Rules rule groups that are used for WAF intelligent threat mitigation. 
     */
    IsAdvancedManagedRuleSet?: Boolean;
  }
  export type ManagedProductDescriptors = ManagedProductDescriptor[];
  export interface ManagedRuleGroupConfig {
    /**
     *  Instead of this setting, provide your configuration under AWSManagedRulesATPRuleSet.  
     */
    LoginPath?: LoginPathString;
    /**
     *  Instead of this setting, provide your configuration under the request inspection configuration for AWSManagedRulesATPRuleSet or AWSManagedRulesACFPRuleSet.  
     */
    PayloadType?: PayloadType;
    /**
     *  Instead of this setting, provide your configuration under the request inspection configuration for AWSManagedRulesATPRuleSet or AWSManagedRulesACFPRuleSet.  
     */
    UsernameField?: UsernameField;
    /**
     *  Instead of this setting, provide your configuration under the request inspection configuration for AWSManagedRulesATPRuleSet or AWSManagedRulesACFPRuleSet.  
     */
    PasswordField?: PasswordField;
    /**
     * Additional configuration for using the Bot Control managed rule group. Use this to specify the inspection level that you want to use. For information about using the Bot Control managed rule group, see WAF Bot Control rule group and WAF Bot Control in the WAF Developer Guide.
     */
    AWSManagedRulesBotControlRuleSet?: AWSManagedRulesBotControlRuleSet;
    /**
     * Additional configuration for using the account takeover prevention (ATP) managed rule group, AWSManagedRulesATPRuleSet. Use this to provide login request information to the rule group. For web ACLs that protect CloudFront distributions, use this to also provide the information about how your distribution responds to login requests.  This configuration replaces the individual configuration fields in ManagedRuleGroupConfig and provides additional feature configuration.  For information about using the ATP managed rule group, see WAF Fraud Control account takeover prevention (ATP) rule group and WAF Fraud Control account takeover prevention (ATP) in the WAF Developer Guide.
     */
    AWSManagedRulesATPRuleSet?: AWSManagedRulesATPRuleSet;
    /**
     * Additional configuration for using the account creation fraud prevention (ACFP) managed rule group, AWSManagedRulesACFPRuleSet. Use this to provide account creation request information to the rule group. For web ACLs that protect CloudFront distributions, use this to also provide the information about how your distribution responds to account creation requests.  For information about using the ACFP managed rule group, see WAF Fraud Control account creation fraud prevention (ACFP) rule group and WAF Fraud Control account creation fraud prevention (ACFP) in the WAF Developer Guide.
     */
    AWSManagedRulesACFPRuleSet?: AWSManagedRulesACFPRuleSet;
  }
  export type ManagedRuleGroupConfigs = ManagedRuleGroupConfig[];
  export interface ManagedRuleGroupStatement {
    /**
     * The name of the managed rule group vendor. You use this, along with the rule group name, to identify a rule group.
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
     * Rules in the referenced rule group whose actions are set to Count.   Instead of this option, use RuleActionOverrides. It accepts any valid action setting, including Count. 
     */
    ExcludedRules?: ExcludedRules;
    /**
     * An optional nested statement that narrows the scope of the web requests that are evaluated by the managed rule group. Requests are only evaluated by the rule group if they match the scope-down statement. You can use any nestable Statement in the scope-down statement, and you can nest statements at any level, the same as you can for a rule statement. 
     */
    ScopeDownStatement?: Statement;
    /**
     * Additional information that's used by a managed rule group. Many managed rule groups don't require this. The rule groups used for intelligent threat mitigation require additional configuration:    Use the AWSManagedRulesACFPRuleSet configuration object to configure the account creation fraud prevention managed rule group. The configuration includes the registration and sign-up pages of your application and the locations in the account creation request payload of data, such as the user email and phone number fields.    Use the AWSManagedRulesATPRuleSet configuration object to configure the account takeover prevention managed rule group. The configuration includes the sign-in page of your application and the locations in the login request payload of data such as the username and password.    Use the AWSManagedRulesBotControlRuleSet configuration object to configure the protection level that you want the Bot Control rule group to use.   
     */
    ManagedRuleGroupConfigs?: ManagedRuleGroupConfigs;
    /**
     * Action settings to use in the place of the rule actions that are configured inside the rule group. You specify one override for each rule whose action you want to change.  You can use overrides for testing, for example you can override all of rule actions to Count and then monitor the resulting count metrics to understand how the rule group would handle your web traffic. You can also permanently override some or all actions, to modify how the rule group manages your web traffic.
     */
    RuleActionOverrides?: RuleActionOverrides;
  }
  export type ManagedRuleGroupSummaries = ManagedRuleGroupSummary[];
  export interface ManagedRuleGroupSummary {
    /**
     * The name of the managed rule group vendor. You use this, along with the rule group name, to identify a rule group.
     */
    VendorName?: VendorName;
    /**
     * The name of the managed rule group. You use this, along with the vendor name, to identify the rule group.
     */
    Name?: EntityName;
    /**
     * Indicates whether the managed rule group is versioned. If it is, you can retrieve the versions list by calling ListAvailableManagedRuleGroupVersions. 
     */
    VersioningSupported?: Boolean;
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
     * The web ACL capacity units (WCUs) required for this rule group. WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. For more information, see WAF web ACL capacity units (WCU) in the WAF Developer Guide. 
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
  export type MapMatchScope = "ALL"|"KEY"|"VALUE"|string;
  export interface Method {
  }
  export type MetricName = string;
  export interface MobileSdkRelease {
    /**
     * The release version. 
     */
    ReleaseVersion?: VersionKeyString;
    /**
     * The timestamp of the release. 
     */
    Timestamp?: Timestamp;
    /**
     * Notes describing the release.
     */
    ReleaseNotes?: ReleaseNotes;
    /**
     * Tags that are associated with the release. 
     */
    Tags?: TagList;
  }
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
  export type OutputUrl = string;
  export interface OverrideAction {
    /**
     * Override the rule group evaluation result to count only.   This option is usually set to none. It does not affect how the rules in the rule group are evaluated. If you want the rules in the rule group to only count matches, do not use this and instead use the rule action override option, with Count action, in your rule group reference statement settings.  
     */
    Count?: CountAction;
    /**
     * Don't override the rule group evaluation result. This is the most common setting.
     */
    None?: NoneAction;
  }
  export type OversizeHandling = "CONTINUE"|"MATCH"|"NO_MATCH"|string;
  export type PaginationLimit = number;
  export interface PasswordField {
    /**
     * The name of the password field.  How you specify this depends on the request inspection payload type.   For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "password": "THE_PASSWORD" } }, the password field specification is /form/password.   For form encoded payload types, use the HTML form names. For example, for an HTML form with the input element named password1, the password field specification is password1.  
     */
    Identifier: FieldIdentifier;
  }
  export type PayloadType = "JSON"|"FORM_ENCODED"|string;
  export interface PhoneNumberField {
    /**
     * The name of a single primary phone number field.  How you specify the phone number fields depends on the request inspection payload type.   For JSON payloads, specify the field identifiers in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "primaryphoneline1": "THE_PHONE1", "primaryphoneline2": "THE_PHONE2", "primaryphoneline3": "THE_PHONE3" } }, the phone number field identifiers are /form/primaryphoneline1, /form/primaryphoneline2, and /form/primaryphoneline3.   For form encoded payload types, use the HTML form names. For example, for an HTML form with input elements named primaryphoneline1, primaryphoneline2, and primaryphoneline3, the phone number field identifiers are primaryphoneline1, primaryphoneline2, and primaryphoneline3.   
     */
    Identifier: FieldIdentifier;
  }
  export type PhoneNumberFields = PhoneNumberField[];
  export type Platform = "IOS"|"ANDROID"|string;
  export type PolicyString = string;
  export type PopulationSize = number;
  export type PositionalConstraint = "EXACTLY"|"STARTS_WITH"|"ENDS_WITH"|"CONTAINS"|"CONTAINS_WORD"|string;
  export type ProductDescription = string;
  export type ProductId = string;
  export type ProductLink = string;
  export type ProductTitle = string;
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * The policy to attach to the specified rule group.  The policy specifications must conform to the following:   The policy must be composed using IAM Policy version 2012-10-17.   The policy must include specifications for Effect, Action, and Principal.    Effect must specify Allow.    Action must specify wafv2:CreateWebACL, wafv2:UpdateWebACL, and wafv2:PutFirewallManagerRuleGroups and may optionally specify wafv2:GetRuleGroup. WAF rejects any extra actions or wildcard actions in the policy.   The policy must not include a Resource parameter.   For more information, see IAM Policies. 
     */
    Policy: PolicyString;
  }
  export interface PutPermissionPolicyResponse {
  }
  export interface QueryString {
  }
  export interface RateBasedStatement {
    /**
     * The limit on requests per 5-minute period for a single aggregation instance for the rate-based rule. If the rate-based statement includes a ScopeDownStatement, this limit is applied only to the requests that match the statement. Examples:    If you aggregate on just the IP address, this is the limit on requests from any single IP address.    If you aggregate on the HTTP method and the query argument name "city", then this is the limit on requests for any single method, city pair.   
     */
    Limit: RateLimit;
    /**
     * Setting that indicates how to aggregate the request counts.   Web requests that are missing any of the components specified in the aggregation keys are omitted from the rate-based rule evaluation and handling.      CONSTANT - Count and limit the requests that match the rate-based rule's scope-down statement. With this option, the counted requests aren't further aggregated. The scope-down statement is the only specification used. When the count of all requests that satisfy the scope-down statement goes over the limit, WAF applies the rule action to all requests that satisfy the scope-down statement.  With this option, you must configure the ScopeDownStatement property.     CUSTOM_KEYS - Aggregate the request counts using one or more web request components as the aggregate keys. With this option, you must specify the aggregate keys in the CustomKeys property.  To aggregate on only the IP address or only the forwarded IP address, don't use custom keys. Instead, set the aggregate key type to IP or FORWARDED_IP.    FORWARDED_IP - Aggregate the request counts on the first IP address in an HTTP header.  With this option, you must specify the header to use in the ForwardedIPConfig property.  To aggregate on a combination of the forwarded IP address with other aggregate keys, use CUSTOM_KEYS.     IP - Aggregate the request counts on the IP address from the web request origin. To aggregate on a combination of the IP address with other aggregate keys, use CUSTOM_KEYS.   
     */
    AggregateKeyType: RateBasedStatementAggregateKeyType;
    /**
     * An optional nested statement that narrows the scope of the web requests that are evaluated and managed by the rate-based statement. When you use a scope-down statement, the rate-based rule only tracks and rate limits requests that match the scope-down statement. You can use any nestable Statement in the scope-down statement, and you can nest statements at any level, the same as you can for a rule statement. 
     */
    ScopeDownStatement?: Statement;
    /**
     * The configuration for inspecting IP addresses in an HTTP header that you specify, instead of using the IP address that's reported by the web request origin. Commonly, this is the X-Forwarded-For (XFF) header, but you can specify any header name.   If the specified header isn't present in the request, WAF doesn't apply the rule to the web request at all.  This is required if you specify a forwarded IP in the rule's aggregate key settings. 
     */
    ForwardedIPConfig?: ForwardedIPConfig;
    /**
     * Specifies the aggregate keys to use in a rate-base rule. 
     */
    CustomKeys?: RateBasedStatementCustomKeys;
  }
  export type RateBasedStatementAggregateKeyType = "IP"|"FORWARDED_IP"|"CUSTOM_KEYS"|"CONSTANT"|string;
  export interface RateBasedStatementCustomKey {
    /**
     * Use the value of a header in the request as an aggregate key. Each distinct value in the header contributes to the aggregation instance. If you use a single header as your custom key, then each value fully defines an aggregation instance. 
     */
    Header?: RateLimitHeader;
    /**
     * Use the value of a cookie in the request as an aggregate key. Each distinct value in the cookie contributes to the aggregation instance. If you use a single cookie as your custom key, then each value fully defines an aggregation instance. 
     */
    Cookie?: RateLimitCookie;
    /**
     * Use the specified query argument as an aggregate key. Each distinct value for the named query argument contributes to the aggregation instance. If you use a single query argument as your custom key, then each value fully defines an aggregation instance. 
     */
    QueryArgument?: RateLimitQueryArgument;
    /**
     * Use the request's query string as an aggregate key. Each distinct string contributes to the aggregation instance. If you use just the query string as your custom key, then each string fully defines an aggregation instance. 
     */
    QueryString?: RateLimitQueryString;
    /**
     * Use the request's HTTP method as an aggregate key. Each distinct HTTP method contributes to the aggregation instance. If you use just the HTTP method as your custom key, then each method fully defines an aggregation instance. 
     */
    HTTPMethod?: RateLimitHTTPMethod;
    /**
     * Use the first IP address in an HTTP header as an aggregate key. Each distinct forwarded IP address contributes to the aggregation instance. When you specify an IP or forwarded IP in the custom key settings, you must also specify at least one other key to use. You can aggregate on only the forwarded IP address by specifying FORWARDED_IP in your rate-based statement's AggregateKeyType.  With this option, you must specify the header to use in the rate-based rule's ForwardedIPConfig property. 
     */
    ForwardedIP?: RateLimitForwardedIP;
    /**
     * Use the request's originating IP address as an aggregate key. Each distinct IP address contributes to the aggregation instance. When you specify an IP or forwarded IP in the custom key settings, you must also specify at least one other key to use. You can aggregate on only the IP address by specifying IP in your rate-based statement's AggregateKeyType. 
     */
    IP?: RateLimitIP;
    /**
     * Use the specified label namespace as an aggregate key. Each distinct fully qualified label name that has the specified label namespace contributes to the aggregation instance. If you use just one label namespace as your custom key, then each label name fully defines an aggregation instance.  This uses only labels that have been added to the request by rules that are evaluated before this rate-based rule in the web ACL.  For information about label namespaces and names, see Label syntax and naming requirements in the WAF Developer Guide.
     */
    LabelNamespace?: RateLimitLabelNamespace;
    /**
     * Use the request's URI path as an aggregate key. Each distinct URI path contributes to the aggregation instance. If you use just the URI path as your custom key, then each URI path fully defines an aggregation instance. 
     */
    UriPath?: RateLimitUriPath;
  }
  export type RateBasedStatementCustomKeys = RateBasedStatementCustomKey[];
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
  export interface RateLimitCookie {
    /**
     * The name of the cookie to use. 
     */
    Name: FieldToMatchData;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
     */
    TextTransformations: TextTransformations;
  }
  export interface RateLimitForwardedIP {
  }
  export interface RateLimitHTTPMethod {
  }
  export interface RateLimitHeader {
    /**
     * The name of the header to use. 
     */
    Name: FieldToMatchData;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
     */
    TextTransformations: TextTransformations;
  }
  export interface RateLimitIP {
  }
  export interface RateLimitLabelNamespace {
    /**
     * The namespace to use for aggregation. 
     */
    Namespace: LabelNamespace;
  }
  export interface RateLimitQueryArgument {
    /**
     * The name of the query argument to use. 
     */
    Name: FieldToMatchData;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
     */
    TextTransformations: TextTransformations;
  }
  export interface RateLimitQueryString {
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
     */
    TextTransformations: TextTransformations;
  }
  export interface RateLimitUriPath {
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
     */
    TextTransformations: TextTransformations;
  }
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
     * The part of the web request that you want WAF to inspect. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
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
     * The part of the web request that you want WAF to inspect. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
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
  export type RegistrationPagePathString = string;
  export type RegularExpressionList = Regex[];
  export type ReleaseNotes = string;
  export type ReleaseSummaries = ReleaseSummary[];
  export interface ReleaseSummary {
    /**
     * The release version. 
     */
    ReleaseVersion?: VersionKeyString;
    /**
     * The timestamp of the release. 
     */
    Timestamp?: Timestamp;
  }
  export type RequestBody = {[key: string]: RequestBodyAssociatedResourceTypeConfig};
  export interface RequestBodyAssociatedResourceTypeConfig {
    /**
     * Specifies the maximum size of the web request body component that an associated CloudFront distribution should send to WAF for inspection. This applies to statements in the web ACL that inspect the body or JSON body.  Default: 16 KB (16,384 bytes) 
     */
    DefaultSizeInspectionLimit: SizeInspectionLimit;
  }
  export interface RequestInspection {
    /**
     * The payload type for your login endpoint, either JSON or form encoded.
     */
    PayloadType: PayloadType;
    /**
     * The name of the field in the request payload that contains your customer's username.  How you specify this depends on the request inspection payload type.   For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "username": "THE_USERNAME" } }, the username field specification is /form/username.    For form encoded payload types, use the HTML form names. For example, for an HTML form with the input element named username1, the username field specification is username1   
     */
    UsernameField: UsernameField;
    /**
     * The name of the field in the request payload that contains your customer's password.  How you specify this depends on the request inspection payload type.   For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "password": "THE_PASSWORD" } }, the password field specification is /form/password.   For form encoded payload types, use the HTML form names. For example, for an HTML form with the input element named password1, the password field specification is password1.  
     */
    PasswordField: PasswordField;
  }
  export interface RequestInspectionACFP {
    /**
     * The payload type for your account creation endpoint, either JSON or form encoded.
     */
    PayloadType: PayloadType;
    /**
     * The name of the field in the request payload that contains your customer's username.  How you specify this depends on the request inspection payload type.   For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "username": "THE_USERNAME" } }, the username field specification is /form/username.    For form encoded payload types, use the HTML form names. For example, for an HTML form with the input element named username1, the username field specification is username1   
     */
    UsernameField?: UsernameField;
    /**
     * The name of the field in the request payload that contains your customer's password.  How you specify this depends on the request inspection payload type.   For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "password": "THE_PASSWORD" } }, the password field specification is /form/password.   For form encoded payload types, use the HTML form names. For example, for an HTML form with the input element named password1, the password field specification is password1.  
     */
    PasswordField?: PasswordField;
    /**
     * The name of the field in the request payload that contains your customer's email.  How you specify this depends on the request inspection payload type.   For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "email": "THE_EMAIL" } }, the email field specification is /form/email.   For form encoded payload types, use the HTML form names. For example, for an HTML form with the input element named email1, the email field specification is email1.  
     */
    EmailField?: EmailField;
    /**
     * The names of the fields in the request payload that contain your customer's primary phone number.  Order the phone number fields in the array exactly as they are ordered in the request payload.  How you specify the phone number fields depends on the request inspection payload type.   For JSON payloads, specify the field identifiers in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "primaryphoneline1": "THE_PHONE1", "primaryphoneline2": "THE_PHONE2", "primaryphoneline3": "THE_PHONE3" } }, the phone number field identifiers are /form/primaryphoneline1, /form/primaryphoneline2, and /form/primaryphoneline3.   For form encoded payload types, use the HTML form names. For example, for an HTML form with input elements named primaryphoneline1, primaryphoneline2, and primaryphoneline3, the phone number field identifiers are primaryphoneline1, primaryphoneline2, and primaryphoneline3.   
     */
    PhoneNumberFields?: PhoneNumberFields;
    /**
     * The names of the fields in the request payload that contain your customer's primary physical address.  Order the address fields in the array exactly as they are ordered in the request payload.  How you specify the address fields depends on the request inspection payload type.   For JSON payloads, specify the field identifiers in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "primaryaddressline1": "THE_ADDRESS1", "primaryaddressline2": "THE_ADDRESS2", "primaryaddressline3": "THE_ADDRESS3" } }, the address field idenfiers are /form/primaryaddressline1, /form/primaryaddressline2, and /form/primaryaddressline3.   For form encoded payload types, use the HTML form names. For example, for an HTML form with input elements named primaryaddressline1, primaryaddressline2, and primaryaddressline3, the address fields identifiers are primaryaddressline1, primaryaddressline2, and primaryaddressline3.   
     */
    AddressFields?: AddressFields;
  }
  export type ResourceArn = string;
  export type ResourceArns = ResourceArn[];
  export type ResourceType = "APPLICATION_LOAD_BALANCER"|"API_GATEWAY"|"APPSYNC"|"COGNITO_USER_POOL"|"APP_RUNNER_SERVICE"|"VERIFIED_ACCESS_INSTANCE"|string;
  export type ResponseCode = number;
  export type ResponseContent = string;
  export type ResponseContentType = "TEXT_PLAIN"|"TEXT_HTML"|"APPLICATION_JSON"|string;
  export interface ResponseInspection {
    /**
     * Configures inspection of the response status code for success and failure indicators. 
     */
    StatusCode?: ResponseInspectionStatusCode;
    /**
     * Configures inspection of the response header for success and failure indicators. 
     */
    Header?: ResponseInspectionHeader;
    /**
     * Configures inspection of the response body for success and failure indicators. WAF can inspect the first 65,536 bytes (64 KB) of the response body. 
     */
    BodyContains?: ResponseInspectionBodyContains;
    /**
     * Configures inspection of the response JSON for success and failure indicators. WAF can inspect the first 65,536 bytes (64 KB) of the response JSON. 
     */
    Json?: ResponseInspectionJson;
  }
  export interface ResponseInspectionBodyContains {
    /**
     * Strings in the body of the response that indicate a successful login or account creation attempt. To be counted as a success, the string can be anywhere in the body and must be an exact match, including case. Each string must be unique among the success and failure strings.  JSON examples: "SuccessStrings": [ "Login successful" ] and "SuccessStrings": [ "Account creation successful", "Welcome to our site!" ] 
     */
    SuccessStrings: ResponseInspectionBodyContainsSuccessStrings;
    /**
     * Strings in the body of the response that indicate a failed login or account creation attempt. To be counted as a failure, the string can be anywhere in the body and must be an exact match, including case. Each string must be unique among the success and failure strings.  JSON example: "FailureStrings": [ "Request failed" ] 
     */
    FailureStrings: ResponseInspectionBodyContainsFailureStrings;
  }
  export type ResponseInspectionBodyContainsFailureStrings = FailureValue[];
  export type ResponseInspectionBodyContainsSuccessStrings = SuccessValue[];
  export interface ResponseInspectionHeader {
    /**
     * The name of the header to match against. The name must be an exact match, including case. JSON example: "Name": [ "RequestResult" ] 
     */
    Name: ResponseInspectionHeaderName;
    /**
     * Values in the response header with the specified name that indicate a successful login or account creation attempt. To be counted as a success, the value must be an exact match, including case. Each value must be unique among the success and failure values.  JSON examples: "SuccessValues": [ "LoginPassed", "Successful login" ] and "SuccessValues": [ "AccountCreated", "Successful account creation" ] 
     */
    SuccessValues: ResponseInspectionHeaderSuccessValues;
    /**
     * Values in the response header with the specified name that indicate a failed login or account creation attempt. To be counted as a failure, the value must be an exact match, including case. Each value must be unique among the success and failure values.  JSON examples: "FailureValues": [ "LoginFailed", "Failed login" ] and "FailureValues": [ "AccountCreationFailed" ] 
     */
    FailureValues: ResponseInspectionHeaderFailureValues;
  }
  export type ResponseInspectionHeaderFailureValues = FailureValue[];
  export type ResponseInspectionHeaderName = string;
  export type ResponseInspectionHeaderSuccessValues = SuccessValue[];
  export interface ResponseInspectionJson {
    /**
     * The identifier for the value to match against in the JSON. The identifier must be an exact match, including case. JSON examples: "Identifier": [ "/login/success" ] and "Identifier": [ "/sign-up/success" ] 
     */
    Identifier: FieldIdentifier;
    /**
     * Values for the specified identifier in the response JSON that indicate a successful login or account creation attempt. To be counted as a success, the value must be an exact match, including case. Each value must be unique among the success and failure values.  JSON example: "SuccessValues": [ "True", "Succeeded" ] 
     */
    SuccessValues: ResponseInspectionJsonSuccessValues;
    /**
     * Values for the specified identifier in the response JSON that indicate a failed login or account creation attempt. To be counted as a failure, the value must be an exact match, including case. Each value must be unique among the success and failure values.  JSON example: "FailureValues": [ "False", "Failed" ] 
     */
    FailureValues: ResponseInspectionJsonFailureValues;
  }
  export type ResponseInspectionJsonFailureValues = FailureValue[];
  export type ResponseInspectionJsonSuccessValues = SuccessValue[];
  export interface ResponseInspectionStatusCode {
    /**
     * Status codes in the response that indicate a successful login or account creation attempt. To be counted as a success, the response status code must match one of these. Each code must be unique among the success and failure status codes.  JSON example: "SuccessCodes": [ 200, 201 ] 
     */
    SuccessCodes: ResponseInspectionStatusCodeSuccessCodes;
    /**
     * Status codes in the response that indicate a failed login or account creation attempt. To be counted as a failure, the response status code must match one of these. Each code must be unique among the success and failure status codes.  JSON example: "FailureCodes": [ 400, 404 ] 
     */
    FailureCodes: ResponseInspectionStatusCodeFailureCodes;
  }
  export type ResponseInspectionStatusCodeFailureCodes = FailureCode[];
  export type ResponseInspectionStatusCodeSuccessCodes = SuccessCode[];
  export type ResponseStatusCode = number;
  export interface Rule {
    /**
     * The name of the rule.  If you change the name of a Rule after you create it and you want the rule's metric name to reflect the change, update the metric name in the rule's VisibilityConfig settings. WAF doesn't automatically update the metric name when you update the rule name. 
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
     * The action to use in the place of the action that results from the rule group evaluation. Set the override action to none to leave the result of the rule group alone. Set it to count to override the result to count only.  You can only use this for rule statements that reference a rule group, like RuleGroupReferenceStatement and ManagedRuleGroupStatement.   This option is usually set to none. It does not affect how the rules in the rule group are evaluated. If you want the rules in the rule group to only count matches, do not use this and instead use the rule action override option, with Count action, in your rule group reference statement settings.  
     */
    OverrideAction?: OverrideAction;
    /**
     * Labels to apply to web requests that match the rule match statement. WAF applies fully qualified labels to matching web requests. A fully qualified label is the concatenation of a label namespace and a rule label. The rule's rule group or web ACL defines the label namespace.  Rules that run after this rule in the web ACL can match against these labels using a LabelMatchStatement. For each label, provide a case-sensitive string containing optional namespaces and a label name, according to the following guidelines:   Separate each component of the label with a colon.    Each namespace or name can have up to 128 characters.   You can specify up to 5 namespaces in a label.   Don't use the following reserved words in your label specification: aws, waf, managed, rulegroup, webacl, regexpatternset, or ipset.   For example, myLabelName or nameSpace1:nameSpace2:myLabelName. 
     */
    RuleLabels?: Labels;
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection.  If you change the name of a Rule after you create it and you want the rule's metric name to reflect the change, update the metric name as well. WAF doesn't automatically update the metric name. 
     */
    VisibilityConfig: VisibilityConfig;
    /**
     * Specifies how WAF should handle CAPTCHA evaluations. If you don't specify this, WAF uses the CAPTCHA configuration that's defined for the web ACL. 
     */
    CaptchaConfig?: CaptchaConfig;
    /**
     * Specifies how WAF should handle Challenge evaluations. If you don't specify this, WAF uses the challenge configuration that's defined for the web ACL. 
     */
    ChallengeConfig?: ChallengeConfig;
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
     * Instructs WAF to count the web request and then continue evaluating the request using the remaining rules in the web ACL.
     */
    Count?: CountAction;
    /**
     * Instructs WAF to run a CAPTCHA check against the web request.
     */
    Captcha?: CaptchaAction;
    /**
     * Instructs WAF to run a Challenge check against the web request.
     */
    Challenge?: ChallengeAction;
  }
  export interface RuleActionOverride {
    /**
     * The name of the rule to override.
     */
    Name: EntityName;
    /**
     * The override action to use, in place of the configured action of the rule in the rule group. 
     */
    ActionToUse: RuleAction;
  }
  export type RuleActionOverrides = RuleActionOverride[];
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
     * The web ACL capacity units (WCUs) required for this rule group. When you create your own rule group, you define this, and you cannot change it after creation. When you add or modify the rules in a rule group, WAF enforces this limit. You can check the capacity for a set of rules using CheckCapacity. WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. For more information, see WAF web ACL capacity units (WCU) in the WAF Developer Guide. 
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
     * The Rule statements used to identify the web requests that you want to manage. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
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
     * Rules in the referenced rule group whose actions are set to Count.   Instead of this option, use RuleActionOverrides. It accepts any valid action setting, including Count. 
     */
    ExcludedRules?: ExcludedRules;
    /**
     * Action settings to use in the place of the rule actions that are configured inside the rule group. You specify one override for each rule whose action you want to change.  You can use overrides for testing, for example you can override all of rule actions to Count and then monitor the resulting count metrics to understand how the rule group would handle your web traffic. You can also permanently override some or all actions, to modify how the rule group manages your web traffic.
     */
    RuleActionOverrides?: RuleActionOverrides;
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
     * The action that WAF applied to the request.
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
    /**
     * The CAPTCHA response for the request.
     */
    CaptchaResponse?: CaptchaResponse;
    /**
     * The Challenge response for the request.
     */
    ChallengeResponse?: ChallengeResponse;
    /**
     * Used only for rule group rules that have a rule action override in place in the web ACL. This is the action that the rule group rule is configured for, and not the action that was applied to the request. The action that WAF applied is the Action value. 
     */
    OverriddenAction?: Action;
  }
  export type SampledHTTPRequests = SampledHTTPRequest[];
  export type Scope = "CLOUDFRONT"|"REGIONAL"|string;
  export type SearchString = Buffer|Uint8Array|Blob|string;
  export type SensitivityLevel = "LOW"|"HIGH"|string;
  export type SingleCookieName = string;
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
     * The part of the web request that you want WAF to inspect. 
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
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
     */
    TextTransformations: TextTransformations;
  }
  export type SizeInspectionLimit = "KB_16"|"KB_32"|"KB_48"|"KB_64"|string;
  export type SolveTimestamp = number;
  export interface SqliMatchStatement {
    /**
     * The part of the web request that you want WAF to inspect. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
     */
    TextTransformations: TextTransformations;
    /**
     * The sensitivity that you want WAF to use to inspect for SQL injection attacks.   HIGH detects more attacks, but might generate more false positives, especially if your web requests frequently contain unusual strings. For information about identifying and mitigating false positives, see Testing and tuning in the WAF Developer Guide.  LOW is generally a better choice for resources that already have other protections against SQL injection attacks or that have a low tolerance for false positives.  Default: LOW 
     */
    SensitivityLevel?: SensitivityLevel;
  }
  export interface Statement {
    /**
     * A rule statement that defines a string match search for WAF to apply to web requests. The byte match statement provides the bytes to search for, the location in requests that you want WAF to search, and other settings. The bytes to search for are typically a string that corresponds with ASCII characters. In the WAF console and the developer guide, this is called a string match statement.
     */
    ByteMatchStatement?: ByteMatchStatement;
    /**
     * A rule statement that inspects for malicious SQL code. Attackers insert malicious SQL code into web requests to do things like modify your database or extract data from it. 
     */
    SqliMatchStatement?: SqliMatchStatement;
    /**
     * A rule statement that inspects for cross-site scripting (XSS) attacks. In XSS attacks, the attacker uses vulnerabilities in a benign website as a vehicle to inject malicious client-site scripts into other legitimate web browsers. 
     */
    XssMatchStatement?: XssMatchStatement;
    /**
     * A rule statement that compares a number of bytes against the size of a request component, using a comparison operator, such as greater than (&gt;) or less than (&lt;). For example, you can use a size constraint statement to look for query strings that are longer than 100 bytes.  If you configure WAF to inspect the request body, WAF inspects only the number of bytes of the body up to the limit for the web ACL. By default, for regional web ACLs, this limit is 8 KB (8,192 bytes) and for CloudFront web ACLs, this limit is 16 KB (16,384 bytes). For CloudFront web ACLs, you can increase the limit in the web ACL AssociationConfig, for additional fees. If you know that the request body for your web requests should never exceed the inspection limit, you could use a size constraint statement to block requests that have a larger request body size. If you choose URI for the value of Part of the request to filter on, the slash (/) in the URI counts as one character. For example, the URI /logo.jpg is nine characters long.
     */
    SizeConstraintStatement?: SizeConstraintStatement;
    /**
     * A rule statement that labels web requests by country and region and that matches against web requests based on country code. A geo match rule labels every request that it inspects regardless of whether it finds a match.   To manage requests only by country, you can use this statement by itself and specify the countries that you want to match against in the CountryCodes array.    Otherwise, configure your geo match rule with Count action so that it only labels requests. Then, add one or more label match rules to run after the geo match rule and configure them to match against the geographic labels and handle the requests as needed.    WAF labels requests using the alpha-2 country and region codes from the International Organization for Standardization (ISO) 3166 standard. WAF determines the codes using either the IP address in the web request origin or, if you specify it, the address in the geo match ForwardedIPConfig.  If you use the web request origin, the label formats are awswaf:clientip:geo:region:&lt;ISO country code&gt;-&lt;ISO region code&gt; and awswaf:clientip:geo:country:&lt;ISO country code&gt;. If you use a forwarded IP address, the label formats are awswaf:forwardedip:geo:region:&lt;ISO country code&gt;-&lt;ISO region code&gt; and awswaf:forwardedip:geo:country:&lt;ISO country code&gt;. For additional details, see Geographic match rule statement in the WAF Developer Guide. 
     */
    GeoMatchStatement?: GeoMatchStatement;
    /**
     * A rule statement used to run the rules that are defined in a RuleGroup. To use this, create a rule group with your rules, then provide the ARN of the rule group in this statement. You cannot nest a RuleGroupReferenceStatement, for example for use inside a NotStatement or OrStatement. You cannot use a rule group reference statement inside another rule group. You can only reference a rule group as a top-level statement within a rule that you define in a web ACL.
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
     * A rate-based rule counts incoming requests and rate limits requests when they are coming at too fast a rate. The rule categorizes requests according to your aggregation criteria, collects them into aggregation instances, and counts and rate limits the requests for each instance.  You can specify individual aggregation keys, like IP address or HTTP method. You can also specify aggregation key combinations, like IP address and HTTP method, or HTTP method, query argument, and cookie.  Each unique set of values for the aggregation keys that you specify is a separate aggregation instance, with the value from each key contributing to the aggregation instance definition.  For example, assume the rule evaluates web requests with the following IP address and HTTP method values:    IP address 10.1.1.1, HTTP method POST   IP address 10.1.1.1, HTTP method GET   IP address 127.0.0.0, HTTP method POST   IP address 10.1.1.1, HTTP method GET   The rule would create different aggregation instances according to your aggregation criteria, for example:    If the aggregation criteria is just the IP address, then each individual address is an aggregation instance, and WAF counts requests separately for each. The aggregation instances and request counts for our example would be the following:    IP address 10.1.1.1: count 3   IP address 127.0.0.0: count 1     If the aggregation criteria is HTTP method, then each individual HTTP method is an aggregation instance. The aggregation instances and request counts for our example would be the following:    HTTP method POST: count 2   HTTP method GET: count 2     If the aggregation criteria is IP address and HTTP method, then each IP address and each HTTP method would contribute to the combined aggregation instance. The aggregation instances and request counts for our example would be the following:    IP address 10.1.1.1, HTTP method POST: count 1   IP address 10.1.1.1, HTTP method GET: count 2   IP address 127.0.0.0, HTTP method POST: count 1     For any n-tuple of aggregation keys, each unique combination of values for the keys defines a separate aggregation instance, which WAF counts and rate-limits individually.  You can optionally nest another statement inside the rate-based statement, to narrow the scope of the rule so that it only counts and rate limits requests that match the nested statement. You can use this nested scope-down statement in conjunction with your aggregation key specifications or you can just count and rate limit all requests that match the scope-down statement, without additional aggregation. When you choose to just manage all requests that match a scope-down statement, the aggregation instance is singular for the rule.  You cannot nest a RateBasedStatement inside another statement, for example inside a NotStatement or OrStatement. You can define a RateBasedStatement inside a web ACL and inside a rule group.  For additional information about the options, see Rate limiting web requests using rate-based rules in the WAF Developer Guide.  If you only aggregate on the individual IP address or forwarded IP address, you can retrieve the list of IP addresses that WAF is currently rate limiting for a rule through the API call GetRateBasedStatementManagedKeys. This option is not available for other aggregation configurations. WAF tracks and manages web requests separately for each instance of a rate-based rule that you use. For example, if you provide the same rate-based rule settings in two web ACLs, each of the two rule statements represents a separate instance of the rate-based rule and gets its own tracking and management by WAF. If you define a rate-based rule inside a rule group, and then use that rule group in multiple places, each use creates a separate instance of the rate-based rule that gets its own tracking and management by WAF. 
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
     * A rule statement used to run the rules that are defined in a managed rule group. To use this, provide the vendor name and the name of the rule group in this statement. You can retrieve the required names by calling ListAvailableManagedRuleGroups. You cannot nest a ManagedRuleGroupStatement, for example for use inside a NotStatement or OrStatement. You cannot use a managed rule group inside another rule group. You can only reference a managed rule group as a top-level statement within a rule that you define in a web ACL.  You are charged additional fees when you use the WAF Bot Control managed rule group AWSManagedRulesBotControlRuleSet, the WAF Fraud Control account takeover prevention (ATP) managed rule group AWSManagedRulesATPRuleSet, or the WAF Fraud Control account creation fraud prevention (ACFP) managed rule group AWSManagedRulesACFPRuleSet. For more information, see WAF Pricing. 
     */
    ManagedRuleGroupStatement?: ManagedRuleGroupStatement;
    /**
     * A rule statement to match against labels that have been added to the web request by rules that have already run in the web ACL.  The label match statement provides the label or namespace string to search for. The label string can represent a part or all of the fully qualified label name that had been added to the web request. Fully qualified labels have a prefix, optional namespaces, and label name. The prefix identifies the rule group or web ACL context of the rule that added the label. If you do not provide the fully qualified name in your label match string, WAF performs the search for labels that were added in the same context as the label match statement. 
     */
    LabelMatchStatement?: LabelMatchStatement;
    /**
     * A rule statement used to search web request components for a match against a single regular expression. 
     */
    RegexMatchStatement?: RegexMatchStatement;
  }
  export type Statements = Statement[];
  export type String = string;
  export type SuccessCode = number;
  export type SuccessValue = string;
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
     * Sets the relative processing order for multiple transformations. WAF processes all transformations, from lowest priority to highest, before inspecting the transformed content. The priorities don't need to be consecutive, but they must all be different. 
     */
    Priority: TextTransformationPriority;
    /**
     * For detailed descriptions of each of the transformation types, see Text transformations in the WAF Developer Guide.
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
  export type TimeWindowSecond = number;
  export type Timestamp = Date;
  export type TokenDomain = string;
  export type TokenDomains = TokenDomain[];
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Contains an array of strings that specifies zero or more IP addresses or blocks of IP addresses that you want WAF to inspect for in incoming requests. All addresses must be specified using Classless Inter-Domain Routing (CIDR) notation. WAF supports all IPv4 and IPv6 CIDR ranges except for /0.  Example address strings:    For requests that originated from the IP address 192.0.2.44, specify 192.0.2.44/32.   For requests that originated from IP addresses from 192.0.2.0 to 192.0.2.255, specify 192.0.2.0/24.   For requests that originated from the IP address 1111:0000:0000:0000:0000:0000:0000:0111, specify 1111:0000:0000:0000:0000:0000:0000:0111/128.   For requests that originated from IP addresses 1111:0000:0000:0000:0000:0000:0000:0000 to 1111:0000:0000:0000:ffff:ffff:ffff:ffff, specify 1111:0000:0000:0000:0000:0000:0000:0000/64.   For more information about CIDR notation, see the Wikipedia entry Classless Inter-Domain Routing. Example JSON Addresses specifications:    Empty array: "Addresses": []    Array with one address: "Addresses": ["192.0.2.44/32"]    Array with three addresses: "Addresses": ["192.0.2.44/32", "192.0.2.0/24", "192.0.0.0/16"]    INVALID specification: "Addresses": [""] INVALID   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * The Rule statements used to identify the web requests that you want to manage. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
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
     * Specifies whether this is for an Amazon CloudFront distribution or for a regional application. A regional application can be an Application Load Balancer (ALB), an Amazon API Gateway REST API, an AppSync GraphQL API, an Amazon Cognito user pool, an App Runner service, or an Amazon Web Services Verified Access instance.  To work with CloudFront, you must also specify the Region US East (N. Virginia) as follows:    CLI - Specify the Region when you use the CloudFront scope: --scope=CLOUDFRONT --region=us-east-1.    API and SDKs - For all calls, use the Region endpoint us-east-1.   
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
     * The Rule statements used to identify the web requests that you want to manage. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
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
    /**
     * Specifies how WAF should handle CAPTCHA evaluations for rules that don't have their own CaptchaConfig settings. If you don't specify this, WAF uses its default settings for CaptchaConfig. 
     */
    CaptchaConfig?: CaptchaConfig;
    /**
     * Specifies how WAF should handle challenge evaluations for rules that don't have their own ChallengeConfig settings. If you don't specify this, WAF uses its default settings for ChallengeConfig. 
     */
    ChallengeConfig?: ChallengeConfig;
    /**
     * Specifies the domains that WAF should accept in a web request token. This enables the use of tokens across multiple protected websites. When WAF provides a token, it uses the domain of the Amazon Web Services resource that the web ACL is protecting. If you don't specify a list of token domains, WAF accepts tokens only for the domain of the protected resource. With a token domain list, WAF accepts the resource's host domain plus all domains in the token domain list, including their prefixed subdomains. Example JSON: "TokenDomains": { "mywebsite.com", "myotherwebsite.com" }  Public suffixes aren't allowed. For example, you can't use usa.gov or co.uk as token domains.
     */
    TokenDomains?: TokenDomains;
    /**
     * Specifies custom configurations for the associations between the web ACL and protected resources.  Use this to customize the maximum size of the request body that your protected CloudFront distributions forward to WAF for inspection. The default is 16 KB (16,384 bytes).   You are charged additional fees when your protected resources forward body sizes that are larger than the default. For more information, see WAF Pricing. 
     */
    AssociationConfig?: AssociationConfig;
  }
  export interface UpdateWebACLResponse {
    /**
     * A token used for optimistic locking. WAF returns this token to your update requests. You use NextLockToken in the same manner as you use LockToken. 
     */
    NextLockToken?: LockToken;
  }
  export interface UriPath {
  }
  export interface UsernameField {
    /**
     * The name of the username field.  How you specify this depends on the request inspection payload type.   For JSON payloads, specify the field name in JSON pointer syntax. For information about the JSON Pointer syntax, see the Internet Engineering Task Force (IETF) documentation JavaScript Object Notation (JSON) Pointer.  For example, for the JSON payload { "form": { "username": "THE_USERNAME" } }, the username field specification is /form/username.    For form encoded payload types, use the HTML form names. For example, for an HTML form with the input element named username1, the username field specification is username1   
     */
    Identifier: FieldIdentifier;
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
     * Indicates whether WAF should store a sampling of the web requests that match the rules. You can view the sampled requests through the WAF console. 
     */
    SampledRequestsEnabled: Boolean;
    /**
     * Indicates whether the associated resource sends metrics to Amazon CloudWatch. For the list of available metrics, see WAF Metrics in the WAF Developer Guide. For web ACLs, the metrics are for web requests that have the web ACL default action applied. WAF applies the default action to web requests that pass the inspection of all rules in the web ACL without being either allowed or blocked. For more information, see The web ACL default action in the WAF Developer Guide.
     */
    CloudWatchMetricsEnabled: Boolean;
    /**
     * A name of the Amazon CloudWatch metric dimension. The name can contain only the characters: A-Z, a-z, 0-9, - (hyphen), and _ (underscore). The name can be from one to 128 characters long. It can't contain whitespace or metric names that are reserved for WAF, for example All and Default_Action. 
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
     * The Rule statements used to identify the web requests that you want to manage. Each rule includes one top-level statement that WAF uses to identify matching web requests, and parameters that govern how WAF handles them. 
     */
    Rules?: Rules;
    /**
     * Defines and enables Amazon CloudWatch metrics and web request sample collection. 
     */
    VisibilityConfig: VisibilityConfig;
    /**
     * The web ACL capacity units (WCUs) currently being used by this web ACL.  WAF uses WCUs to calculate and control the operating resources that are used to run your rules, rule groups, and web ACLs. WAF calculates capacity differently for each rule type, to reflect the relative cost of each rule. Simple rules that cost little to run use fewer WCUs than more complex rules that use more processing power. Rule group capacity is fixed at creation, which helps users plan their web ACL WCU usage when they use a rule group. For more information, see WAF web ACL capacity units (WCU) in the WAF Developer Guide. 
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
    /**
     * Specifies how WAF should handle CAPTCHA evaluations for rules that don't have their own CaptchaConfig settings. If you don't specify this, WAF uses its default settings for CaptchaConfig. 
     */
    CaptchaConfig?: CaptchaConfig;
    /**
     * Specifies how WAF should handle challenge evaluations for rules that don't have their own ChallengeConfig settings. If you don't specify this, WAF uses its default settings for ChallengeConfig. 
     */
    ChallengeConfig?: ChallengeConfig;
    /**
     * Specifies the domains that WAF should accept in a web request token. This enables the use of tokens across multiple protected websites. When WAF provides a token, it uses the domain of the Amazon Web Services resource that the web ACL is protecting. If you don't specify a list of token domains, WAF accepts tokens only for the domain of the protected resource. With a token domain list, WAF accepts the resource's host domain plus all domains in the token domain list, including their prefixed subdomains.
     */
    TokenDomains?: TokenDomains;
    /**
     * Specifies custom configurations for the associations between the web ACL and protected resources.  Use this to customize the maximum size of the request body that your protected CloudFront distributions forward to WAF for inspection. The default is 16 KB (16,384 bytes).   You are charged additional fees when your protected resources forward body sizes that are larger than the default. For more information, see WAF Pricing. 
     */
    AssociationConfig?: AssociationConfig;
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
     * The part of the web request that you want WAF to inspect. 
     */
    FieldToMatch: FieldToMatch;
    /**
     * Text transformations eliminate some of the unusual formatting that attackers use in web requests in an effort to bypass detection. Text transformations are used in rule match statements, to transform the FieldToMatch request component before inspecting it, and they're used in rate-based rule statements, to transform request components before using them as custom aggregation keys. If you specify one or more transformations to apply, WAF performs all transformations on the specified content, starting from the lowest priority setting, and then uses the transformed component contents. 
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
