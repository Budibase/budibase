import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Route53RecoveryCluster extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Route53RecoveryCluster.Types.ClientConfiguration)
  config: Config & Route53RecoveryCluster.Types.ClientConfiguration;
  /**
   * Get the state for a routing control. A routing control is a simple on/off switch that you can use to route traffic to cells. When the state is On, traffic flows to a cell. When it's off, traffic does not flow.  Before you can create a routing control, you first must create a cluster to host the control. For more information, see CreateCluster. Access one of the endpoints for the cluster to get or update the routing control state to redirect traffic. For more information about working with routing controls, see Routing control in the Route 53 Application Recovery Controller Developer Guide.
   */
  getRoutingControlState(params: Route53RecoveryCluster.Types.GetRoutingControlStateRequest, callback?: (err: AWSError, data: Route53RecoveryCluster.Types.GetRoutingControlStateResponse) => void): Request<Route53RecoveryCluster.Types.GetRoutingControlStateResponse, AWSError>;
  /**
   * Get the state for a routing control. A routing control is a simple on/off switch that you can use to route traffic to cells. When the state is On, traffic flows to a cell. When it's off, traffic does not flow.  Before you can create a routing control, you first must create a cluster to host the control. For more information, see CreateCluster. Access one of the endpoints for the cluster to get or update the routing control state to redirect traffic. For more information about working with routing controls, see Routing control in the Route 53 Application Recovery Controller Developer Guide.
   */
  getRoutingControlState(callback?: (err: AWSError, data: Route53RecoveryCluster.Types.GetRoutingControlStateResponse) => void): Request<Route53RecoveryCluster.Types.GetRoutingControlStateResponse, AWSError>;
  /**
   * Set the state of the routing control to reroute traffic. You can set the value to be On or Off. When the state is On, traffic flows to a cell. When it's off, traffic does not flow. For more information about working with routing controls, see Routing control in the Route 53 Application Recovery Controller Developer Guide.
   */
  updateRoutingControlState(params: Route53RecoveryCluster.Types.UpdateRoutingControlStateRequest, callback?: (err: AWSError, data: Route53RecoveryCluster.Types.UpdateRoutingControlStateResponse) => void): Request<Route53RecoveryCluster.Types.UpdateRoutingControlStateResponse, AWSError>;
  /**
   * Set the state of the routing control to reroute traffic. You can set the value to be On or Off. When the state is On, traffic flows to a cell. When it's off, traffic does not flow. For more information about working with routing controls, see Routing control in the Route 53 Application Recovery Controller Developer Guide.
   */
  updateRoutingControlState(callback?: (err: AWSError, data: Route53RecoveryCluster.Types.UpdateRoutingControlStateResponse) => void): Request<Route53RecoveryCluster.Types.UpdateRoutingControlStateResponse, AWSError>;
  /**
   * Set multiple routing control states. You can set the value for each state to be On or Off. When the state is On, traffic flows to a cell. When it's off, traffic does not flow. For more information about working with routing controls, see Routing control in the Route 53 Application Recovery Controller Developer Guide.
   */
  updateRoutingControlStates(params: Route53RecoveryCluster.Types.UpdateRoutingControlStatesRequest, callback?: (err: AWSError, data: Route53RecoveryCluster.Types.UpdateRoutingControlStatesResponse) => void): Request<Route53RecoveryCluster.Types.UpdateRoutingControlStatesResponse, AWSError>;
  /**
   * Set multiple routing control states. You can set the value for each state to be On or Off. When the state is On, traffic flows to a cell. When it's off, traffic does not flow. For more information about working with routing controls, see Routing control in the Route 53 Application Recovery Controller Developer Guide.
   */
  updateRoutingControlStates(callback?: (err: AWSError, data: Route53RecoveryCluster.Types.UpdateRoutingControlStatesResponse) => void): Request<Route53RecoveryCluster.Types.UpdateRoutingControlStatesResponse, AWSError>;
}
declare namespace Route53RecoveryCluster {
  export type Arn = string;
  export interface GetRoutingControlStateRequest {
    /**
     * The Amazon Resource Number (ARN) for the routing control that you want to get the state for.
     */
    RoutingControlArn: Arn;
  }
  export interface GetRoutingControlStateResponse {
    /**
     * The Amazon Resource Number (ARN) of the response.
     */
    RoutingControlArn: Arn;
    /**
     * The state of the routing control.
     */
    RoutingControlState: RoutingControlState;
  }
  export type RoutingControlState = "On"|"Off"|string;
  export type UpdateRoutingControlStateEntries = UpdateRoutingControlStateEntry[];
  export interface UpdateRoutingControlStateEntry {
    /**
     * The Amazon Resource Number (ARN) for the routing control state entry.
     */
    RoutingControlArn: Arn;
    /**
     * The routing control state in a set of routing control state entries.
     */
    RoutingControlState: RoutingControlState;
  }
  export interface UpdateRoutingControlStateRequest {
    /**
     * The Amazon Resource Number (ARN) for the routing control that you want to update the state for.
     */
    RoutingControlArn: Arn;
    /**
     * The state of the routing control. You can set the value to be On or Off.
     */
    RoutingControlState: RoutingControlState;
  }
  export interface UpdateRoutingControlStateResponse {
  }
  export interface UpdateRoutingControlStatesRequest {
    /**
     * A set of routing control entries that you want to update.
     */
    UpdateRoutingControlStateEntries: UpdateRoutingControlStateEntries;
  }
  export interface UpdateRoutingControlStatesResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-12-02"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Route53RecoveryCluster client.
   */
  export import Types = Route53RecoveryCluster;
}
export = Route53RecoveryCluster;
