import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Snowball extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Snowball.Types.ClientConfiguration)
  config: Config & Snowball.Types.ClientConfiguration;
  /**
   * Cancels a cluster job. You can only cancel a cluster job while it's in the AwaitingQuorum status. You'll have at least an hour after creating a cluster job to cancel it.
   */
  cancelCluster(params: Snowball.Types.CancelClusterRequest, callback?: (err: AWSError, data: Snowball.Types.CancelClusterResult) => void): Request<Snowball.Types.CancelClusterResult, AWSError>;
  /**
   * Cancels a cluster job. You can only cancel a cluster job while it's in the AwaitingQuorum status. You'll have at least an hour after creating a cluster job to cancel it.
   */
  cancelCluster(callback?: (err: AWSError, data: Snowball.Types.CancelClusterResult) => void): Request<Snowball.Types.CancelClusterResult, AWSError>;
  /**
   * Cancels the specified job. You can only cancel a job before its JobState value changes to PreparingAppliance. Requesting the ListJobs or DescribeJob action returns a job's JobState as part of the response element data returned.
   */
  cancelJob(params: Snowball.Types.CancelJobRequest, callback?: (err: AWSError, data: Snowball.Types.CancelJobResult) => void): Request<Snowball.Types.CancelJobResult, AWSError>;
  /**
   * Cancels the specified job. You can only cancel a job before its JobState value changes to PreparingAppliance. Requesting the ListJobs or DescribeJob action returns a job's JobState as part of the response element data returned.
   */
  cancelJob(callback?: (err: AWSError, data: Snowball.Types.CancelJobResult) => void): Request<Snowball.Types.CancelJobResult, AWSError>;
  /**
   * Creates an address for a Snow device to be shipped to. In most regions, addresses are validated at the time of creation. The address you provide must be located within the serviceable area of your region. If the address is invalid or unsupported, then an exception is thrown.
   */
  createAddress(params: Snowball.Types.CreateAddressRequest, callback?: (err: AWSError, data: Snowball.Types.CreateAddressResult) => void): Request<Snowball.Types.CreateAddressResult, AWSError>;
  /**
   * Creates an address for a Snow device to be shipped to. In most regions, addresses are validated at the time of creation. The address you provide must be located within the serviceable area of your region. If the address is invalid or unsupported, then an exception is thrown.
   */
  createAddress(callback?: (err: AWSError, data: Snowball.Types.CreateAddressResult) => void): Request<Snowball.Types.CreateAddressResult, AWSError>;
  /**
   * Creates an empty cluster. Each cluster supports five nodes. You use the CreateJob action separately to create the jobs for each of these nodes. The cluster does not ship until these five node jobs have been created.
   */
  createCluster(params: Snowball.Types.CreateClusterRequest, callback?: (err: AWSError, data: Snowball.Types.CreateClusterResult) => void): Request<Snowball.Types.CreateClusterResult, AWSError>;
  /**
   * Creates an empty cluster. Each cluster supports five nodes. You use the CreateJob action separately to create the jobs for each of these nodes. The cluster does not ship until these five node jobs have been created.
   */
  createCluster(callback?: (err: AWSError, data: Snowball.Types.CreateClusterResult) => void): Request<Snowball.Types.CreateClusterResult, AWSError>;
  /**
   * Creates a job to import or export data between Amazon S3 and your on-premises data center. Your Amazon Web Services account must have the right trust policies and permissions in place to create a job for a Snow device. If you're creating a job for a node in a cluster, you only need to provide the clusterId value; the other job attributes are inherited from the cluster.   Only the Snowball; Edge device type is supported when ordering clustered jobs. The device capacity is optional. Availability of device types differ by Amazon Web Services Region. For more information about Region availability, see Amazon Web Services Regional Services.    Snow Family devices and their capacities.    Device type: SNC1_SSD    Capacity: T14   Description: Snowcone       Device type: SNC1_HDD    Capacity: T8   Description: Snowcone       Device type: EDGE_S    Capacity: T98   Description: Snowball Edge Storage Optimized for data transfer only       Device type: EDGE_CG    Capacity: T42   Description: Snowball Edge Compute Optimized with GPU      Device type: EDGE_C    Capacity: T42   Description: Snowball Edge Compute Optimized without GPU      Device type: EDGE    Capacity: T100   Description: Snowball Edge Storage Optimized with EC2 Compute    This device is replaced with T98.     Device type: STANDARD    Capacity: T50   Description: Original Snowball device  This device is only available in the Ningxia, Beijing, and Singapore Amazon Web Services Region        Device type: STANDARD    Capacity: T80   Description: Original Snowball device  This device is only available in the Ningxia, Beijing, and Singapore Amazon Web Services Region.        Snow Family device type: RACK_5U_C    Capacity: T13    Description: Snowblade.     Device type: V3_5S    Capacity: T240   Description: Snowball Edge Storage Optimized 210TB    
   */
  createJob(params: Snowball.Types.CreateJobRequest, callback?: (err: AWSError, data: Snowball.Types.CreateJobResult) => void): Request<Snowball.Types.CreateJobResult, AWSError>;
  /**
   * Creates a job to import or export data between Amazon S3 and your on-premises data center. Your Amazon Web Services account must have the right trust policies and permissions in place to create a job for a Snow device. If you're creating a job for a node in a cluster, you only need to provide the clusterId value; the other job attributes are inherited from the cluster.   Only the Snowball; Edge device type is supported when ordering clustered jobs. The device capacity is optional. Availability of device types differ by Amazon Web Services Region. For more information about Region availability, see Amazon Web Services Regional Services.    Snow Family devices and their capacities.    Device type: SNC1_SSD    Capacity: T14   Description: Snowcone       Device type: SNC1_HDD    Capacity: T8   Description: Snowcone       Device type: EDGE_S    Capacity: T98   Description: Snowball Edge Storage Optimized for data transfer only       Device type: EDGE_CG    Capacity: T42   Description: Snowball Edge Compute Optimized with GPU      Device type: EDGE_C    Capacity: T42   Description: Snowball Edge Compute Optimized without GPU      Device type: EDGE    Capacity: T100   Description: Snowball Edge Storage Optimized with EC2 Compute    This device is replaced with T98.     Device type: STANDARD    Capacity: T50   Description: Original Snowball device  This device is only available in the Ningxia, Beijing, and Singapore Amazon Web Services Region        Device type: STANDARD    Capacity: T80   Description: Original Snowball device  This device is only available in the Ningxia, Beijing, and Singapore Amazon Web Services Region.        Snow Family device type: RACK_5U_C    Capacity: T13    Description: Snowblade.     Device type: V3_5S    Capacity: T240   Description: Snowball Edge Storage Optimized 210TB    
   */
  createJob(callback?: (err: AWSError, data: Snowball.Types.CreateJobResult) => void): Request<Snowball.Types.CreateJobResult, AWSError>;
  /**
   * Creates a job with the long-term usage option for a device. The long-term usage is a 1-year or 3-year long-term pricing type for the device. You are billed upfront, and Amazon Web Services provides discounts for long-term pricing. 
   */
  createLongTermPricing(params: Snowball.Types.CreateLongTermPricingRequest, callback?: (err: AWSError, data: Snowball.Types.CreateLongTermPricingResult) => void): Request<Snowball.Types.CreateLongTermPricingResult, AWSError>;
  /**
   * Creates a job with the long-term usage option for a device. The long-term usage is a 1-year or 3-year long-term pricing type for the device. You are billed upfront, and Amazon Web Services provides discounts for long-term pricing. 
   */
  createLongTermPricing(callback?: (err: AWSError, data: Snowball.Types.CreateLongTermPricingResult) => void): Request<Snowball.Types.CreateLongTermPricingResult, AWSError>;
  /**
   * Creates a shipping label that will be used to return the Snow device to Amazon Web Services.
   */
  createReturnShippingLabel(params: Snowball.Types.CreateReturnShippingLabelRequest, callback?: (err: AWSError, data: Snowball.Types.CreateReturnShippingLabelResult) => void): Request<Snowball.Types.CreateReturnShippingLabelResult, AWSError>;
  /**
   * Creates a shipping label that will be used to return the Snow device to Amazon Web Services.
   */
  createReturnShippingLabel(callback?: (err: AWSError, data: Snowball.Types.CreateReturnShippingLabelResult) => void): Request<Snowball.Types.CreateReturnShippingLabelResult, AWSError>;
  /**
   * Takes an AddressId and returns specific details about that address in the form of an Address object.
   */
  describeAddress(params: Snowball.Types.DescribeAddressRequest, callback?: (err: AWSError, data: Snowball.Types.DescribeAddressResult) => void): Request<Snowball.Types.DescribeAddressResult, AWSError>;
  /**
   * Takes an AddressId and returns specific details about that address in the form of an Address object.
   */
  describeAddress(callback?: (err: AWSError, data: Snowball.Types.DescribeAddressResult) => void): Request<Snowball.Types.DescribeAddressResult, AWSError>;
  /**
   * Returns a specified number of ADDRESS objects. Calling this API in one of the US regions will return addresses from the list of all addresses associated with this account in all US regions.
   */
  describeAddresses(params: Snowball.Types.DescribeAddressesRequest, callback?: (err: AWSError, data: Snowball.Types.DescribeAddressesResult) => void): Request<Snowball.Types.DescribeAddressesResult, AWSError>;
  /**
   * Returns a specified number of ADDRESS objects. Calling this API in one of the US regions will return addresses from the list of all addresses associated with this account in all US regions.
   */
  describeAddresses(callback?: (err: AWSError, data: Snowball.Types.DescribeAddressesResult) => void): Request<Snowball.Types.DescribeAddressesResult, AWSError>;
  /**
   * Returns information about a specific cluster including shipping information, cluster status, and other important metadata.
   */
  describeCluster(params: Snowball.Types.DescribeClusterRequest, callback?: (err: AWSError, data: Snowball.Types.DescribeClusterResult) => void): Request<Snowball.Types.DescribeClusterResult, AWSError>;
  /**
   * Returns information about a specific cluster including shipping information, cluster status, and other important metadata.
   */
  describeCluster(callback?: (err: AWSError, data: Snowball.Types.DescribeClusterResult) => void): Request<Snowball.Types.DescribeClusterResult, AWSError>;
  /**
   * Returns information about a specific job including shipping information, job status, and other important metadata. 
   */
  describeJob(params: Snowball.Types.DescribeJobRequest, callback?: (err: AWSError, data: Snowball.Types.DescribeJobResult) => void): Request<Snowball.Types.DescribeJobResult, AWSError>;
  /**
   * Returns information about a specific job including shipping information, job status, and other important metadata. 
   */
  describeJob(callback?: (err: AWSError, data: Snowball.Types.DescribeJobResult) => void): Request<Snowball.Types.DescribeJobResult, AWSError>;
  /**
   * Information on the shipping label of a Snow device that is being returned to Amazon Web Services.
   */
  describeReturnShippingLabel(params: Snowball.Types.DescribeReturnShippingLabelRequest, callback?: (err: AWSError, data: Snowball.Types.DescribeReturnShippingLabelResult) => void): Request<Snowball.Types.DescribeReturnShippingLabelResult, AWSError>;
  /**
   * Information on the shipping label of a Snow device that is being returned to Amazon Web Services.
   */
  describeReturnShippingLabel(callback?: (err: AWSError, data: Snowball.Types.DescribeReturnShippingLabelResult) => void): Request<Snowball.Types.DescribeReturnShippingLabelResult, AWSError>;
  /**
   * Returns a link to an Amazon S3 presigned URL for the manifest file associated with the specified JobId value. You can access the manifest file for up to 60 minutes after this request has been made. To access the manifest file after 60 minutes have passed, you'll have to make another call to the GetJobManifest action. The manifest is an encrypted file that you can download after your job enters the WithCustomer status. This is the only valid status for calling this API as the manifest and UnlockCode code value are used for securing your device and should only be used when you have the device. The manifest is decrypted by using the UnlockCode code value, when you pass both values to the Snow device through the Snowball client when the client is started for the first time.  As a best practice, we recommend that you don't save a copy of an UnlockCode value in the same location as the manifest file for that job. Saving these separately helps prevent unauthorized parties from gaining access to the Snow device associated with that job. The credentials of a given job, including its manifest file and unlock code, expire 360 days after the job is created.
   */
  getJobManifest(params: Snowball.Types.GetJobManifestRequest, callback?: (err: AWSError, data: Snowball.Types.GetJobManifestResult) => void): Request<Snowball.Types.GetJobManifestResult, AWSError>;
  /**
   * Returns a link to an Amazon S3 presigned URL for the manifest file associated with the specified JobId value. You can access the manifest file for up to 60 minutes after this request has been made. To access the manifest file after 60 minutes have passed, you'll have to make another call to the GetJobManifest action. The manifest is an encrypted file that you can download after your job enters the WithCustomer status. This is the only valid status for calling this API as the manifest and UnlockCode code value are used for securing your device and should only be used when you have the device. The manifest is decrypted by using the UnlockCode code value, when you pass both values to the Snow device through the Snowball client when the client is started for the first time.  As a best practice, we recommend that you don't save a copy of an UnlockCode value in the same location as the manifest file for that job. Saving these separately helps prevent unauthorized parties from gaining access to the Snow device associated with that job. The credentials of a given job, including its manifest file and unlock code, expire 360 days after the job is created.
   */
  getJobManifest(callback?: (err: AWSError, data: Snowball.Types.GetJobManifestResult) => void): Request<Snowball.Types.GetJobManifestResult, AWSError>;
  /**
   * Returns the UnlockCode code value for the specified job. A particular UnlockCode value can be accessed for up to 360 days after the associated job has been created. The UnlockCode value is a 29-character code with 25 alphanumeric characters and 4 hyphens. This code is used to decrypt the manifest file when it is passed along with the manifest to the Snow device through the Snowball client when the client is started for the first time. The only valid status for calling this API is WithCustomer as the manifest and Unlock code values are used for securing your device and should only be used when you have the device. As a best practice, we recommend that you don't save a copy of the UnlockCode in the same location as the manifest file for that job. Saving these separately helps prevent unauthorized parties from gaining access to the Snow device associated with that job.
   */
  getJobUnlockCode(params: Snowball.Types.GetJobUnlockCodeRequest, callback?: (err: AWSError, data: Snowball.Types.GetJobUnlockCodeResult) => void): Request<Snowball.Types.GetJobUnlockCodeResult, AWSError>;
  /**
   * Returns the UnlockCode code value for the specified job. A particular UnlockCode value can be accessed for up to 360 days after the associated job has been created. The UnlockCode value is a 29-character code with 25 alphanumeric characters and 4 hyphens. This code is used to decrypt the manifest file when it is passed along with the manifest to the Snow device through the Snowball client when the client is started for the first time. The only valid status for calling this API is WithCustomer as the manifest and Unlock code values are used for securing your device and should only be used when you have the device. As a best practice, we recommend that you don't save a copy of the UnlockCode in the same location as the manifest file for that job. Saving these separately helps prevent unauthorized parties from gaining access to the Snow device associated with that job.
   */
  getJobUnlockCode(callback?: (err: AWSError, data: Snowball.Types.GetJobUnlockCodeResult) => void): Request<Snowball.Types.GetJobUnlockCodeResult, AWSError>;
  /**
   * Returns information about the Snow Family service limit for your account, and also the number of Snow devices your account has in use. The default service limit for the number of Snow devices that you can have at one time is 1. If you want to increase your service limit, contact Amazon Web Services Support.
   */
  getSnowballUsage(params: Snowball.Types.GetSnowballUsageRequest, callback?: (err: AWSError, data: Snowball.Types.GetSnowballUsageResult) => void): Request<Snowball.Types.GetSnowballUsageResult, AWSError>;
  /**
   * Returns information about the Snow Family service limit for your account, and also the number of Snow devices your account has in use. The default service limit for the number of Snow devices that you can have at one time is 1. If you want to increase your service limit, contact Amazon Web Services Support.
   */
  getSnowballUsage(callback?: (err: AWSError, data: Snowball.Types.GetSnowballUsageResult) => void): Request<Snowball.Types.GetSnowballUsageResult, AWSError>;
  /**
   * Returns an Amazon S3 presigned URL for an update file associated with a specified JobId.
   */
  getSoftwareUpdates(params: Snowball.Types.GetSoftwareUpdatesRequest, callback?: (err: AWSError, data: Snowball.Types.GetSoftwareUpdatesResult) => void): Request<Snowball.Types.GetSoftwareUpdatesResult, AWSError>;
  /**
   * Returns an Amazon S3 presigned URL for an update file associated with a specified JobId.
   */
  getSoftwareUpdates(callback?: (err: AWSError, data: Snowball.Types.GetSoftwareUpdatesResult) => void): Request<Snowball.Types.GetSoftwareUpdatesResult, AWSError>;
  /**
   * Returns an array of JobListEntry objects of the specified length. Each JobListEntry object is for a job in the specified cluster and contains a job's state, a job's ID, and other information.
   */
  listClusterJobs(params: Snowball.Types.ListClusterJobsRequest, callback?: (err: AWSError, data: Snowball.Types.ListClusterJobsResult) => void): Request<Snowball.Types.ListClusterJobsResult, AWSError>;
  /**
   * Returns an array of JobListEntry objects of the specified length. Each JobListEntry object is for a job in the specified cluster and contains a job's state, a job's ID, and other information.
   */
  listClusterJobs(callback?: (err: AWSError, data: Snowball.Types.ListClusterJobsResult) => void): Request<Snowball.Types.ListClusterJobsResult, AWSError>;
  /**
   * Returns an array of ClusterListEntry objects of the specified length. Each ClusterListEntry object contains a cluster's state, a cluster's ID, and other important status information.
   */
  listClusters(params: Snowball.Types.ListClustersRequest, callback?: (err: AWSError, data: Snowball.Types.ListClustersResult) => void): Request<Snowball.Types.ListClustersResult, AWSError>;
  /**
   * Returns an array of ClusterListEntry objects of the specified length. Each ClusterListEntry object contains a cluster's state, a cluster's ID, and other important status information.
   */
  listClusters(callback?: (err: AWSError, data: Snowball.Types.ListClustersResult) => void): Request<Snowball.Types.ListClustersResult, AWSError>;
  /**
   * This action returns a list of the different Amazon EC2-compatible Amazon Machine Images (AMIs) that are owned by your Amazon Web Services accountthat would be supported for use on a Snow device. Currently, supported AMIs are based on the Amazon Linux-2, Ubuntu 20.04 LTS - Focal, or Ubuntu 22.04 LTS - Jammy images, available on the Amazon Web Services Marketplace. Ubuntu 16.04 LTS - Xenial (HVM) images are no longer supported in the Market, but still supported for use on devices through Amazon EC2 VM Import/Export and running locally in AMIs.
   */
  listCompatibleImages(params: Snowball.Types.ListCompatibleImagesRequest, callback?: (err: AWSError, data: Snowball.Types.ListCompatibleImagesResult) => void): Request<Snowball.Types.ListCompatibleImagesResult, AWSError>;
  /**
   * This action returns a list of the different Amazon EC2-compatible Amazon Machine Images (AMIs) that are owned by your Amazon Web Services accountthat would be supported for use on a Snow device. Currently, supported AMIs are based on the Amazon Linux-2, Ubuntu 20.04 LTS - Focal, or Ubuntu 22.04 LTS - Jammy images, available on the Amazon Web Services Marketplace. Ubuntu 16.04 LTS - Xenial (HVM) images are no longer supported in the Market, but still supported for use on devices through Amazon EC2 VM Import/Export and running locally in AMIs.
   */
  listCompatibleImages(callback?: (err: AWSError, data: Snowball.Types.ListCompatibleImagesResult) => void): Request<Snowball.Types.ListCompatibleImagesResult, AWSError>;
  /**
   * Returns an array of JobListEntry objects of the specified length. Each JobListEntry object contains a job's state, a job's ID, and a value that indicates whether the job is a job part, in the case of export jobs. Calling this API action in one of the US regions will return jobs from the list of all jobs associated with this account in all US regions.
   */
  listJobs(params: Snowball.Types.ListJobsRequest, callback?: (err: AWSError, data: Snowball.Types.ListJobsResult) => void): Request<Snowball.Types.ListJobsResult, AWSError>;
  /**
   * Returns an array of JobListEntry objects of the specified length. Each JobListEntry object contains a job's state, a job's ID, and a value that indicates whether the job is a job part, in the case of export jobs. Calling this API action in one of the US regions will return jobs from the list of all jobs associated with this account in all US regions.
   */
  listJobs(callback?: (err: AWSError, data: Snowball.Types.ListJobsResult) => void): Request<Snowball.Types.ListJobsResult, AWSError>;
  /**
   * Lists all long-term pricing types.
   */
  listLongTermPricing(params: Snowball.Types.ListLongTermPricingRequest, callback?: (err: AWSError, data: Snowball.Types.ListLongTermPricingResult) => void): Request<Snowball.Types.ListLongTermPricingResult, AWSError>;
  /**
   * Lists all long-term pricing types.
   */
  listLongTermPricing(callback?: (err: AWSError, data: Snowball.Types.ListLongTermPricingResult) => void): Request<Snowball.Types.ListLongTermPricingResult, AWSError>;
  /**
   * A list of locations from which the customer can choose to pickup a device.
   */
  listPickupLocations(params: Snowball.Types.ListPickupLocationsRequest, callback?: (err: AWSError, data: Snowball.Types.ListPickupLocationsResult) => void): Request<Snowball.Types.ListPickupLocationsResult, AWSError>;
  /**
   * A list of locations from which the customer can choose to pickup a device.
   */
  listPickupLocations(callback?: (err: AWSError, data: Snowball.Types.ListPickupLocationsResult) => void): Request<Snowball.Types.ListPickupLocationsResult, AWSError>;
  /**
   * Lists all supported versions for Snow on-device services. Returns an array of ServiceVersion object containing the supported versions for a particular service.
   */
  listServiceVersions(params: Snowball.Types.ListServiceVersionsRequest, callback?: (err: AWSError, data: Snowball.Types.ListServiceVersionsResult) => void): Request<Snowball.Types.ListServiceVersionsResult, AWSError>;
  /**
   * Lists all supported versions for Snow on-device services. Returns an array of ServiceVersion object containing the supported versions for a particular service.
   */
  listServiceVersions(callback?: (err: AWSError, data: Snowball.Types.ListServiceVersionsResult) => void): Request<Snowball.Types.ListServiceVersionsResult, AWSError>;
  /**
   * While a cluster's ClusterState value is in the AwaitingQuorum state, you can update some of the information associated with a cluster. Once the cluster changes to a different job state, usually 60 minutes after the cluster being created, this action is no longer available.
   */
  updateCluster(params: Snowball.Types.UpdateClusterRequest, callback?: (err: AWSError, data: Snowball.Types.UpdateClusterResult) => void): Request<Snowball.Types.UpdateClusterResult, AWSError>;
  /**
   * While a cluster's ClusterState value is in the AwaitingQuorum state, you can update some of the information associated with a cluster. Once the cluster changes to a different job state, usually 60 minutes after the cluster being created, this action is no longer available.
   */
  updateCluster(callback?: (err: AWSError, data: Snowball.Types.UpdateClusterResult) => void): Request<Snowball.Types.UpdateClusterResult, AWSError>;
  /**
   * While a job's JobState value is New, you can update some of the information associated with a job. Once the job changes to a different job state, usually within 60 minutes of the job being created, this action is no longer available.
   */
  updateJob(params: Snowball.Types.UpdateJobRequest, callback?: (err: AWSError, data: Snowball.Types.UpdateJobResult) => void): Request<Snowball.Types.UpdateJobResult, AWSError>;
  /**
   * While a job's JobState value is New, you can update some of the information associated with a job. Once the job changes to a different job state, usually within 60 minutes of the job being created, this action is no longer available.
   */
  updateJob(callback?: (err: AWSError, data: Snowball.Types.UpdateJobResult) => void): Request<Snowball.Types.UpdateJobResult, AWSError>;
  /**
   * Updates the state when a shipment state changes to a different state.
   */
  updateJobShipmentState(params: Snowball.Types.UpdateJobShipmentStateRequest, callback?: (err: AWSError, data: Snowball.Types.UpdateJobShipmentStateResult) => void): Request<Snowball.Types.UpdateJobShipmentStateResult, AWSError>;
  /**
   * Updates the state when a shipment state changes to a different state.
   */
  updateJobShipmentState(callback?: (err: AWSError, data: Snowball.Types.UpdateJobShipmentStateResult) => void): Request<Snowball.Types.UpdateJobShipmentStateResult, AWSError>;
  /**
   * Updates the long-term pricing type.
   */
  updateLongTermPricing(params: Snowball.Types.UpdateLongTermPricingRequest, callback?: (err: AWSError, data: Snowball.Types.UpdateLongTermPricingResult) => void): Request<Snowball.Types.UpdateLongTermPricingResult, AWSError>;
  /**
   * Updates the long-term pricing type.
   */
  updateLongTermPricing(callback?: (err: AWSError, data: Snowball.Types.UpdateLongTermPricingResult) => void): Request<Snowball.Types.UpdateLongTermPricingResult, AWSError>;
}
declare namespace Snowball {
  export interface Address {
    /**
     * The unique ID for an address.
     */
    AddressId?: AddressId;
    /**
     * The name of a person to receive a Snow device at an address.
     */
    Name?: String;
    /**
     * The name of the company to receive a Snow device at an address.
     */
    Company?: String;
    /**
     * The first line in a street address that a Snow device is to be delivered to.
     */
    Street1?: String;
    /**
     * The second line in a street address that a Snow device is to be delivered to.
     */
    Street2?: String;
    /**
     * The third line in a street address that a Snow device is to be delivered to.
     */
    Street3?: String;
    /**
     * The city in an address that a Snow device is to be delivered to.
     */
    City?: String;
    /**
     * The state or province in an address that a Snow device is to be delivered to.
     */
    StateOrProvince?: String;
    /**
     * This field is no longer used and the value is ignored.
     */
    PrefectureOrDistrict?: String;
    /**
     * This field is no longer used and the value is ignored.
     */
    Landmark?: String;
    /**
     * The country in an address that a Snow device is to be delivered to.
     */
    Country?: String;
    /**
     * The postal code in an address that a Snow device is to be delivered to.
     */
    PostalCode?: String;
    /**
     * The phone number associated with an address that a Snow device is to be delivered to.
     */
    PhoneNumber?: String;
    /**
     * If the address you are creating is a primary address, then set this option to true. This field is not supported in most regions.
     */
    IsRestricted?: Boolean;
    /**
     * Differentiates between delivery address and pickup address in the customer account. Provided at job creation.
     */
    Type?: AddressType;
  }
  export type AddressId = string;
  export type AddressList = Address[];
  export type AddressType = "CUST_PICKUP"|"AWS_SHIP"|string;
  export type AmiId = string;
  export type Boolean = boolean;
  export interface CancelClusterRequest {
    /**
     * The 39-character ID for the cluster that you want to cancel, for example CID123e4567-e89b-12d3-a456-426655440000.
     */
    ClusterId: ClusterId;
  }
  export interface CancelClusterResult {
  }
  export interface CancelJobRequest {
    /**
     * The 39-character job ID for the job that you want to cancel, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId: JobId;
  }
  export interface CancelJobResult {
  }
  export type ClusterId = string;
  export interface ClusterListEntry {
    /**
     * The 39-character ID for the cluster that you want to list, for example CID123e4567-e89b-12d3-a456-426655440000.
     */
    ClusterId?: String;
    /**
     * The current state of this cluster. For information about the state of a specific node, see JobListEntry$JobState.
     */
    ClusterState?: ClusterState;
    /**
     * The creation date for this cluster.
     */
    CreationDate?: Timestamp;
    /**
     * Defines an optional description of the cluster, for example Environmental Data Cluster-01.
     */
    Description?: String;
  }
  export type ClusterListEntryList = ClusterListEntry[];
  export interface ClusterMetadata {
    /**
     * The automatically generated ID for a cluster.
     */
    ClusterId?: String;
    /**
     * The optional description of the cluster.
     */
    Description?: String;
    /**
     * The KmsKeyARN Amazon Resource Name (ARN) associated with this cluster. This ARN was created using the CreateKey API action in Key Management Service (KMS.
     */
    KmsKeyARN?: KmsKeyARN;
    /**
     * The role ARN associated with this cluster. This ARN was created using the CreateRole API action in Identity and Access Management (IAM).
     */
    RoleARN?: RoleARN;
    /**
     * The current status of the cluster.
     */
    ClusterState?: ClusterState;
    /**
     * The type of job for this cluster. Currently, the only job type supported for clusters is LOCAL_USE.
     */
    JobType?: JobType;
    /**
     * The type of Snowcone device to use for this cluster.   For cluster jobs, Amazon Web Services Snow Family currently supports only the EDGE device type. 
     */
    SnowballType?: SnowballType;
    /**
     * The creation date for this cluster.
     */
    CreationDate?: Timestamp;
    /**
     * The arrays of JobResource objects that can include updated S3Resource objects or LambdaResource objects.
     */
    Resources?: JobResource;
    /**
     * The automatically generated ID for a specific address.
     */
    AddressId?: AddressId;
    /**
     * The shipping speed for each node in this cluster. This speed doesn't dictate how soon you'll get each device, rather it represents how quickly each device moves to its destination while in transit. Regional shipping speeds are as follows:   In Australia, you have access to express shipping. Typically, devices shipped express are delivered in about a day.   In the European Union (EU), you have access to express shipping. Typically, Snow devices shipped express are delivered in about a day. In addition, most countries in the EU have access to standard shipping, which typically takes less than a week, one way.   In India, Snow devices are delivered in one to seven days.   In the US, you have access to one-day shipping and two-day shipping.  
     */
    ShippingOption?: ShippingOption;
    /**
     * The Amazon Simple Notification Service (Amazon SNS) notification settings for this cluster.
     */
    Notification?: Notification;
    /**
     * The ID of the address that you want a cluster shipped to, after it will be shipped to its primary address. This field is not supported in most regions.
     */
    ForwardingAddressId?: AddressId;
    /**
     * The tax documents required in your Amazon Web Services Region.
     */
    TaxDocuments?: TaxDocuments;
    /**
     * Represents metadata and configuration settings for services on an Amazon Web Services Snow Family device.
     */
    OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
  }
  export type ClusterState = "AwaitingQuorum"|"Pending"|"InUse"|"Complete"|"Cancelled"|string;
  export interface CompatibleImage {
    /**
     * The unique identifier for an individual Snow device AMI.
     */
    AmiId?: String;
    /**
     * The optional name of a compatible image.
     */
    Name?: String;
  }
  export type CompatibleImageList = CompatibleImage[];
  export interface CreateAddressRequest {
    /**
     * The address that you want the Snow device shipped to.
     */
    Address: Address;
  }
  export interface CreateAddressResult {
    /**
     * The automatically generated ID for a specific address. You'll use this ID when you create a job to specify which address you want the Snow device for that job shipped to.
     */
    AddressId?: String;
  }
  export interface CreateClusterRequest {
    /**
     * The type of job for this cluster. Currently, the only job type supported for clusters is LOCAL_USE. For more information, see "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide or "https://docs.aws.amazon.com/snowball/latest/developer-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide.
     */
    JobType: JobType;
    /**
     * The resources associated with the cluster job. These resources include Amazon S3 buckets and optional Lambda functions written in the Python language. 
     */
    Resources?: JobResource;
    /**
     * Specifies the service or services on the Snow Family device that your transferred data will be exported from or imported into. Amazon Web Services Snow Family device clusters support Amazon S3 and NFS (Network File System).
     */
    OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
    /**
     * An optional description of this specific cluster, for example Environmental Data Cluster-01.
     */
    Description?: String;
    /**
     * The ID for the address that you want the cluster shipped to.
     */
    AddressId: AddressId;
    /**
     * The KmsKeyARN value that you want to associate with this cluster. KmsKeyARN values are created by using the CreateKey API action in Key Management Service (KMS). 
     */
    KmsKeyARN?: KmsKeyARN;
    /**
     * The RoleARN that you want to associate with this cluster. RoleArn values are created by using the CreateRole API action in Identity and Access Management (IAM).
     */
    RoleARN?: RoleARN;
    /**
     * The type of Snow Family devices to use for this cluster.   For cluster jobs, Amazon Web Services Snow Family currently supports only the EDGE device type.  For more information, see "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide or "https://docs.aws.amazon.com/snowball/latest/developer-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide.
     */
    SnowballType: SnowballType;
    /**
     * The shipping speed for each node in this cluster. This speed doesn't dictate how soon you'll get each Snowball Edge device, rather it represents how quickly each device moves to its destination while in transit. Regional shipping speeds are as follows:    In Australia, you have access to express shipping. Typically, Snow devices shipped express are delivered in about a day.   In the European Union (EU), you have access to express shipping. Typically, Snow devices shipped express are delivered in about a day. In addition, most countries in the EU have access to standard shipping, which typically takes less than a week, one way.   In India, Snow devices are delivered in one to seven days.   In the United States of America (US), you have access to one-day shipping and two-day shipping.     In Australia, you have access to express shipping. Typically, devices shipped express are delivered in about a day.   In the European Union (EU), you have access to express shipping. Typically, Snow devices shipped express are delivered in about a day. In addition, most countries in the EU have access to standard shipping, which typically takes less than a week, one way.   In India, Snow devices are delivered in one to seven days.   In the US, you have access to one-day shipping and two-day shipping.  
     */
    ShippingOption: ShippingOption;
    /**
     * The Amazon Simple Notification Service (Amazon SNS) notification settings for this cluster.
     */
    Notification?: Notification;
    /**
     * The forwarding address ID for a cluster. This field is not supported in most regions.
     */
    ForwardingAddressId?: AddressId;
    /**
     * The tax documents required in your Amazon Web Services Region.
     */
    TaxDocuments?: TaxDocuments;
    /**
     * Allows you to securely operate and manage Snow devices in a cluster remotely from outside of your internal network. When set to INSTALLED_AUTOSTART, remote management will automatically be available when the device arrives at your location. Otherwise, you need to use the Snowball Client to manage the device.
     */
    RemoteManagement?: RemoteManagement;
    /**
     * If provided, each job will be automatically created and associated with the new cluster. If not provided, will be treated as 0.
     */
    InitialClusterSize?: InitialClusterSize;
    /**
     * Force to create cluster when user attempts to overprovision or underprovision a cluster. A cluster is overprovisioned or underprovisioned if the initial size of the cluster is more (overprovisioned) or less (underprovisioned) than what needed to meet capacity requirement specified with OnDeviceServiceConfiguration.
     */
    ForceCreateJobs?: Boolean;
    /**
     * Lists long-term pricing id that will be used to associate with jobs automatically created for the new cluster.
     */
    LongTermPricingIds?: LongTermPricingIdList;
    /**
     * If your job is being created in one of the US regions, you have the option of specifying what size Snow device you'd like for this job. In all other regions, Snowballs come with 80 TB in storage capacity. For more information, see "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide or "https://docs.aws.amazon.com/snowball/latest/developer-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide.
     */
    SnowballCapacityPreference?: SnowballCapacity;
  }
  export interface CreateClusterResult {
    /**
     * The automatically generated ID for a cluster.
     */
    ClusterId?: ClusterId;
    /**
     * List of jobs created for this cluster. For syntax, see ListJobsResult$JobListEntries in this guide.
     */
    JobListEntries?: JobListEntryList;
  }
  export interface CreateJobRequest {
    /**
     * Defines the type of job that you're creating. 
     */
    JobType?: JobType;
    /**
     * Defines the Amazon S3 buckets associated with this job. With IMPORT jobs, you specify the bucket or buckets that your transferred data will be imported into. With EXPORT jobs, you specify the bucket or buckets that your transferred data will be exported from. Optionally, you can also specify a KeyRange value. If you choose to export a range, you define the length of the range by providing either an inclusive BeginMarker value, an inclusive EndMarker value, or both. Ranges are UTF-8 binary sorted.
     */
    Resources?: JobResource;
    /**
     * Specifies the service or services on the Snow Family device that your transferred data will be exported from or imported into. Amazon Web Services Snow Family supports Amazon S3 and NFS (Network File System) and the Amazon Web Services Storage Gateway service Tape Gateway type.
     */
    OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
    /**
     * Defines an optional description of this specific job, for example Important Photos 2016-08-11.
     */
    Description?: String;
    /**
     * The ID for the address that you want the Snow device shipped to.
     */
    AddressId?: AddressId;
    /**
     * The KmsKeyARN that you want to associate with this job. KmsKeyARNs are created using the CreateKey Key Management Service (KMS) API action.
     */
    KmsKeyARN?: KmsKeyARN;
    /**
     * The RoleARN that you want to associate with this job. RoleArns are created using the CreateRole Identity and Access Management (IAM) API action.
     */
    RoleARN?: RoleARN;
    /**
     * If your job is being created in one of the US regions, you have the option of specifying what size Snow device you'd like for this job. In all other regions, Snowballs come with 80 TB in storage capacity. For more information, see "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide or "https://docs.aws.amazon.com/snowball/latest/developer-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide.
     */
    SnowballCapacityPreference?: SnowballCapacity;
    /**
     * The shipping speed for this job. This speed doesn't dictate how soon you'll get the Snow device, rather it represents how quickly the Snow device moves to its destination while in transit. Regional shipping speeds are as follows:   In Australia, you have access to express shipping. Typically, Snow devices shipped express are delivered in about a day.   In the European Union (EU), you have access to express shipping. Typically, Snow devices shipped express are delivered in about a day. In addition, most countries in the EU have access to standard shipping, which typically takes less than a week, one way.   In India, Snow devices are delivered in one to seven days.   In the US, you have access to one-day shipping and two-day shipping.  
     */
    ShippingOption?: ShippingOption;
    /**
     * Defines the Amazon Simple Notification Service (Amazon SNS) notification settings for this job.
     */
    Notification?: Notification;
    /**
     * The ID of a cluster. If you're creating a job for a node in a cluster, you need to provide only this clusterId value. The other job attributes are inherited from the cluster.
     */
    ClusterId?: ClusterId;
    /**
     * The type of Snow Family devices to use for this job.   For cluster jobs, Amazon Web Services Snow Family currently supports only the EDGE device type.  The type of Amazon Web Services Snow device to use for this job. Currently, the only supported device type for cluster jobs is EDGE. For more information, see Snowball Edge Device Options in the Snowball Edge Developer Guide. For more information, see "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide or "https://docs.aws.amazon.com/snowball/latest/developer-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide.
     */
    SnowballType?: SnowballType;
    /**
     * The forwarding address ID for a job. This field is not supported in most Regions.
     */
    ForwardingAddressId?: AddressId;
    /**
     * The tax documents required in your Amazon Web Services Region.
     */
    TaxDocuments?: TaxDocuments;
    /**
     * Defines the device configuration for an Snowcone job. For more information, see "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide or "https://docs.aws.amazon.com/snowball/latest/developer-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide.
     */
    DeviceConfiguration?: DeviceConfiguration;
    /**
     * Allows you to securely operate and manage Snowcone devices remotely from outside of your internal network. When set to INSTALLED_AUTOSTART, remote management will automatically be available when the device arrives at your location. Otherwise, you need to use the Snowball Edge client to manage the device. When set to NOT_INSTALLED, remote management will not be available on the device. 
     */
    RemoteManagement?: RemoteManagement;
    /**
     * The ID of the long-term pricing type for the device.
     */
    LongTermPricingId?: LongTermPricingId;
    /**
     * The highest impact level of data that will be stored or processed on the device, provided at job creation.
     */
    ImpactLevel?: ImpactLevel;
    /**
     * Information identifying the person picking up the device.
     */
    PickupDetails?: PickupDetails;
  }
  export interface CreateJobResult {
    /**
     * The automatically generated ID for a job, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId?: JobId;
  }
  export interface CreateLongTermPricingRequest {
    /**
     * The type of long-term pricing option you want for the device, either 1-year or 3-year long-term pricing.
     */
    LongTermPricingType: LongTermPricingType;
    /**
     * Specifies whether the current long-term pricing type for the device should be renewed.
     */
    IsLongTermPricingAutoRenew?: JavaBoolean;
    /**
     * The type of Snow Family devices to use for the long-term pricing job.
     */
    SnowballType: SnowballType;
  }
  export interface CreateLongTermPricingResult {
    /**
     * The ID of the long-term pricing type for the device.
     */
    LongTermPricingId?: LongTermPricingId;
  }
  export interface CreateReturnShippingLabelRequest {
    /**
     * The ID for a job that you want to create the return shipping label for; for example, JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId: JobId;
    /**
     * The shipping speed for a particular job. This speed doesn't dictate how soon the device is returned to Amazon Web Services. This speed represents how quickly it moves to its destination while in transit. Regional shipping speeds are as follows:
     */
    ShippingOption?: ShippingOption;
  }
  export interface CreateReturnShippingLabelResult {
    /**
     * The status information of the task on a Snow device that is being returned to Amazon Web Services.
     */
    Status?: ShippingLabelStatus;
  }
  export interface DataTransfer {
    /**
     * The number of bytes transferred between a Snow device and Amazon S3.
     */
    BytesTransferred?: Long;
    /**
     * The number of objects transferred between a Snow device and Amazon S3.
     */
    ObjectsTransferred?: Long;
    /**
     * The total bytes of data for a transfer between a Snow device and Amazon S3. This value is set to 0 (zero) until all the keys that will be transferred have been listed.
     */
    TotalBytes?: Long;
    /**
     * The total number of objects for a transfer between a Snow device and Amazon S3. This value is set to 0 (zero) until all the keys that will be transferred have been listed.
     */
    TotalObjects?: Long;
  }
  export interface DependentService {
    /**
     * The name of the dependent service.
     */
    ServiceName?: ServiceName;
    /**
     * The version of the dependent service.
     */
    ServiceVersion?: ServiceVersion;
  }
  export type DependentServiceList = DependentService[];
  export interface DescribeAddressRequest {
    /**
     * The automatically generated ID for a specific address.
     */
    AddressId: AddressId;
  }
  export interface DescribeAddressResult {
    /**
     * The address that you want the Snow device(s) associated with a specific job to be shipped to.
     */
    Address?: Address;
  }
  export interface DescribeAddressesRequest {
    /**
     * The number of ADDRESS objects to return.
     */
    MaxResults?: ListLimit;
    /**
     * HTTP requests are stateless. To identify what object comes "next" in the list of ADDRESS objects, you have the option of specifying a value for NextToken as the starting point for your list of returned addresses.
     */
    NextToken?: String;
  }
  export interface DescribeAddressesResult {
    /**
     * The Snow device shipping addresses that were created for this account.
     */
    Addresses?: AddressList;
    /**
     * HTTP requests are stateless. If you use the automatically generated NextToken value in your next DescribeAddresses call, your list of returned addresses will start from this point in the array.
     */
    NextToken?: String;
  }
  export interface DescribeClusterRequest {
    /**
     * The automatically generated ID for a cluster.
     */
    ClusterId: ClusterId;
  }
  export interface DescribeClusterResult {
    /**
     * Information about a specific cluster, including shipping information, cluster status, and other important metadata.
     */
    ClusterMetadata?: ClusterMetadata;
  }
  export interface DescribeJobRequest {
    /**
     * The automatically generated ID for a job, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId: JobId;
  }
  export interface DescribeJobResult {
    /**
     * Information about a specific job, including shipping information, job status, and other important metadata.
     */
    JobMetadata?: JobMetadata;
    /**
     * Information about a specific job part (in the case of an export job), including shipping information, job status, and other important metadata.
     */
    SubJobMetadata?: JobMetadataList;
  }
  export interface DescribeReturnShippingLabelRequest {
    /**
     * The automatically generated ID for a job, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId: JobId;
  }
  export interface DescribeReturnShippingLabelResult {
    /**
     * The status information of the task on a Snow device that is being returned to Amazon Web Services.
     */
    Status?: ShippingLabelStatus;
    /**
     * The expiration date of the current return shipping label.
     */
    ExpirationDate?: Timestamp;
    /**
     * The pre-signed Amazon S3 URI used to download the return shipping label.
     */
    ReturnShippingLabelURI?: String;
  }
  export interface DeviceConfiguration {
    /**
     * Returns information about the device configuration for an Snowcone job.
     */
    SnowconeDeviceConfiguration?: SnowconeDeviceConfiguration;
  }
  export type DevicePickupId = string;
  export type DeviceServiceName = "NFS_ON_DEVICE_SERVICE"|"S3_ON_DEVICE_SERVICE"|string;
  export interface EKSOnDeviceServiceConfiguration {
    /**
     * The Kubernetes version for EKS Anywhere on the Snow Family device.
     */
    KubernetesVersion?: String;
    /**
     * The version of EKS Anywhere on the Snow Family device.
     */
    EKSAnywhereVersion?: String;
  }
  export interface Ec2AmiResource {
    /**
     * The ID of the AMI in Amazon EC2.
     */
    AmiId: AmiId;
    /**
     * The ID of the AMI on the Snow device.
     */
    SnowballAmiId?: String;
  }
  export type Ec2AmiResourceList = Ec2AmiResource[];
  export type Email = string;
  export interface EventTriggerDefinition {
    /**
     * The Amazon Resource Name (ARN) for any local Amazon S3 resource that is an Lambda function's event trigger associated with this job.
     */
    EventResourceARN?: ResourceARN;
  }
  export type EventTriggerDefinitionList = EventTriggerDefinition[];
  export type GSTIN = string;
  export interface GetJobManifestRequest {
    /**
     * The ID for a job that you want to get the manifest file for, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId: JobId;
  }
  export interface GetJobManifestResult {
    /**
     * The Amazon S3 presigned URL for the manifest file associated with the specified JobId value.
     */
    ManifestURI?: String;
  }
  export interface GetJobUnlockCodeRequest {
    /**
     * The ID for the job that you want to get the UnlockCode value for, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId: JobId;
  }
  export interface GetJobUnlockCodeResult {
    /**
     * The UnlockCode value for the specified job. The UnlockCode value can be accessed for up to 360 days after the job has been created.
     */
    UnlockCode?: String;
  }
  export interface GetSnowballUsageRequest {
  }
  export interface GetSnowballUsageResult {
    /**
     * The service limit for number of Snow devices this account can have at once. The default service limit is 1 (one).
     */
    SnowballLimit?: Integer;
    /**
     * The number of Snow devices that this account is currently using.
     */
    SnowballsInUse?: Integer;
  }
  export interface GetSoftwareUpdatesRequest {
    /**
     * The ID for a job that you want to get the software update file for, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId: JobId;
  }
  export interface GetSoftwareUpdatesResult {
    /**
     * The Amazon S3 presigned URL for the update file associated with the specified JobId value. The software update will be available for 2 days after this request is made. To access an update after the 2 days have passed, you'll have to make another call to GetSoftwareUpdates.
     */
    UpdatesURI?: String;
  }
  export interface INDTaxDocuments {
    /**
     * The Goods and Services Tax (GST) documents required in Amazon Web Services Region in India.
     */
    GSTIN?: GSTIN;
  }
  export type ImpactLevel = "IL2"|"IL4"|"IL5"|"IL6"|"IL99"|string;
  export type InitialClusterSize = number;
  export type Integer = number;
  export type JavaBoolean = boolean;
  export type JobId = string;
  export interface JobListEntry {
    /**
     * The automatically generated ID for a job, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId?: String;
    /**
     * The current state of this job.
     */
    JobState?: JobState;
    /**
     * A value that indicates that this job is a main job. A main job represents a successful request to create an export job. Main jobs aren't associated with any Snowballs. Instead, each main job will have at least one job part, and each job part is associated with a Snowball. It might take some time before the job parts associated with a particular main job are listed, because they are created after the main job is created.
     */
    IsMaster?: Boolean;
    /**
     * The type of job.
     */
    JobType?: JobType;
    /**
     * The type of device used with this job.
     */
    SnowballType?: SnowballType;
    /**
     * The creation date for this job.
     */
    CreationDate?: Timestamp;
    /**
     * The optional description of this specific job, for example Important Photos 2016-08-11.
     */
    Description?: String;
  }
  export type JobListEntryList = JobListEntry[];
  export interface JobLogs {
    /**
     * A link to an Amazon S3 presigned URL where the job completion report is located.
     */
    JobCompletionReportURI?: String;
    /**
     * A link to an Amazon S3 presigned URL where the job success log is located.
     */
    JobSuccessLogURI?: String;
    /**
     * A link to an Amazon S3 presigned URL where the job failure log is located.
     */
    JobFailureLogURI?: String;
  }
  export interface JobMetadata {
    /**
     * The automatically generated ID for a job, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId?: String;
    /**
     * The current status of the jobs.
     */
    JobState?: JobState;
    /**
     * The type of job.
     */
    JobType?: JobType;
    /**
     * The type of device used with this job.
     */
    SnowballType?: SnowballType;
    /**
     * The creation date for this job.
     */
    CreationDate?: Timestamp;
    /**
     * An array of S3Resource objects. Each S3Resource object represents an Amazon S3 bucket that your transferred data will be exported from or imported into.
     */
    Resources?: JobResource;
    /**
     * The description of the job, provided at job creation.
     */
    Description?: String;
    /**
     * The Amazon Resource Name (ARN) for the Key Management Service (KMS) key associated with this job. This ARN was created using the CreateKey API action in KMS.
     */
    KmsKeyARN?: KmsKeyARN;
    /**
     * The role ARN associated with this job. This ARN was created using the CreateRole API action in Identity and Access Management.
     */
    RoleARN?: RoleARN;
    /**
     * The ID for the address that you want the Snow device shipped to.
     */
    AddressId?: AddressId;
    /**
     * A job's shipping information, including inbound and outbound tracking numbers and shipping speed options.
     */
    ShippingDetails?: ShippingDetails;
    /**
     * The Snow device capacity preference for this job, specified at job creation. In US regions, you can choose between 50 TB and 80 TB Snowballs. All other regions use 80 TB capacity Snowballs. For more information, see "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide or "https://docs.aws.amazon.com/snowball/latest/developer-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide.
     */
    SnowballCapacityPreference?: SnowballCapacity;
    /**
     * The Amazon Simple Notification Service (Amazon SNS) notification settings associated with a specific job. The Notification object is returned as a part of the response syntax of the DescribeJob action in the JobMetadata data type.
     */
    Notification?: Notification;
    /**
     * A value that defines the real-time status of a Snow device's data transfer while the device is at Amazon Web Services. This data is only available while a job has a JobState value of InProgress, for both import and export jobs.
     */
    DataTransferProgress?: DataTransfer;
    /**
     * Links to Amazon S3 presigned URLs for the job report and logs. For import jobs, the PDF job report becomes available at the end of the import process. For export jobs, your job report typically becomes available while the Snow device for your job part is being delivered to you.
     */
    JobLogInfo?: JobLogs;
    /**
     * The 39-character ID for the cluster, for example CID123e4567-e89b-12d3-a456-426655440000.
     */
    ClusterId?: String;
    /**
     * The ID of the address that you want a job shipped to, after it will be shipped to its primary address. This field is not supported in most regions.
     */
    ForwardingAddressId?: AddressId;
    /**
     * The metadata associated with the tax documents required in your Amazon Web Services Region.
     */
    TaxDocuments?: TaxDocuments;
    DeviceConfiguration?: DeviceConfiguration;
    /**
     * Allows you to securely operate and manage Snowcone devices remotely from outside of your internal network. When set to INSTALLED_AUTOSTART, remote management will automatically be available when the device arrives at your location. Otherwise, you need to use the Snowball Client to manage the device.
     */
    RemoteManagement?: RemoteManagement;
    /**
     * The ID of the long-term pricing type for the device.
     */
    LongTermPricingId?: LongTermPricingId;
    /**
     * Represents metadata and configuration settings for services on an Amazon Web Services Snow Family device.
     */
    OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
    /**
     * The highest impact level of data that will be stored or processed on the device, provided at job creation.
     */
    ImpactLevel?: ImpactLevel;
    /**
     * Information identifying the person picking up the device.
     */
    PickupDetails?: PickupDetails;
    /**
     * Unique ID associated with a device.
     */
    SnowballId?: String;
  }
  export type JobMetadataList = JobMetadata[];
  export interface JobResource {
    /**
     * An array of S3Resource objects.
     */
    S3Resources?: S3ResourceList;
    /**
     * The Python-language Lambda functions for this job.
     */
    LambdaResources?: LambdaResourceList;
    /**
     * The Amazon Machine Images (AMIs) associated with this job.
     */
    Ec2AmiResources?: Ec2AmiResourceList;
  }
  export type JobState = "New"|"PreparingAppliance"|"PreparingShipment"|"InTransitToCustomer"|"WithCustomer"|"InTransitToAWS"|"WithAWSSortingFacility"|"WithAWS"|"InProgress"|"Complete"|"Cancelled"|"Listing"|"Pending"|string;
  export type JobStateList = JobState[];
  export type JobType = "IMPORT"|"EXPORT"|"LOCAL_USE"|string;
  export interface KeyRange {
    /**
     * The key that starts an optional key range for an export job. Ranges are inclusive and UTF-8 binary sorted.
     */
    BeginMarker?: String;
    /**
     * The key that ends an optional key range for an export job. Ranges are inclusive and UTF-8 binary sorted.
     */
    EndMarker?: String;
  }
  export type KmsKeyARN = string;
  export interface LambdaResource {
    /**
     * An Amazon Resource Name (ARN) that represents an Lambda function to be triggered by PUT object actions on the associated local Amazon S3 resource.
     */
    LambdaArn?: ResourceARN;
    /**
     * The array of ARNs for S3Resource objects to trigger the LambdaResource objects associated with this job.
     */
    EventTriggers?: EventTriggerDefinitionList;
  }
  export type LambdaResourceList = LambdaResource[];
  export interface ListClusterJobsRequest {
    /**
     * The 39-character ID for the cluster that you want to list, for example CID123e4567-e89b-12d3-a456-426655440000.
     */
    ClusterId: ClusterId;
    /**
     * The number of JobListEntry objects to return.
     */
    MaxResults?: ListLimit;
    /**
     * HTTP requests are stateless. To identify what object comes "next" in the list of JobListEntry objects, you have the option of specifying NextToken as the starting point for your returned list.
     */
    NextToken?: String;
  }
  export interface ListClusterJobsResult {
    /**
     * Each JobListEntry object contains a job's state, a job's ID, and a value that indicates whether the job is a job part, in the case of export jobs. 
     */
    JobListEntries?: JobListEntryList;
    /**
     * HTTP requests are stateless. If you use the automatically generated NextToken value in your next ListClusterJobsResult call, your list of returned jobs will start from this point in the array.
     */
    NextToken?: String;
  }
  export interface ListClustersRequest {
    /**
     * The number of ClusterListEntry objects to return.
     */
    MaxResults?: ListLimit;
    /**
     * HTTP requests are stateless. To identify what object comes "next" in the list of ClusterListEntry objects, you have the option of specifying NextToken as the starting point for your returned list.
     */
    NextToken?: String;
  }
  export interface ListClustersResult {
    /**
     * Each ClusterListEntry object contains a cluster's state, a cluster's ID, and other important status information.
     */
    ClusterListEntries?: ClusterListEntryList;
    /**
     * HTTP requests are stateless. If you use the automatically generated NextToken value in your next ClusterListEntry call, your list of returned clusters will start from this point in the array.
     */
    NextToken?: String;
  }
  export interface ListCompatibleImagesRequest {
    /**
     * The maximum number of results for the list of compatible images. Currently, a Snowball Edge device can store 10 AMIs.
     */
    MaxResults?: ListLimit;
    /**
     * HTTP requests are stateless. To identify what object comes "next" in the list of compatible images, you can specify a value for NextToken as the starting point for your list of returned images.
     */
    NextToken?: String;
  }
  export interface ListCompatibleImagesResult {
    /**
     * A JSON-formatted object that describes a compatible AMI, including the ID and name for a Snow device AMI.
     */
    CompatibleImages?: CompatibleImageList;
    /**
     * Because HTTP requests are stateless, this is the starting point for your next list of returned images.
     */
    NextToken?: String;
  }
  export interface ListJobsRequest {
    /**
     * The number of JobListEntry objects to return.
     */
    MaxResults?: ListLimit;
    /**
     * HTTP requests are stateless. To identify what object comes "next" in the list of JobListEntry objects, you have the option of specifying NextToken as the starting point for your returned list.
     */
    NextToken?: String;
  }
  export interface ListJobsResult {
    /**
     * Each JobListEntry object contains a job's state, a job's ID, and a value that indicates whether the job is a job part, in the case of export jobs. 
     */
    JobListEntries?: JobListEntryList;
    /**
     * HTTP requests are stateless. If you use this automatically generated NextToken value in your next ListJobs call, your returned JobListEntry objects will start from this point in the array.
     */
    NextToken?: String;
  }
  export type ListLimit = number;
  export interface ListLongTermPricingRequest {
    /**
     * The maximum number of ListLongTermPricing objects to return.
     */
    MaxResults?: ListLimit;
    /**
     * Because HTTP requests are stateless, this is the starting point for your next list of ListLongTermPricing to return.
     */
    NextToken?: String;
  }
  export interface ListLongTermPricingResult {
    /**
     * Each LongTermPricingEntry object contains a status, ID, and other information about the LongTermPricing type. 
     */
    LongTermPricingEntries?: LongTermPricingEntryList;
    /**
     * Because HTTP requests are stateless, this is the starting point for your next list of returned ListLongTermPricing list.
     */
    NextToken?: String;
  }
  export interface ListPickupLocationsRequest {
    /**
     * The maximum number of locations to list per page.
     */
    MaxResults?: ListLimit;
    /**
     * HTTP requests are stateless. To identify what object comes "next" in the list of ListPickupLocationsRequest objects, you have the option of specifying NextToken as the starting point for your returned list.
     */
    NextToken?: String;
  }
  export interface ListPickupLocationsResult {
    /**
     * Information about the address of pickup locations.
     */
    Addresses?: AddressList;
    /**
     * HTTP requests are stateless. To identify what object comes "next" in the list of ListPickupLocationsResult objects, you have the option of specifying NextToken as the starting point for your returned list.
     */
    NextToken?: String;
  }
  export interface ListServiceVersionsRequest {
    /**
     * The name of the service for which you're requesting supported versions.
     */
    ServiceName: ServiceName;
    /**
     * A list of names and versions of dependant services of the requested service.
     */
    DependentServices?: DependentServiceList;
    /**
     * The maximum number of ListServiceVersions objects to return.
     */
    MaxResults?: ListLimit;
    /**
     * Because HTTP requests are stateless, this is the starting point for the next list of returned ListServiceVersionsRequest versions.
     */
    NextToken?: String;
  }
  export interface ListServiceVersionsResult {
    /**
     * A list of supported versions.
     */
    ServiceVersions: ServiceVersionList;
    /**
     * The name of the service for which the system provided supported versions.
     */
    ServiceName: ServiceName;
    /**
     * A list of names and versions of dependant services of the service for which the system provided supported versions.
     */
    DependentServices?: DependentServiceList;
    /**
     * Because HTTP requests are stateless, this is the starting point of the next list of returned ListServiceVersionsResult results.
     */
    NextToken?: String;
  }
  export type Long = number;
  export type LongTermPricingAssociatedJobIdList = JobId[];
  export type LongTermPricingEntryList = LongTermPricingListEntry[];
  export type LongTermPricingId = string;
  export type LongTermPricingIdList = LongTermPricingId[];
  export interface LongTermPricingListEntry {
    /**
     * The ID of the long-term pricing type for the device.
     */
    LongTermPricingId?: LongTermPricingId;
    /**
     * The end date the long-term pricing contract.
     */
    LongTermPricingEndDate?: Timestamp;
    /**
     * The start date of the long-term pricing contract.
     */
    LongTermPricingStartDate?: Timestamp;
    /**
     * The type of long-term pricing that was selected for the device.
     */
    LongTermPricingType?: LongTermPricingType;
    /**
     * The current active jobs on the device the long-term pricing type.
     */
    CurrentActiveJob?: JobId;
    /**
     * A new device that replaces a device that is ordered with long-term pricing.
     */
    ReplacementJob?: JobId;
    /**
     * If set to true, specifies that the current long-term pricing type for the device should be automatically renewed before the long-term pricing contract expires.
     */
    IsLongTermPricingAutoRenew?: JavaBoolean;
    /**
     * The status of the long-term pricing type.
     */
    LongTermPricingStatus?: String;
    /**
     * The type of Snow Family devices associated with this long-term pricing job.
     */
    SnowballType?: SnowballType;
    /**
     * The IDs of the jobs that are associated with a long-term pricing type.
     */
    JobIds?: LongTermPricingAssociatedJobIdList;
  }
  export type LongTermPricingType = "OneYear"|"ThreeYear"|"OneMonth"|string;
  export interface NFSOnDeviceServiceConfiguration {
    /**
     * The maximum NFS storage for one Snow Family device.
     */
    StorageLimit?: StorageLimit;
    /**
     * The scale unit of the NFS storage on the device. Valid values: TB.
     */
    StorageUnit?: StorageUnit;
  }
  export type NodeFaultTolerance = number;
  export interface Notification {
    /**
     * The new SNS TopicArn that you want to associate with this job. You can create Amazon Resource Names (ARNs) for topics by using the CreateTopic Amazon SNS API action. You can subscribe email addresses to an Amazon SNS topic through the Amazon Web Services Management Console, or by using the Subscribe Amazon Simple Notification Service (Amazon SNS) API action.
     */
    SnsTopicARN?: SnsTopicARN;
    /**
     * The list of job states that will trigger a notification for this job.
     */
    JobStatesToNotify?: JobStateList;
    /**
     * Any change in job state will trigger a notification for this job.
     */
    NotifyAll?: Boolean;
    /**
     * Used to send SNS notifications for the person picking up the device (identified during job creation).
     */
    DevicePickupSnsTopicARN?: SnsTopicARN;
  }
  export interface OnDeviceServiceConfiguration {
    /**
     * Represents the NFS (Network File System) service on a Snow Family device.
     */
    NFSOnDeviceService?: NFSOnDeviceServiceConfiguration;
    /**
     * Represents the Storage Gateway service Tape Gateway type on a Snow Family device.
     */
    TGWOnDeviceService?: TGWOnDeviceServiceConfiguration;
    /**
     * The configuration of EKS Anywhere on the Snow Family device.
     */
    EKSOnDeviceService?: EKSOnDeviceServiceConfiguration;
    /**
     * Configuration for Amazon S3 compatible storage on Snow family devices.
     */
    S3OnDeviceService?: S3OnDeviceServiceConfiguration;
  }
  export type PhoneNumber = string;
  export interface PickupDetails {
    /**
     * The name of the person picking up the device.
     */
    Name?: String;
    /**
     * The phone number of the person picking up the device.
     */
    PhoneNumber?: PhoneNumber;
    /**
     * The email address of the person picking up the device.
     */
    Email?: Email;
    /**
     * The number on the credential identifying the person picking up the device.
     */
    IdentificationNumber?: String;
    /**
     * Expiration date of the credential identifying the person picking up the device.
     */
    IdentificationExpirationDate?: Timestamp;
    /**
     * Organization that issued the credential identifying the person picking up the device.
     */
    IdentificationIssuingOrg?: String;
    /**
     * The unique ID for a device that will be picked up.
     */
    DevicePickupId?: DevicePickupId;
  }
  export type RemoteManagement = "INSTALLED_ONLY"|"INSTALLED_AUTOSTART"|"NOT_INSTALLED"|string;
  export type ResourceARN = string;
  export type RoleARN = string;
  export interface S3OnDeviceServiceConfiguration {
    /**
     * If the specified storage limit value matches storage limit of one of the defined configurations, that configuration will be used. If the specified storage limit value does not match any defined configuration, the request will fail. If more than one configuration has the same storage limit as specified, the other input need to be provided.
     */
    StorageLimit?: S3StorageLimit;
    /**
     * Storage unit. Currently the only supported unit is TB.
     */
    StorageUnit?: StorageUnit;
    /**
     * Applicable when creating a cluster. Specifies how many nodes are needed for Amazon S3 compatible storage on Snow family devices. If specified, the other input can be omitted.
     */
    ServiceSize?: ServiceSize;
    /**
     * &gt;Fault tolerance level of the cluster. This indicates the number of nodes that can go down without degrading the performance of the cluster. This additional input helps when the specified StorageLimit matches more than one Amazon S3 compatible storage on Snow family devices service configuration.
     */
    FaultTolerance?: NodeFaultTolerance;
  }
  export interface S3Resource {
    /**
     * The Amazon Resource Name (ARN) of an Amazon S3 bucket.
     */
    BucketArn?: ResourceARN;
    /**
     * For export jobs, you can provide an optional KeyRange within a specific Amazon S3 bucket. The length of the range is defined at job creation, and has either an inclusive BeginMarker, an inclusive EndMarker, or both. Ranges are UTF-8 binary sorted.
     */
    KeyRange?: KeyRange;
    /**
     * Specifies the service or services on the Snow Family device that your transferred data will be exported from or imported into. Amazon Web Services Snow Family supports Amazon S3 and NFS (Network File System).
     */
    TargetOnDeviceServices?: TargetOnDeviceServiceList;
  }
  export type S3ResourceList = S3Resource[];
  export type S3StorageLimit = number;
  export type ServiceName = "KUBERNETES"|"EKS_ANYWHERE"|string;
  export type ServiceSize = number;
  export interface ServiceVersion {
    /**
     * The version number of the requested service.
     */
    Version?: String;
  }
  export type ServiceVersionList = ServiceVersion[];
  export interface Shipment {
    /**
     * Status information for a shipment.
     */
    Status?: String;
    /**
     * The tracking number for this job. Using this tracking number with your region's carrier's website, you can track a Snow device as the carrier transports it. For India, the carrier is Amazon Logistics. For all other regions, UPS is the carrier.
     */
    TrackingNumber?: String;
  }
  export type ShipmentState = "RECEIVED"|"RETURNED"|string;
  export interface ShippingDetails {
    /**
     * The shipping speed for a particular job. This speed doesn't dictate how soon you'll get the Snow device from the job's creation date. This speed represents how quickly it moves to its destination while in transit. Regional shipping speeds are as follows:   In Australia, you have access to express shipping. Typically, Snow devices shipped express are delivered in about a day.   In the European Union (EU), you have access to express shipping. Typically, Snow devices shipped express are delivered in about a day. In addition, most countries in the EU have access to standard shipping, which typically takes less than a week, one way.   In India, Snow devices are delivered in one to seven days.   In the United States of America (US), you have access to one-day shipping and two-day shipping.  
     */
    ShippingOption?: ShippingOption;
    /**
     * The Status and TrackingNumber values for a Snow device being returned to Amazon Web Services for a particular job.
     */
    InboundShipment?: Shipment;
    /**
     * The Status and TrackingNumber values for a Snow device being delivered to the address that you specified for a particular job.
     */
    OutboundShipment?: Shipment;
  }
  export type ShippingLabelStatus = "InProgress"|"TimedOut"|"Succeeded"|"Failed"|string;
  export type ShippingOption = "SECOND_DAY"|"NEXT_DAY"|"EXPRESS"|"STANDARD"|string;
  export type SnowballCapacity = "T50"|"T80"|"T100"|"T42"|"T98"|"T8"|"T14"|"T32"|"NoPreference"|"T240"|"T13"|string;
  export type SnowballType = "STANDARD"|"EDGE"|"EDGE_C"|"EDGE_CG"|"EDGE_S"|"SNC1_HDD"|"SNC1_SSD"|"V3_5C"|"V3_5S"|"RACK_5U_C"|string;
  export interface SnowconeDeviceConfiguration {
    /**
     * Configures the wireless connection for the Snowcone device.
     */
    WirelessConnection?: WirelessConnection;
  }
  export type SnsTopicARN = string;
  export type StorageLimit = number;
  export type StorageUnit = "TB"|string;
  export type String = string;
  export interface TGWOnDeviceServiceConfiguration {
    /**
     * The maximum number of virtual tapes to store on one Snow Family device. Due to physical resource limitations, this value must be set to 80 for Snowball Edge.
     */
    StorageLimit?: StorageLimit;
    /**
     * The scale unit of the virtual tapes on the device.
     */
    StorageUnit?: StorageUnit;
  }
  export interface TargetOnDeviceService {
    /**
     * Specifies the name of the service on the Snow Family device that your transferred data will be exported from or imported into.
     */
    ServiceName?: DeviceServiceName;
    /**
     * Specifies whether the data is being imported or exported. You can import or export the data, or use it locally on the device.
     */
    TransferOption?: TransferOption;
  }
  export type TargetOnDeviceServiceList = TargetOnDeviceService[];
  export interface TaxDocuments {
    IND?: INDTaxDocuments;
  }
  export type Timestamp = Date;
  export type TransferOption = "IMPORT"|"EXPORT"|"LOCAL_USE"|string;
  export interface UpdateClusterRequest {
    /**
     * The cluster ID of the cluster that you want to update, for example CID123e4567-e89b-12d3-a456-426655440000.
     */
    ClusterId: ClusterId;
    /**
     * The new role Amazon Resource Name (ARN) that you want to associate with this cluster. To create a role ARN, use the CreateRole API action in Identity and Access Management (IAM).
     */
    RoleARN?: RoleARN;
    /**
     * The updated description of this cluster.
     */
    Description?: String;
    /**
     * The updated arrays of JobResource objects that can include updated S3Resource objects or LambdaResource objects.
     */
    Resources?: JobResource;
    /**
     * Specifies the service or services on the Snow Family device that your transferred data will be exported from or imported into. Amazon Web Services Snow Family device clusters support Amazon S3 and NFS (Network File System).
     */
    OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
    /**
     * The ID of the updated Address object.
     */
    AddressId?: AddressId;
    /**
     * The updated shipping option value of this cluster's ShippingDetails object.
     */
    ShippingOption?: ShippingOption;
    /**
     * The new or updated Notification object.
     */
    Notification?: Notification;
    /**
     * The updated ID for the forwarding address for a cluster. This field is not supported in most regions.
     */
    ForwardingAddressId?: AddressId;
  }
  export interface UpdateClusterResult {
  }
  export interface UpdateJobRequest {
    /**
     * The job ID of the job that you want to update, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId: JobId;
    /**
     * The new role Amazon Resource Name (ARN) that you want to associate with this job. To create a role ARN, use the CreateRoleIdentity and Access Management (IAM) API action.
     */
    RoleARN?: RoleARN;
    /**
     * The new or updated Notification object.
     */
    Notification?: Notification;
    /**
     * The updated JobResource object, or the updated JobResource object. 
     */
    Resources?: JobResource;
    /**
     * Specifies the service or services on the Snow Family device that your transferred data will be exported from or imported into. Amazon Web Services Snow Family supports Amazon S3 and NFS (Network File System) and the Amazon Web Services Storage Gateway service Tape Gateway type.
     */
    OnDeviceServiceConfiguration?: OnDeviceServiceConfiguration;
    /**
     * The ID of the updated Address object.
     */
    AddressId?: AddressId;
    /**
     * The updated shipping option value of this job's ShippingDetails object.
     */
    ShippingOption?: ShippingOption;
    /**
     * The updated description of this job's JobMetadata object.
     */
    Description?: String;
    /**
     * The updated SnowballCapacityPreference of this job's JobMetadata object. The 50 TB Snowballs are only available in the US regions. For more information, see "https://docs.aws.amazon.com/snowball/latest/snowcone-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide or "https://docs.aws.amazon.com/snowball/latest/developer-guide/snow-device-types.html" (Snow Family Devices and Capacity) in the Snowcone User Guide.
     */
    SnowballCapacityPreference?: SnowballCapacity;
    /**
     * The updated ID for the forwarding address for a job. This field is not supported in most regions.
     */
    ForwardingAddressId?: AddressId;
    PickupDetails?: PickupDetails;
  }
  export interface UpdateJobResult {
  }
  export interface UpdateJobShipmentStateRequest {
    /**
     * The job ID of the job whose shipment date you want to update, for example JID123e4567-e89b-12d3-a456-426655440000.
     */
    JobId: JobId;
    /**
     * The state of a device when it is being shipped.  Set to RECEIVED when the device arrives at your location. Set to RETURNED when you have returned the device to Amazon Web Services.
     */
    ShipmentState: ShipmentState;
  }
  export interface UpdateJobShipmentStateResult {
  }
  export interface UpdateLongTermPricingRequest {
    /**
     * The ID of the long-term pricing type for the device.
     */
    LongTermPricingId: LongTermPricingId;
    /**
     * Specifies that a device that is ordered with long-term pricing should be replaced with a new device.
     */
    ReplacementJob?: JobId;
    /**
     * If set to true, specifies that the current long-term pricing type for the device should be automatically renewed before the long-term pricing contract expires.
     */
    IsLongTermPricingAutoRenew?: JavaBoolean;
  }
  export interface UpdateLongTermPricingResult {
  }
  export interface WirelessConnection {
    /**
     * Enables the Wi-Fi adapter on an Snowcone device.
     */
    IsWifiEnabled?: Boolean;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-06-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Snowball client.
   */
  export import Types = Snowball;
}
export = Snowball;
