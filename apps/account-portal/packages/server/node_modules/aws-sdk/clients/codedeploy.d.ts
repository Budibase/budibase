import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CodeDeploy extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CodeDeploy.Types.ClientConfiguration)
  config: Config & CodeDeploy.Types.ClientConfiguration;
  /**
   * Adds tags to on-premises instances.
   */
  addTagsToOnPremisesInstances(params: CodeDeploy.Types.AddTagsToOnPremisesInstancesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds tags to on-premises instances.
   */
  addTagsToOnPremisesInstances(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets information about one or more application revisions. The maximum number of application revisions that can be returned is 25.
   */
  batchGetApplicationRevisions(params: CodeDeploy.Types.BatchGetApplicationRevisionsInput, callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetApplicationRevisionsOutput) => void): Request<CodeDeploy.Types.BatchGetApplicationRevisionsOutput, AWSError>;
  /**
   * Gets information about one or more application revisions. The maximum number of application revisions that can be returned is 25.
   */
  batchGetApplicationRevisions(callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetApplicationRevisionsOutput) => void): Request<CodeDeploy.Types.BatchGetApplicationRevisionsOutput, AWSError>;
  /**
   * Gets information about one or more applications. The maximum number of applications that can be returned is 100.
   */
  batchGetApplications(params: CodeDeploy.Types.BatchGetApplicationsInput, callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetApplicationsOutput) => void): Request<CodeDeploy.Types.BatchGetApplicationsOutput, AWSError>;
  /**
   * Gets information about one or more applications. The maximum number of applications that can be returned is 100.
   */
  batchGetApplications(callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetApplicationsOutput) => void): Request<CodeDeploy.Types.BatchGetApplicationsOutput, AWSError>;
  /**
   * Gets information about one or more deployment groups.
   */
  batchGetDeploymentGroups(params: CodeDeploy.Types.BatchGetDeploymentGroupsInput, callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetDeploymentGroupsOutput) => void): Request<CodeDeploy.Types.BatchGetDeploymentGroupsOutput, AWSError>;
  /**
   * Gets information about one or more deployment groups.
   */
  batchGetDeploymentGroups(callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetDeploymentGroupsOutput) => void): Request<CodeDeploy.Types.BatchGetDeploymentGroupsOutput, AWSError>;
  /**
   *   This method works, but is deprecated. Use BatchGetDeploymentTargets instead.    Returns an array of one or more instances associated with a deployment. This method works with EC2/On-premises and Lambda compute platforms. The newer BatchGetDeploymentTargets works with all compute platforms. The maximum number of instances that can be returned is 25.
   */
  batchGetDeploymentInstances(params: CodeDeploy.Types.BatchGetDeploymentInstancesInput, callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetDeploymentInstancesOutput) => void): Request<CodeDeploy.Types.BatchGetDeploymentInstancesOutput, AWSError>;
  /**
   *   This method works, but is deprecated. Use BatchGetDeploymentTargets instead.    Returns an array of one or more instances associated with a deployment. This method works with EC2/On-premises and Lambda compute platforms. The newer BatchGetDeploymentTargets works with all compute platforms. The maximum number of instances that can be returned is 25.
   */
  batchGetDeploymentInstances(callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetDeploymentInstancesOutput) => void): Request<CodeDeploy.Types.BatchGetDeploymentInstancesOutput, AWSError>;
  /**
   *  Returns an array of one or more targets associated with a deployment. This method works with all compute types and should be used instead of the deprecated BatchGetDeploymentInstances. The maximum number of targets that can be returned is 25.  The type of targets returned depends on the deployment's compute platform or deployment method:     EC2/On-premises: Information about Amazon EC2 instance targets.     Lambda: Information about Lambda functions targets.     Amazon ECS: Information about Amazon ECS service targets.     CloudFormation: Information about targets of blue/green deployments initiated by a CloudFormation stack update.  
   */
  batchGetDeploymentTargets(params: CodeDeploy.Types.BatchGetDeploymentTargetsInput, callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetDeploymentTargetsOutput) => void): Request<CodeDeploy.Types.BatchGetDeploymentTargetsOutput, AWSError>;
  /**
   *  Returns an array of one or more targets associated with a deployment. This method works with all compute types and should be used instead of the deprecated BatchGetDeploymentInstances. The maximum number of targets that can be returned is 25.  The type of targets returned depends on the deployment's compute platform or deployment method:     EC2/On-premises: Information about Amazon EC2 instance targets.     Lambda: Information about Lambda functions targets.     Amazon ECS: Information about Amazon ECS service targets.     CloudFormation: Information about targets of blue/green deployments initiated by a CloudFormation stack update.  
   */
  batchGetDeploymentTargets(callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetDeploymentTargetsOutput) => void): Request<CodeDeploy.Types.BatchGetDeploymentTargetsOutput, AWSError>;
  /**
   * Gets information about one or more deployments. The maximum number of deployments that can be returned is 25.
   */
  batchGetDeployments(params: CodeDeploy.Types.BatchGetDeploymentsInput, callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetDeploymentsOutput) => void): Request<CodeDeploy.Types.BatchGetDeploymentsOutput, AWSError>;
  /**
   * Gets information about one or more deployments. The maximum number of deployments that can be returned is 25.
   */
  batchGetDeployments(callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetDeploymentsOutput) => void): Request<CodeDeploy.Types.BatchGetDeploymentsOutput, AWSError>;
  /**
   * Gets information about one or more on-premises instances. The maximum number of on-premises instances that can be returned is 25.
   */
  batchGetOnPremisesInstances(params: CodeDeploy.Types.BatchGetOnPremisesInstancesInput, callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetOnPremisesInstancesOutput) => void): Request<CodeDeploy.Types.BatchGetOnPremisesInstancesOutput, AWSError>;
  /**
   * Gets information about one or more on-premises instances. The maximum number of on-premises instances that can be returned is 25.
   */
  batchGetOnPremisesInstances(callback?: (err: AWSError, data: CodeDeploy.Types.BatchGetOnPremisesInstancesOutput) => void): Request<CodeDeploy.Types.BatchGetOnPremisesInstancesOutput, AWSError>;
  /**
   * For a blue/green deployment, starts the process of rerouting traffic from instances in the original environment to instances in the replacement environment without waiting for a specified wait time to elapse. (Traffic rerouting, which is achieved by registering instances in the replacement environment with the load balancer, can start as soon as all instances have a status of Ready.) 
   */
  continueDeployment(params: CodeDeploy.Types.ContinueDeploymentInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * For a blue/green deployment, starts the process of rerouting traffic from instances in the original environment to instances in the replacement environment without waiting for a specified wait time to elapse. (Traffic rerouting, which is achieved by registering instances in the replacement environment with the load balancer, can start as soon as all instances have a status of Ready.) 
   */
  continueDeployment(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates an application.
   */
  createApplication(params: CodeDeploy.Types.CreateApplicationInput, callback?: (err: AWSError, data: CodeDeploy.Types.CreateApplicationOutput) => void): Request<CodeDeploy.Types.CreateApplicationOutput, AWSError>;
  /**
   * Creates an application.
   */
  createApplication(callback?: (err: AWSError, data: CodeDeploy.Types.CreateApplicationOutput) => void): Request<CodeDeploy.Types.CreateApplicationOutput, AWSError>;
  /**
   * Deploys an application revision through the specified deployment group.
   */
  createDeployment(params: CodeDeploy.Types.CreateDeploymentInput, callback?: (err: AWSError, data: CodeDeploy.Types.CreateDeploymentOutput) => void): Request<CodeDeploy.Types.CreateDeploymentOutput, AWSError>;
  /**
   * Deploys an application revision through the specified deployment group.
   */
  createDeployment(callback?: (err: AWSError, data: CodeDeploy.Types.CreateDeploymentOutput) => void): Request<CodeDeploy.Types.CreateDeploymentOutput, AWSError>;
  /**
   *  Creates a deployment configuration. 
   */
  createDeploymentConfig(params: CodeDeploy.Types.CreateDeploymentConfigInput, callback?: (err: AWSError, data: CodeDeploy.Types.CreateDeploymentConfigOutput) => void): Request<CodeDeploy.Types.CreateDeploymentConfigOutput, AWSError>;
  /**
   *  Creates a deployment configuration. 
   */
  createDeploymentConfig(callback?: (err: AWSError, data: CodeDeploy.Types.CreateDeploymentConfigOutput) => void): Request<CodeDeploy.Types.CreateDeploymentConfigOutput, AWSError>;
  /**
   * Creates a deployment group to which application revisions are deployed.
   */
  createDeploymentGroup(params: CodeDeploy.Types.CreateDeploymentGroupInput, callback?: (err: AWSError, data: CodeDeploy.Types.CreateDeploymentGroupOutput) => void): Request<CodeDeploy.Types.CreateDeploymentGroupOutput, AWSError>;
  /**
   * Creates a deployment group to which application revisions are deployed.
   */
  createDeploymentGroup(callback?: (err: AWSError, data: CodeDeploy.Types.CreateDeploymentGroupOutput) => void): Request<CodeDeploy.Types.CreateDeploymentGroupOutput, AWSError>;
  /**
   * Deletes an application.
   */
  deleteApplication(params: CodeDeploy.Types.DeleteApplicationInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an application.
   */
  deleteApplication(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a deployment configuration.  A deployment configuration cannot be deleted if it is currently in use. Predefined configurations cannot be deleted. 
   */
  deleteDeploymentConfig(params: CodeDeploy.Types.DeleteDeploymentConfigInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a deployment configuration.  A deployment configuration cannot be deleted if it is currently in use. Predefined configurations cannot be deleted. 
   */
  deleteDeploymentConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a deployment group.
   */
  deleteDeploymentGroup(params: CodeDeploy.Types.DeleteDeploymentGroupInput, callback?: (err: AWSError, data: CodeDeploy.Types.DeleteDeploymentGroupOutput) => void): Request<CodeDeploy.Types.DeleteDeploymentGroupOutput, AWSError>;
  /**
   * Deletes a deployment group.
   */
  deleteDeploymentGroup(callback?: (err: AWSError, data: CodeDeploy.Types.DeleteDeploymentGroupOutput) => void): Request<CodeDeploy.Types.DeleteDeploymentGroupOutput, AWSError>;
  /**
   * Deletes a GitHub account connection.
   */
  deleteGitHubAccountToken(params: CodeDeploy.Types.DeleteGitHubAccountTokenInput, callback?: (err: AWSError, data: CodeDeploy.Types.DeleteGitHubAccountTokenOutput) => void): Request<CodeDeploy.Types.DeleteGitHubAccountTokenOutput, AWSError>;
  /**
   * Deletes a GitHub account connection.
   */
  deleteGitHubAccountToken(callback?: (err: AWSError, data: CodeDeploy.Types.DeleteGitHubAccountTokenOutput) => void): Request<CodeDeploy.Types.DeleteGitHubAccountTokenOutput, AWSError>;
  /**
   * Deletes resources linked to an external ID. This action only applies if you have configured blue/green deployments through CloudFormation.   It is not necessary to call this action directly. CloudFormation calls it on your behalf when it needs to delete stack resources. This action is offered publicly in case you need to delete resources to comply with General Data Protection Regulation (GDPR) requirements. 
   */
  deleteResourcesByExternalId(params: CodeDeploy.Types.DeleteResourcesByExternalIdInput, callback?: (err: AWSError, data: CodeDeploy.Types.DeleteResourcesByExternalIdOutput) => void): Request<CodeDeploy.Types.DeleteResourcesByExternalIdOutput, AWSError>;
  /**
   * Deletes resources linked to an external ID. This action only applies if you have configured blue/green deployments through CloudFormation.   It is not necessary to call this action directly. CloudFormation calls it on your behalf when it needs to delete stack resources. This action is offered publicly in case you need to delete resources to comply with General Data Protection Regulation (GDPR) requirements. 
   */
  deleteResourcesByExternalId(callback?: (err: AWSError, data: CodeDeploy.Types.DeleteResourcesByExternalIdOutput) => void): Request<CodeDeploy.Types.DeleteResourcesByExternalIdOutput, AWSError>;
  /**
   * Deregisters an on-premises instance.
   */
  deregisterOnPremisesInstance(params: CodeDeploy.Types.DeregisterOnPremisesInstanceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deregisters an on-premises instance.
   */
  deregisterOnPremisesInstance(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets information about an application.
   */
  getApplication(params: CodeDeploy.Types.GetApplicationInput, callback?: (err: AWSError, data: CodeDeploy.Types.GetApplicationOutput) => void): Request<CodeDeploy.Types.GetApplicationOutput, AWSError>;
  /**
   * Gets information about an application.
   */
  getApplication(callback?: (err: AWSError, data: CodeDeploy.Types.GetApplicationOutput) => void): Request<CodeDeploy.Types.GetApplicationOutput, AWSError>;
  /**
   * Gets information about an application revision.
   */
  getApplicationRevision(params: CodeDeploy.Types.GetApplicationRevisionInput, callback?: (err: AWSError, data: CodeDeploy.Types.GetApplicationRevisionOutput) => void): Request<CodeDeploy.Types.GetApplicationRevisionOutput, AWSError>;
  /**
   * Gets information about an application revision.
   */
  getApplicationRevision(callback?: (err: AWSError, data: CodeDeploy.Types.GetApplicationRevisionOutput) => void): Request<CodeDeploy.Types.GetApplicationRevisionOutput, AWSError>;
  /**
   * Gets information about a deployment.   The content property of the appSpecContent object in the returned revision is always null. Use GetApplicationRevision and the sha256 property of the returned appSpecContent object to get the content of the deployment’s AppSpec file.  
   */
  getDeployment(params: CodeDeploy.Types.GetDeploymentInput, callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentOutput) => void): Request<CodeDeploy.Types.GetDeploymentOutput, AWSError>;
  /**
   * Gets information about a deployment.   The content property of the appSpecContent object in the returned revision is always null. Use GetApplicationRevision and the sha256 property of the returned appSpecContent object to get the content of the deployment’s AppSpec file.  
   */
  getDeployment(callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentOutput) => void): Request<CodeDeploy.Types.GetDeploymentOutput, AWSError>;
  /**
   * Gets information about a deployment configuration.
   */
  getDeploymentConfig(params: CodeDeploy.Types.GetDeploymentConfigInput, callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentConfigOutput) => void): Request<CodeDeploy.Types.GetDeploymentConfigOutput, AWSError>;
  /**
   * Gets information about a deployment configuration.
   */
  getDeploymentConfig(callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentConfigOutput) => void): Request<CodeDeploy.Types.GetDeploymentConfigOutput, AWSError>;
  /**
   * Gets information about a deployment group.
   */
  getDeploymentGroup(params: CodeDeploy.Types.GetDeploymentGroupInput, callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentGroupOutput) => void): Request<CodeDeploy.Types.GetDeploymentGroupOutput, AWSError>;
  /**
   * Gets information about a deployment group.
   */
  getDeploymentGroup(callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentGroupOutput) => void): Request<CodeDeploy.Types.GetDeploymentGroupOutput, AWSError>;
  /**
   * Gets information about an instance as part of a deployment.
   */
  getDeploymentInstance(params: CodeDeploy.Types.GetDeploymentInstanceInput, callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentInstanceOutput) => void): Request<CodeDeploy.Types.GetDeploymentInstanceOutput, AWSError>;
  /**
   * Gets information about an instance as part of a deployment.
   */
  getDeploymentInstance(callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentInstanceOutput) => void): Request<CodeDeploy.Types.GetDeploymentInstanceOutput, AWSError>;
  /**
   *  Returns information about a deployment target. 
   */
  getDeploymentTarget(params: CodeDeploy.Types.GetDeploymentTargetInput, callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentTargetOutput) => void): Request<CodeDeploy.Types.GetDeploymentTargetOutput, AWSError>;
  /**
   *  Returns information about a deployment target. 
   */
  getDeploymentTarget(callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentTargetOutput) => void): Request<CodeDeploy.Types.GetDeploymentTargetOutput, AWSError>;
  /**
   *  Gets information about an on-premises instance. 
   */
  getOnPremisesInstance(params: CodeDeploy.Types.GetOnPremisesInstanceInput, callback?: (err: AWSError, data: CodeDeploy.Types.GetOnPremisesInstanceOutput) => void): Request<CodeDeploy.Types.GetOnPremisesInstanceOutput, AWSError>;
  /**
   *  Gets information about an on-premises instance. 
   */
  getOnPremisesInstance(callback?: (err: AWSError, data: CodeDeploy.Types.GetOnPremisesInstanceOutput) => void): Request<CodeDeploy.Types.GetOnPremisesInstanceOutput, AWSError>;
  /**
   * Lists information about revisions for an application.
   */
  listApplicationRevisions(params: CodeDeploy.Types.ListApplicationRevisionsInput, callback?: (err: AWSError, data: CodeDeploy.Types.ListApplicationRevisionsOutput) => void): Request<CodeDeploy.Types.ListApplicationRevisionsOutput, AWSError>;
  /**
   * Lists information about revisions for an application.
   */
  listApplicationRevisions(callback?: (err: AWSError, data: CodeDeploy.Types.ListApplicationRevisionsOutput) => void): Request<CodeDeploy.Types.ListApplicationRevisionsOutput, AWSError>;
  /**
   * Lists the applications registered with the user or Amazon Web Services account.
   */
  listApplications(params: CodeDeploy.Types.ListApplicationsInput, callback?: (err: AWSError, data: CodeDeploy.Types.ListApplicationsOutput) => void): Request<CodeDeploy.Types.ListApplicationsOutput, AWSError>;
  /**
   * Lists the applications registered with the user or Amazon Web Services account.
   */
  listApplications(callback?: (err: AWSError, data: CodeDeploy.Types.ListApplicationsOutput) => void): Request<CodeDeploy.Types.ListApplicationsOutput, AWSError>;
  /**
   * Lists the deployment configurations with the user or Amazon Web Services account.
   */
  listDeploymentConfigs(params: CodeDeploy.Types.ListDeploymentConfigsInput, callback?: (err: AWSError, data: CodeDeploy.Types.ListDeploymentConfigsOutput) => void): Request<CodeDeploy.Types.ListDeploymentConfigsOutput, AWSError>;
  /**
   * Lists the deployment configurations with the user or Amazon Web Services account.
   */
  listDeploymentConfigs(callback?: (err: AWSError, data: CodeDeploy.Types.ListDeploymentConfigsOutput) => void): Request<CodeDeploy.Types.ListDeploymentConfigsOutput, AWSError>;
  /**
   * Lists the deployment groups for an application registered with the Amazon Web Services user or Amazon Web Services account.
   */
  listDeploymentGroups(params: CodeDeploy.Types.ListDeploymentGroupsInput, callback?: (err: AWSError, data: CodeDeploy.Types.ListDeploymentGroupsOutput) => void): Request<CodeDeploy.Types.ListDeploymentGroupsOutput, AWSError>;
  /**
   * Lists the deployment groups for an application registered with the Amazon Web Services user or Amazon Web Services account.
   */
  listDeploymentGroups(callback?: (err: AWSError, data: CodeDeploy.Types.ListDeploymentGroupsOutput) => void): Request<CodeDeploy.Types.ListDeploymentGroupsOutput, AWSError>;
  /**
   *   The newer BatchGetDeploymentTargets should be used instead because it works with all compute types. ListDeploymentInstances throws an exception if it is used with a compute platform other than EC2/On-premises or Lambda.    Lists the instance for a deployment associated with the user or Amazon Web Services account. 
   */
  listDeploymentInstances(params: CodeDeploy.Types.ListDeploymentInstancesInput, callback?: (err: AWSError, data: CodeDeploy.Types.ListDeploymentInstancesOutput) => void): Request<CodeDeploy.Types.ListDeploymentInstancesOutput, AWSError>;
  /**
   *   The newer BatchGetDeploymentTargets should be used instead because it works with all compute types. ListDeploymentInstances throws an exception if it is used with a compute platform other than EC2/On-premises or Lambda.    Lists the instance for a deployment associated with the user or Amazon Web Services account. 
   */
  listDeploymentInstances(callback?: (err: AWSError, data: CodeDeploy.Types.ListDeploymentInstancesOutput) => void): Request<CodeDeploy.Types.ListDeploymentInstancesOutput, AWSError>;
  /**
   *  Returns an array of target IDs that are associated a deployment. 
   */
  listDeploymentTargets(params: CodeDeploy.Types.ListDeploymentTargetsInput, callback?: (err: AWSError, data: CodeDeploy.Types.ListDeploymentTargetsOutput) => void): Request<CodeDeploy.Types.ListDeploymentTargetsOutput, AWSError>;
  /**
   *  Returns an array of target IDs that are associated a deployment. 
   */
  listDeploymentTargets(callback?: (err: AWSError, data: CodeDeploy.Types.ListDeploymentTargetsOutput) => void): Request<CodeDeploy.Types.ListDeploymentTargetsOutput, AWSError>;
  /**
   * Lists the deployments in a deployment group for an application registered with the user or Amazon Web Services account.
   */
  listDeployments(params: CodeDeploy.Types.ListDeploymentsInput, callback?: (err: AWSError, data: CodeDeploy.Types.ListDeploymentsOutput) => void): Request<CodeDeploy.Types.ListDeploymentsOutput, AWSError>;
  /**
   * Lists the deployments in a deployment group for an application registered with the user or Amazon Web Services account.
   */
  listDeployments(callback?: (err: AWSError, data: CodeDeploy.Types.ListDeploymentsOutput) => void): Request<CodeDeploy.Types.ListDeploymentsOutput, AWSError>;
  /**
   * Lists the names of stored connections to GitHub accounts.
   */
  listGitHubAccountTokenNames(params: CodeDeploy.Types.ListGitHubAccountTokenNamesInput, callback?: (err: AWSError, data: CodeDeploy.Types.ListGitHubAccountTokenNamesOutput) => void): Request<CodeDeploy.Types.ListGitHubAccountTokenNamesOutput, AWSError>;
  /**
   * Lists the names of stored connections to GitHub accounts.
   */
  listGitHubAccountTokenNames(callback?: (err: AWSError, data: CodeDeploy.Types.ListGitHubAccountTokenNamesOutput) => void): Request<CodeDeploy.Types.ListGitHubAccountTokenNamesOutput, AWSError>;
  /**
   * Gets a list of names for one or more on-premises instances. Unless otherwise specified, both registered and deregistered on-premises instance names are listed. To list only registered or deregistered on-premises instance names, use the registration status parameter.
   */
  listOnPremisesInstances(params: CodeDeploy.Types.ListOnPremisesInstancesInput, callback?: (err: AWSError, data: CodeDeploy.Types.ListOnPremisesInstancesOutput) => void): Request<CodeDeploy.Types.ListOnPremisesInstancesOutput, AWSError>;
  /**
   * Gets a list of names for one or more on-premises instances. Unless otherwise specified, both registered and deregistered on-premises instance names are listed. To list only registered or deregistered on-premises instance names, use the registration status parameter.
   */
  listOnPremisesInstances(callback?: (err: AWSError, data: CodeDeploy.Types.ListOnPremisesInstancesOutput) => void): Request<CodeDeploy.Types.ListOnPremisesInstancesOutput, AWSError>;
  /**
   *  Returns a list of tags for the resource identified by a specified Amazon Resource Name (ARN). Tags are used to organize and categorize your CodeDeploy resources. 
   */
  listTagsForResource(params: CodeDeploy.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: CodeDeploy.Types.ListTagsForResourceOutput) => void): Request<CodeDeploy.Types.ListTagsForResourceOutput, AWSError>;
  /**
   *  Returns a list of tags for the resource identified by a specified Amazon Resource Name (ARN). Tags are used to organize and categorize your CodeDeploy resources. 
   */
  listTagsForResource(callback?: (err: AWSError, data: CodeDeploy.Types.ListTagsForResourceOutput) => void): Request<CodeDeploy.Types.ListTagsForResourceOutput, AWSError>;
  /**
   *  Sets the result of a Lambda validation function. The function validates lifecycle hooks during a deployment that uses the Lambda or Amazon ECS compute platform. For Lambda deployments, the available lifecycle hooks are BeforeAllowTraffic and AfterAllowTraffic. For Amazon ECS deployments, the available lifecycle hooks are BeforeInstall, AfterInstall, AfterAllowTestTraffic, BeforeAllowTraffic, and AfterAllowTraffic. Lambda validation functions return Succeeded or Failed. For more information, see AppSpec 'hooks' Section for an Lambda Deployment  and AppSpec 'hooks' Section for an Amazon ECS Deployment.
   */
  putLifecycleEventHookExecutionStatus(params: CodeDeploy.Types.PutLifecycleEventHookExecutionStatusInput, callback?: (err: AWSError, data: CodeDeploy.Types.PutLifecycleEventHookExecutionStatusOutput) => void): Request<CodeDeploy.Types.PutLifecycleEventHookExecutionStatusOutput, AWSError>;
  /**
   *  Sets the result of a Lambda validation function. The function validates lifecycle hooks during a deployment that uses the Lambda or Amazon ECS compute platform. For Lambda deployments, the available lifecycle hooks are BeforeAllowTraffic and AfterAllowTraffic. For Amazon ECS deployments, the available lifecycle hooks are BeforeInstall, AfterInstall, AfterAllowTestTraffic, BeforeAllowTraffic, and AfterAllowTraffic. Lambda validation functions return Succeeded or Failed. For more information, see AppSpec 'hooks' Section for an Lambda Deployment  and AppSpec 'hooks' Section for an Amazon ECS Deployment.
   */
  putLifecycleEventHookExecutionStatus(callback?: (err: AWSError, data: CodeDeploy.Types.PutLifecycleEventHookExecutionStatusOutput) => void): Request<CodeDeploy.Types.PutLifecycleEventHookExecutionStatusOutput, AWSError>;
  /**
   * Registers with CodeDeploy a revision for the specified application.
   */
  registerApplicationRevision(params: CodeDeploy.Types.RegisterApplicationRevisionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Registers with CodeDeploy a revision for the specified application.
   */
  registerApplicationRevision(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Registers an on-premises instance.  Only one IAM ARN (an IAM session ARN or IAM user ARN) is supported in the request. You cannot use both. 
   */
  registerOnPremisesInstance(params: CodeDeploy.Types.RegisterOnPremisesInstanceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Registers an on-premises instance.  Only one IAM ARN (an IAM session ARN or IAM user ARN) is supported in the request. You cannot use both. 
   */
  registerOnPremisesInstance(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes one or more tags from one or more on-premises instances.
   */
  removeTagsFromOnPremisesInstances(params: CodeDeploy.Types.RemoveTagsFromOnPremisesInstancesInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes one or more tags from one or more on-premises instances.
   */
  removeTagsFromOnPremisesInstances(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * In a blue/green deployment, overrides any specified wait time and starts terminating instances immediately after the traffic routing is complete.
   */
  skipWaitTimeForInstanceTermination(params: CodeDeploy.Types.SkipWaitTimeForInstanceTerminationInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * In a blue/green deployment, overrides any specified wait time and starts terminating instances immediately after the traffic routing is complete.
   */
  skipWaitTimeForInstanceTermination(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attempts to stop an ongoing deployment.
   */
  stopDeployment(params: CodeDeploy.Types.StopDeploymentInput, callback?: (err: AWSError, data: CodeDeploy.Types.StopDeploymentOutput) => void): Request<CodeDeploy.Types.StopDeploymentOutput, AWSError>;
  /**
   * Attempts to stop an ongoing deployment.
   */
  stopDeployment(callback?: (err: AWSError, data: CodeDeploy.Types.StopDeploymentOutput) => void): Request<CodeDeploy.Types.StopDeploymentOutput, AWSError>;
  /**
   *  Associates the list of tags in the input Tags parameter with the resource identified by the ResourceArn input parameter. 
   */
  tagResource(params: CodeDeploy.Types.TagResourceInput, callback?: (err: AWSError, data: CodeDeploy.Types.TagResourceOutput) => void): Request<CodeDeploy.Types.TagResourceOutput, AWSError>;
  /**
   *  Associates the list of tags in the input Tags parameter with the resource identified by the ResourceArn input parameter. 
   */
  tagResource(callback?: (err: AWSError, data: CodeDeploy.Types.TagResourceOutput) => void): Request<CodeDeploy.Types.TagResourceOutput, AWSError>;
  /**
   *  Disassociates a resource from a list of tags. The resource is identified by the ResourceArn input parameter. The tags are identified by the list of keys in the TagKeys input parameter. 
   */
  untagResource(params: CodeDeploy.Types.UntagResourceInput, callback?: (err: AWSError, data: CodeDeploy.Types.UntagResourceOutput) => void): Request<CodeDeploy.Types.UntagResourceOutput, AWSError>;
  /**
   *  Disassociates a resource from a list of tags. The resource is identified by the ResourceArn input parameter. The tags are identified by the list of keys in the TagKeys input parameter. 
   */
  untagResource(callback?: (err: AWSError, data: CodeDeploy.Types.UntagResourceOutput) => void): Request<CodeDeploy.Types.UntagResourceOutput, AWSError>;
  /**
   * Changes the name of an application.
   */
  updateApplication(params: CodeDeploy.Types.UpdateApplicationInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes the name of an application.
   */
  updateApplication(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Changes information about a deployment group.
   */
  updateDeploymentGroup(params: CodeDeploy.Types.UpdateDeploymentGroupInput, callback?: (err: AWSError, data: CodeDeploy.Types.UpdateDeploymentGroupOutput) => void): Request<CodeDeploy.Types.UpdateDeploymentGroupOutput, AWSError>;
  /**
   * Changes information about a deployment group.
   */
  updateDeploymentGroup(callback?: (err: AWSError, data: CodeDeploy.Types.UpdateDeploymentGroupOutput) => void): Request<CodeDeploy.Types.UpdateDeploymentGroupOutput, AWSError>;
  /**
   * Waits for the deploymentSuccessful state by periodically calling the underlying CodeDeploy.getDeploymentoperation every 15 seconds (at most 120 times).
   */
  waitFor(state: "deploymentSuccessful", params: CodeDeploy.Types.GetDeploymentInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentOutput) => void): Request<CodeDeploy.Types.GetDeploymentOutput, AWSError>;
  /**
   * Waits for the deploymentSuccessful state by periodically calling the underlying CodeDeploy.getDeploymentoperation every 15 seconds (at most 120 times).
   */
  waitFor(state: "deploymentSuccessful", callback?: (err: AWSError, data: CodeDeploy.Types.GetDeploymentOutput) => void): Request<CodeDeploy.Types.GetDeploymentOutput, AWSError>;
}
declare namespace CodeDeploy {
  export interface AddTagsToOnPremisesInstancesInput {
    /**
     * The tag key-value pairs to add to the on-premises instances. Keys and values are both required. Keys cannot be null or empty strings. Value-only tags are not allowed.
     */
    tags: TagList;
    /**
     * The names of the on-premises instances to which to add tags.
     */
    instanceNames: InstanceNameList;
  }
  export type AdditionalDeploymentStatusInfo = string;
  export interface Alarm {
    /**
     * The name of the alarm. Maximum length is 255 characters. Each alarm name can be used only once in a list of alarms.
     */
    name?: AlarmName;
  }
  export interface AlarmConfiguration {
    /**
     * Indicates whether the alarm configuration is enabled.
     */
    enabled?: Boolean;
    /**
     * Indicates whether a deployment should continue if information about the current state of alarms cannot be retrieved from Amazon CloudWatch. The default value is false.    true: The deployment proceeds even if alarm status information can't be retrieved from Amazon CloudWatch.    false: The deployment stops if alarm status information can't be retrieved from Amazon CloudWatch.  
     */
    ignorePollAlarmFailure?: Boolean;
    /**
     * A list of alarms configured for the deployment or deployment group. A maximum of 10 alarms can be added.
     */
    alarms?: AlarmList;
  }
  export type AlarmList = Alarm[];
  export type AlarmName = string;
  export interface AppSpecContent {
    /**
     *  The YAML-formatted or JSON-formatted revision string.   For an Lambda deployment, the content includes a Lambda function name, the alias for its original version, and the alias for its replacement version. The deployment shifts traffic from the original version of the Lambda function to the replacement version.   For an Amazon ECS deployment, the content includes the task name, information about the load balancer that serves traffic to the container, and more.   For both types of deployments, the content can specify Lambda functions that run at specified hooks, such as BeforeInstall, during a deployment. 
     */
    content?: RawStringContent;
    /**
     *  The SHA256 hash value of the revision content. 
     */
    sha256?: RawStringSha256;
  }
  export type ApplicationId = string;
  export interface ApplicationInfo {
    /**
     * The application ID.
     */
    applicationId?: ApplicationId;
    /**
     * The application name.
     */
    applicationName?: ApplicationName;
    /**
     * The time at which the application was created.
     */
    createTime?: Timestamp;
    /**
     * True if the user has authenticated with GitHub for the specified application. Otherwise, false.
     */
    linkedToGitHub?: Boolean;
    /**
     * The name for a connection to a GitHub account.
     */
    gitHubAccountName?: GitHubAccountTokenName;
    /**
     * The destination platform type for deployment of the application (Lambda or Server).
     */
    computePlatform?: ComputePlatform;
  }
  export type ApplicationName = string;
  export type ApplicationRevisionSortBy = "registerTime"|"firstUsedTime"|"lastUsedTime"|string;
  export type ApplicationsInfoList = ApplicationInfo[];
  export type ApplicationsList = ApplicationName[];
  export type Arn = string;
  export interface AutoRollbackConfiguration {
    /**
     * Indicates whether a defined automatic rollback configuration is currently enabled.
     */
    enabled?: Boolean;
    /**
     * The event type or types that trigger a rollback.
     */
    events?: AutoRollbackEventsList;
  }
  export type AutoRollbackEvent = "DEPLOYMENT_FAILURE"|"DEPLOYMENT_STOP_ON_ALARM"|"DEPLOYMENT_STOP_ON_REQUEST"|string;
  export type AutoRollbackEventsList = AutoRollbackEvent[];
  export interface AutoScalingGroup {
    /**
     * The Auto Scaling group name.
     */
    name?: AutoScalingGroupName;
    /**
     * An Auto Scaling lifecycle event hook name.
     */
    hook?: AutoScalingGroupHook;
  }
  export type AutoScalingGroupHook = string;
  export type AutoScalingGroupList = AutoScalingGroup[];
  export type AutoScalingGroupName = string;
  export type AutoScalingGroupNameList = AutoScalingGroupName[];
  export interface BatchGetApplicationRevisionsInput {
    /**
     * The name of an CodeDeploy application about which to get revision information.
     */
    applicationName: ApplicationName;
    /**
     * An array of RevisionLocation objects that specify information to get about the application revisions, including type and location. The maximum number of RevisionLocation objects you can specify is 25.
     */
    revisions: RevisionLocationList;
  }
  export interface BatchGetApplicationRevisionsOutput {
    /**
     * The name of the application that corresponds to the revisions.
     */
    applicationName?: ApplicationName;
    /**
     * Information about errors that might have occurred during the API call.
     */
    errorMessage?: ErrorMessage;
    /**
     * Additional information about the revisions, including the type and location.
     */
    revisions?: RevisionInfoList;
  }
  export interface BatchGetApplicationsInput {
    /**
     * A list of application names separated by spaces. The maximum number of application names you can specify is 100.
     */
    applicationNames: ApplicationsList;
  }
  export interface BatchGetApplicationsOutput {
    /**
     * Information about the applications.
     */
    applicationsInfo?: ApplicationsInfoList;
  }
  export interface BatchGetDeploymentGroupsInput {
    /**
     * The name of an CodeDeploy application associated with the applicable user or Amazon Web Services account.
     */
    applicationName: ApplicationName;
    /**
     * The names of the deployment groups.
     */
    deploymentGroupNames: DeploymentGroupsList;
  }
  export interface BatchGetDeploymentGroupsOutput {
    /**
     * Information about the deployment groups.
     */
    deploymentGroupsInfo?: DeploymentGroupInfoList;
    /**
     * Information about errors that might have occurred during the API call.
     */
    errorMessage?: ErrorMessage;
  }
  export interface BatchGetDeploymentInstancesInput {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId: DeploymentId;
    /**
     * The unique IDs of instances used in the deployment. The maximum number of instance IDs you can specify is 25.
     */
    instanceIds: InstancesList;
  }
  export interface BatchGetDeploymentInstancesOutput {
    /**
     * Information about the instance.
     */
    instancesSummary?: InstanceSummaryList;
    /**
     * Information about errors that might have occurred during the API call.
     */
    errorMessage?: ErrorMessage;
  }
  export interface BatchGetDeploymentTargetsInput {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId?: DeploymentId;
    /**
     *  The unique IDs of the deployment targets. The compute platform of the deployment determines the type of the targets and their formats. The maximum number of deployment target IDs you can specify is 25.    For deployments that use the EC2/On-premises compute platform, the target IDs are Amazon EC2 or on-premises instances IDs, and their target type is instanceTarget.     For deployments that use the Lambda compute platform, the target IDs are the names of Lambda functions, and their target type is instanceTarget.     For deployments that use the Amazon ECS compute platform, the target IDs are pairs of Amazon ECS clusters and services specified using the format &lt;clustername&gt;:&lt;servicename&gt;. Their target type is ecsTarget.     For deployments that are deployed with CloudFormation, the target IDs are CloudFormation stack IDs. Their target type is cloudFormationTarget.   
     */
    targetIds?: TargetIdList;
  }
  export interface BatchGetDeploymentTargetsOutput {
    /**
     *  A list of target objects for a deployment. Each target object contains details about the target, such as its status and lifecycle events. The type of the target objects depends on the deployment' compute platform.     EC2/On-premises: Each target object is an Amazon EC2 or on-premises instance.     Lambda: The target object is a specific version of an Lambda function.     Amazon ECS: The target object is an Amazon ECS service.     CloudFormation: The target object is an CloudFormation blue/green deployment.   
     */
    deploymentTargets?: DeploymentTargetList;
  }
  export interface BatchGetDeploymentsInput {
    /**
     *  A list of deployment IDs, separated by spaces. The maximum number of deployment IDs you can specify is 25.
     */
    deploymentIds: DeploymentsList;
  }
  export interface BatchGetDeploymentsOutput {
    /**
     *  Information about the deployments. 
     */
    deploymentsInfo?: DeploymentsInfoList;
  }
  export interface BatchGetOnPremisesInstancesInput {
    /**
     * The names of the on-premises instances about which to get information. The maximum number of instance names you can specify is 25.
     */
    instanceNames: InstanceNameList;
  }
  export interface BatchGetOnPremisesInstancesOutput {
    /**
     * Information about the on-premises instances.
     */
    instanceInfos?: InstanceInfoList;
  }
  export interface BlueGreenDeploymentConfiguration {
    /**
     * Information about whether to terminate instances in the original fleet during a blue/green deployment.
     */
    terminateBlueInstancesOnDeploymentSuccess?: BlueInstanceTerminationOption;
    /**
     * Information about the action to take when newly provisioned instances are ready to receive traffic in a blue/green deployment.
     */
    deploymentReadyOption?: DeploymentReadyOption;
    /**
     * Information about how instances are provisioned for a replacement environment in a blue/green deployment.
     */
    greenFleetProvisioningOption?: GreenFleetProvisioningOption;
  }
  export interface BlueInstanceTerminationOption {
    /**
     * The action to take on instances in the original environment after a successful blue/green deployment.    TERMINATE: Instances are terminated after a specified wait time.    KEEP_ALIVE: Instances are left running after they are deregistered from the load balancer and removed from the deployment group.  
     */
    action?: InstanceAction;
    /**
     * For an Amazon EC2 deployment, the number of minutes to wait after a successful blue/green deployment before terminating instances from the original environment.  For an Amazon ECS deployment, the number of minutes before deleting the original (blue) task set. During an Amazon ECS deployment, CodeDeploy shifts traffic from the original (blue) task set to a replacement (green) task set.   The maximum setting is 2880 minutes (2 days). 
     */
    terminationWaitTimeInMinutes?: Duration;
  }
  export type Boolean = boolean;
  export type BundleType = "tar"|"tgz"|"zip"|"YAML"|"JSON"|string;
  export type CloudFormationResourceType = string;
  export interface CloudFormationTarget {
    /**
     * The unique ID of an CloudFormation blue/green deployment.
     */
    deploymentId?: DeploymentId;
    /**
     *  The unique ID of a deployment target that has a type of CloudFormationTarget. 
     */
    targetId?: TargetId;
    /**
     *  The date and time when the target application was updated by an CloudFormation blue/green deployment. 
     */
    lastUpdatedAt?: Time;
    /**
     *  The lifecycle events of the CloudFormation blue/green deployment to this target application. 
     */
    lifecycleEvents?: LifecycleEventList;
    /**
     *  The status of an CloudFormation blue/green deployment's target application. 
     */
    status?: TargetStatus;
    /**
     * The resource type for the CloudFormation blue/green deployment.
     */
    resourceType?: CloudFormationResourceType;
    /**
     * The percentage of production traffic that the target version of an CloudFormation blue/green deployment receives.
     */
    targetVersionWeight?: TrafficWeight;
  }
  export type CommitId = string;
  export type ComputePlatform = "Server"|"Lambda"|"ECS"|string;
  export interface ContinueDeploymentInput {
    /**
     *  The unique ID of a blue/green deployment for which you want to start rerouting traffic to the replacement environment. 
     */
    deploymentId?: DeploymentId;
    /**
     *  The status of the deployment's waiting period. READY_WAIT indicates that the deployment is ready to start shifting traffic. TERMINATION_WAIT indicates that the traffic is shifted, but the original target is not terminated. 
     */
    deploymentWaitType?: DeploymentWaitType;
  }
  export interface CreateApplicationInput {
    /**
     * The name of the application. This name must be unique with the applicable user or Amazon Web Services account.
     */
    applicationName: ApplicationName;
    /**
     *  The destination platform type for the deployment (Lambda, Server, or ECS).
     */
    computePlatform?: ComputePlatform;
    /**
     *  The metadata that you apply to CodeDeploy applications to help you organize and categorize them. Each tag consists of a key and an optional value, both of which you define. 
     */
    tags?: TagList;
  }
  export interface CreateApplicationOutput {
    /**
     * A unique application ID.
     */
    applicationId?: ApplicationId;
  }
  export interface CreateDeploymentConfigInput {
    /**
     * The name of the deployment configuration to create.
     */
    deploymentConfigName: DeploymentConfigName;
    /**
     * The minimum number of healthy instances that should be available at any time during the deployment. There are two parameters expected in the input: type and value. The type parameter takes either of the following values:   HOST_COUNT: The value parameter represents the minimum number of healthy instances as an absolute value.   FLEET_PERCENT: The value parameter represents the minimum number of healthy instances as a percentage of the total number of instances in the deployment. If you specify FLEET_PERCENT, at the start of the deployment, CodeDeploy converts the percentage to the equivalent number of instances and rounds up fractional instances.   The value parameter takes an integer. For example, to set a minimum of 95% healthy instance, specify a type of FLEET_PERCENT and a value of 95.
     */
    minimumHealthyHosts?: MinimumHealthyHosts;
    /**
     * The configuration that specifies how the deployment traffic is routed.
     */
    trafficRoutingConfig?: TrafficRoutingConfig;
    /**
     * The destination platform type for the deployment (Lambda, Server, or ECS).
     */
    computePlatform?: ComputePlatform;
  }
  export interface CreateDeploymentConfigOutput {
    /**
     * A unique deployment configuration ID.
     */
    deploymentConfigId?: DeploymentConfigId;
  }
  export interface CreateDeploymentGroupInput {
    /**
     * The name of an CodeDeploy application associated with the user or Amazon Web Services account.
     */
    applicationName: ApplicationName;
    /**
     * The name of a new deployment group for the specified application.
     */
    deploymentGroupName: DeploymentGroupName;
    /**
     * If specified, the deployment configuration name can be either one of the predefined configurations provided with CodeDeploy or a custom deployment configuration that you create by calling the create deployment configuration operation.  CodeDeployDefault.OneAtATime is the default deployment configuration. It is used if a configuration isn't specified for the deployment or deployment group. For more information about the predefined deployment configurations in CodeDeploy, see Working with Deployment Configurations in CodeDeploy in the CodeDeploy User Guide.
     */
    deploymentConfigName?: DeploymentConfigName;
    /**
     * The Amazon EC2 tags on which to filter. The deployment group includes Amazon EC2 instances with any of the specified tags. Cannot be used in the same call as ec2TagSet.
     */
    ec2TagFilters?: EC2TagFilterList;
    /**
     * The on-premises instance tags on which to filter. The deployment group includes on-premises instances with any of the specified tags. Cannot be used in the same call as OnPremisesTagSet.
     */
    onPremisesInstanceTagFilters?: TagFilterList;
    /**
     * A list of associated Amazon EC2 Auto Scaling groups.
     */
    autoScalingGroups?: AutoScalingGroupNameList;
    /**
     * A service role Amazon Resource Name (ARN) that allows CodeDeploy to act on the user's behalf when interacting with Amazon Web Services services.
     */
    serviceRoleArn: Role;
    /**
     * Information about triggers to create when the deployment group is created. For examples, see Create a Trigger for an CodeDeploy Event in the CodeDeploy User Guide.
     */
    triggerConfigurations?: TriggerConfigList;
    /**
     * Information to add about Amazon CloudWatch alarms when the deployment group is created.
     */
    alarmConfiguration?: AlarmConfiguration;
    /**
     * Configuration information for an automatic rollback that is added when a deployment group is created.
     */
    autoRollbackConfiguration?: AutoRollbackConfiguration;
    /**
     * Indicates what happens when new Amazon EC2 instances are launched mid-deployment and do not receive the deployed application revision. If this option is set to UPDATE or is unspecified, CodeDeploy initiates one or more 'auto-update outdated instances' deployments to apply the deployed application revision to the new Amazon EC2 instances. If this option is set to IGNORE, CodeDeploy does not initiate a deployment to update the new Amazon EC2 instances. This may result in instances having different revisions.
     */
    outdatedInstancesStrategy?: OutdatedInstancesStrategy;
    /**
     * Information about the type of deployment, in-place or blue/green, that you want to run and whether to route deployment traffic behind a load balancer.
     */
    deploymentStyle?: DeploymentStyle;
    /**
     * Information about blue/green deployment options for a deployment group.
     */
    blueGreenDeploymentConfiguration?: BlueGreenDeploymentConfiguration;
    /**
     * Information about the load balancer used in a deployment.
     */
    loadBalancerInfo?: LoadBalancerInfo;
    /**
     * Information about groups of tags applied to Amazon EC2 instances. The deployment group includes only Amazon EC2 instances identified by all the tag groups. Cannot be used in the same call as ec2TagFilters.
     */
    ec2TagSet?: EC2TagSet;
    /**
     *  The target Amazon ECS services in the deployment group. This applies only to deployment groups that use the Amazon ECS compute platform. A target Amazon ECS service is specified as an Amazon ECS cluster and service name pair using the format &lt;clustername&gt;:&lt;servicename&gt;. 
     */
    ecsServices?: ECSServiceList;
    /**
     * Information about groups of tags applied to on-premises instances. The deployment group includes only on-premises instances identified by all of the tag groups. Cannot be used in the same call as onPremisesInstanceTagFilters.
     */
    onPremisesTagSet?: OnPremisesTagSet;
    /**
     *  The metadata that you apply to CodeDeploy deployment groups to help you organize and categorize them. Each tag consists of a key and an optional value, both of which you define. 
     */
    tags?: TagList;
  }
  export interface CreateDeploymentGroupOutput {
    /**
     * A unique deployment group ID.
     */
    deploymentGroupId?: DeploymentGroupId;
  }
  export interface CreateDeploymentInput {
    /**
     * The name of an CodeDeploy application associated with the user or Amazon Web Services account.
     */
    applicationName: ApplicationName;
    /**
     * The name of the deployment group.
     */
    deploymentGroupName?: DeploymentGroupName;
    /**
     *  The type and location of the revision to deploy. 
     */
    revision?: RevisionLocation;
    /**
     * The name of a deployment configuration associated with the user or Amazon Web Services account. If not specified, the value configured in the deployment group is used as the default. If the deployment group does not have a deployment configuration associated with it, CodeDeployDefault.OneAtATime is used by default.
     */
    deploymentConfigName?: DeploymentConfigName;
    /**
     * A comment about the deployment.
     */
    description?: Description;
    /**
     *  If true, then if an ApplicationStop, BeforeBlockTraffic, or AfterBlockTraffic deployment lifecycle event to an instance fails, then the deployment continues to the next deployment lifecycle event. For example, if ApplicationStop fails, the deployment continues with DownloadBundle. If BeforeBlockTraffic fails, the deployment continues with BlockTraffic. If AfterBlockTraffic fails, the deployment continues with ApplicationStop.   If false or not specified, then if a lifecycle event fails during a deployment to an instance, that deployment fails. If deployment to that instance is part of an overall deployment and the number of healthy hosts is not less than the minimum number of healthy hosts, then a deployment to the next instance is attempted.   During a deployment, the CodeDeploy agent runs the scripts specified for ApplicationStop, BeforeBlockTraffic, and AfterBlockTraffic in the AppSpec file from the previous successful deployment. (All other scripts are run from the AppSpec file in the current deployment.) If one of these scripts contains an error and does not run successfully, the deployment can fail.   If the cause of the failure is a script from the last successful deployment that will never run successfully, create a new deployment and use ignoreApplicationStopFailures to specify that the ApplicationStop, BeforeBlockTraffic, and AfterBlockTraffic failures should be ignored. 
     */
    ignoreApplicationStopFailures?: Boolean;
    /**
     *  Information about the instances that belong to the replacement environment in a blue/green deployment. 
     */
    targetInstances?: TargetInstances;
    /**
     * Configuration information for an automatic rollback that is added when a deployment is created.
     */
    autoRollbackConfiguration?: AutoRollbackConfiguration;
    /**
     *  Indicates whether to deploy to all instances or only to instances that are not running the latest application revision. 
     */
    updateOutdatedInstancesOnly?: Boolean;
    /**
     * Information about how CodeDeploy handles files that already exist in a deployment target location but weren't part of the previous successful deployment. The fileExistsBehavior parameter takes any of the following values:   DISALLOW: The deployment fails. This is also the default behavior if no option is specified.   OVERWRITE: The version of the file from the application revision currently being deployed replaces the version already on the instance.   RETAIN: The version of the file already on the instance is kept and used as part of the new deployment.  
     */
    fileExistsBehavior?: FileExistsBehavior;
    /**
     * Allows you to specify information about alarms associated with a deployment. The alarm configuration that you specify here will override the alarm configuration at the deployment group level. Consider overriding the alarm configuration if you have set up alarms at the deployment group level that are causing deployment failures. In this case, you would call CreateDeployment to create a new deployment that uses a previous application revision that is known to work, and set its alarm configuration to turn off alarm polling. Turning off alarm polling ensures that the new deployment proceeds without being blocked by the alarm that was generated by the previous, failed, deployment.  If you specify an overrideAlarmConfiguration, you need the UpdateDeploymentGroup IAM permission when calling CreateDeployment. 
     */
    overrideAlarmConfiguration?: AlarmConfiguration;
  }
  export interface CreateDeploymentOutput {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId?: DeploymentId;
  }
  export interface DeleteApplicationInput {
    /**
     * The name of an CodeDeploy application associated with the user or Amazon Web Services account.
     */
    applicationName: ApplicationName;
  }
  export interface DeleteDeploymentConfigInput {
    /**
     * The name of a deployment configuration associated with the user or Amazon Web Services account.
     */
    deploymentConfigName: DeploymentConfigName;
  }
  export interface DeleteDeploymentGroupInput {
    /**
     * The name of an CodeDeploy application associated with the user or Amazon Web Services account.
     */
    applicationName: ApplicationName;
    /**
     * The name of a deployment group for the specified application.
     */
    deploymentGroupName: DeploymentGroupName;
  }
  export interface DeleteDeploymentGroupOutput {
    /**
     * If the output contains no data, and the corresponding deployment group contained at least one Auto Scaling group, CodeDeploy successfully removed all corresponding Auto Scaling lifecycle event hooks from the Amazon EC2 instances in the Auto Scaling group. If the output contains data, CodeDeploy could not remove some Auto Scaling lifecycle event hooks from the Amazon EC2 instances in the Auto Scaling group.
     */
    hooksNotCleanedUp?: AutoScalingGroupList;
  }
  export interface DeleteGitHubAccountTokenInput {
    /**
     * The name of the GitHub account connection to delete.
     */
    tokenName?: GitHubAccountTokenName;
  }
  export interface DeleteGitHubAccountTokenOutput {
    /**
     * The name of the GitHub account connection that was deleted.
     */
    tokenName?: GitHubAccountTokenName;
  }
  export interface DeleteResourcesByExternalIdInput {
    /**
     * The unique ID of an external resource (for example, a CloudFormation stack ID) that is linked to one or more CodeDeploy resources.
     */
    externalId?: ExternalId;
  }
  export interface DeleteResourcesByExternalIdOutput {
  }
  export type DeploymentConfigId = string;
  export interface DeploymentConfigInfo {
    /**
     * The deployment configuration ID.
     */
    deploymentConfigId?: DeploymentConfigId;
    /**
     * The deployment configuration name.
     */
    deploymentConfigName?: DeploymentConfigName;
    /**
     * Information about the number or percentage of minimum healthy instance.
     */
    minimumHealthyHosts?: MinimumHealthyHosts;
    /**
     * The time at which the deployment configuration was created.
     */
    createTime?: Timestamp;
    /**
     * The destination platform type for the deployment (Lambda, Server, or ECS).
     */
    computePlatform?: ComputePlatform;
    /**
     * The configuration that specifies how the deployment traffic is routed. Used for deployments with a Lambda or Amazon ECS compute platform only.
     */
    trafficRoutingConfig?: TrafficRoutingConfig;
  }
  export type DeploymentConfigName = string;
  export type DeploymentConfigsList = DeploymentConfigName[];
  export type DeploymentCreator = "user"|"autoscaling"|"codeDeployRollback"|"CodeDeploy"|"CodeDeployAutoUpdate"|"CloudFormation"|"CloudFormationRollback"|string;
  export type DeploymentGroupId = string;
  export interface DeploymentGroupInfo {
    /**
     * The application name.
     */
    applicationName?: ApplicationName;
    /**
     * The deployment group ID.
     */
    deploymentGroupId?: DeploymentGroupId;
    /**
     * The deployment group name.
     */
    deploymentGroupName?: DeploymentGroupName;
    /**
     * The deployment configuration name.
     */
    deploymentConfigName?: DeploymentConfigName;
    /**
     * The Amazon EC2 tags on which to filter. The deployment group includes EC2 instances with any of the specified tags.
     */
    ec2TagFilters?: EC2TagFilterList;
    /**
     * The on-premises instance tags on which to filter. The deployment group includes on-premises instances with any of the specified tags.
     */
    onPremisesInstanceTagFilters?: TagFilterList;
    /**
     * A list of associated Auto Scaling groups.
     */
    autoScalingGroups?: AutoScalingGroupList;
    /**
     * A service role Amazon Resource Name (ARN) that grants CodeDeploy permission to make calls to Amazon Web Services services on your behalf. For more information, see Create a Service Role for CodeDeploy in the CodeDeploy User Guide.
     */
    serviceRoleArn?: Role;
    /**
     * Information about the deployment group's target revision, including type and location.
     */
    targetRevision?: RevisionLocation;
    /**
     * Information about triggers associated with the deployment group.
     */
    triggerConfigurations?: TriggerConfigList;
    /**
     * A list of alarms associated with the deployment group.
     */
    alarmConfiguration?: AlarmConfiguration;
    /**
     * Information about the automatic rollback configuration associated with the deployment group.
     */
    autoRollbackConfiguration?: AutoRollbackConfiguration;
    /**
     * Information about the type of deployment, either in-place or blue/green, you want to run and whether to route deployment traffic behind a load balancer.
     */
    deploymentStyle?: DeploymentStyle;
    /**
     * Indicates what happens when new Amazon EC2 instances are launched mid-deployment and do not receive the deployed application revision. If this option is set to UPDATE or is unspecified, CodeDeploy initiates one or more 'auto-update outdated instances' deployments to apply the deployed application revision to the new Amazon EC2 instances. If this option is set to IGNORE, CodeDeploy does not initiate a deployment to update the new Amazon EC2 instances. This may result in instances having different revisions.
     */
    outdatedInstancesStrategy?: OutdatedInstancesStrategy;
    /**
     * Information about blue/green deployment options for a deployment group.
     */
    blueGreenDeploymentConfiguration?: BlueGreenDeploymentConfiguration;
    /**
     * Information about the load balancer to use in a deployment.
     */
    loadBalancerInfo?: LoadBalancerInfo;
    /**
     * Information about the most recent successful deployment to the deployment group.
     */
    lastSuccessfulDeployment?: LastDeploymentInfo;
    /**
     * Information about the most recent attempted deployment to the deployment group.
     */
    lastAttemptedDeployment?: LastDeploymentInfo;
    /**
     * Information about groups of tags applied to an Amazon EC2 instance. The deployment group includes only Amazon EC2 instances identified by all of the tag groups. Cannot be used in the same call as ec2TagFilters.
     */
    ec2TagSet?: EC2TagSet;
    /**
     * Information about groups of tags applied to an on-premises instance. The deployment group includes only on-premises instances identified by all the tag groups. Cannot be used in the same call as onPremisesInstanceTagFilters.
     */
    onPremisesTagSet?: OnPremisesTagSet;
    /**
     * The destination platform type for the deployment (Lambda, Server, or ECS).
     */
    computePlatform?: ComputePlatform;
    /**
     *  The target Amazon ECS services in the deployment group. This applies only to deployment groups that use the Amazon ECS compute platform. A target Amazon ECS service is specified as an Amazon ECS cluster and service name pair using the format &lt;clustername&gt;:&lt;servicename&gt;. 
     */
    ecsServices?: ECSServiceList;
  }
  export type DeploymentGroupInfoList = DeploymentGroupInfo[];
  export type DeploymentGroupName = string;
  export type DeploymentGroupsList = DeploymentGroupName[];
  export type DeploymentId = string;
  export interface DeploymentInfo {
    /**
     * The application name.
     */
    applicationName?: ApplicationName;
    /**
     *  The deployment group name. 
     */
    deploymentGroupName?: DeploymentGroupName;
    /**
     *  The deployment configuration name. 
     */
    deploymentConfigName?: DeploymentConfigName;
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId?: DeploymentId;
    /**
     * Information about the application revision that was deployed to the deployment group before the most recent successful deployment.
     */
    previousRevision?: RevisionLocation;
    /**
     * Information about the location of stored application artifacts and the service from which to retrieve them.
     */
    revision?: RevisionLocation;
    /**
     * The current state of the deployment as a whole.
     */
    status?: DeploymentStatus;
    /**
     * Information about any error associated with this deployment.
     */
    errorInformation?: ErrorInformation;
    /**
     * A timestamp that indicates when the deployment was created.
     */
    createTime?: Timestamp;
    /**
     * A timestamp that indicates when the deployment was deployed to the deployment group. In some cases, the reported value of the start time might be later than the complete time. This is due to differences in the clock settings of backend servers that participate in the deployment process.
     */
    startTime?: Timestamp;
    /**
     * A timestamp that indicates when the deployment was complete.
     */
    completeTime?: Timestamp;
    /**
     * A summary of the deployment status of the instances in the deployment.
     */
    deploymentOverview?: DeploymentOverview;
    /**
     * A comment about the deployment.
     */
    description?: Description;
    /**
     * The means by which the deployment was created:    user: A user created the deployment.    autoscaling: Amazon EC2 Auto Scaling created the deployment.    codeDeployRollback: A rollback process created the deployment.    CodeDeployAutoUpdate: An auto-update process created the deployment when it detected outdated Amazon EC2 instances.  
     */
    creator?: DeploymentCreator;
    /**
     *  If true, then if an ApplicationStop, BeforeBlockTraffic, or AfterBlockTraffic deployment lifecycle event to an instance fails, then the deployment continues to the next deployment lifecycle event. For example, if ApplicationStop fails, the deployment continues with DownloadBundle. If BeforeBlockTraffic fails, the deployment continues with BlockTraffic. If AfterBlockTraffic fails, the deployment continues with ApplicationStop.   If false or not specified, then if a lifecycle event fails during a deployment to an instance, that deployment fails. If deployment to that instance is part of an overall deployment and the number of healthy hosts is not less than the minimum number of healthy hosts, then a deployment to the next instance is attempted.   During a deployment, the CodeDeploy agent runs the scripts specified for ApplicationStop, BeforeBlockTraffic, and AfterBlockTraffic in the AppSpec file from the previous successful deployment. (All other scripts are run from the AppSpec file in the current deployment.) If one of these scripts contains an error and does not run successfully, the deployment can fail.   If the cause of the failure is a script from the last successful deployment that will never run successfully, create a new deployment and use ignoreApplicationStopFailures to specify that the ApplicationStop, BeforeBlockTraffic, and AfterBlockTraffic failures should be ignored. 
     */
    ignoreApplicationStopFailures?: Boolean;
    /**
     * Information about the automatic rollback configuration associated with the deployment.
     */
    autoRollbackConfiguration?: AutoRollbackConfiguration;
    /**
     * Indicates whether only instances that are not running the latest application revision are to be deployed to.
     */
    updateOutdatedInstancesOnly?: Boolean;
    /**
     * Information about a deployment rollback.
     */
    rollbackInfo?: RollbackInfo;
    /**
     * Information about the type of deployment, either in-place or blue/green, you want to run and whether to route deployment traffic behind a load balancer.
     */
    deploymentStyle?: DeploymentStyle;
    /**
     * Information about the instances that belong to the replacement environment in a blue/green deployment.
     */
    targetInstances?: TargetInstances;
    /**
     * Indicates whether the wait period set for the termination of instances in the original environment has started. Status is 'false' if the KEEP_ALIVE option is specified. Otherwise, 'true' as soon as the termination wait period starts.
     */
    instanceTerminationWaitTimeStarted?: Boolean;
    /**
     * Information about blue/green deployment options for this deployment.
     */
    blueGreenDeploymentConfiguration?: BlueGreenDeploymentConfiguration;
    /**
     * Information about the load balancer used in the deployment.
     */
    loadBalancerInfo?: LoadBalancerInfo;
    /**
     * Provides information about the results of a deployment, such as whether instances in the original environment in a blue/green deployment were not terminated.
     */
    additionalDeploymentStatusInfo?: AdditionalDeploymentStatusInfo;
    /**
     * Information about how CodeDeploy handles files that already exist in a deployment target location but weren't part of the previous successful deployment.    DISALLOW: The deployment fails. This is also the default behavior if no option is specified.    OVERWRITE: The version of the file from the application revision currently being deployed replaces the version already on the instance.    RETAIN: The version of the file already on the instance is kept and used as part of the new deployment.  
     */
    fileExistsBehavior?: FileExistsBehavior;
    /**
     * Messages that contain information about the status of a deployment.
     */
    deploymentStatusMessages?: DeploymentStatusMessageList;
    /**
     * The destination platform type for the deployment (Lambda, Server, or ECS).
     */
    computePlatform?: ComputePlatform;
    /**
     * The unique ID for an external resource (for example, a CloudFormation stack ID) that is linked to this deployment.
     */
    externalId?: ExternalId;
    relatedDeployments?: RelatedDeployments;
    overrideAlarmConfiguration?: AlarmConfiguration;
  }
  export type DeploymentOption = "WITH_TRAFFIC_CONTROL"|"WITHOUT_TRAFFIC_CONTROL"|string;
  export interface DeploymentOverview {
    /**
     * The number of instances in the deployment in a pending state.
     */
    Pending?: InstanceCount;
    /**
     * The number of instances in which the deployment is in progress.
     */
    InProgress?: InstanceCount;
    /**
     * The number of instances in the deployment to which revisions have been successfully deployed.
     */
    Succeeded?: InstanceCount;
    /**
     * The number of instances in the deployment in a failed state.
     */
    Failed?: InstanceCount;
    /**
     * The number of instances in the deployment in a skipped state.
     */
    Skipped?: InstanceCount;
    /**
     * The number of instances in a replacement environment ready to receive traffic in a blue/green deployment.
     */
    Ready?: InstanceCount;
  }
  export type DeploymentReadyAction = "CONTINUE_DEPLOYMENT"|"STOP_DEPLOYMENT"|string;
  export interface DeploymentReadyOption {
    /**
     * Information about when to reroute traffic from an original environment to a replacement environment in a blue/green deployment.   CONTINUE_DEPLOYMENT: Register new instances with the load balancer immediately after the new application revision is installed on the instances in the replacement environment.   STOP_DEPLOYMENT: Do not register new instances with a load balancer unless traffic rerouting is started using ContinueDeployment. If traffic rerouting is not started before the end of the specified wait period, the deployment status is changed to Stopped.  
     */
    actionOnTimeout?: DeploymentReadyAction;
    /**
     * The number of minutes to wait before the status of a blue/green deployment is changed to Stopped if rerouting is not started manually. Applies only to the STOP_DEPLOYMENT option for actionOnTimeout.
     */
    waitTimeInMinutes?: Duration;
  }
  export type DeploymentStatus = "Created"|"Queued"|"InProgress"|"Baking"|"Succeeded"|"Failed"|"Stopped"|"Ready"|string;
  export type DeploymentStatusList = DeploymentStatus[];
  export type DeploymentStatusMessageList = ErrorMessage[];
  export interface DeploymentStyle {
    /**
     * Indicates whether to run an in-place deployment or a blue/green deployment.
     */
    deploymentType?: DeploymentType;
    /**
     * Indicates whether to route deployment traffic behind a load balancer.
     */
    deploymentOption?: DeploymentOption;
  }
  export interface DeploymentTarget {
    /**
     * The deployment type that is specific to the deployment's compute platform or deployments initiated by a CloudFormation stack update.
     */
    deploymentTargetType?: DeploymentTargetType;
    /**
     *  Information about the target for a deployment that uses the EC2/On-premises compute platform. 
     */
    instanceTarget?: InstanceTarget;
    /**
     *  Information about the target for a deployment that uses the Lambda compute platform. 
     */
    lambdaTarget?: LambdaTarget;
    /**
     *  Information about the target for a deployment that uses the Amazon ECS compute platform. 
     */
    ecsTarget?: ECSTarget;
    cloudFormationTarget?: CloudFormationTarget;
  }
  export type DeploymentTargetList = DeploymentTarget[];
  export type DeploymentTargetType = "InstanceTarget"|"LambdaTarget"|"ECSTarget"|"CloudFormationTarget"|string;
  export type DeploymentType = "IN_PLACE"|"BLUE_GREEN"|string;
  export type DeploymentWaitType = "READY_WAIT"|"TERMINATION_WAIT"|string;
  export type DeploymentsInfoList = DeploymentInfo[];
  export type DeploymentsList = DeploymentId[];
  export interface DeregisterOnPremisesInstanceInput {
    /**
     * The name of the on-premises instance to deregister.
     */
    instanceName: InstanceName;
  }
  export type Description = string;
  export interface Diagnostics {
    /**
     * The associated error code:   Success: The specified script ran.   ScriptMissing: The specified script was not found in the specified location.   ScriptNotExecutable: The specified script is not a recognized executable file type.   ScriptTimedOut: The specified script did not finish running in the specified time period.   ScriptFailed: The specified script failed to run as expected.   UnknownError: The specified script did not run for an unknown reason.  
     */
    errorCode?: LifecycleErrorCode;
    /**
     * The name of the script.
     */
    scriptName?: ScriptName;
    /**
     * The message associated with the error.
     */
    message?: LifecycleMessage;
    /**
     * The last portion of the diagnostic log. If available, CodeDeploy returns up to the last 4 KB of the diagnostic log.
     */
    logTail?: LogTail;
  }
  export type Duration = number;
  export interface EC2TagFilter {
    /**
     * The tag filter key.
     */
    Key?: Key;
    /**
     * The tag filter value.
     */
    Value?: Value;
    /**
     * The tag filter type:    KEY_ONLY: Key only.    VALUE_ONLY: Value only.    KEY_AND_VALUE: Key and value.  
     */
    Type?: EC2TagFilterType;
  }
  export type EC2TagFilterList = EC2TagFilter[];
  export type EC2TagFilterType = "KEY_ONLY"|"VALUE_ONLY"|"KEY_AND_VALUE"|string;
  export interface EC2TagSet {
    /**
     * A list that contains other lists of Amazon EC2 instance tag groups. For an instance to be included in the deployment group, it must be identified by all of the tag groups in the list.
     */
    ec2TagSetList?: EC2TagSetList;
  }
  export type EC2TagSetList = EC2TagFilterList[];
  export type ECSClusterName = string;
  export interface ECSService {
    /**
     *  The name of the target Amazon ECS service. 
     */
    serviceName?: ECSServiceName;
    /**
     *  The name of the cluster that the Amazon ECS service is associated with. 
     */
    clusterName?: ECSClusterName;
  }
  export type ECSServiceList = ECSService[];
  export type ECSServiceName = string;
  export interface ECSTarget {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId?: DeploymentId;
    /**
     *  The unique ID of a deployment target that has a type of ecsTarget. 
     */
    targetId?: TargetId;
    /**
     *  The Amazon Resource Name (ARN) of the target. 
     */
    targetArn?: TargetArn;
    /**
     *  The date and time when the target Amazon ECS application was updated by a deployment. 
     */
    lastUpdatedAt?: Time;
    /**
     *  The lifecycle events of the deployment to this target Amazon ECS application. 
     */
    lifecycleEvents?: LifecycleEventList;
    /**
     *  The status an Amazon ECS deployment's target ECS application. 
     */
    status?: TargetStatus;
    /**
     *  The ECSTaskSet objects associated with the ECS target. 
     */
    taskSetsInfo?: ECSTaskSetList;
  }
  export interface ECSTaskSet {
    /**
     *  A unique ID of an ECSTaskSet. 
     */
    identifer?: ECSTaskSetIdentifier;
    /**
     *  The number of tasks in a task set. During a deployment that uses the Amazon ECS compute type, CodeDeploy instructs Amazon ECS to create a new task set and uses this value to determine how many tasks to create. After the updated task set is created, CodeDeploy shifts traffic to the new task set. 
     */
    desiredCount?: ECSTaskSetCount;
    /**
     *  The number of tasks in the task set that are in the PENDING status during an Amazon ECS deployment. A task in the PENDING state is preparing to enter the RUNNING state. A task set enters the PENDING status when it launches for the first time, or when it is restarted after being in the STOPPED state. 
     */
    pendingCount?: ECSTaskSetCount;
    /**
     *  The number of tasks in the task set that are in the RUNNING status during an Amazon ECS deployment. A task in the RUNNING state is running and ready for use. 
     */
    runningCount?: ECSTaskSetCount;
    /**
     *  The status of the task set. There are three valid task set statuses:     PRIMARY: Indicates the task set is serving production traffic.     ACTIVE: Indicates the task set is not serving production traffic.     DRAINING: Indicates the tasks in the task set are being stopped and their corresponding targets are being deregistered from their target group.   
     */
    status?: ECSTaskSetStatus;
    /**
     *  The percentage of traffic served by this task set. 
     */
    trafficWeight?: TrafficWeight;
    /**
     *  The target group associated with the task set. The target group is used by CodeDeploy to manage traffic to a task set. 
     */
    targetGroup?: TargetGroupInfo;
    /**
     *  A label that identifies whether the ECS task set is an original target (BLUE) or a replacement target (GREEN). 
     */
    taskSetLabel?: TargetLabel;
  }
  export type ECSTaskSetCount = number;
  export type ECSTaskSetIdentifier = string;
  export type ECSTaskSetList = ECSTaskSet[];
  export type ECSTaskSetStatus = string;
  export interface ELBInfo {
    /**
     * For blue/green deployments, the name of the Classic Load Balancer that is used to route traffic from original instances to replacement instances in a blue/green deployment. For in-place deployments, the name of the Classic Load Balancer that instances are deregistered from so they are not serving traffic during a deployment, and then re-registered with after the deployment is complete.
     */
    name?: ELBName;
  }
  export type ELBInfoList = ELBInfo[];
  export type ELBName = string;
  export type ETag = string;
  export type ErrorCode = "AGENT_ISSUE"|"ALARM_ACTIVE"|"APPLICATION_MISSING"|"AUTOSCALING_VALIDATION_ERROR"|"AUTO_SCALING_CONFIGURATION"|"AUTO_SCALING_IAM_ROLE_PERMISSIONS"|"CODEDEPLOY_RESOURCE_CANNOT_BE_FOUND"|"CUSTOMER_APPLICATION_UNHEALTHY"|"DEPLOYMENT_GROUP_MISSING"|"ECS_UPDATE_ERROR"|"ELASTIC_LOAD_BALANCING_INVALID"|"ELB_INVALID_INSTANCE"|"HEALTH_CONSTRAINTS"|"HEALTH_CONSTRAINTS_INVALID"|"HOOK_EXECUTION_FAILURE"|"IAM_ROLE_MISSING"|"IAM_ROLE_PERMISSIONS"|"INTERNAL_ERROR"|"INVALID_ECS_SERVICE"|"INVALID_LAMBDA_CONFIGURATION"|"INVALID_LAMBDA_FUNCTION"|"INVALID_REVISION"|"MANUAL_STOP"|"MISSING_BLUE_GREEN_DEPLOYMENT_CONFIGURATION"|"MISSING_ELB_INFORMATION"|"MISSING_GITHUB_TOKEN"|"NO_EC2_SUBSCRIPTION"|"NO_INSTANCES"|"OVER_MAX_INSTANCES"|"RESOURCE_LIMIT_EXCEEDED"|"REVISION_MISSING"|"THROTTLED"|"TIMEOUT"|"CLOUDFORMATION_STACK_FAILURE"|string;
  export interface ErrorInformation {
    /**
     * For more information, see Error Codes for CodeDeploy in the CodeDeploy User Guide. The error code:   APPLICATION_MISSING: The application was missing. This error code is most likely raised if the application is deleted after the deployment is created, but before it is started.   DEPLOYMENT_GROUP_MISSING: The deployment group was missing. This error code is most likely raised if the deployment group is deleted after the deployment is created, but before it is started.   HEALTH_CONSTRAINTS: The deployment failed on too many instances to be successfully deployed within the instance health constraints specified.   HEALTH_CONSTRAINTS_INVALID: The revision cannot be successfully deployed within the instance health constraints specified.   IAM_ROLE_MISSING: The service role cannot be accessed.   IAM_ROLE_PERMISSIONS: The service role does not have the correct permissions.   INTERNAL_ERROR: There was an internal error.   NO_EC2_SUBSCRIPTION: The calling account is not subscribed to Amazon EC2.   NO_INSTANCES: No instances were specified, or no instances can be found.   OVER_MAX_INSTANCES: The maximum number of instances was exceeded.   THROTTLED: The operation was throttled because the calling account exceeded the throttling limits of one or more Amazon Web Services services.   TIMEOUT: The deployment has timed out.   REVISION_MISSING: The revision ID was missing. This error code is most likely raised if the revision is deleted after the deployment is created, but before it is started.  
     */
    code?: ErrorCode;
    /**
     * An accompanying error message.
     */
    message?: ErrorMessage;
  }
  export type ErrorMessage = string;
  export type ExternalId = string;
  export type FileExistsBehavior = "DISALLOW"|"OVERWRITE"|"RETAIN"|string;
  export type FilterValue = string;
  export type FilterValueList = FilterValue[];
  export interface GenericRevisionInfo {
    /**
     * A comment about the revision.
     */
    description?: Description;
    /**
     * The deployment groups for which this is the current target revision.
     */
    deploymentGroups?: DeploymentGroupsList;
    /**
     * When the revision was first used by CodeDeploy.
     */
    firstUsedTime?: Timestamp;
    /**
     * When the revision was last used by CodeDeploy.
     */
    lastUsedTime?: Timestamp;
    /**
     * When the revision was registered with CodeDeploy.
     */
    registerTime?: Timestamp;
  }
  export interface GetApplicationInput {
    /**
     * The name of an CodeDeploy application associated with the user or Amazon Web Services account.
     */
    applicationName: ApplicationName;
  }
  export interface GetApplicationOutput {
    /**
     * Information about the application.
     */
    application?: ApplicationInfo;
  }
  export interface GetApplicationRevisionInput {
    /**
     * The name of the application that corresponds to the revision.
     */
    applicationName: ApplicationName;
    /**
     * Information about the application revision to get, including type and location.
     */
    revision: RevisionLocation;
  }
  export interface GetApplicationRevisionOutput {
    /**
     * The name of the application that corresponds to the revision.
     */
    applicationName?: ApplicationName;
    /**
     * Additional information about the revision, including type and location.
     */
    revision?: RevisionLocation;
    /**
     * General information about the revision.
     */
    revisionInfo?: GenericRevisionInfo;
  }
  export interface GetDeploymentConfigInput {
    /**
     * The name of a deployment configuration associated with the user or Amazon Web Services account.
     */
    deploymentConfigName: DeploymentConfigName;
  }
  export interface GetDeploymentConfigOutput {
    /**
     * Information about the deployment configuration.
     */
    deploymentConfigInfo?: DeploymentConfigInfo;
  }
  export interface GetDeploymentGroupInput {
    /**
     * The name of an CodeDeploy application associated with the user or Amazon Web Services account.
     */
    applicationName: ApplicationName;
    /**
     * The name of a deployment group for the specified application.
     */
    deploymentGroupName: DeploymentGroupName;
  }
  export interface GetDeploymentGroupOutput {
    /**
     * Information about the deployment group.
     */
    deploymentGroupInfo?: DeploymentGroupInfo;
  }
  export interface GetDeploymentInput {
    /**
     *  The unique ID of a deployment associated with the user or Amazon Web Services account. 
     */
    deploymentId: DeploymentId;
  }
  export interface GetDeploymentInstanceInput {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId: DeploymentId;
    /**
     *  The unique ID of an instance in the deployment group. 
     */
    instanceId: InstanceId;
  }
  export interface GetDeploymentInstanceOutput {
    /**
     *  Information about the instance. 
     */
    instanceSummary?: InstanceSummary;
  }
  export interface GetDeploymentOutput {
    /**
     * Information about the deployment.
     */
    deploymentInfo?: DeploymentInfo;
  }
  export interface GetDeploymentTargetInput {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId?: DeploymentId;
    /**
     *  The unique ID of a deployment target. 
     */
    targetId?: TargetId;
  }
  export interface GetDeploymentTargetOutput {
    /**
     *  A deployment target that contains information about a deployment such as its status, lifecycle events, and when it was last updated. It also contains metadata about the deployment target. The deployment target metadata depends on the deployment target's type (instanceTarget, lambdaTarget, or ecsTarget). 
     */
    deploymentTarget?: DeploymentTarget;
  }
  export interface GetOnPremisesInstanceInput {
    /**
     *  The name of the on-premises instance about which to get information. 
     */
    instanceName: InstanceName;
  }
  export interface GetOnPremisesInstanceOutput {
    /**
     *  Information about the on-premises instance. 
     */
    instanceInfo?: InstanceInfo;
  }
  export type GitHubAccountTokenName = string;
  export type GitHubAccountTokenNameList = GitHubAccountTokenName[];
  export interface GitHubLocation {
    /**
     * The GitHub account and repository pair that stores a reference to the commit that represents the bundled artifacts for the application revision.  Specified as account/repository.
     */
    repository?: Repository;
    /**
     * The SHA1 commit ID of the GitHub commit that represents the bundled artifacts for the application revision.
     */
    commitId?: CommitId;
  }
  export type GreenFleetProvisioningAction = "DISCOVER_EXISTING"|"COPY_AUTO_SCALING_GROUP"|string;
  export interface GreenFleetProvisioningOption {
    /**
     * The method used to add instances to a replacement environment.    DISCOVER_EXISTING: Use instances that already exist or will be created manually.    COPY_AUTO_SCALING_GROUP: Use settings from a specified Auto Scaling group to define and create instances in a new Auto Scaling group.  
     */
    action?: GreenFleetProvisioningAction;
  }
  export type IamSessionArn = string;
  export type IamUserArn = string;
  export type InstanceAction = "TERMINATE"|"KEEP_ALIVE"|string;
  export type InstanceArn = string;
  export type InstanceCount = number;
  export type InstanceId = string;
  export interface InstanceInfo {
    /**
     * The name of the on-premises instance.
     */
    instanceName?: InstanceName;
    /**
     * The ARN of the IAM session associated with the on-premises instance.
     */
    iamSessionArn?: IamSessionArn;
    /**
     * The user ARN associated with the on-premises instance.
     */
    iamUserArn?: IamUserArn;
    /**
     * The ARN of the on-premises instance.
     */
    instanceArn?: InstanceArn;
    /**
     * The time at which the on-premises instance was registered.
     */
    registerTime?: Timestamp;
    /**
     * If the on-premises instance was deregistered, the time at which the on-premises instance was deregistered.
     */
    deregisterTime?: Timestamp;
    /**
     * The tags currently associated with the on-premises instance.
     */
    tags?: TagList;
  }
  export type InstanceInfoList = InstanceInfo[];
  export type InstanceName = string;
  export type InstanceNameList = InstanceName[];
  export type InstanceStatus = "Pending"|"InProgress"|"Succeeded"|"Failed"|"Skipped"|"Unknown"|"Ready"|string;
  export type InstanceStatusList = InstanceStatus[];
  export interface InstanceSummary {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId?: DeploymentId;
    /**
     * The instance ID.
     */
    instanceId?: InstanceId;
    /**
     * The deployment status for this instance:    Pending: The deployment is pending for this instance.    In Progress: The deployment is in progress for this instance.    Succeeded: The deployment has succeeded for this instance.    Failed: The deployment has failed for this instance.    Skipped: The deployment has been skipped for this instance.    Unknown: The deployment status is unknown for this instance.  
     */
    status?: InstanceStatus;
    /**
     * A timestamp that indicates when the instance information was last updated.
     */
    lastUpdatedAt?: Timestamp;
    /**
     * A list of lifecycle events for this instance.
     */
    lifecycleEvents?: LifecycleEventList;
    /**
     * Information about which environment an instance belongs to in a blue/green deployment.   BLUE: The instance is part of the original environment.   GREEN: The instance is part of the replacement environment.  
     */
    instanceType?: InstanceType;
  }
  export type InstanceSummaryList = InstanceSummary[];
  export interface InstanceTarget {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId?: DeploymentId;
    /**
     *  The unique ID of a deployment target that has a type of instanceTarget. 
     */
    targetId?: TargetId;
    /**
     *  The Amazon Resource Name (ARN) of the target. 
     */
    targetArn?: TargetArn;
    /**
     *  The status an EC2/On-premises deployment's target instance. 
     */
    status?: TargetStatus;
    /**
     *  The date and time when the target instance was updated by a deployment. 
     */
    lastUpdatedAt?: Time;
    /**
     *  The lifecycle events of the deployment to this target instance. 
     */
    lifecycleEvents?: LifecycleEventList;
    /**
     *  A label that identifies whether the instance is an original target (BLUE) or a replacement target (GREEN). 
     */
    instanceLabel?: TargetLabel;
  }
  export type InstanceType = "Blue"|"Green"|string;
  export type InstanceTypeList = InstanceType[];
  export type InstancesList = InstanceId[];
  export type Key = string;
  export type LambdaFunctionAlias = string;
  export interface LambdaFunctionInfo {
    /**
     *  The name of a Lambda function. 
     */
    functionName?: LambdaFunctionName;
    /**
     *  The alias of a Lambda function. For more information, see Lambda Function Aliases in the Lambda Developer Guide.
     */
    functionAlias?: LambdaFunctionAlias;
    /**
     *  The version of a Lambda function that production traffic points to. 
     */
    currentVersion?: Version;
    /**
     *  The version of a Lambda function that production traffic points to after the Lambda function is deployed. 
     */
    targetVersion?: Version;
    /**
     *  The percentage of production traffic that the target version of a Lambda function receives. 
     */
    targetVersionWeight?: TrafficWeight;
  }
  export type LambdaFunctionName = string;
  export interface LambdaTarget {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId?: DeploymentId;
    /**
     *  The unique ID of a deployment target that has a type of lambdaTarget. 
     */
    targetId?: TargetId;
    /**
     *  The Amazon Resource Name (ARN) of the target. 
     */
    targetArn?: TargetArn;
    /**
     *  The status an Lambda deployment's target Lambda function. 
     */
    status?: TargetStatus;
    /**
     *  The date and time when the target Lambda function was updated by a deployment. 
     */
    lastUpdatedAt?: Time;
    /**
     *  The lifecycle events of the deployment to this target Lambda function. 
     */
    lifecycleEvents?: LifecycleEventList;
    /**
     *  A LambdaFunctionInfo object that describes a target Lambda function. 
     */
    lambdaFunctionInfo?: LambdaFunctionInfo;
  }
  export interface LastDeploymentInfo {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId?: DeploymentId;
    /**
     * The status of the most recent deployment.
     */
    status?: DeploymentStatus;
    /**
     * A timestamp that indicates when the most recent deployment to the deployment group was complete.
     */
    endTime?: Timestamp;
    /**
     * A timestamp that indicates when the most recent deployment to the deployment group started.
     */
    createTime?: Timestamp;
  }
  export type LifecycleErrorCode = "Success"|"ScriptMissing"|"ScriptNotExecutable"|"ScriptTimedOut"|"ScriptFailed"|"UnknownError"|string;
  export interface LifecycleEvent {
    /**
     * The deployment lifecycle event name, such as ApplicationStop, BeforeInstall, AfterInstall, ApplicationStart, or ValidateService.
     */
    lifecycleEventName?: LifecycleEventName;
    /**
     * Diagnostic information about the deployment lifecycle event.
     */
    diagnostics?: Diagnostics;
    /**
     * A timestamp that indicates when the deployment lifecycle event started.
     */
    startTime?: Timestamp;
    /**
     * A timestamp that indicates when the deployment lifecycle event ended.
     */
    endTime?: Timestamp;
    /**
     * The deployment lifecycle event status:   Pending: The deployment lifecycle event is pending.   InProgress: The deployment lifecycle event is in progress.   Succeeded: The deployment lifecycle event ran successfully.   Failed: The deployment lifecycle event has failed.   Skipped: The deployment lifecycle event has been skipped.   Unknown: The deployment lifecycle event is unknown.  
     */
    status?: LifecycleEventStatus;
  }
  export type LifecycleEventHookExecutionId = string;
  export type LifecycleEventList = LifecycleEvent[];
  export type LifecycleEventName = string;
  export type LifecycleEventStatus = "Pending"|"InProgress"|"Succeeded"|"Failed"|"Skipped"|"Unknown"|string;
  export type LifecycleMessage = string;
  export interface ListApplicationRevisionsInput {
    /**
     *  The name of an CodeDeploy application associated with the user or Amazon Web Services account. 
     */
    applicationName: ApplicationName;
    /**
     * The column name to use to sort the list results:    registerTime: Sort by the time the revisions were registered with CodeDeploy.    firstUsedTime: Sort by the time the revisions were first used in a deployment.    lastUsedTime: Sort by the time the revisions were last used in a deployment.    If not specified or set to null, the results are returned in an arbitrary order. 
     */
    sortBy?: ApplicationRevisionSortBy;
    /**
     *  The order in which to sort the list results:     ascending: ascending order.    descending: descending order.   If not specified, the results are sorted in ascending order. If set to null, the results are sorted in an arbitrary order.
     */
    sortOrder?: SortOrder;
    /**
     *  An Amazon S3 bucket name to limit the search for revisions.   If set to null, all of the user's buckets are searched. 
     */
    s3Bucket?: S3Bucket;
    /**
     *  A key prefix for the set of Amazon S3 objects to limit the search for revisions. 
     */
    s3KeyPrefix?: S3Key;
    /**
     *  Whether to list revisions based on whether the revision is the target revision of a deployment group:     include: List revisions that are target revisions of a deployment group.    exclude: Do not list revisions that are target revisions of a deployment group.    ignore: List all revisions.  
     */
    deployed?: ListStateFilterAction;
    /**
     * An identifier returned from the previous ListApplicationRevisions call. It can be used to return the next set of applications in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListApplicationRevisionsOutput {
    /**
     * A list of locations that contain the matching revisions.
     */
    revisions?: RevisionLocationList;
    /**
     * If a large amount of information is returned, an identifier is also returned. It can be used in a subsequent list application revisions call to return the next set of application revisions in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListApplicationsInput {
    /**
     * An identifier returned from the previous list applications call. It can be used to return the next set of applications in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListApplicationsOutput {
    /**
     * A list of application names.
     */
    applications?: ApplicationsList;
    /**
     * If a large amount of information is returned, an identifier is also returned. It can be used in a subsequent list applications call to return the next set of applications in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentConfigsInput {
    /**
     * An identifier returned from the previous ListDeploymentConfigs call. It can be used to return the next set of deployment configurations in the list. 
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentConfigsOutput {
    /**
     * A list of deployment configurations, including built-in configurations such as CodeDeployDefault.OneAtATime.
     */
    deploymentConfigsList?: DeploymentConfigsList;
    /**
     * If a large amount of information is returned, an identifier is also returned. It can be used in a subsequent list deployment configurations call to return the next set of deployment configurations in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentGroupsInput {
    /**
     * The name of an CodeDeploy application associated with the user or Amazon Web Services account.
     */
    applicationName: ApplicationName;
    /**
     * An identifier returned from the previous list deployment groups call. It can be used to return the next set of deployment groups in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentGroupsOutput {
    /**
     * The application name.
     */
    applicationName?: ApplicationName;
    /**
     * A list of deployment group names.
     */
    deploymentGroups?: DeploymentGroupsList;
    /**
     * If a large amount of information is returned, an identifier is also returned. It can be used in a subsequent list deployment groups call to return the next set of deployment groups in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentInstancesInput {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId: DeploymentId;
    /**
     * An identifier returned from the previous list deployment instances call. It can be used to return the next set of deployment instances in the list.
     */
    nextToken?: NextToken;
    /**
     * A subset of instances to list by status:    Pending: Include those instances with pending deployments.    InProgress: Include those instances where deployments are still in progress.    Succeeded: Include those instances with successful deployments.    Failed: Include those instances with failed deployments.    Skipped: Include those instances with skipped deployments.    Unknown: Include those instances with deployments in an unknown state.  
     */
    instanceStatusFilter?: InstanceStatusList;
    /**
     * The set of instances in a blue/green deployment, either those in the original environment ("BLUE") or those in the replacement environment ("GREEN"), for which you want to view instance information.
     */
    instanceTypeFilter?: InstanceTypeList;
  }
  export interface ListDeploymentInstancesOutput {
    /**
     * A list of instance IDs.
     */
    instancesList?: InstancesList;
    /**
     * If a large amount of information is returned, an identifier is also returned. It can be used in a subsequent list deployment instances call to return the next set of deployment instances in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentTargetsInput {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId?: DeploymentId;
    /**
     *  A token identifier returned from the previous ListDeploymentTargets call. It can be used to return the next set of deployment targets in the list. 
     */
    nextToken?: NextToken;
    /**
     *  A key used to filter the returned targets. The two valid values are:    TargetStatus - A TargetStatus filter string can be Failed, InProgress, Pending, Ready, Skipped, Succeeded, or Unknown.     ServerInstanceLabel - A ServerInstanceLabel filter string can be Blue or Green.   
     */
    targetFilters?: TargetFilters;
  }
  export interface ListDeploymentTargetsOutput {
    /**
     *  The unique IDs of deployment targets. 
     */
    targetIds?: TargetIdList;
    /**
     *  If a large amount of information is returned, a token identifier is also returned. It can be used in a subsequent ListDeploymentTargets call to return the next set of deployment targets in the list. 
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentsInput {
    /**
     * The name of an CodeDeploy application associated with the user or Amazon Web Services account.  If applicationName is specified, then deploymentGroupName must be specified. If it is not specified, then deploymentGroupName must not be specified.  
     */
    applicationName?: ApplicationName;
    /**
     * The name of a deployment group for the specified application.  If deploymentGroupName is specified, then applicationName must be specified. If it is not specified, then applicationName must not be specified.  
     */
    deploymentGroupName?: DeploymentGroupName;
    /**
     * The unique ID of an external resource for returning deployments linked to the external resource.
     */
    externalId?: ExternalId;
    /**
     * A subset of deployments to list by status:    Created: Include created deployments in the resulting list.    Queued: Include queued deployments in the resulting list.    In Progress: Include in-progress deployments in the resulting list.    Succeeded: Include successful deployments in the resulting list.    Failed: Include failed deployments in the resulting list.    Stopped: Include stopped deployments in the resulting list.  
     */
    includeOnlyStatuses?: DeploymentStatusList;
    /**
     * A time range (start and end) for returning a subset of the list of deployments.
     */
    createTimeRange?: TimeRange;
    /**
     * An identifier returned from the previous list deployments call. It can be used to return the next set of deployments in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListDeploymentsOutput {
    /**
     * A list of deployment IDs.
     */
    deployments?: DeploymentsList;
    /**
     * If a large amount of information is returned, an identifier is also returned. It can be used in a subsequent list deployments call to return the next set of deployments in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListGitHubAccountTokenNamesInput {
    /**
     * An identifier returned from the previous ListGitHubAccountTokenNames call. It can be used to return the next set of names in the list. 
     */
    nextToken?: NextToken;
  }
  export interface ListGitHubAccountTokenNamesOutput {
    /**
     * A list of names of connections to GitHub accounts.
     */
    tokenNameList?: GitHubAccountTokenNameList;
    /**
     * If a large amount of information is returned, an identifier is also returned. It can be used in a subsequent ListGitHubAccountTokenNames call to return the next set of names in the list. 
     */
    nextToken?: NextToken;
  }
  export interface ListOnPremisesInstancesInput {
    /**
     * The registration status of the on-premises instances:    Deregistered: Include deregistered on-premises instances in the resulting list.    Registered: Include registered on-premises instances in the resulting list.  
     */
    registrationStatus?: RegistrationStatus;
    /**
     * The on-premises instance tags that are used to restrict the on-premises instance names returned.
     */
    tagFilters?: TagFilterList;
    /**
     * An identifier returned from the previous list on-premises instances call. It can be used to return the next set of on-premises instances in the list.
     */
    nextToken?: NextToken;
  }
  export interface ListOnPremisesInstancesOutput {
    /**
     * The list of matching on-premises instance names.
     */
    instanceNames?: InstanceNameList;
    /**
     * If a large amount of information is returned, an identifier is also returned. It can be used in a subsequent list on-premises instances call to return the next set of on-premises instances in the list.
     */
    nextToken?: NextToken;
  }
  export type ListStateFilterAction = "include"|"exclude"|"ignore"|string;
  export interface ListTagsForResourceInput {
    /**
     *  The ARN of a CodeDeploy resource. ListTagsForResource returns all the tags associated with the resource that is identified by the ResourceArn. 
     */
    ResourceArn: Arn;
    /**
     * An identifier returned from the previous ListTagsForResource call. It can be used to return the next set of applications in the list.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceOutput {
    /**
     *  A list of tags returned by ListTagsForResource. The tags are associated with the resource identified by the input ResourceArn parameter. 
     */
    Tags?: TagList;
    /**
     * If a large amount of information is returned, an identifier is also returned. It can be used in a subsequent list application revisions call to return the next set of application revisions in the list.
     */
    NextToken?: NextToken;
  }
  export type ListenerArn = string;
  export type ListenerArnList = ListenerArn[];
  export interface LoadBalancerInfo {
    /**
     * An array that contains information about the load balancers to use for load balancing in a deployment. If you're using Classic Load Balancers, specify those load balancers in this array.   You can add up to 10 load balancers to the array.   If you're using Application Load Balancers or Network Load Balancers, use the targetGroupInfoList array instead of this one. 
     */
    elbInfoList?: ELBInfoList;
    /**
     * An array that contains information about the target groups to use for load balancing in a deployment. If you're using Application Load Balancers and Network Load Balancers, specify their associated target groups in this array.  You can add up to 10 target groups to the array.   If you're using Classic Load Balancers, use the elbInfoList array instead of this one. 
     */
    targetGroupInfoList?: TargetGroupInfoList;
    /**
     *  The target group pair information. This is an array of TargeGroupPairInfo objects with a maximum size of one. 
     */
    targetGroupPairInfoList?: TargetGroupPairInfoList;
  }
  export type LogTail = string;
  export type Message = string;
  export interface MinimumHealthyHosts {
    /**
     * The minimum healthy instance type:    HOST_COUNT: The minimum number of healthy instances as an absolute value.    FLEET_PERCENT: The minimum number of healthy instances as a percentage of the total number of instances in the deployment.   In an example of nine instances, if a HOST_COUNT of six is specified, deploy to up to three instances at a time. The deployment is successful if six or more instances are deployed to successfully. Otherwise, the deployment fails. If a FLEET_PERCENT of 40 is specified, deploy to up to five instances at a time. The deployment is successful if four or more instances are deployed to successfully. Otherwise, the deployment fails.  In a call to the GetDeploymentConfig, CodeDeployDefault.OneAtATime returns a minimum healthy instance type of MOST_CONCURRENCY and a value of 1. This means a deployment to only one instance at a time. (You cannot set the type to MOST_CONCURRENCY, only to HOST_COUNT or FLEET_PERCENT.) In addition, with CodeDeployDefault.OneAtATime, CodeDeploy attempts to ensure that all instances but one are kept in a healthy state during the deployment. Although this allows one instance at a time to be taken offline for a new deployment, it also means that if the deployment to the last instance fails, the overall deployment is still successful.  For more information, see CodeDeploy Instance Health in the CodeDeploy User Guide.
     */
    type?: MinimumHealthyHostsType;
    /**
     * The minimum healthy instance value.
     */
    value?: MinimumHealthyHostsValue;
  }
  export type MinimumHealthyHostsType = "HOST_COUNT"|"FLEET_PERCENT"|string;
  export type MinimumHealthyHostsValue = number;
  export type NextToken = string;
  export type NullableBoolean = boolean;
  export interface OnPremisesTagSet {
    /**
     * A list that contains other lists of on-premises instance tag groups. For an instance to be included in the deployment group, it must be identified by all of the tag groups in the list.
     */
    onPremisesTagSetList?: OnPremisesTagSetList;
  }
  export type OnPremisesTagSetList = TagFilterList[];
  export type OutdatedInstancesStrategy = "UPDATE"|"IGNORE"|string;
  export type Percentage = number;
  export interface PutLifecycleEventHookExecutionStatusInput {
    /**
     *  The unique ID of a deployment. Pass this ID to a Lambda function that validates a deployment lifecycle event. 
     */
    deploymentId?: DeploymentId;
    /**
     *  The execution ID of a deployment's lifecycle hook. A deployment lifecycle hook is specified in the hooks section of the AppSpec file. 
     */
    lifecycleEventHookExecutionId?: LifecycleEventHookExecutionId;
    /**
     * The result of a Lambda function that validates a deployment lifecycle event. The values listed in Valid Values are valid for lifecycle statuses in general; however, only Succeeded and Failed can be passed successfully in your API call.
     */
    status?: LifecycleEventStatus;
  }
  export interface PutLifecycleEventHookExecutionStatusOutput {
    /**
     * The execution ID of the lifecycle event hook. A hook is specified in the hooks section of the deployment's AppSpec file.
     */
    lifecycleEventHookExecutionId?: LifecycleEventHookExecutionId;
  }
  export interface RawString {
    /**
     * The YAML-formatted or JSON-formatted revision string. It includes information about which Lambda function to update and optional Lambda functions that validate deployment lifecycle events.
     */
    content?: RawStringContent;
    /**
     * The SHA256 hash value of the revision content.
     */
    sha256?: RawStringSha256;
  }
  export type RawStringContent = string;
  export type RawStringSha256 = string;
  export interface RegisterApplicationRevisionInput {
    /**
     * The name of an CodeDeploy application associated with the user or Amazon Web Services account.
     */
    applicationName: ApplicationName;
    /**
     * A comment about the revision.
     */
    description?: Description;
    /**
     * Information about the application revision to register, including type and location.
     */
    revision: RevisionLocation;
  }
  export interface RegisterOnPremisesInstanceInput {
    /**
     * The name of the on-premises instance to register.
     */
    instanceName: InstanceName;
    /**
     * The ARN of the IAM session to associate with the on-premises instance.
     */
    iamSessionArn?: IamSessionArn;
    /**
     * The ARN of the user to associate with the on-premises instance.
     */
    iamUserArn?: IamUserArn;
  }
  export type RegistrationStatus = "Registered"|"Deregistered"|string;
  export interface RelatedDeployments {
    /**
     * The deployment ID of the root deployment that triggered this deployment.
     */
    autoUpdateOutdatedInstancesRootDeploymentId?: DeploymentId;
    /**
     * The deployment IDs of 'auto-update outdated instances' deployments triggered by this deployment.
     */
    autoUpdateOutdatedInstancesDeploymentIds?: DeploymentsList;
  }
  export interface RemoveTagsFromOnPremisesInstancesInput {
    /**
     * The tag key-value pairs to remove from the on-premises instances.
     */
    tags: TagList;
    /**
     * The names of the on-premises instances from which to remove tags.
     */
    instanceNames: InstanceNameList;
  }
  export type Repository = string;
  export interface RevisionInfo {
    /**
     * Information about the location and type of an application revision.
     */
    revisionLocation?: RevisionLocation;
    /**
     * Information about an application revision, including usage details and associated deployment groups.
     */
    genericRevisionInfo?: GenericRevisionInfo;
  }
  export type RevisionInfoList = RevisionInfo[];
  export interface RevisionLocation {
    /**
     * The type of application revision:   S3: An application revision stored in Amazon S3.   GitHub: An application revision stored in GitHub (EC2/On-premises deployments only).   String: A YAML-formatted or JSON-formatted string (Lambda deployments only).   AppSpecContent: An AppSpecContent object that contains the contents of an AppSpec file for an Lambda or Amazon ECS deployment. The content is formatted as JSON or YAML stored as a RawString.  
     */
    revisionType?: RevisionLocationType;
    /**
     * Information about the location of a revision stored in Amazon S3. 
     */
    s3Location?: S3Location;
    /**
     * Information about the location of application artifacts stored in GitHub.
     */
    gitHubLocation?: GitHubLocation;
    /**
     * Information about the location of an Lambda deployment revision stored as a RawString.
     */
    string?: RawString;
    /**
     *  The content of an AppSpec file for an Lambda or Amazon ECS deployment. The content is formatted as JSON or YAML and stored as a RawString. 
     */
    appSpecContent?: AppSpecContent;
  }
  export type RevisionLocationList = RevisionLocation[];
  export type RevisionLocationType = "S3"|"GitHub"|"String"|"AppSpecContent"|string;
  export type Role = string;
  export interface RollbackInfo {
    /**
     * The ID of the deployment rollback.
     */
    rollbackDeploymentId?: DeploymentId;
    /**
     * The deployment ID of the deployment that was underway and triggered a rollback deployment because it failed or was stopped.
     */
    rollbackTriggeringDeploymentId?: DeploymentId;
    /**
     * Information that describes the status of a deployment rollback (for example, whether the deployment can't be rolled back, is in progress, failed, or succeeded). 
     */
    rollbackMessage?: Description;
  }
  export type S3Bucket = string;
  export type S3Key = string;
  export interface S3Location {
    /**
     * The name of the Amazon S3 bucket where the application revision is stored.
     */
    bucket?: S3Bucket;
    /**
     * The name of the Amazon S3 object that represents the bundled artifacts for the application revision.
     */
    key?: S3Key;
    /**
     * The file type of the application revision. Must be one of the following:    tar: A tar archive file.    tgz: A compressed tar archive file.    zip: A zip archive file.    YAML: A YAML-formatted file.    JSON: A JSON-formatted file.  
     */
    bundleType?: BundleType;
    /**
     * A specific version of the Amazon S3 object that represents the bundled artifacts for the application revision. If the version is not specified, the system uses the most recent version by default.
     */
    version?: VersionId;
    /**
     * The ETag of the Amazon S3 object that represents the bundled artifacts for the application revision. If the ETag is not specified as an input parameter, ETag validation of the object is skipped.
     */
    eTag?: ETag;
  }
  export type ScriptName = string;
  export interface SkipWaitTimeForInstanceTerminationInput {
    /**
     *  The unique ID of a blue/green deployment for which you want to skip the instance termination wait time. 
     */
    deploymentId?: DeploymentId;
  }
  export type SortOrder = "ascending"|"descending"|string;
  export interface StopDeploymentInput {
    /**
     *  The unique ID of a deployment. 
     */
    deploymentId: DeploymentId;
    /**
     *  Indicates, when a deployment is stopped, whether instances that have been updated should be rolled back to the previous version of the application revision. 
     */
    autoRollbackEnabled?: NullableBoolean;
  }
  export interface StopDeploymentOutput {
    /**
     * The status of the stop deployment operation:   Pending: The stop operation is pending.   Succeeded: The stop operation was successful.  
     */
    status?: StopStatus;
    /**
     * An accompanying status message.
     */
    statusMessage?: Message;
  }
  export type StopStatus = "Pending"|"Succeeded"|string;
  export interface Tag {
    /**
     * The tag's key.
     */
    Key?: Key;
    /**
     * The tag's value.
     */
    Value?: Value;
  }
  export interface TagFilter {
    /**
     * The on-premises instance tag filter key.
     */
    Key?: Key;
    /**
     * The on-premises instance tag filter value.
     */
    Value?: Value;
    /**
     * The on-premises instance tag filter type:   KEY_ONLY: Key only.   VALUE_ONLY: Value only.   KEY_AND_VALUE: Key and value.  
     */
    Type?: TagFilterType;
  }
  export type TagFilterList = TagFilter[];
  export type TagFilterType = "KEY_ONLY"|"VALUE_ONLY"|"KEY_AND_VALUE"|string;
  export type TagKeyList = Key[];
  export type TagList = Tag[];
  export interface TagResourceInput {
    /**
     *  The ARN of a resource, such as a CodeDeploy application or deployment group. 
     */
    ResourceArn: Arn;
    /**
     *  A list of tags that TagResource associates with a resource. The resource is identified by the ResourceArn input parameter. 
     */
    Tags: TagList;
  }
  export interface TagResourceOutput {
  }
  export type TargetArn = string;
  export type TargetFilterName = "TargetStatus"|"ServerInstanceLabel"|string;
  export type TargetFilters = {[key: string]: FilterValueList};
  export interface TargetGroupInfo {
    /**
     * For blue/green deployments, the name of the target group that instances in the original environment are deregistered from, and instances in the replacement environment are registered with. For in-place deployments, the name of the target group that instances are deregistered from, so they are not serving traffic during a deployment, and then re-registered with after the deployment is complete. 
     */
    name?: TargetGroupName;
  }
  export type TargetGroupInfoList = TargetGroupInfo[];
  export type TargetGroupName = string;
  export interface TargetGroupPairInfo {
    /**
     *  One pair of target groups. One is associated with the original task set. The second is associated with the task set that serves traffic after the deployment is complete. 
     */
    targetGroups?: TargetGroupInfoList;
    /**
     *  The path used by a load balancer to route production traffic when an Amazon ECS deployment is complete. 
     */
    prodTrafficRoute?: TrafficRoute;
    /**
     *  An optional path used by a load balancer to route test traffic after an Amazon ECS deployment. Validation can occur while test traffic is served during a deployment. 
     */
    testTrafficRoute?: TrafficRoute;
  }
  export type TargetGroupPairInfoList = TargetGroupPairInfo[];
  export type TargetId = string;
  export type TargetIdList = TargetId[];
  export interface TargetInstances {
    /**
     * The tag filter key, type, and value used to identify Amazon EC2 instances in a replacement environment for a blue/green deployment. Cannot be used in the same call as ec2TagSet.
     */
    tagFilters?: EC2TagFilterList;
    /**
     * The names of one or more Auto Scaling groups to identify a replacement environment for a blue/green deployment.
     */
    autoScalingGroups?: AutoScalingGroupNameList;
    /**
     * Information about the groups of Amazon EC2 instance tags that an instance must be identified by in order for it to be included in the replacement environment for a blue/green deployment. Cannot be used in the same call as tagFilters.
     */
    ec2TagSet?: EC2TagSet;
  }
  export type TargetLabel = "Blue"|"Green"|string;
  export type TargetStatus = "Pending"|"InProgress"|"Succeeded"|"Failed"|"Skipped"|"Unknown"|"Ready"|string;
  export type Time = Date;
  export interface TimeBasedCanary {
    /**
     * The percentage of traffic to shift in the first increment of a TimeBasedCanary deployment.
     */
    canaryPercentage?: Percentage;
    /**
     * The number of minutes between the first and second traffic shifts of a TimeBasedCanary deployment.
     */
    canaryInterval?: WaitTimeInMins;
  }
  export interface TimeBasedLinear {
    /**
     * The percentage of traffic that is shifted at the start of each increment of a TimeBasedLinear deployment.
     */
    linearPercentage?: Percentage;
    /**
     * The number of minutes between each incremental traffic shift of a TimeBasedLinear deployment.
     */
    linearInterval?: WaitTimeInMins;
  }
  export interface TimeRange {
    /**
     * The start time of the time range.  Specify null to leave the start time open-ended. 
     */
    start?: Timestamp;
    /**
     * The end time of the time range.  Specify null to leave the end time open-ended. 
     */
    end?: Timestamp;
  }
  export type Timestamp = Date;
  export interface TrafficRoute {
    /**
     *  The Amazon Resource Name (ARN) of one listener. The listener identifies the route between a target group and a load balancer. This is an array of strings with a maximum size of one. 
     */
    listenerArns?: ListenerArnList;
  }
  export interface TrafficRoutingConfig {
    /**
     * The type of traffic shifting (TimeBasedCanary or TimeBasedLinear) used by a deployment configuration.
     */
    type?: TrafficRoutingType;
    /**
     * A configuration that shifts traffic from one version of a Lambda function or ECS task set to another in two increments. The original and target Lambda function versions or ECS task sets are specified in the deployment's AppSpec file.
     */
    timeBasedCanary?: TimeBasedCanary;
    /**
     * A configuration that shifts traffic from one version of a Lambda function or Amazon ECS task set to another in equal increments, with an equal number of minutes between each increment. The original and target Lambda function versions or Amazon ECS task sets are specified in the deployment's AppSpec file.
     */
    timeBasedLinear?: TimeBasedLinear;
  }
  export type TrafficRoutingType = "TimeBasedCanary"|"TimeBasedLinear"|"AllAtOnce"|string;
  export type TrafficWeight = number;
  export interface TriggerConfig {
    /**
     * The name of the notification trigger.
     */
    triggerName?: TriggerName;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Simple Notification Service topic through which notifications about deployment or instance events are sent.
     */
    triggerTargetArn?: TriggerTargetArn;
    /**
     * The event type or types for which notifications are triggered.
     */
    triggerEvents?: TriggerEventTypeList;
  }
  export type TriggerConfigList = TriggerConfig[];
  export type TriggerEventType = "DeploymentStart"|"DeploymentSuccess"|"DeploymentFailure"|"DeploymentStop"|"DeploymentRollback"|"DeploymentReady"|"InstanceStart"|"InstanceSuccess"|"InstanceFailure"|"InstanceReady"|string;
  export type TriggerEventTypeList = TriggerEventType[];
  export type TriggerName = string;
  export type TriggerTargetArn = string;
  export interface UntagResourceInput {
    /**
     *  The Amazon Resource Name (ARN) that specifies from which resource to disassociate the tags with the keys in the TagKeys input parameter. 
     */
    ResourceArn: Arn;
    /**
     *  A list of keys of Tag objects. The Tag objects identified by the keys are disassociated from the resource specified by the ResourceArn input parameter. 
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceOutput {
  }
  export interface UpdateApplicationInput {
    /**
     * The current name of the application you want to change.
     */
    applicationName?: ApplicationName;
    /**
     * The new name to give the application.
     */
    newApplicationName?: ApplicationName;
  }
  export interface UpdateDeploymentGroupInput {
    /**
     * The application name that corresponds to the deployment group to update.
     */
    applicationName: ApplicationName;
    /**
     * The current name of the deployment group.
     */
    currentDeploymentGroupName: DeploymentGroupName;
    /**
     * The new name of the deployment group, if you want to change it.
     */
    newDeploymentGroupName?: DeploymentGroupName;
    /**
     * The replacement deployment configuration name to use, if you want to change it.
     */
    deploymentConfigName?: DeploymentConfigName;
    /**
     * The replacement set of Amazon EC2 tags on which to filter, if you want to change them. To keep the existing tags, enter their names. To remove tags, do not enter any tag names.
     */
    ec2TagFilters?: EC2TagFilterList;
    /**
     * The replacement set of on-premises instance tags on which to filter, if you want to change them. To keep the existing tags, enter their names. To remove tags, do not enter any tag names.
     */
    onPremisesInstanceTagFilters?: TagFilterList;
    /**
     * The replacement list of Auto Scaling groups to be included in the deployment group, if you want to change them.   To keep the Auto Scaling groups, enter their names or do not specify this parameter.    To remove Auto Scaling groups, specify a non-null empty list of Auto Scaling group names to detach all CodeDeploy-managed Auto Scaling lifecycle hooks. For examples, see Amazon EC2 instances in an Amazon EC2 Auto Scaling group fail to launch and receive the error "Heartbeat Timeout" in the CodeDeploy User Guide.  
     */
    autoScalingGroups?: AutoScalingGroupNameList;
    /**
     * A replacement ARN for the service role, if you want to change it.
     */
    serviceRoleArn?: Role;
    /**
     * Information about triggers to change when the deployment group is updated. For examples, see Edit a Trigger in a CodeDeploy Deployment Group in the CodeDeploy User Guide.
     */
    triggerConfigurations?: TriggerConfigList;
    /**
     * Information to add or change about Amazon CloudWatch alarms when the deployment group is updated.
     */
    alarmConfiguration?: AlarmConfiguration;
    /**
     * Information for an automatic rollback configuration that is added or changed when a deployment group is updated.
     */
    autoRollbackConfiguration?: AutoRollbackConfiguration;
    /**
     * Indicates what happens when new Amazon EC2 instances are launched mid-deployment and do not receive the deployed application revision. If this option is set to UPDATE or is unspecified, CodeDeploy initiates one or more 'auto-update outdated instances' deployments to apply the deployed application revision to the new Amazon EC2 instances. If this option is set to IGNORE, CodeDeploy does not initiate a deployment to update the new Amazon EC2 instances. This may result in instances having different revisions.
     */
    outdatedInstancesStrategy?: OutdatedInstancesStrategy;
    /**
     * Information about the type of deployment, either in-place or blue/green, you want to run and whether to route deployment traffic behind a load balancer.
     */
    deploymentStyle?: DeploymentStyle;
    /**
     * Information about blue/green deployment options for a deployment group.
     */
    blueGreenDeploymentConfiguration?: BlueGreenDeploymentConfiguration;
    /**
     * Information about the load balancer used in a deployment.
     */
    loadBalancerInfo?: LoadBalancerInfo;
    /**
     * Information about groups of tags applied to on-premises instances. The deployment group includes only Amazon EC2 instances identified by all the tag groups.
     */
    ec2TagSet?: EC2TagSet;
    /**
     *  The target Amazon ECS services in the deployment group. This applies only to deployment groups that use the Amazon ECS compute platform. A target Amazon ECS service is specified as an Amazon ECS cluster and service name pair using the format &lt;clustername&gt;:&lt;servicename&gt;. 
     */
    ecsServices?: ECSServiceList;
    /**
     * Information about an on-premises instance tag set. The deployment group includes only on-premises instances identified by all the tag groups.
     */
    onPremisesTagSet?: OnPremisesTagSet;
  }
  export interface UpdateDeploymentGroupOutput {
    /**
     * If the output contains no data, and the corresponding deployment group contained at least one Auto Scaling group, CodeDeploy successfully removed all corresponding Auto Scaling lifecycle event hooks from the Amazon Web Services account. If the output contains data, CodeDeploy could not remove some Auto Scaling lifecycle event hooks from the Amazon Web Services account.
     */
    hooksNotCleanedUp?: AutoScalingGroupList;
  }
  export type Value = string;
  export type Version = string;
  export type VersionId = string;
  export type WaitTimeInMins = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2014-10-06"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CodeDeploy client.
   */
  export import Types = CodeDeploy;
}
export = CodeDeploy;
