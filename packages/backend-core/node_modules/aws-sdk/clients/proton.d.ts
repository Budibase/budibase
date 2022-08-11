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
   * In a management account, an environment account connection request is accepted. When the environment account connection request is accepted, AWS Proton can use the associated IAM role to provision environment infrastructure resources in the associated environment account. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  acceptEnvironmentAccountConnection(params: Proton.Types.AcceptEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.AcceptEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.AcceptEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * In a management account, an environment account connection request is accepted. When the environment account connection request is accepted, AWS Proton can use the associated IAM role to provision environment infrastructure resources in the associated environment account. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  acceptEnvironmentAccountConnection(callback?: (err: AWSError, data: Proton.Types.AcceptEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.AcceptEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Attempts to cancel an environment deployment on an UpdateEnvironment action, if the deployment is IN_PROGRESS. For more information, see Update an environment in the AWS Proton Administrator guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateEnvironment action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelEnvironmentDeployment(params: Proton.Types.CancelEnvironmentDeploymentInput, callback?: (err: AWSError, data: Proton.Types.CancelEnvironmentDeploymentOutput) => void): Request<Proton.Types.CancelEnvironmentDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel an environment deployment on an UpdateEnvironment action, if the deployment is IN_PROGRESS. For more information, see Update an environment in the AWS Proton Administrator guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateEnvironment action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelEnvironmentDeployment(callback?: (err: AWSError, data: Proton.Types.CancelEnvironmentDeploymentOutput) => void): Request<Proton.Types.CancelEnvironmentDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel a service instance deployment on an UpdateServiceInstance action, if the deployment is IN_PROGRESS. For more information, see Update a service instance in the AWS Proton Administrator guide or the AWS Proton User guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateServiceInstance action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelServiceInstanceDeployment(params: Proton.Types.CancelServiceInstanceDeploymentInput, callback?: (err: AWSError, data: Proton.Types.CancelServiceInstanceDeploymentOutput) => void): Request<Proton.Types.CancelServiceInstanceDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel a service instance deployment on an UpdateServiceInstance action, if the deployment is IN_PROGRESS. For more information, see Update a service instance in the AWS Proton Administrator guide or the AWS Proton User guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateServiceInstance action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelServiceInstanceDeployment(callback?: (err: AWSError, data: Proton.Types.CancelServiceInstanceDeploymentOutput) => void): Request<Proton.Types.CancelServiceInstanceDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel a service pipeline deployment on an UpdateServicePipeline action, if the deployment is IN_PROGRESS. For more information, see Update a service pipeline in the AWS Proton Administrator guide or the AWS Proton User guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateServicePipeline action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelServicePipelineDeployment(params: Proton.Types.CancelServicePipelineDeploymentInput, callback?: (err: AWSError, data: Proton.Types.CancelServicePipelineDeploymentOutput) => void): Request<Proton.Types.CancelServicePipelineDeploymentOutput, AWSError>;
  /**
   * Attempts to cancel a service pipeline deployment on an UpdateServicePipeline action, if the deployment is IN_PROGRESS. For more information, see Update a service pipeline in the AWS Proton Administrator guide or the AWS Proton User guide. The following list includes potential cancellation scenarios.   If the cancellation attempt succeeds, the resulting deployment state is CANCELLED.   If the cancellation attempt fails, the resulting deployment state is FAILED.   If the current UpdateServicePipeline action succeeds before the cancellation attempt starts, the resulting deployment state is SUCCEEDED and the cancellation attempt has no effect.  
   */
  cancelServicePipelineDeployment(callback?: (err: AWSError, data: Proton.Types.CancelServicePipelineDeploymentOutput) => void): Request<Proton.Types.CancelServicePipelineDeploymentOutput, AWSError>;
  /**
   * Deploy a new environment. An AWS Proton environment is created from an environment template that defines infrastructure and resources that can be shared across services. For more information, see the Environments in the AWS Proton Administrator Guide. 
   */
  createEnvironment(params: Proton.Types.CreateEnvironmentInput, callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentOutput) => void): Request<Proton.Types.CreateEnvironmentOutput, AWSError>;
  /**
   * Deploy a new environment. An AWS Proton environment is created from an environment template that defines infrastructure and resources that can be shared across services. For more information, see the Environments in the AWS Proton Administrator Guide. 
   */
  createEnvironment(callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentOutput) => void): Request<Proton.Types.CreateEnvironmentOutput, AWSError>;
  /**
   * Create an environment account connection in an environment account so that environment infrastructure resources can be provisioned in the environment account from a management account. An environment account connection is a secure bi-directional connection between a management account and an environment account that maintains authorization and permissions. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  createEnvironmentAccountConnection(params: Proton.Types.CreateEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.CreateEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Create an environment account connection in an environment account so that environment infrastructure resources can be provisioned in the environment account from a management account. An environment account connection is a secure bi-directional connection between a management account and an environment account that maintains authorization and permissions. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  createEnvironmentAccountConnection(callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.CreateEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Create an environment template for AWS Proton. For more information, see Environment Templates in the AWS Proton Administrator Guide. You can create an environment template in one of the two following ways:   Register and publish a standard environment template that instructs AWS Proton to deploy and manage environment infrastructure.   Register and publish a customer managed environment template that connects AWS Proton to your existing provisioned infrastructure that you manage. AWS Proton doesn't manage your existing provisioned infrastructure. To create an environment template for customer provisioned and managed infrastructure, include the provisioning parameter and set the value to CUSTOMER_MANAGED. For more information, see Register and publish an environment template in the AWS Proton Administrator Guide.  
   */
  createEnvironmentTemplate(params: Proton.Types.CreateEnvironmentTemplateInput, callback?: (err: AWSError, data: Proton.Types.CreateEnvironmentTemplateOutput) => void): Request<Proton.Types.CreateEnvironmentTemplateOutput, AWSError>;
  /**
   * Create an environment template for AWS Proton. For more information, see Environment Templates in the AWS Proton Administrator Guide. You can create an environment template in one of the two following ways:   Register and publish a standard environment template that instructs AWS Proton to deploy and manage environment infrastructure.   Register and publish a customer managed environment template that connects AWS Proton to your existing provisioned infrastructure that you manage. AWS Proton doesn't manage your existing provisioned infrastructure. To create an environment template for customer provisioned and managed infrastructure, include the provisioning parameter and set the value to CUSTOMER_MANAGED. For more information, see Register and publish an environment template in the AWS Proton Administrator Guide.  
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
   * Create an AWS Proton service. An AWS Proton service is an instantiation of a service template and often includes several service instances and pipeline. For more information, see Services in the AWS Proton Administrator Guide and Services in the AWS Proton User Guide.
   */
  createService(params: Proton.Types.CreateServiceInput, callback?: (err: AWSError, data: Proton.Types.CreateServiceOutput) => void): Request<Proton.Types.CreateServiceOutput, AWSError>;
  /**
   * Create an AWS Proton service. An AWS Proton service is an instantiation of a service template and often includes several service instances and pipeline. For more information, see Services in the AWS Proton Administrator Guide and Services in the AWS Proton User Guide.
   */
  createService(callback?: (err: AWSError, data: Proton.Types.CreateServiceOutput) => void): Request<Proton.Types.CreateServiceOutput, AWSError>;
  /**
   * Create a service template. The administrator creates a service template to define standardized infrastructure and an optional CICD service pipeline. Developers, in turn, select the service template from AWS Proton. If the selected service template includes a service pipeline definition, they provide a link to their source code repository. AWS Proton then deploys and manages the infrastructure defined by the selected service template. For more information, see Service Templates in the AWS Proton Administrator Guide.
   */
  createServiceTemplate(params: Proton.Types.CreateServiceTemplateInput, callback?: (err: AWSError, data: Proton.Types.CreateServiceTemplateOutput) => void): Request<Proton.Types.CreateServiceTemplateOutput, AWSError>;
  /**
   * Create a service template. The administrator creates a service template to define standardized infrastructure and an optional CICD service pipeline. Developers, in turn, select the service template from AWS Proton. If the selected service template includes a service pipeline definition, they provide a link to their source code repository. AWS Proton then deploys and manages the infrastructure defined by the selected service template. For more information, see Service Templates in the AWS Proton Administrator Guide.
   */
  createServiceTemplate(callback?: (err: AWSError, data: Proton.Types.CreateServiceTemplateOutput) => void): Request<Proton.Types.CreateServiceTemplateOutput, AWSError>;
  /**
   * Create a new major or minor version of a service template. A major version of a service template is a version that isn't backwards compatible. A minor version of a service template is a version that's backwards compatible within its major version.
   */
  createServiceTemplateVersion(params: Proton.Types.CreateServiceTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.CreateServiceTemplateVersionOutput) => void): Request<Proton.Types.CreateServiceTemplateVersionOutput, AWSError>;
  /**
   * Create a new major or minor version of a service template. A major version of a service template is a version that isn't backwards compatible. A minor version of a service template is a version that's backwards compatible within its major version.
   */
  createServiceTemplateVersion(callback?: (err: AWSError, data: Proton.Types.CreateServiceTemplateVersionOutput) => void): Request<Proton.Types.CreateServiceTemplateVersionOutput, AWSError>;
  /**
   * Delete an environment.
   */
  deleteEnvironment(params: Proton.Types.DeleteEnvironmentInput, callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentOutput) => void): Request<Proton.Types.DeleteEnvironmentOutput, AWSError>;
  /**
   * Delete an environment.
   */
  deleteEnvironment(callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentOutput) => void): Request<Proton.Types.DeleteEnvironmentOutput, AWSError>;
  /**
   * In an environment account, delete an environment account connection. After you delete an environment account connection that’s in use by an AWS Proton environment, AWS Proton can’t manage the environment infrastructure resources until a new environment account connection is accepted for the environment account and associated environment. You're responsible for cleaning up provisioned resources that remain without an environment connection. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  deleteEnvironmentAccountConnection(params: Proton.Types.DeleteEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.DeleteEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * In an environment account, delete an environment account connection. After you delete an environment account connection that’s in use by an AWS Proton environment, AWS Proton can’t manage the environment infrastructure resources until a new environment account connection is accepted for the environment account and associated environment. You're responsible for cleaning up provisioned resources that remain without an environment connection. For more information, see Environment account connections in the AWS Proton Administrator guide.
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
   * If no other minor versions of an environment template exist, delete a major version of the environment template if it's not the Recommended version. Delete the Recommended version of the environment template if no other major versions or minor versions of the environment template exist. A major version of an environment template is a version that's not backwards compatible. Delete a minor version of an environment template if it isn't the Recommended version. Delete a Recommended minor version of the environment template if no other minor versions of the environment template exist. A minor version of an environment template is a version that's backwards compatible.
   */
  deleteEnvironmentTemplateVersion(params: Proton.Types.DeleteEnvironmentTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.DeleteEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * If no other minor versions of an environment template exist, delete a major version of the environment template if it's not the Recommended version. Delete the Recommended version of the environment template if no other major versions or minor versions of the environment template exist. A major version of an environment template is a version that's not backwards compatible. Delete a minor version of an environment template if it isn't the Recommended version. Delete a Recommended minor version of the environment template if no other minor versions of the environment template exist. A minor version of an environment template is a version that's backwards compatible.
   */
  deleteEnvironmentTemplateVersion(callback?: (err: AWSError, data: Proton.Types.DeleteEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.DeleteEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * Delete a service.
   */
  deleteService(params: Proton.Types.DeleteServiceInput, callback?: (err: AWSError, data: Proton.Types.DeleteServiceOutput) => void): Request<Proton.Types.DeleteServiceOutput, AWSError>;
  /**
   * Delete a service.
   */
  deleteService(callback?: (err: AWSError, data: Proton.Types.DeleteServiceOutput) => void): Request<Proton.Types.DeleteServiceOutput, AWSError>;
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
   * Get detail data for the AWS Proton pipeline service role.
   */
  getAccountSettings(params: Proton.Types.GetAccountSettingsInput, callback?: (err: AWSError, data: Proton.Types.GetAccountSettingsOutput) => void): Request<Proton.Types.GetAccountSettingsOutput, AWSError>;
  /**
   * Get detail data for the AWS Proton pipeline service role.
   */
  getAccountSettings(callback?: (err: AWSError, data: Proton.Types.GetAccountSettingsOutput) => void): Request<Proton.Types.GetAccountSettingsOutput, AWSError>;
  /**
   * Get detail data for an environment.
   */
  getEnvironment(params: Proton.Types.GetEnvironmentInput, callback?: (err: AWSError, data: Proton.Types.GetEnvironmentOutput) => void): Request<Proton.Types.GetEnvironmentOutput, AWSError>;
  /**
   * Get detail data for an environment.
   */
  getEnvironment(callback?: (err: AWSError, data: Proton.Types.GetEnvironmentOutput) => void): Request<Proton.Types.GetEnvironmentOutput, AWSError>;
  /**
   * In an environment account, view the detail data for an environment account connection. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  getEnvironmentAccountConnection(params: Proton.Types.GetEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.GetEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.GetEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * In an environment account, view the detail data for an environment account connection. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  getEnvironmentAccountConnection(callback?: (err: AWSError, data: Proton.Types.GetEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.GetEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Get detail data for an environment template.
   */
  getEnvironmentTemplate(params: Proton.Types.GetEnvironmentTemplateInput, callback?: (err: AWSError, data: Proton.Types.GetEnvironmentTemplateOutput) => void): Request<Proton.Types.GetEnvironmentTemplateOutput, AWSError>;
  /**
   * Get detail data for an environment template.
   */
  getEnvironmentTemplate(callback?: (err: AWSError, data: Proton.Types.GetEnvironmentTemplateOutput) => void): Request<Proton.Types.GetEnvironmentTemplateOutput, AWSError>;
  /**
   * View detail data for a major or minor version of an environment template.
   */
  getEnvironmentTemplateVersion(params: Proton.Types.GetEnvironmentTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.GetEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.GetEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * View detail data for a major or minor version of an environment template.
   */
  getEnvironmentTemplateVersion(callback?: (err: AWSError, data: Proton.Types.GetEnvironmentTemplateVersionOutput) => void): Request<Proton.Types.GetEnvironmentTemplateVersionOutput, AWSError>;
  /**
   * Get detail data for a service.
   */
  getService(params: Proton.Types.GetServiceInput, callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Get detail data for a service.
   */
  getService(callback?: (err: AWSError, data: Proton.Types.GetServiceOutput) => void): Request<Proton.Types.GetServiceOutput, AWSError>;
  /**
   * Get detail data for a service instance. A service instance is an instantiation of service template, which is running in a specific environment.
   */
  getServiceInstance(params: Proton.Types.GetServiceInstanceInput, callback?: (err: AWSError, data: Proton.Types.GetServiceInstanceOutput) => void): Request<Proton.Types.GetServiceInstanceOutput, AWSError>;
  /**
   * Get detail data for a service instance. A service instance is an instantiation of service template, which is running in a specific environment.
   */
  getServiceInstance(callback?: (err: AWSError, data: Proton.Types.GetServiceInstanceOutput) => void): Request<Proton.Types.GetServiceInstanceOutput, AWSError>;
  /**
   * Get detail data for a service template.
   */
  getServiceTemplate(params: Proton.Types.GetServiceTemplateInput, callback?: (err: AWSError, data: Proton.Types.GetServiceTemplateOutput) => void): Request<Proton.Types.GetServiceTemplateOutput, AWSError>;
  /**
   * Get detail data for a service template.
   */
  getServiceTemplate(callback?: (err: AWSError, data: Proton.Types.GetServiceTemplateOutput) => void): Request<Proton.Types.GetServiceTemplateOutput, AWSError>;
  /**
   * View detail data for a major or minor version of a service template.
   */
  getServiceTemplateVersion(params: Proton.Types.GetServiceTemplateVersionInput, callback?: (err: AWSError, data: Proton.Types.GetServiceTemplateVersionOutput) => void): Request<Proton.Types.GetServiceTemplateVersionOutput, AWSError>;
  /**
   * View detail data for a major or minor version of a service template.
   */
  getServiceTemplateVersion(callback?: (err: AWSError, data: Proton.Types.GetServiceTemplateVersionOutput) => void): Request<Proton.Types.GetServiceTemplateVersionOutput, AWSError>;
  /**
   * View a list of environment account connections. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  listEnvironmentAccountConnections(params: Proton.Types.ListEnvironmentAccountConnectionsInput, callback?: (err: AWSError, data: Proton.Types.ListEnvironmentAccountConnectionsOutput) => void): Request<Proton.Types.ListEnvironmentAccountConnectionsOutput, AWSError>;
  /**
   * View a list of environment account connections. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  listEnvironmentAccountConnections(callback?: (err: AWSError, data: Proton.Types.ListEnvironmentAccountConnectionsOutput) => void): Request<Proton.Types.ListEnvironmentAccountConnectionsOutput, AWSError>;
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
   * List service instances with summaries of detail data.
   */
  listServiceInstances(params: Proton.Types.ListServiceInstancesInput, callback?: (err: AWSError, data: Proton.Types.ListServiceInstancesOutput) => void): Request<Proton.Types.ListServiceInstancesOutput, AWSError>;
  /**
   * List service instances with summaries of detail data.
   */
  listServiceInstances(callback?: (err: AWSError, data: Proton.Types.ListServiceInstancesOutput) => void): Request<Proton.Types.ListServiceInstancesOutput, AWSError>;
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
   * List tags for a resource. For more information, see AWS Proton resources and tagging in the AWS Proton Administrator Guide or AWS Proton User Guide.
   */
  listTagsForResource(params: Proton.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: Proton.Types.ListTagsForResourceOutput) => void): Request<Proton.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * List tags for a resource. For more information, see AWS Proton resources and tagging in the AWS Proton Administrator Guide or AWS Proton User Guide.
   */
  listTagsForResource(callback?: (err: AWSError, data: Proton.Types.ListTagsForResourceOutput) => void): Request<Proton.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * In a management account, reject an environment account connection from another environment account. After you reject an environment account connection request, you won’t be able to accept or use the rejected environment account connection. You can’t reject an environment account connection that is connected to an environment. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  rejectEnvironmentAccountConnection(params: Proton.Types.RejectEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.RejectEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.RejectEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * In a management account, reject an environment account connection from another environment account. After you reject an environment account connection request, you won’t be able to accept or use the rejected environment account connection. You can’t reject an environment account connection that is connected to an environment. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  rejectEnvironmentAccountConnection(callback?: (err: AWSError, data: Proton.Types.RejectEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.RejectEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * Tag a resource. For more information, see AWS Proton resources and tagging in the AWS Proton Administrator Guide or AWS Proton User Guide.
   */
  tagResource(params: Proton.Types.TagResourceInput, callback?: (err: AWSError, data: Proton.Types.TagResourceOutput) => void): Request<Proton.Types.TagResourceOutput, AWSError>;
  /**
   * Tag a resource. For more information, see AWS Proton resources and tagging in the AWS Proton Administrator Guide or AWS Proton User Guide.
   */
  tagResource(callback?: (err: AWSError, data: Proton.Types.TagResourceOutput) => void): Request<Proton.Types.TagResourceOutput, AWSError>;
  /**
   * Remove a tag from a resource. For more information, see AWS Proton resources and tagging in the AWS Proton Administrator Guide or AWS Proton User Guide.
   */
  untagResource(params: Proton.Types.UntagResourceInput, callback?: (err: AWSError, data: Proton.Types.UntagResourceOutput) => void): Request<Proton.Types.UntagResourceOutput, AWSError>;
  /**
   * Remove a tag from a resource. For more information, see AWS Proton resources and tagging in the AWS Proton Administrator Guide or AWS Proton User Guide.
   */
  untagResource(callback?: (err: AWSError, data: Proton.Types.UntagResourceOutput) => void): Request<Proton.Types.UntagResourceOutput, AWSError>;
  /**
   * Update the AWS Proton pipeline service account settings.
   */
  updateAccountSettings(params: Proton.Types.UpdateAccountSettingsInput, callback?: (err: AWSError, data: Proton.Types.UpdateAccountSettingsOutput) => void): Request<Proton.Types.UpdateAccountSettingsOutput, AWSError>;
  /**
   * Update the AWS Proton pipeline service account settings.
   */
  updateAccountSettings(callback?: (err: AWSError, data: Proton.Types.UpdateAccountSettingsOutput) => void): Request<Proton.Types.UpdateAccountSettingsOutput, AWSError>;
  /**
   * Update an environment. If the environment is associated with an environment account connection, don't update or include the protonServiceRoleArn parameter to update or connect to an environment account connection.  You can only update to a new environment account connection if it was created in the same environment account that the current environment account connection was created in and is associated with the current environment. If the environment isn't associated with an environment account connection, don't update or include the environmentAccountConnectionId parameter to update or connect to an environment account connection. You can update either the environmentAccountConnectionId or protonServiceRoleArn parameter and value. You can’t update both. There are four modes for updating an environment as described in the following. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the environment is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can also specify a different major version that's higher than the major version in use and a minor version (optional).  
   */
  updateEnvironment(params: Proton.Types.UpdateEnvironmentInput, callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentOutput) => void): Request<Proton.Types.UpdateEnvironmentOutput, AWSError>;
  /**
   * Update an environment. If the environment is associated with an environment account connection, don't update or include the protonServiceRoleArn parameter to update or connect to an environment account connection.  You can only update to a new environment account connection if it was created in the same environment account that the current environment account connection was created in and is associated with the current environment. If the environment isn't associated with an environment account connection, don't update or include the environmentAccountConnectionId parameter to update or connect to an environment account connection. You can update either the environmentAccountConnectionId or protonServiceRoleArn parameter and value. You can’t update both. There are four modes for updating an environment as described in the following. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the environment is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can also specify a different major version that's higher than the major version in use and a minor version (optional).  
   */
  updateEnvironment(callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentOutput) => void): Request<Proton.Types.UpdateEnvironmentOutput, AWSError>;
  /**
   * In an environment account, update an environment account connection to use a new IAM role. For more information, see Environment account connections in the AWS Proton Administrator guide.
   */
  updateEnvironmentAccountConnection(params: Proton.Types.UpdateEnvironmentAccountConnectionInput, callback?: (err: AWSError, data: Proton.Types.UpdateEnvironmentAccountConnectionOutput) => void): Request<Proton.Types.UpdateEnvironmentAccountConnectionOutput, AWSError>;
  /**
   * In an environment account, update an environment account connection to use a new IAM role. For more information, see Environment account connections in the AWS Proton Administrator guide.
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
   * Edit a service description or use a spec to add and delete service instances.  Existing service instances and the service pipeline can't be edited using this API. They can only be deleted.  Use the description parameter to modify the description. Edit the spec parameter to add or delete instances.
   */
  updateService(params: Proton.Types.UpdateServiceInput, callback?: (err: AWSError, data: Proton.Types.UpdateServiceOutput) => void): Request<Proton.Types.UpdateServiceOutput, AWSError>;
  /**
   * Edit a service description or use a spec to add and delete service instances.  Existing service instances and the service pipeline can't be edited using this API. They can only be deleted.  Use the description parameter to modify the description. Edit the spec parameter to add or delete instances.
   */
  updateService(callback?: (err: AWSError, data: Proton.Types.UpdateServiceOutput) => void): Request<Proton.Types.UpdateServiceOutput, AWSError>;
  /**
   * Update a service instance. There are four modes for updating a service instance as described in the following. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the service instance is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the service instance is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the service instance is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can also specify a different major version that is higher than the major version in use and a minor version (optional).  
   */
  updateServiceInstance(params: Proton.Types.UpdateServiceInstanceInput, callback?: (err: AWSError, data: Proton.Types.UpdateServiceInstanceOutput) => void): Request<Proton.Types.UpdateServiceInstanceOutput, AWSError>;
  /**
   * Update a service instance. There are four modes for updating a service instance as described in the following. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the service instance is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the service instance is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the service instance is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can also specify a different major version that is higher than the major version in use and a minor version (optional).  
   */
  updateServiceInstance(callback?: (err: AWSError, data: Proton.Types.UpdateServiceInstanceOutput) => void): Request<Proton.Types.UpdateServiceInstanceOutput, AWSError>;
  /**
   * Update the service pipeline. There are four modes for updating a service pipeline as described in the following. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the service pipeline is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) major and minor version of the current template by default. You can also specify a different major version that is higher than the major version in use and a minor version (optional).  
   */
  updateServicePipeline(params: Proton.Types.UpdateServicePipelineInput, callback?: (err: AWSError, data: Proton.Types.UpdateServicePipelineOutput) => void): Request<Proton.Types.UpdateServicePipelineOutput, AWSError>;
  /**
   * Update the service pipeline. There are four modes for updating a service pipeline as described in the following. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the service pipeline is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) major and minor version of the current template by default. You can also specify a different major version that is higher than the major version in use and a minor version (optional).  
   */
  updateServicePipeline(callback?: (err: AWSError, data: Proton.Types.UpdateServicePipelineOutput) => void): Request<Proton.Types.UpdateServicePipelineOutput, AWSError>;
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
     * The environment account connection data that's returned by AWS Proton.
     */
    environmentAccountConnection: EnvironmentAccountConnection;
  }
  export interface AccountSettings {
    /**
     * The Amazon Resource Name (ARN) of the AWS Proton pipeline service role.
     */
    pipelineServiceRoleArn?: Arn;
  }
  export type Arn = string;
  export type AwsAccountId = string;
  export interface CancelEnvironmentDeploymentInput {
    /**
     * The name of the environment with the deployment to cancel.
     */
    environmentName: ResourceName;
  }
  export interface CancelEnvironmentDeploymentOutput {
    /**
     * The environment summary data that's returned by AWS Proton.
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
     * The service instance summary data that's returned by AWS Proton.
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
     * The service pipeline detail data that's returned by AWS Proton.
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
  export interface CreateEnvironmentAccountConnectionInput {
    /**
     * When included, if two identicial requests are made with the same client token, AWS Proton returns the environment account connection that the first request created.
     */
    clientToken?: ClientToken;
    /**
     * The name of the AWS Proton environment that's created in the associated management account.
     */
    environmentName: ResourceName;
    /**
     * The ID of the management account that accepts or rejects the environment account connection. You create an manage the AWS Proton environment in this account. If the management account accepts the environment account connection, AWS Proton can use the associated IAM role to provision environment infrastructure resources in the associated environment account.
     */
    managementAccountId: AwsAccountId;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that's created in the environment account. AWS Proton uses this role to provision infrastructure resources in the associated environment account.
     */
    roleArn: Arn;
  }
  export interface CreateEnvironmentAccountConnectionOutput {
    /**
     * The environment account connection detail data that's returned by AWS Proton.
     */
    environmentAccountConnection: EnvironmentAccountConnection;
  }
  export interface CreateEnvironmentInput {
    /**
     * A description of the environment that's being created and deployed.
     */
    description?: Description;
    /**
     * The ID of the environment account connection that you provide if you're provisioning your environment infrastructure resources to an environment account. You must include either the environmentAccountConnectionId or protonServiceRoleArn parameter and value. For more information, see Environment account connections in the AWS Proton Administrator guide.
     */
    environmentAccountConnectionId?: EnvironmentAccountConnectionId;
    /**
     * The name of the environment.
     */
    name: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the AWS Proton service role that allows AWS Proton to make calls to other services on your behalf. You must include either the environmentAccountConnectionId or protonServiceRoleArn parameter and value.
     */
    protonServiceRoleArn?: Arn;
    /**
     * A link to a YAML formatted spec file that provides inputs as defined in the environment template bundle schema file. For more information, see Environments in the AWS Proton Administrator Guide.
     */
    spec: SpecContents;
    /**
     * Create tags for your environment. For more information, see AWS Proton resources and tagging in the AWS Proton Administrator Guide or AWS Proton User Guide.
     */
    tags?: TagList;
    /**
     * The ID of the major version of the environment template.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The ID of the minor version of the environment template.
     */
    templateMinorVersion?: TemplateVersionPart;
    /**
     * The name of the environment template. For more information, see Environment Templates in the AWS Proton Administrator Guide.
     */
    templateName: ResourceName;
  }
  export interface CreateEnvironmentOutput {
    /**
     * The environment detail data that's returned by AWS Proton.
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
     * A customer provided encryption key that AWS Proton uses to encrypt data.
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
     * Create tags for your environment template. For more information, see AWS Proton resources and tagging in the AWS Proton Administrator Guide or AWS Proton User Guide.
     */
    tags?: TagList;
  }
  export interface CreateEnvironmentTemplateOutput {
    /**
     * The environment template detail data that's returned by AWS Proton.
     */
    environmentTemplate: EnvironmentTemplate;
  }
  export interface CreateEnvironmentTemplateVersionInput {
    /**
     * When included, if two identicial requests are made with the same client token, AWS Proton returns the environment template version that the first request created.
     */
    clientToken?: ClientToken;
    /**
     * A description of the new version of an environment template.
     */
    description?: Description;
    /**
     * To create a new minor version of the environment template, include a majorVersion. To create a new major and minor version of the environment template, exclude majorVersion.
     */
    majorVersion?: TemplateVersionPart;
    /**
     * An object that includes the template bundle S3 bucket path and name for the new version of an template.
     */
    source: TemplateVersionSourceInput;
    /**
     * Create tags for a new version of an environment template.
     */
    tags?: TagList;
    /**
     * The name of the environment template.
     */
    templateName: ResourceName;
  }
  export interface CreateEnvironmentTemplateVersionOutput {
    /**
     * The environment template detail data that's returned by AWS Proton.
     */
    environmentTemplateVersion: EnvironmentTemplateVersion;
  }
  export interface CreateServiceInput {
    /**
     * The name of the code repository branch that holds the code that's deployed in AWS Proton. Don't include this parameter if your service template doesn't include a service pipeline.
     */
    branchName?: GitBranchName;
    /**
     * A description of the AWS Proton service.
     */
    description?: Description;
    /**
     * The service name.
     */
    name: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the repository connection. For more information, see Set up repository connection in the AWS Proton Administrator Guide and Setting up with AWS Proton in the AWS Proton User Guide. Don't include this parameter if your service template doesn't include a service pipeline.
     */
    repositoryConnectionArn?: Arn;
    /**
     * The ID of the code repository. Don't include this parameter if your service template doesn't include a service pipeline.
     */
    repositoryId?: RepositoryId;
    /**
     * A link to a spec file that provides inputs as defined in the service template bundle schema file. The spec file is in YAML format. Don’t include pipeline inputs in the spec if your service template doesn’t include a service pipeline. For more information, see Create a service in the AWS Proton Administrator Guide and Create a service in the AWS Proton User Guide.
     */
    spec: SpecContents;
    /**
     * Create tags for your service. For more information, see AWS Proton resources and tagging in the AWS Proton Administrator Guide or AWS Proton User Guide.
     */
    tags?: TagList;
    /**
     * The ID of the major version of the service template that was used to create the service.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The ID of the minor version of the service template that was used to create the service.
     */
    templateMinorVersion?: TemplateVersionPart;
    /**
     * The name of the service template that's used to create the service.
     */
    templateName: ResourceName;
  }
  export interface CreateServiceOutput {
    /**
     * The service detail data that's returned by AWS Proton.
     */
    service: Service;
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
     * AWS Proton includes a service pipeline for your service by default. When included, this parameter indicates that an AWS Proton service pipeline won't be included for your service. Once specified, this parameter can't be changed. For more information, see Service template bundles in the AWS Proton Administrator Guide.
     */
    pipelineProvisioning?: Provisioning;
    /**
     * Create tags for your service template. For more information, see AWS Proton resources and tagging in the AWS Proton Administrator Guide or AWS Proton User Guide.
     */
    tags?: TagList;
  }
  export interface CreateServiceTemplateOutput {
    /**
     * The service template detail data that's returned by AWS Proton.
     */
    serviceTemplate: ServiceTemplate;
  }
  export interface CreateServiceTemplateVersionInput {
    /**
     * When included, if two identicial requests are made with the same client token, AWS Proton returns the service template version that the first request created.
     */
    clientToken?: ClientToken;
    /**
     * An array of compatible environment template objects for the new version of a service template.
     */
    compatibleEnvironmentTemplates: CompatibleEnvironmentTemplateInputList;
    /**
     * A description of the new version of a service template.
     */
    description?: Description;
    /**
     * To create a new minor version of the service template, include a majorVersion. To create a new major and minor version of the service template, exclude majorVersion.
     */
    majorVersion?: TemplateVersionPart;
    /**
     * An object that includes the template bundle S3 bucket path and name for the new version of a service template.
     */
    source: TemplateVersionSourceInput;
    /**
     * Create tags for a new version of a service template.
     */
    tags?: TagList;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export interface CreateServiceTemplateVersionOutput {
    /**
     * The service template version summary of detail data that's returned by AWS Proton.
     */
    serviceTemplateVersion: ServiceTemplateVersion;
  }
  export interface DeleteEnvironmentAccountConnectionInput {
    /**
     * The ID of the environment account connection to delete.
     */
    id: EnvironmentAccountConnectionId;
  }
  export interface DeleteEnvironmentAccountConnectionOutput {
    /**
     * The environment account connection detail data that's returned by AWS Proton.
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
     * The environment detail data that's returned by AWS Proton.
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
     * The environment template detail data that's returned by AWS Proton.
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
     * The environment template version detail data that's returned by AWS Proton.
     */
    environmentTemplateVersion?: EnvironmentTemplateVersion;
  }
  export interface DeleteServiceInput {
    /**
     * The name of the service to delete.
     */
    name: ResourceName;
  }
  export interface DeleteServiceOutput {
    /**
     * The service detail data that's returned by AWS Proton.
     */
    service?: Service;
  }
  export interface DeleteServiceTemplateInput {
    /**
     * The name of the service template to delete.
     */
    name: ResourceName;
  }
  export interface DeleteServiceTemplateOutput {
    /**
     * The service template detail data that's returned by AWS Proton.
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
     * The service template version detail data that's returned by AWS Proton.
     */
    serviceTemplateVersion?: ServiceTemplateVersion;
  }
  export type DeploymentStatus = "IN_PROGRESS"|"FAILED"|"SUCCEEDED"|"DELETE_IN_PROGRESS"|"DELETE_FAILED"|"DELETE_COMPLETE"|"CANCELLING"|"CANCELLED"|string;
  export type DeploymentUpdateType = "NONE"|"CURRENT_VERSION"|"MINOR_VERSION"|"MAJOR_VERSION"|string;
  export type Description = string;
  export type DisplayName = string;
  export interface Environment {
    /**
     * The Amazon Resource Name (ARN) of the environment.
     */
    arn: EnvironmentArn;
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
     * The time when a deployment of the environment was last attempted.
     */
    lastDeploymentAttemptedAt: Timestamp;
    /**
     * The time when the environment was last deployed successfully.
     */
    lastDeploymentSucceededAt: Timestamp;
    /**
     * The name of the environment.
     */
    name: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the AWS Proton service role that allows AWS Proton to make calls to other services on your behalf.
     */
    protonServiceRoleArn?: Arn;
    /**
     * When included, indicates that the environment template is for customer provisioned and managed infrastructure.
     */
    provisioning?: Provisioning;
    /**
     * The environment spec.
     */
    spec?: SpecContents;
    /**
     * The ID of the major version of the environment template.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The ID of the minor version of the environment template.
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
  export interface EnvironmentSummary {
    /**
     * The Amazon Resource Name (ARN) of the environment.
     */
    arn: EnvironmentArn;
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
     * The time when a deployment of the environment was last attempted.
     */
    lastDeploymentAttemptedAt: Timestamp;
    /**
     * The time when the environment was last deployed successfully.
     */
    lastDeploymentSucceededAt: Timestamp;
    /**
     * The name of the environment.
     */
    name: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the AWS Proton service role that allows AWS Proton to make calls to other services on your behalf.
     */
    protonServiceRoleArn?: Arn;
    /**
     * When included, indicates that the environment template is for customer provisioned and managed infrastructure.
     */
    provisioning?: Provisioning;
    /**
     * The ID of the major version of the environment template.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The ID of the minor version of the environment template.
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
     * The ID of the recommended version of the environment template.
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
     * The ID of the latest major version that's associated with the version of an environment template.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The ID of the minor version of an environment template.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The ID of the recommended minor version of the environment template.
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
     * The ID of the latest major version that's associated with the version of an environment template.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The ID of the version of an environment template.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The ID of the recommended minor version of the environment template.
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
     * The name of the version of an environment template.
     */
    templateName: ResourceName;
  }
  export type EnvironmentTemplateVersionSummaryList = EnvironmentTemplateVersionSummary[];
  export type FullTemplateVersionNumber = string;
  export interface GetAccountSettingsInput {
  }
  export interface GetAccountSettingsOutput {
    /**
     * The AWS Proton pipeline service role detail data that's returned by AWS Proton.
     */
    accountSettings?: AccountSettings;
  }
  export interface GetEnvironmentAccountConnectionInput {
    /**
     * The ID of the environment account connection.
     */
    id: EnvironmentAccountConnectionId;
  }
  export interface GetEnvironmentAccountConnectionOutput {
    /**
     * The environment account connection detail data that's returned by AWS Proton.
     */
    environmentAccountConnection: EnvironmentAccountConnection;
  }
  export interface GetEnvironmentInput {
    /**
     * The name of the environment that you want to get the detail data for.
     */
    name: ResourceName;
  }
  export interface GetEnvironmentOutput {
    /**
     * The environment detail data that's returned by AWS Proton.
     */
    environment: Environment;
  }
  export interface GetEnvironmentTemplateInput {
    /**
     * The name of the environment template that you want to get the detail data for.
     */
    name: ResourceName;
  }
  export interface GetEnvironmentTemplateOutput {
    /**
     * The environment template detail data that's returned by AWS Proton.
     */
    environmentTemplate: EnvironmentTemplate;
  }
  export interface GetEnvironmentTemplateVersionInput {
    /**
     * To view environment template major version detail data, include majorVersion.
     */
    majorVersion: TemplateVersionPart;
    /**
     * To view environment template minor version detail data, include minorVersion.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The name of the environment template.
     */
    templateName: ResourceName;
  }
  export interface GetEnvironmentTemplateVersionOutput {
    /**
     * The environment template version detail data that's returned by AWS Proton.
     */
    environmentTemplateVersion: EnvironmentTemplateVersion;
  }
  export interface GetServiceInput {
    /**
     * The name of the service that you want to get the detail data for.
     */
    name: ResourceName;
  }
  export interface GetServiceInstanceInput {
    /**
     * The name of a service instance that you want to get the detail data for.
     */
    name: ResourceName;
    /**
     * The name of the service that the service instance belongs to.
     */
    serviceName: ResourceName;
  }
  export interface GetServiceInstanceOutput {
    /**
     * The service instance detail data that's returned by AWS Proton.
     */
    serviceInstance: ServiceInstance;
  }
  export interface GetServiceOutput {
    /**
     * The service detail data that's returned by AWS Proton.
     */
    service?: Service;
  }
  export interface GetServiceTemplateInput {
    /**
     * The name of the service template that you want to get detail data for.
     */
    name: ResourceName;
  }
  export interface GetServiceTemplateOutput {
    /**
     * The service template detail data that's returned by AWS Proton.
     */
    serviceTemplate: ServiceTemplate;
  }
  export interface GetServiceTemplateVersionInput {
    /**
     * To view service template major version detail data, include majorVersion.
     */
    majorVersion: TemplateVersionPart;
    /**
     * To view service template minor version detail data, include minorVersion.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export interface GetServiceTemplateVersionOutput {
    /**
     * The service template version detail data that's returned by AWS Proton.
     */
    serviceTemplateVersion: ServiceTemplateVersion;
  }
  export type GitBranchName = string;
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
     * A token to indicate the location of the next environment account connection in the array of environment account connections, after the list of environment account connections that was previously requested.
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
     * An array of environment account connections with details that's returned by AWS Proton. 
     */
    environmentAccountConnections: EnvironmentAccountConnectionSummaryList;
    /**
     * A token to indicate the location of the next environment account connection in the array of environment account connections, after the current requested list of environment account connections.
     */
    nextToken?: NextToken;
  }
  export interface ListEnvironmentTemplateVersionsInput {
    /**
     * To view a list of minor of versions under a major version of an environment template, include majorVersion. To view a list of major versions of an environment template, exclude majorVersion.
     */
    majorVersion?: TemplateVersionPart;
    /**
     * The maximum number of major or minor versions of an environment template to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token to indicate the location of the next major or minor version in the array of major or minor versions of an environment template, after the list of major or minor versions that was previously requested.
     */
    nextToken?: NextToken;
    /**
     * The name of the environment template.
     */
    templateName: ResourceName;
  }
  export interface ListEnvironmentTemplateVersionsOutput {
    /**
     * A token to indicate the location of the next major or minor version in the array of major or minor versions of an environment template, after the list of major or minor versions that was previously requested.
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
     * A token to indicate the location of the next environment template in the array of environment templates, after the list of environment templates that was previously requested.
     */
    nextToken?: NextToken;
  }
  export interface ListEnvironmentTemplatesOutput {
    /**
     * A token to indicate the location of the next environment template in the array of environment templates, after the current requested list of environment templates.
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
     * A token to indicate the location of the next environment in the array of environments, after the list of environments that was previously requested.
     */
    nextToken?: NextToken;
  }
  export interface ListEnvironmentsOutput {
    /**
     * An array of environment detail data summaries.
     */
    environments: EnvironmentSummaryList;
    /**
     * A token to indicate the location of the next environment in the array of environments, after the current requested list of environments.
     */
    nextToken?: NextToken;
  }
  export interface ListServiceInstancesInput {
    /**
     * The maximum number of service instances to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token to indicate the location of the next service in the array of service instances, after the list of service instances that was previously requested.
     */
    nextToken?: NextToken;
    /**
     * The name of the service that the service instance belongs to.
     */
    serviceName?: ResourceName;
  }
  export interface ListServiceInstancesOutput {
    /**
     * A token to indicate the location of the next service instance in the array of service instances, after the current requested list of service instances.
     */
    nextToken?: NextToken;
    /**
     * An array of service instances with summaries of detail data.
     */
    serviceInstances: ServiceInstanceSummaryList;
  }
  export interface ListServiceTemplateVersionsInput {
    /**
     * To view a list of minor of versions under a major version of a service template, include majorVersion. To view a list of major versions of a service template, exclude majorVersion.
     */
    majorVersion?: TemplateVersionPart;
    /**
     * The maximum number of major or minor versions of a service template to list.
     */
    maxResults?: MaxPageResults;
    /**
     * A token to indicate the location of the next major or minor version in the array of major or minor versions of a service template, after the list of major or minor versions that was previously requested.
     */
    nextToken?: NextToken;
    /**
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export interface ListServiceTemplateVersionsOutput {
    /**
     * A token to indicate the location of the next major or minor version in the array of major or minor versions of a service template, after the list of major or minor versions that was previously requested.
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
     * A token to indicate the location of the next service template in the array of service templates, after the list of service templates previously requested.
     */
    nextToken?: NextToken;
  }
  export interface ListServiceTemplatesOutput {
    /**
     * A token to indicate the location of the next service template in the array of service templates, after the current requested list of service templates.
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
     * A token to indicate the location of the next service in the array of services, after the list of services that was previously requested.
     */
    nextToken?: NextToken;
  }
  export interface ListServicesOutput {
    /**
     * A token to indicate the location of the next service in the array of services, after the current requested list of services.
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
     * A token to indicate the location of the next resource tag in the array of resource tags, after the list of resource tags that was previously requested.
     */
    nextToken?: String;
    /**
     * The Amazon Resource Name (ARN) of the resource for the listed tags.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceOutput {
    /**
     * A token to indicate the location of the next resource tag in the array of resource tags, after the current requested list of resource tags.
     */
    nextToken?: String;
    /**
     * An array of resource tags with detail data.
     */
    tags: TagList;
  }
  export type MaxPageResults = number;
  export type NextToken = string;
  export type Provisioning = "CUSTOMER_MANAGED"|string;
  export interface RejectEnvironmentAccountConnectionInput {
    /**
     * The ID of the environment account connection to reject.
     */
    id: EnvironmentAccountConnectionId;
  }
  export interface RejectEnvironmentAccountConnectionOutput {
    /**
     * The environment connection account detail data that's returned by AWS Proton.
     */
    environmentAccountConnection: EnvironmentAccountConnection;
  }
  export type RepositoryId = string;
  export type ResourceName = string;
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
  export interface Service {
    /**
     * The Amazon Resource Name (ARN) of the service.
     */
    arn: ServiceArn;
    /**
     * The name of the code repository branch that holds the code that's deployed in AWS Proton.
     */
    branchName?: GitBranchName;
    /**
     * The time when the service was created.
     */
    createdAt: Timestamp;
    /**
     * A description of a service.
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
     * The Amazon Resource Name (ARN) of the repository connection. For more information, see Set up a repository connection in the AWS Proton Administrator Guide and Setting up with AWS Proton in the AWS Proton User Guide.
     */
    repositoryConnectionArn?: Arn;
    /**
     * The ID of the code repository.
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
     * A service instance deployment status message.
     */
    deploymentStatusMessage?: StatusMessage;
    /**
     * The name of the environment that the service instance was deployed into.
     */
    environmentName: ResourceName;
    /**
     * The time when a deployment of the service instance was last attempted.
     */
    lastDeploymentAttemptedAt: Timestamp;
    /**
     * The time when the service instance was last deployed successfully.
     */
    lastDeploymentSucceededAt: Timestamp;
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
     * The ID of the major version of the service template that was used to create the service instance.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The ID of the minor version of the service template that was used to create the service instance.
     */
    templateMinorVersion: TemplateVersionPart;
    /**
     * The name of the service template that was used to create the service instance.
     */
    templateName: ResourceName;
  }
  export type ServiceInstanceArn = string;
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
     * The time when a deployment of the service was last attempted.
     */
    lastDeploymentAttemptedAt: Timestamp;
    /**
     * The time when the service was last deployed successfully.
     */
    lastDeploymentSucceededAt: Timestamp;
    /**
     * The name of the service instance.
     */
    name: ResourceName;
    /**
     * The name of the service that the service instance belongs to.
     */
    serviceName: ResourceName;
    /**
     * The ID of the major version of a service template.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The ID of the minor version of a service template.
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
     * The time when a deployment of the service pipeline was last attempted.
     */
    lastDeploymentAttemptedAt: Timestamp;
    /**
     * The time when the service pipeline was last deployed successfully.
     */
    lastDeploymentSucceededAt: Timestamp;
    /**
     * The service spec that was used to create the service pipeline.
     */
    spec?: SpecContents;
    /**
     * The ID of the major version of the service template that was used to create the service pipeline.
     */
    templateMajorVersion: TemplateVersionPart;
    /**
     * The ID of the minor version of the service template that was used to create the service pipeline.
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
     * The ID of the recommended version of the service template.
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
     * The ID of the recommended version of the service template.
     */
    recommendedVersion?: FullTemplateVersionNumber;
  }
  export type ServiceTemplateSummaryList = ServiceTemplateSummary[];
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
     * The ID of the latest major version that's associated with the version of a service template.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The ID of the minor version of a service template.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The ID of the recommended minor version of the service template.
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
     * The ID of the latest major version that's associated with the version of a service template.
     */
    majorVersion: TemplateVersionPart;
    /**
     * The ID of the minor version of a service template.
     */
    minorVersion: TemplateVersionPart;
    /**
     * The ID of the recommended minor version of the service template.
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
  export type SpecContents = string;
  export type StatusMessage = string;
  export type String = string;
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
     * The Amazon Resource Name (ARN) of the resource that the resource tag is applied to.
     */
    resourceArn: Arn;
    /**
     * An array of resource tags to apply to a resource.
     */
    tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export type TagValue = string;
  export type TemplateSchema = string;
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
     * The Amazon Resource Name (ARN) of the resource that the tag is to be removed from.
     */
    resourceArn: Arn;
    /**
     * An array of tag keys indicating the resource tags to be removed from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateAccountSettingsInput {
    /**
     * The Amazon Resource Name (ARN) of the AWS Proton pipeline service role.
     */
    pipelineServiceRoleArn?: Arn;
  }
  export interface UpdateAccountSettingsOutput {
    /**
     * The AWS Proton pipeline service role detail data that's returned by AWS Proton.
     */
    accountSettings: AccountSettings;
  }
  export interface UpdateEnvironmentAccountConnectionInput {
    /**
     * The ID of the environment account connection to update.
     */
    id: EnvironmentAccountConnectionId;
    /**
     * The Amazon Resource Name (ARN) of the IAM service role that is associated with the environment account connection to update.
     */
    roleArn: Arn;
  }
  export interface UpdateEnvironmentAccountConnectionOutput {
    /**
     * The environment account connection detail data that's returned by AWS Proton.
     */
    environmentAccountConnection: EnvironmentAccountConnection;
  }
  export interface UpdateEnvironmentInput {
    /**
     * There are four modes for updating an environment as described in the following. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the environment is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the environment is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can also specify a different major version that is higher than the major version in use and a minor version (optional).  
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
     * The Amazon Resource Name (ARN) of the AWS Proton service role that allows AWS Proton to make API calls to other services your behalf.
     */
    protonServiceRoleArn?: Arn;
    /**
     * The formatted specification that defines the update.
     */
    spec?: SpecContents;
    /**
     * The ID of the major version of the environment to update.
     */
    templateMajorVersion?: TemplateVersionPart;
    /**
     * The ID of the minor version of the environment to update.
     */
    templateMinorVersion?: TemplateVersionPart;
  }
  export interface UpdateEnvironmentOutput {
    /**
     * The environment detail data that's returned by AWS Proton.
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
     * The environment template detail data that's returned by AWS Proton.
     */
    environmentTemplate: EnvironmentTemplate;
  }
  export interface UpdateEnvironmentTemplateVersionInput {
    /**
     * A description of environment template version to update.
     */
    description?: Description;
    /**
     * To update a major version of an environment template, include majorVersion.
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
     * The environment template version detail data that's returned by AWS Proton.
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
     * Lists the service instances to add and the existing service instances to remain. Omit the existing service instances to delete from the list. Don't include edits to the existing service instances or pipeline. For more information, see Edit a service in the AWS Proton Administrator Guide or the AWS Proton User Guide.
     */
    spec?: SpecContents;
  }
  export interface UpdateServiceInstanceInput {
    /**
     * The deployment type. There are four modes for updating a service instance as described in the following. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the service instance is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the service instance is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the service instance is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can also specify a different major version that is higher than the major version in use and a minor version (optional).  
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
     * The service instance summary data returned by AWS Proton.
     */
    serviceInstance: ServiceInstance;
  }
  export interface UpdateServiceOutput {
    /**
     * The service detail data that's returned by AWS Proton.
     */
    service: Service;
  }
  export interface UpdateServicePipelineInput {
    /**
     * The deployment type. There are four modes for updating a service pipeline as described in the following. The deploymentType field defines the mode.     NONE  In this mode, a deployment doesn't occur. Only the requested metadata parameters are updated.     CURRENT_VERSION  In this mode, the service pipeline is deployed and updated with the new spec that you provide. Only requested parameters are updated. Don’t include minor or major version parameters when you use this deployment-type.     MINOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) minor version of the current major version in use, by default. You can also specify a different minor version of the current major version in use.     MAJOR_VERSION  In this mode, the service pipeline is deployed and updated with the published, recommended (latest) major and minor version of the current template, by default. You can also specify a different major version that is higher than the major version in use and a minor version (optional).  
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
     * The pipeline details returned by AWS Proton.
     */
    pipeline: ServicePipeline;
  }
  export interface UpdateServiceTemplateInput {
    /**
     * A description of the service template update.
     */
    description?: Description;
    /**
     * The name of the service template to update as displayed in the developer interface.
     */
    displayName?: DisplayName;
    /**
     * The name of the service template to update.
     */
    name: ResourceName;
  }
  export interface UpdateServiceTemplateOutput {
    /**
     * The service template detail data that's returned by AWS Proton.
     */
    serviceTemplate: ServiceTemplate;
  }
  export interface UpdateServiceTemplateVersionInput {
    /**
     * An array of compatible environment names for a service template major or minor version to update.
     */
    compatibleEnvironmentTemplates?: CompatibleEnvironmentTemplateInputList;
    /**
     * A description of a service template version to update.
     */
    description?: Description;
    /**
     * To update a major version of a service template, include majorVersion.
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
     * The name of the service template.
     */
    templateName: ResourceName;
  }
  export interface UpdateServiceTemplateVersionOutput {
    /**
     * The service template version detail data that's returned by AWS Proton.
     */
    serviceTemplateVersion: ServiceTemplateVersion;
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
