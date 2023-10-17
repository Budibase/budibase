import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ComputeOptimizer extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ComputeOptimizer.Types.ClientConfiguration)
  config: Config & ComputeOptimizer.Types.ClientConfiguration;
  /**
   * Deletes a recommendation preference, such as enhanced infrastructure metrics. For more information, see Activating enhanced infrastructure metrics in the Compute Optimizer User Guide.
   */
  deleteRecommendationPreferences(params: ComputeOptimizer.Types.DeleteRecommendationPreferencesRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.DeleteRecommendationPreferencesResponse) => void): Request<ComputeOptimizer.Types.DeleteRecommendationPreferencesResponse, AWSError>;
  /**
   * Deletes a recommendation preference, such as enhanced infrastructure metrics. For more information, see Activating enhanced infrastructure metrics in the Compute Optimizer User Guide.
   */
  deleteRecommendationPreferences(callback?: (err: AWSError, data: ComputeOptimizer.Types.DeleteRecommendationPreferencesResponse) => void): Request<ComputeOptimizer.Types.DeleteRecommendationPreferencesResponse, AWSError>;
  /**
   * Describes recommendation export jobs created in the last seven days. Use the ExportAutoScalingGroupRecommendations or ExportEC2InstanceRecommendations actions to request an export of your recommendations. Then use the DescribeRecommendationExportJobs action to view your export jobs.
   */
  describeRecommendationExportJobs(params: ComputeOptimizer.Types.DescribeRecommendationExportJobsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.DescribeRecommendationExportJobsResponse) => void): Request<ComputeOptimizer.Types.DescribeRecommendationExportJobsResponse, AWSError>;
  /**
   * Describes recommendation export jobs created in the last seven days. Use the ExportAutoScalingGroupRecommendations or ExportEC2InstanceRecommendations actions to request an export of your recommendations. Then use the DescribeRecommendationExportJobs action to view your export jobs.
   */
  describeRecommendationExportJobs(callback?: (err: AWSError, data: ComputeOptimizer.Types.DescribeRecommendationExportJobsResponse) => void): Request<ComputeOptimizer.Types.DescribeRecommendationExportJobsResponse, AWSError>;
  /**
   * Exports optimization recommendations for Auto Scaling groups. Recommendations are exported in a comma-separated values (.csv) file, and its metadata in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can have only one Auto Scaling group export job in progress per Amazon Web Services Region.
   */
  exportAutoScalingGroupRecommendations(params: ComputeOptimizer.Types.ExportAutoScalingGroupRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportAutoScalingGroupRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportAutoScalingGroupRecommendationsResponse, AWSError>;
  /**
   * Exports optimization recommendations for Auto Scaling groups. Recommendations are exported in a comma-separated values (.csv) file, and its metadata in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can have only one Auto Scaling group export job in progress per Amazon Web Services Region.
   */
  exportAutoScalingGroupRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportAutoScalingGroupRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportAutoScalingGroupRecommendationsResponse, AWSError>;
  /**
   * Exports optimization recommendations for Amazon EBS volumes. Recommendations are exported in a comma-separated values (.csv) file, and its metadata in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can have only one Amazon EBS volume export job in progress per Amazon Web Services Region.
   */
  exportEBSVolumeRecommendations(params: ComputeOptimizer.Types.ExportEBSVolumeRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportEBSVolumeRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportEBSVolumeRecommendationsResponse, AWSError>;
  /**
   * Exports optimization recommendations for Amazon EBS volumes. Recommendations are exported in a comma-separated values (.csv) file, and its metadata in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can have only one Amazon EBS volume export job in progress per Amazon Web Services Region.
   */
  exportEBSVolumeRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportEBSVolumeRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportEBSVolumeRecommendationsResponse, AWSError>;
  /**
   * Exports optimization recommendations for Amazon EC2 instances. Recommendations are exported in a comma-separated values (.csv) file, and its metadata in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can have only one Amazon EC2 instance export job in progress per Amazon Web Services Region.
   */
  exportEC2InstanceRecommendations(params: ComputeOptimizer.Types.ExportEC2InstanceRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportEC2InstanceRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportEC2InstanceRecommendationsResponse, AWSError>;
  /**
   * Exports optimization recommendations for Amazon EC2 instances. Recommendations are exported in a comma-separated values (.csv) file, and its metadata in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can have only one Amazon EC2 instance export job in progress per Amazon Web Services Region.
   */
  exportEC2InstanceRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportEC2InstanceRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportEC2InstanceRecommendationsResponse, AWSError>;
  /**
   *  Exports optimization recommendations for Amazon ECS services on Fargate.  Recommendations are exported in a CSV file, and its metadata in a JSON file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can only have one Amazon ECS service export job in progress per Amazon Web Services Region.
   */
  exportECSServiceRecommendations(params: ComputeOptimizer.Types.ExportECSServiceRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportECSServiceRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportECSServiceRecommendationsResponse, AWSError>;
  /**
   *  Exports optimization recommendations for Amazon ECS services on Fargate.  Recommendations are exported in a CSV file, and its metadata in a JSON file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can only have one Amazon ECS service export job in progress per Amazon Web Services Region.
   */
  exportECSServiceRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportECSServiceRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportECSServiceRecommendationsResponse, AWSError>;
  /**
   * Exports optimization recommendations for Lambda functions. Recommendations are exported in a comma-separated values (.csv) file, and its metadata in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can have only one Lambda function export job in progress per Amazon Web Services Region.
   */
  exportLambdaFunctionRecommendations(params: ComputeOptimizer.Types.ExportLambdaFunctionRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportLambdaFunctionRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportLambdaFunctionRecommendationsResponse, AWSError>;
  /**
   * Exports optimization recommendations for Lambda functions. Recommendations are exported in a comma-separated values (.csv) file, and its metadata in a JavaScript Object Notation (JSON) (.json) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can have only one Lambda function export job in progress per Amazon Web Services Region.
   */
  exportLambdaFunctionRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportLambdaFunctionRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportLambdaFunctionRecommendationsResponse, AWSError>;
  /**
   *  Export optimization recommendations for your licenses.  Recommendations are exported in a comma-separated values (CSV) file, and its metadata in a JavaScript Object Notation (JSON) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can have only one license export job in progress per Amazon Web Services Region.
   */
  exportLicenseRecommendations(params: ComputeOptimizer.Types.ExportLicenseRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportLicenseRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportLicenseRecommendationsResponse, AWSError>;
  /**
   *  Export optimization recommendations for your licenses.  Recommendations are exported in a comma-separated values (CSV) file, and its metadata in a JavaScript Object Notation (JSON) file, to an existing Amazon Simple Storage Service (Amazon S3) bucket that you specify. For more information, see Exporting Recommendations in the Compute Optimizer User Guide. You can have only one license export job in progress per Amazon Web Services Region.
   */
  exportLicenseRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.ExportLicenseRecommendationsResponse) => void): Request<ComputeOptimizer.Types.ExportLicenseRecommendationsResponse, AWSError>;
  /**
   * Returns Auto Scaling group recommendations. Compute Optimizer generates recommendations for Amazon EC2 Auto Scaling groups that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide.
   */
  getAutoScalingGroupRecommendations(params: ComputeOptimizer.Types.GetAutoScalingGroupRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetAutoScalingGroupRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetAutoScalingGroupRecommendationsResponse, AWSError>;
  /**
   * Returns Auto Scaling group recommendations. Compute Optimizer generates recommendations for Amazon EC2 Auto Scaling groups that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide.
   */
  getAutoScalingGroupRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetAutoScalingGroupRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetAutoScalingGroupRecommendationsResponse, AWSError>;
  /**
   * Returns Amazon Elastic Block Store (Amazon EBS) volume recommendations. Compute Optimizer generates recommendations for Amazon EBS volumes that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide.
   */
  getEBSVolumeRecommendations(params: ComputeOptimizer.Types.GetEBSVolumeRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEBSVolumeRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetEBSVolumeRecommendationsResponse, AWSError>;
  /**
   * Returns Amazon Elastic Block Store (Amazon EBS) volume recommendations. Compute Optimizer generates recommendations for Amazon EBS volumes that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide.
   */
  getEBSVolumeRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEBSVolumeRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetEBSVolumeRecommendationsResponse, AWSError>;
  /**
   * Returns Amazon EC2 instance recommendations. Compute Optimizer generates recommendations for Amazon Elastic Compute Cloud (Amazon EC2) instances that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide.
   */
  getEC2InstanceRecommendations(params: ComputeOptimizer.Types.GetEC2InstanceRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEC2InstanceRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetEC2InstanceRecommendationsResponse, AWSError>;
  /**
   * Returns Amazon EC2 instance recommendations. Compute Optimizer generates recommendations for Amazon Elastic Compute Cloud (Amazon EC2) instances that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide.
   */
  getEC2InstanceRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEC2InstanceRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetEC2InstanceRecommendationsResponse, AWSError>;
  /**
   * Returns the projected utilization metrics of Amazon EC2 instance recommendations.  The Cpu and Memory metrics are the only projected utilization metrics returned when you run this action. Additionally, the Memory metric is returned only for resources that have the unified CloudWatch agent installed on them. For more information, see Enabling Memory Utilization with the CloudWatch Agent. 
   */
  getEC2RecommendationProjectedMetrics(params: ComputeOptimizer.Types.GetEC2RecommendationProjectedMetricsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEC2RecommendationProjectedMetricsResponse) => void): Request<ComputeOptimizer.Types.GetEC2RecommendationProjectedMetricsResponse, AWSError>;
  /**
   * Returns the projected utilization metrics of Amazon EC2 instance recommendations.  The Cpu and Memory metrics are the only projected utilization metrics returned when you run this action. Additionally, the Memory metric is returned only for resources that have the unified CloudWatch agent installed on them. For more information, see Enabling Memory Utilization with the CloudWatch Agent. 
   */
  getEC2RecommendationProjectedMetrics(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEC2RecommendationProjectedMetricsResponse) => void): Request<ComputeOptimizer.Types.GetEC2RecommendationProjectedMetricsResponse, AWSError>;
  /**
   *  Returns the projected metrics of Amazon ECS service recommendations. 
   */
  getECSServiceRecommendationProjectedMetrics(params: ComputeOptimizer.Types.GetECSServiceRecommendationProjectedMetricsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetECSServiceRecommendationProjectedMetricsResponse) => void): Request<ComputeOptimizer.Types.GetECSServiceRecommendationProjectedMetricsResponse, AWSError>;
  /**
   *  Returns the projected metrics of Amazon ECS service recommendations. 
   */
  getECSServiceRecommendationProjectedMetrics(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetECSServiceRecommendationProjectedMetricsResponse) => void): Request<ComputeOptimizer.Types.GetECSServiceRecommendationProjectedMetricsResponse, AWSError>;
  /**
   *  Returns Amazon ECS service recommendations.   Compute Optimizer generates recommendations for Amazon ECS services on Fargate that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide. 
   */
  getECSServiceRecommendations(params: ComputeOptimizer.Types.GetECSServiceRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetECSServiceRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetECSServiceRecommendationsResponse, AWSError>;
  /**
   *  Returns Amazon ECS service recommendations.   Compute Optimizer generates recommendations for Amazon ECS services on Fargate that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide. 
   */
  getECSServiceRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetECSServiceRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetECSServiceRecommendationsResponse, AWSError>;
  /**
   * Returns the recommendation preferences that are in effect for a given resource, such as enhanced infrastructure metrics. Considers all applicable preferences that you might have set at the resource, account, and organization level. When you create a recommendation preference, you can set its status to Active or Inactive. Use this action to view the recommendation preferences that are in effect, or Active.
   */
  getEffectiveRecommendationPreferences(params: ComputeOptimizer.Types.GetEffectiveRecommendationPreferencesRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEffectiveRecommendationPreferencesResponse) => void): Request<ComputeOptimizer.Types.GetEffectiveRecommendationPreferencesResponse, AWSError>;
  /**
   * Returns the recommendation preferences that are in effect for a given resource, such as enhanced infrastructure metrics. Considers all applicable preferences that you might have set at the resource, account, and organization level. When you create a recommendation preference, you can set its status to Active or Inactive. Use this action to view the recommendation preferences that are in effect, or Active.
   */
  getEffectiveRecommendationPreferences(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEffectiveRecommendationPreferencesResponse) => void): Request<ComputeOptimizer.Types.GetEffectiveRecommendationPreferencesResponse, AWSError>;
  /**
   * Returns the enrollment (opt in) status of an account to the Compute Optimizer service. If the account is the management account of an organization, this action also confirms the enrollment status of member accounts of the organization. Use the GetEnrollmentStatusesForOrganization action to get detailed information about the enrollment status of member accounts of an organization.
   */
  getEnrollmentStatus(params: ComputeOptimizer.Types.GetEnrollmentStatusRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEnrollmentStatusResponse) => void): Request<ComputeOptimizer.Types.GetEnrollmentStatusResponse, AWSError>;
  /**
   * Returns the enrollment (opt in) status of an account to the Compute Optimizer service. If the account is the management account of an organization, this action also confirms the enrollment status of member accounts of the organization. Use the GetEnrollmentStatusesForOrganization action to get detailed information about the enrollment status of member accounts of an organization.
   */
  getEnrollmentStatus(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEnrollmentStatusResponse) => void): Request<ComputeOptimizer.Types.GetEnrollmentStatusResponse, AWSError>;
  /**
   * Returns the Compute Optimizer enrollment (opt-in) status of organization member accounts, if your account is an organization management account. To get the enrollment status of standalone accounts, use the GetEnrollmentStatus action.
   */
  getEnrollmentStatusesForOrganization(params: ComputeOptimizer.Types.GetEnrollmentStatusesForOrganizationRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEnrollmentStatusesForOrganizationResponse) => void): Request<ComputeOptimizer.Types.GetEnrollmentStatusesForOrganizationResponse, AWSError>;
  /**
   * Returns the Compute Optimizer enrollment (opt-in) status of organization member accounts, if your account is an organization management account. To get the enrollment status of standalone accounts, use the GetEnrollmentStatus action.
   */
  getEnrollmentStatusesForOrganization(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetEnrollmentStatusesForOrganizationResponse) => void): Request<ComputeOptimizer.Types.GetEnrollmentStatusesForOrganizationResponse, AWSError>;
  /**
   * Returns Lambda function recommendations. Compute Optimizer generates recommendations for functions that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide.
   */
  getLambdaFunctionRecommendations(params: ComputeOptimizer.Types.GetLambdaFunctionRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetLambdaFunctionRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetLambdaFunctionRecommendationsResponse, AWSError>;
  /**
   * Returns Lambda function recommendations. Compute Optimizer generates recommendations for functions that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide.
   */
  getLambdaFunctionRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetLambdaFunctionRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetLambdaFunctionRecommendationsResponse, AWSError>;
  /**
   * Returns license recommendations for Amazon EC2 instances that run on a specific license. Compute Optimizer generates recommendations for licenses that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide.
   */
  getLicenseRecommendations(params: ComputeOptimizer.Types.GetLicenseRecommendationsRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetLicenseRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetLicenseRecommendationsResponse, AWSError>;
  /**
   * Returns license recommendations for Amazon EC2 instances that run on a specific license. Compute Optimizer generates recommendations for licenses that meet a specific set of requirements. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide.
   */
  getLicenseRecommendations(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetLicenseRecommendationsResponse) => void): Request<ComputeOptimizer.Types.GetLicenseRecommendationsResponse, AWSError>;
  /**
   * Returns existing recommendation preferences, such as enhanced infrastructure metrics. Use the scope parameter to specify which preferences to return. You can specify to return preferences for an organization, a specific account ID, or a specific EC2 instance or Auto Scaling group Amazon Resource Name (ARN). For more information, see Activating enhanced infrastructure metrics in the Compute Optimizer User Guide.
   */
  getRecommendationPreferences(params: ComputeOptimizer.Types.GetRecommendationPreferencesRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetRecommendationPreferencesResponse) => void): Request<ComputeOptimizer.Types.GetRecommendationPreferencesResponse, AWSError>;
  /**
   * Returns existing recommendation preferences, such as enhanced infrastructure metrics. Use the scope parameter to specify which preferences to return. You can specify to return preferences for an organization, a specific account ID, or a specific EC2 instance or Auto Scaling group Amazon Resource Name (ARN). For more information, see Activating enhanced infrastructure metrics in the Compute Optimizer User Guide.
   */
  getRecommendationPreferences(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetRecommendationPreferencesResponse) => void): Request<ComputeOptimizer.Types.GetRecommendationPreferencesResponse, AWSError>;
  /**
   * Returns the optimization findings for an account. It returns the number of:   Amazon EC2 instances in an account that are Underprovisioned, Overprovisioned, or Optimized.   Auto Scaling groups in an account that are NotOptimized, or Optimized.   Amazon EBS volumes in an account that are NotOptimized, or Optimized.   Lambda functions in an account that are NotOptimized, or Optimized.   Amazon ECS services in an account that are Underprovisioned, Overprovisioned, or Optimized.  
   */
  getRecommendationSummaries(params: ComputeOptimizer.Types.GetRecommendationSummariesRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.GetRecommendationSummariesResponse) => void): Request<ComputeOptimizer.Types.GetRecommendationSummariesResponse, AWSError>;
  /**
   * Returns the optimization findings for an account. It returns the number of:   Amazon EC2 instances in an account that are Underprovisioned, Overprovisioned, or Optimized.   Auto Scaling groups in an account that are NotOptimized, or Optimized.   Amazon EBS volumes in an account that are NotOptimized, or Optimized.   Lambda functions in an account that are NotOptimized, or Optimized.   Amazon ECS services in an account that are Underprovisioned, Overprovisioned, or Optimized.  
   */
  getRecommendationSummaries(callback?: (err: AWSError, data: ComputeOptimizer.Types.GetRecommendationSummariesResponse) => void): Request<ComputeOptimizer.Types.GetRecommendationSummariesResponse, AWSError>;
  /**
   * Creates a new recommendation preference or updates an existing recommendation preference, such as enhanced infrastructure metrics. For more information, see Activating enhanced infrastructure metrics in the Compute Optimizer User Guide.
   */
  putRecommendationPreferences(params: ComputeOptimizer.Types.PutRecommendationPreferencesRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.PutRecommendationPreferencesResponse) => void): Request<ComputeOptimizer.Types.PutRecommendationPreferencesResponse, AWSError>;
  /**
   * Creates a new recommendation preference or updates an existing recommendation preference, such as enhanced infrastructure metrics. For more information, see Activating enhanced infrastructure metrics in the Compute Optimizer User Guide.
   */
  putRecommendationPreferences(callback?: (err: AWSError, data: ComputeOptimizer.Types.PutRecommendationPreferencesResponse) => void): Request<ComputeOptimizer.Types.PutRecommendationPreferencesResponse, AWSError>;
  /**
   * Updates the enrollment (opt in and opt out) status of an account to the Compute Optimizer service. If the account is a management account of an organization, this action can also be used to enroll member accounts of the organization. You must have the appropriate permissions to opt in to Compute Optimizer, to view its recommendations, and to opt out. For more information, see Controlling access with Amazon Web Services Identity and Access Management in the Compute Optimizer User Guide. When you opt in, Compute Optimizer automatically creates a service-linked role in your account to access its data. For more information, see Using Service-Linked Roles for Compute Optimizer in the Compute Optimizer User Guide.
   */
  updateEnrollmentStatus(params: ComputeOptimizer.Types.UpdateEnrollmentStatusRequest, callback?: (err: AWSError, data: ComputeOptimizer.Types.UpdateEnrollmentStatusResponse) => void): Request<ComputeOptimizer.Types.UpdateEnrollmentStatusResponse, AWSError>;
  /**
   * Updates the enrollment (opt in and opt out) status of an account to the Compute Optimizer service. If the account is a management account of an organization, this action can also be used to enroll member accounts of the organization. You must have the appropriate permissions to opt in to Compute Optimizer, to view its recommendations, and to opt out. For more information, see Controlling access with Amazon Web Services Identity and Access Management in the Compute Optimizer User Guide. When you opt in, Compute Optimizer automatically creates a service-linked role in your account to access its data. For more information, see Using Service-Linked Roles for Compute Optimizer in the Compute Optimizer User Guide.
   */
  updateEnrollmentStatus(callback?: (err: AWSError, data: ComputeOptimizer.Types.UpdateEnrollmentStatusResponse) => void): Request<ComputeOptimizer.Types.UpdateEnrollmentStatusResponse, AWSError>;
}
declare namespace ComputeOptimizer {
  export interface AccountEnrollmentStatus {
    /**
     * The Amazon Web Services account ID.
     */
    accountId?: AccountId;
    /**
     * The account enrollment status.
     */
    status?: Status;
    /**
     * The reason for the account enrollment status. For example, an account might show a status of Pending because member accounts of an organization require more time to be enrolled in the service.
     */
    statusReason?: StatusReason;
    /**
     * The Unix epoch timestamp, in seconds, of when the account enrollment status was last updated.
     */
    lastUpdatedTimestamp?: LastUpdatedTimestamp;
  }
  export type AccountEnrollmentStatuses = AccountEnrollmentStatus[];
  export type AccountId = string;
  export type AccountIds = AccountId[];
  export type AutoScalingConfiguration = "TargetTrackingScalingCpu"|"TargetTrackingScalingMemory"|string;
  export type AutoScalingGroupArn = string;
  export type AutoScalingGroupArns = AutoScalingGroupArn[];
  export interface AutoScalingGroupConfiguration {
    /**
     * The desired capacity, or number of instances, for the Auto Scaling group.
     */
    desiredCapacity?: DesiredCapacity;
    /**
     * The minimum size, or minimum number of instances, for the Auto Scaling group.
     */
    minSize?: MinSize;
    /**
     * The maximum size, or maximum number of instances, for the Auto Scaling group.
     */
    maxSize?: MaxSize;
    /**
     * The instance type for the Auto Scaling group.
     */
    instanceType?: InstanceType;
  }
  export type AutoScalingGroupName = string;
  export interface AutoScalingGroupRecommendation {
    /**
     * The Amazon Web Services account ID of the Auto Scaling group.
     */
    accountId?: AccountId;
    /**
     * The Amazon Resource Name (ARN) of the Auto Scaling group.
     */
    autoScalingGroupArn?: AutoScalingGroupArn;
    /**
     * The name of the Auto Scaling group.
     */
    autoScalingGroupName?: AutoScalingGroupName;
    /**
     * The finding classification of the Auto Scaling group. Findings for Auto Scaling groups include:     NotOptimized —An Auto Scaling group is considered not optimized when Compute Optimizer identifies a recommendation that can provide better performance for your workload.     Optimized —An Auto Scaling group is considered optimized when Compute Optimizer determines that the group is correctly provisioned to run your workload based on the chosen instance type. For optimized resources, Compute Optimizer might recommend a new generation instance type.  
     */
    finding?: Finding;
    /**
     * An array of objects that describe the utilization metrics of the Auto Scaling group.
     */
    utilizationMetrics?: UtilizationMetrics;
    /**
     * The number of days for which utilization metrics were analyzed for the Auto Scaling group.
     */
    lookBackPeriodInDays?: LookBackPeriodInDays;
    /**
     * An array of objects that describe the current configuration of the Auto Scaling group.
     */
    currentConfiguration?: AutoScalingGroupConfiguration;
    /**
     * An array of objects that describe the recommendation options for the Auto Scaling group.
     */
    recommendationOptions?: AutoScalingGroupRecommendationOptions;
    /**
     * The timestamp of when the Auto Scaling group recommendation was last generated.
     */
    lastRefreshTimestamp?: LastRefreshTimestamp;
    /**
     * The risk of the current Auto Scaling group not meeting the performance needs of its workloads. The higher the risk, the more likely the current Auto Scaling group configuration has insufficient capacity and cannot meet workload requirements.
     */
    currentPerformanceRisk?: CurrentPerformanceRisk;
    /**
     * An object that describes the effective recommendation preferences for the Auto Scaling group.
     */
    effectiveRecommendationPreferences?: EffectiveRecommendationPreferences;
    /**
     * The applications that might be running on the instances in the Auto Scaling group as inferred by Compute Optimizer. Compute Optimizer can infer if one of the following applications might be running on the instances:    AmazonEmr - Infers that Amazon EMR might be running on the instances.    ApacheCassandra - Infers that Apache Cassandra might be running on the instances.    ApacheHadoop - Infers that Apache Hadoop might be running on the instances.    Memcached - Infers that Memcached might be running on the instances.    NGINX - Infers that NGINX might be running on the instances.    PostgreSql - Infers that PostgreSQL might be running on the instances.    Redis - Infers that Redis might be running on the instances.    Kafka - Infers that Kafka might be running on the instance.    SQLServer - Infers that SQLServer might be running on the instance.  
     */
    inferredWorkloadTypes?: InferredWorkloadTypes;
    /**
     *  Describes the GPU accelerator settings for the current instance type of the Auto Scaling group. 
     */
    currentInstanceGpuInfo?: GpuInfo;
  }
  export interface AutoScalingGroupRecommendationOption {
    /**
     * An array of objects that describe an Auto Scaling group configuration.
     */
    configuration?: AutoScalingGroupConfiguration;
    /**
     * An array of objects that describe the projected utilization metrics of the Auto Scaling group recommendation option.  The Cpu and Memory metrics are the only projected utilization metrics returned. Additionally, the Memory metric is returned only for resources that have the unified CloudWatch agent installed on them. For more information, see Enabling Memory Utilization with the CloudWatch Agent. 
     */
    projectedUtilizationMetrics?: ProjectedUtilizationMetrics;
    /**
     * The performance risk of the Auto Scaling group configuration recommendation. Performance risk indicates the likelihood of the recommended instance type not meeting the resource needs of your workload. Compute Optimizer calculates an individual performance risk score for each specification of the recommended instance, including CPU, memory, EBS throughput, EBS IOPS, disk throughput, disk IOPS, network throughput, and network PPS. The performance risk of the recommended instance is calculated as the maximum performance risk score across the analyzed resource specifications. The value ranges from 0 - 4, with 0 meaning that the recommended resource is predicted to always provide enough hardware capability. The higher the performance risk is, the more likely you should validate whether the recommendation will meet the performance requirements of your workload before migrating your resource.
     */
    performanceRisk?: PerformanceRisk;
    /**
     * The rank of the Auto Scaling group recommendation option. The top recommendation option is ranked as 1.
     */
    rank?: Rank;
    /**
     * An object that describes the savings opportunity for the Auto Scaling group recommendation option. Savings opportunity includes the estimated monthly savings amount and percentage.
     */
    savingsOpportunity?: SavingsOpportunity;
    /**
     * The level of effort required to migrate from the current instance type to the recommended instance type. For example, the migration effort is Low if Amazon EMR is the inferred workload type and an Amazon Web Services Graviton instance type is recommended. The migration effort is Medium if a workload type couldn't be inferred but an Amazon Web Services Graviton instance type is recommended. The migration effort is VeryLow if both the current and recommended instance types are of the same CPU architecture.
     */
    migrationEffort?: MigrationEffort;
    /**
     *  Describes the GPU accelerator settings for the recommended instance type of the Auto Scaling group. 
     */
    instanceGpuInfo?: GpuInfo;
  }
  export type AutoScalingGroupRecommendationOptions = AutoScalingGroupRecommendationOption[];
  export type AutoScalingGroupRecommendations = AutoScalingGroupRecommendation[];
  export type Code = string;
  export interface ContainerConfiguration {
    /**
     *  The name of the container. 
     */
    containerName?: ContainerName;
    /**
     *  The memory size configurations for the container. 
     */
    memorySizeConfiguration?: MemorySizeConfiguration;
    /**
     *  The number of CPU units reserved for the container. 
     */
    cpu?: NullableCpu;
  }
  export type ContainerConfigurations = ContainerConfiguration[];
  export type ContainerName = string;
  export interface ContainerRecommendation {
    /**
     *  The name of the container. 
     */
    containerName?: ContainerName;
    /**
     *  The recommended memory size configurations for the container. 
     */
    memorySizeConfiguration?: MemorySizeConfiguration;
    /**
     *  The recommended number of CPU units reserved for the container. 
     */
    cpu?: NullableCpu;
  }
  export type ContainerRecommendations = ContainerRecommendation[];
  export type CpuSize = number;
  export type CpuVendorArchitecture = "AWS_ARM64"|"CURRENT"|string;
  export type CpuVendorArchitectures = CpuVendorArchitecture[];
  export type CreationTimestamp = Date;
  export type Currency = "USD"|"CNY"|string;
  export type CurrentInstanceType = string;
  export type CurrentPerformanceRisk = "VeryLow"|"Low"|"Medium"|"High"|string;
  export interface CurrentPerformanceRiskRatings {
    /**
     * A count of the applicable resource types with a high performance risk rating.
     */
    high?: High;
    /**
     * A count of the applicable resource types with a medium performance risk rating.
     */
    medium?: Medium;
    /**
     * A count of the applicable resource types with a low performance risk rating.
     */
    low?: Low;
    /**
     * A count of the applicable resource types with a very low performance risk rating.
     */
    veryLow?: VeryLow;
  }
  export interface DeleteRecommendationPreferencesRequest {
    /**
     * The target resource type of the recommendation preference to delete. The Ec2Instance option encompasses standalone instances and instances that are part of Auto Scaling groups. The AutoScalingGroup option encompasses only instances that are part of an Auto Scaling group.  The valid values for this parameter are Ec2Instance and AutoScalingGroup. 
     */
    resourceType: ResourceType;
    /**
     * An object that describes the scope of the recommendation preference to delete. You can delete recommendation preferences that are created at the organization level (for management accounts of an organization only), account level, and resource level. For more information, see Activating enhanced infrastructure metrics in the Compute Optimizer User Guide.
     */
    scope?: Scope;
    /**
     * The name of the recommendation preference to delete.
     */
    recommendationPreferenceNames: RecommendationPreferenceNames;
  }
  export interface DeleteRecommendationPreferencesResponse {
  }
  export interface DescribeRecommendationExportJobsRequest {
    /**
     * The identification numbers of the export jobs to return. An export job ID is returned when you create an export using the ExportAutoScalingGroupRecommendations or ExportEC2InstanceRecommendations actions. All export jobs created in the last seven days are returned if this parameter is omitted.
     */
    jobIds?: JobIds;
    /**
     * An array of objects to specify a filter that returns a more specific list of export jobs.
     */
    filters?: JobFilters;
    /**
     * The token to advance to the next page of export jobs.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of export jobs to return with a single request. To retrieve the remaining results, make another request with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface DescribeRecommendationExportJobsResponse {
    /**
     * An array of objects that describe recommendation export jobs.
     */
    recommendationExportJobs?: RecommendationExportJobs;
    /**
     * The token to use to advance to the next page of export jobs. This value is null when there are no more pages of export jobs to return.
     */
    nextToken?: NextToken;
  }
  export type DesiredCapacity = number;
  export type DestinationBucket = string;
  export type DestinationKey = string;
  export type DestinationKeyPrefix = string;
  export interface EBSFilter {
    /**
     * The name of the filter. Specify Finding to return recommendations with a specific finding classification (for example, NotOptimized). You can filter your Amazon EBS volume recommendations by tag:key and tag-key tags. A tag:key is a key and value combination of a tag assigned to your Amazon EBS volume recommendations. Use the tag key in the filter name and the tag value as the filter value. For example, to find all Amazon EBS volume recommendations that have a tag with the key of Owner and the value of TeamA, specify tag:Owner for the filter name and TeamA for the filter value. A tag-key is the key of a tag assigned to your Amazon EBS volume recommendations. Use this filter to find all of your Amazon EBS volume recommendations that have a tag with a specific key. This doesn’t consider the tag value. For example, you can find your Amazon EBS volume recommendations with a tag key value of Owner or without any tag keys assigned.
     */
    name?: EBSFilterName;
    /**
     * The value of the filter. The valid values are Optimized, or NotOptimized.
     */
    values?: FilterValues;
  }
  export type EBSFilterName = "Finding"|string;
  export type EBSFilters = EBSFilter[];
  export type EBSFinding = "Optimized"|"NotOptimized"|string;
  export type EBSMetricName = "VolumeReadOpsPerSecond"|"VolumeWriteOpsPerSecond"|"VolumeReadBytesPerSecond"|"VolumeWriteBytesPerSecond"|string;
  export interface EBSUtilizationMetric {
    /**
     * The name of the utilization metric. The following utilization metrics are available:    VolumeReadOpsPerSecond - The completed read operations per second from the volume in a specified period of time. Unit: Count    VolumeWriteOpsPerSecond - The completed write operations per second to the volume in a specified period of time. Unit: Count    VolumeReadBytesPerSecond - The bytes read per second from the volume in a specified period of time. Unit: Bytes    VolumeWriteBytesPerSecond - The bytes written to the volume in a specified period of time. Unit: Bytes  
     */
    name?: EBSMetricName;
    /**
     * The statistic of the utilization metric. The Compute Optimizer API, Command Line Interface (CLI), and SDKs return utilization metrics using only the Maximum statistic, which is the highest value observed during the specified period. The Compute Optimizer console displays graphs for some utilization metrics using the Average statistic, which is the value of Sum / SampleCount during the specified period. For more information, see Viewing resource recommendations in the Compute Optimizer User Guide. You can also get averaged utilization metric data for your resources using Amazon CloudWatch. For more information, see the Amazon CloudWatch User Guide.
     */
    statistic?: MetricStatistic;
    /**
     * The value of the utilization metric.
     */
    value?: MetricValue;
  }
  export type EBSUtilizationMetrics = EBSUtilizationMetric[];
  export type ECSServiceLaunchType = "EC2"|"Fargate"|string;
  export type ECSServiceMetricName = "Cpu"|"Memory"|string;
  export type ECSServiceMetricStatistic = "Maximum"|"Average"|string;
  export interface ECSServiceProjectedMetric {
    /**
     *  The name of the projected metric.  The following metrics are available:    Cpu — The percentage of allocated compute units that are currently in use on the service tasks.    Memory — The percentage of memory that's currently in use on the service tasks.  
     */
    name?: ECSServiceMetricName;
    /**
     *  The timestamps of the projected metric. 
     */
    timestamps?: Timestamps;
    /**
     *  The upper bound values for the projected metric. 
     */
    upperBoundValues?: MetricValues;
    /**
     *  The lower bound values for the projected metric. 
     */
    lowerBoundValues?: MetricValues;
  }
  export type ECSServiceProjectedMetrics = ECSServiceProjectedMetric[];
  export interface ECSServiceProjectedUtilizationMetric {
    /**
     *  The name of the projected utilization metric.  The following utilization metrics are available:    Cpu — The percentage of allocated compute units that are currently in use on the service tasks.    Memory — The percentage of memory that's currently in use on the service tasks.  
     */
    name?: ECSServiceMetricName;
    /**
     * The statistic of the projected utilization metric. The Compute Optimizer API, Command Line Interface (CLI), and SDKs return utilization metrics using only the Maximum statistic, which is the highest value observed during the specified period. The Compute Optimizer console displays graphs for some utilization metrics using the Average statistic, which is the value of Sum / SampleCount during the specified period. For more information, see Viewing resource recommendations in the Compute Optimizer User Guide. You can also get averaged utilization metric data for your resources using Amazon CloudWatch. For more information, see the Amazon CloudWatch User Guide.
     */
    statistic?: ECSServiceMetricStatistic;
    /**
     *  The lower bound values for the projected utilization metrics. 
     */
    lowerBoundValue?: LowerBoundValue;
    /**
     *  The upper bound values for the projected utilization metrics. 
     */
    upperBoundValue?: UpperBoundValue;
  }
  export type ECSServiceProjectedUtilizationMetrics = ECSServiceProjectedUtilizationMetric[];
  export interface ECSServiceRecommendation {
    /**
     *  The Amazon Resource Name (ARN) of the current Amazon ECS service.   The following is the format of the ARN:   arn:aws:ecs:region:aws_account_id:service/cluster-name/service-name 
     */
    serviceArn?: ServiceArn;
    /**
     *  The Amazon Web Services account ID of the Amazon ECS service. 
     */
    accountId?: AccountId;
    /**
     *  The configuration of the current Amazon ECS service. 
     */
    currentServiceConfiguration?: ServiceConfiguration;
    /**
     *  An array of objects that describe the utilization metrics of the Amazon ECS service. 
     */
    utilizationMetrics?: ECSServiceUtilizationMetrics;
    /**
     *  The number of days the Amazon ECS service utilization metrics were analyzed. 
     */
    lookbackPeriodInDays?: LookBackPeriodInDays;
    /**
     *  The launch type the Amazon ECS service is using.   Compute Optimizer only supports the Fargate launch type. 
     */
    launchType?: ECSServiceLaunchType;
    /**
     *  The timestamp of when the Amazon ECS service recommendation was last generated. 
     */
    lastRefreshTimestamp?: LastRefreshTimestamp;
    /**
     *  The finding classification of an Amazon ECS service.  Findings for Amazon ECS services include:     Underprovisioned  — When Compute Optimizer detects that there’s not enough memory or CPU, an Amazon ECS service is considered under-provisioned. An under-provisioned service might result in poor application performance.     Overprovisioned  — When Compute Optimizer detects that there’s excessive memory or CPU, an Amazon ECS service is considered over-provisioned. An over-provisioned service might result in additional infrastructure costs.      Optimized  — When both the CPU and memory of your Amazon ECS service meet the performance requirements of your workload, the service is considered optimized.  
     */
    finding?: ECSServiceRecommendationFinding;
    /**
     *  The reason for the finding classification of an Amazon ECS service.  Finding reason codes for Amazon ECS services include:     CPUUnderprovisioned  — The service CPU configuration can be sized up to enhance the performance of your workload. This is identified by analyzing the CPUUtilization metric of the current service during the look-back period.     CPUOverprovisioned  — The service CPU configuration can be sized down while still meeting the performance requirements of your workload. This is identified by analyzing the CPUUtilization metric of the current service during the look-back period.      MemoryUnderprovisioned  — The service memory configuration can be sized up to enhance the performance of your workload. This is identified by analyzing the MemoryUtilization metric of the current service during the look-back period.     MemoryOverprovisioned  — The service memory configuration can be sized down while still meeting the performance requirements of your workload. This is identified by analyzing the MemoryUtilization metric of the current service during the look-back period.  
     */
    findingReasonCodes?: ECSServiceRecommendationFindingReasonCodes;
    /**
     *  An array of objects that describe the recommendation options for the Amazon ECS service. 
     */
    serviceRecommendationOptions?: ECSServiceRecommendationOptions;
    /**
     *  The risk of the current Amazon ECS service not meeting the performance needs of its workloads. The higher the risk, the more likely the current service can't meet the performance requirements of its workload. 
     */
    currentPerformanceRisk?: CurrentPerformanceRisk;
    /**
     *  A list of tags assigned to your Amazon ECS service recommendations. 
     */
    tags?: Tags;
  }
  export interface ECSServiceRecommendationFilter {
    /**
     *  The name of the filter.   Specify Finding to return recommendations with a specific finding classification.   Specify FindingReasonCode to return recommendations with a specific finding reason code.  You can filter your Amazon ECS service recommendations by tag:key and tag-key tags. A tag:key is a key and value combination of a tag assigned to your Amazon ECS service recommendations. Use the tag key in the filter name and the tag value as the filter value. For example, to find all Amazon ECS service recommendations that have a tag with the key of Owner and the value of TeamA, specify tag:Owner for the filter name and TeamA for the filter value. A tag-key is the key of a tag assigned to your Amazon ECS service recommendations. Use this filter to find all of your Amazon ECS service recommendations that have a tag with a specific key. This doesn’t consider the tag value. For example, you can find your Amazon ECS service recommendations with a tag key value of Owner or without any tag keys assigned.
     */
    name?: ECSServiceRecommendationFilterName;
    /**
     *  The value of the filter.  The valid values for this parameter are as follows:   If you specify the name parameter as Finding, specify Optimized, NotOptimized, or Unavailable.   If you specify the name parameter as FindingReasonCode, specify CPUUnderprovisioned, CPUOverprovisioned, MemoryUnderprovisioned, or MemoryOverprovisioned.  
     */
    values?: FilterValues;
  }
  export type ECSServiceRecommendationFilterName = "Finding"|"FindingReasonCode"|string;
  export type ECSServiceRecommendationFilters = ECSServiceRecommendationFilter[];
  export type ECSServiceRecommendationFinding = "Optimized"|"Underprovisioned"|"Overprovisioned"|string;
  export type ECSServiceRecommendationFindingReasonCode = "MemoryOverprovisioned"|"MemoryUnderprovisioned"|"CPUOverprovisioned"|"CPUUnderprovisioned"|string;
  export type ECSServiceRecommendationFindingReasonCodes = ECSServiceRecommendationFindingReasonCode[];
  export interface ECSServiceRecommendationOption {
    /**
     *  The memory size of the Amazon ECS service recommendation option. 
     */
    memory?: NullableMemory;
    /**
     *  The CPU size of the Amazon ECS service recommendation option. 
     */
    cpu?: NullableCpu;
    savingsOpportunity?: SavingsOpportunity;
    /**
     *  An array of objects that describe the projected utilization metrics of the Amazon ECS service recommendation option. 
     */
    projectedUtilizationMetrics?: ECSServiceProjectedUtilizationMetrics;
    /**
     *  The CPU and memory size recommendations for the containers within the task of your Amazon ECS service. 
     */
    containerRecommendations?: ContainerRecommendations;
  }
  export type ECSServiceRecommendationOptions = ECSServiceRecommendationOption[];
  export type ECSServiceRecommendations = ECSServiceRecommendation[];
  export interface ECSServiceRecommendedOptionProjectedMetric {
    /**
     *  The recommended CPU size for the Amazon ECS service. 
     */
    recommendedCpuUnits?: CpuSize;
    /**
     *  The recommended memory size for the Amazon ECS service. 
     */
    recommendedMemorySize?: MemorySize;
    /**
     *  An array of objects that describe the projected metric. 
     */
    projectedMetrics?: ECSServiceProjectedMetrics;
  }
  export type ECSServiceRecommendedOptionProjectedMetrics = ECSServiceRecommendedOptionProjectedMetric[];
  export interface ECSServiceUtilizationMetric {
    /**
     *  The name of the utilization metric.  The following utilization metrics are available:    Cpu — The amount of CPU capacity that's used in the service.    Memory — The amount of memory that's used in the service.  
     */
    name?: ECSServiceMetricName;
    /**
     * The statistic of the utilization metric. The Compute Optimizer API, Command Line Interface (CLI), and SDKs return utilization metrics using only the Maximum statistic, which is the highest value observed during the specified period. The Compute Optimizer console displays graphs for some utilization metrics using the Average statistic, which is the value of Sum / SampleCount during the specified period. For more information, see Viewing resource recommendations in the Compute Optimizer User Guide. You can also get averaged utilization metric data for your resources using Amazon CloudWatch. For more information, see the Amazon CloudWatch User Guide.
     */
    statistic?: ECSServiceMetricStatistic;
    /**
     *  The value of the utilization metric. 
     */
    value?: MetricValue;
  }
  export type ECSServiceUtilizationMetrics = ECSServiceUtilizationMetric[];
  export interface EffectiveRecommendationPreferences {
    /**
     * Describes the CPU vendor and architecture for an instance or Auto Scaling group recommendations. For example, when you specify AWS_ARM64 with:   A GetEC2InstanceRecommendations or GetAutoScalingGroupRecommendations request, Compute Optimizer returns recommendations that consist of Graviton2 instance types only.   A GetEC2RecommendationProjectedMetrics request, Compute Optimizer returns projected utilization metrics for Graviton2 instance type recommendations only.   A ExportEC2InstanceRecommendations or ExportAutoScalingGroupRecommendations request, Compute Optimizer exports recommendations that consist of Graviton2 instance types only.  
     */
    cpuVendorArchitectures?: CpuVendorArchitectures;
    /**
     * Describes the activation status of the enhanced infrastructure metrics preference. A status of Active confirms that the preference is applied in the latest recommendation refresh, and a status of Inactive confirms that it's not yet applied to recommendations. For more information, see Enhanced infrastructure metrics in the Compute Optimizer User Guide.
     */
    enhancedInfrastructureMetrics?: EnhancedInfrastructureMetrics;
    /**
     * Describes the activation status of the inferred workload types preference. A status of Active confirms that the preference is applied in the latest recommendation refresh. A status of Inactive confirms that it's not yet applied to recommendations.
     */
    inferredWorkloadTypes?: InferredWorkloadTypesPreference;
    /**
     *  An object that describes the external metrics recommendation preference.   If the preference is applied in the latest recommendation refresh, an object with a valid source value appears in the response. If the preference isn't applied to the recommendations already, then this object doesn't appear in the response. 
     */
    externalMetricsPreference?: ExternalMetricsPreference;
  }
  export type EnhancedInfrastructureMetrics = "Active"|"Inactive"|string;
  export interface EnrollmentFilter {
    /**
     * The name of the filter. Specify Status to return accounts with a specific enrollment status (for example, Active).
     */
    name?: EnrollmentFilterName;
    /**
     * The value of the filter. The valid values are Active, Inactive, Pending, and Failed.
     */
    values?: FilterValues;
  }
  export type EnrollmentFilterName = "Status"|string;
  export type EnrollmentFilters = EnrollmentFilter[];
  export interface EstimatedMonthlySavings {
    /**
     * The currency of the estimated monthly savings.
     */
    currency?: Currency;
    /**
     * The value of the estimated monthly savings.
     */
    value?: Value;
  }
  export interface ExportAutoScalingGroupRecommendationsRequest {
    /**
     * The IDs of the Amazon Web Services accounts for which to export Auto Scaling group recommendations. If your account is the management account of an organization, use this parameter to specify the member account for which you want to export recommendations. This parameter cannot be specified together with the include member accounts parameter. The parameters are mutually exclusive. Recommendations for member accounts are not included in the export if this parameter, or the include member accounts parameter, is omitted. You can specify multiple account IDs per request.
     */
    accountIds?: AccountIds;
    /**
     * An array of objects to specify a filter that exports a more specific set of Auto Scaling group recommendations.
     */
    filters?: Filters;
    /**
     * The recommendations data to include in the export file. For more information about the fields that can be exported, see Exported files in the Compute Optimizer User Guide.
     */
    fieldsToExport?: ExportableAutoScalingGroupFields;
    /**
     * An object to specify the destination Amazon Simple Storage Service (Amazon S3) bucket name and key prefix for the export job. You must create the destination Amazon S3 bucket for your recommendations export before you create the export job. Compute Optimizer does not create the S3 bucket for you. After you create the S3 bucket, ensure that it has the required permissions policy to allow Compute Optimizer to write the export file to it. If you plan to specify an object prefix when you create the export job, you must include the object prefix in the policy that you add to the S3 bucket. For more information, see Amazon S3 Bucket Policy for Compute Optimizer in the Compute Optimizer User Guide.
     */
    s3DestinationConfig: S3DestinationConfig;
    /**
     * The format of the export file. The only export file format currently supported is Csv.
     */
    fileFormat?: FileFormat;
    /**
     * Indicates whether to include recommendations for resources in all member accounts of the organization if your account is the management account of an organization. The member accounts must also be opted in to Compute Optimizer, and trusted access for Compute Optimizer must be enabled in the organization account. For more information, see Compute Optimizer and Amazon Web Services Organizations trusted access in the Compute Optimizer User Guide. Recommendations for member accounts of the organization are not included in the export file if this parameter is omitted. This parameter cannot be specified together with the account IDs parameter. The parameters are mutually exclusive. Recommendations for member accounts are not included in the export if this parameter, or the account IDs parameter, is omitted.
     */
    includeMemberAccounts?: IncludeMemberAccounts;
    /**
     * An object to specify the preferences for the Auto Scaling group recommendations to export.
     */
    recommendationPreferences?: RecommendationPreferences;
  }
  export interface ExportAutoScalingGroupRecommendationsResponse {
    /**
     * The identification number of the export job. Use the DescribeRecommendationExportJobs action, and specify the job ID to view the status of an export job.
     */
    jobId?: JobId;
    /**
     * An object that describes the destination Amazon S3 bucket of a recommendations export file.
     */
    s3Destination?: S3Destination;
  }
  export interface ExportDestination {
    /**
     * An object that describes the destination Amazon Simple Storage Service (Amazon S3) bucket name and object keys of a recommendations export file, and its associated metadata file.
     */
    s3?: S3Destination;
  }
  export interface ExportEBSVolumeRecommendationsRequest {
    /**
     * The IDs of the Amazon Web Services accounts for which to export Amazon EBS volume recommendations. If your account is the management account of an organization, use this parameter to specify the member account for which you want to export recommendations. This parameter cannot be specified together with the include member accounts parameter. The parameters are mutually exclusive. Recommendations for member accounts are not included in the export if this parameter, or the include member accounts parameter, is omitted. You can specify multiple account IDs per request.
     */
    accountIds?: AccountIds;
    /**
     * An array of objects to specify a filter that exports a more specific set of Amazon EBS volume recommendations.
     */
    filters?: EBSFilters;
    /**
     * The recommendations data to include in the export file. For more information about the fields that can be exported, see Exported files in the Compute Optimizer User Guide.
     */
    fieldsToExport?: ExportableVolumeFields;
    s3DestinationConfig: S3DestinationConfig;
    /**
     * The format of the export file. The only export file format currently supported is Csv.
     */
    fileFormat?: FileFormat;
    /**
     * Indicates whether to include recommendations for resources in all member accounts of the organization if your account is the management account of an organization. The member accounts must also be opted in to Compute Optimizer, and trusted access for Compute Optimizer must be enabled in the organization account. For more information, see Compute Optimizer and Amazon Web Services Organizations trusted access in the Compute Optimizer User Guide. Recommendations for member accounts of the organization are not included in the export file if this parameter is omitted. This parameter cannot be specified together with the account IDs parameter. The parameters are mutually exclusive. Recommendations for member accounts are not included in the export if this parameter, or the account IDs parameter, is omitted.
     */
    includeMemberAccounts?: IncludeMemberAccounts;
  }
  export interface ExportEBSVolumeRecommendationsResponse {
    /**
     * The identification number of the export job. Use the DescribeRecommendationExportJobs action, and specify the job ID to view the status of an export job.
     */
    jobId?: JobId;
    s3Destination?: S3Destination;
  }
  export interface ExportEC2InstanceRecommendationsRequest {
    /**
     * The IDs of the Amazon Web Services accounts for which to export instance recommendations. If your account is the management account of an organization, use this parameter to specify the member account for which you want to export recommendations. This parameter cannot be specified together with the include member accounts parameter. The parameters are mutually exclusive. Recommendations for member accounts are not included in the export if this parameter, or the include member accounts parameter, is omitted. You can specify multiple account IDs per request.
     */
    accountIds?: AccountIds;
    /**
     * An array of objects to specify a filter that exports a more specific set of instance recommendations.
     */
    filters?: Filters;
    /**
     * The recommendations data to include in the export file. For more information about the fields that can be exported, see Exported files in the Compute Optimizer User Guide.
     */
    fieldsToExport?: ExportableInstanceFields;
    /**
     * An object to specify the destination Amazon Simple Storage Service (Amazon S3) bucket name and key prefix for the export job. You must create the destination Amazon S3 bucket for your recommendations export before you create the export job. Compute Optimizer does not create the S3 bucket for you. After you create the S3 bucket, ensure that it has the required permissions policy to allow Compute Optimizer to write the export file to it. If you plan to specify an object prefix when you create the export job, you must include the object prefix in the policy that you add to the S3 bucket. For more information, see Amazon S3 Bucket Policy for Compute Optimizer in the Compute Optimizer User Guide.
     */
    s3DestinationConfig: S3DestinationConfig;
    /**
     * The format of the export file. The only export file format currently supported is Csv.
     */
    fileFormat?: FileFormat;
    /**
     * Indicates whether to include recommendations for resources in all member accounts of the organization if your account is the management account of an organization. The member accounts must also be opted in to Compute Optimizer, and trusted access for Compute Optimizer must be enabled in the organization account. For more information, see Compute Optimizer and Amazon Web Services Organizations trusted access in the Compute Optimizer User Guide. Recommendations for member accounts of the organization are not included in the export file if this parameter is omitted. Recommendations for member accounts are not included in the export if this parameter, or the account IDs parameter, is omitted.
     */
    includeMemberAccounts?: IncludeMemberAccounts;
    /**
     * An object to specify the preferences for the Amazon EC2 instance recommendations to export.
     */
    recommendationPreferences?: RecommendationPreferences;
  }
  export interface ExportEC2InstanceRecommendationsResponse {
    /**
     * The identification number of the export job. Use the DescribeRecommendationExportJobs action, and specify the job ID to view the status of an export job.
     */
    jobId?: JobId;
    /**
     * An object that describes the destination Amazon S3 bucket of a recommendations export file.
     */
    s3Destination?: S3Destination;
  }
  export interface ExportECSServiceRecommendationsRequest {
    /**
     *  The Amazon Web Services account IDs for the export Amazon ECS service recommendations.  If your account is the management account or the delegated administrator of an organization, use this parameter to specify the member account you want to export recommendations to. This parameter can't be specified together with the include member accounts parameter. The parameters are mutually exclusive. If this parameter or the include member accounts parameter is omitted, the recommendations for member accounts aren't included in the export. You can specify multiple account IDs per request.
     */
    accountIds?: AccountIds;
    /**
     *  An array of objects to specify a filter that exports a more specific set of Amazon ECS service recommendations. 
     */
    filters?: ECSServiceRecommendationFilters;
    /**
     * The recommendations data to include in the export file. For more information about the fields that can be exported, see Exported files in the Compute Optimizer User Guide.
     */
    fieldsToExport?: ExportableECSServiceFields;
    s3DestinationConfig: S3DestinationConfig;
    /**
     *  The format of the export file.  The CSV file is the only export file format currently supported.
     */
    fileFormat?: FileFormat;
    /**
     * If your account is the management account or the delegated administrator of an organization, this parameter indicates whether to include recommendations for resources in all member accounts of the organization. The member accounts must also be opted in to Compute Optimizer, and trusted access for Compute Optimizer must be enabled in the organization account. For more information, see Compute Optimizer and Amazon Web Services Organizations trusted access in the Compute Optimizer User Guide. If this parameter is omitted, recommendations for member accounts of the organization aren't included in the export file. If this parameter or the account ID parameter is omitted, recommendations for member accounts aren't included in the export.
     */
    includeMemberAccounts?: IncludeMemberAccounts;
  }
  export interface ExportECSServiceRecommendationsResponse {
    /**
     *  The identification number of the export job.  To view the status of an export job, use the DescribeRecommendationExportJobs action and specify the job ID. 
     */
    jobId?: JobId;
    s3Destination?: S3Destination;
  }
  export interface ExportLambdaFunctionRecommendationsRequest {
    /**
     * The IDs of the Amazon Web Services accounts for which to export Lambda function recommendations. If your account is the management account of an organization, use this parameter to specify the member account for which you want to export recommendations. This parameter cannot be specified together with the include member accounts parameter. The parameters are mutually exclusive. Recommendations for member accounts are not included in the export if this parameter, or the include member accounts parameter, is omitted. You can specify multiple account IDs per request.
     */
    accountIds?: AccountIds;
    /**
     * An array of objects to specify a filter that exports a more specific set of Lambda function recommendations.
     */
    filters?: LambdaFunctionRecommendationFilters;
    /**
     * The recommendations data to include in the export file. For more information about the fields that can be exported, see Exported files in the Compute Optimizer User Guide.
     */
    fieldsToExport?: ExportableLambdaFunctionFields;
    s3DestinationConfig: S3DestinationConfig;
    /**
     * The format of the export file. The only export file format currently supported is Csv.
     */
    fileFormat?: FileFormat;
    /**
     * Indicates whether to include recommendations for resources in all member accounts of the organization if your account is the management account of an organization. The member accounts must also be opted in to Compute Optimizer, and trusted access for Compute Optimizer must be enabled in the organization account. For more information, see Compute Optimizer and Amazon Web Services Organizations trusted access in the Compute Optimizer User Guide. Recommendations for member accounts of the organization are not included in the export file if this parameter is omitted. This parameter cannot be specified together with the account IDs parameter. The parameters are mutually exclusive. Recommendations for member accounts are not included in the export if this parameter, or the account IDs parameter, is omitted.
     */
    includeMemberAccounts?: IncludeMemberAccounts;
  }
  export interface ExportLambdaFunctionRecommendationsResponse {
    /**
     * The identification number of the export job. Use the DescribeRecommendationExportJobs action, and specify the job ID to view the status of an export job.
     */
    jobId?: JobId;
    s3Destination?: S3Destination;
  }
  export interface ExportLicenseRecommendationsRequest {
    /**
     * The IDs of the Amazon Web Services accounts for which to export license recommendations. If your account is the management account of an organization, use this parameter to specify the member account for which you want to export recommendations. This parameter can't be specified together with the include member accounts parameter. The parameters are mutually exclusive. If this parameter is omitted, recommendations for member accounts aren't included in the export. You can specify multiple account IDs per request.
     */
    accountIds?: AccountIds;
    /**
     *  An array of objects to specify a filter that exports a more specific set of license recommendations. 
     */
    filters?: LicenseRecommendationFilters;
    /**
     * The recommendations data to include in the export file. For more information about the fields that can be exported, see Exported files in the Compute Optimizer User Guide.
     */
    fieldsToExport?: ExportableLicenseFields;
    s3DestinationConfig: S3DestinationConfig;
    /**
     * The format of the export file. A CSV file is the only export format currently supported.
     */
    fileFormat?: FileFormat;
    /**
     * Indicates whether to include recommendations for resources in all member accounts of the organization if your account is the management account of an organization. The member accounts must also be opted in to Compute Optimizer, and trusted access for Compute Optimizer must be enabled in the organization account. For more information, see Compute Optimizer and Amazon Web Services Organizations trusted access in the Compute Optimizer User Guide. If this parameter is omitted, recommendations for member accounts of the organization aren't included in the export file . This parameter cannot be specified together with the account IDs parameter. The parameters are mutually exclusive.
     */
    includeMemberAccounts?: IncludeMemberAccounts;
  }
  export interface ExportLicenseRecommendationsResponse {
    /**
     *  The identification number of the export job.  To view the status of an export job, use the DescribeRecommendationExportJobs action and specify the job ID.
     */
    jobId?: JobId;
    s3Destination?: S3Destination;
  }
  export type ExportableAutoScalingGroupField = "AccountId"|"AutoScalingGroupArn"|"AutoScalingGroupName"|"Finding"|"UtilizationMetricsCpuMaximum"|"UtilizationMetricsMemoryMaximum"|"UtilizationMetricsEbsReadOpsPerSecondMaximum"|"UtilizationMetricsEbsWriteOpsPerSecondMaximum"|"UtilizationMetricsEbsReadBytesPerSecondMaximum"|"UtilizationMetricsEbsWriteBytesPerSecondMaximum"|"UtilizationMetricsDiskReadOpsPerSecondMaximum"|"UtilizationMetricsDiskWriteOpsPerSecondMaximum"|"UtilizationMetricsDiskReadBytesPerSecondMaximum"|"UtilizationMetricsDiskWriteBytesPerSecondMaximum"|"UtilizationMetricsNetworkInBytesPerSecondMaximum"|"UtilizationMetricsNetworkOutBytesPerSecondMaximum"|"UtilizationMetricsNetworkPacketsInPerSecondMaximum"|"UtilizationMetricsNetworkPacketsOutPerSecondMaximum"|"LookbackPeriodInDays"|"CurrentConfigurationInstanceType"|"CurrentConfigurationDesiredCapacity"|"CurrentConfigurationMinSize"|"CurrentConfigurationMaxSize"|"CurrentOnDemandPrice"|"CurrentStandardOneYearNoUpfrontReservedPrice"|"CurrentStandardThreeYearNoUpfrontReservedPrice"|"CurrentVCpus"|"CurrentMemory"|"CurrentStorage"|"CurrentNetwork"|"RecommendationOptionsConfigurationInstanceType"|"RecommendationOptionsConfigurationDesiredCapacity"|"RecommendationOptionsConfigurationMinSize"|"RecommendationOptionsConfigurationMaxSize"|"RecommendationOptionsProjectedUtilizationMetricsCpuMaximum"|"RecommendationOptionsProjectedUtilizationMetricsMemoryMaximum"|"RecommendationOptionsPerformanceRisk"|"RecommendationOptionsOnDemandPrice"|"RecommendationOptionsStandardOneYearNoUpfrontReservedPrice"|"RecommendationOptionsStandardThreeYearNoUpfrontReservedPrice"|"RecommendationOptionsVcpus"|"RecommendationOptionsMemory"|"RecommendationOptionsStorage"|"RecommendationOptionsNetwork"|"LastRefreshTimestamp"|"CurrentPerformanceRisk"|"RecommendationOptionsSavingsOpportunityPercentage"|"RecommendationOptionsEstimatedMonthlySavingsCurrency"|"RecommendationOptionsEstimatedMonthlySavingsValue"|"EffectiveRecommendationPreferencesCpuVendorArchitectures"|"EffectiveRecommendationPreferencesEnhancedInfrastructureMetrics"|"EffectiveRecommendationPreferencesInferredWorkloadTypes"|"InferredWorkloadTypes"|"RecommendationOptionsMigrationEffort"|"CurrentInstanceGpuInfo"|"RecommendationOptionsInstanceGpuInfo"|"UtilizationMetricsGpuPercentageMaximum"|"UtilizationMetricsGpuMemoryPercentageMaximum"|"RecommendationOptionsProjectedUtilizationMetricsGpuPercentageMaximum"|"RecommendationOptionsProjectedUtilizationMetricsGpuMemoryPercentageMaximum"|string;
  export type ExportableAutoScalingGroupFields = ExportableAutoScalingGroupField[];
  export type ExportableECSServiceField = "AccountId"|"ServiceArn"|"LookbackPeriodInDays"|"LastRefreshTimestamp"|"LaunchType"|"CurrentPerformanceRisk"|"CurrentServiceConfigurationMemory"|"CurrentServiceConfigurationCpu"|"CurrentServiceConfigurationTaskDefinitionArn"|"CurrentServiceConfigurationAutoScalingConfiguration"|"CurrentServiceContainerConfigurations"|"UtilizationMetricsCpuMaximum"|"UtilizationMetricsMemoryMaximum"|"Finding"|"FindingReasonCodes"|"RecommendationOptionsMemory"|"RecommendationOptionsCpu"|"RecommendationOptionsSavingsOpportunityPercentage"|"RecommendationOptionsEstimatedMonthlySavingsCurrency"|"RecommendationOptionsEstimatedMonthlySavingsValue"|"RecommendationOptionsContainerRecommendations"|"RecommendationOptionsProjectedUtilizationMetricsCpuMaximum"|"RecommendationOptionsProjectedUtilizationMetricsMemoryMaximum"|"Tags"|string;
  export type ExportableECSServiceFields = ExportableECSServiceField[];
  export type ExportableInstanceField = "AccountId"|"InstanceArn"|"InstanceName"|"Finding"|"FindingReasonCodes"|"LookbackPeriodInDays"|"CurrentInstanceType"|"UtilizationMetricsCpuMaximum"|"UtilizationMetricsMemoryMaximum"|"UtilizationMetricsEbsReadOpsPerSecondMaximum"|"UtilizationMetricsEbsWriteOpsPerSecondMaximum"|"UtilizationMetricsEbsReadBytesPerSecondMaximum"|"UtilizationMetricsEbsWriteBytesPerSecondMaximum"|"UtilizationMetricsDiskReadOpsPerSecondMaximum"|"UtilizationMetricsDiskWriteOpsPerSecondMaximum"|"UtilizationMetricsDiskReadBytesPerSecondMaximum"|"UtilizationMetricsDiskWriteBytesPerSecondMaximum"|"UtilizationMetricsNetworkInBytesPerSecondMaximum"|"UtilizationMetricsNetworkOutBytesPerSecondMaximum"|"UtilizationMetricsNetworkPacketsInPerSecondMaximum"|"UtilizationMetricsNetworkPacketsOutPerSecondMaximum"|"CurrentOnDemandPrice"|"CurrentStandardOneYearNoUpfrontReservedPrice"|"CurrentStandardThreeYearNoUpfrontReservedPrice"|"CurrentVCpus"|"CurrentMemory"|"CurrentStorage"|"CurrentNetwork"|"RecommendationOptionsInstanceType"|"RecommendationOptionsProjectedUtilizationMetricsCpuMaximum"|"RecommendationOptionsProjectedUtilizationMetricsMemoryMaximum"|"RecommendationOptionsPlatformDifferences"|"RecommendationOptionsPerformanceRisk"|"RecommendationOptionsVcpus"|"RecommendationOptionsMemory"|"RecommendationOptionsStorage"|"RecommendationOptionsNetwork"|"RecommendationOptionsOnDemandPrice"|"RecommendationOptionsStandardOneYearNoUpfrontReservedPrice"|"RecommendationOptionsStandardThreeYearNoUpfrontReservedPrice"|"RecommendationsSourcesRecommendationSourceArn"|"RecommendationsSourcesRecommendationSourceType"|"LastRefreshTimestamp"|"CurrentPerformanceRisk"|"RecommendationOptionsSavingsOpportunityPercentage"|"RecommendationOptionsEstimatedMonthlySavingsCurrency"|"RecommendationOptionsEstimatedMonthlySavingsValue"|"EffectiveRecommendationPreferencesCpuVendorArchitectures"|"EffectiveRecommendationPreferencesEnhancedInfrastructureMetrics"|"EffectiveRecommendationPreferencesInferredWorkloadTypes"|"InferredWorkloadTypes"|"RecommendationOptionsMigrationEffort"|"EffectiveRecommendationPreferencesExternalMetricsSource"|"InstanceState"|"Tags"|"ExternalMetricStatusCode"|"ExternalMetricStatusReason"|"CurrentInstanceGpuInfo"|"RecommendationOptionsInstanceGpuInfo"|"UtilizationMetricsGpuPercentageMaximum"|"UtilizationMetricsGpuMemoryPercentageMaximum"|"RecommendationOptionsProjectedUtilizationMetricsGpuPercentageMaximum"|"RecommendationOptionsProjectedUtilizationMetricsGpuMemoryPercentageMaximum"|"Idle"|string;
  export type ExportableInstanceFields = ExportableInstanceField[];
  export type ExportableLambdaFunctionField = "AccountId"|"FunctionArn"|"FunctionVersion"|"Finding"|"FindingReasonCodes"|"NumberOfInvocations"|"UtilizationMetricsDurationMaximum"|"UtilizationMetricsDurationAverage"|"UtilizationMetricsMemoryMaximum"|"UtilizationMetricsMemoryAverage"|"LookbackPeriodInDays"|"CurrentConfigurationMemorySize"|"CurrentConfigurationTimeout"|"CurrentCostTotal"|"CurrentCostAverage"|"RecommendationOptionsConfigurationMemorySize"|"RecommendationOptionsCostLow"|"RecommendationOptionsCostHigh"|"RecommendationOptionsProjectedUtilizationMetricsDurationLowerBound"|"RecommendationOptionsProjectedUtilizationMetricsDurationUpperBound"|"RecommendationOptionsProjectedUtilizationMetricsDurationExpected"|"LastRefreshTimestamp"|"CurrentPerformanceRisk"|"RecommendationOptionsSavingsOpportunityPercentage"|"RecommendationOptionsEstimatedMonthlySavingsCurrency"|"RecommendationOptionsEstimatedMonthlySavingsValue"|"Tags"|string;
  export type ExportableLambdaFunctionFields = ExportableLambdaFunctionField[];
  export type ExportableLicenseField = "AccountId"|"ResourceArn"|"LookbackPeriodInDays"|"LastRefreshTimestamp"|"Finding"|"FindingReasonCodes"|"CurrentLicenseConfigurationNumberOfCores"|"CurrentLicenseConfigurationInstanceType"|"CurrentLicenseConfigurationOperatingSystem"|"CurrentLicenseConfigurationLicenseName"|"CurrentLicenseConfigurationLicenseEdition"|"CurrentLicenseConfigurationLicenseModel"|"CurrentLicenseConfigurationLicenseVersion"|"CurrentLicenseConfigurationMetricsSource"|"RecommendationOptionsOperatingSystem"|"RecommendationOptionsLicenseEdition"|"RecommendationOptionsLicenseModel"|"RecommendationOptionsSavingsOpportunityPercentage"|"RecommendationOptionsEstimatedMonthlySavingsCurrency"|"RecommendationOptionsEstimatedMonthlySavingsValue"|"Tags"|string;
  export type ExportableLicenseFields = ExportableLicenseField[];
  export type ExportableVolumeField = "AccountId"|"VolumeArn"|"Finding"|"UtilizationMetricsVolumeReadOpsPerSecondMaximum"|"UtilizationMetricsVolumeWriteOpsPerSecondMaximum"|"UtilizationMetricsVolumeReadBytesPerSecondMaximum"|"UtilizationMetricsVolumeWriteBytesPerSecondMaximum"|"LookbackPeriodInDays"|"CurrentConfigurationVolumeType"|"CurrentConfigurationVolumeBaselineIOPS"|"CurrentConfigurationVolumeBaselineThroughput"|"CurrentConfigurationVolumeBurstIOPS"|"CurrentConfigurationVolumeBurstThroughput"|"CurrentConfigurationVolumeSize"|"CurrentMonthlyPrice"|"RecommendationOptionsConfigurationVolumeType"|"RecommendationOptionsConfigurationVolumeBaselineIOPS"|"RecommendationOptionsConfigurationVolumeBaselineThroughput"|"RecommendationOptionsConfigurationVolumeBurstIOPS"|"RecommendationOptionsConfigurationVolumeBurstThroughput"|"RecommendationOptionsConfigurationVolumeSize"|"RecommendationOptionsMonthlyPrice"|"RecommendationOptionsPerformanceRisk"|"LastRefreshTimestamp"|"CurrentPerformanceRisk"|"RecommendationOptionsSavingsOpportunityPercentage"|"RecommendationOptionsEstimatedMonthlySavingsCurrency"|"RecommendationOptionsEstimatedMonthlySavingsValue"|"RootVolume"|"Tags"|"CurrentConfigurationRootVolume"|string;
  export type ExportableVolumeFields = ExportableVolumeField[];
  export interface ExternalMetricStatus {
    /**
     *  The status code for Compute Optimizer's integration with an external metrics provider. 
     */
    statusCode?: ExternalMetricStatusCode;
    /**
     *  The reason for Compute Optimizer's integration status with your external metric provider. 
     */
    statusReason?: ExternalMetricStatusReason;
  }
  export type ExternalMetricStatusCode = "NO_EXTERNAL_METRIC_SET"|"INTEGRATION_SUCCESS"|"DATADOG_INTEGRATION_ERROR"|"DYNATRACE_INTEGRATION_ERROR"|"NEWRELIC_INTEGRATION_ERROR"|"INSTANA_INTEGRATION_ERROR"|"INSUFFICIENT_DATADOG_METRICS"|"INSUFFICIENT_DYNATRACE_METRICS"|"INSUFFICIENT_NEWRELIC_METRICS"|"INSUFFICIENT_INSTANA_METRICS"|string;
  export type ExternalMetricStatusReason = string;
  export interface ExternalMetricsPreference {
    /**
     *  Contains the source options for external metrics preferences. 
     */
    source?: ExternalMetricsSource;
  }
  export type ExternalMetricsSource = "Datadog"|"Dynatrace"|"NewRelic"|"Instana"|string;
  export type FailureReason = string;
  export type FileFormat = "Csv"|string;
  export interface Filter {
    /**
     * The name of the filter. Specify Finding to return recommendations with a specific finding classification. For example, Underprovisioned. Specify RecommendationSourceType to return recommendations of a specific resource type. For example, Ec2Instance. Specify FindingReasonCodes to return recommendations with a specific finding reason code. For example, CPUUnderprovisioned. Specify InferredWorkloadTypes to return recommendations of a specific inferred workload. For example, Redis. You can filter your EC2 instance recommendations by tag:key and tag-key tags. A tag:key is a key and value combination of a tag assigned to your recommendations. Use the tag key in the filter name and the tag value as the filter value. For example, to find all recommendations that have a tag with the key of Owner and the value of TeamA, specify tag:Owner for the filter name and TeamA for the filter value. A tag-key is the key of a tag assigned to your recommendations. Use this filter to find all of your recommendations that have a tag with a specific key. This doesn’t consider the tag value. For example, you can find your recommendations with a tag key value of Owner or without any tag keys assigned.
     */
    name?: FilterName;
    /**
     * The value of the filter. The valid values for this parameter are as follows, depending on what you specify for the name parameter and the resource type that you wish to filter results for:   Specify Optimized or NotOptimized if you specify the name parameter as Finding and you want to filter results for Auto Scaling groups.   Specify Underprovisioned, Overprovisioned, or Optimized if you specify the name parameter as Finding and you want to filter results for EC2 instances.   Specify Ec2Instance or AutoScalingGroup if you specify the name parameter as RecommendationSourceType.   Specify one of the following options if you specify the name parameter as FindingReasonCodes:     CPUOverprovisioned  — The instance’s CPU configuration can be sized down while still meeting the performance requirements of your workload.     CPUUnderprovisioned  — The instance’s CPU configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better CPU performance.     MemoryOverprovisioned  — The instance’s memory configuration can be sized down while still meeting the performance requirements of your workload.     MemoryUnderprovisioned  — The instance’s memory configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better memory performance.     EBSThroughputOverprovisioned  — The instance’s EBS throughput configuration can be sized down while still meeting the performance requirements of your workload.     EBSThroughputUnderprovisioned  — The instance’s EBS throughput configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better EBS throughput performance.     EBSIOPSOverprovisioned  — The instance’s EBS IOPS configuration can be sized down while still meeting the performance requirements of your workload.     EBSIOPSUnderprovisioned  — The instance’s EBS IOPS configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better EBS IOPS performance.     NetworkBandwidthOverprovisioned  — The instance’s network bandwidth configuration can be sized down while still meeting the performance requirements of your workload.     NetworkBandwidthUnderprovisioned  — The instance’s network bandwidth configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better network bandwidth performance. This finding reason happens when the NetworkIn or NetworkOut performance of an instance is impacted.     NetworkPPSOverprovisioned  — The instance’s network PPS (packets per second) configuration can be sized down while still meeting the performance requirements of your workload.     NetworkPPSUnderprovisioned  — The instance’s network PPS (packets per second) configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better network PPS performance.     DiskIOPSOverprovisioned  — The instance’s disk IOPS configuration can be sized down while still meeting the performance requirements of your workload.     DiskIOPSUnderprovisioned  — The instance’s disk IOPS configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better disk IOPS performance.     DiskThroughputOverprovisioned  — The instance’s disk throughput configuration can be sized down while still meeting the performance requirements of your workload.     DiskThroughputUnderprovisioned  — The instance’s disk throughput configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better disk throughput performance.    
     */
    values?: FilterValues;
  }
  export type FilterName = "Finding"|"FindingReasonCodes"|"RecommendationSourceType"|"InferredWorkloadTypes"|string;
  export type FilterValue = string;
  export type FilterValues = FilterValue[];
  export type Filters = Filter[];
  export type Finding = "Underprovisioned"|"Overprovisioned"|"Optimized"|"NotOptimized"|string;
  export type FindingReasonCode = "MemoryOverprovisioned"|"MemoryUnderprovisioned"|string;
  export type FunctionArn = string;
  export type FunctionArns = FunctionArn[];
  export type FunctionVersion = string;
  export interface GetAutoScalingGroupRecommendationsRequest {
    /**
     * The ID of the Amazon Web Services account for which to return Auto Scaling group recommendations. If your account is the management account of an organization, use this parameter to specify the member account for which you want to return Auto Scaling group recommendations. Only one account ID can be specified per request.
     */
    accountIds?: AccountIds;
    /**
     * The Amazon Resource Name (ARN) of the Auto Scaling groups for which to return recommendations.
     */
    autoScalingGroupArns?: AutoScalingGroupArns;
    /**
     * The token to advance to the next page of Auto Scaling group recommendations.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of Auto Scaling group recommendations to return with a single request. To retrieve the remaining results, make another request with the returned nextToken value.
     */
    maxResults?: MaxResults;
    /**
     * An array of objects to specify a filter that returns a more specific list of Auto Scaling group recommendations.
     */
    filters?: Filters;
    /**
     * An object to specify the preferences for the Auto Scaling group recommendations to return in the response.
     */
    recommendationPreferences?: RecommendationPreferences;
  }
  export interface GetAutoScalingGroupRecommendationsResponse {
    /**
     * The token to use to advance to the next page of Auto Scaling group recommendations. This value is null when there are no more pages of Auto Scaling group recommendations to return.
     */
    nextToken?: NextToken;
    /**
     * An array of objects that describe Auto Scaling group recommendations.
     */
    autoScalingGroupRecommendations?: AutoScalingGroupRecommendations;
    /**
     * An array of objects that describe errors of the request. For example, an error is returned if you request recommendations for an unsupported Auto Scaling group.
     */
    errors?: GetRecommendationErrors;
  }
  export interface GetEBSVolumeRecommendationsRequest {
    /**
     * The Amazon Resource Name (ARN) of the volumes for which to return recommendations.
     */
    volumeArns?: VolumeArns;
    /**
     * The token to advance to the next page of volume recommendations.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of volume recommendations to return with a single request. To retrieve the remaining results, make another request with the returned nextToken value.
     */
    maxResults?: MaxResults;
    /**
     * An array of objects to specify a filter that returns a more specific list of volume recommendations.
     */
    filters?: EBSFilters;
    /**
     * The ID of the Amazon Web Services account for which to return volume recommendations. If your account is the management account of an organization, use this parameter to specify the member account for which you want to return volume recommendations. Only one account ID can be specified per request.
     */
    accountIds?: AccountIds;
  }
  export interface GetEBSVolumeRecommendationsResponse {
    /**
     * The token to use to advance to the next page of volume recommendations. This value is null when there are no more pages of volume recommendations to return.
     */
    nextToken?: NextToken;
    /**
     * An array of objects that describe volume recommendations.
     */
    volumeRecommendations?: VolumeRecommendations;
    /**
     * An array of objects that describe errors of the request. For example, an error is returned if you request recommendations for an unsupported volume.
     */
    errors?: GetRecommendationErrors;
  }
  export interface GetEC2InstanceRecommendationsRequest {
    /**
     * The Amazon Resource Name (ARN) of the instances for which to return recommendations.
     */
    instanceArns?: InstanceArns;
    /**
     * The token to advance to the next page of instance recommendations.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of instance recommendations to return with a single request. To retrieve the remaining results, make another request with the returned nextToken value.
     */
    maxResults?: MaxResults;
    /**
     * An array of objects to specify a filter that returns a more specific list of instance recommendations.
     */
    filters?: Filters;
    /**
     * The ID of the Amazon Web Services account for which to return instance recommendations. If your account is the management account of an organization, use this parameter to specify the member account for which you want to return instance recommendations. Only one account ID can be specified per request.
     */
    accountIds?: AccountIds;
    /**
     * An object to specify the preferences for the Amazon EC2 instance recommendations to return in the response.
     */
    recommendationPreferences?: RecommendationPreferences;
  }
  export interface GetEC2InstanceRecommendationsResponse {
    /**
     * The token to use to advance to the next page of instance recommendations. This value is null when there are no more pages of instance recommendations to return.
     */
    nextToken?: NextToken;
    /**
     * An array of objects that describe instance recommendations.
     */
    instanceRecommendations?: InstanceRecommendations;
    /**
     * An array of objects that describe errors of the request. For example, an error is returned if you request recommendations for an instance of an unsupported instance family.
     */
    errors?: GetRecommendationErrors;
  }
  export interface GetEC2RecommendationProjectedMetricsRequest {
    /**
     * The Amazon Resource Name (ARN) of the instances for which to return recommendation projected metrics.
     */
    instanceArn: InstanceArn;
    /**
     * The statistic of the projected metrics.
     */
    stat: MetricStatistic;
    /**
     * The granularity, in seconds, of the projected metrics data points.
     */
    period: Period;
    /**
     * The timestamp of the first projected metrics data point to return.
     */
    startTime: Timestamp;
    /**
     * The timestamp of the last projected metrics data point to return.
     */
    endTime: Timestamp;
    /**
     * An object to specify the preferences for the Amazon EC2 recommendation projected metrics to return in the response.
     */
    recommendationPreferences?: RecommendationPreferences;
  }
  export interface GetEC2RecommendationProjectedMetricsResponse {
    /**
     * An array of objects that describes projected metrics.
     */
    recommendedOptionProjectedMetrics?: RecommendedOptionProjectedMetrics;
  }
  export interface GetECSServiceRecommendationProjectedMetricsRequest {
    /**
     *  The ARN that identifies the Amazon ECS service.   The following is the format of the ARN:   arn:aws:ecs:region:aws_account_id:service/cluster-name/service-name 
     */
    serviceArn: ServiceArn;
    /**
     *  The statistic of the projected metrics. 
     */
    stat: MetricStatistic;
    /**
     *  The granularity, in seconds, of the projected metrics data points. 
     */
    period: Period;
    /**
     *  The timestamp of the first projected metrics data point to return. 
     */
    startTime: Timestamp;
    /**
     *  The timestamp of the last projected metrics data point to return. 
     */
    endTime: Timestamp;
  }
  export interface GetECSServiceRecommendationProjectedMetricsResponse {
    /**
     *  An array of objects that describes the projected metrics. 
     */
    recommendedOptionProjectedMetrics?: ECSServiceRecommendedOptionProjectedMetrics;
  }
  export interface GetECSServiceRecommendationsRequest {
    /**
     *  The ARN that identifies the Amazon ECS service.   The following is the format of the ARN:   arn:aws:ecs:region:aws_account_id:service/cluster-name/service-name 
     */
    serviceArns?: ServiceArns;
    /**
     *  The token to advance to the next page of Amazon ECS service recommendations. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of Amazon ECS service recommendations to return with a single request.  To retrieve the remaining results, make another request with the returned nextToken value.
     */
    maxResults?: MaxResults;
    /**
     *  An array of objects to specify a filter that returns a more specific list of Amazon ECS service recommendations. 
     */
    filters?: ECSServiceRecommendationFilters;
    /**
     *  Return the Amazon ECS service recommendations to the specified Amazon Web Services account IDs.  If your account is the management account or the delegated administrator of an organization, use this parameter to return the Amazon ECS service recommendations to specific member accounts. You can only specify one account ID per request.
     */
    accountIds?: AccountIds;
  }
  export interface GetECSServiceRecommendationsResponse {
    /**
     *  The token to advance to the next page of Amazon ECS service recommendations. 
     */
    nextToken?: NextToken;
    /**
     *  An array of objects that describe the Amazon ECS service recommendations. 
     */
    ecsServiceRecommendations?: ECSServiceRecommendations;
    /**
     *  An array of objects that describe errors of the request. 
     */
    errors?: GetRecommendationErrors;
  }
  export interface GetEffectiveRecommendationPreferencesRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource for which to confirm effective recommendation preferences. Only EC2 instance and Auto Scaling group ARNs are currently supported.
     */
    resourceArn: ResourceArn;
  }
  export interface GetEffectiveRecommendationPreferencesResponse {
    /**
     * The status of the enhanced infrastructure metrics recommendation preference. Considers all applicable preferences that you might have set at the resource, account, and organization level. A status of Active confirms that the preference is applied in the latest recommendation refresh, and a status of Inactive confirms that it's not yet applied to recommendations. To validate whether the preference is applied to your last generated set of recommendations, review the effectiveRecommendationPreferences value in the response of the GetAutoScalingGroupRecommendations and GetEC2InstanceRecommendations actions. For more information, see Enhanced infrastructure metrics in the Compute Optimizer User Guide.
     */
    enhancedInfrastructureMetrics?: EnhancedInfrastructureMetrics;
    /**
     * The provider of the external metrics recommendation preference. Considers all applicable preferences that you might have set at the account and organization level. If the preference is applied in the latest recommendation refresh, an object with a valid source value appears in the response. If the preference isn't applied to the recommendations already, then this object doesn't appear in the response. To validate whether the preference is applied to your last generated set of recommendations, review the effectiveRecommendationPreferences value in the response of the GetEC2InstanceRecommendations actions. For more information, see Enhanced infrastructure metrics in the Compute Optimizer User Guide.
     */
    externalMetricsPreference?: ExternalMetricsPreference;
  }
  export interface GetEnrollmentStatusRequest {
  }
  export interface GetEnrollmentStatusResponse {
    /**
     * The enrollment status of the account.
     */
    status?: Status;
    /**
     * The reason for the enrollment status of the account. For example, an account might show a status of Pending because member accounts of an organization require more time to be enrolled in the service.
     */
    statusReason?: StatusReason;
    /**
     * Confirms the enrollment status of member accounts of the organization, if the account is a management account of an organization.
     */
    memberAccountsEnrolled?: MemberAccountsEnrolled;
    /**
     * The Unix epoch timestamp, in seconds, of when the account enrollment status was last updated.
     */
    lastUpdatedTimestamp?: LastUpdatedTimestamp;
    /**
     * The count of organization member accounts that are opted in to the service, if your account is an organization management account.
     */
    numberOfMemberAccountsOptedIn?: NumberOfMemberAccountsOptedIn;
  }
  export interface GetEnrollmentStatusesForOrganizationRequest {
    /**
     * An array of objects to specify a filter that returns a more specific list of account enrollment statuses.
     */
    filters?: EnrollmentFilters;
    /**
     * The token to advance to the next page of account enrollment statuses.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of account enrollment statuses to return with a single request. You can specify up to 100 statuses to return with each request. To retrieve the remaining results, make another request with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface GetEnrollmentStatusesForOrganizationResponse {
    /**
     * An array of objects that describe the enrollment statuses of organization member accounts.
     */
    accountEnrollmentStatuses?: AccountEnrollmentStatuses;
    /**
     * The token to use to advance to the next page of account enrollment statuses. This value is null when there are no more pages of account enrollment statuses to return.
     */
    nextToken?: NextToken;
  }
  export interface GetLambdaFunctionRecommendationsRequest {
    /**
     * The Amazon Resource Name (ARN) of the functions for which to return recommendations. You can specify a qualified or unqualified ARN. If you specify an unqualified ARN without a function version suffix, Compute Optimizer will return recommendations for the latest ($LATEST) version of the function. If you specify a qualified ARN with a version suffix, Compute Optimizer will return recommendations for the specified function version. For more information about using function versions, see Using versions in the Lambda Developer Guide.
     */
    functionArns?: FunctionArns;
    /**
     * The ID of the Amazon Web Services account for which to return function recommendations. If your account is the management account of an organization, use this parameter to specify the member account for which you want to return function recommendations. Only one account ID can be specified per request.
     */
    accountIds?: AccountIds;
    /**
     * An array of objects to specify a filter that returns a more specific list of function recommendations.
     */
    filters?: LambdaFunctionRecommendationFilters;
    /**
     * The token to advance to the next page of function recommendations.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of function recommendations to return with a single request. To retrieve the remaining results, make another request with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface GetLambdaFunctionRecommendationsResponse {
    /**
     * The token to use to advance to the next page of function recommendations. This value is null when there are no more pages of function recommendations to return.
     */
    nextToken?: NextToken;
    /**
     * An array of objects that describe function recommendations.
     */
    lambdaFunctionRecommendations?: LambdaFunctionRecommendations;
  }
  export interface GetLicenseRecommendationsRequest {
    /**
     *  The ARN that identifies the Amazon EC2 instance.   The following is the format of the ARN:   arn:aws:ec2:region:aws_account_id:instance/instance-id 
     */
    resourceArns?: ResourceArns;
    /**
     *  The token to advance to the next page of license recommendations. 
     */
    nextToken?: NextToken;
    /**
     *  The maximum number of license recommendations to return with a single request.   To retrieve the remaining results, make another request with the returned nextToken value. 
     */
    maxResults?: MaxResults;
    /**
     *  An array of objects to specify a filter that returns a more specific list of license recommendations. 
     */
    filters?: LicenseRecommendationFilters;
    /**
     * The ID of the Amazon Web Services account for which to return license recommendations. If your account is the management account of an organization, use this parameter to specify the member account for which you want to return license recommendations. Only one account ID can be specified per request.
     */
    accountIds?: AccountIds;
  }
  export interface GetLicenseRecommendationsResponse {
    /**
     *  The token to use to advance to the next page of license recommendations. 
     */
    nextToken?: NextToken;
    /**
     *  An array of objects that describe license recommendations. 
     */
    licenseRecommendations?: LicenseRecommendations;
    /**
     *  An array of objects that describe errors of the request. 
     */
    errors?: GetRecommendationErrors;
  }
  export interface GetRecommendationError {
    /**
     * The ID of the error.
     */
    identifier?: Identifier;
    /**
     * The error code.
     */
    code?: Code;
    /**
     * The message, or reason, for the error.
     */
    message?: Message;
  }
  export type GetRecommendationErrors = GetRecommendationError[];
  export interface GetRecommendationPreferencesRequest {
    /**
     * The target resource type of the recommendation preference for which to return preferences. The Ec2Instance option encompasses standalone instances and instances that are part of Auto Scaling groups. The AutoScalingGroup option encompasses only instances that are part of an Auto Scaling group.  The valid values for this parameter are Ec2Instance and AutoScalingGroup. 
     */
    resourceType: ResourceType;
    /**
     * An object that describes the scope of the recommendation preference to return. You can return recommendation preferences that are created at the organization level (for management accounts of an organization only), account level, and resource level. For more information, see Activating enhanced infrastructure metrics in the Compute Optimizer User Guide.
     */
    scope?: Scope;
    /**
     * The token to advance to the next page of recommendation preferences.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of recommendation preferences to return with a single request. To retrieve the remaining results, make another request with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface GetRecommendationPreferencesResponse {
    /**
     * The token to use to advance to the next page of recommendation preferences. This value is null when there are no more pages of recommendation preferences to return.
     */
    nextToken?: NextToken;
    /**
     * An array of objects that describe recommendation preferences.
     */
    recommendationPreferencesDetails?: RecommendationPreferencesDetails;
  }
  export interface GetRecommendationSummariesRequest {
    /**
     * The ID of the Amazon Web Services account for which to return recommendation summaries. If your account is the management account of an organization, use this parameter to specify the member account for which you want to return recommendation summaries. Only one account ID can be specified per request.
     */
    accountIds?: AccountIds;
    /**
     * The token to advance to the next page of recommendation summaries.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of recommendation summaries to return with a single request. To retrieve the remaining results, make another request with the returned nextToken value.
     */
    maxResults?: MaxResults;
  }
  export interface GetRecommendationSummariesResponse {
    /**
     * The token to use to advance to the next page of recommendation summaries. This value is null when there are no more pages of recommendation summaries to return.
     */
    nextToken?: NextToken;
    /**
     * An array of objects that summarize a recommendation.
     */
    recommendationSummaries?: RecommendationSummaries;
  }
  export interface Gpu {
    /**
     *  The number of GPUs for the instance type. 
     */
    gpuCount?: GpuCount;
    /**
     *  The total size of the memory for the GPU accelerators for the instance type, in MiB. 
     */
    gpuMemorySizeInMiB?: GpuMemorySizeInMiB;
  }
  export type GpuCount = number;
  export interface GpuInfo {
    /**
     *  Describes the GPU accelerators for the instance type. 
     */
    gpus?: Gpus;
  }
  export type GpuMemorySizeInMiB = number;
  export type Gpus = Gpu[];
  export type High = number;
  export type Identifier = string;
  export type IncludeMemberAccounts = boolean;
  export interface InferredWorkloadSaving {
    /**
     * The applications that might be running on the instance as inferred by Compute Optimizer. Compute Optimizer can infer if one of the following applications might be running on the instance:    AmazonEmr - Infers that Amazon EMR might be running on the instance.    ApacheCassandra - Infers that Apache Cassandra might be running on the instance.    ApacheHadoop - Infers that Apache Hadoop might be running on the instance.    Memcached - Infers that Memcached might be running on the instance.    NGINX - Infers that NGINX might be running on the instance.    PostgreSql - Infers that PostgreSQL might be running on the instance.    Redis - Infers that Redis might be running on the instance.    Kafka - Infers that Kafka might be running on the instance.    SQLServer - Infers that SQLServer might be running on the instance.  
     */
    inferredWorkloadTypes?: InferredWorkloadTypes;
    /**
     * An object that describes the estimated monthly savings amount possible by adopting Compute Optimizer recommendations for a given resource. This is based on the On-Demand instance pricing.
     */
    estimatedMonthlySavings?: EstimatedMonthlySavings;
  }
  export type InferredWorkloadSavings = InferredWorkloadSaving[];
  export type InferredWorkloadType = "AmazonEmr"|"ApacheCassandra"|"ApacheHadoop"|"Memcached"|"Nginx"|"PostgreSql"|"Redis"|"Kafka"|"SQLServer"|string;
  export type InferredWorkloadTypes = InferredWorkloadType[];
  export type InferredWorkloadTypesPreference = "Active"|"Inactive"|string;
  export type InstanceArn = string;
  export type InstanceArns = InstanceArn[];
  export type InstanceIdle = "True"|"False"|string;
  export type InstanceName = string;
  export interface InstanceRecommendation {
    /**
     * The Amazon Resource Name (ARN) of the current instance.
     */
    instanceArn?: InstanceArn;
    /**
     * The Amazon Web Services account ID of the instance.
     */
    accountId?: AccountId;
    /**
     * The name of the current instance.
     */
    instanceName?: InstanceName;
    /**
     * The instance type of the current instance.
     */
    currentInstanceType?: CurrentInstanceType;
    /**
     * The finding classification of the instance. Findings for instances include:     Underprovisioned —An instance is considered under-provisioned when at least one specification of your instance, such as CPU, memory, or network, does not meet the performance requirements of your workload. Under-provisioned instances may lead to poor application performance.     Overprovisioned —An instance is considered over-provisioned when at least one specification of your instance, such as CPU, memory, or network, can be sized down while still meeting the performance requirements of your workload, and no specification is under-provisioned. Over-provisioned instances may lead to unnecessary infrastructure cost.     Optimized —An instance is considered optimized when all specifications of your instance, such as CPU, memory, and network, meet the performance requirements of your workload and is not over provisioned. For optimized resources, Compute Optimizer might recommend a new generation instance type.  
     */
    finding?: Finding;
    /**
     * The reason for the finding classification of the instance. Finding reason codes for instances include:     CPUOverprovisioned  — The instance’s CPU configuration can be sized down while still meeting the performance requirements of your workload. This is identified by analyzing the CPUUtilization metric of the current instance during the look-back period.     CPUUnderprovisioned  — The instance’s CPU configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better CPU performance. This is identified by analyzing the CPUUtilization metric of the current instance during the look-back period.     MemoryOverprovisioned  — The instance’s memory configuration can be sized down while still meeting the performance requirements of your workload. This is identified by analyzing the memory utilization metric of the current instance during the look-back period.     MemoryUnderprovisioned  — The instance’s memory configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better memory performance. This is identified by analyzing the memory utilization metric of the current instance during the look-back period.  Memory utilization is analyzed only for resources that have the unified CloudWatch agent installed on them. For more information, see Enabling memory utilization with the Amazon CloudWatch Agent in the Compute Optimizer User Guide. On Linux instances, Compute Optimizer analyses the mem_used_percent metric in the CWAgent namespace, or the legacy MemoryUtilization metric in the System/Linux namespace. On Windows instances, Compute Optimizer analyses the Memory % Committed Bytes In Use metric in the CWAgent namespace.      EBSThroughputOverprovisioned  — The instance’s EBS throughput configuration can be sized down while still meeting the performance requirements of your workload. This is identified by analyzing the VolumeReadBytes and VolumeWriteBytes metrics of EBS volumes attached to the current instance during the look-back period.     EBSThroughputUnderprovisioned  — The instance’s EBS throughput configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better EBS throughput performance. This is identified by analyzing the VolumeReadBytes and VolumeWriteBytes metrics of EBS volumes attached to the current instance during the look-back period.     EBSIOPSOverprovisioned  — The instance’s EBS IOPS configuration can be sized down while still meeting the performance requirements of your workload. This is identified by analyzing the VolumeReadOps and VolumeWriteOps metric of EBS volumes attached to the current instance during the look-back period.     EBSIOPSUnderprovisioned  — The instance’s EBS IOPS configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better EBS IOPS performance. This is identified by analyzing the VolumeReadOps and VolumeWriteOps metric of EBS volumes attached to the current instance during the look-back period.     NetworkBandwidthOverprovisioned  — The instance’s network bandwidth configuration can be sized down while still meeting the performance requirements of your workload. This is identified by analyzing the NetworkIn and NetworkOut metrics of the current instance during the look-back period.     NetworkBandwidthUnderprovisioned  — The instance’s network bandwidth configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better network bandwidth performance. This is identified by analyzing the NetworkIn and NetworkOut metrics of the current instance during the look-back period. This finding reason happens when the NetworkIn or NetworkOut performance of an instance is impacted.     NetworkPPSOverprovisioned  — The instance’s network PPS (packets per second) configuration can be sized down while still meeting the performance requirements of your workload. This is identified by analyzing the NetworkPacketsIn and NetworkPacketsIn metrics of the current instance during the look-back period.     NetworkPPSUnderprovisioned  — The instance’s network PPS (packets per second) configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better network PPS performance. This is identified by analyzing the NetworkPacketsIn and NetworkPacketsIn metrics of the current instance during the look-back period.     DiskIOPSOverprovisioned  — The instance’s disk IOPS configuration can be sized down while still meeting the performance requirements of your workload. This is identified by analyzing the DiskReadOps and DiskWriteOps metrics of the current instance during the look-back period.     DiskIOPSUnderprovisioned  — The instance’s disk IOPS configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better disk IOPS performance. This is identified by analyzing the DiskReadOps and DiskWriteOps metrics of the current instance during the look-back period.     DiskThroughputOverprovisioned  — The instance’s disk throughput configuration can be sized down while still meeting the performance requirements of your workload. This is identified by analyzing the DiskReadBytes and DiskWriteBytes metrics of the current instance during the look-back period.     DiskThroughputUnderprovisioned  — The instance’s disk throughput configuration doesn't meet the performance requirements of your workload and there is an alternative instance type that provides better disk throughput performance. This is identified by analyzing the DiskReadBytes and DiskWriteBytes metrics of the current instance during the look-back period.    For more information about instance metrics, see List the available CloudWatch metrics for your instances in the Amazon Elastic Compute Cloud User Guide. For more information about EBS volume metrics, see Amazon CloudWatch metrics for Amazon EBS in the Amazon Elastic Compute Cloud User Guide. 
     */
    findingReasonCodes?: InstanceRecommendationFindingReasonCodes;
    /**
     * An array of objects that describe the utilization metrics of the instance.
     */
    utilizationMetrics?: UtilizationMetrics;
    /**
     * The number of days for which utilization metrics were analyzed for the instance.
     */
    lookBackPeriodInDays?: LookBackPeriodInDays;
    /**
     * An array of objects that describe the recommendation options for the instance.
     */
    recommendationOptions?: RecommendationOptions;
    /**
     * An array of objects that describe the source resource of the recommendation.
     */
    recommendationSources?: RecommendationSources;
    /**
     * The timestamp of when the instance recommendation was last generated.
     */
    lastRefreshTimestamp?: LastRefreshTimestamp;
    /**
     * The risk of the current instance not meeting the performance needs of its workloads. The higher the risk, the more likely the current instance cannot meet the performance requirements of its workload.
     */
    currentPerformanceRisk?: CurrentPerformanceRisk;
    /**
     * An object that describes the effective recommendation preferences for the instance.
     */
    effectiveRecommendationPreferences?: EffectiveRecommendationPreferences;
    /**
     * The applications that might be running on the instance as inferred by Compute Optimizer. Compute Optimizer can infer if one of the following applications might be running on the instance:    AmazonEmr - Infers that Amazon EMR might be running on the instance.    ApacheCassandra - Infers that Apache Cassandra might be running on the instance.    ApacheHadoop - Infers that Apache Hadoop might be running on the instance.    Memcached - Infers that Memcached might be running on the instance.    NGINX - Infers that NGINX might be running on the instance.    PostgreSql - Infers that PostgreSQL might be running on the instance.    Redis - Infers that Redis might be running on the instance.    Kafka - Infers that Kafka might be running on the instance.    SQLServer - Infers that SQLServer might be running on the instance.  
     */
    inferredWorkloadTypes?: InferredWorkloadTypes;
    /**
     *  The state of the instance when the recommendation was generated. 
     */
    instanceState?: InstanceState;
    /**
     *  A list of tags assigned to your Amazon EC2 instance recommendations. 
     */
    tags?: Tags;
    /**
     *  An object that describes Compute Optimizer's integration status with your external metrics provider. 
     */
    externalMetricStatus?: ExternalMetricStatus;
    /**
     *  Describes the GPU accelerator settings for the current instance type. 
     */
    currentInstanceGpuInfo?: GpuInfo;
    /**
     *  Describes if an Amazon EC2 instance is idle. 
     */
    idle?: InstanceIdle;
  }
  export type InstanceRecommendationFindingReasonCode = "CPUOverprovisioned"|"CPUUnderprovisioned"|"MemoryOverprovisioned"|"MemoryUnderprovisioned"|"EBSThroughputOverprovisioned"|"EBSThroughputUnderprovisioned"|"EBSIOPSOverprovisioned"|"EBSIOPSUnderprovisioned"|"NetworkBandwidthOverprovisioned"|"NetworkBandwidthUnderprovisioned"|"NetworkPPSOverprovisioned"|"NetworkPPSUnderprovisioned"|"DiskIOPSOverprovisioned"|"DiskIOPSUnderprovisioned"|"DiskThroughputOverprovisioned"|"DiskThroughputUnderprovisioned"|"GPUUnderprovisioned"|"GPUOverprovisioned"|"GPUMemoryUnderprovisioned"|"GPUMemoryOverprovisioned"|string;
  export type InstanceRecommendationFindingReasonCodes = InstanceRecommendationFindingReasonCode[];
  export interface InstanceRecommendationOption {
    /**
     * The instance type of the instance recommendation.
     */
    instanceType?: InstanceType;
    /**
     * An array of objects that describe the projected utilization metrics of the instance recommendation option.  The Cpu and Memory metrics are the only projected utilization metrics returned. Additionally, the Memory metric is returned only for resources that have the unified CloudWatch agent installed on them. For more information, see Enabling Memory Utilization with the CloudWatch Agent. 
     */
    projectedUtilizationMetrics?: ProjectedUtilizationMetrics;
    /**
     * Describes the configuration differences between the current instance and the recommended instance type. You should consider the configuration differences before migrating your workloads from the current instance to the recommended instance type. The Change the instance type guide for Linux and Change the instance type guide for Windows provide general guidance for getting started with an instance migration. Platform differences include:     Hypervisor  — The hypervisor of the recommended instance type is different than that of the current instance. For example, the recommended instance type uses a Nitro hypervisor and the current instance uses a Xen hypervisor. The differences that you should consider between these hypervisors are covered in the Nitro Hypervisor section of the Amazon EC2 frequently asked questions. For more information, see Instances built on the Nitro System in the Amazon EC2 User Guide for Linux, or Instances built on the Nitro System in the Amazon EC2 User Guide for Windows.     NetworkInterface  — The network interface of the recommended instance type is different than that of the current instance. For example, the recommended instance type supports enhanced networking and the current instance might not. To enable enhanced networking for the recommended instance type, you must install the Elastic Network Adapter (ENA) driver or the Intel 82599 Virtual Function driver. For more information, see Networking and storage features and Enhanced networking on Linux in the Amazon EC2 User Guide for Linux, or Networking and storage features and Enhanced networking on Windows in the Amazon EC2 User Guide for Windows.     StorageInterface  — The storage interface of the recommended instance type is different than that of the current instance. For example, the recommended instance type uses an NVMe storage interface and the current instance does not. To access NVMe volumes for the recommended instance type, you will need to install or upgrade the NVMe driver. For more information, see Networking and storage features and Amazon EBS and NVMe on Linux instances in the Amazon EC2 User Guide for Linux, or Networking and storage features and Amazon EBS and NVMe on Windows instances in the Amazon EC2 User Guide for Windows.     InstanceStoreAvailability  — The recommended instance type does not support instance store volumes and the current instance does. Before migrating, you might need to back up the data on your instance store volumes if you want to preserve them. For more information, see How do I back up an instance store volume on my Amazon EC2 instance to Amazon EBS? in the Amazon Web Services Premium Support Knowledge Base. For more information, see Networking and storage features and Amazon EC2 instance store in the Amazon EC2 User Guide for Linux, or see Networking and storage features and Amazon EC2 instance store in the Amazon EC2 User Guide for Windows.     VirtualizationType  — The recommended instance type uses the hardware virtual machine (HVM) virtualization type and the current instance uses the paravirtual (PV) virtualization type. For more information about the differences between these virtualization types, see Linux AMI virtualization types in the Amazon EC2 User Guide for Linux, or Windows AMI virtualization types in the Amazon EC2 User Guide for Windows.     Architecture  — The CPU architecture between the recommended instance type and the current instance is different. For example, the recommended instance type might use an Arm CPU architecture and the current instance type might use a different one, such as x86. Before migrating, you should consider recompiling the software on your instance for the new architecture. Alternatively, you might switch to an Amazon Machine Image (AMI) that supports the new architecture. For more information about the CPU architecture for each instance type, see Amazon EC2 Instance Types.  
     */
    platformDifferences?: PlatformDifferences;
    /**
     * The performance risk of the instance recommendation option. Performance risk indicates the likelihood of the recommended instance type not meeting the resource needs of your workload. Compute Optimizer calculates an individual performance risk score for each specification of the recommended instance, including CPU, memory, EBS throughput, EBS IOPS, disk throughput, disk IOPS, network throughput, and network PPS. The performance risk of the recommended instance is calculated as the maximum performance risk score across the analyzed resource specifications. The value ranges from 0 - 4, with 0 meaning that the recommended resource is predicted to always provide enough hardware capability. The higher the performance risk is, the more likely you should validate whether the recommendation will meet the performance requirements of your workload before migrating your resource.
     */
    performanceRisk?: PerformanceRisk;
    /**
     * The rank of the instance recommendation option. The top recommendation option is ranked as 1.
     */
    rank?: Rank;
    /**
     * An object that describes the savings opportunity for the instance recommendation option. Savings opportunity includes the estimated monthly savings amount and percentage.
     */
    savingsOpportunity?: SavingsOpportunity;
    /**
     * The level of effort required to migrate from the current instance type to the recommended instance type. For example, the migration effort is Low if Amazon EMR is the inferred workload type and an Amazon Web Services Graviton instance type is recommended. The migration effort is Medium if a workload type couldn't be inferred but an Amazon Web Services Graviton instance type is recommended. The migration effort is VeryLow if both the current and recommended instance types are of the same CPU architecture.
     */
    migrationEffort?: MigrationEffort;
    /**
     *  Describes the GPU accelerator settings for the recommended instance type. 
     */
    instanceGpuInfo?: GpuInfo;
  }
  export type InstanceRecommendations = InstanceRecommendation[];
  export type InstanceState = "pending"|"running"|"shutting-down"|"terminated"|"stopping"|"stopped"|string;
  export type InstanceType = string;
  export interface JobFilter {
    /**
     * The name of the filter. Specify ResourceType to return export jobs of a specific resource type (for example, Ec2Instance). Specify JobStatus to return export jobs with a specific status (e.g, Complete).
     */
    name?: JobFilterName;
    /**
     * The value of the filter. The valid values for this parameter are as follows, depending on what you specify for the name parameter:   Specify Ec2Instance or AutoScalingGroup if you specify the name parameter as ResourceType. There is no filter for EBS volumes because volume recommendations cannot be exported at this time.   Specify Queued, InProgress, Complete, or Failed if you specify the name parameter as JobStatus.  
     */
    values?: FilterValues;
  }
  export type JobFilterName = "ResourceType"|"JobStatus"|string;
  export type JobFilters = JobFilter[];
  export type JobId = string;
  export type JobIds = JobId[];
  export type JobStatus = "Queued"|"InProgress"|"Complete"|"Failed"|string;
  export type LambdaFunctionMemoryMetricName = "Duration"|string;
  export type LambdaFunctionMemoryMetricStatistic = "LowerBound"|"UpperBound"|"Expected"|string;
  export interface LambdaFunctionMemoryProjectedMetric {
    /**
     * The name of the projected utilization metric.
     */
    name?: LambdaFunctionMemoryMetricName;
    /**
     * The statistic of the projected utilization metric.
     */
    statistic?: LambdaFunctionMemoryMetricStatistic;
    /**
     * The values of the projected utilization metrics.
     */
    value?: MetricValue;
  }
  export type LambdaFunctionMemoryProjectedMetrics = LambdaFunctionMemoryProjectedMetric[];
  export interface LambdaFunctionMemoryRecommendationOption {
    /**
     * The rank of the function recommendation option. The top recommendation option is ranked as 1.
     */
    rank?: Rank;
    /**
     * The memory size, in MB, of the function recommendation option.
     */
    memorySize?: MemorySize;
    /**
     * An array of objects that describe the projected utilization metrics of the function recommendation option.
     */
    projectedUtilizationMetrics?: LambdaFunctionMemoryProjectedMetrics;
    /**
     * An object that describes the savings opportunity for the Lambda function recommendation option. Savings opportunity includes the estimated monthly savings amount and percentage.
     */
    savingsOpportunity?: SavingsOpportunity;
  }
  export type LambdaFunctionMemoryRecommendationOptions = LambdaFunctionMemoryRecommendationOption[];
  export type LambdaFunctionMetricName = "Duration"|"Memory"|string;
  export type LambdaFunctionMetricStatistic = "Maximum"|"Average"|string;
  export interface LambdaFunctionRecommendation {
    /**
     * The Amazon Resource Name (ARN) of the current function.
     */
    functionArn?: FunctionArn;
    /**
     * The version number of the current function.
     */
    functionVersion?: FunctionVersion;
    /**
     * The Amazon Web Services account ID of the function.
     */
    accountId?: AccountId;
    /**
     * The amount of memory, in MB, that's allocated to the current function.
     */
    currentMemorySize?: MemorySize;
    /**
     * The number of times your function code was applied during the look-back period.
     */
    numberOfInvocations?: NumberOfInvocations;
    /**
     * An array of objects that describe the utilization metrics of the function.
     */
    utilizationMetrics?: LambdaFunctionUtilizationMetrics;
    /**
     * The number of days for which utilization metrics were analyzed for the function.
     */
    lookbackPeriodInDays?: LookBackPeriodInDays;
    /**
     * The timestamp of when the function recommendation was last generated.
     */
    lastRefreshTimestamp?: LastRefreshTimestamp;
    /**
     * The finding classification of the function. Findings for functions include:     Optimized  — The function is correctly provisioned to run your workload based on its current configuration and its utilization history. This finding classification does not include finding reason codes.     NotOptimized  — The function is performing at a higher level (over-provisioned) or at a lower level (under-provisioned) than required for your workload because its current configuration is not optimal. Over-provisioned resources might lead to unnecessary infrastructure cost, and under-provisioned resources might lead to poor application performance. This finding classification can include the MemoryUnderprovisioned and MemoryUnderprovisioned finding reason codes.     Unavailable  — Compute Optimizer was unable to generate a recommendation for the function. This could be because the function has not accumulated sufficient metric data, or the function does not qualify for a recommendation. This finding classification can include the InsufficientData and Inconclusive finding reason codes.  Functions with a finding of unavailable are not returned unless you specify the filter parameter with a value of Unavailable in your GetLambdaFunctionRecommendations request.   
     */
    finding?: LambdaFunctionRecommendationFinding;
    /**
     * The reason for the finding classification of the function.  Functions that have a finding classification of Optimized don't have a finding reason code.  Finding reason codes for functions include:     MemoryOverprovisioned  — The function is over-provisioned when its memory configuration can be sized down while still meeting the performance requirements of your workload. An over-provisioned function might lead to unnecessary infrastructure cost. This finding reason code is part of the NotOptimized finding classification.     MemoryUnderprovisioned  — The function is under-provisioned when its memory configuration doesn't meet the performance requirements of the workload. An under-provisioned function might lead to poor application performance. This finding reason code is part of the NotOptimized finding classification.     InsufficientData  — The function does not have sufficient metric data for Compute Optimizer to generate a recommendation. For more information, see the Supported resources and requirements in the Compute Optimizer User Guide. This finding reason code is part of the Unavailable finding classification.     Inconclusive  — The function does not qualify for a recommendation because Compute Optimizer cannot generate a recommendation with a high degree of confidence. This finding reason code is part of the Unavailable finding classification.  
     */
    findingReasonCodes?: LambdaFunctionRecommendationFindingReasonCodes;
    /**
     * An array of objects that describe the memory configuration recommendation options for the function.
     */
    memorySizeRecommendationOptions?: LambdaFunctionMemoryRecommendationOptions;
    /**
     * The risk of the current Lambda function not meeting the performance needs of its workloads. The higher the risk, the more likely the current Lambda function requires more memory.
     */
    currentPerformanceRisk?: CurrentPerformanceRisk;
    /**
     *  A list of tags assigned to your Lambda function recommendations. 
     */
    tags?: Tags;
  }
  export interface LambdaFunctionRecommendationFilter {
    /**
     * The name of the filter. Specify Finding to return recommendations with a specific finding classification (for example, NotOptimized). Specify FindingReasonCode to return recommendations with a specific finding reason code (for example, MemoryUnderprovisioned). You can filter your Lambda function recommendations by tag:key and tag-key tags. A tag:key is a key and value combination of a tag assigned to your Lambda function recommendations. Use the tag key in the filter name and the tag value as the filter value. For example, to find all Lambda function recommendations that have a tag with the key of Owner and the value of TeamA, specify tag:Owner for the filter name and TeamA for the filter value. A tag-key is the key of a tag assigned to your Lambda function recommendations. Use this filter to find all of your Lambda function recommendations that have a tag with a specific key. This doesn’t consider the tag value. For example, you can find your Lambda function recommendations with a tag key value of Owner or without any tag keys assigned.
     */
    name?: LambdaFunctionRecommendationFilterName;
    /**
     * The value of the filter. The valid values for this parameter are as follows, depending on what you specify for the name parameter:   Specify Optimized, NotOptimized, or Unavailable if you specify the name parameter as Finding.   Specify MemoryOverprovisioned, MemoryUnderprovisioned, InsufficientData, or Inconclusive if you specify the name parameter as FindingReasonCode.  
     */
    values?: FilterValues;
  }
  export type LambdaFunctionRecommendationFilterName = "Finding"|"FindingReasonCode"|string;
  export type LambdaFunctionRecommendationFilters = LambdaFunctionRecommendationFilter[];
  export type LambdaFunctionRecommendationFinding = "Optimized"|"NotOptimized"|"Unavailable"|string;
  export type LambdaFunctionRecommendationFindingReasonCode = "MemoryOverprovisioned"|"MemoryUnderprovisioned"|"InsufficientData"|"Inconclusive"|string;
  export type LambdaFunctionRecommendationFindingReasonCodes = LambdaFunctionRecommendationFindingReasonCode[];
  export type LambdaFunctionRecommendations = LambdaFunctionRecommendation[];
  export interface LambdaFunctionUtilizationMetric {
    /**
     * The name of the utilization metric. The following utilization metrics are available:    Duration - The amount of time that your function code spends processing an event.    Memory - The amount of memory used per invocation.  
     */
    name?: LambdaFunctionMetricName;
    /**
     * The statistic of the utilization metric. The Compute Optimizer API, Command Line Interface (CLI), and SDKs return utilization metrics using only the Maximum statistic, which is the highest value observed during the specified period. The Compute Optimizer console displays graphs for some utilization metrics using the Average statistic, which is the value of Sum / SampleCount during the specified period. For more information, see Viewing resource recommendations in the Compute Optimizer User Guide. You can also get averaged utilization metric data for your resources using Amazon CloudWatch. For more information, see the Amazon CloudWatch User Guide.
     */
    statistic?: LambdaFunctionMetricStatistic;
    /**
     * The value of the utilization metric.
     */
    value?: MetricValue;
  }
  export type LambdaFunctionUtilizationMetrics = LambdaFunctionUtilizationMetric[];
  export type LastRefreshTimestamp = Date;
  export type LastUpdatedTimestamp = Date;
  export interface LicenseConfiguration {
    /**
     *  The current number of cores associated with the instance. 
     */
    numberOfCores?: NumberOfCores;
    /**
     *  The instance type used in the license. 
     */
    instanceType?: InstanceType;
    /**
     *  The operating system of the instance. 
     */
    operatingSystem?: OperatingSystem;
    /**
     *  The edition of the license for the application that runs on the instance. 
     */
    licenseEdition?: LicenseEdition;
    /**
     *  The name of the license for the application that runs on the instance. 
     */
    licenseName?: LicenseName;
    /**
     *  The license type associated with the instance. 
     */
    licenseModel?: LicenseModel;
    /**
     *  The version of the license for the application that runs on the instance. 
     */
    licenseVersion?: LicenseVersion;
    /**
     *  The list of metric sources required to generate recommendations for commercial software licenses. 
     */
    metricsSource?: MetricsSource;
  }
  export type LicenseEdition = "Enterprise"|"Standard"|"Free"|"NoLicenseEditionFound"|string;
  export type LicenseFinding = "InsufficientMetrics"|"Optimized"|"NotOptimized"|string;
  export type LicenseFindingReasonCode = "InvalidCloudWatchApplicationInsightsSetup"|"CloudWatchApplicationInsightsError"|"LicenseOverprovisioned"|"Optimized"|string;
  export type LicenseFindingReasonCodes = LicenseFindingReasonCode[];
  export type LicenseModel = "LicenseIncluded"|"BringYourOwnLicense"|string;
  export type LicenseName = "SQLServer"|string;
  export interface LicenseRecommendation {
    /**
     *  The ARN that identifies the Amazon EC2 instance. 
     */
    resourceArn?: ResourceArn;
    /**
     *  The Amazon Web Services account ID of the license. 
     */
    accountId?: AccountId;
    /**
     *  An object that describes the current configuration of an instance that runs on a license. 
     */
    currentLicenseConfiguration?: LicenseConfiguration;
    /**
     *  The number of days for which utilization metrics were analyzed for an instance that runs on a license. 
     */
    lookbackPeriodInDays?: LookBackPeriodInDays;
    /**
     *  The timestamp of when the license recommendation was last generated. 
     */
    lastRefreshTimestamp?: LastRefreshTimestamp;
    /**
     *  The finding classification for an instance that runs on a license.  Findings include:    InsufficentMetrics — When Compute Optimizer detects that your CloudWatch Application Insights isn't enabled or is enabled with insufficient permissions.     NotOptimized — When Compute Optimizer detects that your EC2 infrastructure isn't using any of the SQL server license features you're paying for, a license is considered not optimized.    Optimized — When Compute Optimizer detects that all specifications of your license meet the performance requirements of your workload.   
     */
    finding?: LicenseFinding;
    /**
     *  The reason for the finding classification for an instance that runs on a license.  Finding reason codes include:    Optimized — All specifications of your license meet the performance requirements of your workload.     LicenseOverprovisioned — A license is considered over-provisioned when your license can be downgraded while still meeting the performance requirements of your workload.    InvalidCloudwatchApplicationInsights — CloudWatch Application Insights isn't configured properly.    CloudwatchApplicationInsightsError — There is a CloudWatch Application Insights error.   
     */
    findingReasonCodes?: LicenseFindingReasonCodes;
    /**
     *  An array of objects that describe the license recommendation options. 
     */
    licenseRecommendationOptions?: LicenseRecommendationOptions;
    /**
     *  A list of tags assigned to an EC2 instance. 
     */
    tags?: Tags;
  }
  export interface LicenseRecommendationFilter {
    /**
     * The name of the filter. Specify Finding to return recommendations with a specific finding classification. Specify FindingReasonCode to return recommendations with a specific finding reason code. You can filter your license recommendations by tag:key and tag-key tags. A tag:key is a key and value combination of a tag assigned to your license recommendations. Use the tag key in the filter name and the tag value as the filter value. For example, to find all license recommendations that have a tag with the key of Owner and the value of TeamA, specify tag:Owner for the filter name and TeamA for the filter value. A tag-key is the key of a tag assigned to your license recommendations. Use this filter to find all of your license recommendations that have a tag with a specific key. This doesn’t consider the tag value. For example, you can find your license recommendations with a tag key value of Owner or without any tag keys assigned.
     */
    name?: LicenseRecommendationFilterName;
    /**
     * The value of the filter. The valid values for this parameter are as follows, depending on what you specify for the name parameter:   If you specify the name parameter as Finding, then specify Optimized, NotOptimized, or InsufficentMetrics.   If you specify the name parameter as FindingReasonCode, then specify Optimized, LicenseOverprovisioned, InvalidCloudwatchApplicationInsights, or CloudwatchApplicationInsightsError.  
     */
    values?: FilterValues;
  }
  export type LicenseRecommendationFilterName = "Finding"|"FindingReasonCode"|"LicenseName"|string;
  export type LicenseRecommendationFilters = LicenseRecommendationFilter[];
  export interface LicenseRecommendationOption {
    /**
     *  The rank of the license recommendation option.   The top recommendation option is ranked as 1. 
     */
    rank?: Rank;
    /**
     *  The operating system of a license recommendation option. 
     */
    operatingSystem?: OperatingSystem;
    /**
     *  The recommended edition of the license for the application that runs on the instance. 
     */
    licenseEdition?: LicenseEdition;
    /**
     *  The recommended license type associated with the instance. 
     */
    licenseModel?: LicenseModel;
    savingsOpportunity?: SavingsOpportunity;
  }
  export type LicenseRecommendationOptions = LicenseRecommendationOption[];
  export type LicenseRecommendations = LicenseRecommendation[];
  export type LicenseVersion = string;
  export type LookBackPeriodInDays = number;
  export type Low = number;
  export type LowerBoundValue = number;
  export type MaxResults = number;
  export type MaxSize = number;
  export type Medium = number;
  export type MemberAccountsEnrolled = boolean;
  export type MemorySize = number;
  export interface MemorySizeConfiguration {
    /**
     *  The amount of memory in the container. 
     */
    memory?: NullableMemory;
    /**
     *  The limit of memory reserve for the container. 
     */
    memoryReservation?: NullableMemoryReservation;
  }
  export type Message = string;
  export type MetadataKey = string;
  export type MetricName = "Cpu"|"Memory"|"EBS_READ_OPS_PER_SECOND"|"EBS_WRITE_OPS_PER_SECOND"|"EBS_READ_BYTES_PER_SECOND"|"EBS_WRITE_BYTES_PER_SECOND"|"DISK_READ_OPS_PER_SECOND"|"DISK_WRITE_OPS_PER_SECOND"|"DISK_READ_BYTES_PER_SECOND"|"DISK_WRITE_BYTES_PER_SECOND"|"NETWORK_IN_BYTES_PER_SECOND"|"NETWORK_OUT_BYTES_PER_SECOND"|"NETWORK_PACKETS_IN_PER_SECOND"|"NETWORK_PACKETS_OUT_PER_SECOND"|"GPU_PERCENTAGE"|"GPU_MEMORY_PERCENTAGE"|string;
  export type MetricProviderArn = string;
  export interface MetricSource {
    /**
     *  The name of the metric source provider. 
     */
    provider?: MetricSourceProvider;
    /**
     *  The ARN of the metric source provider. 
     */
    providerArn?: MetricProviderArn;
  }
  export type MetricSourceProvider = "CloudWatchApplicationInsights"|string;
  export type MetricStatistic = "Maximum"|"Average"|string;
  export type MetricValue = number;
  export type MetricValues = MetricValue[];
  export type MetricsSource = MetricSource[];
  export type MigrationEffort = "VeryLow"|"Low"|"Medium"|"High"|string;
  export type MinSize = number;
  export type NextToken = string;
  export type NullableCpu = number;
  export type NullableMemory = number;
  export type NullableMemoryReservation = number;
  export type NumberOfCores = number;
  export type NumberOfInvocations = number;
  export type NumberOfMemberAccountsOptedIn = number;
  export type OperatingSystem = string;
  export type PerformanceRisk = number;
  export type Period = number;
  export type PlatformDifference = "Hypervisor"|"NetworkInterface"|"StorageInterface"|"InstanceStoreAvailability"|"VirtualizationType"|"Architecture"|string;
  export type PlatformDifferences = PlatformDifference[];
  export interface ProjectedMetric {
    /**
     * The name of the projected utilization metric. The following projected utilization metrics are returned:    Cpu - The projected percentage of allocated EC2 compute units that would be in use on the recommendation option had you used that resource during the analyzed period. This metric identifies the processing power required to run an application on the recommendation option. Depending on the instance type, tools in your operating system can show a lower percentage than CloudWatch when the instance is not allocated a full processor core.    Memory - The percentage of memory that would be in use on the recommendation option had you used that resource during the analyzed period. This metric identifies the amount of memory required to run an application on the recommendation option. Units: Percent  The Memory metric is only returned for resources with the unified CloudWatch agent installed on them. For more information, see Enabling Memory Utilization with the CloudWatch Agent.     GPU - The projected percentage of allocated GPUs if you adjust your configurations to Compute Optimizer's recommendation option.    GPU_MEMORY - The projected percentage of total GPU memory if you adjust your configurations to Compute Optimizer's recommendation option.  The GPU and GPU_MEMORY metrics are only returned for resources with the unified CloudWatch Agent installed on them. For more information, see Enabling NVIDIA GPU utilization with the CloudWatch Agent.   
     */
    name?: MetricName;
    /**
     * The timestamps of the projected utilization metric.
     */
    timestamps?: Timestamps;
    /**
     * The values of the projected utilization metrics.
     */
    values?: MetricValues;
  }
  export type ProjectedMetrics = ProjectedMetric[];
  export type ProjectedUtilizationMetrics = UtilizationMetric[];
  export interface PutRecommendationPreferencesRequest {
    /**
     * The target resource type of the recommendation preference to create. The Ec2Instance option encompasses standalone instances and instances that are part of Auto Scaling groups. The AutoScalingGroup option encompasses only instances that are part of an Auto Scaling group.  The valid values for this parameter are Ec2Instance and AutoScalingGroup. 
     */
    resourceType: ResourceType;
    /**
     * An object that describes the scope of the recommendation preference to create. You can create recommendation preferences at the organization level (for management accounts of an organization only), account level, and resource level. For more information, see Activating enhanced infrastructure metrics in the Compute Optimizer User Guide.  You cannot create recommendation preferences for Auto Scaling groups at the organization and account levels. You can create recommendation preferences for Auto Scaling groups only at the resource level by specifying a scope name of ResourceArn and a scope value of the Auto Scaling group Amazon Resource Name (ARN). This will configure the preference for all instances that are part of the specified Auto Scaling group. You also cannot create recommendation preferences at the resource level for instances that are part of an Auto Scaling group. You can create recommendation preferences at the resource level only for standalone instances. 
     */
    scope?: Scope;
    /**
     * The status of the enhanced infrastructure metrics recommendation preference to create or update. Specify the Active status to activate the preference, or specify Inactive to deactivate the preference. For more information, see Enhanced infrastructure metrics in the Compute Optimizer User Guide.
     */
    enhancedInfrastructureMetrics?: EnhancedInfrastructureMetrics;
    /**
     * The status of the inferred workload types recommendation preference to create or update.  The inferred workload type feature is active by default. To deactivate it, create a recommendation preference.  Specify the Inactive status to deactivate the feature, or specify Active to activate it. For more information, see Inferred workload types in the Compute Optimizer User Guide.
     */
    inferredWorkloadTypes?: InferredWorkloadTypesPreference;
    /**
     * The provider of the external metrics recommendation preference to create or update. Specify a valid provider in the source field to activate the preference. To delete this preference, see the DeleteRecommendationPreferences action. This preference can only be set for the Ec2Instance resource type. For more information, see External metrics ingestion in the Compute Optimizer User Guide.
     */
    externalMetricsPreference?: ExternalMetricsPreference;
  }
  export interface PutRecommendationPreferencesResponse {
  }
  export type Rank = number;
  export type ReasonCodeSummaries = ReasonCodeSummary[];
  export interface ReasonCodeSummary {
    /**
     * The name of the finding reason code.
     */
    name?: FindingReasonCode;
    /**
     * The value of the finding reason code summary.
     */
    value?: SummaryValue;
  }
  export interface RecommendationExportJob {
    /**
     * The identification number of the export job.
     */
    jobId?: JobId;
    /**
     * An object that describes the destination of the export file.
     */
    destination?: ExportDestination;
    /**
     * The resource type of the exported recommendations.
     */
    resourceType?: ResourceType;
    /**
     * The status of the export job.
     */
    status?: JobStatus;
    /**
     * The timestamp of when the export job was created.
     */
    creationTimestamp?: CreationTimestamp;
    /**
     * The timestamp of when the export job was last updated.
     */
    lastUpdatedTimestamp?: LastUpdatedTimestamp;
    /**
     * The reason for an export job failure.
     */
    failureReason?: FailureReason;
  }
  export type RecommendationExportJobs = RecommendationExportJob[];
  export type RecommendationOptions = InstanceRecommendationOption[];
  export type RecommendationPreferenceName = "EnhancedInfrastructureMetrics"|"InferredWorkloadTypes"|"ExternalMetricsPreference"|string;
  export type RecommendationPreferenceNames = RecommendationPreferenceName[];
  export interface RecommendationPreferences {
    /**
     * Specifies the CPU vendor and architecture for Amazon EC2 instance and Auto Scaling group recommendations. For example, when you specify AWS_ARM64 with:   A GetEC2InstanceRecommendations or GetAutoScalingGroupRecommendations request, Compute Optimizer returns recommendations that consist of Graviton2 instance types only.   A GetEC2RecommendationProjectedMetrics request, Compute Optimizer returns projected utilization metrics for Graviton2 instance type recommendations only.   A ExportEC2InstanceRecommendations or ExportAutoScalingGroupRecommendations request, Compute Optimizer exports recommendations that consist of Graviton2 instance types only.  
     */
    cpuVendorArchitectures?: CpuVendorArchitectures;
  }
  export interface RecommendationPreferencesDetail {
    /**
     * An object that describes the scope of the recommendation preference. Recommendation preferences can be created at the organization level (for management accounts of an organization only), account level, and resource level. For more information, see Activating enhanced infrastructure metrics in the Compute Optimizer User Guide.
     */
    scope?: Scope;
    /**
     * The target resource type of the recommendation preference to create. The Ec2Instance option encompasses standalone instances and instances that are part of Auto Scaling groups. The AutoScalingGroup option encompasses only instances that are part of an Auto Scaling group.
     */
    resourceType?: ResourceType;
    /**
     * The status of the enhanced infrastructure metrics recommendation preference. When the recommendations page is refreshed, a status of Active confirms that the preference is applied to the recommendations, and a status of Inactive confirms that the preference isn't yet applied to recommendations. For more information, see Enhanced infrastructure metrics in the Compute Optimizer User Guide.
     */
    enhancedInfrastructureMetrics?: EnhancedInfrastructureMetrics;
    /**
     * The status of the inferred workload types recommendation preference. When the recommendations page is refreshed, a status of Active confirms that the preference is applied to the recommendations, and a status of Inactive confirms that the preference isn't yet applied to recommendations.
     */
    inferredWorkloadTypes?: InferredWorkloadTypesPreference;
    /**
     *  An object that describes the external metrics recommendation preference.   If the preference is applied in the latest recommendation refresh, an object with a valid source value appears in the response. If the preference isn't applied to the recommendations already, then this object doesn't appear in the response. 
     */
    externalMetricsPreference?: ExternalMetricsPreference;
  }
  export type RecommendationPreferencesDetails = RecommendationPreferencesDetail[];
  export interface RecommendationSource {
    /**
     * The Amazon Resource Name (ARN) of the recommendation source.
     */
    recommendationSourceArn?: RecommendationSourceArn;
    /**
     * The resource type of the recommendation source.
     */
    recommendationSourceType?: RecommendationSourceType;
  }
  export type RecommendationSourceArn = string;
  export type RecommendationSourceType = "Ec2Instance"|"AutoScalingGroup"|"EbsVolume"|"LambdaFunction"|"EcsService"|"License"|string;
  export type RecommendationSources = RecommendationSource[];
  export type RecommendationSummaries = RecommendationSummary[];
  export interface RecommendationSummary {
    /**
     * An array of objects that describe a recommendation summary.
     */
    summaries?: Summaries;
    /**
     * The resource type that the recommendation summary applies to.
     */
    recommendationResourceType?: RecommendationSourceType;
    /**
     * The Amazon Web Services account ID of the recommendation summary.
     */
    accountId?: AccountId;
    /**
     * An object that describes the savings opportunity for a given resource type. Savings opportunity includes the estimated monthly savings amount and percentage.
     */
    savingsOpportunity?: SavingsOpportunity;
    /**
     * An object that describes the performance risk ratings for a given resource type.
     */
    currentPerformanceRiskRatings?: CurrentPerformanceRiskRatings;
    /**
     *  An array of objects that describes the estimated monthly saving amounts for the instances running on the specified inferredWorkloadTypes. The array contains the top five savings opportunites for the instances that run inferred workload types. 
     */
    inferredWorkloadSavings?: InferredWorkloadSavings;
  }
  export type RecommendedInstanceType = string;
  export interface RecommendedOptionProjectedMetric {
    /**
     * The recommended instance type.
     */
    recommendedInstanceType?: RecommendedInstanceType;
    /**
     * The rank of the recommendation option projected metric. The top recommendation option is ranked as 1. The projected metric rank correlates to the recommendation option rank. For example, the projected metric ranked as 1 is related to the recommendation option that is also ranked as 1 in the same response.
     */
    rank?: Rank;
    /**
     * An array of objects that describe a projected utilization metric.
     */
    projectedMetrics?: ProjectedMetrics;
  }
  export type RecommendedOptionProjectedMetrics = RecommendedOptionProjectedMetric[];
  export type ResourceArn = string;
  export type ResourceArns = ResourceArn[];
  export type ResourceType = "Ec2Instance"|"AutoScalingGroup"|"EbsVolume"|"LambdaFunction"|"NotApplicable"|"EcsService"|"License"|string;
  export type RootVolume = boolean;
  export interface S3Destination {
    /**
     * The name of the Amazon S3 bucket used as the destination of an export file.
     */
    bucket?: DestinationBucket;
    /**
     * The Amazon S3 bucket key of an export file. The key uniquely identifies the object, or export file, in the S3 bucket.
     */
    key?: DestinationKey;
    /**
     * The Amazon S3 bucket key of a metadata file. The key uniquely identifies the object, or metadata file, in the S3 bucket.
     */
    metadataKey?: MetadataKey;
  }
  export interface S3DestinationConfig {
    /**
     * The name of the Amazon S3 bucket to use as the destination for an export job.
     */
    bucket?: DestinationBucket;
    /**
     * The Amazon S3 bucket prefix for an export job.
     */
    keyPrefix?: DestinationKeyPrefix;
  }
  export interface SavingsOpportunity {
    /**
     * The estimated monthly savings possible as a percentage of monthly cost by adopting Compute Optimizer recommendations for a given resource.
     */
    savingsOpportunityPercentage?: SavingsOpportunityPercentage;
    /**
     * An object that describes the estimated monthly savings amount possible by adopting Compute Optimizer recommendations for a given resource. This is based on the On-Demand instance pricing..
     */
    estimatedMonthlySavings?: EstimatedMonthlySavings;
  }
  export type SavingsOpportunityPercentage = number;
  export interface Scope {
    /**
     * The name of the scope. The following scopes are possible:    Organization - Specifies that the recommendation preference applies at the organization level, for all member accounts of an organization.    AccountId - Specifies that the recommendation preference applies at the account level, for all resources of a given resource type in an account.    ResourceArn - Specifies that the recommendation preference applies at the individual resource level.  
     */
    name?: ScopeName;
    /**
     * The value of the scope. If you specified the name of the scope as:    Organization - The value must be ALL_ACCOUNTS.    AccountId - The value must be a 12-digit Amazon Web Services account ID.    ResourceArn - The value must be the Amazon Resource Name (ARN) of an EC2 instance or an Auto Scaling group.   Only EC2 instance and Auto Scaling group ARNs are currently supported.
     */
    value?: ScopeValue;
  }
  export type ScopeName = "Organization"|"AccountId"|"ResourceArn"|string;
  export type ScopeValue = string;
  export type ServiceArn = string;
  export type ServiceArns = ServiceArn[];
  export interface ServiceConfiguration {
    /**
     *  The amount of memory used by the tasks in the Amazon ECS service. 
     */
    memory?: NullableMemory;
    /**
     *  The number of CPU units used by the tasks in the Amazon ECS service. 
     */
    cpu?: NullableCpu;
    /**
     *  The container configurations within a task of an Amazon ECS service. 
     */
    containerConfigurations?: ContainerConfigurations;
    /**
     *  Describes the Auto Scaling configuration methods for an Amazon ECS service. This affects the generated recommendations. For example, if Auto Scaling is configured on a service’s CPU, then Compute Optimizer doesn’t generate CPU size recommendations.  The Auto Scaling configuration methods include:    TARGET_TRACKING_SCALING_CPU — If the Amazon ECS service is configured to use target scaling on CPU, Compute Optimizer doesn't generate CPU recommendations.    TARGET_TRACKING_SCALING_MEMORY — If the Amazon ECS service is configured to use target scaling on memory, Compute Optimizer doesn't generate memory recommendations.   For more information about step scaling and target scaling, see  Step scaling policies for Application Auto Scaling and  Target tracking scaling policies for Application Auto Scaling in the Application Auto Scaling User Guide.
     */
    autoScalingConfiguration?: AutoScalingConfiguration;
    /**
     *  The task definition ARN used by the tasks in the Amazon ECS service. 
     */
    taskDefinitionArn?: TaskDefinitionArn;
  }
  export type Status = "Active"|"Inactive"|"Pending"|"Failed"|string;
  export type StatusReason = string;
  export type Summaries = Summary[];
  export interface Summary {
    /**
     * The finding classification of the recommendation.
     */
    name?: Finding;
    /**
     * The value of the recommendation summary.
     */
    value?: SummaryValue;
    /**
     * An array of objects that summarize a finding reason code.
     */
    reasonCodeSummaries?: ReasonCodeSummaries;
  }
  export type SummaryValue = number;
  export interface Tag {
    /**
     *  One part of a key-value pair that makes up a tag. A key is a general label that acts like a category for more specific tag values. 
     */
    key?: TagKey;
    /**
     *  One part of a key-value pair that make up a tag. A value acts as a descriptor within a tag category (key). The value can be empty or null. 
     */
    value?: TagValue;
  }
  export type TagKey = string;
  export type TagValue = string;
  export type Tags = Tag[];
  export type TaskDefinitionArn = string;
  export type Timestamp = Date;
  export type Timestamps = Timestamp[];
  export interface UpdateEnrollmentStatusRequest {
    /**
     * The new enrollment status of the account. The following status options are available:    Active - Opts in your account to the Compute Optimizer service. Compute Optimizer begins analyzing the configuration and utilization metrics of your Amazon Web Services resources after you opt in. For more information, see Metrics analyzed by Compute Optimizer in the Compute Optimizer User Guide.    Inactive - Opts out your account from the Compute Optimizer service. Your account's recommendations and related metrics data will be deleted from Compute Optimizer after you opt out.    The Pending and Failed options cannot be used to update the enrollment status of an account. They are returned in the response of a request to update the enrollment status of an account. 
     */
    status: Status;
    /**
     * Indicates whether to enroll member accounts of the organization if the account is the management account of an organization.
     */
    includeMemberAccounts?: IncludeMemberAccounts;
  }
  export interface UpdateEnrollmentStatusResponse {
    /**
     * The enrollment status of the account.
     */
    status?: Status;
    /**
     * The reason for the enrollment status of the account. For example, an account might show a status of Pending because member accounts of an organization require more time to be enrolled in the service.
     */
    statusReason?: StatusReason;
  }
  export type UpperBoundValue = number;
  export interface UtilizationMetric {
    /**
     * The name of the utilization metric. The following utilization metrics are available:    Cpu - The percentage of allocated EC2 compute units that are currently in use on the instance. This metric identifies the processing power required to run an application on the instance. Depending on the instance type, tools in your operating system can show a lower percentage than CloudWatch when the instance is not allocated a full processor core. Units: Percent    Memory - The percentage of memory that is currently in use on the instance. This metric identifies the amount of memory required to run an application on the instance. Units: Percent  The Memory metric is returned only for resources that have the unified CloudWatch agent installed on them. For more information, see Enabling Memory Utilization with the CloudWatch Agent.     GPU - The percentage of allocated GPUs that currently run on the instance.    GPU_MEMORY - The percentage of total GPU memory that currently runs on the instance.  The GPU and GPU_MEMORY metrics are only returned for resources with the unified CloudWatch Agent installed on them. For more information, see Enabling NVIDIA GPU utilization with the CloudWatch Agent.     EBS_READ_OPS_PER_SECOND - The completed read operations from all EBS volumes attached to the instance in a specified period of time. Unit: Count    EBS_WRITE_OPS_PER_SECOND - The completed write operations to all EBS volumes attached to the instance in a specified period of time. Unit: Count    EBS_READ_BYTES_PER_SECOND - The bytes read from all EBS volumes attached to the instance in a specified period of time. Unit: Bytes    EBS_WRITE_BYTES_PER_SECOND - The bytes written to all EBS volumes attached to the instance in a specified period of time. Unit: Bytes    DISK_READ_OPS_PER_SECOND - The completed read operations from all instance store volumes available to the instance in a specified period of time. If there are no instance store volumes, either the value is 0 or the metric is not reported.    DISK_WRITE_OPS_PER_SECOND - The completed write operations from all instance store volumes available to the instance in a specified period of time. If there are no instance store volumes, either the value is 0 or the metric is not reported.    DISK_READ_BYTES_PER_SECOND - The bytes read from all instance store volumes available to the instance. This metric is used to determine the volume of the data the application reads from the disk of the instance. This can be used to determine the speed of the application. If there are no instance store volumes, either the value is 0 or the metric is not reported.    DISK_WRITE_BYTES_PER_SECOND - The bytes written to all instance store volumes available to the instance. This metric is used to determine the volume of the data the application writes onto the disk of the instance. This can be used to determine the speed of the application. If there are no instance store volumes, either the value is 0 or the metric is not reported.    NETWORK_IN_BYTES_PER_SECOND - The number of bytes received by the instance on all network interfaces. This metric identifies the volume of incoming network traffic to a single instance.    NETWORK_OUT_BYTES_PER_SECOND - The number of bytes sent out by the instance on all network interfaces. This metric identifies the volume of outgoing network traffic from a single instance.    NETWORK_PACKETS_IN_PER_SECOND - The number of packets received by the instance on all network interfaces. This metric identifies the volume of incoming traffic in terms of the number of packets on a single instance.    NETWORK_PACKETS_OUT_PER_SECOND - The number of packets sent out by the instance on all network interfaces. This metric identifies the volume of outgoing traffic in terms of the number of packets on a single instance.  
     */
    name?: MetricName;
    /**
     * The statistic of the utilization metric. The Compute Optimizer API, Command Line Interface (CLI), and SDKs return utilization metrics using only the Maximum statistic, which is the highest value observed during the specified period. The Compute Optimizer console displays graphs for some utilization metrics using the Average statistic, which is the value of Sum / SampleCount during the specified period. For more information, see Viewing resource recommendations in the Compute Optimizer User Guide. You can also get averaged utilization metric data for your resources using Amazon CloudWatch. For more information, see the Amazon CloudWatch User Guide.
     */
    statistic?: MetricStatistic;
    /**
     * The value of the utilization metric.
     */
    value?: MetricValue;
  }
  export type UtilizationMetrics = UtilizationMetric[];
  export type Value = number;
  export type VeryLow = number;
  export type VolumeArn = string;
  export type VolumeArns = VolumeArn[];
  export type VolumeBaselineIOPS = number;
  export type VolumeBaselineThroughput = number;
  export type VolumeBurstIOPS = number;
  export type VolumeBurstThroughput = number;
  export interface VolumeConfiguration {
    /**
     * The volume type. This can be gp2 for General Purpose SSD, io1 or io2 for Provisioned IOPS SSD, st1 for Throughput Optimized HDD, sc1 for Cold HDD, or standard for Magnetic volumes.
     */
    volumeType?: VolumeType;
    /**
     * The size of the volume, in GiB.
     */
    volumeSize?: VolumeSize;
    /**
     * The baseline IOPS of the volume.
     */
    volumeBaselineIOPS?: VolumeBaselineIOPS;
    /**
     * The burst IOPS of the volume.
     */
    volumeBurstIOPS?: VolumeBurstIOPS;
    /**
     * The baseline throughput of the volume.
     */
    volumeBaselineThroughput?: VolumeBaselineThroughput;
    /**
     * The burst throughput of the volume.
     */
    volumeBurstThroughput?: VolumeBurstThroughput;
    /**
     *  Contains the image used to boot the instance during launch. 
     */
    rootVolume?: RootVolume;
  }
  export interface VolumeRecommendation {
    /**
     * The Amazon Resource Name (ARN) of the current volume.
     */
    volumeArn?: VolumeArn;
    /**
     * The Amazon Web Services account ID of the volume.
     */
    accountId?: AccountId;
    /**
     * An array of objects that describe the current configuration of the volume.
     */
    currentConfiguration?: VolumeConfiguration;
    /**
     * The finding classification of the volume. Findings for volumes include:     NotOptimized —A volume is considered not optimized when Compute Optimizer identifies a recommendation that can provide better performance for your workload.     Optimized —An volume is considered optimized when Compute Optimizer determines that the volume is correctly provisioned to run your workload based on the chosen volume type. For optimized resources, Compute Optimizer might recommend a new generation volume type.  
     */
    finding?: EBSFinding;
    /**
     * An array of objects that describe the utilization metrics of the volume.
     */
    utilizationMetrics?: EBSUtilizationMetrics;
    /**
     * The number of days for which utilization metrics were analyzed for the volume.
     */
    lookBackPeriodInDays?: LookBackPeriodInDays;
    /**
     * An array of objects that describe the recommendation options for the volume.
     */
    volumeRecommendationOptions?: VolumeRecommendationOptions;
    /**
     * The timestamp of when the volume recommendation was last generated.
     */
    lastRefreshTimestamp?: LastRefreshTimestamp;
    /**
     * The risk of the current EBS volume not meeting the performance needs of its workloads. The higher the risk, the more likely the current EBS volume doesn't have sufficient capacity.
     */
    currentPerformanceRisk?: CurrentPerformanceRisk;
    /**
     *  A list of tags assigned to your Amazon EBS volume recommendations. 
     */
    tags?: Tags;
  }
  export interface VolumeRecommendationOption {
    /**
     * An array of objects that describe a volume configuration.
     */
    configuration?: VolumeConfiguration;
    /**
     * The performance risk of the volume recommendation option. Performance risk is the likelihood of the recommended volume type meeting the performance requirement of your workload. The value ranges from 0 - 4, with 0 meaning that the recommended resource is predicted to always provide enough hardware capability. The higher the performance risk is, the more likely you should validate whether the recommendation will meet the performance requirements of your workload before migrating your resource.
     */
    performanceRisk?: PerformanceRisk;
    /**
     * The rank of the volume recommendation option. The top recommendation option is ranked as 1.
     */
    rank?: Rank;
    /**
     * An object that describes the savings opportunity for the EBS volume recommendation option. Savings opportunity includes the estimated monthly savings amount and percentage.
     */
    savingsOpportunity?: SavingsOpportunity;
  }
  export type VolumeRecommendationOptions = VolumeRecommendationOption[];
  export type VolumeRecommendations = VolumeRecommendation[];
  export type VolumeSize = number;
  export type VolumeType = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-11-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ComputeOptimizer client.
   */
  export import Types = ComputeOptimizer;
}
export = ComputeOptimizer;
