import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ApplicationInsights extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ApplicationInsights.Types.ClientConfiguration)
  config: Config & ApplicationInsights.Types.ClientConfiguration;
  /**
   * Adds an application that is created from a resource group.
   */
  createApplication(params: ApplicationInsights.Types.CreateApplicationRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.CreateApplicationResponse) => void): Request<ApplicationInsights.Types.CreateApplicationResponse, AWSError>;
  /**
   * Adds an application that is created from a resource group.
   */
  createApplication(callback?: (err: AWSError, data: ApplicationInsights.Types.CreateApplicationResponse) => void): Request<ApplicationInsights.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates a custom component by grouping similar standalone instances to monitor.
   */
  createComponent(params: ApplicationInsights.Types.CreateComponentRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.CreateComponentResponse) => void): Request<ApplicationInsights.Types.CreateComponentResponse, AWSError>;
  /**
   * Creates a custom component by grouping similar standalone instances to monitor.
   */
  createComponent(callback?: (err: AWSError, data: ApplicationInsights.Types.CreateComponentResponse) => void): Request<ApplicationInsights.Types.CreateComponentResponse, AWSError>;
  /**
   * Adds an log pattern to a LogPatternSet.
   */
  createLogPattern(params: ApplicationInsights.Types.CreateLogPatternRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.CreateLogPatternResponse) => void): Request<ApplicationInsights.Types.CreateLogPatternResponse, AWSError>;
  /**
   * Adds an log pattern to a LogPatternSet.
   */
  createLogPattern(callback?: (err: AWSError, data: ApplicationInsights.Types.CreateLogPatternResponse) => void): Request<ApplicationInsights.Types.CreateLogPatternResponse, AWSError>;
  /**
   * Removes the specified application from monitoring. Does not delete the application.
   */
  deleteApplication(params: ApplicationInsights.Types.DeleteApplicationRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DeleteApplicationResponse) => void): Request<ApplicationInsights.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Removes the specified application from monitoring. Does not delete the application.
   */
  deleteApplication(callback?: (err: AWSError, data: ApplicationInsights.Types.DeleteApplicationResponse) => void): Request<ApplicationInsights.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Ungroups a custom component. When you ungroup custom components, all applicable monitors that are set up for the component are removed and the instances revert to their standalone status.
   */
  deleteComponent(params: ApplicationInsights.Types.DeleteComponentRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DeleteComponentResponse) => void): Request<ApplicationInsights.Types.DeleteComponentResponse, AWSError>;
  /**
   * Ungroups a custom component. When you ungroup custom components, all applicable monitors that are set up for the component are removed and the instances revert to their standalone status.
   */
  deleteComponent(callback?: (err: AWSError, data: ApplicationInsights.Types.DeleteComponentResponse) => void): Request<ApplicationInsights.Types.DeleteComponentResponse, AWSError>;
  /**
   * Removes the specified log pattern from a LogPatternSet.
   */
  deleteLogPattern(params: ApplicationInsights.Types.DeleteLogPatternRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DeleteLogPatternResponse) => void): Request<ApplicationInsights.Types.DeleteLogPatternResponse, AWSError>;
  /**
   * Removes the specified log pattern from a LogPatternSet.
   */
  deleteLogPattern(callback?: (err: AWSError, data: ApplicationInsights.Types.DeleteLogPatternResponse) => void): Request<ApplicationInsights.Types.DeleteLogPatternResponse, AWSError>;
  /**
   * Describes the application.
   */
  describeApplication(params: ApplicationInsights.Types.DescribeApplicationRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeApplicationResponse) => void): Request<ApplicationInsights.Types.DescribeApplicationResponse, AWSError>;
  /**
   * Describes the application.
   */
  describeApplication(callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeApplicationResponse) => void): Request<ApplicationInsights.Types.DescribeApplicationResponse, AWSError>;
  /**
   * Describes a component and lists the resources that are grouped together in a component.
   */
  describeComponent(params: ApplicationInsights.Types.DescribeComponentRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeComponentResponse) => void): Request<ApplicationInsights.Types.DescribeComponentResponse, AWSError>;
  /**
   * Describes a component and lists the resources that are grouped together in a component.
   */
  describeComponent(callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeComponentResponse) => void): Request<ApplicationInsights.Types.DescribeComponentResponse, AWSError>;
  /**
   * Describes the monitoring configuration of the component.
   */
  describeComponentConfiguration(params: ApplicationInsights.Types.DescribeComponentConfigurationRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeComponentConfigurationResponse) => void): Request<ApplicationInsights.Types.DescribeComponentConfigurationResponse, AWSError>;
  /**
   * Describes the monitoring configuration of the component.
   */
  describeComponentConfiguration(callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeComponentConfigurationResponse) => void): Request<ApplicationInsights.Types.DescribeComponentConfigurationResponse, AWSError>;
  /**
   * Describes the recommended monitoring configuration of the component.
   */
  describeComponentConfigurationRecommendation(params: ApplicationInsights.Types.DescribeComponentConfigurationRecommendationRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeComponentConfigurationRecommendationResponse) => void): Request<ApplicationInsights.Types.DescribeComponentConfigurationRecommendationResponse, AWSError>;
  /**
   * Describes the recommended monitoring configuration of the component.
   */
  describeComponentConfigurationRecommendation(callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeComponentConfigurationRecommendationResponse) => void): Request<ApplicationInsights.Types.DescribeComponentConfigurationRecommendationResponse, AWSError>;
  /**
   * Describe a specific log pattern from a LogPatternSet.
   */
  describeLogPattern(params: ApplicationInsights.Types.DescribeLogPatternRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeLogPatternResponse) => void): Request<ApplicationInsights.Types.DescribeLogPatternResponse, AWSError>;
  /**
   * Describe a specific log pattern from a LogPatternSet.
   */
  describeLogPattern(callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeLogPatternResponse) => void): Request<ApplicationInsights.Types.DescribeLogPatternResponse, AWSError>;
  /**
   * Describes an anomaly or error with the application.
   */
  describeObservation(params: ApplicationInsights.Types.DescribeObservationRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeObservationResponse) => void): Request<ApplicationInsights.Types.DescribeObservationResponse, AWSError>;
  /**
   * Describes an anomaly or error with the application.
   */
  describeObservation(callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeObservationResponse) => void): Request<ApplicationInsights.Types.DescribeObservationResponse, AWSError>;
  /**
   * Describes an application problem.
   */
  describeProblem(params: ApplicationInsights.Types.DescribeProblemRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeProblemResponse) => void): Request<ApplicationInsights.Types.DescribeProblemResponse, AWSError>;
  /**
   * Describes an application problem.
   */
  describeProblem(callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeProblemResponse) => void): Request<ApplicationInsights.Types.DescribeProblemResponse, AWSError>;
  /**
   * Describes the anomalies or errors associated with the problem.
   */
  describeProblemObservations(params: ApplicationInsights.Types.DescribeProblemObservationsRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeProblemObservationsResponse) => void): Request<ApplicationInsights.Types.DescribeProblemObservationsResponse, AWSError>;
  /**
   * Describes the anomalies or errors associated with the problem.
   */
  describeProblemObservations(callback?: (err: AWSError, data: ApplicationInsights.Types.DescribeProblemObservationsResponse) => void): Request<ApplicationInsights.Types.DescribeProblemObservationsResponse, AWSError>;
  /**
   * Lists the IDs of the applications that you are monitoring. 
   */
  listApplications(params: ApplicationInsights.Types.ListApplicationsRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.ListApplicationsResponse) => void): Request<ApplicationInsights.Types.ListApplicationsResponse, AWSError>;
  /**
   * Lists the IDs of the applications that you are monitoring. 
   */
  listApplications(callback?: (err: AWSError, data: ApplicationInsights.Types.ListApplicationsResponse) => void): Request<ApplicationInsights.Types.ListApplicationsResponse, AWSError>;
  /**
   * Lists the auto-grouped, standalone, and custom components of the application.
   */
  listComponents(params: ApplicationInsights.Types.ListComponentsRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.ListComponentsResponse) => void): Request<ApplicationInsights.Types.ListComponentsResponse, AWSError>;
  /**
   * Lists the auto-grouped, standalone, and custom components of the application.
   */
  listComponents(callback?: (err: AWSError, data: ApplicationInsights.Types.ListComponentsResponse) => void): Request<ApplicationInsights.Types.ListComponentsResponse, AWSError>;
  /**
   *  Lists the INFO, WARN, and ERROR events for periodic configuration updates performed by Application Insights. Examples of events represented are:    INFO: creating a new alarm or updating an alarm threshold.   WARN: alarm not created due to insufficient data points used to predict thresholds.   ERROR: alarm not created due to permission errors or exceeding quotas.   
   */
  listConfigurationHistory(params: ApplicationInsights.Types.ListConfigurationHistoryRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.ListConfigurationHistoryResponse) => void): Request<ApplicationInsights.Types.ListConfigurationHistoryResponse, AWSError>;
  /**
   *  Lists the INFO, WARN, and ERROR events for periodic configuration updates performed by Application Insights. Examples of events represented are:    INFO: creating a new alarm or updating an alarm threshold.   WARN: alarm not created due to insufficient data points used to predict thresholds.   ERROR: alarm not created due to permission errors or exceeding quotas.   
   */
  listConfigurationHistory(callback?: (err: AWSError, data: ApplicationInsights.Types.ListConfigurationHistoryResponse) => void): Request<ApplicationInsights.Types.ListConfigurationHistoryResponse, AWSError>;
  /**
   * Lists the log pattern sets in the specific application.
   */
  listLogPatternSets(params: ApplicationInsights.Types.ListLogPatternSetsRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.ListLogPatternSetsResponse) => void): Request<ApplicationInsights.Types.ListLogPatternSetsResponse, AWSError>;
  /**
   * Lists the log pattern sets in the specific application.
   */
  listLogPatternSets(callback?: (err: AWSError, data: ApplicationInsights.Types.ListLogPatternSetsResponse) => void): Request<ApplicationInsights.Types.ListLogPatternSetsResponse, AWSError>;
  /**
   * Lists the log patterns in the specific log LogPatternSet.
   */
  listLogPatterns(params: ApplicationInsights.Types.ListLogPatternsRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.ListLogPatternsResponse) => void): Request<ApplicationInsights.Types.ListLogPatternsResponse, AWSError>;
  /**
   * Lists the log patterns in the specific log LogPatternSet.
   */
  listLogPatterns(callback?: (err: AWSError, data: ApplicationInsights.Types.ListLogPatternsResponse) => void): Request<ApplicationInsights.Types.ListLogPatternsResponse, AWSError>;
  /**
   * Lists the problems with your application.
   */
  listProblems(params: ApplicationInsights.Types.ListProblemsRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.ListProblemsResponse) => void): Request<ApplicationInsights.Types.ListProblemsResponse, AWSError>;
  /**
   * Lists the problems with your application.
   */
  listProblems(callback?: (err: AWSError, data: ApplicationInsights.Types.ListProblemsResponse) => void): Request<ApplicationInsights.Types.ListProblemsResponse, AWSError>;
  /**
   * Retrieve a list of the tags (keys and values) that are associated with a specified application. A tag is a label that you optionally define and associate with an application. Each tag consists of a required tag key and an optional associated tag value. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  listTagsForResource(params: ApplicationInsights.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.ListTagsForResourceResponse) => void): Request<ApplicationInsights.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieve a list of the tags (keys and values) that are associated with a specified application. A tag is a label that you optionally define and associate with an application. Each tag consists of a required tag key and an optional associated tag value. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  listTagsForResource(callback?: (err: AWSError, data: ApplicationInsights.Types.ListTagsForResourceResponse) => void): Request<ApplicationInsights.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Add one or more tags (keys and values) to a specified application. A tag is a label that you optionally define and associate with an application. Tags can help you categorize and manage application in different ways, such as by purpose, owner, environment, or other criteria.  Each tag consists of a required tag key and an associated tag value, both of which you define. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  tagResource(params: ApplicationInsights.Types.TagResourceRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.TagResourceResponse) => void): Request<ApplicationInsights.Types.TagResourceResponse, AWSError>;
  /**
   * Add one or more tags (keys and values) to a specified application. A tag is a label that you optionally define and associate with an application. Tags can help you categorize and manage application in different ways, such as by purpose, owner, environment, or other criteria.  Each tag consists of a required tag key and an associated tag value, both of which you define. A tag key is a general label that acts as a category for more specific tag values. A tag value acts as a descriptor within a tag key.
   */
  tagResource(callback?: (err: AWSError, data: ApplicationInsights.Types.TagResourceResponse) => void): Request<ApplicationInsights.Types.TagResourceResponse, AWSError>;
  /**
   * Remove one or more tags (keys and values) from a specified application.
   */
  untagResource(params: ApplicationInsights.Types.UntagResourceRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.UntagResourceResponse) => void): Request<ApplicationInsights.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove one or more tags (keys and values) from a specified application.
   */
  untagResource(callback?: (err: AWSError, data: ApplicationInsights.Types.UntagResourceResponse) => void): Request<ApplicationInsights.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the application.
   */
  updateApplication(params: ApplicationInsights.Types.UpdateApplicationRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.UpdateApplicationResponse) => void): Request<ApplicationInsights.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates the application.
   */
  updateApplication(callback?: (err: AWSError, data: ApplicationInsights.Types.UpdateApplicationResponse) => void): Request<ApplicationInsights.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates the custom component name and/or the list of resources that make up the component.
   */
  updateComponent(params: ApplicationInsights.Types.UpdateComponentRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.UpdateComponentResponse) => void): Request<ApplicationInsights.Types.UpdateComponentResponse, AWSError>;
  /**
   * Updates the custom component name and/or the list of resources that make up the component.
   */
  updateComponent(callback?: (err: AWSError, data: ApplicationInsights.Types.UpdateComponentResponse) => void): Request<ApplicationInsights.Types.UpdateComponentResponse, AWSError>;
  /**
   * Updates the monitoring configurations for the component. The configuration input parameter is an escaped JSON of the configuration and should match the schema of what is returned by DescribeComponentConfigurationRecommendation. 
   */
  updateComponentConfiguration(params: ApplicationInsights.Types.UpdateComponentConfigurationRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.UpdateComponentConfigurationResponse) => void): Request<ApplicationInsights.Types.UpdateComponentConfigurationResponse, AWSError>;
  /**
   * Updates the monitoring configurations for the component. The configuration input parameter is an escaped JSON of the configuration and should match the schema of what is returned by DescribeComponentConfigurationRecommendation. 
   */
  updateComponentConfiguration(callback?: (err: AWSError, data: ApplicationInsights.Types.UpdateComponentConfigurationResponse) => void): Request<ApplicationInsights.Types.UpdateComponentConfigurationResponse, AWSError>;
  /**
   * Adds a log pattern to a LogPatternSet.
   */
  updateLogPattern(params: ApplicationInsights.Types.UpdateLogPatternRequest, callback?: (err: AWSError, data: ApplicationInsights.Types.UpdateLogPatternResponse) => void): Request<ApplicationInsights.Types.UpdateLogPatternResponse, AWSError>;
  /**
   * Adds a log pattern to a LogPatternSet.
   */
  updateLogPattern(callback?: (err: AWSError, data: ApplicationInsights.Types.UpdateLogPatternResponse) => void): Request<ApplicationInsights.Types.UpdateLogPatternResponse, AWSError>;
}
declare namespace ApplicationInsights {
  export type AffectedResource = string;
  export type AmazonResourceName = string;
  export interface ApplicationComponent {
    /**
     * The name of the component.
     */
    ComponentName?: ComponentName;
    /**
     *  If logging is supported for the resource type, indicates whether the component has configured logs to be monitored. 
     */
    ComponentRemarks?: Remarks;
    /**
     * The resource type. Supported resource types include EC2 instances, Auto Scaling group, Classic ELB, Application ELB, and SQS Queue.
     */
    ResourceType?: ResourceType;
    /**
     *  The operating system of the component. 
     */
    OsType?: OsType;
    /**
     * The stack tier of the application component.
     */
    Tier?: Tier;
    /**
     * Indicates whether the application component is monitored. 
     */
    Monitor?: Monitor;
    /**
     *  Workloads detected in the application component. 
     */
    DetectedWorkload?: DetectedWorkload;
  }
  export type ApplicationComponentList = ApplicationComponent[];
  export interface ApplicationInfo {
    /**
     * The name of the resource group used for the application.
     */
    ResourceGroupName?: ResourceGroupName;
    /**
     * The lifecycle of the application. 
     */
    LifeCycle?: LifeCycle;
    /**
     *  The SNS topic provided to Application Insights that is associated to the created opsItems to receive SNS notifications for opsItem updates. 
     */
    OpsItemSNSTopicArn?: OpsItemSNSTopicArn;
    /**
     *  Indicates whether Application Insights will create opsItems for any problem detected by Application Insights for an application. 
     */
    OpsCenterEnabled?: OpsCenterEnabled;
    /**
     *  Indicates whether Application Insights can listen to CloudWatch events for the application resources, such as instance terminated, failed deployment, and others. 
     */
    CWEMonitorEnabled?: CWEMonitorEnabled;
    /**
     * The issues on the user side that block Application Insights from successfully monitoring an application. Example remarks include:   “Configuring application, detected 1 Errors, 3 Warnings”   “Configuring application, detected 1 Unconfigured Components”  
     */
    Remarks?: Remarks;
    AutoConfigEnabled?: AutoConfigEnabled;
    DiscoveryType?: DiscoveryType;
  }
  export type ApplicationInfoList = ApplicationInfo[];
  export type AutoConfigEnabled = boolean;
  export type AutoCreate = boolean;
  export type CWEMonitorEnabled = boolean;
  export type CloudWatchEventDetailType = string;
  export type CloudWatchEventId = string;
  export type CloudWatchEventSource = "EC2"|"CODE_DEPLOY"|"HEALTH"|"RDS"|string;
  export type CodeDeployApplication = string;
  export type CodeDeployDeploymentGroup = string;
  export type CodeDeployDeploymentId = string;
  export type CodeDeployInstanceGroupId = string;
  export type CodeDeployState = string;
  export type ComponentConfiguration = string;
  export type ComponentName = string;
  export interface ConfigurationEvent {
    /**
     *  The resource monitored by Application Insights. 
     */
    MonitoredResourceARN?: ConfigurationEventMonitoredResourceARN;
    /**
     *  The status of the configuration update event. Possible values include INFO, WARN, and ERROR. 
     */
    EventStatus?: ConfigurationEventStatus;
    /**
     *  The resource type that Application Insights attempted to configure, for example, CLOUDWATCH_ALARM. 
     */
    EventResourceType?: ConfigurationEventResourceType;
    /**
     *  The timestamp of the event. 
     */
    EventTime?: ConfigurationEventTime;
    /**
     *  The details of the event in plain text. 
     */
    EventDetail?: ConfigurationEventDetail;
    /**
     *  The name of the resource Application Insights attempted to configure. 
     */
    EventResourceName?: ConfigurationEventResourceName;
  }
  export type ConfigurationEventDetail = string;
  export type ConfigurationEventList = ConfigurationEvent[];
  export type ConfigurationEventMonitoredResourceARN = string;
  export type ConfigurationEventResourceName = string;
  export type ConfigurationEventResourceType = "CLOUDWATCH_ALARM"|"CLOUDWATCH_LOG"|"CLOUDFORMATION"|"SSM_ASSOCIATION"|string;
  export type ConfigurationEventStatus = "INFO"|"WARN"|"ERROR"|string;
  export type ConfigurationEventTime = Date;
  export interface CreateApplicationRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName?: ResourceGroupName;
    /**
     *  When set to true, creates opsItems for any problems detected on an application. 
     */
    OpsCenterEnabled?: OpsCenterEnabled;
    /**
     *  Indicates whether Application Insights can listen to CloudWatch events for the application resources, such as instance terminated, failed deployment, and others. 
     */
    CWEMonitorEnabled?: CWEMonitorEnabled;
    /**
     *  The SNS topic provided to Application Insights that is associated to the created opsItem. Allows you to receive notifications for updates to the opsItem. 
     */
    OpsItemSNSTopicArn?: OpsItemSNSTopicArn;
    /**
     * List of tags to add to the application. tag key (Key) and an associated tag value (Value). The maximum length of a tag key is 128 characters. The maximum length of a tag value is 256 characters.
     */
    Tags?: TagList;
    AutoConfigEnabled?: AutoConfigEnabled;
    AutoCreate?: AutoCreate;
  }
  export interface CreateApplicationResponse {
    /**
     * Information about the application.
     */
    ApplicationInfo?: ApplicationInfo;
  }
  export interface CreateComponentRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the component.
     */
    ComponentName: CustomComponentName;
    /**
     * The list of resource ARNs that belong to the component.
     */
    ResourceList: ResourceList;
  }
  export interface CreateComponentResponse {
  }
  export interface CreateLogPatternRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the log pattern set.
     */
    PatternSetName: LogPatternSetName;
    /**
     * The name of the log pattern.
     */
    PatternName: LogPatternName;
    /**
     * The log pattern. The pattern must be DFA compatible. Patterns that utilize forward lookahead or backreference constructions are not supported.
     */
    Pattern: LogPatternRegex;
    /**
     * Rank of the log pattern. Must be a value between 1 and 1,000,000. The patterns are sorted by rank, so we recommend that you set your highest priority patterns with the lowest rank. A pattern of rank 1 will be the first to get matched to a log line. A pattern of rank 1,000,000 will be last to get matched. When you configure custom log patterns from the console, a Low severity pattern translates to a 750,000 rank. A Medium severity pattern translates to a 500,000 rank. And a High severity pattern translates to a 250,000 rank. Rank values less than 1 or greater than 1,000,000 are reserved for AWS-provided patterns. 
     */
    Rank: LogPatternRank;
  }
  export interface CreateLogPatternResponse {
    /**
     * The successfully created log pattern.
     */
    LogPattern?: LogPattern;
    /**
     * The name of the resource group.
     */
    ResourceGroupName?: ResourceGroupName;
  }
  export type CustomComponentName = string;
  export interface DeleteApplicationRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
  }
  export interface DeleteApplicationResponse {
  }
  export interface DeleteComponentRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the component.
     */
    ComponentName: CustomComponentName;
  }
  export interface DeleteComponentResponse {
  }
  export interface DeleteLogPatternRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the log pattern set.
     */
    PatternSetName: LogPatternSetName;
    /**
     * The name of the log pattern.
     */
    PatternName: LogPatternName;
  }
  export interface DeleteLogPatternResponse {
  }
  export interface DescribeApplicationRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
  }
  export interface DescribeApplicationResponse {
    /**
     * Information about the application.
     */
    ApplicationInfo?: ApplicationInfo;
  }
  export interface DescribeComponentConfigurationRecommendationRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the component.
     */
    ComponentName: ComponentName;
    /**
     * The tier of the application component. Supported tiers include DOT_NET_CORE, DOT_NET_WORKER, DOT_NET_WEB, SQL_SERVER, and DEFAULT.
     */
    Tier: Tier;
  }
  export interface DescribeComponentConfigurationRecommendationResponse {
    /**
     * The recommended configuration settings of the component. The value is the escaped JSON of the configuration.
     */
    ComponentConfiguration?: ComponentConfiguration;
  }
  export interface DescribeComponentConfigurationRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the component.
     */
    ComponentName: ComponentName;
  }
  export interface DescribeComponentConfigurationResponse {
    /**
     * Indicates whether the application component is monitored.
     */
    Monitor?: Monitor;
    /**
     * The tier of the application component. Supported tiers include DOT_NET_CORE, DOT_NET_WORKER, DOT_NET_WEB, SQL_SERVER, and DEFAULT 
     */
    Tier?: Tier;
    /**
     * The configuration settings of the component. The value is the escaped JSON of the configuration.
     */
    ComponentConfiguration?: ComponentConfiguration;
  }
  export interface DescribeComponentRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the component.
     */
    ComponentName: ComponentName;
  }
  export interface DescribeComponentResponse {
    ApplicationComponent?: ApplicationComponent;
    /**
     * The list of resource ARNs that belong to the component.
     */
    ResourceList?: ResourceList;
  }
  export interface DescribeLogPatternRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the log pattern set.
     */
    PatternSetName: LogPatternSetName;
    /**
     * The name of the log pattern.
     */
    PatternName: LogPatternName;
  }
  export interface DescribeLogPatternResponse {
    /**
     * The name of the resource group.
     */
    ResourceGroupName?: ResourceGroupName;
    /**
     * The successfully created log pattern.
     */
    LogPattern?: LogPattern;
  }
  export interface DescribeObservationRequest {
    /**
     * The ID of the observation.
     */
    ObservationId: ObservationId;
  }
  export interface DescribeObservationResponse {
    /**
     * Information about the observation.
     */
    Observation?: Observation;
  }
  export interface DescribeProblemObservationsRequest {
    /**
     * The ID of the problem.
     */
    ProblemId: ProblemId;
  }
  export interface DescribeProblemObservationsResponse {
    /**
     * Observations related to the problem.
     */
    RelatedObservations?: RelatedObservations;
  }
  export interface DescribeProblemRequest {
    /**
     * The ID of the problem.
     */
    ProblemId: ProblemId;
  }
  export interface DescribeProblemResponse {
    /**
     * Information about the problem. 
     */
    Problem?: Problem;
  }
  export type DetectedWorkload = {[key: string]: WorkloadMetaData};
  export type DiscoveryType = "RESOURCE_GROUP_BASED"|"ACCOUNT_BASED"|string;
  export type EbsCause = string;
  export type EbsEvent = string;
  export type EbsRequestId = string;
  export type EbsResult = string;
  export type Ec2State = string;
  export type EndTime = Date;
  export type Feedback = {[key: string]: FeedbackValue};
  export type FeedbackKey = "INSIGHTS_FEEDBACK"|string;
  export type FeedbackValue = "NOT_SPECIFIED"|"USEFUL"|"NOT_USEFUL"|string;
  export type HealthEventArn = string;
  export type HealthEventDescription = string;
  export type HealthEventTypeCategory = string;
  export type HealthEventTypeCode = string;
  export type HealthService = string;
  export type Insights = string;
  export type LastRecurrenceTime = Date;
  export type LifeCycle = string;
  export type LineTime = Date;
  export interface ListApplicationsRequest {
    /**
     * The maximum number of results to return in a single call. To retrieve the remaining results, make another call with the returned NextToken value.
     */
    MaxResults?: MaxEntities;
    /**
     * The token to request the next page of results.
     */
    NextToken?: PaginationToken;
  }
  export interface ListApplicationsResponse {
    /**
     * The list of applications.
     */
    ApplicationInfoList?: ApplicationInfoList;
    /**
     * The token used to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListComponentsRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The maximum number of results to return in a single call. To retrieve the remaining results, make another call with the returned NextToken value.
     */
    MaxResults?: MaxEntities;
    /**
     * The token to request the next page of results.
     */
    NextToken?: PaginationToken;
  }
  export interface ListComponentsResponse {
    /**
     * The list of application components.
     */
    ApplicationComponentList?: ApplicationComponentList;
    /**
     * The token to request the next page of results.
     */
    NextToken?: PaginationToken;
  }
  export interface ListConfigurationHistoryRequest {
    /**
     * Resource group to which the application belongs. 
     */
    ResourceGroupName?: ResourceGroupName;
    /**
     * The start time of the event. 
     */
    StartTime?: StartTime;
    /**
     * The end time of the event.
     */
    EndTime?: EndTime;
    /**
     * The status of the configuration update event. Possible values include INFO, WARN, and ERROR.
     */
    EventStatus?: ConfigurationEventStatus;
    /**
     *  The maximum number of results returned by ListConfigurationHistory in paginated output. When this parameter is used, ListConfigurationHistory returns only MaxResults in a single page along with a NextToken response element. The remaining results of the initial request can be seen by sending another ListConfigurationHistory request with the returned NextToken value. If this parameter is not used, then ListConfigurationHistory returns all results. 
     */
    MaxResults?: MaxEntities;
    /**
     * The NextToken value returned from a previous paginated ListConfigurationHistory request where MaxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the NextToken value. This value is null when there are no more results to return.
     */
    NextToken?: PaginationToken;
  }
  export interface ListConfigurationHistoryResponse {
    /**
     *  The list of configuration events and their corresponding details. 
     */
    EventList?: ConfigurationEventList;
    /**
     * The NextToken value to include in a future ListConfigurationHistory request. When the results of a ListConfigurationHistory request exceed MaxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    NextToken?: PaginationToken;
  }
  export interface ListLogPatternSetsRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The maximum number of results to return in a single call. To retrieve the remaining results, make another call with the returned NextToken value.
     */
    MaxResults?: MaxEntities;
    /**
     * The token to request the next page of results.
     */
    NextToken?: PaginationToken;
  }
  export interface ListLogPatternSetsResponse {
    /**
     * The name of the resource group.
     */
    ResourceGroupName?: ResourceGroupName;
    /**
     * The list of log pattern sets.
     */
    LogPatternSets?: LogPatternSetList;
    /**
     * The token used to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListLogPatternsRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the log pattern set.
     */
    PatternSetName?: LogPatternSetName;
    /**
     * The maximum number of results to return in a single call. To retrieve the remaining results, make another call with the returned NextToken value.
     */
    MaxResults?: MaxEntities;
    /**
     * The token to request the next page of results.
     */
    NextToken?: PaginationToken;
  }
  export interface ListLogPatternsResponse {
    /**
     * The name of the resource group.
     */
    ResourceGroupName?: ResourceGroupName;
    /**
     * The list of log patterns.
     */
    LogPatterns?: LogPatternList;
    /**
     * The token used to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListProblemsRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName?: ResourceGroupName;
    /**
     * The time when the problem was detected, in epoch seconds. If you don't specify a time frame for the request, problems within the past seven days are returned.
     */
    StartTime?: StartTime;
    /**
     * The time when the problem ended, in epoch seconds. If not specified, problems within the past seven days are returned.
     */
    EndTime?: EndTime;
    /**
     * The maximum number of results to return in a single call. To retrieve the remaining results, make another call with the returned NextToken value.
     */
    MaxResults?: MaxEntities;
    /**
     * The token to request the next page of results.
     */
    NextToken?: PaginationToken;
    ComponentName?: ComponentName;
  }
  export interface ListProblemsResponse {
    /**
     * The list of problems. 
     */
    ProblemList?: ProblemList;
    /**
     * The token used to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    NextToken?: PaginationToken;
    ResourceGroupName?: ResourceGroupName;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the application that you want to retrieve tag information for.
     */
    ResourceARN: AmazonResourceName;
  }
  export interface ListTagsForResourceResponse {
    /**
     * An array that lists all the tags that are associated with the application. Each tag consists of a required tag key (Key) and an associated tag value (Value).
     */
    Tags?: TagList;
  }
  export type LogFilter = "ERROR"|"WARN"|"INFO"|string;
  export type LogGroup = string;
  export interface LogPattern {
    /**
     * The name of the log pattern. A log pattern name can contain as many as 30 characters, and it cannot be empty. The characters can be Unicode letters, digits, or one of the following symbols: period, dash, underscore.
     */
    PatternSetName?: LogPatternSetName;
    /**
     * The name of the log pattern. A log pattern name can contain as many as 50 characters, and it cannot be empty. The characters can be Unicode letters, digits, or one of the following symbols: period, dash, underscore.
     */
    PatternName?: LogPatternName;
    /**
     * A regular expression that defines the log pattern. A log pattern can contain as many as 50 characters, and it cannot be empty. The pattern must be DFA compatible. Patterns that utilize forward lookahead or backreference constructions are not supported.
     */
    Pattern?: LogPatternRegex;
    /**
     * Rank of the log pattern. Must be a value between 1 and 1,000,000. The patterns are sorted by rank, so we recommend that you set your highest priority patterns with the lowest rank. A pattern of rank 1 will be the first to get matched to a log line. A pattern of rank 1,000,000 will be last to get matched. When you configure custom log patterns from the console, a Low severity pattern translates to a 750,000 rank. A Medium severity pattern translates to a 500,000 rank. And a High severity pattern translates to a 250,000 rank. Rank values less than 1 or greater than 1,000,000 are reserved for AWS-provided patterns. 
     */
    Rank?: LogPatternRank;
  }
  export type LogPatternList = LogPattern[];
  export type LogPatternName = string;
  export type LogPatternRank = number;
  export type LogPatternRegex = string;
  export type LogPatternSetList = LogPatternSetName[];
  export type LogPatternSetName = string;
  export type LogText = string;
  export type MaxEntities = number;
  export type MetaDataKey = string;
  export type MetaDataValue = string;
  export type MetricName = string;
  export type MetricNamespace = string;
  export type Monitor = boolean;
  export interface Observation {
    /**
     * The ID of the observation type.
     */
    Id?: ObservationId;
    /**
     * The time when the observation was first detected, in epoch seconds.
     */
    StartTime?: StartTime;
    /**
     * The time when the observation ended, in epoch seconds.
     */
    EndTime?: EndTime;
    /**
     * The source type of the observation.
     */
    SourceType?: SourceType;
    /**
     * The source resource ARN of the observation.
     */
    SourceARN?: SourceARN;
    /**
     * The log group name.
     */
    LogGroup?: LogGroup;
    /**
     * The timestamp in the CloudWatch Logs that specifies when the matched line occurred.
     */
    LineTime?: LineTime;
    /**
     * The log text of the observation.
     */
    LogText?: LogText;
    /**
     * The log filter of the observation.
     */
    LogFilter?: LogFilter;
    /**
     * The namespace of the observation metric.
     */
    MetricNamespace?: MetricNamespace;
    /**
     * The name of the observation metric.
     */
    MetricName?: MetricName;
    /**
     * The unit of the source observation metric.
     */
    Unit?: Unit;
    /**
     * The value of the source observation metric.
     */
    Value?: Value;
    /**
     *  The ID of the CloudWatch Event-based observation related to the detected problem. 
     */
    CloudWatchEventId?: CloudWatchEventId;
    /**
     *  The source of the CloudWatch Event. 
     */
    CloudWatchEventSource?: CloudWatchEventSource;
    /**
     *  The detail type of the CloudWatch Event-based observation, for example, EC2 Instance State-change Notification. 
     */
    CloudWatchEventDetailType?: CloudWatchEventDetailType;
    /**
     *  The Amazon Resource Name (ARN) of the AWS Health Event-based observation.
     */
    HealthEventArn?: HealthEventArn;
    /**
     *  The service to which the AWS Health Event belongs, such as EC2. 
     */
    HealthService?: HealthService;
    /**
     *  The type of the AWS Health event, for example, AWS_EC2_POWER_CONNECTIVITY_ISSUE. 
     */
    HealthEventTypeCode?: HealthEventTypeCode;
    /**
     *  The category of the AWS Health event, such as issue. 
     */
    HealthEventTypeCategory?: HealthEventTypeCategory;
    /**
     *  The description of the AWS Health event provided by the service, such as Amazon EC2. 
     */
    HealthEventDescription?: HealthEventDescription;
    /**
     *  The deployment ID of the CodeDeploy-based observation related to the detected problem. 
     */
    CodeDeployDeploymentId?: CodeDeployDeploymentId;
    /**
     *  The deployment group to which the CodeDeploy deployment belongs. 
     */
    CodeDeployDeploymentGroup?: CodeDeployDeploymentGroup;
    /**
     *  The status of the CodeDeploy deployment, for example SUCCESS or  FAILURE. 
     */
    CodeDeployState?: CodeDeployState;
    /**
     *  The CodeDeploy application to which the deployment belongs. 
     */
    CodeDeployApplication?: CodeDeployApplication;
    /**
     *  The instance group to which the CodeDeploy instance belongs. 
     */
    CodeDeployInstanceGroupId?: CodeDeployInstanceGroupId;
    /**
     *  The state of the instance, such as STOPPING or TERMINATING. 
     */
    Ec2State?: Ec2State;
    /**
     *  The category of an RDS event. 
     */
    RdsEventCategories?: RdsEventCategories;
    /**
     *  The message of an RDS event. 
     */
    RdsEventMessage?: RdsEventMessage;
    /**
     *  The name of the S3 CloudWatch Event-based observation. 
     */
    S3EventName?: S3EventName;
    /**
     *  The Amazon Resource Name (ARN) of the step function execution-based observation. 
     */
    StatesExecutionArn?: StatesExecutionArn;
    /**
     *  The Amazon Resource Name (ARN) of the step function-based observation. 
     */
    StatesArn?: StatesArn;
    /**
     *  The status of the step function-related observation. 
     */
    StatesStatus?: StatesStatus;
    /**
     *  The input to the step function-based observation. 
     */
    StatesInput?: StatesInput;
    /**
     *  The type of EBS CloudWatch event, such as createVolume, deleteVolume or attachVolume. 
     */
    EbsEvent?: EbsEvent;
    /**
     *  The result of an EBS CloudWatch event, such as failed or succeeded. 
     */
    EbsResult?: EbsResult;
    /**
     *  The cause of an EBS CloudWatch event. 
     */
    EbsCause?: EbsCause;
    /**
     *  The request ID of an EBS CloudWatch event. 
     */
    EbsRequestId?: EbsRequestId;
    /**
     *  The X-Ray request fault percentage for this node. 
     */
    XRayFaultPercent?: XRayFaultPercent;
    /**
     *  The X-Ray request throttle percentage for this node. 
     */
    XRayThrottlePercent?: XRayThrottlePercent;
    /**
     *  The X-Ray request error percentage for this node. 
     */
    XRayErrorPercent?: XRayErrorPercent;
    /**
     *  The X-Ray request count for this node. 
     */
    XRayRequestCount?: XRayRequestCount;
    /**
     *  The X-Ray node request average latency for this node. 
     */
    XRayRequestAverageLatency?: XRayRequestAverageLatency;
    /**
     *  The name of the X-Ray node. 
     */
    XRayNodeName?: XRayNodeName;
    /**
     *  The type of the X-Ray node. 
     */
    XRayNodeType?: XRayNodeType;
  }
  export type ObservationId = string;
  export type ObservationList = Observation[];
  export type OpsCenterEnabled = boolean;
  export type OpsItemSNSTopicArn = string;
  export type OsType = "WINDOWS"|"LINUX"|string;
  export type PaginationToken = string;
  export interface Problem {
    /**
     * The ID of the problem.
     */
    Id?: ProblemId;
    /**
     * The name of the problem.
     */
    Title?: Title;
    /**
     * A detailed analysis of the problem using machine learning.
     */
    Insights?: Insights;
    /**
     * The status of the problem.
     */
    Status?: Status;
    /**
     * The resource affected by the problem.
     */
    AffectedResource?: AffectedResource;
    /**
     * The time when the problem started, in epoch seconds.
     */
    StartTime?: StartTime;
    /**
     * The time when the problem ended, in epoch seconds.
     */
    EndTime?: EndTime;
    /**
     * A measure of the level of impact of the problem.
     */
    SeverityLevel?: SeverityLevel;
    /**
     * The name of the resource group affected by the problem.
     */
    ResourceGroupName?: ResourceGroupName;
    /**
     * Feedback provided by the user about the problem.
     */
    Feedback?: Feedback;
    RecurringCount?: RecurringCount;
    LastRecurrenceTime?: LastRecurrenceTime;
  }
  export type ProblemId = string;
  export type ProblemList = Problem[];
  export type RdsEventCategories = string;
  export type RdsEventMessage = string;
  export type RecurringCount = number;
  export interface RelatedObservations {
    /**
     * The list of observations related to the problem.
     */
    ObservationList?: ObservationList;
  }
  export type Remarks = string;
  export type RemoveSNSTopic = boolean;
  export type ResourceARN = string;
  export type ResourceGroupName = string;
  export type ResourceList = ResourceARN[];
  export type ResourceType = string;
  export type S3EventName = string;
  export type SeverityLevel = "Low"|"Medium"|"High"|string;
  export type SourceARN = string;
  export type SourceType = string;
  export type StartTime = Date;
  export type StatesArn = string;
  export type StatesExecutionArn = string;
  export type StatesInput = string;
  export type StatesStatus = string;
  export type Status = "IGNORE"|"RESOLVED"|"PENDING"|"RECURRING"|string;
  export interface Tag {
    /**
     * One part of a key-value pair that defines a tag. The maximum length of a tag key is 128 characters. The minimum length is 1 character.
     */
    Key: TagKey;
    /**
     * The optional part of a key-value pair that defines a tag. The maximum length of a tag value is 256 characters. The minimum length is 0 characters. If you don't want an application to have a specific tag value, don't specify a value for this parameter.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the application that you want to add one or more tags to.
     */
    ResourceARN: AmazonResourceName;
    /**
     * A list of tags that to add to the application. A tag consists of a required tag key (Key) and an associated tag value (Value). The maximum length of a tag key is 128 characters. The maximum length of a tag value is 256 characters.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tier = "CUSTOM"|"DEFAULT"|"DOT_NET_CORE"|"DOT_NET_WORKER"|"DOT_NET_WEB_TIER"|"DOT_NET_WEB"|"SQL_SERVER"|"SQL_SERVER_ALWAYSON_AVAILABILITY_GROUP"|"MYSQL"|"POSTGRESQL"|"JAVA_JMX"|"ORACLE"|"SAP_HANA"|"SAP_HANA_MULTI_NODE"|"SAP_HANA_SINGLE_NODE"|"SAP_HANA_HIGH_AVAILABILITY"|"SQL_SERVER_FAILOVER_CLUSTER_INSTANCE"|string;
  export type Title = string;
  export type Unit = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the application that you want to remove one or more tags from.
     */
    ResourceARN: AmazonResourceName;
    /**
     * The tags (tag keys) that you want to remove from the resource. When you specify a tag key, the action removes both that key and its associated tag value. To remove more than one tag from the application, append the TagKeys parameter and argument for each additional tag to remove, separated by an ampersand. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateApplicationRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     *  When set to true, creates opsItems for any problems detected on an application. 
     */
    OpsCenterEnabled?: OpsCenterEnabled;
    /**
     *  Indicates whether Application Insights can listen to CloudWatch events for the application resources, such as instance terminated, failed deployment, and others. 
     */
    CWEMonitorEnabled?: CWEMonitorEnabled;
    /**
     *  The SNS topic provided to Application Insights that is associated to the created opsItem. Allows you to receive notifications for updates to the opsItem.
     */
    OpsItemSNSTopicArn?: OpsItemSNSTopicArn;
    /**
     *  Disassociates the SNS topic from the opsItem created for detected problems.
     */
    RemoveSNSTopic?: RemoveSNSTopic;
    AutoConfigEnabled?: AutoConfigEnabled;
  }
  export interface UpdateApplicationResponse {
    /**
     * Information about the application. 
     */
    ApplicationInfo?: ApplicationInfo;
  }
  export interface UpdateComponentConfigurationRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the component.
     */
    ComponentName: ComponentName;
    /**
     * Indicates whether the application component is monitored.
     */
    Monitor?: Monitor;
    /**
     * The tier of the application component. Supported tiers include DOT_NET_WORKER, DOT_NET_WEB, DOT_NET_CORE, SQL_SERVER, and DEFAULT.
     */
    Tier?: Tier;
    /**
     * The configuration settings of the component. The value is the escaped JSON of the configuration. For more information about the JSON format, see Working with JSON. You can send a request to DescribeComponentConfigurationRecommendation to see the recommended configuration for a component. For the complete format of the component configuration file, see Component Configuration.
     */
    ComponentConfiguration?: ComponentConfiguration;
    AutoConfigEnabled?: AutoConfigEnabled;
  }
  export interface UpdateComponentConfigurationResponse {
  }
  export interface UpdateComponentRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the component.
     */
    ComponentName: CustomComponentName;
    /**
     * The new name of the component.
     */
    NewComponentName?: CustomComponentName;
    /**
     * The list of resource ARNs that belong to the component.
     */
    ResourceList?: ResourceList;
  }
  export interface UpdateComponentResponse {
  }
  export interface UpdateLogPatternRequest {
    /**
     * The name of the resource group.
     */
    ResourceGroupName: ResourceGroupName;
    /**
     * The name of the log pattern set.
     */
    PatternSetName: LogPatternSetName;
    /**
     * The name of the log pattern.
     */
    PatternName: LogPatternName;
    /**
     * The log pattern. The pattern must be DFA compatible. Patterns that utilize forward lookahead or backreference constructions are not supported.
     */
    Pattern?: LogPatternRegex;
    /**
     * Rank of the log pattern. Must be a value between 1 and 1,000,000. The patterns are sorted by rank, so we recommend that you set your highest priority patterns with the lowest rank. A pattern of rank 1 will be the first to get matched to a log line. A pattern of rank 1,000,000 will be last to get matched. When you configure custom log patterns from the console, a Low severity pattern translates to a 750,000 rank. A Medium severity pattern translates to a 500,000 rank. And a High severity pattern translates to a 250,000 rank. Rank values less than 1 or greater than 1,000,000 are reserved for AWS-provided patterns. 
     */
    Rank?: LogPatternRank;
  }
  export interface UpdateLogPatternResponse {
    /**
     * The name of the resource group.
     */
    ResourceGroupName?: ResourceGroupName;
    /**
     * The successfully created log pattern.
     */
    LogPattern?: LogPattern;
  }
  export type Value = number;
  export type WorkloadMetaData = {[key: string]: MetaDataValue};
  export type XRayErrorPercent = number;
  export type XRayFaultPercent = number;
  export type XRayNodeName = string;
  export type XRayNodeType = string;
  export type XRayRequestAverageLatency = number;
  export type XRayRequestCount = number;
  export type XRayThrottlePercent = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-11-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ApplicationInsights client.
   */
  export import Types = ApplicationInsights;
}
export = ApplicationInsights;
