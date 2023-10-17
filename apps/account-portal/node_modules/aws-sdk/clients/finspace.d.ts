import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Finspace extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Finspace.Types.ClientConfiguration)
  config: Config & Finspace.Types.ClientConfiguration;
  /**
   * Create a new FinSpace environment.
   */
  createEnvironment(params: Finspace.Types.CreateEnvironmentRequest, callback?: (err: AWSError, data: Finspace.Types.CreateEnvironmentResponse) => void): Request<Finspace.Types.CreateEnvironmentResponse, AWSError>;
  /**
   * Create a new FinSpace environment.
   */
  createEnvironment(callback?: (err: AWSError, data: Finspace.Types.CreateEnvironmentResponse) => void): Request<Finspace.Types.CreateEnvironmentResponse, AWSError>;
  /**
   * Delete an FinSpace environment.
   */
  deleteEnvironment(params: Finspace.Types.DeleteEnvironmentRequest, callback?: (err: AWSError, data: Finspace.Types.DeleteEnvironmentResponse) => void): Request<Finspace.Types.DeleteEnvironmentResponse, AWSError>;
  /**
   * Delete an FinSpace environment.
   */
  deleteEnvironment(callback?: (err: AWSError, data: Finspace.Types.DeleteEnvironmentResponse) => void): Request<Finspace.Types.DeleteEnvironmentResponse, AWSError>;
  /**
   * Returns the FinSpace environment object.
   */
  getEnvironment(params: Finspace.Types.GetEnvironmentRequest, callback?: (err: AWSError, data: Finspace.Types.GetEnvironmentResponse) => void): Request<Finspace.Types.GetEnvironmentResponse, AWSError>;
  /**
   * Returns the FinSpace environment object.
   */
  getEnvironment(callback?: (err: AWSError, data: Finspace.Types.GetEnvironmentResponse) => void): Request<Finspace.Types.GetEnvironmentResponse, AWSError>;
  /**
   * A list of all of your FinSpace environments.
   */
  listEnvironments(params: Finspace.Types.ListEnvironmentsRequest, callback?: (err: AWSError, data: Finspace.Types.ListEnvironmentsResponse) => void): Request<Finspace.Types.ListEnvironmentsResponse, AWSError>;
  /**
   * A list of all of your FinSpace environments.
   */
  listEnvironments(callback?: (err: AWSError, data: Finspace.Types.ListEnvironmentsResponse) => void): Request<Finspace.Types.ListEnvironmentsResponse, AWSError>;
  /**
   * A list of all tags for a resource.
   */
  listTagsForResource(params: Finspace.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Finspace.Types.ListTagsForResourceResponse) => void): Request<Finspace.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * A list of all tags for a resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Finspace.Types.ListTagsForResourceResponse) => void): Request<Finspace.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Adds metadata tags to a FinSpace resource.
   */
  tagResource(params: Finspace.Types.TagResourceRequest, callback?: (err: AWSError, data: Finspace.Types.TagResourceResponse) => void): Request<Finspace.Types.TagResourceResponse, AWSError>;
  /**
   * Adds metadata tags to a FinSpace resource.
   */
  tagResource(callback?: (err: AWSError, data: Finspace.Types.TagResourceResponse) => void): Request<Finspace.Types.TagResourceResponse, AWSError>;
  /**
   * Removes metadata tags from a FinSpace resource.
   */
  untagResource(params: Finspace.Types.UntagResourceRequest, callback?: (err: AWSError, data: Finspace.Types.UntagResourceResponse) => void): Request<Finspace.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes metadata tags from a FinSpace resource.
   */
  untagResource(callback?: (err: AWSError, data: Finspace.Types.UntagResourceResponse) => void): Request<Finspace.Types.UntagResourceResponse, AWSError>;
  /**
   * Update your FinSpace environment.
   */
  updateEnvironment(params: Finspace.Types.UpdateEnvironmentRequest, callback?: (err: AWSError, data: Finspace.Types.UpdateEnvironmentResponse) => void): Request<Finspace.Types.UpdateEnvironmentResponse, AWSError>;
  /**
   * Update your FinSpace environment.
   */
  updateEnvironment(callback?: (err: AWSError, data: Finspace.Types.UpdateEnvironmentResponse) => void): Request<Finspace.Types.UpdateEnvironmentResponse, AWSError>;
}
declare namespace Finspace {
  export type AttributeMap = {[key: string]: url};
  export interface CreateEnvironmentRequest {
    /**
     * The name of the FinSpace environment to be created.
     */
    name: EnvironmentName;
    /**
     * The description of the FinSpace environment to be created.
     */
    description?: Description;
    /**
     * The KMS key id to encrypt your data in the FinSpace environment.
     */
    kmsKeyId?: KmsKeyId;
    /**
     * Add tags to your FinSpace environment.
     */
    tags?: TagMap;
    /**
     * Authentication mode for the environment.    FEDERATED - Users access FinSpace through Single Sign On (SSO) via your Identity provider.    LOCAL - Users access FinSpace via email and password managed within the FinSpace environment.  
     */
    federationMode?: FederationMode;
    /**
     * Configuration information when authentication mode is FEDERATED.
     */
    federationParameters?: FederationParameters;
  }
  export interface CreateEnvironmentResponse {
    /**
     * The unique identifier for FinSpace environment that you created.
     */
    environmentId?: IdType;
    /**
     * The Amazon Resource Name (ARN) of the FinSpace environment that you created.
     */
    environmentArn?: EnvironmentArn;
    /**
     * The sign-in url for the web application of the FinSpace environment you created.
     */
    environmentUrl?: url;
  }
  export interface DeleteEnvironmentRequest {
    /**
     * The identifier for the FinSpace environment.
     */
    environmentId: IdType;
  }
  export interface DeleteEnvironmentResponse {
  }
  export type Description = string;
  export interface Environment {
    /**
     * The name of the FinSpace environment.
     */
    name?: EnvironmentName;
    /**
     * The identifier of the FinSpace environment.
     */
    environmentId?: IdType;
    /**
     * The ID of the AWS account in which the FinSpace environment is created.
     */
    awsAccountId?: IdType;
    /**
     * The current status of creation of the FinSpace environment.
     */
    status?: EnvironmentStatus;
    /**
     * The sign-in url for the web application of your FinSpace environment.
     */
    environmentUrl?: url;
    /**
     * The description of the FinSpace environment.
     */
    description?: Description;
    /**
     * The Amazon Resource Name (ARN) of your FinSpace environment.
     */
    environmentArn?: EnvironmentArn;
    /**
     * The url of the integrated FinSpace notebook environment in your web application.
     */
    sageMakerStudioDomainUrl?: SmsDomainUrl;
    /**
     * The KMS key id used to encrypt in the FinSpace environment.
     */
    kmsKeyId?: KmsKeyId;
    /**
     * The AWS account ID of the dedicated service account associated with your FinSpace environment.
     */
    dedicatedServiceAccountId?: IdType;
    /**
     * The authentication mode for the environment.
     */
    federationMode?: FederationMode;
    /**
     * Configuration information when authentication mode is FEDERATED.
     */
    federationParameters?: FederationParameters;
  }
  export type EnvironmentArn = string;
  export type EnvironmentList = Environment[];
  export type EnvironmentName = string;
  export type EnvironmentStatus = "CREATE_REQUESTED"|"CREATING"|"CREATED"|"DELETE_REQUESTED"|"DELETING"|"DELETED"|"FAILED_CREATION"|"RETRY_DELETION"|"FAILED_DELETION"|"SUSPENDED"|string;
  export type FederationAttributeKey = string;
  export type FederationMode = "FEDERATED"|"LOCAL"|string;
  export interface FederationParameters {
    /**
     * SAML 2.0 Metadata document from identity provider (IdP).
     */
    samlMetadataDocument?: SamlMetadataDocument;
    /**
     * Provide the metadata URL from your SAML 2.0 compliant identity provider (IdP).
     */
    samlMetadataURL?: url;
    /**
     * The redirect or sign-in URL that should be entered into the SAML 2.0 compliant identity provider configuration (IdP).
     */
    applicationCallBackURL?: url;
    /**
     * The Uniform Resource Name (URN). Also referred as Service Provider URN or Audience URI or Service Provider Entity ID.
     */
    federationURN?: urn;
    /**
     * Name of the identity provider (IdP).
     */
    federationProviderName?: FederationProviderName;
    /**
     * SAML attribute name and value. The name must always be Email and the value should be set to the attribute definition in which user email is set. For example, name would be Email and value http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress. Please check your SAML 2.0 compliant identity provider (IdP) documentation for details.
     */
    attributeMap?: AttributeMap;
  }
  export type FederationProviderName = string;
  export interface GetEnvironmentRequest {
    /**
     * The identifier of the FinSpace environment.
     */
    environmentId: IdType;
  }
  export interface GetEnvironmentResponse {
    /**
     * The name of the FinSpace environment.
     */
    environment?: Environment;
  }
  export type IdType = string;
  export type KmsKeyId = string;
  export interface ListEnvironmentsRequest {
    /**
     * A token generated by FinSpace that specifies where to continue pagination if a previous request was truncated. To get the next set of pages, pass in the nextToken value from the response object of the previous page call.
     */
    nextToken?: PaginationToken;
    /**
     * The maximum number of results to return in this request.
     */
    maxResults?: ResultLimit;
  }
  export interface ListEnvironmentsResponse {
    /**
     * A list of all of your FinSpace environments.
     */
    environments?: EnvironmentList;
    /**
     * A token that you can use in a subsequent call to retrieve the next set of results.
     */
    nextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name of the resource.
     */
    resourceArn: EnvironmentArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of all tags for a resource.
     */
    tags?: TagMap;
  }
  export type PaginationToken = string;
  export type ResultLimit = number;
  export type SamlMetadataDocument = string;
  export type SmsDomainUrl = string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for the resource.
     */
    resourceArn: EnvironmentArn;
    /**
     * One or more tags to be assigned to the resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface UntagResourceRequest {
    /**
     * A FinSpace resource from which you want to remove a tag or tags. The value for this parameter is an Amazon Resource Name (ARN).
     */
    resourceArn: EnvironmentArn;
    /**
     * The tag keys (names) of one or more tags to be removed.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateEnvironmentRequest {
    /**
     * The identifier of the FinSpace environment.
     */
    environmentId: IdType;
    /**
     * The name of the environment.
     */
    name?: EnvironmentName;
    /**
     * The description of the environment.
     */
    description?: Description;
    /**
     * Authentication mode for the environment.    FEDERATED - Users access FinSpace through Single Sign On (SSO) via your Identity provider.    LOCAL - Users access FinSpace via email and password managed within the FinSpace environment.  
     */
    federationMode?: FederationMode;
    federationParameters?: FederationParameters;
  }
  export interface UpdateEnvironmentResponse {
    /**
     * Returns the FinSpace environment object.
     */
    environment?: Environment;
  }
  export type url = string;
  export type urn = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2021-03-12"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Finspace client.
   */
  export import Types = Finspace;
}
export = Finspace;
