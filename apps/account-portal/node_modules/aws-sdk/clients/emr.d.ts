import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class EMR extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: EMR.Types.ClientConfiguration)
  config: Config & EMR.Types.ClientConfiguration;
  /**
   * Adds an instance fleet to a running cluster.  The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x. 
   */
  addInstanceFleet(params: EMR.Types.AddInstanceFleetInput, callback?: (err: AWSError, data: EMR.Types.AddInstanceFleetOutput) => void): Request<EMR.Types.AddInstanceFleetOutput, AWSError>;
  /**
   * Adds an instance fleet to a running cluster.  The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x. 
   */
  addInstanceFleet(callback?: (err: AWSError, data: EMR.Types.AddInstanceFleetOutput) => void): Request<EMR.Types.AddInstanceFleetOutput, AWSError>;
  /**
   * Adds one or more instance groups to a running cluster.
   */
  addInstanceGroups(params: EMR.Types.AddInstanceGroupsInput, callback?: (err: AWSError, data: EMR.Types.AddInstanceGroupsOutput) => void): Request<EMR.Types.AddInstanceGroupsOutput, AWSError>;
  /**
   * Adds one or more instance groups to a running cluster.
   */
  addInstanceGroups(callback?: (err: AWSError, data: EMR.Types.AddInstanceGroupsOutput) => void): Request<EMR.Types.AddInstanceGroupsOutput, AWSError>;
  /**
   * AddJobFlowSteps adds new steps to a running cluster. A maximum of 256 steps are allowed in each job flow. If your cluster is long-running (such as a Hive data warehouse) or complex, you may require more than 256 steps to process your data. You can bypass the 256-step limitation in various ways, including using SSH to connect to the master node and submitting queries directly to the software running on the master node, such as Hive and Hadoop. For more information on how to do this, see Add More than 256 Steps to a Cluster in the Amazon EMR Management Guide. A step specifies the location of a JAR file stored either on the master node of the cluster or in Amazon S3. Each step is performed by the main function of the main class of the JAR file. The main class can be specified either in the manifest of the JAR or by using the MainFunction parameter of the step. Amazon EMR executes each step in the order listed. For a step to be considered complete, the main function must exit with a zero exit code and all Hadoop jobs started while the step was running must have completed and run successfully. You can only add steps to a cluster that is in one of the following states: STARTING, BOOTSTRAPPING, RUNNING, or WAITING.
   */
  addJobFlowSteps(params: EMR.Types.AddJobFlowStepsInput, callback?: (err: AWSError, data: EMR.Types.AddJobFlowStepsOutput) => void): Request<EMR.Types.AddJobFlowStepsOutput, AWSError>;
  /**
   * AddJobFlowSteps adds new steps to a running cluster. A maximum of 256 steps are allowed in each job flow. If your cluster is long-running (such as a Hive data warehouse) or complex, you may require more than 256 steps to process your data. You can bypass the 256-step limitation in various ways, including using SSH to connect to the master node and submitting queries directly to the software running on the master node, such as Hive and Hadoop. For more information on how to do this, see Add More than 256 Steps to a Cluster in the Amazon EMR Management Guide. A step specifies the location of a JAR file stored either on the master node of the cluster or in Amazon S3. Each step is performed by the main function of the main class of the JAR file. The main class can be specified either in the manifest of the JAR or by using the MainFunction parameter of the step. Amazon EMR executes each step in the order listed. For a step to be considered complete, the main function must exit with a zero exit code and all Hadoop jobs started while the step was running must have completed and run successfully. You can only add steps to a cluster that is in one of the following states: STARTING, BOOTSTRAPPING, RUNNING, or WAITING.
   */
  addJobFlowSteps(callback?: (err: AWSError, data: EMR.Types.AddJobFlowStepsOutput) => void): Request<EMR.Types.AddJobFlowStepsOutput, AWSError>;
  /**
   * Adds tags to an Amazon EMR resource, such as a cluster or an Amazon EMR Studio. Tags make it easier to associate resources in various ways, such as grouping clusters to track your Amazon EMR resource allocation costs. For more information, see Tag Clusters. 
   */
  addTags(params: EMR.Types.AddTagsInput, callback?: (err: AWSError, data: EMR.Types.AddTagsOutput) => void): Request<EMR.Types.AddTagsOutput, AWSError>;
  /**
   * Adds tags to an Amazon EMR resource, such as a cluster or an Amazon EMR Studio. Tags make it easier to associate resources in various ways, such as grouping clusters to track your Amazon EMR resource allocation costs. For more information, see Tag Clusters. 
   */
  addTags(callback?: (err: AWSError, data: EMR.Types.AddTagsOutput) => void): Request<EMR.Types.AddTagsOutput, AWSError>;
  /**
   * Cancels a pending step or steps in a running cluster. Available only in Amazon EMR versions 4.8.0 and later, excluding version 5.0.0. A maximum of 256 steps are allowed in each CancelSteps request. CancelSteps is idempotent but asynchronous; it does not guarantee that a step will be canceled, even if the request is successfully submitted. When you use Amazon EMR versions 5.28.0 and later, you can cancel steps that are in a PENDING or RUNNING state. In earlier versions of Amazon EMR, you can only cancel steps that are in a PENDING state. 
   */
  cancelSteps(params: EMR.Types.CancelStepsInput, callback?: (err: AWSError, data: EMR.Types.CancelStepsOutput) => void): Request<EMR.Types.CancelStepsOutput, AWSError>;
  /**
   * Cancels a pending step or steps in a running cluster. Available only in Amazon EMR versions 4.8.0 and later, excluding version 5.0.0. A maximum of 256 steps are allowed in each CancelSteps request. CancelSteps is idempotent but asynchronous; it does not guarantee that a step will be canceled, even if the request is successfully submitted. When you use Amazon EMR versions 5.28.0 and later, you can cancel steps that are in a PENDING or RUNNING state. In earlier versions of Amazon EMR, you can only cancel steps that are in a PENDING state. 
   */
  cancelSteps(callback?: (err: AWSError, data: EMR.Types.CancelStepsOutput) => void): Request<EMR.Types.CancelStepsOutput, AWSError>;
  /**
   * Creates a security configuration, which is stored in the service and can be specified when a cluster is created.
   */
  createSecurityConfiguration(params: EMR.Types.CreateSecurityConfigurationInput, callback?: (err: AWSError, data: EMR.Types.CreateSecurityConfigurationOutput) => void): Request<EMR.Types.CreateSecurityConfigurationOutput, AWSError>;
  /**
   * Creates a security configuration, which is stored in the service and can be specified when a cluster is created.
   */
  createSecurityConfiguration(callback?: (err: AWSError, data: EMR.Types.CreateSecurityConfigurationOutput) => void): Request<EMR.Types.CreateSecurityConfigurationOutput, AWSError>;
  /**
   * Creates a new Amazon EMR Studio.
   */
  createStudio(params: EMR.Types.CreateStudioInput, callback?: (err: AWSError, data: EMR.Types.CreateStudioOutput) => void): Request<EMR.Types.CreateStudioOutput, AWSError>;
  /**
   * Creates a new Amazon EMR Studio.
   */
  createStudio(callback?: (err: AWSError, data: EMR.Types.CreateStudioOutput) => void): Request<EMR.Types.CreateStudioOutput, AWSError>;
  /**
   * Maps a user or group to the Amazon EMR Studio specified by StudioId, and applies a session policy to refine Studio permissions for that user or group. Use CreateStudioSessionMapping to assign users to a Studio when you use Amazon Web Services SSO authentication. For instructions on how to assign users to a Studio when you use IAM authentication, see Assign a user or group to your EMR Studio.
   */
  createStudioSessionMapping(params: EMR.Types.CreateStudioSessionMappingInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Maps a user or group to the Amazon EMR Studio specified by StudioId, and applies a session policy to refine Studio permissions for that user or group. Use CreateStudioSessionMapping to assign users to a Studio when you use Amazon Web Services SSO authentication. For instructions on how to assign users to a Studio when you use IAM authentication, see Assign a user or group to your EMR Studio.
   */
  createStudioSessionMapping(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a security configuration.
   */
  deleteSecurityConfiguration(params: EMR.Types.DeleteSecurityConfigurationInput, callback?: (err: AWSError, data: EMR.Types.DeleteSecurityConfigurationOutput) => void): Request<EMR.Types.DeleteSecurityConfigurationOutput, AWSError>;
  /**
   * Deletes a security configuration.
   */
  deleteSecurityConfiguration(callback?: (err: AWSError, data: EMR.Types.DeleteSecurityConfigurationOutput) => void): Request<EMR.Types.DeleteSecurityConfigurationOutput, AWSError>;
  /**
   * Removes an Amazon EMR Studio from the Studio metadata store.
   */
  deleteStudio(params: EMR.Types.DeleteStudioInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes an Amazon EMR Studio from the Studio metadata store.
   */
  deleteStudio(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a user or group from an Amazon EMR Studio.
   */
  deleteStudioSessionMapping(params: EMR.Types.DeleteStudioSessionMappingInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes a user or group from an Amazon EMR Studio.
   */
  deleteStudioSessionMapping(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Provides cluster-level details including status, hardware and software configuration, VPC settings, and so on.
   */
  describeCluster(params: EMR.Types.DescribeClusterInput, callback?: (err: AWSError, data: EMR.Types.DescribeClusterOutput) => void): Request<EMR.Types.DescribeClusterOutput, AWSError>;
  /**
   * Provides cluster-level details including status, hardware and software configuration, VPC settings, and so on.
   */
  describeCluster(callback?: (err: AWSError, data: EMR.Types.DescribeClusterOutput) => void): Request<EMR.Types.DescribeClusterOutput, AWSError>;
  /**
   * This API is no longer supported and will eventually be removed. We recommend you use ListClusters, DescribeCluster, ListSteps, ListInstanceGroups and ListBootstrapActions instead. DescribeJobFlows returns a list of job flows that match all of the supplied parameters. The parameters can include a list of job flow IDs, job flow states, and restrictions on job flow creation date and time. Regardless of supplied parameters, only job flows created within the last two months are returned. If no parameters are supplied, then job flows matching either of the following criteria are returned:   Job flows created and completed in the last two weeks    Job flows created within the last two months that are in one of the following states: RUNNING, WAITING, SHUTTING_DOWN, STARTING    Amazon EMR can return a maximum of 512 job flow descriptions.
   */
  describeJobFlows(params: EMR.Types.DescribeJobFlowsInput, callback?: (err: AWSError, data: EMR.Types.DescribeJobFlowsOutput) => void): Request<EMR.Types.DescribeJobFlowsOutput, AWSError>;
  /**
   * This API is no longer supported and will eventually be removed. We recommend you use ListClusters, DescribeCluster, ListSteps, ListInstanceGroups and ListBootstrapActions instead. DescribeJobFlows returns a list of job flows that match all of the supplied parameters. The parameters can include a list of job flow IDs, job flow states, and restrictions on job flow creation date and time. Regardless of supplied parameters, only job flows created within the last two months are returned. If no parameters are supplied, then job flows matching either of the following criteria are returned:   Job flows created and completed in the last two weeks    Job flows created within the last two months that are in one of the following states: RUNNING, WAITING, SHUTTING_DOWN, STARTING    Amazon EMR can return a maximum of 512 job flow descriptions.
   */
  describeJobFlows(callback?: (err: AWSError, data: EMR.Types.DescribeJobFlowsOutput) => void): Request<EMR.Types.DescribeJobFlowsOutput, AWSError>;
  /**
   * Provides details of a notebook execution.
   */
  describeNotebookExecution(params: EMR.Types.DescribeNotebookExecutionInput, callback?: (err: AWSError, data: EMR.Types.DescribeNotebookExecutionOutput) => void): Request<EMR.Types.DescribeNotebookExecutionOutput, AWSError>;
  /**
   * Provides details of a notebook execution.
   */
  describeNotebookExecution(callback?: (err: AWSError, data: EMR.Types.DescribeNotebookExecutionOutput) => void): Request<EMR.Types.DescribeNotebookExecutionOutput, AWSError>;
  /**
   * Provides EMR release label details, such as releases available the region where the API request is run, and the available applications for a specific EMR release label. Can also list EMR release versions that support a specified version of Spark.
   */
  describeReleaseLabel(params: EMR.Types.DescribeReleaseLabelInput, callback?: (err: AWSError, data: EMR.Types.DescribeReleaseLabelOutput) => void): Request<EMR.Types.DescribeReleaseLabelOutput, AWSError>;
  /**
   * Provides EMR release label details, such as releases available the region where the API request is run, and the available applications for a specific EMR release label. Can also list EMR release versions that support a specified version of Spark.
   */
  describeReleaseLabel(callback?: (err: AWSError, data: EMR.Types.DescribeReleaseLabelOutput) => void): Request<EMR.Types.DescribeReleaseLabelOutput, AWSError>;
  /**
   * Provides the details of a security configuration by returning the configuration JSON.
   */
  describeSecurityConfiguration(params: EMR.Types.DescribeSecurityConfigurationInput, callback?: (err: AWSError, data: EMR.Types.DescribeSecurityConfigurationOutput) => void): Request<EMR.Types.DescribeSecurityConfigurationOutput, AWSError>;
  /**
   * Provides the details of a security configuration by returning the configuration JSON.
   */
  describeSecurityConfiguration(callback?: (err: AWSError, data: EMR.Types.DescribeSecurityConfigurationOutput) => void): Request<EMR.Types.DescribeSecurityConfigurationOutput, AWSError>;
  /**
   * Provides more detail about the cluster step.
   */
  describeStep(params: EMR.Types.DescribeStepInput, callback?: (err: AWSError, data: EMR.Types.DescribeStepOutput) => void): Request<EMR.Types.DescribeStepOutput, AWSError>;
  /**
   * Provides more detail about the cluster step.
   */
  describeStep(callback?: (err: AWSError, data: EMR.Types.DescribeStepOutput) => void): Request<EMR.Types.DescribeStepOutput, AWSError>;
  /**
   * Returns details for the specified Amazon EMR Studio including ID, Name, VPC, Studio access URL, and so on.
   */
  describeStudio(params: EMR.Types.DescribeStudioInput, callback?: (err: AWSError, data: EMR.Types.DescribeStudioOutput) => void): Request<EMR.Types.DescribeStudioOutput, AWSError>;
  /**
   * Returns details for the specified Amazon EMR Studio including ID, Name, VPC, Studio access URL, and so on.
   */
  describeStudio(callback?: (err: AWSError, data: EMR.Types.DescribeStudioOutput) => void): Request<EMR.Types.DescribeStudioOutput, AWSError>;
  /**
   * Returns the auto-termination policy for an Amazon EMR cluster.
   */
  getAutoTerminationPolicy(params: EMR.Types.GetAutoTerminationPolicyInput, callback?: (err: AWSError, data: EMR.Types.GetAutoTerminationPolicyOutput) => void): Request<EMR.Types.GetAutoTerminationPolicyOutput, AWSError>;
  /**
   * Returns the auto-termination policy for an Amazon EMR cluster.
   */
  getAutoTerminationPolicy(callback?: (err: AWSError, data: EMR.Types.GetAutoTerminationPolicyOutput) => void): Request<EMR.Types.GetAutoTerminationPolicyOutput, AWSError>;
  /**
   * Returns the Amazon EMR block public access configuration for your Amazon Web Services account in the current Region. For more information see Configure Block Public Access for Amazon EMR in the Amazon EMR Management Guide.
   */
  getBlockPublicAccessConfiguration(params: EMR.Types.GetBlockPublicAccessConfigurationInput, callback?: (err: AWSError, data: EMR.Types.GetBlockPublicAccessConfigurationOutput) => void): Request<EMR.Types.GetBlockPublicAccessConfigurationOutput, AWSError>;
  /**
   * Returns the Amazon EMR block public access configuration for your Amazon Web Services account in the current Region. For more information see Configure Block Public Access for Amazon EMR in the Amazon EMR Management Guide.
   */
  getBlockPublicAccessConfiguration(callback?: (err: AWSError, data: EMR.Types.GetBlockPublicAccessConfigurationOutput) => void): Request<EMR.Types.GetBlockPublicAccessConfigurationOutput, AWSError>;
  /**
   * Fetches the attached managed scaling policy for an Amazon EMR cluster. 
   */
  getManagedScalingPolicy(params: EMR.Types.GetManagedScalingPolicyInput, callback?: (err: AWSError, data: EMR.Types.GetManagedScalingPolicyOutput) => void): Request<EMR.Types.GetManagedScalingPolicyOutput, AWSError>;
  /**
   * Fetches the attached managed scaling policy for an Amazon EMR cluster. 
   */
  getManagedScalingPolicy(callback?: (err: AWSError, data: EMR.Types.GetManagedScalingPolicyOutput) => void): Request<EMR.Types.GetManagedScalingPolicyOutput, AWSError>;
  /**
   * Fetches mapping details for the specified Amazon EMR Studio and identity (user or group).
   */
  getStudioSessionMapping(params: EMR.Types.GetStudioSessionMappingInput, callback?: (err: AWSError, data: EMR.Types.GetStudioSessionMappingOutput) => void): Request<EMR.Types.GetStudioSessionMappingOutput, AWSError>;
  /**
   * Fetches mapping details for the specified Amazon EMR Studio and identity (user or group).
   */
  getStudioSessionMapping(callback?: (err: AWSError, data: EMR.Types.GetStudioSessionMappingOutput) => void): Request<EMR.Types.GetStudioSessionMappingOutput, AWSError>;
  /**
   * Provides information about the bootstrap actions associated with a cluster.
   */
  listBootstrapActions(params: EMR.Types.ListBootstrapActionsInput, callback?: (err: AWSError, data: EMR.Types.ListBootstrapActionsOutput) => void): Request<EMR.Types.ListBootstrapActionsOutput, AWSError>;
  /**
   * Provides information about the bootstrap actions associated with a cluster.
   */
  listBootstrapActions(callback?: (err: AWSError, data: EMR.Types.ListBootstrapActionsOutput) => void): Request<EMR.Types.ListBootstrapActionsOutput, AWSError>;
  /**
   * Provides the status of all clusters visible to this Amazon Web Services account. Allows you to filter the list of clusters based on certain criteria; for example, filtering by cluster creation date and time or by status. This call returns a maximum of 50 clusters in unsorted order per call, but returns a marker to track the paging of the cluster list across multiple ListClusters calls.
   */
  listClusters(params: EMR.Types.ListClustersInput, callback?: (err: AWSError, data: EMR.Types.ListClustersOutput) => void): Request<EMR.Types.ListClustersOutput, AWSError>;
  /**
   * Provides the status of all clusters visible to this Amazon Web Services account. Allows you to filter the list of clusters based on certain criteria; for example, filtering by cluster creation date and time or by status. This call returns a maximum of 50 clusters in unsorted order per call, but returns a marker to track the paging of the cluster list across multiple ListClusters calls.
   */
  listClusters(callback?: (err: AWSError, data: EMR.Types.ListClustersOutput) => void): Request<EMR.Types.ListClustersOutput, AWSError>;
  /**
   * Lists all available details about the instance fleets in a cluster.  The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. 
   */
  listInstanceFleets(params: EMR.Types.ListInstanceFleetsInput, callback?: (err: AWSError, data: EMR.Types.ListInstanceFleetsOutput) => void): Request<EMR.Types.ListInstanceFleetsOutput, AWSError>;
  /**
   * Lists all available details about the instance fleets in a cluster.  The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. 
   */
  listInstanceFleets(callback?: (err: AWSError, data: EMR.Types.ListInstanceFleetsOutput) => void): Request<EMR.Types.ListInstanceFleetsOutput, AWSError>;
  /**
   * Provides all available details about the instance groups in a cluster.
   */
  listInstanceGroups(params: EMR.Types.ListInstanceGroupsInput, callback?: (err: AWSError, data: EMR.Types.ListInstanceGroupsOutput) => void): Request<EMR.Types.ListInstanceGroupsOutput, AWSError>;
  /**
   * Provides all available details about the instance groups in a cluster.
   */
  listInstanceGroups(callback?: (err: AWSError, data: EMR.Types.ListInstanceGroupsOutput) => void): Request<EMR.Types.ListInstanceGroupsOutput, AWSError>;
  /**
   * Provides information for all active EC2 instances and EC2 instances terminated in the last 30 days, up to a maximum of 2,000. EC2 instances in any of the following states are considered active: AWAITING_FULFILLMENT, PROVISIONING, BOOTSTRAPPING, RUNNING.
   */
  listInstances(params: EMR.Types.ListInstancesInput, callback?: (err: AWSError, data: EMR.Types.ListInstancesOutput) => void): Request<EMR.Types.ListInstancesOutput, AWSError>;
  /**
   * Provides information for all active EC2 instances and EC2 instances terminated in the last 30 days, up to a maximum of 2,000. EC2 instances in any of the following states are considered active: AWAITING_FULFILLMENT, PROVISIONING, BOOTSTRAPPING, RUNNING.
   */
  listInstances(callback?: (err: AWSError, data: EMR.Types.ListInstancesOutput) => void): Request<EMR.Types.ListInstancesOutput, AWSError>;
  /**
   * Provides summaries of all notebook executions. You can filter the list based on multiple criteria such as status, time range, and editor id. Returns a maximum of 50 notebook executions and a marker to track the paging of a longer notebook execution list across multiple ListNotebookExecution calls.
   */
  listNotebookExecutions(params: EMR.Types.ListNotebookExecutionsInput, callback?: (err: AWSError, data: EMR.Types.ListNotebookExecutionsOutput) => void): Request<EMR.Types.ListNotebookExecutionsOutput, AWSError>;
  /**
   * Provides summaries of all notebook executions. You can filter the list based on multiple criteria such as status, time range, and editor id. Returns a maximum of 50 notebook executions and a marker to track the paging of a longer notebook execution list across multiple ListNotebookExecution calls.
   */
  listNotebookExecutions(callback?: (err: AWSError, data: EMR.Types.ListNotebookExecutionsOutput) => void): Request<EMR.Types.ListNotebookExecutionsOutput, AWSError>;
  /**
   * Retrieves release labels of EMR services in the region where the API is called.
   */
  listReleaseLabels(params: EMR.Types.ListReleaseLabelsInput, callback?: (err: AWSError, data: EMR.Types.ListReleaseLabelsOutput) => void): Request<EMR.Types.ListReleaseLabelsOutput, AWSError>;
  /**
   * Retrieves release labels of EMR services in the region where the API is called.
   */
  listReleaseLabels(callback?: (err: AWSError, data: EMR.Types.ListReleaseLabelsOutput) => void): Request<EMR.Types.ListReleaseLabelsOutput, AWSError>;
  /**
   * Lists all the security configurations visible to this account, providing their creation dates and times, and their names. This call returns a maximum of 50 clusters per call, but returns a marker to track the paging of the cluster list across multiple ListSecurityConfigurations calls.
   */
  listSecurityConfigurations(params: EMR.Types.ListSecurityConfigurationsInput, callback?: (err: AWSError, data: EMR.Types.ListSecurityConfigurationsOutput) => void): Request<EMR.Types.ListSecurityConfigurationsOutput, AWSError>;
  /**
   * Lists all the security configurations visible to this account, providing their creation dates and times, and their names. This call returns a maximum of 50 clusters per call, but returns a marker to track the paging of the cluster list across multiple ListSecurityConfigurations calls.
   */
  listSecurityConfigurations(callback?: (err: AWSError, data: EMR.Types.ListSecurityConfigurationsOutput) => void): Request<EMR.Types.ListSecurityConfigurationsOutput, AWSError>;
  /**
   * Provides a list of steps for the cluster in reverse order unless you specify stepIds with the request or filter by StepStates. You can specify a maximum of 10 stepIDs. The CLI automatically paginates results to return a list greater than 50 steps. To return more than 50 steps using the CLI, specify a Marker, which is a pagination token that indicates the next set of steps to retrieve.
   */
  listSteps(params: EMR.Types.ListStepsInput, callback?: (err: AWSError, data: EMR.Types.ListStepsOutput) => void): Request<EMR.Types.ListStepsOutput, AWSError>;
  /**
   * Provides a list of steps for the cluster in reverse order unless you specify stepIds with the request or filter by StepStates. You can specify a maximum of 10 stepIDs. The CLI automatically paginates results to return a list greater than 50 steps. To return more than 50 steps using the CLI, specify a Marker, which is a pagination token that indicates the next set of steps to retrieve.
   */
  listSteps(callback?: (err: AWSError, data: EMR.Types.ListStepsOutput) => void): Request<EMR.Types.ListStepsOutput, AWSError>;
  /**
   * Returns a list of all user or group session mappings for the Amazon EMR Studio specified by StudioId.
   */
  listStudioSessionMappings(params: EMR.Types.ListStudioSessionMappingsInput, callback?: (err: AWSError, data: EMR.Types.ListStudioSessionMappingsOutput) => void): Request<EMR.Types.ListStudioSessionMappingsOutput, AWSError>;
  /**
   * Returns a list of all user or group session mappings for the Amazon EMR Studio specified by StudioId.
   */
  listStudioSessionMappings(callback?: (err: AWSError, data: EMR.Types.ListStudioSessionMappingsOutput) => void): Request<EMR.Types.ListStudioSessionMappingsOutput, AWSError>;
  /**
   * Returns a list of all Amazon EMR Studios associated with the Amazon Web Services account. The list includes details such as ID, Studio Access URL, and creation time for each Studio.
   */
  listStudios(params: EMR.Types.ListStudiosInput, callback?: (err: AWSError, data: EMR.Types.ListStudiosOutput) => void): Request<EMR.Types.ListStudiosOutput, AWSError>;
  /**
   * Returns a list of all Amazon EMR Studios associated with the Amazon Web Services account. The list includes details such as ID, Studio Access URL, and creation time for each Studio.
   */
  listStudios(callback?: (err: AWSError, data: EMR.Types.ListStudiosOutput) => void): Request<EMR.Types.ListStudiosOutput, AWSError>;
  /**
   * Modifies the number of steps that can be executed concurrently for the cluster specified using ClusterID.
   */
  modifyCluster(params: EMR.Types.ModifyClusterInput, callback?: (err: AWSError, data: EMR.Types.ModifyClusterOutput) => void): Request<EMR.Types.ModifyClusterOutput, AWSError>;
  /**
   * Modifies the number of steps that can be executed concurrently for the cluster specified using ClusterID.
   */
  modifyCluster(callback?: (err: AWSError, data: EMR.Types.ModifyClusterOutput) => void): Request<EMR.Types.ModifyClusterOutput, AWSError>;
  /**
   * Modifies the target On-Demand and target Spot capacities for the instance fleet with the specified InstanceFleetID within the cluster specified using ClusterID. The call either succeeds or fails atomically.  The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. 
   */
  modifyInstanceFleet(params: EMR.Types.ModifyInstanceFleetInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Modifies the target On-Demand and target Spot capacities for the instance fleet with the specified InstanceFleetID within the cluster specified using ClusterID. The call either succeeds or fails atomically.  The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. 
   */
  modifyInstanceFleet(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * ModifyInstanceGroups modifies the number of nodes and configuration settings of an instance group. The input parameters include the new target instance count for the group and the instance group ID. The call will either succeed or fail atomically.
   */
  modifyInstanceGroups(params: EMR.Types.ModifyInstanceGroupsInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * ModifyInstanceGroups modifies the number of nodes and configuration settings of an instance group. The input parameters include the new target instance count for the group and the instance group ID. The call will either succeed or fail atomically.
   */
  modifyInstanceGroups(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates or updates an automatic scaling policy for a core instance group or task instance group in an Amazon EMR cluster. The automatic scaling policy defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric.
   */
  putAutoScalingPolicy(params: EMR.Types.PutAutoScalingPolicyInput, callback?: (err: AWSError, data: EMR.Types.PutAutoScalingPolicyOutput) => void): Request<EMR.Types.PutAutoScalingPolicyOutput, AWSError>;
  /**
   * Creates or updates an automatic scaling policy for a core instance group or task instance group in an Amazon EMR cluster. The automatic scaling policy defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric.
   */
  putAutoScalingPolicy(callback?: (err: AWSError, data: EMR.Types.PutAutoScalingPolicyOutput) => void): Request<EMR.Types.PutAutoScalingPolicyOutput, AWSError>;
  /**
   * Creates or updates an auto-termination policy for an Amazon EMR cluster. An auto-termination policy defines the amount of idle time in seconds after which a cluster automatically terminates. For alternative cluster termination options, see Control cluster termination.
   */
  putAutoTerminationPolicy(params: EMR.Types.PutAutoTerminationPolicyInput, callback?: (err: AWSError, data: EMR.Types.PutAutoTerminationPolicyOutput) => void): Request<EMR.Types.PutAutoTerminationPolicyOutput, AWSError>;
  /**
   * Creates or updates an auto-termination policy for an Amazon EMR cluster. An auto-termination policy defines the amount of idle time in seconds after which a cluster automatically terminates. For alternative cluster termination options, see Control cluster termination.
   */
  putAutoTerminationPolicy(callback?: (err: AWSError, data: EMR.Types.PutAutoTerminationPolicyOutput) => void): Request<EMR.Types.PutAutoTerminationPolicyOutput, AWSError>;
  /**
   * Creates or updates an Amazon EMR block public access configuration for your Amazon Web Services account in the current Region. For more information see Configure Block Public Access for Amazon EMR in the Amazon EMR Management Guide.
   */
  putBlockPublicAccessConfiguration(params: EMR.Types.PutBlockPublicAccessConfigurationInput, callback?: (err: AWSError, data: EMR.Types.PutBlockPublicAccessConfigurationOutput) => void): Request<EMR.Types.PutBlockPublicAccessConfigurationOutput, AWSError>;
  /**
   * Creates or updates an Amazon EMR block public access configuration for your Amazon Web Services account in the current Region. For more information see Configure Block Public Access for Amazon EMR in the Amazon EMR Management Guide.
   */
  putBlockPublicAccessConfiguration(callback?: (err: AWSError, data: EMR.Types.PutBlockPublicAccessConfigurationOutput) => void): Request<EMR.Types.PutBlockPublicAccessConfigurationOutput, AWSError>;
  /**
   * Creates or updates a managed scaling policy for an Amazon EMR cluster. The managed scaling policy defines the limits for resources, such as EC2 instances that can be added or terminated from a cluster. The policy only applies to the core and task nodes. The master node cannot be scaled after initial configuration. 
   */
  putManagedScalingPolicy(params: EMR.Types.PutManagedScalingPolicyInput, callback?: (err: AWSError, data: EMR.Types.PutManagedScalingPolicyOutput) => void): Request<EMR.Types.PutManagedScalingPolicyOutput, AWSError>;
  /**
   * Creates or updates a managed scaling policy for an Amazon EMR cluster. The managed scaling policy defines the limits for resources, such as EC2 instances that can be added or terminated from a cluster. The policy only applies to the core and task nodes. The master node cannot be scaled after initial configuration. 
   */
  putManagedScalingPolicy(callback?: (err: AWSError, data: EMR.Types.PutManagedScalingPolicyOutput) => void): Request<EMR.Types.PutManagedScalingPolicyOutput, AWSError>;
  /**
   * Removes an automatic scaling policy from a specified instance group within an EMR cluster.
   */
  removeAutoScalingPolicy(params: EMR.Types.RemoveAutoScalingPolicyInput, callback?: (err: AWSError, data: EMR.Types.RemoveAutoScalingPolicyOutput) => void): Request<EMR.Types.RemoveAutoScalingPolicyOutput, AWSError>;
  /**
   * Removes an automatic scaling policy from a specified instance group within an EMR cluster.
   */
  removeAutoScalingPolicy(callback?: (err: AWSError, data: EMR.Types.RemoveAutoScalingPolicyOutput) => void): Request<EMR.Types.RemoveAutoScalingPolicyOutput, AWSError>;
  /**
   * Removes an auto-termination policy from an Amazon EMR cluster.
   */
  removeAutoTerminationPolicy(params: EMR.Types.RemoveAutoTerminationPolicyInput, callback?: (err: AWSError, data: EMR.Types.RemoveAutoTerminationPolicyOutput) => void): Request<EMR.Types.RemoveAutoTerminationPolicyOutput, AWSError>;
  /**
   * Removes an auto-termination policy from an Amazon EMR cluster.
   */
  removeAutoTerminationPolicy(callback?: (err: AWSError, data: EMR.Types.RemoveAutoTerminationPolicyOutput) => void): Request<EMR.Types.RemoveAutoTerminationPolicyOutput, AWSError>;
  /**
   *  Removes a managed scaling policy from a specified EMR cluster. 
   */
  removeManagedScalingPolicy(params: EMR.Types.RemoveManagedScalingPolicyInput, callback?: (err: AWSError, data: EMR.Types.RemoveManagedScalingPolicyOutput) => void): Request<EMR.Types.RemoveManagedScalingPolicyOutput, AWSError>;
  /**
   *  Removes a managed scaling policy from a specified EMR cluster. 
   */
  removeManagedScalingPolicy(callback?: (err: AWSError, data: EMR.Types.RemoveManagedScalingPolicyOutput) => void): Request<EMR.Types.RemoveManagedScalingPolicyOutput, AWSError>;
  /**
   * Removes tags from an Amazon EMR resource, such as a cluster or Amazon EMR Studio. Tags make it easier to associate resources in various ways, such as grouping clusters to track your Amazon EMR resource allocation costs. For more information, see Tag Clusters.  The following example removes the stack tag with value Prod from a cluster:
   */
  removeTags(params: EMR.Types.RemoveTagsInput, callback?: (err: AWSError, data: EMR.Types.RemoveTagsOutput) => void): Request<EMR.Types.RemoveTagsOutput, AWSError>;
  /**
   * Removes tags from an Amazon EMR resource, such as a cluster or Amazon EMR Studio. Tags make it easier to associate resources in various ways, such as grouping clusters to track your Amazon EMR resource allocation costs. For more information, see Tag Clusters.  The following example removes the stack tag with value Prod from a cluster:
   */
  removeTags(callback?: (err: AWSError, data: EMR.Types.RemoveTagsOutput) => void): Request<EMR.Types.RemoveTagsOutput, AWSError>;
  /**
   * RunJobFlow creates and starts running a new cluster (job flow). The cluster runs the steps specified. After the steps complete, the cluster stops and the HDFS partition is lost. To prevent loss of data, configure the last step of the job flow to store results in Amazon S3. If the JobFlowInstancesConfig KeepJobFlowAliveWhenNoSteps parameter is set to TRUE, the cluster transitions to the WAITING state rather than shutting down after the steps have completed.  For additional protection, you can set the JobFlowInstancesConfig TerminationProtected parameter to TRUE to lock the cluster and prevent it from being terminated by API call, user intervention, or in the event of a job flow error. A maximum of 256 steps are allowed in each job flow. If your cluster is long-running (such as a Hive data warehouse) or complex, you may require more than 256 steps to process your data. You can bypass the 256-step limitation in various ways, including using the SSH shell to connect to the master node and submitting queries directly to the software running on the master node, such as Hive and Hadoop. For more information on how to do this, see Add More than 256 Steps to a Cluster in the Amazon EMR Management Guide. For long running clusters, we recommend that you periodically store your results.  The instance fleets configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. The RunJobFlow request can contain InstanceFleets parameters or InstanceGroups parameters, but not both. 
   */
  runJobFlow(params: EMR.Types.RunJobFlowInput, callback?: (err: AWSError, data: EMR.Types.RunJobFlowOutput) => void): Request<EMR.Types.RunJobFlowOutput, AWSError>;
  /**
   * RunJobFlow creates and starts running a new cluster (job flow). The cluster runs the steps specified. After the steps complete, the cluster stops and the HDFS partition is lost. To prevent loss of data, configure the last step of the job flow to store results in Amazon S3. If the JobFlowInstancesConfig KeepJobFlowAliveWhenNoSteps parameter is set to TRUE, the cluster transitions to the WAITING state rather than shutting down after the steps have completed.  For additional protection, you can set the JobFlowInstancesConfig TerminationProtected parameter to TRUE to lock the cluster and prevent it from being terminated by API call, user intervention, or in the event of a job flow error. A maximum of 256 steps are allowed in each job flow. If your cluster is long-running (such as a Hive data warehouse) or complex, you may require more than 256 steps to process your data. You can bypass the 256-step limitation in various ways, including using the SSH shell to connect to the master node and submitting queries directly to the software running on the master node, such as Hive and Hadoop. For more information on how to do this, see Add More than 256 Steps to a Cluster in the Amazon EMR Management Guide. For long running clusters, we recommend that you periodically store your results.  The instance fleets configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. The RunJobFlow request can contain InstanceFleets parameters or InstanceGroups parameters, but not both. 
   */
  runJobFlow(callback?: (err: AWSError, data: EMR.Types.RunJobFlowOutput) => void): Request<EMR.Types.RunJobFlowOutput, AWSError>;
  /**
   * SetTerminationProtection locks a cluster (job flow) so the EC2 instances in the cluster cannot be terminated by user intervention, an API call, or in the event of a job-flow error. The cluster still terminates upon successful completion of the job flow. Calling SetTerminationProtection on a cluster is similar to calling the Amazon EC2 DisableAPITermination API on all EC2 instances in a cluster.  SetTerminationProtection is used to prevent accidental termination of a cluster and to ensure that in the event of an error, the instances persist so that you can recover any data stored in their ephemeral instance storage.  To terminate a cluster that has been locked by setting SetTerminationProtection to true, you must first unlock the job flow by a subsequent call to SetTerminationProtection in which you set the value to false.   For more information, seeManaging Cluster Termination in the Amazon EMR Management Guide. 
   */
  setTerminationProtection(params: EMR.Types.SetTerminationProtectionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * SetTerminationProtection locks a cluster (job flow) so the EC2 instances in the cluster cannot be terminated by user intervention, an API call, or in the event of a job-flow error. The cluster still terminates upon successful completion of the job flow. Calling SetTerminationProtection on a cluster is similar to calling the Amazon EC2 DisableAPITermination API on all EC2 instances in a cluster.  SetTerminationProtection is used to prevent accidental termination of a cluster and to ensure that in the event of an error, the instances persist so that you can recover any data stored in their ephemeral instance storage.  To terminate a cluster that has been locked by setting SetTerminationProtection to true, you must first unlock the job flow by a subsequent call to SetTerminationProtection in which you set the value to false.   For more information, seeManaging Cluster Termination in the Amazon EMR Management Guide. 
   */
  setTerminationProtection(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the Cluster$VisibleToAllUsers value for an EMR cluster. When true, IAM principals in the Amazon Web Services account can perform EMR cluster actions that their IAM policies allow. When false, only the IAM principal that created the cluster and the Amazon Web Services account root user can perform EMR actions on the cluster, regardless of IAM permissions policies attached to other IAM principals. This action works on running clusters. When you create a cluster, use the RunJobFlowInput$VisibleToAllUsers parameter. For more information, see Understanding the EMR Cluster VisibleToAllUsers Setting in the Amazon EMRManagement Guide.
   */
  setVisibleToAllUsers(params: EMR.Types.SetVisibleToAllUsersInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Sets the Cluster$VisibleToAllUsers value for an EMR cluster. When true, IAM principals in the Amazon Web Services account can perform EMR cluster actions that their IAM policies allow. When false, only the IAM principal that created the cluster and the Amazon Web Services account root user can perform EMR actions on the cluster, regardless of IAM permissions policies attached to other IAM principals. This action works on running clusters. When you create a cluster, use the RunJobFlowInput$VisibleToAllUsers parameter. For more information, see Understanding the EMR Cluster VisibleToAllUsers Setting in the Amazon EMRManagement Guide.
   */
  setVisibleToAllUsers(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts a notebook execution.
   */
  startNotebookExecution(params: EMR.Types.StartNotebookExecutionInput, callback?: (err: AWSError, data: EMR.Types.StartNotebookExecutionOutput) => void): Request<EMR.Types.StartNotebookExecutionOutput, AWSError>;
  /**
   * Starts a notebook execution.
   */
  startNotebookExecution(callback?: (err: AWSError, data: EMR.Types.StartNotebookExecutionOutput) => void): Request<EMR.Types.StartNotebookExecutionOutput, AWSError>;
  /**
   * Stops a notebook execution.
   */
  stopNotebookExecution(params: EMR.Types.StopNotebookExecutionInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a notebook execution.
   */
  stopNotebookExecution(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * TerminateJobFlows shuts a list of clusters (job flows) down. When a job flow is shut down, any step not yet completed is canceled and the EC2 instances on which the cluster is running are stopped. Any log files not already saved are uploaded to Amazon S3 if a LogUri was specified when the cluster was created. The maximum number of clusters allowed is 10. The call to TerminateJobFlows is asynchronous. Depending on the configuration of the cluster, it may take up to 1-5 minutes for the cluster to completely terminate and release allocated resources, such as Amazon EC2 instances.
   */
  terminateJobFlows(params: EMR.Types.TerminateJobFlowsInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * TerminateJobFlows shuts a list of clusters (job flows) down. When a job flow is shut down, any step not yet completed is canceled and the EC2 instances on which the cluster is running are stopped. Any log files not already saved are uploaded to Amazon S3 if a LogUri was specified when the cluster was created. The maximum number of clusters allowed is 10. The call to TerminateJobFlows is asynchronous. Depending on the configuration of the cluster, it may take up to 1-5 minutes for the cluster to completely terminate and release allocated resources, such as Amazon EC2 instances.
   */
  terminateJobFlows(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an Amazon EMR Studio configuration, including attributes such as name, description, and subnets.
   */
  updateStudio(params: EMR.Types.UpdateStudioInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an Amazon EMR Studio configuration, including attributes such as name, description, and subnets.
   */
  updateStudio(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the session policy attached to the user or group for the specified Amazon EMR Studio.
   */
  updateStudioSessionMapping(params: EMR.Types.UpdateStudioSessionMappingInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the session policy attached to the user or group for the specified Amazon EMR Studio.
   */
  updateStudioSessionMapping(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Waits for the clusterRunning state by periodically calling the underlying EMR.describeClusteroperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "clusterRunning", params: EMR.Types.DescribeClusterInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: EMR.Types.DescribeClusterOutput) => void): Request<EMR.Types.DescribeClusterOutput, AWSError>;
  /**
   * Waits for the clusterRunning state by periodically calling the underlying EMR.describeClusteroperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "clusterRunning", callback?: (err: AWSError, data: EMR.Types.DescribeClusterOutput) => void): Request<EMR.Types.DescribeClusterOutput, AWSError>;
  /**
   * Waits for the stepComplete state by periodically calling the underlying EMR.describeStepoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "stepComplete", params: EMR.Types.DescribeStepInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: EMR.Types.DescribeStepOutput) => void): Request<EMR.Types.DescribeStepOutput, AWSError>;
  /**
   * Waits for the stepComplete state by periodically calling the underlying EMR.describeStepoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "stepComplete", callback?: (err: AWSError, data: EMR.Types.DescribeStepOutput) => void): Request<EMR.Types.DescribeStepOutput, AWSError>;
  /**
   * Waits for the clusterTerminated state by periodically calling the underlying EMR.describeClusteroperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "clusterTerminated", params: EMR.Types.DescribeClusterInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: EMR.Types.DescribeClusterOutput) => void): Request<EMR.Types.DescribeClusterOutput, AWSError>;
  /**
   * Waits for the clusterTerminated state by periodically calling the underlying EMR.describeClusteroperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "clusterTerminated", callback?: (err: AWSError, data: EMR.Types.DescribeClusterOutput) => void): Request<EMR.Types.DescribeClusterOutput, AWSError>;
}
declare namespace EMR {
  export type ActionOnFailure = "TERMINATE_JOB_FLOW"|"TERMINATE_CLUSTER"|"CANCEL_AND_WAIT"|"CONTINUE"|string;
  export interface AddInstanceFleetInput {
    /**
     * The unique identifier of the cluster.
     */
    ClusterId: XmlStringMaxLen256;
    /**
     * Specifies the configuration of the instance fleet.
     */
    InstanceFleet: InstanceFleetConfig;
  }
  export interface AddInstanceFleetOutput {
    /**
     * The unique identifier of the cluster.
     */
    ClusterId?: XmlStringMaxLen256;
    /**
     * The unique identifier of the instance fleet.
     */
    InstanceFleetId?: InstanceFleetId;
    /**
     * The Amazon Resource Name of the cluster.
     */
    ClusterArn?: ArnType;
  }
  export interface AddInstanceGroupsInput {
    /**
     * Instance groups to add.
     */
    InstanceGroups: InstanceGroupConfigList;
    /**
     * Job flow in which to add the instance groups.
     */
    JobFlowId: XmlStringMaxLen256;
  }
  export interface AddInstanceGroupsOutput {
    /**
     * The job flow ID in which the instance groups are added.
     */
    JobFlowId?: XmlStringMaxLen256;
    /**
     * Instance group IDs of the newly created instance groups.
     */
    InstanceGroupIds?: InstanceGroupIdsList;
    /**
     * The Amazon Resource Name of the cluster.
     */
    ClusterArn?: ArnType;
  }
  export interface AddJobFlowStepsInput {
    /**
     * A string that uniquely identifies the job flow. This identifier is returned by RunJobFlow and can also be obtained from ListClusters. 
     */
    JobFlowId: XmlStringMaxLen256;
    /**
     *  A list of StepConfig to be executed by the job flow. 
     */
    Steps: StepConfigList;
  }
  export interface AddJobFlowStepsOutput {
    /**
     * The identifiers of the list of steps added to the job flow.
     */
    StepIds?: StepIdsList;
  }
  export interface AddTagsInput {
    /**
     * The Amazon EMR resource identifier to which tags will be added. For example, a cluster identifier or an Amazon EMR Studio ID.
     */
    ResourceId: ResourceId;
    /**
     * A list of tags to associate with a resource. Tags are user-defined key-value pairs that consist of a required key string with a maximum of 128 characters, and an optional value string with a maximum of 256 characters.
     */
    Tags: TagList;
  }
  export interface AddTagsOutput {
  }
  export type AdjustmentType = "CHANGE_IN_CAPACITY"|"PERCENT_CHANGE_IN_CAPACITY"|"EXACT_CAPACITY"|string;
  export interface Application {
    /**
     * The name of the application.
     */
    Name?: String;
    /**
     * The version of the application.
     */
    Version?: String;
    /**
     * Arguments for Amazon EMR to pass to the application.
     */
    Args?: StringList;
    /**
     * This option is for advanced users only. This is meta information about third-party applications that third-party vendors use for testing purposes.
     */
    AdditionalInfo?: StringMap;
  }
  export type ApplicationList = Application[];
  export type ArnType = string;
  export type AuthMode = "SSO"|"IAM"|string;
  export interface AutoScalingPolicy {
    /**
     * The upper and lower EC2 instance limits for an automatic scaling policy. Automatic scaling activity will not cause an instance group to grow above or below these limits.
     */
    Constraints: ScalingConstraints;
    /**
     * The scale-in and scale-out rules that comprise the automatic scaling policy.
     */
    Rules: ScalingRuleList;
  }
  export interface AutoScalingPolicyDescription {
    /**
     * The status of an automatic scaling policy. 
     */
    Status?: AutoScalingPolicyStatus;
    /**
     * The upper and lower EC2 instance limits for an automatic scaling policy. Automatic scaling activity will not cause an instance group to grow above or below these limits.
     */
    Constraints?: ScalingConstraints;
    /**
     * The scale-in and scale-out rules that comprise the automatic scaling policy.
     */
    Rules?: ScalingRuleList;
  }
  export type AutoScalingPolicyState = "PENDING"|"ATTACHING"|"ATTACHED"|"DETACHING"|"DETACHED"|"FAILED"|string;
  export interface AutoScalingPolicyStateChangeReason {
    /**
     * The code indicating the reason for the change in status.USER_REQUEST indicates that the scaling policy status was changed by a user. PROVISION_FAILURE indicates that the status change was because the policy failed to provision. CLEANUP_FAILURE indicates an error.
     */
    Code?: AutoScalingPolicyStateChangeReasonCode;
    /**
     * A friendly, more verbose message that accompanies an automatic scaling policy state change.
     */
    Message?: String;
  }
  export type AutoScalingPolicyStateChangeReasonCode = "USER_REQUEST"|"PROVISION_FAILURE"|"CLEANUP_FAILURE"|string;
  export interface AutoScalingPolicyStatus {
    /**
     * Indicates the status of the automatic scaling policy.
     */
    State?: AutoScalingPolicyState;
    /**
     * The reason for a change in status.
     */
    StateChangeReason?: AutoScalingPolicyStateChangeReason;
  }
  export interface AutoTerminationPolicy {
    /**
     * Specifies the amount of idle time in seconds after which the cluster automatically terminates. You can specify a minimum of 60 seconds and a maximum of 604800 seconds (seven days).
     */
    IdleTimeout?: Long;
  }
  export interface BlockPublicAccessConfiguration {
    /**
     * Indicates whether Amazon EMR block public access is enabled (true) or disabled (false). By default, the value is false for accounts that have created EMR clusters before July 2019. For accounts created after this, the default is true.
     */
    BlockPublicSecurityGroupRules: Boolean;
    /**
     * Specifies ports and port ranges that are permitted to have security group rules that allow inbound traffic from all public sources. For example, if Port 23 (Telnet) is specified for PermittedPublicSecurityGroupRuleRanges, Amazon EMR allows cluster creation if a security group associated with the cluster has a rule that allows inbound traffic on Port 23 from IPv4 0.0.0.0/0 or IPv6 port ::/0 as the source. By default, Port 22, which is used for SSH access to the cluster EC2 instances, is in the list of PermittedPublicSecurityGroupRuleRanges.
     */
    PermittedPublicSecurityGroupRuleRanges?: PortRanges;
  }
  export interface BlockPublicAccessConfigurationMetadata {
    /**
     * The date and time that the configuration was created.
     */
    CreationDateTime: _Date;
    /**
     * The Amazon Resource Name that created or last modified the configuration.
     */
    CreatedByArn: ArnType;
  }
  export type Boolean = boolean;
  export type BooleanObject = boolean;
  export interface BootstrapActionConfig {
    /**
     * The name of the bootstrap action.
     */
    Name: XmlStringMaxLen256;
    /**
     * The script run by the bootstrap action.
     */
    ScriptBootstrapAction: ScriptBootstrapActionConfig;
  }
  export type BootstrapActionConfigList = BootstrapActionConfig[];
  export interface BootstrapActionDetail {
    /**
     * A description of the bootstrap action.
     */
    BootstrapActionConfig?: BootstrapActionConfig;
  }
  export type BootstrapActionDetailList = BootstrapActionDetail[];
  export interface CancelStepsInfo {
    /**
     * The encrypted StepId of a step.
     */
    StepId?: StepId;
    /**
     * The status of a CancelSteps Request. The value may be SUBMITTED or FAILED.
     */
    Status?: CancelStepsRequestStatus;
    /**
     * The reason for the failure if the CancelSteps request fails.
     */
    Reason?: String;
  }
  export type CancelStepsInfoList = CancelStepsInfo[];
  export interface CancelStepsInput {
    /**
     * The ClusterID for the specified steps that will be canceled. Use RunJobFlow and ListClusters to get ClusterIDs. 
     */
    ClusterId: XmlStringMaxLen256;
    /**
     * The list of StepIDs to cancel. Use ListSteps to get steps and their states for the specified cluster.
     */
    StepIds: StepIdsList;
    /**
     * The option to choose to cancel RUNNING steps. By default, the value is SEND_INTERRUPT.
     */
    StepCancellationOption?: StepCancellationOption;
  }
  export interface CancelStepsOutput {
    /**
     * A list of CancelStepsInfo, which shows the status of specified cancel requests for each StepID specified.
     */
    CancelStepsInfoList?: CancelStepsInfoList;
  }
  export type CancelStepsRequestStatus = "SUBMITTED"|"FAILED"|string;
  export interface CloudWatchAlarmDefinition {
    /**
     * Determines how the metric specified by MetricName is compared to the value specified by Threshold.
     */
    ComparisonOperator: ComparisonOperator;
    /**
     * The number of periods, in five-minute increments, during which the alarm condition must exist before the alarm triggers automatic scaling activity. The default value is 1.
     */
    EvaluationPeriods?: Integer;
    /**
     * The name of the CloudWatch metric that is watched to determine an alarm condition.
     */
    MetricName: String;
    /**
     * The namespace for the CloudWatch metric. The default is AWS/ElasticMapReduce.
     */
    Namespace?: String;
    /**
     * The period, in seconds, over which the statistic is applied. EMR CloudWatch metrics are emitted every five minutes (300 seconds), so if an EMR CloudWatch metric is specified, specify 300.
     */
    Period: Integer;
    /**
     * The statistic to apply to the metric associated with the alarm. The default is AVERAGE.
     */
    Statistic?: Statistic;
    /**
     * The value against which the specified statistic is compared.
     */
    Threshold: NonNegativeDouble;
    /**
     * The unit of measure associated with the CloudWatch metric being watched. The value specified for Unit must correspond to the units specified in the CloudWatch metric.
     */
    Unit?: Unit;
    /**
     * A CloudWatch metric dimension.
     */
    Dimensions?: MetricDimensionList;
  }
  export interface Cluster {
    /**
     * The unique identifier for the cluster.
     */
    Id?: ClusterId;
    /**
     * The name of the cluster.
     */
    Name?: String;
    /**
     * The current status details about the cluster.
     */
    Status?: ClusterStatus;
    /**
     * Provides information about the EC2 instances in a cluster grouped by category. For example, key name, subnet ID, IAM instance profile, and so on.
     */
    Ec2InstanceAttributes?: Ec2InstanceAttributes;
    /**
     *  The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.  The instance group configuration of the cluster. A value of INSTANCE_GROUP indicates a uniform instance group configuration. A value of INSTANCE_FLEET indicates an instance fleets configuration.
     */
    InstanceCollectionType?: InstanceCollectionType;
    /**
     * The path to the Amazon S3 location where logs for this cluster are stored.
     */
    LogUri?: String;
    /**
     *  The KMS key used for encrypting log files. This attribute is only available with EMR version 5.30.0 and later, excluding EMR 6.0.0. 
     */
    LogEncryptionKmsKeyId?: String;
    /**
     * The AMI version requested for this cluster.
     */
    RequestedAmiVersion?: String;
    /**
     * The AMI version running on this cluster.
     */
    RunningAmiVersion?: String;
    /**
     * The Amazon EMR release label, which determines the version of open-source application packages installed on the cluster. Release labels are in the form emr-x.x.x, where x.x.x is an Amazon EMR release version such as emr-5.14.0. For more information about Amazon EMR release versions and included application versions and features, see https://docs.aws.amazon.com/emr/latest/ReleaseGuide/. The release label applies only to Amazon EMR releases version 4.0 and later. Earlier versions use AmiVersion.
     */
    ReleaseLabel?: String;
    /**
     * Specifies whether the cluster should terminate after completing all steps.
     */
    AutoTerminate?: Boolean;
    /**
     * Indicates whether Amazon EMR will lock the cluster to prevent the EC2 instances from being terminated by an API call or user intervention, or in the event of a cluster error.
     */
    TerminationProtected?: Boolean;
    /**
     * Indicates whether the cluster is visible to IAM principals in the Amazon Web Services account associated with the cluster. When true, IAM principals in the Amazon Web Services account can perform EMR cluster actions on the cluster that their IAM policies allow. When false, only the IAM principal that created the cluster and the Amazon Web Services account root user can perform EMR actions, regardless of IAM permissions policies attached to other IAM principals. The default value is true if a value is not provided when creating a cluster using the EMR API RunJobFlow command, the CLI create-cluster command, or the Amazon Web Services Management Console. IAM principals that are allowed to perform actions on the cluster can use the SetVisibleToAllUsers action to change the value on a running cluster. For more information, see Understanding the EMR Cluster VisibleToAllUsers Setting in the Amazon EMRManagement Guide.
     */
    VisibleToAllUsers?: Boolean;
    /**
     * The applications installed on this cluster.
     */
    Applications?: ApplicationList;
    /**
     * A list of tags associated with a cluster.
     */
    Tags?: TagList;
    /**
     * The IAM role that Amazon EMR assumes in order to access Amazon Web Services resources on your behalf.
     */
    ServiceRole?: String;
    /**
     * An approximation of the cost of the cluster, represented in m1.small/hours. This value is incremented one time for every hour an m1.small instance runs. Larger instances are weighted more, so an EC2 instance that is roughly four times more expensive would result in the normalized instance hours being incremented by four. This result is only an approximation and does not reflect the actual billing rate.
     */
    NormalizedInstanceHours?: Integer;
    /**
     * The DNS name of the master node. If the cluster is on a private subnet, this is the private DNS name. On a public subnet, this is the public DNS name.
     */
    MasterPublicDnsName?: String;
    /**
     * Applies only to Amazon EMR releases 4.x and later. The list of Configurations supplied to the EMR cluster.
     */
    Configurations?: ConfigurationList;
    /**
     * The name of the security configuration applied to the cluster.
     */
    SecurityConfiguration?: XmlString;
    /**
     * An IAM role for automatic scaling policies. The default role is EMR_AutoScaling_DefaultRole. The IAM role provides permissions that the automatic scaling feature requires to launch and terminate EC2 instances in an instance group.
     */
    AutoScalingRole?: XmlString;
    /**
     * The way that individual Amazon EC2 instances terminate when an automatic scale-in activity occurs or an instance group is resized. TERMINATE_AT_INSTANCE_HOUR indicates that Amazon EMR terminates nodes at the instance-hour boundary, regardless of when the request to terminate the instance was submitted. This option is only available with Amazon EMR 5.1.0 and later and is the default for clusters created using that version. TERMINATE_AT_TASK_COMPLETION indicates that Amazon EMR adds nodes to a deny list and drains tasks from nodes before terminating the Amazon EC2 instances, regardless of the instance-hour boundary. With either behavior, Amazon EMR removes the least active nodes first and blocks instance termination if it could lead to HDFS corruption. TERMINATE_AT_TASK_COMPLETION is available only in Amazon EMR version 4.1.0 and later, and is the default for versions of Amazon EMR earlier than 5.1.0.
     */
    ScaleDownBehavior?: ScaleDownBehavior;
    /**
     * Available only in Amazon EMR version 5.7.0 and later. The ID of a custom Amazon EBS-backed Linux AMI if the cluster uses a custom AMI.
     */
    CustomAmiId?: XmlStringMaxLen256;
    /**
     * The size, in GiB, of the Amazon EBS root device volume of the Linux AMI that is used for each EC2 instance. Available in Amazon EMR version 4.x and later.
     */
    EbsRootVolumeSize?: Integer;
    /**
     * Applies only when CustomAmiID is used. Specifies the type of updates that are applied from the Amazon Linux AMI package repositories when an instance boots using the AMI.
     */
    RepoUpgradeOnBoot?: RepoUpgradeOnBoot;
    /**
     * Attributes for Kerberos configuration when Kerberos authentication is enabled using a security configuration. For more information see Use Kerberos Authentication in the Amazon EMR Management Guide.
     */
    KerberosAttributes?: KerberosAttributes;
    /**
     * The Amazon Resource Name of the cluster.
     */
    ClusterArn?: ArnType;
    /**
     *  The Amazon Resource Name (ARN) of the Outpost where the cluster is launched. 
     */
    OutpostArn?: OptionalArnType;
    /**
     * Specifies the number of steps that can be executed concurrently.
     */
    StepConcurrencyLevel?: Integer;
    /**
     * Placement group configured for an Amazon EMR cluster.
     */
    PlacementGroups?: PlacementGroupConfigList;
  }
  export type ClusterId = string;
  export type ClusterState = "STARTING"|"BOOTSTRAPPING"|"RUNNING"|"WAITING"|"TERMINATING"|"TERMINATED"|"TERMINATED_WITH_ERRORS"|string;
  export interface ClusterStateChangeReason {
    /**
     * The programmatic code for the state change reason.
     */
    Code?: ClusterStateChangeReasonCode;
    /**
     * The descriptive message for the state change reason.
     */
    Message?: String;
  }
  export type ClusterStateChangeReasonCode = "INTERNAL_ERROR"|"VALIDATION_ERROR"|"INSTANCE_FAILURE"|"INSTANCE_FLEET_TIMEOUT"|"BOOTSTRAP_FAILURE"|"USER_REQUEST"|"STEP_FAILURE"|"ALL_STEPS_COMPLETED"|string;
  export type ClusterStateList = ClusterState[];
  export interface ClusterStatus {
    /**
     * The current state of the cluster.
     */
    State?: ClusterState;
    /**
     * The reason for the cluster status change.
     */
    StateChangeReason?: ClusterStateChangeReason;
    /**
     * A timeline that represents the status of a cluster over the lifetime of the cluster.
     */
    Timeline?: ClusterTimeline;
  }
  export interface ClusterSummary {
    /**
     * The unique identifier for the cluster.
     */
    Id?: ClusterId;
    /**
     * The name of the cluster.
     */
    Name?: String;
    /**
     * The details about the current status of the cluster.
     */
    Status?: ClusterStatus;
    /**
     * An approximation of the cost of the cluster, represented in m1.small/hours. This value is incremented one time for every hour an m1.small instance runs. Larger instances are weighted more, so an EC2 instance that is roughly four times more expensive would result in the normalized instance hours being incremented by four. This result is only an approximation and does not reflect the actual billing rate.
     */
    NormalizedInstanceHours?: Integer;
    /**
     * The Amazon Resource Name of the cluster.
     */
    ClusterArn?: ArnType;
    /**
     *  The Amazon Resource Name (ARN) of the Outpost where the cluster is launched. 
     */
    OutpostArn?: OptionalArnType;
  }
  export type ClusterSummaryList = ClusterSummary[];
  export interface ClusterTimeline {
    /**
     * The creation date and time of the cluster.
     */
    CreationDateTime?: _Date;
    /**
     * The date and time when the cluster was ready to run steps.
     */
    ReadyDateTime?: _Date;
    /**
     * The date and time when the cluster was terminated.
     */
    EndDateTime?: _Date;
  }
  export interface Command {
    /**
     * The name of the command.
     */
    Name?: String;
    /**
     * The Amazon S3 location of the command script.
     */
    ScriptPath?: String;
    /**
     * Arguments for Amazon EMR to pass to the command for execution.
     */
    Args?: StringList;
  }
  export type CommandList = Command[];
  export type ComparisonOperator = "GREATER_THAN_OR_EQUAL"|"GREATER_THAN"|"LESS_THAN"|"LESS_THAN_OR_EQUAL"|string;
  export interface ComputeLimits {
    /**
     *  The unit type used for specifying a managed scaling policy. 
     */
    UnitType: ComputeLimitsUnitType;
    /**
     *  The lower boundary of EC2 units. It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. Managed scaling activities are not allowed beyond this boundary. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration. 
     */
    MinimumCapacityUnits: Integer;
    /**
     *  The upper boundary of EC2 units. It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. Managed scaling activities are not allowed beyond this boundary. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration. 
     */
    MaximumCapacityUnits: Integer;
    /**
     *  The upper boundary of On-Demand EC2 units. It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. The On-Demand units are not allowed to scale beyond this boundary. The parameter is used to split capacity allocation between On-Demand and Spot Instances. 
     */
    MaximumOnDemandCapacityUnits?: Integer;
    /**
     *  The upper boundary of EC2 units for core node type in a cluster. It is measured through vCPU cores or instances for instance groups and measured through units for instance fleets. The core units are not allowed to scale beyond this boundary. The parameter is used to split capacity allocation between core and task nodes. 
     */
    MaximumCoreCapacityUnits?: Integer;
  }
  export type ComputeLimitsUnitType = "InstanceFleetUnits"|"Instances"|"VCPU"|string;
  export interface Configuration {
    /**
     * The classification within a configuration.
     */
    Classification?: String;
    /**
     * A list of additional configurations to apply within a configuration object.
     */
    Configurations?: ConfigurationList;
    /**
     * A set of properties specified within a configuration classification.
     */
    Properties?: StringMap;
  }
  export type ConfigurationList = Configuration[];
  export interface CreateSecurityConfigurationInput {
    /**
     * The name of the security configuration.
     */
    Name: XmlString;
    /**
     * The security configuration details in JSON format. For JSON parameters and examples, see Use Security Configurations to Set Up Cluster Security in the Amazon EMR Management Guide.
     */
    SecurityConfiguration: String;
  }
  export interface CreateSecurityConfigurationOutput {
    /**
     * The name of the security configuration.
     */
    Name: XmlString;
    /**
     * The date and time the security configuration was created.
     */
    CreationDateTime: _Date;
  }
  export interface CreateStudioInput {
    /**
     * A descriptive name for the Amazon EMR Studio.
     */
    Name: XmlStringMaxLen256;
    /**
     * A detailed description of the Amazon EMR Studio.
     */
    Description?: XmlStringMaxLen256;
    /**
     * Specifies whether the Studio authenticates users using IAM or Amazon Web Services SSO.
     */
    AuthMode: AuthMode;
    /**
     * The ID of the Amazon Virtual Private Cloud (Amazon VPC) to associate with the Studio.
     */
    VpcId: XmlStringMaxLen256;
    /**
     * A list of subnet IDs to associate with the Amazon EMR Studio. A Studio can have a maximum of 5 subnets. The subnets must belong to the VPC specified by VpcId. Studio users can create a Workspace in any of the specified subnets.
     */
    SubnetIds: SubnetIdList;
    /**
     * The IAM role that the Amazon EMR Studio assumes. The service role provides a way for Amazon EMR Studio to interoperate with other Amazon Web Services services.
     */
    ServiceRole: XmlString;
    /**
     * The IAM user role that users and groups assume when logged in to an Amazon EMR Studio. Only specify a UserRole when you use Amazon Web Services SSO authentication. The permissions attached to the UserRole can be scoped down for each user or group using session policies.
     */
    UserRole?: XmlString;
    /**
     * The ID of the Amazon EMR Studio Workspace security group. The Workspace security group allows outbound network traffic to resources in the Engine security group, and it must be in the same VPC specified by VpcId.
     */
    WorkspaceSecurityGroupId: XmlStringMaxLen256;
    /**
     * The ID of the Amazon EMR Studio Engine security group. The Engine security group allows inbound network traffic from the Workspace security group, and it must be in the same VPC specified by VpcId.
     */
    EngineSecurityGroupId: XmlStringMaxLen256;
    /**
     * The Amazon S3 location to back up Amazon EMR Studio Workspaces and notebook files.
     */
    DefaultS3Location: XmlString;
    /**
     * The authentication endpoint of your identity provider (IdP). Specify this value when you use IAM authentication and want to let federated users log in to a Studio with the Studio URL and credentials from your IdP. Amazon EMR Studio redirects users to this endpoint to enter credentials.
     */
    IdpAuthUrl?: XmlString;
    /**
     * The name that your identity provider (IdP) uses for its RelayState parameter. For example, RelayState or TargetSource. Specify this value when you use IAM authentication and want to let federated users log in to a Studio using the Studio URL. The RelayState parameter differs by IdP.
     */
    IdpRelayStateParameterName?: XmlStringMaxLen256;
    /**
     * A list of tags to associate with the Amazon EMR Studio. Tags are user-defined key-value pairs that consist of a required key string with a maximum of 128 characters, and an optional value string with a maximum of 256 characters.
     */
    Tags?: TagList;
  }
  export interface CreateStudioOutput {
    /**
     * The ID of the Amazon EMR Studio.
     */
    StudioId?: XmlStringMaxLen256;
    /**
     * The unique Studio access URL.
     */
    Url?: XmlString;
  }
  export interface CreateStudioSessionMappingInput {
    /**
     * The ID of the Amazon EMR Studio to which the user or group will be mapped.
     */
    StudioId: XmlStringMaxLen256;
    /**
     * The globally unique identifier (GUID) of the user or group from the Amazon Web Services SSO Identity Store. For more information, see UserId and GroupId in the Amazon Web Services SSO Identity Store API Reference. Either IdentityName or IdentityId must be specified, but not both.
     */
    IdentityId?: XmlStringMaxLen256;
    /**
     * The name of the user or group. For more information, see UserName and DisplayName in the Amazon Web Services SSO Identity Store API Reference. Either IdentityName or IdentityId must be specified, but not both.
     */
    IdentityName?: XmlStringMaxLen256;
    /**
     * Specifies whether the identity to map to the Amazon EMR Studio is a user or a group.
     */
    IdentityType: IdentityType;
    /**
     * The Amazon Resource Name (ARN) for the session policy that will be applied to the user or group. You should specify the ARN for the session policy that you want to apply, not the ARN of your user role. For more information, see Create an EMR Studio User Role with Session Policies.
     */
    SessionPolicyArn: XmlStringMaxLen256;
  }
  export type _Date = Date;
  export interface DeleteSecurityConfigurationInput {
    /**
     * The name of the security configuration.
     */
    Name: XmlString;
  }
  export interface DeleteSecurityConfigurationOutput {
  }
  export interface DeleteStudioInput {
    /**
     * The ID of the Amazon EMR Studio.
     */
    StudioId: XmlStringMaxLen256;
  }
  export interface DeleteStudioSessionMappingInput {
    /**
     * The ID of the Amazon EMR Studio.
     */
    StudioId: XmlStringMaxLen256;
    /**
     * The globally unique identifier (GUID) of the user or group to remove from the Amazon EMR Studio. For more information, see UserId and GroupId in the Amazon Web Services SSO Identity Store API Reference. Either IdentityName or IdentityId must be specified.
     */
    IdentityId?: XmlStringMaxLen256;
    /**
     * The name of the user name or group to remove from the Amazon EMR Studio. For more information, see UserName and DisplayName in the Amazon Web Services SSO Store API Reference. Either IdentityName or IdentityId must be specified.
     */
    IdentityName?: XmlStringMaxLen256;
    /**
     * Specifies whether the identity to delete from the Amazon EMR Studio is a user or a group.
     */
    IdentityType: IdentityType;
  }
  export interface DescribeClusterInput {
    /**
     * The identifier of the cluster to describe.
     */
    ClusterId: ClusterId;
  }
  export interface DescribeClusterOutput {
    /**
     * This output contains the details for the requested cluster.
     */
    Cluster?: Cluster;
  }
  export interface DescribeJobFlowsInput {
    /**
     * Return only job flows created after this date and time.
     */
    CreatedAfter?: _Date;
    /**
     * Return only job flows created before this date and time.
     */
    CreatedBefore?: _Date;
    /**
     * Return only job flows whose job flow ID is contained in this list.
     */
    JobFlowIds?: XmlStringList;
    /**
     * Return only job flows whose state is contained in this list.
     */
    JobFlowStates?: JobFlowExecutionStateList;
  }
  export interface DescribeJobFlowsOutput {
    /**
     * A list of job flows matching the parameters supplied.
     */
    JobFlows?: JobFlowDetailList;
  }
  export interface DescribeNotebookExecutionInput {
    /**
     * The unique identifier of the notebook execution.
     */
    NotebookExecutionId: XmlStringMaxLen256;
  }
  export interface DescribeNotebookExecutionOutput {
    /**
     * Properties of the notebook execution.
     */
    NotebookExecution?: NotebookExecution;
  }
  export interface DescribeReleaseLabelInput {
    /**
     * The target release label to be described.
     */
    ReleaseLabel?: String;
    /**
     * The pagination token. Reserved for future use. Currently set to null.
     */
    NextToken?: String;
    /**
     * Reserved for future use. Currently set to null.
     */
    MaxResults?: MaxResultsNumber;
  }
  export interface DescribeReleaseLabelOutput {
    /**
     * The target release label described in the response.
     */
    ReleaseLabel?: String;
    /**
     * The list of applications available for the target release label. Name is the name of the application. Version is the concise version of the application.
     */
    Applications?: SimplifiedApplicationList;
    /**
     * The pagination token. Reserved for future use. Currently set to null.
     */
    NextToken?: String;
  }
  export interface DescribeSecurityConfigurationInput {
    /**
     * The name of the security configuration.
     */
    Name: XmlString;
  }
  export interface DescribeSecurityConfigurationOutput {
    /**
     * The name of the security configuration.
     */
    Name?: XmlString;
    /**
     * The security configuration details in JSON format.
     */
    SecurityConfiguration?: String;
    /**
     * The date and time the security configuration was created
     */
    CreationDateTime?: _Date;
  }
  export interface DescribeStepInput {
    /**
     * The identifier of the cluster with steps to describe.
     */
    ClusterId: ClusterId;
    /**
     * The identifier of the step to describe.
     */
    StepId: StepId;
  }
  export interface DescribeStepOutput {
    /**
     * The step details for the requested step identifier.
     */
    Step?: Step;
  }
  export interface DescribeStudioInput {
    /**
     * The Amazon EMR Studio ID.
     */
    StudioId: XmlStringMaxLen256;
  }
  export interface DescribeStudioOutput {
    /**
     * The Amazon EMR Studio details.
     */
    Studio?: Studio;
  }
  export type EC2InstanceIdsList = InstanceId[];
  export type EC2InstanceIdsToTerminateList = InstanceId[];
  export interface EbsBlockDevice {
    /**
     * EBS volume specifications such as volume type, IOPS, and size (GiB) that will be requested for the EBS volume attached to an EC2 instance in the cluster.
     */
    VolumeSpecification?: VolumeSpecification;
    /**
     * The device name that is exposed to the instance, such as /dev/sdh.
     */
    Device?: String;
  }
  export interface EbsBlockDeviceConfig {
    /**
     * EBS volume specifications such as volume type, IOPS, and size (GiB) that will be requested for the EBS volume attached to an EC2 instance in the cluster.
     */
    VolumeSpecification: VolumeSpecification;
    /**
     * Number of EBS volumes with a specific volume configuration that will be associated with every instance in the instance group
     */
    VolumesPerInstance?: Integer;
  }
  export type EbsBlockDeviceConfigList = EbsBlockDeviceConfig[];
  export type EbsBlockDeviceList = EbsBlockDevice[];
  export interface EbsConfiguration {
    /**
     * An array of Amazon EBS volume specifications attached to a cluster instance.
     */
    EbsBlockDeviceConfigs?: EbsBlockDeviceConfigList;
    /**
     * Indicates whether an Amazon EBS volume is EBS-optimized.
     */
    EbsOptimized?: BooleanObject;
  }
  export interface EbsVolume {
    /**
     * The device name that is exposed to the instance, such as /dev/sdh.
     */
    Device?: String;
    /**
     * The volume identifier of the EBS volume.
     */
    VolumeId?: String;
  }
  export type EbsVolumeList = EbsVolume[];
  export interface Ec2InstanceAttributes {
    /**
     * The name of the Amazon EC2 key pair to use when connecting with SSH into the master node as a user named "hadoop".
     */
    Ec2KeyName?: String;
    /**
     * Set this parameter to the identifier of the Amazon VPC subnet where you want the cluster to launch. If you do not specify this value, and your account supports EC2-Classic, the cluster launches in EC2-Classic.
     */
    Ec2SubnetId?: String;
    /**
     * Applies to clusters configured with the instance fleets option. Specifies the unique identifier of one or more Amazon EC2 subnets in which to launch EC2 cluster instances. Subnets must exist within the same VPC. Amazon EMR chooses the EC2 subnet with the best fit from among the list of RequestedEc2SubnetIds, and then launches all cluster instances within that Subnet. If this value is not specified, and the account and Region support EC2-Classic networks, the cluster launches instances in the EC2-Classic network and uses RequestedEc2AvailabilityZones instead of this setting. If EC2-Classic is not supported, and no Subnet is specified, Amazon EMR chooses the subnet for you. RequestedEc2SubnetIDs and RequestedEc2AvailabilityZones cannot be specified together.
     */
    RequestedEc2SubnetIds?: XmlStringMaxLen256List;
    /**
     * The Availability Zone in which the cluster will run. 
     */
    Ec2AvailabilityZone?: String;
    /**
     * Applies to clusters configured with the instance fleets option. Specifies one or more Availability Zones in which to launch EC2 cluster instances when the EC2-Classic network configuration is supported. Amazon EMR chooses the Availability Zone with the best fit from among the list of RequestedEc2AvailabilityZones, and then launches all cluster instances within that Availability Zone. If you do not specify this value, Amazon EMR chooses the Availability Zone for you. RequestedEc2SubnetIDs and RequestedEc2AvailabilityZones cannot be specified together.
     */
    RequestedEc2AvailabilityZones?: XmlStringMaxLen256List;
    /**
     * The IAM role that was specified when the cluster was launched. The EC2 instances of the cluster assume this role.
     */
    IamInstanceProfile?: String;
    /**
     * The identifier of the Amazon EC2 security group for the master node.
     */
    EmrManagedMasterSecurityGroup?: String;
    /**
     * The identifier of the Amazon EC2 security group for the core and task nodes.
     */
    EmrManagedSlaveSecurityGroup?: String;
    /**
     * The identifier of the Amazon EC2 security group for the Amazon EMR service to access clusters in VPC private subnets.
     */
    ServiceAccessSecurityGroup?: String;
    /**
     * A list of additional Amazon EC2 security group IDs for the master node.
     */
    AdditionalMasterSecurityGroups?: StringList;
    /**
     * A list of additional Amazon EC2 security group IDs for the core and task nodes.
     */
    AdditionalSlaveSecurityGroups?: StringList;
  }
  export interface ExecutionEngineConfig {
    /**
     * The unique identifier of the execution engine. For an EMR cluster, this is the cluster ID.
     */
    Id: XmlStringMaxLen256;
    /**
     * The type of execution engine. A value of EMR specifies an EMR cluster.
     */
    Type?: ExecutionEngineType;
    /**
     * An optional unique ID of an EC2 security group to associate with the master instance of the EMR cluster for this notebook execution. For more information see Specifying EC2 Security Groups for EMR Notebooks in the EMR Management Guide.
     */
    MasterInstanceSecurityGroupId?: XmlStringMaxLen256;
  }
  export type ExecutionEngineType = "EMR"|string;
  export interface FailureDetails {
    /**
     * The reason for the step failure. In the case where the service cannot successfully determine the root cause of the failure, it returns "Unknown Error" as a reason.
     */
    Reason?: String;
    /**
     * The descriptive message including the error the Amazon EMR service has identified as the cause of step failure. This is text from an error log that describes the root cause of the failure.
     */
    Message?: String;
    /**
     * The path to the log file where the step failure root cause was originally recorded.
     */
    LogFile?: String;
  }
  export interface GetAutoTerminationPolicyInput {
    /**
     * Specifies the ID of the Amazon EMR cluster for which the auto-termination policy will be fetched.
     */
    ClusterId: ClusterId;
  }
  export interface GetAutoTerminationPolicyOutput {
    /**
     * Specifies the auto-termination policy that is attached to an Amazon EMR cluster. 
     */
    AutoTerminationPolicy?: AutoTerminationPolicy;
  }
  export interface GetBlockPublicAccessConfigurationInput {
  }
  export interface GetBlockPublicAccessConfigurationOutput {
    /**
     * A configuration for Amazon EMR block public access. The configuration applies to all clusters created in your account for the current Region. The configuration specifies whether block public access is enabled. If block public access is enabled, security groups associated with the cluster cannot have rules that allow inbound traffic from 0.0.0.0/0 or ::/0 on a port, unless the port is specified as an exception using PermittedPublicSecurityGroupRuleRanges in the BlockPublicAccessConfiguration. By default, Port 22 (SSH) is an exception, and public access is allowed on this port. You can change this by updating the block public access configuration to remove the exception.  For accounts that created clusters in a Region before November 25, 2019, block public access is disabled by default in that Region. To use this feature, you must manually enable and configure it. For accounts that did not create an EMR cluster in a Region before this date, block public access is enabled by default in that Region. 
     */
    BlockPublicAccessConfiguration: BlockPublicAccessConfiguration;
    /**
     * Properties that describe the Amazon Web Services principal that created the BlockPublicAccessConfiguration using the PutBlockPublicAccessConfiguration action as well as the date and time that the configuration was created. Each time a configuration for block public access is updated, Amazon EMR updates this metadata.
     */
    BlockPublicAccessConfigurationMetadata: BlockPublicAccessConfigurationMetadata;
  }
  export interface GetManagedScalingPolicyInput {
    /**
     * Specifies the ID of the cluster for which the managed scaling policy will be fetched. 
     */
    ClusterId: ClusterId;
  }
  export interface GetManagedScalingPolicyOutput {
    /**
     * Specifies the managed scaling policy that is attached to an Amazon EMR cluster. 
     */
    ManagedScalingPolicy?: ManagedScalingPolicy;
  }
  export interface GetStudioSessionMappingInput {
    /**
     * The ID of the Amazon EMR Studio.
     */
    StudioId: XmlStringMaxLen256;
    /**
     * The globally unique identifier (GUID) of the user or group. For more information, see UserId and GroupId in the Amazon Web Services SSO Identity Store API Reference. Either IdentityName or IdentityId must be specified.
     */
    IdentityId?: XmlStringMaxLen256;
    /**
     * The name of the user or group to fetch. For more information, see UserName and DisplayName in the Amazon Web Services SSO Identity Store API Reference. Either IdentityName or IdentityId must be specified.
     */
    IdentityName?: XmlStringMaxLen256;
    /**
     * Specifies whether the identity to fetch is a user or a group.
     */
    IdentityType: IdentityType;
  }
  export interface GetStudioSessionMappingOutput {
    /**
     * The session mapping details for the specified Amazon EMR Studio and identity, including session policy ARN and creation time.
     */
    SessionMapping?: SessionMappingDetail;
  }
  export interface HadoopJarStepConfig {
    /**
     * A list of Java properties that are set when the step runs. You can use these properties to pass key-value pairs to your main function.
     */
    Properties?: KeyValueList;
    /**
     * A path to a JAR file run during the step.
     */
    Jar: XmlString;
    /**
     * The name of the main class in the specified Java file. If not specified, the JAR file should specify a Main-Class in its manifest file.
     */
    MainClass?: XmlString;
    /**
     * A list of command line arguments passed to the JAR file's main function when executed.
     */
    Args?: XmlStringList;
  }
  export interface HadoopStepConfig {
    /**
     * The path to the JAR file that runs during the step.
     */
    Jar?: String;
    /**
     * The list of Java properties that are set when the step runs. You can use these properties to pass key-value pairs to your main function.
     */
    Properties?: StringMap;
    /**
     * The name of the main class in the specified Java file. If not specified, the JAR file should specify a main class in its manifest file.
     */
    MainClass?: String;
    /**
     * The list of command line arguments to pass to the JAR file's main function for execution.
     */
    Args?: StringList;
  }
  export type IdentityType = "USER"|"GROUP"|string;
  export interface Instance {
    /**
     * The unique identifier for the instance in Amazon EMR.
     */
    Id?: InstanceId;
    /**
     * The unique identifier of the instance in Amazon EC2.
     */
    Ec2InstanceId?: InstanceId;
    /**
     * The public DNS name of the instance.
     */
    PublicDnsName?: String;
    /**
     * The public IP address of the instance.
     */
    PublicIpAddress?: String;
    /**
     * The private DNS name of the instance.
     */
    PrivateDnsName?: String;
    /**
     * The private IP address of the instance.
     */
    PrivateIpAddress?: String;
    /**
     * The current status of the instance.
     */
    Status?: InstanceStatus;
    /**
     * The identifier of the instance group to which this instance belongs.
     */
    InstanceGroupId?: String;
    /**
     * The unique identifier of the instance fleet to which an EC2 instance belongs.
     */
    InstanceFleetId?: InstanceFleetId;
    /**
     * The instance purchasing option. Valid values are ON_DEMAND or SPOT. 
     */
    Market?: MarketType;
    /**
     * The EC2 instance type, for example m3.xlarge.
     */
    InstanceType?: InstanceType;
    /**
     * The list of Amazon EBS volumes that are attached to this instance.
     */
    EbsVolumes?: EbsVolumeList;
  }
  export type InstanceCollectionType = "INSTANCE_FLEET"|"INSTANCE_GROUP"|string;
  export interface InstanceFleet {
    /**
     * The unique identifier of the instance fleet.
     */
    Id?: InstanceFleetId;
    /**
     * A friendly name for the instance fleet.
     */
    Name?: XmlStringMaxLen256;
    /**
     * The current status of the instance fleet. 
     */
    Status?: InstanceFleetStatus;
    /**
     * The node type that the instance fleet hosts. Valid values are MASTER, CORE, or TASK. 
     */
    InstanceFleetType?: InstanceFleetType;
    /**
     * The target capacity of On-Demand units for the instance fleet, which determines how many On-Demand Instances to provision. When the instance fleet launches, Amazon EMR tries to provision On-Demand Instances as specified by InstanceTypeConfig. Each instance configuration has a specified WeightedCapacity. When an On-Demand Instance is provisioned, the WeightedCapacity units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a WeightedCapacity of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units. You can use InstanceFleet$ProvisionedOnDemandCapacity to determine the Spot capacity units that have been provisioned for the instance fleet.  If not specified or set to 0, only Spot Instances are provisioned for the instance fleet using TargetSpotCapacity. At least one of TargetSpotCapacity and TargetOnDemandCapacity should be greater than 0. For a master instance fleet, only one of TargetSpotCapacity and TargetOnDemandCapacity can be specified, and its value must be 1. 
     */
    TargetOnDemandCapacity?: WholeNumber;
    /**
     * The target capacity of Spot units for the instance fleet, which determines how many Spot Instances to provision. When the instance fleet launches, Amazon EMR tries to provision Spot Instances as specified by InstanceTypeConfig. Each instance configuration has a specified WeightedCapacity. When a Spot instance is provisioned, the WeightedCapacity units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a WeightedCapacity of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units. You can use InstanceFleet$ProvisionedSpotCapacity to determine the Spot capacity units that have been provisioned for the instance fleet.  If not specified or set to 0, only On-Demand Instances are provisioned for the instance fleet. At least one of TargetSpotCapacity and TargetOnDemandCapacity should be greater than 0. For a master instance fleet, only one of TargetSpotCapacity and TargetOnDemandCapacity can be specified, and its value must be 1. 
     */
    TargetSpotCapacity?: WholeNumber;
    /**
     * The number of On-Demand units that have been provisioned for the instance fleet to fulfill TargetOnDemandCapacity. This provisioned capacity might be less than or greater than TargetOnDemandCapacity.
     */
    ProvisionedOnDemandCapacity?: WholeNumber;
    /**
     * The number of Spot units that have been provisioned for this instance fleet to fulfill TargetSpotCapacity. This provisioned capacity might be less than or greater than TargetSpotCapacity.
     */
    ProvisionedSpotCapacity?: WholeNumber;
    /**
     * An array of specifications for the instance types that comprise an instance fleet.
     */
    InstanceTypeSpecifications?: InstanceTypeSpecificationList;
    /**
     * Describes the launch specification for an instance fleet. 
     */
    LaunchSpecifications?: InstanceFleetProvisioningSpecifications;
  }
  export interface InstanceFleetConfig {
    /**
     * The friendly name of the instance fleet.
     */
    Name?: XmlStringMaxLen256;
    /**
     * The node type that the instance fleet hosts. Valid values are MASTER, CORE, and TASK.
     */
    InstanceFleetType: InstanceFleetType;
    /**
     * The target capacity of On-Demand units for the instance fleet, which determines how many On-Demand Instances to provision. When the instance fleet launches, Amazon EMR tries to provision On-Demand Instances as specified by InstanceTypeConfig. Each instance configuration has a specified WeightedCapacity. When an On-Demand Instance is provisioned, the WeightedCapacity units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a WeightedCapacity of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.  If not specified or set to 0, only Spot Instances are provisioned for the instance fleet using TargetSpotCapacity. At least one of TargetSpotCapacity and TargetOnDemandCapacity should be greater than 0. For a master instance fleet, only one of TargetSpotCapacity and TargetOnDemandCapacity can be specified, and its value must be 1. 
     */
    TargetOnDemandCapacity?: WholeNumber;
    /**
     * The target capacity of Spot units for the instance fleet, which determines how many Spot Instances to provision. When the instance fleet launches, Amazon EMR tries to provision Spot Instances as specified by InstanceTypeConfig. Each instance configuration has a specified WeightedCapacity. When a Spot Instance is provisioned, the WeightedCapacity units count toward the target capacity. Amazon EMR provisions instances until the target capacity is totally fulfilled, even if this results in an overage. For example, if there are 2 units remaining to fulfill capacity, and Amazon EMR can only provision an instance with a WeightedCapacity of 5 units, the instance is provisioned, and the target capacity is exceeded by 3 units.  If not specified or set to 0, only On-Demand Instances are provisioned for the instance fleet. At least one of TargetSpotCapacity and TargetOnDemandCapacity should be greater than 0. For a master instance fleet, only one of TargetSpotCapacity and TargetOnDemandCapacity can be specified, and its value must be 1. 
     */
    TargetSpotCapacity?: WholeNumber;
    /**
     * The instance type configurations that define the EC2 instances in the instance fleet.
     */
    InstanceTypeConfigs?: InstanceTypeConfigList;
    /**
     * The launch specification for the instance fleet.
     */
    LaunchSpecifications?: InstanceFleetProvisioningSpecifications;
  }
  export type InstanceFleetConfigList = InstanceFleetConfig[];
  export type InstanceFleetId = string;
  export type InstanceFleetList = InstanceFleet[];
  export interface InstanceFleetModifyConfig {
    /**
     * A unique identifier for the instance fleet.
     */
    InstanceFleetId: InstanceFleetId;
    /**
     * The target capacity of On-Demand units for the instance fleet. For more information see InstanceFleetConfig$TargetOnDemandCapacity.
     */
    TargetOnDemandCapacity?: WholeNumber;
    /**
     * The target capacity of Spot units for the instance fleet. For more information, see InstanceFleetConfig$TargetSpotCapacity.
     */
    TargetSpotCapacity?: WholeNumber;
  }
  export interface InstanceFleetProvisioningSpecifications {
    /**
     * The launch specification for Spot Instances in the fleet, which determines the defined duration, provisioning timeout behavior, and allocation strategy.
     */
    SpotSpecification?: SpotProvisioningSpecification;
    /**
     *  The launch specification for On-Demand Instances in the instance fleet, which determines the allocation strategy.   The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. On-Demand Instances allocation strategy is available in Amazon EMR version 5.12.1 and later. 
     */
    OnDemandSpecification?: OnDemandProvisioningSpecification;
  }
  export type InstanceFleetState = "PROVISIONING"|"BOOTSTRAPPING"|"RUNNING"|"RESIZING"|"SUSPENDED"|"TERMINATING"|"TERMINATED"|string;
  export interface InstanceFleetStateChangeReason {
    /**
     * A code corresponding to the reason the state change occurred.
     */
    Code?: InstanceFleetStateChangeReasonCode;
    /**
     * An explanatory message.
     */
    Message?: String;
  }
  export type InstanceFleetStateChangeReasonCode = "INTERNAL_ERROR"|"VALIDATION_ERROR"|"INSTANCE_FAILURE"|"CLUSTER_TERMINATED"|string;
  export interface InstanceFleetStatus {
    /**
     * A code representing the instance fleet status.    PROVISIONING—The instance fleet is provisioning EC2 resources and is not yet ready to run jobs.    BOOTSTRAPPING—EC2 instances and other resources have been provisioned and the bootstrap actions specified for the instances are underway.    RUNNING—EC2 instances and other resources are running. They are either executing jobs or waiting to execute jobs.    RESIZING—A resize operation is underway. EC2 instances are either being added or removed.    SUSPENDED—A resize operation could not complete. Existing EC2 instances are running, but instances can't be added or removed.    TERMINATING—The instance fleet is terminating EC2 instances.    TERMINATED—The instance fleet is no longer active, and all EC2 instances have been terminated.  
     */
    State?: InstanceFleetState;
    /**
     * Provides status change reason details for the instance fleet.
     */
    StateChangeReason?: InstanceFleetStateChangeReason;
    /**
     * Provides historical timestamps for the instance fleet, including the time of creation, the time it became ready to run jobs, and the time of termination.
     */
    Timeline?: InstanceFleetTimeline;
  }
  export interface InstanceFleetTimeline {
    /**
     * The time and date the instance fleet was created.
     */
    CreationDateTime?: _Date;
    /**
     * The time and date the instance fleet was ready to run jobs.
     */
    ReadyDateTime?: _Date;
    /**
     * The time and date the instance fleet terminated.
     */
    EndDateTime?: _Date;
  }
  export type InstanceFleetType = "MASTER"|"CORE"|"TASK"|string;
  export interface InstanceGroup {
    /**
     * The identifier of the instance group.
     */
    Id?: InstanceGroupId;
    /**
     * The name of the instance group.
     */
    Name?: String;
    /**
     * The marketplace to provision instances for this group. Valid values are ON_DEMAND or SPOT.
     */
    Market?: MarketType;
    /**
     * The type of the instance group. Valid values are MASTER, CORE or TASK.
     */
    InstanceGroupType?: InstanceGroupType;
    /**
     * If specified, indicates that the instance group uses Spot Instances. This is the maximum price you are willing to pay for Spot Instances. Specify OnDemandPrice to set the amount equal to the On-Demand price, or specify an amount in USD.
     */
    BidPrice?: String;
    /**
     * The EC2 instance type for all instances in the instance group.
     */
    InstanceType?: InstanceType;
    /**
     * The target number of instances for the instance group.
     */
    RequestedInstanceCount?: Integer;
    /**
     * The number of instances currently running in this instance group.
     */
    RunningInstanceCount?: Integer;
    /**
     * The current status of the instance group.
     */
    Status?: InstanceGroupStatus;
    /**
     *  Amazon EMR releases 4.x or later.  The list of configurations supplied for an Amazon EMR cluster instance group. You can specify a separate configuration for each instance group (master, core, and task).
     */
    Configurations?: ConfigurationList;
    /**
     * The version number of the requested configuration specification for this instance group.
     */
    ConfigurationsVersion?: Long;
    /**
     * A list of configurations that were successfully applied for an instance group last time.
     */
    LastSuccessfullyAppliedConfigurations?: ConfigurationList;
    /**
     * The version number of a configuration specification that was successfully applied for an instance group last time. 
     */
    LastSuccessfullyAppliedConfigurationsVersion?: Long;
    /**
     * The EBS block devices that are mapped to this instance group.
     */
    EbsBlockDevices?: EbsBlockDeviceList;
    /**
     * If the instance group is EBS-optimized. An Amazon EBS-optimized instance uses an optimized configuration stack and provides additional, dedicated capacity for Amazon EBS I/O.
     */
    EbsOptimized?: BooleanObject;
    /**
     * Policy for customizing shrink operations.
     */
    ShrinkPolicy?: ShrinkPolicy;
    /**
     * An automatic scaling policy for a core instance group or task instance group in an Amazon EMR cluster. The automatic scaling policy defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric. See PutAutoScalingPolicy.
     */
    AutoScalingPolicy?: AutoScalingPolicyDescription;
    /**
     * The custom AMI ID to use for the provisioned instance group.
     */
    CustomAmiId?: XmlStringMaxLen256;
  }
  export interface InstanceGroupConfig {
    /**
     * Friendly name given to the instance group.
     */
    Name?: XmlStringMaxLen256;
    /**
     * Market type of the EC2 instances used to create a cluster node.
     */
    Market?: MarketType;
    /**
     * The role of the instance group in the cluster.
     */
    InstanceRole: InstanceRoleType;
    /**
     * If specified, indicates that the instance group uses Spot Instances. This is the maximum price you are willing to pay for Spot Instances. Specify OnDemandPrice to set the amount equal to the On-Demand price, or specify an amount in USD.
     */
    BidPrice?: XmlStringMaxLen256;
    /**
     * The EC2 instance type for all instances in the instance group.
     */
    InstanceType: InstanceType;
    /**
     * Target number of instances for the instance group.
     */
    InstanceCount: Integer;
    /**
     *  Amazon EMR releases 4.x or later.  The list of configurations supplied for an EMR cluster instance group. You can specify a separate configuration for each instance group (master, core, and task).
     */
    Configurations?: ConfigurationList;
    /**
     * EBS configurations that will be attached to each EC2 instance in the instance group.
     */
    EbsConfiguration?: EbsConfiguration;
    /**
     * An automatic scaling policy for a core instance group or task instance group in an Amazon EMR cluster. The automatic scaling policy defines how an instance group dynamically adds and terminates EC2 instances in response to the value of a CloudWatch metric. See PutAutoScalingPolicy.
     */
    AutoScalingPolicy?: AutoScalingPolicy;
    /**
     * The custom AMI ID to use for the provisioned instance group.
     */
    CustomAmiId?: XmlStringMaxLen256;
  }
  export type InstanceGroupConfigList = InstanceGroupConfig[];
  export interface InstanceGroupDetail {
    /**
     * Unique identifier for the instance group.
     */
    InstanceGroupId?: XmlStringMaxLen256;
    /**
     * Friendly name for the instance group.
     */
    Name?: XmlStringMaxLen256;
    /**
     * Market type of the EC2 instances used to create a cluster node.
     */
    Market: MarketType;
    /**
     * Instance group role in the cluster
     */
    InstanceRole: InstanceRoleType;
    /**
     * If specified, indicates that the instance group uses Spot Instances. This is the maximum price you are willing to pay for Spot Instances. Specify OnDemandPrice to set the amount equal to the On-Demand price, or specify an amount in USD.
     */
    BidPrice?: XmlStringMaxLen256;
    /**
     * EC2 instance type.
     */
    InstanceType: InstanceType;
    /**
     * Target number of instances to run in the instance group.
     */
    InstanceRequestCount: Integer;
    /**
     * Actual count of running instances.
     */
    InstanceRunningCount: Integer;
    /**
     * State of instance group. The following values are deprecated: STARTING, TERMINATED, and FAILED.
     */
    State: InstanceGroupState;
    /**
     * Details regarding the state of the instance group.
     */
    LastStateChangeReason?: XmlString;
    /**
     * The date/time the instance group was created.
     */
    CreationDateTime: _Date;
    /**
     * The date/time the instance group was started.
     */
    StartDateTime?: _Date;
    /**
     * The date/time the instance group was available to the cluster.
     */
    ReadyDateTime?: _Date;
    /**
     * The date/time the instance group was terminated.
     */
    EndDateTime?: _Date;
    /**
     * The custom AMI ID to use for the provisioned instance group.
     */
    CustomAmiId?: XmlStringMaxLen256;
  }
  export type InstanceGroupDetailList = InstanceGroupDetail[];
  export type InstanceGroupId = string;
  export type InstanceGroupIdsList = XmlStringMaxLen256[];
  export type InstanceGroupList = InstanceGroup[];
  export interface InstanceGroupModifyConfig {
    /**
     * Unique ID of the instance group to modify.
     */
    InstanceGroupId: XmlStringMaxLen256;
    /**
     * Target size for the instance group.
     */
    InstanceCount?: Integer;
    /**
     * The EC2 InstanceIds to terminate. After you terminate the instances, the instance group will not return to its original requested size.
     */
    EC2InstanceIdsToTerminate?: EC2InstanceIdsToTerminateList;
    /**
     * Policy for customizing shrink operations.
     */
    ShrinkPolicy?: ShrinkPolicy;
    /**
     * A list of new or modified configurations to apply for an instance group.
     */
    Configurations?: ConfigurationList;
  }
  export type InstanceGroupModifyConfigList = InstanceGroupModifyConfig[];
  export type InstanceGroupState = "PROVISIONING"|"BOOTSTRAPPING"|"RUNNING"|"RECONFIGURING"|"RESIZING"|"SUSPENDED"|"TERMINATING"|"TERMINATED"|"ARRESTED"|"SHUTTING_DOWN"|"ENDED"|string;
  export interface InstanceGroupStateChangeReason {
    /**
     * The programmable code for the state change reason.
     */
    Code?: InstanceGroupStateChangeReasonCode;
    /**
     * The status change reason description.
     */
    Message?: String;
  }
  export type InstanceGroupStateChangeReasonCode = "INTERNAL_ERROR"|"VALIDATION_ERROR"|"INSTANCE_FAILURE"|"CLUSTER_TERMINATED"|string;
  export interface InstanceGroupStatus {
    /**
     * The current state of the instance group.
     */
    State?: InstanceGroupState;
    /**
     * The status change reason details for the instance group.
     */
    StateChangeReason?: InstanceGroupStateChangeReason;
    /**
     * The timeline of the instance group status over time.
     */
    Timeline?: InstanceGroupTimeline;
  }
  export interface InstanceGroupTimeline {
    /**
     * The creation date and time of the instance group.
     */
    CreationDateTime?: _Date;
    /**
     * The date and time when the instance group became ready to perform tasks.
     */
    ReadyDateTime?: _Date;
    /**
     * The date and time when the instance group terminated.
     */
    EndDateTime?: _Date;
  }
  export type InstanceGroupType = "MASTER"|"CORE"|"TASK"|string;
  export type InstanceGroupTypeList = InstanceGroupType[];
  export type InstanceId = string;
  export type InstanceList = Instance[];
  export interface InstanceResizePolicy {
    /**
     * Specific list of instances to be terminated when shrinking an instance group.
     */
    InstancesToTerminate?: EC2InstanceIdsList;
    /**
     * Specific list of instances to be protected when shrinking an instance group.
     */
    InstancesToProtect?: EC2InstanceIdsList;
    /**
     * Decommissioning timeout override for the specific list of instances to be terminated.
     */
    InstanceTerminationTimeout?: Integer;
  }
  export type InstanceRoleType = "MASTER"|"CORE"|"TASK"|string;
  export type InstanceState = "AWAITING_FULFILLMENT"|"PROVISIONING"|"BOOTSTRAPPING"|"RUNNING"|"TERMINATED"|string;
  export interface InstanceStateChangeReason {
    /**
     * The programmable code for the state change reason.
     */
    Code?: InstanceStateChangeReasonCode;
    /**
     * The status change reason description.
     */
    Message?: String;
  }
  export type InstanceStateChangeReasonCode = "INTERNAL_ERROR"|"VALIDATION_ERROR"|"INSTANCE_FAILURE"|"BOOTSTRAP_FAILURE"|"CLUSTER_TERMINATED"|string;
  export type InstanceStateList = InstanceState[];
  export interface InstanceStatus {
    /**
     * The current state of the instance.
     */
    State?: InstanceState;
    /**
     * The details of the status change reason for the instance.
     */
    StateChangeReason?: InstanceStateChangeReason;
    /**
     * The timeline of the instance status over time.
     */
    Timeline?: InstanceTimeline;
  }
  export interface InstanceTimeline {
    /**
     * The creation date and time of the instance.
     */
    CreationDateTime?: _Date;
    /**
     * The date and time when the instance was ready to perform tasks.
     */
    ReadyDateTime?: _Date;
    /**
     * The date and time when the instance was terminated.
     */
    EndDateTime?: _Date;
  }
  export type InstanceType = string;
  export interface InstanceTypeConfig {
    /**
     * An EC2 instance type, such as m3.xlarge. 
     */
    InstanceType: InstanceType;
    /**
     * The number of units that a provisioned instance of this type provides toward fulfilling the target capacities defined in InstanceFleetConfig. This value is 1 for a master instance fleet, and must be 1 or greater for core and task instance fleets. Defaults to 1 if not specified. 
     */
    WeightedCapacity?: WholeNumber;
    /**
     * The bid price for each EC2 Spot Instance type as defined by InstanceType. Expressed in USD. If neither BidPrice nor BidPriceAsPercentageOfOnDemandPrice is provided, BidPriceAsPercentageOfOnDemandPrice defaults to 100%. 
     */
    BidPrice?: XmlStringMaxLen256;
    /**
     * The bid price, as a percentage of On-Demand price, for each EC2 Spot Instance as defined by InstanceType. Expressed as a number (for example, 20 specifies 20%). If neither BidPrice nor BidPriceAsPercentageOfOnDemandPrice is provided, BidPriceAsPercentageOfOnDemandPrice defaults to 100%.
     */
    BidPriceAsPercentageOfOnDemandPrice?: NonNegativeDouble;
    /**
     * The configuration of Amazon Elastic Block Store (Amazon EBS) attached to each instance as defined by InstanceType. 
     */
    EbsConfiguration?: EbsConfiguration;
    /**
     * A configuration classification that applies when provisioning cluster instances, which can include configurations for applications and software that run on the cluster.
     */
    Configurations?: ConfigurationList;
    /**
     * The custom AMI ID to use for the instance type.
     */
    CustomAmiId?: XmlStringMaxLen256;
  }
  export type InstanceTypeConfigList = InstanceTypeConfig[];
  export interface InstanceTypeSpecification {
    /**
     * The EC2 instance type, for example m3.xlarge.
     */
    InstanceType?: InstanceType;
    /**
     * The number of units that a provisioned instance of this type provides toward fulfilling the target capacities defined in InstanceFleetConfig. Capacity values represent performance characteristics such as vCPUs, memory, or I/O. If not specified, the default value is 1.
     */
    WeightedCapacity?: WholeNumber;
    /**
     * The bid price for each EC2 Spot Instance type as defined by InstanceType. Expressed in USD.
     */
    BidPrice?: XmlStringMaxLen256;
    /**
     * The bid price, as a percentage of On-Demand price, for each EC2 Spot Instance as defined by InstanceType. Expressed as a number (for example, 20 specifies 20%).
     */
    BidPriceAsPercentageOfOnDemandPrice?: NonNegativeDouble;
    /**
     * A configuration classification that applies when provisioning cluster instances, which can include configurations for applications and software bundled with Amazon EMR.
     */
    Configurations?: ConfigurationList;
    /**
     * The configuration of Amazon Elastic Block Store (Amazon EBS) attached to each instance as defined by InstanceType.
     */
    EbsBlockDevices?: EbsBlockDeviceList;
    /**
     * Evaluates to TRUE when the specified InstanceType is EBS-optimized.
     */
    EbsOptimized?: BooleanObject;
    /**
     * The custom AMI ID to use for the instance type.
     */
    CustomAmiId?: XmlStringMaxLen256;
  }
  export type InstanceTypeSpecificationList = InstanceTypeSpecification[];
  export type Integer = number;
  export interface JobFlowDetail {
    /**
     * The job flow identifier.
     */
    JobFlowId: XmlStringMaxLen256;
    /**
     * The name of the job flow.
     */
    Name: XmlStringMaxLen256;
    /**
     * The location in Amazon S3 where log files for the job are stored.
     */
    LogUri?: XmlString;
    /**
     * The KMS key used for encrypting log files. This attribute is only available with EMR version 5.30.0 and later, excluding EMR 6.0.0.
     */
    LogEncryptionKmsKeyId?: XmlString;
    /**
     * Applies only to Amazon EMR AMI versions 3.x and 2.x. For Amazon EMR releases 4.0 and later, ReleaseLabel is used. To specify a custom AMI, use CustomAmiID.
     */
    AmiVersion?: XmlStringMaxLen256;
    /**
     * Describes the execution status of the job flow.
     */
    ExecutionStatusDetail: JobFlowExecutionStatusDetail;
    /**
     * Describes the Amazon EC2 instances of the job flow.
     */
    Instances: JobFlowInstancesDetail;
    /**
     * A list of steps run by the job flow.
     */
    Steps?: StepDetailList;
    /**
     * A list of the bootstrap actions run by the job flow.
     */
    BootstrapActions?: BootstrapActionDetailList;
    /**
     * A list of strings set by third-party software when the job flow is launched. If you are not using third-party software to manage the job flow, this value is empty.
     */
    SupportedProducts?: SupportedProductsList;
    /**
     * Indicates whether the cluster is visible to IAM principals in the Amazon Web Services account associated with the cluster. When true, IAM principals in the Amazon Web Services account can perform EMR cluster actions that their IAM policies allow. When false, only the IAM principal that created the cluster and the Amazon Web Services account root user can perform EMR actions, regardless of IAM permissions policies attached to other IAM principals. The default value is true if a value is not provided when creating a cluster using the EMR API RunJobFlow command, the CLI create-cluster command, or the Amazon Web Services Management Console. IAM principals that are authorized to perform actions on the cluster can use the SetVisibleToAllUsers action to change the value on a running cluster. For more information, see Understanding the EMR Cluster VisibleToAllUsers Setting in the Amazon EMRManagement Guide.
     */
    VisibleToAllUsers?: Boolean;
    /**
     * The IAM role that was specified when the job flow was launched. The EC2 instances of the job flow assume this role.
     */
    JobFlowRole?: XmlString;
    /**
     * The IAM role that is assumed by the Amazon EMR service to access Amazon Web Services resources on your behalf.
     */
    ServiceRole?: XmlString;
    /**
     * An IAM role for automatic scaling policies. The default role is EMR_AutoScaling_DefaultRole. The IAM role provides a way for the automatic scaling feature to get the required permissions it needs to launch and terminate EC2 instances in an instance group.
     */
    AutoScalingRole?: XmlString;
    /**
     * The way that individual Amazon EC2 instances terminate when an automatic scale-in activity occurs or an instance group is resized. TERMINATE_AT_INSTANCE_HOUR indicates that Amazon EMR terminates nodes at the instance-hour boundary, regardless of when the request to terminate the instance was submitted. This option is only available with Amazon EMR 5.1.0 and later and is the default for clusters created using that version. TERMINATE_AT_TASK_COMPLETION indicates that Amazon EMR adds nodes to a deny list and drains tasks from nodes before terminating the Amazon EC2 instances, regardless of the instance-hour boundary. With either behavior, Amazon EMR removes the least active nodes first and blocks instance termination if it could lead to HDFS corruption. TERMINATE_AT_TASK_COMPLETION available only in Amazon EMR version 4.1.0 and later, and is the default for versions of Amazon EMR earlier than 5.1.0.
     */
    ScaleDownBehavior?: ScaleDownBehavior;
  }
  export type JobFlowDetailList = JobFlowDetail[];
  export type JobFlowExecutionState = "STARTING"|"BOOTSTRAPPING"|"RUNNING"|"WAITING"|"SHUTTING_DOWN"|"TERMINATED"|"COMPLETED"|"FAILED"|string;
  export type JobFlowExecutionStateList = JobFlowExecutionState[];
  export interface JobFlowExecutionStatusDetail {
    /**
     * The state of the job flow.
     */
    State: JobFlowExecutionState;
    /**
     * The creation date and time of the job flow.
     */
    CreationDateTime: _Date;
    /**
     * The start date and time of the job flow.
     */
    StartDateTime?: _Date;
    /**
     * The date and time when the job flow was ready to start running bootstrap actions.
     */
    ReadyDateTime?: _Date;
    /**
     * The completion date and time of the job flow.
     */
    EndDateTime?: _Date;
    /**
     * Description of the job flow last changed state.
     */
    LastStateChangeReason?: XmlString;
  }
  export interface JobFlowInstancesConfig {
    /**
     * The EC2 instance type of the master node.
     */
    MasterInstanceType?: InstanceType;
    /**
     * The EC2 instance type of the core and task nodes.
     */
    SlaveInstanceType?: InstanceType;
    /**
     * The number of EC2 instances in the cluster.
     */
    InstanceCount?: Integer;
    /**
     * Configuration for the instance groups in a cluster.
     */
    InstanceGroups?: InstanceGroupConfigList;
    /**
     *  The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions.  Describes the EC2 instances and instance configurations for clusters that use the instance fleet configuration.
     */
    InstanceFleets?: InstanceFleetConfigList;
    /**
     * The name of the EC2 key pair that can be used to connect to the master node using SSH as the user called "hadoop."
     */
    Ec2KeyName?: XmlStringMaxLen256;
    /**
     * The Availability Zone in which the cluster runs.
     */
    Placement?: PlacementType;
    /**
     * Specifies whether the cluster should remain available after completing all steps. Defaults to true. For more information about configuring cluster termination, see Control Cluster Termination in the EMR Management Guide.
     */
    KeepJobFlowAliveWhenNoSteps?: Boolean;
    /**
     * Specifies whether to lock the cluster to prevent the Amazon EC2 instances from being terminated by API call, user intervention, or in the event of a job-flow error.
     */
    TerminationProtected?: Boolean;
    /**
     * Applies only to Amazon EMR release versions earlier than 4.0. The Hadoop version for the cluster. Valid inputs are "0.18" (no longer maintained), "0.20" (no longer maintained), "0.20.205" (no longer maintained), "1.0.3", "2.2.0", or "2.4.0". If you do not set this value, the default of 0.18 is used, unless the AmiVersion parameter is set in the RunJobFlow call, in which case the default version of Hadoop for that AMI version is used.
     */
    HadoopVersion?: XmlStringMaxLen256;
    /**
     * Applies to clusters that use the uniform instance group configuration. To launch the cluster in Amazon Virtual Private Cloud (Amazon VPC), set this parameter to the identifier of the Amazon VPC subnet where you want the cluster to launch. If you do not specify this value and your account supports EC2-Classic, the cluster launches in EC2-Classic.
     */
    Ec2SubnetId?: XmlStringMaxLen256;
    /**
     * Applies to clusters that use the instance fleet configuration. When multiple EC2 subnet IDs are specified, Amazon EMR evaluates them and launches instances in the optimal subnet.  The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. 
     */
    Ec2SubnetIds?: XmlStringMaxLen256List;
    /**
     * The identifier of the Amazon EC2 security group for the master node. If you specify EmrManagedMasterSecurityGroup, you must also specify EmrManagedSlaveSecurityGroup.
     */
    EmrManagedMasterSecurityGroup?: XmlStringMaxLen256;
    /**
     * The identifier of the Amazon EC2 security group for the core and task nodes. If you specify EmrManagedSlaveSecurityGroup, you must also specify EmrManagedMasterSecurityGroup.
     */
    EmrManagedSlaveSecurityGroup?: XmlStringMaxLen256;
    /**
     * The identifier of the Amazon EC2 security group for the Amazon EMR service to access clusters in VPC private subnets.
     */
    ServiceAccessSecurityGroup?: XmlStringMaxLen256;
    /**
     * A list of additional Amazon EC2 security group IDs for the master node.
     */
    AdditionalMasterSecurityGroups?: SecurityGroupsList;
    /**
     * A list of additional Amazon EC2 security group IDs for the core and task nodes.
     */
    AdditionalSlaveSecurityGroups?: SecurityGroupsList;
  }
  export interface JobFlowInstancesDetail {
    /**
     * The Amazon EC2 master node instance type.
     */
    MasterInstanceType: InstanceType;
    /**
     * The DNS name of the master node. If the cluster is on a private subnet, this is the private DNS name. On a public subnet, this is the public DNS name.
     */
    MasterPublicDnsName?: XmlString;
    /**
     * The Amazon EC2 instance identifier of the master node.
     */
    MasterInstanceId?: XmlString;
    /**
     * The Amazon EC2 core and task node instance type.
     */
    SlaveInstanceType: InstanceType;
    /**
     * The number of Amazon EC2 instances in the cluster. If the value is 1, the same instance serves as both the master and core and task node. If the value is greater than 1, one instance is the master node and all others are core and task nodes.
     */
    InstanceCount: Integer;
    /**
     * Details about the instance groups in a cluster.
     */
    InstanceGroups?: InstanceGroupDetailList;
    /**
     * An approximation of the cost of the cluster, represented in m1.small/hours. This value is increased one time for every hour that an m1.small instance runs. Larger instances are weighted more heavily, so an Amazon EC2 instance that is roughly four times more expensive would result in the normalized instance hours being increased incrementally four times. This result is only an approximation and does not reflect the actual billing rate.
     */
    NormalizedInstanceHours?: Integer;
    /**
     * The name of an Amazon EC2 key pair that can be used to connect to the master node using SSH.
     */
    Ec2KeyName?: XmlStringMaxLen256;
    /**
     * For clusters launched within Amazon Virtual Private Cloud, this is the identifier of the subnet where the cluster was launched.
     */
    Ec2SubnetId?: XmlStringMaxLen256;
    /**
     * The Amazon EC2 Availability Zone for the cluster.
     */
    Placement?: PlacementType;
    /**
     * Specifies whether the cluster should remain available after completing all steps.
     */
    KeepJobFlowAliveWhenNoSteps?: Boolean;
    /**
     * Specifies whether the Amazon EC2 instances in the cluster are protected from termination by API calls, user intervention, or in the event of a job-flow error.
     */
    TerminationProtected?: Boolean;
    /**
     * The Hadoop version for the cluster.
     */
    HadoopVersion?: XmlStringMaxLen256;
  }
  export interface KerberosAttributes {
    /**
     * The name of the Kerberos realm to which all nodes in a cluster belong. For example, EC2.INTERNAL. 
     */
    Realm: XmlStringMaxLen256;
    /**
     * The password used within the cluster for the kadmin service on the cluster-dedicated KDC, which maintains Kerberos principals, password policies, and keytabs for the cluster.
     */
    KdcAdminPassword: XmlStringMaxLen256;
    /**
     * Required only when establishing a cross-realm trust with a KDC in a different realm. The cross-realm principal password, which must be identical across realms.
     */
    CrossRealmTrustPrincipalPassword?: XmlStringMaxLen256;
    /**
     * Required only when establishing a cross-realm trust with an Active Directory domain. A user with sufficient privileges to join resources to the domain.
     */
    ADDomainJoinUser?: XmlStringMaxLen256;
    /**
     * The Active Directory password for ADDomainJoinUser.
     */
    ADDomainJoinPassword?: XmlStringMaxLen256;
  }
  export interface KeyValue {
    /**
     * The unique identifier of a key-value pair.
     */
    Key?: XmlString;
    /**
     * The value part of the identified key.
     */
    Value?: XmlString;
  }
  export type KeyValueList = KeyValue[];
  export interface ListBootstrapActionsInput {
    /**
     * The cluster identifier for the bootstrap actions to list.
     */
    ClusterId: ClusterId;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListBootstrapActionsOutput {
    /**
     * The bootstrap actions associated with the cluster.
     */
    BootstrapActions?: CommandList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListClustersInput {
    /**
     * The creation date and time beginning value filter for listing clusters.
     */
    CreatedAfter?: _Date;
    /**
     * The creation date and time end value filter for listing clusters.
     */
    CreatedBefore?: _Date;
    /**
     * The cluster state filters to apply when listing clusters. Clusters that change state while this action runs may be not be returned as expected in the list of clusters.
     */
    ClusterStates?: ClusterStateList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListClustersOutput {
    /**
     * The list of clusters for the account based on the given filters.
     */
    Clusters?: ClusterSummaryList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListInstanceFleetsInput {
    /**
     * The unique identifier of the cluster.
     */
    ClusterId: ClusterId;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListInstanceFleetsOutput {
    /**
     * The list of instance fleets for the cluster and given filters.
     */
    InstanceFleets?: InstanceFleetList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListInstanceGroupsInput {
    /**
     * The identifier of the cluster for which to list the instance groups.
     */
    ClusterId: ClusterId;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListInstanceGroupsOutput {
    /**
     * The list of instance groups for the cluster and given filters.
     */
    InstanceGroups?: InstanceGroupList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListInstancesInput {
    /**
     * The identifier of the cluster for which to list the instances.
     */
    ClusterId: ClusterId;
    /**
     * The identifier of the instance group for which to list the instances.
     */
    InstanceGroupId?: InstanceGroupId;
    /**
     * The type of instance group for which to list the instances.
     */
    InstanceGroupTypes?: InstanceGroupTypeList;
    /**
     * The unique identifier of the instance fleet.
     */
    InstanceFleetId?: InstanceFleetId;
    /**
     * The node type of the instance fleet. For example MASTER, CORE, or TASK.
     */
    InstanceFleetType?: InstanceFleetType;
    /**
     * A list of instance states that will filter the instances returned with this request.
     */
    InstanceStates?: InstanceStateList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListInstancesOutput {
    /**
     * The list of instances for the cluster and given filters.
     */
    Instances?: InstanceList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListNotebookExecutionsInput {
    /**
     * The unique ID of the editor associated with the notebook execution.
     */
    EditorId?: XmlStringMaxLen256;
    /**
     * The status filter for listing notebook executions.    START_PENDING indicates that the cluster has received the execution request but execution has not begun.    STARTING indicates that the execution is starting on the cluster.    RUNNING indicates that the execution is being processed by the cluster.    FINISHING indicates that execution processing is in the final stages.    FINISHED indicates that the execution has completed without error.    FAILING indicates that the execution is failing and will not finish successfully.    FAILED indicates that the execution failed.    STOP_PENDING indicates that the cluster has received a StopNotebookExecution request and the stop is pending.    STOPPING indicates that the cluster is in the process of stopping the execution as a result of a StopNotebookExecution request.    STOPPED indicates that the execution stopped because of a StopNotebookExecution request.  
     */
    Status?: NotebookExecutionStatus;
    /**
     * The beginning of time range filter for listing notebook executions. The default is the timestamp of 30 days ago.
     */
    From?: _Date;
    /**
     * The end of time range filter for listing notebook executions. The default is the current timestamp.
     */
    To?: _Date;
    /**
     * The pagination token, returned by a previous ListNotebookExecutions call, that indicates the start of the list for this ListNotebookExecutions call.
     */
    Marker?: Marker;
  }
  export interface ListNotebookExecutionsOutput {
    /**
     * A list of notebook executions.
     */
    NotebookExecutions?: NotebookExecutionSummaryList;
    /**
     * A pagination token that a subsequent ListNotebookExecutions can use to determine the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListReleaseLabelsInput {
    /**
     * Filters the results of the request. Prefix specifies the prefix of release labels to return. Application specifies the application (with/without version) of release labels to return.
     */
    Filters?: ReleaseLabelFilter;
    /**
     * Specifies the next page of results. If NextToken is not specified, which is usually the case for the first request of ListReleaseLabels, the first page of results are determined by other filtering parameters or by the latest version. The ListReleaseLabels request fails if the identity (Amazon Web Services account ID) and all filtering parameters are different from the original request, or if the NextToken is expired or tampered with.
     */
    NextToken?: String;
    /**
     * Defines the maximum number of release labels to return in a single response. The default is 100.
     */
    MaxResults?: MaxResultsNumber;
  }
  export interface ListReleaseLabelsOutput {
    /**
     * The returned release labels.
     */
    ReleaseLabels?: StringList;
    /**
     * Used to paginate the next page of results if specified in the next ListReleaseLabels request.
     */
    NextToken?: String;
  }
  export interface ListSecurityConfigurationsInput {
    /**
     * The pagination token that indicates the set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListSecurityConfigurationsOutput {
    /**
     * The creation date and time, and name, of each security configuration.
     */
    SecurityConfigurations?: SecurityConfigurationList;
    /**
     * A pagination token that indicates the next set of results to retrieve. Include the marker in the next ListSecurityConfiguration call to retrieve the next page of results, if required.
     */
    Marker?: Marker;
  }
  export interface ListStepsInput {
    /**
     * The identifier of the cluster for which to list the steps.
     */
    ClusterId: ClusterId;
    /**
     * The filter to limit the step list based on certain states.
     */
    StepStates?: StepStateList;
    /**
     * The filter to limit the step list based on the identifier of the steps. You can specify a maximum of ten Step IDs. The character constraint applies to the overall length of the array.
     */
    StepIds?: XmlStringList;
    /**
     * The maximum number of steps that a single ListSteps action returns is 50. To return a longer list of steps, use multiple ListSteps actions along with the Marker parameter, which is a pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListStepsOutput {
    /**
     * The filtered list of steps for the cluster.
     */
    Steps?: StepSummaryList;
    /**
     * The maximum number of steps that a single ListSteps action returns is 50. To return a longer list of steps, use multiple ListSteps actions along with the Marker parameter, which is a pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListStudioSessionMappingsInput {
    /**
     * The ID of the Amazon EMR Studio.
     */
    StudioId?: XmlStringMaxLen256;
    /**
     * Specifies whether to return session mappings for users or groups. If not specified, the results include session mapping details for both users and groups.
     */
    IdentityType?: IdentityType;
    /**
     * The pagination token that indicates the set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListStudioSessionMappingsOutput {
    /**
     * A list of session mapping summary objects. Each object includes session mapping details such as creation time, identity type (user or group), and Amazon EMR Studio ID.
     */
    SessionMappings?: SessionMappingSummaryList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListStudiosInput {
    /**
     * The pagination token that indicates the set of results to retrieve.
     */
    Marker?: Marker;
  }
  export interface ListStudiosOutput {
    /**
     * The list of Studio summary objects.
     */
    Studios?: StudioSummaryList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    Marker?: Marker;
  }
  export type Long = number;
  export interface ManagedScalingPolicy {
    /**
     * The EC2 unit limits for a managed scaling policy. The managed scaling activity of a cluster is not allowed to go above or below these limits. The limit only applies to the core and task nodes. The master node cannot be scaled after initial configuration.
     */
    ComputeLimits?: ComputeLimits;
  }
  export type Marker = string;
  export type MarketType = "ON_DEMAND"|"SPOT"|string;
  export type MaxResultsNumber = number;
  export interface MetricDimension {
    /**
     * The dimension name.
     */
    Key?: String;
    /**
     * The dimension value.
     */
    Value?: String;
  }
  export type MetricDimensionList = MetricDimension[];
  export interface ModifyClusterInput {
    /**
     * The unique identifier of the cluster.
     */
    ClusterId: String;
    /**
     * The number of steps that can be executed concurrently. You can specify a minimum of 1 step and a maximum of 256 steps. We recommend that you do not change this parameter while steps are running or the ActionOnFailure setting may not behave as expected. For more information see Step$ActionOnFailure.
     */
    StepConcurrencyLevel?: Integer;
  }
  export interface ModifyClusterOutput {
    /**
     * The number of steps that can be executed concurrently.
     */
    StepConcurrencyLevel?: Integer;
  }
  export interface ModifyInstanceFleetInput {
    /**
     * The unique identifier of the cluster.
     */
    ClusterId: ClusterId;
    /**
     * The configuration parameters of the instance fleet.
     */
    InstanceFleet: InstanceFleetModifyConfig;
  }
  export interface ModifyInstanceGroupsInput {
    /**
     * The ID of the cluster to which the instance group belongs.
     */
    ClusterId?: ClusterId;
    /**
     * Instance groups to change.
     */
    InstanceGroups?: InstanceGroupModifyConfigList;
  }
  export type NewSupportedProductsList = SupportedProductConfig[];
  export type NonNegativeDouble = number;
  export interface NotebookExecution {
    /**
     * The unique identifier of a notebook execution.
     */
    NotebookExecutionId?: XmlStringMaxLen256;
    /**
     * The unique identifier of the EMR Notebook that is used for the notebook execution.
     */
    EditorId?: XmlStringMaxLen256;
    /**
     * The execution engine, such as an EMR cluster, used to run the EMR notebook and perform the notebook execution.
     */
    ExecutionEngine?: ExecutionEngineConfig;
    /**
     * A name for the notebook execution.
     */
    NotebookExecutionName?: XmlStringMaxLen256;
    /**
     * Input parameters in JSON format passed to the EMR Notebook at runtime for execution.
     */
    NotebookParams?: XmlString;
    /**
     * The status of the notebook execution.    START_PENDING indicates that the cluster has received the execution request but execution has not begun.    STARTING indicates that the execution is starting on the cluster.    RUNNING indicates that the execution is being processed by the cluster.    FINISHING indicates that execution processing is in the final stages.    FINISHED indicates that the execution has completed without error.    FAILING indicates that the execution is failing and will not finish successfully.    FAILED indicates that the execution failed.    STOP_PENDING indicates that the cluster has received a StopNotebookExecution request and the stop is pending.    STOPPING indicates that the cluster is in the process of stopping the execution as a result of a StopNotebookExecution request.    STOPPED indicates that the execution stopped because of a StopNotebookExecution request.  
     */
    Status?: NotebookExecutionStatus;
    /**
     * The timestamp when notebook execution started.
     */
    StartTime?: _Date;
    /**
     * The timestamp when notebook execution ended.
     */
    EndTime?: _Date;
    /**
     * The Amazon Resource Name (ARN) of the notebook execution.
     */
    Arn?: XmlStringMaxLen256;
    /**
     * The location of the notebook execution's output file in Amazon S3.
     */
    OutputNotebookURI?: XmlString;
    /**
     * The reason for the latest status change of the notebook execution.
     */
    LastStateChangeReason?: XmlString;
    /**
     * The unique identifier of the EC2 security group associated with the EMR Notebook instance. For more information see Specifying EC2 Security Groups for EMR Notebooks in the EMR Management Guide.
     */
    NotebookInstanceSecurityGroupId?: XmlStringMaxLen256;
    /**
     * A list of tags associated with a notebook execution. Tags are user-defined key-value pairs that consist of a required key string with a maximum of 128 characters and an optional value string with a maximum of 256 characters.
     */
    Tags?: TagList;
  }
  export type NotebookExecutionStatus = "START_PENDING"|"STARTING"|"RUNNING"|"FINISHING"|"FINISHED"|"FAILING"|"FAILED"|"STOP_PENDING"|"STOPPING"|"STOPPED"|string;
  export interface NotebookExecutionSummary {
    /**
     * The unique identifier of the notebook execution.
     */
    NotebookExecutionId?: XmlStringMaxLen256;
    /**
     * The unique identifier of the editor associated with the notebook execution.
     */
    EditorId?: XmlStringMaxLen256;
    /**
     * The name of the notebook execution.
     */
    NotebookExecutionName?: XmlStringMaxLen256;
    /**
     * The status of the notebook execution.    START_PENDING indicates that the cluster has received the execution request but execution has not begun.    STARTING indicates that the execution is starting on the cluster.    RUNNING indicates that the execution is being processed by the cluster.    FINISHING indicates that execution processing is in the final stages.    FINISHED indicates that the execution has completed without error.    FAILING indicates that the execution is failing and will not finish successfully.    FAILED indicates that the execution failed.    STOP_PENDING indicates that the cluster has received a StopNotebookExecution request and the stop is pending.    STOPPING indicates that the cluster is in the process of stopping the execution as a result of a StopNotebookExecution request.    STOPPED indicates that the execution stopped because of a StopNotebookExecution request.  
     */
    Status?: NotebookExecutionStatus;
    /**
     * The timestamp when notebook execution started.
     */
    StartTime?: _Date;
    /**
     * The timestamp when notebook execution started.
     */
    EndTime?: _Date;
  }
  export type NotebookExecutionSummaryList = NotebookExecutionSummary[];
  export interface OnDemandCapacityReservationOptions {
    /**
     * Indicates whether to use unused Capacity Reservations for fulfilling On-Demand capacity. If you specify use-capacity-reservations-first, the fleet uses unused Capacity Reservations to fulfill On-Demand capacity up to the target On-Demand capacity. If multiple instance pools have unused Capacity Reservations, the On-Demand allocation strategy (lowest-price) is applied. If the number of unused Capacity Reservations is less than the On-Demand target capacity, the remaining On-Demand target capacity is launched according to the On-Demand allocation strategy (lowest-price). If you do not specify a value, the fleet fulfills the On-Demand capacity according to the chosen On-Demand allocation strategy.
     */
    UsageStrategy?: OnDemandCapacityReservationUsageStrategy;
    /**
     * Indicates the instance's Capacity Reservation preferences. Possible preferences include:    open - The instance can run in any open Capacity Reservation that has matching attributes (instance type, platform, Availability Zone).    none - The instance avoids running in a Capacity Reservation even if one is available. The instance runs as an On-Demand Instance.  
     */
    CapacityReservationPreference?: OnDemandCapacityReservationPreference;
    /**
     * The ARN of the Capacity Reservation resource group in which to run the instance.
     */
    CapacityReservationResourceGroupArn?: XmlStringMaxLen256;
  }
  export type OnDemandCapacityReservationPreference = "open"|"none"|string;
  export type OnDemandCapacityReservationUsageStrategy = "use-capacity-reservations-first"|string;
  export type OnDemandProvisioningAllocationStrategy = "lowest-price"|string;
  export interface OnDemandProvisioningSpecification {
    /**
     * Specifies the strategy to use in launching On-Demand instance fleets. Currently, the only option is lowest-price (the default), which launches the lowest price first.
     */
    AllocationStrategy: OnDemandProvisioningAllocationStrategy;
    /**
     * The launch specification for On-Demand instances in the instance fleet, which determines the allocation strategy.
     */
    CapacityReservationOptions?: OnDemandCapacityReservationOptions;
  }
  export type OptionalArnType = string;
  export interface PlacementGroupConfig {
    /**
     * Role of the instance in the cluster. Starting with Amazon EMR version 5.23.0, the only supported instance role is MASTER.
     */
    InstanceRole: InstanceRoleType;
    /**
     * EC2 Placement Group strategy associated with instance role. Starting with Amazon EMR version 5.23.0, the only supported placement strategy is SPREAD for the MASTER instance role.
     */
    PlacementStrategy?: PlacementGroupStrategy;
  }
  export type PlacementGroupConfigList = PlacementGroupConfig[];
  export type PlacementGroupStrategy = "SPREAD"|"PARTITION"|"CLUSTER"|"NONE"|string;
  export interface PlacementType {
    /**
     * The Amazon EC2 Availability Zone for the cluster. AvailabilityZone is used for uniform instance groups, while AvailabilityZones (plural) is used for instance fleets.
     */
    AvailabilityZone?: XmlString;
    /**
     * When multiple Availability Zones are specified, Amazon EMR evaluates them and launches instances in the optimal Availability Zone. AvailabilityZones is used for instance fleets, while AvailabilityZone (singular) is used for uniform instance groups.  The instance fleet configuration is available only in Amazon EMR versions 4.8.0 and later, excluding 5.0.x versions. 
     */
    AvailabilityZones?: XmlStringMaxLen256List;
  }
  export type Port = number;
  export interface PortRange {
    /**
     * The smallest port number in a specified range of port numbers.
     */
    MinRange: Port;
    /**
     * The smallest port number in a specified range of port numbers.
     */
    MaxRange?: Port;
  }
  export type PortRanges = PortRange[];
  export interface PutAutoScalingPolicyInput {
    /**
     * Specifies the ID of a cluster. The instance group to which the automatic scaling policy is applied is within this cluster.
     */
    ClusterId: ClusterId;
    /**
     * Specifies the ID of the instance group to which the automatic scaling policy is applied.
     */
    InstanceGroupId: InstanceGroupId;
    /**
     * Specifies the definition of the automatic scaling policy.
     */
    AutoScalingPolicy: AutoScalingPolicy;
  }
  export interface PutAutoScalingPolicyOutput {
    /**
     * Specifies the ID of a cluster. The instance group to which the automatic scaling policy is applied is within this cluster.
     */
    ClusterId?: ClusterId;
    /**
     * Specifies the ID of the instance group to which the scaling policy is applied.
     */
    InstanceGroupId?: InstanceGroupId;
    /**
     * The automatic scaling policy definition.
     */
    AutoScalingPolicy?: AutoScalingPolicyDescription;
    /**
     * The Amazon Resource Name (ARN) of the cluster.
     */
    ClusterArn?: ArnType;
  }
  export interface PutAutoTerminationPolicyInput {
    /**
     * Specifies the ID of the Amazon EMR cluster to which the auto-termination policy will be attached.
     */
    ClusterId: ClusterId;
    /**
     * Specifies the auto-termination policy to attach to the cluster.
     */
    AutoTerminationPolicy?: AutoTerminationPolicy;
  }
  export interface PutAutoTerminationPolicyOutput {
  }
  export interface PutBlockPublicAccessConfigurationInput {
    /**
     * A configuration for Amazon EMR block public access. The configuration applies to all clusters created in your account for the current Region. The configuration specifies whether block public access is enabled. If block public access is enabled, security groups associated with the cluster cannot have rules that allow inbound traffic from 0.0.0.0/0 or ::/0 on a port, unless the port is specified as an exception using PermittedPublicSecurityGroupRuleRanges in the BlockPublicAccessConfiguration. By default, Port 22 (SSH) is an exception, and public access is allowed on this port. You can change this by updating BlockPublicSecurityGroupRules to remove the exception.  For accounts that created clusters in a Region before November 25, 2019, block public access is disabled by default in that Region. To use this feature, you must manually enable and configure it. For accounts that did not create an EMR cluster in a Region before this date, block public access is enabled by default in that Region. 
     */
    BlockPublicAccessConfiguration: BlockPublicAccessConfiguration;
  }
  export interface PutBlockPublicAccessConfigurationOutput {
  }
  export interface PutManagedScalingPolicyInput {
    /**
     * Specifies the ID of an EMR cluster where the managed scaling policy is attached. 
     */
    ClusterId: ClusterId;
    /**
     * Specifies the constraints for the managed scaling policy. 
     */
    ManagedScalingPolicy: ManagedScalingPolicy;
  }
  export interface PutManagedScalingPolicyOutput {
  }
  export interface ReleaseLabelFilter {
    /**
     * Optional release label version prefix filter. For example, emr-5.
     */
    Prefix?: String;
    /**
     * Optional release label application filter. For example, spark@2.1.0.
     */
    Application?: String;
  }
  export interface RemoveAutoScalingPolicyInput {
    /**
     * Specifies the ID of a cluster. The instance group to which the automatic scaling policy is applied is within this cluster.
     */
    ClusterId: ClusterId;
    /**
     * Specifies the ID of the instance group to which the scaling policy is applied.
     */
    InstanceGroupId: InstanceGroupId;
  }
  export interface RemoveAutoScalingPolicyOutput {
  }
  export interface RemoveAutoTerminationPolicyInput {
    /**
     * Specifies the ID of the Amazon EMR cluster from which the auto-termination policy will be removed.
     */
    ClusterId: ClusterId;
  }
  export interface RemoveAutoTerminationPolicyOutput {
  }
  export interface RemoveManagedScalingPolicyInput {
    /**
     *  Specifies the ID of the cluster from which the managed scaling policy will be removed. 
     */
    ClusterId: ClusterId;
  }
  export interface RemoveManagedScalingPolicyOutput {
  }
  export interface RemoveTagsInput {
    /**
     * The Amazon EMR resource identifier from which tags will be removed. For example, a cluster identifier or an Amazon EMR Studio ID.
     */
    ResourceId: ResourceId;
    /**
     * A list of tag keys to remove from the resource.
     */
    TagKeys: StringList;
  }
  export interface RemoveTagsOutput {
  }
  export type RepoUpgradeOnBoot = "SECURITY"|"NONE"|string;
  export type ResourceId = string;
  export interface RunJobFlowInput {
    /**
     * The name of the job flow.
     */
    Name: XmlStringMaxLen256;
    /**
     * The location in Amazon S3 to write the log files of the job flow. If a value is not provided, logs are not created.
     */
    LogUri?: XmlString;
    /**
     * The KMS key used for encrypting log files. If a value is not provided, the logs remain encrypted by AES-256. This attribute is only available with Amazon EMR version 5.30.0 and later, excluding Amazon EMR 6.0.0.
     */
    LogEncryptionKmsKeyId?: XmlString;
    /**
     * A JSON string for selecting additional features.
     */
    AdditionalInfo?: XmlString;
    /**
     * Applies only to Amazon EMR AMI versions 3.x and 2.x. For Amazon EMR releases 4.0 and later, ReleaseLabel is used. To specify a custom AMI, use CustomAmiID.
     */
    AmiVersion?: XmlStringMaxLen256;
    /**
     * The Amazon EMR release label, which determines the version of open-source application packages installed on the cluster. Release labels are in the form emr-x.x.x, where x.x.x is an Amazon EMR release version such as emr-5.14.0. For more information about Amazon EMR release versions and included application versions and features, see https://docs.aws.amazon.com/emr/latest/ReleaseGuide/. The release label applies only to Amazon EMR releases version 4.0 and later. Earlier versions use AmiVersion.
     */
    ReleaseLabel?: XmlStringMaxLen256;
    /**
     * A specification of the number and type of Amazon EC2 instances.
     */
    Instances: JobFlowInstancesConfig;
    /**
     * A list of steps to run.
     */
    Steps?: StepConfigList;
    /**
     * A list of bootstrap actions to run before Hadoop starts on the cluster nodes.
     */
    BootstrapActions?: BootstrapActionConfigList;
    /**
     *  For Amazon EMR releases 3.x and 2.x. For Amazon EMR releases 4.x and later, use Applications.  A list of strings that indicates third-party software to use. For more information, see the Amazon EMR Developer Guide. Currently supported values are:   "mapr-m3" - launch the job flow using MapR M3 Edition.   "mapr-m5" - launch the job flow using MapR M5 Edition.  
     */
    SupportedProducts?: SupportedProductsList;
    /**
     *  For Amazon EMR releases 3.x and 2.x. For Amazon EMR releases 4.x and later, use Applications.  A list of strings that indicates third-party software to use with the job flow that accepts a user argument list. EMR accepts and forwards the argument list to the corresponding installation script as bootstrap action arguments. For more information, see "Launch a Job Flow on the MapR Distribution for Hadoop" in the Amazon EMR Developer Guide. Supported values are:   "mapr-m3" - launch the cluster using MapR M3 Edition.   "mapr-m5" - launch the cluster using MapR M5 Edition.   "mapr" with the user arguments specifying "--edition,m3" or "--edition,m5" - launch the job flow using MapR M3 or M5 Edition respectively.   "mapr-m7" - launch the cluster using MapR M7 Edition.   "hunk" - launch the cluster with the Hunk Big Data Analytics Platform.   "hue"- launch the cluster with Hue installed.   "spark" - launch the cluster with Apache Spark installed.   "ganglia" - launch the cluster with the Ganglia Monitoring System installed.  
     */
    NewSupportedProducts?: NewSupportedProductsList;
    /**
     * Applies to Amazon EMR releases 4.0 and later. A case-insensitive list of applications for Amazon EMR to install and configure when launching the cluster. For a list of applications available for each Amazon EMR release version, see the Amazon EMR Release Guide.
     */
    Applications?: ApplicationList;
    /**
     * For Amazon EMR releases 4.0 and later. The list of configurations supplied for the EMR cluster you are creating.
     */
    Configurations?: ConfigurationList;
    /**
     * Set this value to true so that IAM principals in the Amazon Web Services account associated with the cluster can perform EMR actions on the cluster that their IAM policies allow. This value defaults to true for clusters created using the EMR API or the CLI create-cluster command. When set to false, only the IAM principal that created the cluster and the Amazon Web Services account root user can perform EMR actions for the cluster, regardless of the IAM permissions policies attached to other IAM principals. For more information, see Understanding the EMR Cluster VisibleToAllUsers Setting in the Amazon EMRManagement Guide.
     */
    VisibleToAllUsers?: Boolean;
    /**
     * Also called instance profile and EC2 role. An IAM role for an EMR cluster. The EC2 instances of the cluster assume this role. The default role is EMR_EC2_DefaultRole. In order to use the default role, you must have already created it using the CLI or console.
     */
    JobFlowRole?: XmlString;
    /**
     * The IAM role that Amazon EMR assumes in order to access Amazon Web Services resources on your behalf.
     */
    ServiceRole?: XmlString;
    /**
     * A list of tags to associate with a cluster and propagate to Amazon EC2 instances.
     */
    Tags?: TagList;
    /**
     * The name of a security configuration to apply to the cluster.
     */
    SecurityConfiguration?: XmlString;
    /**
     * An IAM role for automatic scaling policies. The default role is EMR_AutoScaling_DefaultRole. The IAM role provides permissions that the automatic scaling feature requires to launch and terminate EC2 instances in an instance group.
     */
    AutoScalingRole?: XmlString;
    /**
     * Specifies the way that individual Amazon EC2 instances terminate when an automatic scale-in activity occurs or an instance group is resized. TERMINATE_AT_INSTANCE_HOUR indicates that Amazon EMR terminates nodes at the instance-hour boundary, regardless of when the request to terminate the instance was submitted. This option is only available with Amazon EMR 5.1.0 and later and is the default for clusters created using that version. TERMINATE_AT_TASK_COMPLETION indicates that Amazon EMR adds nodes to a deny list and drains tasks from nodes before terminating the Amazon EC2 instances, regardless of the instance-hour boundary. With either behavior, Amazon EMR removes the least active nodes first and blocks instance termination if it could lead to HDFS corruption. TERMINATE_AT_TASK_COMPLETION available only in Amazon EMR version 4.1.0 and later, and is the default for versions of Amazon EMR earlier than 5.1.0.
     */
    ScaleDownBehavior?: ScaleDownBehavior;
    /**
     * Available only in Amazon EMR version 5.7.0 and later. The ID of a custom Amazon EBS-backed Linux AMI. If specified, Amazon EMR uses this AMI when it launches cluster EC2 instances. For more information about custom AMIs in Amazon EMR, see Using a Custom AMI in the Amazon EMR Management Guide. If omitted, the cluster uses the base Linux AMI for the ReleaseLabel specified. For Amazon EMR versions 2.x and 3.x, use AmiVersion instead. For information about creating a custom AMI, see Creating an Amazon EBS-Backed Linux AMI in the Amazon Elastic Compute Cloud User Guide for Linux Instances. For information about finding an AMI ID, see Finding a Linux AMI. 
     */
    CustomAmiId?: XmlStringMaxLen256;
    /**
     * The size, in GiB, of the Amazon EBS root device volume of the Linux AMI that is used for each EC2 instance. Available in Amazon EMR version 4.x and later.
     */
    EbsRootVolumeSize?: Integer;
    /**
     * Applies only when CustomAmiID is used. Specifies which updates from the Amazon Linux AMI package repositories to apply automatically when the instance boots using the AMI. If omitted, the default is SECURITY, which indicates that only security updates are applied. If NONE is specified, no updates are applied, and all updates must be applied manually.
     */
    RepoUpgradeOnBoot?: RepoUpgradeOnBoot;
    /**
     * Attributes for Kerberos configuration when Kerberos authentication is enabled using a security configuration. For more information see Use Kerberos Authentication in the Amazon EMR Management Guide.
     */
    KerberosAttributes?: KerberosAttributes;
    /**
     * Specifies the number of steps that can be executed concurrently. The default value is 1. The maximum value is 256.
     */
    StepConcurrencyLevel?: Integer;
    /**
     *  The specified managed scaling policy for an Amazon EMR cluster. 
     */
    ManagedScalingPolicy?: ManagedScalingPolicy;
    /**
     * The specified placement group configuration for an Amazon EMR cluster.
     */
    PlacementGroupConfigs?: PlacementGroupConfigList;
    AutoTerminationPolicy?: AutoTerminationPolicy;
  }
  export interface RunJobFlowOutput {
    /**
     * A unique identifier for the job flow.
     */
    JobFlowId?: XmlStringMaxLen256;
    /**
     * The Amazon Resource Name (ARN) of the cluster.
     */
    ClusterArn?: ArnType;
  }
  export type ScaleDownBehavior = "TERMINATE_AT_INSTANCE_HOUR"|"TERMINATE_AT_TASK_COMPLETION"|string;
  export interface ScalingAction {
    /**
     * Not available for instance groups. Instance groups use the market type specified for the group.
     */
    Market?: MarketType;
    /**
     * The type of adjustment the automatic scaling activity makes when triggered, and the periodicity of the adjustment.
     */
    SimpleScalingPolicyConfiguration: SimpleScalingPolicyConfiguration;
  }
  export interface ScalingConstraints {
    /**
     * The lower boundary of EC2 instances in an instance group below which scaling activities are not allowed to shrink. Scale-in activities will not terminate instances below this boundary.
     */
    MinCapacity: Integer;
    /**
     * The upper boundary of EC2 instances in an instance group beyond which scaling activities are not allowed to grow. Scale-out activities will not add instances beyond this boundary.
     */
    MaxCapacity: Integer;
  }
  export interface ScalingRule {
    /**
     * The name used to identify an automatic scaling rule. Rule names must be unique within a scaling policy.
     */
    Name: String;
    /**
     * A friendly, more verbose description of the automatic scaling rule.
     */
    Description?: String;
    /**
     * The conditions that trigger an automatic scaling activity.
     */
    Action: ScalingAction;
    /**
     * The CloudWatch alarm definition that determines when automatic scaling activity is triggered.
     */
    Trigger: ScalingTrigger;
  }
  export type ScalingRuleList = ScalingRule[];
  export interface ScalingTrigger {
    /**
     * The definition of a CloudWatch metric alarm. When the defined alarm conditions are met along with other trigger parameters, scaling activity begins.
     */
    CloudWatchAlarmDefinition: CloudWatchAlarmDefinition;
  }
  export interface ScriptBootstrapActionConfig {
    /**
     * Location in Amazon S3 of the script to run during a bootstrap action.
     */
    Path: XmlString;
    /**
     * A list of command line arguments to pass to the bootstrap action script.
     */
    Args?: XmlStringList;
  }
  export type SecurityConfigurationList = SecurityConfigurationSummary[];
  export interface SecurityConfigurationSummary {
    /**
     * The name of the security configuration.
     */
    Name?: XmlString;
    /**
     * The date and time the security configuration was created.
     */
    CreationDateTime?: _Date;
  }
  export type SecurityGroupsList = XmlStringMaxLen256[];
  export interface SessionMappingDetail {
    /**
     * The ID of the Amazon EMR Studio.
     */
    StudioId?: XmlStringMaxLen256;
    /**
     * The globally unique identifier (GUID) of the user or group.
     */
    IdentityId?: XmlStringMaxLen256;
    /**
     * The name of the user or group. For more information, see UserName and DisplayName in the Amazon Web Services SSO Identity Store API Reference.
     */
    IdentityName?: XmlStringMaxLen256;
    /**
     * Specifies whether the identity mapped to the Amazon EMR Studio is a user or a group.
     */
    IdentityType?: IdentityType;
    /**
     * The Amazon Resource Name (ARN) of the session policy associated with the user or group.
     */
    SessionPolicyArn?: XmlStringMaxLen256;
    /**
     * The time the session mapping was created.
     */
    CreationTime?: _Date;
    /**
     * The time the session mapping was last modified.
     */
    LastModifiedTime?: _Date;
  }
  export interface SessionMappingSummary {
    /**
     * The ID of the Amazon EMR Studio.
     */
    StudioId?: XmlStringMaxLen256;
    /**
     * The globally unique identifier (GUID) of the user or group from the Amazon Web Services SSO Identity Store.
     */
    IdentityId?: XmlStringMaxLen256;
    /**
     * The name of the user or group. For more information, see UserName and DisplayName in the Amazon Web Services SSO Identity Store API Reference.
     */
    IdentityName?: XmlStringMaxLen256;
    /**
     * Specifies whether the identity mapped to the Amazon EMR Studio is a user or a group.
     */
    IdentityType?: IdentityType;
    /**
     * The Amazon Resource Name (ARN) of the session policy associated with the user or group.
     */
    SessionPolicyArn?: XmlStringMaxLen256;
    /**
     * The time the session mapping was created.
     */
    CreationTime?: _Date;
  }
  export type SessionMappingSummaryList = SessionMappingSummary[];
  export interface SetTerminationProtectionInput {
    /**
     *  A list of strings that uniquely identify the clusters to protect. This identifier is returned by RunJobFlow and can also be obtained from DescribeJobFlows . 
     */
    JobFlowIds: XmlStringList;
    /**
     * A Boolean that indicates whether to protect the cluster and prevent the Amazon EC2 instances in the cluster from shutting down due to API calls, user intervention, or job-flow error.
     */
    TerminationProtected: Boolean;
  }
  export interface SetVisibleToAllUsersInput {
    /**
     * The unique identifier of the job flow (cluster).
     */
    JobFlowIds: XmlStringList;
    /**
     * A value of true indicates that an IAM principal in the Amazon Web Services account can perform EMR actions on the cluster that the IAM policies attached to the principal allow. A value of false indicates that only the IAM principal that created the cluster and the Amazon Web Services root user can perform EMR actions on the cluster.
     */
    VisibleToAllUsers: Boolean;
  }
  export interface ShrinkPolicy {
    /**
     * The desired timeout for decommissioning an instance. Overrides the default YARN decommissioning timeout.
     */
    DecommissionTimeout?: Integer;
    /**
     * Custom policy for requesting termination protection or termination of specific instances when shrinking an instance group.
     */
    InstanceResizePolicy?: InstanceResizePolicy;
  }
  export interface SimpleScalingPolicyConfiguration {
    /**
     * The way in which EC2 instances are added (if ScalingAdjustment is a positive number) or terminated (if ScalingAdjustment is a negative number) each time the scaling activity is triggered. CHANGE_IN_CAPACITY is the default. CHANGE_IN_CAPACITY indicates that the EC2 instance count increments or decrements by ScalingAdjustment, which should be expressed as an integer. PERCENT_CHANGE_IN_CAPACITY indicates the instance count increments or decrements by the percentage specified by ScalingAdjustment, which should be expressed as an integer. For example, 20 indicates an increase in 20% increments of cluster capacity. EXACT_CAPACITY indicates the scaling activity results in an instance group with the number of EC2 instances specified by ScalingAdjustment, which should be expressed as a positive integer.
     */
    AdjustmentType?: AdjustmentType;
    /**
     * The amount by which to scale in or scale out, based on the specified AdjustmentType. A positive value adds to the instance group's EC2 instance count while a negative number removes instances. If AdjustmentType is set to EXACT_CAPACITY, the number should only be a positive integer. If AdjustmentType is set to PERCENT_CHANGE_IN_CAPACITY, the value should express the percentage as an integer. For example, -20 indicates a decrease in 20% increments of cluster capacity.
     */
    ScalingAdjustment: Integer;
    /**
     * The amount of time, in seconds, after a scaling activity completes before any further trigger-related scaling activities can start. The default value is 0.
     */
    CoolDown?: Integer;
  }
  export interface SimplifiedApplication {
    /**
     * The returned release label application name. For example, hadoop.
     */
    Name?: String;
    /**
     * The returned release label application version. For example, 3.2.1.
     */
    Version?: String;
  }
  export type SimplifiedApplicationList = SimplifiedApplication[];
  export type SpotProvisioningAllocationStrategy = "capacity-optimized"|string;
  export interface SpotProvisioningSpecification {
    /**
     * The spot provisioning timeout period in minutes. If Spot Instances are not provisioned within this time period, the TimeOutAction is taken. Minimum value is 5 and maximum value is 1440. The timeout applies only during initial provisioning, when the cluster is first created.
     */
    TimeoutDurationMinutes: WholeNumber;
    /**
     * The action to take when TargetSpotCapacity has not been fulfilled when the TimeoutDurationMinutes has expired; that is, when all Spot Instances could not be provisioned within the Spot provisioning timeout. Valid values are TERMINATE_CLUSTER and SWITCH_TO_ON_DEMAND. SWITCH_TO_ON_DEMAND specifies that if no Spot Instances are available, On-Demand Instances should be provisioned to fulfill any remaining Spot capacity.
     */
    TimeoutAction: SpotProvisioningTimeoutAction;
    /**
     * The defined duration for Spot Instances (also known as Spot blocks) in minutes. When specified, the Spot Instance does not terminate before the defined duration expires, and defined duration pricing for Spot Instances applies. Valid values are 60, 120, 180, 240, 300, or 360. The duration period starts as soon as a Spot Instance receives its instance ID. At the end of the duration, Amazon EC2 marks the Spot Instance for termination and provides a Spot Instance termination notice, which gives the instance a two-minute warning before it terminates. 
     */
    BlockDurationMinutes?: WholeNumber;
    /**
     *  Specifies the strategy to use in launching Spot Instance fleets. Currently, the only option is capacity-optimized (the default), which launches instances from Spot Instance pools with optimal capacity for the number of instances that are launching. 
     */
    AllocationStrategy?: SpotProvisioningAllocationStrategy;
  }
  export type SpotProvisioningTimeoutAction = "SWITCH_TO_ON_DEMAND"|"TERMINATE_CLUSTER"|string;
  export interface StartNotebookExecutionInput {
    /**
     * The unique identifier of the EMR Notebook to use for notebook execution.
     */
    EditorId: XmlStringMaxLen256;
    /**
     * The path and file name of the notebook file for this execution, relative to the path specified for the EMR Notebook. For example, if you specify a path of s3://MyBucket/MyNotebooks when you create an EMR Notebook for a notebook with an ID of e-ABCDEFGHIJK1234567890ABCD (the EditorID of this request), and you specify a RelativePath of my_notebook_executions/notebook_execution.ipynb, the location of the file for the notebook execution is s3://MyBucket/MyNotebooks/e-ABCDEFGHIJK1234567890ABCD/my_notebook_executions/notebook_execution.ipynb.
     */
    RelativePath: XmlString;
    /**
     * An optional name for the notebook execution.
     */
    NotebookExecutionName?: XmlStringMaxLen256;
    /**
     * Input parameters in JSON format passed to the EMR Notebook at runtime for execution.
     */
    NotebookParams?: XmlString;
    /**
     * Specifies the execution engine (cluster) that runs the notebook execution.
     */
    ExecutionEngine: ExecutionEngineConfig;
    /**
     * The name or ARN of the IAM role that is used as the service role for Amazon EMR (the EMR role) for the notebook execution.
     */
    ServiceRole: XmlString;
    /**
     * The unique identifier of the Amazon EC2 security group to associate with the EMR Notebook for this notebook execution.
     */
    NotebookInstanceSecurityGroupId?: XmlStringMaxLen256;
    /**
     * A list of tags associated with a notebook execution. Tags are user-defined key-value pairs that consist of a required key string with a maximum of 128 characters and an optional value string with a maximum of 256 characters.
     */
    Tags?: TagList;
  }
  export interface StartNotebookExecutionOutput {
    /**
     * The unique identifier of the notebook execution.
     */
    NotebookExecutionId?: XmlStringMaxLen256;
  }
  export type Statistic = "SAMPLE_COUNT"|"AVERAGE"|"SUM"|"MINIMUM"|"MAXIMUM"|string;
  export interface Step {
    /**
     * The identifier of the cluster step.
     */
    Id?: StepId;
    /**
     * The name of the cluster step.
     */
    Name?: String;
    /**
     * The Hadoop job configuration of the cluster step.
     */
    Config?: HadoopStepConfig;
    /**
     * The action to take when the cluster step fails. Possible values are TERMINATE_CLUSTER, CANCEL_AND_WAIT, and CONTINUE. TERMINATE_JOB_FLOW is provided for backward compatibility. We recommend using TERMINATE_CLUSTER instead. If a cluster's StepConcurrencyLevel is greater than 1, do not use AddJobFlowSteps to submit a step with this parameter set to CANCEL_AND_WAIT or TERMINATE_CLUSTER. The step is not submitted and the action fails with a message that the ActionOnFailure setting is not valid. If you change a cluster's StepConcurrencyLevel to be greater than 1 while a step is running, the ActionOnFailure parameter may not behave as you expect. In this case, for a step that fails with this parameter set to CANCEL_AND_WAIT, pending steps and the running step are not canceled; for a step that fails with this parameter set to TERMINATE_CLUSTER, the cluster does not terminate.
     */
    ActionOnFailure?: ActionOnFailure;
    /**
     * The current execution status details of the cluster step.
     */
    Status?: StepStatus;
  }
  export type StepCancellationOption = "SEND_INTERRUPT"|"TERMINATE_PROCESS"|string;
  export interface StepConfig {
    /**
     * The name of the step.
     */
    Name: XmlStringMaxLen256;
    /**
     * The action to take when the step fails. Use one of the following values:    TERMINATE_CLUSTER - Shuts down the cluster.    CANCEL_AND_WAIT - Cancels any pending steps and returns the cluster to the WAITING state.    CONTINUE - Continues to the next step in the queue.    TERMINATE_JOB_FLOW - Shuts down the cluster. TERMINATE_JOB_FLOW is provided for backward compatibility. We recommend using TERMINATE_CLUSTER instead.   If a cluster's StepConcurrencyLevel is greater than 1, do not use AddJobFlowSteps to submit a step with this parameter set to CANCEL_AND_WAIT or TERMINATE_CLUSTER. The step is not submitted and the action fails with a message that the ActionOnFailure setting is not valid. If you change a cluster's StepConcurrencyLevel to be greater than 1 while a step is running, the ActionOnFailure parameter may not behave as you expect. In this case, for a step that fails with this parameter set to CANCEL_AND_WAIT, pending steps and the running step are not canceled; for a step that fails with this parameter set to TERMINATE_CLUSTER, the cluster does not terminate.
     */
    ActionOnFailure?: ActionOnFailure;
    /**
     * The JAR file used for the step.
     */
    HadoopJarStep: HadoopJarStepConfig;
  }
  export type StepConfigList = StepConfig[];
  export interface StepDetail {
    /**
     * The step configuration.
     */
    StepConfig: StepConfig;
    /**
     * The description of the step status.
     */
    ExecutionStatusDetail: StepExecutionStatusDetail;
  }
  export type StepDetailList = StepDetail[];
  export type StepExecutionState = "PENDING"|"RUNNING"|"CONTINUE"|"COMPLETED"|"CANCELLED"|"FAILED"|"INTERRUPTED"|string;
  export interface StepExecutionStatusDetail {
    /**
     * The state of the step.
     */
    State: StepExecutionState;
    /**
     * The creation date and time of the step.
     */
    CreationDateTime: _Date;
    /**
     * The start date and time of the step.
     */
    StartDateTime?: _Date;
    /**
     * The completion date and time of the step.
     */
    EndDateTime?: _Date;
    /**
     * A description of the step's current state.
     */
    LastStateChangeReason?: XmlString;
  }
  export type StepId = string;
  export type StepIdsList = XmlStringMaxLen256[];
  export type StepState = "PENDING"|"CANCEL_PENDING"|"RUNNING"|"COMPLETED"|"CANCELLED"|"FAILED"|"INTERRUPTED"|string;
  export interface StepStateChangeReason {
    /**
     * The programmable code for the state change reason. Note: Currently, the service provides no code for the state change.
     */
    Code?: StepStateChangeReasonCode;
    /**
     * The descriptive message for the state change reason.
     */
    Message?: String;
  }
  export type StepStateChangeReasonCode = "NONE"|string;
  export type StepStateList = StepState[];
  export interface StepStatus {
    /**
     * The execution state of the cluster step.
     */
    State?: StepState;
    /**
     * The reason for the step execution status change.
     */
    StateChangeReason?: StepStateChangeReason;
    /**
     * The details for the step failure including reason, message, and log file path where the root cause was identified.
     */
    FailureDetails?: FailureDetails;
    /**
     * The timeline of the cluster step status over time.
     */
    Timeline?: StepTimeline;
  }
  export interface StepSummary {
    /**
     * The identifier of the cluster step.
     */
    Id?: StepId;
    /**
     * The name of the cluster step.
     */
    Name?: String;
    /**
     * The Hadoop job configuration of the cluster step.
     */
    Config?: HadoopStepConfig;
    /**
     * The action to take when the cluster step fails. Possible values are TERMINATE_CLUSTER, CANCEL_AND_WAIT, and CONTINUE. TERMINATE_JOB_FLOW is available for backward compatibility.
     */
    ActionOnFailure?: ActionOnFailure;
    /**
     * The current execution status details of the cluster step.
     */
    Status?: StepStatus;
  }
  export type StepSummaryList = StepSummary[];
  export interface StepTimeline {
    /**
     * The date and time when the cluster step was created.
     */
    CreationDateTime?: _Date;
    /**
     * The date and time when the cluster step execution started.
     */
    StartDateTime?: _Date;
    /**
     * The date and time when the cluster step execution completed or failed.
     */
    EndDateTime?: _Date;
  }
  export interface StopNotebookExecutionInput {
    /**
     * The unique identifier of the notebook execution.
     */
    NotebookExecutionId: XmlStringMaxLen256;
  }
  export type String = string;
  export type StringList = String[];
  export type StringMap = {[key: string]: String};
  export interface Studio {
    /**
     * The ID of the Amazon EMR Studio.
     */
    StudioId?: XmlStringMaxLen256;
    /**
     * The Amazon Resource Name (ARN) of the Amazon EMR Studio.
     */
    StudioArn?: XmlStringMaxLen256;
    /**
     * The name of the Amazon EMR Studio.
     */
    Name?: XmlStringMaxLen256;
    /**
     * The detailed description of the Amazon EMR Studio.
     */
    Description?: XmlStringMaxLen256;
    /**
     * Specifies whether the Amazon EMR Studio authenticates users using IAM or Amazon Web Services SSO.
     */
    AuthMode?: AuthMode;
    /**
     * The ID of the VPC associated with the Amazon EMR Studio.
     */
    VpcId?: XmlStringMaxLen256;
    /**
     * The list of IDs of the subnets associated with the Amazon EMR Studio.
     */
    SubnetIds?: SubnetIdList;
    /**
     * The name of the IAM role assumed by the Amazon EMR Studio.
     */
    ServiceRole?: XmlString;
    /**
     * The name of the IAM role assumed by users logged in to the Amazon EMR Studio. A Studio only requires a UserRole when you use IAM authentication.
     */
    UserRole?: XmlString;
    /**
     * The ID of the Workspace security group associated with the Amazon EMR Studio. The Workspace security group allows outbound network traffic to resources in the Engine security group and to the internet.
     */
    WorkspaceSecurityGroupId?: XmlStringMaxLen256;
    /**
     * The ID of the Engine security group associated with the Amazon EMR Studio. The Engine security group allows inbound network traffic from resources in the Workspace security group.
     */
    EngineSecurityGroupId?: XmlStringMaxLen256;
    /**
     * The unique access URL of the Amazon EMR Studio.
     */
    Url?: XmlString;
    /**
     * The time the Amazon EMR Studio was created.
     */
    CreationTime?: _Date;
    /**
     * The Amazon S3 location to back up Amazon EMR Studio Workspaces and notebook files.
     */
    DefaultS3Location?: XmlString;
    /**
     * Your identity provider's authentication endpoint. Amazon EMR Studio redirects federated users to this endpoint for authentication when logging in to a Studio with the Studio URL.
     */
    IdpAuthUrl?: XmlString;
    /**
     * The name of your identity provider's RelayState parameter.
     */
    IdpRelayStateParameterName?: XmlStringMaxLen256;
    /**
     * A list of tags associated with the Amazon EMR Studio.
     */
    Tags?: TagList;
  }
  export interface StudioSummary {
    /**
     * The ID of the Amazon EMR Studio.
     */
    StudioId?: XmlStringMaxLen256;
    /**
     * The name of the Amazon EMR Studio.
     */
    Name?: XmlStringMaxLen256;
    /**
     * The ID of the Virtual Private Cloud (Amazon VPC) associated with the Amazon EMR Studio.
     */
    VpcId?: XmlStringMaxLen256;
    /**
     * The detailed description of the Amazon EMR Studio.
     */
    Description?: XmlStringMaxLen256;
    /**
     * The unique access URL of the Amazon EMR Studio.
     */
    Url?: XmlStringMaxLen256;
    /**
     * Specifies whether the Studio authenticates users using IAM or Amazon Web Services SSO.
     */
    AuthMode?: AuthMode;
    /**
     * The time when the Amazon EMR Studio was created.
     */
    CreationTime?: _Date;
  }
  export type StudioSummaryList = StudioSummary[];
  export type SubnetIdList = String[];
  export interface SupportedProductConfig {
    /**
     * The name of the product configuration.
     */
    Name?: XmlStringMaxLen256;
    /**
     * The list of user-supplied arguments.
     */
    Args?: XmlStringList;
  }
  export type SupportedProductsList = XmlStringMaxLen256[];
  export interface Tag {
    /**
     * A user-defined key, which is the minimum required information for a valid tag. For more information, see Tag . 
     */
    Key?: String;
    /**
     * A user-defined value, which is optional in a tag. For more information, see Tag Clusters. 
     */
    Value?: String;
  }
  export type TagList = Tag[];
  export interface TerminateJobFlowsInput {
    /**
     * A list of job flows to be shut down.
     */
    JobFlowIds: XmlStringList;
  }
  export type Unit = "NONE"|"SECONDS"|"MICRO_SECONDS"|"MILLI_SECONDS"|"BYTES"|"KILO_BYTES"|"MEGA_BYTES"|"GIGA_BYTES"|"TERA_BYTES"|"BITS"|"KILO_BITS"|"MEGA_BITS"|"GIGA_BITS"|"TERA_BITS"|"PERCENT"|"COUNT"|"BYTES_PER_SECOND"|"KILO_BYTES_PER_SECOND"|"MEGA_BYTES_PER_SECOND"|"GIGA_BYTES_PER_SECOND"|"TERA_BYTES_PER_SECOND"|"BITS_PER_SECOND"|"KILO_BITS_PER_SECOND"|"MEGA_BITS_PER_SECOND"|"GIGA_BITS_PER_SECOND"|"TERA_BITS_PER_SECOND"|"COUNT_PER_SECOND"|string;
  export interface UpdateStudioInput {
    /**
     * The ID of the Amazon EMR Studio to update.
     */
    StudioId: XmlStringMaxLen256;
    /**
     * A descriptive name for the Amazon EMR Studio.
     */
    Name?: XmlStringMaxLen256;
    /**
     * A detailed description to assign to the Amazon EMR Studio.
     */
    Description?: XmlStringMaxLen256;
    /**
     * A list of subnet IDs to associate with the Amazon EMR Studio. The list can include new subnet IDs, but must also include all of the subnet IDs previously associated with the Studio. The list order does not matter. A Studio can have a maximum of 5 subnets. The subnets must belong to the same VPC as the Studio. 
     */
    SubnetIds?: SubnetIdList;
    /**
     * The Amazon S3 location to back up Workspaces and notebook files for the Amazon EMR Studio.
     */
    DefaultS3Location?: XmlString;
  }
  export interface UpdateStudioSessionMappingInput {
    /**
     * The ID of the Amazon EMR Studio.
     */
    StudioId: XmlStringMaxLen256;
    /**
     * The globally unique identifier (GUID) of the user or group. For more information, see UserId and GroupId in the Amazon Web Services SSO Identity Store API Reference. Either IdentityName or IdentityId must be specified.
     */
    IdentityId?: XmlStringMaxLen256;
    /**
     * The name of the user or group to update. For more information, see UserName and DisplayName in the Amazon Web Services SSO Identity Store API Reference. Either IdentityName or IdentityId must be specified.
     */
    IdentityName?: XmlStringMaxLen256;
    /**
     * Specifies whether the identity to update is a user or a group.
     */
    IdentityType: IdentityType;
    /**
     * The Amazon Resource Name (ARN) of the session policy to associate with the specified user or group.
     */
    SessionPolicyArn: XmlStringMaxLen256;
  }
  export interface VolumeSpecification {
    /**
     * The volume type. Volume types supported are gp2, io1, standard.
     */
    VolumeType: String;
    /**
     * The number of I/O operations per second (IOPS) that the volume supports.
     */
    Iops?: Integer;
    /**
     * The volume size, in gibibytes (GiB). This can be a number from 1 - 1024. If the volume type is EBS-optimized, the minimum value is 10.
     */
    SizeInGB: Integer;
  }
  export type WholeNumber = number;
  export type XmlString = string;
  export type XmlStringList = XmlString[];
  export type XmlStringMaxLen256 = string;
  export type XmlStringMaxLen256List = XmlStringMaxLen256[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2009-03-31"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the EMR client.
   */
  export import Types = EMR;
}
export = EMR;
