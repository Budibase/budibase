import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class FMS extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: FMS.Types.ClientConfiguration)
  config: Config & FMS.Types.ClientConfiguration;
  /**
   * Sets a Firewall Manager default administrator account. The Firewall Manager default administrator account can manage third-party firewalls and has full administrative scope that allows administration of all policy types, accounts, organizational units, and Regions. This account must be a member account of the organization in Organizations whose resources you want to protect. For information about working with Firewall Manager administrator accounts, see Managing Firewall Manager administrators in the Firewall Manager Developer Guide.
   */
  associateAdminAccount(params: FMS.Types.AssociateAdminAccountRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets a Firewall Manager default administrator account. The Firewall Manager default administrator account can manage third-party firewalls and has full administrative scope that allows administration of all policy types, accounts, organizational units, and Regions. This account must be a member account of the organization in Organizations whose resources you want to protect. For information about working with Firewall Manager administrator accounts, see Managing Firewall Manager administrators in the Firewall Manager Developer Guide.
   */
  associateAdminAccount(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the Firewall Manager policy administrator as a tenant administrator of a third-party firewall service. A tenant is an instance of the third-party firewall service that's associated with your Amazon Web Services customer account.
   */
  associateThirdPartyFirewall(params: FMS.Types.AssociateThirdPartyFirewallRequest, callback?: (err: AWSError, data: FMS.Types.AssociateThirdPartyFirewallResponse) => void): Request<FMS.Types.AssociateThirdPartyFirewallResponse, AWSError>;
  /**
   * Sets the Firewall Manager policy administrator as a tenant administrator of a third-party firewall service. A tenant is an instance of the third-party firewall service that's associated with your Amazon Web Services customer account.
   */
  associateThirdPartyFirewall(callback?: (err: AWSError, data: FMS.Types.AssociateThirdPartyFirewallResponse) => void): Request<FMS.Types.AssociateThirdPartyFirewallResponse, AWSError>;
  /**
   * Associate resources to a Firewall Manager resource set.
   */
  batchAssociateResource(params: FMS.Types.BatchAssociateResourceRequest, callback?: (err: AWSError, data: FMS.Types.BatchAssociateResourceResponse) => void): Request<FMS.Types.BatchAssociateResourceResponse, AWSError>;
  /**
   * Associate resources to a Firewall Manager resource set.
   */
  batchAssociateResource(callback?: (err: AWSError, data: FMS.Types.BatchAssociateResourceResponse) => void): Request<FMS.Types.BatchAssociateResourceResponse, AWSError>;
  /**
   * Disassociates resources from a Firewall Manager resource set.
   */
  batchDisassociateResource(params: FMS.Types.BatchDisassociateResourceRequest, callback?: (err: AWSError, data: FMS.Types.BatchDisassociateResourceResponse) => void): Request<FMS.Types.BatchDisassociateResourceResponse, AWSError>;
  /**
   * Disassociates resources from a Firewall Manager resource set.
   */
  batchDisassociateResource(callback?: (err: AWSError, data: FMS.Types.BatchDisassociateResourceResponse) => void): Request<FMS.Types.BatchDisassociateResourceResponse, AWSError>;
  /**
   * Permanently deletes an Firewall Manager applications list.
   */
  deleteAppsList(params: FMS.Types.DeleteAppsListRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Permanently deletes an Firewall Manager applications list.
   */
  deleteAppsList(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Firewall Manager association with the IAM role and the Amazon Simple Notification Service (SNS) topic that is used to record Firewall Manager SNS logs.
   */
  deleteNotificationChannel(params: FMS.Types.DeleteNotificationChannelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Firewall Manager association with the IAM role and the Amazon Simple Notification Service (SNS) topic that is used to record Firewall Manager SNS logs.
   */
  deleteNotificationChannel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Permanently deletes an Firewall Manager policy. 
   */
  deletePolicy(params: FMS.Types.DeletePolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Permanently deletes an Firewall Manager policy. 
   */
  deletePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Permanently deletes an Firewall Manager protocols list.
   */
  deleteProtocolsList(params: FMS.Types.DeleteProtocolsListRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Permanently deletes an Firewall Manager protocols list.
   */
  deleteProtocolsList(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified ResourceSet.
   */
  deleteResourceSet(params: FMS.Types.DeleteResourceSetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified ResourceSet.
   */
  deleteResourceSet(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates an Firewall Manager administrator account. To set a different account as an Firewall Manager administrator, submit a PutAdminAccount request. To set an account as a default administrator account, you must submit an AssociateAdminAccount request. Disassociation of the default administrator account follows the first in, last out principle. If you are the default administrator, all Firewall Manager administrators within the organization must first disassociate their accounts before you can disassociate your account.
   */
  disassociateAdminAccount(params: FMS.Types.DisassociateAdminAccountRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates an Firewall Manager administrator account. To set a different account as an Firewall Manager administrator, submit a PutAdminAccount request. To set an account as a default administrator account, you must submit an AssociateAdminAccount request. Disassociation of the default administrator account follows the first in, last out principle. If you are the default administrator, all Firewall Manager administrators within the organization must first disassociate their accounts before you can disassociate your account.
   */
  disassociateAdminAccount(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates a Firewall Manager policy administrator from a third-party firewall tenant. When you call DisassociateThirdPartyFirewall, the third-party firewall vendor deletes all of the firewalls that are associated with the account.
   */
  disassociateThirdPartyFirewall(params: FMS.Types.DisassociateThirdPartyFirewallRequest, callback?: (err: AWSError, data: FMS.Types.DisassociateThirdPartyFirewallResponse) => void): Request<FMS.Types.DisassociateThirdPartyFirewallResponse, AWSError>;
  /**
   * Disassociates a Firewall Manager policy administrator from a third-party firewall tenant. When you call DisassociateThirdPartyFirewall, the third-party firewall vendor deletes all of the firewalls that are associated with the account.
   */
  disassociateThirdPartyFirewall(callback?: (err: AWSError, data: FMS.Types.DisassociateThirdPartyFirewallResponse) => void): Request<FMS.Types.DisassociateThirdPartyFirewallResponse, AWSError>;
  /**
   * Returns the Organizations account that is associated with Firewall Manager as the Firewall Manager default administrator.
   */
  getAdminAccount(params: FMS.Types.GetAdminAccountRequest, callback?: (err: AWSError, data: FMS.Types.GetAdminAccountResponse) => void): Request<FMS.Types.GetAdminAccountResponse, AWSError>;
  /**
   * Returns the Organizations account that is associated with Firewall Manager as the Firewall Manager default administrator.
   */
  getAdminAccount(callback?: (err: AWSError, data: FMS.Types.GetAdminAccountResponse) => void): Request<FMS.Types.GetAdminAccountResponse, AWSError>;
  /**
   * Returns information about the specified account's administrative scope. The admistrative scope defines the resources that an Firewall Manager administrator can manage.
   */
  getAdminScope(params: FMS.Types.GetAdminScopeRequest, callback?: (err: AWSError, data: FMS.Types.GetAdminScopeResponse) => void): Request<FMS.Types.GetAdminScopeResponse, AWSError>;
  /**
   * Returns information about the specified account's administrative scope. The admistrative scope defines the resources that an Firewall Manager administrator can manage.
   */
  getAdminScope(callback?: (err: AWSError, data: FMS.Types.GetAdminScopeResponse) => void): Request<FMS.Types.GetAdminScopeResponse, AWSError>;
  /**
   * Returns information about the specified Firewall Manager applications list.
   */
  getAppsList(params: FMS.Types.GetAppsListRequest, callback?: (err: AWSError, data: FMS.Types.GetAppsListResponse) => void): Request<FMS.Types.GetAppsListResponse, AWSError>;
  /**
   * Returns information about the specified Firewall Manager applications list.
   */
  getAppsList(callback?: (err: AWSError, data: FMS.Types.GetAppsListResponse) => void): Request<FMS.Types.GetAppsListResponse, AWSError>;
  /**
   * Returns detailed compliance information about the specified member account. Details include resources that are in and out of compliance with the specified policy.    Resources are considered noncompliant for WAF and Shield Advanced policies if the specified policy has not been applied to them.   Resources are considered noncompliant for security group policies if they are in scope of the policy, they violate one or more of the policy rules, and remediation is disabled or not possible.   Resources are considered noncompliant for Network Firewall policies if a firewall is missing in the VPC, if the firewall endpoint isn't set up in an expected Availability Zone and subnet, if a subnet created by the Firewall Manager doesn't have the expected route table, and for modifications to a firewall policy that violate the Firewall Manager policy's rules.   Resources are considered noncompliant for DNS Firewall policies if a DNS Firewall rule group is missing from the rule group associations for the VPC.   
   */
  getComplianceDetail(params: FMS.Types.GetComplianceDetailRequest, callback?: (err: AWSError, data: FMS.Types.GetComplianceDetailResponse) => void): Request<FMS.Types.GetComplianceDetailResponse, AWSError>;
  /**
   * Returns detailed compliance information about the specified member account. Details include resources that are in and out of compliance with the specified policy.    Resources are considered noncompliant for WAF and Shield Advanced policies if the specified policy has not been applied to them.   Resources are considered noncompliant for security group policies if they are in scope of the policy, they violate one or more of the policy rules, and remediation is disabled or not possible.   Resources are considered noncompliant for Network Firewall policies if a firewall is missing in the VPC, if the firewall endpoint isn't set up in an expected Availability Zone and subnet, if a subnet created by the Firewall Manager doesn't have the expected route table, and for modifications to a firewall policy that violate the Firewall Manager policy's rules.   Resources are considered noncompliant for DNS Firewall policies if a DNS Firewall rule group is missing from the rule group associations for the VPC.   
   */
  getComplianceDetail(callback?: (err: AWSError, data: FMS.Types.GetComplianceDetailResponse) => void): Request<FMS.Types.GetComplianceDetailResponse, AWSError>;
  /**
   * Information about the Amazon Simple Notification Service (SNS) topic that is used to record Firewall Manager SNS logs.
   */
  getNotificationChannel(params: FMS.Types.GetNotificationChannelRequest, callback?: (err: AWSError, data: FMS.Types.GetNotificationChannelResponse) => void): Request<FMS.Types.GetNotificationChannelResponse, AWSError>;
  /**
   * Information about the Amazon Simple Notification Service (SNS) topic that is used to record Firewall Manager SNS logs.
   */
  getNotificationChannel(callback?: (err: AWSError, data: FMS.Types.GetNotificationChannelResponse) => void): Request<FMS.Types.GetNotificationChannelResponse, AWSError>;
  /**
   * Returns information about the specified Firewall Manager policy.
   */
  getPolicy(params: FMS.Types.GetPolicyRequest, callback?: (err: AWSError, data: FMS.Types.GetPolicyResponse) => void): Request<FMS.Types.GetPolicyResponse, AWSError>;
  /**
   * Returns information about the specified Firewall Manager policy.
   */
  getPolicy(callback?: (err: AWSError, data: FMS.Types.GetPolicyResponse) => void): Request<FMS.Types.GetPolicyResponse, AWSError>;
  /**
   * If you created a Shield Advanced policy, returns policy-level attack summary information in the event of a potential DDoS attack. Other policy types are currently unsupported.
   */
  getProtectionStatus(params: FMS.Types.GetProtectionStatusRequest, callback?: (err: AWSError, data: FMS.Types.GetProtectionStatusResponse) => void): Request<FMS.Types.GetProtectionStatusResponse, AWSError>;
  /**
   * If you created a Shield Advanced policy, returns policy-level attack summary information in the event of a potential DDoS attack. Other policy types are currently unsupported.
   */
  getProtectionStatus(callback?: (err: AWSError, data: FMS.Types.GetProtectionStatusResponse) => void): Request<FMS.Types.GetProtectionStatusResponse, AWSError>;
  /**
   * Returns information about the specified Firewall Manager protocols list.
   */
  getProtocolsList(params: FMS.Types.GetProtocolsListRequest, callback?: (err: AWSError, data: FMS.Types.GetProtocolsListResponse) => void): Request<FMS.Types.GetProtocolsListResponse, AWSError>;
  /**
   * Returns information about the specified Firewall Manager protocols list.
   */
  getProtocolsList(callback?: (err: AWSError, data: FMS.Types.GetProtocolsListResponse) => void): Request<FMS.Types.GetProtocolsListResponse, AWSError>;
  /**
   * Gets information about a specific resource set.
   */
  getResourceSet(params: FMS.Types.GetResourceSetRequest, callback?: (err: AWSError, data: FMS.Types.GetResourceSetResponse) => void): Request<FMS.Types.GetResourceSetResponse, AWSError>;
  /**
   * Gets information about a specific resource set.
   */
  getResourceSet(callback?: (err: AWSError, data: FMS.Types.GetResourceSetResponse) => void): Request<FMS.Types.GetResourceSetResponse, AWSError>;
  /**
   * The onboarding status of a Firewall Manager admin account to third-party firewall vendor tenant.
   */
  getThirdPartyFirewallAssociationStatus(params: FMS.Types.GetThirdPartyFirewallAssociationStatusRequest, callback?: (err: AWSError, data: FMS.Types.GetThirdPartyFirewallAssociationStatusResponse) => void): Request<FMS.Types.GetThirdPartyFirewallAssociationStatusResponse, AWSError>;
  /**
   * The onboarding status of a Firewall Manager admin account to third-party firewall vendor tenant.
   */
  getThirdPartyFirewallAssociationStatus(callback?: (err: AWSError, data: FMS.Types.GetThirdPartyFirewallAssociationStatusResponse) => void): Request<FMS.Types.GetThirdPartyFirewallAssociationStatusResponse, AWSError>;
  /**
   * Retrieves violations for a resource based on the specified Firewall Manager policy and Amazon Web Services account.
   */
  getViolationDetails(params: FMS.Types.GetViolationDetailsRequest, callback?: (err: AWSError, data: FMS.Types.GetViolationDetailsResponse) => void): Request<FMS.Types.GetViolationDetailsResponse, AWSError>;
  /**
   * Retrieves violations for a resource based on the specified Firewall Manager policy and Amazon Web Services account.
   */
  getViolationDetails(callback?: (err: AWSError, data: FMS.Types.GetViolationDetailsResponse) => void): Request<FMS.Types.GetViolationDetailsResponse, AWSError>;
  /**
   * Returns a AdminAccounts object that lists the Firewall Manager administrators within the organization that are onboarded to Firewall Manager by AssociateAdminAccount. This operation can be called only from the organization's management account.
   */
  listAdminAccountsForOrganization(params: FMS.Types.ListAdminAccountsForOrganizationRequest, callback?: (err: AWSError, data: FMS.Types.ListAdminAccountsForOrganizationResponse) => void): Request<FMS.Types.ListAdminAccountsForOrganizationResponse, AWSError>;
  /**
   * Returns a AdminAccounts object that lists the Firewall Manager administrators within the organization that are onboarded to Firewall Manager by AssociateAdminAccount. This operation can be called only from the organization's management account.
   */
  listAdminAccountsForOrganization(callback?: (err: AWSError, data: FMS.Types.ListAdminAccountsForOrganizationResponse) => void): Request<FMS.Types.ListAdminAccountsForOrganizationResponse, AWSError>;
  /**
   * Lists the accounts that are managing the specified Organizations member account. This is useful for any member account so that they can view the accounts who are managing their account. This operation only returns the managing administrators that have the requested account within their AdminScope.
   */
  listAdminsManagingAccount(params: FMS.Types.ListAdminsManagingAccountRequest, callback?: (err: AWSError, data: FMS.Types.ListAdminsManagingAccountResponse) => void): Request<FMS.Types.ListAdminsManagingAccountResponse, AWSError>;
  /**
   * Lists the accounts that are managing the specified Organizations member account. This is useful for any member account so that they can view the accounts who are managing their account. This operation only returns the managing administrators that have the requested account within their AdminScope.
   */
  listAdminsManagingAccount(callback?: (err: AWSError, data: FMS.Types.ListAdminsManagingAccountResponse) => void): Request<FMS.Types.ListAdminsManagingAccountResponse, AWSError>;
  /**
   * Returns an array of AppsListDataSummary objects.
   */
  listAppsLists(params: FMS.Types.ListAppsListsRequest, callback?: (err: AWSError, data: FMS.Types.ListAppsListsResponse) => void): Request<FMS.Types.ListAppsListsResponse, AWSError>;
  /**
   * Returns an array of AppsListDataSummary objects.
   */
  listAppsLists(callback?: (err: AWSError, data: FMS.Types.ListAppsListsResponse) => void): Request<FMS.Types.ListAppsListsResponse, AWSError>;
  /**
   * Returns an array of PolicyComplianceStatus objects. Use PolicyComplianceStatus to get a summary of which member accounts are protected by the specified policy. 
   */
  listComplianceStatus(params: FMS.Types.ListComplianceStatusRequest, callback?: (err: AWSError, data: FMS.Types.ListComplianceStatusResponse) => void): Request<FMS.Types.ListComplianceStatusResponse, AWSError>;
  /**
   * Returns an array of PolicyComplianceStatus objects. Use PolicyComplianceStatus to get a summary of which member accounts are protected by the specified policy. 
   */
  listComplianceStatus(callback?: (err: AWSError, data: FMS.Types.ListComplianceStatusResponse) => void): Request<FMS.Types.ListComplianceStatusResponse, AWSError>;
  /**
   * Returns an array of resources in the organization's accounts that are available to be associated with a resource set.
   */
  listDiscoveredResources(params: FMS.Types.ListDiscoveredResourcesRequest, callback?: (err: AWSError, data: FMS.Types.ListDiscoveredResourcesResponse) => void): Request<FMS.Types.ListDiscoveredResourcesResponse, AWSError>;
  /**
   * Returns an array of resources in the organization's accounts that are available to be associated with a resource set.
   */
  listDiscoveredResources(callback?: (err: AWSError, data: FMS.Types.ListDiscoveredResourcesResponse) => void): Request<FMS.Types.ListDiscoveredResourcesResponse, AWSError>;
  /**
   * Returns a MemberAccounts object that lists the member accounts in the administrator's Amazon Web Services organization. Either an Firewall Manager administrator or the organization's management account can make this request.
   */
  listMemberAccounts(params: FMS.Types.ListMemberAccountsRequest, callback?: (err: AWSError, data: FMS.Types.ListMemberAccountsResponse) => void): Request<FMS.Types.ListMemberAccountsResponse, AWSError>;
  /**
   * Returns a MemberAccounts object that lists the member accounts in the administrator's Amazon Web Services organization. Either an Firewall Manager administrator or the organization's management account can make this request.
   */
  listMemberAccounts(callback?: (err: AWSError, data: FMS.Types.ListMemberAccountsResponse) => void): Request<FMS.Types.ListMemberAccountsResponse, AWSError>;
  /**
   * Returns an array of PolicySummary objects.
   */
  listPolicies(params: FMS.Types.ListPoliciesRequest, callback?: (err: AWSError, data: FMS.Types.ListPoliciesResponse) => void): Request<FMS.Types.ListPoliciesResponse, AWSError>;
  /**
   * Returns an array of PolicySummary objects.
   */
  listPolicies(callback?: (err: AWSError, data: FMS.Types.ListPoliciesResponse) => void): Request<FMS.Types.ListPoliciesResponse, AWSError>;
  /**
   * Returns an array of ProtocolsListDataSummary objects.
   */
  listProtocolsLists(params: FMS.Types.ListProtocolsListsRequest, callback?: (err: AWSError, data: FMS.Types.ListProtocolsListsResponse) => void): Request<FMS.Types.ListProtocolsListsResponse, AWSError>;
  /**
   * Returns an array of ProtocolsListDataSummary objects.
   */
  listProtocolsLists(callback?: (err: AWSError, data: FMS.Types.ListProtocolsListsResponse) => void): Request<FMS.Types.ListProtocolsListsResponse, AWSError>;
  /**
   * Returns an array of resources that are currently associated to a resource set.
   */
  listResourceSetResources(params: FMS.Types.ListResourceSetResourcesRequest, callback?: (err: AWSError, data: FMS.Types.ListResourceSetResourcesResponse) => void): Request<FMS.Types.ListResourceSetResourcesResponse, AWSError>;
  /**
   * Returns an array of resources that are currently associated to a resource set.
   */
  listResourceSetResources(callback?: (err: AWSError, data: FMS.Types.ListResourceSetResourcesResponse) => void): Request<FMS.Types.ListResourceSetResourcesResponse, AWSError>;
  /**
   * Returns an array of ResourceSetSummary objects.
   */
  listResourceSets(params: FMS.Types.ListResourceSetsRequest, callback?: (err: AWSError, data: FMS.Types.ListResourceSetsResponse) => void): Request<FMS.Types.ListResourceSetsResponse, AWSError>;
  /**
   * Returns an array of ResourceSetSummary objects.
   */
  listResourceSets(callback?: (err: AWSError, data: FMS.Types.ListResourceSetsResponse) => void): Request<FMS.Types.ListResourceSetsResponse, AWSError>;
  /**
   * Retrieves the list of tags for the specified Amazon Web Services resource. 
   */
  listTagsForResource(params: FMS.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: FMS.Types.ListTagsForResourceResponse) => void): Request<FMS.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves the list of tags for the specified Amazon Web Services resource. 
   */
  listTagsForResource(callback?: (err: AWSError, data: FMS.Types.ListTagsForResourceResponse) => void): Request<FMS.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves a list of all of the third-party firewall policies that are associated with the third-party firewall administrator's account.
   */
  listThirdPartyFirewallFirewallPolicies(params: FMS.Types.ListThirdPartyFirewallFirewallPoliciesRequest, callback?: (err: AWSError, data: FMS.Types.ListThirdPartyFirewallFirewallPoliciesResponse) => void): Request<FMS.Types.ListThirdPartyFirewallFirewallPoliciesResponse, AWSError>;
  /**
   * Retrieves a list of all of the third-party firewall policies that are associated with the third-party firewall administrator's account.
   */
  listThirdPartyFirewallFirewallPolicies(callback?: (err: AWSError, data: FMS.Types.ListThirdPartyFirewallFirewallPoliciesResponse) => void): Request<FMS.Types.ListThirdPartyFirewallFirewallPoliciesResponse, AWSError>;
  /**
   * Creates or updates an Firewall Manager administrator account. The account must be a member of the organization that was onboarded to Firewall Manager by AssociateAdminAccount. Only the organization's management account can create an Firewall Manager administrator account. When you create an Firewall Manager administrator account, the service checks to see if the account is already a delegated administrator within Organizations. If the account isn't a delegated administrator, Firewall Manager calls Organizations to delegate the account within Organizations. For more information about administrator accounts within Organizations, see Managing the Amazon Web Services Accounts in Your Organization.
   */
  putAdminAccount(params: FMS.Types.PutAdminAccountRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or updates an Firewall Manager administrator account. The account must be a member of the organization that was onboarded to Firewall Manager by AssociateAdminAccount. Only the organization's management account can create an Firewall Manager administrator account. When you create an Firewall Manager administrator account, the service checks to see if the account is already a delegated administrator within Organizations. If the account isn't a delegated administrator, Firewall Manager calls Organizations to delegate the account within Organizations. For more information about administrator accounts within Organizations, see Managing the Amazon Web Services Accounts in Your Organization.
   */
  putAdminAccount(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates an Firewall Manager applications list.
   */
  putAppsList(params: FMS.Types.PutAppsListRequest, callback?: (err: AWSError, data: FMS.Types.PutAppsListResponse) => void): Request<FMS.Types.PutAppsListResponse, AWSError>;
  /**
   * Creates an Firewall Manager applications list.
   */
  putAppsList(callback?: (err: AWSError, data: FMS.Types.PutAppsListResponse) => void): Request<FMS.Types.PutAppsListResponse, AWSError>;
  /**
   * Designates the IAM role and Amazon Simple Notification Service (SNS) topic that Firewall Manager uses to record SNS logs. To perform this action outside of the console, you must first configure the SNS topic's access policy to allow the SnsRoleName to publish SNS logs. If the SnsRoleName provided is a role other than the AWSServiceRoleForFMS service-linked role, this role must have a trust relationship configured to allow the Firewall Manager service principal fms.amazonaws.com to assume this role. For information about configuring an SNS access policy, see Service roles for Firewall Manager in the Firewall Manager Developer Guide.
   */
  putNotificationChannel(params: FMS.Types.PutNotificationChannelRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Designates the IAM role and Amazon Simple Notification Service (SNS) topic that Firewall Manager uses to record SNS logs. To perform this action outside of the console, you must first configure the SNS topic's access policy to allow the SnsRoleName to publish SNS logs. If the SnsRoleName provided is a role other than the AWSServiceRoleForFMS service-linked role, this role must have a trust relationship configured to allow the Firewall Manager service principal fms.amazonaws.com to assume this role. For information about configuring an SNS access policy, see Service roles for Firewall Manager in the Firewall Manager Developer Guide.
   */
  putNotificationChannel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates an Firewall Manager policy. Firewall Manager provides the following types of policies:    An WAF policy (type WAFV2), which defines rule groups to run first in the corresponding WAF web ACL and rule groups to run last in the web ACL.   An WAF Classic policy (type WAF), which defines a rule group.    A Shield Advanced policy, which applies Shield Advanced protection to specified accounts and resources.   A security group policy, which manages VPC security groups across your Amazon Web Services organization.    An Network Firewall policy, which provides firewall rules to filter network traffic in specified Amazon VPCs.   A DNS Firewall policy, which provides Route 53 Resolver DNS Firewall rules to filter DNS queries for specified VPCs.   Each policy is specific to one of the types. If you want to enforce more than one policy type across accounts, create multiple policies. You can create multiple policies for each type. You must be subscribed to Shield Advanced to create a Shield Advanced policy. For more information about subscribing to Shield Advanced, see CreateSubscription.
   */
  putPolicy(params: FMS.Types.PutPolicyRequest, callback?: (err: AWSError, data: FMS.Types.PutPolicyResponse) => void): Request<FMS.Types.PutPolicyResponse, AWSError>;
  /**
   * Creates an Firewall Manager policy. Firewall Manager provides the following types of policies:    An WAF policy (type WAFV2), which defines rule groups to run first in the corresponding WAF web ACL and rule groups to run last in the web ACL.   An WAF Classic policy (type WAF), which defines a rule group.    A Shield Advanced policy, which applies Shield Advanced protection to specified accounts and resources.   A security group policy, which manages VPC security groups across your Amazon Web Services organization.    An Network Firewall policy, which provides firewall rules to filter network traffic in specified Amazon VPCs.   A DNS Firewall policy, which provides Route 53 Resolver DNS Firewall rules to filter DNS queries for specified VPCs.   Each policy is specific to one of the types. If you want to enforce more than one policy type across accounts, create multiple policies. You can create multiple policies for each type. You must be subscribed to Shield Advanced to create a Shield Advanced policy. For more information about subscribing to Shield Advanced, see CreateSubscription.
   */
  putPolicy(callback?: (err: AWSError, data: FMS.Types.PutPolicyResponse) => void): Request<FMS.Types.PutPolicyResponse, AWSError>;
  /**
   * Creates an Firewall Manager protocols list.
   */
  putProtocolsList(params: FMS.Types.PutProtocolsListRequest, callback?: (err: AWSError, data: FMS.Types.PutProtocolsListResponse) => void): Request<FMS.Types.PutProtocolsListResponse, AWSError>;
  /**
   * Creates an Firewall Manager protocols list.
   */
  putProtocolsList(callback?: (err: AWSError, data: FMS.Types.PutProtocolsListResponse) => void): Request<FMS.Types.PutProtocolsListResponse, AWSError>;
  /**
   * Creates the resource set. An Firewall Manager resource set defines the resources to import into an Firewall Manager policy from another Amazon Web Services service.
   */
  putResourceSet(params: FMS.Types.PutResourceSetRequest, callback?: (err: AWSError, data: FMS.Types.PutResourceSetResponse) => void): Request<FMS.Types.PutResourceSetResponse, AWSError>;
  /**
   * Creates the resource set. An Firewall Manager resource set defines the resources to import into an Firewall Manager policy from another Amazon Web Services service.
   */
  putResourceSet(callback?: (err: AWSError, data: FMS.Types.PutResourceSetResponse) => void): Request<FMS.Types.PutResourceSetResponse, AWSError>;
  /**
   * Adds one or more tags to an Amazon Web Services resource.
   */
  tagResource(params: FMS.Types.TagResourceRequest, callback?: (err: AWSError, data: FMS.Types.TagResourceResponse) => void): Request<FMS.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more tags to an Amazon Web Services resource.
   */
  tagResource(callback?: (err: AWSError, data: FMS.Types.TagResourceResponse) => void): Request<FMS.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from an Amazon Web Services resource.
   */
  untagResource(params: FMS.Types.UntagResourceRequest, callback?: (err: AWSError, data: FMS.Types.UntagResourceResponse) => void): Request<FMS.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from an Amazon Web Services resource.
   */
  untagResource(callback?: (err: AWSError, data: FMS.Types.UntagResourceResponse) => void): Request<FMS.Types.UntagResourceResponse, AWSError>;
}
declare namespace FMS {
  export type AWSAccountId = string;
  export type AWSAccountIdList = AWSAccountId[];
  export type AWSRegion = string;
  export type AWSRegionList = AWSRegion[];
  export type AccountIdList = AWSAccountId[];
  export type AccountRoleStatus = "READY"|"CREATING"|"PENDING_DELETION"|"DELETING"|"DELETED"|string;
  export interface AccountScope {
    /**
     * The list of accounts within the organization that the specified Firewall Manager administrator either can or cannot apply policies to, based on the value of ExcludeSpecifiedAccounts. If ExcludeSpecifiedAccounts is set to true, then the Firewall Manager administrator can apply policies to all members of the organization except for the accounts in this list. If ExcludeSpecifiedAccounts is set to false, then the Firewall Manager administrator can only apply policies to the accounts in this list.
     */
    Accounts?: AccountIdList;
    /**
     * A boolean value that indicates if the administrator can apply policies to all accounts within an organization. If true, the administrator can apply policies to all accounts within the organization. You can either enable management of all accounts through this operation, or you can specify a list of accounts to manage in AccountScope$Accounts. You cannot specify both.
     */
    AllAccountsEnabled?: Boolean;
    /**
     * A boolean value that excludes the accounts in AccountScope$Accounts from the administrator's scope. If true, the Firewall Manager administrator can apply policies to all members of the organization except for the accounts listed in AccountScope$Accounts. You can either specify a list of accounts to exclude by AccountScope$Accounts, or you can enable management of all accounts by AccountScope$AllAccountsEnabled. You cannot specify both.
     */
    ExcludeSpecifiedAccounts?: Boolean;
  }
  export interface ActionTarget {
    /**
     * The ID of the remediation target.
     */
    ResourceId?: ResourceId;
    /**
     * A description of the remediation action target.
     */
    Description?: LengthBoundedString;
  }
  export interface AdminAccountSummary {
    /**
     * The Amazon Web Services account ID of the Firewall Manager administrator's account.
     */
    AdminAccount?: AWSAccountId;
    /**
     * A boolean value that indicates if the administrator is the default administrator. If true, then this is the default administrator account. The default administrator can manage third-party firewalls and has full administrative scope. There is only one default administrator account per organization. For information about Firewall Manager default administrator accounts, see Managing Firewall Manager administrators in the Firewall Manager Developer Guide.
     */
    DefaultAdmin?: Boolean;
    /**
     * The current status of the request to onboard a member account as an Firewall Manager administator.    ONBOARDING - The account is onboarding to Firewall Manager as an administrator.    ONBOARDING_COMPLETE - Firewall Manager The account is onboarded to Firewall Manager as an administrator, and can perform actions on the resources defined in their AdminScope.    OFFBOARDING - The account is being removed as an Firewall Manager administrator.    OFFBOARDING_COMPLETE - The account has been removed as an Firewall Manager administrator.  
     */
    Status?: OrganizationStatus;
  }
  export type AdminAccountSummaryList = AdminAccountSummary[];
  export interface AdminScope {
    /**
     * Defines the accounts that the specified Firewall Manager administrator can apply policies to.
     */
    AccountScope?: AccountScope;
    /**
     * Defines the Organizations organizational units that the specified Firewall Manager administrator can apply policies to. For more information about OUs in Organizations, see Managing organizational units (OUs)  in the Organizations User Guide.
     */
    OrganizationalUnitScope?: OrganizationalUnitScope;
    /**
     * Defines the Amazon Web Services Regions that the specified Firewall Manager administrator can perform actions in.
     */
    RegionScope?: RegionScope;
    /**
     * Defines the Firewall Manager policy types that the specified Firewall Manager administrator can create and manage.
     */
    PolicyTypeScope?: PolicyTypeScope;
  }
  export interface App {
    /**
     * The application's name.
     */
    AppName: ResourceName;
    /**
     * The IP protocol name or number. The name can be one of tcp, udp, or icmp. For information on possible numbers, see Protocol Numbers.
     */
    Protocol: Protocol;
    /**
     * The application's port number, for example 80.
     */
    Port: IPPortNumber;
  }
  export type AppsList = App[];
  export interface AppsListData {
    /**
     * The ID of the Firewall Manager applications list.
     */
    ListId?: ListId;
    /**
     * The name of the Firewall Manager applications list.
     */
    ListName: ResourceName;
    /**
     * A unique identifier for each update to the list. When you update the list, the update token must match the token of the current version of the application list. You can retrieve the update token by getting the list. 
     */
    ListUpdateToken?: UpdateToken;
    /**
     * The time that the Firewall Manager applications list was created.
     */
    CreateTime?: TimeStamp;
    /**
     * The time that the Firewall Manager applications list was last updated.
     */
    LastUpdateTime?: TimeStamp;
    /**
     * An array of applications in the Firewall Manager applications list.
     */
    AppsList: AppsList;
    /**
     * A map of previous version numbers to their corresponding App object arrays.
     */
    PreviousAppsList?: PreviousAppsList;
  }
  export interface AppsListDataSummary {
    /**
     * The Amazon Resource Name (ARN) of the applications list.
     */
    ListArn?: ResourceArn;
    /**
     * The ID of the applications list.
     */
    ListId?: ListId;
    /**
     * The name of the applications list.
     */
    ListName?: ResourceName;
    /**
     * An array of App objects in the Firewall Manager applications list.
     */
    AppsList?: AppsList;
  }
  export type AppsListsData = AppsListDataSummary[];
  export interface AssociateAdminAccountRequest {
    /**
     * The Amazon Web Services account ID to associate with Firewall Manager as the Firewall Manager default administrator account. This account must be a member account of the organization in Organizations whose resources you want to protect. For more information about Organizations, see Managing the Amazon Web Services Accounts in Your Organization. 
     */
    AdminAccount: AWSAccountId;
  }
  export interface AssociateThirdPartyFirewallRequest {
    /**
     * The name of the third-party firewall vendor.
     */
    ThirdPartyFirewall: ThirdPartyFirewall;
  }
  export interface AssociateThirdPartyFirewallResponse {
    /**
     * The current status for setting a Firewall Manager policy administrator's account as an administrator of the third-party firewall tenant.    ONBOARDING - The Firewall Manager policy administrator is being designated as a tenant administrator.    ONBOARD_COMPLETE - The Firewall Manager policy administrator is designated as a tenant administrator.    OFFBOARDING - The Firewall Manager policy administrator is being removed as a tenant administrator.    OFFBOARD_COMPLETE - The Firewall Manager policy administrator has been removed as a tenant administrator.    NOT_EXIST - The Firewall Manager policy administrator doesn't exist as a tenant administrator.  
     */
    ThirdPartyFirewallStatus?: ThirdPartyFirewallAssociationStatus;
  }
  export interface AwsEc2InstanceViolation {
    /**
     * The resource ID of the EC2 instance.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * Violation detail for network interfaces associated with the EC2 instance.
     */
    AwsEc2NetworkInterfaceViolations?: AwsEc2NetworkInterfaceViolations;
  }
  export interface AwsEc2NetworkInterfaceViolation {
    /**
     * The resource ID of the network interface.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * List of security groups that violate the rules specified in the primary security group of the Firewall Manager policy.
     */
    ViolatingSecurityGroups?: ResourceIdList;
  }
  export type AwsEc2NetworkInterfaceViolations = AwsEc2NetworkInterfaceViolation[];
  export interface AwsVPCSecurityGroupViolation {
    /**
     * The security group rule that is being evaluated.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * A description of the security group that violates the policy.
     */
    ViolationTargetDescription?: LengthBoundedString;
    /**
     * List of rules specified in the security group of the Firewall Manager policy that partially match the ViolationTarget rule.
     */
    PartialMatches?: PartialMatches;
    /**
     * Remediation options for the rule specified in the ViolationTarget.
     */
    PossibleSecurityGroupRemediationActions?: SecurityGroupRemediationActions;
  }
  export type Base62Id = string;
  export type BasicInteger = number;
  export interface BatchAssociateResourceRequest {
    /**
     * A unique identifier for the resource set, used in a request to refer to the resource set.
     */
    ResourceSetIdentifier: Identifier;
    /**
     * The uniform resource identifiers (URIs) of resources that should be associated to the resource set. The URIs must be Amazon Resource Names (ARNs).
     */
    Items: IdentifierList;
  }
  export interface BatchAssociateResourceResponse {
    /**
     * A unique identifier for the resource set, used in a request to refer to the resource set.
     */
    ResourceSetIdentifier: Identifier;
    /**
     * The resources that failed to associate to the resource set.
     */
    FailedItems: FailedItemList;
  }
  export interface BatchDisassociateResourceRequest {
    /**
     * A unique identifier for the resource set, used in a request to refer to the resource set.
     */
    ResourceSetIdentifier: Identifier;
    /**
     * The uniform resource identifiers (URI) of resources that should be disassociated from the resource set. The URIs must be Amazon Resource Names (ARNs).
     */
    Items: IdentifierList;
  }
  export interface BatchDisassociateResourceResponse {
    /**
     * A unique identifier for the resource set, used in a request to refer to the resource set.
     */
    ResourceSetIdentifier: Identifier;
    /**
     * The resources that failed to disassociate from the resource set.
     */
    FailedItems: FailedItemList;
  }
  export type Boolean = boolean;
  export type CIDR = string;
  export interface ComplianceViolator {
    /**
     * The resource ID.
     */
    ResourceId?: ResourceId;
    /**
     * The reason that the resource is not protected by the policy.
     */
    ViolationReason?: ViolationReason;
    /**
     * The resource type. This is in the format shown in the Amazon Web Services Resource Types Reference. For example: AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::CloudFront::Distribution, or AWS::NetworkFirewall::FirewallPolicy.
     */
    ResourceType?: ResourceType;
    /**
     * Metadata about the resource that doesn't comply with the policy scope.
     */
    Metadata?: ComplianceViolatorMetadata;
  }
  export type ComplianceViolatorMetadata = {[key: string]: LengthBoundedString};
  export type ComplianceViolators = ComplianceViolator[];
  export type CustomerPolicyScopeId = string;
  export type CustomerPolicyScopeIdList = CustomerPolicyScopeId[];
  export type CustomerPolicyScopeIdType = "ACCOUNT"|"ORG_UNIT"|string;
  export type CustomerPolicyScopeMap = {[key: string]: CustomerPolicyScopeIdList};
  export type CustomerPolicyStatus = "ACTIVE"|"OUT_OF_ADMIN_SCOPE"|string;
  export interface DeleteAppsListRequest {
    /**
     * The ID of the applications list that you want to delete. You can retrieve this ID from PutAppsList, ListAppsLists, and GetAppsList.
     */
    ListId: ListId;
  }
  export interface DeleteNotificationChannelRequest {
  }
  export interface DeletePolicyRequest {
    /**
     * The ID of the policy that you want to delete. You can retrieve this ID from PutPolicy and ListPolicies.
     */
    PolicyId: PolicyId;
    /**
     * If True, the request performs cleanup according to the policy type.  For WAF and Shield Advanced policies, the cleanup does the following:   Deletes rule groups created by Firewall Manager   Removes web ACLs from in-scope resources   Deletes web ACLs that contain no rules or rule groups   For security group policies, the cleanup does the following for each security group in the policy:   Disassociates the security group from in-scope resources    Deletes the security group if it was created through Firewall Manager and if it's no longer associated with any resources through another policy   After the cleanup, in-scope resources are no longer protected by web ACLs in this policy. Protection of out-of-scope resources remains unchanged. Scope is determined by tags that you create and accounts that you associate with the policy. When creating the policy, if you specify that only resources in specific accounts or with specific tags are in scope of the policy, those accounts and resources are handled by the policy. All others are out of scope. If you don't specify tags or accounts, all resources are in scope. 
     */
    DeleteAllPolicyResources?: Boolean;
  }
  export interface DeleteProtocolsListRequest {
    /**
     * The ID of the protocols list that you want to delete. You can retrieve this ID from PutProtocolsList, ListProtocolsLists, and GetProtocolsLost.
     */
    ListId: ListId;
  }
  export interface DeleteResourceSetRequest {
    /**
     * A unique identifier for the resource set, used in a request to refer to the resource set.
     */
    Identifier: Base62Id;
  }
  export type DependentServiceName = "AWSCONFIG"|"AWSWAF"|"AWSSHIELD_ADVANCED"|"AWSVPC"|string;
  export type Description = string;
  export type DestinationType = "IPV4"|"IPV6"|"PREFIX_LIST"|string;
  export type DetailedInfo = string;
  export interface DisassociateAdminAccountRequest {
  }
  export interface DisassociateThirdPartyFirewallRequest {
    /**
     * The name of the third-party firewall vendor.
     */
    ThirdPartyFirewall: ThirdPartyFirewall;
  }
  export interface DisassociateThirdPartyFirewallResponse {
    /**
     * The current status for the disassociation of a Firewall Manager administrators account with a third-party firewall.
     */
    ThirdPartyFirewallStatus?: ThirdPartyFirewallAssociationStatus;
  }
  export interface DiscoveredResource {
    /**
     * The universal resource identifier (URI) of the discovered resource.
     */
    URI?: Identifier;
    /**
     * The Amazon Web Services account ID associated with the discovered resource.
     */
    AccountId?: AWSAccountId;
    /**
     * The type of the discovered resource.
     */
    Type?: ResourceType;
    /**
     * The name of the discovered resource.
     */
    Name?: ResourceName;
  }
  export type DiscoveredResourceList = DiscoveredResource[];
  export interface DnsDuplicateRuleGroupViolation {
    /**
     * Information about the VPC ID. 
     */
    ViolationTarget?: ViolationTarget;
    /**
     * A description of the violation that specifies the rule group and VPC.
     */
    ViolationTargetDescription?: LengthBoundedString;
  }
  export interface DnsRuleGroupLimitExceededViolation {
    /**
     * Information about the VPC ID. 
     */
    ViolationTarget?: ViolationTarget;
    /**
     * A description of the violation that specifies the rule group and VPC.
     */
    ViolationTargetDescription?: LengthBoundedString;
    /**
     * The number of rule groups currently associated with the VPC. 
     */
    NumberOfRuleGroupsAlreadyAssociated?: BasicInteger;
  }
  export type DnsRuleGroupPriorities = DnsRuleGroupPriority[];
  export type DnsRuleGroupPriority = number;
  export interface DnsRuleGroupPriorityConflictViolation {
    /**
     * Information about the VPC ID. 
     */
    ViolationTarget?: ViolationTarget;
    /**
     * A description of the violation that specifies the VPC and the rule group that's already associated with it.
     */
    ViolationTargetDescription?: LengthBoundedString;
    /**
     * The priority setting of the two conflicting rule groups.
     */
    ConflictingPriority?: DnsRuleGroupPriority;
    /**
     * The ID of the Firewall Manager DNS Firewall policy that was already applied to the VPC. This policy contains the rule group that's already associated with the VPC. 
     */
    ConflictingPolicyId?: PolicyId;
    /**
     * The priorities of rule groups that are already associated with the VPC. To retry your operation, choose priority settings that aren't in this list for the rule groups in your new DNS Firewall policy. 
     */
    UnavailablePriorities?: DnsRuleGroupPriorities;
  }
  export interface EC2AssociateRouteTableAction {
    /**
     * A description of the EC2 route table that is associated with the remediation action.
     */
    Description?: LengthBoundedString;
    /**
     * The ID of the EC2 route table that is associated with the remediation action.
     */
    RouteTableId: ActionTarget;
    /**
     * The ID of the subnet for the EC2 route table that is associated with the remediation action.
     */
    SubnetId?: ActionTarget;
    /**
     * The ID of the gateway to be used with the EC2 route table that is associated with the remediation action.
     */
    GatewayId?: ActionTarget;
  }
  export interface EC2CopyRouteTableAction {
    /**
     * A description of the copied EC2 route table that is associated with the remediation action.
     */
    Description?: LengthBoundedString;
    /**
     * The VPC ID of the copied EC2 route table that is associated with the remediation action.
     */
    VpcId: ActionTarget;
    /**
     * The ID of the copied EC2 route table that is associated with the remediation action.
     */
    RouteTableId: ActionTarget;
  }
  export interface EC2CreateRouteAction {
    /**
     * A description of CreateRoute action in Amazon EC2.
     */
    Description?: LengthBoundedString;
    /**
     * Information about the IPv4 CIDR address block used for the destination match.
     */
    DestinationCidrBlock?: CIDR;
    /**
     * Information about the ID of a prefix list used for the destination match.
     */
    DestinationPrefixListId?: ResourceId;
    /**
     * Information about the IPv6 CIDR block destination.
     */
    DestinationIpv6CidrBlock?: CIDR;
    /**
     * Information about the ID of a VPC endpoint. Supported for Gateway Load Balancer endpoints only.
     */
    VpcEndpointId?: ActionTarget;
    /**
     * Information about the ID of an internet gateway or virtual private gateway attached to your VPC.
     */
    GatewayId?: ActionTarget;
    /**
     * Information about the ID of the route table for the route.
     */
    RouteTableId: ActionTarget;
  }
  export interface EC2CreateRouteTableAction {
    /**
     * A description of the CreateRouteTable action.
     */
    Description?: LengthBoundedString;
    /**
     * Information about the ID of a VPC.
     */
    VpcId: ActionTarget;
  }
  export interface EC2DeleteRouteAction {
    /**
     * A description of the DeleteRoute action.
     */
    Description?: LengthBoundedString;
    /**
     * Information about the IPv4 CIDR range for the route. The value you specify must match the CIDR for the route exactly.
     */
    DestinationCidrBlock?: CIDR;
    /**
     * Information about the ID of the prefix list for the route.
     */
    DestinationPrefixListId?: ResourceId;
    /**
     * Information about the IPv6 CIDR range for the route. The value you specify must match the CIDR for the route exactly.
     */
    DestinationIpv6CidrBlock?: CIDR;
    /**
     * Information about the ID of the route table.
     */
    RouteTableId: ActionTarget;
  }
  export interface EC2ReplaceRouteAction {
    /**
     * A description of the ReplaceRoute action in Amazon EC2.
     */
    Description?: LengthBoundedString;
    /**
     * Information about the IPv4 CIDR address block used for the destination match. The value that you provide must match the CIDR of an existing route in the table.
     */
    DestinationCidrBlock?: CIDR;
    /**
     * Information about the ID of the prefix list for the route.
     */
    DestinationPrefixListId?: ResourceId;
    /**
     * Information about the IPv6 CIDR address block used for the destination match. The value that you provide must match the CIDR of an existing route in the table.
     */
    DestinationIpv6CidrBlock?: CIDR;
    /**
     * Information about the ID of an internet gateway or virtual private gateway.
     */
    GatewayId?: ActionTarget;
    /**
     * Information about the ID of the route table.
     */
    RouteTableId: ActionTarget;
  }
  export interface EC2ReplaceRouteTableAssociationAction {
    /**
     * A description of the ReplaceRouteTableAssociation action in Amazon EC2.
     */
    Description?: LengthBoundedString;
    /**
     * Information about the association ID.
     */
    AssociationId: ActionTarget;
    /**
     * Information about the ID of the new route table to associate with the subnet.
     */
    RouteTableId: ActionTarget;
  }
  export interface EvaluationResult {
    /**
     * Describes an Amazon Web Services account's compliance with the Firewall Manager policy.
     */
    ComplianceStatus?: PolicyComplianceStatusType;
    /**
     * The number of resources that are noncompliant with the specified policy. For WAF and Shield Advanced policies, a resource is considered noncompliant if it is not associated with the policy. For security group policies, a resource is considered noncompliant if it doesn't comply with the rules of the policy and remediation is disabled or not possible.
     */
    ViolatorCount?: ResourceCount;
    /**
     * Indicates that over 100 resources are noncompliant with the Firewall Manager policy.
     */
    EvaluationLimitExceeded?: Boolean;
  }
  export type EvaluationResults = EvaluationResult[];
  export interface ExpectedRoute {
    /**
     * Information about the IPv4 CIDR block.
     */
    IpV4Cidr?: CIDR;
    /**
     * Information about the ID of the prefix list for the route.
     */
    PrefixListId?: CIDR;
    /**
     * Information about the IPv6 CIDR block.
     */
    IpV6Cidr?: CIDR;
    /**
     * Information about the contributing subnets.
     */
    ContributingSubnets?: ResourceIdList;
    /**
     * Information about the allowed targets.
     */
    AllowedTargets?: LengthBoundedStringList;
    /**
     * Information about the route table ID.
     */
    RouteTableId?: ResourceId;
  }
  export type ExpectedRoutes = ExpectedRoute[];
  export interface FMSPolicyUpdateFirewallCreationConfigAction {
    /**
     * Describes the remedial action.
     */
    Description?: LengthBoundedString;
    /**
     * A FirewallCreationConfig that you can copy into your current policy's SecurityServiceData in order to remedy scope violations.
     */
    FirewallCreationConfig?: ManagedServiceData;
  }
  export interface FailedItem {
    /**
     * The univeral resource indicator (URI) of the resource that failed.
     */
    URI?: Identifier;
    /**
     * The reason the resource's association could not be updated.
     */
    Reason?: FailedItemReason;
  }
  export type FailedItemList = FailedItem[];
  export type FailedItemReason = "NOT_VALID_ARN"|"NOT_VALID_PARTITION"|"NOT_VALID_REGION"|"NOT_VALID_SERVICE"|"NOT_VALID_RESOURCE_TYPE"|"NOT_VALID_ACCOUNT_ID"|string;
  export type FirewallDeploymentModel = "CENTRALIZED"|"DISTRIBUTED"|string;
  export type FirewallPolicyId = string;
  export type FirewallPolicyName = string;
  export interface FirewallSubnetIsOutOfScopeViolation {
    /**
     * The ID of the firewall subnet that violates the policy scope.
     */
    FirewallSubnetId?: ResourceId;
    /**
     * The VPC ID of the firewall subnet that violates the policy scope.
     */
    VpcId?: ResourceId;
    /**
     * The Availability Zone of the firewall subnet that violates the policy scope.
     */
    SubnetAvailabilityZone?: LengthBoundedString;
    /**
     * The Availability Zone ID of the firewall subnet that violates the policy scope.
     */
    SubnetAvailabilityZoneId?: LengthBoundedString;
    /**
     * The VPC endpoint ID of the firewall subnet that violates the policy scope.
     */
    VpcEndpointId?: ResourceId;
  }
  export interface FirewallSubnetMissingVPCEndpointViolation {
    /**
     * The ID of the firewall that this VPC endpoint is associated with.
     */
    FirewallSubnetId?: ResourceId;
    /**
     * The resource ID of the VPC associated with the deleted VPC subnet.
     */
    VpcId?: ResourceId;
    /**
     * The name of the Availability Zone of the deleted VPC subnet.
     */
    SubnetAvailabilityZone?: LengthBoundedString;
    /**
     * The ID of the Availability Zone of the deleted VPC subnet.
     */
    SubnetAvailabilityZoneId?: LengthBoundedString;
  }
  export interface GetAdminAccountRequest {
  }
  export interface GetAdminAccountResponse {
    /**
     * The account that is set as the Firewall Manager default administrator.
     */
    AdminAccount?: AWSAccountId;
    /**
     * The status of the account that you set as the Firewall Manager default administrator.
     */
    RoleStatus?: AccountRoleStatus;
  }
  export interface GetAdminScopeRequest {
    /**
     * The administator account that you want to get the details for.
     */
    AdminAccount: AWSAccountId;
  }
  export interface GetAdminScopeResponse {
    /**
     * Contains details about the administrative scope of the requested account.
     */
    AdminScope?: AdminScope;
    /**
     * The current status of the request to onboard a member account as an Firewall Manager administator.    ONBOARDING - The account is onboarding to Firewall Manager as an administrator.    ONBOARDING_COMPLETE - Firewall Manager The account is onboarded to Firewall Manager as an administrator, and can perform actions on the resources defined in their AdminScope.    OFFBOARDING - The account is being removed as an Firewall Manager administrator.    OFFBOARDING_COMPLETE - The account has been removed as an Firewall Manager administrator.  
     */
    Status?: OrganizationStatus;
  }
  export interface GetAppsListRequest {
    /**
     * The ID of the Firewall Manager applications list that you want the details for.
     */
    ListId: ListId;
    /**
     * Specifies whether the list to retrieve is a default list owned by Firewall Manager.
     */
    DefaultList?: Boolean;
  }
  export interface GetAppsListResponse {
    /**
     * Information about the specified Firewall Manager applications list.
     */
    AppsList?: AppsListData;
    /**
     * The Amazon Resource Name (ARN) of the applications list.
     */
    AppsListArn?: ResourceArn;
  }
  export interface GetComplianceDetailRequest {
    /**
     * The ID of the policy that you want to get the details for. PolicyId is returned by PutPolicy and by ListPolicies.
     */
    PolicyId: PolicyId;
    /**
     * The Amazon Web Services account that owns the resources that you want to get the details for.
     */
    MemberAccount: AWSAccountId;
  }
  export interface GetComplianceDetailResponse {
    /**
     * Information about the resources and the policy that you specified in the GetComplianceDetail request.
     */
    PolicyComplianceDetail?: PolicyComplianceDetail;
  }
  export interface GetNotificationChannelRequest {
  }
  export interface GetNotificationChannelResponse {
    /**
     * The SNS topic that records Firewall Manager activity. 
     */
    SnsTopicArn?: ResourceArn;
    /**
     * The IAM role that is used by Firewall Manager to record activity to SNS.
     */
    SnsRoleName?: ResourceArn;
  }
  export interface GetPolicyRequest {
    /**
     * The ID of the Firewall Manager policy that you want the details for.
     */
    PolicyId: PolicyId;
  }
  export interface GetPolicyResponse {
    /**
     * Information about the specified Firewall Manager policy.
     */
    Policy?: Policy;
    /**
     * The Amazon Resource Name (ARN) of the specified policy.
     */
    PolicyArn?: ResourceArn;
  }
  export interface GetProtectionStatusRequest {
    /**
     * The ID of the policy for which you want to get the attack information.
     */
    PolicyId: PolicyId;
    /**
     * The Amazon Web Services account that is in scope of the policy that you want to get the details for.
     */
    MemberAccountId?: AWSAccountId;
    /**
     * The start of the time period to query for the attacks. This is a timestamp type. The request syntax listing indicates a number type because the default used by Firewall Manager is Unix time in seconds. However, any valid timestamp format is allowed.
     */
    StartTime?: TimeStamp;
    /**
     * The end of the time period to query for the attacks. This is a timestamp type. The request syntax listing indicates a number type because the default used by Firewall Manager is Unix time in seconds. However, any valid timestamp format is allowed.
     */
    EndTime?: TimeStamp;
    /**
     * If you specify a value for MaxResults and you have more objects than the number that you specify for MaxResults, Firewall Manager returns a NextToken value in the response, which you can use to retrieve another group of objects. For the second and subsequent GetProtectionStatus requests, specify the value of NextToken from the previous response to get information about another batch of objects.
     */
    NextToken?: PaginationToken;
    /**
     * Specifies the number of objects that you want Firewall Manager to return for this request. If you have more objects than the number that you specify for MaxResults, the response includes a NextToken value that you can use to get another batch of objects.
     */
    MaxResults?: PaginationMaxResults;
  }
  export interface GetProtectionStatusResponse {
    /**
     * The ID of the Firewall Manager administrator account for this policy.
     */
    AdminAccountId?: AWSAccountId;
    /**
     * The service type that is protected by the policy. Currently, this is always SHIELD_ADVANCED.
     */
    ServiceType?: SecurityServiceType;
    /**
     * Details about the attack, including the following:   Attack type   Account ID   ARN of the resource attacked   Start time of the attack   End time of the attack (ongoing attacks will not have an end time)   The details are in JSON format. 
     */
    Data?: ProtectionData;
    /**
     * If you have more objects than the number that you specified for MaxResults in the request, the response includes a NextToken value. To list more objects, submit another GetProtectionStatus request, and specify the NextToken value from the response in the NextToken value in the next request. Amazon Web Services SDKs provide auto-pagination that identify NextToken in a response and make subsequent request calls automatically on your behalf. However, this feature is not supported by GetProtectionStatus. You must submit subsequent requests with NextToken using your own processes. 
     */
    NextToken?: PaginationToken;
  }
  export interface GetProtocolsListRequest {
    /**
     * The ID of the Firewall Manager protocols list that you want the details for.
     */
    ListId: ListId;
    /**
     * Specifies whether the list to retrieve is a default list owned by Firewall Manager.
     */
    DefaultList?: Boolean;
  }
  export interface GetProtocolsListResponse {
    /**
     * Information about the specified Firewall Manager protocols list.
     */
    ProtocolsList?: ProtocolsListData;
    /**
     * The Amazon Resource Name (ARN) of the specified protocols list.
     */
    ProtocolsListArn?: ResourceArn;
  }
  export interface GetResourceSetRequest {
    /**
     * A unique identifier for the resource set, used in a request to refer to the resource set.
     */
    Identifier: Base62Id;
  }
  export interface GetResourceSetResponse {
    /**
     * Information about the specified resource set.
     */
    ResourceSet: ResourceSet;
    /**
     * The Amazon Resource Name (ARN) of the resource set.
     */
    ResourceSetArn: ResourceArn;
  }
  export interface GetThirdPartyFirewallAssociationStatusRequest {
    /**
     * The name of the third-party firewall vendor.
     */
    ThirdPartyFirewall: ThirdPartyFirewall;
  }
  export interface GetThirdPartyFirewallAssociationStatusResponse {
    /**
     * The current status for setting a Firewall Manager policy administrators account as an administrator of the third-party firewall tenant.    ONBOARDING - The Firewall Manager policy administrator is being designated as a tenant administrator.    ONBOARD_COMPLETE - The Firewall Manager policy administrator is designated as a tenant administrator.    OFFBOARDING - The Firewall Manager policy administrator is being removed as a tenant administrator.    OFFBOARD_COMPLETE - The Firewall Manager policy administrator has been removed as a tenant administrator.    NOT_EXIST - The Firewall Manager policy administrator doesn't exist as a tenant administrator.  
     */
    ThirdPartyFirewallStatus?: ThirdPartyFirewallAssociationStatus;
    /**
     * The status for subscribing to the third-party firewall vendor in the Amazon Web Services Marketplace.    NO_SUBSCRIPTION - The Firewall Manager policy administrator isn't subscribed to the third-party firewall service in the Amazon Web Services Marketplace.    NOT_COMPLETE - The Firewall Manager policy administrator is in the process of subscribing to the third-party firewall service in the Amazon Web Services Marketplace, but doesn't yet have an active subscription.    COMPLETE - The Firewall Manager policy administrator has an active subscription to the third-party firewall service in the Amazon Web Services Marketplace.  
     */
    MarketplaceOnboardingStatus?: MarketplaceSubscriptionOnboardingStatus;
  }
  export interface GetViolationDetailsRequest {
    /**
     * The ID of the Firewall Manager policy that you want the details for. This currently only supports security group content audit policies.
     */
    PolicyId: PolicyId;
    /**
     * The Amazon Web Services account ID that you want the details for.
     */
    MemberAccount: AWSAccountId;
    /**
     * The ID of the resource that has violations.
     */
    ResourceId: ResourceId;
    /**
     * The resource type. This is in the format shown in the Amazon Web Services Resource Types Reference. Supported resource types are: AWS::EC2::Instance, AWS::EC2::NetworkInterface, AWS::EC2::SecurityGroup, AWS::NetworkFirewall::FirewallPolicy, and AWS::EC2::Subnet. 
     */
    ResourceType: ResourceType;
  }
  export interface GetViolationDetailsResponse {
    /**
     * Violation detail for a resource.
     */
    ViolationDetail?: ViolationDetail;
  }
  export type IPPortNumber = number;
  export type Identifier = string;
  export type IdentifierList = Identifier[];
  export type IssueInfoMap = {[key: string]: DetailedInfo};
  export type LengthBoundedString = string;
  export type LengthBoundedStringList = LengthBoundedString[];
  export interface ListAdminAccountsForOrganizationRequest {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Firewall Manager returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of objects that you want Firewall Manager to return for this request. If more objects are available, in the response, Firewall Manager provides a NextToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: PaginationMaxResults;
  }
  export interface ListAdminAccountsForOrganizationResponse {
    /**
     * A list of Firewall Manager administrator accounts within the organization that were onboarded as administrators by AssociateAdminAccount or PutAdminAccount.
     */
    AdminAccounts?: AdminAccountSummaryList;
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Firewall Manager returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListAdminsManagingAccountRequest {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Firewall Manager returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of objects that you want Firewall Manager to return for this request. If more objects are available, in the response, Firewall Manager provides a NextToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: PaginationMaxResults;
  }
  export interface ListAdminsManagingAccountResponse {
    /**
     * The list of accounts who manage member accounts within their AdminScope.
     */
    AdminAccounts?: AccountIdList;
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Firewall Manager returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListAppsListsRequest {
    /**
     * Specifies whether the lists to retrieve are default lists owned by Firewall Manager.
     */
    DefaultLists?: Boolean;
    /**
     * If you specify a value for MaxResults in your list request, and you have more objects than the maximum, Firewall Manager returns this token in the response. For all but the first request, you provide the token returned by the prior request in the request parameters, to retrieve the next batch of objects.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of objects that you want Firewall Manager to return for this request. If more objects are available, in the response, Firewall Manager provides a NextToken value that you can use in a subsequent call to get the next batch of objects. If you don't specify this, Firewall Manager returns all available objects.
     */
    MaxResults: PaginationMaxResults;
  }
  export interface ListAppsListsResponse {
    /**
     * An array of AppsListDataSummary objects.
     */
    AppsLists?: AppsListsData;
    /**
     * If you specify a value for MaxResults in your list request, and you have more objects than the maximum, Firewall Manager returns this token in the response. You can use this token in subsequent requests to retrieve the next batch of objects.
     */
    NextToken?: PaginationToken;
  }
  export interface ListComplianceStatusRequest {
    /**
     * The ID of the Firewall Manager policy that you want the details for.
     */
    PolicyId: PolicyId;
    /**
     * If you specify a value for MaxResults and you have more PolicyComplianceStatus objects than the number that you specify for MaxResults, Firewall Manager returns a NextToken value in the response that allows you to list another group of PolicyComplianceStatus objects. For the second and subsequent ListComplianceStatus requests, specify the value of NextToken from the previous response to get information about another batch of PolicyComplianceStatus objects.
     */
    NextToken?: PaginationToken;
    /**
     * Specifies the number of PolicyComplianceStatus objects that you want Firewall Manager to return for this request. If you have more PolicyComplianceStatus objects than the number that you specify for MaxResults, the response includes a NextToken value that you can use to get another batch of PolicyComplianceStatus objects.
     */
    MaxResults?: PaginationMaxResults;
  }
  export interface ListComplianceStatusResponse {
    /**
     * An array of PolicyComplianceStatus objects.
     */
    PolicyComplianceStatusList?: PolicyComplianceStatusList;
    /**
     * If you have more PolicyComplianceStatus objects than the number that you specified for MaxResults in the request, the response includes a NextToken value. To list more PolicyComplianceStatus objects, submit another ListComplianceStatus request, and specify the NextToken value from the response in the NextToken value in the next request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListDiscoveredResourcesRequest {
    /**
     * The Amazon Web Services account IDs to discover resources in. Only one account is supported per request. The account must be a member of your organization.
     */
    MemberAccountIds: AWSAccountIdList;
    /**
     * The type of resources to discover.
     */
    ResourceType: ResourceType;
    /**
     * The maximum number of objects that you want Firewall Manager to return for this request. If more objects are available, in the response, Firewall Manager provides a NextToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: PaginationMaxResults;
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Firewall Manager returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListDiscoveredResourcesResponse {
    /**
     * Details of the resources that were discovered.
     */
    Items?: DiscoveredResourceList;
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Firewall Manager returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
  }
  export type ListId = string;
  export interface ListMemberAccountsRequest {
    /**
     * If you specify a value for MaxResults and you have more account IDs than the number that you specify for MaxResults, Firewall Manager returns a NextToken value in the response that allows you to list another group of IDs. For the second and subsequent ListMemberAccountsRequest requests, specify the value of NextToken from the previous response to get information about another batch of member account IDs.
     */
    NextToken?: PaginationToken;
    /**
     * Specifies the number of member account IDs that you want Firewall Manager to return for this request. If you have more IDs than the number that you specify for MaxResults, the response includes a NextToken value that you can use to get another batch of member account IDs.
     */
    MaxResults?: PaginationMaxResults;
  }
  export interface ListMemberAccountsResponse {
    /**
     * An array of account IDs.
     */
    MemberAccounts?: MemberAccounts;
    /**
     * If you have more member account IDs than the number that you specified for MaxResults in the request, the response includes a NextToken value. To list more IDs, submit another ListMemberAccounts request, and specify the NextToken value from the response in the NextToken value in the next request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListPoliciesRequest {
    /**
     * If you specify a value for MaxResults and you have more PolicySummary objects than the number that you specify for MaxResults, Firewall Manager returns a NextToken value in the response that allows you to list another group of PolicySummary objects. For the second and subsequent ListPolicies requests, specify the value of NextToken from the previous response to get information about another batch of PolicySummary objects.
     */
    NextToken?: PaginationToken;
    /**
     * Specifies the number of PolicySummary objects that you want Firewall Manager to return for this request. If you have more PolicySummary objects than the number that you specify for MaxResults, the response includes a NextToken value that you can use to get another batch of PolicySummary objects.
     */
    MaxResults?: PaginationMaxResults;
  }
  export interface ListPoliciesResponse {
    /**
     * An array of PolicySummary objects.
     */
    PolicyList?: PolicySummaryList;
    /**
     * If you have more PolicySummary objects than the number that you specified for MaxResults in the request, the response includes a NextToken value. To list more PolicySummary objects, submit another ListPolicies request, and specify the NextToken value from the response in the NextToken value in the next request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListProtocolsListsRequest {
    /**
     * Specifies whether the lists to retrieve are default lists owned by Firewall Manager.
     */
    DefaultLists?: Boolean;
    /**
     * If you specify a value for MaxResults in your list request, and you have more objects than the maximum, Firewall Manager returns this token in the response. For all but the first request, you provide the token returned by the prior request in the request parameters, to retrieve the next batch of objects.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of objects that you want Firewall Manager to return for this request. If more objects are available, in the response, Firewall Manager provides a NextToken value that you can use in a subsequent call to get the next batch of objects. If you don't specify this, Firewall Manager returns all available objects.
     */
    MaxResults: PaginationMaxResults;
  }
  export interface ListProtocolsListsResponse {
    /**
     * An array of ProtocolsListDataSummary objects.
     */
    ProtocolsLists?: ProtocolsListsData;
    /**
     * If you specify a value for MaxResults in your list request, and you have more objects than the maximum, Firewall Manager returns this token in the response. You can use this token in subsequent requests to retrieve the next batch of objects.
     */
    NextToken?: PaginationToken;
  }
  export interface ListResourceSetResourcesRequest {
    /**
     * A unique identifier for the resource set, used in a request to refer to the resource set.
     */
    Identifier: ResourceId;
    /**
     * The maximum number of objects that you want Firewall Manager to return for this request. If more objects are available, in the response, Firewall Manager provides a NextToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: PaginationMaxResults;
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Firewall Manager returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListResourceSetResourcesResponse {
    /**
     * An array of the associated resources' uniform resource identifiers (URI).
     */
    Items: ResourceList;
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Firewall Manager returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListResourceSetsRequest {
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Firewall Manager returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of objects that you want Firewall Manager to return for this request. If more objects are available, in the response, Firewall Manager provides a NextToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: PaginationMaxResults;
  }
  export interface ListResourceSetsResponse {
    /**
     * An array of ResourceSetSummary objects.
     */
    ResourceSets?: ResourceSetSummaryList;
    /**
     * When you request a list of objects with a MaxResults setting, if the number of objects that are still available for retrieval exceeds the maximum you requested, Firewall Manager returns a NextToken value in the response. To retrieve the next batch of objects, use the token returned from the prior request in your next request.
     */
    NextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to return tags for. The Firewall Manager resources that support tagging are policies, applications lists, and protocols lists. 
     */
    ResourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags associated with the resource.
     */
    TagList?: TagList;
  }
  export interface ListThirdPartyFirewallFirewallPoliciesRequest {
    /**
     * The name of the third-party firewall vendor.
     */
    ThirdPartyFirewall: ThirdPartyFirewall;
    /**
     * If the previous response included a NextToken element, the specified third-party firewall vendor is associated with more third-party firewall policies. To get more third-party firewall policies, submit another ListThirdPartyFirewallFirewallPoliciesRequest request.  For the value of NextToken, specify the value of NextToken from the previous response. If the previous response didn't include a NextToken element, there are no more third-party firewall policies to get. 
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of third-party firewall policies that you want Firewall Manager to return. If the specified third-party firewall vendor is associated with more than MaxResults firewall policies, the response includes a NextToken element. NextToken contains an encrypted token that identifies the first third-party firewall policies that Firewall Manager will return if you submit another request.
     */
    MaxResults: PaginationMaxResults;
  }
  export interface ListThirdPartyFirewallFirewallPoliciesResponse {
    /**
     * A list that contains one ThirdPartyFirewallFirewallPolicies element for each third-party firewall policies that the specified third-party firewall vendor is associated with. Each ThirdPartyFirewallFirewallPolicies element contains the firewall policy name and ID.
     */
    ThirdPartyFirewallFirewallPolicies?: ThirdPartyFirewallFirewallPolicies;
    /**
     * The value that you will use for NextToken in the next ListThirdPartyFirewallFirewallPolicies request.
     */
    NextToken?: PaginationToken;
  }
  export type ManagedServiceData = string;
  export type MarketplaceSubscriptionOnboardingStatus = "NO_SUBSCRIPTION"|"NOT_COMPLETE"|"COMPLETE"|string;
  export type MemberAccounts = AWSAccountId[];
  export type Name = string;
  export type NetworkFirewallAction = string;
  export type NetworkFirewallActionList = NetworkFirewallAction[];
  export interface NetworkFirewallBlackHoleRouteDetectedViolation {
    /**
     * The subnet that has an inactive state.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * Information about the route table ID.
     */
    RouteTableId?: ResourceId;
    /**
     * Information about the VPC ID.
     */
    VpcId?: ResourceId;
    /**
     * Information about the route or routes that are in violation.
     */
    ViolatingRoutes?: Routes;
  }
  export interface NetworkFirewallInternetTrafficNotInspectedViolation {
    /**
     * The subnet ID.
     */
    SubnetId?: ResourceId;
    /**
     * The subnet Availability Zone.
     */
    SubnetAvailabilityZone?: LengthBoundedString;
    /**
     * Information about the route table ID.
     */
    RouteTableId?: ResourceId;
    /**
     * The route or routes that are in violation.
     */
    ViolatingRoutes?: Routes;
    /**
     * Information about whether the route table is used in another Availability Zone.
     */
    IsRouteTableUsedInDifferentAZ?: Boolean;
    /**
     * Information about the subnet route table for the current firewall.
     */
    CurrentFirewallSubnetRouteTable?: ResourceId;
    /**
     * The expected endpoint for the current firewall.
     */
    ExpectedFirewallEndpoint?: ResourceId;
    /**
     * The firewall subnet ID.
     */
    FirewallSubnetId?: ResourceId;
    /**
     * The firewall subnet routes that are expected.
     */
    ExpectedFirewallSubnetRoutes?: ExpectedRoutes;
    /**
     * The actual firewall subnet routes.
     */
    ActualFirewallSubnetRoutes?: Routes;
    /**
     * The internet gateway ID.
     */
    InternetGatewayId?: ResourceId;
    /**
     * The current route table for the internet gateway.
     */
    CurrentInternetGatewayRouteTable?: ResourceId;
    /**
     * The internet gateway routes that are expected.
     */
    ExpectedInternetGatewayRoutes?: ExpectedRoutes;
    /**
     * The actual internet gateway routes.
     */
    ActualInternetGatewayRoutes?: Routes;
    /**
     * Information about the VPC ID.
     */
    VpcId?: ResourceId;
  }
  export interface NetworkFirewallInvalidRouteConfigurationViolation {
    /**
     * The subnets that are affected.
     */
    AffectedSubnets?: ResourceIdList;
    /**
     * The route table ID.
     */
    RouteTableId?: ResourceId;
    /**
     * Information about whether the route table is used in another Availability Zone.
     */
    IsRouteTableUsedInDifferentAZ?: Boolean;
    /**
     * The route that's in violation.
     */
    ViolatingRoute?: Route;
    /**
     * The subnet route table for the current firewall.
     */
    CurrentFirewallSubnetRouteTable?: ResourceId;
    /**
     * The firewall endpoint that's expected.
     */
    ExpectedFirewallEndpoint?: ResourceId;
    /**
     * The actual firewall endpoint.
     */
    ActualFirewallEndpoint?: ResourceId;
    /**
     * The expected subnet ID for the firewall.
     */
    ExpectedFirewallSubnetId?: ResourceId;
    /**
     * The actual subnet ID for the firewall.
     */
    ActualFirewallSubnetId?: ResourceId;
    /**
     * The firewall subnet routes that are expected.
     */
    ExpectedFirewallSubnetRoutes?: ExpectedRoutes;
    /**
     * The actual firewall subnet routes that are expected.
     */
    ActualFirewallSubnetRoutes?: Routes;
    /**
     * The internet gateway ID.
     */
    InternetGatewayId?: ResourceId;
    /**
     * The route table for the current internet gateway.
     */
    CurrentInternetGatewayRouteTable?: ResourceId;
    /**
     * The expected routes for the internet gateway.
     */
    ExpectedInternetGatewayRoutes?: ExpectedRoutes;
    /**
     * The actual internet gateway routes.
     */
    ActualInternetGatewayRoutes?: Routes;
    /**
     * Information about the VPC ID.
     */
    VpcId?: ResourceId;
  }
  export interface NetworkFirewallMissingExpectedRTViolation {
    /**
     * The ID of the Network Firewall or VPC resource that's in violation.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * The resource ID of the VPC associated with a violating subnet.
     */
    VPC?: ResourceId;
    /**
     * The Availability Zone of a violating subnet. 
     */
    AvailabilityZone?: LengthBoundedString;
    /**
     * The resource ID of the current route table that's associated with the subnet, if one is available.
     */
    CurrentRouteTable?: ResourceId;
    /**
     * The resource ID of the route table that should be associated with the subnet.
     */
    ExpectedRouteTable?: ResourceId;
  }
  export interface NetworkFirewallMissingExpectedRoutesViolation {
    /**
     * The target of the violation.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * The expected routes.
     */
    ExpectedRoutes?: ExpectedRoutes;
    /**
     * Information about the VPC ID.
     */
    VpcId?: ResourceId;
  }
  export interface NetworkFirewallMissingFirewallViolation {
    /**
     * The ID of the Network Firewall or VPC resource that's in violation.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * The resource ID of the VPC associated with a violating subnet.
     */
    VPC?: ResourceId;
    /**
     * The Availability Zone of a violating subnet. 
     */
    AvailabilityZone?: LengthBoundedString;
    /**
     * The reason the resource has this violation, if one is available. 
     */
    TargetViolationReason?: TargetViolationReason;
  }
  export interface NetworkFirewallMissingSubnetViolation {
    /**
     * The ID of the Network Firewall or VPC resource that's in violation.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * The resource ID of the VPC associated with a violating subnet.
     */
    VPC?: ResourceId;
    /**
     * The Availability Zone of a violating subnet. 
     */
    AvailabilityZone?: LengthBoundedString;
    /**
     * The reason the resource has this violation, if one is available. 
     */
    TargetViolationReason?: TargetViolationReason;
  }
  export type NetworkFirewallOverrideAction = "DROP_TO_ALERT"|string;
  export interface NetworkFirewallPolicy {
    /**
     * Defines the deployment model to use for the firewall policy. To use a distributed model, set PolicyOption to NULL.
     */
    FirewallDeploymentModel?: FirewallDeploymentModel;
  }
  export interface NetworkFirewallPolicyDescription {
    /**
     * The stateless rule groups that are used in the Network Firewall firewall policy. 
     */
    StatelessRuleGroups?: StatelessRuleGroupList;
    /**
     * The actions to take on packets that don't match any of the stateless rule groups. 
     */
    StatelessDefaultActions?: NetworkFirewallActionList;
    /**
     * The actions to take on packet fragments that don't match any of the stateless rule groups. 
     */
    StatelessFragmentDefaultActions?: NetworkFirewallActionList;
    /**
     * Names of custom actions that are available for use in the stateless default actions settings.
     */
    StatelessCustomActions?: NetworkFirewallActionList;
    /**
     * The stateful rule groups that are used in the Network Firewall firewall policy. 
     */
    StatefulRuleGroups?: StatefulRuleGroupList;
    /**
     * The default actions to take on a packet that doesn't match any stateful rules. The stateful default action is optional, and is only valid when using the strict rule order.  Valid values of the stateful default action:    aws:drop_strict   aws:drop_established   aws:alert_strict   aws:alert_established  
     */
    StatefulDefaultActions?: NetworkFirewallActionList;
    /**
     * Additional options governing how Network Firewall handles stateful rules. The stateful rule groups that you use in your policy must have stateful rule options settings that are compatible with these settings.
     */
    StatefulEngineOptions?: StatefulEngineOptions;
  }
  export interface NetworkFirewallPolicyModifiedViolation {
    /**
     * The ID of the Network Firewall or VPC resource that's in violation.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * The policy that's currently in use in the individual account. 
     */
    CurrentPolicyDescription?: NetworkFirewallPolicyDescription;
    /**
     * The policy that should be in use in the individual account in order to be compliant. 
     */
    ExpectedPolicyDescription?: NetworkFirewallPolicyDescription;
  }
  export type NetworkFirewallResourceName = string;
  export interface NetworkFirewallStatefulRuleGroupOverride {
    /**
     * The action that changes the rule group from DROP to ALERT. This only applies to managed rule groups.
     */
    Action?: NetworkFirewallOverrideAction;
  }
  export interface NetworkFirewallUnexpectedFirewallRoutesViolation {
    /**
     * The subnet ID for the firewall.
     */
    FirewallSubnetId?: ResourceId;
    /**
     * The routes that are in violation.
     */
    ViolatingRoutes?: Routes;
    /**
     * The ID of the route table.
     */
    RouteTableId?: ResourceId;
    /**
     * The endpoint of the firewall.
     */
    FirewallEndpoint?: ResourceId;
    /**
     * Information about the VPC ID.
     */
    VpcId?: ResourceId;
  }
  export interface NetworkFirewallUnexpectedGatewayRoutesViolation {
    /**
     * Information about the gateway ID.
     */
    GatewayId?: ResourceId;
    /**
     * The routes that are in violation.
     */
    ViolatingRoutes?: Routes;
    /**
     * Information about the route table.
     */
    RouteTableId?: ResourceId;
    /**
     * Information about the VPC ID.
     */
    VpcId?: ResourceId;
  }
  export type OrderedRemediationActions = RemediationActionWithOrder[];
  export type OrganizationStatus = "ONBOARDING"|"ONBOARDING_COMPLETE"|"OFFBOARDING"|"OFFBOARDING_COMPLETE"|string;
  export type OrganizationalUnitId = string;
  export type OrganizationalUnitIdList = OrganizationalUnitId[];
  export interface OrganizationalUnitScope {
    /**
     * The list of OUs within the organization that the specified Firewall Manager administrator either can or cannot apply policies to, based on the value of OrganizationalUnitScope$ExcludeSpecifiedOrganizationalUnits. If OrganizationalUnitScope$ExcludeSpecifiedOrganizationalUnits is set to true, then the Firewall Manager administrator can apply policies to all OUs in the organization except for the OUs in this list. If OrganizationalUnitScope$ExcludeSpecifiedOrganizationalUnits is set to false, then the Firewall Manager administrator can only apply policies to the OUs in this list.
     */
    OrganizationalUnits?: OrganizationalUnitIdList;
    /**
     * A boolean value that indicates if the administrator can apply policies to all OUs within an organization. If true, the administrator can manage all OUs within the organization. You can either enable management of all OUs through this operation, or you can specify OUs to manage in OrganizationalUnitScope$OrganizationalUnits. You cannot specify both.
     */
    AllOrganizationalUnitsEnabled?: Boolean;
    /**
     * A boolean value that excludes the OUs in OrganizationalUnitScope$OrganizationalUnits from the administrator's scope. If true, the Firewall Manager administrator can apply policies to all OUs in the organization except for the OUs listed in OrganizationalUnitScope$OrganizationalUnits. You can either specify a list of OUs to exclude by OrganizationalUnitScope$OrganizationalUnits, or you can enable management of all OUs by OrganizationalUnitScope$AllOrganizationalUnitsEnabled. You cannot specify both.
     */
    ExcludeSpecifiedOrganizationalUnits?: Boolean;
  }
  export type PaginationMaxResults = number;
  export type PaginationToken = string;
  export interface PartialMatch {
    /**
     * The reference rule from the primary security group of the Firewall Manager policy.
     */
    Reference?: ReferenceRule;
    /**
     * The violation reason.
     */
    TargetViolationReasons?: TargetViolationReasons;
  }
  export type PartialMatches = PartialMatch[];
  export interface Policy {
    /**
     * The ID of the Firewall Manager policy.
     */
    PolicyId?: PolicyId;
    /**
     * The name of the Firewall Manager policy.
     */
    PolicyName: ResourceName;
    /**
     * A unique identifier for each update to the policy. When issuing a PutPolicy request, the PolicyUpdateToken in the request must match the PolicyUpdateToken of the current policy version. To get the PolicyUpdateToken of the current policy version, use a GetPolicy request.
     */
    PolicyUpdateToken?: PolicyUpdateToken;
    /**
     * Details about the security service that is being used to protect the resources.
     */
    SecurityServicePolicyData: SecurityServicePolicyData;
    /**
     * The type of resource protected by or in scope of the policy. This is in the format shown in the Amazon Web Services Resource Types Reference. To apply this policy to multiple resource types, specify a resource type of ResourceTypeList and then specify the resource types in a ResourceTypeList. For WAF and Shield Advanced, resource types include AWS::ElasticLoadBalancingV2::LoadBalancer, AWS::ElasticLoadBalancing::LoadBalancer, AWS::EC2::EIP, and AWS::CloudFront::Distribution. For a security group common policy, valid values are AWS::EC2::NetworkInterface and AWS::EC2::Instance. For a security group content audit policy, valid values are AWS::EC2::SecurityGroup, AWS::EC2::NetworkInterface, and AWS::EC2::Instance. For a security group usage audit policy, the value is AWS::EC2::SecurityGroup. For an Network Firewall policy or DNS Firewall policy, the value is AWS::EC2::VPC.
     */
    ResourceType: ResourceType;
    /**
     * An array of ResourceType objects. Use this only to specify multiple resource types. To specify a single resource type, use ResourceType.
     */
    ResourceTypeList?: ResourceTypeList;
    /**
     * An array of ResourceTag objects.
     */
    ResourceTags?: ResourceTags;
    /**
     * If set to True, resources with the tags that are specified in the ResourceTag array are not in scope of the policy. If set to False, and the ResourceTag array is not null, only resources with the specified tags are in scope of the policy.
     */
    ExcludeResourceTags: Boolean;
    /**
     * Indicates if the policy should be automatically applied to new resources.
     */
    RemediationEnabled: Boolean;
    /**
     * Indicates whether Firewall Manager should automatically remove protections from resources that leave the policy scope and clean up resources that Firewall Manager is managing for accounts when those accounts leave policy scope. For example, Firewall Manager will disassociate a Firewall Manager managed web ACL from a protected customer resource when the customer resource leaves policy scope.  By default, Firewall Manager doesn't remove protections or delete Firewall Manager managed resources.  This option is not available for Shield Advanced or WAF Classic policies.
     */
    DeleteUnusedFMManagedResources?: Boolean;
    /**
     * Specifies the Amazon Web Services account IDs and Organizations organizational units (OUs) to include in the policy. Specifying an OU is the equivalent of specifying all accounts in the OU and in any of its child OUs, including any child OUs and accounts that are added at a later time. You can specify inclusions or exclusions, but not both. If you specify an IncludeMap, Firewall Manager applies the policy to all accounts specified by the IncludeMap, and does not evaluate any ExcludeMap specifications. If you do not specify an IncludeMap, then Firewall Manager applies the policy to all accounts except for those specified by the ExcludeMap. You can specify account IDs, OUs, or a combination:    Specify account IDs by setting the key to ACCOUNT. For example, the following is a valid map: {“ACCOUNT” : [“accountID1”, “accountID2”]}.   Specify OUs by setting the key to ORG_UNIT. For example, the following is a valid map: {“ORG_UNIT” : [“ouid111”, “ouid112”]}.   Specify accounts and OUs together in a single map, separated with a comma. For example, the following is a valid map: {“ACCOUNT” : [“accountID1”, “accountID2”], “ORG_UNIT” : [“ouid111”, “ouid112”]}.  
     */
    IncludeMap?: CustomerPolicyScopeMap;
    /**
     * Specifies the Amazon Web Services account IDs and Organizations organizational units (OUs) to exclude from the policy. Specifying an OU is the equivalent of specifying all accounts in the OU and in any of its child OUs, including any child OUs and accounts that are added at a later time. You can specify inclusions or exclusions, but not both. If you specify an IncludeMap, Firewall Manager applies the policy to all accounts specified by the IncludeMap, and does not evaluate any ExcludeMap specifications. If you do not specify an IncludeMap, then Firewall Manager applies the policy to all accounts except for those specified by the ExcludeMap. You can specify account IDs, OUs, or a combination:    Specify account IDs by setting the key to ACCOUNT. For example, the following is a valid map: {“ACCOUNT” : [“accountID1”, “accountID2”]}.   Specify OUs by setting the key to ORG_UNIT. For example, the following is a valid map: {“ORG_UNIT” : [“ouid111”, “ouid112”]}.   Specify accounts and OUs together in a single map, separated with a comma. For example, the following is a valid map: {“ACCOUNT” : [“accountID1”, “accountID2”], “ORG_UNIT” : [“ouid111”, “ouid112”]}.  
     */
    ExcludeMap?: CustomerPolicyScopeMap;
    /**
     * The unique identifiers of the resource sets used by the policy.
     */
    ResourceSetIds?: ResourceSetIds;
    /**
     * The definition of the Network Firewall firewall policy.
     */
    PolicyDescription?: ResourceDescription;
    /**
     * Indicates whether the policy is in or out of an admin's policy or Region scope.    ACTIVE - The administrator can manage and delete the policy.    OUT_OF_ADMIN_SCOPE - The administrator can view the policy, but they can't edit or delete the policy. Existing policy protections stay in place. Any new resources that come into scope of the policy won't be protected.  
     */
    PolicyStatus?: CustomerPolicyStatus;
  }
  export interface PolicyComplianceDetail {
    /**
     * The Amazon Web Services account that created the Firewall Manager policy.
     */
    PolicyOwner?: AWSAccountId;
    /**
     * The ID of the Firewall Manager policy.
     */
    PolicyId?: PolicyId;
    /**
     * The Amazon Web Services account ID.
     */
    MemberAccount?: AWSAccountId;
    /**
     * An array of resources that aren't protected by the WAF or Shield Advanced policy or that aren't in compliance with the security group policy.
     */
    Violators?: ComplianceViolators;
    /**
     * Indicates if over 100 resources are noncompliant with the Firewall Manager policy.
     */
    EvaluationLimitExceeded?: Boolean;
    /**
     * A timestamp that indicates when the returned information should be considered out of date.
     */
    ExpiredAt?: TimeStamp;
    /**
     * Details about problems with dependent services, such as WAF or Config, and the error message received that indicates the problem with the service.
     */
    IssueInfoMap?: IssueInfoMap;
  }
  export interface PolicyComplianceStatus {
    /**
     * The Amazon Web Services account that created the Firewall Manager policy.
     */
    PolicyOwner?: AWSAccountId;
    /**
     * The ID of the Firewall Manager policy.
     */
    PolicyId?: PolicyId;
    /**
     * The name of the Firewall Manager policy.
     */
    PolicyName?: ResourceName;
    /**
     * The member account ID.
     */
    MemberAccount?: AWSAccountId;
    /**
     * An array of EvaluationResult objects.
     */
    EvaluationResults?: EvaluationResults;
    /**
     * Timestamp of the last update to the EvaluationResult objects.
     */
    LastUpdated?: TimeStamp;
    /**
     * Details about problems with dependent services, such as WAF or Config, and the error message received that indicates the problem with the service.
     */
    IssueInfoMap?: IssueInfoMap;
  }
  export type PolicyComplianceStatusList = PolicyComplianceStatus[];
  export type PolicyComplianceStatusType = "COMPLIANT"|"NON_COMPLIANT"|string;
  export type PolicyId = string;
  export interface PolicyOption {
    /**
     * Defines the deployment model to use for the firewall policy.
     */
    NetworkFirewallPolicy?: NetworkFirewallPolicy;
    /**
     * Defines the policy options for a third-party firewall policy.
     */
    ThirdPartyFirewallPolicy?: ThirdPartyFirewallPolicy;
  }
  export interface PolicySummary {
    /**
     * The Amazon Resource Name (ARN) of the specified policy.
     */
    PolicyArn?: ResourceArn;
    /**
     * The ID of the specified policy.
     */
    PolicyId?: PolicyId;
    /**
     * The name of the specified policy.
     */
    PolicyName?: ResourceName;
    /**
     * The type of resource protected by or in scope of the policy. This is in the format shown in the Amazon Web Services Resource Types Reference. For WAF and Shield Advanced, examples include AWS::ElasticLoadBalancingV2::LoadBalancer and AWS::CloudFront::Distribution. For a security group common policy, valid values are AWS::EC2::NetworkInterface and AWS::EC2::Instance. For a security group content audit policy, valid values are AWS::EC2::SecurityGroup, AWS::EC2::NetworkInterface, and AWS::EC2::Instance. For a security group usage audit policy, the value is AWS::EC2::SecurityGroup. For an Network Firewall policy or DNS Firewall policy, the value is AWS::EC2::VPC.
     */
    ResourceType?: ResourceType;
    /**
     * The service that the policy is using to protect the resources. This specifies the type of policy that is created, either an WAF policy, a Shield Advanced policy, or a security group policy.
     */
    SecurityServiceType?: SecurityServiceType;
    /**
     * Indicates if the policy should be automatically applied to new resources.
     */
    RemediationEnabled?: Boolean;
    /**
     * Indicates whether Firewall Manager should automatically remove protections from resources that leave the policy scope and clean up resources that Firewall Manager is managing for accounts when those accounts leave policy scope. For example, Firewall Manager will disassociate a Firewall Manager managed web ACL from a protected customer resource when the customer resource leaves policy scope.  By default, Firewall Manager doesn't remove protections or delete Firewall Manager managed resources.  This option is not available for Shield Advanced or WAF Classic policies.
     */
    DeleteUnusedFMManagedResources?: Boolean;
    /**
     * Indicates whether the policy is in or out of an admin's policy or Region scope.    ACTIVE - The administrator can manage and delete the policy.    OUT_OF_ADMIN_SCOPE - The administrator can view the policy, but they can't edit or delete the policy. Existing policy protections stay in place. Any new resources that come into scope of the policy won't be protected.  
     */
    PolicyStatus?: CustomerPolicyStatus;
  }
  export type PolicySummaryList = PolicySummary[];
  export interface PolicyTypeScope {
    /**
     * The list of policy types that the specified Firewall Manager administrator can manage.
     */
    PolicyTypes?: SecurityServiceTypeList;
    /**
     * Allows the specified Firewall Manager administrator to manage all Firewall Manager policy types, except for third-party policy types. Third-party policy types can only be managed by the Firewall Manager default administrator.
     */
    AllPolicyTypesEnabled?: Boolean;
  }
  export type PolicyUpdateToken = string;
  export interface PossibleRemediationAction {
    /**
     * A description of the list of remediation actions.
     */
    Description?: LengthBoundedString;
    /**
     * The ordered list of remediation actions.
     */
    OrderedRemediationActions: OrderedRemediationActions;
    /**
     * Information about whether an action is taken by default.
     */
    IsDefaultAction?: Boolean;
  }
  export type PossibleRemediationActionList = PossibleRemediationAction[];
  export interface PossibleRemediationActions {
    /**
     * A description of the possible remediation actions list.
     */
    Description?: LengthBoundedString;
    /**
     * Information about the actions.
     */
    Actions?: PossibleRemediationActionList;
  }
  export type PreviousAppsList = {[key: string]: AppsList};
  export type PreviousListVersion = string;
  export type PreviousProtocolsList = {[key: string]: ProtocolsList};
  export type PriorityNumber = number;
  export type ProtectionData = string;
  export type Protocol = string;
  export type ProtocolsList = Protocol[];
  export interface ProtocolsListData {
    /**
     * The ID of the Firewall Manager protocols list.
     */
    ListId?: ListId;
    /**
     * The name of the Firewall Manager protocols list.
     */
    ListName: ResourceName;
    /**
     * A unique identifier for each update to the list. When you update the list, the update token must match the token of the current version of the application list. You can retrieve the update token by getting the list. 
     */
    ListUpdateToken?: UpdateToken;
    /**
     * The time that the Firewall Manager protocols list was created.
     */
    CreateTime?: TimeStamp;
    /**
     * The time that the Firewall Manager protocols list was last updated.
     */
    LastUpdateTime?: TimeStamp;
    /**
     * An array of protocols in the Firewall Manager protocols list.
     */
    ProtocolsList: ProtocolsList;
    /**
     * A map of previous version numbers to their corresponding protocol arrays.
     */
    PreviousProtocolsList?: PreviousProtocolsList;
  }
  export interface ProtocolsListDataSummary {
    /**
     * The Amazon Resource Name (ARN) of the specified protocols list.
     */
    ListArn?: ResourceArn;
    /**
     * The ID of the specified protocols list.
     */
    ListId?: ListId;
    /**
     * The name of the specified protocols list.
     */
    ListName?: ResourceName;
    /**
     * An array of protocols in the Firewall Manager protocols list.
     */
    ProtocolsList?: ProtocolsList;
  }
  export type ProtocolsListsData = ProtocolsListDataSummary[];
  export interface PutAdminAccountRequest {
    /**
     * The Amazon Web Services account ID to add as an Firewall Manager administrator account. The account must be a member of the organization that was onboarded to Firewall Manager by AssociateAdminAccount. For more information about Organizations, see Managing the Amazon Web Services Accounts in Your Organization.
     */
    AdminAccount: AWSAccountId;
    /**
     * Configures the resources that the specified Firewall Manager administrator can manage. As a best practice, set the administrative scope according to the principles of least privilege. Only grant the administrator the specific resources or permissions that they need to perform the duties of their role.
     */
    AdminScope?: AdminScope;
  }
  export interface PutAppsListRequest {
    /**
     * The details of the Firewall Manager applications list to be created.
     */
    AppsList: AppsListData;
    /**
     * The tags associated with the resource.
     */
    TagList?: TagList;
  }
  export interface PutAppsListResponse {
    /**
     * The details of the Firewall Manager applications list.
     */
    AppsList?: AppsListData;
    /**
     * The Amazon Resource Name (ARN) of the applications list.
     */
    AppsListArn?: ResourceArn;
  }
  export interface PutNotificationChannelRequest {
    /**
     * The Amazon Resource Name (ARN) of the SNS topic that collects notifications from Firewall Manager.
     */
    SnsTopicArn: ResourceArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that allows Amazon SNS to record Firewall Manager activity. 
     */
    SnsRoleName: ResourceArn;
  }
  export interface PutPolicyRequest {
    /**
     * The details of the Firewall Manager policy to be created.
     */
    Policy: Policy;
    /**
     * The tags to add to the Amazon Web Services resource.
     */
    TagList?: TagList;
  }
  export interface PutPolicyResponse {
    /**
     * The details of the Firewall Manager policy.
     */
    Policy?: Policy;
    /**
     * The Amazon Resource Name (ARN) of the policy.
     */
    PolicyArn?: ResourceArn;
  }
  export interface PutProtocolsListRequest {
    /**
     * The details of the Firewall Manager protocols list to be created.
     */
    ProtocolsList: ProtocolsListData;
    /**
     * The tags associated with the resource.
     */
    TagList?: TagList;
  }
  export interface PutProtocolsListResponse {
    /**
     * The details of the Firewall Manager protocols list.
     */
    ProtocolsList?: ProtocolsListData;
    /**
     * The Amazon Resource Name (ARN) of the protocols list.
     */
    ProtocolsListArn?: ResourceArn;
  }
  export interface PutResourceSetRequest {
    /**
     * Details about the resource set to be created or updated.&gt;
     */
    ResourceSet: ResourceSet;
    /**
     * Retrieves the tags associated with the specified resource set. Tags are key:value pairs that you can use to categorize and manage your resources, for purposes like billing. For example, you might set the tag key to "customer" and the value to the customer name or ID. You can specify one or more tags to add to each Amazon Web Services resource, up to 50 tags for a resource.
     */
    TagList?: TagList;
  }
  export interface PutResourceSetResponse {
    /**
     * Details about the resource set.
     */
    ResourceSet: ResourceSet;
    /**
     * The Amazon Resource Name (ARN) of the resource set.
     */
    ResourceSetArn: ResourceArn;
  }
  export type ReferenceRule = string;
  export interface RegionScope {
    /**
     * The Amazon Web Services Regions that the specified Firewall Manager administrator can perform actions in.
     */
    Regions?: AWSRegionList;
    /**
     * Allows the specified Firewall Manager administrator to manage all Amazon Web Services Regions.
     */
    AllRegionsEnabled?: Boolean;
  }
  export interface RemediationAction {
    /**
     * A description of a remediation action.
     */
    Description?: LengthBoundedString;
    /**
     * Information about the CreateRoute action in the Amazon EC2 API.
     */
    EC2CreateRouteAction?: EC2CreateRouteAction;
    /**
     * Information about the ReplaceRoute action in the Amazon EC2 API.
     */
    EC2ReplaceRouteAction?: EC2ReplaceRouteAction;
    /**
     * Information about the DeleteRoute action in the Amazon EC2 API.
     */
    EC2DeleteRouteAction?: EC2DeleteRouteAction;
    /**
     * Information about the CopyRouteTable action in the Amazon EC2 API.
     */
    EC2CopyRouteTableAction?: EC2CopyRouteTableAction;
    /**
     * Information about the ReplaceRouteTableAssociation action in the Amazon EC2 API.
     */
    EC2ReplaceRouteTableAssociationAction?: EC2ReplaceRouteTableAssociationAction;
    /**
     * Information about the AssociateRouteTable action in the Amazon EC2 API.
     */
    EC2AssociateRouteTableAction?: EC2AssociateRouteTableAction;
    /**
     * Information about the CreateRouteTable action in the Amazon EC2 API.
     */
    EC2CreateRouteTableAction?: EC2CreateRouteTableAction;
    /**
     * The remedial action to take when updating a firewall configuration.
     */
    FMSPolicyUpdateFirewallCreationConfigAction?: FMSPolicyUpdateFirewallCreationConfigAction;
  }
  export type RemediationActionDescription = string;
  export type RemediationActionType = "REMOVE"|"MODIFY"|string;
  export interface RemediationActionWithOrder {
    /**
     * Information about an action you can take to remediate a violation.
     */
    RemediationAction?: RemediationAction;
    /**
     * The order of the remediation actions in the list.
     */
    Order?: BasicInteger;
  }
  export interface Resource {
    /**
     * The resource's universal resource indicator (URI).
     */
    URI: Identifier;
    /**
     * The Amazon Web Services account ID that the associated resource belongs to.
     */
    AccountId?: AWSAccountId;
  }
  export type ResourceArn = string;
  export type ResourceCount = number;
  export type ResourceDescription = string;
  export type ResourceId = string;
  export type ResourceIdList = ResourceId[];
  export type ResourceList = Resource[];
  export type ResourceName = string;
  export interface ResourceSet {
    /**
     * A unique identifier for the resource set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id?: Base62Id;
    /**
     * The descriptive name of the resource set. You can't change the name of a resource set after you create it.
     */
    Name: Name;
    /**
     * A description of the resource set.
     */
    Description?: Description;
    /**
     * An optional token that you can use for optimistic locking. Firewall Manager returns a token to your requests that access the resource set. The token marks the state of the resource set resource at the time of the request. Update tokens are not allowed when creating a resource set. After creation, each subsequent update call to the resource set requires the update token.  To make an unconditional change to the resource set, omit the token in your update request. Without the token, Firewall Manager performs your updates regardless of whether the resource set has changed since you last retrieved it. To make a conditional change to the resource set, provide the token in your update request. Firewall Manager uses the token to ensure that the resource set hasn't changed since you last retrieved it. If it has changed, the operation fails with an InvalidTokenException. If this happens, retrieve the resource set again to get a current copy of it with a new token. Reapply your changes as needed, then try the operation again using the new token. 
     */
    UpdateToken?: UpdateToken;
    /**
     * Determines the resources that can be associated to the resource set. Depending on your setting for max results and the number of resource sets, a single call might not return the full list.
     */
    ResourceTypeList: ResourceTypeList;
    /**
     * The last time that the resource set was changed.
     */
    LastUpdateTime?: TimeStamp;
    /**
     * Indicates whether the resource set is in or out of an admin's Region scope.    ACTIVE - The administrator can manage and delete the resource set.    OUT_OF_ADMIN_SCOPE - The administrator can view the resource set, but they can't edit or delete the resource set. Existing protections stay in place. Any new resource that come into scope of the resource set won't be protected.  
     */
    ResourceSetStatus?: ResourceSetStatus;
  }
  export type ResourceSetIds = Base62Id[];
  export type ResourceSetStatus = "ACTIVE"|"OUT_OF_ADMIN_SCOPE"|string;
  export interface ResourceSetSummary {
    /**
     * A unique identifier for the resource set. This ID is returned in the responses to create and list commands. You provide it to operations like update and delete.
     */
    Id?: Base62Id;
    /**
     * The descriptive name of the resource set. You can't change the name of a resource set after you create it.
     */
    Name?: Name;
    /**
     * A description of the resource set.
     */
    Description?: Description;
    /**
     * The last time that the resource set was changed.
     */
    LastUpdateTime?: TimeStamp;
    /**
     * Indicates whether the resource set is in or out of an admin's Region scope.    ACTIVE - The administrator can manage and delete the resource set.    OUT_OF_ADMIN_SCOPE - The administrator can view the resource set, but they can't edit or delete the resource set. Existing protections stay in place. Any new resource that come into scope of the resource set won't be protected.  
     */
    ResourceSetStatus?: ResourceSetStatus;
  }
  export type ResourceSetSummaryList = ResourceSetSummary[];
  export interface ResourceTag {
    /**
     * The resource tag key.
     */
    Key: ResourceTagKey;
    /**
     * The resource tag value.
     */
    Value?: ResourceTagValue;
  }
  export type ResourceTagKey = string;
  export type ResourceTagValue = string;
  export type ResourceTags = ResourceTag[];
  export type ResourceType = string;
  export type ResourceTypeList = ResourceType[];
  export interface ResourceViolation {
    /**
     * Violation detail for security groups.
     */
    AwsVPCSecurityGroupViolation?: AwsVPCSecurityGroupViolation;
    /**
     * Violation detail for a network interface.
     */
    AwsEc2NetworkInterfaceViolation?: AwsEc2NetworkInterfaceViolation;
    /**
     * Violation detail for an EC2 instance.
     */
    AwsEc2InstanceViolation?: AwsEc2InstanceViolation;
    /**
     * Violation detail for an Network Firewall policy that indicates that a subnet has no Firewall Manager managed firewall in its VPC. 
     */
    NetworkFirewallMissingFirewallViolation?: NetworkFirewallMissingFirewallViolation;
    /**
     * Violation detail for an Network Firewall policy that indicates that an Availability Zone is missing the expected Firewall Manager managed subnet.
     */
    NetworkFirewallMissingSubnetViolation?: NetworkFirewallMissingSubnetViolation;
    /**
     * Violation detail for an Network Firewall policy that indicates that a subnet is not associated with the expected Firewall Manager managed route table. 
     */
    NetworkFirewallMissingExpectedRTViolation?: NetworkFirewallMissingExpectedRTViolation;
    /**
     * Violation detail for an Network Firewall policy that indicates that a firewall policy in an individual account has been modified in a way that makes it noncompliant. For example, the individual account owner might have deleted a rule group, changed the priority of a stateless rule group, or changed a policy default action.
     */
    NetworkFirewallPolicyModifiedViolation?: NetworkFirewallPolicyModifiedViolation;
    /**
     * Violation detail for the subnet for which internet traffic hasn't been inspected.
     */
    NetworkFirewallInternetTrafficNotInspectedViolation?: NetworkFirewallInternetTrafficNotInspectedViolation;
    /**
     * The route configuration is invalid.
     */
    NetworkFirewallInvalidRouteConfigurationViolation?: NetworkFirewallInvalidRouteConfigurationViolation;
    NetworkFirewallBlackHoleRouteDetectedViolation?: NetworkFirewallBlackHoleRouteDetectedViolation;
    /**
     * There's an unexpected firewall route.
     */
    NetworkFirewallUnexpectedFirewallRoutesViolation?: NetworkFirewallUnexpectedFirewallRoutesViolation;
    /**
     * There's an unexpected gateway route.
     */
    NetworkFirewallUnexpectedGatewayRoutesViolation?: NetworkFirewallUnexpectedGatewayRoutesViolation;
    /**
     * Expected routes are missing from Network Firewall.
     */
    NetworkFirewallMissingExpectedRoutesViolation?: NetworkFirewallMissingExpectedRoutesViolation;
    /**
     * Violation detail for a DNS Firewall policy that indicates that a rule group that Firewall Manager tried to associate with a VPC has the same priority as a rule group that's already associated. 
     */
    DnsRuleGroupPriorityConflictViolation?: DnsRuleGroupPriorityConflictViolation;
    /**
     * Violation detail for a DNS Firewall policy that indicates that a rule group that Firewall Manager tried to associate with a VPC is already associated with the VPC and can't be associated again. 
     */
    DnsDuplicateRuleGroupViolation?: DnsDuplicateRuleGroupViolation;
    /**
     * Violation detail for a DNS Firewall policy that indicates that the VPC reached the limit for associated DNS Firewall rule groups. Firewall Manager tried to associate another rule group with the VPC and failed. 
     */
    DnsRuleGroupLimitExceededViolation?: DnsRuleGroupLimitExceededViolation;
    /**
     * A list of possible remediation action lists. Each individual possible remediation action is a list of individual remediation actions.
     */
    PossibleRemediationActions?: PossibleRemediationActions;
    /**
     * Contains details about the firewall subnet that violates the policy scope.
     */
    FirewallSubnetIsOutOfScopeViolation?: FirewallSubnetIsOutOfScopeViolation;
    /**
     * Contains details about the route endpoint that violates the policy scope.
     */
    RouteHasOutOfScopeEndpointViolation?: RouteHasOutOfScopeEndpointViolation;
    /**
     * The violation details for a third-party firewall that's been deleted.
     */
    ThirdPartyFirewallMissingFirewallViolation?: ThirdPartyFirewallMissingFirewallViolation;
    /**
     * The violation details for a third-party firewall's subnet that's been deleted.
     */
    ThirdPartyFirewallMissingSubnetViolation?: ThirdPartyFirewallMissingSubnetViolation;
    /**
     * The violation details for a third-party firewall that has the Firewall Manager managed route table that was associated with the third-party firewall has been deleted.
     */
    ThirdPartyFirewallMissingExpectedRouteTableViolation?: ThirdPartyFirewallMissingExpectedRouteTableViolation;
    /**
     * The violation details for a third-party firewall's VPC endpoint subnet that was deleted.
     */
    FirewallSubnetMissingVPCEndpointViolation?: FirewallSubnetMissingVPCEndpointViolation;
  }
  export type ResourceViolations = ResourceViolation[];
  export interface Route {
    /**
     * The type of destination for the route.
     */
    DestinationType?: DestinationType;
    /**
     * The type of target for the route.
     */
    TargetType?: TargetType;
    /**
     * The destination of the route.
     */
    Destination?: LengthBoundedString;
    /**
     * The route's target.
     */
    Target?: LengthBoundedString;
  }
  export interface RouteHasOutOfScopeEndpointViolation {
    /**
     * The ID of the subnet associated with the route that violates the policy scope.
     */
    SubnetId?: ResourceId;
    /**
     * The VPC ID of the route that violates the policy scope.
     */
    VpcId?: ResourceId;
    /**
     * The ID of the route table.
     */
    RouteTableId?: ResourceId;
    /**
     * The list of routes that violate the route table.
     */
    ViolatingRoutes?: Routes;
    /**
     * The subnet's Availability Zone.
     */
    SubnetAvailabilityZone?: LengthBoundedString;
    /**
     * The ID of the subnet's Availability Zone.
     */
    SubnetAvailabilityZoneId?: LengthBoundedString;
    /**
     * The route table associated with the current firewall subnet.
     */
    CurrentFirewallSubnetRouteTable?: ResourceId;
    /**
     * The ID of the firewall subnet.
     */
    FirewallSubnetId?: ResourceId;
    /**
     * The list of firewall subnet routes.
     */
    FirewallSubnetRoutes?: Routes;
    /**
     * The ID of the Internet Gateway.
     */
    InternetGatewayId?: ResourceId;
    /**
     * The current route table associated with the Internet Gateway.
     */
    CurrentInternetGatewayRouteTable?: ResourceId;
    /**
     * The routes in the route table associated with the Internet Gateway.
     */
    InternetGatewayRoutes?: Routes;
  }
  export type Routes = Route[];
  export type RuleOrder = "STRICT_ORDER"|"DEFAULT_ACTION_ORDER"|string;
  export interface SecurityGroupRemediationAction {
    /**
     * The remediation action that will be performed.
     */
    RemediationActionType?: RemediationActionType;
    /**
     * Brief description of the action that will be performed.
     */
    Description?: RemediationActionDescription;
    /**
     * The final state of the rule specified in the ViolationTarget after it is remediated.
     */
    RemediationResult?: SecurityGroupRuleDescription;
    /**
     * Indicates if the current action is the default action.
     */
    IsDefaultAction?: Boolean;
  }
  export type SecurityGroupRemediationActions = SecurityGroupRemediationAction[];
  export interface SecurityGroupRuleDescription {
    /**
     * The IPv4 ranges for the security group rule.
     */
    IPV4Range?: CIDR;
    /**
     * The IPv6 ranges for the security group rule.
     */
    IPV6Range?: CIDR;
    /**
     * The ID of the prefix list for the security group rule.
     */
    PrefixListId?: ResourceId;
    /**
     * The IP protocol name (tcp, udp, icmp, icmpv6) or number.
     */
    Protocol?: LengthBoundedString;
    /**
     * The start of the port range for the TCP and UDP protocols, or an ICMP/ICMPv6 type number. A value of -1 indicates all ICMP/ICMPv6 types.
     */
    FromPort?: IPPortNumber;
    /**
     * The end of the port range for the TCP and UDP protocols, or an ICMP/ICMPv6 code. A value of -1 indicates all ICMP/ICMPv6 codes.
     */
    ToPort?: IPPortNumber;
  }
  export interface SecurityServicePolicyData {
    /**
     * The service that the policy is using to protect the resources. This specifies the type of policy that is created, either an WAF policy, a Shield Advanced policy, or a security group policy. For security group policies, Firewall Manager supports one security group for each common policy and for each content audit policy. This is an adjustable limit that you can increase by contacting Amazon Web Services Support.
     */
    Type: SecurityServiceType;
    /**
     * Details about the service that are specific to the service type, in JSON format.    Example: DNS_FIREWALL   "{\"type\":\"DNS_FIREWALL\",\"preProcessRuleGroups\":[{\"ruleGroupId\":\"rslvr-frg-1\",\"priority\":10}],\"postProcessRuleGroups\":[{\"ruleGroupId\":\"rslvr-frg-2\",\"priority\":9911}]}"   Valid values for preProcessRuleGroups are between 1 and 99. Valid values for postProcessRuleGroups are between 9901 and 10000.    Example: IMPORT_NETWORK_FIREWALL "{\"type\":\"IMPORT_NETWORK_FIREWALL\",\"awsNetworkFirewallConfig\":{\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-west-2:000000000000:stateless-rulegroup\/rg1\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:drop\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:pass\"],\"networkFirewallStatelessCustomActions\":[],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-west-2:aws-managed:stateful-rulegroup\/ThreatSignaturesEmergingEventsStrictOrder\",\"priority\":8}],\"networkFirewallStatefulEngineOptions\":{\"ruleOrder\":\"STRICT_ORDER\"},\"networkFirewallStatefulDefaultActions\":[\"aws:drop_strict\"]}}"   "{\"type\":\"DNS_FIREWALL\",\"preProcessRuleGroups\":[{\"ruleGroupId\":\"rslvr-frg-1\",\"priority\":10}],\"postProcessRuleGroups\":[{\"ruleGroupId\":\"rslvr-frg-2\",\"priority\":9911}]}"   Valid values for preProcessRuleGroups are between 1 and 99. Valid values for postProcessRuleGroups are between 9901 and 10000.    Example: NETWORK_FIREWALL - Centralized deployment model  "{\"type\":\"NETWORK_FIREWALL\",\"awsNetworkFirewallConfig\":{\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateless-rulegroup/test\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"customActionName\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"metricdimensionvalue\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateful-rulegroup/test\"}],\"networkFirewallLoggingConfiguration\":{\"logDestinationConfigs\":[{\"logDestinationType\":\"S3\",\"logType\":\"ALERT\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}},{\"logDestinationType\":\"S3\",\"logType\":\"FLOW\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}}],\"overrideExistingConfig\":true}},\"firewallDeploymentModel\":{\"centralizedFirewallDeploymentModel\":{\"centralizedFirewallOrchestrationConfig\":{\"inspectionVpcIds\":[{\"resourceId\":\"vpc-1234\",\"accountId\":\"123456789011\"}],\"firewallCreationConfig\":{\"endpointLocation\":{\"availabilityZoneConfigList\":[{\"availabilityZoneId\":null,\"availabilityZoneName\":\"us-east-1a\",\"allowedIPV4CidrList\":[\"10.0.0.0/28\"]}]}},\"allowedIPV4CidrList\":[]}}}}"   To use the centralized deployment model, you must set PolicyOption to CENTRALIZED.    Example: NETWORK_FIREWALL - Distributed deployment model with automatic Availability Zone configuration   "{\"type\":\"NETWORK_FIREWALL\",\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateless-rulegroup/test\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"customActionName\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"metricdimensionvalue\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateful-rulegroup/test\"}],\"networkFirewallOrchestrationConfig\":{\"singleFirewallEndpointPerVPC\":false,\"allowedIPV4CidrList\":[\"10.0.0.0/28\",\"192.168.0.0/28\"],\"routeManagementAction\":\"OFF\"},\"networkFirewallLoggingConfiguration\":{\"logDestinationConfigs\":[{\"logDestinationType\":\"S3\",\"logType\":\"ALERT\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}},{\"logDestinationType\":\"S3\",\"logType\":\"FLOW\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}}],\"overrideExistingConfig\":true}}"    With automatic Availbility Zone configuration, Firewall Manager chooses which Availability Zones to create the endpoints in. To use the distributed deployment model, you must set PolicyOption to NULL.    Example: NETWORK_FIREWALL - Distributed deployment model with automatic Availability Zone configuration and route management   "{\"type\":\"NETWORK_FIREWALL\",\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateless-rulegroup/test\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"customActionName\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"metricdimensionvalue\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateful-rulegroup/test\"}],\"networkFirewallOrchestrationConfig\":{\"singleFirewallEndpointPerVPC\":false,\"allowedIPV4CidrList\":[\"10.0.0.0/28\",\"192.168.0.0/28\"],\"routeManagementAction\":\"MONITOR\",\"routeManagementTargetTypes\":[\"InternetGateway\"]},\"networkFirewallLoggingConfiguration\":{\"logDestinationConfigs\":[{\"logDestinationType\":\"S3\",\"logType\":\"ALERT\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}},{\"logDestinationType\":\"S3\",\"logType\": \"FLOW\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}}],\"overrideExistingConfig\":true}}"   To use the distributed deployment model, you must set PolicyOption to NULL.    Example: NETWORK_FIREWALL - Distributed deployment model with custom Availability Zone configuration  "{\"type\":\"NETWORK_FIREWALL\",\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateless-rulegroup/test\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\",\"fragmentcustomactionname\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"customActionName\", \"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"metricdimensionvalue\"}]}}},{\"actionName\":\"fragmentcustomactionname\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"fragmentmetricdimensionvalue\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateful-rulegroup/test\"}],\"networkFirewallOrchestrationConfig\":{\"firewallCreationConfig\":{ \"endpointLocation\":{\"availabilityZoneConfigList\":[{\"availabilityZoneName\":\"us-east-1a\",\"allowedIPV4CidrList\":[\"10.0.0.0/28\"]},{\"availabilityZoneName\":\"us-east-1b\",\"allowedIPV4CidrList\":[ \"10.0.0.0/28\"]}]} },\"singleFirewallEndpointPerVPC\":false,\"allowedIPV4CidrList\":null,\"routeManagementAction\":\"OFF\",\"networkFirewallLoggingConfiguration\":{\"logDestinationConfigs\":[{\"logDestinationType\":\"S3\",\"logType\":\"ALERT\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}},{\"logDestinationType\":\"S3\",\"logType\":\"FLOW\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}}],\"overrideExistingConfig\":boolean}}"    With custom Availability Zone configuration, you define which specific Availability Zones to create endpoints in by configuring firewallCreationConfig. To configure the Availability Zones in firewallCreationConfig, specify either the availabilityZoneName or availabilityZoneId parameter, not both parameters.  To use the distributed deployment model, you must set PolicyOption to NULL.    Example: NETWORK_FIREWALL - Distributed deployment model with custom Availability Zone configuration and route management  "{\"type\":\"NETWORK_FIREWALL\",\"networkFirewallStatelessRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateless-rulegroup/test\",\"priority\":1}],\"networkFirewallStatelessDefaultActions\":[\"aws:forward_to_sfe\",\"customActionName\"],\"networkFirewallStatelessFragmentDefaultActions\":[\"aws:forward_to_sfe\",\"fragmentcustomactionname\"],\"networkFirewallStatelessCustomActions\":[{\"actionName\":\"customActionName\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"metricdimensionvalue\"}]}}},{\"actionName\":\"fragmentcustomactionname\",\"actionDefinition\":{\"publishMetricAction\":{\"dimensions\":[{\"value\":\"fragmentmetricdimensionvalue\"}]}}}],\"networkFirewallStatefulRuleGroupReferences\":[{\"resourceARN\":\"arn:aws:network-firewall:us-east-1:123456789011:stateful-rulegroup/test\"}],\"networkFirewallOrchestrationConfig\":{\"firewallCreationConfig\":{\"endpointLocation\":{\"availabilityZoneConfigList\":[{\"availabilityZoneName\":\"us-east-1a\",\"allowedIPV4CidrList\":[\"10.0.0.0/28\"]},{\"availabilityZoneName\":\"us-east-1b\",\"allowedIPV4CidrList\":[\"10.0.0.0/28\"]}]}},\"singleFirewallEndpointPerVPC\":false,\"allowedIPV4CidrList\":null,\"routeManagementAction\":\"MONITOR\",\"routeManagementTargetTypes\":[\"InternetGateway\"],\"routeManagementConfig\":{\"allowCrossAZTrafficIfNoEndpoint\":true}},\"networkFirewallLoggingConfiguration\":{\"logDestinationConfigs\":[{\"logDestinationType\":\"S3\",\"logType\":\"ALERT\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}},{\"logDestinationType\":\"S3\",\"logType\":\"FLOW\",\"logDestination\":{\"bucketName\":\"s3-bucket-name\"}}],\"overrideExistingConfig\":boolean}}"   To use the distributed deployment model, you must set PolicyOption to NULL.    Example: THIRD_PARTY_FIREWALL   "{ "type":"THIRD_PARTY_FIREWALL", "thirdPartyFirewall":"PALO_ALTO_NETWORKS_CLOUD_NGFW", "thirdPartyFirewallConfig":{ "thirdPartyFirewallPolicyList":["global-1"] }, "firewallDeploymentModel":{ "distributedFirewallDeploymentModel":{ "distributedFirewallOrchestrationConfig":{ "firewallCreationConfig":{ "endpointLocation":{ "availabilityZoneConfigList":[ { "availabilityZoneName":"${AvailabilityZone}" } ] } }, "allowedIPV4CidrList":[ ] } } } }"    Example: SECURITY_GROUPS_COMMON   "{\"type\":\"SECURITY_GROUPS_COMMON\",\"revertManualSecurityGroupChanges\":false,\"exclusiveResourceSecurityGroupManagement\":false, \"applyToAllEC2InstanceENIs\":false,\"securityGroups\":[{\"id\":\" sg-000e55995d61a06bd\"}]}"    Example: SECURITY_GROUPS_COMMON - Security group tag distribution   ""{\"type\":\"SECURITY_GROUPS_COMMON\",\"securityGroups\":[{\"id\":\"sg-000e55995d61a06bd\"}],\"revertManualSecurityGroupChanges\":true,\"exclusiveResourceSecurityGroupManagement\":false,\"applyToAllEC2InstanceENIs\":false,\"includeSharedVPC\":false,\"enableTagDistribution\":true}""   Firewall Manager automatically distributes tags from the primary group to the security groups created by this policy. To use security group tag distribution, you must also set revertManualSecurityGroupChanges to true, otherwise Firewall Manager won't be able to create the policy. When you enable revertManualSecurityGroupChanges, Firewall Manager identifies and reports when the security groups created by this policy become non-compliant.   Firewall Manager won't distrubute system tags added by Amazon Web Services services into the replica security groups. System tags begin with the aws: prefix.    Example: Shared VPCs. Apply the preceding policy to resources in shared VPCs as well as to those in VPCs that the account owns   "{\"type\":\"SECURITY_GROUPS_COMMON\",\"revertManualSecurityGroupChanges\":false,\"exclusiveResourceSecurityGroupManagement\":false, \"applyToAllEC2InstanceENIs\":false,\"includeSharedVPC\":true,\"securityGroups\":[{\"id\":\" sg-000e55995d61a06bd\"}]}"    Example: SECURITY_GROUPS_CONTENT_AUDIT   "{\"type\":\"SECURITY_GROUPS_CONTENT_AUDIT\",\"securityGroups\":[{\"id\":\"sg-000e55995d61a06bd\"}],\"securityGroupAction\":{\"type\":\"ALLOW\"}}"  The security group action for content audit can be ALLOW or DENY. For ALLOW, all in-scope security group rules must be within the allowed range of the policy's security group rules. For DENY, all in-scope security group rules must not contain a value or a range that matches a rule value or range in the policy security group.   Example: SECURITY_GROUPS_USAGE_AUDIT   "{\"type\":\"SECURITY_GROUPS_USAGE_AUDIT\",\"deleteUnusedSecurityGroups\":true,\"coalesceRedundantSecurityGroups\":true}"    Specification for SHIELD_ADVANCED for Amazon CloudFront distributions   "{\"type\":\"SHIELD_ADVANCED\",\"automaticResponseConfiguration\": {\"automaticResponseStatus\":\"ENABLED|IGNORED|DISABLED\", \"automaticResponseAction\":\"BLOCK|COUNT\"}, \"overrideCustomerWebaclClassic\":true|false}"  For example: "{\"type\":\"SHIELD_ADVANCED\",\"automaticResponseConfiguration\": {\"automaticResponseStatus\":\"ENABLED\", \"automaticResponseAction\":\"COUNT\"}}"  The default value for automaticResponseStatus is IGNORED. The value for automaticResponseAction is only required when automaticResponseStatus is set to ENABLED. The default value for overrideCustomerWebaclClassic is false. For other resource types that you can protect with a Shield Advanced policy, this ManagedServiceData configuration is an empty string.   Example: WAFV2 - Account takeover prevention and Bot Control managed rule groups, and rule action override   "{\"type\":\"WAFV2\",\"preProcessRuleGroups\":[{\"ruleGroupArn\":null,\"overrideAction\":{\"type\":\"NONE\"},\"managedRuleGroupIdentifier\":{\"versionEnabled\":null,\"version\":null,\"vendorName\":\"AWS\",\"managedRuleGroupName\":\"AWSManagedRulesATPRuleSet\",\"managedRuleGroupConfigs\":[{\"awsmanagedRulesATPRuleSet\":{\"loginPath\":\"/loginpath\",\"requestInspection\":{\"payloadType\":\"FORM_ENCODED|JSON\",\"usernameField\":{\"identifier\":\"/form/username\"},\"passwordField\":{\"identifier\":\"/form/password\"}}}}]},\"ruleGroupType\":\"ManagedRuleGroup\",\"excludeRules\":[],\"sampledRequestsEnabled\":true},{\"ruleGroupArn\":null,\"overrideAction\":{\"type\":\"NONE\"},\"managedRuleGroupIdentifier\":{\"versionEnabled\":null,\"version\":null,\"vendorName\":\"AWS\",\"managedRuleGroupName\":\"AWSManagedRulesBotControlRuleSet\",\"managedRuleGroupConfigs\":[{\"awsmanagedRulesBotControlRuleSet\":{\"inspectionLevel\":\"TARGETED|COMMON\"}}]},\"ruleGroupType\":\"ManagedRuleGroup\",\"excludeRules\":[],\"sampledRequestsEnabled\":true,\"ruleActionOverrides\":[{\"name\":\"Rule1\",\"actionToUse\":{\"allow|block|count|captcha|challenge\":{}}},{\"name\":\"Rule2\",\"actionToUse\":{\"allow|block|count|captcha|challenge\":{}}}]}],\"postProcessRuleGroups\":[],\"defaultAction\":{\"type\":\"ALLOW\"},\"customRequestHandling\":null,\"customResponse\":null,\"overrideCustomerWebACLAssociation\":false,\"loggingConfiguration\":null,\"sampledRequestsEnabledForDefaultActions\":true}"    Fraud Control account takeover prevention (ATP) - For information about the properties available for AWSManagedRulesATPRuleSet managed rule groups, see AWSManagedRulesATPRuleSet in the WAF API Reference.   Bot Control - For information about AWSManagedRulesBotControlRuleSet managed rule groups, see AWSManagedRulesBotControlRuleSet in the WAF API Reference.   Rule action overrides - Firewall Manager supports rule action overrides only for managed rule groups. To configure a RuleActionOverrides add the Name of the rule to override, and ActionToUse, which is the new action to use for the rule. For information about using rule action override, see RuleActionOverride in the WAF API Reference.     Example: WAFV2 - CAPTCHA and Challenge configs   "{\"type\":\"WAFV2\",\"preProcessRuleGroups\":[{\"ruleGroupArn\":null,\"overrideAction\":{\"type\":\"NONE\"},\"managedRuleGroupIdentifier\":{\"versionEnabled\":null,\"version\":null,\"vendorName\":\"AWS\",\"managedRuleGroupName\":\"AWSManagedRulesAdminProtectionRuleSet\"},\"ruleGroupType\":\"ManagedRuleGroup\",\"excludeRules\":[],\"sampledRequestsEnabled\":true}],\"postProcessRuleGroups\":[],\"defaultAction\":{\"type\":\"ALLOW\"},\"customRequestHandling\":null,\"customResponse\":null,\"overrideCustomerWebACLAssociation\":false,\"loggingConfiguration\":null,\"sampledRequestsEnabledForDefaultActions\":true,\"captchaConfig\":{\"immunityTimeProperty\":{\"immunityTime\":500}},\"challengeConfig\":{\"immunityTimeProperty\":{\"immunityTime\":800}},\"tokenDomains\":[\"google.com\",\"amazon.com\"]}"  If you update the policy's values for captchaConfig, challengeConfig, or tokenDomains, Firewall Manager will overwrite your local web ACLs to contain the new value(s). However, if you don't update the policy's captchaConfig, challengeConfig, or tokenDomains values, the values in your local web ACLs will remain unchanged. For information about CAPTCHA and Challenge configs, see CaptchaConfig and ChallengeConfig in the WAF API Reference.   Example: WAFV2 - Firewall Manager support for WAF managed rule group versioning   "{\"type\":\"WAFV2\",\"preProcessRuleGroups\":[{\"ruleGroupArn\":null,\"overrideAction\":{\"type\":\"NONE\"},\"managedRuleGroupIdentifier\":{\"versionEnabled\":true,\"version\":\"Version_2.0\",\"vendorName\":\"AWS\",\"managedRuleGroupName\":\"AWSManagedRulesCommonRuleSet\"},\"ruleGroupType\":\"ManagedRuleGroup\",\"excludeRules\":[{\"name\":\"NoUserAgent_HEADER\"}]}],\"postProcessRuleGroups\":[],\"defaultAction\":{\"type\":\"ALLOW\"},\"overrideCustomerWebACLAssociation\":false,\"loggingConfiguration\":{\"logDestinationConfigs\":[\"arn:aws:firehose:us-west-2:12345678912:deliverystream/aws-waf-logs-fms-admin-destination\"],\"redactedFields\":[{\"redactedFieldType\":\"SingleHeader\",\"redactedFieldValue\":\"Cookies\"},{\"redactedFieldType\":\"Method\"}]}}"   To use a specific version of a WAF managed rule group in your Firewall Manager policy, you must set versionEnabled to true, and set version to the version you'd like to use. If you don't set versionEnabled to true, or if you omit versionEnabled, then Firewall Manager uses the default version of the WAF managed rule group.    Example: WAFV2 - Logging configurations   "{\"type\":\"WAFV2\",\"preProcessRuleGroups\":[{\"ruleGroupArn\":null, \"overrideAction\":{\"type\":\"NONE\"},\"managedRuleGroupIdentifier\": {\"versionEnabled\":null,\"version\":null,\"vendorName\":\"AWS\", \"managedRuleGroupName\":\"AWSManagedRulesAdminProtectionRuleSet\"} ,\"ruleGroupType\":\"ManagedRuleGroup\",\"excludeRules\":[], \"sampledRequestsEnabled\":true}],\"postProcessRuleGroups\":[], \"defaultAction\":{\"type\":\"ALLOW\"},\"customRequestHandling\" :null,\"customResponse\":null,\"overrideCustomerWebACLAssociation\" :false,\"loggingConfiguration\":{\"logDestinationConfigs\": [\"arn:aws:s3:::aws-waf-logs-example-bucket\"] ,\"redactedFields\":[],\"loggingFilterConfigs\":{\"defaultBehavior\":\"KEEP\", \"filters\":[{\"behavior\":\"KEEP\",\"requirement\":\"MEETS_ALL\", \"conditions\":[{\"actionCondition\":\"CAPTCHA\"},{\"actionCondition\": \"CHALLENGE\"}, {\"actionCondition\":\"EXCLUDED_AS_COUNT\"}]}]}},\"sampledRequestsEnabledForDefaultActions\":true}"  Firewall Manager supports Amazon Kinesis Data Firehose and Amazon S3 as the logDestinationConfigs in your loggingConfiguration. For information about WAF logging configurations, see LoggingConfiguration in the WAF API Reference  In the loggingConfiguration, you can specify one logDestinationConfigs. Optionally provide as many as 20 redactedFields. The RedactedFieldType must be one of URI, QUERY_STRING, HEADER, or METHOD.   Example: WAF Classic   "{\"type\": \"WAF\", \"ruleGroups\": [{\"id\":\"12345678-1bcd-9012-efga-0987654321ab\", \"overrideAction\" : {\"type\": \"COUNT\"}}], \"defaultAction\": {\"type\": \"BLOCK\"}}"   
     */
    ManagedServiceData?: ManagedServiceData;
    /**
     * Contains the Network Firewall firewall policy options to configure a centralized deployment model.
     */
    PolicyOption?: PolicyOption;
  }
  export type SecurityServiceType = "WAF"|"WAFV2"|"SHIELD_ADVANCED"|"SECURITY_GROUPS_COMMON"|"SECURITY_GROUPS_CONTENT_AUDIT"|"SECURITY_GROUPS_USAGE_AUDIT"|"NETWORK_FIREWALL"|"DNS_FIREWALL"|"THIRD_PARTY_FIREWALL"|"IMPORT_NETWORK_FIREWALL"|string;
  export type SecurityServiceTypeList = SecurityServiceType[];
  export interface StatefulEngineOptions {
    /**
     * Indicates how to manage the order of stateful rule evaluation for the policy. DEFAULT_ACTION_ORDER is the default behavior. Stateful rules are provided to the rule engine as Suricata compatible strings, and Suricata evaluates them based on certain settings. For more information, see Evaluation order for stateful rules in the Network Firewall Developer Guide.
     */
    RuleOrder?: RuleOrder;
  }
  export interface StatefulRuleGroup {
    /**
     * The name of the rule group.
     */
    RuleGroupName?: NetworkFirewallResourceName;
    /**
     * The resource ID of the rule group.
     */
    ResourceId?: ResourceId;
    /**
     * An integer setting that indicates the order in which to run the stateful rule groups in a single Network Firewall firewall policy. This setting only applies to firewall policies that specify the STRICT_ORDER rule order in the stateful engine options settings.  Network Firewall evalutes each stateful rule group against a packet starting with the group that has the lowest priority setting. You must ensure that the priority settings are unique within each policy. For information about   You can change the priority settings of your rule groups at any time. To make it easier to insert rule groups later, number them so there's a wide range in between, for example use 100, 200, and so on. 
     */
    Priority?: PriorityNumber;
    /**
     * The action that allows the policy owner to override the behavior of the rule group within a policy.
     */
    Override?: NetworkFirewallStatefulRuleGroupOverride;
  }
  export type StatefulRuleGroupList = StatefulRuleGroup[];
  export interface StatelessRuleGroup {
    /**
     * The name of the rule group.
     */
    RuleGroupName?: NetworkFirewallResourceName;
    /**
     * The resource ID of the rule group.
     */
    ResourceId?: ResourceId;
    /**
     * The priority of the rule group. Network Firewall evaluates the stateless rule groups in a firewall policy starting from the lowest priority setting. 
     */
    Priority?: StatelessRuleGroupPriority;
  }
  export type StatelessRuleGroupList = StatelessRuleGroup[];
  export type StatelessRuleGroupPriority = number;
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
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to return tags for. The Firewall Manager resources that support tagging are policies, applications lists, and protocols lists. 
     */
    ResourceArn: ResourceArn;
    /**
     * The tags to add to the resource.
     */
    TagList: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TargetType = "GATEWAY"|"CARRIER_GATEWAY"|"INSTANCE"|"LOCAL_GATEWAY"|"NAT_GATEWAY"|"NETWORK_INTERFACE"|"VPC_ENDPOINT"|"VPC_PEERING_CONNECTION"|"EGRESS_ONLY_INTERNET_GATEWAY"|"TRANSIT_GATEWAY"|string;
  export type TargetViolationReason = string;
  export type TargetViolationReasons = TargetViolationReason[];
  export type ThirdPartyFirewall = "PALO_ALTO_NETWORKS_CLOUD_NGFW"|"FORTIGATE_CLOUD_NATIVE_FIREWALL"|string;
  export type ThirdPartyFirewallAssociationStatus = "ONBOARDING"|"ONBOARD_COMPLETE"|"OFFBOARDING"|"OFFBOARD_COMPLETE"|"NOT_EXIST"|string;
  export type ThirdPartyFirewallFirewallPolicies = ThirdPartyFirewallFirewallPolicy[];
  export interface ThirdPartyFirewallFirewallPolicy {
    /**
     * The ID of the specified firewall policy.
     */
    FirewallPolicyId?: FirewallPolicyId;
    /**
     * The name of the specified firewall policy.
     */
    FirewallPolicyName?: FirewallPolicyName;
  }
  export interface ThirdPartyFirewallMissingExpectedRouteTableViolation {
    /**
     * The ID of the third-party firewall or VPC resource that's causing the violation.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * The resource ID of the VPC associated with a fireawll subnet that's causing the violation.
     */
    VPC?: ResourceId;
    /**
     * The Availability Zone of the firewall subnet that's causing the violation.
     */
    AvailabilityZone?: LengthBoundedString;
    /**
     * The resource ID of the current route table that's associated with the subnet, if one is available.
     */
    CurrentRouteTable?: ResourceId;
    /**
     * The resource ID of the route table that should be associated with the subnet.
     */
    ExpectedRouteTable?: ResourceId;
  }
  export interface ThirdPartyFirewallMissingFirewallViolation {
    /**
     * The ID of the third-party firewall that's causing the violation.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * The resource ID of the VPC associated with a third-party firewall.
     */
    VPC?: ResourceId;
    /**
     * The Availability Zone of the third-party firewall that's causing the violation.
     */
    AvailabilityZone?: LengthBoundedString;
    /**
     * The reason the resource is causing this violation, if a reason is available.
     */
    TargetViolationReason?: TargetViolationReason;
  }
  export interface ThirdPartyFirewallMissingSubnetViolation {
    /**
     * The ID of the third-party firewall or VPC resource that's causing the violation.
     */
    ViolationTarget?: ViolationTarget;
    /**
     * The resource ID of the VPC associated with a subnet that's causing the violation.
     */
    VPC?: ResourceId;
    /**
     * The Availability Zone of a subnet that's causing the violation.
     */
    AvailabilityZone?: LengthBoundedString;
    /**
     * The reason the resource is causing the violation, if a reason is available.
     */
    TargetViolationReason?: TargetViolationReason;
  }
  export interface ThirdPartyFirewallPolicy {
    /**
     * Defines the deployment model to use for the third-party firewall policy.
     */
    FirewallDeploymentModel?: FirewallDeploymentModel;
  }
  export type TimeStamp = Date;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to return tags for. The Firewall Manager resources that support tagging are policies, applications lists, and protocols lists. 
     */
    ResourceArn: ResourceArn;
    /**
     * The keys of the tags to remove from the resource. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export type UpdateToken = string;
  export interface ViolationDetail {
    /**
     * The ID of the Firewall Manager policy that the violation details were requested for.
     */
    PolicyId: PolicyId;
    /**
     * The Amazon Web Services account that the violation details were requested for.
     */
    MemberAccount: AWSAccountId;
    /**
     * The resource ID that the violation details were requested for.
     */
    ResourceId: ResourceId;
    /**
     * The resource type that the violation details were requested for.
     */
    ResourceType: ResourceType;
    /**
     * List of violations for the requested resource.
     */
    ResourceViolations: ResourceViolations;
    /**
     * The ResourceTag objects associated with the resource.
     */
    ResourceTags?: TagList;
    /**
     * Brief description for the requested resource.
     */
    ResourceDescription?: LengthBoundedString;
  }
  export type ViolationReason = "WEB_ACL_MISSING_RULE_GROUP"|"RESOURCE_MISSING_WEB_ACL"|"RESOURCE_INCORRECT_WEB_ACL"|"RESOURCE_MISSING_SHIELD_PROTECTION"|"RESOURCE_MISSING_WEB_ACL_OR_SHIELD_PROTECTION"|"RESOURCE_MISSING_SECURITY_GROUP"|"RESOURCE_VIOLATES_AUDIT_SECURITY_GROUP"|"SECURITY_GROUP_UNUSED"|"SECURITY_GROUP_REDUNDANT"|"FMS_CREATED_SECURITY_GROUP_EDITED"|"MISSING_FIREWALL"|"MISSING_FIREWALL_SUBNET_IN_AZ"|"MISSING_EXPECTED_ROUTE_TABLE"|"NETWORK_FIREWALL_POLICY_MODIFIED"|"FIREWALL_SUBNET_IS_OUT_OF_SCOPE"|"INTERNET_GATEWAY_MISSING_EXPECTED_ROUTE"|"FIREWALL_SUBNET_MISSING_EXPECTED_ROUTE"|"UNEXPECTED_FIREWALL_ROUTES"|"UNEXPECTED_TARGET_GATEWAY_ROUTES"|"TRAFFIC_INSPECTION_CROSSES_AZ_BOUNDARY"|"INVALID_ROUTE_CONFIGURATION"|"MISSING_TARGET_GATEWAY"|"INTERNET_TRAFFIC_NOT_INSPECTED"|"BLACK_HOLE_ROUTE_DETECTED"|"BLACK_HOLE_ROUTE_DETECTED_IN_FIREWALL_SUBNET"|"RESOURCE_MISSING_DNS_FIREWALL"|"ROUTE_HAS_OUT_OF_SCOPE_ENDPOINT"|"FIREWALL_SUBNET_MISSING_VPCE_ENDPOINT"|string;
  export type ViolationTarget = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-01-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the FMS client.
   */
  export import Types = FMS;
}
export = FMS;
