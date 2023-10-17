import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SecurityLake extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SecurityLake.Types.ClientConfiguration)
  config: Config & SecurityLake.Types.ClientConfiguration;
  /**
   * Adds a natively supported Amazon Web Service as an Amazon Security Lake source. Enables source types for member accounts in required Amazon Web Services Regions, based on the parameters you specify. You can choose any source type in any Region for either accounts that are part of a trusted organization or standalone accounts. Once you add an Amazon Web Service as a source, Security Lake starts collecting logs and events from it. You can use this API only to enable natively supported Amazon Web Services as a source. Use CreateCustomLogSource to enable data collection from a custom source.
   */
  createAwsLogSource(params: SecurityLake.Types.CreateAwsLogSourceRequest, callback?: (err: AWSError, data: SecurityLake.Types.CreateAwsLogSourceResponse) => void): Request<SecurityLake.Types.CreateAwsLogSourceResponse, AWSError>;
  /**
   * Adds a natively supported Amazon Web Service as an Amazon Security Lake source. Enables source types for member accounts in required Amazon Web Services Regions, based on the parameters you specify. You can choose any source type in any Region for either accounts that are part of a trusted organization or standalone accounts. Once you add an Amazon Web Service as a source, Security Lake starts collecting logs and events from it. You can use this API only to enable natively supported Amazon Web Services as a source. Use CreateCustomLogSource to enable data collection from a custom source.
   */
  createAwsLogSource(callback?: (err: AWSError, data: SecurityLake.Types.CreateAwsLogSourceResponse) => void): Request<SecurityLake.Types.CreateAwsLogSourceResponse, AWSError>;
  /**
   * Adds a third-party custom source in Amazon Security Lake, from the Amazon Web Services Region where you want to create a custom source. Security Lake can collect logs and events from third-party custom sources. After creating the appropriate IAM role to invoke Glue crawler, use this API to add a custom source name in Security Lake. This operation creates a partition in the Amazon S3 bucket for Security Lake as the target location for log files from the custom source. In addition, this operation also creates an associated Glue table and an Glue crawler.
   */
  createCustomLogSource(params: SecurityLake.Types.CreateCustomLogSourceRequest, callback?: (err: AWSError, data: SecurityLake.Types.CreateCustomLogSourceResponse) => void): Request<SecurityLake.Types.CreateCustomLogSourceResponse, AWSError>;
  /**
   * Adds a third-party custom source in Amazon Security Lake, from the Amazon Web Services Region where you want to create a custom source. Security Lake can collect logs and events from third-party custom sources. After creating the appropriate IAM role to invoke Glue crawler, use this API to add a custom source name in Security Lake. This operation creates a partition in the Amazon S3 bucket for Security Lake as the target location for log files from the custom source. In addition, this operation also creates an associated Glue table and an Glue crawler.
   */
  createCustomLogSource(callback?: (err: AWSError, data: SecurityLake.Types.CreateCustomLogSourceResponse) => void): Request<SecurityLake.Types.CreateCustomLogSourceResponse, AWSError>;
  /**
   * Initializes an Amazon Security Lake instance with the provided (or default) configuration. You can enable Security Lake in Amazon Web Services Regions with customized settings before enabling log collection in Regions. To specify particular Regions, configure these Regions using the configurations parameter. If you have already enabled Security Lake in a Region when you call this command, the command will update the Region if you provide new configuration parameters. If you have not already enabled Security Lake in the Region when you call this API, it will set up the data lake in the Region with the specified configurations. When you enable Security Lake, it starts ingesting security data after the CreateAwsLogSource call. This includes ingesting security data from sources, storing data, and making data accessible to subscribers. Security Lake also enables all the existing settings and resources that it stores or maintains for your Amazon Web Services account in the current Region, including security log and event data. For more information, see the Amazon Security Lake User Guide.
   */
  createDataLake(params: SecurityLake.Types.CreateDataLakeRequest, callback?: (err: AWSError, data: SecurityLake.Types.CreateDataLakeResponse) => void): Request<SecurityLake.Types.CreateDataLakeResponse, AWSError>;
  /**
   * Initializes an Amazon Security Lake instance with the provided (or default) configuration. You can enable Security Lake in Amazon Web Services Regions with customized settings before enabling log collection in Regions. To specify particular Regions, configure these Regions using the configurations parameter. If you have already enabled Security Lake in a Region when you call this command, the command will update the Region if you provide new configuration parameters. If you have not already enabled Security Lake in the Region when you call this API, it will set up the data lake in the Region with the specified configurations. When you enable Security Lake, it starts ingesting security data after the CreateAwsLogSource call. This includes ingesting security data from sources, storing data, and making data accessible to subscribers. Security Lake also enables all the existing settings and resources that it stores or maintains for your Amazon Web Services account in the current Region, including security log and event data. For more information, see the Amazon Security Lake User Guide.
   */
  createDataLake(callback?: (err: AWSError, data: SecurityLake.Types.CreateDataLakeResponse) => void): Request<SecurityLake.Types.CreateDataLakeResponse, AWSError>;
  /**
   * Creates the specified notification subscription in Amazon Security Lake for the organization you specify.
   */
  createDataLakeExceptionSubscription(params: SecurityLake.Types.CreateDataLakeExceptionSubscriptionRequest, callback?: (err: AWSError, data: SecurityLake.Types.CreateDataLakeExceptionSubscriptionResponse) => void): Request<SecurityLake.Types.CreateDataLakeExceptionSubscriptionResponse, AWSError>;
  /**
   * Creates the specified notification subscription in Amazon Security Lake for the organization you specify.
   */
  createDataLakeExceptionSubscription(callback?: (err: AWSError, data: SecurityLake.Types.CreateDataLakeExceptionSubscriptionResponse) => void): Request<SecurityLake.Types.CreateDataLakeExceptionSubscriptionResponse, AWSError>;
  /**
   * Automatically enables Amazon Security Lake for new member accounts in your organization. Security Lake is not automatically enabled for any existing member accounts in your organization.
   */
  createDataLakeOrganizationConfiguration(params: SecurityLake.Types.CreateDataLakeOrganizationConfigurationRequest, callback?: (err: AWSError, data: SecurityLake.Types.CreateDataLakeOrganizationConfigurationResponse) => void): Request<SecurityLake.Types.CreateDataLakeOrganizationConfigurationResponse, AWSError>;
  /**
   * Automatically enables Amazon Security Lake for new member accounts in your organization. Security Lake is not automatically enabled for any existing member accounts in your organization.
   */
  createDataLakeOrganizationConfiguration(callback?: (err: AWSError, data: SecurityLake.Types.CreateDataLakeOrganizationConfigurationResponse) => void): Request<SecurityLake.Types.CreateDataLakeOrganizationConfigurationResponse, AWSError>;
  /**
   * Creates a subscription permission for accounts that are already enabled in Amazon Security Lake. You can create a subscriber with access to data in the current Amazon Web Services Region.
   */
  createSubscriber(params: SecurityLake.Types.CreateSubscriberRequest, callback?: (err: AWSError, data: SecurityLake.Types.CreateSubscriberResponse) => void): Request<SecurityLake.Types.CreateSubscriberResponse, AWSError>;
  /**
   * Creates a subscription permission for accounts that are already enabled in Amazon Security Lake. You can create a subscriber with access to data in the current Amazon Web Services Region.
   */
  createSubscriber(callback?: (err: AWSError, data: SecurityLake.Types.CreateSubscriberResponse) => void): Request<SecurityLake.Types.CreateSubscriberResponse, AWSError>;
  /**
   * Notifies the subscriber when new data is written to the data lake for the sources that the subscriber consumes in Security Lake. You can create only one subscriber notification per subscriber.
   */
  createSubscriberNotification(params: SecurityLake.Types.CreateSubscriberNotificationRequest, callback?: (err: AWSError, data: SecurityLake.Types.CreateSubscriberNotificationResponse) => void): Request<SecurityLake.Types.CreateSubscriberNotificationResponse, AWSError>;
  /**
   * Notifies the subscriber when new data is written to the data lake for the sources that the subscriber consumes in Security Lake. You can create only one subscriber notification per subscriber.
   */
  createSubscriberNotification(callback?: (err: AWSError, data: SecurityLake.Types.CreateSubscriberNotificationResponse) => void): Request<SecurityLake.Types.CreateSubscriberNotificationResponse, AWSError>;
  /**
   * Removes a natively supported Amazon Web Service as an Amazon Security Lake source. You can remove a source for one or more Regions. When you remove the source, Security Lake stops collecting data from that source in the specified Regions and accounts, and subscribers can no longer consume new data from the source. However, subscribers can still consume data that Security Lake collected from the source before removal. You can choose any source type in any Amazon Web Services Region for either accounts that are part of a trusted organization or standalone accounts. 
   */
  deleteAwsLogSource(params: SecurityLake.Types.DeleteAwsLogSourceRequest, callback?: (err: AWSError, data: SecurityLake.Types.DeleteAwsLogSourceResponse) => void): Request<SecurityLake.Types.DeleteAwsLogSourceResponse, AWSError>;
  /**
   * Removes a natively supported Amazon Web Service as an Amazon Security Lake source. You can remove a source for one or more Regions. When you remove the source, Security Lake stops collecting data from that source in the specified Regions and accounts, and subscribers can no longer consume new data from the source. However, subscribers can still consume data that Security Lake collected from the source before removal. You can choose any source type in any Amazon Web Services Region for either accounts that are part of a trusted organization or standalone accounts. 
   */
  deleteAwsLogSource(callback?: (err: AWSError, data: SecurityLake.Types.DeleteAwsLogSourceResponse) => void): Request<SecurityLake.Types.DeleteAwsLogSourceResponse, AWSError>;
  /**
   * Removes a custom log source from Amazon Security Lake, to stop sending data from the custom source to Security Lake.
   */
  deleteCustomLogSource(params: SecurityLake.Types.DeleteCustomLogSourceRequest, callback?: (err: AWSError, data: SecurityLake.Types.DeleteCustomLogSourceResponse) => void): Request<SecurityLake.Types.DeleteCustomLogSourceResponse, AWSError>;
  /**
   * Removes a custom log source from Amazon Security Lake, to stop sending data from the custom source to Security Lake.
   */
  deleteCustomLogSource(callback?: (err: AWSError, data: SecurityLake.Types.DeleteCustomLogSourceResponse) => void): Request<SecurityLake.Types.DeleteCustomLogSourceResponse, AWSError>;
  /**
   * When you disable Amazon Security Lake from your account, Security Lake is disabled in all Amazon Web Services Regions and it stops collecting data from your sources. Also, this API automatically takes steps to remove the account from Security Lake. However, Security Lake retains all of your existing settings and the resources that it created in your Amazon Web Services account in the current Amazon Web Services Region. The DeleteDataLake operation does not delete the data that is stored in your Amazon S3 bucket, which is owned by your Amazon Web Services account. For more information, see the Amazon Security Lake User Guide.
   */
  deleteDataLake(params: SecurityLake.Types.DeleteDataLakeRequest, callback?: (err: AWSError, data: SecurityLake.Types.DeleteDataLakeResponse) => void): Request<SecurityLake.Types.DeleteDataLakeResponse, AWSError>;
  /**
   * When you disable Amazon Security Lake from your account, Security Lake is disabled in all Amazon Web Services Regions and it stops collecting data from your sources. Also, this API automatically takes steps to remove the account from Security Lake. However, Security Lake retains all of your existing settings and the resources that it created in your Amazon Web Services account in the current Amazon Web Services Region. The DeleteDataLake operation does not delete the data that is stored in your Amazon S3 bucket, which is owned by your Amazon Web Services account. For more information, see the Amazon Security Lake User Guide.
   */
  deleteDataLake(callback?: (err: AWSError, data: SecurityLake.Types.DeleteDataLakeResponse) => void): Request<SecurityLake.Types.DeleteDataLakeResponse, AWSError>;
  /**
   * Deletes the specified notification subscription in Amazon Security Lake for the organization you specify.
   */
  deleteDataLakeExceptionSubscription(params: SecurityLake.Types.DeleteDataLakeExceptionSubscriptionRequest, callback?: (err: AWSError, data: SecurityLake.Types.DeleteDataLakeExceptionSubscriptionResponse) => void): Request<SecurityLake.Types.DeleteDataLakeExceptionSubscriptionResponse, AWSError>;
  /**
   * Deletes the specified notification subscription in Amazon Security Lake for the organization you specify.
   */
  deleteDataLakeExceptionSubscription(callback?: (err: AWSError, data: SecurityLake.Types.DeleteDataLakeExceptionSubscriptionResponse) => void): Request<SecurityLake.Types.DeleteDataLakeExceptionSubscriptionResponse, AWSError>;
  /**
   * Turns off automatic enablement of Amazon Security Lake for member accounts that are added to an organization in Organizations. Only the delegated Security Lake administrator for an organization can perform this operation. If the delegated Security Lake administrator performs this operation, new member accounts won't automatically contribute data to the data lake.
   */
  deleteDataLakeOrganizationConfiguration(params: SecurityLake.Types.DeleteDataLakeOrganizationConfigurationRequest, callback?: (err: AWSError, data: SecurityLake.Types.DeleteDataLakeOrganizationConfigurationResponse) => void): Request<SecurityLake.Types.DeleteDataLakeOrganizationConfigurationResponse, AWSError>;
  /**
   * Turns off automatic enablement of Amazon Security Lake for member accounts that are added to an organization in Organizations. Only the delegated Security Lake administrator for an organization can perform this operation. If the delegated Security Lake administrator performs this operation, new member accounts won't automatically contribute data to the data lake.
   */
  deleteDataLakeOrganizationConfiguration(callback?: (err: AWSError, data: SecurityLake.Types.DeleteDataLakeOrganizationConfigurationResponse) => void): Request<SecurityLake.Types.DeleteDataLakeOrganizationConfigurationResponse, AWSError>;
  /**
   * Deletes the subscription permission and all notification settings for accounts that are already enabled in Amazon Security Lake. When you run DeleteSubscriber, the subscriber will no longer consume data from Security Lake and the subscriber is removed. This operation deletes the subscriber and removes access to data in the current Amazon Web Services Region.
   */
  deleteSubscriber(params: SecurityLake.Types.DeleteSubscriberRequest, callback?: (err: AWSError, data: SecurityLake.Types.DeleteSubscriberResponse) => void): Request<SecurityLake.Types.DeleteSubscriberResponse, AWSError>;
  /**
   * Deletes the subscription permission and all notification settings for accounts that are already enabled in Amazon Security Lake. When you run DeleteSubscriber, the subscriber will no longer consume data from Security Lake and the subscriber is removed. This operation deletes the subscriber and removes access to data in the current Amazon Web Services Region.
   */
  deleteSubscriber(callback?: (err: AWSError, data: SecurityLake.Types.DeleteSubscriberResponse) => void): Request<SecurityLake.Types.DeleteSubscriberResponse, AWSError>;
  /**
   * Deletes the specified notification subscription in Amazon Security Lake for the organization you specify.
   */
  deleteSubscriberNotification(params: SecurityLake.Types.DeleteSubscriberNotificationRequest, callback?: (err: AWSError, data: SecurityLake.Types.DeleteSubscriberNotificationResponse) => void): Request<SecurityLake.Types.DeleteSubscriberNotificationResponse, AWSError>;
  /**
   * Deletes the specified notification subscription in Amazon Security Lake for the organization you specify.
   */
  deleteSubscriberNotification(callback?: (err: AWSError, data: SecurityLake.Types.DeleteSubscriberNotificationResponse) => void): Request<SecurityLake.Types.DeleteSubscriberNotificationResponse, AWSError>;
  /**
   * Deletes the Amazon Security Lake delegated administrator account for the organization. This API can only be called by the organization management account. The organization management account cannot be the delegated administrator account.
   */
  deregisterDataLakeDelegatedAdministrator(params: SecurityLake.Types.DeregisterDataLakeDelegatedAdministratorRequest, callback?: (err: AWSError, data: SecurityLake.Types.DeregisterDataLakeDelegatedAdministratorResponse) => void): Request<SecurityLake.Types.DeregisterDataLakeDelegatedAdministratorResponse, AWSError>;
  /**
   * Deletes the Amazon Security Lake delegated administrator account for the organization. This API can only be called by the organization management account. The organization management account cannot be the delegated administrator account.
   */
  deregisterDataLakeDelegatedAdministrator(callback?: (err: AWSError, data: SecurityLake.Types.DeregisterDataLakeDelegatedAdministratorResponse) => void): Request<SecurityLake.Types.DeregisterDataLakeDelegatedAdministratorResponse, AWSError>;
  /**
   * Retrieves the details of exception notifications for the account in Amazon Security Lake.
   */
  getDataLakeExceptionSubscription(params: SecurityLake.Types.GetDataLakeExceptionSubscriptionRequest, callback?: (err: AWSError, data: SecurityLake.Types.GetDataLakeExceptionSubscriptionResponse) => void): Request<SecurityLake.Types.GetDataLakeExceptionSubscriptionResponse, AWSError>;
  /**
   * Retrieves the details of exception notifications for the account in Amazon Security Lake.
   */
  getDataLakeExceptionSubscription(callback?: (err: AWSError, data: SecurityLake.Types.GetDataLakeExceptionSubscriptionResponse) => void): Request<SecurityLake.Types.GetDataLakeExceptionSubscriptionResponse, AWSError>;
  /**
   * Retrieves the configuration that will be automatically set up for accounts added to the organization after the organization has onboarded to Amazon Security Lake. This API does not take input parameters.
   */
  getDataLakeOrganizationConfiguration(params: SecurityLake.Types.GetDataLakeOrganizationConfigurationRequest, callback?: (err: AWSError, data: SecurityLake.Types.GetDataLakeOrganizationConfigurationResponse) => void): Request<SecurityLake.Types.GetDataLakeOrganizationConfigurationResponse, AWSError>;
  /**
   * Retrieves the configuration that will be automatically set up for accounts added to the organization after the organization has onboarded to Amazon Security Lake. This API does not take input parameters.
   */
  getDataLakeOrganizationConfiguration(callback?: (err: AWSError, data: SecurityLake.Types.GetDataLakeOrganizationConfigurationResponse) => void): Request<SecurityLake.Types.GetDataLakeOrganizationConfigurationResponse, AWSError>;
  /**
   * Retrieves a snapshot of the current Region, including whether Amazon Security Lake is enabled for those accounts and which sources Security Lake is collecting data from.
   */
  getDataLakeSources(params: SecurityLake.Types.GetDataLakeSourcesRequest, callback?: (err: AWSError, data: SecurityLake.Types.GetDataLakeSourcesResponse) => void): Request<SecurityLake.Types.GetDataLakeSourcesResponse, AWSError>;
  /**
   * Retrieves a snapshot of the current Region, including whether Amazon Security Lake is enabled for those accounts and which sources Security Lake is collecting data from.
   */
  getDataLakeSources(callback?: (err: AWSError, data: SecurityLake.Types.GetDataLakeSourcesResponse) => void): Request<SecurityLake.Types.GetDataLakeSourcesResponse, AWSError>;
  /**
   * Retrieves the subscription information for the specified subscription ID. You can get information about a specific subscriber.
   */
  getSubscriber(params: SecurityLake.Types.GetSubscriberRequest, callback?: (err: AWSError, data: SecurityLake.Types.GetSubscriberResponse) => void): Request<SecurityLake.Types.GetSubscriberResponse, AWSError>;
  /**
   * Retrieves the subscription information for the specified subscription ID. You can get information about a specific subscriber.
   */
  getSubscriber(callback?: (err: AWSError, data: SecurityLake.Types.GetSubscriberResponse) => void): Request<SecurityLake.Types.GetSubscriberResponse, AWSError>;
  /**
   * Lists the Amazon Security Lake exceptions that you can use to find the source of problems and fix them.
   */
  listDataLakeExceptions(params: SecurityLake.Types.ListDataLakeExceptionsRequest, callback?: (err: AWSError, data: SecurityLake.Types.ListDataLakeExceptionsResponse) => void): Request<SecurityLake.Types.ListDataLakeExceptionsResponse, AWSError>;
  /**
   * Lists the Amazon Security Lake exceptions that you can use to find the source of problems and fix them.
   */
  listDataLakeExceptions(callback?: (err: AWSError, data: SecurityLake.Types.ListDataLakeExceptionsResponse) => void): Request<SecurityLake.Types.ListDataLakeExceptionsResponse, AWSError>;
  /**
   * Retrieves the Amazon Security Lake configuration object for the specified Amazon Web Services Regions. You can use this operation to determine whether Security Lake is enabled for a Region.
   */
  listDataLakes(params: SecurityLake.Types.ListDataLakesRequest, callback?: (err: AWSError, data: SecurityLake.Types.ListDataLakesResponse) => void): Request<SecurityLake.Types.ListDataLakesResponse, AWSError>;
  /**
   * Retrieves the Amazon Security Lake configuration object for the specified Amazon Web Services Regions. You can use this operation to determine whether Security Lake is enabled for a Region.
   */
  listDataLakes(callback?: (err: AWSError, data: SecurityLake.Types.ListDataLakesResponse) => void): Request<SecurityLake.Types.ListDataLakesResponse, AWSError>;
  /**
   * Retrieves the log sources in the current Amazon Web Services Region.
   */
  listLogSources(params: SecurityLake.Types.ListLogSourcesRequest, callback?: (err: AWSError, data: SecurityLake.Types.ListLogSourcesResponse) => void): Request<SecurityLake.Types.ListLogSourcesResponse, AWSError>;
  /**
   * Retrieves the log sources in the current Amazon Web Services Region.
   */
  listLogSources(callback?: (err: AWSError, data: SecurityLake.Types.ListLogSourcesResponse) => void): Request<SecurityLake.Types.ListLogSourcesResponse, AWSError>;
  /**
   * List all subscribers for the specific Amazon Security Lake account ID. You can retrieve a list of subscriptions associated with a specific organization or Amazon Web Services account.
   */
  listSubscribers(params: SecurityLake.Types.ListSubscribersRequest, callback?: (err: AWSError, data: SecurityLake.Types.ListSubscribersResponse) => void): Request<SecurityLake.Types.ListSubscribersResponse, AWSError>;
  /**
   * List all subscribers for the specific Amazon Security Lake account ID. You can retrieve a list of subscriptions associated with a specific organization or Amazon Web Services account.
   */
  listSubscribers(callback?: (err: AWSError, data: SecurityLake.Types.ListSubscribersResponse) => void): Request<SecurityLake.Types.ListSubscribersResponse, AWSError>;
  /**
   * Retrieves the tags (keys and values) that are associated with an Amazon Security Lake resource: a subscriber, or the data lake configuration for your Amazon Web Services account in a particular Amazon Web Services Region.
   */
  listTagsForResource(params: SecurityLake.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: SecurityLake.Types.ListTagsForResourceResponse) => void): Request<SecurityLake.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves the tags (keys and values) that are associated with an Amazon Security Lake resource: a subscriber, or the data lake configuration for your Amazon Web Services account in a particular Amazon Web Services Region.
   */
  listTagsForResource(callback?: (err: AWSError, data: SecurityLake.Types.ListTagsForResourceResponse) => void): Request<SecurityLake.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Designates the Amazon Security Lake delegated administrator account for the organization. This API can only be called by the organization management account. The organization management account cannot be the delegated administrator account.
   */
  registerDataLakeDelegatedAdministrator(params: SecurityLake.Types.RegisterDataLakeDelegatedAdministratorRequest, callback?: (err: AWSError, data: SecurityLake.Types.RegisterDataLakeDelegatedAdministratorResponse) => void): Request<SecurityLake.Types.RegisterDataLakeDelegatedAdministratorResponse, AWSError>;
  /**
   * Designates the Amazon Security Lake delegated administrator account for the organization. This API can only be called by the organization management account. The organization management account cannot be the delegated administrator account.
   */
  registerDataLakeDelegatedAdministrator(callback?: (err: AWSError, data: SecurityLake.Types.RegisterDataLakeDelegatedAdministratorResponse) => void): Request<SecurityLake.Types.RegisterDataLakeDelegatedAdministratorResponse, AWSError>;
  /**
   * Adds or updates one or more tags that are associated with an Amazon Security Lake resource: a subscriber, or the data lake configuration for your Amazon Web Services account in a particular Amazon Web Services Region. A tag is a label that you can define and associate with Amazon Web Services resources. Each tag consists of a required tag key and an associated tag value. A tag key is a general label that acts as a category for a more specific tag value. A tag value acts as a descriptor for a tag key. Tags can help you identify, categorize, and manage resources in different ways, such as by owner, environment, or other criteria. For more information, see Tagging Amazon Security Lake resources in the Amazon Security Lake User Guide.
   */
  tagResource(params: SecurityLake.Types.TagResourceRequest, callback?: (err: AWSError, data: SecurityLake.Types.TagResourceResponse) => void): Request<SecurityLake.Types.TagResourceResponse, AWSError>;
  /**
   * Adds or updates one or more tags that are associated with an Amazon Security Lake resource: a subscriber, or the data lake configuration for your Amazon Web Services account in a particular Amazon Web Services Region. A tag is a label that you can define and associate with Amazon Web Services resources. Each tag consists of a required tag key and an associated tag value. A tag key is a general label that acts as a category for a more specific tag value. A tag value acts as a descriptor for a tag key. Tags can help you identify, categorize, and manage resources in different ways, such as by owner, environment, or other criteria. For more information, see Tagging Amazon Security Lake resources in the Amazon Security Lake User Guide.
   */
  tagResource(callback?: (err: AWSError, data: SecurityLake.Types.TagResourceResponse) => void): Request<SecurityLake.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags (keys and values) from an Amazon Security Lake resource: a subscriber, or the data lake configuration for your Amazon Web Services account in a particular Amazon Web Services Region.
   */
  untagResource(params: SecurityLake.Types.UntagResourceRequest, callback?: (err: AWSError, data: SecurityLake.Types.UntagResourceResponse) => void): Request<SecurityLake.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags (keys and values) from an Amazon Security Lake resource: a subscriber, or the data lake configuration for your Amazon Web Services account in a particular Amazon Web Services Region.
   */
  untagResource(callback?: (err: AWSError, data: SecurityLake.Types.UntagResourceResponse) => void): Request<SecurityLake.Types.UntagResourceResponse, AWSError>;
  /**
   * Specifies where to store your security data and for how long. You can add a rollup Region to consolidate data from multiple Amazon Web Services Regions.
   */
  updateDataLake(params: SecurityLake.Types.UpdateDataLakeRequest, callback?: (err: AWSError, data: SecurityLake.Types.UpdateDataLakeResponse) => void): Request<SecurityLake.Types.UpdateDataLakeResponse, AWSError>;
  /**
   * Specifies where to store your security data and for how long. You can add a rollup Region to consolidate data from multiple Amazon Web Services Regions.
   */
  updateDataLake(callback?: (err: AWSError, data: SecurityLake.Types.UpdateDataLakeResponse) => void): Request<SecurityLake.Types.UpdateDataLakeResponse, AWSError>;
  /**
   * Updates the specified notification subscription in Amazon Security Lake for the organization you specify.
   */
  updateDataLakeExceptionSubscription(params: SecurityLake.Types.UpdateDataLakeExceptionSubscriptionRequest, callback?: (err: AWSError, data: SecurityLake.Types.UpdateDataLakeExceptionSubscriptionResponse) => void): Request<SecurityLake.Types.UpdateDataLakeExceptionSubscriptionResponse, AWSError>;
  /**
   * Updates the specified notification subscription in Amazon Security Lake for the organization you specify.
   */
  updateDataLakeExceptionSubscription(callback?: (err: AWSError, data: SecurityLake.Types.UpdateDataLakeExceptionSubscriptionResponse) => void): Request<SecurityLake.Types.UpdateDataLakeExceptionSubscriptionResponse, AWSError>;
  /**
   * Updates an existing subscription for the given Amazon Security Lake account ID. You can update a subscriber by changing the sources that the subscriber consumes data from.
   */
  updateSubscriber(params: SecurityLake.Types.UpdateSubscriberRequest, callback?: (err: AWSError, data: SecurityLake.Types.UpdateSubscriberResponse) => void): Request<SecurityLake.Types.UpdateSubscriberResponse, AWSError>;
  /**
   * Updates an existing subscription for the given Amazon Security Lake account ID. You can update a subscriber by changing the sources that the subscriber consumes data from.
   */
  updateSubscriber(callback?: (err: AWSError, data: SecurityLake.Types.UpdateSubscriberResponse) => void): Request<SecurityLake.Types.UpdateSubscriberResponse, AWSError>;
  /**
   * Updates an existing notification method for the subscription (SQS or HTTPs endpoint) or switches the notification subscription endpoint for a subscriber.
   */
  updateSubscriberNotification(params: SecurityLake.Types.UpdateSubscriberNotificationRequest, callback?: (err: AWSError, data: SecurityLake.Types.UpdateSubscriberNotificationResponse) => void): Request<SecurityLake.Types.UpdateSubscriberNotificationResponse, AWSError>;
  /**
   * Updates an existing notification method for the subscription (SQS or HTTPs endpoint) or switches the notification subscription endpoint for a subscriber.
   */
  updateSubscriberNotification(callback?: (err: AWSError, data: SecurityLake.Types.UpdateSubscriberNotificationResponse) => void): Request<SecurityLake.Types.UpdateSubscriberNotificationResponse, AWSError>;
}
declare namespace SecurityLake {
  export type AccessType = "LAKEFORMATION"|"S3"|string;
  export type AccessTypeList = AccessType[];
  export type AccountList = AwsAccountId[];
  export type AmazonResourceName = string;
  export type AwsAccountId = string;
  export interface AwsIdentity {
    /**
     * The external ID used to estalish trust relationship with the AWS identity.
     */
    externalId: ExternalId;
    /**
     * The AWS identity principal.
     */
    principal: AwsPrincipal;
  }
  export interface AwsLogSourceConfiguration {
    /**
     * Specify the Amazon Web Services account information where you want to enable Security Lake.
     */
    accounts?: AccountList;
    /**
     * Specify the Regions where you want to enable Security Lake.
     */
    regions: RegionList;
    /**
     * The name for a Amazon Web Services source. This must be a Regionally unique value.
     */
    sourceName: AwsLogSourceName;
    /**
     * The version for a Amazon Web Services source. This must be a Regionally unique value.
     */
    sourceVersion?: AwsLogSourceVersion;
  }
  export type AwsLogSourceConfigurationList = AwsLogSourceConfiguration[];
  export type AwsLogSourceName = "ROUTE53"|"VPC_FLOW"|"SH_FINDINGS"|"CLOUD_TRAIL_MGMT"|"LAMBDA_EXECUTION"|"S3_DATA"|string;
  export interface AwsLogSourceResource {
    /**
     * The name for a Amazon Web Services source. This must be a Regionally unique value.
     */
    sourceName?: AwsLogSourceName;
    /**
     * The version for a Amazon Web Services source. This must be a Regionally unique value.
     */
    sourceVersion?: AwsLogSourceVersion;
  }
  export type AwsLogSourceResourceList = AwsLogSourceResource[];
  export type AwsLogSourceVersion = string;
  export type AwsPrincipal = string;
  export interface CreateAwsLogSourceRequest {
    /**
     * Specify the natively-supported Amazon Web Services service to add as a source in Security Lake.
     */
    sources: AwsLogSourceConfigurationList;
  }
  export interface CreateAwsLogSourceResponse {
    /**
     * Lists all accounts in which enabling a natively supported Amazon Web Service as a Security Lake source failed. The failure occurred as these accounts are not part of an organization.
     */
    failed?: AccountList;
  }
  export interface CreateCustomLogSourceRequest {
    /**
     * The configuration for the third-party custom source.
     */
    configuration?: CustomLogSourceConfiguration;
    /**
     * The Open Cybersecurity Schema Framework (OCSF) event classes which describes the type of data that the custom source will send to Security Lake. The supported event classes are:    ACCESS_ACTIVITY     FILE_ACTIVITY     KERNEL_ACTIVITY     KERNEL_EXTENSION     MEMORY_ACTIVITY     MODULE_ACTIVITY     PROCESS_ACTIVITY     REGISTRY_KEY_ACTIVITY     REGISTRY_VALUE_ACTIVITY     RESOURCE_ACTIVITY     SCHEDULED_JOB_ACTIVITY     SECURITY_FINDING     ACCOUNT_CHANGE     AUTHENTICATION     AUTHORIZATION     ENTITY_MANAGEMENT_AUDIT     DHCP_ACTIVITY     NETWORK_ACTIVITY     DNS_ACTIVITY     FTP_ACTIVITY     HTTP_ACTIVITY     RDP_ACTIVITY     SMB_ACTIVITY     SSH_ACTIVITY     CONFIG_STATE     INVENTORY_INFO     EMAIL_ACTIVITY     API_ACTIVITY     CLOUD_API   
     */
    eventClasses?: OcsfEventClassList;
    /**
     * Specify the name for a third-party custom source. This must be a Regionally unique value.
     */
    sourceName: CustomLogSourceName;
    /**
     * Specify the source version for the third-party custom source, to limit log collection to a specific version of custom data source.
     */
    sourceVersion?: CustomLogSourceVersion;
  }
  export interface CreateCustomLogSourceResponse {
    /**
     * The created third-party custom source.
     */
    source?: CustomLogSourceResource;
  }
  export interface CreateDataLakeExceptionSubscriptionRequest {
    /**
     * The expiration period and time-to-live (TTL).
     */
    exceptionTimeToLive?: CreateDataLakeExceptionSubscriptionRequestExceptionTimeToLiveLong;
    /**
     * The Amazon Web Services account where you want to receive exception notifications.
     */
    notificationEndpoint: SafeString;
    /**
     * The subscription protocol to which exception notifications are posted.
     */
    subscriptionProtocol: SubscriptionProtocol;
  }
  export type CreateDataLakeExceptionSubscriptionRequestExceptionTimeToLiveLong = number;
  export interface CreateDataLakeExceptionSubscriptionResponse {
  }
  export interface CreateDataLakeOrganizationConfigurationRequest {
    /**
     * Enable Security Lake with the specified configuration settings, to begin collecting security data for new accounts in your organization.
     */
    autoEnableNewAccount: DataLakeAutoEnableNewAccountConfigurationList;
  }
  export interface CreateDataLakeOrganizationConfigurationResponse {
  }
  export interface CreateDataLakeRequest {
    /**
     * Specify the Region or Regions that will contribute data to the rollup region.
     */
    configurations: DataLakeConfigurationList;
    /**
     * The Amazon Resource Name (ARN) used to create and update the Glue table. This table contains partitions generated by the ingestion and normalization of Amazon Web Services log sources and custom sources.
     */
    metaStoreManagerRoleArn: RoleArn;
    /**
     * An array of objects, one for each tag to associate with the data lake configuration. For each tag, you must specify both a tag key and a tag value. A tag value cannot be null, but it can be an empty string.
     */
    tags?: TagList;
  }
  export interface CreateDataLakeResponse {
    /**
     * The created Security Lake configuration object.
     */
    dataLakes?: DataLakeResourceList;
  }
  export interface CreateSubscriberNotificationRequest {
    /**
     * Specify the configuration using which you want to create the subscriber notification.
     */
    configuration: NotificationConfiguration;
    /**
     * The subscriber ID for the notification subscription.
     */
    subscriberId: UUID;
  }
  export interface CreateSubscriberNotificationResponse {
    /**
     * The subscriber endpoint to which exception messages are posted.
     */
    subscriberEndpoint?: SafeString;
  }
  export interface CreateSubscriberRequest {
    /**
     * The Amazon S3 or Lake Formation access type.
     */
    accessTypes?: AccessTypeList;
    /**
     * The supported Amazon Web Services from which logs and events are collected. Security Lake supports log and event collection for natively supported Amazon Web Services.
     */
    sources: LogSourceResourceList;
    /**
     * The description for your subscriber account in Security Lake.
     */
    subscriberDescription?: DescriptionString;
    /**
     * The AWS identity used to access your data.
     */
    subscriberIdentity: AwsIdentity;
    /**
     * The name of your Security Lake subscriber account.
     */
    subscriberName: CreateSubscriberRequestSubscriberNameString;
    /**
     * An array of objects, one for each tag to associate with the subscriber. For each tag, you must specify both a tag key and a tag value. A tag value cannot be null, but it can be an empty string.
     */
    tags?: TagList;
  }
  export type CreateSubscriberRequestSubscriberNameString = string;
  export interface CreateSubscriberResponse {
    /**
     * Retrieve information about the subscriber created using the CreateSubscriber API.
     */
    subscriber?: SubscriberResource;
  }
  export interface CustomLogSourceAttributes {
    /**
     * The ARN of the Glue crawler.
     */
    crawlerArn?: AmazonResourceName;
    /**
     * The ARN of the Glue database where results are written, such as: arn:aws:daylight:us-east-1::database/sometable/*.
     */
    databaseArn?: AmazonResourceName;
    /**
     * The ARN of the Glue table.
     */
    tableArn?: AmazonResourceName;
  }
  export interface CustomLogSourceConfiguration {
    /**
     * The configuration for the Glue Crawler for the third-party custom source.
     */
    crawlerConfiguration: CustomLogSourceCrawlerConfiguration;
    /**
     * The identity of the log provider for the third-party custom source.
     */
    providerIdentity: AwsIdentity;
  }
  export interface CustomLogSourceCrawlerConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the Identity and Access Management (IAM) role to be used by the Glue crawler. The recommended IAM policies are:   The managed policy AWSGlueServiceRole    A custom policy granting access to your Amazon S3 Data Lake  
     */
    roleArn: RoleArn;
  }
  export type CustomLogSourceName = string;
  export interface CustomLogSourceProvider {
    /**
     * The location of the partition in the Amazon S3 bucket for Security Lake.
     */
    location?: S3URI;
    /**
     * The ARN of the IAM role to be used by the entity putting logs into your custom source partition. Security Lake will apply the correct access policies to this role, but you must first manually create the trust policy for this role. The IAM role name must start with the text 'Security Lake'. The IAM role must trust the logProviderAccountId to assume the role.
     */
    roleArn?: RoleArn;
  }
  export interface CustomLogSourceResource {
    /**
     * The attributes of a third-party custom source.
     */
    attributes?: CustomLogSourceAttributes;
    /**
     * The details of the log provider for a third-party custom source.
     */
    provider?: CustomLogSourceProvider;
    /**
     * The name for a third-party custom source. This must be a Regionally unique value.
     */
    sourceName?: CustomLogSourceName;
    /**
     * The version for a third-party custom source. This must be a Regionally unique value.
     */
    sourceVersion?: CustomLogSourceVersion;
  }
  export type CustomLogSourceVersion = string;
  export interface DataLakeAutoEnableNewAccountConfiguration {
    /**
     * The Amazon Web Services Regions where Security Lake is automatically enabled.
     */
    region: Region;
    /**
     * The Amazon Web Services sources that are automatically enabled in Security Lake.
     */
    sources: AwsLogSourceResourceList;
  }
  export type DataLakeAutoEnableNewAccountConfigurationList = DataLakeAutoEnableNewAccountConfiguration[];
  export interface DataLakeConfiguration {
    /**
     * Provides encryption details of Amazon Security Lake object.
     */
    encryptionConfiguration?: DataLakeEncryptionConfiguration;
    /**
     * Provides lifecycle details of Amazon Security Lake object.
     */
    lifecycleConfiguration?: DataLakeLifecycleConfiguration;
    /**
     * The Amazon Web Services Regions where Security Lake is automatically enabled.
     */
    region: Region;
    /**
     * Provides replication details of Amazon Security Lake object.
     */
    replicationConfiguration?: DataLakeReplicationConfiguration;
  }
  export type DataLakeConfigurationList = DataLakeConfiguration[];
  export interface DataLakeEncryptionConfiguration {
    /**
     * The id of KMS encryption key used by Amazon Security Lake to encrypt the Security Lake object.
     */
    kmsKeyId?: String;
  }
  export interface DataLakeException {
    /**
     * The underlying exception of a Security Lake exception.
     */
    exception?: SafeString;
    /**
     * The Amazon Web Services Regions where the exception occurred.
     */
    region?: Region;
    /**
     * List of all remediation steps for a Security Lake exception.
     */
    remediation?: SafeString;
    /**
     * This error can occur if you configure the wrong timestamp format, or if the subset of entries used for validation had errors or missing values.
     */
    timestamp?: SyntheticTimestamp_date_time;
  }
  export type DataLakeExceptionList = DataLakeException[];
  export interface DataLakeLifecycleConfiguration {
    /**
     * Provides data expiration details of Amazon Security Lake object.
     */
    expiration?: DataLakeLifecycleExpiration;
    /**
     * Provides data storage transition details of Amazon Security Lake object.
     */
    transitions?: DataLakeLifecycleTransitionList;
  }
  export interface DataLakeLifecycleExpiration {
    /**
     * Number of days before data expires in the Amazon Security Lake object.
     */
    days?: DataLakeLifecycleExpirationDaysInteger;
  }
  export type DataLakeLifecycleExpirationDaysInteger = number;
  export interface DataLakeLifecycleTransition {
    /**
     * Number of days before data transitions to a different S3 Storage Class in the Amazon Security Lake object.
     */
    days?: DataLakeLifecycleTransitionDaysInteger;
    /**
     * The range of storage classes that you can choose from based on the data access, resiliency, and cost requirements of your workloads.
     */
    storageClass?: DataLakeStorageClass;
  }
  export type DataLakeLifecycleTransitionDaysInteger = number;
  export type DataLakeLifecycleTransitionList = DataLakeLifecycleTransition[];
  export interface DataLakeReplicationConfiguration {
    /**
     * Replication enables automatic, asynchronous copying of objects across Amazon S3 buckets. Amazon S3 buckets that are configured for object replication can be owned by the same Amazon Web Services account or by different accounts. You can replicate objects to a single destination bucket or to multiple destination buckets. The destination buckets can be in different Amazon Web Services Regions or within the same Region as the source bucket. Set up one or more rollup Regions by providing the Region or Regions that should contribute to the central rollup Region.
     */
    regions?: RegionList;
    /**
     * Replication settings for the Amazon S3 buckets. This parameter uses the Identity and Access Management (IAM) role you created that is managed by Security Lake, to ensure the replication setting is correct.
     */
    roleArn?: RoleArn;
  }
  export interface DataLakeResource {
    /**
     * Retrieves the status of the configuration operation for an account in Amazon Security Lake.
     */
    createStatus?: DataLakeStatus;
    /**
     * The Amazon Resource Name (ARN) created by you to provide to the subscriber. For more information about ARNs and how to use them in policies, see the Amazon Security Lake User Guide.
     */
    dataLakeArn: AmazonResourceName;
    /**
     * Provides encryption details of Amazon Security Lake object.
     */
    encryptionConfiguration?: DataLakeEncryptionConfiguration;
    /**
     * Provides lifecycle details of Amazon Security Lake object.
     */
    lifecycleConfiguration?: DataLakeLifecycleConfiguration;
    /**
     * The Amazon Web Services Regions where Security Lake is enabled.
     */
    region: Region;
    /**
     * Provides replication details of Amazon Security Lake object.
     */
    replicationConfiguration?: DataLakeReplicationConfiguration;
    /**
     * The ARN for the Amazon Security Lake Amazon S3 bucket.
     */
    s3BucketArn?: S3BucketArn;
    /**
     * The status of the last UpdateDataLake or DeleteDataLake API request.
     */
    updateStatus?: DataLakeUpdateStatus;
  }
  export type DataLakeResourceList = DataLakeResource[];
  export interface DataLakeSource {
    /**
     * The ID of the Security Lake account for which logs are collected.
     */
    account?: String;
    /**
     * The Open Cybersecurity Schema Framework (OCSF) event classes which describes the type of data that the custom source will send to Security Lake. The supported event classes are:    ACCESS_ACTIVITY     FILE_ACTIVITY     KERNEL_ACTIVITY     KERNEL_EXTENSION     MEMORY_ACTIVITY     MODULE_ACTIVITY     PROCESS_ACTIVITY     REGISTRY_KEY_ACTIVITY     REGISTRY_VALUE_ACTIVITY     RESOURCE_ACTIVITY     SCHEDULED_JOB_ACTIVITY     SECURITY_FINDING     ACCOUNT_CHANGE     AUTHENTICATION     AUTHORIZATION     ENTITY_MANAGEMENT_AUDIT     DHCP_ACTIVITY     NETWORK_ACTIVITY     DNS_ACTIVITY     FTP_ACTIVITY     HTTP_ACTIVITY     RDP_ACTIVITY     SMB_ACTIVITY     SSH_ACTIVITY     CONFIG_STATE     INVENTORY_INFO     EMAIL_ACTIVITY     API_ACTIVITY     CLOUD_API   
     */
    eventClasses?: OcsfEventClassList;
    /**
     * The supported Amazon Web Services from which logs and events are collected. Amazon Security Lake supports log and event collection for natively supported Amazon Web Services.
     */
    sourceName?: String;
    /**
     * The log status for the Security Lake account.
     */
    sourceStatuses?: DataLakeSourceStatusList;
  }
  export type DataLakeSourceList = DataLakeSource[];
  export interface DataLakeSourceStatus {
    /**
     * Defines path the stored logs are available which has information on your systems, applications, and services.
     */
    resource?: String;
    /**
     * The health status of services, including error codes and patterns.
     */
    status?: SourceCollectionStatus;
  }
  export type DataLakeSourceStatusList = DataLakeSourceStatus[];
  export type DataLakeStatus = "INITIALIZED"|"PENDING"|"COMPLETED"|"FAILED"|string;
  export type DataLakeStorageClass = string;
  export interface DataLakeUpdateException {
    /**
     * The reason code for the exception of the last UpdateDataLake or DeleteDataLake API request.
     */
    code?: String;
    /**
     * The reason for the exception of the last UpdateDataLakeor DeleteDataLake API request.
     */
    reason?: String;
  }
  export interface DataLakeUpdateStatus {
    /**
     * The details of the last UpdateDataLakeor DeleteDataLake API request which failed.
     */
    exception?: DataLakeUpdateException;
    /**
     * The unique ID for the last UpdateDataLake or DeleteDataLake API request.
     */
    requestId?: String;
    /**
     * The status of the last UpdateDataLake or DeleteDataLake API request that was requested.
     */
    status?: DataLakeStatus;
  }
  export interface DeleteAwsLogSourceRequest {
    /**
     * Specify the natively-supported Amazon Web Services service to remove as a source in Security Lake.
     */
    sources: AwsLogSourceConfigurationList;
  }
  export interface DeleteAwsLogSourceResponse {
    /**
     * Deletion of the Amazon Web Services sources failed as the account is not a part of the organization.
     */
    failed?: AccountList;
  }
  export interface DeleteCustomLogSourceRequest {
    /**
     * The source name of custom log source that you want to delete.
     */
    sourceName: CustomLogSourceName;
    /**
     * The source version for the third-party custom source. You can limit the custom source removal to the specified source version.
     */
    sourceVersion?: CustomLogSourceVersion;
  }
  export interface DeleteCustomLogSourceResponse {
  }
  export interface DeleteDataLakeExceptionSubscriptionRequest {
  }
  export interface DeleteDataLakeExceptionSubscriptionResponse {
  }
  export interface DeleteDataLakeOrganizationConfigurationRequest {
    /**
     * Turns off automatic enablement of Security Lake for member accounts that are added to an organization.
     */
    autoEnableNewAccount: DataLakeAutoEnableNewAccountConfigurationList;
  }
  export interface DeleteDataLakeOrganizationConfigurationResponse {
  }
  export interface DeleteDataLakeRequest {
    /**
     * The list of Regions where Security Lake is enabled.
     */
    regions: RegionList;
  }
  export interface DeleteDataLakeResponse {
  }
  export interface DeleteSubscriberNotificationRequest {
    /**
     * The ID of the Security Lake subscriber account.
     */
    subscriberId: UUID;
  }
  export interface DeleteSubscriberNotificationResponse {
  }
  export interface DeleteSubscriberRequest {
    /**
     * A value created by Security Lake that uniquely identifies your DeleteSubscriber API request.
     */
    subscriberId: UUID;
  }
  export interface DeleteSubscriberResponse {
  }
  export interface DeregisterDataLakeDelegatedAdministratorRequest {
  }
  export interface DeregisterDataLakeDelegatedAdministratorResponse {
  }
  export type DescriptionString = string;
  export type ExternalId = string;
  export interface GetDataLakeExceptionSubscriptionRequest {
  }
  export interface GetDataLakeExceptionSubscriptionResponse {
    /**
     * The expiration period and time-to-live (TTL).
     */
    exceptionTimeToLive?: Long;
    /**
     * The Amazon Web Services account where you receive exception notifications.
     */
    notificationEndpoint?: SafeString;
    /**
     * The subscription protocol to which exception notifications are posted.
     */
    subscriptionProtocol?: SubscriptionProtocol;
  }
  export interface GetDataLakeOrganizationConfigurationRequest {
  }
  export interface GetDataLakeOrganizationConfigurationResponse {
    /**
     * The configuration for new accounts.
     */
    autoEnableNewAccount?: DataLakeAutoEnableNewAccountConfigurationList;
  }
  export interface GetDataLakeSourcesRequest {
    /**
     * The Amazon Web Services account ID for which a static snapshot of the current Amazon Web Services Region, including enabled accounts and log sources, is retrieved.
     */
    accounts?: AccountList;
    /**
     * The maximum limit of accounts for which the static snapshot of the current Region, including enabled accounts and log sources, is retrieved.
     */
    maxResults?: MaxResults;
    /**
     * Lists if there are more results available. The value of nextToken is a unique pagination token for each page. Repeat the call using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: NextToken;
  }
  export interface GetDataLakeSourcesResponse {
    /**
     * The Amazon Resource Name (ARN) created by you to provide to the subscriber. For more information about ARNs and how to use them in policies, see the Amazon Security Lake User Guide.
     */
    dataLakeArn?: AmazonResourceName;
    /**
     * The list of enabled accounts and enabled sources.
     */
    dataLakeSources?: DataLakeSourceList;
    /**
     * Lists if there are more results available. The value of nextToken is a unique pagination token for each page. Repeat the call using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: NextToken;
  }
  export interface GetSubscriberRequest {
    /**
     * A value created by Amazon Security Lake that uniquely identifies your GetSubscriber API request.
     */
    subscriberId: UUID;
  }
  export interface GetSubscriberResponse {
    /**
     * The subscriber information for the specified subscriber ID.
     */
    subscriber?: SubscriberResource;
  }
  export type HttpMethod = "POST"|"PUT"|string;
  export interface HttpsNotificationConfiguration {
    /**
     * The key name for the notification subscription.
     */
    authorizationApiKeyName?: String;
    /**
     * The key value for the notification subscription.
     */
    authorizationApiKeyValue?: String;
    /**
     * The subscription endpoint in Security Lake. If you prefer notification with an HTTPs endpoint, populate this field.
     */
    endpoint: HttpsNotificationConfigurationEndpointString;
    /**
     * The HTTPS method used for the notification subscription.
     */
    httpMethod?: HttpMethod;
    /**
     * The Amazon Resource Name (ARN) of the EventBridge API destinations IAM role that you created. For more information about ARNs and how to use them in policies, see Managing data access and Amazon Web Services Managed Policies in the Amazon Security Lake User Guide.
     */
    targetRoleArn: RoleArn;
  }
  export type HttpsNotificationConfigurationEndpointString = string;
  export interface ListDataLakeExceptionsRequest {
    /**
     * List the maximum number of failures in Security Lake.
     */
    maxResults?: MaxResults;
    /**
     * List if there are more results available. The value of nextToken is a unique pagination token for each page. Repeat the call using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: NextToken;
    /**
     * List the Amazon Web Services Regions from which exceptions are retrieved.
     */
    regions?: RegionList;
  }
  export interface ListDataLakeExceptionsResponse {
    /**
     * Lists the failures that cannot be retried in the current Region.
     */
    exceptions?: DataLakeExceptionList;
    /**
     * List if there are more results available. The value of nextToken is a unique pagination token for each page. Repeat the call using the returned token to retrieve the next page. Keep all other arguments unchanged. Each pagination token expires after 24 hours. Using an expired pagination token will return an HTTP 400 InvalidToken error.
     */
    nextToken?: NextToken;
  }
  export interface ListDataLakesRequest {
    /**
     * The list of regions where Security Lake is enabled.
     */
    regions?: RegionList;
  }
  export interface ListDataLakesResponse {
    /**
     * Retrieves the Security Lake configuration object.
     */
    dataLakes?: DataLakeResourceList;
  }
  export interface ListLogSourcesRequest {
    /**
     * The list of Amazon Web Services accounts for which log sources are displayed.
     */
    accounts?: AccountList;
    /**
     * The maximum number of accounts for which the log sources are displayed.
     */
    maxResults?: MaxResults;
    /**
     * If nextToken is returned, there are more results available. You can repeat the call using the returned token to retrieve the next page.
     */
    nextToken?: NextToken;
    /**
     * The list of regions for which log sources are displayed.
     */
    regions?: RegionList;
    /**
     * The list of sources for which log sources are displayed.
     */
    sources?: LogSourceResourceList;
  }
  export interface ListLogSourcesResponse {
    /**
     * If nextToken is returned, there are more results available. You can repeat the call using the returned token to retrieve the next page.
     */
    nextToken?: NextToken;
    /**
     * The list of log sources in your organization that send data to the data lake.
     */
    sources?: LogSourceList;
  }
  export interface ListSubscribersRequest {
    /**
     * The maximum number of accounts for which the configuration is displayed.
     */
    maxResults?: MaxResults;
    /**
     * If nextToken is returned, there are more results available. You can repeat the call using the returned token to retrieve the next page.
     */
    nextToken?: NextToken;
  }
  export interface ListSubscribersResponse {
    /**
     * If nextToken is returned, there are more results available. You can repeat the call using the returned token to retrieve the next page.
     */
    nextToken?: NextToken;
    /**
     * The subscribers available for the specified Security Lake account ID.
     */
    subscribers?: SubscriberResourceList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Security Lake resource to retrieve the tags for.
     */
    resourceArn: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * An array of objects, one for each tag (key and value) that’s associated with the Amazon Security Lake resource.
     */
    tags?: TagList;
  }
  export interface LogSource {
    /**
     * Specify the account from which you want to collect logs.
     */
    account?: AwsAccountId;
    /**
     * Specify the Regions from which you want to collect logs.
     */
    region?: Region;
    /**
     * Specify the sources from which you want to collect logs.
     */
    sources?: LogSourceResourceList;
  }
  export type LogSourceList = LogSource[];
  export interface LogSourceResource {
    /**
     * Amazon Security Lake supports log and event collection for natively supported Amazon Web Services. For more information, see the Amazon Security Lake User Guide.
     */
    awsLogSource?: AwsLogSourceResource;
    /**
     * Amazon Security Lake supports custom source types. For more information, see the Amazon Security Lake User Guide.
     */
    customLogSource?: CustomLogSourceResource;
  }
  export type LogSourceResourceList = LogSourceResource[];
  export type Long = number;
  export type MaxResults = number;
  export type NextToken = string;
  export interface NotificationConfiguration {
    /**
     * The configurations for HTTPS subscriber notification.
     */
    httpsNotificationConfiguration?: HttpsNotificationConfiguration;
    /**
     * The configurations for SQS subscriber notification.
     */
    sqsNotificationConfiguration?: SqsNotificationConfiguration;
  }
  export type OcsfEventClass = string;
  export type OcsfEventClassList = OcsfEventClass[];
  export type Region = string;
  export type RegionList = Region[];
  export interface RegisterDataLakeDelegatedAdministratorRequest {
    /**
     * The Amazon Web Services account ID of the Security Lake delegated administrator.
     */
    accountId: SafeString;
  }
  export interface RegisterDataLakeDelegatedAdministratorResponse {
  }
  export type ResourceShareArn = string;
  export type ResourceShareName = string;
  export type RoleArn = string;
  export type S3BucketArn = string;
  export type S3URI = string;
  export type SafeString = string;
  export type SourceCollectionStatus = "COLLECTING"|"MISCONFIGURED"|"NOT_COLLECTING"|string;
  export interface SqsNotificationConfiguration {
  }
  export type String = string;
  export interface SubscriberResource {
    /**
     * You can choose to notify subscribers of new objects with an Amazon Simple Queue Service (Amazon SQS) queue or through messaging to an HTTPS endpoint provided by the subscriber.  Subscribers can consume data by directly querying Lake Formation tables in your Amazon S3 bucket through services like Amazon Athena. This subscription type is defined as LAKEFORMATION.
     */
    accessTypes?: AccessTypeList;
    /**
     * The date and time when the subscriber was created.
     */
    createdAt?: SyntheticTimestamp_date_time;
    /**
     * The Amazon Resource Name (ARN) which uniquely defines the AWS RAM resource share. Before accepting the RAM resource share invitation, you can view details related to the RAM resource share. This field is available only for Lake Formation subscribers created after March 8, 2023.
     */
    resourceShareArn?: ResourceShareArn;
    /**
     * The name of the resource share.
     */
    resourceShareName?: ResourceShareName;
    /**
     * The Amazon Resource Name (ARN) specifying the role of the subscriber.
     */
    roleArn?: RoleArn;
    /**
     * The ARN for the Amazon S3 bucket.
     */
    s3BucketArn?: S3BucketArn;
    /**
     * Amazon Security Lake supports log and event collection for natively supported Amazon Web Services. For more information, see the Amazon Security Lake User Guide.
     */
    sources: LogSourceResourceList;
    /**
     * The subscriber ARN of the Amazon Security Lake subscriber account.
     */
    subscriberArn: AmazonResourceName;
    /**
     * The subscriber descriptions for a subscriber account. The description for a subscriber includes subscriberName, accountID, externalID, and subscriberId.
     */
    subscriberDescription?: SafeString;
    /**
     * The subscriber endpoint to which exception messages are posted.
     */
    subscriberEndpoint?: SafeString;
    /**
     * The subscriber ID of the Amazon Security Lake subscriber account.
     */
    subscriberId: UUID;
    /**
     * The AWS identity used to access your data.
     */
    subscriberIdentity: AwsIdentity;
    /**
     * The name of your Amazon Security Lake subscriber account.
     */
    subscriberName: SafeString;
    /**
     * The subscriber status of the Amazon Security Lake subscriber account.
     */
    subscriberStatus?: SubscriberStatus;
    /**
     * The date and time when the subscriber was last updated.
     */
    updatedAt?: SyntheticTimestamp_date_time;
  }
  export type SubscriberResourceList = SubscriberResource[];
  export type SubscriberStatus = "ACTIVE"|"DEACTIVATED"|"PENDING"|"READY"|string;
  export type SubscriptionProtocol = string;
  export type SyntheticTimestamp_date_time = Date;
  export interface Tag {
    /**
     * The name of the tag. This is a general label that acts as a category for a more specific tag value (value).
     */
    key: TagKey;
    /**
     * The value that’s associated with the specified tag key (key). This value acts as a descriptor for the tag key. A tag value cannot be null, but it can be an empty string.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Security Lake resource to add or update the tags for.
     */
    resourceArn: AmazonResourceName;
    /**
     * An array of objects, one for each tag (key and value) to associate with the Amazon Security Lake resource. For each tag, you must specify both a tag key and a tag value. A tag value cannot be null, but it can be an empty string.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type UUID = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Security Lake resource to remove one or more tags from.
     */
    resourceArn: AmazonResourceName;
    /**
     * A list of one or more tag keys. For each value in the list, specify the tag key for a tag to remove from the Amazon Security Lake resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDataLakeExceptionSubscriptionRequest {
    /**
     * The time-to-live (TTL) for the exception message to remain.
     */
    exceptionTimeToLive?: UpdateDataLakeExceptionSubscriptionRequestExceptionTimeToLiveLong;
    /**
     * The account that is subscribed to receive exception notifications.
     */
    notificationEndpoint: SafeString;
    /**
     * The subscription protocol to which exception messages are posted.
     */
    subscriptionProtocol: SubscriptionProtocol;
  }
  export type UpdateDataLakeExceptionSubscriptionRequestExceptionTimeToLiveLong = number;
  export interface UpdateDataLakeExceptionSubscriptionResponse {
  }
  export interface UpdateDataLakeRequest {
    /**
     * Specify the Region or Regions that will contribute data to the rollup region.
     */
    configurations: DataLakeConfigurationList;
  }
  export interface UpdateDataLakeResponse {
    /**
     * The created Security Lake configuration object.
     */
    dataLakes?: DataLakeResourceList;
  }
  export interface UpdateSubscriberNotificationRequest {
    /**
     * The configuration for subscriber notification.
     */
    configuration: NotificationConfiguration;
    /**
     * The subscription ID for which the subscription notification is specified.
     */
    subscriberId: UUID;
  }
  export interface UpdateSubscriberNotificationResponse {
    /**
     * The subscriber endpoint to which exception messages are posted.
     */
    subscriberEndpoint?: SafeString;
  }
  export interface UpdateSubscriberRequest {
    /**
     * The supported Amazon Web Services from which logs and events are collected. For the list of supported Amazon Web Services, see the Amazon Security Lake User Guide.
     */
    sources?: LogSourceResourceList;
    /**
     * The description of the Security Lake account subscriber.
     */
    subscriberDescription?: DescriptionString;
    /**
     * A value created by Security Lake that uniquely identifies your subscription.
     */
    subscriberId: UUID;
    /**
     * The AWS identity used to access your data.
     */
    subscriberIdentity?: AwsIdentity;
    /**
     * The name of the Security Lake account subscriber.
     */
    subscriberName?: UpdateSubscriberRequestSubscriberNameString;
  }
  export type UpdateSubscriberRequestSubscriberNameString = string;
  export interface UpdateSubscriberResponse {
    /**
     * The updated subscriber information.
     */
    subscriber?: SubscriberResource;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SecurityLake client.
   */
  export import Types = SecurityLake;
}
export = SecurityLake;
