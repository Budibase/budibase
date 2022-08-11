import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Shield extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Shield.Types.ClientConfiguration)
  config: Config & Shield.Types.ClientConfiguration;
  /**
   * Authorizes the Shield Response Team (SRT) to access the specified Amazon S3 bucket containing log data such as Application Load Balancer access logs, CloudFront logs, or logs from third party sources. You can associate up to 10 Amazon S3 buckets with your subscription. To use the services of the SRT and make an AssociateDRTLogBucket request, you must be subscribed to the Business Support plan or the Enterprise Support plan.
   */
  associateDRTLogBucket(params: Shield.Types.AssociateDRTLogBucketRequest, callback?: (err: AWSError, data: Shield.Types.AssociateDRTLogBucketResponse) => void): Request<Shield.Types.AssociateDRTLogBucketResponse, AWSError>;
  /**
   * Authorizes the Shield Response Team (SRT) to access the specified Amazon S3 bucket containing log data such as Application Load Balancer access logs, CloudFront logs, or logs from third party sources. You can associate up to 10 Amazon S3 buckets with your subscription. To use the services of the SRT and make an AssociateDRTLogBucket request, you must be subscribed to the Business Support plan or the Enterprise Support plan.
   */
  associateDRTLogBucket(callback?: (err: AWSError, data: Shield.Types.AssociateDRTLogBucketResponse) => void): Request<Shield.Types.AssociateDRTLogBucketResponse, AWSError>;
  /**
   * Authorizes the Shield Response Team (SRT) using the specified role, to access your Amazon Web Services account to assist with DDoS attack mitigation during potential attacks. This enables the SRT to inspect your WAF configuration and create or update WAF rules and web ACLs. You can associate only one RoleArn with your subscription. If you submit an AssociateDRTRole request for an account that already has an associated role, the new RoleArn will replace the existing RoleArn.  Prior to making the AssociateDRTRole request, you must attach the AWSShieldDRTAccessPolicy managed policy to the role you will specify in the request. For more information see Attaching and Detaching IAM Policies. The role must also trust the service principal  drt.shield.amazonaws.com. For more information, see IAM JSON Policy Elements: Principal. The SRT will have access only to your WAF and Shield resources. By submitting this request, you authorize the SRT to inspect your WAF and Shield configuration and create and update WAF rules and web ACLs on your behalf. The SRT takes these actions only if explicitly authorized by you. You must have the iam:PassRole permission to make an AssociateDRTRole request. For more information, see Granting a User Permissions to Pass a Role to an Amazon Web Services Service.  To use the services of the SRT and make an AssociateDRTRole request, you must be subscribed to the Business Support plan or the Enterprise Support plan.
   */
  associateDRTRole(params: Shield.Types.AssociateDRTRoleRequest, callback?: (err: AWSError, data: Shield.Types.AssociateDRTRoleResponse) => void): Request<Shield.Types.AssociateDRTRoleResponse, AWSError>;
  /**
   * Authorizes the Shield Response Team (SRT) using the specified role, to access your Amazon Web Services account to assist with DDoS attack mitigation during potential attacks. This enables the SRT to inspect your WAF configuration and create or update WAF rules and web ACLs. You can associate only one RoleArn with your subscription. If you submit an AssociateDRTRole request for an account that already has an associated role, the new RoleArn will replace the existing RoleArn.  Prior to making the AssociateDRTRole request, you must attach the AWSShieldDRTAccessPolicy managed policy to the role you will specify in the request. For more information see Attaching and Detaching IAM Policies. The role must also trust the service principal  drt.shield.amazonaws.com. For more information, see IAM JSON Policy Elements: Principal. The SRT will have access only to your WAF and Shield resources. By submitting this request, you authorize the SRT to inspect your WAF and Shield configuration and create and update WAF rules and web ACLs on your behalf. The SRT takes these actions only if explicitly authorized by you. You must have the iam:PassRole permission to make an AssociateDRTRole request. For more information, see Granting a User Permissions to Pass a Role to an Amazon Web Services Service.  To use the services of the SRT and make an AssociateDRTRole request, you must be subscribed to the Business Support plan or the Enterprise Support plan.
   */
  associateDRTRole(callback?: (err: AWSError, data: Shield.Types.AssociateDRTRoleResponse) => void): Request<Shield.Types.AssociateDRTRoleResponse, AWSError>;
  /**
   * Adds health-based detection to the Shield Advanced protection for a resource. Shield Advanced health-based detection uses the health of your Amazon Web Services resource to improve responsiveness and accuracy in attack detection and mitigation.  You define the health check in Route 53 and then associate it with your Shield Advanced protection. For more information, see Shield Advanced Health-Based Detection in the WAF Developer Guide. 
   */
  associateHealthCheck(params: Shield.Types.AssociateHealthCheckRequest, callback?: (err: AWSError, data: Shield.Types.AssociateHealthCheckResponse) => void): Request<Shield.Types.AssociateHealthCheckResponse, AWSError>;
  /**
   * Adds health-based detection to the Shield Advanced protection for a resource. Shield Advanced health-based detection uses the health of your Amazon Web Services resource to improve responsiveness and accuracy in attack detection and mitigation.  You define the health check in Route 53 and then associate it with your Shield Advanced protection. For more information, see Shield Advanced Health-Based Detection in the WAF Developer Guide. 
   */
  associateHealthCheck(callback?: (err: AWSError, data: Shield.Types.AssociateHealthCheckResponse) => void): Request<Shield.Types.AssociateHealthCheckResponse, AWSError>;
  /**
   * Initializes proactive engagement and sets the list of contacts for the Shield Response Team (SRT) to use. You must provide at least one phone number in the emergency contact list.  After you have initialized proactive engagement using this call, to disable or enable proactive engagement, use the calls DisableProactiveEngagement and EnableProactiveEngagement.   This call defines the list of email addresses and phone numbers that the SRT can use to contact you for escalations to the SRT and to initiate proactive customer support. The contacts that you provide in the request replace any contacts that were already defined. If you already have contacts defined and want to use them, retrieve the list using DescribeEmergencyContactSettings and then provide it to this call.  
   */
  associateProactiveEngagementDetails(params: Shield.Types.AssociateProactiveEngagementDetailsRequest, callback?: (err: AWSError, data: Shield.Types.AssociateProactiveEngagementDetailsResponse) => void): Request<Shield.Types.AssociateProactiveEngagementDetailsResponse, AWSError>;
  /**
   * Initializes proactive engagement and sets the list of contacts for the Shield Response Team (SRT) to use. You must provide at least one phone number in the emergency contact list.  After you have initialized proactive engagement using this call, to disable or enable proactive engagement, use the calls DisableProactiveEngagement and EnableProactiveEngagement.   This call defines the list of email addresses and phone numbers that the SRT can use to contact you for escalations to the SRT and to initiate proactive customer support. The contacts that you provide in the request replace any contacts that were already defined. If you already have contacts defined and want to use them, retrieve the list using DescribeEmergencyContactSettings and then provide it to this call.  
   */
  associateProactiveEngagementDetails(callback?: (err: AWSError, data: Shield.Types.AssociateProactiveEngagementDetailsResponse) => void): Request<Shield.Types.AssociateProactiveEngagementDetailsResponse, AWSError>;
  /**
   * Enables Shield Advanced for a specific Amazon Web Services resource. The resource can be an Amazon CloudFront distribution, Elastic Load Balancing load balancer, Global Accelerator accelerator, Elastic IP Address, or an Amazon Route 53 hosted zone. You can add protection to only a single resource with each CreateProtection request. If you want to add protection to multiple resources at once, use the WAF console. For more information see Getting Started with Shield Advanced and Add Shield Advanced Protection to more Amazon Web Services Resources.
   */
  createProtection(params: Shield.Types.CreateProtectionRequest, callback?: (err: AWSError, data: Shield.Types.CreateProtectionResponse) => void): Request<Shield.Types.CreateProtectionResponse, AWSError>;
  /**
   * Enables Shield Advanced for a specific Amazon Web Services resource. The resource can be an Amazon CloudFront distribution, Elastic Load Balancing load balancer, Global Accelerator accelerator, Elastic IP Address, or an Amazon Route 53 hosted zone. You can add protection to only a single resource with each CreateProtection request. If you want to add protection to multiple resources at once, use the WAF console. For more information see Getting Started with Shield Advanced and Add Shield Advanced Protection to more Amazon Web Services Resources.
   */
  createProtection(callback?: (err: AWSError, data: Shield.Types.CreateProtectionResponse) => void): Request<Shield.Types.CreateProtectionResponse, AWSError>;
  /**
   * Creates a grouping of protected resources so they can be handled as a collective. This resource grouping improves the accuracy of detection and reduces false positives. 
   */
  createProtectionGroup(params: Shield.Types.CreateProtectionGroupRequest, callback?: (err: AWSError, data: Shield.Types.CreateProtectionGroupResponse) => void): Request<Shield.Types.CreateProtectionGroupResponse, AWSError>;
  /**
   * Creates a grouping of protected resources so they can be handled as a collective. This resource grouping improves the accuracy of detection and reduces false positives. 
   */
  createProtectionGroup(callback?: (err: AWSError, data: Shield.Types.CreateProtectionGroupResponse) => void): Request<Shield.Types.CreateProtectionGroupResponse, AWSError>;
  /**
   * Activates Shield Advanced for an account. When you initally create a subscription, your subscription is set to be automatically renewed at the end of the existing subscription period. You can change this by submitting an UpdateSubscription request. 
   */
  createSubscription(params: Shield.Types.CreateSubscriptionRequest, callback?: (err: AWSError, data: Shield.Types.CreateSubscriptionResponse) => void): Request<Shield.Types.CreateSubscriptionResponse, AWSError>;
  /**
   * Activates Shield Advanced for an account. When you initally create a subscription, your subscription is set to be automatically renewed at the end of the existing subscription period. You can change this by submitting an UpdateSubscription request. 
   */
  createSubscription(callback?: (err: AWSError, data: Shield.Types.CreateSubscriptionResponse) => void): Request<Shield.Types.CreateSubscriptionResponse, AWSError>;
  /**
   * Deletes an Shield Advanced Protection.
   */
  deleteProtection(params: Shield.Types.DeleteProtectionRequest, callback?: (err: AWSError, data: Shield.Types.DeleteProtectionResponse) => void): Request<Shield.Types.DeleteProtectionResponse, AWSError>;
  /**
   * Deletes an Shield Advanced Protection.
   */
  deleteProtection(callback?: (err: AWSError, data: Shield.Types.DeleteProtectionResponse) => void): Request<Shield.Types.DeleteProtectionResponse, AWSError>;
  /**
   * Removes the specified protection group.
   */
  deleteProtectionGroup(params: Shield.Types.DeleteProtectionGroupRequest, callback?: (err: AWSError, data: Shield.Types.DeleteProtectionGroupResponse) => void): Request<Shield.Types.DeleteProtectionGroupResponse, AWSError>;
  /**
   * Removes the specified protection group.
   */
  deleteProtectionGroup(callback?: (err: AWSError, data: Shield.Types.DeleteProtectionGroupResponse) => void): Request<Shield.Types.DeleteProtectionGroupResponse, AWSError>;
  /**
   * Removes Shield Advanced from an account. Shield Advanced requires a 1-year subscription commitment. You cannot delete a subscription prior to the completion of that commitment. 
   */
  deleteSubscription(params: Shield.Types.DeleteSubscriptionRequest, callback?: (err: AWSError, data: Shield.Types.DeleteSubscriptionResponse) => void): Request<Shield.Types.DeleteSubscriptionResponse, AWSError>;
  /**
   * Removes Shield Advanced from an account. Shield Advanced requires a 1-year subscription commitment. You cannot delete a subscription prior to the completion of that commitment. 
   */
  deleteSubscription(callback?: (err: AWSError, data: Shield.Types.DeleteSubscriptionResponse) => void): Request<Shield.Types.DeleteSubscriptionResponse, AWSError>;
  /**
   * Describes the details of a DDoS attack. 
   */
  describeAttack(params: Shield.Types.DescribeAttackRequest, callback?: (err: AWSError, data: Shield.Types.DescribeAttackResponse) => void): Request<Shield.Types.DescribeAttackResponse, AWSError>;
  /**
   * Describes the details of a DDoS attack. 
   */
  describeAttack(callback?: (err: AWSError, data: Shield.Types.DescribeAttackResponse) => void): Request<Shield.Types.DescribeAttackResponse, AWSError>;
  /**
   * Provides information about the number and type of attacks Shield has detected in the last year for all resources that belong to your account, regardless of whether you've defined Shield protections for them. This operation is available to Shield customers as well as to Shield Advanced customers. The operation returns data for the time range of midnight UTC, one year ago, to midnight UTC, today. For example, if the current time is 2020-10-26 15:39:32 PDT, equal to 2020-10-26 22:39:32 UTC, then the time range for the attack data returned is from 2019-10-26 00:00:00 UTC to 2020-10-26 00:00:00 UTC.  The time range indicates the period covered by the attack statistics data items.
   */
  describeAttackStatistics(params: Shield.Types.DescribeAttackStatisticsRequest, callback?: (err: AWSError, data: Shield.Types.DescribeAttackStatisticsResponse) => void): Request<Shield.Types.DescribeAttackStatisticsResponse, AWSError>;
  /**
   * Provides information about the number and type of attacks Shield has detected in the last year for all resources that belong to your account, regardless of whether you've defined Shield protections for them. This operation is available to Shield customers as well as to Shield Advanced customers. The operation returns data for the time range of midnight UTC, one year ago, to midnight UTC, today. For example, if the current time is 2020-10-26 15:39:32 PDT, equal to 2020-10-26 22:39:32 UTC, then the time range for the attack data returned is from 2019-10-26 00:00:00 UTC to 2020-10-26 00:00:00 UTC.  The time range indicates the period covered by the attack statistics data items.
   */
  describeAttackStatistics(callback?: (err: AWSError, data: Shield.Types.DescribeAttackStatisticsResponse) => void): Request<Shield.Types.DescribeAttackStatisticsResponse, AWSError>;
  /**
   * Returns the current role and list of Amazon S3 log buckets used by the Shield Response Team (SRT) to access your Amazon Web Services account while assisting with attack mitigation.
   */
  describeDRTAccess(params: Shield.Types.DescribeDRTAccessRequest, callback?: (err: AWSError, data: Shield.Types.DescribeDRTAccessResponse) => void): Request<Shield.Types.DescribeDRTAccessResponse, AWSError>;
  /**
   * Returns the current role and list of Amazon S3 log buckets used by the Shield Response Team (SRT) to access your Amazon Web Services account while assisting with attack mitigation.
   */
  describeDRTAccess(callback?: (err: AWSError, data: Shield.Types.DescribeDRTAccessResponse) => void): Request<Shield.Types.DescribeDRTAccessResponse, AWSError>;
  /**
   * A list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you if you have proactive engagement enabled, for escalations to the SRT and to initiate proactive customer support.
   */
  describeEmergencyContactSettings(params: Shield.Types.DescribeEmergencyContactSettingsRequest, callback?: (err: AWSError, data: Shield.Types.DescribeEmergencyContactSettingsResponse) => void): Request<Shield.Types.DescribeEmergencyContactSettingsResponse, AWSError>;
  /**
   * A list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you if you have proactive engagement enabled, for escalations to the SRT and to initiate proactive customer support.
   */
  describeEmergencyContactSettings(callback?: (err: AWSError, data: Shield.Types.DescribeEmergencyContactSettingsResponse) => void): Request<Shield.Types.DescribeEmergencyContactSettingsResponse, AWSError>;
  /**
   * Lists the details of a Protection object.
   */
  describeProtection(params: Shield.Types.DescribeProtectionRequest, callback?: (err: AWSError, data: Shield.Types.DescribeProtectionResponse) => void): Request<Shield.Types.DescribeProtectionResponse, AWSError>;
  /**
   * Lists the details of a Protection object.
   */
  describeProtection(callback?: (err: AWSError, data: Shield.Types.DescribeProtectionResponse) => void): Request<Shield.Types.DescribeProtectionResponse, AWSError>;
  /**
   * Returns the specification for the specified protection group.
   */
  describeProtectionGroup(params: Shield.Types.DescribeProtectionGroupRequest, callback?: (err: AWSError, data: Shield.Types.DescribeProtectionGroupResponse) => void): Request<Shield.Types.DescribeProtectionGroupResponse, AWSError>;
  /**
   * Returns the specification for the specified protection group.
   */
  describeProtectionGroup(callback?: (err: AWSError, data: Shield.Types.DescribeProtectionGroupResponse) => void): Request<Shield.Types.DescribeProtectionGroupResponse, AWSError>;
  /**
   * Provides details about the Shield Advanced subscription for an account.
   */
  describeSubscription(params: Shield.Types.DescribeSubscriptionRequest, callback?: (err: AWSError, data: Shield.Types.DescribeSubscriptionResponse) => void): Request<Shield.Types.DescribeSubscriptionResponse, AWSError>;
  /**
   * Provides details about the Shield Advanced subscription for an account.
   */
  describeSubscription(callback?: (err: AWSError, data: Shield.Types.DescribeSubscriptionResponse) => void): Request<Shield.Types.DescribeSubscriptionResponse, AWSError>;
  /**
   * Removes authorization from the Shield Response Team (SRT) to notify contacts about escalations to the SRT and to initiate proactive customer support.
   */
  disableProactiveEngagement(params: Shield.Types.DisableProactiveEngagementRequest, callback?: (err: AWSError, data: Shield.Types.DisableProactiveEngagementResponse) => void): Request<Shield.Types.DisableProactiveEngagementResponse, AWSError>;
  /**
   * Removes authorization from the Shield Response Team (SRT) to notify contacts about escalations to the SRT and to initiate proactive customer support.
   */
  disableProactiveEngagement(callback?: (err: AWSError, data: Shield.Types.DisableProactiveEngagementResponse) => void): Request<Shield.Types.DisableProactiveEngagementResponse, AWSError>;
  /**
   * Removes the Shield Response Team's (SRT) access to the specified Amazon S3 bucket containing the logs that you shared previously. To make a DisassociateDRTLogBucket request, you must be subscribed to the Business Support plan or the Enterprise Support plan. However, if you are not subscribed to one of these support plans, but had been previously and had granted the SRT access to your account, you can submit a DisassociateDRTLogBucket request to remove this access.
   */
  disassociateDRTLogBucket(params: Shield.Types.DisassociateDRTLogBucketRequest, callback?: (err: AWSError, data: Shield.Types.DisassociateDRTLogBucketResponse) => void): Request<Shield.Types.DisassociateDRTLogBucketResponse, AWSError>;
  /**
   * Removes the Shield Response Team's (SRT) access to the specified Amazon S3 bucket containing the logs that you shared previously. To make a DisassociateDRTLogBucket request, you must be subscribed to the Business Support plan or the Enterprise Support plan. However, if you are not subscribed to one of these support plans, but had been previously and had granted the SRT access to your account, you can submit a DisassociateDRTLogBucket request to remove this access.
   */
  disassociateDRTLogBucket(callback?: (err: AWSError, data: Shield.Types.DisassociateDRTLogBucketResponse) => void): Request<Shield.Types.DisassociateDRTLogBucketResponse, AWSError>;
  /**
   * Removes the Shield Response Team's (SRT) access to your Amazon Web Services account. To make a DisassociateDRTRole request, you must be subscribed to the Business Support plan or the Enterprise Support plan. However, if you are not subscribed to one of these support plans, but had been previously and had granted the SRT access to your account, you can submit a DisassociateDRTRole request to remove this access.
   */
  disassociateDRTRole(params: Shield.Types.DisassociateDRTRoleRequest, callback?: (err: AWSError, data: Shield.Types.DisassociateDRTRoleResponse) => void): Request<Shield.Types.DisassociateDRTRoleResponse, AWSError>;
  /**
   * Removes the Shield Response Team's (SRT) access to your Amazon Web Services account. To make a DisassociateDRTRole request, you must be subscribed to the Business Support plan or the Enterprise Support plan. However, if you are not subscribed to one of these support plans, but had been previously and had granted the SRT access to your account, you can submit a DisassociateDRTRole request to remove this access.
   */
  disassociateDRTRole(callback?: (err: AWSError, data: Shield.Types.DisassociateDRTRoleResponse) => void): Request<Shield.Types.DisassociateDRTRoleResponse, AWSError>;
  /**
   * Removes health-based detection from the Shield Advanced protection for a resource. Shield Advanced health-based detection uses the health of your Amazon Web Services resource to improve responsiveness and accuracy in attack detection and mitigation.  You define the health check in Route 53 and then associate or disassociate it with your Shield Advanced protection. For more information, see Shield Advanced Health-Based Detection in the WAF Developer Guide. 
   */
  disassociateHealthCheck(params: Shield.Types.DisassociateHealthCheckRequest, callback?: (err: AWSError, data: Shield.Types.DisassociateHealthCheckResponse) => void): Request<Shield.Types.DisassociateHealthCheckResponse, AWSError>;
  /**
   * Removes health-based detection from the Shield Advanced protection for a resource. Shield Advanced health-based detection uses the health of your Amazon Web Services resource to improve responsiveness and accuracy in attack detection and mitigation.  You define the health check in Route 53 and then associate or disassociate it with your Shield Advanced protection. For more information, see Shield Advanced Health-Based Detection in the WAF Developer Guide. 
   */
  disassociateHealthCheck(callback?: (err: AWSError, data: Shield.Types.DisassociateHealthCheckResponse) => void): Request<Shield.Types.DisassociateHealthCheckResponse, AWSError>;
  /**
   * Authorizes the Shield Response Team (SRT) to use email and phone to notify contacts about escalations to the SRT and to initiate proactive customer support.
   */
  enableProactiveEngagement(params: Shield.Types.EnableProactiveEngagementRequest, callback?: (err: AWSError, data: Shield.Types.EnableProactiveEngagementResponse) => void): Request<Shield.Types.EnableProactiveEngagementResponse, AWSError>;
  /**
   * Authorizes the Shield Response Team (SRT) to use email and phone to notify contacts about escalations to the SRT and to initiate proactive customer support.
   */
  enableProactiveEngagement(callback?: (err: AWSError, data: Shield.Types.EnableProactiveEngagementResponse) => void): Request<Shield.Types.EnableProactiveEngagementResponse, AWSError>;
  /**
   * Returns the SubscriptionState, either Active or Inactive.
   */
  getSubscriptionState(params: Shield.Types.GetSubscriptionStateRequest, callback?: (err: AWSError, data: Shield.Types.GetSubscriptionStateResponse) => void): Request<Shield.Types.GetSubscriptionStateResponse, AWSError>;
  /**
   * Returns the SubscriptionState, either Active or Inactive.
   */
  getSubscriptionState(callback?: (err: AWSError, data: Shield.Types.GetSubscriptionStateResponse) => void): Request<Shield.Types.GetSubscriptionStateResponse, AWSError>;
  /**
   * Returns all ongoing DDoS attacks or all DDoS attacks during a specified time period.
   */
  listAttacks(params: Shield.Types.ListAttacksRequest, callback?: (err: AWSError, data: Shield.Types.ListAttacksResponse) => void): Request<Shield.Types.ListAttacksResponse, AWSError>;
  /**
   * Returns all ongoing DDoS attacks or all DDoS attacks during a specified time period.
   */
  listAttacks(callback?: (err: AWSError, data: Shield.Types.ListAttacksResponse) => void): Request<Shield.Types.ListAttacksResponse, AWSError>;
  /**
   * Retrieves the ProtectionGroup objects for the account.
   */
  listProtectionGroups(params: Shield.Types.ListProtectionGroupsRequest, callback?: (err: AWSError, data: Shield.Types.ListProtectionGroupsResponse) => void): Request<Shield.Types.ListProtectionGroupsResponse, AWSError>;
  /**
   * Retrieves the ProtectionGroup objects for the account.
   */
  listProtectionGroups(callback?: (err: AWSError, data: Shield.Types.ListProtectionGroupsResponse) => void): Request<Shield.Types.ListProtectionGroupsResponse, AWSError>;
  /**
   * Lists all Protection objects for the account.
   */
  listProtections(params: Shield.Types.ListProtectionsRequest, callback?: (err: AWSError, data: Shield.Types.ListProtectionsResponse) => void): Request<Shield.Types.ListProtectionsResponse, AWSError>;
  /**
   * Lists all Protection objects for the account.
   */
  listProtections(callback?: (err: AWSError, data: Shield.Types.ListProtectionsResponse) => void): Request<Shield.Types.ListProtectionsResponse, AWSError>;
  /**
   * Retrieves the resources that are included in the protection group. 
   */
  listResourcesInProtectionGroup(params: Shield.Types.ListResourcesInProtectionGroupRequest, callback?: (err: AWSError, data: Shield.Types.ListResourcesInProtectionGroupResponse) => void): Request<Shield.Types.ListResourcesInProtectionGroupResponse, AWSError>;
  /**
   * Retrieves the resources that are included in the protection group. 
   */
  listResourcesInProtectionGroup(callback?: (err: AWSError, data: Shield.Types.ListResourcesInProtectionGroupResponse) => void): Request<Shield.Types.ListResourcesInProtectionGroupResponse, AWSError>;
  /**
   * Gets information about Amazon Web Services tags for a specified Amazon Resource Name (ARN) in Shield.
   */
  listTagsForResource(params: Shield.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Shield.Types.ListTagsForResourceResponse) => void): Request<Shield.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Gets information about Amazon Web Services tags for a specified Amazon Resource Name (ARN) in Shield.
   */
  listTagsForResource(callback?: (err: AWSError, data: Shield.Types.ListTagsForResourceResponse) => void): Request<Shield.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds or updates tags for a resource in Shield.
   */
  tagResource(params: Shield.Types.TagResourceRequest, callback?: (err: AWSError, data: Shield.Types.TagResourceResponse) => void): Request<Shield.Types.TagResourceResponse, AWSError>;
  /**
   * Adds or updates tags for a resource in Shield.
   */
  tagResource(callback?: (err: AWSError, data: Shield.Types.TagResourceResponse) => void): Request<Shield.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource in Shield.
   */
  untagResource(params: Shield.Types.UntagResourceRequest, callback?: (err: AWSError, data: Shield.Types.UntagResourceResponse) => void): Request<Shield.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource in Shield.
   */
  untagResource(callback?: (err: AWSError, data: Shield.Types.UntagResourceResponse) => void): Request<Shield.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the details of the list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you if you have proactive engagement enabled, for escalations to the SRT and to initiate proactive customer support.
   */
  updateEmergencyContactSettings(params: Shield.Types.UpdateEmergencyContactSettingsRequest, callback?: (err: AWSError, data: Shield.Types.UpdateEmergencyContactSettingsResponse) => void): Request<Shield.Types.UpdateEmergencyContactSettingsResponse, AWSError>;
  /**
   * Updates the details of the list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you if you have proactive engagement enabled, for escalations to the SRT and to initiate proactive customer support.
   */
  updateEmergencyContactSettings(callback?: (err: AWSError, data: Shield.Types.UpdateEmergencyContactSettingsResponse) => void): Request<Shield.Types.UpdateEmergencyContactSettingsResponse, AWSError>;
  /**
   * Updates an existing protection group. A protection group is a grouping of protected resources so they can be handled as a collective. This resource grouping improves the accuracy of detection and reduces false positives. 
   */
  updateProtectionGroup(params: Shield.Types.UpdateProtectionGroupRequest, callback?: (err: AWSError, data: Shield.Types.UpdateProtectionGroupResponse) => void): Request<Shield.Types.UpdateProtectionGroupResponse, AWSError>;
  /**
   * Updates an existing protection group. A protection group is a grouping of protected resources so they can be handled as a collective. This resource grouping improves the accuracy of detection and reduces false positives. 
   */
  updateProtectionGroup(callback?: (err: AWSError, data: Shield.Types.UpdateProtectionGroupResponse) => void): Request<Shield.Types.UpdateProtectionGroupResponse, AWSError>;
  /**
   * Updates the details of an existing subscription. Only enter values for parameters you want to change. Empty parameters are not updated.
   */
  updateSubscription(params: Shield.Types.UpdateSubscriptionRequest, callback?: (err: AWSError, data: Shield.Types.UpdateSubscriptionResponse) => void): Request<Shield.Types.UpdateSubscriptionResponse, AWSError>;
  /**
   * Updates the details of an existing subscription. Only enter values for parameters you want to change. Empty parameters are not updated.
   */
  updateSubscription(callback?: (err: AWSError, data: Shield.Types.UpdateSubscriptionResponse) => void): Request<Shield.Types.UpdateSubscriptionResponse, AWSError>;
}
declare namespace Shield {
  export interface AssociateDRTLogBucketRequest {
    /**
     * The Amazon S3 bucket that contains the logs that you want to share.
     */
    LogBucket: LogBucket;
  }
  export interface AssociateDRTLogBucketResponse {
  }
  export interface AssociateDRTRoleRequest {
    /**
     * The Amazon Resource Name (ARN) of the role the SRT will use to access your Amazon Web Services account. Prior to making the AssociateDRTRole request, you must attach the AWSShieldDRTAccessPolicy managed policy to this role. For more information see Attaching and Detaching IAM Policies.
     */
    RoleArn: RoleArn;
  }
  export interface AssociateDRTRoleResponse {
  }
  export interface AssociateHealthCheckRequest {
    /**
     * The unique identifier (ID) for the Protection object to add the health check association to. 
     */
    ProtectionId: ProtectionId;
    /**
     * The Amazon Resource Name (ARN) of the health check to associate with the protection.
     */
    HealthCheckArn: HealthCheckArn;
  }
  export interface AssociateHealthCheckResponse {
  }
  export interface AssociateProactiveEngagementDetailsRequest {
    /**
     * A list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you for escalations to the SRT and to initiate proactive customer support.  To enable proactive engagement, the contact list must include at least one phone number.  The contacts that you provide here replace any contacts that were already defined. If you already have contacts defined and want to use them, retrieve the list using DescribeEmergencyContactSettings and then provide it here.  
     */
    EmergencyContactList: EmergencyContactList;
  }
  export interface AssociateProactiveEngagementDetailsResponse {
  }
  export interface AttackDetail {
    /**
     * The unique identifier (ID) of the attack.
     */
    AttackId?: AttackId;
    /**
     * The ARN (Amazon Resource Name) of the resource that was attacked.
     */
    ResourceArn?: ResourceArn;
    /**
     * If applicable, additional detail about the resource being attacked, for example, IP address or URL.
     */
    SubResources?: SubResourceSummaryList;
    /**
     * The time the attack started, in Unix time in seconds. For more information see timestamp.
     */
    StartTime?: AttackTimestamp;
    /**
     * The time the attack ended, in Unix time in seconds. For more information see timestamp.
     */
    EndTime?: AttackTimestamp;
    /**
     * List of counters that describe the attack for the specified time period.
     */
    AttackCounters?: SummarizedCounterList;
    /**
     * The array of objects that provide details of the Shield event.  For infrastructure layer events (L3 and L4 events) after January 25, 2021, you can view metrics for top contributors in Amazon CloudWatch metrics. For more information, see Shield metrics and alarms in the WAF Developer Guide. 
     */
    AttackProperties?: AttackProperties;
    /**
     * List of mitigation actions taken for the attack.
     */
    Mitigations?: MitigationList;
  }
  export type AttackId = string;
  export type AttackLayer = "NETWORK"|"APPLICATION"|string;
  export type AttackProperties = AttackProperty[];
  export interface AttackProperty {
    /**
     * The type of Shield event that was observed. NETWORK indicates layer 3 and layer 4 events and APPLICATION indicates layer 7 events. For infrastructure layer events (L3 and L4 events) after January 25, 2021, you can view metrics for top contributors in Amazon CloudWatch metrics. For more information, see Shield metrics and alarms in the WAF Developer Guide. 
     */
    AttackLayer?: AttackLayer;
    /**
     * Defines the Shield event property information that is provided. The WORDPRESS_PINGBACK_REFLECTOR and WORDPRESS_PINGBACK_SOURCE values are valid only for WordPress reflective pingback events.
     */
    AttackPropertyIdentifier?: AttackPropertyIdentifier;
    /**
     * Contributor objects for the top five contributors to a Shield event. 
     */
    TopContributors?: TopContributors;
    /**
     * The unit used for the Contributor Value property. 
     */
    Unit?: Unit;
    /**
     * The total contributions made to this Shield event by all contributors.
     */
    Total?: Long;
  }
  export type AttackPropertyIdentifier = "DESTINATION_URL"|"REFERRER"|"SOURCE_ASN"|"SOURCE_COUNTRY"|"SOURCE_IP_ADDRESS"|"SOURCE_USER_AGENT"|"WORDPRESS_PINGBACK_REFLECTOR"|"WORDPRESS_PINGBACK_SOURCE"|string;
  export interface AttackStatisticsDataItem {
    /**
     * Information about the volume of attacks during the time period. If the accompanying AttackCount is zero, this setting might be empty.
     */
    AttackVolume?: AttackVolume;
    /**
     * The number of attacks detected during the time period. This is always present, but might be zero. 
     */
    AttackCount: Long;
  }
  export type AttackStatisticsDataList = AttackStatisticsDataItem[];
  export type AttackSummaries = AttackSummary[];
  export interface AttackSummary {
    /**
     * The unique identifier (ID) of the attack.
     */
    AttackId?: String;
    /**
     * The ARN (Amazon Resource Name) of the resource that was attacked.
     */
    ResourceArn?: String;
    /**
     * The start time of the attack, in Unix time in seconds. For more information see timestamp.
     */
    StartTime?: AttackTimestamp;
    /**
     * The end time of the attack, in Unix time in seconds. For more information see timestamp.
     */
    EndTime?: AttackTimestamp;
    /**
     * The list of attacks for a specified time period.
     */
    AttackVectors?: AttackVectorDescriptionList;
  }
  export type AttackTimestamp = Date;
  export interface AttackVectorDescription {
    /**
     * The attack type. Valid values:   UDP_TRAFFIC   UDP_FRAGMENT   GENERIC_UDP_REFLECTION   DNS_REFLECTION   NTP_REFLECTION   CHARGEN_REFLECTION   SSDP_REFLECTION   PORT_MAPPER   RIP_REFLECTION   SNMP_REFLECTION   MSSQL_REFLECTION   NET_BIOS_REFLECTION   SYN_FLOOD   ACK_FLOOD   REQUEST_FLOOD   HTTP_REFLECTION   UDS_REFLECTION   MEMCACHED_REFLECTION  
     */
    VectorType: String;
  }
  export type AttackVectorDescriptionList = AttackVectorDescription[];
  export interface AttackVolume {
    /**
     * A statistics object that uses bits per second as the unit. This is included for network level attacks. 
     */
    BitsPerSecond?: AttackVolumeStatistics;
    /**
     * A statistics object that uses packets per second as the unit. This is included for network level attacks. 
     */
    PacketsPerSecond?: AttackVolumeStatistics;
    /**
     * A statistics object that uses requests per second as the unit. This is included for application level attacks, and is only available for accounts that are subscribed to Shield Advanced.
     */
    RequestsPerSecond?: AttackVolumeStatistics;
  }
  export interface AttackVolumeStatistics {
    /**
     * The maximum attack volume observed for the given unit.
     */
    Max: Double;
  }
  export type AutoRenew = "ENABLED"|"DISABLED"|string;
  export type ContactNotes = string;
  export interface Contributor {
    /**
     * The name of the contributor. This is dependent on the AttackPropertyIdentifier. For example, if the AttackPropertyIdentifier is SOURCE_COUNTRY, the Name could be United States.
     */
    Name?: String;
    /**
     * The contribution of this contributor expressed in Protection units. For example 10,000.
     */
    Value?: Long;
  }
  export interface CreateProtectionGroupRequest {
    /**
     * The name of the protection group. You use this to identify the protection group in lists and to manage the protection group, for example to update, delete, or describe it. 
     */
    ProtectionGroupId: ProtectionGroupId;
    /**
     * Defines how Shield combines resource data for the group in order to detect, mitigate, and report events.   Sum - Use the total traffic across the group. This is a good choice for most cases. Examples include Elastic IP addresses for EC2 instances that scale manually or automatically.   Mean - Use the average of the traffic across the group. This is a good choice for resources that share traffic uniformly. Examples include accelerators and load balancers.   Max - Use the highest traffic from each resource. This is useful for resources that don't share traffic and for resources that share that traffic in a non-uniform way. Examples include Amazon CloudFront and origin resources for CloudFront distributions.  
     */
    Aggregation: ProtectionGroupAggregation;
    /**
     * The criteria to use to choose the protected resources for inclusion in the group. You can include all resources that have protections, provide a list of resource Amazon Resource Names (ARNs), or include all resources of a specified resource type. 
     */
    Pattern: ProtectionGroupPattern;
    /**
     * The resource type to include in the protection group. All protected resources of this type are included in the protection group. Newly protected resources of this type are automatically added to the group. You must set this when you set Pattern to BY_RESOURCE_TYPE and you must not set it for any other Pattern setting. 
     */
    ResourceType?: ProtectedResourceType;
    /**
     * The Amazon Resource Names (ARNs) of the resources to include in the protection group. You must set this when you set Pattern to ARBITRARY and you must not set it for any other Pattern setting. 
     */
    Members?: ProtectionGroupMembers;
    /**
     * One or more tag key-value pairs for the protection group.
     */
    Tags?: TagList;
  }
  export interface CreateProtectionGroupResponse {
  }
  export interface CreateProtectionRequest {
    /**
     * Friendly name for the Protection you are creating.
     */
    Name: ProtectionName;
    /**
     * The ARN (Amazon Resource Name) of the resource to be protected. The ARN should be in one of the following formats:   For an Application Load Balancer: arn:aws:elasticloadbalancing:region:account-id:loadbalancer/app/load-balancer-name/load-balancer-id     For an Elastic Load Balancer (Classic Load Balancer): arn:aws:elasticloadbalancing:region:account-id:loadbalancer/load-balancer-name     For an Amazon CloudFront distribution: arn:aws:cloudfront::account-id:distribution/distribution-id     For an Global Accelerator accelerator: arn:aws:globalaccelerator::account-id:accelerator/accelerator-id     For Amazon Route 53: arn:aws:route53:::hostedzone/hosted-zone-id     For an Elastic IP address: arn:aws:ec2:region:account-id:eip-allocation/allocation-id    
     */
    ResourceArn: ResourceArn;
    /**
     * One or more tag key-value pairs for the Protection object that is created.
     */
    Tags?: TagList;
  }
  export interface CreateProtectionResponse {
    /**
     * The unique identifier (ID) for the Protection object that is created.
     */
    ProtectionId?: ProtectionId;
  }
  export interface CreateSubscriptionRequest {
  }
  export interface CreateSubscriptionResponse {
  }
  export interface DeleteProtectionGroupRequest {
    /**
     * The name of the protection group. You use this to identify the protection group in lists and to manage the protection group, for example to update, delete, or describe it. 
     */
    ProtectionGroupId: ProtectionGroupId;
  }
  export interface DeleteProtectionGroupResponse {
  }
  export interface DeleteProtectionRequest {
    /**
     * The unique identifier (ID) for the Protection object to be deleted.
     */
    ProtectionId: ProtectionId;
  }
  export interface DeleteProtectionResponse {
  }
  export interface DeleteSubscriptionRequest {
  }
  export interface DeleteSubscriptionResponse {
  }
  export interface DescribeAttackRequest {
    /**
     * The unique identifier (ID) for the attack that to be described.
     */
    AttackId: AttackId;
  }
  export interface DescribeAttackResponse {
    /**
     * The attack that is described.
     */
    Attack?: AttackDetail;
  }
  export interface DescribeAttackStatisticsRequest {
  }
  export interface DescribeAttackStatisticsResponse {
    TimeRange: TimeRange;
    /**
     * The data that describes the attacks detected during the time period.
     */
    DataItems: AttackStatisticsDataList;
  }
  export interface DescribeDRTAccessRequest {
  }
  export interface DescribeDRTAccessResponse {
    /**
     * The Amazon Resource Name (ARN) of the role the SRT used to access your Amazon Web Services account.
     */
    RoleArn?: RoleArn;
    /**
     * The list of Amazon S3 buckets accessed by the SRT.
     */
    LogBucketList?: LogBucketList;
  }
  export interface DescribeEmergencyContactSettingsRequest {
  }
  export interface DescribeEmergencyContactSettingsResponse {
    /**
     * A list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you if you have proactive engagement enabled, for escalations to the SRT and to initiate proactive customer support.
     */
    EmergencyContactList?: EmergencyContactList;
  }
  export interface DescribeProtectionGroupRequest {
    /**
     * The name of the protection group. You use this to identify the protection group in lists and to manage the protection group, for example to update, delete, or describe it. 
     */
    ProtectionGroupId: ProtectionGroupId;
  }
  export interface DescribeProtectionGroupResponse {
    /**
     * A grouping of protected resources that you and Shield Advanced can monitor as a collective. This resource grouping improves the accuracy of detection and reduces false positives. 
     */
    ProtectionGroup: ProtectionGroup;
  }
  export interface DescribeProtectionRequest {
    /**
     * The unique identifier (ID) for the Protection object that is described. When submitting the DescribeProtection request you must provide either the ResourceArn or the ProtectionID, but not both.
     */
    ProtectionId?: ProtectionId;
    /**
     * The ARN (Amazon Resource Name) of the Amazon Web Services resource for the Protection object that is described. When submitting the DescribeProtection request you must provide either the ResourceArn or the ProtectionID, but not both.
     */
    ResourceArn?: ResourceArn;
  }
  export interface DescribeProtectionResponse {
    /**
     * The Protection object that is described.
     */
    Protection?: Protection;
  }
  export interface DescribeSubscriptionRequest {
  }
  export interface DescribeSubscriptionResponse {
    /**
     * The Shield Advanced subscription details for an account.
     */
    Subscription?: Subscription;
  }
  export interface DisableProactiveEngagementRequest {
  }
  export interface DisableProactiveEngagementResponse {
  }
  export interface DisassociateDRTLogBucketRequest {
    /**
     * The Amazon S3 bucket that contains the logs that you want to share.
     */
    LogBucket: LogBucket;
  }
  export interface DisassociateDRTLogBucketResponse {
  }
  export interface DisassociateDRTRoleRequest {
  }
  export interface DisassociateDRTRoleResponse {
  }
  export interface DisassociateHealthCheckRequest {
    /**
     * The unique identifier (ID) for the Protection object to remove the health check association from. 
     */
    ProtectionId: ProtectionId;
    /**
     * The Amazon Resource Name (ARN) of the health check that is associated with the protection.
     */
    HealthCheckArn: HealthCheckArn;
  }
  export interface DisassociateHealthCheckResponse {
  }
  export type Double = number;
  export type DurationInSeconds = number;
  export type EmailAddress = string;
  export interface EmergencyContact {
    /**
     * The email address for the contact.
     */
    EmailAddress: EmailAddress;
    /**
     * The phone number for the contact.
     */
    PhoneNumber?: PhoneNumber;
    /**
     * Additional notes regarding the contact. 
     */
    ContactNotes?: ContactNotes;
  }
  export type EmergencyContactList = EmergencyContact[];
  export interface EnableProactiveEngagementRequest {
  }
  export interface EnableProactiveEngagementResponse {
  }
  export interface GetSubscriptionStateRequest {
  }
  export interface GetSubscriptionStateResponse {
    /**
     * The status of the subscription.
     */
    SubscriptionState: SubscriptionState;
  }
  export type HealthCheckArn = string;
  export type HealthCheckId = string;
  export type HealthCheckIds = HealthCheckId[];
  export type Integer = number;
  export interface Limit {
    /**
     * The type of protection.
     */
    Type?: String;
    /**
     * The maximum number of protections that can be created for the specified Type.
     */
    Max?: Long;
  }
  export type Limits = Limit[];
  export interface ListAttacksRequest {
    /**
     * The ARN (Amazon Resource Name) of the resource that was attacked. If this is left blank, all applicable resources for this account will be included.
     */
    ResourceArns?: ResourceArnFilterList;
    /**
     * The start of the time period for the attacks. This is a timestamp type. The sample request above indicates a number type because the default used by WAF is Unix time in seconds. However any valid timestamp format is allowed. 
     */
    StartTime?: TimeRange;
    /**
     * The end of the time period for the attacks. This is a timestamp type. The sample request above indicates a number type because the default used by WAF is Unix time in seconds. However any valid timestamp format is allowed. 
     */
    EndTime?: TimeRange;
    /**
     * The ListAttacksRequest.NextMarker value from a previous call to ListAttacksRequest. Pass null if this is the first call.
     */
    NextToken?: Token;
    /**
     * The maximum number of AttackSummary objects to return. If you leave this blank, Shield Advanced returns the first 20 results. This is a maximum value. Shield Advanced might return the results in smaller batches. That is, the number of objects returned could be less than MaxResults, even if there are still more objects yet to return. If there are more objects to return, Shield Advanced returns a value in NextToken that you can use in your next request, to get the next batch of objects.
     */
    MaxResults?: MaxResults;
  }
  export interface ListAttacksResponse {
    /**
     * The attack information for the specified time range.
     */
    AttackSummaries?: AttackSummaries;
    /**
     * The token returned by a previous call to indicate that there is more data available. If not null, more results are available. Pass this value for the NextMarker parameter in a subsequent call to ListAttacks to retrieve the next set of items. Shield Advanced might return the list of AttackSummary objects in batches smaller than the number specified by MaxResults. If there are more attack summary objects to return, Shield Advanced will always also return a NextToken.
     */
    NextToken?: Token;
  }
  export interface ListProtectionGroupsRequest {
    /**
     * The next token value from a previous call to ListProtectionGroups. Pass null if this is the first call.
     */
    NextToken?: Token;
    /**
     * The maximum number of ProtectionGroup objects to return. If you leave this blank, Shield Advanced returns the first 20 results. This is a maximum value. Shield Advanced might return the results in smaller batches. That is, the number of objects returned could be less than MaxResults, even if there are still more objects yet to return. If there are more objects to return, Shield Advanced returns a value in NextToken that you can use in your next request, to get the next batch of objects.
     */
    MaxResults?: MaxResults;
  }
  export interface ListProtectionGroupsResponse {
    /**
     * 
     */
    ProtectionGroups: ProtectionGroups;
    /**
     * If you specify a value for MaxResults and you have more protection groups than the value of MaxResults, Shield Advanced returns this token that you can use in your next request, to get the next batch of objects. 
     */
    NextToken?: Token;
  }
  export interface ListProtectionsRequest {
    /**
     * The ListProtectionsRequest.NextToken value from a previous call to ListProtections. Pass null if this is the first call.
     */
    NextToken?: Token;
    /**
     * The maximum number of Protection objects to return. If you leave this blank, Shield Advanced returns the first 20 results. This is a maximum value. Shield Advanced might return the results in smaller batches. That is, the number of objects returned could be less than MaxResults, even if there are still more objects yet to return. If there are more objects to return, Shield Advanced returns a value in NextToken that you can use in your next request, to get the next batch of objects.
     */
    MaxResults?: MaxResults;
  }
  export interface ListProtectionsResponse {
    /**
     * The array of enabled Protection objects.
     */
    Protections?: Protections;
    /**
     * If you specify a value for MaxResults and you have more Protections than the value of MaxResults, Shield Advanced returns a NextToken value in the response that allows you to list another group of Protections. For the second and subsequent ListProtections requests, specify the value of NextToken from the previous response to get information about another batch of Protections. Shield Advanced might return the list of Protection objects in batches smaller than the number specified by MaxResults. If there are more Protection objects to return, Shield Advanced will always also return a NextToken.
     */
    NextToken?: Token;
  }
  export interface ListResourcesInProtectionGroupRequest {
    /**
     * The name of the protection group. You use this to identify the protection group in lists and to manage the protection group, for example to update, delete, or describe it. 
     */
    ProtectionGroupId: ProtectionGroupId;
    /**
     * The next token value from a previous call to ListResourcesInProtectionGroup. Pass null if this is the first call.
     */
    NextToken?: Token;
    /**
     * The maximum number of resource ARN objects to return. If you leave this blank, Shield Advanced returns the first 20 results. This is a maximum value. Shield Advanced might return the results in smaller batches. That is, the number of objects returned could be less than MaxResults, even if there are still more objects yet to return. If there are more objects to return, Shield Advanced returns a value in NextToken that you can use in your next request, to get the next batch of objects.
     */
    MaxResults?: MaxResults;
  }
  export interface ListResourcesInProtectionGroupResponse {
    /**
     * The Amazon Resource Names (ARNs) of the resources that are included in the protection group.
     */
    ResourceArns: ResourceArnList;
    /**
     * If you specify a value for MaxResults and you have more resources in the protection group than the value of MaxResults, Shield Advanced returns this token that you can use in your next request, to get the next batch of objects. 
     */
    NextToken?: Token;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to get tags for.
     */
    ResourceARN: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of tag key and value pairs associated with the specified resource.
     */
    Tags?: TagList;
  }
  export type LogBucket = string;
  export type LogBucketList = LogBucket[];
  export type Long = number;
  export type MaxResults = number;
  export interface Mitigation {
    /**
     * The name of the mitigation taken for this attack.
     */
    MitigationName?: String;
  }
  export type MitigationList = Mitigation[];
  export type PhoneNumber = string;
  export type ProactiveEngagementStatus = "ENABLED"|"DISABLED"|"PENDING"|string;
  export type ProtectedResourceType = "CLOUDFRONT_DISTRIBUTION"|"ROUTE_53_HOSTED_ZONE"|"ELASTIC_IP_ALLOCATION"|"CLASSIC_LOAD_BALANCER"|"APPLICATION_LOAD_BALANCER"|"GLOBAL_ACCELERATOR"|string;
  export interface Protection {
    /**
     * The unique identifier (ID) of the protection.
     */
    Id?: ProtectionId;
    /**
     * The name of the protection. For example, My CloudFront distributions.
     */
    Name?: ProtectionName;
    /**
     * The ARN (Amazon Resource Name) of the Amazon Web Services resource that is protected.
     */
    ResourceArn?: ResourceArn;
    /**
     * The unique identifier (ID) for the Route 53 health check that's associated with the protection. 
     */
    HealthCheckIds?: HealthCheckIds;
    /**
     * The ARN (Amazon Resource Name) of the protection.
     */
    ProtectionArn?: ResourceArn;
  }
  export interface ProtectionGroup {
    /**
     * The name of the protection group. You use this to identify the protection group in lists and to manage the protection group, for example to update, delete, or describe it. 
     */
    ProtectionGroupId: ProtectionGroupId;
    /**
     * Defines how Shield combines resource data for the group in order to detect, mitigate, and report events.   Sum - Use the total traffic across the group. This is a good choice for most cases. Examples include Elastic IP addresses for EC2 instances that scale manually or automatically.   Mean - Use the average of the traffic across the group. This is a good choice for resources that share traffic uniformly. Examples include accelerators and load balancers.   Max - Use the highest traffic from each resource. This is useful for resources that don't share traffic and for resources that share that traffic in a non-uniform way. Examples include Amazon CloudFront distributions and origin resources for CloudFront distributions.  
     */
    Aggregation: ProtectionGroupAggregation;
    /**
     * The criteria to use to choose the protected resources for inclusion in the group. You can include all resources that have protections, provide a list of resource Amazon Resource Names (ARNs), or include all resources of a specified resource type.
     */
    Pattern: ProtectionGroupPattern;
    /**
     * The resource type to include in the protection group. All protected resources of this type are included in the protection group. You must set this when you set Pattern to BY_RESOURCE_TYPE and you must not set it for any other Pattern setting. 
     */
    ResourceType?: ProtectedResourceType;
    /**
     * The Amazon Resource Names (ARNs) of the resources to include in the protection group. You must set this when you set Pattern to ARBITRARY and you must not set it for any other Pattern setting. 
     */
    Members: ProtectionGroupMembers;
    /**
     * The ARN (Amazon Resource Name) of the protection group.
     */
    ProtectionGroupArn?: ResourceArn;
  }
  export type ProtectionGroupAggregation = "SUM"|"MEAN"|"MAX"|string;
  export interface ProtectionGroupArbitraryPatternLimits {
    /**
     * The maximum number of resources you can specify for a single arbitrary pattern in a protection group.
     */
    MaxMembers: Long;
  }
  export type ProtectionGroupId = string;
  export interface ProtectionGroupLimits {
    /**
     * The maximum number of protection groups that you can have at one time. 
     */
    MaxProtectionGroups: Long;
    /**
     * Limits settings by pattern type in the protection groups for your subscription. 
     */
    PatternTypeLimits: ProtectionGroupPatternTypeLimits;
  }
  export type ProtectionGroupMembers = ResourceArn[];
  export type ProtectionGroupPattern = "ALL"|"ARBITRARY"|"BY_RESOURCE_TYPE"|string;
  export interface ProtectionGroupPatternTypeLimits {
    /**
     * Limits settings on protection groups with arbitrary pattern type. 
     */
    ArbitraryPatternLimits: ProtectionGroupArbitraryPatternLimits;
  }
  export type ProtectionGroups = ProtectionGroup[];
  export type ProtectionId = string;
  export interface ProtectionLimits {
    /**
     * The maximum number of resource types that you can specify in a protection.
     */
    ProtectedResourceTypeLimits: Limits;
  }
  export type ProtectionName = string;
  export type Protections = Protection[];
  export type ResourceArn = string;
  export type ResourceArnFilterList = ResourceArn[];
  export type ResourceArnList = ResourceArn[];
  export type RoleArn = string;
  export type String = string;
  export interface SubResourceSummary {
    /**
     * The SubResource type.
     */
    Type?: SubResourceType;
    /**
     * The unique identifier (ID) of the SubResource.
     */
    Id?: String;
    /**
     * The list of attack types and associated counters.
     */
    AttackVectors?: SummarizedAttackVectorList;
    /**
     * The counters that describe the details of the attack.
     */
    Counters?: SummarizedCounterList;
  }
  export type SubResourceSummaryList = SubResourceSummary[];
  export type SubResourceType = "IP"|"URL"|string;
  export interface Subscription {
    /**
     * The start time of the subscription, in Unix time in seconds. For more information see timestamp.
     */
    StartTime?: Timestamp;
    /**
     * The date and time your subscription will end.
     */
    EndTime?: Timestamp;
    /**
     * The length, in seconds, of the Shield Advanced subscription for the account.
     */
    TimeCommitmentInSeconds?: DurationInSeconds;
    /**
     * If ENABLED, the subscription will be automatically renewed at the end of the existing subscription period. When you initally create a subscription, AutoRenew is set to ENABLED. You can change this by submitting an UpdateSubscription request. If the UpdateSubscription request does not included a value for AutoRenew, the existing value for AutoRenew remains unchanged.
     */
    AutoRenew?: AutoRenew;
    /**
     * Specifies how many protections of a given type you can create.
     */
    Limits?: Limits;
    /**
     * If ENABLED, the Shield Response Team (SRT) will use email and phone to notify contacts about escalations to the SRT and to initiate proactive customer support. If PENDING, you have requested proactive engagement and the request is pending. The status changes to ENABLED when your request is fully processed. If DISABLED, the SRT will not proactively notify contacts about escalations or to initiate proactive customer support. 
     */
    ProactiveEngagementStatus?: ProactiveEngagementStatus;
    /**
     * Limits settings for your subscription. 
     */
    SubscriptionLimits: SubscriptionLimits;
    /**
     * The ARN (Amazon Resource Name) of the subscription.
     */
    SubscriptionArn?: ResourceArn;
  }
  export interface SubscriptionLimits {
    /**
     * Limits settings on protections for your subscription. 
     */
    ProtectionLimits: ProtectionLimits;
    /**
     * Limits settings on protection groups for your subscription. 
     */
    ProtectionGroupLimits: ProtectionGroupLimits;
  }
  export type SubscriptionState = "ACTIVE"|"INACTIVE"|string;
  export interface SummarizedAttackVector {
    /**
     * The attack type, for example, SNMP reflection or SYN flood.
     */
    VectorType: String;
    /**
     * The list of counters that describe the details of the attack.
     */
    VectorCounters?: SummarizedCounterList;
  }
  export type SummarizedAttackVectorList = SummarizedAttackVector[];
  export interface SummarizedCounter {
    /**
     * The counter name.
     */
    Name?: String;
    /**
     * The maximum value of the counter for a specified time period.
     */
    Max?: Double;
    /**
     * The average value of the counter for a specified time period.
     */
    Average?: Double;
    /**
     * The total of counter values for a specified time period.
     */
    Sum?: Double;
    /**
     * The number of counters for a specified time period.
     */
    N?: Integer;
    /**
     * The unit of the counters.
     */
    Unit?: String;
  }
  export type SummarizedCounterList = SummarizedCounter[];
  export interface Tag {
    /**
     * Part of the key:value pair that defines a tag. You can use a tag key to describe a category of information, such as "customer." Tag keys are case-sensitive.
     */
    Key?: TagKey;
    /**
     * Part of the key:value pair that defines a tag. You can use a tag value to describe a specific value within a category, such as "companyA" or "companyB." Tag values are case-sensitive.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to add or update tags for.
     */
    ResourceARN: ResourceArn;
    /**
     * The tags that you want to modify or add to the resource.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TimeRange {
    /**
     * The start time, in Unix time in seconds. For more information see timestamp.
     */
    FromInclusive?: AttackTimestamp;
    /**
     * The end time, in Unix time in seconds. For more information see timestamp.
     */
    ToExclusive?: AttackTimestamp;
  }
  export type Timestamp = Date;
  export type Token = string;
  export type TopContributors = Contributor[];
  export type Unit = "BITS"|"BYTES"|"PACKETS"|"REQUESTS"|string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to remove tags from.
     */
    ResourceARN: ResourceArn;
    /**
     * The tag key for each tag that you want to remove from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateEmergencyContactSettingsRequest {
    /**
     * A list of email addresses and phone numbers that the Shield Response Team (SRT) can use to contact you if you have proactive engagement enabled, for escalations to the SRT and to initiate proactive customer support. If you have proactive engagement enabled, the contact list must include at least one phone number.
     */
    EmergencyContactList?: EmergencyContactList;
  }
  export interface UpdateEmergencyContactSettingsResponse {
  }
  export interface UpdateProtectionGroupRequest {
    /**
     * The name of the protection group. You use this to identify the protection group in lists and to manage the protection group, for example to update, delete, or describe it. 
     */
    ProtectionGroupId: ProtectionGroupId;
    /**
     * Defines how Shield combines resource data for the group in order to detect, mitigate, and report events.   Sum - Use the total traffic across the group. This is a good choice for most cases. Examples include Elastic IP addresses for EC2 instances that scale manually or automatically.   Mean - Use the average of the traffic across the group. This is a good choice for resources that share traffic uniformly. Examples include accelerators and load balancers.   Max - Use the highest traffic from each resource. This is useful for resources that don't share traffic and for resources that share that traffic in a non-uniform way. Examples include Amazon CloudFront distributions and origin resources for CloudFront distributions.  
     */
    Aggregation: ProtectionGroupAggregation;
    /**
     * The criteria to use to choose the protected resources for inclusion in the group. You can include all resources that have protections, provide a list of resource Amazon Resource Names (ARNs), or include all resources of a specified resource type.
     */
    Pattern: ProtectionGroupPattern;
    /**
     * The resource type to include in the protection group. All protected resources of this type are included in the protection group. You must set this when you set Pattern to BY_RESOURCE_TYPE and you must not set it for any other Pattern setting. 
     */
    ResourceType?: ProtectedResourceType;
    /**
     * The Amazon Resource Names (ARNs) of the resources to include in the protection group. You must set this when you set Pattern to ARBITRARY and you must not set it for any other Pattern setting. 
     */
    Members?: ProtectionGroupMembers;
  }
  export interface UpdateProtectionGroupResponse {
  }
  export interface UpdateSubscriptionRequest {
    /**
     * When you initally create a subscription, AutoRenew is set to ENABLED. If ENABLED, the subscription will be automatically renewed at the end of the existing subscription period. You can change this by submitting an UpdateSubscription request. If the UpdateSubscription request does not included a value for AutoRenew, the existing value for AutoRenew remains unchanged.
     */
    AutoRenew?: AutoRenew;
  }
  export interface UpdateSubscriptionResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-06-02"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Shield client.
   */
  export import Types = Shield;
}
export = Shield;
