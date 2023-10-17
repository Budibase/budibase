import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AutoScalingPlans extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AutoScalingPlans.Types.ClientConfiguration)
  config: Config & AutoScalingPlans.Types.ClientConfiguration;
  /**
   * Creates a scaling plan. 
   */
  createScalingPlan(params: AutoScalingPlans.Types.CreateScalingPlanRequest, callback?: (err: AWSError, data: AutoScalingPlans.Types.CreateScalingPlanResponse) => void): Request<AutoScalingPlans.Types.CreateScalingPlanResponse, AWSError>;
  /**
   * Creates a scaling plan. 
   */
  createScalingPlan(callback?: (err: AWSError, data: AutoScalingPlans.Types.CreateScalingPlanResponse) => void): Request<AutoScalingPlans.Types.CreateScalingPlanResponse, AWSError>;
  /**
   * Deletes the specified scaling plan. Deleting a scaling plan deletes the underlying ScalingInstruction for all of the scalable resources that are covered by the plan. If the plan has launched resources or has scaling activities in progress, you must delete those resources separately.
   */
  deleteScalingPlan(params: AutoScalingPlans.Types.DeleteScalingPlanRequest, callback?: (err: AWSError, data: AutoScalingPlans.Types.DeleteScalingPlanResponse) => void): Request<AutoScalingPlans.Types.DeleteScalingPlanResponse, AWSError>;
  /**
   * Deletes the specified scaling plan. Deleting a scaling plan deletes the underlying ScalingInstruction for all of the scalable resources that are covered by the plan. If the plan has launched resources or has scaling activities in progress, you must delete those resources separately.
   */
  deleteScalingPlan(callback?: (err: AWSError, data: AutoScalingPlans.Types.DeleteScalingPlanResponse) => void): Request<AutoScalingPlans.Types.DeleteScalingPlanResponse, AWSError>;
  /**
   * Describes the scalable resources in the specified scaling plan.
   */
  describeScalingPlanResources(params: AutoScalingPlans.Types.DescribeScalingPlanResourcesRequest, callback?: (err: AWSError, data: AutoScalingPlans.Types.DescribeScalingPlanResourcesResponse) => void): Request<AutoScalingPlans.Types.DescribeScalingPlanResourcesResponse, AWSError>;
  /**
   * Describes the scalable resources in the specified scaling plan.
   */
  describeScalingPlanResources(callback?: (err: AWSError, data: AutoScalingPlans.Types.DescribeScalingPlanResourcesResponse) => void): Request<AutoScalingPlans.Types.DescribeScalingPlanResourcesResponse, AWSError>;
  /**
   * Describes one or more of your scaling plans.
   */
  describeScalingPlans(params: AutoScalingPlans.Types.DescribeScalingPlansRequest, callback?: (err: AWSError, data: AutoScalingPlans.Types.DescribeScalingPlansResponse) => void): Request<AutoScalingPlans.Types.DescribeScalingPlansResponse, AWSError>;
  /**
   * Describes one or more of your scaling plans.
   */
  describeScalingPlans(callback?: (err: AWSError, data: AutoScalingPlans.Types.DescribeScalingPlansResponse) => void): Request<AutoScalingPlans.Types.DescribeScalingPlansResponse, AWSError>;
  /**
   * Retrieves the forecast data for a scalable resource. Capacity forecasts are represented as predicted values, or data points, that are calculated using historical data points from a specified CloudWatch load metric. Data points are available for up to 56 days. 
   */
  getScalingPlanResourceForecastData(params: AutoScalingPlans.Types.GetScalingPlanResourceForecastDataRequest, callback?: (err: AWSError, data: AutoScalingPlans.Types.GetScalingPlanResourceForecastDataResponse) => void): Request<AutoScalingPlans.Types.GetScalingPlanResourceForecastDataResponse, AWSError>;
  /**
   * Retrieves the forecast data for a scalable resource. Capacity forecasts are represented as predicted values, or data points, that are calculated using historical data points from a specified CloudWatch load metric. Data points are available for up to 56 days. 
   */
  getScalingPlanResourceForecastData(callback?: (err: AWSError, data: AutoScalingPlans.Types.GetScalingPlanResourceForecastDataResponse) => void): Request<AutoScalingPlans.Types.GetScalingPlanResourceForecastDataResponse, AWSError>;
  /**
   * Updates the specified scaling plan. You cannot update a scaling plan if it is in the process of being created, updated, or deleted.
   */
  updateScalingPlan(params: AutoScalingPlans.Types.UpdateScalingPlanRequest, callback?: (err: AWSError, data: AutoScalingPlans.Types.UpdateScalingPlanResponse) => void): Request<AutoScalingPlans.Types.UpdateScalingPlanResponse, AWSError>;
  /**
   * Updates the specified scaling plan. You cannot update a scaling plan if it is in the process of being created, updated, or deleted.
   */
  updateScalingPlan(callback?: (err: AWSError, data: AutoScalingPlans.Types.UpdateScalingPlanResponse) => void): Request<AutoScalingPlans.Types.UpdateScalingPlanResponse, AWSError>;
}
declare namespace AutoScalingPlans {
  export interface ApplicationSource {
    /**
     * The Amazon Resource Name (ARN) of a AWS CloudFormation stack.
     */
    CloudFormationStackARN?: XmlString;
    /**
     * A set of tags (up to 50).
     */
    TagFilters?: TagFilters;
  }
  export type ApplicationSources = ApplicationSource[];
  export type Cooldown = number;
  export interface CreateScalingPlanRequest {
    /**
     * The name of the scaling plan. Names cannot contain vertical bars, colons, or forward slashes.
     */
    ScalingPlanName: ScalingPlanName;
    /**
     * A CloudFormation stack or set of tags. You can create one scaling plan per application source. For more information, see ApplicationSource in the AWS Auto Scaling API Reference.
     */
    ApplicationSource: ApplicationSource;
    /**
     * The scaling instructions. For more information, see ScalingInstruction in the AWS Auto Scaling API Reference.
     */
    ScalingInstructions: ScalingInstructions;
  }
  export interface CreateScalingPlanResponse {
    /**
     * The version number of the scaling plan. This value is always 1. Currently, you cannot have multiple scaling plan versions.
     */
    ScalingPlanVersion: ScalingPlanVersion;
  }
  export interface CustomizedLoadMetricSpecification {
    /**
     * The name of the metric.
     */
    MetricName: MetricName;
    /**
     * The namespace of the metric.
     */
    Namespace: MetricNamespace;
    /**
     * The dimensions of the metric. Conditional: If you published your metric with dimensions, you must specify the same dimensions in your customized load metric specification.
     */
    Dimensions?: MetricDimensions;
    /**
     * The statistic of the metric. The only valid value is Sum.
     */
    Statistic: MetricStatistic;
    /**
     * The unit of the metric.
     */
    Unit?: MetricUnit;
  }
  export interface CustomizedScalingMetricSpecification {
    /**
     * The name of the metric.
     */
    MetricName: MetricName;
    /**
     * The namespace of the metric.
     */
    Namespace: MetricNamespace;
    /**
     * The dimensions of the metric. Conditional: If you published your metric with dimensions, you must specify the same dimensions in your customized scaling metric specification.
     */
    Dimensions?: MetricDimensions;
    /**
     * The statistic of the metric.
     */
    Statistic: MetricStatistic;
    /**
     * The unit of the metric. 
     */
    Unit?: MetricUnit;
  }
  export interface Datapoint {
    /**
     * The time stamp for the data point in UTC format.
     */
    Timestamp?: TimestampType;
    /**
     * The value of the data point.
     */
    Value?: MetricScale;
  }
  export type Datapoints = Datapoint[];
  export interface DeleteScalingPlanRequest {
    /**
     * The name of the scaling plan.
     */
    ScalingPlanName: ScalingPlanName;
    /**
     * The version number of the scaling plan. Currently, the only valid value is 1.
     */
    ScalingPlanVersion: ScalingPlanVersion;
  }
  export interface DeleteScalingPlanResponse {
  }
  export interface DescribeScalingPlanResourcesRequest {
    /**
     * The name of the scaling plan.
     */
    ScalingPlanName: ScalingPlanName;
    /**
     * The version number of the scaling plan. Currently, the only valid value is 1.
     */
    ScalingPlanVersion: ScalingPlanVersion;
    /**
     * The maximum number of scalable resources to return. The value must be between 1 and 50. The default value is 50.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeScalingPlanResourcesResponse {
    /**
     * Information about the scalable resources.
     */
    ScalingPlanResources?: ScalingPlanResources;
    /**
     * The token required to get the next set of results. This value is null if there are no more results to return.
     */
    NextToken?: NextToken;
  }
  export interface DescribeScalingPlansRequest {
    /**
     * The names of the scaling plans (up to 10). If you specify application sources, you cannot specify scaling plan names.
     */
    ScalingPlanNames?: ScalingPlanNames;
    /**
     * The version number of the scaling plan. Currently, the only valid value is 1.  If you specify a scaling plan version, you must also specify a scaling plan name. 
     */
    ScalingPlanVersion?: ScalingPlanVersion;
    /**
     * The sources for the applications (up to 10). If you specify scaling plan names, you cannot specify application sources.
     */
    ApplicationSources?: ApplicationSources;
    /**
     * The maximum number of scalable resources to return. This value can be between 1 and 50. The default value is 50.
     */
    MaxResults?: MaxResults;
    /**
     * The token for the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface DescribeScalingPlansResponse {
    /**
     * Information about the scaling plans.
     */
    ScalingPlans?: ScalingPlans;
    /**
     * The token required to get the next set of results. This value is null if there are no more results to return.
     */
    NextToken?: NextToken;
  }
  export type DisableDynamicScaling = boolean;
  export type DisableScaleIn = boolean;
  export type ForecastDataType = "CapacityForecast"|"LoadForecast"|"ScheduledActionMinCapacity"|"ScheduledActionMaxCapacity"|string;
  export interface GetScalingPlanResourceForecastDataRequest {
    /**
     * The name of the scaling plan.
     */
    ScalingPlanName: ScalingPlanName;
    /**
     * The version number of the scaling plan. Currently, the only valid value is 1.
     */
    ScalingPlanVersion: ScalingPlanVersion;
    /**
     * The namespace of the AWS service. The only valid value is autoscaling. 
     */
    ServiceNamespace: ServiceNamespace;
    /**
     * The ID of the resource. This string consists of a prefix (autoScalingGroup) followed by the name of a specified Auto Scaling group (my-asg). Example: autoScalingGroup/my-asg. 
     */
    ResourceId: XmlString;
    /**
     * The scalable dimension for the resource. The only valid value is autoscaling:autoScalingGroup:DesiredCapacity. 
     */
    ScalableDimension: ScalableDimension;
    /**
     * The type of forecast data to get.    LoadForecast: The load metric forecast.     CapacityForecast: The capacity forecast.     ScheduledActionMinCapacity: The minimum capacity for each scheduled scaling action. This data is calculated as the larger of two values: the capacity forecast or the minimum capacity in the scaling instruction.    ScheduledActionMaxCapacity: The maximum capacity for each scheduled scaling action. The calculation used is determined by the predictive scaling maximum capacity behavior setting in the scaling instruction.  
     */
    ForecastDataType: ForecastDataType;
    /**
     * The inclusive start time of the time range for the forecast data to get. The date and time can be at most 56 days before the current date and time. 
     */
    StartTime: TimestampType;
    /**
     * The exclusive end time of the time range for the forecast data to get. The maximum time duration between the start and end time is seven days.  Although this parameter can accept a date and time that is more than two days in the future, the availability of forecast data has limits. AWS Auto Scaling only issues forecasts for periods of two days in advance.
     */
    EndTime: TimestampType;
  }
  export interface GetScalingPlanResourceForecastDataResponse {
    /**
     * The data points to return.
     */
    Datapoints: Datapoints;
  }
  export type LoadMetricType = "ASGTotalCPUUtilization"|"ASGTotalNetworkIn"|"ASGTotalNetworkOut"|"ALBTargetGroupRequestCount"|string;
  export type MaxResults = number;
  export interface MetricDimension {
    /**
     * The name of the dimension.
     */
    Name: MetricDimensionName;
    /**
     * The value of the dimension.
     */
    Value: MetricDimensionValue;
  }
  export type MetricDimensionName = string;
  export type MetricDimensionValue = string;
  export type MetricDimensions = MetricDimension[];
  export type MetricName = string;
  export type MetricNamespace = string;
  export type MetricScale = number;
  export type MetricStatistic = "Average"|"Minimum"|"Maximum"|"SampleCount"|"Sum"|string;
  export type MetricUnit = string;
  export type NextToken = string;
  export type PolicyName = string;
  export type PolicyType = "TargetTrackingScaling"|string;
  export interface PredefinedLoadMetricSpecification {
    /**
     * The metric type.
     */
    PredefinedLoadMetricType: LoadMetricType;
    /**
     * Identifies the resource associated with the metric type. You can't specify a resource label unless the metric type is ALBTargetGroupRequestCount and there is a target group for an Application Load Balancer attached to the Auto Scaling group. You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format is app/&lt;load-balancer-name&gt;/&lt;load-balancer-id&gt;/targetgroup/&lt;target-group-name&gt;/&lt;target-group-id&gt;, where:   app/&lt;load-balancer-name&gt;/&lt;load-balancer-id&gt; is the final portion of the load balancer ARN   targetgroup/&lt;target-group-name&gt;/&lt;target-group-id&gt; is the final portion of the target group ARN.   This is an example: app/EC2Co-EcsEl-1TKLTMITMM0EO/f37c06a68c1748aa/targetgroup/EC2Co-Defau-LDNM7Q3ZH1ZN/6d4ea56ca2d6a18d. To find the ARN for an Application Load Balancer, use the DescribeLoadBalancers API operation. To find the ARN for the target group, use the DescribeTargetGroups API operation.
     */
    ResourceLabel?: ResourceLabel;
  }
  export interface PredefinedScalingMetricSpecification {
    /**
     * The metric type. The ALBRequestCountPerTarget metric type applies only to Auto Scaling groups, Spot Fleet requests, and ECS services.
     */
    PredefinedScalingMetricType: ScalingMetricType;
    /**
     * Identifies the resource associated with the metric type. You can't specify a resource label unless the metric type is ALBRequestCountPerTarget and there is a target group for an Application Load Balancer attached to the Auto Scaling group, Spot Fleet request, or ECS service. You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format is app/&lt;load-balancer-name&gt;/&lt;load-balancer-id&gt;/targetgroup/&lt;target-group-name&gt;/&lt;target-group-id&gt;, where:   app/&lt;load-balancer-name&gt;/&lt;load-balancer-id&gt; is the final portion of the load balancer ARN   targetgroup/&lt;target-group-name&gt;/&lt;target-group-id&gt; is the final portion of the target group ARN.   This is an example: app/EC2Co-EcsEl-1TKLTMITMM0EO/f37c06a68c1748aa/targetgroup/EC2Co-Defau-LDNM7Q3ZH1ZN/6d4ea56ca2d6a18d. To find the ARN for an Application Load Balancer, use the DescribeLoadBalancers API operation. To find the ARN for the target group, use the DescribeTargetGroups API operation.
     */
    ResourceLabel?: ResourceLabel;
  }
  export type PredictiveScalingMaxCapacityBehavior = "SetForecastCapacityToMaxCapacity"|"SetMaxCapacityToForecastCapacity"|"SetMaxCapacityAboveForecastCapacity"|string;
  export type PredictiveScalingMode = "ForecastAndScale"|"ForecastOnly"|string;
  export type ResourceCapacity = number;
  export type ResourceIdMaxLen1600 = string;
  export type ResourceLabel = string;
  export type ScalableDimension = "autoscaling:autoScalingGroup:DesiredCapacity"|"ecs:service:DesiredCount"|"ec2:spot-fleet-request:TargetCapacity"|"rds:cluster:ReadReplicaCount"|"dynamodb:table:ReadCapacityUnits"|"dynamodb:table:WriteCapacityUnits"|"dynamodb:index:ReadCapacityUnits"|"dynamodb:index:WriteCapacityUnits"|string;
  export interface ScalingInstruction {
    /**
     * The namespace of the AWS service.
     */
    ServiceNamespace: ServiceNamespace;
    /**
     * The ID of the resource. This string consists of the resource type and unique identifier.   Auto Scaling group - The resource type is autoScalingGroup and the unique identifier is the name of the Auto Scaling group. Example: autoScalingGroup/my-asg.   ECS service - The resource type is service and the unique identifier is the cluster name and service name. Example: service/default/sample-webapp.   Spot Fleet request - The resource type is spot-fleet-request and the unique identifier is the Spot Fleet request ID. Example: spot-fleet-request/sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE.   DynamoDB table - The resource type is table and the unique identifier is the resource ID. Example: table/my-table.   DynamoDB global secondary index - The resource type is index and the unique identifier is the resource ID. Example: table/my-table/index/my-table-index.   Aurora DB cluster - The resource type is cluster and the unique identifier is the cluster name. Example: cluster:my-db-cluster.  
     */
    ResourceId: ResourceIdMaxLen1600;
    /**
     * The scalable dimension associated with the resource.    autoscaling:autoScalingGroup:DesiredCapacity - The desired capacity of an Auto Scaling group.    ecs:service:DesiredCount - The desired task count of an ECS service.    ec2:spot-fleet-request:TargetCapacity - The target capacity of a Spot Fleet request.    dynamodb:table:ReadCapacityUnits - The provisioned read capacity for a DynamoDB table.    dynamodb:table:WriteCapacityUnits - The provisioned write capacity for a DynamoDB table.    dynamodb:index:ReadCapacityUnits - The provisioned read capacity for a DynamoDB global secondary index.    dynamodb:index:WriteCapacityUnits - The provisioned write capacity for a DynamoDB global secondary index.    rds:cluster:ReadReplicaCount - The count of Aurora Replicas in an Aurora DB cluster. Available for Aurora MySQL-compatible edition and Aurora PostgreSQL-compatible edition.  
     */
    ScalableDimension: ScalableDimension;
    /**
     * The minimum capacity of the resource. 
     */
    MinCapacity: ResourceCapacity;
    /**
     * The maximum capacity of the resource. The exception to this upper limit is if you specify a non-default setting for PredictiveScalingMaxCapacityBehavior. 
     */
    MaxCapacity: ResourceCapacity;
    /**
     * The target tracking configurations (up to 10). Each of these structures must specify a unique scaling metric and a target value for the metric. 
     */
    TargetTrackingConfigurations: TargetTrackingConfigurations;
    /**
     * The predefined load metric to use for predictive scaling. This parameter or a CustomizedLoadMetricSpecification is required when configuring predictive scaling, and cannot be used otherwise. 
     */
    PredefinedLoadMetricSpecification?: PredefinedLoadMetricSpecification;
    /**
     * The customized load metric to use for predictive scaling. This parameter or a PredefinedLoadMetricSpecification is required when configuring predictive scaling, and cannot be used otherwise. 
     */
    CustomizedLoadMetricSpecification?: CustomizedLoadMetricSpecification;
    /**
     * The amount of time, in seconds, to buffer the run time of scheduled scaling actions when scaling out. For example, if the forecast says to add capacity at 10:00 AM, and the buffer time is 5 minutes, then the run time of the corresponding scheduled scaling action will be 9:55 AM. The intention is to give resources time to be provisioned. For example, it can take a few minutes to launch an EC2 instance. The actual amount of time required depends on several factors, such as the size of the instance and whether there are startup scripts to complete.  The value must be less than the forecast interval duration of 3600 seconds (60 minutes). The default is 300 seconds.  Only valid when configuring predictive scaling. 
     */
    ScheduledActionBufferTime?: ScheduledActionBufferTime;
    /**
     * Defines the behavior that should be applied if the forecast capacity approaches or exceeds the maximum capacity specified for the resource. The default value is SetForecastCapacityToMaxCapacity. The following are possible values:    SetForecastCapacityToMaxCapacity - AWS Auto Scaling cannot scale resource capacity higher than the maximum capacity. The maximum capacity is enforced as a hard limit.     SetMaxCapacityToForecastCapacity - AWS Auto Scaling may scale resource capacity higher than the maximum capacity to equal but not exceed forecast capacity.    SetMaxCapacityAboveForecastCapacity - AWS Auto Scaling may scale resource capacity higher than the maximum capacity by a specified buffer value. The intention is to give the target tracking scaling policy extra capacity if unexpected traffic occurs.    Only valid when configuring predictive scaling.
     */
    PredictiveScalingMaxCapacityBehavior?: PredictiveScalingMaxCapacityBehavior;
    /**
     * The size of the capacity buffer to use when the forecast capacity is close to or exceeds the maximum capacity. The value is specified as a percentage relative to the forecast capacity. For example, if the buffer is 10, this means a 10 percent buffer, such that if the forecast capacity is 50, and the maximum capacity is 40, then the effective maximum capacity is 55. Only valid when configuring predictive scaling. Required if the PredictiveScalingMaxCapacityBehavior is set to SetMaxCapacityAboveForecastCapacity, and cannot be used otherwise. The range is 1-100.
     */
    PredictiveScalingMaxCapacityBuffer?: ResourceCapacity;
    /**
     * The predictive scaling mode. The default value is ForecastAndScale. Otherwise, AWS Auto Scaling forecasts capacity but does not create any scheduled scaling actions based on the capacity forecast. 
     */
    PredictiveScalingMode?: PredictiveScalingMode;
    /**
     * Controls whether a resource's externally created scaling policies are kept or replaced.  The default value is KeepExternalPolicies. If the parameter is set to ReplaceExternalPolicies, any scaling policies that are external to AWS Auto Scaling are deleted and new target tracking scaling policies created.  Only valid when configuring dynamic scaling.  Condition: The number of existing policies to be replaced must be less than or equal to 50. If there are more than 50 policies to be replaced, AWS Auto Scaling keeps all existing policies and does not create new ones.
     */
    ScalingPolicyUpdateBehavior?: ScalingPolicyUpdateBehavior;
    /**
     * Controls whether dynamic scaling by AWS Auto Scaling is disabled. When dynamic scaling is enabled, AWS Auto Scaling creates target tracking scaling policies based on the specified target tracking configurations.  The default is enabled (false). 
     */
    DisableDynamicScaling?: DisableDynamicScaling;
  }
  export type ScalingInstructions = ScalingInstruction[];
  export type ScalingMetricType = "ASGAverageCPUUtilization"|"ASGAverageNetworkIn"|"ASGAverageNetworkOut"|"DynamoDBReadCapacityUtilization"|"DynamoDBWriteCapacityUtilization"|"ECSServiceAverageCPUUtilization"|"ECSServiceAverageMemoryUtilization"|"ALBRequestCountPerTarget"|"RDSReaderAverageCPUUtilization"|"RDSReaderAverageDatabaseConnections"|"EC2SpotFleetRequestAverageCPUUtilization"|"EC2SpotFleetRequestAverageNetworkIn"|"EC2SpotFleetRequestAverageNetworkOut"|string;
  export interface ScalingPlan {
    /**
     * The name of the scaling plan.
     */
    ScalingPlanName: ScalingPlanName;
    /**
     * The version number of the scaling plan.
     */
    ScalingPlanVersion: ScalingPlanVersion;
    /**
     * A CloudFormation stack or a set of tags. You can create one scaling plan per application source.
     */
    ApplicationSource: ApplicationSource;
    /**
     * The scaling instructions.
     */
    ScalingInstructions: ScalingInstructions;
    /**
     * The status of the scaling plan.    Active - The scaling plan is active.    ActiveWithProblems - The scaling plan is active, but the scaling configuration for one or more resources could not be applied.    CreationInProgress - The scaling plan is being created.    CreationFailed - The scaling plan could not be created.    DeletionInProgress - The scaling plan is being deleted.    DeletionFailed - The scaling plan could not be deleted.    UpdateInProgress - The scaling plan is being updated.    UpdateFailed - The scaling plan could not be updated.  
     */
    StatusCode: ScalingPlanStatusCode;
    /**
     * A simple message about the current status of the scaling plan.
     */
    StatusMessage?: XmlString;
    /**
     * The Unix time stamp when the scaling plan entered the current status.
     */
    StatusStartTime?: TimestampType;
    /**
     * The Unix time stamp when the scaling plan was created.
     */
    CreationTime?: TimestampType;
  }
  export type ScalingPlanName = string;
  export type ScalingPlanNames = ScalingPlanName[];
  export interface ScalingPlanResource {
    /**
     * The name of the scaling plan.
     */
    ScalingPlanName: ScalingPlanName;
    /**
     * The version number of the scaling plan.
     */
    ScalingPlanVersion: ScalingPlanVersion;
    /**
     * The namespace of the AWS service.
     */
    ServiceNamespace: ServiceNamespace;
    /**
     * The ID of the resource. This string consists of the resource type and unique identifier.   Auto Scaling group - The resource type is autoScalingGroup and the unique identifier is the name of the Auto Scaling group. Example: autoScalingGroup/my-asg.   ECS service - The resource type is service and the unique identifier is the cluster name and service name. Example: service/default/sample-webapp.   Spot Fleet request - The resource type is spot-fleet-request and the unique identifier is the Spot Fleet request ID. Example: spot-fleet-request/sfr-73fbd2ce-aa30-494c-8788-1cee4EXAMPLE.   DynamoDB table - The resource type is table and the unique identifier is the resource ID. Example: table/my-table.   DynamoDB global secondary index - The resource type is index and the unique identifier is the resource ID. Example: table/my-table/index/my-table-index.   Aurora DB cluster - The resource type is cluster and the unique identifier is the cluster name. Example: cluster:my-db-cluster.  
     */
    ResourceId: ResourceIdMaxLen1600;
    /**
     * The scalable dimension for the resource.    autoscaling:autoScalingGroup:DesiredCapacity - The desired capacity of an Auto Scaling group.    ecs:service:DesiredCount - The desired task count of an ECS service.    ec2:spot-fleet-request:TargetCapacity - The target capacity of a Spot Fleet request.    dynamodb:table:ReadCapacityUnits - The provisioned read capacity for a DynamoDB table.    dynamodb:table:WriteCapacityUnits - The provisioned write capacity for a DynamoDB table.    dynamodb:index:ReadCapacityUnits - The provisioned read capacity for a DynamoDB global secondary index.    dynamodb:index:WriteCapacityUnits - The provisioned write capacity for a DynamoDB global secondary index.    rds:cluster:ReadReplicaCount - The count of Aurora Replicas in an Aurora DB cluster. Available for Aurora MySQL-compatible edition and Aurora PostgreSQL-compatible edition.  
     */
    ScalableDimension: ScalableDimension;
    /**
     * The scaling policies.
     */
    ScalingPolicies?: ScalingPolicies;
    /**
     * The scaling status of the resource.    Active - The scaling configuration is active.    Inactive - The scaling configuration is not active because the scaling plan is being created or the scaling configuration could not be applied. Check the status message for more information.    PartiallyActive - The scaling configuration is partially active because the scaling plan is being created or deleted or the scaling configuration could not be fully applied. Check the status message for more information.  
     */
    ScalingStatusCode: ScalingStatusCode;
    /**
     * A simple message about the current scaling status of the resource.
     */
    ScalingStatusMessage?: XmlString;
  }
  export type ScalingPlanResources = ScalingPlanResource[];
  export type ScalingPlanStatusCode = "Active"|"ActiveWithProblems"|"CreationInProgress"|"CreationFailed"|"DeletionInProgress"|"DeletionFailed"|"UpdateInProgress"|"UpdateFailed"|string;
  export type ScalingPlanVersion = number;
  export type ScalingPlans = ScalingPlan[];
  export type ScalingPolicies = ScalingPolicy[];
  export interface ScalingPolicy {
    /**
     * The name of the scaling policy.
     */
    PolicyName: PolicyName;
    /**
     * The type of scaling policy.
     */
    PolicyType: PolicyType;
    /**
     * The target tracking scaling policy. Includes support for predefined or customized metrics.
     */
    TargetTrackingConfiguration?: TargetTrackingConfiguration;
  }
  export type ScalingPolicyUpdateBehavior = "KeepExternalPolicies"|"ReplaceExternalPolicies"|string;
  export type ScalingStatusCode = "Inactive"|"PartiallyActive"|"Active"|string;
  export type ScheduledActionBufferTime = number;
  export type ServiceNamespace = "autoscaling"|"ecs"|"ec2"|"rds"|"dynamodb"|string;
  export interface TagFilter {
    /**
     * The tag key.
     */
    Key?: XmlStringMaxLen128;
    /**
     * The tag values (0 to 20).
     */
    Values?: TagValues;
  }
  export type TagFilters = TagFilter[];
  export type TagValues = XmlStringMaxLen256[];
  export interface TargetTrackingConfiguration {
    /**
     * A predefined metric. You can specify either a predefined metric or a customized metric.
     */
    PredefinedScalingMetricSpecification?: PredefinedScalingMetricSpecification;
    /**
     * A customized metric. You can specify either a predefined metric or a customized metric. 
     */
    CustomizedScalingMetricSpecification?: CustomizedScalingMetricSpecification;
    /**
     * The target value for the metric. Although this property accepts numbers of type Double, it won't accept values that are either too small or too large. Values must be in the range of -2^360 to 2^360.
     */
    TargetValue: MetricScale;
    /**
     * Indicates whether scale in by the target tracking scaling policy is disabled. If the value is true, scale in is disabled and the target tracking scaling policy doesn't remove capacity from the scalable resource. Otherwise, scale in is enabled and the target tracking scaling policy can remove capacity from the scalable resource.  The default value is false.
     */
    DisableScaleIn?: DisableScaleIn;
    /**
     * The amount of time, in seconds, to wait for a previous scale-out activity to take effect. This property is not used if the scalable resource is an Auto Scaling group. With the scale-out cooldown period, the intention is to continuously (but not excessively) scale out. After Auto Scaling successfully scales out using a target tracking scaling policy, it starts to calculate the cooldown time. The scaling policy won't increase the desired capacity again unless either a larger scale out is triggered or the cooldown period ends.
     */
    ScaleOutCooldown?: Cooldown;
    /**
     * The amount of time, in seconds, after a scale-in activity completes before another scale-in activity can start. This property is not used if the scalable resource is an Auto Scaling group. With the scale-in cooldown period, the intention is to scale in conservatively to protect your application’s availability, so scale-in activities are blocked until the cooldown period has expired. However, if another alarm triggers a scale-out activity during the scale-in cooldown period, Auto Scaling scales out the target immediately. In this case, the scale-in cooldown period stops and doesn't complete.
     */
    ScaleInCooldown?: Cooldown;
    /**
     * The estimated time, in seconds, until a newly launched instance can contribute to the CloudWatch metrics. This value is used only if the resource is an Auto Scaling group.
     */
    EstimatedInstanceWarmup?: Cooldown;
  }
  export type TargetTrackingConfigurations = TargetTrackingConfiguration[];
  export type TimestampType = Date;
  export interface UpdateScalingPlanRequest {
    /**
     * The name of the scaling plan.
     */
    ScalingPlanName: ScalingPlanName;
    /**
     * The version number of the scaling plan. The only valid value is 1. Currently, you cannot have multiple scaling plan versions.
     */
    ScalingPlanVersion: ScalingPlanVersion;
    /**
     * A CloudFormation stack or set of tags. For more information, see ApplicationSource in the AWS Auto Scaling API Reference.
     */
    ApplicationSource?: ApplicationSource;
    /**
     * The scaling instructions. For more information, see ScalingInstruction in the AWS Auto Scaling API Reference.
     */
    ScalingInstructions?: ScalingInstructions;
  }
  export interface UpdateScalingPlanResponse {
  }
  export type XmlString = string;
  export type XmlStringMaxLen128 = string;
  export type XmlStringMaxLen256 = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-01-06"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AutoScalingPlans client.
   */
  export import Types = AutoScalingPlans;
}
export = AutoScalingPlans;
