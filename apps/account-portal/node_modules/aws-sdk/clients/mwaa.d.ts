import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class MWAA extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: MWAA.Types.ClientConfiguration)
  config: Config & MWAA.Types.ClientConfiguration;
  /**
   * Create a CLI token to use Airflow CLI.
   */
  createCliToken(params: MWAA.Types.CreateCliTokenRequest, callback?: (err: AWSError, data: MWAA.Types.CreateCliTokenResponse) => void): Request<MWAA.Types.CreateCliTokenResponse, AWSError>;
  /**
   * Create a CLI token to use Airflow CLI.
   */
  createCliToken(callback?: (err: AWSError, data: MWAA.Types.CreateCliTokenResponse) => void): Request<MWAA.Types.CreateCliTokenResponse, AWSError>;
  /**
   * Creates an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
   */
  createEnvironment(params: MWAA.Types.CreateEnvironmentInput, callback?: (err: AWSError, data: MWAA.Types.CreateEnvironmentOutput) => void): Request<MWAA.Types.CreateEnvironmentOutput, AWSError>;
  /**
   * Creates an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
   */
  createEnvironment(callback?: (err: AWSError, data: MWAA.Types.CreateEnvironmentOutput) => void): Request<MWAA.Types.CreateEnvironmentOutput, AWSError>;
  /**
   * Create a JWT token to be used to login to Airflow Web UI with claims based Authentication.
   */
  createWebLoginToken(params: MWAA.Types.CreateWebLoginTokenRequest, callback?: (err: AWSError, data: MWAA.Types.CreateWebLoginTokenResponse) => void): Request<MWAA.Types.CreateWebLoginTokenResponse, AWSError>;
  /**
   * Create a JWT token to be used to login to Airflow Web UI with claims based Authentication.
   */
  createWebLoginToken(callback?: (err: AWSError, data: MWAA.Types.CreateWebLoginTokenResponse) => void): Request<MWAA.Types.CreateWebLoginTokenResponse, AWSError>;
  /**
   * Deletes an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
   */
  deleteEnvironment(params: MWAA.Types.DeleteEnvironmentInput, callback?: (err: AWSError, data: MWAA.Types.DeleteEnvironmentOutput) => void): Request<MWAA.Types.DeleteEnvironmentOutput, AWSError>;
  /**
   * Deletes an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
   */
  deleteEnvironment(callback?: (err: AWSError, data: MWAA.Types.DeleteEnvironmentOutput) => void): Request<MWAA.Types.DeleteEnvironmentOutput, AWSError>;
  /**
   * Retrieves the details of an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
   */
  getEnvironment(params: MWAA.Types.GetEnvironmentInput, callback?: (err: AWSError, data: MWAA.Types.GetEnvironmentOutput) => void): Request<MWAA.Types.GetEnvironmentOutput, AWSError>;
  /**
   * Retrieves the details of an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
   */
  getEnvironment(callback?: (err: AWSError, data: MWAA.Types.GetEnvironmentOutput) => void): Request<MWAA.Types.GetEnvironmentOutput, AWSError>;
  /**
   * Lists the Amazon Managed Workflows for Apache Airflow (MWAA) environments.
   */
  listEnvironments(params: MWAA.Types.ListEnvironmentsInput, callback?: (err: AWSError, data: MWAA.Types.ListEnvironmentsOutput) => void): Request<MWAA.Types.ListEnvironmentsOutput, AWSError>;
  /**
   * Lists the Amazon Managed Workflows for Apache Airflow (MWAA) environments.
   */
  listEnvironments(callback?: (err: AWSError, data: MWAA.Types.ListEnvironmentsOutput) => void): Request<MWAA.Types.ListEnvironmentsOutput, AWSError>;
  /**
   * Lists the key-value tag pairs associated to the Amazon Managed Workflows for Apache Airflow (MWAA) environment. For example, "Environment": "Staging". 
   */
  listTagsForResource(params: MWAA.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: MWAA.Types.ListTagsForResourceOutput) => void): Request<MWAA.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists the key-value tag pairs associated to the Amazon Managed Workflows for Apache Airflow (MWAA) environment. For example, "Environment": "Staging". 
   */
  listTagsForResource(callback?: (err: AWSError, data: MWAA.Types.ListTagsForResourceOutput) => void): Request<MWAA.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * An operation for publishing metrics from the customers to the Ops plane.
   */
  publishMetrics(params: MWAA.Types.PublishMetricsInput, callback?: (err: AWSError, data: MWAA.Types.PublishMetricsOutput) => void): Request<MWAA.Types.PublishMetricsOutput, AWSError>;
  /**
   * An operation for publishing metrics from the customers to the Ops plane.
   */
  publishMetrics(callback?: (err: AWSError, data: MWAA.Types.PublishMetricsOutput) => void): Request<MWAA.Types.PublishMetricsOutput, AWSError>;
  /**
   * Associates key-value tag pairs to your Amazon Managed Workflows for Apache Airflow (MWAA) environment. 
   */
  tagResource(params: MWAA.Types.TagResourceInput, callback?: (err: AWSError, data: MWAA.Types.TagResourceOutput) => void): Request<MWAA.Types.TagResourceOutput, AWSError>;
  /**
   * Associates key-value tag pairs to your Amazon Managed Workflows for Apache Airflow (MWAA) environment. 
   */
  tagResource(callback?: (err: AWSError, data: MWAA.Types.TagResourceOutput) => void): Request<MWAA.Types.TagResourceOutput, AWSError>;
  /**
   * Removes key-value tag pairs associated to your Amazon Managed Workflows for Apache Airflow (MWAA) environment. For example, "Environment": "Staging".
   */
  untagResource(params: MWAA.Types.UntagResourceInput, callback?: (err: AWSError, data: MWAA.Types.UntagResourceOutput) => void): Request<MWAA.Types.UntagResourceOutput, AWSError>;
  /**
   * Removes key-value tag pairs associated to your Amazon Managed Workflows for Apache Airflow (MWAA) environment. For example, "Environment": "Staging".
   */
  untagResource(callback?: (err: AWSError, data: MWAA.Types.UntagResourceOutput) => void): Request<MWAA.Types.UntagResourceOutput, AWSError>;
  /**
   * Updates an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
   */
  updateEnvironment(params: MWAA.Types.UpdateEnvironmentInput, callback?: (err: AWSError, data: MWAA.Types.UpdateEnvironmentOutput) => void): Request<MWAA.Types.UpdateEnvironmentOutput, AWSError>;
  /**
   * Updates an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
   */
  updateEnvironment(callback?: (err: AWSError, data: MWAA.Types.UpdateEnvironmentOutput) => void): Request<MWAA.Types.UpdateEnvironmentOutput, AWSError>;
}
declare namespace MWAA {
  export type AirflowConfigurationOptions = {[key: string]: ConfigValue};
  export type AirflowVersion = string;
  export type CloudWatchLogGroupArn = string;
  export type ConfigKey = string;
  export type ConfigValue = string;
  export interface CreateCliTokenRequest {
    /**
     * Create a CLI token request for a MWAA environment.
     */
    Name: EnvironmentName;
  }
  export interface CreateCliTokenResponse {
    /**
     * Create an Airflow CLI login token response for the provided JWT token.
     */
    CliToken?: SyntheticCreateCliTokenResponseToken;
    /**
     * Create an Airflow CLI login token response for the provided webserver hostname.
     */
    WebServerHostname?: Hostname;
  }
  export interface CreateEnvironmentInput {
    /**
     * A list of key-value pairs containing the Apache Airflow configuration options you want to attach to your environment. To learn more, see Apache Airflow configuration options.
     */
    AirflowConfigurationOptions?: SyntheticCreateEnvironmentInputAirflowConfigurationOptions;
    /**
     * The Apache Airflow version for your environment. For example, v1.10.12. If no value is specified, defaults to the latest version. Valid values: v1.10.12.
     */
    AirflowVersion?: AirflowVersion;
    /**
     * The relative path to the DAGs folder on your Amazon S3 bucket. For example, dags. To learn more, see Adding or updating DAGs.
     */
    DagS3Path: RelativePath;
    /**
     * The environment class type. Valid values: mw1.small, mw1.medium, mw1.large. To learn more, see Amazon MWAA environment class.
     */
    EnvironmentClass?: EnvironmentClass;
    /**
     * The Amazon Resource Name (ARN) of the execution role for your environment. An execution role is an AWS Identity and Access Management (IAM) role that grants MWAA permission to access AWS services and resources used by your environment. For example, arn:aws:iam::123456789:role/my-execution-role. To learn more, see Amazon MWAA Execution role.
     */
    ExecutionRoleArn: IamRoleArn;
    /**
     * The AWS Key Management Service (KMS) key to encrypt the data in your environment. You can use an AWS owned CMK, or a Customer managed CMK (advanced). To learn more, see Get started with Amazon Managed Workflows for Apache Airflow.
     */
    KmsKey?: KmsKey;
    /**
     * Defines the Apache Airflow logs to send to CloudWatch Logs: DagProcessingLogs, SchedulerLogs, TaskLogs, WebserverLogs, WorkerLogs.
     */
    LoggingConfiguration?: LoggingConfigurationInput;
    /**
     * The maximum number of workers that you want to run in your environment. MWAA scales the number of Apache Airflow workers up to the number you specify in the MaxWorkers field. For example, 20. When there are no more tasks running, and no more in the queue, MWAA disposes of the extra workers leaving the one worker that is included with your environment, or the number you specify in MinWorkers.
     */
    MaxWorkers?: MaxWorkers;
    /**
     * The minimum number of workers that you want to run in your environment. MWAA scales the number of Apache Airflow workers up to the number you specify in the MaxWorkers field. When there are no more tasks running, and no more in the queue, MWAA disposes of the extra workers leaving the worker count you specify in the MinWorkers field. For example, 2.
     */
    MinWorkers?: MinWorkers;
    /**
     * The name of the Amazon MWAA environment. For example, MyMWAAEnvironment.
     */
    Name: EnvironmentName;
    /**
     * The VPC networking components used to secure and enable network traffic between the AWS resources for your environment. To learn more, see About networking on Amazon MWAA.
     */
    NetworkConfiguration: NetworkConfiguration;
    /**
     * The version of the plugins.zip file on your Amazon S3 bucket. A version must be specified each time a plugins.zip file is updated. To learn more, see How S3 Versioning works.
     */
    PluginsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the plugins.zip file on your Amazon S3 bucket. For example, plugins.zip. If specified, then the plugins.zip version is required. To learn more, see Installing custom plugins.
     */
    PluginsS3Path?: RelativePath;
    /**
     * The version of the requirements.txt file on your Amazon S3 bucket. A version must be specified each time a requirements.txt file is updated. To learn more, see How S3 Versioning works.
     */
    RequirementsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the requirements.txt file on your Amazon S3 bucket. For example, requirements.txt. If specified, then a file version is required. To learn more, see Installing Python dependencies.
     */
    RequirementsS3Path?: RelativePath;
    /**
     * The number of Apache Airflow schedulers to run in your environment.
     */
    Schedulers?: Schedulers;
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket where your DAG code and supporting files are stored. For example, arn:aws:s3:::my-airflow-bucket-unique-name. To learn more, see Create an Amazon S3 bucket for Amazon MWAA.
     */
    SourceBucketArn: S3BucketArn;
    /**
     * The key-value tag pairs you want to associate to your environment. For example, "Environment": "Staging". To learn more, see Tagging AWS resources.
     */
    Tags?: TagMap;
    /**
     * The Apache Airflow Web server access mode. To learn more, see Apache Airflow access modes.
     */
    WebserverAccessMode?: WebserverAccessMode;
    /**
     * The day and time of the week to start weekly maintenance updates of your environment in the following format: DAY:HH:MM. For example: TUE:03:30. You can specify a start time in 30 minute increments only. Supported input includes the following:   MON|TUE|WED|THU|FRI|SAT|SUN:([01]\\d|2[0-3]):(00|30)  
     */
    WeeklyMaintenanceWindowStart?: WeeklyMaintenanceWindowStart;
  }
  export interface CreateEnvironmentOutput {
    /**
     * The Amazon Resource Name (ARN) returned in the response for the environment.
     */
    Arn?: EnvironmentArn;
  }
  export interface CreateWebLoginTokenRequest {
    /**
     * Create an Airflow Web UI login token request for a MWAA environment.
     */
    Name: EnvironmentName;
  }
  export interface CreateWebLoginTokenResponse {
    /**
     * Create an Airflow Web UI login token response for the provided webserver hostname.
     */
    WebServerHostname?: Hostname;
    /**
     * Create an Airflow Web UI login token response for the provided JWT token.
     */
    WebToken?: SyntheticCreateWebLoginTokenResponseToken;
  }
  export type CreatedAt = Date;
  export interface DeleteEnvironmentInput {
    /**
     * The name of the Amazon MWAA environment. For example, MyMWAAEnvironment.
     */
    Name: EnvironmentName;
  }
  export interface DeleteEnvironmentOutput {
  }
  export interface Dimension {
    /**
     * Internal only API.
     */
    Name: String;
    /**
     * Internal only API.
     */
    Value: String;
  }
  export type Dimensions = Dimension[];
  export type Double = number;
  export interface Environment {
    /**
     * A list of key-value pairs containing the Apache Airflow configuration options attached to your environment. To learn more, see Apache Airflow configuration options.
     */
    AirflowConfigurationOptions?: AirflowConfigurationOptions;
    /**
     * The Apache Airflow version on your environment. For example, v1.10.12.
     */
    AirflowVersion?: AirflowVersion;
    /**
     * The Amazon Resource Name (ARN) of the Amazon MWAA environment.
     */
    Arn?: EnvironmentArn;
    /**
     * The day and time the environment was created.
     */
    CreatedAt?: CreatedAt;
    /**
     * The relative path to the DAGs folder on your Amazon S3 bucket. For example, dags. To learn more, see Adding or updating DAGs.
     */
    DagS3Path?: RelativePath;
    /**
     * The environment class type. Valid values: mw1.small, mw1.medium, mw1.large. To learn more, see Amazon MWAA environment class.
     */
    EnvironmentClass?: EnvironmentClass;
    /**
     * The Amazon Resource Name (ARN) of the execution role in IAM that allows MWAA to access AWS resources in your environment. For example, arn:aws:iam::123456789:role/my-execution-role. To learn more, see Amazon MWAA Execution role.
     */
    ExecutionRoleArn?: IamRoleArn;
    /**
     * The Key Management Service (KMS) encryption key used to encrypt the data in your environment.
     */
    KmsKey?: KmsKey;
    LastUpdate?: LastUpdate;
    /**
     * The Apache Airflow logs being sent to CloudWatch Logs: DagProcessingLogs, SchedulerLogs, TaskLogs, WebserverLogs, WorkerLogs.
     */
    LoggingConfiguration?: LoggingConfiguration;
    /**
     * The maximum number of workers that run in your environment. For example, 20.
     */
    MaxWorkers?: MaxWorkers;
    /**
     * The minimum number of workers that run in your environment. For example, 2.
     */
    MinWorkers?: MinWorkers;
    /**
     * The name of the Amazon MWAA environment. For example, MyMWAAEnvironment.
     */
    Name?: EnvironmentName;
    NetworkConfiguration?: NetworkConfiguration;
    /**
     * The version of the plugins.zip file on your Amazon S3 bucket. To learn more, see Installing custom plugins.
     */
    PluginsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the plugins.zip file on your Amazon S3 bucket. For example, plugins.zip. To learn more, see Installing custom plugins.
     */
    PluginsS3Path?: RelativePath;
    /**
     * The version of the requirements.txt file on your Amazon S3 bucket. To learn more, see Installing Python dependencies.
     */
    RequirementsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the requirements.txt file on your Amazon S3 bucket. For example, requirements.txt. To learn more, see Installing Python dependencies.
     */
    RequirementsS3Path?: RelativePath;
    /**
     * The number of Apache Airflow schedulers that run in your Amazon MWAA environment.
     */
    Schedulers?: Schedulers;
    /**
     * The Amazon Resource Name (ARN) for the service-linked role of the environment. To learn more, see Amazon MWAA Service-linked role.
     */
    ServiceRoleArn?: IamRoleArn;
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket where your DAG code and supporting files are stored. For example, arn:aws:s3:::my-airflow-bucket-unique-name. To learn more, see Create an Amazon S3 bucket for Amazon MWAA.
     */
    SourceBucketArn?: S3BucketArn;
    /**
     * The status of the Amazon MWAA environment. Valid values:    CREATING - Indicates the request to create the environment is in progress.    CREATE_FAILED - Indicates the request to create the environment failed, and the environment could not be created.    AVAILABLE - Indicates the request was successful and the environment is ready to use.    UPDATING - Indicates the request to update the environment is in progress.    DELETING - Indicates the request to delete the environment is in progress.    DELETED - Indicates the request to delete the environment is complete, and the environment has been deleted.    UNAVAILABLE - Indicates the request failed, but the environment was unable to rollback and is not in a stable state.    UPDATE_FAILED - Indicates the request to update the environment failed, and the environment has rolled back successfully and is ready to use.   We recommend reviewing our troubleshooting guide for a list of common errors and their solutions. To learn more, see Amazon MWAA troubleshooting.
     */
    Status?: EnvironmentStatus;
    /**
     * The key-value tag pairs associated to your environment. For example, "Environment": "Staging". To learn more, see Tagging AWS resources.
     */
    Tags?: TagMap;
    /**
     * The Apache Airflow Web server access mode. To learn more, see Apache Airflow access modes.
     */
    WebserverAccessMode?: WebserverAccessMode;
    /**
     * The Apache Airflow Web server host name for the Amazon MWAA environment. To learn more, see Accessing the Apache Airflow UI.
     */
    WebserverUrl?: WebserverUrl;
    /**
     * The day and time of the week that weekly maintenance updates are scheduled. For example: TUE:03:30.
     */
    WeeklyMaintenanceWindowStart?: WeeklyMaintenanceWindowStart;
  }
  export type EnvironmentArn = string;
  export type EnvironmentClass = string;
  export type EnvironmentList = EnvironmentName[];
  export type EnvironmentName = string;
  export type EnvironmentStatus = "CREATING"|"CREATE_FAILED"|"AVAILABLE"|"UPDATING"|"DELETING"|"DELETED"|"UNAVAILABLE"|"UPDATE_FAILED"|string;
  export type ErrorCode = string;
  export type ErrorMessage = string;
  export interface GetEnvironmentInput {
    /**
     * The name of the Amazon MWAA environment. For example, MyMWAAEnvironment.
     */
    Name: EnvironmentName;
  }
  export interface GetEnvironmentOutput {
    /**
     * An object containing all available details about the environment.
     */
    Environment?: Environment;
  }
  export type Hostname = string;
  export type IamRoleArn = string;
  export type Integer = number;
  export type KmsKey = string;
  export interface LastUpdate {
    /**
     * The day and time of the last update on the environment.
     */
    CreatedAt?: UpdateCreatedAt;
    /**
     * The error that was encountered during the last update of the environment.
     */
    Error?: UpdateError;
    /**
     * The status of the last update on the environment. Valid values: SUCCESS, PENDING, FAILED.
     */
    Status?: UpdateStatus;
  }
  export interface ListEnvironmentsInput {
    /**
     * The maximum number of results to retrieve per page. For example, 5 environments per page.
     */
    MaxResults?: ListEnvironmentsInputMaxResultsInteger;
    /**
     * Retrieves the next page of the results.
     */
    NextToken?: NextToken;
  }
  export type ListEnvironmentsInputMaxResultsInteger = number;
  export interface ListEnvironmentsOutput {
    /**
     * Returns the list of Amazon MWAA environments.
     */
    Environments: EnvironmentList;
    /**
     * Retrieves the next page of the results.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the Amazon MWAA environment. For example, arn:aws:airflow:us-east-1:123456789012:environment/MyMWAAEnvironment.
     */
    ResourceArn: EnvironmentArn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The key-value tag pairs associated to your environment. To learn more, see Tagging AWS resources.
     */
    Tags?: TagMap;
  }
  export interface LoggingConfiguration {
    DagProcessingLogs?: ModuleLoggingConfiguration;
    SchedulerLogs?: ModuleLoggingConfiguration;
    TaskLogs?: ModuleLoggingConfiguration;
    WebserverLogs?: ModuleLoggingConfiguration;
    WorkerLogs?: ModuleLoggingConfiguration;
  }
  export interface LoggingConfigurationInput {
    DagProcessingLogs?: ModuleLoggingConfigurationInput;
    SchedulerLogs?: ModuleLoggingConfigurationInput;
    TaskLogs?: ModuleLoggingConfigurationInput;
    WebserverLogs?: ModuleLoggingConfigurationInput;
    WorkerLogs?: ModuleLoggingConfigurationInput;
  }
  export type LoggingEnabled = boolean;
  export type LoggingLevel = "CRITICAL"|"ERROR"|"WARNING"|"INFO"|"DEBUG"|string;
  export type MaxWorkers = number;
  export type MetricData = MetricDatum[];
  export interface MetricDatum {
    /**
     * Internal only API.
     */
    Dimensions?: Dimensions;
    /**
     * Internal only API.
     */
    MetricName: String;
    /**
     * Internal only API.
     */
    StatisticValues?: StatisticSet;
    /**
     * Internal only API.
     */
    Timestamp: Timestamp;
    Unit?: Unit;
    /**
     * Internal only API.
     */
    Value?: Double;
  }
  export type MinWorkers = number;
  export interface ModuleLoggingConfiguration {
    /**
     * The Amazon Resource Name (ARN) for the CloudWatch Logs group where the Apache Airflow log type (e.g. DagProcessingLogs) is published. For example, arn:aws:logs:us-east-1:123456789012:log-group:airflow-MyMWAAEnvironment-MwaaEnvironment-DAGProcessing:*.
     */
    CloudWatchLogGroupArn?: CloudWatchLogGroupArn;
    /**
     * Indicates whether to enable the Apache Airflow log type (e.g. DagProcessingLogs) in CloudWatch Logs.
     */
    Enabled?: LoggingEnabled;
    /**
     * Defines the Apache Airflow logs to send for the log type (e.g. DagProcessingLogs) to CloudWatch Logs. Valid values: CRITICAL, ERROR, WARNING, INFO.
     */
    LogLevel?: LoggingLevel;
  }
  export interface ModuleLoggingConfigurationInput {
    /**
     * Indicates whether to enable the Apache Airflow log type (e.g. DagProcessingLogs) in CloudWatch Logs.
     */
    Enabled: LoggingEnabled;
    /**
     * Defines the Apache Airflow logs to send for the log type (e.g. DagProcessingLogs) to CloudWatch Logs. Valid values: CRITICAL, ERROR, WARNING, INFO.
     */
    LogLevel: LoggingLevel;
  }
  export interface NetworkConfiguration {
    /**
     * A list of 1 or more security group IDs. Accepts up to 5 security group IDs. A security group must be attached to the same VPC as the subnets. To learn more, see Security in your VPC on Amazon MWAA.
     */
    SecurityGroupIds?: SecurityGroupList;
    /**
     * A list of 2 subnet IDs. Required to create an environment. Must be private subnets in two different availability zones. A subnet must be attached to the same VPC as the security group.
     */
    SubnetIds?: SubnetList;
  }
  export type NextToken = string;
  export interface PublishMetricsInput {
    /**
     * Publishes environment metric data to Amazon CloudWatch.
     */
    EnvironmentName: EnvironmentName;
    /**
     * Publishes metric data points to Amazon CloudWatch. CloudWatch associates the data points with the specified metrica.
     */
    MetricData: MetricData;
  }
  export interface PublishMetricsOutput {
  }
  export type RelativePath = string;
  export type S3BucketArn = string;
  export type S3ObjectVersion = string;
  export type Schedulers = number;
  export type SecurityGroupId = string;
  export type SecurityGroupList = SecurityGroupId[];
  export interface StatisticSet {
    /**
     * Internal only API.
     */
    Maximum?: Double;
    /**
     * Internal only API.
     */
    Minimum?: Double;
    /**
     * Internal only API.
     */
    SampleCount?: Integer;
    /**
     * Internal only API.
     */
    Sum?: Double;
  }
  export type String = string;
  export type SubnetId = string;
  export type SubnetList = SubnetId[];
  export type SyntheticCreateCliTokenResponseToken = string;
  export type SyntheticCreateEnvironmentInputAirflowConfigurationOptions = {[key: string]: ConfigValue};
  export type SyntheticCreateWebLoginTokenResponseToken = string;
  export type SyntheticUpdateEnvironmentInputAirflowConfigurationOptions = {[key: string]: ConfigValue};
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the Amazon MWAA environment. For example, arn:aws:airflow:us-east-1:123456789012:environment/MyMWAAEnvironment.
     */
    ResourceArn: EnvironmentArn;
    /**
     * The key-value tag pairs you want to associate to your environment. For example, "Environment": "Staging". To learn more, see Tagging AWS resources.
     */
    Tags: TagMap;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type Unit = "Seconds"|"Microseconds"|"Milliseconds"|"Bytes"|"Kilobytes"|"Megabytes"|"Gigabytes"|"Terabytes"|"Bits"|"Kilobits"|"Megabits"|"Gigabits"|"Terabits"|"Percent"|"Count"|"Bytes/Second"|"Kilobytes/Second"|"Megabytes/Second"|"Gigabytes/Second"|"Terabytes/Second"|"Bits/Second"|"Kilobits/Second"|"Megabits/Second"|"Gigabits/Second"|"Terabits/Second"|"Count/Second"|"None"|string;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the Amazon MWAA environment. For example, arn:aws:airflow:us-east-1:123456789012:environment/MyMWAAEnvironment.
     */
    ResourceArn: EnvironmentArn;
    /**
     * The key-value tag pair you want to remove. For example, "Environment": "Staging". 
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export type UpdateCreatedAt = Date;
  export interface UpdateEnvironmentInput {
    /**
     * A list of key-value pairs containing the Apache Airflow configuration options you want to attach to your environment. To learn more, see Apache Airflow configuration options.
     */
    AirflowConfigurationOptions?: SyntheticUpdateEnvironmentInputAirflowConfigurationOptions;
    /**
     * The Apache Airflow version for your environment. For example, v1.10.12. If no value is specified, defaults to the latest version. Valid values: v1.10.12.
     */
    AirflowVersion?: AirflowVersion;
    /**
     * The relative path to the DAGs folder on your Amazon S3 bucket. For example, dags. To learn more, see Adding or updating DAGs.
     */
    DagS3Path?: RelativePath;
    /**
     * The environment class type. Valid values: mw1.small, mw1.medium, mw1.large. To learn more, see Amazon MWAA environment class.
     */
    EnvironmentClass?: EnvironmentClass;
    /**
     * The Amazon Resource Name (ARN) of the execution role in IAM that allows MWAA to access AWS resources in your environment. For example, arn:aws:iam::123456789:role/my-execution-role. To learn more, see Amazon MWAA Execution role.
     */
    ExecutionRoleArn?: IamRoleArn;
    /**
     * Defines the Apache Airflow logs to send to CloudWatch Logs: DagProcessingLogs, SchedulerLogs, TaskLogs, WebserverLogs, WorkerLogs.
     */
    LoggingConfiguration?: LoggingConfigurationInput;
    /**
     * The maximum number of workers that you want to run in your environment. MWAA scales the number of Apache Airflow workers up to the number you specify in the MaxWorkers field. For example, 20. When there are no more tasks running, and no more in the queue, MWAA disposes of the extra workers leaving the one worker that is included with your environment, or the number you specify in MinWorkers.
     */
    MaxWorkers?: MaxWorkers;
    /**
     * The minimum number of workers that you want to run in your environment. MWAA scales the number of Apache Airflow workers up to the number you specify in the MaxWorkers field. When there are no more tasks running, and no more in the queue, MWAA disposes of the extra workers leaving the worker count you specify in the MinWorkers field. For example, 2.
     */
    MinWorkers?: MinWorkers;
    /**
     * The name of your Amazon MWAA environment. For example, MyMWAAEnvironment.
     */
    Name: EnvironmentName;
    /**
     * The VPC networking components used to secure and enable network traffic between the AWS resources for your environment. To learn more, see About networking on Amazon MWAA.
     */
    NetworkConfiguration?: UpdateNetworkConfigurationInput;
    /**
     * The version of the plugins.zip file on your Amazon S3 bucket. A version must be specified each time a plugins.zip file is updated. To learn more, see How S3 Versioning works.
     */
    PluginsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the plugins.zip file on your Amazon S3 bucket. For example, plugins.zip. If specified, then the plugins.zip version is required. To learn more, see Installing custom plugins.
     */
    PluginsS3Path?: RelativePath;
    /**
     * The version of the requirements.txt file on your Amazon S3 bucket. A version must be specified each time a requirements.txt file is updated. To learn more, see How S3 Versioning works.
     */
    RequirementsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the requirements.txt file on your Amazon S3 bucket. For example, requirements.txt. If specified, then a file version is required. To learn more, see Installing Python dependencies.
     */
    RequirementsS3Path?: RelativePath;
    /**
     * The number of Apache Airflow schedulers to run in your Amazon MWAA environment.
     */
    Schedulers?: Schedulers;
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket where your DAG code and supporting files are stored. For example, arn:aws:s3:::my-airflow-bucket-unique-name. To learn more, see Create an Amazon S3 bucket for Amazon MWAA.
     */
    SourceBucketArn?: S3BucketArn;
    /**
     * The Apache Airflow Web server access mode. To learn more, see Apache Airflow access modes.
     */
    WebserverAccessMode?: WebserverAccessMode;
    /**
     * The day and time of the week to start weekly maintenance updates of your environment in the following format: DAY:HH:MM. For example: TUE:03:30. You can specify a start time in 30 minute increments only. Supported input includes the following:   MON|TUE|WED|THU|FRI|SAT|SUN:([01]\\d|2[0-3]):(00|30)  
     */
    WeeklyMaintenanceWindowStart?: WeeklyMaintenanceWindowStart;
  }
  export interface UpdateEnvironmentOutput {
    /**
     * The Amazon Resource Name (ARN) of the Amazon MWAA environment. For example, arn:aws:airflow:us-east-1:123456789012:environment/MyMWAAEnvironment.
     */
    Arn?: EnvironmentArn;
  }
  export interface UpdateError {
    /**
     * The error code that corresponds to the error with the last update.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message that corresponds to the error code.
     */
    ErrorMessage?: ErrorMessage;
  }
  export interface UpdateNetworkConfigurationInput {
    /**
     * A list of 1 or more security group IDs. Accepts up to 5 security group IDs. A security group must be attached to the same VPC as the subnets. To learn more, see Security in your VPC on Amazon MWAA.
     */
    SecurityGroupIds: SecurityGroupList;
  }
  export type UpdateStatus = "SUCCESS"|"PENDING"|"FAILED"|string;
  export type WebserverAccessMode = "PRIVATE_ONLY"|"PUBLIC_ONLY"|string;
  export type WebserverUrl = string;
  export type WeeklyMaintenanceWindowStart = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-07-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the MWAA client.
   */
  export import Types = MWAA;
}
export = MWAA;
