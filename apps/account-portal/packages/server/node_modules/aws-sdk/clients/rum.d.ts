import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class RUM extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: RUM.Types.ClientConfiguration)
  config: Config & RUM.Types.ClientConfiguration;
  /**
   * Specifies the extended metrics and custom metrics that you want a CloudWatch RUM app monitor to send to a destination. Valid destinations include CloudWatch and Evidently. By default, RUM app monitors send some metrics to CloudWatch. These default metrics are listed in CloudWatch metrics that you can collect with CloudWatch RUM. In addition to these default metrics, you can choose to send extended metrics or custom metrics or both.   Extended metrics enable you to send metrics with additional dimensions not included in the default metrics. You can also send extended metrics to Evidently as well as CloudWatch. The valid dimension names for the additional dimensions for extended metrics are BrowserName, CountryCode, DeviceType, FileType, OSName, and PageId. For more information, see  Extended metrics that you can send to CloudWatch and CloudWatch Evidently.   Custom metrics are metrics that you define. You can send custom metrics to CloudWatch or to CloudWatch Evidently or to both. With custom metrics, you can use any metric name and namespace, and to derive the metrics you can use any custom events, built-in events, custom attributes, or default attributes.  You can't send custom metrics to the AWS/RUM namespace. You must send custom metrics to a custom namespace that you define. The namespace that you use can't start with AWS/. CloudWatch RUM prepends RUM/CustomMetrics/ to the custom namespace that you define, so the final namespace for your metrics in CloudWatch is RUM/CustomMetrics/your-custom-namespace .   The maximum number of metric definitions that you can specify in one BatchCreateRumMetricDefinitions operation is 200. The maximum number of metric definitions that one destination can contain is 2000. Extended metrics sent to CloudWatch and RUM custom metrics are charged as CloudWatch custom metrics. Each combination of additional dimension name and dimension value counts as a custom metric. For more information, see Amazon CloudWatch Pricing. You must have already created a destination for the metrics before you send them. For more information, see PutRumMetricsDestination. If some metric definitions specified in a BatchCreateRumMetricDefinitions operations are not valid, those metric definitions fail and return errors, but all valid metric definitions in the same operation still succeed.
   */
  batchCreateRumMetricDefinitions(params: RUM.Types.BatchCreateRumMetricDefinitionsRequest, callback?: (err: AWSError, data: RUM.Types.BatchCreateRumMetricDefinitionsResponse) => void): Request<RUM.Types.BatchCreateRumMetricDefinitionsResponse, AWSError>;
  /**
   * Specifies the extended metrics and custom metrics that you want a CloudWatch RUM app monitor to send to a destination. Valid destinations include CloudWatch and Evidently. By default, RUM app monitors send some metrics to CloudWatch. These default metrics are listed in CloudWatch metrics that you can collect with CloudWatch RUM. In addition to these default metrics, you can choose to send extended metrics or custom metrics or both.   Extended metrics enable you to send metrics with additional dimensions not included in the default metrics. You can also send extended metrics to Evidently as well as CloudWatch. The valid dimension names for the additional dimensions for extended metrics are BrowserName, CountryCode, DeviceType, FileType, OSName, and PageId. For more information, see  Extended metrics that you can send to CloudWatch and CloudWatch Evidently.   Custom metrics are metrics that you define. You can send custom metrics to CloudWatch or to CloudWatch Evidently or to both. With custom metrics, you can use any metric name and namespace, and to derive the metrics you can use any custom events, built-in events, custom attributes, or default attributes.  You can't send custom metrics to the AWS/RUM namespace. You must send custom metrics to a custom namespace that you define. The namespace that you use can't start with AWS/. CloudWatch RUM prepends RUM/CustomMetrics/ to the custom namespace that you define, so the final namespace for your metrics in CloudWatch is RUM/CustomMetrics/your-custom-namespace .   The maximum number of metric definitions that you can specify in one BatchCreateRumMetricDefinitions operation is 200. The maximum number of metric definitions that one destination can contain is 2000. Extended metrics sent to CloudWatch and RUM custom metrics are charged as CloudWatch custom metrics. Each combination of additional dimension name and dimension value counts as a custom metric. For more information, see Amazon CloudWatch Pricing. You must have already created a destination for the metrics before you send them. For more information, see PutRumMetricsDestination. If some metric definitions specified in a BatchCreateRumMetricDefinitions operations are not valid, those metric definitions fail and return errors, but all valid metric definitions in the same operation still succeed.
   */
  batchCreateRumMetricDefinitions(callback?: (err: AWSError, data: RUM.Types.BatchCreateRumMetricDefinitionsResponse) => void): Request<RUM.Types.BatchCreateRumMetricDefinitionsResponse, AWSError>;
  /**
   * Removes the specified metrics from being sent to an extended metrics destination. If some metric definition IDs specified in a BatchDeleteRumMetricDefinitions operations are not valid, those metric definitions fail and return errors, but all valid metric definition IDs in the same operation are still deleted. The maximum number of metric definitions that you can specify in one BatchDeleteRumMetricDefinitions operation is 200.
   */
  batchDeleteRumMetricDefinitions(params: RUM.Types.BatchDeleteRumMetricDefinitionsRequest, callback?: (err: AWSError, data: RUM.Types.BatchDeleteRumMetricDefinitionsResponse) => void): Request<RUM.Types.BatchDeleteRumMetricDefinitionsResponse, AWSError>;
  /**
   * Removes the specified metrics from being sent to an extended metrics destination. If some metric definition IDs specified in a BatchDeleteRumMetricDefinitions operations are not valid, those metric definitions fail and return errors, but all valid metric definition IDs in the same operation are still deleted. The maximum number of metric definitions that you can specify in one BatchDeleteRumMetricDefinitions operation is 200.
   */
  batchDeleteRumMetricDefinitions(callback?: (err: AWSError, data: RUM.Types.BatchDeleteRumMetricDefinitionsResponse) => void): Request<RUM.Types.BatchDeleteRumMetricDefinitionsResponse, AWSError>;
  /**
   * Retrieves the list of metrics and dimensions that a RUM app monitor is sending to a single destination.
   */
  batchGetRumMetricDefinitions(params: RUM.Types.BatchGetRumMetricDefinitionsRequest, callback?: (err: AWSError, data: RUM.Types.BatchGetRumMetricDefinitionsResponse) => void): Request<RUM.Types.BatchGetRumMetricDefinitionsResponse, AWSError>;
  /**
   * Retrieves the list of metrics and dimensions that a RUM app monitor is sending to a single destination.
   */
  batchGetRumMetricDefinitions(callback?: (err: AWSError, data: RUM.Types.BatchGetRumMetricDefinitionsResponse) => void): Request<RUM.Types.BatchGetRumMetricDefinitionsResponse, AWSError>;
  /**
   * Creates a Amazon CloudWatch RUM app monitor, which collects telemetry data from your application and sends that data to RUM. The data includes performance and reliability information such as page load time, client-side errors, and user behavior. You use this operation only to create a new app monitor. To update an existing app monitor, use UpdateAppMonitor instead. After you create an app monitor, sign in to the CloudWatch RUM console to get the JavaScript code snippet to add to your web application. For more information, see How do I find a code snippet that I've already generated? 
   */
  createAppMonitor(params: RUM.Types.CreateAppMonitorRequest, callback?: (err: AWSError, data: RUM.Types.CreateAppMonitorResponse) => void): Request<RUM.Types.CreateAppMonitorResponse, AWSError>;
  /**
   * Creates a Amazon CloudWatch RUM app monitor, which collects telemetry data from your application and sends that data to RUM. The data includes performance and reliability information such as page load time, client-side errors, and user behavior. You use this operation only to create a new app monitor. To update an existing app monitor, use UpdateAppMonitor instead. After you create an app monitor, sign in to the CloudWatch RUM console to get the JavaScript code snippet to add to your web application. For more information, see How do I find a code snippet that I've already generated? 
   */
  createAppMonitor(callback?: (err: AWSError, data: RUM.Types.CreateAppMonitorResponse) => void): Request<RUM.Types.CreateAppMonitorResponse, AWSError>;
  /**
   * Deletes an existing app monitor. This immediately stops the collection of data.
   */
  deleteAppMonitor(params: RUM.Types.DeleteAppMonitorRequest, callback?: (err: AWSError, data: RUM.Types.DeleteAppMonitorResponse) => void): Request<RUM.Types.DeleteAppMonitorResponse, AWSError>;
  /**
   * Deletes an existing app monitor. This immediately stops the collection of data.
   */
  deleteAppMonitor(callback?: (err: AWSError, data: RUM.Types.DeleteAppMonitorResponse) => void): Request<RUM.Types.DeleteAppMonitorResponse, AWSError>;
  /**
   * Deletes a destination for CloudWatch RUM extended metrics, so that the specified app monitor stops sending extended metrics to that destination.
   */
  deleteRumMetricsDestination(params: RUM.Types.DeleteRumMetricsDestinationRequest, callback?: (err: AWSError, data: RUM.Types.DeleteRumMetricsDestinationResponse) => void): Request<RUM.Types.DeleteRumMetricsDestinationResponse, AWSError>;
  /**
   * Deletes a destination for CloudWatch RUM extended metrics, so that the specified app monitor stops sending extended metrics to that destination.
   */
  deleteRumMetricsDestination(callback?: (err: AWSError, data: RUM.Types.DeleteRumMetricsDestinationResponse) => void): Request<RUM.Types.DeleteRumMetricsDestinationResponse, AWSError>;
  /**
   * Retrieves the complete configuration information for one app monitor.
   */
  getAppMonitor(params: RUM.Types.GetAppMonitorRequest, callback?: (err: AWSError, data: RUM.Types.GetAppMonitorResponse) => void): Request<RUM.Types.GetAppMonitorResponse, AWSError>;
  /**
   * Retrieves the complete configuration information for one app monitor.
   */
  getAppMonitor(callback?: (err: AWSError, data: RUM.Types.GetAppMonitorResponse) => void): Request<RUM.Types.GetAppMonitorResponse, AWSError>;
  /**
   * Retrieves the raw performance events that RUM has collected from your web application, so that you can do your own processing or analysis of this data.
   */
  getAppMonitorData(params: RUM.Types.GetAppMonitorDataRequest, callback?: (err: AWSError, data: RUM.Types.GetAppMonitorDataResponse) => void): Request<RUM.Types.GetAppMonitorDataResponse, AWSError>;
  /**
   * Retrieves the raw performance events that RUM has collected from your web application, so that you can do your own processing or analysis of this data.
   */
  getAppMonitorData(callback?: (err: AWSError, data: RUM.Types.GetAppMonitorDataResponse) => void): Request<RUM.Types.GetAppMonitorDataResponse, AWSError>;
  /**
   * Returns a list of the Amazon CloudWatch RUM app monitors in the account.
   */
  listAppMonitors(params: RUM.Types.ListAppMonitorsRequest, callback?: (err: AWSError, data: RUM.Types.ListAppMonitorsResponse) => void): Request<RUM.Types.ListAppMonitorsResponse, AWSError>;
  /**
   * Returns a list of the Amazon CloudWatch RUM app monitors in the account.
   */
  listAppMonitors(callback?: (err: AWSError, data: RUM.Types.ListAppMonitorsResponse) => void): Request<RUM.Types.ListAppMonitorsResponse, AWSError>;
  /**
   * Returns a list of destinations that you have created to receive RUM extended metrics, for the specified app monitor. For more information about extended metrics, see AddRumMetrics.
   */
  listRumMetricsDestinations(params: RUM.Types.ListRumMetricsDestinationsRequest, callback?: (err: AWSError, data: RUM.Types.ListRumMetricsDestinationsResponse) => void): Request<RUM.Types.ListRumMetricsDestinationsResponse, AWSError>;
  /**
   * Returns a list of destinations that you have created to receive RUM extended metrics, for the specified app monitor. For more information about extended metrics, see AddRumMetrics.
   */
  listRumMetricsDestinations(callback?: (err: AWSError, data: RUM.Types.ListRumMetricsDestinationsResponse) => void): Request<RUM.Types.ListRumMetricsDestinationsResponse, AWSError>;
  /**
   * Displays the tags associated with a CloudWatch RUM resource.
   */
  listTagsForResource(params: RUM.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: RUM.Types.ListTagsForResourceResponse) => void): Request<RUM.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Displays the tags associated with a CloudWatch RUM resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: RUM.Types.ListTagsForResourceResponse) => void): Request<RUM.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Sends telemetry events about your application performance and user behavior to CloudWatch RUM. The code snippet that RUM generates for you to add to your application includes PutRumEvents operations to send this data to RUM. Each PutRumEvents operation can send a batch of events from one user session.
   */
  putRumEvents(params: RUM.Types.PutRumEventsRequest, callback?: (err: AWSError, data: RUM.Types.PutRumEventsResponse) => void): Request<RUM.Types.PutRumEventsResponse, AWSError>;
  /**
   * Sends telemetry events about your application performance and user behavior to CloudWatch RUM. The code snippet that RUM generates for you to add to your application includes PutRumEvents operations to send this data to RUM. Each PutRumEvents operation can send a batch of events from one user session.
   */
  putRumEvents(callback?: (err: AWSError, data: RUM.Types.PutRumEventsResponse) => void): Request<RUM.Types.PutRumEventsResponse, AWSError>;
  /**
   * Creates or updates a destination to receive extended metrics from CloudWatch RUM. You can send extended metrics to CloudWatch or to a CloudWatch Evidently experiment. For more information about extended metrics, see BatchCreateRumMetricDefinitions.
   */
  putRumMetricsDestination(params: RUM.Types.PutRumMetricsDestinationRequest, callback?: (err: AWSError, data: RUM.Types.PutRumMetricsDestinationResponse) => void): Request<RUM.Types.PutRumMetricsDestinationResponse, AWSError>;
  /**
   * Creates or updates a destination to receive extended metrics from CloudWatch RUM. You can send extended metrics to CloudWatch or to a CloudWatch Evidently experiment. For more information about extended metrics, see BatchCreateRumMetricDefinitions.
   */
  putRumMetricsDestination(callback?: (err: AWSError, data: RUM.Types.PutRumMetricsDestinationResponse) => void): Request<RUM.Types.PutRumMetricsDestinationResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified CloudWatch RUM resource. Currently, the only resources that can be tagged app monitors. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the alarm. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a resource. For more information, see Tagging Amazon Web Services resources.
   */
  tagResource(params: RUM.Types.TagResourceRequest, callback?: (err: AWSError, data: RUM.Types.TagResourceResponse) => void): Request<RUM.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified CloudWatch RUM resource. Currently, the only resources that can be tagged app monitors. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a resource that already has tags. If you specify a new tag key for the resource, this tag is appended to the list of tags associated with the alarm. If you specify a tag key that is already associated with the resource, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a resource. For more information, see Tagging Amazon Web Services resources.
   */
  tagResource(callback?: (err: AWSError, data: RUM.Types.TagResourceResponse) => void): Request<RUM.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(params: RUM.Types.UntagResourceRequest, callback?: (err: AWSError, data: RUM.Types.UntagResourceResponse) => void): Request<RUM.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: RUM.Types.UntagResourceResponse) => void): Request<RUM.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates the configuration of an existing app monitor. When you use this operation, only the parts of the app monitor configuration that you specify in this operation are changed. For any parameters that you omit, the existing values are kept. You can't use this operation to change the tags of an existing app monitor. To change the tags of an existing app monitor, use TagResource. To create a new app monitor, use CreateAppMonitor. After you update an app monitor, sign in to the CloudWatch RUM console to get the updated JavaScript code snippet to add to your web application. For more information, see How do I find a code snippet that I've already generated? 
   */
  updateAppMonitor(params: RUM.Types.UpdateAppMonitorRequest, callback?: (err: AWSError, data: RUM.Types.UpdateAppMonitorResponse) => void): Request<RUM.Types.UpdateAppMonitorResponse, AWSError>;
  /**
   * Updates the configuration of an existing app monitor. When you use this operation, only the parts of the app monitor configuration that you specify in this operation are changed. For any parameters that you omit, the existing values are kept. You can't use this operation to change the tags of an existing app monitor. To change the tags of an existing app monitor, use TagResource. To create a new app monitor, use CreateAppMonitor. After you update an app monitor, sign in to the CloudWatch RUM console to get the updated JavaScript code snippet to add to your web application. For more information, see How do I find a code snippet that I've already generated? 
   */
  updateAppMonitor(callback?: (err: AWSError, data: RUM.Types.UpdateAppMonitorResponse) => void): Request<RUM.Types.UpdateAppMonitorResponse, AWSError>;
  /**
   * Modifies one existing metric definition for CloudWatch RUM extended metrics. For more information about extended metrics, see BatchCreateRumMetricsDefinitions.
   */
  updateRumMetricDefinition(params: RUM.Types.UpdateRumMetricDefinitionRequest, callback?: (err: AWSError, data: RUM.Types.UpdateRumMetricDefinitionResponse) => void): Request<RUM.Types.UpdateRumMetricDefinitionResponse, AWSError>;
  /**
   * Modifies one existing metric definition for CloudWatch RUM extended metrics. For more information about extended metrics, see BatchCreateRumMetricsDefinitions.
   */
  updateRumMetricDefinition(callback?: (err: AWSError, data: RUM.Types.UpdateRumMetricDefinitionResponse) => void): Request<RUM.Types.UpdateRumMetricDefinitionResponse, AWSError>;
}
declare namespace RUM {
  export interface AppMonitor {
    /**
     * A structure that contains much of the configuration data for the app monitor.
     */
    AppMonitorConfiguration?: AppMonitorConfiguration;
    /**
     * The date and time that this app monitor was created.
     */
    Created?: ISOTimestampString;
    /**
     * Specifies whether this app monitor allows the web client to define and send custom events. For more information about custom events, see Send custom events.
     */
    CustomEvents?: CustomEvents;
    /**
     * A structure that contains information about whether this app monitor stores a copy of the telemetry data that RUM collects using CloudWatch Logs.
     */
    DataStorage?: DataStorage;
    /**
     * The top-level internet domain name for which your application has administrative authority.
     */
    Domain?: AppMonitorDomain;
    /**
     * The unique ID of this app monitor.
     */
    Id?: AppMonitorId;
    /**
     * The date and time of the most recent changes to this app monitor's configuration.
     */
    LastModified?: ISOTimestampString;
    /**
     * The name of the app monitor.
     */
    Name?: AppMonitorName;
    /**
     * The current state of the app monitor.
     */
    State?: StateEnum;
    /**
     * The list of tag keys and values associated with this app monitor.
     */
    Tags?: TagMap;
  }
  export interface AppMonitorConfiguration {
    /**
     * If you set this to true, the RUM web client sets two cookies, a session cookie and a user cookie. The cookies allow the RUM web client to collect data relating to the number of users an application has and the behavior of the application across a sequence of events. Cookies are stored in the top-level domain of the current page.
     */
    AllowCookies?: Boolean;
    /**
     * If you set this to true, RUM enables X-Ray tracing for the user sessions that RUM samples. RUM adds an X-Ray trace header to allowed HTTP requests. It also records an X-Ray segment for allowed HTTP requests. You can see traces and segments from these user sessions in the X-Ray console and the CloudWatch ServiceLens console. For more information, see What is X-Ray? 
     */
    EnableXRay?: Boolean;
    /**
     * A list of URLs in your website or application to exclude from RUM data collection. You can't include both ExcludedPages and IncludedPages in the same operation.
     */
    ExcludedPages?: Pages;
    /**
     * A list of pages in your application that are to be displayed with a "favorite" icon in the CloudWatch RUM console.
     */
    FavoritePages?: FavoritePages;
    /**
     * The ARN of the guest IAM role that is attached to the Amazon Cognito identity pool that is used to authorize the sending of data to RUM.
     */
    GuestRoleArn?: Arn;
    /**
     * The ID of the Amazon Cognito identity pool that is used to authorize the sending of data to RUM.
     */
    IdentityPoolId?: IdentityPoolId;
    /**
     * If this app monitor is to collect data from only certain pages in your application, this structure lists those pages.  You can't include both ExcludedPages and IncludedPages in the same operation.
     */
    IncludedPages?: Pages;
    /**
     * Specifies the portion of user sessions to use for RUM data collection. Choosing a higher portion gives you more data but also incurs more costs. The range for this value is 0 to 1 inclusive. Setting this to 1 means that 100% of user sessions are sampled, and setting it to 0.1 means that 10% of user sessions are sampled. If you omit this parameter, the default of 0.1 is used, and 10% of sessions will be sampled.
     */
    SessionSampleRate?: SessionSampleRate;
    /**
     * An array that lists the types of telemetry data that this app monitor is to collect.    errors indicates that RUM collects data about unhandled JavaScript errors raised by your application.    performance indicates that RUM collects performance data about how your application and its resources are loaded and rendered. This includes Core Web Vitals.    http indicates that RUM collects data about HTTP errors thrown by your application.  
     */
    Telemetries?: Telemetries;
  }
  export interface AppMonitorDetails {
    /**
     * The unique ID of the app monitor.
     */
    id?: String;
    /**
     * The name of the app monitor.
     */
    name?: String;
    /**
     * The version of the app monitor.
     */
    version?: String;
  }
  export type AppMonitorDomain = string;
  export type AppMonitorId = string;
  export type AppMonitorName = string;
  export interface AppMonitorSummary {
    /**
     * The date and time that the app monitor was created.
     */
    Created?: ISOTimestampString;
    /**
     * The unique ID of this app monitor.
     */
    Id?: AppMonitorId;
    /**
     * The date and time of the most recent changes to this app monitor's configuration.
     */
    LastModified?: ISOTimestampString;
    /**
     * The name of this app monitor.
     */
    Name?: AppMonitorName;
    /**
     * The current state of this app monitor.
     */
    State?: StateEnum;
  }
  export type AppMonitorSummaryList = AppMonitorSummary[];
  export type Arn = string;
  export interface BatchCreateRumMetricDefinitionsError {
    /**
     * The error code.
     */
    ErrorCode: String;
    /**
     * The error message for this metric definition.
     */
    ErrorMessage: String;
    /**
     * The metric definition that caused this error.
     */
    MetricDefinition: MetricDefinitionRequest;
  }
  export type BatchCreateRumMetricDefinitionsErrors = BatchCreateRumMetricDefinitionsError[];
  export interface BatchCreateRumMetricDefinitionsRequest {
    /**
     * The name of the CloudWatch RUM app monitor that is to send the metrics.
     */
    AppMonitorName: AppMonitorName;
    /**
     * The destination to send the metrics to. Valid values are CloudWatch and Evidently. If you specify Evidently, you must also specify the ARN of the CloudWatchEvidently experiment that will receive the metrics and an IAM role that has permission to write to the experiment.
     */
    Destination: MetricDestination;
    /**
     * This parameter is required if Destination is Evidently. If Destination is CloudWatch, do not use this parameter. This parameter specifies the ARN of the Evidently experiment that is to receive the metrics. You must have already defined this experiment as a valid destination. For more information, see PutRumMetricsDestination.
     */
    DestinationArn?: DestinationArn;
    /**
     * An array of structures which define the metrics that you want to send.
     */
    MetricDefinitions: MetricDefinitionsRequest;
  }
  export interface BatchCreateRumMetricDefinitionsResponse {
    /**
     * An array of error objects, if the operation caused any errors.
     */
    Errors: BatchCreateRumMetricDefinitionsErrors;
    /**
     * An array of structures that define the extended metrics.
     */
    MetricDefinitions?: MetricDefinitions;
  }
  export interface BatchDeleteRumMetricDefinitionsError {
    /**
     * The error code.
     */
    ErrorCode: String;
    /**
     * The error message for this metric definition.
     */
    ErrorMessage: String;
    /**
     * The ID of the metric definition that caused this error.
     */
    MetricDefinitionId: MetricDefinitionId;
  }
  export type BatchDeleteRumMetricDefinitionsErrors = BatchDeleteRumMetricDefinitionsError[];
  export interface BatchDeleteRumMetricDefinitionsRequest {
    /**
     * The name of the CloudWatch RUM app monitor that is sending these metrics.
     */
    AppMonitorName: AppMonitorName;
    /**
     * Defines the destination where you want to stop sending the specified metrics. Valid values are CloudWatch and Evidently. If you specify Evidently, you must also specify the ARN of the CloudWatchEvidently experiment that is to be the destination and an IAM role that has permission to write to the experiment.
     */
    Destination: MetricDestination;
    /**
     * This parameter is required if Destination is Evidently. If Destination is CloudWatch, do not use this parameter.  This parameter specifies the ARN of the Evidently experiment that was receiving the metrics that are being deleted.
     */
    DestinationArn?: DestinationArn;
    /**
     * An array of structures which define the metrics that you want to stop sending.
     */
    MetricDefinitionIds: MetricDefinitionIds;
  }
  export interface BatchDeleteRumMetricDefinitionsResponse {
    /**
     * An array of error objects, if the operation caused any errors.
     */
    Errors: BatchDeleteRumMetricDefinitionsErrors;
    /**
     * The IDs of the metric definitions that were deleted.
     */
    MetricDefinitionIds?: MetricDefinitionIds;
  }
  export interface BatchGetRumMetricDefinitionsRequest {
    /**
     * The name of the CloudWatch RUM app monitor that is sending the metrics.
     */
    AppMonitorName: AppMonitorName;
    /**
     * The type of destination that you want to view metrics for. Valid values are CloudWatch and Evidently.
     */
    Destination: MetricDestination;
    /**
     * This parameter is required if Destination is Evidently. If Destination is CloudWatch, do not use this parameter. This parameter specifies the ARN of the Evidently experiment that corresponds to the destination.
     */
    DestinationArn?: DestinationArn;
    /**
     * The maximum number of results to return in one operation. The default is 50. The maximum that you can specify is 100. To retrieve the remaining results, make another call with the returned NextToken value. 
     */
    MaxResults?: MaxResultsInteger;
    /**
     * Use the token returned by the previous operation to request the next page of results.
     */
    NextToken?: String;
  }
  export interface BatchGetRumMetricDefinitionsResponse {
    /**
     * An array of structures that display information about the metrics that are sent by the specified app monitor to the specified destination.
     */
    MetricDefinitions?: MetricDefinitions;
    /**
     * A token that you can use in a subsequent operation to retrieve the next set of results.
     */
    NextToken?: String;
  }
  export type Boolean = boolean;
  export interface CreateAppMonitorRequest {
    /**
     * A structure that contains much of the configuration data for the app monitor. If you are using Amazon Cognito for authorization, you must include this structure in your request, and it must include the ID of the Amazon Cognito identity pool to use for authorization. If you don't include AppMonitorConfiguration, you must set up your own authorization method. For more information, see Authorize your application to send data to Amazon Web Services. If you omit this argument, the sample rate used for RUM is set to 10% of the user sessions.
     */
    AppMonitorConfiguration?: AppMonitorConfiguration;
    /**
     * Specifies whether this app monitor allows the web client to define and send custom events. If you omit this parameter, custom events are DISABLED. For more information about custom events, see Send custom events.
     */
    CustomEvents?: CustomEvents;
    /**
     * Data collected by RUM is kept by RUM for 30 days and then deleted. This parameter specifies whether RUM sends a copy of this telemetry data to Amazon CloudWatch Logs in your account. This enables you to keep the telemetry data for more than 30 days, but it does incur Amazon CloudWatch Logs charges. If you omit this parameter, the default is false.
     */
    CwLogEnabled?: Boolean;
    /**
     * The top-level internet domain name for which your application has administrative authority.
     */
    Domain: AppMonitorDomain;
    /**
     * A name for the app monitor.
     */
    Name: AppMonitorName;
    /**
     * Assigns one or more tags (key-value pairs) to the app monitor. Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can associate as many as 50 tags with an app monitor. For more information, see Tagging Amazon Web Services resources.
     */
    Tags?: TagMap;
  }
  export interface CreateAppMonitorResponse {
    /**
     * The unique ID of the new app monitor.
     */
    Id?: AppMonitorId;
  }
  export interface CustomEvents {
    /**
     * Specifies whether this app monitor allows the web client to define and send custom events. The default is for custom events to be DISABLED.
     */
    Status?: CustomEventsStatus;
  }
  export type CustomEventsStatus = "ENABLED"|"DISABLED"|string;
  export interface CwLog {
    /**
     * Indicated whether the app monitor stores copies of the data that RUM collects in CloudWatch Logs.
     */
    CwLogEnabled?: Boolean;
    /**
     * The name of the log group where the copies are stored.
     */
    CwLogGroup?: String;
  }
  export interface DataStorage {
    /**
     * A structure that contains the information about whether the app monitor stores copies of the data that RUM collects in CloudWatch Logs. If it does, this structure also contains the name of the log group.
     */
    CwLog?: CwLog;
  }
  export interface DeleteAppMonitorRequest {
    /**
     * The name of the app monitor to delete.
     */
    Name: AppMonitorName;
  }
  export interface DeleteAppMonitorResponse {
  }
  export interface DeleteRumMetricsDestinationRequest {
    /**
     * The name of the app monitor that is sending metrics to the destination that you want to delete.
     */
    AppMonitorName: AppMonitorName;
    /**
     * The type of destination to delete. Valid values are CloudWatch and Evidently.
     */
    Destination: MetricDestination;
    /**
     * This parameter is required if Destination is Evidently. If Destination is CloudWatch, do not use this parameter. This parameter specifies the ARN of the Evidently experiment that corresponds to the destination to delete.
     */
    DestinationArn?: DestinationArn;
  }
  export interface DeleteRumMetricsDestinationResponse {
  }
  export type DestinationArn = string;
  export type DimensionKey = string;
  export type DimensionKeysMap = {[key: string]: DimensionName};
  export type DimensionName = string;
  export type EventData = string;
  export type EventDataList = EventData[];
  export type EventPattern = string;
  export type FavoritePages = String[];
  export interface GetAppMonitorDataRequest {
    /**
     * An array of structures that you can use to filter the results to those that match one or more sets of key-value pairs that you specify.
     */
    Filters?: QueryFilters;
    /**
     * The maximum number of results to return in one operation. 
     */
    MaxResults?: MaxQueryResults;
    /**
     * The name of the app monitor that collected the data that you want to retrieve.
     */
    Name: AppMonitorName;
    /**
     * Use the token returned by the previous operation to request the next page of results.
     */
    NextToken?: Token;
    /**
     * A structure that defines the time range that you want to retrieve results from.
     */
    TimeRange: TimeRange;
  }
  export interface GetAppMonitorDataResponse {
    /**
     * The events that RUM collected that match your request.
     */
    Events?: EventDataList;
    /**
     * A token that you can use in a subsequent operation to retrieve the next set of results.
     */
    NextToken?: Token;
  }
  export interface GetAppMonitorRequest {
    /**
     * The app monitor to retrieve information for.
     */
    Name: AppMonitorName;
  }
  export interface GetAppMonitorResponse {
    /**
     * A structure containing all the configuration information for the app monitor.
     */
    AppMonitor?: AppMonitor;
  }
  export type ISOTimestampString = string;
  export type IamRoleArn = string;
  export type IdentityPoolId = string;
  export type JsonValue = string;
  export interface ListAppMonitorsRequest {
    /**
     * The maximum number of results to return in one operation. The default is 50. The maximum that you can specify is 100.
     */
    MaxResults?: MaxResultsInteger;
    /**
     * Use the token returned by the previous operation to request the next page of results.
     */
    NextToken?: String;
  }
  export interface ListAppMonitorsResponse {
    /**
     * An array of structures that contain information about the returned app monitors.
     */
    AppMonitorSummaries?: AppMonitorSummaryList;
    /**
     * A token that you can use in a subsequent operation to retrieve the next set of results.
     */
    NextToken?: String;
  }
  export interface ListRumMetricsDestinationsRequest {
    /**
     * The name of the app monitor associated with the destinations that you want to retrieve.
     */
    AppMonitorName: AppMonitorName;
    /**
     * The maximum number of results to return in one operation. The default is 50. The maximum that you can specify is 100. To retrieve the remaining results, make another call with the returned NextToken value. 
     */
    MaxResults?: MaxResultsInteger;
    /**
     * Use the token returned by the previous operation to request the next page of results.
     */
    NextToken?: String;
  }
  export interface ListRumMetricsDestinationsResponse {
    /**
     * The list of CloudWatch RUM extended metrics destinations associated with the app monitor that you specified.
     */
    Destinations?: MetricDestinationSummaryList;
    /**
     * A token that you can use in a subsequent operation to retrieve the next set of results.
     */
    NextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource that you want to see the tags of.
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The ARN of the resource that you are viewing.
     */
    ResourceArn: Arn;
    /**
     * The list of tag keys and values associated with the resource you specified.
     */
    Tags: TagMap;
  }
  export type MaxQueryResults = number;
  export type MaxResultsInteger = number;
  export interface MetricDefinition {
    /**
     * This field is a map of field paths to dimension names. It defines the dimensions to associate with this metric in CloudWatch The value of this field is used only if the metric destination is CloudWatch. If the metric destination is Evidently, the value of DimensionKeys is ignored.
     */
    DimensionKeys?: DimensionKeysMap;
    /**
     * The pattern that defines the metric. RUM checks events that happen in a user's session against the pattern, and events that match the pattern are sent to the metric destination. If the metrics destination is CloudWatch and the event also matches a value in DimensionKeys, then the metric is published with the specified dimensions. 
     */
    EventPattern?: EventPattern;
    /**
     * The ID of this metric definition.
     */
    MetricDefinitionId: MetricDefinitionId;
    /**
     * The name of the metric that is defined in this structure.
     */
    Name: MetricName;
    /**
     * If this metric definition is for a custom metric instead of an extended metric, this field displays the metric namespace that the custom metric is published to.
     */
    Namespace?: Namespace;
    /**
     * Use this field only if you are sending this metric to CloudWatch. It defines the CloudWatch metric unit that this metric is measured in. 
     */
    UnitLabel?: UnitLabel;
    /**
     * The field within the event object that the metric value is sourced from.
     */
    ValueKey?: ValueKey;
  }
  export type MetricDefinitionId = string;
  export type MetricDefinitionIds = MetricDefinitionId[];
  export interface MetricDefinitionRequest {
    /**
     * Use this field only if you are sending the metric to CloudWatch. This field is a map of field paths to dimension names. It defines the dimensions to associate with this metric in CloudWatch. For extended metrics, valid values for the entries in this field are the following:    "metadata.pageId": "PageId"     "metadata.browserName": "BrowserName"     "metadata.deviceType": "DeviceType"     "metadata.osName": "OSName"     "metadata.countryCode": "CountryCode"     "event_details.fileType": "FileType"     For both extended metrics and custom metrics, all dimensions listed in this field must also be included in EventPattern.
     */
    DimensionKeys?: DimensionKeysMap;
    /**
     * The pattern that defines the metric, specified as a JSON object. RUM checks events that happen in a user's session against the pattern, and events that match the pattern are sent to the metric destination. When you define extended metrics, the metric definition is not valid if EventPattern is omitted. Example event patterns:    '{ "event_type": ["com.amazon.rum.js_error_event"], "metadata": { "browserName": [ "Chrome", "Safari" ], } }'     '{ "event_type": ["com.amazon.rum.performance_navigation_event"], "metadata": { "browserName": [ "Chrome", "Firefox" ] }, "event_details": { "duration": [{ "numeric": [ "&lt;", 2000 ] }] } }'     '{ "event_type": ["com.amazon.rum.performance_navigation_event"], "metadata": { "browserName": [ "Chrome", "Safari" ], "countryCode": [ "US" ] }, "event_details": { "duration": [{ "numeric": [ "&gt;=", 2000, "&lt;", 8000 ] }] } }'    If the metrics destination' is CloudWatch and the event also matches a value in DimensionKeys, then the metric is published with the specified dimensions. 
     */
    EventPattern?: EventPattern;
    /**
     * The name for the metric that is defined in this structure. For custom metrics, you can specify any name that you like. For extended metrics, valid values are the following:    PerformanceNavigationDuration     PerformanceResourceDuration      NavigationSatisfiedTransaction     NavigationToleratedTransaction     NavigationFrustratedTransaction     WebVitalsCumulativeLayoutShift     WebVitalsFirstInputDelay     WebVitalsLargestContentfulPaint     JsErrorCount     HttpErrorCount     SessionCount   
     */
    Name: MetricName;
    /**
     * If this structure is for a custom metric instead of an extended metrics, use this parameter to define the metric namespace for that custom metric. Do not specify this parameter if this structure is for an extended metric. You cannot use any string that starts with AWS/ for your namespace.
     */
    Namespace?: Namespace;
    /**
     * The CloudWatch metric unit to use for this metric. If you omit this field, the metric is recorded with no unit.
     */
    UnitLabel?: UnitLabel;
    /**
     * The field within the event object that the metric value is sourced from. If you omit this field, a hardcoded value of 1 is pushed as the metric value. This is useful if you just want to count the number of events that the filter catches.  If this metric is sent to CloudWatch Evidently, this field will be passed to Evidently raw and Evidently will handle data extraction from the event.
     */
    ValueKey?: ValueKey;
  }
  export type MetricDefinitions = MetricDefinition[];
  export type MetricDefinitionsRequest = MetricDefinitionRequest[];
  export type MetricDestination = "CloudWatch"|"Evidently"|string;
  export interface MetricDestinationSummary {
    /**
     * Specifies whether the destination is CloudWatch or Evidently.
     */
    Destination?: MetricDestination;
    /**
     * If the destination is Evidently, this specifies the ARN of the Evidently experiment that receives the metrics.
     */
    DestinationArn?: DestinationArn;
    /**
     * This field appears only when the destination is Evidently. It specifies the ARN of the IAM role that is used to write to the Evidently experiment that receives the metrics.
     */
    IamRoleArn?: IamRoleArn;
  }
  export type MetricDestinationSummaryList = MetricDestinationSummary[];
  export type MetricName = string;
  export type Namespace = string;
  export type Pages = Url[];
  export interface PutRumEventsRequest {
    /**
     * A structure that contains information about the app monitor that collected this telemetry information.
     */
    AppMonitorDetails: AppMonitorDetails;
    /**
     * A unique identifier for this batch of RUM event data.
     */
    BatchId: PutRumEventsRequestBatchIdString;
    /**
     * The ID of the app monitor that is sending this data.
     */
    Id: PutRumEventsRequestIdString;
    /**
     * An array of structures that contain the telemetry event data.
     */
    RumEvents: RumEventList;
    /**
     * A structure that contains information about the user session that this batch of events was collected from.
     */
    UserDetails: UserDetails;
  }
  export type PutRumEventsRequestBatchIdString = string;
  export type PutRumEventsRequestIdString = string;
  export interface PutRumEventsResponse {
  }
  export interface PutRumMetricsDestinationRequest {
    /**
     * The name of the CloudWatch RUM app monitor that will send the metrics.
     */
    AppMonitorName: AppMonitorName;
    /**
     * Defines the destination to send the metrics to. Valid values are CloudWatch and Evidently. If you specify Evidently, you must also specify the ARN of the CloudWatchEvidently experiment that is to be the destination and an IAM role that has permission to write to the experiment.
     */
    Destination: MetricDestination;
    /**
     * Use this parameter only if Destination is Evidently. This parameter specifies the ARN of the Evidently experiment that will receive the extended metrics.
     */
    DestinationArn?: DestinationArn;
    /**
     * This parameter is required if Destination is Evidently. If Destination is CloudWatch, do not use this parameter. This parameter specifies the ARN of an IAM role that RUM will assume to write to the Evidently experiment that you are sending metrics to. This role must have permission to write to that experiment.
     */
    IamRoleArn?: IamRoleArn;
  }
  export interface PutRumMetricsDestinationResponse {
  }
  export interface QueryFilter {
    /**
     * The name of a key to search for. The filter returns only the events that match the Name and Values that you specify.  Valid values for Name are Browser | Device | Country | Page | OS | EventType | Invert 
     */
    Name?: QueryFilterKey;
    /**
     * The values of the Name that are to be be included in the returned results.
     */
    Values?: QueryFilterValueList;
  }
  export type QueryFilterKey = string;
  export type QueryFilterValue = string;
  export type QueryFilterValueList = QueryFilterValue[];
  export type QueryFilters = QueryFilter[];
  export type QueryTimestamp = number;
  export interface RumEvent {
    /**
     * A string containing details about the event.
     */
    details: JsonValue;
    /**
     * A unique ID for this event.
     */
    id: RumEventIdString;
    /**
     * Metadata about this event, which contains a JSON serialization of the identity of the user for this session. The user information comes from information such as the HTTP user-agent request header and document interface.
     */
    metadata?: JsonValue;
    /**
     * The exact time that this event occurred.
     */
    timestamp: Timestamp;
    /**
     * The JSON schema that denotes the type of event this is, such as a page load or a new session.
     */
    type: String;
  }
  export type RumEventIdString = string;
  export type RumEventList = RumEvent[];
  export type SessionSampleRate = number;
  export type StateEnum = "CREATED"|"DELETING"|"ACTIVE"|string;
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the CloudWatch RUM resource that you're adding tags to.
     */
    ResourceArn: Arn;
    /**
     * The list of key-value pairs to associate with the resource.
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Telemetries = Telemetry[];
  export type Telemetry = "errors"|"performance"|"http"|string;
  export interface TimeRange {
    /**
     * The beginning of the time range to retrieve performance events from.
     */
    After: QueryTimestamp;
    /**
     * The end of the time range to retrieve performance events from. If you omit this, the time range extends to the time that this operation is performed.
     */
    Before?: QueryTimestamp;
  }
  export type Timestamp = Date;
  export type Token = string;
  export type UnitLabel = string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the CloudWatch RUM resource that you're removing tags from.
     */
    ResourceArn: Arn;
    /**
     * The list of tag keys to remove from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAppMonitorRequest {
    /**
     * A structure that contains much of the configuration data for the app monitor. If you are using Amazon Cognito for authorization, you must include this structure in your request, and it must include the ID of the Amazon Cognito identity pool to use for authorization. If you don't include AppMonitorConfiguration, you must set up your own authorization method. For more information, see Authorize your application to send data to Amazon Web Services.
     */
    AppMonitorConfiguration?: AppMonitorConfiguration;
    /**
     * Specifies whether this app monitor allows the web client to define and send custom events. The default is for custom events to be DISABLED. For more information about custom events, see Send custom events.
     */
    CustomEvents?: CustomEvents;
    /**
     * Data collected by RUM is kept by RUM for 30 days and then deleted. This parameter specifies whether RUM sends a copy of this telemetry data to Amazon CloudWatch Logs in your account. This enables you to keep the telemetry data for more than 30 days, but it does incur Amazon CloudWatch Logs charges.
     */
    CwLogEnabled?: Boolean;
    /**
     * The top-level internet domain name for which your application has administrative authority.
     */
    Domain?: AppMonitorDomain;
    /**
     * The name of the app monitor to update.
     */
    Name: AppMonitorName;
  }
  export interface UpdateAppMonitorResponse {
  }
  export interface UpdateRumMetricDefinitionRequest {
    /**
     * The name of the CloudWatch RUM app monitor that sends these metrics.
     */
    AppMonitorName: AppMonitorName;
    /**
     * The destination to send the metrics to. Valid values are CloudWatch and Evidently. If you specify Evidently, you must also specify the ARN of the CloudWatchEvidently experiment that will receive the metrics and an IAM role that has permission to write to the experiment.
     */
    Destination: MetricDestination;
    /**
     * This parameter is required if Destination is Evidently. If Destination is CloudWatch, do not use this parameter. This parameter specifies the ARN of the Evidently experiment that is to receive the metrics. You must have already defined this experiment as a valid destination. For more information, see PutRumMetricsDestination.
     */
    DestinationArn?: DestinationArn;
    /**
     * A structure that contains the new definition that you want to use for this metric.
     */
    MetricDefinition: MetricDefinitionRequest;
    /**
     * The ID of the metric definition to update.
     */
    MetricDefinitionId: MetricDefinitionId;
  }
  export interface UpdateRumMetricDefinitionResponse {
  }
  export type Url = string;
  export interface UserDetails {
    /**
     * The session ID that the performance events are from.
     */
    sessionId?: UserDetailsSessionIdString;
    /**
     * The ID of the user for this user session. This ID is generated by RUM and does not include any personally identifiable information about the user.
     */
    userId?: UserDetailsUserIdString;
  }
  export type UserDetailsSessionIdString = string;
  export type UserDetailsUserIdString = string;
  export type ValueKey = string;
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
   * Contains interfaces for use with the RUM client.
   */
  export import Types = RUM;
}
export = RUM;
