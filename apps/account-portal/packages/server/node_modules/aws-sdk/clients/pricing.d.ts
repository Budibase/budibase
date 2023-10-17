import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Pricing extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Pricing.Types.ClientConfiguration)
  config: Config & Pricing.Types.ClientConfiguration;
  /**
   * Returns the metadata for one service or a list of the metadata for all services. Use this without a service code to get the service codes for all services. Use it with a service code, such as AmazonEC2, to get information specific to that service, such as the attribute names available for that service. For example, some of the attribute names available for EC2 are volumeType, maxIopsVolume, operation, locationType, and instanceCapacity10xlarge.
   */
  describeServices(params: Pricing.Types.DescribeServicesRequest, callback?: (err: AWSError, data: Pricing.Types.DescribeServicesResponse) => void): Request<Pricing.Types.DescribeServicesResponse, AWSError>;
  /**
   * Returns the metadata for one service or a list of the metadata for all services. Use this without a service code to get the service codes for all services. Use it with a service code, such as AmazonEC2, to get information specific to that service, such as the attribute names available for that service. For example, some of the attribute names available for EC2 are volumeType, maxIopsVolume, operation, locationType, and instanceCapacity10xlarge.
   */
  describeServices(callback?: (err: AWSError, data: Pricing.Types.DescribeServicesResponse) => void): Request<Pricing.Types.DescribeServicesResponse, AWSError>;
  /**
   * Returns a list of attribute values. Attributes are similar to the details in a Price List API offer file. For a list of available attributes, see Offer File Definitions in the Billing and Cost Management User Guide.
   */
  getAttributeValues(params: Pricing.Types.GetAttributeValuesRequest, callback?: (err: AWSError, data: Pricing.Types.GetAttributeValuesResponse) => void): Request<Pricing.Types.GetAttributeValuesResponse, AWSError>;
  /**
   * Returns a list of attribute values. Attributes are similar to the details in a Price List API offer file. For a list of available attributes, see Offer File Definitions in the Billing and Cost Management User Guide.
   */
  getAttributeValues(callback?: (err: AWSError, data: Pricing.Types.GetAttributeValuesResponse) => void): Request<Pricing.Types.GetAttributeValuesResponse, AWSError>;
  /**
   *   This feature is in preview release and is subject to change. Your use of Amazon Web Services Price List API is subject to the Beta Service Participation terms of the Amazon Web Services Service Terms (Section 1.10).   This returns the URL that you can retrieve your Price List file from. This URL is based on the PriceListArn and FileFormat that you retrieve from the ListPriceLists response. 
   */
  getPriceListFileUrl(params: Pricing.Types.GetPriceListFileUrlRequest, callback?: (err: AWSError, data: Pricing.Types.GetPriceListFileUrlResponse) => void): Request<Pricing.Types.GetPriceListFileUrlResponse, AWSError>;
  /**
   *   This feature is in preview release and is subject to change. Your use of Amazon Web Services Price List API is subject to the Beta Service Participation terms of the Amazon Web Services Service Terms (Section 1.10).   This returns the URL that you can retrieve your Price List file from. This URL is based on the PriceListArn and FileFormat that you retrieve from the ListPriceLists response. 
   */
  getPriceListFileUrl(callback?: (err: AWSError, data: Pricing.Types.GetPriceListFileUrlResponse) => void): Request<Pricing.Types.GetPriceListFileUrlResponse, AWSError>;
  /**
   * Returns a list of all products that match the filter criteria.
   */
  getProducts(params: Pricing.Types.GetProductsRequest, callback?: (err: AWSError, data: Pricing.Types.GetProductsResponse) => void): Request<Pricing.Types.GetProductsResponse, AWSError>;
  /**
   * Returns a list of all products that match the filter criteria.
   */
  getProducts(callback?: (err: AWSError, data: Pricing.Types.GetProductsResponse) => void): Request<Pricing.Types.GetProductsResponse, AWSError>;
  /**
   *   This feature is in preview release and is subject to change. Your use of Amazon Web Services Price List API is subject to the Beta Service Participation terms of the Amazon Web Services Service Terms (Section 1.10).   This returns a list of Price List references that the requester if authorized to view, given a ServiceCode, CurrencyCode, and an EffectiveDate. Use without a RegionCode filter to list Price List references from all available Amazon Web Services Regions. Use with a RegionCode filter to get the Price List reference that's specific to a specific Amazon Web Services Region. You can use the PriceListArn from the response to get your preferred Price List files through the GetPriceListFileUrl API.
   */
  listPriceLists(params: Pricing.Types.ListPriceListsRequest, callback?: (err: AWSError, data: Pricing.Types.ListPriceListsResponse) => void): Request<Pricing.Types.ListPriceListsResponse, AWSError>;
  /**
   *   This feature is in preview release and is subject to change. Your use of Amazon Web Services Price List API is subject to the Beta Service Participation terms of the Amazon Web Services Service Terms (Section 1.10).   This returns a list of Price List references that the requester if authorized to view, given a ServiceCode, CurrencyCode, and an EffectiveDate. Use without a RegionCode filter to list Price List references from all available Amazon Web Services Regions. Use with a RegionCode filter to get the Price List reference that's specific to a specific Amazon Web Services Region. You can use the PriceListArn from the response to get your preferred Price List files through the GetPriceListFileUrl API.
   */
  listPriceLists(callback?: (err: AWSError, data: Pricing.Types.ListPriceListsResponse) => void): Request<Pricing.Types.ListPriceListsResponse, AWSError>;
}
declare namespace Pricing {
  export type AttributeNameList = String[];
  export interface AttributeValue {
    /**
     * The specific value of an attributeName.
     */
    Value?: String;
  }
  export type AttributeValueList = AttributeValue[];
  export type BoxedInteger = number;
  export type CurrencyCode = string;
  export interface DescribeServicesRequest {
    /**
     * The code for the service whose information you want to retrieve, such as AmazonEC2. You can use the ServiceCode to filter the results in a GetProducts call. To retrieve a list of all services, leave this blank.
     */
    ServiceCode?: String;
    /**
     * The format version that you want the response to be in. Valid values are: aws_v1 
     */
    FormatVersion?: String;
    /**
     * The pagination token that indicates the next set of results that you want to retrieve.
     */
    NextToken?: String;
    /**
     * The maximum number of results that you want returned in the response.
     */
    MaxResults?: BoxedInteger;
  }
  export interface DescribeServicesResponse {
    /**
     * The service metadata for the service or services in the response.
     */
    Services?: ServiceList;
    /**
     * The format version of the response. For example, aws_v1.
     */
    FormatVersion?: String;
    /**
     * The pagination token for the next set of retrievable results.
     */
    NextToken?: String;
  }
  export type EffectiveDate = Date;
  export type FileFormat = string;
  export type FileFormats = FileFormat[];
  export interface Filter {
    /**
     * The type of filter that you want to use. Valid values are: TERM_MATCH. TERM_MATCH returns only products that match both the given filter field and the given value.
     */
    Type: FilterType;
    /**
     * The product metadata field that you want to filter on. You can filter by just the service code to see all products for a specific service, filter by just the attribute name to see a specific attribute for multiple services, or use both a service code and an attribute name to retrieve only products that match both fields. Valid values include: ServiceCode, and all attribute names For example, you can filter by the AmazonEC2 service code and the volumeType attribute name to get the prices for only Amazon EC2 volumes.
     */
    Field: String;
    /**
     * The service code or attribute value that you want to filter by. If you're filtering by service code this is the actual service code, such as AmazonEC2. If you're filtering by attribute name, this is the attribute value that you want the returned products to match, such as a Provisioned IOPS volume.
     */
    Value: String;
  }
  export type FilterType = "TERM_MATCH"|string;
  export type Filters = Filter[];
  export interface GetAttributeValuesRequest {
    /**
     * The service code for the service whose attributes you want to retrieve. For example, if you want the retrieve an EC2 attribute, use AmazonEC2.
     */
    ServiceCode: String;
    /**
     * The name of the attribute that you want to retrieve the values for, such as volumeType.
     */
    AttributeName: String;
    /**
     * The pagination token that indicates the next set of results that you want to retrieve.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in response.
     */
    MaxResults?: BoxedInteger;
  }
  export interface GetAttributeValuesResponse {
    /**
     * The list of values for an attribute. For example, Throughput Optimized HDD and Provisioned IOPS are two available values for the AmazonEC2 volumeType.
     */
    AttributeValues?: AttributeValueList;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: String;
  }
  export interface GetPriceListFileUrlRequest {
    /**
     * The unique identifier that maps to where your Price List files are located. PriceListArn can be obtained from the ListPriceLists response. 
     */
    PriceListArn: PriceListArn;
    /**
     * The format that you want to retrieve your Price List files in. The FileFormat can be obtained from the ListPriceLists response. 
     */
    FileFormat: FileFormat;
  }
  export interface GetPriceListFileUrlResponse {
    /**
     * The URL to download your Price List file from. 
     */
    Url?: String;
  }
  export interface GetProductsRequest {
    /**
     * The code for the service whose products you want to retrieve. 
     */
    ServiceCode: String;
    /**
     * The list of filters that limit the returned products. only products that match all filters are returned.
     */
    Filters?: Filters;
    /**
     * The format version that you want the response to be in. Valid values are: aws_v1 
     */
    FormatVersion?: String;
    /**
     * The pagination token that indicates the next set of results that you want to retrieve.
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: BoxedInteger;
  }
  export interface GetProductsResponse {
    /**
     * The format version of the response. For example, aws_v1.
     */
    FormatVersion?: String;
    /**
     * The list of products that match your filters. The list contains both the product metadata and the price information.
     */
    PriceList?: PriceListJsonItems;
    /**
     * The pagination token that indicates the next set of results to retrieve.
     */
    NextToken?: String;
  }
  export interface ListPriceListsRequest {
    /**
     * The service code or the Savings Plan service code for the attributes that you want to retrieve. For example, to get the list of applicable Amazon EC2 price lists, use AmazonEC2. For a full list of service codes containing On-Demand and Reserved Instance (RI) pricing, use the DescribeServices API. To retrieve the Reserved Instance and Compute Savings Plan price lists, use ComputeSavingsPlans.  To retrieve Machine Learning Savings Plans price lists, use MachineLearningSavingsPlans. 
     */
    ServiceCode: ServiceCode;
    /**
     * The date that the Price List file prices are effective from. 
     */
    EffectiveDate: EffectiveDate;
    /**
     * This is used to filter the Price List by Amazon Web Services Region. For example, to get the price list only for the US East (N. Virginia) Region, use us-east-1. If nothing is specified, you retrieve price lists for all applicable Regions. The available RegionCode list can be retrieved from GetAttributeValues API.
     */
    RegionCode?: RegionCode;
    /**
     * The three alphabetical character ISO-4217 currency code that the Price List files are denominated in. 
     */
    CurrencyCode: CurrencyCode;
    /**
     * The pagination token that indicates the next set of results that you want to retrieve. 
     */
    NextToken?: String;
    /**
     * The maximum number of results to return in the response. 
     */
    MaxResults?: MaxResults;
  }
  export interface ListPriceListsResponse {
    /**
     * The type of price list references that match your request. 
     */
    PriceLists?: PriceLists;
    /**
     * The pagination token that indicates the next set of results to retrieve. 
     */
    NextToken?: String;
  }
  export type MaxResults = number;
  export interface PriceList {
    /**
     * The unique identifier that maps to where your Price List files are located. PriceListArn can be obtained from the  ListPriceList  response. 
     */
    PriceListArn?: PriceListArn;
    /**
     * This is used to filter the Price List by Amazon Web Services Region. For example, to get the price list only for the US East (N. Virginia) Region, use us-east-1. If nothing is specified, you retrieve price lists for all applicable Regions. The available RegionCode list can be retrieved from  GetAttributeValues  API. 
     */
    RegionCode?: RegionCode;
    /**
     * The three alphabetical character ISO-4217 currency code the Price List files are denominated in. 
     */
    CurrencyCode?: CurrencyCode;
    /**
     * The format you want to retrieve your Price List files. The FileFormat can be obtained from the  ListPriceList  response. 
     */
    FileFormats?: FileFormats;
  }
  export type PriceListArn = string;
  export type PriceListJsonItems = SynthesizedJsonPriceListJsonItem[];
  export type PriceLists = PriceList[];
  export type RegionCode = string;
  export interface Service {
    /**
     * The code for the Amazon Web Services service.
     */
    ServiceCode: String;
    /**
     * The attributes that are available for this service.
     */
    AttributeNames?: AttributeNameList;
  }
  export type ServiceCode = string;
  export type ServiceList = Service[];
  export type String = string;
  export type SynthesizedJsonPriceListJsonItem = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-10-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Pricing client.
   */
  export import Types = Pricing;
}
export = Pricing;
