import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class PinpointEmail extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: PinpointEmail.Types.ClientConfiguration)
  config: Config & PinpointEmail.Types.ClientConfiguration;
  /**
   * Create a configuration set. Configuration sets are groups of rules that you can apply to the emails you send using Amazon Pinpoint. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email. 
   */
  createConfigurationSet(params: PinpointEmail.Types.CreateConfigurationSetRequest, callback?: (err: AWSError, data: PinpointEmail.Types.CreateConfigurationSetResponse) => void): Request<PinpointEmail.Types.CreateConfigurationSetResponse, AWSError>;
  /**
   * Create a configuration set. Configuration sets are groups of rules that you can apply to the emails you send using Amazon Pinpoint. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email. 
   */
  createConfigurationSet(callback?: (err: AWSError, data: PinpointEmail.Types.CreateConfigurationSetResponse) => void): Request<PinpointEmail.Types.CreateConfigurationSetResponse, AWSError>;
  /**
   * Create an event destination. In Amazon Pinpoint, events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage. A single configuration set can include more than one event destination.
   */
  createConfigurationSetEventDestination(params: PinpointEmail.Types.CreateConfigurationSetEventDestinationRequest, callback?: (err: AWSError, data: PinpointEmail.Types.CreateConfigurationSetEventDestinationResponse) => void): Request<PinpointEmail.Types.CreateConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Create an event destination. In Amazon Pinpoint, events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage. A single configuration set can include more than one event destination.
   */
  createConfigurationSetEventDestination(callback?: (err: AWSError, data: PinpointEmail.Types.CreateConfigurationSetEventDestinationResponse) => void): Request<PinpointEmail.Types.CreateConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Create a new pool of dedicated IP addresses. A pool can include one or more dedicated IP addresses that are associated with your Amazon Pinpoint account. You can associate a pool with a configuration set. When you send an email that uses that configuration set, Amazon Pinpoint sends it using only the IP addresses in the associated pool.
   */
  createDedicatedIpPool(params: PinpointEmail.Types.CreateDedicatedIpPoolRequest, callback?: (err: AWSError, data: PinpointEmail.Types.CreateDedicatedIpPoolResponse) => void): Request<PinpointEmail.Types.CreateDedicatedIpPoolResponse, AWSError>;
  /**
   * Create a new pool of dedicated IP addresses. A pool can include one or more dedicated IP addresses that are associated with your Amazon Pinpoint account. You can associate a pool with a configuration set. When you send an email that uses that configuration set, Amazon Pinpoint sends it using only the IP addresses in the associated pool.
   */
  createDedicatedIpPool(callback?: (err: AWSError, data: PinpointEmail.Types.CreateDedicatedIpPoolResponse) => void): Request<PinpointEmail.Types.CreateDedicatedIpPoolResponse, AWSError>;
  /**
   * Create a new predictive inbox placement test. Predictive inbox placement tests can help you predict how your messages will be handled by various email providers around the world. When you perform a predictive inbox placement test, you provide a sample message that contains the content that you plan to send to your customers. Amazon Pinpoint then sends that message to special email addresses spread across several major email providers. After about 24 hours, the test is complete, and you can use the GetDeliverabilityTestReport operation to view the results of the test.
   */
  createDeliverabilityTestReport(params: PinpointEmail.Types.CreateDeliverabilityTestReportRequest, callback?: (err: AWSError, data: PinpointEmail.Types.CreateDeliverabilityTestReportResponse) => void): Request<PinpointEmail.Types.CreateDeliverabilityTestReportResponse, AWSError>;
  /**
   * Create a new predictive inbox placement test. Predictive inbox placement tests can help you predict how your messages will be handled by various email providers around the world. When you perform a predictive inbox placement test, you provide a sample message that contains the content that you plan to send to your customers. Amazon Pinpoint then sends that message to special email addresses spread across several major email providers. After about 24 hours, the test is complete, and you can use the GetDeliverabilityTestReport operation to view the results of the test.
   */
  createDeliverabilityTestReport(callback?: (err: AWSError, data: PinpointEmail.Types.CreateDeliverabilityTestReportResponse) => void): Request<PinpointEmail.Types.CreateDeliverabilityTestReportResponse, AWSError>;
  /**
   * Verifies an email identity for use with Amazon Pinpoint. In Amazon Pinpoint, an identity is an email address or domain that you use when you send email. Before you can use an identity to send email with Amazon Pinpoint, you first have to verify it. By verifying an address, you demonstrate that you're the owner of the address, and that you've given Amazon Pinpoint permission to send email from the address. When you verify an email address, Amazon Pinpoint sends an email to the address. Your email address is verified as soon as you follow the link in the verification email.  When you verify a domain, this operation provides a set of DKIM tokens, which you can convert into CNAME tokens. You add these CNAME tokens to the DNS configuration for your domain. Your domain is verified when Amazon Pinpoint detects these records in the DNS configuration for your domain. It usually takes around 72 hours to complete the domain verification process.
   */
  createEmailIdentity(params: PinpointEmail.Types.CreateEmailIdentityRequest, callback?: (err: AWSError, data: PinpointEmail.Types.CreateEmailIdentityResponse) => void): Request<PinpointEmail.Types.CreateEmailIdentityResponse, AWSError>;
  /**
   * Verifies an email identity for use with Amazon Pinpoint. In Amazon Pinpoint, an identity is an email address or domain that you use when you send email. Before you can use an identity to send email with Amazon Pinpoint, you first have to verify it. By verifying an address, you demonstrate that you're the owner of the address, and that you've given Amazon Pinpoint permission to send email from the address. When you verify an email address, Amazon Pinpoint sends an email to the address. Your email address is verified as soon as you follow the link in the verification email.  When you verify a domain, this operation provides a set of DKIM tokens, which you can convert into CNAME tokens. You add these CNAME tokens to the DNS configuration for your domain. Your domain is verified when Amazon Pinpoint detects these records in the DNS configuration for your domain. It usually takes around 72 hours to complete the domain verification process.
   */
  createEmailIdentity(callback?: (err: AWSError, data: PinpointEmail.Types.CreateEmailIdentityResponse) => void): Request<PinpointEmail.Types.CreateEmailIdentityResponse, AWSError>;
  /**
   * Delete an existing configuration set. In Amazon Pinpoint, configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  deleteConfigurationSet(params: PinpointEmail.Types.DeleteConfigurationSetRequest, callback?: (err: AWSError, data: PinpointEmail.Types.DeleteConfigurationSetResponse) => void): Request<PinpointEmail.Types.DeleteConfigurationSetResponse, AWSError>;
  /**
   * Delete an existing configuration set. In Amazon Pinpoint, configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  deleteConfigurationSet(callback?: (err: AWSError, data: PinpointEmail.Types.DeleteConfigurationSetResponse) => void): Request<PinpointEmail.Types.DeleteConfigurationSetResponse, AWSError>;
  /**
   * Delete an event destination. In Amazon Pinpoint, events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  deleteConfigurationSetEventDestination(params: PinpointEmail.Types.DeleteConfigurationSetEventDestinationRequest, callback?: (err: AWSError, data: PinpointEmail.Types.DeleteConfigurationSetEventDestinationResponse) => void): Request<PinpointEmail.Types.DeleteConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Delete an event destination. In Amazon Pinpoint, events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  deleteConfigurationSetEventDestination(callback?: (err: AWSError, data: PinpointEmail.Types.DeleteConfigurationSetEventDestinationResponse) => void): Request<PinpointEmail.Types.DeleteConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Delete a dedicated IP pool.
   */
  deleteDedicatedIpPool(params: PinpointEmail.Types.DeleteDedicatedIpPoolRequest, callback?: (err: AWSError, data: PinpointEmail.Types.DeleteDedicatedIpPoolResponse) => void): Request<PinpointEmail.Types.DeleteDedicatedIpPoolResponse, AWSError>;
  /**
   * Delete a dedicated IP pool.
   */
  deleteDedicatedIpPool(callback?: (err: AWSError, data: PinpointEmail.Types.DeleteDedicatedIpPoolResponse) => void): Request<PinpointEmail.Types.DeleteDedicatedIpPoolResponse, AWSError>;
  /**
   * Deletes an email identity that you previously verified for use with Amazon Pinpoint. An identity can be either an email address or a domain name.
   */
  deleteEmailIdentity(params: PinpointEmail.Types.DeleteEmailIdentityRequest, callback?: (err: AWSError, data: PinpointEmail.Types.DeleteEmailIdentityResponse) => void): Request<PinpointEmail.Types.DeleteEmailIdentityResponse, AWSError>;
  /**
   * Deletes an email identity that you previously verified for use with Amazon Pinpoint. An identity can be either an email address or a domain name.
   */
  deleteEmailIdentity(callback?: (err: AWSError, data: PinpointEmail.Types.DeleteEmailIdentityResponse) => void): Request<PinpointEmail.Types.DeleteEmailIdentityResponse, AWSError>;
  /**
   * Obtain information about the email-sending status and capabilities of your Amazon Pinpoint account in the current AWS Region.
   */
  getAccount(params: PinpointEmail.Types.GetAccountRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetAccountResponse) => void): Request<PinpointEmail.Types.GetAccountResponse, AWSError>;
  /**
   * Obtain information about the email-sending status and capabilities of your Amazon Pinpoint account in the current AWS Region.
   */
  getAccount(callback?: (err: AWSError, data: PinpointEmail.Types.GetAccountResponse) => void): Request<PinpointEmail.Types.GetAccountResponse, AWSError>;
  /**
   * Retrieve a list of the blacklists that your dedicated IP addresses appear on.
   */
  getBlacklistReports(params: PinpointEmail.Types.GetBlacklistReportsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetBlacklistReportsResponse) => void): Request<PinpointEmail.Types.GetBlacklistReportsResponse, AWSError>;
  /**
   * Retrieve a list of the blacklists that your dedicated IP addresses appear on.
   */
  getBlacklistReports(callback?: (err: AWSError, data: PinpointEmail.Types.GetBlacklistReportsResponse) => void): Request<PinpointEmail.Types.GetBlacklistReportsResponse, AWSError>;
  /**
   * Get information about an existing configuration set, including the dedicated IP pool that it's associated with, whether or not it's enabled for sending email, and more. In Amazon Pinpoint, configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  getConfigurationSet(params: PinpointEmail.Types.GetConfigurationSetRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetConfigurationSetResponse) => void): Request<PinpointEmail.Types.GetConfigurationSetResponse, AWSError>;
  /**
   * Get information about an existing configuration set, including the dedicated IP pool that it's associated with, whether or not it's enabled for sending email, and more. In Amazon Pinpoint, configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  getConfigurationSet(callback?: (err: AWSError, data: PinpointEmail.Types.GetConfigurationSetResponse) => void): Request<PinpointEmail.Types.GetConfigurationSetResponse, AWSError>;
  /**
   * Retrieve a list of event destinations that are associated with a configuration set. In Amazon Pinpoint, events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  getConfigurationSetEventDestinations(params: PinpointEmail.Types.GetConfigurationSetEventDestinationsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetConfigurationSetEventDestinationsResponse) => void): Request<PinpointEmail.Types.GetConfigurationSetEventDestinationsResponse, AWSError>;
  /**
   * Retrieve a list of event destinations that are associated with a configuration set. In Amazon Pinpoint, events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  getConfigurationSetEventDestinations(callback?: (err: AWSError, data: PinpointEmail.Types.GetConfigurationSetEventDestinationsResponse) => void): Request<PinpointEmail.Types.GetConfigurationSetEventDestinationsResponse, AWSError>;
  /**
   * Get information about a dedicated IP address, including the name of the dedicated IP pool that it's associated with, as well information about the automatic warm-up process for the address.
   */
  getDedicatedIp(params: PinpointEmail.Types.GetDedicatedIpRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetDedicatedIpResponse) => void): Request<PinpointEmail.Types.GetDedicatedIpResponse, AWSError>;
  /**
   * Get information about a dedicated IP address, including the name of the dedicated IP pool that it's associated with, as well information about the automatic warm-up process for the address.
   */
  getDedicatedIp(callback?: (err: AWSError, data: PinpointEmail.Types.GetDedicatedIpResponse) => void): Request<PinpointEmail.Types.GetDedicatedIpResponse, AWSError>;
  /**
   * List the dedicated IP addresses that are associated with your Amazon Pinpoint account.
   */
  getDedicatedIps(params: PinpointEmail.Types.GetDedicatedIpsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetDedicatedIpsResponse) => void): Request<PinpointEmail.Types.GetDedicatedIpsResponse, AWSError>;
  /**
   * List the dedicated IP addresses that are associated with your Amazon Pinpoint account.
   */
  getDedicatedIps(callback?: (err: AWSError, data: PinpointEmail.Types.GetDedicatedIpsResponse) => void): Request<PinpointEmail.Types.GetDedicatedIpsResponse, AWSError>;
  /**
   * Retrieve information about the status of the Deliverability dashboard for your Amazon Pinpoint account. When the Deliverability dashboard is enabled, you gain access to reputation, deliverability, and other metrics for the domains that you use to send email using Amazon Pinpoint. You also gain the ability to perform predictive inbox placement tests. When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition to any other fees that you accrue by using Amazon Pinpoint. For more information about the features and cost of a Deliverability dashboard subscription, see Amazon Pinpoint Pricing.
   */
  getDeliverabilityDashboardOptions(params: PinpointEmail.Types.GetDeliverabilityDashboardOptionsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetDeliverabilityDashboardOptionsResponse) => void): Request<PinpointEmail.Types.GetDeliverabilityDashboardOptionsResponse, AWSError>;
  /**
   * Retrieve information about the status of the Deliverability dashboard for your Amazon Pinpoint account. When the Deliverability dashboard is enabled, you gain access to reputation, deliverability, and other metrics for the domains that you use to send email using Amazon Pinpoint. You also gain the ability to perform predictive inbox placement tests. When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition to any other fees that you accrue by using Amazon Pinpoint. For more information about the features and cost of a Deliverability dashboard subscription, see Amazon Pinpoint Pricing.
   */
  getDeliverabilityDashboardOptions(callback?: (err: AWSError, data: PinpointEmail.Types.GetDeliverabilityDashboardOptionsResponse) => void): Request<PinpointEmail.Types.GetDeliverabilityDashboardOptionsResponse, AWSError>;
  /**
   * Retrieve the results of a predictive inbox placement test.
   */
  getDeliverabilityTestReport(params: PinpointEmail.Types.GetDeliverabilityTestReportRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetDeliverabilityTestReportResponse) => void): Request<PinpointEmail.Types.GetDeliverabilityTestReportResponse, AWSError>;
  /**
   * Retrieve the results of a predictive inbox placement test.
   */
  getDeliverabilityTestReport(callback?: (err: AWSError, data: PinpointEmail.Types.GetDeliverabilityTestReportResponse) => void): Request<PinpointEmail.Types.GetDeliverabilityTestReportResponse, AWSError>;
  /**
   * Retrieve all the deliverability data for a specific campaign. This data is available for a campaign only if the campaign sent email by using a domain that the Deliverability dashboard is enabled for (PutDeliverabilityDashboardOption operation).
   */
  getDomainDeliverabilityCampaign(params: PinpointEmail.Types.GetDomainDeliverabilityCampaignRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetDomainDeliverabilityCampaignResponse) => void): Request<PinpointEmail.Types.GetDomainDeliverabilityCampaignResponse, AWSError>;
  /**
   * Retrieve all the deliverability data for a specific campaign. This data is available for a campaign only if the campaign sent email by using a domain that the Deliverability dashboard is enabled for (PutDeliverabilityDashboardOption operation).
   */
  getDomainDeliverabilityCampaign(callback?: (err: AWSError, data: PinpointEmail.Types.GetDomainDeliverabilityCampaignResponse) => void): Request<PinpointEmail.Types.GetDomainDeliverabilityCampaignResponse, AWSError>;
  /**
   * Retrieve inbox placement and engagement rates for the domains that you use to send email.
   */
  getDomainStatisticsReport(params: PinpointEmail.Types.GetDomainStatisticsReportRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetDomainStatisticsReportResponse) => void): Request<PinpointEmail.Types.GetDomainStatisticsReportResponse, AWSError>;
  /**
   * Retrieve inbox placement and engagement rates for the domains that you use to send email.
   */
  getDomainStatisticsReport(callback?: (err: AWSError, data: PinpointEmail.Types.GetDomainStatisticsReportResponse) => void): Request<PinpointEmail.Types.GetDomainStatisticsReportResponse, AWSError>;
  /**
   * Provides information about a specific identity associated with your Amazon Pinpoint account, including the identity's verification status, its DKIM authentication status, and its custom Mail-From settings.
   */
  getEmailIdentity(params: PinpointEmail.Types.GetEmailIdentityRequest, callback?: (err: AWSError, data: PinpointEmail.Types.GetEmailIdentityResponse) => void): Request<PinpointEmail.Types.GetEmailIdentityResponse, AWSError>;
  /**
   * Provides information about a specific identity associated with your Amazon Pinpoint account, including the identity's verification status, its DKIM authentication status, and its custom Mail-From settings.
   */
  getEmailIdentity(callback?: (err: AWSError, data: PinpointEmail.Types.GetEmailIdentityResponse) => void): Request<PinpointEmail.Types.GetEmailIdentityResponse, AWSError>;
  /**
   * List all of the configuration sets associated with your Amazon Pinpoint account in the current region. In Amazon Pinpoint, configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  listConfigurationSets(params: PinpointEmail.Types.ListConfigurationSetsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.ListConfigurationSetsResponse) => void): Request<PinpointEmail.Types.ListConfigurationSetsResponse, AWSError>;
  /**
   * List all of the configuration sets associated with your Amazon Pinpoint account in the current region. In Amazon Pinpoint, configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  listConfigurationSets(callback?: (err: AWSError, data: PinpointEmail.Types.ListConfigurationSetsResponse) => void): Request<PinpointEmail.Types.ListConfigurationSetsResponse, AWSError>;
  /**
   * List all of the dedicated IP pools that exist in your Amazon Pinpoint account in the current AWS Region.
   */
  listDedicatedIpPools(params: PinpointEmail.Types.ListDedicatedIpPoolsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.ListDedicatedIpPoolsResponse) => void): Request<PinpointEmail.Types.ListDedicatedIpPoolsResponse, AWSError>;
  /**
   * List all of the dedicated IP pools that exist in your Amazon Pinpoint account in the current AWS Region.
   */
  listDedicatedIpPools(callback?: (err: AWSError, data: PinpointEmail.Types.ListDedicatedIpPoolsResponse) => void): Request<PinpointEmail.Types.ListDedicatedIpPoolsResponse, AWSError>;
  /**
   * Show a list of the predictive inbox placement tests that you've performed, regardless of their statuses. For predictive inbox placement tests that are complete, you can use the GetDeliverabilityTestReport operation to view the results.
   */
  listDeliverabilityTestReports(params: PinpointEmail.Types.ListDeliverabilityTestReportsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.ListDeliverabilityTestReportsResponse) => void): Request<PinpointEmail.Types.ListDeliverabilityTestReportsResponse, AWSError>;
  /**
   * Show a list of the predictive inbox placement tests that you've performed, regardless of their statuses. For predictive inbox placement tests that are complete, you can use the GetDeliverabilityTestReport operation to view the results.
   */
  listDeliverabilityTestReports(callback?: (err: AWSError, data: PinpointEmail.Types.ListDeliverabilityTestReportsResponse) => void): Request<PinpointEmail.Types.ListDeliverabilityTestReportsResponse, AWSError>;
  /**
   * Retrieve deliverability data for all the campaigns that used a specific domain to send email during a specified time range. This data is available for a domain only if you enabled the Deliverability dashboard (PutDeliverabilityDashboardOption operation) for the domain.
   */
  listDomainDeliverabilityCampaigns(params: PinpointEmail.Types.ListDomainDeliverabilityCampaignsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.ListDomainDeliverabilityCampaignsResponse) => void): Request<PinpointEmail.Types.ListDomainDeliverabilityCampaignsResponse, AWSError>;
  /**
   * Retrieve deliverability data for all the campaigns that used a specific domain to send email during a specified time range. This data is available for a domain only if you enabled the Deliverability dashboard (PutDeliverabilityDashboardOption operation) for the domain.
   */
  listDomainDeliverabilityCampaigns(callback?: (err: AWSError, data: PinpointEmail.Types.ListDomainDeliverabilityCampaignsResponse) => void): Request<PinpointEmail.Types.ListDomainDeliverabilityCampaignsResponse, AWSError>;
  /**
   * Returns a list of all of the email identities that are associated with your Amazon Pinpoint account. An identity can be either an email address or a domain. This operation returns identities that are verified as well as those that aren't.
   */
  listEmailIdentities(params: PinpointEmail.Types.ListEmailIdentitiesRequest, callback?: (err: AWSError, data: PinpointEmail.Types.ListEmailIdentitiesResponse) => void): Request<PinpointEmail.Types.ListEmailIdentitiesResponse, AWSError>;
  /**
   * Returns a list of all of the email identities that are associated with your Amazon Pinpoint account. An identity can be either an email address or a domain. This operation returns identities that are verified as well as those that aren't.
   */
  listEmailIdentities(callback?: (err: AWSError, data: PinpointEmail.Types.ListEmailIdentitiesResponse) => void): Request<PinpointEmail.Types.ListEmailIdentitiesResponse, AWSError>;
  /**
   * Retrieve a list of the tags (keys and values) that are associated with a specified resource. A tag is a label that you optionally define and associate with a resource in Amazon Pinpoint. Each tag consists of a required tag key and an optional associated tag value. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  listTagsForResource(params: PinpointEmail.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: PinpointEmail.Types.ListTagsForResourceResponse) => void): Request<PinpointEmail.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieve a list of the tags (keys and values) that are associated with a specified resource. A tag is a label that you optionally define and associate with a resource in Amazon Pinpoint. Each tag consists of a required tag key and an optional associated tag value. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  listTagsForResource(callback?: (err: AWSError, data: PinpointEmail.Types.ListTagsForResourceResponse) => void): Request<PinpointEmail.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Enable or disable the automatic warm-up feature for dedicated IP addresses.
   */
  putAccountDedicatedIpWarmupAttributes(params: PinpointEmail.Types.PutAccountDedicatedIpWarmupAttributesRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutAccountDedicatedIpWarmupAttributesResponse) => void): Request<PinpointEmail.Types.PutAccountDedicatedIpWarmupAttributesResponse, AWSError>;
  /**
   * Enable or disable the automatic warm-up feature for dedicated IP addresses.
   */
  putAccountDedicatedIpWarmupAttributes(callback?: (err: AWSError, data: PinpointEmail.Types.PutAccountDedicatedIpWarmupAttributesResponse) => void): Request<PinpointEmail.Types.PutAccountDedicatedIpWarmupAttributesResponse, AWSError>;
  /**
   * Enable or disable the ability of your account to send email.
   */
  putAccountSendingAttributes(params: PinpointEmail.Types.PutAccountSendingAttributesRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutAccountSendingAttributesResponse) => void): Request<PinpointEmail.Types.PutAccountSendingAttributesResponse, AWSError>;
  /**
   * Enable or disable the ability of your account to send email.
   */
  putAccountSendingAttributes(callback?: (err: AWSError, data: PinpointEmail.Types.PutAccountSendingAttributesResponse) => void): Request<PinpointEmail.Types.PutAccountSendingAttributesResponse, AWSError>;
  /**
   * Associate a configuration set with a dedicated IP pool. You can use dedicated IP pools to create groups of dedicated IP addresses for sending specific types of email.
   */
  putConfigurationSetDeliveryOptions(params: PinpointEmail.Types.PutConfigurationSetDeliveryOptionsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutConfigurationSetDeliveryOptionsResponse) => void): Request<PinpointEmail.Types.PutConfigurationSetDeliveryOptionsResponse, AWSError>;
  /**
   * Associate a configuration set with a dedicated IP pool. You can use dedicated IP pools to create groups of dedicated IP addresses for sending specific types of email.
   */
  putConfigurationSetDeliveryOptions(callback?: (err: AWSError, data: PinpointEmail.Types.PutConfigurationSetDeliveryOptionsResponse) => void): Request<PinpointEmail.Types.PutConfigurationSetDeliveryOptionsResponse, AWSError>;
  /**
   * Enable or disable collection of reputation metrics for emails that you send using a particular configuration set in a specific AWS Region.
   */
  putConfigurationSetReputationOptions(params: PinpointEmail.Types.PutConfigurationSetReputationOptionsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutConfigurationSetReputationOptionsResponse) => void): Request<PinpointEmail.Types.PutConfigurationSetReputationOptionsResponse, AWSError>;
  /**
   * Enable or disable collection of reputation metrics for emails that you send using a particular configuration set in a specific AWS Region.
   */
  putConfigurationSetReputationOptions(callback?: (err: AWSError, data: PinpointEmail.Types.PutConfigurationSetReputationOptionsResponse) => void): Request<PinpointEmail.Types.PutConfigurationSetReputationOptionsResponse, AWSError>;
  /**
   * Enable or disable email sending for messages that use a particular configuration set in a specific AWS Region.
   */
  putConfigurationSetSendingOptions(params: PinpointEmail.Types.PutConfigurationSetSendingOptionsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutConfigurationSetSendingOptionsResponse) => void): Request<PinpointEmail.Types.PutConfigurationSetSendingOptionsResponse, AWSError>;
  /**
   * Enable or disable email sending for messages that use a particular configuration set in a specific AWS Region.
   */
  putConfigurationSetSendingOptions(callback?: (err: AWSError, data: PinpointEmail.Types.PutConfigurationSetSendingOptionsResponse) => void): Request<PinpointEmail.Types.PutConfigurationSetSendingOptionsResponse, AWSError>;
  /**
   * Specify a custom domain to use for open and click tracking elements in email that you send using Amazon Pinpoint.
   */
  putConfigurationSetTrackingOptions(params: PinpointEmail.Types.PutConfigurationSetTrackingOptionsRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutConfigurationSetTrackingOptionsResponse) => void): Request<PinpointEmail.Types.PutConfigurationSetTrackingOptionsResponse, AWSError>;
  /**
   * Specify a custom domain to use for open and click tracking elements in email that you send using Amazon Pinpoint.
   */
  putConfigurationSetTrackingOptions(callback?: (err: AWSError, data: PinpointEmail.Types.PutConfigurationSetTrackingOptionsResponse) => void): Request<PinpointEmail.Types.PutConfigurationSetTrackingOptionsResponse, AWSError>;
  /**
   * Move a dedicated IP address to an existing dedicated IP pool.  The dedicated IP address that you specify must already exist, and must be associated with your Amazon Pinpoint account.  The dedicated IP pool you specify must already exist. You can create a new pool by using the CreateDedicatedIpPool operation. 
   */
  putDedicatedIpInPool(params: PinpointEmail.Types.PutDedicatedIpInPoolRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutDedicatedIpInPoolResponse) => void): Request<PinpointEmail.Types.PutDedicatedIpInPoolResponse, AWSError>;
  /**
   * Move a dedicated IP address to an existing dedicated IP pool.  The dedicated IP address that you specify must already exist, and must be associated with your Amazon Pinpoint account.  The dedicated IP pool you specify must already exist. You can create a new pool by using the CreateDedicatedIpPool operation. 
   */
  putDedicatedIpInPool(callback?: (err: AWSError, data: PinpointEmail.Types.PutDedicatedIpInPoolResponse) => void): Request<PinpointEmail.Types.PutDedicatedIpInPoolResponse, AWSError>;
  /**
   * 
   */
  putDedicatedIpWarmupAttributes(params: PinpointEmail.Types.PutDedicatedIpWarmupAttributesRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutDedicatedIpWarmupAttributesResponse) => void): Request<PinpointEmail.Types.PutDedicatedIpWarmupAttributesResponse, AWSError>;
  /**
   * 
   */
  putDedicatedIpWarmupAttributes(callback?: (err: AWSError, data: PinpointEmail.Types.PutDedicatedIpWarmupAttributesResponse) => void): Request<PinpointEmail.Types.PutDedicatedIpWarmupAttributesResponse, AWSError>;
  /**
   * Enable or disable the Deliverability dashboard for your Amazon Pinpoint account. When you enable the Deliverability dashboard, you gain access to reputation, deliverability, and other metrics for the domains that you use to send email using Amazon Pinpoint. You also gain the ability to perform predictive inbox placement tests. When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition to any other fees that you accrue by using Amazon Pinpoint. For more information about the features and cost of a Deliverability dashboard subscription, see Amazon Pinpoint Pricing.
   */
  putDeliverabilityDashboardOption(params: PinpointEmail.Types.PutDeliverabilityDashboardOptionRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutDeliverabilityDashboardOptionResponse) => void): Request<PinpointEmail.Types.PutDeliverabilityDashboardOptionResponse, AWSError>;
  /**
   * Enable or disable the Deliverability dashboard for your Amazon Pinpoint account. When you enable the Deliverability dashboard, you gain access to reputation, deliverability, and other metrics for the domains that you use to send email using Amazon Pinpoint. You also gain the ability to perform predictive inbox placement tests. When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition to any other fees that you accrue by using Amazon Pinpoint. For more information about the features and cost of a Deliverability dashboard subscription, see Amazon Pinpoint Pricing.
   */
  putDeliverabilityDashboardOption(callback?: (err: AWSError, data: PinpointEmail.Types.PutDeliverabilityDashboardOptionResponse) => void): Request<PinpointEmail.Types.PutDeliverabilityDashboardOptionResponse, AWSError>;
  /**
   * Used to enable or disable DKIM authentication for an email identity.
   */
  putEmailIdentityDkimAttributes(params: PinpointEmail.Types.PutEmailIdentityDkimAttributesRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutEmailIdentityDkimAttributesResponse) => void): Request<PinpointEmail.Types.PutEmailIdentityDkimAttributesResponse, AWSError>;
  /**
   * Used to enable or disable DKIM authentication for an email identity.
   */
  putEmailIdentityDkimAttributes(callback?: (err: AWSError, data: PinpointEmail.Types.PutEmailIdentityDkimAttributesResponse) => void): Request<PinpointEmail.Types.PutEmailIdentityDkimAttributesResponse, AWSError>;
  /**
   * Used to enable or disable feedback forwarding for an identity. This setting determines what happens when an identity is used to send an email that results in a bounce or complaint event. When you enable feedback forwarding, Amazon Pinpoint sends you email notifications when bounce or complaint events occur. Amazon Pinpoint sends this notification to the address that you specified in the Return-Path header of the original email. When you disable feedback forwarding, Amazon Pinpoint sends notifications through other mechanisms, such as by notifying an Amazon SNS topic. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications, Amazon Pinpoint sends an email notification when these events occur (even if this setting is disabled).
   */
  putEmailIdentityFeedbackAttributes(params: PinpointEmail.Types.PutEmailIdentityFeedbackAttributesRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutEmailIdentityFeedbackAttributesResponse) => void): Request<PinpointEmail.Types.PutEmailIdentityFeedbackAttributesResponse, AWSError>;
  /**
   * Used to enable or disable feedback forwarding for an identity. This setting determines what happens when an identity is used to send an email that results in a bounce or complaint event. When you enable feedback forwarding, Amazon Pinpoint sends you email notifications when bounce or complaint events occur. Amazon Pinpoint sends this notification to the address that you specified in the Return-Path header of the original email. When you disable feedback forwarding, Amazon Pinpoint sends notifications through other mechanisms, such as by notifying an Amazon SNS topic. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications, Amazon Pinpoint sends an email notification when these events occur (even if this setting is disabled).
   */
  putEmailIdentityFeedbackAttributes(callback?: (err: AWSError, data: PinpointEmail.Types.PutEmailIdentityFeedbackAttributesResponse) => void): Request<PinpointEmail.Types.PutEmailIdentityFeedbackAttributesResponse, AWSError>;
  /**
   * Used to enable or disable the custom Mail-From domain configuration for an email identity.
   */
  putEmailIdentityMailFromAttributes(params: PinpointEmail.Types.PutEmailIdentityMailFromAttributesRequest, callback?: (err: AWSError, data: PinpointEmail.Types.PutEmailIdentityMailFromAttributesResponse) => void): Request<PinpointEmail.Types.PutEmailIdentityMailFromAttributesResponse, AWSError>;
  /**
   * Used to enable or disable the custom Mail-From domain configuration for an email identity.
   */
  putEmailIdentityMailFromAttributes(callback?: (err: AWSError, data: PinpointEmail.Types.PutEmailIdentityMailFromAttributesResponse) => void): Request<PinpointEmail.Types.PutEmailIdentityMailFromAttributesResponse, AWSError>;
  /**
   * Sends an email message. You can use the Amazon Pinpoint Email API to send two types of messages:    Simple – A standard email message. When you create this type of message, you specify the sender, the recipient, and the message body, and Amazon Pinpoint assembles the message for you.    Raw – A raw, MIME-formatted email message. When you send this type of email, you have to specify all of the message headers, as well as the message body. You can use this message type to send messages that contain attachments. The message that you specify has to be a valid MIME message.  
   */
  sendEmail(params: PinpointEmail.Types.SendEmailRequest, callback?: (err: AWSError, data: PinpointEmail.Types.SendEmailResponse) => void): Request<PinpointEmail.Types.SendEmailResponse, AWSError>;
  /**
   * Sends an email message. You can use the Amazon Pinpoint Email API to send two types of messages:    Simple – A standard email message. When you create this type of message, you specify the sender, the recipient, and the message body, and Amazon Pinpoint assembles the message for you.    Raw – A raw, MIME-formatted email message. When you send this type of email, you have to specify all of the message headers, as well as the message body. You can use this message type to send messages that contain attachments. The message that you specify has to be a valid MIME message.  
   */
  sendEmail(callback?: (err: AWSError, data: PinpointEmail.Types.SendEmailResponse) => void): Request<PinpointEmail.Types.SendEmailResponse, AWSError>;
  /**
   * Add one or more tags (keys and values) to a specified resource. A tag is a label that you optionally define and associate with a resource in Amazon Pinpoint. Tags can help you categorize and manage resources in different ways, such as by purpose, owner, environment, or other criteria. A resource can have as many as 50 tags. Each tag consists of a required tag key and an associated tag value, both of which you define. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  tagResource(params: PinpointEmail.Types.TagResourceRequest, callback?: (err: AWSError, data: PinpointEmail.Types.TagResourceResponse) => void): Request<PinpointEmail.Types.TagResourceResponse, AWSError>;
  /**
   * Add one or more tags (keys and values) to a specified resource. A tag is a label that you optionally define and associate with a resource in Amazon Pinpoint. Tags can help you categorize and manage resources in different ways, such as by purpose, owner, environment, or other criteria. A resource can have as many as 50 tags. Each tag consists of a required tag key and an associated tag value, both of which you define. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  tagResource(callback?: (err: AWSError, data: PinpointEmail.Types.TagResourceResponse) => void): Request<PinpointEmail.Types.TagResourceResponse, AWSError>;
  /**
   * Remove one or more tags (keys and values) from a specified resource.
   */
  untagResource(params: PinpointEmail.Types.UntagResourceRequest, callback?: (err: AWSError, data: PinpointEmail.Types.UntagResourceResponse) => void): Request<PinpointEmail.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove one or more tags (keys and values) from a specified resource.
   */
  untagResource(callback?: (err: AWSError, data: PinpointEmail.Types.UntagResourceResponse) => void): Request<PinpointEmail.Types.UntagResourceResponse, AWSError>;
  /**
   * Update the configuration of an event destination for a configuration set. In Amazon Pinpoint, events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  updateConfigurationSetEventDestination(params: PinpointEmail.Types.UpdateConfigurationSetEventDestinationRequest, callback?: (err: AWSError, data: PinpointEmail.Types.UpdateConfigurationSetEventDestinationResponse) => void): Request<PinpointEmail.Types.UpdateConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Update the configuration of an event destination for a configuration set. In Amazon Pinpoint, events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  updateConfigurationSetEventDestination(callback?: (err: AWSError, data: PinpointEmail.Types.UpdateConfigurationSetEventDestinationResponse) => void): Request<PinpointEmail.Types.UpdateConfigurationSetEventDestinationResponse, AWSError>;
}
declare namespace PinpointEmail {
  export type AmazonResourceName = string;
  export type BehaviorOnMxFailure = "USE_DEFAULT_VALUE"|"REJECT_MESSAGE"|string;
  export type BlacklistEntries = BlacklistEntry[];
  export interface BlacklistEntry {
    /**
     * The name of the blacklist that the IP address appears on.
     */
    RblName?: RblName;
    /**
     * The time when the blacklisting event occurred, shown in Unix time format.
     */
    ListingTime?: Timestamp;
    /**
     * Additional information about the blacklisting event, as provided by the blacklist maintainer.
     */
    Description?: BlacklistingDescription;
  }
  export type BlacklistItemName = string;
  export type BlacklistItemNames = BlacklistItemName[];
  export type BlacklistReport = {[key: string]: BlacklistEntries};
  export type BlacklistingDescription = string;
  export interface Body {
    /**
     * An object that represents the version of the message that is displayed in email clients that don't support HTML, or clients where the recipient has disabled HTML rendering.
     */
    Text?: Content;
    /**
     * An object that represents the version of the message that is displayed in email clients that support HTML. HTML messages can include formatted text, hyperlinks, images, and more. 
     */
    Html?: Content;
  }
  export type CampaignId = string;
  export type Charset = string;
  export interface CloudWatchDestination {
    /**
     * An array of objects that define the dimensions to use when you send email events to Amazon CloudWatch.
     */
    DimensionConfigurations: CloudWatchDimensionConfigurations;
  }
  export interface CloudWatchDimensionConfiguration {
    /**
     * The name of an Amazon CloudWatch dimension associated with an email sending metric. The name has to meet the following criteria:   It can only contain ASCII letters (a-z, A-Z), numbers (0-9), underscores (_), or dashes (-).   It can contain no more than 256 characters.  
     */
    DimensionName: DimensionName;
    /**
     * The location where Amazon Pinpoint finds the value of a dimension to publish to Amazon CloudWatch. If you want Amazon Pinpoint to use the message tags that you specify using an X-SES-MESSAGE-TAGS header or a parameter to the SendEmail/SendRawEmail API, choose messageTag. If you want Amazon Pinpoint to use your own email headers, choose emailHeader. If you want Amazon Pinpoint to use link tags, choose linkTags.
     */
    DimensionValueSource: DimensionValueSource;
    /**
     * The default value of the dimension that is published to Amazon CloudWatch if you don't provide the value of the dimension when you send an email. This value has to meet the following criteria:   It can only contain ASCII letters (a-z, A-Z), numbers (0-9), underscores (_), or dashes (-).   It can contain no more than 256 characters.  
     */
    DefaultDimensionValue: DefaultDimensionValue;
  }
  export type CloudWatchDimensionConfigurations = CloudWatchDimensionConfiguration[];
  export type ConfigurationSetName = string;
  export type ConfigurationSetNameList = ConfigurationSetName[];
  export interface Content {
    /**
     * The content of the message itself.
     */
    Data: MessageData;
    /**
     * The character set for the content. Because of the constraints of the SMTP protocol, Amazon Pinpoint uses 7-bit ASCII by default. If the text includes characters outside of the ASCII range, you have to specify a character set. For example, you could specify UTF-8, ISO-8859-1, or Shift_JIS.
     */
    Charset?: Charset;
  }
  export interface CreateConfigurationSetEventDestinationRequest {
    /**
     * The name of the configuration set that you want to add an event destination to.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * A name that identifies the event destination within the configuration set.
     */
    EventDestinationName: EventDestinationName;
    /**
     * An object that defines the event destination.
     */
    EventDestination: EventDestinationDefinition;
  }
  export interface CreateConfigurationSetEventDestinationResponse {
  }
  export interface CreateConfigurationSetRequest {
    /**
     * The name of the configuration set.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * An object that defines the open and click tracking options for emails that you send using the configuration set.
     */
    TrackingOptions?: TrackingOptions;
    /**
     * An object that defines the dedicated IP pool that is used to send emails that you send using the configuration set.
     */
    DeliveryOptions?: DeliveryOptions;
    /**
     * An object that defines whether or not Amazon Pinpoint collects reputation metrics for the emails that you send that use the configuration set.
     */
    ReputationOptions?: ReputationOptions;
    /**
     * An object that defines whether or not Amazon Pinpoint can send email that you send using the configuration set.
     */
    SendingOptions?: SendingOptions;
    /**
     * An array of objects that define the tags (keys and values) that you want to associate with the configuration set.
     */
    Tags?: TagList;
  }
  export interface CreateConfigurationSetResponse {
  }
  export interface CreateDedicatedIpPoolRequest {
    /**
     * The name of the dedicated IP pool.
     */
    PoolName: PoolName;
    /**
     * An object that defines the tags (keys and values) that you want to associate with the pool.
     */
    Tags?: TagList;
  }
  export interface CreateDedicatedIpPoolResponse {
  }
  export interface CreateDeliverabilityTestReportRequest {
    /**
     * A unique name that helps you to identify the predictive inbox placement test when you retrieve the results.
     */
    ReportName?: ReportName;
    /**
     * The email address that the predictive inbox placement test email was sent from.
     */
    FromEmailAddress: EmailAddress;
    /**
     * The HTML body of the message that you sent when you performed the predictive inbox placement test.
     */
    Content: EmailContent;
    /**
     * An array of objects that define the tags (keys and values) that you want to associate with the predictive inbox placement test.
     */
    Tags?: TagList;
  }
  export interface CreateDeliverabilityTestReportResponse {
    /**
     * A unique string that identifies the predictive inbox placement test.
     */
    ReportId: ReportId;
    /**
     * The status of the predictive inbox placement test. If the status is IN_PROGRESS, then the predictive inbox placement test is currently running. Predictive inbox placement tests are usually complete within 24 hours of creating the test. If the status is COMPLETE, then the test is finished, and you can use the GetDeliverabilityTestReport to view the results of the test.
     */
    DeliverabilityTestStatus: DeliverabilityTestStatus;
  }
  export interface CreateEmailIdentityRequest {
    /**
     * The email address or domain that you want to verify.
     */
    EmailIdentity: Identity;
    /**
     * An array of objects that define the tags (keys and values) that you want to associate with the email identity.
     */
    Tags?: TagList;
  }
  export interface CreateEmailIdentityResponse {
    /**
     * The email identity type.
     */
    IdentityType?: IdentityType;
    /**
     * Specifies whether or not the identity is verified. In Amazon Pinpoint, you can only send email from verified email addresses or domains. For more information about verifying identities, see the Amazon Pinpoint User Guide.
     */
    VerifiedForSendingStatus?: Enabled;
    /**
     * An object that contains information about the DKIM attributes for the identity. This object includes the tokens that you use to create the CNAME records that are required to complete the DKIM verification process.
     */
    DkimAttributes?: DkimAttributes;
  }
  export type CustomRedirectDomain = string;
  export interface DailyVolume {
    /**
     * The date that the DailyVolume metrics apply to, in Unix time.
     */
    StartDate?: Timestamp;
    /**
     * An object that contains inbox placement metrics for a specific day in the analysis period.
     */
    VolumeStatistics?: VolumeStatistics;
    /**
     * An object that contains inbox placement metrics for a specified day in the analysis period, broken out by the recipient's email provider.
     */
    DomainIspPlacements?: DomainIspPlacements;
  }
  export type DailyVolumes = DailyVolume[];
  export interface DedicatedIp {
    /**
     * An IP address that is reserved for use by your Amazon Pinpoint account.
     */
    Ip: Ip;
    /**
     * The warm-up status of a dedicated IP address. The status can have one of the following values:    IN_PROGRESS – The IP address isn't ready to use because the dedicated IP warm-up process is ongoing.    DONE – The dedicated IP warm-up process is complete, and the IP address is ready to use.  
     */
    WarmupStatus: WarmupStatus;
    /**
     * Indicates how complete the dedicated IP warm-up process is. When this value equals 1, the address has completed the warm-up process and is ready for use.
     */
    WarmupPercentage: Percentage100Wrapper;
    /**
     * The name of the dedicated IP pool that the IP address is associated with.
     */
    PoolName?: PoolName;
  }
  export type DedicatedIpList = DedicatedIp[];
  export type DefaultDimensionValue = string;
  export interface DeleteConfigurationSetEventDestinationRequest {
    /**
     * The name of the configuration set that contains the event destination that you want to delete.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * The name of the event destination that you want to delete.
     */
    EventDestinationName: EventDestinationName;
  }
  export interface DeleteConfigurationSetEventDestinationResponse {
  }
  export interface DeleteConfigurationSetRequest {
    /**
     * The name of the configuration set that you want to delete.
     */
    ConfigurationSetName: ConfigurationSetName;
  }
  export interface DeleteConfigurationSetResponse {
  }
  export interface DeleteDedicatedIpPoolRequest {
    /**
     * The name of the dedicated IP pool that you want to delete.
     */
    PoolName: PoolName;
  }
  export interface DeleteDedicatedIpPoolResponse {
  }
  export interface DeleteEmailIdentityRequest {
    /**
     * The identity (that is, the email address or domain) that you want to delete from your Amazon Pinpoint account.
     */
    EmailIdentity: Identity;
  }
  export interface DeleteEmailIdentityResponse {
  }
  export type DeliverabilityDashboardAccountStatus = "ACTIVE"|"PENDING_EXPIRATION"|"DISABLED"|string;
  export interface DeliverabilityTestReport {
    /**
     * A unique string that identifies the predictive inbox placement test.
     */
    ReportId?: ReportId;
    /**
     * A name that helps you identify a predictive inbox placement test report.
     */
    ReportName?: ReportName;
    /**
     * The subject line for an email that you submitted in a predictive inbox placement test.
     */
    Subject?: DeliverabilityTestSubject;
    /**
     * The sender address that you specified for the predictive inbox placement test.
     */
    FromEmailAddress?: EmailAddress;
    /**
     * The date and time when the predictive inbox placement test was created, in Unix time format.
     */
    CreateDate?: Timestamp;
    /**
     * The status of the predictive inbox placement test. If the status is IN_PROGRESS, then the predictive inbox placement test is currently running. Predictive inbox placement tests are usually complete within 24 hours of creating the test. If the status is COMPLETE, then the test is finished, and you can use the GetDeliverabilityTestReport to view the results of the test.
     */
    DeliverabilityTestStatus?: DeliverabilityTestStatus;
  }
  export type DeliverabilityTestReports = DeliverabilityTestReport[];
  export type DeliverabilityTestStatus = "IN_PROGRESS"|"COMPLETED"|string;
  export type DeliverabilityTestSubject = string;
  export interface DeliveryOptions {
    /**
     * Specifies whether messages that use the configuration set are required to use Transport Layer Security (TLS). If the value is Require, messages are only delivered if a TLS connection can be established. If the value is Optional, messages can be delivered in plain text if a TLS connection can't be established.
     */
    TlsPolicy?: TlsPolicy;
    /**
     * The name of the dedicated IP pool that you want to associate with the configuration set.
     */
    SendingPoolName?: PoolName;
  }
  export interface Destination {
    /**
     * An array that contains the email addresses of the "To" recipients for the email.
     */
    ToAddresses?: EmailAddressList;
    /**
     * An array that contains the email addresses of the "CC" (carbon copy) recipients for the email.
     */
    CcAddresses?: EmailAddressList;
    /**
     * An array that contains the email addresses of the "BCC" (blind carbon copy) recipients for the email.
     */
    BccAddresses?: EmailAddressList;
  }
  export type DimensionName = string;
  export type DimensionValueSource = "MESSAGE_TAG"|"EMAIL_HEADER"|"LINK_TAG"|string;
  export interface DkimAttributes {
    /**
     * If the value is true, then the messages that Amazon Pinpoint sends from the identity are DKIM-signed. If the value is false, then the messages that Amazon Pinpoint sends from the identity aren't DKIM-signed.
     */
    SigningEnabled?: Enabled;
    /**
     * Describes whether or not Amazon Pinpoint has successfully located the DKIM records in the DNS records for the domain. The status can be one of the following:    PENDING – Amazon Pinpoint hasn't yet located the DKIM records in the DNS configuration for the domain, but will continue to attempt to locate them.    SUCCESS – Amazon Pinpoint located the DKIM records in the DNS configuration for the domain and determined that they're correct. Amazon Pinpoint can now send DKIM-signed email from the identity.    FAILED – Amazon Pinpoint was unable to locate the DKIM records in the DNS settings for the domain, and won't continue to search for them.    TEMPORARY_FAILURE – A temporary issue occurred, which prevented Amazon Pinpoint from determining the DKIM status for the domain.    NOT_STARTED – Amazon Pinpoint hasn't yet started searching for the DKIM records in the DKIM records for the domain.  
     */
    Status?: DkimStatus;
    /**
     * A set of unique strings that you use to create a set of CNAME records that you add to the DNS configuration for your domain. When Amazon Pinpoint detects these records in the DNS configuration for your domain, the DKIM authentication process is complete. Amazon Pinpoint usually detects these records within about 72 hours of adding them to the DNS configuration for your domain.
     */
    Tokens?: DnsTokenList;
  }
  export type DkimStatus = "PENDING"|"SUCCESS"|"FAILED"|"TEMPORARY_FAILURE"|"NOT_STARTED"|string;
  export type DnsToken = string;
  export type DnsTokenList = DnsToken[];
  export type Domain = string;
  export interface DomainDeliverabilityCampaign {
    /**
     * The unique identifier for the campaign. Amazon Pinpoint automatically generates and assigns this identifier to a campaign. This value is not the same as the campaign identifier that Amazon Pinpoint assigns to campaigns that you create and manage by using the Amazon Pinpoint API or the Amazon Pinpoint console.
     */
    CampaignId?: CampaignId;
    /**
     * The URL of an image that contains a snapshot of the email message that was sent.
     */
    ImageUrl?: ImageUrl;
    /**
     * The subject line, or title, of the email message.
     */
    Subject?: Subject;
    /**
     * The verified email address that the email message was sent from.
     */
    FromAddress?: Identity;
    /**
     * The IP addresses that were used to send the email message.
     */
    SendingIps?: IpList;
    /**
     * The first time, in Unix time format, when the email message was delivered to any recipient's inbox. This value can help you determine how long it took for a campaign to deliver an email message.
     */
    FirstSeenDateTime?: Timestamp;
    /**
     * The last time, in Unix time format, when the email message was delivered to any recipient's inbox. This value can help you determine how long it took for a campaign to deliver an email message.
     */
    LastSeenDateTime?: Timestamp;
    /**
     * The number of email messages that were delivered to recipients’ inboxes.
     */
    InboxCount?: Volume;
    /**
     * The number of email messages that were delivered to recipients' spam or junk mail folders.
     */
    SpamCount?: Volume;
    /**
     * The percentage of email messages that were opened by recipients. Due to technical limitations, this value only includes recipients who opened the message by using an email client that supports images.
     */
    ReadRate?: Percentage;
    /**
     * The percentage of email messages that were deleted by recipients, without being opened first. Due to technical limitations, this value only includes recipients who opened the message by using an email client that supports images.
     */
    DeleteRate?: Percentage;
    /**
     * The percentage of email messages that were opened and then deleted by recipients. Due to technical limitations, this value only includes recipients who opened the message by using an email client that supports images.
     */
    ReadDeleteRate?: Percentage;
    /**
     * The projected number of recipients that the email message was sent to.
     */
    ProjectedVolume?: Volume;
    /**
     * The major email providers who handled the email message.
     */
    Esps?: Esps;
  }
  export type DomainDeliverabilityCampaignList = DomainDeliverabilityCampaign[];
  export interface DomainDeliverabilityTrackingOption {
    /**
     * A verified domain that’s associated with your AWS account and currently has an active Deliverability dashboard subscription.
     */
    Domain?: Domain;
    /**
     * The date, in Unix time format, when you enabled the Deliverability dashboard for the domain.
     */
    SubscriptionStartDate?: Timestamp;
    /**
     * An object that contains information about the inbox placement data settings for the domain.
     */
    InboxPlacementTrackingOption?: InboxPlacementTrackingOption;
  }
  export type DomainDeliverabilityTrackingOptions = DomainDeliverabilityTrackingOption[];
  export interface DomainIspPlacement {
    /**
     * The name of the email provider that the inbox placement data applies to.
     */
    IspName?: IspName;
    /**
     * The total number of messages that were sent from the selected domain to the specified email provider that arrived in recipients' inboxes.
     */
    InboxRawCount?: Volume;
    /**
     * The total number of messages that were sent from the selected domain to the specified email provider that arrived in recipients' spam or junk mail folders.
     */
    SpamRawCount?: Volume;
    /**
     * The percentage of messages that were sent from the selected domain to the specified email provider that arrived in recipients' inboxes.
     */
    InboxPercentage?: Percentage;
    /**
     * The percentage of messages that were sent from the selected domain to the specified email provider that arrived in recipients' spam or junk mail folders.
     */
    SpamPercentage?: Percentage;
  }
  export type DomainIspPlacements = DomainIspPlacement[];
  export type EmailAddress = string;
  export type EmailAddressList = EmailAddress[];
  export interface EmailContent {
    /**
     * The simple email message. The message consists of a subject and a message body.
     */
    Simple?: Message;
    /**
     * The raw email message. The message has to meet the following criteria:   The message has to contain a header and a body, separated by one blank line.   All of the required header fields must be present in the message.   Each part of a multipart MIME message must be formatted properly.   If you include attachments, they must be in a file format that Amazon Pinpoint supports.    The entire message must be Base64 encoded.   If any of the MIME parts in your message contain content that is outside of the 7-bit ASCII character range, you should encode that content to ensure that recipients' email clients render the message properly.   The length of any single line of text in the message can't exceed 1,000 characters. This restriction is defined in RFC 5321.  
     */
    Raw?: RawMessage;
    /**
     * The template to use for the email message.
     */
    Template?: Template;
  }
  export type Enabled = boolean;
  export type Esp = string;
  export type Esps = Esp[];
  export interface EventDestination {
    /**
     * A name that identifies the event destination.
     */
    Name: EventDestinationName;
    /**
     * If true, the event destination is enabled. When the event destination is enabled, the specified event types are sent to the destinations in this EventDestinationDefinition. If false, the event destination is disabled. When the event destination is disabled, events aren't sent to the specified destinations.
     */
    Enabled?: Enabled;
    /**
     * The types of events that Amazon Pinpoint sends to the specified event destinations.
     */
    MatchingEventTypes: EventTypes;
    /**
     * An object that defines an Amazon Kinesis Data Firehose destination for email events. You can use Amazon Kinesis Data Firehose to stream data to other services, such as Amazon S3 and Amazon Redshift.
     */
    KinesisFirehoseDestination?: KinesisFirehoseDestination;
    /**
     * An object that defines an Amazon CloudWatch destination for email events. You can use Amazon CloudWatch to monitor and gain insights on your email sending metrics.
     */
    CloudWatchDestination?: CloudWatchDestination;
    /**
     * An object that defines an Amazon SNS destination for email events. You can use Amazon SNS to send notification when certain email events occur.
     */
    SnsDestination?: SnsDestination;
    /**
     * An object that defines a Amazon Pinpoint destination for email events. You can use Amazon Pinpoint events to create attributes in Amazon Pinpoint projects. You can use these attributes to create segments for your campaigns.
     */
    PinpointDestination?: PinpointDestination;
  }
  export interface EventDestinationDefinition {
    /**
     * If true, the event destination is enabled. When the event destination is enabled, the specified event types are sent to the destinations in this EventDestinationDefinition. If false, the event destination is disabled. When the event destination is disabled, events aren't sent to the specified destinations.
     */
    Enabled?: Enabled;
    /**
     * An array that specifies which events Amazon Pinpoint should send to the destinations in this EventDestinationDefinition.
     */
    MatchingEventTypes?: EventTypes;
    /**
     * An object that defines an Amazon Kinesis Data Firehose destination for email events. You can use Amazon Kinesis Data Firehose to stream data to other services, such as Amazon S3 and Amazon Redshift.
     */
    KinesisFirehoseDestination?: KinesisFirehoseDestination;
    /**
     * An object that defines an Amazon CloudWatch destination for email events. You can use Amazon CloudWatch to monitor and gain insights on your email sending metrics.
     */
    CloudWatchDestination?: CloudWatchDestination;
    /**
     * An object that defines an Amazon SNS destination for email events. You can use Amazon SNS to send notification when certain email events occur.
     */
    SnsDestination?: SnsDestination;
    /**
     * An object that defines a Amazon Pinpoint destination for email events. You can use Amazon Pinpoint events to create attributes in Amazon Pinpoint projects. You can use these attributes to create segments for your campaigns.
     */
    PinpointDestination?: PinpointDestination;
  }
  export type EventDestinationName = string;
  export type EventDestinations = EventDestination[];
  export type EventType = "SEND"|"REJECT"|"BOUNCE"|"COMPLAINT"|"DELIVERY"|"OPEN"|"CLICK"|"RENDERING_FAILURE"|string;
  export type EventTypes = EventType[];
  export type GeneralEnforcementStatus = string;
  export interface GetAccountRequest {
  }
  export interface GetAccountResponse {
    /**
     * An object that contains information about the per-day and per-second sending limits for your Amazon Pinpoint account in the current AWS Region.
     */
    SendQuota?: SendQuota;
    /**
     * Indicates whether or not email sending is enabled for your Amazon Pinpoint account in the current AWS Region.
     */
    SendingEnabled?: Enabled;
    /**
     * Indicates whether or not the automatic warm-up feature is enabled for dedicated IP addresses that are associated with your account.
     */
    DedicatedIpAutoWarmupEnabled?: Enabled;
    /**
     * The reputation status of your Amazon Pinpoint account. The status can be one of the following:    HEALTHY – There are no reputation-related issues that currently impact your account.    PROBATION – We've identified some issues with your Amazon Pinpoint account. We're placing your account under review while you work on correcting these issues.    SHUTDOWN – Your account's ability to send email is currently paused because of an issue with the email sent from your account. When you correct the issue, you can contact us and request that your account's ability to send email is resumed.  
     */
    EnforcementStatus?: GeneralEnforcementStatus;
    /**
     * Indicates whether or not your account has production access in the current AWS Region. If the value is false, then your account is in the sandbox. When your account is in the sandbox, you can only send email to verified identities. Additionally, the maximum number of emails you can send in a 24-hour period (your sending quota) is 200, and the maximum number of emails you can send per second (your maximum sending rate) is 1. If the value is true, then your account has production access. When your account has production access, you can send email to any address. The sending quota and maximum sending rate for your account vary based on your specific use case.
     */
    ProductionAccessEnabled?: Enabled;
  }
  export interface GetBlacklistReportsRequest {
    /**
     * A list of IP addresses that you want to retrieve blacklist information about. You can only specify the dedicated IP addresses that you use to send email using Amazon Pinpoint or Amazon SES.
     */
    BlacklistItemNames: BlacklistItemNames;
  }
  export interface GetBlacklistReportsResponse {
    /**
     * An object that contains information about a blacklist that one of your dedicated IP addresses appears on.
     */
    BlacklistReport: BlacklistReport;
  }
  export interface GetConfigurationSetEventDestinationsRequest {
    /**
     * The name of the configuration set that contains the event destination.
     */
    ConfigurationSetName: ConfigurationSetName;
  }
  export interface GetConfigurationSetEventDestinationsResponse {
    /**
     * An array that includes all of the events destinations that have been configured for the configuration set.
     */
    EventDestinations?: EventDestinations;
  }
  export interface GetConfigurationSetRequest {
    /**
     * The name of the configuration set that you want to obtain more information about.
     */
    ConfigurationSetName: ConfigurationSetName;
  }
  export interface GetConfigurationSetResponse {
    /**
     * The name of the configuration set.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * An object that defines the open and click tracking options for emails that you send using the configuration set.
     */
    TrackingOptions?: TrackingOptions;
    /**
     * An object that defines the dedicated IP pool that is used to send emails that you send using the configuration set.
     */
    DeliveryOptions?: DeliveryOptions;
    /**
     * An object that defines whether or not Amazon Pinpoint collects reputation metrics for the emails that you send that use the configuration set.
     */
    ReputationOptions?: ReputationOptions;
    /**
     * An object that defines whether or not Amazon Pinpoint can send email that you send using the configuration set.
     */
    SendingOptions?: SendingOptions;
    /**
     * An array of objects that define the tags (keys and values) that are associated with the configuration set.
     */
    Tags?: TagList;
  }
  export interface GetDedicatedIpRequest {
    /**
     * The IP address that you want to obtain more information about. The value you specify has to be a dedicated IP address that's assocaited with your Amazon Pinpoint account.
     */
    Ip: Ip;
  }
  export interface GetDedicatedIpResponse {
    /**
     * An object that contains information about a dedicated IP address.
     */
    DedicatedIp?: DedicatedIp;
  }
  export interface GetDedicatedIpsRequest {
    /**
     * The name of the IP pool that the dedicated IP address is associated with.
     */
    PoolName?: PoolName;
    /**
     * A token returned from a previous call to GetDedicatedIps to indicate the position of the dedicated IP pool in the list of IP pools.
     */
    NextToken?: NextToken;
    /**
     * The number of results to show in a single call to GetDedicatedIpsRequest. If the number of results is larger than the number you specified in this parameter, then the response includes a NextToken element, which you can use to obtain additional results.
     */
    PageSize?: MaxItems;
  }
  export interface GetDedicatedIpsResponse {
    /**
     * A list of dedicated IP addresses that are reserved for use by your Amazon Pinpoint account.
     */
    DedicatedIps?: DedicatedIpList;
    /**
     * A token that indicates that there are additional dedicated IP addresses to list. To view additional addresses, issue another request to GetDedicatedIps, passing this token in the NextToken parameter.
     */
    NextToken?: NextToken;
  }
  export interface GetDeliverabilityDashboardOptionsRequest {
  }
  export interface GetDeliverabilityDashboardOptionsResponse {
    /**
     * Specifies whether the Deliverability dashboard is enabled for your Amazon Pinpoint account. If this value is true, the dashboard is enabled.
     */
    DashboardEnabled: Enabled;
    /**
     * The date, in Unix time format, when your current subscription to the Deliverability dashboard is scheduled to expire, if your subscription is scheduled to expire at the end of the current calendar month. This value is null if you have an active subscription that isn’t due to expire at the end of the month.
     */
    SubscriptionExpiryDate?: Timestamp;
    /**
     * The current status of your Deliverability dashboard subscription. If this value is PENDING_EXPIRATION, your subscription is scheduled to expire at the end of the current calendar month.
     */
    AccountStatus?: DeliverabilityDashboardAccountStatus;
    /**
     * An array of objects, one for each verified domain that you use to send email and currently has an active Deliverability dashboard subscription that isn’t scheduled to expire at the end of the current calendar month.
     */
    ActiveSubscribedDomains?: DomainDeliverabilityTrackingOptions;
    /**
     * An array of objects, one for each verified domain that you use to send email and currently has an active Deliverability dashboard subscription that's scheduled to expire at the end of the current calendar month.
     */
    PendingExpirationSubscribedDomains?: DomainDeliverabilityTrackingOptions;
  }
  export interface GetDeliverabilityTestReportRequest {
    /**
     * A unique string that identifies the predictive inbox placement test.
     */
    ReportId: ReportId;
  }
  export interface GetDeliverabilityTestReportResponse {
    /**
     * An object that contains the results of the predictive inbox placement test.
     */
    DeliverabilityTestReport: DeliverabilityTestReport;
    /**
     * An object that specifies how many test messages that were sent during the predictive inbox placement test were delivered to recipients' inboxes, how many were sent to recipients' spam folders, and how many weren't delivered.
     */
    OverallPlacement: PlacementStatistics;
    /**
     * An object that describes how the test email was handled by several email providers, including Gmail, Hotmail, Yahoo, AOL, and others.
     */
    IspPlacements: IspPlacements;
    /**
     * An object that contains the message that you sent when you performed this predictive inbox placement test.
     */
    Message?: MessageContent;
    /**
     * An array of objects that define the tags (keys and values) that are associated with the predictive inbox placement test.
     */
    Tags?: TagList;
  }
  export interface GetDomainDeliverabilityCampaignRequest {
    /**
     * The unique identifier for the campaign. Amazon Pinpoint automatically generates and assigns this identifier to a campaign. This value is not the same as the campaign identifier that Amazon Pinpoint assigns to campaigns that you create and manage by using the Amazon Pinpoint API or the Amazon Pinpoint console.
     */
    CampaignId: CampaignId;
  }
  export interface GetDomainDeliverabilityCampaignResponse {
    /**
     * An object that contains the deliverability data for the campaign.
     */
    DomainDeliverabilityCampaign: DomainDeliverabilityCampaign;
  }
  export interface GetDomainStatisticsReportRequest {
    /**
     * The domain that you want to obtain deliverability metrics for.
     */
    Domain: Identity;
    /**
     * The first day (in Unix time) that you want to obtain domain deliverability metrics for.
     */
    StartDate: Timestamp;
    /**
     * The last day (in Unix time) that you want to obtain domain deliverability metrics for. The EndDate that you specify has to be less than or equal to 30 days after the StartDate.
     */
    EndDate: Timestamp;
  }
  export interface GetDomainStatisticsReportResponse {
    /**
     * An object that contains deliverability metrics for the domain that you specified. The data in this object is a summary of all of the data that was collected from the StartDate to the EndDate.
     */
    OverallVolume: OverallVolume;
    /**
     * An object that contains deliverability metrics for the domain that you specified. This object contains data for each day, starting on the StartDate and ending on the EndDate.
     */
    DailyVolumes: DailyVolumes;
  }
  export interface GetEmailIdentityRequest {
    /**
     * The email identity that you want to retrieve details for.
     */
    EmailIdentity: Identity;
  }
  export interface GetEmailIdentityResponse {
    /**
     * The email identity type.
     */
    IdentityType?: IdentityType;
    /**
     * The feedback forwarding configuration for the identity. If the value is true, Amazon Pinpoint sends you email notifications when bounce or complaint events occur. Amazon Pinpoint sends this notification to the address that you specified in the Return-Path header of the original email. When you set this value to false, Amazon Pinpoint sends notifications through other mechanisms, such as by notifying an Amazon SNS topic or another event destination. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications, Amazon Pinpoint sends an email notification when these events occur (even if this setting is disabled).
     */
    FeedbackForwardingStatus?: Enabled;
    /**
     * Specifies whether or not the identity is verified. In Amazon Pinpoint, you can only send email from verified email addresses or domains. For more information about verifying identities, see the Amazon Pinpoint User Guide.
     */
    VerifiedForSendingStatus?: Enabled;
    /**
     * An object that contains information about the DKIM attributes for the identity. This object includes the tokens that you use to create the CNAME records that are required to complete the DKIM verification process.
     */
    DkimAttributes?: DkimAttributes;
    /**
     * An object that contains information about the Mail-From attributes for the email identity.
     */
    MailFromAttributes?: MailFromAttributes;
    /**
     * An array of objects that define the tags (keys and values) that are associated with the email identity.
     */
    Tags?: TagList;
  }
  export type Identity = string;
  export interface IdentityInfo {
    /**
     * The email identity type. The identity type can be one of the following:    EMAIL_ADDRESS – The identity is an email address.    DOMAIN – The identity is a domain.    MANAGED_DOMAIN – The identity is a domain that is managed by AWS.  
     */
    IdentityType?: IdentityType;
    /**
     * The address or domain of the identity.
     */
    IdentityName?: Identity;
    /**
     * Indicates whether or not you can send email from the identity. In Amazon Pinpoint, an identity is an email address or domain that you send email from. Before you can send email from an identity, you have to demostrate that you own the identity, and that you authorize Amazon Pinpoint to send email from that identity.
     */
    SendingEnabled?: Enabled;
  }
  export type IdentityInfoList = IdentityInfo[];
  export type IdentityType = "EMAIL_ADDRESS"|"DOMAIN"|"MANAGED_DOMAIN"|string;
  export type ImageUrl = string;
  export interface InboxPlacementTrackingOption {
    /**
     * Specifies whether inbox placement data is being tracked for the domain.
     */
    Global?: Enabled;
    /**
     * An array of strings, one for each major email provider that the inbox placement data applies to.
     */
    TrackedIsps?: IspNameList;
  }
  export type Ip = string;
  export type IpList = Ip[];
  export type IspName = string;
  export type IspNameList = IspName[];
  export interface IspPlacement {
    /**
     * The name of the email provider that the inbox placement data applies to.
     */
    IspName?: IspName;
    /**
     * An object that contains inbox placement metrics for a specific email provider.
     */
    PlacementStatistics?: PlacementStatistics;
  }
  export type IspPlacements = IspPlacement[];
  export interface KinesisFirehoseDestination {
    /**
     * The Amazon Resource Name (ARN) of the IAM role that Amazon Pinpoint uses when sending email events to the Amazon Kinesis Data Firehose stream.
     */
    IamRoleArn: AmazonResourceName;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Kinesis Data Firehose stream that Amazon Pinpoint sends email events to.
     */
    DeliveryStreamArn: AmazonResourceName;
  }
  export type LastFreshStart = Date;
  export interface ListConfigurationSetsRequest {
    /**
     * A token returned from a previous call to ListConfigurationSets to indicate the position in the list of configuration sets.
     */
    NextToken?: NextToken;
    /**
     * The number of results to show in a single call to ListConfigurationSets. If the number of results is larger than the number you specified in this parameter, then the response includes a NextToken element, which you can use to obtain additional results.
     */
    PageSize?: MaxItems;
  }
  export interface ListConfigurationSetsResponse {
    /**
     * An array that contains all of the configuration sets in your Amazon Pinpoint account in the current AWS Region.
     */
    ConfigurationSets?: ConfigurationSetNameList;
    /**
     * A token that indicates that there are additional configuration sets to list. To view additional configuration sets, issue another request to ListConfigurationSets, and pass this token in the NextToken parameter.
     */
    NextToken?: NextToken;
  }
  export interface ListDedicatedIpPoolsRequest {
    /**
     * A token returned from a previous call to ListDedicatedIpPools to indicate the position in the list of dedicated IP pools.
     */
    NextToken?: NextToken;
    /**
     * The number of results to show in a single call to ListDedicatedIpPools. If the number of results is larger than the number you specified in this parameter, then the response includes a NextToken element, which you can use to obtain additional results.
     */
    PageSize?: MaxItems;
  }
  export interface ListDedicatedIpPoolsResponse {
    /**
     * A list of all of the dedicated IP pools that are associated with your Amazon Pinpoint account.
     */
    DedicatedIpPools?: ListOfDedicatedIpPools;
    /**
     * A token that indicates that there are additional IP pools to list. To view additional IP pools, issue another request to ListDedicatedIpPools, passing this token in the NextToken parameter.
     */
    NextToken?: NextToken;
  }
  export interface ListDeliverabilityTestReportsRequest {
    /**
     * A token returned from a previous call to ListDeliverabilityTestReports to indicate the position in the list of predictive inbox placement tests.
     */
    NextToken?: NextToken;
    /**
     * The number of results to show in a single call to ListDeliverabilityTestReports. If the number of results is larger than the number you specified in this parameter, then the response includes a NextToken element, which you can use to obtain additional results. The value you specify has to be at least 0, and can be no more than 1000.
     */
    PageSize?: MaxItems;
  }
  export interface ListDeliverabilityTestReportsResponse {
    /**
     * An object that contains a lists of predictive inbox placement tests that you've performed.
     */
    DeliverabilityTestReports: DeliverabilityTestReports;
    /**
     * A token that indicates that there are additional predictive inbox placement tests to list. To view additional predictive inbox placement tests, issue another request to ListDeliverabilityTestReports, and pass this token in the NextToken parameter.
     */
    NextToken?: NextToken;
  }
  export interface ListDomainDeliverabilityCampaignsRequest {
    /**
     * The first day, in Unix time format, that you want to obtain deliverability data for.
     */
    StartDate: Timestamp;
    /**
     * The last day, in Unix time format, that you want to obtain deliverability data for. This value has to be less than or equal to 30 days after the value of the StartDate parameter.
     */
    EndDate: Timestamp;
    /**
     * The domain to obtain deliverability data for.
     */
    SubscribedDomain: Domain;
    /**
     * A token that’s returned from a previous call to the ListDomainDeliverabilityCampaigns operation. This token indicates the position of a campaign in the list of campaigns.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to include in response to a single call to the ListDomainDeliverabilityCampaigns operation. If the number of results is larger than the number that you specify in this parameter, the response includes a NextToken element, which you can use to obtain additional results.
     */
    PageSize?: MaxItems;
  }
  export interface ListDomainDeliverabilityCampaignsResponse {
    /**
     * An array of responses, one for each campaign that used the domain to send email during the specified time range.
     */
    DomainDeliverabilityCampaigns: DomainDeliverabilityCampaignList;
    /**
     * A token that’s returned from a previous call to the ListDomainDeliverabilityCampaigns operation. This token indicates the position of the campaign in the list of campaigns.
     */
    NextToken?: NextToken;
  }
  export interface ListEmailIdentitiesRequest {
    /**
     * A token returned from a previous call to ListEmailIdentities to indicate the position in the list of identities.
     */
    NextToken?: NextToken;
    /**
     * The number of results to show in a single call to ListEmailIdentities. If the number of results is larger than the number you specified in this parameter, then the response includes a NextToken element, which you can use to obtain additional results. The value you specify has to be at least 0, and can be no more than 1000.
     */
    PageSize?: MaxItems;
  }
  export interface ListEmailIdentitiesResponse {
    /**
     * An array that includes all of the identities associated with your Amazon Pinpoint account.
     */
    EmailIdentities?: IdentityInfoList;
    /**
     * A token that indicates that there are additional configuration sets to list. To view additional configuration sets, issue another request to ListEmailIdentities, and pass this token in the NextToken parameter.
     */
    NextToken?: NextToken;
  }
  export type ListOfDedicatedIpPools = PoolName[];
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to retrieve tag information for.
     */
    ResourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * An array that lists all the tags that are associated with the resource. Each tag consists of a required tag key (Key) and an associated tag value (Value)
     */
    Tags: TagList;
  }
  export interface MailFromAttributes {
    /**
     * The name of a domain that an email identity uses as a custom MAIL FROM domain.
     */
    MailFromDomain: MailFromDomainName;
    /**
     * The status of the MAIL FROM domain. This status can have the following values:    PENDING – Amazon Pinpoint hasn't started searching for the MX record yet.    SUCCESS – Amazon Pinpoint detected the required MX record for the MAIL FROM domain.    FAILED – Amazon Pinpoint can't find the required MX record, or the record no longer exists.    TEMPORARY_FAILURE – A temporary issue occurred, which prevented Amazon Pinpoint from determining the status of the MAIL FROM domain.  
     */
    MailFromDomainStatus: MailFromDomainStatus;
    /**
     * The action that Amazon Pinpoint to takes if it can't read the required MX record for a custom MAIL FROM domain. When you set this value to UseDefaultValue, Amazon Pinpoint uses amazonses.com as the MAIL FROM domain. When you set this value to RejectMessage, Amazon Pinpoint returns a MailFromDomainNotVerified error, and doesn't attempt to deliver the email. These behaviors are taken when the custom MAIL FROM domain configuration is in the Pending, Failed, and TemporaryFailure states.
     */
    BehaviorOnMxFailure: BehaviorOnMxFailure;
  }
  export type MailFromDomainName = string;
  export type MailFromDomainStatus = "PENDING"|"SUCCESS"|"FAILED"|"TEMPORARY_FAILURE"|string;
  export type Max24HourSend = number;
  export type MaxItems = number;
  export type MaxSendRate = number;
  export interface Message {
    /**
     * The subject line of the email. The subject line can only contain 7-bit ASCII characters. However, you can specify non-ASCII characters in the subject line by using encoded-word syntax, as described in RFC 2047.
     */
    Subject: Content;
    /**
     * The body of the message. You can specify an HTML version of the message, a text-only version of the message, or both.
     */
    Body: Body;
  }
  export type MessageContent = string;
  export type MessageData = string;
  export interface MessageTag {
    /**
     * The name of the message tag. The message tag name has to meet the following criteria:   It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-).   It can contain no more than 256 characters.  
     */
    Name: MessageTagName;
    /**
     * The value of the message tag. The message tag value has to meet the following criteria:   It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-).   It can contain no more than 256 characters.  
     */
    Value: MessageTagValue;
  }
  export type MessageTagList = MessageTag[];
  export type MessageTagName = string;
  export type MessageTagValue = string;
  export type NextToken = string;
  export type OutboundMessageId = string;
  export interface OverallVolume {
    /**
     * An object that contains information about the numbers of messages that arrived in recipients' inboxes and junk mail folders.
     */
    VolumeStatistics?: VolumeStatistics;
    /**
     * The percentage of emails that were sent from the domain that were read by their recipients.
     */
    ReadRatePercent?: Percentage;
    /**
     * An object that contains inbox and junk mail placement metrics for individual email providers.
     */
    DomainIspPlacements?: DomainIspPlacements;
  }
  export type Percentage = number;
  export type Percentage100Wrapper = number;
  export interface PinpointDestination {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Pinpoint project that you want to send email events to.
     */
    ApplicationArn?: AmazonResourceName;
  }
  export interface PlacementStatistics {
    /**
     * The percentage of emails that arrived in recipients' inboxes during the predictive inbox placement test.
     */
    InboxPercentage?: Percentage;
    /**
     * The percentage of emails that arrived in recipients' spam or junk mail folders during the predictive inbox placement test.
     */
    SpamPercentage?: Percentage;
    /**
     * The percentage of emails that didn't arrive in recipients' inboxes at all during the predictive inbox placement test.
     */
    MissingPercentage?: Percentage;
    /**
     * The percentage of emails that were authenticated by using Sender Policy Framework (SPF) during the predictive inbox placement test.
     */
    SpfPercentage?: Percentage;
    /**
     * The percentage of emails that were authenticated by using DomainKeys Identified Mail (DKIM) during the predictive inbox placement test.
     */
    DkimPercentage?: Percentage;
  }
  export type PoolName = string;
  export interface PutAccountDedicatedIpWarmupAttributesRequest {
    /**
     * Enables or disables the automatic warm-up feature for dedicated IP addresses that are associated with your Amazon Pinpoint account in the current AWS Region. Set to true to enable the automatic warm-up feature, or set to false to disable it.
     */
    AutoWarmupEnabled?: Enabled;
  }
  export interface PutAccountDedicatedIpWarmupAttributesResponse {
  }
  export interface PutAccountSendingAttributesRequest {
    /**
     * Enables or disables your account's ability to send email. Set to true to enable email sending, or set to false to disable email sending.  If AWS paused your account's ability to send email, you can't use this operation to resume your account's ability to send email. 
     */
    SendingEnabled?: Enabled;
  }
  export interface PutAccountSendingAttributesResponse {
  }
  export interface PutConfigurationSetDeliveryOptionsRequest {
    /**
     * The name of the configuration set that you want to associate with a dedicated IP pool.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * Specifies whether messages that use the configuration set are required to use Transport Layer Security (TLS). If the value is Require, messages are only delivered if a TLS connection can be established. If the value is Optional, messages can be delivered in plain text if a TLS connection can't be established.
     */
    TlsPolicy?: TlsPolicy;
    /**
     * The name of the dedicated IP pool that you want to associate with the configuration set.
     */
    SendingPoolName?: SendingPoolName;
  }
  export interface PutConfigurationSetDeliveryOptionsResponse {
  }
  export interface PutConfigurationSetReputationOptionsRequest {
    /**
     * The name of the configuration set that you want to enable or disable reputation metric tracking for.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * If true, tracking of reputation metrics is enabled for the configuration set. If false, tracking of reputation metrics is disabled for the configuration set.
     */
    ReputationMetricsEnabled?: Enabled;
  }
  export interface PutConfigurationSetReputationOptionsResponse {
  }
  export interface PutConfigurationSetSendingOptionsRequest {
    /**
     * The name of the configuration set that you want to enable or disable email sending for.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * If true, email sending is enabled for the configuration set. If false, email sending is disabled for the configuration set.
     */
    SendingEnabled?: Enabled;
  }
  export interface PutConfigurationSetSendingOptionsResponse {
  }
  export interface PutConfigurationSetTrackingOptionsRequest {
    /**
     * The name of the configuration set that you want to add a custom tracking domain to.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * The domain that you want to use to track open and click events.
     */
    CustomRedirectDomain?: CustomRedirectDomain;
  }
  export interface PutConfigurationSetTrackingOptionsResponse {
  }
  export interface PutDedicatedIpInPoolRequest {
    /**
     * The IP address that you want to move to the dedicated IP pool. The value you specify has to be a dedicated IP address that's associated with your Amazon Pinpoint account.
     */
    Ip: Ip;
    /**
     * The name of the IP pool that you want to add the dedicated IP address to. You have to specify an IP pool that already exists.
     */
    DestinationPoolName: PoolName;
  }
  export interface PutDedicatedIpInPoolResponse {
  }
  export interface PutDedicatedIpWarmupAttributesRequest {
    /**
     * The dedicated IP address that you want to update the warm-up attributes for.
     */
    Ip: Ip;
    /**
     * The warm-up percentage that you want to associate with the dedicated IP address.
     */
    WarmupPercentage: Percentage100Wrapper;
  }
  export interface PutDedicatedIpWarmupAttributesResponse {
  }
  export interface PutDeliverabilityDashboardOptionRequest {
    /**
     * Specifies whether to enable the Deliverability dashboard for your Amazon Pinpoint account. To enable the dashboard, set this value to true.
     */
    DashboardEnabled: Enabled;
    /**
     * An array of objects, one for each verified domain that you use to send email and enabled the Deliverability dashboard for.
     */
    SubscribedDomains?: DomainDeliverabilityTrackingOptions;
  }
  export interface PutDeliverabilityDashboardOptionResponse {
  }
  export interface PutEmailIdentityDkimAttributesRequest {
    /**
     * The email identity that you want to change the DKIM settings for.
     */
    EmailIdentity: Identity;
    /**
     * Sets the DKIM signing configuration for the identity. When you set this value true, then the messages that Amazon Pinpoint sends from the identity are DKIM-signed. When you set this value to false, then the messages that Amazon Pinpoint sends from the identity aren't DKIM-signed.
     */
    SigningEnabled?: Enabled;
  }
  export interface PutEmailIdentityDkimAttributesResponse {
  }
  export interface PutEmailIdentityFeedbackAttributesRequest {
    /**
     * The email identity that you want to configure bounce and complaint feedback forwarding for.
     */
    EmailIdentity: Identity;
    /**
     * Sets the feedback forwarding configuration for the identity. If the value is true, Amazon Pinpoint sends you email notifications when bounce or complaint events occur. Amazon Pinpoint sends this notification to the address that you specified in the Return-Path header of the original email. When you set this value to false, Amazon Pinpoint sends notifications through other mechanisms, such as by notifying an Amazon SNS topic or another event destination. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications, Amazon Pinpoint sends an email notification when these events occur (even if this setting is disabled).
     */
    EmailForwardingEnabled?: Enabled;
  }
  export interface PutEmailIdentityFeedbackAttributesResponse {
  }
  export interface PutEmailIdentityMailFromAttributesRequest {
    /**
     * The verified email identity that you want to set up the custom MAIL FROM domain for.
     */
    EmailIdentity: Identity;
    /**
     *  The custom MAIL FROM domain that you want the verified identity to use. The MAIL FROM domain must meet the following criteria:   It has to be a subdomain of the verified identity.   It can't be used to receive email.   It can't be used in a "From" address if the MAIL FROM domain is a destination for feedback forwarding emails.  
     */
    MailFromDomain?: MailFromDomainName;
    /**
     * The action that you want Amazon Pinpoint to take if it can't read the required MX record when you send an email. When you set this value to UseDefaultValue, Amazon Pinpoint uses amazonses.com as the MAIL FROM domain. When you set this value to RejectMessage, Amazon Pinpoint returns a MailFromDomainNotVerified error, and doesn't attempt to deliver the email. These behaviors are taken when the custom MAIL FROM domain configuration is in the Pending, Failed, and TemporaryFailure states.
     */
    BehaviorOnMxFailure?: BehaviorOnMxFailure;
  }
  export interface PutEmailIdentityMailFromAttributesResponse {
  }
  export interface RawMessage {
    /**
     * The raw email message. The message has to meet the following criteria:   The message has to contain a header and a body, separated by one blank line.   All of the required header fields must be present in the message.   Each part of a multipart MIME message must be formatted properly.   Attachments must be in a file format that Amazon Pinpoint supports.    The entire message must be Base64 encoded.   If any of the MIME parts in your message contain content that is outside of the 7-bit ASCII character range, you should encode that content to ensure that recipients' email clients render the message properly.   The length of any single line of text in the message can't exceed 1,000 characters. This restriction is defined in RFC 5321.  
     */
    Data: RawMessageData;
  }
  export type RawMessageData = Buffer|Uint8Array|Blob|string;
  export type RblName = string;
  export type ReportId = string;
  export type ReportName = string;
  export interface ReputationOptions {
    /**
     * If true, tracking of reputation metrics is enabled for the configuration set. If false, tracking of reputation metrics is disabled for the configuration set.
     */
    ReputationMetricsEnabled?: Enabled;
    /**
     * The date and time (in Unix time) when the reputation metrics were last given a fresh start. When your account is given a fresh start, your reputation metrics are calculated starting from the date of the fresh start.
     */
    LastFreshStart?: LastFreshStart;
  }
  export interface SendEmailRequest {
    /**
     * The email address that you want to use as the "From" address for the email. The address that you specify has to be verified. 
     */
    FromEmailAddress?: EmailAddress;
    /**
     * An object that contains the recipients of the email message.
     */
    Destination: Destination;
    /**
     * The "Reply-to" email addresses for the message. When the recipient replies to the message, each Reply-to address receives the reply.
     */
    ReplyToAddresses?: EmailAddressList;
    /**
     * The address that Amazon Pinpoint should send bounce and complaint notifications to.
     */
    FeedbackForwardingEmailAddress?: EmailAddress;
    /**
     * An object that contains the body of the message. You can send either a Simple message or a Raw message.
     */
    Content: EmailContent;
    /**
     * A list of tags, in the form of name/value pairs, to apply to an email that you send using the SendEmail operation. Tags correspond to characteristics of the email that you define, so that you can publish email sending events. 
     */
    EmailTags?: MessageTagList;
    /**
     * The name of the configuration set that you want to use when sending the email.
     */
    ConfigurationSetName?: ConfigurationSetName;
  }
  export interface SendEmailResponse {
    /**
     * A unique identifier for the message that is generated when Amazon Pinpoint accepts the message.  It is possible for Amazon Pinpoint to accept a message without sending it. This can happen when the message you're trying to send has an attachment doesn't pass a virus check, or when you send a templated email that contains invalid personalization content, for example. 
     */
    MessageId?: OutboundMessageId;
  }
  export interface SendQuota {
    /**
     * The maximum number of emails that you can send in the current AWS Region over a 24-hour period. This value is also called your sending quota.
     */
    Max24HourSend?: Max24HourSend;
    /**
     * The maximum number of emails that you can send per second in the current AWS Region. This value is also called your maximum sending rate or your maximum TPS (transactions per second) rate.
     */
    MaxSendRate?: MaxSendRate;
    /**
     * The number of emails sent from your Amazon Pinpoint account in the current AWS Region over the past 24 hours.
     */
    SentLast24Hours?: SentLast24Hours;
  }
  export interface SendingOptions {
    /**
     * If true, email sending is enabled for the configuration set. If false, email sending is disabled for the configuration set.
     */
    SendingEnabled?: Enabled;
  }
  export type SendingPoolName = string;
  export type SentLast24Hours = number;
  export interface SnsDestination {
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic that you want to publish email events to. For more information about Amazon SNS topics, see the Amazon SNS Developer Guide.
     */
    TopicArn: AmazonResourceName;
  }
  export type Subject = string;
  export interface Tag {
    /**
     * One part of a key-value pair that defines a tag. The maximum length of a tag key is 128 characters. The minimum length is 1 character.
     */
    Key: TagKey;
    /**
     * The optional part of a key-value pair that defines a tag. The maximum length of a tag value is 256 characters. The minimum length is 0 characters. If you don’t want a resource to have a specific tag value, don’t specify a value for this parameter. Amazon Pinpoint will set the value to an empty string.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to add one or more tags to.
     */
    ResourceArn: AmazonResourceName;
    /**
     * A list of the tags that you want to add to the resource. A tag consists of a required tag key (Key) and an associated tag value (Value). The maximum length of a tag key is 128 characters. The maximum length of a tag value is 256 characters.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface Template {
    /**
     * The Amazon Resource Name (ARN) of the template.
     */
    TemplateArn?: TemplateArn;
    /**
     * An object that defines the values to use for message variables in the template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the value to use for that variable.
     */
    TemplateData?: TemplateData;
  }
  export type TemplateArn = string;
  export type TemplateData = string;
  export type Timestamp = Date;
  export type TlsPolicy = "REQUIRE"|"OPTIONAL"|string;
  export interface TrackingOptions {
    /**
     * The domain that you want to use for tracking open and click events.
     */
    CustomRedirectDomain: CustomRedirectDomain;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to remove one or more tags from.
     */
    ResourceArn: AmazonResourceName;
    /**
     * The tags (tag keys) that you want to remove from the resource. When you specify a tag key, the action removes both that key and its associated tag value. To remove more than one tag from the resource, append the TagKeys parameter and argument for each additional tag to remove, separated by an ampersand. For example: /v1/email/tags?ResourceArn=ResourceArn&amp;TagKeys=Key1&amp;TagKeys=Key2 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateConfigurationSetEventDestinationRequest {
    /**
     * The name of the configuration set that contains the event destination that you want to modify.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * The name of the event destination that you want to modify.
     */
    EventDestinationName: EventDestinationName;
    /**
     * An object that defines the event destination.
     */
    EventDestination: EventDestinationDefinition;
  }
  export interface UpdateConfigurationSetEventDestinationResponse {
  }
  export type Volume = number;
  export interface VolumeStatistics {
    /**
     * The total number of emails that arrived in recipients' inboxes.
     */
    InboxRawCount?: Volume;
    /**
     * The total number of emails that arrived in recipients' spam or junk mail folders.
     */
    SpamRawCount?: Volume;
    /**
     * An estimate of the percentage of emails sent from the current domain that will arrive in recipients' inboxes.
     */
    ProjectedInbox?: Volume;
    /**
     * An estimate of the percentage of emails sent from the current domain that will arrive in recipients' spam or junk mail folders.
     */
    ProjectedSpam?: Volume;
  }
  export type WarmupStatus = "IN_PROGRESS"|"DONE"|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-07-26"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the PinpointEmail client.
   */
  export import Types = PinpointEmail;
}
export = PinpointEmail;
