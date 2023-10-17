import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Proton extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Proton.Types.ClientConfiguration)
  config: Config & Proton.Types.ClientConfiguration;
  /**
   * In a management account, an environment account connection request is accepted. When the environment account connection request is accepted, Proton can use the associated IAM role to provision environment infrastructure resources in the associated environment account. For more information, see Environment account connections in the Proton User guide.
   */
  acceptEnvironmentAccountConnection(params: Proton.Types.AcceptEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.AcceptEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.AcceptEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * In a management account, an environment account connection request is accepted. When the environment account connection request is accepted, Proton can use the associated IAM role to provision environment infrastructure resources in the associated environment account. For more information, see Environment account connections in the Proton User guide.
   */
  acceptEnvironmentAccountConnection(callback?: (err: AWSError, data: Proton.Types.AcceptEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.AcceptEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Attempts to cancel a component deployment (for a component that is in the IN_PROGRESS deployment status). For more information about components, see Proton components in the Proton User Guide.
   */
  cancelComponentDeployment(params: Proton.Types.CancelComponentDeploymentInput, callback?: (err: AWSError, data: Proton.Types.CancelComponentDeploymentOutput) => void): Request<Proton.Types.CancelComponentDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel a component deployment (for a component that is in the IN_PROGRESS deployment status). For more information about components, see Proton components in the Proton User Guide.
   */
  cancelComponentDeployment(callback?: (err: AWSError, data: Proton.Types.CancelComponentDeploymentOutput) => void): Request<Proton.Types.CancelComponentDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel an environment deployment on an UpdateEnvironment action, if the deployment is IN_PROGRESS. For more information, see Update an environment in the Proton User guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateEnvironment action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelEnvironmentDeployment(params: Proton.Types.CancelEnvironmentDeploymentInput, callback?: (err: AWSError, data: Proton.Types.CancelEnvironmentDeploymentOutput) => void): Request<Proton.Types.CancelEnvironmentDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel an environment deployment on an UpdateEnvironment action, if the deployment is IN_PROGRESS. For more information, see Update an environment in the Proton User guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateEnvironment action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelEnvironmentDeployment(callback?: (err: AWSError, data: Proton.Types.CancelEnvironmentDeploymentOutput) => void): Request<Proton.Types.CancelEnvironmentDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel a service instance deployment on an UpdateServiceInstance action, if the deployment is IN_PROGRESS. For more information, see Update a service instance in the Proton User guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateServiceInstance action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelServiceInstanceDeployment(params: Proton.Types.CancelServiceInstanceDeploymentInput, callback?: (err: AWSError, data: Proton.Types.CancelServiceInstanceDeploymentOutput) => void): Request<Proton.Types.CancelServiceInstanceDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel a service instance deployment on an UpdateServiceInstance action, if the deployment is IN_PROGRESS. For more information, see Update a service instance in the Proton User guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateServiceInstance action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelServiceInstanceDeployment(callback?: (err: AWSError, data: Proton.Types.CancelServiceInstanceDeploymentOutput) => void): Request<Proton.Types.CancelServiceInstanceDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel a service pipeline deployment on an UpdateServicePipeline action, if the deployment is IN_PROGRESS. For more information, see Update a service pipeline in the Proton User guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateServicePipeline action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelServicePipelineDeployment(params: Proton.Types.CancelServicePipelineDeploymentInput, callback?: (err: AWSError, data: Proton.Types.CancelServicePipelineDeploymentOutput) => void): Request<Proton.Types.CancelServicePipelineDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel a service pipeline deployment on an UpdateServicePipeline action, if the deployment is IN_PROGRESS. For more information, see Update a service pipeline in the Proton User guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateServicePipeline action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelServicePipelineDeployment(callback?: (err: AWSError, data: Proton.Types.CancelServicePipelineDeploymentOutput) => void): Request<Proton.Types.CancelServicePipelineDeploymentOutput, AWSError>;
  /**
   * Create an Proton component. A component is an infrastructure extension for a service instance. For more information about components, see Proton components in the Proton User Guide.
   */
  createComponent(params: Proton.Types.CreateComponentInput, callback?: (err: AWSError, data: Proton.Types.CreateComponentOutput) => void): Request<Proton.Types.CreateComponentOutput, AWSError>;
  /**
   * Create an Proton component. A component is an infrastructure extension for a service instance. For more information about components, see Proton components in the Proton User Guide.
   */
  createComponent(callback?: (err: AWSError, data: Proton.Types.CreateComponentOutput) => void): Request<Proton.Types.CreateComponentOutput, AWSError>;
  /**
   * Deploy a new environment. An Proton environment is created from an environment template that defines infrastructure and resources that can be shared across services.  You can provision environments using the following methods:    Amazon Web Services-managed provisioning: Proton makes direct calls to provision your resources.   Self-managed provisioning: Proton makes pull requests on your repository to provide compiled infrastructure as code (IaC) files that your IaC engine uses to provision resources.   For more information, see Environments and Provisioning methods in the Proton User Guide.
   */
  createEnvironment(params: Proton.Types.CreateEnvironmentInput, callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentOutput) => void): Request<Proton.Types.CreateEnvironmentOutput, AWSError>;
  /**
   * Deploy a new environment. An Proton environment is created from an environment template that defines infrastructure and resources that can be shared across services.  You can provision environments using the following methods:    Amazon Web Services-managed provisioning: Proton makes direct calls to provision your resources.   Self-managed provisioning: Proton makes pull requests on your repository to provide compiled infrastructure as code (IaC) files that your IaC engine uses to provision resources.   For more information, see Environments and Provisioning methods in the Proton User Guide.
   */
  createEnvironment(callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentOutput) => void): Request<Proton.Types.CreateEnvironmentOutput, AWSError>;
  /**
   * Create an environment account connection in an environment account so that environment infrastructure resources can be provisioned in the environment account from a management account. An environment account connection is a secure bi-directional connection between a management account and an environment account that maintains authorization and permissions. For more information, see Environment account connections in the Proton User guide.
   */
  createEnvironmentAccountConnection(params: Proton.Types.CreateEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.CreateEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Create an environment account connection in an environment account so that environment infrastructure resources can be provisioned in the environment account from a management account. An environment account connection is a secure bi-directional connection between a management account and an environment account that maintains authorization and permissions. For more information, see Environment account connections in the Proton User guide.
   */
  createEnvironmentAccountConnection(callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.CreateEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Create an environment template for Proton. For more information, see Environment Templates in the Proton User Guide. You can create an environment template in one of the two following ways:   Register and publish a standard environment template that instructs Proton to deploy and manage environment infrastructure.   Register and publish a customer managed environment template that connects Proton to your existing provisioned infrastructure that you manage. Proton doesn't manage your existing provisioned infrastructure. To create an environment template for customer provisioned and managed infrastructure, include the provisioning parameter and set the value to CUSTOMER_MANAGED. For more information, see Register and publish an environment template in the Proton User Guide.  
   */
  createEnvironmentTemplate(params: Proton.Types.CreateEnvironmentTemplateInput, callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentTemplateOutput) => void): Request<Proton.Types.CreateEnvironmentTemplateOutput, AWSError>;
  /**
   * Create an environment template for Proton. For more information, see Environment Templates in the Proton User Guide. You can create an environment template in one of the two following ways:   Register and publish a standard environment template that instructs Proton to deploy and manage environment infrastructure.   Register and publish a customer managed environment template that connects Proton to your existing provisioned infrastructure that you manage. Proton doesn't manage your existing provisioned infrastructure. To create an environment template for customer provisioned and managed infrastructure, include the provisioning parameter and set the value to CUSTOMER_MANAGED. For more information, see Register and publish an environment template in the Proton User Guide.  
   */
  createEnvironmentTemplate(callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentTemplateOutput) => void): Request<Proton.Types.CreateEnvironmentTemplateOutput, AWSError>;
  /**
   * Create a new major or minor version of an environment template. A major version of an environment template is a version that isn't backwards compatible. A minor version of an environment template is a version that's backwards compatible within its major version.
   */
  createEnvironmentTemplateVersion(params: Proton.Types.CreateEnvironmentTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.CreateEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * Create a new major or minor version of an environment template. A major version of an environment template is a version that isn't backwards compatible. A minor version of an environment template is a version that's backwards compatible within its major version.
   */
  createEnvironmentTemplateVersion(callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.CreateEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * Create and register a link to a repository. Proton uses the link to repeatedly access the repository, to either push to it (self-managed provisioning) or pull from it (template sync). You can share a linked repository across multiple resources (like environments using self-managed provisioning, or synced templates). When you create a repository link, Proton creates a service-linked role for you. For more information, see Self-managed provisioning, Template bundles, and Template sync configurations in the Proton User Guide.
   */
  createRepository(params: Proton.Types.CreateRepositoryInput, callback?: (err: AWSError, data: Proton.Types.CreateRepositoryOutput) => void): Request<Proton.Types.CreateRepositoryOutput, AWSError>;
  /**
   * Create and register a link to a repository. Proton uses the link to repeatedly access the repository, to either push to it (self-managed provisioning) or pull from it (template sync). You can share a linked repository across multiple resources (like environments using self-managed provisioning, or synced templates). When you create a repository link, Proton creates a service-linked role for you. For more information, see Self-managed provisioning, Template bundles, and Template sync configurations in the Proton User Guide.
   */
  createRepository(callback?: (err: AWSError, data: Proton.Types.CreateRepositoryOutput) => void): Request<Proton.Types.CreateRepositoryOutput, AWSError>;
  /**
   * Create an Proton service. An Proton service is an instantiation of a service template and often includes several service instances and pipeline. For more information, see Services in the Proton User Guide.
   */
  createService(params: Proton.Types.CreateServiceInput, callback?: (err: AWSError, data: Proton.Types.CreateServiceOutput) => void): Request<Proton.Types.CreateServiceOutput, AWSError>;
  /**
   * Create an Proton service. An Proton service is an instantiation of a service template and often includes several service instances and pipeline. For more information, see Services in the Proton User Guide.
   */
  createService(callback?: (err: AWSError, data: Proton.Types.CreateServiceOutput) => void): Request<Proton.Types.CreateServiceOutput, AWSError>;
  /**
   * Create a service instance.
   */
  createServiceInstance(params: Proton.Types.CreateServiceInstanceInput, callback?: (err: AWSError, data: Proton.Types.CreateServiceInstanceOutput) => void): Request<Proton.Types.CreateServiceInstanceOutput, AWSError>;
  /**
   * Create a service instance.
   */
  createServiceInstance(callback?: (err: AWSError, data: Proton.Types.CreateServiceInstanceOutput) => void): Request<Proton.Types.CreateServiceInstanceOutput, AWSError>;
  /**
   * Create the Proton Ops configuration file.
   */
  createServiceSyncConfig(params: Proton.Types.CreateServiceSyncConfigInput, callback?: (err: AWSError, data: Proton.Types.CreateServiceSyncConfigOutput) => void): Request<Proton.Types.CreateServiceSyncConfigOutput, AWSError>;
  /**
   * Create the Proton Ops configuration file.
   */
  createServiceSyncConfig(callback?: (err: AWSError, data: Proton.Types.CreateServiceSyncConfigOutput) => void): Request<Proton.Types.CreateServiceSyncConfigOutput, AWSError>;
  /**
   * Create a service template. The administrator creates a service template to define standardized infrastructure and an optional CI/CD service pipeline. Developers, in turn, select the service template from Proton. If the selected service template includes a service pipeline definition, they provide a link to their source code repository. Proton then deploys and manages the infrastructure defined by the selected service template. For more information, see Proton templates in the Proton User Guide.
   */
  createServiceTemplate(params: Proton.Types.CreateServiceTemplateInput, callback?: (err: AWSError, data: Proton.Types.CreateServiceTemplateOutput) => void): Request<Proton.Types.CreateServiceTemplateOutput, AWSError>;
  /**
   * Create a service template. The administrator creates a service template to define standardized infrastructure and an optional CI/CD service pipeline. Developers, in turn, select the service template from Proton. If the selected service template includes a service pipeline definition, they provide a link to their source code repository. Proton then deploys and manages the infrastructure defined by the selected service template. For more information, see Proton templates in the Proton User Guide.
   */
  createServiceTemplate(callback?: (err: AWSError, data: Proton.Types.CreateServiceTemplateOutput) => void): Request<Proton.Types.CreateServiceTemplateOutput, AWSError>;
  /**
   * Create a new major or minor version of a service template. A major version of a service template is a version that isn't backward compatible. A minor version of a service template is a version that's backward compatible within its major version.
   */
  createServiceTemplateVersion(params: Proton.Types.CreateServiceTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.CreateServiceTemplateVersionOutput) => void): Request<Proton.Types.CreateServiceTemplateVersionOutput, AWSError>;
  /**
   * Create a new major or minor version of a service template. A major version of a service template is a version that isn't backward compatible. A minor version of a service template is a version that's backward compatible within its major version.
   */
  createServiceTemplateVersion(callback?: (err: AWSError, data: Proton.Types.CreateServiceTemplateVersionOutput) => void): Request<Proton.Types.CreateServiceTemplateVersionOutput, AWSError>;
  /**
   * Set up a template to create new template versions automatically by tracking a linked repository. A linked repository is a repository that has been registered with Proton. For more information, see CreateRepository. When a commit is pushed to your linked repository, Proton checks for changes to your repository template bundles. If it detects a template bundle change, a new major or minor version of its template is created, if the version doesn’t already exist. For more information, see Template sync configurations in the Proton User Guide.
   */
  createTemplateSyncConfig(params: Proton.Types.CreateTemplateSyncConfigInput, callback?: (err: AWSError, data: Proton.Types.CreateTemplateSyncConfigOutput) => void): Request<Proton.Types.CreateTemplateSyncConfigOutput, AWSError>;
  /**
   * Set up a template to create new template versions automatically by tracking a linked repository. A linked repository is a repository that has been registered with Proton. For more information, see CreateRepository. When a commit is pushed to your linked repository, Proton checks for changes to your repository template bundles. If it detects a template bundle change, a new major or minor version of its template is created, if the version doesn’t already exist. For more information, see Template sync configurations in the Proton User Guide.
   */
  createTemplateSyncConfig(callback?: (err: AWSError, data: Proton.Types.CreateTemplateSyncConfigOutput) => void): Request<Proton.Types.CreateTemplateSyncConfigOutput, AWSError>;
  /**
   * Delete an Proton component resource. For more information about components, see Proton components in the Proton User Guide.
   */
  deleteComponent(params: Proton.Types.DeleteComponentInput, callback?: (err: AWSError, data: Proton.Types.DeleteComponentOutput) => void): Request<Proton.Types.DeleteComponentOutput, AWSError>;
  /**
   * Delete an Proton component resource. For more information about components, see Proton components in the Proton User Guide.
   */
  deleteComponent(callback?: (err: AWSError, data: Proton.Types.DeleteComponentOutput) => void): Request<Proton.Types.DeleteComponentOutput, AWSError>;
  /**
   * Delete the deployment.
   */
  deleteDeployment(params: Proton.Types.DeleteDeploymentInput, callback?: (err: AWSError, data: Proton.Types.DeleteDeploymentOutput) => void): Request<Proton.Types.DeleteDeploymentOutput, AWSError>;
  /**
   * Delete the deployment.
   */
  deleteDeployment(callback?: (err: AWSError, data: Proton.Types.DeleteDeploymentOutput) => void): Request<Proton.Types.DeleteDeploymentOutput, AWSError>;
  /**
   * Delete an environment.
   */
  deleteEnvironment(params: Proton.Types.DeleteEnvironmentInput, callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentOutput) => void): Request<Proton.Types.DeleteEnvironmentOutput, AWSError>;
  /**
   * Delete an environment.
   */
  deleteEnvironment(callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentOutput) => void): Request<Proton.Types.DeleteEnvironmentOutput, AWSError>;
  /**
   * In an environment account, delete an environment account connection. After you delete an environment account connection that’s in use by an Proton environment, Proton can’t manage the environment infrastructure resources until a new environment account connection is accepted for the environment account and associated environment. You're responsible for cleaning up provisioned resources that remain without an environment connection. For more information, see Environment account connections in the Proton User guide.
   */
  deleteEnvironmentAccountConnection(params: Proton.Types.DeleteEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.DeleteEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * In an environment account, delete an environment account connection. After you delete an environment account connection that’s in use by an Proton environment, Proton can’t manage the environment infrastructure resources until a new environment account connection is accepted for the environment account and associated environment. You're responsible for cleaning up provisioned resources that remain without an environment connection. For more information, see Environment account connections in the Proton User guide.
   */
  deleteEnvironmentAccountConnection(callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.DeleteEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * If no other major or minor versions of an environment template exist, delete the environment template.
   */
  deleteEnvironmentTemplate(params: Proton.Types.DeleteEnvironmentTemplateInput, callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentTemplateOutput) => void): Request<Proton.Types.DeleteEnvironmentTemplateOutput, AWSError>;
  /**
   * If no other major or minor versions of an environment template exist, delete the environment template.
   */
  deleteEnvironmentTemplate(callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentTemplateOutput) => void): Request<Proton.Types.DeleteEnvironmentTemplateOutput, AWSError>;
  /**
   * If no other minor versions of an environment template exist, delete a major version of the environment template if it's not the Recommended version. Delete the Recommended version of the environment template if no other major versions or minor versions of the environment template exist. A major version of an environment template is a version that's not backward compatible. Delete a minor version of an environment template if it isn't the Recommended version. Delete a Recommended minor version of the environment template if no other minor versions of the environment template exist. A minor version of an environment template is a version that's backward compatible.
   */
  deleteEnvironmentTemplateVersion(params: Proton.Types.DeleteEnvironmentTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.DeleteEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * If no other minor versions of an environment template exist, delete a major version of the environment template if it's not the Recommended version. Delete the Recommended version of the environment template if no other major versions or minor versions of the environment template exist. A major version of an environment template is a version that's not backward compatible. Delete a minor version of an environment template if it isn't the Recommended version. Delete a Recommended minor version of the environment template if no other minor versions of the environment template exist. A minor version of an environment template is a version that's backward compatible.
   */
  deleteEnvironmentTemplateVersion(callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.DeleteEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * De-register and unlink your repository.
   */
  deleteRepository(params: Proton.Types.DeleteRepositoryInput, callback?: (err: AWSError, data: Proton.Types.DeleteRepositoryOutput) => void): Request<Proton.Types.DeleteRepositoryOutput, AWSError>;
  /**
   * De-register and unlink your repository.
   */
  deleteRepository(callback?: (err: AWSError, data: Proton.Types.DeleteRepositoryOutput) => void): Request<Proton.Types.DeleteRepositoryOutput, AWSError>;
  /**
   * Delete a service, with its instances and pipeline.  You can't delete a service if it has any service instances that have components attached to them. For more information about components, see Proton components in the Proton User Guide. 
   */
  deleteService(params: Proton.Types.DeleteServiceInput, callback?: (err: AWSError, data: Proton.Types.DeleteServiceOutput) => void): Request<Proton.Types.DeleteServiceOutput, AWSError>;
  /**
   * Delete a service, with its instances and pipeline.  You can't delete a service if it has any service instances that have components attached to them. For more information about components, see Proton components in the Proton User Guide. 
   */
  deleteService(callback?: (err: AWSError, data: Proton.Types.DeleteServiceOutput) => void): Request<Proton.Types.DeleteServiceOutput, AWSError>;
  /**
   * Delete the Proton Ops file.
   */
  deleteServiceSyncConfig(params: Proton.Types.DeleteServiceSyncConfigInput, callback?: (err: AWSError, data: Proton.Types.DeleteServiceSyncConfigOutput) => void): Request<Proton.Types.DeleteServiceSyncConfigOutput, AWSError>;
  /**
   * Delete the Proton Ops file.
   */
  deleteServiceSyncConfig(callback?: (err: AWSError, data: Proton.Types.DeleteServiceSyncConfigOutput) => void): Request<Proton.Types.DeleteServiceSyncConfigOutput, AWSError>;
  /**
   * If no other major or minor versions of the service template exist, delete the service template.
   */
  deleteServiceTemplate(params: Proton.Types.DeleteServiceTemplateInput, callback?: (err: AWSError, data: Proton.Types.DeleteServiceTemplateOutput) => void): Request<Proton.Types.DeleteServiceTemplateOutput, AWSError>;
  /**
   * If no other major or minor versions of the service template exist, delete the service template.
   */
  deleteServiceTemplate(callback?: (err: AWSError, data: Proton.Types.DeleteServiceTemplateOutput) => void): Request<Proton.Types.DeleteServiceTemplateOutput, AWSError>;
  /**
   * If no other minor versions of a service template exist, delete a major version of the service template if it's not the Recommended version. Delete the Recommended version of the service template if no other major versions or minor versions of the service template exist. A major version of a service template is a version that isn't backwards compatible. Delete a minor version of a service template if it's not the Recommended version. Delete a Recommended minor version of the service template if no other minor versions of the service template exist. A minor version of a service template is a version that's backwards compatible.
   */
  deleteServiceTemplateVersion(params: Proton.Types.DeleteServiceTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.DeleteServiceTemplateVersionOutput) => void): Request<Proton.Types.DeleteServiceTemplateVersionOutput, AWSError>;
  /**
   * If no other minor versions of a service template exist, delete a major version of the service template if it's not the Recommended version. Delete the Recommended version of the service template if no other major versions or minor versions of the service template exist. A major version of a service template is a version that isn't backwards compatible. Delete a minor version of a service template if it's not the Recommended version. Delete a Recommended minor version of the service template if no other minor versions of the service template exist. A minor version of a service template is a version that's backwards compatible.
   */
  deleteServiceTemplateVersion(callback?: (err: AWSError, data: Proton.Types.DeleteServiceTemplateVersionOutput) => void): Request<Proton.Types.DeleteServiceTemplateVersionOutput, AWSError>;
  /**
   * Delete a template sync configuration.
   */
  deleteTemplateSyncConfig(params: Proton.Types.DeleteTemplateSyncConfigInput, callback?: (err: AWSError, data: Proton.Types.DeleteTemplateSyncConfigOutput) => void): Request<Proton.Types.DeleteTemplateSyncConfigOutput, AWSError>;
  /**
   * Delete a template sync configuration.
   */
  deleteTemplateSyncConfig(callback?: (err: AWSError, data: Proton.Types.DeleteTemplateSyncConfigOutput) => void): Request<Proton.Types.DeleteTemplateSyncConfigOutput, AWSError>;
  /**
   * Get detail data for Proton account-wide settings.
   */
  getAccountSettings(params: Proton.Types.GetAccountSettingsInput, callback?: (err: AWSError, data: Proton.Types.GetAccountSettingsOutput) => void): Request<Proton.Types.GetAccountSettingsOutput, AWSError>;
  /**
   * Get detail data for Proton account-wide settings.
   */
  getAccountSettings(callback?: (err: AWSError, data: Proton.Types.GetAccountSettingsOutput) => void): Request<Proton.Types.GetAccountSettingsOutput, AWSError>;
  /**
   * Get detailed data for a component. For more information about components, see Proton components in the Proton User Guide.
   */
  getComponent(params: Proton.Types.GetComponentInput, callback?: (err: AWSError, data: Proton.Types.GetComponentOutput) => void): Request<Proton.Types.GetComponentOutput, AWSError>;
  /**
   * Get detailed data for a component. For more information about components, see Proton components in the Proton User Guide.
   */
  getComponent(callback?: (err: AWSError, data: Proton.Types.GetComponentOutput) => void): Request<Proton.Types.GetComponentOutput, AWSError>;
  /**
   * Get detailed data for a deployment.
   */
  getDeployment(params: Proton.Types.GetDeploymentInput, callback?: (err: AWSError, data: Proton.Types.GetDeploymentOutput) => void): Request<Proton.Types.GetDeploymentOutput, AWSError>;
  /**
   * Get detailed data for a deployment.
   */
  getDeployment(callback?: (err: AWSError, data: Proton.Types.GetDeploymentOutput) => void): Request<Proton.Types.GetDeploymentOutput, AWSError>;
  /**
   * Get detailed data for an environment.
   */
  getEnvironment(params: Proton.Types.GetEnvironmentInput, callback?: (err: AWSError, data: Proton.Types.GetEnvironmentOutput) => void): Request<Proton.Types.GetEnvironmentOutput, AWSError>;
  /**
   * Get detailed data for an environment.
   */
  getEnvironment(callback?: (err: AWSError, data: Proton.Types.GetEnvironmentOutput) => void): Request<Proton.Types.GetEnvironmentOutput, AWSError>;
  /**
   * In an environment account, get the detailed data for an environment account connection. For more information, see Environment account connections in the Proton User guide.
   */
  getEnvironmentAccountConnection(params: Proton.Types.GetEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.GetEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.GetEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * In an environment account, get the detailed data for an environment account connection. For more information, see Environment account connections in the Proton User guide.
   */
  getEnvironmentAccountConnection(callback?: (err: AWSError, data: Proton.Types.GetEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.GetEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Get detailed data for an environment template.
   */
  getEnvironmentTemplate(params: Proton.Types.GetEnvironmentTemplateInput, callback?: (err: AWSError, data: Proton.Types.GetEnvironmentTemplateOutput) => void): Request<Proton.Types.GetEnvironmentTemplateOutput, AWSError>;
  /**
   * Get detailed data for an environment template.
   */
  getEnvironmentTemplate(callback?: (err: AWSError, data: Proton.Types.GetEnvironmentTemplateOutput) => void): Request<Proton.Types.GetEnvironmentTemplateOutput, AWSError>;
  /**
   * Get detailed data for a major or minor version of an environment template.
   */
  getEnvironmentTemplateVersion(params: Proton.Types.GetEnvironmentTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.GetEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.GetEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * Get detailed data for a major or minor version of an environment template.
   */
  getEnvironmentTemplateVersion(callback?: (err: AWSError, data: Proton.Types.GetEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.GetEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * Get detail data for a linked repository.
   */
  getRepository(params: Proton.Types.GetRepositoryInput, callback?: (err: AWSError, data: Proton.Types.GetRepositoryOutput) => void): Request<Proton.Types.GetRepositoryOutput, AWSError>;
  /**
   * Get detail data for a linked repository.
   */
  getRepository(callback?: (err: AWSError, data: Proton.Types.GetRepositoryOutput) => void): Request<Proton.Types.GetRepositoryOutput, AWSError>;
  /**
   * Get the sync status of a repository used for Proton template sync. For more information about template sync, see .  A repository sync status isn't tied to the Proton Repository resource (or any other Proton resource). Therefore, tags on an Proton Repository resource have no effect on this action. Specifically, you can't use these tags to control access to this action using Attribute-based access control (ABAC). For more information about ABAC, see ABAC in the Proton User Guide. 
   */
  getRepositorySyncStatus(params: Proton.Types.GetRepositorySyncStatusInput, callback?: (err: AWSError, data: Proton.Types.GetRepositorySyncStatusOutput) => void): Request<Proton.Types.GetRepositorySyncStatusOutput, AWSError>;
  /**
   * Get the sync status of a repository used for Proton template sync. For more information about template sync, see .  A repository sync status isn't tied to the Proton Repository resource (or any other Proton resource). Therefore, tags on an Proton Repository resource have no effect on this action. Specifically, you can't use these tags to control access to this action using Attribute-based access control (ABAC). For more information about ABAC, see ABAC in the Proton User Guide. 
   */
  getRepositorySyncStatus(callback?: (err: AWSError, data: Proton.Types.GetRepositorySyncStatusOutput) => void): Request<Proton.Types.GetRepositorySyncStatusOutput, AWSError>;
  /**
   * Get counts of Proton resources. For infrastructure-provisioning resources (environments, services, service instances, pipelines), the action returns staleness counts. A resource is stale when it's behind the recommended version of the Proton template that it uses and it needs an update to become current. The action returns staleness counts (counts of resources that are up-to-date, behind a template major version, or behind a template minor version), the total number of resources, and the number of resources that are in a failed state, grouped by resource type. Components, environments, and service templates return less information - see the components, environments, and serviceTemplates field descriptions. For context, the action also returns the total number of each type of Proton template in the Amazon Web Services account. For more information, see Proton dashboard in the Proton User Guide.
   */
  getResourcesSummary(params: Proton.Types.GetResourcesSummaryInput, callback?: (err: AWSError, data: Proton.Types.GetResourcesSummaryOutput) => void): Request<Proton.Types.GetResourcesSummaryOutput, AWSError>;
  /**
   * Get counts of Proton resources. For infrastructure-provisioning resources (environments, services, service instances, pipelines), the action returns staleness counts. A resource is stale when it's behind the recommended version of the Proton template that it uses and it needs an update to become current. The action returns staleness counts (counts of resources that are up-to-date, behind a template major version, or behind a template minor version), the total number of resources, and the number of resources that are in a failed state, grouped by resource type. Components, environments, and service templates return less information - see the components, environments, and serviceTemplates field descriptions. For context, the action also returns the total number of each type of Proton template in the Amazon Web Services account. For more information, see Proton dashboard in the Proton User Guide.
   */
  getResourcesSummary(callback?: (err: AWSError, data: Proton.Types.GetResourcesSummaryOutput) => void): Request<Proton.Types.GetResourcesSummaryOutput, AWSError>;
  /**
   * Get detailed data for a service.
   */
  getService(params: Proton.Types.GetServiceInput, callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Get detailed data for a service.
   */
  getService(callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Get detailed data for a service instance. A service instance is an instantiation of service template and it runs in a specific environment.
   */
  getServiceInstance(params: Proton.Types.GetServiceInstanceInput, callback?: (err: AWSError, data: Proton.Types.GetServiceInstanceOutput) => void): Request<Proton.Types.GetServiceInstanceOutput, AWSError>;
  /**
   * Get detailed data for a service instance. A service instance is an instantiation of service template and it runs in a specific environment.
   */
  getServiceInstance(callback?: (err: AWSError, data: Proton.Types.GetServiceInstanceOutput) => void): Request<Proton.Types.GetServiceInstanceOutput, AWSError>;
  /**
   * Get the status of the synced service instance.
   */
  getServiceInstanceSyncStatus(params: Proton.Types.GetServiceInstanceSyncStatusInput, callback?: (err: AWSError, data: Proton.Types.GetServiceInstanceSyncStatusOutput) => void): Request<Proton.Types.GetServiceInstanceSyncStatusOutput, AWSError>;
  /**
   * Get the status of the synced service instance.
   */
  getServiceInstanceSyncStatus(callback?: (err: AWSError, data: Proton.Types.GetServiceInstanceSyncStatusOutput) => void): Request<Proton.Types.GetServiceInstanceSyncStatusOutput, AWSError>;
  /**
   * Get detailed data for the service sync blocker summary.
   */
  getServiceSyncBlockerSummary(params: Proton.Types.GetServiceSyncBlockerSummaryInput, callback?: (err: AWSError, data: Proton.Types.GetServiceSyncBlockerSummaryOutput) => void): Request<Proton.Types.GetServiceSyncBlockerSummaryOutput, AWSError>;
  /**
   * Get detailed data for the service sync blocker summary.
   */
  getServiceSyncBlockerSummary(callback?: (err: AWSError, data: Proton.Types.GetServiceSyncBlockerSummaryOutput) => void): Request<Proton.Types.GetServiceSyncBlockerSummaryOutput, AWSError>;
  /**
   * Get detailed information for the service sync configuration.
   */
  getServiceSyncConfig(params: Proton.Types.GetServiceSyncConfigInput, callback?: (err: AWSError, data: Proton.Types.GetServiceSyncConfigOutput) => void): Request<Proton.Types.GetServiceSyncConfigOutput, AWSError>;
  /**
   * Get detailed information for the service sync configuration.
   */
  getServiceSyncConfig(callback?: (err: AWSError, data: Proton.Types.GetServiceSyncConfigOutput) => void): Request<Proton.Types.GetServiceSyncConfigOutput, AWSError>;
  /**
   * Get detailed data for a service template.
   */
  getServiceTemplate(params: Proton.Types.GetServiceTemplateInput, callback?: (err: AWSError, data: Proton.Types.GetServiceTemplateOutput) => void): Request<Proton.Types.GetServiceTemplateOutput, AWSError>;
  /**
   * Get detailed data for a service template.
   */
  getServiceTemplate(callback?: (err: AWSError, data: Proton.Types.GetServiceTemplateOutput) => void): Request<Proton.Types.GetServiceTemplateOutput, AWSError>;
  /**
   * Get detailed data for a major or minor version of a service template.
   */
  getServiceTemplateVersion(params: Proton.Types.GetServiceTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.GetServiceTemplateVersionOutput) => void): Request<Proton.Types.GetServiceTemplateVersionOutput, AWSError>;
  /**
   * Get detailed data for a major or minor version of a service template.
   */
  getServiceTemplateVersion(callback?: (err: AWSError, data: Proton.Types.GetServiceTemplateVersionOutput) => void): Request<Proton.Types.GetServiceTemplateVersionOutput, AWSError>;
  /**
   * Get detail data for a template sync configuration.
   */
  getTemplateSyncConfig(params: Proton.Types.GetTemplateSyncConfigInput, callback?: (err: AWSError, data: Proton.Types.GetTemplateSyncConfigOutput) => void): Request<Proton.Types.GetTemplateSyncConfigOutput, AWSError>;
  /**
   * Get detail data for a template sync configuration.
   */
  getTemplateSyncConfig(callback?: (err: AWSError, data: Proton.Types.GetTemplateSyncConfigOutput) => void): Request<Proton.Types.GetTemplateSyncConfigOutput, AWSError>;
  /**
   * Get the status of a template sync.
   */
  getTemplateSyncStatus(params: Proton.Types.GetTemplateSyncStatusInput, callback?: (err: AWSError, data: Proton.Types.GetTemplateSyncStatusOutput) => void): Request<Proton.Types.GetTemplateSyncStatusOutput, AWSError>;
  /**
   * Get the status of a template sync.
   */
  getTemplateSyncStatus(callback?: (err: AWSError, data: Proton.Types.GetTemplateSyncStatusOutput) => void): Request<Proton.Types.GetTemplateSyncStatusOutput, AWSError>;
  /**
   * Get a list of component Infrastructure as Code (IaC) outputs. For more information about components, see Proton components in the Proton User Guide.
   */
  listComponentOutputs(params: Proton.Types.ListComponentOutputsInput, callback?: (err: AWSError, data: Proton.Types.ListComponentOutputsOutput) => void): Request<Proton.Types.ListComponentOutputsOutput, AWSError>;
  /**
   * Get a list of component Infrastructure as Code (IaC) outputs. For more information about components, see Proton components in the Proton User Guide.
   */
  listComponentOutputs(callback?: (err: AWSError, data: Proton.Types.ListComponentOutputsOutput) => void): Request<Proton.Types.ListComponentOutputsOutput, AWSError>;
  /**
   * List provisioned resources for a component with details. For more information about components, see Proton components in the Proton User Guide.
   */
  listComponentProvisionedResources(params: Proton.Types.ListComponentProvisionedResourcesInput, callback?: (err: AWSError, data: Proton.Types.ListComponentProvisionedResourcesOutput) => void): Request<Proton.Types.ListComponentProvisionedResourcesOutput, AWSError>;
  /**
   * List provisioned resources for a component with details. For more information about components, see Proton components in the Proton User Guide.
   */
  listComponentProvisionedResources(callback?: (err: AWSError, data: Proton.Types.ListComponentProvisionedResourcesOutput) => void): Request<Proton.Types.ListComponentProvisionedResourcesOutput, AWSError>;
  /**
   * List components with summary data. You can filter the result list by environment, service, or a single service instance. For more information about components, see Proton components in the Proton User Guide.
   */
  listComponents(params: Proton.Types.ListComponentsInput, callback?: (err: AWSError, data: Proton.Types.ListComponentsOutput) => void): Request<Proton.Types.ListComponentsOutput, AWSError>;
  /**
   * List components with summary data. You can filter the result list by environment, service, or a single service instance. For more information about components, see Proton components in the Proton User Guide.
   */
  listComponents(callback?: (err: AWSError, data: Proton.Types.ListComponentsOutput) => void): Request<Proton.Types.ListComponentsOutput, AWSError>;
  /**
   * List deployments. You can filter the result list by environment, service, or a single service instance.
   */
  listDeployments(params: Proton.Types.ListDeploymentsInput, callback?: (err: AWSError, data: Proton.Types.ListDeploymentsOutput) => void): Request<Proton.Types.ListDeploymentsOutput, AWSError>;
  /**
   * List deployments. You can filter the result list by environment, service, or a single service instance.
   */
  listDeployments(callback?: (err: AWSError, data: Proton.Types.ListDeploymentsOutput) => void): Request<Proton.Types.ListDeploymentsOutput, AWSError>;
  /**
   * View a list of environment account connections. For more information, see Environment account connections in the Proton User guide.
   */
  listEnvironmentAccountConnections(params: Proton.Types.ListEnvironmentAccountConnectionsInput, callback?: (err: AWSError, data: Proton.Types.ListEnvironmentAccountConnectionsOutput) => void): Request<Proton.Types.ListEnvironmentAccountConnectionsOutput, AWSError>;
  /**
   * View a list of environment account connections. For more information, see Environment account connections in the Proton User guide.
   */
  listEnvironmentAccountConnections(callback?: (err: AWSError, data: Proton.Types.ListEnvironmentAccountConnectionsOutput) => void): Request<Proton.Types.ListEnvironmentAccountConnectionsOutput, AWSError>;
  /**
   * List the infrastructure as code outputs for your environment.
   */
  listEnvironmentOutputs(params: Proton.Types.ListEnvironmentOutputsInput, callback?: (err: AWSError, data: Proton.Types.ListEnvironmentOutputsOutput) => void): Request<Proton.Types.ListEnvironmentOutputsOutput, AWSError>;
  /**
   * List the infrastructure as code outputs for your environment.
   */
  listEnvironmentOutputs(callback?: (err: AWSError, data: Proton.Types.ListEnvironmentOutputsOutput) => void): Request<Proton.Types.ListEnvironmentOutputsOutput, AWSError>;
  /**
   * List the provisioned resources for your environment.
   */
  listEnvironmentProvisionedResources(params: Proton.Types.ListEnvironmentProvisionedResourcesInput, callback?: (err: AWSError, data: Proton.Types.ListEnvironmentProvisionedResourcesOutput) => void): Request<Proton.Types.ListEnvironmentProvisionedResourcesOutput, AWSError>;
  /**
   * List the provisioned resources for your environment.
   */
  listEnvironmentProvisionedResources(callback?: (err: AWSError, data: Proton.Types.ListEnvironmentProvisionedResourcesOutput) => void): Request<Proton.Types.ListEnvironmentProvisionedResourcesOutput, AWSError>;
  /**
   * List major or minor versions of an environment template with detail data.
   */
  listEnvironmentTemplateVersions(params: Proton.Types.ListEnvironmentTemplateVersionsInput, callback?: (err: AWSError, data: Proton.Types.ListEnvironmentTemplateVersionsOutput) => void): Request<Proton.Types.ListEnvironmentTemplateVersionsOutput, AWSError>;
  /**
   * List major or minor versions of an environment template with detail data.
   */
  listEnvironmentTemplateVersions(callback?: (err: AWSError, data: Proton.Types.ListEnvironmentTemplateVersionsOutput) => void): Request<Proton.Types.ListEnvironmentTemplateVersionsOutput, AWSError>;
  /**
   * List environment templates.
   */
  listEnvironmentTemplates(params: Proton.Types.ListEnvironmentTemplatesInput, callback?: (err: AWSError, data: Proton.Types.ListEnvironmentTemplatesOutput) => void): Request<Proton.Types.ListEnvironmentTemplatesOutput, AWSError>;
  /**
   * List environment templates.
   */
  listEnvironmentTemplates(callback?: (err: AWSError, data: Proton.Types.ListEnvironmentTemplatesOutput) => void): Request<Proton.Types.ListEnvironmentTemplatesOutput, AWSError>;
  /**
   * List environments with detail data summaries.
   */
  listEnvironments(params: Proton.Types.ListEnvironmentsInput, callback?: (err: AWSError, data: Proton.Types.ListEnvironmentsOutput) => void): Request<Proton.Types.ListEnvironmentsOutput, AWSError>;
  /**
   * List environments with detail data summaries.
   */
  listEnvironments(callback?: (err: AWSError, data: Proton.Types.ListEnvironmentsOutput) => void): Request<Proton.Types.ListEnvironmentsOutput, AWSError>;
  /**
   * List linked repositories with detail data.
   */
  listRepositories(params: Proton.Types.ListRepositoriesInput, callback?: (err: AWSError, data: Proton.Types.ListRepositoriesOutput) => void): Request<Proton.Types.ListRepositoriesOutput, AWSError>;
  /**
   * List linked repositories with detail data.
   */
  listRepositories(callback?: (err: AWSError, data: Proton.Types.ListRepositoriesOutput) => void): Request<Proton.Types.ListRepositoriesOutput, AWSError>;
  /**
   * List repository sync definitions with detail data.
   */
  listRepositorySyncDefinitions(params: Proton.Types.ListRepositorySyncDefinitionsInput, callback?: (err: AWSError, data: Proton.Types.ListRepositorySyncDefinitionsOutput) => void): Request<Proton.Types.ListRepositorySyncDefinitionsOutput, AWSError>;
  /**
   * List repository sync definitions with detail data.
   */
  listRepositorySyncDefinitions(callback?: (err: AWSError, data: Proton.Types.ListRepositorySyncDefinitionsOutput) => void): Request<Proton.Types.ListRepositorySyncDefinitionsOutput, AWSError>;
  /**
   * Get a list service of instance Infrastructure as Code (IaC) outputs.
   */
  listServiceInstanceOutputs(params: Proton.Types.ListServiceInstanceOutputsInput, callback?: (err: AWSError, data: Proton.Types.ListServiceInstanceOutputsOutput) => void): Request<Proton.Types.ListServiceInstanceOutputsOutput, AWSError>;
  /**
   * Get a list service of instance Infrastructure as Code (IaC) outputs.
   */
  listServiceInstanceOutputs(callback?: (err: AWSError, data: Proton.Types.ListServiceInstanceOutputsOutput) => void): Request<Proton.Types.ListServiceInstanceOutputsOutput, AWSError>;
  /**
   * List provisioned resources for a service instance with details.
   */
  listServiceInstanceProvisionedResources(params: Proton.Types.ListServiceInstanceProvisionedResourcesInput, callback?: (err: AWSError, data: Proton.Types.ListServiceInstanceProvisionedResourcesOutput) => void): Request<Proton.Types.ListServiceInstanceProvisionedResourcesOutput, AWSError>;
  /**
   * List provisioned resources for a service instance with details.
   */
  listServiceInstanceProvisionedResources(callback?: (err: AWSError, data: Proton.Types.ListServiceInstanceProvisionedResourcesOutput) => void): Request<Proton.Types.ListServiceInstanceProvisionedResourcesOutput, AWSError>;
  /**
   * List service instances with summary data. This action lists service instances of all services in the Amazon Web Services account.
   */
  listServiceInstances(params: Proton.Types.ListServiceInstancesInput, callback?: (err: AWSError, data: Proton.Types.ListServiceInstancesOutput) => void): Request<Proton.Types.ListServiceInstancesOutput, AWSError>;
  /**
   * List service instances with summary data. This action lists service instances of all services in the Amazon Web Services account.
   */
  listServiceInstances(callback?: (err: AWSError, data: Proton.Types.ListServiceInstancesOutput) => void): Request<Proton.Types.ListServiceInstancesOutput, AWSError>;
  /**
   * Get a list of service pipeline Infrastructure as Code (IaC) outputs.
   */
  listServicePipelineOutputs(params: Proton.Types.ListServicePipelineOutputsInput, callback?: (err: AWSError, data: Proton.Types.ListServicePipelineOutputsOutput) => void): Request<Proton.Types.ListServicePipelineOutputsOutput, AWSError>;
  /**
   * Get a list of service pipeline Infrastructure as Code (IaC) outputs.
   */
  listServicePipelineOutputs(callback?: (err: AWSError, data: Proton.Types.ListServicePipelineOutputsOutput) => void): Request<Proton.Types.ListServicePipelineOutputsOutput, AWSError>;
  /**
   * List provisioned resources for a service and pipeline with details.
   */
  listServicePipelineProvisionedResources(params: Proton.Types.ListServicePipelineProvisionedResourcesInput, callback?: (err: AWSError, data: Proton.Types.ListServicePipelineProvisionedResourcesOutput) => void): Request<Proton.Types.ListServicePipelineProvisionedResourcesOutput, AWSError>;
  /**
   * List provisioned resources for a service and pipeline with details.
   */
  listServicePipelineProvisionedResources(callback?: (err: AWSError, data: Proton.Types.ListServicePipelineProvisionedResourcesOutput) => void): Request<Proton.Types.ListServicePipelineProvisionedResourcesOutput, AWSError>;
  /**
   * List major or minor versions of a service template with detail data.
   */
  listServiceTemplateVersions(params: Proton.Types.ListServiceTemplateVersionsInput, callback?: (err: AWSError, data: Proton.Types.ListServiceTemplateVersionsOutput) => void): Request<Proton.Types.ListServiceTemplateVersionsOutput, AWSError>;
  /**
   * List major or minor versions of a service template with detail data.
   */
  listServiceTemplateVersions(callback?: (err: AWSError, data: Proton.Types.ListServiceTemplateVersionsOutput) => void): Request<Proton.Types.ListServiceTemplateVersionsOutput, AWSError>;
  /**
   * List service templates with detail data.
   */
  listServiceTemplates(params: Proton.Types.ListServiceTemplatesInput, callback?: (err: AWSError, data: Proton.Types.ListServiceTemplatesOutput) => void): Request<Proton.Types.ListServiceTemplatesOutput, AWSError>;
  /**
   * List service templates with detail data.
   */
  listServiceTemplates(callback?: (err: AWSError, data: Proton.Types.ListServiceTemplatesOutput) => void): Request<Proton.Types.ListServiceTemplatesOutput, AWSError>;
  /**
   * List services with summaries of detail data.
   */
  listServices(params: Proton.Types.ListServicesInput, callback?: (err: AWSError, data: Proton.Types.ListServicesOutput) => void): Request<Proton.Types.ListServicesOutput, AWSError>;
  /**
   * List services with summaries of detail data.
   */
  listServices(callback?: (err: AWSError, data: Proton.Types.ListServicesOutput) => void): Request<Proton.Types.ListServicesOutput, AWSError>;
  /**
   * List tags for a resource. For more information, see Proton resources and tagging in the Proton User Guide.
   */
  listTagsForResource(params: Proton.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: Proton.Types.ListTagsForResourceOutput) => void): Request<Proton.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * List tags for a resource. For more information, see Proton resources and tagging in the Proton User Guide.
   */
  listTagsForResource(callback?: (err: AWSError, data: Proton.Types.ListTagsForResourceOutput) => void): Request<Proton.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Notify Proton of status changes to a provisioned resource when you use self-managed provisioning. For more information, see Self-managed provisioning in the Proton User Guide.
   */
  notifyResourceDeploymentStatusChange(params: Proton.Types.NotifyResourceDeploymentStatusChangeInput, callback?: (err: AWSError, data: Proton.Types.NotifyResourceDeploymentStatusChangeOutput) => void): Request<Proton.Types.NotifyResourceDeploymentStatusChangeOutput, AWSError>;
  /**
   * Notify Proton of status changes to a provisioned resource when you use self-managed provisioning. For more information, see Self-managed provisioning in the Proton User Guide.
   */
  notifyResourceDeploymentStatusChange(callback?: (err: AWSError, data: Proton.Types.NotifyResourceDeploymentStatusChangeOutput) => void): Request<Proton.Types.NotifyResourceDeploymentStatusChangeOutput, AWSError>;
  /**
   * In a management account, reject an environment account connection from another environment account. After you reject an environment account connection request, you can't accept or use the rejected environment account connection. You can’t reject an environment account connection that's connected to an environment. For more information, see Environment account connections in the Proton User guide.
   */
  rejectEnvironmentAccountConnection(params: Proton.Types.RejectEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.RejectEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.RejectEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * In a management account, reject an environment account connection from another environment account. After you reject an environment account connection request, you can't accept or use the rejected environment account connection. You can’t reject an environment account connection that's connected to an environment. For more information, see Environment account connections in the Proton User guide.
   */
  rejectEnvironmentAccountConnection(callback?: (err: AWSError, data: Proton.Types.RejectEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.RejectEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Tag a resource. A tag is a key-value pair of metadata that you associate with an Proton resource. For more information, see Proton resources and tagging in the Proton User Guide.
   */
  tagResource(params: Proton.Types.TagResourceInput, callback?: (err: AWSError, data: Proton.Types.TagResourceOutput) => void): Request<Proton.Types.TagResourceOutput, AWSError>;
  /**
   * Tag a resource. A tag is a key-value pair of metadata that you associate with an Proton resource. For more information, see Proton resources and tagging in the Proton User Guide.
   */
  tagResource(callback?: (err: AWSError, data: Proton.Types.TagResourceOutput) => void): Request<Proton.Types.TagResourceOutput, AWSError>;
  /**
   * Remove a customer tag from a resource. A tag is a key-value pair of metadata associated with an Proton resource. For more information, see Proton resources and tagging in the Proton User Guide.
   */
  untagResource(params: Proton.Types.UntagResourceInput, callback?: (err: AWSError, data: Proton.Types.UntagResourceOutput) => void): Request<Proton.Types.UntagResourceOutput, AWSError>;
  /**
   * Remove a customer tag from a resource. A tag is a key-value pair of metadata associated with an Proton resource. For more information, see Proton resources and tagging in the Proton User Guide.
   */
  untagResource(callback?: (err: AWSError, data: Proton.Types.UntagResourceOutput) => void): Request<Proton.Types.UntagResourceOutput, AWSError>;
  /**
   * Update Proton settings that are used for multiple services in the Amazon Web Services account.
   */
  updateAccountSettings(params: Proton.Types.UpdateAccountSettingsInput, callback?: (err: AWSError, data: Proton.Types.UpdateAccountSettingsOutput) => void): Request<Proton.Types.UpdateAccountSettingsOutput, AWSError>;
  /**
   * Update Proton settings that are used for multiple services in the Amazon Web Services account.
   */
  updateAccountSettings(callback?: (err: AWSError, data: Proton.Types.UpdateAccountSettingsOutput) => void): Request<Proton.Types.UpdateAccountSettingsOutput, AWSError>;
  /**
   * Update a component. There are a few modes for updating a component. The deploymentType field defines the mode.  You can't update a component while its deployment status, or the deployment status of a service instance attached to it, is IN_PROGRESS.  For more information about components, see Proton components in the Proton User Guide.
   */
  updateComponent(params: Proton.Types.UpdateComponentInput, callback?: (err: AWSError, data: Proton.Types.UpdateComponentOutput) => void): Request<Proton.Types.UpdateComponentOutput, AWSError>;
  /**
   * Update a component. There are a few modes for updating a component. The deploymentType field defines the mode.  You can't update a component while its deployment status, or the deployment status of a service instance attached to it, is IN_PROGRESS.  For more information about components, see Proton components in the Proton User Guide.
   */
  updateComponent(callback?: (err: AWSError, data: Proton.Types.UpdateComponentOutput) => void): Request<Proton.Types.UpdateComponentOutput, AWSError>;
  /**
   * Update an environment. If the environment is associated with an environment account connection, don't update or include the protonServiceRoleArn and provisioningRepository parameter to update or connect to an environment account connection. You can only update to a new environment account connection if that connection was created in the same environment account that the current environment account connection was created in. The account connection must also be associated with the current environment. If the environment isn't associated with an environment account connection, don't update or include the environmentAccountConnectionId parameter. You can't update or connect the environment to an environment account connection if it isn't already associated with an environment connection. You can update either the environmentAccountConnectionId or protonServiceRoleArn parameter and value. You can’t update both. If the environment was configured for Amazon Web Services-managed provisioning, omit the provisioningRepository parameter. If the environment was configured for self-managed provisioning, specify the provisioningRepository parameter and omit the protonServiceRoleArn and environmentAccountConnectionId parameters. For more information, see Environments and Provisioning methods in the Proton User Guide. There are four modes for updating an environment. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the environment is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can also specify a different major version that's higher than the major version in use and a minor version.  
   */
  updateEnvironment(params: Proton.Types.UpdateEnvironmentInput, callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentOutput) => void): Request<Proton.Types.UpdateEnvironmentOutput, AWSError>;
  /**
   * Update an environment. If the environment is associated with an environment account connection, don't update or include the protonServiceRoleArn and provisioningRepository parameter to update or connect to an environment account connection. You can only update to a new environment account connection if that connection was created in the same environment account that the current environment account connection was created in. The account connection must also be associated with the current environment. If the environment isn't associated with an environment account connection, don't update or include the environmentAccountConnectionId parameter. You can't update or connect the environment to an environment account connection if it isn't already associated with an environment connection. You can update either the environmentAccountConnectionId or protonServiceRoleArn parameter and value. You can’t update both. If the environment was configured for Amazon Web Services-managed provisioning, omit the provisioningRepository parameter. If the environment was configured for self-managed provisioning, specify the provisioningRepository parameter and omit the protonServiceRoleArn and environmentAccountConnectionId parameters. For more information, see Environments and Provisioning methods in the Proton User Guide. There are four modes for updating an environment. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the environment is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can also specify a different major version that's higher than the major version in use and a minor version.  
   */
  updateEnvironment(callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentOutput) => void): Request<Proton.Types.UpdateEnvironmentOutput, AWSError>;
  /**
   * In an environment account, update an environment account connection to use a new IAM role. For more information, see Environment account connections in the Proton User guide.
   */
  updateEnvironmentAccountConnection(params: Proton.Types.UpdateEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.UpdateEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * In an environment account, update an environment account connection to use a new IAM role. For more information, see Environment account connections in the Proton User guide.
   */
  updateEnvironmentAccountConnection(callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.UpdateEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Update an environment template.
   */
  updateEnvironmentTemplate(params: Proton.Types.UpdateEnvironmentTemplateInput, callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentTemplateOutput) => void): Request<Proton.Types.UpdateEnvironmentTemplateOutput, AWSError>;
  /**
   * Update an environment template.
   */
  updateEnvironmentTemplate(callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentTemplateOutput) => void): Request<Proton.Types.UpdateEnvironmentTemplateOutput, AWSError>;
  /**
   * Update a major or minor version of an environment template.
   */
  updateEnvironmentTemplateVersion(params: Proton.Types.UpdateEnvironmentTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.UpdateEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * Update a major or minor version of an environment template.
   */
  updateEnvironmentTemplateVersion(callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.UpdateEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * Edit a service description or use a spec to add and delete service instances.  Existing service instances and the service pipeline can't be edited using this API. They can only be deleted.  Use the description parameter to modify the description. Edit the spec parameter to add or delete instances.  You can't delete a service instance (remove it from the spec) if it has an attached component. For more information about components, see Proton components in the Proton User Guide. 
   */
  updateService(params: Proton.Types.UpdateServiceInput, callback?: (err: AWSError, data: Proton.Types.UpdateServiceOutput) => void): Request<Proton.Types.UpdateServiceOutput, AWSError>;
  /**
   * Edit a service description or use a spec to add and delete service instances.  Existing service instances and the service pipeline can't be edited using this API. They can only be deleted.  Use the description parameter to modify the description. Edit the spec parameter to add or delete instances.  You can't delete a service instance (remove it from the spec) if it has an attached component. For more information about components, see Proton components in the Proton User Guide. 
   */
  updateService(callback?: (err: AWSError, data: Proton.Types.UpdateServiceOutput) => void): Request<Proton.Types.UpdateServiceOutput, AWSError>;
  /**
   * Update a service instance. There are a few modes for updating a service instance. The deploymentType field defines the mode.  You can't update a service instance while its deployment status, or the deployment status of a component attached to it, is IN_PROGRESS. For more information about components, see Proton components in the Proton User Guide. 
   */
  updateServiceInstance(params: Proton.Types.UpdateServiceInstanceInput, callback?: (err: AWSError, data: Proton.Types.UpdateServiceInstanceOutput) => void): Request<Proton.Types.UpdateServiceInstanceOutput, AWSError>;
  /**
   * Update a service instance. There are a few modes for updating a service instance. The deploymentType field defines the mode.  You can't update a service instance while its deployment status, or the deployment status of a component attached to it, is IN_PROGRESS. For more information about components, see Proton components in the Proton User Guide. 
   */
  updateServiceInstance(callback?: (err: AWSError, data: Proton.Types.UpdateServiceInstanceOutput) => void): Request<Proton.Types.UpdateServiceInstanceOutput, AWSError>;
  /**
   * Update the service pipeline. There are four modes for updating a service pipeline. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the service pipeline is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include major or minor version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) major and minor version of the current template by default. You can specify a different major version that's higher than the major version in use and a minor version.  
   */
  updateServicePipeline(params: Proton.Types.UpdateServicePipelineInput, callback?: (err: AWSError, data: Proton.Types.UpdateServicePipelineOutput) => void): Request<Proton.Types.UpdateServicePipelineOutput, AWSError>;
  /**
   * Update the service pipeline. There are four modes for updating a service pipeline. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the service pipeline is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include major or minor version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) major and minor version of the current template by default. You can specify a different major version that's higher than the major version in use and a minor version.  
   */
  updateServicePipeline(callback?: (err: AWSError, data: Proton.Types.UpdateServicePipelineOutput) => void): Request<Proton.Types.UpdateServicePipelineOutput, AWSError>;
  /**
   * Update the service sync blocker by resolving it.
   */
  updateServiceSyncBlocker(params: Proton.Types.UpdateServiceSyncBlockerInput, callback?: (err: AWSError, data: Proton.Types.UpdateServiceSyncBlockerOutput) => void): Request<Proton.Types.UpdateServiceSyncBlockerOutput, AWSError>;
  /**
   * Update the service sync blocker by resolving it.
   */
  updateServiceSyncBlocker(callback?: (err: AWSError, data: Proton.Types.UpdateServiceSyncBlockerOutput) => void): Request<Proton.Types.UpdateServiceSyncBlockerOutput, AWSError>;
  /**
   * Update the Proton Ops config file.
   */
  updateServiceSyncConfig(params: Proton.Types.UpdateServiceSyncConfigInput, callback?: (err: AWSError, data: Proton.Types.UpdateServiceSyncConfigOutput) => void): Request<Proton.Types.UpdateServiceSyncConfigOutput, AWSError>;
  /**
   * Update the Proton Ops config file.
   */
  updateServiceSyncConfig(callback?: (err: AWSError, data: Proton.Types.UpdateServiceSyncConfigOutput) => void): Request<Proton.Types.UpdateServiceSyncConfigOutput, AWSError>;
  /**
   * Update a service template.
   */
  updateServiceTemplate(params: Proton.Types.UpdateServiceTemplateInput, callback?: (err: AWSError, data: Proton.Types.UpdateServiceTemplateOutput) => void): Request<Proton.Types.UpdateServiceTemplateOutput, AWSError>;
  /**
   * Update a service template.
   */
  updateServiceTemplate(callback?: (err: AWSError, data: Proton.Types.UpdateServiceTemplateOutput) => void): Request<Proton.Types.UpdateServiceTemplateOutput, AWSError>;
  /**
   * Update a major or minor version of a service template.
   */
  updateServiceTemplateVersion(params: Proton.Types.UpdateServiceTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.UpdateServiceTemplateVersionOutput) => void): Request<Proton.Types.UpdateServiceTemplateVersionOutput, AWSError>;
  /**
   * Update a major or minor version of a service template.
   */
  updateServiceTemplateVersion(callback?: (err: AWSError, data: Proton.Types.UpdateServiceTemplateVersionOutput) => void): Request<Proton.Types.UpdateServiceTemplateVersionOutput, AWSError>;
  /**
   * Update template sync configuration parameters, except for the templateName and templateType. Repository details (branch, name, and provider) should be of a linked repository. A linked repository is a repository that has been registered with Proton. For more information, see CreateRepository.
   */
  updateTemplateSyncConfig(params: Proton.Types.UpdateTemplateSyncConfigInput, callback?: (err: AWSError, data: Proton.Types.UpdateTemplateSyncConfigOutput) => void): Request<Proton.Types.UpdateTemplateSyncConfigOutput, AWSError>;
  /**
   * Update template sync configuration parameters, except for the templateName and templateType. Repository details (branch, name, and provider) should be of a linked repository. A linked repository is a repository that has been registered with Proton. For more information, see CreateRepository.
   */
  updateTemplateSyncConfig(callback?: (err: AWSError, data: Proton.Types.UpdateTemplateSyncConfigOutput) => void): Request<Proton.Types.UpdateTemplateSyncConfigOutput, AWSError>;
  /**
   * Waits for the componentDeleted state by periodically calling the underlying Proton.getComponentoperation every 5 seconds (at most 999 times). Wait until a Component is deleted. Use this after invoking DeleteComponent
   */
  waitFor(state: "componentDeleted", params: Proton.Types.GetComponentInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Proton.Types.GetComponentOutput) => void): Request<Proton.Types.GetComponentOutput, AWSError>;
  /**
   * Waits for the componentDeleted state by periodically calling the underlying Proton.getComponentoperation every 5 seconds (at most 999 times). Wait until a Component is deleted. Use this after invoking DeleteComponent
   */
  waitFor(state: "componentDeleted", callback?: (err: AWSError, data: Proton.Types.GetComponentOutput) => void): Request<Proton.Types.GetComponentOutput, AWSError>;
  /**
   * Waits for the componentDeployed state by periodically calling the underlying Proton.getComponentoperation every 5 seconds (at most 999 times). Wait until a Component is deployed. Use this after invoking CreateComponent or UpdateComponent
   */
  waitFor(state: "componentDeployed", params: Proton.Types.GetComponentInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Proton.Types.GetComponentOutput) => void): Request<Proton.Types.GetComponentOutput, AWSError>;
  /**
   * Waits for the componentDeployed state by periodically calling the underlying Proton.getComponentoperation every 5 seconds (at most 999 times). Wait until a Component is deployed. Use this after invoking CreateComponent or UpdateComponent
   */
  waitFor(state: "componentDeployed", callback?: (err: AWSError, data: Proton.Types.GetComponentOutput) => void): Request<Proton.Types.GetComponentOutput, AWSError>;
  /**
   * Waits for the environmentDeployed state by periodically calling the underlying Proton.getEnvironmentoperation every 5 seconds (at most 999 times). Wait until an Environment is deployed. Use this after invoking CreateEnvironment or UpdateEnvironment
   */
  waitFor(state: "environmentDeployed", params: Proton.Types.GetEnvironmentInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Proton.Types.GetEnvironmentOutput) => void): Request<Proton.Types.GetEnvironmentOutput, AWSError>;
  /**
   * Waits for the environmentDeployed state by periodically calling the underlying Proton.getEnvironmentoperation every 5 seconds (at most 999 times). Wait until an Environment is deployed. Use this after invoking CreateEnvironment or UpdateEnvironment
   */
  waitFor(state: "environmentDeployed", callback?: (err: AWSError, data: Proton.Types.GetEnvironmentOutput) => void): Request<Proton.Types.GetEnvironmentOutput, AWSError>;
  /**
   * Waits for the environmentTemplateVersionRegistered state by periodically calling the underlying Proton.getEnvironmentTemplateVersionoperation every 2 seconds (at most 150 times). Wait until an EnvironmentTemplateVersion is registered. Use this after invoking CreateEnvironmentTemplateVersion
   */
  waitFor(state: "environmentTemplateVersionRegistered", params: Proton.Types.GetEnvironmentTemplateVersionInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Proton.Types.GetEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.GetEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * Waits for the environmentTemplateVersionRegistered state by periodically calling the underlying Proton.getEnvironmentTemplateVersionoperation every 2 seconds (at most 150 times). Wait until an EnvironmentTemplateVersion is registered. Use this after invoking CreateEnvironmentTemplateVersion
   */
  waitFor(state: "environmentTemplateVersionRegistered", callback?: (err: AWSError, data: Proton.Types.GetEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.GetEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * Waits for the serviceCreated state by periodically calling the underlying Proton.getServiceoperation every 5 seconds (at most 999 times). Wait until an Service has deployed its instances and possibly pipeline. Use this after invoking CreateService
   */
  waitFor(state: "serviceCreated", params: Proton.Types.GetServiceInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Waits for the serviceCreated state by periodically calling the underlying Proton.getServiceoperation every 5 seconds (at most 999 times). Wait until an Service has deployed its instances and possibly pipeline. Use this after invoking CreateService
   */
  waitFor(state: "serviceCreated", callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Waits for the serviceDeleted state by periodically calling the underlying Proton.getServiceoperation every 5 seconds (at most 999 times). Wait until a Service, its instances, and possibly pipeline have been deleted after DeleteService is invoked
   */
  waitFor(state: "serviceDeleted", params: Proton.Types.GetServiceInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Waits for the serviceDeleted state by periodically calling the underlying Proton.getServiceoperation every 5 seconds (at most 999 times). Wait until a Service, its instances, and possibly pipeline have been deleted after DeleteService is invoked
   */
  waitFor(state: "serviceDeleted", callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Waits for the serviceInstanceDeployed state by periodically calling the underlying Proton.getServiceInstanceoperation every 5 seconds (at most 999 times). Wait until a ServiceInstance is deployed. Use this after invoking CreateService or UpdateServiceInstance
   */
  waitFor(state: "serviceInstanceDeployed", params: Proton.Types.GetServiceInstanceInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Proton.Types.GetServiceInstanceOutput) => void): Request<Proton.Types.GetServiceInstanceOutput, AWSError>;
  /**
   * Waits for the serviceInstanceDeployed state by periodically calling the underlying Proton.getServiceInstanceoperation every 5 seconds (at most 999 times). Wait until a ServiceInstance is deployed. Use this after invoking CreateService or UpdateServiceInstance
   */
  waitFor(state: "serviceInstanceDeployed", callback?: (err: AWSError, data: Proton.Types.GetServiceInstanceOutput) => void): Request<Proton.Types.GetServiceInstanceOutput, AWSError>;
  /**
   * Waits for the servicePipelineDeployed state by periodically calling the underlying Proton.getServiceoperation every 10 seconds (at most 360 times). Wait until an ServicePipeline is deployed. Use this after invoking CreateService or UpdateServicePipeline
   */
  waitFor(state: "servicePipelineDeployed", params: Proton.Types.GetServiceInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Waits for the servicePipelineDeployed state by periodically calling the underlying Proton.getServiceoperation every 10 seconds (at most 360 times). Wait until an ServicePipeline is deployed. Use this after invoking CreateService or UpdateServicePipeline
   */
  waitFor(state: "servicePipelineDeployed", callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Waits for the serviceTemplateVersionRegistered state by periodically calling the underlying Proton.getServiceTemplateVersionoperation every 2 seconds (at most 150 times). Wait until a ServiceTemplateVersion is registered. Use this after invoking CreateServiceTemplateVersion
   */
  waitFor(state: "serviceTemplateVersionRegistered", params: Proton.Types.GetServiceTemplateVersionInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Proton.Types.GetServiceTemplateVersionOutput) => void): Request<Proton.Types.GetServiceTemplateVersionOutput, AWSError>;
  /**
   * Waits for the serviceTemplateVersionRegistered state by periodically calling the underlying Proton.getServiceTemplateVersionoperation every 2 seconds (at most 150 times). Wait until a ServiceTemplateVersion is registered. Use this after invoking CreateServiceTemplateVersion
   */
  waitFor(state: "serviceTemplateVersionRegistered", callback?: (err: AWSError, data: Proton.Types.GetServiceTemplateVersionOutput) => void): Request<Proton.Types.GetServiceTemplateVersionOutput, AWSError>;
  /**
   * Waits for the serviceUpdated state by periodically calling the underlying Proton.getServiceoperation every 5 seconds (at most 999 times). Wait until a Service, its instances, and possibly pipeline have been deployed after UpdateService is invoked
   */
  waitFor(state: "serviceUpdated", params: Proton.Types.GetServiceInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Waits for the serviceUpdated state by periodically calling the underlying Proton.getServiceoperation every 5 seconds (at most 999 times). Wait until a Service, its instances, and possibly pipeline have been deployed after UpdateService is invoked
   */
  waitFor(state: "serviceUpdated", callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
}
declare namespace Proton {
  export interface AcceptEnvironmentAccountConnectionInput {
    /**
     * The ID of the environment account connection.
     */
    id: EnvironmentAccountConnectionId;
  }
  export interface AcceptEnvironmentAccountConnectionOutput {
    /**
     * The environment account connection data that's returned by Proton.
     */
    environmentAccountConnection: EnvironmentAccountConnection;
  }
  export interface AccountSettings {
    /**
     * The Amazon Resource Name (ARN) of the service role that Proton uses for provisioning pipelines. Proton assumes this role for CodeBuild-based provisioning.
     */
    pipelineCodebuildRoleArn?: RoleArnOrEmptyString;
    /**
     * The linked repository for pipeline provisioning. Required if you have environments configured for self-managed provisioning with services that include pipelines. A linked repository is a repository that has been registered with Proton. For more information, see CreateRepository.
     */
    pipelineProvisioningRepository?: RepositoryBranch;
    /**
     * The Amazon Resource Name (ARN) of the service role you want to use for provisioning pipelines. Assumed by Proton for Amazon Web Services-managed provisioning, and by customer-owned automation for self-managed provisioning.
     */
    pipelineServiceRoleArn?: RoleArnOrEmptyString;
  }
  export type Arn = string;
  export type AwsAccountId = string;
  export type BlockerStatus = "ACTIVE"|"RESOLVED"|string;
  export type BlockerType = "AUTOMATED"|string;
  export type Boolean = boolean;
  export interface CancelComponentDeploymentInput {
    /**
     * The name of the component with the deployment to cancel.
     */
    componentName: ResourceName;
  }
  export interface CancelComponentDeploymentOutput {
    /**
     * The detailed data of the component with the deployment that is being canceled.
     */
    component: Component;
  }
  export interface CancelEnvironmentDeploymentInput {
    /**
     * The name of the environment with the deployment to cancel.
     */
    environmentName: ResourceName;
  }
  export interface CancelEnvironmentDeploymentOutput {
    /**
     * The environment summary data that's returned by Proton.
     */
    environment: Environment;
  }
  export interface CancelServiceInstanceDeploymentInput {
    /**
     * The name of the service instance with the deployment to cancel.
     */
    serviceInstanceName: ResourceName;
    /**
     * The name of the service with the service instance deployment to cancel.
     */
    serviceName: ResourceName;
  }
  export interface CancelServiceInstanceDeploymentOutput {
    /**
     * The service instance summary data that's returned by Proton.
     */
    serviceInstance: ServiceInstance;
  }
  export interface CancelServicePipelineDeploymentInput {
    /**
     * The name of the service with the service pipeline deployment to cancel.
     */
    serviceName: ResourceName;
  }
  export interface CancelServicePipelineDeploymentOutput {
    /**
     * The service pipeline detail data that's returned by Proton.
     */
    pipeline: ServicePipeline;
  }
  export type ClientToken = string;
  export interface CompatibleEnvironmentTemplate {
    /**
     * The major version of the compatible environment template.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The compatible environment template name.
     */
    templateName: ResourceName;
  }
  export interface CompatibleEnvironmentTemplateInput {
    /**
     * The major version of the compatible environment template.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The compatible environment template name.
     */
    templateName: ResourceName;
  }
  export type CompatibleEnvironmentTemplateInputList = CompatibleEnvironmentTemplateInput[];
  export type CompatibleEnvironmentTemplateList = CompatibleEnvironmentTemplate[];
  export interface Component {
    /**
     * The Amazon Resource Name (ARN) of the component.
     */
    arn: ComponentArn;
    /**
     * The time when the component was created.
     */
    createdAt: Timestamp;
    /**
     * The component deployment status.
     */
    deploymentStatus: DeploymentStatus;
    /**
     * The message associated with the component deployment status.
     */
    deploymentStatusMessage?: StatusMessage;
    /**
     * A description of the component.
     */
    description?: Description;
    /**
     * The name of the Proton environment that this component is associated with.
     */
    environmentName: ResourceName;
    /**
     * The ID of the last attempted deployment of this component.
     */
    lastAttemptedDeploymentId?: DeploymentId;
    /**
     * The last token the client requested.
     */
    lastClientRequestToken?: String;
    /**
     * The time when a deployment of the component was last attempted.
     */
    lastDeploymentAttemptedAt?: Timestamp;
    /**
     * The time when the component was last deployed successfully.
     */
    lastDeploymentSucceededAt?: Timestamp;
    /**
     * The time when the component was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The ID of the last successful deployment of this component.
     */
    lastSucceededDeploymentId?: DeploymentId;
    /**
     * The name of the component.
     */
    name: ResourceName;
    /**
     * The name of the service instance that this component is attached to. Provided when a component is attached to a service instance.
     */
    serviceInstanceName?: ResourceName;
    /**
     * The name of the service that serviceInstanceName is associated with. Provided when a component is attached to a service instance.
     */
    serviceName?: ResourceName;
    /**
     * The service spec that the component uses to access service inputs. Provided when a component is attached to a service instance.
     */
    serviceSpec?: SpecContents;
  }
  export type ComponentArn = string;
  export type ComponentDeploymentIdList = DeploymentId[];
  export type ComponentDeploymentUpdateType = "NONE"|"CURRENT_VERSION"|string;
  export interface ComponentState {
    /**
     * The name of the service instance that this component is attached to. Provided when a component is attached to a service instance.
     */
    serviceInstanceName?: ResourceNameOrEmpty;
    /**
     * The name of the service that serviceInstanceName is associated with. Provided when a component is attached to a service instance.
     */
    serviceName?: ResourceNameOrEmpty;
    /**
     * The service spec that the component uses to access service inputs. Provided when a component is attached to a service instance.
     */
    serviceSpec?: SpecContents;
    /**
     * The template file used.
     */
    templateFile?: TemplateFileContents;
  }
  export interface ComponentSummary {
    /**
     * The Amazon Resource Name (ARN) of the component.
     */
    arn: ComponentArn;
    /**
     * The time when the component was created.
     */
    createdAt: Timestamp;
    /**
     * The component deployment status.
     */
    deploymentStatus: DeploymentStatus;
    /**
     * The message associated with the component deployment status.
     */
    deploymentStatusMessage?: StatusMessage;
    /**
     * The name of the Proton environment that this component is associated with.
     */
    environmentName: ResourceName;
    /**
     * The ID of the last attempted deployment of this component.
     */
    lastAttemptedDeploymentId?: DeploymentId;
    /**
     * The time when a deployment of the component was last attempted.
     */
    lastDeploymentAttemptedAt?: Timestamp;
    /**
     * The time when the component was last deployed successfully.
     */
    lastDeploymentSucceededAt?: Timestamp;
    /**
     * The time when the component was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The ID of the last successful deployment of this component.
     */
    lastSucceededDeploymentId?: DeploymentId;
    /**
     * The name of the component.
     */
    name: ResourceName;
    /**
     * The name of the service instance that this component is attached to. Provided when a component is attached to a service instance.
     */
    serviceInstanceName?: ResourceName;
    /**
     * The name of the service that serviceInstanceName is associated with. Provided when a component is attached to a service instance.
     */
    serviceName?: ResourceName;
  }
  export type ComponentSummaryList = ComponentSummary[];
  export interface CountsSummary {
    /**
     * The total number of components in the Amazon Web Services account. The semantics of the components field are different from the semantics of results for other infrastructure-provisioning resources. That's because at this time components don't have associated templates, therefore they don't have the concept of staleness. The components object will only contain total and failed members.
     */
    components?: ResourceCountsSummary;
    /**
     * The total number of environment templates in the Amazon Web Services account. The environmentTemplates object will only contain total members.
     */
    environmentTemplates?: ResourceCountsSummary;
    /**
     * The staleness counts for Proton environments in the Amazon Web Services account. The environments object will only contain total members.
     */
    environments?: ResourceCountsSummary;
    /**
     * The staleness counts for Proton pipelines in the Amazon Web Services account.
     */
    pipelines?: ResourceCountsSummary;
    /**
     * The staleness counts for Proton service instances in the Amazon Web Services account.
     */
    serviceInstances?: ResourceCountsSummary;
    /**
     * The total number of service templates in the Amazon Web Services account. The serviceTemplates object will only contain total members.
     */
    serviceTemplates?: ResourceCountsSummary;
    /**
     * The staleness counts for Proton services in the Amazon Web Services account.
     */
    services?: ResourceCountsSummary;
  }
  export interface CreateComponentInput {
    /**
     * The client token for the created component.
     */
    clientToken?: ClientToken;
    /**
     * An optional customer-provided description of the component.
     */
    description?: Description;
    /**
     * The name of the Proton environment that you want to associate this component with. You must specify this when you don't specify serviceInstanceName and serviceName.
     */
    environmentName?: ResourceName;
    /**
     * A path to a manifest file that lists the Infrastructure as Code (IaC) file, template language, and rendering engine for infrastructure that a custom component provisions.
     */
    manifest: TemplateManifestContents;
    /**
     * The customer-provided name of the component.
     */
    name: ResourceName;
    /**
     * The name of the service instance that you want to attach this component to. If you don't specify this, the component isn't attached to any service instance. Specify both serviceInstanceName and serviceName or neither of them.
     */
    serviceInstanceName?: ResourceName;
    /**
     * The name of the service that serviceInstanceName is associated with. If you don't specify this, the component isn't attached to any service instance. Specify both serviceInstanceName and serviceName or neither of them.
     */
    serviceName?: ResourceName;
    /**
     * The service spec that you want the component to use to access service inputs. Set this only when you attach the component to a service instance.
     */
    serviceSpec?: SpecContents;
    /**
     * An optional list of metadata items that you can associate with the Proton component. A tag is a key-value pair. For more information, see Proton resources and tagging in the Proton User Guide.
     */
    tags?: TagList;
    /**
     * A path to the Infrastructure as Code (IaC) file describing infrastructure that a custom component provisions.  Components support a single IaC file, even if you use Terraform as your template language. 
     */
    templateFile: TemplateFileContents;
  }
  export interface CreateComponentOutput {
    /**
     * The detailed data of the created component.
     */
    component: Component;
  }
  export interface CreateEnvironmentAccountConnectionInput {
    /**
     * When included, if two identical requests are made with the same client token, Proton returns the environment account connection that the first request created.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of an IAM service role in the environment account. Proton uses this role to provision infrastructure resources using CodeBuild-based provisioning in the associated environment account.
     */
    codebuildRoleArn?: RoleArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that Proton uses when provisioning directly defined components in the associated environment account. It determines the scope of infrastructure that a component can provision in the account. You must specify componentRoleArn to allow directly defined components to be associated with any environments running in this account. For more information about components, see Proton components in the Proton User Guide.
     */
    componentRoleArn?: RoleArn;
    /**
     * The name of the Proton environment that's created in the associated management account.
     */
    environmentName: ResourceName;
    /**
     * The ID of the management account that accepts or rejects the environment account connection. You create and manage the Proton environment in this account. If the management account accepts the environment account connection, Proton can use the associated IAM role to provision environment infrastructure resources in the associated environment account.
     */
    managementAccountId: AwsAccountId;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that's created in the environment account. Proton uses this role to provision infrastructure resources in the associated environment account.
     */
    roleArn?: RoleArn;
    /**
     * An optional list of metadata items that you can associate with the Proton environment account connection. A tag is a key-value pair. For more information, see Proton resources and tagging in the Proton User Guide.
     */
    tags?: TagList;
  }
  export interface CreateEnvironmentAccountConnectionOutput {
    /**
     * The environment account connection detail data that's returned by Proton.
     */
    environmentAccountConnection: EnvironmentAccountConnection;
  }
  export interface CreateEnvironmentInput {
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that allows Proton to provision infrastructure using CodeBuild-based provisioning on your behalf. To use CodeBuild-based provisioning for the environment or for any service instance running in the environment, specify either the environmentAccountConnectionId or codebuildRoleArn parameter.
     */
    codebuildRoleArn?: RoleArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that Proton uses when provisioning directly defined components in this environment. It determines the scope of infrastructure that a component can provision. You must specify componentRoleArn to allow directly defined components to be associated with this environment. For more information about components, see Proton components in the Proton User Guide.
     */
    componentRoleArn?: RoleArn;
    /**
     * A description of the environment that's being created and deployed.
     */
    description?: Description;
    /**
     * The ID of the environment account connection that you provide if you're provisioning your environment infrastructure resources to an environment account. For more information, see Environment account connections in the Proton User guide. To use Amazon Web Services-managed provisioning for the environment, specify either the environmentAccountConnectionId or protonServiceRoleArn parameter and omit the provisioningRepository parameter.
     */
    environmentAccountConnectionId?: EnvironmentAccountConnectionId;
    /**
     * The name of the environment.
     */
    name: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the Proton service role that allows Proton to make calls to other services on your behalf. To use Amazon Web Services-managed provisioning for the environment, specify either the environmentAccountConnectionId or protonServiceRoleArn parameter and omit the provisioningRepository parameter.
     */
    protonServiceRoleArn?: Arn;
    /**
     * The linked repository that you use to host your rendered infrastructure templates for self-managed provisioning. A linked repository is a repository that has been registered with Proton. For more information, see CreateRepository. To use self-managed provisioning for the environment, specify this parameter and omit the environmentAccountConnectionId and protonServiceRoleArn parameters.
     */
    provisioningRepository?: RepositoryBranchInput;
    /**
     * A YAML formatted string that provides inputs as defined in the environment template bundle schema file. For more information, see Environments in the Proton User Guide.
     */
    spec: SpecContents;
    /**
     * An optional list of metadata items that you can associate with the Proton environment. A tag is a key-value pair. For more information, see Proton resources and tagging in the Proton User Guide.
     */
    tags?: TagList;
    /**
     * The major version of the environment template.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The minor version of the environment template.
     */
    templateMinorVersion?: TemplateVersionPart;
    /**
     * The name of the environment template. For more information, see Environment Templates in the Proton User Guide.
     */
    templateName: ResourceName;
  }
  export interface CreateEnvironmentOutput {
    /**
     * The environment detail data that's returned by Proton.
     */
    environment: Environment;
  }
  export interface CreateEnvironmentTemplateInput {
    /**
     * A description of the environment template.
     */
    description?: Description;
    /**
     * The environment template name as displayed in the developer interface.
     */
    displayName?: DisplayName;
    /**
     * A customer provided encryption key that Proton uses to encrypt data.
     */
    encryptionKey?: Arn;
    /**
     * The name of the environment template.
     */
    name: ResourceName;
    /**
     * When included, indicates that the environment template is for customer provisioned and managed infrastructure.
     */
    provisioning?: Provisioning;
    /**
     * An optional list of metadata items that you can associate with the Proton environment template. A tag is a key-value pair. For more information, see Proton resources and tagging in the Proton User Guide.
     */
    tags?: TagList;
  }
  export interface CreateEnvironmentTemplateOutput {
    /**
     * The environment template detail data that's returned by Proton.
     */
    environmentTemplate: EnvironmentTemplate;
  }
  export interface CreateEnvironmentTemplateVersionInput {
    /**
     * When included, if two identical requests are made with the same client token, Proton returns the environment template version that the first request created.
     */
    clientToken?: ClientToken;
    /**
     * A description of the new version of an environment template.
     */
    description?: Description;
    /**
     * To create a new minor version of the environment template, include major Version. To create a new major and minor version of the environment template, exclude major Version.
     */
    majorVersion?: TemplateVersionPart;
    /**
     * An object that includes the template bundle S3 bucket path and name for the new version of an template.
     */
    source: TemplateVersionSourceInput;
    /**
     * An optional list of metadata items that you can associate with the Proton environment template version. A tag is a key-value pair. For more information, see Proton resources and tagging in the Proton User Guide.
     */
    tags?: TagList;
    /**
     * The name of the environment template.
     */
    templateName: ResourceName;
  }
  export interface CreateEnvironmentTemplateVersionOutput {
    /**
     * The environment template detail data that's returned by Proton.
     */
    environmentTemplateVersion: EnvironmentTemplateVersion;
  }
  export interface CreateRepositoryInput {
    /**
     * The Amazon Resource Name (ARN) of your AWS CodeStar connection that connects Proton to your repository provider account. For more information, see Setting up for Proton in the Proton User Guide.
     */
    connectionArn: Arn;
    /**
     * The ARN of your customer Amazon Web Services Key Management Service (Amazon Web Services KMS) key.
     */
    encryptionKey?: Arn;
    /**
     * The repository name (for example, myrepos/myrepo).
     */
    name: RepositoryName;
    /**
     * The repository provider.
     */
    provider: RepositoryProvider;
    /**
     * An optional list of metadata items that you can associate with the Proton repository. A tag is a key-value pair. For more information, see Proton resources and tagging in the Proton User Guide.
     */
    tags?: TagList;
  }
  export interface CreateRepositoryOutput {
    /**
     * The repository link's detail data that's returned by Proton.
     */
    repository: Repository;
  }
  export interface CreateServiceInput {
    /**
     * The name of the code repository branch that holds the code that's deployed in Proton. Don't include this parameter if your service template doesn't include a service pipeline.
     */
    branchName?: GitBranchName;
    /**
     * A description of the Proton service.
     */
    description?: Description;
    /**
     * The service name.
     */
    name: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the repository connection. For more information, see Setting up an AWS CodeStar connection in the Proton User Guide. Don't include this parameter if your service template doesn't include a service pipeline.
     */
    repositoryConnectionArn?: Arn;
    /**
     * The ID of the code repository. Don't include this parameter if your service template doesn't include a service pipeline.
     */
    repositoryId?: RepositoryId;
    /**
     * A link to a spec file that provides inputs as defined in the service template bundle schema file. The spec file is in YAML format. Don’t include pipeline inputs in the spec if your service template doesn’t include a service pipeline. For more information, see Create a service in the Proton User Guide.
     */
    spec: SpecContents;
    /**
     * An optional list of metadata items that you can associate with the Proton service. A tag is a key-value pair. For more information, see Proton resources and tagging in the Proton User Guide.
     */
    tags?: TagList;
    /**
     * The major version of the service template that was used to create the service.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The minor version of the service template that was used to create the service.
     */
    templateMinorVersion?: TemplateVersionPart;
    /**
     * The name of the service template that's used to create the service.
     */
    templateName: ResourceName;
  }
  export interface CreateServiceInstanceInput {
    /**
     * The client token of the service instance to create.
     */
    clientToken?: ClientToken;
    /**
     * The name of the service instance to create.
     */
    name: ResourceName;
    /**
     * The name of the service the service instance is added to.
     */
    serviceName: ResourceName;
    /**
     * The spec for the service instance you want to create.
     */
    spec: SpecContents;
    /**
     * An optional list of metadata items that you can associate with the Proton service instance. A tag is a key-value pair. For more information, see Proton resources and tagging in the Proton User Guide.
     */
    tags?: TagList;
    /**
     * To create a new major and minor version of the service template, exclude major Version.
     */
    templateMajorVersion?: TemplateVersionPart;
    /**
     * To create a new minor version of the service template, include a major Version.
     */
    templateMinorVersion?: TemplateVersionPart;
  }
  export interface CreateServiceInstanceOutput {
    /**
     * The detailed data of the service instance being created.
     */
    serviceInstance: ServiceInstance;
  }
  export interface CreateServiceOutput {
    /**
     * The service detail data that's returned by Proton.
     */
    service: Service;
  }
  export interface CreateServiceSyncConfigInput {
    /**
     * The repository branch for your Proton Ops file.
     */
    branch: GitBranchName;
    /**
     * The path to the Proton Ops file.
     */
    filePath: OpsFilePath;
    /**
     * The repository name.
     */
    repositoryName: RepositoryName;
    /**
     * The provider type for your repository.
     */
    repositoryProvider: RepositoryProvider;
    /**
     * The name of the service the Proton Ops file is for.
     */
    serviceName: ResourceName;
  }
  export interface CreateServiceSyncConfigOutput {
    /**
     * The detailed data of the Proton Ops file.
     */
    serviceSyncConfig?: ServiceSyncConfig;
  }
  export interface CreateServiceTemplateInput {
    /**
     * A description of the service template.
     */
    description?: Description;
    /**
     * The name of the service template as displayed in the developer interface.
     */
    displayName?: DisplayName;
    /**
     * A customer provided encryption key that's used to encrypt data.
     */
    encryptionKey?: Arn;
    /**
     * The name of the service template.
     */
    name: ResourceName;
    /**
     * By default, Proton provides a service pipeline for your service. When this parameter is included, it indicates that an Proton service pipeline isn't provided for your service. After it's included, it can't be changed. For more information, see Template bundles in the Proton User Guide.
     */
    pipelineProvisioning?: Provisioning;
    /**
     * An optional list of metadata items that you can associate with the Proton service template. A tag is a key-value pair. For more information, see Proton resources and tagging in the Proton User Guide.
     */
    tags?: TagList;
  }
  export interface CreateServiceTemplateOutput {
    /**
     * The service template detail data that's returned by Proton.
     */
    serviceTemplate: ServiceTemplate;
  }
  export interface CreateServiceTemplateVersionInput {
    /**
     * When included, if two identical requests are made with the same client token, Proton returns the service template version that the first request created.
     */
    clientToken?: ClientToken;
    /**
     * An array of environment template objects that are compatible with the new service template version. A service instance based on this service template version can run in environments based on compatible templates.
     */
    compatibleEnvironmentTemplates: CompatibleEnvironmentTemplateInputList;
    /**
     * A description of the new version of a service template.
     */
    description?: Description;
    /**
     * To create a new minor version of the service template, include a major Version. To create a new major and minor version of the service template, exclude major Version.
     */
    majorVersion?: TemplateVersionPart;
    /**
     * An object that includes the template bundle S3 bucket path and name for the new version of a service template.
     */
    source: TemplateVersionSourceInput;
    /**
     * An array of supported component sources. Components with supported sources can be attached to service instances based on this service template version. For more information about components, see Proton components in the Proton User Guide.
     */
    supportedComponentSources?: ServiceTemplateSupportedComponentSourceInputList;
    /**
     * An optional list of metadata items that you can associate with the Proton service template version. A tag is a key-value pair. For more information, see Proton resources and tagging in the Proton User Guide.
     */
    tags?: TagList;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export interface CreateServiceTemplateVersionOutput {
    /**
     * The service template version summary of detail data that's returned by Proton.
     */
    serviceTemplateVersion: ServiceTemplateVersion;
  }
  export interface CreateTemplateSyncConfigInput {
    /**
     * The repository branch for your template.
     */
    branch: GitBranchName;
    /**
     * The repository name (for example, myrepos/myrepo).
     */
    repositoryName: RepositoryName;
    /**
     * The provider type for your repository.
     */
    repositoryProvider: RepositoryProvider;
    /**
     * A repository subdirectory path to your template bundle directory. When included, Proton limits the template bundle search to this repository directory.
     */
    subdirectory?: Subdirectory;
    /**
     * The name of your registered template.
     */
    templateName: ResourceName;
    /**
     * The type of the registered template.
     */
    templateType: TemplateType;
  }
  export interface CreateTemplateSyncConfigOutput {
    /**
     * The template sync configuration detail data that's returned by Proton.
     */
    templateSyncConfig?: TemplateSyncConfig;
  }
  export interface DeleteComponentInput {
    /**
     * The name of the component to delete.
     */
    name: ResourceName;
  }
  export interface DeleteComponentOutput {
    /**
     * The detailed data of the component being deleted.
     */
    component?: Component;
  }
  export interface DeleteDeploymentInput {
    /**
     * The ID of the deployment to delete.
     */
    id: DeploymentId;
  }
  export interface DeleteDeploymentOutput {
    /**
     * The detailed data of the deployment being deleted.
     */
    deployment?: Deployment;
  }
  export interface DeleteEnvironmentAccountConnectionInput {
    /**
     * The ID of the environment account connection to delete.
     */
    id: EnvironmentAccountConnectionId;
  }
  export interface DeleteEnvironmentAccountConnectionOutput {
    /**
     * The detailed data of the environment account connection being deleted.
     */
    environmentAccountConnection?: EnvironmentAccountConnection;
  }
  export interface DeleteEnvironmentInput {
    /**
     * The name of the environment to delete.
     */
    name: ResourceName;
  }
  export interface DeleteEnvironmentOutput {
    /**
     * The detailed data of the environment being deleted.
     */
    environment?: Environment;
  }
  export interface DeleteEnvironmentTemplateInput {
    /**
     * The name of the environment template to delete.
     */
    name: ResourceName;
  }
  export interface DeleteEnvironmentTemplateOutput {
    /**
     * The detailed data of the environment template being deleted.
     */
    environmentTemplate?: EnvironmentTemplate;
  }
  export interface DeleteEnvironmentTemplateVersionInput {
    /**
     * The environment template major version to delete.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The environment template minor version to delete.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The name of the environment template.
     */
    templateName: ResourceName;
  }
  export interface DeleteEnvironmentTemplateVersionOutput {
    /**
     * The detailed data of the environment template version being deleted.
     */
    environmentTemplateVersion?: EnvironmentTemplateVersion;
  }
  export interface DeleteRepositoryInput {
    /**
     * The repository name.
     */
    name: RepositoryName;
    /**
     * The repository provider.
     */
    provider: RepositoryProvider;
  }
  export interface DeleteRepositoryOutput {
    /**
     * The deleted repository link's detail data that's returned by Proton.
     */
    repository?: Repository;
  }
  export interface DeleteServiceInput {
    /**
     * The name of the service to delete.
     */
    name: ResourceName;
  }
  export interface DeleteServiceOutput {
    /**
     * The detailed data of the service being deleted.
     */
    service?: Service;
  }
  export interface DeleteServiceSyncConfigInput {
    /**
     * The name of the service that you want to delete the service sync configuration for.
     */
    serviceName: ResourceName;
  }
  export interface DeleteServiceSyncConfigOutput {
    /**
     * The detailed data for the service sync config.
     */
    serviceSyncConfig?: ServiceSyncConfig;
  }
  export interface DeleteServiceTemplateInput {
    /**
     * The name of the service template to delete.
     */
    name: ResourceName;
  }
  export interface DeleteServiceTemplateOutput {
    /**
     * The detailed data of the service template being deleted.
     */
    serviceTemplate?: ServiceTemplate;
  }
  export interface DeleteServiceTemplateVersionInput {
    /**
     * The service template major version to delete.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The service template minor version to delete.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export interface DeleteServiceTemplateVersionOutput {
    /**
     * The detailed data of the service template version being deleted.
     */
    serviceTemplateVersion?: ServiceTemplateVersion;
  }
  export interface DeleteTemplateSyncConfigInput {
    /**
     * The template name.
     */
    templateName: ResourceName;
    /**
     * The template type.
     */
    templateType: TemplateType;
  }
  export interface DeleteTemplateSyncConfigOutput {
    /**
     * The template sync configuration detail data that's returned by Proton.
     */
    templateSyncConfig?: TemplateSyncConfig;
  }
  export interface Deployment {
    /**
     * The Amazon Resource Name (ARN) of the deployment.
     */
    arn: DeploymentArn;
    /**
     * The date and time the deployment was completed.
     */
    completedAt?: Timestamp;
    /**
     * The name of the component associated with this deployment.
     */
    componentName?: ResourceName;
    /**
     * The date and time the deployment was created.
     */
    createdAt: Timestamp;
    /**
     * The status of the deployment.
     */
    deploymentStatus: DeploymentStatus;
    /**
     * The deployment status message.
     */
    deploymentStatusMessage?: StatusMessage;
    /**
     * The name of the environment associated with this deployment.
     */
    environmentName: ResourceName;
    /**
     * The ID of the deployment.
     */
    id: DeploymentId;
    /**
     * The initial state of the target resource at the time of the deployment.
     */
    initialState?: DeploymentState;
    /**
     * The ID of the last attempted deployment.
     */
    lastAttemptedDeploymentId?: DeploymentId;
    /**
     * The date and time the deployment was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The ID of the last successful deployment.
     */
    lastSucceededDeploymentId?: DeploymentId;
    /**
     * The name of the deployment's service instance.
     */
    serviceInstanceName?: ResourceName;
    /**
     * The name of the service in this deployment.
     */
    serviceName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the target of the deployment.
     */
    targetArn: Arn;
    /**
     * The date and time the depoyment target was created.
     */
    targetResourceCreatedAt: Timestamp;
    /**
     * The resource type of the deployment target. It can be an environment, service, service instance, or component.
     */
    targetResourceType: DeploymentTargetResourceType;
    /**
     * The target state of the target resource at the time of the deployment.
     */
    targetState?: DeploymentState;
  }
  export type DeploymentArn = string;
  export type DeploymentId = string;
  export interface DeploymentState {
    /**
     * The state of the component associated with the deployment.
     */
    component?: ComponentState;
    /**
     * The state of the environment associated with the deployment.
     */
    environment?: EnvironmentState;
    /**
     * The state of the service instance associated with the deployment.
     */
    serviceInstance?: ServiceInstanceState;
    /**
     * The state of the service pipeline associated with the deployment.
     */
    servicePipeline?: ServicePipelineState;
  }
  export type DeploymentStatus = "IN_PROGRESS"|"FAILED"|"SUCCEEDED"|"DELETE_IN_PROGRESS"|"DELETE_FAILED"|"DELETE_COMPLETE"|"CANCELLING"|"CANCELLED"|string;
  export interface DeploymentSummary {
    /**
     * The Amazon Resource Name (ARN) of the deployment.
     */
    arn: DeploymentArn;
    /**
     * The date and time the deployment was completed.
     */
    completedAt?: Timestamp;
    /**
     * The name of the component associated with the deployment.
     */
    componentName?: ResourceName;
    /**
     * The date and time the deployment was created.
     */
    createdAt: Timestamp;
    /**
     * The current status of the deployment.
     */
    deploymentStatus: DeploymentStatus;
    /**
     * The name of the environment associated with the deployment.
     */
    environmentName: ResourceName;
    /**
     * The ID of the deployment.
     */
    id: DeploymentId;
    /**
     * The ID of the last attempted deployment.
     */
    lastAttemptedDeploymentId?: DeploymentId;
    /**
     * The date and time the deployment was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The ID of the last successful deployment.
     */
    lastSucceededDeploymentId?: DeploymentId;
    /**
     * The name of the service instance associated with the deployment.
     */
    serviceInstanceName?: ResourceName;
    /**
     * The name of the service associated with the deployment.
     */
    serviceName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the target of the deployment.
     */
    targetArn: Arn;
    /**
     * The date and time the target resource was created.
     */
    targetResourceCreatedAt: Timestamp;
    /**
     * The resource type of the deployment target. It can be an environment, service, service instance, or component.
     */
    targetResourceType: DeploymentTargetResourceType;
  }
  export type DeploymentSummaryList = DeploymentSummary[];
  export type DeploymentTargetResourceType = "ENVIRONMENT"|"SERVICE_PIPELINE"|"SERVICE_INSTANCE"|"COMPONENT"|string;
  export type DeploymentUpdateType = "NONE"|"CURRENT_VERSION"|"MINOR_VERSION"|"MAJOR_VERSION"|string;
  export type Description = string;
  export type DisplayName = string;
  export type EmptyNextToken = string;
  export interface Environment {
    /**
     * The Amazon Resource Name (ARN) of the environment.
     */
    arn: EnvironmentArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that allows Proton to provision infrastructure using CodeBuild-based provisioning on your behalf.
     */
    codebuildRoleArn?: RoleArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that Proton uses when provisioning directly defined components in this environment. It determines the scope of infrastructure that a component can provision. The environment must have a componentRoleArn to allow directly defined components to be associated with the environment. For more information about components, see Proton components in the Proton User Guide.
     */
    componentRoleArn?: RoleArn;
    /**
     * The time when the environment was created.
     */
    createdAt: Timestamp;
    /**
     * The environment deployment status.
     */
    deploymentStatus: DeploymentStatus;
    /**
     * An environment deployment status message.
     */
    deploymentStatusMessage?: StatusMessage;
    /**
     * The description of the environment.
     */
    description?: Description;
    /**
     * The ID of the environment account connection that's used to provision infrastructure resources in an environment account.
     */
    environmentAccountConnectionId?: EnvironmentAccountConnectionId;
    /**
     * The ID of the environment account that the environment infrastructure resources are provisioned in.
     */
    environmentAccountId?: AwsAccountId;
    /**
     * The ID of the last attempted deployment of this environment.
     */
    lastAttemptedDeploymentId?: DeploymentId;
    /**
     * The time when a deployment of the environment was last attempted.
     */
    lastDeploymentAttemptedAt: Timestamp;
    /**
     * The time when the environment was last deployed successfully.
     */
    lastDeploymentSucceededAt: Timestamp;
    /**
     * The ID of the last successful deployment of this environment.
     */
    lastSucceededDeploymentId?: DeploymentId;
    /**
     * The name of the environment.
     */
    name: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the Proton service role that allows Proton to make calls to other services on your behalf.
     */
    protonServiceRoleArn?: Arn;
    /**
     * When included, indicates that the environment template is for customer provisioned and managed infrastructure.
     */
    provisioning?: Provisioning;
    /**
     * The linked repository that you use to host your rendered infrastructure templates for self-managed provisioning. A linked repository is a repository that has been registered with Proton. For more information, see CreateRepository.
     */
    provisioningRepository?: RepositoryBranch;
    /**
     * The environment spec.
     */
    spec?: SpecContents;
    /**
     * The major version of the environment template.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The minor version of the environment template.
     */
    templateMinorVersion: TemplateVersionPart;
    /**
     * The Amazon Resource Name (ARN) of the environment template.
     */
    templateName: ResourceName;
  }
  export interface EnvironmentAccountConnection {
    /**
     * The Amazon Resource Name (ARN) of the environment account connection.
     */
    arn: EnvironmentAccountConnectionArn;
    /**
     * The Amazon Resource Name (ARN) of an IAM service role in the environment account. Proton uses this role to provision infrastructure resources using CodeBuild-based provisioning in the associated environment account.
     */
    codebuildRoleArn?: RoleArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that Proton uses when provisioning directly defined components in the associated environment account. It determines the scope of infrastructure that a component can provision in the account. The environment account connection must have a componentRoleArn to allow directly defined components to be associated with any environments running in the account. For more information about components, see Proton components in the Proton User Guide.
     */
    componentRoleArn?: RoleArn;
    /**
     * The environment account that's connected to the environment account connection.
     */
    environmentAccountId: AwsAccountId;
    /**
     * The name of the environment that's associated with the environment account connection.
     */
    environmentName: ResourceName;
    /**
     * The ID of the environment account connection.
     */
    id: EnvironmentAccountConnectionId;
    /**
     * The time when the environment account connection was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The ID of the management account that's connected to the environment account connection.
     */
    managementAccountId: AwsAccountId;
    /**
     * The time when the environment account connection request was made.
     */
    requestedAt: Timestamp;
    /**
     * The IAM service role that's associated with the environment account connection.
     */
    roleArn: Arn;
    /**
     * The status of the environment account connection.
     */
    status: EnvironmentAccountConnectionStatus;
  }
  export type EnvironmentAccountConnectionArn = string;
  export type EnvironmentAccountConnectionId = string;
  export type EnvironmentAccountConnectionRequesterAccountType = "MANAGEMENT_ACCOUNT"|"ENVIRONMENT_ACCOUNT"|string;
  export type EnvironmentAccountConnectionStatus = "PENDING"|"CONNECTED"|"REJECTED"|string;
  export type EnvironmentAccountConnectionStatusList = EnvironmentAccountConnectionStatus[];
  export interface EnvironmentAccountConnectionSummary {
    /**
     * The Amazon Resource Name (ARN) of the environment account connection.
     */
    arn: EnvironmentAccountConnectionArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that Proton uses when provisioning directly defined components in the associated environment account. It determines the scope of infrastructure that a component can provision in the account. The environment account connection must have a componentRoleArn to allow directly defined components to be associated with any environments running in the account. For more information about components, see Proton components in the Proton User Guide.
     */
    componentRoleArn?: Arn;
    /**
     * The ID of the environment account that's connected to the environment account connection.
     */
    environmentAccountId: AwsAccountId;
    /**
     * The name of the environment that's associated with the environment account connection.
     */
    environmentName: ResourceName;
    /**
     * The ID of the environment account connection.
     */
    id: EnvironmentAccountConnectionId;
    /**
     * The time when the environment account connection was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The ID of the management account that's connected to the environment account connection.
     */
    managementAccountId: AwsAccountId;
    /**
     * The time when the environment account connection request was made.
     */
    requestedAt: Timestamp;
    /**
     * The IAM service role that's associated with the environment account connection.
     */
    roleArn: Arn;
    /**
     * The status of the environment account connection.
     */
    status: EnvironmentAccountConnectionStatus;
  }
  export type EnvironmentAccountConnectionSummaryList = EnvironmentAccountConnectionSummary[];
  export type EnvironmentArn = string;
  export interface EnvironmentState {
    /**
     * The environment spec that was used to create the environment.
     */
    spec?: SpecContents;
    /**
     * The major version of the environment template that was used to create the environment.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The minor version of the environment template that was used to create the environment.
     */
    templateMinorVersion: TemplateVersionPart;
    /**
     * The name of the environment template that was used to create the environment.
     */
    templateName: ResourceName;
  }
  export interface EnvironmentSummary {
    /**
     * The Amazon Resource Name (ARN) of the environment.
     */
    arn: EnvironmentArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that Proton uses when provisioning directly defined components in this environment. It determines the scope of infrastructure that a component can provision. The environment must have a componentRoleArn to allow directly defined components to be associated with the environment. For more information about components, see Proton components in the Proton User Guide.
     */
    componentRoleArn?: Arn;
    /**
     * The time when the environment was created.
     */
    createdAt: Timestamp;
    /**
     * The environment deployment status.
     */
    deploymentStatus: DeploymentStatus;
    /**
     * An environment deployment status message.
     */
    deploymentStatusMessage?: StatusMessage;
    /**
     * The description of the environment.
     */
    description?: Description;
    /**
     * The ID of the environment account connection that the environment is associated with.
     */
    environmentAccountConnectionId?: EnvironmentAccountConnectionId;
    /**
     * The ID of the environment account that the environment infrastructure resources are provisioned in.
     */
    environmentAccountId?: AwsAccountId;
    /**
     * The ID of the last attempted deployment of this environment.
     */
    lastAttemptedDeploymentId?: DeploymentId;
    /**
     * The time when a deployment of the environment was last attempted.
     */
    lastDeploymentAttemptedAt: Timestamp;
    /**
     * The time when the environment was last deployed successfully.
     */
    lastDeploymentSucceededAt: Timestamp;
    /**
     * The ID of the last successful deployment of this environment.
     */
    lastSucceededDeploymentId?: DeploymentId;
    /**
     * The name of the environment.
     */
    name: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the Proton service role that allows Proton to make calls to other services on your behalf.
     */
    protonServiceRoleArn?: Arn;
    /**
     * When included, indicates that the environment template is for customer provisioned and managed infrastructure.
     */
    provisioning?: Provisioning;
    /**
     * The major version of the environment template.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The minor version of the environment template.
     */
    templateMinorVersion: TemplateVersionPart;
    /**
     * The name of the environment template.
     */
    templateName: ResourceName;
  }
  export type EnvironmentSummaryList = EnvironmentSummary[];
  export interface EnvironmentTemplate {
    /**
     * The Amazon Resource Name (ARN) of the environment template.
     */
    arn: EnvironmentTemplateArn;
    /**
     * The time when the environment template was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the environment template.
     */
    description?: Description;
    /**
     * The name of the environment template as displayed in the developer interface.
     */
    displayName?: DisplayName;
    /**
     * The customer provided encryption key for the environment template.
     */
    encryptionKey?: Arn;
    /**
     * The time when the environment template was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The name of the environment template.
     */
    name: ResourceName;
    /**
     * When included, indicates that the environment template is for customer provisioned and managed infrastructure.
     */
    provisioning?: Provisioning;
    /**
     * The ID of the recommended version of the environment template.
     */
    recommendedVersion?: FullTemplateVersionNumber;
  }
  export type EnvironmentTemplateArn = string;
  export interface EnvironmentTemplateFilter {
    /**
     * Include majorVersion to filter search for a major version.
     */
    majorVersion: TemplateVersionPart;
    /**
     * Include templateName to filter search for a template name.
     */
    templateName: ResourceName;
  }
  export type EnvironmentTemplateFilterList = EnvironmentTemplateFilter[];
  export interface EnvironmentTemplateSummary {
    /**
     * The Amazon Resource Name (ARN) of the environment template.
     */
    arn: EnvironmentTemplateArn;
    /**
     * The time when the environment template was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the environment template.
     */
    description?: Description;
    /**
     * The name of the environment template as displayed in the developer interface.
     */
    displayName?: DisplayName;
    /**
     * The time when the environment template was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The name of the environment template.
     */
    name: ResourceName;
    /**
     * When included, indicates that the environment template is for customer provisioned and managed infrastructure.
     */
    provisioning?: Provisioning;
    /**
     * The recommended version of the environment template.
     */
    recommendedVersion?: FullTemplateVersionNumber;
  }
  export type EnvironmentTemplateSummaryList = EnvironmentTemplateSummary[];
  export interface EnvironmentTemplateVersion {
    /**
     * The Amazon Resource Name (ARN) of the version of an environment template.
     */
    arn: EnvironmentTemplateVersionArn;
    /**
     * The time when the version of an environment template was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the minor version of an environment template.
     */
    description?: Description;
    /**
     * The time when the version of an environment template was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The latest major version that's associated with the version of an environment template.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The minor version of an environment template.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The recommended minor version of the environment template.
     */
    recommendedMinorVersion?: TemplateVersionPart;
    /**
     * The schema of the version of an environment template.
     */
    schema?: TemplateSchema;
    /**
     * The status of the version of an environment template.
     */
    status: TemplateVersionStatus;
    /**
     * The status message of the version of an environment template.
     */
    statusMessage?: StatusMessage;
    /**
     * The name of the version of an environment template.
     */
    templateName: ResourceName;
  }
  export type EnvironmentTemplateVersionArn = string;
  export interface EnvironmentTemplateVersionSummary {
    /**
     * The Amazon Resource Name (ARN) of the version of an environment template.
     */
    arn: EnvironmentTemplateVersionArn;
    /**
     * The time when the version of an environment template was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the version of an environment template.
     */
    description?: Description;
    /**
     * The time when the version of an environment template was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The latest major version that's associated with the version of an environment template.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The version of an environment template.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The recommended minor version of the environment template.
     */
    recommendedMinorVersion?: TemplateVersionPart;
    /**
     * The status of the version of an environment template.
     */
    status: TemplateVersionStatus;
    /**
     * The status message of the version of an environment template.
     */
    statusMessage?: StatusMessage;
    /**
     * The name of the environment template.
     */
    templateName: ResourceName;
  }
  export type EnvironmentTemplateVersionSummaryList = EnvironmentTemplateVersionSummary[];
  export type FullTemplateVersionNumber = string;
  export interface GetAccountSettingsInput {
  }
  export interface GetAccountSettingsOutput {
    /**
     * The Proton pipeline service role detail data that's returned by Proton.
     */
    accountSettings?: AccountSettings;
  }
  export interface GetComponentInput {
    /**
     * The name of the component that you want to get the detailed data for.
     */
    name: ResourceName;
  }
  export interface GetComponentOutput {
    /**
     * The detailed data of the requested component.
     */
    component?: Component;
  }
  export interface GetDeploymentInput {
    /**
     * The name of a component that you want to get the detailed data for.
     */
    componentName?: ResourceName;
    /**
     * The name of a environment that you want to get the detailed data for.
     */
    environmentName?: ResourceName;
    /**
     * The ID of the deployment that you want to get the detailed data for.
     */
    id: DeploymentId;
    /**
     * The name of the service instance associated with the given deployment ID. serviceName must be specified to identify the service instance.
     */
    serviceInstanceName?: ResourceName;
    /**
     * The name of the service associated with the given deployment ID.
     */
    serviceName?: ResourceName;
  }
  export interface GetDeploymentOutput {
    /**
     * The detailed data of the requested deployment.
     */
    deployment?: Deployment;
  }
  export interface GetEnvironmentAccountConnectionInput {
    /**
     * The ID of the environment account connection that you want to get the detailed data for.
     */
    id: EnvironmentAccountConnectionId;
  }
  export interface GetEnvironmentAccountConnectionOutput {
    /**
     * The detailed data of the requested environment account connection.
     */
    environmentAccountConnection: EnvironmentAccountConnection;
  }
  export interface GetEnvironmentInput {
    /**
     * The name of the environment that you want to get the detailed data for.
     */
    name: ResourceName;
  }
  export interface GetEnvironmentOutput {
    /**
     * The detailed data of the requested environment.
     */
    environment: Environment;
  }
  export interface GetEnvironmentTemplateInput {
    /**
     * The name of the environment template that you want to get the detailed data for.
     */
    name: ResourceName;
  }
  export interface GetEnvironmentTemplateOutput {
    /**
     * The detailed data of the requested environment template.
     */
    environmentTemplate: EnvironmentTemplate;
  }
  export interface GetEnvironmentTemplateVersionInput {
    /**
     * To get environment template major version detail data, include major Version.
     */
    majorVersion: TemplateVersionPart;
    /**
     * To get environment template minor version detail data, include minorVersion.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The name of the environment template a version of which you want to get detailed data for.
     */
    templateName: ResourceName;
  }
  export interface GetEnvironmentTemplateVersionOutput {
    /**
     * The detailed data of the requested environment template version.
     */
    environmentTemplateVersion: EnvironmentTemplateVersion;
  }
  export interface GetRepositoryInput {
    /**
     * The repository name, for example myrepos/myrepo.
     */
    name: RepositoryName;
    /**
     * The repository provider.
     */
    provider: RepositoryProvider;
  }
  export interface GetRepositoryOutput {
    /**
     * The repository link's detail data that's returned by Proton.
     */
    repository: Repository;
  }
  export interface GetRepositorySyncStatusInput {
    /**
     * The repository branch.
     */
    branch: GitBranchName;
    /**
     * The repository name.
     */
    repositoryName: RepositoryName;
    /**
     * The repository provider.
     */
    repositoryProvider: RepositoryProvider;
    /**
     * The repository sync type.
     */
    syncType: SyncType;
  }
  export interface GetRepositorySyncStatusOutput {
    /**
     * The repository sync status detail data that's returned by Proton.
     */
    latestSync?: RepositorySyncAttempt;
  }
  export interface GetResourcesSummaryInput {
  }
  export interface GetResourcesSummaryOutput {
    /**
     * Summary counts of each Proton resource type.
     */
    counts: CountsSummary;
  }
  export interface GetServiceInput {
    /**
     * The name of the service that you want to get the detailed data for.
     */
    name: ResourceName;
  }
  export interface GetServiceInstanceInput {
    /**
     * The name of a service instance that you want to get the detailed data for.
     */
    name: ResourceName;
    /**
     * The name of the service that you want the service instance input for.
     */
    serviceName: ResourceName;
  }
  export interface GetServiceInstanceOutput {
    /**
     * The detailed data of the requested service instance.
     */
    serviceInstance: ServiceInstance;
  }
  export interface GetServiceInstanceSyncStatusInput {
    /**
     * The name of the service instance that you want the sync status input for.
     */
    serviceInstanceName: ResourceName;
    /**
     * The name of the service that the service instance belongs to.
     */
    serviceName: ResourceName;
  }
  export interface GetServiceInstanceSyncStatusOutput {
    /**
     * The service instance sync desired state that's returned by Proton
     */
    desiredState?: Revision;
    /**
     * The detailed data of the latest successful sync with the service instance.
     */
    latestSuccessfulSync?: ResourceSyncAttempt;
    /**
     * The detailed data of the latest sync with the service instance.
     */
    latestSync?: ResourceSyncAttempt;
  }
  export interface GetServiceOutput {
    /**
     * The detailed data of the requested service.
     */
    service?: Service;
  }
  export interface GetServiceSyncBlockerSummaryInput {
    /**
     * The name of the service instance that you want to get the service sync blocker summary for. If given bothe the instance name and the service name, only the instance is blocked.
     */
    serviceInstanceName?: ResourceName;
    /**
     * The name of the service that you want to get the service sync blocker summary for. If given only the service name, all instances are blocked.
     */
    serviceName: ResourceName;
  }
  export interface GetServiceSyncBlockerSummaryOutput {
    /**
     * The detailed data of the requested service sync blocker summary.
     */
    serviceSyncBlockerSummary?: ServiceSyncBlockerSummary;
  }
  export interface GetServiceSyncConfigInput {
    /**
     * The name of the service that you want to get the service sync configuration for.
     */
    serviceName: ResourceName;
  }
  export interface GetServiceSyncConfigOutput {
    /**
     * The detailed data of the requested service sync configuration.
     */
    serviceSyncConfig?: ServiceSyncConfig;
  }
  export interface GetServiceTemplateInput {
    /**
     * The name of the service template that you want to get detailed data for.
     */
    name: ResourceName;
  }
  export interface GetServiceTemplateOutput {
    /**
     * The detailed data of the requested service template.
     */
    serviceTemplate: ServiceTemplate;
  }
  export interface GetServiceTemplateVersionInput {
    /**
     * To get service template major version detail data, include major Version.
     */
    majorVersion: TemplateVersionPart;
    /**
     * To get service template minor version detail data, include minorVersion.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The name of the service template a version of which you want to get detailed data for.
     */
    templateName: ResourceName;
  }
  export interface GetServiceTemplateVersionOutput {
    /**
     * The detailed data of the requested service template version.
     */
    serviceTemplateVersion: ServiceTemplateVersion;
  }
  export interface GetTemplateSyncConfigInput {
    /**
     * The template name.
     */
    templateName: ResourceName;
    /**
     * The template type.
     */
    templateType: TemplateType;
  }
  export interface GetTemplateSyncConfigOutput {
    /**
     * The template sync configuration detail data that's returned by Proton.
     */
    templateSyncConfig?: TemplateSyncConfig;
  }
  export interface GetTemplateSyncStatusInput {
    /**
     * The template name.
     */
    templateName: ResourceName;
    /**
     * The template type.
     */
    templateType: TemplateType;
    /**
     * The template major version.
     */
    templateVersion: TemplateVersionPart;
  }
  export interface GetTemplateSyncStatusOutput {
    /**
     * The template sync desired state that's returned by Proton.
     */
    desiredState?: Revision;
    /**
     * The details of the last successful sync that's returned by Proton.
     */
    latestSuccessfulSync?: ResourceSyncAttempt;
    /**
     * The details of the last sync that's returned by Proton.
     */
    latestSync?: ResourceSyncAttempt;
  }
  export type GitBranchName = string;
  export type Integer = number;
  export type LatestSyncBlockers = SyncBlocker[];
  export interface ListComponentOutputsInput {
    /**
     * The name of the component whose outputs you want.
     */
    componentName: ResourceName;
    /**
     * The ID of the deployment whose outputs you want.
     */
    deploymentId?: DeploymentId;
    /**
     * A token that indicates the location of the next output in the array of outputs, after the list of outputs that was previously requested.
     */
    nextToken?: EmptyNextToken;
  }
  export interface ListComponentOutputsOutput {
    /**
     * A token that indicates the location of the next output in the array of outputs, after the list of outputs that was previously requested.
     */
    nextToken?: EmptyNextToken;
    /**
     * An array of component Infrastructure as Code (IaC) outputs.
     */
    outputs: OutputsList;
  }
  export interface ListComponentProvisionedResourcesInput {
    /**
     * The name of the component whose provisioned resources you want.
     */
    componentName: ResourceName;
    /**
     * A token that indicates the location of the next provisioned resource in the array of provisioned resources, after the list of provisioned resources that was previously requested.
     */
    nextToken?: EmptyNextToken;
  }
  export interface ListComponentProvisionedResourcesOutput {
    /**
     * A token that indicates the location of the next provisioned resource in the array of provisioned resources, after the current requested list of provisioned resources.
     */
    nextToken?: EmptyNextToken;
    /**
     * An array of provisioned resources for a component.
     */
    provisionedResources: ProvisionedResourceList;
  }
  export interface ListComponentsInput {
    /**
     * The name of an environment for result list filtering. Proton returns components associated with the environment or attached to service instances running in it.
     */
    environmentName?: ResourceName;
    /**
     * The maximum number of components to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next component in the array of components, after the list of components that was previously requested.
     */
    nextToken?: NextToken;
    /**
     * The name of a service instance for result list filtering. Proton returns the component attached to the service instance, if any.
     */
    serviceInstanceName?: ResourceName;
    /**
     * The name of a service for result list filtering. Proton returns components attached to service instances of the service.
     */
    serviceName?: ResourceName;
  }
  export interface ListComponentsOutput {
    /**
     * An array of components with summary data.
     */
    components: ComponentSummaryList;
    /**
     * A token that indicates the location of the next component in the array of components, after the current requested list of components.
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentsInput {
    /**
     * The name of a component for result list filtering. Proton returns deployments associated with that component.
     */
    componentName?: ResourceName;
    /**
     * The name of an environment for result list filtering. Proton returns deployments associated with the environment.
     */
    environmentName?: ResourceName;
    /**
     * The maximum number of deployments to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next deployment in the array of deployment, after the list of deployment that was previously requested.
     */
    nextToken?: NextToken;
    /**
     * The name of a service instance for result list filtering. Proton returns the deployments associated with the service instance.
     */
    serviceInstanceName?: ResourceName;
    /**
     * The name of a service for result list filtering. Proton returns deployments associated with service instances of the service.
     */
    serviceName?: ResourceName;
  }
  export interface ListDeploymentsOutput {
    /**
     * An array of deployment with summary data.
     */
    deployments: DeploymentSummaryList;
    /**
     * A token that indicates the location of the next deployment in the array of deployment, after the current requested list of deployment.
     */
    nextToken?: NextToken;
  }
  export interface ListEnvironmentAccountConnectionsInput {
    /**
     * The environment name that's associated with each listed environment account connection.
     */
    environmentName?: ResourceName;
    /**
     * The maximum number of environment account connections to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next environment account connection in the array of environment account connections, after the list of environment account connections that was previously requested.
     */
    nextToken?: NextToken;
    /**
     * The type of account making the ListEnvironmentAccountConnections request.
     */
    requestedBy: EnvironmentAccountConnectionRequesterAccountType;
    /**
     * The status details for each listed environment account connection.
     */
    statuses?: EnvironmentAccountConnectionStatusList;
  }
  export interface ListEnvironmentAccountConnectionsOutput {
    /**
     * An array of environment account connections with details that's returned by Proton. 
     */
    environmentAccountConnections: EnvironmentAccountConnectionSummaryList;
    /**
     * A token that indicates the location of the next environment account connection in the array of environment account connections, after the current requested list of environment account connections.
     */
    nextToken?: NextToken;
  }
  export interface ListEnvironmentOutputsInput {
    /**
     * The ID of the deployment whose outputs you want.
     */
    deploymentId?: DeploymentId;
    /**
     * The environment name.
     */
    environmentName: ResourceName;
    /**
     * A token that indicates the location of the next environment output in the array of environment outputs, after the list of environment outputs that was previously requested.
     */
    nextToken?: EmptyNextToken;
  }
  export interface ListEnvironmentOutputsOutput {
    /**
     * A token that indicates the location of the next environment output in the array of environment outputs, after the current requested list of environment outputs.
     */
    nextToken?: EmptyNextToken;
    /**
     * An array of environment outputs with detail data.
     */
    outputs: OutputsList;
  }
  export interface ListEnvironmentProvisionedResourcesInput {
    /**
     * The environment name.
     */
    environmentName: ResourceName;
    /**
     * A token that indicates the location of the next environment provisioned resource in the array of environment provisioned resources, after the list of environment provisioned resources that was previously requested.
     */
    nextToken?: EmptyNextToken;
  }
  export interface ListEnvironmentProvisionedResourcesOutput {
    /**
     * A token that indicates the location of the next environment provisioned resource in the array of provisioned resources, after the current requested list of environment provisioned resources.
     */
    nextToken?: EmptyNextToken;
    /**
     * An array of environment provisioned resources.
     */
    provisionedResources: ProvisionedResourceList;
  }
  export interface ListEnvironmentTemplateVersionsInput {
    /**
     * To view a list of minor of versions under a major version of an environment template, include major Version. To view a list of major versions of an environment template, exclude major Version.
     */
    majorVersion?: TemplateVersionPart;
    /**
     * The maximum number of major or minor versions of an environment template to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next major or minor version in the array of major or minor versions of an environment template, after the list of major or minor versions that was previously requested.
     */
    nextToken?: NextToken;
    /**
     * The name of the environment template.
     */
    templateName: ResourceName;
  }
  export interface ListEnvironmentTemplateVersionsOutput {
    /**
     * A token that indicates the location of the next major or minor version in the array of major or minor versions of an environment template, after the list of major or minor versions that was previously requested.
     */
    nextToken?: NextToken;
    /**
     * An array of major or minor versions of an environment template detail data.
     */
    templateVersions: EnvironmentTemplateVersionSummaryList;
  }
  export interface ListEnvironmentTemplatesInput {
    /**
     * The maximum number of environment templates to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next environment template in the array of environment templates, after the list of environment templates that was previously requested.
     */
    nextToken?: NextToken;
  }
  export interface ListEnvironmentTemplatesOutput {
    /**
     * A token that indicates the location of the next environment template in the array of environment templates, after the current requested list of environment templates.
     */
    nextToken?: NextToken;
    /**
     * An array of environment templates with detail data.
     */
    templates: EnvironmentTemplateSummaryList;
  }
  export interface ListEnvironmentsInput {
    /**
     * An array of the versions of the environment template.
     */
    environmentTemplates?: EnvironmentTemplateFilterList;
    /**
     * The maximum number of environments to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next environment in the array of environments, after the list of environments that was previously requested.
     */
    nextToken?: NextToken;
  }
  export interface ListEnvironmentsOutput {
    /**
     * An array of environment detail data summaries.
     */
    environments: EnvironmentSummaryList;
    /**
     * A token that indicates the location of the next environment in the array of environments, after the current requested list of environments.
     */
    nextToken?: NextToken;
  }
  export interface ListRepositoriesInput {
    /**
     * The maximum number of repositories to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next repository in the array of repositories, after the list of repositories previously requested.
     */
    nextToken?: NextToken;
  }
  export interface ListRepositoriesOutput {
    /**
     * A token that indicates the location of the next repository in the array of repositories, after the current requested list of repositories. 
     */
    nextToken?: NextToken;
    /**
     * An array of repository links.
     */
    repositories: RepositorySummaryList;
  }
  export interface ListRepositorySyncDefinitionsInput {
    /**
     * A token that indicates the location of the next repository sync definition in the array of repository sync definitions, after the list of repository sync definitions previously requested.
     */
    nextToken?: EmptyNextToken;
    /**
     * The repository name.
     */
    repositoryName: RepositoryName;
    /**
     * The repository provider.
     */
    repositoryProvider: RepositoryProvider;
    /**
     * The sync type. The only supported value is TEMPLATE_SYNC.
     */
    syncType: SyncType;
  }
  export interface ListRepositorySyncDefinitionsOutput {
    /**
     * A token that indicates the location of the next repository sync definition in the array of repository sync definitions, after the current requested list of repository sync definitions.
     */
    nextToken?: EmptyNextToken;
    /**
     * An array of repository sync definitions.
     */
    syncDefinitions: RepositorySyncDefinitionList;
  }
  export interface ListServiceInstanceOutputsInput {
    /**
     * The ID of the deployment whose outputs you want.
     */
    deploymentId?: DeploymentId;
    /**
     * A token that indicates the location of the next output in the array of outputs, after the list of outputs that was previously requested.
     */
    nextToken?: EmptyNextToken;
    /**
     * The name of the service instance whose outputs you want.
     */
    serviceInstanceName: ResourceName;
    /**
     * The name of the service that serviceInstanceName is associated to.
     */
    serviceName: ResourceName;
  }
  export interface ListServiceInstanceOutputsOutput {
    /**
     * A token that indicates the location of the next output in the array of outputs, after the current requested list of outputs.
     */
    nextToken?: EmptyNextToken;
    /**
     * An array of service instance Infrastructure as Code (IaC) outputs.
     */
    outputs: OutputsList;
  }
  export interface ListServiceInstanceProvisionedResourcesInput {
    /**
     * A token that indicates the location of the next provisioned resource in the array of provisioned resources, after the list of provisioned resources that was previously requested.
     */
    nextToken?: EmptyNextToken;
    /**
     * The name of the service instance whose provisioned resources you want.
     */
    serviceInstanceName: ResourceName;
    /**
     * The name of the service that serviceInstanceName is associated to.
     */
    serviceName: ResourceName;
  }
  export interface ListServiceInstanceProvisionedResourcesOutput {
    /**
     * A token that indicates the location of the next provisioned resource in the array of provisioned resources, after the current requested list of provisioned resources.
     */
    nextToken?: EmptyNextToken;
    /**
     * An array of provisioned resources for a service instance.
     */
    provisionedResources: ProvisionedResourceList;
  }
  export interface ListServiceInstancesFilter {
    /**
     * The name of a filtering criterion.
     */
    key?: ListServiceInstancesFilterBy;
    /**
     * A value to filter by. With the date/time keys (*At{Before,After}), the value is a valid RFC 3339 string with no UTC offset and with an optional fractional precision (for example, 1985-04-12T23:20:50.52Z).
     */
    value?: ListServiceInstancesFilterValue;
  }
  export type ListServiceInstancesFilterBy = "name"|"deploymentStatus"|"templateName"|"serviceName"|"deployedTemplateVersionStatus"|"environmentName"|"lastDeploymentAttemptedAtBefore"|"lastDeploymentAttemptedAtAfter"|"createdAtBefore"|"createdAtAfter"|string;
  export type ListServiceInstancesFilterList = ListServiceInstancesFilter[];
  export type ListServiceInstancesFilterValue = string;
  export interface ListServiceInstancesInput {
    /**
     * An array of filtering criteria that scope down the result list. By default, all service instances in the Amazon Web Services account are returned.
     */
    filters?: ListServiceInstancesFilterList;
    /**
     * The maximum number of service instances to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next service in the array of service instances, after the list of service instances that was previously requested.
     */
    nextToken?: NextToken;
    /**
     * The name of the service that the service instance belongs to.
     */
    serviceName?: ResourceName;
    /**
     * The field that the result list is sorted by. When you choose to sort by serviceName, service instances within each service are sorted by service instance name. Default: serviceName 
     */
    sortBy?: ListServiceInstancesSortBy;
    /**
     * Result list sort order. Default: ASCENDING 
     */
    sortOrder?: SortOrder;
  }
  export interface ListServiceInstancesOutput {
    /**
     * A token that indicates the location of the next service instance in the array of service instances, after the current requested list of service instances.
     */
    nextToken?: NextToken;
    /**
     * An array of service instances with summary data.
     */
    serviceInstances: ServiceInstanceSummaryList;
  }
  export type ListServiceInstancesSortBy = "name"|"deploymentStatus"|"templateName"|"serviceName"|"environmentName"|"lastDeploymentAttemptedAt"|"createdAt"|string;
  export interface ListServicePipelineOutputsInput {
    /**
     * The ID of the deployment you want the outputs for.
     */
    deploymentId?: DeploymentId;
    /**
     * A token that indicates the location of the next output in the array of outputs, after the list of outputs that was previously requested.
     */
    nextToken?: EmptyNextToken;
    /**
     * The name of the service whose pipeline's outputs you want.
     */
    serviceName: ResourceName;
  }
  export interface ListServicePipelineOutputsOutput {
    /**
     * A token that indicates the location of the next output in the array of outputs, after the current requested list of outputs.
     */
    nextToken?: EmptyNextToken;
    /**
     * An array of service pipeline Infrastructure as Code (IaC) outputs.
     */
    outputs: OutputsList;
  }
  export interface ListServicePipelineProvisionedResourcesInput {
    /**
     * A token that indicates the location of the next provisioned resource in the array of provisioned resources, after the list of provisioned resources that was previously requested.
     */
    nextToken?: EmptyNextToken;
    /**
     * The name of the service whose pipeline's provisioned resources you want.
     */
    serviceName: ResourceName;
  }
  export interface ListServicePipelineProvisionedResourcesOutput {
    /**
     * A token that indicates the location of the next provisioned resource in the array of provisioned resources, after the current requested list of provisioned resources.
     */
    nextToken?: EmptyNextToken;
    /**
     * An array of provisioned resources for a service and pipeline.
     */
    provisionedResources: ProvisionedResourceList;
  }
  export interface ListServiceTemplateVersionsInput {
    /**
     * To view a list of minor of versions under a major version of a service template, include major Version. To view a list of major versions of a service template, exclude major Version.
     */
    majorVersion?: TemplateVersionPart;
    /**
     * The maximum number of major or minor versions of a service template to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next major or minor version in the array of major or minor versions of a service template, after the list of major or minor versions that was previously requested.
     */
    nextToken?: NextToken;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export interface ListServiceTemplateVersionsOutput {
    /**
     * A token that indicates the location of the next major or minor version in the array of major or minor versions of a service template, after the current requested list of service major or minor versions.
     */
    nextToken?: NextToken;
    /**
     * An array of major or minor versions of a service template with detail data.
     */
    templateVersions: ServiceTemplateVersionSummaryList;
  }
  export interface ListServiceTemplatesInput {
    /**
     * The maximum number of service templates to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next service template in the array of service templates, after the list of service templates previously requested.
     */
    nextToken?: NextToken;
  }
  export interface ListServiceTemplatesOutput {
    /**
     * A token that indicates the location of the next service template in the array of service templates, after the current requested list of service templates.
     */
    nextToken?: NextToken;
    /**
     * An array of service templates with detail data.
     */
    templates: ServiceTemplateSummaryList;
  }
  export interface ListServicesInput {
    /**
     * The maximum number of services to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next service in the array of services, after the list of services that was previously requested.
     */
    nextToken?: NextToken;
  }
  export interface ListServicesOutput {
    /**
     * A token that indicates the location of the next service in the array of services, after the current requested list of services.
     */
    nextToken?: NextToken;
    /**
     * An array of services with summaries of detail data.
     */
    services: ServiceSummaryList;
  }
  export interface ListTagsForResourceInput {
    /**
     * The maximum number of tags to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token that indicates the location of the next resource tag in the array of resource tags, after the list of resource tags that was previously requested.
     */
    nextToken?: String;
    /**
     * The Amazon Resource Name (ARN) of the resource for the listed tags.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * A token that indicates the location of the next resource tag in the array of resource tags, after the current requested list of resource tags.
     */
    nextToken?: String;
    /**
     * A list of resource tags with detail data.
     */
    tags: TagList;
  }
  export type MaxPageResults = number;
  export type NextToken = string;
  export interface NotifyResourceDeploymentStatusChangeInput {
    /**
     * The deployment ID for your provisioned resource.
     */
    deploymentId?: DeploymentId;
    /**
     * The provisioned resource state change detail data that's returned by Proton.
     */
    outputs?: NotifyResourceDeploymentStatusChangeInputOutputsList;
    /**
     * The provisioned resource Amazon Resource Name (ARN).
     */
    resourceArn: Arn;
    /**
     * The status of your provisioned resource.
     */
    status?: ResourceDeploymentStatus;
    /**
     * The deployment status message for your provisioned resource.
     */
    statusMessage?: NotifyResourceDeploymentStatusChangeInputStatusMessageString;
  }
  export type NotifyResourceDeploymentStatusChangeInputOutputsList = Output[];
  export type NotifyResourceDeploymentStatusChangeInputStatusMessageString = string;
  export interface NotifyResourceDeploymentStatusChangeOutput {
  }
  export type OpsFilePath = string;
  export interface Output {
    /**
     * The output key.
     */
    key?: OutputKey;
    /**
     * The output value.
     */
    valueString?: OutputValueString;
  }
  export type OutputKey = string;
  export type OutputValueString = string;
  export type OutputsList = Output[];
  export interface ProvisionedResource {
    /**
     * The provisioned resource identifier.
     */
    identifier?: ProvisionedResourceIdentifier;
    /**
     * The provisioned resource name.
     */
    name?: ProvisionedResourceName;
    /**
     * The resource provisioning engine. At this time, CLOUDFORMATION can be used for Amazon Web Services-managed provisioning, and TERRAFORM can be used for self-managed provisioning. For more information, see Self-managed provisioning in the Proton User Guide.
     */
    provisioningEngine?: ProvisionedResourceEngine;
  }
  export type ProvisionedResourceEngine = "CLOUDFORMATION"|"TERRAFORM"|string;
  export type ProvisionedResourceIdentifier = string;
  export type ProvisionedResourceList = ProvisionedResource[];
  export type ProvisionedResourceName = string;
  export type Provisioning = "CUSTOMER_MANAGED"|string;
  export interface RejectEnvironmentAccountConnectionInput {
    /**
     * The ID of the environment account connection to reject.
     */
    id: EnvironmentAccountConnectionId;
  }
  export interface RejectEnvironmentAccountConnectionOutput {
    /**
     * The environment connection account detail data that's returned by Proton.
     */
    environmentAccountConnection: EnvironmentAccountConnection;
  }
  export interface Repository {
    /**
     * The Amazon Resource Name (ARN) of the linked repository.
     */
    arn: RepositoryArn;
    /**
     * The Amazon Resource Name (ARN) of your AWS CodeStar connection that connects Proton to your repository provider account.
     */
    connectionArn: Arn;
    /**
     * Your customer Amazon Web Services KMS encryption key.
     */
    encryptionKey?: Arn;
    /**
     * The repository name.
     */
    name: RepositoryName;
    /**
     * The repository provider.
     */
    provider: RepositoryProvider;
  }
  export type RepositoryArn = string;
  export interface RepositoryBranch {
    /**
     * The Amazon Resource Name (ARN) of the linked repository.
     */
    arn: RepositoryArn;
    /**
     * The repository branch.
     */
    branch: GitBranchName;
    /**
     * The repository name.
     */
    name: RepositoryName;
    /**
     * The repository provider.
     */
    provider: RepositoryProvider;
  }
  export interface RepositoryBranchInput {
    /**
     * The repository branch.
     */
    branch: GitBranchName;
    /**
     * The repository name.
     */
    name: RepositoryName;
    /**
     * The repository provider.
     */
    provider: RepositoryProvider;
  }
  export type RepositoryId = string;
  export type RepositoryName = string;
  export type RepositoryProvider = "GITHUB"|"GITHUB_ENTERPRISE"|"BITBUCKET"|string;
  export interface RepositorySummary {
    /**
     * The Amazon Resource Name (ARN) of the linked repository.
     */
    arn: RepositoryArn;
    /**
     * The Amazon Resource Name (ARN) of the of your connection that connects Proton to your repository.
     */
    connectionArn: Arn;
    /**
     * The repository name.
     */
    name: RepositoryName;
    /**
     * The repository provider.
     */
    provider: RepositoryProvider;
  }
  export type RepositorySummaryList = RepositorySummary[];
  export interface RepositorySyncAttempt {
    /**
     * Detail data for sync attempt events.
     */
    events: RepositorySyncEvents;
    /**
     * The time when the sync attempt started.
     */
    startedAt: Timestamp;
    /**
     * The sync attempt status.
     */
    status: RepositorySyncStatus;
  }
  export interface RepositorySyncDefinition {
    /**
     * The repository branch.
     */
    branch: GitBranchName;
    /**
     * The directory in the repository.
     */
    directory: String;
    /**
     * The resource that is synced from.
     */
    parent: String;
    /**
     * The resource that is synced to.
     */
    target: String;
  }
  export type RepositorySyncDefinitionList = RepositorySyncDefinition[];
  export interface RepositorySyncEvent {
    /**
     * Event detail for a repository sync attempt.
     */
    event: String;
    /**
     * The external ID of the sync event.
     */
    externalId?: String;
    /**
     * The time that the sync event occurred.
     */
    time: Timestamp;
    /**
     * The type of event.
     */
    type: String;
  }
  export type RepositorySyncEvents = RepositorySyncEvent[];
  export type RepositorySyncStatus = "INITIATED"|"IN_PROGRESS"|"SUCCEEDED"|"FAILED"|"QUEUED"|string;
  export interface ResourceCountsSummary {
    /**
     * The number of resources of this type in the Amazon Web Services account that need a major template version update.
     */
    behindMajor?: Integer;
    /**
     * The number of resources of this type in the Amazon Web Services account that need a minor template version update.
     */
    behindMinor?: Integer;
    /**
     * The number of resources of this type in the Amazon Web Services account that failed to deploy.
     */
    failed?: Integer;
    /**
     * The total number of resources of this type in the Amazon Web Services account.
     */
    total: Integer;
    /**
     * The number of resources of this type in the Amazon Web Services account that are up-to-date with their template.
     */
    upToDate?: Integer;
  }
  export type ResourceDeploymentStatus = "IN_PROGRESS"|"FAILED"|"SUCCEEDED"|string;
  export type ResourceName = string;
  export type ResourceNameOrEmpty = string;
  export interface ResourceSyncAttempt {
    /**
     * An array of events with detail data.
     */
    events: ResourceSyncEvents;
    /**
     * Detail data for the initial repository commit, path and push.
     */
    initialRevision: Revision;
    /**
     * The time when the sync attempt started.
     */
    startedAt: Timestamp;
    /**
     * The status of the sync attempt.
     */
    status: ResourceSyncStatus;
    /**
     * The resource that is synced to.
     */
    target: String;
    /**
     * Detail data for the target revision.
     */
    targetRevision: Revision;
  }
  export interface ResourceSyncEvent {
    /**
     * A resource sync event.
     */
    event: String;
    /**
     * The external ID for the event.
     */
    externalId?: String;
    /**
     * The time when the event occurred.
     */
    time: Timestamp;
    /**
     * The type of event.
     */
    type: String;
  }
  export type ResourceSyncEvents = ResourceSyncEvent[];
  export type ResourceSyncStatus = "INITIATED"|"IN_PROGRESS"|"SUCCEEDED"|"FAILED"|string;
  export interface Revision {
    /**
     * The repository branch.
     */
    branch: GitBranchName;
    /**
     * The repository directory changed by a commit and push that activated the sync attempt.
     */
    directory: String;
    /**
     * The repository name.
     */
    repositoryName: RepositoryName;
    /**
     * The repository provider.
     */
    repositoryProvider: RepositoryProvider;
    /**
     * The secure hash algorithm (SHA) hash for the revision.
     */
    sha: SHA;
  }
  export type RoleArn = string;
  export type RoleArnOrEmptyString = string;
  export type S3Bucket = string;
  export type S3Key = string;
  export interface S3ObjectSource {
    /**
     * The name of the S3 bucket that contains a template bundle.
     */
    bucket: S3Bucket;
    /**
     * The path to the S3 bucket that contains a template bundle.
     */
    key: S3Key;
  }
  export type SHA = string;
  export interface Service {
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    arn: ServiceArn;
    /**
     * The name of the code repository branch that holds the code that's deployed in Proton.
     */
    branchName?: GitBranchName;
    /**
     * The time when the service was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the service.
     */
    description?: Description;
    /**
     * The time when the service was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The name of the service.
     */
    name: ResourceName;
    /**
     * The service pipeline detail data.
     */
    pipeline?: ServicePipeline;
    /**
     * The Amazon Resource Name (ARN) of the repository connection. For more information, see Setting up an AWS CodeStar connection in the Proton User Guide.
     */
    repositoryConnectionArn?: Arn;
    /**
     * The ID of the source code repository.
     */
    repositoryId?: RepositoryId;
    /**
     * The formatted specification that defines the service.
     */
    spec: SpecContents;
    /**
     * The status of the service.
     */
    status: ServiceStatus;
    /**
     * A service status message.
     */
    statusMessage?: StatusMessage;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export type ServiceArn = string;
  export interface ServiceInstance {
    /**
     * The Amazon Resource Name (ARN) of the service instance.
     */
    arn: ServiceInstanceArn;
    /**
     * The time when the service instance was created.
     */
    createdAt: Timestamp;
    /**
     * The service instance deployment status.
     */
    deploymentStatus: DeploymentStatus;
    /**
     * The message associated with the service instance deployment status.
     */
    deploymentStatusMessage?: StatusMessage;
    /**
     * The name of the environment that the service instance was deployed into.
     */
    environmentName: ResourceName;
    /**
     * The ID of the last attempted deployment of this service instance.
     */
    lastAttemptedDeploymentId?: DeploymentId;
    /**
     * The last client request token received.
     */
    lastClientRequestToken?: String;
    /**
     * The time when a deployment of the service instance was last attempted.
     */
    lastDeploymentAttemptedAt: Timestamp;
    /**
     * The time when the service instance was last deployed successfully.
     */
    lastDeploymentSucceededAt: Timestamp;
    /**
     * The ID of the last successful deployment of this service instance.
     */
    lastSucceededDeploymentId?: DeploymentId;
    /**
     * The name of the service instance.
     */
    name: ResourceName;
    /**
     * The name of the service that the service instance belongs to.
     */
    serviceName: ResourceName;
    /**
     * The service spec that was used to create the service instance.
     */
    spec?: SpecContents;
    /**
     * The major version of the service template that was used to create the service instance.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The minor version of the service template that was used to create the service instance.
     */
    templateMinorVersion: TemplateVersionPart;
    /**
     * The name of the service template that was used to create the service instance.
     */
    templateName: ResourceName;
  }
  export type ServiceInstanceArn = string;
  export interface ServiceInstanceState {
    /**
     * The IDs for the last successful components deployed for this service instance.
     */
    lastSuccessfulComponentDeploymentIds?: ComponentDeploymentIdList;
    /**
     * The ID for the last successful environment deployed for this service instance.
     */
    lastSuccessfulEnvironmentDeploymentId?: DeploymentId;
    /**
     * The ID for the last successful service pipeline deployed for this service instance.
     */
    lastSuccessfulServicePipelineDeploymentId?: DeploymentId;
    /**
     * The service spec that was used to create the service instance.
     */
    spec: SpecContents;
    /**
     * The major version of the service template that was used to create the service pipeline.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The minor version of the service template that was used to create the service pipeline.
     */
    templateMinorVersion: TemplateVersionPart;
    /**
     * The name of the service template that was used to create the service instance.
     */
    templateName: ResourceName;
  }
  export interface ServiceInstanceSummary {
    /**
     * The Amazon Resource Name (ARN) of the service instance.
     */
    arn: ServiceInstanceArn;
    /**
     * The time when the service instance was created.
     */
    createdAt: Timestamp;
    /**
     * The service instance deployment status.
     */
    deploymentStatus: DeploymentStatus;
    /**
     * A service instance deployment status message.
     */
    deploymentStatusMessage?: StatusMessage;
    /**
     * The name of the environment that the service instance was deployed into.
     */
    environmentName: ResourceName;
    /**
     * The ID of the last attempted deployment of this service instance.
     */
    lastAttemptedDeploymentId?: DeploymentId;
    /**
     * The time when a deployment of the service was last attempted.
     */
    lastDeploymentAttemptedAt: Timestamp;
    /**
     * The time when the service was last deployed successfully.
     */
    lastDeploymentSucceededAt: Timestamp;
    /**
     * The ID of the last successful deployment of this service instance.
     */
    lastSucceededDeploymentId?: DeploymentId;
    /**
     * The name of the service instance.
     */
    name: ResourceName;
    /**
     * The name of the service that the service instance belongs to.
     */
    serviceName: ResourceName;
    /**
     * The service instance template major version.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The service instance template minor version.
     */
    templateMinorVersion: TemplateVersionPart;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export type ServiceInstanceSummaryList = ServiceInstanceSummary[];
  export interface ServicePipeline {
    /**
     * The Amazon Resource Name (ARN) of the service pipeline.
     */
    arn: Arn;
    /**
     * The time when the service pipeline was created.
     */
    createdAt: Timestamp;
    /**
     * The deployment status of the service pipeline.
     */
    deploymentStatus: DeploymentStatus;
    /**
     * A service pipeline deployment status message.
     */
    deploymentStatusMessage?: StatusMessage;
    /**
     * The ID of the last attempted deployment of this service pipeline.
     */
    lastAttemptedDeploymentId?: DeploymentId;
    /**
     * The time when a deployment of the service pipeline was last attempted.
     */
    lastDeploymentAttemptedAt: Timestamp;
    /**
     * The time when the service pipeline was last deployed successfully.
     */
    lastDeploymentSucceededAt: Timestamp;
    /**
     * The ID of the last successful deployment of this service pipeline.
     */
    lastSucceededDeploymentId?: DeploymentId;
    /**
     * The service spec that was used to create the service pipeline.
     */
    spec?: SpecContents;
    /**
     * The major version of the service template that was used to create the service pipeline.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The minor version of the service template that was used to create the service pipeline.
     */
    templateMinorVersion: TemplateVersionPart;
    /**
     * The name of the service template that was used to create the service pipeline.
     */
    templateName: ResourceName;
  }
  export interface ServicePipelineState {
    /**
     * The service spec that was used to create the service pipeline.
     */
    spec?: SpecContents;
    /**
     * The major version of the service template that was used to create the service pipeline.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The minor version of the service template that was used to create the service pipeline.
     */
    templateMinorVersion: TemplateVersionPart;
    /**
     * The name of the service template that was used to create the service pipeline.
     */
    templateName: ResourceName;
  }
  export type ServiceStatus = "CREATE_IN_PROGRESS"|"CREATE_FAILED_CLEANUP_IN_PROGRESS"|"CREATE_FAILED_CLEANUP_COMPLETE"|"CREATE_FAILED_CLEANUP_FAILED"|"CREATE_FAILED"|"ACTIVE"|"DELETE_IN_PROGRESS"|"DELETE_FAILED"|"UPDATE_IN_PROGRESS"|"UPDATE_FAILED_CLEANUP_IN_PROGRESS"|"UPDATE_FAILED_CLEANUP_COMPLETE"|"UPDATE_FAILED_CLEANUP_FAILED"|"UPDATE_FAILED"|"UPDATE_COMPLETE_CLEANUP_FAILED"|string;
  export interface ServiceSummary {
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    arn: ServiceArn;
    /**
     * The time when the service was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the service.
     */
    description?: Description;
    /**
     * The time when the service was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The name of the service.
     */
    name: ResourceName;
    /**
     * The status of the service.
     */
    status: ServiceStatus;
    /**
     * A service status message.
     */
    statusMessage?: StatusMessage;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export type ServiceSummaryList = ServiceSummary[];
  export interface ServiceSyncBlockerSummary {
    /**
     * The latest active blockers for the synced service.
     */
    latestBlockers?: LatestSyncBlockers;
    /**
     * The name of the service instance that you want sync your service configuration with.
     */
    serviceInstanceName?: String;
    /**
     * The name of the service that you want to get the sync blocker summary for. If given a service instance name and a service name, it will return the blockers only applying to the instance that is blocked. If given only a service name, it will return the blockers that apply to all of the instances. In order to get the blockers for a single instance, you will need to make two distinct calls, one to get the sync blocker summary for the service and the other to get the sync blocker for the service instance.
     */
    serviceName: String;
  }
  export interface ServiceSyncConfig {
    /**
     * The name of the code repository branch that holds the service code Proton will sync with.
     */
    branch: GitBranchName;
    /**
     * The file path to the service sync configuration file.
     */
    filePath: OpsFilePath;
    /**
     * The name of the code repository that holds the service code Proton will sync with.
     */
    repositoryName: RepositoryName;
    /**
     * The name of the repository provider that holds the repository Proton will sync with.
     */
    repositoryProvider: RepositoryProvider;
    /**
     * The name of the service that the service instance is added to.
     */
    serviceName: ResourceName;
  }
  export interface ServiceTemplate {
    /**
     * The Amazon Resource Name (ARN) of the service template.
     */
    arn: ServiceTemplateArn;
    /**
     * The time when the service template was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the service template.
     */
    description?: Description;
    /**
     * The service template name as displayed in the developer interface.
     */
    displayName?: DisplayName;
    /**
     * The customer provided service template encryption key that's used to encrypt data.
     */
    encryptionKey?: Arn;
    /**
     * The time when the service template was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The name of the service template.
     */
    name: ResourceName;
    /**
     * If pipelineProvisioning is true, a service pipeline is included in the service template. Otherwise, a service pipeline isn't included in the service template.
     */
    pipelineProvisioning?: Provisioning;
    /**
     * The recommended version of the service template.
     */
    recommendedVersion?: FullTemplateVersionNumber;
  }
  export type ServiceTemplateArn = string;
  export interface ServiceTemplateSummary {
    /**
     * The Amazon Resource Name (ARN) of the service template.
     */
    arn: ServiceTemplateArn;
    /**
     * The time when the service template was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the service template.
     */
    description?: Description;
    /**
     * The service template name as displayed in the developer interface.
     */
    displayName?: DisplayName;
    /**
     * The time when the service template was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The name of the service template.
     */
    name: ResourceName;
    /**
     * If pipelineProvisioning is true, a service pipeline is included in the service template, otherwise a service pipeline isn't included in the service template.
     */
    pipelineProvisioning?: Provisioning;
    /**
     * The recommended version of the service template.
     */
    recommendedVersion?: FullTemplateVersionNumber;
  }
  export type ServiceTemplateSummaryList = ServiceTemplateSummary[];
  export type ServiceTemplateSupportedComponentSourceInputList = ServiceTemplateSupportedComponentSourceType[];
  export type ServiceTemplateSupportedComponentSourceType = "DIRECTLY_DEFINED"|string;
  export interface ServiceTemplateVersion {
    /**
     * The Amazon Resource Name (ARN) of the version of a service template.
     */
    arn: ServiceTemplateVersionArn;
    /**
     * An array of compatible environment template names for the major version of a service template.
     */
    compatibleEnvironmentTemplates: CompatibleEnvironmentTemplateList;
    /**
     * The time when the version of a service template was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the version of a service template.
     */
    description?: Description;
    /**
     * The time when the version of a service template was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The latest major version that's associated with the version of a service template.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The minor version of a service template.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The recommended minor version of the service template.
     */
    recommendedMinorVersion?: TemplateVersionPart;
    /**
     * The schema of the version of a service template.
     */
    schema?: TemplateSchema;
    /**
     * The service template version status.
     */
    status: TemplateVersionStatus;
    /**
     * A service template version status message.
     */
    statusMessage?: StatusMessage;
    /**
     * An array of supported component sources. Components with supported sources can be attached to service instances based on this service template version. For more information about components, see Proton components in the Proton User Guide.
     */
    supportedComponentSources?: ServiceTemplateSupportedComponentSourceInputList;
    /**
     * The name of the version of a service template.
     */
    templateName: ResourceName;
  }
  export type ServiceTemplateVersionArn = string;
  export interface ServiceTemplateVersionSummary {
    /**
     * The Amazon Resource Name (ARN) of the version of a service template.
     */
    arn: ServiceTemplateVersionArn;
    /**
     * The time when the version of a service template was created.
     */
    createdAt: Timestamp;
    /**
     * A description of the version of a service template.
     */
    description?: Description;
    /**
     * The time when the version of a service template was last modified.
     */
    lastModifiedAt: Timestamp;
    /**
     * The latest major version that's associated with the version of a service template.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The minor version of a service template.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The recommended minor version of the service template.
     */
    recommendedMinorVersion?: TemplateVersionPart;
    /**
     * The service template minor version status.
     */
    status: TemplateVersionStatus;
    /**
     * A service template minor version status message.
     */
    statusMessage?: StatusMessage;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export type ServiceTemplateVersionSummaryList = ServiceTemplateVersionSummary[];
  export type SortOrder = "ASCENDING"|"DESCENDING"|string;
  export type SpecContents = string;
  export type StatusMessage = string;
  export type String = string;
  export type Subdirectory = string;
  export interface SyncBlocker {
    /**
     * The contexts for the sync blocker.
     */
    contexts?: SyncBlockerContexts;
    /**
     * The time when the sync blocker was created.
     */
    createdAt: Timestamp;
    /**
     * The reason why the sync blocker was created.
     */
    createdReason: String;
    /**
     * The ID of the sync blocker.
     */
    id: String;
    /**
     * The time the sync blocker was resolved.
     */
    resolvedAt?: Timestamp;
    /**
     * The reason the sync blocker was resolved.
     */
    resolvedReason?: String;
    /**
     * The status of the sync blocker.
     */
    status: BlockerStatus;
    /**
     * The type of the sync blocker.
     */
    type: BlockerType;
  }
  export interface SyncBlockerContext {
    /**
     * The key for the sync blocker context.
     */
    key: String;
    /**
     * The value of the sync blocker context.
     */
    value: String;
  }
  export type SyncBlockerContexts = SyncBlockerContext[];
  export type SyncType = "TEMPLATE_SYNC"|"SERVICE_SYNC"|string;
  export interface Tag {
    /**
     * The key of the resource tag.
     */
    key: TagKey;
    /**
     * The value of the resource tag.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the Proton resource to apply customer tags to.
     */
    resourceArn: Arn;
    /**
     * A list of customer tags to apply to the Proton resource.
     */
    tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type TemplateFileContents = string;
  export type TemplateManifestContents = string;
  export type TemplateSchema = string;
  export interface TemplateSyncConfig {
    /**
     * The repository branch.
     */
    branch: GitBranchName;
    /**
     * The repository name (for example, myrepos/myrepo).
     */
    repositoryName: RepositoryName;
    /**
     * The repository provider.
     */
    repositoryProvider: RepositoryProvider;
    /**
     * A subdirectory path to your template bundle version.
     */
    subdirectory?: Subdirectory;
    /**
     * The template name.
     */
    templateName: ResourceName;
    /**
     * The template type.
     */
    templateType: TemplateType;
  }
  export type TemplateType = "ENVIRONMENT"|"SERVICE"|string;
  export type TemplateVersionPart = string;
  export interface TemplateVersionSourceInput {
    /**
     * An S3 source object that includes the template bundle S3 path and name for a template minor version.
     */
    s3?: S3ObjectSource;
  }
  export type TemplateVersionStatus = "REGISTRATION_IN_PROGRESS"|"REGISTRATION_FAILED"|"DRAFT"|"PUBLISHED"|string;
  export type Timestamp = Date;
  export interface UntagResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource to remove customer tags from.
     */
    resourceArn: Arn;
    /**
     * A list of customer tag keys that indicate the customer tags to be removed from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateAccountSettingsInput {
    /**
     * Set to true to remove a configured pipeline repository from the account settings. Don't set this field if you are updating the configured pipeline repository.
     */
    deletePipelineProvisioningRepository?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of the service role you want to use for provisioning pipelines. Proton assumes this role for CodeBuild-based provisioning.
     */
    pipelineCodebuildRoleArn?: RoleArnOrEmptyString;
    /**
     * A linked repository for pipeline provisioning. Specify it if you have environments configured for self-managed provisioning with services that include pipelines. A linked repository is a repository that has been registered with Proton. For more information, see CreateRepository. To remove a previously configured repository, set deletePipelineProvisioningRepository to true, and don't set pipelineProvisioningRepository.
     */
    pipelineProvisioningRepository?: RepositoryBranchInput;
    /**
     * The Amazon Resource Name (ARN) of the service role you want to use for provisioning pipelines. Assumed by Proton for Amazon Web Services-managed provisioning, and by customer-owned automation for self-managed provisioning. To remove a previously configured ARN, specify an empty string.
     */
    pipelineServiceRoleArn?: RoleArnOrEmptyString;
  }
  export interface UpdateAccountSettingsOutput {
    /**
     * The Proton pipeline service role and repository data shared across the Amazon Web Services account.
     */
    accountSettings: AccountSettings;
  }
  export interface UpdateComponentInput {
    /**
     * The client token for the updated component.
     */
    clientToken?: ClientToken;
    /**
     * The deployment type. It defines the mode for updating a component, as follows:     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated. You can only specify description in this mode.     CURRENT_VERSION  In this mode, the component is deployed and updated with the new serviceSpec, templateSource, and/or type that you provide. Only requested parameters are updated.  
     */
    deploymentType: ComponentDeploymentUpdateType;
    /**
     * An optional customer-provided description of the component.
     */
    description?: Description;
    /**
     * The name of the component to update.
     */
    name: ResourceName;
    /**
     * The name of the service instance that you want to attach this component to. Don't specify to keep the component's current service instance attachment. Specify an empty string to detach the component from the service instance it's attached to. Specify non-empty values for both serviceInstanceName and serviceName or for neither of them.
     */
    serviceInstanceName?: ResourceNameOrEmpty;
    /**
     * The name of the service that serviceInstanceName is associated with. Don't specify to keep the component's current service instance attachment. Specify an empty string to detach the component from the service instance it's attached to. Specify non-empty values for both serviceInstanceName and serviceName or for neither of them.
     */
    serviceName?: ResourceNameOrEmpty;
    /**
     * The service spec that you want the component to use to access service inputs. Set this only when the component is attached to a service instance.
     */
    serviceSpec?: SpecContents;
    /**
     * A path to the Infrastructure as Code (IaC) file describing infrastructure that a custom component provisions.  Components support a single IaC file, even if you use Terraform as your template language. 
     */
    templateFile?: TemplateFileContents;
  }
  export interface UpdateComponentOutput {
    /**
     * The detailed data of the updated component.
     */
    component: Component;
  }
  export interface UpdateEnvironmentAccountConnectionInput {
    /**
     * The Amazon Resource Name (ARN) of an IAM service role in the environment account. Proton uses this role to provision infrastructure resources using CodeBuild-based provisioning in the associated environment account.
     */
    codebuildRoleArn?: RoleArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that Proton uses when provisioning directly defined components in the associated environment account. It determines the scope of infrastructure that a component can provision in the account. The environment account connection must have a componentRoleArn to allow directly defined components to be associated with any environments running in the account. For more information about components, see Proton components in the Proton User Guide.
     */
    componentRoleArn?: RoleArn;
    /**
     * The ID of the environment account connection to update.
     */
    id: EnvironmentAccountConnectionId;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that's associated with the environment account connection to update.
     */
    roleArn?: RoleArn;
  }
  export interface UpdateEnvironmentAccountConnectionOutput {
    /**
     * The environment account connection detail data that's returned by Proton.
     */
    environmentAccountConnection: EnvironmentAccountConnection;
  }
  export interface UpdateEnvironmentInput {
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that allows Proton to provision infrastructure using CodeBuild-based provisioning on your behalf.
     */
    codebuildRoleArn?: RoleArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that Proton uses when provisioning directly defined components in this environment. It determines the scope of infrastructure that a component can provision. The environment must have a componentRoleArn to allow directly defined components to be associated with the environment. For more information about components, see Proton components in the Proton User Guide.
     */
    componentRoleArn?: RoleArn;
    /**
     * There are four modes for updating an environment. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the environment is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include major or minor version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can also specify a different major version that is higher than the major version in use and a minor version (optional).  
     */
    deploymentType: DeploymentUpdateType;
    /**
     * A description of the environment update.
     */
    description?: Description;
    /**
     * The ID of the environment account connection. You can only update to a new environment account connection if it was created in the same environment account that the current environment account connection was created in and is associated with the current environment.
     */
    environmentAccountConnectionId?: EnvironmentAccountConnectionId;
    /**
     * The name of the environment to update.
     */
    name: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the Proton service role that allows Proton to make API calls to other services your behalf.
     */
    protonServiceRoleArn?: Arn;
    /**
     * The linked repository that you use to host your rendered infrastructure templates for self-managed provisioning. A linked repository is a repository that has been registered with Proton. For more information, see CreateRepository.
     */
    provisioningRepository?: RepositoryBranchInput;
    /**
     * The formatted specification that defines the update.
     */
    spec?: SpecContents;
    /**
     * The major version of the environment to update.
     */
    templateMajorVersion?: TemplateVersionPart;
    /**
     * The minor version of the environment to update.
     */
    templateMinorVersion?: TemplateVersionPart;
  }
  export interface UpdateEnvironmentOutput {
    /**
     * The environment detail data that's returned by Proton.
     */
    environment: Environment;
  }
  export interface UpdateEnvironmentTemplateInput {
    /**
     * A description of the environment template update.
     */
    description?: Description;
    /**
     * The name of the environment template to update as displayed in the developer interface.
     */
    displayName?: DisplayName;
    /**
     * The name of the environment template to update.
     */
    name: ResourceName;
  }
  export interface UpdateEnvironmentTemplateOutput {
    /**
     * The environment template detail data that's returned by Proton.
     */
    environmentTemplate: EnvironmentTemplate;
  }
  export interface UpdateEnvironmentTemplateVersionInput {
    /**
     * A description of environment template version to update.
     */
    description?: Description;
    /**
     * To update a major version of an environment template, include major Version.
     */
    majorVersion: TemplateVersionPart;
    /**
     * To update a minor version of an environment template, include minorVersion.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The status of the environment template minor version to update.
     */
    status?: TemplateVersionStatus;
    /**
     * The name of the environment template.
     */
    templateName: ResourceName;
  }
  export interface UpdateEnvironmentTemplateVersionOutput {
    /**
     * The environment template version detail data that's returned by Proton.
     */
    environmentTemplateVersion: EnvironmentTemplateVersion;
  }
  export interface UpdateServiceInput {
    /**
     * The edited service description.
     */
    description?: Description;
    /**
     * The name of the service to edit.
     */
    name: ResourceName;
    /**
     * Lists the service instances to add and the existing service instances to remain. Omit the existing service instances to delete from the list. Don't include edits to the existing service instances or pipeline. For more information, see Edit a service in the Proton User Guide.
     */
    spec?: SpecContents;
  }
  export interface UpdateServiceInstanceInput {
    /**
     * The client token of the service instance to update.
     */
    clientToken?: ClientToken;
    /**
     * The deployment type. It defines the mode for updating a service instance, as follows:     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the service instance is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include major or minor version parameters when you use this deployment type.     MINOR_VERSION  In this mode, the service instance is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the service instance is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can specify a different major version that's higher than the major version in use and a minor version.  
     */
    deploymentType: DeploymentUpdateType;
    /**
     * The name of the service instance to update.
     */
    name: ResourceName;
    /**
     * The name of the service that the service instance belongs to.
     */
    serviceName: ResourceName;
    /**
     * The formatted specification that defines the service instance update.
     */
    spec?: SpecContents;
    /**
     * The major version of the service template to update.
     */
    templateMajorVersion?: TemplateVersionPart;
    /**
     * The minor version of the service template to update.
     */
    templateMinorVersion?: TemplateVersionPart;
  }
  export interface UpdateServiceInstanceOutput {
    /**
     * The service instance summary data that's returned by Proton.
     */
    serviceInstance: ServiceInstance;
  }
  export interface UpdateServiceOutput {
    /**
     * The service detail data that's returned by Proton.
     */
    service: Service;
  }
  export interface UpdateServicePipelineInput {
    /**
     * The deployment type. There are four modes for updating a service pipeline. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the service pipeline is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include major or minor version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can specify a different major version that's higher than the major version in use and a minor version.  
     */
    deploymentType: DeploymentUpdateType;
    /**
     * The name of the service to that the pipeline is associated with.
     */
    serviceName: ResourceName;
    /**
     * The spec for the service pipeline to update.
     */
    spec: SpecContents;
    /**
     * The major version of the service template that was used to create the service that the pipeline is associated with.
     */
    templateMajorVersion?: TemplateVersionPart;
    /**
     * The minor version of the service template that was used to create the service that the pipeline is associated with.
     */
    templateMinorVersion?: TemplateVersionPart;
  }
  export interface UpdateServicePipelineOutput {
    /**
     * The pipeline details that are returned by Proton.
     */
    pipeline: ServicePipeline;
  }
  export interface UpdateServiceSyncBlockerInput {
    /**
     * The ID of the service sync blocker.
     */
    id: String;
    /**
     * The reason the service sync blocker was resolved.
     */
    resolvedReason: String;
  }
  export interface UpdateServiceSyncBlockerOutput {
    /**
     * The name of the service instance that you want to update the service sync blocker for.
     */
    serviceInstanceName?: ResourceName;
    /**
     * The name of the service that you want to update the service sync blocker for.
     */
    serviceName: ResourceName;
    /**
     * The detailed data on the service sync blocker that was updated.
     */
    serviceSyncBlocker: SyncBlocker;
  }
  export interface UpdateServiceSyncConfigInput {
    /**
     * The name of the code repository branch where the Proton Ops file is found.
     */
    branch: GitBranchName;
    /**
     * The path to the Proton Ops file.
     */
    filePath: OpsFilePath;
    /**
     * The name of the repository where the Proton Ops file is found.
     */
    repositoryName: RepositoryName;
    /**
     * The name of the repository provider where the Proton Ops file is found.
     */
    repositoryProvider: RepositoryProvider;
    /**
     * The name of the service the Proton Ops file is for.
     */
    serviceName: ResourceName;
  }
  export interface UpdateServiceSyncConfigOutput {
    /**
     * The detailed data of the Proton Ops file.
     */
    serviceSyncConfig?: ServiceSyncConfig;
  }
  export interface UpdateServiceTemplateInput {
    /**
     * A description of the service template update.
     */
    description?: Description;
    /**
     * The name of the service template to update that's displayed in the developer interface.
     */
    displayName?: DisplayName;
    /**
     * The name of the service template to update.
     */
    name: ResourceName;
  }
  export interface UpdateServiceTemplateOutput {
    /**
     * The service template detail data that's returned by Proton.
     */
    serviceTemplate: ServiceTemplate;
  }
  export interface UpdateServiceTemplateVersionInput {
    /**
     * An array of environment template objects that are compatible with this service template version. A service instance based on this service template version can run in environments based on compatible templates.
     */
    compatibleEnvironmentTemplates?: CompatibleEnvironmentTemplateInputList;
    /**
     * A description of a service template version to update.
     */
    description?: Description;
    /**
     * To update a major version of a service template, include major Version.
     */
    majorVersion: TemplateVersionPart;
    /**
     * To update a minor version of a service template, include minorVersion.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The status of the service template minor version to update.
     */
    status?: TemplateVersionStatus;
    /**
     * An array of supported component sources. Components with supported sources can be attached to service instances based on this service template version.  A change to supportedComponentSources doesn't impact existing component attachments to instances based on this template version. A change only affects later associations.  For more information about components, see Proton components in the Proton User Guide.
     */
    supportedComponentSources?: ServiceTemplateSupportedComponentSourceInputList;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export interface UpdateServiceTemplateVersionOutput {
    /**
     * The service template version detail data that's returned by Proton.
     */
    serviceTemplateVersion: ServiceTemplateVersion;
  }
  export interface UpdateTemplateSyncConfigInput {
    /**
     * The repository branch for your template.
     */
    branch: GitBranchName;
    /**
     * The repository name (for example, myrepos/myrepo).
     */
    repositoryName: RepositoryName;
    /**
     * The repository provider.
     */
    repositoryProvider: RepositoryProvider;
    /**
     * A subdirectory path to your template bundle version. When included, limits the template bundle search to this repository directory.
     */
    subdirectory?: Subdirectory;
    /**
     * The synced template name.
     */
    templateName: ResourceName;
    /**
     * The synced template type.
     */
    templateType: TemplateType;
  }
  export interface UpdateTemplateSyncConfigOutput {
    /**
     * The template sync configuration detail data that's returned by Proton.
     */
    templateSyncConfig?: TemplateSyncConfig;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-07-20"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Proton client.
   */
  export import Types = Proton;
}
export = Proton;
