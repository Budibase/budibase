import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class LookoutMetrics extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: LookoutMetrics.Types.ClientConfiguration)
  config: Config & LookoutMetrics.Types.ClientConfiguration;
  /**
   * Activates an anomaly detector.
   */
  activateAnomalyDetector(params: LookoutMetrics.Types.ActivateAnomalyDetectorRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.ActivateAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.ActivateAnomalyDetectorResponse, AWSError>;
  /**
   * Activates an anomaly detector.
   */
  activateAnomalyDetector(callback?: (err: AWSError, data: LookoutMetrics.Types.ActivateAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.ActivateAnomalyDetectorResponse, AWSError>;
  /**
   * Runs a backtest for anomaly detection for the specified resource.
   */
  backTestAnomalyDetector(params: LookoutMetrics.Types.BackTestAnomalyDetectorRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.BackTestAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.BackTestAnomalyDetectorResponse, AWSError>;
  /**
   * Runs a backtest for anomaly detection for the specified resource.
   */
  backTestAnomalyDetector(callback?: (err: AWSError, data: LookoutMetrics.Types.BackTestAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.BackTestAnomalyDetectorResponse, AWSError>;
  /**
   * Creates an alert for an anomaly detector.
   */
  createAlert(params: LookoutMetrics.Types.CreateAlertRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.CreateAlertResponse) => void): Request<LookoutMetrics.Types.CreateAlertResponse, AWSError>;
  /**
   * Creates an alert for an anomaly detector.
   */
  createAlert(callback?: (err: AWSError, data: LookoutMetrics.Types.CreateAlertResponse) => void): Request<LookoutMetrics.Types.CreateAlertResponse, AWSError>;
  /**
   * Creates an anomaly detector.
   */
  createAnomalyDetector(params: LookoutMetrics.Types.CreateAnomalyDetectorRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.CreateAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.CreateAnomalyDetectorResponse, AWSError>;
  /**
   * Creates an anomaly detector.
   */
  createAnomalyDetector(callback?: (err: AWSError, data: LookoutMetrics.Types.CreateAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.CreateAnomalyDetectorResponse, AWSError>;
  /**
   * Creates a dataset.
   */
  createMetricSet(params: LookoutMetrics.Types.CreateMetricSetRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.CreateMetricSetResponse) => void): Request<LookoutMetrics.Types.CreateMetricSetResponse, AWSError>;
  /**
   * Creates a dataset.
   */
  createMetricSet(callback?: (err: AWSError, data: LookoutMetrics.Types.CreateMetricSetResponse) => void): Request<LookoutMetrics.Types.CreateMetricSetResponse, AWSError>;
  /**
   * Deactivates an anomaly detector.
   */
  deactivateAnomalyDetector(params: LookoutMetrics.Types.DeactivateAnomalyDetectorRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.DeactivateAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.DeactivateAnomalyDetectorResponse, AWSError>;
  /**
   * Deactivates an anomaly detector.
   */
  deactivateAnomalyDetector(callback?: (err: AWSError, data: LookoutMetrics.Types.DeactivateAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.DeactivateAnomalyDetectorResponse, AWSError>;
  /**
   * Deletes an alert.
   */
  deleteAlert(params: LookoutMetrics.Types.DeleteAlertRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.DeleteAlertResponse) => void): Request<LookoutMetrics.Types.DeleteAlertResponse, AWSError>;
  /**
   * Deletes an alert.
   */
  deleteAlert(callback?: (err: AWSError, data: LookoutMetrics.Types.DeleteAlertResponse) => void): Request<LookoutMetrics.Types.DeleteAlertResponse, AWSError>;
  /**
   * Deletes a detector. Deleting an anomaly detector will delete all of its corresponding resources including any configured datasets and alerts.
   */
  deleteAnomalyDetector(params: LookoutMetrics.Types.DeleteAnomalyDetectorRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.DeleteAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.DeleteAnomalyDetectorResponse, AWSError>;
  /**
   * Deletes a detector. Deleting an anomaly detector will delete all of its corresponding resources including any configured datasets and alerts.
   */
  deleteAnomalyDetector(callback?: (err: AWSError, data: LookoutMetrics.Types.DeleteAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.DeleteAnomalyDetectorResponse, AWSError>;
  /**
   * Describes an alert. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  describeAlert(params: LookoutMetrics.Types.DescribeAlertRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.DescribeAlertResponse) => void): Request<LookoutMetrics.Types.DescribeAlertResponse, AWSError>;
  /**
   * Describes an alert. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  describeAlert(callback?: (err: AWSError, data: LookoutMetrics.Types.DescribeAlertResponse) => void): Request<LookoutMetrics.Types.DescribeAlertResponse, AWSError>;
  /**
   * Returns information about the status of the specified anomaly detection jobs.
   */
  describeAnomalyDetectionExecutions(params: LookoutMetrics.Types.DescribeAnomalyDetectionExecutionsRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.DescribeAnomalyDetectionExecutionsResponse) => void): Request<LookoutMetrics.Types.DescribeAnomalyDetectionExecutionsResponse, AWSError>;
  /**
   * Returns information about the status of the specified anomaly detection jobs.
   */
  describeAnomalyDetectionExecutions(callback?: (err: AWSError, data: LookoutMetrics.Types.DescribeAnomalyDetectionExecutionsResponse) => void): Request<LookoutMetrics.Types.DescribeAnomalyDetectionExecutionsResponse, AWSError>;
  /**
   * Describes a detector. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  describeAnomalyDetector(params: LookoutMetrics.Types.DescribeAnomalyDetectorRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.DescribeAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.DescribeAnomalyDetectorResponse, AWSError>;
  /**
   * Describes a detector. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  describeAnomalyDetector(callback?: (err: AWSError, data: LookoutMetrics.Types.DescribeAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.DescribeAnomalyDetectorResponse, AWSError>;
  /**
   * Describes a dataset. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  describeMetricSet(params: LookoutMetrics.Types.DescribeMetricSetRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.DescribeMetricSetResponse) => void): Request<LookoutMetrics.Types.DescribeMetricSetResponse, AWSError>;
  /**
   * Describes a dataset. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  describeMetricSet(callback?: (err: AWSError, data: LookoutMetrics.Types.DescribeMetricSetResponse) => void): Request<LookoutMetrics.Types.DescribeMetricSetResponse, AWSError>;
  /**
   * Detects an Amazon S3 dataset's file format, interval, and offset.
   */
  detectMetricSetConfig(params: LookoutMetrics.Types.DetectMetricSetConfigRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.DetectMetricSetConfigResponse) => void): Request<LookoutMetrics.Types.DetectMetricSetConfigResponse, AWSError>;
  /**
   * Detects an Amazon S3 dataset's file format, interval, and offset.
   */
  detectMetricSetConfig(callback?: (err: AWSError, data: LookoutMetrics.Types.DetectMetricSetConfigResponse) => void): Request<LookoutMetrics.Types.DetectMetricSetConfigResponse, AWSError>;
  /**
   * Returns details about a group of anomalous metrics.
   */
  getAnomalyGroup(params: LookoutMetrics.Types.GetAnomalyGroupRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.GetAnomalyGroupResponse) => void): Request<LookoutMetrics.Types.GetAnomalyGroupResponse, AWSError>;
  /**
   * Returns details about a group of anomalous metrics.
   */
  getAnomalyGroup(callback?: (err: AWSError, data: LookoutMetrics.Types.GetAnomalyGroupResponse) => void): Request<LookoutMetrics.Types.GetAnomalyGroupResponse, AWSError>;
  /**
   * Returns details about the requested data quality metrics.
   */
  getDataQualityMetrics(params: LookoutMetrics.Types.GetDataQualityMetricsRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.GetDataQualityMetricsResponse) => void): Request<LookoutMetrics.Types.GetDataQualityMetricsResponse, AWSError>;
  /**
   * Returns details about the requested data quality metrics.
   */
  getDataQualityMetrics(callback?: (err: AWSError, data: LookoutMetrics.Types.GetDataQualityMetricsResponse) => void): Request<LookoutMetrics.Types.GetDataQualityMetricsResponse, AWSError>;
  /**
   * Get feedback for an anomaly group.
   */
  getFeedback(params: LookoutMetrics.Types.GetFeedbackRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.GetFeedbackResponse) => void): Request<LookoutMetrics.Types.GetFeedbackResponse, AWSError>;
  /**
   * Get feedback for an anomaly group.
   */
  getFeedback(callback?: (err: AWSError, data: LookoutMetrics.Types.GetFeedbackResponse) => void): Request<LookoutMetrics.Types.GetFeedbackResponse, AWSError>;
  /**
   * Returns a selection of sample records from an Amazon S3 datasource.
   */
  getSampleData(params: LookoutMetrics.Types.GetSampleDataRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.GetSampleDataResponse) => void): Request<LookoutMetrics.Types.GetSampleDataResponse, AWSError>;
  /**
   * Returns a selection of sample records from an Amazon S3 datasource.
   */
  getSampleData(callback?: (err: AWSError, data: LookoutMetrics.Types.GetSampleDataResponse) => void): Request<LookoutMetrics.Types.GetSampleDataResponse, AWSError>;
  /**
   * Lists the alerts attached to a detector. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  listAlerts(params: LookoutMetrics.Types.ListAlertsRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.ListAlertsResponse) => void): Request<LookoutMetrics.Types.ListAlertsResponse, AWSError>;
  /**
   * Lists the alerts attached to a detector. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  listAlerts(callback?: (err: AWSError, data: LookoutMetrics.Types.ListAlertsResponse) => void): Request<LookoutMetrics.Types.ListAlertsResponse, AWSError>;
  /**
   * Lists the detectors in the current AWS Region. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  listAnomalyDetectors(params: LookoutMetrics.Types.ListAnomalyDetectorsRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.ListAnomalyDetectorsResponse) => void): Request<LookoutMetrics.Types.ListAnomalyDetectorsResponse, AWSError>;
  /**
   * Lists the detectors in the current AWS Region. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  listAnomalyDetectors(callback?: (err: AWSError, data: LookoutMetrics.Types.ListAnomalyDetectorsResponse) => void): Request<LookoutMetrics.Types.ListAnomalyDetectorsResponse, AWSError>;
  /**
   * Returns a list of measures that are potential causes or effects of an anomaly group.
   */
  listAnomalyGroupRelatedMetrics(params: LookoutMetrics.Types.ListAnomalyGroupRelatedMetricsRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.ListAnomalyGroupRelatedMetricsResponse) => void): Request<LookoutMetrics.Types.ListAnomalyGroupRelatedMetricsResponse, AWSError>;
  /**
   * Returns a list of measures that are potential causes or effects of an anomaly group.
   */
  listAnomalyGroupRelatedMetrics(callback?: (err: AWSError, data: LookoutMetrics.Types.ListAnomalyGroupRelatedMetricsResponse) => void): Request<LookoutMetrics.Types.ListAnomalyGroupRelatedMetricsResponse, AWSError>;
  /**
   * Returns a list of anomaly groups.
   */
  listAnomalyGroupSummaries(params: LookoutMetrics.Types.ListAnomalyGroupSummariesRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.ListAnomalyGroupSummariesResponse) => void): Request<LookoutMetrics.Types.ListAnomalyGroupSummariesResponse, AWSError>;
  /**
   * Returns a list of anomaly groups.
   */
  listAnomalyGroupSummaries(callback?: (err: AWSError, data: LookoutMetrics.Types.ListAnomalyGroupSummariesResponse) => void): Request<LookoutMetrics.Types.ListAnomalyGroupSummariesResponse, AWSError>;
  /**
   * Gets a list of anomalous metrics for a measure in an anomaly group.
   */
  listAnomalyGroupTimeSeries(params: LookoutMetrics.Types.ListAnomalyGroupTimeSeriesRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.ListAnomalyGroupTimeSeriesResponse) => void): Request<LookoutMetrics.Types.ListAnomalyGroupTimeSeriesResponse, AWSError>;
  /**
   * Gets a list of anomalous metrics for a measure in an anomaly group.
   */
  listAnomalyGroupTimeSeries(callback?: (err: AWSError, data: LookoutMetrics.Types.ListAnomalyGroupTimeSeriesResponse) => void): Request<LookoutMetrics.Types.ListAnomalyGroupTimeSeriesResponse, AWSError>;
  /**
   * Lists the datasets in the current AWS Region. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  listMetricSets(params: LookoutMetrics.Types.ListMetricSetsRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.ListMetricSetsResponse) => void): Request<LookoutMetrics.Types.ListMetricSetsResponse, AWSError>;
  /**
   * Lists the datasets in the current AWS Region. Amazon Lookout for Metrics API actions are eventually consistent. If you do a read operation on a resource immediately after creating or modifying it, use retries to allow time for the write operation to complete.
   */
  listMetricSets(callback?: (err: AWSError, data: LookoutMetrics.Types.ListMetricSetsResponse) => void): Request<LookoutMetrics.Types.ListMetricSetsResponse, AWSError>;
  /**
   * Gets a list of tags for a detector, dataset, or alert.
   */
  listTagsForResource(params: LookoutMetrics.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.ListTagsForResourceResponse) => void): Request<LookoutMetrics.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Gets a list of tags for a detector, dataset, or alert.
   */
  listTagsForResource(callback?: (err: AWSError, data: LookoutMetrics.Types.ListTagsForResourceResponse) => void): Request<LookoutMetrics.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Add feedback for an anomalous metric.
   */
  putFeedback(params: LookoutMetrics.Types.PutFeedbackRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.PutFeedbackResponse) => void): Request<LookoutMetrics.Types.PutFeedbackResponse, AWSError>;
  /**
   * Add feedback for an anomalous metric.
   */
  putFeedback(callback?: (err: AWSError, data: LookoutMetrics.Types.PutFeedbackResponse) => void): Request<LookoutMetrics.Types.PutFeedbackResponse, AWSError>;
  /**
   * Adds tags to a detector, dataset, or alert.
   */
  tagResource(params: LookoutMetrics.Types.TagResourceRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.TagResourceResponse) => void): Request<LookoutMetrics.Types.TagResourceResponse, AWSError>;
  /**
   * Adds tags to a detector, dataset, or alert.
   */
  tagResource(callback?: (err: AWSError, data: LookoutMetrics.Types.TagResourceResponse) => void): Request<LookoutMetrics.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a detector, dataset, or alert.
   */
  untagResource(params: LookoutMetrics.Types.UntagResourceRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.UntagResourceResponse) => void): Request<LookoutMetrics.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a detector, dataset, or alert.
   */
  untagResource(callback?: (err: AWSError, data: LookoutMetrics.Types.UntagResourceResponse) => void): Request<LookoutMetrics.Types.UntagResourceResponse, AWSError>;
  /**
   * Make changes to an existing alert.
   */
  updateAlert(params: LookoutMetrics.Types.UpdateAlertRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.UpdateAlertResponse) => void): Request<LookoutMetrics.Types.UpdateAlertResponse, AWSError>;
  /**
   * Make changes to an existing alert.
   */
  updateAlert(callback?: (err: AWSError, data: LookoutMetrics.Types.UpdateAlertResponse) => void): Request<LookoutMetrics.Types.UpdateAlertResponse, AWSError>;
  /**
   * Updates a detector. After activation, you can only change a detector's ingestion delay and description.
   */
  updateAnomalyDetector(params: LookoutMetrics.Types.UpdateAnomalyDetectorRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.UpdateAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.UpdateAnomalyDetectorResponse, AWSError>;
  /**
   * Updates a detector. After activation, you can only change a detector's ingestion delay and description.
   */
  updateAnomalyDetector(callback?: (err: AWSError, data: LookoutMetrics.Types.UpdateAnomalyDetectorResponse) => void): Request<LookoutMetrics.Types.UpdateAnomalyDetectorResponse, AWSError>;
  /**
   * Updates a dataset.
   */
  updateMetricSet(params: LookoutMetrics.Types.UpdateMetricSetRequest, callback?: (err: AWSError, data: LookoutMetrics.Types.UpdateMetricSetResponse) => void): Request<LookoutMetrics.Types.UpdateMetricSetResponse, AWSError>;
  /**
   * Updates a dataset.
   */
  updateMetricSet(callback?: (err: AWSError, data: LookoutMetrics.Types.UpdateMetricSetResponse) => void): Request<LookoutMetrics.Types.UpdateMetricSetResponse, AWSError>;
}
declare namespace LookoutMetrics {
  export interface Action {
    /**
     * A configuration for an Amazon SNS channel.
     */
    SNSConfiguration?: SNSConfiguration;
    /**
     * A configuration for an AWS Lambda channel.
     */
    LambdaConfiguration?: LambdaConfiguration;
  }
  export interface ActivateAnomalyDetectorRequest {
    /**
     * The ARN of the anomaly detector.
     */
    AnomalyDetectorArn: Arn;
  }
  export interface ActivateAnomalyDetectorResponse {
  }
  export type AggregationFunction = "AVG"|"SUM"|string;
  export interface Alert {
    /**
     * Action that will be triggered when there is an alert.
     */
    Action?: Action;
    /**
     * A description of the alert.
     */
    AlertDescription?: AlertDescription;
    /**
     * The ARN of the alert.
     */
    AlertArn?: Arn;
    /**
     * The ARN of the detector to which the alert is attached.
     */
    AnomalyDetectorArn?: Arn;
    /**
     * The name of the alert.
     */
    AlertName?: AlertName;
    /**
     * The minimum severity for an anomaly to trigger the alert.
     */
    AlertSensitivityThreshold?: SensitivityThreshold;
    /**
     * The type of the alert.
     */
    AlertType?: AlertType;
    /**
     * The status of the alert.
     */
    AlertStatus?: AlertStatus;
    /**
     * The time at which the alert was last modified.
     */
    LastModificationTime?: Timestamp;
    /**
     * The time at which the alert was created.
     */
    CreationTime?: Timestamp;
    /**
     * The configuration of the alert filters, containing MetricList and DimensionFilter.
     */
    AlertFilters?: AlertFilters;
  }
  export type AlertDescription = string;
  export interface AlertFilters {
    /**
     * The list of measures that you want to get alerts for.
     */
    MetricList?: MetricNameList;
    /**
     * The list of DimensionFilter objects that are used for dimension-based filtering.
     */
    DimensionFilterList?: DimensionFilterList;
  }
  export type AlertName = string;
  export type AlertStatus = "ACTIVE"|"INACTIVE"|string;
  export interface AlertSummary {
    /**
     * The ARN of the alert.
     */
    AlertArn?: Arn;
    /**
     * The ARN of the detector to which the alert is attached.
     */
    AnomalyDetectorArn?: Arn;
    /**
     * The name of the alert.
     */
    AlertName?: AlertName;
    /**
     * The minimum severity for an anomaly to trigger the alert.
     */
    AlertSensitivityThreshold?: SensitivityThreshold;
    /**
     * The type of the alert.
     */
    AlertType?: AlertType;
    /**
     * The status of the alert.
     */
    AlertStatus?: AlertStatus;
    /**
     * The time at which the alert was last modified.
     */
    LastModificationTime?: Timestamp;
    /**
     * The time at which the alert was created.
     */
    CreationTime?: Timestamp;
    /**
     * The alert's tags.
     */
    Tags?: TagMap;
  }
  export type AlertSummaryList = AlertSummary[];
  export type AlertType = "SNS"|"LAMBDA"|string;
  export type AnomalyDetectionTaskStatus = "PENDING"|"IN_PROGRESS"|"COMPLETED"|"FAILED"|"FAILED_TO_SCHEDULE"|string;
  export type AnomalyDetectionTaskStatusMessage = string;
  export interface AnomalyDetectorConfig {
    /**
     * The frequency at which the detector analyzes its source data.
     */
    AnomalyDetectorFrequency?: Frequency;
  }
  export interface AnomalyDetectorConfigSummary {
    /**
     * The interval at which the detector analyzes its source data.
     */
    AnomalyDetectorFrequency?: Frequency;
  }
  export interface AnomalyDetectorDataQualityMetric {
    /**
     * The start time for the data quality metrics collection.
     */
    StartTimestamp?: Timestamp;
    /**
     * An array of DataQualityMetricList objects. Each object in the array contains information about a data quality metric.
     */
    MetricSetDataQualityMetricList?: MetricSetDataQualityMetricList;
  }
  export type AnomalyDetectorDataQualityMetricList = AnomalyDetectorDataQualityMetric[];
  export type AnomalyDetectorDescription = string;
  export type AnomalyDetectorFailureType = "ACTIVATION_FAILURE"|"BACK_TEST_ACTIVATION_FAILURE"|"DELETION_FAILURE"|"DEACTIVATION_FAILURE"|string;
  export type AnomalyDetectorName = string;
  export type AnomalyDetectorStatus = "ACTIVE"|"ACTIVATING"|"DELETING"|"FAILED"|"INACTIVE"|"LEARNING"|"BACK_TEST_ACTIVATING"|"BACK_TEST_ACTIVE"|"BACK_TEST_COMPLETE"|"DEACTIVATED"|"DEACTIVATING"|string;
  export interface AnomalyDetectorSummary {
    /**
     * The ARN of the detector.
     */
    AnomalyDetectorArn?: Arn;
    /**
     * The name of the detector.
     */
    AnomalyDetectorName?: AnomalyDetectorName;
    /**
     * A description of the detector.
     */
    AnomalyDetectorDescription?: AnomalyDetectorDescription;
    /**
     * The time at which the detector was created.
     */
    CreationTime?: Timestamp;
    /**
     * The time at which the detector was last modified.
     */
    LastModificationTime?: Timestamp;
    /**
     * The status of detector.
     */
    Status?: AnomalyDetectorStatus;
    /**
     * The detector's tags.
     */
    Tags?: TagMap;
  }
  export type AnomalyDetectorSummaryList = AnomalyDetectorSummary[];
  export interface AnomalyGroup {
    /**
     * The start time for the group.
     */
    StartTime?: TimestampString;
    /**
     * The end time for the group.
     */
    EndTime?: TimestampString;
    /**
     * The ID of the anomaly group.
     */
    AnomalyGroupId?: UUID;
    /**
     * The severity score of the group.
     */
    AnomalyGroupScore?: Score;
    /**
     * The name of the primary affected measure for the group.
     */
    PrimaryMetricName?: MetricName;
    /**
     * A list of measures affected by the anomaly.
     */
    MetricLevelImpactList?: MetricLevelImpactList;
  }
  export interface AnomalyGroupStatistics {
    /**
     * The start of the time range that was searched.
     */
    EvaluationStartDate?: TimestampString;
    /**
     * The number of groups found.
     */
    TotalCount?: Integer;
    /**
     * Statistics for individual metrics within the group.
     */
    ItemizedMetricStatsList?: ItemizedMetricStatsList;
  }
  export interface AnomalyGroupSummary {
    /**
     * The start time for the group.
     */
    StartTime?: TimestampString;
    /**
     * The end time for the group.
     */
    EndTime?: TimestampString;
    /**
     * The ID of the anomaly group.
     */
    AnomalyGroupId?: UUID;
    /**
     * The severity score of the group.
     */
    AnomalyGroupScore?: Score;
    /**
     * The name of the primary affected measure for the group.
     */
    PrimaryMetricName?: MetricName;
  }
  export type AnomalyGroupSummaryList = AnomalyGroupSummary[];
  export interface AnomalyGroupTimeSeries {
    /**
     * The ID of the anomaly group.
     */
    AnomalyGroupId: UUID;
    /**
     * The ID of the metric.
     */
    TimeSeriesId?: TimeSeriesId;
  }
  export interface AnomalyGroupTimeSeriesFeedback {
    /**
     * The ID of the anomaly group.
     */
    AnomalyGroupId: UUID;
    /**
     * The ID of the metric.
     */
    TimeSeriesId: TimeSeriesId;
    /**
     * Feedback on whether the metric is a legitimate anomaly.
     */
    IsAnomaly: Boolean;
  }
  export interface AppFlowConfig {
    /**
     * An IAM role that gives Amazon Lookout for Metrics permission to access the flow.
     */
    RoleArn?: Arn;
    /**
     *  name of the flow.
     */
    FlowName?: FlowName;
  }
  export type Arn = string;
  export type AthenaDataCatalog = string;
  export type AthenaDatabaseName = string;
  export type AthenaS3ResultsPath = string;
  export interface AthenaSourceConfig {
    /**
     * An IAM role that gives Amazon Lookout for Metrics permission to access the data.
     */
    RoleArn?: Arn;
    /**
     * The database's name.
     */
    DatabaseName?: AthenaDatabaseName;
    /**
     * The database's data catalog.
     */
    DataCatalog?: AthenaDataCatalog;
    /**
     * The database's table name.
     */
    TableName?: AthenaTableName;
    /**
     * The database's work group name.
     */
    WorkGroupName?: AthenaWorkGroupName;
    /**
     * The database's results path.
     */
    S3ResultsPath?: AthenaS3ResultsPath;
    /**
     * Settings for backtest mode.
     */
    BackTestConfiguration?: BackTestConfiguration;
  }
  export type AthenaTableName = string;
  export type AthenaWorkGroupName = string;
  export interface AttributeValue {
    /**
     * A string.
     */
    S?: StringAttributeValue;
    /**
     * A number.
     */
    N?: NumberAttributeValue;
    /**
     * A binary value.
     */
    B?: BinaryAttributeValue;
    /**
     * A list of strings.
     */
    SS?: StringListAttributeValue;
    /**
     * A list of numbers.
     */
    NS?: NumberListAttributeValue;
    /**
     * A list of binary values.
     */
    BS?: BinaryListAttributeValue;
  }
  export interface AutoDetectionMetricSource {
    /**
     * The source's source config.
     */
    S3SourceConfig?: AutoDetectionS3SourceConfig;
  }
  export interface AutoDetectionS3SourceConfig {
    /**
     * The config's templated path list.
     */
    TemplatedPathList?: TemplatedPathList;
    /**
     * The config's historical data path list.
     */
    HistoricalDataPathList?: HistoricalDataPathList;
  }
  export interface BackTestAnomalyDetectorRequest {
    /**
     * The Amazon Resource Name (ARN) of the anomaly detector.
     */
    AnomalyDetectorArn: Arn;
  }
  export interface BackTestAnomalyDetectorResponse {
  }
  export interface BackTestConfiguration {
    /**
     * Run a backtest instead of monitoring new data.
     */
    RunBackTestMode: Boolean;
  }
  export type BinaryAttributeValue = string;
  export type BinaryListAttributeValue = BinaryAttributeValue[];
  export type Boolean = boolean;
  export type CSVFileCompression = "NONE"|"GZIP"|string;
  export type Charset = string;
  export interface CloudWatchConfig {
    /**
     * An IAM role that gives Amazon Lookout for Metrics permission to access data in Amazon CloudWatch.
     */
    RoleArn?: Arn;
    /**
     * Settings for backtest mode.
     */
    BackTestConfiguration?: BackTestConfiguration;
  }
  export type ColumnName = string;
  export type Confidence = "HIGH"|"LOW"|"NONE"|string;
  export interface ContributionMatrix {
    /**
     * A list of contributing dimensions.
     */
    DimensionContributionList?: DimensionContributionList;
  }
  export interface CreateAlertRequest {
    /**
     * The name of the alert.
     */
    AlertName: AlertName;
    /**
     * An integer from 0 to 100 specifying the alert sensitivity threshold.
     */
    AlertSensitivityThreshold?: SensitivityThreshold;
    /**
     * A description of the alert.
     */
    AlertDescription?: AlertDescription;
    /**
     * The ARN of the detector to which the alert is attached.
     */
    AnomalyDetectorArn: Arn;
    /**
     * Action that will be triggered when there is an alert.
     */
    Action: Action;
    /**
     * A list of tags to apply to the alert.
     */
    Tags?: TagMap;
    /**
     * The configuration of the alert filters, containing MetricList and DimensionFilterList.
     */
    AlertFilters?: AlertFilters;
  }
  export interface CreateAlertResponse {
    /**
     * The ARN of the alert.
     */
    AlertArn?: Arn;
  }
  export interface CreateAnomalyDetectorRequest {
    /**
     * The name of the detector.
     */
    AnomalyDetectorName: AnomalyDetectorName;
    /**
     * A description of the detector.
     */
    AnomalyDetectorDescription?: AnomalyDetectorDescription;
    /**
     * Contains information about the configuration of the anomaly detector.
     */
    AnomalyDetectorConfig: AnomalyDetectorConfig;
    /**
     * The ARN of the KMS key to use to encrypt your data.
     */
    KmsKeyArn?: KmsKeyArn;
    /**
     * A list of tags to apply to the anomaly detector.
     */
    Tags?: TagMap;
  }
  export interface CreateAnomalyDetectorResponse {
    /**
     * The ARN of the detector.
     */
    AnomalyDetectorArn?: Arn;
  }
  export interface CreateMetricSetRequest {
    /**
     * The ARN of the anomaly detector that will use the dataset.
     */
    AnomalyDetectorArn: Arn;
    /**
     * The name of the dataset.
     */
    MetricSetName: MetricSetName;
    /**
     * A description of the dataset you are creating.
     */
    MetricSetDescription?: MetricSetDescription;
    /**
     * A list of metrics that the dataset will contain.
     */
    MetricList: MetricList;
    /**
     * After an interval ends, the amount of seconds that the detector waits before importing data. Offset is only supported for S3, Redshift, Athena and datasources.
     */
    Offset?: Offset;
    /**
     * Contains information about the column used for tracking time in your source data.
     */
    TimestampColumn?: TimestampColumn;
    /**
     * A list of the fields you want to treat as dimensions.
     */
    DimensionList?: DimensionList;
    /**
     * The frequency with which the source data will be analyzed for anomalies.
     */
    MetricSetFrequency?: Frequency;
    /**
     * Contains information about how the source data should be interpreted.
     */
    MetricSource: MetricSource;
    /**
     * The time zone in which your source data was recorded.
     */
    Timezone?: Timezone;
    /**
     * A list of tags to apply to the dataset.
     */
    Tags?: TagMap;
    /**
     * A list of filters that specify which data is kept for anomaly detection.
     */
    DimensionFilterList?: MetricSetDimensionFilterList;
  }
  export interface CreateMetricSetResponse {
    /**
     * The ARN of the dataset.
     */
    MetricSetArn?: Arn;
  }
  export interface CsvFormatDescriptor {
    /**
     * The level of compression of the source CSV file.
     */
    FileCompression?: CSVFileCompression;
    /**
     * The character set in which the source CSV file is written.
     */
    Charset?: Charset;
    /**
     * Whether or not the source CSV file contains a header.
     */
    ContainsHeader?: Boolean;
    /**
     * The character used to delimit the source CSV file.
     */
    Delimiter?: Delimiter;
    /**
     * A list of the source CSV file's headers, if any.
     */
    HeaderList?: HeaderList;
    /**
     * The character used as a quote character.
     */
    QuoteSymbol?: QuoteSymbol;
  }
  export type DataItem = string;
  export interface DataQualityMetric {
    /**
     * The name of the data quality metric.
     */
    MetricType?: DataQualityMetricType;
    /**
     * A description of the data quality metric.
     */
    MetricDescription?: DataQualityMetricDescription;
    /**
     * The column that is being monitored.
     */
    RelatedColumnName?: RelatedColumnName;
    /**
     * The value of the data quality metric.
     */
    MetricValue?: Double;
  }
  export type DataQualityMetricDescription = string;
  export type DataQualityMetricList = DataQualityMetric[];
  export type DataQualityMetricType = "COLUMN_COMPLETENESS"|"DIMENSION_UNIQUENESS"|"TIME_SERIES_COUNT"|"ROWS_PROCESSED"|"ROWS_PARTIAL_COMPLIANCE"|"INVALID_ROWS_COMPLIANCE"|"BACKTEST_TRAINING_DATA_START_TIME_STAMP"|"BACKTEST_TRAINING_DATA_END_TIME_STAMP"|"BACKTEST_INFERENCE_DATA_START_TIME_STAMP"|"BACKTEST_INFERENCE_DATA_END_TIME_STAMP"|string;
  export type DatabaseHost = string;
  export type DatabasePort = number;
  export type DateTimeFormat = string;
  export interface DeactivateAnomalyDetectorRequest {
    /**
     * The Amazon Resource Name (ARN) of the anomaly detector.
     */
    AnomalyDetectorArn: Arn;
  }
  export interface DeactivateAnomalyDetectorResponse {
  }
  export interface DeleteAlertRequest {
    /**
     * The ARN of the alert to delete.
     */
    AlertArn: Arn;
  }
  export interface DeleteAlertResponse {
  }
  export interface DeleteAnomalyDetectorRequest {
    /**
     * The ARN of the detector to delete.
     */
    AnomalyDetectorArn: Arn;
  }
  export interface DeleteAnomalyDetectorResponse {
  }
  export type Delimiter = string;
  export interface DescribeAlertRequest {
    /**
     * The ARN of the alert to describe.
     */
    AlertArn: Arn;
  }
  export interface DescribeAlertResponse {
    /**
     * Contains information about an alert.
     */
    Alert?: Alert;
  }
  export interface DescribeAnomalyDetectionExecutionsRequest {
    /**
     * The Amazon Resource Name (ARN) of the anomaly detector.
     */
    AnomalyDetectorArn: Arn;
    /**
     * The timestamp of the anomaly detection job.
     */
    Timestamp?: TimestampString;
    /**
     * The number of items to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeAnomalyDetectionExecutionsResponse {
    /**
     * A list of detection jobs.
     */
    ExecutionList?: ExecutionList;
    /**
     * The pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
  }
  export interface DescribeAnomalyDetectorRequest {
    /**
     * The ARN of the detector to describe.
     */
    AnomalyDetectorArn: Arn;
  }
  export interface DescribeAnomalyDetectorResponse {
    /**
     * The ARN of the detector.
     */
    AnomalyDetectorArn?: Arn;
    /**
     * The name of the detector.
     */
    AnomalyDetectorName?: AnomalyDetectorName;
    /**
     * A description of the detector.
     */
    AnomalyDetectorDescription?: AnomalyDetectorDescription;
    /**
     * Contains information about the detector's configuration.
     */
    AnomalyDetectorConfig?: AnomalyDetectorConfigSummary;
    /**
     * The time at which the detector was created.
     */
    CreationTime?: Timestamp;
    /**
     * The time at which the detector was last modified.
     */
    LastModificationTime?: Timestamp;
    /**
     * The status of the detector.
     */
    Status?: AnomalyDetectorStatus;
    /**
     * The reason that the detector failed.
     */
    FailureReason?: ErrorMessage;
    /**
     * The ARN of the KMS key to use to encrypt your data.
     */
    KmsKeyArn?: KmsKeyArn;
    /**
     * The process that caused the detector to fail.
     */
    FailureType?: AnomalyDetectorFailureType;
  }
  export interface DescribeMetricSetRequest {
    /**
     * The ARN of the dataset.
     */
    MetricSetArn: Arn;
  }
  export interface DescribeMetricSetResponse {
    /**
     * The ARN of the dataset.
     */
    MetricSetArn?: Arn;
    /**
     * The ARN of the detector that contains the dataset.
     */
    AnomalyDetectorArn?: Arn;
    /**
     * The name of the dataset.
     */
    MetricSetName?: MetricSetName;
    /**
     * The dataset's description.
     */
    MetricSetDescription?: MetricSetDescription;
    /**
     * The time at which the dataset was created.
     */
    CreationTime?: Timestamp;
    /**
     * The time at which the dataset was last modified.
     */
    LastModificationTime?: Timestamp;
    /**
     * After an interval ends, the amount of seconds that the detector waits before importing data. Offset is only supported for S3, Redshift, Athena and datasources.
     */
    Offset?: Offset;
    /**
     * A list of the metrics defined by the dataset.
     */
    MetricList?: MetricList;
    /**
     * Contains information about the column used for tracking time in your source data.
     */
    TimestampColumn?: TimestampColumn;
    /**
     * A list of the dimensions chosen for analysis.
     */
    DimensionList?: DimensionList;
    /**
     * The interval at which the data will be analyzed for anomalies.
     */
    MetricSetFrequency?: Frequency;
    /**
     * The time zone in which the dataset's data was recorded.
     */
    Timezone?: Timezone;
    /**
     * Contains information about the dataset's source data.
     */
    MetricSource?: MetricSource;
    /**
     * The dimensions and their values that were used to filter the dataset.
     */
    DimensionFilterList?: MetricSetDimensionFilterList;
  }
  export interface DetectMetricSetConfigRequest {
    /**
     * An anomaly detector ARN.
     */
    AnomalyDetectorArn: Arn;
    /**
     * A data source.
     */
    AutoDetectionMetricSource: AutoDetectionMetricSource;
  }
  export interface DetectMetricSetConfigResponse {
    /**
     * The inferred dataset configuration for the datasource.
     */
    DetectedMetricSetConfig?: DetectedMetricSetConfig;
  }
  export interface DetectedCsvFormatDescriptor {
    /**
     * The format's file compression.
     */
    FileCompression?: DetectedField;
    /**
     * The format's charset.
     */
    Charset?: DetectedField;
    /**
     * Whether the format includes a header.
     */
    ContainsHeader?: DetectedField;
    /**
     * The format's delimiter.
     */
    Delimiter?: DetectedField;
    /**
     * The format's header list.
     */
    HeaderList?: DetectedField;
    /**
     * The format's quote symbol.
     */
    QuoteSymbol?: DetectedField;
  }
  export interface DetectedField {
    /**
     * The field's value.
     */
    Value?: AttributeValue;
    /**
     * The field's confidence.
     */
    Confidence?: Confidence;
    /**
     * The field's message.
     */
    Message?: Message;
  }
  export interface DetectedFileFormatDescriptor {
    /**
     * Details about a CSV format.
     */
    CsvFormatDescriptor?: DetectedCsvFormatDescriptor;
    /**
     * Details about a JSON format.
     */
    JsonFormatDescriptor?: DetectedJsonFormatDescriptor;
  }
  export interface DetectedJsonFormatDescriptor {
    /**
     * The format's file compression.
     */
    FileCompression?: DetectedField;
    /**
     * The format's character set.
     */
    Charset?: DetectedField;
  }
  export interface DetectedMetricSetConfig {
    /**
     * The dataset's offset.
     */
    Offset?: DetectedField;
    /**
     * The dataset's interval.
     */
    MetricSetFrequency?: DetectedField;
    /**
     * The dataset's data source.
     */
    MetricSource?: DetectedMetricSource;
  }
  export interface DetectedMetricSource {
    /**
     * The data source's source configuration.
     */
    S3SourceConfig?: DetectedS3SourceConfig;
  }
  export interface DetectedS3SourceConfig {
    /**
     * The source's file format descriptor.
     */
    FileFormatDescriptor?: DetectedFileFormatDescriptor;
  }
  export interface DimensionContribution {
    /**
     * The name of the dimension.
     */
    DimensionName?: ColumnName;
    /**
     * A list of dimension values that contributed to the anomaly.
     */
    DimensionValueContributionList?: DimensionValueContributionList;
  }
  export type DimensionContributionList = DimensionContribution[];
  export interface DimensionFilter {
    /**
     * The name of the dimension to filter on.
     */
    DimensionName?: ColumnName;
    /**
     * The list of values for the dimension specified in DimensionName that you want to filter on.
     */
    DimensionValueList?: DimensionValueList;
  }
  export type DimensionFilterList = DimensionFilter[];
  export type DimensionList = ColumnName[];
  export interface DimensionNameValue {
    /**
     * The name of the dimension.
     */
    DimensionName: ColumnName;
    /**
     * The value of the dimension.
     */
    DimensionValue: DimensionValue;
  }
  export type DimensionNameValueList = DimensionNameValue[];
  export type DimensionValue = string;
  export interface DimensionValueContribution {
    /**
     * The value of the dimension.
     */
    DimensionValue?: DimensionValue;
    /**
     * The severity score of the value.
     */
    ContributionScore?: Score;
  }
  export type DimensionValueContributionList = DimensionValueContribution[];
  export type DimensionValueList = DimensionValue[];
  export type Double = number;
  export type ErrorMessage = string;
  export type ExecutionList = ExecutionStatus[];
  export interface ExecutionStatus {
    /**
     * The run's timestamp.
     */
    Timestamp?: TimestampString;
    /**
     * The run's status.
     */
    Status?: AnomalyDetectionTaskStatus;
    /**
     * The reason that the run failed, if applicable.
     */
    FailureReason?: AnomalyDetectionTaskStatusMessage;
  }
  export interface FileFormatDescriptor {
    /**
     * Contains information about how a source CSV data file should be analyzed.
     */
    CsvFormatDescriptor?: CsvFormatDescriptor;
    /**
     * Contains information about how a source JSON data file should be analyzed.
     */
    JsonFormatDescriptor?: JsonFormatDescriptor;
  }
  export interface Filter {
    /**
     * The value that you want to include in the filter.
     */
    DimensionValue?: DimensionValue;
    /**
     * The condition to apply.
     */
    FilterOperation?: FilterOperation;
  }
  export type FilterList = Filter[];
  export type FilterOperation = "EQUALS"|string;
  export type FlowName = string;
  export type Frequency = "P1D"|"PT1H"|"PT10M"|"PT5M"|string;
  export interface GetAnomalyGroupRequest {
    /**
     * The ID of the anomaly group.
     */
    AnomalyGroupId: UUID;
    /**
     * The Amazon Resource Name (ARN) of the anomaly detector.
     */
    AnomalyDetectorArn: Arn;
  }
  export interface GetAnomalyGroupResponse {
    /**
     * Details about the anomaly group.
     */
    AnomalyGroup?: AnomalyGroup;
  }
  export interface GetDataQualityMetricsRequest {
    /**
     * The Amazon Resource Name (ARN) of the anomaly detector that you want to investigate.
     */
    AnomalyDetectorArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of a specific data quality metric set.
     */
    MetricSetArn?: Arn;
  }
  export interface GetDataQualityMetricsResponse {
    /**
     * A list of the data quality metrics for the AnomalyDetectorArn that you requested.
     */
    AnomalyDetectorDataQualityMetricList?: AnomalyDetectorDataQualityMetricList;
  }
  export interface GetFeedbackRequest {
    /**
     * The Amazon Resource Name (ARN) of the anomaly detector.
     */
    AnomalyDetectorArn: Arn;
    /**
     * The anomalous metric and group ID.
     */
    AnomalyGroupTimeSeriesFeedback: AnomalyGroupTimeSeries;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface GetFeedbackResponse {
    /**
     * Feedback for an anomalous metric.
     */
    AnomalyGroupTimeSeriesFeedback?: TimeSeriesFeedbackList;
    /**
     * The pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
  }
  export interface GetSampleDataRequest {
    /**
     * A datasource bucket in Amazon S3.
     */
    S3SourceConfig?: SampleDataS3SourceConfig;
  }
  export interface GetSampleDataResponse {
    /**
     * A list of header labels for the records.
     */
    HeaderValues?: HeaderValueList;
    /**
     * A list of records.
     */
    SampleRows?: SampleRows;
  }
  export type HeaderList = ColumnName[];
  export type HeaderValue = string;
  export type HeaderValueList = HeaderValue[];
  export type HistoricalDataPath = string;
  export type HistoricalDataPathList = HistoricalDataPath[];
  export type Integer = number;
  export interface InterMetricImpactDetails {
    /**
     * The name of the measure.
     */
    MetricName?: MetricName;
    /**
     * The ID of the anomaly group.
     */
    AnomalyGroupId?: UUID;
    /**
     * Whether a measure is a potential cause of the anomaly group (CAUSE_OF_INPUT_ANOMALY_GROUP), or whether the measure is impacted by the anomaly group (EFFECT_OF_INPUT_ANOMALY_GROUP).
     */
    RelationshipType?: RelationshipType;
    /**
     * For potential causes (CAUSE_OF_INPUT_ANOMALY_GROUP), the percentage contribution the measure has in causing the anomalies.
     */
    ContributionPercentage?: MetricChangePercentage;
  }
  export type InterMetricImpactList = InterMetricImpactDetails[];
  export interface ItemizedMetricStats {
    /**
     * The name of the measure.
     */
    MetricName?: ColumnName;
    /**
     * The number of times that the measure appears.
     */
    OccurrenceCount?: Integer;
  }
  export type ItemizedMetricStatsList = ItemizedMetricStats[];
  export type JsonFileCompression = "NONE"|"GZIP"|string;
  export interface JsonFormatDescriptor {
    /**
     * The level of compression of the source CSV file.
     */
    FileCompression?: JsonFileCompression;
    /**
     * The character set in which the source JSON file is written.
     */
    Charset?: Charset;
  }
  export type KmsKeyArn = string;
  export interface LambdaConfiguration {
    /**
     * The ARN of an IAM role that has permission to invoke the Lambda function.
     */
    RoleArn: Arn;
    /**
     * The ARN of the Lambda function.
     */
    LambdaArn: Arn;
  }
  export interface ListAlertsRequest {
    /**
     * The ARN of the alert's detector.
     */
    AnomalyDetectorArn?: Arn;
    /**
     * If the result of the previous request is truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results that will be displayed by the request.
     */
    MaxResults?: MaxResults;
  }
  export interface ListAlertsResponse {
    /**
     * Contains information about an alert.
     */
    AlertSummaryList?: AlertSummaryList;
    /**
     * If the response is truncated, the service returns this token. To retrieve the next set of results, use this token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListAnomalyDetectorsRequest {
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
  }
  export interface ListAnomalyDetectorsResponse {
    /**
     * A list of anomaly detectors in the account in the current region.
     */
    AnomalyDetectorSummaryList?: AnomalyDetectorSummaryList;
    /**
     * If the response is truncated, the service returns this token. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListAnomalyGroupRelatedMetricsRequest {
    /**
     * The Amazon Resource Name (ARN) of the anomaly detector.
     */
    AnomalyDetectorArn: Arn;
    /**
     * The ID of the anomaly group.
     */
    AnomalyGroupId: UUID;
    /**
     * Filter for potential causes (CAUSE_OF_INPUT_ANOMALY_GROUP) or downstream effects (EFFECT_OF_INPUT_ANOMALY_GROUP) of the anomaly group.
     */
    RelationshipTypeFilter?: RelationshipType;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListAnomalyGroupRelatedMetricsResponse {
    /**
     * Aggregated details about the measures contributing to the anomaly group, and the measures potentially impacted by the anomaly group.
     */
    InterMetricImpactList?: InterMetricImpactList;
    /**
     * The pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
  }
  export interface ListAnomalyGroupSummariesRequest {
    /**
     * The Amazon Resource Name (ARN) of the anomaly detector.
     */
    AnomalyDetectorArn: Arn;
    /**
     * The minimum severity score for inclusion in the output.
     */
    SensitivityThreshold: SensitivityThreshold;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListAnomalyGroupSummariesResponse {
    /**
     * A list of anomaly group summaries.
     */
    AnomalyGroupSummaryList?: AnomalyGroupSummaryList;
    /**
     * Aggregated details about the anomaly groups.
     */
    AnomalyGroupStatistics?: AnomalyGroupStatistics;
    /**
     * The pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
  }
  export interface ListAnomalyGroupTimeSeriesRequest {
    /**
     * The Amazon Resource Name (ARN) of the anomaly detector.
     */
    AnomalyDetectorArn: Arn;
    /**
     * The ID of the anomaly group.
     */
    AnomalyGroupId: UUID;
    /**
     * The name of the measure field.
     */
    MetricName: MetricName;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * Specify the pagination token that's returned by a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListAnomalyGroupTimeSeriesResponse {
    /**
     * The ID of the anomaly group.
     */
    AnomalyGroupId?: UUID;
    /**
     * The name of the measure field.
     */
    MetricName?: MetricName;
    /**
     * Timestamps for the anomalous metrics.
     */
    TimestampList?: TimestampList;
    /**
     * The pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
    /**
     * A list of anomalous metrics.
     */
    TimeSeriesList?: TimeSeriesList;
  }
  export interface ListMetricSetsRequest {
    /**
     * The ARN of the anomaly detector containing the metrics sets to list.
     */
    AnomalyDetectorArn?: Arn;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * If the result of the previous request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request. Tokens expire after 24 hours.
     */
    NextToken?: NextToken;
  }
  export interface ListMetricSetsResponse {
    /**
     * A list of the datasets in the AWS Region, with configuration details for each.
     */
    MetricSetSummaryList?: MetricSetSummaryList;
    /**
     * If the response is truncated, the list call returns this token. To retrieve the next set of results, use the token in the next list request. 
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The resource's Amazon Resource Name (ARN).
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The resource's tags.
     */
    Tags?: TagMap;
  }
  export type MaxResults = number;
  export type Message = string;
  export interface Metric {
    /**
     * The name of the metric.
     */
    MetricName: ColumnName;
    /**
     * The function with which the metric is calculated.
     */
    AggregationFunction: AggregationFunction;
    /**
     * The namespace for the metric.
     */
    Namespace?: Namespace;
  }
  export type MetricChangePercentage = number;
  export interface MetricLevelImpact {
    /**
     * The name of the measure.
     */
    MetricName?: MetricName;
    /**
     * The number of anomalous metrics for the measure.
     */
    NumTimeSeries?: Integer;
    /**
     * Details about the dimensions that contributed to the anomaly.
     */
    ContributionMatrix?: ContributionMatrix;
  }
  export type MetricLevelImpactList = MetricLevelImpact[];
  export type MetricList = Metric[];
  export type MetricName = string;
  export type MetricNameList = MetricName[];
  export interface MetricSetDataQualityMetric {
    /**
     * The Amazon Resource Name (ARN) of the data quality metric array.
     */
    MetricSetArn?: Arn;
    /**
     * The array of data quality metrics contained in the data quality metric set.
     */
    DataQualityMetricList?: DataQualityMetricList;
  }
  export type MetricSetDataQualityMetricList = MetricSetDataQualityMetric[];
  export type MetricSetDescription = string;
  export interface MetricSetDimensionFilter {
    /**
     * The dimension that you want to filter on.
     */
    Name?: ColumnName;
    /**
     * The list of filters that you are applying.
     */
    FilterList?: FilterList;
  }
  export type MetricSetDimensionFilterList = MetricSetDimensionFilter[];
  export type MetricSetName = string;
  export interface MetricSetSummary {
    /**
     * The ARN of the dataset.
     */
    MetricSetArn?: Arn;
    /**
     * The ARN of the detector to which the dataset belongs.
     */
    AnomalyDetectorArn?: Arn;
    /**
     * The description of the dataset.
     */
    MetricSetDescription?: MetricSetDescription;
    /**
     * The name of the dataset.
     */
    MetricSetName?: MetricSetName;
    /**
     * The time at which the dataset was created.
     */
    CreationTime?: Timestamp;
    /**
     * The time at which the dataset was last modified.
     */
    LastModificationTime?: Timestamp;
    /**
     * The dataset's tags.
     */
    Tags?: TagMap;
  }
  export type MetricSetSummaryList = MetricSetSummary[];
  export interface MetricSource {
    S3SourceConfig?: S3SourceConfig;
    /**
     * Details about an AppFlow datasource.
     */
    AppFlowConfig?: AppFlowConfig;
    /**
     * Details about an Amazon CloudWatch monitoring datasource.
     */
    CloudWatchConfig?: CloudWatchConfig;
    /**
     * Details about an Amazon Relational Database Service (RDS) datasource.
     */
    RDSSourceConfig?: RDSSourceConfig;
    /**
     * Details about an Amazon Redshift database datasource.
     */
    RedshiftSourceConfig?: RedshiftSourceConfig;
    /**
     * Details about an Amazon Athena datasource.
     */
    AthenaSourceConfig?: AthenaSourceConfig;
  }
  export type MetricValue = number;
  export type MetricValueList = MetricValue[];
  export type Namespace = string;
  export type NextToken = string;
  export type NumberAttributeValue = string;
  export type NumberListAttributeValue = NumberAttributeValue[];
  export type Offset = number;
  export type PoirotSecretManagerArn = string;
  export interface PutFeedbackRequest {
    /**
     * The Amazon Resource Name (ARN) of the anomaly detector.
     */
    AnomalyDetectorArn: Arn;
    /**
     * Feedback for an anomalous metric.
     */
    AnomalyGroupTimeSeriesFeedback: AnomalyGroupTimeSeriesFeedback;
  }
  export interface PutFeedbackResponse {
  }
  export type QuoteSymbol = string;
  export type RDSDatabaseIdentifier = string;
  export type RDSDatabaseName = string;
  export interface RDSSourceConfig {
    /**
     * A string identifying the database instance.
     */
    DBInstanceIdentifier?: RDSDatabaseIdentifier;
    /**
     * The host name of the database.
     */
    DatabaseHost?: DatabaseHost;
    /**
     * The port number where the database can be accessed.
     */
    DatabasePort?: DatabasePort;
    /**
     * The Amazon Resource Name (ARN) of the AWS Secrets Manager role.
     */
    SecretManagerArn?: PoirotSecretManagerArn;
    /**
     * The name of the RDS database.
     */
    DatabaseName?: RDSDatabaseName;
    /**
     * The name of the table in the database.
     */
    TableName?: TableName;
    /**
     * The Amazon Resource Name (ARN) of the role.
     */
    RoleArn?: Arn;
    /**
     * An object containing information about the Amazon Virtual Private Cloud (VPC) configuration.
     */
    VpcConfiguration?: VpcConfiguration;
  }
  export type RedshiftClusterIdentifier = string;
  export type RedshiftDatabaseName = string;
  export interface RedshiftSourceConfig {
    /**
     * A string identifying the Redshift cluster.
     */
    ClusterIdentifier?: RedshiftClusterIdentifier;
    /**
     * The name of the database host.
     */
    DatabaseHost?: DatabaseHost;
    /**
     * The port number where the database can be accessed.
     */
    DatabasePort?: DatabasePort;
    /**
     * The Amazon Resource Name (ARN) of the AWS Secrets Manager role.
     */
    SecretManagerArn?: PoirotSecretManagerArn;
    /**
     * The Redshift database name.
     */
    DatabaseName?: RedshiftDatabaseName;
    /**
     * The table name of the Redshift database.
     */
    TableName?: TableName;
    /**
     * The Amazon Resource Name (ARN) of the role providing access to the database.
     */
    RoleArn?: Arn;
    /**
     * Contains information about the Amazon Virtual Private Cloud (VPC) configuration.
     */
    VpcConfiguration?: VpcConfiguration;
  }
  export type RelatedColumnName = string;
  export type RelationshipType = "CAUSE_OF_INPUT_ANOMALY_GROUP"|"EFFECT_OF_INPUT_ANOMALY_GROUP"|string;
  export interface S3SourceConfig {
    /**
     * The ARN of an IAM role that has read and write access permissions to the source S3 bucket.
     */
    RoleArn?: Arn;
    /**
     * A list of templated paths to the source files.
     */
    TemplatedPathList?: TemplatedPathList;
    /**
     * A list of paths to the historical data files.
     */
    HistoricalDataPathList?: HistoricalDataPathList;
    /**
     * Contains information about a source file's formatting.
     */
    FileFormatDescriptor?: FileFormatDescriptor;
  }
  export interface SNSConfiguration {
    /**
     * The ARN of the IAM role that has access to the target SNS topic.
     */
    RoleArn: Arn;
    /**
     * The ARN of the target SNS topic.
     */
    SnsTopicArn: Arn;
    /**
     * The format of the SNS topic.    JSON – Send JSON alerts with an anomaly ID and a link to the anomaly detail page. This is the default.    LONG_TEXT – Send human-readable alerts with information about the impacted timeseries and a link to the anomaly detail page. We recommend this for email.    SHORT_TEXT – Send human-readable alerts with a link to the anomaly detail page. We recommend this for SMS.  
     */
    SnsFormat?: SnsFormat;
  }
  export interface SampleDataS3SourceConfig {
    /**
     * The Amazon Resource Name (ARN) of the role.
     */
    RoleArn: Arn;
    /**
     * An array of strings containing the list of templated paths.
     */
    TemplatedPathList?: TemplatedPathList;
    /**
     * An array of strings containing the historical set of data paths.
     */
    HistoricalDataPathList?: HistoricalDataPathList;
    FileFormatDescriptor: FileFormatDescriptor;
  }
  export type SampleRow = DataItem[];
  export type SampleRows = SampleRow[];
  export type Score = number;
  export type SecurityGroupId = string;
  export type SecurityGroupIdList = SecurityGroupId[];
  export type SensitivityThreshold = number;
  export type SnsFormat = "LONG_TEXT"|"SHORT_TEXT"|"JSON"|string;
  export type StringAttributeValue = string;
  export type StringListAttributeValue = StringAttributeValue[];
  export type SubnetId = string;
  export type SubnetIdList = SubnetId[];
  export type TableName = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The resource's Amazon Resource Name (ARN).
     */
    ResourceArn: Arn;
    /**
     * Tags to apply to the resource. Tag keys and values can contain letters, numbers, spaces, and the following symbols: _.:/=+@- 
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TemplatedPath = string;
  export type TemplatedPathList = TemplatedPath[];
  export interface TimeSeries {
    /**
     * The ID of the metric.
     */
    TimeSeriesId: TimeSeriesId;
    /**
     * The dimensions of the metric.
     */
    DimensionList: DimensionNameValueList;
    /**
     * The values for the metric.
     */
    MetricValueList: MetricValueList;
  }
  export interface TimeSeriesFeedback {
    /**
     * The ID of the metric.
     */
    TimeSeriesId?: TimeSeriesId;
    /**
     * Feedback on whether the metric is a legitimate anomaly.
     */
    IsAnomaly?: Boolean;
  }
  export type TimeSeriesFeedbackList = TimeSeriesFeedback[];
  export type TimeSeriesId = string;
  export type TimeSeriesList = TimeSeries[];
  export type Timestamp = Date;
  export interface TimestampColumn {
    /**
     * The name of the timestamp column.
     */
    ColumnName?: ColumnName;
    /**
     * The format of the timestamp column.
     */
    ColumnFormat?: DateTimeFormat;
  }
  export type TimestampList = TimestampString[];
  export type TimestampString = string;
  export type Timezone = string;
  export type UUID = string;
  export interface UntagResourceRequest {
    /**
     * The resource's Amazon Resource Name (ARN).
     */
    ResourceArn: Arn;
    /**
     * Keys to remove from the resource's tags.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAlertRequest {
    /**
     * The ARN of the alert to update.
     */
    AlertArn: Arn;
    /**
     * A description of the alert.
     */
    AlertDescription?: AlertDescription;
    /**
     * An integer from 0 to 100 specifying the alert sensitivity threshold.
     */
    AlertSensitivityThreshold?: SensitivityThreshold;
    /**
     * Action that will be triggered when there is an alert.
     */
    Action?: Action;
    /**
     * The configuration of the alert filters, containing MetricList and DimensionFilterList.
     */
    AlertFilters?: AlertFilters;
  }
  export interface UpdateAlertResponse {
    /**
     * The ARN of the updated alert.
     */
    AlertArn?: Arn;
  }
  export interface UpdateAnomalyDetectorRequest {
    /**
     * The ARN of the detector to update.
     */
    AnomalyDetectorArn: Arn;
    /**
     * The Amazon Resource Name (ARN) of an AWS KMS encryption key.
     */
    KmsKeyArn?: KmsKeyArn;
    /**
     * The updated detector description.
     */
    AnomalyDetectorDescription?: AnomalyDetectorDescription;
    /**
     * Contains information about the configuration to which the detector will be updated.
     */
    AnomalyDetectorConfig?: AnomalyDetectorConfig;
  }
  export interface UpdateAnomalyDetectorResponse {
    /**
     * The ARN of the updated detector.
     */
    AnomalyDetectorArn?: Arn;
  }
  export interface UpdateMetricSetRequest {
    /**
     * The ARN of the dataset to update.
     */
    MetricSetArn: Arn;
    /**
     * The dataset's description.
     */
    MetricSetDescription?: MetricSetDescription;
    /**
     * The metric list.
     */
    MetricList?: MetricList;
    /**
     * After an interval ends, the amount of seconds that the detector waits before importing data. Offset is only supported for S3, Redshift, Athena and datasources.
     */
    Offset?: Offset;
    /**
     * The timestamp column.
     */
    TimestampColumn?: TimestampColumn;
    /**
     * The dimension list.
     */
    DimensionList?: DimensionList;
    /**
     * The dataset's interval.
     */
    MetricSetFrequency?: Frequency;
    MetricSource?: MetricSource;
    /**
     * Describes a list of filters for choosing specific dimensions and specific values. Each filter consists of the dimension and one of its values that you want to include. When multiple dimensions or values are specified, the dimensions are joined with an AND operation and the values are joined with an OR operation.
     */
    DimensionFilterList?: MetricSetDimensionFilterList;
  }
  export interface UpdateMetricSetResponse {
    /**
     * The ARN of the dataset.
     */
    MetricSetArn?: Arn;
  }
  export interface VpcConfiguration {
    /**
     * An array of strings containing the Amazon VPC subnet IDs (e.g., subnet-0bb1c79de3EXAMPLE.
     */
    SubnetIdList: SubnetIdList;
    /**
     * An array of strings containing the list of security groups.
     */
    SecurityGroupIdList: SecurityGroupIdList;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-07-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the LookoutMetrics client.
   */
  export import Types = LookoutMetrics;
}
export = LookoutMetrics;
