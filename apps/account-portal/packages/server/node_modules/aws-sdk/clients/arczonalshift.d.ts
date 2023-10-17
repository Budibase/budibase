import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ARCZonalShift extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ARCZonalShift.Types.ClientConfiguration)
  config: Config & ARCZonalShift.Types.ClientConfiguration;
  /**
   * Cancel a zonal shift in Amazon Route 53 Application Recovery Controller that you've started for a resource in your AWS account in an AWS Region. 
   */
  cancelZonalShift(params: ARCZonalShift.Types.CancelZonalShiftRequest, callback?: (err: AWSError, data: ARCZonalShift.Types.ZonalShift) => void): Request<ARCZonalShift.Types.ZonalShift, AWSError>;
  /**
   * Cancel a zonal shift in Amazon Route 53 Application Recovery Controller that you've started for a resource in your AWS account in an AWS Region. 
   */
  cancelZonalShift(callback?: (err: AWSError, data: ARCZonalShift.Types.ZonalShift) => void): Request<ARCZonalShift.Types.ZonalShift, AWSError>;
  /**
   * Get information about a resource that's been registered for zonal shifts with Amazon Route 53 Application Recovery Controller in this AWS Region. Resources that are registered for zonal shifts are managed resources in Route 53 ARC. At this time, you can only start a zonal shift for Network Load Balancers and Application Load Balancers with cross-zone load balancing turned off.
   */
  getManagedResource(params: ARCZonalShift.Types.GetManagedResourceRequest, callback?: (err: AWSError, data: ARCZonalShift.Types.GetManagedResourceResponse) => void): Request<ARCZonalShift.Types.GetManagedResourceResponse, AWSError>;
  /**
   * Get information about a resource that's been registered for zonal shifts with Amazon Route 53 Application Recovery Controller in this AWS Region. Resources that are registered for zonal shifts are managed resources in Route 53 ARC. At this time, you can only start a zonal shift for Network Load Balancers and Application Load Balancers with cross-zone load balancing turned off.
   */
  getManagedResource(callback?: (err: AWSError, data: ARCZonalShift.Types.GetManagedResourceResponse) => void): Request<ARCZonalShift.Types.GetManagedResourceResponse, AWSError>;
  /**
   * Lists all the resources in your AWS account in this AWS Region that are managed for zonal shifts in Amazon Route 53 Application Recovery Controller, and information about them. The information includes their Amazon Resource Names (ARNs), the Availability Zones the resources are deployed in, and the resource name.
   */
  listManagedResources(params: ARCZonalShift.Types.ListManagedResourcesRequest, callback?: (err: AWSError, data: ARCZonalShift.Types.ListManagedResourcesResponse) => void): Request<ARCZonalShift.Types.ListManagedResourcesResponse, AWSError>;
  /**
   * Lists all the resources in your AWS account in this AWS Region that are managed for zonal shifts in Amazon Route 53 Application Recovery Controller, and information about them. The information includes their Amazon Resource Names (ARNs), the Availability Zones the resources are deployed in, and the resource name.
   */
  listManagedResources(callback?: (err: AWSError, data: ARCZonalShift.Types.ListManagedResourcesResponse) => void): Request<ARCZonalShift.Types.ListManagedResourcesResponse, AWSError>;
  /**
   * Lists all the active zonal shifts in Amazon Route 53 Application Recovery Controller in your AWS account in this AWS Region.
   */
  listZonalShifts(params: ARCZonalShift.Types.ListZonalShiftsRequest, callback?: (err: AWSError, data: ARCZonalShift.Types.ListZonalShiftsResponse) => void): Request<ARCZonalShift.Types.ListZonalShiftsResponse, AWSError>;
  /**
   * Lists all the active zonal shifts in Amazon Route 53 Application Recovery Controller in your AWS account in this AWS Region.
   */
  listZonalShifts(callback?: (err: AWSError, data: ARCZonalShift.Types.ListZonalShiftsResponse) => void): Request<ARCZonalShift.Types.ListZonalShiftsResponse, AWSError>;
  /**
   * You start a zonal shift to temporarily move load balancer traffic away from an Availability Zone in a AWS Region, to help your application recover immediately, for example, from a developer's bad code deployment or from an AWS infrastructure failure in a single Availability Zone. You can start a zonal shift in Route 53 ARC only for managed resources in your account in an AWS Region. Resources are automatically registered with Route 53 ARC by AWS services. At this time, you can only start a zonal shift for Network Load Balancers and Application Load Balancers with cross-zone load balancing turned off. When you start a zonal shift, traffic for the resource is no longer routed to the Availability Zone. The zonal shift is created immediately in Route 53 ARC. However, it can take a short time, typically up to a few minutes, for existing, in-progress connections in the Availability Zone to complete. For more information, see Zonal shift in the Amazon Route 53 Application Recovery Controller Developer Guide.
   */
  startZonalShift(params: ARCZonalShift.Types.StartZonalShiftRequest, callback?: (err: AWSError, data: ARCZonalShift.Types.ZonalShift) => void): Request<ARCZonalShift.Types.ZonalShift, AWSError>;
  /**
   * You start a zonal shift to temporarily move load balancer traffic away from an Availability Zone in a AWS Region, to help your application recover immediately, for example, from a developer's bad code deployment or from an AWS infrastructure failure in a single Availability Zone. You can start a zonal shift in Route 53 ARC only for managed resources in your account in an AWS Region. Resources are automatically registered with Route 53 ARC by AWS services. At this time, you can only start a zonal shift for Network Load Balancers and Application Load Balancers with cross-zone load balancing turned off. When you start a zonal shift, traffic for the resource is no longer routed to the Availability Zone. The zonal shift is created immediately in Route 53 ARC. However, it can take a short time, typically up to a few minutes, for existing, in-progress connections in the Availability Zone to complete. For more information, see Zonal shift in the Amazon Route 53 Application Recovery Controller Developer Guide.
   */
  startZonalShift(callback?: (err: AWSError, data: ARCZonalShift.Types.ZonalShift) => void): Request<ARCZonalShift.Types.ZonalShift, AWSError>;
  /**
   * Update an active zonal shift in Amazon Route 53 Application Recovery Controller in your AWS account. You can update a zonal shift to set a new expiration, or edit or replace the comment for the zonal shift. 
   */
  updateZonalShift(params: ARCZonalShift.Types.UpdateZonalShiftRequest, callback?: (err: AWSError, data: ARCZonalShift.Types.ZonalShift) => void): Request<ARCZonalShift.Types.ZonalShift, AWSError>;
  /**
   * Update an active zonal shift in Amazon Route 53 Application Recovery Controller in your AWS account. You can update a zonal shift to set a new expiration, or edit or replace the comment for the zonal shift. 
   */
  updateZonalShift(callback?: (err: AWSError, data: ARCZonalShift.Types.ZonalShift) => void): Request<ARCZonalShift.Types.ZonalShift, AWSError>;
}
declare namespace ARCZonalShift {
  export type AppliedStatus = "APPLIED"|"NOT_APPLIED"|string;
  export type AppliedWeights = {[key: string]: Weight};
  export type AvailabilityZone = string;
  export type AvailabilityZones = AvailabilityZone[];
  export interface CancelZonalShiftRequest {
    /**
     * The internally-generated identifier of a zonal shift.
     */
    zonalShiftId: ZonalShiftId;
  }
  export type ExpiresIn = string;
  export type ExpiryTime = Date;
  export interface GetManagedResourceRequest {
    /**
     * The identifier for the resource to include in a zonal shift. The identifier is the Amazon Resource Name (ARN) for the resource. At this time, you can only start a zonal shift for Network Load Balancers and Application Load Balancers with cross-zone load balancing turned off.
     */
    resourceIdentifier: ResourceIdentifier;
  }
  export interface GetManagedResourceResponse {
    /**
     * A collection of key-value pairs that indicate whether resources are active in Availability Zones or not. The key name is the Availability Zone where the resource is deployed. The value is 1 or 0.
     */
    appliedWeights: AppliedWeights;
    /**
     * The Amazon Resource Name (ARN) for the resource.
     */
    arn?: ResourceArn;
    /**
     * The name of the resource.
     */
    name?: ResourceName;
    /**
     * The zonal shifts that are currently active for a resource. 
     */
    zonalShifts: ZonalShiftsInResource;
  }
  export interface ListManagedResourcesRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    maxResults?: MaxResults;
    /**
     * Specifies that you want to receive the next page of results. Valid only if you received a NextToken response in the previous request. If you did, it indicates that more output is available. Set this parameter to the value provided by the previous call's NextToken response to request the next page of results.
     */
    nextToken?: String;
  }
  export interface ListManagedResourcesResponse {
    /**
     * The items in the response list.
     */
    items: ManagedResourceSummaries;
    /**
     * Specifies that you want to receive the next page of results. Valid only if you received a NextToken response in the previous request. If you did, it indicates that more output is available. Set this parameter to the value provided by the previous call's NextToken response to request the next page of results.
     */
    nextToken?: String;
  }
  export interface ListZonalShiftsRequest {
    /**
     * The number of objects that you want to return with this call.
     */
    maxResults?: MaxResults;
    /**
     * Specifies that you want to receive the next page of results. Valid only if you received a NextToken response in the previous request. If you did, it indicates that more output is available. Set this parameter to the value provided by the previous call's NextToken response to request the next page of results.
     */
    nextToken?: String;
    /**
     * A status for a zonal shift. The Status for a zonal shift can have one of the following values:    ACTIVE: The zonal shift is started and active.    EXPIRED: The zonal shift has expired (the expiry time was exceeded).    CANCELED: The zonal shift was canceled.  
     */
    status?: ZonalShiftStatus;
  }
  export interface ListZonalShiftsResponse {
    /**
     * The items in the response list.
     */
    items?: ZonalShiftSummaries;
    /**
     * Specifies that you want to receive the next page of results. Valid only if you received a NextToken response in the previous request. If you did, it indicates that more output is available. Set this parameter to the value provided by the previous call's NextToken response to request the next page of results.
     */
    nextToken?: String;
  }
  export type ManagedResourceSummaries = ManagedResourceSummary[];
  export interface ManagedResourceSummary {
    /**
     * The Amazon Resource Name (ARN) for the managed resource.
     */
    arn?: ResourceArn;
    /**
     * The Availability Zones that a resource is deployed in.
     */
    availabilityZones: AvailabilityZones;
    /**
     * The name of the managed resource.
     */
    name?: ResourceName;
  }
  export type MaxResults = number;
  export type ResourceArn = string;
  export type ResourceIdentifier = string;
  export type ResourceName = string;
  export type StartTime = Date;
  export interface StartZonalShiftRequest {
    /**
     * The Availability Zone that traffic is moved away from for a resource when you start a zonal shift. Until the zonal shift expires or you cancel it, traffic for the resource is instead moved to other Availability Zones in the AWS Region.
     */
    awayFrom: AvailabilityZone;
    /**
     * A comment that you enter about the zonal shift. Only the latest comment is retained; no comment history is maintained. A new comment overwrites any existing comment string.
     */
    comment: ZonalShiftComment;
    /**
     * The length of time that you want a zonal shift to be active, which Route 53 ARC converts to an expiry time (expiration time). Zonal shifts are temporary. You can set a zonal shift to be active initially for up to three days (72 hours). If you want to still keep traffic away from an Availability Zone, you can update the zonal shift and set a new expiration. You can also cancel a zonal shift, before it expires, for example, if you're ready to restore traffic to the Availability Zone. To set a length of time for a zonal shift to be active, specify a whole number, and then one of the following, with no space:  &lt;ul&gt; &lt;li&gt; &lt;p&gt; &lt;b&gt;A lowercase letter m:&lt;/b&gt; To specify that the value is in minutes.&lt;/p&gt; &lt;/li&gt; &lt;li&gt; &lt;p&gt; &lt;b&gt;A lowercase letter h:&lt;/b&gt; To specify that the value is in hours.&lt;/p&gt; &lt;/li&gt; &lt;/ul&gt; &lt;p&gt;For example: &lt;code&gt;20h&lt;/code&gt; means the zonal shift expires in 20 hours. &lt;code&gt;120m&lt;/code&gt; means the zonal shift expires in 120 minutes (2 hours).&lt;/p&gt; 
     */
    expiresIn: ExpiresIn;
    /**
     * The identifier for the resource to include in a zonal shift. The identifier is the Amazon Resource Name (ARN) for the resource. At this time, you can only start a zonal shift for Network Load Balancers and Application Load Balancers with cross-zone load balancing turned off.
     */
    resourceIdentifier: ResourceIdentifier;
  }
  export type String = string;
  export interface UpdateZonalShiftRequest {
    /**
     * A comment that you enter about the zonal shift. Only the latest comment is retained; no comment history is maintained. A new comment overwrites any existing comment string.
     */
    comment?: ZonalShiftComment;
    /**
     * The length of time that you want a zonal shift to be active, which Route 53 ARC converts to an expiry time (expiration time). Zonal shifts are temporary. You can set a zonal shift to be active initially for up to three days (72 hours). If you want to still keep traffic away from an Availability Zone, you can update the zonal shift and set a new expiration. You can also cancel a zonal shift, before it expires, for example, if you're ready to restore traffic to the Availability Zone. To set a length of time for a zonal shift to be active, specify a whole number, and then one of the following, with no space:    A lowercase letter m: To specify that the value is in minutes.    A lowercase letter h: To specify that the value is in hours.   For example: 20h means the zonal shift expires in 20 hours. 120m means the zonal shift expires in 120 minutes (2 hours).
     */
    expiresIn?: ExpiresIn;
    /**
     * The identifier of a zonal shift.
     */
    zonalShiftId: ZonalShiftId;
  }
  export type Weight = number;
  export interface ZonalShift {
    /**
     * The Availability Zone that traffic is moved away from for a resource when you start a zonal shift. Until the zonal shift expires or you cancel it, traffic for the resource is instead moved to other Availability Zones in the AWS Region.
     */
    awayFrom: AvailabilityZone;
    /**
     * A comment that you enter about the zonal shift. Only the latest comment is retained; no comment history is maintained. A new comment overwrites any existing comment string.
     */
    comment: ZonalShiftComment;
    /**
     * The expiry time (expiration time) for the zonal shift. A zonal shift is temporary and must be set to expire when you start the zonal shift. You can initially set a zonal shift to expire in a maximum of three days (72 hours). However, you can update a zonal shift to set a new expiration at any time.  When you start a zonal shift, you specify how long you want it to be active, which Route 53 ARC converts to an expiry time (expiration time). You can cancel a zonal shift, for example, if you're ready to restore traffic to the Availability Zone. Or you can update the zonal shift to specify another length of time to expire in.
     */
    expiryTime: ExpiryTime;
    /**
     * The identifier for the resource to include in a zonal shift. The identifier is the Amazon Resource Name (ARN) for the resource. At this time, you can only start a zonal shift for Network Load Balancers and Application Load Balancers with cross-zone load balancing turned off.
     */
    resourceIdentifier: ResourceIdentifier;
    /**
     * The time (UTC) when the zonal shift is started.
     */
    startTime: StartTime;
    /**
     * A status for a zonal shift. The Status for a zonal shift can have one of the following values:    ACTIVE: The zonal shift is started and active.    EXPIRED: The zonal shift has expired (the expiry time was exceeded).    CANCELED: The zonal shift was canceled.  
     */
    status: ZonalShiftStatus;
    /**
     * The identifier of a zonal shift.
     */
    zonalShiftId: ZonalShiftId;
  }
  export type ZonalShiftComment = string;
  export type ZonalShiftId = string;
  export interface ZonalShiftInResource {
    /**
     * An appliedStatus for a zonal shift for a resource can have one of two values: APPLIED or NOT_APPLIED. 
     */
    appliedStatus: AppliedStatus;
    /**
     * The Availability Zone that traffic is moved away from for a resource when you start a zonal shift. Until the zonal shift expires or you cancel it, traffic for the resource is instead moved to other Availability Zones in the AWS Region.
     */
    awayFrom: AvailabilityZone;
    /**
     * A comment that you enter about the zonal shift. Only the latest comment is retained; no comment history is maintained. That is, a new comment overwrites any existing comment string.
     */
    comment: ZonalShiftComment;
    /**
     * The expiry time (expiration time) for the zonal shift. A zonal shift is temporary and must be set to expire when you start the zonal shift. You can initially set a zonal shift to expire in a maximum of three days (72 hours). However, you can update a zonal shift to set a new expiration at any time.  When you start a zonal shift, you specify how long you want it to be active, which Route 53 ARC converts to an expiry time (expiration time). You can cancel a zonal shift, for example, if you're ready to restore traffic to the Availability Zone. Or you can update the zonal shift to specify another length of time to expire in.
     */
    expiryTime: ExpiryTime;
    /**
     * The identifier for the resource to include in a zonal shift. The identifier is the Amazon Resource Name (ARN) for the resource. At this time, you can only start a zonal shift for Network Load Balancers and Application Load Balancers with cross-zone load balancing turned off.
     */
    resourceIdentifier: ResourceIdentifier;
    /**
     * The time (UTC) when the zonal shift is started.
     */
    startTime: StartTime;
    /**
     * The identifier of a zonal shift.
     */
    zonalShiftId: ZonalShiftId;
  }
  export type ZonalShiftStatus = "ACTIVE"|"EXPIRED"|"CANCELED"|string;
  export type ZonalShiftSummaries = ZonalShiftSummary[];
  export interface ZonalShiftSummary {
    /**
     * The Availability Zone that traffic is moved away from for a resource when you start a zonal shift. Until the zonal shift expires or you cancel it, traffic for the resource is instead moved to other Availability Zones in the AWS Region.
     */
    awayFrom: AvailabilityZone;
    /**
     * A comment that you enter about the zonal shift. Only the latest comment is retained; no comment history is maintained. That is, a new comment overwrites any existing comment string.
     */
    comment: ZonalShiftComment;
    /**
     * The expiry time (expiration time) for the zonal shift. A zonal shift is temporary and must be set to expire when you start the zonal shift. You can initially set a zonal shift to expire in a maximum of three days (72 hours). However, you can update a zonal shift to set a new expiration at any time.  When you start a zonal shift, you specify how long you want it to be active, which Route 53 ARC converts to an expiry time (expiration time). You can cancel a zonal shift, for example, if you're ready to restore traffic to the Availability Zone. Or you can update the zonal shift to specify another length of time to expire in.
     */
    expiryTime: ExpiryTime;
    /**
     * The identifier for the resource to include in a zonal shift. The identifier is the Amazon Resource Name (ARN) for the resource. At this time, you can only start a zonal shift for Network Load Balancers and Application Load Balancers with cross-zone load balancing turned off.
     */
    resourceIdentifier: ResourceIdentifier;
    /**
     * The time (UTC) when the zonal shift is started.
     */
    startTime: StartTime;
    /**
     * A status for a zonal shift. The Status for a zonal shift can have one of the following values:    ACTIVE: The zonal shift is started and active.    EXPIRED: The zonal shift has expired (the expiry time was exceeded).    CANCELED: The zonal shift was canceled.  
     */
    status: ZonalShiftStatus;
    /**
     * The identifier of a zonal shift.
     */
    zonalShiftId: ZonalShiftId;
  }
  export type ZonalShiftsInResource = ZonalShiftInResource[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2022-10-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ARCZonalShift client.
   */
  export import Types = ARCZonalShift;
}
export = ARCZonalShift;
