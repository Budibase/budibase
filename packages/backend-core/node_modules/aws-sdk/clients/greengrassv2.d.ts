import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class GreengrassV2 extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: GreengrassV2.Types.ClientConfiguration)
  config: Config & GreengrassV2.Types.ClientConfiguration;
  /**
   * Associate a list of client devices with a core device. Use this API operation to specify which client devices can discover a core device through cloud discovery. With cloud discovery, client devices connect to IoT Greengrass to retrieve associated core devices' connectivity information and certificates. For more information, see Configure cloud discovery in the IoT Greengrass V2 Developer Guide.  Client devices are local IoT devices that connect to and communicate with an IoT Greengrass core device over MQTT. You can connect client devices to a core device to sync MQTT messages and data to Amazon Web Services IoT Core and interact with client devices in Greengrass components. For more information, see Interact with local IoT devices in the IoT Greengrass V2 Developer Guide. 
   */
  batchAssociateClientDeviceWithCoreDevice(params: GreengrassV2.Types.BatchAssociateClientDeviceWithCoreDeviceRequest, callback?: (err: AWSError, data: GreengrassV2.Types.BatchAssociateClientDeviceWithCoreDeviceResponse) => void): Request<GreengrassV2.Types.BatchAssociateClientDeviceWithCoreDeviceResponse, AWSError>;
  /**
   * Associate a list of client devices with a core device. Use this API operation to specify which client devices can discover a core device through cloud discovery. With cloud discovery, client devices connect to IoT Greengrass to retrieve associated core devices' connectivity information and certificates. For more information, see Configure cloud discovery in the IoT Greengrass V2 Developer Guide.  Client devices are local IoT devices that connect to and communicate with an IoT Greengrass core device over MQTT. You can connect client devices to a core device to sync MQTT messages and data to Amazon Web Services IoT Core and interact with client devices in Greengrass components. For more information, see Interact with local IoT devices in the IoT Greengrass V2 Developer Guide. 
   */
  batchAssociateClientDeviceWithCoreDevice(callback?: (err: AWSError, data: GreengrassV2.Types.BatchAssociateClientDeviceWithCoreDeviceResponse) => void): Request<GreengrassV2.Types.BatchAssociateClientDeviceWithCoreDeviceResponse, AWSError>;
  /**
   * Disassociate a list of client devices from a core device. After you disassociate a client device from a core device, the client device won't be able to use cloud discovery to retrieve the core device's connectivity information and certificates.
   */
  batchDisassociateClientDeviceFromCoreDevice(params: GreengrassV2.Types.BatchDisassociateClientDeviceFromCoreDeviceRequest, callback?: (err: AWSError, data: GreengrassV2.Types.BatchDisassociateClientDeviceFromCoreDeviceResponse) => void): Request<GreengrassV2.Types.BatchDisassociateClientDeviceFromCoreDeviceResponse, AWSError>;
  /**
   * Disassociate a list of client devices from a core device. After you disassociate a client device from a core device, the client device won't be able to use cloud discovery to retrieve the core device's connectivity information and certificates.
   */
  batchDisassociateClientDeviceFromCoreDevice(callback?: (err: AWSError, data: GreengrassV2.Types.BatchDisassociateClientDeviceFromCoreDeviceResponse) => void): Request<GreengrassV2.Types.BatchDisassociateClientDeviceFromCoreDeviceResponse, AWSError>;
  /**
   * Cancels a deployment. This operation cancels the deployment for devices that haven't yet received it. If a device already received the deployment, this operation doesn't change anything for that device.
   */
  cancelDeployment(params: GreengrassV2.Types.CancelDeploymentRequest, callback?: (err: AWSError, data: GreengrassV2.Types.CancelDeploymentResponse) => void): Request<GreengrassV2.Types.CancelDeploymentResponse, AWSError>;
  /**
   * Cancels a deployment. This operation cancels the deployment for devices that haven't yet received it. If a device already received the deployment, this operation doesn't change anything for that device.
   */
  cancelDeployment(callback?: (err: AWSError, data: GreengrassV2.Types.CancelDeploymentResponse) => void): Request<GreengrassV2.Types.CancelDeploymentResponse, AWSError>;
  /**
   * Creates a component. Components are software that run on Greengrass core devices. After you develop and test a component on your core device, you can use this operation to upload your component to IoT Greengrass. Then, you can deploy the component to other core devices. You can use this operation to do the following:    Create components from recipes  Create a component from a recipe, which is a file that defines the component's metadata, parameters, dependencies, lifecycle, artifacts, and platform capability. For more information, see IoT Greengrass component recipe reference in the IoT Greengrass V2 Developer Guide. To create a component from a recipe, specify inlineRecipe when you call this operation.    Create components from Lambda functions  Create a component from an Lambda function that runs on IoT Greengrass. This creates a recipe and artifacts from the Lambda function's deployment package. You can use this operation to migrate Lambda functions from IoT Greengrass V1 to IoT Greengrass V2. This function only accepts Lambda functions that use the following runtimes:   Python 2.7 – python2.7    Python 3.7 – python3.7    Python 3.8 – python3.8    Java 8 – java8    Node.js 10 – nodejs10.x    Node.js 12 – nodejs12.x    To create a component from a Lambda function, specify lambdaFunction when you call this operation.  IoT Greengrass currently supports Lambda functions on only Linux core devices.   
   */
  createComponentVersion(params: GreengrassV2.Types.CreateComponentVersionRequest, callback?: (err: AWSError, data: GreengrassV2.Types.CreateComponentVersionResponse) => void): Request<GreengrassV2.Types.CreateComponentVersionResponse, AWSError>;
  /**
   * Creates a component. Components are software that run on Greengrass core devices. After you develop and test a component on your core device, you can use this operation to upload your component to IoT Greengrass. Then, you can deploy the component to other core devices. You can use this operation to do the following:    Create components from recipes  Create a component from a recipe, which is a file that defines the component's metadata, parameters, dependencies, lifecycle, artifacts, and platform capability. For more information, see IoT Greengrass component recipe reference in the IoT Greengrass V2 Developer Guide. To create a component from a recipe, specify inlineRecipe when you call this operation.    Create components from Lambda functions  Create a component from an Lambda function that runs on IoT Greengrass. This creates a recipe and artifacts from the Lambda function's deployment package. You can use this operation to migrate Lambda functions from IoT Greengrass V1 to IoT Greengrass V2. This function only accepts Lambda functions that use the following runtimes:   Python 2.7 – python2.7    Python 3.7 – python3.7    Python 3.8 – python3.8    Java 8 – java8    Node.js 10 – nodejs10.x    Node.js 12 – nodejs12.x    To create a component from a Lambda function, specify lambdaFunction when you call this operation.  IoT Greengrass currently supports Lambda functions on only Linux core devices.   
   */
  createComponentVersion(callback?: (err: AWSError, data: GreengrassV2.Types.CreateComponentVersionResponse) => void): Request<GreengrassV2.Types.CreateComponentVersionResponse, AWSError>;
  /**
   * Creates a continuous deployment for a target, which is a Greengrass core device or group of core devices. When you add a new core device to a group of core devices that has a deployment, IoT Greengrass deploys that group's deployment to the new device. You can define one deployment for each target. When you create a new deployment for a target that has an existing deployment, you replace the previous deployment. IoT Greengrass applies the new deployment to the target devices. Every deployment has a revision number that indicates how many deployment revisions you define for a target. Use this operation to create a new revision of an existing deployment. This operation returns the revision number of the new deployment when you create it. For more information, see the Create deployments in the IoT Greengrass V2 Developer Guide.
   */
  createDeployment(params: GreengrassV2.Types.CreateDeploymentRequest, callback?: (err: AWSError, data: GreengrassV2.Types.CreateDeploymentResponse) => void): Request<GreengrassV2.Types.CreateDeploymentResponse, AWSError>;
  /**
   * Creates a continuous deployment for a target, which is a Greengrass core device or group of core devices. When you add a new core device to a group of core devices that has a deployment, IoT Greengrass deploys that group's deployment to the new device. You can define one deployment for each target. When you create a new deployment for a target that has an existing deployment, you replace the previous deployment. IoT Greengrass applies the new deployment to the target devices. Every deployment has a revision number that indicates how many deployment revisions you define for a target. Use this operation to create a new revision of an existing deployment. This operation returns the revision number of the new deployment when you create it. For more information, see the Create deployments in the IoT Greengrass V2 Developer Guide.
   */
  createDeployment(callback?: (err: AWSError, data: GreengrassV2.Types.CreateDeploymentResponse) => void): Request<GreengrassV2.Types.CreateDeploymentResponse, AWSError>;
  /**
   * Deletes a version of a component from IoT Greengrass.  This operation deletes the component's recipe and artifacts. As a result, deployments that refer to this component version will fail. If you have deployments that use this component version, you can remove the component from the deployment or update the deployment to use a valid version. 
   */
  deleteComponent(params: GreengrassV2.Types.DeleteComponentRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a version of a component from IoT Greengrass.  This operation deletes the component's recipe and artifacts. As a result, deployments that refer to this component version will fail. If you have deployments that use this component version, you can remove the component from the deployment or update the deployment to use a valid version. 
   */
  deleteComponent(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Greengrass core device, which is an IoT thing. This operation removes the core device from the list of core devices. This operation doesn't delete the IoT thing. For more information about how to delete the IoT thing, see DeleteThing in the IoT API Reference.
   */
  deleteCoreDevice(params: GreengrassV2.Types.DeleteCoreDeviceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a Greengrass core device, which is an IoT thing. This operation removes the core device from the list of core devices. This operation doesn't delete the IoT thing. For more information about how to delete the IoT thing, see DeleteThing in the IoT API Reference.
   */
  deleteCoreDevice(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Retrieves metadata for a version of a component.
   */
  describeComponent(params: GreengrassV2.Types.DescribeComponentRequest, callback?: (err: AWSError, data: GreengrassV2.Types.DescribeComponentResponse) => void): Request<GreengrassV2.Types.DescribeComponentResponse, AWSError>;
  /**
   * Retrieves metadata for a version of a component.
   */
  describeComponent(callback?: (err: AWSError, data: GreengrassV2.Types.DescribeComponentResponse) => void): Request<GreengrassV2.Types.DescribeComponentResponse, AWSError>;
  /**
   * Gets the recipe for a version of a component. Core devices can call this operation to identify the artifacts and requirements to install a component.
   */
  getComponent(params: GreengrassV2.Types.GetComponentRequest, callback?: (err: AWSError, data: GreengrassV2.Types.GetComponentResponse) => void): Request<GreengrassV2.Types.GetComponentResponse, AWSError>;
  /**
   * Gets the recipe for a version of a component. Core devices can call this operation to identify the artifacts and requirements to install a component.
   */
  getComponent(callback?: (err: AWSError, data: GreengrassV2.Types.GetComponentResponse) => void): Request<GreengrassV2.Types.GetComponentResponse, AWSError>;
  /**
   * Gets the pre-signed URL to download a public component artifact. Core devices call this operation to identify the URL that they can use to download an artifact to install.
   */
  getComponentVersionArtifact(params: GreengrassV2.Types.GetComponentVersionArtifactRequest, callback?: (err: AWSError, data: GreengrassV2.Types.GetComponentVersionArtifactResponse) => void): Request<GreengrassV2.Types.GetComponentVersionArtifactResponse, AWSError>;
  /**
   * Gets the pre-signed URL to download a public component artifact. Core devices call this operation to identify the URL that they can use to download an artifact to install.
   */
  getComponentVersionArtifact(callback?: (err: AWSError, data: GreengrassV2.Types.GetComponentVersionArtifactResponse) => void): Request<GreengrassV2.Types.GetComponentVersionArtifactResponse, AWSError>;
  /**
   * Retrieves metadata for a Greengrass core device.
   */
  getCoreDevice(params: GreengrassV2.Types.GetCoreDeviceRequest, callback?: (err: AWSError, data: GreengrassV2.Types.GetCoreDeviceResponse) => void): Request<GreengrassV2.Types.GetCoreDeviceResponse, AWSError>;
  /**
   * Retrieves metadata for a Greengrass core device.
   */
  getCoreDevice(callback?: (err: AWSError, data: GreengrassV2.Types.GetCoreDeviceResponse) => void): Request<GreengrassV2.Types.GetCoreDeviceResponse, AWSError>;
  /**
   * Gets a deployment. Deployments define the components that run on Greengrass core devices.
   */
  getDeployment(params: GreengrassV2.Types.GetDeploymentRequest, callback?: (err: AWSError, data: GreengrassV2.Types.GetDeploymentResponse) => void): Request<GreengrassV2.Types.GetDeploymentResponse, AWSError>;
  /**
   * Gets a deployment. Deployments define the components that run on Greengrass core devices.
   */
  getDeployment(callback?: (err: AWSError, data: GreengrassV2.Types.GetDeploymentResponse) => void): Request<GreengrassV2.Types.GetDeploymentResponse, AWSError>;
  /**
   * Retrieves a paginated list of client devices that are associated with a core device.
   */
  listClientDevicesAssociatedWithCoreDevice(params: GreengrassV2.Types.ListClientDevicesAssociatedWithCoreDeviceRequest, callback?: (err: AWSError, data: GreengrassV2.Types.ListClientDevicesAssociatedWithCoreDeviceResponse) => void): Request<GreengrassV2.Types.ListClientDevicesAssociatedWithCoreDeviceResponse, AWSError>;
  /**
   * Retrieves a paginated list of client devices that are associated with a core device.
   */
  listClientDevicesAssociatedWithCoreDevice(callback?: (err: AWSError, data: GreengrassV2.Types.ListClientDevicesAssociatedWithCoreDeviceResponse) => void): Request<GreengrassV2.Types.ListClientDevicesAssociatedWithCoreDeviceResponse, AWSError>;
  /**
   * Retrieves a paginated list of all versions for a component. Greater versions are listed first.
   */
  listComponentVersions(params: GreengrassV2.Types.ListComponentVersionsRequest, callback?: (err: AWSError, data: GreengrassV2.Types.ListComponentVersionsResponse) => void): Request<GreengrassV2.Types.ListComponentVersionsResponse, AWSError>;
  /**
   * Retrieves a paginated list of all versions for a component. Greater versions are listed first.
   */
  listComponentVersions(callback?: (err: AWSError, data: GreengrassV2.Types.ListComponentVersionsResponse) => void): Request<GreengrassV2.Types.ListComponentVersionsResponse, AWSError>;
  /**
   * Retrieves a paginated list of component summaries. This list includes components that you have permission to view.
   */
  listComponents(params: GreengrassV2.Types.ListComponentsRequest, callback?: (err: AWSError, data: GreengrassV2.Types.ListComponentsResponse) => void): Request<GreengrassV2.Types.ListComponentsResponse, AWSError>;
  /**
   * Retrieves a paginated list of component summaries. This list includes components that you have permission to view.
   */
  listComponents(callback?: (err: AWSError, data: GreengrassV2.Types.ListComponentsResponse) => void): Request<GreengrassV2.Types.ListComponentsResponse, AWSError>;
  /**
   * Retrieves a paginated list of Greengrass core devices.
   */
  listCoreDevices(params: GreengrassV2.Types.ListCoreDevicesRequest, callback?: (err: AWSError, data: GreengrassV2.Types.ListCoreDevicesResponse) => void): Request<GreengrassV2.Types.ListCoreDevicesResponse, AWSError>;
  /**
   * Retrieves a paginated list of Greengrass core devices.
   */
  listCoreDevices(callback?: (err: AWSError, data: GreengrassV2.Types.ListCoreDevicesResponse) => void): Request<GreengrassV2.Types.ListCoreDevicesResponse, AWSError>;
  /**
   * Retrieves a paginated list of deployments.
   */
  listDeployments(params: GreengrassV2.Types.ListDeploymentsRequest, callback?: (err: AWSError, data: GreengrassV2.Types.ListDeploymentsResponse) => void): Request<GreengrassV2.Types.ListDeploymentsResponse, AWSError>;
  /**
   * Retrieves a paginated list of deployments.
   */
  listDeployments(callback?: (err: AWSError, data: GreengrassV2.Types.ListDeploymentsResponse) => void): Request<GreengrassV2.Types.ListDeploymentsResponse, AWSError>;
  /**
   * Retrieves a paginated list of deployment jobs that IoT Greengrass sends to Greengrass core devices.
   */
  listEffectiveDeployments(params: GreengrassV2.Types.ListEffectiveDeploymentsRequest, callback?: (err: AWSError, data: GreengrassV2.Types.ListEffectiveDeploymentsResponse) => void): Request<GreengrassV2.Types.ListEffectiveDeploymentsResponse, AWSError>;
  /**
   * Retrieves a paginated list of deployment jobs that IoT Greengrass sends to Greengrass core devices.
   */
  listEffectiveDeployments(callback?: (err: AWSError, data: GreengrassV2.Types.ListEffectiveDeploymentsResponse) => void): Request<GreengrassV2.Types.ListEffectiveDeploymentsResponse, AWSError>;
  /**
   * Retrieves a paginated list of the components that a Greengrass core device runs.
   */
  listInstalledComponents(params: GreengrassV2.Types.ListInstalledComponentsRequest, callback?: (err: AWSError, data: GreengrassV2.Types.ListInstalledComponentsResponse) => void): Request<GreengrassV2.Types.ListInstalledComponentsResponse, AWSError>;
  /**
   * Retrieves a paginated list of the components that a Greengrass core device runs.
   */
  listInstalledComponents(callback?: (err: AWSError, data: GreengrassV2.Types.ListInstalledComponentsResponse) => void): Request<GreengrassV2.Types.ListInstalledComponentsResponse, AWSError>;
  /**
   * Retrieves the list of tags for an IoT Greengrass resource.
   */
  listTagsForResource(params: GreengrassV2.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: GreengrassV2.Types.ListTagsForResourceResponse) => void): Request<GreengrassV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves the list of tags for an IoT Greengrass resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: GreengrassV2.Types.ListTagsForResourceResponse) => void): Request<GreengrassV2.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Retrieves a list of components that meet the component, version, and platform requirements of a deployment. Greengrass core devices call this operation when they receive a deployment to identify the components to install. This operation identifies components that meet all dependency requirements for a deployment. If the requirements conflict, then this operation returns an error and the deployment fails. For example, this occurs if component A requires version &gt;2.0.0 and component B requires version &lt;2.0.0 of a component dependency. When you specify the component candidates to resolve, IoT Greengrass compares each component's digest from the core device with the component's digest in the Amazon Web Services Cloud. If the digests don't match, then IoT Greengrass specifies to use the version from the Amazon Web Services Cloud.  To use this operation, you must use the data plane API endpoint and authenticate with an IoT device certificate. For more information, see IoT Greengrass endpoints and quotas. 
   */
  resolveComponentCandidates(params: GreengrassV2.Types.ResolveComponentCandidatesRequest, callback?: (err: AWSError, data: GreengrassV2.Types.ResolveComponentCandidatesResponse) => void): Request<GreengrassV2.Types.ResolveComponentCandidatesResponse, AWSError>;
  /**
   * Retrieves a list of components that meet the component, version, and platform requirements of a deployment. Greengrass core devices call this operation when they receive a deployment to identify the components to install. This operation identifies components that meet all dependency requirements for a deployment. If the requirements conflict, then this operation returns an error and the deployment fails. For example, this occurs if component A requires version &gt;2.0.0 and component B requires version &lt;2.0.0 of a component dependency. When you specify the component candidates to resolve, IoT Greengrass compares each component's digest from the core device with the component's digest in the Amazon Web Services Cloud. If the digests don't match, then IoT Greengrass specifies to use the version from the Amazon Web Services Cloud.  To use this operation, you must use the data plane API endpoint and authenticate with an IoT device certificate. For more information, see IoT Greengrass endpoints and quotas. 
   */
  resolveComponentCandidates(callback?: (err: AWSError, data: GreengrassV2.Types.ResolveComponentCandidatesResponse) => void): Request<GreengrassV2.Types.ResolveComponentCandidatesResponse, AWSError>;
  /**
   * Adds tags to an IoT Greengrass resource. If a tag already exists for the resource, this operation updates the tag's value.
   */
  tagResource(params: GreengrassV2.Types.TagResourceRequest, callback?: (err: AWSError, data: GreengrassV2.Types.TagResourceResponse) => void): Request<GreengrassV2.Types.TagResourceResponse, AWSError>;
  /**
   * Adds tags to an IoT Greengrass resource. If a tag already exists for the resource, this operation updates the tag's value.
   */
  tagResource(callback?: (err: AWSError, data: GreengrassV2.Types.TagResourceResponse) => void): Request<GreengrassV2.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a tag from an IoT Greengrass resource.
   */
  untagResource(params: GreengrassV2.Types.UntagResourceRequest, callback?: (err: AWSError, data: GreengrassV2.Types.UntagResourceResponse) => void): Request<GreengrassV2.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a tag from an IoT Greengrass resource.
   */
  untagResource(callback?: (err: AWSError, data: GreengrassV2.Types.UntagResourceResponse) => void): Request<GreengrassV2.Types.UntagResourceResponse, AWSError>;
}
declare namespace GreengrassV2 {
  export interface AssociateClientDeviceWithCoreDeviceEntry {
    /**
     * The name of the IoT thing that represents the client device to associate.
     */
    thingName: IoTThingName;
  }
  export type AssociateClientDeviceWithCoreDeviceEntryList = AssociateClientDeviceWithCoreDeviceEntry[];
  export interface AssociateClientDeviceWithCoreDeviceErrorEntry {
    /**
     * The name of the IoT thing whose associate request failed.
     */
    thingName?: IoTThingName;
    /**
     * The error code for the request.
     */
    code?: NonEmptyString;
    /**
     * A message that provides additional information about the error.
     */
    message?: NonEmptyString;
  }
  export type AssociateClientDeviceWithCoreDeviceErrorList = AssociateClientDeviceWithCoreDeviceErrorEntry[];
  export interface AssociatedClientDevice {
    /**
     * The name of the IoT thing that represents the associated client device.
     */
    thingName?: IoTThingName;
    /**
     * The time that the client device was associated, expressed in ISO 8601 format.
     */
    associationTimestamp?: Timestamp;
  }
  export type AssociatedClientDeviceList = AssociatedClientDevice[];
  export interface BatchAssociateClientDeviceWithCoreDeviceRequest {
    /**
     * The list of client devices to associate.
     */
    entries?: AssociateClientDeviceWithCoreDeviceEntryList;
    /**
     * The name of the core device. This is also the name of the IoT thing.
     */
    coreDeviceThingName: IoTThingName;
  }
  export interface BatchAssociateClientDeviceWithCoreDeviceResponse {
    /**
     * The list of any errors for the entries in the request. Each error entry contains the name of the IoT thing that failed to associate.
     */
    errorEntries?: AssociateClientDeviceWithCoreDeviceErrorList;
  }
  export interface BatchDisassociateClientDeviceFromCoreDeviceRequest {
    /**
     * The list of client devices to disassociate.
     */
    entries?: DisassociateClientDeviceFromCoreDeviceEntryList;
    /**
     * The name of the core device. This is also the name of the IoT thing.
     */
    coreDeviceThingName: IoTThingName;
  }
  export interface BatchDisassociateClientDeviceFromCoreDeviceResponse {
    /**
     * The list of errors (if any) for the entries in the request. Each error entry contains the name of the IoT thing that failed to disassociate.
     */
    errorEntries?: DisassociateClientDeviceFromCoreDeviceErrorList;
  }
  export type CPU = number;
  export interface CancelDeploymentRequest {
    /**
     * The ID of the deployment.
     */
    deploymentId: NonEmptyString;
  }
  export interface CancelDeploymentResponse {
    /**
     * A message that communicates if the cancel was successful.
     */
    message?: NonEmptyString;
  }
  export type ClientTokenString = string;
  export type CloudComponentState = "REQUESTED"|"INITIATED"|"DEPLOYABLE"|"FAILED"|"DEPRECATED"|string;
  export interface CloudComponentStatus {
    /**
     * The state of the component.
     */
    componentState?: CloudComponentState;
    /**
     * A message that communicates details, such as errors, about the status of the component.
     */
    message?: NonEmptyString;
    /**
     * A dictionary of errors that communicate why the component is in an error state. For example, if IoT Greengrass can't access an artifact for the component, then errors contains the artifact's URI as a key, and the error message as the value for that key.
     */
    errors?: StringMap;
  }
  export interface Component {
    /**
     * The ARN of the component version.
     */
    arn?: ComponentARN;
    /**
     * The name of the component.
     */
    componentName?: ComponentNameString;
    /**
     * The latest version of the component and its details.
     */
    latestVersion?: ComponentLatestVersion;
  }
  export type ComponentARN = string;
  export interface ComponentCandidate {
    /**
     * The name of the component.
     */
    componentName?: ComponentNameString;
    /**
     * The version of the component.
     */
    componentVersion?: ComponentVersionString;
    /**
     * The version requirements for the component's dependencies. Greengrass core devices get the version requirements from component recipes. IoT Greengrass V2 uses semantic version constraints. For more information, see Semantic Versioning.
     */
    versionRequirements?: ComponentVersionRequirementMap;
  }
  export type ComponentCandidateList = ComponentCandidate[];
  export type ComponentConfigurationPath = string;
  export type ComponentConfigurationPathList = ComponentConfigurationPath[];
  export type ComponentConfigurationString = string;
  export interface ComponentConfigurationUpdate {
    /**
     * A serialized JSON string that contains the configuration object to merge to target devices. The core device merges this configuration with the component's existing configuration. If this is the first time a component deploys on a device, the core device merges this configuration with the component's default configuration. This means that the core device keeps it's existing configuration for keys and values that you don't specify in this object. For more information, see Merge configuration updates in the IoT Greengrass V2 Developer Guide.
     */
    merge?: ComponentConfigurationString;
    /**
     * The list of configuration nodes to reset to default values on target devices. Use JSON pointers to specify each node to reset. JSON pointers start with a forward slash (/) and use forward slashes to separate the key for each level in the object. For more information, see the JSON pointer specification and Reset configuration updates in the IoT Greengrass V2 Developer Guide.
     */
    reset?: ComponentConfigurationPathList;
  }
  export type ComponentDependencyMap = {[key: string]: ComponentDependencyRequirement};
  export interface ComponentDependencyRequirement {
    /**
     * The component version requirement for the component dependency. IoT Greengrass V2 uses semantic version constraints. For more information, see Semantic Versioning.
     */
    versionRequirement?: NonEmptyString;
    /**
     * The type of this dependency. Choose from the following options:    SOFT – The component doesn't restart if the dependency changes state.    HARD – The component restarts if the dependency changes state.   Default: HARD 
     */
    dependencyType?: ComponentDependencyType;
  }
  export type ComponentDependencyType = "HARD"|"SOFT"|string;
  export interface ComponentDeploymentSpecification {
    /**
     * The version of the component.
     */
    componentVersion?: ComponentVersionString;
    /**
     * The configuration updates to deploy for the component. You can define reset updates and merge updates. A reset updates the keys that you specify to the default configuration for the component. A merge updates the core device's component configuration with the keys and values that you specify. The IoT Greengrass Core software applies reset updates before it applies merge updates. For more information, see Update component configurations in the IoT Greengrass V2 Developer Guide.
     */
    configurationUpdate?: ComponentConfigurationUpdate;
    /**
     * The system user and group that the IoT Greengrass Core software uses to run component processes on the core device. If you omit this parameter, the IoT Greengrass Core software uses the system user and group that you configure for the core device. For more information, see Configure the user and group that run components in the IoT Greengrass V2 Developer Guide.
     */
    runWith?: ComponentRunWith;
  }
  export type ComponentDeploymentSpecifications = {[key: string]: ComponentDeploymentSpecification};
  export interface ComponentLatestVersion {
    /**
     * The ARN of the component version.
     */
    arn?: ComponentVersionARN;
    /**
     * The version of the component.
     */
    componentVersion?: ComponentVersionString;
    /**
     * The time at which the component was created, expressed in ISO 8601 format.
     */
    creationTimestamp?: Timestamp;
    /**
     * The description of the component version.
     */
    description?: NonEmptyString;
    /**
     * The publisher of the component version.
     */
    publisher?: NonEmptyString;
    /**
     * The platforms that the component version supports.
     */
    platforms?: ComponentPlatformList;
  }
  export type ComponentList = Component[];
  export type ComponentNameString = string;
  export interface ComponentPlatform {
    /**
     * The friendly name of the platform. This name helps you identify the platform. If you omit this parameter, IoT Greengrass creates a friendly name from the os and architecture of the platform.
     */
    name?: NonEmptyString;
    /**
     * A dictionary of attributes for the platform. The IoT Greengrass Core software defines the os and platform by default. You can specify additional platform attributes for a core device when you deploy the Greengrass nucleus component. For more information, see the Greengrass nucleus component in the IoT Greengrass V2 Developer Guide.
     */
    attributes?: PlatformAttributesMap;
  }
  export type ComponentPlatformList = ComponentPlatform[];
  export interface ComponentRunWith {
    /**
     * The POSIX system user and, optionally, group to use to run this component on Linux core devices. The user, and group if specified, must exist on each Linux core device. Specify the user and group separated by a colon (:) in the following format: user:group. The group is optional. If you don't specify a group, the IoT Greengrass Core software uses the primary user for the group. If you omit this parameter, the IoT Greengrass Core software uses the default system user and group that you configure on the Greengrass nucleus component. For more information, see Configure the user and group that run components.
     */
    posixUser?: NonEmptyString;
    /**
     * The system resource limits to apply to this component's process on the core device. IoT Greengrass currently supports this feature on only Linux core devices. If you omit this parameter, the IoT Greengrass Core software uses the default system resource limits that you configure on the Greengrass nucleus component. For more information, see Configure system resource limits for components.
     */
    systemResourceLimits?: SystemResourceLimits;
    /**
     * The Windows user to use to run this component on Windows core devices. The user must exist on each Windows core device, and its name and password must be in the LocalSystem account's Credentials Manager instance. If you omit this parameter, the IoT Greengrass Core software uses the default Windows user that you configure on the Greengrass nucleus component. For more information, see Configure the user and group that run components.
     */
    windowsUser?: NonEmptyString;
  }
  export type ComponentVersionARN = string;
  export type ComponentVersionList = ComponentVersionListItem[];
  export interface ComponentVersionListItem {
    /**
     * The name of the component.
     */
    componentName?: ComponentNameString;
    /**
     * The version of the component.
     */
    componentVersion?: ComponentVersionString;
    /**
     * The ARN of the component version.
     */
    arn?: NonEmptyString;
  }
  export type ComponentVersionRequirementMap = {[key: string]: NonEmptyString};
  export type ComponentVersionString = string;
  export type ComponentVisibilityScope = "PRIVATE"|"PUBLIC"|string;
  export interface CoreDevice {
    /**
     * The name of the core device. This is also the name of the IoT thing.
     */
    coreDeviceThingName?: CoreDeviceThingName;
    /**
     * The status of the core device. Core devices can have the following statuses:    HEALTHY – The IoT Greengrass Core software and all components run on the core device without issue.    UNHEALTHY – The IoT Greengrass Core software or a component is in a failed state on the core device.  
     */
    status?: CoreDeviceStatus;
    /**
     * The time at which the core device's status last updated, expressed in ISO 8601 format.
     */
    lastStatusUpdateTimestamp?: Timestamp;
  }
  export type CoreDeviceArchitectureString = string;
  export type CoreDevicePlatformString = string;
  export type CoreDeviceStatus = "HEALTHY"|"UNHEALTHY"|string;
  export type CoreDeviceThingName = string;
  export type CoreDevicesList = CoreDevice[];
  export interface CreateComponentVersionRequest {
    /**
     * The recipe to use to create the component. The recipe defines the component's metadata, parameters, dependencies, lifecycle, artifacts, and platform compatibility. You must specify either inlineRecipe or lambdaFunction.
     */
    inlineRecipe?: RecipeBlob;
    /**
     * The parameters to create a component from a Lambda function. You must specify either inlineRecipe or lambdaFunction.
     */
    lambdaFunction?: LambdaFunctionRecipeSource;
    /**
     * A list of key-value pairs that contain metadata for the resource. For more information, see Tag your resources in the IoT Greengrass V2 Developer Guide.
     */
    tags?: TagMap;
    /**
     * A unique, case-sensitive identifier that you can provide to ensure that the request is idempotent. Idempotency means that the request is successfully processed only once, even if you send the request multiple times. When a request succeeds, and you specify the same client token for subsequent successful requests, the IoT Greengrass V2 service returns the successful response that it caches from the previous request. IoT Greengrass V2 caches successful responses for idempotent requests for up to 8 hours.
     */
    clientToken?: ClientTokenString;
  }
  export interface CreateComponentVersionResponse {
    /**
     * The ARN of the component version.
     */
    arn?: ComponentVersionARN;
    /**
     * The name of the component.
     */
    componentName: ComponentNameString;
    /**
     * The version of the component.
     */
    componentVersion: ComponentVersionString;
    /**
     * The time at which the component was created, expressed in ISO 8601 format.
     */
    creationTimestamp: Timestamp;
    /**
     * The status of the component version in IoT Greengrass V2. This status is different from the status of the component on a core device.
     */
    status: CloudComponentStatus;
  }
  export interface CreateDeploymentRequest {
    /**
     * The ARN of the target IoT thing or thing group.
     */
    targetArn: TargetARN;
    /**
     * The name of the deployment.
     */
    deploymentName?: NonEmptyString;
    /**
     * The components to deploy. This is a dictionary, where each key is the name of a component, and each key's value is the version and configuration to deploy for that component.
     */
    components?: ComponentDeploymentSpecifications;
    /**
     * The job configuration for the deployment configuration. The job configuration specifies the rollout, timeout, and stop configurations for the deployment configuration.
     */
    iotJobConfiguration?: DeploymentIoTJobConfiguration;
    /**
     * The deployment policies for the deployment. These policies define how the deployment updates components and handles failure.
     */
    deploymentPolicies?: DeploymentPolicies;
    /**
     * A list of key-value pairs that contain metadata for the resource. For more information, see Tag your resources in the IoT Greengrass V2 Developer Guide.
     */
    tags?: TagMap;
    /**
     * A unique, case-sensitive identifier that you can provide to ensure that the request is idempotent. Idempotency means that the request is successfully processed only once, even if you send the request multiple times. When a request succeeds, and you specify the same client token for subsequent successful requests, the IoT Greengrass V2 service returns the successful response that it caches from the previous request. IoT Greengrass V2 caches successful responses for idempotent requests for up to 8 hours.
     */
    clientToken?: ClientTokenString;
  }
  export interface CreateDeploymentResponse {
    /**
     * The ID of the deployment.
     */
    deploymentId?: NonEmptyString;
    /**
     * The ID of the IoT job that applies the deployment to target devices.
     */
    iotJobId?: NonEmptyString;
    /**
     * The ARN of the IoT job that applies the deployment to target devices.
     */
    iotJobArn?: IoTJobARN;
  }
  export type DefaultMaxResults = number;
  export interface DeleteComponentRequest {
    /**
     * The ARN of the component version.
     */
    arn: ComponentVersionARN;
  }
  export interface DeleteCoreDeviceRequest {
    /**
     * The name of the core device. This is also the name of the IoT thing.
     */
    coreDeviceThingName: CoreDeviceThingName;
  }
  export interface Deployment {
    /**
     * The ARN of the target IoT thing or thing group.
     */
    targetArn?: TargetARN;
    /**
     * The revision number of the deployment.
     */
    revisionId?: NonEmptyString;
    /**
     * The ID of the deployment.
     */
    deploymentId?: NonEmptyString;
    /**
     * The name of the deployment.
     */
    deploymentName?: NonEmptyString;
    /**
     * The time at which the deployment was created, expressed in ISO 8601 format.
     */
    creationTimestamp?: Timestamp;
    /**
     * The status of the deployment.
     */
    deploymentStatus?: DeploymentStatus;
    /**
     * Whether or not the deployment is the latest revision for its target.
     */
    isLatestForTarget?: IsLatestForTarget;
  }
  export interface DeploymentComponentUpdatePolicy {
    /**
     * The amount of time in seconds that each component on a device has to report that it's safe to update. If the component waits for longer than this timeout, then the deployment proceeds on the device. Default: 60 
     */
    timeoutInSeconds?: OptionalInteger;
    /**
     * Whether or not to notify components and wait for components to become safe to update. Choose from the following options:    NOTIFY_COMPONENTS – The deployment notifies each component before it stops and updates that component. Components can use the SubscribeToComponentUpdates IPC operation to receive these notifications. Then, components can respond with the DeferComponentUpdate IPC operation. For more information, see Create deployments in the IoT Greengrass V2 Developer Guide.    SKIP_NOTIFY_COMPONENTS – The deployment doesn't notify components or wait for them to be safe to update.   Default: NOTIFY_COMPONENTS 
     */
    action?: DeploymentComponentUpdatePolicyAction;
  }
  export type DeploymentComponentUpdatePolicyAction = "NOTIFY_COMPONENTS"|"SKIP_NOTIFY_COMPONENTS"|string;
  export interface DeploymentConfigurationValidationPolicy {
    /**
     * The amount of time in seconds that a component can validate its configuration updates. If the validation time exceeds this timeout, then the deployment proceeds for the device. Default: 30 
     */
    timeoutInSeconds?: OptionalInteger;
  }
  export type DeploymentFailureHandlingPolicy = "ROLLBACK"|"DO_NOTHING"|string;
  export type DeploymentHistoryFilter = "ALL"|"LATEST_ONLY"|string;
  export type DeploymentID = string;
  export interface DeploymentIoTJobConfiguration {
    /**
     * The rollout configuration for the job. This configuration defines the rate at which the job rolls out to the fleet of target devices.
     */
    jobExecutionsRolloutConfig?: IoTJobExecutionsRolloutConfig;
    /**
     * The stop configuration for the job. This configuration defines when and how to stop a job rollout.
     */
    abortConfig?: IoTJobAbortConfig;
    /**
     * The timeout configuration for the job. This configuration defines the amount of time each device has to complete the job.
     */
    timeoutConfig?: IoTJobTimeoutConfig;
  }
  export type DeploymentList = Deployment[];
  export type DeploymentName = string;
  export interface DeploymentPolicies {
    /**
     * The failure handling policy for the configuration deployment. This policy defines what to do if the deployment fails. Default: ROLLBACK 
     */
    failureHandlingPolicy?: DeploymentFailureHandlingPolicy;
    /**
     * The component update policy for the configuration deployment. This policy defines when it's safe to deploy the configuration to devices.
     */
    componentUpdatePolicy?: DeploymentComponentUpdatePolicy;
    /**
     * The configuration validation policy for the configuration deployment. This policy defines how long each component has to validate its configure updates.
     */
    configurationValidationPolicy?: DeploymentConfigurationValidationPolicy;
  }
  export type DeploymentStatus = "ACTIVE"|"COMPLETED"|"CANCELED"|"FAILED"|"INACTIVE"|string;
  export interface DescribeComponentRequest {
    /**
     * The ARN of the component version.
     */
    arn: ComponentVersionARN;
  }
  export interface DescribeComponentResponse {
    /**
     * The ARN of the component version.
     */
    arn?: ComponentVersionARN;
    /**
     * The name of the component.
     */
    componentName?: ComponentNameString;
    /**
     * The version of the component.
     */
    componentVersion?: ComponentVersionString;
    /**
     * The time at which the component was created, expressed in ISO 8601 format.
     */
    creationTimestamp?: Timestamp;
    /**
     * The publisher of the component version.
     */
    publisher?: PublisherString;
    /**
     * The description of the component version.
     */
    description?: DescriptionString;
    /**
     * The status of the component version in IoT Greengrass V2. This status is different from the status of the component on a core device.
     */
    status?: CloudComponentStatus;
    /**
     * The platforms that the component version supports.
     */
    platforms?: ComponentPlatformList;
    /**
     * A list of key-value pairs that contain metadata for the resource. For more information, see Tag your resources in the IoT Greengrass V2 Developer Guide.
     */
    tags?: TagMap;
  }
  export type Description = string;
  export type DescriptionString = string;
  export interface DisassociateClientDeviceFromCoreDeviceEntry {
    /**
     * The name of the IoT thing that represents the client device to disassociate.
     */
    thingName: IoTThingName;
  }
  export type DisassociateClientDeviceFromCoreDeviceEntryList = DisassociateClientDeviceFromCoreDeviceEntry[];
  export interface DisassociateClientDeviceFromCoreDeviceErrorEntry {
    /**
     * The name of the IoT thing whose disassociate request failed.
     */
    thingName?: IoTThingName;
    /**
     * The error code for the request.
     */
    code?: NonEmptyString;
    /**
     * A message that provides additional information about the error.
     */
    message?: NonEmptyString;
  }
  export type DisassociateClientDeviceFromCoreDeviceErrorList = DisassociateClientDeviceFromCoreDeviceErrorEntry[];
  export interface EffectiveDeployment {
    /**
     * The ID of the deployment.
     */
    deploymentId: DeploymentID;
    /**
     * The name of the deployment.
     */
    deploymentName: DeploymentName;
    /**
     * The ID of the IoT job that applies the deployment to target devices.
     */
    iotJobId?: IoTJobId;
    /**
     * The ARN of the IoT job that applies the deployment to target devices.
     */
    iotJobArn?: IoTJobARN;
    /**
     * The description of the deployment job.
     */
    description?: Description;
    /**
     * The ARN of the target IoT thing or thing group.
     */
    targetArn: TargetARN;
    /**
     * The status of the deployment job on the Greengrass core device.
     */
    coreDeviceExecutionStatus: EffectiveDeploymentExecutionStatus;
    /**
     * The reason code for the update, if the job was updated.
     */
    reason?: Reason;
    /**
     * The time at which the deployment was created, expressed in ISO 8601 format.
     */
    creationTimestamp: Timestamp;
    /**
     * The time at which the deployment job was last modified, expressed in ISO 8601 format.
     */
    modifiedTimestamp: Timestamp;
  }
  export type EffectiveDeploymentExecutionStatus = "IN_PROGRESS"|"QUEUED"|"FAILED"|"COMPLETED"|"TIMED_OUT"|"CANCELED"|"REJECTED"|string;
  export type EffectiveDeploymentsList = EffectiveDeployment[];
  export type FileSystemPath = string;
  export type GGCVersion = string;
  export type GenericV2ARN = string;
  export interface GetComponentRequest {
    /**
     * The format of the recipe.
     */
    recipeOutputFormat?: RecipeOutputFormat;
    /**
     * The ARN of the component version.
     */
    arn: ComponentVersionARN;
  }
  export interface GetComponentResponse {
    /**
     * The format of the recipe.
     */
    recipeOutputFormat: RecipeOutputFormat;
    /**
     * The recipe of the component version.
     */
    recipe: RecipeBlob;
    /**
     * A list of key-value pairs that contain metadata for the resource. For more information, see Tag your resources in the IoT Greengrass V2 Developer Guide.
     */
    tags?: TagMap;
  }
  export interface GetComponentVersionArtifactRequest {
    /**
     * The ARN of the component version. Specify the ARN of a public component version.
     */
    arn: ComponentVersionARN;
    /**
     * The name of the artifact. You can use the GetComponent operation to download the component recipe, which includes the URI of the artifact. The artifact name is the section of the URI after the scheme. For example, in the artifact URI greengrass:SomeArtifact.zip, the artifact name is SomeArtifact.zip.
     */
    artifactName: NonEmptyString;
  }
  export interface GetComponentVersionArtifactResponse {
    /**
     * The URL of the artifact.
     */
    preSignedUrl: NonEmptyString;
  }
  export interface GetCoreDeviceRequest {
    /**
     * The name of the core device. This is also the name of the IoT thing.
     */
    coreDeviceThingName: CoreDeviceThingName;
  }
  export interface GetCoreDeviceResponse {
    /**
     * The name of the core device. This is also the name of the IoT thing.
     */
    coreDeviceThingName?: CoreDeviceThingName;
    /**
     * The version of the IoT Greengrass Core software that the core device runs. This version is equivalent to the version of the Greengrass nucleus component that runs on the core device. For more information, see the Greengrass nucleus component in the IoT Greengrass V2 Developer Guide.
     */
    coreVersion?: GGCVersion;
    /**
     * The operating system platform that the core device runs.
     */
    platform?: CoreDevicePlatformString;
    /**
     * The computer architecture of the core device.
     */
    architecture?: CoreDeviceArchitectureString;
    /**
     * The status of the core device. The core device status can be:    HEALTHY – The IoT Greengrass Core software and all components run on the core device without issue.    UNHEALTHY – The IoT Greengrass Core software or a component is in a failed state on the core device.  
     */
    status?: CoreDeviceStatus;
    /**
     * The time at which the core device's status last updated, expressed in ISO 8601 format.
     */
    lastStatusUpdateTimestamp?: Timestamp;
    /**
     * A list of key-value pairs that contain metadata for the resource. For more information, see Tag your resources in the IoT Greengrass V2 Developer Guide.
     */
    tags?: TagMap;
  }
  export interface GetDeploymentRequest {
    /**
     * The ID of the deployment.
     */
    deploymentId: NonEmptyString;
  }
  export interface GetDeploymentResponse {
    /**
     * The ARN of the target IoT thing or thing group.
     */
    targetArn?: TargetARN;
    /**
     * The revision number of the deployment.
     */
    revisionId?: NonEmptyString;
    /**
     * The ID of the deployment.
     */
    deploymentId?: NonEmptyString;
    /**
     * The name of the deployment.
     */
    deploymentName?: NullableString;
    /**
     * The status of the deployment.
     */
    deploymentStatus?: DeploymentStatus;
    /**
     * The ID of the IoT job that applies the deployment to target devices.
     */
    iotJobId?: NullableString;
    /**
     * The ARN of the IoT job that applies the deployment to target devices.
     */
    iotJobArn?: IoTJobARN;
    /**
     * The components to deploy. This is a dictionary, where each key is the name of a component, and each key's value is the version and configuration to deploy for that component.
     */
    components?: ComponentDeploymentSpecifications;
    /**
     * The deployment policies for the deployment. These policies define how the deployment updates components and handles failure.
     */
    deploymentPolicies?: DeploymentPolicies;
    /**
     * The job configuration for the deployment configuration. The job configuration specifies the rollout, timeout, and stop configurations for the deployment configuration.
     */
    iotJobConfiguration?: DeploymentIoTJobConfiguration;
    /**
     * The time at which the deployment was created, expressed in ISO 8601 format.
     */
    creationTimestamp?: Timestamp;
    /**
     * Whether or not the deployment is the latest revision for its target.
     */
    isLatestForTarget?: IsLatestForTarget;
    /**
     * A list of key-value pairs that contain metadata for the resource. For more information, see Tag your resources in the IoT Greengrass V2 Developer Guide.
     */
    tags?: TagMap;
  }
  export interface InstalledComponent {
    /**
     * The name of the component.
     */
    componentName?: ComponentNameString;
    /**
     * The version of the component.
     */
    componentVersion?: ComponentVersionString;
    /**
     * The lifecycle state of the component.
     */
    lifecycleState?: InstalledComponentLifecycleState;
    /**
     * The details about the lifecycle state of the component.
     */
    lifecycleStateDetails?: LifecycleStateDetails;
    /**
     * Whether or not the component is a root component.
     */
    isRoot?: IsRoot;
  }
  export type InstalledComponentLifecycleState = "NEW"|"INSTALLED"|"STARTING"|"RUNNING"|"STOPPING"|"ERRORED"|"BROKEN"|"FINISHED"|string;
  export type InstalledComponentList = InstalledComponent[];
  export type IoTJobARN = string;
  export type IoTJobAbortAction = "CANCEL"|string;
  export interface IoTJobAbortConfig {
    /**
     * The list of criteria that define when and how to cancel the configuration deployment.
     */
    criteriaList: IoTJobAbortCriteriaList;
  }
  export interface IoTJobAbortCriteria {
    /**
     * The type of job deployment failure that can cancel a job.
     */
    failureType: IoTJobExecutionFailureType;
    /**
     * The action to perform when the criteria are met.
     */
    action: IoTJobAbortAction;
    /**
     * The minimum percentage of failureType failures that occur before the job can cancel. This parameter supports up to two digits after the decimal (for example, you can specify 10.9 or 10.99, but not 10.999).
     */
    thresholdPercentage: IoTJobAbortThresholdPercentage;
    /**
     * The minimum number of things that receive the configuration before the job can cancel.
     */
    minNumberOfExecutedThings: IoTJobMinimumNumberOfExecutedThings;
  }
  export type IoTJobAbortCriteriaList = IoTJobAbortCriteria[];
  export type IoTJobAbortThresholdPercentage = number;
  export type IoTJobExecutionFailureType = "FAILED"|"REJECTED"|"TIMED_OUT"|"ALL"|string;
  export interface IoTJobExecutionsRolloutConfig {
    /**
     * The exponential rate to increase the job rollout rate.
     */
    exponentialRate?: IoTJobExponentialRolloutRate;
    /**
     * The maximum number of devices that receive a pending job notification, per minute.
     */
    maximumPerMinute?: IoTJobMaxExecutionsPerMin;
  }
  export interface IoTJobExponentialRolloutRate {
    /**
     * The minimum number of devices that receive a pending job notification, per minute, when the job starts. This parameter defines the initial rollout rate of the job.
     */
    baseRatePerMinute: IoTJobRolloutBaseRatePerMinute;
    /**
     * The exponential factor to increase the rollout rate for the job. This parameter supports up to one digit after the decimal (for example, you can specify 1.5, but not 1.55).
     */
    incrementFactor: IoTJobRolloutIncrementFactor;
    /**
     * The criteria to increase the rollout rate for the job.
     */
    rateIncreaseCriteria: IoTJobRateIncreaseCriteria;
  }
  export type IoTJobId = string;
  export type IoTJobInProgressTimeoutInMinutes = number;
  export type IoTJobMaxExecutionsPerMin = number;
  export type IoTJobMinimumNumberOfExecutedThings = number;
  export type IoTJobNumberOfThings = number;
  export interface IoTJobRateIncreaseCriteria {
    /**
     * The number of devices to receive the job notification before the rollout rate increases.
     */
    numberOfNotifiedThings?: IoTJobNumberOfThings;
    /**
     * The number of devices to successfully run the configuration job before the rollout rate increases.
     */
    numberOfSucceededThings?: IoTJobNumberOfThings;
  }
  export type IoTJobRolloutBaseRatePerMinute = number;
  export type IoTJobRolloutIncrementFactor = number;
  export interface IoTJobTimeoutConfig {
    /**
     * The amount of time, in minutes, that devices have to complete the job. The timer starts when the job status is set to IN_PROGRESS. If the job status doesn't change to a terminal state before the time expires, then the job status is set to TIMED_OUT. The timeout interval must be between 1 minute and 7 days (10080 minutes).
     */
    inProgressTimeoutInMinutes?: IoTJobInProgressTimeoutInMinutes;
  }
  export type IoTThingName = string;
  export type IsLatestForTarget = boolean;
  export type IsRoot = boolean;
  export interface LambdaContainerParams {
    /**
     * The memory size of the container, expressed in kilobytes. Default: 16384 (16 MB)
     */
    memorySizeInKB?: OptionalInteger;
    /**
     * Whether or not the container can read information from the device's /sys folder. Default: false 
     */
    mountROSysfs?: OptionalBoolean;
    /**
     * The list of volumes that the container can access.
     */
    volumes?: LambdaVolumeList;
    /**
     * The list of system devices that the container can access.
     */
    devices?: LambdaDeviceList;
  }
  export type LambdaDeviceList = LambdaDeviceMount[];
  export interface LambdaDeviceMount {
    /**
     * The mount path for the device in the file system.
     */
    path: FileSystemPath;
    /**
     * The permission to access the device: read/only (ro) or read/write (rw). Default: ro 
     */
    permission?: LambdaFilesystemPermission;
    /**
     * Whether or not to add the component's system user as an owner of the device. Default: false 
     */
    addGroupOwner?: OptionalBoolean;
  }
  export type LambdaEnvironmentVariables = {[key: string]: String};
  export interface LambdaEventSource {
    /**
     * The topic to which to subscribe to receive event messages.
     */
    topic: TopicString;
    /**
     * The type of event source. Choose from the following options:    PUB_SUB – Subscribe to local publish/subscribe messages. This event source type doesn't support MQTT wildcards (+ and #) in the event source topic.    IOT_CORE – Subscribe to Amazon Web Services IoT Core MQTT messages. This event source type supports MQTT wildcards (+ and #) in the event source topic.  
     */
    type: LambdaEventSourceType;
  }
  export type LambdaEventSourceList = LambdaEventSource[];
  export type LambdaEventSourceType = "PUB_SUB"|"IOT_CORE"|string;
  export type LambdaExecArg = string;
  export type LambdaExecArgsList = LambdaExecArg[];
  export interface LambdaExecutionParameters {
    /**
     * The list of event sources to which to subscribe to receive work messages. The Lambda function runs when it receives a message from an event source. You can subscribe this function to local publish/subscribe messages and Amazon Web Services IoT Core MQTT messages.
     */
    eventSources?: LambdaEventSourceList;
    /**
     * The maximum size of the message queue for the Lambda function component. The IoT Greengrass core stores messages in a FIFO (first-in-first-out) queue until it can run the Lambda function to consume each message.
     */
    maxQueueSize?: OptionalInteger;
    /**
     * The maximum number of instances that a non-pinned Lambda function can run at the same time.
     */
    maxInstancesCount?: OptionalInteger;
    /**
     * The maximum amount of time in seconds that a non-pinned Lambda function can idle before the IoT Greengrass Core software stops its process.
     */
    maxIdleTimeInSeconds?: OptionalInteger;
    /**
     * The maximum amount of time in seconds that the Lambda function can process a work item.
     */
    timeoutInSeconds?: OptionalInteger;
    /**
     * The interval in seconds at which a pinned (also known as long-lived) Lambda function component sends status updates to the Lambda manager component.
     */
    statusTimeoutInSeconds?: OptionalInteger;
    /**
     * Whether or not the Lambda function is pinned, or long-lived.   A pinned Lambda function starts when IoT Greengrass starts and keeps running in its own container.   A non-pinned Lambda function starts only when it receives a work item and exists after it idles for maxIdleTimeInSeconds. If the function has multiple work items, the IoT Greengrass Core software creates multiple instances of the function.   Default: true 
     */
    pinned?: OptionalBoolean;
    /**
     * The encoding type that the Lambda function supports. Default: json 
     */
    inputPayloadEncodingType?: LambdaInputPayloadEncodingType;
    /**
     * The list of arguments to pass to the Lambda function when it runs.
     */
    execArgs?: LambdaExecArgsList;
    /**
     * The map of environment variables that are available to the Lambda function when it runs.
     */
    environmentVariables?: LambdaEnvironmentVariables;
    /**
     * The parameters for the Linux process that contains the Lambda function.
     */
    linuxProcessParams?: LambdaLinuxProcessParams;
  }
  export type LambdaFilesystemPermission = "ro"|"rw"|string;
  export type LambdaFunctionARNWithVersionNumber = string;
  export interface LambdaFunctionRecipeSource {
    /**
     * The ARN of the Lambda function. The ARN must include the version of the function to import. You can't use version aliases like $LATEST.
     */
    lambdaArn: LambdaFunctionARNWithVersionNumber;
    /**
     * The name of the component. Defaults to the name of the Lambda function.
     */
    componentName?: ComponentNameString;
    /**
     * The version of the component. Defaults to the version of the Lambda function as a semantic version. For example, if your function version is 3, the component version becomes 3.0.0.
     */
    componentVersion?: ComponentVersionString;
    /**
     * The platforms that the component version supports.
     */
    componentPlatforms?: ComponentPlatformList;
    /**
     * The component versions on which this Lambda function component depends.
     */
    componentDependencies?: ComponentDependencyMap;
    /**
     * The system and runtime parameters for the Lambda function as it runs on the Greengrass core device.
     */
    componentLambdaParameters?: LambdaExecutionParameters;
  }
  export type LambdaInputPayloadEncodingType = "json"|"binary"|string;
  export type LambdaIsolationMode = "GreengrassContainer"|"NoContainer"|string;
  export interface LambdaLinuxProcessParams {
    /**
     * The isolation mode for the process that contains the Lambda function. The process can run in an isolated runtime environment inside the IoT Greengrass container, or as a regular process outside any container. Default: GreengrassContainer 
     */
    isolationMode?: LambdaIsolationMode;
    /**
     * The parameters for the container in which the Lambda function runs.
     */
    containerParams?: LambdaContainerParams;
  }
  export type LambdaVolumeList = LambdaVolumeMount[];
  export interface LambdaVolumeMount {
    /**
     * The path to the physical volume in the file system.
     */
    sourcePath: FileSystemPath;
    /**
     * The path to the logical volume in the file system.
     */
    destinationPath: FileSystemPath;
    /**
     * The permission to access the volume: read/only (ro) or read/write (rw). Default: ro 
     */
    permission?: LambdaFilesystemPermission;
    /**
     * Whether or not to add the IoT Greengrass user group as an owner of the volume. Default: false 
     */
    addGroupOwner?: OptionalBoolean;
  }
  export type LifecycleStateDetails = string;
  export interface ListClientDevicesAssociatedWithCoreDeviceRequest {
    /**
     * The name of the core device. This is also the name of the IoT thing.
     */
    coreDeviceThingName: IoTThingName;
    /**
     * The maximum number of results to be returned per paginated request.
     */
    maxResults?: DefaultMaxResults;
    /**
     * The token to be used for the next set of paginated results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListClientDevicesAssociatedWithCoreDeviceResponse {
    /**
     * A list that describes the client devices that are associated with the core device.
     */
    associatedClientDevices?: AssociatedClientDeviceList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListComponentVersionsRequest {
    /**
     * The ARN of the component version.
     */
    arn: ComponentARN;
    /**
     * The maximum number of results to be returned per paginated request.
     */
    maxResults?: DefaultMaxResults;
    /**
     * The token to be used for the next set of paginated results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListComponentVersionsResponse {
    /**
     * A list of versions that exist for the component.
     */
    componentVersions?: ComponentVersionList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListComponentsRequest {
    /**
     * The scope of the components to list. Default: PRIVATE 
     */
    scope?: ComponentVisibilityScope;
    /**
     * The maximum number of results to be returned per paginated request.
     */
    maxResults?: DefaultMaxResults;
    /**
     * The token to be used for the next set of paginated results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListComponentsResponse {
    /**
     * A list that summarizes each component.
     */
    components?: ComponentList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListCoreDevicesRequest {
    /**
     * The ARN of the IoT thing group by which to filter. If you specify this parameter, the list includes only core devices that are members of this thing group.
     */
    thingGroupArn?: ThingGroupARN;
    /**
     * The core device status by which to filter. If you specify this parameter, the list includes only core devices that have this status. Choose one of the following options:    HEALTHY – The IoT Greengrass Core software and all components run on the core device without issue.    UNHEALTHY – The IoT Greengrass Core software or a component is in a failed state on the core device.  
     */
    status?: CoreDeviceStatus;
    /**
     * The maximum number of results to be returned per paginated request.
     */
    maxResults?: DefaultMaxResults;
    /**
     * The token to be used for the next set of paginated results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListCoreDevicesResponse {
    /**
     * A list that summarizes each core device.
     */
    coreDevices?: CoreDevicesList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListDeploymentsRequest {
    /**
     * The ARN of the target IoT thing or thing group.
     */
    targetArn?: TargetARN;
    /**
     * The filter for the list of deployments. Choose one of the following options:    ALL – The list includes all deployments.    LATEST_ONLY – The list includes only the latest revision of each deployment.   Default: LATEST_ONLY 
     */
    historyFilter?: DeploymentHistoryFilter;
    /**
     * The maximum number of results to be returned per paginated request.
     */
    maxResults?: DefaultMaxResults;
    /**
     * The token to be used for the next set of paginated results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListDeploymentsResponse {
    /**
     * A list that summarizes each deployment.
     */
    deployments?: DeploymentList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListEffectiveDeploymentsRequest {
    /**
     * The name of the core device. This is also the name of the IoT thing.
     */
    coreDeviceThingName: CoreDeviceThingName;
    /**
     * The maximum number of results to be returned per paginated request.
     */
    maxResults?: DefaultMaxResults;
    /**
     * The token to be used for the next set of paginated results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListEffectiveDeploymentsResponse {
    /**
     * A list that summarizes each deployment on the core device.
     */
    effectiveDeployments?: EffectiveDeploymentsList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListInstalledComponentsRequest {
    /**
     * The name of the core device. This is also the name of the IoT thing.
     */
    coreDeviceThingName: CoreDeviceThingName;
    /**
     * The maximum number of results to be returned per paginated request.
     */
    maxResults?: DefaultMaxResults;
    /**
     * The token to be used for the next set of paginated results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListInstalledComponentsResponse {
    /**
     * A list that summarizes each component on the core device.
     */
    installedComponents?: InstalledComponentList;
    /**
     * The token for the next set of results, or null if there are no additional results.
     */
    nextToken?: NextTokenString;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    resourceArn: GenericV2ARN;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of key-value pairs that contain metadata for the resource. For more information, see Tag your resources in the IoT Greengrass V2 Developer Guide.
     */
    tags?: TagMap;
  }
  export type Memory = number;
  export type NextTokenString = string;
  export type NonEmptyString = string;
  export type NullableString = string;
  export type OptionalBoolean = boolean;
  export type OptionalInteger = number;
  export type PlatformAttributesMap = {[key: string]: NonEmptyString};
  export type PublisherString = string;
  export type Reason = string;
  export type RecipeBlob = Buffer|Uint8Array|Blob|string;
  export type RecipeOutputFormat = "JSON"|"YAML"|string;
  export interface ResolveComponentCandidatesRequest {
    /**
     * The platform to use to resolve compatible components.
     */
    platform: ComponentPlatform;
    /**
     * The list of components to resolve.
     */
    componentCandidates: ComponentCandidateList;
  }
  export interface ResolveComponentCandidatesResponse {
    /**
     * A list of components that meet the requirements that you specify in the request. This list includes each component's recipe that you can use to install the component.
     */
    resolvedComponentVersions?: ResolvedComponentVersionsList;
  }
  export interface ResolvedComponentVersion {
    /**
     * The ARN of the component version.
     */
    arn?: ComponentVersionARN;
    /**
     * The name of the component.
     */
    componentName?: ComponentNameString;
    /**
     * The version of the component.
     */
    componentVersion?: ComponentVersionString;
    /**
     * The recipe of the component version.
     */
    recipe?: RecipeBlob;
  }
  export type ResolvedComponentVersionsList = ResolvedComponentVersion[];
  export type String = string;
  export type StringMap = {[key: string]: NonEmptyString};
  export interface SystemResourceLimits {
    /**
     * The maximum amount of RAM, expressed in kilobytes, that a component's processes can use on the core device.
     */
    memory?: Memory;
    /**
     * The maximum amount of CPU time that a component's processes can use on the core device. A core device's total CPU time is equivalent to the device's number of CPU cores. For example, on a core device with 4 CPU cores, you can set this value to 2 to limit the component's processes to 50 percent usage of each CPU core. On a device with 1 CPU core, you can set this value to 0.25 to limit the component's processes to 25 percent usage of the CPU. If you set this value to a number greater than the number of CPU cores, the IoT Greengrass Core software doesn't limit the component's CPU usage.
     */
    cpus?: CPU;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The ARN of the resource to tag.
     */
    resourceArn: GenericV2ARN;
    /**
     * A list of key-value pairs that contain metadata for the resource. For more information, see Tag your resources in the IoT Greengrass V2 Developer Guide.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TargetARN = string;
  export type ThingGroupARN = string;
  export type Timestamp = Date;
  export type TopicString = string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource to untag.
     */
    resourceArn: GenericV2ARN;
    /**
     * A list of keys for tags to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-11-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the GreengrassV2 client.
   */
  export import Types = GreengrassV2;
}
export = GreengrassV2;
