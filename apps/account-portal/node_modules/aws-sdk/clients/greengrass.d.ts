import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Greengrass extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Greengrass.Types.ClientConfiguration)
  config: Config & Greengrass.Types.ClientConfiguration;
  /**
   * Associates a role with a group. Your Greengrass core will use the role to access AWS cloud services. The role's permissions should allow Greengrass core Lambda functions to perform actions against the cloud.
   */
  associateRoleToGroup(params: Greengrass.Types.AssociateRoleToGroupRequest, callback?: (err: AWSError, data: Greengrass.Types.AssociateRoleToGroupResponse) => void): Request<Greengrass.Types.AssociateRoleToGroupResponse, AWSError>;
  /**
   * Associates a role with a group. Your Greengrass core will use the role to access AWS cloud services. The role's permissions should allow Greengrass core Lambda functions to perform actions against the cloud.
   */
  associateRoleToGroup(callback?: (err: AWSError, data: Greengrass.Types.AssociateRoleToGroupResponse) => void): Request<Greengrass.Types.AssociateRoleToGroupResponse, AWSError>;
  /**
   * Associates a role with your account. AWS IoT Greengrass will use the role to access your Lambda functions and AWS IoT resources. This is necessary for deployments to succeed. The role must have at least minimum permissions in the policy ''AWSGreengrassResourceAccessRolePolicy''.
   */
  associateServiceRoleToAccount(params: Greengrass.Types.AssociateServiceRoleToAccountRequest, callback?: (err: AWSError, data: Greengrass.Types.AssociateServiceRoleToAccountResponse) => void): Request<Greengrass.Types.AssociateServiceRoleToAccountResponse, AWSError>;
  /**
   * Associates a role with your account. AWS IoT Greengrass will use the role to access your Lambda functions and AWS IoT resources. This is necessary for deployments to succeed. The role must have at least minimum permissions in the policy ''AWSGreengrassResourceAccessRolePolicy''.
   */
  associateServiceRoleToAccount(callback?: (err: AWSError, data: Greengrass.Types.AssociateServiceRoleToAccountResponse) => void): Request<Greengrass.Types.AssociateServiceRoleToAccountResponse, AWSError>;
  /**
   * Creates a connector definition. You may provide the initial version of the connector definition now or use ''CreateConnectorDefinitionVersion'' at a later time.
   */
  createConnectorDefinition(params: Greengrass.Types.CreateConnectorDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateConnectorDefinitionResponse) => void): Request<Greengrass.Types.CreateConnectorDefinitionResponse, AWSError>;
  /**
   * Creates a connector definition. You may provide the initial version of the connector definition now or use ''CreateConnectorDefinitionVersion'' at a later time.
   */
  createConnectorDefinition(callback?: (err: AWSError, data: Greengrass.Types.CreateConnectorDefinitionResponse) => void): Request<Greengrass.Types.CreateConnectorDefinitionResponse, AWSError>;
  /**
   * Creates a version of a connector definition which has already been defined.
   */
  createConnectorDefinitionVersion(params: Greengrass.Types.CreateConnectorDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateConnectorDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateConnectorDefinitionVersionResponse, AWSError>;
  /**
   * Creates a version of a connector definition which has already been defined.
   */
  createConnectorDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.CreateConnectorDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateConnectorDefinitionVersionResponse, AWSError>;
  /**
   * Creates a core definition. You may provide the initial version of the core definition now or use ''CreateCoreDefinitionVersion'' at a later time. Greengrass groups must each contain exactly one Greengrass core.
   */
  createCoreDefinition(params: Greengrass.Types.CreateCoreDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateCoreDefinitionResponse) => void): Request<Greengrass.Types.CreateCoreDefinitionResponse, AWSError>;
  /**
   * Creates a core definition. You may provide the initial version of the core definition now or use ''CreateCoreDefinitionVersion'' at a later time. Greengrass groups must each contain exactly one Greengrass core.
   */
  createCoreDefinition(callback?: (err: AWSError, data: Greengrass.Types.CreateCoreDefinitionResponse) => void): Request<Greengrass.Types.CreateCoreDefinitionResponse, AWSError>;
  /**
   * Creates a version of a core definition that has already been defined. Greengrass groups must each contain exactly one Greengrass core.
   */
  createCoreDefinitionVersion(params: Greengrass.Types.CreateCoreDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateCoreDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateCoreDefinitionVersionResponse, AWSError>;
  /**
   * Creates a version of a core definition that has already been defined. Greengrass groups must each contain exactly one Greengrass core.
   */
  createCoreDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.CreateCoreDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateCoreDefinitionVersionResponse, AWSError>;
  /**
   * Creates a deployment. ''CreateDeployment'' requests are idempotent with respect to the ''X-Amzn-Client-Token'' token and the request parameters.
   */
  createDeployment(params: Greengrass.Types.CreateDeploymentRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateDeploymentResponse) => void): Request<Greengrass.Types.CreateDeploymentResponse, AWSError>;
  /**
   * Creates a deployment. ''CreateDeployment'' requests are idempotent with respect to the ''X-Amzn-Client-Token'' token and the request parameters.
   */
  createDeployment(callback?: (err: AWSError, data: Greengrass.Types.CreateDeploymentResponse) => void): Request<Greengrass.Types.CreateDeploymentResponse, AWSError>;
  /**
   * Creates a device definition. You may provide the initial version of the device definition now or use ''CreateDeviceDefinitionVersion'' at a later time.
   */
  createDeviceDefinition(params: Greengrass.Types.CreateDeviceDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateDeviceDefinitionResponse) => void): Request<Greengrass.Types.CreateDeviceDefinitionResponse, AWSError>;
  /**
   * Creates a device definition. You may provide the initial version of the device definition now or use ''CreateDeviceDefinitionVersion'' at a later time.
   */
  createDeviceDefinition(callback?: (err: AWSError, data: Greengrass.Types.CreateDeviceDefinitionResponse) => void): Request<Greengrass.Types.CreateDeviceDefinitionResponse, AWSError>;
  /**
   * Creates a version of a device definition that has already been defined.
   */
  createDeviceDefinitionVersion(params: Greengrass.Types.CreateDeviceDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateDeviceDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateDeviceDefinitionVersionResponse, AWSError>;
  /**
   * Creates a version of a device definition that has already been defined.
   */
  createDeviceDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.CreateDeviceDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateDeviceDefinitionVersionResponse, AWSError>;
  /**
   * Creates a Lambda function definition which contains a list of Lambda functions and their configurations to be used in a group. You can create an initial version of the definition by providing a list of Lambda functions and their configurations now, or use ''CreateFunctionDefinitionVersion'' later.
   */
  createFunctionDefinition(params: Greengrass.Types.CreateFunctionDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateFunctionDefinitionResponse) => void): Request<Greengrass.Types.CreateFunctionDefinitionResponse, AWSError>;
  /**
   * Creates a Lambda function definition which contains a list of Lambda functions and their configurations to be used in a group. You can create an initial version of the definition by providing a list of Lambda functions and their configurations now, or use ''CreateFunctionDefinitionVersion'' later.
   */
  createFunctionDefinition(callback?: (err: AWSError, data: Greengrass.Types.CreateFunctionDefinitionResponse) => void): Request<Greengrass.Types.CreateFunctionDefinitionResponse, AWSError>;
  /**
   * Creates a version of a Lambda function definition that has already been defined.
   */
  createFunctionDefinitionVersion(params: Greengrass.Types.CreateFunctionDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateFunctionDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateFunctionDefinitionVersionResponse, AWSError>;
  /**
   * Creates a version of a Lambda function definition that has already been defined.
   */
  createFunctionDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.CreateFunctionDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateFunctionDefinitionVersionResponse, AWSError>;
  /**
   * Creates a group. You may provide the initial version of the group or use ''CreateGroupVersion'' at a later time. Tip: You can use the ''gg_group_setup'' package (https://github.com/awslabs/aws-greengrass-group-setup) as a library or command-line application to create and deploy Greengrass groups.
   */
  createGroup(params: Greengrass.Types.CreateGroupRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateGroupResponse) => void): Request<Greengrass.Types.CreateGroupResponse, AWSError>;
  /**
   * Creates a group. You may provide the initial version of the group or use ''CreateGroupVersion'' at a later time. Tip: You can use the ''gg_group_setup'' package (https://github.com/awslabs/aws-greengrass-group-setup) as a library or command-line application to create and deploy Greengrass groups.
   */
  createGroup(callback?: (err: AWSError, data: Greengrass.Types.CreateGroupResponse) => void): Request<Greengrass.Types.CreateGroupResponse, AWSError>;
  /**
   * Creates a CA for the group. If a CA already exists, it will rotate the existing CA.
   */
  createGroupCertificateAuthority(params: Greengrass.Types.CreateGroupCertificateAuthorityRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateGroupCertificateAuthorityResponse) => void): Request<Greengrass.Types.CreateGroupCertificateAuthorityResponse, AWSError>;
  /**
   * Creates a CA for the group. If a CA already exists, it will rotate the existing CA.
   */
  createGroupCertificateAuthority(callback?: (err: AWSError, data: Greengrass.Types.CreateGroupCertificateAuthorityResponse) => void): Request<Greengrass.Types.CreateGroupCertificateAuthorityResponse, AWSError>;
  /**
   * Creates a version of a group which has already been defined.
   */
  createGroupVersion(params: Greengrass.Types.CreateGroupVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateGroupVersionResponse) => void): Request<Greengrass.Types.CreateGroupVersionResponse, AWSError>;
  /**
   * Creates a version of a group which has already been defined.
   */
  createGroupVersion(callback?: (err: AWSError, data: Greengrass.Types.CreateGroupVersionResponse) => void): Request<Greengrass.Types.CreateGroupVersionResponse, AWSError>;
  /**
   * Creates a logger definition. You may provide the initial version of the logger definition now or use ''CreateLoggerDefinitionVersion'' at a later time.
   */
  createLoggerDefinition(params: Greengrass.Types.CreateLoggerDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateLoggerDefinitionResponse) => void): Request<Greengrass.Types.CreateLoggerDefinitionResponse, AWSError>;
  /**
   * Creates a logger definition. You may provide the initial version of the logger definition now or use ''CreateLoggerDefinitionVersion'' at a later time.
   */
  createLoggerDefinition(callback?: (err: AWSError, data: Greengrass.Types.CreateLoggerDefinitionResponse) => void): Request<Greengrass.Types.CreateLoggerDefinitionResponse, AWSError>;
  /**
   * Creates a version of a logger definition that has already been defined.
   */
  createLoggerDefinitionVersion(params: Greengrass.Types.CreateLoggerDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateLoggerDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateLoggerDefinitionVersionResponse, AWSError>;
  /**
   * Creates a version of a logger definition that has already been defined.
   */
  createLoggerDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.CreateLoggerDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateLoggerDefinitionVersionResponse, AWSError>;
  /**
   * Creates a resource definition which contains a list of resources to be used in a group. You can create an initial version of the definition by providing a list of resources now, or use ''CreateResourceDefinitionVersion'' later.
   */
  createResourceDefinition(params: Greengrass.Types.CreateResourceDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateResourceDefinitionResponse) => void): Request<Greengrass.Types.CreateResourceDefinitionResponse, AWSError>;
  /**
   * Creates a resource definition which contains a list of resources to be used in a group. You can create an initial version of the definition by providing a list of resources now, or use ''CreateResourceDefinitionVersion'' later.
   */
  createResourceDefinition(callback?: (err: AWSError, data: Greengrass.Types.CreateResourceDefinitionResponse) => void): Request<Greengrass.Types.CreateResourceDefinitionResponse, AWSError>;
  /**
   * Creates a version of a resource definition that has already been defined.
   */
  createResourceDefinitionVersion(params: Greengrass.Types.CreateResourceDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateResourceDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateResourceDefinitionVersionResponse, AWSError>;
  /**
   * Creates a version of a resource definition that has already been defined.
   */
  createResourceDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.CreateResourceDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateResourceDefinitionVersionResponse, AWSError>;
  /**
   * Creates a software update for a core or group of cores (specified as an IoT thing group.) Use this to update the OTA Agent as well as the Greengrass core software. It makes use of the IoT Jobs feature which provides additional commands to manage a Greengrass core software update job.
   */
  createSoftwareUpdateJob(params: Greengrass.Types.CreateSoftwareUpdateJobRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateSoftwareUpdateJobResponse) => void): Request<Greengrass.Types.CreateSoftwareUpdateJobResponse, AWSError>;
  /**
   * Creates a software update for a core or group of cores (specified as an IoT thing group.) Use this to update the OTA Agent as well as the Greengrass core software. It makes use of the IoT Jobs feature which provides additional commands to manage a Greengrass core software update job.
   */
  createSoftwareUpdateJob(callback?: (err: AWSError, data: Greengrass.Types.CreateSoftwareUpdateJobResponse) => void): Request<Greengrass.Types.CreateSoftwareUpdateJobResponse, AWSError>;
  /**
   * Creates a subscription definition. You may provide the initial version of the subscription definition now or use ''CreateSubscriptionDefinitionVersion'' at a later time.
   */
  createSubscriptionDefinition(params: Greengrass.Types.CreateSubscriptionDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateSubscriptionDefinitionResponse) => void): Request<Greengrass.Types.CreateSubscriptionDefinitionResponse, AWSError>;
  /**
   * Creates a subscription definition. You may provide the initial version of the subscription definition now or use ''CreateSubscriptionDefinitionVersion'' at a later time.
   */
  createSubscriptionDefinition(callback?: (err: AWSError, data: Greengrass.Types.CreateSubscriptionDefinitionResponse) => void): Request<Greengrass.Types.CreateSubscriptionDefinitionResponse, AWSError>;
  /**
   * Creates a version of a subscription definition which has already been defined.
   */
  createSubscriptionDefinitionVersion(params: Greengrass.Types.CreateSubscriptionDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.CreateSubscriptionDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateSubscriptionDefinitionVersionResponse, AWSError>;
  /**
   * Creates a version of a subscription definition which has already been defined.
   */
  createSubscriptionDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.CreateSubscriptionDefinitionVersionResponse) => void): Request<Greengrass.Types.CreateSubscriptionDefinitionVersionResponse, AWSError>;
  /**
   * Deletes a connector definition.
   */
  deleteConnectorDefinition(params: Greengrass.Types.DeleteConnectorDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.DeleteConnectorDefinitionResponse) => void): Request<Greengrass.Types.DeleteConnectorDefinitionResponse, AWSError>;
  /**
   * Deletes a connector definition.
   */
  deleteConnectorDefinition(callback?: (err: AWSError, data: Greengrass.Types.DeleteConnectorDefinitionResponse) => void): Request<Greengrass.Types.DeleteConnectorDefinitionResponse, AWSError>;
  /**
   * Deletes a core definition.
   */
  deleteCoreDefinition(params: Greengrass.Types.DeleteCoreDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.DeleteCoreDefinitionResponse) => void): Request<Greengrass.Types.DeleteCoreDefinitionResponse, AWSError>;
  /**
   * Deletes a core definition.
   */
  deleteCoreDefinition(callback?: (err: AWSError, data: Greengrass.Types.DeleteCoreDefinitionResponse) => void): Request<Greengrass.Types.DeleteCoreDefinitionResponse, AWSError>;
  /**
   * Deletes a device definition.
   */
  deleteDeviceDefinition(params: Greengrass.Types.DeleteDeviceDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.DeleteDeviceDefinitionResponse) => void): Request<Greengrass.Types.DeleteDeviceDefinitionResponse, AWSError>;
  /**
   * Deletes a device definition.
   */
  deleteDeviceDefinition(callback?: (err: AWSError, data: Greengrass.Types.DeleteDeviceDefinitionResponse) => void): Request<Greengrass.Types.DeleteDeviceDefinitionResponse, AWSError>;
  /**
   * Deletes a Lambda function definition.
   */
  deleteFunctionDefinition(params: Greengrass.Types.DeleteFunctionDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.DeleteFunctionDefinitionResponse) => void): Request<Greengrass.Types.DeleteFunctionDefinitionResponse, AWSError>;
  /**
   * Deletes a Lambda function definition.
   */
  deleteFunctionDefinition(callback?: (err: AWSError, data: Greengrass.Types.DeleteFunctionDefinitionResponse) => void): Request<Greengrass.Types.DeleteFunctionDefinitionResponse, AWSError>;
  /**
   * Deletes a group.
   */
  deleteGroup(params: Greengrass.Types.DeleteGroupRequest, callback?: (err: AWSError, data: Greengrass.Types.DeleteGroupResponse) => void): Request<Greengrass.Types.DeleteGroupResponse, AWSError>;
  /**
   * Deletes a group.
   */
  deleteGroup(callback?: (err: AWSError, data: Greengrass.Types.DeleteGroupResponse) => void): Request<Greengrass.Types.DeleteGroupResponse, AWSError>;
  /**
   * Deletes a logger definition.
   */
  deleteLoggerDefinition(params: Greengrass.Types.DeleteLoggerDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.DeleteLoggerDefinitionResponse) => void): Request<Greengrass.Types.DeleteLoggerDefinitionResponse, AWSError>;
  /**
   * Deletes a logger definition.
   */
  deleteLoggerDefinition(callback?: (err: AWSError, data: Greengrass.Types.DeleteLoggerDefinitionResponse) => void): Request<Greengrass.Types.DeleteLoggerDefinitionResponse, AWSError>;
  /**
   * Deletes a resource definition.
   */
  deleteResourceDefinition(params: Greengrass.Types.DeleteResourceDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.DeleteResourceDefinitionResponse) => void): Request<Greengrass.Types.DeleteResourceDefinitionResponse, AWSError>;
  /**
   * Deletes a resource definition.
   */
  deleteResourceDefinition(callback?: (err: AWSError, data: Greengrass.Types.DeleteResourceDefinitionResponse) => void): Request<Greengrass.Types.DeleteResourceDefinitionResponse, AWSError>;
  /**
   * Deletes a subscription definition.
   */
  deleteSubscriptionDefinition(params: Greengrass.Types.DeleteSubscriptionDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.DeleteSubscriptionDefinitionResponse) => void): Request<Greengrass.Types.DeleteSubscriptionDefinitionResponse, AWSError>;
  /**
   * Deletes a subscription definition.
   */
  deleteSubscriptionDefinition(callback?: (err: AWSError, data: Greengrass.Types.DeleteSubscriptionDefinitionResponse) => void): Request<Greengrass.Types.DeleteSubscriptionDefinitionResponse, AWSError>;
  /**
   * Disassociates the role from a group.
   */
  disassociateRoleFromGroup(params: Greengrass.Types.DisassociateRoleFromGroupRequest, callback?: (err: AWSError, data: Greengrass.Types.DisassociateRoleFromGroupResponse) => void): Request<Greengrass.Types.DisassociateRoleFromGroupResponse, AWSError>;
  /**
   * Disassociates the role from a group.
   */
  disassociateRoleFromGroup(callback?: (err: AWSError, data: Greengrass.Types.DisassociateRoleFromGroupResponse) => void): Request<Greengrass.Types.DisassociateRoleFromGroupResponse, AWSError>;
  /**
   * Disassociates the service role from your account. Without a service role, deployments will not work.
   */
  disassociateServiceRoleFromAccount(params: Greengrass.Types.DisassociateServiceRoleFromAccountRequest, callback?: (err: AWSError, data: Greengrass.Types.DisassociateServiceRoleFromAccountResponse) => void): Request<Greengrass.Types.DisassociateServiceRoleFromAccountResponse, AWSError>;
  /**
   * Disassociates the service role from your account. Without a service role, deployments will not work.
   */
  disassociateServiceRoleFromAccount(callback?: (err: AWSError, data: Greengrass.Types.DisassociateServiceRoleFromAccountResponse) => void): Request<Greengrass.Types.DisassociateServiceRoleFromAccountResponse, AWSError>;
  /**
   * Retrieves the role associated with a particular group.
   */
  getAssociatedRole(params: Greengrass.Types.GetAssociatedRoleRequest, callback?: (err: AWSError, data: Greengrass.Types.GetAssociatedRoleResponse) => void): Request<Greengrass.Types.GetAssociatedRoleResponse, AWSError>;
  /**
   * Retrieves the role associated with a particular group.
   */
  getAssociatedRole(callback?: (err: AWSError, data: Greengrass.Types.GetAssociatedRoleResponse) => void): Request<Greengrass.Types.GetAssociatedRoleResponse, AWSError>;
  /**
   * Returns the status of a bulk deployment.
   */
  getBulkDeploymentStatus(params: Greengrass.Types.GetBulkDeploymentStatusRequest, callback?: (err: AWSError, data: Greengrass.Types.GetBulkDeploymentStatusResponse) => void): Request<Greengrass.Types.GetBulkDeploymentStatusResponse, AWSError>;
  /**
   * Returns the status of a bulk deployment.
   */
  getBulkDeploymentStatus(callback?: (err: AWSError, data: Greengrass.Types.GetBulkDeploymentStatusResponse) => void): Request<Greengrass.Types.GetBulkDeploymentStatusResponse, AWSError>;
  /**
   * Retrieves the connectivity information for a core.
   */
  getConnectivityInfo(params: Greengrass.Types.GetConnectivityInfoRequest, callback?: (err: AWSError, data: Greengrass.Types.GetConnectivityInfoResponse) => void): Request<Greengrass.Types.GetConnectivityInfoResponse, AWSError>;
  /**
   * Retrieves the connectivity information for a core.
   */
  getConnectivityInfo(callback?: (err: AWSError, data: Greengrass.Types.GetConnectivityInfoResponse) => void): Request<Greengrass.Types.GetConnectivityInfoResponse, AWSError>;
  /**
   * Retrieves information about a connector definition.
   */
  getConnectorDefinition(params: Greengrass.Types.GetConnectorDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetConnectorDefinitionResponse) => void): Request<Greengrass.Types.GetConnectorDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a connector definition.
   */
  getConnectorDefinition(callback?: (err: AWSError, data: Greengrass.Types.GetConnectorDefinitionResponse) => void): Request<Greengrass.Types.GetConnectorDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a connector definition version, including the connectors that the version contains. Connectors are prebuilt modules that interact with local infrastructure, device protocols, AWS, and other cloud services.
   */
  getConnectorDefinitionVersion(params: Greengrass.Types.GetConnectorDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetConnectorDefinitionVersionResponse) => void): Request<Greengrass.Types.GetConnectorDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a connector definition version, including the connectors that the version contains. Connectors are prebuilt modules that interact with local infrastructure, device protocols, AWS, and other cloud services.
   */
  getConnectorDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.GetConnectorDefinitionVersionResponse) => void): Request<Greengrass.Types.GetConnectorDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a core definition version.
   */
  getCoreDefinition(params: Greengrass.Types.GetCoreDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetCoreDefinitionResponse) => void): Request<Greengrass.Types.GetCoreDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a core definition version.
   */
  getCoreDefinition(callback?: (err: AWSError, data: Greengrass.Types.GetCoreDefinitionResponse) => void): Request<Greengrass.Types.GetCoreDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a core definition version.
   */
  getCoreDefinitionVersion(params: Greengrass.Types.GetCoreDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetCoreDefinitionVersionResponse) => void): Request<Greengrass.Types.GetCoreDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a core definition version.
   */
  getCoreDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.GetCoreDefinitionVersionResponse) => void): Request<Greengrass.Types.GetCoreDefinitionVersionResponse, AWSError>;
  /**
   * Returns the status of a deployment.
   */
  getDeploymentStatus(params: Greengrass.Types.GetDeploymentStatusRequest, callback?: (err: AWSError, data: Greengrass.Types.GetDeploymentStatusResponse) => void): Request<Greengrass.Types.GetDeploymentStatusResponse, AWSError>;
  /**
   * Returns the status of a deployment.
   */
  getDeploymentStatus(callback?: (err: AWSError, data: Greengrass.Types.GetDeploymentStatusResponse) => void): Request<Greengrass.Types.GetDeploymentStatusResponse, AWSError>;
  /**
   * Retrieves information about a device definition.
   */
  getDeviceDefinition(params: Greengrass.Types.GetDeviceDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetDeviceDefinitionResponse) => void): Request<Greengrass.Types.GetDeviceDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a device definition.
   */
  getDeviceDefinition(callback?: (err: AWSError, data: Greengrass.Types.GetDeviceDefinitionResponse) => void): Request<Greengrass.Types.GetDeviceDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a device definition version.
   */
  getDeviceDefinitionVersion(params: Greengrass.Types.GetDeviceDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetDeviceDefinitionVersionResponse) => void): Request<Greengrass.Types.GetDeviceDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a device definition version.
   */
  getDeviceDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.GetDeviceDefinitionVersionResponse) => void): Request<Greengrass.Types.GetDeviceDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a Lambda function definition, including its creation time and latest version.
   */
  getFunctionDefinition(params: Greengrass.Types.GetFunctionDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetFunctionDefinitionResponse) => void): Request<Greengrass.Types.GetFunctionDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a Lambda function definition, including its creation time and latest version.
   */
  getFunctionDefinition(callback?: (err: AWSError, data: Greengrass.Types.GetFunctionDefinitionResponse) => void): Request<Greengrass.Types.GetFunctionDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a Lambda function definition version, including which Lambda functions are included in the version and their configurations.
   */
  getFunctionDefinitionVersion(params: Greengrass.Types.GetFunctionDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetFunctionDefinitionVersionResponse) => void): Request<Greengrass.Types.GetFunctionDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a Lambda function definition version, including which Lambda functions are included in the version and their configurations.
   */
  getFunctionDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.GetFunctionDefinitionVersionResponse) => void): Request<Greengrass.Types.GetFunctionDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a group.
   */
  getGroup(params: Greengrass.Types.GetGroupRequest, callback?: (err: AWSError, data: Greengrass.Types.GetGroupResponse) => void): Request<Greengrass.Types.GetGroupResponse, AWSError>;
  /**
   * Retrieves information about a group.
   */
  getGroup(callback?: (err: AWSError, data: Greengrass.Types.GetGroupResponse) => void): Request<Greengrass.Types.GetGroupResponse, AWSError>;
  /**
   * Retreives the CA associated with a group. Returns the public key of the CA.
   */
  getGroupCertificateAuthority(params: Greengrass.Types.GetGroupCertificateAuthorityRequest, callback?: (err: AWSError, data: Greengrass.Types.GetGroupCertificateAuthorityResponse) => void): Request<Greengrass.Types.GetGroupCertificateAuthorityResponse, AWSError>;
  /**
   * Retreives the CA associated with a group. Returns the public key of the CA.
   */
  getGroupCertificateAuthority(callback?: (err: AWSError, data: Greengrass.Types.GetGroupCertificateAuthorityResponse) => void): Request<Greengrass.Types.GetGroupCertificateAuthorityResponse, AWSError>;
  /**
   * Retrieves the current configuration for the CA used by the group.
   */
  getGroupCertificateConfiguration(params: Greengrass.Types.GetGroupCertificateConfigurationRequest, callback?: (err: AWSError, data: Greengrass.Types.GetGroupCertificateConfigurationResponse) => void): Request<Greengrass.Types.GetGroupCertificateConfigurationResponse, AWSError>;
  /**
   * Retrieves the current configuration for the CA used by the group.
   */
  getGroupCertificateConfiguration(callback?: (err: AWSError, data: Greengrass.Types.GetGroupCertificateConfigurationResponse) => void): Request<Greengrass.Types.GetGroupCertificateConfigurationResponse, AWSError>;
  /**
   * Retrieves information about a group version.
   */
  getGroupVersion(params: Greengrass.Types.GetGroupVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetGroupVersionResponse) => void): Request<Greengrass.Types.GetGroupVersionResponse, AWSError>;
  /**
   * Retrieves information about a group version.
   */
  getGroupVersion(callback?: (err: AWSError, data: Greengrass.Types.GetGroupVersionResponse) => void): Request<Greengrass.Types.GetGroupVersionResponse, AWSError>;
  /**
   * Retrieves information about a logger definition.
   */
  getLoggerDefinition(params: Greengrass.Types.GetLoggerDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetLoggerDefinitionResponse) => void): Request<Greengrass.Types.GetLoggerDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a logger definition.
   */
  getLoggerDefinition(callback?: (err: AWSError, data: Greengrass.Types.GetLoggerDefinitionResponse) => void): Request<Greengrass.Types.GetLoggerDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a logger definition version.
   */
  getLoggerDefinitionVersion(params: Greengrass.Types.GetLoggerDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetLoggerDefinitionVersionResponse) => void): Request<Greengrass.Types.GetLoggerDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a logger definition version.
   */
  getLoggerDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.GetLoggerDefinitionVersionResponse) => void): Request<Greengrass.Types.GetLoggerDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a resource definition, including its creation time and latest version.
   */
  getResourceDefinition(params: Greengrass.Types.GetResourceDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetResourceDefinitionResponse) => void): Request<Greengrass.Types.GetResourceDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a resource definition, including its creation time and latest version.
   */
  getResourceDefinition(callback?: (err: AWSError, data: Greengrass.Types.GetResourceDefinitionResponse) => void): Request<Greengrass.Types.GetResourceDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a resource definition version, including which resources are included in the version.
   */
  getResourceDefinitionVersion(params: Greengrass.Types.GetResourceDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetResourceDefinitionVersionResponse) => void): Request<Greengrass.Types.GetResourceDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a resource definition version, including which resources are included in the version.
   */
  getResourceDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.GetResourceDefinitionVersionResponse) => void): Request<Greengrass.Types.GetResourceDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves the service role that is attached to your account.
   */
  getServiceRoleForAccount(params: Greengrass.Types.GetServiceRoleForAccountRequest, callback?: (err: AWSError, data: Greengrass.Types.GetServiceRoleForAccountResponse) => void): Request<Greengrass.Types.GetServiceRoleForAccountResponse, AWSError>;
  /**
   * Retrieves the service role that is attached to your account.
   */
  getServiceRoleForAccount(callback?: (err: AWSError, data: Greengrass.Types.GetServiceRoleForAccountResponse) => void): Request<Greengrass.Types.GetServiceRoleForAccountResponse, AWSError>;
  /**
   * Retrieves information about a subscription definition.
   */
  getSubscriptionDefinition(params: Greengrass.Types.GetSubscriptionDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetSubscriptionDefinitionResponse) => void): Request<Greengrass.Types.GetSubscriptionDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a subscription definition.
   */
  getSubscriptionDefinition(callback?: (err: AWSError, data: Greengrass.Types.GetSubscriptionDefinitionResponse) => void): Request<Greengrass.Types.GetSubscriptionDefinitionResponse, AWSError>;
  /**
   * Retrieves information about a subscription definition version.
   */
  getSubscriptionDefinitionVersion(params: Greengrass.Types.GetSubscriptionDefinitionVersionRequest, callback?: (err: AWSError, data: Greengrass.Types.GetSubscriptionDefinitionVersionResponse) => void): Request<Greengrass.Types.GetSubscriptionDefinitionVersionResponse, AWSError>;
  /**
   * Retrieves information about a subscription definition version.
   */
  getSubscriptionDefinitionVersion(callback?: (err: AWSError, data: Greengrass.Types.GetSubscriptionDefinitionVersionResponse) => void): Request<Greengrass.Types.GetSubscriptionDefinitionVersionResponse, AWSError>;
  /**
   * Get the runtime configuration of a thing.
   */
  getThingRuntimeConfiguration(params: Greengrass.Types.GetThingRuntimeConfigurationRequest, callback?: (err: AWSError, data: Greengrass.Types.GetThingRuntimeConfigurationResponse) => void): Request<Greengrass.Types.GetThingRuntimeConfigurationResponse, AWSError>;
  /**
   * Get the runtime configuration of a thing.
   */
  getThingRuntimeConfiguration(callback?: (err: AWSError, data: Greengrass.Types.GetThingRuntimeConfigurationResponse) => void): Request<Greengrass.Types.GetThingRuntimeConfigurationResponse, AWSError>;
  /**
   * Gets a paginated list of the deployments that have been started in a bulk deployment operation, and their current deployment status.
   */
  listBulkDeploymentDetailedReports(params: Greengrass.Types.ListBulkDeploymentDetailedReportsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListBulkDeploymentDetailedReportsResponse) => void): Request<Greengrass.Types.ListBulkDeploymentDetailedReportsResponse, AWSError>;
  /**
   * Gets a paginated list of the deployments that have been started in a bulk deployment operation, and their current deployment status.
   */
  listBulkDeploymentDetailedReports(callback?: (err: AWSError, data: Greengrass.Types.ListBulkDeploymentDetailedReportsResponse) => void): Request<Greengrass.Types.ListBulkDeploymentDetailedReportsResponse, AWSError>;
  /**
   * Returns a list of bulk deployments.
   */
  listBulkDeployments(params: Greengrass.Types.ListBulkDeploymentsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListBulkDeploymentsResponse) => void): Request<Greengrass.Types.ListBulkDeploymentsResponse, AWSError>;
  /**
   * Returns a list of bulk deployments.
   */
  listBulkDeployments(callback?: (err: AWSError, data: Greengrass.Types.ListBulkDeploymentsResponse) => void): Request<Greengrass.Types.ListBulkDeploymentsResponse, AWSError>;
  /**
   * Lists the versions of a connector definition, which are containers for connectors. Connectors run on the Greengrass core and contain built-in integration with local infrastructure, device protocols, AWS, and other cloud services.
   */
  listConnectorDefinitionVersions(params: Greengrass.Types.ListConnectorDefinitionVersionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListConnectorDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListConnectorDefinitionVersionsResponse, AWSError>;
  /**
   * Lists the versions of a connector definition, which are containers for connectors. Connectors run on the Greengrass core and contain built-in integration with local infrastructure, device protocols, AWS, and other cloud services.
   */
  listConnectorDefinitionVersions(callback?: (err: AWSError, data: Greengrass.Types.ListConnectorDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListConnectorDefinitionVersionsResponse, AWSError>;
  /**
   * Retrieves a list of connector definitions.
   */
  listConnectorDefinitions(params: Greengrass.Types.ListConnectorDefinitionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListConnectorDefinitionsResponse) => void): Request<Greengrass.Types.ListConnectorDefinitionsResponse, AWSError>;
  /**
   * Retrieves a list of connector definitions.
   */
  listConnectorDefinitions(callback?: (err: AWSError, data: Greengrass.Types.ListConnectorDefinitionsResponse) => void): Request<Greengrass.Types.ListConnectorDefinitionsResponse, AWSError>;
  /**
   * Lists the versions of a core definition.
   */
  listCoreDefinitionVersions(params: Greengrass.Types.ListCoreDefinitionVersionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListCoreDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListCoreDefinitionVersionsResponse, AWSError>;
  /**
   * Lists the versions of a core definition.
   */
  listCoreDefinitionVersions(callback?: (err: AWSError, data: Greengrass.Types.ListCoreDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListCoreDefinitionVersionsResponse, AWSError>;
  /**
   * Retrieves a list of core definitions.
   */
  listCoreDefinitions(params: Greengrass.Types.ListCoreDefinitionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListCoreDefinitionsResponse) => void): Request<Greengrass.Types.ListCoreDefinitionsResponse, AWSError>;
  /**
   * Retrieves a list of core definitions.
   */
  listCoreDefinitions(callback?: (err: AWSError, data: Greengrass.Types.ListCoreDefinitionsResponse) => void): Request<Greengrass.Types.ListCoreDefinitionsResponse, AWSError>;
  /**
   * Returns a history of deployments for the group.
   */
  listDeployments(params: Greengrass.Types.ListDeploymentsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListDeploymentsResponse) => void): Request<Greengrass.Types.ListDeploymentsResponse, AWSError>;
  /**
   * Returns a history of deployments for the group.
   */
  listDeployments(callback?: (err: AWSError, data: Greengrass.Types.ListDeploymentsResponse) => void): Request<Greengrass.Types.ListDeploymentsResponse, AWSError>;
  /**
   * Lists the versions of a device definition.
   */
  listDeviceDefinitionVersions(params: Greengrass.Types.ListDeviceDefinitionVersionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListDeviceDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListDeviceDefinitionVersionsResponse, AWSError>;
  /**
   * Lists the versions of a device definition.
   */
  listDeviceDefinitionVersions(callback?: (err: AWSError, data: Greengrass.Types.ListDeviceDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListDeviceDefinitionVersionsResponse, AWSError>;
  /**
   * Retrieves a list of device definitions.
   */
  listDeviceDefinitions(params: Greengrass.Types.ListDeviceDefinitionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListDeviceDefinitionsResponse) => void): Request<Greengrass.Types.ListDeviceDefinitionsResponse, AWSError>;
  /**
   * Retrieves a list of device definitions.
   */
  listDeviceDefinitions(callback?: (err: AWSError, data: Greengrass.Types.ListDeviceDefinitionsResponse) => void): Request<Greengrass.Types.ListDeviceDefinitionsResponse, AWSError>;
  /**
   * Lists the versions of a Lambda function definition.
   */
  listFunctionDefinitionVersions(params: Greengrass.Types.ListFunctionDefinitionVersionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListFunctionDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListFunctionDefinitionVersionsResponse, AWSError>;
  /**
   * Lists the versions of a Lambda function definition.
   */
  listFunctionDefinitionVersions(callback?: (err: AWSError, data: Greengrass.Types.ListFunctionDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListFunctionDefinitionVersionsResponse, AWSError>;
  /**
   * Retrieves a list of Lambda function definitions.
   */
  listFunctionDefinitions(params: Greengrass.Types.ListFunctionDefinitionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListFunctionDefinitionsResponse) => void): Request<Greengrass.Types.ListFunctionDefinitionsResponse, AWSError>;
  /**
   * Retrieves a list of Lambda function definitions.
   */
  listFunctionDefinitions(callback?: (err: AWSError, data: Greengrass.Types.ListFunctionDefinitionsResponse) => void): Request<Greengrass.Types.ListFunctionDefinitionsResponse, AWSError>;
  /**
   * Retrieves the current CAs for a group.
   */
  listGroupCertificateAuthorities(params: Greengrass.Types.ListGroupCertificateAuthoritiesRequest, callback?: (err: AWSError, data: Greengrass.Types.ListGroupCertificateAuthoritiesResponse) => void): Request<Greengrass.Types.ListGroupCertificateAuthoritiesResponse, AWSError>;
  /**
   * Retrieves the current CAs for a group.
   */
  listGroupCertificateAuthorities(callback?: (err: AWSError, data: Greengrass.Types.ListGroupCertificateAuthoritiesResponse) => void): Request<Greengrass.Types.ListGroupCertificateAuthoritiesResponse, AWSError>;
  /**
   * Lists the versions of a group.
   */
  listGroupVersions(params: Greengrass.Types.ListGroupVersionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListGroupVersionsResponse) => void): Request<Greengrass.Types.ListGroupVersionsResponse, AWSError>;
  /**
   * Lists the versions of a group.
   */
  listGroupVersions(callback?: (err: AWSError, data: Greengrass.Types.ListGroupVersionsResponse) => void): Request<Greengrass.Types.ListGroupVersionsResponse, AWSError>;
  /**
   * Retrieves a list of groups.
   */
  listGroups(params: Greengrass.Types.ListGroupsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListGroupsResponse) => void): Request<Greengrass.Types.ListGroupsResponse, AWSError>;
  /**
   * Retrieves a list of groups.
   */
  listGroups(callback?: (err: AWSError, data: Greengrass.Types.ListGroupsResponse) => void): Request<Greengrass.Types.ListGroupsResponse, AWSError>;
  /**
   * Lists the versions of a logger definition.
   */
  listLoggerDefinitionVersions(params: Greengrass.Types.ListLoggerDefinitionVersionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListLoggerDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListLoggerDefinitionVersionsResponse, AWSError>;
  /**
   * Lists the versions of a logger definition.
   */
  listLoggerDefinitionVersions(callback?: (err: AWSError, data: Greengrass.Types.ListLoggerDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListLoggerDefinitionVersionsResponse, AWSError>;
  /**
   * Retrieves a list of logger definitions.
   */
  listLoggerDefinitions(params: Greengrass.Types.ListLoggerDefinitionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListLoggerDefinitionsResponse) => void): Request<Greengrass.Types.ListLoggerDefinitionsResponse, AWSError>;
  /**
   * Retrieves a list of logger definitions.
   */
  listLoggerDefinitions(callback?: (err: AWSError, data: Greengrass.Types.ListLoggerDefinitionsResponse) => void): Request<Greengrass.Types.ListLoggerDefinitionsResponse, AWSError>;
  /**
   * Lists the versions of a resource definition.
   */
  listResourceDefinitionVersions(params: Greengrass.Types.ListResourceDefinitionVersionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListResourceDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListResourceDefinitionVersionsResponse, AWSError>;
  /**
   * Lists the versions of a resource definition.
   */
  listResourceDefinitionVersions(callback?: (err: AWSError, data: Greengrass.Types.ListResourceDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListResourceDefinitionVersionsResponse, AWSError>;
  /**
   * Retrieves a list of resource definitions.
   */
  listResourceDefinitions(params: Greengrass.Types.ListResourceDefinitionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListResourceDefinitionsResponse) => void): Request<Greengrass.Types.ListResourceDefinitionsResponse, AWSError>;
  /**
   * Retrieves a list of resource definitions.
   */
  listResourceDefinitions(callback?: (err: AWSError, data: Greengrass.Types.ListResourceDefinitionsResponse) => void): Request<Greengrass.Types.ListResourceDefinitionsResponse, AWSError>;
  /**
   * Lists the versions of a subscription definition.
   */
  listSubscriptionDefinitionVersions(params: Greengrass.Types.ListSubscriptionDefinitionVersionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListSubscriptionDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListSubscriptionDefinitionVersionsResponse, AWSError>;
  /**
   * Lists the versions of a subscription definition.
   */
  listSubscriptionDefinitionVersions(callback?: (err: AWSError, data: Greengrass.Types.ListSubscriptionDefinitionVersionsResponse) => void): Request<Greengrass.Types.ListSubscriptionDefinitionVersionsResponse, AWSError>;
  /**
   * Retrieves a list of subscription definitions.
   */
  listSubscriptionDefinitions(params: Greengrass.Types.ListSubscriptionDefinitionsRequest, callback?: (err: AWSError, data: Greengrass.Types.ListSubscriptionDefinitionsResponse) => void): Request<Greengrass.Types.ListSubscriptionDefinitionsResponse, AWSError>;
  /**
   * Retrieves a list of subscription definitions.
   */
  listSubscriptionDefinitions(callback?: (err: AWSError, data: Greengrass.Types.ListSubscriptionDefinitionsResponse) => void): Request<Greengrass.Types.ListSubscriptionDefinitionsResponse, AWSError>;
  /**
   * Retrieves a list of resource tags for a resource arn.
   */
  listTagsForResource(params: Greengrass.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Greengrass.Types.ListTagsForResourceResponse) => void): Request<Greengrass.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves a list of resource tags for a resource arn.
   */
  listTagsForResource(callback?: (err: AWSError, data: Greengrass.Types.ListTagsForResourceResponse) => void): Request<Greengrass.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Resets a group's deployments.
   */
  resetDeployments(params: Greengrass.Types.ResetDeploymentsRequest, callback?: (err: AWSError, data: Greengrass.Types.ResetDeploymentsResponse) => void): Request<Greengrass.Types.ResetDeploymentsResponse, AWSError>;
  /**
   * Resets a group's deployments.
   */
  resetDeployments(callback?: (err: AWSError, data: Greengrass.Types.ResetDeploymentsResponse) => void): Request<Greengrass.Types.ResetDeploymentsResponse, AWSError>;
  /**
   * Deploys multiple groups in one operation. This action starts the bulk deployment of a specified set of group versions. Each group version deployment will be triggered with an adaptive rate that has a fixed upper limit. We recommend that you include an ''X-Amzn-Client-Token'' token in every ''StartBulkDeployment'' request. These requests are idempotent with respect to the token and the request parameters.
   */
  startBulkDeployment(params: Greengrass.Types.StartBulkDeploymentRequest, callback?: (err: AWSError, data: Greengrass.Types.StartBulkDeploymentResponse) => void): Request<Greengrass.Types.StartBulkDeploymentResponse, AWSError>;
  /**
   * Deploys multiple groups in one operation. This action starts the bulk deployment of a specified set of group versions. Each group version deployment will be triggered with an adaptive rate that has a fixed upper limit. We recommend that you include an ''X-Amzn-Client-Token'' token in every ''StartBulkDeployment'' request. These requests are idempotent with respect to the token and the request parameters.
   */
  startBulkDeployment(callback?: (err: AWSError, data: Greengrass.Types.StartBulkDeploymentResponse) => void): Request<Greengrass.Types.StartBulkDeploymentResponse, AWSError>;
  /**
   * Stops the execution of a bulk deployment. This action returns a status of ''Stopping'' until the deployment is stopped. You cannot start a new bulk deployment while a previous deployment is in the ''Stopping'' state. This action doesn't rollback completed deployments or cancel pending deployments.
   */
  stopBulkDeployment(params: Greengrass.Types.StopBulkDeploymentRequest, callback?: (err: AWSError, data: Greengrass.Types.StopBulkDeploymentResponse) => void): Request<Greengrass.Types.StopBulkDeploymentResponse, AWSError>;
  /**
   * Stops the execution of a bulk deployment. This action returns a status of ''Stopping'' until the deployment is stopped. You cannot start a new bulk deployment while a previous deployment is in the ''Stopping'' state. This action doesn't rollback completed deployments or cancel pending deployments.
   */
  stopBulkDeployment(callback?: (err: AWSError, data: Greengrass.Types.StopBulkDeploymentResponse) => void): Request<Greengrass.Types.StopBulkDeploymentResponse, AWSError>;
  /**
   * Adds tags to a Greengrass resource. Valid resources are 'Group', 'ConnectorDefinition', 'CoreDefinition', 'DeviceDefinition', 'FunctionDefinition', 'LoggerDefinition', 'SubscriptionDefinition', 'ResourceDefinition', and 'BulkDeployment'.
   */
  tagResource(params: Greengrass.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds tags to a Greengrass resource. Valid resources are 'Group', 'ConnectorDefinition', 'CoreDefinition', 'DeviceDefinition', 'FunctionDefinition', 'LoggerDefinition', 'SubscriptionDefinition', 'ResourceDefinition', and 'BulkDeployment'.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove resource tags from a Greengrass Resource.
   */
  untagResource(params: Greengrass.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Remove resource tags from a Greengrass Resource.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the connectivity information for the core. Any devices that belong to the group which has this core will receive this information in order to find the location of the core and connect to it.
   */
  updateConnectivityInfo(params: Greengrass.Types.UpdateConnectivityInfoRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateConnectivityInfoResponse) => void): Request<Greengrass.Types.UpdateConnectivityInfoResponse, AWSError>;
  /**
   * Updates the connectivity information for the core. Any devices that belong to the group which has this core will receive this information in order to find the location of the core and connect to it.
   */
  updateConnectivityInfo(callback?: (err: AWSError, data: Greengrass.Types.UpdateConnectivityInfoResponse) => void): Request<Greengrass.Types.UpdateConnectivityInfoResponse, AWSError>;
  /**
   * Updates a connector definition.
   */
  updateConnectorDefinition(params: Greengrass.Types.UpdateConnectorDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateConnectorDefinitionResponse) => void): Request<Greengrass.Types.UpdateConnectorDefinitionResponse, AWSError>;
  /**
   * Updates a connector definition.
   */
  updateConnectorDefinition(callback?: (err: AWSError, data: Greengrass.Types.UpdateConnectorDefinitionResponse) => void): Request<Greengrass.Types.UpdateConnectorDefinitionResponse, AWSError>;
  /**
   * Updates a core definition.
   */
  updateCoreDefinition(params: Greengrass.Types.UpdateCoreDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateCoreDefinitionResponse) => void): Request<Greengrass.Types.UpdateCoreDefinitionResponse, AWSError>;
  /**
   * Updates a core definition.
   */
  updateCoreDefinition(callback?: (err: AWSError, data: Greengrass.Types.UpdateCoreDefinitionResponse) => void): Request<Greengrass.Types.UpdateCoreDefinitionResponse, AWSError>;
  /**
   * Updates a device definition.
   */
  updateDeviceDefinition(params: Greengrass.Types.UpdateDeviceDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateDeviceDefinitionResponse) => void): Request<Greengrass.Types.UpdateDeviceDefinitionResponse, AWSError>;
  /**
   * Updates a device definition.
   */
  updateDeviceDefinition(callback?: (err: AWSError, data: Greengrass.Types.UpdateDeviceDefinitionResponse) => void): Request<Greengrass.Types.UpdateDeviceDefinitionResponse, AWSError>;
  /**
   * Updates a Lambda function definition.
   */
  updateFunctionDefinition(params: Greengrass.Types.UpdateFunctionDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateFunctionDefinitionResponse) => void): Request<Greengrass.Types.UpdateFunctionDefinitionResponse, AWSError>;
  /**
   * Updates a Lambda function definition.
   */
  updateFunctionDefinition(callback?: (err: AWSError, data: Greengrass.Types.UpdateFunctionDefinitionResponse) => void): Request<Greengrass.Types.UpdateFunctionDefinitionResponse, AWSError>;
  /**
   * Updates a group.
   */
  updateGroup(params: Greengrass.Types.UpdateGroupRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateGroupResponse) => void): Request<Greengrass.Types.UpdateGroupResponse, AWSError>;
  /**
   * Updates a group.
   */
  updateGroup(callback?: (err: AWSError, data: Greengrass.Types.UpdateGroupResponse) => void): Request<Greengrass.Types.UpdateGroupResponse, AWSError>;
  /**
   * Updates the Certificate expiry time for a group.
   */
  updateGroupCertificateConfiguration(params: Greengrass.Types.UpdateGroupCertificateConfigurationRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateGroupCertificateConfigurationResponse) => void): Request<Greengrass.Types.UpdateGroupCertificateConfigurationResponse, AWSError>;
  /**
   * Updates the Certificate expiry time for a group.
   */
  updateGroupCertificateConfiguration(callback?: (err: AWSError, data: Greengrass.Types.UpdateGroupCertificateConfigurationResponse) => void): Request<Greengrass.Types.UpdateGroupCertificateConfigurationResponse, AWSError>;
  /**
   * Updates a logger definition.
   */
  updateLoggerDefinition(params: Greengrass.Types.UpdateLoggerDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateLoggerDefinitionResponse) => void): Request<Greengrass.Types.UpdateLoggerDefinitionResponse, AWSError>;
  /**
   * Updates a logger definition.
   */
  updateLoggerDefinition(callback?: (err: AWSError, data: Greengrass.Types.UpdateLoggerDefinitionResponse) => void): Request<Greengrass.Types.UpdateLoggerDefinitionResponse, AWSError>;
  /**
   * Updates a resource definition.
   */
  updateResourceDefinition(params: Greengrass.Types.UpdateResourceDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateResourceDefinitionResponse) => void): Request<Greengrass.Types.UpdateResourceDefinitionResponse, AWSError>;
  /**
   * Updates a resource definition.
   */
  updateResourceDefinition(callback?: (err: AWSError, data: Greengrass.Types.UpdateResourceDefinitionResponse) => void): Request<Greengrass.Types.UpdateResourceDefinitionResponse, AWSError>;
  /**
   * Updates a subscription definition.
   */
  updateSubscriptionDefinition(params: Greengrass.Types.UpdateSubscriptionDefinitionRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateSubscriptionDefinitionResponse) => void): Request<Greengrass.Types.UpdateSubscriptionDefinitionResponse, AWSError>;
  /**
   * Updates a subscription definition.
   */
  updateSubscriptionDefinition(callback?: (err: AWSError, data: Greengrass.Types.UpdateSubscriptionDefinitionResponse) => void): Request<Greengrass.Types.UpdateSubscriptionDefinitionResponse, AWSError>;
  /**
   * Updates the runtime configuration of a thing.
   */
  updateThingRuntimeConfiguration(params: Greengrass.Types.UpdateThingRuntimeConfigurationRequest, callback?: (err: AWSError, data: Greengrass.Types.UpdateThingRuntimeConfigurationResponse) => void): Request<Greengrass.Types.UpdateThingRuntimeConfigurationResponse, AWSError>;
  /**
   * Updates the runtime configuration of a thing.
   */
  updateThingRuntimeConfiguration(callback?: (err: AWSError, data: Greengrass.Types.UpdateThingRuntimeConfigurationResponse) => void): Request<Greengrass.Types.UpdateThingRuntimeConfigurationResponse, AWSError>;
}
declare namespace Greengrass {
  export interface AssociateRoleToGroupRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
    /**
     * The ARN of the role you wish to associate with this group. The existence of the role is not validated.
     */
    RoleArn: __string;
  }
  export interface AssociateRoleToGroupResponse {
    /**
     * The time, in milliseconds since the epoch, when the role ARN was associated with the group.
     */
    AssociatedAt?: __string;
  }
  export interface AssociateServiceRoleToAccountRequest {
    /**
     * The ARN of the service role you wish to associate with your account.
     */
    RoleArn: __string;
  }
  export interface AssociateServiceRoleToAccountResponse {
    /**
     * The time when the service role was associated with the account.
     */
    AssociatedAt?: __string;
  }
  export interface BulkDeployment {
    /**
     * The ARN of the bulk deployment.
     */
    BulkDeploymentArn?: __string;
    /**
     * The ID of the bulk deployment.
     */
    BulkDeploymentId?: __string;
    /**
     * The time, in ISO format, when the deployment was created.
     */
    CreatedAt?: __string;
  }
  export interface BulkDeploymentMetrics {
    /**
     * The total number of records that returned a non-retryable error. For example, this can occur if a group record from the input file uses an invalid format or specifies a nonexistent group version, or if the execution role doesn't grant permission to deploy a group or group version.
     */
    InvalidInputRecords?: __integer;
    /**
     * The total number of group records from the input file that have been processed so far, or attempted.
     */
    RecordsProcessed?: __integer;
    /**
     * The total number of deployment attempts that returned a retryable error. For example, a retry is triggered if the attempt to deploy a group returns a throttling error. ''StartBulkDeployment'' retries a group deployment up to five times.
     */
    RetryAttempts?: __integer;
  }
  export interface BulkDeploymentResult {
    /**
     * The time, in ISO format, when the deployment was created.
     */
    CreatedAt?: __string;
    /**
     * The ARN of the group deployment.
     */
    DeploymentArn?: __string;
    /**
     * The ID of the group deployment.
     */
    DeploymentId?: __string;
    /**
     * The current status of the group deployment: ''InProgress'', ''Building'', ''Success'', or ''Failure''.
     */
    DeploymentStatus?: __string;
    /**
     * The type of the deployment.
     */
    DeploymentType?: DeploymentType;
    /**
     * Details about the error.
     */
    ErrorDetails?: ErrorDetails;
    /**
     * The error message for a failed deployment
     */
    ErrorMessage?: __string;
    /**
     * The ARN of the Greengrass group.
     */
    GroupArn?: __string;
  }
  export type BulkDeploymentResults = BulkDeploymentResult[];
  export type BulkDeploymentStatus = "Initializing"|"Running"|"Completed"|"Stopping"|"Stopped"|"Failed"|string;
  export type BulkDeployments = BulkDeployment[];
  export type ConfigurationSyncStatus = "InSync"|"OutOfSync"|string;
  export interface ConnectivityInfo {
    /**
     * The endpoint for the Greengrass core. Can be an IP address or DNS.
     */
    HostAddress?: __string;
    /**
     * The ID of the connectivity information.
     */
    Id?: __string;
    /**
     * Metadata for this endpoint.
     */
    Metadata?: __string;
    /**
     * The port of the Greengrass core. Usually 8883.
     */
    PortNumber?: __integer;
  }
  export interface Connector {
    /**
     * The ARN of the connector.
     */
    ConnectorArn: __string;
    /**
     * A descriptive or arbitrary ID for the connector. This value must be unique within the connector definition version. Max length is 128 characters with pattern [a-zA-Z0-9:_-]+.
     */
    Id: __string;
    /**
     * The parameters or configuration that the connector uses.
     */
    Parameters?: __mapOf__string;
  }
  export interface ConnectorDefinitionVersion {
    /**
     * A list of references to connectors in this version, with their corresponding configuration settings.
     */
    Connectors?: __listOfConnector;
  }
  export interface Core {
    /**
     * The ARN of the certificate associated with the core.
     */
    CertificateArn: __string;
    /**
     * A descriptive or arbitrary ID for the core. This value must be unique within the core definition version. Max length is 128 characters with pattern ''[a-zA-Z0-9:_-]+''.
     */
    Id: __string;
    /**
     * If true, the core's local shadow is automatically synced with the cloud.
     */
    SyncShadow?: __boolean;
    /**
     * The ARN of the thing which is the core.
     */
    ThingArn: __string;
  }
  export interface CoreDefinitionVersion {
    /**
     * A list of cores in the core definition version.
     */
    Cores?: __listOfCore;
  }
  export interface CreateConnectorDefinitionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * Information about the initial version of the connector definition.
     */
    InitialVersion?: ConnectorDefinitionVersion;
    /**
     * The name of the connector definition.
     */
    Name?: __string;
    /**
     * Tag(s) to add to the new resource.
     */
    tags?: Tags;
  }
  export interface CreateConnectorDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface CreateConnectorDefinitionVersionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The ID of the connector definition.
     */
    ConnectorDefinitionId: __string;
    /**
     * A list of references to connectors in this version, with their corresponding configuration settings.
     */
    Connectors?: __listOfConnector;
  }
  export interface CreateConnectorDefinitionVersionResponse {
    /**
     * The ARN of the version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the version was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the parent definition that the version is associated with.
     */
    Id?: __string;
    /**
     * The ID of the version.
     */
    Version?: __string;
  }
  export interface CreateCoreDefinitionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * Information about the initial version of the core definition.
     */
    InitialVersion?: CoreDefinitionVersion;
    /**
     * The name of the core definition.
     */
    Name?: __string;
    /**
     * Tag(s) to add to the new resource.
     */
    tags?: Tags;
  }
  export interface CreateCoreDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface CreateCoreDefinitionVersionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The ID of the core definition.
     */
    CoreDefinitionId: __string;
    /**
     * A list of cores in the core definition version.
     */
    Cores?: __listOfCore;
  }
  export interface CreateCoreDefinitionVersionResponse {
    /**
     * The ARN of the version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the version was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the parent definition that the version is associated with.
     */
    Id?: __string;
    /**
     * The ID of the version.
     */
    Version?: __string;
  }
  export interface CreateDeploymentRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The ID of the deployment if you wish to redeploy a previous deployment.
     */
    DeploymentId?: __string;
    /**
     * The type of deployment. When used for ''CreateDeployment'', only ''NewDeployment'' and ''Redeployment'' are valid.
     */
    DeploymentType: DeploymentType;
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
    /**
     * The ID of the group version to be deployed.
     */
    GroupVersionId?: __string;
  }
  export interface CreateDeploymentResponse {
    /**
     * The ARN of the deployment.
     */
    DeploymentArn?: __string;
    /**
     * The ID of the deployment.
     */
    DeploymentId?: __string;
  }
  export interface CreateDeviceDefinitionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * Information about the initial version of the device definition.
     */
    InitialVersion?: DeviceDefinitionVersion;
    /**
     * The name of the device definition.
     */
    Name?: __string;
    /**
     * Tag(s) to add to the new resource.
     */
    tags?: Tags;
  }
  export interface CreateDeviceDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface CreateDeviceDefinitionVersionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The ID of the device definition.
     */
    DeviceDefinitionId: __string;
    /**
     * A list of devices in the definition version.
     */
    Devices?: __listOfDevice;
  }
  export interface CreateDeviceDefinitionVersionResponse {
    /**
     * The ARN of the version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the version was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the parent definition that the version is associated with.
     */
    Id?: __string;
    /**
     * The ID of the version.
     */
    Version?: __string;
  }
  export interface CreateFunctionDefinitionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * Information about the initial version of the function definition.
     */
    InitialVersion?: FunctionDefinitionVersion;
    /**
     * The name of the function definition.
     */
    Name?: __string;
    /**
     * Tag(s) to add to the new resource.
     */
    tags?: Tags;
  }
  export interface CreateFunctionDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface CreateFunctionDefinitionVersionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The default configuration that applies to all Lambda functions in this function definition version. Individual Lambda functions can override these settings.
     */
    DefaultConfig?: FunctionDefaultConfig;
    /**
     * The ID of the Lambda function definition.
     */
    FunctionDefinitionId: __string;
    /**
     * A list of Lambda functions in this function definition version.
     */
    Functions?: __listOfFunction;
  }
  export interface CreateFunctionDefinitionVersionResponse {
    /**
     * The ARN of the version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the version was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the parent definition that the version is associated with.
     */
    Id?: __string;
    /**
     * The ID of the version.
     */
    Version?: __string;
  }
  export interface CreateGroupCertificateAuthorityRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface CreateGroupCertificateAuthorityResponse {
    /**
     * The ARN of the group certificate authority.
     */
    GroupCertificateAuthorityArn?: __string;
  }
  export interface CreateGroupRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * Information about the initial version of the group.
     */
    InitialVersion?: GroupVersion;
    /**
     * The name of the group.
     */
    Name: __string;
    /**
     * Tag(s) to add to the new resource.
     */
    tags?: Tags;
  }
  export interface CreateGroupResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface CreateGroupVersionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The ARN of the connector definition version for this group.
     */
    ConnectorDefinitionVersionArn?: __string;
    /**
     * The ARN of the core definition version for this group.
     */
    CoreDefinitionVersionArn?: __string;
    /**
     * The ARN of the device definition version for this group.
     */
    DeviceDefinitionVersionArn?: __string;
    /**
     * The ARN of the function definition version for this group.
     */
    FunctionDefinitionVersionArn?: __string;
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
    /**
     * The ARN of the logger definition version for this group.
     */
    LoggerDefinitionVersionArn?: __string;
    /**
     * The ARN of the resource definition version for this group.
     */
    ResourceDefinitionVersionArn?: __string;
    /**
     * The ARN of the subscription definition version for this group.
     */
    SubscriptionDefinitionVersionArn?: __string;
  }
  export interface CreateGroupVersionResponse {
    /**
     * The ARN of the version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the version was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the parent definition that the version is associated with.
     */
    Id?: __string;
    /**
     * The ID of the version.
     */
    Version?: __string;
  }
  export interface CreateLoggerDefinitionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * Information about the initial version of the logger definition.
     */
    InitialVersion?: LoggerDefinitionVersion;
    /**
     * The name of the logger definition.
     */
    Name?: __string;
    /**
     * Tag(s) to add to the new resource.
     */
    tags?: Tags;
  }
  export interface CreateLoggerDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface CreateLoggerDefinitionVersionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The ID of the logger definition.
     */
    LoggerDefinitionId: __string;
    /**
     * A list of loggers.
     */
    Loggers?: __listOfLogger;
  }
  export interface CreateLoggerDefinitionVersionResponse {
    /**
     * The ARN of the version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the version was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the parent definition that the version is associated with.
     */
    Id?: __string;
    /**
     * The ID of the version.
     */
    Version?: __string;
  }
  export interface CreateResourceDefinitionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * Information about the initial version of the resource definition.
     */
    InitialVersion?: ResourceDefinitionVersion;
    /**
     * The name of the resource definition.
     */
    Name?: __string;
    /**
     * Tag(s) to add to the new resource.
     */
    tags?: Tags;
  }
  export interface CreateResourceDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface CreateResourceDefinitionVersionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The ID of the resource definition.
     */
    ResourceDefinitionId: __string;
    /**
     * A list of resources.
     */
    Resources?: __listOfResource;
  }
  export interface CreateResourceDefinitionVersionResponse {
    /**
     * The ARN of the version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the version was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the parent definition that the version is associated with.
     */
    Id?: __string;
    /**
     * The ID of the version.
     */
    Version?: __string;
  }
  export interface CreateSoftwareUpdateJobRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    S3UrlSignerRole: S3UrlSignerRole;
    SoftwareToUpdate: SoftwareToUpdate;
    UpdateAgentLogLevel?: UpdateAgentLogLevel;
    UpdateTargets: UpdateTargets;
    UpdateTargetsArchitecture: UpdateTargetsArchitecture;
    UpdateTargetsOperatingSystem: UpdateTargetsOperatingSystem;
  }
  export interface CreateSoftwareUpdateJobResponse {
    /**
     * The IoT Job ARN corresponding to this update.
     */
    IotJobArn?: __string;
    /**
     * The IoT Job Id corresponding to this update.
     */
    IotJobId?: __string;
    /**
     * The software version installed on the device or devices after the update.
     */
    PlatformSoftwareVersion?: __string;
  }
  export interface CreateSubscriptionDefinitionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * Information about the initial version of the subscription definition.
     */
    InitialVersion?: SubscriptionDefinitionVersion;
    /**
     * The name of the subscription definition.
     */
    Name?: __string;
    /**
     * Tag(s) to add to the new resource.
     */
    tags?: Tags;
  }
  export interface CreateSubscriptionDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface CreateSubscriptionDefinitionVersionRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The ID of the subscription definition.
     */
    SubscriptionDefinitionId: __string;
    /**
     * A list of subscriptions.
     */
    Subscriptions?: __listOfSubscription;
  }
  export interface CreateSubscriptionDefinitionVersionResponse {
    /**
     * The ARN of the version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the version was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the parent definition that the version is associated with.
     */
    Id?: __string;
    /**
     * The ID of the version.
     */
    Version?: __string;
  }
  export interface DefinitionInformation {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * Tag(s) attached to the resource arn.
     */
    Tags?: Tags;
  }
  export interface DeleteConnectorDefinitionRequest {
    /**
     * The ID of the connector definition.
     */
    ConnectorDefinitionId: __string;
  }
  export interface DeleteConnectorDefinitionResponse {
  }
  export interface DeleteCoreDefinitionRequest {
    /**
     * The ID of the core definition.
     */
    CoreDefinitionId: __string;
  }
  export interface DeleteCoreDefinitionResponse {
  }
  export interface DeleteDeviceDefinitionRequest {
    /**
     * The ID of the device definition.
     */
    DeviceDefinitionId: __string;
  }
  export interface DeleteDeviceDefinitionResponse {
  }
  export interface DeleteFunctionDefinitionRequest {
    /**
     * The ID of the Lambda function definition.
     */
    FunctionDefinitionId: __string;
  }
  export interface DeleteFunctionDefinitionResponse {
  }
  export interface DeleteGroupRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface DeleteGroupResponse {
  }
  export interface DeleteLoggerDefinitionRequest {
    /**
     * The ID of the logger definition.
     */
    LoggerDefinitionId: __string;
  }
  export interface DeleteLoggerDefinitionResponse {
  }
  export interface DeleteResourceDefinitionRequest {
    /**
     * The ID of the resource definition.
     */
    ResourceDefinitionId: __string;
  }
  export interface DeleteResourceDefinitionResponse {
  }
  export interface DeleteSubscriptionDefinitionRequest {
    /**
     * The ID of the subscription definition.
     */
    SubscriptionDefinitionId: __string;
  }
  export interface DeleteSubscriptionDefinitionResponse {
  }
  export interface Deployment {
    /**
     * The time, in milliseconds since the epoch, when the deployment was created.
     */
    CreatedAt?: __string;
    /**
     * The ARN of the deployment.
     */
    DeploymentArn?: __string;
    /**
     * The ID of the deployment.
     */
    DeploymentId?: __string;
    /**
     * The type of the deployment.
     */
    DeploymentType?: DeploymentType;
    /**
     * The ARN of the group for this deployment.
     */
    GroupArn?: __string;
  }
  export type DeploymentType = "NewDeployment"|"Redeployment"|"ResetDeployment"|"ForceResetDeployment"|string;
  export type Deployments = Deployment[];
  export interface Device {
    /**
     * The ARN of the certificate associated with the device.
     */
    CertificateArn: __string;
    /**
     * A descriptive or arbitrary ID for the device. This value must be unique within the device definition version. Max length is 128 characters with pattern ''[a-zA-Z0-9:_-]+''.
     */
    Id: __string;
    /**
     * If true, the device's local shadow will be automatically synced with the cloud.
     */
    SyncShadow?: __boolean;
    /**
     * The thing ARN of the device.
     */
    ThingArn: __string;
  }
  export interface DeviceDefinitionVersion {
    /**
     * A list of devices in the definition version.
     */
    Devices?: __listOfDevice;
  }
  export interface DisassociateRoleFromGroupRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface DisassociateRoleFromGroupResponse {
    /**
     * The time, in milliseconds since the epoch, when the role was disassociated from the group.
     */
    DisassociatedAt?: __string;
  }
  export interface DisassociateServiceRoleFromAccountRequest {
  }
  export interface DisassociateServiceRoleFromAccountResponse {
    /**
     * The time when the service role was disassociated from the account.
     */
    DisassociatedAt?: __string;
  }
  export type EncodingType = "binary"|"json"|string;
  export interface ErrorDetail {
    /**
     * A detailed error code.
     */
    DetailedErrorCode?: __string;
    /**
     * A detailed error message.
     */
    DetailedErrorMessage?: __string;
  }
  export type ErrorDetails = ErrorDetail[];
  export interface Function {
    /**
     * The ARN of the Lambda function.
     */
    FunctionArn?: __string;
    /**
     * The configuration of the Lambda function.
     */
    FunctionConfiguration?: FunctionConfiguration;
    /**
     * A descriptive or arbitrary ID for the function. This value must be unique within the function definition version. Max length is 128 characters with pattern ''[a-zA-Z0-9:_-]+''.
     */
    Id: __string;
  }
  export interface FunctionConfiguration {
    /**
     * The expected encoding type of the input payload for the function. The default is ''json''.
     */
    EncodingType?: EncodingType;
    /**
     * The environment configuration of the function.
     */
    Environment?: FunctionConfigurationEnvironment;
    /**
     * The execution arguments.
     */
    ExecArgs?: __string;
    /**
     * The name of the function executable.
     */
    Executable?: __string;
    /**
     * The memory size, in KB, which the function requires. This setting is not applicable and should be cleared when you run the Lambda function without containerization.
     */
    MemorySize?: __integer;
    /**
     * True if the function is pinned. Pinned means the function is long-lived and starts when the core starts.
     */
    Pinned?: __boolean;
    /**
     * The allowed function execution time, after which Lambda should terminate the function. This timeout still applies to pinned Lambda functions for each request.
     */
    Timeout?: __integer;
  }
  export interface FunctionConfigurationEnvironment {
    /**
     * If true, the Lambda function is allowed to access the host's /sys folder. Use this when the Lambda function needs to read device information from /sys. This setting applies only when you run the Lambda function in a Greengrass container.
     */
    AccessSysfs?: __boolean;
    /**
     * Configuration related to executing the Lambda function
     */
    Execution?: FunctionExecutionConfig;
    /**
     * A list of the resources, with their permissions, to which the Lambda function will be granted access. A Lambda function can have at most 10 resources. ResourceAccessPolicies apply only when you run the Lambda function in a Greengrass container.
     */
    ResourceAccessPolicies?: __listOfResourceAccessPolicy;
    /**
     * Environment variables for the Lambda function's configuration.
     */
    Variables?: __mapOf__string;
  }
  export interface FunctionDefaultConfig {
    Execution?: FunctionDefaultExecutionConfig;
  }
  export interface FunctionDefaultExecutionConfig {
    IsolationMode?: FunctionIsolationMode;
    RunAs?: FunctionRunAsConfig;
  }
  export interface FunctionDefinitionVersion {
    /**
     * The default configuration that applies to all Lambda functions in this function definition version. Individual Lambda functions can override these settings.
     */
    DefaultConfig?: FunctionDefaultConfig;
    /**
     * A list of Lambda functions in this function definition version.
     */
    Functions?: __listOfFunction;
  }
  export interface FunctionExecutionConfig {
    IsolationMode?: FunctionIsolationMode;
    RunAs?: FunctionRunAsConfig;
  }
  export type FunctionIsolationMode = "GreengrassContainer"|"NoContainer"|string;
  export interface FunctionRunAsConfig {
    /**
     * The group ID whose permissions are used to run a Lambda function.
     */
    Gid?: __integer;
    /**
     * The user ID whose permissions are used to run a Lambda function.
     */
    Uid?: __integer;
  }
  export interface GetAssociatedRoleRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface GetAssociatedRoleResponse {
    /**
     * The time when the role was associated with the group.
     */
    AssociatedAt?: __string;
    /**
     * The ARN of the role that is associated with the group.
     */
    RoleArn?: __string;
  }
  export interface GetBulkDeploymentStatusRequest {
    /**
     * The ID of the bulk deployment.
     */
    BulkDeploymentId: __string;
  }
  export interface GetBulkDeploymentStatusResponse {
    /**
     * Relevant metrics on input records processed during bulk deployment.
     */
    BulkDeploymentMetrics?: BulkDeploymentMetrics;
    /**
     * The status of the bulk deployment.
     */
    BulkDeploymentStatus?: BulkDeploymentStatus;
    /**
     * The time, in ISO format, when the deployment was created.
     */
    CreatedAt?: __string;
    /**
     * Error details
     */
    ErrorDetails?: ErrorDetails;
    /**
     * Error message
     */
    ErrorMessage?: __string;
    /**
     * Tag(s) attached to the resource arn.
     */
    tags?: Tags;
  }
  export interface GetConnectivityInfoRequest {
    /**
     * The thing name.
     */
    ThingName: __string;
  }
  export interface GetConnectivityInfoResponse {
    /**
     * Connectivity info list.
     */
    ConnectivityInfo?: __listOfConnectivityInfo;
    /**
     * A message about the connectivity info request.
     */
    Message?: __string;
  }
  export interface GetConnectorDefinitionRequest {
    /**
     * The ID of the connector definition.
     */
    ConnectorDefinitionId: __string;
  }
  export interface GetConnectorDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * Tag(s) attached to the resource arn.
     */
    tags?: Tags;
  }
  export interface GetConnectorDefinitionVersionRequest {
    /**
     * The ID of the connector definition.
     */
    ConnectorDefinitionId: __string;
    /**
     * The ID of the connector definition version. This value maps to the ''Version'' property of the corresponding ''VersionInformation'' object, which is returned by ''ListConnectorDefinitionVersions'' requests. If the version is the last one that was associated with a connector definition, the value also maps to the ''LatestVersion'' property of the corresponding ''DefinitionInformation'' object.
     */
    ConnectorDefinitionVersionId: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface GetConnectorDefinitionVersionResponse {
    /**
     * The ARN of the connector definition version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the connector definition version was created.
     */
    CreationTimestamp?: __string;
    /**
     * Information about the connector definition version.
     */
    Definition?: ConnectorDefinitionVersion;
    /**
     * The ID of the connector definition version.
     */
    Id?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * The version of the connector definition version.
     */
    Version?: __string;
  }
  export interface GetCoreDefinitionRequest {
    /**
     * The ID of the core definition.
     */
    CoreDefinitionId: __string;
  }
  export interface GetCoreDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * Tag(s) attached to the resource arn.
     */
    tags?: Tags;
  }
  export interface GetCoreDefinitionVersionRequest {
    /**
     * The ID of the core definition.
     */
    CoreDefinitionId: __string;
    /**
     * The ID of the core definition version. This value maps to the ''Version'' property of the corresponding ''VersionInformation'' object, which is returned by ''ListCoreDefinitionVersions'' requests. If the version is the last one that was associated with a core definition, the value also maps to the ''LatestVersion'' property of the corresponding ''DefinitionInformation'' object.
     */
    CoreDefinitionVersionId: __string;
  }
  export interface GetCoreDefinitionVersionResponse {
    /**
     * The ARN of the core definition version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the core definition version was created.
     */
    CreationTimestamp?: __string;
    /**
     * Information about the core definition version.
     */
    Definition?: CoreDefinitionVersion;
    /**
     * The ID of the core definition version.
     */
    Id?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * The version of the core definition version.
     */
    Version?: __string;
  }
  export interface GetDeploymentStatusRequest {
    /**
     * The ID of the deployment.
     */
    DeploymentId: __string;
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface GetDeploymentStatusResponse {
    /**
     * The status of the deployment: ''InProgress'', ''Building'', ''Success'', or ''Failure''.
     */
    DeploymentStatus?: __string;
    /**
     * The type of the deployment.
     */
    DeploymentType?: DeploymentType;
    /**
     * Error details
     */
    ErrorDetails?: ErrorDetails;
    /**
     * Error message
     */
    ErrorMessage?: __string;
    /**
     * The time, in milliseconds since the epoch, when the deployment status was updated.
     */
    UpdatedAt?: __string;
  }
  export interface GetDeviceDefinitionRequest {
    /**
     * The ID of the device definition.
     */
    DeviceDefinitionId: __string;
  }
  export interface GetDeviceDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * Tag(s) attached to the resource arn.
     */
    tags?: Tags;
  }
  export interface GetDeviceDefinitionVersionRequest {
    /**
     * The ID of the device definition.
     */
    DeviceDefinitionId: __string;
    /**
     * The ID of the device definition version. This value maps to the ''Version'' property of the corresponding ''VersionInformation'' object, which is returned by ''ListDeviceDefinitionVersions'' requests. If the version is the last one that was associated with a device definition, the value also maps to the ''LatestVersion'' property of the corresponding ''DefinitionInformation'' object.
     */
    DeviceDefinitionVersionId: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface GetDeviceDefinitionVersionResponse {
    /**
     * The ARN of the device definition version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the device definition version was created.
     */
    CreationTimestamp?: __string;
    /**
     * Information about the device definition version.
     */
    Definition?: DeviceDefinitionVersion;
    /**
     * The ID of the device definition version.
     */
    Id?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * The version of the device definition version.
     */
    Version?: __string;
  }
  export interface GetFunctionDefinitionRequest {
    /**
     * The ID of the Lambda function definition.
     */
    FunctionDefinitionId: __string;
  }
  export interface GetFunctionDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * Tag(s) attached to the resource arn.
     */
    tags?: Tags;
  }
  export interface GetFunctionDefinitionVersionRequest {
    /**
     * The ID of the Lambda function definition.
     */
    FunctionDefinitionId: __string;
    /**
     * The ID of the function definition version. This value maps to the ''Version'' property of the corresponding ''VersionInformation'' object, which is returned by ''ListFunctionDefinitionVersions'' requests. If the version is the last one that was associated with a function definition, the value also maps to the ''LatestVersion'' property of the corresponding ''DefinitionInformation'' object.
     */
    FunctionDefinitionVersionId: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface GetFunctionDefinitionVersionResponse {
    /**
     * The ARN of the function definition version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the function definition version was created.
     */
    CreationTimestamp?: __string;
    /**
     * Information on the definition.
     */
    Definition?: FunctionDefinitionVersion;
    /**
     * The ID of the function definition version.
     */
    Id?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * The version of the function definition version.
     */
    Version?: __string;
  }
  export interface GetGroupCertificateAuthorityRequest {
    /**
     * The ID of the certificate authority.
     */
    CertificateAuthorityId: __string;
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface GetGroupCertificateAuthorityResponse {
    /**
     * The ARN of the certificate authority for the group.
     */
    GroupCertificateAuthorityArn?: __string;
    /**
     * The ID of the certificate authority for the group.
     */
    GroupCertificateAuthorityId?: __string;
    /**
     * The PEM encoded certificate for the group.
     */
    PemEncodedCertificate?: __string;
  }
  export interface GetGroupCertificateConfigurationRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface GetGroupCertificateConfigurationResponse {
    /**
     * The amount of time remaining before the certificate authority expires, in milliseconds.
     */
    CertificateAuthorityExpiryInMilliseconds?: __string;
    /**
     * The amount of time remaining before the certificate expires, in milliseconds.
     */
    CertificateExpiryInMilliseconds?: __string;
    /**
     * The ID of the group certificate configuration.
     */
    GroupId?: __string;
  }
  export interface GetGroupRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface GetGroupResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * Tag(s) attached to the resource arn.
     */
    tags?: Tags;
  }
  export interface GetGroupVersionRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
    /**
     * The ID of the group version. This value maps to the ''Version'' property of the corresponding ''VersionInformation'' object, which is returned by ''ListGroupVersions'' requests. If the version is the last one that was associated with a group, the value also maps to the ''LatestVersion'' property of the corresponding ''GroupInformation'' object.
     */
    GroupVersionId: __string;
  }
  export interface GetGroupVersionResponse {
    /**
     * The ARN of the group version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the group version was created.
     */
    CreationTimestamp?: __string;
    /**
     * Information about the group version definition.
     */
    Definition?: GroupVersion;
    /**
     * The ID of the group that the version is associated with.
     */
    Id?: __string;
    /**
     * The ID of the group version.
     */
    Version?: __string;
  }
  export interface GetLoggerDefinitionRequest {
    /**
     * The ID of the logger definition.
     */
    LoggerDefinitionId: __string;
  }
  export interface GetLoggerDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * Tag(s) attached to the resource arn.
     */
    tags?: Tags;
  }
  export interface GetLoggerDefinitionVersionRequest {
    /**
     * The ID of the logger definition.
     */
    LoggerDefinitionId: __string;
    /**
     * The ID of the logger definition version. This value maps to the ''Version'' property of the corresponding ''VersionInformation'' object, which is returned by ''ListLoggerDefinitionVersions'' requests. If the version is the last one that was associated with a logger definition, the value also maps to the ''LatestVersion'' property of the corresponding ''DefinitionInformation'' object.
     */
    LoggerDefinitionVersionId: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface GetLoggerDefinitionVersionResponse {
    /**
     * The ARN of the logger definition version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the logger definition version was created.
     */
    CreationTimestamp?: __string;
    /**
     * Information about the logger definition version.
     */
    Definition?: LoggerDefinitionVersion;
    /**
     * The ID of the logger definition version.
     */
    Id?: __string;
    /**
     * The version of the logger definition version.
     */
    Version?: __string;
  }
  export interface GetResourceDefinitionRequest {
    /**
     * The ID of the resource definition.
     */
    ResourceDefinitionId: __string;
  }
  export interface GetResourceDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * Tag(s) attached to the resource arn.
     */
    tags?: Tags;
  }
  export interface GetResourceDefinitionVersionRequest {
    /**
     * The ID of the resource definition.
     */
    ResourceDefinitionId: __string;
    /**
     * The ID of the resource definition version. This value maps to the ''Version'' property of the corresponding ''VersionInformation'' object, which is returned by ''ListResourceDefinitionVersions'' requests. If the version is the last one that was associated with a resource definition, the value also maps to the ''LatestVersion'' property of the corresponding ''DefinitionInformation'' object.
     */
    ResourceDefinitionVersionId: __string;
  }
  export interface GetResourceDefinitionVersionResponse {
    /**
     * Arn of the resource definition version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the resource definition version was created.
     */
    CreationTimestamp?: __string;
    /**
     * Information about the definition.
     */
    Definition?: ResourceDefinitionVersion;
    /**
     * The ID of the resource definition version.
     */
    Id?: __string;
    /**
     * The version of the resource definition version.
     */
    Version?: __string;
  }
  export interface GetServiceRoleForAccountRequest {
  }
  export interface GetServiceRoleForAccountResponse {
    /**
     * The time when the service role was associated with the account.
     */
    AssociatedAt?: __string;
    /**
     * The ARN of the role which is associated with the account.
     */
    RoleArn?: __string;
  }
  export interface GetSubscriptionDefinitionRequest {
    /**
     * The ID of the subscription definition.
     */
    SubscriptionDefinitionId: __string;
  }
  export interface GetSubscriptionDefinitionResponse {
    /**
     * The ARN of the definition.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the definition.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the definition was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the definition.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the definition.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * Tag(s) attached to the resource arn.
     */
    tags?: Tags;
  }
  export interface GetSubscriptionDefinitionVersionRequest {
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * The ID of the subscription definition.
     */
    SubscriptionDefinitionId: __string;
    /**
     * The ID of the subscription definition version. This value maps to the ''Version'' property of the corresponding ''VersionInformation'' object, which is returned by ''ListSubscriptionDefinitionVersions'' requests. If the version is the last one that was associated with a subscription definition, the value also maps to the ''LatestVersion'' property of the corresponding ''DefinitionInformation'' object.
     */
    SubscriptionDefinitionVersionId: __string;
  }
  export interface GetSubscriptionDefinitionVersionResponse {
    /**
     * The ARN of the subscription definition version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the subscription definition version was created.
     */
    CreationTimestamp?: __string;
    /**
     * Information about the subscription definition version.
     */
    Definition?: SubscriptionDefinitionVersion;
    /**
     * The ID of the subscription definition version.
     */
    Id?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * The version of the subscription definition version.
     */
    Version?: __string;
  }
  export interface GetThingRuntimeConfigurationRequest {
    /**
     * The thing name.
     */
    ThingName: __string;
  }
  export interface GetThingRuntimeConfigurationResponse {
    /**
     * Runtime configuration for a thing.
     */
    RuntimeConfiguration?: RuntimeConfiguration;
  }
  export interface GroupCertificateAuthorityProperties {
    /**
     * The ARN of the certificate authority for the group.
     */
    GroupCertificateAuthorityArn?: __string;
    /**
     * The ID of the certificate authority for the group.
     */
    GroupCertificateAuthorityId?: __string;
  }
  export interface GroupInformation {
    /**
     * The ARN of the group.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the group was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the group.
     */
    Id?: __string;
    /**
     * The time, in milliseconds since the epoch, when the group was last updated.
     */
    LastUpdatedTimestamp?: __string;
    /**
     * The ID of the latest version associated with the group.
     */
    LatestVersion?: __string;
    /**
     * The ARN of the latest version associated with the group.
     */
    LatestVersionArn?: __string;
    /**
     * The name of the group.
     */
    Name?: __string;
  }
  export interface GroupOwnerSetting {
    /**
     * If true, AWS IoT Greengrass automatically adds the specified Linux OS group owner of the resource to the Lambda process privileges. Thus the Lambda process will have the file access permissions of the added Linux group.
     */
    AutoAddGroupOwner?: __boolean;
    /**
     * The name of the Linux OS group whose privileges will be added to the Lambda process. This field is optional.
     */
    GroupOwner?: __string;
  }
  export interface GroupVersion {
    /**
     * The ARN of the connector definition version for this group.
     */
    ConnectorDefinitionVersionArn?: __string;
    /**
     * The ARN of the core definition version for this group.
     */
    CoreDefinitionVersionArn?: __string;
    /**
     * The ARN of the device definition version for this group.
     */
    DeviceDefinitionVersionArn?: __string;
    /**
     * The ARN of the function definition version for this group.
     */
    FunctionDefinitionVersionArn?: __string;
    /**
     * The ARN of the logger definition version for this group.
     */
    LoggerDefinitionVersionArn?: __string;
    /**
     * The ARN of the resource definition version for this group.
     */
    ResourceDefinitionVersionArn?: __string;
    /**
     * The ARN of the subscription definition version for this group.
     */
    SubscriptionDefinitionVersionArn?: __string;
  }
  export interface ListBulkDeploymentDetailedReportsRequest {
    /**
     * The ID of the bulk deployment.
     */
    BulkDeploymentId: __string;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListBulkDeploymentDetailedReportsResponse {
    /**
     * A list of the individual group deployments in the bulk deployment operation.
     */
    Deployments?: BulkDeploymentResults;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListBulkDeploymentsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListBulkDeploymentsResponse {
    /**
     * A list of bulk deployments.
     */
    BulkDeployments?: BulkDeployments;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListConnectorDefinitionVersionsRequest {
    /**
     * The ID of the connector definition.
     */
    ConnectorDefinitionId: __string;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListConnectorDefinitionVersionsResponse {
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * Information about a version.
     */
    Versions?: __listOfVersionInformation;
  }
  export interface ListConnectorDefinitionsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListConnectorDefinitionsResponse {
    /**
     * Information about a definition.
     */
    Definitions?: __listOfDefinitionInformation;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListCoreDefinitionVersionsRequest {
    /**
     * The ID of the core definition.
     */
    CoreDefinitionId: __string;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListCoreDefinitionVersionsResponse {
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * Information about a version.
     */
    Versions?: __listOfVersionInformation;
  }
  export interface ListCoreDefinitionsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListCoreDefinitionsResponse {
    /**
     * Information about a definition.
     */
    Definitions?: __listOfDefinitionInformation;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListDeploymentsRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListDeploymentsResponse {
    /**
     * A list of deployments for the requested groups.
     */
    Deployments?: Deployments;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListDeviceDefinitionVersionsRequest {
    /**
     * The ID of the device definition.
     */
    DeviceDefinitionId: __string;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListDeviceDefinitionVersionsResponse {
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * Information about a version.
     */
    Versions?: __listOfVersionInformation;
  }
  export interface ListDeviceDefinitionsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListDeviceDefinitionsResponse {
    /**
     * Information about a definition.
     */
    Definitions?: __listOfDefinitionInformation;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListFunctionDefinitionVersionsRequest {
    /**
     * The ID of the Lambda function definition.
     */
    FunctionDefinitionId: __string;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListFunctionDefinitionVersionsResponse {
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * Information about a version.
     */
    Versions?: __listOfVersionInformation;
  }
  export interface ListFunctionDefinitionsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListFunctionDefinitionsResponse {
    /**
     * Information about a definition.
     */
    Definitions?: __listOfDefinitionInformation;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListGroupCertificateAuthoritiesRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface ListGroupCertificateAuthoritiesResponse {
    /**
     * A list of certificate authorities associated with the group.
     */
    GroupCertificateAuthorities?: __listOfGroupCertificateAuthorityProperties;
  }
  export interface ListGroupVersionsRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListGroupVersionsResponse {
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * Information about a version.
     */
    Versions?: __listOfVersionInformation;
  }
  export interface ListGroupsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListGroupsResponse {
    /**
     * Information about a group.
     */
    Groups?: __listOfGroupInformation;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListLoggerDefinitionVersionsRequest {
    /**
     * The ID of the logger definition.
     */
    LoggerDefinitionId: __string;
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListLoggerDefinitionVersionsResponse {
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * Information about a version.
     */
    Versions?: __listOfVersionInformation;
  }
  export interface ListLoggerDefinitionsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListLoggerDefinitionsResponse {
    /**
     * Information about a definition.
     */
    Definitions?: __listOfDefinitionInformation;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListResourceDefinitionVersionsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * The ID of the resource definition.
     */
    ResourceDefinitionId: __string;
  }
  export interface ListResourceDefinitionVersionsResponse {
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * Information about a version.
     */
    Versions?: __listOfVersionInformation;
  }
  export interface ListResourceDefinitionsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListResourceDefinitionsResponse {
    /**
     * Information about a definition.
     */
    Definitions?: __listOfDefinitionInformation;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListSubscriptionDefinitionVersionsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * The ID of the subscription definition.
     */
    SubscriptionDefinitionId: __string;
  }
  export interface ListSubscriptionDefinitionVersionsResponse {
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
    /**
     * Information about a version.
     */
    Versions?: __listOfVersionInformation;
  }
  export interface ListSubscriptionDefinitionsRequest {
    /**
     * The maximum number of results to be returned per request.
     */
    MaxResults?: __string;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListSubscriptionDefinitionsResponse {
    /**
     * Information about a definition.
     */
    Definitions?: __listOfDefinitionInformation;
    /**
     * The token for the next set of results, or ''null'' if there are no additional results.
     */
    NextToken?: __string;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: __string;
  }
  export interface ListTagsForResourceResponse {
    tags?: Tags;
  }
  export interface LocalDeviceResourceData {
    /**
     * Group/owner related settings for local resources.
     */
    GroupOwnerSetting?: GroupOwnerSetting;
    /**
     * The local absolute path of the device resource. The source path for a device resource can refer only to a character device or block device under ''/dev''.
     */
    SourcePath?: __string;
  }
  export interface LocalVolumeResourceData {
    /**
     * The absolute local path of the resource inside the Lambda environment.
     */
    DestinationPath?: __string;
    /**
     * Allows you to configure additional group privileges for the Lambda process. This field is optional.
     */
    GroupOwnerSetting?: GroupOwnerSetting;
    /**
     * The local absolute path of the volume resource on the host. The source path for a volume resource type cannot start with ''/sys''.
     */
    SourcePath?: __string;
  }
  export interface Logger {
    /**
     * The component that will be subject to logging.
     */
    Component: LoggerComponent;
    /**
     * A descriptive or arbitrary ID for the logger. This value must be unique within the logger definition version. Max length is 128 characters with pattern ''[a-zA-Z0-9:_-]+''.
     */
    Id: __string;
    /**
     * The level of the logs.
     */
    Level: LoggerLevel;
    /**
     * The amount of file space, in KB, to use if the local file system is used for logging purposes.
     */
    Space?: __integer;
    /**
     * The type of log output which will be used.
     */
    Type: LoggerType;
  }
  export type LoggerComponent = "GreengrassSystem"|"Lambda"|string;
  export interface LoggerDefinitionVersion {
    /**
     * A list of loggers.
     */
    Loggers?: __listOfLogger;
  }
  export type LoggerLevel = "DEBUG"|"INFO"|"WARN"|"ERROR"|"FATAL"|string;
  export type LoggerType = "FileSystem"|"AWSCloudWatch"|string;
  export type Permission = "ro"|"rw"|string;
  export interface ResetDeploymentsRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * If true, performs a best-effort only core reset.
     */
    Force?: __boolean;
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface ResetDeploymentsResponse {
    /**
     * The ARN of the deployment.
     */
    DeploymentArn?: __string;
    /**
     * The ID of the deployment.
     */
    DeploymentId?: __string;
  }
  export interface Resource {
    /**
     * The resource ID, used to refer to a resource in the Lambda function configuration. Max length is 128 characters with pattern ''[a-zA-Z0-9:_-]+''. This must be unique within a Greengrass group.
     */
    Id: __string;
    /**
     * The descriptive resource name, which is displayed on the AWS IoT Greengrass console. Max length 128 characters with pattern ''[a-zA-Z0-9:_-]+''. This must be unique within a Greengrass group.
     */
    Name: __string;
    /**
     * A container of data for all resource types.
     */
    ResourceDataContainer: ResourceDataContainer;
  }
  export interface ResourceAccessPolicy {
    /**
     * The permissions that the Lambda function has to the resource. Can be one of ''rw'' (read/write) or ''ro'' (read-only).
     */
    Permission?: Permission;
    /**
     * The ID of the resource. (This ID is assigned to the resource when you create the resource definiton.)
     */
    ResourceId: __string;
  }
  export interface ResourceDataContainer {
    /**
     * Attributes that define the local device resource.
     */
    LocalDeviceResourceData?: LocalDeviceResourceData;
    /**
     * Attributes that define the local volume resource.
     */
    LocalVolumeResourceData?: LocalVolumeResourceData;
    /**
     * Attributes that define an Amazon S3 machine learning resource.
     */
    S3MachineLearningModelResourceData?: S3MachineLearningModelResourceData;
    /**
     * Attributes that define an Amazon SageMaker machine learning resource.
     */
    SageMakerMachineLearningModelResourceData?: SageMakerMachineLearningModelResourceData;
    /**
     * Attributes that define a secret resource, which references a secret from AWS Secrets Manager.
     */
    SecretsManagerSecretResourceData?: SecretsManagerSecretResourceData;
  }
  export interface ResourceDefinitionVersion {
    /**
     * A list of resources.
     */
    Resources?: __listOfResource;
  }
  export interface ResourceDownloadOwnerSetting {
    /**
     * The group owner of the resource. This is the name of an existing Linux OS group on the system or a GID. The group's permissions are added to the Lambda process.
     */
    GroupOwner: __string;
    /**
     * The permissions that the group owner has to the resource. Valid values are ''rw'' (read/write) or ''ro'' (read-only).
     */
    GroupPermission: Permission;
  }
  export interface RuntimeConfiguration {
    /**
     * Configuration for telemetry service.
     */
    TelemetryConfiguration?: TelemetryConfiguration;
  }
  export interface S3MachineLearningModelResourceData {
    /**
     * The absolute local path of the resource inside the Lambda environment.
     */
    DestinationPath?: __string;
    OwnerSetting?: ResourceDownloadOwnerSetting;
    /**
     * The URI of the source model in an S3 bucket. The model package must be in tar.gz or .zip format.
     */
    S3Uri?: __string;
  }
  export type S3UrlSignerRole = string;
  export interface SageMakerMachineLearningModelResourceData {
    /**
     * The absolute local path of the resource inside the Lambda environment.
     */
    DestinationPath?: __string;
    OwnerSetting?: ResourceDownloadOwnerSetting;
    /**
     * The ARN of the Amazon SageMaker training job that represents the source model.
     */
    SageMakerJobArn?: __string;
  }
  export interface SecretsManagerSecretResourceData {
    /**
     * The ARN of the Secrets Manager secret to make available on the core. The value of the secret's latest version (represented by the ''AWSCURRENT'' staging label) is included by default.
     */
    ARN?: __string;
    /**
     * Optional. The staging labels whose values you want to make available on the core, in addition to ''AWSCURRENT''.
     */
    AdditionalStagingLabelsToDownload?: __listOf__string;
  }
  export type SoftwareToUpdate = "core"|"ota_agent"|string;
  export interface StartBulkDeploymentRequest {
    /**
     * A client token used to correlate requests and responses.
     */
    AmznClientToken?: __string;
    /**
     * The ARN of the execution role to associate with the bulk deployment operation. This IAM role must allow the ''greengrass:CreateDeployment'' action for all group versions that are listed in the input file. This IAM role must have access to the S3 bucket containing the input file.
     */
    ExecutionRoleArn: __string;
    /**
     * The URI of the input file contained in the S3 bucket. The execution role must have ''getObject'' permissions on this bucket to access the input file. The input file is a JSON-serialized, line delimited file with UTF-8 encoding that provides a list of group and version IDs and the deployment type. This file must be less than 100 MB. Currently, AWS IoT Greengrass supports only ''NewDeployment'' deployment types.
     */
    InputFileUri: __string;
    /**
     * Tag(s) to add to the new resource.
     */
    tags?: Tags;
  }
  export interface StartBulkDeploymentResponse {
    /**
     * The ARN of the bulk deployment.
     */
    BulkDeploymentArn?: __string;
    /**
     * The ID of the bulk deployment.
     */
    BulkDeploymentId?: __string;
  }
  export interface StopBulkDeploymentRequest {
    /**
     * The ID of the bulk deployment.
     */
    BulkDeploymentId: __string;
  }
  export interface StopBulkDeploymentResponse {
  }
  export interface Subscription {
    /**
     * A descriptive or arbitrary ID for the subscription. This value must be unique within the subscription definition version. Max length is 128 characters with pattern ''[a-zA-Z0-9:_-]+''.
     */
    Id: __string;
    /**
     * The source of the subscription. Can be a thing ARN, a Lambda function ARN, a connector ARN, 'cloud' (which represents the AWS IoT cloud), or 'GGShadowService'.
     */
    Source: __string;
    /**
     * The MQTT topic used to route the message.
     */
    Subject: __string;
    /**
     * Where the message is sent to. Can be a thing ARN, a Lambda function ARN, a connector ARN, 'cloud' (which represents the AWS IoT cloud), or 'GGShadowService'.
     */
    Target: __string;
  }
  export interface SubscriptionDefinitionVersion {
    /**
     * A list of subscriptions.
     */
    Subscriptions?: __listOfSubscription;
  }
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: __string;
    tags?: Tags;
  }
  export type Tags = {[key: string]: __string};
  export type Telemetry = "On"|"Off"|string;
  export interface TelemetryConfiguration {
    /**
     * Synchronization status of the device reported configuration with the desired configuration.
     */
    ConfigurationSyncStatus?: ConfigurationSyncStatus;
    /**
     * Configure telemetry to be on or off.
     */
    Telemetry: Telemetry;
  }
  export interface TelemetryConfigurationUpdate {
    /**
     * Configure telemetry to be on or off.
     */
    Telemetry: Telemetry;
  }
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    ResourceArn: __string;
    /**
     * An array of tag keys to delete
     */
    TagKeys: __listOf__string;
  }
  export type UpdateAgentLogLevel = "NONE"|"TRACE"|"DEBUG"|"VERBOSE"|"INFO"|"WARN"|"ERROR"|"FATAL"|string;
  export interface UpdateConnectivityInfoRequest {
    /**
     * A list of connectivity info.
     */
    ConnectivityInfo?: __listOfConnectivityInfo;
    /**
     * The thing name.
     */
    ThingName: __string;
  }
  export interface UpdateConnectivityInfoResponse {
    /**
     * A message about the connectivity info update request.
     */
    Message?: __string;
    /**
     * The new version of the connectivity info.
     */
    Version?: __string;
  }
  export interface UpdateConnectorDefinitionRequest {
    /**
     * The ID of the connector definition.
     */
    ConnectorDefinitionId: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface UpdateConnectorDefinitionResponse {
  }
  export interface UpdateCoreDefinitionRequest {
    /**
     * The ID of the core definition.
     */
    CoreDefinitionId: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface UpdateCoreDefinitionResponse {
  }
  export interface UpdateDeviceDefinitionRequest {
    /**
     * The ID of the device definition.
     */
    DeviceDefinitionId: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface UpdateDeviceDefinitionResponse {
  }
  export interface UpdateFunctionDefinitionRequest {
    /**
     * The ID of the Lambda function definition.
     */
    FunctionDefinitionId: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface UpdateFunctionDefinitionResponse {
  }
  export interface UpdateGroupCertificateConfigurationRequest {
    /**
     * The amount of time remaining before the certificate expires, in milliseconds.
     */
    CertificateExpiryInMilliseconds?: __string;
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
  }
  export interface UpdateGroupCertificateConfigurationResponse {
    /**
     * The amount of time remaining before the certificate authority expires, in milliseconds.
     */
    CertificateAuthorityExpiryInMilliseconds?: __string;
    /**
     * The amount of time remaining before the certificate expires, in milliseconds.
     */
    CertificateExpiryInMilliseconds?: __string;
    /**
     * The ID of the group certificate configuration.
     */
    GroupId?: __string;
  }
  export interface UpdateGroupRequest {
    /**
     * The ID of the Greengrass group.
     */
    GroupId: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface UpdateGroupResponse {
  }
  export interface UpdateLoggerDefinitionRequest {
    /**
     * The ID of the logger definition.
     */
    LoggerDefinitionId: __string;
    /**
     * The name of the definition.
     */
    Name?: __string;
  }
  export interface UpdateLoggerDefinitionResponse {
  }
  export interface UpdateResourceDefinitionRequest {
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * The ID of the resource definition.
     */
    ResourceDefinitionId: __string;
  }
  export interface UpdateResourceDefinitionResponse {
  }
  export interface UpdateSubscriptionDefinitionRequest {
    /**
     * The name of the definition.
     */
    Name?: __string;
    /**
     * The ID of the subscription definition.
     */
    SubscriptionDefinitionId: __string;
  }
  export interface UpdateSubscriptionDefinitionResponse {
  }
  export type UpdateTargets = __string[];
  export type UpdateTargetsArchitecture = "armv6l"|"armv7l"|"x86_64"|"aarch64"|string;
  export type UpdateTargetsOperatingSystem = "ubuntu"|"raspbian"|"amazon_linux"|"openwrt"|string;
  export interface UpdateThingRuntimeConfigurationRequest {
    /**
     * Configuration for telemetry service.
     */
    TelemetryConfiguration?: TelemetryConfigurationUpdate;
    /**
     * The thing name.
     */
    ThingName: __string;
  }
  export interface UpdateThingRuntimeConfigurationResponse {
  }
  export interface VersionInformation {
    /**
     * The ARN of the version.
     */
    Arn?: __string;
    /**
     * The time, in milliseconds since the epoch, when the version was created.
     */
    CreationTimestamp?: __string;
    /**
     * The ID of the parent definition that the version is associated with.
     */
    Id?: __string;
    /**
     * The ID of the version.
     */
    Version?: __string;
  }
  export type __boolean = boolean;
  export type __integer = number;
  export type __listOfConnectivityInfo = ConnectivityInfo[];
  export type __listOfConnector = Connector[];
  export type __listOfCore = Core[];
  export type __listOfDefinitionInformation = DefinitionInformation[];
  export type __listOfDevice = Device[];
  export type __listOfFunction = Function[];
  export type __listOfGroupCertificateAuthorityProperties = GroupCertificateAuthorityProperties[];
  export type __listOfGroupInformation = GroupInformation[];
  export type __listOfLogger = Logger[];
  export type __listOfResource = Resource[];
  export type __listOfResourceAccessPolicy = ResourceAccessPolicy[];
  export type __listOfSubscription = Subscription[];
  export type __listOfVersionInformation = VersionInformation[];
  export type __listOf__string = __string[];
  export type __mapOf__string = {[key: string]: __string};
  export type __string = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-06-07"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Greengrass client.
   */
  export import Types = Greengrass;
}
export = Greengrass;
