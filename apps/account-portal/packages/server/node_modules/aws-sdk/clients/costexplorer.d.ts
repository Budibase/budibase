import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CostExplorer extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CostExplorer.Types.ClientConfiguration)
  config: Config & CostExplorer.Types.ClientConfiguration;
  /**
   * Creates a new cost anomaly detection monitor with the requested type and monitor specification. 
   */
  createAnomalyMonitor(params: CostExplorer.Types.CreateAnomalyMonitorRequest, callback?: (err: AWSError, data: CostExplorer.Types.CreateAnomalyMonitorResponse) => void): Request<CostExplorer.Types.CreateAnomalyMonitorResponse, AWSError>;
  /**
   * Creates a new cost anomaly detection monitor with the requested type and monitor specification. 
   */
  createAnomalyMonitor(callback?: (err: AWSError, data: CostExplorer.Types.CreateAnomalyMonitorResponse) => void): Request<CostExplorer.Types.CreateAnomalyMonitorResponse, AWSError>;
  /**
   * Adds an alert subscription to a cost anomaly detection monitor. You can use each subscription to define subscribers with email or SNS notifications. Email subscribers can set an absolute or percentage threshold and a time frequency for receiving notifications. 
   */
  createAnomalySubscription(params: CostExplorer.Types.CreateAnomalySubscriptionRequest, callback?: (err: AWSError, data: CostExplorer.Types.CreateAnomalySubscriptionResponse) => void): Request<CostExplorer.Types.CreateAnomalySubscriptionResponse, AWSError>;
  /**
   * Adds an alert subscription to a cost anomaly detection monitor. You can use each subscription to define subscribers with email or SNS notifications. Email subscribers can set an absolute or percentage threshold and a time frequency for receiving notifications. 
   */
  createAnomalySubscription(callback?: (err: AWSError, data: CostExplorer.Types.CreateAnomalySubscriptionResponse) => void): Request<CostExplorer.Types.CreateAnomalySubscriptionResponse, AWSError>;
  /**
   * Creates a new Cost Category with the requested name and rules.
   */
  createCostCategoryDefinition(params: CostExplorer.Types.CreateCostCategoryDefinitionRequest, callback?: (err: AWSError, data: CostExplorer.Types.CreateCostCategoryDefinitionResponse) => void): Request<CostExplorer.Types.CreateCostCategoryDefinitionResponse, AWSError>;
  /**
   * Creates a new Cost Category with the requested name and rules.
   */
  createCostCategoryDefinition(callback?: (err: AWSError, data: CostExplorer.Types.CreateCostCategoryDefinitionResponse) => void): Request<CostExplorer.Types.CreateCostCategoryDefinitionResponse, AWSError>;
  /**
   * Deletes a cost anomaly monitor. 
   */
  deleteAnomalyMonitor(params: CostExplorer.Types.DeleteAnomalyMonitorRequest, callback?: (err: AWSError, data: CostExplorer.Types.DeleteAnomalyMonitorResponse) => void): Request<CostExplorer.Types.DeleteAnomalyMonitorResponse, AWSError>;
  /**
   * Deletes a cost anomaly monitor. 
   */
  deleteAnomalyMonitor(callback?: (err: AWSError, data: CostExplorer.Types.DeleteAnomalyMonitorResponse) => void): Request<CostExplorer.Types.DeleteAnomalyMonitorResponse, AWSError>;
  /**
   * Deletes a cost anomaly subscription. 
   */
  deleteAnomalySubscription(params: CostExplorer.Types.DeleteAnomalySubscriptionRequest, callback?: (err: AWSError, data: CostExplorer.Types.DeleteAnomalySubscriptionResponse) => void): Request<CostExplorer.Types.DeleteAnomalySubscriptionResponse, AWSError>;
  /**
   * Deletes a cost anomaly subscription. 
   */
  deleteAnomalySubscription(callback?: (err: AWSError, data: CostExplorer.Types.DeleteAnomalySubscriptionResponse) => void): Request<CostExplorer.Types.DeleteAnomalySubscriptionResponse, AWSError>;
  /**
   * Deletes a Cost Category. Expenses from this month going forward will no longer be categorized with this Cost Category.
   */
  deleteCostCategoryDefinition(params: CostExplorer.Types.DeleteCostCategoryDefinitionRequest, callback?: (err: AWSError, data: CostExplorer.Types.DeleteCostCategoryDefinitionResponse) => void): Request<CostExplorer.Types.DeleteCostCategoryDefinitionResponse, AWSError>;
  /**
   * Deletes a Cost Category. Expenses from this month going forward will no longer be categorized with this Cost Category.
   */
  deleteCostCategoryDefinition(callback?: (err: AWSError, data: CostExplorer.Types.DeleteCostCategoryDefinitionResponse) => void): Request<CostExplorer.Types.DeleteCostCategoryDefinitionResponse, AWSError>;
  /**
   * Returns the name, Amazon Resource Name (ARN), rules, definition, and effective dates of a Cost Category that's defined in the account. You have the option to use EffectiveOn to return a Cost Category that's active on a specific date. If there's no EffectiveOn specified, you see a Cost Category that's effective on the current date. If Cost Category is still effective, EffectiveEnd is omitted in the response. 
   */
  describeCostCategoryDefinition(params: CostExplorer.Types.DescribeCostCategoryDefinitionRequest, callback?: (err: AWSError, data: CostExplorer.Types.DescribeCostCategoryDefinitionResponse) => void): Request<CostExplorer.Types.DescribeCostCategoryDefinitionResponse, AWSError>;
  /**
   * Returns the name, Amazon Resource Name (ARN), rules, definition, and effective dates of a Cost Category that's defined in the account. You have the option to use EffectiveOn to return a Cost Category that's active on a specific date. If there's no EffectiveOn specified, you see a Cost Category that's effective on the current date. If Cost Category is still effective, EffectiveEnd is omitted in the response. 
   */
  describeCostCategoryDefinition(callback?: (err: AWSError, data: CostExplorer.Types.DescribeCostCategoryDefinitionResponse) => void): Request<CostExplorer.Types.DescribeCostCategoryDefinitionResponse, AWSError>;
  /**
   * Retrieves all of the cost anomalies detected on your account during the time period that's specified by the DateInterval object. Anomalies are available for up to 90 days.
   */
  getAnomalies(params: CostExplorer.Types.GetAnomaliesRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetAnomaliesResponse) => void): Request<CostExplorer.Types.GetAnomaliesResponse, AWSError>;
  /**
   * Retrieves all of the cost anomalies detected on your account during the time period that's specified by the DateInterval object. Anomalies are available for up to 90 days.
   */
  getAnomalies(callback?: (err: AWSError, data: CostExplorer.Types.GetAnomaliesResponse) => void): Request<CostExplorer.Types.GetAnomaliesResponse, AWSError>;
  /**
   * Retrieves the cost anomaly monitor definitions for your account. You can filter using a list of cost anomaly monitor Amazon Resource Names (ARNs). 
   */
  getAnomalyMonitors(params: CostExplorer.Types.GetAnomalyMonitorsRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetAnomalyMonitorsResponse) => void): Request<CostExplorer.Types.GetAnomalyMonitorsResponse, AWSError>;
  /**
   * Retrieves the cost anomaly monitor definitions for your account. You can filter using a list of cost anomaly monitor Amazon Resource Names (ARNs). 
   */
  getAnomalyMonitors(callback?: (err: AWSError, data: CostExplorer.Types.GetAnomalyMonitorsResponse) => void): Request<CostExplorer.Types.GetAnomalyMonitorsResponse, AWSError>;
  /**
   * Retrieves the cost anomaly subscription objects for your account. You can filter using a list of cost anomaly monitor Amazon Resource Names (ARNs). 
   */
  getAnomalySubscriptions(params: CostExplorer.Types.GetAnomalySubscriptionsRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetAnomalySubscriptionsResponse) => void): Request<CostExplorer.Types.GetAnomalySubscriptionsResponse, AWSError>;
  /**
   * Retrieves the cost anomaly subscription objects for your account. You can filter using a list of cost anomaly monitor Amazon Resource Names (ARNs). 
   */
  getAnomalySubscriptions(callback?: (err: AWSError, data: CostExplorer.Types.GetAnomalySubscriptionsResponse) => void): Request<CostExplorer.Types.GetAnomalySubscriptionsResponse, AWSError>;
  /**
   * Retrieves cost and usage metrics for your account. You can specify which cost and usage-related metric that you want the request to return. For example, you can specify BlendedCosts or UsageQuantity. You can also filter and group your data by various dimensions, such as SERVICE or AZ, in a specific time range. For a complete list of valid dimensions, see the GetDimensionValues operation. Management account in an organization in Organizations have access to all member accounts. For information about filter limitations, see Quotas and restrictions in the Billing and Cost Management User Guide.
   */
  getCostAndUsage(params: CostExplorer.Types.GetCostAndUsageRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetCostAndUsageResponse) => void): Request<CostExplorer.Types.GetCostAndUsageResponse, AWSError>;
  /**
   * Retrieves cost and usage metrics for your account. You can specify which cost and usage-related metric that you want the request to return. For example, you can specify BlendedCosts or UsageQuantity. You can also filter and group your data by various dimensions, such as SERVICE or AZ, in a specific time range. For a complete list of valid dimensions, see the GetDimensionValues operation. Management account in an organization in Organizations have access to all member accounts. For information about filter limitations, see Quotas and restrictions in the Billing and Cost Management User Guide.
   */
  getCostAndUsage(callback?: (err: AWSError, data: CostExplorer.Types.GetCostAndUsageResponse) => void): Request<CostExplorer.Types.GetCostAndUsageResponse, AWSError>;
  /**
   * Retrieves cost and usage metrics with resources for your account. You can specify which cost and usage-related metric, such as BlendedCosts or UsageQuantity, that you want the request to return. You can also filter and group your data by various dimensions, such as SERVICE or AZ, in a specific time range. For a complete list of valid dimensions, see the GetDimensionValues operation. Management account in an organization in Organizations have access to all member accounts. This API is currently available for the Amazon Elastic Compute Cloud – Compute service only.  This is an opt-in only feature. You can enable this feature from the Cost Explorer Settings page. For information about how to access the Settings page, see Controlling Access for Cost Explorer in the Billing and Cost Management User Guide. 
   */
  getCostAndUsageWithResources(params: CostExplorer.Types.GetCostAndUsageWithResourcesRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetCostAndUsageWithResourcesResponse) => void): Request<CostExplorer.Types.GetCostAndUsageWithResourcesResponse, AWSError>;
  /**
   * Retrieves cost and usage metrics with resources for your account. You can specify which cost and usage-related metric, such as BlendedCosts or UsageQuantity, that you want the request to return. You can also filter and group your data by various dimensions, such as SERVICE or AZ, in a specific time range. For a complete list of valid dimensions, see the GetDimensionValues operation. Management account in an organization in Organizations have access to all member accounts. This API is currently available for the Amazon Elastic Compute Cloud – Compute service only.  This is an opt-in only feature. You can enable this feature from the Cost Explorer Settings page. For information about how to access the Settings page, see Controlling Access for Cost Explorer in the Billing and Cost Management User Guide. 
   */
  getCostAndUsageWithResources(callback?: (err: AWSError, data: CostExplorer.Types.GetCostAndUsageWithResourcesResponse) => void): Request<CostExplorer.Types.GetCostAndUsageWithResourcesResponse, AWSError>;
  /**
   * Retrieves an array of Cost Category names and values incurred cost.  If some Cost Category names and values are not associated with any cost, they will not be returned by this API. 
   */
  getCostCategories(params: CostExplorer.Types.GetCostCategoriesRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetCostCategoriesResponse) => void): Request<CostExplorer.Types.GetCostCategoriesResponse, AWSError>;
  /**
   * Retrieves an array of Cost Category names and values incurred cost.  If some Cost Category names and values are not associated with any cost, they will not be returned by this API. 
   */
  getCostCategories(callback?: (err: AWSError, data: CostExplorer.Types.GetCostCategoriesResponse) => void): Request<CostExplorer.Types.GetCostCategoriesResponse, AWSError>;
  /**
   * Retrieves a forecast for how much Amazon Web Services predicts that you will spend over the forecast time period that you select, based on your past costs. 
   */
  getCostForecast(params: CostExplorer.Types.GetCostForecastRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetCostForecastResponse) => void): Request<CostExplorer.Types.GetCostForecastResponse, AWSError>;
  /**
   * Retrieves a forecast for how much Amazon Web Services predicts that you will spend over the forecast time period that you select, based on your past costs. 
   */
  getCostForecast(callback?: (err: AWSError, data: CostExplorer.Types.GetCostForecastResponse) => void): Request<CostExplorer.Types.GetCostForecastResponse, AWSError>;
  /**
   * Retrieves all available filter values for a specified filter over a period of time. You can search the dimension values for an arbitrary string. 
   */
  getDimensionValues(params: CostExplorer.Types.GetDimensionValuesRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetDimensionValuesResponse) => void): Request<CostExplorer.Types.GetDimensionValuesResponse, AWSError>;
  /**
   * Retrieves all available filter values for a specified filter over a period of time. You can search the dimension values for an arbitrary string. 
   */
  getDimensionValues(callback?: (err: AWSError, data: CostExplorer.Types.GetDimensionValuesResponse) => void): Request<CostExplorer.Types.GetDimensionValuesResponse, AWSError>;
  /**
   * Retrieves the reservation coverage for your account, which you can use to see how much of your Amazon Elastic Compute Cloud, Amazon ElastiCache, Amazon Relational Database Service, or Amazon Redshift usage is covered by a reservation. An organization's management account can see the coverage of the associated member accounts. This supports dimensions, Cost Categories, and nested expressions. For any time period, you can filter data about reservation usage by the following dimensions:   AZ   CACHE_ENGINE   DATABASE_ENGINE   DEPLOYMENT_OPTION   INSTANCE_TYPE   LINKED_ACCOUNT   OPERATING_SYSTEM   PLATFORM   REGION   SERVICE   TAG   TENANCY   To determine valid values for a dimension, use the GetDimensionValues operation. 
   */
  getReservationCoverage(params: CostExplorer.Types.GetReservationCoverageRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetReservationCoverageResponse) => void): Request<CostExplorer.Types.GetReservationCoverageResponse, AWSError>;
  /**
   * Retrieves the reservation coverage for your account, which you can use to see how much of your Amazon Elastic Compute Cloud, Amazon ElastiCache, Amazon Relational Database Service, or Amazon Redshift usage is covered by a reservation. An organization's management account can see the coverage of the associated member accounts. This supports dimensions, Cost Categories, and nested expressions. For any time period, you can filter data about reservation usage by the following dimensions:   AZ   CACHE_ENGINE   DATABASE_ENGINE   DEPLOYMENT_OPTION   INSTANCE_TYPE   LINKED_ACCOUNT   OPERATING_SYSTEM   PLATFORM   REGION   SERVICE   TAG   TENANCY   To determine valid values for a dimension, use the GetDimensionValues operation. 
   */
  getReservationCoverage(callback?: (err: AWSError, data: CostExplorer.Types.GetReservationCoverageResponse) => void): Request<CostExplorer.Types.GetReservationCoverageResponse, AWSError>;
  /**
   * Gets recommendations for reservation purchases. These recommendations might help you to reduce your costs. Reservations provide a discounted hourly rate (up to 75%) compared to On-Demand pricing. Amazon Web Services generates your recommendations by identifying your On-Demand usage during a specific time period and collecting your usage into categories that are eligible for a reservation. After Amazon Web Services has these categories, it simulates every combination of reservations in each category of usage to identify the best number of each type of Reserved Instance (RI) to purchase to maximize your estimated savings.  For example, Amazon Web Services automatically aggregates your Amazon EC2 Linux, shared tenancy, and c4 family usage in the US West (Oregon) Region and recommends that you buy size-flexible regional reservations to apply to the c4 family usage. Amazon Web Services recommends the smallest size instance in an instance family. This makes it easier to purchase a size-flexible Reserved Instance (RI). Amazon Web Services also shows the equal number of normalized units. This way, you can purchase any instance size that you want. For this example, your RI recommendation is for c4.large because that is the smallest size instance in the c4 instance family.
   */
  getReservationPurchaseRecommendation(params: CostExplorer.Types.GetReservationPurchaseRecommendationRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetReservationPurchaseRecommendationResponse) => void): Request<CostExplorer.Types.GetReservationPurchaseRecommendationResponse, AWSError>;
  /**
   * Gets recommendations for reservation purchases. These recommendations might help you to reduce your costs. Reservations provide a discounted hourly rate (up to 75%) compared to On-Demand pricing. Amazon Web Services generates your recommendations by identifying your On-Demand usage during a specific time period and collecting your usage into categories that are eligible for a reservation. After Amazon Web Services has these categories, it simulates every combination of reservations in each category of usage to identify the best number of each type of Reserved Instance (RI) to purchase to maximize your estimated savings.  For example, Amazon Web Services automatically aggregates your Amazon EC2 Linux, shared tenancy, and c4 family usage in the US West (Oregon) Region and recommends that you buy size-flexible regional reservations to apply to the c4 family usage. Amazon Web Services recommends the smallest size instance in an instance family. This makes it easier to purchase a size-flexible Reserved Instance (RI). Amazon Web Services also shows the equal number of normalized units. This way, you can purchase any instance size that you want. For this example, your RI recommendation is for c4.large because that is the smallest size instance in the c4 instance family.
   */
  getReservationPurchaseRecommendation(callback?: (err: AWSError, data: CostExplorer.Types.GetReservationPurchaseRecommendationResponse) => void): Request<CostExplorer.Types.GetReservationPurchaseRecommendationResponse, AWSError>;
  /**
   * Retrieves the reservation utilization for your account. Management account in an organization have access to member accounts. You can filter data by dimensions in a time period. You can use GetDimensionValues to determine the possible dimension values. Currently, you can group only by SUBSCRIPTION_ID. 
   */
  getReservationUtilization(params: CostExplorer.Types.GetReservationUtilizationRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetReservationUtilizationResponse) => void): Request<CostExplorer.Types.GetReservationUtilizationResponse, AWSError>;
  /**
   * Retrieves the reservation utilization for your account. Management account in an organization have access to member accounts. You can filter data by dimensions in a time period. You can use GetDimensionValues to determine the possible dimension values. Currently, you can group only by SUBSCRIPTION_ID. 
   */
  getReservationUtilization(callback?: (err: AWSError, data: CostExplorer.Types.GetReservationUtilizationResponse) => void): Request<CostExplorer.Types.GetReservationUtilizationResponse, AWSError>;
  /**
   * Creates recommendations that help you save cost by identifying idle and underutilized Amazon EC2 instances. Recommendations are generated to either downsize or terminate instances, along with providing savings detail and metrics. For more information about calculation and function, see Optimizing Your Cost with Rightsizing Recommendations in the Billing and Cost Management User Guide.
   */
  getRightsizingRecommendation(params: CostExplorer.Types.GetRightsizingRecommendationRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetRightsizingRecommendationResponse) => void): Request<CostExplorer.Types.GetRightsizingRecommendationResponse, AWSError>;
  /**
   * Creates recommendations that help you save cost by identifying idle and underutilized Amazon EC2 instances. Recommendations are generated to either downsize or terminate instances, along with providing savings detail and metrics. For more information about calculation and function, see Optimizing Your Cost with Rightsizing Recommendations in the Billing and Cost Management User Guide.
   */
  getRightsizingRecommendation(callback?: (err: AWSError, data: CostExplorer.Types.GetRightsizingRecommendationResponse) => void): Request<CostExplorer.Types.GetRightsizingRecommendationResponse, AWSError>;
  /**
   * Retrieves the details for a Savings Plan recommendation. These details include the hourly data-points that construct the cost, coverage, and utilization charts.
   */
  getSavingsPlanPurchaseRecommendationDetails(params: CostExplorer.Types.GetSavingsPlanPurchaseRecommendationDetailsRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetSavingsPlanPurchaseRecommendationDetailsResponse) => void): Request<CostExplorer.Types.GetSavingsPlanPurchaseRecommendationDetailsResponse, AWSError>;
  /**
   * Retrieves the details for a Savings Plan recommendation. These details include the hourly data-points that construct the cost, coverage, and utilization charts.
   */
  getSavingsPlanPurchaseRecommendationDetails(callback?: (err: AWSError, data: CostExplorer.Types.GetSavingsPlanPurchaseRecommendationDetailsResponse) => void): Request<CostExplorer.Types.GetSavingsPlanPurchaseRecommendationDetailsResponse, AWSError>;
  /**
   * Retrieves the Savings Plans covered for your account. This enables you to see how much of your cost is covered by a Savings Plan. An organization’s management account can see the coverage of the associated member accounts. This supports dimensions, Cost Categories, and nested expressions. For any time period, you can filter data for Savings Plans usage with the following dimensions:    LINKED_ACCOUNT     REGION     SERVICE     INSTANCE_FAMILY    To determine valid values for a dimension, use the GetDimensionValues operation.
   */
  getSavingsPlansCoverage(params: CostExplorer.Types.GetSavingsPlansCoverageRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetSavingsPlansCoverageResponse) => void): Request<CostExplorer.Types.GetSavingsPlansCoverageResponse, AWSError>;
  /**
   * Retrieves the Savings Plans covered for your account. This enables you to see how much of your cost is covered by a Savings Plan. An organization’s management account can see the coverage of the associated member accounts. This supports dimensions, Cost Categories, and nested expressions. For any time period, you can filter data for Savings Plans usage with the following dimensions:    LINKED_ACCOUNT     REGION     SERVICE     INSTANCE_FAMILY    To determine valid values for a dimension, use the GetDimensionValues operation.
   */
  getSavingsPlansCoverage(callback?: (err: AWSError, data: CostExplorer.Types.GetSavingsPlansCoverageResponse) => void): Request<CostExplorer.Types.GetSavingsPlansCoverageResponse, AWSError>;
  /**
   * Retrieves the Savings Plans recommendations for your account. First use StartSavingsPlansPurchaseRecommendationGeneration to generate a new set of recommendations, and then use GetSavingsPlansPurchaseRecommendation to retrieve them.
   */
  getSavingsPlansPurchaseRecommendation(params: CostExplorer.Types.GetSavingsPlansPurchaseRecommendationRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetSavingsPlansPurchaseRecommendationResponse) => void): Request<CostExplorer.Types.GetSavingsPlansPurchaseRecommendationResponse, AWSError>;
  /**
   * Retrieves the Savings Plans recommendations for your account. First use StartSavingsPlansPurchaseRecommendationGeneration to generate a new set of recommendations, and then use GetSavingsPlansPurchaseRecommendation to retrieve them.
   */
  getSavingsPlansPurchaseRecommendation(callback?: (err: AWSError, data: CostExplorer.Types.GetSavingsPlansPurchaseRecommendationResponse) => void): Request<CostExplorer.Types.GetSavingsPlansPurchaseRecommendationResponse, AWSError>;
  /**
   * Retrieves the Savings Plans utilization for your account across date ranges with daily or monthly granularity. Management account in an organization have access to member accounts. You can use GetDimensionValues in SAVINGS_PLANS to determine the possible dimension values.  You can't group by any dimension values for GetSavingsPlansUtilization. 
   */
  getSavingsPlansUtilization(params: CostExplorer.Types.GetSavingsPlansUtilizationRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetSavingsPlansUtilizationResponse) => void): Request<CostExplorer.Types.GetSavingsPlansUtilizationResponse, AWSError>;
  /**
   * Retrieves the Savings Plans utilization for your account across date ranges with daily or monthly granularity. Management account in an organization have access to member accounts. You can use GetDimensionValues in SAVINGS_PLANS to determine the possible dimension values.  You can't group by any dimension values for GetSavingsPlansUtilization. 
   */
  getSavingsPlansUtilization(callback?: (err: AWSError, data: CostExplorer.Types.GetSavingsPlansUtilizationResponse) => void): Request<CostExplorer.Types.GetSavingsPlansUtilizationResponse, AWSError>;
  /**
   * Retrieves attribute data along with aggregate utilization and savings data for a given time period. This doesn't support granular or grouped data (daily/monthly) in response. You can't retrieve data by dates in a single response similar to GetSavingsPlanUtilization, but you have the option to make multiple calls to GetSavingsPlanUtilizationDetails by providing individual dates. You can use GetDimensionValues in SAVINGS_PLANS to determine the possible dimension values.   GetSavingsPlanUtilizationDetails internally groups data by SavingsPlansArn. 
   */
  getSavingsPlansUtilizationDetails(params: CostExplorer.Types.GetSavingsPlansUtilizationDetailsRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetSavingsPlansUtilizationDetailsResponse) => void): Request<CostExplorer.Types.GetSavingsPlansUtilizationDetailsResponse, AWSError>;
  /**
   * Retrieves attribute data along with aggregate utilization and savings data for a given time period. This doesn't support granular or grouped data (daily/monthly) in response. You can't retrieve data by dates in a single response similar to GetSavingsPlanUtilization, but you have the option to make multiple calls to GetSavingsPlanUtilizationDetails by providing individual dates. You can use GetDimensionValues in SAVINGS_PLANS to determine the possible dimension values.   GetSavingsPlanUtilizationDetails internally groups data by SavingsPlansArn. 
   */
  getSavingsPlansUtilizationDetails(callback?: (err: AWSError, data: CostExplorer.Types.GetSavingsPlansUtilizationDetailsResponse) => void): Request<CostExplorer.Types.GetSavingsPlansUtilizationDetailsResponse, AWSError>;
  /**
   * Queries for available tag keys and tag values for a specified period. You can search the tag values for an arbitrary string. 
   */
  getTags(params: CostExplorer.Types.GetTagsRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetTagsResponse) => void): Request<CostExplorer.Types.GetTagsResponse, AWSError>;
  /**
   * Queries for available tag keys and tag values for a specified period. You can search the tag values for an arbitrary string. 
   */
  getTags(callback?: (err: AWSError, data: CostExplorer.Types.GetTagsResponse) => void): Request<CostExplorer.Types.GetTagsResponse, AWSError>;
  /**
   * Retrieves a forecast for how much Amazon Web Services predicts that you will use over the forecast time period that you select, based on your past usage. 
   */
  getUsageForecast(params: CostExplorer.Types.GetUsageForecastRequest, callback?: (err: AWSError, data: CostExplorer.Types.GetUsageForecastResponse) => void): Request<CostExplorer.Types.GetUsageForecastResponse, AWSError>;
  /**
   * Retrieves a forecast for how much Amazon Web Services predicts that you will use over the forecast time period that you select, based on your past usage. 
   */
  getUsageForecast(callback?: (err: AWSError, data: CostExplorer.Types.GetUsageForecastResponse) => void): Request<CostExplorer.Types.GetUsageForecastResponse, AWSError>;
  /**
   * Get a list of cost allocation tags. All inputs in the API are optional and serve as filters. By default, all cost allocation tags are returned. 
   */
  listCostAllocationTags(params: CostExplorer.Types.ListCostAllocationTagsRequest, callback?: (err: AWSError, data: CostExplorer.Types.ListCostAllocationTagsResponse) => void): Request<CostExplorer.Types.ListCostAllocationTagsResponse, AWSError>;
  /**
   * Get a list of cost allocation tags. All inputs in the API are optional and serve as filters. By default, all cost allocation tags are returned. 
   */
  listCostAllocationTags(callback?: (err: AWSError, data: CostExplorer.Types.ListCostAllocationTagsResponse) => void): Request<CostExplorer.Types.ListCostAllocationTagsResponse, AWSError>;
  /**
   * Returns the name, Amazon Resource Name (ARN), NumberOfRules and effective dates of all Cost Categories defined in the account. You have the option to use EffectiveOn to return a list of Cost Categories that were active on a specific date. If there is no EffectiveOn specified, you’ll see Cost Categories that are effective on the current date. If Cost Category is still effective, EffectiveEnd is omitted in the response. ListCostCategoryDefinitions supports pagination. The request can have a MaxResults range up to 100.
   */
  listCostCategoryDefinitions(params: CostExplorer.Types.ListCostCategoryDefinitionsRequest, callback?: (err: AWSError, data: CostExplorer.Types.ListCostCategoryDefinitionsResponse) => void): Request<CostExplorer.Types.ListCostCategoryDefinitionsResponse, AWSError>;
  /**
   * Returns the name, Amazon Resource Name (ARN), NumberOfRules and effective dates of all Cost Categories defined in the account. You have the option to use EffectiveOn to return a list of Cost Categories that were active on a specific date. If there is no EffectiveOn specified, you’ll see Cost Categories that are effective on the current date. If Cost Category is still effective, EffectiveEnd is omitted in the response. ListCostCategoryDefinitions supports pagination. The request can have a MaxResults range up to 100.
   */
  listCostCategoryDefinitions(callback?: (err: AWSError, data: CostExplorer.Types.ListCostCategoryDefinitionsResponse) => void): Request<CostExplorer.Types.ListCostCategoryDefinitionsResponse, AWSError>;
  /**
   * Retrieves a list of your historical recommendation generations within the past 30 days.
   */
  listSavingsPlansPurchaseRecommendationGeneration(params: CostExplorer.Types.ListSavingsPlansPurchaseRecommendationGenerationRequest, callback?: (err: AWSError, data: CostExplorer.Types.ListSavingsPlansPurchaseRecommendationGenerationResponse) => void): Request<CostExplorer.Types.ListSavingsPlansPurchaseRecommendationGenerationResponse, AWSError>;
  /**
   * Retrieves a list of your historical recommendation generations within the past 30 days.
   */
  listSavingsPlansPurchaseRecommendationGeneration(callback?: (err: AWSError, data: CostExplorer.Types.ListSavingsPlansPurchaseRecommendationGenerationResponse) => void): Request<CostExplorer.Types.ListSavingsPlansPurchaseRecommendationGenerationResponse, AWSError>;
  /**
   * Returns a list of resource tags associated with the resource specified by the Amazon Resource Name (ARN). 
   */
  listTagsForResource(params: CostExplorer.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: CostExplorer.Types.ListTagsForResourceResponse) => void): Request<CostExplorer.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of resource tags associated with the resource specified by the Amazon Resource Name (ARN). 
   */
  listTagsForResource(callback?: (err: AWSError, data: CostExplorer.Types.ListTagsForResourceResponse) => void): Request<CostExplorer.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Modifies the feedback property of a given cost anomaly. 
   */
  provideAnomalyFeedback(params: CostExplorer.Types.ProvideAnomalyFeedbackRequest, callback?: (err: AWSError, data: CostExplorer.Types.ProvideAnomalyFeedbackResponse) => void): Request<CostExplorer.Types.ProvideAnomalyFeedbackResponse, AWSError>;
  /**
   * Modifies the feedback property of a given cost anomaly. 
   */
  provideAnomalyFeedback(callback?: (err: AWSError, data: CostExplorer.Types.ProvideAnomalyFeedbackResponse) => void): Request<CostExplorer.Types.ProvideAnomalyFeedbackResponse, AWSError>;
  /**
   * Requests a Savings Plans recommendation generation. This enables you to calculate a fresh set of Savings Plans recommendations that takes your latest usage data and current Savings Plans inventory into account. You can refresh Savings Plans recommendations up to three times daily for a consolidated billing family.   StartSavingsPlansPurchaseRecommendationGeneration has no request syntax because no input parameters are needed to support this operation. 
   */
  startSavingsPlansPurchaseRecommendationGeneration(params: CostExplorer.Types.StartSavingsPlansPurchaseRecommendationGenerationRequest, callback?: (err: AWSError, data: CostExplorer.Types.StartSavingsPlansPurchaseRecommendationGenerationResponse) => void): Request<CostExplorer.Types.StartSavingsPlansPurchaseRecommendationGenerationResponse, AWSError>;
  /**
   * Requests a Savings Plans recommendation generation. This enables you to calculate a fresh set of Savings Plans recommendations that takes your latest usage data and current Savings Plans inventory into account. You can refresh Savings Plans recommendations up to three times daily for a consolidated billing family.   StartSavingsPlansPurchaseRecommendationGeneration has no request syntax because no input parameters are needed to support this operation. 
   */
  startSavingsPlansPurchaseRecommendationGeneration(callback?: (err: AWSError, data: CostExplorer.Types.StartSavingsPlansPurchaseRecommendationGenerationResponse) => void): Request<CostExplorer.Types.StartSavingsPlansPurchaseRecommendationGenerationResponse, AWSError>;
  /**
   * An API operation for adding one or more tags (key-value pairs) to a resource. You can use the TagResource operation with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value you specify replaces the previous value for that tag. Although the maximum number of array members is 200, user-tag maximum is 50. The remaining are reserved for Amazon Web Services use.
   */
  tagResource(params: CostExplorer.Types.TagResourceRequest, callback?: (err: AWSError, data: CostExplorer.Types.TagResourceResponse) => void): Request<CostExplorer.Types.TagResourceResponse, AWSError>;
  /**
   * An API operation for adding one or more tags (key-value pairs) to a resource. You can use the TagResource operation with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the resource. If you specify a tag key that is already associated with the resource, the new tag value you specify replaces the previous value for that tag. Although the maximum number of array members is 200, user-tag maximum is 50. The remaining are reserved for Amazon Web Services use.
   */
  tagResource(callback?: (err: AWSError, data: CostExplorer.Types.TagResourceResponse) => void): Request<CostExplorer.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a resource. Specify only tag keys in your request. Don't specify the value. 
   */
  untagResource(params: CostExplorer.Types.UntagResourceRequest, callback?: (err: AWSError, data: CostExplorer.Types.UntagResourceResponse) => void): Request<CostExplorer.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a resource. Specify only tag keys in your request. Don't specify the value. 
   */
  untagResource(callback?: (err: AWSError, data: CostExplorer.Types.UntagResourceResponse) => void): Request<CostExplorer.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an existing cost anomaly monitor. The changes made are applied going forward, and doesn't change anomalies detected in the past. 
   */
  updateAnomalyMonitor(params: CostExplorer.Types.UpdateAnomalyMonitorRequest, callback?: (err: AWSError, data: CostExplorer.Types.UpdateAnomalyMonitorResponse) => void): Request<CostExplorer.Types.UpdateAnomalyMonitorResponse, AWSError>;
  /**
   * Updates an existing cost anomaly monitor. The changes made are applied going forward, and doesn't change anomalies detected in the past. 
   */
  updateAnomalyMonitor(callback?: (err: AWSError, data: CostExplorer.Types.UpdateAnomalyMonitorResponse) => void): Request<CostExplorer.Types.UpdateAnomalyMonitorResponse, AWSError>;
  /**
   * Updates an existing cost anomaly subscription. Specify the fields that you want to update. Omitted fields are unchanged.  The JSON below describes the generic construct for each type. See Request Parameters for possible values as they apply to AnomalySubscription. 
   */
  updateAnomalySubscription(params: CostExplorer.Types.UpdateAnomalySubscriptionRequest, callback?: (err: AWSError, data: CostExplorer.Types.UpdateAnomalySubscriptionResponse) => void): Request<CostExplorer.Types.UpdateAnomalySubscriptionResponse, AWSError>;
  /**
   * Updates an existing cost anomaly subscription. Specify the fields that you want to update. Omitted fields are unchanged.  The JSON below describes the generic construct for each type. See Request Parameters for possible values as they apply to AnomalySubscription. 
   */
  updateAnomalySubscription(callback?: (err: AWSError, data: CostExplorer.Types.UpdateAnomalySubscriptionResponse) => void): Request<CostExplorer.Types.UpdateAnomalySubscriptionResponse, AWSError>;
  /**
   * Updates status for cost allocation tags in bulk, with maximum batch size of 20. If the tag status that's updated is the same as the existing tag status, the request doesn't fail. Instead, it doesn't have any effect on the tag status (for example, activating the active tag). 
   */
  updateCostAllocationTagsStatus(params: CostExplorer.Types.UpdateCostAllocationTagsStatusRequest, callback?: (err: AWSError, data: CostExplorer.Types.UpdateCostAllocationTagsStatusResponse) => void): Request<CostExplorer.Types.UpdateCostAllocationTagsStatusResponse, AWSError>;
  /**
   * Updates status for cost allocation tags in bulk, with maximum batch size of 20. If the tag status that's updated is the same as the existing tag status, the request doesn't fail. Instead, it doesn't have any effect on the tag status (for example, activating the active tag). 
   */
  updateCostAllocationTagsStatus(callback?: (err: AWSError, data: CostExplorer.Types.UpdateCostAllocationTagsStatusResponse) => void): Request<CostExplorer.Types.UpdateCostAllocationTagsStatusResponse, AWSError>;
  /**
   * Updates an existing Cost Category. Changes made to the Cost Category rules will be used to categorize the current month’s expenses and future expenses. This won’t change categorization for the previous months.
   */
  updateCostCategoryDefinition(params: CostExplorer.Types.UpdateCostCategoryDefinitionRequest, callback?: (err: AWSError, data: CostExplorer.Types.UpdateCostCategoryDefinitionResponse) => void): Request<CostExplorer.Types.UpdateCostCategoryDefinitionResponse, AWSError>;
  /**
   * Updates an existing Cost Category. Changes made to the Cost Category rules will be used to categorize the current month’s expenses and future expenses. This won’t change categorization for the previous months.
   */
  updateCostCategoryDefinition(callback?: (err: AWSError, data: CostExplorer.Types.UpdateCostCategoryDefinitionResponse) => void): Request<CostExplorer.Types.UpdateCostCategoryDefinitionResponse, AWSError>;
}
declare namespace CostExplorer {
  export type AccountScope = "PAYER"|"LINKED"|string;
  export type AmortizedRecurringFee = string;
  export type AmortizedUpfrontFee = string;
  export type Anomalies = Anomaly[];
  export interface Anomaly {
    /**
     * The unique identifier for the anomaly. 
     */
    AnomalyId: GenericString;
    /**
     * The first day the anomaly is detected. 
     */
    AnomalyStartDate?: YearMonthDay;
    /**
     * The last day the anomaly is detected. 
     */
    AnomalyEndDate?: YearMonthDay;
    /**
     * The dimension for the anomaly (for example, an Amazon Web Service in a service monitor). 
     */
    DimensionValue?: GenericString;
    /**
     * The list of identified root causes for the anomaly. 
     */
    RootCauses?: RootCauses;
    /**
     * The latest and maximum score for the anomaly. 
     */
    AnomalyScore: AnomalyScore;
    /**
     * The dollar impact for the anomaly. 
     */
    Impact: Impact;
    /**
     * The Amazon Resource Name (ARN) for the cost monitor that generated this anomaly. 
     */
    MonitorArn: GenericString;
    /**
     * The feedback value. 
     */
    Feedback?: AnomalyFeedbackType;
  }
  export interface AnomalyDateInterval {
    /**
     * The first date an anomaly was observed. 
     */
    StartDate: YearMonthDay;
    /**
     * The last date an anomaly was observed. 
     */
    EndDate?: YearMonthDay;
  }
  export type AnomalyFeedbackType = "YES"|"NO"|"PLANNED_ACTIVITY"|string;
  export interface AnomalyMonitor {
    /**
     * The Amazon Resource Name (ARN) value. 
     */
    MonitorArn?: GenericString;
    /**
     * The name of the monitor. 
     */
    MonitorName: GenericString;
    /**
     * The date when the monitor was created. 
     */
    CreationDate?: YearMonthDay;
    /**
     * The date when the monitor was last updated. 
     */
    LastUpdatedDate?: YearMonthDay;
    /**
     * The date when the monitor last evaluated for anomalies. 
     */
    LastEvaluatedDate?: YearMonthDay;
    /**
     * The possible type values. 
     */
    MonitorType: MonitorType;
    /**
     * The dimensions to evaluate. 
     */
    MonitorDimension?: MonitorDimension;
    MonitorSpecification?: Expression;
    /**
     * The value for evaluated dimensions. 
     */
    DimensionalValueCount?: NonNegativeInteger;
  }
  export type AnomalyMonitors = AnomalyMonitor[];
  export interface AnomalyScore {
    /**
     * The maximum score that's observed during the AnomalyDateInterval. 
     */
    MaxScore: GenericDouble;
    /**
     * The last observed score. 
     */
    CurrentScore: GenericDouble;
  }
  export interface AnomalySubscription {
    /**
     * The AnomalySubscription Amazon Resource Name (ARN). 
     */
    SubscriptionArn?: GenericString;
    /**
     * Your unique account identifier. 
     */
    AccountId?: GenericString;
    /**
     * A list of cost anomaly monitors. 
     */
    MonitorArnList: MonitorArnList;
    /**
     * A list of subscribers to notify. 
     */
    Subscribers: Subscribers;
    /**
     * (deprecated) An absolute dollar value that must be exceeded by the anomaly's total impact (see Impact for more details) for an anomaly notification to be generated. This field has been deprecated. To specify a threshold, use ThresholdExpression. Continued use of Threshold will be treated as shorthand syntax for a ThresholdExpression. One of Threshold or ThresholdExpression is required for this resource. You cannot specify both.
     */
    Threshold?: NullableNonNegativeDouble;
    /**
     * The frequency that anomaly notifications are sent. Notifications are sent either over email (for DAILY and WEEKLY frequencies) or SNS (for IMMEDIATE frequency). For more information, see Creating an Amazon SNS topic for anomaly notifications.
     */
    Frequency: AnomalySubscriptionFrequency;
    /**
     * The name for the subscription. 
     */
    SubscriptionName: GenericString;
    /**
     * An Expression object used to specify the anomalies that you want to generate alerts for. This supports dimensions and nested expressions. The supported dimensions are ANOMALY_TOTAL_IMPACT_ABSOLUTE and ANOMALY_TOTAL_IMPACT_PERCENTAGE, corresponding to an anomaly’s TotalImpact and TotalImpactPercentage, respectively (see Impact for more details). The supported nested expression types are AND and OR. The match option GREATER_THAN_OR_EQUAL is required. Values must be numbers between 0 and 10,000,000,000 in string format. One of Threshold or ThresholdExpression is required for this resource. You cannot specify both. The following are examples of valid ThresholdExpressions:   Absolute threshold: { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_ABSOLUTE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } }    Percentage threshold: { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_PERCENTAGE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } }     AND two thresholds together: { "And": [ { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_ABSOLUTE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } }, { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_PERCENTAGE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } } ] }     OR two thresholds together: { "Or": [ { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_ABSOLUTE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } }, { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_PERCENTAGE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } } ] }   
     */
    ThresholdExpression?: Expression;
  }
  export type AnomalySubscriptionFrequency = "DAILY"|"IMMEDIATE"|"WEEKLY"|string;
  export type AnomalySubscriptions = AnomalySubscription[];
  export type Arn = string;
  export type AttributeType = string;
  export type AttributeValue = string;
  export type Attributes = {[key: string]: AttributeValue};
  export type Context = "COST_AND_USAGE"|"RESERVATIONS"|"SAVINGS_PLANS"|string;
  export interface CostAllocationTag {
    /**
     * The key for the cost allocation tag. 
     */
    TagKey: TagKey;
    /**
     * The type of cost allocation tag. You can use AWSGenerated or UserDefined type tags. AWSGenerated type tags are tags that Amazon Web Services defines and applies to support Amazon Web Services resources for cost allocation purposes. UserDefined type tags are tags that you define, create, and apply to resources. 
     */
    Type: CostAllocationTagType;
    /**
     * The status of a cost allocation tag. 
     */
    Status: CostAllocationTagStatus;
    /**
     * The last date that the tag was either activated or deactivated.
     */
    LastUpdatedDate?: ZonedDateTime;
    /**
     * The last month that the tag was used on an Amazon Web Services resource.
     */
    LastUsedDate?: ZonedDateTime;
  }
  export type CostAllocationTagKeyList = TagKey[];
  export type CostAllocationTagList = CostAllocationTag[];
  export type CostAllocationTagStatus = "Active"|"Inactive"|string;
  export interface CostAllocationTagStatusEntry {
    /**
     * The key for the cost allocation tag. 
     */
    TagKey: TagKey;
    /**
     * The status of a cost allocation tag. 
     */
    Status: CostAllocationTagStatus;
  }
  export type CostAllocationTagStatusList = CostAllocationTagStatusEntry[];
  export type CostAllocationTagType = "AWSGenerated"|"UserDefined"|string;
  export type CostAllocationTagsMaxResults = number;
  export interface CostCategory {
    /**
     * The unique identifier for your Cost Category. 
     */
    CostCategoryArn: Arn;
    /**
     * The effective start date of your Cost Category.
     */
    EffectiveStart: ZonedDateTime;
    /**
     * The effective end date of your Cost Category.
     */
    EffectiveEnd?: ZonedDateTime;
    Name: CostCategoryName;
    RuleVersion: CostCategoryRuleVersion;
    /**
     * The rules are processed in order. If there are multiple rules that match the line item, then the first rule to match is used to determine that Cost Category value. 
     */
    Rules: CostCategoryRulesList;
    /**
     *  The split charge rules that are used to allocate your charges between your Cost Category values. 
     */
    SplitChargeRules?: CostCategorySplitChargeRulesList;
    /**
     * The list of processing statuses for Cost Management products for a specific cost category. 
     */
    ProcessingStatus?: CostCategoryProcessingStatusList;
    DefaultValue?: CostCategoryValue;
  }
  export interface CostCategoryInheritedValueDimension {
    /**
     * The name of the dimension that's used to group costs. If you specify LINKED_ACCOUNT_NAME, the cost category value is based on account name. If you specify TAG, the cost category value is based on the value of the specified tag key.
     */
    DimensionName?: CostCategoryInheritedValueDimensionName;
    /**
     * The key to extract cost category values.
     */
    DimensionKey?: GenericString;
  }
  export type CostCategoryInheritedValueDimensionName = "LINKED_ACCOUNT_NAME"|"TAG"|string;
  export type CostCategoryMaxResults = number;
  export type CostCategoryName = string;
  export type CostCategoryNamesList = CostCategoryName[];
  export interface CostCategoryProcessingStatus {
    /**
     * The Cost Management product name of the applied status. 
     */
    Component?: CostCategoryStatusComponent;
    /**
     * The process status for a specific cost category. 
     */
    Status?: CostCategoryStatus;
  }
  export type CostCategoryProcessingStatusList = CostCategoryProcessingStatus[];
  export interface CostCategoryReference {
    /**
     * The unique identifier for your Cost Category. 
     */
    CostCategoryArn?: Arn;
    Name?: CostCategoryName;
    /**
     * The Cost Category's effective start date.
     */
    EffectiveStart?: ZonedDateTime;
    /**
     * The Cost Category's effective end date.
     */
    EffectiveEnd?: ZonedDateTime;
    /**
     * The number of rules that are associated with a specific Cost Category. 
     */
    NumberOfRules?: NonNegativeInteger;
    /**
     * The list of processing statuses for Cost Management products for a specific cost category. 
     */
    ProcessingStatus?: CostCategoryProcessingStatusList;
    /**
     * A list of unique cost category values in a specific cost category. 
     */
    Values?: CostCategoryValuesList;
    DefaultValue?: CostCategoryValue;
  }
  export type CostCategoryReferencesList = CostCategoryReference[];
  export interface CostCategoryRule {
    Value?: CostCategoryValue;
    /**
     * An Expression object used to categorize costs. This supports dimensions, tags, and nested expressions. Currently the only dimensions supported are LINKED_ACCOUNT, SERVICE_CODE, RECORD_TYPE, LINKED_ACCOUNT_NAME, REGION, and USAGE_TYPE.  RECORD_TYPE is a dimension used for Cost Explorer APIs, and is also supported for Cost Category expressions. This dimension uses different terms, depending on whether you're using the console or API/JSON editor. For a detailed comparison, see Term Comparisons in the Billing and Cost Management User Guide.
     */
    Rule?: Expression;
    /**
     * The value the line item is categorized as if the line item contains the matched dimension.
     */
    InheritedValue?: CostCategoryInheritedValueDimension;
    /**
     * You can define the CostCategoryRule rule type as either REGULAR or INHERITED_VALUE. The INHERITED_VALUE rule type adds the flexibility to define a rule that dynamically inherits the cost category value. This value is from the dimension value that's defined by CostCategoryInheritedValueDimension. For example, suppose that you want to costs to be dynamically grouped based on the value of a specific tag key. First, choose an inherited value rule type, and then choose the tag dimension and specify the tag key to use.
     */
    Type?: CostCategoryRuleType;
  }
  export type CostCategoryRuleType = "REGULAR"|"INHERITED_VALUE"|string;
  export type CostCategoryRuleVersion = "CostCategoryExpression.v1"|string;
  export type CostCategoryRulesList = CostCategoryRule[];
  export type CostCategorySplitChargeMethod = "FIXED"|"PROPORTIONAL"|"EVEN"|string;
  export interface CostCategorySplitChargeRule {
    /**
     * The Cost Category value that you want to split. That value can't be used as a source or a target in other split charge rules. To indicate uncategorized costs, you can use an empty string as the source.
     */
    Source: GenericString;
    /**
     * The Cost Category values that you want to split costs across. These values can't be used as a source in other split charge rules. 
     */
    Targets: CostCategorySplitChargeRuleTargetsList;
    /**
     * The method that's used to define how to split your source costs across your targets.   Proportional - Allocates charges across your targets based on the proportional weighted cost of each target.  Fixed - Allocates charges across your targets based on your defined allocation percentage. &gt;Even - Allocates costs evenly across all targets.
     */
    Method: CostCategorySplitChargeMethod;
    /**
     * The parameters for a split charge method. This is only required for the FIXED method. 
     */
    Parameters?: CostCategorySplitChargeRuleParametersList;
  }
  export interface CostCategorySplitChargeRuleParameter {
    /**
     * The parameter type. 
     */
    Type: CostCategorySplitChargeRuleParameterType;
    /**
     * The parameter values. 
     */
    Values: CostCategorySplitChargeRuleParameterValuesList;
  }
  export type CostCategorySplitChargeRuleParameterType = "ALLOCATION_PERCENTAGES"|string;
  export type CostCategorySplitChargeRuleParameterValuesList = GenericString[];
  export type CostCategorySplitChargeRuleParametersList = CostCategorySplitChargeRuleParameter[];
  export type CostCategorySplitChargeRuleTargetsList = GenericString[];
  export type CostCategorySplitChargeRulesList = CostCategorySplitChargeRule[];
  export type CostCategoryStatus = "PROCESSING"|"APPLIED"|string;
  export type CostCategoryStatusComponent = "COST_EXPLORER"|string;
  export type CostCategoryValue = string;
  export interface CostCategoryValues {
    Key?: CostCategoryName;
    /**
     * The specific value of the Cost Category.
     */
    Values?: Values;
    /**
     * The match options that you can use to filter your results. MatchOptions is only applicable for actions related to cost category. The default values for MatchOptions is EQUALS and CASE_SENSITIVE. 
     */
    MatchOptions?: MatchOptions;
  }
  export type CostCategoryValuesList = CostCategoryValue[];
  export interface Coverage {
    /**
     * The amount of instance usage that the reservation covered, in hours.
     */
    CoverageHours?: CoverageHours;
    /**
     * The amount of instance usage that the reservation covered, in normalized units.
     */
    CoverageNormalizedUnits?: CoverageNormalizedUnits;
    /**
     * The amount of cost that the reservation covered.
     */
    CoverageCost?: CoverageCost;
  }
  export interface CoverageByTime {
    /**
     * The period that this coverage was used over.
     */
    TimePeriod?: DateInterval;
    /**
     * The groups of instances that the reservation covered.
     */
    Groups?: ReservationCoverageGroups;
    /**
     * The total reservation coverage, in hours.
     */
    Total?: Coverage;
  }
  export interface CoverageCost {
    /**
     * How much an On-Demand Instance costs.
     */
    OnDemandCost?: OnDemandCost;
  }
  export interface CoverageHours {
    /**
     * The number of instance running hours that On-Demand Instances covered.
     */
    OnDemandHours?: OnDemandHours;
    /**
     * The number of instance running hours that reservations covered.
     */
    ReservedHours?: ReservedHours;
    /**
     * The total instance usage, in hours.
     */
    TotalRunningHours?: TotalRunningHours;
    /**
     * The percentage of instance hours that a reservation covered.
     */
    CoverageHoursPercentage?: CoverageHoursPercentage;
  }
  export type CoverageHoursPercentage = string;
  export interface CoverageNormalizedUnits {
    /**
     * The number of normalized units that are covered by On-Demand Instances instead of a reservation.
     */
    OnDemandNormalizedUnits?: OnDemandNormalizedUnits;
    /**
     * The number of normalized units that a reservation covers.
     */
    ReservedNormalizedUnits?: ReservedNormalizedUnits;
    /**
     * The total number of normalized units that you used.
     */
    TotalRunningNormalizedUnits?: TotalRunningNormalizedUnits;
    /**
     * The percentage of your used instance normalized units that a reservation covers.
     */
    CoverageNormalizedUnitsPercentage?: CoverageNormalizedUnitsPercentage;
  }
  export type CoverageNormalizedUnitsPercentage = string;
  export type CoveragesByTime = CoverageByTime[];
  export interface CreateAnomalyMonitorRequest {
    /**
     * The cost anomaly detection monitor object that you want to create.
     */
    AnomalyMonitor: AnomalyMonitor;
    /**
     * An optional list of tags to associate with the specified  AnomalyMonitor . You can use resource tags to control access to your monitor using IAM policies. Each tag consists of a key and a value, and each key must be unique for the resource. The following restrictions apply to resource tags:   Although the maximum number of array members is 200, you can assign a maximum of 50 user-tags to one resource. The remaining are reserved for Amazon Web Services use   The maximum length of a key is 128 characters   The maximum length of a value is 256 characters   Keys and values can only contain alphanumeric characters, spaces, and any of the following: _.:/=+@-    Keys and values are case sensitive   Keys and values are trimmed for any leading or trailing whitespaces   Don’t use aws: as a prefix for your keys. This prefix is reserved for Amazon Web Services use  
     */
    ResourceTags?: ResourceTagList;
  }
  export interface CreateAnomalyMonitorResponse {
    /**
     * The unique identifier of your newly created cost anomaly detection monitor.
     */
    MonitorArn: GenericString;
  }
  export interface CreateAnomalySubscriptionRequest {
    /**
     * The cost anomaly subscription object that you want to create. 
     */
    AnomalySubscription: AnomalySubscription;
    /**
     * An optional list of tags to associate with the specified  AnomalySubscription . You can use resource tags to control access to your subscription using IAM policies. Each tag consists of a key and a value, and each key must be unique for the resource. The following restrictions apply to resource tags:   Although the maximum number of array members is 200, you can assign a maximum of 50 user-tags to one resource. The remaining are reserved for Amazon Web Services use   The maximum length of a key is 128 characters   The maximum length of a value is 256 characters   Keys and values can only contain alphanumeric characters, spaces, and any of the following: _.:/=+@-    Keys and values are case sensitive   Keys and values are trimmed for any leading or trailing whitespaces   Don’t use aws: as a prefix for your keys. This prefix is reserved for Amazon Web Services use  
     */
    ResourceTags?: ResourceTagList;
  }
  export interface CreateAnomalySubscriptionResponse {
    /**
     * The unique identifier of your newly created cost anomaly subscription. 
     */
    SubscriptionArn: GenericString;
  }
  export interface CreateCostCategoryDefinitionRequest {
    Name: CostCategoryName;
    /**
     * The Cost Category's effective start date. It can only be a billing start date (first day of the month). If the date isn't provided, it's the first day of the current month. Dates can't be before the previous twelve months, or in the future.
     */
    EffectiveStart?: ZonedDateTime;
    RuleVersion: CostCategoryRuleVersion;
    /**
     * The Cost Category rules used to categorize costs. For more information, see CostCategoryRule.
     */
    Rules: CostCategoryRulesList;
    DefaultValue?: CostCategoryValue;
    /**
     *  The split charge rules used to allocate your charges between your Cost Category values. 
     */
    SplitChargeRules?: CostCategorySplitChargeRulesList;
    /**
     * An optional list of tags to associate with the specified  CostCategory . You can use resource tags to control access to your cost category using IAM policies. Each tag consists of a key and a value, and each key must be unique for the resource. The following restrictions apply to resource tags:   Although the maximum number of array members is 200, you can assign a maximum of 50 user-tags to one resource. The remaining are reserved for Amazon Web Services use   The maximum length of a key is 128 characters   The maximum length of a value is 256 characters   Keys and values can only contain alphanumeric characters, spaces, and any of the following: _.:/=+@-    Keys and values are case sensitive   Keys and values are trimmed for any leading or trailing whitespaces   Don’t use aws: as a prefix for your keys. This prefix is reserved for Amazon Web Services use  
     */
    ResourceTags?: ResourceTagList;
  }
  export interface CreateCostCategoryDefinitionResponse {
    /**
     * The unique identifier for your newly created Cost Category. 
     */
    CostCategoryArn?: Arn;
    /**
     * The Cost Category's effective start date. It can only be a billing start date (first day of the month).
     */
    EffectiveStart?: ZonedDateTime;
  }
  export interface CurrentInstance {
    /**
     * Resource ID of the current instance.
     */
    ResourceId?: GenericString;
    /**
     * The name that you given an instance. This field shows as blank if you haven't given the instance a name.
     */
    InstanceName?: GenericString;
    /**
     * Cost allocation resource tags that are applied to the instance.
     */
    Tags?: TagValuesList;
    /**
     * Details about the resource and utilization.
     */
    ResourceDetails?: ResourceDetails;
    /**
     * Utilization information of the current instance during the lookback period.
     */
    ResourceUtilization?: ResourceUtilization;
    /**
     * The number of hours during the lookback period that's covered by reservations.
     */
    ReservationCoveredHoursInLookbackPeriod?: GenericString;
    /**
     * The number of hours during the lookback period that's covered by Savings Plans.
     */
    SavingsPlansCoveredHoursInLookbackPeriod?: GenericString;
    /**
     * The number of hours during the lookback period that's billed at On-Demand rates.
     */
    OnDemandHoursInLookbackPeriod?: GenericString;
    /**
     * The total number of hours that the instance ran during the lookback period.
     */
    TotalRunningHoursInLookbackPeriod?: GenericString;
    /**
     * The current On-Demand cost of operating this instance on a monthly basis.
     */
    MonthlyCost?: GenericString;
    /**
     * The currency code that Amazon Web Services used to calculate the costs for this instance.
     */
    CurrencyCode?: GenericString;
  }
  export interface DateInterval {
    /**
     * The beginning of the time period. The start date is inclusive. For example, if start is 2017-01-01, Amazon Web Services retrieves cost and usage data starting at 2017-01-01 up to the end date. The start date must be equal to or no later than the current date to avoid a validation error.
     */
    Start: YearMonthDay;
    /**
     * The end of the time period. The end date is exclusive. For example, if end is 2017-05-01, Amazon Web Services retrieves cost and usage data from the start date up to, but not including, 2017-05-01.
     */
    End: YearMonthDay;
  }
  export interface DeleteAnomalyMonitorRequest {
    /**
     * The unique identifier of the cost anomaly monitor that you want to delete. 
     */
    MonitorArn: GenericString;
  }
  export interface DeleteAnomalyMonitorResponse {
  }
  export interface DeleteAnomalySubscriptionRequest {
    /**
     * The unique identifier of the cost anomaly subscription that you want to delete. 
     */
    SubscriptionArn: GenericString;
  }
  export interface DeleteAnomalySubscriptionResponse {
  }
  export interface DeleteCostCategoryDefinitionRequest {
    /**
     * The unique identifier for your Cost Category. 
     */
    CostCategoryArn: Arn;
  }
  export interface DeleteCostCategoryDefinitionResponse {
    /**
     * The unique identifier for your Cost Category. 
     */
    CostCategoryArn?: Arn;
    /**
     * The effective end date of the Cost Category as a result of deleting it. No costs after this date is categorized by the deleted Cost Category. 
     */
    EffectiveEnd?: ZonedDateTime;
  }
  export interface DescribeCostCategoryDefinitionRequest {
    /**
     * The unique identifier for your Cost Category. 
     */
    CostCategoryArn: Arn;
    /**
     * The date when the Cost Category was effective. 
     */
    EffectiveOn?: ZonedDateTime;
  }
  export interface DescribeCostCategoryDefinitionResponse {
    CostCategory?: CostCategory;
  }
  export type Dimension = "AZ"|"INSTANCE_TYPE"|"LINKED_ACCOUNT"|"LINKED_ACCOUNT_NAME"|"OPERATION"|"PURCHASE_TYPE"|"REGION"|"SERVICE"|"SERVICE_CODE"|"USAGE_TYPE"|"USAGE_TYPE_GROUP"|"RECORD_TYPE"|"OPERATING_SYSTEM"|"TENANCY"|"SCOPE"|"PLATFORM"|"SUBSCRIPTION_ID"|"LEGAL_ENTITY_NAME"|"DEPLOYMENT_OPTION"|"DATABASE_ENGINE"|"CACHE_ENGINE"|"INSTANCE_TYPE_FAMILY"|"BILLING_ENTITY"|"RESERVATION_ID"|"RESOURCE_ID"|"RIGHTSIZING_TYPE"|"SAVINGS_PLANS_TYPE"|"SAVINGS_PLAN_ARN"|"PAYMENT_OPTION"|"AGREEMENT_END_DATE_TIME_AFTER"|"AGREEMENT_END_DATE_TIME_BEFORE"|"INVOICING_ENTITY"|"ANOMALY_TOTAL_IMPACT_ABSOLUTE"|"ANOMALY_TOTAL_IMPACT_PERCENTAGE"|string;
  export interface DimensionValues {
    /**
     * The names of the metadata types that you can use to filter and group your results. For example, AZ returns a list of Availability Zones. Not all dimensions are supported in each API. Refer to the documentation for each specific API to see what is supported.  LINK_ACCOUNT_NAME and SERVICE_CODE can only be used in CostCategoryRule.  ANOMALY_TOTAL_IMPACT_ABSOLUTE and ANOMALY_TOTAL_IMPACT_PERCENTAGE can only be used in AnomalySubscriptions.
     */
    Key?: Dimension;
    /**
     * The metadata values that you can use to filter and group your results. You can use GetDimensionValues to find specific values.
     */
    Values?: Values;
    /**
     * The match options that you can use to filter your results.  MatchOptions is only applicable for actions related to Cost Category and Anomaly Subscriptions. Refer to the documentation for each specific API to see what is supported. The default values for MatchOptions are EQUALS and CASE_SENSITIVE.
     */
    MatchOptions?: MatchOptions;
  }
  export interface DimensionValuesWithAttributes {
    /**
     * The value of a dimension with a specific attribute.
     */
    Value?: Value;
    /**
     * The attribute that applies to a specific Dimension.
     */
    Attributes?: Attributes;
  }
  export type DimensionValuesWithAttributesList = DimensionValuesWithAttributes[];
  export interface DiskResourceUtilization {
    /**
     * The maximum number of read operations per second. 
     */
    DiskReadOpsPerSecond?: GenericString;
    /**
     * The maximum number of write operations per second. 
     */
    DiskWriteOpsPerSecond?: GenericString;
    /**
     * The maximum read throughput operations per second. 
     */
    DiskReadBytesPerSecond?: GenericString;
    /**
     * The maximum write throughput operations per second. 
     */
    DiskWriteBytesPerSecond?: GenericString;
  }
  export interface EBSResourceUtilization {
    /**
     * The maximum number of read operations per second. 
     */
    EbsReadOpsPerSecond?: GenericString;
    /**
     * The maximum number of write operations per second. 
     */
    EbsWriteOpsPerSecond?: GenericString;
    /**
     * The maximum size of read operations per second 
     */
    EbsReadBytesPerSecond?: GenericString;
    /**
     * The maximum size of write operations per second. 
     */
    EbsWriteBytesPerSecond?: GenericString;
  }
  export interface EC2InstanceDetails {
    /**
     * The instance family of the recommended reservation.
     */
    Family?: GenericString;
    /**
     * The type of instance that Amazon Web Services recommends.
     */
    InstanceType?: GenericString;
    /**
     * The Amazon Web Services Region of the recommended reservation.
     */
    Region?: GenericString;
    /**
     * The Availability Zone of the recommended reservation.
     */
    AvailabilityZone?: GenericString;
    /**
     * The platform of the recommended reservation. The platform is the specific combination of operating system, license model, and software on an instance.
     */
    Platform?: GenericString;
    /**
     * Determines whether the recommended reservation is dedicated or shared.
     */
    Tenancy?: GenericString;
    /**
     * Determines whether the recommendation is for a current-generation instance. 
     */
    CurrentGeneration?: GenericBoolean;
    /**
     * Determines whether the recommended reservation is size flexible.
     */
    SizeFlexEligible?: GenericBoolean;
  }
  export interface EC2ResourceDetails {
    /**
     * The hourly public On-Demand rate for the instance type.
     */
    HourlyOnDemandRate?: GenericString;
    /**
     * The type of Amazon Web Services instance.
     */
    InstanceType?: GenericString;
    /**
     * The platform of the Amazon Web Services instance. The platform is the specific combination of operating system, license model, and software on an instance.
     */
    Platform?: GenericString;
    /**
     * The Amazon Web Services Region of the instance.
     */
    Region?: GenericString;
    /**
     * The SKU of the product.
     */
    Sku?: GenericString;
    /**
     * The memory capacity of the Amazon Web Services instance.
     */
    Memory?: GenericString;
    /**
     * The network performance capacity of the Amazon Web Services instance.
     */
    NetworkPerformance?: GenericString;
    /**
     * The disk storage of the Amazon Web Services instance. This doesn't include EBS storage.
     */
    Storage?: GenericString;
    /**
     * The number of VCPU cores in the Amazon Web Services instance type.
     */
    Vcpu?: GenericString;
  }
  export interface EC2ResourceUtilization {
    /**
     * The maximum observed or expected CPU utilization of the instance.
     */
    MaxCpuUtilizationPercentage?: GenericString;
    /**
     * The maximum observed or expected memory utilization of the instance.
     */
    MaxMemoryUtilizationPercentage?: GenericString;
    /**
     * The maximum observed or expected storage utilization of the instance. This doesn't include EBS storage.
     */
    MaxStorageUtilizationPercentage?: GenericString;
    /**
     * The EBS field that contains a list of EBS metrics that are associated with the current instance. 
     */
    EBSResourceUtilization?: EBSResourceUtilization;
    /**
     * The field that contains a list of disk (local storage) metrics that are associated with the current instance. 
     */
    DiskResourceUtilization?: DiskResourceUtilization;
    /**
     * The network field that contains a list of network metrics that are associated with the current instance. 
     */
    NetworkResourceUtilization?: NetworkResourceUtilization;
  }
  export interface EC2Specification {
    /**
     * Indicates whether you want a recommendation for standard or convertible reservations.
     */
    OfferingClass?: OfferingClass;
  }
  export interface ESInstanceDetails {
    /**
     * The class of instance that Amazon Web Services recommends.
     */
    InstanceClass?: GenericString;
    /**
     * The size of instance that Amazon Web Services recommends.
     */
    InstanceSize?: GenericString;
    /**
     * The Amazon Web Services Region of the recommended reservation.
     */
    Region?: GenericString;
    /**
     * Determines whether the recommendation is for a current-generation instance.
     */
    CurrentGeneration?: GenericBoolean;
    /**
     * Determines whether the recommended reservation is size flexible.
     */
    SizeFlexEligible?: GenericBoolean;
  }
  export interface ElastiCacheInstanceDetails {
    /**
     * The instance family of the recommended reservation.
     */
    Family?: GenericString;
    /**
     * The type of node that Amazon Web Services recommends.
     */
    NodeType?: GenericString;
    /**
     * The Amazon Web Services Region of the recommended reservation.
     */
    Region?: GenericString;
    /**
     * The description of the recommended reservation.
     */
    ProductDescription?: GenericString;
    /**
     * Determines whether the recommendation is for a current generation instance.
     */
    CurrentGeneration?: GenericBoolean;
    /**
     * Determines whether the recommended reservation is size flexible.
     */
    SizeFlexEligible?: GenericBoolean;
  }
  export type Entity = string;
  export type ErrorMessage = string;
  export type Estimated = boolean;
  export interface Expression {
    /**
     * Return results that match either Dimension object.
     */
    Or?: Expressions;
    /**
     * Return results that match both Dimension objects.
     */
    And?: Expressions;
    /**
     * Return results that don't match a Dimension object.
     */
    Not?: Expression;
    /**
     * The specific Dimension to use for Expression.
     */
    Dimensions?: DimensionValues;
    /**
     * The specific Tag to use for Expression.
     */
    Tags?: TagValues;
    /**
     * The filter that's based on CostCategory values.
     */
    CostCategories?: CostCategoryValues;
  }
  export type Expressions = Expression[];
  export type FindingReasonCode = "CPU_OVER_PROVISIONED"|"CPU_UNDER_PROVISIONED"|"MEMORY_OVER_PROVISIONED"|"MEMORY_UNDER_PROVISIONED"|"EBS_THROUGHPUT_OVER_PROVISIONED"|"EBS_THROUGHPUT_UNDER_PROVISIONED"|"EBS_IOPS_OVER_PROVISIONED"|"EBS_IOPS_UNDER_PROVISIONED"|"NETWORK_BANDWIDTH_OVER_PROVISIONED"|"NETWORK_BANDWIDTH_UNDER_PROVISIONED"|"NETWORK_PPS_OVER_PROVISIONED"|"NETWORK_PPS_UNDER_PROVISIONED"|"DISK_IOPS_OVER_PROVISIONED"|"DISK_IOPS_UNDER_PROVISIONED"|"DISK_THROUGHPUT_OVER_PROVISIONED"|"DISK_THROUGHPUT_UNDER_PROVISIONED"|string;
  export type FindingReasonCodes = FindingReasonCode[];
  export interface ForecastResult {
    /**
     * The period of time that the forecast covers.
     */
    TimePeriod?: DateInterval;
    /**
     * The mean value of the forecast.
     */
    MeanValue?: GenericString;
    /**
     * The lower limit for the prediction interval. 
     */
    PredictionIntervalLowerBound?: GenericString;
    /**
     * The upper limit for the prediction interval. 
     */
    PredictionIntervalUpperBound?: GenericString;
  }
  export type ForecastResultsByTime = ForecastResult[];
  export type GenerationStatus = "SUCCEEDED"|"PROCESSING"|"FAILED"|string;
  export interface GenerationSummary {
    /**
     * Indicates the ID for this specific recommendation.
     */
    RecommendationId?: RecommendationId;
    /**
     * Indicates whether the recommendation generation succeeded, is processing, or failed.
     */
    GenerationStatus?: GenerationStatus;
    /**
     * Indicates the start time of the recommendation generation.
     */
    GenerationStartedTime?: ZonedDateTime;
    /**
     * Indicates the completion time of the recommendation generation.
     */
    GenerationCompletionTime?: ZonedDateTime;
    /**
     * Indicates the estimated time for when the recommendation generation will complete.
     */
    EstimatedCompletionTime?: ZonedDateTime;
  }
  export type GenerationSummaryList = GenerationSummary[];
  export type GenericBoolean = boolean;
  export type GenericDouble = number;
  export type GenericString = string;
  export interface GetAnomaliesRequest {
    /**
     * Retrieves all of the cost anomalies detected for a specific cost anomaly monitor Amazon Resource Name (ARN). 
     */
    MonitorArn?: GenericString;
    /**
     * Assigns the start and end dates for retrieving cost anomalies. The returned anomaly object will have an AnomalyEndDate in the specified time range. 
     */
    DateInterval: AnomalyDateInterval;
    /**
     * Filters anomaly results by the feedback field on the anomaly object. 
     */
    Feedback?: AnomalyFeedbackType;
    /**
     * Filters anomaly results by the total impact field on the anomaly object. For example, you can filter anomalies GREATER_THAN 200.00 to retrieve anomalies, with an estimated dollar impact greater than 200. 
     */
    TotalImpact?: TotalImpactFilter;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size. 
     */
    NextPageToken?: NextPageToken;
    /**
     * The number of entries a paginated response contains. 
     */
    MaxResults?: PageSize;
  }
  export interface GetAnomaliesResponse {
    /**
     * A list of cost anomalies. 
     */
    Anomalies: Anomalies;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size. 
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetAnomalyMonitorsRequest {
    /**
     * A list of cost anomaly monitor ARNs. 
     */
    MonitorArnList?: Values;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size. 
     */
    NextPageToken?: NextPageToken;
    /**
     * The number of entries that a paginated response contains. 
     */
    MaxResults?: PageSize;
  }
  export interface GetAnomalyMonitorsResponse {
    /**
     * A list of cost anomaly monitors that includes the detailed metadata for each monitor. 
     */
    AnomalyMonitors: AnomalyMonitors;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size. 
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetAnomalySubscriptionsRequest {
    /**
     * A list of cost anomaly subscription ARNs. 
     */
    SubscriptionArnList?: Values;
    /**
     * Cost anomaly monitor ARNs. 
     */
    MonitorArn?: GenericString;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size. 
     */
    NextPageToken?: NextPageToken;
    /**
     * The number of entries a paginated response contains. 
     */
    MaxResults?: PageSize;
  }
  export interface GetAnomalySubscriptionsResponse {
    /**
     * A list of cost anomaly subscriptions that includes the detailed metadata for each one. 
     */
    AnomalySubscriptions: AnomalySubscriptions;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size. 
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetCostAndUsageRequest {
    /**
     * Sets the start date and end date for retrieving Amazon Web Services costs. The start date is inclusive, but the end date is exclusive. For example, if start is 2017-01-01 and end is 2017-05-01, then the cost and usage data is retrieved from 2017-01-01 up to and including 2017-04-30 but not including 2017-05-01.
     */
    TimePeriod: DateInterval;
    /**
     * Sets the Amazon Web Services cost granularity to MONTHLY or DAILY, or HOURLY. If Granularity isn't set, the response object doesn't include the Granularity, either MONTHLY or DAILY, or HOURLY. 
     */
    Granularity: Granularity;
    /**
     * Filters Amazon Web Services costs by different dimensions. For example, you can specify SERVICE and LINKED_ACCOUNT and get the costs that are associated with that account's usage of that service. You can nest Expression objects to define any combination of dimension filters. For more information, see Expression.  Valid values for MatchOptions for Dimensions are EQUALS and CASE_SENSITIVE. Valid values for MatchOptions for CostCategories and Tags are EQUALS, ABSENT, and CASE_SENSITIVE. Default values are EQUALS and CASE_SENSITIVE.
     */
    Filter?: Expression;
    /**
     * Which metrics are returned in the query. For more information about blended and unblended rates, see Why does the "blended" annotation appear on some line items in my bill?.  Valid values are AmortizedCost, BlendedCost, NetAmortizedCost, NetUnblendedCost, NormalizedUsageAmount, UnblendedCost, and UsageQuantity.   If you return the UsageQuantity metric, the service aggregates all usage numbers without taking into account the units. For example, if you aggregate usageQuantity across all of Amazon EC2, the results aren't meaningful because Amazon EC2 compute hours and data transfer are measured in different units (for example, hours and GB). To get more meaningful UsageQuantity metrics, filter by UsageType or UsageTypeGroups.    Metrics is required for GetCostAndUsage requests.
     */
    Metrics: MetricNames;
    /**
     * You can group Amazon Web Services costs using up to two different groups, either dimensions, tag keys, cost categories, or any two group by types. Valid values for the DIMENSION type are AZ, INSTANCE_TYPE, LEGAL_ENTITY_NAME, INVOICING_ENTITY, LINKED_ACCOUNT, OPERATION, PLATFORM, PURCHASE_TYPE, SERVICE, TENANCY, RECORD_TYPE, and USAGE_TYPE. When you group by the TAG type and include a valid tag key, you get all tag values, including empty strings.
     */
    GroupBy?: GroupDefinitions;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetCostAndUsageResponse {
    /**
     * The token for the next set of retrievable results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
    /**
     * The groups that are specified by the Filter or GroupBy parameters in the request.
     */
    GroupDefinitions?: GroupDefinitions;
    /**
     * The time period that's covered by the results in the response.
     */
    ResultsByTime?: ResultsByTime;
    /**
     * The attributes that apply to a specific dimension value. For example, if the value is a linked account, the attribute is that account name.
     */
    DimensionValueAttributes?: DimensionValuesWithAttributesList;
  }
  export interface GetCostAndUsageWithResourcesRequest {
    /**
     * Sets the start and end dates for retrieving Amazon Web Services costs. The range must be within the last 14 days (the start date cannot be earlier than 14 days ago). The start date is inclusive, but the end date is exclusive. For example, if start is 2017-01-01 and end is 2017-05-01, then the cost and usage data is retrieved from 2017-01-01 up to and including 2017-04-30 but not including 2017-05-01.
     */
    TimePeriod: DateInterval;
    /**
     * Sets the Amazon Web Services cost granularity to MONTHLY, DAILY, or HOURLY. If Granularity isn't set, the response object doesn't include the Granularity, MONTHLY, DAILY, or HOURLY. 
     */
    Granularity: Granularity;
    /**
     * Filters Amazon Web Services costs by different dimensions. For example, you can specify SERVICE and LINKED_ACCOUNT and get the costs that are associated with that account's usage of that service. You can nest Expression objects to define any combination of dimension filters. For more information, see Expression.  The GetCostAndUsageWithResources operation requires that you either group by or filter by a ResourceId. It requires the Expression "SERVICE = Amazon Elastic Compute Cloud - Compute" in the filter. Valid values for MatchOptions for Dimensions are EQUALS and CASE_SENSITIVE. Valid values for MatchOptions for CostCategories and Tags are EQUALS, ABSENT, and CASE_SENSITIVE. Default values are EQUALS and CASE_SENSITIVE.
     */
    Filter: Expression;
    /**
     * Which metrics are returned in the query. For more information about blended and unblended rates, see Why does the "blended" annotation appear on some line items in my bill?.  Valid values are AmortizedCost, BlendedCost, NetAmortizedCost, NetUnblendedCost, NormalizedUsageAmount, UnblendedCost, and UsageQuantity.   If you return the UsageQuantity metric, the service aggregates all usage numbers without taking the units into account. For example, if you aggregate usageQuantity across all of Amazon EC2, the results aren't meaningful because Amazon EC2 compute hours and data transfer are measured in different units (for example, hour or GB). To get more meaningful UsageQuantity metrics, filter by UsageType or UsageTypeGroups.    Metrics is required for GetCostAndUsageWithResources requests.
     */
    Metrics?: MetricNames;
    /**
     * You can group Amazon Web Services costs using up to two different groups: DIMENSION, TAG, COST_CATEGORY.
     */
    GroupBy?: GroupDefinitions;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetCostAndUsageWithResourcesResponse {
    /**
     * The token for the next set of retrievable results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
    /**
     * The groups that are specified by the Filter or GroupBy parameters in the request.
     */
    GroupDefinitions?: GroupDefinitions;
    /**
     * The time period that's covered by the results in the response.
     */
    ResultsByTime?: ResultsByTime;
    /**
     * The attributes that apply to a specific dimension value. For example, if the value is a linked account, the attribute is that account name.
     */
    DimensionValueAttributes?: DimensionValuesWithAttributesList;
  }
  export interface GetCostCategoriesRequest {
    /**
     * The value that you want to search the filter values for. If you don't specify a CostCategoryName, SearchString is used to filter Cost Category names that match the SearchString pattern. If you specify a CostCategoryName, SearchString is used to filter Cost Category values that match the SearchString pattern.
     */
    SearchString?: SearchString;
    TimePeriod: DateInterval;
    CostCategoryName?: CostCategoryName;
    Filter?: Expression;
    /**
     * The value that you sort the data by. The key represents the cost and usage metrics. The following values are supported:    BlendedCost     UnblendedCost     AmortizedCost     NetAmortizedCost     NetUnblendedCost     UsageQuantity     NormalizedUsageAmount    The supported key values for the SortOrder value are ASCENDING and DESCENDING. When you use the SortBy value, the NextPageToken and SearchString key values aren't supported.
     */
    SortBy?: SortDefinitions;
    /**
     * This field is only used when the SortBy value is provided in the request. The maximum number of objects that are returned for this request. If MaxResults isn't specified with the SortBy value, the request returns 1000 results as the default value for this parameter. For GetCostCategories, MaxResults has an upper quota of 1000.
     */
    MaxResults?: MaxResults;
    /**
     * If the number of objects that are still available for retrieval exceeds the quota, Amazon Web Services returns a NextPageToken value in the response. To retrieve the next batch of objects, provide the NextPageToken from the previous call in your next request.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetCostCategoriesResponse {
    /**
     * If the number of objects that are still available for retrieval exceeds the quota, Amazon Web Services returns a NextPageToken value in the response. To retrieve the next batch of objects, provide the marker from the prior call in your next request.
     */
    NextPageToken?: NextPageToken;
    /**
     * The names of the Cost Categories.
     */
    CostCategoryNames?: CostCategoryNamesList;
    /**
     * The Cost Category values. If the CostCategoryName key isn't specified in the request, the CostCategoryValues fields aren't returned. 
     */
    CostCategoryValues?: CostCategoryValuesList;
    /**
     * The number of objects that are returned.
     */
    ReturnSize: PageSize;
    /**
     * The total number of objects.
     */
    TotalSize: PageSize;
  }
  export interface GetCostForecastRequest {
    /**
     * The period of time that you want the forecast to cover. The start date must be equal to or no later than the current date to avoid a validation error.
     */
    TimePeriod: DateInterval;
    /**
     * Which metric Cost Explorer uses to create your forecast. For more information about blended and unblended rates, see Why does the "blended" annotation appear on some line items in my bill?.  Valid values for a GetCostForecast call are the following:   AMORTIZED_COST   BLENDED_COST   NET_AMORTIZED_COST   NET_UNBLENDED_COST   UNBLENDED_COST  
     */
    Metric: Metric;
    /**
     * How granular you want the forecast to be. You can get 3 months of DAILY forecasts or 12 months of MONTHLY forecasts. The GetCostForecast operation supports only DAILY and MONTHLY granularities.
     */
    Granularity: Granularity;
    /**
     * The filters that you want to use to filter your forecast. The GetCostForecast API supports filtering by the following dimensions:    AZ     INSTANCE_TYPE     LINKED_ACCOUNT     LINKED_ACCOUNT_NAME     OPERATION     PURCHASE_TYPE     REGION     SERVICE     USAGE_TYPE     USAGE_TYPE_GROUP     RECORD_TYPE     OPERATING_SYSTEM     TENANCY     SCOPE     PLATFORM     SUBSCRIPTION_ID     LEGAL_ENTITY_NAME     DEPLOYMENT_OPTION     DATABASE_ENGINE     INSTANCE_TYPE_FAMILY     BILLING_ENTITY     RESERVATION_ID     SAVINGS_PLAN_ARN   
     */
    Filter?: Expression;
    /**
     * Cost Explorer always returns the mean forecast as a single point. You can request a prediction interval around the mean by specifying a confidence level. The higher the confidence level, the more confident Cost Explorer is about the actual value falling in the prediction interval. Higher confidence levels result in wider prediction intervals.
     */
    PredictionIntervalLevel?: PredictionIntervalLevel;
  }
  export interface GetCostForecastResponse {
    /**
     * How much you are forecasted to spend over the forecast period, in USD.
     */
    Total?: MetricValue;
    /**
     * The forecasts for your query, in order. For DAILY forecasts, this is a list of days. For MONTHLY forecasts, this is a list of months.
     */
    ForecastResultsByTime?: ForecastResultsByTime;
  }
  export interface GetDimensionValuesRequest {
    /**
     * The value that you want to search the filter values for.
     */
    SearchString?: SearchString;
    /**
     * The start date and end date for retrieving the dimension values. The start date is inclusive, but the end date is exclusive. For example, if start is 2017-01-01 and end is 2017-05-01, then the cost and usage data is retrieved from 2017-01-01 up to and including 2017-04-30 but not including 2017-05-01.
     */
    TimePeriod: DateInterval;
    /**
     * The name of the dimension. Each Dimension is available for a different Context. For more information, see Context. LINK_ACCOUNT_NAME and SERVICE_CODE can only be used in CostCategoryRule. 
     */
    Dimension: Dimension;
    /**
     * The context for the call to GetDimensionValues. This can be RESERVATIONS or COST_AND_USAGE. The default value is COST_AND_USAGE. If the context is set to RESERVATIONS, the resulting dimension values can be used in the GetReservationUtilization operation. If the context is set to COST_AND_USAGE, the resulting dimension values can be used in the GetCostAndUsage operation. If you set the context to COST_AND_USAGE, you can use the following dimensions for searching:   AZ - The Availability Zone. An example is us-east-1a.   BILLING_ENTITY - The Amazon Web Services seller that your account is with. Possible values are the following: - Amazon Web Services(Amazon Web Services): The entity that sells Amazon Web Services. - AISPL (Amazon Internet Services Pvt. Ltd.): The local Indian entity that's an acting reseller for Amazon Web Services in India. - Amazon Web Services Marketplace: The entity that supports the sale of solutions that are built on Amazon Web Services by third-party software providers.   CACHE_ENGINE - The Amazon ElastiCache operating system. Examples are Windows or Linux.   DEPLOYMENT_OPTION - The scope of Amazon Relational Database Service deployments. Valid values are SingleAZ and MultiAZ.   DATABASE_ENGINE - The Amazon Relational Database Service database. Examples are Aurora or MySQL.   INSTANCE_TYPE - The type of Amazon EC2 instance. An example is m4.xlarge.   INSTANCE_TYPE_FAMILY - A family of instance types optimized to fit different use cases. Examples are Compute Optimized (for example, C4, C5, C6g, and C7g), Memory Optimization (for example, R4, R5n, R5b, and R6g).   INVOICING_ENTITY - The name of the entity that issues the Amazon Web Services invoice.   LEGAL_ENTITY_NAME - The name of the organization that sells you Amazon Web Services services, such as Amazon Web Services.   LINKED_ACCOUNT - The description in the attribute map that includes the full name of the member account. The value field contains the Amazon Web Services ID of the member account.   OPERATING_SYSTEM - The operating system. Examples are Windows or Linux.   OPERATION - The action performed. Examples include RunInstance and CreateBucket.   PLATFORM - The Amazon EC2 operating system. Examples are Windows or Linux.   PURCHASE_TYPE - The reservation type of the purchase that this usage is related to. Examples include On-Demand Instances and Standard Reserved Instances.   RESERVATION_ID - The unique identifier for an Amazon Web Services Reservation Instance.   SAVINGS_PLAN_ARN - The unique identifier for your Savings Plans.   SAVINGS_PLANS_TYPE - Type of Savings Plans (EC2 Instance or Compute).   SERVICE - The Amazon Web Services service such as Amazon DynamoDB.   TENANCY - The tenancy of a resource. Examples are shared or dedicated.   USAGE_TYPE - The type of usage. An example is DataTransfer-In-Bytes. The response for the GetDimensionValues operation includes a unit attribute. Examples include GB and Hrs.   USAGE_TYPE_GROUP - The grouping of common usage types. An example is Amazon EC2: CloudWatch – Alarms. The response for this operation includes a unit attribute.   REGION - The Amazon Web Services Region.   RECORD_TYPE - The different types of charges such as Reserved Instance (RI) fees, usage costs, tax refunds, and credits.   RESOURCE_ID - The unique identifier of the resource. ResourceId is an opt-in feature only available for last 14 days for EC2-Compute Service.   If you set the context to RESERVATIONS, you can use the following dimensions for searching:   AZ - The Availability Zone. An example is us-east-1a.   CACHE_ENGINE - The Amazon ElastiCache operating system. Examples are Windows or Linux.   DEPLOYMENT_OPTION - The scope of Amazon Relational Database Service deployments. Valid values are SingleAZ and MultiAZ.   INSTANCE_TYPE - The type of Amazon EC2 instance. An example is m4.xlarge.   LINKED_ACCOUNT - The description in the attribute map that includes the full name of the member account. The value field contains the Amazon Web Services ID of the member account.   PLATFORM - The Amazon EC2 operating system. Examples are Windows or Linux.   REGION - The Amazon Web Services Region.   SCOPE (Utilization only) - The scope of a Reserved Instance (RI). Values are regional or a single Availability Zone.   TAG (Coverage only) - The tags that are associated with a Reserved Instance (RI).   TENANCY - The tenancy of a resource. Examples are shared or dedicated.   If you set the context to SAVINGS_PLANS, you can use the following dimensions for searching:   SAVINGS_PLANS_TYPE - Type of Savings Plans (EC2 Instance or Compute)   PAYMENT_OPTION - The payment option for the given Savings Plans (for example, All Upfront)   REGION - The Amazon Web Services Region.   INSTANCE_TYPE_FAMILY - The family of instances (For example, m5)   LINKED_ACCOUNT - The description in the attribute map that includes the full name of the member account. The value field contains the Amazon Web Services ID of the member account.   SAVINGS_PLAN_ARN - The unique identifier for your Savings Plans.  
     */
    Context?: Context;
    Filter?: Expression;
    /**
     * The value that you want to sort the data by. The key represents cost and usage metrics. The following values are supported:    BlendedCost     UnblendedCost     AmortizedCost     NetAmortizedCost     NetUnblendedCost     UsageQuantity     NormalizedUsageAmount    The supported values for the SortOrder key are ASCENDING or DESCENDING. When you specify a SortBy paramater, the context must be COST_AND_USAGE. Further, when using SortBy, NextPageToken and SearchString aren't supported.
     */
    SortBy?: SortDefinitions;
    /**
     * This field is only used when SortBy is provided in the request. The maximum number of objects that are returned for this request. If MaxResults isn't specified with SortBy, the request returns 1000 results as the default value for this parameter. For GetDimensionValues, MaxResults has an upper limit of 1000.
     */
    MaxResults?: MaxResults;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetDimensionValuesResponse {
    /**
     * The filters that you used to filter your request. Some dimensions are available only for a specific context. If you set the context to COST_AND_USAGE, you can use the following dimensions for searching:   AZ - The Availability Zone. An example is us-east-1a.   DATABASE_ENGINE - The Amazon Relational Database Service database. Examples are Aurora or MySQL.   INSTANCE_TYPE - The type of Amazon EC2 instance. An example is m4.xlarge.   LEGAL_ENTITY_NAME - The name of the organization that sells you Amazon Web Services services, such as Amazon Web Services.   LINKED_ACCOUNT - The description in the attribute map that includes the full name of the member account. The value field contains the Amazon Web Services ID of the member account.   OPERATING_SYSTEM - The operating system. Examples are Windows or Linux.   OPERATION - The action performed. Examples include RunInstance and CreateBucket.   PLATFORM - The Amazon EC2 operating system. Examples are Windows or Linux.   PURCHASE_TYPE - The reservation type of the purchase to which this usage is related. Examples include On-Demand Instances and Standard Reserved Instances.   SERVICE - The Amazon Web Services service such as Amazon DynamoDB.   USAGE_TYPE - The type of usage. An example is DataTransfer-In-Bytes. The response for the GetDimensionValues operation includes a unit attribute. Examples include GB and Hrs.   USAGE_TYPE_GROUP - The grouping of common usage types. An example is Amazon EC2: CloudWatch – Alarms. The response for this operation includes a unit attribute.   RECORD_TYPE - The different types of charges such as RI fees, usage costs, tax refunds, and credits.   RESOURCE_ID - The unique identifier of the resource. ResourceId is an opt-in feature only available for last 14 days for EC2-Compute Service. You can opt-in by enabling Hourly and Resource Level Data in Cost Management Console preferences.   If you set the context to RESERVATIONS, you can use the following dimensions for searching:   AZ - The Availability Zone. An example is us-east-1a.   CACHE_ENGINE - The Amazon ElastiCache operating system. Examples are Windows or Linux.   DEPLOYMENT_OPTION - The scope of Amazon Relational Database Service deployments. Valid values are SingleAZ and MultiAZ.   INSTANCE_TYPE - The type of Amazon EC2 instance. An example is m4.xlarge.   LINKED_ACCOUNT - The description in the attribute map that includes the full name of the member account. The value field contains the Amazon Web Services ID of the member account.   PLATFORM - The Amazon EC2 operating system. Examples are Windows or Linux.   REGION - The Amazon Web Services Region.   SCOPE (Utilization only) - The scope of a Reserved Instance (RI). Values are regional or a single Availability Zone.   TAG (Coverage only) - The tags that are associated with a Reserved Instance (RI).   TENANCY - The tenancy of a resource. Examples are shared or dedicated.   If you set the context to SAVINGS_PLANS, you can use the following dimensions for searching:   SAVINGS_PLANS_TYPE - Type of Savings Plans (EC2 Instance or Compute)   PAYMENT_OPTION - Payment option for the given Savings Plans (for example, All Upfront)   REGION - The Amazon Web Services Region.   INSTANCE_TYPE_FAMILY - The family of instances (For example, m5)   LINKED_ACCOUNT - The description in the attribute map that includes the full name of the member account. The value field contains the Amazon Web Services ID of the member account.   SAVINGS_PLAN_ARN - The unique identifier for your Savings Plan  
     */
    DimensionValues: DimensionValuesWithAttributesList;
    /**
     * The number of results that Amazon Web Services returned at one time.
     */
    ReturnSize: PageSize;
    /**
     * The total number of search results.
     */
    TotalSize: PageSize;
    /**
     * The token for the next set of retrievable results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetReservationCoverageRequest {
    /**
     * The start and end dates of the period that you want to retrieve data about reservation coverage for. You can retrieve data for a maximum of 13 months: the last 12 months and the current month. The start date is inclusive, but the end date is exclusive. For example, if start is 2017-01-01 and end is 2017-05-01, then the cost and usage data is retrieved from 2017-01-01 up to and including 2017-04-30 but not including 2017-05-01. 
     */
    TimePeriod: DateInterval;
    /**
     * You can group the data by the following attributes:   AZ   CACHE_ENGINE   DATABASE_ENGINE   DEPLOYMENT_OPTION   INSTANCE_TYPE   INVOICING_ENTITY   LINKED_ACCOUNT   OPERATING_SYSTEM   PLATFORM   REGION   TENANCY  
     */
    GroupBy?: GroupDefinitions;
    /**
     * The granularity of the Amazon Web Services cost data for the reservation. Valid values are MONTHLY and DAILY. If GroupBy is set, Granularity can't be set. If Granularity isn't set, the response object doesn't include Granularity, either MONTHLY or DAILY. The GetReservationCoverage operation supports only DAILY and MONTHLY granularities.
     */
    Granularity?: Granularity;
    /**
     * Filters utilization data by dimensions. You can filter by the following dimensions:   AZ   CACHE_ENGINE   DATABASE_ENGINE   DEPLOYMENT_OPTION   INSTANCE_TYPE   LINKED_ACCOUNT   OPERATING_SYSTEM   PLATFORM   REGION   SERVICE   TAG   TENANCY    GetReservationCoverage uses the same Expression object as the other operations, but only AND is supported among each dimension. You can nest only one level deep. If there are multiple values for a dimension, they are OR'd together. If you don't provide a SERVICE filter, Cost Explorer defaults to EC2. Cost category is also supported.
     */
    Filter?: Expression;
    /**
     * The measurement that you want your reservation coverage reported in. Valid values are Hour, Unit, and Cost. You can use multiple values in a request.
     */
    Metrics?: MetricNames;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
    /**
     * The value by which you want to sort the data. The following values are supported for Key:    OnDemandCost     CoverageHoursPercentage     OnDemandHours     ReservedHours     TotalRunningHours     CoverageNormalizedUnitsPercentage     OnDemandNormalizedUnits     ReservedNormalizedUnits     TotalRunningNormalizedUnits     Time    Supported values for SortOrder are ASCENDING or DESCENDING.
     */
    SortBy?: SortDefinition;
    /**
     * The maximum number of objects that you returned for this request. If more objects are available, in the response, Amazon Web Services provides a NextPageToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: MaxResults;
  }
  export interface GetReservationCoverageResponse {
    /**
     * The amount of time that your reservations covered.
     */
    CoveragesByTime: CoveragesByTime;
    /**
     * The total amount of instance usage that a reservation covered.
     */
    Total?: Coverage;
    /**
     * The token for the next set of retrievable results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetReservationPurchaseRecommendationRequest {
    /**
     * The account ID that's associated with the recommendation. 
     */
    AccountId?: GenericString;
    /**
     * The specific service that you want recommendations for.
     */
    Service: GenericString;
    Filter?: Expression;
    /**
     * The account scope that you want your recommendations for. Amazon Web Services calculates recommendations including the management account and member accounts if the value is set to PAYER. If the value is LINKED, recommendations are calculated for individual member accounts only.
     */
    AccountScope?: AccountScope;
    /**
     * The number of previous days that you want Amazon Web Services to consider when it calculates your recommendations.
     */
    LookbackPeriodInDays?: LookbackPeriodInDays;
    /**
     * The reservation term that you want recommendations for.
     */
    TermInYears?: TermInYears;
    /**
     * The reservation purchase option that you want recommendations for.
     */
    PaymentOption?: PaymentOption;
    /**
     * The hardware specifications for the service instances that you want recommendations for, such as standard or convertible Amazon EC2 instances.
     */
    ServiceSpecification?: ServiceSpecification;
    /**
     * The number of recommendations that you want returned in a single response object.
     */
    PageSize?: NonNegativeInteger;
    /**
     * The pagination token that indicates the next set of results that you want to retrieve.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetReservationPurchaseRecommendationResponse {
    /**
     * Information about this specific recommendation call, such as the time stamp for when Cost Explorer generated this recommendation.
     */
    Metadata?: ReservationPurchaseRecommendationMetadata;
    /**
     * Recommendations for reservations to purchase.
     */
    Recommendations?: ReservationPurchaseRecommendations;
    /**
     * The pagination token for the next set of retrievable results.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetReservationUtilizationRequest {
    /**
     * Sets the start and end dates for retrieving Reserved Instance (RI) utilization. The start date is inclusive, but the end date is exclusive. For example, if start is 2017-01-01 and end is 2017-05-01, then the cost and usage data is retrieved from 2017-01-01 up to and including 2017-04-30 but not including 2017-05-01. 
     */
    TimePeriod: DateInterval;
    /**
     * Groups only by SUBSCRIPTION_ID. Metadata is included.
     */
    GroupBy?: GroupDefinitions;
    /**
     * If GroupBy is set, Granularity can't be set. If Granularity isn't set, the response object doesn't include Granularity, either MONTHLY or DAILY. If both GroupBy and Granularity aren't set, GetReservationUtilization defaults to DAILY. The GetReservationUtilization operation supports only DAILY and MONTHLY granularities.
     */
    Granularity?: Granularity;
    /**
     * Filters utilization data by dimensions. You can filter by the following dimensions:   AZ   CACHE_ENGINE   DEPLOYMENT_OPTION   INSTANCE_TYPE   LINKED_ACCOUNT   OPERATING_SYSTEM   PLATFORM   REGION   SERVICE   SCOPE   TENANCY    GetReservationUtilization uses the same Expression object as the other operations, but only AND is supported among each dimension, and nesting is supported up to only one level deep. If there are multiple values for a dimension, they are OR'd together.
     */
    Filter?: Expression;
    /**
     * The value that you want to sort the data by. The following values are supported for Key:    UtilizationPercentage     UtilizationPercentageInUnits     PurchasedHours     PurchasedUnits     TotalActualHours     TotalActualUnits     UnusedHours     UnusedUnits     OnDemandCostOfRIHoursUsed     NetRISavings     TotalPotentialRISavings     AmortizedUpfrontFee     AmortizedRecurringFee     TotalAmortizedFee     RICostForUnusedHours     RealizedSavings     UnrealizedSavings    The supported values for SortOrder are ASCENDING and DESCENDING.
     */
    SortBy?: SortDefinition;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
    /**
     * The maximum number of objects that you returned for this request. If more objects are available, in the response, Amazon Web Services provides a NextPageToken value that you can use in a subsequent call to get the next batch of objects.
     */
    MaxResults?: MaxResults;
  }
  export interface GetReservationUtilizationResponse {
    /**
     * The amount of time that you used your Reserved Instances (RIs).
     */
    UtilizationsByTime: UtilizationsByTime;
    /**
     * The total amount of time that you used your Reserved Instances (RIs).
     */
    Total?: ReservationAggregates;
    /**
     * The token for the next set of retrievable results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetRightsizingRecommendationRequest {
    Filter?: Expression;
    /**
     * You can use Configuration to customize recommendations across two attributes. You can choose to view recommendations for instances within the same instance families or across different instance families. You can also choose to view your estimated savings that are associated with recommendations with consideration of existing Savings Plans or RI benefits, or neither. 
     */
    Configuration?: RightsizingRecommendationConfiguration;
    /**
     * The specific service that you want recommendations for. The only valid value for GetRightsizingRecommendation is "AmazonEC2".
     */
    Service: GenericString;
    /**
     * The number of recommendations that you want returned in a single response object.
     */
    PageSize?: NonNegativeInteger;
    /**
     * The pagination token that indicates the next set of results that you want to retrieve.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetRightsizingRecommendationResponse {
    /**
     * Information regarding this specific recommendation set.
     */
    Metadata?: RightsizingRecommendationMetadata;
    /**
     * Summary of this recommendation set.
     */
    Summary?: RightsizingRecommendationSummary;
    /**
     * Recommendations to rightsize resources.
     */
    RightsizingRecommendations?: RightsizingRecommendationList;
    /**
     * The token to retrieve the next set of results.
     */
    NextPageToken?: NextPageToken;
    /**
     * You can use Configuration to customize recommendations across two attributes. You can choose to view recommendations for instances within the same instance families or across different instance families. You can also choose to view your estimated savings that are associated with recommendations with consideration of existing Savings Plans or RI benefits, or neither. 
     */
    Configuration?: RightsizingRecommendationConfiguration;
  }
  export interface GetSavingsPlanPurchaseRecommendationDetailsRequest {
    /**
     * The ID that is associated with the Savings Plan recommendation.
     */
    RecommendationDetailId: RecommendationDetailId;
  }
  export interface GetSavingsPlanPurchaseRecommendationDetailsResponse {
    /**
     * The ID that is associated with the Savings Plan recommendation.
     */
    RecommendationDetailId?: RecommendationDetailId;
    /**
     * Contains detailed information about a specific Savings Plan recommendation.
     */
    RecommendationDetailData?: RecommendationDetailData;
  }
  export interface GetSavingsPlansCoverageRequest {
    /**
     * The time period that you want the usage and costs for. The Start date must be within 13 months. The End date must be after the Start date, and before the current date. Future dates can't be used as an End date.
     */
    TimePeriod: DateInterval;
    /**
     * You can group the data using the attributes INSTANCE_FAMILY, REGION, or SERVICE.
     */
    GroupBy?: GroupDefinitions;
    /**
     * The granularity of the Amazon Web Services cost data for your Savings Plans. Granularity can't be set if GroupBy is set. The GetSavingsPlansCoverage operation supports only DAILY and MONTHLY granularities.
     */
    Granularity?: Granularity;
    /**
     * Filters Savings Plans coverage data by dimensions. You can filter data for Savings Plans usage with the following dimensions:    LINKED_ACCOUNT     REGION     SERVICE     INSTANCE_FAMILY     GetSavingsPlansCoverage uses the same Expression object as the other operations, but only AND is supported among each dimension. If there are multiple values for a dimension, they are OR'd together. Cost category is also supported.
     */
    Filter?: Expression;
    /**
     * The measurement that you want your Savings Plans coverage reported in. The only valid value is SpendCoveredBySavingsPlans.
     */
    Metrics?: MetricNames;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextToken?: NextPageToken;
    /**
     * The number of items to be returned in a response. The default is 20, with a minimum value of 1.
     */
    MaxResults?: MaxResults;
    /**
     * The value that you want to sort the data by. The following values are supported for Key:    SpendCoveredBySavingsPlan     OnDemandCost     CoveragePercentage     TotalCost     InstanceFamily     Region     Service    The supported values for SortOrder are ASCENDING and DESCENDING.
     */
    SortBy?: SortDefinition;
  }
  export interface GetSavingsPlansCoverageResponse {
    /**
     * The amount of spend that your Savings Plans covered.
     */
    SavingsPlansCoverages: SavingsPlansCoverages;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextToken?: NextPageToken;
  }
  export interface GetSavingsPlansPurchaseRecommendationRequest {
    /**
     * The Savings Plans recommendation type that's requested.
     */
    SavingsPlansType: SupportedSavingsPlansType;
    /**
     * The savings plan recommendation term that's used to generate these recommendations.
     */
    TermInYears: TermInYears;
    /**
     * The payment option that's used to generate these recommendations.
     */
    PaymentOption: PaymentOption;
    /**
     * The account scope that you want your recommendations for. Amazon Web Services calculates recommendations including the management account and member accounts if the value is set to PAYER. If the value is LINKED, recommendations are calculated for individual member accounts only.
     */
    AccountScope?: AccountScope;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
    /**
     * The number of recommendations that you want returned in a single response object.
     */
    PageSize?: NonNegativeInteger;
    /**
     * The lookback period that's used to generate the recommendation.
     */
    LookbackPeriodInDays: LookbackPeriodInDays;
    /**
     * You can filter your recommendations by Account ID with the LINKED_ACCOUNT dimension. To filter your recommendations by Account ID, specify Key as LINKED_ACCOUNT and Value as the comma-separated Acount ID(s) that you want to see Savings Plans purchase recommendations for. For GetSavingsPlansPurchaseRecommendation, the Filter doesn't include CostCategories or Tags. It only includes Dimensions. With Dimensions, Key must be LINKED_ACCOUNT and Value can be a single Account ID or multiple comma-separated Account IDs that you want to see Savings Plans Purchase Recommendations for. AND and OR operators are not supported.
     */
    Filter?: Expression;
  }
  export interface GetSavingsPlansPurchaseRecommendationResponse {
    /**
     * Information that regards this specific recommendation set.
     */
    Metadata?: SavingsPlansPurchaseRecommendationMetadata;
    /**
     * Contains your request parameters, Savings Plan Recommendations Summary, and Details.
     */
    SavingsPlansPurchaseRecommendation?: SavingsPlansPurchaseRecommendation;
    /**
     * The token for the next set of retrievable results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetSavingsPlansUtilizationDetailsRequest {
    /**
     * The time period that you want the usage and costs for. The Start date must be within 13 months. The End date must be after the Start date, and before the current date. Future dates can't be used as an End date.
     */
    TimePeriod: DateInterval;
    /**
     * Filters Savings Plans utilization coverage data for active Savings Plans dimensions. You can filter data with the following dimensions:    LINKED_ACCOUNT     SAVINGS_PLAN_ARN     REGION     PAYMENT_OPTION     INSTANCE_TYPE_FAMILY     GetSavingsPlansUtilizationDetails uses the same Expression object as the other operations, but only AND is supported among each dimension.
     */
    Filter?: Expression;
    /**
     * The data type.
     */
    DataType?: SavingsPlansDataTypes;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextToken?: NextPageToken;
    /**
     * The number of items to be returned in a response. The default is 20, with a minimum value of 1.
     */
    MaxResults?: MaxResults;
    /**
     * The value that you want to sort the data by. The following values are supported for Key:    UtilizationPercentage     TotalCommitment     UsedCommitment     UnusedCommitment     NetSavings     AmortizedRecurringCommitment     AmortizedUpfrontCommitment    The supported values for SortOrder are ASCENDING and DESCENDING.
     */
    SortBy?: SortDefinition;
  }
  export interface GetSavingsPlansUtilizationDetailsResponse {
    /**
     * Retrieves a single daily or monthly Savings Plans utilization rate and details for your account.
     */
    SavingsPlansUtilizationDetails: SavingsPlansUtilizationDetails;
    /**
     * The total Savings Plans utilization, regardless of time period.
     */
    Total?: SavingsPlansUtilizationAggregates;
    TimePeriod: DateInterval;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextToken?: NextPageToken;
  }
  export interface GetSavingsPlansUtilizationRequest {
    /**
     * The time period that you want the usage and costs for. The Start date must be within 13 months. The End date must be after the Start date, and before the current date. Future dates can't be used as an End date.
     */
    TimePeriod: DateInterval;
    /**
     * The granularity of the Amazon Web Services utillization data for your Savings Plans. The GetSavingsPlansUtilization operation supports only DAILY and MONTHLY granularities.
     */
    Granularity?: Granularity;
    /**
     * Filters Savings Plans utilization coverage data for active Savings Plans dimensions. You can filter data with the following dimensions:    LINKED_ACCOUNT     SAVINGS_PLAN_ARN     SAVINGS_PLANS_TYPE     REGION     PAYMENT_OPTION     INSTANCE_TYPE_FAMILY     GetSavingsPlansUtilization uses the same Expression object as the other operations, but only AND is supported among each dimension.
     */
    Filter?: Expression;
    /**
     * The value that you want to sort the data by. The following values are supported for Key:    UtilizationPercentage     TotalCommitment     UsedCommitment     UnusedCommitment     NetSavings    The supported values for SortOrder are ASCENDING and DESCENDING.
     */
    SortBy?: SortDefinition;
  }
  export interface GetSavingsPlansUtilizationResponse {
    /**
     * The amount of cost/commitment that you used your Savings Plans. You can use it to specify date ranges.
     */
    SavingsPlansUtilizationsByTime?: SavingsPlansUtilizationsByTime;
    /**
     * The total amount of cost/commitment that you used your Savings Plans, regardless of date ranges.
     */
    Total: SavingsPlansUtilizationAggregates;
  }
  export interface GetTagsRequest {
    /**
     * The value that you want to search for.
     */
    SearchString?: SearchString;
    /**
     * The start and end dates for retrieving the dimension values. The start date is inclusive, but the end date is exclusive. For example, if start is 2017-01-01 and end is 2017-05-01, then the cost and usage data is retrieved from 2017-01-01 up to and including 2017-04-30 but not including 2017-05-01.
     */
    TimePeriod: DateInterval;
    /**
     * The key of the tag that you want to return values for.
     */
    TagKey?: TagKey;
    Filter?: Expression;
    /**
     * The value that you want to sort the data by. The key represents cost and usage metrics. The following values are supported:    BlendedCost     UnblendedCost     AmortizedCost     NetAmortizedCost     NetUnblendedCost     UsageQuantity     NormalizedUsageAmount    The supported values for SortOrder are ASCENDING and DESCENDING. When you use SortBy, NextPageToken and SearchString aren't supported.
     */
    SortBy?: SortDefinitions;
    /**
     * This field is only used when SortBy is provided in the request. The maximum number of objects that are returned for this request. If MaxResults isn't specified with SortBy, the request returns 1000 results as the default value for this parameter. For GetTags, MaxResults has an upper quota of 1000.
     */
    MaxResults?: MaxResults;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
  }
  export interface GetTagsResponse {
    /**
     * The token for the next set of retrievable results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size.
     */
    NextPageToken?: NextPageToken;
    /**
     * The tags that match your request.
     */
    Tags: TagList;
    /**
     * The number of query results that Amazon Web Services returns at a time.
     */
    ReturnSize: PageSize;
    /**
     * The total number of query results.
     */
    TotalSize: PageSize;
  }
  export interface GetUsageForecastRequest {
    /**
     * The start and end dates of the period that you want to retrieve usage forecast for. The start date is included in the period, but the end date isn't included in the period. For example, if start is 2017-01-01 and end is 2017-05-01, then the cost and usage data is retrieved from 2017-01-01 up to and including 2017-04-30 but not including 2017-05-01. The start date must be equal to or later than the current date to avoid a validation error.
     */
    TimePeriod: DateInterval;
    /**
     * Which metric Cost Explorer uses to create your forecast. Valid values for a GetUsageForecast call are the following:   USAGE_QUANTITY   NORMALIZED_USAGE_AMOUNT  
     */
    Metric: Metric;
    /**
     * How granular you want the forecast to be. You can get 3 months of DAILY forecasts or 12 months of MONTHLY forecasts. The GetUsageForecast operation supports only DAILY and MONTHLY granularities.
     */
    Granularity: Granularity;
    /**
     * The filters that you want to use to filter your forecast. The GetUsageForecast API supports filtering by the following dimensions:    AZ     INSTANCE_TYPE     LINKED_ACCOUNT     LINKED_ACCOUNT_NAME     OPERATION     PURCHASE_TYPE     REGION     SERVICE     USAGE_TYPE     USAGE_TYPE_GROUP     RECORD_TYPE     OPERATING_SYSTEM     TENANCY     SCOPE     PLATFORM     SUBSCRIPTION_ID     LEGAL_ENTITY_NAME     DEPLOYMENT_OPTION     DATABASE_ENGINE     INSTANCE_TYPE_FAMILY     BILLING_ENTITY     RESERVATION_ID     SAVINGS_PLAN_ARN   
     */
    Filter?: Expression;
    /**
     * Amazon Web Services Cost Explorer always returns the mean forecast as a single point. You can request a prediction interval around the mean by specifying a confidence level. The higher the confidence level, the more confident Cost Explorer is about the actual value falling in the prediction interval. Higher confidence levels result in wider prediction intervals.
     */
    PredictionIntervalLevel?: PredictionIntervalLevel;
  }
  export interface GetUsageForecastResponse {
    /**
     * How much you're forecasted to use over the forecast period.
     */
    Total?: MetricValue;
    /**
     * The forecasts for your query, in order. For DAILY forecasts, this is a list of days. For MONTHLY forecasts, this is a list of months.
     */
    ForecastResultsByTime?: ForecastResultsByTime;
  }
  export type Granularity = "DAILY"|"MONTHLY"|"HOURLY"|string;
  export interface Group {
    /**
     * The keys that are included in this group.
     */
    Keys?: Keys;
    /**
     * The metrics that are included in this group.
     */
    Metrics?: Metrics;
  }
  export interface GroupDefinition {
    /**
     * The string that represents the type of group.
     */
    Type?: GroupDefinitionType;
    /**
     * The string that represents a key for a specified group.
     */
    Key?: GroupDefinitionKey;
  }
  export type GroupDefinitionKey = string;
  export type GroupDefinitionType = "DIMENSION"|"TAG"|"COST_CATEGORY"|string;
  export type GroupDefinitions = GroupDefinition[];
  export type Groups = Group[];
  export interface Impact {
    /**
     * The maximum dollar value that's observed for an anomaly.
     */
    MaxImpact: GenericDouble;
    /**
     * The cumulative dollar difference between the total actual spend and total expected spend. It is calculated as TotalActualSpend - TotalExpectedSpend.
     */
    TotalImpact?: GenericDouble;
    /**
     * The cumulative dollar amount that was actually spent during the anomaly.
     */
    TotalActualSpend?: NullableNonNegativeDouble;
    /**
     * The cumulative dollar amount that was expected to be spent during the anomaly. It is calculated using advanced machine learning models to determine the typical spending pattern based on historical data for a customer.
     */
    TotalExpectedSpend?: NullableNonNegativeDouble;
    /**
     * The cumulative percentage difference between the total actual spend and total expected spend. It is calculated as (TotalImpact / TotalExpectedSpend) * 100. When TotalExpectedSpend is zero, this field is omitted. Expected spend can be zero in situations such as when you start to use a service for the first time.
     */
    TotalImpactPercentage?: NullableNonNegativeDouble;
  }
  export interface InstanceDetails {
    /**
     * The Amazon EC2 instances that Amazon Web Services recommends that you purchase.
     */
    EC2InstanceDetails?: EC2InstanceDetails;
    /**
     * The Amazon RDS instances that Amazon Web Services recommends that you purchase.
     */
    RDSInstanceDetails?: RDSInstanceDetails;
    /**
     * The Amazon Redshift instances that Amazon Web Services recommends that you purchase.
     */
    RedshiftInstanceDetails?: RedshiftInstanceDetails;
    /**
     * The ElastiCache instances that Amazon Web Services recommends that you purchase.
     */
    ElastiCacheInstanceDetails?: ElastiCacheInstanceDetails;
    /**
     * The Amazon OpenSearch Service instances that Amazon Web Services recommends that you purchase.
     */
    ESInstanceDetails?: ESInstanceDetails;
  }
  export type Key = string;
  export type Keys = Key[];
  export interface ListCostAllocationTagsRequest {
    /**
     * The status of cost allocation tag keys that are returned for this request. 
     */
    Status?: CostAllocationTagStatus;
    /**
     * The list of cost allocation tag keys that are returned for this request. 
     */
    TagKeys?: CostAllocationTagKeyList;
    /**
     * The type of CostAllocationTag object that are returned for this request. The AWSGenerated type tags are tags that Amazon Web Services defines and applies to support Amazon Web Services resources for cost allocation purposes. The UserDefined type tags are tags that you define, create, and apply to resources. 
     */
    Type?: CostAllocationTagType;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size. 
     */
    NextToken?: NextPageToken;
    /**
     * The maximum number of objects that are returned for this request. By default, the request returns 100 results. 
     */
    MaxResults?: CostAllocationTagsMaxResults;
  }
  export interface ListCostAllocationTagsResponse {
    /**
     * A list of cost allocation tags that includes the detailed metadata for each one. 
     */
    CostAllocationTags?: CostAllocationTagList;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size. 
     */
    NextToken?: NextPageToken;
  }
  export interface ListCostCategoryDefinitionsRequest {
    /**
     * The date when the Cost Category was effective. 
     */
    EffectiveOn?: ZonedDateTime;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size. 
     */
    NextToken?: NextPageToken;
    /**
     * The number of entries a paginated response contains. 
     */
    MaxResults?: CostCategoryMaxResults;
  }
  export interface ListCostCategoryDefinitionsResponse {
    /**
     * A reference to a Cost Category that contains enough information to identify the Cost Category. 
     */
    CostCategoryReferences?: CostCategoryReferencesList;
    /**
     * The token to retrieve the next set of results. Amazon Web Services provides the token when the response from a previous call has more results than the maximum page size. 
     */
    NextToken?: NextPageToken;
  }
  export interface ListSavingsPlansPurchaseRecommendationGenerationRequest {
    /**
     * The status of the recommendation generation.
     */
    GenerationStatus?: GenerationStatus;
    /**
     * The IDs for each specific recommendation.
     */
    RecommendationIds?: RecommendationIdList;
    /**
     * The number of recommendations that you want returned in a single response object.
     */
    PageSize?: NonNegativeInteger;
    /**
     * The token to retrieve the next set of results.
     */
    NextPageToken?: NextPageToken;
  }
  export interface ListSavingsPlansPurchaseRecommendationGenerationResponse {
    /**
     * The list of historical recommendation generations.
     */
    GenerationSummaryList?: GenerationSummaryList;
    /**
     * The token to retrieve the next set of results.
     */
    NextPageToken?: NextPageToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. For a list of supported resources, see ResourceTag.
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of tag key value pairs that are associated with the resource. 
     */
    ResourceTags?: ResourceTagList;
  }
  export type LookbackPeriodInDays = "SEVEN_DAYS"|"THIRTY_DAYS"|"SIXTY_DAYS"|string;
  export type MatchOption = "EQUALS"|"ABSENT"|"STARTS_WITH"|"ENDS_WITH"|"CONTAINS"|"CASE_SENSITIVE"|"CASE_INSENSITIVE"|"GREATER_THAN_OR_EQUAL"|string;
  export type MatchOptions = MatchOption[];
  export type MaxResults = number;
  export type Metric = "BLENDED_COST"|"UNBLENDED_COST"|"AMORTIZED_COST"|"NET_UNBLENDED_COST"|"NET_AMORTIZED_COST"|"USAGE_QUANTITY"|"NORMALIZED_USAGE_AMOUNT"|string;
  export type MetricAmount = string;
  export type MetricName = string;
  export type MetricNames = MetricName[];
  export type MetricUnit = string;
  export interface MetricValue {
    /**
     * The actual number that represents the metric.
     */
    Amount?: MetricAmount;
    /**
     * The unit that the metric is given in.
     */
    Unit?: MetricUnit;
  }
  export type Metrics = {[key: string]: MetricValue};
  export type MetricsOverLookbackPeriod = RecommendationDetailHourlyMetrics[];
  export interface ModifyRecommendationDetail {
    /**
     * Determines whether this instance type is the Amazon Web Services default recommendation.
     */
    TargetInstances?: TargetInstancesList;
  }
  export type MonitorArnList = Arn[];
  export type MonitorDimension = "SERVICE"|string;
  export type MonitorType = "DIMENSIONAL"|"CUSTOM"|string;
  export type NetRISavings = string;
  export interface NetworkResourceUtilization {
    /**
     * The network inbound throughput utilization measured in Bytes per second (Bps). 
     */
    NetworkInBytesPerSecond?: GenericString;
    /**
     * The network outbound throughput utilization measured in Bytes per second (Bps). 
     */
    NetworkOutBytesPerSecond?: GenericString;
    /**
     * The network inbound packets that are measured in packets per second. 
     */
    NetworkPacketsInPerSecond?: GenericString;
    /**
     * The network outbound packets that are measured in packets per second. 
     */
    NetworkPacketsOutPerSecond?: GenericString;
  }
  export type NextPageToken = string;
  export type NonNegativeInteger = number;
  export type NullableNonNegativeDouble = number;
  export type NumericOperator = "EQUAL"|"GREATER_THAN_OR_EQUAL"|"LESS_THAN_OR_EQUAL"|"GREATER_THAN"|"LESS_THAN"|"BETWEEN"|string;
  export type OfferingClass = "STANDARD"|"CONVERTIBLE"|string;
  export type OnDemandCost = string;
  export type OnDemandCostOfRIHoursUsed = string;
  export type OnDemandHours = string;
  export type OnDemandNormalizedUnits = string;
  export type PageSize = number;
  export type PaymentOption = "NO_UPFRONT"|"PARTIAL_UPFRONT"|"ALL_UPFRONT"|"LIGHT_UTILIZATION"|"MEDIUM_UTILIZATION"|"HEAVY_UTILIZATION"|string;
  export type PlatformDifference = "HYPERVISOR"|"NETWORK_INTERFACE"|"STORAGE_INTERFACE"|"INSTANCE_STORE_AVAILABILITY"|"VIRTUALIZATION_TYPE"|string;
  export type PlatformDifferences = PlatformDifference[];
  export type PredictionIntervalLevel = number;
  export interface ProvideAnomalyFeedbackRequest {
    /**
     * A cost anomaly ID. 
     */
    AnomalyId: GenericString;
    /**
     * Describes whether the cost anomaly was a planned activity or you considered it an anomaly. 
     */
    Feedback: AnomalyFeedbackType;
  }
  export interface ProvideAnomalyFeedbackResponse {
    /**
     * The ID of the modified cost anomaly. 
     */
    AnomalyId: GenericString;
  }
  export type PurchasedHours = string;
  export type PurchasedUnits = string;
  export interface RDSInstanceDetails {
    /**
     * The instance family of the recommended reservation.
     */
    Family?: GenericString;
    /**
     * The type of instance that Amazon Web Services recommends.
     */
    InstanceType?: GenericString;
    /**
     * The Amazon Web Services Region of the recommended reservation.
     */
    Region?: GenericString;
    /**
     * The database engine that the recommended reservation supports.
     */
    DatabaseEngine?: GenericString;
    /**
     * The database edition that the recommended reservation supports.
     */
    DatabaseEdition?: GenericString;
    /**
     * Determines whether the recommendation is for a reservation in a single Availability Zone or a reservation with a backup in a second Availability Zone.
     */
    DeploymentOption?: GenericString;
    /**
     * The license model that the recommended reservation supports.
     */
    LicenseModel?: GenericString;
    /**
     * Determines whether the recommendation is for a current-generation instance. 
     */
    CurrentGeneration?: GenericBoolean;
    /**
     * Determines whether the recommended reservation is size flexible.
     */
    SizeFlexEligible?: GenericBoolean;
  }
  export type RICostForUnusedHours = string;
  export type RealizedSavings = string;
  export interface RecommendationDetailData {
    /**
     * The account scope that you want your recommendations for. Amazon Web Services calculates recommendations including the management account and member accounts if the value is set to PAYER. If the value is LINKED, recommendations are calculated for individual member accounts only.
     */
    AccountScope?: AccountScope;
    /**
     * How many days of previous usage that Amazon Web Services considers when making this recommendation.
     */
    LookbackPeriodInDays?: LookbackPeriodInDays;
    /**
     * The requested Savings Plan recommendation type.
     */
    SavingsPlansType?: SupportedSavingsPlansType;
    /**
     * The term of the commitment in years.
     */
    TermInYears?: TermInYears;
    /**
     * The payment option for the commitment (for example, All Upfront or No Upfront).
     */
    PaymentOption?: PaymentOption;
    /**
     * The AccountID that the recommendation is generated for.
     */
    AccountId?: GenericString;
    /**
     * The currency code that Amazon Web Services used to generate the recommendation and present potential savings.
     */
    CurrencyCode?: GenericString;
    /**
     * The instance family of the recommended Savings Plan.
     */
    InstanceFamily?: GenericString;
    /**
     * The region the recommendation is generated for.
     */
    Region?: GenericString;
    /**
     * The unique ID that's used to distinguish Savings Plans from one another.
     */
    OfferingId?: GenericString;
    GenerationTimestamp?: ZonedDateTime;
    LatestUsageTimestamp?: ZonedDateTime;
    /**
     * The average value of hourly On-Demand spend over the lookback period of the applicable usage type.
     */
    CurrentAverageHourlyOnDemandSpend?: GenericString;
    /**
     * The highest value of hourly On-Demand spend over the lookback period of the applicable usage type.
     */
    CurrentMaximumHourlyOnDemandSpend?: GenericString;
    /**
     * The lowest value of hourly On-Demand spend over the lookback period of the applicable usage type.
     */
    CurrentMinimumHourlyOnDemandSpend?: GenericString;
    /**
     * The estimated utilization of the recommended Savings Plan.
     */
    EstimatedAverageUtilization?: GenericString;
    /**
     * The estimated monthly savings amount based on the recommended Savings Plan.
     */
    EstimatedMonthlySavingsAmount?: GenericString;
    /**
     * The remaining On-Demand cost estimated to not be covered by the recommended Savings Plan, over the length of the lookback period.
     */
    EstimatedOnDemandCost?: GenericString;
    /**
     * The estimated On-Demand costs you expect with no additional commitment, based on your usage of the selected time period and the Savings Plan you own.
     */
    EstimatedOnDemandCostWithCurrentCommitment?: GenericString;
    /**
     * The estimated return on investment that's based on the recommended Savings Plan that you purchased. This is calculated as estimatedSavingsAmount/estimatedSPCost*100.
     */
    EstimatedROI?: GenericString;
    /**
     * The cost of the recommended Savings Plan over the length of the lookback period.
     */
    EstimatedSPCost?: GenericString;
    /**
     * The estimated savings amount that's based on the recommended Savings Plan over the length of the lookback period.
     */
    EstimatedSavingsAmount?: GenericString;
    /**
     * The estimated savings percentage relative to the total cost of applicable On-Demand usage over the lookback period.
     */
    EstimatedSavingsPercentage?: GenericString;
    /**
     * The existing hourly commitment for the Savings Plan type.
     */
    ExistingHourlyCommitment?: GenericString;
    /**
     * The recommended hourly commitment level for the Savings Plan type and the configuration that's based on the usage during the lookback period.
     */
    HourlyCommitmentToPurchase?: GenericString;
    /**
     * The upfront cost of the recommended Savings Plan, based on the selected payment option.
     */
    UpfrontCost?: GenericString;
    /**
     * The average value of hourly coverage over the lookback period.
     */
    CurrentAverageCoverage?: GenericString;
    /**
     * The estimated coverage of the recommended Savings Plan.
     */
    EstimatedAverageCoverage?: GenericString;
    /**
     * The related hourly cost, coverage, and utilization metrics over the lookback period.
     */
    MetricsOverLookbackPeriod?: MetricsOverLookbackPeriod;
  }
  export interface RecommendationDetailHourlyMetrics {
    StartTime?: ZonedDateTime;
    /**
     * The remaining On-Demand cost estimated to not be covered by the recommended Savings Plan, over the length of the lookback period.
     */
    EstimatedOnDemandCost?: GenericString;
    /**
     * The current amount of Savings Plans eligible usage that the Savings Plan covered.
     */
    CurrentCoverage?: GenericString;
    /**
     * The estimated coverage amount based on the recommended Savings Plan.
     */
    EstimatedCoverage?: GenericString;
    /**
     * The estimated utilization for the recommended Savings Plan.
     */
    EstimatedNewCommitmentUtilization?: GenericString;
  }
  export type RecommendationDetailId = string;
  export type RecommendationId = string;
  export type RecommendationIdList = RecommendationId[];
  export type RecommendationTarget = "SAME_INSTANCE_FAMILY"|"CROSS_INSTANCE_FAMILY"|string;
  export interface RedshiftInstanceDetails {
    /**
     * The instance family of the recommended reservation.
     */
    Family?: GenericString;
    /**
     * The type of node that Amazon Web Services recommends.
     */
    NodeType?: GenericString;
    /**
     * The Amazon Web Services Region of the recommended reservation.
     */
    Region?: GenericString;
    /**
     * Determines whether the recommendation is for a current-generation instance.
     */
    CurrentGeneration?: GenericBoolean;
    /**
     * Determines whether the recommended reservation is size flexible.
     */
    SizeFlexEligible?: GenericBoolean;
  }
  export interface ReservationAggregates {
    /**
     * The percentage of reservation time that you used.
     */
    UtilizationPercentage?: UtilizationPercentage;
    /**
     * The percentage of Amazon EC2 reservation time that you used. It's converted to normalized units. Normalized units are available only for Amazon EC2 usage after November 11, 2017.
     */
    UtilizationPercentageInUnits?: UtilizationPercentageInUnits;
    /**
     * How many reservation hours that you purchased.
     */
    PurchasedHours?: PurchasedHours;
    /**
     * The number of Amazon EC2 reservation hours that you purchased. It's converted to normalized units. Normalized units are available only for Amazon EC2 usage after November 11, 2017.
     */
    PurchasedUnits?: PurchasedUnits;
    /**
     * The total number of reservation hours that you used.
     */
    TotalActualHours?: TotalActualHours;
    /**
     * The total number of Amazon EC2 reservation hours that you used. It's converted to normalized units. Normalized units are available only for Amazon EC2 usage after November 11, 2017.
     */
    TotalActualUnits?: TotalActualUnits;
    /**
     * The number of reservation hours that you didn't use.
     */
    UnusedHours?: UnusedHours;
    /**
     * The number of Amazon EC2 reservation hours that you didn't use. It's converted to normalized units. Normalized units are available only for Amazon EC2 usage after November 11, 2017.
     */
    UnusedUnits?: UnusedUnits;
    /**
     * How much your reservation costs if charged On-Demand rates.
     */
    OnDemandCostOfRIHoursUsed?: OnDemandCostOfRIHoursUsed;
    /**
     * How much you saved due to purchasing and utilizing reservation. Amazon Web Services calculates this by subtracting TotalAmortizedFee from OnDemandCostOfRIHoursUsed.
     */
    NetRISavings?: NetRISavings;
    /**
     * How much you might save if you use your entire reservation.
     */
    TotalPotentialRISavings?: TotalPotentialRISavings;
    /**
     * The upfront cost of your reservation. It's amortized over the reservation period.
     */
    AmortizedUpfrontFee?: AmortizedUpfrontFee;
    /**
     * The monthly cost of your reservation. It's amortized over the reservation period.
     */
    AmortizedRecurringFee?: AmortizedRecurringFee;
    /**
     * The total cost of your reservation. It's amortized over the reservation period.
     */
    TotalAmortizedFee?: TotalAmortizedFee;
    /**
     * The cost of unused hours for your reservation.
     */
    RICostForUnusedHours?: RICostForUnusedHours;
    /**
     * The realized savings because of purchasing and using a reservation.
     */
    RealizedSavings?: RealizedSavings;
    /**
     * The unrealized savings because of purchasing and using a reservation.
     */
    UnrealizedSavings?: UnrealizedSavings;
  }
  export interface ReservationCoverageGroup {
    /**
     * The attributes for this group of reservations.
     */
    Attributes?: Attributes;
    /**
     * How much instance usage this group of reservations covered.
     */
    Coverage?: Coverage;
  }
  export type ReservationCoverageGroups = ReservationCoverageGroup[];
  export type ReservationGroupKey = string;
  export type ReservationGroupValue = string;
  export interface ReservationPurchaseRecommendation {
    /**
     * The account scope that Amazon Web Services recommends that you purchase this instance for. For example, you can purchase this reservation for an entire organization in Amazon Web Services Organizations.
     */
    AccountScope?: AccountScope;
    /**
     * How many days of previous usage that Amazon Web Services considers when making this recommendation.
     */
    LookbackPeriodInDays?: LookbackPeriodInDays;
    /**
     * The term of the reservation that you want recommendations for, in years.
     */
    TermInYears?: TermInYears;
    /**
     * The payment option for the reservation (for example, AllUpfront or NoUpfront).
     */
    PaymentOption?: PaymentOption;
    /**
     * Hardware specifications for the service that you want recommendations for.
     */
    ServiceSpecification?: ServiceSpecification;
    /**
     * Details about the recommended purchases.
     */
    RecommendationDetails?: ReservationPurchaseRecommendationDetails;
    /**
     * A summary about the recommended purchase.
     */
    RecommendationSummary?: ReservationPurchaseRecommendationSummary;
  }
  export interface ReservationPurchaseRecommendationDetail {
    /**
     * The account that this Reserved Instance (RI) recommendation is for.
     */
    AccountId?: GenericString;
    /**
     * Details about the instances that Amazon Web Services recommends that you purchase.
     */
    InstanceDetails?: InstanceDetails;
    /**
     * The number of instances that Amazon Web Services recommends that you purchase.
     */
    RecommendedNumberOfInstancesToPurchase?: GenericString;
    /**
     * The number of normalized units that Amazon Web Services recommends that you purchase.
     */
    RecommendedNormalizedUnitsToPurchase?: GenericString;
    /**
     * The minimum number of instances that you used in an hour during the historical period. Amazon Web Services uses this to calculate your recommended reservation purchases.
     */
    MinimumNumberOfInstancesUsedPerHour?: GenericString;
    /**
     * The minimum number of normalized units that you used in an hour during the historical period. Amazon Web Services uses this to calculate your recommended reservation purchases.
     */
    MinimumNormalizedUnitsUsedPerHour?: GenericString;
    /**
     * The maximum number of instances that you used in an hour during the historical period. Amazon Web Services uses this to calculate your recommended reservation purchases.
     */
    MaximumNumberOfInstancesUsedPerHour?: GenericString;
    /**
     * The maximum number of normalized units that you used in an hour during the historical period. Amazon Web Services uses this to calculate your recommended reservation purchases.
     */
    MaximumNormalizedUnitsUsedPerHour?: GenericString;
    /**
     * The average number of instances that you used in an hour during the historical period. Amazon Web Services uses this to calculate your recommended reservation purchases.
     */
    AverageNumberOfInstancesUsedPerHour?: GenericString;
    /**
     * The average number of normalized units that you used in an hour during the historical period. Amazon Web Services uses this to calculate your recommended reservation purchases.
     */
    AverageNormalizedUnitsUsedPerHour?: GenericString;
    /**
     * The average utilization of your instances. Amazon Web Services uses this to calculate your recommended reservation purchases.
     */
    AverageUtilization?: GenericString;
    /**
     * How long Amazon Web Services estimates that it takes for this instance to start saving you money, in months.
     */
    EstimatedBreakEvenInMonths?: GenericString;
    /**
     * The currency code that Amazon Web Services used to calculate the costs for this instance.
     */
    CurrencyCode?: GenericString;
    /**
     * How much Amazon Web Services estimates that this specific recommendation might save you in a month.
     */
    EstimatedMonthlySavingsAmount?: GenericString;
    /**
     * How much Amazon Web Services estimates that this specific recommendation might save you in a month, as a percentage of your overall costs.
     */
    EstimatedMonthlySavingsPercentage?: GenericString;
    /**
     * How much Amazon Web Services estimates that you spend on On-Demand Instances in a month.
     */
    EstimatedMonthlyOnDemandCost?: GenericString;
    /**
     * How much Amazon Web Services estimates that you might spend for all usage during the specified historical period if you had a reservation.
     */
    EstimatedReservationCostForLookbackPeriod?: GenericString;
    /**
     * How much purchasing this instance costs you upfront.
     */
    UpfrontCost?: GenericString;
    /**
     * How much purchasing this instance costs you on a monthly basis.
     */
    RecurringStandardMonthlyCost?: GenericString;
  }
  export type ReservationPurchaseRecommendationDetails = ReservationPurchaseRecommendationDetail[];
  export interface ReservationPurchaseRecommendationMetadata {
    /**
     * The ID for this specific recommendation.
     */
    RecommendationId?: GenericString;
    /**
     * The timestamp for when Amazon Web Services made this recommendation.
     */
    GenerationTimestamp?: GenericString;
  }
  export interface ReservationPurchaseRecommendationSummary {
    /**
     * The total amount that Amazon Web Services estimates that this recommendation could save you in a month.
     */
    TotalEstimatedMonthlySavingsAmount?: GenericString;
    /**
     * The total amount that Amazon Web Services estimates that this recommendation could save you in a month, as a percentage of your costs.
     */
    TotalEstimatedMonthlySavingsPercentage?: GenericString;
    /**
     * The currency code used for this recommendation.
     */
    CurrencyCode?: GenericString;
  }
  export type ReservationPurchaseRecommendations = ReservationPurchaseRecommendation[];
  export interface ReservationUtilizationGroup {
    /**
     * The key for a specific reservation attribute.
     */
    Key?: ReservationGroupKey;
    /**
     * The value of a specific reservation attribute.
     */
    Value?: ReservationGroupValue;
    /**
     * The attributes for this group of reservations.
     */
    Attributes?: Attributes;
    /**
     * How much you used this group of reservations.
     */
    Utilization?: ReservationAggregates;
  }
  export type ReservationUtilizationGroups = ReservationUtilizationGroup[];
  export type ReservedHours = string;
  export type ReservedNormalizedUnits = string;
  export interface ResourceDetails {
    /**
     * Details for the Amazon EC2 resource.
     */
    EC2ResourceDetails?: EC2ResourceDetails;
  }
  export interface ResourceTag {
    /**
     * The key that's associated with the tag. 
     */
    Key: ResourceTagKey;
    /**
     * The value that's associated with the tag. 
     */
    Value: ResourceTagValue;
  }
  export type ResourceTagKey = string;
  export type ResourceTagKeyList = ResourceTagKey[];
  export type ResourceTagList = ResourceTag[];
  export type ResourceTagValue = string;
  export interface ResourceUtilization {
    /**
     * The utilization of current Amazon EC2 instance. 
     */
    EC2ResourceUtilization?: EC2ResourceUtilization;
  }
  export interface ResultByTime {
    /**
     * The time period that the result covers.
     */
    TimePeriod?: DateInterval;
    /**
     * The total amount of cost or usage accrued during the time period.
     */
    Total?: Metrics;
    /**
     * The groups that this time period includes.
     */
    Groups?: Groups;
    /**
     * Determines whether the result is estimated.
     */
    Estimated?: Estimated;
  }
  export type ResultsByTime = ResultByTime[];
  export interface RightsizingRecommendation {
    /**
     * The account that this recommendation is for.
     */
    AccountId?: GenericString;
    /**
     * Context regarding the current instance.
     */
    CurrentInstance?: CurrentInstance;
    /**
     * A recommendation to either terminate or modify the resource.
     */
    RightsizingType?: RightsizingType;
    /**
     * The details for the modification recommendations. 
     */
    ModifyRecommendationDetail?: ModifyRecommendationDetail;
    /**
     * The details for termination recommendations.
     */
    TerminateRecommendationDetail?: TerminateRecommendationDetail;
    /**
     * The list of possible reasons why the recommendation is generated, such as under- or over-utilization of specific metrics (for example, CPU, Memory, Network). 
     */
    FindingReasonCodes?: FindingReasonCodes;
  }
  export interface RightsizingRecommendationConfiguration {
    /**
     * The option to see recommendations within the same instance family or recommendations for instances across other families. The default value is SAME_INSTANCE_FAMILY. 
     */
    RecommendationTarget: RecommendationTarget;
    /**
     * The option to consider RI or Savings Plans discount benefits in your savings calculation. The default value is TRUE. 
     */
    BenefitsConsidered: GenericBoolean;
  }
  export type RightsizingRecommendationList = RightsizingRecommendation[];
  export interface RightsizingRecommendationMetadata {
    /**
     * The ID for this specific recommendation.
     */
    RecommendationId?: GenericString;
    /**
     * The timestamp for when Amazon Web Services made this recommendation.
     */
    GenerationTimestamp?: GenericString;
    /**
     * The number of days of previous usage that Amazon Web Services considers when making this recommendation.
     */
    LookbackPeriodInDays?: LookbackPeriodInDays;
    /**
     * Additional metadata that might be applicable to the recommendation.
     */
    AdditionalMetadata?: GenericString;
  }
  export interface RightsizingRecommendationSummary {
    /**
     * The total number of instance recommendations.
     */
    TotalRecommendationCount?: GenericString;
    /**
     * The estimated total savings resulting from modifications, on a monthly basis.
     */
    EstimatedTotalMonthlySavingsAmount?: GenericString;
    /**
     * The currency code that Amazon Web Services used to calculate the savings.
     */
    SavingsCurrencyCode?: GenericString;
    /**
     *  The savings percentage based on the recommended modifications. It's relative to the total On-Demand costs that are associated with these instances.
     */
    SavingsPercentage?: GenericString;
  }
  export type RightsizingType = "TERMINATE"|"MODIFY"|string;
  export interface RootCause {
    /**
     * The Amazon Web Service name that's associated with the cost anomaly. 
     */
    Service?: GenericString;
    /**
     * The Amazon Web Services Region that's associated with the cost anomaly. 
     */
    Region?: GenericString;
    /**
     * The member account value that's associated with the cost anomaly. 
     */
    LinkedAccount?: GenericString;
    /**
     * The UsageType value that's associated with the cost anomaly. 
     */
    UsageType?: GenericString;
    /**
     * The member account name value that's associated with the cost anomaly.
     */
    LinkedAccountName?: GenericString;
  }
  export type RootCauses = RootCause[];
  export type SavingsPlanArn = string;
  export interface SavingsPlansAmortizedCommitment {
    /**
     * The amortized amount of your Savings Plans commitment that was purchased with either a Partial or a NoUpfront.
     */
    AmortizedRecurringCommitment?: GenericString;
    /**
     * The amortized amount of your Savings Plans commitment that was purchased with an Upfront or PartialUpfront Savings Plans.
     */
    AmortizedUpfrontCommitment?: GenericString;
    /**
     * The total amortized amount of your Savings Plans commitment, regardless of your Savings Plans purchase method. 
     */
    TotalAmortizedCommitment?: GenericString;
  }
  export interface SavingsPlansCoverage {
    /**
     * The attribute that applies to a specific Dimension.
     */
    Attributes?: Attributes;
    /**
     * The amount of Savings Plans eligible usage that the Savings Plans covered.
     */
    Coverage?: SavingsPlansCoverageData;
    TimePeriod?: DateInterval;
  }
  export interface SavingsPlansCoverageData {
    /**
     * The amount of your Amazon Web Services usage that's covered by a Savings Plans.
     */
    SpendCoveredBySavingsPlans?: GenericString;
    /**
     * The cost of your Amazon Web Services usage at the public On-Demand rate.
     */
    OnDemandCost?: GenericString;
    /**
     * The total cost of your Amazon Web Services usage, regardless of your purchase option.
     */
    TotalCost?: GenericString;
    /**
     * The percentage of your existing Savings Plans covered usage, divided by all of your eligible Savings Plans usage in an account (or set of accounts).
     */
    CoveragePercentage?: GenericString;
  }
  export type SavingsPlansCoverages = SavingsPlansCoverage[];
  export type SavingsPlansDataType = "ATTRIBUTES"|"UTILIZATION"|"AMORTIZED_COMMITMENT"|"SAVINGS"|string;
  export type SavingsPlansDataTypes = SavingsPlansDataType[];
  export interface SavingsPlansDetails {
    /**
     * A collection of Amazon Web Services resources in a geographic area. Each Amazon Web Services Region is isolated and independent of the other Regions.
     */
    Region?: GenericString;
    /**
     * A group of instance types that Savings Plans applies to.
     */
    InstanceFamily?: GenericString;
    /**
     * The unique ID that's used to distinguish Savings Plans from one another.
     */
    OfferingId?: GenericString;
  }
  export interface SavingsPlansPurchaseRecommendation {
    /**
     * The account scope that you want your recommendations for. Amazon Web Services calculates recommendations that include the management account and member accounts if the value is set to PAYER. If the value is LINKED, recommendations are calculated for individual member accounts only.
     */
    AccountScope?: AccountScope;
    /**
     * The requested Savings Plans recommendation type.
     */
    SavingsPlansType?: SupportedSavingsPlansType;
    /**
     * The Savings Plans recommendation term in years. It's used to generate the recommendation.
     */
    TermInYears?: TermInYears;
    /**
     * The payment option that's used to generate the recommendation.
     */
    PaymentOption?: PaymentOption;
    /**
     * The lookback period in days that's used to generate the recommendation.
     */
    LookbackPeriodInDays?: LookbackPeriodInDays;
    /**
     * Details for the Savings Plans that we recommend that you purchase to cover existing Savings Plans eligible workloads.
     */
    SavingsPlansPurchaseRecommendationDetails?: SavingsPlansPurchaseRecommendationDetailList;
    /**
     * Summary metrics for your Savings Plans Recommendations. 
     */
    SavingsPlansPurchaseRecommendationSummary?: SavingsPlansPurchaseRecommendationSummary;
  }
  export interface SavingsPlansPurchaseRecommendationDetail {
    /**
     * Details for your recommended Savings Plans.
     */
    SavingsPlansDetails?: SavingsPlansDetails;
    /**
     * The AccountID the recommendation is generated for.
     */
    AccountId?: GenericString;
    /**
     * The upfront cost of the recommended Savings Plans, based on the selected payment option.
     */
    UpfrontCost?: GenericString;
    /**
     * The estimated return on investment that's based on the recommended Savings Plans that you purchased. This is calculated as estimatedSavingsAmount/ estimatedSPCost*100.
     */
    EstimatedROI?: GenericString;
    /**
     * The currency code that Amazon Web Services used to generate the recommendations and present potential savings.
     */
    CurrencyCode?: GenericString;
    /**
     * The cost of the recommended Savings Plans over the length of the lookback period.
     */
    EstimatedSPCost?: GenericString;
    /**
     * The remaining On-Demand cost estimated to not be covered by the recommended Savings Plans, over the length of the lookback period.
     */
    EstimatedOnDemandCost?: GenericString;
    /**
     *  The estimated On-Demand costs you expect with no additional commitment, based on your usage of the selected time period and the Savings Plans you own. 
     */
    EstimatedOnDemandCostWithCurrentCommitment?: GenericString;
    /**
     * The estimated savings amount that's based on the recommended Savings Plans over the length of the lookback period.
     */
    EstimatedSavingsAmount?: GenericString;
    /**
     * The estimated savings percentage relative to the total cost of applicable On-Demand usage over the lookback period.
     */
    EstimatedSavingsPercentage?: GenericString;
    /**
     * The recommended hourly commitment level for the Savings Plans type and the configuration that's based on the usage during the lookback period.
     */
    HourlyCommitmentToPurchase?: GenericString;
    /**
     * The estimated utilization of the recommended Savings Plans.
     */
    EstimatedAverageUtilization?: GenericString;
    /**
     * The estimated monthly savings amount based on the recommended Savings Plans.
     */
    EstimatedMonthlySavingsAmount?: GenericString;
    /**
     * The lowest value of hourly On-Demand spend over the lookback period of the applicable usage type.
     */
    CurrentMinimumHourlyOnDemandSpend?: GenericString;
    /**
     * The highest value of hourly On-Demand spend over the lookback period of the applicable usage type.
     */
    CurrentMaximumHourlyOnDemandSpend?: GenericString;
    /**
     * The average value of hourly On-Demand spend over the lookback period of the applicable usage type.
     */
    CurrentAverageHourlyOnDemandSpend?: GenericString;
    /**
     * Contains detailed information about a specific Savings Plan recommendation.
     */
    RecommendationDetailId?: RecommendationDetailId;
  }
  export type SavingsPlansPurchaseRecommendationDetailList = SavingsPlansPurchaseRecommendationDetail[];
  export interface SavingsPlansPurchaseRecommendationMetadata {
    /**
     * The unique identifier for the recommendation set.
     */
    RecommendationId?: GenericString;
    /**
     * The timestamp that shows when the recommendations were generated.
     */
    GenerationTimestamp?: GenericString;
    /**
     * Additional metadata that might be applicable to the recommendation.
     */
    AdditionalMetadata?: GenericString;
  }
  export interface SavingsPlansPurchaseRecommendationSummary {
    /**
     * The estimated return on investment that's based on the recommended Savings Plans and estimated savings.
     */
    EstimatedROI?: GenericString;
    /**
     * The currency code that Amazon Web Services used to generate the recommendations and present potential savings.
     */
    CurrencyCode?: GenericString;
    /**
     * The estimated total cost of the usage after purchasing the recommended Savings Plans. This is a sum of the cost of Savings Plans during this term, and the remaining On-Demand usage.
     */
    EstimatedTotalCost?: GenericString;
    /**
     * The current total on demand spend of the applicable usage types over the lookback period.
     */
    CurrentOnDemandSpend?: GenericString;
    /**
     * The estimated total savings over the lookback period, based on the purchase of the recommended Savings Plans.
     */
    EstimatedSavingsAmount?: GenericString;
    /**
     * The aggregate number of Savings Plans recommendations that exist for your account.
     */
    TotalRecommendationCount?: GenericString;
    /**
     * The recommended Savings Plans cost on a daily (24 hourly) basis.
     */
    DailyCommitmentToPurchase?: GenericString;
    /**
     * The recommended hourly commitment that's based on the recommendation parameters.
     */
    HourlyCommitmentToPurchase?: GenericString;
    /**
     * The estimated savings relative to the total cost of On-Demand usage, over the lookback period. This is calculated as estimatedSavingsAmount/ CurrentOnDemandSpend*100.
     */
    EstimatedSavingsPercentage?: GenericString;
    /**
     * The estimated monthly savings amount that's based on the recommended Savings Plans purchase.
     */
    EstimatedMonthlySavingsAmount?: GenericString;
    /**
     * The estimated On-Demand costs you expect with no additional commitment. It's based on your usage of the selected time period and the Savings Plans you own. 
     */
    EstimatedOnDemandCostWithCurrentCommitment?: GenericString;
  }
  export interface SavingsPlansSavings {
    /**
     * The savings amount that you're accumulating for the usage that's covered by a Savings Plans, when compared to the On-Demand equivalent of the same usage.
     */
    NetSavings?: GenericString;
    /**
     * How much the amount that the usage would have cost if it was accrued at the On-Demand rate.
     */
    OnDemandCostEquivalent?: GenericString;
  }
  export interface SavingsPlansUtilization {
    /**
     * The total amount of Savings Plans commitment that's been purchased in an account (or set of accounts).
     */
    TotalCommitment?: GenericString;
    /**
     * The amount of your Savings Plans commitment that was consumed from Savings Plans eligible usage in a specific period.
     */
    UsedCommitment?: GenericString;
    /**
     * The amount of your Savings Plans commitment that wasn't consumed from Savings Plans eligible usage in a specific period.
     */
    UnusedCommitment?: GenericString;
    /**
     * The amount of UsedCommitment divided by the TotalCommitment for your Savings Plans.
     */
    UtilizationPercentage?: GenericString;
  }
  export interface SavingsPlansUtilizationAggregates {
    /**
     * A ratio of your effectiveness of using existing Savings Plans to apply to workloads that are Savings Plans eligible.
     */
    Utilization: SavingsPlansUtilization;
    /**
     * The amount that's saved by using existing Savings Plans. Savings returns both net savings from Savings Plans and also the onDemandCostEquivalent of the Savings Plans when considering the utilization rate.
     */
    Savings?: SavingsPlansSavings;
    /**
     * The total amortized commitment for a Savings Plans. This includes the sum of the upfront and recurring Savings Plans fees.
     */
    AmortizedCommitment?: SavingsPlansAmortizedCommitment;
  }
  export interface SavingsPlansUtilizationByTime {
    TimePeriod: DateInterval;
    /**
     * A ratio of your effectiveness of using existing Savings Plans to apply to workloads that are Savings Plans eligible.
     */
    Utilization: SavingsPlansUtilization;
    /**
     * The amount that's saved by using existing Savings Plans. Savings returns both net savings from Savings Plans and also the onDemandCostEquivalent of the Savings Plans when considering the utilization rate.
     */
    Savings?: SavingsPlansSavings;
    /**
     * The total amortized commitment for a Savings Plans. This includes the sum of the upfront and recurring Savings Plans fees.
     */
    AmortizedCommitment?: SavingsPlansAmortizedCommitment;
  }
  export interface SavingsPlansUtilizationDetail {
    /**
     * The unique Amazon Resource Name (ARN) for a particular Savings Plan.
     */
    SavingsPlanArn?: SavingsPlanArn;
    /**
     * The attribute that applies to a specific Dimension.
     */
    Attributes?: Attributes;
    /**
     * A ratio of your effectiveness of using existing Savings Plans to apply to workloads that are Savings Plans eligible.
     */
    Utilization?: SavingsPlansUtilization;
    /**
     * The amount saved by using existing Savings Plans. Savings returns both net savings from savings plans and also the onDemandCostEquivalent of the Savings Plans when considering the utilization rate.
     */
    Savings?: SavingsPlansSavings;
    /**
     * The total amortized commitment for a Savings Plans. Includes the sum of the upfront and recurring Savings Plans fees.
     */
    AmortizedCommitment?: SavingsPlansAmortizedCommitment;
  }
  export type SavingsPlansUtilizationDetails = SavingsPlansUtilizationDetail[];
  export type SavingsPlansUtilizationsByTime = SavingsPlansUtilizationByTime[];
  export type SearchString = string;
  export interface ServiceSpecification {
    /**
     * The Amazon EC2 hardware specifications that you want Amazon Web Services to provide recommendations for.
     */
    EC2Specification?: EC2Specification;
  }
  export interface SortDefinition {
    /**
     * The key that's used to sort the data.
     */
    Key: SortDefinitionKey;
    /**
     * The order that's used to sort the data.
     */
    SortOrder?: SortOrder;
  }
  export type SortDefinitionKey = string;
  export type SortDefinitions = SortDefinition[];
  export type SortOrder = "ASCENDING"|"DESCENDING"|string;
  export interface StartSavingsPlansPurchaseRecommendationGenerationRequest {
  }
  export interface StartSavingsPlansPurchaseRecommendationGenerationResponse {
    /**
     * The ID for this specific recommendation.
     */
    RecommendationId?: RecommendationId;
    /**
     * The start time of the recommendation generation.
     */
    GenerationStartedTime?: ZonedDateTime;
    /**
     * The estimated time for when the recommendation generation will complete.
     */
    EstimatedCompletionTime?: ZonedDateTime;
  }
  export interface Subscriber {
    /**
     * The email address or SNS Amazon Resource Name (ARN). This depends on the Type. 
     */
    Address?: SubscriberAddress;
    /**
     * The notification delivery channel. 
     */
    Type?: SubscriberType;
    /**
     * Indicates if the subscriber accepts the notifications. 
     */
    Status?: SubscriberStatus;
  }
  export type SubscriberAddress = string;
  export type SubscriberStatus = "CONFIRMED"|"DECLINED"|string;
  export type SubscriberType = "EMAIL"|"SNS"|string;
  export type Subscribers = Subscriber[];
  export type SupportedSavingsPlansType = "COMPUTE_SP"|"EC2_INSTANCE_SP"|"SAGEMAKER_SP"|string;
  export type TagKey = string;
  export type TagList = Entity[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. For a list of supported resources, see ResourceTag. 
     */
    ResourceArn: Arn;
    /**
     *  A list of tag key-value pairs to be added to the resource. Each tag consists of a key and a value, and each key must be unique for the resource. The following restrictions apply to resource tags:   Although the maximum number of array members is 200, you can assign a maximum of 50 user-tags to one resource. The remaining are reserved for Amazon Web Services use   The maximum length of a key is 128 characters   The maximum length of a value is 256 characters   Keys and values can only contain alphanumeric characters, spaces, and any of the following: _.:/=+@-    Keys and values are case sensitive   Keys and values are trimmed for any leading or trailing whitespaces   Don’t use aws: as a prefix for your keys. This prefix is reserved for Amazon Web Services use  
     */
    ResourceTags: ResourceTagList;
  }
  export interface TagResourceResponse {
  }
  export interface TagValues {
    /**
     * The key for the tag.
     */
    Key?: TagKey;
    /**
     * The specific value of the tag.
     */
    Values?: Values;
    /**
     * The match options that you can use to filter your results. MatchOptions is only applicable for actions related to Cost Category. The default values for MatchOptions are EQUALS and CASE_SENSITIVE.
     */
    MatchOptions?: MatchOptions;
  }
  export type TagValuesList = TagValues[];
  export interface TargetInstance {
    /**
     * The expected cost to operate this instance type on a monthly basis.
     */
    EstimatedMonthlyCost?: GenericString;
    /**
     * The estimated savings that result from modification, on a monthly basis.
     */
    EstimatedMonthlySavings?: GenericString;
    /**
     * The currency code that Amazon Web Services used to calculate the costs for this instance.
     */
    CurrencyCode?: GenericString;
    /**
     * Determines whether this recommendation is the defaulted Amazon Web Services recommendation.
     */
    DefaultTargetInstance?: GenericBoolean;
    /**
     * Details on the target instance type. 
     */
    ResourceDetails?: ResourceDetails;
    /**
     * The expected utilization metrics for target instance type.
     */
    ExpectedResourceUtilization?: ResourceUtilization;
    /**
     * Explains the actions that you might need to take to successfully migrate your workloads from the current instance type to the recommended instance type. 
     */
    PlatformDifferences?: PlatformDifferences;
  }
  export type TargetInstancesList = TargetInstance[];
  export type TermInYears = "ONE_YEAR"|"THREE_YEARS"|string;
  export interface TerminateRecommendationDetail {
    /**
     * The estimated savings that result from modification, on a monthly basis.
     */
    EstimatedMonthlySavings?: GenericString;
    /**
     * The currency code that Amazon Web Services used to calculate the costs for this instance.
     */
    CurrencyCode?: GenericString;
  }
  export type TotalActualHours = string;
  export type TotalActualUnits = string;
  export type TotalAmortizedFee = string;
  export interface TotalImpactFilter {
    /**
     * The comparing value that's used in the filter. 
     */
    NumericOperator: NumericOperator;
    /**
     * The lower bound dollar value that's used in the filter. 
     */
    StartValue: GenericDouble;
    /**
     * The upper bound dollar value that's used in the filter. 
     */
    EndValue?: GenericDouble;
  }
  export type TotalPotentialRISavings = string;
  export type TotalRunningHours = string;
  export type TotalRunningNormalizedUnits = string;
  export type UnrealizedSavings = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. For a list of supported resources, see ResourceTag. 
     */
    ResourceArn: Arn;
    /**
     * A list of tag keys associated with tags that need to be removed from the resource. If you specify a tag key that doesn't exist, it's ignored. Although the maximum number of array members is 200, user-tag maximum is 50. The remaining are reserved for Amazon Web Services use. 
     */
    ResourceTagKeys: ResourceTagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export type UnusedHours = string;
  export type UnusedUnits = string;
  export interface UpdateAnomalyMonitorRequest {
    /**
     * Cost anomaly monitor Amazon Resource Names (ARNs). 
     */
    MonitorArn: GenericString;
    /**
     * The new name for the cost anomaly monitor. 
     */
    MonitorName?: GenericString;
  }
  export interface UpdateAnomalyMonitorResponse {
    /**
     * A cost anomaly monitor ARN. 
     */
    MonitorArn: GenericString;
  }
  export interface UpdateAnomalySubscriptionRequest {
    /**
     * A cost anomaly subscription Amazon Resource Name (ARN). 
     */
    SubscriptionArn: GenericString;
    /**
     * (deprecated) The update to the threshold value for receiving notifications.  This field has been deprecated. To update a threshold, use ThresholdExpression. Continued use of Threshold will be treated as shorthand syntax for a ThresholdExpression. You can specify either Threshold or ThresholdExpression, but not both.
     */
    Threshold?: NullableNonNegativeDouble;
    /**
     * The update to the frequency value that subscribers receive notifications. 
     */
    Frequency?: AnomalySubscriptionFrequency;
    /**
     * A list of cost anomaly monitor ARNs. 
     */
    MonitorArnList?: MonitorArnList;
    /**
     * The update to the subscriber list. 
     */
    Subscribers?: Subscribers;
    /**
     * The new name of the subscription. 
     */
    SubscriptionName?: GenericString;
    /**
     * The update to the Expression object used to specify the anomalies that you want to generate alerts for. This supports dimensions and nested expressions. The supported dimensions are ANOMALY_TOTAL_IMPACT_ABSOLUTE and ANOMALY_TOTAL_IMPACT_PERCENTAGE, corresponding to an anomaly’s TotalImpact and TotalImpactPercentage, respectively (see Impact for more details). The supported nested expression types are AND and OR. The match option GREATER_THAN_OR_EQUAL is required. Values must be numbers between 0 and 10,000,000,000 in string format. You can specify either Threshold or ThresholdExpression, but not both. The following are examples of valid ThresholdExpressions:   Absolute threshold: { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_ABSOLUTE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } }    Percentage threshold: { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_PERCENTAGE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } }     AND two thresholds together: { "And": [ { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_ABSOLUTE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } }, { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_PERCENTAGE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } } ] }     OR two thresholds together: { "Or": [ { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_ABSOLUTE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } }, { "Dimensions": { "Key": "ANOMALY_TOTAL_IMPACT_PERCENTAGE", "MatchOptions": [ "GREATER_THAN_OR_EQUAL" ], "Values": [ "100" ] } } ] }   
     */
    ThresholdExpression?: Expression;
  }
  export interface UpdateAnomalySubscriptionResponse {
    /**
     * A cost anomaly subscription ARN. 
     */
    SubscriptionArn: GenericString;
  }
  export interface UpdateCostAllocationTagsStatusError {
    /**
     * The key for the cost allocation tag. 
     */
    TagKey?: TagKey;
    /**
     * An error code representing why the action failed on this entry. 
     */
    Code?: GenericString;
    /**
     * A message explaining why the action failed on this entry. 
     */
    Message?: ErrorMessage;
  }
  export type UpdateCostAllocationTagsStatusErrors = UpdateCostAllocationTagsStatusError[];
  export interface UpdateCostAllocationTagsStatusRequest {
    /**
     * The list of CostAllocationTagStatusEntry objects that are used to update cost allocation tags status for this request. 
     */
    CostAllocationTagsStatus: CostAllocationTagStatusList;
  }
  export interface UpdateCostAllocationTagsStatusResponse {
    /**
     * A list of UpdateCostAllocationTagsStatusError objects with error details about each cost allocation tag that can't be updated. If there's no failure, an empty array returns. 
     */
    Errors?: UpdateCostAllocationTagsStatusErrors;
  }
  export interface UpdateCostCategoryDefinitionRequest {
    /**
     * The unique identifier for your Cost Category.
     */
    CostCategoryArn: Arn;
    /**
     * The Cost Category's effective start date. It can only be a billing start date (first day of the month). If the date isn't provided, it's the first day of the current month. Dates can't be before the previous twelve months, or in the future.
     */
    EffectiveStart?: ZonedDateTime;
    RuleVersion: CostCategoryRuleVersion;
    /**
     * The Expression object used to categorize costs. For more information, see CostCategoryRule . 
     */
    Rules: CostCategoryRulesList;
    DefaultValue?: CostCategoryValue;
    /**
     *  The split charge rules used to allocate your charges between your Cost Category values. 
     */
    SplitChargeRules?: CostCategorySplitChargeRulesList;
  }
  export interface UpdateCostCategoryDefinitionResponse {
    /**
     * The unique identifier for your Cost Category. 
     */
    CostCategoryArn?: Arn;
    /**
     * The Cost Category's effective start date. It can only be a billing start date (first day of the month).
     */
    EffectiveStart?: ZonedDateTime;
  }
  export interface UtilizationByTime {
    /**
     * The period of time that this utilization was used for.
     */
    TimePeriod?: DateInterval;
    /**
     * The groups that this utilization result uses.
     */
    Groups?: ReservationUtilizationGroups;
    /**
     * The total number of reservation hours that were used.
     */
    Total?: ReservationAggregates;
  }
  export type UtilizationPercentage = string;
  export type UtilizationPercentageInUnits = string;
  export type UtilizationsByTime = UtilizationByTime[];
  export type Value = string;
  export type Values = Value[];
  export type YearMonthDay = string;
  export type ZonedDateTime = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-10-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CostExplorer client.
   */
  export import Types = CostExplorer;
}
export = CostExplorer;
