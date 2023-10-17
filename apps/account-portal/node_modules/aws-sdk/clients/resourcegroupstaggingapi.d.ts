import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ResourceGroupsTaggingAPI extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ResourceGroupsTaggingAPI.Types.ClientConfiguration)
  config: Config & ResourceGroupsTaggingAPI.Types.ClientConfiguration;
  /**
   * Describes the status of the StartReportCreation operation.  You can call this operation only from the organization's management account and from the us-east-1 Region.
   */
  describeReportCreation(params: ResourceGroupsTaggingAPI.Types.DescribeReportCreationInput, callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.DescribeReportCreationOutput) => void): Request<ResourceGroupsTaggingAPI.Types.DescribeReportCreationOutput, AWSError>;
  /**
   * Describes the status of the StartReportCreation operation.  You can call this operation only from the organization's management account and from the us-east-1 Region.
   */
  describeReportCreation(callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.DescribeReportCreationOutput) => void): Request<ResourceGroupsTaggingAPI.Types.DescribeReportCreationOutput, AWSError>;
  /**
   * Returns a table that shows counts of resources that are noncompliant with their tag policies. For more information on tag policies, see Tag Policies in the AWS Organizations User Guide.  You can call this operation only from the organization's management account and from the us-east-1 Region. This operation supports pagination, where the response can be sent in multiple pages. You should check the PaginationToken response parameter to determine if there are additional results available to return. Repeat the query, passing the PaginationToken response parameter value as an input to the next request until you recieve a null value. A null value for PaginationToken indicates that there are no more results waiting to be returned.
   */
  getComplianceSummary(params: ResourceGroupsTaggingAPI.Types.GetComplianceSummaryInput, callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.GetComplianceSummaryOutput) => void): Request<ResourceGroupsTaggingAPI.Types.GetComplianceSummaryOutput, AWSError>;
  /**
   * Returns a table that shows counts of resources that are noncompliant with their tag policies. For more information on tag policies, see Tag Policies in the AWS Organizations User Guide.  You can call this operation only from the organization's management account and from the us-east-1 Region. This operation supports pagination, where the response can be sent in multiple pages. You should check the PaginationToken response parameter to determine if there are additional results available to return. Repeat the query, passing the PaginationToken response parameter value as an input to the next request until you recieve a null value. A null value for PaginationToken indicates that there are no more results waiting to be returned.
   */
  getComplianceSummary(callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.GetComplianceSummaryOutput) => void): Request<ResourceGroupsTaggingAPI.Types.GetComplianceSummaryOutput, AWSError>;
  /**
   * Returns all the tagged or previously tagged resources that are located in the specified Region for the AWS account. Depending on what information you want returned, you can also specify the following:    Filters that specify what tags and resource types you want returned. The response includes all tags that are associated with the requested resources.   Information about compliance with the account's effective tag policy. For more information on tag policies, see Tag Policies in the AWS Organizations User Guide.    This operation supports pagination, where the response can be sent in multiple pages. You should check the PaginationToken response parameter to determine if there are additional results available to return. Repeat the query, passing the PaginationToken response parameter value as an input to the next request until you recieve a null value. A null value for PaginationToken indicates that there are no more results waiting to be returned.
   */
  getResources(params: ResourceGroupsTaggingAPI.Types.GetResourcesInput, callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.GetResourcesOutput) => void): Request<ResourceGroupsTaggingAPI.Types.GetResourcesOutput, AWSError>;
  /**
   * Returns all the tagged or previously tagged resources that are located in the specified Region for the AWS account. Depending on what information you want returned, you can also specify the following:    Filters that specify what tags and resource types you want returned. The response includes all tags that are associated with the requested resources.   Information about compliance with the account's effective tag policy. For more information on tag policies, see Tag Policies in the AWS Organizations User Guide.    This operation supports pagination, where the response can be sent in multiple pages. You should check the PaginationToken response parameter to determine if there are additional results available to return. Repeat the query, passing the PaginationToken response parameter value as an input to the next request until you recieve a null value. A null value for PaginationToken indicates that there are no more results waiting to be returned.
   */
  getResources(callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.GetResourcesOutput) => void): Request<ResourceGroupsTaggingAPI.Types.GetResourcesOutput, AWSError>;
  /**
   * Returns all tag keys currently in use in the specified Region for the calling AWS account. This operation supports pagination, where the response can be sent in multiple pages. You should check the PaginationToken response parameter to determine if there are additional results available to return. Repeat the query, passing the PaginationToken response parameter value as an input to the next request until you recieve a null value. A null value for PaginationToken indicates that there are no more results waiting to be returned.
   */
  getTagKeys(params: ResourceGroupsTaggingAPI.Types.GetTagKeysInput, callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.GetTagKeysOutput) => void): Request<ResourceGroupsTaggingAPI.Types.GetTagKeysOutput, AWSError>;
  /**
   * Returns all tag keys currently in use in the specified Region for the calling AWS account. This operation supports pagination, where the response can be sent in multiple pages. You should check the PaginationToken response parameter to determine if there are additional results available to return. Repeat the query, passing the PaginationToken response parameter value as an input to the next request until you recieve a null value. A null value for PaginationToken indicates that there are no more results waiting to be returned.
   */
  getTagKeys(callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.GetTagKeysOutput) => void): Request<ResourceGroupsTaggingAPI.Types.GetTagKeysOutput, AWSError>;
  /**
   * Returns all tag values for the specified key that are used in the specified AWS Region for the calling AWS account. This operation supports pagination, where the response can be sent in multiple pages. You should check the PaginationToken response parameter to determine if there are additional results available to return. Repeat the query, passing the PaginationToken response parameter value as an input to the next request until you recieve a null value. A null value for PaginationToken indicates that there are no more results waiting to be returned.
   */
  getTagValues(params: ResourceGroupsTaggingAPI.Types.GetTagValuesInput, callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.GetTagValuesOutput) => void): Request<ResourceGroupsTaggingAPI.Types.GetTagValuesOutput, AWSError>;
  /**
   * Returns all tag values for the specified key that are used in the specified AWS Region for the calling AWS account. This operation supports pagination, where the response can be sent in multiple pages. You should check the PaginationToken response parameter to determine if there are additional results available to return. Repeat the query, passing the PaginationToken response parameter value as an input to the next request until you recieve a null value. A null value for PaginationToken indicates that there are no more results waiting to be returned.
   */
  getTagValues(callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.GetTagValuesOutput) => void): Request<ResourceGroupsTaggingAPI.Types.GetTagValuesOutput, AWSError>;
  /**
   * Generates a report that lists all tagged resources in the accounts across your organization and tells whether each resource is compliant with the effective tag policy. Compliance data is refreshed daily. The report is generated asynchronously. The generated report is saved to the following location:  s3://example-bucket/AwsTagPolicies/o-exampleorgid/YYYY-MM-ddTHH:mm:ssZ/report.csv  You can call this operation only from the organization's management account and from the us-east-1 Region.
   */
  startReportCreation(params: ResourceGroupsTaggingAPI.Types.StartReportCreationInput, callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.StartReportCreationOutput) => void): Request<ResourceGroupsTaggingAPI.Types.StartReportCreationOutput, AWSError>;
  /**
   * Generates a report that lists all tagged resources in the accounts across your organization and tells whether each resource is compliant with the effective tag policy. Compliance data is refreshed daily. The report is generated asynchronously. The generated report is saved to the following location:  s3://example-bucket/AwsTagPolicies/o-exampleorgid/YYYY-MM-ddTHH:mm:ssZ/report.csv  You can call this operation only from the organization's management account and from the us-east-1 Region.
   */
  startReportCreation(callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.StartReportCreationOutput) => void): Request<ResourceGroupsTaggingAPI.Types.StartReportCreationOutput, AWSError>;
  /**
   * Applies one or more tags to the specified resources. Note the following:   Not all resources can have tags. For a list of services with resources that support tagging using this operation, see Services that support the Resource Groups Tagging API.   Each resource can have up to 50 tags. For other limits, see Tag Naming and Usage Conventions in the AWS General Reference.    You can only tag resources that are located in the specified AWS Region for the AWS account.   To add tags to a resource, you need the necessary permissions for the service that the resource belongs to as well as permissions for adding tags. For more information, see the documentation for each service.    Do not store personally identifiable information (PII) or other confidential or sensitive information in tags. We use tags to provide you with billing and administration services. Tags are not intended to be used for private or sensitive data. 
   */
  tagResources(params: ResourceGroupsTaggingAPI.Types.TagResourcesInput, callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.TagResourcesOutput) => void): Request<ResourceGroupsTaggingAPI.Types.TagResourcesOutput, AWSError>;
  /**
   * Applies one or more tags to the specified resources. Note the following:   Not all resources can have tags. For a list of services with resources that support tagging using this operation, see Services that support the Resource Groups Tagging API.   Each resource can have up to 50 tags. For other limits, see Tag Naming and Usage Conventions in the AWS General Reference.    You can only tag resources that are located in the specified AWS Region for the AWS account.   To add tags to a resource, you need the necessary permissions for the service that the resource belongs to as well as permissions for adding tags. For more information, see the documentation for each service.    Do not store personally identifiable information (PII) or other confidential or sensitive information in tags. We use tags to provide you with billing and administration services. Tags are not intended to be used for private or sensitive data. 
   */
  tagResources(callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.TagResourcesOutput) => void): Request<ResourceGroupsTaggingAPI.Types.TagResourcesOutput, AWSError>;
  /**
   * Removes the specified tags from the specified resources. When you specify a tag key, the action removes both that key and its associated value. The operation succeeds even if you attempt to remove tags from a resource that were already removed. Note the following:   To remove tags from a resource, you need the necessary permissions for the service that the resource belongs to as well as permissions for removing tags. For more information, see the documentation for the service whose resource you want to untag.   You can only tag resources that are located in the specified AWS Region for the calling AWS account.  
   */
  untagResources(params: ResourceGroupsTaggingAPI.Types.UntagResourcesInput, callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.UntagResourcesOutput) => void): Request<ResourceGroupsTaggingAPI.Types.UntagResourcesOutput, AWSError>;
  /**
   * Removes the specified tags from the specified resources. When you specify a tag key, the action removes both that key and its associated value. The operation succeeds even if you attempt to remove tags from a resource that were already removed. Note the following:   To remove tags from a resource, you need the necessary permissions for the service that the resource belongs to as well as permissions for removing tags. For more information, see the documentation for the service whose resource you want to untag.   You can only tag resources that are located in the specified AWS Region for the calling AWS account.  
   */
  untagResources(callback?: (err: AWSError, data: ResourceGroupsTaggingAPI.Types.UntagResourcesOutput) => void): Request<ResourceGroupsTaggingAPI.Types.UntagResourcesOutput, AWSError>;
}
declare namespace ResourceGroupsTaggingAPI {
  export type AmazonResourceType = string;
  export interface ComplianceDetails {
    /**
     * These tag keys on the resource are noncompliant with the effective tag policy.
     */
    NoncompliantKeys?: TagKeyList;
    /**
     * These are keys defined in the effective policy that are on the resource with either incorrect case treatment or noncompliant values. 
     */
    KeysWithNoncompliantValues?: TagKeyList;
    /**
     * Whether a resource is compliant with the effective tag policy.
     */
    ComplianceStatus?: ComplianceStatus;
  }
  export type ComplianceStatus = boolean;
  export interface DescribeReportCreationInput {
  }
  export interface DescribeReportCreationOutput {
    /**
     * Reports the status of the operation. The operation status can be one of the following:    RUNNING - Report creation is in progress.    SUCCEEDED - Report creation is complete. You can open the report from the Amazon S3 bucket that you specified when you ran StartReportCreation.    FAILED - Report creation timed out or the Amazon S3 bucket is not accessible.     NO REPORT - No report was generated in the last 90 days.  
     */
    Status?: Status;
    /**
     * The path to the Amazon S3 bucket where the report was stored on creation.
     */
    S3Location?: S3Location;
    /**
     * Details of the common errors that all operations return.
     */
    ErrorMessage?: ErrorMessage;
  }
  export type ErrorCode = "InternalServiceException"|"InvalidParameterException"|string;
  export type ErrorMessage = string;
  export type ExcludeCompliantResources = boolean;
  export type FailedResourcesMap = {[key: string]: FailureInfo};
  export interface FailureInfo {
    /**
     * The HTTP status code of the common error.
     */
    StatusCode?: StatusCode;
    /**
     * The code of the common error. Valid values include InternalServiceException, InvalidParameterException, and any valid error code returned by the AWS service that hosts the resource that you want to tag.
     */
    ErrorCode?: ErrorCode;
    /**
     * The message of the common error.
     */
    ErrorMessage?: ErrorMessage;
  }
  export interface GetComplianceSummaryInput {
    /**
     * Specifies target identifiers (usually, specific account IDs) to limit the output by. If you use this parameter, the count of returned noncompliant resources includes only resources with the specified target IDs.
     */
    TargetIdFilters?: TargetIdFilterList;
    /**
     * Specifies a list of AWS Regions to limit the output by. If you use this parameter, the count of returned noncompliant resources includes only resources in the specified Regions.
     */
    RegionFilters?: RegionFilterList;
    /**
     * Specifies that you want the response to include information for only resources of the specified types. The format of each resource type is service[:resourceType]. For example, specifying a resource type of ec2 returns all Amazon EC2 resources (which includes EC2 instances). Specifying a resource type of ec2:instance returns only EC2 instances.  The string for each service name and resource type is the same as that embedded in a resource's Amazon Resource Name (ARN). Consult the AWS General Reference for the following:   For a list of service name strings, see AWS Service Namespaces.   For resource type strings, see Example ARNs.   For more information about ARNs, see Amazon Resource Names (ARNs) and AWS Service Namespaces.   You can specify multiple resource types by using a comma separated array. The array can include up to 100 items. Note that the length constraint requirement applies to each resource type filter. 
     */
    ResourceTypeFilters?: ResourceTypeFilterList;
    /**
     * Specifies that you want the response to include information for only resources that have tags with the specified tag keys. If you use this parameter, the count of returned noncompliant resources includes only resources that have the specified tag keys.
     */
    TagKeyFilters?: TagKeyFilterList;
    /**
     * Specifies a list of attributes to group the counts of noncompliant resources by. If supplied, the counts are sorted by those attributes.
     */
    GroupBy?: GroupBy;
    /**
     * Specifies the maximum number of results to be returned in each page. A query can return fewer than this maximum, even if there are more results still to return. You should always check the PaginationToken response value to see if there are more results. You can specify a minimum of 1 and a maximum value of 100.
     */
    MaxResults?: MaxResultsGetComplianceSummary;
    /**
     * Specifies a PaginationToken response value from a previous request to indicate that you want the next page of results. Leave this parameter empty in your initial request.
     */
    PaginationToken?: PaginationToken;
  }
  export interface GetComplianceSummaryOutput {
    /**
     * A table that shows counts of noncompliant resources.
     */
    SummaryList?: SummaryList;
    /**
     * A string that indicates that there is more data available than this response contains. To receive the next part of the response, specify this response value as the PaginationToken value in the request for the next page.
     */
    PaginationToken?: PaginationToken;
  }
  export interface GetResourcesInput {
    /**
     * Specifies a PaginationToken response value from a previous request to indicate that you want the next page of results. Leave this parameter empty in your initial request.
     */
    PaginationToken?: PaginationToken;
    /**
     * Specifies a list of TagFilters (keys and values) to restrict the output to only those resources that have the specified tag and, if included, the specified value. Each TagFilter must contain a key with values optional. A request can include up to 50 keys, and each key can include up to 20 values.  Note the following when deciding how to use TagFilters:   If you don't specify a TagFilter, the response includes all resources that are currently tagged or ever had a tag. Resources that currently don't have tags are shown with an empty tag set, like this: "Tags": [].   If you specify more than one filter in a single request, the response returns only those resources that satisfy all filters.   If you specify a filter that contains more than one value for a key, the response returns resources that match any of the specified values for that key.   If you don't specify any values for a key, the response returns resources that are tagged with that key and any or no value. For example, for the following filters: filter1= {keyA,{value1}}, filter2={keyB,{value2,value3,value4}}, filter3= {keyC}:    GetResources({filter1}) returns resources tagged with key1=value1     GetResources({filter2}) returns resources tagged with key2=value2 or key2=value3 or key2=value4     GetResources({filter3}) returns resources tagged with any tag with the key key3, and with any or no value    GetResources({filter1,filter2,filter3}) returns resources tagged with (key1=value1) and (key2=value2 or key2=value3 or key2=value4) and (key3, any or no value)     
     */
    TagFilters?: TagFilterList;
    /**
     * Specifies the maximum number of results to be returned in each page. A query can return fewer than this maximum, even if there are more results still to return. You should always check the PaginationToken response value to see if there are more results. You can specify a minimum of 1 and a maximum value of 100.
     */
    ResourcesPerPage?: ResourcesPerPage;
    /**
     * AWS recommends using ResourcesPerPage instead of this parameter. A limit that restricts the number of tags (key and value pairs) returned by GetResources in paginated output. A resource with no tags is counted as having one tag (one key and value pair).  GetResources does not split a resource and its associated tags across pages. If the specified TagsPerPage would cause such a break, a PaginationToken is returned in place of the affected resource and its tags. Use that token in another request to get the remaining data. For example, if you specify a TagsPerPage of 100 and the account has 22 resources with 10 tags each (meaning that each resource has 10 key and value pairs), the output will consist of three pages. The first page displays the first 10 resources, each with its 10 tags. The second page displays the next 10 resources, each with its 10 tags. The third page displays the remaining 2 resources, each with its 10 tags. You can set TagsPerPage to a minimum of 100 items up to a maximum of 500 items.
     */
    TagsPerPage?: TagsPerPage;
    /**
     * Specifies the resource types that you want included in the response. The format of each resource type is service[:resourceType]. For example, specifying a resource type of ec2 returns all Amazon EC2 resources (which includes EC2 instances). Specifying a resource type of ec2:instance returns only EC2 instances.  The string for each service name and resource type is the same as that embedded in a resource's Amazon Resource Name (ARN). Consult the AWS General Reference for the following: For more information about ARNs, see Amazon Resource Names (ARNs) and AWS Service Namespaces. You can specify multiple resource types by using an array. The array can include up to 100 items. Note that the length constraint requirement applies to each resource type filter. 
     */
    ResourceTypeFilters?: ResourceTypeFilterList;
    /**
     * Specifies whether to include details regarding the compliance with the effective tag policy. Set this to true to determine whether resources are compliant with the tag policy and to get details.
     */
    IncludeComplianceDetails?: IncludeComplianceDetails;
    /**
     * Specifies whether to exclude resources that are compliant with the tag policy. Set this to true if you are interested in retrieving information on noncompliant resources only. You can use this parameter only if the IncludeComplianceDetails parameter is also set to true.
     */
    ExcludeCompliantResources?: ExcludeCompliantResources;
    /**
     * Specifies a list of ARNs of resources for which you want to retrieve tag data. You can't specify both this parameter and any of the pagination parameters (ResourcesPerPage, TagsPerPage, PaginationToken) in the same request. If you specify both, you get an Invalid Parameter exception. If a resource specified by this parameter doesn't exist, it doesn't generate an error; it simply isn't included in the response. An ARN (Amazon Resource Name) uniquely identifies a resource. For more information, see Amazon Resource Names (ARNs) and AWS Service Namespaces in the AWS General Reference.
     */
    ResourceARNList?: ResourceARNListForGet;
  }
  export interface GetResourcesOutput {
    /**
     * A string that indicates that there is more data available than this response contains. To receive the next part of the response, specify this response value as the PaginationToken value in the request for the next page.
     */
    PaginationToken?: PaginationToken;
    /**
     * A list of resource ARNs and the tags (keys and values) associated with those ARNs.
     */
    ResourceTagMappingList?: ResourceTagMappingList;
  }
  export interface GetTagKeysInput {
    /**
     * Specifies a PaginationToken response value from a previous request to indicate that you want the next page of results. Leave this parameter empty in your initial request.
     */
    PaginationToken?: PaginationToken;
  }
  export interface GetTagKeysOutput {
    /**
     * A string that indicates that there is more data available than this response contains. To receive the next part of the response, specify this response value as the PaginationToken value in the request for the next page.
     */
    PaginationToken?: PaginationToken;
    /**
     * A list of all tag keys in the AWS account.
     */
    TagKeys?: TagKeyList;
  }
  export interface GetTagValuesInput {
    /**
     * Specifies a PaginationToken response value from a previous request to indicate that you want the next page of results. Leave this parameter empty in your initial request.
     */
    PaginationToken?: PaginationToken;
    /**
     * Specifies the tag key for which you want to list all existing values that are currently used in the specified AWS Region for the calling AWS account.
     */
    Key: TagKey;
  }
  export interface GetTagValuesOutput {
    /**
     * A string that indicates that there is more data available than this response contains. To receive the next part of the response, specify this response value as the PaginationToken value in the request for the next page.
     */
    PaginationToken?: PaginationToken;
    /**
     * A list of all tag values for the specified key currently used in the specified AWS Region for the calling AWS account.
     */
    TagValues?: TagValuesOutputList;
  }
  export type GroupBy = GroupByAttribute[];
  export type GroupByAttribute = "TARGET_ID"|"REGION"|"RESOURCE_TYPE"|string;
  export type IncludeComplianceDetails = boolean;
  export type LastUpdated = string;
  export type MaxResultsGetComplianceSummary = number;
  export type NonCompliantResources = number;
  export type PaginationToken = string;
  export type Region = string;
  export type RegionFilterList = Region[];
  export type ResourceARN = string;
  export type ResourceARNListForGet = ResourceARN[];
  export type ResourceARNListForTagUntag = ResourceARN[];
  export interface ResourceTagMapping {
    /**
     * The ARN of the resource.
     */
    ResourceARN?: ResourceARN;
    /**
     * The tags that have been applied to one or more AWS resources.
     */
    Tags?: TagList;
    /**
     * Information that shows whether a resource is compliant with the effective tag policy, including details on any noncompliant tag keys.
     */
    ComplianceDetails?: ComplianceDetails;
  }
  export type ResourceTagMappingList = ResourceTagMapping[];
  export type ResourceTypeFilterList = AmazonResourceType[];
  export type ResourcesPerPage = number;
  export type S3Bucket = string;
  export type S3Location = string;
  export interface StartReportCreationInput {
    /**
     * The name of the Amazon S3 bucket where the report will be stored; for example:  awsexamplebucket  For more information on S3 bucket requirements, including an example bucket policy, see the example S3 bucket policy on this page.
     */
    S3Bucket: S3Bucket;
  }
  export interface StartReportCreationOutput {
  }
  export type Status = string;
  export type StatusCode = number;
  export interface Summary {
    /**
     * The timestamp that shows when this summary was generated in this Region. 
     */
    LastUpdated?: LastUpdated;
    /**
     * The account identifier or the root identifier of the organization. If you don't know the root ID, you can call the AWS Organizations ListRoots API.
     */
    TargetId?: TargetId;
    /**
     * Whether the target is an account, an OU, or the organization root.
     */
    TargetIdType?: TargetIdType;
    /**
     * The AWS Region that the summary applies to.
     */
    Region?: Region;
    /**
     * The AWS resource type.
     */
    ResourceType?: AmazonResourceType;
    /**
     * The count of noncompliant resources.
     */
    NonCompliantResources?: NonCompliantResources;
  }
  export type SummaryList = Summary[];
  export interface Tag {
    /**
     * One part of a key-value pair that makes up a tag. A key is a general label that acts like a category for more specific tag values.
     */
    Key: TagKey;
    /**
     * One part of a key-value pair that make up a tag. A value acts as a descriptor within a tag category (key). The value can be empty or null.
     */
    Value: TagValue;
  }
  export interface TagFilter {
    /**
     * One part of a key-value pair that makes up a tag. A key is a general label that acts like a category for more specific tag values.
     */
    Key?: TagKey;
    /**
     * One part of a key-value pair that make up a tag. A value acts as a descriptor within a tag category (key). The value can be empty or null.
     */
    Values?: TagValueList;
  }
  export type TagFilterList = TagFilter[];
  export type TagKey = string;
  export type TagKeyFilterList = TagKey[];
  export type TagKeyList = TagKey[];
  export type TagKeyListForUntag = TagKey[];
  export type TagList = Tag[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourcesInput {
    /**
     * Specifies the list of ARNs of the resources that you want to apply tags to. An ARN (Amazon Resource Name) uniquely identifies a resource. For more information, see Amazon Resource Names (ARNs) and AWS Service Namespaces in the AWS General Reference.
     */
    ResourceARNList: ResourceARNListForTagUntag;
    /**
     * Specifies a list of tags that you want to add to the specified resources. A tag consists of a key and a value that you define.
     */
    Tags: TagMap;
  }
  export interface TagResourcesOutput {
    /**
     * A map containing a key-value pair for each failed item that couldn't be tagged. The key is the ARN of the failed resource. The value is a FailureInfo object that contains an error code, a status code, and an error message. If there are no errors, the FailedResourcesMap is empty.
     */
    FailedResourcesMap?: FailedResourcesMap;
  }
  export type TagValue = string;
  export type TagValueList = TagValue[];
  export type TagValuesOutputList = TagValue[];
  export type TagsPerPage = number;
  export type TargetId = string;
  export type TargetIdFilterList = TargetId[];
  export type TargetIdType = "ACCOUNT"|"OU"|"ROOT"|string;
  export interface UntagResourcesInput {
    /**
     * Specifies a list of ARNs of the resources that you want to remove tags from. An ARN (Amazon Resource Name) uniquely identifies a resource. For more information, see Amazon Resource Names (ARNs) and AWS Service Namespaces in the AWS General Reference.
     */
    ResourceARNList: ResourceARNListForTagUntag;
    /**
     * Specifies a list of tag keys that you want to remove from the specified resources.
     */
    TagKeys: TagKeyListForUntag;
  }
  export interface UntagResourcesOutput {
    /**
     * A map containing a key-value pair for each failed item that couldn't be untagged. The key is the ARN of the failed resource. The value is a FailureInfo object that contains an error code, a status code, and an error message. If there are no errors, the FailedResourcesMap is empty.
     */
    FailedResourcesMap?: FailedResourcesMap;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-01-26"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ResourceGroupsTaggingAPI client.
   */
  export import Types = ResourceGroupsTaggingAPI;
}
export = ResourceGroupsTaggingAPI;
