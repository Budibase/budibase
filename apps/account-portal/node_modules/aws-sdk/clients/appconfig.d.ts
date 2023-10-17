import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AppConfig extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AppConfig.Types.ClientConfiguration)
  config: Config & AppConfig.Types.ClientConfiguration;
  /**
   * An application in AppConfig is a logical unit of code that provides capabilities for your customers. For example, an application can be a microservice that runs on Amazon EC2 instances, a mobile application installed by your users, a serverless application using Amazon API Gateway and AWS Lambda, or any system you run on behalf of others.
   */
  createApplication(params: AppConfig.Types.CreateApplicationRequest, callback?: (err: AWSError, data: AppConfig.Types.Application) => void): Request<AppConfig.Types.Application, AWSError>;
  /**
   * An application in AppConfig is a logical unit of code that provides capabilities for your customers. For example, an application can be a microservice that runs on Amazon EC2 instances, a mobile application installed by your users, a serverless application using Amazon API Gateway and AWS Lambda, or any system you run on behalf of others.
   */
  createApplication(callback?: (err: AWSError, data: AppConfig.Types.Application) => void): Request<AppConfig.Types.Application, AWSError>;
  /**
   * Information that enables AppConfig to access the configuration source. Valid configuration sources include Systems Manager (SSM) documents, SSM Parameter Store parameters, and Amazon S3 objects. A configuration profile includes the following information.   The Uri location of the configuration data.   The AWS Identity and Access Management (IAM) role that provides access to the configuration data.   A validator for the configuration data. Available validators include either a JSON Schema or an AWS Lambda function.   For more information, see Create a Configuration and a Configuration Profile in the AWS AppConfig User Guide.
   */
  createConfigurationProfile(params: AppConfig.Types.CreateConfigurationProfileRequest, callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfile) => void): Request<AppConfig.Types.ConfigurationProfile, AWSError>;
  /**
   * Information that enables AppConfig to access the configuration source. Valid configuration sources include Systems Manager (SSM) documents, SSM Parameter Store parameters, and Amazon S3 objects. A configuration profile includes the following information.   The Uri location of the configuration data.   The AWS Identity and Access Management (IAM) role that provides access to the configuration data.   A validator for the configuration data. Available validators include either a JSON Schema or an AWS Lambda function.   For more information, see Create a Configuration and a Configuration Profile in the AWS AppConfig User Guide.
   */
  createConfigurationProfile(callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfile) => void): Request<AppConfig.Types.ConfigurationProfile, AWSError>;
  /**
   * A deployment strategy defines important criteria for rolling out your configuration to the designated targets. A deployment strategy includes: the overall duration required, a percentage of targets to receive the deployment during each interval, an algorithm that defines how percentage grows, and bake time.
   */
  createDeploymentStrategy(params: AppConfig.Types.CreateDeploymentStrategyRequest, callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategy) => void): Request<AppConfig.Types.DeploymentStrategy, AWSError>;
  /**
   * A deployment strategy defines important criteria for rolling out your configuration to the designated targets. A deployment strategy includes: the overall duration required, a percentage of targets to receive the deployment during each interval, an algorithm that defines how percentage grows, and bake time.
   */
  createDeploymentStrategy(callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategy) => void): Request<AppConfig.Types.DeploymentStrategy, AWSError>;
  /**
   * For each application, you define one or more environments. An environment is a logical deployment group of AppConfig targets, such as applications in a Beta or Production environment. You can also define environments for application subcomponents such as the Web, Mobile and Back-end components for your application. You can configure Amazon CloudWatch alarms for each environment. The system monitors alarms during a configuration deployment. If an alarm is triggered, the system rolls back the configuration.
   */
  createEnvironment(params: AppConfig.Types.CreateEnvironmentRequest, callback?: (err: AWSError, data: AppConfig.Types.Environment) => void): Request<AppConfig.Types.Environment, AWSError>;
  /**
   * For each application, you define one or more environments. An environment is a logical deployment group of AppConfig targets, such as applications in a Beta or Production environment. You can also define environments for application subcomponents such as the Web, Mobile and Back-end components for your application. You can configure Amazon CloudWatch alarms for each environment. The system monitors alarms during a configuration deployment. If an alarm is triggered, the system rolls back the configuration.
   */
  createEnvironment(callback?: (err: AWSError, data: AppConfig.Types.Environment) => void): Request<AppConfig.Types.Environment, AWSError>;
  /**
   * Create a new configuration in the AppConfig configuration store.
   */
  createHostedConfigurationVersion(params: AppConfig.Types.CreateHostedConfigurationVersionRequest, callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersion) => void): Request<AppConfig.Types.HostedConfigurationVersion, AWSError>;
  /**
   * Create a new configuration in the AppConfig configuration store.
   */
  createHostedConfigurationVersion(callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersion) => void): Request<AppConfig.Types.HostedConfigurationVersion, AWSError>;
  /**
   * Delete an application. Deleting an application does not delete a configuration from a host.
   */
  deleteApplication(params: AppConfig.Types.DeleteApplicationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an application. Deleting an application does not delete a configuration from a host.
   */
  deleteApplication(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a configuration profile. Deleting a configuration profile does not delete a configuration from a host.
   */
  deleteConfigurationProfile(params: AppConfig.Types.DeleteConfigurationProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a configuration profile. Deleting a configuration profile does not delete a configuration from a host.
   */
  deleteConfigurationProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a deployment strategy. Deleting a deployment strategy does not delete a configuration from a host.
   */
  deleteDeploymentStrategy(params: AppConfig.Types.DeleteDeploymentStrategyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a deployment strategy. Deleting a deployment strategy does not delete a configuration from a host.
   */
  deleteDeploymentStrategy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an environment. Deleting an environment does not delete a configuration from a host.
   */
  deleteEnvironment(params: AppConfig.Types.DeleteEnvironmentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete an environment. Deleting an environment does not delete a configuration from a host.
   */
  deleteEnvironment(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a version of a configuration from the AppConfig configuration store.
   */
  deleteHostedConfigurationVersion(params: AppConfig.Types.DeleteHostedConfigurationVersionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete a version of a configuration from the AppConfig configuration store.
   */
  deleteHostedConfigurationVersion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieve information about an application.
   */
  getApplication(params: AppConfig.Types.GetApplicationRequest, callback?: (err: AWSError, data: AppConfig.Types.Application) => void): Request<AppConfig.Types.Application, AWSError>;
  /**
   * Retrieve information about an application.
   */
  getApplication(callback?: (err: AWSError, data: AppConfig.Types.Application) => void): Request<AppConfig.Types.Application, AWSError>;
  /**
   * Receive information about a configuration.  AWS AppConfig uses the value of the ClientConfigurationVersion parameter to identify the configuration version on your clients. If you don’t send ClientConfigurationVersion with each call to GetConfiguration, your clients receive the current configuration. You are charged each time your clients receive a configuration. To avoid excess charges, we recommend that you include the ClientConfigurationVersion value with every call to GetConfiguration. This value must be saved on your client. Subsequent calls to GetConfiguration must pass this value by using the ClientConfigurationVersion parameter.  
   */
  getConfiguration(params: AppConfig.Types.GetConfigurationRequest, callback?: (err: AWSError, data: AppConfig.Types.Configuration) => void): Request<AppConfig.Types.Configuration, AWSError>;
  /**
   * Receive information about a configuration.  AWS AppConfig uses the value of the ClientConfigurationVersion parameter to identify the configuration version on your clients. If you don’t send ClientConfigurationVersion with each call to GetConfiguration, your clients receive the current configuration. You are charged each time your clients receive a configuration. To avoid excess charges, we recommend that you include the ClientConfigurationVersion value with every call to GetConfiguration. This value must be saved on your client. Subsequent calls to GetConfiguration must pass this value by using the ClientConfigurationVersion parameter.  
   */
  getConfiguration(callback?: (err: AWSError, data: AppConfig.Types.Configuration) => void): Request<AppConfig.Types.Configuration, AWSError>;
  /**
   * Retrieve information about a configuration profile.
   */
  getConfigurationProfile(params: AppConfig.Types.GetConfigurationProfileRequest, callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfile) => void): Request<AppConfig.Types.ConfigurationProfile, AWSError>;
  /**
   * Retrieve information about a configuration profile.
   */
  getConfigurationProfile(callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfile) => void): Request<AppConfig.Types.ConfigurationProfile, AWSError>;
  /**
   * Retrieve information about a configuration deployment.
   */
  getDeployment(params: AppConfig.Types.GetDeploymentRequest, callback?: (err: AWSError, data: AppConfig.Types.Deployment) => void): Request<AppConfig.Types.Deployment, AWSError>;
  /**
   * Retrieve information about a configuration deployment.
   */
  getDeployment(callback?: (err: AWSError, data: AppConfig.Types.Deployment) => void): Request<AppConfig.Types.Deployment, AWSError>;
  /**
   * Retrieve information about a deployment strategy. A deployment strategy defines important criteria for rolling out your configuration to the designated targets. A deployment strategy includes: the overall duration required, a percentage of targets to receive the deployment during each interval, an algorithm that defines how percentage grows, and bake time.
   */
  getDeploymentStrategy(params: AppConfig.Types.GetDeploymentStrategyRequest, callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategy) => void): Request<AppConfig.Types.DeploymentStrategy, AWSError>;
  /**
   * Retrieve information about a deployment strategy. A deployment strategy defines important criteria for rolling out your configuration to the designated targets. A deployment strategy includes: the overall duration required, a percentage of targets to receive the deployment during each interval, an algorithm that defines how percentage grows, and bake time.
   */
  getDeploymentStrategy(callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategy) => void): Request<AppConfig.Types.DeploymentStrategy, AWSError>;
  /**
   * Retrieve information about an environment. An environment is a logical deployment group of AppConfig applications, such as applications in a Production environment or in an EU_Region environment. Each configuration deployment targets an environment. You can enable one or more Amazon CloudWatch alarms for an environment. If an alarm is triggered during a deployment, AppConfig roles back the configuration.
   */
  getEnvironment(params: AppConfig.Types.GetEnvironmentRequest, callback?: (err: AWSError, data: AppConfig.Types.Environment) => void): Request<AppConfig.Types.Environment, AWSError>;
  /**
   * Retrieve information about an environment. An environment is a logical deployment group of AppConfig applications, such as applications in a Production environment or in an EU_Region environment. Each configuration deployment targets an environment. You can enable one or more Amazon CloudWatch alarms for an environment. If an alarm is triggered during a deployment, AppConfig roles back the configuration.
   */
  getEnvironment(callback?: (err: AWSError, data: AppConfig.Types.Environment) => void): Request<AppConfig.Types.Environment, AWSError>;
  /**
   * Get information about a specific configuration version.
   */
  getHostedConfigurationVersion(params: AppConfig.Types.GetHostedConfigurationVersionRequest, callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersion) => void): Request<AppConfig.Types.HostedConfigurationVersion, AWSError>;
  /**
   * Get information about a specific configuration version.
   */
  getHostedConfigurationVersion(callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersion) => void): Request<AppConfig.Types.HostedConfigurationVersion, AWSError>;
  /**
   * List all applications in your AWS account.
   */
  listApplications(params: AppConfig.Types.ListApplicationsRequest, callback?: (err: AWSError, data: AppConfig.Types.Applications) => void): Request<AppConfig.Types.Applications, AWSError>;
  /**
   * List all applications in your AWS account.
   */
  listApplications(callback?: (err: AWSError, data: AppConfig.Types.Applications) => void): Request<AppConfig.Types.Applications, AWSError>;
  /**
   * Lists the configuration profiles for an application.
   */
  listConfigurationProfiles(params: AppConfig.Types.ListConfigurationProfilesRequest, callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfiles) => void): Request<AppConfig.Types.ConfigurationProfiles, AWSError>;
  /**
   * Lists the configuration profiles for an application.
   */
  listConfigurationProfiles(callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfiles) => void): Request<AppConfig.Types.ConfigurationProfiles, AWSError>;
  /**
   * List deployment strategies.
   */
  listDeploymentStrategies(params: AppConfig.Types.ListDeploymentStrategiesRequest, callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategies) => void): Request<AppConfig.Types.DeploymentStrategies, AWSError>;
  /**
   * List deployment strategies.
   */
  listDeploymentStrategies(callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategies) => void): Request<AppConfig.Types.DeploymentStrategies, AWSError>;
  /**
   * Lists the deployments for an environment.
   */
  listDeployments(params: AppConfig.Types.ListDeploymentsRequest, callback?: (err: AWSError, data: AppConfig.Types.Deployments) => void): Request<AppConfig.Types.Deployments, AWSError>;
  /**
   * Lists the deployments for an environment.
   */
  listDeployments(callback?: (err: AWSError, data: AppConfig.Types.Deployments) => void): Request<AppConfig.Types.Deployments, AWSError>;
  /**
   * List the environments for an application.
   */
  listEnvironments(params: AppConfig.Types.ListEnvironmentsRequest, callback?: (err: AWSError, data: AppConfig.Types.Environments) => void): Request<AppConfig.Types.Environments, AWSError>;
  /**
   * List the environments for an application.
   */
  listEnvironments(callback?: (err: AWSError, data: AppConfig.Types.Environments) => void): Request<AppConfig.Types.Environments, AWSError>;
  /**
   * View a list of configurations stored in the AppConfig configuration store by version.
   */
  listHostedConfigurationVersions(params: AppConfig.Types.ListHostedConfigurationVersionsRequest, callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersions) => void): Request<AppConfig.Types.HostedConfigurationVersions, AWSError>;
  /**
   * View a list of configurations stored in the AppConfig configuration store by version.
   */
  listHostedConfigurationVersions(callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersions) => void): Request<AppConfig.Types.HostedConfigurationVersions, AWSError>;
  /**
   * Retrieves the list of key-value tags assigned to the resource.
   */
  listTagsForResource(params: AppConfig.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: AppConfig.Types.ResourceTags) => void): Request<AppConfig.Types.ResourceTags, AWSError>;
  /**
   * Retrieves the list of key-value tags assigned to the resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: AppConfig.Types.ResourceTags) => void): Request<AppConfig.Types.ResourceTags, AWSError>;
  /**
   * Starts a deployment.
   */
  startDeployment(params: AppConfig.Types.StartDeploymentRequest, callback?: (err: AWSError, data: AppConfig.Types.Deployment) => void): Request<AppConfig.Types.Deployment, AWSError>;
  /**
   * Starts a deployment.
   */
  startDeployment(callback?: (err: AWSError, data: AppConfig.Types.Deployment) => void): Request<AppConfig.Types.Deployment, AWSError>;
  /**
   * Stops a deployment. This API action works only on deployments that have a status of DEPLOYING. This action moves the deployment to a status of ROLLED_BACK.
   */
  stopDeployment(params: AppConfig.Types.StopDeploymentRequest, callback?: (err: AWSError, data: AppConfig.Types.Deployment) => void): Request<AppConfig.Types.Deployment, AWSError>;
  /**
   * Stops a deployment. This API action works only on deployments that have a status of DEPLOYING. This action moves the deployment to a status of ROLLED_BACK.
   */
  stopDeployment(callback?: (err: AWSError, data: AppConfig.Types.Deployment) => void): Request<AppConfig.Types.Deployment, AWSError>;
  /**
   * Metadata to assign to an AppConfig resource. Tags help organize and categorize your AppConfig resources. Each tag consists of a key and an optional value, both of which you define. You can specify a maximum of 50 tags for a resource.
   */
  tagResource(params: AppConfig.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Metadata to assign to an AppConfig resource. Tags help organize and categorize your AppConfig resources. Each tag consists of a key and an optional value, both of which you define. You can specify a maximum of 50 tags for a resource.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a tag key and value from an AppConfig resource.
   */
  untagResource(params: AppConfig.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a tag key and value from an AppConfig resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an application.
   */
  updateApplication(params: AppConfig.Types.UpdateApplicationRequest, callback?: (err: AWSError, data: AppConfig.Types.Application) => void): Request<AppConfig.Types.Application, AWSError>;
  /**
   * Updates an application.
   */
  updateApplication(callback?: (err: AWSError, data: AppConfig.Types.Application) => void): Request<AppConfig.Types.Application, AWSError>;
  /**
   * Updates a configuration profile.
   */
  updateConfigurationProfile(params: AppConfig.Types.UpdateConfigurationProfileRequest, callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfile) => void): Request<AppConfig.Types.ConfigurationProfile, AWSError>;
  /**
   * Updates a configuration profile.
   */
  updateConfigurationProfile(callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfile) => void): Request<AppConfig.Types.ConfigurationProfile, AWSError>;
  /**
   * Updates a deployment strategy.
   */
  updateDeploymentStrategy(params: AppConfig.Types.UpdateDeploymentStrategyRequest, callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategy) => void): Request<AppConfig.Types.DeploymentStrategy, AWSError>;
  /**
   * Updates a deployment strategy.
   */
  updateDeploymentStrategy(callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategy) => void): Request<AppConfig.Types.DeploymentStrategy, AWSError>;
  /**
   * Updates an environment.
   */
  updateEnvironment(params: AppConfig.Types.UpdateEnvironmentRequest, callback?: (err: AWSError, data: AppConfig.Types.Environment) => void): Request<AppConfig.Types.Environment, AWSError>;
  /**
   * Updates an environment.
   */
  updateEnvironment(callback?: (err: AWSError, data: AppConfig.Types.Environment) => void): Request<AppConfig.Types.Environment, AWSError>;
  /**
   * Uses the validators in a configuration profile to validate a configuration.
   */
  validateConfiguration(params: AppConfig.Types.ValidateConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Uses the validators in a configuration profile to validate a configuration.
   */
  validateConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace AppConfig {
  export interface Application {
    /**
     * The application ID.
     */
    Id?: Id;
    /**
     * The application name.
     */
    Name?: Name;
    /**
     * The description of the application.
     */
    Description?: Description;
  }
  export type ApplicationList = Application[];
  export interface Applications {
    /**
     * The elements from this collection.
     */
    Items?: ApplicationList;
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export type Arn = string;
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export interface Configuration {
    /**
     * The content of the configuration or the configuration data.
     */
    Content?: _Blob;
    /**
     * The configuration version.
     */
    ConfigurationVersion?: Version;
    /**
     * A standard MIME type describing the format of the configuration content. For more information, see Content-Type.
     */
    ContentType?: String;
  }
  export interface ConfigurationProfile {
    /**
     * The application ID.
     */
    ApplicationId?: Id;
    /**
     * The configuration profile ID.
     */
    Id?: Id;
    /**
     * The name of the configuration profile.
     */
    Name?: Name;
    /**
     * The configuration profile description.
     */
    Description?: Description;
    /**
     * The URI location of the configuration.
     */
    LocationUri?: Uri;
    /**
     * The ARN of an IAM role with permission to access the configuration at the specified LocationUri.
     */
    RetrievalRoleArn?: RoleArn;
    /**
     * A list of methods for validating the configuration.
     */
    Validators?: ValidatorList;
  }
  export interface ConfigurationProfileSummary {
    /**
     * The application ID.
     */
    ApplicationId?: Id;
    /**
     * The ID of the configuration profile.
     */
    Id?: Id;
    /**
     * The name of the configuration profile.
     */
    Name?: Name;
    /**
     * The URI location of the configuration.
     */
    LocationUri?: Uri;
    /**
     * The types of validators in the configuration profile.
     */
    ValidatorTypes?: ValidatorTypeList;
  }
  export type ConfigurationProfileSummaryList = ConfigurationProfileSummary[];
  export interface ConfigurationProfiles {
    /**
     * The elements from this collection.
     */
    Items?: ConfigurationProfileSummaryList;
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface CreateApplicationRequest {
    /**
     * A name for the application.
     */
    Name: Name;
    /**
     * A description of the application.
     */
    Description?: Description;
    /**
     * Metadata to assign to the application. Tags help organize and categorize your AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     */
    Tags?: TagMap;
  }
  export interface CreateConfigurationProfileRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * A name for the configuration profile.
     */
    Name: Name;
    /**
     * A description of the configuration profile.
     */
    Description?: Description;
    /**
     * A URI to locate the configuration. You can specify a Systems Manager (SSM) document, an SSM Parameter Store parameter, or an Amazon S3 object. For an SSM document, specify either the document name in the format ssm-document://&lt;Document_name&gt; or the Amazon Resource Name (ARN). For a parameter, specify either the parameter name in the format ssm-parameter://&lt;Parameter_name&gt; or the ARN. For an Amazon S3 object, specify the URI in the following format: s3://&lt;bucket&gt;/&lt;objectKey&gt; . Here is an example: s3://my-bucket/my-app/us-east-1/my-config.json
     */
    LocationUri: Uri;
    /**
     * The ARN of an IAM role with permission to access the configuration at the specified LocationUri.
     */
    RetrievalRoleArn?: RoleArn;
    /**
     * A list of methods for validating the configuration.
     */
    Validators?: ValidatorList;
    /**
     * Metadata to assign to the configuration profile. Tags help organize and categorize your AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     */
    Tags?: TagMap;
  }
  export interface CreateDeploymentStrategyRequest {
    /**
     * A name for the deployment strategy.
     */
    Name: Name;
    /**
     * A description of the deployment strategy.
     */
    Description?: Description;
    /**
     * Total amount of time for a deployment to last.
     */
    DeploymentDurationInMinutes: MinutesBetween0And24Hours;
    /**
     * The amount of time AppConfig monitors for alarms before considering the deployment to be complete and no longer eligible for automatic roll back.
     */
    FinalBakeTimeInMinutes?: MinutesBetween0And24Hours;
    /**
     * The percentage of targets to receive a deployed configuration during each interval.
     */
    GrowthFactor: GrowthFactor;
    /**
     * The algorithm used to define how percentage grows over time. AWS AppConfig supports the following growth types:  Linear: For this type, AppConfig processes the deployment by dividing the total number of targets by the value specified for Step percentage. For example, a linear deployment that uses a Step percentage of 10 deploys the configuration to 10 percent of the hosts. After those deployments are complete, the system deploys the configuration to the next 10 percent. This continues until 100% of the targets have successfully received the configuration.  Exponential: For this type, AppConfig processes the deployment exponentially using the following formula: G*(2^N). In this formula, G is the growth factor specified by the user and N is the number of steps until the configuration is deployed to all targets. For example, if you specify a growth factor of 2, then the system rolls out the configuration as follows:  2*(2^0)   2*(2^1)   2*(2^2)  Expressed numerically, the deployment rolls out as follows: 2% of the targets, 4% of the targets, 8% of the targets, and continues until the configuration has been deployed to all targets.
     */
    GrowthType?: GrowthType;
    /**
     * Save the deployment strategy to a Systems Manager (SSM) document.
     */
    ReplicateTo: ReplicateTo;
    /**
     * Metadata to assign to the deployment strategy. Tags help organize and categorize your AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     */
    Tags?: TagMap;
  }
  export interface CreateEnvironmentRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * A name for the environment.
     */
    Name: Name;
    /**
     * A description of the environment.
     */
    Description?: Description;
    /**
     * Amazon CloudWatch alarms to monitor during the deployment process.
     */
    Monitors?: MonitorList;
    /**
     * Metadata to assign to the environment. Tags help organize and categorize your AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     */
    Tags?: TagMap;
  }
  export interface CreateHostedConfigurationVersionRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The configuration profile ID.
     */
    ConfigurationProfileId: Id;
    /**
     * A description of the configuration.
     */
    Description?: Description;
    /**
     * The content of the configuration or the configuration data.
     */
    Content: _Blob;
    /**
     * A standard MIME type describing the format of the configuration content. For more information, see Content-Type.
     */
    ContentType: StringWithLengthBetween1And255;
    /**
     * An optional locking token used to prevent race conditions from overwriting configuration updates when creating a new version. To ensure your data is not overwritten when creating multiple hosted configuration versions in rapid succession, specify the version of the latest hosted configuration version.
     */
    LatestVersionNumber?: Integer;
  }
  export interface DeleteApplicationRequest {
    /**
     * The ID of the application to delete.
     */
    ApplicationId: Id;
  }
  export interface DeleteConfigurationProfileRequest {
    /**
     * The application ID that includes the configuration profile you want to delete.
     */
    ApplicationId: Id;
    /**
     * The ID of the configuration profile you want to delete.
     */
    ConfigurationProfileId: Id;
  }
  export interface DeleteDeploymentStrategyRequest {
    /**
     * The ID of the deployment strategy you want to delete.
     */
    DeploymentStrategyId: DeploymentStrategyId;
  }
  export interface DeleteEnvironmentRequest {
    /**
     * The application ID that includes the environment you want to delete.
     */
    ApplicationId: Id;
    /**
     * The ID of the environment you want to delete.
     */
    EnvironmentId: Id;
  }
  export interface DeleteHostedConfigurationVersionRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The configuration profile ID.
     */
    ConfigurationProfileId: Id;
    /**
     * The versions number to delete.
     */
    VersionNumber: Integer;
  }
  export interface Deployment {
    /**
     * The ID of the application that was deployed.
     */
    ApplicationId?: Id;
    /**
     * The ID of the environment that was deployed.
     */
    EnvironmentId?: Id;
    /**
     * The ID of the deployment strategy that was deployed.
     */
    DeploymentStrategyId?: Id;
    /**
     * The ID of the configuration profile that was deployed.
     */
    ConfigurationProfileId?: Id;
    /**
     * The sequence number of the deployment.
     */
    DeploymentNumber?: Integer;
    /**
     * The name of the configuration.
     */
    ConfigurationName?: Name;
    /**
     * Information about the source location of the configuration.
     */
    ConfigurationLocationUri?: Uri;
    /**
     * The configuration version that was deployed.
     */
    ConfigurationVersion?: Version;
    /**
     * The description of the deployment.
     */
    Description?: Description;
    /**
     * Total amount of time the deployment lasted.
     */
    DeploymentDurationInMinutes?: MinutesBetween0And24Hours;
    /**
     * The algorithm used to define how percentage grew over time.
     */
    GrowthType?: GrowthType;
    /**
     * The percentage of targets to receive a deployed configuration during each interval.
     */
    GrowthFactor?: Percentage;
    /**
     * The amount of time AppConfig monitored for alarms before considering the deployment to be complete and no longer eligible for automatic roll back.
     */
    FinalBakeTimeInMinutes?: MinutesBetween0And24Hours;
    /**
     * The state of the deployment.
     */
    State?: DeploymentState;
    /**
     * A list containing all events related to a deployment. The most recent events are displayed first.
     */
    EventLog?: DeploymentEvents;
    /**
     * The percentage of targets for which the deployment is available.
     */
    PercentageComplete?: Percentage;
    /**
     * The time the deployment started.
     */
    StartedAt?: Iso8601DateTime;
    /**
     * The time the deployment completed. 
     */
    CompletedAt?: Iso8601DateTime;
  }
  export interface DeploymentEvent {
    /**
     * The type of deployment event. Deployment event types include the start, stop, or completion of a deployment; a percentage update; the start or stop of a bake period; the start or completion of a rollback.
     */
    EventType?: DeploymentEventType;
    /**
     * The entity that triggered the deployment event. Events can be triggered by a user, AWS AppConfig, an Amazon CloudWatch alarm, or an internal error.
     */
    TriggeredBy?: TriggeredBy;
    /**
     * A description of the deployment event. Descriptions include, but are not limited to, the user account or the CloudWatch alarm ARN that initiated a rollback, the percentage of hosts that received the deployment, or in the case of an internal error, a recommendation to attempt a new deployment.
     */
    Description?: Description;
    /**
     * The date and time the event occurred.
     */
    OccurredAt?: Iso8601DateTime;
  }
  export type DeploymentEventType = "PERCENTAGE_UPDATED"|"ROLLBACK_STARTED"|"ROLLBACK_COMPLETED"|"BAKE_TIME_STARTED"|"DEPLOYMENT_STARTED"|"DEPLOYMENT_COMPLETED"|string;
  export type DeploymentEvents = DeploymentEvent[];
  export type DeploymentList = DeploymentSummary[];
  export type DeploymentState = "BAKING"|"VALIDATING"|"DEPLOYING"|"COMPLETE"|"ROLLING_BACK"|"ROLLED_BACK"|string;
  export interface DeploymentStrategies {
    /**
     * The elements from this collection.
     */
    Items?: DeploymentStrategyList;
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface DeploymentStrategy {
    /**
     * The deployment strategy ID.
     */
    Id?: Id;
    /**
     * The name of the deployment strategy.
     */
    Name?: Name;
    /**
     * The description of the deployment strategy.
     */
    Description?: Description;
    /**
     * Total amount of time the deployment lasted.
     */
    DeploymentDurationInMinutes?: MinutesBetween0And24Hours;
    /**
     * The algorithm used to define how percentage grew over time.
     */
    GrowthType?: GrowthType;
    /**
     * The percentage of targets that received a deployed configuration during each interval.
     */
    GrowthFactor?: Percentage;
    /**
     * The amount of time AppConfig monitored for alarms before considering the deployment to be complete and no longer eligible for automatic roll back.
     */
    FinalBakeTimeInMinutes?: MinutesBetween0And24Hours;
    /**
     * Save the deployment strategy to a Systems Manager (SSM) document.
     */
    ReplicateTo?: ReplicateTo;
  }
  export type DeploymentStrategyId = string;
  export type DeploymentStrategyList = DeploymentStrategy[];
  export interface DeploymentSummary {
    /**
     * The sequence number of the deployment.
     */
    DeploymentNumber?: Integer;
    /**
     * The name of the configuration.
     */
    ConfigurationName?: Name;
    /**
     * The version of the configuration.
     */
    ConfigurationVersion?: Version;
    /**
     * Total amount of time the deployment lasted.
     */
    DeploymentDurationInMinutes?: MinutesBetween0And24Hours;
    /**
     * The algorithm used to define how percentage grows over time.
     */
    GrowthType?: GrowthType;
    /**
     * The percentage of targets to receive a deployed configuration during each interval.
     */
    GrowthFactor?: Percentage;
    /**
     * The amount of time AppConfig monitors for alarms before considering the deployment to be complete and no longer eligible for automatic roll back.
     */
    FinalBakeTimeInMinutes?: MinutesBetween0And24Hours;
    /**
     * The state of the deployment.
     */
    State?: DeploymentState;
    /**
     * The percentage of targets for which the deployment is available.
     */
    PercentageComplete?: Percentage;
    /**
     * Time the deployment started.
     */
    StartedAt?: Iso8601DateTime;
    /**
     * Time the deployment completed.
     */
    CompletedAt?: Iso8601DateTime;
  }
  export interface Deployments {
    /**
     * The elements from this collection.
     */
    Items?: DeploymentList;
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export type Description = string;
  export interface Environment {
    /**
     * The application ID.
     */
    ApplicationId?: Id;
    /**
     * The environment ID.
     */
    Id?: Id;
    /**
     * The name of the environment.
     */
    Name?: Name;
    /**
     * The description of the environment.
     */
    Description?: Description;
    /**
     * The state of the environment. An environment can be in one of the following states: READY_FOR_DEPLOYMENT, DEPLOYING, ROLLING_BACK, or ROLLED_BACK 
     */
    State?: EnvironmentState;
    /**
     * Amazon CloudWatch alarms monitored during the deployment.
     */
    Monitors?: MonitorList;
  }
  export type EnvironmentList = Environment[];
  export type EnvironmentState = "READY_FOR_DEPLOYMENT"|"DEPLOYING"|"ROLLING_BACK"|"ROLLED_BACK"|string;
  export interface Environments {
    /**
     * The elements from this collection.
     */
    Items?: EnvironmentList;
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface GetApplicationRequest {
    /**
     * The ID of the application you want to get.
     */
    ApplicationId: Id;
  }
  export interface GetConfigurationProfileRequest {
    /**
     * The ID of the application that includes the configuration profile you want to get.
     */
    ApplicationId: Id;
    /**
     * The ID of the configuration profile you want to get.
     */
    ConfigurationProfileId: Id;
  }
  export interface GetConfigurationRequest {
    /**
     * The application to get. Specify either the application name or the application ID.
     */
    Application: StringWithLengthBetween1And64;
    /**
     * The environment to get. Specify either the environment name or the environment ID.
     */
    Environment: StringWithLengthBetween1And64;
    /**
     * The configuration to get. Specify either the configuration name or the configuration ID.
     */
    Configuration: StringWithLengthBetween1And64;
    /**
     * A unique ID to identify the client for the configuration. This ID enables AppConfig to deploy the configuration in intervals, as defined in the deployment strategy.
     */
    ClientId: StringWithLengthBetween1And64;
    /**
     * The configuration version returned in the most recent GetConfiguration response.  AWS AppConfig uses the value of the ClientConfigurationVersion parameter to identify the configuration version on your clients. If you don’t send ClientConfigurationVersion with each call to GetConfiguration, your clients receive the current configuration. You are charged each time your clients receive a configuration. To avoid excess charges, we recommend that you include the ClientConfigurationVersion value with every call to GetConfiguration. This value must be saved on your client. Subsequent calls to GetConfiguration must pass this value by using the ClientConfigurationVersion parameter.   For more information about working with configurations, see Retrieving the Configuration in the AWS AppConfig User Guide.
     */
    ClientConfigurationVersion?: Version;
  }
  export interface GetDeploymentRequest {
    /**
     * The ID of the application that includes the deployment you want to get. 
     */
    ApplicationId: Id;
    /**
     * The ID of the environment that includes the deployment you want to get. 
     */
    EnvironmentId: Id;
    /**
     * The sequence number of the deployment.
     */
    DeploymentNumber: Integer;
  }
  export interface GetDeploymentStrategyRequest {
    /**
     * The ID of the deployment strategy to get.
     */
    DeploymentStrategyId: DeploymentStrategyId;
  }
  export interface GetEnvironmentRequest {
    /**
     * The ID of the application that includes the environment you want to get.
     */
    ApplicationId: Id;
    /**
     * The ID of the environment you wnat to get.
     */
    EnvironmentId: Id;
  }
  export interface GetHostedConfigurationVersionRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The configuration profile ID.
     */
    ConfigurationProfileId: Id;
    /**
     * The version.
     */
    VersionNumber: Integer;
  }
  export type GrowthFactor = number;
  export type GrowthType = "LINEAR"|"EXPONENTIAL"|string;
  export interface HostedConfigurationVersion {
    /**
     * The application ID.
     */
    ApplicationId?: Id;
    /**
     * The configuration profile ID.
     */
    ConfigurationProfileId?: Id;
    /**
     * The configuration version.
     */
    VersionNumber?: Integer;
    /**
     * A description of the configuration.
     */
    Description?: Description;
    /**
     * The content of the configuration or the configuration data.
     */
    Content?: _Blob;
    /**
     * A standard MIME type describing the format of the configuration content. For more information, see Content-Type.
     */
    ContentType?: StringWithLengthBetween1And255;
  }
  export interface HostedConfigurationVersionSummary {
    /**
     * The application ID.
     */
    ApplicationId?: Id;
    /**
     * The configuration profile ID.
     */
    ConfigurationProfileId?: Id;
    /**
     * The configuration version.
     */
    VersionNumber?: Integer;
    /**
     * A description of the configuration.
     */
    Description?: Description;
    /**
     * A standard MIME type describing the format of the configuration content. For more information, see Content-Type.
     */
    ContentType?: StringWithLengthBetween1And255;
  }
  export type HostedConfigurationVersionSummaryList = HostedConfigurationVersionSummary[];
  export interface HostedConfigurationVersions {
    /**
     * The elements from this collection.
     */
    Items?: HostedConfigurationVersionSummaryList;
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export type Id = string;
  export type Integer = number;
  export type Iso8601DateTime = Date;
  export interface ListApplicationsRequest {
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * A token to start the list. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListConfigurationProfilesRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * A token to start the list. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListDeploymentStrategiesRequest {
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * A token to start the list. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListDeploymentsRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The environment ID.
     */
    EnvironmentId: Id;
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * A token to start the list. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEnvironmentsRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * A token to start the list. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListHostedConfigurationVersionsRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The configuration profile ID.
     */
    ConfigurationProfileId: Id;
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * A token to start the list. Use this token to get the next set of results. 
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The resource ARN.
     */
    ResourceArn: Arn;
  }
  export type MaxResults = number;
  export type MinutesBetween0And24Hours = number;
  export interface Monitor {
    /**
     * ARN of the Amazon CloudWatch alarm.
     */
    AlarmArn?: Arn;
    /**
     * ARN of an IAM role for AppConfig to monitor AlarmArn.
     */
    AlarmRoleArn?: RoleArn;
  }
  export type MonitorList = Monitor[];
  export type Name = string;
  export type NextToken = string;
  export type Percentage = number;
  export type ReplicateTo = "NONE"|"SSM_DOCUMENT"|string;
  export interface ResourceTags {
    /**
     * Metadata to assign to AppConfig resources. Tags help organize and categorize your AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     */
    Tags?: TagMap;
  }
  export type RoleArn = string;
  export interface StartDeploymentRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The environment ID.
     */
    EnvironmentId: Id;
    /**
     * The deployment strategy ID.
     */
    DeploymentStrategyId: DeploymentStrategyId;
    /**
     * The configuration profile ID.
     */
    ConfigurationProfileId: Id;
    /**
     * The configuration version to deploy.
     */
    ConfigurationVersion: Version;
    /**
     * A description of the deployment.
     */
    Description?: Description;
    /**
     * Metadata to assign to the deployment. Tags help organize and categorize your AppConfig resources. Each tag consists of a key and an optional value, both of which you define.
     */
    Tags?: TagMap;
  }
  export interface StopDeploymentRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The environment ID.
     */
    EnvironmentId: Id;
    /**
     * The sequence number of the deployment.
     */
    DeploymentNumber: Integer;
  }
  export type String = string;
  export type StringWithLengthBetween0And32768 = string;
  export type StringWithLengthBetween1And255 = string;
  export type StringWithLengthBetween1And64 = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the resource for which to retrieve tags.
     */
    ResourceArn: Arn;
    /**
     * The key-value string map. The valid character set is [a-zA-Z+-=._:/]. The tag key can be up to 128 characters and must not start with aws:. The tag value can be up to 256 characters.
     */
    Tags: TagMap;
  }
  export type TagValue = string;
  export type TriggeredBy = "USER"|"APPCONFIG"|"CLOUDWATCH_ALARM"|"INTERNAL_ERROR"|string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource for which to remove tags.
     */
    ResourceArn: Arn;
    /**
     * The tag keys to delete.
     */
    TagKeys: TagKeyList;
  }
  export interface UpdateApplicationRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The name of the application.
     */
    Name?: Name;
    /**
     * A description of the application.
     */
    Description?: Description;
  }
  export interface UpdateConfigurationProfileRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The ID of the configuration profile.
     */
    ConfigurationProfileId: Id;
    /**
     * The name of the configuration profile.
     */
    Name?: Name;
    /**
     * A description of the configuration profile.
     */
    Description?: Description;
    /**
     * The ARN of an IAM role with permission to access the configuration at the specified LocationUri.
     */
    RetrievalRoleArn?: RoleArn;
    /**
     * A list of methods for validating the configuration.
     */
    Validators?: ValidatorList;
  }
  export interface UpdateDeploymentStrategyRequest {
    /**
     * The deployment strategy ID.
     */
    DeploymentStrategyId: DeploymentStrategyId;
    /**
     * A description of the deployment strategy.
     */
    Description?: Description;
    /**
     * Total amount of time for a deployment to last.
     */
    DeploymentDurationInMinutes?: MinutesBetween0And24Hours;
    /**
     * The amount of time AppConfig monitors for alarms before considering the deployment to be complete and no longer eligible for automatic roll back.
     */
    FinalBakeTimeInMinutes?: MinutesBetween0And24Hours;
    /**
     * The percentage of targets to receive a deployed configuration during each interval.
     */
    GrowthFactor?: GrowthFactor;
    /**
     * The algorithm used to define how percentage grows over time. AWS AppConfig supports the following growth types:  Linear: For this type, AppConfig processes the deployment by increments of the growth factor evenly distributed over the deployment time. For example, a linear deployment that uses a growth factor of 20 initially makes the configuration available to 20 percent of the targets. After 1/5th of the deployment time has passed, the system updates the percentage to 40 percent. This continues until 100% of the targets are set to receive the deployed configuration.  Exponential: For this type, AppConfig processes the deployment exponentially using the following formula: G*(2^N). In this formula, G is the growth factor specified by the user and N is the number of steps until the configuration is deployed to all targets. For example, if you specify a growth factor of 2, then the system rolls out the configuration as follows:  2*(2^0)   2*(2^1)   2*(2^2)  Expressed numerically, the deployment rolls out as follows: 2% of the targets, 4% of the targets, 8% of the targets, and continues until the configuration has been deployed to all targets.
     */
    GrowthType?: GrowthType;
  }
  export interface UpdateEnvironmentRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The environment ID.
     */
    EnvironmentId: Id;
    /**
     * The name of the environment.
     */
    Name?: Name;
    /**
     * A description of the environment.
     */
    Description?: Description;
    /**
     * Amazon CloudWatch alarms to monitor during the deployment process.
     */
    Monitors?: MonitorList;
  }
  export type Uri = string;
  export interface ValidateConfigurationRequest {
    /**
     * The application ID.
     */
    ApplicationId: Id;
    /**
     * The configuration profile ID.
     */
    ConfigurationProfileId: Id;
    /**
     * The version of the configuration to validate.
     */
    ConfigurationVersion: Version;
  }
  export interface Validator {
    /**
     * AppConfig supports validators of type JSON_SCHEMA and LAMBDA 
     */
    Type: ValidatorType;
    /**
     * Either the JSON Schema content or the Amazon Resource Name (ARN) of an AWS Lambda function.
     */
    Content: StringWithLengthBetween0And32768;
  }
  export type ValidatorList = Validator[];
  export type ValidatorType = "JSON_SCHEMA"|"LAMBDA"|string;
  export type ValidatorTypeList = ValidatorType[];
  export type Version = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-10-09"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AppConfig client.
   */
  export import Types = AppConfig;
}
export = AppConfig;
