import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SESV2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SESV2.Types.ClientConfiguration)
  config: Config & SESV2.Types.ClientConfiguration;
  /**
   * Retrieves batches of metric data collected based on your sending activity. You can execute this operation no more than 16 times per second, and with at most 160 queries from the batches per second (cumulative).
   */
  batchGetMetricData(params: SESV2.Types.BatchGetMetricDataRequest, callback?: (err: AWSError, data: SESV2.Types.BatchGetMetricDataResponse) => void): Request<SESV2.Types.BatchGetMetricDataResponse, AWSError>;
  /**
   * Retrieves batches of metric data collected based on your sending activity. You can execute this operation no more than 16 times per second, and with at most 160 queries from the batches per second (cumulative).
   */
  batchGetMetricData(callback?: (err: AWSError, data: SESV2.Types.BatchGetMetricDataResponse) => void): Request<SESV2.Types.BatchGetMetricDataResponse, AWSError>;
  /**
   * Cancels an export job.
   */
  cancelExportJob(params: SESV2.Types.CancelExportJobRequest, callback?: (err: AWSError, data: SESV2.Types.CancelExportJobResponse) => void): Request<SESV2.Types.CancelExportJobResponse, AWSError>;
  /**
   * Cancels an export job.
   */
  cancelExportJob(callback?: (err: AWSError, data: SESV2.Types.CancelExportJobResponse) => void): Request<SESV2.Types.CancelExportJobResponse, AWSError>;
  /**
   * Create a configuration set. Configuration sets are groups of rules that you can apply to the emails that you send. You apply a configuration set to an email by specifying the name of the configuration set when you call the Amazon SES API v2. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email. 
   */
  createConfigurationSet(params: SESV2.Types.CreateConfigurationSetRequest, callback?: (err: AWSError, data: SESV2.Types.CreateConfigurationSetResponse) => void): Request<SESV2.Types.CreateConfigurationSetResponse, AWSError>;
  /**
   * Create a configuration set. Configuration sets are groups of rules that you can apply to the emails that you send. You apply a configuration set to an email by specifying the name of the configuration set when you call the Amazon SES API v2. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email. 
   */
  createConfigurationSet(callback?: (err: AWSError, data: SESV2.Types.CreateConfigurationSetResponse) => void): Request<SESV2.Types.CreateConfigurationSetResponse, AWSError>;
  /**
   * Create an event destination. Events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage. A single configuration set can include more than one event destination.
   */
  createConfigurationSetEventDestination(params: SESV2.Types.CreateConfigurationSetEventDestinationRequest, callback?: (err: AWSError, data: SESV2.Types.CreateConfigurationSetEventDestinationResponse) => void): Request<SESV2.Types.CreateConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Create an event destination. Events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage. A single configuration set can include more than one event destination.
   */
  createConfigurationSetEventDestination(callback?: (err: AWSError, data: SESV2.Types.CreateConfigurationSetEventDestinationResponse) => void): Request<SESV2.Types.CreateConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Creates a contact, which is an end-user who is receiving the email, and adds them to a contact list.
   */
  createContact(params: SESV2.Types.CreateContactRequest, callback?: (err: AWSError, data: SESV2.Types.CreateContactResponse) => void): Request<SESV2.Types.CreateContactResponse, AWSError>;
  /**
   * Creates a contact, which is an end-user who is receiving the email, and adds them to a contact list.
   */
  createContact(callback?: (err: AWSError, data: SESV2.Types.CreateContactResponse) => void): Request<SESV2.Types.CreateContactResponse, AWSError>;
  /**
   * Creates a contact list.
   */
  createContactList(params: SESV2.Types.CreateContactListRequest, callback?: (err: AWSError, data: SESV2.Types.CreateContactListResponse) => void): Request<SESV2.Types.CreateContactListResponse, AWSError>;
  /**
   * Creates a contact list.
   */
  createContactList(callback?: (err: AWSError, data: SESV2.Types.CreateContactListResponse) => void): Request<SESV2.Types.CreateContactListResponse, AWSError>;
  /**
   * Creates a new custom verification email template. For more information about custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  createCustomVerificationEmailTemplate(params: SESV2.Types.CreateCustomVerificationEmailTemplateRequest, callback?: (err: AWSError, data: SESV2.Types.CreateCustomVerificationEmailTemplateResponse) => void): Request<SESV2.Types.CreateCustomVerificationEmailTemplateResponse, AWSError>;
  /**
   * Creates a new custom verification email template. For more information about custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  createCustomVerificationEmailTemplate(callback?: (err: AWSError, data: SESV2.Types.CreateCustomVerificationEmailTemplateResponse) => void): Request<SESV2.Types.CreateCustomVerificationEmailTemplateResponse, AWSError>;
  /**
   * Create a new pool of dedicated IP addresses. A pool can include one or more dedicated IP addresses that are associated with your Amazon Web Services account. You can associate a pool with a configuration set. When you send an email that uses that configuration set, the message is sent from one of the addresses in the associated pool.
   */
  createDedicatedIpPool(params: SESV2.Types.CreateDedicatedIpPoolRequest, callback?: (err: AWSError, data: SESV2.Types.CreateDedicatedIpPoolResponse) => void): Request<SESV2.Types.CreateDedicatedIpPoolResponse, AWSError>;
  /**
   * Create a new pool of dedicated IP addresses. A pool can include one or more dedicated IP addresses that are associated with your Amazon Web Services account. You can associate a pool with a configuration set. When you send an email that uses that configuration set, the message is sent from one of the addresses in the associated pool.
   */
  createDedicatedIpPool(callback?: (err: AWSError, data: SESV2.Types.CreateDedicatedIpPoolResponse) => void): Request<SESV2.Types.CreateDedicatedIpPoolResponse, AWSError>;
  /**
   * Create a new predictive inbox placement test. Predictive inbox placement tests can help you predict how your messages will be handled by various email providers around the world. When you perform a predictive inbox placement test, you provide a sample message that contains the content that you plan to send to your customers. Amazon SES then sends that message to special email addresses spread across several major email providers. After about 24 hours, the test is complete, and you can use the GetDeliverabilityTestReport operation to view the results of the test.
   */
  createDeliverabilityTestReport(params: SESV2.Types.CreateDeliverabilityTestReportRequest, callback?: (err: AWSError, data: SESV2.Types.CreateDeliverabilityTestReportResponse) => void): Request<SESV2.Types.CreateDeliverabilityTestReportResponse, AWSError>;
  /**
   * Create a new predictive inbox placement test. Predictive inbox placement tests can help you predict how your messages will be handled by various email providers around the world. When you perform a predictive inbox placement test, you provide a sample message that contains the content that you plan to send to your customers. Amazon SES then sends that message to special email addresses spread across several major email providers. After about 24 hours, the test is complete, and you can use the GetDeliverabilityTestReport operation to view the results of the test.
   */
  createDeliverabilityTestReport(callback?: (err: AWSError, data: SESV2.Types.CreateDeliverabilityTestReportResponse) => void): Request<SESV2.Types.CreateDeliverabilityTestReportResponse, AWSError>;
  /**
   * Starts the process of verifying an email identity. An identity is an email address or domain that you use when you send email. Before you can use an identity to send email, you first have to verify it. By verifying an identity, you demonstrate that you're the owner of the identity, and that you've given Amazon SES API v2 permission to send email from the identity. When you verify an email address, Amazon SES sends an email to the address. Your email address is verified as soon as you follow the link in the verification email.  When you verify a domain without specifying the DkimSigningAttributes object, this operation provides a set of DKIM tokens. You can convert these tokens into CNAME records, which you then add to the DNS configuration for your domain. Your domain is verified when Amazon SES detects these records in the DNS configuration for your domain. This verification method is known as Easy DKIM. Alternatively, you can perform the verification process by providing your own public-private key pair. This verification method is known as Bring Your Own DKIM (BYODKIM). To use BYODKIM, your call to the CreateEmailIdentity operation has to include the DkimSigningAttributes object. When you specify this object, you provide a selector (a component of the DNS record name that identifies the public key to use for DKIM authentication) and a private key. When you verify a domain, this operation provides a set of DKIM tokens, which you can convert into CNAME tokens. You add these CNAME tokens to the DNS configuration for your domain. Your domain is verified when Amazon SES detects these records in the DNS configuration for your domain. For some DNS providers, it can take 72 hours or more to complete the domain verification process. Additionally, you can associate an existing configuration set with the email identity that you're verifying.
   */
  createEmailIdentity(params: SESV2.Types.CreateEmailIdentityRequest, callback?: (err: AWSError, data: SESV2.Types.CreateEmailIdentityResponse) => void): Request<SESV2.Types.CreateEmailIdentityResponse, AWSError>;
  /**
   * Starts the process of verifying an email identity. An identity is an email address or domain that you use when you send email. Before you can use an identity to send email, you first have to verify it. By verifying an identity, you demonstrate that you're the owner of the identity, and that you've given Amazon SES API v2 permission to send email from the identity. When you verify an email address, Amazon SES sends an email to the address. Your email address is verified as soon as you follow the link in the verification email.  When you verify a domain without specifying the DkimSigningAttributes object, this operation provides a set of DKIM tokens. You can convert these tokens into CNAME records, which you then add to the DNS configuration for your domain. Your domain is verified when Amazon SES detects these records in the DNS configuration for your domain. This verification method is known as Easy DKIM. Alternatively, you can perform the verification process by providing your own public-private key pair. This verification method is known as Bring Your Own DKIM (BYODKIM). To use BYODKIM, your call to the CreateEmailIdentity operation has to include the DkimSigningAttributes object. When you specify this object, you provide a selector (a component of the DNS record name that identifies the public key to use for DKIM authentication) and a private key. When you verify a domain, this operation provides a set of DKIM tokens, which you can convert into CNAME tokens. You add these CNAME tokens to the DNS configuration for your domain. Your domain is verified when Amazon SES detects these records in the DNS configuration for your domain. For some DNS providers, it can take 72 hours or more to complete the domain verification process. Additionally, you can associate an existing configuration set with the email identity that you're verifying.
   */
  createEmailIdentity(callback?: (err: AWSError, data: SESV2.Types.CreateEmailIdentityResponse) => void): Request<SESV2.Types.CreateEmailIdentityResponse, AWSError>;
  /**
   * Creates the specified sending authorization policy for the given identity (an email address or a domain).  This API is for the identity owner only. If you have not verified the identity, this API will return an error.  Sending authorization is a feature that enables an identity owner to authorize other senders to use its identities. For information about using sending authorization, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  createEmailIdentityPolicy(params: SESV2.Types.CreateEmailIdentityPolicyRequest, callback?: (err: AWSError, data: SESV2.Types.CreateEmailIdentityPolicyResponse) => void): Request<SESV2.Types.CreateEmailIdentityPolicyResponse, AWSError>;
  /**
   * Creates the specified sending authorization policy for the given identity (an email address or a domain).  This API is for the identity owner only. If you have not verified the identity, this API will return an error.  Sending authorization is a feature that enables an identity owner to authorize other senders to use its identities. For information about using sending authorization, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  createEmailIdentityPolicy(callback?: (err: AWSError, data: SESV2.Types.CreateEmailIdentityPolicyResponse) => void): Request<SESV2.Types.CreateEmailIdentityPolicyResponse, AWSError>;
  /**
   * Creates an email template. Email templates enable you to send personalized email to one or more destinations in a single API operation. For more information, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  createEmailTemplate(params: SESV2.Types.CreateEmailTemplateRequest, callback?: (err: AWSError, data: SESV2.Types.CreateEmailTemplateResponse) => void): Request<SESV2.Types.CreateEmailTemplateResponse, AWSError>;
  /**
   * Creates an email template. Email templates enable you to send personalized email to one or more destinations in a single API operation. For more information, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  createEmailTemplate(callback?: (err: AWSError, data: SESV2.Types.CreateEmailTemplateResponse) => void): Request<SESV2.Types.CreateEmailTemplateResponse, AWSError>;
  /**
   * Creates an export job for a data source and destination. You can execute this operation no more than once per second.
   */
  createExportJob(params: SESV2.Types.CreateExportJobRequest, callback?: (err: AWSError, data: SESV2.Types.CreateExportJobResponse) => void): Request<SESV2.Types.CreateExportJobResponse, AWSError>;
  /**
   * Creates an export job for a data source and destination. You can execute this operation no more than once per second.
   */
  createExportJob(callback?: (err: AWSError, data: SESV2.Types.CreateExportJobResponse) => void): Request<SESV2.Types.CreateExportJobResponse, AWSError>;
  /**
   * Creates an import job for a data destination.
   */
  createImportJob(params: SESV2.Types.CreateImportJobRequest, callback?: (err: AWSError, data: SESV2.Types.CreateImportJobResponse) => void): Request<SESV2.Types.CreateImportJobResponse, AWSError>;
  /**
   * Creates an import job for a data destination.
   */
  createImportJob(callback?: (err: AWSError, data: SESV2.Types.CreateImportJobResponse) => void): Request<SESV2.Types.CreateImportJobResponse, AWSError>;
  /**
   * Delete an existing configuration set.  Configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  deleteConfigurationSet(params: SESV2.Types.DeleteConfigurationSetRequest, callback?: (err: AWSError, data: SESV2.Types.DeleteConfigurationSetResponse) => void): Request<SESV2.Types.DeleteConfigurationSetResponse, AWSError>;
  /**
   * Delete an existing configuration set.  Configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  deleteConfigurationSet(callback?: (err: AWSError, data: SESV2.Types.DeleteConfigurationSetResponse) => void): Request<SESV2.Types.DeleteConfigurationSetResponse, AWSError>;
  /**
   * Delete an event destination.  Events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  deleteConfigurationSetEventDestination(params: SESV2.Types.DeleteConfigurationSetEventDestinationRequest, callback?: (err: AWSError, data: SESV2.Types.DeleteConfigurationSetEventDestinationResponse) => void): Request<SESV2.Types.DeleteConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Delete an event destination.  Events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  deleteConfigurationSetEventDestination(callback?: (err: AWSError, data: SESV2.Types.DeleteConfigurationSetEventDestinationResponse) => void): Request<SESV2.Types.DeleteConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Removes a contact from a contact list.
   */
  deleteContact(params: SESV2.Types.DeleteContactRequest, callback?: (err: AWSError, data: SESV2.Types.DeleteContactResponse) => void): Request<SESV2.Types.DeleteContactResponse, AWSError>;
  /**
   * Removes a contact from a contact list.
   */
  deleteContact(callback?: (err: AWSError, data: SESV2.Types.DeleteContactResponse) => void): Request<SESV2.Types.DeleteContactResponse, AWSError>;
  /**
   * Deletes a contact list and all of the contacts on that list.
   */
  deleteContactList(params: SESV2.Types.DeleteContactListRequest, callback?: (err: AWSError, data: SESV2.Types.DeleteContactListResponse) => void): Request<SESV2.Types.DeleteContactListResponse, AWSError>;
  /**
   * Deletes a contact list and all of the contacts on that list.
   */
  deleteContactList(callback?: (err: AWSError, data: SESV2.Types.DeleteContactListResponse) => void): Request<SESV2.Types.DeleteContactListResponse, AWSError>;
  /**
   * Deletes an existing custom verification email template. For more information about custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  deleteCustomVerificationEmailTemplate(params: SESV2.Types.DeleteCustomVerificationEmailTemplateRequest, callback?: (err: AWSError, data: SESV2.Types.DeleteCustomVerificationEmailTemplateResponse) => void): Request<SESV2.Types.DeleteCustomVerificationEmailTemplateResponse, AWSError>;
  /**
   * Deletes an existing custom verification email template. For more information about custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  deleteCustomVerificationEmailTemplate(callback?: (err: AWSError, data: SESV2.Types.DeleteCustomVerificationEmailTemplateResponse) => void): Request<SESV2.Types.DeleteCustomVerificationEmailTemplateResponse, AWSError>;
  /**
   * Delete a dedicated IP pool.
   */
  deleteDedicatedIpPool(params: SESV2.Types.DeleteDedicatedIpPoolRequest, callback?: (err: AWSError, data: SESV2.Types.DeleteDedicatedIpPoolResponse) => void): Request<SESV2.Types.DeleteDedicatedIpPoolResponse, AWSError>;
  /**
   * Delete a dedicated IP pool.
   */
  deleteDedicatedIpPool(callback?: (err: AWSError, data: SESV2.Types.DeleteDedicatedIpPoolResponse) => void): Request<SESV2.Types.DeleteDedicatedIpPoolResponse, AWSError>;
  /**
   * Deletes an email identity. An identity can be either an email address or a domain name.
   */
  deleteEmailIdentity(params: SESV2.Types.DeleteEmailIdentityRequest, callback?: (err: AWSError, data: SESV2.Types.DeleteEmailIdentityResponse) => void): Request<SESV2.Types.DeleteEmailIdentityResponse, AWSError>;
  /**
   * Deletes an email identity. An identity can be either an email address or a domain name.
   */
  deleteEmailIdentity(callback?: (err: AWSError, data: SESV2.Types.DeleteEmailIdentityResponse) => void): Request<SESV2.Types.DeleteEmailIdentityResponse, AWSError>;
  /**
   * Deletes the specified sending authorization policy for the given identity (an email address or a domain). This API returns successfully even if a policy with the specified name does not exist.  This API is for the identity owner only. If you have not verified the identity, this API will return an error.  Sending authorization is a feature that enables an identity owner to authorize other senders to use its identities. For information about using sending authorization, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  deleteEmailIdentityPolicy(params: SESV2.Types.DeleteEmailIdentityPolicyRequest, callback?: (err: AWSError, data: SESV2.Types.DeleteEmailIdentityPolicyResponse) => void): Request<SESV2.Types.DeleteEmailIdentityPolicyResponse, AWSError>;
  /**
   * Deletes the specified sending authorization policy for the given identity (an email address or a domain). This API returns successfully even if a policy with the specified name does not exist.  This API is for the identity owner only. If you have not verified the identity, this API will return an error.  Sending authorization is a feature that enables an identity owner to authorize other senders to use its identities. For information about using sending authorization, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  deleteEmailIdentityPolicy(callback?: (err: AWSError, data: SESV2.Types.DeleteEmailIdentityPolicyResponse) => void): Request<SESV2.Types.DeleteEmailIdentityPolicyResponse, AWSError>;
  /**
   * Deletes an email template. You can execute this operation no more than once per second.
   */
  deleteEmailTemplate(params: SESV2.Types.DeleteEmailTemplateRequest, callback?: (err: AWSError, data: SESV2.Types.DeleteEmailTemplateResponse) => void): Request<SESV2.Types.DeleteEmailTemplateResponse, AWSError>;
  /**
   * Deletes an email template. You can execute this operation no more than once per second.
   */
  deleteEmailTemplate(callback?: (err: AWSError, data: SESV2.Types.DeleteEmailTemplateResponse) => void): Request<SESV2.Types.DeleteEmailTemplateResponse, AWSError>;
  /**
   * Removes an email address from the suppression list for your account.
   */
  deleteSuppressedDestination(params: SESV2.Types.DeleteSuppressedDestinationRequest, callback?: (err: AWSError, data: SESV2.Types.DeleteSuppressedDestinationResponse) => void): Request<SESV2.Types.DeleteSuppressedDestinationResponse, AWSError>;
  /**
   * Removes an email address from the suppression list for your account.
   */
  deleteSuppressedDestination(callback?: (err: AWSError, data: SESV2.Types.DeleteSuppressedDestinationResponse) => void): Request<SESV2.Types.DeleteSuppressedDestinationResponse, AWSError>;
  /**
   * Obtain information about the email-sending status and capabilities of your Amazon SES account in the current Amazon Web Services Region.
   */
  getAccount(params: SESV2.Types.GetAccountRequest, callback?: (err: AWSError, data: SESV2.Types.GetAccountResponse) => void): Request<SESV2.Types.GetAccountResponse, AWSError>;
  /**
   * Obtain information about the email-sending status and capabilities of your Amazon SES account in the current Amazon Web Services Region.
   */
  getAccount(callback?: (err: AWSError, data: SESV2.Types.GetAccountResponse) => void): Request<SESV2.Types.GetAccountResponse, AWSError>;
  /**
   * Retrieve a list of the blacklists that your dedicated IP addresses appear on.
   */
  getBlacklistReports(params: SESV2.Types.GetBlacklistReportsRequest, callback?: (err: AWSError, data: SESV2.Types.GetBlacklistReportsResponse) => void): Request<SESV2.Types.GetBlacklistReportsResponse, AWSError>;
  /**
   * Retrieve a list of the blacklists that your dedicated IP addresses appear on.
   */
  getBlacklistReports(callback?: (err: AWSError, data: SESV2.Types.GetBlacklistReportsResponse) => void): Request<SESV2.Types.GetBlacklistReportsResponse, AWSError>;
  /**
   * Get information about an existing configuration set, including the dedicated IP pool that it's associated with, whether or not it's enabled for sending email, and more.  Configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  getConfigurationSet(params: SESV2.Types.GetConfigurationSetRequest, callback?: (err: AWSError, data: SESV2.Types.GetConfigurationSetResponse) => void): Request<SESV2.Types.GetConfigurationSetResponse, AWSError>;
  /**
   * Get information about an existing configuration set, including the dedicated IP pool that it's associated with, whether or not it's enabled for sending email, and more.  Configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  getConfigurationSet(callback?: (err: AWSError, data: SESV2.Types.GetConfigurationSetResponse) => void): Request<SESV2.Types.GetConfigurationSetResponse, AWSError>;
  /**
   * Retrieve a list of event destinations that are associated with a configuration set.  Events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  getConfigurationSetEventDestinations(params: SESV2.Types.GetConfigurationSetEventDestinationsRequest, callback?: (err: AWSError, data: SESV2.Types.GetConfigurationSetEventDestinationsResponse) => void): Request<SESV2.Types.GetConfigurationSetEventDestinationsResponse, AWSError>;
  /**
   * Retrieve a list of event destinations that are associated with a configuration set.  Events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  getConfigurationSetEventDestinations(callback?: (err: AWSError, data: SESV2.Types.GetConfigurationSetEventDestinationsResponse) => void): Request<SESV2.Types.GetConfigurationSetEventDestinationsResponse, AWSError>;
  /**
   * Returns a contact from a contact list.
   */
  getContact(params: SESV2.Types.GetContactRequest, callback?: (err: AWSError, data: SESV2.Types.GetContactResponse) => void): Request<SESV2.Types.GetContactResponse, AWSError>;
  /**
   * Returns a contact from a contact list.
   */
  getContact(callback?: (err: AWSError, data: SESV2.Types.GetContactResponse) => void): Request<SESV2.Types.GetContactResponse, AWSError>;
  /**
   * Returns contact list metadata. It does not return any information about the contacts present in the list.
   */
  getContactList(params: SESV2.Types.GetContactListRequest, callback?: (err: AWSError, data: SESV2.Types.GetContactListResponse) => void): Request<SESV2.Types.GetContactListResponse, AWSError>;
  /**
   * Returns contact list metadata. It does not return any information about the contacts present in the list.
   */
  getContactList(callback?: (err: AWSError, data: SESV2.Types.GetContactListResponse) => void): Request<SESV2.Types.GetContactListResponse, AWSError>;
  /**
   * Returns the custom email verification template for the template name you specify. For more information about custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  getCustomVerificationEmailTemplate(params: SESV2.Types.GetCustomVerificationEmailTemplateRequest, callback?: (err: AWSError, data: SESV2.Types.GetCustomVerificationEmailTemplateResponse) => void): Request<SESV2.Types.GetCustomVerificationEmailTemplateResponse, AWSError>;
  /**
   * Returns the custom email verification template for the template name you specify. For more information about custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  getCustomVerificationEmailTemplate(callback?: (err: AWSError, data: SESV2.Types.GetCustomVerificationEmailTemplateResponse) => void): Request<SESV2.Types.GetCustomVerificationEmailTemplateResponse, AWSError>;
  /**
   * Get information about a dedicated IP address, including the name of the dedicated IP pool that it's associated with, as well information about the automatic warm-up process for the address.
   */
  getDedicatedIp(params: SESV2.Types.GetDedicatedIpRequest, callback?: (err: AWSError, data: SESV2.Types.GetDedicatedIpResponse) => void): Request<SESV2.Types.GetDedicatedIpResponse, AWSError>;
  /**
   * Get information about a dedicated IP address, including the name of the dedicated IP pool that it's associated with, as well information about the automatic warm-up process for the address.
   */
  getDedicatedIp(callback?: (err: AWSError, data: SESV2.Types.GetDedicatedIpResponse) => void): Request<SESV2.Types.GetDedicatedIpResponse, AWSError>;
  /**
   * Retrieve information about the dedicated pool.
   */
  getDedicatedIpPool(params: SESV2.Types.GetDedicatedIpPoolRequest, callback?: (err: AWSError, data: SESV2.Types.GetDedicatedIpPoolResponse) => void): Request<SESV2.Types.GetDedicatedIpPoolResponse, AWSError>;
  /**
   * Retrieve information about the dedicated pool.
   */
  getDedicatedIpPool(callback?: (err: AWSError, data: SESV2.Types.GetDedicatedIpPoolResponse) => void): Request<SESV2.Types.GetDedicatedIpPoolResponse, AWSError>;
  /**
   * List the dedicated IP addresses that are associated with your Amazon Web Services account.
   */
  getDedicatedIps(params: SESV2.Types.GetDedicatedIpsRequest, callback?: (err: AWSError, data: SESV2.Types.GetDedicatedIpsResponse) => void): Request<SESV2.Types.GetDedicatedIpsResponse, AWSError>;
  /**
   * List the dedicated IP addresses that are associated with your Amazon Web Services account.
   */
  getDedicatedIps(callback?: (err: AWSError, data: SESV2.Types.GetDedicatedIpsResponse) => void): Request<SESV2.Types.GetDedicatedIpsResponse, AWSError>;
  /**
   * Retrieve information about the status of the Deliverability dashboard for your account. When the Deliverability dashboard is enabled, you gain access to reputation, deliverability, and other metrics for the domains that you use to send email. You also gain the ability to perform predictive inbox placement tests. When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition to any other fees that you accrue by using Amazon SES and other Amazon Web Services services. For more information about the features and cost of a Deliverability dashboard subscription, see Amazon SES Pricing.
   */
  getDeliverabilityDashboardOptions(params: SESV2.Types.GetDeliverabilityDashboardOptionsRequest, callback?: (err: AWSError, data: SESV2.Types.GetDeliverabilityDashboardOptionsResponse) => void): Request<SESV2.Types.GetDeliverabilityDashboardOptionsResponse, AWSError>;
  /**
   * Retrieve information about the status of the Deliverability dashboard for your account. When the Deliverability dashboard is enabled, you gain access to reputation, deliverability, and other metrics for the domains that you use to send email. You also gain the ability to perform predictive inbox placement tests. When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition to any other fees that you accrue by using Amazon SES and other Amazon Web Services services. For more information about the features and cost of a Deliverability dashboard subscription, see Amazon SES Pricing.
   */
  getDeliverabilityDashboardOptions(callback?: (err: AWSError, data: SESV2.Types.GetDeliverabilityDashboardOptionsResponse) => void): Request<SESV2.Types.GetDeliverabilityDashboardOptionsResponse, AWSError>;
  /**
   * Retrieve the results of a predictive inbox placement test.
   */
  getDeliverabilityTestReport(params: SESV2.Types.GetDeliverabilityTestReportRequest, callback?: (err: AWSError, data: SESV2.Types.GetDeliverabilityTestReportResponse) => void): Request<SESV2.Types.GetDeliverabilityTestReportResponse, AWSError>;
  /**
   * Retrieve the results of a predictive inbox placement test.
   */
  getDeliverabilityTestReport(callback?: (err: AWSError, data: SESV2.Types.GetDeliverabilityTestReportResponse) => void): Request<SESV2.Types.GetDeliverabilityTestReportResponse, AWSError>;
  /**
   * Retrieve all the deliverability data for a specific campaign. This data is available for a campaign only if the campaign sent email by using a domain that the Deliverability dashboard is enabled for.
   */
  getDomainDeliverabilityCampaign(params: SESV2.Types.GetDomainDeliverabilityCampaignRequest, callback?: (err: AWSError, data: SESV2.Types.GetDomainDeliverabilityCampaignResponse) => void): Request<SESV2.Types.GetDomainDeliverabilityCampaignResponse, AWSError>;
  /**
   * Retrieve all the deliverability data for a specific campaign. This data is available for a campaign only if the campaign sent email by using a domain that the Deliverability dashboard is enabled for.
   */
  getDomainDeliverabilityCampaign(callback?: (err: AWSError, data: SESV2.Types.GetDomainDeliverabilityCampaignResponse) => void): Request<SESV2.Types.GetDomainDeliverabilityCampaignResponse, AWSError>;
  /**
   * Retrieve inbox placement and engagement rates for the domains that you use to send email.
   */
  getDomainStatisticsReport(params: SESV2.Types.GetDomainStatisticsReportRequest, callback?: (err: AWSError, data: SESV2.Types.GetDomainStatisticsReportResponse) => void): Request<SESV2.Types.GetDomainStatisticsReportResponse, AWSError>;
  /**
   * Retrieve inbox placement and engagement rates for the domains that you use to send email.
   */
  getDomainStatisticsReport(callback?: (err: AWSError, data: SESV2.Types.GetDomainStatisticsReportResponse) => void): Request<SESV2.Types.GetDomainStatisticsReportResponse, AWSError>;
  /**
   * Provides information about a specific identity, including the identity's verification status, sending authorization policies, its DKIM authentication status, and its custom Mail-From settings.
   */
  getEmailIdentity(params: SESV2.Types.GetEmailIdentityRequest, callback?: (err: AWSError, data: SESV2.Types.GetEmailIdentityResponse) => void): Request<SESV2.Types.GetEmailIdentityResponse, AWSError>;
  /**
   * Provides information about a specific identity, including the identity's verification status, sending authorization policies, its DKIM authentication status, and its custom Mail-From settings.
   */
  getEmailIdentity(callback?: (err: AWSError, data: SESV2.Types.GetEmailIdentityResponse) => void): Request<SESV2.Types.GetEmailIdentityResponse, AWSError>;
  /**
   * Returns the requested sending authorization policies for the given identity (an email address or a domain). The policies are returned as a map of policy names to policy contents. You can retrieve a maximum of 20 policies at a time.  This API is for the identity owner only. If you have not verified the identity, this API will return an error.  Sending authorization is a feature that enables an identity owner to authorize other senders to use its identities. For information about using sending authorization, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  getEmailIdentityPolicies(params: SESV2.Types.GetEmailIdentityPoliciesRequest, callback?: (err: AWSError, data: SESV2.Types.GetEmailIdentityPoliciesResponse) => void): Request<SESV2.Types.GetEmailIdentityPoliciesResponse, AWSError>;
  /**
   * Returns the requested sending authorization policies for the given identity (an email address or a domain). The policies are returned as a map of policy names to policy contents. You can retrieve a maximum of 20 policies at a time.  This API is for the identity owner only. If you have not verified the identity, this API will return an error.  Sending authorization is a feature that enables an identity owner to authorize other senders to use its identities. For information about using sending authorization, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  getEmailIdentityPolicies(callback?: (err: AWSError, data: SESV2.Types.GetEmailIdentityPoliciesResponse) => void): Request<SESV2.Types.GetEmailIdentityPoliciesResponse, AWSError>;
  /**
   * Displays the template object (which includes the subject line, HTML part and text part) for the template you specify. You can execute this operation no more than once per second.
   */
  getEmailTemplate(params: SESV2.Types.GetEmailTemplateRequest, callback?: (err: AWSError, data: SESV2.Types.GetEmailTemplateResponse) => void): Request<SESV2.Types.GetEmailTemplateResponse, AWSError>;
  /**
   * Displays the template object (which includes the subject line, HTML part and text part) for the template you specify. You can execute this operation no more than once per second.
   */
  getEmailTemplate(callback?: (err: AWSError, data: SESV2.Types.GetEmailTemplateResponse) => void): Request<SESV2.Types.GetEmailTemplateResponse, AWSError>;
  /**
   * Provides information about an export job.
   */
  getExportJob(params: SESV2.Types.GetExportJobRequest, callback?: (err: AWSError, data: SESV2.Types.GetExportJobResponse) => void): Request<SESV2.Types.GetExportJobResponse, AWSError>;
  /**
   * Provides information about an export job.
   */
  getExportJob(callback?: (err: AWSError, data: SESV2.Types.GetExportJobResponse) => void): Request<SESV2.Types.GetExportJobResponse, AWSError>;
  /**
   * Provides information about an import job.
   */
  getImportJob(params: SESV2.Types.GetImportJobRequest, callback?: (err: AWSError, data: SESV2.Types.GetImportJobResponse) => void): Request<SESV2.Types.GetImportJobResponse, AWSError>;
  /**
   * Provides information about an import job.
   */
  getImportJob(callback?: (err: AWSError, data: SESV2.Types.GetImportJobResponse) => void): Request<SESV2.Types.GetImportJobResponse, AWSError>;
  /**
   * Provides information about a specific message, including the from address, the subject, the recipient address, email tags, as well as events associated with the message. You can execute this operation no more than once per second.
   */
  getMessageInsights(params: SESV2.Types.GetMessageInsightsRequest, callback?: (err: AWSError, data: SESV2.Types.GetMessageInsightsResponse) => void): Request<SESV2.Types.GetMessageInsightsResponse, AWSError>;
  /**
   * Provides information about a specific message, including the from address, the subject, the recipient address, email tags, as well as events associated with the message. You can execute this operation no more than once per second.
   */
  getMessageInsights(callback?: (err: AWSError, data: SESV2.Types.GetMessageInsightsResponse) => void): Request<SESV2.Types.GetMessageInsightsResponse, AWSError>;
  /**
   * Retrieves information about a specific email address that's on the suppression list for your account.
   */
  getSuppressedDestination(params: SESV2.Types.GetSuppressedDestinationRequest, callback?: (err: AWSError, data: SESV2.Types.GetSuppressedDestinationResponse) => void): Request<SESV2.Types.GetSuppressedDestinationResponse, AWSError>;
  /**
   * Retrieves information about a specific email address that's on the suppression list for your account.
   */
  getSuppressedDestination(callback?: (err: AWSError, data: SESV2.Types.GetSuppressedDestinationResponse) => void): Request<SESV2.Types.GetSuppressedDestinationResponse, AWSError>;
  /**
   * List all of the configuration sets associated with your account in the current region.  Configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  listConfigurationSets(params: SESV2.Types.ListConfigurationSetsRequest, callback?: (err: AWSError, data: SESV2.Types.ListConfigurationSetsResponse) => void): Request<SESV2.Types.ListConfigurationSetsResponse, AWSError>;
  /**
   * List all of the configuration sets associated with your account in the current region.  Configuration sets are groups of rules that you can apply to the emails you send. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
   */
  listConfigurationSets(callback?: (err: AWSError, data: SESV2.Types.ListConfigurationSetsResponse) => void): Request<SESV2.Types.ListConfigurationSetsResponse, AWSError>;
  /**
   * Lists all of the contact lists available.
   */
  listContactLists(params: SESV2.Types.ListContactListsRequest, callback?: (err: AWSError, data: SESV2.Types.ListContactListsResponse) => void): Request<SESV2.Types.ListContactListsResponse, AWSError>;
  /**
   * Lists all of the contact lists available.
   */
  listContactLists(callback?: (err: AWSError, data: SESV2.Types.ListContactListsResponse) => void): Request<SESV2.Types.ListContactListsResponse, AWSError>;
  /**
   * Lists the contacts present in a specific contact list.
   */
  listContacts(params: SESV2.Types.ListContactsRequest, callback?: (err: AWSError, data: SESV2.Types.ListContactsResponse) => void): Request<SESV2.Types.ListContactsResponse, AWSError>;
  /**
   * Lists the contacts present in a specific contact list.
   */
  listContacts(callback?: (err: AWSError, data: SESV2.Types.ListContactsResponse) => void): Request<SESV2.Types.ListContactsResponse, AWSError>;
  /**
   * Lists the existing custom verification email templates for your account in the current Amazon Web Services Region. For more information about custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  listCustomVerificationEmailTemplates(params: SESV2.Types.ListCustomVerificationEmailTemplatesRequest, callback?: (err: AWSError, data: SESV2.Types.ListCustomVerificationEmailTemplatesResponse) => void): Request<SESV2.Types.ListCustomVerificationEmailTemplatesResponse, AWSError>;
  /**
   * Lists the existing custom verification email templates for your account in the current Amazon Web Services Region. For more information about custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  listCustomVerificationEmailTemplates(callback?: (err: AWSError, data: SESV2.Types.ListCustomVerificationEmailTemplatesResponse) => void): Request<SESV2.Types.ListCustomVerificationEmailTemplatesResponse, AWSError>;
  /**
   * List all of the dedicated IP pools that exist in your Amazon Web Services account in the current Region.
   */
  listDedicatedIpPools(params: SESV2.Types.ListDedicatedIpPoolsRequest, callback?: (err: AWSError, data: SESV2.Types.ListDedicatedIpPoolsResponse) => void): Request<SESV2.Types.ListDedicatedIpPoolsResponse, AWSError>;
  /**
   * List all of the dedicated IP pools that exist in your Amazon Web Services account in the current Region.
   */
  listDedicatedIpPools(callback?: (err: AWSError, data: SESV2.Types.ListDedicatedIpPoolsResponse) => void): Request<SESV2.Types.ListDedicatedIpPoolsResponse, AWSError>;
  /**
   * Show a list of the predictive inbox placement tests that you've performed, regardless of their statuses. For predictive inbox placement tests that are complete, you can use the GetDeliverabilityTestReport operation to view the results.
   */
  listDeliverabilityTestReports(params: SESV2.Types.ListDeliverabilityTestReportsRequest, callback?: (err: AWSError, data: SESV2.Types.ListDeliverabilityTestReportsResponse) => void): Request<SESV2.Types.ListDeliverabilityTestReportsResponse, AWSError>;
  /**
   * Show a list of the predictive inbox placement tests that you've performed, regardless of their statuses. For predictive inbox placement tests that are complete, you can use the GetDeliverabilityTestReport operation to view the results.
   */
  listDeliverabilityTestReports(callback?: (err: AWSError, data: SESV2.Types.ListDeliverabilityTestReportsResponse) => void): Request<SESV2.Types.ListDeliverabilityTestReportsResponse, AWSError>;
  /**
   * Retrieve deliverability data for all the campaigns that used a specific domain to send email during a specified time range. This data is available for a domain only if you enabled the Deliverability dashboard for the domain.
   */
  listDomainDeliverabilityCampaigns(params: SESV2.Types.ListDomainDeliverabilityCampaignsRequest, callback?: (err: AWSError, data: SESV2.Types.ListDomainDeliverabilityCampaignsResponse) => void): Request<SESV2.Types.ListDomainDeliverabilityCampaignsResponse, AWSError>;
  /**
   * Retrieve deliverability data for all the campaigns that used a specific domain to send email during a specified time range. This data is available for a domain only if you enabled the Deliverability dashboard for the domain.
   */
  listDomainDeliverabilityCampaigns(callback?: (err: AWSError, data: SESV2.Types.ListDomainDeliverabilityCampaignsResponse) => void): Request<SESV2.Types.ListDomainDeliverabilityCampaignsResponse, AWSError>;
  /**
   * Returns a list of all of the email identities that are associated with your Amazon Web Services account. An identity can be either an email address or a domain. This operation returns identities that are verified as well as those that aren't. This operation returns identities that are associated with Amazon SES and Amazon Pinpoint.
   */
  listEmailIdentities(params: SESV2.Types.ListEmailIdentitiesRequest, callback?: (err: AWSError, data: SESV2.Types.ListEmailIdentitiesResponse) => void): Request<SESV2.Types.ListEmailIdentitiesResponse, AWSError>;
  /**
   * Returns a list of all of the email identities that are associated with your Amazon Web Services account. An identity can be either an email address or a domain. This operation returns identities that are verified as well as those that aren't. This operation returns identities that are associated with Amazon SES and Amazon Pinpoint.
   */
  listEmailIdentities(callback?: (err: AWSError, data: SESV2.Types.ListEmailIdentitiesResponse) => void): Request<SESV2.Types.ListEmailIdentitiesResponse, AWSError>;
  /**
   * Lists the email templates present in your Amazon SES account in the current Amazon Web Services Region. You can execute this operation no more than once per second.
   */
  listEmailTemplates(params: SESV2.Types.ListEmailTemplatesRequest, callback?: (err: AWSError, data: SESV2.Types.ListEmailTemplatesResponse) => void): Request<SESV2.Types.ListEmailTemplatesResponse, AWSError>;
  /**
   * Lists the email templates present in your Amazon SES account in the current Amazon Web Services Region. You can execute this operation no more than once per second.
   */
  listEmailTemplates(callback?: (err: AWSError, data: SESV2.Types.ListEmailTemplatesResponse) => void): Request<SESV2.Types.ListEmailTemplatesResponse, AWSError>;
  /**
   * Lists all of the export jobs.
   */
  listExportJobs(params: SESV2.Types.ListExportJobsRequest, callback?: (err: AWSError, data: SESV2.Types.ListExportJobsResponse) => void): Request<SESV2.Types.ListExportJobsResponse, AWSError>;
  /**
   * Lists all of the export jobs.
   */
  listExportJobs(callback?: (err: AWSError, data: SESV2.Types.ListExportJobsResponse) => void): Request<SESV2.Types.ListExportJobsResponse, AWSError>;
  /**
   * Lists all of the import jobs.
   */
  listImportJobs(params: SESV2.Types.ListImportJobsRequest, callback?: (err: AWSError, data: SESV2.Types.ListImportJobsResponse) => void): Request<SESV2.Types.ListImportJobsResponse, AWSError>;
  /**
   * Lists all of the import jobs.
   */
  listImportJobs(callback?: (err: AWSError, data: SESV2.Types.ListImportJobsResponse) => void): Request<SESV2.Types.ListImportJobsResponse, AWSError>;
  /**
   * Lists the recommendations present in your Amazon SES account in the current Amazon Web Services Region. You can execute this operation no more than once per second.
   */
  listRecommendations(params: SESV2.Types.ListRecommendationsRequest, callback?: (err: AWSError, data: SESV2.Types.ListRecommendationsResponse) => void): Request<SESV2.Types.ListRecommendationsResponse, AWSError>;
  /**
   * Lists the recommendations present in your Amazon SES account in the current Amazon Web Services Region. You can execute this operation no more than once per second.
   */
  listRecommendations(callback?: (err: AWSError, data: SESV2.Types.ListRecommendationsResponse) => void): Request<SESV2.Types.ListRecommendationsResponse, AWSError>;
  /**
   * Retrieves a list of email addresses that are on the suppression list for your account.
   */
  listSuppressedDestinations(params: SESV2.Types.ListSuppressedDestinationsRequest, callback?: (err: AWSError, data: SESV2.Types.ListSuppressedDestinationsResponse) => void): Request<SESV2.Types.ListSuppressedDestinationsResponse, AWSError>;
  /**
   * Retrieves a list of email addresses that are on the suppression list for your account.
   */
  listSuppressedDestinations(callback?: (err: AWSError, data: SESV2.Types.ListSuppressedDestinationsResponse) => void): Request<SESV2.Types.ListSuppressedDestinationsResponse, AWSError>;
  /**
   * Retrieve a list of the tags (keys and values) that are associated with a specified resource. A tag is a label that you optionally define and associate with a resource. Each tag consists of a required tag key and an optional associated tag value. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  listTagsForResource(params: SESV2.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: SESV2.Types.ListTagsForResourceResponse) => void): Request<SESV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieve a list of the tags (keys and values) that are associated with a specified resource. A tag is a label that you optionally define and associate with a resource. Each tag consists of a required tag key and an optional associated tag value. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  listTagsForResource(callback?: (err: AWSError, data: SESV2.Types.ListTagsForResourceResponse) => void): Request<SESV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Enable or disable the automatic warm-up feature for dedicated IP addresses.
   */
  putAccountDedicatedIpWarmupAttributes(params: SESV2.Types.PutAccountDedicatedIpWarmupAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutAccountDedicatedIpWarmupAttributesResponse) => void): Request<SESV2.Types.PutAccountDedicatedIpWarmupAttributesResponse, AWSError>;
  /**
   * Enable or disable the automatic warm-up feature for dedicated IP addresses.
   */
  putAccountDedicatedIpWarmupAttributes(callback?: (err: AWSError, data: SESV2.Types.PutAccountDedicatedIpWarmupAttributesResponse) => void): Request<SESV2.Types.PutAccountDedicatedIpWarmupAttributesResponse, AWSError>;
  /**
   * Update your Amazon SES account details.
   */
  putAccountDetails(params: SESV2.Types.PutAccountDetailsRequest, callback?: (err: AWSError, data: SESV2.Types.PutAccountDetailsResponse) => void): Request<SESV2.Types.PutAccountDetailsResponse, AWSError>;
  /**
   * Update your Amazon SES account details.
   */
  putAccountDetails(callback?: (err: AWSError, data: SESV2.Types.PutAccountDetailsResponse) => void): Request<SESV2.Types.PutAccountDetailsResponse, AWSError>;
  /**
   * Enable or disable the ability of your account to send email.
   */
  putAccountSendingAttributes(params: SESV2.Types.PutAccountSendingAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutAccountSendingAttributesResponse) => void): Request<SESV2.Types.PutAccountSendingAttributesResponse, AWSError>;
  /**
   * Enable or disable the ability of your account to send email.
   */
  putAccountSendingAttributes(callback?: (err: AWSError, data: SESV2.Types.PutAccountSendingAttributesResponse) => void): Request<SESV2.Types.PutAccountSendingAttributesResponse, AWSError>;
  /**
   * Change the settings for the account-level suppression list.
   */
  putAccountSuppressionAttributes(params: SESV2.Types.PutAccountSuppressionAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutAccountSuppressionAttributesResponse) => void): Request<SESV2.Types.PutAccountSuppressionAttributesResponse, AWSError>;
  /**
   * Change the settings for the account-level suppression list.
   */
  putAccountSuppressionAttributes(callback?: (err: AWSError, data: SESV2.Types.PutAccountSuppressionAttributesResponse) => void): Request<SESV2.Types.PutAccountSuppressionAttributesResponse, AWSError>;
  /**
   * Update your Amazon SES account VDM attributes. You can execute this operation no more than once per second.
   */
  putAccountVdmAttributes(params: SESV2.Types.PutAccountVdmAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutAccountVdmAttributesResponse) => void): Request<SESV2.Types.PutAccountVdmAttributesResponse, AWSError>;
  /**
   * Update your Amazon SES account VDM attributes. You can execute this operation no more than once per second.
   */
  putAccountVdmAttributes(callback?: (err: AWSError, data: SESV2.Types.PutAccountVdmAttributesResponse) => void): Request<SESV2.Types.PutAccountVdmAttributesResponse, AWSError>;
  /**
   * Associate a configuration set with a dedicated IP pool. You can use dedicated IP pools to create groups of dedicated IP addresses for sending specific types of email.
   */
  putConfigurationSetDeliveryOptions(params: SESV2.Types.PutConfigurationSetDeliveryOptionsRequest, callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetDeliveryOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetDeliveryOptionsResponse, AWSError>;
  /**
   * Associate a configuration set with a dedicated IP pool. You can use dedicated IP pools to create groups of dedicated IP addresses for sending specific types of email.
   */
  putConfigurationSetDeliveryOptions(callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetDeliveryOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetDeliveryOptionsResponse, AWSError>;
  /**
   * Enable or disable collection of reputation metrics for emails that you send using a particular configuration set in a specific Amazon Web Services Region.
   */
  putConfigurationSetReputationOptions(params: SESV2.Types.PutConfigurationSetReputationOptionsRequest, callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetReputationOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetReputationOptionsResponse, AWSError>;
  /**
   * Enable or disable collection of reputation metrics for emails that you send using a particular configuration set in a specific Amazon Web Services Region.
   */
  putConfigurationSetReputationOptions(callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetReputationOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetReputationOptionsResponse, AWSError>;
  /**
   * Enable or disable email sending for messages that use a particular configuration set in a specific Amazon Web Services Region.
   */
  putConfigurationSetSendingOptions(params: SESV2.Types.PutConfigurationSetSendingOptionsRequest, callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetSendingOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetSendingOptionsResponse, AWSError>;
  /**
   * Enable or disable email sending for messages that use a particular configuration set in a specific Amazon Web Services Region.
   */
  putConfigurationSetSendingOptions(callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetSendingOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetSendingOptionsResponse, AWSError>;
  /**
   * Specify the account suppression list preferences for a configuration set.
   */
  putConfigurationSetSuppressionOptions(params: SESV2.Types.PutConfigurationSetSuppressionOptionsRequest, callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetSuppressionOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetSuppressionOptionsResponse, AWSError>;
  /**
   * Specify the account suppression list preferences for a configuration set.
   */
  putConfigurationSetSuppressionOptions(callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetSuppressionOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetSuppressionOptionsResponse, AWSError>;
  /**
   * Specify a custom domain to use for open and click tracking elements in email that you send.
   */
  putConfigurationSetTrackingOptions(params: SESV2.Types.PutConfigurationSetTrackingOptionsRequest, callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetTrackingOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetTrackingOptionsResponse, AWSError>;
  /**
   * Specify a custom domain to use for open and click tracking elements in email that you send.
   */
  putConfigurationSetTrackingOptions(callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetTrackingOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetTrackingOptionsResponse, AWSError>;
  /**
   * Specify VDM preferences for email that you send using the configuration set. You can execute this operation no more than once per second.
   */
  putConfigurationSetVdmOptions(params: SESV2.Types.PutConfigurationSetVdmOptionsRequest, callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetVdmOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetVdmOptionsResponse, AWSError>;
  /**
   * Specify VDM preferences for email that you send using the configuration set. You can execute this operation no more than once per second.
   */
  putConfigurationSetVdmOptions(callback?: (err: AWSError, data: SESV2.Types.PutConfigurationSetVdmOptionsResponse) => void): Request<SESV2.Types.PutConfigurationSetVdmOptionsResponse, AWSError>;
  /**
   * Move a dedicated IP address to an existing dedicated IP pool.  The dedicated IP address that you specify must already exist, and must be associated with your Amazon Web Services account.  The dedicated IP pool you specify must already exist. You can create a new pool by using the CreateDedicatedIpPool operation. 
   */
  putDedicatedIpInPool(params: SESV2.Types.PutDedicatedIpInPoolRequest, callback?: (err: AWSError, data: SESV2.Types.PutDedicatedIpInPoolResponse) => void): Request<SESV2.Types.PutDedicatedIpInPoolResponse, AWSError>;
  /**
   * Move a dedicated IP address to an existing dedicated IP pool.  The dedicated IP address that you specify must already exist, and must be associated with your Amazon Web Services account.  The dedicated IP pool you specify must already exist. You can create a new pool by using the CreateDedicatedIpPool operation. 
   */
  putDedicatedIpInPool(callback?: (err: AWSError, data: SESV2.Types.PutDedicatedIpInPoolResponse) => void): Request<SESV2.Types.PutDedicatedIpInPoolResponse, AWSError>;
  /**
   * Used to convert a dedicated IP pool to a different scaling mode.   MANAGED pools cannot be converted to STANDARD scaling mode. 
   */
  putDedicatedIpPoolScalingAttributes(params: SESV2.Types.PutDedicatedIpPoolScalingAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutDedicatedIpPoolScalingAttributesResponse) => void): Request<SESV2.Types.PutDedicatedIpPoolScalingAttributesResponse, AWSError>;
  /**
   * Used to convert a dedicated IP pool to a different scaling mode.   MANAGED pools cannot be converted to STANDARD scaling mode. 
   */
  putDedicatedIpPoolScalingAttributes(callback?: (err: AWSError, data: SESV2.Types.PutDedicatedIpPoolScalingAttributesResponse) => void): Request<SESV2.Types.PutDedicatedIpPoolScalingAttributesResponse, AWSError>;
  /**
   * 
   */
  putDedicatedIpWarmupAttributes(params: SESV2.Types.PutDedicatedIpWarmupAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutDedicatedIpWarmupAttributesResponse) => void): Request<SESV2.Types.PutDedicatedIpWarmupAttributesResponse, AWSError>;
  /**
   * 
   */
  putDedicatedIpWarmupAttributes(callback?: (err: AWSError, data: SESV2.Types.PutDedicatedIpWarmupAttributesResponse) => void): Request<SESV2.Types.PutDedicatedIpWarmupAttributesResponse, AWSError>;
  /**
   * Enable or disable the Deliverability dashboard. When you enable the Deliverability dashboard, you gain access to reputation, deliverability, and other metrics for the domains that you use to send email. You also gain the ability to perform predictive inbox placement tests. When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition to any other fees that you accrue by using Amazon SES and other Amazon Web Services services. For more information about the features and cost of a Deliverability dashboard subscription, see Amazon SES Pricing.
   */
  putDeliverabilityDashboardOption(params: SESV2.Types.PutDeliverabilityDashboardOptionRequest, callback?: (err: AWSError, data: SESV2.Types.PutDeliverabilityDashboardOptionResponse) => void): Request<SESV2.Types.PutDeliverabilityDashboardOptionResponse, AWSError>;
  /**
   * Enable or disable the Deliverability dashboard. When you enable the Deliverability dashboard, you gain access to reputation, deliverability, and other metrics for the domains that you use to send email. You also gain the ability to perform predictive inbox placement tests. When you use the Deliverability dashboard, you pay a monthly subscription charge, in addition to any other fees that you accrue by using Amazon SES and other Amazon Web Services services. For more information about the features and cost of a Deliverability dashboard subscription, see Amazon SES Pricing.
   */
  putDeliverabilityDashboardOption(callback?: (err: AWSError, data: SESV2.Types.PutDeliverabilityDashboardOptionResponse) => void): Request<SESV2.Types.PutDeliverabilityDashboardOptionResponse, AWSError>;
  /**
   * Used to associate a configuration set with an email identity.
   */
  putEmailIdentityConfigurationSetAttributes(params: SESV2.Types.PutEmailIdentityConfigurationSetAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutEmailIdentityConfigurationSetAttributesResponse) => void): Request<SESV2.Types.PutEmailIdentityConfigurationSetAttributesResponse, AWSError>;
  /**
   * Used to associate a configuration set with an email identity.
   */
  putEmailIdentityConfigurationSetAttributes(callback?: (err: AWSError, data: SESV2.Types.PutEmailIdentityConfigurationSetAttributesResponse) => void): Request<SESV2.Types.PutEmailIdentityConfigurationSetAttributesResponse, AWSError>;
  /**
   * Used to enable or disable DKIM authentication for an email identity.
   */
  putEmailIdentityDkimAttributes(params: SESV2.Types.PutEmailIdentityDkimAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutEmailIdentityDkimAttributesResponse) => void): Request<SESV2.Types.PutEmailIdentityDkimAttributesResponse, AWSError>;
  /**
   * Used to enable or disable DKIM authentication for an email identity.
   */
  putEmailIdentityDkimAttributes(callback?: (err: AWSError, data: SESV2.Types.PutEmailIdentityDkimAttributesResponse) => void): Request<SESV2.Types.PutEmailIdentityDkimAttributesResponse, AWSError>;
  /**
   * Used to configure or change the DKIM authentication settings for an email domain identity. You can use this operation to do any of the following:   Update the signing attributes for an identity that uses Bring Your Own DKIM (BYODKIM).   Update the key length that should be used for Easy DKIM.   Change from using no DKIM authentication to using Easy DKIM.   Change from using no DKIM authentication to using BYODKIM.   Change from using Easy DKIM to using BYODKIM.   Change from using BYODKIM to using Easy DKIM.  
   */
  putEmailIdentityDkimSigningAttributes(params: SESV2.Types.PutEmailIdentityDkimSigningAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutEmailIdentityDkimSigningAttributesResponse) => void): Request<SESV2.Types.PutEmailIdentityDkimSigningAttributesResponse, AWSError>;
  /**
   * Used to configure or change the DKIM authentication settings for an email domain identity. You can use this operation to do any of the following:   Update the signing attributes for an identity that uses Bring Your Own DKIM (BYODKIM).   Update the key length that should be used for Easy DKIM.   Change from using no DKIM authentication to using Easy DKIM.   Change from using no DKIM authentication to using BYODKIM.   Change from using Easy DKIM to using BYODKIM.   Change from using BYODKIM to using Easy DKIM.  
   */
  putEmailIdentityDkimSigningAttributes(callback?: (err: AWSError, data: SESV2.Types.PutEmailIdentityDkimSigningAttributesResponse) => void): Request<SESV2.Types.PutEmailIdentityDkimSigningAttributesResponse, AWSError>;
  /**
   * Used to enable or disable feedback forwarding for an identity. This setting determines what happens when an identity is used to send an email that results in a bounce or complaint event. If the value is true, you receive email notifications when bounce or complaint events occur. These notifications are sent to the address that you specified in the Return-Path header of the original email. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications (for example, by setting up an event destination), you receive an email notification when these events occur (even if this setting is disabled).
   */
  putEmailIdentityFeedbackAttributes(params: SESV2.Types.PutEmailIdentityFeedbackAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutEmailIdentityFeedbackAttributesResponse) => void): Request<SESV2.Types.PutEmailIdentityFeedbackAttributesResponse, AWSError>;
  /**
   * Used to enable or disable feedback forwarding for an identity. This setting determines what happens when an identity is used to send an email that results in a bounce or complaint event. If the value is true, you receive email notifications when bounce or complaint events occur. These notifications are sent to the address that you specified in the Return-Path header of the original email. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications (for example, by setting up an event destination), you receive an email notification when these events occur (even if this setting is disabled).
   */
  putEmailIdentityFeedbackAttributes(callback?: (err: AWSError, data: SESV2.Types.PutEmailIdentityFeedbackAttributesResponse) => void): Request<SESV2.Types.PutEmailIdentityFeedbackAttributesResponse, AWSError>;
  /**
   * Used to enable or disable the custom Mail-From domain configuration for an email identity.
   */
  putEmailIdentityMailFromAttributes(params: SESV2.Types.PutEmailIdentityMailFromAttributesRequest, callback?: (err: AWSError, data: SESV2.Types.PutEmailIdentityMailFromAttributesResponse) => void): Request<SESV2.Types.PutEmailIdentityMailFromAttributesResponse, AWSError>;
  /**
   * Used to enable or disable the custom Mail-From domain configuration for an email identity.
   */
  putEmailIdentityMailFromAttributes(callback?: (err: AWSError, data: SESV2.Types.PutEmailIdentityMailFromAttributesResponse) => void): Request<SESV2.Types.PutEmailIdentityMailFromAttributesResponse, AWSError>;
  /**
   * Adds an email address to the suppression list for your account.
   */
  putSuppressedDestination(params: SESV2.Types.PutSuppressedDestinationRequest, callback?: (err: AWSError, data: SESV2.Types.PutSuppressedDestinationResponse) => void): Request<SESV2.Types.PutSuppressedDestinationResponse, AWSError>;
  /**
   * Adds an email address to the suppression list for your account.
   */
  putSuppressedDestination(callback?: (err: AWSError, data: SESV2.Types.PutSuppressedDestinationResponse) => void): Request<SESV2.Types.PutSuppressedDestinationResponse, AWSError>;
  /**
   * Composes an email message to multiple destinations.
   */
  sendBulkEmail(params: SESV2.Types.SendBulkEmailRequest, callback?: (err: AWSError, data: SESV2.Types.SendBulkEmailResponse) => void): Request<SESV2.Types.SendBulkEmailResponse, AWSError>;
  /**
   * Composes an email message to multiple destinations.
   */
  sendBulkEmail(callback?: (err: AWSError, data: SESV2.Types.SendBulkEmailResponse) => void): Request<SESV2.Types.SendBulkEmailResponse, AWSError>;
  /**
   * Adds an email address to the list of identities for your Amazon SES account in the current Amazon Web Services Region and attempts to verify it. As a result of executing this operation, a customized verification email is sent to the specified address. To use this operation, you must first create a custom verification email template. For more information about creating and using custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  sendCustomVerificationEmail(params: SESV2.Types.SendCustomVerificationEmailRequest, callback?: (err: AWSError, data: SESV2.Types.SendCustomVerificationEmailResponse) => void): Request<SESV2.Types.SendCustomVerificationEmailResponse, AWSError>;
  /**
   * Adds an email address to the list of identities for your Amazon SES account in the current Amazon Web Services Region and attempts to verify it. As a result of executing this operation, a customized verification email is sent to the specified address. To use this operation, you must first create a custom verification email template. For more information about creating and using custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  sendCustomVerificationEmail(callback?: (err: AWSError, data: SESV2.Types.SendCustomVerificationEmailResponse) => void): Request<SESV2.Types.SendCustomVerificationEmailResponse, AWSError>;
  /**
   * Sends an email message. You can use the Amazon SES API v2 to send the following types of messages:    Simple – A standard email message. When you create this type of message, you specify the sender, the recipient, and the message body, and Amazon SES assembles the message for you.    Raw – A raw, MIME-formatted email message. When you send this type of email, you have to specify all of the message headers, as well as the message body. You can use this message type to send messages that contain attachments. The message that you specify has to be a valid MIME message.    Templated – A message that contains personalization tags. When you send this type of email, Amazon SES API v2 automatically replaces the tags with values that you specify.  
   */
  sendEmail(params: SESV2.Types.SendEmailRequest, callback?: (err: AWSError, data: SESV2.Types.SendEmailResponse) => void): Request<SESV2.Types.SendEmailResponse, AWSError>;
  /**
   * Sends an email message. You can use the Amazon SES API v2 to send the following types of messages:    Simple – A standard email message. When you create this type of message, you specify the sender, the recipient, and the message body, and Amazon SES assembles the message for you.    Raw – A raw, MIME-formatted email message. When you send this type of email, you have to specify all of the message headers, as well as the message body. You can use this message type to send messages that contain attachments. The message that you specify has to be a valid MIME message.    Templated – A message that contains personalization tags. When you send this type of email, Amazon SES API v2 automatically replaces the tags with values that you specify.  
   */
  sendEmail(callback?: (err: AWSError, data: SESV2.Types.SendEmailResponse) => void): Request<SESV2.Types.SendEmailResponse, AWSError>;
  /**
   * Add one or more tags (keys and values) to a specified resource. A tag is a label that you optionally define and associate with a resource. Tags can help you categorize and manage resources in different ways, such as by purpose, owner, environment, or other criteria. A resource can have as many as 50 tags. Each tag consists of a required tag key and an associated tag value, both of which you define. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  tagResource(params: SESV2.Types.TagResourceRequest, callback?: (err: AWSError, data: SESV2.Types.TagResourceResponse) => void): Request<SESV2.Types.TagResourceResponse, AWSError>;
  /**
   * Add one or more tags (keys and values) to a specified resource. A tag is a label that you optionally define and associate with a resource. Tags can help you categorize and manage resources in different ways, such as by purpose, owner, environment, or other criteria. A resource can have as many as 50 tags. Each tag consists of a required tag key and an associated tag value, both of which you define. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  tagResource(callback?: (err: AWSError, data: SESV2.Types.TagResourceResponse) => void): Request<SESV2.Types.TagResourceResponse, AWSError>;
  /**
   * Creates a preview of the MIME content of an email when provided with a template and a set of replacement data. You can execute this operation no more than once per second.
   */
  testRenderEmailTemplate(params: SESV2.Types.TestRenderEmailTemplateRequest, callback?: (err: AWSError, data: SESV2.Types.TestRenderEmailTemplateResponse) => void): Request<SESV2.Types.TestRenderEmailTemplateResponse, AWSError>;
  /**
   * Creates a preview of the MIME content of an email when provided with a template and a set of replacement data. You can execute this operation no more than once per second.
   */
  testRenderEmailTemplate(callback?: (err: AWSError, data: SESV2.Types.TestRenderEmailTemplateResponse) => void): Request<SESV2.Types.TestRenderEmailTemplateResponse, AWSError>;
  /**
   * Remove one or more tags (keys and values) from a specified resource.
   */
  untagResource(params: SESV2.Types.UntagResourceRequest, callback?: (err: AWSError, data: SESV2.Types.UntagResourceResponse) => void): Request<SESV2.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove one or more tags (keys and values) from a specified resource.
   */
  untagResource(callback?: (err: AWSError, data: SESV2.Types.UntagResourceResponse) => void): Request<SESV2.Types.UntagResourceResponse, AWSError>;
  /**
   * Update the configuration of an event destination for a configuration set.  Events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  updateConfigurationSetEventDestination(params: SESV2.Types.UpdateConfigurationSetEventDestinationRequest, callback?: (err: AWSError, data: SESV2.Types.UpdateConfigurationSetEventDestinationResponse) => void): Request<SESV2.Types.UpdateConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Update the configuration of an event destination for a configuration set.  Events include message sends, deliveries, opens, clicks, bounces, and complaints. Event destinations are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   */
  updateConfigurationSetEventDestination(callback?: (err: AWSError, data: SESV2.Types.UpdateConfigurationSetEventDestinationResponse) => void): Request<SESV2.Types.UpdateConfigurationSetEventDestinationResponse, AWSError>;
  /**
   * Updates a contact's preferences for a list. It is not necessary to specify all existing topic preferences in the TopicPreferences object, just the ones that need updating.
   */
  updateContact(params: SESV2.Types.UpdateContactRequest, callback?: (err: AWSError, data: SESV2.Types.UpdateContactResponse) => void): Request<SESV2.Types.UpdateContactResponse, AWSError>;
  /**
   * Updates a contact's preferences for a list. It is not necessary to specify all existing topic preferences in the TopicPreferences object, just the ones that need updating.
   */
  updateContact(callback?: (err: AWSError, data: SESV2.Types.UpdateContactResponse) => void): Request<SESV2.Types.UpdateContactResponse, AWSError>;
  /**
   * Updates contact list metadata. This operation does a complete replacement.
   */
  updateContactList(params: SESV2.Types.UpdateContactListRequest, callback?: (err: AWSError, data: SESV2.Types.UpdateContactListResponse) => void): Request<SESV2.Types.UpdateContactListResponse, AWSError>;
  /**
   * Updates contact list metadata. This operation does a complete replacement.
   */
  updateContactList(callback?: (err: AWSError, data: SESV2.Types.UpdateContactListResponse) => void): Request<SESV2.Types.UpdateContactListResponse, AWSError>;
  /**
   * Updates an existing custom verification email template. For more information about custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  updateCustomVerificationEmailTemplate(params: SESV2.Types.UpdateCustomVerificationEmailTemplateRequest, callback?: (err: AWSError, data: SESV2.Types.UpdateCustomVerificationEmailTemplateResponse) => void): Request<SESV2.Types.UpdateCustomVerificationEmailTemplateResponse, AWSError>;
  /**
   * Updates an existing custom verification email template. For more information about custom verification email templates, see Using custom verification email templates in the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  updateCustomVerificationEmailTemplate(callback?: (err: AWSError, data: SESV2.Types.UpdateCustomVerificationEmailTemplateResponse) => void): Request<SESV2.Types.UpdateCustomVerificationEmailTemplateResponse, AWSError>;
  /**
   * Updates the specified sending authorization policy for the given identity (an email address or a domain). This API returns successfully even if a policy with the specified name does not exist.  This API is for the identity owner only. If you have not verified the identity, this API will return an error.  Sending authorization is a feature that enables an identity owner to authorize other senders to use its identities. For information about using sending authorization, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  updateEmailIdentityPolicy(params: SESV2.Types.UpdateEmailIdentityPolicyRequest, callback?: (err: AWSError, data: SESV2.Types.UpdateEmailIdentityPolicyResponse) => void): Request<SESV2.Types.UpdateEmailIdentityPolicyResponse, AWSError>;
  /**
   * Updates the specified sending authorization policy for the given identity (an email address or a domain). This API returns successfully even if a policy with the specified name does not exist.  This API is for the identity owner only. If you have not verified the identity, this API will return an error.  Sending authorization is a feature that enables an identity owner to authorize other senders to use its identities. For information about using sending authorization, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  updateEmailIdentityPolicy(callback?: (err: AWSError, data: SESV2.Types.UpdateEmailIdentityPolicyResponse) => void): Request<SESV2.Types.UpdateEmailIdentityPolicyResponse, AWSError>;
  /**
   * Updates an email template. Email templates enable you to send personalized email to one or more destinations in a single API operation. For more information, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  updateEmailTemplate(params: SESV2.Types.UpdateEmailTemplateRequest, callback?: (err: AWSError, data: SESV2.Types.UpdateEmailTemplateResponse) => void): Request<SESV2.Types.UpdateEmailTemplateResponse, AWSError>;
  /**
   * Updates an email template. Email templates enable you to send personalized email to one or more destinations in a single API operation. For more information, see the Amazon SES Developer Guide. You can execute this operation no more than once per second.
   */
  updateEmailTemplate(callback?: (err: AWSError, data: SESV2.Types.UpdateEmailTemplateResponse) => void): Request<SESV2.Types.UpdateEmailTemplateResponse, AWSError>;
}
declare namespace SESV2 {
  export interface AccountDetails {
    /**
     * The type of email your account is sending. The mail type can be one of the following:    MARKETING – Most of your sending traffic is to keep your customers informed of your latest offering.    TRANSACTIONAL – Most of your sending traffic is to communicate during a transaction with a customer.  
     */
    MailType?: MailType;
    /**
     * The URL of your website. This information helps us better understand the type of content that you plan to send.
     */
    WebsiteURL?: WebsiteURL;
    /**
     * The language you would prefer for the case. The contact language can be one of ENGLISH or JAPANESE.
     */
    ContactLanguage?: ContactLanguage;
    /**
     * A description of the types of email that you plan to send.
     */
    UseCaseDescription?: UseCaseDescription;
    /**
     * Additional email addresses where updates are sent about your account review process.
     */
    AdditionalContactEmailAddresses?: AdditionalContactEmailAddresses;
    /**
     * Information about the review of the latest details you submitted.
     */
    ReviewDetails?: ReviewDetails;
  }
  export type AdditionalContactEmailAddress = string;
  export type AdditionalContactEmailAddresses = AdditionalContactEmailAddress[];
  export type AmazonResourceName = string;
  export type AttributesData = string;
  export type BatchGetMetricDataQueries = BatchGetMetricDataQuery[];
  export interface BatchGetMetricDataQuery {
    /**
     * The query identifier.
     */
    Id: QueryIdentifier;
    /**
     * The query namespace - e.g. VDM 
     */
    Namespace: MetricNamespace;
    /**
     * The queried metric. This can be one of the following:    SEND – Emails sent eligible for tracking in the VDM dashboard. This excludes emails sent to the mailbox simulator and emails addressed to more than one recipient.    COMPLAINT – Complaints received for your account. This excludes complaints from the mailbox simulator, those originating from your account-level suppression list (if enabled), and those for emails addressed to more than one recipient    PERMANENT_BOUNCE – Permanent bounces - i.e. feedback received for emails sent to non-existent mailboxes. Excludes bounces from the mailbox simulator, those originating from your account-level suppression list (if enabled), and those for emails addressed to more than one recipient.    TRANSIENT_BOUNCE – Transient bounces - i.e. feedback received for delivery failures excluding issues with non-existent mailboxes. Excludes bounces from the mailbox simulator, and those for emails addressed to more than one recipient.    OPEN – Unique open events for emails including open trackers. Excludes opens for emails addressed to more than one recipient.    CLICK – Unique click events for emails including wrapped links. Excludes clicks for emails addressed to more than one recipient.    DELIVERY – Successful deliveries for email sending attempts. Excludes deliveries to the mailbox simulator and for emails addressed to more than one recipient.    DELIVERY_OPEN – Successful deliveries for email sending attempts. Excludes deliveries to the mailbox simulator, for emails addressed to more than one recipient, and emails without open trackers.    DELIVERY_CLICK – Successful deliveries for email sending attempts. Excludes deliveries to the mailbox simulator, for emails addressed to more than one recipient, and emails without click trackers.    DELIVERY_COMPLAINT – Successful deliveries for email sending attempts. Excludes deliveries to the mailbox simulator, for emails addressed to more than one recipient, and emails addressed to recipients hosted by ISPs with which Amazon SES does not have a feedback loop agreement.  
     */
    Metric: Metric;
    /**
     * An object that contains mapping between MetricDimensionName and MetricDimensionValue to filter metrics by.
     */
    Dimensions?: Dimensions;
    /**
     * Represents the start date for the query interval.
     */
    StartDate: Timestamp;
    /**
     * Represents the end date for the query interval.
     */
    EndDate: Timestamp;
  }
  export interface BatchGetMetricDataRequest {
    /**
     * A list of queries for metrics to be retrieved.
     */
    Queries: BatchGetMetricDataQueries;
  }
  export interface BatchGetMetricDataResponse {
    /**
     * A list of successfully retrieved MetricDataResult.
     */
    Results?: MetricDataResultList;
    /**
     * A list of MetricDataError encountered while processing your metric data batch request.
     */
    Errors?: MetricDataErrorList;
  }
  export type BehaviorOnMxFailure = "USE_DEFAULT_VALUE"|"REJECT_MESSAGE"|string;
  export type BlacklistEntries = BlacklistEntry[];
  export interface BlacklistEntry {
    /**
     * The name of the blacklist that the IP address appears on.
     */
    RblName?: RblName;
    /**
     * The time when the blacklisting event occurred.
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
  export interface Bounce {
    /**
     * The type of the bounce, as determined by SES. Can be one of UNDETERMINED, TRANSIENT, or PERMANENT 
     */
    BounceType?: BounceType;
    /**
     * The subtype of the bounce, as determined by SES.
     */
    BounceSubType?: BounceSubType;
    /**
     * The status code issued by the reporting Message Transfer Authority (MTA). This field only appears if a delivery status notification (DSN) was attached to the bounce and the Diagnostic-Code was provided in the DSN. 
     */
    DiagnosticCode?: DiagnosticCode;
  }
  export type BounceSubType = string;
  export type BounceType = "UNDETERMINED"|"TRANSIENT"|"PERMANENT"|string;
  export interface BulkEmailContent {
    /**
     * The template to use for the bulk email message.
     */
    Template?: Template;
  }
  export interface BulkEmailEntry {
    /**
     * Represents the destination of the message, consisting of To:, CC:, and BCC: fields.  Amazon SES does not support the SMTPUTF8 extension, as described in RFC6531. For this reason, the local part of a destination email address (the part of the email address that precedes the @ sign) may only contain 7-bit ASCII characters. If the domain part of an address (the part after the @ sign) contains non-ASCII characters, they must be encoded using Punycode, as described in RFC3492. 
     */
    Destination: Destination;
    /**
     * A list of tags, in the form of name/value pairs, to apply to an email that you send using the SendBulkTemplatedEmail operation. Tags correspond to characteristics of the email that you define, so that you can publish email sending events.
     */
    ReplacementTags?: MessageTagList;
    /**
     * The ReplacementEmailContent associated with a BulkEmailEntry.
     */
    ReplacementEmailContent?: ReplacementEmailContent;
  }
  export type BulkEmailEntryList = BulkEmailEntry[];
  export interface BulkEmailEntryResult {
    /**
     * The status of a message sent using the SendBulkTemplatedEmail operation. Possible values for this parameter include:   SUCCESS: Amazon SES accepted the message, and will attempt to deliver it to the recipients.   MESSAGE_REJECTED: The message was rejected because it contained a virus.   MAIL_FROM_DOMAIN_NOT_VERIFIED: The sender's email address or domain was not verified.   CONFIGURATION_SET_DOES_NOT_EXIST: The configuration set you specified does not exist.   TEMPLATE_DOES_NOT_EXIST: The template you specified does not exist.   ACCOUNT_SUSPENDED: Your account has been shut down because of issues related to your email sending practices.   ACCOUNT_THROTTLED: The number of emails you can send has been reduced because your account has exceeded its allocated sending limit.   ACCOUNT_DAILY_QUOTA_EXCEEDED: You have reached or exceeded the maximum number of emails you can send from your account in a 24-hour period.   INVALID_SENDING_POOL_NAME: The configuration set you specified refers to an IP pool that does not exist.   ACCOUNT_SENDING_PAUSED: Email sending for the Amazon SES account was disabled using the UpdateAccountSendingEnabled operation.   CONFIGURATION_SET_SENDING_PAUSED: Email sending for this configuration set was disabled using the UpdateConfigurationSetSendingEnabled operation.   INVALID_PARAMETER_VALUE: One or more of the parameters you specified when calling this operation was invalid. See the error message for additional information.   TRANSIENT_FAILURE: Amazon SES was unable to process your request because of a temporary issue.   FAILED: Amazon SES was unable to process your request. See the error message for additional information.  
     */
    Status?: BulkEmailStatus;
    /**
     * A description of an error that prevented a message being sent using the SendBulkTemplatedEmail operation.
     */
    Error?: ErrorMessage;
    /**
     * The unique message identifier returned from the SendBulkTemplatedEmail operation.
     */
    MessageId?: OutboundMessageId;
  }
  export type BulkEmailEntryResultList = BulkEmailEntryResult[];
  export type BulkEmailStatus = "SUCCESS"|"MESSAGE_REJECTED"|"MAIL_FROM_DOMAIN_NOT_VERIFIED"|"CONFIGURATION_SET_NOT_FOUND"|"TEMPLATE_NOT_FOUND"|"ACCOUNT_SUSPENDED"|"ACCOUNT_THROTTLED"|"ACCOUNT_DAILY_QUOTA_EXCEEDED"|"INVALID_SENDING_POOL_NAME"|"ACCOUNT_SENDING_PAUSED"|"CONFIGURATION_SET_SENDING_PAUSED"|"INVALID_PARAMETER"|"TRANSIENT_FAILURE"|"FAILED"|string;
  export type CampaignId = string;
  export interface CancelExportJobRequest {
    /**
     * The export job ID.
     */
    JobId: JobId;
  }
  export interface CancelExportJobResponse {
  }
  export type CaseId = string;
  export type Charset = string;
  export interface CloudWatchDestination {
    /**
     * An array of objects that define the dimensions to use when you send email events to Amazon CloudWatch.
     */
    DimensionConfigurations: CloudWatchDimensionConfigurations;
  }
  export interface CloudWatchDimensionConfiguration {
    /**
     * The name of an Amazon CloudWatch dimension associated with an email sending metric. The name has to meet the following criteria:   It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-).   It can contain no more than 256 characters.  
     */
    DimensionName: DimensionName;
    /**
     * The location where the Amazon SES API v2 finds the value of a dimension to publish to Amazon CloudWatch. To use the message tags that you specify using an X-SES-MESSAGE-TAGS header or a parameter to the SendEmail or SendRawEmail API, choose messageTag. To use your own email headers, choose emailHeader. To use link tags, choose linkTags.
     */
    DimensionValueSource: DimensionValueSource;
    /**
     * The default value of the dimension that is published to Amazon CloudWatch if you don't provide the value of the dimension when you send an email. This value has to meet the following criteria:   Can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-), at signs (@), and periods (.).   It can contain no more than 256 characters.  
     */
    DefaultDimensionValue: DefaultDimensionValue;
  }
  export type CloudWatchDimensionConfigurations = CloudWatchDimensionConfiguration[];
  export interface Complaint {
    /**
     *  Can either be null or OnAccountSuppressionList. If the value is OnAccountSuppressionList, SES accepted the message, but didn't attempt to send it because it was on the account-level suppression list. 
     */
    ComplaintSubType?: ComplaintSubType;
    /**
     *  The value of the Feedback-Type field from the feedback report received from the ISP. 
     */
    ComplaintFeedbackType?: ComplaintFeedbackType;
  }
  export type ComplaintFeedbackType = string;
  export type ComplaintSubType = string;
  export type ConfigurationSetName = string;
  export type ConfigurationSetNameList = ConfigurationSetName[];
  export interface Contact {
    /**
     * The contact's email address.
     */
    EmailAddress?: EmailAddress;
    /**
     * The contact's preference for being opted-in to or opted-out of a topic.
     */
    TopicPreferences?: TopicPreferenceList;
    /**
     * The default topic preferences applied to the contact.
     */
    TopicDefaultPreferences?: TopicPreferenceList;
    /**
     * A boolean value status noting if the contact is unsubscribed from all contact list topics.
     */
    UnsubscribeAll?: UnsubscribeAll;
    /**
     * A timestamp noting the last time the contact's information was updated.
     */
    LastUpdatedTimestamp?: Timestamp;
  }
  export type ContactLanguage = "EN"|"JA"|string;
  export interface ContactList {
    /**
     * The name of the contact list.
     */
    ContactListName?: ContactListName;
    /**
     * A timestamp noting the last time the contact list was updated.
     */
    LastUpdatedTimestamp?: Timestamp;
  }
  export interface ContactListDestination {
    /**
     * The name of the contact list.
     */
    ContactListName: ContactListName;
    /**
     * &gt;The type of action to perform on the addresses. The following are the possible values:   PUT: add the addresses to the contact list. If the record already exists, it will override it with the new value.   DELETE: remove the addresses from the contact list.  
     */
    ContactListImportAction: ContactListImportAction;
  }
  export type ContactListImportAction = "DELETE"|"PUT"|string;
  export type ContactListName = string;
  export interface Content {
    /**
     * The content of the message itself.
     */
    Data: MessageData;
    /**
     * The character set for the content. Because of the constraints of the SMTP protocol, Amazon SES uses 7-bit ASCII by default. If the text includes characters outside of the ASCII range, you have to specify a character set. For example, you could specify UTF-8, ISO-8859-1, or Shift_JIS.
     */
    Charset?: Charset;
  }
  export type Counter = number;
  export interface CreateConfigurationSetEventDestinationRequest {
    /**
     * The name of the configuration set .
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
     * The name of the configuration set. The name can contain up to 64 alphanumeric characters, including letters, numbers, hyphens (-) and underscores (_) only.
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
     * An object that defines whether or not Amazon SES collects reputation metrics for the emails that you send that use the configuration set.
     */
    ReputationOptions?: ReputationOptions;
    /**
     * An object that defines whether or not Amazon SES can send email that you send using the configuration set.
     */
    SendingOptions?: SendingOptions;
    /**
     * An array of objects that define the tags (keys and values) to associate with the configuration set.
     */
    Tags?: TagList;
    SuppressionOptions?: SuppressionOptions;
    /**
     * An object that defines the VDM options for emails that you send using the configuration set.
     */
    VdmOptions?: VdmOptions;
  }
  export interface CreateConfigurationSetResponse {
  }
  export interface CreateContactListRequest {
    /**
     * The name of the contact list.
     */
    ContactListName: ContactListName;
    /**
     * An interest group, theme, or label within a list. A contact list can have multiple topics.
     */
    Topics?: Topics;
    /**
     * A description of what the contact list is about.
     */
    Description?: Description;
    /**
     * The tags associated with a contact list.
     */
    Tags?: TagList;
  }
  export interface CreateContactListResponse {
  }
  export interface CreateContactRequest {
    /**
     * The name of the contact list to which the contact should be added.
     */
    ContactListName: ContactListName;
    /**
     * The contact's email address.
     */
    EmailAddress: EmailAddress;
    /**
     * The contact's preferences for being opted-in to or opted-out of topics.
     */
    TopicPreferences?: TopicPreferenceList;
    /**
     * A boolean value status noting if the contact is unsubscribed from all contact list topics.
     */
    UnsubscribeAll?: UnsubscribeAll;
    /**
     * The attribute data attached to a contact.
     */
    AttributesData?: AttributesData;
  }
  export interface CreateContactResponse {
  }
  export interface CreateCustomVerificationEmailTemplateRequest {
    /**
     * The name of the custom verification email template.
     */
    TemplateName: EmailTemplateName;
    /**
     * The email address that the custom verification email is sent from.
     */
    FromEmailAddress: EmailAddress;
    /**
     * The subject line of the custom verification email.
     */
    TemplateSubject: EmailTemplateSubject;
    /**
     * The content of the custom verification email. The total size of the email must be less than 10 MB. The message body may contain HTML, with some limitations. For more information, see Custom verification email frequently asked questions in the Amazon SES Developer Guide.
     */
    TemplateContent: TemplateContent;
    /**
     * The URL that the recipient of the verification email is sent to if his or her address is successfully verified.
     */
    SuccessRedirectionURL: SuccessRedirectionURL;
    /**
     * The URL that the recipient of the verification email is sent to if his or her address is not successfully verified.
     */
    FailureRedirectionURL: FailureRedirectionURL;
  }
  export interface CreateCustomVerificationEmailTemplateResponse {
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
    /**
     * The type of scaling mode.
     */
    ScalingMode?: ScalingMode;
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
  export interface CreateEmailIdentityPolicyRequest {
    /**
     * The email identity.
     */
    EmailIdentity: Identity;
    /**
     * The name of the policy. The policy name cannot exceed 64 characters and can only include alphanumeric characters, dashes, and underscores.
     */
    PolicyName: PolicyName;
    /**
     * The text of the policy in JSON format. The policy cannot exceed 4 KB. For information about the syntax of sending authorization policies, see the Amazon SES Developer Guide.
     */
    Policy: Policy;
  }
  export interface CreateEmailIdentityPolicyResponse {
  }
  export interface CreateEmailIdentityRequest {
    /**
     * The email address or domain to verify.
     */
    EmailIdentity: Identity;
    /**
     * An array of objects that define the tags (keys and values) to associate with the email identity.
     */
    Tags?: TagList;
    /**
     * If your request includes this object, Amazon SES configures the identity to use Bring Your Own DKIM (BYODKIM) for DKIM authentication purposes, or, configures the key length to be used for Easy DKIM. You can only specify this object if the email identity is a domain, as opposed to an address.
     */
    DkimSigningAttributes?: DkimSigningAttributes;
    /**
     * The configuration set to use by default when sending from this identity. Note that any configuration set defined in the email sending request takes precedence. 
     */
    ConfigurationSetName?: ConfigurationSetName;
  }
  export interface CreateEmailIdentityResponse {
    /**
     * The email identity type. Note: the MANAGED_DOMAIN identity type is not supported.
     */
    IdentityType?: IdentityType;
    /**
     * Specifies whether or not the identity is verified. You can only send email from verified email addresses or domains. For more information about verifying identities, see the Amazon Pinpoint User Guide.
     */
    VerifiedForSendingStatus?: Enabled;
    /**
     * An object that contains information about the DKIM attributes for the identity.
     */
    DkimAttributes?: DkimAttributes;
  }
  export interface CreateEmailTemplateRequest {
    /**
     * The name of the template.
     */
    TemplateName: EmailTemplateName;
    /**
     * The content of the email template, composed of a subject line, an HTML part, and a text-only part.
     */
    TemplateContent: EmailTemplateContent;
  }
  export interface CreateEmailTemplateResponse {
  }
  export interface CreateExportJobRequest {
    /**
     * The data source for the export job.
     */
    ExportDataSource: ExportDataSource;
    /**
     * The destination for the export job.
     */
    ExportDestination: ExportDestination;
  }
  export interface CreateExportJobResponse {
    /**
     * A string that represents the export job ID.
     */
    JobId?: JobId;
  }
  export interface CreateImportJobRequest {
    /**
     * The destination for the import job.
     */
    ImportDestination: ImportDestination;
    /**
     * The data source for the import job.
     */
    ImportDataSource: ImportDataSource;
  }
  export interface CreateImportJobResponse {
    /**
     * A string that represents the import job ID.
     */
    JobId?: JobId;
  }
  export type CustomRedirectDomain = string;
  export interface CustomVerificationEmailTemplateMetadata {
    /**
     * The name of the custom verification email template.
     */
    TemplateName?: EmailTemplateName;
    /**
     * The email address that the custom verification email is sent from.
     */
    FromEmailAddress?: EmailAddress;
    /**
     * The subject line of the custom verification email.
     */
    TemplateSubject?: EmailTemplateSubject;
    /**
     * The URL that the recipient of the verification email is sent to if his or her address is successfully verified.
     */
    SuccessRedirectionURL?: SuccessRedirectionURL;
    /**
     * The URL that the recipient of the verification email is sent to if his or her address is not successfully verified.
     */
    FailureRedirectionURL?: FailureRedirectionURL;
  }
  export type CustomVerificationEmailTemplatesList = CustomVerificationEmailTemplateMetadata[];
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
  export interface DashboardAttributes {
    /**
     * Specifies the status of your VDM engagement metrics collection. Can be one of the following:    ENABLED – Amazon SES enables engagement metrics for your account.    DISABLED – Amazon SES disables engagement metrics for your account.  
     */
    EngagementMetrics?: FeatureStatus;
  }
  export interface DashboardOptions {
    /**
     * Specifies the status of your VDM engagement metrics collection. Can be one of the following:    ENABLED – Amazon SES enables engagement metrics for the configuration set.    DISABLED – Amazon SES disables engagement metrics for the configuration set.  
     */
    EngagementMetrics?: FeatureStatus;
  }
  export type DataFormat = "CSV"|"JSON"|string;
  export interface DedicatedIp {
    /**
     * An IPv4 address.
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
  export interface DedicatedIpPool {
    /**
     * The name of the dedicated IP pool.
     */
    PoolName: PoolName;
    /**
     * The type of the dedicated IP pool.    STANDARD – A dedicated IP pool where you can control which IPs are part of the pool.    MANAGED – A dedicated IP pool where the reputation and number of IPs are automatically managed by Amazon SES.  
     */
    ScalingMode: ScalingMode;
  }
  export type DefaultDimensionValue = string;
  export interface DeleteConfigurationSetEventDestinationRequest {
    /**
     * The name of the configuration set that contains the event destination to delete.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * The name of the event destination to delete.
     */
    EventDestinationName: EventDestinationName;
  }
  export interface DeleteConfigurationSetEventDestinationResponse {
  }
  export interface DeleteConfigurationSetRequest {
    /**
     * The name of the configuration set.
     */
    ConfigurationSetName: ConfigurationSetName;
  }
  export interface DeleteConfigurationSetResponse {
  }
  export interface DeleteContactListRequest {
    /**
     * The name of the contact list.
     */
    ContactListName: ContactListName;
  }
  export interface DeleteContactListResponse {
  }
  export interface DeleteContactRequest {
    /**
     * The name of the contact list from which the contact should be removed.
     */
    ContactListName: ContactListName;
    /**
     * The contact's email address.
     */
    EmailAddress: EmailAddress;
  }
  export interface DeleteContactResponse {
  }
  export interface DeleteCustomVerificationEmailTemplateRequest {
    /**
     * The name of the custom verification email template that you want to delete.
     */
    TemplateName: EmailTemplateName;
  }
  export interface DeleteCustomVerificationEmailTemplateResponse {
  }
  export interface DeleteDedicatedIpPoolRequest {
    /**
     * The name of the dedicated IP pool that you want to delete.
     */
    PoolName: PoolName;
  }
  export interface DeleteDedicatedIpPoolResponse {
  }
  export interface DeleteEmailIdentityPolicyRequest {
    /**
     * The email identity.
     */
    EmailIdentity: Identity;
    /**
     * The name of the policy. The policy name cannot exceed 64 characters and can only include alphanumeric characters, dashes, and underscores.
     */
    PolicyName: PolicyName;
  }
  export interface DeleteEmailIdentityPolicyResponse {
  }
  export interface DeleteEmailIdentityRequest {
    /**
     * The identity (that is, the email address or domain) to delete.
     */
    EmailIdentity: Identity;
  }
  export interface DeleteEmailIdentityResponse {
  }
  export interface DeleteEmailTemplateRequest {
    /**
     * The name of the template to be deleted.
     */
    TemplateName: EmailTemplateName;
  }
  export interface DeleteEmailTemplateResponse {
  }
  export interface DeleteSuppressedDestinationRequest {
    /**
     * The suppressed email destination to remove from the account suppression list.
     */
    EmailAddress: EmailAddress;
  }
  export interface DeleteSuppressedDestinationResponse {
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
     * The date and time when the predictive inbox placement test was created.
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
  export type DeliveryEventType = "SEND"|"DELIVERY"|"TRANSIENT_BOUNCE"|"PERMANENT_BOUNCE"|"UNDETERMINED_BOUNCE"|"COMPLAINT"|string;
  export interface DeliveryOptions {
    /**
     * Specifies whether messages that use the configuration set are required to use Transport Layer Security (TLS). If the value is Require, messages are only delivered if a TLS connection can be established. If the value is Optional, messages can be delivered in plain text if a TLS connection can't be established.
     */
    TlsPolicy?: TlsPolicy;
    /**
     * The name of the dedicated IP pool to associate with the configuration set.
     */
    SendingPoolName?: PoolName;
  }
  export type Description = string;
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
  export type DiagnosticCode = string;
  export type DimensionName = string;
  export type DimensionValueSource = "MESSAGE_TAG"|"EMAIL_HEADER"|"LINK_TAG"|string;
  export type Dimensions = {[key: string]: MetricDimensionValue};
  export type DisplayName = string;
  export interface DkimAttributes {
    /**
     * If the value is true, then the messages that you send from the identity are signed using DKIM. If the value is false, then the messages that you send from the identity aren't DKIM-signed.
     */
    SigningEnabled?: Enabled;
    /**
     * Describes whether or not Amazon SES has successfully located the DKIM records in the DNS records for the domain. The status can be one of the following:    PENDING – The verification process was initiated, but Amazon SES hasn't yet detected the DKIM records in the DNS configuration for the domain.    SUCCESS – The verification process completed successfully.    FAILED – The verification process failed. This typically occurs when Amazon SES fails to find the DKIM records in the DNS configuration of the domain.    TEMPORARY_FAILURE – A temporary issue is preventing Amazon SES from determining the DKIM authentication status of the domain.    NOT_STARTED – The DKIM verification process hasn't been initiated for the domain.  
     */
    Status?: DkimStatus;
    /**
     * If you used Easy DKIM to configure DKIM authentication for the domain, then this object contains a set of unique strings that you use to create a set of CNAME records that you add to the DNS configuration for your domain. When Amazon SES detects these records in the DNS configuration for your domain, the DKIM authentication process is complete. If you configured DKIM authentication for the domain by providing your own public-private key pair, then this object contains the selector for the public key. Regardless of the DKIM authentication method you use, Amazon SES searches for the appropriate records in the DNS configuration of the domain for up to 72 hours.
     */
    Tokens?: DnsTokenList;
    /**
     * A string that indicates how DKIM was configured for the identity. These are the possible values:    AWS_SES – Indicates that DKIM was configured for the identity by using Easy DKIM.    EXTERNAL – Indicates that DKIM was configured for the identity by using Bring Your Own DKIM (BYODKIM).  
     */
    SigningAttributesOrigin?: DkimSigningAttributesOrigin;
    /**
     * [Easy DKIM] The key length of the future DKIM key pair to be generated. This can be changed at most once per day.
     */
    NextSigningKeyLength?: DkimSigningKeyLength;
    /**
     * [Easy DKIM] The key length of the DKIM key pair in use.
     */
    CurrentSigningKeyLength?: DkimSigningKeyLength;
    /**
     * [Easy DKIM] The last time a key pair was generated for this identity.
     */
    LastKeyGenerationTimestamp?: Timestamp;
  }
  export interface DkimSigningAttributes {
    /**
     * [Bring Your Own DKIM] A string that's used to identify a public key in the DNS configuration for a domain.
     */
    DomainSigningSelector?: Selector;
    /**
     * [Bring Your Own DKIM] A private key that's used to generate a DKIM signature. The private key must use 1024 or 2048-bit RSA encryption, and must be encoded using base64 encoding.
     */
    DomainSigningPrivateKey?: PrivateKey;
    /**
     * [Easy DKIM] The key length of the future DKIM key pair to be generated. This can be changed at most once per day.
     */
    NextSigningKeyLength?: DkimSigningKeyLength;
  }
  export type DkimSigningAttributesOrigin = "AWS_SES"|"EXTERNAL"|string;
  export type DkimSigningKeyLength = "RSA_1024_BIT"|"RSA_2048_BIT"|string;
  export type DkimStatus = "PENDING"|"SUCCESS"|"FAILED"|"TEMPORARY_FAILURE"|"NOT_STARTED"|string;
  export type DnsToken = string;
  export type DnsTokenList = DnsToken[];
  export type Domain = string;
  export interface DomainDeliverabilityCampaign {
    /**
     * The unique identifier for the campaign. The Deliverability dashboard automatically generates and assigns this identifier to a campaign.
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
     * The first time when the email message was delivered to any recipient's inbox. This value can help you determine how long it took for a campaign to deliver an email message.
     */
    FirstSeenDateTime?: Timestamp;
    /**
     * The last time when the email message was delivered to any recipient's inbox. This value can help you determine how long it took for a campaign to deliver an email message.
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
     * A verified domain that’s associated with your Amazon Web Services account and currently has an active Deliverability dashboard subscription.
     */
    Domain?: Domain;
    /**
     * The date when you enabled the Deliverability dashboard for the domain.
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
  export type EmailAddressFilterList = InsightsEmailAddress[];
  export type EmailAddressList = EmailAddress[];
  export interface EmailContent {
    /**
     * The simple email message. The message consists of a subject and a message body.
     */
    Simple?: Message;
    /**
     * The raw email message. The message has to meet the following criteria:   The message has to contain a header and a body, separated by one blank line.   All of the required header fields must be present in the message.   Each part of a multipart MIME message must be formatted properly.   If you include attachments, they must be in a file format that the Amazon SES API v2 supports.    The entire message must be Base64 encoded.   If any of the MIME parts in your message contain content that is outside of the 7-bit ASCII character range, you should encode that content to ensure that recipients' email clients render the message properly.   The length of any single line of text in the message can't exceed 1,000 characters. This restriction is defined in RFC 5321.  
     */
    Raw?: RawMessage;
    /**
     * The template to use for the email message.
     */
    Template?: Template;
  }
  export interface EmailInsights {
    /**
     * The recipient of the email.
     */
    Destination?: InsightsEmailAddress;
    /**
     * The recipient's ISP (e.g., Gmail, Yahoo, etc.).
     */
    Isp?: Isp;
    /**
     * A list of events associated with the sent email.
     */
    Events?: InsightsEvents;
  }
  export type EmailInsightsList = EmailInsights[];
  export type EmailSubject = string;
  export type EmailSubjectFilterList = EmailSubject[];
  export interface EmailTemplateContent {
    /**
     * The subject line of the email.
     */
    Subject?: EmailTemplateSubject;
    /**
     * The email body that will be visible to recipients whose email clients do not display HTML.
     */
    Text?: EmailTemplateText;
    /**
     * The HTML body of the email.
     */
    Html?: EmailTemplateHtml;
  }
  export type EmailTemplateData = string;
  export type EmailTemplateHtml = string;
  export interface EmailTemplateMetadata {
    /**
     * The name of the template.
     */
    TemplateName?: EmailTemplateName;
    /**
     * The time and date the template was created.
     */
    CreatedTimestamp?: Timestamp;
  }
  export type EmailTemplateMetadataList = EmailTemplateMetadata[];
  export type EmailTemplateName = string;
  export type EmailTemplateSubject = string;
  export type EmailTemplateText = string;
  export type Enabled = boolean;
  export type EnabledWrapper = boolean;
  export type EngagementEventType = "OPEN"|"CLICK"|string;
  export type ErrorMessage = string;
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
     * The types of events that Amazon SES sends to the specified event destinations.    SEND - The send request was successful and SES will attempt to deliver the message to the recipient’s mail server. (If account-level or global suppression is being used, SES will still count it as a send, but delivery is suppressed.)    REJECT - SES accepted the email, but determined that it contained a virus and didn’t attempt to deliver it to the recipient’s mail server.    BOUNCE - (Hard bounce) The recipient's mail server permanently rejected the email. (Soft bounces are only included when SES fails to deliver the email after retrying for a period of time.)    COMPLAINT - The email was successfully delivered to the recipient’s mail server, but the recipient marked it as spam.    DELIVERY - SES successfully delivered the email to the recipient's mail server.    OPEN - The recipient received the message and opened it in their email client.    CLICK - The recipient clicked one or more links in the email.    RENDERING_FAILURE - The email wasn't sent because of a template rendering issue. This event type can occur when template data is missing, or when there is a mismatch between template parameters and data. (This event type only occurs when you send email using the  SendTemplatedEmail  or  SendBulkTemplatedEmail  API operations.)     DELIVERY_DELAY - The email couldn't be delivered to the recipient’s mail server because a temporary issue occurred. Delivery delays can occur, for example, when the recipient's inbox is full, or when the receiving email server experiences a transient issue.    SUBSCRIPTION - The email was successfully delivered, but the recipient updated their subscription preferences by clicking on an unsubscribe link as part of your subscription management.  
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
     * An object that defines an Amazon Pinpoint project destination for email events. You can send email event data to a Amazon Pinpoint project to view metrics using the Transactional Messaging dashboards that are built in to Amazon Pinpoint. For more information, see Transactional Messaging Charts in the Amazon Pinpoint User Guide.
     */
    PinpointDestination?: PinpointDestination;
  }
  export interface EventDestinationDefinition {
    /**
     * If true, the event destination is enabled. When the event destination is enabled, the specified event types are sent to the destinations in this EventDestinationDefinition. If false, the event destination is disabled. When the event destination is disabled, events aren't sent to the specified destinations.
     */
    Enabled?: Enabled;
    /**
     * An array that specifies which events the Amazon SES API v2 should send to the destinations in this EventDestinationDefinition.
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
     * An object that defines an Amazon Pinpoint project destination for email events. You can send email event data to a Amazon Pinpoint project to view metrics using the Transactional Messaging dashboards that are built in to Amazon Pinpoint. For more information, see Transactional Messaging Charts in the Amazon Pinpoint User Guide.
     */
    PinpointDestination?: PinpointDestination;
  }
  export type EventDestinationName = string;
  export type EventDestinations = EventDestination[];
  export interface EventDetails {
    /**
     * Information about a Bounce event.
     */
    Bounce?: Bounce;
    /**
     * Information about a Complaint event.
     */
    Complaint?: Complaint;
  }
  export type EventType = "SEND"|"REJECT"|"BOUNCE"|"COMPLAINT"|"DELIVERY"|"OPEN"|"CLICK"|"RENDERING_FAILURE"|"DELIVERY_DELAY"|"SUBSCRIPTION"|string;
  export type EventTypes = EventType[];
  export interface ExportDataSource {
    MetricsDataSource?: MetricsDataSource;
    MessageInsightsDataSource?: MessageInsightsDataSource;
  }
  export interface ExportDestination {
    /**
     * The data format of the final export job file, can be one of the following:    CSV - A comma-separated values file.    JSON - A Json file.  
     */
    DataFormat: DataFormat;
    /**
     * An Amazon S3 pre-signed URL that points to the generated export file.
     */
    S3Url?: S3Url;
  }
  export type ExportDimensionValue = MetricDimensionValue[];
  export type ExportDimensions = {[key: string]: ExportDimensionValue};
  export interface ExportJobSummary {
    /**
     * The export job ID.
     */
    JobId?: JobId;
    /**
     * The source type of the export job.
     */
    ExportSourceType?: ExportSourceType;
    /**
     * The status of the export job.
     */
    JobStatus?: JobStatus;
    /**
     * The timestamp of when the export job was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The timestamp of when the export job was completed.
     */
    CompletedTimestamp?: Timestamp;
  }
  export type ExportJobSummaryList = ExportJobSummary[];
  export interface ExportMetric {
    Name?: Metric;
    Aggregation?: MetricAggregation;
  }
  export type ExportMetrics = ExportMetric[];
  export type ExportSourceType = "METRICS_DATA"|"MESSAGE_INSIGHTS"|string;
  export interface ExportStatistics {
    /**
     * The number of records that were processed to generate the final export file.
     */
    ProcessedRecordsCount?: ProcessedRecordsCount;
    /**
     * The number of records that were exported to the final export file. This value might not be available for all export source types
     */
    ExportedRecordsCount?: ExportedRecordsCount;
  }
  export type ExportedRecordsCount = number;
  export type FailedRecordsCount = number;
  export type FailedRecordsS3Url = string;
  export interface FailureInfo {
    /**
     * An Amazon S3 pre-signed URL that contains all the failed records and related information.
     */
    FailedRecordsS3Url?: FailedRecordsS3Url;
    /**
     * A message about why the job failed.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type FailureRedirectionURL = string;
  export type FeatureStatus = "ENABLED"|"DISABLED"|string;
  export type FeedbackId = string;
  export type GeneralEnforcementStatus = string;
  export interface GetAccountRequest {
  }
  export interface GetAccountResponse {
    /**
     * Indicates whether or not the automatic warm-up feature is enabled for dedicated IP addresses that are associated with your account.
     */
    DedicatedIpAutoWarmupEnabled?: Enabled;
    /**
     * The reputation status of your Amazon SES account. The status can be one of the following:    HEALTHY – There are no reputation-related issues that currently impact your account.    PROBATION – We've identified potential issues with your Amazon SES account. We're placing your account under review while you work on correcting these issues.    SHUTDOWN – Your account's ability to send email is currently paused because of an issue with the email sent from your account. When you correct the issue, you can contact us and request that your account's ability to send email is resumed.  
     */
    EnforcementStatus?: GeneralEnforcementStatus;
    /**
     * Indicates whether or not your account has production access in the current Amazon Web Services Region. If the value is false, then your account is in the sandbox. When your account is in the sandbox, you can only send email to verified identities. Additionally, the maximum number of emails you can send in a 24-hour period (your sending quota) is 200, and the maximum number of emails you can send per second (your maximum sending rate) is 1. If the value is true, then your account has production access. When your account has production access, you can send email to any address. The sending quota and maximum sending rate for your account vary based on your specific use case.
     */
    ProductionAccessEnabled?: Enabled;
    /**
     * An object that contains information about the per-day and per-second sending limits for your Amazon SES account in the current Amazon Web Services Region.
     */
    SendQuota?: SendQuota;
    /**
     * Indicates whether or not email sending is enabled for your Amazon SES account in the current Amazon Web Services Region.
     */
    SendingEnabled?: Enabled;
    /**
     * An object that contains information about the email address suppression preferences for your account in the current Amazon Web Services Region.
     */
    SuppressionAttributes?: SuppressionAttributes;
    /**
     * An object that defines your account details.
     */
    Details?: AccountDetails;
    /**
     * The VDM attributes that apply to your Amazon SES account.
     */
    VdmAttributes?: VdmAttributes;
  }
  export interface GetBlacklistReportsRequest {
    /**
     * A list of IP addresses that you want to retrieve blacklist information about. You can only specify the dedicated IP addresses that you use to send email using Amazon SES or Amazon Pinpoint.
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
     * The name of the configuration set.
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
     * An object that defines whether or not Amazon SES collects reputation metrics for the emails that you send that use the configuration set.
     */
    ReputationOptions?: ReputationOptions;
    /**
     * An object that defines whether or not Amazon SES can send email that you send using the configuration set.
     */
    SendingOptions?: SendingOptions;
    /**
     * An array of objects that define the tags (keys and values) that are associated with the configuration set.
     */
    Tags?: TagList;
    /**
     * An object that contains information about the suppression list preferences for your account.
     */
    SuppressionOptions?: SuppressionOptions;
    /**
     * An object that contains information about the VDM preferences for your configuration set.
     */
    VdmOptions?: VdmOptions;
  }
  export interface GetContactListRequest {
    /**
     * The name of the contact list.
     */
    ContactListName: ContactListName;
  }
  export interface GetContactListResponse {
    /**
     * The name of the contact list.
     */
    ContactListName?: ContactListName;
    /**
     * An interest group, theme, or label within a list. A contact list can have multiple topics.
     */
    Topics?: Topics;
    /**
     * A description of what the contact list is about.
     */
    Description?: Description;
    /**
     * A timestamp noting when the contact list was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * A timestamp noting the last time the contact list was updated.
     */
    LastUpdatedTimestamp?: Timestamp;
    /**
     * The tags associated with a contact list.
     */
    Tags?: TagList;
  }
  export interface GetContactRequest {
    /**
     * The name of the contact list to which the contact belongs.
     */
    ContactListName: ContactListName;
    /**
     * The contact's email address.
     */
    EmailAddress: EmailAddress;
  }
  export interface GetContactResponse {
    /**
     * The name of the contact list to which the contact belongs.
     */
    ContactListName?: ContactListName;
    /**
     * The contact's email address.
     */
    EmailAddress?: EmailAddress;
    /**
     * The contact's preference for being opted-in to or opted-out of a topic.&gt;
     */
    TopicPreferences?: TopicPreferenceList;
    /**
     * The default topic preferences applied to the contact.
     */
    TopicDefaultPreferences?: TopicPreferenceList;
    /**
     * A boolean value status noting if the contact is unsubscribed from all contact list topics.
     */
    UnsubscribeAll?: UnsubscribeAll;
    /**
     * The attribute data attached to a contact.
     */
    AttributesData?: AttributesData;
    /**
     * A timestamp noting when the contact was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * A timestamp noting the last time the contact's information was updated.
     */
    LastUpdatedTimestamp?: Timestamp;
  }
  export interface GetCustomVerificationEmailTemplateRequest {
    /**
     * The name of the custom verification email template that you want to retrieve.
     */
    TemplateName: EmailTemplateName;
  }
  export interface GetCustomVerificationEmailTemplateResponse {
    /**
     * The name of the custom verification email template.
     */
    TemplateName?: EmailTemplateName;
    /**
     * The email address that the custom verification email is sent from.
     */
    FromEmailAddress?: EmailAddress;
    /**
     * The subject line of the custom verification email.
     */
    TemplateSubject?: EmailTemplateSubject;
    /**
     * The content of the custom verification email.
     */
    TemplateContent?: TemplateContent;
    /**
     * The URL that the recipient of the verification email is sent to if his or her address is successfully verified.
     */
    SuccessRedirectionURL?: SuccessRedirectionURL;
    /**
     * The URL that the recipient of the verification email is sent to if his or her address is not successfully verified.
     */
    FailureRedirectionURL?: FailureRedirectionURL;
  }
  export interface GetDedicatedIpPoolRequest {
    /**
     * The name of the dedicated IP pool to retrieve.
     */
    PoolName: PoolName;
  }
  export interface GetDedicatedIpPoolResponse {
    /**
     * An object that contains information about a dedicated IP pool.
     */
    DedicatedIpPool?: DedicatedIpPool;
  }
  export interface GetDedicatedIpRequest {
    /**
     * The IP address that you want to obtain more information about. The value you specify has to be a dedicated IP address that's assocaited with your Amazon Web Services account.
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
     * A list of dedicated IP addresses that are associated with your Amazon Web Services account.
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
     * Specifies whether the Deliverability dashboard is enabled. If this value is true, the dashboard is enabled.
     */
    DashboardEnabled: Enabled;
    /**
     * The date when your current subscription to the Deliverability dashboard is scheduled to expire, if your subscription is scheduled to expire at the end of the current calendar month. This value is null if you have an active subscription that isn’t due to expire at the end of the month.
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
     * The unique identifier for the campaign. The Deliverability dashboard automatically generates and assigns this identifier to a campaign.
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
  export interface GetEmailIdentityPoliciesRequest {
    /**
     * The email identity.
     */
    EmailIdentity: Identity;
  }
  export interface GetEmailIdentityPoliciesResponse {
    /**
     * A map of policy names to policies.
     */
    Policies?: PolicyMap;
  }
  export interface GetEmailIdentityRequest {
    /**
     * The email identity.
     */
    EmailIdentity: Identity;
  }
  export interface GetEmailIdentityResponse {
    /**
     * The email identity type. Note: the MANAGED_DOMAIN identity type is not supported.
     */
    IdentityType?: IdentityType;
    /**
     * The feedback forwarding configuration for the identity. If the value is true, you receive email notifications when bounce or complaint events occur. These notifications are sent to the address that you specified in the Return-Path header of the original email. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications (for example, by setting up an event destination), you receive an email notification when these events occur (even if this setting is disabled).
     */
    FeedbackForwardingStatus?: Enabled;
    /**
     * Specifies whether or not the identity is verified. You can only send email from verified email addresses or domains. For more information about verifying identities, see the Amazon Pinpoint User Guide.
     */
    VerifiedForSendingStatus?: Enabled;
    /**
     * An object that contains information about the DKIM attributes for the identity.
     */
    DkimAttributes?: DkimAttributes;
    /**
     * An object that contains information about the Mail-From attributes for the email identity.
     */
    MailFromAttributes?: MailFromAttributes;
    /**
     * A map of policy names to policies.
     */
    Policies?: PolicyMap;
    /**
     * An array of objects that define the tags (keys and values) that are associated with the email identity.
     */
    Tags?: TagList;
    /**
     * The configuration set used by default when sending from this identity.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * The verification status of the identity. The status can be one of the following:    PENDING – The verification process was initiated, but Amazon SES hasn't yet been able to verify the identity.    SUCCESS – The verification process completed successfully.    FAILED – The verification process failed.    TEMPORARY_FAILURE – A temporary issue is preventing Amazon SES from determining the verification status of the identity.    NOT_STARTED – The verification process hasn't been initiated for the identity.  
     */
    VerificationStatus?: VerificationStatus;
  }
  export interface GetEmailTemplateRequest {
    /**
     * The name of the template.
     */
    TemplateName: EmailTemplateName;
  }
  export interface GetEmailTemplateResponse {
    /**
     * The name of the template.
     */
    TemplateName: EmailTemplateName;
    /**
     * The content of the email template, composed of a subject line, an HTML part, and a text-only part.
     */
    TemplateContent: EmailTemplateContent;
  }
  export interface GetExportJobRequest {
    /**
     * The export job ID.
     */
    JobId: JobId;
  }
  export interface GetExportJobResponse {
    /**
     * The export job ID.
     */
    JobId?: JobId;
    /**
     * The type of source of the export job.
     */
    ExportSourceType?: ExportSourceType;
    /**
     * The status of the export job.
     */
    JobStatus?: JobStatus;
    /**
     * The destination of the export job.
     */
    ExportDestination?: ExportDestination;
    /**
     * The data source of the export job.
     */
    ExportDataSource?: ExportDataSource;
    /**
     * The timestamp of when the export job was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The timestamp of when the export job was completed.
     */
    CompletedTimestamp?: Timestamp;
    /**
     * The failure details about an export job.
     */
    FailureInfo?: FailureInfo;
    /**
     * The statistics about the export job.
     */
    Statistics?: ExportStatistics;
  }
  export interface GetImportJobRequest {
    /**
     * The ID of the import job.
     */
    JobId: JobId;
  }
  export interface GetImportJobResponse {
    /**
     * A string that represents the import job ID.
     */
    JobId?: JobId;
    /**
     * The destination of the import job.
     */
    ImportDestination?: ImportDestination;
    /**
     * The data source of the import job.
     */
    ImportDataSource?: ImportDataSource;
    /**
     * The failure details about an import job.
     */
    FailureInfo?: FailureInfo;
    /**
     * The status of the import job.
     */
    JobStatus?: JobStatus;
    /**
     * The time stamp of when the import job was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The time stamp of when the import job was completed.
     */
    CompletedTimestamp?: Timestamp;
    /**
     * The current number of records processed.
     */
    ProcessedRecordsCount?: ProcessedRecordsCount;
    /**
     * The number of records that failed processing because of invalid input or other reasons.
     */
    FailedRecordsCount?: FailedRecordsCount;
  }
  export interface GetMessageInsightsRequest {
    /**
     *  A MessageId is a unique identifier for a message, and is returned when sending emails through Amazon SES. 
     */
    MessageId: OutboundMessageId;
  }
  export interface GetMessageInsightsResponse {
    /**
     * A unique identifier for the message.
     */
    MessageId?: OutboundMessageId;
    /**
     * The from address used to send the message.
     */
    FromEmailAddress?: InsightsEmailAddress;
    /**
     * The subject line of the message.
     */
    Subject?: EmailSubject;
    /**
     *  A list of tags, in the form of name/value pairs, that were applied to the email you sent, along with Amazon SES Auto-Tags. 
     */
    EmailTags?: MessageTagList;
    /**
     * A set of insights associated with the message.
     */
    Insights?: EmailInsightsList;
  }
  export interface GetSuppressedDestinationRequest {
    /**
     * The email address that's on the account suppression list.
     */
    EmailAddress: EmailAddress;
  }
  export interface GetSuppressedDestinationResponse {
    /**
     * An object containing information about the suppressed email address.
     */
    SuppressedDestination: SuppressedDestination;
  }
  export interface GuardianAttributes {
    /**
     * Specifies the status of your VDM optimized shared delivery. Can be one of the following:    ENABLED – Amazon SES enables optimized shared delivery for your account.    DISABLED – Amazon SES disables optimized shared delivery for your account.  
     */
    OptimizedSharedDelivery?: FeatureStatus;
  }
  export interface GuardianOptions {
    /**
     * Specifies the status of your VDM optimized shared delivery. Can be one of the following:    ENABLED – Amazon SES enables optimized shared delivery for the configuration set.    DISABLED – Amazon SES disables optimized shared delivery for the configuration set.  
     */
    OptimizedSharedDelivery?: FeatureStatus;
  }
  export type Identity = string;
  export interface IdentityInfo {
    /**
     * The email identity type. Note: the MANAGED_DOMAIN type is not supported for email identity types.
     */
    IdentityType?: IdentityType;
    /**
     * The address or domain of the identity.
     */
    IdentityName?: Identity;
    /**
     * Indicates whether or not you can send email from the identity. An identity is an email address or domain that you send email from. Before you can send email from an identity, you have to demostrate that you own the identity, and that you authorize Amazon SES to send email from that identity.
     */
    SendingEnabled?: Enabled;
    /**
     * The verification status of the identity. The status can be one of the following:    PENDING – The verification process was initiated, but Amazon SES hasn't yet been able to verify the identity.    SUCCESS – The verification process completed successfully.    FAILED – The verification process failed.    TEMPORARY_FAILURE – A temporary issue is preventing Amazon SES from determining the verification status of the identity.    NOT_STARTED – The verification process hasn't been initiated for the identity.  
     */
    VerificationStatus?: VerificationStatus;
  }
  export type IdentityInfoList = IdentityInfo[];
  export type IdentityType = "EMAIL_ADDRESS"|"DOMAIN"|"MANAGED_DOMAIN"|string;
  export type ImageUrl = string;
  export interface ImportDataSource {
    /**
     * An Amazon S3 URL in the format s3://&lt;bucket_name&gt;/&lt;object&gt;.
     */
    S3Url: S3Url;
    /**
     * The data format of the import job's data source.
     */
    DataFormat: DataFormat;
  }
  export interface ImportDestination {
    /**
     * An object that contains the action of the import job towards suppression list.
     */
    SuppressionListDestination?: SuppressionListDestination;
    /**
     * An object that contains the action of the import job towards a contact list.
     */
    ContactListDestination?: ContactListDestination;
  }
  export type ImportDestinationType = "SUPPRESSION_LIST"|"CONTACT_LIST"|string;
  export interface ImportJobSummary {
    JobId?: JobId;
    ImportDestination?: ImportDestination;
    JobStatus?: JobStatus;
    /**
     * The date and time when the import job was created.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The current number of records processed.
     */
    ProcessedRecordsCount?: ProcessedRecordsCount;
    /**
     * The number of records that failed processing because of invalid input or other reasons.
     */
    FailedRecordsCount?: FailedRecordsCount;
  }
  export type ImportJobSummaryList = ImportJobSummary[];
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
  export type InsightsEmailAddress = string;
  export interface InsightsEvent {
    /**
     * The timestamp of the event.
     */
    Timestamp?: Timestamp;
    /**
     * The type of event:    SEND - The send request was successful and SES will attempt to deliver the message to the recipient’s mail server. (If account-level or global suppression is being used, SES will still count it as a send, but delivery is suppressed.)     DELIVERY - SES successfully delivered the email to the recipient's mail server. Excludes deliveries to the mailbox simulator, and those from emails addressed to more than one recipient.     BOUNCE - Feedback received for delivery failures. Additional details about the bounce are provided in the Details object. Excludes bounces from the mailbox simulator, and those from emails addressed to more than one recipient.     COMPLAINT - Complaint received for the email. Additional details about the complaint are provided in the Details object. This excludes complaints from the mailbox simulator, those originating from your account-level suppression list (if enabled), and those from emails addressed to more than one recipient.     OPEN - Open event for emails including open trackers. Excludes opens for emails addressed to more than one recipient.    CLICK - Click event for emails including wrapped links. Excludes clicks for emails addressed to more than one recipient.  
     */
    Type?: EventType;
    /**
     * Details about bounce or complaint events.
     */
    Details?: EventDetails;
  }
  export type InsightsEvents = InsightsEvent[];
  export type Ip = string;
  export type IpList = Ip[];
  export type Isp = string;
  export type IspFilterList = Isp[];
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
  export type JobId = string;
  export type JobStatus = "CREATED"|"PROCESSING"|"COMPLETED"|"FAILED"|"CANCELLED"|string;
  export interface KinesisFirehoseDestination {
    /**
     * The Amazon Resource Name (ARN) of the IAM role that the Amazon SES API v2 uses to send email events to the Amazon Kinesis Data Firehose stream.
     */
    IamRoleArn: AmazonResourceName;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Kinesis Data Firehose stream that the Amazon SES API v2 sends email events to.
     */
    DeliveryStreamArn: AmazonResourceName;
  }
  export type LastDeliveryEventList = DeliveryEventType[];
  export type LastEngagementEventList = EngagementEventType[];
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
     * An array that contains all of the configuration sets in your Amazon SES account in the current Amazon Web Services Region.
     */
    ConfigurationSets?: ConfigurationSetNameList;
    /**
     * A token that indicates that there are additional configuration sets to list. To view additional configuration sets, issue another request to ListConfigurationSets, and pass this token in the NextToken parameter.
     */
    NextToken?: NextToken;
  }
  export interface ListContactListsRequest {
    /**
     * Maximum number of contact lists to return at once. Use this parameter to paginate results. If additional contact lists exist beyond the specified limit, the NextToken element is sent in the response. Use the NextToken value in subsequent requests to retrieve additional lists.
     */
    PageSize?: MaxItems;
    /**
     * A string token indicating that there might be additional contact lists available to be listed. Use the token provided in the Response to use in the subsequent call to ListContactLists with the same parameters to retrieve the next page of contact lists.
     */
    NextToken?: NextToken;
  }
  export interface ListContactListsResponse {
    /**
     * The available contact lists.
     */
    ContactLists?: ListOfContactLists;
    /**
     * A string token indicating that there might be additional contact lists available to be listed. Copy this token to a subsequent call to ListContactLists with the same parameters to retrieve the next page of contact lists.
     */
    NextToken?: NextToken;
  }
  export interface ListContactsFilter {
    /**
     * The status by which you are filtering: OPT_IN or OPT_OUT.
     */
    FilteredStatus?: SubscriptionStatus;
    /**
     * Used for filtering by a specific topic preference.
     */
    TopicFilter?: TopicFilter;
  }
  export interface ListContactsRequest {
    /**
     * The name of the contact list.
     */
    ContactListName: ContactListName;
    /**
     * A filter that can be applied to a list of contacts.
     */
    Filter?: ListContactsFilter;
    /**
     * The number of contacts that may be returned at once, which is dependent on if there are more or less contacts than the value of the PageSize. Use this parameter to paginate results. If additional contacts exist beyond the specified limit, the NextToken element is sent in the response. Use the NextToken value in subsequent requests to retrieve additional contacts.
     */
    PageSize?: MaxItems;
    /**
     * A string token indicating that there might be additional contacts available to be listed. Use the token provided in the Response to use in the subsequent call to ListContacts with the same parameters to retrieve the next page of contacts.
     */
    NextToken?: NextToken;
  }
  export interface ListContactsResponse {
    /**
     * The contacts present in a specific contact list.
     */
    Contacts?: ListOfContacts;
    /**
     * A string token indicating that there might be additional contacts available to be listed. Copy this token to a subsequent call to ListContacts with the same parameters to retrieve the next page of contacts.
     */
    NextToken?: NextToken;
  }
  export interface ListCustomVerificationEmailTemplatesRequest {
    /**
     * A token returned from a previous call to ListCustomVerificationEmailTemplates to indicate the position in the list of custom verification email templates.
     */
    NextToken?: NextToken;
    /**
     * The number of results to show in a single call to ListCustomVerificationEmailTemplates. If the number of results is larger than the number you specified in this parameter, then the response includes a NextToken element, which you can use to obtain additional results. The value you specify has to be at least 1, and can be no more than 50.
     */
    PageSize?: MaxItems;
  }
  export interface ListCustomVerificationEmailTemplatesResponse {
    /**
     * A list of the custom verification email templates that exist in your account.
     */
    CustomVerificationEmailTemplates?: CustomVerificationEmailTemplatesList;
    /**
     * A token indicating that there are additional custom verification email templates available to be listed. Pass this token to a subsequent call to ListCustomVerificationEmailTemplates to retrieve the next 50 custom verification email templates.
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
     * A list of all of the dedicated IP pools that are associated with your Amazon Web Services account in the current Region.
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
     * The first day that you want to obtain deliverability data for.
     */
    StartDate: Timestamp;
    /**
     * The last day that you want to obtain deliverability data for. This value has to be less than or equal to 30 days after the value of the StartDate parameter.
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
     * An array that includes all of the email identities associated with your Amazon Web Services account.
     */
    EmailIdentities?: IdentityInfoList;
    /**
     * A token that indicates that there are additional configuration sets to list. To view additional configuration sets, issue another request to ListEmailIdentities, and pass this token in the NextToken parameter.
     */
    NextToken?: NextToken;
  }
  export interface ListEmailTemplatesRequest {
    /**
     * A token returned from a previous call to ListEmailTemplates to indicate the position in the list of email templates.
     */
    NextToken?: NextToken;
    /**
     * The number of results to show in a single call to ListEmailTemplates. If the number of results is larger than the number you specified in this parameter, then the response includes a NextToken element, which you can use to obtain additional results. The value you specify has to be at least 1, and can be no more than 10.
     */
    PageSize?: MaxItems;
  }
  export interface ListEmailTemplatesResponse {
    /**
     * An array the contains the name and creation time stamp for each template in your Amazon SES account.
     */
    TemplatesMetadata?: EmailTemplateMetadataList;
    /**
     * A token indicating that there are additional email templates available to be listed. Pass this token to a subsequent ListEmailTemplates call to retrieve the next 10 email templates.
     */
    NextToken?: NextToken;
  }
  export interface ListExportJobsRequest {
    /**
     * The pagination token returned from a previous call to ListExportJobs to indicate the position in the list of export jobs.
     */
    NextToken?: NextToken;
    /**
     * Maximum number of export jobs to return at once. Use this parameter to paginate results. If additional export jobs exist beyond the specified limit, the NextToken element is sent in the response. Use the NextToken value in subsequent calls to ListExportJobs to retrieve additional export jobs.
     */
    PageSize?: MaxItems;
    /**
     * A value used to list export jobs that have a certain ExportSourceType.
     */
    ExportSourceType?: ExportSourceType;
    /**
     * A value used to list export jobs that have a certain JobStatus.
     */
    JobStatus?: JobStatus;
  }
  export interface ListExportJobsResponse {
    /**
     * A list of the export job summaries.
     */
    ExportJobs?: ExportJobSummaryList;
    /**
     * A string token indicating that there might be additional export jobs available to be listed. Use this token to a subsequent call to ListExportJobs with the same parameters to retrieve the next page of export jobs.
     */
    NextToken?: NextToken;
  }
  export interface ListImportJobsRequest {
    /**
     * The destination of the import job, which can be used to list import jobs that have a certain ImportDestinationType.
     */
    ImportDestinationType?: ImportDestinationType;
    /**
     * A string token indicating that there might be additional import jobs available to be listed. Copy this token to a subsequent call to ListImportJobs with the same parameters to retrieve the next page of import jobs.
     */
    NextToken?: NextToken;
    /**
     * Maximum number of import jobs to return at once. Use this parameter to paginate results. If additional import jobs exist beyond the specified limit, the NextToken element is sent in the response. Use the NextToken value in subsequent requests to retrieve additional addresses.
     */
    PageSize?: MaxItems;
  }
  export interface ListImportJobsResponse {
    /**
     * A list of the import job summaries.
     */
    ImportJobs?: ImportJobSummaryList;
    /**
     * A string token indicating that there might be additional import jobs available to be listed. Copy this token to a subsequent call to ListImportJobs with the same parameters to retrieve the next page of import jobs.
     */
    NextToken?: NextToken;
  }
  export interface ListManagementOptions {
    /**
     * The name of the contact list.
     */
    ContactListName: ContactListName;
    /**
     * The name of the topic.
     */
    TopicName?: TopicName;
  }
  export type ListOfContactLists = ContactList[];
  export type ListOfContacts = Contact[];
  export type ListOfDedicatedIpPools = PoolName[];
  export type ListRecommendationFilterValue = string;
  export type ListRecommendationsFilter = {[key: string]: ListRecommendationFilterValue};
  export type ListRecommendationsFilterKey = "TYPE"|"IMPACT"|"STATUS"|"RESOURCE_ARN"|string;
  export interface ListRecommendationsRequest {
    /**
     * Filters applied when retrieving recommendations. Can eiter be an individual filter, or combinations of STATUS and IMPACT or STATUS and TYPE 
     */
    Filter?: ListRecommendationsFilter;
    /**
     * A token returned from a previous call to ListRecommendations to indicate the position in the list of recommendations.
     */
    NextToken?: NextToken;
    /**
     * The number of results to show in a single call to ListRecommendations. If the number of results is larger than the number you specified in this parameter, then the response includes a NextToken element, which you can use to obtain additional results. The value you specify has to be at least 1, and can be no more than 100.
     */
    PageSize?: MaxItems;
  }
  export interface ListRecommendationsResponse {
    /**
     * The recommendations applicable to your account.
     */
    Recommendations?: RecommendationsList;
    /**
     * A string token indicating that there might be additional recommendations available to be listed. Use the token provided in the ListRecommendationsResponse to use in the subsequent call to ListRecommendations with the same parameters to retrieve the next page of recommendations.
     */
    NextToken?: NextToken;
  }
  export interface ListSuppressedDestinationsRequest {
    /**
     * The factors that caused the email address to be added to .
     */
    Reasons?: SuppressionListReasons;
    /**
     * Used to filter the list of suppressed email destinations so that it only includes addresses that were added to the list after a specific date.
     */
    StartDate?: Timestamp;
    /**
     * Used to filter the list of suppressed email destinations so that it only includes addresses that were added to the list before a specific date.
     */
    EndDate?: Timestamp;
    /**
     * A token returned from a previous call to ListSuppressedDestinations to indicate the position in the list of suppressed email addresses.
     */
    NextToken?: NextToken;
    /**
     * The number of results to show in a single call to ListSuppressedDestinations. If the number of results is larger than the number you specified in this parameter, then the response includes a NextToken element, which you can use to obtain additional results.
     */
    PageSize?: MaxItems;
  }
  export interface ListSuppressedDestinationsResponse {
    /**
     * A list of summaries, each containing a summary for a suppressed email destination.
     */
    SuppressedDestinationSummaries?: SuppressedDestinationSummaries;
    /**
     * A token that indicates that there are additional email addresses on the suppression list for your account. To view additional suppressed addresses, issue another request to ListSuppressedDestinations, and pass this token in the NextToken parameter.
     */
    NextToken?: NextToken;
  }
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
     * The status of the MAIL FROM domain. This status can have the following values:    PENDING – Amazon SES hasn't started searching for the MX record yet.    SUCCESS – Amazon SES detected the required MX record for the MAIL FROM domain.    FAILED – Amazon SES can't find the required MX record, or the record no longer exists.    TEMPORARY_FAILURE – A temporary issue occurred, which prevented Amazon SES from determining the status of the MAIL FROM domain.  
     */
    MailFromDomainStatus: MailFromDomainStatus;
    /**
     * The action to take if the required MX record can't be found when you send an email. When you set this value to USE_DEFAULT_VALUE, the mail is sent using amazonses.com as the MAIL FROM domain. When you set this value to REJECT_MESSAGE, the Amazon SES API v2 returns a MailFromDomainNotVerified error, and doesn't attempt to deliver the email. These behaviors are taken when the custom MAIL FROM domain configuration is in the Pending, Failed, and TemporaryFailure states.
     */
    BehaviorOnMxFailure: BehaviorOnMxFailure;
  }
  export type MailFromDomainName = string;
  export type MailFromDomainStatus = "PENDING"|"SUCCESS"|"FAILED"|"TEMPORARY_FAILURE"|string;
  export type MailType = "MARKETING"|"TRANSACTIONAL"|string;
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
  export interface MessageInsightsDataSource {
    /**
     * Represents the start date for the export interval as a timestamp. The start date is inclusive.
     */
    StartDate: Timestamp;
    /**
     * Represents the end date for the export interval as a timestamp. The end date is inclusive.
     */
    EndDate: Timestamp;
    /**
     * Filters for results to be included in the export file.
     */
    Include?: MessageInsightsFilters;
    /**
     * Filters for results to be excluded from the export file.
     */
    Exclude?: MessageInsightsFilters;
    /**
     * The maximum number of results.
     */
    MaxResults?: MessageInsightsExportMaxResults;
  }
  export type MessageInsightsExportMaxResults = number;
  export interface MessageInsightsFilters {
    /**
     * The from address used to send the message.
     */
    FromEmailAddress?: EmailAddressFilterList;
    /**
     * The recipient's email address.
     */
    Destination?: EmailAddressFilterList;
    /**
     * The subject line of the message.
     */
    Subject?: EmailSubjectFilterList;
    /**
     * The recipient's ISP (e.g., Gmail, Yahoo, etc.).
     */
    Isp?: IspFilterList;
    /**
     *  The last delivery-related event for the email, where the ordering is as follows: SEND &lt; BOUNCE &lt; DELIVERY &lt; COMPLAINT. 
     */
    LastDeliveryEvent?: LastDeliveryEventList;
    /**
     *  The last engagement-related event for the email, where the ordering is as follows: OPEN &lt; CLICK.   Engagement events are only available if Engagement tracking is enabled. 
     */
    LastEngagementEvent?: LastEngagementEventList;
  }
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
  export type Metric = "SEND"|"COMPLAINT"|"PERMANENT_BOUNCE"|"TRANSIENT_BOUNCE"|"OPEN"|"CLICK"|"DELIVERY"|"DELIVERY_OPEN"|"DELIVERY_CLICK"|"DELIVERY_COMPLAINT"|string;
  export type MetricAggregation = "RATE"|"VOLUME"|string;
  export interface MetricDataError {
    /**
     * The query identifier.
     */
    Id?: QueryIdentifier;
    /**
     * The query error code. Can be one of:    INTERNAL_FAILURE – Amazon SES has failed to process one of the queries.    ACCESS_DENIED – You have insufficient access to retrieve metrics based on the given query.  
     */
    Code?: QueryErrorCode;
    /**
     * The error message associated with the current query error.
     */
    Message?: QueryErrorMessage;
  }
  export type MetricDataErrorList = MetricDataError[];
  export interface MetricDataResult {
    /**
     * The query identifier.
     */
    Id?: QueryIdentifier;
    /**
     * A list of timestamps for the metric data results.
     */
    Timestamps?: TimestampList;
    /**
     * A list of values (cumulative / sum) for the metric data results.
     */
    Values?: MetricValueList;
  }
  export type MetricDataResultList = MetricDataResult[];
  export type MetricDimensionName = "EMAIL_IDENTITY"|"CONFIGURATION_SET"|"ISP"|string;
  export type MetricDimensionValue = string;
  export type MetricNamespace = "VDM"|string;
  export type MetricValueList = Counter[];
  export interface MetricsDataSource {
    /**
     * An object that contains a mapping between a MetricDimensionName and MetricDimensionValue to filter metrics by. Must contain a least 1 dimension but no more than 3 unique ones.
     */
    Dimensions: ExportDimensions;
    /**
     * The metrics namespace - e.g., VDM.
     */
    Namespace: MetricNamespace;
    /**
     * A list of ExportMetric objects to export.
     */
    Metrics: ExportMetrics;
    /**
     * Represents the start date for the export interval as a timestamp.
     */
    StartDate: Timestamp;
    /**
     * Represents the end date for the export interval as a timestamp.
     */
    EndDate: Timestamp;
  }
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
     * The Amazon Resource Name (ARN) of the Amazon Pinpoint project to send email events to.
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
  export type Policy = string;
  export type PolicyMap = {[key: string]: Policy};
  export type PolicyName = string;
  export type PoolName = string;
  export type PrivateKey = string;
  export type ProcessedRecordsCount = number;
  export interface PutAccountDedicatedIpWarmupAttributesRequest {
    /**
     * Enables or disables the automatic warm-up feature for dedicated IP addresses that are associated with your Amazon SES account in the current Amazon Web Services Region. Set to true to enable the automatic warm-up feature, or set to false to disable it.
     */
    AutoWarmupEnabled?: Enabled;
  }
  export interface PutAccountDedicatedIpWarmupAttributesResponse {
  }
  export interface PutAccountDetailsRequest {
    /**
     * The type of email your account will send.
     */
    MailType: MailType;
    /**
     * The URL of your website. This information helps us better understand the type of content that you plan to send.
     */
    WebsiteURL: WebsiteURL;
    /**
     * The language you would prefer to be contacted with.
     */
    ContactLanguage?: ContactLanguage;
    /**
     * A description of the types of email that you plan to send.
     */
    UseCaseDescription: UseCaseDescription;
    /**
     * Additional email addresses that you would like to be notified regarding Amazon SES matters.
     */
    AdditionalContactEmailAddresses?: AdditionalContactEmailAddresses;
    /**
     * Indicates whether or not your account should have production access in the current Amazon Web Services Region. If the value is false, then your account is in the sandbox. When your account is in the sandbox, you can only send email to verified identities. Additionally, the maximum number of emails you can send in a 24-hour period (your sending quota) is 200, and the maximum number of emails you can send per second (your maximum sending rate) is 1. If the value is true, then your account has production access. When your account has production access, you can send email to any address. The sending quota and maximum sending rate for your account vary based on your specific use case.
     */
    ProductionAccessEnabled?: EnabledWrapper;
  }
  export interface PutAccountDetailsResponse {
  }
  export interface PutAccountSendingAttributesRequest {
    /**
     * Enables or disables your account's ability to send email. Set to true to enable email sending, or set to false to disable email sending.  If Amazon Web Services paused your account's ability to send email, you can't use this operation to resume your account's ability to send email. 
     */
    SendingEnabled?: Enabled;
  }
  export interface PutAccountSendingAttributesResponse {
  }
  export interface PutAccountSuppressionAttributesRequest {
    /**
     * A list that contains the reasons that email addresses will be automatically added to the suppression list for your account. This list can contain any or all of the following:    COMPLAINT – Amazon SES adds an email address to the suppression list for your account when a message sent to that address results in a complaint.    BOUNCE – Amazon SES adds an email address to the suppression list for your account when a message sent to that address results in a hard bounce.  
     */
    SuppressedReasons?: SuppressionListReasons;
  }
  export interface PutAccountSuppressionAttributesResponse {
  }
  export interface PutAccountVdmAttributesRequest {
    /**
     * The VDM attributes that you wish to apply to your Amazon SES account.
     */
    VdmAttributes: VdmAttributes;
  }
  export interface PutAccountVdmAttributesResponse {
  }
  export interface PutConfigurationSetDeliveryOptionsRequest {
    /**
     * The name of the configuration set to associate with a dedicated IP pool.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * Specifies whether messages that use the configuration set are required to use Transport Layer Security (TLS). If the value is Require, messages are only delivered if a TLS connection can be established. If the value is Optional, messages can be delivered in plain text if a TLS connection can't be established.
     */
    TlsPolicy?: TlsPolicy;
    /**
     * The name of the dedicated IP pool to associate with the configuration set.
     */
    SendingPoolName?: SendingPoolName;
  }
  export interface PutConfigurationSetDeliveryOptionsResponse {
  }
  export interface PutConfigurationSetReputationOptionsRequest {
    /**
     * The name of the configuration set.
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
     * The name of the configuration set to enable or disable email sending for.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * If true, email sending is enabled for the configuration set. If false, email sending is disabled for the configuration set.
     */
    SendingEnabled?: Enabled;
  }
  export interface PutConfigurationSetSendingOptionsResponse {
  }
  export interface PutConfigurationSetSuppressionOptionsRequest {
    /**
     * The name of the configuration set to change the suppression list preferences for.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * A list that contains the reasons that email addresses are automatically added to the suppression list for your account. This list can contain any or all of the following:    COMPLAINT – Amazon SES adds an email address to the suppression list for your account when a message sent to that address results in a complaint.    BOUNCE – Amazon SES adds an email address to the suppression list for your account when a message sent to that address results in a hard bounce.  
     */
    SuppressedReasons?: SuppressionListReasons;
  }
  export interface PutConfigurationSetSuppressionOptionsResponse {
  }
  export interface PutConfigurationSetTrackingOptionsRequest {
    /**
     * The name of the configuration set.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * The domain to use to track open and click events.
     */
    CustomRedirectDomain?: CustomRedirectDomain;
  }
  export interface PutConfigurationSetTrackingOptionsResponse {
  }
  export interface PutConfigurationSetVdmOptionsRequest {
    /**
     * The name of the configuration set.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * The VDM options to apply to the configuration set.
     */
    VdmOptions?: VdmOptions;
  }
  export interface PutConfigurationSetVdmOptionsResponse {
  }
  export interface PutDedicatedIpInPoolRequest {
    /**
     * The IP address that you want to move to the dedicated IP pool. The value you specify has to be a dedicated IP address that's associated with your Amazon Web Services account.
     */
    Ip: Ip;
    /**
     * The name of the IP pool that you want to add the dedicated IP address to. You have to specify an IP pool that already exists.
     */
    DestinationPoolName: PoolName;
  }
  export interface PutDedicatedIpInPoolResponse {
  }
  export interface PutDedicatedIpPoolScalingAttributesRequest {
    /**
     * The name of the dedicated IP pool.
     */
    PoolName: PoolName;
    /**
     * The scaling mode to apply to the dedicated IP pool.  Changing the scaling mode from MANAGED to STANDARD is not supported. 
     */
    ScalingMode: ScalingMode;
  }
  export interface PutDedicatedIpPoolScalingAttributesResponse {
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
     * Specifies whether to enable the Deliverability dashboard. To enable the dashboard, set this value to true.
     */
    DashboardEnabled: Enabled;
    /**
     * An array of objects, one for each verified domain that you use to send email and enabled the Deliverability dashboard for.
     */
    SubscribedDomains?: DomainDeliverabilityTrackingOptions;
  }
  export interface PutDeliverabilityDashboardOptionResponse {
  }
  export interface PutEmailIdentityConfigurationSetAttributesRequest {
    /**
     * The email address or domain to associate with a configuration set.
     */
    EmailIdentity: Identity;
    /**
     * The configuration set to associate with an email identity.
     */
    ConfigurationSetName?: ConfigurationSetName;
  }
  export interface PutEmailIdentityConfigurationSetAttributesResponse {
  }
  export interface PutEmailIdentityDkimAttributesRequest {
    /**
     * The email identity.
     */
    EmailIdentity: Identity;
    /**
     * Sets the DKIM signing configuration for the identity. When you set this value true, then the messages that are sent from the identity are signed using DKIM. If you set this value to false, your messages are sent without DKIM signing.
     */
    SigningEnabled?: Enabled;
  }
  export interface PutEmailIdentityDkimAttributesResponse {
  }
  export interface PutEmailIdentityDkimSigningAttributesRequest {
    /**
     * The email identity.
     */
    EmailIdentity: Identity;
    /**
     * The method to use to configure DKIM for the identity. There are the following possible values:    AWS_SES – Configure DKIM for the identity by using Easy DKIM.    EXTERNAL – Configure DKIM for the identity by using Bring Your Own DKIM (BYODKIM).  
     */
    SigningAttributesOrigin: DkimSigningAttributesOrigin;
    /**
     * An object that contains information about the private key and selector that you want to use to configure DKIM for the identity for Bring Your Own DKIM (BYODKIM) for the identity, or, configures the key length to be used for Easy DKIM.
     */
    SigningAttributes?: DkimSigningAttributes;
  }
  export interface PutEmailIdentityDkimSigningAttributesResponse {
    /**
     * The DKIM authentication status of the identity. Amazon SES determines the authentication status by searching for specific records in the DNS configuration for your domain. If you used Easy DKIM to set up DKIM authentication, Amazon SES tries to find three unique CNAME records in the DNS configuration for your domain. If you provided a public key to perform DKIM authentication, Amazon SES tries to find a TXT record that uses the selector that you specified. The value of the TXT record must be a public key that's paired with the private key that you specified in the process of creating the identity. The status can be one of the following:    PENDING – The verification process was initiated, but Amazon SES hasn't yet detected the DKIM records in the DNS configuration for the domain.    SUCCESS – The verification process completed successfully.    FAILED – The verification process failed. This typically occurs when Amazon SES fails to find the DKIM records in the DNS configuration of the domain.    TEMPORARY_FAILURE – A temporary issue is preventing Amazon SES from determining the DKIM authentication status of the domain.    NOT_STARTED – The DKIM verification process hasn't been initiated for the domain.  
     */
    DkimStatus?: DkimStatus;
    /**
     * If you used Easy DKIM to configure DKIM authentication for the domain, then this object contains a set of unique strings that you use to create a set of CNAME records that you add to the DNS configuration for your domain. When Amazon SES detects these records in the DNS configuration for your domain, the DKIM authentication process is complete. If you configured DKIM authentication for the domain by providing your own public-private key pair, then this object contains the selector that's associated with your public key. Regardless of the DKIM authentication method you use, Amazon SES searches for the appropriate records in the DNS configuration of the domain for up to 72 hours.
     */
    DkimTokens?: DnsTokenList;
  }
  export interface PutEmailIdentityFeedbackAttributesRequest {
    /**
     * The email identity.
     */
    EmailIdentity: Identity;
    /**
     * Sets the feedback forwarding configuration for the identity. If the value is true, you receive email notifications when bounce or complaint events occur. These notifications are sent to the address that you specified in the Return-Path header of the original email. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications (for example, by setting up an event destination), you receive an email notification when these events occur (even if this setting is disabled).
     */
    EmailForwardingEnabled?: Enabled;
  }
  export interface PutEmailIdentityFeedbackAttributesResponse {
  }
  export interface PutEmailIdentityMailFromAttributesRequest {
    /**
     * The verified email identity.
     */
    EmailIdentity: Identity;
    /**
     *  The custom MAIL FROM domain that you want the verified identity to use. The MAIL FROM domain must meet the following criteria:   It has to be a subdomain of the verified identity.   It can't be used to receive email.   It can't be used in a "From" address if the MAIL FROM domain is a destination for feedback forwarding emails.  
     */
    MailFromDomain?: MailFromDomainName;
    /**
     * The action to take if the required MX record isn't found when you send an email. When you set this value to UseDefaultValue, the mail is sent using amazonses.com as the MAIL FROM domain. When you set this value to RejectMessage, the Amazon SES API v2 returns a MailFromDomainNotVerified error, and doesn't attempt to deliver the email. These behaviors are taken when the custom MAIL FROM domain configuration is in the Pending, Failed, and TemporaryFailure states.
     */
    BehaviorOnMxFailure?: BehaviorOnMxFailure;
  }
  export interface PutEmailIdentityMailFromAttributesResponse {
  }
  export interface PutSuppressedDestinationRequest {
    /**
     * The email address that should be added to the suppression list for your account.
     */
    EmailAddress: EmailAddress;
    /**
     * The factors that should cause the email address to be added to the suppression list for your account.
     */
    Reason: SuppressionListReason;
  }
  export interface PutSuppressedDestinationResponse {
  }
  export type QueryErrorCode = "INTERNAL_FAILURE"|"ACCESS_DENIED"|string;
  export type QueryErrorMessage = string;
  export type QueryIdentifier = string;
  export interface RawMessage {
    /**
     * The raw email message. The message has to meet the following criteria:   The message has to contain a header and a body, separated by one blank line.   All of the required header fields must be present in the message.   Each part of a multipart MIME message must be formatted properly.   Attachments must be in a file format that the Amazon SES supports.   The entire message must be Base64 encoded.   If any of the MIME parts in your message contain content that is outside of the 7-bit ASCII character range, you should encode that content to ensure that recipients' email clients render the message properly.   The length of any single line of text in the message can't exceed 1,000 characters. This restriction is defined in RFC 5321.  
     */
    Data: RawMessageData;
  }
  export type RawMessageData = Buffer|Uint8Array|Blob|string;
  export type RblName = string;
  export interface Recommendation {
    /**
     * The resource affected by the recommendation, with values like arn:aws:ses:us-east-1:123456789012:identity/example.com.
     */
    ResourceArn?: AmazonResourceName;
    /**
     * The recommendation type, with values like DKIM, SPF, DMARC or BIMI.
     */
    Type?: RecommendationType;
    /**
     * The recommendation description / disambiguator - e.g. DKIM1 and DKIM2 are different recommendations about your DKIM setup.
     */
    Description?: RecommendationDescription;
    /**
     * The recommendation status, with values like OPEN or FIXED.
     */
    Status?: RecommendationStatus;
    /**
     * The first time this issue was encountered and the recommendation was generated.
     */
    CreatedTimestamp?: Timestamp;
    /**
     * The last time the recommendation was updated.
     */
    LastUpdatedTimestamp?: Timestamp;
    /**
     * The recommendation impact, with values like HIGH or LOW.
     */
    Impact?: RecommendationImpact;
  }
  export type RecommendationDescription = string;
  export type RecommendationImpact = "LOW"|"HIGH"|string;
  export type RecommendationStatus = "OPEN"|"FIXED"|string;
  export type RecommendationType = "DKIM"|"DMARC"|"SPF"|"BIMI"|string;
  export type RecommendationsList = Recommendation[];
  export type RenderedEmailTemplate = string;
  export interface ReplacementEmailContent {
    /**
     * The ReplacementTemplate associated with ReplacementEmailContent.
     */
    ReplacementTemplate?: ReplacementTemplate;
  }
  export interface ReplacementTemplate {
    /**
     * A list of replacement values to apply to the template. This parameter is a JSON object, typically consisting of key-value pairs in which the keys correspond to replacement tags in the email template.
     */
    ReplacementTemplateData?: EmailTemplateData;
  }
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
  export interface ReviewDetails {
    /**
     * The status of the latest review of your account. The status can be one of the following:    PENDING – We have received your appeal and are in the process of reviewing it.    GRANTED – Your appeal has been reviewed and your production access has been granted.    DENIED – Your appeal has been reviewed and your production access has been denied.    FAILED – An internal error occurred and we didn't receive your appeal. You can submit your appeal again.  
     */
    Status?: ReviewStatus;
    /**
     * The associated support center case ID (if any).
     */
    CaseId?: CaseId;
  }
  export type ReviewStatus = "PENDING"|"FAILED"|"GRANTED"|"DENIED"|string;
  export type S3Url = string;
  export type ScalingMode = "STANDARD"|"MANAGED"|string;
  export type Selector = string;
  export interface SendBulkEmailRequest {
    /**
     * The email address to use as the "From" address for the email. The address that you specify has to be verified.
     */
    FromEmailAddress?: EmailAddress;
    /**
     * This parameter is used only for sending authorization. It is the ARN of the identity that is associated with the sending authorization policy that permits you to use the email address specified in the FromEmailAddress parameter. For example, if the owner of example.com (which has ARN arn:aws:ses:us-east-1:123456789012:identity/example.com) attaches a policy to it that authorizes you to use sender@example.com, then you would specify the FromEmailAddressIdentityArn to be arn:aws:ses:us-east-1:123456789012:identity/example.com, and the FromEmailAddress to be sender@example.com. For more information about sending authorization, see the Amazon SES Developer Guide.
     */
    FromEmailAddressIdentityArn?: AmazonResourceName;
    /**
     * The "Reply-to" email addresses for the message. When the recipient replies to the message, each Reply-to address receives the reply.
     */
    ReplyToAddresses?: EmailAddressList;
    /**
     * The address that you want bounce and complaint notifications to be sent to.
     */
    FeedbackForwardingEmailAddress?: EmailAddress;
    /**
     * This parameter is used only for sending authorization. It is the ARN of the identity that is associated with the sending authorization policy that permits you to use the email address specified in the FeedbackForwardingEmailAddress parameter. For example, if the owner of example.com (which has ARN arn:aws:ses:us-east-1:123456789012:identity/example.com) attaches a policy to it that authorizes you to use feedback@example.com, then you would specify the FeedbackForwardingEmailAddressIdentityArn to be arn:aws:ses:us-east-1:123456789012:identity/example.com, and the FeedbackForwardingEmailAddress to be feedback@example.com. For more information about sending authorization, see the Amazon SES Developer Guide.
     */
    FeedbackForwardingEmailAddressIdentityArn?: AmazonResourceName;
    /**
     * A list of tags, in the form of name/value pairs, to apply to an email that you send using the SendEmail operation. Tags correspond to characteristics of the email that you define, so that you can publish email sending events.
     */
    DefaultEmailTags?: MessageTagList;
    /**
     * An object that contains the body of the message. You can specify a template message.
     */
    DefaultContent: BulkEmailContent;
    /**
     * The list of bulk email entry objects.
     */
    BulkEmailEntries: BulkEmailEntryList;
    /**
     * The name of the configuration set to use when sending the email.
     */
    ConfigurationSetName?: ConfigurationSetName;
  }
  export interface SendBulkEmailResponse {
    /**
     * One object per intended recipient. Check each response object and retry any messages with a failure status.
     */
    BulkEmailEntryResults: BulkEmailEntryResultList;
  }
  export interface SendCustomVerificationEmailRequest {
    /**
     * The email address to verify.
     */
    EmailAddress: EmailAddress;
    /**
     * The name of the custom verification email template to use when sending the verification email.
     */
    TemplateName: EmailTemplateName;
    /**
     * Name of a configuration set to use when sending the verification email.
     */
    ConfigurationSetName?: ConfigurationSetName;
  }
  export interface SendCustomVerificationEmailResponse {
    /**
     * The unique message identifier returned from the SendCustomVerificationEmail operation.
     */
    MessageId?: OutboundMessageId;
  }
  export interface SendEmailRequest {
    /**
     * The email address to use as the "From" address for the email. The address that you specify has to be verified. 
     */
    FromEmailAddress?: EmailAddress;
    /**
     * This parameter is used only for sending authorization. It is the ARN of the identity that is associated with the sending authorization policy that permits you to use the email address specified in the FromEmailAddress parameter. For example, if the owner of example.com (which has ARN arn:aws:ses:us-east-1:123456789012:identity/example.com) attaches a policy to it that authorizes you to use sender@example.com, then you would specify the FromEmailAddressIdentityArn to be arn:aws:ses:us-east-1:123456789012:identity/example.com, and the FromEmailAddress to be sender@example.com. For more information about sending authorization, see the Amazon SES Developer Guide. For Raw emails, the FromEmailAddressIdentityArn value overrides the X-SES-SOURCE-ARN and X-SES-FROM-ARN headers specified in raw email message content.
     */
    FromEmailAddressIdentityArn?: AmazonResourceName;
    /**
     * An object that contains the recipients of the email message.
     */
    Destination?: Destination;
    /**
     * The "Reply-to" email addresses for the message. When the recipient replies to the message, each Reply-to address receives the reply.
     */
    ReplyToAddresses?: EmailAddressList;
    /**
     * The address that you want bounce and complaint notifications to be sent to.
     */
    FeedbackForwardingEmailAddress?: EmailAddress;
    /**
     * This parameter is used only for sending authorization. It is the ARN of the identity that is associated with the sending authorization policy that permits you to use the email address specified in the FeedbackForwardingEmailAddress parameter. For example, if the owner of example.com (which has ARN arn:aws:ses:us-east-1:123456789012:identity/example.com) attaches a policy to it that authorizes you to use feedback@example.com, then you would specify the FeedbackForwardingEmailAddressIdentityArn to be arn:aws:ses:us-east-1:123456789012:identity/example.com, and the FeedbackForwardingEmailAddress to be feedback@example.com. For more information about sending authorization, see the Amazon SES Developer Guide.
     */
    FeedbackForwardingEmailAddressIdentityArn?: AmazonResourceName;
    /**
     * An object that contains the body of the message. You can send either a Simple message Raw message or a template Message.
     */
    Content: EmailContent;
    /**
     * A list of tags, in the form of name/value pairs, to apply to an email that you send using the SendEmail operation. Tags correspond to characteristics of the email that you define, so that you can publish email sending events. 
     */
    EmailTags?: MessageTagList;
    /**
     * The name of the configuration set to use when sending the email.
     */
    ConfigurationSetName?: ConfigurationSetName;
    /**
     * An object used to specify a list or topic to which an email belongs, which will be used when a contact chooses to unsubscribe.
     */
    ListManagementOptions?: ListManagementOptions;
  }
  export interface SendEmailResponse {
    /**
     * A unique identifier for the message that is generated when the message is accepted.  It's possible for Amazon SES to accept a message without sending it. This can happen when the message that you're trying to send has an attachment contains a virus, or when you send a templated email that contains invalid personalization content, for example. 
     */
    MessageId?: OutboundMessageId;
  }
  export interface SendQuota {
    /**
     * The maximum number of emails that you can send in the current Amazon Web Services Region over a 24-hour period. A value of -1 signifies an unlimited quota. (This value is also referred to as your sending quota.)
     */
    Max24HourSend?: Max24HourSend;
    /**
     * The maximum number of emails that you can send per second in the current Amazon Web Services Region. This value is also called your maximum sending rate or your maximum TPS (transactions per second) rate.
     */
    MaxSendRate?: MaxSendRate;
    /**
     * The number of emails sent from your Amazon SES account in the current Amazon Web Services Region over the past 24 hours.
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
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to publish email events to. For more information about Amazon SNS topics, see the Amazon SNS Developer Guide.
     */
    TopicArn: AmazonResourceName;
  }
  export type Subject = string;
  export type SubscriptionStatus = "OPT_IN"|"OPT_OUT"|string;
  export type SuccessRedirectionURL = string;
  export interface SuppressedDestination {
    /**
     * The email address that is on the suppression list for your account.
     */
    EmailAddress: EmailAddress;
    /**
     * The reason that the address was added to the suppression list for your account.
     */
    Reason: SuppressionListReason;
    /**
     * The date and time when the suppressed destination was last updated, shown in Unix time format.
     */
    LastUpdateTime: Timestamp;
    /**
     * An optional value that can contain additional information about the reasons that the address was added to the suppression list for your account.
     */
    Attributes?: SuppressedDestinationAttributes;
  }
  export interface SuppressedDestinationAttributes {
    /**
     * The unique identifier of the email message that caused the email address to be added to the suppression list for your account.
     */
    MessageId?: OutboundMessageId;
    /**
     * A unique identifier that's generated when an email address is added to the suppression list for your account.
     */
    FeedbackId?: FeedbackId;
  }
  export type SuppressedDestinationSummaries = SuppressedDestinationSummary[];
  export interface SuppressedDestinationSummary {
    /**
     * The email address that's on the suppression list for your account.
     */
    EmailAddress: EmailAddress;
    /**
     * The reason that the address was added to the suppression list for your account.
     */
    Reason: SuppressionListReason;
    /**
     * The date and time when the suppressed destination was last updated, shown in Unix time format.
     */
    LastUpdateTime: Timestamp;
  }
  export interface SuppressionAttributes {
    /**
     * A list that contains the reasons that email addresses will be automatically added to the suppression list for your account. This list can contain any or all of the following:    COMPLAINT – Amazon SES adds an email address to the suppression list for your account when a message sent to that address results in a complaint.    BOUNCE – Amazon SES adds an email address to the suppression list for your account when a message sent to that address results in a hard bounce.  
     */
    SuppressedReasons?: SuppressionListReasons;
  }
  export interface SuppressionListDestination {
    /**
     * The type of action to perform on the address. The following are possible values:   PUT: add the addresses to the suppression list. If the record already exists, it will override it with the new value.   DELETE: remove the addresses from the suppression list.  
     */
    SuppressionListImportAction: SuppressionListImportAction;
  }
  export type SuppressionListImportAction = "DELETE"|"PUT"|string;
  export type SuppressionListReason = "BOUNCE"|"COMPLAINT"|string;
  export type SuppressionListReasons = SuppressionListReason[];
  export interface SuppressionOptions {
    /**
     * A list that contains the reasons that email addresses are automatically added to the suppression list for your account. This list can contain any or all of the following:    COMPLAINT – Amazon SES adds an email address to the suppression list for your account when a message sent to that address results in a complaint.    BOUNCE – Amazon SES adds an email address to the suppression list for your account when a message sent to that address results in a hard bounce.  
     */
    SuppressedReasons?: SuppressionListReasons;
  }
  export interface Tag {
    /**
     * One part of a key-value pair that defines a tag. The maximum length of a tag key is 128 characters. The minimum length is 1 character.
     */
    Key: TagKey;
    /**
     * The optional part of a key-value pair that defines a tag. The maximum length of a tag value is 256 characters. The minimum length is 0 characters. If you don't want a resource to have a specific tag value, don't specify a value for this parameter. If you don't specify a value, Amazon SES sets the value to an empty string.
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
     * The name of the template. You will refer to this name when you send email using the SendTemplatedEmail or SendBulkTemplatedEmail operations. 
     */
    TemplateName?: EmailTemplateName;
    /**
     * The Amazon Resource Name (ARN) of the template.
     */
    TemplateArn?: AmazonResourceName;
    /**
     * An object that defines the values to use for message variables in the template. This object is a set of key-value pairs. Each key defines a message variable in the template. The corresponding value defines the value to use for that variable.
     */
    TemplateData?: EmailTemplateData;
  }
  export type TemplateContent = string;
  export interface TestRenderEmailTemplateRequest {
    /**
     * The name of the template.
     */
    TemplateName: EmailTemplateName;
    /**
     * A list of replacement values to apply to the template. This parameter is a JSON object, typically consisting of key-value pairs in which the keys correspond to replacement tags in the email template.
     */
    TemplateData: EmailTemplateData;
  }
  export interface TestRenderEmailTemplateResponse {
    /**
     * The complete MIME message rendered by applying the data in the TemplateData parameter to the template specified in the TemplateName parameter.
     */
    RenderedTemplate: RenderedEmailTemplate;
  }
  export type Timestamp = Date;
  export type TimestampList = Timestamp[];
  export type TlsPolicy = "REQUIRE"|"OPTIONAL"|string;
  export interface Topic {
    /**
     * The name of the topic.
     */
    TopicName: TopicName;
    /**
     * The name of the topic the contact will see.
     */
    DisplayName: DisplayName;
    /**
     * A description of what the topic is about, which the contact will see.
     */
    Description?: Description;
    /**
     * The default subscription status to be applied to a contact if the contact has not noted their preference for subscribing to a topic.
     */
    DefaultSubscriptionStatus: SubscriptionStatus;
  }
  export interface TopicFilter {
    /**
     * The name of a topic on which you wish to apply the filter.
     */
    TopicName?: TopicName;
    /**
     * Notes that the default subscription status should be applied to a contact because the contact has not noted their preference for subscribing to a topic.
     */
    UseDefaultIfPreferenceUnavailable?: UseDefaultIfPreferenceUnavailable;
  }
  export type TopicName = string;
  export interface TopicPreference {
    /**
     * The name of the topic.
     */
    TopicName: TopicName;
    /**
     * The contact's subscription status to a topic which is either OPT_IN or OPT_OUT.
     */
    SubscriptionStatus: SubscriptionStatus;
  }
  export type TopicPreferenceList = TopicPreference[];
  export type Topics = Topic[];
  export interface TrackingOptions {
    /**
     * The domain to use for tracking open and click events.
     */
    CustomRedirectDomain: CustomRedirectDomain;
  }
  export type UnsubscribeAll = boolean;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to remove one or more tags from.
     */
    ResourceArn: AmazonResourceName;
    /**
     * The tags (tag keys) that you want to remove from the resource. When you specify a tag key, the action removes both that key and its associated tag value. To remove more than one tag from the resource, append the TagKeys parameter and argument for each additional tag to remove, separated by an ampersand. For example: /v2/email/tags?ResourceArn=ResourceArn&amp;TagKeys=Key1&amp;TagKeys=Key2 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateConfigurationSetEventDestinationRequest {
    /**
     * The name of the configuration set that contains the event destination to modify.
     */
    ConfigurationSetName: ConfigurationSetName;
    /**
     * The name of the event destination.
     */
    EventDestinationName: EventDestinationName;
    /**
     * An object that defines the event destination.
     */
    EventDestination: EventDestinationDefinition;
  }
  export interface UpdateConfigurationSetEventDestinationResponse {
  }
  export interface UpdateContactListRequest {
    /**
     * The name of the contact list.
     */
    ContactListName: ContactListName;
    /**
     * An interest group, theme, or label within a list. A contact list can have multiple topics.
     */
    Topics?: Topics;
    /**
     * A description of what the contact list is about.
     */
    Description?: Description;
  }
  export interface UpdateContactListResponse {
  }
  export interface UpdateContactRequest {
    /**
     * The name of the contact list.
     */
    ContactListName: ContactListName;
    /**
     * The contact's email address.
     */
    EmailAddress: EmailAddress;
    /**
     * The contact's preference for being opted-in to or opted-out of a topic.
     */
    TopicPreferences?: TopicPreferenceList;
    /**
     * A boolean value status noting if the contact is unsubscribed from all contact list topics.
     */
    UnsubscribeAll?: UnsubscribeAll;
    /**
     * The attribute data attached to a contact.
     */
    AttributesData?: AttributesData;
  }
  export interface UpdateContactResponse {
  }
  export interface UpdateCustomVerificationEmailTemplateRequest {
    /**
     * The name of the custom verification email template that you want to update.
     */
    TemplateName: EmailTemplateName;
    /**
     * The email address that the custom verification email is sent from.
     */
    FromEmailAddress: EmailAddress;
    /**
     * The subject line of the custom verification email.
     */
    TemplateSubject: EmailTemplateSubject;
    /**
     * The content of the custom verification email. The total size of the email must be less than 10 MB. The message body may contain HTML, with some limitations. For more information, see Custom verification email frequently asked questions in the Amazon SES Developer Guide.
     */
    TemplateContent: TemplateContent;
    /**
     * The URL that the recipient of the verification email is sent to if his or her address is successfully verified.
     */
    SuccessRedirectionURL: SuccessRedirectionURL;
    /**
     * The URL that the recipient of the verification email is sent to if his or her address is not successfully verified.
     */
    FailureRedirectionURL: FailureRedirectionURL;
  }
  export interface UpdateCustomVerificationEmailTemplateResponse {
  }
  export interface UpdateEmailIdentityPolicyRequest {
    /**
     * The email identity.
     */
    EmailIdentity: Identity;
    /**
     * The name of the policy. The policy name cannot exceed 64 characters and can only include alphanumeric characters, dashes, and underscores.
     */
    PolicyName: PolicyName;
    /**
     * The text of the policy in JSON format. The policy cannot exceed 4 KB.  For information about the syntax of sending authorization policies, see the Amazon SES Developer Guide.
     */
    Policy: Policy;
  }
  export interface UpdateEmailIdentityPolicyResponse {
  }
  export interface UpdateEmailTemplateRequest {
    /**
     * The name of the template.
     */
    TemplateName: EmailTemplateName;
    /**
     * The content of the email template, composed of a subject line, an HTML part, and a text-only part.
     */
    TemplateContent: EmailTemplateContent;
  }
  export interface UpdateEmailTemplateResponse {
  }
  export type UseCaseDescription = string;
  export type UseDefaultIfPreferenceUnavailable = boolean;
  export interface VdmAttributes {
    /**
     * Specifies the status of your VDM configuration. Can be one of the following:    ENABLED – Amazon SES enables VDM for your account.    DISABLED – Amazon SES disables VDM for your account.  
     */
    VdmEnabled: FeatureStatus;
    /**
     * Specifies additional settings for your VDM configuration as applicable to the Dashboard.
     */
    DashboardAttributes?: DashboardAttributes;
    /**
     * Specifies additional settings for your VDM configuration as applicable to the Guardian.
     */
    GuardianAttributes?: GuardianAttributes;
  }
  export interface VdmOptions {
    /**
     * Specifies additional settings for your VDM configuration as applicable to the Dashboard.
     */
    DashboardOptions?: DashboardOptions;
    /**
     * Specifies additional settings for your VDM configuration as applicable to the Guardian.
     */
    GuardianOptions?: GuardianOptions;
  }
  export type VerificationStatus = "PENDING"|"SUCCESS"|"FAILED"|"TEMPORARY_FAILURE"|"NOT_STARTED"|string;
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
  export type WebsiteURL = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-09-27"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SESV2 client.
   */
  export import Types = SESV2;
}
export = SESV2;
