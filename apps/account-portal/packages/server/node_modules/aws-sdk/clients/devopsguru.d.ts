import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class DevOpsGuru extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: DevOpsGuru.Types.ClientConfiguration)
  config: Config & DevOpsGuru.Types.ClientConfiguration;
  /**
   *  Adds a notification channel to DevOps Guru. A notification channel is used to notify you about important DevOps Guru events, such as when an insight is generated.  If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to send it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. DevOps Guru only supports standard SNS topics. For more information, see Permissions for Amazon SNS topics. If you use an Amazon SNS topic that is encrypted by an Amazon Web Services Key Management Service customer-managed key (CMK), then you must add permissions to the CMK. For more information, see Permissions for Amazon Web Services KMS–encrypted Amazon SNS topics.
   */
  addNotificationChannel(params: DevOpsGuru.Types.AddNotificationChannelRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.AddNotificationChannelResponse) => void): Request<DevOpsGuru.Types.AddNotificationChannelResponse, AWSError>;
  /**
   *  Adds a notification channel to DevOps Guru. A notification channel is used to notify you about important DevOps Guru events, such as when an insight is generated.  If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to send it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. DevOps Guru only supports standard SNS topics. For more information, see Permissions for Amazon SNS topics. If you use an Amazon SNS topic that is encrypted by an Amazon Web Services Key Management Service customer-managed key (CMK), then you must add permissions to the CMK. For more information, see Permissions for Amazon Web Services KMS–encrypted Amazon SNS topics.
   */
  addNotificationChannel(callback?: (err: AWSError, data: DevOpsGuru.Types.AddNotificationChannelResponse) => void): Request<DevOpsGuru.Types.AddNotificationChannelResponse, AWSError>;
  /**
   * Deletes the insight along with the associated anomalies, events and recommendations.
   */
  deleteInsight(params: DevOpsGuru.Types.DeleteInsightRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DeleteInsightResponse) => void): Request<DevOpsGuru.Types.DeleteInsightResponse, AWSError>;
  /**
   * Deletes the insight along with the associated anomalies, events and recommendations.
   */
  deleteInsight(callback?: (err: AWSError, data: DevOpsGuru.Types.DeleteInsightResponse) => void): Request<DevOpsGuru.Types.DeleteInsightResponse, AWSError>;
  /**
   *  Returns the number of open reactive insights, the number of open proactive insights, and the number of metrics analyzed in your Amazon Web Services account. Use these numbers to gauge the health of operations in your Amazon Web Services account. 
   */
  describeAccountHealth(params: DevOpsGuru.Types.DescribeAccountHealthRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeAccountHealthResponse) => void): Request<DevOpsGuru.Types.DescribeAccountHealthResponse, AWSError>;
  /**
   *  Returns the number of open reactive insights, the number of open proactive insights, and the number of metrics analyzed in your Amazon Web Services account. Use these numbers to gauge the health of operations in your Amazon Web Services account. 
   */
  describeAccountHealth(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeAccountHealthResponse) => void): Request<DevOpsGuru.Types.DescribeAccountHealthResponse, AWSError>;
  /**
   *  For the time range passed in, returns the number of open reactive insight that were created, the number of open proactive insights that were created, and the Mean Time to Recover (MTTR) for all closed reactive insights. 
   */
  describeAccountOverview(params: DevOpsGuru.Types.DescribeAccountOverviewRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeAccountOverviewResponse) => void): Request<DevOpsGuru.Types.DescribeAccountOverviewResponse, AWSError>;
  /**
   *  For the time range passed in, returns the number of open reactive insight that were created, the number of open proactive insights that were created, and the Mean Time to Recover (MTTR) for all closed reactive insights. 
   */
  describeAccountOverview(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeAccountOverviewResponse) => void): Request<DevOpsGuru.Types.DescribeAccountOverviewResponse, AWSError>;
  /**
   *  Returns details about an anomaly that you specify using its ID. 
   */
  describeAnomaly(params: DevOpsGuru.Types.DescribeAnomalyRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeAnomalyResponse) => void): Request<DevOpsGuru.Types.DescribeAnomalyResponse, AWSError>;
  /**
   *  Returns details about an anomaly that you specify using its ID. 
   */
  describeAnomaly(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeAnomalyResponse) => void): Request<DevOpsGuru.Types.DescribeAnomalyResponse, AWSError>;
  /**
   * Returns the integration status of services that are integrated with DevOps Guru as Consumer via EventBridge. The one service that can be integrated with DevOps Guru is Amazon CodeGuru Profiler, which can produce proactive recommendations which can be stored and viewed in DevOps Guru.
   */
  describeEventSourcesConfig(params: DevOpsGuru.Types.DescribeEventSourcesConfigRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeEventSourcesConfigResponse) => void): Request<DevOpsGuru.Types.DescribeEventSourcesConfigResponse, AWSError>;
  /**
   * Returns the integration status of services that are integrated with DevOps Guru as Consumer via EventBridge. The one service that can be integrated with DevOps Guru is Amazon CodeGuru Profiler, which can produce proactive recommendations which can be stored and viewed in DevOps Guru.
   */
  describeEventSourcesConfig(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeEventSourcesConfigResponse) => void): Request<DevOpsGuru.Types.DescribeEventSourcesConfigResponse, AWSError>;
  /**
   *  Returns the most recent feedback submitted in the current Amazon Web Services account and Region. 
   */
  describeFeedback(params: DevOpsGuru.Types.DescribeFeedbackRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeFeedbackResponse) => void): Request<DevOpsGuru.Types.DescribeFeedbackResponse, AWSError>;
  /**
   *  Returns the most recent feedback submitted in the current Amazon Web Services account and Region. 
   */
  describeFeedback(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeFeedbackResponse) => void): Request<DevOpsGuru.Types.DescribeFeedbackResponse, AWSError>;
  /**
   *  Returns details about an insight that you specify using its ID. 
   */
  describeInsight(params: DevOpsGuru.Types.DescribeInsightRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeInsightResponse) => void): Request<DevOpsGuru.Types.DescribeInsightResponse, AWSError>;
  /**
   *  Returns details about an insight that you specify using its ID. 
   */
  describeInsight(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeInsightResponse) => void): Request<DevOpsGuru.Types.DescribeInsightResponse, AWSError>;
  /**
   * Returns active insights, predictive insights, and resource hours analyzed in last hour.
   */
  describeOrganizationHealth(params: DevOpsGuru.Types.DescribeOrganizationHealthRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeOrganizationHealthResponse) => void): Request<DevOpsGuru.Types.DescribeOrganizationHealthResponse, AWSError>;
  /**
   * Returns active insights, predictive insights, and resource hours analyzed in last hour.
   */
  describeOrganizationHealth(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeOrganizationHealthResponse) => void): Request<DevOpsGuru.Types.DescribeOrganizationHealthResponse, AWSError>;
  /**
   * Returns an overview of your organization's history based on the specified time range. The overview includes the total reactive and proactive insights.
   */
  describeOrganizationOverview(params: DevOpsGuru.Types.DescribeOrganizationOverviewRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeOrganizationOverviewResponse) => void): Request<DevOpsGuru.Types.DescribeOrganizationOverviewResponse, AWSError>;
  /**
   * Returns an overview of your organization's history based on the specified time range. The overview includes the total reactive and proactive insights.
   */
  describeOrganizationOverview(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeOrganizationOverviewResponse) => void): Request<DevOpsGuru.Types.DescribeOrganizationOverviewResponse, AWSError>;
  /**
   * Provides an overview of your system's health. If additional member accounts are part of your organization, you can filter those accounts using the AccountIds field.
   */
  describeOrganizationResourceCollectionHealth(params: DevOpsGuru.Types.DescribeOrganizationResourceCollectionHealthRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeOrganizationResourceCollectionHealthResponse) => void): Request<DevOpsGuru.Types.DescribeOrganizationResourceCollectionHealthResponse, AWSError>;
  /**
   * Provides an overview of your system's health. If additional member accounts are part of your organization, you can filter those accounts using the AccountIds field.
   */
  describeOrganizationResourceCollectionHealth(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeOrganizationResourceCollectionHealthResponse) => void): Request<DevOpsGuru.Types.DescribeOrganizationResourceCollectionHealthResponse, AWSError>;
  /**
   *  Returns the number of open proactive insights, open reactive insights, and the Mean Time to Recover (MTTR) for all closed insights in resource collections in your account. You specify the type of Amazon Web Services resources collection. The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag key. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
   */
  describeResourceCollectionHealth(params: DevOpsGuru.Types.DescribeResourceCollectionHealthRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeResourceCollectionHealthResponse) => void): Request<DevOpsGuru.Types.DescribeResourceCollectionHealthResponse, AWSError>;
  /**
   *  Returns the number of open proactive insights, open reactive insights, and the Mean Time to Recover (MTTR) for all closed insights in resource collections in your account. You specify the type of Amazon Web Services resources collection. The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag key. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
   */
  describeResourceCollectionHealth(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeResourceCollectionHealthResponse) => void): Request<DevOpsGuru.Types.DescribeResourceCollectionHealthResponse, AWSError>;
  /**
   *  Returns the integration status of services that are integrated with DevOps Guru. The one service that can be integrated with DevOps Guru is Amazon Web Services Systems Manager, which can be used to create an OpsItem for each generated insight. 
   */
  describeServiceIntegration(params: DevOpsGuru.Types.DescribeServiceIntegrationRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeServiceIntegrationResponse) => void): Request<DevOpsGuru.Types.DescribeServiceIntegrationResponse, AWSError>;
  /**
   *  Returns the integration status of services that are integrated with DevOps Guru. The one service that can be integrated with DevOps Guru is Amazon Web Services Systems Manager, which can be used to create an OpsItem for each generated insight. 
   */
  describeServiceIntegration(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeServiceIntegrationResponse) => void): Request<DevOpsGuru.Types.DescribeServiceIntegrationResponse, AWSError>;
  /**
   * Returns an estimate of the monthly cost for DevOps Guru to analyze your Amazon Web Services resources. For more information, see Estimate your Amazon DevOps Guru costs and Amazon DevOps Guru pricing.
   */
  getCostEstimation(params: DevOpsGuru.Types.GetCostEstimationRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.GetCostEstimationResponse) => void): Request<DevOpsGuru.Types.GetCostEstimationResponse, AWSError>;
  /**
   * Returns an estimate of the monthly cost for DevOps Guru to analyze your Amazon Web Services resources. For more information, see Estimate your Amazon DevOps Guru costs and Amazon DevOps Guru pricing.
   */
  getCostEstimation(callback?: (err: AWSError, data: DevOpsGuru.Types.GetCostEstimationResponse) => void): Request<DevOpsGuru.Types.GetCostEstimationResponse, AWSError>;
  /**
   *  Returns lists Amazon Web Services resources that are of the specified resource collection type. The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag key. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
   */
  getResourceCollection(params: DevOpsGuru.Types.GetResourceCollectionRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.GetResourceCollectionResponse) => void): Request<DevOpsGuru.Types.GetResourceCollectionResponse, AWSError>;
  /**
   *  Returns lists Amazon Web Services resources that are of the specified resource collection type. The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag key. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
   */
  getResourceCollection(callback?: (err: AWSError, data: DevOpsGuru.Types.GetResourceCollectionResponse) => void): Request<DevOpsGuru.Types.GetResourceCollectionResponse, AWSError>;
  /**
   *  Returns a list of the anomalies that belong to an insight that you specify using its ID. 
   */
  listAnomaliesForInsight(params: DevOpsGuru.Types.ListAnomaliesForInsightRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListAnomaliesForInsightResponse) => void): Request<DevOpsGuru.Types.ListAnomaliesForInsightResponse, AWSError>;
  /**
   *  Returns a list of the anomalies that belong to an insight that you specify using its ID. 
   */
  listAnomaliesForInsight(callback?: (err: AWSError, data: DevOpsGuru.Types.ListAnomaliesForInsightResponse) => void): Request<DevOpsGuru.Types.ListAnomaliesForInsightResponse, AWSError>;
  /**
   *  Returns the list of log groups that contain log anomalies. 
   */
  listAnomalousLogGroups(params: DevOpsGuru.Types.ListAnomalousLogGroupsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListAnomalousLogGroupsResponse) => void): Request<DevOpsGuru.Types.ListAnomalousLogGroupsResponse, AWSError>;
  /**
   *  Returns the list of log groups that contain log anomalies. 
   */
  listAnomalousLogGroups(callback?: (err: AWSError, data: DevOpsGuru.Types.ListAnomalousLogGroupsResponse) => void): Request<DevOpsGuru.Types.ListAnomalousLogGroupsResponse, AWSError>;
  /**
   *  Returns a list of the events emitted by the resources that are evaluated by DevOps Guru. You can use filters to specify which events are returned. 
   */
  listEvents(params: DevOpsGuru.Types.ListEventsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListEventsResponse) => void): Request<DevOpsGuru.Types.ListEventsResponse, AWSError>;
  /**
   *  Returns a list of the events emitted by the resources that are evaluated by DevOps Guru. You can use filters to specify which events are returned. 
   */
  listEvents(callback?: (err: AWSError, data: DevOpsGuru.Types.ListEventsResponse) => void): Request<DevOpsGuru.Types.ListEventsResponse, AWSError>;
  /**
   *  Returns a list of insights in your Amazon Web Services account. You can specify which insights are returned by their start time and status (ONGOING, CLOSED, or ANY). 
   */
  listInsights(params: DevOpsGuru.Types.ListInsightsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListInsightsResponse) => void): Request<DevOpsGuru.Types.ListInsightsResponse, AWSError>;
  /**
   *  Returns a list of insights in your Amazon Web Services account. You can specify which insights are returned by their start time and status (ONGOING, CLOSED, or ANY). 
   */
  listInsights(callback?: (err: AWSError, data: DevOpsGuru.Types.ListInsightsResponse) => void): Request<DevOpsGuru.Types.ListInsightsResponse, AWSError>;
  /**
   *  Returns the list of all log groups that are being monitored and tagged by DevOps Guru. 
   */
  listMonitoredResources(params: DevOpsGuru.Types.ListMonitoredResourcesRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListMonitoredResourcesResponse) => void): Request<DevOpsGuru.Types.ListMonitoredResourcesResponse, AWSError>;
  /**
   *  Returns the list of all log groups that are being monitored and tagged by DevOps Guru. 
   */
  listMonitoredResources(callback?: (err: AWSError, data: DevOpsGuru.Types.ListMonitoredResourcesResponse) => void): Request<DevOpsGuru.Types.ListMonitoredResourcesResponse, AWSError>;
  /**
   *  Returns a list of notification channels configured for DevOps Guru. Each notification channel is used to notify you when DevOps Guru generates an insight that contains information about how to improve your operations. The one supported notification channel is Amazon Simple Notification Service (Amazon SNS). 
   */
  listNotificationChannels(params: DevOpsGuru.Types.ListNotificationChannelsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListNotificationChannelsResponse) => void): Request<DevOpsGuru.Types.ListNotificationChannelsResponse, AWSError>;
  /**
   *  Returns a list of notification channels configured for DevOps Guru. Each notification channel is used to notify you when DevOps Guru generates an insight that contains information about how to improve your operations. The one supported notification channel is Amazon Simple Notification Service (Amazon SNS). 
   */
  listNotificationChannels(callback?: (err: AWSError, data: DevOpsGuru.Types.ListNotificationChannelsResponse) => void): Request<DevOpsGuru.Types.ListNotificationChannelsResponse, AWSError>;
  /**
   * Returns a list of insights associated with the account or OU Id.
   */
  listOrganizationInsights(params: DevOpsGuru.Types.ListOrganizationInsightsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListOrganizationInsightsResponse) => void): Request<DevOpsGuru.Types.ListOrganizationInsightsResponse, AWSError>;
  /**
   * Returns a list of insights associated with the account or OU Id.
   */
  listOrganizationInsights(callback?: (err: AWSError, data: DevOpsGuru.Types.ListOrganizationInsightsResponse) => void): Request<DevOpsGuru.Types.ListOrganizationInsightsResponse, AWSError>;
  /**
   *  Returns a list of a specified insight's recommendations. Each recommendation includes a list of related metrics and a list of related events. 
   */
  listRecommendations(params: DevOpsGuru.Types.ListRecommendationsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListRecommendationsResponse) => void): Request<DevOpsGuru.Types.ListRecommendationsResponse, AWSError>;
  /**
   *  Returns a list of a specified insight's recommendations. Each recommendation includes a list of related metrics and a list of related events. 
   */
  listRecommendations(callback?: (err: AWSError, data: DevOpsGuru.Types.ListRecommendationsResponse) => void): Request<DevOpsGuru.Types.ListRecommendationsResponse, AWSError>;
  /**
   *  Collects customer feedback about the specified insight. 
   */
  putFeedback(params: DevOpsGuru.Types.PutFeedbackRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.PutFeedbackResponse) => void): Request<DevOpsGuru.Types.PutFeedbackResponse, AWSError>;
  /**
   *  Collects customer feedback about the specified insight. 
   */
  putFeedback(callback?: (err: AWSError, data: DevOpsGuru.Types.PutFeedbackResponse) => void): Request<DevOpsGuru.Types.PutFeedbackResponse, AWSError>;
  /**
   *  Removes a notification channel from DevOps Guru. A notification channel is used to notify you when DevOps Guru generates an insight that contains information about how to improve your operations. 
   */
  removeNotificationChannel(params: DevOpsGuru.Types.RemoveNotificationChannelRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.RemoveNotificationChannelResponse) => void): Request<DevOpsGuru.Types.RemoveNotificationChannelResponse, AWSError>;
  /**
   *  Removes a notification channel from DevOps Guru. A notification channel is used to notify you when DevOps Guru generates an insight that contains information about how to improve your operations. 
   */
  removeNotificationChannel(callback?: (err: AWSError, data: DevOpsGuru.Types.RemoveNotificationChannelResponse) => void): Request<DevOpsGuru.Types.RemoveNotificationChannelResponse, AWSError>;
  /**
   *  Returns a list of insights in your Amazon Web Services account. You can specify which insights are returned by their start time, one or more statuses (ONGOING or CLOSED), one or more severities (LOW, MEDIUM, and HIGH), and type (REACTIVE or PROACTIVE).   Use the Filters parameter to specify status and severity search parameters. Use the Type parameter to specify REACTIVE or PROACTIVE in your search. 
   */
  searchInsights(params: DevOpsGuru.Types.SearchInsightsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.SearchInsightsResponse) => void): Request<DevOpsGuru.Types.SearchInsightsResponse, AWSError>;
  /**
   *  Returns a list of insights in your Amazon Web Services account. You can specify which insights are returned by their start time, one or more statuses (ONGOING or CLOSED), one or more severities (LOW, MEDIUM, and HIGH), and type (REACTIVE or PROACTIVE).   Use the Filters parameter to specify status and severity search parameters. Use the Type parameter to specify REACTIVE or PROACTIVE in your search. 
   */
  searchInsights(callback?: (err: AWSError, data: DevOpsGuru.Types.SearchInsightsResponse) => void): Request<DevOpsGuru.Types.SearchInsightsResponse, AWSError>;
  /**
   *  Returns a list of insights in your organization. You can specify which insights are returned by their start time, one or more statuses (ONGOING, CLOSED, and CLOSED), one or more severities (LOW, MEDIUM, and HIGH), and type (REACTIVE or PROACTIVE).   Use the Filters parameter to specify status and severity search parameters. Use the Type parameter to specify REACTIVE or PROACTIVE in your search. 
   */
  searchOrganizationInsights(params: DevOpsGuru.Types.SearchOrganizationInsightsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.SearchOrganizationInsightsResponse) => void): Request<DevOpsGuru.Types.SearchOrganizationInsightsResponse, AWSError>;
  /**
   *  Returns a list of insights in your organization. You can specify which insights are returned by their start time, one or more statuses (ONGOING, CLOSED, and CLOSED), one or more severities (LOW, MEDIUM, and HIGH), and type (REACTIVE or PROACTIVE).   Use the Filters parameter to specify status and severity search parameters. Use the Type parameter to specify REACTIVE or PROACTIVE in your search. 
   */
  searchOrganizationInsights(callback?: (err: AWSError, data: DevOpsGuru.Types.SearchOrganizationInsightsResponse) => void): Request<DevOpsGuru.Types.SearchOrganizationInsightsResponse, AWSError>;
  /**
   * Starts the creation of an estimate of the monthly cost to analyze your Amazon Web Services resources.
   */
  startCostEstimation(params: DevOpsGuru.Types.StartCostEstimationRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.StartCostEstimationResponse) => void): Request<DevOpsGuru.Types.StartCostEstimationResponse, AWSError>;
  /**
   * Starts the creation of an estimate of the monthly cost to analyze your Amazon Web Services resources.
   */
  startCostEstimation(callback?: (err: AWSError, data: DevOpsGuru.Types.StartCostEstimationResponse) => void): Request<DevOpsGuru.Types.StartCostEstimationResponse, AWSError>;
  /**
   * Enables or disables integration with a service that can be integrated with DevOps Guru. The one service that can be integrated with DevOps Guru is Amazon CodeGuru Profiler, which can produce proactive recommendations which can be stored and viewed in DevOps Guru.
   */
  updateEventSourcesConfig(params: DevOpsGuru.Types.UpdateEventSourcesConfigRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.UpdateEventSourcesConfigResponse) => void): Request<DevOpsGuru.Types.UpdateEventSourcesConfigResponse, AWSError>;
  /**
   * Enables or disables integration with a service that can be integrated with DevOps Guru. The one service that can be integrated with DevOps Guru is Amazon CodeGuru Profiler, which can produce proactive recommendations which can be stored and viewed in DevOps Guru.
   */
  updateEventSourcesConfig(callback?: (err: AWSError, data: DevOpsGuru.Types.UpdateEventSourcesConfigResponse) => void): Request<DevOpsGuru.Types.UpdateEventSourcesConfigResponse, AWSError>;
  /**
   *  Updates the collection of resources that DevOps Guru analyzes. The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag key. You can specify up to 500 Amazon Web Services CloudFormation stacks. This method also creates the IAM role required for you to use DevOps Guru. 
   */
  updateResourceCollection(params: DevOpsGuru.Types.UpdateResourceCollectionRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.UpdateResourceCollectionResponse) => void): Request<DevOpsGuru.Types.UpdateResourceCollectionResponse, AWSError>;
  /**
   *  Updates the collection of resources that DevOps Guru analyzes. The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag key. You can specify up to 500 Amazon Web Services CloudFormation stacks. This method also creates the IAM role required for you to use DevOps Guru. 
   */
  updateResourceCollection(callback?: (err: AWSError, data: DevOpsGuru.Types.UpdateResourceCollectionResponse) => void): Request<DevOpsGuru.Types.UpdateResourceCollectionResponse, AWSError>;
  /**
   *  Enables or disables integration with a service that can be integrated with DevOps Guru. The one service that can be integrated with DevOps Guru is Amazon Web Services Systems Manager, which can be used to create an OpsItem for each generated insight. 
   */
  updateServiceIntegration(params: DevOpsGuru.Types.UpdateServiceIntegrationRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.UpdateServiceIntegrationResponse) => void): Request<DevOpsGuru.Types.UpdateServiceIntegrationResponse, AWSError>;
  /**
   *  Enables or disables integration with a service that can be integrated with DevOps Guru. The one service that can be integrated with DevOps Guru is Amazon Web Services Systems Manager, which can be used to create an OpsItem for each generated insight. 
   */
  updateServiceIntegration(callback?: (err: AWSError, data: DevOpsGuru.Types.UpdateServiceIntegrationResponse) => void): Request<DevOpsGuru.Types.UpdateServiceIntegrationResponse, AWSError>;
}
declare namespace DevOpsGuru {
  export interface AccountHealth {
    /**
     * The ID of the Amazon Web Services account. 
     */
    AccountId?: AwsAccountId;
    /**
     *  Information about the health of the Amazon Web Services resources in your account, including the number of open proactive, open reactive insights, and the Mean Time to Recover (MTTR) of closed insights. 
     */
    Insight?: AccountInsightHealth;
  }
  export type AccountHealths = AccountHealth[];
  export type AccountIdList = AwsAccountId[];
  export interface AccountInsightHealth {
    /**
     * An integer that specifies the number of open proactive insights in your Amazon Web Services account.
     */
    OpenProactiveInsights?: NumOpenProactiveInsights;
    /**
     * An integer that specifies the number of open reactive insights in your Amazon Web Services account.
     */
    OpenReactiveInsights?: NumOpenReactiveInsights;
  }
  export interface AddNotificationChannelRequest {
    /**
     *  A NotificationChannelConfig object that specifies what type of notification channel to add. The one supported notification channel is Amazon Simple Notification Service (Amazon SNS). 
     */
    Config: NotificationChannelConfig;
  }
  export interface AddNotificationChannelResponse {
    /**
     *  The ID of the added notification channel. 
     */
    Id: NotificationChannelId;
  }
  export interface AmazonCodeGuruProfilerIntegration {
    /**
     * The status of the CodeGuru Profiler integration. Specifies if DevOps Guru is enabled to consume recommendations that are generated from Amazon CodeGuru Profiler.
     */
    Status?: EventSourceOptInStatus;
  }
  export type AnalyzedResourceCount = number;
  export interface AnomalousLogGroup {
    /**
     *  The name of the CloudWatch log group. 
     */
    LogGroupName?: LogGroupName;
    /**
     *  The time the anomalous log events began. The impact start time indicates the time of the first log anomaly event that occurs. 
     */
    ImpactStartTime?: Timestamp;
    /**
     *  The time the anomalous log events stopped. 
     */
    ImpactEndTime?: Timestamp;
    /**
     *  The number of log lines that were scanned for anomalous log events. 
     */
    NumberOfLogLinesScanned?: NumberOfLogLinesScanned;
    /**
     *  The log anomalies in the log group. Each log anomaly displayed represents a cluster of similar anomalous log events. 
     */
    LogAnomalyShowcases?: LogAnomalyShowcases;
  }
  export type AnomalousLogGroups = AnomalousLogGroup[];
  export type AnomalyDescription = string;
  export type AnomalyId = string;
  export type AnomalyLimit = number;
  export type AnomalyName = string;
  export interface AnomalyReportedTimeRange {
    /**
     *  The time when an anomaly is opened. 
     */
    OpenTime: Timestamp;
    /**
     *  The time when an anomaly is closed. 
     */
    CloseTime?: Timestamp;
  }
  export interface AnomalyResource {
    /**
     * The name of the Amazon Web Services resource.
     */
    Name?: ResourceName;
    /**
     * The type of the Amazon Web Services resource.
     */
    Type?: ResourceType;
  }
  export type AnomalyResources = AnomalyResource[];
  export type AnomalySeverity = "LOW"|"MEDIUM"|"HIGH"|string;
  export type AnomalySource = string;
  export interface AnomalySourceDetails {
    /**
     * An array of CloudWatchMetricsDetail objects that contain information about analyzed CloudWatch metrics that show anomalous behavior. 
     */
    CloudWatchMetrics?: CloudWatchMetricsDetails;
    /**
     * An array of PerformanceInsightsMetricsDetail objects that contain information about analyzed Performance Insights metrics that show anomalous behavior.
     */
    PerformanceInsightsMetrics?: PerformanceInsightsMetricsDetails;
  }
  export interface AnomalySourceMetadata {
    /**
     * The source of the anomaly.
     */
    Source?: AnomalySource;
    /**
     * The name of the anomaly's resource.
     */
    SourceResourceName?: ResourceName;
    /**
     * The anomaly's resource type.
     */
    SourceResourceType?: ResourceType;
  }
  export type AnomalyStatus = "ONGOING"|"CLOSED"|string;
  export interface AnomalyTimeRange {
    /**
     *  The time when the anomalous behavior started. 
     */
    StartTime: Timestamp;
    /**
     *  The time when the anomalous behavior ended. 
     */
    EndTime?: Timestamp;
  }
  export type AnomalyType = "CAUSAL"|"CONTEXTUAL"|string;
  export type AppBoundaryKey = string;
  export type AssociatedResourceArns = ResourceArn[];
  export type AwsAccountId = string;
  export type Channels = NotificationChannel[];
  export type ClientToken = string;
  export interface CloudFormationCollection {
    /**
     *  An array of CloudFormation stack names. 
     */
    StackNames?: StackNames;
  }
  export interface CloudFormationCollectionFilter {
    /**
     *  An array of CloudFormation stack names. 
     */
    StackNames?: StackNames;
  }
  export interface CloudFormationCostEstimationResourceCollectionFilter {
    /**
     * An array of CloudFormation stack names. Its size is fixed at 1 item.
     */
    StackNames?: CostEstimationStackNames;
  }
  export interface CloudFormationHealth {
    /**
     *  The name of the CloudFormation stack. 
     */
    StackName?: StackName;
    /**
     *  Information about the health of the Amazon Web Services resources in your account that are specified by an Amazon Web Services CloudFormation stack, including the number of open proactive, open reactive insights, and the Mean Time to Recover (MTTR) of closed insights. 
     */
    Insight?: InsightHealth;
    /**
     *  Number of resources that DevOps Guru is monitoring in your account that are specified by an Amazon Web Services CloudFormation stack. 
     */
    AnalyzedResourceCount?: AnalyzedResourceCount;
  }
  export type CloudFormationHealths = CloudFormationHealth[];
  export type CloudWatchMetricDataStatusCode = "Complete"|"InternalError"|"PartialData"|string;
  export interface CloudWatchMetricsDataSummary {
    /**
     * This is a list of Amazon CloudWatch metric values at given timestamp.
     */
    TimestampMetricValuePairList?: TimestampMetricValuePairList;
    /**
     * This is an enum of the status showing whether the metric value pair list has partial or complete data, or if there was an error.
     */
    StatusCode?: CloudWatchMetricDataStatusCode;
  }
  export interface CloudWatchMetricsDetail {
    /**
     *  The name of the CloudWatch metric. 
     */
    MetricName?: CloudWatchMetricsMetricName;
    /**
     *  The namespace of the CloudWatch metric. A namespace is a container for CloudWatch metrics. 
     */
    Namespace?: CloudWatchMetricsNamespace;
    /**
     *  An array of CloudWatch dimensions associated with 
     */
    Dimensions?: CloudWatchMetricsDimensions;
    /**
     *  The type of statistic associated with the CloudWatch metric. For more information, see Statistics in the Amazon CloudWatch User Guide. 
     */
    Stat?: CloudWatchMetricsStat;
    /**
     *  The unit of measure used for the CloudWatch metric. For example, Bytes, Seconds, Count, and Percent. 
     */
    Unit?: CloudWatchMetricsUnit;
    /**
     *  The length of time associated with the CloudWatch metric in number of seconds. 
     */
    Period?: CloudWatchMetricsPeriod;
    /**
     * This object returns anomaly metric data.
     */
    MetricDataSummary?: CloudWatchMetricsDataSummary;
  }
  export type CloudWatchMetricsDetails = CloudWatchMetricsDetail[];
  export interface CloudWatchMetricsDimension {
    /**
     *  The name of the CloudWatch dimension. 
     */
    Name?: CloudWatchMetricsDimensionName;
    /**
     *  The value of the CloudWatch dimension. 
     */
    Value?: CloudWatchMetricsDimensionValue;
  }
  export type CloudWatchMetricsDimensionName = string;
  export type CloudWatchMetricsDimensionValue = string;
  export type CloudWatchMetricsDimensions = CloudWatchMetricsDimension[];
  export type CloudWatchMetricsMetricName = string;
  export type CloudWatchMetricsNamespace = string;
  export type CloudWatchMetricsPeriod = number;
  export type CloudWatchMetricsStat = "Sum"|"Average"|"SampleCount"|"Minimum"|"Maximum"|"p99"|"p90"|"p50"|string;
  export type CloudWatchMetricsUnit = string;
  export type Cost = number;
  export interface CostEstimationResourceCollectionFilter {
    /**
     * An object that specifies the CloudFormation stack that defines the Amazon Web Services resources used to create a monthly estimate for DevOps Guru.
     */
    CloudFormation?: CloudFormationCostEstimationResourceCollectionFilter;
    /**
     * The Amazon Web Services tags used to filter the resource collection that is used for a cost estimate. Tags help you identify and organize your Amazon Web Services resources. Many Amazon Web Services services support tagging, so you can assign the same tag to resources from different services to indicate that the resources are related. For example, you can assign the same tag to an Amazon DynamoDB table resource that you assign to an Lambda function. For more information about using tags, see the Tagging best practices whitepaper.  Each Amazon Web Services tag has two parts.    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case-sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive.   Together these are known as key-value pairs.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    Tags?: TagCostEstimationResourceCollectionFilters;
  }
  export type CostEstimationServiceResourceCount = number;
  export type CostEstimationServiceResourceState = "ACTIVE"|"INACTIVE"|string;
  export type CostEstimationStackNames = StackName[];
  export type CostEstimationStatus = "ONGOING"|"COMPLETED"|string;
  export type CostEstimationTagValues = TagValue[];
  export interface CostEstimationTimeRange {
    /**
     * The start time of the cost estimation.
     */
    StartTime?: Timestamp;
    /**
     * The end time of the cost estimation.
     */
    EndTime?: Timestamp;
  }
  export interface DeleteInsightRequest {
    /**
     * The ID of the insight.
     */
    Id: InsightId;
  }
  export interface DeleteInsightResponse {
  }
  export interface DescribeAccountHealthRequest {
  }
  export interface DescribeAccountHealthResponse {
    /**
     *  An integer that specifies the number of open reactive insights in your Amazon Web Services account. 
     */
    OpenReactiveInsights: NumOpenReactiveInsights;
    /**
     *  An integer that specifies the number of open proactive insights in your Amazon Web Services account. 
     */
    OpenProactiveInsights: NumOpenProactiveInsights;
    /**
     *  An integer that specifies the number of metrics that have been analyzed in your Amazon Web Services account. 
     */
    MetricsAnalyzed: NumMetricsAnalyzed;
    /**
     * The number of Amazon DevOps Guru resource analysis hours billed to the current Amazon Web Services account in the last hour. 
     */
    ResourceHours: ResourceHours;
    /**
     *  Number of resources that DevOps Guru is monitoring in your Amazon Web Services account. 
     */
    AnalyzedResourceCount?: AnalyzedResourceCount;
  }
  export interface DescribeAccountOverviewRequest {
    /**
     *  The start of the time range passed in. The start time granularity is at the day level. The floor of the start time is used. Returned information occurred after this day. 
     */
    FromTime: Timestamp;
    /**
     *  The end of the time range passed in. The start time granularity is at the day level. The floor of the start time is used. Returned information occurred before this day. If this is not specified, then the current day is used. 
     */
    ToTime?: Timestamp;
  }
  export interface DescribeAccountOverviewResponse {
    /**
     *  An integer that specifies the number of open reactive insights in your Amazon Web Services account that were created during the time range passed in. 
     */
    ReactiveInsights: NumReactiveInsights;
    /**
     *  An integer that specifies the number of open proactive insights in your Amazon Web Services account that were created during the time range passed in. 
     */
    ProactiveInsights: NumProactiveInsights;
    /**
     *  The Mean Time to Recover (MTTR) for all closed insights that were created during the time range passed in. 
     */
    MeanTimeToRecoverInMilliseconds: MeanTimeToRecoverInMilliseconds;
  }
  export interface DescribeAnomalyRequest {
    /**
     *  The ID of the anomaly. 
     */
    Id: AnomalyId;
    /**
     * The ID of the member account.
     */
    AccountId?: AwsAccountId;
  }
  export interface DescribeAnomalyResponse {
    /**
     *  A ProactiveAnomaly object that represents the requested anomaly. 
     */
    ProactiveAnomaly?: ProactiveAnomaly;
    /**
     *  A ReactiveAnomaly object that represents the requested anomaly. 
     */
    ReactiveAnomaly?: ReactiveAnomaly;
  }
  export interface DescribeEventSourcesConfigRequest {
  }
  export interface DescribeEventSourcesConfigResponse {
    /**
     * Lists the event sources in the configuration.
     */
    EventSources?: EventSourcesConfig;
  }
  export interface DescribeFeedbackRequest {
    /**
     *  The ID of the insight for which the feedback was provided. 
     */
    InsightId?: InsightId;
  }
  export interface DescribeFeedbackResponse {
    InsightFeedback?: InsightFeedback;
  }
  export interface DescribeInsightRequest {
    /**
     *  The ID of the insight. 
     */
    Id: InsightId;
    /**
     * The ID of the member account in the organization.
     */
    AccountId?: AwsAccountId;
  }
  export interface DescribeInsightResponse {
    /**
     *  A ProactiveInsight object that represents the requested insight. 
     */
    ProactiveInsight?: ProactiveInsight;
    /**
     *  A ReactiveInsight object that represents the requested insight. 
     */
    ReactiveInsight?: ReactiveInsight;
  }
  export interface DescribeOrganizationHealthRequest {
    /**
     * The ID of the Amazon Web Services account.
     */
    AccountIds?: AccountIdList;
    /**
     * The ID of the organizational unit.
     */
    OrganizationalUnitIds?: OrganizationalUnitIdList;
  }
  export interface DescribeOrganizationHealthResponse {
    /**
     * An integer that specifies the number of open reactive insights in your Amazon Web Services account.
     */
    OpenReactiveInsights: NumOpenReactiveInsights;
    /**
     * An integer that specifies the number of open proactive insights in your Amazon Web Services account.
     */
    OpenProactiveInsights: NumOpenProactiveInsights;
    /**
     * An integer that specifies the number of metrics that have been analyzed in your organization.
     */
    MetricsAnalyzed: NumMetricsAnalyzed;
    /**
     * The number of Amazon DevOps Guru resource analysis hours billed to the current Amazon Web Services account in the last hour. 
     */
    ResourceHours: ResourceHours;
  }
  export interface DescribeOrganizationOverviewRequest {
    /**
     *  The start of the time range passed in. The start time granularity is at the day level. The floor of the start time is used. Returned information occurred after this day. 
     */
    FromTime: Timestamp;
    /**
     *  The end of the time range passed in. The start time granularity is at the day level. The floor of the start time is used. Returned information occurred before this day. If this is not specified, then the current day is used. 
     */
    ToTime?: Timestamp;
    /**
     * The ID of the Amazon Web Services account.
     */
    AccountIds?: AccountIdList;
    /**
     * The ID of the organizational unit.
     */
    OrganizationalUnitIds?: OrganizationalUnitIdList;
  }
  export interface DescribeOrganizationOverviewResponse {
    /**
     * An integer that specifies the number of open reactive insights in your Amazon Web Services account.
     */
    ReactiveInsights: NumReactiveInsights;
    /**
     * An integer that specifies the number of open proactive insights in your Amazon Web Services account.
     */
    ProactiveInsights: NumProactiveInsights;
  }
  export interface DescribeOrganizationResourceCollectionHealthRequest {
    /**
     *  An Amazon Web Services resource collection type. This type specifies how analyzed Amazon Web Services resources are defined. The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag key. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
     */
    OrganizationResourceCollectionType: OrganizationResourceCollectionType;
    /**
     * The ID of the Amazon Web Services account.
     */
    AccountIds?: AccountIdList;
    /**
     * The ID of the organizational unit.
     */
    OrganizationalUnitIds?: OrganizationalUnitIdList;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: OrganizationResourceCollectionMaxResults;
  }
  export interface DescribeOrganizationResourceCollectionHealthResponse {
    /**
     * The returned CloudFormationHealthOverview object that contains an InsightHealthOverview object with the requested system health information.
     */
    CloudFormation?: CloudFormationHealths;
    /**
     * An array of ServiceHealth objects that describes the health of the Amazon Web Services services associated with the resources in the collection.
     */
    Service?: ServiceHealths;
    /**
     * The name of the organization's account.
     */
    Account?: AccountHealths;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
    /**
     * Tags help you identify and organize your Amazon Web Services resources. Many Amazon Web Services services support tagging, so you can assign the same tag to resources from different services to indicate that the resources are related. For example, you can assign the same tag to an Amazon DynamoDB table resource that you assign to an Lambda function. For more information about using tags, see the Tagging best practices whitepaper.  Each Amazon Web Services tag has two parts.    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case-sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive.   Together these are known as key-value pairs.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    Tags?: TagHealths;
  }
  export interface DescribeResourceCollectionHealthRequest {
    /**
     *  An Amazon Web Services resource collection type. This type specifies how analyzed Amazon Web Services resources are defined. The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag key. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
     */
    ResourceCollectionType: ResourceCollectionType;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
  }
  export interface DescribeResourceCollectionHealthResponse {
    /**
     *  The returned CloudFormationHealthOverview object that contains an InsightHealthOverview object with the requested system health information. 
     */
    CloudFormation?: CloudFormationHealths;
    /**
     * An array of ServiceHealth objects that describes the health of the Amazon Web Services services associated with the resources in the collection.
     */
    Service?: ServiceHealths;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
    /**
     * The Amazon Web Services tags that are used by resources in the resource collection. Tags help you identify and organize your Amazon Web Services resources. Many Amazon Web Services services support tagging, so you can assign the same tag to resources from different services to indicate that the resources are related. For example, you can assign the same tag to an Amazon DynamoDB table resource that you assign to an Lambda function. For more information about using tags, see the Tagging best practices whitepaper.  Each Amazon Web Services tag has two parts.    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case-sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive.   Together these are known as key-value pairs.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    Tags?: TagHealths;
  }
  export interface DescribeServiceIntegrationRequest {
  }
  export interface DescribeServiceIntegrationResponse {
    ServiceIntegration?: ServiceIntegrationConfig;
  }
  export interface EndTimeRange {
    /**
     *  The earliest end time in the time range. 
     */
    FromTime?: Timestamp;
    /**
     *  The latest end time in the time range. 
     */
    ToTime?: Timestamp;
  }
  export interface Event {
    ResourceCollection?: ResourceCollection;
    /**
     *  The ID of the event. 
     */
    Id?: EventId;
    /**
     *  A Timestamp that specifies the time the event occurred. 
     */
    Time?: Timestamp;
    /**
     *  The Amazon Web Services source that emitted the event. 
     */
    EventSource?: EventSource;
    /**
     *  The name of the event. 
     */
    Name?: EventName;
    /**
     *  The source, AWS_CLOUD_TRAIL or AWS_CODE_DEPLOY, where DevOps Guru analysis found the event. 
     */
    DataSource?: EventDataSource;
    /**
     *  The class of the event. The class specifies what the event is related to, such as an infrastructure change, a deployment, or a schema change. 
     */
    EventClass?: EventClass;
    /**
     *  An EventResource object that contains information about the resource that emitted the event. 
     */
    Resources?: EventResources;
  }
  export type EventClass = "INFRASTRUCTURE"|"DEPLOYMENT"|"SECURITY_CHANGE"|"CONFIG_CHANGE"|"SCHEMA_CHANGE"|string;
  export type EventDataSource = "AWS_CLOUD_TRAIL"|"AWS_CODE_DEPLOY"|string;
  export type EventId = string;
  export type EventName = string;
  export interface EventResource {
    /**
     *  The type of resource that emitted an event. 
     */
    Type?: EventResourceType;
    /**
     *  The name of the resource that emitted an event. 
     */
    Name?: EventResourceName;
    /**
     *  The Amazon Resource Name (ARN) of the resource that emitted an event. 
     */
    Arn?: EventResourceArn;
  }
  export type EventResourceArn = string;
  export type EventResourceName = string;
  export type EventResourceType = string;
  export type EventResources = EventResource[];
  export type EventSource = string;
  export type EventSourceOptInStatus = "ENABLED"|"DISABLED"|string;
  export interface EventSourcesConfig {
    /**
     * Information about whether DevOps Guru is configured to consume recommendations which are generated from AWS CodeGuru Profiler.
     */
    AmazonCodeGuruProfiler?: AmazonCodeGuruProfilerIntegration;
  }
  export interface EventTimeRange {
    /**
     *  The time when the event started. 
     */
    FromTime: Timestamp;
    /**
     *  The time when the event ended. 
     */
    ToTime: Timestamp;
  }
  export type Events = Event[];
  export type Explanation = string;
  export interface GetCostEstimationRequest {
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
  }
  export interface GetCostEstimationResponse {
    /**
     * The collection of the Amazon Web Services resources used to create your monthly DevOps Guru cost estimate.
     */
    ResourceCollection?: CostEstimationResourceCollectionFilter;
    /**
     * The status of creating this cost estimate. If it's still in progress, the status ONGOING is returned. If it is finished, the status COMPLETED is returned.
     */
    Status?: CostEstimationStatus;
    /**
     * An array of ResourceCost objects that each contains details about the monthly cost estimate to analyze one of your Amazon Web Services resources.
     */
    Costs?: ServiceResourceCosts;
    /**
     * The start and end time of the cost estimation.
     */
    TimeRange?: CostEstimationTimeRange;
    /**
     * The estimated monthly cost to analyze the Amazon Web Services resources. This value is the sum of the estimated costs to analyze each resource in the Costs object in this response.
     */
    TotalCost?: Cost;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export interface GetResourceCollectionRequest {
    /**
     *  The type of Amazon Web Services resource collections to return. The one valid value is CLOUD_FORMATION for Amazon Web Services CloudFormation stacks. 
     */
    ResourceCollectionType: ResourceCollectionType;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
  }
  export interface GetResourceCollectionResponse {
    /**
     *  The requested list of Amazon Web Services resource collections. The two types of Amazon Web Services resource collections supported are Amazon Web Services CloudFormation stacks and Amazon Web Services resources that contain the same Amazon Web Services tag. DevOps Guru can be configured to analyze the Amazon Web Services resources that are defined in the stacks or that are tagged using the same tag key. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
     */
    ResourceCollection?: ResourceCollectionFilter;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export type InsightDescription = string;
  export interface InsightFeedback {
    /**
     *  The insight feedback ID. 
     */
    Id?: InsightId;
    /**
     *  The feedback provided by the customer. 
     */
    Feedback?: InsightFeedbackOption;
  }
  export type InsightFeedbackOption = "VALID_COLLECTION"|"RECOMMENDATION_USEFUL"|"ALERT_TOO_SENSITIVE"|"DATA_NOISY_ANOMALY"|"DATA_INCORRECT"|string;
  export interface InsightHealth {
    /**
     *  The number of open proactive insights. 
     */
    OpenProactiveInsights?: NumOpenProactiveInsights;
    /**
     *  The number of open reactive insights. 
     */
    OpenReactiveInsights?: NumOpenReactiveInsights;
    /**
     *  The Meant Time to Recover (MTTR) for the insight. 
     */
    MeanTimeToRecoverInMilliseconds?: MeanTimeToRecoverInMilliseconds;
  }
  export type InsightId = string;
  export type InsightName = string;
  export type InsightSeverities = InsightSeverity[];
  export type InsightSeverity = "LOW"|"MEDIUM"|"HIGH"|string;
  export type InsightStatus = "ONGOING"|"CLOSED"|string;
  export type InsightStatuses = InsightStatus[];
  export interface InsightTimeRange {
    /**
     *  The time when the behavior described in an insight started. 
     */
    StartTime: Timestamp;
    /**
     *  The time when the behavior described in an insight ended. 
     */
    EndTime?: Timestamp;
  }
  export type InsightType = "REACTIVE"|"PROACTIVE"|string;
  export type KMSKeyId = string;
  export interface KMSServerSideEncryptionIntegration {
    /**
     *  Describes the specified KMS key.  To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". If you specify a predefined Amazon Web Services alias (an Amazon Web Services alias with no key ID), Amazon Web Services KMS associates the alias with an Amazon Web Services managed key and returns its KeyId and Arn in the response. To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:  Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab Alias name: alias/ExampleAlias Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias
     */
    KMSKeyId?: KMSKeyId;
    /**
     *  Specifies if DevOps Guru is enabled for customer managed keys. 
     */
    OptInStatus?: OptInStatus;
    /**
     *  The type of KMS key used. Customer managed keys are the KMS keys that you create. Amazon Web Services owned keys are keys that are owned and managed by DevOps Guru. 
     */
    Type?: ServerSideEncryptionType;
  }
  export interface KMSServerSideEncryptionIntegrationConfig {
    /**
     *  Describes the specified KMS key. To specify a KMS key, use its key ID, key ARN, alias name, or alias ARN. When using an alias name, prefix it with "alias/". If you specify a predefined Amazon Web Services alias (an Amazon Web Services alias with no key ID), Amazon Web Services KMS associates the alias with an Amazon Web Services managed key and returns its KeyId and Arn in the response. To specify a KMS key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:  Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab Alias name: alias/ExampleAlias Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias
     */
    KMSKeyId?: KMSKeyId;
    /**
     *  Specifies if DevOps Guru is enabled for KMS integration. 
     */
    OptInStatus?: OptInStatus;
    /**
     *  The type of KMS key used. Customer managed keys are the KMS keys that you create. Amazon Web Services owned keys are keys that are owned and managed by DevOps Guru. 
     */
    Type?: ServerSideEncryptionType;
  }
  export interface ListAnomaliesForInsightFilters {
    ServiceCollection?: ServiceCollection;
  }
  export type ListAnomaliesForInsightMaxResults = number;
  export interface ListAnomaliesForInsightRequest {
    /**
     *  The ID of the insight. The returned anomalies belong to this insight. 
     */
    InsightId: InsightId;
    /**
     *  A time range used to specify when the requested anomalies started. All returned anomalies started during this time range. 
     */
    StartTimeRange?: StartTimeRange;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: ListAnomaliesForInsightMaxResults;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
    /**
     * The ID of the Amazon Web Services account. 
     */
    AccountId?: AwsAccountId;
    /**
     *  Specifies one or more service names that are used to list anomalies. 
     */
    Filters?: ListAnomaliesForInsightFilters;
  }
  export interface ListAnomaliesForInsightResponse {
    /**
     *  An array of ProactiveAnomalySummary objects that represent the requested anomalies 
     */
    ProactiveAnomalies?: ProactiveAnomalies;
    /**
     *  An array of ReactiveAnomalySummary objects that represent the requested anomalies 
     */
    ReactiveAnomalies?: ReactiveAnomalies;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export type ListAnomalousLogGroupsMaxResults = number;
  export interface ListAnomalousLogGroupsRequest {
    /**
     *  The ID of the insight containing the log groups. 
     */
    InsightId: InsightId;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: ListAnomalousLogGroupsMaxResults;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
  }
  export interface ListAnomalousLogGroupsResponse {
    /**
     *  The ID of the insight containing the log groups. 
     */
    InsightId: InsightId;
    /**
     *  The list of Amazon CloudWatch log groups that are related to an insight. 
     */
    AnomalousLogGroups: AnomalousLogGroups;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export interface ListEventsFilters {
    /**
     *  An ID of an insight that is related to the events you want to filter for. 
     */
    InsightId?: InsightId;
    /**
     *  A time range during which you want the filtered events to have occurred. 
     */
    EventTimeRange?: EventTimeRange;
    /**
     *  The class of the events you want to filter for, such as an infrastructure change, a deployment, or a schema change. 
     */
    EventClass?: EventClass;
    /**
     *  The Amazon Web Services source that emitted the events you want to filter for. 
     */
    EventSource?: EventSource;
    /**
     *  The source, AWS_CLOUD_TRAIL or AWS_CODE_DEPLOY, of the events you want returned. 
     */
    DataSource?: EventDataSource;
    ResourceCollection?: ResourceCollection;
  }
  export type ListEventsMaxResults = number;
  export interface ListEventsRequest {
    /**
     *  A ListEventsFilters object used to specify which events to return. 
     */
    Filters: ListEventsFilters;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: ListEventsMaxResults;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
    /**
     * The ID of the Amazon Web Services account. 
     */
    AccountId?: AwsAccountId;
  }
  export interface ListEventsResponse {
    /**
     *  A list of the requested events. 
     */
    Events: Events;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export type ListInsightsAccountIdList = AwsAccountId[];
  export interface ListInsightsAnyStatusFilter {
    /**
     *  Use to filter for either REACTIVE or PROACTIVE insights. 
     */
    Type: InsightType;
    /**
     *  A time range used to specify when the behavior of the filtered insights started. 
     */
    StartTimeRange: StartTimeRange;
  }
  export interface ListInsightsClosedStatusFilter {
    /**
     *  Use to filter for either REACTIVE or PROACTIVE insights. 
     */
    Type: InsightType;
    /**
     *  A time range used to specify when the behavior of the filtered insights ended. 
     */
    EndTimeRange: EndTimeRange;
  }
  export type ListInsightsMaxResults = number;
  export interface ListInsightsOngoingStatusFilter {
    /**
     *  Use to filter for either REACTIVE or PROACTIVE insights. 
     */
    Type: InsightType;
  }
  export type ListInsightsOrganizationalUnitIdList = OrganizationalUnitId[];
  export interface ListInsightsRequest {
    /**
     *  A filter used to filter the returned insights by their status. You can specify one status filter. 
     */
    StatusFilter: ListInsightsStatusFilter;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: ListInsightsMaxResults;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
  }
  export interface ListInsightsResponse {
    /**
     *  The returned list of proactive insights. 
     */
    ProactiveInsights?: ProactiveInsights;
    /**
     *  The returned list of reactive insights. 
     */
    ReactiveInsights?: ReactiveInsights;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export interface ListInsightsStatusFilter {
    /**
     *  A ListInsightsAnyStatusFilter that specifies ongoing insights that are either REACTIVE or PROACTIVE. 
     */
    Ongoing?: ListInsightsOngoingStatusFilter;
    /**
     *  A ListInsightsClosedStatusFilter that specifies closed insights that are either REACTIVE or PROACTIVE. 
     */
    Closed?: ListInsightsClosedStatusFilter;
    /**
     *  A ListInsightsAnyStatusFilter that specifies insights of any status that are either REACTIVE or PROACTIVE. 
     */
    Any?: ListInsightsAnyStatusFilter;
  }
  export interface ListMonitoredResourcesFilters {
    /**
     *  The permission status of a resource. 
     */
    ResourcePermission: ResourcePermission;
    /**
     *  The type of resource that you wish to retrieve, such as log groups. 
     */
    ResourceTypeFilters: ResourceTypeFilters;
  }
  export type ListMonitoredResourcesMaxResults = number;
  export interface ListMonitoredResourcesRequest {
    /**
     *  Filters to determine which monitored resources you want to retrieve. You can filter by resource type or resource permission status. 
     */
    Filters?: ListMonitoredResourcesFilters;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: ListMonitoredResourcesMaxResults;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
  }
  export interface ListMonitoredResourcesResponse {
    /**
     *  Information about the resource that is being monitored, including the name of the resource, the type of resource, and whether or not permission is given to DevOps Guru to access that resource. 
     */
    MonitoredResourceIdentifiers: MonitoredResourceIdentifiers;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export interface ListNotificationChannelsRequest {
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
  }
  export interface ListNotificationChannelsResponse {
    /**
     *  An array that contains the requested notification channels. 
     */
    Channels?: Channels;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export interface ListOrganizationInsightsRequest {
    StatusFilter: ListInsightsStatusFilter;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: ListInsightsMaxResults;
    /**
     * The ID of the Amazon Web Services account. 
     */
    AccountIds?: ListInsightsAccountIdList;
    /**
     * The ID of the organizational unit.
     */
    OrganizationalUnitIds?: ListInsightsOrganizationalUnitIdList;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
  }
  export interface ListOrganizationInsightsResponse {
    /**
     * An integer that specifies the number of open proactive insights in your Amazon Web Services account.
     */
    ProactiveInsights?: ProactiveOrganizationInsights;
    /**
     * An integer that specifies the number of open reactive insights in your Amazon Web Services account.
     */
    ReactiveInsights?: ReactiveOrganizationInsights;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export interface ListRecommendationsRequest {
    /**
     *  The ID of the requested insight. 
     */
    InsightId: InsightId;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
    /**
     * A locale that specifies the language to use for recommendations.
     */
    Locale?: Locale;
    /**
     * The ID of the Amazon Web Services account. 
     */
    AccountId?: AwsAccountId;
  }
  export interface ListRecommendationsResponse {
    /**
     *  An array of the requested recommendations. 
     */
    Recommendations?: Recommendations;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export type Locale = "DE_DE"|"EN_US"|"EN_GB"|"ES_ES"|"FR_FR"|"IT_IT"|"JA_JP"|"KO_KR"|"PT_BR"|"ZH_CN"|"ZH_TW"|string;
  export interface LogAnomalyClass {
    /**
     *  The name of the Amazon CloudWatch log stream that the anomalous log event belongs to. A log stream is a sequence of log events that share the same source. 
     */
    LogStreamName?: LogStreamName;
    /**
     *  The type of log anomaly that has been detected. 
     */
    LogAnomalyType?: LogAnomalyType;
    /**
     *  The token where the anomaly was detected. This may refer to an exception or another location, or it may be blank for log anomalies such as format anomalies. 
     */
    LogAnomalyToken?: LogAnomalyToken;
    /**
     *  The ID of the log event. 
     */
    LogEventId?: LogEventId;
    /**
     *  The explanation for why the log event is considered an anomaly. 
     */
    Explanation?: Explanation;
    /**
     *  The number of log lines where this anomalous log event occurs. 
     */
    NumberOfLogLinesOccurrences?: NumberOfLogLinesOccurrences;
    /**
     *  The time of the first occurrence of the anomalous log event. 
     */
    LogEventTimestamp?: Timestamp;
  }
  export type LogAnomalyClasses = LogAnomalyClass[];
  export interface LogAnomalyShowcase {
    /**
     *  A list of anomalous log events that may be related. 
     */
    LogAnomalyClasses?: LogAnomalyClasses;
  }
  export type LogAnomalyShowcases = LogAnomalyShowcase[];
  export type LogAnomalyToken = string;
  export type LogAnomalyType = "KEYWORD"|"KEYWORD_TOKEN"|"FORMAT"|"HTTP_CODE"|"BLOCK_FORMAT"|"NUMERICAL_POINT"|"NUMERICAL_NAN"|"NEW_FIELD_NAME"|string;
  export type LogEventId = string;
  export type LogGroupName = string;
  export type LogStreamName = string;
  export interface LogsAnomalyDetectionIntegration {
    /**
     * Specifies if DevOps Guru is configured to perform log anomaly detection on CloudWatch log groups.
     */
    OptInStatus?: OptInStatus;
  }
  export interface LogsAnomalyDetectionIntegrationConfig {
    /**
     * Specifies if DevOps Guru is configured to perform log anomaly detection on CloudWatch log groups.
     */
    OptInStatus?: OptInStatus;
  }
  export type MeanTimeToRecoverInMilliseconds = number;
  export type MetricValue = number;
  export interface MonitoredResourceIdentifier {
    /**
     *  The name of the resource being monitored. 
     */
    MonitoredResourceName?: MonitoredResourceName;
    /**
     *  The type of resource being monitored. 
     */
    Type?: ResourceType;
    /**
     *  The permission status of a resource. 
     */
    ResourcePermission?: ResourcePermission;
    /**
     *  The time at which DevOps Guru last updated this resource. 
     */
    LastUpdated?: Timestamp;
    ResourceCollection?: ResourceCollection;
  }
  export type MonitoredResourceIdentifiers = MonitoredResourceIdentifier[];
  export type MonitoredResourceName = string;
  export interface NotificationChannel {
    /**
     *  The ID of a notification channel. 
     */
    Id?: NotificationChannelId;
    /**
     *  A NotificationChannelConfig object that contains information about configured notification channels. 
     */
    Config?: NotificationChannelConfig;
  }
  export interface NotificationChannelConfig {
    /**
     *  Information about a notification channel configured in DevOps Guru to send notifications when insights are created.  If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to send it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. DevOps Guru only supports standard SNS topics. For more information, see Permissions for Amazon SNS topics. If you use an Amazon SNS topic that is encrypted by an Amazon Web Services Key Management Service customer-managed key (CMK), then you must add permissions to the CMK. For more information, see Permissions for Amazon Web Services KMS–encrypted Amazon SNS topics.
     */
    Sns: SnsChannelConfig;
    /**
     *  The filter configurations for the Amazon SNS notification topic you use with DevOps Guru. If you do not provide filter configurations, the default configurations are to receive notifications for all message types of High or Medium severity. 
     */
    Filters?: NotificationFilterConfig;
  }
  export type NotificationChannelId = string;
  export interface NotificationFilterConfig {
    /**
     *  The severity levels that you want to receive notifications for. For example, you can choose to receive notifications only for insights with HIGH and MEDIUM severity levels. For more information, see Understanding insight severities. 
     */
    Severities?: InsightSeverities;
    /**
     *  The events that you want to receive notifications for. For example, you can choose to receive notifications only when the severity level is upgraded or a new insight is created. 
     */
    MessageTypes?: NotificationMessageTypes;
  }
  export type NotificationMessageType = "NEW_INSIGHT"|"CLOSED_INSIGHT"|"NEW_ASSOCIATION"|"SEVERITY_UPGRADED"|"NEW_RECOMMENDATION"|string;
  export type NotificationMessageTypes = NotificationMessageType[];
  export type NumMetricsAnalyzed = number;
  export type NumOpenProactiveInsights = number;
  export type NumOpenReactiveInsights = number;
  export type NumProactiveInsights = number;
  export type NumReactiveInsights = number;
  export type NumberOfLogLinesOccurrences = number;
  export type NumberOfLogLinesScanned = number;
  export interface OpsCenterIntegration {
    /**
     *  Specifies if DevOps Guru is enabled to create an Amazon Web Services Systems Manager OpsItem for each created insight. 
     */
    OptInStatus?: OptInStatus;
  }
  export interface OpsCenterIntegrationConfig {
    /**
     *  Specifies if DevOps Guru is enabled to create an Amazon Web Services Systems Manager OpsItem for each created insight. 
     */
    OptInStatus?: OptInStatus;
  }
  export type OptInStatus = "ENABLED"|"DISABLED"|string;
  export type OrganizationResourceCollectionMaxResults = number;
  export type OrganizationResourceCollectionType = "AWS_CLOUD_FORMATION"|"AWS_SERVICE"|"AWS_ACCOUNT"|"AWS_TAGS"|string;
  export type OrganizationalUnitId = string;
  export type OrganizationalUnitIdList = OrganizationalUnitId[];
  export type PerformanceInsightsMetricDimension = string;
  export interface PerformanceInsightsMetricDimensionGroup {
    /**
     * The name of the dimension group. Its valid values are:    db - The name of the database to which the client is connected (only Aurora PostgreSQL, Amazon RDS PostgreSQL, Aurora MySQL, Amazon RDS MySQL, and MariaDB)    db.application - The name of the application that is connected to the database (only Aurora PostgreSQL and RDS PostgreSQL)    db.host - The host name of the connected client (all engines)    db.session_type - The type of the current session (only Aurora PostgreSQL and RDS PostgreSQL)    db.sql - The SQL that is currently executing (all engines)    db.sql_tokenized - The SQL digest (all engines)    db.wait_event - The event for which the database backend is waiting (all engines)    db.wait_event_type - The type of event for which the database backend is waiting (all engines)    db.user - The user logged in to the database (all engines)  
     */
    Group?: PerformanceInsightsMetricGroup;
    /**
     * A list of specific dimensions from a dimension group. If this parameter is not present, then it signifies that all of the dimensions in the group were requested or are present in the response. Valid values for elements in the Dimensions array are:    db.application.name - The name of the application that is connected to the database (only Aurora PostgreSQL and RDS PostgreSQL)    db.host.id - The host ID of the connected client (all engines)    db.host.name - The host name of the connected client (all engines)    db.name - The name of the database to which the client is connected (only Aurora PostgreSQL, Amazon RDS PostgreSQL, Aurora MySQL, Amazon RDS MySQL, and MariaDB)    db.session_type.name - The type of the current session (only Aurora PostgreSQL and RDS PostgreSQL)    db.sql.id - The SQL ID generated by Performance Insights (all engines)    db.sql.db_id - The SQL ID generated by the database (all engines)    db.sql.statement - The SQL text that is being executed (all engines)    db.sql.tokenized_id     db.sql_tokenized.id - The SQL digest ID generated by Performance Insights (all engines)    db.sql_tokenized.db_id - SQL digest ID generated by the database (all engines)    db.sql_tokenized.statement - The SQL digest text (all engines)    db.user.id - The ID of the user logged in to the database (all engines)    db.user.name - The name of the user logged in to the database (all engines)    db.wait_event.name - The event for which the backend is waiting (all engines)    db.wait_event.type - The type of event for which the backend is waiting (all engines)    db.wait_event_type.name - The name of the event type for which the backend is waiting (all engines)  
     */
    Dimensions?: PerformanceInsightsMetricDimensions;
    /**
     * The maximum number of items to fetch for this dimension group.
     */
    Limit?: PerformanceInsightsMetricLimitInteger;
  }
  export type PerformanceInsightsMetricDimensions = PerformanceInsightsMetricDimension[];
  export type PerformanceInsightsMetricDisplayName = string;
  export type PerformanceInsightsMetricFilterKey = string;
  export type PerformanceInsightsMetricFilterMap = {[key: string]: PerformanceInsightsMetricFilterValue};
  export type PerformanceInsightsMetricFilterValue = string;
  export type PerformanceInsightsMetricGroup = string;
  export type PerformanceInsightsMetricLimitInteger = number;
  export type PerformanceInsightsMetricName = string;
  export interface PerformanceInsightsMetricQuery {
    /**
     * The name of the meteric used used when querying an Performance Insights GetResourceMetrics API for anomaly metrics. Valid values for Metric are:    db.load.avg - a scaled representation of the number of active sessions for the database engine.    db.sampledload.avg - the raw number of active sessions for the database engine.   If the number of active sessions is less than an internal Performance Insights threshold, db.load.avg and db.sampledload.avg are the same value. If the number of active sessions is greater than the internal threshold, Performance Insights samples the active sessions, with db.load.avg showing the scaled values, db.sampledload.avg showing the raw values, and db.sampledload.avg less than db.load.avg. For most use cases, you can query db.load.avg only. 
     */
    Metric?: PerformanceInsightsMetricName;
    /**
     * The specification for how to aggregate the data points from a Performance Insights GetResourceMetrics API query. The Performance Insights query returns all of the dimensions within that group, unless you provide the names of specific dimensions within that group. You can also request that Performance Insights return a limited number of values for a dimension.
     */
    GroupBy?: PerformanceInsightsMetricDimensionGroup;
    /**
     * One or more filters to apply to a Performance Insights GetResourceMetrics API query. Restrictions:   Any number of filters by the same dimension, as specified in the GroupBy parameter.   A single filter for any other dimension in this dimension group.  
     */
    Filter?: PerformanceInsightsMetricFilterMap;
  }
  export type PerformanceInsightsMetricUnit = string;
  export interface PerformanceInsightsMetricsDetail {
    /**
     * The name used for a specific Performance Insights metric.
     */
    MetricDisplayName?: PerformanceInsightsMetricDisplayName;
    /**
     * The unit of measure for a metric. For example, a session or a process.
     */
    Unit?: PerformanceInsightsMetricUnit;
    /**
     * A single query to be processed for the metric. For more information, see  PerformanceInsightsMetricQuery .
     */
    MetricQuery?: PerformanceInsightsMetricQuery;
    /**
     *  For more information, see  PerformanceInsightsReferenceData . 
     */
    ReferenceData?: PerformanceInsightsReferenceDataList;
    /**
     * The metric statistics during the anomalous period detected by DevOps Guru;
     */
    StatsAtAnomaly?: PerformanceInsightsStats;
    /**
     * Typical metric statistics that are not considered anomalous. When DevOps Guru analyzes metrics, it compares them to StatsAtBaseline to help determine if they are anomalous.
     */
    StatsAtBaseline?: PerformanceInsightsStats;
  }
  export type PerformanceInsightsMetricsDetails = PerformanceInsightsMetricsDetail[];
  export interface PerformanceInsightsReferenceComparisonValues {
    /**
     * A scalar value DevOps Guru for a metric that DevOps Guru compares to actual metric values. This reference value is used to determine if an actual metric value should be considered anomalous.
     */
    ReferenceScalar?: PerformanceInsightsReferenceScalar;
    /**
     * A metric that DevOps Guru compares to actual metric values. This reference metric is used to determine if an actual metric should be considered anomalous.
     */
    ReferenceMetric?: PerformanceInsightsReferenceMetric;
  }
  export interface PerformanceInsightsReferenceData {
    /**
     * The name of the reference data.
     */
    Name?: PerformanceInsightsReferenceName;
    /**
     * The specific reference values used to evaluate the Performance Insights. For more information, see  PerformanceInsightsReferenceComparisonValues . 
     */
    ComparisonValues?: PerformanceInsightsReferenceComparisonValues;
  }
  export type PerformanceInsightsReferenceDataList = PerformanceInsightsReferenceData[];
  export interface PerformanceInsightsReferenceMetric {
    /**
     * A query to be processed on the metric.
     */
    MetricQuery?: PerformanceInsightsMetricQuery;
  }
  export type PerformanceInsightsReferenceName = string;
  export interface PerformanceInsightsReferenceScalar {
    /**
     * The reference value.
     */
    Value?: PerformanceInsightsValueDouble;
  }
  export interface PerformanceInsightsStat {
    /**
     * The statistic type.
     */
    Type?: PerformanceInsightsStatType;
    /**
     * The value of the statistic.
     */
    Value?: PerformanceInsightsValueDouble;
  }
  export type PerformanceInsightsStatType = string;
  export type PerformanceInsightsStats = PerformanceInsightsStat[];
  export type PerformanceInsightsValueDouble = number;
  export interface PredictionTimeRange {
    /**
     *  The time range during which a metric limit is expected to be exceeded. This applies to proactive insights only. 
     */
    StartTime: Timestamp;
    /**
     *  The time when the behavior in a proactive insight is expected to end. 
     */
    EndTime?: Timestamp;
  }
  export type ProactiveAnomalies = ProactiveAnomalySummary[];
  export interface ProactiveAnomaly {
    /**
     *  The ID of a proactive anomaly. 
     */
    Id?: AnomalyId;
    /**
     * The severity of the anomaly. The severity of anomalies that generate an insight determine that insight's severity. For more information, see Understanding insight severities in the Amazon DevOps Guru User Guide.
     */
    Severity?: AnomalySeverity;
    /**
     *  The status of a proactive anomaly. 
     */
    Status?: AnomalyStatus;
    /**
     *  The time of the anomaly's most recent update. 
     */
    UpdateTime?: Timestamp;
    AnomalyTimeRange?: AnomalyTimeRange;
    /**
     *  An AnomalyReportedTimeRange object that specifies the time range between when the anomaly is opened and the time when it is closed. 
     */
    AnomalyReportedTimeRange?: AnomalyReportedTimeRange;
    PredictionTimeRange?: PredictionTimeRange;
    /**
     *  Details about the source of the analyzed operational data that triggered the anomaly. The one supported source is Amazon CloudWatch metrics. 
     */
    SourceDetails?: AnomalySourceDetails;
    /**
     *  The ID of the insight that contains this anomaly. An insight is composed of related anomalies. 
     */
    AssociatedInsightId?: InsightId;
    ResourceCollection?: ResourceCollection;
    /**
     *  A threshold that was exceeded by behavior in analyzed resources. Exceeding this threshold is related to the anomalous behavior that generated this anomaly. 
     */
    Limit?: AnomalyLimit;
    /**
     * The metadata for the anomaly.
     */
    SourceMetadata?: AnomalySourceMetadata;
    /**
     * Information about a resource in which DevOps Guru detected anomalous behavior.
     */
    AnomalyResources?: AnomalyResources;
    /**
     *  A description of the proactive anomaly. 
     */
    Description?: AnomalyDescription;
  }
  export interface ProactiveAnomalySummary {
    /**
     * The ID of the anomaly.
     */
    Id?: AnomalyId;
    /**
     * The severity of the anomaly. The severity of anomalies that generate an insight determine that insight's severity. For more information, see Understanding insight severities in the Amazon DevOps Guru User Guide.
     */
    Severity?: AnomalySeverity;
    /**
     * The status of the anomaly.
     */
    Status?: AnomalyStatus;
    /**
     *  The time of the anomaly's most recent update. 
     */
    UpdateTime?: Timestamp;
    AnomalyTimeRange?: AnomalyTimeRange;
    /**
     *  An AnomalyReportedTimeRange object that specifies the time range between when the anomaly is opened and the time when it is closed. 
     */
    AnomalyReportedTimeRange?: AnomalyReportedTimeRange;
    PredictionTimeRange?: PredictionTimeRange;
    /**
     *  Details about the source of the analyzed operational data that triggered the anomaly. The one supported source is Amazon CloudWatch metrics. 
     */
    SourceDetails?: AnomalySourceDetails;
    /**
     *  The ID of the insight that contains this anomaly. An insight is composed of related anomalies. 
     */
    AssociatedInsightId?: InsightId;
    ResourceCollection?: ResourceCollection;
    /**
     *  A threshold that was exceeded by behavior in analyzed resources. Exceeding this threshold is related to the anomalous behavior that generated this anomaly. 
     */
    Limit?: AnomalyLimit;
    /**
     * The metadata of the source which detects proactive anomalies.
     */
    SourceMetadata?: AnomalySourceMetadata;
    /**
     * Information about a resource in which DevOps Guru detected anomalous behavior.
     */
    AnomalyResources?: AnomalyResources;
    /**
     *  A description of the proactive anomaly. 
     */
    Description?: AnomalyDescription;
  }
  export interface ProactiveInsight {
    /**
     * The ID of the proactive insight. 
     */
    Id?: InsightId;
    /**
     * The name of the proactive insight. 
     */
    Name?: InsightName;
    /**
     * The severity of the insight. For more information, see Understanding insight severities in the Amazon DevOps Guru User Guide.
     */
    Severity?: InsightSeverity;
    /**
     * The status of the proactive insight. 
     */
    Status?: InsightStatus;
    InsightTimeRange?: InsightTimeRange;
    PredictionTimeRange?: PredictionTimeRange;
    ResourceCollection?: ResourceCollection;
    /**
     *  The ID of the Amazon Web Services System Manager OpsItem created for this insight. You must enable the creation of OpstItems insights before they are created for each insight. 
     */
    SsmOpsItemId?: SsmOpsItemId;
    /**
     * Describes the proactive insight.
     */
    Description?: InsightDescription;
  }
  export interface ProactiveInsightSummary {
    /**
     * The ID of the proactive insight. 
     */
    Id?: InsightId;
    /**
     * The name of the proactive insight. 
     */
    Name?: InsightName;
    /**
     * The severity of the insight. For more information, see Understanding insight severities in the Amazon DevOps Guru User Guide.
     */
    Severity?: InsightSeverity;
    /**
     * The status of the proactive insight. 
     */
    Status?: InsightStatus;
    InsightTimeRange?: InsightTimeRange;
    PredictionTimeRange?: PredictionTimeRange;
    ResourceCollection?: ResourceCollection;
    /**
     * A collection of the names of Amazon Web Services services.
     */
    ServiceCollection?: ServiceCollection;
    /**
     * The Amazon Resource Names (ARNs) of the Amazon Web Services resources that generated this insight.
     */
    AssociatedResourceArns?: AssociatedResourceArns;
  }
  export type ProactiveInsights = ProactiveInsightSummary[];
  export interface ProactiveOrganizationInsightSummary {
    /**
     * The ID of the insight summary.
     */
    Id?: InsightId;
    /**
     * The ID of the Amazon Web Services account.
     */
    AccountId?: AwsAccountId;
    /**
     * The ID of the organizational unit.
     */
    OrganizationalUnitId?: OrganizationalUnitId;
    /**
     * The name of the insight summary.
     */
    Name?: InsightName;
    /**
     *  An array of severity values used to search for insights. For more information, see Understanding insight severities in the Amazon DevOps Guru User Guide.
     */
    Severity?: InsightSeverity;
    /**
     *  An array of status values used to search for insights. 
     */
    Status?: InsightStatus;
    InsightTimeRange?: InsightTimeRange;
    PredictionTimeRange?: PredictionTimeRange;
    ResourceCollection?: ResourceCollection;
    ServiceCollection?: ServiceCollection;
  }
  export type ProactiveOrganizationInsights = ProactiveOrganizationInsightSummary[];
  export interface PutFeedbackRequest {
    /**
     *  The feedback from customers is about the recommendations in this insight. 
     */
    InsightFeedback?: InsightFeedback;
  }
  export interface PutFeedbackResponse {
  }
  export type ReactiveAnomalies = ReactiveAnomalySummary[];
  export interface ReactiveAnomaly {
    /**
     * The ID of the reactive anomaly. 
     */
    Id?: AnomalyId;
    /**
     * The severity of the anomaly. The severity of anomalies that generate an insight determine that insight's severity. For more information, see Understanding insight severities in the Amazon DevOps Guru User Guide.
     */
    Severity?: AnomalySeverity;
    /**
     *  The status of the anomaly. 
     */
    Status?: AnomalyStatus;
    AnomalyTimeRange?: AnomalyTimeRange;
    /**
     *  An AnomalyReportedTimeRange object that specifies the time range between when the anomaly is opened and the time when it is closed. 
     */
    AnomalyReportedTimeRange?: AnomalyReportedTimeRange;
    /**
     *  Details about the source of the analyzed operational data that triggered the anomaly. The one supported source is Amazon CloudWatch metrics. 
     */
    SourceDetails?: AnomalySourceDetails;
    /**
     *  The ID of the insight that contains this anomaly. An insight is composed of related anomalies. 
     */
    AssociatedInsightId?: InsightId;
    ResourceCollection?: ResourceCollection;
    /**
     * The type of the reactive anomaly. It can be one of the following types.    CAUSAL - the anomaly can cause a new insight.    CONTEXTUAL - the anomaly contains additional information about an insight or its causal anomaly.  
     */
    Type?: AnomalyType;
    /**
     * The name of the reactive anomaly.
     */
    Name?: AnomalyName;
    /**
     * A description of the reactive anomaly.
     */
    Description?: AnomalyDescription;
    /**
     * The ID of the causal anomaly that is associated with this reactive anomaly. The ID of a `CAUSAL` anomaly is always `NULL`.
     */
    CausalAnomalyId?: AnomalyId;
    /**
     * The Amazon Web Services resources in which anomalous behavior was detected by DevOps Guru.
     */
    AnomalyResources?: AnomalyResources;
  }
  export interface ReactiveAnomalySummary {
    /**
     *  The ID of the reactive anomaly. 
     */
    Id?: AnomalyId;
    /**
     * The severity of the anomaly. The severity of anomalies that generate an insight determine that insight's severity. For more information, see Understanding insight severities in the Amazon DevOps Guru User Guide.
     */
    Severity?: AnomalySeverity;
    /**
     *  The status of the reactive anomaly. 
     */
    Status?: AnomalyStatus;
    AnomalyTimeRange?: AnomalyTimeRange;
    /**
     *  An AnomalyReportedTimeRange object that specifies the time range between when the anomaly is opened and the time when it is closed. 
     */
    AnomalyReportedTimeRange?: AnomalyReportedTimeRange;
    /**
     *  Details about the source of the analyzed operational data that triggered the anomaly. The one supported source is Amazon CloudWatch metrics. 
     */
    SourceDetails?: AnomalySourceDetails;
    /**
     *  The ID of the insight that contains this anomaly. An insight is composed of related anomalies. 
     */
    AssociatedInsightId?: InsightId;
    ResourceCollection?: ResourceCollection;
    /**
     * The type of the reactive anomaly. It can be one of the following types.    CAUSAL - the anomaly can cause a new insight.    CONTEXTUAL - the anomaly contains additional information about an insight or its causal anomaly.  
     */
    Type?: AnomalyType;
    /**
     * The name of the reactive anomaly.
     */
    Name?: AnomalyName;
    /**
     * A description of the reactive anomaly.
     */
    Description?: AnomalyDescription;
    /**
     * The ID of the causal anomaly that is associated with this reactive anomaly. The ID of a `CAUSAL` anomaly is always `NULL`.
     */
    CausalAnomalyId?: AnomalyId;
    /**
     * The Amazon Web Services resources in which anomalous behavior was detected by DevOps Guru.
     */
    AnomalyResources?: AnomalyResources;
  }
  export interface ReactiveInsight {
    /**
     *  The ID of a reactive insight. 
     */
    Id?: InsightId;
    /**
     *  The name of a reactive insight. 
     */
    Name?: InsightName;
    /**
     * The severity of the insight. For more information, see Understanding insight severities in the Amazon DevOps Guru User Guide.
     */
    Severity?: InsightSeverity;
    /**
     *  The status of a reactive insight. 
     */
    Status?: InsightStatus;
    InsightTimeRange?: InsightTimeRange;
    ResourceCollection?: ResourceCollection;
    /**
     *  The ID of the Amazon Web Services System Manager OpsItem created for this insight. You must enable the creation of OpstItems insights before they are created for each insight. 
     */
    SsmOpsItemId?: SsmOpsItemId;
    /**
     * Describes the reactive insight.
     */
    Description?: InsightDescription;
  }
  export interface ReactiveInsightSummary {
    /**
     *  The ID of a reactive summary. 
     */
    Id?: InsightId;
    /**
     *  The name of a reactive insight. 
     */
    Name?: InsightName;
    /**
     * The severity of the insight. For more information, see Understanding insight severities in the Amazon DevOps Guru User Guide.
     */
    Severity?: InsightSeverity;
    /**
     *  The status of a reactive insight. 
     */
    Status?: InsightStatus;
    InsightTimeRange?: InsightTimeRange;
    ResourceCollection?: ResourceCollection;
    /**
     * A collection of the names of Amazon Web Services services.
     */
    ServiceCollection?: ServiceCollection;
    /**
     * The Amazon Resource Names (ARNs) of the Amazon Web Services resources that generated this insight.
     */
    AssociatedResourceArns?: AssociatedResourceArns;
  }
  export type ReactiveInsights = ReactiveInsightSummary[];
  export interface ReactiveOrganizationInsightSummary {
    /**
     * The ID of the insight summary.
     */
    Id?: InsightId;
    /**
     * The ID of the Amazon Web Services account. 
     */
    AccountId?: AwsAccountId;
    /**
     * The ID of the organizational unit.
     */
    OrganizationalUnitId?: OrganizationalUnitId;
    /**
     * The name of the insight summary.
     */
    Name?: InsightName;
    /**
     *  An array of severity values used to search for insights. For more information, see Understanding insight severities in the Amazon DevOps Guru User Guide.
     */
    Severity?: InsightSeverity;
    /**
     *  An array of status values used to search for insights. 
     */
    Status?: InsightStatus;
    InsightTimeRange?: InsightTimeRange;
    ResourceCollection?: ResourceCollection;
    ServiceCollection?: ServiceCollection;
  }
  export type ReactiveOrganizationInsights = ReactiveOrganizationInsightSummary[];
  export interface Recommendation {
    /**
     *  A description of the problem. 
     */
    Description?: RecommendationDescription;
    /**
     *  A hyperlink to information to help you address the problem. 
     */
    Link?: RecommendationLink;
    /**
     *  The name of the recommendation. 
     */
    Name?: RecommendationName;
    /**
     *  The reason DevOps Guru flagged the anomalous behavior as a problem. 
     */
    Reason?: RecommendationReason;
    /**
     *  Events that are related to the problem. Use these events to learn more about what's happening and to help address the issue. 
     */
    RelatedEvents?: RecommendationRelatedEvents;
    /**
     *  Anomalies that are related to the problem. Use these Anomalies to learn more about what's happening and to help address the issue. 
     */
    RelatedAnomalies?: RecommendationRelatedAnomalies;
    /**
     * The category type of the recommendation.
     */
    Category?: RecommendationCategory;
  }
  export type RecommendationCategory = string;
  export type RecommendationDescription = string;
  export type RecommendationLink = string;
  export type RecommendationName = string;
  export type RecommendationReason = string;
  export type RecommendationRelatedAnomalies = RecommendationRelatedAnomaly[];
  export interface RecommendationRelatedAnomaly {
    /**
     *  An array of objects that represent resources in which DevOps Guru detected anomalous behavior. Each object contains the name and type of the resource. 
     */
    Resources?: RecommendationRelatedAnomalyResources;
    /**
     *  Information about where the anomalous behavior related the recommendation was found. For example, details in Amazon CloudWatch metrics. 
     */
    SourceDetails?: RelatedAnomalySourceDetails;
    /**
     * The ID of an anomaly that generated the insight with this recommendation.
     */
    AnomalyId?: AnomalyId;
  }
  export interface RecommendationRelatedAnomalyResource {
    /**
     *  The name of the resource. 
     */
    Name?: RecommendationRelatedAnomalyResourceName;
    /**
     *  The type of the resource. Resource types take the same form that is used by Amazon Web Services CloudFormation resource type identifiers, service-provider::service-name::data-type-name. For example, AWS::RDS::DBCluster. For more information, see Amazon Web Services resource and property types reference in the Amazon Web Services CloudFormation User Guide.
     */
    Type?: RecommendationRelatedAnomalyResourceType;
  }
  export type RecommendationRelatedAnomalyResourceName = string;
  export type RecommendationRelatedAnomalyResourceType = string;
  export type RecommendationRelatedAnomalyResources = RecommendationRelatedAnomalyResource[];
  export interface RecommendationRelatedAnomalySourceDetail {
    /**
     *  An array of CloudWatchMetricsDetail objects that contains information about the analyzed metrics that displayed anomalous behavior. 
     */
    CloudWatchMetrics?: RecommendationRelatedCloudWatchMetricsSourceDetails;
  }
  export interface RecommendationRelatedCloudWatchMetricsSourceDetail {
    /**
     * The name of the CloudWatch metric.
     */
    MetricName?: RecommendationRelatedCloudWatchMetricsSourceMetricName;
    /**
     * The namespace of the CloudWatch metric. A namespace is a container for CloudWatch metrics.
     */
    Namespace?: RecommendationRelatedCloudWatchMetricsSourceNamespace;
  }
  export type RecommendationRelatedCloudWatchMetricsSourceDetails = RecommendationRelatedCloudWatchMetricsSourceDetail[];
  export type RecommendationRelatedCloudWatchMetricsSourceMetricName = string;
  export type RecommendationRelatedCloudWatchMetricsSourceNamespace = string;
  export interface RecommendationRelatedEvent {
    /**
     *  The name of the event. This corresponds to the Name field in an Event object. 
     */
    Name?: RecommendationRelatedEventName;
    /**
     *  A ResourceCollection object that contains arrays of the names of Amazon Web Services CloudFormation stacks. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
     */
    Resources?: RecommendationRelatedEventResources;
  }
  export type RecommendationRelatedEventName = string;
  export interface RecommendationRelatedEventResource {
    /**
     *  The name of the resource that emitted the event. This corresponds to the Name field in an EventResource object. 
     */
    Name?: RecommendationRelatedEventResourceName;
    /**
     *  The type of the resource that emitted the event. This corresponds to the Type field in an EventResource object. 
     */
    Type?: RecommendationRelatedEventResourceType;
  }
  export type RecommendationRelatedEventResourceName = string;
  export type RecommendationRelatedEventResourceType = string;
  export type RecommendationRelatedEventResources = RecommendationRelatedEventResource[];
  export type RecommendationRelatedEvents = RecommendationRelatedEvent[];
  export type Recommendations = Recommendation[];
  export type RelatedAnomalySourceDetails = RecommendationRelatedAnomalySourceDetail[];
  export interface RemoveNotificationChannelRequest {
    /**
     *  The ID of the notification channel to be removed. 
     */
    Id: NotificationChannelId;
  }
  export interface RemoveNotificationChannelResponse {
  }
  export type ResourceArn = string;
  export interface ResourceCollection {
    /**
     *  An array of the names of Amazon Web Services CloudFormation stacks. The stacks define Amazon Web Services resources that DevOps Guru analyzes. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
     */
    CloudFormation?: CloudFormationCollection;
    /**
     * The Amazon Web Services tags that are used by resources in the resource collection. Tags help you identify and organize your Amazon Web Services resources. Many Amazon Web Services services support tagging, so you can assign the same tag to resources from different services to indicate that the resources are related. For example, you can assign the same tag to an Amazon DynamoDB table resource that you assign to an Lambda function. For more information about using tags, see the Tagging best practices whitepaper.  Each Amazon Web Services tag has two parts.    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case-sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive.   Together these are known as key-value pairs.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    Tags?: TagCollections;
  }
  export interface ResourceCollectionFilter {
    /**
     *  Information about Amazon Web Services CloudFormation stacks. You can use up to 500 stacks to specify which Amazon Web Services resources in your account to analyze. For more information, see Stacks in the Amazon Web Services CloudFormation User Guide. 
     */
    CloudFormation?: CloudFormationCollectionFilter;
    /**
     * The Amazon Web Services tags used to filter the resources in the resource collection. Tags help you identify and organize your Amazon Web Services resources. Many Amazon Web Services services support tagging, so you can assign the same tag to resources from different services to indicate that the resources are related. For example, you can assign the same tag to an Amazon DynamoDB table resource that you assign to an Lambda function. For more information about using tags, see the Tagging best practices whitepaper.  Each Amazon Web Services tag has two parts.    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case-sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive.   Together these are known as key-value pairs.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    Tags?: TagCollectionFilters;
  }
  export type ResourceCollectionType = "AWS_CLOUD_FORMATION"|"AWS_SERVICE"|"AWS_TAGS"|string;
  export type ResourceHours = number;
  export type ResourceName = string;
  export type ResourcePermission = "FULL_PERMISSION"|"MISSING_PERMISSION"|string;
  export type ResourceType = string;
  export type ResourceTypeFilter = "LOG_GROUPS"|"CLOUDFRONT_DISTRIBUTION"|"DYNAMODB_TABLE"|"EC2_NAT_GATEWAY"|"ECS_CLUSTER"|"ECS_SERVICE"|"EKS_CLUSTER"|"ELASTIC_BEANSTALK_ENVIRONMENT"|"ELASTIC_LOAD_BALANCER_LOAD_BALANCER"|"ELASTIC_LOAD_BALANCING_V2_LOAD_BALANCER"|"ELASTIC_LOAD_BALANCING_V2_TARGET_GROUP"|"ELASTICACHE_CACHE_CLUSTER"|"ELASTICSEARCH_DOMAIN"|"KINESIS_STREAM"|"LAMBDA_FUNCTION"|"OPEN_SEARCH_SERVICE_DOMAIN"|"RDS_DB_INSTANCE"|"RDS_DB_CLUSTER"|"REDSHIFT_CLUSTER"|"ROUTE53_HOSTED_ZONE"|"ROUTE53_HEALTH_CHECK"|"S3_BUCKET"|"SAGEMAKER_ENDPOINT"|"SNS_TOPIC"|"SQS_QUEUE"|"STEP_FUNCTIONS_ACTIVITY"|"STEP_FUNCTIONS_STATE_MACHINE"|string;
  export type ResourceTypeFilters = ResourceTypeFilter[];
  export type SearchInsightsAccountIdList = AwsAccountId[];
  export interface SearchInsightsFilters {
    /**
     *  An array of severity values used to search for insights. 
     */
    Severities?: InsightSeverities;
    /**
     *  An array of status values used to search for insights. 
     */
    Statuses?: InsightStatuses;
    ResourceCollection?: ResourceCollection;
    /**
     * A collection of the names of Amazon Web Services services.
     */
    ServiceCollection?: ServiceCollection;
  }
  export type SearchInsightsMaxResults = number;
  export interface SearchInsightsRequest {
    /**
     *  The start of the time range passed in. Returned insights occurred after this time. 
     */
    StartTimeRange: StartTimeRange;
    /**
     *  A SearchInsightsFilters object that is used to set the severity and status filters on your insight search. 
     */
    Filters?: SearchInsightsFilters;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: SearchInsightsMaxResults;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
    /**
     *  The type of insights you are searching for (REACTIVE or PROACTIVE). 
     */
    Type: InsightType;
  }
  export interface SearchInsightsResponse {
    /**
     *  The returned proactive insights. 
     */
    ProactiveInsights?: ProactiveInsights;
    /**
     *  The returned reactive insights. 
     */
    ReactiveInsights?: ReactiveInsights;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export interface SearchOrganizationInsightsFilters {
    /**
     *  An array of severity values used to search for insights. 
     */
    Severities?: InsightSeverities;
    /**
     *  An array of status values used to search for insights. 
     */
    Statuses?: InsightStatuses;
    ResourceCollection?: ResourceCollection;
    ServiceCollection?: ServiceCollection;
  }
  export type SearchOrganizationInsightsMaxResults = number;
  export interface SearchOrganizationInsightsRequest {
    /**
     * The ID of the Amazon Web Services account. 
     */
    AccountIds: SearchInsightsAccountIdList;
    StartTimeRange: StartTimeRange;
    /**
     *  A SearchOrganizationInsightsFilters object that is used to set the severity and status filters on your insight search. 
     */
    Filters?: SearchOrganizationInsightsFilters;
    /**
     * The maximum number of results to return with a single call. To retrieve the remaining results, make another call with the returned nextToken value.
     */
    MaxResults?: SearchOrganizationInsightsMaxResults;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
    /**
     *  The type of insights you are searching for (REACTIVE or PROACTIVE). 
     */
    Type: InsightType;
  }
  export interface SearchOrganizationInsightsResponse {
    /**
     * An integer that specifies the number of open proactive insights in your Amazon Web Services account.
     */
    ProactiveInsights?: ProactiveInsights;
    /**
     * An integer that specifies the number of open reactive insights in your Amazon Web Services account.
     */
    ReactiveInsights?: ReactiveInsights;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export type ServerSideEncryptionType = "CUSTOMER_MANAGED_KEY"|"AWS_OWNED_KMS_KEY"|string;
  export interface ServiceCollection {
    /**
     * An array of strings that each specifies the name of an Amazon Web Services service.
     */
    ServiceNames?: ServiceNames;
  }
  export interface ServiceHealth {
    /**
     * The name of the Amazon Web Services service.
     */
    ServiceName?: ServiceName;
    /**
     * Represents the health of an Amazon Web Services service. This is a ServiceInsightHealth that contains the number of open proactive and reactive insights for this service.
     */
    Insight?: ServiceInsightHealth;
    /**
     *  Number of resources that DevOps Guru is monitoring in an analyzed Amazon Web Services service. 
     */
    AnalyzedResourceCount?: AnalyzedResourceCount;
  }
  export type ServiceHealths = ServiceHealth[];
  export interface ServiceInsightHealth {
    /**
     * The number of open proactive insights in the Amazon Web Services service
     */
    OpenProactiveInsights?: NumOpenProactiveInsights;
    /**
     * The number of open reactive insights in the Amazon Web Services service
     */
    OpenReactiveInsights?: NumOpenReactiveInsights;
  }
  export interface ServiceIntegrationConfig {
    /**
     *  Information about whether DevOps Guru is configured to create an OpsItem in Amazon Web Services Systems Manager OpsCenter for each created insight. 
     */
    OpsCenter?: OpsCenterIntegration;
    /**
     *  Information about whether DevOps Guru is configured to perform log anomaly detection on Amazon CloudWatch log groups. 
     */
    LogsAnomalyDetection?: LogsAnomalyDetectionIntegration;
    /**
     *  Information about whether DevOps Guru is configured to encrypt server-side data using KMS. 
     */
    KMSServerSideEncryption?: KMSServerSideEncryptionIntegration;
  }
  export type ServiceName = "API_GATEWAY"|"APPLICATION_ELB"|"AUTO_SCALING_GROUP"|"CLOUD_FRONT"|"DYNAMO_DB"|"EC2"|"ECS"|"EKS"|"ELASTIC_BEANSTALK"|"ELASTI_CACHE"|"ELB"|"ES"|"KINESIS"|"LAMBDA"|"NAT_GATEWAY"|"NETWORK_ELB"|"RDS"|"REDSHIFT"|"ROUTE_53"|"S3"|"SAGE_MAKER"|"SNS"|"SQS"|"STEP_FUNCTIONS"|"SWF"|string;
  export type ServiceNames = ServiceName[];
  export interface ServiceResourceCost {
    /**
     * The type of the Amazon Web Services resource.
     */
    Type?: ResourceType;
    /**
     * The state of the resource. The resource is ACTIVE if it produces metrics, events, or logs within an hour, otherwise it is INACTIVE. You pay for the number of active Amazon Web Services resource hours analyzed for each resource. Inactive resources are not charged. 
     */
    State?: CostEstimationServiceResourceState;
    /**
     * The number of active resources analyzed for this service to create a monthly cost estimate.
     */
    Count?: CostEstimationServiceResourceCount;
    /**
     * The price per hour to analyze the resources in the service. For more information, see Estimate your Amazon DevOps Guru costs and Amazon DevOps Guru pricing.
     */
    UnitCost?: Cost;
    /**
     * The total estimated monthly cost to analyze the active resources for this resource.
     */
    Cost?: Cost;
  }
  export type ServiceResourceCosts = ServiceResourceCost[];
  export interface SnsChannelConfig {
    /**
     *  The Amazon Resource Name (ARN) of an Amazon Simple Notification Service topic. 
     */
    TopicArn?: TopicArn;
  }
  export type SsmOpsItemId = string;
  export type StackName = string;
  export type StackNames = StackName[];
  export interface StartCostEstimationRequest {
    /**
     * The collection of Amazon Web Services resources used to create a monthly DevOps Guru cost estimate.
     */
    ResourceCollection: CostEstimationResourceCollectionFilter;
    /**
     * The idempotency token used to identify each cost estimate request.
     */
    ClientToken?: ClientToken;
  }
  export interface StartCostEstimationResponse {
  }
  export interface StartTimeRange {
    /**
     *  The start time of the time range. 
     */
    FromTime?: Timestamp;
    /**
     *  The end time of the time range. 
     */
    ToTime?: Timestamp;
  }
  export interface TagCollection {
    /**
     * An Amazon Web Services tag key that is used to identify the Amazon Web Services resources that DevOps Guru analyzes. All Amazon Web Services resources in your account and Region tagged with this key make up your DevOps Guru application and analysis boundary.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    AppBoundaryKey: AppBoundaryKey;
    /**
     * The values in an Amazon Web Services tag collection. The tag's value is an optional field used to associate a string with the tag key (for example, 111122223333, Production, or a team name). The key and value are the tag's key pair. Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive. You can specify a maximum of 256 characters for a tag value.
     */
    TagValues: TagValues;
  }
  export interface TagCollectionFilter {
    /**
     * An Amazon Web Services tag key that is used to identify the Amazon Web Services resources that DevOps Guru analyzes. All Amazon Web Services resources in your account and Region tagged with this key make up your DevOps Guru application and analysis boundary.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    AppBoundaryKey: AppBoundaryKey;
    /**
     * The values in an Amazon Web Services tag collection. The tag's value is an optional field used to associate a string with the tag key (for example, 111122223333, Production, or a team name). The key and value are the tag's key pair. Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive. You can specify a maximum of 256 characters for a tag value.
     */
    TagValues: TagValues;
  }
  export type TagCollectionFilters = TagCollectionFilter[];
  export type TagCollections = TagCollection[];
  export interface TagCostEstimationResourceCollectionFilter {
    /**
     * An Amazon Web Services tag key that is used to identify the Amazon Web Services resources that DevOps Guru analyzes. All Amazon Web Services resources in your account and Region tagged with this key make up your DevOps Guru application and analysis boundary.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    AppBoundaryKey: AppBoundaryKey;
    /**
     * The values in an Amazon Web Services tag collection. The tag's value is an optional field used to associate a string with the tag key (for example, 111122223333, Production, or a team name). The key and value are the tag's key pair. Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive. You can specify a maximum of 256 characters for a tag value.
     */
    TagValues: CostEstimationTagValues;
  }
  export type TagCostEstimationResourceCollectionFilters = TagCostEstimationResourceCollectionFilter[];
  export interface TagHealth {
    /**
     * An Amazon Web Services tag key that is used to identify the Amazon Web Services resources that DevOps Guru analyzes. All Amazon Web Services resources in your account and Region tagged with this key make up your DevOps Guru application and analysis boundary.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    AppBoundaryKey?: AppBoundaryKey;
    /**
     * The value in an Amazon Web Services tag. The tag's value is an optional field used to associate a string with the tag key (for example, 111122223333, Production, or a team name). The key and value are the tag's key pair. Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive. You can specify a maximum of 256 characters for a tag value.
     */
    TagValue?: TagValue;
    /**
     * Information about the health of the Amazon Web Services resources in your account that are specified by an Amazon Web Services tag, including the number of open proactive, open reactive insights, and the Mean Time to Recover (MTTR) of closed insights. 
     */
    Insight?: InsightHealth;
    /**
     *  Number of resources that DevOps Guru is monitoring in your account that are specified by an Amazon Web Services tag. 
     */
    AnalyzedResourceCount?: AnalyzedResourceCount;
  }
  export type TagHealths = TagHealth[];
  export type TagValue = string;
  export type TagValues = TagValue[];
  export type Timestamp = Date;
  export interface TimestampMetricValuePair {
    /**
     * A Timestamp that specifies the time the event occurred. 
     */
    Timestamp?: Timestamp;
    /**
     * Value of the anomalous metric data point at respective Timestamp.
     */
    MetricValue?: MetricValue;
  }
  export type TimestampMetricValuePairList = TimestampMetricValuePair[];
  export type TopicArn = string;
  export interface UpdateCloudFormationCollectionFilter {
    /**
     *  An array of the names of the Amazon Web Services CloudFormation stacks to update. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
     */
    StackNames?: UpdateStackNames;
  }
  export interface UpdateEventSourcesConfigRequest {
    /**
     * Configuration information about the integration of DevOps Guru as the Consumer via EventBridge with another AWS Service.
     */
    EventSources?: EventSourcesConfig;
  }
  export interface UpdateEventSourcesConfigResponse {
  }
  export type UpdateResourceCollectionAction = "ADD"|"REMOVE"|string;
  export interface UpdateResourceCollectionFilter {
    /**
     *  A collection of Amazon Web Services CloudFormation stacks. You can specify up to 500 Amazon Web Services CloudFormation stacks. 
     */
    CloudFormation?: UpdateCloudFormationCollectionFilter;
    /**
     * The updated Amazon Web Services tags used to filter the resources in the resource collection. Tags help you identify and organize your Amazon Web Services resources. Many Amazon Web Services services support tagging, so you can assign the same tag to resources from different services to indicate that the resources are related. For example, you can assign the same tag to an Amazon DynamoDB table resource that you assign to an Lambda function. For more information about using tags, see the Tagging best practices whitepaper.  Each Amazon Web Services tag has two parts.    A tag key (for example, CostCenter, Environment, Project, or Secret). Tag keys are case-sensitive.   An optional field known as a tag value (for example, 111122223333, Production, or a team name). Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive.   Together these are known as key-value pairs.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    Tags?: UpdateTagCollectionFilters;
  }
  export interface UpdateResourceCollectionRequest {
    /**
     *  Specifies if the resource collection in the request is added or deleted to the resource collection. 
     */
    Action: UpdateResourceCollectionAction;
    ResourceCollection: UpdateResourceCollectionFilter;
  }
  export interface UpdateResourceCollectionResponse {
  }
  export interface UpdateServiceIntegrationConfig {
    OpsCenter?: OpsCenterIntegrationConfig;
    /**
     *  Information about whether DevOps Guru is configured to perform log anomaly detection on Amazon CloudWatch log groups. 
     */
    LogsAnomalyDetection?: LogsAnomalyDetectionIntegrationConfig;
    /**
     *  Information about whether DevOps Guru is configured to encrypt server-side data using KMS. 
     */
    KMSServerSideEncryption?: KMSServerSideEncryptionIntegrationConfig;
  }
  export interface UpdateServiceIntegrationRequest {
    /**
     *  An IntegratedServiceConfig object used to specify the integrated service you want to update, and whether you want to update it to enabled or disabled. 
     */
    ServiceIntegration: UpdateServiceIntegrationConfig;
  }
  export interface UpdateServiceIntegrationResponse {
  }
  export type UpdateStackNames = StackName[];
  export interface UpdateTagCollectionFilter {
    /**
     * An Amazon Web Services tag key that is used to identify the Amazon Web Services resources that DevOps Guru analyzes. All Amazon Web Services resources in your account and Region tagged with this key make up your DevOps Guru application and analysis boundary.  The string used for a key in a tag that you use to define your resource coverage must begin with the prefix Devops-guru-. The tag key might be DevOps-Guru-deployment-application or devops-guru-rds-application. When you create a key, the case of characters in the key can be whatever you choose. After you create a key, it is case-sensitive. For example, DevOps Guru works with a key named devops-guru-rds and a key named DevOps-Guru-RDS, and these act as two different keys. Possible key/value pairs in your application might be Devops-Guru-production-application/RDS or Devops-Guru-production-application/containers. 
     */
    AppBoundaryKey: AppBoundaryKey;
    /**
     * The values in an Amazon Web Services tag collection. The tag's value is an optional field used to associate a string with the tag key (for example, 111122223333, Production, or a team name). The key and value are the tag's key pair. Omitting the tag value is the same as using an empty string. Like tag keys, tag values are case-sensitive. You can specify a maximum of 256 characters for a tag value.
     */
    TagValues: UpdateTagValues;
  }
  export type UpdateTagCollectionFilters = UpdateTagCollectionFilter[];
  export type UpdateTagValues = TagValue[];
  export type UuidNextToken = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-12-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the DevOpsGuru client.
   */
  export import Types = DevOpsGuru;
}
export = DevOpsGuru;
