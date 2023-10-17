import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SagemakerEdge extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SagemakerEdge.Types.ClientConfiguration)
  config: Config & SagemakerEdge.Types.ClientConfiguration;
  /**
   * Use to get the active deployments from a device.
   */
  getDeployments(params: SagemakerEdge.Types.GetDeploymentsRequest, callback?: (err: AWSError, data: SagemakerEdge.Types.GetDeploymentsResult) => void): Request<SagemakerEdge.Types.GetDeploymentsResult, AWSError>;
  /**
   * Use to get the active deployments from a device.
   */
  getDeployments(callback?: (err: AWSError, data: SagemakerEdge.Types.GetDeploymentsResult) => void): Request<SagemakerEdge.Types.GetDeploymentsResult, AWSError>;
  /**
   * Use to check if a device is registered with SageMaker Edge Manager.
   */
  getDeviceRegistration(params: SagemakerEdge.Types.GetDeviceRegistrationRequest, callback?: (err: AWSError, data: SagemakerEdge.Types.GetDeviceRegistrationResult) => void): Request<SagemakerEdge.Types.GetDeviceRegistrationResult, AWSError>;
  /**
   * Use to check if a device is registered with SageMaker Edge Manager.
   */
  getDeviceRegistration(callback?: (err: AWSError, data: SagemakerEdge.Types.GetDeviceRegistrationResult) => void): Request<SagemakerEdge.Types.GetDeviceRegistrationResult, AWSError>;
  /**
   * Use to get the current status of devices registered on SageMaker Edge Manager.
   */
  sendHeartbeat(params: SagemakerEdge.Types.SendHeartbeatRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Use to get the current status of devices registered on SageMaker Edge Manager.
   */
  sendHeartbeat(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
}
declare namespace SagemakerEdge {
  export type CacheTTLSeconds = string;
  export interface Checksum {
    /**
     * The type of the checksum.
     */
    Type?: ChecksumType;
    /**
     * The checksum of the model.
     */
    Sum?: ChecksumString;
  }
  export type ChecksumString = string;
  export type ChecksumType = "SHA1"|string;
  export interface Definition {
    /**
     * The unique model handle.
     */
    ModelHandle?: EntityName;
    /**
     * The absolute S3 location of the model.
     */
    S3Url?: S3Uri;
    /**
     * The checksum information of the model.
     */
    Checksum?: Checksum;
    /**
     * The desired state of the model.
     */
    State?: ModelState;
  }
  export type Definitions = Definition[];
  export interface DeploymentModel {
    /**
     * The unique handle of the model.
     */
    ModelHandle?: EntityName;
    /**
     * The name of the model.
     */
    ModelName?: ModelName;
    /**
     * The version of the model.
     */
    ModelVersion?: Version;
    /**
     * The desired state of the model.
     */
    DesiredState?: ModelState;
    /**
     * Returns the current state of the model.
     */
    State?: ModelState;
    /**
     * Returns the deployment status of the model.
     */
    Status?: DeploymentStatus;
    /**
     * Returns the error message for the deployment status result.
     */
    StatusReason?: String;
    /**
     * Returns the error message if there is a rollback.
     */
    RollbackFailureReason?: String;
  }
  export type DeploymentModels = DeploymentModel[];
  export interface DeploymentResult {
    /**
     * The name and unique ID of the deployment.
     */
    DeploymentName?: EntityName;
    /**
     * Returns the bucket error code.
     */
    DeploymentStatus?: EntityName;
    /**
     * Returns the detailed error message.
     */
    DeploymentStatusMessage?: String;
    /**
     * The timestamp of when the deployment was started on the agent.
     */
    DeploymentStartTime?: Timestamp;
    /**
     * The timestamp of when the deployment was ended, and the agent got the deployment results.
     */
    DeploymentEndTime?: Timestamp;
    /**
     * Returns a list of models deployed on the agent.
     */
    DeploymentModels?: DeploymentModels;
  }
  export type DeploymentStatus = "SUCCESS"|"FAIL"|string;
  export type DeploymentType = "Model"|string;
  export type DeviceFleetName = string;
  export type DeviceName = string;
  export type DeviceRegistration = string;
  export type Dimension = string;
  export interface EdgeDeployment {
    /**
     * The name and unique ID of the deployment.
     */
    DeploymentName?: EntityName;
    /**
     * The type of the deployment.
     */
    Type?: DeploymentType;
    /**
     * Determines whether to rollback to previous configuration if deployment fails.
     */
    FailureHandlingPolicy?: FailureHandlingPolicy;
    /**
     * Returns a list of Definition objects.
     */
    Definitions?: Definitions;
  }
  export type EdgeDeployments = EdgeDeployment[];
  export interface EdgeMetric {
    /**
     * The dimension of metrics published.
     */
    Dimension?: Dimension;
    /**
     * Returns the name of the metric.
     */
    MetricName?: Metric;
    /**
     * Returns the value of the metric.
     */
    Value?: Value;
    /**
     * Timestamp of when the metric was requested.
     */
    Timestamp?: Timestamp;
  }
  export type EdgeMetrics = EdgeMetric[];
  export type EntityName = string;
  export type FailureHandlingPolicy = "ROLLBACK_ON_FAILURE"|"DO_NOTHING"|string;
  export interface GetDeploymentsRequest {
    /**
     * The unique name of the device you want to get the configuration of active deployments from.
     */
    DeviceName: DeviceName;
    /**
     * The name of the fleet that the device belongs to.
     */
    DeviceFleetName: DeviceFleetName;
  }
  export interface GetDeploymentsResult {
    /**
     * Returns a list of the configurations of the active deployments on the device.
     */
    Deployments?: EdgeDeployments;
  }
  export interface GetDeviceRegistrationRequest {
    /**
     * The unique name of the device you want to get the registration status from.
     */
    DeviceName: DeviceName;
    /**
     * The name of the fleet that the device belongs to.
     */
    DeviceFleetName: DeviceFleetName;
  }
  export interface GetDeviceRegistrationResult {
    /**
     * Describes if the device is currently registered with SageMaker Edge Manager.
     */
    DeviceRegistration?: DeviceRegistration;
    /**
     * The amount of time, in seconds, that the registration status is stored on the device’s cache before it is refreshed.
     */
    CacheTTL?: CacheTTLSeconds;
  }
  export type Metric = string;
  export interface Model {
    /**
     * The name of the model.
     */
    ModelName?: ModelName;
    /**
     * The version of the model.
     */
    ModelVersion?: Version;
    /**
     * The timestamp of the last data sample taken.
     */
    LatestSampleTime?: Timestamp;
    /**
     * The timestamp of the last inference that was made.
     */
    LatestInference?: Timestamp;
    /**
     * Information required for model metrics.
     */
    ModelMetrics?: EdgeMetrics;
  }
  export type ModelName = string;
  export type ModelState = "DEPLOY"|"UNDEPLOY"|string;
  export type Models = Model[];
  export type S3Uri = string;
  export interface SendHeartbeatRequest {
    /**
     * For internal use. Returns a list of SageMaker Edge Manager agent operating metrics.
     */
    AgentMetrics?: EdgeMetrics;
    /**
     * Returns a list of models deployed on the the device.
     */
    Models?: Models;
    /**
     * Returns the version of the agent.
     */
    AgentVersion: Version;
    /**
     * The unique name of the device.
     */
    DeviceName: DeviceName;
    /**
     * The name of the fleet that the device belongs to.
     */
    DeviceFleetName: DeviceFleetName;
    /**
     * Returns the result of a deployment on the device.
     */
    DeploymentResult?: DeploymentResult;
  }
  export type String = string;
  export type Timestamp = Date;
  export type Value = number;
  export type Version = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-09-23"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SagemakerEdge client.
   */
  export import Types = SagemakerEdge;
}
export = SagemakerEdge;
