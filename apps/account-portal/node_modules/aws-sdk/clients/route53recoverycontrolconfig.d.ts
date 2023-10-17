import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Route53RecoveryControlConfig extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Route53RecoveryControlConfig.Types.ClientConfiguration)
  config: Config & Route53RecoveryControlConfig.Types.ClientConfiguration;
  /**
   * Create a new cluster. A cluster is a set of redundant Regional endpoints against which you can run API calls to update or get the state of one or more routing controls. Each cluster has a name, status, Amazon Resource Name (ARN), and an array of the five cluster endpoints (one for each supported Amazon Web Services Region) that you can use with API calls to the Amazon Route 53 Application Recovery Controller cluster data plane.
   */
  createCluster(params: Route53RecoveryControlConfig.Types.CreateClusterRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.CreateClusterResponse) => void): Request<Route53RecoveryControlConfig.Types.CreateClusterResponse, AWSError>;
  /**
   * Create a new cluster. A cluster is a set of redundant Regional endpoints against which you can run API calls to update or get the state of one or more routing controls. Each cluster has a name, status, Amazon Resource Name (ARN), and an array of the five cluster endpoints (one for each supported Amazon Web Services Region) that you can use with API calls to the Amazon Route 53 Application Recovery Controller cluster data plane.
   */
  createCluster(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.CreateClusterResponse) => void): Request<Route53RecoveryControlConfig.Types.CreateClusterResponse, AWSError>;
  /**
   * Creates a new control panel. A control panel represents a group of routing controls that can be changed together in a single transaction. You can use a control panel to centrally view the operational status of applications across your organization, and trigger multi-app failovers in a single transaction, for example, to fail over an Availability Zone or AWS Region.
   */
  createControlPanel(params: Route53RecoveryControlConfig.Types.CreateControlPanelRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.CreateControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.CreateControlPanelResponse, AWSError>;
  /**
   * Creates a new control panel. A control panel represents a group of routing controls that can be changed together in a single transaction. You can use a control panel to centrally view the operational status of applications across your organization, and trigger multi-app failovers in a single transaction, for example, to fail over an Availability Zone or AWS Region.
   */
  createControlPanel(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.CreateControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.CreateControlPanelResponse, AWSError>;
  /**
   * Creates a new routing control. A routing control has one of two states: ON and OFF. You can map the routing control state to the state of an Amazon Route 53 health check, which can be used to control traffic routing. To get or update the routing control state, see the Recovery Cluster (data plane) API actions for Amazon Route 53 Application Recovery Controller.
   */
  createRoutingControl(params: Route53RecoveryControlConfig.Types.CreateRoutingControlRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.CreateRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.CreateRoutingControlResponse, AWSError>;
  /**
   * Creates a new routing control. A routing control has one of two states: ON and OFF. You can map the routing control state to the state of an Amazon Route 53 health check, which can be used to control traffic routing. To get or update the routing control state, see the Recovery Cluster (data plane) API actions for Amazon Route 53 Application Recovery Controller.
   */
  createRoutingControl(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.CreateRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.CreateRoutingControlResponse, AWSError>;
  /**
   * Creates a safety rule in a control panel. Safety rules let you add safeguards around enabling and disabling routing controls, to help prevent unexpected outcomes. There are two types of safety rules: assertion rules and gating rules. Assertion rule: An assertion rule enforces that, when a routing control state is changed, the criteria set by the rule configuration is met. Otherwise, the change to the routing control is not accepted. Gating rule: A gating rule verifies that a set of gating controls evaluates as true, based on a rule configuration that you specify. If the gating rule evaluates to true, Amazon Route 53 Application Recovery Controller allows a set of routing control state changes to run and complete against the set of target controls.
   */
  createSafetyRule(params: Route53RecoveryControlConfig.Types.CreateSafetyRuleRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.CreateSafetyRuleResponse) => void): Request<Route53RecoveryControlConfig.Types.CreateSafetyRuleResponse, AWSError>;
  /**
   * Creates a safety rule in a control panel. Safety rules let you add safeguards around enabling and disabling routing controls, to help prevent unexpected outcomes. There are two types of safety rules: assertion rules and gating rules. Assertion rule: An assertion rule enforces that, when a routing control state is changed, the criteria set by the rule configuration is met. Otherwise, the change to the routing control is not accepted. Gating rule: A gating rule verifies that a set of gating controls evaluates as true, based on a rule configuration that you specify. If the gating rule evaluates to true, Amazon Route 53 Application Recovery Controller allows a set of routing control state changes to run and complete against the set of target controls.
   */
  createSafetyRule(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.CreateSafetyRuleResponse) => void): Request<Route53RecoveryControlConfig.Types.CreateSafetyRuleResponse, AWSError>;
  /**
   * Delete a cluster.
   */
  deleteCluster(params: Route53RecoveryControlConfig.Types.DeleteClusterRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DeleteClusterResponse) => void): Request<Route53RecoveryControlConfig.Types.DeleteClusterResponse, AWSError>;
  /**
   * Delete a cluster.
   */
  deleteCluster(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DeleteClusterResponse) => void): Request<Route53RecoveryControlConfig.Types.DeleteClusterResponse, AWSError>;
  /**
   * Deletes a control panel.
   */
  deleteControlPanel(params: Route53RecoveryControlConfig.Types.DeleteControlPanelRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DeleteControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.DeleteControlPanelResponse, AWSError>;
  /**
   * Deletes a control panel.
   */
  deleteControlPanel(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DeleteControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.DeleteControlPanelResponse, AWSError>;
  /**
   * Deletes a routing control.
   */
  deleteRoutingControl(params: Route53RecoveryControlConfig.Types.DeleteRoutingControlRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DeleteRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.DeleteRoutingControlResponse, AWSError>;
  /**
   * Deletes a routing control.
   */
  deleteRoutingControl(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DeleteRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.DeleteRoutingControlResponse, AWSError>;
  /**
   * Deletes a safety rule./&gt;
   */
  deleteSafetyRule(params: Route53RecoveryControlConfig.Types.DeleteSafetyRuleRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DeleteSafetyRuleResponse) => void): Request<Route53RecoveryControlConfig.Types.DeleteSafetyRuleResponse, AWSError>;
  /**
   * Deletes a safety rule./&gt;
   */
  deleteSafetyRule(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DeleteSafetyRuleResponse) => void): Request<Route53RecoveryControlConfig.Types.DeleteSafetyRuleResponse, AWSError>;
  /**
   * Display the details about a cluster. The response includes the cluster name, endpoints, status, and Amazon Resource Name (ARN).
   */
  describeCluster(params: Route53RecoveryControlConfig.Types.DescribeClusterRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeClusterResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeClusterResponse, AWSError>;
  /**
   * Display the details about a cluster. The response includes the cluster name, endpoints, status, and Amazon Resource Name (ARN).
   */
  describeCluster(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeClusterResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeClusterResponse, AWSError>;
  /**
   * Displays details about a control panel.
   */
  describeControlPanel(params: Route53RecoveryControlConfig.Types.DescribeControlPanelRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeControlPanelResponse, AWSError>;
  /**
   * Displays details about a control panel.
   */
  describeControlPanel(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeControlPanelResponse, AWSError>;
  /**
   * Displays details about a routing control. A routing control has one of two states: ON and OFF. You can map the routing control state to the state of an Amazon Route 53 health check, which can be used to control routing. To get or update the routing control state, see the Recovery Cluster (data plane) API actions for Amazon Route 53 Application Recovery Controller.
   */
  describeRoutingControl(params: Route53RecoveryControlConfig.Types.DescribeRoutingControlRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse, AWSError>;
  /**
   * Displays details about a routing control. A routing control has one of two states: ON and OFF. You can map the routing control state to the state of an Amazon Route 53 health check, which can be used to control routing. To get or update the routing control state, see the Recovery Cluster (data plane) API actions for Amazon Route 53 Application Recovery Controller.
   */
  describeRoutingControl(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse, AWSError>;
  /**
   * Describes the safety rules (that is, the assertion rules and gating rules) for the routing controls in a control panel.
   */
  describeSafetyRule(params: Route53RecoveryControlConfig.Types.DescribeSafetyRuleRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeSafetyRuleResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeSafetyRuleResponse, AWSError>;
  /**
   * Describes the safety rules (that is, the assertion rules and gating rules) for the routing controls in a control panel.
   */
  describeSafetyRule(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeSafetyRuleResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeSafetyRuleResponse, AWSError>;
  /**
   * Returns an array of all Amazon Route 53 health checks associated with a specific routing control.
   */
  listAssociatedRoute53HealthChecks(params: Route53RecoveryControlConfig.Types.ListAssociatedRoute53HealthChecksRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.ListAssociatedRoute53HealthChecksResponse) => void): Request<Route53RecoveryControlConfig.Types.ListAssociatedRoute53HealthChecksResponse, AWSError>;
  /**
   * Returns an array of all Amazon Route 53 health checks associated with a specific routing control.
   */
  listAssociatedRoute53HealthChecks(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.ListAssociatedRoute53HealthChecksResponse) => void): Request<Route53RecoveryControlConfig.Types.ListAssociatedRoute53HealthChecksResponse, AWSError>;
  /**
   * Returns an array of all the clusters in an account.
   */
  listClusters(params: Route53RecoveryControlConfig.Types.ListClustersRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.ListClustersResponse) => void): Request<Route53RecoveryControlConfig.Types.ListClustersResponse, AWSError>;
  /**
   * Returns an array of all the clusters in an account.
   */
  listClusters(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.ListClustersResponse) => void): Request<Route53RecoveryControlConfig.Types.ListClustersResponse, AWSError>;
  /**
   * Returns an array of control panels for a cluster.
   */
  listControlPanels(params: Route53RecoveryControlConfig.Types.ListControlPanelsRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.ListControlPanelsResponse) => void): Request<Route53RecoveryControlConfig.Types.ListControlPanelsResponse, AWSError>;
  /**
   * Returns an array of control panels for a cluster.
   */
  listControlPanels(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.ListControlPanelsResponse) => void): Request<Route53RecoveryControlConfig.Types.ListControlPanelsResponse, AWSError>;
  /**
   * Returns an array of routing controls for a control panel. A routing control is an Amazon Route 53 Application Recovery Controller construct that has one of two states: ON and OFF. You can map the routing control state to the state of an Amazon Route 53 health check, which can be used to control routing.
   */
  listRoutingControls(params: Route53RecoveryControlConfig.Types.ListRoutingControlsRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.ListRoutingControlsResponse) => void): Request<Route53RecoveryControlConfig.Types.ListRoutingControlsResponse, AWSError>;
  /**
   * Returns an array of routing controls for a control panel. A routing control is an Amazon Route 53 Application Recovery Controller construct that has one of two states: ON and OFF. You can map the routing control state to the state of an Amazon Route 53 health check, which can be used to control routing.
   */
  listRoutingControls(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.ListRoutingControlsResponse) => void): Request<Route53RecoveryControlConfig.Types.ListRoutingControlsResponse, AWSError>;
  /**
   * List the safety rules (the assertion rules and gating rules) that you've defined for the routing controls in a control panel.
   */
  listSafetyRules(params: Route53RecoveryControlConfig.Types.ListSafetyRulesRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.ListSafetyRulesResponse) => void): Request<Route53RecoveryControlConfig.Types.ListSafetyRulesResponse, AWSError>;
  /**
   * List the safety rules (the assertion rules and gating rules) that you've defined for the routing controls in a control panel.
   */
  listSafetyRules(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.ListSafetyRulesResponse) => void): Request<Route53RecoveryControlConfig.Types.ListSafetyRulesResponse, AWSError>;
  /**
   * Updates a control panel. The only update you can make to a control panel is to change the name of the control panel.
   */
  updateControlPanel(params: Route53RecoveryControlConfig.Types.UpdateControlPanelRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.UpdateControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.UpdateControlPanelResponse, AWSError>;
  /**
   * Updates a control panel. The only update you can make to a control panel is to change the name of the control panel.
   */
  updateControlPanel(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.UpdateControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.UpdateControlPanelResponse, AWSError>;
  /**
   * Updates a routing control. You can only update the name of the routing control. To get or update the routing control state, see the Recovery Cluster (data plane) API actions for Amazon Route 53 Application Recovery Controller.
   */
  updateRoutingControl(params: Route53RecoveryControlConfig.Types.UpdateRoutingControlRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.UpdateRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.UpdateRoutingControlResponse, AWSError>;
  /**
   * Updates a routing control. You can only update the name of the routing control. To get or update the routing control state, see the Recovery Cluster (data plane) API actions for Amazon Route 53 Application Recovery Controller.
   */
  updateRoutingControl(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.UpdateRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.UpdateRoutingControlResponse, AWSError>;
  /**
   * Update a safety rule (an assertion rule or gating rule) for the routing controls in a control panel. You can only update the name and the waiting period for a safety rule. To make other updates, delete the safety rule and create a new safety rule.
   */
  updateSafetyRule(params: Route53RecoveryControlConfig.Types.UpdateSafetyRuleRequest, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.UpdateSafetyRuleResponse) => void): Request<Route53RecoveryControlConfig.Types.UpdateSafetyRuleResponse, AWSError>;
  /**
   * Update a safety rule (an assertion rule or gating rule) for the routing controls in a control panel. You can only update the name and the waiting period for a safety rule. To make other updates, delete the safety rule and create a new safety rule.
   */
  updateSafetyRule(callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.UpdateSafetyRuleResponse) => void): Request<Route53RecoveryControlConfig.Types.UpdateSafetyRuleResponse, AWSError>;
  /**
   * Waits for the clusterCreated state by periodically calling the underlying Route53RecoveryControlConfig.describeClusteroperation every 5 seconds (at most 26 times). Wait until a cluster is created
   */
  waitFor(state: "clusterCreated", params: Route53RecoveryControlConfig.Types.DescribeClusterRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeClusterResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeClusterResponse, AWSError>;
  /**
   * Waits for the clusterCreated state by periodically calling the underlying Route53RecoveryControlConfig.describeClusteroperation every 5 seconds (at most 26 times). Wait until a cluster is created
   */
  waitFor(state: "clusterCreated", callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeClusterResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeClusterResponse, AWSError>;
  /**
   * Waits for the clusterDeleted state by periodically calling the underlying Route53RecoveryControlConfig.describeClusteroperation every 5 seconds (at most 26 times). Wait for a cluster to be deleted
   */
  waitFor(state: "clusterDeleted", params: Route53RecoveryControlConfig.Types.DescribeClusterRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeClusterResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeClusterResponse, AWSError>;
  /**
   * Waits for the clusterDeleted state by periodically calling the underlying Route53RecoveryControlConfig.describeClusteroperation every 5 seconds (at most 26 times). Wait for a cluster to be deleted
   */
  waitFor(state: "clusterDeleted", callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeClusterResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeClusterResponse, AWSError>;
  /**
   * Waits for the controlPanelCreated state by periodically calling the underlying Route53RecoveryControlConfig.describeControlPaneloperation every 5 seconds (at most 26 times). Wait until a control panel is created
   */
  waitFor(state: "controlPanelCreated", params: Route53RecoveryControlConfig.Types.DescribeControlPanelRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeControlPanelResponse, AWSError>;
  /**
   * Waits for the controlPanelCreated state by periodically calling the underlying Route53RecoveryControlConfig.describeControlPaneloperation every 5 seconds (at most 26 times). Wait until a control panel is created
   */
  waitFor(state: "controlPanelCreated", callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeControlPanelResponse, AWSError>;
  /**
   * Waits for the controlPanelDeleted state by periodically calling the underlying Route53RecoveryControlConfig.describeControlPaneloperation every 5 seconds (at most 26 times). Wait until a control panel is deleted
   */
  waitFor(state: "controlPanelDeleted", params: Route53RecoveryControlConfig.Types.DescribeControlPanelRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeControlPanelResponse, AWSError>;
  /**
   * Waits for the controlPanelDeleted state by periodically calling the underlying Route53RecoveryControlConfig.describeControlPaneloperation every 5 seconds (at most 26 times). Wait until a control panel is deleted
   */
  waitFor(state: "controlPanelDeleted", callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeControlPanelResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeControlPanelResponse, AWSError>;
  /**
   * Waits for the routingControlCreated state by periodically calling the underlying Route53RecoveryControlConfig.describeRoutingControloperation every 5 seconds (at most 26 times). Wait until a routing control is created
   */
  waitFor(state: "routingControlCreated", params: Route53RecoveryControlConfig.Types.DescribeRoutingControlRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse, AWSError>;
  /**
   * Waits for the routingControlCreated state by periodically calling the underlying Route53RecoveryControlConfig.describeRoutingControloperation every 5 seconds (at most 26 times). Wait until a routing control is created
   */
  waitFor(state: "routingControlCreated", callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse, AWSError>;
  /**
   * Waits for the routingControlDeleted state by periodically calling the underlying Route53RecoveryControlConfig.describeRoutingControloperation every 5 seconds (at most 26 times). Wait for a routing control to be deleted
   */
  waitFor(state: "routingControlDeleted", params: Route53RecoveryControlConfig.Types.DescribeRoutingControlRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse, AWSError>;
  /**
   * Waits for the routingControlDeleted state by periodically calling the underlying Route53RecoveryControlConfig.describeRoutingControloperation every 5 seconds (at most 26 times). Wait for a routing control to be deleted
   */
  waitFor(state: "routingControlDeleted", callback?: (err: AWSError, data: Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse) => void): Request<Route53RecoveryControlConfig.Types.DescribeRoutingControlResponse, AWSError>;
}
declare namespace Route53RecoveryControlConfig {
  export interface AssertionRule {
    /**
     * The routing controls that are part of transactions that are evaluated to determine if a request to change a routing control state is allowed. For example, you might include three routing controls, one for each of three Amazon Web Services Regions.
     */
    AssertedControls: __listOf__string;
    /**
     * The Amazon Resource Name (ARN) of the control panel.
     */
    ControlPanelArn: __string;
    /**
     * Name of the assertion rule. You can use any non-white space character in the name.
     */
    Name: __stringMin1Max64PatternS;
    /**
     * The criteria that you set for specific assertion controls (routing controls) that designate how many controls must be enabled as the result of a transaction. For example, if you have three assertion controls, you might specify atleast 2 for your rule configuration. This means that at least two assertion controls must be enabled, so that at least two Amazon Web Services Regions are enabled.
     */
    RuleConfig: RuleConfig;
    /**
     * The Amazon Resource Name (ARN) of the assertion rule.
     */
    SafetyRuleArn: __string;
    /**
     * The deployment status of an assertion rule. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
     */
    Status: Status;
    /**
     * An evaluation period, in milliseconds (ms), during which any request against the target routing controls will fail. This helps prevent "flapping" of state. The wait period is 5000 ms by default, but you can choose a custom value.
     */
    WaitPeriodMs: __integer;
  }
  export interface AssertionRuleUpdate {
    /**
     * The name of the assertion rule. You can use any non-white space character in the name.
     */
    Name: __stringMin1Max64PatternS;
    /**
     * The Amazon Resource Name (ARN) of the assertion rule.
     */
    SafetyRuleArn: __string;
    /**
     * An evaluation period, in milliseconds (ms), during which any request against the target routing controls will fail. This helps prevent "flapping" of state. The wait period is 5000 ms by default, but you can choose a custom value.
     */
    WaitPeriodMs: __integer;
  }
  export interface Cluster {
    /**
     * The Amazon Resource Name (ARN) of the cluster.
     */
    ClusterArn?: __string;
    /**
     * Endpoints for a cluster. Specify one of these endpoints when you want to set or retrieve a routing control state in the cluster. To get or update the routing control state, see the Amazon Route 53 Application Recovery Controller Cluster (Data Plane) Actions.
     */
    ClusterEndpoints?: __listOfClusterEndpoint;
    /**
     * The name of the cluster.
     */
    Name?: __stringMin1Max64PatternS;
    /**
     * Deployment status of a resource. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
     */
    Status?: Status;
  }
  export interface ClusterEndpoint {
    /**
     * A cluster endpoint. Specify an endpoint and Amazon Web Services Region when you want to set or retrieve a routing control state in the cluster. To get or update the routing control state, see the Amazon Route 53 Application Recovery Controller Cluster (Data Plane) Actions.
     */
    Endpoint?: __stringMin1Max128;
    /**
     * The Amazon Web Services Region for a cluster endpoint.
     */
    Region?: __stringMin1Max32;
  }
  export interface ControlPanel {
    /**
     * The Amazon Resource Name (ARN) of the cluster that includes the control panel.
     */
    ClusterArn?: __string;
    /**
     * The Amazon Resource Name (ARN) of the control panel.
     */
    ControlPanelArn?: __string;
    /**
     * A flag that Amazon Route 53 Application Recovery Controller sets to true to designate the default control panel for a cluster. When you create a cluster, Amazon Route 53 Application Recovery Controller creates a control panel, and sets this flag for that control panel. If you create a control panel yourself, this flag is set to false.
     */
    DefaultControlPanel?: __boolean;
    /**
     * The name of the control panel. You can use any non-white space character in the name.
     */
    Name?: __stringMin1Max64PatternS;
    /**
     * The number of routing controls in the control panel.
     */
    RoutingControlCount?: __integer;
    /**
     * The deployment status of control panel. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
     */
    Status?: Status;
  }
  export interface CreateClusterRequest {
    /**
     * Unique client idempotency token.
     */
    ClientToken?: __stringMax64;
    /**
     * The name of the cluster.
     */
    ClusterName: __stringMin1Max64PatternS;
  }
  export interface CreateClusterResponse {
    /**
     * The cluster that was created.
     */
    Cluster?: Cluster;
  }
  export interface CreateControlPanelRequest {
    /**
     * Unique client idempotency token.
     */
    ClientToken?: __stringMax64;
    /**
     * The Amazon Resource Name (ARN) of the cluster for the control panel.
     */
    ClusterArn: __string;
    /**
     * The name of the control panel.
     */
    ControlPanelName: __stringMin1Max64PatternS;
  }
  export interface CreateControlPanelResponse {
    /**
     * Information about a control panel.
     */
    ControlPanel?: ControlPanel;
  }
  export interface CreateRoutingControlRequest {
    /**
     * Unique client idempotency token.
     */
    ClientToken?: __stringMax64;
    /**
     * The Amazon Resource Name (ARN) of the cluster that includes the routing control.
     */
    ClusterArn: __string;
    /**
     * The Amazon Resource Name (ARN) of the control panel that includes the routing control.
     */
    ControlPanelArn?: __string;
    /**
     * The name of the routing control.
     */
    RoutingControlName: __stringMin1Max64PatternS;
  }
  export interface CreateRoutingControlResponse {
    /**
     * The routing control that is created.
     */
    RoutingControl?: RoutingControl;
  }
  export interface CreateSafetyRuleRequest {
    AssertionRule?: NewAssertionRule;
    /**
     * Unique client idempotency token.
     */
    ClientToken?: __stringMax64;
    GatingRule?: NewGatingRule;
  }
  export interface CreateSafetyRuleResponse {
    AssertionRule?: AssertionRule;
    GatingRule?: GatingRule;
  }
  export interface DeleteClusterRequest {
    /**
     * The Amazon Resource Name (ARN) of the cluster that you're deleting.
     */
    ClusterArn: __string;
  }
  export interface DeleteClusterResponse {
  }
  export interface DeleteControlPanelRequest {
    /**
     * The Amazon Resource Name (ARN) of the control panel that you're deleting.
     */
    ControlPanelArn: __string;
  }
  export interface DeleteControlPanelResponse {
  }
  export interface DeleteRoutingControlRequest {
    /**
     * The Amazon Resource Name (ARN) of the routing control that you're deleting.
     */
    RoutingControlArn: __string;
  }
  export interface DeleteRoutingControlResponse {
  }
  export interface DeleteSafetyRuleRequest {
    /**
     * The request body that you include when you update a safety rule.
     */
    SafetyRuleArn: __string;
  }
  export interface DeleteSafetyRuleResponse {
  }
  export interface DescribeClusterRequest {
    /**
     * The Amazon Resource Name (ARN) of the cluster that you're getting details for.
     */
    ClusterArn: __string;
  }
  export interface DescribeClusterResponse {
    /**
     * The cluster for the DescribeCluster request.
     */
    Cluster?: Cluster;
  }
  export interface DescribeControlPanelRequest {
    /**
     * The Amazon Resource Name (ARN) of the control panel that you're getting details for.
     */
    ControlPanelArn: __string;
  }
  export interface DescribeControlPanelResponse {
    /**
     * Information about the control panel.
     */
    ControlPanel?: ControlPanel;
  }
  export interface DescribeRoutingControlRequest {
    /**
     * The Amazon Resource Name (ARN) of the routing control that you're getting details for.
     */
    RoutingControlArn: __string;
  }
  export interface DescribeRoutingControlResponse {
    /**
     * Information about the routing control.
     */
    RoutingControl?: RoutingControl;
  }
  export interface DescribeSafetyRuleRequest {
    /**
     * The request body that you include when you update a safety rule.
     */
    SafetyRuleArn: __string;
  }
  export interface DescribeSafetyRuleResponse {
    AssertionRule?: AssertionRule;
    GatingRule?: GatingRule;
  }
  export interface GatingRule {
    /**
     * The Amazon Resource Name (ARN) of the control panel.
     */
    ControlPanelArn: __string;
    /**
     * The gating controls for the gating rule. That is, routing controls that are evaluated by the rule configuration that you specify.
     */
    GatingControls: __listOf__string;
    /**
     * The name for the gating rule.
     */
    Name: __stringMin1Max64PatternS;
    /**
     * The criteria that you set for specific gating controls (routing controls) that designates how many controls must be enabled to allow you to change (set or unset) the target controls.
     */
    RuleConfig: RuleConfig;
    /**
     * The Amazon Resource Name (ARN) of the gating rule.
     */
    SafetyRuleArn: __string;
    /**
     * The deployment status of a gating rule. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
     */
    Status: Status;
    /**
     * Routing controls that can only be set or unset if the specified RuleConfig evaluates to true for the specified GatingControls. For example, say you have three gating controls, one for each of three Amazon Web Services Regions. Now you specify ATLEAST 2 as your RuleConfig. With these settings, you can only change (set or unset) the routing controls that you have specified as TargetControls if that rule evaluates to true. In other words, your ability to change the routing controls that you have specified as TargetControls is gated by the rule that you set for the routing controls in GatingControls.
     */
    TargetControls: __listOf__string;
    /**
     * An evaluation period, in milliseconds (ms), during which any request against the target routing controls will fail. This helps prevent "flapping" of state. The wait period is 5000 ms by default, but you can choose a custom value.
     */
    WaitPeriodMs: __integer;
  }
  export interface GatingRuleUpdate {
    /**
     * The name for the gating rule.
     */
    Name: __stringMin1Max64PatternS;
    /**
     * The Amazon Resource Name (ARN) of the gating rule.
     */
    SafetyRuleArn: __string;
    /**
     * An evaluation period, in milliseconds (ms), during which any request against the target routing controls will fail. This helps prevent "flapping" of state. The wait period is 5000 ms by default, but you can choose a custom value.
     */
    WaitPeriodMs: __integer;
  }
  export interface ListAssociatedRoute53HealthChecksRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
    /**
     * The Amazon Resource Name (ARN) of the routing control that you're getting details for.
     */
    RoutingControlArn: __string;
  }
  export interface ListAssociatedRoute53HealthChecksResponse {
    /**
     * Identifiers for the health checks.
     */
    HealthCheckIds?: __listOf__string;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __stringMax8096;
  }
  export interface ListClustersRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListClustersResponse {
    /**
     * An array of the clusters in an account.
     */
    Clusters?: __listOfCluster;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __stringMax8096;
  }
  export interface ListControlPanelsRequest {
    /**
     * The Amazon Resource Name (ARN) of a cluster.
     */
    ClusterArn?: __string;
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListControlPanelsResponse {
    /**
     * The result of a successful ListControlPanel request.
     */
    ControlPanels?: __listOfControlPanel;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __stringMax8096;
  }
  export interface ListRoutingControlsRequest {
    /**
     * The Amazon Resource Name (ARN) of the control panel that you're getting routing control details for.
     */
    ControlPanelArn: __string;
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListRoutingControlsResponse {
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __stringMax8096;
    /**
     * An array of routing controls.
     */
    RoutingControls?: __listOfRoutingControl;
  }
  export interface ListSafetyRulesRequest {
    /**
     * The Amazon Resource Name (ARN) of the control panel that you're getting details for.
     */
    ControlPanelArn: __string;
    /**
     * The number of objects that you want to return with this call.
     */
    MaxResults?: MaxResults;
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __string;
  }
  export interface ListSafetyRulesResponse {
    /**
     * The token that identifies which batch of results you want to see.
     */
    NextToken?: __stringMax8096;
    /**
     * The list of safety rules in a control panel.
     */
    SafetyRules?: __listOfRule;
  }
  export type MaxResults = number;
  export interface NewAssertionRule {
    /**
     * The routing controls that are part of transactions that are evaluated to determine if a request to change a routing control state is allowed. For example, you might include three routing controls, one for each of three Amazon Web Services Regions.
     */
    AssertedControls: __listOf__string;
    /**
     * The Amazon Resource Name (ARN) for the control panel.
     */
    ControlPanelArn: __string;
    /**
     * The name of the assertion rule. You can use any non-white space character in the name.
     */
    Name: __stringMin1Max64PatternS;
    /**
     * The criteria that you set for specific assertion controls (routing controls) that designate how many controls must be enabled as the result of a transaction. For example, if you have three assertion controls, you might specify atleast 2 for your rule configuration. This means that at least two assertion controls must be enabled, so that at least two Amazon Web Services Regions are enabled.
     */
    RuleConfig: RuleConfig;
    /**
     * An evaluation period, in milliseconds (ms), during which any request against the target routing controls will fail. This helps prevent "flapping" of state. The wait period is 5000 ms by default, but you can choose a custom value.
     */
    WaitPeriodMs: __integer;
  }
  export interface NewGatingRule {
    /**
     * The Amazon Resource Name (ARN) of the control panel.
     */
    ControlPanelArn: __string;
    /**
     * The gating controls for the new gating rule. That is, routing controls that are evaluated by the rule configuration that you specify.
     */
    GatingControls: __listOf__string;
    /**
     * The name for the new gating rule.
     */
    Name: __stringMin1Max64PatternS;
    /**
     * The criteria that you set for specific gating controls (routing controls) that designates how many controls must be enabled to allow you to change (set or unset) the target controls.
     */
    RuleConfig: RuleConfig;
    /**
     * Routing controls that can only be set or unset if the specified RuleConfig evaluates to true for the specified GatingControls. For example, say you have three gating controls, one for each of three Amazon Web Services Regions. Now you specify AtLeast 2 as your RuleConfig. With these settings, you can only change (set or unset) the routing controls that you have specified as TargetControls if that rule evaluates to true. In other words, your ability to change the routing controls that you have specified as TargetControls is gated by the rule that you set for the routing controls in GatingControls.
     */
    TargetControls: __listOf__string;
    /**
     * An evaluation period, in milliseconds (ms), during which any request against the target routing controls will fail. This helps prevent "flapping" of state. The wait period is 5000 ms by default, but you can choose a custom value.
     */
    WaitPeriodMs: __integer;
  }
  export interface RoutingControl {
    /**
     * The Amazon Resource Name (ARN) of the control panel that includes the routing control.
     */
    ControlPanelArn?: __string;
    /**
     * The name of the routing control.
     */
    Name?: __stringMin1Max64PatternS;
    /**
     * The Amazon Resource Name (ARN) of the routing control.
     */
    RoutingControlArn?: __string;
    /**
     * The deployment status of a routing control. Status can be one of the following: PENDING, DEPLOYED, PENDING_DELETION.
     */
    Status?: Status;
  }
  export interface Rule {
    /**
     * An assertion rule enforces that, when a routing control state is changed, the criteria set by the rule configuration is met. Otherwise, the change to the routing control is not accepted.
     */
    ASSERTION?: AssertionRule;
    /**
     * A gating rule verifies that a set of gating controls evaluates as true, based on a rule configuration that you specify. If the gating rule evaluates to true, Amazon Route 53 Application Recovery Controller allows a set of routing control state changes to run and complete against the set of target controls.
     */
    GATING?: GatingRule;
  }
  export interface RuleConfig {
    /**
     * Logical negation of the rule. If the rule would usually evaluate true, it's evaluated as false, and vice versa.
     */
    Inverted: __boolean;
    /**
     * The value of N, when you specify an ATLEAST rule type. That is, Threshold is the number of controls that must be set when you specify an ATLEAST type.
     */
    Threshold: __integer;
    /**
     * A rule can be one of the following: ATLEAST, AND, or OR.
     */
    Type: RuleType;
  }
  export type RuleType = "ATLEAST"|"AND"|"OR"|string;
  export type Status = "PENDING"|"DEPLOYED"|"PENDING_DELETION"|string;
  export interface UpdateControlPanelRequest {
    /**
     * The Amazon Resource Name (ARN) of the control panel.
     */
    ControlPanelArn: __string;
    /**
     * The name of the control panel.
     */
    ControlPanelName: __stringMin1Max64PatternS;
  }
  export interface UpdateControlPanelResponse {
    /**
     * The control panel to update.
     */
    ControlPanel?: ControlPanel;
  }
  export interface UpdateRoutingControlRequest {
    /**
     * The Amazon Resource Name (ARN) of the routing control.
     */
    RoutingControlArn: __string;
    /**
     * The name of the routing control.
     */
    RoutingControlName: __stringMin1Max64PatternS;
  }
  export interface UpdateRoutingControlResponse {
    /**
     * The routing control that was updated.
     */
    RoutingControl?: RoutingControl;
  }
  export interface UpdateSafetyRuleRequest {
    AssertionRuleUpdate?: AssertionRuleUpdate;
    GatingRuleUpdate?: GatingRuleUpdate;
  }
  export interface UpdateSafetyRuleResponse {
    AssertionRule?: AssertionRule;
    GatingRule?: GatingRule;
  }
  export type __boolean = boolean;
  export type __integer = number;
  export type __listOfCluster = Cluster[];
  export type __listOfClusterEndpoint = ClusterEndpoint[];
  export type __listOfControlPanel = ControlPanel[];
  export type __listOfRoutingControl = RoutingControl[];
  export type __listOfRule = Rule[];
  export type __listOf__string = __string[];
  export type __string = string;
  export type __stringMax64 = string;
  export type __stringMax8096 = string;
  export type __stringMin1Max128 = string;
  export type __stringMin1Max32 = string;
  export type __stringMin1Max64PatternS = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-11-02"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Route53RecoveryControlConfig client.
   */
  export import Types = Route53RecoveryControlConfig;
}
export = Route53RecoveryControlConfig;
