import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ECRPUBLIC extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ECRPUBLIC.Types.ClientConfiguration)
  config: Config & ECRPUBLIC.Types.ClientConfiguration;
  /**
   * Checks the availability of one or more image layers within a repository in a public registry. When an image is pushed to a repository, each image layer is checked to verify if it has been uploaded before. If it has been uploaded, then the image layer is skipped.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  batchCheckLayerAvailability(params: ECRPUBLIC.Types.BatchCheckLayerAvailabilityRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.BatchCheckLayerAvailabilityResponse) => void): Request<ECRPUBLIC.Types.BatchCheckLayerAvailabilityResponse, AWSError>;
  /**
   * Checks the availability of one or more image layers within a repository in a public registry. When an image is pushed to a repository, each image layer is checked to verify if it has been uploaded before. If it has been uploaded, then the image layer is skipped.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  batchCheckLayerAvailability(callback?: (err: AWSError, data: ECRPUBLIC.Types.BatchCheckLayerAvailabilityResponse) => void): Request<ECRPUBLIC.Types.BatchCheckLayerAvailabilityResponse, AWSError>;
  /**
   * Deletes a list of specified images within a repository in a public registry. Images are specified with either an imageTag or imageDigest. You can remove a tag from an image by specifying the image's tag in your request. When you remove the last tag from an image, the image is deleted from your repository. You can completely delete an image (and all of its tags) by specifying the image's digest in your request.
   */
  batchDeleteImage(params: ECRPUBLIC.Types.BatchDeleteImageRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.BatchDeleteImageResponse) => void): Request<ECRPUBLIC.Types.BatchDeleteImageResponse, AWSError>;
  /**
   * Deletes a list of specified images within a repository in a public registry. Images are specified with either an imageTag or imageDigest. You can remove a tag from an image by specifying the image's tag in your request. When you remove the last tag from an image, the image is deleted from your repository. You can completely delete an image (and all of its tags) by specifying the image's digest in your request.
   */
  batchDeleteImage(callback?: (err: AWSError, data: ECRPUBLIC.Types.BatchDeleteImageResponse) => void): Request<ECRPUBLIC.Types.BatchDeleteImageResponse, AWSError>;
  /**
   * Informs Amazon ECR that the image layer upload has completed for a specified public registry, repository name, and upload ID. You can optionally provide a sha256 digest of the image layer for data validation purposes. When an image is pushed, the CompleteLayerUpload API is called once per each new image layer to verify that the upload has completed.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  completeLayerUpload(params: ECRPUBLIC.Types.CompleteLayerUploadRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.CompleteLayerUploadResponse) => void): Request<ECRPUBLIC.Types.CompleteLayerUploadResponse, AWSError>;
  /**
   * Informs Amazon ECR that the image layer upload has completed for a specified public registry, repository name, and upload ID. You can optionally provide a sha256 digest of the image layer for data validation purposes. When an image is pushed, the CompleteLayerUpload API is called once per each new image layer to verify that the upload has completed.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  completeLayerUpload(callback?: (err: AWSError, data: ECRPUBLIC.Types.CompleteLayerUploadResponse) => void): Request<ECRPUBLIC.Types.CompleteLayerUploadResponse, AWSError>;
  /**
   * Creates a repository in a public registry. For more information, see Amazon ECR repositories in the Amazon Elastic Container Registry User Guide.
   */
  createRepository(params: ECRPUBLIC.Types.CreateRepositoryRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.CreateRepositoryResponse) => void): Request<ECRPUBLIC.Types.CreateRepositoryResponse, AWSError>;
  /**
   * Creates a repository in a public registry. For more information, see Amazon ECR repositories in the Amazon Elastic Container Registry User Guide.
   */
  createRepository(callback?: (err: AWSError, data: ECRPUBLIC.Types.CreateRepositoryResponse) => void): Request<ECRPUBLIC.Types.CreateRepositoryResponse, AWSError>;
  /**
   * Deletes a repository in a public registry. If the repository contains images, you must either delete all images in the repository or use the force option which deletes all images on your behalf before deleting the repository.
   */
  deleteRepository(params: ECRPUBLIC.Types.DeleteRepositoryRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.DeleteRepositoryResponse) => void): Request<ECRPUBLIC.Types.DeleteRepositoryResponse, AWSError>;
  /**
   * Deletes a repository in a public registry. If the repository contains images, you must either delete all images in the repository or use the force option which deletes all images on your behalf before deleting the repository.
   */
  deleteRepository(callback?: (err: AWSError, data: ECRPUBLIC.Types.DeleteRepositoryResponse) => void): Request<ECRPUBLIC.Types.DeleteRepositoryResponse, AWSError>;
  /**
   * Deletes the repository policy associated with the specified repository.
   */
  deleteRepositoryPolicy(params: ECRPUBLIC.Types.DeleteRepositoryPolicyRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.DeleteRepositoryPolicyResponse) => void): Request<ECRPUBLIC.Types.DeleteRepositoryPolicyResponse, AWSError>;
  /**
   * Deletes the repository policy associated with the specified repository.
   */
  deleteRepositoryPolicy(callback?: (err: AWSError, data: ECRPUBLIC.Types.DeleteRepositoryPolicyResponse) => void): Request<ECRPUBLIC.Types.DeleteRepositoryPolicyResponse, AWSError>;
  /**
   * Returns the image tag details for a repository in a public registry.
   */
  describeImageTags(params: ECRPUBLIC.Types.DescribeImageTagsRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.DescribeImageTagsResponse) => void): Request<ECRPUBLIC.Types.DescribeImageTagsResponse, AWSError>;
  /**
   * Returns the image tag details for a repository in a public registry.
   */
  describeImageTags(callback?: (err: AWSError, data: ECRPUBLIC.Types.DescribeImageTagsResponse) => void): Request<ECRPUBLIC.Types.DescribeImageTagsResponse, AWSError>;
  /**
   * Returns metadata about the images in a repository in a public registry.  Beginning with Docker version 1.9, the Docker client compresses image layers before pushing them to a V2 Docker registry. The output of the docker images command shows the uncompressed image size, so it may return a larger image size than the image sizes returned by DescribeImages. 
   */
  describeImages(params: ECRPUBLIC.Types.DescribeImagesRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.DescribeImagesResponse) => void): Request<ECRPUBLIC.Types.DescribeImagesResponse, AWSError>;
  /**
   * Returns metadata about the images in a repository in a public registry.  Beginning with Docker version 1.9, the Docker client compresses image layers before pushing them to a V2 Docker registry. The output of the docker images command shows the uncompressed image size, so it may return a larger image size than the image sizes returned by DescribeImages. 
   */
  describeImages(callback?: (err: AWSError, data: ECRPUBLIC.Types.DescribeImagesResponse) => void): Request<ECRPUBLIC.Types.DescribeImagesResponse, AWSError>;
  /**
   * Returns details for a public registry.
   */
  describeRegistries(params: ECRPUBLIC.Types.DescribeRegistriesRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.DescribeRegistriesResponse) => void): Request<ECRPUBLIC.Types.DescribeRegistriesResponse, AWSError>;
  /**
   * Returns details for a public registry.
   */
  describeRegistries(callback?: (err: AWSError, data: ECRPUBLIC.Types.DescribeRegistriesResponse) => void): Request<ECRPUBLIC.Types.DescribeRegistriesResponse, AWSError>;
  /**
   * Describes repositories in a public registry.
   */
  describeRepositories(params: ECRPUBLIC.Types.DescribeRepositoriesRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.DescribeRepositoriesResponse) => void): Request<ECRPUBLIC.Types.DescribeRepositoriesResponse, AWSError>;
  /**
   * Describes repositories in a public registry.
   */
  describeRepositories(callback?: (err: AWSError, data: ECRPUBLIC.Types.DescribeRepositoriesResponse) => void): Request<ECRPUBLIC.Types.DescribeRepositoriesResponse, AWSError>;
  /**
   * Retrieves an authorization token. An authorization token represents your IAM authentication credentials and can be used to access any Amazon ECR registry that your IAM principal has access to. The authorization token is valid for 12 hours. This API requires the ecr-public:GetAuthorizationToken and sts:GetServiceBearerToken permissions.
   */
  getAuthorizationToken(params: ECRPUBLIC.Types.GetAuthorizationTokenRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.GetAuthorizationTokenResponse) => void): Request<ECRPUBLIC.Types.GetAuthorizationTokenResponse, AWSError>;
  /**
   * Retrieves an authorization token. An authorization token represents your IAM authentication credentials and can be used to access any Amazon ECR registry that your IAM principal has access to. The authorization token is valid for 12 hours. This API requires the ecr-public:GetAuthorizationToken and sts:GetServiceBearerToken permissions.
   */
  getAuthorizationToken(callback?: (err: AWSError, data: ECRPUBLIC.Types.GetAuthorizationTokenResponse) => void): Request<ECRPUBLIC.Types.GetAuthorizationTokenResponse, AWSError>;
  /**
   * Retrieves catalog metadata for a public registry.
   */
  getRegistryCatalogData(params: ECRPUBLIC.Types.GetRegistryCatalogDataRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.GetRegistryCatalogDataResponse) => void): Request<ECRPUBLIC.Types.GetRegistryCatalogDataResponse, AWSError>;
  /**
   * Retrieves catalog metadata for a public registry.
   */
  getRegistryCatalogData(callback?: (err: AWSError, data: ECRPUBLIC.Types.GetRegistryCatalogDataResponse) => void): Request<ECRPUBLIC.Types.GetRegistryCatalogDataResponse, AWSError>;
  /**
   * Retrieve catalog metadata for a repository in a public registry. This metadata is displayed publicly in the Amazon ECR Public Gallery.
   */
  getRepositoryCatalogData(params: ECRPUBLIC.Types.GetRepositoryCatalogDataRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.GetRepositoryCatalogDataResponse) => void): Request<ECRPUBLIC.Types.GetRepositoryCatalogDataResponse, AWSError>;
  /**
   * Retrieve catalog metadata for a repository in a public registry. This metadata is displayed publicly in the Amazon ECR Public Gallery.
   */
  getRepositoryCatalogData(callback?: (err: AWSError, data: ECRPUBLIC.Types.GetRepositoryCatalogDataResponse) => void): Request<ECRPUBLIC.Types.GetRepositoryCatalogDataResponse, AWSError>;
  /**
   * Retrieves the repository policy for the specified repository.
   */
  getRepositoryPolicy(params: ECRPUBLIC.Types.GetRepositoryPolicyRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.GetRepositoryPolicyResponse) => void): Request<ECRPUBLIC.Types.GetRepositoryPolicyResponse, AWSError>;
  /**
   * Retrieves the repository policy for the specified repository.
   */
  getRepositoryPolicy(callback?: (err: AWSError, data: ECRPUBLIC.Types.GetRepositoryPolicyResponse) => void): Request<ECRPUBLIC.Types.GetRepositoryPolicyResponse, AWSError>;
  /**
   * Notifies Amazon ECR that you intend to upload an image layer. When an image is pushed, the InitiateLayerUpload API is called once per image layer that has not already been uploaded. Whether or not an image layer has been uploaded is determined by the BatchCheckLayerAvailability API action.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  initiateLayerUpload(params: ECRPUBLIC.Types.InitiateLayerUploadRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.InitiateLayerUploadResponse) => void): Request<ECRPUBLIC.Types.InitiateLayerUploadResponse, AWSError>;
  /**
   * Notifies Amazon ECR that you intend to upload an image layer. When an image is pushed, the InitiateLayerUpload API is called once per image layer that has not already been uploaded. Whether or not an image layer has been uploaded is determined by the BatchCheckLayerAvailability API action.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  initiateLayerUpload(callback?: (err: AWSError, data: ECRPUBLIC.Types.InitiateLayerUploadResponse) => void): Request<ECRPUBLIC.Types.InitiateLayerUploadResponse, AWSError>;
  /**
   * List the tags for an Amazon ECR Public resource.
   */
  listTagsForResource(params: ECRPUBLIC.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.ListTagsForResourceResponse) => void): Request<ECRPUBLIC.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List the tags for an Amazon ECR Public resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ECRPUBLIC.Types.ListTagsForResourceResponse) => void): Request<ECRPUBLIC.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates or updates the image manifest and tags associated with an image. When an image is pushed and all new image layers have been uploaded, the PutImage API is called once to create or update the image manifest and the tags associated with the image.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  putImage(params: ECRPUBLIC.Types.PutImageRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.PutImageResponse) => void): Request<ECRPUBLIC.Types.PutImageResponse, AWSError>;
  /**
   * Creates or updates the image manifest and tags associated with an image. When an image is pushed and all new image layers have been uploaded, the PutImage API is called once to create or update the image manifest and the tags associated with the image.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  putImage(callback?: (err: AWSError, data: ECRPUBLIC.Types.PutImageResponse) => void): Request<ECRPUBLIC.Types.PutImageResponse, AWSError>;
  /**
   * Create or updates the catalog data for a public registry.
   */
  putRegistryCatalogData(params: ECRPUBLIC.Types.PutRegistryCatalogDataRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.PutRegistryCatalogDataResponse) => void): Request<ECRPUBLIC.Types.PutRegistryCatalogDataResponse, AWSError>;
  /**
   * Create or updates the catalog data for a public registry.
   */
  putRegistryCatalogData(callback?: (err: AWSError, data: ECRPUBLIC.Types.PutRegistryCatalogDataResponse) => void): Request<ECRPUBLIC.Types.PutRegistryCatalogDataResponse, AWSError>;
  /**
   * Creates or updates the catalog data for a repository in a public registry.
   */
  putRepositoryCatalogData(params: ECRPUBLIC.Types.PutRepositoryCatalogDataRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.PutRepositoryCatalogDataResponse) => void): Request<ECRPUBLIC.Types.PutRepositoryCatalogDataResponse, AWSError>;
  /**
   * Creates or updates the catalog data for a repository in a public registry.
   */
  putRepositoryCatalogData(callback?: (err: AWSError, data: ECRPUBLIC.Types.PutRepositoryCatalogDataResponse) => void): Request<ECRPUBLIC.Types.PutRepositoryCatalogDataResponse, AWSError>;
  /**
   * Applies a repository policy to the specified public repository to control access permissions. For more information, see Amazon ECR Repository Policies in the Amazon Elastic Container Registry User Guide.
   */
  setRepositoryPolicy(params: ECRPUBLIC.Types.SetRepositoryPolicyRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.SetRepositoryPolicyResponse) => void): Request<ECRPUBLIC.Types.SetRepositoryPolicyResponse, AWSError>;
  /**
   * Applies a repository policy to the specified public repository to control access permissions. For more information, see Amazon ECR Repository Policies in the Amazon Elastic Container Registry User Guide.
   */
  setRepositoryPolicy(callback?: (err: AWSError, data: ECRPUBLIC.Types.SetRepositoryPolicyResponse) => void): Request<ECRPUBLIC.Types.SetRepositoryPolicyResponse, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. When a resource is deleted, the tags associated with that resource are deleted as well.
   */
  tagResource(params: ECRPUBLIC.Types.TagResourceRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.TagResourceResponse) => void): Request<ECRPUBLIC.Types.TagResourceResponse, AWSError>;
  /**
   * Associates the specified tags to a resource with the specified resourceArn. If existing tags on a resource are not specified in the request parameters, they are not changed. When a resource is deleted, the tags associated with that resource are deleted as well.
   */
  tagResource(callback?: (err: AWSError, data: ECRPUBLIC.Types.TagResourceResponse) => void): Request<ECRPUBLIC.Types.TagResourceResponse, AWSError>;
  /**
   * Deletes specified tags from a resource.
   */
  untagResource(params: ECRPUBLIC.Types.UntagResourceRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.UntagResourceResponse) => void): Request<ECRPUBLIC.Types.UntagResourceResponse, AWSError>;
  /**
   * Deletes specified tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: ECRPUBLIC.Types.UntagResourceResponse) => void): Request<ECRPUBLIC.Types.UntagResourceResponse, AWSError>;
  /**
   * Uploads an image layer part to Amazon ECR. When an image is pushed, each new image layer is uploaded in parts. The maximum size of each image layer part can be 20971520 bytes (or about 20MB). The UploadLayerPart API is called once per each new image layer part.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  uploadLayerPart(params: ECRPUBLIC.Types.UploadLayerPartRequest, callback?: (err: AWSError, data: ECRPUBLIC.Types.UploadLayerPartResponse) => void): Request<ECRPUBLIC.Types.UploadLayerPartResponse, AWSError>;
  /**
   * Uploads an image layer part to Amazon ECR. When an image is pushed, each new image layer is uploaded in parts. The maximum size of each image layer part can be 20971520 bytes (or about 20MB). The UploadLayerPart API is called once per each new image layer part.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  uploadLayerPart(callback?: (err: AWSError, data: ECRPUBLIC.Types.UploadLayerPartResponse) => void): Request<ECRPUBLIC.Types.UploadLayerPartResponse, AWSError>;
}
declare namespace ECRPUBLIC {
  export type AboutText = string;
  export type Architecture = string;
  export type ArchitectureList = Architecture[];
  export type Arn = string;
  export interface AuthorizationData {
    /**
     * A base64-encoded string that contains authorization data for a public Amazon ECR registry. When the string is decoded, it is presented in the format user:password for public registry authentication using docker login.
     */
    authorizationToken?: Base64;
    /**
     * The Unix time in seconds and milliseconds when the authorization token expires. Authorization tokens are valid for 12 hours.
     */
    expiresAt?: ExpirationTimestamp;
  }
  export type Base64 = string;
  export interface BatchCheckLayerAvailabilityRequest {
    /**
     * The AWS account ID associated with the public registry that contains the image layers to check. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryIdOrAlias;
    /**
     * The name of the repository that is associated with the image layers to check.
     */
    repositoryName: RepositoryName;
    /**
     * The digests of the image layers to check.
     */
    layerDigests: BatchedOperationLayerDigestList;
  }
  export interface BatchCheckLayerAvailabilityResponse {
    /**
     * A list of image layer objects corresponding to the image layer references in the request.
     */
    layers?: LayerList;
    /**
     * Any failures associated with the call.
     */
    failures?: LayerFailureList;
  }
  export interface BatchDeleteImageRequest {
    /**
     * The AWS account ID associated with the registry that contains the image to delete. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The repository in a public registry that contains the image to delete.
     */
    repositoryName: RepositoryName;
    /**
     * A list of image ID references that correspond to images to delete. The format of the imageIds reference is imageTag=tag or imageDigest=digest.
     */
    imageIds: ImageIdentifierList;
  }
  export interface BatchDeleteImageResponse {
    /**
     * The image IDs of the deleted images.
     */
    imageIds?: ImageIdentifierList;
    /**
     * Any failures associated with the call.
     */
    failures?: ImageFailureList;
  }
  export type BatchedOperationLayerDigest = string;
  export type BatchedOperationLayerDigestList = BatchedOperationLayerDigest[];
  export interface CompleteLayerUploadRequest {
    /**
     * The AWS account ID associated with the registry to which to upload layers. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryIdOrAlias;
    /**
     * The name of the repository in a public registry to associate with the image layer.
     */
    repositoryName: RepositoryName;
    /**
     * The upload ID from a previous InitiateLayerUpload operation to associate with the image layer.
     */
    uploadId: UploadId;
    /**
     * The sha256 digest of the image layer.
     */
    layerDigests: LayerDigestList;
  }
  export interface CompleteLayerUploadResponse {
    /**
     * The public registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The upload ID associated with the layer.
     */
    uploadId?: UploadId;
    /**
     * The sha256 digest of the image layer.
     */
    layerDigest?: LayerDigest;
  }
  export interface CreateRepositoryRequest {
    /**
     * The name to use for the repository. This appears publicly in the Amazon ECR Public Gallery. The repository name may be specified on its own (such as nginx-web-app) or it can be prepended with a namespace to group the repository into a category (such as project-a/nginx-web-app).
     */
    repositoryName: RepositoryName;
    /**
     * The details about the repository that are publicly visible in the Amazon ECR Public Gallery.
     */
    catalogData?: RepositoryCatalogDataInput;
    /**
     * The metadata that you apply to the repository to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     */
    tags?: TagList;
  }
  export interface CreateRepositoryResponse {
    /**
     * The repository that was created.
     */
    repository?: Repository;
    catalogData?: RepositoryCatalogData;
  }
  export type CreationTimestamp = Date;
  export type DefaultRegistryAliasFlag = boolean;
  export interface DeleteRepositoryPolicyRequest {
    /**
     * The AWS account ID associated with the public registry that contains the repository policy to delete. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository that is associated with the repository policy to delete.
     */
    repositoryName: RepositoryName;
  }
  export interface DeleteRepositoryPolicyResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The JSON repository policy that was deleted from the repository.
     */
    policyText?: RepositoryPolicyText;
  }
  export interface DeleteRepositoryRequest {
    /**
     * The AWS account ID associated with the public registry that contains the repository to delete. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository to delete.
     */
    repositoryName: RepositoryName;
    /**
     *  If a repository contains images, forces the deletion.
     */
    force?: ForceFlag;
  }
  export interface DeleteRepositoryResponse {
    /**
     * The repository that was deleted.
     */
    repository?: Repository;
  }
  export interface DescribeImageTagsRequest {
    /**
     * The AWS account ID associated with the public registry that contains the repository in which to describe images. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository that contains the image tag details to describe.
     */
    repositoryName: RepositoryName;
    /**
     * The nextToken value returned from a previous paginated DescribeImageTags request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return. This option cannot be used when you specify images with imageIds.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of repository results returned by DescribeImageTags in paginated output. When this parameter is used, DescribeImageTags only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another DescribeImageTags request with the returned nextToken value. This value can be between 1 and 1000. If this parameter is not used, then DescribeImageTags returns up to 100 results and a nextToken value, if applicable. This option cannot be used when you specify images with imageIds.
     */
    maxResults?: MaxResults;
  }
  export interface DescribeImageTagsResponse {
    /**
     * The image tag details for the images in the requested repository.
     */
    imageTagDetails?: ImageTagDetailList;
    /**
     * The nextToken value to include in a future DescribeImageTags request. When the results of a DescribeImageTags request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface DescribeImagesRequest {
    /**
     * The AWS account ID associated with the public registry that contains the repository in which to describe images. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The repository that contains the images to describe.
     */
    repositoryName: RepositoryName;
    /**
     * The list of image IDs for the requested repository.
     */
    imageIds?: ImageIdentifierList;
    /**
     * The nextToken value returned from a previous paginated DescribeImages request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return. This option cannot be used when you specify images with imageIds.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of repository results returned by DescribeImages in paginated output. When this parameter is used, DescribeImages only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another DescribeImages request with the returned nextToken value. This value can be between 1 and 1000. If this parameter is not used, then DescribeImages returns up to 100 results and a nextToken value, if applicable. This option cannot be used when you specify images with imageIds.
     */
    maxResults?: MaxResults;
  }
  export interface DescribeImagesResponse {
    /**
     * A list of ImageDetail objects that contain data about the image.
     */
    imageDetails?: ImageDetailList;
    /**
     * The nextToken value to include in a future DescribeImages request. When the results of a DescribeImages request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface DescribeRegistriesRequest {
    /**
     * The nextToken value returned from a previous paginated DescribeRegistries request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  This token should be treated as an opaque identifier that is only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: NextToken;
    /**
     * The maximum number of repository results returned by DescribeRegistries in paginated output. When this parameter is used, DescribeRegistries only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another DescribeRegistries request with the returned nextToken value. This value can be between 1 and 1000. If this parameter is not used, then DescribeRegistries returns up to 100 results and a nextToken value, if applicable.
     */
    maxResults?: MaxResults;
  }
  export interface DescribeRegistriesResponse {
    /**
     * An object containing the details for a public registry.
     */
    registries: RegistryList;
    /**
     * The nextToken value to include in a future DescribeRepositories request. When the results of a DescribeRepositories request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface DescribeRepositoriesRequest {
    /**
     * The AWS account ID associated with the registry that contains the repositories to be described. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * A list of repositories to describe. If this parameter is omitted, then all repositories in a registry are described.
     */
    repositoryNames?: RepositoryNameList;
    /**
     * The nextToken value returned from a previous paginated DescribeRepositories request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return. This option cannot be used when you specify repositories with repositoryNames.  This token should be treated as an opaque identifier that is only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: NextToken;
    /**
     * The maximum number of repository results returned by DescribeRepositories in paginated output. When this parameter is used, DescribeRepositories only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another DescribeRepositories request with the returned nextToken value. This value can be between 1 and 1000. If this parameter is not used, then DescribeRepositories returns up to 100 results and a nextToken value, if applicable. This option cannot be used when you specify repositories with repositoryNames.
     */
    maxResults?: MaxResults;
  }
  export interface DescribeRepositoriesResponse {
    /**
     * A list of repository objects corresponding to valid repositories.
     */
    repositories?: RepositoryList;
    /**
     * The nextToken value to include in a future DescribeRepositories request. When the results of a DescribeRepositories request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export type ExpirationTimestamp = Date;
  export type ForceFlag = boolean;
  export interface GetAuthorizationTokenRequest {
  }
  export interface GetAuthorizationTokenResponse {
    /**
     * An authorization token data object that corresponds to a public registry.
     */
    authorizationData?: AuthorizationData;
  }
  export interface GetRegistryCatalogDataRequest {
  }
  export interface GetRegistryCatalogDataResponse {
    /**
     * The catalog metadata for the public registry.
     */
    registryCatalogData: RegistryCatalogData;
  }
  export interface GetRepositoryCatalogDataRequest {
    /**
     * The AWS account ID associated with the registry that contains the repositories to be described. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository to retrieve the catalog metadata for.
     */
    repositoryName: RepositoryName;
  }
  export interface GetRepositoryCatalogDataResponse {
    /**
     * The catalog metadata for the repository.
     */
    catalogData?: RepositoryCatalogData;
  }
  export interface GetRepositoryPolicyRequest {
    /**
     * The AWS account ID associated with the public registry that contains the repository. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository with the policy to retrieve.
     */
    repositoryName: RepositoryName;
  }
  export interface GetRepositoryPolicyResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The repository policy text associated with the repository. The policy text will be in JSON format.
     */
    policyText?: RepositoryPolicyText;
  }
  export interface Image {
    /**
     * The AWS account ID associated with the registry containing the image.
     */
    registryId?: RegistryIdOrAlias;
    /**
     * The name of the repository associated with the image.
     */
    repositoryName?: RepositoryName;
    /**
     * An object containing the image tag and image digest associated with an image.
     */
    imageId?: ImageIdentifier;
    /**
     * The image manifest associated with the image.
     */
    imageManifest?: ImageManifest;
    /**
     * The manifest media type of the image.
     */
    imageManifestMediaType?: MediaType;
  }
  export interface ImageDetail {
    /**
     * The AWS account ID associated with the public registry to which this image belongs.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository to which this image belongs.
     */
    repositoryName?: RepositoryName;
    /**
     * The sha256 digest of the image manifest.
     */
    imageDigest?: ImageDigest;
    /**
     * The list of tags associated with this image.
     */
    imageTags?: ImageTagList;
    /**
     * The size, in bytes, of the image in the repository. If the image is a manifest list, this will be the max size of all manifests in the list.  Beginning with Docker version 1.9, the Docker client compresses image layers before pushing them to a V2 Docker registry. The output of the docker images command shows the uncompressed image size, so it may return a larger image size than the image sizes returned by DescribeImages. 
     */
    imageSizeInBytes?: ImageSizeInBytes;
    /**
     * The date and time, expressed in standard JavaScript date format, at which the current image was pushed to the repository. 
     */
    imagePushedAt?: PushTimestamp;
    /**
     * The media type of the image manifest.
     */
    imageManifestMediaType?: MediaType;
    /**
     * The artifact media type of the image.
     */
    artifactMediaType?: MediaType;
  }
  export type ImageDetailList = ImageDetail[];
  export type ImageDigest = string;
  export interface ImageFailure {
    /**
     * The image ID associated with the failure.
     */
    imageId?: ImageIdentifier;
    /**
     * The code associated with the failure.
     */
    failureCode?: ImageFailureCode;
    /**
     * The reason for the failure.
     */
    failureReason?: ImageFailureReason;
  }
  export type ImageFailureCode = "InvalidImageDigest"|"InvalidImageTag"|"ImageTagDoesNotMatchDigest"|"ImageNotFound"|"MissingDigestAndTag"|"ImageReferencedByManifestList"|"KmsError"|string;
  export type ImageFailureList = ImageFailure[];
  export type ImageFailureReason = string;
  export interface ImageIdentifier {
    /**
     * The sha256 digest of the image manifest.
     */
    imageDigest?: ImageDigest;
    /**
     * The tag used for the image.
     */
    imageTag?: ImageTag;
  }
  export type ImageIdentifierList = ImageIdentifier[];
  export type ImageManifest = string;
  export type ImageSizeInBytes = number;
  export type ImageTag = string;
  export interface ImageTagDetail {
    /**
     * The tag associated with the image.
     */
    imageTag?: ImageTag;
    /**
     * The time stamp indicating when the image tag was created.
     */
    createdAt?: CreationTimestamp;
    /**
     * An object that describes the details of an image.
     */
    imageDetail?: ReferencedImageDetail;
  }
  export type ImageTagDetailList = ImageTagDetail[];
  export type ImageTagList = ImageTag[];
  export interface InitiateLayerUploadRequest {
    /**
     * The AWS account ID associated with the registry to which you intend to upload layers. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryIdOrAlias;
    /**
     * The name of the repository to which you intend to upload layers.
     */
    repositoryName: RepositoryName;
  }
  export interface InitiateLayerUploadResponse {
    /**
     * The upload ID for the layer upload. This parameter is passed to further UploadLayerPart and CompleteLayerUpload operations.
     */
    uploadId?: UploadId;
    /**
     * The size, in bytes, that Amazon ECR expects future layer part uploads to be.
     */
    partSize?: PartSize;
  }
  export interface Layer {
    /**
     * The sha256 digest of the image layer.
     */
    layerDigest?: LayerDigest;
    /**
     * The availability status of the image layer.
     */
    layerAvailability?: LayerAvailability;
    /**
     * The size, in bytes, of the image layer.
     */
    layerSize?: LayerSizeInBytes;
    /**
     * The media type of the layer, such as application/vnd.docker.image.rootfs.diff.tar.gzip or application/vnd.oci.image.layer.v1.tar+gzip.
     */
    mediaType?: MediaType;
  }
  export type LayerAvailability = "AVAILABLE"|"UNAVAILABLE"|string;
  export type LayerDigest = string;
  export type LayerDigestList = LayerDigest[];
  export interface LayerFailure {
    /**
     * The layer digest associated with the failure.
     */
    layerDigest?: BatchedOperationLayerDigest;
    /**
     * The failure code associated with the failure.
     */
    failureCode?: LayerFailureCode;
    /**
     * The reason for the failure.
     */
    failureReason?: LayerFailureReason;
  }
  export type LayerFailureCode = "InvalidLayerDigest"|"MissingLayerDigest"|string;
  export type LayerFailureList = LayerFailure[];
  export type LayerFailureReason = string;
  export type LayerList = Layer[];
  export type LayerPartBlob = Buffer|Uint8Array|Blob|string;
  export type LayerSizeInBytes = number;
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. Currently, the supported resource is an Amazon ECR Public repository.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the resource.
     */
    tags?: TagList;
  }
  export type LogoImageBlob = Buffer|Uint8Array|Blob|string;
  export type MarketplaceCertified = boolean;
  export type MaxResults = number;
  export type MediaType = string;
  export type NextToken = string;
  export type OperatingSystem = string;
  export type OperatingSystemList = OperatingSystem[];
  export type PartSize = number;
  export type PrimaryRegistryAliasFlag = boolean;
  export type PushTimestamp = Date;
  export interface PutImageRequest {
    /**
     * The AWS account ID associated with the public registry that contains the repository in which to put the image. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryIdOrAlias;
    /**
     * The name of the repository in which to put the image.
     */
    repositoryName: RepositoryName;
    /**
     * The image manifest corresponding to the image to be uploaded.
     */
    imageManifest: ImageManifest;
    /**
     * The media type of the image manifest. If you push an image manifest that does not contain the mediaType field, you must specify the imageManifestMediaType in the request.
     */
    imageManifestMediaType?: MediaType;
    /**
     * The tag to associate with the image. This parameter is required for images that use the Docker Image Manifest V2 Schema 2 or Open Container Initiative (OCI) formats.
     */
    imageTag?: ImageTag;
    /**
     * The image digest of the image manifest corresponding to the image.
     */
    imageDigest?: ImageDigest;
  }
  export interface PutImageResponse {
    /**
     * Details of the image uploaded.
     */
    image?: Image;
  }
  export interface PutRegistryCatalogDataRequest {
    /**
     * The display name for a public registry. The display name is shown as the repository author in the Amazon ECR Public Gallery.  The registry display name is only publicly visible in the Amazon ECR Public Gallery for verified accounts. 
     */
    displayName?: RegistryDisplayName;
  }
  export interface PutRegistryCatalogDataResponse {
    /**
     * The catalog data for the public registry.
     */
    registryCatalogData: RegistryCatalogData;
  }
  export interface PutRepositoryCatalogDataRequest {
    /**
     * The AWS account ID associated with the public registry the repository is in. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository to create or update the catalog data for.
     */
    repositoryName: RepositoryName;
    /**
     * An object containing the catalog data for a repository. This data is publicly visible in the Amazon ECR Public Gallery.
     */
    catalogData: RepositoryCatalogDataInput;
  }
  export interface PutRepositoryCatalogDataResponse {
    /**
     * The catalog data for the repository.
     */
    catalogData?: RepositoryCatalogData;
  }
  export interface ReferencedImageDetail {
    /**
     * The sha256 digest of the image manifest.
     */
    imageDigest?: ImageDigest;
    /**
     * The size, in bytes, of the image in the repository. If the image is a manifest list, this will be the max size of all manifests in the list.  Beginning with Docker version 1.9, the Docker client compresses image layers before pushing them to a V2 Docker registry. The output of the docker images command shows the uncompressed image size, so it may return a larger image size than the image sizes returned by DescribeImages. 
     */
    imageSizeInBytes?: ImageSizeInBytes;
    /**
     * The date and time, expressed in standard JavaScript date format, at which the current image tag was pushed to the repository.
     */
    imagePushedAt?: PushTimestamp;
    /**
     * The media type of the image manifest.
     */
    imageManifestMediaType?: MediaType;
    /**
     * The artifact media type of the image.
     */
    artifactMediaType?: MediaType;
  }
  export interface Registry {
    /**
     * The AWS account ID associated with the registry. If you do not specify a registry, the default public registry is assumed.
     */
    registryId: RegistryId;
    /**
     * The Amazon Resource Name (ARN) of the public registry.
     */
    registryArn: Arn;
    /**
     * The URI of a public registry. The URI contains a universal prefix and the registry alias.
     */
    registryUri: Url;
    /**
     * Whether the account is verified. This indicates whether the account is an AWS Marketplace vendor. If an account is verified, each public repository will received a verified account badge on the Amazon ECR Public Gallery.
     */
    verified: RegistryVerified;
    /**
     * An array of objects representing the aliases for a public registry.
     */
    aliases: RegistryAliasList;
  }
  export interface RegistryAlias {
    /**
     * The name of the registry alias.
     */
    name: RegistryAliasName;
    /**
     * The status of the registry alias.
     */
    status: RegistryAliasStatus;
    /**
     * Whether or not the registry alias is the primary alias for the registry. If true, the alias is the primary registry alias and is displayed in both the repository URL and the image URI used in the docker pull commands on the Amazon ECR Public Gallery.  A registry alias that is not the primary registry alias can be used in the repository URI in a docker pull command. 
     */
    primaryRegistryAlias: PrimaryRegistryAliasFlag;
    /**
     * Whether or not the registry alias is the default alias for the registry. When the first public repository is created, your public registry is assigned a default registry alias.
     */
    defaultRegistryAlias: DefaultRegistryAliasFlag;
  }
  export type RegistryAliasList = RegistryAlias[];
  export type RegistryAliasName = string;
  export type RegistryAliasStatus = "ACTIVE"|"PENDING"|"REJECTED"|string;
  export interface RegistryCatalogData {
    /**
     * The display name for a public registry. This appears on the Amazon ECR Public Gallery.  Only accounts that have the verified account badge can have a registry display name. 
     */
    displayName?: RegistryDisplayName;
  }
  export type RegistryDisplayName = string;
  export type RegistryId = string;
  export type RegistryIdOrAlias = string;
  export type RegistryList = Registry[];
  export type RegistryVerified = boolean;
  export interface Repository {
    /**
     * The Amazon Resource Name (ARN) that identifies the repository. The ARN contains the arn:aws:ecr namespace, followed by the region of the repository, AWS account ID of the repository owner, repository namespace, and repository name. For example, arn:aws:ecr:region:012345678910:repository/test.
     */
    repositoryArn?: Arn;
    /**
     * The AWS account ID associated with the public registry that contains the repository.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository.
     */
    repositoryName?: RepositoryName;
    /**
     * The URI for the repository. You can use this URI for container image push and pull operations.
     */
    repositoryUri?: Url;
    /**
     * The date and time, in JavaScript date format, when the repository was created.
     */
    createdAt?: CreationTimestamp;
  }
  export interface RepositoryCatalogData {
    /**
     * The short description of the repository.
     */
    description?: RepositoryDescription;
    /**
     * The architecture tags that are associated with the repository.  Only supported operating system tags appear publicly in the Amazon ECR Public Gallery. For more information, see RepositoryCatalogDataInput. 
     */
    architectures?: ArchitectureList;
    /**
     * The operating system tags that are associated with the repository.  Only supported operating system tags appear publicly in the Amazon ECR Public Gallery. For more information, see RepositoryCatalogDataInput. 
     */
    operatingSystems?: OperatingSystemList;
    /**
     * The URL containing the logo associated with the repository.
     */
    logoUrl?: ResourceUrl;
    /**
     * The longform description of the contents of the repository. This text appears in the repository details on the Amazon ECR Public Gallery.
     */
    aboutText?: AboutText;
    /**
     * The longform usage details of the contents of the repository. The usage text provides context for users of the repository.
     */
    usageText?: UsageText;
    /**
     * Whether or not the repository is certified by AWS Marketplace.
     */
    marketplaceCertified?: MarketplaceCertified;
  }
  export interface RepositoryCatalogDataInput {
    /**
     * A short description of the contents of the repository. This text appears in both the image details and also when searching for repositories on the Amazon ECR Public Gallery.
     */
    description?: RepositoryDescription;
    /**
     * The system architecture that the images in the repository are compatible with. On the Amazon ECR Public Gallery, the following supported architectures will appear as badges on the repository and are used as search filters.    Linux     Windows     If an unsupported tag is added to your repository catalog data, it will be associated with the repository and can be retrieved using the API but will not be discoverable in the Amazon ECR Public Gallery. 
     */
    architectures?: ArchitectureList;
    /**
     * The operating systems that the images in the repository are compatible with. On the Amazon ECR Public Gallery, the following supported operating systems will appear as badges on the repository and are used as search filters.    ARM     ARM 64     x86     x86-64     If an unsupported tag is added to your repository catalog data, it will be associated with the repository and can be retrieved using the API but will not be discoverable in the Amazon ECR Public Gallery. 
     */
    operatingSystems?: OperatingSystemList;
    /**
     * The base64-encoded repository logo payload.  The repository logo is only publicly visible in the Amazon ECR Public Gallery for verified accounts. 
     */
    logoImageBlob?: LogoImageBlob;
    /**
     * A detailed description of the contents of the repository. It is publicly visible in the Amazon ECR Public Gallery. The text must be in markdown format.
     */
    aboutText?: AboutText;
    /**
     * Detailed information on how to use the contents of the repository. It is publicly visible in the Amazon ECR Public Gallery. The usage text provides context, support information, and additional usage details for users of the repository. The text must be in markdown format.
     */
    usageText?: UsageText;
  }
  export type RepositoryDescription = string;
  export type RepositoryList = Repository[];
  export type RepositoryName = string;
  export type RepositoryNameList = RepositoryName[];
  export type RepositoryPolicyText = string;
  export type ResourceUrl = string;
  export interface SetRepositoryPolicyRequest {
    /**
     * The AWS account ID associated with the registry that contains the repository. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository to receive the policy.
     */
    repositoryName: RepositoryName;
    /**
     * The JSON repository policy text to apply to the repository. For more information, see Amazon ECR Repository Policies in the Amazon Elastic Container Registry User Guide.
     */
    policyText: RepositoryPolicyText;
    /**
     * If the policy you are attempting to set on a repository policy would prevent you from setting another policy in the future, you must force the SetRepositoryPolicy operation. This is intended to prevent accidental repository lock outs.
     */
    force?: ForceFlag;
  }
  export interface SetRepositoryPolicyResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The JSON repository policy text applied to the repository.
     */
    policyText?: RepositoryPolicyText;
  }
  export interface Tag {
    /**
     * One part of a key-value pair that make up a tag. A key is a general label that acts like a category for more specific tag values.
     */
    Key?: TagKey;
    /**
     * The optional part of a key-value pair that make up a tag. A value acts as a descriptor within a tag category (key).
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource to which to add tags. Currently, the supported resource is an Amazon ECR Public repository.
     */
    resourceArn: Arn;
    /**
     * The tags to add to the resource. A tag is an array of key-value pairs. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource from which to delete tags. Currently, the supported resource is an Amazon ECR Public repository.
     */
    resourceArn: Arn;
    /**
     * The keys of the tags to be removed.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export type UploadId = string;
  export interface UploadLayerPartRequest {
    /**
     * The AWS account ID associated with the registry to which you are uploading layer parts. If you do not specify a registry, the default public registry is assumed.
     */
    registryId?: RegistryIdOrAlias;
    /**
     * The name of the repository to which you are uploading layer parts.
     */
    repositoryName: RepositoryName;
    /**
     * The upload ID from a previous InitiateLayerUpload operation to associate with the layer part upload.
     */
    uploadId: UploadId;
    /**
     * The position of the first byte of the layer part witin the overall image layer.
     */
    partFirstByte: PartSize;
    /**
     * The position of the last byte of the layer part within the overall image layer.
     */
    partLastByte: PartSize;
    /**
     * The base64-encoded layer part payload.
     */
    layerPartBlob: LayerPartBlob;
  }
  export interface UploadLayerPartResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The upload ID associated with the request.
     */
    uploadId?: UploadId;
    /**
     * The integer value of the last byte received in the request.
     */
    lastByteReceived?: PartSize;
  }
  export type Url = string;
  export type UsageText = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-10-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ECRPUBLIC client.
   */
  export import Types = ECRPUBLIC;
}
export = ECRPUBLIC;
