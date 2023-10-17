import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CodeGuruProfiler extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CodeGuruProfiler.Types.ClientConfiguration)
  config: Config & CodeGuruProfiler.Types.ClientConfiguration;
  /**
   * Add up to 2 anomaly notifications channels for a profiling group.
   */
  addNotificationChannels(params: CodeGuruProfiler.Types.AddNotificationChannelsRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.AddNotificationChannelsResponse) => void): Request<CodeGuruProfiler.Types.AddNotificationChannelsResponse, AWSError>;
  /**
   * Add up to 2 anomaly notifications channels for a profiling group.
   */
  addNotificationChannels(callback?: (err: AWSError, data: CodeGuruProfiler.Types.AddNotificationChannelsResponse) => void): Request<CodeGuruProfiler.Types.AddNotificationChannelsResponse, AWSError>;
  /**
   *  Returns the time series of values for a requested list of frame metrics from a time period.
   */
  batchGetFrameMetricData(params: CodeGuruProfiler.Types.BatchGetFrameMetricDataRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.BatchGetFrameMetricDataResponse) => void): Request<CodeGuruProfiler.Types.BatchGetFrameMetricDataResponse, AWSError>;
  /**
   *  Returns the time series of values for a requested list of frame metrics from a time period.
   */
  batchGetFrameMetricData(callback?: (err: AWSError, data: CodeGuruProfiler.Types.BatchGetFrameMetricDataResponse) => void): Request<CodeGuruProfiler.Types.BatchGetFrameMetricDataResponse, AWSError>;
  /**
   *  Used by profiler agents to report their current state and to receive remote configuration updates. For example, ConfigureAgent can be used to tell an agent whether to profile or not and for how long to return profiling data. 
   */
  configureAgent(params: CodeGuruProfiler.Types.ConfigureAgentRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.ConfigureAgentResponse) => void): Request<CodeGuruProfiler.Types.ConfigureAgentResponse, AWSError>;
  /**
   *  Used by profiler agents to report their current state and to receive remote configuration updates. For example, ConfigureAgent can be used to tell an agent whether to profile or not and for how long to return profiling data. 
   */
  configureAgent(callback?: (err: AWSError, data: CodeGuruProfiler.Types.ConfigureAgentResponse) => void): Request<CodeGuruProfiler.Types.ConfigureAgentResponse, AWSError>;
  /**
   * Creates a profiling group.
   */
  createProfilingGroup(params: CodeGuruProfiler.Types.CreateProfilingGroupRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.CreateProfilingGroupResponse) => void): Request<CodeGuruProfiler.Types.CreateProfilingGroupResponse, AWSError>;
  /**
   * Creates a profiling group.
   */
  createProfilingGroup(callback?: (err: AWSError, data: CodeGuruProfiler.Types.CreateProfilingGroupResponse) => void): Request<CodeGuruProfiler.Types.CreateProfilingGroupResponse, AWSError>;
  /**
   * Deletes a profiling group.
   */
  deleteProfilingGroup(params: CodeGuruProfiler.Types.DeleteProfilingGroupRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.DeleteProfilingGroupResponse) => void): Request<CodeGuruProfiler.Types.DeleteProfilingGroupResponse, AWSError>;
  /**
   * Deletes a profiling group.
   */
  deleteProfilingGroup(callback?: (err: AWSError, data: CodeGuruProfiler.Types.DeleteProfilingGroupResponse) => void): Request<CodeGuruProfiler.Types.DeleteProfilingGroupResponse, AWSError>;
  /**
   *  Returns a  ProfilingGroupDescription  object that contains information about the requested profiling group. 
   */
  describeProfilingGroup(params: CodeGuruProfiler.Types.DescribeProfilingGroupRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.DescribeProfilingGroupResponse) => void): Request<CodeGuruProfiler.Types.DescribeProfilingGroupResponse, AWSError>;
  /**
   *  Returns a  ProfilingGroupDescription  object that contains information about the requested profiling group. 
   */
  describeProfilingGroup(callback?: (err: AWSError, data: CodeGuruProfiler.Types.DescribeProfilingGroupResponse) => void): Request<CodeGuruProfiler.Types.DescribeProfilingGroupResponse, AWSError>;
  /**
   *  Returns a list of  FindingsReportSummary  objects that contain analysis results for all profiling groups in your AWS account. 
   */
  getFindingsReportAccountSummary(params: CodeGuruProfiler.Types.GetFindingsReportAccountSummaryRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.GetFindingsReportAccountSummaryResponse) => void): Request<CodeGuruProfiler.Types.GetFindingsReportAccountSummaryResponse, AWSError>;
  /**
   *  Returns a list of  FindingsReportSummary  objects that contain analysis results for all profiling groups in your AWS account. 
   */
  getFindingsReportAccountSummary(callback?: (err: AWSError, data: CodeGuruProfiler.Types.GetFindingsReportAccountSummaryResponse) => void): Request<CodeGuruProfiler.Types.GetFindingsReportAccountSummaryResponse, AWSError>;
  /**
   * Get the current configuration for anomaly notifications for a profiling group.
   */
  getNotificationConfiguration(params: CodeGuruProfiler.Types.GetNotificationConfigurationRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.GetNotificationConfigurationResponse) => void): Request<CodeGuruProfiler.Types.GetNotificationConfigurationResponse, AWSError>;
  /**
   * Get the current configuration for anomaly notifications for a profiling group.
   */
  getNotificationConfiguration(callback?: (err: AWSError, data: CodeGuruProfiler.Types.GetNotificationConfigurationResponse) => void): Request<CodeGuruProfiler.Types.GetNotificationConfigurationResponse, AWSError>;
  /**
   *  Returns the JSON-formatted resource-based policy on a profiling group. 
   */
  getPolicy(params: CodeGuruProfiler.Types.GetPolicyRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.GetPolicyResponse) => void): Request<CodeGuruProfiler.Types.GetPolicyResponse, AWSError>;
  /**
   *  Returns the JSON-formatted resource-based policy on a profiling group. 
   */
  getPolicy(callback?: (err: AWSError, data: CodeGuruProfiler.Types.GetPolicyResponse) => void): Request<CodeGuruProfiler.Types.GetPolicyResponse, AWSError>;
  /**
   *  Gets the aggregated profile of a profiling group for a specified time range. Amazon CodeGuru Profiler collects posted agent profiles for a profiling group into aggregated profiles.   &lt;note&gt; &lt;p&gt; Because aggregated profiles expire over time &lt;code&gt;GetProfile&lt;/code&gt; is not idempotent. &lt;/p&gt; &lt;/note&gt; &lt;p&gt; Specify the time range for the requested aggregated profile using 1 or 2 of the following parameters: &lt;code&gt;startTime&lt;/code&gt;, &lt;code&gt;endTime&lt;/code&gt;, &lt;code&gt;period&lt;/code&gt;. The maximum time range allowed is 7 days. If you specify all 3 parameters, an exception is thrown. If you specify only &lt;code&gt;period&lt;/code&gt;, the latest aggregated profile is returned. &lt;/p&gt; &lt;p&gt; Aggregated profiles are available with aggregation periods of 5 minutes, 1 hour, and 1 day, aligned to UTC. The aggregation period of an aggregated profile determines how long it is retained. For more information, see &lt;a href=&quot;https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_AggregatedProfileTime.html&quot;&gt; &lt;code&gt;AggregatedProfileTime&lt;/code&gt; &lt;/a&gt;. The aggregated profile's aggregation period determines how long it is retained by CodeGuru Profiler. &lt;/p&gt; &lt;ul&gt; &lt;li&gt; &lt;p&gt; If the aggregation period is 5 minutes, the aggregated profile is retained for 15 days. &lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; If the aggregation period is 1 hour, the aggregated profile is retained for 60 days. &lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; If the aggregation period is 1 day, the aggregated profile is retained for 3 years. &lt;/p&gt; &lt;/li&gt; &lt;/ul&gt; &lt;p&gt;There are two use cases for calling &lt;code&gt;GetProfile&lt;/code&gt;.&lt;/p&gt; &lt;ol&gt; &lt;li&gt; &lt;p&gt; If you want to return an aggregated profile that already exists, use &lt;a href=&quot;https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_ListProfileTimes.html&quot;&gt; &lt;code&gt;ListProfileTimes&lt;/code&gt; &lt;/a&gt; to view the time ranges of existing aggregated profiles. Use them in a &lt;code&gt;GetProfile&lt;/code&gt; request to return a specific, existing aggregated profile. &lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; If you want to return an aggregated profile for a time range that doesn't align with an existing aggregated profile, then CodeGuru Profiler makes a best effort to combine existing aggregated profiles from the requested time range and return them as one aggregated profile. &lt;/p&gt; &lt;p&gt; If aggregated profiles do not exist for the full time range requested, then aggregated profiles for a smaller time range are returned. For example, if the requested time range is from 00:00 to 00:20, and the existing aggregated profiles are from 00:15 and 00:25, then the aggregated profiles from 00:15 to 00:20 are returned. &lt;/p&gt; &lt;/li&gt; &lt;/ol&gt; 
   */
  getProfile(params: CodeGuruProfiler.Types.GetProfileRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.GetProfileResponse) => void): Request<CodeGuruProfiler.Types.GetProfileResponse, AWSError>;
  /**
   *  Gets the aggregated profile of a profiling group for a specified time range. Amazon CodeGuru Profiler collects posted agent profiles for a profiling group into aggregated profiles.   &lt;note&gt; &lt;p&gt; Because aggregated profiles expire over time &lt;code&gt;GetProfile&lt;/code&gt; is not idempotent. &lt;/p&gt; &lt;/note&gt; &lt;p&gt; Specify the time range for the requested aggregated profile using 1 or 2 of the following parameters: &lt;code&gt;startTime&lt;/code&gt;, &lt;code&gt;endTime&lt;/code&gt;, &lt;code&gt;period&lt;/code&gt;. The maximum time range allowed is 7 days. If you specify all 3 parameters, an exception is thrown. If you specify only &lt;code&gt;period&lt;/code&gt;, the latest aggregated profile is returned. &lt;/p&gt; &lt;p&gt; Aggregated profiles are available with aggregation periods of 5 minutes, 1 hour, and 1 day, aligned to UTC. The aggregation period of an aggregated profile determines how long it is retained. For more information, see &lt;a href=&quot;https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_AggregatedProfileTime.html&quot;&gt; &lt;code&gt;AggregatedProfileTime&lt;/code&gt; &lt;/a&gt;. The aggregated profile's aggregation period determines how long it is retained by CodeGuru Profiler. &lt;/p&gt; &lt;ul&gt; &lt;li&gt; &lt;p&gt; If the aggregation period is 5 minutes, the aggregated profile is retained for 15 days. &lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; If the aggregation period is 1 hour, the aggregated profile is retained for 60 days. &lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; If the aggregation period is 1 day, the aggregated profile is retained for 3 years. &lt;/p&gt; &lt;/li&gt; &lt;/ul&gt; &lt;p&gt;There are two use cases for calling &lt;code&gt;GetProfile&lt;/code&gt;.&lt;/p&gt; &lt;ol&gt; &lt;li&gt; &lt;p&gt; If you want to return an aggregated profile that already exists, use &lt;a href=&quot;https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_ListProfileTimes.html&quot;&gt; &lt;code&gt;ListProfileTimes&lt;/code&gt; &lt;/a&gt; to view the time ranges of existing aggregated profiles. Use them in a &lt;code&gt;GetProfile&lt;/code&gt; request to return a specific, existing aggregated profile. &lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; If you want to return an aggregated profile for a time range that doesn't align with an existing aggregated profile, then CodeGuru Profiler makes a best effort to combine existing aggregated profiles from the requested time range and return them as one aggregated profile. &lt;/p&gt; &lt;p&gt; If aggregated profiles do not exist for the full time range requested, then aggregated profiles for a smaller time range are returned. For example, if the requested time range is from 00:00 to 00:20, and the existing aggregated profiles are from 00:15 and 00:25, then the aggregated profiles from 00:15 to 00:20 are returned. &lt;/p&gt; &lt;/li&gt; &lt;/ol&gt; 
   */
  getProfile(callback?: (err: AWSError, data: CodeGuruProfiler.Types.GetProfileResponse) => void): Request<CodeGuruProfiler.Types.GetProfileResponse, AWSError>;
  /**
   *  Returns a list of  Recommendation  objects that contain recommendations for a profiling group for a given time period. A list of  Anomaly  objects that contains details about anomalies detected in the profiling group for the same time period is also returned. 
   */
  getRecommendations(params: CodeGuruProfiler.Types.GetRecommendationsRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.GetRecommendationsResponse) => void): Request<CodeGuruProfiler.Types.GetRecommendationsResponse, AWSError>;
  /**
   *  Returns a list of  Recommendation  objects that contain recommendations for a profiling group for a given time period. A list of  Anomaly  objects that contains details about anomalies detected in the profiling group for the same time period is also returned. 
   */
  getRecommendations(callback?: (err: AWSError, data: CodeGuruProfiler.Types.GetRecommendationsResponse) => void): Request<CodeGuruProfiler.Types.GetRecommendationsResponse, AWSError>;
  /**
   * List the available reports for a given profiling group and time range.
   */
  listFindingsReports(params: CodeGuruProfiler.Types.ListFindingsReportsRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.ListFindingsReportsResponse) => void): Request<CodeGuruProfiler.Types.ListFindingsReportsResponse, AWSError>;
  /**
   * List the available reports for a given profiling group and time range.
   */
  listFindingsReports(callback?: (err: AWSError, data: CodeGuruProfiler.Types.ListFindingsReportsResponse) => void): Request<CodeGuruProfiler.Types.ListFindingsReportsResponse, AWSError>;
  /**
   * Lists the start times of the available aggregated profiles of a profiling group for an aggregation period within the specified time range.
   */
  listProfileTimes(params: CodeGuruProfiler.Types.ListProfileTimesRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.ListProfileTimesResponse) => void): Request<CodeGuruProfiler.Types.ListProfileTimesResponse, AWSError>;
  /**
   * Lists the start times of the available aggregated profiles of a profiling group for an aggregation period within the specified time range.
   */
  listProfileTimes(callback?: (err: AWSError, data: CodeGuruProfiler.Types.ListProfileTimesResponse) => void): Request<CodeGuruProfiler.Types.ListProfileTimesResponse, AWSError>;
  /**
   *  Returns a list of profiling groups. The profiling groups are returned as  ProfilingGroupDescription  objects. 
   */
  listProfilingGroups(params: CodeGuruProfiler.Types.ListProfilingGroupsRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.ListProfilingGroupsResponse) => void): Request<CodeGuruProfiler.Types.ListProfilingGroupsResponse, AWSError>;
  /**
   *  Returns a list of profiling groups. The profiling groups are returned as  ProfilingGroupDescription  objects. 
   */
  listProfilingGroups(callback?: (err: AWSError, data: CodeGuruProfiler.Types.ListProfilingGroupsResponse) => void): Request<CodeGuruProfiler.Types.ListProfilingGroupsResponse, AWSError>;
  /**
   *  Returns a list of the tags that are assigned to a specified resource. 
   */
  listTagsForResource(params: CodeGuruProfiler.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.ListTagsForResourceResponse) => void): Request<CodeGuruProfiler.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Returns a list of the tags that are assigned to a specified resource. 
   */
  listTagsForResource(callback?: (err: AWSError, data: CodeGuruProfiler.Types.ListTagsForResourceResponse) => void): Request<CodeGuruProfiler.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Submits profiling data to an aggregated profile of a profiling group. To get an aggregated profile that is created with this profiling data, use  GetProfile . 
   */
  postAgentProfile(params: CodeGuruProfiler.Types.PostAgentProfileRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.PostAgentProfileResponse) => void): Request<CodeGuruProfiler.Types.PostAgentProfileResponse, AWSError>;
  /**
   *  Submits profiling data to an aggregated profile of a profiling group. To get an aggregated profile that is created with this profiling data, use  GetProfile . 
   */
  postAgentProfile(callback?: (err: AWSError, data: CodeGuruProfiler.Types.PostAgentProfileResponse) => void): Request<CodeGuruProfiler.Types.PostAgentProfileResponse, AWSError>;
  /**
   *  Adds permissions to a profiling group's resource-based policy that are provided using an action group. If a profiling group doesn't have a resource-based policy, one is created for it using the permissions in the action group and the roles and users in the principals parameter.   &lt;p&gt; The one supported action group that can be added is &lt;code&gt;agentPermission&lt;/code&gt; which grants &lt;code&gt;ConfigureAgent&lt;/code&gt; and &lt;code&gt;PostAgent&lt;/code&gt; permissions. For more information, see &lt;a href=&quot;https://docs.aws.amazon.com/codeguru/latest/profiler-ug/resource-based-policies.html&quot;&gt;Resource-based policies in CodeGuru Profiler&lt;/a&gt; in the &lt;i&gt;Amazon CodeGuru Profiler User Guide&lt;/i&gt;, &lt;a href=&quot;https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_ConfigureAgent.html&quot;&gt; &lt;code&gt;ConfigureAgent&lt;/code&gt; &lt;/a&gt;, and &lt;a href=&quot;https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_PostAgentProfile.html&quot;&gt; &lt;code&gt;PostAgentProfile&lt;/code&gt; &lt;/a&gt;. &lt;/p&gt; &lt;p&gt; The first time you call &lt;code&gt;PutPermission&lt;/code&gt; on a profiling group, do not specify a &lt;code&gt;revisionId&lt;/code&gt; because it doesn't have a resource-based policy. Subsequent calls must provide a &lt;code&gt;revisionId&lt;/code&gt; to specify which revision of the resource-based policy to add the permissions to. &lt;/p&gt; &lt;p&gt; The response contains the profiling group's JSON-formatted resource policy. &lt;/p&gt; 
   */
  putPermission(params: CodeGuruProfiler.Types.PutPermissionRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.PutPermissionResponse) => void): Request<CodeGuruProfiler.Types.PutPermissionResponse, AWSError>;
  /**
   *  Adds permissions to a profiling group's resource-based policy that are provided using an action group. If a profiling group doesn't have a resource-based policy, one is created for it using the permissions in the action group and the roles and users in the principals parameter.   &lt;p&gt; The one supported action group that can be added is &lt;code&gt;agentPermission&lt;/code&gt; which grants &lt;code&gt;ConfigureAgent&lt;/code&gt; and &lt;code&gt;PostAgent&lt;/code&gt; permissions. For more information, see &lt;a href=&quot;https://docs.aws.amazon.com/codeguru/latest/profiler-ug/resource-based-policies.html&quot;&gt;Resource-based policies in CodeGuru Profiler&lt;/a&gt; in the &lt;i&gt;Amazon CodeGuru Profiler User Guide&lt;/i&gt;, &lt;a href=&quot;https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_ConfigureAgent.html&quot;&gt; &lt;code&gt;ConfigureAgent&lt;/code&gt; &lt;/a&gt;, and &lt;a href=&quot;https://docs.aws.amazon.com/codeguru/latest/profiler-api/API_PostAgentProfile.html&quot;&gt; &lt;code&gt;PostAgentProfile&lt;/code&gt; &lt;/a&gt;. &lt;/p&gt; &lt;p&gt; The first time you call &lt;code&gt;PutPermission&lt;/code&gt; on a profiling group, do not specify a &lt;code&gt;revisionId&lt;/code&gt; because it doesn't have a resource-based policy. Subsequent calls must provide a &lt;code&gt;revisionId&lt;/code&gt; to specify which revision of the resource-based policy to add the permissions to. &lt;/p&gt; &lt;p&gt; The response contains the profiling group's JSON-formatted resource policy. &lt;/p&gt; 
   */
  putPermission(callback?: (err: AWSError, data: CodeGuruProfiler.Types.PutPermissionResponse) => void): Request<CodeGuruProfiler.Types.PutPermissionResponse, AWSError>;
  /**
   * Remove one anomaly notifications channel for a profiling group.
   */
  removeNotificationChannel(params: CodeGuruProfiler.Types.RemoveNotificationChannelRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.RemoveNotificationChannelResponse) => void): Request<CodeGuruProfiler.Types.RemoveNotificationChannelResponse, AWSError>;
  /**
   * Remove one anomaly notifications channel for a profiling group.
   */
  removeNotificationChannel(callback?: (err: AWSError, data: CodeGuruProfiler.Types.RemoveNotificationChannelResponse) => void): Request<CodeGuruProfiler.Types.RemoveNotificationChannelResponse, AWSError>;
  /**
   *  Removes permissions from a profiling group's resource-based policy that are provided using an action group. The one supported action group that can be removed is agentPermission which grants ConfigureAgent and PostAgent permissions. For more information, see Resource-based policies in CodeGuru Profiler in the Amazon CodeGuru Profiler User Guide,  ConfigureAgent , and  PostAgentProfile . 
   */
  removePermission(params: CodeGuruProfiler.Types.RemovePermissionRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.RemovePermissionResponse) => void): Request<CodeGuruProfiler.Types.RemovePermissionResponse, AWSError>;
  /**
   *  Removes permissions from a profiling group's resource-based policy that are provided using an action group. The one supported action group that can be removed is agentPermission which grants ConfigureAgent and PostAgent permissions. For more information, see Resource-based policies in CodeGuru Profiler in the Amazon CodeGuru Profiler User Guide,  ConfigureAgent , and  PostAgentProfile . 
   */
  removePermission(callback?: (err: AWSError, data: CodeGuruProfiler.Types.RemovePermissionResponse) => void): Request<CodeGuruProfiler.Types.RemovePermissionResponse, AWSError>;
  /**
   * Sends feedback to CodeGuru Profiler about whether the anomaly detected by the analysis is useful or not.
   */
  submitFeedback(params: CodeGuruProfiler.Types.SubmitFeedbackRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.SubmitFeedbackResponse) => void): Request<CodeGuruProfiler.Types.SubmitFeedbackResponse, AWSError>;
  /**
   * Sends feedback to CodeGuru Profiler about whether the anomaly detected by the analysis is useful or not.
   */
  submitFeedback(callback?: (err: AWSError, data: CodeGuruProfiler.Types.SubmitFeedbackResponse) => void): Request<CodeGuruProfiler.Types.SubmitFeedbackResponse, AWSError>;
  /**
   *  Use to assign one or more tags to a resource. 
   */
  tagResource(params: CodeGuruProfiler.Types.TagResourceRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.TagResourceResponse) => void): Request<CodeGuruProfiler.Types.TagResourceResponse, AWSError>;
  /**
   *  Use to assign one or more tags to a resource. 
   */
  tagResource(callback?: (err: AWSError, data: CodeGuruProfiler.Types.TagResourceResponse) => void): Request<CodeGuruProfiler.Types.TagResourceResponse, AWSError>;
  /**
   *  Use to remove one or more tags from a resource. 
   */
  untagResource(params: CodeGuruProfiler.Types.UntagResourceRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.UntagResourceResponse) => void): Request<CodeGuruProfiler.Types.UntagResourceResponse, AWSError>;
  /**
   *  Use to remove one or more tags from a resource. 
   */
  untagResource(callback?: (err: AWSError, data: CodeGuruProfiler.Types.UntagResourceResponse) => void): Request<CodeGuruProfiler.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a profiling group.
   */
  updateProfilingGroup(params: CodeGuruProfiler.Types.UpdateProfilingGroupRequest, callback?: (err: AWSError, data: CodeGuruProfiler.Types.UpdateProfilingGroupResponse) => void): Request<CodeGuruProfiler.Types.UpdateProfilingGroupResponse, AWSError>;
  /**
   * Updates a profiling group.
   */
  updateProfilingGroup(callback?: (err: AWSError, data: CodeGuruProfiler.Types.UpdateProfilingGroupResponse) => void): Request<CodeGuruProfiler.Types.UpdateProfilingGroupResponse, AWSError>;
}
declare namespace CodeGuruProfiler {
  export type ActionGroup = "agentPermissions"|string;
  export interface AddNotificationChannelsRequest {
    /**
     * One or 2 channels to report to when anomalies are detected.
     */
    channels: Channels;
    /**
     * The name of the profiling group that we are setting up notifications for.
     */
    profilingGroupName: ProfilingGroupName;
  }
  export interface AddNotificationChannelsResponse {
    /**
     * The new notification configuration for this profiling group.
     */
    notificationConfiguration?: NotificationConfiguration;
  }
  export interface AgentConfiguration {
    /**
     *  Parameters used by the profiler. The valid parameters are:     MaxStackDepth - The maximum depth of the stacks in the code that is represented in the profile. For example, if CodeGuru Profiler finds a method A, which calls method B, which calls method C, which calls method D, then the depth is 4. If the maxDepth is set to 2, then the profiler evaluates A and B.     MemoryUsageLimitPercent - The percentage of memory that is used by the profiler.    MinimumTimeForReportingInMilliseconds - The minimum time in milliseconds between sending reports.     ReportingIntervalInMilliseconds - The reporting interval in milliseconds used to report profiles.     SamplingIntervalInMilliseconds - The sampling interval in milliseconds that is used to profile samples.   
     */
    agentParameters?: AgentParameters;
    /**
     *  How long a profiling agent should send profiling data using  ConfigureAgent . For example, if this is set to 300, the profiling agent calls  ConfigureAgent  every 5 minutes to submit the profiled data collected during that period. 
     */
    periodInSeconds: Integer;
    /**
     *  A Boolean that specifies whether the profiling agent collects profiling data or not. Set to true to enable profiling. 
     */
    shouldProfile: Boolean;
  }
  export interface AgentOrchestrationConfig {
    /**
     *  A Boolean that specifies whether the profiling agent collects profiling data or not. Set to true to enable profiling. 
     */
    profilingEnabled: Boolean;
  }
  export type AgentParameterField = "SamplingIntervalInMilliseconds"|"ReportingIntervalInMilliseconds"|"MinimumTimeForReportingInMilliseconds"|"MemoryUsageLimitPercent"|"MaxStackDepth"|string;
  export type AgentParameters = {[key: string]: String};
  export type AgentProfile = Buffer|Uint8Array|Blob|string;
  export type AggregatedProfile = Buffer|Uint8Array|Blob|string;
  export interface AggregatedProfileTime {
    /**
     *  The aggregation period. This indicates the period during which an aggregation profile collects posted agent profiles for a profiling group. Use one of three valid durations that are specified using the ISO 8601 format.     P1D — 1 day     PT1H — 1 hour     PT5M — 5 minutes   
     */
    period?: AggregationPeriod;
    /**
     *  The time that aggregation of posted agent profiles for a profiling group starts. The aggregation profile contains profiles posted by the agent starting at this time for an aggregation period specified by the period property of the AggregatedProfileTime object.   Specify start using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    start?: Timestamp;
  }
  export type AggregationPeriod = "PT5M"|"PT1H"|"P1D"|string;
  export type Anomalies = Anomaly[];
  export interface Anomaly {
    /**
     *  A list of the instances of the detected anomalies during the requested period. 
     */
    instances: AnomalyInstances;
    /**
     *  Details about the metric that the analysis used when it detected the anomaly. The metric includes the name of the frame that was analyzed with the type and thread states used to derive the metric value for that frame. 
     */
    metric: Metric;
    /**
     * The reason for which metric was flagged as anomalous.
     */
    reason: String;
  }
  export interface AnomalyInstance {
    /**
     *  The end time of the period during which the metric is flagged as anomalous. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    endTime?: Timestamp;
    /**
     *  The universally unique identifier (UUID) of an instance of an anomaly in a metric. 
     */
    id: String;
    /**
     *  The start time of the period during which the metric is flagged as anomalous. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    startTime: Timestamp;
    /**
     * Feedback type on a specific instance of anomaly submitted by the user.
     */
    userFeedback?: UserFeedback;
  }
  export type AnomalyInstanceId = string;
  export type AnomalyInstances = AnomalyInstance[];
  export interface BatchGetFrameMetricDataRequest {
    /**
     *  The end time of the time period for the returned time series values. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    endTime?: Timestamp;
    /**
     *  The details of the metrics that are used to request a time series of values. The metric includes the name of the frame, the aggregation type to calculate the metric value for the frame, and the thread states to use to get the count for the metric value of the frame.
     */
    frameMetrics?: FrameMetrics;
    /**
     *  The duration of the frame metrics used to return the time series values. Specify using the ISO 8601 format. The maximum period duration is one day (PT24H or P1D). 
     */
    period?: Period;
    /**
     *  The name of the profiling group associated with the the frame metrics used to return the time series values. 
     */
    profilingGroupName: ProfilingGroupName;
    /**
     *  The start time of the time period for the frame metrics used to return the time series values. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    startTime?: Timestamp;
    /**
     * The requested resolution of time steps for the returned time series of values. If the requested target resolution is not available due to data not being retained we provide a best effort result by falling back to the most granular available resolution after the target resolution. There are 3 valid values.     P1D — 1 day     PT1H — 1 hour     PT5M — 5 minutes   
     */
    targetResolution?: AggregationPeriod;
  }
  export interface BatchGetFrameMetricDataResponse {
    /**
     *  The end time of the time period for the returned time series values. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    endTime: Timestamp;
    /**
     *  List of instances, or time steps, in the time series. For example, if the period is one day (PT24H)), and the resolution is five minutes (PT5M), then there are 288 endTimes in the list that are each five minutes appart. 
     */
    endTimes: ListOfTimestamps;
    /**
     * Details of the metrics to request a time series of values. The metric includes the name of the frame, the aggregation type to calculate the metric value for the frame, and the thread states to use to get the count for the metric value of the frame.
     */
    frameMetricData: FrameMetricData;
    /**
     * Resolution or granularity of the profile data used to generate the time series. This is the value used to jump through time steps in a time series. There are 3 valid values.     P1D — 1 day     PT1H — 1 hour     PT5M — 5 minutes   
     */
    resolution: AggregationPeriod;
    /**
     *  The start time of the time period for the returned time series values. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    startTime: Timestamp;
    /**
     * List of instances which remained unprocessed. This will create a missing time step in the list of end times.
     */
    unprocessedEndTimes: UnprocessedEndTimeMap;
  }
  export type Boolean = boolean;
  export interface Channel {
    /**
     * List of publishers for different type of events that may be detected in an application from the profile. Anomaly detection is the only event publisher in Profiler.
     */
    eventPublishers: EventPublishers;
    /**
     * Unique identifier for each Channel in the notification configuration of a Profiling Group. A random UUID for channelId is used when adding a channel to the notification configuration if not specified in the request.
     */
    id?: ChannelId;
    /**
     * Unique arn of the resource to be used for notifications. We support a valid SNS topic arn as a channel uri.
     */
    uri: ChannelUri;
  }
  export type ChannelId = string;
  export type ChannelUri = string;
  export type Channels = Channel[];
  export type ClientToken = string;
  export type ComputePlatform = "Default"|"AWSLambda"|string;
  export interface ConfigureAgentRequest {
    /**
     *  A universally unique identifier (UUID) for a profiling instance. For example, if the profiling instance is an Amazon EC2 instance, it is the instance ID. If it is an AWS Fargate container, it is the container's task ID. 
     */
    fleetInstanceId?: FleetInstanceId;
    /**
     *  Metadata captured about the compute platform the agent is running on. It includes information about sampling and reporting. The valid fields are:    COMPUTE_PLATFORM - The compute platform on which the agent is running     AGENT_ID - The ID for an agent instance.     AWS_REQUEST_ID - The AWS request ID of a Lambda invocation.     EXECUTION_ENVIRONMENT - The execution environment a Lambda function is running on.     LAMBDA_FUNCTION_ARN - The Amazon Resource Name (ARN) that is used to invoke a Lambda function.     LAMBDA_MEMORY_LIMIT_IN_MB - The memory allocated to a Lambda function.     LAMBDA_REMAINING_TIME_IN_MILLISECONDS - The time in milliseconds before execution of a Lambda function times out.     LAMBDA_TIME_GAP_BETWEEN_INVOKES_IN_MILLISECONDS - The time in milliseconds between two invocations of a Lambda function.     LAMBDA_PREVIOUS_EXECUTION_TIME_IN_MILLISECONDS - The time in milliseconds for the previous Lambda invocation.   
     */
    metadata?: Metadata;
    /**
     *  The name of the profiling group for which the configured agent is collecting profiling data. 
     */
    profilingGroupName: ProfilingGroupName;
  }
  export interface ConfigureAgentResponse {
    /**
     *  An  AgentConfiguration  object that specifies if an agent profiles or not and for how long to return profiling data. 
     */
    configuration: AgentConfiguration;
  }
  export interface CreateProfilingGroupRequest {
    /**
     *  Specifies whether profiling is enabled or disabled for the created profiling group. 
     */
    agentOrchestrationConfig?: AgentOrchestrationConfig;
    /**
     *  Amazon CodeGuru Profiler uses this universally unique identifier (UUID) to prevent the accidental creation of duplicate profiling groups if there are failures and retries. 
     */
    clientToken: ClientToken;
    /**
     *  The compute platform of the profiling group. Use AWSLambda if your application runs on AWS Lambda. Use Default if your application runs on a compute platform that is not AWS Lambda, such an Amazon EC2 instance, an on-premises server, or a different platform. If not specified, Default is used. 
     */
    computePlatform?: ComputePlatform;
    /**
     * The name of the profiling group to create.
     */
    profilingGroupName: ProfilingGroupName;
    /**
     *  A list of tags to add to the created profiling group. 
     */
    tags?: TagsMap;
  }
  export interface CreateProfilingGroupResponse {
    /**
     *  The returned  ProfilingGroupDescription  object that contains information about the created profiling group. 
     */
    profilingGroup: ProfilingGroupDescription;
  }
  export interface DeleteProfilingGroupRequest {
    /**
     * The name of the profiling group to delete.
     */
    profilingGroupName: ProfilingGroupName;
  }
  export interface DeleteProfilingGroupResponse {
  }
  export interface DescribeProfilingGroupRequest {
    /**
     *  The name of the profiling group to get information about. 
     */
    profilingGroupName: ProfilingGroupName;
  }
  export interface DescribeProfilingGroupResponse {
    /**
     *  The returned  ProfilingGroupDescription  object that contains information about the requested profiling group. 
     */
    profilingGroup: ProfilingGroupDescription;
  }
  export type Double = number;
  export type EventPublisher = "AnomalyDetection"|string;
  export type EventPublishers = EventPublisher[];
  export type FeedbackType = "Positive"|"Negative"|string;
  export type FindingsReportId = string;
  export type FindingsReportSummaries = FindingsReportSummary[];
  export interface FindingsReportSummary {
    /**
     * The universally unique identifier (UUID) of the recommendation report.
     */
    id?: FindingsReportId;
    /**
     *  The end time of the period during which the metric is flagged as anomalous. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    profileEndTime?: Timestamp;
    /**
     * The start time of the profile the analysis data is about. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC.
     */
    profileStartTime?: Timestamp;
    /**
     * The name of the profiling group that is associated with the analysis data.
     */
    profilingGroupName?: String;
    /**
     * The total number of different recommendations that were found by the analysis.
     */
    totalNumberOfFindings?: Integer;
  }
  export type FleetInstanceId = string;
  export interface FrameMetric {
    /**
     *  Name of the method common across the multiple occurrences of a frame in an application profile.
     */
    frameName: String;
    /**
     * List of application runtime thread states used to get the counts for a frame a derive a metric value.
     */
    threadStates: ThreadStates;
    /**
     *  A type of aggregation that specifies how a metric for a frame is analyzed. The supported value AggregatedRelativeTotalTime is an aggregation of the metric value for one frame that is calculated across the occurrences of all frames in a profile. 
     */
    type: MetricType;
  }
  export type FrameMetricData = FrameMetricDatum[];
  export interface FrameMetricDatum {
    frameMetric: FrameMetric;
    /**
     *  A list of values that are associated with a frame metric. 
     */
    values: FrameMetricValues;
  }
  export type FrameMetricValue = number;
  export type FrameMetricValues = FrameMetricValue[];
  export type FrameMetrics = FrameMetric[];
  export interface GetFindingsReportAccountSummaryRequest {
    /**
     * A Boolean value indicating whether to only return reports from daily profiles. If set to True, only analysis data from daily profiles is returned. If set to False, analysis data is returned from smaller time windows (for example, one hour).
     */
    dailyReportsOnly?: Boolean;
    /**
     * The maximum number of results returned by  GetFindingsReportAccountSummary in paginated output. When this parameter is used, GetFindingsReportAccountSummary only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another GetFindingsReportAccountSummary request with the returned nextToken value.
     */
    maxResults?: MaxResults;
    /**
     * The nextToken value returned from a previous paginated GetFindingsReportAccountSummary request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value.   This token should be treated as an opaque identifier that is only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: PaginationToken;
  }
  export interface GetFindingsReportAccountSummaryResponse {
    /**
     * The nextToken value to include in a future GetFindingsReportAccountSummary request. When the results of a GetFindingsReportAccountSummary request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
    /**
     * The return list of  FindingsReportSummary  objects taht contain summaries of analysis results for all profiling groups in your AWS account.
     */
    reportSummaries: FindingsReportSummaries;
  }
  export interface GetNotificationConfigurationRequest {
    /**
     * The name of the profiling group we want to get the notification configuration for.
     */
    profilingGroupName: ProfilingGroupName;
  }
  export interface GetNotificationConfigurationResponse {
    /**
     * The current notification configuration for this profiling group.
     */
    notificationConfiguration: NotificationConfiguration;
  }
  export interface GetPolicyRequest {
    /**
     * The name of the profiling group.
     */
    profilingGroupName: ProfilingGroupName;
  }
  export interface GetPolicyResponse {
    /**
     * The JSON-formatted resource-based policy attached to the ProfilingGroup.
     */
    policy: String;
    /**
     * A unique identifier for the current revision of the returned policy.
     */
    revisionId: RevisionId;
  }
  export interface GetProfileRequest {
    /**
     *  The format of the returned profiling data. The format maps to the Accept and Content-Type headers of the HTTP request. You can specify one of the following: or the default .   &lt;ul&gt; &lt;li&gt; &lt;p&gt; &lt;code&gt;application/json&lt;/code&gt; — standard JSON format &lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; &lt;code&gt;application/x-amzn-ion&lt;/code&gt; — the Amazon Ion data format. For more information, see &lt;a href=&quot;http://amzn.github.io/ion-docs/&quot;&gt;Amazon Ion&lt;/a&gt;. &lt;/p&gt; &lt;/li&gt; &lt;/ul&gt; 
     */
    accept?: String;
    /**
     *  The end time of the requested profile. Specify using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC.   If you specify endTime, then you must also specify period or startTime, but not both. 
     */
    endTime?: Timestamp;
    /**
     *  The maximum depth of the stacks in the code that is represented in the aggregated profile. For example, if CodeGuru Profiler finds a method A, which calls method B, which calls method C, which calls method D, then the depth is 4. If the maxDepth is set to 2, then the aggregated profile contains representations of methods A and B. 
     */
    maxDepth?: MaxDepth;
    /**
     *  Used with startTime or endTime to specify the time range for the returned aggregated profile. Specify using the ISO 8601 format. For example, P1DT1H1M1S.   &lt;p&gt; To get the latest aggregated profile, specify only &lt;code&gt;period&lt;/code&gt;. &lt;/p&gt; 
     */
    period?: Period;
    /**
     * The name of the profiling group to get.
     */
    profilingGroupName: ProfilingGroupName;
    /**
     * The start time of the profile to get. Specify using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC.  &lt;p&gt; If you specify &lt;code&gt;startTime&lt;/code&gt;, then you must also specify &lt;code&gt;period&lt;/code&gt; or &lt;code&gt;endTime&lt;/code&gt;, but not both. &lt;/p&gt; 
     */
    startTime?: Timestamp;
  }
  export interface GetProfileResponse {
    /**
     * The content encoding of the profile.
     */
    contentEncoding?: String;
    /**
     * The content type of the profile in the payload. It is either application/json or the default application/x-amzn-ion.
     */
    contentType: String;
    /**
     * Information about the profile.
     */
    profile: AggregatedProfile;
  }
  export interface GetRecommendationsRequest {
    /**
     *  The start time of the profile to get analysis data about. You must specify startTime and endTime. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    endTime: Timestamp;
    /**
     *  The language used to provide analysis. Specify using a string that is one of the following BCP 47 language codes.     de-DE - German, Germany     en-GB - English, United Kingdom     en-US - English, United States     es-ES - Spanish, Spain     fr-FR - French, France     it-IT - Italian, Italy     ja-JP - Japanese, Japan     ko-KR - Korean, Republic of Korea     pt-BR - Portugese, Brazil     zh-CN - Chinese, China     zh-TW - Chinese, Taiwan   
     */
    locale?: Locale;
    /**
     *  The name of the profiling group to get analysis data about. 
     */
    profilingGroupName: ProfilingGroupName;
    /**
     *  The end time of the profile to get analysis data about. You must specify startTime and endTime. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    startTime: Timestamp;
  }
  export interface GetRecommendationsResponse {
    /**
     *  The list of anomalies that the analysis has found for this profile. 
     */
    anomalies: Anomalies;
    /**
     *  The end time of the profile the analysis data is about. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    profileEndTime: Timestamp;
    /**
     *  The start time of the profile the analysis data is about. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    profileStartTime: Timestamp;
    /**
     * The name of the profiling group the analysis data is about.
     */
    profilingGroupName: ProfilingGroupName;
    /**
     * The list of recommendations that the analysis found for this profile.
     */
    recommendations: Recommendations;
  }
  export type Integer = number;
  export interface ListFindingsReportsRequest {
    /**
     * A Boolean value indicating whether to only return reports from daily profiles. If set to True, only analysis data from daily profiles is returned. If set to False, analysis data is returned from smaller time windows (for example, one hour).
     */
    dailyReportsOnly?: Boolean;
    /**
     *  The end time of the profile to get analysis data about. You must specify startTime and endTime. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    endTime: Timestamp;
    /**
     * The maximum number of report results returned by ListFindingsReports in paginated output. When this parameter is used, ListFindingsReports only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListFindingsReports request with the returned nextToken value.
     */
    maxResults?: MaxResults;
    /**
     * The nextToken value returned from a previous paginated ListFindingsReportsRequest request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value.   This token should be treated as an opaque identifier that is only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: PaginationToken;
    /**
     * The name of the profiling group from which to search for analysis data.
     */
    profilingGroupName: ProfilingGroupName;
    /**
     *  The start time of the profile to get analysis data about. You must specify startTime and endTime. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    startTime: Timestamp;
  }
  export interface ListFindingsReportsResponse {
    /**
     * The list of analysis results summaries.
     */
    findingsReportSummaries: FindingsReportSummaries;
    /**
     * The nextToken value to include in a future ListFindingsReports request. When the results of a ListFindingsReports request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export type ListOfTimestamps = TimestampStructure[];
  export interface ListProfileTimesRequest {
    /**
     * The end time of the time range from which to list the profiles.
     */
    endTime: Timestamp;
    /**
     * The maximum number of profile time results returned by ListProfileTimes in paginated output. When this parameter is used, ListProfileTimes only returns maxResults results in a single page with a nextToken response element. The remaining results of the initial request can be seen by sending another ListProfileTimes request with the returned nextToken value. 
     */
    maxResults?: MaxResults;
    /**
     * The nextToken value returned from a previous paginated ListProfileTimes request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value.   This token should be treated as an opaque identifier that is only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: PaginationToken;
    /**
     * The order (ascending or descending by start time of the profile) to use when listing profiles. Defaults to TIMESTAMP_DESCENDING. 
     */
    orderBy?: OrderBy;
    /**
     *  The aggregation period. This specifies the period during which an aggregation profile collects posted agent profiles for a profiling group. There are 3 valid values.     P1D — 1 day     PT1H — 1 hour     PT5M — 5 minutes   
     */
    period: AggregationPeriod;
    /**
     * The name of the profiling group.
     */
    profilingGroupName: ProfilingGroupName;
    /**
     * The start time of the time range from which to list the profiles.
     */
    startTime: Timestamp;
  }
  export interface ListProfileTimesResponse {
    /**
     * The nextToken value to include in a future ListProfileTimes request. When the results of a ListProfileTimes request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    nextToken?: PaginationToken;
    /**
     * The list of start times of the available profiles for the aggregation period in the specified time range. 
     */
    profileTimes: ProfileTimes;
  }
  export interface ListProfilingGroupsRequest {
    /**
     * A Boolean value indicating whether to include a description. If true, then a list of  ProfilingGroupDescription  objects that contain detailed information about profiling groups is returned. If false, then a list of profiling group names is returned.
     */
    includeDescription?: Boolean;
    /**
     * The maximum number of profiling groups results returned by ListProfilingGroups in paginated output. When this parameter is used, ListProfilingGroups only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListProfilingGroups request with the returned nextToken value. 
     */
    maxResults?: MaxResults;
    /**
     * The nextToken value returned from a previous paginated ListProfilingGroups request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value.   This token should be treated as an opaque identifier that is only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: PaginationToken;
  }
  export interface ListProfilingGroupsResponse {
    /**
     * The nextToken value to include in a future ListProfilingGroups request. When the results of a ListProfilingGroups request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    nextToken?: PaginationToken;
    /**
     *  A returned list of profiling group names. A list of the names is returned only if includeDescription is false, otherwise a list of  ProfilingGroupDescription  objects is returned. 
     */
    profilingGroupNames: ProfilingGroupNames;
    /**
     *  A returned list  ProfilingGroupDescription  objects. A list of  ProfilingGroupDescription  objects is returned only if includeDescription is true, otherwise a list of profiling group names is returned. 
     */
    profilingGroups?: ProfilingGroupDescriptions;
  }
  export interface ListTagsForResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the resource that contains the tags to return. 
     */
    resourceArn: ProfilingGroupArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     *  The list of tags assigned to the specified resource. This is the list of tags returned in the response. 
     */
    tags?: TagsMap;
  }
  export type Locale = string;
  export interface Match {
    /**
     * The location in the profiling graph that contains a recommendation found during analysis.
     */
    frameAddress?: String;
    /**
     * The target frame that triggered a match.
     */
    targetFramesIndex?: Integer;
    /**
     * The value in the profile data that exceeded the recommendation threshold.
     */
    thresholdBreachValue?: Double;
  }
  export type Matches = Match[];
  export type MaxDepth = number;
  export type MaxResults = number;
  export type Metadata = {[key: string]: String};
  export type MetadataField = "ComputePlatform"|"AgentId"|"AwsRequestId"|"ExecutionEnvironment"|"LambdaFunctionArn"|"LambdaMemoryLimitInMB"|"LambdaRemainingTimeInMilliseconds"|"LambdaTimeGapBetweenInvokesInMilliseconds"|"LambdaPreviousExecutionTimeInMilliseconds"|string;
  export interface Metric {
    /**
     *  The name of the method that appears as a frame in any stack in a profile. 
     */
    frameName: String;
    /**
     *  The list of application runtime thread states that is used to calculate the metric value for the frame. 
     */
    threadStates: Strings;
    /**
     *  A type that specifies how a metric for a frame is analyzed. The supported value AggregatedRelativeTotalTime is an aggregation of the metric value for one frame that is calculated across the occurences of all frames in a profile.
     */
    type: MetricType;
  }
  export type MetricType = "AggregatedRelativeTotalTime"|string;
  export interface NotificationConfiguration {
    /**
     * List of up to two channels to be used for sending notifications for events detected from the application profile.
     */
    channels?: Channels;
  }
  export type OrderBy = "TimestampDescending"|"TimestampAscending"|string;
  export type PaginationToken = string;
  export interface Pattern {
    /**
     *  A list of the different counters used to determine if there is a match. 
     */
    countersToAggregate?: Strings;
    /**
     * The description of the recommendation. This explains a potential inefficiency in a profiled application.
     */
    description?: String;
    /**
     * The universally unique identifier (UUID) of this pattern.
     */
    id?: String;
    /**
     * The name for this pattern.
     */
    name?: String;
    /**
     *  A string that contains the steps recommended to address the potential inefficiency. 
     */
    resolutionSteps?: String;
    /**
     * A list of frame names that were searched during the analysis that generated a recommendation.
     */
    targetFrames?: TargetFrames;
    /**
     *  The percentage of time an application spends in one method that triggers a recommendation. The percentage of time is the same as the percentage of the total gathered sample counts during analysis. 
     */
    thresholdPercent?: Percentage;
  }
  export type Percentage = number;
  export type Period = string;
  export interface PostAgentProfileRequest {
    /**
     *  The submitted profiling data. 
     */
    agentProfile: AgentProfile;
    /**
     *  The format of the submitted profiling data. The format maps to the Accept and Content-Type headers of the HTTP request. You can specify one of the following: or the default .   &lt;ul&gt; &lt;li&gt; &lt;p&gt; &lt;code&gt;application/json&lt;/code&gt; — standard JSON format &lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; &lt;code&gt;application/x-amzn-ion&lt;/code&gt; — the Amazon Ion data format. For more information, see &lt;a href=&quot;http://amzn.github.io/ion-docs/&quot;&gt;Amazon Ion&lt;/a&gt;. &lt;/p&gt; &lt;/li&gt; &lt;/ul&gt; 
     */
    contentType: String;
    /**
     *  Amazon CodeGuru Profiler uses this universally unique identifier (UUID) to prevent the accidental submission of duplicate profiling data if there are failures and retries. 
     */
    profileToken?: ClientToken;
    /**
     *  The name of the profiling group with the aggregated profile that receives the submitted profiling data. 
     */
    profilingGroupName: ProfilingGroupName;
  }
  export interface PostAgentProfileResponse {
  }
  export type Principal = string;
  export type Principals = Principal[];
  export interface ProfileTime {
    /**
     * The start time of a profile. It is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC.
     */
    start?: Timestamp;
  }
  export type ProfileTimes = ProfileTime[];
  export type ProfilingGroupArn = string;
  export interface ProfilingGroupDescription {
    /**
     *  An  AgentOrchestrationConfig  object that indicates if the profiling group is enabled for profiled or not. 
     */
    agentOrchestrationConfig?: AgentOrchestrationConfig;
    /**
     * The Amazon Resource Name (ARN) identifying the profiling group resource.
     */
    arn?: ProfilingGroupArn;
    /**
     *  The compute platform of the profiling group. If it is set to AWSLambda, then the profiled application runs on AWS Lambda. If it is set to Default, then the profiled application runs on a compute platform that is not AWS Lambda, such an Amazon EC2 instance, an on-premises server, or a different platform. The default is Default. 
     */
    computePlatform?: ComputePlatform;
    /**
     * The time when the profiling group was created. Specify using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    createdAt?: Timestamp;
    /**
     * The name of the profiling group.
     */
    name?: ProfilingGroupName;
    /**
     *  A  ProfilingStatus  object that includes information about the last time a profile agent pinged back, the last time a profile was received, and the aggregation period and start time for the most recent aggregated profile. 
     */
    profilingStatus?: ProfilingStatus;
    /**
     *  A list of the tags that belong to this profiling group. 
     */
    tags?: TagsMap;
    /**
     *  The date and time when the profiling group was last updated. Specify using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    updatedAt?: Timestamp;
  }
  export type ProfilingGroupDescriptions = ProfilingGroupDescription[];
  export type ProfilingGroupName = string;
  export type ProfilingGroupNames = ProfilingGroupName[];
  export interface ProfilingStatus {
    /**
     * The date and time when the profiling agent most recently pinged back. Specify using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC.
     */
    latestAgentOrchestratedAt?: Timestamp;
    /**
     * The date and time when the most recent profile was received. Specify using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC.
     */
    latestAgentProfileReportedAt?: Timestamp;
    /**
     *  An  AggregatedProfileTime  object that contains the aggregation period and start time for an aggregated profile. 
     */
    latestAggregatedProfile?: AggregatedProfileTime;
  }
  export interface PutPermissionRequest {
    /**
     *  Specifies an action group that contains permissions to add to a profiling group resource. One action group is supported, agentPermissions, which grants permission to perform actions required by the profiling agent, ConfigureAgent and PostAgentProfile permissions. 
     */
    actionGroup: ActionGroup;
    /**
     *  A list ARNs for the roles and users you want to grant access to the profiling group. Wildcards are not are supported in the ARNs. 
     */
    principals: Principals;
    /**
     * The name of the profiling group to grant access to.
     */
    profilingGroupName: ProfilingGroupName;
    /**
     *  A universally unique identifier (UUID) for the revision of the policy you are adding to the profiling group. Do not specify this when you add permissions to a profiling group for the first time. If a policy already exists on the profiling group, you must specify the revisionId. 
     */
    revisionId?: RevisionId;
  }
  export interface PutPermissionResponse {
    /**
     *  The JSON-formatted resource-based policy on the profiling group that includes the added permissions. 
     */
    policy: String;
    /**
     *  A universally unique identifier (UUID) for the revision of the resource-based policy that includes the added permissions. The JSON-formatted policy is in the policy element of the response. 
     */
    revisionId: RevisionId;
  }
  export interface Recommendation {
    /**
     * How many different places in the profile graph triggered a match.
     */
    allMatchesCount: Integer;
    /**
     * How much of the total sample count is potentially affected.
     */
    allMatchesSum: Double;
    /**
     * End time of the profile that was used by this analysis. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC.
     */
    endTime: Timestamp;
    /**
     * The pattern that analysis recognized in the profile to make this recommendation.
     */
    pattern: Pattern;
    /**
     * The start time of the profile that was used by this analysis. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC.
     */
    startTime: Timestamp;
    /**
     * List of the matches with most impact. 
     */
    topMatches: Matches;
  }
  export type Recommendations = Recommendation[];
  export interface RemoveNotificationChannelRequest {
    /**
     * The id of the channel that we want to stop receiving notifications.
     */
    channelId: ChannelId;
    /**
     * The name of the profiling group we want to change notification configuration for.
     */
    profilingGroupName: ProfilingGroupName;
  }
  export interface RemoveNotificationChannelResponse {
    /**
     * The new notification configuration for this profiling group.
     */
    notificationConfiguration?: NotificationConfiguration;
  }
  export interface RemovePermissionRequest {
    /**
     *  Specifies an action group that contains the permissions to remove from a profiling group's resource-based policy. One action group is supported, agentPermissions, which grants ConfigureAgent and PostAgentProfile permissions. 
     */
    actionGroup: ActionGroup;
    /**
     * The name of the profiling group.
     */
    profilingGroupName: ProfilingGroupName;
    /**
     *  A universally unique identifier (UUID) for the revision of the resource-based policy from which you want to remove permissions. 
     */
    revisionId: RevisionId;
  }
  export interface RemovePermissionResponse {
    /**
     *  The JSON-formatted resource-based policy on the profiling group after the specified permissions were removed. 
     */
    policy: String;
    /**
     *  A universally unique identifier (UUID) for the revision of the resource-based policy after the specified permissions were removed. The updated JSON-formatted policy is in the policy element of the response. 
     */
    revisionId: RevisionId;
  }
  export type RevisionId = string;
  export type String = string;
  export type Strings = String[];
  export interface SubmitFeedbackRequest {
    /**
     * The universally unique identifier (UUID) of the  AnomalyInstance  object that is included in the analysis data.
     */
    anomalyInstanceId: AnomalyInstanceId;
    /**
     * Optional feedback about this anomaly.
     */
    comment?: String;
    /**
     * The name of the profiling group that is associated with the analysis data.
     */
    profilingGroupName: ProfilingGroupName;
    /**
     *  The feedback tpye. Thee are two valid values, Positive and Negative. 
     */
    type: FeedbackType;
  }
  export interface SubmitFeedbackResponse {
  }
  export type TagKeys = String[];
  export interface TagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the resource that the tags are added to. 
     */
    resourceArn: ProfilingGroupArn;
    /**
     *  The list of tags that are added to the specified resource. 
     */
    tags: TagsMap;
  }
  export interface TagResourceResponse {
  }
  export type TagsMap = {[key: string]: String};
  export type TargetFrame = String[];
  export type TargetFrames = TargetFrame[];
  export type ThreadStates = String[];
  export type Timestamp = Date;
  export interface TimestampStructure {
    /**
     *  A Timestamp. This is specified using the ISO 8601 format. For example, 2020-06-01T13:15:02.001Z represents 1 millisecond past June 1, 2020 1:15:02 PM UTC. 
     */
    value: Timestamp;
  }
  export type UnprocessedEndTimeMap = {[key: string]: ListOfTimestamps};
  export interface UntagResourceRequest {
    /**
     *  The Amazon Resource Name (ARN) of the resource that contains the tags to remove. 
     */
    resourceArn: ProfilingGroupArn;
    /**
     *  A list of tag keys. Existing tags of resources with keys in this list are removed from the specified resource. 
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateProfilingGroupRequest {
    /**
     *  Specifies whether profiling is enabled or disabled for a profiling group. 
     */
    agentOrchestrationConfig: AgentOrchestrationConfig;
    /**
     * The name of the profiling group to update.
     */
    profilingGroupName: ProfilingGroupName;
  }
  export interface UpdateProfilingGroupResponse {
    /**
     *  A  ProfilingGroupDescription  that contains information about the returned updated profiling group. 
     */
    profilingGroup: ProfilingGroupDescription;
  }
  export interface UserFeedback {
    /**
     * Optional Positive or Negative feedback submitted by the user about whether the recommendation is useful or not.
     */
    type: FeedbackType;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-07-18"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CodeGuruProfiler client.
   */
  export import Types = CodeGuruProfiler;
}
export = CodeGuruProfiler;
