import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Synthetics extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Synthetics.Types.ClientConfiguration)
  config: Config & Synthetics.Types.ClientConfiguration;
  /**
   * Creates a canary. Canaries are scripts that monitor your endpoints and APIs from the outside-in. Canaries help you check the availability and latency of your web services and troubleshoot anomalies by investigating load time data, screenshots of the UI, logs, and metrics. You can set up a canary to run continuously or just once.  Do not use CreateCanary to modify an existing canary. Use UpdateCanary instead. To create canaries, you must have the CloudWatchSyntheticsFullAccess policy. If you are creating a new IAM role for the canary, you also need the the iam:CreateRole, iam:CreatePolicy and iam:AttachRolePolicy permissions. For more information, see Necessary Roles and Permissions. Do not include secrets or proprietary information in your canary names. The canary name makes up part of the Amazon Resource Name (ARN) for the canary, and the ARN is included in outbound calls over the internet. For more information, see Security Considerations for Synthetics Canaries.
   */
  createCanary(params: Synthetics.Types.CreateCanaryRequest, callback?: (err: AWSError, data: Synthetics.Types.CreateCanaryResponse) => void): Request<Synthetics.Types.CreateCanaryResponse, AWSError>;
  /**
   * Creates a canary. Canaries are scripts that monitor your endpoints and APIs from the outside-in. Canaries help you check the availability and latency of your web services and troubleshoot anomalies by investigating load time data, screenshots of the UI, logs, and metrics. You can set up a canary to run continuously or just once.  Do not use CreateCanary to modify an existing canary. Use UpdateCanary instead. To create canaries, you must have the CloudWatchSyntheticsFullAccess policy. If you are creating a new IAM role for the canary, you also need the the iam:CreateRole, iam:CreatePolicy and iam:AttachRolePolicy permissions. For more information, see Necessary Roles and Permissions. Do not include secrets or proprietary information in your canary names. The canary name makes up part of the Amazon Resource Name (ARN) for the canary, and the ARN is included in outbound calls over the internet. For more information, see Security Considerations for Synthetics Canaries.
   */
  createCanary(callback?: (err: AWSError, data: Synthetics.Types.CreateCanaryResponse) => void): Request<Synthetics.Types.CreateCanaryResponse, AWSError>;
  /**
   * Permanently deletes the specified canary. When you delete a canary, resources used and created by the canary are not automatically deleted. After you delete a canary that you do not intend to use again, you should also delete the following:   The Lambda functions and layers used by this canary. These have the prefix cwsyn-MyCanaryName .   The CloudWatch alarms created for this canary. These alarms have a name of Synthetics-SharpDrop-Alarm-MyCanaryName .   Amazon S3 objects and buckets, such as the canary's artifact location.   IAM roles created for the canary. If they were created in the console, these roles have the name  role/service-role/CloudWatchSyntheticsRole-MyCanaryName .   CloudWatch Logs log groups created for the canary. These logs groups have the name /aws/lambda/cwsyn-MyCanaryName .    Before you delete a canary, you might want to use GetCanary to display the information about this canary. Make note of the information returned by this operation so that you can delete these resources after you delete the canary.
   */
  deleteCanary(params: Synthetics.Types.DeleteCanaryRequest, callback?: (err: AWSError, data: Synthetics.Types.DeleteCanaryResponse) => void): Request<Synthetics.Types.DeleteCanaryResponse, AWSError>;
  /**
   * Permanently deletes the specified canary. When you delete a canary, resources used and created by the canary are not automatically deleted. After you delete a canary that you do not intend to use again, you should also delete the following:   The Lambda functions and layers used by this canary. These have the prefix cwsyn-MyCanaryName .   The CloudWatch alarms created for this canary. These alarms have a name of Synthetics-SharpDrop-Alarm-MyCanaryName .   Amazon S3 objects and buckets, such as the canary's artifact location.   IAM roles created for the canary. If they were created in the console, these roles have the name  role/service-role/CloudWatchSyntheticsRole-MyCanaryName .   CloudWatch Logs log groups created for the canary. These logs groups have the name /aws/lambda/cwsyn-MyCanaryName .    Before you delete a canary, you might want to use GetCanary to display the information about this canary. Make note of the information returned by this operation so that you can delete these resources after you delete the canary.
   */
  deleteCanary(callback?: (err: AWSError, data: Synthetics.Types.DeleteCanaryResponse) => void): Request<Synthetics.Types.DeleteCanaryResponse, AWSError>;
  /**
   * This operation returns a list of the canaries in your account, along with full details about each canary. This operation does not have resource-level authorization, so if a user is able to use DescribeCanaries, the user can see all of the canaries in the account. A deny policy can only be used to restrict access to all canaries. It cannot be used on specific resources. 
   */
  describeCanaries(params: Synthetics.Types.DescribeCanariesRequest, callback?: (err: AWSError, data: Synthetics.Types.DescribeCanariesResponse) => void): Request<Synthetics.Types.DescribeCanariesResponse, AWSError>;
  /**
   * This operation returns a list of the canaries in your account, along with full details about each canary. This operation does not have resource-level authorization, so if a user is able to use DescribeCanaries, the user can see all of the canaries in the account. A deny policy can only be used to restrict access to all canaries. It cannot be used on specific resources. 
   */
  describeCanaries(callback?: (err: AWSError, data: Synthetics.Types.DescribeCanariesResponse) => void): Request<Synthetics.Types.DescribeCanariesResponse, AWSError>;
  /**
   * Use this operation to see information from the most recent run of each canary that you have created.
   */
  describeCanariesLastRun(params: Synthetics.Types.DescribeCanariesLastRunRequest, callback?: (err: AWSError, data: Synthetics.Types.DescribeCanariesLastRunResponse) => void): Request<Synthetics.Types.DescribeCanariesLastRunResponse, AWSError>;
  /**
   * Use this operation to see information from the most recent run of each canary that you have created.
   */
  describeCanariesLastRun(callback?: (err: AWSError, data: Synthetics.Types.DescribeCanariesLastRunResponse) => void): Request<Synthetics.Types.DescribeCanariesLastRunResponse, AWSError>;
  /**
   * Returns a list of Synthetics canary runtime versions. For more information, see  Canary Runtime Versions.
   */
  describeRuntimeVersions(params: Synthetics.Types.DescribeRuntimeVersionsRequest, callback?: (err: AWSError, data: Synthetics.Types.DescribeRuntimeVersionsResponse) => void): Request<Synthetics.Types.DescribeRuntimeVersionsResponse, AWSError>;
  /**
   * Returns a list of Synthetics canary runtime versions. For more information, see  Canary Runtime Versions.
   */
  describeRuntimeVersions(callback?: (err: AWSError, data: Synthetics.Types.DescribeRuntimeVersionsResponse) => void): Request<Synthetics.Types.DescribeRuntimeVersionsResponse, AWSError>;
  /**
   * Retrieves complete information about one canary. You must specify the name of the canary that you want. To get a list of canaries and their names, use DescribeCanaries.
   */
  getCanary(params: Synthetics.Types.GetCanaryRequest, callback?: (err: AWSError, data: Synthetics.Types.GetCanaryResponse) => void): Request<Synthetics.Types.GetCanaryResponse, AWSError>;
  /**
   * Retrieves complete information about one canary. You must specify the name of the canary that you want. To get a list of canaries and their names, use DescribeCanaries.
   */
  getCanary(callback?: (err: AWSError, data: Synthetics.Types.GetCanaryResponse) => void): Request<Synthetics.Types.GetCanaryResponse, AWSError>;
  /**
   * Retrieves a list of runs for a specified canary.
   */
  getCanaryRuns(params: Synthetics.Types.GetCanaryRunsRequest, callback?: (err: AWSError, data: Synthetics.Types.GetCanaryRunsResponse) => void): Request<Synthetics.Types.GetCanaryRunsResponse, AWSError>;
  /**
   * Retrieves a list of runs for a specified canary.
   */
  getCanaryRuns(callback?: (err: AWSError, data: Synthetics.Types.GetCanaryRunsResponse) => void): Request<Synthetics.Types.GetCanaryRunsResponse, AWSError>;
  /**
   * Displays the tags associated with a canary.
   */
  listTagsForResource(params: Synthetics.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Synthetics.Types.ListTagsForResourceResponse) => void): Request<Synthetics.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Displays the tags associated with a canary.
   */
  listTagsForResource(callback?: (err: AWSError, data: Synthetics.Types.ListTagsForResourceResponse) => void): Request<Synthetics.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Use this operation to run a canary that has already been created. The frequency of the canary runs is determined by the value of the canary's Schedule. To see a canary's schedule, use GetCanary.
   */
  startCanary(params: Synthetics.Types.StartCanaryRequest, callback?: (err: AWSError, data: Synthetics.Types.StartCanaryResponse) => void): Request<Synthetics.Types.StartCanaryResponse, AWSError>;
  /**
   * Use this operation to run a canary that has already been created. The frequency of the canary runs is determined by the value of the canary's Schedule. To see a canary's schedule, use GetCanary.
   */
  startCanary(callback?: (err: AWSError, data: Synthetics.Types.StartCanaryResponse) => void): Request<Synthetics.Types.StartCanaryResponse, AWSError>;
  /**
   * Stops the canary to prevent all future runs. If the canary is currently running, Synthetics stops waiting for the current run of the specified canary to complete. The run that is in progress completes on its own, publishes metrics, and uploads artifacts, but it is not recorded in Synthetics as a completed run. You can use StartCanary to start it running again with the canary’s current schedule at any point in the future. 
   */
  stopCanary(params: Synthetics.Types.StopCanaryRequest, callback?: (err: AWSError, data: Synthetics.Types.StopCanaryResponse) => void): Request<Synthetics.Types.StopCanaryResponse, AWSError>;
  /**
   * Stops the canary to prevent all future runs. If the canary is currently running, Synthetics stops waiting for the current run of the specified canary to complete. The run that is in progress completes on its own, publishes metrics, and uploads artifacts, but it is not recorded in Synthetics as a completed run. You can use StartCanary to start it running again with the canary’s current schedule at any point in the future. 
   */
  stopCanary(callback?: (err: AWSError, data: Synthetics.Types.StopCanaryResponse) => void): Request<Synthetics.Types.StopCanaryResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified canary.  Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a canary that already has tags. If you specify a new tag key for the alarm, this tag is appended to the list of tags associated with the alarm. If you specify a tag key that is already associated with the alarm, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a canary.
   */
  tagResource(params: Synthetics.Types.TagResourceRequest, callback?: (err: AWSError, data: Synthetics.Types.TagResourceResponse) => void): Request<Synthetics.Types.TagResourceResponse, AWSError>;
  /**
   * Assigns one or more tags (key-value pairs) to the specified canary.  Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only resources with certain tag values. Tags don't have any semantic meaning to Amazon Web Services and are interpreted strictly as strings of characters. You can use the TagResource action with a canary that already has tags. If you specify a new tag key for the alarm, this tag is appended to the list of tags associated with the alarm. If you specify a tag key that is already associated with the alarm, the new tag value that you specify replaces the previous value for that tag. You can associate as many as 50 tags with a canary.
   */
  tagResource(callback?: (err: AWSError, data: Synthetics.Types.TagResourceResponse) => void): Request<Synthetics.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified canary.
   */
  untagResource(params: Synthetics.Types.UntagResourceRequest, callback?: (err: AWSError, data: Synthetics.Types.UntagResourceResponse) => void): Request<Synthetics.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from the specified canary.
   */
  untagResource(callback?: (err: AWSError, data: Synthetics.Types.UntagResourceResponse) => void): Request<Synthetics.Types.UntagResourceResponse, AWSError>;
  /**
   * Use this operation to change the settings of a canary that has already been created. You can't use this operation to update the tags of an existing canary. To change the tags of an existing canary, use TagResource.
   */
  updateCanary(params: Synthetics.Types.UpdateCanaryRequest, callback?: (err: AWSError, data: Synthetics.Types.UpdateCanaryResponse) => void): Request<Synthetics.Types.UpdateCanaryResponse, AWSError>;
  /**
   * Use this operation to change the settings of a canary that has already been created. You can't use this operation to update the tags of an existing canary. To change the tags of an existing canary, use TagResource.
   */
  updateCanary(callback?: (err: AWSError, data: Synthetics.Types.UpdateCanaryResponse) => void): Request<Synthetics.Types.UpdateCanaryResponse, AWSError>;
}
declare namespace Synthetics {
  export interface ArtifactConfigInput {
    /**
     * A structure that contains the configuration of the encryption-at-rest settings for artifacts that the canary uploads to Amazon S3. Artifact encryption functionality is available only for canaries that use Synthetics runtime version syn-nodejs-puppeteer-3.3 or later. For more information, see Encrypting canary artifacts 
     */
    S3Encryption?: S3EncryptionConfig;
  }
  export interface ArtifactConfigOutput {
    /**
     * A structure that contains the configuration of encryption settings for canary artifacts that are stored in Amazon S3. 
     */
    S3Encryption?: S3EncryptionConfig;
  }
  export interface BaseScreenshot {
    /**
     * The name of the screenshot. This is generated the first time the canary is run after the UpdateCanary operation that specified for this canary to perform visual monitoring.
     */
    ScreenshotName: String;
    /**
     * Coordinates that define the part of a screen to ignore during screenshot comparisons. To obtain the coordinates to use here, use the CloudWatch Logs console to draw the boundaries on the screen. For more information, see {LINK}
     */
    IgnoreCoordinates?: BaseScreenshotIgnoreCoordinates;
  }
  export type BaseScreenshotConfigIgnoreCoordinate = string;
  export type BaseScreenshotIgnoreCoordinates = BaseScreenshotConfigIgnoreCoordinate[];
  export type BaseScreenshots = BaseScreenshot[];
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type Canaries = Canary[];
  export type CanariesLastRun = CanaryLastRun[];
  export interface Canary {
    /**
     * The unique ID of this canary.
     */
    Id?: UUID;
    /**
     * The name of the canary.
     */
    Name?: CanaryName;
    Code?: CanaryCodeOutput;
    /**
     * The ARN of the IAM role used to run the canary. This role must include lambda.amazonaws.com as a principal in the trust policy.
     */
    ExecutionRoleArn?: RoleArn;
    /**
     * A structure that contains information about how often the canary is to run, and when these runs are to stop.
     */
    Schedule?: CanaryScheduleOutput;
    RunConfig?: CanaryRunConfigOutput;
    /**
     * The number of days to retain data about successful runs of this canary.
     */
    SuccessRetentionPeriodInDays?: MaxSize1024;
    /**
     * The number of days to retain data about failed runs of this canary.
     */
    FailureRetentionPeriodInDays?: MaxSize1024;
    /**
     * A structure that contains information about the canary's status.
     */
    Status?: CanaryStatus;
    /**
     * A structure that contains information about when the canary was created, modified, and most recently run.
     */
    Timeline?: CanaryTimeline;
    /**
     * The location in Amazon S3 where Synthetics stores artifacts from the runs of this canary. Artifacts include the log file, screenshots, and HAR files.
     */
    ArtifactS3Location?: String;
    /**
     * The ARN of the Lambda function that is used as your canary's engine. For more information about Lambda ARN format, see Resources and Conditions for Lambda Actions.
     */
    EngineArn?: FunctionArn;
    /**
     * Specifies the runtime version to use for the canary. For more information about runtime versions, see  Canary Runtime Versions.
     */
    RuntimeVersion?: String;
    VpcConfig?: VpcConfigOutput;
    /**
     * If this canary performs visual monitoring by comparing screenshots, this structure contains the ID of the canary run to use as the baseline for screenshots, and the coordinates of any parts of the screen to ignore during the visual monitoring comparison.
     */
    VisualReference?: VisualReferenceOutput;
    /**
     * The list of key-value pairs that are associated with the canary.
     */
    Tags?: TagMap;
    /**
     * A structure that contains the configuration for canary artifacts, including the encryption-at-rest settings for artifacts that the canary uploads to Amazon S3.
     */
    ArtifactConfig?: ArtifactConfigOutput;
  }
  export type CanaryArn = string;
  export interface CanaryCodeInput {
    /**
     * If your canary script is located in S3, specify the bucket name here. Do not include s3:// as the start of the bucket name.
     */
    S3Bucket?: String;
    /**
     * The S3 key of your script. For more information, see Working with Amazon S3 Objects.
     */
    S3Key?: String;
    /**
     * The S3 version ID of your script.
     */
    S3Version?: String;
    /**
     * If you input your canary script directly into the canary instead of referring to an S3 location, the value of this parameter is the base64-encoded contents of the .zip file that contains the script. It must be smaller than 256 Kb.
     */
    ZipFile?: _Blob;
    /**
     * The entry point to use for the source code when running the canary. This value must end with the string .handler. The string is limited to 29 characters or fewer.
     */
    Handler: String;
  }
  export interface CanaryCodeOutput {
    /**
     * The ARN of the Lambda layer where Synthetics stores the canary script code.
     */
    SourceLocationArn?: String;
    /**
     * The entry point to use for the source code when running the canary.
     */
    Handler?: String;
  }
  export interface CanaryLastRun {
    /**
     * The name of the canary.
     */
    CanaryName?: CanaryName;
    /**
     * The results from this canary's most recent run.
     */
    LastRun?: CanaryRun;
  }
  export type CanaryName = string;
  export interface CanaryRun {
    /**
     * A unique ID that identifies this canary run.
     */
    Id?: UUID;
    /**
     * The name of the canary.
     */
    Name?: CanaryName;
    /**
     * The status of this run.
     */
    Status?: CanaryRunStatus;
    /**
     * A structure that contains the start and end times of this run.
     */
    Timeline?: CanaryRunTimeline;
    /**
     * The location where the canary stored artifacts from the run. Artifacts include the log file, screenshots, and HAR files.
     */
    ArtifactS3Location?: String;
  }
  export interface CanaryRunConfigInput {
    /**
     * How long the canary is allowed to run before it must stop. You can't set this time to be longer than the frequency of the runs of this canary. If you omit this field, the frequency of the canary is used as this value, up to a maximum of 14 minutes.
     */
    TimeoutInSeconds?: MaxFifteenMinutesInSeconds;
    /**
     * The maximum amount of memory available to the canary while it is running, in MB. This value must be a multiple of 64.
     */
    MemoryInMB?: MaxSize3008;
    /**
     * Specifies whether this canary is to use active X-Ray tracing when it runs. Active tracing enables this canary run to be displayed in the ServiceLens and X-Ray service maps even if the canary does not hit an endpoint that has X-Ray tracing enabled. Using X-Ray tracing incurs charges. For more information, see  Canaries and X-Ray tracing. You can enable active tracing only for canaries that use version syn-nodejs-2.0 or later for their canary runtime.
     */
    ActiveTracing?: NullableBoolean;
    /**
     * Specifies the keys and values to use for any environment variables used in the canary script. Use the following format: { "key1" : "value1", "key2" : "value2", ...} Keys must start with a letter and be at least two characters. The total size of your environment variables cannot exceed 4 KB. You can't specify any Lambda reserved environment variables as the keys for your environment variables. For more information about reserved keys, see  Runtime environment variables.
     */
    EnvironmentVariables?: EnvironmentVariablesMap;
  }
  export interface CanaryRunConfigOutput {
    /**
     * How long the canary is allowed to run before it must stop.
     */
    TimeoutInSeconds?: MaxFifteenMinutesInSeconds;
    /**
     * The maximum amount of memory available to the canary while it is running, in MB. This value must be a multiple of 64.
     */
    MemoryInMB?: MaxSize3008;
    /**
     * Displays whether this canary run used active X-Ray tracing. 
     */
    ActiveTracing?: NullableBoolean;
  }
  export type CanaryRunState = "RUNNING"|"PASSED"|"FAILED"|string;
  export type CanaryRunStateReasonCode = "CANARY_FAILURE"|"EXECUTION_FAILURE"|string;
  export interface CanaryRunStatus {
    /**
     * The current state of the run.
     */
    State?: CanaryRunState;
    /**
     * If run of the canary failed, this field contains the reason for the error.
     */
    StateReason?: String;
    /**
     * If this value is CANARY_FAILURE, an exception occurred in the canary code. If this value is EXECUTION_FAILURE, an exception occurred in CloudWatch Synthetics.
     */
    StateReasonCode?: CanaryRunStateReasonCode;
  }
  export interface CanaryRunTimeline {
    /**
     * The start time of the run.
     */
    Started?: Timestamp;
    /**
     * The end time of the run.
     */
    Completed?: Timestamp;
  }
  export type CanaryRuns = CanaryRun[];
  export interface CanaryScheduleInput {
    /**
     * A rate expression or a cron expression that defines how often the canary is to run. For a rate expression, The syntax is rate(number unit). unit can be minute, minutes, or hour.  For example, rate(1 minute) runs the canary once a minute, rate(10 minutes) runs it once every 10 minutes, and rate(1 hour) runs it once every hour. You can specify a frequency between rate(1 minute) and rate(1 hour). Specifying rate(0 minute) or rate(0 hour) is a special value that causes the canary to run only once when it is started. Use cron(expression) to specify a cron expression. You can't schedule a canary to wait for more than a year before running. For information about the syntax for cron expressions, see  Scheduling canary runs using cron.
     */
    Expression: String;
    /**
     * How long, in seconds, for the canary to continue making regular runs according to the schedule in the Expression value. If you specify 0, the canary continues making runs until you stop it. If you omit this field, the default of 0 is used.
     */
    DurationInSeconds?: MaxOneYearInSeconds;
  }
  export interface CanaryScheduleOutput {
    /**
     * A rate expression or a cron expression that defines how often the canary is to run. For a rate expression, The syntax is rate(number unit). unit can be minute, minutes, or hour.  For example, rate(1 minute) runs the canary once a minute, rate(10 minutes) runs it once every 10 minutes, and rate(1 hour) runs it once every hour. You can specify a frequency between rate(1 minute) and rate(1 hour). Specifying rate(0 minute) or rate(0 hour) is a special value that causes the canary to run only once when it is started. Use cron(expression) to specify a cron expression. For information about the syntax for cron expressions, see  Scheduling canary runs using cron.
     */
    Expression?: String;
    /**
     * How long, in seconds, for the canary to continue making regular runs after it was created. The runs are performed according to the schedule in the Expression value.
     */
    DurationInSeconds?: MaxOneYearInSeconds;
  }
  export type CanaryState = "CREATING"|"READY"|"STARTING"|"RUNNING"|"UPDATING"|"STOPPING"|"STOPPED"|"ERROR"|"DELETING"|string;
  export type CanaryStateReasonCode = "INVALID_PERMISSIONS"|string;
  export interface CanaryStatus {
    /**
     * The current state of the canary.
     */
    State?: CanaryState;
    /**
     * If the canary has insufficient permissions to run, this field provides more details.
     */
    StateReason?: String;
    /**
     * If the canary cannot run or has failed, this field displays the reason.
     */
    StateReasonCode?: CanaryStateReasonCode;
  }
  export interface CanaryTimeline {
    /**
     * The date and time the canary was created.
     */
    Created?: Timestamp;
    /**
     * The date and time the canary was most recently modified.
     */
    LastModified?: Timestamp;
    /**
     * The date and time that the canary's most recent run started.
     */
    LastStarted?: Timestamp;
    /**
     * The date and time that the canary's most recent run ended.
     */
    LastStopped?: Timestamp;
  }
  export interface CreateCanaryRequest {
    /**
     * The name for this canary. Be sure to give it a descriptive name that distinguishes it from other canaries in your account. Do not include secrets or proprietary information in your canary names. The canary name makes up part of the canary ARN, and the ARN is included in outbound calls over the internet. For more information, see Security Considerations for Synthetics Canaries.
     */
    Name: CanaryName;
    /**
     * A structure that includes the entry point from which the canary should start running your script. If the script is stored in an S3 bucket, the bucket name, key, and version are also included. 
     */
    Code: CanaryCodeInput;
    /**
     * The location in Amazon S3 where Synthetics stores artifacts from the test runs of this canary. Artifacts include the log file, screenshots, and HAR files. The name of the S3 bucket can't include a period (.).
     */
    ArtifactS3Location: String;
    /**
     * The ARN of the IAM role to be used to run the canary. This role must already exist, and must include lambda.amazonaws.com as a principal in the trust policy. The role must also have the following permissions:    s3:PutObject     s3:GetBucketLocation     s3:ListAllMyBuckets     cloudwatch:PutMetricData     logs:CreateLogGroup     logs:CreateLogStream     logs:PutLogEvents   
     */
    ExecutionRoleArn: RoleArn;
    /**
     * A structure that contains information about how often the canary is to run and when these test runs are to stop.
     */
    Schedule: CanaryScheduleInput;
    /**
     * A structure that contains the configuration for individual canary runs, such as timeout value.
     */
    RunConfig?: CanaryRunConfigInput;
    /**
     * The number of days to retain data about successful runs of this canary. If you omit this field, the default of 31 days is used. The valid range is 1 to 455 days.
     */
    SuccessRetentionPeriodInDays?: MaxSize1024;
    /**
     * The number of days to retain data about failed runs of this canary. If you omit this field, the default of 31 days is used. The valid range is 1 to 455 days.
     */
    FailureRetentionPeriodInDays?: MaxSize1024;
    /**
     * Specifies the runtime version to use for the canary. For a list of valid runtime versions and more information about runtime versions, see  Canary Runtime Versions.
     */
    RuntimeVersion: String;
    /**
     * If this canary is to test an endpoint in a VPC, this structure contains information about the subnet and security groups of the VPC endpoint. For more information, see  Running a Canary in a VPC.
     */
    VpcConfig?: VpcConfigInput;
    /**
     * A list of key-value pairs to associate with the canary. You can associate as many as 50 tags with a canary. Tags can help you organize and categorize your resources. You can also use them to scope user permissions, by granting a user permission to access or change only the resources that have certain tag values.
     */
    Tags?: TagMap;
    /**
     * A structure that contains the configuration for canary artifacts, including the encryption-at-rest settings for artifacts that the canary uploads to Amazon S3.
     */
    ArtifactConfig?: ArtifactConfigInput;
  }
  export interface CreateCanaryResponse {
    /**
     * The full details about the canary you have created.
     */
    Canary?: Canary;
  }
  export interface DeleteCanaryRequest {
    /**
     * The name of the canary that you want to delete. To find the names of your canaries, use DescribeCanaries.
     */
    Name: CanaryName;
  }
  export interface DeleteCanaryResponse {
  }
  export interface DescribeCanariesLastRunRequest {
    /**
     * A token that indicates that there is more data available. You can use this token in a subsequent DescribeCanaries operation to retrieve the next set of results.
     */
    NextToken?: Token;
    /**
     * Specify this parameter to limit how many runs are returned each time you use the DescribeLastRun operation. If you omit this parameter, the default of 100 is used.
     */
    MaxResults?: MaxSize100;
  }
  export interface DescribeCanariesLastRunResponse {
    /**
     * An array that contains the information from the most recent run of each canary.
     */
    CanariesLastRun?: CanariesLastRun;
    /**
     * A token that indicates that there is more data available. You can use this token in a subsequent DescribeCanariesLastRun operation to retrieve the next set of results.
     */
    NextToken?: Token;
  }
  export interface DescribeCanariesRequest {
    /**
     * A token that indicates that there is more data available. You can use this token in a subsequent operation to retrieve the next set of results.
     */
    NextToken?: Token;
    /**
     * Specify this parameter to limit how many canaries are returned each time you use the DescribeCanaries operation. If you omit this parameter, the default of 100 is used.
     */
    MaxResults?: MaxCanaryResults;
  }
  export interface DescribeCanariesResponse {
    /**
     * Returns an array. Each item in the array contains the full information about one canary.
     */
    Canaries?: Canaries;
    /**
     * A token that indicates that there is more data available. You can use this token in a subsequent DescribeCanaries operation to retrieve the next set of results.
     */
    NextToken?: Token;
  }
  export interface DescribeRuntimeVersionsRequest {
    /**
     * A token that indicates that there is more data available. You can use this token in a subsequent DescribeRuntimeVersions operation to retrieve the next set of results.
     */
    NextToken?: Token;
    /**
     * Specify this parameter to limit how many runs are returned each time you use the DescribeRuntimeVersions operation. If you omit this parameter, the default of 100 is used.
     */
    MaxResults?: MaxSize100;
  }
  export interface DescribeRuntimeVersionsResponse {
    /**
     * An array of objects that display the details about each Synthetics canary runtime version.
     */
    RuntimeVersions?: RuntimeVersionList;
    /**
     * A token that indicates that there is more data available. You can use this token in a subsequent DescribeRuntimeVersions operation to retrieve the next set of results.
     */
    NextToken?: Token;
  }
  export type EncryptionMode = "SSE_S3"|"SSE_KMS"|string;
  export type EnvironmentVariableName = string;
  export type EnvironmentVariableValue = string;
  export type EnvironmentVariablesMap = {[key: string]: EnvironmentVariableValue};
  export type FunctionArn = string;
  export interface GetCanaryRequest {
    /**
     * The name of the canary that you want details for.
     */
    Name: CanaryName;
  }
  export interface GetCanaryResponse {
    /**
     * A strucure that contains the full information about the canary.
     */
    Canary?: Canary;
  }
  export interface GetCanaryRunsRequest {
    /**
     * The name of the canary that you want to see runs for.
     */
    Name: CanaryName;
    /**
     * A token that indicates that there is more data available. You can use this token in a subsequent GetCanaryRuns operation to retrieve the next set of results.
     */
    NextToken?: Token;
    /**
     * Specify this parameter to limit how many runs are returned each time you use the GetCanaryRuns operation. If you omit this parameter, the default of 100 is used.
     */
    MaxResults?: MaxSize100;
  }
  export interface GetCanaryRunsResponse {
    /**
     * An array of structures. Each structure contains the details of one of the retrieved canary runs.
     */
    CanaryRuns?: CanaryRuns;
    /**
     * A token that indicates that there is more data available. You can use this token in a subsequent GetCanaryRuns operation to retrieve the next set of results.
     */
    NextToken?: Token;
  }
  export type KmsKeyArn = string;
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the canary that you want to view tags for. The ARN format of a canary is arn:aws:synthetics:Region:account-id:canary:canary-name .
     */
    ResourceArn: CanaryArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The list of tag keys and values associated with the canary that you specified.
     */
    Tags?: TagMap;
  }
  export type MaxCanaryResults = number;
  export type MaxFifteenMinutesInSeconds = number;
  export type MaxOneYearInSeconds = number;
  export type MaxSize100 = number;
  export type MaxSize1024 = number;
  export type MaxSize3008 = number;
  export type NullableBoolean = boolean;
  export type RoleArn = string;
  export interface RuntimeVersion {
    /**
     * The name of the runtime version. For a list of valid runtime versions, see  Canary Runtime Versions.
     */
    VersionName?: String;
    /**
     * A description of the runtime version, created by Amazon.
     */
    Description?: String;
    /**
     * The date that the runtime version was released.
     */
    ReleaseDate?: Timestamp;
    /**
     * If this runtime version is deprecated, this value is the date of deprecation.
     */
    DeprecationDate?: Timestamp;
  }
  export type RuntimeVersionList = RuntimeVersion[];
  export interface S3EncryptionConfig {
    /**
     *  The encryption method to use for artifacts created by this canary. Specify SSE_S3 to use server-side encryption (SSE) with an Amazon S3-managed key. Specify SSE-KMS to use server-side encryption with a customer-managed KMS key. If you omit this parameter, an Amazon Web Services-managed KMS key is used. 
     */
    EncryptionMode?: EncryptionMode;
    /**
     * The ARN of the customer-managed KMS key to use, if you specify SSE-KMS for EncryptionMode 
     */
    KmsKeyArn?: KmsKeyArn;
  }
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export interface StartCanaryRequest {
    /**
     * The name of the canary that you want to run. To find canary names, use DescribeCanaries.
     */
    Name: CanaryName;
  }
  export interface StartCanaryResponse {
  }
  export interface StopCanaryRequest {
    /**
     * The name of the canary that you want to stop. To find the names of your canaries, use DescribeCanaries.
     */
    Name: CanaryName;
  }
  export interface StopCanaryResponse {
  }
  export type String = string;
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the canary that you're adding tags to. The ARN format of a canary is arn:aws:synthetics:Region:account-id:canary:canary-name .
     */
    ResourceArn: CanaryArn;
    /**
     * The list of key-value pairs to associate with the canary.
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type Token = string;
  export type UUID = string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the canary that you're removing tags from. The ARN format of a canary is arn:aws:synthetics:Region:account-id:canary:canary-name .
     */
    ResourceArn: CanaryArn;
    /**
     * The list of tag keys to remove from the resource.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateCanaryRequest {
    /**
     * The name of the canary that you want to update. To find the names of your canaries, use DescribeCanaries. You cannot change the name of a canary that has already been created.
     */
    Name: CanaryName;
    /**
     * A structure that includes the entry point from which the canary should start running your script. If the script is stored in an S3 bucket, the bucket name, key, and version are also included. 
     */
    Code?: CanaryCodeInput;
    /**
     * The ARN of the IAM role to be used to run the canary. This role must already exist, and must include lambda.amazonaws.com as a principal in the trust policy. The role must also have the following permissions:    s3:PutObject     s3:GetBucketLocation     s3:ListAllMyBuckets     cloudwatch:PutMetricData     logs:CreateLogGroup     logs:CreateLogStream     logs:CreateLogStream   
     */
    ExecutionRoleArn?: RoleArn;
    /**
     * Specifies the runtime version to use for the canary. For a list of valid runtime versions and for more information about runtime versions, see  Canary Runtime Versions.
     */
    RuntimeVersion?: String;
    /**
     * A structure that contains information about how often the canary is to run, and when these runs are to stop.
     */
    Schedule?: CanaryScheduleInput;
    /**
     * A structure that contains the timeout value that is used for each individual run of the canary.
     */
    RunConfig?: CanaryRunConfigInput;
    /**
     * The number of days to retain data about successful runs of this canary.
     */
    SuccessRetentionPeriodInDays?: MaxSize1024;
    /**
     * The number of days to retain data about failed runs of this canary.
     */
    FailureRetentionPeriodInDays?: MaxSize1024;
    /**
     * If this canary is to test an endpoint in a VPC, this structure contains information about the subnet and security groups of the VPC endpoint. For more information, see  Running a Canary in a VPC.
     */
    VpcConfig?: VpcConfigInput;
    /**
     * Defines the screenshots to use as the baseline for comparisons during visual monitoring comparisons during future runs of this canary. If you omit this parameter, no changes are made to any baseline screenshots that the canary might be using already. Visual monitoring is supported only on canaries running the syn-puppeteer-node-3.2 runtime or later. For more information, see  Visual monitoring and  Visual monitoring blueprint 
     */
    VisualReference?: VisualReferenceInput;
    /**
     * The location in Amazon S3 where Synthetics stores artifacts from the test runs of this canary. Artifacts include the log file, screenshots, and HAR files. The name of the S3 bucket can't include a period (.).
     */
    ArtifactS3Location?: String;
    /**
     * A structure that contains the configuration for canary artifacts, including the encryption-at-rest settings for artifacts that the canary uploads to Amazon S3.
     */
    ArtifactConfig?: ArtifactConfigInput;
  }
  export interface UpdateCanaryResponse {
  }
  export interface VisualReferenceInput {
    /**
     * An array of screenshots that will be used as the baseline for visual monitoring in future runs of this canary. If there is a screenshot that you don't want to be used for visual monitoring, remove it from this array.
     */
    BaseScreenshots?: BaseScreenshots;
    /**
     * Specifies which canary run to use the screenshots from as the baseline for future visual monitoring with this canary. Valid values are nextrun to use the screenshots from the next run after this update is made, lastrun to use the screenshots from the most recent run before this update was made, or the value of Id in the  CanaryRun from any past run of this canary.
     */
    BaseCanaryRunId: String;
  }
  export interface VisualReferenceOutput {
    /**
     * An array of screenshots that are used as the baseline for comparisons during visual monitoring.
     */
    BaseScreenshots?: BaseScreenshots;
    /**
     * The ID of the canary run that produced the screenshots that are used as the baseline for visual monitoring comparisons during future runs of this canary.
     */
    BaseCanaryRunId?: String;
  }
  export interface VpcConfigInput {
    /**
     * The IDs of the subnets where this canary is to run.
     */
    SubnetIds?: SubnetIds;
    /**
     * The IDs of the security groups for this canary.
     */
    SecurityGroupIds?: SecurityGroupIds;
  }
  export interface VpcConfigOutput {
    /**
     * The IDs of the VPC where this canary is to run.
     */
    VpcId?: VpcId;
    /**
     * The IDs of the subnets where this canary is to run.
     */
    SubnetIds?: SubnetIds;
    /**
     * The IDs of the security groups for this canary.
     */
    SecurityGroupIds?: SecurityGroupIds;
  }
  export type VpcId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-10-11"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Synthetics client.
   */
  export import Types = Synthetics;
}
export = Synthetics;
