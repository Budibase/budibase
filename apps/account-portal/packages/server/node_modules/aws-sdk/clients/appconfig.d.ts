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
   * Creates an application. In AppConfig, an application is simply an organizational construct like a folder. This organizational construct has a relationship with some unit of executable code. For example, you could create an application called MyMobileApp to organize and manage configuration data for a mobile application installed by your users.
   */
  createApplication(params: AppConfig.Types.CreateApplicationRequest, callback?: (err: AWSError, data: AppConfig.Types.Application) => void): Request<AppConfig.Types.Application, AWSError>;
  /**
   * Creates an application. In AppConfig, an application is simply an organizational construct like a folder. This organizational construct has a relationship with some unit of executable code. For example, you could create an application called MyMobileApp to organize and manage configuration data for a mobile application installed by your users.
   */
  createApplication(callback?: (err: AWSError, data: AppConfig.Types.Application) => void): Request<AppConfig.Types.Application, AWSError>;
  /**
   * Creates a configuration profile, which is information that enables AppConfig to access the configuration source. Valid configuration sources include the following:   Configuration data in YAML, JSON, and other formats stored in the AppConfig hosted configuration store   Configuration data stored as objects in an Amazon Simple Storage Service (Amazon S3) bucket   Pipelines stored in CodePipeline   Secrets stored in Secrets Manager   Standard and secure string parameters stored in Amazon Web Services Systems Manager Parameter Store   Configuration data in SSM documents stored in the Systems Manager document store   A configuration profile includes the following information:   The URI location of the configuration data.   The Identity and Access Management (IAM) role that provides access to the configuration data.   A validator for the configuration data. Available validators include either a JSON Schema or an Amazon Web Services Lambda function.   For more information, see Create a Configuration and a Configuration Profile in the AppConfig User Guide.
   */
  createConfigurationProfile(params: AppConfig.Types.CreateConfigurationProfileRequest, callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfile) => void): Request<AppConfig.Types.ConfigurationProfile, AWSError>;
  /**
   * Creates a configuration profile, which is information that enables AppConfig to access the configuration source. Valid configuration sources include the following:   Configuration data in YAML, JSON, and other formats stored in the AppConfig hosted configuration store   Configuration data stored as objects in an Amazon Simple Storage Service (Amazon S3) bucket   Pipelines stored in CodePipeline   Secrets stored in Secrets Manager   Standard and secure string parameters stored in Amazon Web Services Systems Manager Parameter Store   Configuration data in SSM documents stored in the Systems Manager document store   A configuration profile includes the following information:   The URI location of the configuration data.   The Identity and Access Management (IAM) role that provides access to the configuration data.   A validator for the configuration data. Available validators include either a JSON Schema or an Amazon Web Services Lambda function.   For more information, see Create a Configuration and a Configuration Profile in the AppConfig User Guide.
   */
  createConfigurationProfile(callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfile) => void): Request<AppConfig.Types.ConfigurationProfile, AWSError>;
  /**
   * Creates a deployment strategy that defines important criteria for rolling out your configuration to the designated targets. A deployment strategy includes the overall duration required, a percentage of targets to receive the deployment during each interval, an algorithm that defines how percentage grows, and bake time.
   */
  createDeploymentStrategy(params: AppConfig.Types.CreateDeploymentStrategyRequest, callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategy) => void): Request<AppConfig.Types.DeploymentStrategy, AWSError>;
  /**
   * Creates a deployment strategy that defines important criteria for rolling out your configuration to the designated targets. A deployment strategy includes the overall duration required, a percentage of targets to receive the deployment during each interval, an algorithm that defines how percentage grows, and bake time.
   */
  createDeploymentStrategy(callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategy) => void): Request<AppConfig.Types.DeploymentStrategy, AWSError>;
  /**
   * Creates an environment. For each application, you define one or more environments. An environment is a deployment group of AppConfig targets, such as applications in a Beta or Production environment. You can also define environments for application subcomponents such as the Web, Mobile and Back-end components for your application. You can configure Amazon CloudWatch alarms for each environment. The system monitors alarms during a configuration deployment. If an alarm is triggered, the system rolls back the configuration.
   */
  createEnvironment(params: AppConfig.Types.CreateEnvironmentRequest, callback?: (err: AWSError, data: AppConfig.Types.Environment) => void): Request<AppConfig.Types.Environment, AWSError>;
  /**
   * Creates an environment. For each application, you define one or more environments. An environment is a deployment group of AppConfig targets, such as applications in a Beta or Production environment. You can also define environments for application subcomponents such as the Web, Mobile and Back-end components for your application. You can configure Amazon CloudWatch alarms for each environment. The system monitors alarms during a configuration deployment. If an alarm is triggered, the system rolls back the configuration.
   */
  createEnvironment(callback?: (err: AWSError, data: AppConfig.Types.Environment) => void): Request<AppConfig.Types.Environment, AWSError>;
  /**
   * Creates an AppConfig extension. An extension augments your ability to inject logic or behavior at different points during the AppConfig workflow of creating or deploying a configuration. You can create your own extensions or use the Amazon Web Services authored extensions provided by AppConfig. For an AppConfig extension that uses Lambda, you must create a Lambda function to perform any computation and processing defined in the extension. If you plan to create custom versions of the Amazon Web Services authored notification extensions, you only need to specify an Amazon Resource Name (ARN) in the Uri field for the new extension version.   For a custom EventBridge notification extension, enter the ARN of the EventBridge default events in the Uri field.   For a custom Amazon SNS notification extension, enter the ARN of an Amazon SNS topic in the Uri field.   For a custom Amazon SQS notification extension, enter the ARN of an Amazon SQS message queue in the Uri field.    For more information about extensions, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  createExtension(params: AppConfig.Types.CreateExtensionRequest, callback?: (err: AWSError, data: AppConfig.Types.Extension) => void): Request<AppConfig.Types.Extension, AWSError>;
  /**
   * Creates an AppConfig extension. An extension augments your ability to inject logic or behavior at different points during the AppConfig workflow of creating or deploying a configuration. You can create your own extensions or use the Amazon Web Services authored extensions provided by AppConfig. For an AppConfig extension that uses Lambda, you must create a Lambda function to perform any computation and processing defined in the extension. If you plan to create custom versions of the Amazon Web Services authored notification extensions, you only need to specify an Amazon Resource Name (ARN) in the Uri field for the new extension version.   For a custom EventBridge notification extension, enter the ARN of the EventBridge default events in the Uri field.   For a custom Amazon SNS notification extension, enter the ARN of an Amazon SNS topic in the Uri field.   For a custom Amazon SQS notification extension, enter the ARN of an Amazon SQS message queue in the Uri field.    For more information about extensions, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  createExtension(callback?: (err: AWSError, data: AppConfig.Types.Extension) => void): Request<AppConfig.Types.Extension, AWSError>;
  /**
   * When you create an extension or configure an Amazon Web Services authored extension, you associate the extension with an AppConfig application, environment, or configuration profile. For example, you can choose to run the AppConfig deployment events to Amazon SNS Amazon Web Services authored extension and receive notifications on an Amazon SNS topic anytime a configuration deployment is started for a specific application. Defining which extension to associate with an AppConfig resource is called an extension association. An extension association is a specified relationship between an extension and an AppConfig resource, such as an application or a configuration profile. For more information about extensions and associations, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  createExtensionAssociation(params: AppConfig.Types.CreateExtensionAssociationRequest, callback?: (err: AWSError, data: AppConfig.Types.ExtensionAssociation) => void): Request<AppConfig.Types.ExtensionAssociation, AWSError>;
  /**
   * When you create an extension or configure an Amazon Web Services authored extension, you associate the extension with an AppConfig application, environment, or configuration profile. For example, you can choose to run the AppConfig deployment events to Amazon SNS Amazon Web Services authored extension and receive notifications on an Amazon SNS topic anytime a configuration deployment is started for a specific application. Defining which extension to associate with an AppConfig resource is called an extension association. An extension association is a specified relationship between an extension and an AppConfig resource, such as an application or a configuration profile. For more information about extensions and associations, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  createExtensionAssociation(callback?: (err: AWSError, data: AppConfig.Types.ExtensionAssociation) => void): Request<AppConfig.Types.ExtensionAssociation, AWSError>;
  /**
   * Creates a new configuration in the AppConfig hosted configuration store.
   */
  createHostedConfigurationVersion(params: AppConfig.Types.CreateHostedConfigurationVersionRequest, callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersion) => void): Request<AppConfig.Types.HostedConfigurationVersion, AWSError>;
  /**
   * Creates a new configuration in the AppConfig hosted configuration store.
   */
  createHostedConfigurationVersion(callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersion) => void): Request<AppConfig.Types.HostedConfigurationVersion, AWSError>;
  /**
   * Deletes an application. Deleting an application does not delete a configuration from a host.
   */
  deleteApplication(params: AppConfig.Types.DeleteApplicationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an application. Deleting an application does not delete a configuration from a host.
   */
  deleteApplication(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a configuration profile. Deleting a configuration profile does not delete a configuration from a host.
   */
  deleteConfigurationProfile(params: AppConfig.Types.DeleteConfigurationProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a configuration profile. Deleting a configuration profile does not delete a configuration from a host.
   */
  deleteConfigurationProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a deployment strategy. Deleting a deployment strategy does not delete a configuration from a host.
   */
  deleteDeploymentStrategy(params: AppConfig.Types.DeleteDeploymentStrategyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a deployment strategy. Deleting a deployment strategy does not delete a configuration from a host.
   */
  deleteDeploymentStrategy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an environment. Deleting an environment does not delete a configuration from a host.
   */
  deleteEnvironment(params: AppConfig.Types.DeleteEnvironmentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an environment. Deleting an environment does not delete a configuration from a host.
   */
  deleteEnvironment(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AppConfig extension. You must delete all associations to an extension before you delete the extension.
   */
  deleteExtension(params: AppConfig.Types.DeleteExtensionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AppConfig extension. You must delete all associations to an extension before you delete the extension.
   */
  deleteExtension(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an extension association. This action doesn't delete extensions defined in the association.
   */
  deleteExtensionAssociation(params: AppConfig.Types.DeleteExtensionAssociationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an extension association. This action doesn't delete extensions defined in the association.
   */
  deleteExtensionAssociation(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a version of a configuration from the AppConfig hosted configuration store.
   */
  deleteHostedConfigurationVersion(params: AppConfig.Types.DeleteHostedConfigurationVersionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a version of a configuration from the AppConfig hosted configuration store.
   */
  deleteHostedConfigurationVersion(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves information about an application.
   */
  getApplication(params: AppConfig.Types.GetApplicationRequest, callback?: (err: AWSError, data: AppConfig.Types.Application) => void): Request<AppConfig.Types.Application, AWSError>;
  /**
   * Retrieves information about an application.
   */
  getApplication(callback?: (err: AWSError, data: AppConfig.Types.Application) => void): Request<AppConfig.Types.Application, AWSError>;
  /**
   * (Deprecated) Retrieves the latest deployed configuration.  Note the following important information.   This API action is deprecated. Calls to receive configuration data should use the StartConfigurationSession and GetLatestConfiguration APIs instead.     GetConfiguration is a priced call. For more information, see Pricing.   
   */
  getConfiguration(params: AppConfig.Types.GetConfigurationRequest, callback?: (err: AWSError, data: AppConfig.Types.Configuration) => void): Request<AppConfig.Types.Configuration, AWSError>;
  /**
   * (Deprecated) Retrieves the latest deployed configuration.  Note the following important information.   This API action is deprecated. Calls to receive configuration data should use the StartConfigurationSession and GetLatestConfiguration APIs instead.     GetConfiguration is a priced call. For more information, see Pricing.   
   */
  getConfiguration(callback?: (err: AWSError, data: AppConfig.Types.Configuration) => void): Request<AppConfig.Types.Configuration, AWSError>;
  /**
   * Retrieves information about a configuration profile.
   */
  getConfigurationProfile(params: AppConfig.Types.GetConfigurationProfileRequest, callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfile) => void): Request<AppConfig.Types.ConfigurationProfile, AWSError>;
  /**
   * Retrieves information about a configuration profile.
   */
  getConfigurationProfile(callback?: (err: AWSError, data: AppConfig.Types.ConfigurationProfile) => void): Request<AppConfig.Types.ConfigurationProfile, AWSError>;
  /**
   * Retrieves information about a configuration deployment.
   */
  getDeployment(params: AppConfig.Types.GetDeploymentRequest, callback?: (err: AWSError, data: AppConfig.Types.Deployment) => void): Request<AppConfig.Types.Deployment, AWSError>;
  /**
   * Retrieves information about a configuration deployment.
   */
  getDeployment(callback?: (err: AWSError, data: AppConfig.Types.Deployment) => void): Request<AppConfig.Types.Deployment, AWSError>;
  /**
   * Retrieves information about a deployment strategy. A deployment strategy defines important criteria for rolling out your configuration to the designated targets. A deployment strategy includes the overall duration required, a percentage of targets to receive the deployment during each interval, an algorithm that defines how percentage grows, and bake time.
   */
  getDeploymentStrategy(params: AppConfig.Types.GetDeploymentStrategyRequest, callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategy) => void): Request<AppConfig.Types.DeploymentStrategy, AWSError>;
  /**
   * Retrieves information about a deployment strategy. A deployment strategy defines important criteria for rolling out your configuration to the designated targets. A deployment strategy includes the overall duration required, a percentage of targets to receive the deployment during each interval, an algorithm that defines how percentage grows, and bake time.
   */
  getDeploymentStrategy(callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategy) => void): Request<AppConfig.Types.DeploymentStrategy, AWSError>;
  /**
   * Retrieves information about an environment. An environment is a deployment group of AppConfig applications, such as applications in a Production environment or in an EU_Region environment. Each configuration deployment targets an environment. You can enable one or more Amazon CloudWatch alarms for an environment. If an alarm is triggered during a deployment, AppConfig roles back the configuration.
   */
  getEnvironment(params: AppConfig.Types.GetEnvironmentRequest, callback?: (err: AWSError, data: AppConfig.Types.Environment) => void): Request<AppConfig.Types.Environment, AWSError>;
  /**
   * Retrieves information about an environment. An environment is a deployment group of AppConfig applications, such as applications in a Production environment or in an EU_Region environment. Each configuration deployment targets an environment. You can enable one or more Amazon CloudWatch alarms for an environment. If an alarm is triggered during a deployment, AppConfig roles back the configuration.
   */
  getEnvironment(callback?: (err: AWSError, data: AppConfig.Types.Environment) => void): Request<AppConfig.Types.Environment, AWSError>;
  /**
   * Returns information about an AppConfig extension.
   */
  getExtension(params: AppConfig.Types.GetExtensionRequest, callback?: (err: AWSError, data: AppConfig.Types.Extension) => void): Request<AppConfig.Types.Extension, AWSError>;
  /**
   * Returns information about an AppConfig extension.
   */
  getExtension(callback?: (err: AWSError, data: AppConfig.Types.Extension) => void): Request<AppConfig.Types.Extension, AWSError>;
  /**
   * Returns information about an AppConfig extension association. For more information about extensions and associations, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  getExtensionAssociation(params: AppConfig.Types.GetExtensionAssociationRequest, callback?: (err: AWSError, data: AppConfig.Types.ExtensionAssociation) => void): Request<AppConfig.Types.ExtensionAssociation, AWSError>;
  /**
   * Returns information about an AppConfig extension association. For more information about extensions and associations, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  getExtensionAssociation(callback?: (err: AWSError, data: AppConfig.Types.ExtensionAssociation) => void): Request<AppConfig.Types.ExtensionAssociation, AWSError>;
  /**
   * Retrieves information about a specific configuration version.
   */
  getHostedConfigurationVersion(params: AppConfig.Types.GetHostedConfigurationVersionRequest, callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersion) => void): Request<AppConfig.Types.HostedConfigurationVersion, AWSError>;
  /**
   * Retrieves information about a specific configuration version.
   */
  getHostedConfigurationVersion(callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersion) => void): Request<AppConfig.Types.HostedConfigurationVersion, AWSError>;
  /**
   * Lists all applications in your Amazon Web Services account.
   */
  listApplications(params: AppConfig.Types.ListApplicationsRequest, callback?: (err: AWSError, data: AppConfig.Types.Applications) => void): Request<AppConfig.Types.Applications, AWSError>;
  /**
   * Lists all applications in your Amazon Web Services account.
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
   * Lists deployment strategies.
   */
  listDeploymentStrategies(params: AppConfig.Types.ListDeploymentStrategiesRequest, callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategies) => void): Request<AppConfig.Types.DeploymentStrategies, AWSError>;
  /**
   * Lists deployment strategies.
   */
  listDeploymentStrategies(callback?: (err: AWSError, data: AppConfig.Types.DeploymentStrategies) => void): Request<AppConfig.Types.DeploymentStrategies, AWSError>;
  /**
   * Lists the deployments for an environment in descending deployment number order.
   */
  listDeployments(params: AppConfig.Types.ListDeploymentsRequest, callback?: (err: AWSError, data: AppConfig.Types.Deployments) => void): Request<AppConfig.Types.Deployments, AWSError>;
  /**
   * Lists the deployments for an environment in descending deployment number order.
   */
  listDeployments(callback?: (err: AWSError, data: AppConfig.Types.Deployments) => void): Request<AppConfig.Types.Deployments, AWSError>;
  /**
   * Lists the environments for an application.
   */
  listEnvironments(params: AppConfig.Types.ListEnvironmentsRequest, callback?: (err: AWSError, data: AppConfig.Types.Environments) => void): Request<AppConfig.Types.Environments, AWSError>;
  /**
   * Lists the environments for an application.
   */
  listEnvironments(callback?: (err: AWSError, data: AppConfig.Types.Environments) => void): Request<AppConfig.Types.Environments, AWSError>;
  /**
   * Lists all AppConfig extension associations in the account. For more information about extensions and associations, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  listExtensionAssociations(params: AppConfig.Types.ListExtensionAssociationsRequest, callback?: (err: AWSError, data: AppConfig.Types.ExtensionAssociations) => void): Request<AppConfig.Types.ExtensionAssociations, AWSError>;
  /**
   * Lists all AppConfig extension associations in the account. For more information about extensions and associations, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  listExtensionAssociations(callback?: (err: AWSError, data: AppConfig.Types.ExtensionAssociations) => void): Request<AppConfig.Types.ExtensionAssociations, AWSError>;
  /**
   * Lists all custom and Amazon Web Services authored AppConfig extensions in the account. For more information about extensions, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  listExtensions(params: AppConfig.Types.ListExtensionsRequest, callback?: (err: AWSError, data: AppConfig.Types.Extensions) => void): Request<AppConfig.Types.Extensions, AWSError>;
  /**
   * Lists all custom and Amazon Web Services authored AppConfig extensions in the account. For more information about extensions, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  listExtensions(callback?: (err: AWSError, data: AppConfig.Types.Extensions) => void): Request<AppConfig.Types.Extensions, AWSError>;
  /**
   * Lists configurations stored in the AppConfig hosted configuration store by version.
   */
  listHostedConfigurationVersions(params: AppConfig.Types.ListHostedConfigurationVersionsRequest, callback?: (err: AWSError, data: AppConfig.Types.HostedConfigurationVersions) => void): Request<AppConfig.Types.HostedConfigurationVersions, AWSError>;
  /**
   * Lists configurations stored in the AppConfig hosted configuration store by version.
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
   * Assigns metadata to an AppConfig resource. Tags help organize and categorize your AppConfig resources. Each tag consists of a key and an optional value, both of which you define. You can specify a maximum of 50 tags for a resource.
   */
  tagResource(params: AppConfig.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Assigns metadata to an AppConfig resource. Tags help organize and categorize your AppConfig resources. Each tag consists of a key and an optional value, both of which you define. You can specify a maximum of 50 tags for a resource.
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
   * Updates an AppConfig extension. For more information about extensions, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  updateExtension(params: AppConfig.Types.UpdateExtensionRequest, callback?: (err: AWSError, data: AppConfig.Types.Extension) => void): Request<AppConfig.Types.Extension, AWSError>;
  /**
   * Updates an AppConfig extension. For more information about extensions, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  updateExtension(callback?: (err: AWSError, data: AppConfig.Types.Extension) => void): Request<AppConfig.Types.Extension, AWSError>;
  /**
   * Updates an association. For more information about extensions and associations, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  updateExtensionAssociation(params: AppConfig.Types.UpdateExtensionAssociationRequest, callback?: (err: AWSError, data: AppConfig.Types.ExtensionAssociation) => void): Request<AppConfig.Types.ExtensionAssociation, AWSError>;
  /**
   * Updates an association. For more information about extensions and associations, see Working with AppConfig extensions in the AppConfig User Guide.
   */
  updateExtensionAssociation(callback?: (err: AWSError, data: AppConfig.Types.ExtensionAssociation) => void): Request<AppConfig.Types.ExtensionAssociation, AWSError>;
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
  export interface Action {
    /**
     * The action name.
     */
    Name?: Name;
    /**
     * Information about the action.
     */
    Description?: Description;
    /**
     * The extension URI associated to the action point in the extension definition. The URI can be an Amazon Resource Name (ARN) for one of the following: an Lambda function, an Amazon Simple Queue Service queue, an Amazon Simple Notification Service topic, or the Amazon EventBridge default event bus.
     */
    Uri?: Uri;
    /**
     * An Amazon Resource Name (ARN) for an Identity and Access Management assume role.
     */
    RoleArn?: Arn;
  }
  export interface ActionInvocation {
    /**
     * The name, the ID, or the Amazon Resource Name (ARN) of the extension.
     */
    ExtensionIdentifier?: Identifier;
    /**
     * The name of the action.
     */
    ActionName?: Name;
    /**
     * The extension URI associated to the action point in the extension definition. The URI can be an Amazon Resource Name (ARN) for one of the following: an Lambda function, an Amazon Simple Queue Service queue, an Amazon Simple Notification Service topic, or the Amazon EventBridge default event bus.
     */
    Uri?: Uri;
    /**
     * An Amazon Resource Name (ARN) for an Identity and Access Management assume role.
     */
    RoleArn?: Arn;
    /**
     * The error message when an extension invocation fails.
     */
    ErrorMessage?: String;
    /**
     * The error code when an extension invocation fails.
     */
    ErrorCode?: String;
    /**
     * A system-generated ID for this invocation.
     */
    InvocationId?: Id;
  }
  export type ActionInvocations = ActionInvocation[];
  export type ActionList = Action[];
  export type ActionPoint = "PRE_CREATE_HOSTED_CONFIGURATION_VERSION"|"PRE_START_DEPLOYMENT"|"ON_DEPLOYMENT_START"|"ON_DEPLOYMENT_STEP"|"ON_DEPLOYMENT_BAKING"|"ON_DEPLOYMENT_COMPLETE"|"ON_DEPLOYMENT_ROLLED_BACK"|string;
  export type ActionsMap = {[key: string]: ActionList};
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
  export interface AppliedExtension {
    /**
     * The system-generated ID of the extension.
     */
    ExtensionId?: Id;
    /**
     * The system-generated ID for the association.
     */
    ExtensionAssociationId?: Id;
    /**
     * The extension version number.
     */
    VersionNumber?: Integer;
    /**
     * One or more parameters for the actions called by the extension.
     */
    Parameters?: ParameterValueMap;
  }
  export type AppliedExtensions = AppliedExtension[];
  export type Arn = string;
  export type _Blob = Buffer|Uint8Array|Blob|string;
  export type Boolean = boolean;
  export interface Configuration {
    /**
     * The content of the configuration or the configuration data.  The Content attribute only contains data if the system finds new or updated configuration data. If there is no new or updated data and ClientConfigurationVersion matches the version of the current configuration, AppConfig returns a 204 No Content HTTP response code and the Content value will be empty. 
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
    Name?: LongName;
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
    /**
     * The type of configurations contained in the profile. AppConfig supports feature flags and freeform configurations. We recommend you create feature flag configurations to enable or disable new features and freeform configurations to distribute configurations to an application. When calling this API, enter one of the following values for Type:  AWS.AppConfig.FeatureFlags   AWS.Freeform 
     */
    Type?: ConfigurationProfileType;
    /**
     * The Amazon Resource Name of the Key Management Service key to encrypt new configuration data versions in the AppConfig hosted configuration store. This attribute is only used for hosted configuration types. To encrypt data managed in other configuration stores, see the documentation for how to specify an KMS key for that particular service.
     */
    KmsKeyArn?: Arn;
    /**
     * The Key Management Service key identifier (key ID, key alias, or key ARN) provided when the resource was created or updated.
     */
    KmsKeyIdentifier?: KmsKeyIdentifier;
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
    Name?: LongName;
    /**
     * The URI location of the configuration.
     */
    LocationUri?: Uri;
    /**
     * The types of validators in the configuration profile.
     */
    ValidatorTypes?: ValidatorTypeList;
    /**
     * The type of configurations contained in the profile. AppConfig supports feature flags and freeform configurations. We recommend you create feature flag configurations to enable or disable new features and freeform configurations to distribute configurations to an application. When calling this API, enter one of the following values for Type:  AWS.AppConfig.FeatureFlags   AWS.Freeform 
     */
    Type?: ConfigurationProfileType;
  }
  export type ConfigurationProfileSummaryList = ConfigurationProfileSummary[];
  export type ConfigurationProfileType = string;
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
    Name: LongName;
    /**
     * A description of the configuration profile.
     */
    Description?: Description;
    /**
     * A URI to locate the configuration. You can specify the following:   For the AppConfig hosted configuration store and for feature flags, specify hosted.   For an Amazon Web Services Systems Manager Parameter Store parameter, specify either the parameter name in the format ssm-parameter://&lt;parameter name&gt; or the ARN.   For an Amazon Web Services CodePipeline pipeline, specify the URI in the following format: codepipeline://&lt;pipeline name&gt;.   For an Secrets Manager secret, specify the URI in the following format: secretsmanager://&lt;secret name&gt;.   For an Amazon S3 object, specify the URI in the following format: s3://&lt;bucket&gt;/&lt;objectKey&gt; . Here is an example: s3://my-bucket/my-app/us-east-1/my-config.json    For an SSM document, specify either the document name in the format ssm-document://&lt;document name&gt; or the Amazon Resource Name (ARN).  
     */
    LocationUri: Uri;
    /**
     * The ARN of an IAM role with permission to access the configuration at the specified LocationUri.  A retrieval role ARN is not required for configurations stored in the AppConfig hosted configuration store. It is required for all other sources that store your configuration.  
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
    /**
     * The type of configurations contained in the profile. AppConfig supports feature flags and freeform configurations. We recommend you create feature flag configurations to enable or disable new features and freeform configurations to distribute configurations to an application. When calling this API, enter one of the following values for Type:  AWS.AppConfig.FeatureFlags   AWS.Freeform 
     */
    Type?: ConfigurationProfileType;
    /**
     * The identifier for an Key Management Service key to encrypt new configuration data versions in the AppConfig hosted configuration store. This attribute is only used for hosted configuration types. The identifier can be an KMS key ID, alias, or the Amazon Resource Name (ARN) of the key ID or alias. To encrypt data managed in other configuration stores, see the documentation for how to specify an KMS key for that particular service.
     */
    KmsKeyIdentifier?: KmsKeyIdentifier;
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
     * Specifies the amount of time AppConfig monitors for Amazon CloudWatch alarms after the configuration has been deployed to 100% of its targets, before considering the deployment to be complete. If an alarm is triggered during this time, AppConfig rolls back the deployment. You must configure permissions for AppConfig to roll back based on CloudWatch alarms. For more information, see Configuring permissions for rollback based on Amazon CloudWatch alarms in the AppConfig User Guide.
     */
    FinalBakeTimeInMinutes?: MinutesBetween0And24Hours;
    /**
     * The percentage of targets to receive a deployed configuration during each interval.
     */
    GrowthFactor: GrowthFactor;
    /**
     * The algorithm used to define how percentage grows over time. AppConfig supports the following growth types:  Linear: For this type, AppConfig processes the deployment by dividing the total number of targets by the value specified for Step percentage. For example, a linear deployment that uses a Step percentage of 10 deploys the configuration to 10 percent of the hosts. After those deployments are complete, the system deploys the configuration to the next 10 percent. This continues until 100% of the targets have successfully received the configuration.  Exponential: For this type, AppConfig processes the deployment exponentially using the following formula: G*(2^N). In this formula, G is the growth factor specified by the user and N is the number of steps until the configuration is deployed to all targets. For example, if you specify a growth factor of 2, then the system rolls out the configuration as follows:  2*(2^0)   2*(2^1)   2*(2^2)  Expressed numerically, the deployment rolls out as follows: 2% of the targets, 4% of the targets, 8% of the targets, and continues until the configuration has been deployed to all targets.
     */
    GrowthType?: GrowthType;
    /**
     * Save the deployment strategy to a Systems Manager (SSM) document.
     */
    ReplicateTo?: ReplicateTo;
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
  export interface CreateExtensionAssociationRequest {
    /**
     * The name, the ID, or the Amazon Resource Name (ARN) of the extension.
     */
    ExtensionIdentifier: Identifier;
    /**
     * The version number of the extension. If not specified, AppConfig uses the maximum version of the extension.
     */
    ExtensionVersionNumber?: Integer;
    /**
     * The ARN of an application, configuration profile, or environment.
     */
    ResourceIdentifier: Identifier;
    /**
     * The parameter names and values defined in the extensions. Extension parameters marked Required must be entered for this field.
     */
    Parameters?: ParameterValueMap;
    /**
     * Adds one or more tags for the specified extension association. Tags are metadata that help you categorize resources in different ways, for example, by purpose, owner, or environment. Each tag consists of a key and an optional value, both of which you define. 
     */
    Tags?: TagMap;
  }
  export interface CreateExtensionRequest {
    /**
     * A name for the extension. Each extension name in your account must be unique. Extension versions use the same name.
     */
    Name: ExtensionOrParameterName;
    /**
     * Information about the extension.
     */
    Description?: Description;
    /**
     * The actions defined in the extension.
     */
    Actions: ActionsMap;
    /**
     * The parameters accepted by the extension. You specify parameter values when you associate the extension to an AppConfig resource by using the CreateExtensionAssociation API action. For Lambda extension actions, these parameters are included in the Lambda request object.
     */
    Parameters?: ParameterMap;
    /**
     * Adds one or more tags for the specified extension. Tags are metadata that help you categorize resources in different ways, for example, by purpose, owner, or environment. Each tag consists of a key and an optional value, both of which you define. 
     */
    Tags?: TagMap;
    /**
     * You can omit this field when you create an extension. When you create a new version, specify the most recent current version number. For example, you create version 3, enter 2 for this field.
     */
    LatestVersionNumber?: Integer;
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
     * An optional locking token used to prevent race conditions from overwriting configuration updates when creating a new version. To ensure your data is not overwritten when creating multiple hosted configuration versions in rapid succession, specify the version number of the latest hosted configuration version.
     */
    LatestVersionNumber?: Integer;
    /**
     * An optional, user-defined label for the AppConfig hosted configuration version. This value must contain at least one non-numeric character. For example, "v2.2.0".
     */
    VersionLabel?: VersionLabel;
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
     * The application ID that includes the environment that you want to delete.
     */
    ApplicationId: Id;
    /**
     * The ID of the environment that you want to delete.
     */
    EnvironmentId: Id;
  }
  export interface DeleteExtensionAssociationRequest {
    /**
     * The ID of the extension association to delete.
     */
    ExtensionAssociationId: Id;
  }
  export interface DeleteExtensionRequest {
    /**
     * The name, ID, or Amazon Resource Name (ARN) of the extension you want to delete.
     */
    ExtensionIdentifier: Identifier;
    /**
     * A specific version of an extension to delete. If omitted, the highest version is deleted.
     */
    VersionNumber?: Integer;
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
     * The amount of time that AppConfig monitored for alarms before considering the deployment to be complete and no longer eligible for automatic rollback.
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
    /**
     * A list of extensions that were processed as part of the deployment. The extensions that were previously associated to the configuration profile, environment, or the application when StartDeployment was called.
     */
    AppliedExtensions?: AppliedExtensions;
    /**
     * The Amazon Resource Name of the Key Management Service key used to encrypt configuration data. You can encrypt secrets stored in Secrets Manager, Amazon Simple Storage Service (Amazon S3) objects encrypted with SSE-KMS, or secure string parameters stored in Amazon Web Services Systems Manager Parameter Store. 
     */
    KmsKeyArn?: Arn;
    /**
     * The Key Management Service key identifier (key ID, key alias, or key ARN) provided when the resource was created or updated.
     */
    KmsKeyIdentifier?: KmsKeyIdentifier;
    /**
     * A user-defined label for an AppConfig hosted configuration version.
     */
    VersionLabel?: VersionLabel;
  }
  export interface DeploymentEvent {
    /**
     * The type of deployment event. Deployment event types include the start, stop, or completion of a deployment; a percentage update; the start or stop of a bake period; and the start or completion of a rollback.
     */
    EventType?: DeploymentEventType;
    /**
     * The entity that triggered the deployment event. Events can be triggered by a user, AppConfig, an Amazon CloudWatch alarm, or an internal error.
     */
    TriggeredBy?: TriggeredBy;
    /**
     * A description of the deployment event. Descriptions include, but are not limited to, the following:   The Amazon Web Services account or the Amazon CloudWatch alarm ARN that initiated a rollback.   The percentage of hosts that received the deployment.   A recommendation to attempt a new deployment (in the case of an internal error).  
     */
    Description?: Description;
    /**
     * The list of extensions that were invoked as part of the deployment.
     */
    ActionInvocations?: ActionInvocations;
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
     * The amount of time that AppConfig monitored for alarms before considering the deployment to be complete and no longer eligible for automatic rollback.
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
     * The amount of time that AppConfig monitors for alarms before considering the deployment to be complete and no longer eligible for automatic rollback.
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
    /**
     * A user-defined label for an AppConfig hosted configuration version.
     */
    VersionLabel?: VersionLabel;
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
  export interface Extension {
    /**
     * The system-generated ID of the extension.
     */
    Id?: Id;
    /**
     * The extension name.
     */
    Name?: Name;
    /**
     * The extension version number.
     */
    VersionNumber?: Integer;
    /**
     * The system-generated Amazon Resource Name (ARN) for the extension.
     */
    Arn?: Arn;
    /**
     * Information about the extension.
     */
    Description?: Description;
    /**
     * The actions defined in the extension.
     */
    Actions?: ActionsMap;
    /**
     * The parameters accepted by the extension. You specify parameter values when you associate the extension to an AppConfig resource by using the CreateExtensionAssociation API action. For Lambda extension actions, these parameters are included in the Lambda request object.
     */
    Parameters?: ParameterMap;
  }
  export interface ExtensionAssociation {
    /**
     * The system-generated ID for the association.
     */
    Id?: Identifier;
    /**
     * The ARN of the extension defined in the association.
     */
    ExtensionArn?: Arn;
    /**
     * The ARNs of applications, configuration profiles, or environments defined in the association.
     */
    ResourceArn?: Arn;
    /**
     * The system-generated Amazon Resource Name (ARN) for the extension.
     */
    Arn?: Arn;
    /**
     * The parameter names and values defined in the association.
     */
    Parameters?: ParameterValueMap;
    /**
     * The version number for the extension defined in the association.
     */
    ExtensionVersionNumber?: Integer;
  }
  export type ExtensionAssociationSummaries = ExtensionAssociationSummary[];
  export interface ExtensionAssociationSummary {
    /**
     * The extension association ID. This ID is used to call other ExtensionAssociation API actions such as GetExtensionAssociation or DeleteExtensionAssociation.
     */
    Id?: Identifier;
    /**
     * The system-generated Amazon Resource Name (ARN) for the extension.
     */
    ExtensionArn?: Arn;
    /**
     * The ARNs of applications, configuration profiles, or environments defined in the association.
     */
    ResourceArn?: Arn;
  }
  export interface ExtensionAssociations {
    /**
     * The list of extension associations. Each item represents an extension association to an application, environment, or configuration profile. 
     */
    Items?: ExtensionAssociationSummaries;
    /**
     * The token for the next set of items to return. Use this token to get the next set of results.
     */
    NextToken?: NextToken;
  }
  export type ExtensionOrParameterName = string;
  export type ExtensionSummaries = ExtensionSummary[];
  export interface ExtensionSummary {
    /**
     * The system-generated ID of the extension.
     */
    Id?: Id;
    /**
     * The extension name.
     */
    Name?: Name;
    /**
     * The extension version number.
     */
    VersionNumber?: Integer;
    /**
     * The system-generated Amazon Resource Name (ARN) for the extension.
     */
    Arn?: Arn;
    /**
     * Information about the extension.
     */
    Description?: Description;
  }
  export interface Extensions {
    /**
     * The list of available extensions. The list includes Amazon Web Services authored and user-created extensions.
     */
    Items?: ExtensionSummaries;
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
     * The ID of the configuration profile that you want to get.
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
     * The clientId parameter in the following command is a unique, user-specified ID to identify the client for the configuration. This ID enables AppConfig to deploy the configuration in intervals, as defined in the deployment strategy. 
     */
    ClientId: StringWithLengthBetween1And64;
    /**
     * The configuration version returned in the most recent GetConfiguration response.  AppConfig uses the value of the ClientConfigurationVersion parameter to identify the configuration version on your clients. If you don’t send ClientConfigurationVersion with each call to GetConfiguration, your clients receive the current configuration. You are charged each time your clients receive a configuration. To avoid excess charges, we recommend you use the StartConfigurationSession and GetLatestConfiguration APIs, which track the client configuration version on your behalf. If you choose to continue using GetConfiguration, we recommend that you include the ClientConfigurationVersion value with every call to GetConfiguration. The value to use for ClientConfigurationVersion comes from the ConfigurationVersion attribute returned by GetConfiguration when there is new or updated data, and should be saved for subsequent calls to GetConfiguration.  For more information about working with configurations, see Retrieving the Configuration in the AppConfig User Guide.
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
     * The ID of the environment that you want to get.
     */
    EnvironmentId: Id;
  }
  export interface GetExtensionAssociationRequest {
    /**
     * The extension association ID to get.
     */
    ExtensionAssociationId: Id;
  }
  export interface GetExtensionRequest {
    /**
     * The name, the ID, or the Amazon Resource Name (ARN) of the extension.
     */
    ExtensionIdentifier: Identifier;
    /**
     * The extension version number. If no version number was defined, AppConfig uses the highest version.
     */
    VersionNumber?: Integer;
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
    /**
     * A user-defined label for an AppConfig hosted configuration version.
     */
    VersionLabel?: VersionLabel;
    /**
     * The Amazon Resource Name of the Key Management Service key that was used to encrypt this specific version of the configuration data in the AppConfig hosted configuration store.
     */
    KmsKeyArn?: Arn;
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
    /**
     * A user-defined label for an AppConfig hosted configuration version.
     */
    VersionLabel?: VersionLabel;
    /**
     * The Amazon Resource Name of the Key Management Service key that was used to encrypt this specific version of the configuration data in the AppConfig hosted configuration store.
     */
    KmsKeyArn?: Arn;
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
  export type Identifier = string;
  export type Integer = number;
  export type Iso8601DateTime = Date;
  export type KmsKeyIdentifier = string;
  export type KmsKeyIdentifierOrEmpty = string;
  export interface ListApplicationsRequest {
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * A token to start the list. Next token is a pagination token generated by AppConfig to describe what page the previous List call ended on. For the first List request, the nextToken should not be set. On subsequent calls, the nextToken parameter should be set to the previous responses nextToken value. Use this token to get the next set of results. 
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
    /**
     * A filter based on the type of configurations that the configuration profile contains. A configuration can be a feature flag or a freeform configuration.
     */
    Type?: ConfigurationProfileType;
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
     * The maximum number of items that may be returned for this call. If there are items that have not yet been returned, the response will include a non-null NextToken that you can provide in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * The token returned by a prior call to this operation indicating the next set of results to be returned. If not specified, the operation will return the first set of results.
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
  export interface ListExtensionAssociationsRequest {
    /**
     * The ARN of an application, configuration profile, or environment.
     */
    ResourceIdentifier?: Arn;
    /**
     * The name, the ID, or the Amazon Resource Name (ARN) of the extension.
     */
    ExtensionIdentifier?: Identifier;
    /**
     * The version number for the extension defined in the association.
     */
    ExtensionVersionNumber?: Integer;
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * A token to start the list. Use this token to get the next set of results or pass null to get the first set of results. 
     */
    NextToken?: NextToken;
  }
  export interface ListExtensionsRequest {
    /**
     * The maximum number of items to return for this call. The call also returns a token that you can specify in a subsequent call to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * A token to start the list. Use this token to get the next set of results. 
     */
    NextToken?: NextToken;
    /**
     * The extension name.
     */
    Name?: QueryName;
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
    /**
     * An optional filter that can be used to specify the version label of an AppConfig hosted configuration version. This parameter supports filtering by prefix using a wildcard, for example "v2*". If you don't specify an asterisk at the end of the value, only an exact match is returned.
     */
    VersionLabel?: QueryName;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The resource ARN.
     */
    ResourceArn: Arn;
  }
  export type LongName = string;
  export type MaxResults = number;
  export type MinutesBetween0And24Hours = number;
  export interface Monitor {
    /**
     * Amazon Resource Name (ARN) of the Amazon CloudWatch alarm.
     */
    AlarmArn: StringWithLengthBetween1And2048;
    /**
     * ARN of an Identity and Access Management (IAM) role for AppConfig to monitor AlarmArn.
     */
    AlarmRoleArn?: RoleArn;
  }
  export type MonitorList = Monitor[];
  export type Name = string;
  export type NextToken = string;
  export interface Parameter {
    /**
     * Information about the parameter.
     */
    Description?: Description;
    /**
     * A parameter value must be specified in the extension association.
     */
    Required?: Boolean;
  }
  export type ParameterMap = {[key: string]: Parameter};
  export type ParameterValueMap = {[key: string]: StringWithLengthBetween1And2048};
  export type Percentage = number;
  export type QueryName = string;
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
     * The configuration version to deploy. If deploying an AppConfig hosted configuration version, you can specify either the version number or version label. For all other configurations, you must specify the version number.
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
    /**
     * The KMS key identifier (key ID, key alias, or key ARN). AppConfig uses this ID to encrypt the configuration data using a customer managed key. 
     */
    KmsKeyIdentifier?: KmsKeyIdentifier;
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
  export type StringWithLengthBetween1And2048 = string;
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
    /**
     * The identifier for a Key Management Service key to encrypt new configuration data versions in the AppConfig hosted configuration store. This attribute is only used for hosted configuration types. The identifier can be an KMS key ID, alias, or the Amazon Resource Name (ARN) of the key ID or alias. To encrypt data managed in other configuration stores, see the documentation for how to specify an KMS key for that particular service.
     */
    KmsKeyIdentifier?: KmsKeyIdentifierOrEmpty;
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
     * The amount of time that AppConfig monitors for alarms before considering the deployment to be complete and no longer eligible for automatic rollback.
     */
    FinalBakeTimeInMinutes?: MinutesBetween0And24Hours;
    /**
     * The percentage of targets to receive a deployed configuration during each interval.
     */
    GrowthFactor?: GrowthFactor;
    /**
     * The algorithm used to define how percentage grows over time. AppConfig supports the following growth types:  Linear: For this type, AppConfig processes the deployment by increments of the growth factor evenly distributed over the deployment time. For example, a linear deployment that uses a growth factor of 20 initially makes the configuration available to 20 percent of the targets. After 1/5th of the deployment time has passed, the system updates the percentage to 40 percent. This continues until 100% of the targets are set to receive the deployed configuration.  Exponential: For this type, AppConfig processes the deployment exponentially using the following formula: G*(2^N). In this formula, G is the growth factor specified by the user and N is the number of steps until the configuration is deployed to all targets. For example, if you specify a growth factor of 2, then the system rolls out the configuration as follows:  2*(2^0)   2*(2^1)   2*(2^2)  Expressed numerically, the deployment rolls out as follows: 2% of the targets, 4% of the targets, 8% of the targets, and continues until the configuration has been deployed to all targets.
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
  export interface UpdateExtensionAssociationRequest {
    /**
     * The system-generated ID for the association.
     */
    ExtensionAssociationId: Id;
    /**
     * The parameter names and values defined in the extension.
     */
    Parameters?: ParameterValueMap;
  }
  export interface UpdateExtensionRequest {
    /**
     * The name, the ID, or the Amazon Resource Name (ARN) of the extension.
     */
    ExtensionIdentifier: Identifier;
    /**
     * Information about the extension.
     */
    Description?: Description;
    /**
     * The actions defined in the extension.
     */
    Actions?: ActionsMap;
    /**
     * One or more parameters for the actions called by the extension.
     */
    Parameters?: ParameterMap;
    /**
     * The extension version number.
     */
    VersionNumber?: Integer;
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
     * Either the JSON Schema content or the Amazon Resource Name (ARN) of an Lambda function.
     */
    Content: StringWithLengthBetween0And32768;
  }
  export type ValidatorList = Validator[];
  export type ValidatorType = "JSON_SCHEMA"|"LAMBDA"|string;
  export type ValidatorTypeList = ValidatorType[];
  export type Version = string;
  export type VersionLabel = string;
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
