import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class ECR extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: ECR.Types.ClientConfiguration)
  config: Config & ECR.Types.ClientConfiguration;
  /**
   * Checks the availability of one or more image layers in a repository. When an image is pushed to a repository, each image layer is checked to verify if it has been uploaded before. If it has been uploaded, then the image layer is skipped.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  batchCheckLayerAvailability(params: ECR.Types.BatchCheckLayerAvailabilityRequest, callback?: (err: AWSError, data: ECR.Types.BatchCheckLayerAvailabilityResponse) => void): Request<ECR.Types.BatchCheckLayerAvailabilityResponse, AWSError>;
  /**
   * Checks the availability of one or more image layers in a repository. When an image is pushed to a repository, each image layer is checked to verify if it has been uploaded before. If it has been uploaded, then the image layer is skipped.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  batchCheckLayerAvailability(callback?: (err: AWSError, data: ECR.Types.BatchCheckLayerAvailabilityResponse) => void): Request<ECR.Types.BatchCheckLayerAvailabilityResponse, AWSError>;
  /**
   * Deletes a list of specified images within a repository. Images are specified with either an imageTag or imageDigest. You can remove a tag from an image by specifying the image's tag in your request. When you remove the last tag from an image, the image is deleted from your repository. You can completely delete an image (and all of its tags) by specifying the image's digest in your request.
   */
  batchDeleteImage(params: ECR.Types.BatchDeleteImageRequest, callback?: (err: AWSError, data: ECR.Types.BatchDeleteImageResponse) => void): Request<ECR.Types.BatchDeleteImageResponse, AWSError>;
  /**
   * Deletes a list of specified images within a repository. Images are specified with either an imageTag or imageDigest. You can remove a tag from an image by specifying the image's tag in your request. When you remove the last tag from an image, the image is deleted from your repository. You can completely delete an image (and all of its tags) by specifying the image's digest in your request.
   */
  batchDeleteImage(callback?: (err: AWSError, data: ECR.Types.BatchDeleteImageResponse) => void): Request<ECR.Types.BatchDeleteImageResponse, AWSError>;
  /**
   * Gets detailed information for an image. Images are specified with either an imageTag or imageDigest. When an image is pulled, the BatchGetImage API is called once to retrieve the image manifest.
   */
  batchGetImage(params: ECR.Types.BatchGetImageRequest, callback?: (err: AWSError, data: ECR.Types.BatchGetImageResponse) => void): Request<ECR.Types.BatchGetImageResponse, AWSError>;
  /**
   * Gets detailed information for an image. Images are specified with either an imageTag or imageDigest. When an image is pulled, the BatchGetImage API is called once to retrieve the image manifest.
   */
  batchGetImage(callback?: (err: AWSError, data: ECR.Types.BatchGetImageResponse) => void): Request<ECR.Types.BatchGetImageResponse, AWSError>;
  /**
   * Informs Amazon ECR that the image layer upload has completed for a specified registry, repository name, and upload ID. You can optionally provide a sha256 digest of the image layer for data validation purposes. When an image is pushed, the CompleteLayerUpload API is called once per each new image layer to verify that the upload has completed.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  completeLayerUpload(params: ECR.Types.CompleteLayerUploadRequest, callback?: (err: AWSError, data: ECR.Types.CompleteLayerUploadResponse) => void): Request<ECR.Types.CompleteLayerUploadResponse, AWSError>;
  /**
   * Informs Amazon ECR that the image layer upload has completed for a specified registry, repository name, and upload ID. You can optionally provide a sha256 digest of the image layer for data validation purposes. When an image is pushed, the CompleteLayerUpload API is called once per each new image layer to verify that the upload has completed.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  completeLayerUpload(callback?: (err: AWSError, data: ECR.Types.CompleteLayerUploadResponse) => void): Request<ECR.Types.CompleteLayerUploadResponse, AWSError>;
  /**
   * Creates a repository. For more information, see Amazon ECR repositories in the Amazon Elastic Container Registry User Guide.
   */
  createRepository(params: ECR.Types.CreateRepositoryRequest, callback?: (err: AWSError, data: ECR.Types.CreateRepositoryResponse) => void): Request<ECR.Types.CreateRepositoryResponse, AWSError>;
  /**
   * Creates a repository. For more information, see Amazon ECR repositories in the Amazon Elastic Container Registry User Guide.
   */
  createRepository(callback?: (err: AWSError, data: ECR.Types.CreateRepositoryResponse) => void): Request<ECR.Types.CreateRepositoryResponse, AWSError>;
  /**
   * Deletes the lifecycle policy associated with the specified repository.
   */
  deleteLifecyclePolicy(params: ECR.Types.DeleteLifecyclePolicyRequest, callback?: (err: AWSError, data: ECR.Types.DeleteLifecyclePolicyResponse) => void): Request<ECR.Types.DeleteLifecyclePolicyResponse, AWSError>;
  /**
   * Deletes the lifecycle policy associated with the specified repository.
   */
  deleteLifecyclePolicy(callback?: (err: AWSError, data: ECR.Types.DeleteLifecyclePolicyResponse) => void): Request<ECR.Types.DeleteLifecyclePolicyResponse, AWSError>;
  /**
   * Deletes the registry permissions policy.
   */
  deleteRegistryPolicy(params: ECR.Types.DeleteRegistryPolicyRequest, callback?: (err: AWSError, data: ECR.Types.DeleteRegistryPolicyResponse) => void): Request<ECR.Types.DeleteRegistryPolicyResponse, AWSError>;
  /**
   * Deletes the registry permissions policy.
   */
  deleteRegistryPolicy(callback?: (err: AWSError, data: ECR.Types.DeleteRegistryPolicyResponse) => void): Request<ECR.Types.DeleteRegistryPolicyResponse, AWSError>;
  /**
   * Deletes a repository. If the repository contains images, you must either delete all images in the repository or use the force option to delete the repository.
   */
  deleteRepository(params: ECR.Types.DeleteRepositoryRequest, callback?: (err: AWSError, data: ECR.Types.DeleteRepositoryResponse) => void): Request<ECR.Types.DeleteRepositoryResponse, AWSError>;
  /**
   * Deletes a repository. If the repository contains images, you must either delete all images in the repository or use the force option to delete the repository.
   */
  deleteRepository(callback?: (err: AWSError, data: ECR.Types.DeleteRepositoryResponse) => void): Request<ECR.Types.DeleteRepositoryResponse, AWSError>;
  /**
   * Deletes the repository policy associated with the specified repository.
   */
  deleteRepositoryPolicy(params: ECR.Types.DeleteRepositoryPolicyRequest, callback?: (err: AWSError, data: ECR.Types.DeleteRepositoryPolicyResponse) => void): Request<ECR.Types.DeleteRepositoryPolicyResponse, AWSError>;
  /**
   * Deletes the repository policy associated with the specified repository.
   */
  deleteRepositoryPolicy(callback?: (err: AWSError, data: ECR.Types.DeleteRepositoryPolicyResponse) => void): Request<ECR.Types.DeleteRepositoryPolicyResponse, AWSError>;
  /**
   * Returns the replication status for a specified image.
   */
  describeImageReplicationStatus(params: ECR.Types.DescribeImageReplicationStatusRequest, callback?: (err: AWSError, data: ECR.Types.DescribeImageReplicationStatusResponse) => void): Request<ECR.Types.DescribeImageReplicationStatusResponse, AWSError>;
  /**
   * Returns the replication status for a specified image.
   */
  describeImageReplicationStatus(callback?: (err: AWSError, data: ECR.Types.DescribeImageReplicationStatusResponse) => void): Request<ECR.Types.DescribeImageReplicationStatusResponse, AWSError>;
  /**
   * Returns the scan findings for the specified image.
   */
  describeImageScanFindings(params: ECR.Types.DescribeImageScanFindingsRequest, callback?: (err: AWSError, data: ECR.Types.DescribeImageScanFindingsResponse) => void): Request<ECR.Types.DescribeImageScanFindingsResponse, AWSError>;
  /**
   * Returns the scan findings for the specified image.
   */
  describeImageScanFindings(callback?: (err: AWSError, data: ECR.Types.DescribeImageScanFindingsResponse) => void): Request<ECR.Types.DescribeImageScanFindingsResponse, AWSError>;
  /**
   * Returns metadata about the images in a repository.  Beginning with Docker version 1.9, the Docker client compresses image layers before pushing them to a V2 Docker registry. The output of the docker images command shows the uncompressed image size, so it may return a larger image size than the image sizes returned by DescribeImages. 
   */
  describeImages(params: ECR.Types.DescribeImagesRequest, callback?: (err: AWSError, data: ECR.Types.DescribeImagesResponse) => void): Request<ECR.Types.DescribeImagesResponse, AWSError>;
  /**
   * Returns metadata about the images in a repository.  Beginning with Docker version 1.9, the Docker client compresses image layers before pushing them to a V2 Docker registry. The output of the docker images command shows the uncompressed image size, so it may return a larger image size than the image sizes returned by DescribeImages. 
   */
  describeImages(callback?: (err: AWSError, data: ECR.Types.DescribeImagesResponse) => void): Request<ECR.Types.DescribeImagesResponse, AWSError>;
  /**
   * Describes the settings for a registry. The replication configuration for a repository can be created or updated with the PutReplicationConfiguration API action.
   */
  describeRegistry(params: ECR.Types.DescribeRegistryRequest, callback?: (err: AWSError, data: ECR.Types.DescribeRegistryResponse) => void): Request<ECR.Types.DescribeRegistryResponse, AWSError>;
  /**
   * Describes the settings for a registry. The replication configuration for a repository can be created or updated with the PutReplicationConfiguration API action.
   */
  describeRegistry(callback?: (err: AWSError, data: ECR.Types.DescribeRegistryResponse) => void): Request<ECR.Types.DescribeRegistryResponse, AWSError>;
  /**
   * Describes image repositories in a registry.
   */
  describeRepositories(params: ECR.Types.DescribeRepositoriesRequest, callback?: (err: AWSError, data: ECR.Types.DescribeRepositoriesResponse) => void): Request<ECR.Types.DescribeRepositoriesResponse, AWSError>;
  /**
   * Describes image repositories in a registry.
   */
  describeRepositories(callback?: (err: AWSError, data: ECR.Types.DescribeRepositoriesResponse) => void): Request<ECR.Types.DescribeRepositoriesResponse, AWSError>;
  /**
   * Retrieves an authorization token. An authorization token represents your IAM authentication credentials and can be used to access any Amazon ECR registry that your IAM principal has access to. The authorization token is valid for 12 hours. The authorizationToken returned is a base64 encoded string that can be decoded and used in a docker login command to authenticate to a registry. The CLI offers an get-login-password command that simplifies the login process. For more information, see Registry authentication in the Amazon Elastic Container Registry User Guide.
   */
  getAuthorizationToken(params: ECR.Types.GetAuthorizationTokenRequest, callback?: (err: AWSError, data: ECR.Types.GetAuthorizationTokenResponse) => void): Request<ECR.Types.GetAuthorizationTokenResponse, AWSError>;
  /**
   * Retrieves an authorization token. An authorization token represents your IAM authentication credentials and can be used to access any Amazon ECR registry that your IAM principal has access to. The authorization token is valid for 12 hours. The authorizationToken returned is a base64 encoded string that can be decoded and used in a docker login command to authenticate to a registry. The CLI offers an get-login-password command that simplifies the login process. For more information, see Registry authentication in the Amazon Elastic Container Registry User Guide.
   */
  getAuthorizationToken(callback?: (err: AWSError, data: ECR.Types.GetAuthorizationTokenResponse) => void): Request<ECR.Types.GetAuthorizationTokenResponse, AWSError>;
  /**
   * Retrieves the pre-signed Amazon S3 download URL corresponding to an image layer. You can only get URLs for image layers that are referenced in an image. When an image is pulled, the GetDownloadUrlForLayer API is called once per image layer that is not already cached.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  getDownloadUrlForLayer(params: ECR.Types.GetDownloadUrlForLayerRequest, callback?: (err: AWSError, data: ECR.Types.GetDownloadUrlForLayerResponse) => void): Request<ECR.Types.GetDownloadUrlForLayerResponse, AWSError>;
  /**
   * Retrieves the pre-signed Amazon S3 download URL corresponding to an image layer. You can only get URLs for image layers that are referenced in an image. When an image is pulled, the GetDownloadUrlForLayer API is called once per image layer that is not already cached.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  getDownloadUrlForLayer(callback?: (err: AWSError, data: ECR.Types.GetDownloadUrlForLayerResponse) => void): Request<ECR.Types.GetDownloadUrlForLayerResponse, AWSError>;
  /**
   * Retrieves the lifecycle policy for the specified repository.
   */
  getLifecyclePolicy(params: ECR.Types.GetLifecyclePolicyRequest, callback?: (err: AWSError, data: ECR.Types.GetLifecyclePolicyResponse) => void): Request<ECR.Types.GetLifecyclePolicyResponse, AWSError>;
  /**
   * Retrieves the lifecycle policy for the specified repository.
   */
  getLifecyclePolicy(callback?: (err: AWSError, data: ECR.Types.GetLifecyclePolicyResponse) => void): Request<ECR.Types.GetLifecyclePolicyResponse, AWSError>;
  /**
   * Retrieves the results of the lifecycle policy preview request for the specified repository.
   */
  getLifecyclePolicyPreview(params: ECR.Types.GetLifecyclePolicyPreviewRequest, callback?: (err: AWSError, data: ECR.Types.GetLifecyclePolicyPreviewResponse) => void): Request<ECR.Types.GetLifecyclePolicyPreviewResponse, AWSError>;
  /**
   * Retrieves the results of the lifecycle policy preview request for the specified repository.
   */
  getLifecyclePolicyPreview(callback?: (err: AWSError, data: ECR.Types.GetLifecyclePolicyPreviewResponse) => void): Request<ECR.Types.GetLifecyclePolicyPreviewResponse, AWSError>;
  /**
   * Retrieves the permissions policy for a registry.
   */
  getRegistryPolicy(params: ECR.Types.GetRegistryPolicyRequest, callback?: (err: AWSError, data: ECR.Types.GetRegistryPolicyResponse) => void): Request<ECR.Types.GetRegistryPolicyResponse, AWSError>;
  /**
   * Retrieves the permissions policy for a registry.
   */
  getRegistryPolicy(callback?: (err: AWSError, data: ECR.Types.GetRegistryPolicyResponse) => void): Request<ECR.Types.GetRegistryPolicyResponse, AWSError>;
  /**
   * Retrieves the repository policy for the specified repository.
   */
  getRepositoryPolicy(params: ECR.Types.GetRepositoryPolicyRequest, callback?: (err: AWSError, data: ECR.Types.GetRepositoryPolicyResponse) => void): Request<ECR.Types.GetRepositoryPolicyResponse, AWSError>;
  /**
   * Retrieves the repository policy for the specified repository.
   */
  getRepositoryPolicy(callback?: (err: AWSError, data: ECR.Types.GetRepositoryPolicyResponse) => void): Request<ECR.Types.GetRepositoryPolicyResponse, AWSError>;
  /**
   * Notifies Amazon ECR that you intend to upload an image layer. When an image is pushed, the InitiateLayerUpload API is called once per image layer that has not already been uploaded. Whether or not an image layer has been uploaded is determined by the BatchCheckLayerAvailability API action.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  initiateLayerUpload(params: ECR.Types.InitiateLayerUploadRequest, callback?: (err: AWSError, data: ECR.Types.InitiateLayerUploadResponse) => void): Request<ECR.Types.InitiateLayerUploadResponse, AWSError>;
  /**
   * Notifies Amazon ECR that you intend to upload an image layer. When an image is pushed, the InitiateLayerUpload API is called once per image layer that has not already been uploaded. Whether or not an image layer has been uploaded is determined by the BatchCheckLayerAvailability API action.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  initiateLayerUpload(callback?: (err: AWSError, data: ECR.Types.InitiateLayerUploadResponse) => void): Request<ECR.Types.InitiateLayerUploadResponse, AWSError>;
  /**
   * Lists all the image IDs for the specified repository. You can filter images based on whether or not they are tagged by using the tagStatus filter and specifying either TAGGED, UNTAGGED or ANY. For example, you can filter your results to return only UNTAGGED images and then pipe that result to a BatchDeleteImage operation to delete them. Or, you can filter your results to return only TAGGED images to list all of the tags in your repository.
   */
  listImages(params: ECR.Types.ListImagesRequest, callback?: (err: AWSError, data: ECR.Types.ListImagesResponse) => void): Request<ECR.Types.ListImagesResponse, AWSError>;
  /**
   * Lists all the image IDs for the specified repository. You can filter images based on whether or not they are tagged by using the tagStatus filter and specifying either TAGGED, UNTAGGED or ANY. For example, you can filter your results to return only UNTAGGED images and then pipe that result to a BatchDeleteImage operation to delete them. Or, you can filter your results to return only TAGGED images to list all of the tags in your repository.
   */
  listImages(callback?: (err: AWSError, data: ECR.Types.ListImagesResponse) => void): Request<ECR.Types.ListImagesResponse, AWSError>;
  /**
   * List the tags for an Amazon ECR resource.
   */
  listTagsForResource(params: ECR.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: ECR.Types.ListTagsForResourceResponse) => void): Request<ECR.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List the tags for an Amazon ECR resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: ECR.Types.ListTagsForResourceResponse) => void): Request<ECR.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates or updates the image manifest and tags associated with an image. When an image is pushed and all new image layers have been uploaded, the PutImage API is called once to create or update the image manifest and the tags associated with the image.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  putImage(params: ECR.Types.PutImageRequest, callback?: (err: AWSError, data: ECR.Types.PutImageResponse) => void): Request<ECR.Types.PutImageResponse, AWSError>;
  /**
   * Creates or updates the image manifest and tags associated with an image. When an image is pushed and all new image layers have been uploaded, the PutImage API is called once to create or update the image manifest and the tags associated with the image.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  putImage(callback?: (err: AWSError, data: ECR.Types.PutImageResponse) => void): Request<ECR.Types.PutImageResponse, AWSError>;
  /**
   * Updates the image scanning configuration for the specified repository.
   */
  putImageScanningConfiguration(params: ECR.Types.PutImageScanningConfigurationRequest, callback?: (err: AWSError, data: ECR.Types.PutImageScanningConfigurationResponse) => void): Request<ECR.Types.PutImageScanningConfigurationResponse, AWSError>;
  /**
   * Updates the image scanning configuration for the specified repository.
   */
  putImageScanningConfiguration(callback?: (err: AWSError, data: ECR.Types.PutImageScanningConfigurationResponse) => void): Request<ECR.Types.PutImageScanningConfigurationResponse, AWSError>;
  /**
   * Updates the image tag mutability settings for the specified repository. For more information, see Image tag mutability in the Amazon Elastic Container Registry User Guide.
   */
  putImageTagMutability(params: ECR.Types.PutImageTagMutabilityRequest, callback?: (err: AWSError, data: ECR.Types.PutImageTagMutabilityResponse) => void): Request<ECR.Types.PutImageTagMutabilityResponse, AWSError>;
  /**
   * Updates the image tag mutability settings for the specified repository. For more information, see Image tag mutability in the Amazon Elastic Container Registry User Guide.
   */
  putImageTagMutability(callback?: (err: AWSError, data: ECR.Types.PutImageTagMutabilityResponse) => void): Request<ECR.Types.PutImageTagMutabilityResponse, AWSError>;
  /**
   * Creates or updates the lifecycle policy for the specified repository. For more information, see Lifecycle policy template.
   */
  putLifecyclePolicy(params: ECR.Types.PutLifecyclePolicyRequest, callback?: (err: AWSError, data: ECR.Types.PutLifecyclePolicyResponse) => void): Request<ECR.Types.PutLifecyclePolicyResponse, AWSError>;
  /**
   * Creates or updates the lifecycle policy for the specified repository. For more information, see Lifecycle policy template.
   */
  putLifecyclePolicy(callback?: (err: AWSError, data: ECR.Types.PutLifecyclePolicyResponse) => void): Request<ECR.Types.PutLifecyclePolicyResponse, AWSError>;
  /**
   * Creates or updates the permissions policy for your registry. A registry policy is used to specify permissions for another Amazon Web Services account and is used when configuring cross-account replication. For more information, see Registry permissions in the Amazon Elastic Container Registry User Guide.
   */
  putRegistryPolicy(params: ECR.Types.PutRegistryPolicyRequest, callback?: (err: AWSError, data: ECR.Types.PutRegistryPolicyResponse) => void): Request<ECR.Types.PutRegistryPolicyResponse, AWSError>;
  /**
   * Creates or updates the permissions policy for your registry. A registry policy is used to specify permissions for another Amazon Web Services account and is used when configuring cross-account replication. For more information, see Registry permissions in the Amazon Elastic Container Registry User Guide.
   */
  putRegistryPolicy(callback?: (err: AWSError, data: ECR.Types.PutRegistryPolicyResponse) => void): Request<ECR.Types.PutRegistryPolicyResponse, AWSError>;
  /**
   * Creates or updates the replication configuration for a registry. The existing replication configuration for a repository can be retrieved with the DescribeRegistry API action. The first time the PutReplicationConfiguration API is called, a service-linked IAM role is created in your account for the replication process. For more information, see Using service-linked roles for Amazon ECR in the Amazon Elastic Container Registry User Guide.  When configuring cross-account replication, the destination account must grant the source account permission to replicate. This permission is controlled using a registry permissions policy. For more information, see PutRegistryPolicy. 
   */
  putReplicationConfiguration(params: ECR.Types.PutReplicationConfigurationRequest, callback?: (err: AWSError, data: ECR.Types.PutReplicationConfigurationResponse) => void): Request<ECR.Types.PutReplicationConfigurationResponse, AWSError>;
  /**
   * Creates or updates the replication configuration for a registry. The existing replication configuration for a repository can be retrieved with the DescribeRegistry API action. The first time the PutReplicationConfiguration API is called, a service-linked IAM role is created in your account for the replication process. For more information, see Using service-linked roles for Amazon ECR in the Amazon Elastic Container Registry User Guide.  When configuring cross-account replication, the destination account must grant the source account permission to replicate. This permission is controlled using a registry permissions policy. For more information, see PutRegistryPolicy. 
   */
  putReplicationConfiguration(callback?: (err: AWSError, data: ECR.Types.PutReplicationConfigurationResponse) => void): Request<ECR.Types.PutReplicationConfigurationResponse, AWSError>;
  /**
   * Applies a repository policy to the specified repository to control access permissions. For more information, see Amazon ECR Repository policies in the Amazon Elastic Container Registry User Guide.
   */
  setRepositoryPolicy(params: ECR.Types.SetRepositoryPolicyRequest, callback?: (err: AWSError, data: ECR.Types.SetRepositoryPolicyResponse) => void): Request<ECR.Types.SetRepositoryPolicyResponse, AWSError>;
  /**
   * Applies a repository policy to the specified repository to control access permissions. For more information, see Amazon ECR Repository policies in the Amazon Elastic Container Registry User Guide.
   */
  setRepositoryPolicy(callback?: (err: AWSError, data: ECR.Types.SetRepositoryPolicyResponse) => void): Request<ECR.Types.SetRepositoryPolicyResponse, AWSError>;
  /**
   * Starts an image vulnerability scan. An image scan can only be started once per 24 hours on an individual image. This limit includes if an image was scanned on initial push. For more information, see Image scanning in the Amazon Elastic Container Registry User Guide.
   */
  startImageScan(params: ECR.Types.StartImageScanRequest, callback?: (err: AWSError, data: ECR.Types.StartImageScanResponse) => void): Request<ECR.Types.StartImageScanResponse, AWSError>;
  /**
   * Starts an image vulnerability scan. An image scan can only be started once per 24 hours on an individual image. This limit includes if an image was scanned on initial push. For more information, see Image scanning in the Amazon Elastic Container Registry User Guide.
   */
  startImageScan(callback?: (err: AWSError, data: ECR.Types.StartImageScanResponse) => void): Request<ECR.Types.StartImageScanResponse, AWSError>;
  /**
   * Starts a preview of a lifecycle policy for the specified repository. This allows you to see the results before associating the lifecycle policy with the repository.
   */
  startLifecyclePolicyPreview(params: ECR.Types.StartLifecyclePolicyPreviewRequest, callback?: (err: AWSError, data: ECR.Types.StartLifecyclePolicyPreviewResponse) => void): Request<ECR.Types.StartLifecyclePolicyPreviewResponse, AWSError>;
  /**
   * Starts a preview of a lifecycle policy for the specified repository. This allows you to see the results before associating the lifecycle policy with the repository.
   */
  startLifecyclePolicyPreview(callback?: (err: AWSError, data: ECR.Types.StartLifecyclePolicyPreviewResponse) => void): Request<ECR.Types.StartLifecyclePolicyPreviewResponse, AWSError>;
  /**
   * Adds specified tags to a resource with the specified ARN. Existing tags on a resource are not changed if they are not specified in the request parameters.
   */
  tagResource(params: ECR.Types.TagResourceRequest, callback?: (err: AWSError, data: ECR.Types.TagResourceResponse) => void): Request<ECR.Types.TagResourceResponse, AWSError>;
  /**
   * Adds specified tags to a resource with the specified ARN. Existing tags on a resource are not changed if they are not specified in the request parameters.
   */
  tagResource(callback?: (err: AWSError, data: ECR.Types.TagResourceResponse) => void): Request<ECR.Types.TagResourceResponse, AWSError>;
  /**
   * Deletes specified tags from a resource.
   */
  untagResource(params: ECR.Types.UntagResourceRequest, callback?: (err: AWSError, data: ECR.Types.UntagResourceResponse) => void): Request<ECR.Types.UntagResourceResponse, AWSError>;
  /**
   * Deletes specified tags from a resource.
   */
  untagResource(callback?: (err: AWSError, data: ECR.Types.UntagResourceResponse) => void): Request<ECR.Types.UntagResourceResponse, AWSError>;
  /**
   * Uploads an image layer part to Amazon ECR. When an image is pushed, each new image layer is uploaded in parts. The maximum size of each image layer part can be 20971520 bytes (or about 20MB). The UploadLayerPart API is called once per each new image layer part.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  uploadLayerPart(params: ECR.Types.UploadLayerPartRequest, callback?: (err: AWSError, data: ECR.Types.UploadLayerPartResponse) => void): Request<ECR.Types.UploadLayerPartResponse, AWSError>;
  /**
   * Uploads an image layer part to Amazon ECR. When an image is pushed, each new image layer is uploaded in parts. The maximum size of each image layer part can be 20971520 bytes (or about 20MB). The UploadLayerPart API is called once per each new image layer part.  This operation is used by the Amazon ECR proxy and is not generally used by customers for pulling and pushing images. In most cases, you should use the docker CLI to pull, tag, and push images. 
   */
  uploadLayerPart(callback?: (err: AWSError, data: ECR.Types.UploadLayerPartResponse) => void): Request<ECR.Types.UploadLayerPartResponse, AWSError>;
  /**
   * Waits for the imageScanComplete state by periodically calling the underlying ECR.describeImageScanFindingsoperation every 5 seconds (at most 60 times). Wait until an image scan is complete and findings can be accessed
   */
  waitFor(state: "imageScanComplete", params: ECR.Types.DescribeImageScanFindingsRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ECR.Types.DescribeImageScanFindingsResponse) => void): Request<ECR.Types.DescribeImageScanFindingsResponse, AWSError>;
  /**
   * Waits for the imageScanComplete state by periodically calling the underlying ECR.describeImageScanFindingsoperation every 5 seconds (at most 60 times). Wait until an image scan is complete and findings can be accessed
   */
  waitFor(state: "imageScanComplete", callback?: (err: AWSError, data: ECR.Types.DescribeImageScanFindingsResponse) => void): Request<ECR.Types.DescribeImageScanFindingsResponse, AWSError>;
  /**
   * Waits for the lifecyclePolicyPreviewComplete state by periodically calling the underlying ECR.getLifecyclePolicyPreviewoperation every 5 seconds (at most 20 times). Wait until a lifecycle policy preview request is complete and results can be accessed
   */
  waitFor(state: "lifecyclePolicyPreviewComplete", params: ECR.Types.GetLifecyclePolicyPreviewRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: ECR.Types.GetLifecyclePolicyPreviewResponse) => void): Request<ECR.Types.GetLifecyclePolicyPreviewResponse, AWSError>;
  /**
   * Waits for the lifecyclePolicyPreviewComplete state by periodically calling the underlying ECR.getLifecyclePolicyPreviewoperation every 5 seconds (at most 20 times). Wait until a lifecycle policy preview request is complete and results can be accessed
   */
  waitFor(state: "lifecyclePolicyPreviewComplete", callback?: (err: AWSError, data: ECR.Types.GetLifecyclePolicyPreviewResponse) => void): Request<ECR.Types.GetLifecyclePolicyPreviewResponse, AWSError>;
}
declare namespace ECR {
  export type Arn = string;
  export interface Attribute {
    /**
     * The attribute key.
     */
    key: AttributeKey;
    /**
     * The value assigned to the attribute key.
     */
    value?: AttributeValue;
  }
  export type AttributeKey = string;
  export type AttributeList = Attribute[];
  export type AttributeValue = string;
  export interface AuthorizationData {
    /**
     * A base64-encoded string that contains authorization data for the specified Amazon ECR registry. When the string is decoded, it is presented in the format user:password for private registry authentication using docker login.
     */
    authorizationToken?: Base64;
    /**
     * The Unix time in seconds and milliseconds when the authorization token expires. Authorization tokens are valid for 12 hours.
     */
    expiresAt?: ExpirationTimestamp;
    /**
     * The registry URL to use for this authorization token in a docker login command. The Amazon ECR registry URL format is https://aws_account_id.dkr.ecr.region.amazonaws.com. For example, https://012345678910.dkr.ecr.us-east-1.amazonaws.com.. 
     */
    proxyEndpoint?: ProxyEndpoint;
  }
  export type AuthorizationDataList = AuthorizationData[];
  export type Base64 = string;
  export interface BatchCheckLayerAvailabilityRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the image layers to check. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
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
     * The Amazon Web Services account ID associated with the registry that contains the image to delete. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The repository that contains the image to delete.
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
  export interface BatchGetImageRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the images to describe. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The repository that contains the images to describe.
     */
    repositoryName: RepositoryName;
    /**
     * A list of image ID references that correspond to images to describe. The format of the imageIds reference is imageTag=tag or imageDigest=digest.
     */
    imageIds: ImageIdentifierList;
    /**
     * The accepted media types for the request. Valid values: application/vnd.docker.distribution.manifest.v1+json | application/vnd.docker.distribution.manifest.v2+json | application/vnd.oci.image.manifest.v1+json 
     */
    acceptedMediaTypes?: MediaTypeList;
  }
  export interface BatchGetImageResponse {
    /**
     * A list of image objects corresponding to the image references in the request.
     */
    images?: ImageList;
    /**
     * Any failures associated with the call.
     */
    failures?: ImageFailureList;
  }
  export type BatchedOperationLayerDigest = string;
  export type BatchedOperationLayerDigestList = BatchedOperationLayerDigest[];
  export interface CompleteLayerUploadRequest {
    /**
     * The Amazon Web Services account ID associated with the registry to which to upload layers. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository to associate with the image layer.
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
     * The registry ID associated with the request.
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
     * The AWS account ID associated with the registry to create the repository. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name to use for the repository. The repository name may be specified on its own (such as nginx-web-app) or it can be prepended with a namespace to group the repository into a category (such as project-a/nginx-web-app).
     */
    repositoryName: RepositoryName;
    /**
     * The metadata that you apply to the repository to help you categorize and organize them. Each tag consists of a key and an optional value, both of which you define. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     */
    tags?: TagList;
    /**
     * The tag mutability setting for the repository. If this parameter is omitted, the default setting of MUTABLE will be used which will allow image tags to be overwritten. If IMMUTABLE is specified, all image tags within the repository will be immutable which will prevent them from being overwritten.
     */
    imageTagMutability?: ImageTagMutability;
    /**
     * The image scanning configuration for the repository. This determines whether images are scanned for known vulnerabilities after being pushed to the repository.
     */
    imageScanningConfiguration?: ImageScanningConfiguration;
    /**
     * The encryption configuration for the repository. This determines how the contents of your repository are encrypted at rest.
     */
    encryptionConfiguration?: EncryptionConfiguration;
  }
  export interface CreateRepositoryResponse {
    /**
     * The repository that was created.
     */
    repository?: Repository;
  }
  export type CreationTimestamp = Date;
  export interface DeleteLifecyclePolicyRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository.
     */
    repositoryName: RepositoryName;
  }
  export interface DeleteLifecyclePolicyResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The JSON lifecycle policy text.
     */
    lifecyclePolicyText?: LifecyclePolicyText;
    /**
     * The time stamp of the last time that the lifecycle policy was run.
     */
    lastEvaluatedAt?: EvaluationTimestamp;
  }
  export interface DeleteRegistryPolicyRequest {
  }
  export interface DeleteRegistryPolicyResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The contents of the registry permissions policy that was deleted.
     */
    policyText?: RegistryPolicyText;
  }
  export interface DeleteRepositoryPolicyRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository policy to delete. If you do not specify a registry, the default registry is assumed.
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
     * The Amazon Web Services account ID associated with the registry that contains the repository to delete. If you do not specify a registry, the default registry is assumed.
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
  export interface DescribeImageReplicationStatusRequest {
    /**
     * The name of the repository that the image is in.
     */
    repositoryName: RepositoryName;
    imageId: ImageIdentifier;
    /**
     * The Amazon Web Services account ID associated with the registry. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
  }
  export interface DescribeImageReplicationStatusResponse {
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    imageId?: ImageIdentifier;
    /**
     * The replication status details for the images in the specified repository.
     */
    replicationStatuses?: ImageReplicationStatusList;
  }
  export interface DescribeImageScanFindingsRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository in which to describe the image scan findings for. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The repository for the image for which to describe the scan findings.
     */
    repositoryName: RepositoryName;
    imageId: ImageIdentifier;
    /**
     * The nextToken value returned from a previous paginated DescribeImageScanFindings request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of image scan results returned by DescribeImageScanFindings in paginated output. When this parameter is used, DescribeImageScanFindings only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another DescribeImageScanFindings request with the returned nextToken value. This value can be between 1 and 1000. If this parameter is not used, then DescribeImageScanFindings returns up to 100 results and a nextToken value, if applicable.
     */
    maxResults?: MaxResults;
  }
  export interface DescribeImageScanFindingsResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    imageId?: ImageIdentifier;
    /**
     * The current state of the scan.
     */
    imageScanStatus?: ImageScanStatus;
    /**
     * The information contained in the image scan findings.
     */
    imageScanFindings?: ImageScanFindings;
    /**
     * The nextToken value to include in a future DescribeImageScanFindings request. When the results of a DescribeImageScanFindings request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface DescribeImagesFilter {
    /**
     * The tag status with which to filter your DescribeImages results. You can filter results based on whether they are TAGGED or UNTAGGED.
     */
    tagStatus?: TagStatus;
  }
  export interface DescribeImagesRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository in which to describe images. If you do not specify a registry, the default registry is assumed.
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
    /**
     * The filter key and value with which to filter your DescribeImages results.
     */
    filter?: DescribeImagesFilter;
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
  export interface DescribeRegistryRequest {
  }
  export interface DescribeRegistryResponse {
    /**
     * The ID of the registry.
     */
    registryId?: RegistryId;
    /**
     * The replication configuration for the registry.
     */
    replicationConfiguration?: ReplicationConfiguration;
  }
  export interface DescribeRepositoriesRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repositories to be described. If you do not specify a registry, the default registry is assumed.
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
  export interface EncryptionConfiguration {
    /**
     * The encryption type to use. If you use the KMS encryption type, the contents of the repository will be encrypted using server-side encryption with Key Management Service key stored in KMS. When you use KMS to encrypt your data, you can either use the default Amazon Web Services managed KMS key for Amazon ECR, or specify your own KMS key, which you already created. For more information, see Protecting data using server-side encryption with an KMS key stored in Key Management Service (SSE-KMS) in the Amazon Simple Storage Service Console Developer Guide.. If you use the AES256 encryption type, Amazon ECR uses server-side encryption with Amazon S3-managed encryption keys which encrypts the images in the repository using an AES-256 encryption algorithm. For more information, see Protecting data using server-side encryption with Amazon S3-managed encryption keys (SSE-S3) in the Amazon Simple Storage Service Console Developer Guide..
     */
    encryptionType: EncryptionType;
    /**
     * If you use the KMS encryption type, specify the KMS key to use for encryption. The alias, key ID, or full ARN of the KMS key can be specified. The key must exist in the same Region as the repository. If no key is specified, the default Amazon Web Services managed KMS key for Amazon ECR will be used.
     */
    kmsKey?: KmsKey;
  }
  export type EncryptionType = "AES256"|"KMS"|string;
  export type EvaluationTimestamp = Date;
  export type ExpirationTimestamp = Date;
  export type FindingDescription = string;
  export type FindingName = string;
  export type FindingSeverity = "INFORMATIONAL"|"LOW"|"MEDIUM"|"HIGH"|"CRITICAL"|"UNDEFINED"|string;
  export type FindingSeverityCounts = {[key: string]: SeverityCount};
  export type ForceFlag = boolean;
  export type GetAuthorizationTokenRegistryIdList = RegistryId[];
  export interface GetAuthorizationTokenRequest {
    /**
     * A list of Amazon Web Services account IDs that are associated with the registries for which to get AuthorizationData objects. If you do not specify a registry, the default registry is assumed.
     */
    registryIds?: GetAuthorizationTokenRegistryIdList;
  }
  export interface GetAuthorizationTokenResponse {
    /**
     * A list of authorization token data objects that correspond to the registryIds values in the request.
     */
    authorizationData?: AuthorizationDataList;
  }
  export interface GetDownloadUrlForLayerRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the image layer to download. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository that is associated with the image layer to download.
     */
    repositoryName: RepositoryName;
    /**
     * The digest of the image layer to download.
     */
    layerDigest: LayerDigest;
  }
  export interface GetDownloadUrlForLayerResponse {
    /**
     * The pre-signed Amazon S3 download URL for the requested layer.
     */
    downloadUrl?: Url;
    /**
     * The digest of the image layer to download.
     */
    layerDigest?: LayerDigest;
  }
  export interface GetLifecyclePolicyPreviewRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository.
     */
    repositoryName: RepositoryName;
    /**
     * The list of imageIDs to be included.
     */
    imageIds?: ImageIdentifierList;
    /**
     * The nextToken value returned from a previous paginated&#x2028; GetLifecyclePolicyPreviewRequest request where maxResults was used and the&#x2028; results exceeded the value of that parameter. Pagination continues from the end of the&#x2028; previous results that returned the nextToken value. This value is&#x2028; null when there are no more results to return. This option cannot be used when you specify images with imageIds.
     */
    nextToken?: NextToken;
    /**
     * The maximum number of repository results returned by GetLifecyclePolicyPreviewRequest in&#x2028; paginated output. When this parameter is used, GetLifecyclePolicyPreviewRequest only returns&#x2028; maxResults results in a single page along with a nextToken&#x2028; response element. The remaining results of the initial request can be seen by sending&#x2028; another GetLifecyclePolicyPreviewRequest request with the returned nextToken&#x2028; value. This value can be between 1 and 1000. If this&#x2028; parameter is not used, then GetLifecyclePolicyPreviewRequest returns up to&#x2028; 100 results and a nextToken value, if&#x2028; applicable. This option cannot be used when you specify images with imageIds.
     */
    maxResults?: LifecyclePreviewMaxResults;
    /**
     * An optional parameter that filters results based on image tag status and all tags, if tagged.
     */
    filter?: LifecyclePolicyPreviewFilter;
  }
  export interface GetLifecyclePolicyPreviewResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The JSON lifecycle policy text.
     */
    lifecyclePolicyText?: LifecyclePolicyText;
    /**
     * The status of the lifecycle policy preview request.
     */
    status?: LifecyclePolicyPreviewStatus;
    /**
     * The nextToken value to include in a future GetLifecyclePolicyPreview request. When the results of a GetLifecyclePolicyPreview request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
    /**
     * The results of the lifecycle policy preview request.
     */
    previewResults?: LifecyclePolicyPreviewResultList;
    /**
     * The list of images that is returned as a result of the action.
     */
    summary?: LifecyclePolicyPreviewSummary;
  }
  export interface GetLifecyclePolicyRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository.
     */
    repositoryName: RepositoryName;
  }
  export interface GetLifecyclePolicyResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The JSON lifecycle policy text.
     */
    lifecyclePolicyText?: LifecyclePolicyText;
    /**
     * The time stamp of the last time that the lifecycle policy was run.
     */
    lastEvaluatedAt?: EvaluationTimestamp;
  }
  export interface GetRegistryPolicyRequest {
  }
  export interface GetRegistryPolicyResponse {
    /**
     * The ID of the registry.
     */
    registryId?: RegistryId;
    /**
     * The JSON text of the permissions policy for a registry.
     */
    policyText?: RegistryPolicyText;
  }
  export interface GetRepositoryPolicyRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository. If you do not specify a registry, the default registry is assumed.
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
     * The JSON repository policy text associated with the repository.
     */
    policyText?: RepositoryPolicyText;
  }
  export interface Image {
    /**
     * The Amazon Web Services account ID associated with the registry containing the image.
     */
    registryId?: RegistryId;
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
  export type ImageActionType = "EXPIRE"|string;
  export type ImageCount = number;
  export interface ImageDetail {
    /**
     * The Amazon Web Services account ID associated with the registry to which this image belongs.
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
     * The current state of the scan.
     */
    imageScanStatus?: ImageScanStatus;
    /**
     * A summary of the last completed image scan.
     */
    imageScanFindingsSummary?: ImageScanFindingsSummary;
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
  export type ImageList = Image[];
  export type ImageManifest = string;
  export interface ImageReplicationStatus {
    /**
     * The destination Region for the image replication.
     */
    region?: Region;
    /**
     * The AWS account ID associated with the registry to which the image belongs.
     */
    registryId?: RegistryId;
    /**
     * The image replication status.
     */
    status?: ReplicationStatus;
    /**
     * The failure code for a replication that has failed.
     */
    failureCode?: ReplicationError;
  }
  export type ImageReplicationStatusList = ImageReplicationStatus[];
  export interface ImageScanFinding {
    /**
     * The name associated with the finding, usually a CVE number.
     */
    name?: FindingName;
    /**
     * The description of the finding.
     */
    description?: FindingDescription;
    /**
     * A link containing additional details about the security vulnerability.
     */
    uri?: Url;
    /**
     * The finding severity.
     */
    severity?: FindingSeverity;
    /**
     * A collection of attributes of the host from which the finding is generated.
     */
    attributes?: AttributeList;
  }
  export type ImageScanFindingList = ImageScanFinding[];
  export interface ImageScanFindings {
    /**
     * The time of the last completed image scan.
     */
    imageScanCompletedAt?: ScanTimestamp;
    /**
     * The time when the vulnerability data was last scanned.
     */
    vulnerabilitySourceUpdatedAt?: VulnerabilitySourceUpdateTimestamp;
    /**
     * The findings from the image scan.
     */
    findings?: ImageScanFindingList;
    /**
     * The image vulnerability counts, sorted by severity.
     */
    findingSeverityCounts?: FindingSeverityCounts;
  }
  export interface ImageScanFindingsSummary {
    /**
     * The time of the last completed image scan.
     */
    imageScanCompletedAt?: ScanTimestamp;
    /**
     * The time when the vulnerability data was last scanned.
     */
    vulnerabilitySourceUpdatedAt?: VulnerabilitySourceUpdateTimestamp;
    /**
     * The image vulnerability counts, sorted by severity.
     */
    findingSeverityCounts?: FindingSeverityCounts;
  }
  export interface ImageScanStatus {
    /**
     * The current state of an image scan.
     */
    status?: ScanStatus;
    /**
     * The description of the image scan status.
     */
    description?: ScanStatusDescription;
  }
  export interface ImageScanningConfiguration {
    /**
     * The setting that determines whether images are scanned after being pushed to a repository. If set to true, images will be scanned after being pushed. If this parameter is not specified, it will default to false and images will not be scanned unless a scan is manually started with the API_StartImageScan API.
     */
    scanOnPush?: ScanOnPushFlag;
  }
  export type ImageSizeInBytes = number;
  export type ImageTag = string;
  export type ImageTagList = ImageTag[];
  export type ImageTagMutability = "MUTABLE"|"IMMUTABLE"|string;
  export interface InitiateLayerUploadRequest {
    /**
     * The Amazon Web Services account ID associated with the registry to which you intend to upload layers. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
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
  export type KmsKey = string;
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
  export interface LifecyclePolicyPreviewFilter {
    /**
     * The tag status of the image.
     */
    tagStatus?: TagStatus;
  }
  export interface LifecyclePolicyPreviewResult {
    /**
     * The list of tags associated with this image.
     */
    imageTags?: ImageTagList;
    /**
     * The sha256 digest of the image manifest.
     */
    imageDigest?: ImageDigest;
    /**
     * The date and time, expressed in standard JavaScript date format, at which the current image was pushed to the repository.
     */
    imagePushedAt?: PushTimestamp;
    /**
     * The type of action to be taken.
     */
    action?: LifecyclePolicyRuleAction;
    /**
     * The priority of the applied rule.
     */
    appliedRulePriority?: LifecyclePolicyRulePriority;
  }
  export type LifecyclePolicyPreviewResultList = LifecyclePolicyPreviewResult[];
  export type LifecyclePolicyPreviewStatus = "IN_PROGRESS"|"COMPLETE"|"EXPIRED"|"FAILED"|string;
  export interface LifecyclePolicyPreviewSummary {
    /**
     * The number of expiring images.
     */
    expiringImageTotalCount?: ImageCount;
  }
  export interface LifecyclePolicyRuleAction {
    /**
     * The type of action to be taken.
     */
    type?: ImageActionType;
  }
  export type LifecyclePolicyRulePriority = number;
  export type LifecyclePolicyText = string;
  export type LifecyclePreviewMaxResults = number;
  export interface ListImagesFilter {
    /**
     * The tag status with which to filter your ListImages results. You can filter results based on whether they are TAGGED or UNTAGGED.
     */
    tagStatus?: TagStatus;
  }
  export interface ListImagesRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository in which to list images. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The repository with image IDs to be listed.
     */
    repositoryName: RepositoryName;
    /**
     * The nextToken value returned from a previous paginated ListImages request where maxResults was used and the results exceeded the value of that parameter. Pagination continues from the end of the previous results that returned the nextToken value. This value is null when there are no more results to return.  This token should be treated as an opaque identifier that is only used to retrieve the next items in a list and not for other programmatic purposes. 
     */
    nextToken?: NextToken;
    /**
     * The maximum number of image results returned by ListImages in paginated output. When this parameter is used, ListImages only returns maxResults results in a single page along with a nextToken response element. The remaining results of the initial request can be seen by sending another ListImages request with the returned nextToken value. This value can be between 1 and 1000. If this parameter is not used, then ListImages returns up to 100 results and a nextToken value, if applicable.
     */
    maxResults?: MaxResults;
    /**
     * The filter key and value with which to filter your ListImages results.
     */
    filter?: ListImagesFilter;
  }
  export interface ListImagesResponse {
    /**
     * The list of image IDs for the requested repository.
     */
    imageIds?: ImageIdentifierList;
    /**
     * The nextToken value to include in a future ListImages request. When the results of a ListImages request exceed maxResults, this value can be used to retrieve the next page of results. This value is null when there are no more results to return.
     */
    nextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) that identifies the resource for which to list the tags. Currently, the only supported resource is an Amazon ECR repository.
     */
    resourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the resource.
     */
    tags?: TagList;
  }
  export type MaxResults = number;
  export type MediaType = string;
  export type MediaTypeList = MediaType[];
  export type NextToken = string;
  export type PartSize = number;
  export type ProxyEndpoint = string;
  export type PushTimestamp = Date;
  export interface PutImageRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository in which to put the image. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
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
  export interface PutImageScanningConfigurationRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository in which to update the image scanning configuration setting. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository in which to update the image scanning configuration setting.
     */
    repositoryName: RepositoryName;
    /**
     * The image scanning configuration for the repository. This setting determines whether images are scanned for known vulnerabilities after being pushed to the repository.
     */
    imageScanningConfiguration: ImageScanningConfiguration;
  }
  export interface PutImageScanningConfigurationResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The image scanning configuration setting for the repository.
     */
    imageScanningConfiguration?: ImageScanningConfiguration;
  }
  export interface PutImageTagMutabilityRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository in which to update the image tag mutability settings. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository in which to update the image tag mutability settings.
     */
    repositoryName: RepositoryName;
    /**
     * The tag mutability setting for the repository. If MUTABLE is specified, image tags can be overwritten. If IMMUTABLE is specified, all image tags within the repository will be immutable which will prevent them from being overwritten.
     */
    imageTagMutability: ImageTagMutability;
  }
  export interface PutImageTagMutabilityResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The image tag mutability setting for the repository.
     */
    imageTagMutability?: ImageTagMutability;
  }
  export interface PutLifecyclePolicyRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository. If you do&#x2028; not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository to receive the policy.
     */
    repositoryName: RepositoryName;
    /**
     * The JSON repository policy text to apply to the repository.
     */
    lifecyclePolicyText: LifecyclePolicyText;
  }
  export interface PutLifecyclePolicyResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The JSON repository policy text.
     */
    lifecyclePolicyText?: LifecyclePolicyText;
  }
  export interface PutRegistryPolicyRequest {
    /**
     * The JSON policy text to apply to your registry. The policy text follows the same format as IAM policy text. For more information, see Registry permissions in the Amazon Elastic Container Registry User Guide.
     */
    policyText: RegistryPolicyText;
  }
  export interface PutRegistryPolicyResponse {
    /**
     * The registry ID.
     */
    registryId?: RegistryId;
    /**
     * The JSON policy text for your registry.
     */
    policyText?: RegistryPolicyText;
  }
  export interface PutReplicationConfigurationRequest {
    /**
     * An object representing the replication configuration for a registry.
     */
    replicationConfiguration: ReplicationConfiguration;
  }
  export interface PutReplicationConfigurationResponse {
    /**
     * The contents of the replication configuration for the registry.
     */
    replicationConfiguration?: ReplicationConfiguration;
  }
  export type Region = string;
  export type RegistryId = string;
  export type RegistryPolicyText = string;
  export interface ReplicationConfiguration {
    /**
     * An array of objects representing the replication destinations and repository filters for a replication configuration.
     */
    rules: ReplicationRuleList;
  }
  export interface ReplicationDestination {
    /**
     * The Region to replicate to.
     */
    region: Region;
    /**
     * The Amazon Web Services account ID of the Amazon ECR private registry to replicate to. When configuring cross-Region replication within your own registry, specify your own account ID.
     */
    registryId: RegistryId;
  }
  export type ReplicationDestinationList = ReplicationDestination[];
  export type ReplicationError = string;
  export interface ReplicationRule {
    /**
     * An array of objects representing the destination for a replication rule.
     */
    destinations: ReplicationDestinationList;
    /**
     * An array of objects representing the filters for a replication rule. Specifying a repository filter for a replication rule provides a method for controlling which repositories in a private registry are replicated.
     */
    repositoryFilters?: RepositoryFilterList;
  }
  export type ReplicationRuleList = ReplicationRule[];
  export type ReplicationStatus = "IN_PROGRESS"|"COMPLETE"|"FAILED"|string;
  export interface Repository {
    /**
     * The Amazon Resource Name (ARN) that identifies the repository. The ARN contains the arn:aws:ecr namespace, followed by the region of the repository, Amazon Web Services account ID of the repository owner, repository namespace, and repository name. For example, arn:aws:ecr:region:012345678910:repository/test.
     */
    repositoryArn?: Arn;
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository.
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
    /**
     * The tag mutability setting for the repository.
     */
    imageTagMutability?: ImageTagMutability;
    imageScanningConfiguration?: ImageScanningConfiguration;
    /**
     * The encryption configuration for the repository. This determines how the contents of your repository are encrypted at rest.
     */
    encryptionConfiguration?: EncryptionConfiguration;
  }
  export interface RepositoryFilter {
    /**
     * The repository filter details. When the PREFIX_MATCH filter type is specified, this value is required and should be the repository name prefix to configure replication for.
     */
    filter: RepositoryFilterValue;
    /**
     * The repository filter type. The only supported value is PREFIX_MATCH, which is a repository name prefix specified with the filter parameter.
     */
    filterType: RepositoryFilterType;
  }
  export type RepositoryFilterList = RepositoryFilter[];
  export type RepositoryFilterType = "PREFIX_MATCH"|string;
  export type RepositoryFilterValue = string;
  export type RepositoryList = Repository[];
  export type RepositoryName = string;
  export type RepositoryNameList = RepositoryName[];
  export type RepositoryPolicyText = string;
  export type ScanOnPushFlag = boolean;
  export type ScanStatus = "IN_PROGRESS"|"COMPLETE"|"FAILED"|string;
  export type ScanStatusDescription = string;
  export type ScanTimestamp = Date;
  export interface SetRepositoryPolicyRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository to receive the policy.
     */
    repositoryName: RepositoryName;
    /**
     * The JSON repository policy text to apply to the repository. For more information, see Amazon ECR repository policies in the Amazon Elastic Container Registry User Guide.
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
  export type SeverityCount = number;
  export interface StartImageScanRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository in which to start an image scan request. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository that contains the images to scan.
     */
    repositoryName: RepositoryName;
    imageId: ImageIdentifier;
  }
  export interface StartImageScanResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    imageId?: ImageIdentifier;
    /**
     * The current state of the scan.
     */
    imageScanStatus?: ImageScanStatus;
  }
  export interface StartLifecyclePolicyPreviewRequest {
    /**
     * The Amazon Web Services account ID associated with the registry that contains the repository. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
    /**
     * The name of the repository to be evaluated.
     */
    repositoryName: RepositoryName;
    /**
     * The policy to be evaluated against. If you do not specify a policy, the current policy for the repository is used.
     */
    lifecyclePolicyText?: LifecyclePolicyText;
  }
  export interface StartLifecyclePolicyPreviewResponse {
    /**
     * The registry ID associated with the request.
     */
    registryId?: RegistryId;
    /**
     * The repository name associated with the request.
     */
    repositoryName?: RepositoryName;
    /**
     * The JSON repository policy text.
     */
    lifecyclePolicyText?: LifecyclePolicyText;
    /**
     * The status of the lifecycle policy preview request.
     */
    status?: LifecyclePolicyPreviewStatus;
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
     * The Amazon Resource Name (ARN) of the the resource to which to add tags. Currently, the only supported resource is an Amazon ECR repository.
     */
    resourceArn: Arn;
    /**
     * The tags to add to the resource. A tag is an array of key-value pairs. Tag keys can have a maximum character length of 128 characters, and tag values can have a maximum length of 256 characters.
     */
    tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagStatus = "TAGGED"|"UNTAGGED"|"ANY"|string;
  export type TagValue = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource from which to remove tags. Currently, the only supported resource is an Amazon ECR repository.
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
     * The Amazon Web Services account ID associated with the registry to which you are uploading layer parts. If you do not specify a registry, the default registry is assumed.
     */
    registryId?: RegistryId;
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
  export type VulnerabilitySourceUpdateTimestamp = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-09-21"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the ECR client.
   */
  export import Types = ECR;
}
export = ECR;
