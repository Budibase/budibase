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
   * Creates a CLI token for the Airflow CLI. To learn more, see Creating an Apache Airflow CLI token.
   */
  createCliToken(params: MWAA.Types.CreateCliTokenRequest, callback?: (err: AWSError, data: MWAA.Types.CreateCliTokenResponse) => void): Request<MWAA.Types.CreateCliTokenResponse, AWSError>;
  /**
   * Creates a CLI token for the Airflow CLI. To learn more, see Creating an Apache Airflow CLI token.
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
   * Creates a web login token for the Airflow Web UI. To learn more, see Creating an Apache Airflow web login token.
   */
  createWebLoginToken(params: MWAA.Types.CreateWebLoginTokenRequest, callback?: (err: AWSError, data: MWAA.Types.CreateWebLoginTokenResponse) => void): Request<MWAA.Types.CreateWebLoginTokenResponse, AWSError>;
  /**
   * Creates a web login token for the Airflow Web UI. To learn more, see Creating an Apache Airflow web login token.
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
   * Describes an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
   */
  getEnvironment(params: MWAA.Types.GetEnvironmentInput, callback?: (err: AWSError, data: MWAA.Types.GetEnvironmentOutput) => void): Request<MWAA.Types.GetEnvironmentOutput, AWSError>;
  /**
   * Describes an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
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
   *  Internal only. Publishes environment health metrics to Amazon CloudWatch.
   */
  publishMetrics(params: MWAA.Types.PublishMetricsInput, callback?: (err: AWSError, data: MWAA.Types.PublishMetricsOutput) => void): Request<MWAA.Types.PublishMetricsOutput, AWSError>;
  /**
   *  Internal only. Publishes environment health metrics to Amazon CloudWatch.
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
     * The name of the Amazon MWAA environment. For example, MyMWAAEnvironment.
     */
    Name: EnvironmentName;
  }
  export interface CreateCliTokenResponse {
    /**
     * An Airflow CLI login token.
     */
    CliToken?: Token;
    /**
     * The Airflow web server hostname for the environment.
     */
    WebServerHostname?: Hostname;
  }
  export interface CreateEnvironmentInput {
    /**
     * A list of key-value pairs containing the Apache Airflow configuration options you want to attach to your environment. For more information, see Apache Airflow configuration options.
     */
    AirflowConfigurationOptions?: AirflowConfigurationOptions;
    /**
     * The Apache Airflow version for your environment. If no value is specified, it defaults to the latest version. Valid values: 1.10.12, 2.0.2, 2.2.2, 2.4.3, and 2.5.1. For more information, see Apache Airflow versions on Amazon Managed Workflows for Apache Airflow (MWAA).
     */
    AirflowVersion?: AirflowVersion;
    /**
     * The relative path to the DAGs folder on your Amazon S3 bucket. For example, dags. For more information, see Adding or updating DAGs.
     */
    DagS3Path: RelativePath;
    /**
     * The environment class type. Valid values: mw1.small, mw1.medium, mw1.large. For more information, see Amazon MWAA environment class.
     */
    EnvironmentClass?: EnvironmentClass;
    /**
     * The Amazon Resource Name (ARN) of the execution role for your environment. An execution role is an Amazon Web Services Identity and Access Management (IAM) role that grants MWAA permission to access Amazon Web Services services and resources used by your environment. For example, arn:aws:iam::123456789:role/my-execution-role. For more information, see Amazon MWAA Execution role.
     */
    ExecutionRoleArn: IamRoleArn;
    /**
     * The Amazon Web Services Key Management Service (KMS) key to encrypt the data in your environment. You can use an Amazon Web Services owned CMK, or a Customer managed CMK (advanced). For more information, see Create an Amazon MWAA environment.
     */
    KmsKey?: KmsKey;
    /**
     * Defines the Apache Airflow logs to send to CloudWatch Logs.
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
     * The VPC networking components used to secure and enable network traffic between the Amazon Web Services resources for your environment. For more information, see About networking on Amazon MWAA.
     */
    NetworkConfiguration: NetworkConfiguration;
    /**
     * The version of the plugins.zip file on your Amazon S3 bucket. You must specify a version each time a plugins.zip file is updated. For more information, see How S3 Versioning works.
     */
    PluginsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the plugins.zip file on your Amazon S3 bucket. For example, plugins.zip. If specified, then the plugins.zip version is required. For more information, see Installing custom plugins.
     */
    PluginsS3Path?: RelativePath;
    /**
     * The version of the requirements.txt file on your Amazon S3 bucket. You must specify a version each time a requirements.txt file is updated. For more information, see How S3 Versioning works.
     */
    RequirementsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the requirements.txt file on your Amazon S3 bucket. For example, requirements.txt. If specified, then a version is required. For more information, see Installing Python dependencies.
     */
    RequirementsS3Path?: RelativePath;
    /**
     * The number of Apache Airflow schedulers to run in your environment. Valid values:   v2 - Accepts between 2 to 5. Defaults to 2.   v1 - Accepts 1.  
     */
    Schedulers?: Schedulers;
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket where your DAG code and supporting files are stored. For example, arn:aws:s3:::my-airflow-bucket-unique-name. For more information, see Create an Amazon S3 bucket for Amazon MWAA.
     */
    SourceBucketArn: S3BucketArn;
    /**
     * The version of the startup shell script in your Amazon S3 bucket. You must specify the version ID that Amazon S3 assigns to the file every time you update the script.   Version IDs are Unicode, UTF-8 encoded, URL-ready, opaque strings that are no more than 1,024 bytes long. The following is an example:   3sL4kqtJlcpXroDTDmJ+rmSpXd3dIbrHY+MTRCxf3vjVBH40Nr8X8gdRQBpUMLUo   For more information, see Using a startup script. 
     */
    StartupScriptS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the startup shell script in your Amazon S3 bucket. For example, s3://mwaa-environment/startup.sh.  Amazon MWAA runs the script as your environment starts, and before running the Apache Airflow process. You can use this script to install dependencies, modify Apache Airflow configuration options, and set environment variables. For more information, see Using a startup script. 
     */
    StartupScriptS3Path?: RelativePath;
    /**
     * The key-value tag pairs you want to associate to your environment. For example, "Environment": "Staging". For more information, see Tagging Amazon Web Services resources.
     */
    Tags?: TagMap;
    /**
     * The Apache Airflow Web server access mode. For more information, see Apache Airflow access modes.
     */
    WebserverAccessMode?: WebserverAccessMode;
    /**
     * The day and time of the week in Coordinated Universal Time (UTC) 24-hour standard time to start weekly maintenance updates of your environment in the following format: DAY:HH:MM. For example: TUE:03:30. You can specify a start time in 30 minute increments only.
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
     * The name of the Amazon MWAA environment. For example, MyMWAAEnvironment.
     */
    Name: EnvironmentName;
  }
  export interface CreateWebLoginTokenResponse {
    /**
     * The Airflow web server hostname for the environment.
     */
    WebServerHostname?: Hostname;
    /**
     * An Airflow web server login token.
     */
    WebToken?: Token;
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
     *  Internal only. The name of the dimension.
     */
    Name: String;
    /**
     *  Internal only. The value of the dimension.
     */
    Value: String;
  }
  export type Dimensions = Dimension[];
  export type Double = number;
  export interface Environment {
    /**
     * A list of key-value pairs containing the Apache Airflow configuration options attached to your environment. For more information, see Apache Airflow configuration options.
     */
    AirflowConfigurationOptions?: AirflowConfigurationOptions;
    /**
     * The Apache Airflow version on your environment. Valid values: 1.10.12, 2.0.2, 2.2.2, 2.4.3, and 2.5.1.
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
     * The relative path to the DAGs folder in your Amazon S3 bucket. For example, s3://mwaa-environment/dags. For more information, see Adding or updating DAGs.
     */
    DagS3Path?: RelativePath;
    /**
     * The environment class type. Valid values: mw1.small, mw1.medium, mw1.large. For more information, see Amazon MWAA environment class.
     */
    EnvironmentClass?: EnvironmentClass;
    /**
     * The Amazon Resource Name (ARN) of the execution role in IAM that allows MWAA to access Amazon Web Services resources in your environment. For example, arn:aws:iam::123456789:role/my-execution-role. For more information, see Amazon MWAA Execution role.
     */
    ExecutionRoleArn?: IamRoleArn;
    /**
     * The Amazon Web Services Key Management Service (KMS) encryption key used to encrypt the data in your environment.
     */
    KmsKey?: KmsKey;
    /**
     * The status of the last update on the environment.
     */
    LastUpdate?: LastUpdate;
    /**
     * The Apache Airflow logs published to CloudWatch Logs.
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
    /**
     * Describes the VPC networking components used to secure and enable network traffic between the Amazon Web Services resources for your environment. For more information, see About networking on Amazon MWAA.
     */
    NetworkConfiguration?: NetworkConfiguration;
    /**
     * The version of the plugins.zip file in your Amazon S3 bucket. You must specify the version ID that Amazon S3 assigns to the file.  Version IDs are Unicode, UTF-8 encoded, URL-ready, opaque strings that are no more than 1,024 bytes long. The following is an example:   3sL4kqtJlcpXroDTDmJ+rmSpXd3dIbrHY+MTRCxf3vjVBH40Nr8X8gdRQBpUMLUo  For more information, see Installing custom plugins.
     */
    PluginsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the file in your Amazon S3 bucket. For example, s3://mwaa-environment/plugins.zip. For more information, see Installing custom plugins.
     */
    PluginsS3Path?: RelativePath;
    /**
     * The version of the requirements.txt  file on your Amazon S3 bucket. You must specify the version ID that Amazon S3 assigns to the file.  Version IDs are Unicode, UTF-8 encoded, URL-ready, opaque strings that are no more than 1,024 bytes long. The following is an example:   3sL4kqtJlcpXroDTDmJ+rmSpXd3dIbrHY+MTRCxf3vjVBH40Nr8X8gdRQBpUMLUo   For more information, see Installing Python dependencies. 
     */
    RequirementsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the requirements.txt file in your Amazon S3 bucket. For example, s3://mwaa-environment/requirements.txt. For more information, see Installing Python dependencies.
     */
    RequirementsS3Path?: RelativePath;
    /**
     * The number of Apache Airflow schedulers that run in your Amazon MWAA environment.
     */
    Schedulers?: Schedulers;
    /**
     * The Amazon Resource Name (ARN) for the service-linked role of the environment. For more information, see Amazon MWAA Service-linked role.
     */
    ServiceRoleArn?: IamRoleArn;
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket where your DAG code and supporting files are stored. For example, arn:aws:s3:::my-airflow-bucket-unique-name. For more information, see Create an Amazon S3 bucket for Amazon MWAA.
     */
    SourceBucketArn?: S3BucketArn;
    /**
     * The version of the startup shell script in your Amazon S3 bucket. You must specify the version ID that Amazon S3 assigns to the file.  Version IDs are Unicode, UTF-8 encoded, URL-ready, opaque strings that are no more than 1,024 bytes long. The following is an example:   3sL4kqtJlcpXroDTDmJ+rmSpXd3dIbrHY+MTRCxf3vjVBH40Nr8X8gdRQBpUMLUo   For more information, see Using a startup script. 
     */
    StartupScriptS3ObjectVersion?: String;
    /**
     * The relative path to the startup shell script in your Amazon S3 bucket. For example, s3://mwaa-environment/startup.sh.  Amazon MWAA runs the script as your environment starts, and before running the Apache Airflow process. You can use this script to install dependencies, modify Apache Airflow configuration options, and set environment variables. For more information, see Using a startup script. 
     */
    StartupScriptS3Path?: String;
    /**
     * The status of the Amazon MWAA environment. Valid values:    CREATING - Indicates the request to create the environment is in progress.    CREATING_SNAPSHOT - Indicates the request to update environment details, or upgrade the environment version, is in progress and Amazon MWAA is creating a storage volume snapshot of the Amazon RDS database cluster associated with the environment. A database snapshot is a backup created at a specific point in time. Amazon MWAA uses snapshots to recover environment metadata if the process to update or upgrade an environment fails.    CREATE_FAILED - Indicates the request to create the environment failed, and the environment could not be created.    AVAILABLE - Indicates the request was successful and the environment is ready to use.    UPDATING - Indicates the request to update the environment is in progress.    ROLLING_BACK - Indicates the request to update environment details, or upgrade the environment version, failed and Amazon MWAA is restoring the environment using the latest storage volume snapshot.    DELETING - Indicates the request to delete the environment is in progress.    DELETED - Indicates the request to delete the environment is complete, and the environment has been deleted.    UNAVAILABLE - Indicates the request failed, but the environment was unable to rollback and is not in a stable state.    UPDATE_FAILED - Indicates the request to update the environment failed, and the environment has rolled back successfully and is ready to use.   We recommend reviewing our troubleshooting guide for a list of common errors and their solutions. For more information, see Amazon MWAA troubleshooting.
     */
    Status?: EnvironmentStatus;
    /**
     * The key-value tag pairs associated to your environment. For example, "Environment": "Staging". For more information, see Tagging Amazon Web Services resources.
     */
    Tags?: TagMap;
    /**
     * The Apache Airflow Web server access mode. For more information, see Apache Airflow access modes.
     */
    WebserverAccessMode?: WebserverAccessMode;
    /**
     * The Apache Airflow Web server host name for the Amazon MWAA environment. For more information, see Accessing the Apache Airflow UI.
     */
    WebserverUrl?: WebserverUrl;
    /**
     * The day and time of the week in Coordinated Universal Time (UTC) 24-hour standard time that weekly maintenance updates are scheduled. For example: TUE:03:30.
     */
    WeeklyMaintenanceWindowStart?: WeeklyMaintenanceWindowStart;
  }
  export type EnvironmentArn = string;
  export type EnvironmentClass = string;
  export type EnvironmentList = EnvironmentName[];
  export type EnvironmentName = string;
  export type EnvironmentStatus = "CREATING"|"CREATE_FAILED"|"AVAILABLE"|"UPDATING"|"DELETING"|"DELETED"|"UNAVAILABLE"|"UPDATE_FAILED"|"ROLLING_BACK"|"CREATING_SNAPSHOT"|string;
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
     * The source of the last update to the environment. Includes internal processes by Amazon MWAA, such as an environment maintenance update.
     */
    Source?: UpdateSource;
    /**
     * The status of the last update on the environment.
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
     * Returns a list of Amazon MWAA environments.
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
     * The key-value tag pairs associated to your environment. For more information, see Tagging Amazon Web Services resources.
     */
    Tags?: TagMap;
  }
  export interface LoggingConfiguration {
    /**
     * The Airflow DAG processing logs published to CloudWatch Logs and the log level.
     */
    DagProcessingLogs?: ModuleLoggingConfiguration;
    /**
     * The Airflow scheduler logs published to CloudWatch Logs and the log level.
     */
    SchedulerLogs?: ModuleLoggingConfiguration;
    /**
     * The Airflow task logs published to CloudWatch Logs and the log level.
     */
    TaskLogs?: ModuleLoggingConfiguration;
    /**
     * The Airflow web server logs published to CloudWatch Logs and the log level.
     */
    WebserverLogs?: ModuleLoggingConfiguration;
    /**
     * The Airflow worker logs published to CloudWatch Logs and the log level.
     */
    WorkerLogs?: ModuleLoggingConfiguration;
  }
  export interface LoggingConfigurationInput {
    /**
     * Publishes Airflow DAG processing logs to CloudWatch Logs.
     */
    DagProcessingLogs?: ModuleLoggingConfigurationInput;
    /**
     * Publishes Airflow scheduler logs to CloudWatch Logs.
     */
    SchedulerLogs?: ModuleLoggingConfigurationInput;
    /**
     * Publishes Airflow task logs to CloudWatch Logs.
     */
    TaskLogs?: ModuleLoggingConfigurationInput;
    /**
     * Publishes Airflow web server logs to CloudWatch Logs.
     */
    WebserverLogs?: ModuleLoggingConfigurationInput;
    /**
     * Publishes Airflow worker logs to CloudWatch Logs.
     */
    WorkerLogs?: ModuleLoggingConfigurationInput;
  }
  export type LoggingEnabled = boolean;
  export type LoggingLevel = "CRITICAL"|"ERROR"|"WARNING"|"INFO"|"DEBUG"|string;
  export type MaxWorkers = number;
  export type MetricData = MetricDatum[];
  export interface MetricDatum {
    /**
     *  Internal only. The dimensions associated with the metric.
     */
    Dimensions?: Dimensions;
    /**
     *  Internal only. The name of the metric.
     */
    MetricName: String;
    /**
     *  Internal only. The statistical values for the metric.
     */
    StatisticValues?: StatisticSet;
    /**
     *  Internal only. The time the metric data was received.
     */
    Timestamp: Timestamp;
    /**
     *  Internal only. The unit used to store the metric.
     */
    Unit?: Unit;
    /**
     *  Internal only. The value for the metric.
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
     * Indicates whether the Apache Airflow log type (e.g. DagProcessingLogs) is enabled.
     */
    Enabled?: LoggingEnabled;
    /**
     * The Apache Airflow log level for the log type (e.g. DagProcessingLogs). 
     */
    LogLevel?: LoggingLevel;
  }
  export interface ModuleLoggingConfigurationInput {
    /**
     * Indicates whether to enable the Apache Airflow log type (e.g. DagProcessingLogs).
     */
    Enabled: LoggingEnabled;
    /**
     * Defines the Apache Airflow log level (e.g. INFO) to send to CloudWatch Logs.
     */
    LogLevel: LoggingLevel;
  }
  export interface NetworkConfiguration {
    /**
     * A list of security group IDs. For more information, see Security in your VPC on Amazon MWAA.
     */
    SecurityGroupIds?: SecurityGroupList;
    /**
     * A list of subnet IDs. For more information, see About networking on Amazon MWAA.
     */
    SubnetIds?: SubnetList;
  }
  export type NextToken = string;
  export interface PublishMetricsInput {
    /**
     *  Internal only. The name of the environment.
     */
    EnvironmentName: EnvironmentName;
    /**
     *  Internal only. Publishes metrics to Amazon CloudWatch. To learn more about the metrics published to Amazon CloudWatch, see Amazon MWAA performance metrics in Amazon CloudWatch.
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
     *  Internal only. The maximum value of the sample set.
     */
    Maximum?: Double;
    /**
     *  Internal only. The minimum value of the sample set.
     */
    Minimum?: Double;
    /**
     *  Internal only. The number of samples used for the statistic set.
     */
    SampleCount?: Integer;
    /**
     *  Internal only. The sum of values for the sample set.
     */
    Sum?: Double;
  }
  export type String = string;
  export type SubnetId = string;
  export type SubnetList = SubnetId[];
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the Amazon MWAA environment. For example, arn:aws:airflow:us-east-1:123456789012:environment/MyMWAAEnvironment.
     */
    ResourceArn: EnvironmentArn;
    /**
     * The key-value tag pairs you want to associate to your environment. For example, "Environment": "Staging". For more information, see Tagging Amazon Web Services resources.
     */
    Tags: TagMap;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type Token = string;
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
     * A list of key-value pairs containing the Apache Airflow configuration options you want to attach to your environment. For more information, see Apache Airflow configuration options.
     */
    AirflowConfigurationOptions?: AirflowConfigurationOptions;
    /**
     * The Apache Airflow version for your environment. To upgrade your environment, specify a newer version of Apache Airflow supported by Amazon MWAA. Before you upgrade an environment, make sure your requirements, DAGs, plugins, and other resources used in your workflows are compatible with the new Apache Airflow version. For more information about updating your resources, see Upgrading an Amazon MWAA environment. Valid values: 1.10.12, 2.0.2, 2.2.2, 2.4.3, and 2.5.1.
     */
    AirflowVersion?: AirflowVersion;
    /**
     * The relative path to the DAGs folder on your Amazon S3 bucket. For example, dags. For more information, see Adding or updating DAGs.
     */
    DagS3Path?: RelativePath;
    /**
     * The environment class type. Valid values: mw1.small, mw1.medium, mw1.large. For more information, see Amazon MWAA environment class.
     */
    EnvironmentClass?: EnvironmentClass;
    /**
     * The Amazon Resource Name (ARN) of the execution role in IAM that allows MWAA to access Amazon Web Services resources in your environment. For example, arn:aws:iam::123456789:role/my-execution-role. For more information, see Amazon MWAA Execution role.
     */
    ExecutionRoleArn?: IamRoleArn;
    /**
     * The Apache Airflow log types to send to CloudWatch Logs.
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
     * The VPC networking components used to secure and enable network traffic between the Amazon Web Services resources for your environment. For more information, see About networking on Amazon MWAA.
     */
    NetworkConfiguration?: UpdateNetworkConfigurationInput;
    /**
     * The version of the plugins.zip file on your Amazon S3 bucket. You must specify a version each time a plugins.zip file is updated. For more information, see How S3 Versioning works.
     */
    PluginsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the plugins.zip file on your Amazon S3 bucket. For example, plugins.zip. If specified, then the plugins.zip version is required. For more information, see Installing custom plugins.
     */
    PluginsS3Path?: RelativePath;
    /**
     * The version of the requirements.txt file on your Amazon S3 bucket. You must specify a version each time a requirements.txt file is updated. For more information, see How S3 Versioning works.
     */
    RequirementsS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the requirements.txt file on your Amazon S3 bucket. For example, requirements.txt. If specified, then a file version is required. For more information, see Installing Python dependencies.
     */
    RequirementsS3Path?: RelativePath;
    /**
     * The number of Apache Airflow schedulers to run in your Amazon MWAA environment.
     */
    Schedulers?: Schedulers;
    /**
     * The Amazon Resource Name (ARN) of the Amazon S3 bucket where your DAG code and supporting files are stored. For example, arn:aws:s3:::my-airflow-bucket-unique-name. For more information, see Create an Amazon S3 bucket for Amazon MWAA.
     */
    SourceBucketArn?: S3BucketArn;
    /**
     *  The version of the startup shell script in your Amazon S3 bucket. You must specify the version ID that Amazon S3 assigns to the file every time you update the script.   Version IDs are Unicode, UTF-8 encoded, URL-ready, opaque strings that are no more than 1,024 bytes long. The following is an example:   3sL4kqtJlcpXroDTDmJ+rmSpXd3dIbrHY+MTRCxf3vjVBH40Nr8X8gdRQBpUMLUo   For more information, see Using a startup script. 
     */
    StartupScriptS3ObjectVersion?: S3ObjectVersion;
    /**
     * The relative path to the startup shell script in your Amazon S3 bucket. For example, s3://mwaa-environment/startup.sh.  Amazon MWAA runs the script as your environment starts, and before running the Apache Airflow process. You can use this script to install dependencies, modify Apache Airflow configuration options, and set environment variables. For more information, see Using a startup script. 
     */
    StartupScriptS3Path?: RelativePath;
    /**
     * The Apache Airflow Web server access mode. For more information, see Apache Airflow access modes.
     */
    WebserverAccessMode?: WebserverAccessMode;
    /**
     * The day and time of the week in Coordinated Universal Time (UTC) 24-hour standard time to start weekly maintenance updates of your environment in the following format: DAY:HH:MM. For example: TUE:03:30. You can specify a start time in 30 minute increments only.
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
     * A list of security group IDs. A security group must be attached to the same VPC as the subnets. For more information, see Security in your VPC on Amazon MWAA.
     */
    SecurityGroupIds: SecurityGroupList;
  }
  export type UpdateSource = string;
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
