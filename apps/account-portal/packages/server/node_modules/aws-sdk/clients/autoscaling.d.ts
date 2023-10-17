import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AutoScaling extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AutoScaling.Types.ClientConfiguration)
  config: Config & AutoScaling.Types.ClientConfiguration;
  /**
   * Attaches one or more EC2 instances to the specified Auto Scaling group. When you attach instances, Amazon EC2 Auto Scaling increases the desired capacity of the group by the number of instances being attached. If the number of instances being attached plus the desired capacity of the group exceeds the maximum size of the group, the operation fails. If there is a Classic Load Balancer attached to your Auto Scaling group, the instances are also registered with the load balancer. If there are target groups attached to your Auto Scaling group, the instances are also registered with the target groups. For more information, see Attach EC2 instances to your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
   */
  attachInstances(params: AutoScaling.Types.AttachInstancesQuery, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Attaches one or more EC2 instances to the specified Auto Scaling group. When you attach instances, Amazon EC2 Auto Scaling increases the desired capacity of the group by the number of instances being attached. If the number of instances being attached plus the desired capacity of the group exceeds the maximum size of the group, the operation fails. If there is a Classic Load Balancer attached to your Auto Scaling group, the instances are also registered with the load balancer. If there are target groups attached to your Auto Scaling group, the instances are also registered with the target groups. For more information, see Attach EC2 instances to your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
   */
  attachInstances(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  This API operation is superseded by AttachTrafficSources, which can attach multiple traffic sources types. We recommend using AttachTrafficSources to simplify how you manage traffic sources. However, we continue to support AttachLoadBalancerTargetGroups. You can use both the original AttachLoadBalancerTargetGroups API operation and AttachTrafficSources on the same Auto Scaling group.  Attaches one or more target groups to the specified Auto Scaling group. This operation is used with the following load balancer types:    Application Load Balancer - Operates at the application layer (layer 7) and supports HTTP and HTTPS.    Network Load Balancer - Operates at the transport layer (layer 4) and supports TCP, TLS, and UDP.    Gateway Load Balancer - Operates at the network layer (layer 3).   To describe the target groups for an Auto Scaling group, call the DescribeLoadBalancerTargetGroups API. To detach the target group from the Auto Scaling group, call the DetachLoadBalancerTargetGroups API. This operation is additive and does not detach existing target groups or Classic Load Balancers from the Auto Scaling group. For more information, see Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide. 
   */
  attachLoadBalancerTargetGroups(params: AutoScaling.Types.AttachLoadBalancerTargetGroupsType, callback?: (err: AWSError, data: AutoScaling.Types.AttachLoadBalancerTargetGroupsResultType) => void): Request<AutoScaling.Types.AttachLoadBalancerTargetGroupsResultType, AWSError>;
  /**
   *  This API operation is superseded by AttachTrafficSources, which can attach multiple traffic sources types. We recommend using AttachTrafficSources to simplify how you manage traffic sources. However, we continue to support AttachLoadBalancerTargetGroups. You can use both the original AttachLoadBalancerTargetGroups API operation and AttachTrafficSources on the same Auto Scaling group.  Attaches one or more target groups to the specified Auto Scaling group. This operation is used with the following load balancer types:    Application Load Balancer - Operates at the application layer (layer 7) and supports HTTP and HTTPS.    Network Load Balancer - Operates at the transport layer (layer 4) and supports TCP, TLS, and UDP.    Gateway Load Balancer - Operates at the network layer (layer 3).   To describe the target groups for an Auto Scaling group, call the DescribeLoadBalancerTargetGroups API. To detach the target group from the Auto Scaling group, call the DetachLoadBalancerTargetGroups API. This operation is additive and does not detach existing target groups or Classic Load Balancers from the Auto Scaling group. For more information, see Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide. 
   */
  attachLoadBalancerTargetGroups(callback?: (err: AWSError, data: AutoScaling.Types.AttachLoadBalancerTargetGroupsResultType) => void): Request<AutoScaling.Types.AttachLoadBalancerTargetGroupsResultType, AWSError>;
  /**
   *  This API operation is superseded by AttachTrafficSources, which can attach multiple traffic sources types. We recommend using AttachTrafficSources to simplify how you manage traffic sources. However, we continue to support AttachLoadBalancers. You can use both the original AttachLoadBalancers API operation and AttachTrafficSources on the same Auto Scaling group.  Attaches one or more Classic Load Balancers to the specified Auto Scaling group. Amazon EC2 Auto Scaling registers the running instances with these Classic Load Balancers. To describe the load balancers for an Auto Scaling group, call the DescribeLoadBalancers API. To detach a load balancer from the Auto Scaling group, call the DetachLoadBalancers API. This operation is additive and does not detach existing Classic Load Balancers or target groups from the Auto Scaling group. For more information, see Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
   */
  attachLoadBalancers(params: AutoScaling.Types.AttachLoadBalancersType, callback?: (err: AWSError, data: AutoScaling.Types.AttachLoadBalancersResultType) => void): Request<AutoScaling.Types.AttachLoadBalancersResultType, AWSError>;
  /**
   *  This API operation is superseded by AttachTrafficSources, which can attach multiple traffic sources types. We recommend using AttachTrafficSources to simplify how you manage traffic sources. However, we continue to support AttachLoadBalancers. You can use both the original AttachLoadBalancers API operation and AttachTrafficSources on the same Auto Scaling group.  Attaches one or more Classic Load Balancers to the specified Auto Scaling group. Amazon EC2 Auto Scaling registers the running instances with these Classic Load Balancers. To describe the load balancers for an Auto Scaling group, call the DescribeLoadBalancers API. To detach a load balancer from the Auto Scaling group, call the DetachLoadBalancers API. This operation is additive and does not detach existing Classic Load Balancers or target groups from the Auto Scaling group. For more information, see Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
   */
  attachLoadBalancers(callback?: (err: AWSError, data: AutoScaling.Types.AttachLoadBalancersResultType) => void): Request<AutoScaling.Types.AttachLoadBalancersResultType, AWSError>;
  /**
   * Attaches one or more traffic sources to the specified Auto Scaling group. You can use any of the following as traffic sources for an Auto Scaling group:   Application Load Balancer   Classic Load Balancer   Gateway Load Balancer   Network Load Balancer   VPC Lattice   This operation is additive and does not detach existing traffic sources from the Auto Scaling group.  After the operation completes, use the DescribeTrafficSources API to return details about the state of the attachments between traffic sources and your Auto Scaling group. To detach a traffic source from the Auto Scaling group, call the DetachTrafficSources API.
   */
  attachTrafficSources(params: AutoScaling.Types.AttachTrafficSourcesType, callback?: (err: AWSError, data: AutoScaling.Types.AttachTrafficSourcesResultType) => void): Request<AutoScaling.Types.AttachTrafficSourcesResultType, AWSError>;
  /**
   * Attaches one or more traffic sources to the specified Auto Scaling group. You can use any of the following as traffic sources for an Auto Scaling group:   Application Load Balancer   Classic Load Balancer   Gateway Load Balancer   Network Load Balancer   VPC Lattice   This operation is additive and does not detach existing traffic sources from the Auto Scaling group.  After the operation completes, use the DescribeTrafficSources API to return details about the state of the attachments between traffic sources and your Auto Scaling group. To detach a traffic source from the Auto Scaling group, call the DetachTrafficSources API.
   */
  attachTrafficSources(callback?: (err: AWSError, data: AutoScaling.Types.AttachTrafficSourcesResultType) => void): Request<AutoScaling.Types.AttachTrafficSourcesResultType, AWSError>;
  /**
   * Deletes one or more scheduled actions for the specified Auto Scaling group.
   */
  batchDeleteScheduledAction(params: AutoScaling.Types.BatchDeleteScheduledActionType, callback?: (err: AWSError, data: AutoScaling.Types.BatchDeleteScheduledActionAnswer) => void): Request<AutoScaling.Types.BatchDeleteScheduledActionAnswer, AWSError>;
  /**
   * Deletes one or more scheduled actions for the specified Auto Scaling group.
   */
  batchDeleteScheduledAction(callback?: (err: AWSError, data: AutoScaling.Types.BatchDeleteScheduledActionAnswer) => void): Request<AutoScaling.Types.BatchDeleteScheduledActionAnswer, AWSError>;
  /**
   * Creates or updates one or more scheduled scaling actions for an Auto Scaling group.
   */
  batchPutScheduledUpdateGroupAction(params: AutoScaling.Types.BatchPutScheduledUpdateGroupActionType, callback?: (err: AWSError, data: AutoScaling.Types.BatchPutScheduledUpdateGroupActionAnswer) => void): Request<AutoScaling.Types.BatchPutScheduledUpdateGroupActionAnswer, AWSError>;
  /**
   * Creates or updates one or more scheduled scaling actions for an Auto Scaling group.
   */
  batchPutScheduledUpdateGroupAction(callback?: (err: AWSError, data: AutoScaling.Types.BatchPutScheduledUpdateGroupActionAnswer) => void): Request<AutoScaling.Types.BatchPutScheduledUpdateGroupActionAnswer, AWSError>;
  /**
   * Cancels an instance refresh or rollback that is in progress. If an instance refresh or rollback is not in progress, an ActiveInstanceRefreshNotFound error occurs. This operation is part of the instance refresh feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group after you make configuration changes. When you cancel an instance refresh, this does not roll back any changes that it made. Use the RollbackInstanceRefresh API to roll back instead.
   */
  cancelInstanceRefresh(params: AutoScaling.Types.CancelInstanceRefreshType, callback?: (err: AWSError, data: AutoScaling.Types.CancelInstanceRefreshAnswer) => void): Request<AutoScaling.Types.CancelInstanceRefreshAnswer, AWSError>;
  /**
   * Cancels an instance refresh or rollback that is in progress. If an instance refresh or rollback is not in progress, an ActiveInstanceRefreshNotFound error occurs. This operation is part of the instance refresh feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group after you make configuration changes. When you cancel an instance refresh, this does not roll back any changes that it made. Use the RollbackInstanceRefresh API to roll back instead.
   */
  cancelInstanceRefresh(callback?: (err: AWSError, data: AutoScaling.Types.CancelInstanceRefreshAnswer) => void): Request<AutoScaling.Types.CancelInstanceRefreshAnswer, AWSError>;
  /**
   * Completes the lifecycle action for the specified token or instance with the specified result. This step is a part of the procedure for adding a lifecycle hook to an Auto Scaling group:   (Optional) Create a launch template or launch configuration with a user data script that runs while an instance is in a wait state due to a lifecycle hook.   (Optional) Create a Lambda function and a rule that allows Amazon EventBridge to invoke your Lambda function when an instance is put into a wait state due to a lifecycle hook.   (Optional) Create a notification target and an IAM role. The target can be either an Amazon SQS queue or an Amazon SNS topic. The role allows Amazon EC2 Auto Scaling to publish lifecycle notifications to the target.   Create the lifecycle hook. Specify whether the hook is used when the instances launch or terminate.   If you need more time, record the lifecycle action heartbeat to keep the instance in a wait state.    If you finish before the timeout period ends, send a callback by using the CompleteLifecycleAction API call.    For more information, see Complete a lifecycle action in the Amazon EC2 Auto Scaling User Guide.
   */
  completeLifecycleAction(params: AutoScaling.Types.CompleteLifecycleActionType, callback?: (err: AWSError, data: AutoScaling.Types.CompleteLifecycleActionAnswer) => void): Request<AutoScaling.Types.CompleteLifecycleActionAnswer, AWSError>;
  /**
   * Completes the lifecycle action for the specified token or instance with the specified result. This step is a part of the procedure for adding a lifecycle hook to an Auto Scaling group:   (Optional) Create a launch template or launch configuration with a user data script that runs while an instance is in a wait state due to a lifecycle hook.   (Optional) Create a Lambda function and a rule that allows Amazon EventBridge to invoke your Lambda function when an instance is put into a wait state due to a lifecycle hook.   (Optional) Create a notification target and an IAM role. The target can be either an Amazon SQS queue or an Amazon SNS topic. The role allows Amazon EC2 Auto Scaling to publish lifecycle notifications to the target.   Create the lifecycle hook. Specify whether the hook is used when the instances launch or terminate.   If you need more time, record the lifecycle action heartbeat to keep the instance in a wait state.    If you finish before the timeout period ends, send a callback by using the CompleteLifecycleAction API call.    For more information, see Complete a lifecycle action in the Amazon EC2 Auto Scaling User Guide.
   */
  completeLifecycleAction(callback?: (err: AWSError, data: AutoScaling.Types.CompleteLifecycleActionAnswer) => void): Request<AutoScaling.Types.CompleteLifecycleActionAnswer, AWSError>;
  /**
   *  We strongly recommend using a launch template when calling this operation to ensure full functionality for Amazon EC2 Auto Scaling and Amazon EC2.  Creates an Auto Scaling group with the specified name and attributes.  If you exceed your maximum limit of Auto Scaling groups, the call fails. To query this limit, call the DescribeAccountLimits API. For information about updating this limit, see Quotas for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. For introductory exercises for creating an Auto Scaling group, see Getting started with Amazon EC2 Auto Scaling and Tutorial: Set up a scaled and load-balanced application in the Amazon EC2 Auto Scaling User Guide. For more information, see Auto Scaling groups in the Amazon EC2 Auto Scaling User Guide. Every Auto Scaling group has three size properties (DesiredCapacity, MaxSize, and MinSize). Usually, you set these sizes based on a specific number of instances. However, if you configure a mixed instances policy that defines weights for the instance types, you must specify these sizes with the same units that you use for weighting instances.
   */
  createAutoScalingGroup(params: AutoScaling.Types.CreateAutoScalingGroupType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  We strongly recommend using a launch template when calling this operation to ensure full functionality for Amazon EC2 Auto Scaling and Amazon EC2.  Creates an Auto Scaling group with the specified name and attributes.  If you exceed your maximum limit of Auto Scaling groups, the call fails. To query this limit, call the DescribeAccountLimits API. For information about updating this limit, see Quotas for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. For introductory exercises for creating an Auto Scaling group, see Getting started with Amazon EC2 Auto Scaling and Tutorial: Set up a scaled and load-balanced application in the Amazon EC2 Auto Scaling User Guide. For more information, see Auto Scaling groups in the Amazon EC2 Auto Scaling User Guide. Every Auto Scaling group has three size properties (DesiredCapacity, MaxSize, and MinSize). Usually, you set these sizes based on a specific number of instances. However, if you configure a mixed instances policy that defines weights for the instance types, you must specify these sizes with the same units that you use for weighting instances.
   */
  createAutoScalingGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a launch configuration. If you exceed your maximum limit of launch configurations, the call fails. To query this limit, call the DescribeAccountLimits API. For information about updating this limit, see Quotas for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. For more information, see Launch configurations in the Amazon EC2 Auto Scaling User Guide.  Amazon EC2 Auto Scaling configures instances launched as part of an Auto Scaling group using either a launch template or a launch configuration. We strongly recommend that you do not use launch configurations. They do not provide full functionality for Amazon EC2 Auto Scaling or Amazon EC2. For information about using launch templates, see Launch templates in the Amazon EC2 Auto Scaling User Guide. 
   */
  createLaunchConfiguration(params: AutoScaling.Types.CreateLaunchConfigurationType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a launch configuration. If you exceed your maximum limit of launch configurations, the call fails. To query this limit, call the DescribeAccountLimits API. For information about updating this limit, see Quotas for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. For more information, see Launch configurations in the Amazon EC2 Auto Scaling User Guide.  Amazon EC2 Auto Scaling configures instances launched as part of an Auto Scaling group using either a launch template or a launch configuration. We strongly recommend that you do not use launch configurations. They do not provide full functionality for Amazon EC2 Auto Scaling or Amazon EC2. For information about using launch templates, see Launch templates in the Amazon EC2 Auto Scaling User Guide. 
   */
  createLaunchConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or updates tags for the specified Auto Scaling group. When you specify a tag with a key that already exists, the operation overwrites the previous tag definition, and you do not get an error message. For more information, see Tag Auto Scaling groups and instances in the Amazon EC2 Auto Scaling User Guide.
   */
  createOrUpdateTags(params: AutoScaling.Types.CreateOrUpdateTagsType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or updates tags for the specified Auto Scaling group. When you specify a tag with a key that already exists, the operation overwrites the previous tag definition, and you do not get an error message. For more information, see Tag Auto Scaling groups and instances in the Amazon EC2 Auto Scaling User Guide.
   */
  createOrUpdateTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Auto Scaling group. If the group has instances or scaling activities in progress, you must specify the option to force the deletion in order for it to succeed. The force delete operation will also terminate the EC2 instances. If the group has a warm pool, the force delete option also deletes the warm pool. To remove instances from the Auto Scaling group before deleting it, call the DetachInstances API with the list of instances and the option to decrement the desired capacity. This ensures that Amazon EC2 Auto Scaling does not launch replacement instances. To terminate all instances before deleting the Auto Scaling group, call the UpdateAutoScalingGroup API and set the minimum size and desired capacity of the Auto Scaling group to zero. If the group has scaling policies, deleting the group deletes the policies, the underlying alarm actions, and any alarm that no longer has an associated action. For more information, see Delete your Auto Scaling infrastructure in the Amazon EC2 Auto Scaling User Guide.
   */
  deleteAutoScalingGroup(params: AutoScaling.Types.DeleteAutoScalingGroupType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Auto Scaling group. If the group has instances or scaling activities in progress, you must specify the option to force the deletion in order for it to succeed. The force delete operation will also terminate the EC2 instances. If the group has a warm pool, the force delete option also deletes the warm pool. To remove instances from the Auto Scaling group before deleting it, call the DetachInstances API with the list of instances and the option to decrement the desired capacity. This ensures that Amazon EC2 Auto Scaling does not launch replacement instances. To terminate all instances before deleting the Auto Scaling group, call the UpdateAutoScalingGroup API and set the minimum size and desired capacity of the Auto Scaling group to zero. If the group has scaling policies, deleting the group deletes the policies, the underlying alarm actions, and any alarm that no longer has an associated action. For more information, see Delete your Auto Scaling infrastructure in the Amazon EC2 Auto Scaling User Guide.
   */
  deleteAutoScalingGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified launch configuration. The launch configuration must not be attached to an Auto Scaling group. When this call completes, the launch configuration is no longer available for use.
   */
  deleteLaunchConfiguration(params: AutoScaling.Types.LaunchConfigurationNameType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified launch configuration. The launch configuration must not be attached to an Auto Scaling group. When this call completes, the launch configuration is no longer available for use.
   */
  deleteLaunchConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified lifecycle hook. If there are any outstanding lifecycle actions, they are completed first (ABANDON for launching instances, CONTINUE for terminating instances).
   */
  deleteLifecycleHook(params: AutoScaling.Types.DeleteLifecycleHookType, callback?: (err: AWSError, data: AutoScaling.Types.DeleteLifecycleHookAnswer) => void): Request<AutoScaling.Types.DeleteLifecycleHookAnswer, AWSError>;
  /**
   * Deletes the specified lifecycle hook. If there are any outstanding lifecycle actions, they are completed first (ABANDON for launching instances, CONTINUE for terminating instances).
   */
  deleteLifecycleHook(callback?: (err: AWSError, data: AutoScaling.Types.DeleteLifecycleHookAnswer) => void): Request<AutoScaling.Types.DeleteLifecycleHookAnswer, AWSError>;
  /**
   * Deletes the specified notification.
   */
  deleteNotificationConfiguration(params: AutoScaling.Types.DeleteNotificationConfigurationType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified notification.
   */
  deleteNotificationConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified scaling policy. Deleting either a step scaling policy or a simple scaling policy deletes the underlying alarm action, but does not delete the alarm, even if it no longer has an associated action. For more information, see Deleting a scaling policy in the Amazon EC2 Auto Scaling User Guide.
   */
  deletePolicy(params: AutoScaling.Types.DeletePolicyType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified scaling policy. Deleting either a step scaling policy or a simple scaling policy deletes the underlying alarm action, but does not delete the alarm, even if it no longer has an associated action. For more information, see Deleting a scaling policy in the Amazon EC2 Auto Scaling User Guide.
   */
  deletePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified scheduled action.
   */
  deleteScheduledAction(params: AutoScaling.Types.DeleteScheduledActionType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified scheduled action.
   */
  deleteScheduledAction(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified tags.
   */
  deleteTags(params: AutoScaling.Types.DeleteTagsType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified tags.
   */
  deleteTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the warm pool for the specified Auto Scaling group. For more information, see Warm pools for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
   */
  deleteWarmPool(params: AutoScaling.Types.DeleteWarmPoolType, callback?: (err: AWSError, data: AutoScaling.Types.DeleteWarmPoolAnswer) => void): Request<AutoScaling.Types.DeleteWarmPoolAnswer, AWSError>;
  /**
   * Deletes the warm pool for the specified Auto Scaling group. For more information, see Warm pools for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
   */
  deleteWarmPool(callback?: (err: AWSError, data: AutoScaling.Types.DeleteWarmPoolAnswer) => void): Request<AutoScaling.Types.DeleteWarmPoolAnswer, AWSError>;
  /**
   * Describes the current Amazon EC2 Auto Scaling resource quotas for your account. When you establish an Amazon Web Services account, the account has initial quotas on the maximum number of Auto Scaling groups and launch configurations that you can create in a given Region. For more information, see Quotas for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
   */
  describeAccountLimits(callback?: (err: AWSError, data: AutoScaling.Types.DescribeAccountLimitsAnswer) => void): Request<AutoScaling.Types.DescribeAccountLimitsAnswer, AWSError>;
  /**
   * Describes the available adjustment types for step scaling and simple scaling policies. The following adjustment types are supported:    ChangeInCapacity     ExactCapacity     PercentChangeInCapacity   
   */
  describeAdjustmentTypes(callback?: (err: AWSError, data: AutoScaling.Types.DescribeAdjustmentTypesAnswer) => void): Request<AutoScaling.Types.DescribeAdjustmentTypesAnswer, AWSError>;
  /**
   * Gets information about the Auto Scaling groups in the account and Region. If you specify Auto Scaling group names, the output includes information for only the specified Auto Scaling groups. If you specify filters, the output includes information for only those Auto Scaling groups that meet the filter criteria. If you do not specify group names or filters, the output includes information for all Auto Scaling groups.  This operation also returns information about instances in Auto Scaling groups. To retrieve information about the instances in a warm pool, you must call the DescribeWarmPool API. 
   */
  describeAutoScalingGroups(params: AutoScaling.Types.AutoScalingGroupNamesType, callback?: (err: AWSError, data: AutoScaling.Types.AutoScalingGroupsType) => void): Request<AutoScaling.Types.AutoScalingGroupsType, AWSError>;
  /**
   * Gets information about the Auto Scaling groups in the account and Region. If you specify Auto Scaling group names, the output includes information for only the specified Auto Scaling groups. If you specify filters, the output includes information for only those Auto Scaling groups that meet the filter criteria. If you do not specify group names or filters, the output includes information for all Auto Scaling groups.  This operation also returns information about instances in Auto Scaling groups. To retrieve information about the instances in a warm pool, you must call the DescribeWarmPool API. 
   */
  describeAutoScalingGroups(callback?: (err: AWSError, data: AutoScaling.Types.AutoScalingGroupsType) => void): Request<AutoScaling.Types.AutoScalingGroupsType, AWSError>;
  /**
   * Gets information about the Auto Scaling instances in the account and Region.
   */
  describeAutoScalingInstances(params: AutoScaling.Types.DescribeAutoScalingInstancesType, callback?: (err: AWSError, data: AutoScaling.Types.AutoScalingInstancesType) => void): Request<AutoScaling.Types.AutoScalingInstancesType, AWSError>;
  /**
   * Gets information about the Auto Scaling instances in the account and Region.
   */
  describeAutoScalingInstances(callback?: (err: AWSError, data: AutoScaling.Types.AutoScalingInstancesType) => void): Request<AutoScaling.Types.AutoScalingInstancesType, AWSError>;
  /**
   * Describes the notification types that are supported by Amazon EC2 Auto Scaling.
   */
  describeAutoScalingNotificationTypes(callback?: (err: AWSError, data: AutoScaling.Types.DescribeAutoScalingNotificationTypesAnswer) => void): Request<AutoScaling.Types.DescribeAutoScalingNotificationTypesAnswer, AWSError>;
  /**
   * Gets information about the instance refreshes for the specified Auto Scaling group. This operation is part of the instance refresh feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group after you make configuration changes. To help you determine the status of an instance refresh, Amazon EC2 Auto Scaling returns information about the instance refreshes you previously initiated, including their status, start time, end time, the percentage of the instance refresh that is complete, and the number of instances remaining to update before the instance refresh is complete. If a rollback is initiated while an instance refresh is in progress, Amazon EC2 Auto Scaling also returns information about the rollback of the instance refresh.
   */
  describeInstanceRefreshes(params: AutoScaling.Types.DescribeInstanceRefreshesType, callback?: (err: AWSError, data: AutoScaling.Types.DescribeInstanceRefreshesAnswer) => void): Request<AutoScaling.Types.DescribeInstanceRefreshesAnswer, AWSError>;
  /**
   * Gets information about the instance refreshes for the specified Auto Scaling group. This operation is part of the instance refresh feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group after you make configuration changes. To help you determine the status of an instance refresh, Amazon EC2 Auto Scaling returns information about the instance refreshes you previously initiated, including their status, start time, end time, the percentage of the instance refresh that is complete, and the number of instances remaining to update before the instance refresh is complete. If a rollback is initiated while an instance refresh is in progress, Amazon EC2 Auto Scaling also returns information about the rollback of the instance refresh.
   */
  describeInstanceRefreshes(callback?: (err: AWSError, data: AutoScaling.Types.DescribeInstanceRefreshesAnswer) => void): Request<AutoScaling.Types.DescribeInstanceRefreshesAnswer, AWSError>;
  /**
   * Gets information about the launch configurations in the account and Region.
   */
  describeLaunchConfigurations(params: AutoScaling.Types.LaunchConfigurationNamesType, callback?: (err: AWSError, data: AutoScaling.Types.LaunchConfigurationsType) => void): Request<AutoScaling.Types.LaunchConfigurationsType, AWSError>;
  /**
   * Gets information about the launch configurations in the account and Region.
   */
  describeLaunchConfigurations(callback?: (err: AWSError, data: AutoScaling.Types.LaunchConfigurationsType) => void): Request<AutoScaling.Types.LaunchConfigurationsType, AWSError>;
  /**
   * Describes the available types of lifecycle hooks. The following hook types are supported:    autoscaling:EC2_INSTANCE_LAUNCHING     autoscaling:EC2_INSTANCE_TERMINATING   
   */
  describeLifecycleHookTypes(callback?: (err: AWSError, data: AutoScaling.Types.DescribeLifecycleHookTypesAnswer) => void): Request<AutoScaling.Types.DescribeLifecycleHookTypesAnswer, AWSError>;
  /**
   * Gets information about the lifecycle hooks for the specified Auto Scaling group.
   */
  describeLifecycleHooks(params: AutoScaling.Types.DescribeLifecycleHooksType, callback?: (err: AWSError, data: AutoScaling.Types.DescribeLifecycleHooksAnswer) => void): Request<AutoScaling.Types.DescribeLifecycleHooksAnswer, AWSError>;
  /**
   * Gets information about the lifecycle hooks for the specified Auto Scaling group.
   */
  describeLifecycleHooks(callback?: (err: AWSError, data: AutoScaling.Types.DescribeLifecycleHooksAnswer) => void): Request<AutoScaling.Types.DescribeLifecycleHooksAnswer, AWSError>;
  /**
   *  This API operation is superseded by DescribeTrafficSources, which can describe multiple traffic sources types. We recommend using DetachTrafficSources to simplify how you manage traffic sources. However, we continue to support DescribeLoadBalancerTargetGroups. You can use both the original DescribeLoadBalancerTargetGroups API operation and DescribeTrafficSources on the same Auto Scaling group.  Gets information about the Elastic Load Balancing target groups for the specified Auto Scaling group. To determine the attachment status of the target group, use the State element in the response. When you attach a target group to an Auto Scaling group, the initial State value is Adding. The state transitions to Added after all Auto Scaling instances are registered with the target group. If Elastic Load Balancing health checks are enabled for the Auto Scaling group, the state transitions to InService after at least one Auto Scaling instance passes the health check. When the target group is in the InService state, Amazon EC2 Auto Scaling can terminate and replace any instances that are reported as unhealthy. If no registered instances pass the health checks, the target group doesn't enter the InService state.  Target groups also have an InService state if you attach them in the CreateAutoScalingGroup API call. If your target group state is InService, but it is not working properly, check the scaling activities by calling DescribeScalingActivities and take any corrective actions necessary. For help with failed health checks, see Troubleshooting Amazon EC2 Auto Scaling: Health checks in the Amazon EC2 Auto Scaling User Guide. For more information, see Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.   You can use this operation to describe target groups that were attached by using AttachLoadBalancerTargetGroups, but not for target groups that were attached by using AttachTrafficSources. 
   */
  describeLoadBalancerTargetGroups(params: AutoScaling.Types.DescribeLoadBalancerTargetGroupsRequest, callback?: (err: AWSError, data: AutoScaling.Types.DescribeLoadBalancerTargetGroupsResponse) => void): Request<AutoScaling.Types.DescribeLoadBalancerTargetGroupsResponse, AWSError>;
  /**
   *  This API operation is superseded by DescribeTrafficSources, which can describe multiple traffic sources types. We recommend using DetachTrafficSources to simplify how you manage traffic sources. However, we continue to support DescribeLoadBalancerTargetGroups. You can use both the original DescribeLoadBalancerTargetGroups API operation and DescribeTrafficSources on the same Auto Scaling group.  Gets information about the Elastic Load Balancing target groups for the specified Auto Scaling group. To determine the attachment status of the target group, use the State element in the response. When you attach a target group to an Auto Scaling group, the initial State value is Adding. The state transitions to Added after all Auto Scaling instances are registered with the target group. If Elastic Load Balancing health checks are enabled for the Auto Scaling group, the state transitions to InService after at least one Auto Scaling instance passes the health check. When the target group is in the InService state, Amazon EC2 Auto Scaling can terminate and replace any instances that are reported as unhealthy. If no registered instances pass the health checks, the target group doesn't enter the InService state.  Target groups also have an InService state if you attach them in the CreateAutoScalingGroup API call. If your target group state is InService, but it is not working properly, check the scaling activities by calling DescribeScalingActivities and take any corrective actions necessary. For help with failed health checks, see Troubleshooting Amazon EC2 Auto Scaling: Health checks in the Amazon EC2 Auto Scaling User Guide. For more information, see Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.   You can use this operation to describe target groups that were attached by using AttachLoadBalancerTargetGroups, but not for target groups that were attached by using AttachTrafficSources. 
   */
  describeLoadBalancerTargetGroups(callback?: (err: AWSError, data: AutoScaling.Types.DescribeLoadBalancerTargetGroupsResponse) => void): Request<AutoScaling.Types.DescribeLoadBalancerTargetGroupsResponse, AWSError>;
  /**
   *  This API operation is superseded by DescribeTrafficSources, which can describe multiple traffic sources types. We recommend using DescribeTrafficSources to simplify how you manage traffic sources. However, we continue to support DescribeLoadBalancers. You can use both the original DescribeLoadBalancers API operation and DescribeTrafficSources on the same Auto Scaling group.  Gets information about the load balancers for the specified Auto Scaling group. This operation describes only Classic Load Balancers. If you have Application Load Balancers, Network Load Balancers, or Gateway Load Balancers, use the DescribeLoadBalancerTargetGroups API instead. To determine the attachment status of the load balancer, use the State element in the response. When you attach a load balancer to an Auto Scaling group, the initial State value is Adding. The state transitions to Added after all Auto Scaling instances are registered with the load balancer. If Elastic Load Balancing health checks are enabled for the Auto Scaling group, the state transitions to InService after at least one Auto Scaling instance passes the health check. When the load balancer is in the InService state, Amazon EC2 Auto Scaling can terminate and replace any instances that are reported as unhealthy. If no registered instances pass the health checks, the load balancer doesn't enter the InService state.  Load balancers also have an InService state if you attach them in the CreateAutoScalingGroup API call. If your load balancer state is InService, but it is not working properly, check the scaling activities by calling DescribeScalingActivities and take any corrective actions necessary. For help with failed health checks, see Troubleshooting Amazon EC2 Auto Scaling: Health checks in the Amazon EC2 Auto Scaling User Guide. For more information, see Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide. 
   */
  describeLoadBalancers(params: AutoScaling.Types.DescribeLoadBalancersRequest, callback?: (err: AWSError, data: AutoScaling.Types.DescribeLoadBalancersResponse) => void): Request<AutoScaling.Types.DescribeLoadBalancersResponse, AWSError>;
  /**
   *  This API operation is superseded by DescribeTrafficSources, which can describe multiple traffic sources types. We recommend using DescribeTrafficSources to simplify how you manage traffic sources. However, we continue to support DescribeLoadBalancers. You can use both the original DescribeLoadBalancers API operation and DescribeTrafficSources on the same Auto Scaling group.  Gets information about the load balancers for the specified Auto Scaling group. This operation describes only Classic Load Balancers. If you have Application Load Balancers, Network Load Balancers, or Gateway Load Balancers, use the DescribeLoadBalancerTargetGroups API instead. To determine the attachment status of the load balancer, use the State element in the response. When you attach a load balancer to an Auto Scaling group, the initial State value is Adding. The state transitions to Added after all Auto Scaling instances are registered with the load balancer. If Elastic Load Balancing health checks are enabled for the Auto Scaling group, the state transitions to InService after at least one Auto Scaling instance passes the health check. When the load balancer is in the InService state, Amazon EC2 Auto Scaling can terminate and replace any instances that are reported as unhealthy. If no registered instances pass the health checks, the load balancer doesn't enter the InService state.  Load balancers also have an InService state if you attach them in the CreateAutoScalingGroup API call. If your load balancer state is InService, but it is not working properly, check the scaling activities by calling DescribeScalingActivities and take any corrective actions necessary. For help with failed health checks, see Troubleshooting Amazon EC2 Auto Scaling: Health checks in the Amazon EC2 Auto Scaling User Guide. For more information, see Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide. 
   */
  describeLoadBalancers(callback?: (err: AWSError, data: AutoScaling.Types.DescribeLoadBalancersResponse) => void): Request<AutoScaling.Types.DescribeLoadBalancersResponse, AWSError>;
  /**
   * Describes the available CloudWatch metrics for Amazon EC2 Auto Scaling.
   */
  describeMetricCollectionTypes(callback?: (err: AWSError, data: AutoScaling.Types.DescribeMetricCollectionTypesAnswer) => void): Request<AutoScaling.Types.DescribeMetricCollectionTypesAnswer, AWSError>;
  /**
   * Gets information about the Amazon SNS notifications that are configured for one or more Auto Scaling groups.
   */
  describeNotificationConfigurations(params: AutoScaling.Types.DescribeNotificationConfigurationsType, callback?: (err: AWSError, data: AutoScaling.Types.DescribeNotificationConfigurationsAnswer) => void): Request<AutoScaling.Types.DescribeNotificationConfigurationsAnswer, AWSError>;
  /**
   * Gets information about the Amazon SNS notifications that are configured for one or more Auto Scaling groups.
   */
  describeNotificationConfigurations(callback?: (err: AWSError, data: AutoScaling.Types.DescribeNotificationConfigurationsAnswer) => void): Request<AutoScaling.Types.DescribeNotificationConfigurationsAnswer, AWSError>;
  /**
   * Gets information about the scaling policies in the account and Region.
   */
  describePolicies(params: AutoScaling.Types.DescribePoliciesType, callback?: (err: AWSError, data: AutoScaling.Types.PoliciesType) => void): Request<AutoScaling.Types.PoliciesType, AWSError>;
  /**
   * Gets information about the scaling policies in the account and Region.
   */
  describePolicies(callback?: (err: AWSError, data: AutoScaling.Types.PoliciesType) => void): Request<AutoScaling.Types.PoliciesType, AWSError>;
  /**
   * Gets information about the scaling activities in the account and Region. When scaling events occur, you see a record of the scaling activity in the scaling activities. For more information, see Verifying a scaling activity for an Auto Scaling group in the Amazon EC2 Auto Scaling User Guide. If the scaling event succeeds, the value of the StatusCode element in the response is Successful. If an attempt to launch instances failed, the StatusCode value is Failed or Cancelled and the StatusMessage element in the response indicates the cause of the failure. For help interpreting the StatusMessage, see Troubleshooting Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. 
   */
  describeScalingActivities(params: AutoScaling.Types.DescribeScalingActivitiesType, callback?: (err: AWSError, data: AutoScaling.Types.ActivitiesType) => void): Request<AutoScaling.Types.ActivitiesType, AWSError>;
  /**
   * Gets information about the scaling activities in the account and Region. When scaling events occur, you see a record of the scaling activity in the scaling activities. For more information, see Verifying a scaling activity for an Auto Scaling group in the Amazon EC2 Auto Scaling User Guide. If the scaling event succeeds, the value of the StatusCode element in the response is Successful. If an attempt to launch instances failed, the StatusCode value is Failed or Cancelled and the StatusMessage element in the response indicates the cause of the failure. For help interpreting the StatusMessage, see Troubleshooting Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. 
   */
  describeScalingActivities(callback?: (err: AWSError, data: AutoScaling.Types.ActivitiesType) => void): Request<AutoScaling.Types.ActivitiesType, AWSError>;
  /**
   * Describes the scaling process types for use with the ResumeProcesses and SuspendProcesses APIs.
   */
  describeScalingProcessTypes(callback?: (err: AWSError, data: AutoScaling.Types.ProcessesType) => void): Request<AutoScaling.Types.ProcessesType, AWSError>;
  /**
   * Gets information about the scheduled actions that haven't run or that have not reached their end time. To describe the scaling activities for scheduled actions that have already run, call the DescribeScalingActivities API.
   */
  describeScheduledActions(params: AutoScaling.Types.DescribeScheduledActionsType, callback?: (err: AWSError, data: AutoScaling.Types.ScheduledActionsType) => void): Request<AutoScaling.Types.ScheduledActionsType, AWSError>;
  /**
   * Gets information about the scheduled actions that haven't run or that have not reached their end time. To describe the scaling activities for scheduled actions that have already run, call the DescribeScalingActivities API.
   */
  describeScheduledActions(callback?: (err: AWSError, data: AutoScaling.Types.ScheduledActionsType) => void): Request<AutoScaling.Types.ScheduledActionsType, AWSError>;
  /**
   * Describes the specified tags. You can use filters to limit the results. For example, you can query for the tags for a specific Auto Scaling group. You can specify multiple values for a filter. A tag must match at least one of the specified values for it to be included in the results. You can also specify multiple filters. The result includes information for a particular tag only if it matches all the filters. If there's no match, no special message is returned. For more information, see Tag Auto Scaling groups and instances in the Amazon EC2 Auto Scaling User Guide.
   */
  describeTags(params: AutoScaling.Types.DescribeTagsType, callback?: (err: AWSError, data: AutoScaling.Types.TagsType) => void): Request<AutoScaling.Types.TagsType, AWSError>;
  /**
   * Describes the specified tags. You can use filters to limit the results. For example, you can query for the tags for a specific Auto Scaling group. You can specify multiple values for a filter. A tag must match at least one of the specified values for it to be included in the results. You can also specify multiple filters. The result includes information for a particular tag only if it matches all the filters. If there's no match, no special message is returned. For more information, see Tag Auto Scaling groups and instances in the Amazon EC2 Auto Scaling User Guide.
   */
  describeTags(callback?: (err: AWSError, data: AutoScaling.Types.TagsType) => void): Request<AutoScaling.Types.TagsType, AWSError>;
  /**
   * Describes the termination policies supported by Amazon EC2 Auto Scaling. For more information, see Work with Amazon EC2 Auto Scaling termination policies in the Amazon EC2 Auto Scaling User Guide.
   */
  describeTerminationPolicyTypes(callback?: (err: AWSError, data: AutoScaling.Types.DescribeTerminationPolicyTypesAnswer) => void): Request<AutoScaling.Types.DescribeTerminationPolicyTypesAnswer, AWSError>;
  /**
   * Gets information about the traffic sources for the specified Auto Scaling group. You can optionally provide a traffic source type. If you provide a traffic source type, then the results only include that traffic source type. If you do not provide a traffic source type, then the results include all the traffic sources for the specified Auto Scaling group. 
   */
  describeTrafficSources(params: AutoScaling.Types.DescribeTrafficSourcesRequest, callback?: (err: AWSError, data: AutoScaling.Types.DescribeTrafficSourcesResponse) => void): Request<AutoScaling.Types.DescribeTrafficSourcesResponse, AWSError>;
  /**
   * Gets information about the traffic sources for the specified Auto Scaling group. You can optionally provide a traffic source type. If you provide a traffic source type, then the results only include that traffic source type. If you do not provide a traffic source type, then the results include all the traffic sources for the specified Auto Scaling group. 
   */
  describeTrafficSources(callback?: (err: AWSError, data: AutoScaling.Types.DescribeTrafficSourcesResponse) => void): Request<AutoScaling.Types.DescribeTrafficSourcesResponse, AWSError>;
  /**
   * Gets information about a warm pool and its instances. For more information, see Warm pools for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
   */
  describeWarmPool(params: AutoScaling.Types.DescribeWarmPoolType, callback?: (err: AWSError, data: AutoScaling.Types.DescribeWarmPoolAnswer) => void): Request<AutoScaling.Types.DescribeWarmPoolAnswer, AWSError>;
  /**
   * Gets information about a warm pool and its instances. For more information, see Warm pools for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
   */
  describeWarmPool(callback?: (err: AWSError, data: AutoScaling.Types.DescribeWarmPoolAnswer) => void): Request<AutoScaling.Types.DescribeWarmPoolAnswer, AWSError>;
  /**
   * Removes one or more instances from the specified Auto Scaling group. After the instances are detached, you can manage them independent of the Auto Scaling group. If you do not specify the option to decrement the desired capacity, Amazon EC2 Auto Scaling launches instances to replace the ones that are detached. If there is a Classic Load Balancer attached to the Auto Scaling group, the instances are deregistered from the load balancer. If there are target groups attached to the Auto Scaling group, the instances are deregistered from the target groups. For more information, see Detach EC2 instances from your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
   */
  detachInstances(params: AutoScaling.Types.DetachInstancesQuery, callback?: (err: AWSError, data: AutoScaling.Types.DetachInstancesAnswer) => void): Request<AutoScaling.Types.DetachInstancesAnswer, AWSError>;
  /**
   * Removes one or more instances from the specified Auto Scaling group. After the instances are detached, you can manage them independent of the Auto Scaling group. If you do not specify the option to decrement the desired capacity, Amazon EC2 Auto Scaling launches instances to replace the ones that are detached. If there is a Classic Load Balancer attached to the Auto Scaling group, the instances are deregistered from the load balancer. If there are target groups attached to the Auto Scaling group, the instances are deregistered from the target groups. For more information, see Detach EC2 instances from your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
   */
  detachInstances(callback?: (err: AWSError, data: AutoScaling.Types.DetachInstancesAnswer) => void): Request<AutoScaling.Types.DetachInstancesAnswer, AWSError>;
  /**
   *  This API operation is superseded by DetachTrafficSources, which can detach multiple traffic sources types. We recommend using DetachTrafficSources to simplify how you manage traffic sources. However, we continue to support DetachLoadBalancerTargetGroups. You can use both the original DetachLoadBalancerTargetGroups API operation and DetachTrafficSources on the same Auto Scaling group.  Detaches one or more target groups from the specified Auto Scaling group. When you detach a target group, it enters the Removing state while deregistering the instances in the group. When all instances are deregistered, then you can no longer describe the target group using the DescribeLoadBalancerTargetGroups API call. The instances remain running.  You can use this operation to detach target groups that were attached by using AttachLoadBalancerTargetGroups, but not for target groups that were attached by using AttachTrafficSources. 
   */
  detachLoadBalancerTargetGroups(params: AutoScaling.Types.DetachLoadBalancerTargetGroupsType, callback?: (err: AWSError, data: AutoScaling.Types.DetachLoadBalancerTargetGroupsResultType) => void): Request<AutoScaling.Types.DetachLoadBalancerTargetGroupsResultType, AWSError>;
  /**
   *  This API operation is superseded by DetachTrafficSources, which can detach multiple traffic sources types. We recommend using DetachTrafficSources to simplify how you manage traffic sources. However, we continue to support DetachLoadBalancerTargetGroups. You can use both the original DetachLoadBalancerTargetGroups API operation and DetachTrafficSources on the same Auto Scaling group.  Detaches one or more target groups from the specified Auto Scaling group. When you detach a target group, it enters the Removing state while deregistering the instances in the group. When all instances are deregistered, then you can no longer describe the target group using the DescribeLoadBalancerTargetGroups API call. The instances remain running.  You can use this operation to detach target groups that were attached by using AttachLoadBalancerTargetGroups, but not for target groups that were attached by using AttachTrafficSources. 
   */
  detachLoadBalancerTargetGroups(callback?: (err: AWSError, data: AutoScaling.Types.DetachLoadBalancerTargetGroupsResultType) => void): Request<AutoScaling.Types.DetachLoadBalancerTargetGroupsResultType, AWSError>;
  /**
   *  This API operation is superseded by DetachTrafficSources, which can detach multiple traffic sources types. We recommend using DetachTrafficSources to simplify how you manage traffic sources. However, we continue to support DetachLoadBalancers. You can use both the original DetachLoadBalancers API operation and DetachTrafficSources on the same Auto Scaling group.  Detaches one or more Classic Load Balancers from the specified Auto Scaling group. This operation detaches only Classic Load Balancers. If you have Application Load Balancers, Network Load Balancers, or Gateway Load Balancers, use the DetachLoadBalancerTargetGroups API instead. When you detach a load balancer, it enters the Removing state while deregistering the instances in the group. When all instances are deregistered, then you can no longer describe the load balancer using the DescribeLoadBalancers API call. The instances remain running.
   */
  detachLoadBalancers(params: AutoScaling.Types.DetachLoadBalancersType, callback?: (err: AWSError, data: AutoScaling.Types.DetachLoadBalancersResultType) => void): Request<AutoScaling.Types.DetachLoadBalancersResultType, AWSError>;
  /**
   *  This API operation is superseded by DetachTrafficSources, which can detach multiple traffic sources types. We recommend using DetachTrafficSources to simplify how you manage traffic sources. However, we continue to support DetachLoadBalancers. You can use both the original DetachLoadBalancers API operation and DetachTrafficSources on the same Auto Scaling group.  Detaches one or more Classic Load Balancers from the specified Auto Scaling group. This operation detaches only Classic Load Balancers. If you have Application Load Balancers, Network Load Balancers, or Gateway Load Balancers, use the DetachLoadBalancerTargetGroups API instead. When you detach a load balancer, it enters the Removing state while deregistering the instances in the group. When all instances are deregistered, then you can no longer describe the load balancer using the DescribeLoadBalancers API call. The instances remain running.
   */
  detachLoadBalancers(callback?: (err: AWSError, data: AutoScaling.Types.DetachLoadBalancersResultType) => void): Request<AutoScaling.Types.DetachLoadBalancersResultType, AWSError>;
  /**
   * Detaches one or more traffic sources from the specified Auto Scaling group. When you detach a traffic source, it enters the Removing state while deregistering the instances in the group. When all instances are deregistered, then you can no longer describe the traffic source using the DescribeTrafficSources API call. The instances continue to run.
   */
  detachTrafficSources(params: AutoScaling.Types.DetachTrafficSourcesType, callback?: (err: AWSError, data: AutoScaling.Types.DetachTrafficSourcesResultType) => void): Request<AutoScaling.Types.DetachTrafficSourcesResultType, AWSError>;
  /**
   * Detaches one or more traffic sources from the specified Auto Scaling group. When you detach a traffic source, it enters the Removing state while deregistering the instances in the group. When all instances are deregistered, then you can no longer describe the traffic source using the DescribeTrafficSources API call. The instances continue to run.
   */
  detachTrafficSources(callback?: (err: AWSError, data: AutoScaling.Types.DetachTrafficSourcesResultType) => void): Request<AutoScaling.Types.DetachTrafficSourcesResultType, AWSError>;
  /**
   * Disables group metrics collection for the specified Auto Scaling group.
   */
  disableMetricsCollection(params: AutoScaling.Types.DisableMetricsCollectionQuery, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disables group metrics collection for the specified Auto Scaling group.
   */
  disableMetricsCollection(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables group metrics collection for the specified Auto Scaling group. You can use these metrics to track changes in an Auto Scaling group and to set alarms on threshold values. You can view group metrics using the Amazon EC2 Auto Scaling console or the CloudWatch console. For more information, see Monitor CloudWatch metrics for your Auto Scaling groups and instances in the Amazon EC2 Auto Scaling User Guide.
   */
  enableMetricsCollection(params: AutoScaling.Types.EnableMetricsCollectionQuery, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Enables group metrics collection for the specified Auto Scaling group. You can use these metrics to track changes in an Auto Scaling group and to set alarms on threshold values. You can view group metrics using the Amazon EC2 Auto Scaling console or the CloudWatch console. For more information, see Monitor CloudWatch metrics for your Auto Scaling groups and instances in the Amazon EC2 Auto Scaling User Guide.
   */
  enableMetricsCollection(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Moves the specified instances into the standby state. If you choose to decrement the desired capacity of the Auto Scaling group, the instances can enter standby as long as the desired capacity of the Auto Scaling group after the instances are placed into standby is equal to or greater than the minimum capacity of the group. If you choose not to decrement the desired capacity of the Auto Scaling group, the Auto Scaling group launches new instances to replace the instances on standby. For more information, see Temporarily removing instances from your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
   */
  enterStandby(params: AutoScaling.Types.EnterStandbyQuery, callback?: (err: AWSError, data: AutoScaling.Types.EnterStandbyAnswer) => void): Request<AutoScaling.Types.EnterStandbyAnswer, AWSError>;
  /**
   * Moves the specified instances into the standby state. If you choose to decrement the desired capacity of the Auto Scaling group, the instances can enter standby as long as the desired capacity of the Auto Scaling group after the instances are placed into standby is equal to or greater than the minimum capacity of the group. If you choose not to decrement the desired capacity of the Auto Scaling group, the Auto Scaling group launches new instances to replace the instances on standby. For more information, see Temporarily removing instances from your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
   */
  enterStandby(callback?: (err: AWSError, data: AutoScaling.Types.EnterStandbyAnswer) => void): Request<AutoScaling.Types.EnterStandbyAnswer, AWSError>;
  /**
   * Executes the specified policy. This can be useful for testing the design of your scaling policy.
   */
  executePolicy(params: AutoScaling.Types.ExecutePolicyType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Executes the specified policy. This can be useful for testing the design of your scaling policy.
   */
  executePolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Moves the specified instances out of the standby state. After you put the instances back in service, the desired capacity is incremented. For more information, see Temporarily removing instances from your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
   */
  exitStandby(params: AutoScaling.Types.ExitStandbyQuery, callback?: (err: AWSError, data: AutoScaling.Types.ExitStandbyAnswer) => void): Request<AutoScaling.Types.ExitStandbyAnswer, AWSError>;
  /**
   * Moves the specified instances out of the standby state. After you put the instances back in service, the desired capacity is incremented. For more information, see Temporarily removing instances from your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
   */
  exitStandby(callback?: (err: AWSError, data: AutoScaling.Types.ExitStandbyAnswer) => void): Request<AutoScaling.Types.ExitStandbyAnswer, AWSError>;
  /**
   * Retrieves the forecast data for a predictive scaling policy. Load forecasts are predictions of the hourly load values using historical load data from CloudWatch and an analysis of historical trends. Capacity forecasts are represented as predicted values for the minimum capacity that is needed on an hourly basis, based on the hourly load forecast. A minimum of 24 hours of data is required to create the initial forecasts. However, having a full 14 days of historical data results in more accurate forecasts. For more information, see Predictive scaling for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
   */
  getPredictiveScalingForecast(params: AutoScaling.Types.GetPredictiveScalingForecastType, callback?: (err: AWSError, data: AutoScaling.Types.GetPredictiveScalingForecastAnswer) => void): Request<AutoScaling.Types.GetPredictiveScalingForecastAnswer, AWSError>;
  /**
   * Retrieves the forecast data for a predictive scaling policy. Load forecasts are predictions of the hourly load values using historical load data from CloudWatch and an analysis of historical trends. Capacity forecasts are represented as predicted values for the minimum capacity that is needed on an hourly basis, based on the hourly load forecast. A minimum of 24 hours of data is required to create the initial forecasts. However, having a full 14 days of historical data results in more accurate forecasts. For more information, see Predictive scaling for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
   */
  getPredictiveScalingForecast(callback?: (err: AWSError, data: AutoScaling.Types.GetPredictiveScalingForecastAnswer) => void): Request<AutoScaling.Types.GetPredictiveScalingForecastAnswer, AWSError>;
  /**
   * Creates or updates a lifecycle hook for the specified Auto Scaling group. Lifecycle hooks let you create solutions that are aware of events in the Auto Scaling instance lifecycle, and then perform a custom action on instances when the corresponding lifecycle event occurs. This step is a part of the procedure for adding a lifecycle hook to an Auto Scaling group:   (Optional) Create a launch template or launch configuration with a user data script that runs while an instance is in a wait state due to a lifecycle hook.   (Optional) Create a Lambda function and a rule that allows Amazon EventBridge to invoke your Lambda function when an instance is put into a wait state due to a lifecycle hook.   (Optional) Create a notification target and an IAM role. The target can be either an Amazon SQS queue or an Amazon SNS topic. The role allows Amazon EC2 Auto Scaling to publish lifecycle notifications to the target.    Create the lifecycle hook. Specify whether the hook is used when the instances launch or terminate.    If you need more time, record the lifecycle action heartbeat to keep the instance in a wait state using the RecordLifecycleActionHeartbeat API call.   If you finish before the timeout period ends, send a callback by using the CompleteLifecycleAction API call.   For more information, see Amazon EC2 Auto Scaling lifecycle hooks in the Amazon EC2 Auto Scaling User Guide. If you exceed your maximum limit of lifecycle hooks, which by default is 50 per Auto Scaling group, the call fails. You can view the lifecycle hooks for an Auto Scaling group using the DescribeLifecycleHooks API call. If you are no longer using a lifecycle hook, you can delete it by calling the DeleteLifecycleHook API.
   */
  putLifecycleHook(params: AutoScaling.Types.PutLifecycleHookType, callback?: (err: AWSError, data: AutoScaling.Types.PutLifecycleHookAnswer) => void): Request<AutoScaling.Types.PutLifecycleHookAnswer, AWSError>;
  /**
   * Creates or updates a lifecycle hook for the specified Auto Scaling group. Lifecycle hooks let you create solutions that are aware of events in the Auto Scaling instance lifecycle, and then perform a custom action on instances when the corresponding lifecycle event occurs. This step is a part of the procedure for adding a lifecycle hook to an Auto Scaling group:   (Optional) Create a launch template or launch configuration with a user data script that runs while an instance is in a wait state due to a lifecycle hook.   (Optional) Create a Lambda function and a rule that allows Amazon EventBridge to invoke your Lambda function when an instance is put into a wait state due to a lifecycle hook.   (Optional) Create a notification target and an IAM role. The target can be either an Amazon SQS queue or an Amazon SNS topic. The role allows Amazon EC2 Auto Scaling to publish lifecycle notifications to the target.    Create the lifecycle hook. Specify whether the hook is used when the instances launch or terminate.    If you need more time, record the lifecycle action heartbeat to keep the instance in a wait state using the RecordLifecycleActionHeartbeat API call.   If you finish before the timeout period ends, send a callback by using the CompleteLifecycleAction API call.   For more information, see Amazon EC2 Auto Scaling lifecycle hooks in the Amazon EC2 Auto Scaling User Guide. If you exceed your maximum limit of lifecycle hooks, which by default is 50 per Auto Scaling group, the call fails. You can view the lifecycle hooks for an Auto Scaling group using the DescribeLifecycleHooks API call. If you are no longer using a lifecycle hook, you can delete it by calling the DeleteLifecycleHook API.
   */
  putLifecycleHook(callback?: (err: AWSError, data: AutoScaling.Types.PutLifecycleHookAnswer) => void): Request<AutoScaling.Types.PutLifecycleHookAnswer, AWSError>;
  /**
   * Configures an Auto Scaling group to send notifications when specified events take place. Subscribers to the specified topic can have messages delivered to an endpoint such as a web server or an email address. This configuration overwrites any existing configuration. For more information, see Getting Amazon SNS notifications when your Auto Scaling group scales in the Amazon EC2 Auto Scaling User Guide. If you exceed your maximum limit of SNS topics, which is 10 per Auto Scaling group, the call fails.
   */
  putNotificationConfiguration(params: AutoScaling.Types.PutNotificationConfigurationType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Configures an Auto Scaling group to send notifications when specified events take place. Subscribers to the specified topic can have messages delivered to an endpoint such as a web server or an email address. This configuration overwrites any existing configuration. For more information, see Getting Amazon SNS notifications when your Auto Scaling group scales in the Amazon EC2 Auto Scaling User Guide. If you exceed your maximum limit of SNS topics, which is 10 per Auto Scaling group, the call fails.
   */
  putNotificationConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or updates a scaling policy for an Auto Scaling group. Scaling policies are used to scale an Auto Scaling group based on configurable metrics. If no policies are defined, the dynamic scaling and predictive scaling features are not used.  For more information about using dynamic scaling, see Target tracking scaling policies and Step and simple scaling policies in the Amazon EC2 Auto Scaling User Guide. For more information about using predictive scaling, see Predictive scaling for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. You can view the scaling policies for an Auto Scaling group using the DescribePolicies API call. If you are no longer using a scaling policy, you can delete it by calling the DeletePolicy API.
   */
  putScalingPolicy(params: AutoScaling.Types.PutScalingPolicyType, callback?: (err: AWSError, data: AutoScaling.Types.PolicyARNType) => void): Request<AutoScaling.Types.PolicyARNType, AWSError>;
  /**
   * Creates or updates a scaling policy for an Auto Scaling group. Scaling policies are used to scale an Auto Scaling group based on configurable metrics. If no policies are defined, the dynamic scaling and predictive scaling features are not used.  For more information about using dynamic scaling, see Target tracking scaling policies and Step and simple scaling policies in the Amazon EC2 Auto Scaling User Guide. For more information about using predictive scaling, see Predictive scaling for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. You can view the scaling policies for an Auto Scaling group using the DescribePolicies API call. If you are no longer using a scaling policy, you can delete it by calling the DeletePolicy API.
   */
  putScalingPolicy(callback?: (err: AWSError, data: AutoScaling.Types.PolicyARNType) => void): Request<AutoScaling.Types.PolicyARNType, AWSError>;
  /**
   * Creates or updates a scheduled scaling action for an Auto Scaling group. For more information, see Scheduled scaling in the Amazon EC2 Auto Scaling User Guide. You can view the scheduled actions for an Auto Scaling group using the DescribeScheduledActions API call. If you are no longer using a scheduled action, you can delete it by calling the DeleteScheduledAction API. If you try to schedule your action in the past, Amazon EC2 Auto Scaling returns an error message.
   */
  putScheduledUpdateGroupAction(params: AutoScaling.Types.PutScheduledUpdateGroupActionType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or updates a scheduled scaling action for an Auto Scaling group. For more information, see Scheduled scaling in the Amazon EC2 Auto Scaling User Guide. You can view the scheduled actions for an Auto Scaling group using the DescribeScheduledActions API call. If you are no longer using a scheduled action, you can delete it by calling the DeleteScheduledAction API. If you try to schedule your action in the past, Amazon EC2 Auto Scaling returns an error message.
   */
  putScheduledUpdateGroupAction(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or updates a warm pool for the specified Auto Scaling group. A warm pool is a pool of pre-initialized EC2 instances that sits alongside the Auto Scaling group. Whenever your application needs to scale out, the Auto Scaling group can draw on the warm pool to meet its new desired capacity. For more information and example configurations, see Warm pools for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. This operation must be called from the Region in which the Auto Scaling group was created. This operation cannot be called on an Auto Scaling group that has a mixed instances policy or a launch template or launch configuration that requests Spot Instances. You can view the instances in the warm pool using the DescribeWarmPool API call. If you are no longer using a warm pool, you can delete it by calling the DeleteWarmPool API.
   */
  putWarmPool(params: AutoScaling.Types.PutWarmPoolType, callback?: (err: AWSError, data: AutoScaling.Types.PutWarmPoolAnswer) => void): Request<AutoScaling.Types.PutWarmPoolAnswer, AWSError>;
  /**
   * Creates or updates a warm pool for the specified Auto Scaling group. A warm pool is a pool of pre-initialized EC2 instances that sits alongside the Auto Scaling group. Whenever your application needs to scale out, the Auto Scaling group can draw on the warm pool to meet its new desired capacity. For more information and example configurations, see Warm pools for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. This operation must be called from the Region in which the Auto Scaling group was created. This operation cannot be called on an Auto Scaling group that has a mixed instances policy or a launch template or launch configuration that requests Spot Instances. You can view the instances in the warm pool using the DescribeWarmPool API call. If you are no longer using a warm pool, you can delete it by calling the DeleteWarmPool API.
   */
  putWarmPool(callback?: (err: AWSError, data: AutoScaling.Types.PutWarmPoolAnswer) => void): Request<AutoScaling.Types.PutWarmPoolAnswer, AWSError>;
  /**
   * Records a heartbeat for the lifecycle action associated with the specified token or instance. This extends the timeout by the length of time defined using the PutLifecycleHook API call. This step is a part of the procedure for adding a lifecycle hook to an Auto Scaling group:   (Optional) Create a launch template or launch configuration with a user data script that runs while an instance is in a wait state due to a lifecycle hook.   (Optional) Create a Lambda function and a rule that allows Amazon EventBridge to invoke your Lambda function when an instance is put into a wait state due to a lifecycle hook.   (Optional) Create a notification target and an IAM role. The target can be either an Amazon SQS queue or an Amazon SNS topic. The role allows Amazon EC2 Auto Scaling to publish lifecycle notifications to the target.   Create the lifecycle hook. Specify whether the hook is used when the instances launch or terminate.    If you need more time, record the lifecycle action heartbeat to keep the instance in a wait state.    If you finish before the timeout period ends, send a callback by using the CompleteLifecycleAction API call.   For more information, see Amazon EC2 Auto Scaling lifecycle hooks in the Amazon EC2 Auto Scaling User Guide.
   */
  recordLifecycleActionHeartbeat(params: AutoScaling.Types.RecordLifecycleActionHeartbeatType, callback?: (err: AWSError, data: AutoScaling.Types.RecordLifecycleActionHeartbeatAnswer) => void): Request<AutoScaling.Types.RecordLifecycleActionHeartbeatAnswer, AWSError>;
  /**
   * Records a heartbeat for the lifecycle action associated with the specified token or instance. This extends the timeout by the length of time defined using the PutLifecycleHook API call. This step is a part of the procedure for adding a lifecycle hook to an Auto Scaling group:   (Optional) Create a launch template or launch configuration with a user data script that runs while an instance is in a wait state due to a lifecycle hook.   (Optional) Create a Lambda function and a rule that allows Amazon EventBridge to invoke your Lambda function when an instance is put into a wait state due to a lifecycle hook.   (Optional) Create a notification target and an IAM role. The target can be either an Amazon SQS queue or an Amazon SNS topic. The role allows Amazon EC2 Auto Scaling to publish lifecycle notifications to the target.   Create the lifecycle hook. Specify whether the hook is used when the instances launch or terminate.    If you need more time, record the lifecycle action heartbeat to keep the instance in a wait state.    If you finish before the timeout period ends, send a callback by using the CompleteLifecycleAction API call.   For more information, see Amazon EC2 Auto Scaling lifecycle hooks in the Amazon EC2 Auto Scaling User Guide.
   */
  recordLifecycleActionHeartbeat(callback?: (err: AWSError, data: AutoScaling.Types.RecordLifecycleActionHeartbeatAnswer) => void): Request<AutoScaling.Types.RecordLifecycleActionHeartbeatAnswer, AWSError>;
  /**
   * Resumes the specified suspended auto scaling processes, or all suspended process, for the specified Auto Scaling group. For more information, see Suspending and resuming scaling processes in the Amazon EC2 Auto Scaling User Guide.
   */
  resumeProcesses(params: AutoScaling.Types.ScalingProcessQuery, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Resumes the specified suspended auto scaling processes, or all suspended process, for the specified Auto Scaling group. For more information, see Suspending and resuming scaling processes in the Amazon EC2 Auto Scaling User Guide.
   */
  resumeProcesses(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Cancels an instance refresh that is in progress and rolls back any changes that it made. Amazon EC2 Auto Scaling replaces any instances that were replaced during the instance refresh. This restores your Auto Scaling group to the configuration that it was using before the start of the instance refresh.  This operation is part of the instance refresh feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group after you make configuration changes. A rollback is not supported in the following situations:    There is no desired configuration specified for the instance refresh.   The Auto Scaling group has a launch template that uses an Amazon Web Services Systems Manager parameter instead of an AMI ID for the ImageId property.   The Auto Scaling group uses the launch template's $Latest or $Default version.   When you receive a successful response from this operation, Amazon EC2 Auto Scaling immediately begins replacing instances. You can check the status of this operation through the DescribeInstanceRefreshes API operation. 
   */
  rollbackInstanceRefresh(params: AutoScaling.Types.RollbackInstanceRefreshType, callback?: (err: AWSError, data: AutoScaling.Types.RollbackInstanceRefreshAnswer) => void): Request<AutoScaling.Types.RollbackInstanceRefreshAnswer, AWSError>;
  /**
   * Cancels an instance refresh that is in progress and rolls back any changes that it made. Amazon EC2 Auto Scaling replaces any instances that were replaced during the instance refresh. This restores your Auto Scaling group to the configuration that it was using before the start of the instance refresh.  This operation is part of the instance refresh feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group after you make configuration changes. A rollback is not supported in the following situations:    There is no desired configuration specified for the instance refresh.   The Auto Scaling group has a launch template that uses an Amazon Web Services Systems Manager parameter instead of an AMI ID for the ImageId property.   The Auto Scaling group uses the launch template's $Latest or $Default version.   When you receive a successful response from this operation, Amazon EC2 Auto Scaling immediately begins replacing instances. You can check the status of this operation through the DescribeInstanceRefreshes API operation. 
   */
  rollbackInstanceRefresh(callback?: (err: AWSError, data: AutoScaling.Types.RollbackInstanceRefreshAnswer) => void): Request<AutoScaling.Types.RollbackInstanceRefreshAnswer, AWSError>;
  /**
   * Sets the size of the specified Auto Scaling group. If a scale-in activity occurs as a result of a new DesiredCapacity value that is lower than the current size of the group, the Auto Scaling group uses its termination policy to determine which instances to terminate.  For more information, see Manual scaling in the Amazon EC2 Auto Scaling User Guide.
   */
  setDesiredCapacity(params: AutoScaling.Types.SetDesiredCapacityType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the size of the specified Auto Scaling group. If a scale-in activity occurs as a result of a new DesiredCapacity value that is lower than the current size of the group, the Auto Scaling group uses its termination policy to determine which instances to terminate.  For more information, see Manual scaling in the Amazon EC2 Auto Scaling User Guide.
   */
  setDesiredCapacity(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the health status of the specified instance. For more information, see Health checks for Auto Scaling instances in the Amazon EC2 Auto Scaling User Guide.
   */
  setInstanceHealth(params: AutoScaling.Types.SetInstanceHealthQuery, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the health status of the specified instance. For more information, see Health checks for Auto Scaling instances in the Amazon EC2 Auto Scaling User Guide.
   */
  setInstanceHealth(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the instance protection settings of the specified instances. This operation cannot be called on instances in a warm pool. For more information about preventing instances that are part of an Auto Scaling group from terminating on scale in, see Using instance scale-in protection in the Amazon EC2 Auto Scaling User Guide. If you exceed your maximum limit of instance IDs, which is 50 per Auto Scaling group, the call fails.
   */
  setInstanceProtection(params: AutoScaling.Types.SetInstanceProtectionQuery, callback?: (err: AWSError, data: AutoScaling.Types.SetInstanceProtectionAnswer) => void): Request<AutoScaling.Types.SetInstanceProtectionAnswer, AWSError>;
  /**
   * Updates the instance protection settings of the specified instances. This operation cannot be called on instances in a warm pool. For more information about preventing instances that are part of an Auto Scaling group from terminating on scale in, see Using instance scale-in protection in the Amazon EC2 Auto Scaling User Guide. If you exceed your maximum limit of instance IDs, which is 50 per Auto Scaling group, the call fails.
   */
  setInstanceProtection(callback?: (err: AWSError, data: AutoScaling.Types.SetInstanceProtectionAnswer) => void): Request<AutoScaling.Types.SetInstanceProtectionAnswer, AWSError>;
  /**
   * Starts an instance refresh. During an instance refresh, Amazon EC2 Auto Scaling performs a rolling update of instances in an Auto Scaling group. Instances are terminated first and then replaced, which temporarily reduces the capacity available within your Auto Scaling group. This operation is part of the instance refresh feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group. This feature is helpful, for example, when you have a new AMI or a new user data script. You just need to create a new launch template that specifies the new AMI or user data script. Then start an instance refresh to immediately begin the process of updating instances in the group.  If successful, the request's response contains a unique ID that you can use to track the progress of the instance refresh. To query its status, call the DescribeInstanceRefreshes API. To describe the instance refreshes that have already run, call the DescribeInstanceRefreshes API. To cancel an instance refresh that is in progress, use the CancelInstanceRefresh API.  An instance refresh might fail for several reasons, such as EC2 launch failures, misconfigured health checks, or not ignoring or allowing the termination of instances that are in Standby state or protected from scale in. You can monitor for failed EC2 launches using the scaling activities. To find the scaling activities, call the DescribeScalingActivities API. If you enable auto rollback, your Auto Scaling group will be rolled back automatically when the instance refresh fails. You can enable this feature before starting an instance refresh by specifying the AutoRollback property in the instance refresh preferences. Otherwise, to roll back an instance refresh before it finishes, use the RollbackInstanceRefresh API. 
   */
  startInstanceRefresh(params: AutoScaling.Types.StartInstanceRefreshType, callback?: (err: AWSError, data: AutoScaling.Types.StartInstanceRefreshAnswer) => void): Request<AutoScaling.Types.StartInstanceRefreshAnswer, AWSError>;
  /**
   * Starts an instance refresh. During an instance refresh, Amazon EC2 Auto Scaling performs a rolling update of instances in an Auto Scaling group. Instances are terminated first and then replaced, which temporarily reduces the capacity available within your Auto Scaling group. This operation is part of the instance refresh feature in Amazon EC2 Auto Scaling, which helps you update instances in your Auto Scaling group. This feature is helpful, for example, when you have a new AMI or a new user data script. You just need to create a new launch template that specifies the new AMI or user data script. Then start an instance refresh to immediately begin the process of updating instances in the group.  If successful, the request's response contains a unique ID that you can use to track the progress of the instance refresh. To query its status, call the DescribeInstanceRefreshes API. To describe the instance refreshes that have already run, call the DescribeInstanceRefreshes API. To cancel an instance refresh that is in progress, use the CancelInstanceRefresh API.  An instance refresh might fail for several reasons, such as EC2 launch failures, misconfigured health checks, or not ignoring or allowing the termination of instances that are in Standby state or protected from scale in. You can monitor for failed EC2 launches using the scaling activities. To find the scaling activities, call the DescribeScalingActivities API. If you enable auto rollback, your Auto Scaling group will be rolled back automatically when the instance refresh fails. You can enable this feature before starting an instance refresh by specifying the AutoRollback property in the instance refresh preferences. Otherwise, to roll back an instance refresh before it finishes, use the RollbackInstanceRefresh API. 
   */
  startInstanceRefresh(callback?: (err: AWSError, data: AutoScaling.Types.StartInstanceRefreshAnswer) => void): Request<AutoScaling.Types.StartInstanceRefreshAnswer, AWSError>;
  /**
   * Suspends the specified auto scaling processes, or all processes, for the specified Auto Scaling group. If you suspend either the Launch or Terminate process types, it can prevent other process types from functioning properly. For more information, see Suspending and resuming scaling processes in the Amazon EC2 Auto Scaling User Guide. To resume processes that have been suspended, call the ResumeProcesses API.
   */
  suspendProcesses(params: AutoScaling.Types.ScalingProcessQuery, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Suspends the specified auto scaling processes, or all processes, for the specified Auto Scaling group. If you suspend either the Launch or Terminate process types, it can prevent other process types from functioning properly. For more information, see Suspending and resuming scaling processes in the Amazon EC2 Auto Scaling User Guide. To resume processes that have been suspended, call the ResumeProcesses API.
   */
  suspendProcesses(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Terminates the specified instance and optionally adjusts the desired group size. This operation cannot be called on instances in a warm pool. This call simply makes a termination request. The instance is not terminated immediately. When an instance is terminated, the instance status changes to terminated. You can't connect to or start an instance after you've terminated it. If you do not specify the option to decrement the desired capacity, Amazon EC2 Auto Scaling launches instances to replace the ones that are terminated.  By default, Amazon EC2 Auto Scaling balances instances across all Availability Zones. If you decrement the desired capacity, your Auto Scaling group can become unbalanced between Availability Zones. Amazon EC2 Auto Scaling tries to rebalance the group, and rebalancing might terminate instances in other zones. For more information, see Rebalancing activities in the Amazon EC2 Auto Scaling User Guide.
   */
  terminateInstanceInAutoScalingGroup(params: AutoScaling.Types.TerminateInstanceInAutoScalingGroupType, callback?: (err: AWSError, data: AutoScaling.Types.ActivityType) => void): Request<AutoScaling.Types.ActivityType, AWSError>;
  /**
   * Terminates the specified instance and optionally adjusts the desired group size. This operation cannot be called on instances in a warm pool. This call simply makes a termination request. The instance is not terminated immediately. When an instance is terminated, the instance status changes to terminated. You can't connect to or start an instance after you've terminated it. If you do not specify the option to decrement the desired capacity, Amazon EC2 Auto Scaling launches instances to replace the ones that are terminated.  By default, Amazon EC2 Auto Scaling balances instances across all Availability Zones. If you decrement the desired capacity, your Auto Scaling group can become unbalanced between Availability Zones. Amazon EC2 Auto Scaling tries to rebalance the group, and rebalancing might terminate instances in other zones. For more information, see Rebalancing activities in the Amazon EC2 Auto Scaling User Guide.
   */
  terminateInstanceInAutoScalingGroup(callback?: (err: AWSError, data: AutoScaling.Types.ActivityType) => void): Request<AutoScaling.Types.ActivityType, AWSError>;
  /**
   *  We strongly recommend that all Auto Scaling groups use launch templates to ensure full functionality for Amazon EC2 Auto Scaling and Amazon EC2.  Updates the configuration for the specified Auto Scaling group. To update an Auto Scaling group, specify the name of the group and the property that you want to change. Any properties that you don't specify are not changed by this update request. The new settings take effect on any scaling activities after this call returns.  If you associate a new launch configuration or template with an Auto Scaling group, all new instances will get the updated configuration. Existing instances continue to run with the configuration that they were originally launched with. When you update a group to specify a mixed instances policy instead of a launch configuration or template, existing instances may be replaced to match the new purchasing options that you specified in the policy. For example, if the group currently has 100% On-Demand capacity and the policy specifies 50% Spot capacity, this means that half of your instances will be gradually terminated and relaunched as Spot Instances. When replacing instances, Amazon EC2 Auto Scaling launches new instances before terminating the old ones, so that updating your group does not compromise the performance or availability of your application. Note the following about changing DesiredCapacity, MaxSize, or MinSize:   If a scale-in activity occurs as a result of a new DesiredCapacity value that is lower than the current size of the group, the Auto Scaling group uses its termination policy to determine which instances to terminate.   If you specify a new value for MinSize without specifying a value for DesiredCapacity, and the new MinSize is larger than the current size of the group, this sets the group's DesiredCapacity to the new MinSize value.   If you specify a new value for MaxSize without specifying a value for DesiredCapacity, and the new MaxSize is smaller than the current size of the group, this sets the group's DesiredCapacity to the new MaxSize value.   To see which properties have been set, call the DescribeAutoScalingGroups API. To view the scaling policies for an Auto Scaling group, call the DescribePolicies API. If the group has scaling policies, you can update them by calling the PutScalingPolicy API.
   */
  updateAutoScalingGroup(params: AutoScaling.Types.UpdateAutoScalingGroupType, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  We strongly recommend that all Auto Scaling groups use launch templates to ensure full functionality for Amazon EC2 Auto Scaling and Amazon EC2.  Updates the configuration for the specified Auto Scaling group. To update an Auto Scaling group, specify the name of the group and the property that you want to change. Any properties that you don't specify are not changed by this update request. The new settings take effect on any scaling activities after this call returns.  If you associate a new launch configuration or template with an Auto Scaling group, all new instances will get the updated configuration. Existing instances continue to run with the configuration that they were originally launched with. When you update a group to specify a mixed instances policy instead of a launch configuration or template, existing instances may be replaced to match the new purchasing options that you specified in the policy. For example, if the group currently has 100% On-Demand capacity and the policy specifies 50% Spot capacity, this means that half of your instances will be gradually terminated and relaunched as Spot Instances. When replacing instances, Amazon EC2 Auto Scaling launches new instances before terminating the old ones, so that updating your group does not compromise the performance or availability of your application. Note the following about changing DesiredCapacity, MaxSize, or MinSize:   If a scale-in activity occurs as a result of a new DesiredCapacity value that is lower than the current size of the group, the Auto Scaling group uses its termination policy to determine which instances to terminate.   If you specify a new value for MinSize without specifying a value for DesiredCapacity, and the new MinSize is larger than the current size of the group, this sets the group's DesiredCapacity to the new MinSize value.   If you specify a new value for MaxSize without specifying a value for DesiredCapacity, and the new MaxSize is smaller than the current size of the group, this sets the group's DesiredCapacity to the new MaxSize value.   To see which properties have been set, call the DescribeAutoScalingGroups API. To view the scaling policies for an Auto Scaling group, call the DescribePolicies API. If the group has scaling policies, you can update them by calling the PutScalingPolicy API.
   */
  updateAutoScalingGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace AutoScaling {
  export interface AcceleratorCountRequest {
    /**
     * The minimum value.
     */
    Min?: NullablePositiveInteger;
    /**
     * The maximum value.
     */
    Max?: NullablePositiveInteger;
  }
  export type AcceleratorManufacturer = "nvidia"|"amd"|"amazon-web-services"|"xilinx"|string;
  export type AcceleratorManufacturers = AcceleratorManufacturer[];
  export type AcceleratorName = "a100"|"v100"|"k80"|"t4"|"m60"|"radeon-pro-v520"|"vu9p"|string;
  export type AcceleratorNames = AcceleratorName[];
  export interface AcceleratorTotalMemoryMiBRequest {
    /**
     * The memory minimum in MiB.
     */
    Min?: NullablePositiveInteger;
    /**
     * The memory maximum in MiB.
     */
    Max?: NullablePositiveInteger;
  }
  export type AcceleratorType = "gpu"|"fpga"|"inference"|string;
  export type AcceleratorTypes = AcceleratorType[];
  export type Activities = Activity[];
  export interface ActivitiesType {
    /**
     * The scaling activities. Activities are sorted by start time. Activities still in progress are described first.
     */
    Activities: Activities;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface Activity {
    /**
     * The ID of the activity.
     */
    ActivityId: XmlString;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * A friendly, more verbose description of the activity.
     */
    Description?: XmlString;
    /**
     * The reason the activity began.
     */
    Cause: XmlStringMaxLen1023;
    /**
     * The start time of the activity.
     */
    StartTime: TimestampType;
    /**
     * The end time of the activity.
     */
    EndTime?: TimestampType;
    /**
     * The current status of the activity.
     */
    StatusCode: ScalingActivityStatusCode;
    /**
     * A friendly, more verbose description of the activity status.
     */
    StatusMessage?: XmlStringMaxLen255;
    /**
     * A value between 0 and 100 that indicates the progress of the activity.
     */
    Progress?: Progress;
    /**
     * The details about the activity.
     */
    Details?: XmlString;
    /**
     * The state of the Auto Scaling group, which is either InService or Deleted.
     */
    AutoScalingGroupState?: AutoScalingGroupState;
    /**
     * The Amazon Resource Name (ARN) of the Auto Scaling group.
     */
    AutoScalingGroupARN?: ResourceName;
  }
  export type ActivityIds = XmlString[];
  export interface ActivityType {
    /**
     * A scaling activity.
     */
    Activity?: Activity;
  }
  export interface AdjustmentType {
    /**
     * The policy adjustment type. The valid values are ChangeInCapacity, ExactCapacity, and PercentChangeInCapacity.
     */
    AdjustmentType?: XmlStringMaxLen255;
  }
  export type AdjustmentTypes = AdjustmentType[];
  export interface Alarm {
    /**
     * The name of the alarm.
     */
    AlarmName?: XmlStringMaxLen255;
    /**
     * The Amazon Resource Name (ARN) of the alarm.
     */
    AlarmARN?: ResourceName;
  }
  export type AlarmList = XmlStringMaxLen255[];
  export interface AlarmSpecification {
    /**
     * The names of one or more CloudWatch alarms to monitor for the instance refresh. You can specify up to 10 alarms.
     */
    Alarms?: AlarmList;
  }
  export type Alarms = Alarm[];
  export type AllowedInstanceType = string;
  export type AllowedInstanceTypes = AllowedInstanceType[];
  export type AnyPrintableAsciiStringMaxLen4000 = string;
  export type AsciiStringMaxLen255 = string;
  export type AssociatePublicIpAddress = boolean;
  export interface AttachInstancesQuery {
    /**
     * The IDs of the instances. You can specify up to 20 instances.
     */
    InstanceIds?: InstanceIds;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
  }
  export interface AttachLoadBalancerTargetGroupsResultType {
  }
  export interface AttachLoadBalancerTargetGroupsType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The Amazon Resource Names (ARNs) of the target groups. You can specify up to 10 target groups. To get the ARN of a target group, use the Elastic Load Balancing DescribeTargetGroups API operation.
     */
    TargetGroupARNs: TargetGroupARNs;
  }
  export interface AttachLoadBalancersResultType {
  }
  export interface AttachLoadBalancersType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The names of the load balancers. You can specify up to 10 load balancers.
     */
    LoadBalancerNames: LoadBalancerNames;
  }
  export interface AttachTrafficSourcesResultType {
  }
  export interface AttachTrafficSourcesType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The unique identifiers of one or more traffic sources. You can specify up to 10 traffic sources.
     */
    TrafficSources: TrafficSources;
  }
  export type AutoRollback = boolean;
  export interface AutoScalingGroup {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The Amazon Resource Name (ARN) of the Auto Scaling group.
     */
    AutoScalingGroupARN?: ResourceName;
    /**
     * The name of the associated launch configuration.
     */
    LaunchConfigurationName?: XmlStringMaxLen255;
    /**
     * The launch template for the group.
     */
    LaunchTemplate?: LaunchTemplateSpecification;
    /**
     * The mixed instances policy for the group.
     */
    MixedInstancesPolicy?: MixedInstancesPolicy;
    /**
     * The minimum size of the group.
     */
    MinSize: AutoScalingGroupMinSize;
    /**
     * The maximum size of the group.
     */
    MaxSize: AutoScalingGroupMaxSize;
    /**
     * The desired size of the group.
     */
    DesiredCapacity: AutoScalingGroupDesiredCapacity;
    /**
     * The predicted capacity of the group when it has a predictive scaling policy.
     */
    PredictedCapacity?: AutoScalingGroupPredictedCapacity;
    /**
     * The duration of the default cooldown period, in seconds.
     */
    DefaultCooldown: Cooldown;
    /**
     * One or more Availability Zones for the group.
     */
    AvailabilityZones: AvailabilityZones;
    /**
     * One or more load balancers associated with the group.
     */
    LoadBalancerNames?: LoadBalancerNames;
    /**
     * The Amazon Resource Names (ARN) of the target groups for your load balancer.
     */
    TargetGroupARNs?: TargetGroupARNs;
    /**
     * A comma-separated value string of one or more health check types.
     */
    HealthCheckType: XmlStringMaxLen32;
    /**
     * The duration of the health check grace period, in seconds.
     */
    HealthCheckGracePeriod?: HealthCheckGracePeriod;
    /**
     * The EC2 instances associated with the group.
     */
    Instances?: Instances;
    /**
     * The date and time the group was created.
     */
    CreatedTime: TimestampType;
    /**
     * The suspended processes associated with the group.
     */
    SuspendedProcesses?: SuspendedProcesses;
    /**
     * The name of the placement group into which to launch your instances, if any.
     */
    PlacementGroup?: XmlStringMaxLen255;
    /**
     * One or more subnet IDs, if applicable, separated by commas.
     */
    VPCZoneIdentifier?: XmlStringMaxLen2047;
    /**
     * The metrics enabled for the group.
     */
    EnabledMetrics?: EnabledMetrics;
    /**
     * The current state of the group when the DeleteAutoScalingGroup operation is in progress.
     */
    Status?: XmlStringMaxLen255;
    /**
     * The tags for the group.
     */
    Tags?: TagDescriptionList;
    /**
     * The termination policies for the group.
     */
    TerminationPolicies?: TerminationPolicies;
    /**
     * Indicates whether newly launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in.
     */
    NewInstancesProtectedFromScaleIn?: InstanceProtected;
    /**
     * The Amazon Resource Name (ARN) of the service-linked role that the Auto Scaling group uses to call other Amazon Web Services on your behalf.
     */
    ServiceLinkedRoleARN?: ResourceName;
    /**
     * The maximum amount of time, in seconds, that an instance can be in service. Valid Range: Minimum value of 0.
     */
    MaxInstanceLifetime?: MaxInstanceLifetime;
    /**
     * Indicates whether Capacity Rebalancing is enabled.
     */
    CapacityRebalance?: CapacityRebalanceEnabled;
    /**
     * The warm pool for the group.
     */
    WarmPoolConfiguration?: WarmPoolConfiguration;
    /**
     * The current size of the warm pool.
     */
    WarmPoolSize?: WarmPoolSize;
    /**
     * Reserved.
     */
    Context?: Context;
    /**
     * The unit of measurement for the value specified for desired capacity. Amazon EC2 Auto Scaling supports DesiredCapacityType for attribute-based instance type selection only.
     */
    DesiredCapacityType?: XmlStringMaxLen255;
    /**
     * The duration of the default instance warmup, in seconds.
     */
    DefaultInstanceWarmup?: DefaultInstanceWarmup;
    /**
     * The traffic sources associated with this Auto Scaling group.
     */
    TrafficSources?: TrafficSources;
  }
  export type AutoScalingGroupDesiredCapacity = number;
  export type AutoScalingGroupMaxSize = number;
  export type AutoScalingGroupMinSize = number;
  export type AutoScalingGroupNames = XmlStringMaxLen255[];
  export interface AutoScalingGroupNamesType {
    /**
     * The names of the Auto Scaling groups. By default, you can only specify up to 50 names. You can optionally increase this limit using the MaxRecords property. If you omit this property, all Auto Scaling groups are described.
     */
    AutoScalingGroupNames?: AutoScalingGroupNames;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
    /**
     * The maximum number of items to return with this call. The default value is 50 and the maximum value is 100.
     */
    MaxRecords?: MaxRecords;
    /**
     * One or more filters to limit the results based on specific tags. 
     */
    Filters?: Filters;
  }
  export type AutoScalingGroupPredictedCapacity = number;
  export type AutoScalingGroupState = string;
  export type AutoScalingGroups = AutoScalingGroup[];
  export interface AutoScalingGroupsType {
    /**
     * The groups.
     */
    AutoScalingGroups: AutoScalingGroups;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface AutoScalingInstanceDetails {
    /**
     * The ID of the instance.
     */
    InstanceId: XmlStringMaxLen19;
    /**
     * The instance type of the EC2 instance.
     */
    InstanceType?: XmlStringMaxLen255;
    /**
     * The name of the Auto Scaling group for the instance.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The Availability Zone for the instance.
     */
    AvailabilityZone: XmlStringMaxLen255;
    /**
     * The lifecycle state for the instance. The Quarantined state is not used. For information about lifecycle states, see Instance lifecycle in the Amazon EC2 Auto Scaling User Guide.  Valid values: Pending | Pending:Wait | Pending:Proceed | Quarantined | InService | Terminating | Terminating:Wait | Terminating:Proceed | Terminated | Detaching | Detached | EnteringStandby | Standby | Warmed:Pending | Warmed:Pending:Wait | Warmed:Pending:Proceed | Warmed:Terminating | Warmed:Terminating:Wait | Warmed:Terminating:Proceed | Warmed:Terminated | Warmed:Stopped | Warmed:Running 
     */
    LifecycleState: XmlStringMaxLen32;
    /**
     * The last reported health status of this instance. Healthy means that the instance is healthy and should remain in service. Unhealthy means that the instance is unhealthy and Amazon EC2 Auto Scaling should terminate and replace it.
     */
    HealthStatus: XmlStringMaxLen32;
    /**
     * The launch configuration used to launch the instance. This value is not available if you attached the instance to the Auto Scaling group.
     */
    LaunchConfigurationName?: XmlStringMaxLen255;
    /**
     * The launch template for the instance.
     */
    LaunchTemplate?: LaunchTemplateSpecification;
    /**
     * Indicates whether the instance is protected from termination by Amazon EC2 Auto Scaling when scaling in.
     */
    ProtectedFromScaleIn: InstanceProtected;
    /**
     * The number of capacity units contributed by the instance based on its instance type. Valid Range: Minimum value of 1. Maximum value of 999.
     */
    WeightedCapacity?: XmlStringMaxLen32;
  }
  export type AutoScalingInstances = AutoScalingInstanceDetails[];
  export interface AutoScalingInstancesType {
    /**
     * The instances.
     */
    AutoScalingInstances?: AutoScalingInstances;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export type AutoScalingNotificationTypes = XmlStringMaxLen255[];
  export type AvailabilityZones = XmlStringMaxLen255[];
  export type BareMetal = "included"|"excluded"|"required"|string;
  export interface BaselineEbsBandwidthMbpsRequest {
    /**
     * The minimum value in Mbps.
     */
    Min?: NullablePositiveInteger;
    /**
     * The maximum value in Mbps.
     */
    Max?: NullablePositiveInteger;
  }
  export interface BatchDeleteScheduledActionAnswer {
    /**
     * The names of the scheduled actions that could not be deleted, including an error message.
     */
    FailedScheduledActions?: FailedScheduledUpdateGroupActionRequests;
  }
  export interface BatchDeleteScheduledActionType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The names of the scheduled actions to delete. The maximum number allowed is 50. 
     */
    ScheduledActionNames: ScheduledActionNames;
  }
  export interface BatchPutScheduledUpdateGroupActionAnswer {
    /**
     * The names of the scheduled actions that could not be created or updated, including an error message.
     */
    FailedScheduledUpdateGroupActions?: FailedScheduledUpdateGroupActionRequests;
  }
  export interface BatchPutScheduledUpdateGroupActionType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * One or more scheduled actions. The maximum number allowed is 50.
     */
    ScheduledUpdateGroupActions: ScheduledUpdateGroupActionRequests;
  }
  export type BlockDeviceEbsDeleteOnTermination = boolean;
  export type BlockDeviceEbsEncrypted = boolean;
  export type BlockDeviceEbsIops = number;
  export type BlockDeviceEbsThroughput = number;
  export type BlockDeviceEbsVolumeSize = number;
  export type BlockDeviceEbsVolumeType = string;
  export interface BlockDeviceMapping {
    /**
     * The name of the instance store volume (virtual device) to attach to an instance at launch. The name must be in the form ephemeralX where X is a number starting from zero (0), for example, ephemeral0.
     */
    VirtualName?: XmlStringMaxLen255;
    /**
     * The device name assigned to the volume (for example, /dev/sdh or xvdh). For more information, see Device naming on Linux instances in the Amazon EC2 User Guide for Linux Instances.  To define a block device mapping, set the device name and exactly one of the following properties: Ebs, NoDevice, or VirtualName. 
     */
    DeviceName: XmlStringMaxLen255;
    /**
     * Information to attach an EBS volume to an instance at launch.
     */
    Ebs?: Ebs;
    /**
     * Setting this value to true prevents a volume that is included in the block device mapping of the AMI from being mapped to the specified device name at launch. If NoDevice is true for the root device, instances might fail the EC2 health check. In that case, Amazon EC2 Auto Scaling launches replacement instances.
     */
    NoDevice?: NoDevice;
  }
  export type BlockDeviceMappings = BlockDeviceMapping[];
  export type BurstablePerformance = "included"|"excluded"|"required"|string;
  export interface CancelInstanceRefreshAnswer {
    /**
     * The instance refresh ID associated with the request. This is the unique ID assigned to the instance refresh when it was started.
     */
    InstanceRefreshId?: XmlStringMaxLen255;
  }
  export interface CancelInstanceRefreshType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
  }
  export interface CapacityForecast {
    /**
     * The timestamps for the data points, in UTC format.
     */
    Timestamps: PredictiveScalingForecastTimestamps;
    /**
     * The values of the data points.
     */
    Values: PredictiveScalingForecastValues;
  }
  export type CapacityRebalanceEnabled = boolean;
  export type CheckpointDelay = number;
  export type CheckpointPercentages = NonZeroIntPercent[];
  export type ClassicLinkVPCSecurityGroups = XmlStringMaxLen255[];
  export interface CompleteLifecycleActionAnswer {
  }
  export interface CompleteLifecycleActionType {
    /**
     * The name of the lifecycle hook.
     */
    LifecycleHookName: AsciiStringMaxLen255;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: ResourceName;
    /**
     * A universally unique identifier (UUID) that identifies a specific lifecycle action associated with an instance. Amazon EC2 Auto Scaling sends this token to the notification target you specified when you created the lifecycle hook.
     */
    LifecycleActionToken?: LifecycleActionToken;
    /**
     * The action for the group to take. You can specify either CONTINUE or ABANDON.
     */
    LifecycleActionResult: LifecycleActionResult;
    /**
     * The ID of the instance.
     */
    InstanceId?: XmlStringMaxLen19;
  }
  export type Context = string;
  export type Cooldown = number;
  export type CpuManufacturer = "intel"|"amd"|"amazon-web-services"|string;
  export type CpuManufacturers = CpuManufacturer[];
  export interface CreateAutoScalingGroupType {
    /**
     * The name of the Auto Scaling group. This name must be unique per Region per account. The name can contain any ASCII character 33 to 126 including most punctuation characters, digits, and upper and lowercased letters.  You cannot use a colon (:) in the name. 
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The name of the launch configuration to use to launch instances.  Conditional: You must specify either a launch template (LaunchTemplate or MixedInstancesPolicy) or a launch configuration (LaunchConfigurationName or InstanceId).
     */
    LaunchConfigurationName?: XmlStringMaxLen255;
    /**
     * Information used to specify the launch template and version to use to launch instances.  Conditional: You must specify either a launch template (LaunchTemplate or MixedInstancesPolicy) or a launch configuration (LaunchConfigurationName or InstanceId).  The launch template that is specified must be configured for use with an Auto Scaling group. For more information, see Creating a launch template for an Auto Scaling group in the Amazon EC2 Auto Scaling User Guide. 
     */
    LaunchTemplate?: LaunchTemplateSpecification;
    /**
     * The mixed instances policy. For more information, see Auto Scaling groups with multiple instance types and purchase options in the Amazon EC2 Auto Scaling User Guide.
     */
    MixedInstancesPolicy?: MixedInstancesPolicy;
    /**
     * The ID of the instance used to base the launch configuration on. If specified, Amazon EC2 Auto Scaling uses the configuration values from the specified instance to create a new launch configuration. To get the instance ID, use the Amazon EC2 DescribeInstances API operation. For more information, see Creating an Auto Scaling group using an EC2 instance in the Amazon EC2 Auto Scaling User Guide.
     */
    InstanceId?: XmlStringMaxLen19;
    /**
     * The minimum size of the group.
     */
    MinSize: AutoScalingGroupMinSize;
    /**
     * The maximum size of the group.  With a mixed instances policy that uses instance weighting, Amazon EC2 Auto Scaling may need to go above MaxSize to meet your capacity requirements. In this event, Amazon EC2 Auto Scaling will never go above MaxSize by more than your largest instance weight (weights that define how many units each instance contributes to the desired capacity of the group). 
     */
    MaxSize: AutoScalingGroupMaxSize;
    /**
     * The desired capacity is the initial capacity of the Auto Scaling group at the time of its creation and the capacity it attempts to maintain. It can scale beyond this capacity if you configure auto scaling. This number must be greater than or equal to the minimum size of the group and less than or equal to the maximum size of the group. If you do not specify a desired capacity, the default is the minimum size of the group.
     */
    DesiredCapacity?: AutoScalingGroupDesiredCapacity;
    /**
     *  Only needed if you use simple scaling policies.  The amount of time, in seconds, between one scaling activity ending and another one starting due to simple scaling policies. For more information, see Scaling cooldowns for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. Default: 300 seconds
     */
    DefaultCooldown?: Cooldown;
    /**
     * A list of Availability Zones where instances in the Auto Scaling group can be created. Used for launching into the default VPC subnet in each Availability Zone when not using the VPCZoneIdentifier property, or for attaching a network interface when an existing network interface ID is specified in a launch template.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * A list of Classic Load Balancers associated with this Auto Scaling group. For Application Load Balancers, Network Load Balancers, and Gateway Load Balancers, specify the TargetGroupARNs property instead.
     */
    LoadBalancerNames?: LoadBalancerNames;
    /**
     * The Amazon Resource Names (ARN) of the Elastic Load Balancing target groups to associate with the Auto Scaling group. Instances are registered as targets with the target groups. The target groups receive incoming traffic and route requests to one or more registered targets. For more information, see Use Elastic Load Balancing to distribute traffic across the instances in your Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
     */
    TargetGroupARNs?: TargetGroupARNs;
    /**
     * A comma-separated value string of one or more health check types. The valid values are EC2, ELB, and VPC_LATTICE. EC2 is the default health check and cannot be disabled. For more information, see Health checks for Auto Scaling instances in the Amazon EC2 Auto Scaling User Guide. Only specify EC2 if you must clear a value that was previously set.
     */
    HealthCheckType?: XmlStringMaxLen32;
    /**
     * The amount of time, in seconds, that Amazon EC2 Auto Scaling waits before checking the health status of an EC2 instance that has come into service and marking it unhealthy due to a failed health check. This is useful if your instances do not immediately pass their health checks after they enter the InService state. For more information, see Set the health check grace period for an Auto Scaling group in the Amazon EC2 Auto Scaling User Guide. Default: 0 seconds
     */
    HealthCheckGracePeriod?: HealthCheckGracePeriod;
    /**
     * The name of the placement group into which to launch your instances. For more information, see Placement groups in the Amazon EC2 User Guide for Linux Instances.  A cluster placement group is a logical grouping of instances within a single Availability Zone. You cannot specify multiple Availability Zones and a cluster placement group.  
     */
    PlacementGroup?: XmlStringMaxLen255;
    /**
     * A comma-separated list of subnet IDs for a virtual private cloud (VPC) where instances in the Auto Scaling group can be created. If you specify VPCZoneIdentifier with AvailabilityZones, the subnets that you specify must reside in those Availability Zones.
     */
    VPCZoneIdentifier?: XmlStringMaxLen2047;
    /**
     * A policy or a list of policies that are used to select the instance to terminate. These policies are executed in the order that you list them. For more information, see Work with Amazon EC2 Auto Scaling termination policies in the Amazon EC2 Auto Scaling User Guide. Valid values: Default | AllocationStrategy | ClosestToNextInstanceHour | NewestInstance | OldestInstance | OldestLaunchConfiguration | OldestLaunchTemplate | arn:aws:lambda:region:account-id:function:my-function:my-alias 
     */
    TerminationPolicies?: TerminationPolicies;
    /**
     * Indicates whether newly launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in. For more information about preventing instances from terminating on scale in, see Using instance scale-in protection in the Amazon EC2 Auto Scaling User Guide.
     */
    NewInstancesProtectedFromScaleIn?: InstanceProtected;
    /**
     * Indicates whether Capacity Rebalancing is enabled. Otherwise, Capacity Rebalancing is disabled. When you turn on Capacity Rebalancing, Amazon EC2 Auto Scaling attempts to launch a Spot Instance whenever Amazon EC2 notifies that a Spot Instance is at an elevated risk of interruption. After launching a new instance, it then terminates an old instance. For more information, see Use Capacity Rebalancing to handle Amazon EC2 Spot Interruptions in the in the Amazon EC2 Auto Scaling User Guide.
     */
    CapacityRebalance?: CapacityRebalanceEnabled;
    /**
     * One or more lifecycle hooks to add to the Auto Scaling group before instances are launched.
     */
    LifecycleHookSpecificationList?: LifecycleHookSpecifications;
    /**
     * One or more tags. You can tag your Auto Scaling group and propagate the tags to the Amazon EC2 instances it launches. Tags are not propagated to Amazon EBS volumes. To add tags to Amazon EBS volumes, specify the tags in a launch template but use caution. If the launch template specifies an instance tag with a key that is also specified for the Auto Scaling group, Amazon EC2 Auto Scaling overrides the value of that instance tag with the value specified by the Auto Scaling group. For more information, see Tag Auto Scaling groups and instances in the Amazon EC2 Auto Scaling User Guide.
     */
    Tags?: Tags;
    /**
     * The Amazon Resource Name (ARN) of the service-linked role that the Auto Scaling group uses to call other Amazon Web Services service on your behalf. By default, Amazon EC2 Auto Scaling uses a service-linked role named AWSServiceRoleForAutoScaling, which it creates if it does not exist. For more information, see Service-linked roles in the Amazon EC2 Auto Scaling User Guide.
     */
    ServiceLinkedRoleARN?: ResourceName;
    /**
     * The maximum amount of time, in seconds, that an instance can be in service. The default is null. If specified, the value must be either 0 or a number equal to or greater than 86,400 seconds (1 day). For more information, see Replacing Auto Scaling instances based on maximum instance lifetime in the Amazon EC2 Auto Scaling User Guide.
     */
    MaxInstanceLifetime?: MaxInstanceLifetime;
    /**
     * Reserved.
     */
    Context?: Context;
    /**
     * The unit of measurement for the value specified for desired capacity. Amazon EC2 Auto Scaling supports DesiredCapacityType for attribute-based instance type selection only. For more information, see Creating an Auto Scaling group using attribute-based instance type selection in the Amazon EC2 Auto Scaling User Guide. By default, Amazon EC2 Auto Scaling specifies units, which translates into number of instances. Valid values: units | vcpu | memory-mib 
     */
    DesiredCapacityType?: XmlStringMaxLen255;
    /**
     * The amount of time, in seconds, until a new instance is considered to have finished initializing and resource consumption to become stable after it enters the InService state.  During an instance refresh, Amazon EC2 Auto Scaling waits for the warm-up period after it replaces an instance before it moves on to replacing the next instance. Amazon EC2 Auto Scaling also waits for the warm-up period before aggregating the metrics for new instances with existing instances in the Amazon CloudWatch metrics that are used for scaling, resulting in more reliable usage data. For more information, see Set the default instance warmup for an Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.  To manage various warm-up settings at the group level, we recommend that you set the default instance warmup, even if it is set to 0 seconds. To remove a value that you previously set, include the property but specify -1 for the value. However, we strongly recommend keeping the default instance warmup enabled by specifying a value of 0 or other nominal value.  Default: None 
     */
    DefaultInstanceWarmup?: DefaultInstanceWarmup;
    /**
     * The list of traffic sources to attach to this Auto Scaling group. You can use any of the following as traffic sources for an Auto Scaling group: Classic Load Balancer, Application Load Balancer, Gateway Load Balancer, Network Load Balancer, and VPC Lattice.
     */
    TrafficSources?: TrafficSources;
  }
  export interface CreateLaunchConfigurationType {
    /**
     * The name of the launch configuration. This name must be unique per Region per account.
     */
    LaunchConfigurationName: XmlStringMaxLen255;
    /**
     * The ID of the Amazon Machine Image (AMI) that was assigned during registration. For more information, see Finding a Linux AMI in the Amazon EC2 User Guide for Linux Instances. If you specify InstanceId, an ImageId is not required.
     */
    ImageId?: XmlStringMaxLen255;
    /**
     * The name of the key pair. For more information, see Amazon EC2 key pairs and Linux instances in the Amazon EC2 User Guide for Linux Instances.
     */
    KeyName?: XmlStringMaxLen255;
    /**
     * A list that contains the security group IDs to assign to the instances in the Auto Scaling group. For more information, see Control traffic to resources using security groups in the Amazon Virtual Private Cloud User Guide.
     */
    SecurityGroups?: SecurityGroups;
    /**
     * Available for backward compatibility.
     */
    ClassicLinkVPCId?: XmlStringMaxLen255;
    /**
     * Available for backward compatibility.
     */
    ClassicLinkVPCSecurityGroups?: ClassicLinkVPCSecurityGroups;
    /**
     * The user data to make available to the launched EC2 instances. For more information, see Instance metadata and user data (Linux) and Instance metadata and user data (Windows). If you are using a command line tool, base64-encoding is performed for you, and you can load the text from a file. Otherwise, you must provide base64-encoded text. User data is limited to 16 KB.
     */
    UserData?: XmlStringUserData;
    /**
     * The ID of the instance to use to create the launch configuration. The new launch configuration derives attributes from the instance, except for the block device mapping. To create a launch configuration with a block device mapping or override any other instance attributes, specify them as part of the same request. For more information, see Creating a launch configuration using an EC2 instance in the Amazon EC2 Auto Scaling User Guide.
     */
    InstanceId?: XmlStringMaxLen19;
    /**
     * Specifies the instance type of the EC2 instance. For information about available instance types, see Available instance types in the Amazon EC2 User Guide for Linux Instances. If you specify InstanceId, an InstanceType is not required.
     */
    InstanceType?: XmlStringMaxLen255;
    /**
     * The ID of the kernel associated with the AMI.  We recommend that you use PV-GRUB instead of kernels and RAM disks. For more information, see User provided kernels in the Amazon EC2 User Guide for Linux Instances. 
     */
    KernelId?: XmlStringMaxLen255;
    /**
     * The ID of the RAM disk to select.  We recommend that you use PV-GRUB instead of kernels and RAM disks. For more information, see User provided kernels in the Amazon EC2 User Guide for Linux Instances. 
     */
    RamdiskId?: XmlStringMaxLen255;
    /**
     * The block device mapping entries that define the block devices to attach to the instances at launch. By default, the block devices specified in the block device mapping for the AMI are used. For more information, see Block device mappings in the Amazon EC2 User Guide for Linux Instances.
     */
    BlockDeviceMappings?: BlockDeviceMappings;
    /**
     * Controls whether instances in this group are launched with detailed (true) or basic (false) monitoring. The default value is true (enabled).  When detailed monitoring is enabled, Amazon CloudWatch generates metrics every minute and your account is charged a fee. When you disable detailed monitoring, CloudWatch generates metrics every 5 minutes. For more information, see Configure Monitoring for Auto Scaling Instances in the Amazon EC2 Auto Scaling User Guide. 
     */
    InstanceMonitoring?: InstanceMonitoring;
    /**
     * The maximum hourly price to be paid for any Spot Instance launched to fulfill the request. Spot Instances are launched when the price you specify exceeds the current Spot price. For more information, see Request Spot Instances for fault-tolerant and flexible applications in the Amazon EC2 Auto Scaling User Guide. Valid Range: Minimum value of 0.001  When you change your maximum price by creating a new launch configuration, running instances will continue to run as long as the maximum price for those running instances is higher than the current Spot price. 
     */
    SpotPrice?: SpotPrice;
    /**
     * The name or the Amazon Resource Name (ARN) of the instance profile associated with the IAM role for the instance. The instance profile contains the IAM role. For more information, see IAM role for applications that run on Amazon EC2 instances in the Amazon EC2 Auto Scaling User Guide.
     */
    IamInstanceProfile?: XmlStringMaxLen1600;
    /**
     * Specifies whether the launch configuration is optimized for EBS I/O (true) or not (false). The optimization provides dedicated throughput to Amazon EBS and an optimized configuration stack to provide optimal I/O performance. This optimization is not available with all instance types. Additional fees are incurred when you enable EBS optimization for an instance type that is not EBS-optimized by default. For more information, see Amazon EBS-optimized instances in the Amazon EC2 User Guide for Linux Instances. The default value is false.
     */
    EbsOptimized?: EbsOptimized;
    /**
     * Specifies whether to assign a public IPv4 address to the group's instances. If the instance is launched into a default subnet, the default is to assign a public IPv4 address, unless you disabled the option to assign a public IPv4 address on the subnet. If the instance is launched into a nondefault subnet, the default is not to assign a public IPv4 address, unless you enabled the option to assign a public IPv4 address on the subnet. If you specify true, each instance in the Auto Scaling group receives a unique public IPv4 address. For more information, see Launching Auto Scaling instances in a VPC in the Amazon EC2 Auto Scaling User Guide. If you specify this property, you must specify at least one subnet for VPCZoneIdentifier when you create your group.
     */
    AssociatePublicIpAddress?: AssociatePublicIpAddress;
    /**
     * The tenancy of the instance, either default or dedicated. An instance with dedicated tenancy runs on isolated, single-tenant hardware and can only be launched into a VPC. To launch dedicated instances into a shared tenancy VPC (a VPC with the instance placement tenancy attribute set to default), you must set the value of this property to dedicated. For more information, see Configuring instance tenancy with Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. If you specify PlacementTenancy, you must specify at least one subnet for VPCZoneIdentifier when you create your group. Valid values: default | dedicated 
     */
    PlacementTenancy?: XmlStringMaxLen64;
    /**
     * The metadata options for the instances. For more information, see Configuring the Instance Metadata Options in the Amazon EC2 Auto Scaling User Guide.
     */
    MetadataOptions?: InstanceMetadataOptions;
  }
  export interface CreateOrUpdateTagsType {
    /**
     * One or more tags.
     */
    Tags: Tags;
  }
  export interface CustomizedMetricSpecification {
    /**
     * The name of the metric. To get the exact metric name, namespace, and dimensions, inspect the Metric object that is returned by a call to ListMetrics.
     */
    MetricName?: MetricName;
    /**
     * The namespace of the metric.
     */
    Namespace?: MetricNamespace;
    /**
     * The dimensions of the metric. Conditional: If you published your metric with dimensions, you must specify the same dimensions in your scaling policy.
     */
    Dimensions?: MetricDimensions;
    /**
     * The statistic of the metric.
     */
    Statistic?: MetricStatistic;
    /**
     * The unit of the metric. For a complete list of the units that CloudWatch supports, see the MetricDatum data type in the Amazon CloudWatch API Reference.
     */
    Unit?: MetricUnit;
    /**
     * The metrics to include in the target tracking scaling policy, as a metric data query. This can include both raw metric and metric math expressions.
     */
    Metrics?: TargetTrackingMetricDataQueries;
  }
  export type DefaultInstanceWarmup = number;
  export interface DeleteAutoScalingGroupType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * Specifies that the group is to be deleted along with all instances associated with the group, without waiting for all instances to be terminated. This action also deletes any outstanding lifecycle actions associated with the group.
     */
    ForceDelete?: ForceDelete;
  }
  export interface DeleteLifecycleHookAnswer {
  }
  export interface DeleteLifecycleHookType {
    /**
     * The name of the lifecycle hook.
     */
    LifecycleHookName: AsciiStringMaxLen255;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
  }
  export interface DeleteNotificationConfigurationType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic.
     */
    TopicARN: XmlStringMaxLen255;
  }
  export interface DeletePolicyType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName?: XmlStringMaxLen255;
    /**
     * The name or Amazon Resource Name (ARN) of the policy.
     */
    PolicyName: ResourceName;
  }
  export interface DeleteScheduledActionType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The name of the action to delete.
     */
    ScheduledActionName: XmlStringMaxLen255;
  }
  export interface DeleteTagsType {
    /**
     * One or more tags.
     */
    Tags: Tags;
  }
  export interface DeleteWarmPoolAnswer {
  }
  export interface DeleteWarmPoolType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * Specifies that the warm pool is to be deleted along with all of its associated instances, without waiting for all instances to be terminated. This parameter also deletes any outstanding lifecycle actions associated with the warm pool instances.
     */
    ForceDelete?: ForceDelete;
  }
  export interface DescribeAccountLimitsAnswer {
    /**
     * The maximum number of groups allowed for your account. The default is 200 groups per Region.
     */
    MaxNumberOfAutoScalingGroups?: MaxNumberOfAutoScalingGroups;
    /**
     * The maximum number of launch configurations allowed for your account. The default is 200 launch configurations per Region.
     */
    MaxNumberOfLaunchConfigurations?: MaxNumberOfLaunchConfigurations;
    /**
     * The current number of groups for your account.
     */
    NumberOfAutoScalingGroups?: NumberOfAutoScalingGroups;
    /**
     * The current number of launch configurations for your account.
     */
    NumberOfLaunchConfigurations?: NumberOfLaunchConfigurations;
  }
  export interface DescribeAdjustmentTypesAnswer {
    /**
     * The policy adjustment types.
     */
    AdjustmentTypes?: AdjustmentTypes;
  }
  export interface DescribeAutoScalingInstancesType {
    /**
     * The IDs of the instances. If you omit this property, all Auto Scaling instances are described. If you specify an ID that does not exist, it is ignored with no error. Array Members: Maximum number of 50 items.
     */
    InstanceIds?: InstanceIds;
    /**
     * The maximum number of items to return with this call. The default value is 50 and the maximum value is 50.
     */
    MaxRecords?: MaxRecords;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
  }
  export interface DescribeAutoScalingNotificationTypesAnswer {
    /**
     * The notification types.
     */
    AutoScalingNotificationTypes?: AutoScalingNotificationTypes;
  }
  export interface DescribeInstanceRefreshesAnswer {
    /**
     * The instance refreshes for the specified group, sorted by creation timestamp in descending order.
     */
    InstanceRefreshes?: InstanceRefreshes;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface DescribeInstanceRefreshesType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * One or more instance refresh IDs.
     */
    InstanceRefreshIds?: InstanceRefreshIds;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
    /**
     * The maximum number of items to return with this call. The default value is 50 and the maximum value is 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeLifecycleHookTypesAnswer {
    /**
     * The lifecycle hook types.
     */
    LifecycleHookTypes?: AutoScalingNotificationTypes;
  }
  export interface DescribeLifecycleHooksAnswer {
    /**
     * The lifecycle hooks for the specified group.
     */
    LifecycleHooks?: LifecycleHooks;
  }
  export interface DescribeLifecycleHooksType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The names of one or more lifecycle hooks. If you omit this property, all lifecycle hooks are described.
     */
    LifecycleHookNames?: LifecycleHookNames;
  }
  export interface DescribeLoadBalancerTargetGroupsRequest {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
    /**
     * The maximum number of items to return with this call. The default value is 100 and the maximum value is 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeLoadBalancerTargetGroupsResponse {
    /**
     * Information about the target groups.
     */
    LoadBalancerTargetGroups?: LoadBalancerTargetGroupStates;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface DescribeLoadBalancersRequest {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
    /**
     * The maximum number of items to return with this call. The default value is 100 and the maximum value is 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeLoadBalancersResponse {
    /**
     * The load balancers.
     */
    LoadBalancers?: LoadBalancerStates;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface DescribeMetricCollectionTypesAnswer {
    /**
     * The metrics.
     */
    Metrics?: MetricCollectionTypes;
    /**
     * The granularities for the metrics.
     */
    Granularities?: MetricGranularityTypes;
  }
  export interface DescribeNotificationConfigurationsAnswer {
    /**
     * The notification configurations.
     */
    NotificationConfigurations: NotificationConfigurations;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface DescribeNotificationConfigurationsType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupNames?: AutoScalingGroupNames;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
    /**
     * The maximum number of items to return with this call. The default value is 50 and the maximum value is 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribePoliciesType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName?: XmlStringMaxLen255;
    /**
     * The names of one or more policies. If you omit this property, all policies are described. If a group name is provided, the results are limited to that group. If you specify an unknown policy name, it is ignored with no error. Array Members: Maximum number of 50 items.
     */
    PolicyNames?: PolicyNames;
    /**
     * One or more policy types. The valid values are SimpleScaling, StepScaling, TargetTrackingScaling, and PredictiveScaling.
     */
    PolicyTypes?: PolicyTypes;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
    /**
     * The maximum number of items to be returned with each call. The default value is 50 and the maximum value is 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeScalingActivitiesType {
    /**
     * The activity IDs of the desired scaling activities. If you omit this property, all activities for the past six weeks are described. If unknown activities are requested, they are ignored with no error. If you specify an Auto Scaling group, the results are limited to that group. Array Members: Maximum number of 50 IDs.
     */
    ActivityIds?: ActivityIds;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName?: XmlStringMaxLen255;
    /**
     * Indicates whether to include scaling activity from deleted Auto Scaling groups.
     */
    IncludeDeletedGroups?: IncludeDeletedGroups;
    /**
     * The maximum number of items to return with this call. The default value is 100 and the maximum value is 100.
     */
    MaxRecords?: MaxRecords;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
  }
  export interface DescribeScheduledActionsType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName?: XmlStringMaxLen255;
    /**
     * The names of one or more scheduled actions. If you omit this property, all scheduled actions are described. If you specify an unknown scheduled action, it is ignored with no error. Array Members: Maximum number of 50 actions.
     */
    ScheduledActionNames?: ScheduledActionNames;
    /**
     * The earliest scheduled start time to return. If scheduled action names are provided, this property is ignored.
     */
    StartTime?: TimestampType;
    /**
     * The latest scheduled start time to return. If scheduled action names are provided, this property is ignored.
     */
    EndTime?: TimestampType;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
    /**
     * The maximum number of items to return with this call. The default value is 50 and the maximum value is 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeTagsType {
    /**
     * One or more filters to scope the tags to return. The maximum number of filters per filter type (for example, auto-scaling-group) is 1000.
     */
    Filters?: Filters;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
    /**
     * The maximum number of items to return with this call. The default value is 50 and the maximum value is 100.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeTerminationPolicyTypesAnswer {
    /**
     * The termination policies supported by Amazon EC2 Auto Scaling: OldestInstance, OldestLaunchConfiguration, NewestInstance, ClosestToNextInstanceHour, Default, OldestLaunchTemplate, and AllocationStrategy.
     */
    TerminationPolicyTypes?: TerminationPolicies;
  }
  export interface DescribeTrafficSourcesRequest {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The traffic source type that you want to describe. The following lists the valid values:    elb if the traffic source is a Classic Load Balancer.    elbv2 if the traffic source is a Application Load Balancer, Gateway Load Balancer, or Network Load Balancer.    vpc-lattice if the traffic source is VPC Lattice.  
     */
    TrafficSourceType?: XmlStringMaxLen255;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
    /**
     * The maximum number of items to return with this call. The maximum value is 50.
     */
    MaxRecords?: MaxRecords;
  }
  export interface DescribeTrafficSourcesResponse {
    /**
     * Information about the traffic sources.
     */
    TrafficSources?: TrafficSourceStates;
    /**
     * This string indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface DescribeWarmPoolAnswer {
    /**
     * The warm pool configuration details. 
     */
    WarmPoolConfiguration?: WarmPoolConfiguration;
    /**
     * The instances that are currently in the warm pool.
     */
    Instances?: Instances;
    /**
     * This string indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface DescribeWarmPoolType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The maximum number of instances to return with this call. The maximum value is 50.
     */
    MaxRecords?: MaxRecords;
    /**
     * The token for the next set of instances to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
  }
  export interface DesiredConfiguration {
    /**
     * Describes the launch template and the version of the launch template that Amazon EC2 Auto Scaling uses to launch Amazon EC2 instances. For more information about launch templates, see Launch templates in the Amazon EC2 Auto Scaling User Guide.
     */
    LaunchTemplate?: LaunchTemplateSpecification;
    /**
     * Use this structure to launch multiple instance types and On-Demand Instances and Spot Instances within a single Auto Scaling group. A mixed instances policy contains information that Amazon EC2 Auto Scaling can use to launch instances and help optimize your costs. For more information, see Auto Scaling groups with multiple instance types and purchase options in the Amazon EC2 Auto Scaling User Guide.
     */
    MixedInstancesPolicy?: MixedInstancesPolicy;
  }
  export interface DetachInstancesAnswer {
    /**
     * The activities related to detaching the instances from the Auto Scaling group.
     */
    Activities?: Activities;
  }
  export interface DetachInstancesQuery {
    /**
     * The IDs of the instances. You can specify up to 20 instances.
     */
    InstanceIds?: InstanceIds;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * Indicates whether the Auto Scaling group decrements the desired capacity value by the number of instances detached.
     */
    ShouldDecrementDesiredCapacity: ShouldDecrementDesiredCapacity;
  }
  export interface DetachLoadBalancerTargetGroupsResultType {
  }
  export interface DetachLoadBalancerTargetGroupsType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The Amazon Resource Names (ARN) of the target groups. You can specify up to 10 target groups.
     */
    TargetGroupARNs: TargetGroupARNs;
  }
  export interface DetachLoadBalancersResultType {
  }
  export interface DetachLoadBalancersType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The names of the load balancers. You can specify up to 10 load balancers.
     */
    LoadBalancerNames: LoadBalancerNames;
  }
  export interface DetachTrafficSourcesResultType {
  }
  export interface DetachTrafficSourcesType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The unique identifiers of one or more traffic sources. You can specify up to 10 traffic sources.
     */
    TrafficSources: TrafficSources;
  }
  export interface DisableMetricsCollectionQuery {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * Identifies the metrics to disable. You can specify one or more of the following metrics:    GroupMinSize     GroupMaxSize     GroupDesiredCapacity     GroupInServiceInstances     GroupPendingInstances     GroupStandbyInstances     GroupTerminatingInstances     GroupTotalInstances     GroupInServiceCapacity     GroupPendingCapacity     GroupStandbyCapacity     GroupTerminatingCapacity     GroupTotalCapacity     WarmPoolDesiredCapacity     WarmPoolWarmedCapacity     WarmPoolPendingCapacity     WarmPoolTerminatingCapacity     WarmPoolTotalCapacity     GroupAndWarmPoolDesiredCapacity     GroupAndWarmPoolTotalCapacity    If you omit this property, all metrics are disabled. For more information, see Auto Scaling group metrics in the Amazon EC2 Auto Scaling User Guide.
     */
    Metrics?: Metrics;
  }
  export type DisableScaleIn = boolean;
  export interface Ebs {
    /**
     * The snapshot ID of the volume to use. You must specify either a VolumeSize or a SnapshotId.
     */
    SnapshotId?: XmlStringMaxLen255;
    /**
     * The volume size, in GiBs. The following are the supported volumes sizes for each volume type:     gp2 and gp3: 1-16,384    io1: 4-16,384    st1 and sc1: 125-16,384    standard: 1-1,024   You must specify either a SnapshotId or a VolumeSize. If you specify both SnapshotId and VolumeSize, the volume size must be equal or greater than the size of the snapshot.
     */
    VolumeSize?: BlockDeviceEbsVolumeSize;
    /**
     * The volume type. For more information, see Amazon EBS volume types in the Amazon EC2 User Guide for Linux Instances. Valid values: standard | io1 | gp2 | st1 | sc1 | gp3 
     */
    VolumeType?: BlockDeviceEbsVolumeType;
    /**
     * Indicates whether the volume is deleted on instance termination. For Amazon EC2 Auto Scaling, the default value is true.
     */
    DeleteOnTermination?: BlockDeviceEbsDeleteOnTermination;
    /**
     * The number of input/output (I/O) operations per second (IOPS) to provision for the volume. For gp3 and io1 volumes, this represents the number of IOPS that are provisioned for the volume. For gp2 volumes, this represents the baseline performance of the volume and the rate at which the volume accumulates I/O credits for bursting.  The following are the supported values for each volume type:     gp3: 3,000-16,000 IOPS    io1: 100-64,000 IOPS   For io1 volumes, we guarantee 64,000 IOPS only for Instances built on the Nitro System. Other instance families guarantee performance up to 32,000 IOPS.   Iops is supported when the volume type is gp3 or io1 and required only when the volume type is io1. (Not used with standard, gp2, st1, or sc1 volumes.) 
     */
    Iops?: BlockDeviceEbsIops;
    /**
     * Specifies whether the volume should be encrypted. Encrypted EBS volumes can only be attached to instances that support Amazon EBS encryption. For more information, see Supported instance types. If your AMI uses encrypted volumes, you can also only launch it on supported instance types.  If you are creating a volume from a snapshot, you cannot create an unencrypted volume from an encrypted snapshot. Also, you cannot specify a KMS key ID when using a launch configuration. If you enable encryption by default, the EBS volumes that you create are always encrypted, either using the Amazon Web Services managed KMS key or a customer-managed KMS key, regardless of whether the snapshot was encrypted.  For more information, see Use Amazon Web Services KMS keys to encrypt Amazon EBS volumes in the Amazon EC2 Auto Scaling User Guide. 
     */
    Encrypted?: BlockDeviceEbsEncrypted;
    /**
     * The throughput (MiBps) to provision for a gp3 volume.
     */
    Throughput?: BlockDeviceEbsThroughput;
  }
  export type EbsOptimized = boolean;
  export interface EnableMetricsCollectionQuery {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * Identifies the metrics to enable. You can specify one or more of the following metrics:    GroupMinSize     GroupMaxSize     GroupDesiredCapacity     GroupInServiceInstances     GroupPendingInstances     GroupStandbyInstances     GroupTerminatingInstances     GroupTotalInstances     GroupInServiceCapacity     GroupPendingCapacity     GroupStandbyCapacity     GroupTerminatingCapacity     GroupTotalCapacity     WarmPoolDesiredCapacity     WarmPoolWarmedCapacity     WarmPoolPendingCapacity     WarmPoolTerminatingCapacity     WarmPoolTotalCapacity     GroupAndWarmPoolDesiredCapacity     GroupAndWarmPoolTotalCapacity    If you specify Granularity and don't specify any metrics, all metrics are enabled. For more information, see Auto Scaling group metrics in the Amazon EC2 Auto Scaling User Guide.
     */
    Metrics?: Metrics;
    /**
     * The frequency at which Amazon EC2 Auto Scaling sends aggregated data to CloudWatch. The only valid value is 1Minute.
     */
    Granularity: XmlStringMaxLen255;
  }
  export interface EnabledMetric {
    /**
     * One of the following metrics:    GroupMinSize     GroupMaxSize     GroupDesiredCapacity     GroupInServiceInstances     GroupPendingInstances     GroupStandbyInstances     GroupTerminatingInstances     GroupTotalInstances     GroupInServiceCapacity     GroupPendingCapacity     GroupStandbyCapacity     GroupTerminatingCapacity     GroupTotalCapacity     WarmPoolDesiredCapacity     WarmPoolWarmedCapacity     WarmPoolPendingCapacity     WarmPoolTerminatingCapacity     WarmPoolTotalCapacity     GroupAndWarmPoolDesiredCapacity     GroupAndWarmPoolTotalCapacity    For more information, see Auto Scaling group metrics in the Amazon EC2 Auto Scaling User Guide.
     */
    Metric?: XmlStringMaxLen255;
    /**
     * The granularity of the metric. The only valid value is 1Minute.
     */
    Granularity?: XmlStringMaxLen255;
  }
  export type EnabledMetrics = EnabledMetric[];
  export interface EnterStandbyAnswer {
    /**
     * The activities related to moving instances into Standby mode.
     */
    Activities?: Activities;
  }
  export interface EnterStandbyQuery {
    /**
     * The IDs of the instances. You can specify up to 20 instances.
     */
    InstanceIds?: InstanceIds;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * Indicates whether to decrement the desired capacity of the Auto Scaling group by the number of instances moved to Standby mode.
     */
    ShouldDecrementDesiredCapacity: ShouldDecrementDesiredCapacity;
  }
  export type EstimatedInstanceWarmup = number;
  export type ExcludedInstance = string;
  export type ExcludedInstanceTypes = ExcludedInstance[];
  export interface ExecutePolicyType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName?: XmlStringMaxLen255;
    /**
     * The name or ARN of the policy.
     */
    PolicyName: ResourceName;
    /**
     * Indicates whether Amazon EC2 Auto Scaling waits for the cooldown period to complete before executing the policy. Valid only if the policy type is SimpleScaling. For more information, see Scaling cooldowns for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
     */
    HonorCooldown?: HonorCooldown;
    /**
     * The metric value to compare to BreachThreshold. This enables you to execute a policy of type StepScaling and determine which step adjustment to use. For example, if the breach threshold is 50 and you want to use a step adjustment with a lower bound of 0 and an upper bound of 10, you can set the metric value to 59. If you specify a metric value that doesn't correspond to a step adjustment for the policy, the call returns an error. Required if the policy type is StepScaling and not supported otherwise.
     */
    MetricValue?: MetricScale;
    /**
     * The breach threshold for the alarm. Required if the policy type is StepScaling and not supported otherwise.
     */
    BreachThreshold?: MetricScale;
  }
  export interface ExitStandbyAnswer {
    /**
     * The activities related to moving instances out of Standby mode.
     */
    Activities?: Activities;
  }
  export interface ExitStandbyQuery {
    /**
     * The IDs of the instances. You can specify up to 20 instances.
     */
    InstanceIds?: InstanceIds;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
  }
  export interface FailedScheduledUpdateGroupActionRequest {
    /**
     * The name of the scheduled action.
     */
    ScheduledActionName: XmlStringMaxLen255;
    /**
     * The error code.
     */
    ErrorCode?: XmlStringMaxLen64;
    /**
     * The error message accompanying the error code.
     */
    ErrorMessage?: XmlString;
  }
  export type FailedScheduledUpdateGroupActionRequests = FailedScheduledUpdateGroupActionRequest[];
  export interface Filter {
    /**
     * The name of the filter. The valid values for Name depend on which API operation you're using with the filter (DescribeAutoScalingGroups or DescribeTags).  DescribeAutoScalingGroups  Valid values for Name include the following:     tag-key - Accepts tag keys. The results only include information about the Auto Scaling groups associated with these tag keys.     tag-value - Accepts tag values. The results only include information about the Auto Scaling groups associated with these tag values.     tag:&lt;key&gt; - Accepts the key/value combination of the tag. Use the tag key in the filter name and the tag value as the filter value. The results only include information about the Auto Scaling groups associated with the specified key/value combination.     DescribeTags  Valid values for Name include the following:     auto-scaling-group - Accepts the names of Auto Scaling groups. The results only include information about the tags associated with these Auto Scaling groups.     key - Accepts tag keys. The results only include information about the tags associated with these tag keys.     value - Accepts tag values. The results only include information about the tags associated with these tag values.     propagate-at-launch - Accepts a Boolean value, which specifies whether tags propagate to instances at launch. The results only include information about the tags associated with the specified Boolean value.   
     */
    Name?: XmlString;
    /**
     * One or more filter values. Filter values are case-sensitive.  If you specify multiple values for a filter, the values are automatically logically joined with an OR, and the request returns all results that match any of the specified values. For example, specify "tag:environment" for the filter name and "production,development" for the filter values to find Auto Scaling groups with the tag "environment=production" or "environment=development".
     */
    Values?: Values;
  }
  export type Filters = Filter[];
  export type ForceDelete = boolean;
  export interface GetPredictiveScalingForecastAnswer {
    /**
     * The load forecast.
     */
    LoadForecast: LoadForecasts;
    /**
     * The capacity forecast.
     */
    CapacityForecast: CapacityForecast;
    /**
     * The time the forecast was made.
     */
    UpdateTime: TimestampType;
  }
  export interface GetPredictiveScalingForecastType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The name of the policy.
     */
    PolicyName: XmlStringMaxLen255;
    /**
     * The inclusive start time of the time range for the forecast data to get. At most, the date and time can be one year before the current date and time.
     */
    StartTime: TimestampType;
    /**
     * The exclusive end time of the time range for the forecast data to get. The maximum time duration between the start and end time is 30 days.  Although this parameter can accept a date and time that is more than two days in the future, the availability of forecast data has limits. Amazon EC2 Auto Scaling only issues forecasts for periods of two days in advance.
     */
    EndTime: TimestampType;
  }
  export type GlobalTimeout = number;
  export type HealthCheckGracePeriod = number;
  export type HeartbeatTimeout = number;
  export type HonorCooldown = boolean;
  export type IncludeDeletedGroups = boolean;
  export interface Instance {
    /**
     * The ID of the instance.
     */
    InstanceId: XmlStringMaxLen19;
    /**
     * The instance type of the EC2 instance.
     */
    InstanceType?: XmlStringMaxLen255;
    /**
     * The Availability Zone in which the instance is running.
     */
    AvailabilityZone: XmlStringMaxLen255;
    /**
     * A description of the current lifecycle state. The Quarantined state is not used. For information about lifecycle states, see Instance lifecycle in the Amazon EC2 Auto Scaling User Guide. 
     */
    LifecycleState: LifecycleState;
    /**
     * The last reported health status of the instance. Healthy means that the instance is healthy and should remain in service. Unhealthy means that the instance is unhealthy and that Amazon EC2 Auto Scaling should terminate and replace it.
     */
    HealthStatus: XmlStringMaxLen32;
    /**
     * The launch configuration associated with the instance.
     */
    LaunchConfigurationName?: XmlStringMaxLen255;
    /**
     * The launch template for the instance.
     */
    LaunchTemplate?: LaunchTemplateSpecification;
    /**
     * Indicates whether the instance is protected from termination by Amazon EC2 Auto Scaling when scaling in.
     */
    ProtectedFromScaleIn: InstanceProtected;
    /**
     * The number of capacity units contributed by the instance based on its instance type. Valid Range: Minimum value of 1. Maximum value of 999.
     */
    WeightedCapacity?: XmlStringMaxLen32;
  }
  export type InstanceGeneration = "current"|"previous"|string;
  export type InstanceGenerations = InstanceGeneration[];
  export type InstanceIds = XmlStringMaxLen19[];
  export type InstanceMetadataEndpointState = "disabled"|"enabled"|string;
  export type InstanceMetadataHttpPutResponseHopLimit = number;
  export type InstanceMetadataHttpTokensState = "optional"|"required"|string;
  export interface InstanceMetadataOptions {
    /**
     * The state of token usage for your instance metadata requests. If the parameter is not specified in the request, the default state is optional. If the state is optional, you can choose to retrieve instance metadata with or without a signed token header on your request. If you retrieve the IAM role credentials without a token, the version 1.0 role credentials are returned. If you retrieve the IAM role credentials using a valid signed token, the version 2.0 role credentials are returned. If the state is required, you must send a signed token header with any instance metadata retrieval requests. In this state, retrieving the IAM role credentials always returns the version 2.0 credentials; the version 1.0 credentials are not available.
     */
    HttpTokens?: InstanceMetadataHttpTokensState;
    /**
     * The desired HTTP PUT response hop limit for instance metadata requests. The larger the number, the further instance metadata requests can travel. Default: 1
     */
    HttpPutResponseHopLimit?: InstanceMetadataHttpPutResponseHopLimit;
    /**
     * This parameter enables or disables the HTTP metadata endpoint on your instances. If the parameter is not specified, the default state is enabled.  If you specify a value of disabled, you will not be able to access your instance metadata.  
     */
    HttpEndpoint?: InstanceMetadataEndpointState;
  }
  export interface InstanceMonitoring {
    /**
     * If true, detailed monitoring is enabled. Otherwise, basic monitoring is enabled.
     */
    Enabled?: MonitoringEnabled;
  }
  export type InstanceProtected = boolean;
  export interface InstanceRefresh {
    /**
     * The instance refresh ID.
     */
    InstanceRefreshId?: XmlStringMaxLen255;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName?: XmlStringMaxLen255;
    /**
     * The current status for the instance refresh operation:    Pending - The request was created, but the instance refresh has not started.    InProgress - An instance refresh is in progress.    Successful - An instance refresh completed successfully.    Failed - An instance refresh failed to complete. You can troubleshoot using the status reason and the scaling activities.     Cancelling - An ongoing instance refresh is being cancelled.    Cancelled - The instance refresh is cancelled.     RollbackInProgress - An instance refresh is being rolled back.    RollbackFailed - The rollback failed to complete. You can troubleshoot using the status reason and the scaling activities.    RollbackSuccessful - The rollback completed successfully.  
     */
    Status?: InstanceRefreshStatus;
    /**
     * The explanation for the specific status assigned to this operation.
     */
    StatusReason?: XmlStringMaxLen1023;
    /**
     * The date and time at which the instance refresh began.
     */
    StartTime?: TimestampType;
    /**
     * The date and time at which the instance refresh ended.
     */
    EndTime?: TimestampType;
    /**
     * The percentage of the instance refresh that is complete. For each instance replacement, Amazon EC2 Auto Scaling tracks the instance's health status and warm-up time. When the instance's health status changes to healthy and the specified warm-up time passes, the instance is considered updated and is added to the percentage complete.   PercentageComplete does not include instances that are replaced during a rollback. This value gradually goes back down to zero during a rollback. 
     */
    PercentageComplete?: IntPercent;
    /**
     * The number of instances remaining to update before the instance refresh is complete.  If you roll back the instance refresh, InstancesToUpdate shows you the number of instances that were not yet updated by the instance refresh. Therefore, these instances don't need to be replaced as part of the rollback. 
     */
    InstancesToUpdate?: InstancesToUpdate;
    /**
     * Additional progress details for an Auto Scaling group that has a warm pool.
     */
    ProgressDetails?: InstanceRefreshProgressDetails;
    /**
     * The preferences for an instance refresh.
     */
    Preferences?: RefreshPreferences;
    /**
     * Describes the desired configuration for the instance refresh.
     */
    DesiredConfiguration?: DesiredConfiguration;
    /**
     * The rollback details.
     */
    RollbackDetails?: RollbackDetails;
  }
  export type InstanceRefreshIds = XmlStringMaxLen255[];
  export interface InstanceRefreshLivePoolProgress {
    /**
     * The percentage of instances in the Auto Scaling group that have been replaced. For each instance replacement, Amazon EC2 Auto Scaling tracks the instance's health status and warm-up time. When the instance's health status changes to healthy and the specified warm-up time passes, the instance is considered updated and is added to the percentage complete.
     */
    PercentageComplete?: IntPercent;
    /**
     * The number of instances remaining to update.
     */
    InstancesToUpdate?: InstancesToUpdate;
  }
  export interface InstanceRefreshProgressDetails {
    /**
     * Reports progress on replacing instances that are in the Auto Scaling group.
     */
    LivePoolProgress?: InstanceRefreshLivePoolProgress;
    /**
     * Reports progress on replacing instances that are in the warm pool.
     */
    WarmPoolProgress?: InstanceRefreshWarmPoolProgress;
  }
  export type InstanceRefreshStatus = "Pending"|"InProgress"|"Successful"|"Failed"|"Cancelling"|"Cancelled"|"RollbackInProgress"|"RollbackFailed"|"RollbackSuccessful"|string;
  export interface InstanceRefreshWarmPoolProgress {
    /**
     * The percentage of instances in the warm pool that have been replaced. For each instance replacement, Amazon EC2 Auto Scaling tracks the instance's health status and warm-up time. When the instance's health status changes to healthy and the specified warm-up time passes, the instance is considered updated and is added to the percentage complete.
     */
    PercentageComplete?: IntPercent;
    /**
     * The number of instances remaining to update.
     */
    InstancesToUpdate?: InstancesToUpdate;
  }
  export type InstanceRefreshes = InstanceRefresh[];
  export interface InstanceRequirements {
    /**
     * The minimum and maximum number of vCPUs for an instance type.
     */
    VCpuCount: VCpuCountRequest;
    /**
     * The minimum and maximum instance memory size for an instance type, in MiB.
     */
    MemoryMiB: MemoryMiBRequest;
    /**
     * Lists which specific CPU manufacturers to include.   For instance types with Intel CPUs, specify intel.   For instance types with AMD CPUs, specify amd.   For instance types with Amazon Web Services CPUs, specify amazon-web-services.    Don't confuse the CPU hardware manufacturer with the CPU hardware architecture. Instances will be launched with a compatible CPU architecture based on the Amazon Machine Image (AMI) that you specify in your launch template.   Default: Any manufacturer
     */
    CpuManufacturers?: CpuManufacturers;
    /**
     * The minimum and maximum amount of memory per vCPU for an instance type, in GiB. Default: No minimum or maximum limits
     */
    MemoryGiBPerVCpu?: MemoryGiBPerVCpuRequest;
    /**
     * The instance types to exclude. You can use strings with one or more wild cards, represented by an asterisk (*), to exclude an instance family, type, size, or generation. The following are examples: m5.8xlarge, c5*.*, m5a.*, r*, *3*.  For example, if you specify c5*, you are excluding the entire C5 instance family, which includes all C5a and C5n instance types. If you specify m5a.*, Amazon EC2 Auto Scaling will exclude all the M5a instance types, but not the M5n instance types.  If you specify ExcludedInstanceTypes, you can't specify AllowedInstanceTypes.  Default: No excluded instance types
     */
    ExcludedInstanceTypes?: ExcludedInstanceTypes;
    /**
     * Indicates whether current or previous generation instance types are included.   For current generation instance types, specify current. The current generation includes EC2 instance types currently recommended for use. This typically includes the latest two to three generations in each instance family. For more information, see Instance types in the Amazon EC2 User Guide for Linux Instances.   For previous generation instance types, specify previous.   Default: Any current or previous generation
     */
    InstanceGenerations?: InstanceGenerations;
    /**
     * The price protection threshold for Spot Instances. This is the maximum you’ll pay for a Spot Instance, expressed as a percentage higher than the least expensive current generation M, C, or R instance type with your specified attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price is higher than your threshold. The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage. To turn off price protection, specify a high value, such as 999999.  If you set DesiredCapacityType to vcpu or memory-mib, the price protection threshold is applied based on the per vCPU or per memory price instead of the per instance price.  Default: 100 
     */
    SpotMaxPricePercentageOverLowestPrice?: NullablePositiveInteger;
    /**
     * The price protection threshold for On-Demand Instances. This is the maximum you’ll pay for an On-Demand Instance, expressed as a percentage higher than the least expensive current generation M, C, or R instance type with your specified attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price is higher than your threshold. The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage. To turn off price protection, specify a high value, such as 999999.  If you set DesiredCapacityType to vcpu or memory-mib, the price protection threshold is applied based on the per vCPU or per memory price instead of the per instance price.  Default: 20 
     */
    OnDemandMaxPricePercentageOverLowestPrice?: NullablePositiveInteger;
    /**
     * Indicates whether bare metal instance types are included, excluded, or required. Default: excluded 
     */
    BareMetal?: BareMetal;
    /**
     * Indicates whether burstable performance instance types are included, excluded, or required. For more information, see Burstable performance instances in the Amazon EC2 User Guide for Linux Instances. Default: excluded 
     */
    BurstablePerformance?: BurstablePerformance;
    /**
     * Indicates whether instance types must provide On-Demand Instance hibernation support. Default: false 
     */
    RequireHibernateSupport?: NullableBoolean;
    /**
     * The minimum and maximum number of network interfaces for an instance type. Default: No minimum or maximum limits
     */
    NetworkInterfaceCount?: NetworkInterfaceCountRequest;
    /**
     * Indicates whether instance types with instance store volumes are included, excluded, or required. For more information, see Amazon EC2 instance store in the Amazon EC2 User Guide for Linux Instances. Default: included 
     */
    LocalStorage?: LocalStorage;
    /**
     * Indicates the type of local storage that is required.   For instance types with hard disk drive (HDD) storage, specify hdd.   For instance types with solid state drive (SSD) storage, specify ssd.   Default: Any local storage type
     */
    LocalStorageTypes?: LocalStorageTypes;
    /**
     * The minimum and maximum total local storage size for an instance type, in GB. Default: No minimum or maximum limits
     */
    TotalLocalStorageGB?: TotalLocalStorageGBRequest;
    /**
     * The minimum and maximum baseline bandwidth performance for an instance type, in Mbps. For more information, see Amazon EBS–optimized instances in the Amazon EC2 User Guide for Linux Instances. Default: No minimum or maximum limits
     */
    BaselineEbsBandwidthMbps?: BaselineEbsBandwidthMbpsRequest;
    /**
     * Lists the accelerator types that must be on an instance type.   For instance types with GPU accelerators, specify gpu.   For instance types with FPGA accelerators, specify fpga.   For instance types with inference accelerators, specify inference.   Default: Any accelerator type
     */
    AcceleratorTypes?: AcceleratorTypes;
    /**
     * The minimum and maximum number of accelerators (GPUs, FPGAs, or Amazon Web Services Inferentia chips) for an instance type. To exclude accelerator-enabled instance types, set Max to 0. Default: No minimum or maximum limits
     */
    AcceleratorCount?: AcceleratorCountRequest;
    /**
     * Indicates whether instance types must have accelerators by specific manufacturers.   For instance types with NVIDIA devices, specify nvidia.   For instance types with AMD devices, specify amd.   For instance types with Amazon Web Services devices, specify amazon-web-services.   For instance types with Xilinx devices, specify xilinx.   Default: Any manufacturer
     */
    AcceleratorManufacturers?: AcceleratorManufacturers;
    /**
     * Lists the accelerators that must be on an instance type.   For instance types with NVIDIA A100 GPUs, specify a100.   For instance types with NVIDIA V100 GPUs, specify v100.   For instance types with NVIDIA K80 GPUs, specify k80.   For instance types with NVIDIA T4 GPUs, specify t4.   For instance types with NVIDIA M60 GPUs, specify m60.   For instance types with AMD Radeon Pro V520 GPUs, specify radeon-pro-v520.   For instance types with Xilinx VU9P FPGAs, specify vu9p.   Default: Any accelerator
     */
    AcceleratorNames?: AcceleratorNames;
    /**
     * The minimum and maximum total memory size for the accelerators on an instance type, in MiB. Default: No minimum or maximum limits
     */
    AcceleratorTotalMemoryMiB?: AcceleratorTotalMemoryMiBRequest;
    /**
     * The minimum and maximum amount of network bandwidth, in gigabits per second (Gbps). Default: No minimum or maximum limits
     */
    NetworkBandwidthGbps?: NetworkBandwidthGbpsRequest;
    /**
     * The instance types to apply your specified attributes against. All other instance types are ignored, even if they match your specified attributes. You can use strings with one or more wild cards, represented by an asterisk (*), to allow an instance type, size, or generation. The following are examples: m5.8xlarge, c5*.*, m5a.*, r*, *3*. For example, if you specify c5*, Amazon EC2 Auto Scaling will allow the entire C5 instance family, which includes all C5a and C5n instance types. If you specify m5a.*, Amazon EC2 Auto Scaling will allow all the M5a instance types, but not the M5n instance types.  If you specify AllowedInstanceTypes, you can't specify ExcludedInstanceTypes.  Default: All instance types
     */
    AllowedInstanceTypes?: AllowedInstanceTypes;
  }
  export interface InstanceReusePolicy {
    /**
     * Specifies whether instances in the Auto Scaling group can be returned to the warm pool on scale in. 
     */
    ReuseOnScaleIn?: ReuseOnScaleIn;
  }
  export type Instances = Instance[];
  export interface InstancesDistribution {
    /**
     * The allocation strategy to apply to your On-Demand Instances when they are launched. Possible instance types are determined by the launch template overrides that you specify. The following lists the valid values:  lowest-price  Uses price to determine which instance types are the highest priority, launching the lowest priced instance types within an Availability Zone first. This is the default value for Auto Scaling groups that specify InstanceRequirements.   prioritized  You set the order of instance types for the launch template overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling launches your highest priority instance types first. If all your On-Demand capacity cannot be fulfilled using your highest priority instance type, then Amazon EC2 Auto Scaling launches the remaining capacity using the second priority instance type, and so on. This is the default value for Auto Scaling groups that don't specify InstanceRequirements and cannot be used for groups that do.  
     */
    OnDemandAllocationStrategy?: XmlString;
    /**
     * The minimum amount of the Auto Scaling group's capacity that must be fulfilled by On-Demand Instances. This base portion is launched first as your group scales. This number has the same unit of measurement as the group's desired capacity. If you change the default unit of measurement (number of instances) by specifying weighted capacity values in your launch template overrides list, or by changing the default desired capacity type setting of the group, you must specify this number using the same unit of measurement. Default: 0
     */
    OnDemandBaseCapacity?: OnDemandBaseCapacity;
    /**
     * Controls the percentages of On-Demand Instances and Spot Instances for your additional capacity beyond OnDemandBaseCapacity. Expressed as a number (for example, 20 specifies 20% On-Demand Instances, 80% Spot Instances). If set to 100, only On-Demand Instances are used. Default: 100
     */
    OnDemandPercentageAboveBaseCapacity?: OnDemandPercentageAboveBaseCapacity;
    /**
     * The allocation strategy to apply to your Spot Instances when they are launched. Possible instance types are determined by the launch template overrides that you specify. The following lists the valid values:  capacity-optimized  Requests Spot Instances using pools that are optimally chosen based on the available Spot capacity. This strategy has the lowest risk of interruption. To give certain instance types a higher chance of launching first, use capacity-optimized-prioritized.  capacity-optimized-prioritized  You set the order of instance types for the launch template overrides from highest to lowest priority (from first to last in the list). Amazon EC2 Auto Scaling honors the instance type priorities on a best effort basis but optimizes for capacity first. Note that if the On-Demand allocation strategy is set to prioritized, the same priority is applied when fulfilling On-Demand capacity. This is not a valid value for Auto Scaling groups that specify InstanceRequirements.  lowest-price  Requests Spot Instances using the lowest priced pools within an Availability Zone, across the number of Spot pools that you specify for the SpotInstancePools property. To ensure that your desired capacity is met, you might receive Spot Instances from several pools. This is the default value, but it might lead to high interruption rates because this strategy only considers instance price and not available capacity.  price-capacity-optimized (recommended)  The price and capacity optimized allocation strategy looks at both price and capacity to select the Spot Instance pools that are the least likely to be interrupted and have the lowest possible price.  
     */
    SpotAllocationStrategy?: XmlString;
    /**
     * The number of Spot Instance pools across which to allocate your Spot Instances. The Spot pools are determined from the different instance types in the overrides. Valid only when the SpotAllocationStrategy is lowest-price. Value must be in the range of 1–20. Default: 2
     */
    SpotInstancePools?: SpotInstancePools;
    /**
     * The maximum price per unit hour that you are willing to pay for a Spot Instance. If your maximum price is lower than the Spot price for the instance types that you selected, your Spot Instances are not launched. We do not recommend specifying a maximum price because it can lead to increased interruptions. When Spot Instances launch, you pay the current Spot price. To remove a maximum price that you previously set, include the property but specify an empty string ("") for the value.  If you specify a maximum price, your instances will be interrupted more frequently than if you do not specify one.  Valid Range: Minimum value of 0.001
     */
    SpotMaxPrice?: MixedInstanceSpotPrice;
  }
  export type InstancesToUpdate = number;
  export type IntPercent = number;
  export interface LaunchConfiguration {
    /**
     * The name of the launch configuration.
     */
    LaunchConfigurationName: XmlStringMaxLen255;
    /**
     * The Amazon Resource Name (ARN) of the launch configuration.
     */
    LaunchConfigurationARN?: ResourceName;
    /**
     * The ID of the Amazon Machine Image (AMI) to use to launch your EC2 instances. For more information, see Find a Linux AMI in the Amazon EC2 User Guide for Linux Instances.
     */
    ImageId: XmlStringMaxLen255;
    /**
     * The name of the key pair. For more information, see Amazon EC2 Key Pairs in the Amazon EC2 User Guide for Linux Instances.
     */
    KeyName?: XmlStringMaxLen255;
    /**
     * A list that contains the security groups to assign to the instances in the Auto Scaling group. For more information, see Security Groups for Your VPC in the Amazon Virtual Private Cloud User Guide.
     */
    SecurityGroups?: SecurityGroups;
    /**
     * Available for backward compatibility.
     */
    ClassicLinkVPCId?: XmlStringMaxLen255;
    /**
     * Available for backward compatibility.
     */
    ClassicLinkVPCSecurityGroups?: ClassicLinkVPCSecurityGroups;
    /**
     * The user data to make available to the launched EC2 instances. For more information, see Instance metadata and user data (Linux) and Instance metadata and user data (Windows). If you are using a command line tool, base64-encoding is performed for you, and you can load the text from a file. Otherwise, you must provide base64-encoded text. User data is limited to 16 KB.
     */
    UserData?: XmlStringUserData;
    /**
     * The instance type for the instances. For information about available instance types, see Available instance types in the Amazon EC2 User Guide for Linux Instances.
     */
    InstanceType: XmlStringMaxLen255;
    /**
     * The ID of the kernel associated with the AMI.
     */
    KernelId?: XmlStringMaxLen255;
    /**
     * The ID of the RAM disk associated with the AMI.
     */
    RamdiskId?: XmlStringMaxLen255;
    /**
     * The block device mapping entries that define the block devices to attach to the instances at launch. By default, the block devices specified in the block device mapping for the AMI are used. For more information, see Block Device Mapping in the Amazon EC2 User Guide for Linux Instances.
     */
    BlockDeviceMappings?: BlockDeviceMappings;
    /**
     * Controls whether instances in this group are launched with detailed (true) or basic (false) monitoring. For more information, see Configure Monitoring for Auto Scaling Instances in the Amazon EC2 Auto Scaling User Guide.
     */
    InstanceMonitoring?: InstanceMonitoring;
    /**
     * The maximum hourly price to be paid for any Spot Instance launched to fulfill the request. Spot Instances are launched when the price you specify exceeds the current Spot price. For more information, see Requesting Spot Instances in the Amazon EC2 Auto Scaling User Guide.
     */
    SpotPrice?: SpotPrice;
    /**
     * The name or the Amazon Resource Name (ARN) of the instance profile associated with the IAM role for the instance. The instance profile contains the IAM role. For more information, see IAM role for applications that run on Amazon EC2 instances in the Amazon EC2 Auto Scaling User Guide.
     */
    IamInstanceProfile?: XmlStringMaxLen1600;
    /**
     * The creation date and time for the launch configuration.
     */
    CreatedTime: TimestampType;
    /**
     * Specifies whether the launch configuration is optimized for EBS I/O (true) or not (false). For more information, see Amazon EBS-Optimized Instances in the Amazon EC2 User Guide for Linux Instances.
     */
    EbsOptimized?: EbsOptimized;
    /**
     * Specifies whether to assign a public IPv4 address to the group's instances. If the instance is launched into a default subnet, the default is to assign a public IPv4 address, unless you disabled the option to assign a public IPv4 address on the subnet. If the instance is launched into a nondefault subnet, the default is not to assign a public IPv4 address, unless you enabled the option to assign a public IPv4 address on the subnet. For more information, see Launching Auto Scaling instances in a VPC in the Amazon EC2 Auto Scaling User Guide.
     */
    AssociatePublicIpAddress?: AssociatePublicIpAddress;
    /**
     * The tenancy of the instance, either default or dedicated. An instance with dedicated tenancy runs on isolated, single-tenant hardware and can only be launched into a VPC. For more information, see Configuring instance tenancy with Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
     */
    PlacementTenancy?: XmlStringMaxLen64;
    /**
     * The metadata options for the instances. For more information, see Configuring the Instance Metadata Options in the Amazon EC2 Auto Scaling User Guide.
     */
    MetadataOptions?: InstanceMetadataOptions;
  }
  export interface LaunchConfigurationNameType {
    /**
     * The name of the launch configuration.
     */
    LaunchConfigurationName: XmlStringMaxLen255;
  }
  export type LaunchConfigurationNames = XmlStringMaxLen255[];
  export interface LaunchConfigurationNamesType {
    /**
     * The launch configuration names. If you omit this property, all launch configurations are described. Array Members: Maximum number of 50 items.
     */
    LaunchConfigurationNames?: LaunchConfigurationNames;
    /**
     * The token for the next set of items to return. (You received this token from a previous call.)
     */
    NextToken?: XmlString;
    /**
     * The maximum number of items to return with this call. The default value is 50 and the maximum value is 100.
     */
    MaxRecords?: MaxRecords;
  }
  export type LaunchConfigurations = LaunchConfiguration[];
  export interface LaunchConfigurationsType {
    /**
     * The launch configurations.
     */
    LaunchConfigurations: LaunchConfigurations;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface LaunchTemplate {
    /**
     * The launch template.
     */
    LaunchTemplateSpecification?: LaunchTemplateSpecification;
    /**
     * Any properties that you specify override the same properties in the launch template.
     */
    Overrides?: Overrides;
  }
  export type LaunchTemplateName = string;
  export interface LaunchTemplateOverrides {
    /**
     * The instance type, such as m3.xlarge. You must specify an instance type that is supported in your requested Region and Availability Zones. For more information, see Instance types in the Amazon Elastic Compute Cloud User Guide. You can specify up to 40 instance types per Auto Scaling group.
     */
    InstanceType?: XmlStringMaxLen255;
    /**
     * If you provide a list of instance types to use, you can specify the number of capacity units provided by each instance type in terms of virtual CPUs, memory, storage, throughput, or other relative performance characteristic. When a Spot or On-Demand Instance is launched, the capacity units count toward the desired capacity. Amazon EC2 Auto Scaling launches instances until the desired capacity is totally fulfilled, even if this results in an overage. For example, if there are two units remaining to fulfill capacity, and Amazon EC2 Auto Scaling can only launch an instance with a WeightedCapacity of five units, the instance is launched, and the desired capacity is exceeded by three units. For more information, see Configuring instance weighting for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. Value must be in the range of 1–999. If you specify a value for WeightedCapacity for one instance type, you must specify a value for WeightedCapacity for all of them.  Every Auto Scaling group has three size parameters (DesiredCapacity, MaxSize, and MinSize). Usually, you set these sizes based on a specific number of instances. However, if you configure a mixed instances policy that defines weights for the instance types, you must specify these sizes with the same units that you use for weighting instances.  
     */
    WeightedCapacity?: XmlStringMaxLen32;
    /**
     * Provides a launch template for the specified instance type or set of instance requirements. For example, some instance types might require a launch template with a different AMI. If not provided, Amazon EC2 Auto Scaling uses the launch template that's specified in the LaunchTemplate definition. For more information, see Specifying a different launch template for an instance type in the Amazon EC2 Auto Scaling User Guide.  You can specify up to 20 launch templates per Auto Scaling group. The launch templates specified in the overrides and in the LaunchTemplate definition count towards this limit.
     */
    LaunchTemplateSpecification?: LaunchTemplateSpecification;
    /**
     * The instance requirements. Amazon EC2 Auto Scaling uses your specified requirements to identify instance types. Then, it uses your On-Demand and Spot allocation strategies to launch instances from these instance types. You can specify up to four separate sets of instance requirements per Auto Scaling group. This is useful for provisioning instances from different Amazon Machine Images (AMIs) in the same Auto Scaling group. To do this, create the AMIs and create a new launch template for each AMI. Then, create a compatible set of instance requirements for each launch template.   If you specify InstanceRequirements, you can't specify InstanceType. 
     */
    InstanceRequirements?: InstanceRequirements;
  }
  export interface LaunchTemplateSpecification {
    /**
     * The ID of the launch template. To get the template ID, use the Amazon EC2 DescribeLaunchTemplates API operation. New launch templates can be created using the Amazon EC2 CreateLaunchTemplate API.  Conditional: You must specify either a LaunchTemplateId or a LaunchTemplateName.
     */
    LaunchTemplateId?: XmlStringMaxLen255;
    /**
     * The name of the launch template. To get the template name, use the Amazon EC2 DescribeLaunchTemplates API operation. New launch templates can be created using the Amazon EC2 CreateLaunchTemplate API.  Conditional: You must specify either a LaunchTemplateId or a LaunchTemplateName.
     */
    LaunchTemplateName?: LaunchTemplateName;
    /**
     * The version number, $Latest, or $Default. To get the version number, use the Amazon EC2 DescribeLaunchTemplateVersions API operation. New launch template versions can be created using the Amazon EC2 CreateLaunchTemplateVersion API. If the value is $Latest, Amazon EC2 Auto Scaling selects the latest version of the launch template when launching instances. If the value is $Default, Amazon EC2 Auto Scaling selects the default version of the launch template when launching instances. The default value is $Default.
     */
    Version?: XmlStringMaxLen255;
  }
  export type LifecycleActionResult = string;
  export type LifecycleActionToken = string;
  export interface LifecycleHook {
    /**
     * The name of the lifecycle hook.
     */
    LifecycleHookName?: AsciiStringMaxLen255;
    /**
     * The name of the Auto Scaling group for the lifecycle hook.
     */
    AutoScalingGroupName?: XmlStringMaxLen255;
    /**
     * The lifecycle transition. Valid values: autoscaling:EC2_INSTANCE_LAUNCHING | autoscaling:EC2_INSTANCE_TERMINATING 
     */
    LifecycleTransition?: LifecycleTransition;
    /**
     * The ARN of the target that Amazon EC2 Auto Scaling sends notifications to when an instance is in a wait state for the lifecycle hook.
     */
    NotificationTargetARN?: NotificationTargetResourceName;
    /**
     * The ARN of the IAM role that allows the Auto Scaling group to publish to the specified notification target (an Amazon SNS topic or an Amazon SQS queue).
     */
    RoleARN?: XmlStringMaxLen255;
    /**
     * Additional information that is included any time Amazon EC2 Auto Scaling sends a message to the notification target.
     */
    NotificationMetadata?: AnyPrintableAsciiStringMaxLen4000;
    /**
     * The maximum time, in seconds, that can elapse before the lifecycle hook times out. If the lifecycle hook times out, Amazon EC2 Auto Scaling performs the action that you specified in the DefaultResult property.
     */
    HeartbeatTimeout?: HeartbeatTimeout;
    /**
     * The maximum time, in seconds, that an instance can remain in a wait state. The maximum is 172800 seconds (48 hours) or 100 times HeartbeatTimeout, whichever is smaller.
     */
    GlobalTimeout?: GlobalTimeout;
    /**
     * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs. Valid values: CONTINUE | ABANDON 
     */
    DefaultResult?: LifecycleActionResult;
  }
  export type LifecycleHookNames = AsciiStringMaxLen255[];
  export interface LifecycleHookSpecification {
    /**
     * The name of the lifecycle hook.
     */
    LifecycleHookName: AsciiStringMaxLen255;
    /**
     * The lifecycle transition. For Auto Scaling groups, there are two major lifecycle transitions.   To create a lifecycle hook for scale-out events, specify autoscaling:EC2_INSTANCE_LAUNCHING.   To create a lifecycle hook for scale-in events, specify autoscaling:EC2_INSTANCE_TERMINATING.  
     */
    LifecycleTransition: LifecycleTransition;
    /**
     * Additional information that you want to include any time Amazon EC2 Auto Scaling sends a message to the notification target.
     */
    NotificationMetadata?: AnyPrintableAsciiStringMaxLen4000;
    /**
     * The maximum time, in seconds, that can elapse before the lifecycle hook times out. The range is from 30 to 7200 seconds. The default value is 3600 seconds (1 hour).
     */
    HeartbeatTimeout?: HeartbeatTimeout;
    /**
     * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs. The default value is ABANDON. Valid values: CONTINUE | ABANDON 
     */
    DefaultResult?: LifecycleActionResult;
    /**
     * The Amazon Resource Name (ARN) of the notification target that Amazon EC2 Auto Scaling sends notifications to when an instance is in a wait state for the lifecycle hook. You can specify an Amazon SNS topic or an Amazon SQS queue.
     */
    NotificationTargetARN?: NotificationTargetResourceName;
    /**
     * The ARN of the IAM role that allows the Auto Scaling group to publish to the specified notification target. For information about creating this role, see Configure a notification target for a lifecycle hook in the Amazon EC2 Auto Scaling User Guide. Valid only if the notification target is an Amazon SNS topic or an Amazon SQS queue.
     */
    RoleARN?: XmlStringMaxLen255;
  }
  export type LifecycleHookSpecifications = LifecycleHookSpecification[];
  export type LifecycleHooks = LifecycleHook[];
  export type LifecycleState = "Pending"|"Pending:Wait"|"Pending:Proceed"|"Quarantined"|"InService"|"Terminating"|"Terminating:Wait"|"Terminating:Proceed"|"Terminated"|"Detaching"|"Detached"|"EnteringStandby"|"Standby"|"Warmed:Pending"|"Warmed:Pending:Wait"|"Warmed:Pending:Proceed"|"Warmed:Terminating"|"Warmed:Terminating:Wait"|"Warmed:Terminating:Proceed"|"Warmed:Terminated"|"Warmed:Stopped"|"Warmed:Running"|"Warmed:Hibernated"|string;
  export type LifecycleTransition = string;
  export type LoadBalancerNames = XmlStringMaxLen255[];
  export interface LoadBalancerState {
    /**
     * The name of the load balancer.
     */
    LoadBalancerName?: XmlStringMaxLen255;
    /**
     * One of the following load balancer states:    Adding - The Auto Scaling instances are being registered with the load balancer.    Added - All Auto Scaling instances are registered with the load balancer.    InService - At least one Auto Scaling instance passed an ELB health check.    Removing - The Auto Scaling instances are being deregistered from the load balancer. If connection draining is enabled, Elastic Load Balancing waits for in-flight requests to complete before deregistering the instances.    Removed - All Auto Scaling instances are deregistered from the load balancer.  
     */
    State?: XmlStringMaxLen255;
  }
  export type LoadBalancerStates = LoadBalancerState[];
  export interface LoadBalancerTargetGroupState {
    /**
     * The Amazon Resource Name (ARN) of the target group.
     */
    LoadBalancerTargetGroupARN?: XmlStringMaxLen511;
    /**
     * The state of the target group.    Adding - The Auto Scaling instances are being registered with the target group.    Added - All Auto Scaling instances are registered with the target group.    InService - At least one Auto Scaling instance passed an ELB health check.    Removing - The Auto Scaling instances are being deregistered from the target group. If connection draining is enabled, Elastic Load Balancing waits for in-flight requests to complete before deregistering the instances.    Removed - All Auto Scaling instances are deregistered from the target group.  
     */
    State?: XmlStringMaxLen255;
  }
  export type LoadBalancerTargetGroupStates = LoadBalancerTargetGroupState[];
  export interface LoadForecast {
    /**
     * The timestamps for the data points, in UTC format.
     */
    Timestamps: PredictiveScalingForecastTimestamps;
    /**
     * The values of the data points.
     */
    Values: PredictiveScalingForecastValues;
    /**
     * The metric specification for the load forecast.
     */
    MetricSpecification: PredictiveScalingMetricSpecification;
  }
  export type LoadForecasts = LoadForecast[];
  export type LocalStorage = "included"|"excluded"|"required"|string;
  export type LocalStorageType = "hdd"|"ssd"|string;
  export type LocalStorageTypes = LocalStorageType[];
  export type MaxGroupPreparedCapacity = number;
  export type MaxInstanceLifetime = number;
  export type MaxNumberOfAutoScalingGroups = number;
  export type MaxNumberOfLaunchConfigurations = number;
  export type MaxRecords = number;
  export interface MemoryGiBPerVCpuRequest {
    /**
     * The memory minimum in GiB.
     */
    Min?: NullablePositiveDouble;
    /**
     * The memory maximum in GiB.
     */
    Max?: NullablePositiveDouble;
  }
  export interface MemoryMiBRequest {
    /**
     * The memory minimum in MiB.
     */
    Min: NullablePositiveInteger;
    /**
     * The memory maximum in MiB.
     */
    Max?: NullablePositiveInteger;
  }
  export interface Metric {
    /**
     * The namespace of the metric. For more information, see the table in Amazon Web Services services that publish CloudWatch metrics  in the Amazon CloudWatch User Guide.
     */
    Namespace: MetricNamespace;
    /**
     * The name of the metric.
     */
    MetricName: MetricName;
    /**
     * The dimensions for the metric. For the list of available dimensions, see the Amazon Web Services documentation available from the table in Amazon Web Services services that publish CloudWatch metrics  in the Amazon CloudWatch User Guide.  Conditional: If you published your metric with dimensions, you must specify the same dimensions in your scaling policy.
     */
    Dimensions?: MetricDimensions;
  }
  export interface MetricCollectionType {
    /**
     * One of the following metrics:    GroupMinSize     GroupMaxSize     GroupDesiredCapacity     GroupInServiceInstances     GroupPendingInstances     GroupStandbyInstances     GroupTerminatingInstances     GroupTotalInstances     GroupInServiceCapacity     GroupPendingCapacity     GroupStandbyCapacity     GroupTerminatingCapacity     GroupTotalCapacity     WarmPoolDesiredCapacity     WarmPoolWarmedCapacity     WarmPoolPendingCapacity     WarmPoolTerminatingCapacity     WarmPoolTotalCapacity     GroupAndWarmPoolDesiredCapacity     GroupAndWarmPoolTotalCapacity   
     */
    Metric?: XmlStringMaxLen255;
  }
  export type MetricCollectionTypes = MetricCollectionType[];
  export type MetricDataQueries = MetricDataQuery[];
  export interface MetricDataQuery {
    /**
     * A short name that identifies the object's results in the response. This name must be unique among all MetricDataQuery objects specified for a single scaling policy. If you are performing math expressions on this set of data, this name represents that data and can serve as a variable in the mathematical expression. The valid characters are letters, numbers, and underscores. The first character must be a lowercase letter. 
     */
    Id: XmlStringMaxLen255;
    /**
     * The math expression to perform on the returned data, if this object is performing a math expression. This expression can use the Id of the other metrics to refer to those metrics, and can also use the Id of other expressions to use the result of those expressions.  Conditional: Within each MetricDataQuery object, you must specify either Expression or MetricStat, but not both.
     */
    Expression?: XmlStringMaxLen1023;
    /**
     * Information about the metric data to return. Conditional: Within each MetricDataQuery object, you must specify either Expression or MetricStat, but not both.
     */
    MetricStat?: MetricStat;
    /**
     * A human-readable label for this metric or expression. This is especially useful if this is a math expression, so that you know what the value represents.
     */
    Label?: XmlStringMetricLabel;
    /**
     * Indicates whether to return the timestamps and raw data values of this metric.  If you use any math expressions, specify true for this value for only the final math expression that the metric specification is based on. You must specify false for ReturnData for all the other metrics and expressions used in the metric specification. If you are only retrieving metrics and not performing any math expressions, do not specify anything for ReturnData. This sets it to its default (true).
     */
    ReturnData?: ReturnData;
  }
  export interface MetricDimension {
    /**
     * The name of the dimension.
     */
    Name: MetricDimensionName;
    /**
     * The value of the dimension.
     */
    Value: MetricDimensionValue;
  }
  export type MetricDimensionName = string;
  export type MetricDimensionValue = string;
  export type MetricDimensions = MetricDimension[];
  export interface MetricGranularityType {
    /**
     * The granularity. The only valid value is 1Minute.
     */
    Granularity?: XmlStringMaxLen255;
  }
  export type MetricGranularityTypes = MetricGranularityType[];
  export type MetricName = string;
  export type MetricNamespace = string;
  export type MetricScale = number;
  export interface MetricStat {
    /**
     * The CloudWatch metric to return, including the metric name, namespace, and dimensions. To get the exact metric name, namespace, and dimensions, inspect the Metric object that is returned by a call to ListMetrics.
     */
    Metric: Metric;
    /**
     * The statistic to return. It can include any CloudWatch statistic or extended statistic. For a list of valid values, see the table in Statistics in the Amazon CloudWatch User Guide. The most commonly used metrics for predictive scaling are Average and Sum.
     */
    Stat: XmlStringMetricStat;
    /**
     * The unit to use for the returned data points. For a complete list of the units that CloudWatch supports, see the MetricDatum data type in the Amazon CloudWatch API Reference.
     */
    Unit?: MetricUnit;
  }
  export type MetricStatistic = "Average"|"Minimum"|"Maximum"|"SampleCount"|"Sum"|string;
  export type MetricType = "ASGAverageCPUUtilization"|"ASGAverageNetworkIn"|"ASGAverageNetworkOut"|"ALBRequestCountPerTarget"|string;
  export type MetricUnit = string;
  export type Metrics = XmlStringMaxLen255[];
  export type MinAdjustmentMagnitude = number;
  export type MinAdjustmentStep = number;
  export type MixedInstanceSpotPrice = string;
  export interface MixedInstancesPolicy {
    /**
     * One or more launch templates and the instance types (overrides) that are used to launch EC2 instances to fulfill On-Demand and Spot capacities.
     */
    LaunchTemplate?: LaunchTemplate;
    /**
     * The instances distribution.
     */
    InstancesDistribution?: InstancesDistribution;
  }
  export type MonitoringEnabled = boolean;
  export interface NetworkBandwidthGbpsRequest {
    /**
     * The minimum amount of network bandwidth, in gigabits per second (Gbps).
     */
    Min?: NullablePositiveDouble;
    /**
     * The maximum amount of network bandwidth, in gigabits per second (Gbps).
     */
    Max?: NullablePositiveDouble;
  }
  export interface NetworkInterfaceCountRequest {
    /**
     * The minimum number of network interfaces.
     */
    Min?: NullablePositiveInteger;
    /**
     * The maximum number of network interfaces.
     */
    Max?: NullablePositiveInteger;
  }
  export type NoDevice = boolean;
  export type NonZeroIntPercent = number;
  export interface NotificationConfiguration {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName?: XmlStringMaxLen255;
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic.
     */
    TopicARN?: XmlStringMaxLen255;
    /**
     * One of the following event notification types:    autoscaling:EC2_INSTANCE_LAUNCH     autoscaling:EC2_INSTANCE_LAUNCH_ERROR     autoscaling:EC2_INSTANCE_TERMINATE     autoscaling:EC2_INSTANCE_TERMINATE_ERROR     autoscaling:TEST_NOTIFICATION   
     */
    NotificationType?: XmlStringMaxLen255;
  }
  export type NotificationConfigurations = NotificationConfiguration[];
  export type NotificationTargetResourceName = string;
  export type NullableBoolean = boolean;
  export type NullablePositiveDouble = number;
  export type NullablePositiveInteger = number;
  export type NumberOfAutoScalingGroups = number;
  export type NumberOfLaunchConfigurations = number;
  export type OnDemandBaseCapacity = number;
  export type OnDemandPercentageAboveBaseCapacity = number;
  export type Overrides = LaunchTemplateOverrides[];
  export interface PoliciesType {
    /**
     * The scaling policies.
     */
    ScalingPolicies?: ScalingPolicies;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface PolicyARNType {
    /**
     * The Amazon Resource Name (ARN) of the policy.
     */
    PolicyARN?: ResourceName;
    /**
     * The CloudWatch alarms created for the target tracking scaling policy.
     */
    Alarms?: Alarms;
  }
  export type PolicyIncrement = number;
  export type PolicyNames = ResourceName[];
  export type PolicyTypes = XmlStringMaxLen64[];
  export type PredefinedLoadMetricType = "ASGTotalCPUUtilization"|"ASGTotalNetworkIn"|"ASGTotalNetworkOut"|"ALBTargetGroupRequestCount"|string;
  export type PredefinedMetricPairType = "ASGCPUUtilization"|"ASGNetworkIn"|"ASGNetworkOut"|"ALBRequestCount"|string;
  export interface PredefinedMetricSpecification {
    /**
     * The metric type. The following predefined metrics are available:    ASGAverageCPUUtilization - Average CPU utilization of the Auto Scaling group.    ASGAverageNetworkIn - Average number of bytes received on all network interfaces by the Auto Scaling group.    ASGAverageNetworkOut - Average number of bytes sent out on all network interfaces by the Auto Scaling group.    ALBRequestCountPerTarget - Average Application Load Balancer request count per target for your Auto Scaling group.  
     */
    PredefinedMetricType: MetricType;
    /**
     * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the average request count served by your Auto Scaling group. You can't specify a resource label unless the target group is attached to the Auto Scaling group. You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format of the resource label is:  app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff. Where:   app/&lt;load-balancer-name&gt;/&lt;load-balancer-id&gt; is the final portion of the load balancer ARN   targetgroup/&lt;target-group-name&gt;/&lt;target-group-id&gt; is the final portion of the target group ARN.   To find the ARN for an Application Load Balancer, use the DescribeLoadBalancers API operation. To find the ARN for the target group, use the DescribeTargetGroups API operation.
     */
    ResourceLabel?: XmlStringMaxLen1023;
  }
  export type PredefinedScalingMetricType = "ASGAverageCPUUtilization"|"ASGAverageNetworkIn"|"ASGAverageNetworkOut"|"ALBRequestCountPerTarget"|string;
  export interface PredictiveScalingConfiguration {
    /**
     * This structure includes the metrics and target utilization to use for predictive scaling.  This is an array, but we currently only support a single metric specification. That is, you can specify a target value and a single metric pair, or a target value and one scaling metric and one load metric.
     */
    MetricSpecifications: PredictiveScalingMetricSpecifications;
    /**
     * The predictive scaling mode. Defaults to ForecastOnly if not specified.
     */
    Mode?: PredictiveScalingMode;
    /**
     * The amount of time, in seconds, by which the instance launch time can be advanced. For example, the forecast says to add capacity at 10:00 AM, and you choose to pre-launch instances by 5 minutes. In that case, the instances will be launched at 9:55 AM. The intention is to give resources time to be provisioned. It can take a few minutes to launch an EC2 instance. The actual amount of time required depends on several factors, such as the size of the instance and whether there are startup scripts to complete.  The value must be less than the forecast interval duration of 3600 seconds (60 minutes). Defaults to 300 seconds if not specified. 
     */
    SchedulingBufferTime?: PredictiveScalingSchedulingBufferTime;
    /**
     * Defines the behavior that should be applied if the forecast capacity approaches or exceeds the maximum capacity of the Auto Scaling group. Defaults to HonorMaxCapacity if not specified. The following are possible values:    HonorMaxCapacity - Amazon EC2 Auto Scaling cannot scale out capacity higher than the maximum capacity. The maximum capacity is enforced as a hard limit.     IncreaseMaxCapacity - Amazon EC2 Auto Scaling can scale out capacity higher than the maximum capacity when the forecast capacity is close to or exceeds the maximum capacity. The upper limit is determined by the forecasted capacity and the value for MaxCapacityBuffer.  
     */
    MaxCapacityBreachBehavior?: PredictiveScalingMaxCapacityBreachBehavior;
    /**
     * The size of the capacity buffer to use when the forecast capacity is close to or exceeds the maximum capacity. The value is specified as a percentage relative to the forecast capacity. For example, if the buffer is 10, this means a 10 percent buffer, such that if the forecast capacity is 50, and the maximum capacity is 40, then the effective maximum capacity is 55. If set to 0, Amazon EC2 Auto Scaling may scale capacity higher than the maximum capacity to equal but not exceed forecast capacity.  Required if the MaxCapacityBreachBehavior property is set to IncreaseMaxCapacity, and cannot be used otherwise.
     */
    MaxCapacityBuffer?: PredictiveScalingMaxCapacityBuffer;
  }
  export interface PredictiveScalingCustomizedCapacityMetric {
    /**
     * One or more metric data queries to provide the data points for a capacity metric. Use multiple metric data queries only if you are performing a math expression on returned data. 
     */
    MetricDataQueries: MetricDataQueries;
  }
  export interface PredictiveScalingCustomizedLoadMetric {
    /**
     * One or more metric data queries to provide the data points for a load metric. Use multiple metric data queries only if you are performing a math expression on returned data. 
     */
    MetricDataQueries: MetricDataQueries;
  }
  export interface PredictiveScalingCustomizedScalingMetric {
    /**
     * One or more metric data queries to provide the data points for a scaling metric. Use multiple metric data queries only if you are performing a math expression on returned data. 
     */
    MetricDataQueries: MetricDataQueries;
  }
  export type PredictiveScalingForecastTimestamps = TimestampType[];
  export type PredictiveScalingForecastValues = MetricScale[];
  export type PredictiveScalingMaxCapacityBreachBehavior = "HonorMaxCapacity"|"IncreaseMaxCapacity"|string;
  export type PredictiveScalingMaxCapacityBuffer = number;
  export interface PredictiveScalingMetricSpecification {
    /**
     * Specifies the target utilization.  Some metrics are based on a count instead of a percentage, such as the request count for an Application Load Balancer or the number of messages in an SQS queue. If the scaling policy specifies one of these metrics, specify the target utilization as the optimal average request or message count per instance during any one-minute interval.  
     */
    TargetValue: MetricScale;
    /**
     * The predefined metric pair specification from which Amazon EC2 Auto Scaling determines the appropriate scaling metric and load metric to use.
     */
    PredefinedMetricPairSpecification?: PredictiveScalingPredefinedMetricPair;
    /**
     * The predefined scaling metric specification.
     */
    PredefinedScalingMetricSpecification?: PredictiveScalingPredefinedScalingMetric;
    /**
     * The predefined load metric specification.
     */
    PredefinedLoadMetricSpecification?: PredictiveScalingPredefinedLoadMetric;
    /**
     * The customized scaling metric specification.
     */
    CustomizedScalingMetricSpecification?: PredictiveScalingCustomizedScalingMetric;
    /**
     * The customized load metric specification.
     */
    CustomizedLoadMetricSpecification?: PredictiveScalingCustomizedLoadMetric;
    /**
     * The customized capacity metric specification.
     */
    CustomizedCapacityMetricSpecification?: PredictiveScalingCustomizedCapacityMetric;
  }
  export type PredictiveScalingMetricSpecifications = PredictiveScalingMetricSpecification[];
  export type PredictiveScalingMode = "ForecastAndScale"|"ForecastOnly"|string;
  export interface PredictiveScalingPredefinedLoadMetric {
    /**
     * The metric type.
     */
    PredefinedMetricType: PredefinedLoadMetricType;
    /**
     * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the request count served by your Auto Scaling group. You can't specify a resource label unless the target group is attached to the Auto Scaling group. You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format of the resource label is:  app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff. Where:   app/&lt;load-balancer-name&gt;/&lt;load-balancer-id&gt; is the final portion of the load balancer ARN   targetgroup/&lt;target-group-name&gt;/&lt;target-group-id&gt; is the final portion of the target group ARN.   To find the ARN for an Application Load Balancer, use the DescribeLoadBalancers API operation. To find the ARN for the target group, use the DescribeTargetGroups API operation.
     */
    ResourceLabel?: XmlStringMaxLen1023;
  }
  export interface PredictiveScalingPredefinedMetricPair {
    /**
     * Indicates which metrics to use. There are two different types of metrics for each metric type: one is a load metric and one is a scaling metric. For example, if the metric type is ASGCPUUtilization, the Auto Scaling group's total CPU metric is used as the load metric, and the average CPU metric is used for the scaling metric.
     */
    PredefinedMetricType: PredefinedMetricPairType;
    /**
     * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the total and average request count served by your Auto Scaling group. You can't specify a resource label unless the target group is attached to the Auto Scaling group. You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format of the resource label is:  app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff. Where:   app/&lt;load-balancer-name&gt;/&lt;load-balancer-id&gt; is the final portion of the load balancer ARN   targetgroup/&lt;target-group-name&gt;/&lt;target-group-id&gt; is the final portion of the target group ARN.   To find the ARN for an Application Load Balancer, use the DescribeLoadBalancers API operation. To find the ARN for the target group, use the DescribeTargetGroups API operation.
     */
    ResourceLabel?: XmlStringMaxLen1023;
  }
  export interface PredictiveScalingPredefinedScalingMetric {
    /**
     * The metric type.
     */
    PredefinedMetricType: PredefinedScalingMetricType;
    /**
     * A label that uniquely identifies a specific Application Load Balancer target group from which to determine the average request count served by your Auto Scaling group. You can't specify a resource label unless the target group is attached to the Auto Scaling group. You create the resource label by appending the final portion of the load balancer ARN and the final portion of the target group ARN into a single value, separated by a forward slash (/). The format of the resource label is:  app/my-alb/778d41231b141a0f/targetgroup/my-alb-target-group/943f017f100becff. Where:   app/&lt;load-balancer-name&gt;/&lt;load-balancer-id&gt; is the final portion of the load balancer ARN   targetgroup/&lt;target-group-name&gt;/&lt;target-group-id&gt; is the final portion of the target group ARN.   To find the ARN for an Application Load Balancer, use the DescribeLoadBalancers API operation. To find the ARN for the target group, use the DescribeTargetGroups API operation.
     */
    ResourceLabel?: XmlStringMaxLen1023;
  }
  export type PredictiveScalingSchedulingBufferTime = number;
  export type ProcessNames = XmlStringMaxLen255[];
  export interface ProcessType {
    /**
     * One of the following processes:    Launch     Terminate     AddToLoadBalancer     AlarmNotification     AZRebalance     HealthCheck     InstanceRefresh     ReplaceUnhealthy     ScheduledActions   
     */
    ProcessName: XmlStringMaxLen255;
  }
  export type Processes = ProcessType[];
  export interface ProcessesType {
    /**
     * The names of the process types.
     */
    Processes?: Processes;
  }
  export type Progress = number;
  export type PropagateAtLaunch = boolean;
  export type ProtectedFromScaleIn = boolean;
  export interface PutLifecycleHookAnswer {
  }
  export interface PutLifecycleHookType {
    /**
     * The name of the lifecycle hook.
     */
    LifecycleHookName: AsciiStringMaxLen255;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The lifecycle transition. For Auto Scaling groups, there are two major lifecycle transitions.   To create a lifecycle hook for scale-out events, specify autoscaling:EC2_INSTANCE_LAUNCHING.   To create a lifecycle hook for scale-in events, specify autoscaling:EC2_INSTANCE_TERMINATING.   Required for new lifecycle hooks, but optional when updating existing hooks.
     */
    LifecycleTransition?: LifecycleTransition;
    /**
     * The ARN of the IAM role that allows the Auto Scaling group to publish to the specified notification target. Valid only if the notification target is an Amazon SNS topic or an Amazon SQS queue. Required for new lifecycle hooks, but optional when updating existing hooks.
     */
    RoleARN?: XmlStringMaxLen255;
    /**
     * The Amazon Resource Name (ARN) of the notification target that Amazon EC2 Auto Scaling uses to notify you when an instance is in a wait state for the lifecycle hook. You can specify either an Amazon SNS topic or an Amazon SQS queue. If you specify an empty string, this overrides the current ARN. This operation uses the JSON format when sending notifications to an Amazon SQS queue, and an email key-value pair format when sending notifications to an Amazon SNS topic. When you specify a notification target, Amazon EC2 Auto Scaling sends it a test message. Test messages contain the following additional key-value pair: "Event": "autoscaling:TEST_NOTIFICATION".
     */
    NotificationTargetARN?: NotificationTargetResourceName;
    /**
     * Additional information that you want to include any time Amazon EC2 Auto Scaling sends a message to the notification target.
     */
    NotificationMetadata?: AnyPrintableAsciiStringMaxLen4000;
    /**
     * The maximum time, in seconds, that can elapse before the lifecycle hook times out. The range is from 30 to 7200 seconds. The default value is 3600 seconds (1 hour).
     */
    HeartbeatTimeout?: HeartbeatTimeout;
    /**
     * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs. The default value is ABANDON. Valid values: CONTINUE | ABANDON 
     */
    DefaultResult?: LifecycleActionResult;
  }
  export interface PutNotificationConfigurationType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic.
     */
    TopicARN: XmlStringMaxLen255;
    /**
     * The type of event that causes the notification to be sent. To query the notification types supported by Amazon EC2 Auto Scaling, call the DescribeAutoScalingNotificationTypes API.
     */
    NotificationTypes: AutoScalingNotificationTypes;
  }
  export interface PutScalingPolicyType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The name of the policy.
     */
    PolicyName: XmlStringMaxLen255;
    /**
     * One of the following policy types:     TargetTrackingScaling     StepScaling     SimpleScaling (default)    PredictiveScaling   
     */
    PolicyType?: XmlStringMaxLen64;
    /**
     * Specifies how the scaling adjustment is interpreted (for example, an absolute number or a percentage). The valid values are ChangeInCapacity, ExactCapacity, and PercentChangeInCapacity. Required if the policy type is StepScaling or SimpleScaling. For more information, see Scaling adjustment types in the Amazon EC2 Auto Scaling User Guide.
     */
    AdjustmentType?: XmlStringMaxLen255;
    /**
     * Available for backward compatibility. Use MinAdjustmentMagnitude instead.
     */
    MinAdjustmentStep?: MinAdjustmentStep;
    /**
     * The minimum value to scale by when the adjustment type is PercentChangeInCapacity. For example, suppose that you create a step scaling policy to scale out an Auto Scaling group by 25 percent and you specify a MinAdjustmentMagnitude of 2. If the group has 4 instances and the scaling policy is performed, 25 percent of 4 is 1. However, because you specified a MinAdjustmentMagnitude of 2, Amazon EC2 Auto Scaling scales out the group by 2 instances. Valid only if the policy type is StepScaling or SimpleScaling. For more information, see Scaling adjustment types in the Amazon EC2 Auto Scaling User Guide.  Some Auto Scaling groups use instance weights. In this case, set the MinAdjustmentMagnitude to a value that is at least as large as your largest instance weight. 
     */
    MinAdjustmentMagnitude?: MinAdjustmentMagnitude;
    /**
     * The amount by which to scale, based on the specified adjustment type. A positive value adds to the current capacity while a negative number removes from the current capacity. For exact capacity, you must specify a non-negative value. Required if the policy type is SimpleScaling. (Not used with any other policy type.) 
     */
    ScalingAdjustment?: PolicyIncrement;
    /**
     * A cooldown period, in seconds, that applies to a specific simple scaling policy. When a cooldown period is specified here, it overrides the default cooldown. Valid only if the policy type is SimpleScaling. For more information, see Scaling cooldowns for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide. Default: None
     */
    Cooldown?: Cooldown;
    /**
     * The aggregation type for the CloudWatch metrics. The valid values are Minimum, Maximum, and Average. If the aggregation type is null, the value is treated as Average. Valid only if the policy type is StepScaling.
     */
    MetricAggregationType?: XmlStringMaxLen32;
    /**
     * A set of adjustments that enable you to scale based on the size of the alarm breach. Required if the policy type is StepScaling. (Not used with any other policy type.) 
     */
    StepAdjustments?: StepAdjustments;
    /**
     *  Not needed if the default instance warmup is defined for the group.  The estimated time, in seconds, until a newly launched instance can contribute to the CloudWatch metrics. This warm-up period applies to instances launched due to a specific target tracking or step scaling policy. When a warm-up period is specified here, it overrides the default instance warmup. Valid only if the policy type is TargetTrackingScaling or StepScaling.  The default is to use the value for the default instance warmup defined for the group. If default instance warmup is null, then EstimatedInstanceWarmup falls back to the value of default cooldown. 
     */
    EstimatedInstanceWarmup?: EstimatedInstanceWarmup;
    /**
     * A target tracking scaling policy. Provides support for predefined or custom metrics. The following predefined metrics are available:    ASGAverageCPUUtilization     ASGAverageNetworkIn     ASGAverageNetworkOut     ALBRequestCountPerTarget    If you specify ALBRequestCountPerTarget for the metric, you must specify the ResourceLabel property with the PredefinedMetricSpecification. For more information, see TargetTrackingConfiguration in the Amazon EC2 Auto Scaling API Reference. Required if the policy type is TargetTrackingScaling.
     */
    TargetTrackingConfiguration?: TargetTrackingConfiguration;
    /**
     * Indicates whether the scaling policy is enabled or disabled. The default is enabled. For more information, see Disabling a scaling policy for an Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
     */
    Enabled?: ScalingPolicyEnabled;
    /**
     * A predictive scaling policy. Provides support for predefined and custom metrics. Predefined metrics include CPU utilization, network in/out, and the Application Load Balancer request count. For more information, see PredictiveScalingConfiguration in the Amazon EC2 Auto Scaling API Reference. Required if the policy type is PredictiveScaling.
     */
    PredictiveScalingConfiguration?: PredictiveScalingConfiguration;
  }
  export interface PutScheduledUpdateGroupActionType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The name of this scaling action.
     */
    ScheduledActionName: XmlStringMaxLen255;
    /**
     * This property is no longer used.
     */
    Time?: TimestampType;
    /**
     * The date and time for this action to start, in YYYY-MM-DDThh:mm:ssZ format in UTC/GMT only and in quotes (for example, "2021-06-01T00:00:00Z"). If you specify Recurrence and StartTime, Amazon EC2 Auto Scaling performs the action at this time, and then performs the action based on the specified recurrence.
     */
    StartTime?: TimestampType;
    /**
     * The date and time for the recurring schedule to end, in UTC. For example, "2021-06-01T00:00:00Z".
     */
    EndTime?: TimestampType;
    /**
     * The recurring schedule for this action. This format consists of five fields separated by white spaces: [Minute] [Hour] [Day_of_Month] [Month_of_Year] [Day_of_Week]. The value must be in quotes (for example, "30 0 1 1,6,12 *"). For more information about this format, see Crontab. When StartTime and EndTime are specified with Recurrence, they form the boundaries of when the recurring action starts and stops. Cron expressions use Universal Coordinated Time (UTC) by default.
     */
    Recurrence?: XmlStringMaxLen255;
    /**
     * The minimum size of the Auto Scaling group.
     */
    MinSize?: AutoScalingGroupMinSize;
    /**
     * The maximum size of the Auto Scaling group.
     */
    MaxSize?: AutoScalingGroupMaxSize;
    /**
     * The desired capacity is the initial capacity of the Auto Scaling group after the scheduled action runs and the capacity it attempts to maintain. It can scale beyond this capacity if you add more scaling conditions.   You must specify at least one of the following properties: MaxSize, MinSize, or DesiredCapacity.  
     */
    DesiredCapacity?: AutoScalingGroupDesiredCapacity;
    /**
     * Specifies the time zone for a cron expression. If a time zone is not provided, UTC is used by default.  Valid values are the canonical names of the IANA time zones, derived from the IANA Time Zone Database (such as Etc/GMT+9 or Pacific/Tahiti). For more information, see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
     */
    TimeZone?: XmlStringMaxLen255;
  }
  export interface PutWarmPoolAnswer {
  }
  export interface PutWarmPoolType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * Specifies the maximum number of instances that are allowed to be in the warm pool or in any state except Terminated for the Auto Scaling group. This is an optional property. Specify it only if you do not want the warm pool size to be determined by the difference between the group's maximum capacity and its desired capacity.   If a value for MaxGroupPreparedCapacity is not specified, Amazon EC2 Auto Scaling launches and maintains the difference between the group's maximum capacity and its desired capacity. If you specify a value for MaxGroupPreparedCapacity, Amazon EC2 Auto Scaling uses the difference between the MaxGroupPreparedCapacity and the desired capacity instead.  The size of the warm pool is dynamic. Only when MaxGroupPreparedCapacity and MinSize are set to the same value does the warm pool have an absolute size.  If the desired capacity of the Auto Scaling group is higher than the MaxGroupPreparedCapacity, the capacity of the warm pool is 0, unless you specify a value for MinSize. To remove a value that you previously set, include the property but specify -1 for the value. 
     */
    MaxGroupPreparedCapacity?: MaxGroupPreparedCapacity;
    /**
     * Specifies the minimum number of instances to maintain in the warm pool. This helps you to ensure that there is always a certain number of warmed instances available to handle traffic spikes. Defaults to 0 if not specified.
     */
    MinSize?: WarmPoolMinSize;
    /**
     * Sets the instance state to transition to after the lifecycle actions are complete. Default is Stopped.
     */
    PoolState?: WarmPoolState;
    /**
     * Indicates whether instances in the Auto Scaling group can be returned to the warm pool on scale in. The default is to terminate instances in the Auto Scaling group when the group scales in.
     */
    InstanceReusePolicy?: InstanceReusePolicy;
  }
  export interface RecordLifecycleActionHeartbeatAnswer {
  }
  export interface RecordLifecycleActionHeartbeatType {
    /**
     * The name of the lifecycle hook.
     */
    LifecycleHookName: AsciiStringMaxLen255;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: ResourceName;
    /**
     * A token that uniquely identifies a specific lifecycle action associated with an instance. Amazon EC2 Auto Scaling sends this token to the notification target that you specified when you created the lifecycle hook.
     */
    LifecycleActionToken?: LifecycleActionToken;
    /**
     * The ID of the instance.
     */
    InstanceId?: XmlStringMaxLen19;
  }
  export type RefreshInstanceWarmup = number;
  export interface RefreshPreferences {
    /**
     * The amount of capacity in the Auto Scaling group that must pass your group's health checks to allow the operation to continue. The value is expressed as a percentage of the desired capacity of the Auto Scaling group (rounded up to the nearest integer). The default is 90. Setting the minimum healthy percentage to 100 percent limits the rate of replacement to one instance at a time. In contrast, setting it to 0 percent has the effect of replacing all instances at the same time. 
     */
    MinHealthyPercentage?: IntPercent;
    /**
     * A time period, in seconds, during which an instance refresh waits before moving on to replacing the next instance after a new instance enters the InService state. This property is not required for normal usage. Instead, use the DefaultInstanceWarmup property of the Auto Scaling group. The InstanceWarmup and DefaultInstanceWarmup properties work the same way. Only specify this property if you must override the DefaultInstanceWarmup property.   If you do not specify this property, the instance warmup by default is the value of the DefaultInstanceWarmup property, if defined (which is recommended in all cases), or the HealthCheckGracePeriod property otherwise.
     */
    InstanceWarmup?: RefreshInstanceWarmup;
    /**
     * (Optional) Threshold values for each checkpoint in ascending order. Each number must be unique. To replace all instances in the Auto Scaling group, the last number in the array must be 100. For usage examples, see Adding checkpoints to an instance refresh in the Amazon EC2 Auto Scaling User Guide.
     */
    CheckpointPercentages?: CheckpointPercentages;
    /**
     * (Optional) The amount of time, in seconds, to wait after a checkpoint before continuing. This property is optional, but if you specify a value for it, you must also specify a value for CheckpointPercentages. If you specify a value for CheckpointPercentages and not for CheckpointDelay, the CheckpointDelay defaults to 3600 (1 hour). 
     */
    CheckpointDelay?: CheckpointDelay;
    /**
     * (Optional) Indicates whether skip matching is enabled. If enabled (true), then Amazon EC2 Auto Scaling skips replacing instances that match the desired configuration. If no desired configuration is specified, then it skips replacing instances that have the same launch template and instance types that the Auto Scaling group was using before the start of the instance refresh. The default is false. For more information, see Use an instance refresh with skip matching in the Amazon EC2 Auto Scaling User Guide.
     */
    SkipMatching?: SkipMatching;
    /**
     * (Optional) Indicates whether to roll back the Auto Scaling group to its previous configuration if the instance refresh fails or a CloudWatch alarm threshold is met. The default is false. A rollback is not supported in the following situations:    There is no desired configuration specified for the instance refresh.   The Auto Scaling group has a launch template that uses an Amazon Web Services Systems Manager parameter instead of an AMI ID for the ImageId property.   The Auto Scaling group uses the launch template's $Latest or $Default version.   For more information, see Undo changes with a rollback in the Amazon EC2 Auto Scaling User Guide.
     */
    AutoRollback?: AutoRollback;
    /**
     * Choose the behavior that you want Amazon EC2 Auto Scaling to use if instances protected from scale in are found.  The following lists the valid values:  Refresh  Amazon EC2 Auto Scaling replaces instances that are protected from scale in.  Ignore  Amazon EC2 Auto Scaling ignores instances that are protected from scale in and continues to replace instances that are not protected.  Wait (default)  Amazon EC2 Auto Scaling waits one hour for you to remove scale-in protection. Otherwise, the instance refresh will fail.  
     */
    ScaleInProtectedInstances?: ScaleInProtectedInstances;
    /**
     * Choose the behavior that you want Amazon EC2 Auto Scaling to use if instances in Standby state are found. The following lists the valid values:  Terminate  Amazon EC2 Auto Scaling terminates instances that are in Standby.  Ignore  Amazon EC2 Auto Scaling ignores instances that are in Standby and continues to replace instances that are in the InService state.  Wait (default)  Amazon EC2 Auto Scaling waits one hour for you to return the instances to service. Otherwise, the instance refresh will fail.  
     */
    StandbyInstances?: StandbyInstances;
    /**
     * (Optional) The CloudWatch alarm specification. CloudWatch alarms can be used to identify any issues and fail the operation if an alarm threshold is met.
     */
    AlarmSpecification?: AlarmSpecification;
  }
  export type RefreshStrategy = "Rolling"|string;
  export type ResourceName = string;
  export type ReturnData = boolean;
  export type ReuseOnScaleIn = boolean;
  export interface RollbackDetails {
    /**
     * The reason for this instance refresh rollback (for example, whether a manual or automatic rollback was initiated).
     */
    RollbackReason?: XmlStringMaxLen1023;
    /**
     * The date and time at which the rollback began.
     */
    RollbackStartTime?: TimestampType;
    /**
     * Indicates the value of PercentageComplete at the time the rollback started.
     */
    PercentageCompleteOnRollback?: IntPercent;
    /**
     * Indicates the value of InstancesToUpdate at the time the rollback started.
     */
    InstancesToUpdateOnRollback?: InstancesToUpdate;
    /**
     * Reports progress on replacing instances in an Auto Scaling group that has a warm pool. This includes separate details for instances in the warm pool and instances in the Auto Scaling group (the live pool).
     */
    ProgressDetailsOnRollback?: InstanceRefreshProgressDetails;
  }
  export interface RollbackInstanceRefreshAnswer {
    /**
     * The instance refresh ID associated with the request. This is the unique ID assigned to the instance refresh when it was started.
     */
    InstanceRefreshId?: XmlStringMaxLen255;
  }
  export interface RollbackInstanceRefreshType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
  }
  export type ScaleInProtectedInstances = "Refresh"|"Ignore"|"Wait"|string;
  export type ScalingActivityStatusCode = "PendingSpotBidPlacement"|"WaitingForSpotInstanceRequestId"|"WaitingForSpotInstanceId"|"WaitingForInstanceId"|"PreInService"|"InProgress"|"WaitingForELBConnectionDraining"|"MidLifecycleAction"|"WaitingForInstanceWarmup"|"Successful"|"Failed"|"Cancelled"|"WaitingForConnectionDraining"|string;
  export type ScalingPolicies = ScalingPolicy[];
  export interface ScalingPolicy {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName?: XmlStringMaxLen255;
    /**
     * The name of the scaling policy.
     */
    PolicyName?: XmlStringMaxLen255;
    /**
     * The Amazon Resource Name (ARN) of the policy.
     */
    PolicyARN?: ResourceName;
    /**
     * One of the following policy types:     TargetTrackingScaling     StepScaling     SimpleScaling (default)    PredictiveScaling    For more information, see Target tracking scaling policies and Step and simple scaling policies in the Amazon EC2 Auto Scaling User Guide.
     */
    PolicyType?: XmlStringMaxLen64;
    /**
     * Specifies how the scaling adjustment is interpreted (for example, an absolute number or a percentage). The valid values are ChangeInCapacity, ExactCapacity, and PercentChangeInCapacity.
     */
    AdjustmentType?: XmlStringMaxLen255;
    /**
     * Available for backward compatibility. Use MinAdjustmentMagnitude instead.
     */
    MinAdjustmentStep?: MinAdjustmentStep;
    /**
     * The minimum value to scale by when the adjustment type is PercentChangeInCapacity. 
     */
    MinAdjustmentMagnitude?: MinAdjustmentMagnitude;
    /**
     * The amount by which to scale, based on the specified adjustment type. A positive value adds to the current capacity while a negative number removes from the current capacity.
     */
    ScalingAdjustment?: PolicyIncrement;
    /**
     * The duration of the policy's cooldown period, in seconds.
     */
    Cooldown?: Cooldown;
    /**
     * A set of adjustments that enable you to scale based on the size of the alarm breach.
     */
    StepAdjustments?: StepAdjustments;
    /**
     * The aggregation type for the CloudWatch metrics. The valid values are Minimum, Maximum, and Average.
     */
    MetricAggregationType?: XmlStringMaxLen32;
    /**
     * The estimated time, in seconds, until a newly launched instance can contribute to the CloudWatch metrics.
     */
    EstimatedInstanceWarmup?: EstimatedInstanceWarmup;
    /**
     * The CloudWatch alarms related to the policy.
     */
    Alarms?: Alarms;
    /**
     * A target tracking scaling policy.
     */
    TargetTrackingConfiguration?: TargetTrackingConfiguration;
    /**
     * Indicates whether the policy is enabled (true) or disabled (false).
     */
    Enabled?: ScalingPolicyEnabled;
    /**
     * A predictive scaling policy.
     */
    PredictiveScalingConfiguration?: PredictiveScalingConfiguration;
  }
  export type ScalingPolicyEnabled = boolean;
  export interface ScalingProcessQuery {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * One or more of the following processes:    Launch     Terminate     AddToLoadBalancer     AlarmNotification     AZRebalance     HealthCheck     InstanceRefresh     ReplaceUnhealthy     ScheduledActions    If you omit this property, all processes are specified.
     */
    ScalingProcesses?: ProcessNames;
  }
  export type ScheduledActionNames = XmlStringMaxLen255[];
  export interface ScheduledActionsType {
    /**
     * The scheduled actions.
     */
    ScheduledUpdateGroupActions?: ScheduledUpdateGroupActions;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export interface ScheduledUpdateGroupAction {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName?: XmlStringMaxLen255;
    /**
     * The name of the scheduled action.
     */
    ScheduledActionName?: XmlStringMaxLen255;
    /**
     * The Amazon Resource Name (ARN) of the scheduled action.
     */
    ScheduledActionARN?: ResourceName;
    /**
     * This property is no longer used.
     */
    Time?: TimestampType;
    /**
     * The date and time in UTC for this action to start. For example, "2019-06-01T00:00:00Z". 
     */
    StartTime?: TimestampType;
    /**
     * The date and time in UTC for the recurring schedule to end. For example, "2019-06-01T00:00:00Z". 
     */
    EndTime?: TimestampType;
    /**
     * The recurring schedule for the action, in Unix cron syntax format. When StartTime and EndTime are specified with Recurrence, they form the boundaries of when the recurring action starts and stops.
     */
    Recurrence?: XmlStringMaxLen255;
    /**
     * The minimum size of the Auto Scaling group.
     */
    MinSize?: AutoScalingGroupMinSize;
    /**
     * The maximum size of the Auto Scaling group.
     */
    MaxSize?: AutoScalingGroupMaxSize;
    /**
     * The desired capacity is the initial capacity of the Auto Scaling group after the scheduled action runs and the capacity it attempts to maintain.
     */
    DesiredCapacity?: AutoScalingGroupDesiredCapacity;
    /**
     * The time zone for the cron expression.
     */
    TimeZone?: XmlStringMaxLen255;
  }
  export interface ScheduledUpdateGroupActionRequest {
    /**
     * The name of the scaling action.
     */
    ScheduledActionName: XmlStringMaxLen255;
    /**
     * The date and time for the action to start, in YYYY-MM-DDThh:mm:ssZ format in UTC/GMT only and in quotes (for example, "2019-06-01T00:00:00Z"). If you specify Recurrence and StartTime, Amazon EC2 Auto Scaling performs the action at this time, and then performs the action based on the specified recurrence. If you try to schedule the action in the past, Amazon EC2 Auto Scaling returns an error message.
     */
    StartTime?: TimestampType;
    /**
     * The date and time for the recurring schedule to end, in UTC.
     */
    EndTime?: TimestampType;
    /**
     * The recurring schedule for the action, in Unix cron syntax format. This format consists of five fields separated by white spaces: [Minute] [Hour] [Day_of_Month] [Month_of_Year] [Day_of_Week]. The value must be in quotes (for example, "30 0 1 1,6,12 *"). For more information about this format, see Crontab. When StartTime and EndTime are specified with Recurrence, they form the boundaries of when the recurring action starts and stops. Cron expressions use Universal Coordinated Time (UTC) by default.
     */
    Recurrence?: XmlStringMaxLen255;
    /**
     * The minimum size of the Auto Scaling group.
     */
    MinSize?: AutoScalingGroupMinSize;
    /**
     * The maximum size of the Auto Scaling group.
     */
    MaxSize?: AutoScalingGroupMaxSize;
    /**
     * The desired capacity is the initial capacity of the Auto Scaling group after the scheduled action runs and the capacity it attempts to maintain.
     */
    DesiredCapacity?: AutoScalingGroupDesiredCapacity;
    /**
     * Specifies the time zone for a cron expression. If a time zone is not provided, UTC is used by default.  Valid values are the canonical names of the IANA time zones, derived from the IANA Time Zone Database (such as Etc/GMT+9 or Pacific/Tahiti). For more information, see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
     */
    TimeZone?: XmlStringMaxLen255;
  }
  export type ScheduledUpdateGroupActionRequests = ScheduledUpdateGroupActionRequest[];
  export type ScheduledUpdateGroupActions = ScheduledUpdateGroupAction[];
  export type SecurityGroups = XmlString[];
  export interface SetDesiredCapacityType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The desired capacity is the initial capacity of the Auto Scaling group after this operation completes and the capacity it attempts to maintain.
     */
    DesiredCapacity: AutoScalingGroupDesiredCapacity;
    /**
     * Indicates whether Amazon EC2 Auto Scaling waits for the cooldown period to complete before initiating a scaling activity to set your Auto Scaling group to its new capacity. By default, Amazon EC2 Auto Scaling does not honor the cooldown period during manual scaling activities.
     */
    HonorCooldown?: HonorCooldown;
  }
  export interface SetInstanceHealthQuery {
    /**
     * The ID of the instance.
     */
    InstanceId: XmlStringMaxLen19;
    /**
     * The health status of the instance. Set to Healthy to have the instance remain in service. Set to Unhealthy to have the instance be out of service. Amazon EC2 Auto Scaling terminates and replaces the unhealthy instance.
     */
    HealthStatus: XmlStringMaxLen32;
    /**
     * If the Auto Scaling group of the specified instance has a HealthCheckGracePeriod specified for the group, by default, this call respects the grace period. Set this to False, to have the call not respect the grace period associated with the group. For more information about the health check grace period, see CreateAutoScalingGroup in the Amazon EC2 Auto Scaling API Reference.
     */
    ShouldRespectGracePeriod?: ShouldRespectGracePeriod;
  }
  export interface SetInstanceProtectionAnswer {
  }
  export interface SetInstanceProtectionQuery {
    /**
     * One or more instance IDs. You can specify up to 50 instances.
     */
    InstanceIds: InstanceIds;
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * Indicates whether the instance is protected from termination by Amazon EC2 Auto Scaling when scaling in.
     */
    ProtectedFromScaleIn: ProtectedFromScaleIn;
  }
  export type ShouldDecrementDesiredCapacity = boolean;
  export type ShouldRespectGracePeriod = boolean;
  export type SkipMatching = boolean;
  export type SpotInstancePools = number;
  export type SpotPrice = string;
  export type StandbyInstances = "Terminate"|"Ignore"|"Wait"|string;
  export interface StartInstanceRefreshAnswer {
    /**
     * A unique ID for tracking the progress of the instance refresh.
     */
    InstanceRefreshId?: XmlStringMaxLen255;
  }
  export interface StartInstanceRefreshType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The strategy to use for the instance refresh. The only valid value is Rolling.
     */
    Strategy?: RefreshStrategy;
    /**
     * The desired configuration. For example, the desired configuration can specify a new launch template or a new version of the current launch template. Once the instance refresh succeeds, Amazon EC2 Auto Scaling updates the settings of the Auto Scaling group to reflect the new desired configuration.   When you specify a new launch template or a new version of the current launch template for your desired configuration, consider enabling the SkipMatching property in preferences. If it's enabled, Amazon EC2 Auto Scaling skips replacing instances that already use the specified launch template and instance types. This can help you reduce the number of replacements that are required to apply updates.  
     */
    DesiredConfiguration?: DesiredConfiguration;
    /**
     * Sets your preferences for the instance refresh so that it performs as expected when you start it. Includes the instance warmup time, the minimum healthy percentage, and the behaviors that you want Amazon EC2 Auto Scaling to use if instances that are in Standby state or protected from scale in are found. You can also choose to enable additional features, such as the following:   Auto rollback   Checkpoints   CloudWatch alarms   Skip matching  
     */
    Preferences?: RefreshPreferences;
  }
  export interface StepAdjustment {
    /**
     * The lower bound for the difference between the alarm threshold and the CloudWatch metric. If the metric value is above the breach threshold, the lower bound is inclusive (the metric must be greater than or equal to the threshold plus the lower bound). Otherwise, it is exclusive (the metric must be greater than the threshold plus the lower bound). A null value indicates negative infinity.
     */
    MetricIntervalLowerBound?: MetricScale;
    /**
     * The upper bound for the difference between the alarm threshold and the CloudWatch metric. If the metric value is above the breach threshold, the upper bound is exclusive (the metric must be less than the threshold plus the upper bound). Otherwise, it is inclusive (the metric must be less than or equal to the threshold plus the upper bound). A null value indicates positive infinity. The upper bound must be greater than the lower bound.
     */
    MetricIntervalUpperBound?: MetricScale;
    /**
     * The amount by which to scale, based on the specified adjustment type. A positive value adds to the current capacity while a negative number removes from the current capacity. For exact capacity, you must specify a non-negative value.
     */
    ScalingAdjustment: PolicyIncrement;
  }
  export type StepAdjustments = StepAdjustment[];
  export interface SuspendedProcess {
    /**
     * The name of the suspended process.
     */
    ProcessName?: XmlStringMaxLen255;
    /**
     * The reason that the process was suspended.
     */
    SuspensionReason?: XmlStringMaxLen255;
  }
  export type SuspendedProcesses = SuspendedProcess[];
  export interface Tag {
    /**
     * The name of the Auto Scaling group.
     */
    ResourceId?: XmlString;
    /**
     * The type of resource. The only supported value is auto-scaling-group.
     */
    ResourceType?: XmlString;
    /**
     * The tag key.
     */
    Key: TagKey;
    /**
     * The tag value.
     */
    Value?: TagValue;
    /**
     * Determines whether the tag is added to new instances as they are launched in the group.
     */
    PropagateAtLaunch?: PropagateAtLaunch;
  }
  export interface TagDescription {
    /**
     * The name of the group.
     */
    ResourceId?: XmlString;
    /**
     * The type of resource. The only supported value is auto-scaling-group.
     */
    ResourceType?: XmlString;
    /**
     * The tag key.
     */
    Key?: TagKey;
    /**
     * The tag value.
     */
    Value?: TagValue;
    /**
     * Determines whether the tag is added to new instances as they are launched in the group.
     */
    PropagateAtLaunch?: PropagateAtLaunch;
  }
  export type TagDescriptionList = TagDescription[];
  export type TagKey = string;
  export type TagValue = string;
  export type Tags = Tag[];
  export interface TagsType {
    /**
     * One or more tags.
     */
    Tags?: TagDescriptionList;
    /**
     * A string that indicates that the response contains more items than can be returned in a single response. To receive additional items, specify this string for the NextToken value when requesting the next set of items. This value is null when there are no more items to return.
     */
    NextToken?: XmlString;
  }
  export type TargetGroupARNs = XmlStringMaxLen511[];
  export interface TargetTrackingConfiguration {
    /**
     * A predefined metric. You must specify either a predefined metric or a customized metric.
     */
    PredefinedMetricSpecification?: PredefinedMetricSpecification;
    /**
     * A customized metric. You must specify either a predefined metric or a customized metric.
     */
    CustomizedMetricSpecification?: CustomizedMetricSpecification;
    /**
     * The target value for the metric.  Some metrics are based on a count instead of a percentage, such as the request count for an Application Load Balancer or the number of messages in an SQS queue. If the scaling policy specifies one of these metrics, specify the target utilization as the optimal average request or message count per instance during any one-minute interval.  
     */
    TargetValue: MetricScale;
    /**
     * Indicates whether scaling in by the target tracking scaling policy is disabled. If scaling in is disabled, the target tracking scaling policy doesn't remove instances from the Auto Scaling group. Otherwise, the target tracking scaling policy can remove instances from the Auto Scaling group. The default is false.
     */
    DisableScaleIn?: DisableScaleIn;
  }
  export type TargetTrackingMetricDataQueries = TargetTrackingMetricDataQuery[];
  export interface TargetTrackingMetricDataQuery {
    /**
     * A short name that identifies the object's results in the response. This name must be unique among all TargetTrackingMetricDataQuery objects specified for a single scaling policy. If you are performing math expressions on this set of data, this name represents that data and can serve as a variable in the mathematical expression. The valid characters are letters, numbers, and underscores. The first character must be a lowercase letter. 
     */
    Id: XmlStringMaxLen255;
    /**
     * The math expression to perform on the returned data, if this object is performing a math expression. This expression can use the Id of the other metrics to refer to those metrics, and can also use the Id of other expressions to use the result of those expressions.  Conditional: Within each TargetTrackingMetricDataQuery object, you must specify either Expression or MetricStat, but not both.
     */
    Expression?: XmlStringMaxLen2047;
    /**
     * Information about the metric data to return. Conditional: Within each TargetTrackingMetricDataQuery object, you must specify either Expression or MetricStat, but not both.
     */
    MetricStat?: TargetTrackingMetricStat;
    /**
     * A human-readable label for this metric or expression. This is especially useful if this is a math expression, so that you know what the value represents.
     */
    Label?: XmlStringMetricLabel;
    /**
     * Indicates whether to return the timestamps and raw data values of this metric.  If you use any math expressions, specify true for this value for only the final math expression that the metric specification is based on. You must specify false for ReturnData for all the other metrics and expressions used in the metric specification. If you are only retrieving metrics and not performing any math expressions, do not specify anything for ReturnData. This sets it to its default (true).
     */
    ReturnData?: ReturnData;
  }
  export interface TargetTrackingMetricStat {
    /**
     * The metric to use.
     */
    Metric: Metric;
    /**
     * The statistic to return. It can include any CloudWatch statistic or extended statistic. For a list of valid values, see the table in Statistics in the Amazon CloudWatch User Guide. The most commonly used metric for scaling is Average.
     */
    Stat: XmlStringMetricStat;
    /**
     * The unit to use for the returned data points. For a complete list of the units that CloudWatch supports, see the MetricDatum data type in the Amazon CloudWatch API Reference.
     */
    Unit?: MetricUnit;
  }
  export interface TerminateInstanceInAutoScalingGroupType {
    /**
     * The ID of the instance.
     */
    InstanceId: XmlStringMaxLen19;
    /**
     * Indicates whether terminating the instance also decrements the size of the Auto Scaling group.
     */
    ShouldDecrementDesiredCapacity: ShouldDecrementDesiredCapacity;
  }
  export type TerminationPolicies = XmlStringMaxLen1600[];
  export type TimestampType = Date;
  export interface TotalLocalStorageGBRequest {
    /**
     * The storage minimum in GB.
     */
    Min?: NullablePositiveDouble;
    /**
     * The storage maximum in GB.
     */
    Max?: NullablePositiveDouble;
  }
  export interface TrafficSourceIdentifier {
    /**
     * Identifies the traffic source. For Application Load Balancers, Gateway Load Balancers, Network Load Balancers, and VPC Lattice, this will be the Amazon Resource Name (ARN) for a target group in this account and Region. For Classic Load Balancers, this will be the name of the Classic Load Balancer in this account and Region. For example:    Application Load Balancer ARN: arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/1234567890123456    Classic Load Balancer name: my-classic-load-balancer    VPC Lattice ARN: arn:aws:vpc-lattice:us-west-2:123456789012:targetgroup/tg-1234567890123456    To get the ARN of a target group for a Application Load Balancer, Gateway Load Balancer, or Network Load Balancer, or the name of a Classic Load Balancer, use the Elastic Load Balancing DescribeTargetGroups and DescribeLoadBalancers API operations. To get the ARN of a target group for VPC Lattice, use the VPC Lattice GetTargetGroup API operation.
     */
    Identifier: XmlStringMaxLen511;
    /**
     * Provides additional context for the value of Identifier. The following lists the valid values:    elb if Identifier is the name of a Classic Load Balancer.    elbv2 if Identifier is the ARN of an Application Load Balancer, Gateway Load Balancer, or Network Load Balancer target group.    vpc-lattice if Identifier is the ARN of a VPC Lattice target group.   Required if the identifier is the name of a Classic Load Balancer.
     */
    Type?: XmlStringMaxLen511;
  }
  export interface TrafficSourceState {
    /**
     * This is replaced by Identifier.
     */
    TrafficSource?: XmlStringMaxLen511;
    /**
     * Describes the current state of a traffic source. The state values are as follows:    Adding - The Auto Scaling instances are being registered with the load balancer or target group.    Added - All Auto Scaling instances are registered with the load balancer or target group.    InService - For an Elastic Load Balancing load balancer or target group, at least one Auto Scaling instance passed an ELB health check. For VPC Lattice, at least one Auto Scaling instance passed an VPC_LATTICE health check.    Removing - The Auto Scaling instances are being deregistered from the load balancer or target group. If connection draining (deregistration delay) is enabled, Elastic Load Balancing or VPC Lattice waits for in-flight requests to complete before deregistering the instances.    Removed - All Auto Scaling instances are deregistered from the load balancer or target group.  
     */
    State?: XmlStringMaxLen255;
    /**
     * The unique identifier of the traffic source.
     */
    Identifier?: XmlStringMaxLen511;
    /**
     * Provides additional context for the value of Identifier. The following lists the valid values:    elb if Identifier is the name of a Classic Load Balancer.    elbv2 if Identifier is the ARN of an Application Load Balancer, Gateway Load Balancer, or Network Load Balancer target group.    vpc-lattice if Identifier is the ARN of a VPC Lattice target group.   Required if the identifier is the name of a Classic Load Balancer.
     */
    Type?: XmlStringMaxLen511;
  }
  export type TrafficSourceStates = TrafficSourceState[];
  export type TrafficSources = TrafficSourceIdentifier[];
  export interface UpdateAutoScalingGroupType {
    /**
     * The name of the Auto Scaling group.
     */
    AutoScalingGroupName: XmlStringMaxLen255;
    /**
     * The name of the launch configuration. If you specify LaunchConfigurationName in your update request, you can't specify LaunchTemplate or MixedInstancesPolicy.
     */
    LaunchConfigurationName?: XmlStringMaxLen255;
    /**
     * The launch template and version to use to specify the updates. If you specify LaunchTemplate in your update request, you can't specify LaunchConfigurationName or MixedInstancesPolicy.
     */
    LaunchTemplate?: LaunchTemplateSpecification;
    /**
     * The mixed instances policy. For more information, see Auto Scaling groups with multiple instance types and purchase options in the Amazon EC2 Auto Scaling User Guide.
     */
    MixedInstancesPolicy?: MixedInstancesPolicy;
    /**
     * The minimum size of the Auto Scaling group.
     */
    MinSize?: AutoScalingGroupMinSize;
    /**
     * The maximum size of the Auto Scaling group.  With a mixed instances policy that uses instance weighting, Amazon EC2 Auto Scaling may need to go above MaxSize to meet your capacity requirements. In this event, Amazon EC2 Auto Scaling will never go above MaxSize by more than your largest instance weight (weights that define how many units each instance contributes to the desired capacity of the group). 
     */
    MaxSize?: AutoScalingGroupMaxSize;
    /**
     * The desired capacity is the initial capacity of the Auto Scaling group after this operation completes and the capacity it attempts to maintain. This number must be greater than or equal to the minimum size of the group and less than or equal to the maximum size of the group.
     */
    DesiredCapacity?: AutoScalingGroupDesiredCapacity;
    /**
     *  Only needed if you use simple scaling policies.  The amount of time, in seconds, between one scaling activity ending and another one starting due to simple scaling policies. For more information, see Scaling cooldowns for Amazon EC2 Auto Scaling in the Amazon EC2 Auto Scaling User Guide.
     */
    DefaultCooldown?: Cooldown;
    /**
     * One or more Availability Zones for the group.
     */
    AvailabilityZones?: AvailabilityZones;
    /**
     * A comma-separated value string of one or more health check types. The valid values are EC2, ELB, and VPC_LATTICE. EC2 is the default health check and cannot be disabled. For more information, see Health checks for Auto Scaling instances in the Amazon EC2 Auto Scaling User Guide. Only specify EC2 if you must clear a value that was previously set.
     */
    HealthCheckType?: XmlStringMaxLen32;
    /**
     * The amount of time, in seconds, that Amazon EC2 Auto Scaling waits before checking the health status of an EC2 instance that has come into service and marking it unhealthy due to a failed health check. This is useful if your instances do not immediately pass their health checks after they enter the InService state. For more information, see Set the health check grace period for an Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.
     */
    HealthCheckGracePeriod?: HealthCheckGracePeriod;
    /**
     * The name of an existing placement group into which to launch your instances. For more information, see Placement groups in the Amazon EC2 User Guide for Linux Instances.  A cluster placement group is a logical grouping of instances within a single Availability Zone. You cannot specify multiple Availability Zones and a cluster placement group.  
     */
    PlacementGroup?: XmlStringMaxLen255;
    /**
     * A comma-separated list of subnet IDs for a virtual private cloud (VPC). If you specify VPCZoneIdentifier with AvailabilityZones, the subnets that you specify must reside in those Availability Zones.
     */
    VPCZoneIdentifier?: XmlStringMaxLen2047;
    /**
     * A policy or a list of policies that are used to select the instances to terminate. The policies are executed in the order that you list them. For more information, see Work with Amazon EC2 Auto Scaling termination policies in the Amazon EC2 Auto Scaling User Guide. Valid values: Default | AllocationStrategy | ClosestToNextInstanceHour | NewestInstance | OldestInstance | OldestLaunchConfiguration | OldestLaunchTemplate | arn:aws:lambda:region:account-id:function:my-function:my-alias 
     */
    TerminationPolicies?: TerminationPolicies;
    /**
     * Indicates whether newly launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in. For more information about preventing instances from terminating on scale in, see Using instance scale-in protection in the Amazon EC2 Auto Scaling User Guide.
     */
    NewInstancesProtectedFromScaleIn?: InstanceProtected;
    /**
     * The Amazon Resource Name (ARN) of the service-linked role that the Auto Scaling group uses to call other Amazon Web Services on your behalf. For more information, see Service-linked roles in the Amazon EC2 Auto Scaling User Guide.
     */
    ServiceLinkedRoleARN?: ResourceName;
    /**
     * The maximum amount of time, in seconds, that an instance can be in service. The default is null. If specified, the value must be either 0 or a number equal to or greater than 86,400 seconds (1 day). To clear a previously set value, specify a new value of 0. For more information, see Replacing Auto Scaling instances based on maximum instance lifetime in the Amazon EC2 Auto Scaling User Guide.
     */
    MaxInstanceLifetime?: MaxInstanceLifetime;
    /**
     * Enables or disables Capacity Rebalancing. For more information, see Use Capacity Rebalancing to handle Amazon EC2 Spot Interruptions in the Amazon EC2 Auto Scaling User Guide.
     */
    CapacityRebalance?: CapacityRebalanceEnabled;
    /**
     * Reserved.
     */
    Context?: Context;
    /**
     * The unit of measurement for the value specified for desired capacity. Amazon EC2 Auto Scaling supports DesiredCapacityType for attribute-based instance type selection only. For more information, see Creating an Auto Scaling group using attribute-based instance type selection in the Amazon EC2 Auto Scaling User Guide. By default, Amazon EC2 Auto Scaling specifies units, which translates into number of instances. Valid values: units | vcpu | memory-mib 
     */
    DesiredCapacityType?: XmlStringMaxLen255;
    /**
     * The amount of time, in seconds, until a new instance is considered to have finished initializing and resource consumption to become stable after it enters the InService state.  During an instance refresh, Amazon EC2 Auto Scaling waits for the warm-up period after it replaces an instance before it moves on to replacing the next instance. Amazon EC2 Auto Scaling also waits for the warm-up period before aggregating the metrics for new instances with existing instances in the Amazon CloudWatch metrics that are used for scaling, resulting in more reliable usage data. For more information, see Set the default instance warmup for an Auto Scaling group in the Amazon EC2 Auto Scaling User Guide.  To manage various warm-up settings at the group level, we recommend that you set the default instance warmup, even if it is set to 0 seconds. To remove a value that you previously set, include the property but specify -1 for the value. However, we strongly recommend keeping the default instance warmup enabled by specifying a value of 0 or other nominal value. 
     */
    DefaultInstanceWarmup?: DefaultInstanceWarmup;
  }
  export interface VCpuCountRequest {
    /**
     * The minimum number of vCPUs.
     */
    Min: NullablePositiveInteger;
    /**
     * The maximum number of vCPUs.
     */
    Max?: NullablePositiveInteger;
  }
  export type Values = XmlString[];
  export interface WarmPoolConfiguration {
    /**
     * The maximum number of instances that are allowed to be in the warm pool or in any state except Terminated for the Auto Scaling group.
     */
    MaxGroupPreparedCapacity?: MaxGroupPreparedCapacity;
    /**
     * The minimum number of instances to maintain in the warm pool.
     */
    MinSize?: WarmPoolMinSize;
    /**
     * The instance state to transition to after the lifecycle actions are complete.
     */
    PoolState?: WarmPoolState;
    /**
     * The status of a warm pool that is marked for deletion.
     */
    Status?: WarmPoolStatus;
    /**
     * The instance reuse policy.
     */
    InstanceReusePolicy?: InstanceReusePolicy;
  }
  export type WarmPoolMinSize = number;
  export type WarmPoolSize = number;
  export type WarmPoolState = "Stopped"|"Running"|"Hibernated"|string;
  export type WarmPoolStatus = "PendingDelete"|string;
  export type XmlString = string;
  export type XmlStringMaxLen1023 = string;
  export type XmlStringMaxLen1600 = string;
  export type XmlStringMaxLen19 = string;
  export type XmlStringMaxLen2047 = string;
  export type XmlStringMaxLen255 = string;
  export type XmlStringMaxLen32 = string;
  export type XmlStringMaxLen511 = string;
  export type XmlStringMaxLen64 = string;
  export type XmlStringMetricLabel = string;
  export type XmlStringMetricStat = string;
  export type XmlStringUserData = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2011-01-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AutoScaling client.
   */
  export import Types = AutoScaling;
}
export = AutoScaling;
