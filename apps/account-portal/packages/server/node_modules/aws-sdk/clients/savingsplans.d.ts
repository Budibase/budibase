import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SavingsPlans extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SavingsPlans.Types.ClientConfiguration)
  config: Config & SavingsPlans.Types.ClientConfiguration;
  /**
   * Creates a Savings Plan.
   */
  createSavingsPlan(params: SavingsPlans.Types.CreateSavingsPlanRequest, callback?: (err: AWSError, data: SavingsPlans.Types.CreateSavingsPlanResponse) => void): Request<SavingsPlans.Types.CreateSavingsPlanResponse, AWSError>;
  /**
   * Creates a Savings Plan.
   */
  createSavingsPlan(callback?: (err: AWSError, data: SavingsPlans.Types.CreateSavingsPlanResponse) => void): Request<SavingsPlans.Types.CreateSavingsPlanResponse, AWSError>;
  /**
   * Deletes the queued purchase for the specified Savings Plan.
   */
  deleteQueuedSavingsPlan(params: SavingsPlans.Types.DeleteQueuedSavingsPlanRequest, callback?: (err: AWSError, data: SavingsPlans.Types.DeleteQueuedSavingsPlanResponse) => void): Request<SavingsPlans.Types.DeleteQueuedSavingsPlanResponse, AWSError>;
  /**
   * Deletes the queued purchase for the specified Savings Plan.
   */
  deleteQueuedSavingsPlan(callback?: (err: AWSError, data: SavingsPlans.Types.DeleteQueuedSavingsPlanResponse) => void): Request<SavingsPlans.Types.DeleteQueuedSavingsPlanResponse, AWSError>;
  /**
   * Describes the specified Savings Plans rates.
   */
  describeSavingsPlanRates(params: SavingsPlans.Types.DescribeSavingsPlanRatesRequest, callback?: (err: AWSError, data: SavingsPlans.Types.DescribeSavingsPlanRatesResponse) => void): Request<SavingsPlans.Types.DescribeSavingsPlanRatesResponse, AWSError>;
  /**
   * Describes the specified Savings Plans rates.
   */
  describeSavingsPlanRates(callback?: (err: AWSError, data: SavingsPlans.Types.DescribeSavingsPlanRatesResponse) => void): Request<SavingsPlans.Types.DescribeSavingsPlanRatesResponse, AWSError>;
  /**
   * Describes the specified Savings Plans.
   */
  describeSavingsPlans(params: SavingsPlans.Types.DescribeSavingsPlansRequest, callback?: (err: AWSError, data: SavingsPlans.Types.DescribeSavingsPlansResponse) => void): Request<SavingsPlans.Types.DescribeSavingsPlansResponse, AWSError>;
  /**
   * Describes the specified Savings Plans.
   */
  describeSavingsPlans(callback?: (err: AWSError, data: SavingsPlans.Types.DescribeSavingsPlansResponse) => void): Request<SavingsPlans.Types.DescribeSavingsPlansResponse, AWSError>;
  /**
   * Describes the specified Savings Plans offering rates.
   */
  describeSavingsPlansOfferingRates(params: SavingsPlans.Types.DescribeSavingsPlansOfferingRatesRequest, callback?: (err: AWSError, data: SavingsPlans.Types.DescribeSavingsPlansOfferingRatesResponse) => void): Request<SavingsPlans.Types.DescribeSavingsPlansOfferingRatesResponse, AWSError>;
  /**
   * Describes the specified Savings Plans offering rates.
   */
  describeSavingsPlansOfferingRates(callback?: (err: AWSError, data: SavingsPlans.Types.DescribeSavingsPlansOfferingRatesResponse) => void): Request<SavingsPlans.Types.DescribeSavingsPlansOfferingRatesResponse, AWSError>;
  /**
   * Describes the specified Savings Plans offerings.
   */
  describeSavingsPlansOfferings(params: SavingsPlans.Types.DescribeSavingsPlansOfferingsRequest, callback?: (err: AWSError, data: SavingsPlans.Types.DescribeSavingsPlansOfferingsResponse) => void): Request<SavingsPlans.Types.DescribeSavingsPlansOfferingsResponse, AWSError>;
  /**
   * Describes the specified Savings Plans offerings.
   */
  describeSavingsPlansOfferings(callback?: (err: AWSError, data: SavingsPlans.Types.DescribeSavingsPlansOfferingsResponse) => void): Request<SavingsPlans.Types.DescribeSavingsPlansOfferingsResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(params: SavingsPlans.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: SavingsPlans.Types.ListTagsForResourceResponse) => void): Request<SavingsPlans.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists the tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: SavingsPlans.Types.ListTagsForResourceResponse) => void): Request<SavingsPlans.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource.
   */
  tagResource(params: SavingsPlans.Types.TagResourceRequest, callback?: (err: AWSError, data: SavingsPlans.Types.TagResourceResponse) => void): Request<SavingsPlans.Types.TagResourceResponse, AWSError>;
  /**
   * Adds the specified tags to the specified resource.
   */
  tagResource(callback?: (err: AWSError, data: SavingsPlans.Types.TagResourceResponse) => void): Request<SavingsPlans.Types.TagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(params: SavingsPlans.Types.UntagResourceRequest, callback?: (err: AWSError, data: SavingsPlans.Types.UntagResourceResponse) => void): Request<SavingsPlans.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes the specified tags from the specified resource.
   */
  untagResource(callback?: (err: AWSError, data: SavingsPlans.Types.UntagResourceResponse) => void): Request<SavingsPlans.Types.UntagResourceResponse, AWSError>;
}
declare namespace SavingsPlans {
  export type Amount = string;
  export type ClientToken = string;
  export interface CreateSavingsPlanRequest {
    /**
     * The ID of the offering.
     */
    savingsPlanOfferingId: SavingsPlanOfferingId;
    /**
     * The hourly commitment, in USD. This is a value between 0.001 and 1 million. You cannot specify more than five digits after the decimal point.
     */
    commitment: Amount;
    /**
     * The up-front payment amount. This is a whole number between 50 and 99 percent of the total value of the Savings Plan. This parameter is supported only if the payment option is Partial Upfront.
     */
    upfrontPaymentAmount?: Amount;
    /**
     * The time at which to purchase the Savings Plan, in UTC format (YYYY-MM-DDTHH:MM:SSZ).
     */
    purchaseTime?: DateTime;
    /**
     * Unique, case-sensitive identifier that you provide to ensure the idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * One or more tags.
     */
    tags?: TagMap;
  }
  export interface CreateSavingsPlanResponse {
    /**
     * The ID of the Savings Plan.
     */
    savingsPlanId?: SavingsPlanId;
  }
  export type CurrencyCode = "CNY"|"USD"|string;
  export type CurrencyList = CurrencyCode[];
  export type DateTime = Date;
  export interface DeleteQueuedSavingsPlanRequest {
    /**
     * The ID of the Savings Plan.
     */
    savingsPlanId: SavingsPlanId;
  }
  export interface DeleteQueuedSavingsPlanResponse {
  }
  export interface DescribeSavingsPlanRatesRequest {
    /**
     * The ID of the Savings Plan.
     */
    savingsPlanId: SavingsPlanId;
    /**
     * The filters.
     */
    filters?: SavingsPlanRateFilterList;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results to return with a single call. To retrieve additional results, make another call with the returned token value.
     */
    maxResults?: MaxResults;
  }
  export interface DescribeSavingsPlanRatesResponse {
    /**
     * The ID of the Savings Plan.
     */
    savingsPlanId?: SavingsPlanId;
    /**
     * Information about the Savings Plans rates.
     */
    searchResults?: SavingsPlanRateList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return. 
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeSavingsPlansOfferingRatesRequest {
    /**
     * The IDs of the offerings.
     */
    savingsPlanOfferingIds?: UUIDs;
    /**
     * The payment options.
     */
    savingsPlanPaymentOptions?: SavingsPlanPaymentOptionList;
    /**
     * The plan types.
     */
    savingsPlanTypes?: SavingsPlanTypeList;
    /**
     * The AWS products.
     */
    products?: SavingsPlanProductTypeList;
    /**
     * The services.
     */
    serviceCodes?: SavingsPlanRateServiceCodeList;
    /**
     * The usage details of the line item in the billing report.
     */
    usageTypes?: SavingsPlanRateUsageTypeList;
    /**
     * The specific AWS operation for the line item in the billing report.
     */
    operations?: SavingsPlanRateOperationList;
    /**
     * The filters.
     */
    filters?: SavingsPlanOfferingRateFiltersList;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results to return with a single call. To retrieve additional results, make another call with the returned token value.
     */
    maxResults?: PageSize;
  }
  export interface DescribeSavingsPlansOfferingRatesResponse {
    /**
     * Information about the Savings Plans offering rates.
     */
    searchResults?: SavingsPlanOfferingRatesList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeSavingsPlansOfferingsRequest {
    /**
     * The IDs of the offerings.
     */
    offeringIds?: UUIDs;
    /**
     * The payment options.
     */
    paymentOptions?: SavingsPlanPaymentOptionList;
    /**
     * The product type.
     */
    productType?: SavingsPlanProductType;
    /**
     * The plan type.
     */
    planTypes?: SavingsPlanTypeList;
    /**
     * The durations, in seconds.
     */
    durations?: DurationsList;
    /**
     * The currencies.
     */
    currencies?: CurrencyList;
    /**
     * The descriptions.
     */
    descriptions?: SavingsPlanDescriptionsList;
    /**
     * The services.
     */
    serviceCodes?: SavingsPlanServiceCodeList;
    /**
     * The usage details of the line item in the billing report.
     */
    usageTypes?: SavingsPlanUsageTypeList;
    /**
     * The specific AWS operation for the line item in the billing report.
     */
    operations?: SavingsPlanOperationList;
    /**
     * The filters.
     */
    filters?: SavingsPlanOfferingFiltersList;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results to return with a single call. To retrieve additional results, make another call with the returned token value.
     */
    maxResults?: PageSize;
  }
  export interface DescribeSavingsPlansOfferingsResponse {
    /**
     * Information about the Savings Plans offerings.
     */
    searchResults?: SavingsPlanOfferingsList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export interface DescribeSavingsPlansRequest {
    /**
     * The Amazon Resource Names (ARN) of the Savings Plans.
     */
    savingsPlanArns?: SavingsPlanArnList;
    /**
     * The IDs of the Savings Plans.
     */
    savingsPlanIds?: SavingsPlanIdList;
    /**
     * The token for the next page of results.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results to return with a single call. To retrieve additional results, make another call with the returned token value.
     */
    maxResults?: MaxResults;
    /**
     * The states.
     */
    states?: SavingsPlanStateList;
    /**
     * The filters.
     */
    filters?: SavingsPlanFilterList;
  }
  export interface DescribeSavingsPlansResponse {
    /**
     * Information about the Savings Plans.
     */
    savingsPlans?: SavingsPlanList;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: PaginationToken;
  }
  export type DurationsList = SavingsPlansDuration[];
  export type EC2InstanceFamily = string;
  export type FilterValuesList = JsonSafeFilterValueString[];
  export type JsonSafeFilterValueString = string;
  export type ListOfStrings = String[];
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: SavingsPlanArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * Information about the tags.
     */
    tags?: TagMap;
  }
  export type MaxResults = number;
  export type PageSize = number;
  export type PaginationToken = string;
  export interface ParentSavingsPlanOffering {
    /**
     * The ID of the offering.
     */
    offeringId?: UUID;
    /**
     * The payment option.
     */
    paymentOption?: SavingsPlanPaymentOption;
    /**
     * The plan type.
     */
    planType?: SavingsPlanType;
    /**
     * The duration, in seconds.
     */
    durationSeconds?: SavingsPlansDuration;
    /**
     * The currency.
     */
    currency?: CurrencyCode;
    /**
     * The description.
     */
    planDescription?: SavingsPlanDescription;
  }
  export type Region = string;
  export interface SavingsPlan {
    /**
     * The ID of the offering.
     */
    offeringId?: SavingsPlanOfferingId;
    /**
     * The ID of the Savings Plan.
     */
    savingsPlanId?: SavingsPlanId;
    /**
     * The Amazon Resource Name (ARN) of the Savings Plan.
     */
    savingsPlanArn?: SavingsPlanArn;
    /**
     * The description.
     */
    description?: String;
    /**
     * The start time.
     */
    start?: String;
    /**
     * The end time.
     */
    end?: String;
    /**
     * The state.
     */
    state?: SavingsPlanState;
    /**
     * The AWS Region.
     */
    region?: Region;
    /**
     * The EC2 instance family.
     */
    ec2InstanceFamily?: EC2InstanceFamily;
    /**
     * The plan type.
     */
    savingsPlanType?: SavingsPlanType;
    /**
     * The payment option.
     */
    paymentOption?: SavingsPlanPaymentOption;
    /**
     * The product types.
     */
    productTypes?: SavingsPlanProductTypeList;
    /**
     * The currency.
     */
    currency?: CurrencyCode;
    /**
     * The hourly commitment, in USD.
     */
    commitment?: Amount;
    /**
     * The up-front payment amount.
     */
    upfrontPaymentAmount?: Amount;
    /**
     * The recurring payment amount.
     */
    recurringPaymentAmount?: Amount;
    /**
     * The duration of the term, in seconds.
     */
    termDurationInSeconds?: TermDurationInSeconds;
    /**
     * One or more tags.
     */
    tags?: TagMap;
  }
  export type SavingsPlanArn = string;
  export type SavingsPlanArnList = SavingsPlanArn[];
  export type SavingsPlanDescription = string;
  export type SavingsPlanDescriptionsList = SavingsPlanDescription[];
  export interface SavingsPlanFilter {
    /**
     * The filter name.
     */
    name?: SavingsPlansFilterName;
    /**
     * The filter value.
     */
    values?: ListOfStrings;
  }
  export type SavingsPlanFilterList = SavingsPlanFilter[];
  export type SavingsPlanId = string;
  export type SavingsPlanIdList = SavingsPlanId[];
  export type SavingsPlanList = SavingsPlan[];
  export interface SavingsPlanOffering {
    /**
     * The ID of the offering.
     */
    offeringId?: UUID;
    /**
     * The product type.
     */
    productTypes?: SavingsPlanProductTypeList;
    /**
     * The plan type.
     */
    planType?: SavingsPlanType;
    /**
     * The description.
     */
    description?: SavingsPlanDescription;
    /**
     * The payment option.
     */
    paymentOption?: SavingsPlanPaymentOption;
    /**
     * The duration, in seconds.
     */
    durationSeconds?: SavingsPlansDuration;
    /**
     * The currency.
     */
    currency?: CurrencyCode;
    /**
     * The service.
     */
    serviceCode?: SavingsPlanServiceCode;
    /**
     * The usage details of the line item in the billing report.
     */
    usageType?: SavingsPlanUsageType;
    /**
     * The specific AWS operation for the line item in the billing report.
     */
    operation?: SavingsPlanOperation;
    /**
     * The properties.
     */
    properties?: SavingsPlanOfferingPropertyList;
  }
  export type SavingsPlanOfferingFilterAttribute = "region"|"instanceFamily"|string;
  export interface SavingsPlanOfferingFilterElement {
    /**
     * The filter name.
     */
    name?: SavingsPlanOfferingFilterAttribute;
    /**
     * The filter values.
     */
    values?: FilterValuesList;
  }
  export type SavingsPlanOfferingFiltersList = SavingsPlanOfferingFilterElement[];
  export type SavingsPlanOfferingId = string;
  export interface SavingsPlanOfferingProperty {
    /**
     * The property name.
     */
    name?: SavingsPlanOfferingPropertyKey;
    /**
     * The property value.
     */
    value?: JsonSafeFilterValueString;
  }
  export type SavingsPlanOfferingPropertyKey = "region"|"instanceFamily"|string;
  export type SavingsPlanOfferingPropertyList = SavingsPlanOfferingProperty[];
  export interface SavingsPlanOfferingRate {
    /**
     * The Savings Plan offering.
     */
    savingsPlanOffering?: ParentSavingsPlanOffering;
    /**
     * The Savings Plan rate.
     */
    rate?: SavingsPlanRatePricePerUnit;
    /**
     * The unit.
     */
    unit?: SavingsPlanRateUnit;
    /**
     * The product type.
     */
    productType?: SavingsPlanProductType;
    /**
     * The service.
     */
    serviceCode?: SavingsPlanRateServiceCode;
    /**
     * The usage details of the line item in the billing report.
     */
    usageType?: SavingsPlanRateUsageType;
    /**
     * The specific AWS operation for the line item in the billing report.
     */
    operation?: SavingsPlanRateOperation;
    /**
     * The properties.
     */
    properties?: SavingsPlanOfferingRatePropertyList;
  }
  export interface SavingsPlanOfferingRateFilterElement {
    /**
     * The filter name.
     */
    name?: SavingsPlanRateFilterAttribute;
    /**
     * The filter values.
     */
    values?: FilterValuesList;
  }
  export type SavingsPlanOfferingRateFiltersList = SavingsPlanOfferingRateFilterElement[];
  export interface SavingsPlanOfferingRateProperty {
    /**
     * The property name.
     */
    name?: JsonSafeFilterValueString;
    /**
     * The property value.
     */
    value?: JsonSafeFilterValueString;
  }
  export type SavingsPlanOfferingRatePropertyList = SavingsPlanOfferingRateProperty[];
  export type SavingsPlanOfferingRatesList = SavingsPlanOfferingRate[];
  export type SavingsPlanOfferingsList = SavingsPlanOffering[];
  export type SavingsPlanOperation = string;
  export type SavingsPlanOperationList = SavingsPlanOperation[];
  export type SavingsPlanPaymentOption = "All Upfront"|"Partial Upfront"|"No Upfront"|string;
  export type SavingsPlanPaymentOptionList = SavingsPlanPaymentOption[];
  export type SavingsPlanProductType = "EC2"|"Fargate"|"Lambda"|"SageMaker"|string;
  export type SavingsPlanProductTypeList = SavingsPlanProductType[];
  export interface SavingsPlanRate {
    /**
     * The rate.
     */
    rate?: Amount;
    /**
     * The currency.
     */
    currency?: CurrencyCode;
    /**
     * The unit.
     */
    unit?: SavingsPlanRateUnit;
    /**
     * The product type.
     */
    productType?: SavingsPlanProductType;
    /**
     * The service.
     */
    serviceCode?: SavingsPlanRateServiceCode;
    /**
     * The usage details of the line item in the billing report.
     */
    usageType?: SavingsPlanRateUsageType;
    /**
     * The specific AWS operation for the line item in the billing report.
     */
    operation?: SavingsPlanRateOperation;
    /**
     * The properties.
     */
    properties?: SavingsPlanRatePropertyList;
  }
  export interface SavingsPlanRateFilter {
    /**
     * The filter name.
     */
    name?: SavingsPlanRateFilterName;
    /**
     * The filter values.
     */
    values?: ListOfStrings;
  }
  export type SavingsPlanRateFilterAttribute = "region"|"instanceFamily"|"instanceType"|"productDescription"|"tenancy"|"productId"|string;
  export type SavingsPlanRateFilterList = SavingsPlanRateFilter[];
  export type SavingsPlanRateFilterName = "region"|"instanceType"|"productDescription"|"tenancy"|"productType"|"serviceCode"|"usageType"|"operation"|string;
  export type SavingsPlanRateList = SavingsPlanRate[];
  export type SavingsPlanRateOperation = string;
  export type SavingsPlanRateOperationList = SavingsPlanRateOperation[];
  export type SavingsPlanRatePricePerUnit = string;
  export interface SavingsPlanRateProperty {
    /**
     * The property name.
     */
    name?: SavingsPlanRatePropertyKey;
    /**
     * The property value.
     */
    value?: JsonSafeFilterValueString;
  }
  export type SavingsPlanRatePropertyKey = "region"|"instanceType"|"instanceFamily"|"productDescription"|"tenancy"|string;
  export type SavingsPlanRatePropertyList = SavingsPlanRateProperty[];
  export type SavingsPlanRateServiceCode = "AmazonEC2"|"AmazonECS"|"AmazonEKS"|"AWSLambda"|"AmazonSageMaker"|string;
  export type SavingsPlanRateServiceCodeList = SavingsPlanRateServiceCode[];
  export type SavingsPlanRateUnit = "Hrs"|"Lambda-GB-Second"|"Request"|string;
  export type SavingsPlanRateUsageType = string;
  export type SavingsPlanRateUsageTypeList = SavingsPlanRateUsageType[];
  export type SavingsPlanServiceCode = string;
  export type SavingsPlanServiceCodeList = SavingsPlanServiceCode[];
  export type SavingsPlanState = "payment-pending"|"payment-failed"|"active"|"retired"|"queued"|"queued-deleted"|string;
  export type SavingsPlanStateList = SavingsPlanState[];
  export type SavingsPlanType = "Compute"|"EC2Instance"|"SageMaker"|string;
  export type SavingsPlanTypeList = SavingsPlanType[];
  export type SavingsPlanUsageType = string;
  export type SavingsPlanUsageTypeList = SavingsPlanUsageType[];
  export type SavingsPlansDuration = number;
  export type SavingsPlansFilterName = "region"|"ec2-instance-family"|"commitment"|"upfront"|"term"|"savings-plan-type"|"payment-option"|"start"|"end"|string;
  export type String = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: SavingsPlanArn;
    /**
     * One or more tags. For example, { "tags": {"key1":"value1", "key2":"value2"} }.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type TermDurationInSeconds = number;
  export type UUID = string;
  export type UUIDs = UUID[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource.
     */
    resourceArn: SavingsPlanArn;
    /**
     * The tag keys.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-06-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SavingsPlans client.
   */
  export import Types = SavingsPlans;
}
export = SavingsPlans;
