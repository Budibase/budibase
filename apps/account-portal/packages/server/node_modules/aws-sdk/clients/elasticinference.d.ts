import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ElasticInference extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ElasticInference.Types.ClientConfiguration)
  config: Config & ElasticInference.Types.ClientConfiguration;
  /**
   *  Describes the locations in which a given accelerator type or set of types is present in a given region.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  describeAcceleratorOfferings(params: ElasticInference.Types.DescribeAcceleratorOfferingsRequest, callback?: (err: AWSError, data: ElasticInference.Types.DescribeAcceleratorOfferingsResponse) => void): Request<ElasticInference.Types.DescribeAcceleratorOfferingsResponse, AWSError>;
  /**
   *  Describes the locations in which a given accelerator type or set of types is present in a given region.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  describeAcceleratorOfferings(callback?: (err: AWSError, data: ElasticInference.Types.DescribeAcceleratorOfferingsResponse) => void): Request<ElasticInference.Types.DescribeAcceleratorOfferingsResponse, AWSError>;
  /**
   *  Describes the accelerator types available in a given region, as well as their characteristics, such as memory and throughput.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  describeAcceleratorTypes(params: ElasticInference.Types.DescribeAcceleratorTypesRequest, callback?: (err: AWSError, data: ElasticInference.Types.DescribeAcceleratorTypesResponse) => void): Request<ElasticInference.Types.DescribeAcceleratorTypesResponse, AWSError>;
  /**
   *  Describes the accelerator types available in a given region, as well as their characteristics, such as memory and throughput.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  describeAcceleratorTypes(callback?: (err: AWSError, data: ElasticInference.Types.DescribeAcceleratorTypesResponse) => void): Request<ElasticInference.Types.DescribeAcceleratorTypesResponse, AWSError>;
  /**
   *  Describes information over a provided set of accelerators belonging to an account.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  describeAccelerators(params: ElasticInference.Types.DescribeAcceleratorsRequest, callback?: (err: AWSError, data: ElasticInference.Types.DescribeAcceleratorsResponse) => void): Request<ElasticInference.Types.DescribeAcceleratorsResponse, AWSError>;
  /**
   *  Describes information over a provided set of accelerators belonging to an account.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  describeAccelerators(callback?: (err: AWSError, data: ElasticInference.Types.DescribeAcceleratorsResponse) => void): Request<ElasticInference.Types.DescribeAcceleratorsResponse, AWSError>;
  /**
   *  Returns all tags of an Elastic Inference Accelerator.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  listTagsForResource(params: ElasticInference.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ElasticInference.Types.ListTagsForResourceResult) => void): Request<ElasticInference.Types.ListTagsForResourceResult, AWSError>;
  /**
   *  Returns all tags of an Elastic Inference Accelerator.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  listTagsForResource(callback?: (err: AWSError, data: ElasticInference.Types.ListTagsForResourceResult) => void): Request<ElasticInference.Types.ListTagsForResourceResult, AWSError>;
  /**
   *  Adds the specified tags to an Elastic Inference Accelerator.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  tagResource(params: ElasticInference.Types.TagResourceRequest, callback?: (err: AWSError, data: ElasticInference.Types.TagResourceResult) => void): Request<ElasticInference.Types.TagResourceResult, AWSError>;
  /**
   *  Adds the specified tags to an Elastic Inference Accelerator.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  tagResource(callback?: (err: AWSError, data: ElasticInference.Types.TagResourceResult) => void): Request<ElasticInference.Types.TagResourceResult, AWSError>;
  /**
   *  Removes the specified tags from an Elastic Inference Accelerator.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  untagResource(params: ElasticInference.Types.UntagResourceRequest, callback?: (err: AWSError, data: ElasticInference.Types.UntagResourceResult) => void): Request<ElasticInference.Types.UntagResourceResult, AWSError>;
  /**
   *  Removes the specified tags from an Elastic Inference Accelerator.   February 15, 2023: Starting April 15, 2023, AWS will not onboard new customers to Amazon Elastic Inference (EI), and will help current customers migrate their workloads to options that offer better price and performance. After April 15, 2023, new customers will not be able to launch instances with Amazon EI accelerators in Amazon SageMaker, Amazon ECS, or Amazon EC2. However, customers who have used Amazon EI at least once during the past 30-day period are considered current customers and will be able to continue using the service. 
   */
  untagResource(callback?: (err: AWSError, data: ElasticInference.Types.UntagResourceResult) => void): Request<ElasticInference.Types.UntagResourceResult, AWSError>;
}
declare namespace ElasticInference {
  export type AcceleratorHealthStatus = string;
  export type AcceleratorId = string;
  export type AcceleratorIdList = AcceleratorId[];
  export interface AcceleratorType {
    /**
     *  The name of the Elastic Inference Accelerator type. 
     */
    acceleratorTypeName?: AcceleratorTypeName;
    /**
     *  The memory information of the Elastic Inference Accelerator type. 
     */
    memoryInfo?: MemoryInfo;
    /**
     *  The throughput information of the Elastic Inference Accelerator type. 
     */
    throughputInfo?: ThroughputInfoList;
  }
  export type AcceleratorTypeList = AcceleratorType[];
  export type AcceleratorTypeName = string;
  export type AcceleratorTypeNameList = AcceleratorTypeName[];
  export interface AcceleratorTypeOffering {
    /**
     *  The name of the Elastic Inference Accelerator type. 
     */
    acceleratorType?: AcceleratorTypeName;
    /**
     *  The location type for the offering. It can assume the following values: region: defines that the offering is at the regional level. availability-zone: defines that the offering is at the availability zone level. availability-zone-id: defines that the offering is at the availability zone level, defined by the availability zone id. 
     */
    locationType?: LocationType;
    /**
     *  The location for the offering. It will return either the region, availability zone or availability zone id for the offering depending on the locationType value. 
     */
    location?: Location;
  }
  export type AcceleratorTypeOfferingList = AcceleratorTypeOffering[];
  export type AvailabilityZone = string;
  export interface DescribeAcceleratorOfferingsRequest {
    /**
     *  The location type that you want to describe accelerator type offerings for. It can assume the following values: region: will return the accelerator type offering at the regional level. availability-zone: will return the accelerator type offering at the availability zone level. availability-zone-id: will return the accelerator type offering at the availability zone level returning the availability zone id. 
     */
    locationType: LocationType;
    /**
     *  The list of accelerator types to describe. 
     */
    acceleratorTypes?: AcceleratorTypeNameList;
  }
  export interface DescribeAcceleratorOfferingsResponse {
    /**
     *  The list of accelerator type offerings for a specific location. 
     */
    acceleratorTypeOfferings?: AcceleratorTypeOfferingList;
  }
  export interface DescribeAcceleratorTypesRequest {
  }
  export interface DescribeAcceleratorTypesResponse {
    /**
     *  The available accelerator types. 
     */
    acceleratorTypes?: AcceleratorTypeList;
  }
  export interface DescribeAcceleratorsRequest {
    /**
     *  The IDs of the accelerators to describe. 
     */
    acceleratorIds?: AcceleratorIdList;
    /**
     *  One or more filters. Filter names and values are case-sensitive. Valid filter names are: accelerator-types: can provide a list of accelerator type names to filter for. instance-id: can provide a list of EC2 instance ids to filter for. 
     */
    filters?: FilterList;
    /**
     *  The total number of items to return in the command's output. If the total number of items available is more than the value specified, a NextToken is provided in the command's output. To resume pagination, provide the NextToken value in the starting-token argument of a subsequent command. Do not use the NextToken response element directly outside of the AWS CLI. 
     */
    maxResults?: MaxResults;
    /**
     *  A token to specify where to start paginating. This is the NextToken from a previously truncated response. 
     */
    nextToken?: NextToken;
  }
  export interface DescribeAcceleratorsResponse {
    /**
     *  The details of the Elastic Inference Accelerators. 
     */
    acceleratorSet?: ElasticInferenceAcceleratorSet;
    /**
     *  A token to specify where to start paginating. This is the NextToken from a previously truncated response. 
     */
    nextToken?: NextToken;
  }
  export interface ElasticInferenceAccelerator {
    /**
     *  The health of the Elastic Inference Accelerator. 
     */
    acceleratorHealth?: ElasticInferenceAcceleratorHealth;
    /**
     *  The type of the Elastic Inference Accelerator. 
     */
    acceleratorType?: AcceleratorTypeName;
    /**
     *  The ID of the Elastic Inference Accelerator. 
     */
    acceleratorId?: AcceleratorId;
    /**
     *  The availability zone where the Elastic Inference Accelerator is present. 
     */
    availabilityZone?: AvailabilityZone;
    /**
     *  The ARN of the resource that the Elastic Inference Accelerator is attached to. 
     */
    attachedResource?: ResourceArn;
  }
  export interface ElasticInferenceAcceleratorHealth {
    /**
     *  The health status of the Elastic Inference Accelerator. 
     */
    status?: AcceleratorHealthStatus;
  }
  export type ElasticInferenceAcceleratorSet = ElasticInferenceAccelerator[];
  export interface Filter {
    /**
     *  The filter name for the Elastic Inference Accelerator list. It can assume the following values: accelerator-type: the type of Elastic Inference Accelerator to filter for. instance-id: an EC2 instance id to filter for. 
     */
    name?: FilterName;
    /**
     *  The values for the filter of the Elastic Inference Accelerator list. 
     */
    values?: ValueStringList;
  }
  export type FilterList = Filter[];
  export type FilterName = string;
  export type Integer = number;
  export type Key = string;
  export interface KeyValuePair {
    /**
     *  The throughput value of the Elastic Inference Accelerator type. It can assume the following values: TFLOPS16bit: the throughput expressed in 16bit TeraFLOPS. TFLOPS32bit: the throughput expressed in 32bit TeraFLOPS. 
     */
    key?: Key;
    /**
     *  The throughput value of the Elastic Inference Accelerator type. 
     */
    value?: Value;
  }
  export interface ListTagsForResourceRequest {
    /**
     *  The ARN of the Elastic Inference Accelerator to list the tags for. 
     */
    resourceArn: ResourceARN;
  }
  export interface ListTagsForResourceResult {
    /**
     *  The tags of the Elastic Inference Accelerator. 
     */
    tags?: TagMap;
  }
  export type Location = string;
  export type LocationType = "region"|"availability-zone"|"availability-zone-id"|string;
  export type MaxResults = number;
  export interface MemoryInfo {
    /**
     *  The size in mebibytes of the Elastic Inference Accelerator type. 
     */
    sizeInMiB?: Integer;
  }
  export type NextToken = string;
  export type ResourceARN = string;
  export type ResourceArn = string;
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     *  The ARN of the Elastic Inference Accelerator to tag. 
     */
    resourceArn: ResourceARN;
    /**
     *  The tags to add to the Elastic Inference Accelerator. 
     */
    tags: TagMap;
  }
  export interface TagResourceResult {
  }
  export type TagValue = string;
  export type ThroughputInfoList = KeyValuePair[];
  export interface UntagResourceRequest {
    /**
     *  The ARN of the Elastic Inference Accelerator to untag. 
     */
    resourceArn: ResourceARN;
    /**
     *  The list of tags to remove from the Elastic Inference Accelerator. 
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResult {
  }
  export type Value = number;
  export type ValueStringList = String[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-07-25"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ElasticInference client.
   */
  export import Types = ElasticInference;
}
export = ElasticInference;
