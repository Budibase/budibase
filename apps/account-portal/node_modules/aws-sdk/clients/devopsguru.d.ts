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
   *  Adds a notification channel to DevOps Guru. A notification channel is used to notify you about important DevOps Guru events, such as when an insight is generated.  If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. For more information, see Permissions for cross account Amazon SNS topics. If you use an Amazon SNS topic that is encrypted by an AWS Key Management Service customer-managed key (CMK), then you must add permissions to the CMK. For more information, see Permissions for AWS KMS–encrypted Amazon SNS topics.
   */
  addNotificationChannel(params: DevOpsGuru.Types.AddNotificationChannelRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.AddNotificationChannelResponse) => void): Request<DevOpsGuru.Types.AddNotificationChannelResponse, AWSError>;
  /**
   *  Adds a notification channel to DevOps Guru. A notification channel is used to notify you about important DevOps Guru events, such as when an insight is generated.  If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. For more information, see Permissions for cross account Amazon SNS topics. If you use an Amazon SNS topic that is encrypted by an AWS Key Management Service customer-managed key (CMK), then you must add permissions to the CMK. For more information, see Permissions for AWS KMS–encrypted Amazon SNS topics.
   */
  addNotificationChannel(callback?: (err: AWSError, data: DevOpsGuru.Types.AddNotificationChannelResponse) => void): Request<DevOpsGuru.Types.AddNotificationChannelResponse, AWSError>;
  /**
   *  Returns the number of open reactive insights, the number of open proactive insights, and the number of metrics analyzed in your AWS account. Use these numbers to gauge the health of operations in your AWS account. 
   */
  describeAccountHealth(params: DevOpsGuru.Types.DescribeAccountHealthRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeAccountHealthResponse) => void): Request<DevOpsGuru.Types.DescribeAccountHealthResponse, AWSError>;
  /**
   *  Returns the number of open reactive insights, the number of open proactive insights, and the number of metrics analyzed in your AWS account. Use these numbers to gauge the health of operations in your AWS account. 
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
   *  Returns the most recent feedback submitted in the current AWS account and Region. 
   */
  describeFeedback(params: DevOpsGuru.Types.DescribeFeedbackRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeFeedbackResponse) => void): Request<DevOpsGuru.Types.DescribeFeedbackResponse, AWSError>;
  /**
   *  Returns the most recent feedback submitted in the current AWS account and Region. 
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
   *  Returns the number of open proactive insights, open reactive insights, and the Mean Time to Recover (MTTR) for all closed insights in resource collections in your account. You specify the type of AWS resources collection. The one type of AWS resource collection supported is AWS CloudFormation stacks. DevOps Guru can be configured to analyze only the AWS resources that are defined in the stacks. You can specify up to 500 AWS CloudFormation stacks. 
   */
  describeResourceCollectionHealth(params: DevOpsGuru.Types.DescribeResourceCollectionHealthRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeResourceCollectionHealthResponse) => void): Request<DevOpsGuru.Types.DescribeResourceCollectionHealthResponse, AWSError>;
  /**
   *  Returns the number of open proactive insights, open reactive insights, and the Mean Time to Recover (MTTR) for all closed insights in resource collections in your account. You specify the type of AWS resources collection. The one type of AWS resource collection supported is AWS CloudFormation stacks. DevOps Guru can be configured to analyze only the AWS resources that are defined in the stacks. You can specify up to 500 AWS CloudFormation stacks. 
   */
  describeResourceCollectionHealth(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeResourceCollectionHealthResponse) => void): Request<DevOpsGuru.Types.DescribeResourceCollectionHealthResponse, AWSError>;
  /**
   *  Returns the integration status of services that are integrated with DevOps Guru. The one service that can be integrated with DevOps Guru is AWS Systems Manager, which can be used to create an OpsItem for each generated insight. 
   */
  describeServiceIntegration(params: DevOpsGuru.Types.DescribeServiceIntegrationRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeServiceIntegrationResponse) => void): Request<DevOpsGuru.Types.DescribeServiceIntegrationResponse, AWSError>;
  /**
   *  Returns the integration status of services that are integrated with DevOps Guru. The one service that can be integrated with DevOps Guru is AWS Systems Manager, which can be used to create an OpsItem for each generated insight. 
   */
  describeServiceIntegration(callback?: (err: AWSError, data: DevOpsGuru.Types.DescribeServiceIntegrationResponse) => void): Request<DevOpsGuru.Types.DescribeServiceIntegrationResponse, AWSError>;
  /**
   * Returns an estimate of the monthly cost for DevOps Guru to analyze your AWS resources. For more information, see Estimate your Amazon DevOps Guru costs and Amazon DevOps Guru pricing.
   */
  getCostEstimation(params: DevOpsGuru.Types.GetCostEstimationRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.GetCostEstimationResponse) => void): Request<DevOpsGuru.Types.GetCostEstimationResponse, AWSError>;
  /**
   * Returns an estimate of the monthly cost for DevOps Guru to analyze your AWS resources. For more information, see Estimate your Amazon DevOps Guru costs and Amazon DevOps Guru pricing.
   */
  getCostEstimation(callback?: (err: AWSError, data: DevOpsGuru.Types.GetCostEstimationResponse) => void): Request<DevOpsGuru.Types.GetCostEstimationResponse, AWSError>;
  /**
   *  Returns lists AWS resources that are of the specified resource collection type. The one type of AWS resource collection supported is AWS CloudFormation stacks. DevOps Guru can be configured to analyze only the AWS resources that are defined in the stacks. You can specify up to 500 AWS CloudFormation stacks. 
   */
  getResourceCollection(params: DevOpsGuru.Types.GetResourceCollectionRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.GetResourceCollectionResponse) => void): Request<DevOpsGuru.Types.GetResourceCollectionResponse, AWSError>;
  /**
   *  Returns lists AWS resources that are of the specified resource collection type. The one type of AWS resource collection supported is AWS CloudFormation stacks. DevOps Guru can be configured to analyze only the AWS resources that are defined in the stacks. You can specify up to 500 AWS CloudFormation stacks. 
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
   *  Returns a list of the events emitted by the resources that are evaluated by DevOps Guru. You can use filters to specify which events are returned. 
   */
  listEvents(params: DevOpsGuru.Types.ListEventsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListEventsResponse) => void): Request<DevOpsGuru.Types.ListEventsResponse, AWSError>;
  /**
   *  Returns a list of the events emitted by the resources that are evaluated by DevOps Guru. You can use filters to specify which events are returned. 
   */
  listEvents(callback?: (err: AWSError, data: DevOpsGuru.Types.ListEventsResponse) => void): Request<DevOpsGuru.Types.ListEventsResponse, AWSError>;
  /**
   *  Returns a list of insights in your AWS account. You can specify which insights are returned by their start time and status (ONGOING, CLOSED, or ANY). 
   */
  listInsights(params: DevOpsGuru.Types.ListInsightsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListInsightsResponse) => void): Request<DevOpsGuru.Types.ListInsightsResponse, AWSError>;
  /**
   *  Returns a list of insights in your AWS account. You can specify which insights are returned by their start time and status (ONGOING, CLOSED, or ANY). 
   */
  listInsights(callback?: (err: AWSError, data: DevOpsGuru.Types.ListInsightsResponse) => void): Request<DevOpsGuru.Types.ListInsightsResponse, AWSError>;
  /**
   *  Returns a list of notification channels configured for DevOps Guru. Each notification channel is used to notify you when DevOps Guru generates an insight that contains information about how to improve your operations. The one supported notification channel is Amazon Simple Notification Service (Amazon SNS). 
   */
  listNotificationChannels(params: DevOpsGuru.Types.ListNotificationChannelsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.ListNotificationChannelsResponse) => void): Request<DevOpsGuru.Types.ListNotificationChannelsResponse, AWSError>;
  /**
   *  Returns a list of notification channels configured for DevOps Guru. Each notification channel is used to notify you when DevOps Guru generates an insight that contains information about how to improve your operations. The one supported notification channel is Amazon Simple Notification Service (Amazon SNS). 
   */
  listNotificationChannels(callback?: (err: AWSError, data: DevOpsGuru.Types.ListNotificationChannelsResponse) => void): Request<DevOpsGuru.Types.ListNotificationChannelsResponse, AWSError>;
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
   *  Returns a list of insights in your AWS account. You can specify which insights are returned by their start time, one or more statuses (ONGOING, CLOSED, and CLOSED), one or more severities (LOW, MEDIUM, and HIGH), and type (REACTIVE or PROACTIVE).   Use the Filters parameter to specify status and severity search parameters. Use the Type parameter to specify REACTIVE or PROACTIVE in your search. 
   */
  searchInsights(params: DevOpsGuru.Types.SearchInsightsRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.SearchInsightsResponse) => void): Request<DevOpsGuru.Types.SearchInsightsResponse, AWSError>;
  /**
   *  Returns a list of insights in your AWS account. You can specify which insights are returned by their start time, one or more statuses (ONGOING, CLOSED, and CLOSED), one or more severities (LOW, MEDIUM, and HIGH), and type (REACTIVE or PROACTIVE).   Use the Filters parameter to specify status and severity search parameters. Use the Type parameter to specify REACTIVE or PROACTIVE in your search. 
   */
  searchInsights(callback?: (err: AWSError, data: DevOpsGuru.Types.SearchInsightsResponse) => void): Request<DevOpsGuru.Types.SearchInsightsResponse, AWSError>;
  /**
   * Starts the creation of an estimate of the monthly cost to analyze your AWS resources.
   */
  startCostEstimation(params: DevOpsGuru.Types.StartCostEstimationRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.StartCostEstimationResponse) => void): Request<DevOpsGuru.Types.StartCostEstimationResponse, AWSError>;
  /**
   * Starts the creation of an estimate of the monthly cost to analyze your AWS resources.
   */
  startCostEstimation(callback?: (err: AWSError, data: DevOpsGuru.Types.StartCostEstimationResponse) => void): Request<DevOpsGuru.Types.StartCostEstimationResponse, AWSError>;
  /**
   *  Updates the collection of resources that DevOps Guru analyzes. The one type of AWS resource collection supported is AWS CloudFormation stacks. DevOps Guru can be configured to analyze only the AWS resources that are defined in the stacks. You can specify up to 500 AWS CloudFormation stacks. This method also creates the IAM role required for you to use DevOps Guru. 
   */
  updateResourceCollection(params: DevOpsGuru.Types.UpdateResourceCollectionRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.UpdateResourceCollectionResponse) => void): Request<DevOpsGuru.Types.UpdateResourceCollectionResponse, AWSError>;
  /**
   *  Updates the collection of resources that DevOps Guru analyzes. The one type of AWS resource collection supported is AWS CloudFormation stacks. DevOps Guru can be configured to analyze only the AWS resources that are defined in the stacks. You can specify up to 500 AWS CloudFormation stacks. This method also creates the IAM role required for you to use DevOps Guru. 
   */
  updateResourceCollection(callback?: (err: AWSError, data: DevOpsGuru.Types.UpdateResourceCollectionResponse) => void): Request<DevOpsGuru.Types.UpdateResourceCollectionResponse, AWSError>;
  /**
   *  Enables or disables integration with a service that can be integrated with DevOps Guru. The one service that can be integrated with DevOps Guru is AWS Systems Manager, which can be used to create an OpsItem for each generated insight. 
   */
  updateServiceIntegration(params: DevOpsGuru.Types.UpdateServiceIntegrationRequest, callback?: (err: AWSError, data: DevOpsGuru.Types.UpdateServiceIntegrationResponse) => void): Request<DevOpsGuru.Types.UpdateServiceIntegrationResponse, AWSError>;
  /**
   *  Enables or disables integration with a service that can be integrated with DevOps Guru. The one service that can be integrated with DevOps Guru is AWS Systems Manager, which can be used to create an OpsItem for each generated insight. 
   */
  updateServiceIntegration(callback?: (err: AWSError, data: DevOpsGuru.Types.UpdateServiceIntegrationResponse) => void): Request<DevOpsGuru.Types.UpdateServiceIntegrationResponse, AWSError>;
}
declare namespace DevOpsGuru {
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
  export type AnomalyId = string;
  export type AnomalyLimit = number;
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
  export type AnomalySeverity = "LOW"|"MEDIUM"|"HIGH"|string;
  export interface AnomalySourceDetails {
    /**
     *  An array of CloudWatchMetricsDetail object that contains information about the analyzed metrics that displayed anomalous behavior. 
     */
    CloudWatchMetrics?: CloudWatchMetricsDetails;
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
     *  Information about the health of the AWS resources in your account that are specified by an AWS CloudFormation stack, including the number of open proactive, open reactive insights, and the Mean Time to Recover (MTTR) of closed insights. 
     */
    Insight?: InsightHealth;
  }
  export type CloudFormationHealths = CloudFormationHealth[];
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
     * An object that specifies the CloudFormation stack that defines the AWS resources used to create a monthly estimate for DevOps Guru.
     */
    CloudFormation?: CloudFormationCostEstimationResourceCollectionFilter;
  }
  export type CostEstimationServiceResourceCount = number;
  export type CostEstimationServiceResourceState = "ACTIVE"|"INACTIVE"|string;
  export type CostEstimationStackNames = StackName[];
  export type CostEstimationStatus = "ONGOING"|"COMPLETED"|string;
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
  export interface DescribeAccountHealthRequest {
  }
  export interface DescribeAccountHealthResponse {
    /**
     *  An integer that specifies the number of open reactive insights in your AWS account. 
     */
    OpenReactiveInsights: NumOpenReactiveInsights;
    /**
     *  An integer that specifies the number of open proactive insights in your AWS account. 
     */
    OpenProactiveInsights: NumOpenProactiveInsights;
    /**
     *  An integer that specifies the number of metrics that have been analyzed in your AWS account. 
     */
    MetricsAnalyzed: NumMetricsAnalyzed;
    /**
     * The number of Amazon DevOps Guru resource analysis hours billed to the current AWS account in the last hour. 
     */
    ResourceHours: ResourceHours;
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
     *  An integer that specifies the number of open reactive insights in your AWS account that were created during the time range passed in. 
     */
    ReactiveInsights: NumReactiveInsights;
    /**
     *  An integer that specifies the number of open proactive insights in your AWS account that were created during the time range passed in. 
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
  }
  export interface DescribeAnomalyResponse {
    /**
     *  A ReactiveAnomaly object that represents the requested anomaly. 
     */
    ProactiveAnomaly?: ProactiveAnomaly;
    /**
     *  A ProactiveAnomaly object that represents the requested anomaly. 
     */
    ReactiveAnomaly?: ReactiveAnomaly;
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
  export interface DescribeResourceCollectionHealthRequest {
    /**
     *  An AWS resource collection type. This type specifies how analyzed AWS resources are defined. The one type of AWS resource collection supported is AWS CloudFormation stacks. DevOps Guru can be configured to analyze only the AWS resources that are defined in the stacks. You can specify up to 500 AWS CloudFormation stacks. 
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
    CloudFormation: CloudFormationHealths;
    /**
     * An array of ServiceHealth objects that describes the health of the AWS services associated with the resources in the collection.
     */
    Service?: ServiceHealths;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
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
     *  The AWS source that emitted the event. 
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
  export interface GetCostEstimationRequest {
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
  }
  export interface GetCostEstimationResponse {
    /**
     * The collection of the AWS resources used to create your monthly DevOps Guru cost estimate.
     */
    ResourceCollection?: CostEstimationResourceCollectionFilter;
    /**
     * The status of creating this cost estimate. If it's still in progress, the status ONGOING is returned. If it is finished, the status COMPLETED is returned.
     */
    Status?: CostEstimationStatus;
    /**
     * An array of ResourceCost objects that each contains details about the monthly cost estimate to analyze one of your AWS resources.
     */
    Costs?: ServiceResourceCosts;
    /**
     * The start and end time of the cost estimation.
     */
    TimeRange?: CostEstimationTimeRange;
    /**
     * The estimated monthly cost to analyze the AWS resources. This value is the sum of the estimated costs to analyze each resource in the Costs object in this response.
     */
    TotalCost?: Cost;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
  export interface GetResourceCollectionRequest {
    /**
     *  The type of AWS resource collections to return. The one valid value is CLOUD_FORMATION for AWS CloudFormation stacks. 
     */
    ResourceCollectionType: ResourceCollectionType;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If this value is null, it retrieves the first page.
     */
    NextToken?: UuidNextToken;
  }
  export interface GetResourceCollectionResponse {
    /**
     *  The requested list of AWS resource collections. The one type of AWS resource collection supported is AWS CloudFormation stacks. DevOps Guru can be configured to analyze only the AWS resources that are defined in the stacks. You can specify up to 500 AWS CloudFormation stacks. 
     */
    ResourceCollection?: ResourceCollectionFilter;
    /**
     * The pagination token to use to retrieve the next page of results for this operation. If there are no more pages, this value is null.
     */
    NextToken?: UuidNextToken;
  }
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
     *  The AWS source that emitted the events you want to filter for. 
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
  export type MeanTimeToRecoverInMilliseconds = number;
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
     *  Information about a notification channel configured in DevOps Guru to send notifications when insights are created.  If you use an Amazon SNS topic in another account, you must attach a policy to it that grants DevOps Guru permission to it notifications. DevOps Guru adds the required policy on your behalf to send notifications using Amazon SNS in your account. For more information, see Permissions for cross account Amazon SNS topics. If you use an Amazon SNS topic that is encrypted by an AWS Key Management Service customer-managed key (CMK), then you must add permissions to the CMK. For more information, see Permissions for AWS KMS–encrypted Amazon SNS topics.
     */
    Sns: SnsChannelConfig;
  }
  export type NotificationChannelId = string;
  export type NumMetricsAnalyzed = number;
  export type NumOpenProactiveInsights = number;
  export type NumOpenReactiveInsights = number;
  export type NumProactiveInsights = number;
  export type NumReactiveInsights = number;
  export interface OpsCenterIntegration {
    /**
     *  Specifies if DevOps Guru is enabled to create an AWS Systems Manager OpsItem for each created insight. 
     */
    OptInStatus?: OptInStatus;
  }
  export interface OpsCenterIntegrationConfig {
    /**
     *  Specifies if DevOps Guru is enabled to create an AWS Systems Manager OpsItem for each created insight. 
     */
    OptInStatus?: OptInStatus;
  }
  export type OptInStatus = "ENABLED"|"DISABLED"|string;
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
     *  The severity of a proactive anomaly. 
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
     *  A AnomalyReportedTimeRange object that specifies the time range between when the anomaly is opened and the time when it is closed. 
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
  }
  export interface ProactiveAnomalySummary {
    /**
     * The ID of the anomaly.
     */
    Id?: AnomalyId;
    /**
     * The severity of the anomaly.
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
     *  A AnomalyReportedTimeRange object that specifies the time range between when the anomaly is opened and the time when it is closed. 
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
     * The severity of the proactive insight. 
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
     *  The ID of the AWS System Manager OpsItem created for this insight. You must enable the creation of OpstItems insights before they are created for each insight. 
     */
    SsmOpsItemId?: SsmOpsItemId;
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
     * The severity of the proactive insight. 
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
     * A collection of the names of AWS services.
     */
    ServiceCollection?: ServiceCollection;
  }
  export type ProactiveInsights = ProactiveInsightSummary[];
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
     * The severity of the anomaly. 
     */
    Severity?: AnomalySeverity;
    /**
     *  The status of the anomaly. 
     */
    Status?: AnomalyStatus;
    AnomalyTimeRange?: AnomalyTimeRange;
    /**
     *  A AnomalyReportedTimeRange object that specifies the time range between when the anomaly is opened and the time when it is closed. 
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
  }
  export interface ReactiveAnomalySummary {
    /**
     *  The ID of the reactive anomaly. 
     */
    Id?: AnomalyId;
    /**
     *  The severity of the reactive anomaly. 
     */
    Severity?: AnomalySeverity;
    /**
     *  The status of the reactive anomaly. 
     */
    Status?: AnomalyStatus;
    AnomalyTimeRange?: AnomalyTimeRange;
    /**
     *  A AnomalyReportedTimeRange object that specifies the time range between when the anomaly is opened and the time when it is closed. 
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
     *  The severity of a reactive insight. 
     */
    Severity?: InsightSeverity;
    /**
     *  The status of a reactive insight. 
     */
    Status?: InsightStatus;
    InsightTimeRange?: InsightTimeRange;
    ResourceCollection?: ResourceCollection;
    /**
     *  The ID of the AWS System Manager OpsItem created for this insight. You must enable the creation of OpstItems insights before they are created for each insight. 
     */
    SsmOpsItemId?: SsmOpsItemId;
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
     *  The severity of a reactive insight. 
     */
    Severity?: InsightSeverity;
    /**
     *  The status of a reactive insight. 
     */
    Status?: InsightStatus;
    InsightTimeRange?: InsightTimeRange;
    ResourceCollection?: ResourceCollection;
    /**
     * A collection of the names of AWS services.
     */
    ServiceCollection?: ServiceCollection;
  }
  export type ReactiveInsights = ReactiveInsightSummary[];
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
  }
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
  }
  export interface RecommendationRelatedAnomalyResource {
    /**
     *  The name of the resource. 
     */
    Name?: RecommendationRelatedAnomalyResourceName;
    /**
     *  The type of the resource. 
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
     *  A ResourceCollection object that contains arrays of the names of AWS CloudFormation stacks. You can specify up to 500 AWS CloudFormation stacks. 
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
  export interface ResourceCollection {
    /**
     *  An array of the names of AWS CloudFormation stacks. The stacks define AWS resources that DevOps Guru analyzes. You can specify up to 500 AWS CloudFormation stacks. 
     */
    CloudFormation?: CloudFormationCollection;
  }
  export interface ResourceCollectionFilter {
    /**
     *  Information about AWS CloudFormation stacks. You can use up to 500 stacks to specify which AWS resources in your account to analyze. For more information, see Stacks in the AWS CloudFormation User Guide. 
     */
    CloudFormation?: CloudFormationCollectionFilter;
  }
  export type ResourceCollectionType = "AWS_CLOUD_FORMATION"|"AWS_SERVICE"|string;
  export type ResourceHours = number;
  export type ResourceType = string;
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
     * A collection of the names of AWS services.
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
  export interface ServiceCollection {
    /**
     * An array of strings that each specifies the name of an AWS service.
     */
    ServiceNames?: ServiceNames;
  }
  export interface ServiceHealth {
    /**
     * The name of the AWS service.
     */
    ServiceName?: ServiceName;
    /**
     * Represents the health of an AWS service. This is a ServiceInsightHealth that contains the number of open proactive and reactive insights for this service.
     */
    Insight?: ServiceInsightHealth;
  }
  export type ServiceHealths = ServiceHealth[];
  export interface ServiceInsightHealth {
    /**
     * The number of open proactive insights in the AWS service
     */
    OpenProactiveInsights?: NumOpenProactiveInsights;
    /**
     * The number of open reactive insights in the AWS service
     */
    OpenReactiveInsights?: NumOpenReactiveInsights;
  }
  export interface ServiceIntegrationConfig {
    /**
     *  Information about whether DevOps Guru is configured to create an OpsItem in AWS Systems Manager OpsCenter for each created insight. 
     */
    OpsCenter?: OpsCenterIntegration;
  }
  export type ServiceName = "API_GATEWAY"|"APPLICATION_ELB"|"AUTO_SCALING_GROUP"|"CLOUD_FRONT"|"DYNAMO_DB"|"EC2"|"ECS"|"EKS"|"ELASTIC_BEANSTALK"|"ELASTI_CACHE"|"ELB"|"ES"|"KINESIS"|"LAMBDA"|"NAT_GATEWAY"|"NETWORK_ELB"|"RDS"|"REDSHIFT"|"ROUTE_53"|"S3"|"SAGE_MAKER"|"SNS"|"SQS"|"STEP_FUNCTIONS"|"SWF"|string;
  export type ServiceNames = ServiceName[];
  export interface ServiceResourceCost {
    /**
     * The type of the AWS resource.
     */
    Type?: ResourceType;
    /**
     * The state of the resource. The resource is ACTIVE if it produces metrics, events, or logs within an hour, otherwise it is INACTIVE. You pay for the number of active AWS resource hours analyzed for each resource. Inactive resources are not charged. 
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
     * The collection of AWS resources used to create a monthly DevOps Guru cost estimate.
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
  export type Timestamp = Date;
  export type TopicArn = string;
  export interface UpdateCloudFormationCollectionFilter {
    /**
     *  An array of the names of the AWS CloudFormation stacks to update. You can specify up to 500 AWS CloudFormation stacks. 
     */
    StackNames?: UpdateStackNames;
  }
  export type UpdateResourceCollectionAction = "ADD"|"REMOVE"|string;
  export interface UpdateResourceCollectionFilter {
    /**
     *  An collection of AWS CloudFormation stacks. You can specify up to 500 AWS CloudFormation stacks. 
     */
    CloudFormation?: UpdateCloudFormationCollectionFilter;
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
