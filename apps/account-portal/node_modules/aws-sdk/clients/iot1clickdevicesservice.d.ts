import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class IoT1ClickDevicesService extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: IoT1ClickDevicesService.Types.ClientConfiguration)
  config: Config & IoT1ClickDevicesService.Types.ClientConfiguration;
  /**
   * Adds device(s) to your account (i.e., claim one or more devices) if and only if you
 received a claim code with the device(s).
   */
  claimDevicesByClaimCode(params: IoT1ClickDevicesService.Types.ClaimDevicesByClaimCodeRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.ClaimDevicesByClaimCodeResponse) => void): Request<IoT1ClickDevicesService.Types.ClaimDevicesByClaimCodeResponse, AWSError>;
  /**
   * Adds device(s) to your account (i.e., claim one or more devices) if and only if you
 received a claim code with the device(s).
   */
  claimDevicesByClaimCode(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.ClaimDevicesByClaimCodeResponse) => void): Request<IoT1ClickDevicesService.Types.ClaimDevicesByClaimCodeResponse, AWSError>;
  /**
   * Given a device ID, returns a DescribeDeviceResponse object describing the
 details of the device.
   */
  describeDevice(params: IoT1ClickDevicesService.Types.DescribeDeviceRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.DescribeDeviceResponse) => void): Request<IoT1ClickDevicesService.Types.DescribeDeviceResponse, AWSError>;
  /**
   * Given a device ID, returns a DescribeDeviceResponse object describing the
 details of the device.
   */
  describeDevice(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.DescribeDeviceResponse) => void): Request<IoT1ClickDevicesService.Types.DescribeDeviceResponse, AWSError>;
  /**
   * Given a device ID, finalizes the claim request for the associated device.
 Claiming a device consists of initiating a claim, then publishing a device event,
 and finalizing the claim. For a device of type button, a device event can
 be published by simply clicking the device.
 
   */
  finalizeDeviceClaim(params: IoT1ClickDevicesService.Types.FinalizeDeviceClaimRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.FinalizeDeviceClaimResponse) => void): Request<IoT1ClickDevicesService.Types.FinalizeDeviceClaimResponse, AWSError>;
  /**
   * Given a device ID, finalizes the claim request for the associated device.
 Claiming a device consists of initiating a claim, then publishing a device event,
 and finalizing the claim. For a device of type button, a device event can
 be published by simply clicking the device.
 
   */
  finalizeDeviceClaim(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.FinalizeDeviceClaimResponse) => void): Request<IoT1ClickDevicesService.Types.FinalizeDeviceClaimResponse, AWSError>;
  /**
   * Given a device ID, returns the invokable methods associated with the device.
   */
  getDeviceMethods(params: IoT1ClickDevicesService.Types.GetDeviceMethodsRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.GetDeviceMethodsResponse) => void): Request<IoT1ClickDevicesService.Types.GetDeviceMethodsResponse, AWSError>;
  /**
   * Given a device ID, returns the invokable methods associated with the device.
   */
  getDeviceMethods(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.GetDeviceMethodsResponse) => void): Request<IoT1ClickDevicesService.Types.GetDeviceMethodsResponse, AWSError>;
  /**
   * Given a device ID, initiates a claim request for the associated device.
 Claiming a device consists of initiating a claim, then publishing a device event,
 and finalizing the claim. For a device of type button, a device event can
 be published by simply clicking the device.
 
   */
  initiateDeviceClaim(params: IoT1ClickDevicesService.Types.InitiateDeviceClaimRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.InitiateDeviceClaimResponse) => void): Request<IoT1ClickDevicesService.Types.InitiateDeviceClaimResponse, AWSError>;
  /**
   * Given a device ID, initiates a claim request for the associated device.
 Claiming a device consists of initiating a claim, then publishing a device event,
 and finalizing the claim. For a device of type button, a device event can
 be published by simply clicking the device.
 
   */
  initiateDeviceClaim(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.InitiateDeviceClaimResponse) => void): Request<IoT1ClickDevicesService.Types.InitiateDeviceClaimResponse, AWSError>;
  /**
   * Given a device ID, issues a request to invoke a named device method (with possible
 parameters). See the "Example POST" code snippet below.
   */
  invokeDeviceMethod(params: IoT1ClickDevicesService.Types.InvokeDeviceMethodRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.InvokeDeviceMethodResponse) => void): Request<IoT1ClickDevicesService.Types.InvokeDeviceMethodResponse, AWSError>;
  /**
   * Given a device ID, issues a request to invoke a named device method (with possible
 parameters). See the "Example POST" code snippet below.
   */
  invokeDeviceMethod(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.InvokeDeviceMethodResponse) => void): Request<IoT1ClickDevicesService.Types.InvokeDeviceMethodResponse, AWSError>;
  /**
   * Using a device ID, returns a DeviceEventsResponse object containing an
 array of events for the device.
   */
  listDeviceEvents(params: IoT1ClickDevicesService.Types.ListDeviceEventsRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.ListDeviceEventsResponse) => void): Request<IoT1ClickDevicesService.Types.ListDeviceEventsResponse, AWSError>;
  /**
   * Using a device ID, returns a DeviceEventsResponse object containing an
 array of events for the device.
   */
  listDeviceEvents(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.ListDeviceEventsResponse) => void): Request<IoT1ClickDevicesService.Types.ListDeviceEventsResponse, AWSError>;
  /**
   * Lists the 1-Click compatible devices associated with your AWS account.
   */
  listDevices(params: IoT1ClickDevicesService.Types.ListDevicesRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.ListDevicesResponse) => void): Request<IoT1ClickDevicesService.Types.ListDevicesResponse, AWSError>;
  /**
   * Lists the 1-Click compatible devices associated with your AWS account.
   */
  listDevices(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.ListDevicesResponse) => void): Request<IoT1ClickDevicesService.Types.ListDevicesResponse, AWSError>;
  /**
   * Lists the tags associated with the specified resource ARN.
   */
  listTagsForResource(params: IoT1ClickDevicesService.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.ListTagsForResourceResponse) => void): Request<IoT1ClickDevicesService.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags associated with the specified resource ARN.
   */
  listTagsForResource(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.ListTagsForResourceResponse) => void): Request<IoT1ClickDevicesService.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds or updates the tags associated with the resource ARN. See AWS IoT 1-Click Service Limits for the maximum number of tags allowed per
 resource.
   */
  tagResource(params: IoT1ClickDevicesService.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Adds or updates the tags associated with the resource ARN. See AWS IoT 1-Click Service Limits for the maximum number of tags allowed per
 resource.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Disassociates a device from your AWS account using its device ID.
   */
  unclaimDevice(params: IoT1ClickDevicesService.Types.UnclaimDeviceRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.UnclaimDeviceResponse) => void): Request<IoT1ClickDevicesService.Types.UnclaimDeviceResponse, AWSError>;
  /**
   * Disassociates a device from your AWS account using its device ID.
   */
  unclaimDevice(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.UnclaimDeviceResponse) => void): Request<IoT1ClickDevicesService.Types.UnclaimDeviceResponse, AWSError>;
  /**
   * Using tag keys, deletes the tags (key/value pairs) associated with the specified
 resource ARN.
   */
  untagResource(params: IoT1ClickDevicesService.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Using tag keys, deletes the tags (key/value pairs) associated with the specified
 resource ARN.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Using a Boolean value (true or false), this operation
 enables or disables the device given a device ID.
   */
  updateDeviceState(params: IoT1ClickDevicesService.Types.UpdateDeviceStateRequest, callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.UpdateDeviceStateResponse) => void): Request<IoT1ClickDevicesService.Types.UpdateDeviceStateResponse, AWSError>;
  /**
   * Using a Boolean value (true or false), this operation
 enables or disables the device given a device ID.
   */
  updateDeviceState(callback?: (err: AWSError, data: IoT1ClickDevicesService.Types.UpdateDeviceStateResponse) => void): Request<IoT1ClickDevicesService.Types.UpdateDeviceStateResponse, AWSError>;
}
declare namespace IoT1ClickDevicesService {
  export interface Attributes {
  }
  export interface ClaimDevicesByClaimCodeRequest {
    /**
     * The claim code, starting with "C-", as provided by the device manufacturer.
     */
    ClaimCode: __string;
  }
  export interface ClaimDevicesByClaimCodeResponse {
    /**
     * The claim code provided by the device manufacturer.
     */
    ClaimCode?: __stringMin12Max40;
    /**
     * The total number of devices associated with the claim code that has been processed in
 the claim request.
     */
    Total?: __integer;
  }
  export interface DescribeDeviceRequest {
    /**
     * The unique identifier of the device.
     */
    DeviceId: __string;
  }
  export interface DescribeDeviceResponse {
    /**
     * Device details.
     */
    DeviceDescription?: DeviceDescription;
  }
  export interface Device {
    /**
     * The user specified attributes associated with the device for an event.
     */
    Attributes?: Attributes;
    /**
     * The unique identifier of the device.
     */
    DeviceId?: __string;
    /**
     * The device type, such as "button".
     */
    Type?: __string;
  }
  export type DeviceAttributes = {[key: string]: __string};
  export interface DeviceDescription {
    /**
     * The ARN of the device.
     */
    Arn?: __string;
    /**
     * An array of zero or more elements of DeviceAttribute objects providing
 user specified device attributes.
     */
    Attributes?: DeviceAttributes;
    /**
     * The unique identifier of the device.
     */
    DeviceId?: __string;
    /**
     * A Boolean value indicating whether or not the device is enabled.
     */
    Enabled?: __boolean;
    /**
     * A value between 0 and 1 inclusive, representing the fraction of life remaining for the
 device.
     */
    RemainingLife?: __doubleMin0Max100;
    /**
     * The type of the device, such as "button".
     */
    Type?: __string;
    /**
     * The tags currently associated with the AWS IoT 1-Click device.
     */
    Tags?: __mapOf__string;
  }
  export interface DeviceEvent {
    /**
     * An object representing the device associated with the event.
     */
    Device?: Device;
    /**
     * A serialized JSON object representing the device-type specific event.
     */
    StdEvent?: __string;
  }
  export interface DeviceMethod {
    /**
     * The type of the device, such as "button".
     */
    DeviceType?: __string;
    /**
     * The name of the method applicable to the deviceType.
     */
    MethodName?: __string;
  }
  export interface FinalizeDeviceClaimRequest {
    /**
     * The unique identifier of the device.
     */
    DeviceId: __string;
    /**
     * A collection of key/value pairs defining the resource tags. For example, {
 "tags": {"key1": "value1", "key2": "value2"} }. For more information, see AWS
 Tagging Strategies.
 
 
     */
    Tags?: __mapOf__string;
  }
  export interface FinalizeDeviceClaimResponse {
    /**
     * The device's final claim state.
     */
    State?: __string;
  }
  export interface GetDeviceMethodsRequest {
    /**
     * The unique identifier of the device.
     */
    DeviceId: __string;
  }
  export interface GetDeviceMethodsResponse {
    /**
     * List of available device APIs.
     */
    DeviceMethods?: __listOfDeviceMethod;
  }
  export interface InitiateDeviceClaimRequest {
    /**
     * The unique identifier of the device.
     */
    DeviceId: __string;
  }
  export interface InitiateDeviceClaimResponse {
    /**
     * The device's final claim state.
     */
    State?: __string;
  }
  export interface InvokeDeviceMethodRequest {
    /**
     * The unique identifier of the device.
     */
    DeviceId: __string;
    /**
     * The device method to invoke.
     */
    DeviceMethod?: DeviceMethod;
    /**
     * A JSON encoded string containing the device method request parameters.
     */
    DeviceMethodParameters?: __string;
  }
  export interface InvokeDeviceMethodResponse {
    /**
     * A JSON encoded string containing the device method response.
     */
    DeviceMethodResponse?: __string;
  }
  export interface ListDeviceEventsRequest {
    /**
     * The unique identifier of the device.
     */
    DeviceId: __string;
    /**
     * The start date for the device event query, in ISO8061 format. For example,
 2018-03-28T15:45:12.880Z
 
     */
    FromTimeStamp: __timestampIso8601;
    /**
     * The maximum number of results to return per request. If not set, a default value of
 100 is used.
     */
    MaxResults?: MaxResults;
    /**
     * The token to retrieve the next set of results.
     */
    NextToken?: __string;
    /**
     * The end date for the device event query, in ISO8061 format. For example,
 2018-03-28T15:45:12.880Z
 
     */
    ToTimeStamp: __timestampIso8601;
  }
  export interface ListDeviceEventsResponse {
    /**
     * An array of zero or more elements describing the event(s) associated with the
 device.
     */
    Events?: __listOfDeviceEvent;
    /**
     * The token to retrieve the next set of results.
     */
    NextToken?: __string;
  }
  export interface ListDevicesRequest {
    /**
     * The type of the device, such as "button".
     */
    DeviceType?: __string;
    /**
     * The maximum number of results to return per request. If not set, a default value of
 100 is used.
     */
    MaxResults?: MaxResults;
    /**
     * The token to retrieve the next set of results.
     */
    NextToken?: __string;
  }
  export interface ListDevicesResponse {
    /**
     * A list of devices.
     */
    Devices?: __listOfDeviceDescription;
    /**
     * The token to retrieve the next set of results.
     */
    NextToken?: __string;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the resource.
     */
    ResourceArn: __string;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A collection of key/value pairs defining the resource tags. For example, {
 "tags": {"key1": "value1", "key2": "value2"} }. For more information, see AWS
 Tagging Strategies.
 
 
     */
    Tags?: __mapOf__string;
  }
  export type MaxResults = number;
  export interface TagResourceRequest {
    /**
     * The ARN of the resource.
     */
    ResourceArn: __string;
    /**
     * A collection of key/value pairs defining the resource tags. For example, {
 "tags": {"key1": "value1", "key2": "value2"} }. For more information, see AWS
 Tagging Strategies.
 
 
     */
    Tags: __mapOf__string;
  }
  export interface UnclaimDeviceRequest {
    /**
     * The unique identifier of the device.
     */
    DeviceId: __string;
  }
  export interface UnclaimDeviceResponse {
    /**
     * The device's final claim state.
     */
    State?: __string;
  }
  export interface UntagResourceRequest {
    /**
     * The ARN of the resource.
     */
    ResourceArn: __string;
    /**
     * A collections of tag keys. For example, {"key1","key2"}
     */
    TagKeys: __listOf__string;
  }
  export interface UpdateDeviceStateRequest {
    /**
     * The unique identifier of the device.
     */
    DeviceId: __string;
    /**
     * If true, the device is enabled. If false, the device is
 disabled.
     */
    Enabled?: __boolean;
  }
  export interface UpdateDeviceStateResponse {
  }
  export type __boolean = boolean;
  export type __doubleMin0Max100 = number;
  export type __integer = number;
  export type __listOfDeviceDescription = DeviceDescription[];
  export type __listOfDeviceEvent = DeviceEvent[];
  export type __listOfDeviceMethod = DeviceMethod[];
  export type __listOf__string = __string[];
  export type __mapOf__string = {[key: string]: __string};
  export type __string = string;
  export type __stringMin12Max40 = string;
  export type __timestampIso8601 = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-05-14"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the IoT1ClickDevicesService client.
   */
  export import Types = IoT1ClickDevicesService;
}
export = IoT1ClickDevicesService;
