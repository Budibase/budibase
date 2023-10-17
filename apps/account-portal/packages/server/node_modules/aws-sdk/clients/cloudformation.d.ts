import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class CloudFormation extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: CloudFormation.Types.ClientConfiguration)
  config: Config & CloudFormation.Types.ClientConfiguration;
  /**
   * Activate trusted access with Organizations. With trusted access between StackSets and Organizations activated, the management account has permissions to create and manage StackSets for your organization.
   */
  activateOrganizationsAccess(params: CloudFormation.Types.ActivateOrganizationsAccessInput, callback?: (err: AWSError, data: CloudFormation.Types.ActivateOrganizationsAccessOutput) => void): Request<CloudFormation.Types.ActivateOrganizationsAccessOutput, AWSError>;
  /**
   * Activate trusted access with Organizations. With trusted access between StackSets and Organizations activated, the management account has permissions to create and manage StackSets for your organization.
   */
  activateOrganizationsAccess(callback?: (err: AWSError, data: CloudFormation.Types.ActivateOrganizationsAccessOutput) => void): Request<CloudFormation.Types.ActivateOrganizationsAccessOutput, AWSError>;
  /**
   * Activates a public third-party extension, making it available for use in stack templates. For more information, see Using public extensions in the CloudFormation User Guide. Once you have activated a public third-party extension in your account and Region, use SetTypeConfiguration to specify configuration properties for the extension. For more information, see Configuring extensions at the account level in the CloudFormation User Guide.
   */
  activateType(params: CloudFormation.Types.ActivateTypeInput, callback?: (err: AWSError, data: CloudFormation.Types.ActivateTypeOutput) => void): Request<CloudFormation.Types.ActivateTypeOutput, AWSError>;
  /**
   * Activates a public third-party extension, making it available for use in stack templates. For more information, see Using public extensions in the CloudFormation User Guide. Once you have activated a public third-party extension in your account and Region, use SetTypeConfiguration to specify configuration properties for the extension. For more information, see Configuring extensions at the account level in the CloudFormation User Guide.
   */
  activateType(callback?: (err: AWSError, data: CloudFormation.Types.ActivateTypeOutput) => void): Request<CloudFormation.Types.ActivateTypeOutput, AWSError>;
  /**
   * Returns configuration data for the specified CloudFormation extensions, from the CloudFormation registry for the account and Region. For more information, see Configuring extensions at the account level in the CloudFormation User Guide.
   */
  batchDescribeTypeConfigurations(params: CloudFormation.Types.BatchDescribeTypeConfigurationsInput, callback?: (err: AWSError, data: CloudFormation.Types.BatchDescribeTypeConfigurationsOutput) => void): Request<CloudFormation.Types.BatchDescribeTypeConfigurationsOutput, AWSError>;
  /**
   * Returns configuration data for the specified CloudFormation extensions, from the CloudFormation registry for the account and Region. For more information, see Configuring extensions at the account level in the CloudFormation User Guide.
   */
  batchDescribeTypeConfigurations(callback?: (err: AWSError, data: CloudFormation.Types.BatchDescribeTypeConfigurationsOutput) => void): Request<CloudFormation.Types.BatchDescribeTypeConfigurationsOutput, AWSError>;
  /**
   * Cancels an update on the specified stack. If the call completes successfully, the stack rolls back the update and reverts to the previous stack configuration.  You can cancel only stacks that are in the UPDATE_IN_PROGRESS state. 
   */
  cancelUpdateStack(params: CloudFormation.Types.CancelUpdateStackInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Cancels an update on the specified stack. If the call completes successfully, the stack rolls back the update and reverts to the previous stack configuration.  You can cancel only stacks that are in the UPDATE_IN_PROGRESS state. 
   */
  cancelUpdateStack(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * For a specified stack that's in the UPDATE_ROLLBACK_FAILED state, continues rolling it back to the UPDATE_ROLLBACK_COMPLETE state. Depending on the cause of the failure, you can manually  fix the error and continue the rollback. By continuing the rollback, you can return your stack to a working state (the UPDATE_ROLLBACK_COMPLETE state), and then try to update the stack again. A stack goes into the UPDATE_ROLLBACK_FAILED state when CloudFormation can't roll back all changes after a failed stack update. For example, you might have a stack that's rolling back to an old database instance that was deleted outside of CloudFormation. Because CloudFormation doesn't know the database was deleted, it assumes that the database instance still exists and attempts to roll back to it, causing the update rollback to fail.
   */
  continueUpdateRollback(params: CloudFormation.Types.ContinueUpdateRollbackInput, callback?: (err: AWSError, data: CloudFormation.Types.ContinueUpdateRollbackOutput) => void): Request<CloudFormation.Types.ContinueUpdateRollbackOutput, AWSError>;
  /**
   * For a specified stack that's in the UPDATE_ROLLBACK_FAILED state, continues rolling it back to the UPDATE_ROLLBACK_COMPLETE state. Depending on the cause of the failure, you can manually  fix the error and continue the rollback. By continuing the rollback, you can return your stack to a working state (the UPDATE_ROLLBACK_COMPLETE state), and then try to update the stack again. A stack goes into the UPDATE_ROLLBACK_FAILED state when CloudFormation can't roll back all changes after a failed stack update. For example, you might have a stack that's rolling back to an old database instance that was deleted outside of CloudFormation. Because CloudFormation doesn't know the database was deleted, it assumes that the database instance still exists and attempts to roll back to it, causing the update rollback to fail.
   */
  continueUpdateRollback(callback?: (err: AWSError, data: CloudFormation.Types.ContinueUpdateRollbackOutput) => void): Request<CloudFormation.Types.ContinueUpdateRollbackOutput, AWSError>;
  /**
   * Creates a list of changes that will be applied to a stack so that you can review the changes before executing them. You can create a change set for a stack that doesn't exist or an existing stack. If you create a change set for a stack that doesn't exist, the change set shows all of the resources that CloudFormation will create. If you create a change set for an existing stack, CloudFormation compares the stack's information with the information that you submit in the change set and lists the differences. Use change sets to understand which resources CloudFormation will create or change, and how it will change resources in an existing stack, before you create or update a stack. To create a change set for a stack that doesn't exist, for the ChangeSetType parameter, specify CREATE. To create a change set for an existing stack, specify UPDATE for the ChangeSetType parameter. To create a change set for an import operation, specify IMPORT for the ChangeSetType parameter. After the CreateChangeSet call successfully completes, CloudFormation starts creating the change set. To check the status of the change set or to review it, use the DescribeChangeSet action. When you are satisfied with the changes the change set will make, execute the change set by using the ExecuteChangeSet action. CloudFormation doesn't make changes until you execute the change set. To create a change set for the entire stack hierarchy, set IncludeNestedStacks to True.
   */
  createChangeSet(params: CloudFormation.Types.CreateChangeSetInput, callback?: (err: AWSError, data: CloudFormation.Types.CreateChangeSetOutput) => void): Request<CloudFormation.Types.CreateChangeSetOutput, AWSError>;
  /**
   * Creates a list of changes that will be applied to a stack so that you can review the changes before executing them. You can create a change set for a stack that doesn't exist or an existing stack. If you create a change set for a stack that doesn't exist, the change set shows all of the resources that CloudFormation will create. If you create a change set for an existing stack, CloudFormation compares the stack's information with the information that you submit in the change set and lists the differences. Use change sets to understand which resources CloudFormation will create or change, and how it will change resources in an existing stack, before you create or update a stack. To create a change set for a stack that doesn't exist, for the ChangeSetType parameter, specify CREATE. To create a change set for an existing stack, specify UPDATE for the ChangeSetType parameter. To create a change set for an import operation, specify IMPORT for the ChangeSetType parameter. After the CreateChangeSet call successfully completes, CloudFormation starts creating the change set. To check the status of the change set or to review it, use the DescribeChangeSet action. When you are satisfied with the changes the change set will make, execute the change set by using the ExecuteChangeSet action. CloudFormation doesn't make changes until you execute the change set. To create a change set for the entire stack hierarchy, set IncludeNestedStacks to True.
   */
  createChangeSet(callback?: (err: AWSError, data: CloudFormation.Types.CreateChangeSetOutput) => void): Request<CloudFormation.Types.CreateChangeSetOutput, AWSError>;
  /**
   * Creates a stack as specified in the template. After the call completes successfully, the stack creation starts. You can check the status of the stack through the DescribeStacks operation.
   */
  createStack(params: CloudFormation.Types.CreateStackInput, callback?: (err: AWSError, data: CloudFormation.Types.CreateStackOutput) => void): Request<CloudFormation.Types.CreateStackOutput, AWSError>;
  /**
   * Creates a stack as specified in the template. After the call completes successfully, the stack creation starts. You can check the status of the stack through the DescribeStacks operation.
   */
  createStack(callback?: (err: AWSError, data: CloudFormation.Types.CreateStackOutput) => void): Request<CloudFormation.Types.CreateStackOutput, AWSError>;
  /**
   * Creates stack instances for the specified accounts, within the specified Amazon Web Services Regions. A stack instance refers to a stack in a specific account and Region. You must specify at least one value for either Accounts or DeploymentTargets, and you must specify at least one value for Regions.
   */
  createStackInstances(params: CloudFormation.Types.CreateStackInstancesInput, callback?: (err: AWSError, data: CloudFormation.Types.CreateStackInstancesOutput) => void): Request<CloudFormation.Types.CreateStackInstancesOutput, AWSError>;
  /**
   * Creates stack instances for the specified accounts, within the specified Amazon Web Services Regions. A stack instance refers to a stack in a specific account and Region. You must specify at least one value for either Accounts or DeploymentTargets, and you must specify at least one value for Regions.
   */
  createStackInstances(callback?: (err: AWSError, data: CloudFormation.Types.CreateStackInstancesOutput) => void): Request<CloudFormation.Types.CreateStackInstancesOutput, AWSError>;
  /**
   * Creates a stack set.
   */
  createStackSet(params: CloudFormation.Types.CreateStackSetInput, callback?: (err: AWSError, data: CloudFormation.Types.CreateStackSetOutput) => void): Request<CloudFormation.Types.CreateStackSetOutput, AWSError>;
  /**
   * Creates a stack set.
   */
  createStackSet(callback?: (err: AWSError, data: CloudFormation.Types.CreateStackSetOutput) => void): Request<CloudFormation.Types.CreateStackSetOutput, AWSError>;
  /**
   * Deactivates trusted access with Organizations. If trusted access is deactivated, the management account does not have permissions to create and manage service-managed StackSets for your organization.
   */
  deactivateOrganizationsAccess(params: CloudFormation.Types.DeactivateOrganizationsAccessInput, callback?: (err: AWSError, data: CloudFormation.Types.DeactivateOrganizationsAccessOutput) => void): Request<CloudFormation.Types.DeactivateOrganizationsAccessOutput, AWSError>;
  /**
   * Deactivates trusted access with Organizations. If trusted access is deactivated, the management account does not have permissions to create and manage service-managed StackSets for your organization.
   */
  deactivateOrganizationsAccess(callback?: (err: AWSError, data: CloudFormation.Types.DeactivateOrganizationsAccessOutput) => void): Request<CloudFormation.Types.DeactivateOrganizationsAccessOutput, AWSError>;
  /**
   * Deactivates a public extension that was previously activated in this account and Region. Once deactivated, an extension can't be used in any CloudFormation operation. This includes stack update operations where the stack template includes the extension, even if no updates are being made to the extension. In addition, deactivated extensions aren't automatically updated if a new version of the extension is released.
   */
  deactivateType(params: CloudFormation.Types.DeactivateTypeInput, callback?: (err: AWSError, data: CloudFormation.Types.DeactivateTypeOutput) => void): Request<CloudFormation.Types.DeactivateTypeOutput, AWSError>;
  /**
   * Deactivates a public extension that was previously activated in this account and Region. Once deactivated, an extension can't be used in any CloudFormation operation. This includes stack update operations where the stack template includes the extension, even if no updates are being made to the extension. In addition, deactivated extensions aren't automatically updated if a new version of the extension is released.
   */
  deactivateType(callback?: (err: AWSError, data: CloudFormation.Types.DeactivateTypeOutput) => void): Request<CloudFormation.Types.DeactivateTypeOutput, AWSError>;
  /**
   * Deletes the specified change set. Deleting change sets ensures that no one executes the wrong change set. If the call successfully completes, CloudFormation successfully deleted the change set. If IncludeNestedStacks specifies True during the creation of the nested change set, then DeleteChangeSet will delete all change sets that belong to the stacks hierarchy and will also delete all change sets for nested stacks with the status of REVIEW_IN_PROGRESS.
   */
  deleteChangeSet(params: CloudFormation.Types.DeleteChangeSetInput, callback?: (err: AWSError, data: CloudFormation.Types.DeleteChangeSetOutput) => void): Request<CloudFormation.Types.DeleteChangeSetOutput, AWSError>;
  /**
   * Deletes the specified change set. Deleting change sets ensures that no one executes the wrong change set. If the call successfully completes, CloudFormation successfully deleted the change set. If IncludeNestedStacks specifies True during the creation of the nested change set, then DeleteChangeSet will delete all change sets that belong to the stacks hierarchy and will also delete all change sets for nested stacks with the status of REVIEW_IN_PROGRESS.
   */
  deleteChangeSet(callback?: (err: AWSError, data: CloudFormation.Types.DeleteChangeSetOutput) => void): Request<CloudFormation.Types.DeleteChangeSetOutput, AWSError>;
  /**
   * Deletes a specified stack. Once the call completes successfully, stack deletion starts. Deleted stacks don't show up in the DescribeStacks operation if the deletion has been completed successfully.
   */
  deleteStack(params: CloudFormation.Types.DeleteStackInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a specified stack. Once the call completes successfully, stack deletion starts. Deleted stacks don't show up in the DescribeStacks operation if the deletion has been completed successfully.
   */
  deleteStack(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes stack instances for the specified accounts, in the specified Amazon Web Services Regions.
   */
  deleteStackInstances(params: CloudFormation.Types.DeleteStackInstancesInput, callback?: (err: AWSError, data: CloudFormation.Types.DeleteStackInstancesOutput) => void): Request<CloudFormation.Types.DeleteStackInstancesOutput, AWSError>;
  /**
   * Deletes stack instances for the specified accounts, in the specified Amazon Web Services Regions.
   */
  deleteStackInstances(callback?: (err: AWSError, data: CloudFormation.Types.DeleteStackInstancesOutput) => void): Request<CloudFormation.Types.DeleteStackInstancesOutput, AWSError>;
  /**
   * Deletes a stack set. Before you can delete a stack set, all its member stack instances must be deleted. For more information about how to complete this, see DeleteStackInstances.
   */
  deleteStackSet(params: CloudFormation.Types.DeleteStackSetInput, callback?: (err: AWSError, data: CloudFormation.Types.DeleteStackSetOutput) => void): Request<CloudFormation.Types.DeleteStackSetOutput, AWSError>;
  /**
   * Deletes a stack set. Before you can delete a stack set, all its member stack instances must be deleted. For more information about how to complete this, see DeleteStackInstances.
   */
  deleteStackSet(callback?: (err: AWSError, data: CloudFormation.Types.DeleteStackSetOutput) => void): Request<CloudFormation.Types.DeleteStackSetOutput, AWSError>;
  /**
   * Marks an extension or extension version as DEPRECATED in the CloudFormation registry, removing it from active use. Deprecated extensions or extension versions cannot be used in CloudFormation operations. To deregister an entire extension, you must individually deregister all active versions of that extension. If an extension has only a single active version, deregistering that version results in the extension itself being deregistered and marked as deprecated in the registry. You can't deregister the default version of an extension if there are other active version of that extension. If you do deregister the default version of an extension, the extension type itself is deregistered as well and marked as deprecated. To view the deprecation status of an extension or extension version, use DescribeType.
   */
  deregisterType(params: CloudFormation.Types.DeregisterTypeInput, callback?: (err: AWSError, data: CloudFormation.Types.DeregisterTypeOutput) => void): Request<CloudFormation.Types.DeregisterTypeOutput, AWSError>;
  /**
   * Marks an extension or extension version as DEPRECATED in the CloudFormation registry, removing it from active use. Deprecated extensions or extension versions cannot be used in CloudFormation operations. To deregister an entire extension, you must individually deregister all active versions of that extension. If an extension has only a single active version, deregistering that version results in the extension itself being deregistered and marked as deprecated in the registry. You can't deregister the default version of an extension if there are other active version of that extension. If you do deregister the default version of an extension, the extension type itself is deregistered as well and marked as deprecated. To view the deprecation status of an extension or extension version, use DescribeType.
   */
  deregisterType(callback?: (err: AWSError, data: CloudFormation.Types.DeregisterTypeOutput) => void): Request<CloudFormation.Types.DeregisterTypeOutput, AWSError>;
  /**
   * Retrieves your account's CloudFormation limits, such as the maximum number of stacks that you can create in your account. For more information about account limits, see CloudFormation Quotas in the CloudFormation User Guide.
   */
  describeAccountLimits(params: CloudFormation.Types.DescribeAccountLimitsInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeAccountLimitsOutput) => void): Request<CloudFormation.Types.DescribeAccountLimitsOutput, AWSError>;
  /**
   * Retrieves your account's CloudFormation limits, such as the maximum number of stacks that you can create in your account. For more information about account limits, see CloudFormation Quotas in the CloudFormation User Guide.
   */
  describeAccountLimits(callback?: (err: AWSError, data: CloudFormation.Types.DescribeAccountLimitsOutput) => void): Request<CloudFormation.Types.DescribeAccountLimitsOutput, AWSError>;
  /**
   * Returns the inputs for the change set and a list of changes that CloudFormation will make if you execute the change set. For more information, see Updating Stacks Using Change Sets in the CloudFormation User Guide.
   */
  describeChangeSet(params: CloudFormation.Types.DescribeChangeSetInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeChangeSetOutput) => void): Request<CloudFormation.Types.DescribeChangeSetOutput, AWSError>;
  /**
   * Returns the inputs for the change set and a list of changes that CloudFormation will make if you execute the change set. For more information, see Updating Stacks Using Change Sets in the CloudFormation User Guide.
   */
  describeChangeSet(callback?: (err: AWSError, data: CloudFormation.Types.DescribeChangeSetOutput) => void): Request<CloudFormation.Types.DescribeChangeSetOutput, AWSError>;
  /**
   * Returns hook-related information for the change set and a list of changes that CloudFormation makes when you run the change set.
   */
  describeChangeSetHooks(params: CloudFormation.Types.DescribeChangeSetHooksInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeChangeSetHooksOutput) => void): Request<CloudFormation.Types.DescribeChangeSetHooksOutput, AWSError>;
  /**
   * Returns hook-related information for the change set and a list of changes that CloudFormation makes when you run the change set.
   */
  describeChangeSetHooks(callback?: (err: AWSError, data: CloudFormation.Types.DescribeChangeSetHooksOutput) => void): Request<CloudFormation.Types.DescribeChangeSetHooksOutput, AWSError>;
  /**
   * Retrieves information about the account's OrganizationAccess status. This API can be called either by the management account or the delegated administrator by using the CallAs parameter. This API can also be called without the CallAs parameter by the management account.
   */
  describeOrganizationsAccess(params: CloudFormation.Types.DescribeOrganizationsAccessInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeOrganizationsAccessOutput) => void): Request<CloudFormation.Types.DescribeOrganizationsAccessOutput, AWSError>;
  /**
   * Retrieves information about the account's OrganizationAccess status. This API can be called either by the management account or the delegated administrator by using the CallAs parameter. This API can also be called without the CallAs parameter by the management account.
   */
  describeOrganizationsAccess(callback?: (err: AWSError, data: CloudFormation.Types.DescribeOrganizationsAccessOutput) => void): Request<CloudFormation.Types.DescribeOrganizationsAccessOutput, AWSError>;
  /**
   * Returns information about a CloudFormation extension publisher. If you don't supply a PublisherId, and you have registered as an extension publisher, DescribePublisher returns information about your own publisher account. For more information about registering as a publisher, see:    RegisterPublisher     Publishing extensions to make them available for public use in the CloudFormation CLI User Guide   
   */
  describePublisher(params: CloudFormation.Types.DescribePublisherInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribePublisherOutput) => void): Request<CloudFormation.Types.DescribePublisherOutput, AWSError>;
  /**
   * Returns information about a CloudFormation extension publisher. If you don't supply a PublisherId, and you have registered as an extension publisher, DescribePublisher returns information about your own publisher account. For more information about registering as a publisher, see:    RegisterPublisher     Publishing extensions to make them available for public use in the CloudFormation CLI User Guide   
   */
  describePublisher(callback?: (err: AWSError, data: CloudFormation.Types.DescribePublisherOutput) => void): Request<CloudFormation.Types.DescribePublisherOutput, AWSError>;
  /**
   * Returns information about a stack drift detection operation. A stack drift detection operation detects whether a stack's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. A stack is considered to have drifted if one or more of its resources have drifted. For more information about stack and resource drift, see Detecting Unregulated Configuration Changes to Stacks and Resources. Use DetectStackDrift to initiate a stack drift detection operation. DetectStackDrift returns a StackDriftDetectionId you can use to monitor the progress of the operation using DescribeStackDriftDetectionStatus. Once the drift detection operation has completed, use DescribeStackResourceDrifts to return drift information about the stack and its resources.
   */
  describeStackDriftDetectionStatus(params: CloudFormation.Types.DescribeStackDriftDetectionStatusInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackDriftDetectionStatusOutput) => void): Request<CloudFormation.Types.DescribeStackDriftDetectionStatusOutput, AWSError>;
  /**
   * Returns information about a stack drift detection operation. A stack drift detection operation detects whether a stack's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. A stack is considered to have drifted if one or more of its resources have drifted. For more information about stack and resource drift, see Detecting Unregulated Configuration Changes to Stacks and Resources. Use DetectStackDrift to initiate a stack drift detection operation. DetectStackDrift returns a StackDriftDetectionId you can use to monitor the progress of the operation using DescribeStackDriftDetectionStatus. Once the drift detection operation has completed, use DescribeStackResourceDrifts to return drift information about the stack and its resources.
   */
  describeStackDriftDetectionStatus(callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackDriftDetectionStatusOutput) => void): Request<CloudFormation.Types.DescribeStackDriftDetectionStatusOutput, AWSError>;
  /**
   * Returns all stack related events for a specified stack in reverse chronological order. For more information about a stack's event history, go to Stacks in the CloudFormation User Guide.  You can list events for stacks that have failed to create or have been deleted by specifying the unique stack identifier (stack ID). 
   */
  describeStackEvents(params: CloudFormation.Types.DescribeStackEventsInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackEventsOutput) => void): Request<CloudFormation.Types.DescribeStackEventsOutput, AWSError>;
  /**
   * Returns all stack related events for a specified stack in reverse chronological order. For more information about a stack's event history, go to Stacks in the CloudFormation User Guide.  You can list events for stacks that have failed to create or have been deleted by specifying the unique stack identifier (stack ID). 
   */
  describeStackEvents(callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackEventsOutput) => void): Request<CloudFormation.Types.DescribeStackEventsOutput, AWSError>;
  /**
   * Returns the stack instance that's associated with the specified StackSet, Amazon Web Services account, and Amazon Web Services Region. For a list of stack instances that are associated with a specific StackSet, use ListStackInstances.
   */
  describeStackInstance(params: CloudFormation.Types.DescribeStackInstanceInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackInstanceOutput) => void): Request<CloudFormation.Types.DescribeStackInstanceOutput, AWSError>;
  /**
   * Returns the stack instance that's associated with the specified StackSet, Amazon Web Services account, and Amazon Web Services Region. For a list of stack instances that are associated with a specific StackSet, use ListStackInstances.
   */
  describeStackInstance(callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackInstanceOutput) => void): Request<CloudFormation.Types.DescribeStackInstanceOutput, AWSError>;
  /**
   * Returns a description of the specified resource in the specified stack. For deleted stacks, DescribeStackResource returns resource information for up to 90 days after the stack has been deleted.
   */
  describeStackResource(params: CloudFormation.Types.DescribeStackResourceInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackResourceOutput) => void): Request<CloudFormation.Types.DescribeStackResourceOutput, AWSError>;
  /**
   * Returns a description of the specified resource in the specified stack. For deleted stacks, DescribeStackResource returns resource information for up to 90 days after the stack has been deleted.
   */
  describeStackResource(callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackResourceOutput) => void): Request<CloudFormation.Types.DescribeStackResourceOutput, AWSError>;
  /**
   * Returns drift information for the resources that have been checked for drift in the specified stack. This includes actual and expected configuration values for resources where CloudFormation detects configuration drift. For a given stack, there will be one StackResourceDrift for each stack resource that has been checked for drift. Resources that haven't yet been checked for drift aren't included. Resources that don't currently support drift detection aren't checked, and so not included. For a list of resources that support drift detection, see Resources that Support Drift Detection. Use DetectStackResourceDrift to detect drift on individual resources, or DetectStackDrift to detect drift on all supported resources for a given stack.
   */
  describeStackResourceDrifts(params: CloudFormation.Types.DescribeStackResourceDriftsInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackResourceDriftsOutput) => void): Request<CloudFormation.Types.DescribeStackResourceDriftsOutput, AWSError>;
  /**
   * Returns drift information for the resources that have been checked for drift in the specified stack. This includes actual and expected configuration values for resources where CloudFormation detects configuration drift. For a given stack, there will be one StackResourceDrift for each stack resource that has been checked for drift. Resources that haven't yet been checked for drift aren't included. Resources that don't currently support drift detection aren't checked, and so not included. For a list of resources that support drift detection, see Resources that Support Drift Detection. Use DetectStackResourceDrift to detect drift on individual resources, or DetectStackDrift to detect drift on all supported resources for a given stack.
   */
  describeStackResourceDrifts(callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackResourceDriftsOutput) => void): Request<CloudFormation.Types.DescribeStackResourceDriftsOutput, AWSError>;
  /**
   * Returns Amazon Web Services resource descriptions for running and deleted stacks. If StackName is specified, all the associated resources that are part of the stack are returned. If PhysicalResourceId is specified, the associated resources of the stack that the resource belongs to are returned.  Only the first 100 resources will be returned. If your stack has more resources than this, you should use ListStackResources instead.  For deleted stacks, DescribeStackResources returns resource information for up to 90 days after the stack has been deleted. You must specify either StackName or PhysicalResourceId, but not both. In addition, you can specify LogicalResourceId to filter the returned result. For more information about resources, the LogicalResourceId and PhysicalResourceId, go to the CloudFormation User Guide.  A ValidationError is returned if you specify both StackName and PhysicalResourceId in the same request. 
   */
  describeStackResources(params: CloudFormation.Types.DescribeStackResourcesInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackResourcesOutput) => void): Request<CloudFormation.Types.DescribeStackResourcesOutput, AWSError>;
  /**
   * Returns Amazon Web Services resource descriptions for running and deleted stacks. If StackName is specified, all the associated resources that are part of the stack are returned. If PhysicalResourceId is specified, the associated resources of the stack that the resource belongs to are returned.  Only the first 100 resources will be returned. If your stack has more resources than this, you should use ListStackResources instead.  For deleted stacks, DescribeStackResources returns resource information for up to 90 days after the stack has been deleted. You must specify either StackName or PhysicalResourceId, but not both. In addition, you can specify LogicalResourceId to filter the returned result. For more information about resources, the LogicalResourceId and PhysicalResourceId, go to the CloudFormation User Guide.  A ValidationError is returned if you specify both StackName and PhysicalResourceId in the same request. 
   */
  describeStackResources(callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackResourcesOutput) => void): Request<CloudFormation.Types.DescribeStackResourcesOutput, AWSError>;
  /**
   * Returns the description of the specified StackSet.
   */
  describeStackSet(params: CloudFormation.Types.DescribeStackSetInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackSetOutput) => void): Request<CloudFormation.Types.DescribeStackSetOutput, AWSError>;
  /**
   * Returns the description of the specified StackSet.
   */
  describeStackSet(callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackSetOutput) => void): Request<CloudFormation.Types.DescribeStackSetOutput, AWSError>;
  /**
   * Returns the description of the specified StackSet operation.
   */
  describeStackSetOperation(params: CloudFormation.Types.DescribeStackSetOperationInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackSetOperationOutput) => void): Request<CloudFormation.Types.DescribeStackSetOperationOutput, AWSError>;
  /**
   * Returns the description of the specified StackSet operation.
   */
  describeStackSetOperation(callback?: (err: AWSError, data: CloudFormation.Types.DescribeStackSetOperationOutput) => void): Request<CloudFormation.Types.DescribeStackSetOperationOutput, AWSError>;
  /**
   * Returns the description for the specified stack; if no stack name was specified, then it returns the description for all the stacks created.  If the stack doesn't exist, an ValidationError is returned. 
   */
  describeStacks(params: CloudFormation.Types.DescribeStacksInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Returns the description for the specified stack; if no stack name was specified, then it returns the description for all the stacks created.  If the stack doesn't exist, an ValidationError is returned. 
   */
  describeStacks(callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Returns detailed information about an extension that has been registered. If you specify a VersionId, DescribeType returns information about that specific extension version. Otherwise, it returns information about the default extension version.
   */
  describeType(params: CloudFormation.Types.DescribeTypeInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeTypeOutput) => void): Request<CloudFormation.Types.DescribeTypeOutput, AWSError>;
  /**
   * Returns detailed information about an extension that has been registered. If you specify a VersionId, DescribeType returns information about that specific extension version. Otherwise, it returns information about the default extension version.
   */
  describeType(callback?: (err: AWSError, data: CloudFormation.Types.DescribeTypeOutput) => void): Request<CloudFormation.Types.DescribeTypeOutput, AWSError>;
  /**
   * Returns information about an extension's registration, including its current status and type and version identifiers. When you initiate a registration request using RegisterType, you can then use DescribeTypeRegistration to monitor the progress of that registration request. Once the registration request has completed, use DescribeType to return detailed information about an extension.
   */
  describeTypeRegistration(params: CloudFormation.Types.DescribeTypeRegistrationInput, callback?: (err: AWSError, data: CloudFormation.Types.DescribeTypeRegistrationOutput) => void): Request<CloudFormation.Types.DescribeTypeRegistrationOutput, AWSError>;
  /**
   * Returns information about an extension's registration, including its current status and type and version identifiers. When you initiate a registration request using RegisterType, you can then use DescribeTypeRegistration to monitor the progress of that registration request. Once the registration request has completed, use DescribeType to return detailed information about an extension.
   */
  describeTypeRegistration(callback?: (err: AWSError, data: CloudFormation.Types.DescribeTypeRegistrationOutput) => void): Request<CloudFormation.Types.DescribeTypeRegistrationOutput, AWSError>;
  /**
   * Detects whether a stack's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. For each resource in the stack that supports drift detection, CloudFormation compares the actual configuration of the resource with its expected template configuration. Only resource properties explicitly defined in the stack template are checked for drift. A stack is considered to have drifted if one or more of its resources differ from their expected template configurations. For more information, see Detecting Unregulated Configuration Changes to Stacks and Resources. Use DetectStackDrift to detect drift on all supported resources for a given stack, or DetectStackResourceDrift to detect drift on individual resources. For a list of stack resources that currently support drift detection, see Resources that Support Drift Detection.  DetectStackDrift can take up to several minutes, depending on the number of resources contained within the stack. Use DescribeStackDriftDetectionStatus to monitor the progress of a detect stack drift operation. Once the drift detection operation has completed, use DescribeStackResourceDrifts to return drift information about the stack and its resources. When detecting drift on a stack, CloudFormation doesn't detect drift on any nested stacks belonging to that stack. Perform DetectStackDrift directly on the nested stack itself.
   */
  detectStackDrift(params: CloudFormation.Types.DetectStackDriftInput, callback?: (err: AWSError, data: CloudFormation.Types.DetectStackDriftOutput) => void): Request<CloudFormation.Types.DetectStackDriftOutput, AWSError>;
  /**
   * Detects whether a stack's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. For each resource in the stack that supports drift detection, CloudFormation compares the actual configuration of the resource with its expected template configuration. Only resource properties explicitly defined in the stack template are checked for drift. A stack is considered to have drifted if one or more of its resources differ from their expected template configurations. For more information, see Detecting Unregulated Configuration Changes to Stacks and Resources. Use DetectStackDrift to detect drift on all supported resources for a given stack, or DetectStackResourceDrift to detect drift on individual resources. For a list of stack resources that currently support drift detection, see Resources that Support Drift Detection.  DetectStackDrift can take up to several minutes, depending on the number of resources contained within the stack. Use DescribeStackDriftDetectionStatus to monitor the progress of a detect stack drift operation. Once the drift detection operation has completed, use DescribeStackResourceDrifts to return drift information about the stack and its resources. When detecting drift on a stack, CloudFormation doesn't detect drift on any nested stacks belonging to that stack. Perform DetectStackDrift directly on the nested stack itself.
   */
  detectStackDrift(callback?: (err: AWSError, data: CloudFormation.Types.DetectStackDriftOutput) => void): Request<CloudFormation.Types.DetectStackDriftOutput, AWSError>;
  /**
   * Returns information about whether a resource's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. This information includes actual and expected property values for resources in which CloudFormation detects drift. Only resource properties explicitly defined in the stack template are checked for drift. For more information about stack and resource drift, see Detecting Unregulated Configuration Changes to Stacks and Resources. Use DetectStackResourceDrift to detect drift on individual resources, or DetectStackDrift to detect drift on all resources in a given stack that support drift detection. Resources that don't currently support drift detection can't be checked. For a list of resources that support drift detection, see Resources that Support Drift Detection.
   */
  detectStackResourceDrift(params: CloudFormation.Types.DetectStackResourceDriftInput, callback?: (err: AWSError, data: CloudFormation.Types.DetectStackResourceDriftOutput) => void): Request<CloudFormation.Types.DetectStackResourceDriftOutput, AWSError>;
  /**
   * Returns information about whether a resource's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. This information includes actual and expected property values for resources in which CloudFormation detects drift. Only resource properties explicitly defined in the stack template are checked for drift. For more information about stack and resource drift, see Detecting Unregulated Configuration Changes to Stacks and Resources. Use DetectStackResourceDrift to detect drift on individual resources, or DetectStackDrift to detect drift on all resources in a given stack that support drift detection. Resources that don't currently support drift detection can't be checked. For a list of resources that support drift detection, see Resources that Support Drift Detection.
   */
  detectStackResourceDrift(callback?: (err: AWSError, data: CloudFormation.Types.DetectStackResourceDriftOutput) => void): Request<CloudFormation.Types.DetectStackResourceDriftOutput, AWSError>;
  /**
   * Detect drift on a stack set. When CloudFormation performs drift detection on a stack set, it performs drift detection on the stack associated with each stack instance in the stack set. For more information, see How CloudFormation performs drift detection on a stack set.  DetectStackSetDrift returns the OperationId of the stack set drift detection operation. Use this operation id with DescribeStackSetOperation to monitor the progress of the drift detection operation. The drift detection operation may take some time, depending on the number of stack instances included in the stack set, in addition to the number of resources included in each stack. Once the operation has completed, use the following actions to return drift information:   Use DescribeStackSet to return detailed information about the stack set, including detailed information about the last completed drift operation performed on the stack set. (Information about drift operations that are in progress isn't included.)   Use ListStackInstances to return a list of stack instances belonging to the stack set, including the drift status and last drift time checked of each instance.   Use DescribeStackInstance to return detailed information about a specific stack instance, including its drift status and last drift time checked.   For more information about performing a drift detection operation on a stack set, see Detecting unmanaged changes in stack sets. You can only run a single drift detection operation on a given stack set at one time. To stop a drift detection stack set operation, use StopStackSetOperation.
   */
  detectStackSetDrift(params: CloudFormation.Types.DetectStackSetDriftInput, callback?: (err: AWSError, data: CloudFormation.Types.DetectStackSetDriftOutput) => void): Request<CloudFormation.Types.DetectStackSetDriftOutput, AWSError>;
  /**
   * Detect drift on a stack set. When CloudFormation performs drift detection on a stack set, it performs drift detection on the stack associated with each stack instance in the stack set. For more information, see How CloudFormation performs drift detection on a stack set.  DetectStackSetDrift returns the OperationId of the stack set drift detection operation. Use this operation id with DescribeStackSetOperation to monitor the progress of the drift detection operation. The drift detection operation may take some time, depending on the number of stack instances included in the stack set, in addition to the number of resources included in each stack. Once the operation has completed, use the following actions to return drift information:   Use DescribeStackSet to return detailed information about the stack set, including detailed information about the last completed drift operation performed on the stack set. (Information about drift operations that are in progress isn't included.)   Use ListStackInstances to return a list of stack instances belonging to the stack set, including the drift status and last drift time checked of each instance.   Use DescribeStackInstance to return detailed information about a specific stack instance, including its drift status and last drift time checked.   For more information about performing a drift detection operation on a stack set, see Detecting unmanaged changes in stack sets. You can only run a single drift detection operation on a given stack set at one time. To stop a drift detection stack set operation, use StopStackSetOperation.
   */
  detectStackSetDrift(callback?: (err: AWSError, data: CloudFormation.Types.DetectStackSetDriftOutput) => void): Request<CloudFormation.Types.DetectStackSetDriftOutput, AWSError>;
  /**
   * Returns the estimated monthly cost of a template. The return value is an Amazon Web Services Simple Monthly Calculator URL with a query string that describes the resources required to run the template.
   */
  estimateTemplateCost(params: CloudFormation.Types.EstimateTemplateCostInput, callback?: (err: AWSError, data: CloudFormation.Types.EstimateTemplateCostOutput) => void): Request<CloudFormation.Types.EstimateTemplateCostOutput, AWSError>;
  /**
   * Returns the estimated monthly cost of a template. The return value is an Amazon Web Services Simple Monthly Calculator URL with a query string that describes the resources required to run the template.
   */
  estimateTemplateCost(callback?: (err: AWSError, data: CloudFormation.Types.EstimateTemplateCostOutput) => void): Request<CloudFormation.Types.EstimateTemplateCostOutput, AWSError>;
  /**
   * Updates a stack using the input information that was provided when the specified change set was created. After the call successfully completes, CloudFormation starts updating the stack. Use the DescribeStacks action to view the status of the update. When you execute a change set, CloudFormation deletes all other change sets associated with the stack because they aren't valid for the updated stack. If a stack policy is associated with the stack, CloudFormation enforces the policy during the update. You can't specify a temporary stack policy that overrides the current policy. To create a change set for the entire stack hierarchy, IncludeNestedStacks must have been set to True.
   */
  executeChangeSet(params: CloudFormation.Types.ExecuteChangeSetInput, callback?: (err: AWSError, data: CloudFormation.Types.ExecuteChangeSetOutput) => void): Request<CloudFormation.Types.ExecuteChangeSetOutput, AWSError>;
  /**
   * Updates a stack using the input information that was provided when the specified change set was created. After the call successfully completes, CloudFormation starts updating the stack. Use the DescribeStacks action to view the status of the update. When you execute a change set, CloudFormation deletes all other change sets associated with the stack because they aren't valid for the updated stack. If a stack policy is associated with the stack, CloudFormation enforces the policy during the update. You can't specify a temporary stack policy that overrides the current policy. To create a change set for the entire stack hierarchy, IncludeNestedStacks must have been set to True.
   */
  executeChangeSet(callback?: (err: AWSError, data: CloudFormation.Types.ExecuteChangeSetOutput) => void): Request<CloudFormation.Types.ExecuteChangeSetOutput, AWSError>;
  /**
   * Returns the stack policy for a specified stack. If a stack doesn't have a policy, a null value is returned.
   */
  getStackPolicy(params: CloudFormation.Types.GetStackPolicyInput, callback?: (err: AWSError, data: CloudFormation.Types.GetStackPolicyOutput) => void): Request<CloudFormation.Types.GetStackPolicyOutput, AWSError>;
  /**
   * Returns the stack policy for a specified stack. If a stack doesn't have a policy, a null value is returned.
   */
  getStackPolicy(callback?: (err: AWSError, data: CloudFormation.Types.GetStackPolicyOutput) => void): Request<CloudFormation.Types.GetStackPolicyOutput, AWSError>;
  /**
   * Returns the template body for a specified stack. You can get the template for running or deleted stacks. For deleted stacks, GetTemplate returns the template for up to 90 days after the stack has been deleted.  If the template doesn't exist, a ValidationError is returned. 
   */
  getTemplate(params: CloudFormation.Types.GetTemplateInput, callback?: (err: AWSError, data: CloudFormation.Types.GetTemplateOutput) => void): Request<CloudFormation.Types.GetTemplateOutput, AWSError>;
  /**
   * Returns the template body for a specified stack. You can get the template for running or deleted stacks. For deleted stacks, GetTemplate returns the template for up to 90 days after the stack has been deleted.  If the template doesn't exist, a ValidationError is returned. 
   */
  getTemplate(callback?: (err: AWSError, data: CloudFormation.Types.GetTemplateOutput) => void): Request<CloudFormation.Types.GetTemplateOutput, AWSError>;
  /**
   * Returns information about a new or existing template. The GetTemplateSummary action is useful for viewing parameter information, such as default parameter values and parameter types, before you create or update a stack or stack set. You can use the GetTemplateSummary action when you submit a template, or you can get template information for a stack set, or a running or deleted stack. For deleted stacks, GetTemplateSummary returns the template information for up to 90 days after the stack has been deleted. If the template doesn't exist, a ValidationError is returned.
   */
  getTemplateSummary(params: CloudFormation.Types.GetTemplateSummaryInput, callback?: (err: AWSError, data: CloudFormation.Types.GetTemplateSummaryOutput) => void): Request<CloudFormation.Types.GetTemplateSummaryOutput, AWSError>;
  /**
   * Returns information about a new or existing template. The GetTemplateSummary action is useful for viewing parameter information, such as default parameter values and parameter types, before you create or update a stack or stack set. You can use the GetTemplateSummary action when you submit a template, or you can get template information for a stack set, or a running or deleted stack. For deleted stacks, GetTemplateSummary returns the template information for up to 90 days after the stack has been deleted. If the template doesn't exist, a ValidationError is returned.
   */
  getTemplateSummary(callback?: (err: AWSError, data: CloudFormation.Types.GetTemplateSummaryOutput) => void): Request<CloudFormation.Types.GetTemplateSummaryOutput, AWSError>;
  /**
   * Import existing stacks into a new stack sets. Use the stack import operation to import up to 10 stacks into a new stack set in the same account as the source stack or in a different administrator account and Region, by specifying the stack ID of the stack you intend to import.
   */
  importStacksToStackSet(params: CloudFormation.Types.ImportStacksToStackSetInput, callback?: (err: AWSError, data: CloudFormation.Types.ImportStacksToStackSetOutput) => void): Request<CloudFormation.Types.ImportStacksToStackSetOutput, AWSError>;
  /**
   * Import existing stacks into a new stack sets. Use the stack import operation to import up to 10 stacks into a new stack set in the same account as the source stack or in a different administrator account and Region, by specifying the stack ID of the stack you intend to import.
   */
  importStacksToStackSet(callback?: (err: AWSError, data: CloudFormation.Types.ImportStacksToStackSetOutput) => void): Request<CloudFormation.Types.ImportStacksToStackSetOutput, AWSError>;
  /**
   * Returns the ID and status of each active change set for a stack. For example, CloudFormation lists change sets that are in the CREATE_IN_PROGRESS or CREATE_PENDING state.
   */
  listChangeSets(params: CloudFormation.Types.ListChangeSetsInput, callback?: (err: AWSError, data: CloudFormation.Types.ListChangeSetsOutput) => void): Request<CloudFormation.Types.ListChangeSetsOutput, AWSError>;
  /**
   * Returns the ID and status of each active change set for a stack. For example, CloudFormation lists change sets that are in the CREATE_IN_PROGRESS or CREATE_PENDING state.
   */
  listChangeSets(callback?: (err: AWSError, data: CloudFormation.Types.ListChangeSetsOutput) => void): Request<CloudFormation.Types.ListChangeSetsOutput, AWSError>;
  /**
   * Lists all exported output values in the account and Region in which you call this action. Use this action to see the exported output values that you can import into other stacks. To import values, use the  Fn::ImportValue function. For more information, see  CloudFormation export stack output values.
   */
  listExports(params: CloudFormation.Types.ListExportsInput, callback?: (err: AWSError, data: CloudFormation.Types.ListExportsOutput) => void): Request<CloudFormation.Types.ListExportsOutput, AWSError>;
  /**
   * Lists all exported output values in the account and Region in which you call this action. Use this action to see the exported output values that you can import into other stacks. To import values, use the  Fn::ImportValue function. For more information, see  CloudFormation export stack output values.
   */
  listExports(callback?: (err: AWSError, data: CloudFormation.Types.ListExportsOutput) => void): Request<CloudFormation.Types.ListExportsOutput, AWSError>;
  /**
   * Lists all stacks that are importing an exported output value. To modify or remove an exported output value, first use this action to see which stacks are using it. To see the exported output values in your account, see ListExports. For more information about importing an exported output value, see the Fn::ImportValue function.
   */
  listImports(params: CloudFormation.Types.ListImportsInput, callback?: (err: AWSError, data: CloudFormation.Types.ListImportsOutput) => void): Request<CloudFormation.Types.ListImportsOutput, AWSError>;
  /**
   * Lists all stacks that are importing an exported output value. To modify or remove an exported output value, first use this action to see which stacks are using it. To see the exported output values in your account, see ListExports. For more information about importing an exported output value, see the Fn::ImportValue function.
   */
  listImports(callback?: (err: AWSError, data: CloudFormation.Types.ListImportsOutput) => void): Request<CloudFormation.Types.ListImportsOutput, AWSError>;
  /**
   * Returns drift information for resources in a stack instance.   ListStackInstanceResourceDrifts returns drift information for the most recent drift detection operation. If an operation is in progress, it may only return partial results. 
   */
  listStackInstanceResourceDrifts(params: CloudFormation.Types.ListStackInstanceResourceDriftsInput, callback?: (err: AWSError, data: CloudFormation.Types.ListStackInstanceResourceDriftsOutput) => void): Request<CloudFormation.Types.ListStackInstanceResourceDriftsOutput, AWSError>;
  /**
   * Returns drift information for resources in a stack instance.   ListStackInstanceResourceDrifts returns drift information for the most recent drift detection operation. If an operation is in progress, it may only return partial results. 
   */
  listStackInstanceResourceDrifts(callback?: (err: AWSError, data: CloudFormation.Types.ListStackInstanceResourceDriftsOutput) => void): Request<CloudFormation.Types.ListStackInstanceResourceDriftsOutput, AWSError>;
  /**
   * Returns summary information about stack instances that are associated with the specified stack set. You can filter for stack instances that are associated with a specific Amazon Web Services account name or Region, or that have a specific status.
   */
  listStackInstances(params: CloudFormation.Types.ListStackInstancesInput, callback?: (err: AWSError, data: CloudFormation.Types.ListStackInstancesOutput) => void): Request<CloudFormation.Types.ListStackInstancesOutput, AWSError>;
  /**
   * Returns summary information about stack instances that are associated with the specified stack set. You can filter for stack instances that are associated with a specific Amazon Web Services account name or Region, or that have a specific status.
   */
  listStackInstances(callback?: (err: AWSError, data: CloudFormation.Types.ListStackInstancesOutput) => void): Request<CloudFormation.Types.ListStackInstancesOutput, AWSError>;
  /**
   * Returns descriptions of all resources of the specified stack. For deleted stacks, ListStackResources returns resource information for up to 90 days after the stack has been deleted.
   */
  listStackResources(params: CloudFormation.Types.ListStackResourcesInput, callback?: (err: AWSError, data: CloudFormation.Types.ListStackResourcesOutput) => void): Request<CloudFormation.Types.ListStackResourcesOutput, AWSError>;
  /**
   * Returns descriptions of all resources of the specified stack. For deleted stacks, ListStackResources returns resource information for up to 90 days after the stack has been deleted.
   */
  listStackResources(callback?: (err: AWSError, data: CloudFormation.Types.ListStackResourcesOutput) => void): Request<CloudFormation.Types.ListStackResourcesOutput, AWSError>;
  /**
   * Returns summary information about the results of a stack set operation.
   */
  listStackSetOperationResults(params: CloudFormation.Types.ListStackSetOperationResultsInput, callback?: (err: AWSError, data: CloudFormation.Types.ListStackSetOperationResultsOutput) => void): Request<CloudFormation.Types.ListStackSetOperationResultsOutput, AWSError>;
  /**
   * Returns summary information about the results of a stack set operation.
   */
  listStackSetOperationResults(callback?: (err: AWSError, data: CloudFormation.Types.ListStackSetOperationResultsOutput) => void): Request<CloudFormation.Types.ListStackSetOperationResultsOutput, AWSError>;
  /**
   * Returns summary information about operations performed on a stack set.
   */
  listStackSetOperations(params: CloudFormation.Types.ListStackSetOperationsInput, callback?: (err: AWSError, data: CloudFormation.Types.ListStackSetOperationsOutput) => void): Request<CloudFormation.Types.ListStackSetOperationsOutput, AWSError>;
  /**
   * Returns summary information about operations performed on a stack set.
   */
  listStackSetOperations(callback?: (err: AWSError, data: CloudFormation.Types.ListStackSetOperationsOutput) => void): Request<CloudFormation.Types.ListStackSetOperationsOutput, AWSError>;
  /**
   * Returns summary information about stack sets that are associated with the user.   [Self-managed permissions] If you set the CallAs parameter to SELF while signed in to your Amazon Web Services account, ListStackSets returns all self-managed stack sets in your Amazon Web Services account.   [Service-managed permissions] If you set the CallAs parameter to SELF while signed in to the organization's management account, ListStackSets returns all stack sets in the management account.   [Service-managed permissions] If you set the CallAs parameter to DELEGATED_ADMIN while signed in to your member account, ListStackSets returns all stack sets with service-managed permissions in the management account.  
   */
  listStackSets(params: CloudFormation.Types.ListStackSetsInput, callback?: (err: AWSError, data: CloudFormation.Types.ListStackSetsOutput) => void): Request<CloudFormation.Types.ListStackSetsOutput, AWSError>;
  /**
   * Returns summary information about stack sets that are associated with the user.   [Self-managed permissions] If you set the CallAs parameter to SELF while signed in to your Amazon Web Services account, ListStackSets returns all self-managed stack sets in your Amazon Web Services account.   [Service-managed permissions] If you set the CallAs parameter to SELF while signed in to the organization's management account, ListStackSets returns all stack sets in the management account.   [Service-managed permissions] If you set the CallAs parameter to DELEGATED_ADMIN while signed in to your member account, ListStackSets returns all stack sets with service-managed permissions in the management account.  
   */
  listStackSets(callback?: (err: AWSError, data: CloudFormation.Types.ListStackSetsOutput) => void): Request<CloudFormation.Types.ListStackSetsOutput, AWSError>;
  /**
   * Returns the summary information for stacks whose status matches the specified StackStatusFilter. Summary information for stacks that have been deleted is kept for 90 days after the stack is deleted. If no StackStatusFilter is specified, summary information for all stacks is returned (including existing stacks and stacks that have been deleted).
   */
  listStacks(params: CloudFormation.Types.ListStacksInput, callback?: (err: AWSError, data: CloudFormation.Types.ListStacksOutput) => void): Request<CloudFormation.Types.ListStacksOutput, AWSError>;
  /**
   * Returns the summary information for stacks whose status matches the specified StackStatusFilter. Summary information for stacks that have been deleted is kept for 90 days after the stack is deleted. If no StackStatusFilter is specified, summary information for all stacks is returned (including existing stacks and stacks that have been deleted).
   */
  listStacks(callback?: (err: AWSError, data: CloudFormation.Types.ListStacksOutput) => void): Request<CloudFormation.Types.ListStacksOutput, AWSError>;
  /**
   * Returns a list of registration tokens for the specified extension(s).
   */
  listTypeRegistrations(params: CloudFormation.Types.ListTypeRegistrationsInput, callback?: (err: AWSError, data: CloudFormation.Types.ListTypeRegistrationsOutput) => void): Request<CloudFormation.Types.ListTypeRegistrationsOutput, AWSError>;
  /**
   * Returns a list of registration tokens for the specified extension(s).
   */
  listTypeRegistrations(callback?: (err: AWSError, data: CloudFormation.Types.ListTypeRegistrationsOutput) => void): Request<CloudFormation.Types.ListTypeRegistrationsOutput, AWSError>;
  /**
   * Returns summary information about the versions of an extension.
   */
  listTypeVersions(params: CloudFormation.Types.ListTypeVersionsInput, callback?: (err: AWSError, data: CloudFormation.Types.ListTypeVersionsOutput) => void): Request<CloudFormation.Types.ListTypeVersionsOutput, AWSError>;
  /**
   * Returns summary information about the versions of an extension.
   */
  listTypeVersions(callback?: (err: AWSError, data: CloudFormation.Types.ListTypeVersionsOutput) => void): Request<CloudFormation.Types.ListTypeVersionsOutput, AWSError>;
  /**
   * Returns summary information about extension that have been registered with CloudFormation.
   */
  listTypes(params: CloudFormation.Types.ListTypesInput, callback?: (err: AWSError, data: CloudFormation.Types.ListTypesOutput) => void): Request<CloudFormation.Types.ListTypesOutput, AWSError>;
  /**
   * Returns summary information about extension that have been registered with CloudFormation.
   */
  listTypes(callback?: (err: AWSError, data: CloudFormation.Types.ListTypesOutput) => void): Request<CloudFormation.Types.ListTypesOutput, AWSError>;
  /**
   * Publishes the specified extension to the CloudFormation registry as a public extension in this Region. Public extensions are available for use by all CloudFormation users. For more information about publishing extensions, see Publishing extensions to make them available for public use in the CloudFormation CLI User Guide. To publish an extension, you must be registered as a publisher with CloudFormation. For more information, see RegisterPublisher.
   */
  publishType(params: CloudFormation.Types.PublishTypeInput, callback?: (err: AWSError, data: CloudFormation.Types.PublishTypeOutput) => void): Request<CloudFormation.Types.PublishTypeOutput, AWSError>;
  /**
   * Publishes the specified extension to the CloudFormation registry as a public extension in this Region. Public extensions are available for use by all CloudFormation users. For more information about publishing extensions, see Publishing extensions to make them available for public use in the CloudFormation CLI User Guide. To publish an extension, you must be registered as a publisher with CloudFormation. For more information, see RegisterPublisher.
   */
  publishType(callback?: (err: AWSError, data: CloudFormation.Types.PublishTypeOutput) => void): Request<CloudFormation.Types.PublishTypeOutput, AWSError>;
  /**
   * Reports progress of a resource handler to CloudFormation. Reserved for use by the CloudFormation CLI. Don't use this API in your code.
   */
  recordHandlerProgress(params: CloudFormation.Types.RecordHandlerProgressInput, callback?: (err: AWSError, data: CloudFormation.Types.RecordHandlerProgressOutput) => void): Request<CloudFormation.Types.RecordHandlerProgressOutput, AWSError>;
  /**
   * Reports progress of a resource handler to CloudFormation. Reserved for use by the CloudFormation CLI. Don't use this API in your code.
   */
  recordHandlerProgress(callback?: (err: AWSError, data: CloudFormation.Types.RecordHandlerProgressOutput) => void): Request<CloudFormation.Types.RecordHandlerProgressOutput, AWSError>;
  /**
   * Registers your account as a publisher of public extensions in the CloudFormation registry. Public extensions are available for use by all CloudFormation users. This publisher ID applies to your account in all Amazon Web Services Regions. For information about requirements for registering as a public extension publisher, see Registering your account to publish CloudFormation extensions in the CloudFormation CLI User Guide. 
   */
  registerPublisher(params: CloudFormation.Types.RegisterPublisherInput, callback?: (err: AWSError, data: CloudFormation.Types.RegisterPublisherOutput) => void): Request<CloudFormation.Types.RegisterPublisherOutput, AWSError>;
  /**
   * Registers your account as a publisher of public extensions in the CloudFormation registry. Public extensions are available for use by all CloudFormation users. This publisher ID applies to your account in all Amazon Web Services Regions. For information about requirements for registering as a public extension publisher, see Registering your account to publish CloudFormation extensions in the CloudFormation CLI User Guide. 
   */
  registerPublisher(callback?: (err: AWSError, data: CloudFormation.Types.RegisterPublisherOutput) => void): Request<CloudFormation.Types.RegisterPublisherOutput, AWSError>;
  /**
   * Registers an extension with the CloudFormation service. Registering an extension makes it available for use in CloudFormation templates in your Amazon Web Services account, and includes:   Validating the extension schema.   Determining which handlers, if any, have been specified for the extension.   Making the extension available for use in your account.   For more information about how to develop extensions and ready them for registration, see Creating Resource Providers in the CloudFormation CLI User Guide. You can have a maximum of 50 resource extension versions registered at a time. This maximum is per account and per Region. Use DeregisterType to deregister specific extension versions if necessary. Once you have initiated a registration request using RegisterType, you can use DescribeTypeRegistration to monitor the progress of the registration request. Once you have registered a private extension in your account and Region, use SetTypeConfiguration to specify configuration properties for the extension. For more information, see Configuring extensions at the account level in the CloudFormation User Guide.
   */
  registerType(params: CloudFormation.Types.RegisterTypeInput, callback?: (err: AWSError, data: CloudFormation.Types.RegisterTypeOutput) => void): Request<CloudFormation.Types.RegisterTypeOutput, AWSError>;
  /**
   * Registers an extension with the CloudFormation service. Registering an extension makes it available for use in CloudFormation templates in your Amazon Web Services account, and includes:   Validating the extension schema.   Determining which handlers, if any, have been specified for the extension.   Making the extension available for use in your account.   For more information about how to develop extensions and ready them for registration, see Creating Resource Providers in the CloudFormation CLI User Guide. You can have a maximum of 50 resource extension versions registered at a time. This maximum is per account and per Region. Use DeregisterType to deregister specific extension versions if necessary. Once you have initiated a registration request using RegisterType, you can use DescribeTypeRegistration to monitor the progress of the registration request. Once you have registered a private extension in your account and Region, use SetTypeConfiguration to specify configuration properties for the extension. For more information, see Configuring extensions at the account level in the CloudFormation User Guide.
   */
  registerType(callback?: (err: AWSError, data: CloudFormation.Types.RegisterTypeOutput) => void): Request<CloudFormation.Types.RegisterTypeOutput, AWSError>;
  /**
   * When specifying RollbackStack, you preserve the state of previously provisioned resources when an operation fails. You can check the status of the stack through the DescribeStacks operation. Rolls back the specified stack to the last known stable state from CREATE_FAILED or UPDATE_FAILED stack statuses. This operation will delete a stack if it doesn't contain a last known stable state. A last known stable state includes any status in a *_COMPLETE. This includes the following stack statuses.    CREATE_COMPLETE     UPDATE_COMPLETE     UPDATE_ROLLBACK_COMPLETE     IMPORT_COMPLETE     IMPORT_ROLLBACK_COMPLETE   
   */
  rollbackStack(params: CloudFormation.Types.RollbackStackInput, callback?: (err: AWSError, data: CloudFormation.Types.RollbackStackOutput) => void): Request<CloudFormation.Types.RollbackStackOutput, AWSError>;
  /**
   * When specifying RollbackStack, you preserve the state of previously provisioned resources when an operation fails. You can check the status of the stack through the DescribeStacks operation. Rolls back the specified stack to the last known stable state from CREATE_FAILED or UPDATE_FAILED stack statuses. This operation will delete a stack if it doesn't contain a last known stable state. A last known stable state includes any status in a *_COMPLETE. This includes the following stack statuses.    CREATE_COMPLETE     UPDATE_COMPLETE     UPDATE_ROLLBACK_COMPLETE     IMPORT_COMPLETE     IMPORT_ROLLBACK_COMPLETE   
   */
  rollbackStack(callback?: (err: AWSError, data: CloudFormation.Types.RollbackStackOutput) => void): Request<CloudFormation.Types.RollbackStackOutput, AWSError>;
  /**
   * Sets a stack policy for a specified stack.
   */
  setStackPolicy(params: CloudFormation.Types.SetStackPolicyInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets a stack policy for a specified stack.
   */
  setStackPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Specifies the configuration data for a registered CloudFormation extension, in the given account and Region. To view the current configuration data for an extension, refer to the ConfigurationSchema element of DescribeType. For more information, see Configuring extensions at the account level in the CloudFormation User Guide.  It's strongly recommended that you use dynamic references to restrict sensitive configuration definitions, such as third-party credentials. For more details on dynamic references, see Using dynamic references to specify template values in the CloudFormation User Guide. 
   */
  setTypeConfiguration(params: CloudFormation.Types.SetTypeConfigurationInput, callback?: (err: AWSError, data: CloudFormation.Types.SetTypeConfigurationOutput) => void): Request<CloudFormation.Types.SetTypeConfigurationOutput, AWSError>;
  /**
   * Specifies the configuration data for a registered CloudFormation extension, in the given account and Region. To view the current configuration data for an extension, refer to the ConfigurationSchema element of DescribeType. For more information, see Configuring extensions at the account level in the CloudFormation User Guide.  It's strongly recommended that you use dynamic references to restrict sensitive configuration definitions, such as third-party credentials. For more details on dynamic references, see Using dynamic references to specify template values in the CloudFormation User Guide. 
   */
  setTypeConfiguration(callback?: (err: AWSError, data: CloudFormation.Types.SetTypeConfigurationOutput) => void): Request<CloudFormation.Types.SetTypeConfigurationOutput, AWSError>;
  /**
   * Specify the default version of an extension. The default version of an extension will be used in CloudFormation operations.
   */
  setTypeDefaultVersion(params: CloudFormation.Types.SetTypeDefaultVersionInput, callback?: (err: AWSError, data: CloudFormation.Types.SetTypeDefaultVersionOutput) => void): Request<CloudFormation.Types.SetTypeDefaultVersionOutput, AWSError>;
  /**
   * Specify the default version of an extension. The default version of an extension will be used in CloudFormation operations.
   */
  setTypeDefaultVersion(callback?: (err: AWSError, data: CloudFormation.Types.SetTypeDefaultVersionOutput) => void): Request<CloudFormation.Types.SetTypeDefaultVersionOutput, AWSError>;
  /**
   * Sends a signal to the specified resource with a success or failure status. You can use the SignalResource operation in conjunction with a creation policy or update policy. CloudFormation doesn't proceed with a stack creation or update until resources receive the required number of signals or the timeout period is exceeded. The SignalResource operation is useful in cases where you want to send signals from anywhere other than an Amazon EC2 instance.
   */
  signalResource(params: CloudFormation.Types.SignalResourceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sends a signal to the specified resource with a success or failure status. You can use the SignalResource operation in conjunction with a creation policy or update policy. CloudFormation doesn't proceed with a stack creation or update until resources receive the required number of signals or the timeout period is exceeded. The SignalResource operation is useful in cases where you want to send signals from anywhere other than an Amazon EC2 instance.
   */
  signalResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops an in-progress operation on a stack set and its associated stack instances. StackSets will cancel all the unstarted stack instance deployments and wait for those are in-progress to complete.
   */
  stopStackSetOperation(params: CloudFormation.Types.StopStackSetOperationInput, callback?: (err: AWSError, data: CloudFormation.Types.StopStackSetOperationOutput) => void): Request<CloudFormation.Types.StopStackSetOperationOutput, AWSError>;
  /**
   * Stops an in-progress operation on a stack set and its associated stack instances. StackSets will cancel all the unstarted stack instance deployments and wait for those are in-progress to complete.
   */
  stopStackSetOperation(callback?: (err: AWSError, data: CloudFormation.Types.StopStackSetOperationOutput) => void): Request<CloudFormation.Types.StopStackSetOperationOutput, AWSError>;
  /**
   * Tests a registered extension to make sure it meets all necessary requirements for being published in the CloudFormation registry.   For resource types, this includes passing all contracts tests defined for the type.   For modules, this includes determining if the module's model meets all necessary requirements.   For more information, see Testing your public extension prior to publishing in the CloudFormation CLI User Guide. If you don't specify a version, CloudFormation uses the default version of the extension in your account and Region for testing. To perform testing, CloudFormation assumes the execution role specified when the type was registered. For more information, see RegisterType. Once you've initiated testing on an extension using TestType, you can pass the returned TypeVersionArn into DescribeType to monitor the current test status and test status description for the extension. An extension must have a test status of PASSED before it can be published. For more information, see Publishing extensions to make them available for public use in the CloudFormation CLI User Guide.
   */
  testType(params: CloudFormation.Types.TestTypeInput, callback?: (err: AWSError, data: CloudFormation.Types.TestTypeOutput) => void): Request<CloudFormation.Types.TestTypeOutput, AWSError>;
  /**
   * Tests a registered extension to make sure it meets all necessary requirements for being published in the CloudFormation registry.   For resource types, this includes passing all contracts tests defined for the type.   For modules, this includes determining if the module's model meets all necessary requirements.   For more information, see Testing your public extension prior to publishing in the CloudFormation CLI User Guide. If you don't specify a version, CloudFormation uses the default version of the extension in your account and Region for testing. To perform testing, CloudFormation assumes the execution role specified when the type was registered. For more information, see RegisterType. Once you've initiated testing on an extension using TestType, you can pass the returned TypeVersionArn into DescribeType to monitor the current test status and test status description for the extension. An extension must have a test status of PASSED before it can be published. For more information, see Publishing extensions to make them available for public use in the CloudFormation CLI User Guide.
   */
  testType(callback?: (err: AWSError, data: CloudFormation.Types.TestTypeOutput) => void): Request<CloudFormation.Types.TestTypeOutput, AWSError>;
  /**
   * Updates a stack as specified in the template. After the call completes successfully, the stack update starts. You can check the status of the stack through the DescribeStacks action. To get a copy of the template for an existing stack, you can use the GetTemplate action. For more information about creating an update template, updating a stack, and monitoring the progress of the update, see Updating a Stack.
   */
  updateStack(params: CloudFormation.Types.UpdateStackInput, callback?: (err: AWSError, data: CloudFormation.Types.UpdateStackOutput) => void): Request<CloudFormation.Types.UpdateStackOutput, AWSError>;
  /**
   * Updates a stack as specified in the template. After the call completes successfully, the stack update starts. You can check the status of the stack through the DescribeStacks action. To get a copy of the template for an existing stack, you can use the GetTemplate action. For more information about creating an update template, updating a stack, and monitoring the progress of the update, see Updating a Stack.
   */
  updateStack(callback?: (err: AWSError, data: CloudFormation.Types.UpdateStackOutput) => void): Request<CloudFormation.Types.UpdateStackOutput, AWSError>;
  /**
   * Updates the parameter values for stack instances for the specified accounts, within the specified Amazon Web Services Regions. A stack instance refers to a stack in a specific account and Region. You can only update stack instances in Amazon Web Services Regions and accounts where they already exist; to create additional stack instances, use CreateStackInstances. During stack set updates, any parameters overridden for a stack instance aren't updated, but retain their overridden value. You can only update the parameter values that are specified in the stack set; to add or delete a parameter itself, use UpdateStackSet to update the stack set template. If you add a parameter to a template, before you can override the parameter value specified in the stack set you must first use UpdateStackSet to update all stack instances with the updated template and parameter value specified in the stack set. Once a stack instance has been updated with the new parameter, you can then override the parameter value using UpdateStackInstances.
   */
  updateStackInstances(params: CloudFormation.Types.UpdateStackInstancesInput, callback?: (err: AWSError, data: CloudFormation.Types.UpdateStackInstancesOutput) => void): Request<CloudFormation.Types.UpdateStackInstancesOutput, AWSError>;
  /**
   * Updates the parameter values for stack instances for the specified accounts, within the specified Amazon Web Services Regions. A stack instance refers to a stack in a specific account and Region. You can only update stack instances in Amazon Web Services Regions and accounts where they already exist; to create additional stack instances, use CreateStackInstances. During stack set updates, any parameters overridden for a stack instance aren't updated, but retain their overridden value. You can only update the parameter values that are specified in the stack set; to add or delete a parameter itself, use UpdateStackSet to update the stack set template. If you add a parameter to a template, before you can override the parameter value specified in the stack set you must first use UpdateStackSet to update all stack instances with the updated template and parameter value specified in the stack set. Once a stack instance has been updated with the new parameter, you can then override the parameter value using UpdateStackInstances.
   */
  updateStackInstances(callback?: (err: AWSError, data: CloudFormation.Types.UpdateStackInstancesOutput) => void): Request<CloudFormation.Types.UpdateStackInstancesOutput, AWSError>;
  /**
   * Updates the stack set, and associated stack instances in the specified accounts and Amazon Web Services Regions. Even if the stack set operation created by updating the stack set fails (completely or partially, below or above a specified failure tolerance), the stack set is updated with your changes. Subsequent CreateStackInstances calls on the specified stack set use the updated stack set.
   */
  updateStackSet(params: CloudFormation.Types.UpdateStackSetInput, callback?: (err: AWSError, data: CloudFormation.Types.UpdateStackSetOutput) => void): Request<CloudFormation.Types.UpdateStackSetOutput, AWSError>;
  /**
   * Updates the stack set, and associated stack instances in the specified accounts and Amazon Web Services Regions. Even if the stack set operation created by updating the stack set fails (completely or partially, below or above a specified failure tolerance), the stack set is updated with your changes. Subsequent CreateStackInstances calls on the specified stack set use the updated stack set.
   */
  updateStackSet(callback?: (err: AWSError, data: CloudFormation.Types.UpdateStackSetOutput) => void): Request<CloudFormation.Types.UpdateStackSetOutput, AWSError>;
  /**
   * Updates termination protection for the specified stack. If a user attempts to delete a stack with termination protection enabled, the operation fails and the stack remains unchanged. For more information, see Protecting a Stack From Being Deleted in the CloudFormation User Guide. For nested stacks, termination protection is set on the root stack and can't be changed directly on the nested stack.
   */
  updateTerminationProtection(params: CloudFormation.Types.UpdateTerminationProtectionInput, callback?: (err: AWSError, data: CloudFormation.Types.UpdateTerminationProtectionOutput) => void): Request<CloudFormation.Types.UpdateTerminationProtectionOutput, AWSError>;
  /**
   * Updates termination protection for the specified stack. If a user attempts to delete a stack with termination protection enabled, the operation fails and the stack remains unchanged. For more information, see Protecting a Stack From Being Deleted in the CloudFormation User Guide. For nested stacks, termination protection is set on the root stack and can't be changed directly on the nested stack.
   */
  updateTerminationProtection(callback?: (err: AWSError, data: CloudFormation.Types.UpdateTerminationProtectionOutput) => void): Request<CloudFormation.Types.UpdateTerminationProtectionOutput, AWSError>;
  /**
   * Validates a specified template. CloudFormation first checks if the template is valid JSON. If it isn't, CloudFormation checks if the template is valid YAML. If both these checks fail, CloudFormation returns a template validation error.
   */
  validateTemplate(params: CloudFormation.Types.ValidateTemplateInput, callback?: (err: AWSError, data: CloudFormation.Types.ValidateTemplateOutput) => void): Request<CloudFormation.Types.ValidateTemplateOutput, AWSError>;
  /**
   * Validates a specified template. CloudFormation first checks if the template is valid JSON. If it isn't, CloudFormation checks if the template is valid YAML. If both these checks fail, CloudFormation returns a template validation error.
   */
  validateTemplate(callback?: (err: AWSError, data: CloudFormation.Types.ValidateTemplateOutput) => void): Request<CloudFormation.Types.ValidateTemplateOutput, AWSError>;
  /**
   * Waits for the stackExists state by periodically calling the underlying CloudFormation.describeStacksoperation every 5 seconds (at most 20 times).
   */
  waitFor(state: "stackExists", params: CloudFormation.Types.DescribeStacksInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackExists state by periodically calling the underlying CloudFormation.describeStacksoperation every 5 seconds (at most 20 times).
   */
  waitFor(state: "stackExists", callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackCreateComplete state by periodically calling the underlying CloudFormation.describeStacksoperation every 30 seconds (at most 120 times). Wait until stack status is CREATE_COMPLETE.
   */
  waitFor(state: "stackCreateComplete", params: CloudFormation.Types.DescribeStacksInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackCreateComplete state by periodically calling the underlying CloudFormation.describeStacksoperation every 30 seconds (at most 120 times). Wait until stack status is CREATE_COMPLETE.
   */
  waitFor(state: "stackCreateComplete", callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackDeleteComplete state by periodically calling the underlying CloudFormation.describeStacksoperation every 30 seconds (at most 120 times). Wait until stack status is DELETE_COMPLETE.
   */
  waitFor(state: "stackDeleteComplete", params: CloudFormation.Types.DescribeStacksInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackDeleteComplete state by periodically calling the underlying CloudFormation.describeStacksoperation every 30 seconds (at most 120 times). Wait until stack status is DELETE_COMPLETE.
   */
  waitFor(state: "stackDeleteComplete", callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackUpdateComplete state by periodically calling the underlying CloudFormation.describeStacksoperation every 30 seconds (at most 120 times). Wait until stack status is UPDATE_COMPLETE.
   */
  waitFor(state: "stackUpdateComplete", params: CloudFormation.Types.DescribeStacksInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackUpdateComplete state by periodically calling the underlying CloudFormation.describeStacksoperation every 30 seconds (at most 120 times). Wait until stack status is UPDATE_COMPLETE.
   */
  waitFor(state: "stackUpdateComplete", callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackImportComplete state by periodically calling the underlying CloudFormation.describeStacksoperation every 30 seconds (at most 120 times). Wait until stack status is IMPORT_COMPLETE.
   */
  waitFor(state: "stackImportComplete", params: CloudFormation.Types.DescribeStacksInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackImportComplete state by periodically calling the underlying CloudFormation.describeStacksoperation every 30 seconds (at most 120 times). Wait until stack status is IMPORT_COMPLETE.
   */
  waitFor(state: "stackImportComplete", callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackRollbackComplete state by periodically calling the underlying CloudFormation.describeStacksoperation every 30 seconds (at most 120 times). Wait until stack status is UPDATE_ROLLBACK_COMPLETE.
   */
  waitFor(state: "stackRollbackComplete", params: CloudFormation.Types.DescribeStacksInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the stackRollbackComplete state by periodically calling the underlying CloudFormation.describeStacksoperation every 30 seconds (at most 120 times). Wait until stack status is UPDATE_ROLLBACK_COMPLETE.
   */
  waitFor(state: "stackRollbackComplete", callback?: (err: AWSError, data: CloudFormation.Types.DescribeStacksOutput) => void): Request<CloudFormation.Types.DescribeStacksOutput, AWSError>;
  /**
   * Waits for the changeSetCreateComplete state by periodically calling the underlying CloudFormation.describeChangeSetoperation every 30 seconds (at most 120 times). Wait until change set status is CREATE_COMPLETE.
   */
  waitFor(state: "changeSetCreateComplete", params: CloudFormation.Types.DescribeChangeSetInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFormation.Types.DescribeChangeSetOutput) => void): Request<CloudFormation.Types.DescribeChangeSetOutput, AWSError>;
  /**
   * Waits for the changeSetCreateComplete state by periodically calling the underlying CloudFormation.describeChangeSetoperation every 30 seconds (at most 120 times). Wait until change set status is CREATE_COMPLETE.
   */
  waitFor(state: "changeSetCreateComplete", callback?: (err: AWSError, data: CloudFormation.Types.DescribeChangeSetOutput) => void): Request<CloudFormation.Types.DescribeChangeSetOutput, AWSError>;
  /**
   * Waits for the typeRegistrationComplete state by periodically calling the underlying CloudFormation.describeTypeRegistrationoperation every 30 seconds (at most 120 times). Wait until type registration is COMPLETE.
   */
  waitFor(state: "typeRegistrationComplete", params: CloudFormation.Types.DescribeTypeRegistrationInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: CloudFormation.Types.DescribeTypeRegistrationOutput) => void): Request<CloudFormation.Types.DescribeTypeRegistrationOutput, AWSError>;
  /**
   * Waits for the typeRegistrationComplete state by periodically calling the underlying CloudFormation.describeTypeRegistrationoperation every 30 seconds (at most 120 times). Wait until type registration is COMPLETE.
   */
  waitFor(state: "typeRegistrationComplete", callback?: (err: AWSError, data: CloudFormation.Types.DescribeTypeRegistrationOutput) => void): Request<CloudFormation.Types.DescribeTypeRegistrationOutput, AWSError>;
}
declare namespace CloudFormation {
  export type AcceptTermsAndConditions = boolean;
  export type Account = string;
  export type AccountFilterType = "NONE"|"INTERSECTION"|"DIFFERENCE"|"UNION"|string;
  export interface AccountGateResult {
    /**
     * The status of the account gate function.    SUCCEEDED: The account gate function has determined that the account and Region passes any requirements for a stack set operation to occur. CloudFormation proceeds with the stack operation in that account and Region.    FAILED: The account gate function has determined that the account and Region doesn't meet the requirements for a stack set operation to occur. CloudFormation cancels the stack set operation in that account and Region, and sets the stack set operation result status for that account and Region to FAILED.    SKIPPED: CloudFormation has skipped calling the account gate function for this account and Region, for one of the following reasons:   An account gate function hasn't been specified for the account and Region. CloudFormation proceeds with the stack set operation in this account and Region.   The AWSCloudFormationStackSetExecutionRole of the stack set administration account lacks permissions to invoke the function. CloudFormation proceeds with the stack set operation in this account and Region.   Either no action is necessary, or no action is possible, on the stack. CloudFormation skips the stack set operation in this account and Region.    
     */
    Status?: AccountGateStatus;
    /**
     * The reason for the account gate status assigned to this account and Region for the stack set operation.
     */
    StatusReason?: AccountGateStatusReason;
  }
  export type AccountGateStatus = "SUCCEEDED"|"FAILED"|"SKIPPED"|string;
  export type AccountGateStatusReason = string;
  export interface AccountLimit {
    /**
     * The name of the account limit. Values: ConcurrentResourcesLimit | StackLimit | StackOutputsLimit 
     */
    Name?: LimitName;
    /**
     * The value that's associated with the account limit name.
     */
    Value?: LimitValue;
  }
  export type AccountLimitList = AccountLimit[];
  export type AccountList = Account[];
  export type AccountsUrl = string;
  export interface ActivateOrganizationsAccessInput {
  }
  export interface ActivateOrganizationsAccessOutput {
  }
  export interface ActivateTypeInput {
    /**
     * The extension type. Conditional: You must specify PublicTypeArn, or TypeName, Type, and PublisherId.
     */
    Type?: ThirdPartyType;
    /**
     * The Amazon Resource Name (ARN) of the public extension. Conditional: You must specify PublicTypeArn, or TypeName, Type, and PublisherId.
     */
    PublicTypeArn?: ThirdPartyTypeArn;
    /**
     * The ID of the extension publisher. Conditional: You must specify PublicTypeArn, or TypeName, Type, and PublisherId.
     */
    PublisherId?: PublisherId;
    /**
     * The name of the extension. Conditional: You must specify PublicTypeArn, or TypeName, Type, and PublisherId.
     */
    TypeName?: TypeName;
    /**
     * An alias to assign to the public extension, in this account and Region. If you specify an alias for the extension, CloudFormation treats the alias as the extension type name within this account and Region. You must use the alias to refer to the extension in your templates, API calls, and CloudFormation console. An extension alias must be unique within a given account and Region. You can activate the same public resource multiple times in the same account and Region, using different type name aliases.
     */
    TypeNameAlias?: TypeName;
    /**
     * Whether to automatically update the extension in this account and Region when a new minor version is published by the extension publisher. Major versions released by the publisher must be manually updated. The default is true.
     */
    AutoUpdate?: AutoUpdate;
    /**
     * Contains logging configuration information for an extension.
     */
    LoggingConfig?: LoggingConfig;
    /**
     * The name of the IAM execution role to use to activate the extension.
     */
    ExecutionRoleArn?: RoleArn;
    /**
     * Manually updates a previously-activated type to a new major or minor version, if available. You can also use this parameter to update the value of AutoUpdate.    MAJOR: CloudFormation updates the extension to the newest major version, if one is available.    MINOR: CloudFormation updates the extension to the newest minor version, if one is available.  
     */
    VersionBump?: VersionBump;
    /**
     * The major version of this extension you want to activate, if multiple major versions are available. The default is the latest major version. CloudFormation uses the latest available minor version of the major version selected. You can specify MajorVersion or VersionBump, but not both.
     */
    MajorVersion?: MajorVersion;
  }
  export interface ActivateTypeOutput {
    /**
     * The Amazon Resource Name (ARN) of the activated extension, in this account and Region.
     */
    Arn?: PrivateTypeArn;
  }
  export type AllowedValue = string;
  export type AllowedValues = AllowedValue[];
  export type Arn = string;
  export interface AutoDeployment {
    /**
     * If set to true, StackSets automatically deploys additional stack instances to Organizations accounts that are added to a target organization or organizational unit (OU) in the specified Regions. If an account is removed from a target organization or OU, StackSets deletes stack instances from the account in the specified Regions.
     */
    Enabled?: AutoDeploymentNullable;
    /**
     * If set to true, stack resources are retained when an account is removed from a target organization or OU. If set to false, stack resources are deleted. Specify only if Enabled is set to True.
     */
    RetainStacksOnAccountRemoval?: RetainStacksOnAccountRemovalNullable;
  }
  export type AutoDeploymentNullable = boolean;
  export type AutoUpdate = boolean;
  export interface BatchDescribeTypeConfigurationsError {
    /**
     * The error code.
     */
    ErrorCode?: ErrorCode;
    /**
     * The error message.
     */
    ErrorMessage?: ErrorMessage;
    /**
     * Identifying information for the configuration of a CloudFormation extension.
     */
    TypeConfigurationIdentifier?: TypeConfigurationIdentifier;
  }
  export type BatchDescribeTypeConfigurationsErrors = BatchDescribeTypeConfigurationsError[];
  export interface BatchDescribeTypeConfigurationsInput {
    /**
     * The list of identifiers for the desired extension configurations.
     */
    TypeConfigurationIdentifiers: TypeConfigurationIdentifiers;
  }
  export interface BatchDescribeTypeConfigurationsOutput {
    /**
     * A list of information concerning any errors generated during the setting of the specified configurations.
     */
    Errors?: BatchDescribeTypeConfigurationsErrors;
    /**
     * A list of any of the specified extension configurations that CloudFormation could not process for any reason.
     */
    UnprocessedTypeConfigurations?: UnprocessedTypeConfigurations;
    /**
     * A list of any of the specified extension configurations from the CloudFormation registry.
     */
    TypeConfigurations?: TypeConfigurationDetailsList;
  }
  export type BoxedInteger = number;
  export type BoxedMaxResults = number;
  export type CallAs = "SELF"|"DELEGATED_ADMIN"|string;
  export interface CancelUpdateStackInput {
    /**
     *  If you don't pass a parameter to StackName, the API returns a response that describes all resources in the account. The IAM policy below can be added to IAM policies when you want to limit resource-level permissions and avoid returning a response when no parameter is sent in the request:  { "Version": "2012-10-17", "Statement": [{ "Effect": "Deny", "Action": "cloudformation:DescribeStacks", "NotResource": "arn:aws:cloudformation:*:*:stack/**" }] }   The name or the unique stack ID that's associated with the stack.
     */
    StackName: StackName;
    /**
     * A unique identifier for this CancelUpdateStack request. Specify this token if you plan to retry requests so that CloudFormation knows that you're not attempting to cancel an update on a stack with the same name. You might retry CancelUpdateStack requests to ensure that CloudFormation successfully received them.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export type Capabilities = Capability[];
  export type CapabilitiesReason = string;
  export type Capability = "CAPABILITY_IAM"|"CAPABILITY_NAMED_IAM"|"CAPABILITY_AUTO_EXPAND"|string;
  export type Category = "REGISTERED"|"ACTIVATED"|"THIRD_PARTY"|"AWS_TYPES"|string;
  export type CausingEntity = string;
  export interface Change {
    /**
     * The type of entity that CloudFormation changes. Currently, the only entity type is Resource.
     */
    Type?: ChangeType;
    /**
     * Is either null, if no hooks invoke for the resource, or contains the number of hooks that will invoke for the resource.
     */
    HookInvocationCount?: HookInvocationCount;
    /**
     * A ResourceChange structure that describes the resource and action that CloudFormation will perform.
     */
    ResourceChange?: ResourceChange;
  }
  export type ChangeAction = "Add"|"Modify"|"Remove"|"Import"|"Dynamic"|string;
  export interface ChangeSetHook {
    /**
     * Specifies the points in provisioning logic where a hook is invoked.
     */
    InvocationPoint?: HookInvocationPoint;
    /**
     * Specify the hook failure mode for non-compliant resources in the followings ways.    FAIL Stops provisioning resources.    WARN Allows provisioning to continue with a warning message.  
     */
    FailureMode?: HookFailureMode;
    /**
     * The unique name for your hook. Specifies a three-part namespace for your hook, with a recommended pattern of Organization::Service::Hook.  The following organization namespaces are reserved and can't be used in your hook type names:    Alexa     AMZN     Amazon     ASK     AWS     Custom     Dev    
     */
    TypeName?: HookTypeName;
    /**
     * The version ID of the type specified.
     */
    TypeVersionId?: HookTypeVersionId;
    /**
     * The version ID of the type configuration.
     */
    TypeConfigurationVersionId?: HookTypeConfigurationVersionId;
    /**
     * Specifies details about the target that the hook will run against.
     */
    TargetDetails?: ChangeSetHookTargetDetails;
  }
  export interface ChangeSetHookResourceTargetDetails {
    /**
     * The resource's logical ID, which is defined in the stack's template.
     */
    LogicalResourceId?: LogicalResourceId;
    /**
     * The type of CloudFormation resource, such as AWS::S3::Bucket.
     */
    ResourceType?: HookTargetTypeName;
    /**
     * Specifies the action of the resource.
     */
    ResourceAction?: ChangeAction;
  }
  export interface ChangeSetHookTargetDetails {
    /**
     * The name of the type.
     */
    TargetType?: HookTargetType;
    /**
     * Required if TargetType is RESOURCE.
     */
    ResourceTargetDetails?: ChangeSetHookResourceTargetDetails;
  }
  export type ChangeSetHooks = ChangeSetHook[];
  export type ChangeSetHooksStatus = "PLANNING"|"PLANNED"|"UNAVAILABLE"|string;
  export type ChangeSetId = string;
  export type ChangeSetName = string;
  export type ChangeSetNameOrId = string;
  export type ChangeSetStatus = "CREATE_PENDING"|"CREATE_IN_PROGRESS"|"CREATE_COMPLETE"|"DELETE_PENDING"|"DELETE_IN_PROGRESS"|"DELETE_COMPLETE"|"DELETE_FAILED"|"FAILED"|string;
  export type ChangeSetStatusReason = string;
  export type ChangeSetSummaries = ChangeSetSummary[];
  export interface ChangeSetSummary {
    /**
     * The ID of the stack with which the change set is associated.
     */
    StackId?: StackId;
    /**
     * The name of the stack with which the change set is associated.
     */
    StackName?: StackName;
    /**
     * The ID of the change set.
     */
    ChangeSetId?: ChangeSetId;
    /**
     * The name of the change set.
     */
    ChangeSetName?: ChangeSetName;
    /**
     * If the change set execution status is AVAILABLE, you can execute the change set. If you can't execute the change set, the status indicates why. For example, a change set might be in an UNAVAILABLE state because CloudFormation is still creating it or in an OBSOLETE state because the stack was already updated.
     */
    ExecutionStatus?: ExecutionStatus;
    /**
     * The state of the change set, such as CREATE_IN_PROGRESS, CREATE_COMPLETE, or FAILED.
     */
    Status?: ChangeSetStatus;
    /**
     * A description of the change set's status. For example, if your change set is in the FAILED state, CloudFormation shows the error message.
     */
    StatusReason?: ChangeSetStatusReason;
    /**
     * The start time when the change set was created, in UTC.
     */
    CreationTime?: CreationTime;
    /**
     * Descriptive information about the change set.
     */
    Description?: Description;
    /**
     * Specifies the current setting of IncludeNestedStacks for the change set.
     */
    IncludeNestedStacks?: IncludeNestedStacks;
    /**
     * The parent change set ID.
     */
    ParentChangeSetId?: ChangeSetId;
    /**
     * The root change set ID.
     */
    RootChangeSetId?: ChangeSetId;
  }
  export type ChangeSetType = "CREATE"|"UPDATE"|"IMPORT"|string;
  export type ChangeSource = "ResourceReference"|"ParameterReference"|"ResourceAttribute"|"DirectModification"|"Automatic"|string;
  export type ChangeType = "Resource"|string;
  export type Changes = Change[];
  export type ClientRequestToken = string;
  export type ClientToken = string;
  export type ConfigurationSchema = string;
  export type ConnectionArn = string;
  export interface ContinueUpdateRollbackInput {
    /**
     * The name or the unique ID of the stack that you want to continue rolling back.  Don't specify the name of a nested stack (a stack that was created by using the AWS::CloudFormation::Stack resource). Instead, use this operation on the parent stack (the stack that contains the AWS::CloudFormation::Stack resource). 
     */
    StackName: StackNameOrId;
    /**
     * The Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that CloudFormation assumes to roll back the stack. CloudFormation uses the role's credentials to make calls on your behalf. CloudFormation always uses this role for all future operations on the stack. Provided that users have permission to operate on the stack, CloudFormation uses this role even if the users don't have permission to pass it. Ensure that the role grants least permission. If you don't specify a value, CloudFormation uses the role that was previously associated with the stack. If no role is available, CloudFormation uses a temporary session that's generated from your user credentials.
     */
    RoleARN?: RoleARN;
    /**
     * A list of the logical IDs of the resources that CloudFormation skips during the continue update rollback operation. You can specify only resources that are in the UPDATE_FAILED state because a rollback failed. You can't specify resources that are in the UPDATE_FAILED state for other reasons, for example, because an update was canceled. To check why a resource update failed, use the DescribeStackResources action, and view the resource status reason.  Specify this property to skip rolling back resources that CloudFormation can't successfully roll back. We recommend that you  troubleshoot resources before skipping them. CloudFormation sets the status of the specified resources to UPDATE_COMPLETE and continues to roll back the stack. After the rollback is complete, the state of the skipped resources will be inconsistent with the state of the resources in the stack template. Before performing another stack update, you must update the stack or resources to be consistent with each other. If you don't, subsequent stack updates might fail, and the stack will become unrecoverable.  Specify the minimum number of resources required to successfully roll back your stack. For example, a failed resource update might cause dependent resources to fail. In this case, it might not be necessary to skip the dependent resources. To skip resources that are part of nested stacks, use the following format: NestedStackName.ResourceLogicalID. If you want to specify the logical ID of a stack resource (Type: AWS::CloudFormation::Stack) in the ResourcesToSkip list, then its corresponding embedded stack must be in one of the following states: DELETE_IN_PROGRESS, DELETE_COMPLETE, or DELETE_FAILED.  Don't confuse a child stack's name with its corresponding logical ID defined in the parent stack. For an example of a continue update rollback operation with nested stacks, see Using ResourcesToSkip to recover a nested stacks hierarchy. 
     */
    ResourcesToSkip?: ResourcesToSkip;
    /**
     * A unique identifier for this ContinueUpdateRollback request. Specify this token if you plan to retry requests so that CloudFormation knows that you're not attempting to continue the rollback to a stack with the same name. You might retry ContinueUpdateRollback requests to ensure that CloudFormation successfully received them.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface ContinueUpdateRollbackOutput {
  }
  export interface CreateChangeSetInput {
    /**
     * The name or the unique ID of the stack for which you are creating a change set. CloudFormation generates the change set by comparing this stack's information with the information that you submit, such as a modified template or different parameter input values.
     */
    StackName: StackNameOrId;
    /**
     * A structure that contains the body of the revised template, with a minimum length of 1 byte and a maximum length of 51,200 bytes. CloudFormation generates the change set by comparing this template with the template of the stack that you specified. Conditional: You must specify only TemplateBody or TemplateURL.
     */
    TemplateBody?: TemplateBody;
    /**
     * The location of the file that contains the revised template. The URL must point to a template (max size: 460,800 bytes) that's located in an Amazon S3 bucket or a Systems Manager document. CloudFormation generates the change set by comparing this template with the stack that you specified. Conditional: You must specify only TemplateBody or TemplateURL.
     */
    TemplateURL?: TemplateURL;
    /**
     * Whether to reuse the template that's associated with the stack to create the change set.
     */
    UsePreviousTemplate?: UsePreviousTemplate;
    /**
     * A list of Parameter structures that specify input parameters for the change set. For more information, see the Parameter data type.
     */
    Parameters?: Parameters;
    /**
     * In some cases, you must explicitly acknowledge that your stack template contains certain capabilities in order for CloudFormation to create the stack.    CAPABILITY_IAM and CAPABILITY_NAMED_IAM  Some stack templates might include resources that can affect permissions in your Amazon Web Services account; for example, by creating new Identity and Access Management (IAM) users. For those stacks, you must explicitly acknowledge this by specifying one of these capabilities. The following IAM resources require you to specify either the CAPABILITY_IAM or CAPABILITY_NAMED_IAM capability.   If you have IAM resources, you can specify either capability.   If you have IAM resources with custom names, you must specify CAPABILITY_NAMED_IAM.   If you don't specify either of these capabilities, CloudFormation returns an InsufficientCapabilities error.   If your stack template contains these resources, we suggest that you review all permissions associated with them and edit their permissions if necessary.     AWS::IAM::AccessKey      AWS::IAM::Group     AWS::IAM::InstanceProfile      AWS::IAM::Policy      AWS::IAM::Role      AWS::IAM::User     AWS::IAM::UserToGroupAddition    For more information, see Acknowledging IAM resources in CloudFormation templates.    CAPABILITY_AUTO_EXPAND  Some template contain macros. Macros perform custom processing on templates; this can include simple actions like find-and-replace operations, all the way to extensive transformations of entire templates. Because of this, users typically create a change set from the processed template, so that they can review the changes resulting from the macros before actually creating the stack. If your stack template contains one or more macros, and you choose to create a stack directly from the processed template, without first reviewing the resulting changes in a change set, you must acknowledge this capability. This includes the AWS::Include and AWS::Serverless transforms, which are macros hosted by CloudFormation.  This capacity doesn't apply to creating change sets, and specifying it when creating change sets has no effect. If you want to create a stack from a stack template that contains macros and nested stacks, you must create or update the stack directly from the template using the CreateStack or UpdateStack action, and specifying this capability.  For more information about macros, see Using CloudFormation macros to perform custom processing on templates.  
     */
    Capabilities?: Capabilities;
    /**
     * The template resource types that you have permissions to work with if you execute this change set, such as AWS::EC2::Instance, AWS::EC2::*, or Custom::MyCustomInstance. If the list of resource types doesn't include a resource type that you're updating, the stack update fails. By default, CloudFormation grants permissions to all resource types. Identity and Access Management (IAM) uses this parameter for condition keys in IAM policies for CloudFormation. For more information, see Controlling access with Identity and Access Management in the CloudFormation User Guide.
     */
    ResourceTypes?: ResourceTypes;
    /**
     * The Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that CloudFormation assumes when executing the change set. CloudFormation uses the role's credentials to make calls on your behalf. CloudFormation uses this role for all future operations on the stack. Provided that users have permission to operate on the stack, CloudFormation uses this role even if the users don't have permission to pass it. Ensure that the role grants least permission. If you don't specify a value, CloudFormation uses the role that was previously associated with the stack. If no role is available, CloudFormation uses a temporary session that is generated from your user credentials.
     */
    RoleARN?: RoleARN;
    /**
     * The rollback triggers for CloudFormation to monitor during stack creation and updating operations, and for the specified monitoring period afterwards.
     */
    RollbackConfiguration?: RollbackConfiguration;
    /**
     * The Amazon Resource Names (ARNs) of Amazon Simple Notification Service (Amazon SNS) topics that CloudFormation associates with the stack. To remove all associated notification topics, specify an empty list.
     */
    NotificationARNs?: NotificationARNs;
    /**
     * Key-value pairs to associate with this stack. CloudFormation also propagates these tags to resources in the stack. You can specify a maximum of 50 tags.
     */
    Tags?: Tags;
    /**
     * The name of the change set. The name must be unique among all change sets that are associated with the specified stack. A change set name can contain only alphanumeric, case sensitive characters, and hyphens. It must start with an alphabetical character and can't exceed 128 characters.
     */
    ChangeSetName: ChangeSetName;
    /**
     * A unique identifier for this CreateChangeSet request. Specify this token if you plan to retry requests so that CloudFormation knows that you're not attempting to create another change set with the same name. You might retry CreateChangeSet requests to ensure that CloudFormation successfully received them.
     */
    ClientToken?: ClientToken;
    /**
     * A description to help you identify this change set.
     */
    Description?: Description;
    /**
     * The type of change set operation. To create a change set for a new stack, specify CREATE. To create a change set for an existing stack, specify UPDATE. To create a change set for an import operation, specify IMPORT. If you create a change set for a new stack, CloudFormation creates a stack with a unique stack ID, but no template or resources. The stack will be in the REVIEW_IN_PROGRESS state until you execute the change set. By default, CloudFormation specifies UPDATE. You can't use the UPDATE type to create a change set for a new stack or the CREATE type to create a change set for an existing stack.
     */
    ChangeSetType?: ChangeSetType;
    /**
     * The resources to import into your stack.
     */
    ResourcesToImport?: ResourcesToImport;
    /**
     * Creates a change set for the all nested stacks specified in the template. The default behavior of this action is set to False. To include nested sets in a change set, specify True.
     */
    IncludeNestedStacks?: IncludeNestedStacks;
    /**
     * Determines what action will be taken if stack creation fails. If this parameter is specified, the DisableRollback parameter to the ExecuteChangeSet API operation must not be specified. This must be one of these values:    DELETE - Deletes the change set if the stack creation fails. This is only valid when the ChangeSetType parameter is set to CREATE. If the deletion of the stack fails, the status of the stack is DELETE_FAILED.    DO_NOTHING - if the stack creation fails, do nothing. This is equivalent to specifying true for the DisableRollback parameter to the ExecuteChangeSet API operation.    ROLLBACK - if the stack creation fails, roll back the stack. This is equivalent to specifying false for the DisableRollback parameter to the ExecuteChangeSet API operation.   For nested stacks, when the OnStackFailure parameter is set to DELETE for the change set for the parent stack, any failure in a child stack will cause the parent stack creation to fail and all stacks to be deleted.
     */
    OnStackFailure?: OnStackFailure;
  }
  export interface CreateChangeSetOutput {
    /**
     * The Amazon Resource Name (ARN) of the change set.
     */
    Id?: ChangeSetId;
    /**
     * The unique ID of the stack.
     */
    StackId?: StackId;
  }
  export interface CreateStackInput {
    /**
     * The name that's associated with the stack. The name must be unique in the Region in which you are creating the stack.  A stack name can contain only alphanumeric characters (case sensitive) and hyphens. It must start with an alphabetical character and can't be longer than 128 characters. 
     */
    StackName: StackName;
    /**
     * Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes. For more information, go to Template anatomy in the CloudFormation User Guide. Conditional: You must specify either the TemplateBody or the TemplateURL parameter, but not both.
     */
    TemplateBody?: TemplateBody;
    /**
     * Location of file containing the template body. The URL must point to a template (max size: 460,800 bytes) that's located in an Amazon S3 bucket or a Systems Manager document. For more information, go to the Template anatomy in the CloudFormation User Guide. Conditional: You must specify either the TemplateBody or the TemplateURL parameter, but not both.
     */
    TemplateURL?: TemplateURL;
    /**
     * A list of Parameter structures that specify input parameters for the stack. For more information, see the Parameter data type.
     */
    Parameters?: Parameters;
    /**
     * Set to true to disable rollback of the stack if stack creation failed. You can specify either DisableRollback or OnFailure, but not both. Default: false 
     */
    DisableRollback?: DisableRollback;
    /**
     * The rollback triggers for CloudFormation to monitor during stack creation and updating operations, and for the specified monitoring period afterwards.
     */
    RollbackConfiguration?: RollbackConfiguration;
    /**
     * The amount of time that can pass before the stack status becomes CREATE_FAILED; if DisableRollback is not set or is set to false, the stack will be rolled back.
     */
    TimeoutInMinutes?: TimeoutMinutes;
    /**
     * The Amazon Simple Notification Service (Amazon SNS) topic ARNs to publish stack related events. You can find your Amazon SNS topic ARNs using the Amazon SNS console or your Command Line Interface (CLI).
     */
    NotificationARNs?: NotificationARNs;
    /**
     * In some cases, you must explicitly acknowledge that your stack template contains certain capabilities in order for CloudFormation to create the stack.    CAPABILITY_IAM and CAPABILITY_NAMED_IAM  Some stack templates might include resources that can affect permissions in your Amazon Web Services account; for example, by creating new Identity and Access Management (IAM) users. For those stacks, you must explicitly acknowledge this by specifying one of these capabilities. The following IAM resources require you to specify either the CAPABILITY_IAM or CAPABILITY_NAMED_IAM capability.   If you have IAM resources, you can specify either capability.   If you have IAM resources with custom names, you must specify CAPABILITY_NAMED_IAM.   If you don't specify either of these capabilities, CloudFormation returns an InsufficientCapabilities error.   If your stack template contains these resources, we recommend that you review all permissions associated with them and edit their permissions if necessary.     AWS::IAM::AccessKey      AWS::IAM::Group     AWS::IAM::InstanceProfile      AWS::IAM::Policy      AWS::IAM::Role      AWS::IAM::User     AWS::IAM::UserToGroupAddition    For more information, see Acknowledging IAM Resources in CloudFormation Templates.    CAPABILITY_AUTO_EXPAND  Some template contain macros. Macros perform custom processing on templates; this can include simple actions like find-and-replace operations, all the way to extensive transformations of entire templates. Because of this, users typically create a change set from the processed template, so that they can review the changes resulting from the macros before actually creating the stack. If your stack template contains one or more macros, and you choose to create a stack directly from the processed template, without first reviewing the resulting changes in a change set, you must acknowledge this capability. This includes the AWS::Include and AWS::Serverless transforms, which are macros hosted by CloudFormation. If you want to create a stack from a stack template that contains macros and nested stacks, you must create the stack directly from the template using this capability.  You should only create stacks directly from a stack template that contains macros if you know what processing the macro performs. Each macro relies on an underlying Lambda service function for processing stack templates. Be aware that the Lambda function owner can update the function operation without CloudFormation being notified.  For more information, see Using CloudFormation macros to perform custom processing on templates.  
     */
    Capabilities?: Capabilities;
    /**
     * The template resource types that you have permissions to work with for this create stack action, such as AWS::EC2::Instance, AWS::EC2::*, or Custom::MyCustomInstance. Use the following syntax to describe template resource types: AWS::* (for all Amazon Web Services resources), Custom::* (for all custom resources), Custom::logical_ID  (for a specific custom resource), AWS::service_name::* (for all resources of a particular Amazon Web Services service), and AWS::service_name::resource_logical_ID  (for a specific Amazon Web Services resource). If the list of resource types doesn't include a resource that you're creating, the stack creation fails. By default, CloudFormation grants permissions to all resource types. Identity and Access Management (IAM) uses this parameter for CloudFormation-specific condition keys in IAM policies. For more information, see Controlling Access with Identity and Access Management.
     */
    ResourceTypes?: ResourceTypes;
    /**
     * The Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that CloudFormation assumes to create the stack. CloudFormation uses the role's credentials to make calls on your behalf. CloudFormation always uses this role for all future operations on the stack. Provided that users have permission to operate on the stack, CloudFormation uses this role even if the users don't have permission to pass it. Ensure that the role grants least privilege. If you don't specify a value, CloudFormation uses the role that was previously associated with the stack. If no role is available, CloudFormation uses a temporary session that's generated from your user credentials.
     */
    RoleARN?: RoleARN;
    /**
     * Determines what action will be taken if stack creation fails. This must be one of: DO_NOTHING, ROLLBACK, or DELETE. You can specify either OnFailure or DisableRollback, but not both. Default: ROLLBACK 
     */
    OnFailure?: OnFailure;
    /**
     * Structure containing the stack policy body. For more information, go to  Prevent Updates to Stack Resources in the CloudFormation User Guide. You can specify either the StackPolicyBody or the StackPolicyURL parameter, but not both.
     */
    StackPolicyBody?: StackPolicyBody;
    /**
     * Location of a file containing the stack policy. The URL must point to a policy (maximum size: 16 KB) located in an S3 bucket in the same Region as the stack. You can specify either the StackPolicyBody or the StackPolicyURL parameter, but not both.
     */
    StackPolicyURL?: StackPolicyURL;
    /**
     * Key-value pairs to associate with this stack. CloudFormation also propagates these tags to the resources created in the stack. A maximum number of 50 tags can be specified.
     */
    Tags?: Tags;
    /**
     * A unique identifier for this CreateStack request. Specify this token if you plan to retry requests so that CloudFormation knows that you're not attempting to create a stack with the same name. You might retry CreateStack requests to ensure that CloudFormation successfully received them. All events initiated by a given stack operation are assigned the same client request token, which you can use to track operations. For example, if you execute a CreateStack operation with the token token1, then all the StackEvents generated by that operation will have ClientRequestToken set as token1. In the console, stack operations display the client request token on the Events tab. Stack operations that are initiated from the console use the token format Console-StackOperation-ID, which helps you easily identify the stack operation . For example, if you create a stack using the console, each stack event would be assigned the same token in the following format: Console-CreateStack-7f59c3cf-00d2-40c7-b2ff-e75db0987002.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * Whether to enable termination protection on the specified stack. If a user attempts to delete a stack with termination protection enabled, the operation fails and the stack remains unchanged. For more information, see Protecting a Stack From Being Deleted in the CloudFormation User Guide. Termination protection is deactivated on stacks by default. For nested stacks, termination protection is set on the root stack and can't be changed directly on the nested stack.
     */
    EnableTerminationProtection?: EnableTerminationProtection;
    /**
     * When set to true, newly created resources are deleted when the operation rolls back. This includes newly created resources marked with a deletion policy of Retain. Default: false 
     */
    RetainExceptOnCreate?: RetainExceptOnCreate;
  }
  export interface CreateStackInstancesInput {
    /**
     * The name or unique ID of the stack set that you want to create stack instances from.
     */
    StackSetName: StackSetName;
    /**
     * [Self-managed permissions] The names of one or more Amazon Web Services accounts that you want to create stack instances in the specified Region(s) for. You can specify Accounts or DeploymentTargets, but not both.
     */
    Accounts?: AccountList;
    /**
     * [Service-managed permissions] The Organizations accounts for which to create stack instances in the specified Amazon Web Services Regions. You can specify Accounts or DeploymentTargets, but not both.
     */
    DeploymentTargets?: DeploymentTargets;
    /**
     * The names of one or more Amazon Web Services Regions where you want to create stack instances using the specified Amazon Web Services accounts.
     */
    Regions: RegionList;
    /**
     * A list of stack set parameters whose values you want to override in the selected stack instances. Any overridden parameter values will be applied to all stack instances in the specified accounts and Amazon Web Services Regions. When specifying parameters and their values, be aware of how CloudFormation sets parameter values during stack instance operations:   To override the current value for a parameter, include the parameter and specify its value.   To leave an overridden parameter set to its present value, include the parameter and specify UsePreviousValue as true. (You can't specify both a value and set UsePreviousValue to true.)   To set an overridden parameter back to the value specified in the stack set, specify a parameter list but don't include the parameter in the list.   To leave all parameters set to their present values, don't specify this property at all.   During stack set updates, any parameter values overridden for a stack instance aren't updated, but retain their overridden value. You can only override the parameter values that are specified in the stack set; to add or delete a parameter itself, use UpdateStackSet to update the stack set template.
     */
    ParameterOverrides?: Parameters;
    /**
     * Preferences for how CloudFormation performs this stack set operation.
     */
    OperationPreferences?: StackSetOperationPreferences;
    /**
     * The unique identifier for this stack set operation. The operation ID also functions as an idempotency token, to ensure that CloudFormation performs the stack set operation only once, even if you retry the request multiple times. You might retry stack set operation requests to ensure that CloudFormation successfully received them. If you don't specify an operation ID, the SDK generates one automatically. Repeating this stack set operation with a new operation ID retries all stack instances whose status is OUTDATED.
     */
    OperationId?: ClientRequestToken;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface CreateStackInstancesOutput {
    /**
     * The unique identifier for this stack set operation.
     */
    OperationId?: ClientRequestToken;
  }
  export interface CreateStackOutput {
    /**
     * Unique identifier of the stack.
     */
    StackId?: StackId;
  }
  export interface CreateStackSetInput {
    /**
     * The name to associate with the stack set. The name must be unique in the Region where you create your stack set.  A stack name can contain only alphanumeric characters (case-sensitive) and hyphens. It must start with an alphabetic character and can't be longer than 128 characters. 
     */
    StackSetName: StackSetName;
    /**
     * A description of the stack set. You can use the description to identify the stack set's purpose or other important information.
     */
    Description?: Description;
    /**
     * The structure that contains the template body, with a minimum length of 1 byte and a maximum length of 51,200 bytes. For more information, see Template Anatomy in the CloudFormation User Guide. Conditional: You must specify either the TemplateBody or the TemplateURL parameter, but not both.
     */
    TemplateBody?: TemplateBody;
    /**
     * The location of the file that contains the template body. The URL must point to a template (maximum size: 460,800 bytes) that's located in an Amazon S3 bucket or a Systems Manager document. For more information, see Template Anatomy in the CloudFormation User Guide. Conditional: You must specify either the TemplateBody or the TemplateURL parameter, but not both.
     */
    TemplateURL?: TemplateURL;
    /**
     * The stack ID you are importing into a new stack set. Specify the Amazon Resource Name (ARN) of the stack.
     */
    StackId?: StackId;
    /**
     * The input parameters for the stack set template.
     */
    Parameters?: Parameters;
    /**
     * In some cases, you must explicitly acknowledge that your stack set template contains certain capabilities in order for CloudFormation to create the stack set and related stack instances.    CAPABILITY_IAM and CAPABILITY_NAMED_IAM  Some stack templates might include resources that can affect permissions in your Amazon Web Services account; for example, by creating new Identity and Access Management (IAM) users. For those stack sets, you must explicitly acknowledge this by specifying one of these capabilities. The following IAM resources require you to specify either the CAPABILITY_IAM or CAPABILITY_NAMED_IAM capability.   If you have IAM resources, you can specify either capability.   If you have IAM resources with custom names, you must specify CAPABILITY_NAMED_IAM.   If you don't specify either of these capabilities, CloudFormation returns an InsufficientCapabilities error.   If your stack template contains these resources, we recommend that you review all permissions associated with them and edit their permissions if necessary.     AWS::IAM::AccessKey      AWS::IAM::Group     AWS::IAM::InstanceProfile      AWS::IAM::Policy      AWS::IAM::Role      AWS::IAM::User     AWS::IAM::UserToGroupAddition    For more information, see Acknowledging IAM Resources in CloudFormation Templates.    CAPABILITY_AUTO_EXPAND  Some templates reference macros. If your stack set template references one or more macros, you must create the stack set directly from the processed template, without first reviewing the resulting changes in a change set. To create the stack set directly, you must acknowledge this capability. For more information, see Using CloudFormation Macros to Perform Custom Processing on Templates.  Stack sets with service-managed permissions don't currently support the use of macros in templates. (This includes the AWS::Include and AWS::Serverless transforms, which are macros hosted by CloudFormation.) Even if you specify this capability for a stack set with service-managed permissions, if you reference a macro in your template the stack set operation will fail.   
     */
    Capabilities?: Capabilities;
    /**
     * The key-value pairs to associate with this stack set and the stacks created from it. CloudFormation also propagates these tags to supported resources that are created in the stacks. A maximum number of 50 tags can be specified. If you specify tags as part of a CreateStackSet action, CloudFormation checks to see if you have the required IAM permission to tag resources. If you don't, the entire CreateStackSet action fails with an access denied error, and the stack set is not created.
     */
    Tags?: Tags;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to use to create this stack set. Specify an IAM role only if you are using customized administrator roles to control which users or groups can manage specific stack sets within the same administrator account. For more information, see Prerequisites: Granting Permissions for Stack Set Operations in the CloudFormation User Guide.
     */
    AdministrationRoleARN?: RoleARN;
    /**
     * The name of the IAM execution role to use to create the stack set. If you do not specify an execution role, CloudFormation uses the AWSCloudFormationStackSetExecutionRole role for the stack set operation. Specify an IAM role only if you are using customized execution roles to control which stack resources users and groups can include in their stack sets.
     */
    ExecutionRoleName?: ExecutionRoleName;
    /**
     * Describes how the IAM roles required for stack set operations are created. By default, SELF-MANAGED is specified.   With self-managed permissions, you must create the administrator and execution roles required to deploy to target accounts. For more information, see Grant Self-Managed Stack Set Permissions.   With service-managed permissions, StackSets automatically creates the IAM roles required to deploy to accounts managed by Organizations. For more information, see Grant Service-Managed Stack Set Permissions.  
     */
    PermissionModel?: PermissionModels;
    /**
     * Describes whether StackSets automatically deploys to Organizations accounts that are added to the target organization or organizational unit (OU). Specify only if PermissionModel is SERVICE_MANAGED.
     */
    AutoDeployment?: AutoDeployment;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   To create a stack set with service-managed permissions while signed in to the management account, specify SELF.   To create a stack set with service-managed permissions while signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated admin in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.   Stack sets with service-managed permissions are created in the management account, including stack sets that are created by delegated administrators.
     */
    CallAs?: CallAs;
    /**
     * A unique identifier for this CreateStackSet request. Specify this token if you plan to retry requests so that CloudFormation knows that you're not attempting to create another stack set with the same name. You might retry CreateStackSet requests to ensure that CloudFormation successfully received them. If you don't specify an operation ID, the SDK generates one automatically.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * Describes whether StackSets performs non-conflicting operations concurrently and queues conflicting operations.
     */
    ManagedExecution?: ManagedExecution;
  }
  export interface CreateStackSetOutput {
    /**
     * The ID of the stack set that you're creating.
     */
    StackSetId?: StackSetId;
  }
  export type CreationTime = Date;
  export interface DeactivateOrganizationsAccessInput {
  }
  export interface DeactivateOrganizationsAccessOutput {
  }
  export interface DeactivateTypeInput {
    /**
     * The type name of the extension, in this account and Region. If you specified a type name alias when enabling the extension, use the type name alias. Conditional: You must specify either Arn, or TypeName and Type.
     */
    TypeName?: TypeName;
    /**
     * The extension type. Conditional: You must specify either Arn, or TypeName and Type.
     */
    Type?: ThirdPartyType;
    /**
     * The Amazon Resource Name (ARN) for the extension, in this account and Region. Conditional: You must specify either Arn, or TypeName and Type.
     */
    Arn?: PrivateTypeArn;
  }
  export interface DeactivateTypeOutput {
  }
  export interface DeleteChangeSetInput {
    /**
     * The name or Amazon Resource Name (ARN) of the change set that you want to delete.
     */
    ChangeSetName: ChangeSetNameOrId;
    /**
     * If you specified the name of a change set to delete, specify the stack name or Amazon Resource Name (ARN) that's associated with it.
     */
    StackName?: StackNameOrId;
  }
  export interface DeleteChangeSetOutput {
  }
  export interface DeleteStackInput {
    /**
     * The name or the unique stack ID that's associated with the stack.
     */
    StackName: StackName;
    /**
     * For stacks in the DELETE_FAILED state, a list of resource logical IDs that are associated with the resources you want to retain. During deletion, CloudFormation deletes the stack but doesn't delete the retained resources. Retaining resources is useful when you can't delete a resource, such as a non-empty S3 bucket, but you want to delete the stack.
     */
    RetainResources?: RetainResources;
    /**
     * The Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that CloudFormation assumes to delete the stack. CloudFormation uses the role's credentials to make calls on your behalf. If you don't specify a value, CloudFormation uses the role that was previously associated with the stack. If no role is available, CloudFormation uses a temporary session that's generated from your user credentials.
     */
    RoleARN?: RoleARN;
    /**
     * A unique identifier for this DeleteStack request. Specify this token if you plan to retry requests so that CloudFormation knows that you're not attempting to delete a stack with the same name. You might retry DeleteStack requests to ensure that CloudFormation successfully received them. All events initiated by a given stack operation are assigned the same client request token, which you can use to track operations. For example, if you execute a CreateStack operation with the token token1, then all the StackEvents generated by that operation will have ClientRequestToken set as token1. In the console, stack operations display the client request token on the Events tab. Stack operations that are initiated from the console use the token format Console-StackOperation-ID, which helps you easily identify the stack operation . For example, if you create a stack using the console, each stack event would be assigned the same token in the following format: Console-CreateStack-7f59c3cf-00d2-40c7-b2ff-e75db0987002.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface DeleteStackInstancesInput {
    /**
     * The name or unique ID of the stack set that you want to delete stack instances for.
     */
    StackSetName: StackSetName;
    /**
     * [Self-managed permissions] The names of the Amazon Web Services accounts that you want to delete stack instances for. You can specify Accounts or DeploymentTargets, but not both.
     */
    Accounts?: AccountList;
    /**
     * [Service-managed permissions] The Organizations accounts from which to delete stack instances. You can specify Accounts or DeploymentTargets, but not both.
     */
    DeploymentTargets?: DeploymentTargets;
    /**
     * The Amazon Web Services Regions where you want to delete stack set instances.
     */
    Regions: RegionList;
    /**
     * Preferences for how CloudFormation performs this stack set operation.
     */
    OperationPreferences?: StackSetOperationPreferences;
    /**
     * Removes the stack instances from the specified stack set, but doesn't delete the stacks. You can't reassociate a retained stack or add an existing, saved stack to a new stack set. For more information, see Stack set operation options.
     */
    RetainStacks: RetainStacks;
    /**
     * The unique identifier for this stack set operation. If you don't specify an operation ID, the SDK generates one automatically. The operation ID also functions as an idempotency token, to ensure that CloudFormation performs the stack set operation only once, even if you retry the request multiple times. You can retry stack set operation requests to ensure that CloudFormation successfully received them. Repeating this stack set operation with a new operation ID retries all stack instances whose status is OUTDATED.
     */
    OperationId?: ClientRequestToken;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface DeleteStackInstancesOutput {
    /**
     * The unique identifier for this stack set operation.
     */
    OperationId?: ClientRequestToken;
  }
  export interface DeleteStackSetInput {
    /**
     * The name or unique ID of the stack set that you're deleting. You can obtain this value by running ListStackSets.
     */
    StackSetName: StackSetName;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface DeleteStackSetOutput {
  }
  export type DeletionTime = Date;
  export interface DeploymentTargets {
    /**
     * The names of one or more Amazon Web Services accounts for which you want to deploy stack set updates.
     */
    Accounts?: AccountList;
    /**
     * Returns the value of the AccountsUrl property.
     */
    AccountsUrl?: AccountsUrl;
    /**
     * The organization root ID or organizational unit (OU) IDs to which StackSets deploys.
     */
    OrganizationalUnitIds?: OrganizationalUnitIdList;
    /**
     * Limit deployment targets to individual accounts or include additional accounts with provided OUs. The following is a list of possible values for the AccountFilterType operation.    INTERSECTION: StackSets deploys to the accounts specified in Accounts parameter.     DIFFERENCE: StackSets excludes the accounts specified in Accounts parameter. This enables user to avoid certain accounts within an OU such as suspended accounts.    UNION: StackSets includes additional accounts deployment targets.  This is the default value if AccountFilterType is not provided. This enables user to update an entire OU and individual accounts from a different OU in one request, which used to be two separate requests.    NONE: Deploys to all the accounts in specified organizational units (OU).  
     */
    AccountFilterType?: AccountFilterType;
  }
  export type DeprecatedStatus = "LIVE"|"DEPRECATED"|string;
  export interface DeregisterTypeInput {
    /**
     * The Amazon Resource Name (ARN) of the extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    Arn?: PrivateTypeArn;
    /**
     * The kind of extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    Type?: RegistryType;
    /**
     * The name of the extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    TypeName?: TypeName;
    /**
     * The ID of a specific version of the extension. The version ID is the value at the end of the Amazon Resource Name (ARN) assigned to the extension version when it is registered.
     */
    VersionId?: TypeVersionId;
  }
  export interface DeregisterTypeOutput {
  }
  export interface DescribeAccountLimitsInput {
    /**
     * A string that identifies the next page of limits that you want to retrieve.
     */
    NextToken?: NextToken;
  }
  export interface DescribeAccountLimitsOutput {
    /**
     * An account limit structure that contain a list of CloudFormation account limits and their values.
     */
    AccountLimits?: AccountLimitList;
    /**
     * If the output exceeds 1 MB in size, a string that identifies the next page of limits. If no additional page exists, this value is null.
     */
    NextToken?: NextToken;
  }
  export interface DescribeChangeSetHooksInput {
    /**
     * The name or Amazon Resource Name (ARN) of the change set that you want to describe.
     */
    ChangeSetName: ChangeSetNameOrId;
    /**
     * If you specified the name of a change set, specify the stack name or stack ID (ARN) of the change set you want to describe.
     */
    StackName?: StackNameOrId;
    /**
     * A string, provided by the DescribeChangeSetHooks response output, that identifies the next page of information that you want to retrieve.
     */
    NextToken?: NextToken;
    /**
     * If specified, lists only the hooks related to the specified LogicalResourceId.
     */
    LogicalResourceId?: LogicalResourceId;
  }
  export interface DescribeChangeSetHooksOutput {
    /**
     * The change set identifier (stack ID).
     */
    ChangeSetId?: ChangeSetId;
    /**
     * The change set name.
     */
    ChangeSetName?: ChangeSetName;
    /**
     * List of hook objects.
     */
    Hooks?: ChangeSetHooks;
    /**
     * Provides the status of the change set hook.
     */
    Status?: ChangeSetHooksStatus;
    /**
     * Pagination token, null or empty if no more results.
     */
    NextToken?: NextToken;
    /**
     * The stack identifier (stack ID).
     */
    StackId?: StackId;
    /**
     * The stack name.
     */
    StackName?: StackName;
  }
  export interface DescribeChangeSetInput {
    /**
     * The name or Amazon Resource Name (ARN) of the change set that you want to describe.
     */
    ChangeSetName: ChangeSetNameOrId;
    /**
     * If you specified the name of a change set, specify the stack name or ID (ARN) of the change set you want to describe.
     */
    StackName?: StackNameOrId;
    /**
     * A string (provided by the DescribeChangeSet response output) that identifies the next page of information that you want to retrieve.
     */
    NextToken?: NextToken;
  }
  export interface DescribeChangeSetOutput {
    /**
     * The name of the change set.
     */
    ChangeSetName?: ChangeSetName;
    /**
     * The Amazon Resource Name (ARN) of the change set.
     */
    ChangeSetId?: ChangeSetId;
    /**
     * The Amazon Resource Name (ARN) of the stack that's associated with the change set.
     */
    StackId?: StackId;
    /**
     * The name of the stack that's associated with the change set.
     */
    StackName?: StackName;
    /**
     * Information about the change set.
     */
    Description?: Description;
    /**
     * A list of Parameter structures that describes the input parameters and their values used to create the change set. For more information, see the Parameter data type.
     */
    Parameters?: Parameters;
    /**
     * The start time when the change set was created, in UTC.
     */
    CreationTime?: CreationTime;
    /**
     * If the change set execution status is AVAILABLE, you can execute the change set. If you can't execute the change set, the status indicates why. For example, a change set might be in an UNAVAILABLE state because CloudFormation is still creating it or in an OBSOLETE state because the stack was already updated.
     */
    ExecutionStatus?: ExecutionStatus;
    /**
     * The current status of the change set, such as CREATE_IN_PROGRESS, CREATE_COMPLETE, or FAILED.
     */
    Status?: ChangeSetStatus;
    /**
     * A description of the change set's status. For example, if your attempt to create a change set failed, CloudFormation shows the error message.
     */
    StatusReason?: ChangeSetStatusReason;
    /**
     * The ARNs of the Amazon Simple Notification Service (Amazon SNS) topics that will be associated with the stack if you execute the change set.
     */
    NotificationARNs?: NotificationARNs;
    /**
     * The rollback triggers for CloudFormation to monitor during stack creation and updating operations, and for the specified monitoring period afterwards.
     */
    RollbackConfiguration?: RollbackConfiguration;
    /**
     * If you execute the change set, the list of capabilities that were explicitly acknowledged when the change set was created.
     */
    Capabilities?: Capabilities;
    /**
     * If you execute the change set, the tags that will be associated with the stack.
     */
    Tags?: Tags;
    /**
     * A list of Change structures that describes the resources CloudFormation changes if you execute the change set.
     */
    Changes?: Changes;
    /**
     * If the output exceeds 1 MB, a string that identifies the next page of changes. If there is no additional page, this value is null.
     */
    NextToken?: NextToken;
    /**
     * Verifies if IncludeNestedStacks is set to True.
     */
    IncludeNestedStacks?: IncludeNestedStacks;
    /**
     * Specifies the change set ID of the parent change set in the current nested change set hierarchy.
     */
    ParentChangeSetId?: ChangeSetId;
    /**
     * Specifies the change set ID of the root change set in the current nested change set hierarchy.
     */
    RootChangeSetId?: ChangeSetId;
    /**
     * Determines what action will be taken if stack creation fails. When this parameter is specified, the DisableRollback parameter to the ExecuteChangeSet API operation must not be specified. This must be one of these values:    DELETE - Deletes the change set if the stack creation fails. This is only valid when the ChangeSetType parameter is set to CREATE. If the deletion of the stack fails, the status of the stack is DELETE_FAILED.    DO_NOTHING - if the stack creation fails, do nothing. This is equivalent to specifying true for the DisableRollback parameter to the ExecuteChangeSet API operation.    ROLLBACK - if the stack creation fails, roll back the stack. This is equivalent to specifying false for the DisableRollback parameter to the ExecuteChangeSet API operation.  
     */
    OnStackFailure?: OnStackFailure;
  }
  export interface DescribeOrganizationsAccessInput {
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface DescribeOrganizationsAccessOutput {
    /**
     * Presents the status of the OrganizationAccess.
     */
    Status?: OrganizationStatus;
  }
  export interface DescribePublisherInput {
    /**
     * The ID of the extension publisher. If you don't supply a PublisherId, and you have registered as an extension publisher, DescribePublisher returns information about your own publisher account.
     */
    PublisherId?: PublisherId;
  }
  export interface DescribePublisherOutput {
    /**
     * The ID of the extension publisher.
     */
    PublisherId?: PublisherId;
    /**
     * Whether the publisher is verified. Currently, all registered publishers are verified.
     */
    PublisherStatus?: PublisherStatus;
    /**
     * The type of account used as the identity provider when registering this publisher with CloudFormation.
     */
    IdentityProvider?: IdentityProvider;
    /**
     * The URL to the publisher's profile with the identity provider.
     */
    PublisherProfile?: PublisherProfile;
  }
  export interface DescribeStackDriftDetectionStatusInput {
    /**
     * The ID of the drift detection results of this operation. CloudFormation generates new results, with a new drift detection ID, each time this operation is run. However, the number of drift results CloudFormation retains for any given stack, and for how long, may vary.
     */
    StackDriftDetectionId: StackDriftDetectionId;
  }
  export interface DescribeStackDriftDetectionStatusOutput {
    /**
     * The ID of the stack.
     */
    StackId: StackId;
    /**
     * The ID of the drift detection results of this operation. CloudFormation generates new results, with a new drift detection ID, each time this operation is run. However, the number of reports CloudFormation retains for any given stack, and for how long, may vary.
     */
    StackDriftDetectionId: StackDriftDetectionId;
    /**
     * Status of the stack's actual configuration compared to its expected configuration.    DRIFTED: The stack differs from its expected template configuration. A stack is considered to have drifted if one or more of its resources have drifted.    NOT_CHECKED: CloudFormation hasn't checked if the stack differs from its expected template configuration.    IN_SYNC: The stack's actual configuration matches its expected template configuration.    UNKNOWN: This value is reserved for future use.  
     */
    StackDriftStatus?: StackDriftStatus;
    /**
     * The status of the stack drift detection operation.    DETECTION_COMPLETE: The stack drift detection operation has successfully completed for all resources in the stack that support drift detection. (Resources that don't currently support stack detection remain unchecked.) If you specified logical resource IDs for CloudFormation to use as a filter for the stack drift detection operation, only the resources with those logical IDs are checked for drift.    DETECTION_FAILED: The stack drift detection operation has failed for at least one resource in the stack. Results will be available for resources on which CloudFormation successfully completed drift detection.    DETECTION_IN_PROGRESS: The stack drift detection operation is currently in progress.  
     */
    DetectionStatus: StackDriftDetectionStatus;
    /**
     * The reason the stack drift detection operation has its current status.
     */
    DetectionStatusReason?: StackDriftDetectionStatusReason;
    /**
     * Total number of stack resources that have drifted. This is NULL until the drift detection operation reaches a status of DETECTION_COMPLETE. This value will be 0 for stacks whose drift status is IN_SYNC.
     */
    DriftedStackResourceCount?: BoxedInteger;
    /**
     * Time at which the stack drift detection operation was initiated.
     */
    Timestamp: Timestamp;
  }
  export interface DescribeStackEventsInput {
    /**
     * The name or the unique stack ID that's associated with the stack, which aren't always interchangeable:   Running stacks: You can specify either the stack's name or its unique stack ID.   Deleted stacks: You must specify the unique stack ID.   Default: There is no default value.
     */
    StackName?: StackName;
    /**
     * A string that identifies the next page of events that you want to retrieve.
     */
    NextToken?: NextToken;
  }
  export interface DescribeStackEventsOutput {
    /**
     * A list of StackEvents structures.
     */
    StackEvents?: StackEvents;
    /**
     * If the output exceeds 1 MB in size, a string that identifies the next page of events. If no additional page exists, this value is null.
     */
    NextToken?: NextToken;
  }
  export interface DescribeStackInstanceInput {
    /**
     * The name or the unique stack ID of the stack set that you want to get stack instance information for.
     */
    StackSetName: StackSetName;
    /**
     * The ID of an Amazon Web Services account that's associated with this stack instance.
     */
    StackInstanceAccount: Account;
    /**
     * The name of a Region that's associated with this stack instance.
     */
    StackInstanceRegion: Region;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface DescribeStackInstanceOutput {
    /**
     * The stack instance that matches the specified request parameters.
     */
    StackInstance?: StackInstance;
  }
  export interface DescribeStackResourceDriftsInput {
    /**
     * The name of the stack for which you want drift information.
     */
    StackName: StackNameOrId;
    /**
     * The resource drift status values to use as filters for the resource drift results returned.    DELETED: The resource differs from its expected template configuration in that the resource has been deleted.    MODIFIED: One or more resource properties differ from their expected template values.    IN_SYNC: The resource's actual configuration matches its expected template configuration.    NOT_CHECKED: CloudFormation doesn't currently return this value.  
     */
    StackResourceDriftStatusFilters?: StackResourceDriftStatusFilters;
    /**
     * A string that identifies the next page of stack resource drift results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results.
     */
    MaxResults?: BoxedMaxResults;
  }
  export interface DescribeStackResourceDriftsOutput {
    /**
     * Drift information for the resources that have been checked for drift in the specified stack. This includes actual and expected configuration values for resources where CloudFormation detects drift. For a given stack, there will be one StackResourceDrift for each stack resource that has been checked for drift. Resources that haven't yet been checked for drift aren't included. Resources that do not currently support drift detection aren't checked, and so not included. For a list of resources that support drift detection, see Resources that Support Drift Detection.
     */
    StackResourceDrifts: StackResourceDrifts;
    /**
     * If the request doesn't return all the remaining results, NextToken is set to a token. To retrieve the next set of results, call DescribeStackResourceDrifts again and assign that token to the request object's NextToken parameter. If the request returns all results, NextToken is set to null.
     */
    NextToken?: NextToken;
  }
  export interface DescribeStackResourceInput {
    /**
     * The name or the unique stack ID that's associated with the stack, which aren't always interchangeable:   Running stacks: You can specify either the stack's name or its unique stack ID.   Deleted stacks: You must specify the unique stack ID.   Default: There is no default value.
     */
    StackName: StackName;
    /**
     * The logical name of the resource as specified in the template. Default: There is no default value.
     */
    LogicalResourceId: LogicalResourceId;
  }
  export interface DescribeStackResourceOutput {
    /**
     * A StackResourceDetail structure containing the description of the specified resource in the specified stack.
     */
    StackResourceDetail?: StackResourceDetail;
  }
  export interface DescribeStackResourcesInput {
    /**
     * The name or the unique stack ID that is associated with the stack, which aren't always interchangeable:   Running stacks: You can specify either the stack's name or its unique stack ID.   Deleted stacks: You must specify the unique stack ID.   Default: There is no default value. Required: Conditional. If you don't specify StackName, you must specify PhysicalResourceId.
     */
    StackName?: StackName;
    /**
     * The logical name of the resource as specified in the template. Default: There is no default value.
     */
    LogicalResourceId?: LogicalResourceId;
    /**
     * The name or unique identifier that corresponds to a physical instance ID of a resource supported by CloudFormation. For example, for an Amazon Elastic Compute Cloud (EC2) instance, PhysicalResourceId corresponds to the InstanceId. You can pass the EC2 InstanceId to DescribeStackResources to find which stack the instance belongs to and what other resources are part of the stack. Required: Conditional. If you don't specify PhysicalResourceId, you must specify StackName. Default: There is no default value.
     */
    PhysicalResourceId?: PhysicalResourceId;
  }
  export interface DescribeStackResourcesOutput {
    /**
     * A list of StackResource structures.
     */
    StackResources?: StackResources;
  }
  export interface DescribeStackSetInput {
    /**
     * The name or unique ID of the stack set whose description you want.
     */
    StackSetName: StackSetName;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface DescribeStackSetOperationInput {
    /**
     * The name or the unique stack ID of the stack set for the stack operation.
     */
    StackSetName: StackSetName;
    /**
     * The unique ID of the stack set operation.
     */
    OperationId: ClientRequestToken;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface DescribeStackSetOperationOutput {
    /**
     * The specified stack set operation.
     */
    StackSetOperation?: StackSetOperation;
  }
  export interface DescribeStackSetOutput {
    /**
     * The specified stack set.
     */
    StackSet?: StackSet;
  }
  export interface DescribeStacksInput {
    /**
     *  If you don't pass a parameter to StackName, the API returns a response that describes all resources in the account, which can impact performance. This requires ListStacks and DescribeStacks permissions. Consider using the ListStacks API if you're not passing a parameter to StackName. The IAM policy below can be added to IAM policies when you want to limit resource-level permissions and avoid returning a response when no parameter is sent in the request: { "Version": "2012-10-17", "Statement": [{ "Effect": "Deny", "Action": "cloudformation:DescribeStacks", "NotResource": "arn:aws:cloudformation:*:*:stack/**" }] }  The name or the unique stack ID that's associated with the stack, which aren't always interchangeable:   Running stacks: You can specify either the stack's name or its unique stack ID.   Deleted stacks: You must specify the unique stack ID.   Default: There is no default value.
     */
    StackName?: StackName;
    /**
     * A string that identifies the next page of stacks that you want to retrieve.
     */
    NextToken?: NextToken;
  }
  export interface DescribeStacksOutput {
    /**
     * A list of stack structures.
     */
    Stacks?: Stacks;
    /**
     * If the output exceeds 1 MB in size, a string that identifies the next page of stacks. If no additional page exists, this value is null.
     */
    NextToken?: NextToken;
  }
  export interface DescribeTypeInput {
    /**
     * The kind of extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    Type?: RegistryType;
    /**
     * The name of the extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    TypeName?: TypeName;
    /**
     * The Amazon Resource Name (ARN) of the extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    Arn?: TypeArn;
    /**
     * The ID of a specific version of the extension. The version ID is the value at the end of the Amazon Resource Name (ARN) assigned to the extension version when it is registered. If you specify a VersionId, DescribeType returns information about that specific extension version. Otherwise, it returns information about the default extension version.
     */
    VersionId?: TypeVersionId;
    /**
     * The publisher ID of the extension publisher. Extensions provided by Amazon Web Services are not assigned a publisher ID.
     */
    PublisherId?: PublisherId;
    /**
     * The version number of a public third-party extension.
     */
    PublicVersionNumber?: PublicVersionNumber;
  }
  export interface DescribeTypeOutput {
    /**
     * The Amazon Resource Name (ARN) of the extension.
     */
    Arn?: TypeArn;
    /**
     * The kind of extension.
     */
    Type?: RegistryType;
    /**
     * The name of the extension. If the extension is a public third-party type you have activated with a type name alias, CloudFormation returns the type name alias. For more information, see ActivateType.
     */
    TypeName?: TypeName;
    /**
     * The ID of the default version of the extension. The default version is used when the extension version isn't specified. This applies only to private extensions you have registered in your account. For public extensions, both those provided by Amazon Web Services and published by third parties, CloudFormation returns null. For more information, see RegisterType. To set the default version of an extension, use SetTypeDefaultVersion.
     */
    DefaultVersionId?: TypeVersionId;
    /**
     * Whether the specified extension version is set as the default version. This applies only to private extensions you have registered in your account, and extensions published by Amazon Web Services. For public third-party extensions, whether they are activated in your account, CloudFormation returns null.
     */
    IsDefaultVersion?: IsDefaultVersion;
    /**
     * The contract test status of the registered extension version. To return the extension test status of a specific extension version, you must specify VersionId. This applies only to registered private extension versions. CloudFormation doesn't return this information for public extensions, whether they are activated in your account.    PASSED: The extension has passed all its contract tests. An extension must have a test status of PASSED before it can be published. For more information, see Publishing extensions to make them available for public use in the CloudFormation Command Line Interface User Guide.    FAILED: The extension has failed one or more contract tests.    IN_PROGRESS: Contract tests are currently being performed on the extension.    NOT_TESTED: Contract tests haven't been performed on the extension.  
     */
    TypeTestsStatus?: TypeTestsStatus;
    /**
     * The description of the test status. To return the extension test status of a specific extension version, you must specify VersionId. This applies only to registered private extension versions. CloudFormation doesn't return this information for public extensions, whether they are activated in your account.
     */
    TypeTestsStatusDescription?: TypeTestsStatusDescription;
    /**
     * The description of the extension.
     */
    Description?: Description;
    /**
     * The schema that defines the extension. For more information about extension schemas, see Resource Provider Schema in the CloudFormation CLI User Guide.
     */
    Schema?: TypeSchema;
    /**
     * For resource type extensions, the provisioning behavior of the resource type. CloudFormation determines the provisioning type during registration, based on the types of handlers in the schema handler package submitted. Valid values include:    FULLY_MUTABLE: The resource type includes an update handler to process updates to the type during stack update operations.    IMMUTABLE: The resource type doesn't include an update handler, so the type can't be updated and must instead be replaced during stack update operations.    NON_PROVISIONABLE: The resource type doesn't include all the following handlers, and therefore can't actually be provisioned.   create   read   delete    
     */
    ProvisioningType?: ProvisioningType;
    /**
     * The deprecation status of the extension version. Valid values include:    LIVE: The extension is activated or registered and can be used in CloudFormation operations, dependent on its provisioning behavior and visibility scope.    DEPRECATED: The extension has been deactivated or deregistered and can no longer be used in CloudFormation operations.   For public third-party extensions, CloudFormation returns null.
     */
    DeprecatedStatus?: DeprecatedStatus;
    /**
     * Contains logging configuration information for private extensions. This applies only to private extensions you have registered in your account. For public extensions, both those provided by Amazon Web Services and published by third parties, CloudFormation returns null. For more information, see RegisterType.
     */
    LoggingConfig?: LoggingConfig;
    /**
     * For extensions that are modules, the public third-party extensions that must be activated in your account in order for the module itself to be activated.
     */
    RequiredActivatedTypes?: RequiredActivatedTypes;
    /**
     * The Amazon Resource Name (ARN) of the IAM execution role used to register the extension. This applies only to private extensions you have registered in your account. For more information, see RegisterType. If the registered extension calls any Amazon Web Services APIs, you must create an  IAM execution role  that includes the necessary permissions to call those Amazon Web Services APIs, and provision that execution role in your account. CloudFormation then assumes that execution role to provide your extension with the appropriate credentials.
     */
    ExecutionRoleArn?: RoleArn;
    /**
     * The scope at which the extension is visible and usable in CloudFormation operations. Valid values include:    PRIVATE: The extension is only visible and usable within the account in which it is registered. CloudFormation marks any extensions you register as PRIVATE.    PUBLIC: The extension is publicly visible and usable within any Amazon Web Services account.  
     */
    Visibility?: Visibility;
    /**
     * The URL of the source code for the extension.
     */
    SourceUrl?: OptionalSecureUrl;
    /**
     * The URL of a page providing detailed documentation for this extension.
     */
    DocumentationUrl?: OptionalSecureUrl;
    /**
     * When the specified extension version was registered. This applies only to:   Private extensions you have registered in your account. For more information, see RegisterType.   Public extensions you have activated in your account with auto-update specified. For more information, see ActivateType.  
     */
    LastUpdated?: Timestamp;
    /**
     * When the specified private extension version was registered or activated in your account.
     */
    TimeCreated?: Timestamp;
    /**
     * A JSON string that represent the current configuration data for the extension in this account and Region. To set the configuration data for an extension, use SetTypeConfiguration. For more information, see Configuring extensions at the account level in the CloudFormation User Guide.
     */
    ConfigurationSchema?: ConfigurationSchema;
    /**
     * The publisher ID of the extension publisher. This applies only to public third-party extensions. For private registered extensions, and extensions provided by Amazon Web Services, CloudFormation returns null.
     */
    PublisherId?: PublisherId;
    /**
     * For public extensions that have been activated for this account and Region, the type name of the public extension. If you specified a TypeNameAlias when enabling the extension in this account and Region, CloudFormation treats that alias as the extension's type name within the account and Region, not the type name of the public extension. For more information, see Specifying aliases to refer to extensions in the CloudFormation User Guide.
     */
    OriginalTypeName?: TypeName;
    /**
     * For public extensions that have been activated for this account and Region, the Amazon Resource Name (ARN) of the public extension.
     */
    OriginalTypeArn?: TypeArn;
    /**
     * The version number of a public third-party extension. This applies only if you specify a public extension you have activated in your account, or specify a public extension without specifying a version. For all other extensions, CloudFormation returns null.
     */
    PublicVersionNumber?: PublicVersionNumber;
    /**
     * The latest version of a public extension that is available for use. This only applies if you specify a public extension, and you don't specify a version. For all other requests, CloudFormation returns null.
     */
    LatestPublicVersion?: PublicVersionNumber;
    /**
     * Whether the extension is activated in the account and Region. This only applies to public third-party extensions. For all other extensions, CloudFormation returns null.
     */
    IsActivated?: IsActivated;
    /**
     * Whether CloudFormation automatically updates the extension in this account and Region when a new minor version is published by the extension publisher. Major versions released by the publisher must be manually updated. For more information, see Activating public extensions for use in your account in the CloudFormation User Guide.
     */
    AutoUpdate?: AutoUpdate;
  }
  export interface DescribeTypeRegistrationInput {
    /**
     * The identifier for this registration request. This registration token is generated by CloudFormation when you initiate a registration request using RegisterType.
     */
    RegistrationToken: RegistrationToken;
  }
  export interface DescribeTypeRegistrationOutput {
    /**
     * The current status of the extension registration request.
     */
    ProgressStatus?: RegistrationStatus;
    /**
     * The description of the extension registration request.
     */
    Description?: Description;
    /**
     * The Amazon Resource Name (ARN) of the extension being registered. For registration requests with a ProgressStatus of other than COMPLETE, this will be null.
     */
    TypeArn?: TypeArn;
    /**
     * The Amazon Resource Name (ARN) of this specific version of the extension being registered. For registration requests with a ProgressStatus of other than COMPLETE, this will be null.
     */
    TypeVersionArn?: TypeArn;
  }
  export type Description = string;
  export interface DetectStackDriftInput {
    /**
     * The name of the stack for which you want to detect drift.
     */
    StackName: StackNameOrId;
    /**
     * The logical names of any resources you want to use as filters.
     */
    LogicalResourceIds?: LogicalResourceIds;
  }
  export interface DetectStackDriftOutput {
    /**
     * The ID of the drift detection results of this operation. CloudFormation generates new results, with a new drift detection ID, each time this operation is run. However, the number of drift results CloudFormation retains for any given stack, and for how long, may vary.
     */
    StackDriftDetectionId: StackDriftDetectionId;
  }
  export interface DetectStackResourceDriftInput {
    /**
     * The name of the stack to which the resource belongs.
     */
    StackName: StackNameOrId;
    /**
     * The logical name of the resource for which to return drift information.
     */
    LogicalResourceId: LogicalResourceId;
  }
  export interface DetectStackResourceDriftOutput {
    /**
     * Information about whether the resource's actual configuration has drifted from its expected template configuration, including actual and expected property values and any differences detected.
     */
    StackResourceDrift: StackResourceDrift;
  }
  export interface DetectStackSetDriftInput {
    /**
     * The name of the stack set on which to perform the drift detection operation.
     */
    StackSetName: StackSetNameOrId;
    /**
     * The user-specified preferences for how CloudFormation performs a stack set operation. For more information about maximum concurrent accounts and failure tolerance, see Stack set operation options.
     */
    OperationPreferences?: StackSetOperationPreferences;
    /**
     *  The ID of the stack set operation. 
     */
    OperationId?: ClientRequestToken;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface DetectStackSetDriftOutput {
    /**
     * The ID of the drift detection stack set operation. You can use this operation ID with DescribeStackSetOperation to monitor the progress of the drift detection operation.
     */
    OperationId?: ClientRequestToken;
  }
  export type DifferenceType = "ADD"|"REMOVE"|"NOT_EQUAL"|string;
  export type DisableRollback = boolean;
  export type DriftedStackInstancesCount = number;
  export type EnableTerminationProtection = boolean;
  export type ErrorCode = string;
  export type ErrorMessage = string;
  export interface EstimateTemplateCostInput {
    /**
     * Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes. (For more information, go to Template Anatomy in the CloudFormation User Guide.) Conditional: You must pass TemplateBody or TemplateURL. If both are passed, only TemplateBody is used.
     */
    TemplateBody?: TemplateBody;
    /**
     * Location of file containing the template body. The URL must point to a template that's located in an Amazon S3 bucket or a Systems Manager document. For more information, go to Template Anatomy in the CloudFormation User Guide. Conditional: You must pass TemplateURL or TemplateBody. If both are passed, only TemplateBody is used.
     */
    TemplateURL?: TemplateURL;
    /**
     * A list of Parameter structures that specify input parameters.
     */
    Parameters?: Parameters;
  }
  export interface EstimateTemplateCostOutput {
    /**
     * An Amazon Web Services Simple Monthly Calculator URL with a query string that describes the resources required to run the template.
     */
    Url?: Url;
  }
  export type EvaluationType = "Static"|"Dynamic"|string;
  export type EventId = string;
  export interface ExecuteChangeSetInput {
    /**
     * The name or Amazon Resource Name (ARN) of the change set that you want use to update the specified stack.
     */
    ChangeSetName: ChangeSetNameOrId;
    /**
     * If you specified the name of a change set, specify the stack name or Amazon Resource Name (ARN) that's associated with the change set you want to execute.
     */
    StackName?: StackNameOrId;
    /**
     * A unique identifier for this ExecuteChangeSet request. Specify this token if you plan to retry requests so that CloudFormation knows that you're not attempting to execute a change set to update a stack with the same name. You might retry ExecuteChangeSet requests to ensure that CloudFormation successfully received them.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * Preserves the state of previously provisioned resources when an operation fails. This parameter can't be specified when the OnStackFailure parameter to the CreateChangeSet API operation was specified.    True - if the stack creation fails, do nothing. This is equivalent to specifying DO_NOTHING for the OnStackFailure parameter to the CreateChangeSet API operation.    False - if the stack creation fails, roll back the stack. This is equivalent to specifying ROLLBACK for the OnStackFailure parameter to the CreateChangeSet API operation.   Default: True 
     */
    DisableRollback?: DisableRollback;
    /**
     * When set to true, newly created resources are deleted when the operation rolls back. This includes newly created resources marked with a deletion policy of Retain. Default: false 
     */
    RetainExceptOnCreate?: RetainExceptOnCreate;
  }
  export interface ExecuteChangeSetOutput {
  }
  export type ExecutionRoleName = string;
  export type ExecutionStatus = "UNAVAILABLE"|"AVAILABLE"|"EXECUTE_IN_PROGRESS"|"EXECUTE_COMPLETE"|"EXECUTE_FAILED"|"OBSOLETE"|string;
  export interface Export {
    /**
     * The stack that contains the exported output name and value.
     */
    ExportingStackId?: StackId;
    /**
     * The name of exported output value. Use this name and the Fn::ImportValue function to import the associated value into other stacks. The name is defined in the Export field in the associated stack's Outputs section.
     */
    Name?: ExportName;
    /**
     * The value of the exported output, such as a resource physical ID. This value is defined in the Export field in the associated stack's Outputs section.
     */
    Value?: ExportValue;
  }
  export type ExportName = string;
  export type ExportValue = string;
  export type Exports = Export[];
  export type FailedStackInstancesCount = number;
  export type FailureToleranceCount = number;
  export type FailureTolerancePercentage = number;
  export interface GetStackPolicyInput {
    /**
     * The name or unique stack ID that's associated with the stack whose policy you want to get.
     */
    StackName: StackName;
  }
  export interface GetStackPolicyOutput {
    /**
     * Structure containing the stack policy body. (For more information, go to  Prevent Updates to Stack Resources in the CloudFormation User Guide.)
     */
    StackPolicyBody?: StackPolicyBody;
  }
  export interface GetTemplateInput {
    /**
     * The name or the unique stack ID that's associated with the stack, which aren't always interchangeable:   Running stacks: You can specify either the stack's name or its unique stack ID.   Deleted stacks: You must specify the unique stack ID.   Default: There is no default value.
     */
    StackName?: StackName;
    /**
     * The name or Amazon Resource Name (ARN) of a change set for which CloudFormation returns the associated template. If you specify a name, you must also specify the StackName.
     */
    ChangeSetName?: ChangeSetNameOrId;
    /**
     * For templates that include transforms, the stage of the template that CloudFormation returns. To get the user-submitted template, specify Original. To get the template after CloudFormation has processed all transforms, specify Processed. If the template doesn't include transforms, Original and Processed return the same template. By default, CloudFormation specifies Processed.
     */
    TemplateStage?: TemplateStage;
  }
  export interface GetTemplateOutput {
    /**
     * Structure containing the template body. (For more information, go to Template Anatomy in the CloudFormation User Guide.) CloudFormation returns the same template that was used when the stack was created.
     */
    TemplateBody?: TemplateBody;
    /**
     * The stage of the template that you can retrieve. For stacks, the Original and Processed templates are always available. For change sets, the Original template is always available. After CloudFormation finishes creating the change set, the Processed template becomes available.
     */
    StagesAvailable?: StageList;
  }
  export interface GetTemplateSummaryInput {
    /**
     * Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes. For more information about templates, see Template anatomy in the CloudFormation User Guide. Conditional: You must specify only one of the following parameters: StackName, StackSetName, TemplateBody, or TemplateURL.
     */
    TemplateBody?: TemplateBody;
    /**
     * Location of file containing the template body. The URL must point to a template (max size: 460,800 bytes) that's located in an Amazon S3 bucket or a Systems Manager document. For more information about templates, see Template anatomy in the CloudFormation User Guide. Conditional: You must specify only one of the following parameters: StackName, StackSetName, TemplateBody, or TemplateURL.
     */
    TemplateURL?: TemplateURL;
    /**
     * The name or the stack ID that's associated with the stack, which aren't always interchangeable. For running stacks, you can specify either the stack's name or its unique stack ID. For deleted stack, you must specify the unique stack ID. Conditional: You must specify only one of the following parameters: StackName, StackSetName, TemplateBody, or TemplateURL.
     */
    StackName?: StackNameOrId;
    /**
     * The name or unique ID of the stack set from which the stack was created. Conditional: You must specify only one of the following parameters: StackName, StackSetName, TemplateBody, or TemplateURL.
     */
    StackSetName?: StackSetNameOrId;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
    /**
     * Specifies options for the GetTemplateSummary API action.
     */
    TemplateSummaryConfig?: TemplateSummaryConfig;
  }
  export interface GetTemplateSummaryOutput {
    /**
     * A list of parameter declarations that describe various properties for each parameter.
     */
    Parameters?: ParameterDeclarations;
    /**
     * The value that's defined in the Description property of the template.
     */
    Description?: Description;
    /**
     * The capabilities found within the template. If your template contains IAM resources, you must specify the CAPABILITY_IAM or CAPABILITY_NAMED_IAM value for this parameter when you use the CreateStack or UpdateStack actions with your template; otherwise, those actions return an InsufficientCapabilities error. For more information, see Acknowledging IAM Resources in CloudFormation Templates.
     */
    Capabilities?: Capabilities;
    /**
     * The list of resources that generated the values in the Capabilities response element.
     */
    CapabilitiesReason?: CapabilitiesReason;
    /**
     * A list of all the template resource types that are defined in the template, such as AWS::EC2::Instance, AWS::Dynamo::Table, and Custom::MyCustomInstance.
     */
    ResourceTypes?: ResourceTypes;
    /**
     * The Amazon Web Services template format version, which identifies the capabilities of the template.
     */
    Version?: Version;
    /**
     * The value that's defined for the Metadata property of the template.
     */
    Metadata?: Metadata;
    /**
     * A list of the transforms that are declared in the template.
     */
    DeclaredTransforms?: TransformsList;
    /**
     * A list of resource identifier summaries that describe the target resources of an import operation and the properties you can provide during the import to identify the target resources. For example, BucketName is a possible identifier property for an AWS::S3::Bucket resource.
     */
    ResourceIdentifierSummaries?: ResourceIdentifierSummaries;
    /**
     * An object containing any warnings returned.
     */
    Warnings?: Warnings;
  }
  export type HandlerErrorCode = "NotUpdatable"|"InvalidRequest"|"AccessDenied"|"InvalidCredentials"|"AlreadyExists"|"NotFound"|"ResourceConflict"|"Throttling"|"ServiceLimitExceeded"|"NotStabilized"|"GeneralServiceException"|"ServiceInternalError"|"NetworkFailure"|"InternalFailure"|"InvalidTypeConfiguration"|"HandlerInternalFailure"|"NonCompliant"|"Unknown"|"UnsupportedTarget"|string;
  export type HookFailureMode = "FAIL"|"WARN"|string;
  export type HookInvocationCount = number;
  export type HookInvocationPoint = "PRE_PROVISION"|string;
  export type HookStatus = "HOOK_IN_PROGRESS"|"HOOK_COMPLETE_SUCCEEDED"|"HOOK_COMPLETE_FAILED"|"HOOK_FAILED"|string;
  export type HookStatusReason = string;
  export type HookTargetType = "RESOURCE"|string;
  export type HookTargetTypeName = string;
  export type HookType = string;
  export type HookTypeConfigurationVersionId = string;
  export type HookTypeName = string;
  export type HookTypeVersionId = string;
  export type IdentityProvider = "AWS_Marketplace"|"GitHub"|"Bitbucket"|string;
  export interface ImportStacksToStackSetInput {
    /**
     * The name of the stack set. The name must be unique in the Region where you create your stack set.
     */
    StackSetName: StackSetNameOrId;
    /**
     * The IDs of the stacks you are importing into a stack set. You import up to 10 stacks per stack set at a time. Specify either StackIds or StackIdsUrl.
     */
    StackIds?: StackIdList;
    /**
     * The Amazon S3 URL which contains list of stack ids to be inputted. Specify either StackIds or StackIdsUrl.
     */
    StackIdsUrl?: StackIdsUrl;
    /**
     * The list of OU ID's to which the stacks being imported has to be mapped as deployment target.
     */
    OrganizationalUnitIds?: OrganizationalUnitIdList;
    /**
     * The user-specified preferences for how CloudFormation performs a stack set operation. For more information about maximum concurrent accounts and failure tolerance, see Stack set operation options.
     */
    OperationPreferences?: StackSetOperationPreferences;
    /**
     * A unique, user defined, identifier for the stack set operation.
     */
    OperationId?: ClientRequestToken;
    /**
     * By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   For service managed stack sets, specify DELEGATED_ADMIN.  
     */
    CallAs?: CallAs;
  }
  export interface ImportStacksToStackSetOutput {
    /**
     * The unique identifier for the stack set operation.
     */
    OperationId?: ClientRequestToken;
  }
  export type Imports = StackName[];
  export type InProgressStackInstancesCount = number;
  export type InSyncStackInstancesCount = number;
  export type IncludeNestedStacks = boolean;
  export type IsActivated = boolean;
  export type IsDefaultConfiguration = boolean;
  export type IsDefaultVersion = boolean;
  export type Key = string;
  export type LastUpdatedTime = Date;
  export type LimitName = string;
  export type LimitValue = number;
  export interface ListChangeSetsInput {
    /**
     * The name or the Amazon Resource Name (ARN) of the stack for which you want to list change sets.
     */
    StackName: StackNameOrId;
    /**
     * A string (provided by the ListChangeSets response output) that identifies the next page of change sets that you want to retrieve.
     */
    NextToken?: NextToken;
  }
  export interface ListChangeSetsOutput {
    /**
     * A list of ChangeSetSummary structures that provides the ID and status of each change set for the specified stack.
     */
    Summaries?: ChangeSetSummaries;
    /**
     * If the output exceeds 1 MB, a string that identifies the next page of change sets. If there is no additional page, this value is null.
     */
    NextToken?: NextToken;
  }
  export interface ListExportsInput {
    /**
     * A string (provided by the ListExports response output) that identifies the next page of exported output values that you asked to retrieve.
     */
    NextToken?: NextToken;
  }
  export interface ListExportsOutput {
    /**
     * The output for the ListExports action.
     */
    Exports?: Exports;
    /**
     * If the output exceeds 100 exported output values, a string that identifies the next page of exports. If there is no additional page, this value is null.
     */
    NextToken?: NextToken;
  }
  export interface ListImportsInput {
    /**
     * The name of the exported output value. CloudFormation returns the stack names that are importing this value.
     */
    ExportName: ExportName;
    /**
     * A string (provided by the ListImports response output) that identifies the next page of stacks that are importing the specified exported output value.
     */
    NextToken?: NextToken;
  }
  export interface ListImportsOutput {
    /**
     * A list of stack names that are importing the specified exported output value.
     */
    Imports?: Imports;
    /**
     * A string that identifies the next page of exports. If there is no additional page, this value is null.
     */
    NextToken?: NextToken;
  }
  export interface ListStackInstanceResourceDriftsInput {
    /**
     * The name or unique ID of the stack set that you want to list drifted resources for.
     */
    StackSetName: StackSetNameOrId;
    /**
     * If the previous paginated request didn't return all of the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * The resource drift status of the stack instance.     DELETED: The resource differs from its expected template configuration in that the resource has been deleted.    MODIFIED: One or more resource properties differ from their expected template values.    IN_SYNC: The resource's actual configuration matches its expected template configuration.    NOT_CHECKED: CloudFormation doesn't currently return this value.  
     */
    StackInstanceResourceDriftStatuses?: StackResourceDriftStatusFilters;
    /**
     * The name of the Amazon Web Services account that you want to list resource drifts for.
     */
    StackInstanceAccount: Account;
    /**
     * The name of the Region where you want to list resource drifts.
     */
    StackInstanceRegion: Region;
    /**
     * The unique ID of the drift operation.
     */
    OperationId: ClientRequestToken;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface ListStackInstanceResourceDriftsOutput {
    /**
     * A list of StackInstanceResourceDriftSummary structures that contain information about the specified stack instances.
     */
    Summaries?: StackInstanceResourceDriftsSummaries;
    /**
     * If the previous paginated request didn't return all of the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: NextToken;
  }
  export interface ListStackInstancesInput {
    /**
     * The name or unique ID of the stack set that you want to list stack instances for.
     */
    StackSetName: StackSetName;
    /**
     * If the previous request didn't return all the remaining results, the response's NextToken parameter value is set to a token. To retrieve the next set of results, call ListStackInstances again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * The filter to apply to stack instances
     */
    Filters?: StackInstanceFilters;
    /**
     * The name of the Amazon Web Services account that you want to list stack instances for.
     */
    StackInstanceAccount?: Account;
    /**
     * The name of the Region where you want to list stack instances.
     */
    StackInstanceRegion?: Region;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface ListStackInstancesOutput {
    /**
     * A list of StackInstanceSummary structures that contain information about the specified stack instances.
     */
    Summaries?: StackInstanceSummaries;
    /**
     * If the request doesn't return all the remaining results, NextToken is set to a token. To retrieve the next set of results, call ListStackInstances again and assign that token to the request object's NextToken parameter. If the request returns all results, NextToken is set to null.
     */
    NextToken?: NextToken;
  }
  export interface ListStackResourcesInput {
    /**
     * The name or the unique stack ID that is associated with the stack, which aren't always interchangeable:   Running stacks: You can specify either the stack's name or its unique stack ID.   Deleted stacks: You must specify the unique stack ID.   Default: There is no default value.
     */
    StackName: StackName;
    /**
     * A string that identifies the next page of stack resources that you want to retrieve.
     */
    NextToken?: NextToken;
  }
  export interface ListStackResourcesOutput {
    /**
     * A list of StackResourceSummary structures.
     */
    StackResourceSummaries?: StackResourceSummaries;
    /**
     * If the output exceeds 1 MB, a string that identifies the next page of stack resources. If no additional page exists, this value is null.
     */
    NextToken?: NextToken;
  }
  export interface ListStackSetOperationResultsInput {
    /**
     * The name or unique ID of the stack set that you want to get operation results for.
     */
    StackSetName: StackSetName;
    /**
     * The ID of the stack set operation.
     */
    OperationId: ClientRequestToken;
    /**
     * If the previous request didn't return all the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call ListStackSetOperationResults again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
    /**
     * The filter to apply to operation results.
     */
    Filters?: OperationResultFilters;
  }
  export interface ListStackSetOperationResultsOutput {
    /**
     * A list of StackSetOperationResultSummary structures that contain information about the specified operation results, for accounts and Amazon Web Services Regions that are included in the operation.
     */
    Summaries?: StackSetOperationResultSummaries;
    /**
     * If the request doesn't return all results, NextToken is set to a token. To retrieve the next set of results, call ListOperationResults again and assign that token to the request object's NextToken parameter. If there are no remaining results, NextToken is set to null.
     */
    NextToken?: NextToken;
  }
  export interface ListStackSetOperationsInput {
    /**
     * The name or unique ID of the stack set that you want to get operation summaries for.
     */
    StackSetName: StackSetName;
    /**
     * If the previous paginated request didn't return all of the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call ListStackSetOperations again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface ListStackSetOperationsOutput {
    /**
     * A list of StackSetOperationSummary structures that contain summary information about operations for the specified stack set.
     */
    Summaries?: StackSetOperationSummaries;
    /**
     * If the request doesn't return all results, NextToken is set to a token. To retrieve the next set of results, call ListOperationResults again and assign that token to the request object's NextToken parameter. If there are no remaining results, NextToken is set to null.
     */
    NextToken?: NextToken;
  }
  export interface ListStackSetsInput {
    /**
     * If the previous paginated request didn't return all the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call ListStackSets again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * The status of the stack sets that you want to get summary information about.
     */
    Status?: StackSetStatus;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface ListStackSetsOutput {
    /**
     * A list of StackSetSummary structures that contain information about the user's stack sets.
     */
    Summaries?: StackSetSummaries;
    /**
     * If the request doesn't return all of the remaining results, NextToken is set to a token. To retrieve the next set of results, call ListStackInstances again and assign that token to the request object's NextToken parameter. If the request returns all results, NextToken is set to null.
     */
    NextToken?: NextToken;
  }
  export interface ListStacksInput {
    /**
     * A string that identifies the next page of stacks that you want to retrieve.
     */
    NextToken?: NextToken;
    /**
     * Stack status to use as a filter. Specify one or more stack status codes to list only stacks with the specified status codes. For a complete list of stack status codes, see the StackStatus parameter of the Stack data type.
     */
    StackStatusFilter?: StackStatusFilter;
  }
  export interface ListStacksOutput {
    /**
     * A list of StackSummary structures containing information about the specified stacks.
     */
    StackSummaries?: StackSummaries;
    /**
     * If the output exceeds 1 MB in size, a string that identifies the next page of stacks. If no additional page exists, this value is null.
     */
    NextToken?: NextToken;
  }
  export interface ListTypeRegistrationsInput {
    /**
     * The kind of extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    Type?: RegistryType;
    /**
     * The name of the extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    TypeName?: TypeName;
    /**
     * The Amazon Resource Name (ARN) of the extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    TypeArn?: TypeArn;
    /**
     * The current status of the extension registration request. The default is IN_PROGRESS.
     */
    RegistrationStatusFilter?: RegistrationStatus;
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous paginated request didn't return all the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: NextToken;
  }
  export interface ListTypeRegistrationsOutput {
    /**
     * A list of extension registration tokens. Use DescribeTypeRegistration to return detailed information about a type registration request.
     */
    RegistrationTokenList?: RegistrationTokenList;
    /**
     * If the request doesn't return all the remaining results, NextToken is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If the request returns all results, NextToken is set to null.
     */
    NextToken?: NextToken;
  }
  export interface ListTypeVersionsInput {
    /**
     * The kind of the extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    Type?: RegistryType;
    /**
     * The name of the extension for which you want version summary information. Conditional: You must specify either TypeName and Type, or Arn.
     */
    TypeName?: TypeName;
    /**
     * The Amazon Resource Name (ARN) of the extension for which you want version summary information. Conditional: You must specify either TypeName and Type, or Arn.
     */
    Arn?: TypeArn;
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous paginated request didn't return all of the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: NextToken;
    /**
     * The deprecation status of the extension versions that you want to get summary information about. Valid values include:    LIVE: The extension version is registered and can be used in CloudFormation operations, dependent on its provisioning behavior and visibility scope.    DEPRECATED: The extension version has been deregistered and can no longer be used in CloudFormation operations.   The default is LIVE.
     */
    DeprecatedStatus?: DeprecatedStatus;
    /**
     * The publisher ID of the extension publisher. Extensions published by Amazon aren't assigned a publisher ID.
     */
    PublisherId?: PublisherId;
  }
  export interface ListTypeVersionsOutput {
    /**
     * A list of TypeVersionSummary structures that contain information about the specified extension's versions.
     */
    TypeVersionSummaries?: TypeVersionSummaries;
    /**
     * If the request doesn't return all of the remaining results, NextToken is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If the request returns all results, NextToken is set to null.
     */
    NextToken?: NextToken;
  }
  export interface ListTypesInput {
    /**
     * The scope at which the extensions are visible and usable in CloudFormation operations. Valid values include:    PRIVATE: Extensions that are visible and usable within this account and Region. This includes:   Private extensions you have registered in this account and Region.   Public extensions that you have activated in this account and Region.      PUBLIC: Extensions that are publicly visible and available to be activated within any Amazon Web Services account. This includes extensions from Amazon Web Services, in addition to third-party publishers.   The default is PRIVATE.
     */
    Visibility?: Visibility;
    /**
     * For resource types, the provisioning behavior of the resource type. CloudFormation determines the provisioning type during registration, based on the types of handlers in the schema handler package submitted. Valid values include:    FULLY_MUTABLE: The resource type includes an update handler to process updates to the type during stack update operations.    IMMUTABLE: The resource type doesn't include an update handler, so the type can't be updated and must instead be replaced during stack update operations.    NON_PROVISIONABLE: The resource type doesn't include create, read, and delete handlers, and therefore can't actually be provisioned.   The default is FULLY_MUTABLE.
     */
    ProvisioningType?: ProvisioningType;
    /**
     * The deprecation status of the extension that you want to get summary information about. Valid values include:    LIVE: The extension is registered for use in CloudFormation operations.    DEPRECATED: The extension has been deregistered and can no longer be used in CloudFormation operations.  
     */
    DeprecatedStatus?: DeprecatedStatus;
    /**
     * The type of extension.
     */
    Type?: RegistryType;
    /**
     * Filter criteria to use in determining which extensions to return. Filters must be compatible with Visibility to return valid results. For example, specifying AWS_TYPES for Category and PRIVATE for Visibility returns an empty list of types, but specifying PUBLIC for Visibility returns the desired list.
     */
    Filters?: TypeFilters;
    /**
     * The maximum number of results to be returned with a single call. If the number of available results exceeds this maximum, the response includes a NextToken value that you can assign to the NextToken request parameter to get the next set of results.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous paginated request didn't return all the remaining results, the response object's NextToken parameter value is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If there are no remaining results, the previous response object's NextToken parameter is set to null.
     */
    NextToken?: NextToken;
  }
  export interface ListTypesOutput {
    /**
     * A list of TypeSummary structures that contain information about the specified extensions.
     */
    TypeSummaries?: TypeSummaries;
    /**
     * If the request doesn't return all the remaining results, NextToken is set to a token. To retrieve the next set of results, call this action again and assign that token to the request object's NextToken parameter. If the request returns all results, NextToken is set to null.
     */
    NextToken?: NextToken;
  }
  export type LogGroupName = string;
  export interface LoggingConfig {
    /**
     * The Amazon Resource Name (ARN) of the role that CloudFormation should assume when sending log entries to CloudWatch Logs.
     */
    LogRoleArn: RoleArn;
    /**
     * The Amazon CloudWatch Logs group to which CloudFormation sends error logging information when invoking the extension's handlers.
     */
    LogGroupName: LogGroupName;
  }
  export type LogicalIdHierarchy = string;
  export type LogicalResourceId = string;
  export type LogicalResourceIds = LogicalResourceId[];
  export type MajorVersion = number;
  export interface ManagedExecution {
    /**
     * When true, StackSets performs non-conflicting operations concurrently and queues conflicting operations. After conflicting operations finish, StackSets starts queued operations in request order.  If there are already running or queued operations, StackSets queues all incoming operations even if they are non-conflicting. You can't modify your stack set's execution configuration while there are running or queued operations for that stack set.  When false (default), StackSets performs one operation at a time in request order.
     */
    Active?: ManagedExecutionNullable;
  }
  export type ManagedExecutionNullable = boolean;
  export type MaxConcurrentCount = number;
  export type MaxConcurrentPercentage = number;
  export type MaxResults = number;
  export type Metadata = string;
  export interface ModuleInfo {
    /**
     * A concatenated list of the module type or types containing the resource. Module types are listed starting with the inner-most nested module, and separated by /. In the following example, the resource was created from a module of type AWS::First::Example::MODULE, that's nested inside a parent module of type AWS::Second::Example::MODULE.  AWS::First::Example::MODULE/AWS::Second::Example::MODULE 
     */
    TypeHierarchy?: TypeHierarchy;
    /**
     * A concatenated list of the logical IDs of the module or modules containing the resource. Modules are listed starting with the inner-most nested module, and separated by /. In the following example, the resource was created from a module, moduleA, that's nested inside a parent module, moduleB.  moduleA/moduleB  For more information, see Referencing resources in a module in the CloudFormation User Guide.
     */
    LogicalIdHierarchy?: LogicalIdHierarchy;
  }
  export type MonitoringTimeInMinutes = number;
  export type NextToken = string;
  export type NoEcho = boolean;
  export type NotificationARN = string;
  export type NotificationARNs = NotificationARN[];
  export type OnFailure = "DO_NOTHING"|"ROLLBACK"|"DELETE"|string;
  export type OnStackFailure = "DO_NOTHING"|"ROLLBACK"|"DELETE"|string;
  export interface OperationResultFilter {
    /**
     * The type of filter to apply.
     */
    Name?: OperationResultFilterName;
    /**
     * The value to filter by.
     */
    Values?: OperationResultFilterValues;
  }
  export type OperationResultFilterName = "OPERATION_RESULT_STATUS"|string;
  export type OperationResultFilterValues = string;
  export type OperationResultFilters = OperationResultFilter[];
  export type OperationStatus = "PENDING"|"IN_PROGRESS"|"SUCCESS"|"FAILED"|string;
  export type OptionalSecureUrl = string;
  export type OrganizationStatus = "ENABLED"|"DISABLED"|"DISABLED_PERMANENTLY"|string;
  export type OrganizationalUnitId = string;
  export type OrganizationalUnitIdList = OrganizationalUnitId[];
  export interface Output {
    /**
     * The key associated with the output.
     */
    OutputKey?: OutputKey;
    /**
     * The value associated with the output.
     */
    OutputValue?: OutputValue;
    /**
     * User defined description associated with the output.
     */
    Description?: Description;
    /**
     * The name of the export associated with the output.
     */
    ExportName?: ExportName;
  }
  export type OutputKey = string;
  export type OutputValue = string;
  export type Outputs = Output[];
  export interface Parameter {
    /**
     * The key associated with the parameter. If you don't specify a key and value for a particular parameter, CloudFormation uses the default value that's specified in your template.
     */
    ParameterKey?: ParameterKey;
    /**
     * The input value associated with the parameter.
     */
    ParameterValue?: ParameterValue;
    /**
     * During a stack update, use the existing parameter value that the stack is using for a given parameter key. If you specify true, do not specify a parameter value.
     */
    UsePreviousValue?: UsePreviousValue;
    /**
     * Read-only. The value that corresponds to a SSM parameter key. This field is returned only for  SSM parameter types in the template.
     */
    ResolvedValue?: ParameterValue;
  }
  export interface ParameterConstraints {
    /**
     * A list of values that are permitted for a parameter.
     */
    AllowedValues?: AllowedValues;
  }
  export interface ParameterDeclaration {
    /**
     * The name that's associated with the parameter.
     */
    ParameterKey?: ParameterKey;
    /**
     * The default value of the parameter.
     */
    DefaultValue?: ParameterValue;
    /**
     * The type of parameter.
     */
    ParameterType?: ParameterType;
    /**
     * Flag that indicates whether the parameter value is shown as plain text in logs and in the Amazon Web Services Management Console.
     */
    NoEcho?: NoEcho;
    /**
     * The description that's associate with the parameter.
     */
    Description?: Description;
    /**
     * The criteria that CloudFormation uses to validate parameter values.
     */
    ParameterConstraints?: ParameterConstraints;
  }
  export type ParameterDeclarations = ParameterDeclaration[];
  export type ParameterKey = string;
  export type ParameterType = string;
  export type ParameterValue = string;
  export type Parameters = Parameter[];
  export type PermissionModels = "SERVICE_MANAGED"|"SELF_MANAGED"|string;
  export type PhysicalResourceId = string;
  export type PhysicalResourceIdContext = PhysicalResourceIdContextKeyValuePair[];
  export interface PhysicalResourceIdContextKeyValuePair {
    /**
     * The resource context key.
     */
    Key: Key;
    /**
     * The resource context value.
     */
    Value: Value;
  }
  export type PrivateTypeArn = string;
  export type Properties = string;
  export interface PropertyDifference {
    /**
     * The fully-qualified path to the resource property.
     */
    PropertyPath: PropertyPath;
    /**
     * The expected property value of the resource property, as defined in the stack template and any values specified as template parameters.
     */
    ExpectedValue: PropertyValue;
    /**
     * The actual property value of the resource property.
     */
    ActualValue: PropertyValue;
    /**
     * The type of property difference.    ADD: A value has been added to a resource property that's an array or list data type.    REMOVE: The property has been removed from the current resource configuration.    NOT_EQUAL: The current property value differs from its expected value (as defined in the stack template and any values specified as template parameters).  
     */
    DifferenceType: DifferenceType;
  }
  export type PropertyDifferences = PropertyDifference[];
  export type PropertyName = string;
  export type PropertyPath = string;
  export type PropertyValue = string;
  export type ProvisioningType = "NON_PROVISIONABLE"|"IMMUTABLE"|"FULLY_MUTABLE"|string;
  export type PublicVersionNumber = string;
  export interface PublishTypeInput {
    /**
     * The type of the extension. Conditional: You must specify Arn, or TypeName and Type.
     */
    Type?: ThirdPartyType;
    /**
     * The Amazon Resource Name (ARN) of the extension. Conditional: You must specify Arn, or TypeName and Type.
     */
    Arn?: PrivateTypeArn;
    /**
     * The name of the extension. Conditional: You must specify Arn, or TypeName and Type.
     */
    TypeName?: TypeName;
    /**
     * The version number to assign to this version of the extension. Use the following format, and adhere to semantic versioning when assigning a version number to your extension:  MAJOR.MINOR.PATCH  For more information, see Semantic Versioning 2.0.0. If you don't specify a version number, CloudFormation increments the version number by one minor version release. You cannot specify a version number the first time you publish a type. CloudFormation automatically sets the first version number to be 1.0.0.
     */
    PublicVersionNumber?: PublicVersionNumber;
  }
  export interface PublishTypeOutput {
    /**
     * The Amazon Resource Name (ARN) assigned to the public extension upon publication.
     */
    PublicTypeArn?: TypeArn;
  }
  export type PublisherId = string;
  export type PublisherName = string;
  export type PublisherProfile = string;
  export type PublisherStatus = "VERIFIED"|"UNVERIFIED"|string;
  export type Reason = string;
  export interface RecordHandlerProgressInput {
    /**
     * Reserved for use by the CloudFormation CLI.
     */
    BearerToken: ClientToken;
    /**
     * Reserved for use by the CloudFormation CLI.
     */
    OperationStatus: OperationStatus;
    /**
     * Reserved for use by the CloudFormation CLI.
     */
    CurrentOperationStatus?: OperationStatus;
    /**
     * Reserved for use by the CloudFormation CLI.
     */
    StatusMessage?: StatusMessage;
    /**
     * Reserved for use by the CloudFormation CLI.
     */
    ErrorCode?: HandlerErrorCode;
    /**
     * Reserved for use by the CloudFormation CLI.
     */
    ResourceModel?: ResourceModel;
    /**
     * Reserved for use by the CloudFormation CLI.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface RecordHandlerProgressOutput {
  }
  export type Region = string;
  export type RegionConcurrencyType = "SEQUENTIAL"|"PARALLEL"|string;
  export type RegionList = Region[];
  export interface RegisterPublisherInput {
    /**
     * Whether you accept the Terms and Conditions for publishing extensions in the CloudFormation registry. You must accept the terms and conditions in order to register to publish public extensions to the CloudFormation registry. The default is false.
     */
    AcceptTermsAndConditions?: AcceptTermsAndConditions;
    /**
     * If you are using a Bitbucket or GitHub account for identity verification, the Amazon Resource Name (ARN) for your connection to that account. For more information, see Registering your account to publish CloudFormation extensions in the CloudFormation CLI User Guide.
     */
    ConnectionArn?: ConnectionArn;
  }
  export interface RegisterPublisherOutput {
    /**
     * The ID assigned this account by CloudFormation for publishing extensions.
     */
    PublisherId?: PublisherId;
  }
  export interface RegisterTypeInput {
    /**
     * The kind of extension.
     */
    Type?: RegistryType;
    /**
     * The name of the extension being registered. We suggest that extension names adhere to the following patterns:   For resource types, company_or_organization::service::type.   For modules, company_or_organization::service::type::MODULE.   For hooks, MyCompany::Testing::MyTestHook.    The following organization namespaces are reserved and can't be used in your extension names:    Alexa     AMZN     Amazon     AWS     Custom     Dev    
     */
    TypeName: TypeName;
    /**
     * A URL to the S3 bucket containing the extension project package that contains the necessary files for the extension you want to register. For information about generating a schema handler package for the extension you want to register, see submit in the CloudFormation CLI User Guide.  The user registering the extension must be able to access the package in the S3 bucket. That's, the user needs to have GetObject permissions for the schema handler package. For more information, see Actions, Resources, and Condition Keys for Amazon S3 in the Identity and Access Management User Guide. 
     */
    SchemaHandlerPackage: S3Url;
    /**
     * Specifies logging configuration information for an extension.
     */
    LoggingConfig?: LoggingConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role for CloudFormation to assume when invoking the extension. For CloudFormation to assume the specified execution role, the role must contain a trust relationship with the CloudFormation service principle (resources.cloudformation.amazonaws.com). For more information about adding trust relationships, see Modifying a role trust policy in the Identity and Access Management User Guide. If your extension calls Amazon Web Services APIs in any of its handlers, you must create an  IAM execution role  that includes the necessary permissions to call those Amazon Web Services APIs, and provision that execution role in your account. When CloudFormation needs to invoke the resource type handler, CloudFormation assumes this execution role to create a temporary session token, which it then passes to the resource type handler, thereby supplying your resource type with the appropriate credentials.
     */
    ExecutionRoleArn?: RoleArn;
    /**
     * A unique identifier that acts as an idempotency key for this registration request. Specifying a client request token prevents CloudFormation from generating more than one version of an extension from the same registration request, even if the request is submitted multiple times.
     */
    ClientRequestToken?: RequestToken;
  }
  export interface RegisterTypeOutput {
    /**
     * The identifier for this registration request. Use this registration token when calling DescribeTypeRegistration, which returns information about the status and IDs of the extension registration.
     */
    RegistrationToken?: RegistrationToken;
  }
  export type RegistrationStatus = "COMPLETE"|"IN_PROGRESS"|"FAILED"|string;
  export type RegistrationToken = string;
  export type RegistrationTokenList = RegistrationToken[];
  export type RegistryType = "RESOURCE"|"MODULE"|"HOOK"|string;
  export type Replacement = "True"|"False"|"Conditional"|string;
  export type RequestToken = string;
  export interface RequiredActivatedType {
    /**
     * An alias assigned to the public extension, in this account and Region. If you specify an alias for the extension, CloudFormation treats the alias as the extension type name within this account and Region. You must use the alias to refer to the extension in your templates, API calls, and CloudFormation console.
     */
    TypeNameAlias?: TypeName;
    /**
     * The type name of the public extension. If you specified a TypeNameAlias when enabling the extension in this account and Region, CloudFormation treats that alias as the extension's type name within the account and Region, not the type name of the public extension. For more information, see Specifying aliases to refer to extensions in the CloudFormation User Guide.
     */
    OriginalTypeName?: TypeName;
    /**
     * The publisher ID of the extension publisher.
     */
    PublisherId?: PublisherId;
    /**
     * A list of the major versions of the extension type that the macro supports.
     */
    SupportedMajorVersions?: SupportedMajorVersions;
  }
  export type RequiredActivatedTypes = RequiredActivatedType[];
  export type RequiresRecreation = "Never"|"Conditionally"|"Always"|string;
  export type ResourceAttribute = "Properties"|"Metadata"|"CreationPolicy"|"UpdatePolicy"|"DeletionPolicy"|"Tags"|string;
  export interface ResourceChange {
    /**
     * The action that CloudFormation takes on the resource, such as Add (adds a new resource), Modify (changes a resource), Remove (deletes a resource), Import (imports a resource), or Dynamic (exact action for the resource can't be determined).
     */
    Action?: ChangeAction;
    /**
     * The resource's logical ID, which is defined in the stack's template.
     */
    LogicalResourceId?: LogicalResourceId;
    /**
     * The resource's physical ID (resource name). Resources that you are adding don't have physical IDs because they haven't been created.
     */
    PhysicalResourceId?: PhysicalResourceId;
    /**
     * The type of CloudFormation resource, such as AWS::S3::Bucket.
     */
    ResourceType?: ResourceType;
    /**
     * For the Modify action, indicates whether CloudFormation will replace the resource by creating a new one and deleting the old one. This value depends on the value of the RequiresRecreation property in the ResourceTargetDefinition structure. For example, if the RequiresRecreation field is Always and the Evaluation field is Static, Replacement is True. If the RequiresRecreation field is Always and the Evaluation field is Dynamic, Replacement is Conditionally. If you have multiple changes with different RequiresRecreation values, the Replacement value depends on the change with the most impact. A RequiresRecreation value of Always has the most impact, followed by Conditionally, and then Never.
     */
    Replacement?: Replacement;
    /**
     * For the Modify action, indicates which resource attribute is triggering this update, such as a change in the resource attribute's Metadata, Properties, or Tags.
     */
    Scope?: Scope;
    /**
     * For the Modify action, a list of ResourceChangeDetail structures that describes the changes that CloudFormation will make to the resource.
     */
    Details?: ResourceChangeDetails;
    /**
     * The change set ID of the nested change set.
     */
    ChangeSetId?: ChangeSetId;
    /**
     * Contains information about the module from which the resource was created, if the resource was created from a module included in the stack template.
     */
    ModuleInfo?: ModuleInfo;
  }
  export interface ResourceChangeDetail {
    /**
     * A ResourceTargetDefinition structure that describes the field that CloudFormation will change and whether the resource will be recreated.
     */
    Target?: ResourceTargetDefinition;
    /**
     * Indicates whether CloudFormation can determine the target value, and whether the target value will change before you execute a change set. For Static evaluations, CloudFormation can determine that the target value will change, and its value. For example, if you directly modify the InstanceType property of an EC2 instance, CloudFormation knows that this property value will change, and its value, so this is a Static evaluation. For Dynamic evaluations, can't determine the target value because it depends on the result of an intrinsic function, such as a Ref or Fn::GetAtt intrinsic function, when the stack is updated. For example, if your template includes a reference to a resource that's conditionally recreated, the value of the reference (the physical ID of the resource) might change, depending on if the resource is recreated. If the resource is recreated, it will have a new physical ID, so all references to that resource will also be updated.
     */
    Evaluation?: EvaluationType;
    /**
     * The group to which the CausingEntity value belongs. There are five entity groups:    ResourceReference entities are Ref intrinsic functions that refer to resources in the template, such as { "Ref" : "MyEC2InstanceResource" }.    ParameterReference entities are Ref intrinsic functions that get template parameter values, such as { "Ref" : "MyPasswordParameter" }.    ResourceAttribute entities are Fn::GetAtt intrinsic functions that get resource attribute values, such as { "Fn::GetAtt" : [ "MyEC2InstanceResource", "PublicDnsName" ] }.    DirectModification entities are changes that are made directly to the template.    Automatic entities are AWS::CloudFormation::Stack resource types, which are also known as nested stacks. If you made no changes to the AWS::CloudFormation::Stack resource, CloudFormation sets the ChangeSource to Automatic because the nested stack's template might have changed. Changes to a nested stack's template aren't visible to CloudFormation until you run an update on the parent stack.  
     */
    ChangeSource?: ChangeSource;
    /**
     * The identity of the entity that triggered this change. This entity is a member of the group that's specified by the ChangeSource field. For example, if you modified the value of the KeyPairName parameter, the CausingEntity is the name of the parameter (KeyPairName). If the ChangeSource value is DirectModification, no value is given for CausingEntity.
     */
    CausingEntity?: CausingEntity;
  }
  export type ResourceChangeDetails = ResourceChangeDetail[];
  export type ResourceIdentifierProperties = {[key: string]: ResourceIdentifierPropertyValue};
  export type ResourceIdentifierPropertyKey = string;
  export type ResourceIdentifierPropertyValue = string;
  export type ResourceIdentifierSummaries = ResourceIdentifierSummary[];
  export interface ResourceIdentifierSummary {
    /**
     * The template resource type of the target resources, such as AWS::S3::Bucket.
     */
    ResourceType?: ResourceType;
    /**
     * The logical IDs of the target resources of the specified ResourceType, as defined in the import template.
     */
    LogicalResourceIds?: LogicalResourceIds;
    /**
     * The resource properties you can provide during the import to identify your target resources. For example, BucketName is a possible identifier property for AWS::S3::Bucket resources.
     */
    ResourceIdentifiers?: ResourceIdentifiers;
  }
  export type ResourceIdentifiers = ResourceIdentifierPropertyKey[];
  export type ResourceModel = string;
  export type ResourceProperties = string;
  export type ResourceSignalStatus = "SUCCESS"|"FAILURE"|string;
  export type ResourceSignalUniqueId = string;
  export type ResourceStatus = "CREATE_IN_PROGRESS"|"CREATE_FAILED"|"CREATE_COMPLETE"|"DELETE_IN_PROGRESS"|"DELETE_FAILED"|"DELETE_COMPLETE"|"DELETE_SKIPPED"|"UPDATE_IN_PROGRESS"|"UPDATE_FAILED"|"UPDATE_COMPLETE"|"IMPORT_FAILED"|"IMPORT_COMPLETE"|"IMPORT_IN_PROGRESS"|"IMPORT_ROLLBACK_IN_PROGRESS"|"IMPORT_ROLLBACK_FAILED"|"IMPORT_ROLLBACK_COMPLETE"|"UPDATE_ROLLBACK_IN_PROGRESS"|"UPDATE_ROLLBACK_COMPLETE"|"UPDATE_ROLLBACK_FAILED"|"ROLLBACK_IN_PROGRESS"|"ROLLBACK_COMPLETE"|"ROLLBACK_FAILED"|string;
  export type ResourceStatusReason = string;
  export interface ResourceTargetDefinition {
    /**
     * Indicates which resource attribute is triggering this update, such as a change in the resource attribute's Metadata, Properties, or Tags.
     */
    Attribute?: ResourceAttribute;
    /**
     * If the Attribute value is Properties, the name of the property. For all other attributes, the value is null.
     */
    Name?: PropertyName;
    /**
     * If the Attribute value is Properties, indicates whether a change to this property causes the resource to be recreated. The value can be Never, Always, or Conditionally. To determine the conditions for a Conditionally recreation, see the update behavior for that property in the CloudFormation User Guide.
     */
    RequiresRecreation?: RequiresRecreation;
  }
  export interface ResourceToImport {
    /**
     * The type of resource to import into your stack, such as AWS::S3::Bucket. For a list of supported resource types, see Resources that support import operations in the CloudFormation User Guide.
     */
    ResourceType: ResourceType;
    /**
     * The logical ID of the target resource as specified in the template.
     */
    LogicalResourceId: LogicalResourceId;
    /**
     * A key-value pair that identifies the target resource. The key is an identifier property (for example, BucketName for AWS::S3::Bucket resources) and the value is the actual property value (for example, MyS3Bucket).
     */
    ResourceIdentifier: ResourceIdentifierProperties;
  }
  export type ResourceToSkip = string;
  export type ResourceType = string;
  export type ResourceTypes = ResourceType[];
  export type ResourcesToImport = ResourceToImport[];
  export type ResourcesToSkip = ResourceToSkip[];
  export type RetainExceptOnCreate = boolean;
  export type RetainResources = LogicalResourceId[];
  export type RetainStacks = boolean;
  export type RetainStacksNullable = boolean;
  export type RetainStacksOnAccountRemovalNullable = boolean;
  export type RoleARN = string;
  export type RoleArn = string;
  export interface RollbackConfiguration {
    /**
     * The triggers to monitor during stack creation or update actions. By default, CloudFormation saves the rollback triggers specified for a stack and applies them to any subsequent update operations for the stack, unless you specify otherwise. If you do specify rollback triggers for this parameter, those triggers replace any list of triggers previously specified for the stack. This means:   To use the rollback triggers previously specified for this stack, if any, don't specify this parameter.   To specify new or updated rollback triggers, you must specify all the triggers that you want used for this stack, even triggers you've specified before (for example, when creating the stack or during a previous stack update). Any triggers that you don't include in the updated list of triggers are no longer applied to the stack.   To remove all currently specified triggers, specify an empty list for this parameter.   If a specified trigger is missing, the entire stack operation fails and is rolled back.
     */
    RollbackTriggers?: RollbackTriggers;
    /**
     * The amount of time, in minutes, during which CloudFormation should monitor all the rollback triggers after the stack creation or update operation deploys all necessary resources. The default is 0 minutes. If you specify a monitoring period but don't specify any rollback triggers, CloudFormation still waits the specified period of time before cleaning up old resources after update operations. You can use this monitoring period to perform any manual stack validation desired, and manually cancel the stack creation or update (using CancelUpdateStack, for example) as necessary. If you specify 0 for this parameter, CloudFormation still monitors the specified rollback triggers during stack creation and update operations. Then, for update operations, it begins disposing of old resources immediately once the operation completes.
     */
    MonitoringTimeInMinutes?: MonitoringTimeInMinutes;
  }
  export interface RollbackStackInput {
    /**
     * The name that's associated with the stack.
     */
    StackName: StackNameOrId;
    /**
     * The Amazon Resource Name (ARN) of an Identity and Access Management role that CloudFormation assumes to rollback the stack.
     */
    RoleARN?: RoleARN;
    /**
     * A unique identifier for this RollbackStack request.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * When set to true, newly created resources are deleted when the operation rolls back. This includes newly created resources marked with a deletion policy of Retain. Default: false 
     */
    RetainExceptOnCreate?: RetainExceptOnCreate;
  }
  export interface RollbackStackOutput {
    /**
     * Unique identifier of the stack.
     */
    StackId?: StackId;
  }
  export interface RollbackTrigger {
    /**
     * The Amazon Resource Name (ARN) of the rollback trigger. If a specified trigger is missing, the entire stack operation fails and is rolled back.
     */
    Arn: Arn;
    /**
     * The resource type of the rollback trigger. Specify either AWS::CloudWatch::Alarm or AWS::CloudWatch::CompositeAlarm resource types.
     */
    Type: Type;
  }
  export type RollbackTriggers = RollbackTrigger[];
  export type S3Bucket = string;
  export type S3Url = string;
  export type Scope = ResourceAttribute[];
  export interface SetStackPolicyInput {
    /**
     * The name or unique stack ID that you want to associate a policy with.
     */
    StackName: StackName;
    /**
     * Structure containing the stack policy body. For more information, go to  Prevent updates to stack resources in the CloudFormation User Guide. You can specify either the StackPolicyBody or the StackPolicyURL parameter, but not both.
     */
    StackPolicyBody?: StackPolicyBody;
    /**
     * Location of a file containing the stack policy. The URL must point to a policy (maximum size: 16 KB) located in an Amazon S3 bucket in the same Amazon Web Services Region as the stack. You can specify either the StackPolicyBody or the StackPolicyURL parameter, but not both.
     */
    StackPolicyURL?: StackPolicyURL;
  }
  export interface SetTypeConfigurationInput {
    /**
     * The Amazon Resource Name (ARN) for the extension, in this account and Region. For public extensions, this will be the ARN assigned when you activate the type in this account and Region. For private extensions, this will be the ARN assigned when you register the type in this account and Region. Do not include the extension versions suffix at the end of the ARN. You can set the configuration for an extension, but not for a specific extension version.
     */
    TypeArn?: TypeArn;
    /**
     * The configuration data for the extension, in this account and Region. The configuration data must be formatted as JSON, and validate against the schema returned in the ConfigurationSchema response element of DescribeType. For more information, see Defining account-level configuration data for an extension in the CloudFormation CLI User Guide.
     */
    Configuration: TypeConfiguration;
    /**
     * An alias by which to refer to this extension configuration data. Conditional: Specifying a configuration alias is required when setting a configuration for a resource type extension.
     */
    ConfigurationAlias?: TypeConfigurationAlias;
    /**
     * The name of the extension. Conditional: You must specify ConfigurationArn, or Type and TypeName.
     */
    TypeName?: TypeName;
    /**
     * The type of extension. Conditional: You must specify ConfigurationArn, or Type and TypeName.
     */
    Type?: ThirdPartyType;
  }
  export interface SetTypeConfigurationOutput {
    /**
     * The Amazon Resource Name (ARN) for the configuration data, in this account and Region. Conditional: You must specify ConfigurationArn, or Type and TypeName.
     */
    ConfigurationArn?: TypeConfigurationArn;
  }
  export interface SetTypeDefaultVersionInput {
    /**
     * The Amazon Resource Name (ARN) of the extension for which you want version summary information. Conditional: You must specify either TypeName and Type, or Arn.
     */
    Arn?: PrivateTypeArn;
    /**
     * The kind of extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    Type?: RegistryType;
    /**
     * The name of the extension. Conditional: You must specify either TypeName and Type, or Arn.
     */
    TypeName?: TypeName;
    /**
     * The ID of a specific version of the extension. The version ID is the value at the end of the Amazon Resource Name (ARN) assigned to the extension version when it is registered.
     */
    VersionId?: TypeVersionId;
  }
  export interface SetTypeDefaultVersionOutput {
  }
  export interface SignalResourceInput {
    /**
     * The stack name or unique stack ID that includes the resource that you want to signal.
     */
    StackName: StackNameOrId;
    /**
     * The logical ID of the resource that you want to signal. The logical ID is the name of the resource that given in the template.
     */
    LogicalResourceId: LogicalResourceId;
    /**
     * A unique ID of the signal. When you signal Amazon EC2 instances or Auto Scaling groups, specify the instance ID that you are signaling as the unique ID. If you send multiple signals to a single resource (such as signaling a wait condition), each signal requires a different unique ID.
     */
    UniqueId: ResourceSignalUniqueId;
    /**
     * The status of the signal, which is either success or failure. A failure signal causes CloudFormation to immediately fail the stack creation or update.
     */
    Status: ResourceSignalStatus;
  }
  export interface Stack {
    /**
     * Unique identifier of the stack.
     */
    StackId?: StackId;
    /**
     * The name associated with the stack.
     */
    StackName: StackName;
    /**
     * The unique ID of the change set.
     */
    ChangeSetId?: ChangeSetId;
    /**
     * A user-defined description associated with the stack.
     */
    Description?: Description;
    /**
     * A list of Parameter structures.
     */
    Parameters?: Parameters;
    /**
     * The time at which the stack was created.
     */
    CreationTime: CreationTime;
    /**
     * The time the stack was deleted.
     */
    DeletionTime?: DeletionTime;
    /**
     * The time the stack was last updated. This field will only be returned if the stack has been updated at least once.
     */
    LastUpdatedTime?: LastUpdatedTime;
    /**
     * The rollback triggers for CloudFormation to monitor during stack creation and updating operations, and for the specified monitoring period afterwards.
     */
    RollbackConfiguration?: RollbackConfiguration;
    /**
     * Current status of the stack.
     */
    StackStatus: StackStatus;
    /**
     * Success/failure message associated with the stack status.
     */
    StackStatusReason?: StackStatusReason;
    /**
     * Boolean to enable or disable rollback on stack creation failures:    true: disable rollback.    false: enable rollback.  
     */
    DisableRollback?: DisableRollback;
    /**
     * Amazon SNS topic Amazon Resource Names (ARNs) to which stack related events are published.
     */
    NotificationARNs?: NotificationARNs;
    /**
     * The amount of time within which stack creation should complete.
     */
    TimeoutInMinutes?: TimeoutMinutes;
    /**
     * The capabilities allowed in the stack.
     */
    Capabilities?: Capabilities;
    /**
     * A list of output structures.
     */
    Outputs?: Outputs;
    /**
     * The Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that's associated with the stack. During a stack operation, CloudFormation uses this role's credentials to make calls on your behalf.
     */
    RoleARN?: RoleARN;
    /**
     * A list of Tags that specify information about the stack.
     */
    Tags?: Tags;
    /**
     * Whether termination protection is enabled for the stack. For nested stacks, termination protection is set on the root stack and can't be changed directly on the nested stack. For more information, see Protecting a Stack From Being Deleted in the CloudFormation User Guide.
     */
    EnableTerminationProtection?: EnableTerminationProtection;
    /**
     * For nested stacks--stacks created as resources for another stack--the stack ID of the direct parent of this stack. For the first level of nested stacks, the root stack is also the parent stack. For more information, see Working with Nested Stacks in the CloudFormation User Guide.
     */
    ParentId?: StackId;
    /**
     * For nested stacks--stacks created as resources for another stack--the stack ID of the top-level stack to which the nested stack ultimately belongs. For more information, see Working with Nested Stacks in the CloudFormation User Guide.
     */
    RootId?: StackId;
    /**
     * Information about whether a stack's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. For more information, see Detecting Unregulated Configuration Changes to Stacks and Resources.
     */
    DriftInformation?: StackDriftInformation;
    /**
     * When set to true, newly created resources are deleted when the operation rolls back. This includes newly created resources marked with a deletion policy of Retain. Default: false 
     */
    RetainExceptOnCreate?: RetainExceptOnCreate;
  }
  export type StackDriftDetectionId = string;
  export type StackDriftDetectionStatus = "DETECTION_IN_PROGRESS"|"DETECTION_FAILED"|"DETECTION_COMPLETE"|string;
  export type StackDriftDetectionStatusReason = string;
  export interface StackDriftInformation {
    /**
     * Status of the stack's actual configuration compared to its expected template configuration.    DRIFTED: The stack differs from its expected template configuration. A stack is considered to have drifted if one or more of its resources have drifted.    NOT_CHECKED: CloudFormation hasn't checked if the stack differs from its expected template configuration.    IN_SYNC: The stack's actual configuration matches its expected template configuration.    UNKNOWN: This value is reserved for future use.  
     */
    StackDriftStatus: StackDriftStatus;
    /**
     * Most recent time when a drift detection operation was initiated on the stack, or any of its individual resources that support drift detection.
     */
    LastCheckTimestamp?: Timestamp;
  }
  export interface StackDriftInformationSummary {
    /**
     * Status of the stack's actual configuration compared to its expected template configuration.    DRIFTED: The stack differs from its expected template configuration. A stack is considered to have drifted if one or more of its resources have drifted.    NOT_CHECKED: CloudFormation hasn't checked if the stack differs from its expected template configuration.    IN_SYNC: The stack's actual configuration matches its expected template configuration.    UNKNOWN: This value is reserved for future use.  
     */
    StackDriftStatus: StackDriftStatus;
    /**
     * Most recent time when a drift detection operation was initiated on the stack, or any of its individual resources that support drift detection.
     */
    LastCheckTimestamp?: Timestamp;
  }
  export type StackDriftStatus = "DRIFTED"|"IN_SYNC"|"UNKNOWN"|"NOT_CHECKED"|string;
  export interface StackEvent {
    /**
     * The unique ID name of the instance of the stack.
     */
    StackId: StackId;
    /**
     * The unique ID of this event.
     */
    EventId: EventId;
    /**
     * The name associated with a stack.
     */
    StackName: StackName;
    /**
     * The logical name of the resource specified in the template.
     */
    LogicalResourceId?: LogicalResourceId;
    /**
     * The name or unique identifier associated with the physical instance of the resource.
     */
    PhysicalResourceId?: PhysicalResourceId;
    /**
     * Type of resource. (For more information, go to Amazon Web Services Resource Types Reference in the CloudFormation User Guide.)
     */
    ResourceType?: ResourceType;
    /**
     * Time the status was updated.
     */
    Timestamp: Timestamp;
    /**
     * Current status of the resource.
     */
    ResourceStatus?: ResourceStatus;
    /**
     * Success/failure message associated with the resource.
     */
    ResourceStatusReason?: ResourceStatusReason;
    /**
     * BLOB of the properties used to create the resource.
     */
    ResourceProperties?: ResourceProperties;
    /**
     * The token passed to the operation that generated this event. All events triggered by a given stack operation are assigned the same client request token, which you can use to track operations. For example, if you execute a CreateStack operation with the token token1, then all the StackEvents generated by that operation will have ClientRequestToken set as token1. In the console, stack operations display the client request token on the Events tab. Stack operations that are initiated from the console use the token format Console-StackOperation-ID, which helps you easily identify the stack operation . For example, if you create a stack using the console, each stack event would be assigned the same token in the following format: Console-CreateStack-7f59c3cf-00d2-40c7-b2ff-e75db0987002.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The name of the hook.
     */
    HookType?: HookType;
    /**
     * Provides the status of the change set hook.
     */
    HookStatus?: HookStatus;
    /**
     * Provides the reason for the hook status.
     */
    HookStatusReason?: HookStatusReason;
    /**
     * Invocation points are points in provisioning logic where hooks are initiated.
     */
    HookInvocationPoint?: HookInvocationPoint;
    /**
     * Specify the hook failure mode for non-compliant resources in the followings ways.    FAIL Stops provisioning resources.    WARN Allows provisioning to continue with a warning message.  
     */
    HookFailureMode?: HookFailureMode;
  }
  export type StackEvents = StackEvent[];
  export type StackId = string;
  export type StackIdList = StackId[];
  export type StackIdsUrl = string;
  export interface StackInstance {
    /**
     * The name or unique ID of the stack set that the stack instance is associated with.
     */
    StackSetId?: StackSetId;
    /**
     * The name of the Amazon Web Services Region that the stack instance is associated with.
     */
    Region?: Region;
    /**
     * [Self-managed permissions] The name of the Amazon Web Services account that the stack instance is associated with.
     */
    Account?: Account;
    /**
     * The ID of the stack instance.
     */
    StackId?: StackId;
    /**
     * A list of parameters from the stack set template whose values have been overridden in this stack instance.
     */
    ParameterOverrides?: Parameters;
    /**
     * The status of the stack instance, in terms of its synchronization with its associated stack set.    INOPERABLE: A DeleteStackInstances operation has failed and left the stack in an unstable state. Stacks in this state are excluded from further UpdateStackSet operations. You might need to perform a DeleteStackInstances operation, with RetainStacks set to true, to delete the stack instance, and then delete the stack manually.    OUTDATED: The stack isn't currently up to date with the stack set because:   The associated stack failed during a CreateStackSet or UpdateStackSet operation.   The stack was part of a CreateStackSet or UpdateStackSet operation that failed or was stopped before the stack was created or updated.      CURRENT: The stack is currently up to date with the stack set.  
     */
    Status?: StackInstanceStatus;
    /**
     * The detailed status of the stack instance.
     */
    StackInstanceStatus?: StackInstanceComprehensiveStatus;
    /**
     * The explanation for the specific status code that's assigned to this stack instance.
     */
    StatusReason?: Reason;
    /**
     * [Service-managed permissions] The organization root ID or organizational unit (OU) IDs that you specified for DeploymentTargets.
     */
    OrganizationalUnitId?: OrganizationalUnitId;
    /**
     * Status of the stack instance's actual configuration compared to the expected template and parameter configuration of the stack set to which it belongs.    DRIFTED: The stack differs from the expected template and parameter configuration of the stack set to which it belongs. A stack instance is considered to have drifted if one or more of the resources in the associated stack have drifted.    NOT_CHECKED: CloudFormation hasn't checked if the stack instance differs from its expected stack set configuration.    IN_SYNC: The stack instance's actual configuration matches its expected stack set configuration.    UNKNOWN: This value is reserved for future use.  
     */
    DriftStatus?: StackDriftStatus;
    /**
     * Most recent time when CloudFormation performed a drift detection operation on the stack instance. This value will be NULL for any stack instance on which drift detection hasn't yet been performed.
     */
    LastDriftCheckTimestamp?: Timestamp;
    /**
     * The last unique ID of a StackSet operation performed on a stack instance.
     */
    LastOperationId?: ClientRequestToken;
  }
  export interface StackInstanceComprehensiveStatus {
    /**
     *    CANCELLED: The operation in the specified account and Region has been canceled. This is either because a user has stopped the stack set operation, or because the failure tolerance of the stack set operation has been exceeded.    FAILED: The operation in the specified account and Region failed. If the stack set operation fails in enough accounts within a Region, the failure tolerance for the stack set operation as a whole might be exceeded.    INOPERABLE: A DeleteStackInstances operation has failed and left the stack in an unstable state. Stacks in this state are excluded from further UpdateStackSet operations. You might need to perform a DeleteStackInstances operation, with RetainStacks set to true, to delete the stack instance, and then delete the stack manually.    PENDING: The operation in the specified account and Region has yet to start.    RUNNING: The operation in the specified account and Region is currently in progress.    SKIPPED_SUSPENDED_ACCOUNT: The operation in the specified account and Region has been skipped because the account was suspended at the time of the operation.    SUCCEEDED: The operation in the specified account and Region completed successfully.  
     */
    DetailedStatus?: StackInstanceDetailedStatus;
  }
  export type StackInstanceDetailedStatus = "PENDING"|"RUNNING"|"SUCCEEDED"|"FAILED"|"CANCELLED"|"INOPERABLE"|"SKIPPED_SUSPENDED_ACCOUNT"|string;
  export interface StackInstanceFilter {
    /**
     * The type of filter to apply.
     */
    Name?: StackInstanceFilterName;
    /**
     * The status to filter by.
     */
    Values?: StackInstanceFilterValues;
  }
  export type StackInstanceFilterName = "DETAILED_STATUS"|"LAST_OPERATION_ID"|"DRIFT_STATUS"|string;
  export type StackInstanceFilterValues = string;
  export type StackInstanceFilters = StackInstanceFilter[];
  export type StackInstanceResourceDriftsSummaries = StackInstanceResourceDriftsSummary[];
  export interface StackInstanceResourceDriftsSummary {
    /**
     * The ID of the stack instance.
     */
    StackId: StackId;
    /**
     * The logical name of the resource specified in the template.
     */
    LogicalResourceId: LogicalResourceId;
    /**
     * The name or unique identifier that corresponds to a physical instance ID of a resource supported by CloudFormation.
     */
    PhysicalResourceId?: PhysicalResourceId;
    /**
     * Context information that enables CloudFormation to uniquely identify a resource. CloudFormation uses context key-value pairs in cases where a resource's logical and physical IDs aren't enough to uniquely identify that resource. Each context key-value pair specifies a unique resource that contains the targeted resource.
     */
    PhysicalResourceIdContext?: PhysicalResourceIdContext;
    /**
     * Type of resource. For more information, go to Amazon Web Services Resource Types Reference in the CloudFormation User Guide.
     */
    ResourceType: ResourceType;
    /**
     * Status of the actual configuration of the resource compared to its expected configuration. These will be present only for resources whose StackInstanceResourceDriftStatus is MODIFIED. 
     */
    PropertyDifferences?: PropertyDifferences;
    /**
     * The drift status of the resource in a stack instance.    DELETED: The resource differs from its expected template configuration in that the resource has been deleted.    MODIFIED: One or more resource properties differ from their expected template values.    IN_SYNC: The resource's actual configuration matches its expected template configuration.    NOT_CHECKED: CloudFormation doesn't currently return this value.  
     */
    StackResourceDriftStatus: StackResourceDriftStatus;
    /**
     * Time at which the stack instance drift detection operation was initiated.
     */
    Timestamp: Timestamp;
  }
  export type StackInstanceStatus = "CURRENT"|"OUTDATED"|"INOPERABLE"|string;
  export type StackInstanceSummaries = StackInstanceSummary[];
  export interface StackInstanceSummary {
    /**
     * The name or unique ID of the stack set that the stack instance is associated with.
     */
    StackSetId?: StackSetId;
    /**
     * The name of the Amazon Web Services Region that the stack instance is associated with.
     */
    Region?: Region;
    /**
     * [Self-managed permissions] The name of the Amazon Web Services account that the stack instance is associated with.
     */
    Account?: Account;
    /**
     * The ID of the stack instance.
     */
    StackId?: StackId;
    /**
     * The status of the stack instance, in terms of its synchronization with its associated stack set.    INOPERABLE: A DeleteStackInstances operation has failed and left the stack in an unstable state. Stacks in this state are excluded from further UpdateStackSet operations. You might need to perform a DeleteStackInstances operation, with RetainStacks set to true, to delete the stack instance, and then delete the stack manually.    OUTDATED: The stack isn't currently up to date with the stack set because:   The associated stack failed during a CreateStackSet or UpdateStackSet operation.   The stack was part of a CreateStackSet or UpdateStackSet operation that failed or was stopped before the stack was created or updated.      CURRENT: The stack is currently up to date with the stack set.  
     */
    Status?: StackInstanceStatus;
    /**
     * The explanation for the specific status code assigned to this stack instance.
     */
    StatusReason?: Reason;
    /**
     * The detailed status of the stack instance.
     */
    StackInstanceStatus?: StackInstanceComprehensiveStatus;
    /**
     * [Service-managed permissions] The organization root ID or organizational unit (OU) IDs that you specified for DeploymentTargets.
     */
    OrganizationalUnitId?: OrganizationalUnitId;
    /**
     * Status of the stack instance's actual configuration compared to the expected template and parameter configuration of the stack set to which it belongs.    DRIFTED: The stack differs from the expected template and parameter configuration of the stack set to which it belongs. A stack instance is considered to have drifted if one or more of the resources in the associated stack have drifted.    NOT_CHECKED: CloudFormation hasn't checked if the stack instance differs from its expected stack set configuration.    IN_SYNC: The stack instance's actual configuration matches its expected stack set configuration.    UNKNOWN: This value is reserved for future use.  
     */
    DriftStatus?: StackDriftStatus;
    /**
     * Most recent time when CloudFormation performed a drift detection operation on the stack instance. This value will be NULL for any stack instance on which drift detection hasn't yet been performed.
     */
    LastDriftCheckTimestamp?: Timestamp;
    /**
     * The last unique ID of a StackSet operation performed on a stack instance.
     */
    LastOperationId?: ClientRequestToken;
  }
  export type StackName = string;
  export type StackNameOrId = string;
  export type StackPolicyBody = string;
  export type StackPolicyDuringUpdateBody = string;
  export type StackPolicyDuringUpdateURL = string;
  export type StackPolicyURL = string;
  export interface StackResource {
    /**
     * The name associated with the stack.
     */
    StackName?: StackName;
    /**
     * Unique identifier of the stack.
     */
    StackId?: StackId;
    /**
     * The logical name of the resource specified in the template.
     */
    LogicalResourceId: LogicalResourceId;
    /**
     * The name or unique identifier that corresponds to a physical instance ID of a resource supported by CloudFormation.
     */
    PhysicalResourceId?: PhysicalResourceId;
    /**
     * Type of resource. For more information, go to Amazon Web Services Resource Types Reference in the CloudFormation User Guide.
     */
    ResourceType: ResourceType;
    /**
     * Time the status was updated.
     */
    Timestamp: Timestamp;
    /**
     * Current status of the resource.
     */
    ResourceStatus: ResourceStatus;
    /**
     * Success/failure message associated with the resource.
     */
    ResourceStatusReason?: ResourceStatusReason;
    /**
     * User defined description associated with the resource.
     */
    Description?: Description;
    /**
     * Information about whether the resource's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. For more information, see Detecting Unregulated Configuration Changes to Stacks and Resources.
     */
    DriftInformation?: StackResourceDriftInformation;
    /**
     * Contains information about the module from which the resource was created, if the resource was created from a module included in the stack template.
     */
    ModuleInfo?: ModuleInfo;
  }
  export interface StackResourceDetail {
    /**
     * The name associated with the stack.
     */
    StackName?: StackName;
    /**
     * Unique identifier of the stack.
     */
    StackId?: StackId;
    /**
     * The logical name of the resource specified in the template.
     */
    LogicalResourceId: LogicalResourceId;
    /**
     * The name or unique identifier that corresponds to a physical instance ID of a resource supported by CloudFormation.
     */
    PhysicalResourceId?: PhysicalResourceId;
    /**
     * Type of resource. For more information, go to Amazon Web Services Resource Types Reference in the CloudFormation User Guide.
     */
    ResourceType: ResourceType;
    /**
     * Time the status was updated.
     */
    LastUpdatedTimestamp: Timestamp;
    /**
     * Current status of the resource.
     */
    ResourceStatus: ResourceStatus;
    /**
     * Success/failure message associated with the resource.
     */
    ResourceStatusReason?: ResourceStatusReason;
    /**
     * User defined description associated with the resource.
     */
    Description?: Description;
    /**
     * The content of the Metadata attribute declared for the resource. For more information, see Metadata Attribute in the CloudFormation User Guide.
     */
    Metadata?: Metadata;
    /**
     * Information about whether the resource's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. For more information, see Detecting Unregulated Configuration Changes to Stacks and Resources.
     */
    DriftInformation?: StackResourceDriftInformation;
    /**
     * Contains information about the module from which the resource was created, if the resource was created from a module included in the stack template.
     */
    ModuleInfo?: ModuleInfo;
  }
  export interface StackResourceDrift {
    /**
     * The ID of the stack.
     */
    StackId: StackId;
    /**
     * The logical name of the resource specified in the template.
     */
    LogicalResourceId: LogicalResourceId;
    /**
     * The name or unique identifier that corresponds to a physical instance ID of a resource supported by CloudFormation.
     */
    PhysicalResourceId?: PhysicalResourceId;
    /**
     * Context information that enables CloudFormation to uniquely identify a resource. CloudFormation uses context key-value pairs in cases where a resource's logical and physical IDs aren't enough to uniquely identify that resource. Each context key-value pair specifies a unique resource that contains the targeted resource.
     */
    PhysicalResourceIdContext?: PhysicalResourceIdContext;
    /**
     * The type of the resource.
     */
    ResourceType: ResourceType;
    /**
     * A JSON structure containing the expected property values of the stack resource, as defined in the stack template and any values specified as template parameters. For resources whose StackResourceDriftStatus is DELETED, this structure will not be present.
     */
    ExpectedProperties?: Properties;
    /**
     * A JSON structure containing the actual property values of the stack resource. For resources whose StackResourceDriftStatus is DELETED, this structure will not be present.
     */
    ActualProperties?: Properties;
    /**
     * A collection of the resource properties whose actual values differ from their expected values. These will be present only for resources whose StackResourceDriftStatus is MODIFIED.
     */
    PropertyDifferences?: PropertyDifferences;
    /**
     * Status of the resource's actual configuration compared to its expected configuration.    DELETED: The resource differs from its expected template configuration because the resource has been deleted.    MODIFIED: One or more resource properties differ from their expected values (as defined in the stack template and any values specified as template parameters).    IN_SYNC: The resource's actual configuration matches its expected template configuration.    NOT_CHECKED: CloudFormation does not currently return this value.  
     */
    StackResourceDriftStatus: StackResourceDriftStatus;
    /**
     * Time at which CloudFormation performed drift detection on the stack resource.
     */
    Timestamp: Timestamp;
    /**
     * Contains information about the module from which the resource was created, if the resource was created from a module included in the stack template.
     */
    ModuleInfo?: ModuleInfo;
  }
  export interface StackResourceDriftInformation {
    /**
     * Status of the resource's actual configuration compared to its expected configuration    DELETED: The resource differs from its expected configuration in that it has been deleted.    MODIFIED: The resource differs from its expected configuration.    NOT_CHECKED: CloudFormation has not checked if the resource differs from its expected configuration. Any resources that do not currently support drift detection have a status of NOT_CHECKED. For more information, see Resources that Support Drift Detection.    IN_SYNC: The resource's actual configuration matches its expected configuration.  
     */
    StackResourceDriftStatus: StackResourceDriftStatus;
    /**
     * When CloudFormation last checked if the resource had drifted from its expected configuration.
     */
    LastCheckTimestamp?: Timestamp;
  }
  export interface StackResourceDriftInformationSummary {
    /**
     * Status of the resource's actual configuration compared to its expected configuration.    DELETED: The resource differs from its expected configuration in that it has been deleted.    MODIFIED: The resource differs from its expected configuration.    NOT_CHECKED: CloudFormation hasn't checked if the resource differs from its expected configuration. Any resources that don't currently support drift detection have a status of NOT_CHECKED. For more information, see Resources that Support Drift Detection. If you performed an ContinueUpdateRollback operation on a stack, any resources included in ResourcesToSkip will also have a status of NOT_CHECKED. For more information about skipping resources during rollback operations, see Continue Rolling Back an Update in the CloudFormation User Guide.    IN_SYNC: The resource's actual configuration matches its expected configuration.  
     */
    StackResourceDriftStatus: StackResourceDriftStatus;
    /**
     * When CloudFormation last checked if the resource had drifted from its expected configuration.
     */
    LastCheckTimestamp?: Timestamp;
  }
  export type StackResourceDriftStatus = "IN_SYNC"|"MODIFIED"|"DELETED"|"NOT_CHECKED"|string;
  export type StackResourceDriftStatusFilters = StackResourceDriftStatus[];
  export type StackResourceDrifts = StackResourceDrift[];
  export type StackResourceSummaries = StackResourceSummary[];
  export interface StackResourceSummary {
    /**
     * The logical name of the resource specified in the template.
     */
    LogicalResourceId: LogicalResourceId;
    /**
     * The name or unique identifier that corresponds to a physical instance ID of the resource.
     */
    PhysicalResourceId?: PhysicalResourceId;
    /**
     * Type of resource. (For more information, go to Amazon Web Services Resource Types Reference in the CloudFormation User Guide.)
     */
    ResourceType: ResourceType;
    /**
     * Time the status was updated.
     */
    LastUpdatedTimestamp: Timestamp;
    /**
     * Current status of the resource.
     */
    ResourceStatus: ResourceStatus;
    /**
     * Success/failure message associated with the resource.
     */
    ResourceStatusReason?: ResourceStatusReason;
    /**
     * Information about whether the resource's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. For more information, see Detecting Unregulated Configuration Changes to Stacks and Resources.
     */
    DriftInformation?: StackResourceDriftInformationSummary;
    /**
     * Contains information about the module from which the resource was created, if the resource was created from a module included in the stack template.
     */
    ModuleInfo?: ModuleInfo;
  }
  export type StackResources = StackResource[];
  export interface StackSet {
    /**
     * The name that's associated with the stack set.
     */
    StackSetName?: StackSetName;
    /**
     * The ID of the stack set.
     */
    StackSetId?: StackSetId;
    /**
     * A description of the stack set that you specify when the stack set is created or updated.
     */
    Description?: Description;
    /**
     * The status of the stack set.
     */
    Status?: StackSetStatus;
    /**
     * The structure that contains the body of the template that was used to create or update the stack set.
     */
    TemplateBody?: TemplateBody;
    /**
     * A list of input parameters for a stack set.
     */
    Parameters?: Parameters;
    /**
     * The capabilities that are allowed in the stack set. Some stack set templates might include resources that can affect permissions in your Amazon Web Services account—for example, by creating new Identity and Access Management (IAM) users. For more information, see Acknowledging IAM Resources in CloudFormation Templates. 
     */
    Capabilities?: Capabilities;
    /**
     * A list of tags that specify information about the stack set. A maximum number of 50 tags can be specified.
     */
    Tags?: Tags;
    /**
     * The Amazon Resource Name (ARN) of the stack set.
     */
    StackSetARN?: StackSetARN;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used to create or update the stack set. Use customized administrator roles to control which users or groups can manage specific stack sets within the same administrator account. For more information, see Prerequisites: Granting Permissions for Stack Set Operations in the CloudFormation User Guide.
     */
    AdministrationRoleARN?: RoleARN;
    /**
     * The name of the IAM execution role used to create or update the stack set. Use customized execution roles to control which stack resources users and groups can include in their stack sets.
     */
    ExecutionRoleName?: ExecutionRoleName;
    /**
     * Detailed information about the drift status of the stack set. For stack sets, contains information about the last completed drift operation performed on the stack set. Information about drift operations currently in progress isn't included.
     */
    StackSetDriftDetectionDetails?: StackSetDriftDetectionDetails;
    /**
     * [Service-managed permissions] Describes whether StackSets automatically deploys to Organizations accounts that are added to a target organization or organizational unit (OU).
     */
    AutoDeployment?: AutoDeployment;
    /**
     * Describes how the IAM roles required for stack set operations are created.   With self-managed permissions, you must create the administrator and execution roles required to deploy to target accounts. For more information, see Grant Self-Managed Stack Set Permissions.   With service-managed permissions, StackSets automatically creates the IAM roles required to deploy to accounts managed by Organizations. For more information, see Grant Service-Managed Stack Set Permissions.  
     */
    PermissionModel?: PermissionModels;
    /**
     * [Service-managed permissions] The organization root ID or organizational unit (OU) IDs that you specified for DeploymentTargets.
     */
    OrganizationalUnitIds?: OrganizationalUnitIdList;
    /**
     * Describes whether StackSets performs non-conflicting operations concurrently and queues conflicting operations.
     */
    ManagedExecution?: ManagedExecution;
    /**
     * Returns a list of all Amazon Web Services Regions the given StackSet has stack instances deployed in. The Amazon Web Services Regions list output is in no particular order.
     */
    Regions?: RegionList;
  }
  export type StackSetARN = string;
  export interface StackSetDriftDetectionDetails {
    /**
     * Status of the stack set's actual configuration compared to its expected template and parameter configuration. A stack set is considered to have drifted if one or more of its stack instances have drifted from their expected template and parameter configuration.    DRIFTED: One or more of the stack instances belonging to the stack set stack differs from the expected template and parameter configuration. A stack instance is considered to have drifted if one or more of the resources in the associated stack have drifted.    NOT_CHECKED: CloudFormation hasn't checked the stack set for drift.    IN_SYNC: All of the stack instances belonging to the stack set stack match from the expected template and parameter configuration.  
     */
    DriftStatus?: StackSetDriftStatus;
    /**
     * The status of the stack set drift detection operation.    COMPLETED: The drift detection operation completed without failing on any stack instances.    FAILED: The drift detection operation exceeded the specified failure tolerance.    PARTIAL_SUCCESS: The drift detection operation completed without exceeding the failure tolerance for the operation.    IN_PROGRESS: The drift detection operation is currently being performed.    STOPPED: The user has canceled the drift detection operation.  
     */
    DriftDetectionStatus?: StackSetDriftDetectionStatus;
    /**
     * Most recent time when CloudFormation performed a drift detection operation on the stack set. This value will be NULL for any stack set on which drift detection hasn't yet been performed.
     */
    LastDriftCheckTimestamp?: Timestamp;
    /**
     * The total number of stack instances belonging to this stack set. The total number of stack instances is equal to the total of:   Stack instances that match the stack set configuration.   Stack instances that have drifted from the stack set configuration.   Stack instances where the drift detection operation has failed.   Stack instances currently being checked for drift.  
     */
    TotalStackInstancesCount?: TotalStackInstancesCount;
    /**
     * The number of stack instances that have drifted from the expected template and parameter configuration of the stack set. A stack instance is considered to have drifted if one or more of the resources in the associated stack don't match their expected configuration.
     */
    DriftedStackInstancesCount?: DriftedStackInstancesCount;
    /**
     * The number of stack instances which match the expected template and parameter configuration of the stack set.
     */
    InSyncStackInstancesCount?: InSyncStackInstancesCount;
    /**
     * The number of stack instances that are currently being checked for drift.
     */
    InProgressStackInstancesCount?: InProgressStackInstancesCount;
    /**
     * The number of stack instances for which the drift detection operation failed.
     */
    FailedStackInstancesCount?: FailedStackInstancesCount;
  }
  export type StackSetDriftDetectionStatus = "COMPLETED"|"FAILED"|"PARTIAL_SUCCESS"|"IN_PROGRESS"|"STOPPED"|string;
  export type StackSetDriftStatus = "DRIFTED"|"IN_SYNC"|"NOT_CHECKED"|string;
  export type StackSetId = string;
  export type StackSetName = string;
  export type StackSetNameOrId = string;
  export interface StackSetOperation {
    /**
     * The unique ID of a stack set operation.
     */
    OperationId?: ClientRequestToken;
    /**
     * The ID of the stack set.
     */
    StackSetId?: StackSetId;
    /**
     * The type of stack set operation: CREATE, UPDATE, or DELETE. Create and delete operations affect only the specified stack set instances that are associated with the specified stack set. Update operations affect both the stack set itself, in addition to all associated stack set instances.
     */
    Action?: StackSetOperationAction;
    /**
     * The status of the operation.    FAILED: The operation exceeded the specified failure tolerance. The failure tolerance value that you've set for an operation is applied for each Region during stack create and update operations. If the number of failed stacks within a Region exceeds the failure tolerance, the status of the operation in the Region is set to FAILED. This in turn sets the status of the operation as a whole to FAILED, and CloudFormation cancels the operation in any remaining Regions.    QUEUED: [Service-managed permissions] For automatic deployments that require a sequence of operations, the operation is queued to be performed. For more information, see the stack set operation status codes in the CloudFormation User Guide.    RUNNING: The operation is currently being performed.    STOPPED: The user has canceled the operation.    STOPPING: The operation is in the process of stopping, at user request.    SUCCEEDED: The operation completed creating or updating all the specified stacks without exceeding the failure tolerance for the operation.  
     */
    Status?: StackSetOperationStatus;
    /**
     * The preferences for how CloudFormation performs this stack set operation.
     */
    OperationPreferences?: StackSetOperationPreferences;
    /**
     * For stack set operations of action type DELETE, specifies whether to remove the stack instances from the specified stack set, but doesn't delete the stacks. You can't re-associate a retained stack, or add an existing, saved stack to a new stack set.
     */
    RetainStacks?: RetainStacksNullable;
    /**
     * The Amazon Resource Name (ARN) of the IAM role used to perform this stack set operation. Use customized administrator roles to control which users or groups can manage specific stack sets within the same administrator account. For more information, see Define Permissions for Multiple Administrators in the CloudFormation User Guide.
     */
    AdministrationRoleARN?: RoleARN;
    /**
     * The name of the IAM execution role used to create or update the stack set. Use customized execution roles to control which stack resources users and groups can include in their stack sets.
     */
    ExecutionRoleName?: ExecutionRoleName;
    /**
     * The time at which the operation was initiated. Note that the creation times for the stack set operation might differ from the creation time of the individual stacks themselves. This is because CloudFormation needs to perform preparatory work for the operation, such as dispatching the work to the requested Regions, before actually creating the first stacks.
     */
    CreationTimestamp?: Timestamp;
    /**
     * The time at which the stack set operation ended, across all accounts and Regions specified. Note that this doesn't necessarily mean that the stack set operation was successful, or even attempted, in each account or Region.
     */
    EndTimestamp?: Timestamp;
    /**
     * [Service-managed permissions] The Organizations accounts affected by the stack operation.
     */
    DeploymentTargets?: DeploymentTargets;
    /**
     * Detailed information about the drift status of the stack set. This includes information about drift operations currently being performed on the stack set. This information will only be present for stack set operations whose Action type is DETECT_DRIFT. For more information, see Detecting Unmanaged Changes in Stack Sets in the CloudFormation User Guide.
     */
    StackSetDriftDetectionDetails?: StackSetDriftDetectionDetails;
    /**
     * The status of the operation in details.
     */
    StatusReason?: StackSetOperationStatusReason;
    /**
     * Detailed information about the StackSet operation.
     */
    StatusDetails?: StackSetOperationStatusDetails;
  }
  export type StackSetOperationAction = "CREATE"|"UPDATE"|"DELETE"|"DETECT_DRIFT"|string;
  export interface StackSetOperationPreferences {
    /**
     * The concurrency type of deploying StackSets operations in Regions, could be in parallel or one Region at a time.
     */
    RegionConcurrencyType?: RegionConcurrencyType;
    /**
     * The order of the Regions where you want to perform the stack operation.
     */
    RegionOrder?: RegionList;
    /**
     * The number of accounts, per Region, for which this operation can fail before CloudFormation stops the operation in that Region. If the operation is stopped in a Region, CloudFormation doesn't attempt the operation in any subsequent Regions. Conditional: You must specify either FailureToleranceCount or FailureTolerancePercentage (but not both). By default, 0 is specified.
     */
    FailureToleranceCount?: FailureToleranceCount;
    /**
     * The percentage of accounts, per Region, for which this stack operation can fail before CloudFormation stops the operation in that Region. If the operation is stopped in a Region, CloudFormation doesn't attempt the operation in any subsequent Regions. When calculating the number of accounts based on the specified percentage, CloudFormation rounds down to the next whole number. Conditional: You must specify either FailureToleranceCount or FailureTolerancePercentage, but not both. By default, 0 is specified.
     */
    FailureTolerancePercentage?: FailureTolerancePercentage;
    /**
     * The maximum number of accounts in which to perform this operation at one time. This is dependent on the value of FailureToleranceCount.MaxConcurrentCount is at most one more than the FailureToleranceCount. Note that this setting lets you specify the maximum for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling. Conditional: You must specify either MaxConcurrentCount or MaxConcurrentPercentage, but not both. By default, 1 is specified.
     */
    MaxConcurrentCount?: MaxConcurrentCount;
    /**
     * The maximum percentage of accounts in which to perform this operation at one time. When calculating the number of accounts based on the specified percentage, CloudFormation rounds down to the next whole number. This is true except in cases where rounding down would result is zero. In this case, CloudFormation sets the number as one instead. Note that this setting lets you specify the maximum for operations. For large deployments, under certain circumstances the actual number of accounts acted upon concurrently may be lower due to service throttling. Conditional: You must specify either MaxConcurrentCount or MaxConcurrentPercentage, but not both. By default, 1 is specified.
     */
    MaxConcurrentPercentage?: MaxConcurrentPercentage;
  }
  export type StackSetOperationResultStatus = "PENDING"|"RUNNING"|"SUCCEEDED"|"FAILED"|"CANCELLED"|string;
  export type StackSetOperationResultSummaries = StackSetOperationResultSummary[];
  export interface StackSetOperationResultSummary {
    /**
     * [Self-managed permissions] The name of the Amazon Web Services account for this operation result.
     */
    Account?: Account;
    /**
     * The name of the Amazon Web Services Region for this operation result.
     */
    Region?: Region;
    /**
     * The result status of the stack set operation for the given account in the given Region.    CANCELLED: The operation in the specified account and Region has been canceled. This is either because a user has stopped the stack set operation, or because the failure tolerance of the stack set operation has been exceeded.    FAILED: The operation in the specified account and Region failed. If the stack set operation fails in enough accounts within a Region, the failure tolerance for the stack set operation as a whole might be exceeded.    RUNNING: The operation in the specified account and Region is currently in progress.    PENDING: The operation in the specified account and Region has yet to start.    SUCCEEDED: The operation in the specified account and Region completed successfully.  
     */
    Status?: StackSetOperationResultStatus;
    /**
     * The reason for the assigned result status.
     */
    StatusReason?: Reason;
    /**
     * The results of the account gate function CloudFormation invokes, if present, before proceeding with stack set operations in an account.
     */
    AccountGateResult?: AccountGateResult;
    /**
     * [Service-managed permissions] The organization root ID or organizational unit (OU) IDs that you specified for DeploymentTargets.
     */
    OrganizationalUnitId?: OrganizationalUnitId;
  }
  export type StackSetOperationStatus = "RUNNING"|"SUCCEEDED"|"FAILED"|"STOPPING"|"STOPPED"|"QUEUED"|string;
  export interface StackSetOperationStatusDetails {
    /**
     * The number of stack instances for which the StackSet operation failed.
     */
    FailedStackInstancesCount?: FailedStackInstancesCount;
  }
  export type StackSetOperationStatusReason = string;
  export type StackSetOperationSummaries = StackSetOperationSummary[];
  export interface StackSetOperationSummary {
    /**
     * The unique ID of the stack set operation.
     */
    OperationId?: ClientRequestToken;
    /**
     * The type of operation: CREATE, UPDATE, or DELETE. Create and delete operations affect only the specified stack instances that are associated with the specified stack set. Update operations affect both the stack set itself and all associated stack set instances.
     */
    Action?: StackSetOperationAction;
    /**
     * The overall status of the operation.    FAILED: The operation exceeded the specified failure tolerance. The failure tolerance value that you've set for an operation is applied for each Region during stack create and update operations. If the number of failed stacks within a Region exceeds the failure tolerance, the status of the operation in the Region is set to FAILED. This in turn sets the status of the operation as a whole to FAILED, and CloudFormation cancels the operation in any remaining Regions.    QUEUED: [Service-managed permissions] For automatic deployments that require a sequence of operations, the operation is queued to be performed. For more information, see the stack set operation status codes in the CloudFormation User Guide.    RUNNING: The operation is currently being performed.    STOPPED: The user has canceled the operation.    STOPPING: The operation is in the process of stopping, at user request.    SUCCEEDED: The operation completed creating or updating all the specified stacks without exceeding the failure tolerance for the operation.  
     */
    Status?: StackSetOperationStatus;
    /**
     * The time at which the operation was initiated. Note that the creation times for the stack set operation might differ from the creation time of the individual stacks themselves. This is because CloudFormation needs to perform preparatory work for the operation, such as dispatching the work to the requested Regions, before actually creating the first stacks.
     */
    CreationTimestamp?: Timestamp;
    /**
     * The time at which the stack set operation ended, across all accounts and Regions specified. Note that this doesn't necessarily mean that the stack set operation was successful, or even attempted, in each account or Region.
     */
    EndTimestamp?: Timestamp;
    /**
     * The status of the operation in details.
     */
    StatusReason?: StackSetOperationStatusReason;
    /**
     * Detailed information about the stack set operation.
     */
    StatusDetails?: StackSetOperationStatusDetails;
    /**
     * The user-specified preferences for how CloudFormation performs a stack set operation. For more information about maximum concurrent accounts and failure tolerance, see Stack set operation options.
     */
    OperationPreferences?: StackSetOperationPreferences;
  }
  export type StackSetStatus = "ACTIVE"|"DELETED"|string;
  export type StackSetSummaries = StackSetSummary[];
  export interface StackSetSummary {
    /**
     * The name of the stack set.
     */
    StackSetName?: StackSetName;
    /**
     * The ID of the stack set.
     */
    StackSetId?: StackSetId;
    /**
     * A description of the stack set that you specify when the stack set is created or updated.
     */
    Description?: Description;
    /**
     * The status of the stack set.
     */
    Status?: StackSetStatus;
    /**
     * [Service-managed permissions] Describes whether StackSets automatically deploys to Organizations accounts that are added to a target organizational unit (OU).
     */
    AutoDeployment?: AutoDeployment;
    /**
     * Describes how the IAM roles required for stack set operations are created.   With self-managed permissions, you must create the administrator and execution roles required to deploy to target accounts. For more information, see Grant Self-Managed Stack Set Permissions.   With service-managed permissions, StackSets automatically creates the IAM roles required to deploy to accounts managed by Organizations. For more information, see Grant Service-Managed Stack Set Permissions.  
     */
    PermissionModel?: PermissionModels;
    /**
     * Status of the stack set's actual configuration compared to its expected template and parameter configuration. A stack set is considered to have drifted if one or more of its stack instances have drifted from their expected template and parameter configuration.    DRIFTED: One or more of the stack instances belonging to the stack set stack differs from the expected template and parameter configuration. A stack instance is considered to have drifted if one or more of the resources in the associated stack have drifted.    NOT_CHECKED: CloudFormation hasn't checked the stack set for drift.    IN_SYNC: All the stack instances belonging to the stack set stack match from the expected template and parameter configuration.    UNKNOWN: This value is reserved for future use.  
     */
    DriftStatus?: StackDriftStatus;
    /**
     * Most recent time when CloudFormation performed a drift detection operation on the stack set. This value will be NULL for any stack set on which drift detection hasn't yet been performed.
     */
    LastDriftCheckTimestamp?: Timestamp;
    /**
     * Describes whether StackSets performs non-conflicting operations concurrently and queues conflicting operations.
     */
    ManagedExecution?: ManagedExecution;
  }
  export type StackStatus = "CREATE_IN_PROGRESS"|"CREATE_FAILED"|"CREATE_COMPLETE"|"ROLLBACK_IN_PROGRESS"|"ROLLBACK_FAILED"|"ROLLBACK_COMPLETE"|"DELETE_IN_PROGRESS"|"DELETE_FAILED"|"DELETE_COMPLETE"|"UPDATE_IN_PROGRESS"|"UPDATE_COMPLETE_CLEANUP_IN_PROGRESS"|"UPDATE_COMPLETE"|"UPDATE_FAILED"|"UPDATE_ROLLBACK_IN_PROGRESS"|"UPDATE_ROLLBACK_FAILED"|"UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS"|"UPDATE_ROLLBACK_COMPLETE"|"REVIEW_IN_PROGRESS"|"IMPORT_IN_PROGRESS"|"IMPORT_COMPLETE"|"IMPORT_ROLLBACK_IN_PROGRESS"|"IMPORT_ROLLBACK_FAILED"|"IMPORT_ROLLBACK_COMPLETE"|string;
  export type StackStatusFilter = StackStatus[];
  export type StackStatusReason = string;
  export type StackSummaries = StackSummary[];
  export interface StackSummary {
    /**
     * Unique stack identifier.
     */
    StackId?: StackId;
    /**
     * The name associated with the stack.
     */
    StackName: StackName;
    /**
     * The template description of the template used to create the stack.
     */
    TemplateDescription?: TemplateDescription;
    /**
     * The time the stack was created.
     */
    CreationTime: CreationTime;
    /**
     * The time the stack was last updated. This field will only be returned if the stack has been updated at least once.
     */
    LastUpdatedTime?: LastUpdatedTime;
    /**
     * The time the stack was deleted.
     */
    DeletionTime?: DeletionTime;
    /**
     * The current status of the stack.
     */
    StackStatus: StackStatus;
    /**
     * Success/Failure message associated with the stack status.
     */
    StackStatusReason?: StackStatusReason;
    /**
     * For nested stacks--stacks created as resources for another stack--the stack ID of the direct parent of this stack. For the first level of nested stacks, the root stack is also the parent stack. For more information, see Working with Nested Stacks in the CloudFormation User Guide.
     */
    ParentId?: StackId;
    /**
     * For nested stacks--stacks created as resources for another stack--the stack ID of the top-level stack to which the nested stack ultimately belongs. For more information, see Working with Nested Stacks in the CloudFormation User Guide.
     */
    RootId?: StackId;
    /**
     * Summarizes information about whether a stack's actual configuration differs, or has drifted, from its expected configuration, as defined in the stack template and any values specified as template parameters. For more information, see Detecting Unregulated Configuration Changes to Stacks and Resources.
     */
    DriftInformation?: StackDriftInformationSummary;
  }
  export type Stacks = Stack[];
  export type StageList = TemplateStage[];
  export type StatusMessage = string;
  export interface StopStackSetOperationInput {
    /**
     * The name or unique ID of the stack set that you want to stop the operation for.
     */
    StackSetName: StackSetName;
    /**
     * The ID of the stack operation.
     */
    OperationId: ClientRequestToken;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface StopStackSetOperationOutput {
  }
  export type SupportedMajorVersion = number;
  export type SupportedMajorVersions = SupportedMajorVersion[];
  export interface Tag {
    /**
     *  Required. A string used to identify this tag. You can specify a maximum of 128 characters for a tag key. Tags owned by Amazon Web Services (Amazon Web Services) have the reserved prefix: aws:.
     */
    Key: TagKey;
    /**
     *  Required. A string containing the value for this tag. You can specify a maximum of 256 characters for a tag value.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagValue = string;
  export type Tags = Tag[];
  export type TemplateBody = string;
  export type TemplateDescription = string;
  export interface TemplateParameter {
    /**
     * The name associated with the parameter.
     */
    ParameterKey?: ParameterKey;
    /**
     * The default value associated with the parameter.
     */
    DefaultValue?: ParameterValue;
    /**
     * Flag indicating whether the parameter should be displayed as plain text in logs and UIs.
     */
    NoEcho?: NoEcho;
    /**
     * User defined description associated with the parameter.
     */
    Description?: Description;
  }
  export type TemplateParameters = TemplateParameter[];
  export type TemplateStage = "Original"|"Processed"|string;
  export interface TemplateSummaryConfig {
    /**
     * If set to True, any unrecognized resource types generate warnings and not an error. Any unrecognized resource types are returned in the Warnings output parameter.
     */
    TreatUnrecognizedResourceTypesAsWarnings?: TreatUnrecognizedResourceTypesAsWarnings;
  }
  export type TemplateURL = string;
  export interface TestTypeInput {
    /**
     * The Amazon Resource Name (ARN) of the extension. Conditional: You must specify Arn, or TypeName and Type.
     */
    Arn?: TypeArn;
    /**
     * The type of the extension to test. Conditional: You must specify Arn, or TypeName and Type.
     */
    Type?: ThirdPartyType;
    /**
     * The name of the extension to test. Conditional: You must specify Arn, or TypeName and Type.
     */
    TypeName?: TypeName;
    /**
     * The version of the extension to test. You can specify the version id with either Arn, or with TypeName and Type. If you don't specify a version, CloudFormation uses the default version of the extension in this account and Region for testing.
     */
    VersionId?: TypeVersionId;
    /**
     * The S3 bucket to which CloudFormation delivers the contract test execution logs. CloudFormation delivers the logs by the time contract testing has completed and the extension has been assigned a test type status of PASSED or FAILED. The user calling TestType must be able to access items in the specified S3 bucket. Specifically, the user needs the following permissions:    GetObject     PutObject    For more information, see Actions, Resources, and Condition Keys for Amazon S3 in the Amazon Web Services Identity and Access Management User Guide.
     */
    LogDeliveryBucket?: S3Bucket;
  }
  export interface TestTypeOutput {
    /**
     * The Amazon Resource Name (ARN) of the extension.
     */
    TypeVersionArn?: TypeArn;
  }
  export type ThirdPartyType = "RESOURCE"|"MODULE"|"HOOK"|string;
  export type ThirdPartyTypeArn = string;
  export type TimeoutMinutes = number;
  export type Timestamp = Date;
  export type TotalStackInstancesCount = number;
  export type TransformName = string;
  export type TransformsList = TransformName[];
  export type TreatUnrecognizedResourceTypesAsWarnings = boolean;
  export type Type = string;
  export type TypeArn = string;
  export type TypeConfiguration = string;
  export type TypeConfigurationAlias = string;
  export type TypeConfigurationArn = string;
  export interface TypeConfigurationDetails {
    /**
     * The Amazon Resource Name (ARN) for the configuration data, in this account and Region.
     */
    Arn?: TypeConfigurationArn;
    /**
     * The alias specified for this configuration, if one was specified when the configuration was set.
     */
    Alias?: TypeConfigurationAlias;
    /**
     * A JSON string specifying the configuration data for the extension, in this account and Region. If a configuration hasn't been set for a specified extension, CloudFormation returns {}.
     */
    Configuration?: TypeConfiguration;
    /**
     * When the configuration data was last updated for this extension. If a configuration hasn't been set for a specified extension, CloudFormation returns null.
     */
    LastUpdated?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) for the extension, in this account and Region. For public extensions, this will be the ARN assigned when you activate the type in this account and Region. For private extensions, this will be the ARN assigned when you register the type in this account and Region.
     */
    TypeArn?: TypeArn;
    /**
     * The name of the extension.
     */
    TypeName?: TypeName;
    /**
     * Whether this configuration data is the default configuration for the extension.
     */
    IsDefaultConfiguration?: IsDefaultConfiguration;
  }
  export type TypeConfigurationDetailsList = TypeConfigurationDetails[];
  export interface TypeConfigurationIdentifier {
    /**
     * The Amazon Resource Name (ARN) for the extension, in this account and Region. For public extensions, this will be the ARN assigned when you activate the type in this account and Region. For private extensions, this will be the ARN assigned when you register the type in this account and Region.
     */
    TypeArn?: TypeArn;
    /**
     * The alias specified for this configuration, if one was specified when the configuration was set.
     */
    TypeConfigurationAlias?: TypeConfigurationAlias;
    /**
     * The Amazon Resource Name (ARN) for the configuration, in this account and Region.
     */
    TypeConfigurationArn?: TypeConfigurationArn;
    /**
     * The type of extension.
     */
    Type?: ThirdPartyType;
    /**
     * The name of the extension type to which this configuration applies.
     */
    TypeName?: TypeName;
  }
  export type TypeConfigurationIdentifiers = TypeConfigurationIdentifier[];
  export interface TypeFilters {
    /**
     * The category of extensions to return.    REGISTERED: Private extensions that have been registered for this account and Region.    ACTIVATED: Public extensions that have been activated for this account and Region.    THIRD_PARTY: Extensions available for use from publishers other than Amazon. This includes:   Private extensions registered in the account.   Public extensions from publishers other than Amazon, whether activated or not.      AWS_TYPES: Extensions available for use from Amazon.  
     */
    Category?: Category;
    /**
     * The id of the publisher of the extension. Extensions published by Amazon aren't assigned a publisher ID. Use the AWS_TYPES category to specify a list of types published by Amazon.
     */
    PublisherId?: PublisherId;
    /**
     * A prefix to use as a filter for results.
     */
    TypeNamePrefix?: TypeNamePrefix;
  }
  export type TypeHierarchy = string;
  export type TypeName = string;
  export type TypeNamePrefix = string;
  export type TypeSchema = string;
  export type TypeSummaries = TypeSummary[];
  export interface TypeSummary {
    /**
     * The kind of extension.
     */
    Type?: RegistryType;
    /**
     * The name of the extension. If you specified a TypeNameAlias when you activate this extension in your account and Region, CloudFormation considers that alias as the type name.
     */
    TypeName?: TypeName;
    /**
     * The ID of the default version of the extension. The default version is used when the extension version isn't specified. This applies only to private extensions you have registered in your account. For public extensions, both those provided by Amazon and published by third parties, CloudFormation returns null. For more information, see RegisterType. To set the default version of an extension, use SetTypeDefaultVersion.
     */
    DefaultVersionId?: TypeVersionId;
    /**
     * The Amazon Resource Name (ARN) of the extension.
     */
    TypeArn?: TypeArn;
    /**
     * When the specified extension version was registered. This applies only to:   Private extensions you have registered in your account. For more information, see RegisterType.   Public extensions you have activated in your account with auto-update specified. For more information, see ActivateType.   For all other extension types, CloudFormation returns null.
     */
    LastUpdated?: Timestamp;
    /**
     * The description of the extension.
     */
    Description?: Description;
    /**
     * The ID of the extension publisher, if the extension is published by a third party. Extensions published by Amazon don't return a publisher ID.
     */
    PublisherId?: PublisherId;
    /**
     * For public extensions that have been activated for this account and Region, the type name of the public extension. If you specified a TypeNameAlias when enabling the extension in this account and Region, CloudFormation treats that alias as the extension's type name within the account and Region, not the type name of the public extension. For more information, see Specifying aliases to refer to extensions in the CloudFormation User Guide.
     */
    OriginalTypeName?: TypeName;
    /**
     * For public extensions that have been activated for this account and Region, the version of the public extension to be used for CloudFormation operations in this account and Region. How you specified AutoUpdate when enabling the extension affects whether CloudFormation automatically updates the extension in this account and Region when a new version is released. For more information, see Setting CloudFormation to automatically use new versions of extensions in the CloudFormation User Guide.
     */
    PublicVersionNumber?: PublicVersionNumber;
    /**
     * For public extensions that have been activated for this account and Region, the latest version of the public extension that is available. For any extensions other than activated third-arty extensions, CloudFormation returns null. How you specified AutoUpdate when enabling the extension affects whether CloudFormation automatically updates the extension in this account and Region when a new version is released. For more information, see Setting CloudFormation to automatically use new versions of extensions in the CloudFormation User Guide.
     */
    LatestPublicVersion?: PublicVersionNumber;
    /**
     * The service used to verify the publisher identity. For more information, see Registering your account to publish CloudFormation extensions in the  CFN-CLI User Guide for Extension Development.
     */
    PublisherIdentity?: IdentityProvider;
    /**
     * The publisher name, as defined in the public profile for that publisher in the service used to verify the publisher identity.
     */
    PublisherName?: PublisherName;
    /**
     * Whether the extension is activated for this account and Region. This applies only to third-party public extensions. Extensions published by Amazon are activated by default.
     */
    IsActivated?: IsActivated;
  }
  export type TypeTestsStatus = "PASSED"|"FAILED"|"IN_PROGRESS"|"NOT_TESTED"|string;
  export type TypeTestsStatusDescription = string;
  export type TypeVersionId = string;
  export type TypeVersionSummaries = TypeVersionSummary[];
  export interface TypeVersionSummary {
    /**
     * The kind of extension.
     */
    Type?: RegistryType;
    /**
     * The name of the extension.
     */
    TypeName?: TypeName;
    /**
     * The ID of a specific version of the extension. The version ID is the value at the end of the Amazon Resource Name (ARN) assigned to the extension version when it's registered.
     */
    VersionId?: TypeVersionId;
    /**
     * Whether the specified extension version is set as the default version. This applies only to private extensions you have registered in your account, and extensions published by Amazon. For public third-party extensions, CloudFormation returns null.
     */
    IsDefaultVersion?: IsDefaultVersion;
    /**
     * The Amazon Resource Name (ARN) of the extension version.
     */
    Arn?: TypeArn;
    /**
     * When the version was registered.
     */
    TimeCreated?: Timestamp;
    /**
     * The description of the extension version.
     */
    Description?: Description;
    /**
     * For public extensions that have been activated for this account and Region, the version of the public extension to be used for CloudFormation operations in this account and Region. For any extensions other than activated third-arty extensions, CloudFormation returns null. How you specified AutoUpdate when enabling the extension affects whether CloudFormation automatically updates the extension in this account and Region when a new version is released. For more information, see Setting CloudFormation to automatically use new versions of extensions in the CloudFormation User Guide.
     */
    PublicVersionNumber?: PublicVersionNumber;
  }
  export type UnprocessedTypeConfigurations = TypeConfigurationIdentifier[];
  export interface UpdateStackInput {
    /**
     * The name or unique stack ID of the stack to update.
     */
    StackName: StackName;
    /**
     * Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes. (For more information, go to Template Anatomy in the CloudFormation User Guide.) Conditional: You must specify only one of the following parameters: TemplateBody, TemplateURL, or set the UsePreviousTemplate to true.
     */
    TemplateBody?: TemplateBody;
    /**
     * Location of file containing the template body. The URL must point to a template that's located in an Amazon S3 bucket or a Systems Manager document. For more information, go to Template Anatomy in the CloudFormation User Guide. Conditional: You must specify only one of the following parameters: TemplateBody, TemplateURL, or set the UsePreviousTemplate to true.
     */
    TemplateURL?: TemplateURL;
    /**
     * Reuse the existing template that is associated with the stack that you are updating. Conditional: You must specify only one of the following parameters: TemplateBody, TemplateURL, or set the UsePreviousTemplate to true.
     */
    UsePreviousTemplate?: UsePreviousTemplate;
    /**
     * Structure containing the temporary overriding stack policy body. You can specify either the StackPolicyDuringUpdateBody or the StackPolicyDuringUpdateURL parameter, but not both. If you want to update protected resources, specify a temporary overriding stack policy during this update. If you don't specify a stack policy, the current policy that is associated with the stack will be used.
     */
    StackPolicyDuringUpdateBody?: StackPolicyDuringUpdateBody;
    /**
     * Location of a file containing the temporary overriding stack policy. The URL must point to a policy (max size: 16KB) located in an S3 bucket in the same Region as the stack. You can specify either the StackPolicyDuringUpdateBody or the StackPolicyDuringUpdateURL parameter, but not both. If you want to update protected resources, specify a temporary overriding stack policy during this update. If you don't specify a stack policy, the current policy that is associated with the stack will be used.
     */
    StackPolicyDuringUpdateURL?: StackPolicyDuringUpdateURL;
    /**
     * A list of Parameter structures that specify input parameters for the stack. For more information, see the Parameter data type.
     */
    Parameters?: Parameters;
    /**
     * In some cases, you must explicitly acknowledge that your stack template contains certain capabilities in order for CloudFormation to update the stack.    CAPABILITY_IAM and CAPABILITY_NAMED_IAM  Some stack templates might include resources that can affect permissions in your Amazon Web Services account; for example, by creating new Identity and Access Management (IAM) users. For those stacks, you must explicitly acknowledge this by specifying one of these capabilities. The following IAM resources require you to specify either the CAPABILITY_IAM or CAPABILITY_NAMED_IAM capability.   If you have IAM resources, you can specify either capability.   If you have IAM resources with custom names, you must specify CAPABILITY_NAMED_IAM.   If you don't specify either of these capabilities, CloudFormation returns an InsufficientCapabilities error.   If your stack template contains these resources, we suggest that you review all permissions associated with them and edit their permissions if necessary.     AWS::IAM::AccessKey      AWS::IAM::Group     AWS::IAM::InstanceProfile      AWS::IAM::Policy      AWS::IAM::Role      AWS::IAM::User     AWS::IAM::UserToGroupAddition    For more information, see Acknowledging IAM Resources in CloudFormation Templates.    CAPABILITY_AUTO_EXPAND  Some template contain macros. Macros perform custom processing on templates; this can include simple actions like find-and-replace operations, all the way to extensive transformations of entire templates. Because of this, users typically create a change set from the processed template, so that they can review the changes resulting from the macros before actually updating the stack. If your stack template contains one or more macros, and you choose to update a stack directly from the processed template, without first reviewing the resulting changes in a change set, you must acknowledge this capability. This includes the AWS::Include and AWS::Serverless transforms, which are macros hosted by CloudFormation. If you want to update a stack from a stack template that contains macros and nested stacks, you must update the stack directly from the template using this capability.  You should only update stacks directly from a stack template that contains macros if you know what processing the macro performs. Each macro relies on an underlying Lambda service function for processing stack templates. Be aware that the Lambda function owner can update the function operation without CloudFormation being notified.  For more information, see Using CloudFormation Macros to Perform Custom Processing on Templates.  
     */
    Capabilities?: Capabilities;
    /**
     * The template resource types that you have permissions to work with for this update stack action, such as AWS::EC2::Instance, AWS::EC2::*, or Custom::MyCustomInstance. If the list of resource types doesn't include a resource that you're updating, the stack update fails. By default, CloudFormation grants permissions to all resource types. Identity and Access Management (IAM) uses this parameter for CloudFormation-specific condition keys in IAM policies. For more information, see Controlling Access with Identity and Access Management.
     */
    ResourceTypes?: ResourceTypes;
    /**
     * The Amazon Resource Name (ARN) of an Identity and Access Management (IAM) role that CloudFormation assumes to update the stack. CloudFormation uses the role's credentials to make calls on your behalf. CloudFormation always uses this role for all future operations on the stack. Provided that users have permission to operate on the stack, CloudFormation uses this role even if the users don't have permission to pass it. Ensure that the role grants least privilege. If you don't specify a value, CloudFormation uses the role that was previously associated with the stack. If no role is available, CloudFormation uses a temporary session that is generated from your user credentials.
     */
    RoleARN?: RoleARN;
    /**
     * The rollback triggers for CloudFormation to monitor during stack creation and updating operations, and for the specified monitoring period afterwards.
     */
    RollbackConfiguration?: RollbackConfiguration;
    /**
     * Structure containing a new stack policy body. You can specify either the StackPolicyBody or the StackPolicyURL parameter, but not both. You might update the stack policy, for example, in order to protect a new resource that you created during a stack update. If you don't specify a stack policy, the current policy that is associated with the stack is unchanged.
     */
    StackPolicyBody?: StackPolicyBody;
    /**
     * Location of a file containing the updated stack policy. The URL must point to a policy (max size: 16KB) located in an S3 bucket in the same Region as the stack. You can specify either the StackPolicyBody or the StackPolicyURL parameter, but not both. You might update the stack policy, for example, in order to protect a new resource that you created during a stack update. If you don't specify a stack policy, the current policy that is associated with the stack is unchanged.
     */
    StackPolicyURL?: StackPolicyURL;
    /**
     * Amazon Simple Notification Service topic Amazon Resource Names (ARNs) that CloudFormation associates with the stack. Specify an empty list to remove all notification topics.
     */
    NotificationARNs?: NotificationARNs;
    /**
     * Key-value pairs to associate with this stack. CloudFormation also propagates these tags to supported resources in the stack. You can specify a maximum number of 50 tags. If you don't specify this parameter, CloudFormation doesn't modify the stack's tags. If you specify an empty value, CloudFormation removes all associated tags.
     */
    Tags?: Tags;
    /**
     * Preserve the state of previously provisioned resources when an operation fails. Default: False 
     */
    DisableRollback?: DisableRollback;
    /**
     * A unique identifier for this UpdateStack request. Specify this token if you plan to retry requests so that CloudFormation knows that you're not attempting to update a stack with the same name. You might retry UpdateStack requests to ensure that CloudFormation successfully received them. All events triggered by a given stack operation are assigned the same client request token, which you can use to track operations. For example, if you execute a CreateStack operation with the token token1, then all the StackEvents generated by that operation will have ClientRequestToken set as token1. In the console, stack operations display the client request token on the Events tab. Stack operations that are initiated from the console use the token format Console-StackOperation-ID, which helps you easily identify the stack operation . For example, if you create a stack using the console, each stack event would be assigned the same token in the following format: Console-CreateStack-7f59c3cf-00d2-40c7-b2ff-e75db0987002.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * When set to true, newly created resources are deleted when the operation rolls back. This includes newly created resources marked with a deletion policy of Retain. Default: false 
     */
    RetainExceptOnCreate?: RetainExceptOnCreate;
  }
  export interface UpdateStackInstancesInput {
    /**
     * The name or unique ID of the stack set associated with the stack instances.
     */
    StackSetName: StackSetNameOrId;
    /**
     * [Self-managed permissions] The names of one or more Amazon Web Services accounts for which you want to update parameter values for stack instances. The overridden parameter values will be applied to all stack instances in the specified accounts and Amazon Web Services Regions. You can specify Accounts or DeploymentTargets, but not both.
     */
    Accounts?: AccountList;
    /**
     * [Service-managed permissions] The Organizations accounts for which you want to update parameter values for stack instances. If your update targets OUs, the overridden parameter values only apply to the accounts that are currently in the target OUs and their child OUs. Accounts added to the target OUs and their child OUs in the future won't use the overridden values. You can specify Accounts or DeploymentTargets, but not both.
     */
    DeploymentTargets?: DeploymentTargets;
    /**
     * The names of one or more Amazon Web Services Regions in which you want to update parameter values for stack instances. The overridden parameter values will be applied to all stack instances in the specified accounts and Amazon Web Services Regions.
     */
    Regions: RegionList;
    /**
     * A list of input parameters whose values you want to update for the specified stack instances. Any overridden parameter values will be applied to all stack instances in the specified accounts and Amazon Web Services Regions. When specifying parameters and their values, be aware of how CloudFormation sets parameter values during stack instance update operations:   To override the current value for a parameter, include the parameter and specify its value.   To leave an overridden parameter set to its present value, include the parameter and specify UsePreviousValue as true. (You can't specify both a value and set UsePreviousValue to true.)   To set an overridden parameter back to the value specified in the stack set, specify a parameter list but don't include the parameter in the list.   To leave all parameters set to their present values, don't specify this property at all.   During stack set updates, any parameter values overridden for a stack instance aren't updated, but retain their overridden value. You can only override the parameter values that are specified in the stack set; to add or delete a parameter itself, use UpdateStackSet to update the stack set template. If you add a parameter to a template, before you can override the parameter value specified in the stack set you must first use UpdateStackSet to update all stack instances with the updated template and parameter value specified in the stack set. Once a stack instance has been updated with the new parameter, you can then override the parameter value using UpdateStackInstances.
     */
    ParameterOverrides?: Parameters;
    /**
     * Preferences for how CloudFormation performs this stack set operation.
     */
    OperationPreferences?: StackSetOperationPreferences;
    /**
     * The unique identifier for this stack set operation. The operation ID also functions as an idempotency token, to ensure that CloudFormation performs the stack set operation only once, even if you retry the request multiple times. You might retry stack set operation requests to ensure that CloudFormation successfully received them. If you don't specify an operation ID, the SDK generates one automatically.
     */
    OperationId?: ClientRequestToken;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
  }
  export interface UpdateStackInstancesOutput {
    /**
     * The unique identifier for this stack set operation.
     */
    OperationId?: ClientRequestToken;
  }
  export interface UpdateStackOutput {
    /**
     * Unique identifier of the stack.
     */
    StackId?: StackId;
  }
  export interface UpdateStackSetInput {
    /**
     * The name or unique ID of the stack set that you want to update.
     */
    StackSetName: StackSetName;
    /**
     * A brief description of updates that you are making.
     */
    Description?: Description;
    /**
     * The structure that contains the template body, with a minimum length of 1 byte and a maximum length of 51,200 bytes. For more information, see Template Anatomy in the CloudFormation User Guide. Conditional: You must specify only one of the following parameters: TemplateBody or TemplateURL—or set UsePreviousTemplate to true.
     */
    TemplateBody?: TemplateBody;
    /**
     * The location of the file that contains the template body. The URL must point to a template (maximum size: 460,800 bytes) that is located in an Amazon S3 bucket or a Systems Manager document. For more information, see Template Anatomy in the CloudFormation User Guide. Conditional: You must specify only one of the following parameters: TemplateBody or TemplateURL—or set UsePreviousTemplate to true.
     */
    TemplateURL?: TemplateURL;
    /**
     * Use the existing template that's associated with the stack set that you're updating. Conditional: You must specify only one of the following parameters: TemplateBody or TemplateURL—or set UsePreviousTemplate to true.
     */
    UsePreviousTemplate?: UsePreviousTemplate;
    /**
     * A list of input parameters for the stack set template.
     */
    Parameters?: Parameters;
    /**
     * In some cases, you must explicitly acknowledge that your stack template contains certain capabilities in order for CloudFormation to update the stack set and its associated stack instances.    CAPABILITY_IAM and CAPABILITY_NAMED_IAM  Some stack templates might include resources that can affect permissions in your Amazon Web Services account; for example, by creating new Identity and Access Management (IAM) users. For those stacks sets, you must explicitly acknowledge this by specifying one of these capabilities. The following IAM resources require you to specify either the CAPABILITY_IAM or CAPABILITY_NAMED_IAM capability.   If you have IAM resources, you can specify either capability.   If you have IAM resources with custom names, you must specify CAPABILITY_NAMED_IAM.   If you don't specify either of these capabilities, CloudFormation returns an InsufficientCapabilities error.   If your stack template contains these resources, we recommend that you review all permissions associated with them and edit their permissions if necessary.     AWS::IAM::AccessKey      AWS::IAM::Group      AWS::IAM::InstanceProfile      AWS::IAM::Policy      AWS::IAM::Role      AWS::IAM::User      AWS::IAM::UserToGroupAddition    For more information, see Acknowledging IAM Resources in CloudFormation Templates.    CAPABILITY_AUTO_EXPAND  Some templates reference macros. If your stack set template references one or more macros, you must update the stack set directly from the processed template, without first reviewing the resulting changes in a change set. To update the stack set directly, you must acknowledge this capability. For more information, see Using CloudFormation Macros to Perform Custom Processing on Templates.  Stack sets with service-managed permissions do not currently support the use of macros in templates. (This includes the AWS::Include and AWS::Serverless transforms, which are macros hosted by CloudFormation.) Even if you specify this capability for a stack set with service-managed permissions, if you reference a macro in your template the stack set operation will fail.   
     */
    Capabilities?: Capabilities;
    /**
     * The key-value pairs to associate with this stack set and the stacks created from it. CloudFormation also propagates these tags to supported resources that are created in the stacks. You can specify a maximum number of 50 tags. If you specify tags for this parameter, those tags replace any list of tags that are currently associated with this stack set. This means:   If you don't specify this parameter, CloudFormation doesn't modify the stack's tags.   If you specify any tags using this parameter, you must specify all the tags that you want associated with this stack set, even tags you've specified before (for example, when creating the stack set or during a previous update of the stack set.). Any tags that you don't include in the updated list of tags are removed from the stack set, and therefore from the stacks and resources as well.   If you specify an empty value, CloudFormation removes all currently associated tags.   If you specify new tags as part of an UpdateStackSet action, CloudFormation checks to see if you have the required IAM permission to tag resources. If you omit tags that are currently associated with the stack set from the list of tags you specify, CloudFormation assumes that you want to remove those tags from the stack set, and checks to see if you have permission to untag resources. If you don't have the necessary permission(s), the entire UpdateStackSet action fails with an access denied error, and the stack set is not updated.
     */
    Tags?: Tags;
    /**
     * Preferences for how CloudFormation performs this stack set operation.
     */
    OperationPreferences?: StackSetOperationPreferences;
    /**
     * The Amazon Resource Name (ARN) of the IAM role to use to update this stack set. Specify an IAM role only if you are using customized administrator roles to control which users or groups can manage specific stack sets within the same administrator account. For more information, see Granting Permissions for Stack Set Operations in the CloudFormation User Guide. If you specified a customized administrator role when you created the stack set, you must specify a customized administrator role, even if it is the same customized administrator role used with this stack set previously.
     */
    AdministrationRoleARN?: RoleARN;
    /**
     * The name of the IAM execution role to use to update the stack set. If you do not specify an execution role, CloudFormation uses the AWSCloudFormationStackSetExecutionRole role for the stack set operation. Specify an IAM role only if you are using customized execution roles to control which stack resources users and groups can include in their stack sets. If you specify a customized execution role, CloudFormation uses that role to update the stack. If you do not specify a customized execution role, CloudFormation performs the update using the role previously associated with the stack set, so long as you have permissions to perform operations on the stack set.
     */
    ExecutionRoleName?: ExecutionRoleName;
    /**
     * [Service-managed permissions] The Organizations accounts in which to update associated stack instances. To update all the stack instances associated with this stack set, do not specify DeploymentTargets or Regions. If the stack set update includes changes to the template (that is, if TemplateBody or TemplateURL is specified), or the Parameters, CloudFormation marks all stack instances with a status of OUTDATED prior to updating the stack instances in the specified accounts and Amazon Web Services Regions. If the stack set update doesn't include changes to the template or parameters, CloudFormation updates the stack instances in the specified accounts and Regions, while leaving all other stack instances with their existing stack instance status.
     */
    DeploymentTargets?: DeploymentTargets;
    /**
     * Describes how the IAM roles required for stack set operations are created. You cannot modify PermissionModel if there are stack instances associated with your stack set.   With self-managed permissions, you must create the administrator and execution roles required to deploy to target accounts. For more information, see Grant Self-Managed Stack Set Permissions.   With service-managed permissions, StackSets automatically creates the IAM roles required to deploy to accounts managed by Organizations. For more information, see Grant Service-Managed Stack Set Permissions.  
     */
    PermissionModel?: PermissionModels;
    /**
     * [Service-managed permissions] Describes whether StackSets automatically deploys to Organizations accounts that are added to a target organization or organizational unit (OU). If you specify AutoDeployment, don't specify DeploymentTargets or Regions.
     */
    AutoDeployment?: AutoDeployment;
    /**
     * The unique ID for this stack set operation. The operation ID also functions as an idempotency token, to ensure that CloudFormation performs the stack set operation only once, even if you retry the request multiple times. You might retry stack set operation requests to ensure that CloudFormation successfully received them. If you don't specify an operation ID, CloudFormation generates one automatically. Repeating this stack set operation with a new operation ID retries all stack instances whose status is OUTDATED.
     */
    OperationId?: ClientRequestToken;
    /**
     * [Self-managed permissions] The accounts in which to update associated stack instances. If you specify accounts, you must also specify the Amazon Web Services Regions in which to update stack set instances. To update all the stack instances associated with this stack set, don't specify the Accounts or Regions properties. If the stack set update includes changes to the template (that is, if the TemplateBody or TemplateURL properties are specified), or the Parameters property, CloudFormation marks all stack instances with a status of OUTDATED prior to updating the stack instances in the specified accounts and Amazon Web Services Regions. If the stack set update does not include changes to the template or parameters, CloudFormation updates the stack instances in the specified accounts and Amazon Web Services Regions, while leaving all other stack instances with their existing stack instance status.
     */
    Accounts?: AccountList;
    /**
     * The Amazon Web Services Regions in which to update associated stack instances. If you specify Regions, you must also specify accounts in which to update stack set instances. To update all the stack instances associated with this stack set, do not specify the Accounts or Regions properties. If the stack set update includes changes to the template (that is, if the TemplateBody or TemplateURL properties are specified), or the Parameters property, CloudFormation marks all stack instances with a status of OUTDATED prior to updating the stack instances in the specified accounts and Regions. If the stack set update does not include changes to the template or parameters, CloudFormation updates the stack instances in the specified accounts and Regions, while leaving all other stack instances with their existing stack instance status.
     */
    Regions?: RegionList;
    /**
     * [Service-managed permissions] Specifies whether you are acting as an account administrator in the organization's management account or as a delegated administrator in a member account. By default, SELF is specified. Use SELF for stack sets with self-managed permissions.   If you are signed in to the management account, specify SELF.   If you are signed in to a delegated administrator account, specify DELEGATED_ADMIN. Your Amazon Web Services account must be registered as a delegated administrator in the management account. For more information, see Register a delegated administrator in the CloudFormation User Guide.  
     */
    CallAs?: CallAs;
    /**
     * Describes whether StackSets performs non-conflicting operations concurrently and queues conflicting operations.
     */
    ManagedExecution?: ManagedExecution;
  }
  export interface UpdateStackSetOutput {
    /**
     * The unique ID for this stack set operation.
     */
    OperationId?: ClientRequestToken;
  }
  export interface UpdateTerminationProtectionInput {
    /**
     * Whether to enable termination protection on the specified stack.
     */
    EnableTerminationProtection: EnableTerminationProtection;
    /**
     * The name or unique ID of the stack for which you want to set termination protection.
     */
    StackName: StackNameOrId;
  }
  export interface UpdateTerminationProtectionOutput {
    /**
     * The unique ID of the stack.
     */
    StackId?: StackId;
  }
  export type Url = string;
  export type UsePreviousTemplate = boolean;
  export type UsePreviousValue = boolean;
  export interface ValidateTemplateInput {
    /**
     * Structure containing the template body with a minimum length of 1 byte and a maximum length of 51,200 bytes. For more information, go to Template Anatomy in the CloudFormation User Guide. Conditional: You must pass TemplateURL or TemplateBody. If both are passed, only TemplateBody is used.
     */
    TemplateBody?: TemplateBody;
    /**
     * Location of file containing the template body. The URL must point to a template (max size: 460,800 bytes) that is located in an Amazon S3 bucket or a Systems Manager document. For more information, go to Template Anatomy in the CloudFormation User Guide. Conditional: You must pass TemplateURL or TemplateBody. If both are passed, only TemplateBody is used.
     */
    TemplateURL?: TemplateURL;
  }
  export interface ValidateTemplateOutput {
    /**
     * A list of TemplateParameter structures.
     */
    Parameters?: TemplateParameters;
    /**
     * The description found within the template.
     */
    Description?: Description;
    /**
     * The capabilities found within the template. If your template contains IAM resources, you must specify the CAPABILITY_IAM or CAPABILITY_NAMED_IAM value for this parameter when you use the CreateStack or UpdateStack actions with your template; otherwise, those actions return an InsufficientCapabilities error. For more information, see Acknowledging IAM Resources in CloudFormation Templates.
     */
    Capabilities?: Capabilities;
    /**
     * The list of resources that generated the values in the Capabilities response element.
     */
    CapabilitiesReason?: CapabilitiesReason;
    /**
     * A list of the transforms that are declared in the template.
     */
    DeclaredTransforms?: TransformsList;
  }
  export type Value = string;
  export type Version = string;
  export type VersionBump = "MAJOR"|"MINOR"|string;
  export type Visibility = "PUBLIC"|"PRIVATE"|string;
  export interface Warnings {
    /**
     * A list of all of the unrecognized resource types. This is only returned if the TemplateSummaryConfig parameter has the TreatUnrecognizedResourceTypesAsWarning configuration set to True.
     */
    UnrecognizedResourceTypes?: ResourceTypes;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2010-05-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the CloudFormation client.
   */
  export import Types = CloudFormation;
}
export = CloudFormation;
