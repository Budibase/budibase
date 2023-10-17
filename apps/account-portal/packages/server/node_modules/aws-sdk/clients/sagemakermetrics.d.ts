import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SageMakerMetrics extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SageMakerMetrics.Types.ClientConfiguration)
  config: Config & SageMakerMetrics.Types.ClientConfiguration;
  /**
   * Used to ingest training metrics into SageMaker. These metrics can be visualized in SageMaker Studio and retrieved with the GetMetrics API. 
   */
  batchPutMetrics(params: SageMakerMetrics.Types.BatchPutMetricsRequest, callback?: (err: AWSError, data: SageMakerMetrics.Types.BatchPutMetricsResponse) => void): Request<SageMakerMetrics.Types.BatchPutMetricsResponse, AWSError>;
  /**
   * Used to ingest training metrics into SageMaker. These metrics can be visualized in SageMaker Studio and retrieved with the GetMetrics API. 
   */
  batchPutMetrics(callback?: (err: AWSError, data: SageMakerMetrics.Types.BatchPutMetricsResponse) => void): Request<SageMakerMetrics.Types.BatchPutMetricsResponse, AWSError>;
}
declare namespace SageMakerMetrics {
  export interface BatchPutMetricsError {
    /**
     * The error code of an error that occured when attempting to put metrics.    METRIC_LIMIT_EXCEEDED: The maximum amount of metrics per resource is exceeded.    INTERNAL_ERROR: An internal error occured.    VALIDATION_ERROR: The metric data failed validation.    CONFLICT_ERROR: Multiple requests attempted to modify the same data simultaneously.  
     */
    Code?: PutMetricsErrorCode;
    /**
     * An index that corresponds to the metric in the request.
     */
    MetricIndex?: Integer;
  }
  export type BatchPutMetricsErrorList = BatchPutMetricsError[];
  export interface BatchPutMetricsRequest {
    /**
     * The name of the Trial Component to associate with the metrics.
     */
    TrialComponentName: ExperimentEntityName;
    /**
     * A list of raw metric values to put.
     */
    MetricData: RawMetricDataList;
  }
  export interface BatchPutMetricsResponse {
    /**
     * Lists any errors that occur when inserting metric data.
     */
    Errors?: BatchPutMetricsErrorList;
  }
  export type Double = number;
  export type ExperimentEntityName = string;
  export type Integer = number;
  export type MetricName = string;
  export type PutMetricsErrorCode = "METRIC_LIMIT_EXCEEDED"|"INTERNAL_ERROR"|"VALIDATION_ERROR"|"CONFLICT_ERROR"|string;
  export interface RawMetricData {
    /**
     * The name of the metric.
     */
    MetricName: MetricName;
    /**
     * The time that the metric was recorded.
     */
    Timestamp: Timestamp;
    /**
     * The metric step (epoch). 
     */
    Step?: Step;
    /**
     * The metric value.
     */
    Value: Double;
  }
  export type RawMetricDataList = RawMetricData[];
  export type Step = number;
  export type Timestamp = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-09-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SageMakerMetrics client.
   */
  export import Types = SageMakerMetrics;
}
export = SageMakerMetrics;
