import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class OpenSearchServerless extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: OpenSearchServerless.Types.ClientConfiguration)
  config: Config & OpenSearchServerless.Types.ClientConfiguration;
  /**
   * Returns attributes for one or more collections, including the collection endpoint and the OpenSearch Dashboards endpoint. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
   */
  batchGetCollection(params: OpenSearchServerless.Types.BatchGetCollectionRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.BatchGetCollectionResponse) => void): Request<OpenSearchServerless.Types.BatchGetCollectionResponse, AWSError>;
  /**
   * Returns attributes for one or more collections, including the collection endpoint and the OpenSearch Dashboards endpoint. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
   */
  batchGetCollection(callback?: (err: AWSError, data: OpenSearchServerless.Types.BatchGetCollectionResponse) => void): Request<OpenSearchServerless.Types.BatchGetCollectionResponse, AWSError>;
  /**
   * Returns attributes for one or more VPC endpoints associated with the current account. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
   */
  batchGetVpcEndpoint(params: OpenSearchServerless.Types.BatchGetVpcEndpointRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.BatchGetVpcEndpointResponse) => void): Request<OpenSearchServerless.Types.BatchGetVpcEndpointResponse, AWSError>;
  /**
   * Returns attributes for one or more VPC endpoints associated with the current account. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
   */
  batchGetVpcEndpoint(callback?: (err: AWSError, data: OpenSearchServerless.Types.BatchGetVpcEndpointResponse) => void): Request<OpenSearchServerless.Types.BatchGetVpcEndpointResponse, AWSError>;
  /**
   * Creates a data access policy for OpenSearch Serverless. Access policies limit access to collections and the resources within them, and allow a user to access that data irrespective of the access mechanism or network source. For more information, see Data access control for Amazon OpenSearch Serverless.
   */
  createAccessPolicy(params: OpenSearchServerless.Types.CreateAccessPolicyRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.CreateAccessPolicyResponse) => void): Request<OpenSearchServerless.Types.CreateAccessPolicyResponse, AWSError>;
  /**
   * Creates a data access policy for OpenSearch Serverless. Access policies limit access to collections and the resources within them, and allow a user to access that data irrespective of the access mechanism or network source. For more information, see Data access control for Amazon OpenSearch Serverless.
   */
  createAccessPolicy(callback?: (err: AWSError, data: OpenSearchServerless.Types.CreateAccessPolicyResponse) => void): Request<OpenSearchServerless.Types.CreateAccessPolicyResponse, AWSError>;
  /**
   * Creates a new OpenSearch Serverless collection. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
   */
  createCollection(params: OpenSearchServerless.Types.CreateCollectionRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.CreateCollectionResponse) => void): Request<OpenSearchServerless.Types.CreateCollectionResponse, AWSError>;
  /**
   * Creates a new OpenSearch Serverless collection. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
   */
  createCollection(callback?: (err: AWSError, data: OpenSearchServerless.Types.CreateCollectionResponse) => void): Request<OpenSearchServerless.Types.CreateCollectionResponse, AWSError>;
  /**
   * Specifies a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless. 
   */
  createSecurityConfig(params: OpenSearchServerless.Types.CreateSecurityConfigRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.CreateSecurityConfigResponse) => void): Request<OpenSearchServerless.Types.CreateSecurityConfigResponse, AWSError>;
  /**
   * Specifies a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless. 
   */
  createSecurityConfig(callback?: (err: AWSError, data: OpenSearchServerless.Types.CreateSecurityConfigResponse) => void): Request<OpenSearchServerless.Types.CreateSecurityConfigResponse, AWSError>;
  /**
   * Creates a security policy to be used by one or more OpenSearch Serverless collections. Security policies provide access to a collection and its OpenSearch Dashboards endpoint from public networks or specific VPC endpoints. They also allow you to secure a collection with a KMS encryption key. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
   */
  createSecurityPolicy(params: OpenSearchServerless.Types.CreateSecurityPolicyRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.CreateSecurityPolicyResponse) => void): Request<OpenSearchServerless.Types.CreateSecurityPolicyResponse, AWSError>;
  /**
   * Creates a security policy to be used by one or more OpenSearch Serverless collections. Security policies provide access to a collection and its OpenSearch Dashboards endpoint from public networks or specific VPC endpoints. They also allow you to secure a collection with a KMS encryption key. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
   */
  createSecurityPolicy(callback?: (err: AWSError, data: OpenSearchServerless.Types.CreateSecurityPolicyResponse) => void): Request<OpenSearchServerless.Types.CreateSecurityPolicyResponse, AWSError>;
  /**
   * Creates an OpenSearch Serverless-managed interface VPC endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
   */
  createVpcEndpoint(params: OpenSearchServerless.Types.CreateVpcEndpointRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.CreateVpcEndpointResponse) => void): Request<OpenSearchServerless.Types.CreateVpcEndpointResponse, AWSError>;
  /**
   * Creates an OpenSearch Serverless-managed interface VPC endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
   */
  createVpcEndpoint(callback?: (err: AWSError, data: OpenSearchServerless.Types.CreateVpcEndpointResponse) => void): Request<OpenSearchServerless.Types.CreateVpcEndpointResponse, AWSError>;
  /**
   * Deletes an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
   */
  deleteAccessPolicy(params: OpenSearchServerless.Types.DeleteAccessPolicyRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.DeleteAccessPolicyResponse) => void): Request<OpenSearchServerless.Types.DeleteAccessPolicyResponse, AWSError>;
  /**
   * Deletes an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
   */
  deleteAccessPolicy(callback?: (err: AWSError, data: OpenSearchServerless.Types.DeleteAccessPolicyResponse) => void): Request<OpenSearchServerless.Types.DeleteAccessPolicyResponse, AWSError>;
  /**
   * Deletes an OpenSearch Serverless collection. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
   */
  deleteCollection(params: OpenSearchServerless.Types.DeleteCollectionRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.DeleteCollectionResponse) => void): Request<OpenSearchServerless.Types.DeleteCollectionResponse, AWSError>;
  /**
   * Deletes an OpenSearch Serverless collection. For more information, see Creating and managing Amazon OpenSearch Serverless collections.
   */
  deleteCollection(callback?: (err: AWSError, data: OpenSearchServerless.Types.DeleteCollectionResponse) => void): Request<OpenSearchServerless.Types.DeleteCollectionResponse, AWSError>;
  /**
   * Deletes a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless.
   */
  deleteSecurityConfig(params: OpenSearchServerless.Types.DeleteSecurityConfigRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.DeleteSecurityConfigResponse) => void): Request<OpenSearchServerless.Types.DeleteSecurityConfigResponse, AWSError>;
  /**
   * Deletes a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless.
   */
  deleteSecurityConfig(callback?: (err: AWSError, data: OpenSearchServerless.Types.DeleteSecurityConfigResponse) => void): Request<OpenSearchServerless.Types.DeleteSecurityConfigResponse, AWSError>;
  /**
   * Deletes an OpenSearch Serverless security policy.
   */
  deleteSecurityPolicy(params: OpenSearchServerless.Types.DeleteSecurityPolicyRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.DeleteSecurityPolicyResponse) => void): Request<OpenSearchServerless.Types.DeleteSecurityPolicyResponse, AWSError>;
  /**
   * Deletes an OpenSearch Serverless security policy.
   */
  deleteSecurityPolicy(callback?: (err: AWSError, data: OpenSearchServerless.Types.DeleteSecurityPolicyResponse) => void): Request<OpenSearchServerless.Types.DeleteSecurityPolicyResponse, AWSError>;
  /**
   * Deletes an OpenSearch Serverless-managed interface endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
   */
  deleteVpcEndpoint(params: OpenSearchServerless.Types.DeleteVpcEndpointRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.DeleteVpcEndpointResponse) => void): Request<OpenSearchServerless.Types.DeleteVpcEndpointResponse, AWSError>;
  /**
   * Deletes an OpenSearch Serverless-managed interface endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
   */
  deleteVpcEndpoint(callback?: (err: AWSError, data: OpenSearchServerless.Types.DeleteVpcEndpointResponse) => void): Request<OpenSearchServerless.Types.DeleteVpcEndpointResponse, AWSError>;
  /**
   * Returns an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
   */
  getAccessPolicy(params: OpenSearchServerless.Types.GetAccessPolicyRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.GetAccessPolicyResponse) => void): Request<OpenSearchServerless.Types.GetAccessPolicyResponse, AWSError>;
  /**
   * Returns an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
   */
  getAccessPolicy(callback?: (err: AWSError, data: OpenSearchServerless.Types.GetAccessPolicyResponse) => void): Request<OpenSearchServerless.Types.GetAccessPolicyResponse, AWSError>;
  /**
   * Returns account-level settings related to OpenSearch Serverless.
   */
  getAccountSettings(params: OpenSearchServerless.Types.GetAccountSettingsRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.GetAccountSettingsResponse) => void): Request<OpenSearchServerless.Types.GetAccountSettingsResponse, AWSError>;
  /**
   * Returns account-level settings related to OpenSearch Serverless.
   */
  getAccountSettings(callback?: (err: AWSError, data: OpenSearchServerless.Types.GetAccountSettingsResponse) => void): Request<OpenSearchServerless.Types.GetAccountSettingsResponse, AWSError>;
  /**
   * Returns statistical information about your OpenSearch Serverless access policies, security configurations, and security policies.
   */
  getPoliciesStats(params: OpenSearchServerless.Types.GetPoliciesStatsRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.GetPoliciesStatsResponse) => void): Request<OpenSearchServerless.Types.GetPoliciesStatsResponse, AWSError>;
  /**
   * Returns statistical information about your OpenSearch Serverless access policies, security configurations, and security policies.
   */
  getPoliciesStats(callback?: (err: AWSError, data: OpenSearchServerless.Types.GetPoliciesStatsResponse) => void): Request<OpenSearchServerless.Types.GetPoliciesStatsResponse, AWSError>;
  /**
   * Returns information about an OpenSearch Serverless security configuration. For more information, see SAML authentication for Amazon OpenSearch Serverless.
   */
  getSecurityConfig(params: OpenSearchServerless.Types.GetSecurityConfigRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.GetSecurityConfigResponse) => void): Request<OpenSearchServerless.Types.GetSecurityConfigResponse, AWSError>;
  /**
   * Returns information about an OpenSearch Serverless security configuration. For more information, see SAML authentication for Amazon OpenSearch Serverless.
   */
  getSecurityConfig(callback?: (err: AWSError, data: OpenSearchServerless.Types.GetSecurityConfigResponse) => void): Request<OpenSearchServerless.Types.GetSecurityConfigResponse, AWSError>;
  /**
   * Returns information about a configured OpenSearch Serverless security policy. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
   */
  getSecurityPolicy(params: OpenSearchServerless.Types.GetSecurityPolicyRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.GetSecurityPolicyResponse) => void): Request<OpenSearchServerless.Types.GetSecurityPolicyResponse, AWSError>;
  /**
   * Returns information about a configured OpenSearch Serverless security policy. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
   */
  getSecurityPolicy(callback?: (err: AWSError, data: OpenSearchServerless.Types.GetSecurityPolicyResponse) => void): Request<OpenSearchServerless.Types.GetSecurityPolicyResponse, AWSError>;
  /**
   * Returns information about a list of OpenSearch Serverless access policies.
   */
  listAccessPolicies(params: OpenSearchServerless.Types.ListAccessPoliciesRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.ListAccessPoliciesResponse) => void): Request<OpenSearchServerless.Types.ListAccessPoliciesResponse, AWSError>;
  /**
   * Returns information about a list of OpenSearch Serverless access policies.
   */
  listAccessPolicies(callback?: (err: AWSError, data: OpenSearchServerless.Types.ListAccessPoliciesResponse) => void): Request<OpenSearchServerless.Types.ListAccessPoliciesResponse, AWSError>;
  /**
   * Lists all OpenSearch Serverless collections. For more information, see Creating and managing Amazon OpenSearch Serverless collections.  Make sure to include an empty request body {} if you don't include any collection filters in the request. 
   */
  listCollections(params: OpenSearchServerless.Types.ListCollectionsRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.ListCollectionsResponse) => void): Request<OpenSearchServerless.Types.ListCollectionsResponse, AWSError>;
  /**
   * Lists all OpenSearch Serverless collections. For more information, see Creating and managing Amazon OpenSearch Serverless collections.  Make sure to include an empty request body {} if you don't include any collection filters in the request. 
   */
  listCollections(callback?: (err: AWSError, data: OpenSearchServerless.Types.ListCollectionsResponse) => void): Request<OpenSearchServerless.Types.ListCollectionsResponse, AWSError>;
  /**
   * Returns information about configured OpenSearch Serverless security configurations. For more information, see SAML authentication for Amazon OpenSearch Serverless.
   */
  listSecurityConfigs(params: OpenSearchServerless.Types.ListSecurityConfigsRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.ListSecurityConfigsResponse) => void): Request<OpenSearchServerless.Types.ListSecurityConfigsResponse, AWSError>;
  /**
   * Returns information about configured OpenSearch Serverless security configurations. For more information, see SAML authentication for Amazon OpenSearch Serverless.
   */
  listSecurityConfigs(callback?: (err: AWSError, data: OpenSearchServerless.Types.ListSecurityConfigsResponse) => void): Request<OpenSearchServerless.Types.ListSecurityConfigsResponse, AWSError>;
  /**
   * Returns information about configured OpenSearch Serverless security policies.
   */
  listSecurityPolicies(params: OpenSearchServerless.Types.ListSecurityPoliciesRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.ListSecurityPoliciesResponse) => void): Request<OpenSearchServerless.Types.ListSecurityPoliciesResponse, AWSError>;
  /**
   * Returns information about configured OpenSearch Serverless security policies.
   */
  listSecurityPolicies(callback?: (err: AWSError, data: OpenSearchServerless.Types.ListSecurityPoliciesResponse) => void): Request<OpenSearchServerless.Types.ListSecurityPoliciesResponse, AWSError>;
  /**
   * Returns the tags for an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
   */
  listTagsForResource(params: OpenSearchServerless.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.ListTagsForResourceResponse) => void): Request<OpenSearchServerless.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns the tags for an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
   */
  listTagsForResource(callback?: (err: AWSError, data: OpenSearchServerless.Types.ListTagsForResourceResponse) => void): Request<OpenSearchServerless.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns the OpenSearch Serverless-managed interface VPC endpoints associated with the current account. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
   */
  listVpcEndpoints(params: OpenSearchServerless.Types.ListVpcEndpointsRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.ListVpcEndpointsResponse) => void): Request<OpenSearchServerless.Types.ListVpcEndpointsResponse, AWSError>;
  /**
   * Returns the OpenSearch Serverless-managed interface VPC endpoints associated with the current account. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
   */
  listVpcEndpoints(callback?: (err: AWSError, data: OpenSearchServerless.Types.ListVpcEndpointsResponse) => void): Request<OpenSearchServerless.Types.ListVpcEndpointsResponse, AWSError>;
  /**
   * Associates tags with an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
   */
  tagResource(params: OpenSearchServerless.Types.TagResourceRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.TagResourceResponse) => void): Request<OpenSearchServerless.Types.TagResourceResponse, AWSError>;
  /**
   * Associates tags with an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
   */
  tagResource(callback?: (err: AWSError, data: OpenSearchServerless.Types.TagResourceResponse) => void): Request<OpenSearchServerless.Types.TagResourceResponse, AWSError>;
  /**
   * Removes a tag or set of tags from an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
   */
  untagResource(params: OpenSearchServerless.Types.UntagResourceRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.UntagResourceResponse) => void): Request<OpenSearchServerless.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes a tag or set of tags from an OpenSearch Serverless resource. For more information, see Tagging Amazon OpenSearch Serverless collections.
   */
  untagResource(callback?: (err: AWSError, data: OpenSearchServerless.Types.UntagResourceResponse) => void): Request<OpenSearchServerless.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
   */
  updateAccessPolicy(params: OpenSearchServerless.Types.UpdateAccessPolicyRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateAccessPolicyResponse) => void): Request<OpenSearchServerless.Types.UpdateAccessPolicyResponse, AWSError>;
  /**
   * Updates an OpenSearch Serverless access policy. For more information, see Data access control for Amazon OpenSearch Serverless.
   */
  updateAccessPolicy(callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateAccessPolicyResponse) => void): Request<OpenSearchServerless.Types.UpdateAccessPolicyResponse, AWSError>;
  /**
   * Update the OpenSearch Serverless settings for the current Amazon Web Services account. For more information, see Managing capacity limits for Amazon OpenSearch Serverless.
   */
  updateAccountSettings(params: OpenSearchServerless.Types.UpdateAccountSettingsRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateAccountSettingsResponse) => void): Request<OpenSearchServerless.Types.UpdateAccountSettingsResponse, AWSError>;
  /**
   * Update the OpenSearch Serverless settings for the current Amazon Web Services account. For more information, see Managing capacity limits for Amazon OpenSearch Serverless.
   */
  updateAccountSettings(callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateAccountSettingsResponse) => void): Request<OpenSearchServerless.Types.UpdateAccountSettingsResponse, AWSError>;
  /**
   * Updates an OpenSearch Serverless collection.
   */
  updateCollection(params: OpenSearchServerless.Types.UpdateCollectionRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateCollectionResponse) => void): Request<OpenSearchServerless.Types.UpdateCollectionResponse, AWSError>;
  /**
   * Updates an OpenSearch Serverless collection.
   */
  updateCollection(callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateCollectionResponse) => void): Request<OpenSearchServerless.Types.UpdateCollectionResponse, AWSError>;
  /**
   * Updates a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless.
   */
  updateSecurityConfig(params: OpenSearchServerless.Types.UpdateSecurityConfigRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateSecurityConfigResponse) => void): Request<OpenSearchServerless.Types.UpdateSecurityConfigResponse, AWSError>;
  /**
   * Updates a security configuration for OpenSearch Serverless. For more information, see SAML authentication for Amazon OpenSearch Serverless.
   */
  updateSecurityConfig(callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateSecurityConfigResponse) => void): Request<OpenSearchServerless.Types.UpdateSecurityConfigResponse, AWSError>;
  /**
   * Updates an OpenSearch Serverless security policy. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
   */
  updateSecurityPolicy(params: OpenSearchServerless.Types.UpdateSecurityPolicyRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateSecurityPolicyResponse) => void): Request<OpenSearchServerless.Types.UpdateSecurityPolicyResponse, AWSError>;
  /**
   * Updates an OpenSearch Serverless security policy. For more information, see Network access for Amazon OpenSearch Serverless and Encryption at rest for Amazon OpenSearch Serverless.
   */
  updateSecurityPolicy(callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateSecurityPolicyResponse) => void): Request<OpenSearchServerless.Types.UpdateSecurityPolicyResponse, AWSError>;
  /**
   * Updates an OpenSearch Serverless-managed interface endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
   */
  updateVpcEndpoint(params: OpenSearchServerless.Types.UpdateVpcEndpointRequest, callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateVpcEndpointResponse) => void): Request<OpenSearchServerless.Types.UpdateVpcEndpointResponse, AWSError>;
  /**
   * Updates an OpenSearch Serverless-managed interface endpoint. For more information, see Access Amazon OpenSearch Serverless using an interface endpoint.
   */
  updateVpcEndpoint(callback?: (err: AWSError, data: OpenSearchServerless.Types.UpdateVpcEndpointResponse) => void): Request<OpenSearchServerless.Types.UpdateVpcEndpointResponse, AWSError>;
}
declare namespace OpenSearchServerless {
  export interface AccessPolicyDetail {
    /**
     * The date the policy was created.
     */
    createdDate?: Long;
    /**
     * The description of the policy.
     */
    description?: PolicyDescription;
    /**
     * The timestamp of when the policy was last modified.
     */
    lastModifiedDate?: Long;
    /**
     * The name of the policy.
     */
    name?: PolicyName;
    /**
     * The JSON policy document without any whitespaces.
     */
    policy?: Document;
    /**
     * The version of the policy.
     */
    policyVersion?: PolicyVersion;
    /**
     * The type of access policy.
     */
    type?: AccessPolicyType;
  }
  export interface AccessPolicyStats {
    /**
     * The number of data access policies in the current account.
     */
    DataPolicyCount?: Long;
  }
  export type AccessPolicySummaries = AccessPolicySummary[];
  export interface AccessPolicySummary {
    /**
     * The Epoch time when the access policy was created.
     */
    createdDate?: Long;
    /**
     * The description of the access policy.
     */
    description?: PolicyDescription;
    /**
     * The date and time when the collection was last modified.
     */
    lastModifiedDate?: Long;
    /**
     * The name of the access policy.
     */
    name?: PolicyName;
    /**
     * The version of the policy.
     */
    policyVersion?: PolicyVersion;
    /**
     * The type of access policy. Currently the only available type is data.
     */
    type?: AccessPolicyType;
  }
  export type AccessPolicyType = "data"|string;
  export interface AccountSettingsDetail {
    capacityLimits?: CapacityLimits;
  }
  export type Arn = string;
  export interface BatchGetCollectionRequest {
    /**
     * A list of collection IDs. You can't provide names and IDs in the same request. The ID is part of the collection endpoint. You can also retrieve it using the ListCollections API.
     */
    ids?: CollectionIds;
    /**
     * A list of collection names. You can't provide names and IDs in the same request.
     */
    names?: CollectionNames;
  }
  export interface BatchGetCollectionResponse {
    /**
     * Details about each collection.
     */
    collectionDetails?: CollectionDetails;
    /**
     * Error information for the request.
     */
    collectionErrorDetails?: CollectionErrorDetails;
  }
  export interface BatchGetVpcEndpointRequest {
    /**
     * A list of VPC endpoint identifiers.
     */
    ids: VpcEndpointIds;
  }
  export interface BatchGetVpcEndpointResponse {
    /**
     * Details about the specified VPC endpoint.
     */
    vpcEndpointDetails?: VpcEndpointDetails;
    /**
     * Error information for a failed request.
     */
    vpcEndpointErrorDetails?: VpcEndpointErrorDetails;
  }
  export interface CapacityLimits {
    /**
     * The maximum indexing capacity for collections.
     */
    maxIndexingCapacityInOCU?: IndexingCapacityValue;
    /**
     * The maximum search capacity for collections.
     */
    maxSearchCapacityInOCU?: SearchCapacityValue;
  }
  export type ClientToken = string;
  export interface CollectionDetail {
    /**
     * The Amazon Resource Name (ARN) of the collection.
     */
    arn?: String;
    /**
     * Collection-specific endpoint used to submit index, search, and data upload requests to an OpenSearch Serverless collection.
     */
    collectionEndpoint?: String;
    /**
     * The Epoch time when the collection was created.
     */
    createdDate?: Long;
    /**
     * Collection-specific endpoint used to access OpenSearch Dashboards.
     */
    dashboardEndpoint?: String;
    /**
     * A description of the collection.
     */
    description?: String;
    /**
     * A unique identifier for the collection.
     */
    id?: CollectionId;
    /**
     * The ARN of the Amazon Web Services KMS key used to encrypt the collection.
     */
    kmsKeyArn?: String;
    /**
     * The date and time when the collection was last modified.
     */
    lastModifiedDate?: Long;
    /**
     * The name of the collection.
     */
    name?: CollectionName;
    /**
     * The current status of the collection.
     */
    status?: CollectionStatus;
    /**
     * The type of collection.
     */
    type?: CollectionType;
  }
  export type CollectionDetails = CollectionDetail[];
  export interface CollectionErrorDetail {
    /**
     * The error code for the request. For example, NOT_FOUND.
     */
    errorCode?: String;
    /**
     * A description of the error. For example, The specified Collection is not found. 
     */
    errorMessage?: String;
    /**
     * If the request contains collection IDs, the response includes the IDs provided in the request.
     */
    id?: CollectionId;
    /**
     * If the request contains collection names, the response includes the names provided in the request.
     */
    name?: CollectionName;
  }
  export type CollectionErrorDetails = CollectionErrorDetail[];
  export interface CollectionFilters {
    /**
     * The name of the collection.
     */
    name?: CollectionName;
    /**
     * The current status of the collection.
     */
    status?: CollectionStatus;
  }
  export type CollectionId = string;
  export type CollectionIds = CollectionId[];
  export type CollectionName = string;
  export type CollectionNames = CollectionName[];
  export type CollectionStatus = "CREATING"|"DELETING"|"ACTIVE"|"FAILED"|string;
  export type CollectionSummaries = CollectionSummary[];
  export interface CollectionSummary {
    /**
     * The Amazon Resource Name (ARN) of the collection.
     */
    arn?: String;
    /**
     * The unique identifier of the collection.
     */
    id?: CollectionId;
    /**
     * The name of the collection.
     */
    name?: CollectionName;
    /**
     * The current status of the collection.
     */
    status?: CollectionStatus;
  }
  export type CollectionType = "SEARCH"|"TIMESERIES"|"VECTORSEARCH"|string;
  export type ConfigDescription = string;
  export type ConfigName = string;
  export interface CreateAccessPolicyRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * A description of the policy. Typically used to store information about the permissions defined in the policy.
     */
    description?: PolicyDescription;
    /**
     * The name of the policy.
     */
    name: PolicyName;
    /**
     * The JSON policy document to use as the content for the policy.
     */
    policy: PolicyDocument;
    /**
     * The type of policy.
     */
    type: AccessPolicyType;
  }
  export interface CreateAccessPolicyResponse {
    /**
     * Details about the created access policy.
     */
    accessPolicyDetail?: AccessPolicyDetail;
  }
  export interface CreateCollectionDetail {
    /**
     * The Amazon Resource Name (ARN) of the collection.
     */
    arn?: String;
    /**
     * The Epoch time when the collection was created.
     */
    createdDate?: Long;
    /**
     * A description of the collection.
     */
    description?: String;
    /**
     * The unique identifier of the collection.
     */
    id?: CollectionId;
    /**
     * The Amazon Resource Name (ARN) of the KMS key with which to encrypt the collection.
     */
    kmsKeyArn?: String;
    /**
     * The date and time when the collection was last modified.
     */
    lastModifiedDate?: Long;
    /**
     * The name of the collection.
     */
    name?: CollectionName;
    /**
     * The current status of the collection.
     */
    status?: CollectionStatus;
    /**
     * The type of collection.
     */
    type?: CollectionType;
  }
  export interface CreateCollectionRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * Description of the collection.
     */
    description?: CreateCollectionRequestDescriptionString;
    /**
     * Name of the collection.
     */
    name: CollectionName;
    /**
     * An arbitrary set of tags (key–value pairs) to associate with the OpenSearch Serverless collection.
     */
    tags?: Tags;
    /**
     * The type of collection.
     */
    type?: CollectionType;
  }
  export type CreateCollectionRequestDescriptionString = string;
  export interface CreateCollectionResponse {
    /**
     * Details about the collection.
     */
    createCollectionDetail?: CreateCollectionDetail;
  }
  export interface CreateSecurityConfigRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * A description of the security configuration.
     */
    description?: ConfigDescription;
    /**
     * The name of the security configuration.
     */
    name: ConfigName;
    /**
     * Describes SAML options in in the form of a key-value map. This field is required if you specify saml for the type parameter.
     */
    samlOptions?: SamlConfigOptions;
    /**
     * The type of security configuration.
     */
    type: SecurityConfigType;
  }
  export interface CreateSecurityConfigResponse {
    /**
     * Details about the created security configuration. 
     */
    securityConfigDetail?: SecurityConfigDetail;
  }
  export interface CreateSecurityPolicyRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * A description of the policy. Typically used to store information about the permissions defined in the policy.
     */
    description?: PolicyDescription;
    /**
     * The name of the policy.
     */
    name: PolicyName;
    /**
     * The JSON policy document to use as the content for the new policy.
     */
    policy: PolicyDocument;
    /**
     * The type of security policy.
     */
    type: SecurityPolicyType;
  }
  export interface CreateSecurityPolicyResponse {
    /**
     * Details about the created security policy.
     */
    securityPolicyDetail?: SecurityPolicyDetail;
  }
  export interface CreateVpcEndpointDetail {
    /**
     * The unique identifier of the endpoint.
     */
    id?: VpcEndpointId;
    /**
     * The name of the endpoint.
     */
    name?: VpcEndpointName;
    /**
     * The current status in the endpoint creation process.
     */
    status?: VpcEndpointStatus;
  }
  export interface CreateVpcEndpointRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The name of the interface endpoint.
     */
    name: VpcEndpointName;
    /**
     * The unique identifiers of the security groups that define the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
     */
    securityGroupIds?: SecurityGroupIds;
    /**
     * The ID of one or more subnets from which you'll access OpenSearch Serverless.
     */
    subnetIds: SubnetIds;
    /**
     * The ID of the VPC from which you'll access OpenSearch Serverless.
     */
    vpcId: VpcId;
  }
  export interface CreateVpcEndpointResponse {
    /**
     * Details about the created interface VPC endpoint.
     */
    createVpcEndpointDetail?: CreateVpcEndpointDetail;
  }
  export interface DeleteAccessPolicyRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The name of the policy to delete.
     */
    name: PolicyName;
    /**
     * The type of policy.
     */
    type: AccessPolicyType;
  }
  export interface DeleteAccessPolicyResponse {
  }
  export interface DeleteCollectionDetail {
    /**
     * The unique identifier of the collection.
     */
    id?: CollectionId;
    /**
     * The name of the collection.
     */
    name?: CollectionName;
    /**
     * The current status of the collection.
     */
    status?: CollectionStatus;
  }
  export interface DeleteCollectionRequest {
    /**
     * A unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The unique identifier of the collection. For example, 1iu5usc406kd. The ID is part of the collection endpoint. You can also retrieve it using the ListCollections API.
     */
    id: CollectionId;
  }
  export interface DeleteCollectionResponse {
    /**
     * Details of the deleted collection.
     */
    deleteCollectionDetail?: DeleteCollectionDetail;
  }
  export interface DeleteSecurityConfigRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The security configuration identifier. For SAML the ID will be saml/&lt;accountId&gt;/&lt;idpProviderName&gt;. For example, saml/123456789123/OKTADev.
     */
    id: SecurityConfigId;
  }
  export interface DeleteSecurityConfigResponse {
  }
  export interface DeleteSecurityPolicyRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The name of the policy to delete.
     */
    name: PolicyName;
    /**
     * The type of policy.
     */
    type: SecurityPolicyType;
  }
  export interface DeleteSecurityPolicyResponse {
  }
  export interface DeleteVpcEndpointDetail {
    /**
     * The unique identifier of the endpoint.
     */
    id?: VpcEndpointId;
    /**
     * The name of the endpoint.
     */
    name?: VpcEndpointName;
    /**
     * The current status of the endpoint deletion process.
     */
    status?: VpcEndpointStatus;
  }
  export interface DeleteVpcEndpointRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The VPC endpoint identifier.
     */
    id: VpcEndpointId;
  }
  export interface DeleteVpcEndpointResponse {
    /**
     * Details about the deleted endpoint.
     */
    deleteVpcEndpointDetail?: DeleteVpcEndpointDetail;
  }
  export interface Document {
  }
  export interface GetAccessPolicyRequest {
    /**
     * The name of the access policy.
     */
    name: PolicyName;
    /**
     * Tye type of policy. Currently the only supported value is data.
     */
    type: AccessPolicyType;
  }
  export interface GetAccessPolicyResponse {
    /**
     * Details about the requested access policy.
     */
    accessPolicyDetail?: AccessPolicyDetail;
  }
  export interface GetAccountSettingsRequest {
  }
  export interface GetAccountSettingsResponse {
    /**
     * OpenSearch Serverless-related details for the current account.
     */
    accountSettingsDetail?: AccountSettingsDetail;
  }
  export interface GetPoliciesStatsRequest {
  }
  export interface GetPoliciesStatsResponse {
    /**
     * Information about the data access policies in your account.
     */
    AccessPolicyStats?: AccessPolicyStats;
    /**
     * Information about the security configurations in your account.
     */
    SecurityConfigStats?: SecurityConfigStats;
    /**
     * Information about the security policies in your account.
     */
    SecurityPolicyStats?: SecurityPolicyStats;
    /**
     * The total number of OpenSearch Serverless security policies and configurations in your account.
     */
    TotalPolicyCount?: Long;
  }
  export interface GetSecurityConfigRequest {
    /**
     * The unique identifier of the security configuration.
     */
    id: SecurityConfigId;
  }
  export interface GetSecurityConfigResponse {
    /**
     * Details of the requested security configuration.
     */
    securityConfigDetail?: SecurityConfigDetail;
  }
  export interface GetSecurityPolicyRequest {
    /**
     * The name of the security policy.
     */
    name: PolicyName;
    /**
     * The type of security policy.
     */
    type: SecurityPolicyType;
  }
  export interface GetSecurityPolicyResponse {
    /**
     * Details about the requested security policy.
     */
    securityPolicyDetail?: SecurityPolicyDetail;
  }
  export type IndexingCapacityValue = number;
  export interface ListAccessPoliciesRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results. The default is 20.
     */
    maxResults?: ListAccessPoliciesRequestMaxResultsInteger;
    /**
     * If your initial ListAccessPolicies operation returns a nextToken, you can include the returned nextToken in subsequent ListAccessPolicies operations, which returns results in the next page. 
     */
    nextToken?: String;
    /**
     * Resource filters (can be collections or indexes) that policies can apply to.
     */
    resource?: ListAccessPoliciesRequestResourceList;
    /**
     * The type of access policy.
     */
    type: AccessPolicyType;
  }
  export type ListAccessPoliciesRequestMaxResultsInteger = number;
  export type ListAccessPoliciesRequestResourceList = Resource[];
  export interface ListAccessPoliciesResponse {
    /**
     * Details about the requested access policies.
     */
    accessPolicySummaries?: AccessPolicySummaries;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: String;
  }
  export interface ListCollectionsRequest {
    /**
     * List of filter names and values that you can use for requests.
     */
    collectionFilters?: CollectionFilters;
    /**
     * The maximum number of results to return. Default is 20. You can use nextToken to get the next page of results.
     */
    maxResults?: ListCollectionsRequestMaxResultsInteger;
    /**
     * If your initial ListCollections operation returns a nextToken, you can include the returned nextToken in subsequent ListCollections operations, which returns results in the next page.
     */
    nextToken?: String;
  }
  export type ListCollectionsRequestMaxResultsInteger = number;
  export interface ListCollectionsResponse {
    /**
     * Details about each collection.
     */
    collectionSummaries?: CollectionSummaries;
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: String;
  }
  export interface ListSecurityConfigsRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results. The default is 20.
     */
    maxResults?: ListSecurityConfigsRequestMaxResultsInteger;
    /**
     * If your initial ListSecurityConfigs operation returns a nextToken, you can include the returned nextToken in subsequent ListSecurityConfigs operations, which returns results in the next page. 
     */
    nextToken?: String;
    /**
     * The type of security configuration.
     */
    type: SecurityConfigType;
  }
  export type ListSecurityConfigsRequestMaxResultsInteger = number;
  export interface ListSecurityConfigsResponse {
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: String;
    /**
     * Details about the security configurations in your account.
     */
    securityConfigSummaries?: SecurityConfigSummaries;
  }
  export interface ListSecurityPoliciesRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results. The default is 20.
     */
    maxResults?: ListSecurityPoliciesRequestMaxResultsInteger;
    /**
     * If your initial ListSecurityPolicies operation returns a nextToken, you can include the returned nextToken in subsequent ListSecurityPolicies operations, which returns results in the next page. 
     */
    nextToken?: String;
    /**
     * Resource filters (can be collection or indexes) that policies can apply to. 
     */
    resource?: ListSecurityPoliciesRequestResourceList;
    /**
     * The type of policy.
     */
    type: SecurityPolicyType;
  }
  export type ListSecurityPoliciesRequestMaxResultsInteger = number;
  export type ListSecurityPoliciesRequestResourceList = Resource[];
  export interface ListSecurityPoliciesResponse {
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: String;
    /**
     * Details about the security policies in your account.
     */
    securityPolicySummaries?: SecurityPolicySummaries;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. The resource must be active (not in the DELETING state), and must be owned by the account ID included in the request.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags associated with the resource.
     */
    tags?: Tags;
  }
  export interface ListVpcEndpointsRequest {
    /**
     * An optional parameter that specifies the maximum number of results to return. You can use nextToken to get the next page of results. The default is 20.
     */
    maxResults?: ListVpcEndpointsRequestMaxResultsInteger;
    /**
     * If your initial ListVpcEndpoints operation returns a nextToken, you can include the returned nextToken in subsequent ListVpcEndpoints operations, which returns results in the next page. 
     */
    nextToken?: String;
    /**
     * Filter the results according to the current status of the VPC endpoint. Possible statuses are CREATING, DELETING, UPDATING, ACTIVE, and FAILED.
     */
    vpcEndpointFilters?: VpcEndpointFilters;
  }
  export type ListVpcEndpointsRequestMaxResultsInteger = number;
  export interface ListVpcEndpointsResponse {
    /**
     * When nextToken is returned, there are more results available. The value of nextToken is a unique pagination token for each page. Make the call again using the returned token to retrieve the next page.
     */
    nextToken?: String;
    /**
     * Details about each VPC endpoint, including the name and current status.
     */
    vpcEndpointSummaries?: VpcEndpointSummaries;
  }
  export type Long = number;
  export type PolicyDescription = string;
  export type PolicyDocument = string;
  export type PolicyName = string;
  export type PolicyVersion = string;
  export type Resource = string;
  export interface SamlConfigOptions {
    /**
     * The group attribute for this SAML integration.
     */
    groupAttribute?: samlGroupAttribute;
    /**
     * The XML IdP metadata file generated from your identity provider.
     */
    metadata: samlMetadata;
    /**
     * The session timeout, in minutes. Default is 60 minutes (12 hours).
     */
    sessionTimeout?: SamlConfigOptionsSessionTimeoutInteger;
    /**
     * A user attribute for this SAML integration.
     */
    userAttribute?: samlUserAttribute;
  }
  export type SamlConfigOptionsSessionTimeoutInteger = number;
  export type SearchCapacityValue = number;
  export interface SecurityConfigDetail {
    /**
     * The version of the security configuration.
     */
    configVersion?: PolicyVersion;
    /**
     * The date the configuration was created.
     */
    createdDate?: Long;
    /**
     * The description of the security configuration.
     */
    description?: ConfigDescription;
    /**
     * The unique identifier of the security configuration.
     */
    id?: SecurityConfigId;
    /**
     * The timestamp of when the configuration was last modified.
     */
    lastModifiedDate?: Long;
    /**
     * SAML options for the security configuration in the form of a key-value map.
     */
    samlOptions?: SamlConfigOptions;
    /**
     * The type of security configuration.
     */
    type?: SecurityConfigType;
  }
  export type SecurityConfigId = string;
  export interface SecurityConfigStats {
    /**
     * The number of security configurations in the current account.
     */
    SamlConfigCount?: Long;
  }
  export type SecurityConfigSummaries = SecurityConfigSummary[];
  export interface SecurityConfigSummary {
    /**
     * The version of the security configuration.
     */
    configVersion?: PolicyVersion;
    /**
     * The Epoch time when the security configuration was created.
     */
    createdDate?: Long;
    /**
     * The description of the security configuration.
     */
    description?: ConfigDescription;
    /**
     * The unique identifier of the security configuration.
     */
    id?: SecurityConfigId;
    /**
     * The timestamp of when the configuration was last modified.
     */
    lastModifiedDate?: Long;
    /**
     * The type of security configuration.
     */
    type?: SecurityConfigType;
  }
  export type SecurityConfigType = "saml"|string;
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export interface SecurityPolicyDetail {
    /**
     * The date the policy was created.
     */
    createdDate?: Long;
    /**
     * The description of the security policy.
     */
    description?: PolicyDescription;
    /**
     * The timestamp of when the policy was last modified.
     */
    lastModifiedDate?: Long;
    /**
     * The name of the policy.
     */
    name?: PolicyName;
    /**
     * The JSON policy document without any whitespaces.
     */
    policy?: Document;
    /**
     * The version of the policy.
     */
    policyVersion?: PolicyVersion;
    /**
     * The type of security policy.
     */
    type?: SecurityPolicyType;
  }
  export interface SecurityPolicyStats {
    /**
     * The number of encryption policies in the current account.
     */
    EncryptionPolicyCount?: Long;
    /**
     * The number of network policies in the current account.
     */
    NetworkPolicyCount?: Long;
  }
  export type SecurityPolicySummaries = SecurityPolicySummary[];
  export interface SecurityPolicySummary {
    /**
     * The date the policy was created.
     */
    createdDate?: Long;
    /**
     * The description of the security policy.
     */
    description?: PolicyDescription;
    /**
     * The timestamp of when the policy was last modified.
     */
    lastModifiedDate?: Long;
    /**
     * The name of the policy.
     */
    name?: PolicyName;
    /**
     * The version of the policy.
     */
    policyVersion?: PolicyVersion;
    /**
     * The type of security policy.
     */
    type?: SecurityPolicyType;
  }
  export type SecurityPolicyType = "encryption"|"network"|string;
  export type String = string;
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export interface Tag {
    /**
     * The key to use in the tag.
     */
    key: TagKey;
    /**
     * The value of the tag.
     */
    value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource. The resource must be active (not in the DELETING state), and must be owned by the account ID included in the request.
     */
    resourceArn: Arn;
    /**
     * A list of tags (key-value pairs) to add to the resource. All tag keys in the request must be unique.
     */
    tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to remove tags from. The resource must be active (not in the DELETING state), and must be owned by the account ID included in the request.
     */
    resourceArn: Arn;
    /**
     * The tag or set of tags to remove from the resource. All tag keys in the request must be unique.
     */
    tagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateAccessPolicyRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * A description of the policy. Typically used to store information about the permissions defined in the policy.
     */
    description?: PolicyDescription;
    /**
     * The name of the policy.
     */
    name: PolicyName;
    /**
     * The JSON policy document to use as the content for the policy.
     */
    policy?: PolicyDocument;
    /**
     * The version of the policy being updated.
     */
    policyVersion: PolicyVersion;
    /**
     * The type of policy.
     */
    type: AccessPolicyType;
  }
  export interface UpdateAccessPolicyResponse {
    /**
     * Details about the updated access policy.
     */
    accessPolicyDetail?: AccessPolicyDetail;
  }
  export interface UpdateAccountSettingsRequest {
    capacityLimits?: CapacityLimits;
  }
  export interface UpdateAccountSettingsResponse {
    /**
     * OpenSearch Serverless-related settings for the current Amazon Web Services account. 
     */
    accountSettingsDetail?: AccountSettingsDetail;
  }
  export interface UpdateCollectionDetail {
    /**
     * The Amazon Resource Name (ARN) of the collection.
     */
    arn?: String;
    /**
     * The date and time when the collection was created.
     */
    createdDate?: Long;
    /**
     * The description of the collection.
     */
    description?: String;
    /**
     * The unique identifier of the collection.
     */
    id?: CollectionId;
    /**
     * The date and time when the collection was last modified.
     */
    lastModifiedDate?: Long;
    /**
     * The name of the collection.
     */
    name?: CollectionName;
    /**
     * The current status of the collection.
     */
    status?: CollectionStatus;
    /**
     * The collection type.
     */
    type?: CollectionType;
  }
  export interface UpdateCollectionRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * A description of the collection.
     */
    description?: UpdateCollectionRequestDescriptionString;
    /**
     * The unique identifier of the collection.
     */
    id: CollectionId;
  }
  export type UpdateCollectionRequestDescriptionString = string;
  export interface UpdateCollectionResponse {
    /**
     * Details about the updated collection.
     */
    updateCollectionDetail?: UpdateCollectionDetail;
  }
  export interface UpdateSecurityConfigRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The version of the security configuration to be updated. You can find the most recent version of a security configuration using the GetSecurityPolicy command.
     */
    configVersion: PolicyVersion;
    /**
     * A description of the security configuration.
     */
    description?: ConfigDescription;
    /**
     * The security configuration identifier. For SAML the ID will be saml/&lt;accountId&gt;/&lt;idpProviderName&gt;. For example, saml/123456789123/OKTADev.
     */
    id: SecurityConfigId;
    /**
     * SAML options in in the form of a key-value map.
     */
    samlOptions?: SamlConfigOptions;
  }
  export interface UpdateSecurityConfigResponse {
    /**
     * Details about the updated security configuration. 
     */
    securityConfigDetail?: SecurityConfigDetail;
  }
  export interface UpdateSecurityPolicyRequest {
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * A description of the policy. Typically used to store information about the permissions defined in the policy.
     */
    description?: PolicyDescription;
    /**
     * The name of the policy.
     */
    name: PolicyName;
    /**
     * The JSON policy document to use as the content for the new policy.
     */
    policy?: PolicyDocument;
    /**
     * The version of the policy being updated.
     */
    policyVersion: PolicyVersion;
    /**
     * The type of access policy.
     */
    type: SecurityPolicyType;
  }
  export interface UpdateSecurityPolicyResponse {
    /**
     * Details about the updated security policy.
     */
    securityPolicyDetail?: SecurityPolicyDetail;
  }
  export interface UpdateVpcEndpointDetail {
    /**
     * The unique identifier of the endpoint.
     */
    id?: VpcEndpointId;
    /**
     * The timestamp of when the endpoint was last modified.
     */
    lastModifiedDate?: Long;
    /**
     * The name of the endpoint.
     */
    name?: VpcEndpointName;
    /**
     * The unique identifiers of the security groups that define the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
     */
    securityGroupIds?: SecurityGroupIds;
    /**
     * The current status of the endpoint update process.
     */
    status?: VpcEndpointStatus;
    /**
     * The ID of the subnets from which you access OpenSearch Serverless.
     */
    subnetIds?: SubnetIds;
  }
  export interface UpdateVpcEndpointRequest {
    /**
     * The unique identifiers of the security groups to add to the endpoint. Security groups define the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
     */
    addSecurityGroupIds?: SecurityGroupIds;
    /**
     * The ID of one or more subnets to add to the endpoint.
     */
    addSubnetIds?: SubnetIds;
    /**
     * Unique, case-sensitive identifier to ensure idempotency of the request.
     */
    clientToken?: ClientToken;
    /**
     * The unique identifier of the interface endpoint to update.
     */
    id: VpcEndpointId;
    /**
     * The unique identifiers of the security groups to remove from the endpoint.
     */
    removeSecurityGroupIds?: SecurityGroupIds;
    /**
     * The unique identifiers of the subnets to remove from the endpoint.
     */
    removeSubnetIds?: SubnetIds;
  }
  export interface UpdateVpcEndpointResponse {
    /**
     * Details about the updated VPC endpoint.
     */
    UpdateVpcEndpointDetail?: UpdateVpcEndpointDetail;
  }
  export interface VpcEndpointDetail {
    /**
     * The date the endpoint was created.
     */
    createdDate?: Long;
    /**
     * The unique identifier of the endpoint.
     */
    id?: VpcEndpointId;
    /**
     * The name of the endpoint.
     */
    name?: VpcEndpointName;
    /**
     * The unique identifiers of the security groups that define the ports, protocols, and sources for inbound traffic that you are authorizing into your endpoint.
     */
    securityGroupIds?: SecurityGroupIds;
    /**
     * The current status of the endpoint.
     */
    status?: VpcEndpointStatus;
    /**
     * The ID of the subnets from which you access OpenSearch Serverless.
     */
    subnetIds?: SubnetIds;
    /**
     * The ID of the VPC from which you access OpenSearch Serverless.
     */
    vpcId?: VpcId;
  }
  export type VpcEndpointDetails = VpcEndpointDetail[];
  export interface VpcEndpointErrorDetail {
    /**
     * The error code for the failed request.
     */
    errorCode?: String;
    /**
     * An error message describing the reason for the failure.
     */
    errorMessage?: String;
    /**
     * The unique identifier of the VPC endpoint.
     */
    id?: VpcEndpointId;
  }
  export type VpcEndpointErrorDetails = VpcEndpointErrorDetail[];
  export interface VpcEndpointFilters {
    /**
     * The current status of the endpoint.
     */
    status?: VpcEndpointStatus;
  }
  export type VpcEndpointId = string;
  export type VpcEndpointIds = VpcEndpointId[];
  export type VpcEndpointName = string;
  export type VpcEndpointStatus = "PENDING"|"DELETING"|"ACTIVE"|"FAILED"|string;
  export type VpcEndpointSummaries = VpcEndpointSummary[];
  export interface VpcEndpointSummary {
    /**
     * The unique identifier of the endpoint.
     */
    id?: VpcEndpointId;
    /**
     * The name of the endpoint.
     */
    name?: VpcEndpointName;
    /**
     * The current status of the endpoint.
     */
    status?: VpcEndpointStatus;
  }
  export type VpcId = string;
  export type samlGroupAttribute = string;
  export type samlMetadata = string;
  export type samlUserAttribute = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-11-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the OpenSearchServerless client.
   */
  export import Types = OpenSearchServerless;
}
export = OpenSearchServerless;
