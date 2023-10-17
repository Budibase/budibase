import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Panorama extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Panorama.Types.ClientConfiguration)
  config: Config & Panorama.Types.ClientConfiguration;
  /**
   * Creates an application instance and deploys it to a device.
   */
  createApplicationInstance(params: Panorama.Types.CreateApplicationInstanceRequest, callback?: (err: AWSError, data: Panorama.Types.CreateApplicationInstanceResponse) => void): Request<Panorama.Types.CreateApplicationInstanceResponse, AWSError>;
  /**
   * Creates an application instance and deploys it to a device.
   */
  createApplicationInstance(callback?: (err: AWSError, data: Panorama.Types.CreateApplicationInstanceResponse) => void): Request<Panorama.Types.CreateApplicationInstanceResponse, AWSError>;
  /**
   * Creates a job to run on a device. A job can update a device's software or reboot it.
   */
  createJobForDevices(params: Panorama.Types.CreateJobForDevicesRequest, callback?: (err: AWSError, data: Panorama.Types.CreateJobForDevicesResponse) => void): Request<Panorama.Types.CreateJobForDevicesResponse, AWSError>;
  /**
   * Creates a job to run on a device. A job can update a device's software or reboot it.
   */
  createJobForDevices(callback?: (err: AWSError, data: Panorama.Types.CreateJobForDevicesResponse) => void): Request<Panorama.Types.CreateJobForDevicesResponse, AWSError>;
  /**
   * Creates a camera stream node.
   */
  createNodeFromTemplateJob(params: Panorama.Types.CreateNodeFromTemplateJobRequest, callback?: (err: AWSError, data: Panorama.Types.CreateNodeFromTemplateJobResponse) => void): Request<Panorama.Types.CreateNodeFromTemplateJobResponse, AWSError>;
  /**
   * Creates a camera stream node.
   */
  createNodeFromTemplateJob(callback?: (err: AWSError, data: Panorama.Types.CreateNodeFromTemplateJobResponse) => void): Request<Panorama.Types.CreateNodeFromTemplateJobResponse, AWSError>;
  /**
   * Creates a package and storage location in an Amazon S3 access point.
   */
  createPackage(params: Panorama.Types.CreatePackageRequest, callback?: (err: AWSError, data: Panorama.Types.CreatePackageResponse) => void): Request<Panorama.Types.CreatePackageResponse, AWSError>;
  /**
   * Creates a package and storage location in an Amazon S3 access point.
   */
  createPackage(callback?: (err: AWSError, data: Panorama.Types.CreatePackageResponse) => void): Request<Panorama.Types.CreatePackageResponse, AWSError>;
  /**
   * Imports a node package.
   */
  createPackageImportJob(params: Panorama.Types.CreatePackageImportJobRequest, callback?: (err: AWSError, data: Panorama.Types.CreatePackageImportJobResponse) => void): Request<Panorama.Types.CreatePackageImportJobResponse, AWSError>;
  /**
   * Imports a node package.
   */
  createPackageImportJob(callback?: (err: AWSError, data: Panorama.Types.CreatePackageImportJobResponse) => void): Request<Panorama.Types.CreatePackageImportJobResponse, AWSError>;
  /**
   * Deletes a device.
   */
  deleteDevice(params: Panorama.Types.DeleteDeviceRequest, callback?: (err: AWSError, data: Panorama.Types.DeleteDeviceResponse) => void): Request<Panorama.Types.DeleteDeviceResponse, AWSError>;
  /**
   * Deletes a device.
   */
  deleteDevice(callback?: (err: AWSError, data: Panorama.Types.DeleteDeviceResponse) => void): Request<Panorama.Types.DeleteDeviceResponse, AWSError>;
  /**
   * Deletes a package.  To delete a package, you need permission to call s3:DeleteObject in addition to permissions for the AWS Panorama API. 
   */
  deletePackage(params: Panorama.Types.DeletePackageRequest, callback?: (err: AWSError, data: Panorama.Types.DeletePackageResponse) => void): Request<Panorama.Types.DeletePackageResponse, AWSError>;
  /**
   * Deletes a package.  To delete a package, you need permission to call s3:DeleteObject in addition to permissions for the AWS Panorama API. 
   */
  deletePackage(callback?: (err: AWSError, data: Panorama.Types.DeletePackageResponse) => void): Request<Panorama.Types.DeletePackageResponse, AWSError>;
  /**
   * Deregisters a package version.
   */
  deregisterPackageVersion(params: Panorama.Types.DeregisterPackageVersionRequest, callback?: (err: AWSError, data: Panorama.Types.DeregisterPackageVersionResponse) => void): Request<Panorama.Types.DeregisterPackageVersionResponse, AWSError>;
  /**
   * Deregisters a package version.
   */
  deregisterPackageVersion(callback?: (err: AWSError, data: Panorama.Types.DeregisterPackageVersionResponse) => void): Request<Panorama.Types.DeregisterPackageVersionResponse, AWSError>;
  /**
   * Returns information about an application instance on a device.
   */
  describeApplicationInstance(params: Panorama.Types.DescribeApplicationInstanceRequest, callback?: (err: AWSError, data: Panorama.Types.DescribeApplicationInstanceResponse) => void): Request<Panorama.Types.DescribeApplicationInstanceResponse, AWSError>;
  /**
   * Returns information about an application instance on a device.
   */
  describeApplicationInstance(callback?: (err: AWSError, data: Panorama.Types.DescribeApplicationInstanceResponse) => void): Request<Panorama.Types.DescribeApplicationInstanceResponse, AWSError>;
  /**
   * Returns information about an application instance's configuration manifest.
   */
  describeApplicationInstanceDetails(params: Panorama.Types.DescribeApplicationInstanceDetailsRequest, callback?: (err: AWSError, data: Panorama.Types.DescribeApplicationInstanceDetailsResponse) => void): Request<Panorama.Types.DescribeApplicationInstanceDetailsResponse, AWSError>;
  /**
   * Returns information about an application instance's configuration manifest.
   */
  describeApplicationInstanceDetails(callback?: (err: AWSError, data: Panorama.Types.DescribeApplicationInstanceDetailsResponse) => void): Request<Panorama.Types.DescribeApplicationInstanceDetailsResponse, AWSError>;
  /**
   * Returns information about a device.
   */
  describeDevice(params: Panorama.Types.DescribeDeviceRequest, callback?: (err: AWSError, data: Panorama.Types.DescribeDeviceResponse) => void): Request<Panorama.Types.DescribeDeviceResponse, AWSError>;
  /**
   * Returns information about a device.
   */
  describeDevice(callback?: (err: AWSError, data: Panorama.Types.DescribeDeviceResponse) => void): Request<Panorama.Types.DescribeDeviceResponse, AWSError>;
  /**
   * Returns information about a device job.
   */
  describeDeviceJob(params: Panorama.Types.DescribeDeviceJobRequest, callback?: (err: AWSError, data: Panorama.Types.DescribeDeviceJobResponse) => void): Request<Panorama.Types.DescribeDeviceJobResponse, AWSError>;
  /**
   * Returns information about a device job.
   */
  describeDeviceJob(callback?: (err: AWSError, data: Panorama.Types.DescribeDeviceJobResponse) => void): Request<Panorama.Types.DescribeDeviceJobResponse, AWSError>;
  /**
   * Returns information about a node.
   */
  describeNode(params: Panorama.Types.DescribeNodeRequest, callback?: (err: AWSError, data: Panorama.Types.DescribeNodeResponse) => void): Request<Panorama.Types.DescribeNodeResponse, AWSError>;
  /**
   * Returns information about a node.
   */
  describeNode(callback?: (err: AWSError, data: Panorama.Types.DescribeNodeResponse) => void): Request<Panorama.Types.DescribeNodeResponse, AWSError>;
  /**
   * Returns information about a job to create a camera stream node.
   */
  describeNodeFromTemplateJob(params: Panorama.Types.DescribeNodeFromTemplateJobRequest, callback?: (err: AWSError, data: Panorama.Types.DescribeNodeFromTemplateJobResponse) => void): Request<Panorama.Types.DescribeNodeFromTemplateJobResponse, AWSError>;
  /**
   * Returns information about a job to create a camera stream node.
   */
  describeNodeFromTemplateJob(callback?: (err: AWSError, data: Panorama.Types.DescribeNodeFromTemplateJobResponse) => void): Request<Panorama.Types.DescribeNodeFromTemplateJobResponse, AWSError>;
  /**
   * Returns information about a package.
   */
  describePackage(params: Panorama.Types.DescribePackageRequest, callback?: (err: AWSError, data: Panorama.Types.DescribePackageResponse) => void): Request<Panorama.Types.DescribePackageResponse, AWSError>;
  /**
   * Returns information about a package.
   */
  describePackage(callback?: (err: AWSError, data: Panorama.Types.DescribePackageResponse) => void): Request<Panorama.Types.DescribePackageResponse, AWSError>;
  /**
   * Returns information about a package import job.
   */
  describePackageImportJob(params: Panorama.Types.DescribePackageImportJobRequest, callback?: (err: AWSError, data: Panorama.Types.DescribePackageImportJobResponse) => void): Request<Panorama.Types.DescribePackageImportJobResponse, AWSError>;
  /**
   * Returns information about a package import job.
   */
  describePackageImportJob(callback?: (err: AWSError, data: Panorama.Types.DescribePackageImportJobResponse) => void): Request<Panorama.Types.DescribePackageImportJobResponse, AWSError>;
  /**
   * Returns information about a package version.
   */
  describePackageVersion(params: Panorama.Types.DescribePackageVersionRequest, callback?: (err: AWSError, data: Panorama.Types.DescribePackageVersionResponse) => void): Request<Panorama.Types.DescribePackageVersionResponse, AWSError>;
  /**
   * Returns information about a package version.
   */
  describePackageVersion(callback?: (err: AWSError, data: Panorama.Types.DescribePackageVersionResponse) => void): Request<Panorama.Types.DescribePackageVersionResponse, AWSError>;
  /**
   * Returns a list of application instance dependencies.
   */
  listApplicationInstanceDependencies(params: Panorama.Types.ListApplicationInstanceDependenciesRequest, callback?: (err: AWSError, data: Panorama.Types.ListApplicationInstanceDependenciesResponse) => void): Request<Panorama.Types.ListApplicationInstanceDependenciesResponse, AWSError>;
  /**
   * Returns a list of application instance dependencies.
   */
  listApplicationInstanceDependencies(callback?: (err: AWSError, data: Panorama.Types.ListApplicationInstanceDependenciesResponse) => void): Request<Panorama.Types.ListApplicationInstanceDependenciesResponse, AWSError>;
  /**
   * Returns a list of application node instances.
   */
  listApplicationInstanceNodeInstances(params: Panorama.Types.ListApplicationInstanceNodeInstancesRequest, callback?: (err: AWSError, data: Panorama.Types.ListApplicationInstanceNodeInstancesResponse) => void): Request<Panorama.Types.ListApplicationInstanceNodeInstancesResponse, AWSError>;
  /**
   * Returns a list of application node instances.
   */
  listApplicationInstanceNodeInstances(callback?: (err: AWSError, data: Panorama.Types.ListApplicationInstanceNodeInstancesResponse) => void): Request<Panorama.Types.ListApplicationInstanceNodeInstancesResponse, AWSError>;
  /**
   * Returns a list of application instances.
   */
  listApplicationInstances(params: Panorama.Types.ListApplicationInstancesRequest, callback?: (err: AWSError, data: Panorama.Types.ListApplicationInstancesResponse) => void): Request<Panorama.Types.ListApplicationInstancesResponse, AWSError>;
  /**
   * Returns a list of application instances.
   */
  listApplicationInstances(callback?: (err: AWSError, data: Panorama.Types.ListApplicationInstancesResponse) => void): Request<Panorama.Types.ListApplicationInstancesResponse, AWSError>;
  /**
   * Returns a list of devices.
   */
  listDevices(params: Panorama.Types.ListDevicesRequest, callback?: (err: AWSError, data: Panorama.Types.ListDevicesResponse) => void): Request<Panorama.Types.ListDevicesResponse, AWSError>;
  /**
   * Returns a list of devices.
   */
  listDevices(callback?: (err: AWSError, data: Panorama.Types.ListDevicesResponse) => void): Request<Panorama.Types.ListDevicesResponse, AWSError>;
  /**
   * Returns a list of jobs.
   */
  listDevicesJobs(params: Panorama.Types.ListDevicesJobsRequest, callback?: (err: AWSError, data: Panorama.Types.ListDevicesJobsResponse) => void): Request<Panorama.Types.ListDevicesJobsResponse, AWSError>;
  /**
   * Returns a list of jobs.
   */
  listDevicesJobs(callback?: (err: AWSError, data: Panorama.Types.ListDevicesJobsResponse) => void): Request<Panorama.Types.ListDevicesJobsResponse, AWSError>;
  /**
   * Returns a list of camera stream node jobs.
   */
  listNodeFromTemplateJobs(params: Panorama.Types.ListNodeFromTemplateJobsRequest, callback?: (err: AWSError, data: Panorama.Types.ListNodeFromTemplateJobsResponse) => void): Request<Panorama.Types.ListNodeFromTemplateJobsResponse, AWSError>;
  /**
   * Returns a list of camera stream node jobs.
   */
  listNodeFromTemplateJobs(callback?: (err: AWSError, data: Panorama.Types.ListNodeFromTemplateJobsResponse) => void): Request<Panorama.Types.ListNodeFromTemplateJobsResponse, AWSError>;
  /**
   * Returns a list of nodes.
   */
  listNodes(params: Panorama.Types.ListNodesRequest, callback?: (err: AWSError, data: Panorama.Types.ListNodesResponse) => void): Request<Panorama.Types.ListNodesResponse, AWSError>;
  /**
   * Returns a list of nodes.
   */
  listNodes(callback?: (err: AWSError, data: Panorama.Types.ListNodesResponse) => void): Request<Panorama.Types.ListNodesResponse, AWSError>;
  /**
   * Returns a list of package import jobs.
   */
  listPackageImportJobs(params: Panorama.Types.ListPackageImportJobsRequest, callback?: (err: AWSError, data: Panorama.Types.ListPackageImportJobsResponse) => void): Request<Panorama.Types.ListPackageImportJobsResponse, AWSError>;
  /**
   * Returns a list of package import jobs.
   */
  listPackageImportJobs(callback?: (err: AWSError, data: Panorama.Types.ListPackageImportJobsResponse) => void): Request<Panorama.Types.ListPackageImportJobsResponse, AWSError>;
  /**
   * Returns a list of packages.
   */
  listPackages(params: Panorama.Types.ListPackagesRequest, callback?: (err: AWSError, data: Panorama.Types.ListPackagesResponse) => void): Request<Panorama.Types.ListPackagesResponse, AWSError>;
  /**
   * Returns a list of packages.
   */
  listPackages(callback?: (err: AWSError, data: Panorama.Types.ListPackagesResponse) => void): Request<Panorama.Types.ListPackagesResponse, AWSError>;
  /**
   * Returns a list of tags for a resource.
   */
  listTagsForResource(params: Panorama.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Panorama.Types.ListTagsForResourceResponse) => void): Request<Panorama.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns a list of tags for a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Panorama.Types.ListTagsForResourceResponse) => void): Request<Panorama.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates a device and returns a configuration archive. The configuration archive is a ZIP file that contains a provisioning certificate that is valid for 5 minutes. Name the configuration archive certificates-omni_device-name.zip and transfer it to the device within 5 minutes. Use the included USB storage device and connect it to the USB 3.0 port next to the HDMI output.
   */
  provisionDevice(params: Panorama.Types.ProvisionDeviceRequest, callback?: (err: AWSError, data: Panorama.Types.ProvisionDeviceResponse) => void): Request<Panorama.Types.ProvisionDeviceResponse, AWSError>;
  /**
   * Creates a device and returns a configuration archive. The configuration archive is a ZIP file that contains a provisioning certificate that is valid for 5 minutes. Name the configuration archive certificates-omni_device-name.zip and transfer it to the device within 5 minutes. Use the included USB storage device and connect it to the USB 3.0 port next to the HDMI output.
   */
  provisionDevice(callback?: (err: AWSError, data: Panorama.Types.ProvisionDeviceResponse) => void): Request<Panorama.Types.ProvisionDeviceResponse, AWSError>;
  /**
   * Registers a package version.
   */
  registerPackageVersion(params: Panorama.Types.RegisterPackageVersionRequest, callback?: (err: AWSError, data: Panorama.Types.RegisterPackageVersionResponse) => void): Request<Panorama.Types.RegisterPackageVersionResponse, AWSError>;
  /**
   * Registers a package version.
   */
  registerPackageVersion(callback?: (err: AWSError, data: Panorama.Types.RegisterPackageVersionResponse) => void): Request<Panorama.Types.RegisterPackageVersionResponse, AWSError>;
  /**
   * Removes an application instance.
   */
  removeApplicationInstance(params: Panorama.Types.RemoveApplicationInstanceRequest, callback?: (err: AWSError, data: Panorama.Types.RemoveApplicationInstanceResponse) => void): Request<Panorama.Types.RemoveApplicationInstanceResponse, AWSError>;
  /**
   * Removes an application instance.
   */
  removeApplicationInstance(callback?: (err: AWSError, data: Panorama.Types.RemoveApplicationInstanceResponse) => void): Request<Panorama.Types.RemoveApplicationInstanceResponse, AWSError>;
  /**
   * Signal camera nodes to stop or resume.
   */
  signalApplicationInstanceNodeInstances(params: Panorama.Types.SignalApplicationInstanceNodeInstancesRequest, callback?: (err: AWSError, data: Panorama.Types.SignalApplicationInstanceNodeInstancesResponse) => void): Request<Panorama.Types.SignalApplicationInstanceNodeInstancesResponse, AWSError>;
  /**
   * Signal camera nodes to stop or resume.
   */
  signalApplicationInstanceNodeInstances(callback?: (err: AWSError, data: Panorama.Types.SignalApplicationInstanceNodeInstancesResponse) => void): Request<Panorama.Types.SignalApplicationInstanceNodeInstancesResponse, AWSError>;
  /**
   * Tags a resource.
   */
  tagResource(params: Panorama.Types.TagResourceRequest, callback?: (err: AWSError, data: Panorama.Types.TagResourceResponse) => void): Request<Panorama.Types.TagResourceResponse, AWSError>;
  /**
   * Tags a resource.
   */
  tagResource(callback?: (err: AWSError, data: Panorama.Types.TagResourceResponse) => void): Request<Panorama.Types.TagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(params: Panorama.Types.UntagResourceRequest, callback?: (err: AWSError, data: Panorama.Types.UntagResourceResponse) => void): Request<Panorama.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: Panorama.Types.UntagResourceResponse) => void): Request<Panorama.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates a device's metadata.
   */
  updateDeviceMetadata(params: Panorama.Types.UpdateDeviceMetadataRequest, callback?: (err: AWSError, data: Panorama.Types.UpdateDeviceMetadataResponse) => void): Request<Panorama.Types.UpdateDeviceMetadataResponse, AWSError>;
  /**
   * Updates a device's metadata.
   */
  updateDeviceMetadata(callback?: (err: AWSError, data: Panorama.Types.UpdateDeviceMetadataResponse) => void): Request<Panorama.Types.UpdateDeviceMetadataResponse, AWSError>;
}
declare namespace Panorama {
  export interface AlternateSoftwareMetadata {
    /**
     * The appliance software version.
     */
    Version?: Version;
  }
  export type AlternateSoftwares = AlternateSoftwareMetadata[];
  export interface ApplicationInstance {
    /**
     * The application instance's ID.
     */
    ApplicationInstanceId?: ApplicationInstanceId;
    /**
     * The application instance's ARN.
     */
    Arn?: ApplicationInstanceArn;
    /**
     * When the application instance was created.
     */
    CreatedTime?: TimeStamp;
    /**
     * The device's ID.
     */
    DefaultRuntimeContextDevice?: DefaultRuntimeContextDevice;
    /**
     * The device's name.
     */
    DefaultRuntimeContextDeviceName?: DeviceName;
    /**
     * The application instance's description.
     */
    Description?: Description;
    /**
     * The application instance's health status.
     */
    HealthStatus?: ApplicationInstanceHealthStatus;
    /**
     * The application instance's name.
     */
    Name?: ApplicationInstanceName;
    /**
     * The application's state.
     */
    RuntimeContextStates?: ReportedRuntimeContextStates;
    /**
     * The application instance's status.
     */
    Status?: ApplicationInstanceStatus;
    /**
     * The application instance's status description.
     */
    StatusDescription?: ApplicationInstanceStatusDescription;
    /**
     * The application instance's tags.
     */
    Tags?: TagMap;
  }
  export type ApplicationInstanceArn = string;
  export type ApplicationInstanceHealthStatus = "RUNNING"|"ERROR"|"NOT_AVAILABLE"|string;
  export type ApplicationInstanceId = string;
  export type ApplicationInstanceName = string;
  export type ApplicationInstanceStatus = "DEPLOYMENT_PENDING"|"DEPLOYMENT_REQUESTED"|"DEPLOYMENT_IN_PROGRESS"|"DEPLOYMENT_ERROR"|"DEPLOYMENT_SUCCEEDED"|"REMOVAL_PENDING"|"REMOVAL_REQUESTED"|"REMOVAL_IN_PROGRESS"|"REMOVAL_FAILED"|"REMOVAL_SUCCEEDED"|"DEPLOYMENT_FAILED"|string;
  export type ApplicationInstanceStatusDescription = string;
  export type ApplicationInstances = ApplicationInstance[];
  export type Boolean = boolean;
  export type Bucket = string;
  export type BucketName = string;
  export type Certificates = Buffer|Uint8Array|Blob|string;
  export type ClientToken = string;
  export type ConnectionType = "STATIC_IP"|"DHCP"|string;
  export interface CreateApplicationInstanceRequest {
    /**
     * The ID of an application instance to replace with the new instance.
     */
    ApplicationInstanceIdToReplace?: ApplicationInstanceId;
    /**
     * A device's ID.
     */
    DefaultRuntimeContextDevice: DefaultRuntimeContextDevice;
    /**
     * A description for the application instance.
     */
    Description?: Description;
    /**
     * Setting overrides for the application manifest.
     */
    ManifestOverridesPayload?: ManifestOverridesPayload;
    /**
     * The application's manifest document.
     */
    ManifestPayload: ManifestPayload;
    /**
     * A name for the application instance.
     */
    Name?: ApplicationInstanceName;
    /**
     * The ARN of a runtime role for the application instance.
     */
    RuntimeRoleArn?: RuntimeRoleArn;
    /**
     * Tags for the application instance.
     */
    Tags?: TagMap;
  }
  export interface CreateApplicationInstanceResponse {
    /**
     * The application instance's ID.
     */
    ApplicationInstanceId: ApplicationInstanceId;
  }
  export interface CreateJobForDevicesRequest {
    /**
     * ID of target device.
     */
    DeviceIds: DeviceIdList;
    /**
     * Configuration settings for a software update job.
     */
    DeviceJobConfig?: DeviceJobConfig;
    /**
     * The type of job to run.
     */
    JobType: JobType;
  }
  export interface CreateJobForDevicesResponse {
    /**
     * A list of jobs.
     */
    Jobs: JobList;
  }
  export interface CreateNodeFromTemplateJobRequest {
    /**
     * Tags for the job.
     */
    JobTags?: JobTagsList;
    /**
     * A description for the node.
     */
    NodeDescription?: Description;
    /**
     * A name for the node.
     */
    NodeName: NodeName;
    /**
     * An output package name for the node.
     */
    OutputPackageName: NodePackageName;
    /**
     * An output package version for the node.
     */
    OutputPackageVersion: NodePackageVersion;
    /**
     * Template parameters for the node.
     */
    TemplateParameters: TemplateParametersMap;
    /**
     * The type of node.
     */
    TemplateType: TemplateType;
  }
  export interface CreateNodeFromTemplateJobResponse {
    /**
     * The job's ID.
     */
    JobId: JobId;
  }
  export interface CreatePackageImportJobRequest {
    /**
     * A client token for the package import job.
     */
    ClientToken: ClientToken;
    /**
     * An input config for the package import job.
     */
    InputConfig: PackageImportJobInputConfig;
    /**
     * Tags for the package import job.
     */
    JobTags?: JobTagsList;
    /**
     * A job type for the package import job.
     */
    JobType: PackageImportJobType;
    /**
     * An output config for the package import job.
     */
    OutputConfig: PackageImportJobOutputConfig;
  }
  export interface CreatePackageImportJobResponse {
    /**
     * The job's ID.
     */
    JobId: JobId;
  }
  export interface CreatePackageRequest {
    /**
     * A name for the package.
     */
    PackageName: NodePackageName;
    /**
     * Tags for the package.
     */
    Tags?: TagMap;
  }
  export interface CreatePackageResponse {
    /**
     * The package's ARN.
     */
    Arn?: NodePackageArn;
    /**
     * The package's ID.
     */
    PackageId?: NodePackageId;
    /**
     * The package's storage location.
     */
    StorageLocation: StorageLocation;
  }
  export type CreatedTime = Date;
  export type CurrentSoftware = string;
  export type DefaultGateway = string;
  export type DefaultRuntimeContextDevice = string;
  export interface DeleteDeviceRequest {
    /**
     * The device's ID.
     */
    DeviceId: DeviceId;
  }
  export interface DeleteDeviceResponse {
    /**
     * The device's ID.
     */
    DeviceId?: DeviceId;
  }
  export interface DeletePackageRequest {
    /**
     * Delete the package even if it has artifacts stored in its access point. Deletes the package's artifacts from Amazon S3.
     */
    ForceDelete?: Boolean;
    /**
     * The package's ID.
     */
    PackageId: NodePackageId;
  }
  export interface DeletePackageResponse {
  }
  export interface DeregisterPackageVersionRequest {
    /**
     * An owner account.
     */
    OwnerAccount?: PackageOwnerAccount;
    /**
     * A package ID.
     */
    PackageId: NodePackageId;
    /**
     * A package version.
     */
    PackageVersion: NodePackageVersion;
    /**
     * A patch version.
     */
    PatchVersion: NodePackagePatchVersion;
    /**
     * If the version was marked latest, the new version to maker as latest.
     */
    UpdatedLatestPatchVersion?: NodePackagePatchVersion;
  }
  export interface DeregisterPackageVersionResponse {
  }
  export interface DescribeApplicationInstanceDetailsRequest {
    /**
     * The application instance's ID.
     */
    ApplicationInstanceId: ApplicationInstanceId;
  }
  export interface DescribeApplicationInstanceDetailsResponse {
    /**
     * The application instance's ID.
     */
    ApplicationInstanceId?: ApplicationInstanceId;
    /**
     * The ID of the application instance that this instance replaced.
     */
    ApplicationInstanceIdToReplace?: ApplicationInstanceId;
    /**
     * When the application instance was created.
     */
    CreatedTime?: TimeStamp;
    /**
     * The application instance's default runtime context device.
     */
    DefaultRuntimeContextDevice?: DefaultRuntimeContextDevice;
    /**
     * The application instance's description.
     */
    Description?: Description;
    /**
     * Parameter overrides for the configuration manifest.
     */
    ManifestOverridesPayload?: ManifestOverridesPayload;
    /**
     * The application instance's configuration manifest.
     */
    ManifestPayload?: ManifestPayload;
    /**
     * The application instance's name.
     */
    Name?: ApplicationInstanceName;
  }
  export interface DescribeApplicationInstanceRequest {
    /**
     * The application instance's ID.
     */
    ApplicationInstanceId: ApplicationInstanceId;
  }
  export interface DescribeApplicationInstanceResponse {
    /**
     * The application instance's ID.
     */
    ApplicationInstanceId?: ApplicationInstanceId;
    /**
     * The ID of the application instance that this instance replaced.
     */
    ApplicationInstanceIdToReplace?: ApplicationInstanceId;
    /**
     * The application instance's ARN.
     */
    Arn?: ApplicationInstanceArn;
    /**
     * When the application instance was created.
     */
    CreatedTime?: TimeStamp;
    /**
     * The device's ID.
     */
    DefaultRuntimeContextDevice?: DefaultRuntimeContextDevice;
    /**
     * The device's bane.
     */
    DefaultRuntimeContextDeviceName?: DeviceName;
    /**
     * The application instance's description.
     */
    Description?: Description;
    /**
     * The application instance's health status.
     */
    HealthStatus?: ApplicationInstanceHealthStatus;
    /**
     * The application instance was updated.
     */
    LastUpdatedTime?: TimeStamp;
    /**
     * The application instance's name.
     */
    Name?: ApplicationInstanceName;
    /**
     * The application instance's state.
     */
    RuntimeContextStates?: ReportedRuntimeContextStates;
    /**
     * The application instance's runtime role ARN.
     */
    RuntimeRoleArn?: RuntimeRoleArn;
    /**
     * The application instance's status.
     */
    Status?: ApplicationInstanceStatus;
    /**
     * The application instance's status description.
     */
    StatusDescription?: ApplicationInstanceStatusDescription;
    /**
     * The application instance's tags.
     */
    Tags?: TagMap;
  }
  export interface DescribeDeviceJobRequest {
    /**
     * The job's ID.
     */
    JobId: JobId;
  }
  export interface DescribeDeviceJobResponse {
    /**
     * When the job was created.
     */
    CreatedTime?: UpdateCreatedTime;
    /**
     * The device's ARN.
     */
    DeviceArn?: DeviceArn;
    /**
     * The device's ID.
     */
    DeviceId?: DeviceId;
    /**
     * The device's name.
     */
    DeviceName?: DeviceName;
    /**
     * The device's type.
     */
    DeviceType?: DeviceType;
    /**
     * For an OTA job, the target version of the device software.
     */
    ImageVersion?: ImageVersion;
    /**
     * The job's ID.
     */
    JobId?: JobId;
    /**
     * The job's type.
     */
    JobType?: JobType;
    /**
     * The job's status.
     */
    Status?: UpdateProgress;
  }
  export interface DescribeDeviceRequest {
    /**
     * The device's ID.
     */
    DeviceId: DeviceId;
  }
  export interface DescribeDeviceResponse {
    /**
     * Beta software releases available for the device.
     */
    AlternateSoftwares?: AlternateSoftwares;
    /**
     * The device's ARN.
     */
    Arn?: DeviceArn;
    /**
     * The device's maker.
     */
    Brand?: DeviceBrand;
    /**
     * When the device was created.
     */
    CreatedTime?: CreatedTime;
    /**
     * The device's networking status.
     */
    CurrentNetworkingStatus?: NetworkStatus;
    /**
     * The device's current software version.
     */
    CurrentSoftware?: CurrentSoftware;
    /**
     * The device's description.
     */
    Description?: Description;
    /**
     * A device's aggregated status. Including the device's connection status, provisioning status, and lease status.
     */
    DeviceAggregatedStatus?: DeviceAggregatedStatus;
    /**
     * The device's connection status.
     */
    DeviceConnectionStatus?: DeviceConnectionStatus;
    /**
     * The device's ID.
     */
    DeviceId?: DeviceId;
    /**
     * The most recent beta software release.
     */
    LatestAlternateSoftware?: LatestAlternateSoftware;
    /**
     * A device's latest job. Includes the target image version, and the job status.
     */
    LatestDeviceJob?: LatestDeviceJob;
    /**
     * The latest software version available for the device.
     */
    LatestSoftware?: LatestSoftware;
    /**
     * The device's lease expiration time.
     */
    LeaseExpirationTime?: LeaseExpirationTime;
    /**
     * The device's name.
     */
    Name?: DeviceName;
    /**
     * The device's networking configuration.
     */
    NetworkingConfiguration?: NetworkPayload;
    /**
     * The device's provisioning status.
     */
    ProvisioningStatus?: DeviceStatus;
    /**
     * The device's serial number.
     */
    SerialNumber?: DeviceSerialNumber;
    /**
     * The device's tags.
     */
    Tags?: TagMap;
    /**
     * The device's type.
     */
    Type?: DeviceType;
  }
  export interface DescribeNodeFromTemplateJobRequest {
    /**
     * The job's ID.
     */
    JobId: JobId;
  }
  export interface DescribeNodeFromTemplateJobResponse {
    /**
     * When the job was created.
     */
    CreatedTime: CreatedTime;
    /**
     * The job's ID.
     */
    JobId: JobId;
    /**
     * The job's tags.
     */
    JobTags?: JobTagsList;
    /**
     * When the job was updated.
     */
    LastUpdatedTime: LastUpdatedTime;
    /**
     * The node's description.
     */
    NodeDescription?: Description;
    /**
     * The node's name.
     */
    NodeName: NodeName;
    /**
     * The job's output package name.
     */
    OutputPackageName: NodePackageName;
    /**
     * The job's output package version.
     */
    OutputPackageVersion: NodePackageVersion;
    /**
     * The job's status.
     */
    Status: NodeFromTemplateJobStatus;
    /**
     * The job's status message.
     */
    StatusMessage: NodeFromTemplateJobStatusMessage;
    /**
     * The job's template parameters.
     */
    TemplateParameters: TemplateParametersMap;
    /**
     * The job's template type.
     */
    TemplateType: TemplateType;
  }
  export interface DescribeNodeRequest {
    /**
     * The node's ID.
     */
    NodeId: NodeId;
    /**
     * The account ID of the node's owner.
     */
    OwnerAccount?: PackageOwnerAccount;
  }
  export interface DescribeNodeResponse {
    /**
     * The node's asset name.
     */
    AssetName?: NodeAssetName;
    /**
     * The node's category.
     */
    Category: NodeCategory;
    /**
     * When the node was created.
     */
    CreatedTime: TimeStamp;
    /**
     * The node's description.
     */
    Description: Description;
    /**
     * When the node was updated.
     */
    LastUpdatedTime: TimeStamp;
    /**
     * The node's name.
     */
    Name: NodeName;
    /**
     * The node's ID.
     */
    NodeId: NodeId;
    /**
     * The node's interface.
     */
    NodeInterface: NodeInterface;
    /**
     * The account ID of the node's owner.
     */
    OwnerAccount: PackageOwnerAccount;
    /**
     * The node's ARN.
     */
    PackageArn?: NodePackageArn;
    /**
     * The node's package ID.
     */
    PackageId: NodePackageId;
    /**
     * The node's package name.
     */
    PackageName: NodePackageName;
    /**
     * The node's package version.
     */
    PackageVersion: NodePackageVersion;
    /**
     * The node's patch version.
     */
    PatchVersion: NodePackagePatchVersion;
  }
  export interface DescribePackageImportJobRequest {
    /**
     * The job's ID.
     */
    JobId: JobId;
  }
  export interface DescribePackageImportJobResponse {
    /**
     * The job's client token.
     */
    ClientToken?: ClientToken;
    /**
     * When the job was created.
     */
    CreatedTime: CreatedTime;
    /**
     * The job's input config.
     */
    InputConfig: PackageImportJobInputConfig;
    /**
     * The job's ID.
     */
    JobId: JobId;
    /**
     * The job's tags.
     */
    JobTags?: JobTagsList;
    /**
     * The job's type.
     */
    JobType: PackageImportJobType;
    /**
     * When the job was updated.
     */
    LastUpdatedTime: LastUpdatedTime;
    /**
     * The job's output.
     */
    Output: PackageImportJobOutput;
    /**
     * The job's output config.
     */
    OutputConfig: PackageImportJobOutputConfig;
    /**
     * The job's status.
     */
    Status: PackageImportJobStatus;
    /**
     * The job's status message.
     */
    StatusMessage: PackageImportJobStatusMessage;
  }
  export interface DescribePackageRequest {
    /**
     * The package's ID.
     */
    PackageId: NodePackageId;
  }
  export interface DescribePackageResponse {
    /**
     * The package's ARN.
     */
    Arn: NodePackageArn;
    /**
     * When the package was created.
     */
    CreatedTime: TimeStamp;
    /**
     * The package's ID.
     */
    PackageId: NodePackageId;
    /**
     * The package's name.
     */
    PackageName: NodePackageName;
    /**
     * ARNs of accounts that have read access to the package.
     */
    ReadAccessPrincipalArns?: PrincipalArnsList;
    /**
     * The package's storage location.
     */
    StorageLocation: StorageLocation;
    /**
     * The package's tags.
     */
    Tags: TagMap;
    /**
     * ARNs of accounts that have write access to the package.
     */
    WriteAccessPrincipalArns?: PrincipalArnsList;
  }
  export interface DescribePackageVersionRequest {
    /**
     * The version's owner account.
     */
    OwnerAccount?: PackageOwnerAccount;
    /**
     * The version's ID.
     */
    PackageId: NodePackageId;
    /**
     * The version's version.
     */
    PackageVersion: NodePackageVersion;
    /**
     * The version's patch version.
     */
    PatchVersion?: NodePackagePatchVersion;
  }
  export interface DescribePackageVersionResponse {
    /**
     * Whether the version is the latest available.
     */
    IsLatestPatch: Boolean;
    /**
     * The account ID of the version's owner.
     */
    OwnerAccount?: PackageOwnerAccount;
    /**
     * The ARN of the package.
     */
    PackageArn?: NodePackageArn;
    /**
     * The version's ID.
     */
    PackageId: NodePackageId;
    /**
     * The version's name.
     */
    PackageName: NodePackageName;
    /**
     * The version's version.
     */
    PackageVersion: NodePackageVersion;
    /**
     * The version's patch version.
     */
    PatchVersion: NodePackagePatchVersion;
    /**
     * The version's registered time.
     */
    RegisteredTime?: TimeStamp;
    /**
     * The version's status.
     */
    Status: PackageVersionStatus;
    /**
     * The version's status description.
     */
    StatusDescription?: PackageVersionStatusDescription;
  }
  export type Description = string;
  export type DesiredState = "RUNNING"|"STOPPED"|"REMOVED"|string;
  export interface Device {
    /**
     * The device's maker.
     */
    Brand?: DeviceBrand;
    /**
     * When the device was created.
     */
    CreatedTime?: CreatedTime;
    /**
     * A device's current software.
     */
    CurrentSoftware?: CurrentSoftware;
    /**
     * A description for the device.
     */
    Description?: Description;
    /**
     * A device's aggregated status. Including the device's connection status, provisioning status, and lease status.
     */
    DeviceAggregatedStatus?: DeviceAggregatedStatus;
    /**
     * The device's ID.
     */
    DeviceId?: DeviceId;
    /**
     * When the device was updated.
     */
    LastUpdatedTime?: LastUpdatedTime;
    /**
     * A device's latest job. Includes the target image version, and the update job status.
     */
    LatestDeviceJob?: LatestDeviceJob;
    /**
     * The device's lease expiration time.
     */
    LeaseExpirationTime?: LeaseExpirationTime;
    /**
     * The device's name.
     */
    Name?: DeviceName;
    /**
     * The device's provisioning status.
     */
    ProvisioningStatus?: DeviceStatus;
    /**
     * The device's tags.
     */
    Tags?: TagMap;
    /**
     * The device's type.
     */
    Type?: DeviceType;
  }
  export type DeviceAggregatedStatus = "ERROR"|"AWAITING_PROVISIONING"|"PENDING"|"FAILED"|"DELETING"|"ONLINE"|"OFFLINE"|"LEASE_EXPIRED"|"UPDATE_NEEDED"|"REBOOTING"|string;
  export type DeviceArn = string;
  export type DeviceBrand = "AWS_PANORAMA"|"LENOVO"|string;
  export type DeviceConnectionStatus = "ONLINE"|"OFFLINE"|"AWAITING_CREDENTIALS"|"NOT_AVAILABLE"|"ERROR"|string;
  export type DeviceId = string;
  export type DeviceIdList = DeviceId[];
  export interface DeviceJob {
    /**
     * When the job was created.
     */
    CreatedTime?: CreatedTime;
    /**
     * The ID of the target device.
     */
    DeviceId?: DeviceId;
    /**
     * The name of the target device
     */
    DeviceName?: DeviceName;
    /**
     * The job's ID.
     */
    JobId?: JobId;
    /**
     * The job's type.
     */
    JobType?: JobType;
  }
  export interface DeviceJobConfig {
    /**
     * A configuration for an over-the-air (OTA) upgrade. Required for OTA jobs.
     */
    OTAJobConfig?: OTAJobConfig;
  }
  export type DeviceJobList = DeviceJob[];
  export type DeviceList = Device[];
  export type DeviceName = string;
  export type DeviceReportedStatus = "STOPPING"|"STOPPED"|"STOP_ERROR"|"REMOVAL_FAILED"|"REMOVAL_IN_PROGRESS"|"STARTING"|"RUNNING"|"INSTALL_ERROR"|"LAUNCHED"|"LAUNCH_ERROR"|"INSTALL_IN_PROGRESS"|string;
  export type DeviceSerialNumber = string;
  export type DeviceStatus = "AWAITING_PROVISIONING"|"PENDING"|"SUCCEEDED"|"FAILED"|"ERROR"|"DELETING"|string;
  export type DeviceType = "PANORAMA_APPLIANCE_DEVELOPER_KIT"|"PANORAMA_APPLIANCE"|string;
  export type Dns = string;
  export type DnsList = Dns[];
  export interface EthernetPayload {
    /**
     * How the device gets an IP address.
     */
    ConnectionType: ConnectionType;
    /**
     * Network configuration for a static IP connection.
     */
    StaticIpConnectionInfo?: StaticIpConnectionInfo;
  }
  export interface EthernetStatus {
    /**
     * The device's connection status.
     */
    ConnectionStatus?: NetworkConnectionStatus;
    /**
     * The device's physical address.
     */
    HwAddress?: HwAddress;
    /**
     * The device's IP address.
     */
    IpAddress?: IpAddress;
  }
  export type HwAddress = string;
  export type ImageVersion = string;
  export type InputPortList = NodeInputPort[];
  export type IotThingName = string;
  export type IpAddress = string;
  export type IpAddressOrServerName = string;
  export interface Job {
    /**
     * The target device's ID.
     */
    DeviceId?: DeviceId;
    /**
     * The job's ID.
     */
    JobId?: JobId;
  }
  export type JobId = string;
  export type JobList = Job[];
  export interface JobResourceTags {
    /**
     * The job's type.
     */
    ResourceType: JobResourceType;
    /**
     * The job's tags.
     */
    Tags: TagMap;
  }
  export type JobResourceType = "PACKAGE"|string;
  export type JobTagsList = JobResourceTags[];
  export type JobType = "OTA"|"REBOOT"|string;
  export type LastUpdatedTime = Date;
  export type LatestAlternateSoftware = string;
  export interface LatestDeviceJob {
    /**
     * The target version of the device software.
     */
    ImageVersion?: ImageVersion;
    /**
     * The job's type.
     */
    JobType?: JobType;
    /**
     * Status of the latest device job.
     */
    Status?: UpdateProgress;
  }
  export type LatestSoftware = string;
  export type LeaseExpirationTime = Date;
  export interface ListApplicationInstanceDependenciesRequest {
    /**
     * The application instance's ID.
     */
    ApplicationInstanceId: ApplicationInstanceId;
    /**
     * The maximum number of application instance dependencies to return in one page of results.
     */
    MaxResults?: MaxSize25;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListApplicationInstanceDependenciesResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
    /**
     * A list of package objects.
     */
    PackageObjects?: PackageObjects;
  }
  export interface ListApplicationInstanceNodeInstancesRequest {
    /**
     * The node instances' application instance ID.
     */
    ApplicationInstanceId: ApplicationInstanceId;
    /**
     * The maximum number of node instances to return in one page of results.
     */
    MaxResults?: MaxSize25;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListApplicationInstanceNodeInstancesResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
    /**
     * A list of node instances.
     */
    NodeInstances?: NodeInstances;
  }
  export interface ListApplicationInstancesRequest {
    /**
     * The application instances' device ID.
     */
    DeviceId?: DeviceId;
    /**
     * The maximum number of application instances to return in one page of results.
     */
    MaxResults?: MaxSize25;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
    /**
     * Only include instances with a specific status.
     */
    StatusFilter?: StatusFilter;
  }
  export interface ListApplicationInstancesResponse {
    /**
     * A list of application instances.
     */
    ApplicationInstances?: ApplicationInstances;
    /**
     * A pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
  }
  export interface ListDevicesJobsRequest {
    /**
     * Filter results by the job's target device ID.
     */
    DeviceId?: DeviceId;
    /**
     * The maximum number of device jobs to return in one page of results.
     */
    MaxResults?: MaxSize25;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListDevicesJobsResponse {
    /**
     * A list of jobs.
     */
    DeviceJobs?: DeviceJobList;
    /**
     * A pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
  }
  export interface ListDevicesRequest {
    /**
     * Filter based on a device's status.
     */
    DeviceAggregatedStatusFilter?: DeviceAggregatedStatus;
    /**
     * The maximum number of devices to return in one page of results.
     */
    MaxResults?: MaxSize25;
    /**
     * Filter based on device's name. Prefixes supported.
     */
    NameFilter?: NameFilter;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
    /**
     * The target column to be sorted on. Default column sort is CREATED_TIME.
     */
    SortBy?: ListDevicesSortBy;
    /**
     * The sorting order for the returned list. SortOrder is DESCENDING by default based on CREATED_TIME. Otherwise, SortOrder is ASCENDING.
     */
    SortOrder?: SortOrder;
  }
  export interface ListDevicesResponse {
    /**
     * A list of devices.
     */
    Devices: DeviceList;
    /**
     * A pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
  }
  export type ListDevicesSortBy = "DEVICE_ID"|"CREATED_TIME"|"NAME"|"DEVICE_AGGREGATED_STATUS"|string;
  export interface ListNodeFromTemplateJobsRequest {
    /**
     * The maximum number of node from template jobs to return in one page of results.
     */
    MaxResults?: MaxSize25;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListNodeFromTemplateJobsResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
    /**
     * A list of jobs.
     */
    NodeFromTemplateJobs: NodeFromTemplateJobList;
  }
  export interface ListNodesRequest {
    /**
     * Search for nodes by category.
     */
    Category?: NodeCategory;
    /**
     * The maximum number of nodes to return in one page of results.
     */
    MaxResults?: MaxSize25;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: Token;
    /**
     * Search for nodes by the account ID of the nodes' owner.
     */
    OwnerAccount?: PackageOwnerAccount;
    /**
     * Search for nodes by name.
     */
    PackageName?: NodePackageName;
    /**
     * Search for nodes by version.
     */
    PackageVersion?: NodePackageVersion;
    /**
     * Search for nodes by patch version.
     */
    PatchVersion?: NodePackagePatchVersion;
  }
  export interface ListNodesResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    NextToken?: Token;
    /**
     * A list of nodes.
     */
    Nodes?: NodesList;
  }
  export interface ListPackageImportJobsRequest {
    /**
     * The maximum number of package import jobs to return in one page of results.
     */
    MaxResults?: MaxSize25;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: NextToken;
  }
  export interface ListPackageImportJobsResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
    /**
     * A list of package import jobs.
     */
    PackageImportJobs: PackageImportJobList;
  }
  export interface ListPackagesRequest {
    /**
     * The maximum number of packages to return in one page of results.
     */
    MaxResults?: MaxSize25;
    /**
     * Specify the pagination token from a previous request to retrieve the next page of results.
     */
    NextToken?: Token;
  }
  export interface ListPackagesResponse {
    /**
     * A pagination token that's included if more results are available.
     */
    NextToken?: NextToken;
    /**
     * A list of packages.
     */
    Packages?: PackageList;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The resource's ARN.
     */
    ResourceArn: ResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of tags.
     */
    Tags?: TagMap;
  }
  export interface ManifestOverridesPayload {
    /**
     * The overrides document.
     */
    PayloadData?: ManifestOverridesPayloadData;
  }
  export type ManifestOverridesPayloadData = string;
  export interface ManifestPayload {
    /**
     * The application manifest.
     */
    PayloadData?: ManifestPayloadData;
  }
  export type ManifestPayloadData = string;
  export type MarkLatestPatch = boolean;
  export type Mask = string;
  export type MaxConnections = number;
  export type MaxSize25 = number;
  export type NameFilter = string;
  export type NetworkConnectionStatus = "CONNECTED"|"NOT_CONNECTED"|"CONNECTING"|string;
  export interface NetworkPayload {
    /**
     * Settings for Ethernet port 0.
     */
    Ethernet0?: EthernetPayload;
    /**
     * Settings for Ethernet port 1.
     */
    Ethernet1?: EthernetPayload;
    /**
     * Network time protocol (NTP) server settings.
     */
    Ntp?: NtpPayload;
  }
  export interface NetworkStatus {
    /**
     * The status of Ethernet port 0.
     */
    Ethernet0Status?: EthernetStatus;
    /**
     * The status of Ethernet port 1.
     */
    Ethernet1Status?: EthernetStatus;
    /**
     * When the network status changed.
     */
    LastUpdatedTime?: LastUpdatedTime;
    /**
     * Details about a network time protocol (NTP) server connection.
     */
    NtpStatus?: NtpStatus;
  }
  export type NextToken = string;
  export interface Node {
    /**
     * The node's category.
     */
    Category: NodeCategory;
    /**
     * When the node was created.
     */
    CreatedTime: TimeStamp;
    /**
     * The node's description.
     */
    Description?: Description;
    /**
     * The node's name.
     */
    Name: NodeName;
    /**
     * The node's ID.
     */
    NodeId: NodeId;
    /**
     * The account ID of the node's owner.
     */
    OwnerAccount?: PackageOwnerAccount;
    /**
     * The node's ARN.
     */
    PackageArn?: NodePackageArn;
    /**
     * The node's package ID.
     */
    PackageId: NodePackageId;
    /**
     * The node's package name.
     */
    PackageName: NodePackageName;
    /**
     * The node's package version.
     */
    PackageVersion: NodePackageVersion;
    /**
     * The node's patch version.
     */
    PatchVersion: NodePackagePatchVersion;
  }
  export type NodeAssetName = string;
  export type NodeCategory = "BUSINESS_LOGIC"|"ML_MODEL"|"MEDIA_SOURCE"|"MEDIA_SINK"|string;
  export interface NodeFromTemplateJob {
    /**
     * When the job was created.
     */
    CreatedTime?: CreatedTime;
    /**
     * The job's ID.
     */
    JobId?: JobId;
    /**
     * The node's name.
     */
    NodeName?: NodeName;
    /**
     * The job's status.
     */
    Status?: NodeFromTemplateJobStatus;
    /**
     * The job's status message.
     */
    StatusMessage?: NodeFromTemplateJobStatusMessage;
    /**
     * The job's template type.
     */
    TemplateType?: TemplateType;
  }
  export type NodeFromTemplateJobList = NodeFromTemplateJob[];
  export type NodeFromTemplateJobStatus = "PENDING"|"SUCCEEDED"|"FAILED"|string;
  export type NodeFromTemplateJobStatusMessage = string;
  export type NodeId = string;
  export interface NodeInputPort {
    /**
     * The input port's default value.
     */
    DefaultValue?: PortDefaultValue;
    /**
     * The input port's description.
     */
    Description?: Description;
    /**
     * The input port's max connections.
     */
    MaxConnections?: MaxConnections;
    /**
     * The input port's name.
     */
    Name?: PortName;
    /**
     * The input port's type.
     */
    Type?: PortType;
  }
  export interface NodeInstance {
    /**
     * The instance's current status.
     */
    CurrentStatus: NodeInstanceStatus;
    /**
     * The node's ID.
     */
    NodeId?: NodeId;
    /**
     * The instance's ID.
     */
    NodeInstanceId: NodeInstanceId;
    /**
     * The instance's name.
     */
    NodeName?: NodeName;
    /**
     * The instance's package name.
     */
    PackageName?: NodePackageName;
    /**
     * The instance's package patch version.
     */
    PackagePatchVersion?: NodePackagePatchVersion;
    /**
     * The instance's package version.
     */
    PackageVersion?: NodePackageVersion;
  }
  export type NodeInstanceId = string;
  export type NodeInstanceStatus = "RUNNING"|"ERROR"|"NOT_AVAILABLE"|"PAUSED"|string;
  export type NodeInstances = NodeInstance[];
  export interface NodeInterface {
    /**
     * The node interface's inputs.
     */
    Inputs: InputPortList;
    /**
     * The node interface's outputs.
     */
    Outputs: OutputPortList;
  }
  export type NodeName = string;
  export interface NodeOutputPort {
    /**
     * The output port's description.
     */
    Description?: Description;
    /**
     * The output port's name.
     */
    Name?: PortName;
    /**
     * The output port's type.
     */
    Type?: PortType;
  }
  export type NodePackageArn = string;
  export type NodePackageId = string;
  export type NodePackageName = string;
  export type NodePackagePatchVersion = string;
  export type NodePackageVersion = string;
  export interface NodeSignal {
    /**
     * The camera node's name, from the application manifest.
     */
    NodeInstanceId: NodeInstanceId;
    /**
     * The signal value.
     */
    Signal: NodeSignalValue;
  }
  export type NodeSignalList = NodeSignal[];
  export type NodeSignalValue = "PAUSE"|"RESUME"|string;
  export type NodesList = Node[];
  export interface NtpPayload {
    /**
     * NTP servers to use, in order of preference.
     */
    NtpServers: NtpServerList;
  }
  export type NtpServerList = IpAddressOrServerName[];
  export type NtpServerName = string;
  export interface NtpStatus {
    /**
     * The connection's status.
     */
    ConnectionStatus?: NetworkConnectionStatus;
    /**
     * The IP address of the server.
     */
    IpAddress?: IpAddress;
    /**
     * The domain name of the server.
     */
    NtpServerName?: NtpServerName;
  }
  export interface OTAJobConfig {
    /**
     * Whether to apply the update if it is a major version change.
     */
    AllowMajorVersionUpdate?: Boolean;
    /**
     * The target version of the device software.
     */
    ImageVersion: ImageVersion;
  }
  export type Object = string;
  export type ObjectKey = string;
  export interface OutPutS3Location {
    /**
     * The object's bucket.
     */
    BucketName: BucketName;
    /**
     * The object's key.
     */
    ObjectKey: ObjectKey;
  }
  export type OutputPortList = NodeOutputPort[];
  export interface PackageImportJob {
    /**
     * When the job was created.
     */
    CreatedTime?: CreatedTime;
    /**
     * The job's ID.
     */
    JobId?: JobId;
    /**
     * The job's type.
     */
    JobType?: PackageImportJobType;
    /**
     * When the job was updated.
     */
    LastUpdatedTime?: LastUpdatedTime;
    /**
     * The job's status.
     */
    Status?: PackageImportJobStatus;
    /**
     * The job's status message.
     */
    StatusMessage?: PackageImportJobStatusMessage;
  }
  export interface PackageImportJobInputConfig {
    /**
     * The package version's input configuration.
     */
    PackageVersionInputConfig?: PackageVersionInputConfig;
  }
  export type PackageImportJobList = PackageImportJob[];
  export interface PackageImportJobOutput {
    /**
     * The package's output location.
     */
    OutputS3Location: OutPutS3Location;
    /**
     * The package's ID.
     */
    PackageId: NodePackageId;
    /**
     * The package's version.
     */
    PackageVersion: NodePackageVersion;
    /**
     * The package's patch version.
     */
    PatchVersion: NodePackagePatchVersion;
  }
  export interface PackageImportJobOutputConfig {
    /**
     * The package version's output configuration.
     */
    PackageVersionOutputConfig?: PackageVersionOutputConfig;
  }
  export type PackageImportJobStatus = "PENDING"|"SUCCEEDED"|"FAILED"|string;
  export type PackageImportJobStatusMessage = string;
  export type PackageImportJobType = "NODE_PACKAGE_VERSION"|"MARKETPLACE_NODE_PACKAGE_VERSION"|string;
  export type PackageList = PackageListItem[];
  export interface PackageListItem {
    /**
     * The package's ARN.
     */
    Arn?: NodePackageArn;
    /**
     * When the package was created.
     */
    CreatedTime?: TimeStamp;
    /**
     * The package's ID.
     */
    PackageId?: NodePackageId;
    /**
     * The package's name.
     */
    PackageName?: NodePackageName;
    /**
     * The package's tags.
     */
    Tags?: TagMap;
  }
  export interface PackageObject {
    /**
     * The object's name.
     */
    Name: NodePackageName;
    /**
     * The object's package version.
     */
    PackageVersion: NodePackageVersion;
    /**
     * The object's patch version.
     */
    PatchVersion: NodePackagePatchVersion;
  }
  export type PackageObjects = PackageObject[];
  export type PackageOwnerAccount = string;
  export interface PackageVersionInputConfig {
    /**
     * A location in Amazon S3.
     */
    S3Location: S3Location;
  }
  export interface PackageVersionOutputConfig {
    /**
     * Indicates that the version is recommended for all users.
     */
    MarkLatest?: MarkLatestPatch;
    /**
     * The output's package name.
     */
    PackageName: NodePackageName;
    /**
     * The output's package version.
     */
    PackageVersion: NodePackageVersion;
  }
  export type PackageVersionStatus = "REGISTER_PENDING"|"REGISTER_COMPLETED"|"FAILED"|"DELETING"|string;
  export type PackageVersionStatusDescription = string;
  export type PortDefaultValue = string;
  export type PortName = string;
  export type PortType = "BOOLEAN"|"STRING"|"INT32"|"FLOAT32"|"MEDIA"|string;
  export type PrincipalArn = string;
  export type PrincipalArnsList = PrincipalArn[];
  export interface ProvisionDeviceRequest {
    /**
     * A description for the device.
     */
    Description?: Description;
    /**
     * A name for the device.
     */
    Name: DeviceName;
    /**
     * A networking configuration for the device.
     */
    NetworkingConfiguration?: NetworkPayload;
    /**
     * Tags for the device.
     */
    Tags?: TagMap;
  }
  export interface ProvisionDeviceResponse {
    /**
     * The device's ARN.
     */
    Arn: DeviceArn;
    /**
     * The device's configuration bundle.
     */
    Certificates?: Certificates;
    /**
     * The device's ID.
     */
    DeviceId?: DeviceId;
    /**
     * The device's IoT thing name.
     */
    IotThingName?: IotThingName;
    /**
     * The device's status.
     */
    Status: DeviceStatus;
  }
  export type Region = string;
  export interface RegisterPackageVersionRequest {
    /**
     * Whether to mark the new version as the latest version.
     */
    MarkLatest?: MarkLatestPatch;
    /**
     * An owner account.
     */
    OwnerAccount?: PackageOwnerAccount;
    /**
     * A package ID.
     */
    PackageId: NodePackageId;
    /**
     * A package version.
     */
    PackageVersion: NodePackageVersion;
    /**
     * A patch version.
     */
    PatchVersion: NodePackagePatchVersion;
  }
  export interface RegisterPackageVersionResponse {
  }
  export interface RemoveApplicationInstanceRequest {
    /**
     * An application instance ID.
     */
    ApplicationInstanceId: ApplicationInstanceId;
  }
  export interface RemoveApplicationInstanceResponse {
  }
  export interface ReportedRuntimeContextState {
    /**
     * The application's desired state.
     */
    DesiredState: DesiredState;
    /**
     * The application's reported status.
     */
    DeviceReportedStatus: DeviceReportedStatus;
    /**
     * When the device reported the application's state.
     */
    DeviceReportedTime: TimeStamp;
    /**
     * The device's name.
     */
    RuntimeContextName: RuntimeContextName;
  }
  export type ReportedRuntimeContextStates = ReportedRuntimeContextState[];
  export type ResourceArn = string;
  export type RuntimeContextName = string;
  export type RuntimeRoleArn = string;
  export interface S3Location {
    /**
     * A bucket name.
     */
    BucketName: BucketName;
    /**
     * An object key.
     */
    ObjectKey: ObjectKey;
    /**
     * The bucket's Region.
     */
    Region?: Region;
  }
  export interface SignalApplicationInstanceNodeInstancesRequest {
    /**
     * An application instance ID.
     */
    ApplicationInstanceId: ApplicationInstanceId;
    /**
     * A list of signals.
     */
    NodeSignals: NodeSignalList;
  }
  export interface SignalApplicationInstanceNodeInstancesResponse {
    /**
     * An application instance ID.
     */
    ApplicationInstanceId: ApplicationInstanceId;
  }
  export type SortOrder = "ASCENDING"|"DESCENDING"|string;
  export interface StaticIpConnectionInfo {
    /**
     * The connection's default gateway.
     */
    DefaultGateway: DefaultGateway;
    /**
     * The connection's DNS address.
     */
    Dns: DnsList;
    /**
     * The connection's IP address.
     */
    IpAddress: IpAddress;
    /**
     * The connection's DNS mask.
     */
    Mask: Mask;
  }
  export type StatusFilter = "DEPLOYMENT_SUCCEEDED"|"DEPLOYMENT_ERROR"|"REMOVAL_SUCCEEDED"|"REMOVAL_FAILED"|"PROCESSING_DEPLOYMENT"|"PROCESSING_REMOVAL"|"DEPLOYMENT_FAILED"|string;
  export interface StorageLocation {
    /**
     * The location's binary prefix.
     */
    BinaryPrefixLocation: Object;
    /**
     * The location's bucket.
     */
    Bucket: Bucket;
    /**
     * The location's generated prefix.
     */
    GeneratedPrefixLocation: Object;
    /**
     * The location's manifest prefix.
     */
    ManifestPrefixLocation: Object;
    /**
     * The location's repo prefix.
     */
    RepoPrefixLocation: Object;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The resource's ARN.
     */
    ResourceArn: ResourceArn;
    /**
     * Tags for the resource.
     */
    Tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TemplateKey = string;
  export type TemplateParametersMap = {[key: string]: TemplateValue};
  export type TemplateType = "RTSP_CAMERA_STREAM"|string;
  export type TemplateValue = string;
  export type TimeStamp = Date;
  export type Token = string;
  export interface UntagResourceRequest {
    /**
     * The resource's ARN.
     */
    ResourceArn: ResourceArn;
    /**
     * Tag keys to remove.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export type UpdateCreatedTime = Date;
  export interface UpdateDeviceMetadataRequest {
    /**
     * A description for the device.
     */
    Description?: Description;
    /**
     * The device's ID.
     */
    DeviceId: DeviceId;
  }
  export interface UpdateDeviceMetadataResponse {
    /**
     * The device's ID.
     */
    DeviceId?: DeviceId;
  }
  export type UpdateProgress = "PENDING"|"IN_PROGRESS"|"VERIFYING"|"REBOOTING"|"DOWNLOADING"|"COMPLETED"|"FAILED"|string;
  export type Version = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-07-24"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Panorama client.
   */
  export import Types = Panorama;
}
export = Panorama;
