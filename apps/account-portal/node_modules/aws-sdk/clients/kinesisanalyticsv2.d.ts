import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class KinesisAnalyticsV2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: KinesisAnalyticsV2.Types.ClientConfiguration)
  config: Config & KinesisAnalyticsV2.Types.ClientConfiguration;
  /**
   * Adds an Amazon CloudWatch log stream to monitor application configuration errors.
   */
  addApplicationCloudWatchLoggingOption(params: KinesisAnalyticsV2.Types.AddApplicationCloudWatchLoggingOptionRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationCloudWatchLoggingOptionResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationCloudWatchLoggingOptionResponse, AWSError>;
  /**
   * Adds an Amazon CloudWatch log stream to monitor application configuration errors.
   */
  addApplicationCloudWatchLoggingOption(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationCloudWatchLoggingOptionResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationCloudWatchLoggingOptionResponse, AWSError>;
  /**
   *  Adds a streaming source to your SQL-based Kinesis Data Analytics application.  You can add a streaming source when you create an application, or you can use this operation to add a streaming source after you create an application. For more information, see CreateApplication. Any configuration update, including adding a streaming source using this operation, results in a new version of the application. You can use the DescribeApplication operation to find the current application version. 
   */
  addApplicationInput(params: KinesisAnalyticsV2.Types.AddApplicationInputRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationInputResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationInputResponse, AWSError>;
  /**
   *  Adds a streaming source to your SQL-based Kinesis Data Analytics application.  You can add a streaming source when you create an application, or you can use this operation to add a streaming source after you create an application. For more information, see CreateApplication. Any configuration update, including adding a streaming source using this operation, results in a new version of the application. You can use the DescribeApplication operation to find the current application version. 
   */
  addApplicationInput(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationInputResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationInputResponse, AWSError>;
  /**
   * Adds an InputProcessingConfiguration to a SQL-based Kinesis Data Analytics application. An input processor pre-processes records on the input stream before the application's SQL code executes. Currently, the only input processor available is Amazon Lambda.
   */
  addApplicationInputProcessingConfiguration(params: KinesisAnalyticsV2.Types.AddApplicationInputProcessingConfigurationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationInputProcessingConfigurationResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationInputProcessingConfigurationResponse, AWSError>;
  /**
   * Adds an InputProcessingConfiguration to a SQL-based Kinesis Data Analytics application. An input processor pre-processes records on the input stream before the application's SQL code executes. Currently, the only input processor available is Amazon Lambda.
   */
  addApplicationInputProcessingConfiguration(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationInputProcessingConfigurationResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationInputProcessingConfigurationResponse, AWSError>;
  /**
   * Adds an external destination to your SQL-based Kinesis Data Analytics application. If you want Kinesis Data Analytics to deliver data from an in-application stream within your application to an external destination (such as an Kinesis data stream, a Kinesis Data Firehose delivery stream, or an Amazon Lambda function), you add the relevant configuration to your application using this operation. You can configure one or more outputs for your application. Each output configuration maps an in-application stream and an external destination.  You can use one of the output configurations to deliver data from your in-application error stream to an external destination so that you can analyze the errors.   Any configuration update, including adding a streaming source using this operation, results in a new version of the application. You can use the DescribeApplication operation to find the current application version.
   */
  addApplicationOutput(params: KinesisAnalyticsV2.Types.AddApplicationOutputRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationOutputResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationOutputResponse, AWSError>;
  /**
   * Adds an external destination to your SQL-based Kinesis Data Analytics application. If you want Kinesis Data Analytics to deliver data from an in-application stream within your application to an external destination (such as an Kinesis data stream, a Kinesis Data Firehose delivery stream, or an Amazon Lambda function), you add the relevant configuration to your application using this operation. You can configure one or more outputs for your application. Each output configuration maps an in-application stream and an external destination.  You can use one of the output configurations to deliver data from your in-application error stream to an external destination so that you can analyze the errors.   Any configuration update, including adding a streaming source using this operation, results in a new version of the application. You can use the DescribeApplication operation to find the current application version.
   */
  addApplicationOutput(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationOutputResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationOutputResponse, AWSError>;
  /**
   * Adds a reference data source to an existing SQL-based Kinesis Data Analytics application. Kinesis Data Analytics reads reference data (that is, an Amazon S3 object) and creates an in-application table within your application. In the request, you provide the source (S3 bucket name and object key name), name of the in-application table to create, and the necessary mapping information that describes how data in an Amazon S3 object maps to columns in the resulting in-application table.
   */
  addApplicationReferenceDataSource(params: KinesisAnalyticsV2.Types.AddApplicationReferenceDataSourceRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationReferenceDataSourceResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationReferenceDataSourceResponse, AWSError>;
  /**
   * Adds a reference data source to an existing SQL-based Kinesis Data Analytics application. Kinesis Data Analytics reads reference data (that is, an Amazon S3 object) and creates an in-application table within your application. In the request, you provide the source (S3 bucket name and object key name), name of the in-application table to create, and the necessary mapping information that describes how data in an Amazon S3 object maps to columns in the resulting in-application table.
   */
  addApplicationReferenceDataSource(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationReferenceDataSourceResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationReferenceDataSourceResponse, AWSError>;
  /**
   * Adds a Virtual Private Cloud (VPC) configuration to the application. Applications can use VPCs to store and access resources securely. Note the following about VPC configurations for Kinesis Data Analytics applications:   VPC configurations are not supported for SQL applications.   When a VPC is added to a Kinesis Data Analytics application, the application can no longer be accessed from the Internet directly. To enable Internet access to the application, add an Internet gateway to your VPC.  
   */
  addApplicationVpcConfiguration(params: KinesisAnalyticsV2.Types.AddApplicationVpcConfigurationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationVpcConfigurationResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationVpcConfigurationResponse, AWSError>;
  /**
   * Adds a Virtual Private Cloud (VPC) configuration to the application. Applications can use VPCs to store and access resources securely. Note the following about VPC configurations for Kinesis Data Analytics applications:   VPC configurations are not supported for SQL applications.   When a VPC is added to a Kinesis Data Analytics application, the application can no longer be accessed from the Internet directly. To enable Internet access to the application, add an Internet gateway to your VPC.  
   */
  addApplicationVpcConfiguration(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.AddApplicationVpcConfigurationResponse) => void): Request<KinesisAnalyticsV2.Types.AddApplicationVpcConfigurationResponse, AWSError>;
  /**
   * Creates a Kinesis Data Analytics application. For information about creating a Kinesis Data Analytics application, see Creating an Application.
   */
  createApplication(params: KinesisAnalyticsV2.Types.CreateApplicationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.CreateApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates a Kinesis Data Analytics application. For information about creating a Kinesis Data Analytics application, see Creating an Application.
   */
  createApplication(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.CreateApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.CreateApplicationResponse, AWSError>;
  /**
   * Creates and returns a URL that you can use to connect to an application's extension. Currently, the only available extension is the Apache Flink dashboard. The IAM role or user used to call this API defines the permissions to access the extension. After the presigned URL is created, no additional permission is required to access this URL. IAM authorization policies for this API are also enforced for every HTTP request that attempts to connect to the extension.  You control the amount of time that the URL will be valid using the SessionExpirationDurationInSeconds parameter. If you do not provide this parameter, the returned URL is valid for twelve hours.  The URL that you get from a call to CreateApplicationPresignedUrl must be used within 3 minutes to be valid. If you first try to use the URL after the 3-minute limit expires, the service returns an HTTP 403 Forbidden error. 
   */
  createApplicationPresignedUrl(params: KinesisAnalyticsV2.Types.CreateApplicationPresignedUrlRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.CreateApplicationPresignedUrlResponse) => void): Request<KinesisAnalyticsV2.Types.CreateApplicationPresignedUrlResponse, AWSError>;
  /**
   * Creates and returns a URL that you can use to connect to an application's extension. Currently, the only available extension is the Apache Flink dashboard. The IAM role or user used to call this API defines the permissions to access the extension. After the presigned URL is created, no additional permission is required to access this URL. IAM authorization policies for this API are also enforced for every HTTP request that attempts to connect to the extension.  You control the amount of time that the URL will be valid using the SessionExpirationDurationInSeconds parameter. If you do not provide this parameter, the returned URL is valid for twelve hours.  The URL that you get from a call to CreateApplicationPresignedUrl must be used within 3 minutes to be valid. If you first try to use the URL after the 3-minute limit expires, the service returns an HTTP 403 Forbidden error. 
   */
  createApplicationPresignedUrl(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.CreateApplicationPresignedUrlResponse) => void): Request<KinesisAnalyticsV2.Types.CreateApplicationPresignedUrlResponse, AWSError>;
  /**
   * Creates a snapshot of the application's state data.
   */
  createApplicationSnapshot(params: KinesisAnalyticsV2.Types.CreateApplicationSnapshotRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.CreateApplicationSnapshotResponse) => void): Request<KinesisAnalyticsV2.Types.CreateApplicationSnapshotResponse, AWSError>;
  /**
   * Creates a snapshot of the application's state data.
   */
  createApplicationSnapshot(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.CreateApplicationSnapshotResponse) => void): Request<KinesisAnalyticsV2.Types.CreateApplicationSnapshotResponse, AWSError>;
  /**
   * Deletes the specified application. Kinesis Data Analytics halts application execution and deletes the application.
   */
  deleteApplication(params: KinesisAnalyticsV2.Types.DeleteApplicationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Deletes the specified application. Kinesis Data Analytics halts application execution and deletes the application.
   */
  deleteApplication(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationResponse, AWSError>;
  /**
   * Deletes an Amazon CloudWatch log stream from an Kinesis Data Analytics application. 
   */
  deleteApplicationCloudWatchLoggingOption(params: KinesisAnalyticsV2.Types.DeleteApplicationCloudWatchLoggingOptionRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationCloudWatchLoggingOptionResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationCloudWatchLoggingOptionResponse, AWSError>;
  /**
   * Deletes an Amazon CloudWatch log stream from an Kinesis Data Analytics application. 
   */
  deleteApplicationCloudWatchLoggingOption(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationCloudWatchLoggingOptionResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationCloudWatchLoggingOptionResponse, AWSError>;
  /**
   * Deletes an InputProcessingConfiguration from an input.
   */
  deleteApplicationInputProcessingConfiguration(params: KinesisAnalyticsV2.Types.DeleteApplicationInputProcessingConfigurationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationInputProcessingConfigurationResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationInputProcessingConfigurationResponse, AWSError>;
  /**
   * Deletes an InputProcessingConfiguration from an input.
   */
  deleteApplicationInputProcessingConfiguration(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationInputProcessingConfigurationResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationInputProcessingConfigurationResponse, AWSError>;
  /**
   * Deletes the output destination configuration from your SQL-based Kinesis Data Analytics application's configuration. Kinesis Data Analytics will no longer write data from the corresponding in-application stream to the external output destination.
   */
  deleteApplicationOutput(params: KinesisAnalyticsV2.Types.DeleteApplicationOutputRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationOutputResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationOutputResponse, AWSError>;
  /**
   * Deletes the output destination configuration from your SQL-based Kinesis Data Analytics application's configuration. Kinesis Data Analytics will no longer write data from the corresponding in-application stream to the external output destination.
   */
  deleteApplicationOutput(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationOutputResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationOutputResponse, AWSError>;
  /**
   * Deletes a reference data source configuration from the specified SQL-based Kinesis Data Analytics application's configuration. If the application is running, Kinesis Data Analytics immediately removes the in-application table that you created using the AddApplicationReferenceDataSource operation. 
   */
  deleteApplicationReferenceDataSource(params: KinesisAnalyticsV2.Types.DeleteApplicationReferenceDataSourceRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationReferenceDataSourceResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationReferenceDataSourceResponse, AWSError>;
  /**
   * Deletes a reference data source configuration from the specified SQL-based Kinesis Data Analytics application's configuration. If the application is running, Kinesis Data Analytics immediately removes the in-application table that you created using the AddApplicationReferenceDataSource operation. 
   */
  deleteApplicationReferenceDataSource(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationReferenceDataSourceResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationReferenceDataSourceResponse, AWSError>;
  /**
   * Deletes a snapshot of application state.
   */
  deleteApplicationSnapshot(params: KinesisAnalyticsV2.Types.DeleteApplicationSnapshotRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationSnapshotResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationSnapshotResponse, AWSError>;
  /**
   * Deletes a snapshot of application state.
   */
  deleteApplicationSnapshot(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationSnapshotResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationSnapshotResponse, AWSError>;
  /**
   * Removes a VPC configuration from a Kinesis Data Analytics application.
   */
  deleteApplicationVpcConfiguration(params: KinesisAnalyticsV2.Types.DeleteApplicationVpcConfigurationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationVpcConfigurationResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationVpcConfigurationResponse, AWSError>;
  /**
   * Removes a VPC configuration from a Kinesis Data Analytics application.
   */
  deleteApplicationVpcConfiguration(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DeleteApplicationVpcConfigurationResponse) => void): Request<KinesisAnalyticsV2.Types.DeleteApplicationVpcConfigurationResponse, AWSError>;
  /**
   * Returns information about a specific Kinesis Data Analytics application. If you want to retrieve a list of all applications in your account, use the ListApplications operation.
   */
  describeApplication(params: KinesisAnalyticsV2.Types.DescribeApplicationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DescribeApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.DescribeApplicationResponse, AWSError>;
  /**
   * Returns information about a specific Kinesis Data Analytics application. If you want to retrieve a list of all applications in your account, use the ListApplications operation.
   */
  describeApplication(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DescribeApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.DescribeApplicationResponse, AWSError>;
  /**
   * Returns information about a snapshot of application state data.
   */
  describeApplicationSnapshot(params: KinesisAnalyticsV2.Types.DescribeApplicationSnapshotRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DescribeApplicationSnapshotResponse) => void): Request<KinesisAnalyticsV2.Types.DescribeApplicationSnapshotResponse, AWSError>;
  /**
   * Returns information about a snapshot of application state data.
   */
  describeApplicationSnapshot(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DescribeApplicationSnapshotResponse) => void): Request<KinesisAnalyticsV2.Types.DescribeApplicationSnapshotResponse, AWSError>;
  /**
   * Provides a detailed description of a specified version of the application. To see a list of all the versions of an application, invoke the ListApplicationVersions operation.  This operation is supported only for Amazon Kinesis Data Analytics for Apache Flink. 
   */
  describeApplicationVersion(params: KinesisAnalyticsV2.Types.DescribeApplicationVersionRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DescribeApplicationVersionResponse) => void): Request<KinesisAnalyticsV2.Types.DescribeApplicationVersionResponse, AWSError>;
  /**
   * Provides a detailed description of a specified version of the application. To see a list of all the versions of an application, invoke the ListApplicationVersions operation.  This operation is supported only for Amazon Kinesis Data Analytics for Apache Flink. 
   */
  describeApplicationVersion(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DescribeApplicationVersionResponse) => void): Request<KinesisAnalyticsV2.Types.DescribeApplicationVersionResponse, AWSError>;
  /**
   * Infers a schema for a SQL-based Kinesis Data Analytics application by evaluating sample records on the specified streaming source (Kinesis data stream or Kinesis Data Firehose delivery stream) or Amazon S3 object. In the response, the operation returns the inferred schema and also the sample records that the operation used to infer the schema.  You can use the inferred schema when configuring a streaming source for your application. When you create an application using the Kinesis Data Analytics console, the console uses this operation to infer a schema and show it in the console user interface. 
   */
  discoverInputSchema(params: KinesisAnalyticsV2.Types.DiscoverInputSchemaRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DiscoverInputSchemaResponse) => void): Request<KinesisAnalyticsV2.Types.DiscoverInputSchemaResponse, AWSError>;
  /**
   * Infers a schema for a SQL-based Kinesis Data Analytics application by evaluating sample records on the specified streaming source (Kinesis data stream or Kinesis Data Firehose delivery stream) or Amazon S3 object. In the response, the operation returns the inferred schema and also the sample records that the operation used to infer the schema.  You can use the inferred schema when configuring a streaming source for your application. When you create an application using the Kinesis Data Analytics console, the console uses this operation to infer a schema and show it in the console user interface. 
   */
  discoverInputSchema(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.DiscoverInputSchemaResponse) => void): Request<KinesisAnalyticsV2.Types.DiscoverInputSchemaResponse, AWSError>;
  /**
   * Lists information about the current application snapshots.
   */
  listApplicationSnapshots(params: KinesisAnalyticsV2.Types.ListApplicationSnapshotsRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.ListApplicationSnapshotsResponse) => void): Request<KinesisAnalyticsV2.Types.ListApplicationSnapshotsResponse, AWSError>;
  /**
   * Lists information about the current application snapshots.
   */
  listApplicationSnapshots(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.ListApplicationSnapshotsResponse) => void): Request<KinesisAnalyticsV2.Types.ListApplicationSnapshotsResponse, AWSError>;
  /**
   * Lists all the versions for the specified application, including versions that were rolled back. The response also includes a summary of the configuration associated with each version. To get the complete description of a specific application version, invoke the DescribeApplicationVersion operation.  This operation is supported only for Amazon Kinesis Data Analytics for Apache Flink. 
   */
  listApplicationVersions(params: KinesisAnalyticsV2.Types.ListApplicationVersionsRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.ListApplicationVersionsResponse) => void): Request<KinesisAnalyticsV2.Types.ListApplicationVersionsResponse, AWSError>;
  /**
   * Lists all the versions for the specified application, including versions that were rolled back. The response also includes a summary of the configuration associated with each version. To get the complete description of a specific application version, invoke the DescribeApplicationVersion operation.  This operation is supported only for Amazon Kinesis Data Analytics for Apache Flink. 
   */
  listApplicationVersions(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.ListApplicationVersionsResponse) => void): Request<KinesisAnalyticsV2.Types.ListApplicationVersionsResponse, AWSError>;
  /**
   * Returns a list of Kinesis Data Analytics applications in your account. For each application, the response includes the application name, Amazon Resource Name (ARN), and status.  If you want detailed information about a specific application, use DescribeApplication.
   */
  listApplications(params: KinesisAnalyticsV2.Types.ListApplicationsRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.ListApplicationsResponse) => void): Request<KinesisAnalyticsV2.Types.ListApplicationsResponse, AWSError>;
  /**
   * Returns a list of Kinesis Data Analytics applications in your account. For each application, the response includes the application name, Amazon Resource Name (ARN), and status.  If you want detailed information about a specific application, use DescribeApplication.
   */
  listApplications(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.ListApplicationsResponse) => void): Request<KinesisAnalyticsV2.Types.ListApplicationsResponse, AWSError>;
  /**
   * Retrieves the list of key-value tags assigned to the application. For more information, see Using Tagging.
   */
  listTagsForResource(params: KinesisAnalyticsV2.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.ListTagsForResourceResponse) => void): Request<KinesisAnalyticsV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves the list of key-value tags assigned to the application. For more information, see Using Tagging.
   */
  listTagsForResource(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.ListTagsForResourceResponse) => void): Request<KinesisAnalyticsV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Reverts the application to the previous running version. You can roll back an application if you suspect it is stuck in a transient status.  You can roll back an application only if it is in the UPDATING or AUTOSCALING status. When you rollback an application, it loads state data from the last successful snapshot. If the application has no snapshots, Kinesis Data Analytics rejects the rollback request. This action is not supported for Kinesis Data Analytics for SQL applications.
   */
  rollbackApplication(params: KinesisAnalyticsV2.Types.RollbackApplicationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.RollbackApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.RollbackApplicationResponse, AWSError>;
  /**
   * Reverts the application to the previous running version. You can roll back an application if you suspect it is stuck in a transient status.  You can roll back an application only if it is in the UPDATING or AUTOSCALING status. When you rollback an application, it loads state data from the last successful snapshot. If the application has no snapshots, Kinesis Data Analytics rejects the rollback request. This action is not supported for Kinesis Data Analytics for SQL applications.
   */
  rollbackApplication(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.RollbackApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.RollbackApplicationResponse, AWSError>;
  /**
   * Starts the specified Kinesis Data Analytics application. After creating an application, you must exclusively call this operation to start your application.
   */
  startApplication(params: KinesisAnalyticsV2.Types.StartApplicationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.StartApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.StartApplicationResponse, AWSError>;
  /**
   * Starts the specified Kinesis Data Analytics application. After creating an application, you must exclusively call this operation to start your application.
   */
  startApplication(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.StartApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.StartApplicationResponse, AWSError>;
  /**
   * Stops the application from processing data. You can stop an application only if it is in the running status, unless you set the Force parameter to true. You can use the DescribeApplication operation to find the application status.  Kinesis Data Analytics takes a snapshot when the application is stopped, unless Force is set to true.
   */
  stopApplication(params: KinesisAnalyticsV2.Types.StopApplicationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.StopApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.StopApplicationResponse, AWSError>;
  /**
   * Stops the application from processing data. You can stop an application only if it is in the running status, unless you set the Force parameter to true. You can use the DescribeApplication operation to find the application status.  Kinesis Data Analytics takes a snapshot when the application is stopped, unless Force is set to true.
   */
  stopApplication(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.StopApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.StopApplicationResponse, AWSError>;
  /**
   * Adds one or more key-value tags to a Kinesis Data Analytics application. Note that the maximum number of application tags includes system tags. The maximum number of user-defined application tags is 50. For more information, see Using Tagging.
   */
  tagResource(params: KinesisAnalyticsV2.Types.TagResourceRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.TagResourceResponse) => void): Request<KinesisAnalyticsV2.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more key-value tags to a Kinesis Data Analytics application. Note that the maximum number of application tags includes system tags. The maximum number of user-defined application tags is 50. For more information, see Using Tagging.
   */
  tagResource(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.TagResourceResponse) => void): Request<KinesisAnalyticsV2.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a Kinesis Data Analytics application. For more information, see Using Tagging.
   */
  untagResource(params: KinesisAnalyticsV2.Types.UntagResourceRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.UntagResourceResponse) => void): Request<KinesisAnalyticsV2.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a Kinesis Data Analytics application. For more information, see Using Tagging.
   */
  untagResource(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.UntagResourceResponse) => void): Request<KinesisAnalyticsV2.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an existing Kinesis Data Analytics application. Using this operation, you can update application code, input configuration, and output configuration.  Kinesis Data Analytics updates the ApplicationVersionId each time you update your application.   You cannot update the RuntimeEnvironment of an existing application. If you need to update an application's RuntimeEnvironment, you must delete the application and create it again. 
   */
  updateApplication(params: KinesisAnalyticsV2.Types.UpdateApplicationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.UpdateApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates an existing Kinesis Data Analytics application. Using this operation, you can update application code, input configuration, and output configuration.  Kinesis Data Analytics updates the ApplicationVersionId each time you update your application.   You cannot update the RuntimeEnvironment of an existing application. If you need to update an application's RuntimeEnvironment, you must delete the application and create it again. 
   */
  updateApplication(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.UpdateApplicationResponse) => void): Request<KinesisAnalyticsV2.Types.UpdateApplicationResponse, AWSError>;
  /**
   * Updates the maintenance configuration of the Kinesis Data Analytics application.  You can invoke this operation on an application that is in one of the two following states: READY or RUNNING. If you invoke it when the application is in a state other than these two states, it throws a ResourceInUseException. The service makes use of the updated configuration the next time it schedules maintenance for the application. If you invoke this operation after the service schedules maintenance, the service will apply the configuration update the next time it schedules maintenance for the application. This means that you might not see the maintenance configuration update applied to the maintenance process that follows a successful invocation of this operation, but to the following maintenance process instead. To see the current maintenance configuration of your application, invoke the DescribeApplication operation. For information about application maintenance, see Kinesis Data Analytics for Apache Flink Maintenance.  This operation is supported only for Amazon Kinesis Data Analytics for Apache Flink. 
   */
  updateApplicationMaintenanceConfiguration(params: KinesisAnalyticsV2.Types.UpdateApplicationMaintenanceConfigurationRequest, callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.UpdateApplicationMaintenanceConfigurationResponse) => void): Request<KinesisAnalyticsV2.Types.UpdateApplicationMaintenanceConfigurationResponse, AWSError>;
  /**
   * Updates the maintenance configuration of the Kinesis Data Analytics application.  You can invoke this operation on an application that is in one of the two following states: READY or RUNNING. If you invoke it when the application is in a state other than these two states, it throws a ResourceInUseException. The service makes use of the updated configuration the next time it schedules maintenance for the application. If you invoke this operation after the service schedules maintenance, the service will apply the configuration update the next time it schedules maintenance for the application. This means that you might not see the maintenance configuration update applied to the maintenance process that follows a successful invocation of this operation, but to the following maintenance process instead. To see the current maintenance configuration of your application, invoke the DescribeApplication operation. For information about application maintenance, see Kinesis Data Analytics for Apache Flink Maintenance.  This operation is supported only for Amazon Kinesis Data Analytics for Apache Flink. 
   */
  updateApplicationMaintenanceConfiguration(callback?: (err: AWSError, data: KinesisAnalyticsV2.Types.UpdateApplicationMaintenanceConfigurationResponse) => void): Request<KinesisAnalyticsV2.Types.UpdateApplicationMaintenanceConfigurationResponse, AWSError>;
}
declare namespace KinesisAnalyticsV2 {
  export interface AddApplicationCloudWatchLoggingOptionRequest {
    /**
     * The Kinesis Data Analytics application name.
     */
    ApplicationName: ApplicationName;
    /**
     * The version ID of the Kinesis Data Analytics application. You must provide the CurrentApplicationVersionId or the ConditionalToken.You can retrieve the application version ID using DescribeApplication. For better concurrency support, use the ConditionalToken parameter instead of CurrentApplicationVersionId.
     */
    CurrentApplicationVersionId?: ApplicationVersionId;
    /**
     * Provides the Amazon CloudWatch log stream Amazon Resource Name (ARN). 
     */
    CloudWatchLoggingOption: CloudWatchLoggingOption;
    /**
     * A value you use to implement strong concurrency for application updates. You must provide the CurrentApplicationVersionId or the ConditionalToken. You get the application's current ConditionalToken using DescribeApplication. For better concurrency support, use the ConditionalToken parameter instead of CurrentApplicationVersionId.
     */
    ConditionalToken?: ConditionalToken;
  }
  export interface AddApplicationCloudWatchLoggingOptionResponse {
    /**
     * The application's ARN.
     */
    ApplicationARN?: ResourceARN;
    /**
     * The new version ID of the Kinesis Data Analytics application. Kinesis Data Analytics updates the ApplicationVersionId each time you change the CloudWatch logging options. 
     */
    ApplicationVersionId?: ApplicationVersionId;
    /**
     * The descriptions of the current CloudWatch logging options for the Kinesis Data Analytics application.
     */
    CloudWatchLoggingOptionDescriptions?: CloudWatchLoggingOptionDescriptions;
  }
  export interface AddApplicationInputProcessingConfigurationRequest {
    /**
     * The name of the application to which you want to add the input processing configuration.
     */
    ApplicationName: ApplicationName;
    /**
     * The version of the application to which you want to add the input processing configuration. You can use the DescribeApplication operation to get the current application version. If the version specified is not the current version, the ConcurrentModificationException is returned.
     */
    CurrentApplicationVersionId: ApplicationVersionId;
    /**
     * The ID of the input configuration to add the input processing configuration to. You can get a list of the input IDs for an application using the DescribeApplication operation.
     */
    InputId: Id;
    /**
     * The InputProcessingConfiguration to add to the application.
     */
    InputProcessingConfiguration: InputProcessingConfiguration;
  }
  export interface AddApplicationInputProcessingConfigurationResponse {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationARN?: ResourceARN;
    /**
     * Provides the current application version. 
     */
    ApplicationVersionId?: ApplicationVersionId;
    /**
     * The input ID that is associated with the application input. This is the ID that Kinesis Data Analytics assigns to each input configuration that you add to your application.
     */
    InputId?: Id;
    /**
     * The description of the preprocessor that executes on records in this input before the application's code is run.
     */
    InputProcessingConfigurationDescription?: InputProcessingConfigurationDescription;
  }
  export interface AddApplicationInputRequest {
    /**
     * The name of your existing application to which you want to add the streaming source.
     */
    ApplicationName: ApplicationName;
    /**
     * The current version of your application. You must provide the ApplicationVersionID or the ConditionalToken.You can use the DescribeApplication operation to find the current application version.
     */
    CurrentApplicationVersionId: ApplicationVersionId;
    /**
     * The Input to add.
     */
    Input: Input;
  }
  export interface AddApplicationInputResponse {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationARN?: ResourceARN;
    /**
     * Provides the current application version.
     */
    ApplicationVersionId?: ApplicationVersionId;
    /**
     * Describes the application input configuration. 
     */
    InputDescriptions?: InputDescriptions;
  }
  export interface AddApplicationOutputRequest {
    /**
     * The name of the application to which you want to add the output configuration.
     */
    ApplicationName: ApplicationName;
    /**
     * The version of the application to which you want to add the output configuration. You can use the DescribeApplication operation to get the current application version. If the version specified is not the current version, the ConcurrentModificationException is returned. 
     */
    CurrentApplicationVersionId: ApplicationVersionId;
    /**
     * An array of objects, each describing one output configuration. In the output configuration, you specify the name of an in-application stream, a destination (that is, a Kinesis data stream, a Kinesis Data Firehose delivery stream, or an Amazon Lambda function), and record the formation to use when writing to the destination.
     */
    Output: Output;
  }
  export interface AddApplicationOutputResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationARN?: ResourceARN;
    /**
     * The updated application version ID. Kinesis Data Analytics increments this ID when the application is updated.
     */
    ApplicationVersionId?: ApplicationVersionId;
    /**
     * Describes the application output configuration. For more information, see Configuring Application Output. 
     */
    OutputDescriptions?: OutputDescriptions;
  }
  export interface AddApplicationReferenceDataSourceRequest {
    /**
     * The name of an existing application.
     */
    ApplicationName: ApplicationName;
    /**
     * The version of the application for which you are adding the reference data source. You can use the DescribeApplication operation to get the current application version. If the version specified is not the current version, the ConcurrentModificationException is returned.
     */
    CurrentApplicationVersionId: ApplicationVersionId;
    /**
     * The reference data source can be an object in your Amazon S3 bucket. Kinesis Data Analytics reads the object and copies the data into the in-application table that is created. You provide an S3 bucket, object key name, and the resulting in-application table that is created. 
     */
    ReferenceDataSource: ReferenceDataSource;
  }
  export interface AddApplicationReferenceDataSourceResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationARN?: ResourceARN;
    /**
     * The updated application version ID. Kinesis Data Analytics increments this ID when the application is updated.
     */
    ApplicationVersionId?: ApplicationVersionId;
    /**
     * Describes reference data sources configured for the application. 
     */
    ReferenceDataSourceDescriptions?: ReferenceDataSourceDescriptions;
  }
  export interface AddApplicationVpcConfigurationRequest {
    /**
     * The name of an existing application.
     */
    ApplicationName: ApplicationName;
    /**
     * The version of the application to which you want to add the VPC configuration. You must provide the CurrentApplicationVersionId or the ConditionalToken. You can use the DescribeApplication operation to get the current application version. If the version specified is not the current version, the ConcurrentModificationException is returned. For better concurrency support, use the ConditionalToken parameter instead of CurrentApplicationVersionId.
     */
    CurrentApplicationVersionId?: ApplicationVersionId;
    /**
     * Description of the VPC to add to the application.
     */
    VpcConfiguration: VpcConfiguration;
    /**
     * A value you use to implement strong concurrency for application updates. You must provide the ApplicationVersionID or the ConditionalToken. You get the application's current ConditionalToken using DescribeApplication. For better concurrency support, use the ConditionalToken parameter instead of CurrentApplicationVersionId.
     */
    ConditionalToken?: ConditionalToken;
  }
  export interface AddApplicationVpcConfigurationResponse {
    /**
     * The ARN of the application.
     */
    ApplicationARN?: ResourceARN;
    /**
     * Provides the current application version. Kinesis Data Analytics updates the ApplicationVersionId each time you update the application.
     */
    ApplicationVersionId?: ApplicationVersionId;
    /**
     * The parameters of the new VPC configuration.
     */
    VpcConfigurationDescription?: VpcConfigurationDescription;
  }
  export interface ApplicationCodeConfiguration {
    /**
     * The location and type of the application code.
     */
    CodeContent?: CodeContent;
    /**
     * Specifies whether the code content is in text or zip format.
     */
    CodeContentType: CodeContentType;
  }
  export interface ApplicationCodeConfigurationDescription {
    /**
     * Specifies whether the code content is in text or zip format.
     */
    CodeContentType: CodeContentType;
    /**
     * Describes details about the location and format of the application code.
     */
    CodeContentDescription?: CodeContentDescription;
  }
  export interface ApplicationCodeConfigurationUpdate {
    /**
     * Describes updates to the code content type.
     */
    CodeContentTypeUpdate?: CodeContentType;
    /**
     * Describes updates to the code content of an application.
     */
    CodeContentUpdate?: CodeContentUpdate;
  }
  export interface ApplicationConfiguration {
    /**
     * The creation and update parameters for a SQL-based Kinesis Data Analytics application.
     */
    SqlApplicationConfiguration?: SqlApplicationConfiguration;
    /**
     * The creation and update parameters for a Flink-based Kinesis Data Analytics application.
     */
    FlinkApplicationConfiguration?: FlinkApplicationConfiguration;
    /**
     * Describes execution properties for a Flink-based Kinesis Data Analytics application.
     */
    EnvironmentProperties?: EnvironmentProperties;
    /**
     * The code location and type parameters for a Flink-based Kinesis Data Analytics application.
     */
    ApplicationCodeConfiguration?: ApplicationCodeConfiguration;
    /**
     * Describes whether snapshots are enabled for a Flink-based Kinesis Data Analytics application.
     */
    ApplicationSnapshotConfiguration?: ApplicationSnapshotConfiguration;
    /**
     * The array of descriptions of VPC configurations available to the application.
     */
    VpcConfigurations?: VpcConfigurations;
    /**
     * The configuration parameters for a Kinesis Data Analytics Studio notebook.
     */
    ZeppelinApplicationConfiguration?: ZeppelinApplicationConfiguration;
  }
  export interface ApplicationConfigurationDescription {
    /**
     * The details about inputs, outputs, and reference data sources for a SQL-based Kinesis Data Analytics application.
     */
    SqlApplicationConfigurationDescription?: SqlApplicationConfigurationDescription;
    /**
     * The details about the application code for a Flink-based Kinesis Data Analytics application.
     */
    ApplicationCodeConfigurationDescription?: ApplicationCodeConfigurationDescription;
    /**
     * The details about the starting properties for a Kinesis Data Analytics application.
     */
    RunConfigurationDescription?: RunConfigurationDescription;
    /**
     * The details about a Flink-based Kinesis Data Analytics application.
     */
    FlinkApplicationConfigurationDescription?: FlinkApplicationConfigurationDescription;
    /**
     * Describes execution properties for a Flink-based Kinesis Data Analytics application.
     */
    EnvironmentPropertyDescriptions?: EnvironmentPropertyDescriptions;
    /**
     * Describes whether snapshots are enabled for a Flink-based Kinesis Data Analytics application.
     */
    ApplicationSnapshotConfigurationDescription?: ApplicationSnapshotConfigurationDescription;
    /**
     * The array of descriptions of VPC configurations available to the application.
     */
    VpcConfigurationDescriptions?: VpcConfigurationDescriptions;
    /**
     * The configuration parameters for a Kinesis Data Analytics Studio notebook.
     */
    ZeppelinApplicationConfigurationDescription?: ZeppelinApplicationConfigurationDescription;
  }
  export interface ApplicationConfigurationUpdate {
    /**
     * Describes updates to a SQL-based Kinesis Data Analytics application's configuration.
     */
    SqlApplicationConfigurationUpdate?: SqlApplicationConfigurationUpdate;
    /**
     * Describes updates to an application's code configuration.
     */
    ApplicationCodeConfigurationUpdate?: ApplicationCodeConfigurationUpdate;
    /**
     * Describes updates to a Flink-based Kinesis Data Analytics application's configuration.
     */
    FlinkApplicationConfigurationUpdate?: FlinkApplicationConfigurationUpdate;
    /**
     * Describes updates to the environment properties for a Flink-based Kinesis Data Analytics application.
     */
    EnvironmentPropertyUpdates?: EnvironmentPropertyUpdates;
    /**
     * Describes whether snapshots are enabled for a Flink-based Kinesis Data Analytics application.
     */
    ApplicationSnapshotConfigurationUpdate?: ApplicationSnapshotConfigurationUpdate;
    /**
     * Updates to the array of descriptions of VPC configurations available to the application.
     */
    VpcConfigurationUpdates?: VpcConfigurationUpdates;
    /**
     * Updates to the configuration of a Kinesis Data Analytics Studio notebook.
     */
    ZeppelinApplicationConfigurationUpdate?: ZeppelinApplicationConfigurationUpdate;
  }
  export type ApplicationDescription = string;
  export interface ApplicationDetail {
    /**
     * The ARN of the application.
     */
    ApplicationARN: ResourceARN;
    /**
     * The description of the application.
     */
    ApplicationDescription?: ApplicationDescription;
    /**
     * The name of the application.
     */
    ApplicationName: ApplicationName;
    /**
     * The runtime environment for the application (SQL-1_0, FLINK-1_6, FLINK-1_8, or FLINK-1_11).
     */
    RuntimeEnvironment: RuntimeEnvironment;
    /**
     * Specifies the IAM role that the application uses to access external resources.
     */
    ServiceExecutionRole?: RoleARN;
    /**
     * The status of the application.
     */
    ApplicationStatus: ApplicationStatus;
    /**
     * Provides the current application version. Kinesis Data Analytics updates the ApplicationVersionId each time you update the application.
     */
    ApplicationVersionId: ApplicationVersionId;
    /**
     * The current timestamp when the application was created.
     */
    CreateTimestamp?: Timestamp;
    /**
     * The current timestamp when the application was last updated.
     */
    LastUpdateTimestamp?: Timestamp;
    /**
     * Describes details about the application code and starting parameters for a Kinesis Data Analytics application.
     */
    ApplicationConfigurationDescription?: ApplicationConfigurationDescription;
    /**
     * Describes the application Amazon CloudWatch logging options.
     */
    CloudWatchLoggingOptionDescriptions?: CloudWatchLoggingOptionDescriptions;
    /**
     * The details of the maintenance configuration for the application.
     */
    ApplicationMaintenanceConfigurationDescription?: ApplicationMaintenanceConfigurationDescription;
    /**
     * The previous application version before the latest application update. RollbackApplication reverts the application to this version.
     */
    ApplicationVersionUpdatedFrom?: ApplicationVersionId;
    /**
     * If you reverted the application using RollbackApplication, the application version when RollbackApplication was called.
     */
    ApplicationVersionRolledBackFrom?: ApplicationVersionId;
    /**
     * A value you use to implement strong concurrency for application updates.
     */
    ConditionalToken?: ConditionalToken;
    /**
     * The version to which you want to roll back the application.
     */
    ApplicationVersionRolledBackTo?: ApplicationVersionId;
    /**
     * To create a Kinesis Data Analytics Studio notebook, you must set the mode to INTERACTIVE. However, for a Kinesis Data Analytics for Apache Flink application, the mode is optional.
     */
    ApplicationMode?: ApplicationMode;
  }
  export interface ApplicationMaintenanceConfigurationDescription {
    /**
     * The start time for the maintenance window.
     */
    ApplicationMaintenanceWindowStartTime: ApplicationMaintenanceWindowStartTime;
    /**
     * The end time for the maintenance window.
     */
    ApplicationMaintenanceWindowEndTime: ApplicationMaintenanceWindowEndTime;
  }
  export interface ApplicationMaintenanceConfigurationUpdate {
    /**
     * The updated start time for the maintenance window.
     */
    ApplicationMaintenanceWindowStartTimeUpdate: ApplicationMaintenanceWindowStartTime;
  }
  export type ApplicationMaintenanceWindowEndTime = string;
  export type ApplicationMaintenanceWindowStartTime = string;
  export type ApplicationMode = "STREAMING"|"INTERACTIVE"|string;
  export type ApplicationName = string;
  export interface ApplicationRestoreConfiguration {
    /**
     * Specifies how the application should be restored.
     */
    ApplicationRestoreType: ApplicationRestoreType;
    /**
     * The identifier of an existing snapshot of application state to use to restart an application. The application uses this value if RESTORE_FROM_CUSTOM_SNAPSHOT is specified for the ApplicationRestoreType.
     */
    SnapshotName?: SnapshotName;
  }
  export type ApplicationRestoreType = "SKIP_RESTORE_FROM_SNAPSHOT"|"RESTORE_FROM_LATEST_SNAPSHOT"|"RESTORE_FROM_CUSTOM_SNAPSHOT"|string;
  export interface ApplicationSnapshotConfiguration {
    /**
     * Describes whether snapshots are enabled for a Flink-based Kinesis Data Analytics application.
     */
    SnapshotsEnabled: BooleanObject;
  }
  export interface ApplicationSnapshotConfigurationDescription {
    /**
     * Describes whether snapshots are enabled for a Flink-based Kinesis Data Analytics application.
     */
    SnapshotsEnabled: BooleanObject;
  }
  export interface ApplicationSnapshotConfigurationUpdate {
    /**
     * Describes updates to whether snapshots are enabled for an application.
     */
    SnapshotsEnabledUpdate: BooleanObject;
  }
  export type ApplicationStatus = "DELETING"|"STARTING"|"STOPPING"|"READY"|"RUNNING"|"UPDATING"|"AUTOSCALING"|"FORCE_STOPPING"|"ROLLING_BACK"|"MAINTENANCE"|"ROLLED_BACK"|string;
  export type ApplicationSummaries = ApplicationSummary[];
  export interface ApplicationSummary {
    /**
     * The name of the application.
     */
    ApplicationName: ApplicationName;
    /**
     * The ARN of the application.
     */
    ApplicationARN: ResourceARN;
    /**
     * The status of the application.
     */
    ApplicationStatus: ApplicationStatus;
    /**
     * Provides the current application version.
     */
    ApplicationVersionId: ApplicationVersionId;
    /**
     * The runtime environment for the application.
     */
    RuntimeEnvironment: RuntimeEnvironment;
    /**
     * For a Kinesis Data Analytics for Apache Flink application, the mode is STREAMING. For a Kinesis Data Analytics Studio notebook, it is INTERACTIVE.
     */
    ApplicationMode?: ApplicationMode;
  }
  export type ApplicationVersionId = number;
  export type ApplicationVersionSummaries = ApplicationVersionSummary[];
  export interface ApplicationVersionSummary {
    /**
     * The ID of the application version. Kinesis Data Analytics updates the ApplicationVersionId each time you update the application.
     */
    ApplicationVersionId: ApplicationVersionId;
    /**
     * The status of the application.
     */
    ApplicationStatus: ApplicationStatus;
  }
  export type ArtifactType = "UDF"|"DEPENDENCY_JAR"|string;
  export type AuthorizedUrl = string;
  export type BasePath = string;
  export type BooleanObject = boolean;
  export type BucketARN = string;
  export interface CSVMappingParameters {
    /**
     * The row delimiter. For example, in a CSV format, '\n' is the typical row delimiter.
     */
    RecordRowDelimiter: RecordRowDelimiter;
    /**
     * The column delimiter. For example, in a CSV format, a comma (",") is the typical column delimiter.
     */
    RecordColumnDelimiter: RecordColumnDelimiter;
  }
  export interface CatalogConfiguration {
    /**
     * The configuration parameters for the default Amazon Glue database. You use this database for Apache Flink SQL queries and table API transforms that you write in a Kinesis Data Analytics Studio notebook.
     */
    GlueDataCatalogConfiguration: GlueDataCatalogConfiguration;
  }
  export interface CatalogConfigurationDescription {
    /**
     * The configuration parameters for the default Amazon Glue database. You use this database for SQL queries that you write in a Kinesis Data Analytics Studio notebook.
     */
    GlueDataCatalogConfigurationDescription: GlueDataCatalogConfigurationDescription;
  }
  export interface CatalogConfigurationUpdate {
    /**
     * Updates to the configuration parameters for the default Amazon Glue database. You use this database for SQL queries that you write in a Kinesis Data Analytics Studio notebook.
     */
    GlueDataCatalogConfigurationUpdate: GlueDataCatalogConfigurationUpdate;
  }
  export interface CheckpointConfiguration {
    /**
     * Describes whether the application uses Kinesis Data Analytics' default checkpointing behavior. You must set this property to CUSTOM in order to set the CheckpointingEnabled, CheckpointInterval, or MinPauseBetweenCheckpoints parameters.  If this value is set to DEFAULT, the application will use the following values, even if they are set to other values using APIs or application code:    CheckpointingEnabled: true    CheckpointInterval: 60000    MinPauseBetweenCheckpoints: 5000   
     */
    ConfigurationType: ConfigurationType;
    /**
     * Describes whether checkpointing is enabled for a Flink-based Kinesis Data Analytics application.  If CheckpointConfiguration.ConfigurationType is DEFAULT, the application will use a CheckpointingEnabled value of true, even if this value is set to another value using this API or in application code. 
     */
    CheckpointingEnabled?: BooleanObject;
    /**
     * Describes the interval in milliseconds between checkpoint operations.   If CheckpointConfiguration.ConfigurationType is DEFAULT, the application will use a CheckpointInterval value of 60000, even if this value is set to another value using this API or in application code. 
     */
    CheckpointInterval?: CheckpointInterval;
    /**
     * Describes the minimum time in milliseconds after a checkpoint operation completes that a new checkpoint operation can start. If a checkpoint operation takes longer than the CheckpointInterval, the application otherwise performs continual checkpoint operations. For more information, see  Tuning Checkpointing in the Apache Flink Documentation.  If CheckpointConfiguration.ConfigurationType is DEFAULT, the application will use a MinPauseBetweenCheckpoints value of 5000, even if this value is set using this API or in application code. 
     */
    MinPauseBetweenCheckpoints?: MinPauseBetweenCheckpoints;
  }
  export interface CheckpointConfigurationDescription {
    /**
     * Describes whether the application uses the default checkpointing behavior in Kinesis Data Analytics.   If this value is set to DEFAULT, the application will use the following values, even if they are set to other values using APIs or application code:    CheckpointingEnabled: true    CheckpointInterval: 60000    MinPauseBetweenCheckpoints: 5000   
     */
    ConfigurationType?: ConfigurationType;
    /**
     * Describes whether checkpointing is enabled for a Flink-based Kinesis Data Analytics application.  If CheckpointConfiguration.ConfigurationType is DEFAULT, the application will use a CheckpointingEnabled value of true, even if this value is set to another value using this API or in application code. 
     */
    CheckpointingEnabled?: BooleanObject;
    /**
     * Describes the interval in milliseconds between checkpoint operations.   If CheckpointConfiguration.ConfigurationType is DEFAULT, the application will use a CheckpointInterval value of 60000, even if this value is set to another value using this API or in application code. 
     */
    CheckpointInterval?: CheckpointInterval;
    /**
     * Describes the minimum time in milliseconds after a checkpoint operation completes that a new checkpoint operation can start.   If CheckpointConfiguration.ConfigurationType is DEFAULT, the application will use a MinPauseBetweenCheckpoints value of 5000, even if this value is set using this API or in application code. 
     */
    MinPauseBetweenCheckpoints?: MinPauseBetweenCheckpoints;
  }
  export interface CheckpointConfigurationUpdate {
    /**
     * Describes updates to whether the application uses the default checkpointing behavior of Kinesis Data Analytics. You must set this property to CUSTOM in order to set the CheckpointingEnabled, CheckpointInterval, or MinPauseBetweenCheckpoints parameters.   If this value is set to DEFAULT, the application will use the following values, even if they are set to other values using APIs or application code:    CheckpointingEnabled: true    CheckpointInterval: 60000    MinPauseBetweenCheckpoints: 5000   
     */
    ConfigurationTypeUpdate?: ConfigurationType;
    /**
     * Describes updates to whether checkpointing is enabled for an application.  If CheckpointConfiguration.ConfigurationType is DEFAULT, the application will use a CheckpointingEnabled value of true, even if this value is set to another value using this API or in application code. 
     */
    CheckpointingEnabledUpdate?: BooleanObject;
    /**
     * Describes updates to the interval in milliseconds between checkpoint operations.  If CheckpointConfiguration.ConfigurationType is DEFAULT, the application will use a CheckpointInterval value of 60000, even if this value is set to another value using this API or in application code. 
     */
    CheckpointIntervalUpdate?: CheckpointInterval;
    /**
     * Describes updates to the minimum time in milliseconds after a checkpoint operation completes that a new checkpoint operation can start.  If CheckpointConfiguration.ConfigurationType is DEFAULT, the application will use a MinPauseBetweenCheckpoints value of 5000, even if this value is set using this API or in application code. 
     */
    MinPauseBetweenCheckpointsUpdate?: MinPauseBetweenCheckpoints;
  }
  export type CheckpointInterval = number;
  export interface CloudWatchLoggingOption {
    /**
     * The ARN of the CloudWatch log to receive application messages.
     */
    LogStreamARN: LogStreamARN;
  }
  export interface CloudWatchLoggingOptionDescription {
    /**
     * The ID of the CloudWatch logging option description.
     */
    CloudWatchLoggingOptionId?: Id;
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch log to receive application messages.
     */
    LogStreamARN: LogStreamARN;
    /**
     * The IAM ARN of the role to use to send application messages.   Provided for backward compatibility. Applications created with the current API version have an application-level service execution role rather than a resource-level role. 
     */
    RoleARN?: RoleARN;
  }
  export type CloudWatchLoggingOptionDescriptions = CloudWatchLoggingOptionDescription[];
  export interface CloudWatchLoggingOptionUpdate {
    /**
     * The ID of the CloudWatch logging option to update
     */
    CloudWatchLoggingOptionId: Id;
    /**
     * The Amazon Resource Name (ARN) of the CloudWatch log to receive application messages.
     */
    LogStreamARNUpdate?: LogStreamARN;
  }
  export type CloudWatchLoggingOptionUpdates = CloudWatchLoggingOptionUpdate[];
  export type CloudWatchLoggingOptions = CloudWatchLoggingOption[];
  export interface CodeContent {
    /**
     * The text-format code for a Flink-based Kinesis Data Analytics application.
     */
    TextContent?: TextContent;
    /**
     * The zip-format code for a Flink-based Kinesis Data Analytics application.
     */
    ZipFileContent?: ZipFileContent;
    /**
     * Information about the Amazon S3 bucket that contains the application code.
     */
    S3ContentLocation?: S3ContentLocation;
  }
  export interface CodeContentDescription {
    /**
     * The text-format code
     */
    TextContent?: TextContent;
    /**
     * The checksum that can be used to validate zip-format code.
     */
    CodeMD5?: CodeMD5;
    /**
     * The size in bytes of the application code. Can be used to validate zip-format code.
     */
    CodeSize?: CodeSize;
    /**
     * The S3 bucket Amazon Resource Name (ARN), file key, and object version of the application code stored in Amazon S3.
     */
    S3ApplicationCodeLocationDescription?: S3ApplicationCodeLocationDescription;
  }
  export type CodeContentType = "PLAINTEXT"|"ZIPFILE"|string;
  export interface CodeContentUpdate {
    /**
     * Describes an update to the text code for an application.
     */
    TextContentUpdate?: TextContent;
    /**
     * Describes an update to the zipped code for an application.
     */
    ZipFileContentUpdate?: ZipFileContent;
    /**
     * Describes an update to the location of code for an application.
     */
    S3ContentLocationUpdate?: S3ContentLocationUpdate;
  }
  export type CodeMD5 = string;
  export type CodeSize = number;
  export type ConditionalToken = string;
  export type ConfigurationType = "DEFAULT"|"CUSTOM"|string;
  export interface CreateApplicationPresignedUrlRequest {
    /**
     * The name of the application.
     */
    ApplicationName: ApplicationName;
    /**
     * The type of the extension for which to create and return a URL. Currently, the only valid extension URL type is FLINK_DASHBOARD_URL. 
     */
    UrlType: UrlType;
    /**
     * The duration in seconds for which the returned URL will be valid.
     */
    SessionExpirationDurationInSeconds?: SessionExpirationDurationInSeconds;
  }
  export interface CreateApplicationPresignedUrlResponse {
    /**
     * The URL of the extension.
     */
    AuthorizedUrl?: AuthorizedUrl;
  }
  export interface CreateApplicationRequest {
    /**
     * The name of your application (for example, sample-app).
     */
    ApplicationName: ApplicationName;
    /**
     * A summary description of the application.
     */
    ApplicationDescription?: ApplicationDescription;
    /**
     * The runtime environment for the application (SQL-1_0, FLINK-1_6, FLINK-1_8, or FLINK-1_11).
     */
    RuntimeEnvironment: RuntimeEnvironment;
    /**
     * The IAM role used by the application to access Kinesis data streams, Kinesis Data Firehose delivery streams, Amazon S3 objects, and other external resources.
     */
    ServiceExecutionRole: RoleARN;
    /**
     * Use this parameter to configure the application.
     */
    ApplicationConfiguration?: ApplicationConfiguration;
    /**
     * Use this parameter to configure an Amazon CloudWatch log stream to monitor application configuration errors. 
     */
    CloudWatchLoggingOptions?: CloudWatchLoggingOptions;
    /**
     * A list of one or more tags to assign to the application. A tag is a key-value pair that identifies an application. Note that the maximum number of application tags includes system tags. The maximum number of user-defined application tags is 50. For more information, see Using Tagging.
     */
    Tags?: Tags;
    /**
     * Use the STREAMING mode to create a Kinesis Data Analytics Studio notebook. To create a Kinesis Data Analytics Studio notebook, use the INTERACTIVE mode.
     */
    ApplicationMode?: ApplicationMode;
  }
  export interface CreateApplicationResponse {
    /**
     * In response to your CreateApplication request, Kinesis Data Analytics returns a response with details of the application it created.
     */
    ApplicationDetail: ApplicationDetail;
  }
  export interface CreateApplicationSnapshotRequest {
    /**
     * The name of an existing application
     */
    ApplicationName: ApplicationName;
    /**
     * An identifier for the application snapshot.
     */
    SnapshotName: SnapshotName;
  }
  export interface CreateApplicationSnapshotResponse {
  }
  export interface CustomArtifactConfiguration {
    /**
     *  UDF stands for user-defined functions. This type of artifact must be in an S3 bucket. A DEPENDENCY_JAR can be in either Maven or an S3 bucket.
     */
    ArtifactType: ArtifactType;
    S3ContentLocation?: S3ContentLocation;
    /**
     * The parameters required to fully specify a Maven reference.
     */
    MavenReference?: MavenReference;
  }
  export interface CustomArtifactConfigurationDescription {
    /**
     *  UDF stands for user-defined functions. This type of artifact must be in an S3 bucket. A DEPENDENCY_JAR can be in either Maven or an S3 bucket.
     */
    ArtifactType?: ArtifactType;
    S3ContentLocationDescription?: S3ContentLocation;
    /**
     * The parameters that are required to specify a Maven dependency.
     */
    MavenReferenceDescription?: MavenReference;
  }
  export type CustomArtifactsConfigurationDescriptionList = CustomArtifactConfigurationDescription[];
  export type CustomArtifactsConfigurationList = CustomArtifactConfiguration[];
  export type DatabaseARN = string;
  export interface DeleteApplicationCloudWatchLoggingOptionRequest {
    /**
     * The application name.
     */
    ApplicationName: ApplicationName;
    /**
     * The version ID of the application. You must provide the CurrentApplicationVersionId or the ConditionalToken. You can retrieve the application version ID using DescribeApplication. For better concurrency support, use the ConditionalToken parameter instead of CurrentApplicationVersionId.
     */
    CurrentApplicationVersionId?: ApplicationVersionId;
    /**
     * The CloudWatchLoggingOptionId of the Amazon CloudWatch logging option to delete. You can get the CloudWatchLoggingOptionId by using the DescribeApplication operation. 
     */
    CloudWatchLoggingOptionId: Id;
    /**
     * A value you use to implement strong concurrency for application updates. You must provide the CurrentApplicationVersionId or the ConditionalToken. You get the application's current ConditionalToken using DescribeApplication. For better concurrency support, use the ConditionalToken parameter instead of CurrentApplicationVersionId.
     */
    ConditionalToken?: ConditionalToken;
  }
  export interface DeleteApplicationCloudWatchLoggingOptionResponse {
    /**
     * The application's Amazon Resource Name (ARN).
     */
    ApplicationARN?: ResourceARN;
    /**
     * The version ID of the application. Kinesis Data Analytics updates the ApplicationVersionId each time you change the CloudWatch logging options.
     */
    ApplicationVersionId?: ApplicationVersionId;
    /**
     * The descriptions of the remaining CloudWatch logging options for the application.
     */
    CloudWatchLoggingOptionDescriptions?: CloudWatchLoggingOptionDescriptions;
  }
  export interface DeleteApplicationInputProcessingConfigurationRequest {
    /**
     * The name of the application.
     */
    ApplicationName: ApplicationName;
    /**
     * The application version. You can use the DescribeApplication operation to get the current application version. If the version specified is not the current version, the ConcurrentModificationException is returned. 
     */
    CurrentApplicationVersionId: ApplicationVersionId;
    /**
     * The ID of the input configuration from which to delete the input processing configuration. You can get a list of the input IDs for an application by using the DescribeApplication operation.
     */
    InputId: Id;
  }
  export interface DeleteApplicationInputProcessingConfigurationResponse {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationARN?: ResourceARN;
    /**
     * The current application version ID.
     */
    ApplicationVersionId?: ApplicationVersionId;
  }
  export interface DeleteApplicationOutputRequest {
    /**
     * The application name.
     */
    ApplicationName: ApplicationName;
    /**
     * The application version. You can use the DescribeApplication operation to get the current application version. If the version specified is not the current version, the ConcurrentModificationException is returned. 
     */
    CurrentApplicationVersionId: ApplicationVersionId;
    /**
     * The ID of the configuration to delete. Each output configuration that is added to the application (either when the application is created or later) using the AddApplicationOutput operation has a unique ID. You need to provide the ID to uniquely identify the output configuration that you want to delete from the application configuration. You can use the DescribeApplication operation to get the specific OutputId. 
     */
    OutputId: Id;
  }
  export interface DeleteApplicationOutputResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationARN?: ResourceARN;
    /**
     * The current application version ID.
     */
    ApplicationVersionId?: ApplicationVersionId;
  }
  export interface DeleteApplicationReferenceDataSourceRequest {
    /**
     * The name of an existing application.
     */
    ApplicationName: ApplicationName;
    /**
     * The current application version. You can use the DescribeApplication operation to get the current application version. If the version specified is not the current version, the ConcurrentModificationException is returned.
     */
    CurrentApplicationVersionId: ApplicationVersionId;
    /**
     * The ID of the reference data source. When you add a reference data source to your application using the AddApplicationReferenceDataSource, Kinesis Data Analytics assigns an ID. You can use the DescribeApplication operation to get the reference ID. 
     */
    ReferenceId: Id;
  }
  export interface DeleteApplicationReferenceDataSourceResponse {
    /**
     * The application Amazon Resource Name (ARN).
     */
    ApplicationARN?: ResourceARN;
    /**
     * The updated version ID of the application.
     */
    ApplicationVersionId?: ApplicationVersionId;
  }
  export interface DeleteApplicationRequest {
    /**
     * The name of the application to delete.
     */
    ApplicationName: ApplicationName;
    /**
     * Use the DescribeApplication operation to get this value.
     */
    CreateTimestamp: Timestamp;
  }
  export interface DeleteApplicationResponse {
  }
  export interface DeleteApplicationSnapshotRequest {
    /**
     * The name of an existing application.
     */
    ApplicationName: ApplicationName;
    /**
     * The identifier for the snapshot delete.
     */
    SnapshotName: SnapshotName;
    /**
     * The creation timestamp of the application snapshot to delete. You can retrieve this value using or .
     */
    SnapshotCreationTimestamp: Timestamp;
  }
  export interface DeleteApplicationSnapshotResponse {
  }
  export interface DeleteApplicationVpcConfigurationRequest {
    /**
     * The name of an existing application.
     */
    ApplicationName: ApplicationName;
    /**
     * The current application version ID. You must provide the CurrentApplicationVersionId or the ConditionalToken. You can retrieve the application version ID using DescribeApplication. For better concurrency support, use the ConditionalToken parameter instead of CurrentApplicationVersionId.
     */
    CurrentApplicationVersionId?: ApplicationVersionId;
    /**
     * The ID of the VPC configuration to delete.
     */
    VpcConfigurationId: Id;
    /**
     * A value you use to implement strong concurrency for application updates. You must provide the CurrentApplicationVersionId or the ConditionalToken. You get the application's current ConditionalToken using DescribeApplication. For better concurrency support, use the ConditionalToken parameter instead of CurrentApplicationVersionId.
     */
    ConditionalToken?: ConditionalToken;
  }
  export interface DeleteApplicationVpcConfigurationResponse {
    /**
     * The ARN of the Kinesis Data Analytics application.
     */
    ApplicationARN?: ResourceARN;
    /**
     * The updated version ID of the application.
     */
    ApplicationVersionId?: ApplicationVersionId;
  }
  export interface DeployAsApplicationConfiguration {
    /**
     * The description of an Amazon S3 object that contains the Amazon Data Analytics application, including the Amazon Resource Name (ARN) of the S3 bucket, the name of the Amazon S3 object that contains the data, and the version number of the Amazon S3 object that contains the data. 
     */
    S3ContentLocation: S3ContentBaseLocation;
  }
  export interface DeployAsApplicationConfigurationDescription {
    /**
     * The location that holds the data required to specify an Amazon Data Analytics application.
     */
    S3ContentLocationDescription: S3ContentBaseLocationDescription;
  }
  export interface DeployAsApplicationConfigurationUpdate {
    /**
     * Updates to the location that holds the data required to specify an Amazon Data Analytics application.
     */
    S3ContentLocationUpdate?: S3ContentBaseLocationUpdate;
  }
  export interface DescribeApplicationRequest {
    /**
     * The name of the application.
     */
    ApplicationName: ApplicationName;
    /**
     * Displays verbose information about a Kinesis Data Analytics application, including the application's job plan.
     */
    IncludeAdditionalDetails?: BooleanObject;
  }
  export interface DescribeApplicationResponse {
    /**
     * Provides a description of the application, such as the application's Amazon Resource Name (ARN), status, and latest version.
     */
    ApplicationDetail: ApplicationDetail;
  }
  export interface DescribeApplicationSnapshotRequest {
    /**
     * The name of an existing application.
     */
    ApplicationName: ApplicationName;
    /**
     * The identifier of an application snapshot. You can retrieve this value using .
     */
    SnapshotName: SnapshotName;
  }
  export interface DescribeApplicationSnapshotResponse {
    /**
     * An object containing information about the application snapshot.
     */
    SnapshotDetails: SnapshotDetails;
  }
  export interface DescribeApplicationVersionRequest {
    /**
     * The name of the application for which you want to get the version description.
     */
    ApplicationName: ApplicationName;
    /**
     * The ID of the application version for which you want to get the description.
     */
    ApplicationVersionId: ApplicationVersionId;
  }
  export interface DescribeApplicationVersionResponse {
    ApplicationVersionDetail?: ApplicationDetail;
  }
  export interface DestinationSchema {
    /**
     * Specifies the format of the records on the output stream.
     */
    RecordFormatType: RecordFormatType;
  }
  export interface DiscoverInputSchemaRequest {
    /**
     * The Amazon Resource Name (ARN) of the streaming source.
     */
    ResourceARN?: ResourceARN;
    /**
     * The ARN of the role that is used to access the streaming source.
     */
    ServiceExecutionRole: RoleARN;
    /**
     * The point at which you want Kinesis Data Analytics to start reading records from the specified streaming source discovery purposes.
     */
    InputStartingPositionConfiguration?: InputStartingPositionConfiguration;
    /**
     * Specify this parameter to discover a schema from data in an Amazon S3 object.
     */
    S3Configuration?: S3Configuration;
    /**
     * The InputProcessingConfiguration to use to preprocess the records before discovering the schema of the records.
     */
    InputProcessingConfiguration?: InputProcessingConfiguration;
  }
  export interface DiscoverInputSchemaResponse {
    /**
     * The schema inferred from the streaming source. It identifies the format of the data in the streaming source and how each data element maps to corresponding columns in the in-application stream that you can create.
     */
    InputSchema?: SourceSchema;
    /**
     * An array of elements, where each element corresponds to a row in a stream record (a stream record can have more than one row).
     */
    ParsedInputRecords?: ParsedInputRecords;
    /**
     * The stream data that was modified by the processor specified in the InputProcessingConfiguration parameter.
     */
    ProcessedInputRecords?: ProcessedInputRecords;
    /**
     * The raw stream data that was sampled to infer the schema.
     */
    RawInputRecords?: RawInputRecords;
  }
  export interface EnvironmentProperties {
    /**
     * Describes the execution property groups.
     */
    PropertyGroups: PropertyGroups;
  }
  export interface EnvironmentPropertyDescriptions {
    /**
     * Describes the execution property groups.
     */
    PropertyGroupDescriptions?: PropertyGroups;
  }
  export interface EnvironmentPropertyUpdates {
    /**
     * Describes updates to the execution property groups.
     */
    PropertyGroups: PropertyGroups;
  }
  export type FileKey = string;
  export interface FlinkApplicationConfiguration {
    /**
     * Describes an application's checkpointing configuration. Checkpointing is the process of persisting application state for fault tolerance. For more information, see  Checkpoints for Fault Tolerance in the Apache Flink Documentation. 
     */
    CheckpointConfiguration?: CheckpointConfiguration;
    /**
     * Describes configuration parameters for Amazon CloudWatch logging for an application.
     */
    MonitoringConfiguration?: MonitoringConfiguration;
    /**
     * Describes parameters for how an application executes multiple tasks simultaneously.
     */
    ParallelismConfiguration?: ParallelismConfiguration;
  }
  export interface FlinkApplicationConfigurationDescription {
    /**
     * Describes an application's checkpointing configuration. Checkpointing is the process of persisting application state for fault tolerance.
     */
    CheckpointConfigurationDescription?: CheckpointConfigurationDescription;
    /**
     * Describes configuration parameters for Amazon CloudWatch logging for an application.
     */
    MonitoringConfigurationDescription?: MonitoringConfigurationDescription;
    /**
     * Describes parameters for how an application executes multiple tasks simultaneously.
     */
    ParallelismConfigurationDescription?: ParallelismConfigurationDescription;
    /**
     * The job plan for an application. For more information about the job plan, see Jobs and Scheduling in the Apache Flink Documentation. To retrieve the job plan for the application, use the DescribeApplicationRequest$IncludeAdditionalDetails parameter of the DescribeApplication operation.
     */
    JobPlanDescription?: JobPlanDescription;
  }
  export interface FlinkApplicationConfigurationUpdate {
    /**
     * Describes updates to an application's checkpointing configuration. Checkpointing is the process of persisting application state for fault tolerance.
     */
    CheckpointConfigurationUpdate?: CheckpointConfigurationUpdate;
    /**
     * Describes updates to the configuration parameters for Amazon CloudWatch logging for an application.
     */
    MonitoringConfigurationUpdate?: MonitoringConfigurationUpdate;
    /**
     * Describes updates to the parameters for how an application executes multiple tasks simultaneously.
     */
    ParallelismConfigurationUpdate?: ParallelismConfigurationUpdate;
  }
  export interface FlinkRunConfiguration {
    /**
     * When restoring from a snapshot, specifies whether the runtime is allowed to skip a state that cannot be mapped to the new program. This will happen if the program is updated between snapshots to remove stateful parameters, and state data in the snapshot no longer corresponds to valid application data. For more information, see  Allowing Non-Restored State in the Apache Flink documentation.  This value defaults to false. If you update your application without specifying this parameter, AllowNonRestoredState will be set to false, even if it was previously set to true. 
     */
    AllowNonRestoredState?: BooleanObject;
  }
  export interface GlueDataCatalogConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the database.
     */
    DatabaseARN: DatabaseARN;
  }
  export interface GlueDataCatalogConfigurationDescription {
    /**
     * The Amazon Resource Name (ARN) of the database.
     */
    DatabaseARN: DatabaseARN;
  }
  export interface GlueDataCatalogConfigurationUpdate {
    /**
     * The updated Amazon Resource Name (ARN) of the database.
     */
    DatabaseARNUpdate: DatabaseARN;
  }
  export type Id = string;
  export type InAppStreamName = string;
  export type InAppStreamNames = InAppStreamName[];
  export type InAppTableName = string;
  export interface Input {
    /**
     * The name prefix to use when creating an in-application stream. Suppose that you specify a prefix "MyInApplicationStream." Kinesis Data Analytics then creates one or more (as per the InputParallelism count you specified) in-application streams with the names "MyInApplicationStream_001," "MyInApplicationStream_002," and so on. 
     */
    NamePrefix: InAppStreamName;
    /**
     * The InputProcessingConfiguration for the input. An input processor transforms records as they are received from the stream, before the application's SQL code executes. Currently, the only input processing configuration available is InputLambdaProcessor. 
     */
    InputProcessingConfiguration?: InputProcessingConfiguration;
    /**
     * If the streaming source is an Amazon Kinesis data stream, identifies the stream's Amazon Resource Name (ARN). 
     */
    KinesisStreamsInput?: KinesisStreamsInput;
    /**
     * If the streaming source is an Amazon Kinesis Data Firehose delivery stream, identifies the delivery stream's ARN.
     */
    KinesisFirehoseInput?: KinesisFirehoseInput;
    /**
     * Describes the number of in-application streams to create. 
     */
    InputParallelism?: InputParallelism;
    /**
     * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns in the in-application stream that is being created. Also used to describe the format of the reference data source.
     */
    InputSchema: SourceSchema;
  }
  export interface InputDescription {
    /**
     * The input ID that is associated with the application input. This is the ID that Kinesis Data Analytics assigns to each input configuration that you add to your application. 
     */
    InputId?: Id;
    /**
     * The in-application name prefix.
     */
    NamePrefix?: InAppStreamName;
    /**
     * Returns the in-application stream names that are mapped to the stream source. 
     */
    InAppStreamNames?: InAppStreamNames;
    /**
     * The description of the preprocessor that executes on records in this input before the application's code is run. 
     */
    InputProcessingConfigurationDescription?: InputProcessingConfigurationDescription;
    /**
     * If a Kinesis data stream is configured as a streaming source, provides the Kinesis data stream's Amazon Resource Name (ARN). 
     */
    KinesisStreamsInputDescription?: KinesisStreamsInputDescription;
    /**
     * If a Kinesis Data Firehose delivery stream is configured as a streaming source, provides the delivery stream's ARN. 
     */
    KinesisFirehoseInputDescription?: KinesisFirehoseInputDescription;
    /**
     * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns in the in-application stream that is being created. 
     */
    InputSchema?: SourceSchema;
    /**
     * Describes the configured parallelism (number of in-application streams mapped to the streaming source). 
     */
    InputParallelism?: InputParallelism;
    /**
     * The point at which the application is configured to read from the input stream.
     */
    InputStartingPositionConfiguration?: InputStartingPositionConfiguration;
  }
  export type InputDescriptions = InputDescription[];
  export interface InputLambdaProcessor {
    /**
     * The ARN of the Amazon Lambda function that operates on records in the stream.  To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see Example ARNs: Amazon Lambda  
     */
    ResourceARN: ResourceARN;
  }
  export interface InputLambdaProcessorDescription {
    /**
     * The ARN of the Amazon Lambda function that is used to preprocess the records in the stream.  To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see Example ARNs: Amazon Lambda  
     */
    ResourceARN: ResourceARN;
    /**
     * The ARN of the IAM role that is used to access the Amazon Lambda function.  Provided for backward compatibility. Applications that are created with the current API version have an application-level service execution role rather than a resource-level role. 
     */
    RoleARN?: RoleARN;
  }
  export interface InputLambdaProcessorUpdate {
    /**
     * The Amazon Resource Name (ARN) of the new Amazon Lambda function that is used to preprocess the records in the stream.  To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see Example ARNs: Amazon Lambda  
     */
    ResourceARNUpdate: ResourceARN;
  }
  export interface InputParallelism {
    /**
     * The number of in-application streams to create.
     */
    Count?: InputParallelismCount;
  }
  export type InputParallelismCount = number;
  export interface InputParallelismUpdate {
    /**
     * The number of in-application streams to create for the specified streaming source.
     */
    CountUpdate: InputParallelismCount;
  }
  export interface InputProcessingConfiguration {
    /**
     * The InputLambdaProcessor that is used to preprocess the records in the stream before being processed by your application code.
     */
    InputLambdaProcessor: InputLambdaProcessor;
  }
  export interface InputProcessingConfigurationDescription {
    /**
     * Provides configuration information about the associated InputLambdaProcessorDescription 
     */
    InputLambdaProcessorDescription?: InputLambdaProcessorDescription;
  }
  export interface InputProcessingConfigurationUpdate {
    /**
     * Provides update information for an InputLambdaProcessor.
     */
    InputLambdaProcessorUpdate: InputLambdaProcessorUpdate;
  }
  export interface InputSchemaUpdate {
    /**
     * Specifies the format of the records on the streaming source.
     */
    RecordFormatUpdate?: RecordFormat;
    /**
     * Specifies the encoding of the records in the streaming source; for example, UTF-8.
     */
    RecordEncodingUpdate?: RecordEncoding;
    /**
     * A list of RecordColumn objects. Each object describes the mapping of the streaming source element to the corresponding column in the in-application stream.
     */
    RecordColumnUpdates?: RecordColumns;
  }
  export type InputStartingPosition = "NOW"|"TRIM_HORIZON"|"LAST_STOPPED_POINT"|string;
  export interface InputStartingPositionConfiguration {
    /**
     * The starting position on the stream.    NOW - Start reading just after the most recent record in the stream, and start at the request timestamp that the customer issued.    TRIM_HORIZON - Start reading at the last untrimmed record in the stream, which is the oldest record available in the stream. This option is not available for an Amazon Kinesis Data Firehose delivery stream.    LAST_STOPPED_POINT - Resume reading from where the application last stopped reading.  
     */
    InputStartingPosition?: InputStartingPosition;
  }
  export interface InputUpdate {
    /**
     * The input ID of the application input to be updated.
     */
    InputId: Id;
    /**
     * The name prefix for in-application streams that Kinesis Data Analytics creates for the specific streaming source.
     */
    NamePrefixUpdate?: InAppStreamName;
    /**
     * Describes updates to an InputProcessingConfiguration.
     */
    InputProcessingConfigurationUpdate?: InputProcessingConfigurationUpdate;
    /**
     * If a Kinesis data stream is the streaming source to be updated, provides an updated stream Amazon Resource Name (ARN).
     */
    KinesisStreamsInputUpdate?: KinesisStreamsInputUpdate;
    /**
     * If a Kinesis Data Firehose delivery stream is the streaming source to be updated, provides an updated stream ARN.
     */
    KinesisFirehoseInputUpdate?: KinesisFirehoseInputUpdate;
    /**
     * Describes the data format on the streaming source, and how record elements on the streaming source map to columns of the in-application stream that is created.
     */
    InputSchemaUpdate?: InputSchemaUpdate;
    /**
     * Describes the parallelism updates (the number of in-application streams Kinesis Data Analytics creates for the specific streaming source).
     */
    InputParallelismUpdate?: InputParallelismUpdate;
  }
  export type InputUpdates = InputUpdate[];
  export type Inputs = Input[];
  export interface JSONMappingParameters {
    /**
     * The path to the top-level parent that contains the records.
     */
    RecordRowPath: RecordRowPath;
  }
  export type JobPlanDescription = string;
  export type KinesisAnalyticsARN = string;
  export interface KinesisFirehoseInput {
    /**
     * The Amazon Resource Name (ARN) of the delivery stream.
     */
    ResourceARN: ResourceARN;
  }
  export interface KinesisFirehoseInputDescription {
    /**
     * The Amazon Resource Name (ARN) of the delivery stream.
     */
    ResourceARN: ResourceARN;
    /**
     * The ARN of the IAM role that Kinesis Data Analytics assumes to access the stream.  Provided for backward compatibility. Applications that are created with the current API version have an application-level service execution role rather than a resource-level role. 
     */
    RoleARN?: RoleARN;
  }
  export interface KinesisFirehoseInputUpdate {
    /**
     * The Amazon Resource Name (ARN) of the input delivery stream to read.
     */
    ResourceARNUpdate: ResourceARN;
  }
  export interface KinesisFirehoseOutput {
    /**
     * The ARN of the destination delivery stream to write to.
     */
    ResourceARN: ResourceARN;
  }
  export interface KinesisFirehoseOutputDescription {
    /**
     * The Amazon Resource Name (ARN) of the delivery stream.
     */
    ResourceARN: ResourceARN;
    /**
     * The ARN of the IAM role that Kinesis Data Analytics can assume to access the stream.  Provided for backward compatibility. Applications that are created with the current API version have an application-level service execution role rather than a resource-level role. 
     */
    RoleARN?: RoleARN;
  }
  export interface KinesisFirehoseOutputUpdate {
    /**
     * The Amazon Resource Name (ARN) of the delivery stream to write to. 
     */
    ResourceARNUpdate: ResourceARN;
  }
  export interface KinesisStreamsInput {
    /**
     * The ARN of the input Kinesis data stream to read.
     */
    ResourceARN: ResourceARN;
  }
  export interface KinesisStreamsInputDescription {
    /**
     * The Amazon Resource Name (ARN) of the Kinesis data stream.
     */
    ResourceARN: ResourceARN;
    /**
     * The ARN of the IAM role that Kinesis Data Analytics can assume to access the stream.  Provided for backward compatibility. Applications that are created with the current API version have an application-level service execution role rather than a resource-level role. 
     */
    RoleARN?: RoleARN;
  }
  export interface KinesisStreamsInputUpdate {
    /**
     * The Amazon Resource Name (ARN) of the input Kinesis data stream to read.
     */
    ResourceARNUpdate: ResourceARN;
  }
  export interface KinesisStreamsOutput {
    /**
     * The ARN of the destination Kinesis data stream to write to.
     */
    ResourceARN: ResourceARN;
  }
  export interface KinesisStreamsOutputDescription {
    /**
     * The Amazon Resource Name (ARN) of the Kinesis data stream.
     */
    ResourceARN: ResourceARN;
    /**
     * The ARN of the IAM role that Kinesis Data Analytics can assume to access the stream.  Provided for backward compatibility. Applications that are created with the current API version have an application-level service execution role rather than a resource-level role. 
     */
    RoleARN?: RoleARN;
  }
  export interface KinesisStreamsOutputUpdate {
    /**
     * The Amazon Resource Name (ARN) of the Kinesis data stream where you want to write the output.
     */
    ResourceARNUpdate: ResourceARN;
  }
  export interface LambdaOutput {
    /**
     * The Amazon Resource Name (ARN) of the destination Lambda function to write to.  To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see Example ARNs: Amazon Lambda  
     */
    ResourceARN: ResourceARN;
  }
  export interface LambdaOutputDescription {
    /**
     * The Amazon Resource Name (ARN) of the destination Lambda function.
     */
    ResourceARN: ResourceARN;
    /**
     * The ARN of the IAM role that Kinesis Data Analytics can assume to write to the destination function.  Provided for backward compatibility. Applications that are created with the current API version have an application-level service execution role rather than a resource-level role. 
     */
    RoleARN?: RoleARN;
  }
  export interface LambdaOutputUpdate {
    /**
     * The Amazon Resource Name (ARN) of the destination Amazon Lambda function.  To specify an earlier version of the Lambda function than the latest, include the Lambda function version in the Lambda function ARN. For more information about Lambda ARNs, see Example ARNs: Amazon Lambda  
     */
    ResourceARNUpdate: ResourceARN;
  }
  export interface ListApplicationSnapshotsRequest {
    /**
     * The name of an existing application.
     */
    ApplicationName: ApplicationName;
    /**
     * The maximum number of application snapshots to list.
     */
    Limit?: ListSnapshotsInputLimit;
    /**
     * Use this parameter if you receive a NextToken response in a previous request that indicates that there is more output available. Set it to the value of the previous call's NextToken response to indicate where the output should continue from. 
     */
    NextToken?: NextToken;
  }
  export interface ListApplicationSnapshotsResponse {
    /**
     * A collection of objects containing information about the application snapshots.
     */
    SnapshotSummaries?: SnapshotSummaries;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    NextToken?: NextToken;
  }
  export type ListApplicationVersionsInputLimit = number;
  export interface ListApplicationVersionsRequest {
    /**
     * The name of the application for which you want to list all versions.
     */
    ApplicationName: ApplicationName;
    /**
     * The maximum number of versions to list in this invocation of the operation.
     */
    Limit?: ListApplicationVersionsInputLimit;
    /**
     * If a previous invocation of this operation returned a pagination token, pass it into this value to retrieve the next set of results. For more information about pagination, see Using the Amazon Command Line Interface's Pagination Options.
     */
    NextToken?: NextToken;
  }
  export interface ListApplicationVersionsResponse {
    /**
     * A list of the application versions and the associated configuration summaries. The list includes application versions that were rolled back. To get the complete description of a specific application version, invoke the DescribeApplicationVersion operation.
     */
    ApplicationVersionSummaries?: ApplicationVersionSummaries;
    /**
     * The pagination token for the next set of results, or null if there are no additional results. To retrieve the next set of items, pass this token into a subsequent invocation of this operation. For more information about pagination, see Using the Amazon Command Line Interface's Pagination Options.
     */
    NextToken?: NextToken;
  }
  export type ListApplicationsInputLimit = number;
  export interface ListApplicationsRequest {
    /**
     * The maximum number of applications to list.
     */
    Limit?: ListApplicationsInputLimit;
    /**
     * If a previous command returned a pagination token, pass it into this value to retrieve the next set of results. For more information about pagination, see Using the Amazon Command Line Interface's Pagination Options.
     */
    NextToken?: ApplicationName;
  }
  export interface ListApplicationsResponse {
    /**
     * A list of ApplicationSummary objects.
     */
    ApplicationSummaries: ApplicationSummaries;
    /**
     * The pagination token for the next set of results, or null if there are no additional results. Pass this token into a subsequent command to retrieve the next set of items For more information about pagination, see Using the Amazon Command Line Interface's Pagination Options.
     */
    NextToken?: ApplicationName;
  }
  export type ListSnapshotsInputLimit = number;
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the application for which to retrieve tags.
     */
    ResourceARN: KinesisAnalyticsARN;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The key-value tags assigned to the application.
     */
    Tags?: Tags;
  }
  export type LogLevel = "INFO"|"WARN"|"ERROR"|"DEBUG"|string;
  export type LogStreamARN = string;
  export interface MappingParameters {
    /**
     * Provides additional mapping information when JSON is the record format on the streaming source.
     */
    JSONMappingParameters?: JSONMappingParameters;
    /**
     * Provides additional mapping information when the record format uses delimiters (for example, CSV).
     */
    CSVMappingParameters?: CSVMappingParameters;
  }
  export type MavenArtifactId = string;
  export type MavenGroupId = string;
  export interface MavenReference {
    /**
     * The group ID of the Maven reference.
     */
    GroupId: MavenGroupId;
    /**
     * The artifact ID of the Maven reference.
     */
    ArtifactId: MavenArtifactId;
    /**
     * The version of the Maven reference.
     */
    Version: MavenVersion;
  }
  export type MavenVersion = string;
  export type MetricsLevel = "APPLICATION"|"TASK"|"OPERATOR"|"PARALLELISM"|string;
  export type MinPauseBetweenCheckpoints = number;
  export interface MonitoringConfiguration {
    /**
     * Describes whether to use the default CloudWatch logging configuration for an application. You must set this property to CUSTOM in order to set the LogLevel or MetricsLevel parameters.
     */
    ConfigurationType: ConfigurationType;
    /**
     * Describes the granularity of the CloudWatch Logs for an application. The Parallelism level is not recommended for applications with a Parallelism over 64 due to excessive costs.
     */
    MetricsLevel?: MetricsLevel;
    /**
     * Describes the verbosity of the CloudWatch Logs for an application.
     */
    LogLevel?: LogLevel;
  }
  export interface MonitoringConfigurationDescription {
    /**
     * Describes whether to use the default CloudWatch logging configuration for an application.
     */
    ConfigurationType?: ConfigurationType;
    /**
     * Describes the granularity of the CloudWatch Logs for an application.
     */
    MetricsLevel?: MetricsLevel;
    /**
     * Describes the verbosity of the CloudWatch Logs for an application.
     */
    LogLevel?: LogLevel;
  }
  export interface MonitoringConfigurationUpdate {
    /**
     * Describes updates to whether to use the default CloudWatch logging configuration for an application. You must set this property to CUSTOM in order to set the LogLevel or MetricsLevel parameters.
     */
    ConfigurationTypeUpdate?: ConfigurationType;
    /**
     * Describes updates to the granularity of the CloudWatch Logs for an application. The Parallelism level is not recommended for applications with a Parallelism over 64 due to excessive costs.
     */
    MetricsLevelUpdate?: MetricsLevel;
    /**
     * Describes updates to the verbosity of the CloudWatch Logs for an application.
     */
    LogLevelUpdate?: LogLevel;
  }
  export type NextToken = string;
  export type ObjectVersion = string;
  export interface Output {
    /**
     * The name of the in-application stream.
     */
    Name: InAppStreamName;
    /**
     * Identifies a Kinesis data stream as the destination.
     */
    KinesisStreamsOutput?: KinesisStreamsOutput;
    /**
     * Identifies a Kinesis Data Firehose delivery stream as the destination.
     */
    KinesisFirehoseOutput?: KinesisFirehoseOutput;
    /**
     * Identifies an Amazon Lambda function as the destination.
     */
    LambdaOutput?: LambdaOutput;
    /**
     * Describes the data format when records are written to the destination. 
     */
    DestinationSchema: DestinationSchema;
  }
  export interface OutputDescription {
    /**
     * A unique identifier for the output configuration.
     */
    OutputId?: Id;
    /**
     * The name of the in-application stream that is configured as output.
     */
    Name?: InAppStreamName;
    /**
     * Describes the Kinesis data stream that is configured as the destination where output is written.
     */
    KinesisStreamsOutputDescription?: KinesisStreamsOutputDescription;
    /**
     * Describes the Kinesis Data Firehose delivery stream that is configured as the destination where output is written.
     */
    KinesisFirehoseOutputDescription?: KinesisFirehoseOutputDescription;
    /**
     * Describes the Lambda function that is configured as the destination where output is written.
     */
    LambdaOutputDescription?: LambdaOutputDescription;
    /**
     * The data format used for writing data to the destination.
     */
    DestinationSchema?: DestinationSchema;
  }
  export type OutputDescriptions = OutputDescription[];
  export interface OutputUpdate {
    /**
     * Identifies the specific output configuration that you want to update.
     */
    OutputId: Id;
    /**
     * If you want to specify a different in-application stream for this output configuration, use this field to specify the new in-application stream name.
     */
    NameUpdate?: InAppStreamName;
    /**
     * Describes a Kinesis data stream as the destination for the output.
     */
    KinesisStreamsOutputUpdate?: KinesisStreamsOutputUpdate;
    /**
     * Describes a Kinesis Data Firehose delivery stream as the destination for the output.
     */
    KinesisFirehoseOutputUpdate?: KinesisFirehoseOutputUpdate;
    /**
     * Describes an Amazon Lambda function as the destination for the output.
     */
    LambdaOutputUpdate?: LambdaOutputUpdate;
    /**
     * Describes the data format when records are written to the destination. 
     */
    DestinationSchemaUpdate?: DestinationSchema;
  }
  export type OutputUpdates = OutputUpdate[];
  export type Outputs = Output[];
  export type Parallelism = number;
  export interface ParallelismConfiguration {
    /**
     * Describes whether the application uses the default parallelism for the Kinesis Data Analytics service. You must set this property to CUSTOM in order to change your application's AutoScalingEnabled, Parallelism, or ParallelismPerKPU properties.
     */
    ConfigurationType: ConfigurationType;
    /**
     * Describes the initial number of parallel tasks that a Flink-based Kinesis Data Analytics application can perform. If AutoScalingEnabled is set to True, Kinesis Data Analytics increases the CurrentParallelism value in response to application load. The service can increase the CurrentParallelism value up to the maximum parallelism, which is ParalellismPerKPU times the maximum KPUs for the application. The maximum KPUs for an application is 32 by default, and can be increased by requesting a limit increase. If application load is reduced, the service can reduce the CurrentParallelism value down to the Parallelism setting.
     */
    Parallelism?: Parallelism;
    /**
     * Describes the number of parallel tasks that a Flink-based Kinesis Data Analytics application can perform per Kinesis Processing Unit (KPU) used by the application. For more information about KPUs, see Amazon Kinesis Data Analytics Pricing.
     */
    ParallelismPerKPU?: ParallelismPerKPU;
    /**
     * Describes whether the Kinesis Data Analytics service can increase the parallelism of the application in response to increased throughput.
     */
    AutoScalingEnabled?: BooleanObject;
  }
  export interface ParallelismConfigurationDescription {
    /**
     * Describes whether the application uses the default parallelism for the Kinesis Data Analytics service. 
     */
    ConfigurationType?: ConfigurationType;
    /**
     * Describes the initial number of parallel tasks that a Flink-based Kinesis Data Analytics application can perform. If AutoScalingEnabled is set to True, then Kinesis Data Analytics can increase the CurrentParallelism value in response to application load. The service can increase CurrentParallelism up to the maximum parallelism, which is ParalellismPerKPU times the maximum KPUs for the application. The maximum KPUs for an application is 32 by default, and can be increased by requesting a limit increase. If application load is reduced, the service can reduce the CurrentParallelism value down to the Parallelism setting.
     */
    Parallelism?: Parallelism;
    /**
     * Describes the number of parallel tasks that a Flink-based Kinesis Data Analytics application can perform per Kinesis Processing Unit (KPU) used by the application.
     */
    ParallelismPerKPU?: ParallelismPerKPU;
    /**
     * Describes the current number of parallel tasks that a Flink-based Kinesis Data Analytics application can perform. If AutoScalingEnabled is set to True, Kinesis Data Analytics can increase this value in response to application load. The service can increase this value up to the maximum parallelism, which is ParalellismPerKPU times the maximum KPUs for the application. The maximum KPUs for an application is 32 by default, and can be increased by requesting a limit increase. If application load is reduced, the service can reduce the CurrentParallelism value down to the Parallelism setting.
     */
    CurrentParallelism?: Parallelism;
    /**
     * Describes whether the Kinesis Data Analytics service can increase the parallelism of the application in response to increased throughput.
     */
    AutoScalingEnabled?: BooleanObject;
  }
  export interface ParallelismConfigurationUpdate {
    /**
     * Describes updates to whether the application uses the default parallelism for the Kinesis Data Analytics service, or if a custom parallelism is used. You must set this property to CUSTOM in order to change your application's AutoScalingEnabled, Parallelism, or ParallelismPerKPU properties.
     */
    ConfigurationTypeUpdate?: ConfigurationType;
    /**
     * Describes updates to the initial number of parallel tasks an application can perform. If AutoScalingEnabled is set to True, then Kinesis Data Analytics can increase the CurrentParallelism value in response to application load. The service can increase CurrentParallelism up to the maximum parallelism, which is ParalellismPerKPU times the maximum KPUs for the application. The maximum KPUs for an application is 32 by default, and can be increased by requesting a limit increase. If application load is reduced, the service will reduce CurrentParallelism down to the Parallelism setting.
     */
    ParallelismUpdate?: Parallelism;
    /**
     * Describes updates to the number of parallel tasks an application can perform per Kinesis Processing Unit (KPU) used by the application.
     */
    ParallelismPerKPUUpdate?: ParallelismPerKPU;
    /**
     * Describes updates to whether the Kinesis Data Analytics service can increase the parallelism of a Flink-based Kinesis Data Analytics application in response to increased throughput.
     */
    AutoScalingEnabledUpdate?: BooleanObject;
  }
  export type ParallelismPerKPU = number;
  export type ParsedInputRecord = ParsedInputRecordField[];
  export type ParsedInputRecordField = string;
  export type ParsedInputRecords = ParsedInputRecord[];
  export type ProcessedInputRecord = string;
  export type ProcessedInputRecords = ProcessedInputRecord[];
  export interface PropertyGroup {
    /**
     * Describes the key of an application execution property key-value pair.
     */
    PropertyGroupId: Id;
    /**
     * Describes the value of an application execution property key-value pair.
     */
    PropertyMap: PropertyMap;
  }
  export type PropertyGroups = PropertyGroup[];
  export type PropertyKey = string;
  export type PropertyMap = {[key: string]: PropertyValue};
  export type PropertyValue = string;
  export type RawInputRecord = string;
  export type RawInputRecords = RawInputRecord[];
  export interface RecordColumn {
    /**
     * The name of the column that is created in the in-application input stream or reference table.
     */
    Name: RecordColumnName;
    /**
     * A reference to the data element in the streaming input or the reference data source.
     */
    Mapping?: RecordColumnMapping;
    /**
     * The type of column created in the in-application input stream or reference table.
     */
    SqlType: RecordColumnSqlType;
  }
  export type RecordColumnDelimiter = string;
  export type RecordColumnMapping = string;
  export type RecordColumnName = string;
  export type RecordColumnSqlType = string;
  export type RecordColumns = RecordColumn[];
  export type RecordEncoding = string;
  export interface RecordFormat {
    /**
     * The type of record format.
     */
    RecordFormatType: RecordFormatType;
    /**
     * When you configure application input at the time of creating or updating an application, provides additional mapping information specific to the record format (such as JSON, CSV, or record fields delimited by some delimiter) on the streaming source.
     */
    MappingParameters?: MappingParameters;
  }
  export type RecordFormatType = "JSON"|"CSV"|string;
  export type RecordRowDelimiter = string;
  export type RecordRowPath = string;
  export interface ReferenceDataSource {
    /**
     * The name of the in-application table to create.
     */
    TableName: InAppTableName;
    /**
     * Identifies the S3 bucket and object that contains the reference data. A Kinesis Data Analytics application loads reference data only once. If the data changes, you call the UpdateApplication operation to trigger reloading of data into your application. 
     */
    S3ReferenceDataSource?: S3ReferenceDataSource;
    /**
     * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns created in the in-application stream.
     */
    ReferenceSchema: SourceSchema;
  }
  export interface ReferenceDataSourceDescription {
    /**
     * The ID of the reference data source. This is the ID that Kinesis Data Analytics assigns when you add the reference data source to your application using the CreateApplication or UpdateApplication operation.
     */
    ReferenceId: Id;
    /**
     * The in-application table name created by the specific reference data source configuration.
     */
    TableName: InAppTableName;
    /**
     * Provides the Amazon S3 bucket name, the object key name that contains the reference data. 
     */
    S3ReferenceDataSourceDescription: S3ReferenceDataSourceDescription;
    /**
     * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns created in the in-application stream.
     */
    ReferenceSchema?: SourceSchema;
  }
  export type ReferenceDataSourceDescriptions = ReferenceDataSourceDescription[];
  export interface ReferenceDataSourceUpdate {
    /**
     * The ID of the reference data source that is being updated. You can use the DescribeApplication operation to get this value.
     */
    ReferenceId: Id;
    /**
     * The in-application table name that is created by this update.
     */
    TableNameUpdate?: InAppTableName;
    /**
     * Describes the S3 bucket name, object key name, and IAM role that Kinesis Data Analytics can assume to read the Amazon S3 object on your behalf and populate the in-application reference table.
     */
    S3ReferenceDataSourceUpdate?: S3ReferenceDataSourceUpdate;
    /**
     * Describes the format of the data in the streaming source, and how each data element maps to corresponding columns created in the in-application stream. 
     */
    ReferenceSchemaUpdate?: SourceSchema;
  }
  export type ReferenceDataSourceUpdates = ReferenceDataSourceUpdate[];
  export type ReferenceDataSources = ReferenceDataSource[];
  export type ResourceARN = string;
  export type RoleARN = string;
  export interface RollbackApplicationRequest {
    /**
     * The name of the application.
     */
    ApplicationName: ApplicationName;
    /**
     * The current application version ID. You can retrieve the application version ID using DescribeApplication.
     */
    CurrentApplicationVersionId: ApplicationVersionId;
  }
  export interface RollbackApplicationResponse {
    ApplicationDetail: ApplicationDetail;
  }
  export interface RunConfiguration {
    /**
     * Describes the starting parameters for a Flink-based Kinesis Data Analytics application.
     */
    FlinkRunConfiguration?: FlinkRunConfiguration;
    /**
     * Describes the starting parameters for a SQL-based Kinesis Data Analytics application application.
     */
    SqlRunConfigurations?: SqlRunConfigurations;
    /**
     * Describes the restore behavior of a restarting application.
     */
    ApplicationRestoreConfiguration?: ApplicationRestoreConfiguration;
  }
  export interface RunConfigurationDescription {
    /**
     * Describes the restore behavior of a restarting application.
     */
    ApplicationRestoreConfigurationDescription?: ApplicationRestoreConfiguration;
    FlinkRunConfigurationDescription?: FlinkRunConfiguration;
  }
  export interface RunConfigurationUpdate {
    /**
     * Describes the starting parameters for a Flink-based Kinesis Data Analytics application.
     */
    FlinkRunConfiguration?: FlinkRunConfiguration;
    /**
     * Describes updates to the restore behavior of a restarting application.
     */
    ApplicationRestoreConfiguration?: ApplicationRestoreConfiguration;
  }
  export type RuntimeEnvironment = "SQL-1_0"|"FLINK-1_6"|"FLINK-1_8"|"ZEPPELIN-FLINK-1_0"|"FLINK-1_11"|"FLINK-1_13"|"ZEPPELIN-FLINK-2_0"|string;
  export interface S3ApplicationCodeLocationDescription {
    /**
     * The Amazon Resource Name (ARN) for the S3 bucket containing the application code.
     */
    BucketARN: BucketARN;
    /**
     * The file key for the object containing the application code.
     */
    FileKey: FileKey;
    /**
     * The version of the object containing the application code.
     */
    ObjectVersion?: ObjectVersion;
  }
  export interface S3Configuration {
    /**
     * The ARN of the S3 bucket that contains the data.
     */
    BucketARN: BucketARN;
    /**
     * The name of the object that contains the data.
     */
    FileKey: FileKey;
  }
  export interface S3ContentBaseLocation {
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket.
     */
    BucketARN: BucketARN;
    /**
     * The base path for the S3 bucket.
     */
    BasePath?: BasePath;
  }
  export interface S3ContentBaseLocationDescription {
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket.
     */
    BucketARN: BucketARN;
    /**
     * The base path for the S3 bucket.
     */
    BasePath?: BasePath;
  }
  export interface S3ContentBaseLocationUpdate {
    /**
     * The updated Amazon Resource Name (ARN) of the S3 bucket.
     */
    BucketARNUpdate?: BucketARN;
    /**
     * The updated S3 bucket path.
     */
    BasePathUpdate?: BasePath;
  }
  export interface S3ContentLocation {
    /**
     * The Amazon Resource Name (ARN) for the S3 bucket containing the application code.
     */
    BucketARN: BucketARN;
    /**
     * The file key for the object containing the application code.
     */
    FileKey: FileKey;
    /**
     * The version of the object containing the application code.
     */
    ObjectVersion?: ObjectVersion;
  }
  export interface S3ContentLocationUpdate {
    /**
     * The new Amazon Resource Name (ARN) for the S3 bucket containing the application code.
     */
    BucketARNUpdate?: BucketARN;
    /**
     * The new file key for the object containing the application code.
     */
    FileKeyUpdate?: FileKey;
    /**
     * The new version of the object containing the application code.
     */
    ObjectVersionUpdate?: ObjectVersion;
  }
  export interface S3ReferenceDataSource {
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket.
     */
    BucketARN?: BucketARN;
    /**
     * The object key name containing the reference data.
     */
    FileKey?: FileKey;
  }
  export interface S3ReferenceDataSourceDescription {
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket.
     */
    BucketARN: BucketARN;
    /**
     * Amazon S3 object key name.
     */
    FileKey: FileKey;
    /**
     * The ARN of the IAM role that Kinesis Data Analytics can assume to read the Amazon S3 object on your behalf to populate the in-application reference table.   Provided for backward compatibility. Applications that are created with the current API version have an application-level service execution role rather than a resource-level role. 
     */
    ReferenceRoleARN?: RoleARN;
  }
  export interface S3ReferenceDataSourceUpdate {
    /**
     * The Amazon Resource Name (ARN) of the S3 bucket.
     */
    BucketARNUpdate?: BucketARN;
    /**
     * The object key name.
     */
    FileKeyUpdate?: FileKey;
  }
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export type SessionExpirationDurationInSeconds = number;
  export interface SnapshotDetails {
    /**
     * The identifier for the application snapshot.
     */
    SnapshotName: SnapshotName;
    /**
     * The status of the application snapshot.
     */
    SnapshotStatus: SnapshotStatus;
    /**
     * The current application version ID when the snapshot was created.
     */
    ApplicationVersionId: ApplicationVersionId;
    /**
     * The timestamp of the application snapshot.
     */
    SnapshotCreationTimestamp?: Timestamp;
  }
  export type SnapshotName = string;
  export type SnapshotStatus = "CREATING"|"READY"|"DELETING"|"FAILED"|string;
  export type SnapshotSummaries = SnapshotDetails[];
  export interface SourceSchema {
    /**
     * Specifies the format of the records on the streaming source.
     */
    RecordFormat: RecordFormat;
    /**
     * Specifies the encoding of the records in the streaming source. For example, UTF-8.
     */
    RecordEncoding?: RecordEncoding;
    /**
     * A list of RecordColumn objects. 
     */
    RecordColumns: RecordColumns;
  }
  export interface SqlApplicationConfiguration {
    /**
     * The array of Input objects describing the input streams used by the application.
     */
    Inputs?: Inputs;
    /**
     * The array of Output objects describing the destination streams used by the application.
     */
    Outputs?: Outputs;
    /**
     * The array of ReferenceDataSource objects describing the reference data sources used by the application.
     */
    ReferenceDataSources?: ReferenceDataSources;
  }
  export interface SqlApplicationConfigurationDescription {
    /**
     * The array of InputDescription objects describing the input streams used by the application.
     */
    InputDescriptions?: InputDescriptions;
    /**
     * The array of OutputDescription objects describing the destination streams used by the application.
     */
    OutputDescriptions?: OutputDescriptions;
    /**
     * The array of ReferenceDataSourceDescription objects describing the reference data sources used by the application.
     */
    ReferenceDataSourceDescriptions?: ReferenceDataSourceDescriptions;
  }
  export interface SqlApplicationConfigurationUpdate {
    /**
     * The array of InputUpdate objects describing the new input streams used by the application.
     */
    InputUpdates?: InputUpdates;
    /**
     * The array of OutputUpdate objects describing the new destination streams used by the application.
     */
    OutputUpdates?: OutputUpdates;
    /**
     * The array of ReferenceDataSourceUpdate objects describing the new reference data sources used by the application.
     */
    ReferenceDataSourceUpdates?: ReferenceDataSourceUpdates;
  }
  export interface SqlRunConfiguration {
    /**
     * The input source ID. You can get this ID by calling the DescribeApplication operation. 
     */
    InputId: Id;
    /**
     * The point at which you want the application to start processing records from the streaming source. 
     */
    InputStartingPositionConfiguration: InputStartingPositionConfiguration;
  }
  export type SqlRunConfigurations = SqlRunConfiguration[];
  export interface StartApplicationRequest {
    /**
     * The name of the application.
     */
    ApplicationName: ApplicationName;
    /**
     * Identifies the run configuration (start parameters) of a Kinesis Data Analytics application.
     */
    RunConfiguration?: RunConfiguration;
  }
  export interface StartApplicationResponse {
  }
  export interface StopApplicationRequest {
    /**
     * The name of the running application to stop.
     */
    ApplicationName: ApplicationName;
    /**
     * Set to true to force the application to stop. If you set Force to true, Kinesis Data Analytics stops the application without taking a snapshot.   Force-stopping your application may lead to data loss or duplication. To prevent data loss or duplicate processing of data during application restarts, we recommend you to take frequent snapshots of your application.  You can only force stop a Flink-based Kinesis Data Analytics application. You can't force stop a SQL-based Kinesis Data Analytics application. The application must be in the STARTING, UPDATING, STOPPING, AUTOSCALING, or RUNNING status. 
     */
    Force?: BooleanObject;
  }
  export interface StopApplicationResponse {
  }
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export interface Tag {
    /**
     * The key of the key-value tag.
     */
    Key: TagKey;
    /**
     * The value of the key-value tag. The value is optional.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * The ARN of the application to assign the tags.
     */
    ResourceARN: KinesisAnalyticsARN;
    /**
     * The key-value tags to assign to the application.
     */
    Tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export type TextContent = string;
  export type Timestamp = Date;
  export interface UntagResourceRequest {
    /**
     * The ARN of the Kinesis Data Analytics application from which to remove the tags.
     */
    ResourceARN: KinesisAnalyticsARN;
    /**
     * A list of keys of tags to remove from the specified application.
     */
    TagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateApplicationMaintenanceConfigurationRequest {
    /**
     * The name of the application for which you want to update the maintenance configuration.
     */
    ApplicationName: ApplicationName;
    /**
     * Describes the application maintenance configuration update.
     */
    ApplicationMaintenanceConfigurationUpdate: ApplicationMaintenanceConfigurationUpdate;
  }
  export interface UpdateApplicationMaintenanceConfigurationResponse {
    /**
     * The Amazon Resource Name (ARN) of the application.
     */
    ApplicationARN?: ResourceARN;
    /**
     * The application maintenance configuration description after the update.
     */
    ApplicationMaintenanceConfigurationDescription?: ApplicationMaintenanceConfigurationDescription;
  }
  export interface UpdateApplicationRequest {
    /**
     * The name of the application to update.
     */
    ApplicationName: ApplicationName;
    /**
     * The current application version ID. You must provide the CurrentApplicationVersionId or the ConditionalToken.You can retrieve the application version ID using DescribeApplication. For better concurrency support, use the ConditionalToken parameter instead of CurrentApplicationVersionId.
     */
    CurrentApplicationVersionId?: ApplicationVersionId;
    /**
     * Describes application configuration updates.
     */
    ApplicationConfigurationUpdate?: ApplicationConfigurationUpdate;
    /**
     * Describes updates to the service execution role.
     */
    ServiceExecutionRoleUpdate?: RoleARN;
    /**
     * Describes updates to the application's starting parameters.
     */
    RunConfigurationUpdate?: RunConfigurationUpdate;
    /**
     * Describes application Amazon CloudWatch logging option updates. You can only update existing CloudWatch logging options with this action. To add a new CloudWatch logging option, use AddApplicationCloudWatchLoggingOption.
     */
    CloudWatchLoggingOptionUpdates?: CloudWatchLoggingOptionUpdates;
    /**
     * A value you use to implement strong concurrency for application updates. You must provide the CurrentApplicationVersionId or the ConditionalToken. You get the application's current ConditionalToken using DescribeApplication. For better concurrency support, use the ConditionalToken parameter instead of CurrentApplicationVersionId.
     */
    ConditionalToken?: ConditionalToken;
  }
  export interface UpdateApplicationResponse {
    /**
     * Describes application updates.
     */
    ApplicationDetail: ApplicationDetail;
  }
  export type UrlType = "FLINK_DASHBOARD_URL"|"ZEPPELIN_UI_URL"|string;
  export interface VpcConfiguration {
    /**
     * The array of Subnet IDs used by the VPC configuration.
     */
    SubnetIds: SubnetIds;
    /**
     * The array of SecurityGroup IDs used by the VPC configuration.
     */
    SecurityGroupIds: SecurityGroupIds;
  }
  export interface VpcConfigurationDescription {
    /**
     * The ID of the VPC configuration.
     */
    VpcConfigurationId: Id;
    /**
     * The ID of the associated VPC.
     */
    VpcId: VpcId;
    /**
     * The array of Subnet IDs used by the VPC configuration.
     */
    SubnetIds: SubnetIds;
    /**
     * The array of SecurityGroup IDs used by the VPC configuration.
     */
    SecurityGroupIds: SecurityGroupIds;
  }
  export type VpcConfigurationDescriptions = VpcConfigurationDescription[];
  export interface VpcConfigurationUpdate {
    /**
     * Describes an update to the ID of the VPC configuration.
     */
    VpcConfigurationId: Id;
    /**
     * Describes updates to the array of Subnet IDs used by the VPC configuration.
     */
    SubnetIdUpdates?: SubnetIds;
    /**
     * Describes updates to the array of SecurityGroup IDs used by the VPC configuration.
     */
    SecurityGroupIdUpdates?: SecurityGroupIds;
  }
  export type VpcConfigurationUpdates = VpcConfigurationUpdate[];
  export type VpcConfigurations = VpcConfiguration[];
  export type VpcId = string;
  export interface ZeppelinApplicationConfiguration {
    /**
     * The monitoring configuration of a Kinesis Data Analytics Studio notebook.
     */
    MonitoringConfiguration?: ZeppelinMonitoringConfiguration;
    /**
     * The Amazon Glue Data Catalog that you use in queries in a Kinesis Data Analytics Studio notebook.
     */
    CatalogConfiguration?: CatalogConfiguration;
    /**
     * The information required to deploy a Kinesis Data Analytics Studio notebook as an application with durable state.
     */
    DeployAsApplicationConfiguration?: DeployAsApplicationConfiguration;
    /**
     * Custom artifacts are dependency JARs and user-defined functions (UDF).
     */
    CustomArtifactsConfiguration?: CustomArtifactsConfigurationList;
  }
  export interface ZeppelinApplicationConfigurationDescription {
    /**
     * The monitoring configuration of a Kinesis Data Analytics Studio notebook.
     */
    MonitoringConfigurationDescription: ZeppelinMonitoringConfigurationDescription;
    /**
     * The Amazon Glue Data Catalog that is associated with the Kinesis Data Analytics Studio notebook.
     */
    CatalogConfigurationDescription?: CatalogConfigurationDescription;
    /**
     * The parameters required to deploy a Kinesis Data Analytics Studio notebook as an application with durable state.
     */
    DeployAsApplicationConfigurationDescription?: DeployAsApplicationConfigurationDescription;
    /**
     * Custom artifacts are dependency JARs and user-defined functions (UDF).
     */
    CustomArtifactsConfigurationDescription?: CustomArtifactsConfigurationDescriptionList;
  }
  export interface ZeppelinApplicationConfigurationUpdate {
    /**
     * Updates to the monitoring configuration of a Kinesis Data Analytics Studio notebook.
     */
    MonitoringConfigurationUpdate?: ZeppelinMonitoringConfigurationUpdate;
    /**
     * Updates to the configuration of the Amazon Glue Data Catalog that is associated with the Kinesis Data Analytics Studio notebook.
     */
    CatalogConfigurationUpdate?: CatalogConfigurationUpdate;
    DeployAsApplicationConfigurationUpdate?: DeployAsApplicationConfigurationUpdate;
    /**
     * Updates to the customer artifacts. Custom artifacts are dependency JAR files and user-defined functions (UDF).
     */
    CustomArtifactsConfigurationUpdate?: CustomArtifactsConfigurationList;
  }
  export interface ZeppelinMonitoringConfiguration {
    /**
     * The verbosity of the CloudWatch Logs for an application.
     */
    LogLevel: LogLevel;
  }
  export interface ZeppelinMonitoringConfigurationDescription {
    /**
     * Describes the verbosity of the CloudWatch Logs for an application.
     */
    LogLevel?: LogLevel;
  }
  export interface ZeppelinMonitoringConfigurationUpdate {
    /**
     * Updates to the logging level for Apache Zeppelin within a Kinesis Data Analytics Studio notebook.
     */
    LogLevelUpdate: LogLevel;
  }
  export type ZipFileContent = Buffer|Uint8Array|Blob|string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-23"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the KinesisAnalyticsV2 client.
   */
  export import Types = KinesisAnalyticsV2;
}
export = KinesisAnalyticsV2;
