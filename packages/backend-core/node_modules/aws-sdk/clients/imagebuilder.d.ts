import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Imagebuilder extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Imagebuilder.Types.ClientConfiguration)
  config: Config & Imagebuilder.Types.ClientConfiguration;
  /**
   * CancelImageCreation cancels the creation of Image. This operation can only be used on images in a non-terminal state.
   */
  cancelImageCreation(params: Imagebuilder.Types.CancelImageCreationRequest, callback?: (err: AWSError, data: Imagebuilder.Types.CancelImageCreationResponse) => void): Request<Imagebuilder.Types.CancelImageCreationResponse, AWSError>;
  /**
   * CancelImageCreation cancels the creation of Image. This operation can only be used on images in a non-terminal state.
   */
  cancelImageCreation(callback?: (err: AWSError, data: Imagebuilder.Types.CancelImageCreationResponse) => void): Request<Imagebuilder.Types.CancelImageCreationResponse, AWSError>;
  /**
   * Creates a new component that can be used to build, validate, test, and assess your image.
   */
  createComponent(params: Imagebuilder.Types.CreateComponentRequest, callback?: (err: AWSError, data: Imagebuilder.Types.CreateComponentResponse) => void): Request<Imagebuilder.Types.CreateComponentResponse, AWSError>;
  /**
   * Creates a new component that can be used to build, validate, test, and assess your image.
   */
  createComponent(callback?: (err: AWSError, data: Imagebuilder.Types.CreateComponentResponse) => void): Request<Imagebuilder.Types.CreateComponentResponse, AWSError>;
  /**
   * Creates a new container recipe. Container recipes define how images are configured, tested, and assessed.
   */
  createContainerRecipe(params: Imagebuilder.Types.CreateContainerRecipeRequest, callback?: (err: AWSError, data: Imagebuilder.Types.CreateContainerRecipeResponse) => void): Request<Imagebuilder.Types.CreateContainerRecipeResponse, AWSError>;
  /**
   * Creates a new container recipe. Container recipes define how images are configured, tested, and assessed.
   */
  createContainerRecipe(callback?: (err: AWSError, data: Imagebuilder.Types.CreateContainerRecipeResponse) => void): Request<Imagebuilder.Types.CreateContainerRecipeResponse, AWSError>;
  /**
   * Creates a new distribution configuration. Distribution configurations define and configure the outputs of your pipeline.
   */
  createDistributionConfiguration(params: Imagebuilder.Types.CreateDistributionConfigurationRequest, callback?: (err: AWSError, data: Imagebuilder.Types.CreateDistributionConfigurationResponse) => void): Request<Imagebuilder.Types.CreateDistributionConfigurationResponse, AWSError>;
  /**
   * Creates a new distribution configuration. Distribution configurations define and configure the outputs of your pipeline.
   */
  createDistributionConfiguration(callback?: (err: AWSError, data: Imagebuilder.Types.CreateDistributionConfigurationResponse) => void): Request<Imagebuilder.Types.CreateDistributionConfigurationResponse, AWSError>;
  /**
   *  Creates a new image. This request will create a new image along with all of the configured output resources defined in the distribution configuration. You must specify exactly one recipe for your image, using either a ContainerRecipeArn or an ImageRecipeArn.
   */
  createImage(params: Imagebuilder.Types.CreateImageRequest, callback?: (err: AWSError, data: Imagebuilder.Types.CreateImageResponse) => void): Request<Imagebuilder.Types.CreateImageResponse, AWSError>;
  /**
   *  Creates a new image. This request will create a new image along with all of the configured output resources defined in the distribution configuration. You must specify exactly one recipe for your image, using either a ContainerRecipeArn or an ImageRecipeArn.
   */
  createImage(callback?: (err: AWSError, data: Imagebuilder.Types.CreateImageResponse) => void): Request<Imagebuilder.Types.CreateImageResponse, AWSError>;
  /**
   *  Creates a new image pipeline. Image pipelines enable you to automate the creation and distribution of images.
   */
  createImagePipeline(params: Imagebuilder.Types.CreateImagePipelineRequest, callback?: (err: AWSError, data: Imagebuilder.Types.CreateImagePipelineResponse) => void): Request<Imagebuilder.Types.CreateImagePipelineResponse, AWSError>;
  /**
   *  Creates a new image pipeline. Image pipelines enable you to automate the creation and distribution of images.
   */
  createImagePipeline(callback?: (err: AWSError, data: Imagebuilder.Types.CreateImagePipelineResponse) => void): Request<Imagebuilder.Types.CreateImagePipelineResponse, AWSError>;
  /**
   *  Creates a new image recipe. Image recipes define how images are configured, tested, and assessed.
   */
  createImageRecipe(params: Imagebuilder.Types.CreateImageRecipeRequest, callback?: (err: AWSError, data: Imagebuilder.Types.CreateImageRecipeResponse) => void): Request<Imagebuilder.Types.CreateImageRecipeResponse, AWSError>;
  /**
   *  Creates a new image recipe. Image recipes define how images are configured, tested, and assessed.
   */
  createImageRecipe(callback?: (err: AWSError, data: Imagebuilder.Types.CreateImageRecipeResponse) => void): Request<Imagebuilder.Types.CreateImageRecipeResponse, AWSError>;
  /**
   *  Creates a new infrastructure configuration. An infrastructure configuration defines the environment in which your image will be built and tested.
   */
  createInfrastructureConfiguration(params: Imagebuilder.Types.CreateInfrastructureConfigurationRequest, callback?: (err: AWSError, data: Imagebuilder.Types.CreateInfrastructureConfigurationResponse) => void): Request<Imagebuilder.Types.CreateInfrastructureConfigurationResponse, AWSError>;
  /**
   *  Creates a new infrastructure configuration. An infrastructure configuration defines the environment in which your image will be built and tested.
   */
  createInfrastructureConfiguration(callback?: (err: AWSError, data: Imagebuilder.Types.CreateInfrastructureConfigurationResponse) => void): Request<Imagebuilder.Types.CreateInfrastructureConfigurationResponse, AWSError>;
  /**
   *  Deletes a component build version.
   */
  deleteComponent(params: Imagebuilder.Types.DeleteComponentRequest, callback?: (err: AWSError, data: Imagebuilder.Types.DeleteComponentResponse) => void): Request<Imagebuilder.Types.DeleteComponentResponse, AWSError>;
  /**
   *  Deletes a component build version.
   */
  deleteComponent(callback?: (err: AWSError, data: Imagebuilder.Types.DeleteComponentResponse) => void): Request<Imagebuilder.Types.DeleteComponentResponse, AWSError>;
  /**
   * Deletes a container recipe.
   */
  deleteContainerRecipe(params: Imagebuilder.Types.DeleteContainerRecipeRequest, callback?: (err: AWSError, data: Imagebuilder.Types.DeleteContainerRecipeResponse) => void): Request<Imagebuilder.Types.DeleteContainerRecipeResponse, AWSError>;
  /**
   * Deletes a container recipe.
   */
  deleteContainerRecipe(callback?: (err: AWSError, data: Imagebuilder.Types.DeleteContainerRecipeResponse) => void): Request<Imagebuilder.Types.DeleteContainerRecipeResponse, AWSError>;
  /**
   *  Deletes a distribution configuration.
   */
  deleteDistributionConfiguration(params: Imagebuilder.Types.DeleteDistributionConfigurationRequest, callback?: (err: AWSError, data: Imagebuilder.Types.DeleteDistributionConfigurationResponse) => void): Request<Imagebuilder.Types.DeleteDistributionConfigurationResponse, AWSError>;
  /**
   *  Deletes a distribution configuration.
   */
  deleteDistributionConfiguration(callback?: (err: AWSError, data: Imagebuilder.Types.DeleteDistributionConfigurationResponse) => void): Request<Imagebuilder.Types.DeleteDistributionConfigurationResponse, AWSError>;
  /**
   * Deletes an Image Builder image resource. This does not delete any EC2 AMIs or ECR container images that are created during the image build process. You must clean those up separately, using the appropriate Amazon EC2 or Amazon ECR console actions, or API or CLI commands.   To deregister an EC2 Linux AMI, see Deregister your Linux AMI in the  Amazon EC2 User Guide .   To deregister an EC2 Windows AMI, see Deregister your Windows AMI in the  Amazon EC2 Windows Guide .   To delete a container image from Amazon ECR, see Deleting an image in the Amazon ECR User Guide.  
   */
  deleteImage(params: Imagebuilder.Types.DeleteImageRequest, callback?: (err: AWSError, data: Imagebuilder.Types.DeleteImageResponse) => void): Request<Imagebuilder.Types.DeleteImageResponse, AWSError>;
  /**
   * Deletes an Image Builder image resource. This does not delete any EC2 AMIs or ECR container images that are created during the image build process. You must clean those up separately, using the appropriate Amazon EC2 or Amazon ECR console actions, or API or CLI commands.   To deregister an EC2 Linux AMI, see Deregister your Linux AMI in the  Amazon EC2 User Guide .   To deregister an EC2 Windows AMI, see Deregister your Windows AMI in the  Amazon EC2 Windows Guide .   To delete a container image from Amazon ECR, see Deleting an image in the Amazon ECR User Guide.  
   */
  deleteImage(callback?: (err: AWSError, data: Imagebuilder.Types.DeleteImageResponse) => void): Request<Imagebuilder.Types.DeleteImageResponse, AWSError>;
  /**
   *  Deletes an image pipeline.
   */
  deleteImagePipeline(params: Imagebuilder.Types.DeleteImagePipelineRequest, callback?: (err: AWSError, data: Imagebuilder.Types.DeleteImagePipelineResponse) => void): Request<Imagebuilder.Types.DeleteImagePipelineResponse, AWSError>;
  /**
   *  Deletes an image pipeline.
   */
  deleteImagePipeline(callback?: (err: AWSError, data: Imagebuilder.Types.DeleteImagePipelineResponse) => void): Request<Imagebuilder.Types.DeleteImagePipelineResponse, AWSError>;
  /**
   *  Deletes an image recipe.
   */
  deleteImageRecipe(params: Imagebuilder.Types.DeleteImageRecipeRequest, callback?: (err: AWSError, data: Imagebuilder.Types.DeleteImageRecipeResponse) => void): Request<Imagebuilder.Types.DeleteImageRecipeResponse, AWSError>;
  /**
   *  Deletes an image recipe.
   */
  deleteImageRecipe(callback?: (err: AWSError, data: Imagebuilder.Types.DeleteImageRecipeResponse) => void): Request<Imagebuilder.Types.DeleteImageRecipeResponse, AWSError>;
  /**
   *  Deletes an infrastructure configuration.
   */
  deleteInfrastructureConfiguration(params: Imagebuilder.Types.DeleteInfrastructureConfigurationRequest, callback?: (err: AWSError, data: Imagebuilder.Types.DeleteInfrastructureConfigurationResponse) => void): Request<Imagebuilder.Types.DeleteInfrastructureConfigurationResponse, AWSError>;
  /**
   *  Deletes an infrastructure configuration.
   */
  deleteInfrastructureConfiguration(callback?: (err: AWSError, data: Imagebuilder.Types.DeleteInfrastructureConfigurationResponse) => void): Request<Imagebuilder.Types.DeleteInfrastructureConfigurationResponse, AWSError>;
  /**
   *  Gets a component object.
   */
  getComponent(params: Imagebuilder.Types.GetComponentRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetComponentResponse) => void): Request<Imagebuilder.Types.GetComponentResponse, AWSError>;
  /**
   *  Gets a component object.
   */
  getComponent(callback?: (err: AWSError, data: Imagebuilder.Types.GetComponentResponse) => void): Request<Imagebuilder.Types.GetComponentResponse, AWSError>;
  /**
   *  Gets a component policy.
   */
  getComponentPolicy(params: Imagebuilder.Types.GetComponentPolicyRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetComponentPolicyResponse) => void): Request<Imagebuilder.Types.GetComponentPolicyResponse, AWSError>;
  /**
   *  Gets a component policy.
   */
  getComponentPolicy(callback?: (err: AWSError, data: Imagebuilder.Types.GetComponentPolicyResponse) => void): Request<Imagebuilder.Types.GetComponentPolicyResponse, AWSError>;
  /**
   * Retrieves a container recipe.
   */
  getContainerRecipe(params: Imagebuilder.Types.GetContainerRecipeRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetContainerRecipeResponse) => void): Request<Imagebuilder.Types.GetContainerRecipeResponse, AWSError>;
  /**
   * Retrieves a container recipe.
   */
  getContainerRecipe(callback?: (err: AWSError, data: Imagebuilder.Types.GetContainerRecipeResponse) => void): Request<Imagebuilder.Types.GetContainerRecipeResponse, AWSError>;
  /**
   * Retrieves the policy for a container recipe.
   */
  getContainerRecipePolicy(params: Imagebuilder.Types.GetContainerRecipePolicyRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetContainerRecipePolicyResponse) => void): Request<Imagebuilder.Types.GetContainerRecipePolicyResponse, AWSError>;
  /**
   * Retrieves the policy for a container recipe.
   */
  getContainerRecipePolicy(callback?: (err: AWSError, data: Imagebuilder.Types.GetContainerRecipePolicyResponse) => void): Request<Imagebuilder.Types.GetContainerRecipePolicyResponse, AWSError>;
  /**
   *  Gets a distribution configuration.
   */
  getDistributionConfiguration(params: Imagebuilder.Types.GetDistributionConfigurationRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetDistributionConfigurationResponse) => void): Request<Imagebuilder.Types.GetDistributionConfigurationResponse, AWSError>;
  /**
   *  Gets a distribution configuration.
   */
  getDistributionConfiguration(callback?: (err: AWSError, data: Imagebuilder.Types.GetDistributionConfigurationResponse) => void): Request<Imagebuilder.Types.GetDistributionConfigurationResponse, AWSError>;
  /**
   *  Gets an image.
   */
  getImage(params: Imagebuilder.Types.GetImageRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetImageResponse) => void): Request<Imagebuilder.Types.GetImageResponse, AWSError>;
  /**
   *  Gets an image.
   */
  getImage(callback?: (err: AWSError, data: Imagebuilder.Types.GetImageResponse) => void): Request<Imagebuilder.Types.GetImageResponse, AWSError>;
  /**
   *  Gets an image pipeline.
   */
  getImagePipeline(params: Imagebuilder.Types.GetImagePipelineRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetImagePipelineResponse) => void): Request<Imagebuilder.Types.GetImagePipelineResponse, AWSError>;
  /**
   *  Gets an image pipeline.
   */
  getImagePipeline(callback?: (err: AWSError, data: Imagebuilder.Types.GetImagePipelineResponse) => void): Request<Imagebuilder.Types.GetImagePipelineResponse, AWSError>;
  /**
   *  Gets an image policy.
   */
  getImagePolicy(params: Imagebuilder.Types.GetImagePolicyRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetImagePolicyResponse) => void): Request<Imagebuilder.Types.GetImagePolicyResponse, AWSError>;
  /**
   *  Gets an image policy.
   */
  getImagePolicy(callback?: (err: AWSError, data: Imagebuilder.Types.GetImagePolicyResponse) => void): Request<Imagebuilder.Types.GetImagePolicyResponse, AWSError>;
  /**
   *  Gets an image recipe.
   */
  getImageRecipe(params: Imagebuilder.Types.GetImageRecipeRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetImageRecipeResponse) => void): Request<Imagebuilder.Types.GetImageRecipeResponse, AWSError>;
  /**
   *  Gets an image recipe.
   */
  getImageRecipe(callback?: (err: AWSError, data: Imagebuilder.Types.GetImageRecipeResponse) => void): Request<Imagebuilder.Types.GetImageRecipeResponse, AWSError>;
  /**
   *  Gets an image recipe policy.
   */
  getImageRecipePolicy(params: Imagebuilder.Types.GetImageRecipePolicyRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetImageRecipePolicyResponse) => void): Request<Imagebuilder.Types.GetImageRecipePolicyResponse, AWSError>;
  /**
   *  Gets an image recipe policy.
   */
  getImageRecipePolicy(callback?: (err: AWSError, data: Imagebuilder.Types.GetImageRecipePolicyResponse) => void): Request<Imagebuilder.Types.GetImageRecipePolicyResponse, AWSError>;
  /**
   *  Gets an infrastructure configuration.
   */
  getInfrastructureConfiguration(params: Imagebuilder.Types.GetInfrastructureConfigurationRequest, callback?: (err: AWSError, data: Imagebuilder.Types.GetInfrastructureConfigurationResponse) => void): Request<Imagebuilder.Types.GetInfrastructureConfigurationResponse, AWSError>;
  /**
   *  Gets an infrastructure configuration.
   */
  getInfrastructureConfiguration(callback?: (err: AWSError, data: Imagebuilder.Types.GetInfrastructureConfigurationResponse) => void): Request<Imagebuilder.Types.GetInfrastructureConfigurationResponse, AWSError>;
  /**
   * Imports a component and transforms its data into a component document.
   */
  importComponent(params: Imagebuilder.Types.ImportComponentRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ImportComponentResponse) => void): Request<Imagebuilder.Types.ImportComponentResponse, AWSError>;
  /**
   * Imports a component and transforms its data into a component document.
   */
  importComponent(callback?: (err: AWSError, data: Imagebuilder.Types.ImportComponentResponse) => void): Request<Imagebuilder.Types.ImportComponentResponse, AWSError>;
  /**
   *  Returns the list of component build versions for the specified semantic version.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Filtering: With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards. 
   */
  listComponentBuildVersions(params: Imagebuilder.Types.ListComponentBuildVersionsRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListComponentBuildVersionsResponse) => void): Request<Imagebuilder.Types.ListComponentBuildVersionsResponse, AWSError>;
  /**
   *  Returns the list of component build versions for the specified semantic version.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Filtering: With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards. 
   */
  listComponentBuildVersions(callback?: (err: AWSError, data: Imagebuilder.Types.ListComponentBuildVersionsResponse) => void): Request<Imagebuilder.Types.ListComponentBuildVersionsResponse, AWSError>;
  /**
   * Returns the list of component build versions for the specified semantic version.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Filtering: With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards. 
   */
  listComponents(params: Imagebuilder.Types.ListComponentsRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListComponentsResponse) => void): Request<Imagebuilder.Types.ListComponentsResponse, AWSError>;
  /**
   * Returns the list of component build versions for the specified semantic version.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Filtering: With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards. 
   */
  listComponents(callback?: (err: AWSError, data: Imagebuilder.Types.ListComponentsResponse) => void): Request<Imagebuilder.Types.ListComponentsResponse, AWSError>;
  /**
   * Returns a list of container recipes.
   */
  listContainerRecipes(params: Imagebuilder.Types.ListContainerRecipesRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListContainerRecipesResponse) => void): Request<Imagebuilder.Types.ListContainerRecipesResponse, AWSError>;
  /**
   * Returns a list of container recipes.
   */
  listContainerRecipes(callback?: (err: AWSError, data: Imagebuilder.Types.ListContainerRecipesResponse) => void): Request<Imagebuilder.Types.ListContainerRecipesResponse, AWSError>;
  /**
   * Returns a list of distribution configurations.
   */
  listDistributionConfigurations(params: Imagebuilder.Types.ListDistributionConfigurationsRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListDistributionConfigurationsResponse) => void): Request<Imagebuilder.Types.ListDistributionConfigurationsResponse, AWSError>;
  /**
   * Returns a list of distribution configurations.
   */
  listDistributionConfigurations(callback?: (err: AWSError, data: Imagebuilder.Types.ListDistributionConfigurationsResponse) => void): Request<Imagebuilder.Types.ListDistributionConfigurationsResponse, AWSError>;
  /**
   *  Returns a list of image build versions.
   */
  listImageBuildVersions(params: Imagebuilder.Types.ListImageBuildVersionsRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListImageBuildVersionsResponse) => void): Request<Imagebuilder.Types.ListImageBuildVersionsResponse, AWSError>;
  /**
   *  Returns a list of image build versions.
   */
  listImageBuildVersions(callback?: (err: AWSError, data: Imagebuilder.Types.ListImageBuildVersionsResponse) => void): Request<Imagebuilder.Types.ListImageBuildVersionsResponse, AWSError>;
  /**
   * List the Packages that are associated with an Image Build Version, as determined by Amazon Web Services Systems Manager Inventory at build time.
   */
  listImagePackages(params: Imagebuilder.Types.ListImagePackagesRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListImagePackagesResponse) => void): Request<Imagebuilder.Types.ListImagePackagesResponse, AWSError>;
  /**
   * List the Packages that are associated with an Image Build Version, as determined by Amazon Web Services Systems Manager Inventory at build time.
   */
  listImagePackages(callback?: (err: AWSError, data: Imagebuilder.Types.ListImagePackagesResponse) => void): Request<Imagebuilder.Types.ListImagePackagesResponse, AWSError>;
  /**
   *  Returns a list of images created by the specified pipeline.
   */
  listImagePipelineImages(params: Imagebuilder.Types.ListImagePipelineImagesRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListImagePipelineImagesResponse) => void): Request<Imagebuilder.Types.ListImagePipelineImagesResponse, AWSError>;
  /**
   *  Returns a list of images created by the specified pipeline.
   */
  listImagePipelineImages(callback?: (err: AWSError, data: Imagebuilder.Types.ListImagePipelineImagesResponse) => void): Request<Imagebuilder.Types.ListImagePipelineImagesResponse, AWSError>;
  /**
   * Returns a list of image pipelines.
   */
  listImagePipelines(params: Imagebuilder.Types.ListImagePipelinesRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListImagePipelinesResponse) => void): Request<Imagebuilder.Types.ListImagePipelinesResponse, AWSError>;
  /**
   * Returns a list of image pipelines.
   */
  listImagePipelines(callback?: (err: AWSError, data: Imagebuilder.Types.ListImagePipelinesResponse) => void): Request<Imagebuilder.Types.ListImagePipelinesResponse, AWSError>;
  /**
   *  Returns a list of image recipes.
   */
  listImageRecipes(params: Imagebuilder.Types.ListImageRecipesRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListImageRecipesResponse) => void): Request<Imagebuilder.Types.ListImageRecipesResponse, AWSError>;
  /**
   *  Returns a list of image recipes.
   */
  listImageRecipes(callback?: (err: AWSError, data: Imagebuilder.Types.ListImageRecipesResponse) => void): Request<Imagebuilder.Types.ListImageRecipesResponse, AWSError>;
  /**
   *  Returns the list of images that you have access to.
   */
  listImages(params: Imagebuilder.Types.ListImagesRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListImagesResponse) => void): Request<Imagebuilder.Types.ListImagesResponse, AWSError>;
  /**
   *  Returns the list of images that you have access to.
   */
  listImages(callback?: (err: AWSError, data: Imagebuilder.Types.ListImagesResponse) => void): Request<Imagebuilder.Types.ListImagesResponse, AWSError>;
  /**
   *  Returns a list of infrastructure configurations.
   */
  listInfrastructureConfigurations(params: Imagebuilder.Types.ListInfrastructureConfigurationsRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListInfrastructureConfigurationsResponse) => void): Request<Imagebuilder.Types.ListInfrastructureConfigurationsResponse, AWSError>;
  /**
   *  Returns a list of infrastructure configurations.
   */
  listInfrastructureConfigurations(callback?: (err: AWSError, data: Imagebuilder.Types.ListInfrastructureConfigurationsResponse) => void): Request<Imagebuilder.Types.ListInfrastructureConfigurationsResponse, AWSError>;
  /**
   *  Returns the list of tags for the specified resource.
   */
  listTagsForResource(params: Imagebuilder.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: Imagebuilder.Types.ListTagsForResourceResponse) => void): Request<Imagebuilder.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Returns the list of tags for the specified resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: Imagebuilder.Types.ListTagsForResourceResponse) => void): Request<Imagebuilder.Types.ListTagsForResourceResponse, AWSError>;
  /**
   *  Applies a policy to a component. We recommend that you call the RAM API CreateResourceShare to share resources. If you call the Image Builder API PutComponentPolicy, you must also call the RAM API PromoteResourceShareCreatedFromPolicy in order for the resource to be visible to all principals with whom the resource is shared.
   */
  putComponentPolicy(params: Imagebuilder.Types.PutComponentPolicyRequest, callback?: (err: AWSError, data: Imagebuilder.Types.PutComponentPolicyResponse) => void): Request<Imagebuilder.Types.PutComponentPolicyResponse, AWSError>;
  /**
   *  Applies a policy to a component. We recommend that you call the RAM API CreateResourceShare to share resources. If you call the Image Builder API PutComponentPolicy, you must also call the RAM API PromoteResourceShareCreatedFromPolicy in order for the resource to be visible to all principals with whom the resource is shared.
   */
  putComponentPolicy(callback?: (err: AWSError, data: Imagebuilder.Types.PutComponentPolicyResponse) => void): Request<Imagebuilder.Types.PutComponentPolicyResponse, AWSError>;
  /**
   * Applies a policy to a container image. We recommend that you call the RAM API CreateResourceShare (https://docs.aws.amazon.com/ram/latest/APIReference/API_CreateResourceShare.html) to share resources. If you call the Image Builder API PutContainerImagePolicy, you must also call the RAM API PromoteResourceShareCreatedFromPolicy (https://docs.aws.amazon.com/ram/latest/APIReference/API_PromoteResourceShareCreatedFromPolicy.html) in order for the resource to be visible to all principals with whom the resource is shared.
   */
  putContainerRecipePolicy(params: Imagebuilder.Types.PutContainerRecipePolicyRequest, callback?: (err: AWSError, data: Imagebuilder.Types.PutContainerRecipePolicyResponse) => void): Request<Imagebuilder.Types.PutContainerRecipePolicyResponse, AWSError>;
  /**
   * Applies a policy to a container image. We recommend that you call the RAM API CreateResourceShare (https://docs.aws.amazon.com/ram/latest/APIReference/API_CreateResourceShare.html) to share resources. If you call the Image Builder API PutContainerImagePolicy, you must also call the RAM API PromoteResourceShareCreatedFromPolicy (https://docs.aws.amazon.com/ram/latest/APIReference/API_PromoteResourceShareCreatedFromPolicy.html) in order for the resource to be visible to all principals with whom the resource is shared.
   */
  putContainerRecipePolicy(callback?: (err: AWSError, data: Imagebuilder.Types.PutContainerRecipePolicyResponse) => void): Request<Imagebuilder.Types.PutContainerRecipePolicyResponse, AWSError>;
  /**
   * Applies a policy to an image. We recommend that you call the RAM API CreateResourceShare to share resources. If you call the Image Builder API PutImagePolicy, you must also call the RAM API PromoteResourceShareCreatedFromPolicy in order for the resource to be visible to all principals with whom the resource is shared.
   */
  putImagePolicy(params: Imagebuilder.Types.PutImagePolicyRequest, callback?: (err: AWSError, data: Imagebuilder.Types.PutImagePolicyResponse) => void): Request<Imagebuilder.Types.PutImagePolicyResponse, AWSError>;
  /**
   * Applies a policy to an image. We recommend that you call the RAM API CreateResourceShare to share resources. If you call the Image Builder API PutImagePolicy, you must also call the RAM API PromoteResourceShareCreatedFromPolicy in order for the resource to be visible to all principals with whom the resource is shared.
   */
  putImagePolicy(callback?: (err: AWSError, data: Imagebuilder.Types.PutImagePolicyResponse) => void): Request<Imagebuilder.Types.PutImagePolicyResponse, AWSError>;
  /**
   *  Applies a policy to an image recipe. We recommend that you call the RAM API CreateResourceShare to share resources. If you call the Image Builder API PutImageRecipePolicy, you must also call the RAM API PromoteResourceShareCreatedFromPolicy in order for the resource to be visible to all principals with whom the resource is shared.
   */
  putImageRecipePolicy(params: Imagebuilder.Types.PutImageRecipePolicyRequest, callback?: (err: AWSError, data: Imagebuilder.Types.PutImageRecipePolicyResponse) => void): Request<Imagebuilder.Types.PutImageRecipePolicyResponse, AWSError>;
  /**
   *  Applies a policy to an image recipe. We recommend that you call the RAM API CreateResourceShare to share resources. If you call the Image Builder API PutImageRecipePolicy, you must also call the RAM API PromoteResourceShareCreatedFromPolicy in order for the resource to be visible to all principals with whom the resource is shared.
   */
  putImageRecipePolicy(callback?: (err: AWSError, data: Imagebuilder.Types.PutImageRecipePolicyResponse) => void): Request<Imagebuilder.Types.PutImageRecipePolicyResponse, AWSError>;
  /**
   *  Manually triggers a pipeline to create an image.
   */
  startImagePipelineExecution(params: Imagebuilder.Types.StartImagePipelineExecutionRequest, callback?: (err: AWSError, data: Imagebuilder.Types.StartImagePipelineExecutionResponse) => void): Request<Imagebuilder.Types.StartImagePipelineExecutionResponse, AWSError>;
  /**
   *  Manually triggers a pipeline to create an image.
   */
  startImagePipelineExecution(callback?: (err: AWSError, data: Imagebuilder.Types.StartImagePipelineExecutionResponse) => void): Request<Imagebuilder.Types.StartImagePipelineExecutionResponse, AWSError>;
  /**
   *  Adds a tag to a resource.
   */
  tagResource(params: Imagebuilder.Types.TagResourceRequest, callback?: (err: AWSError, data: Imagebuilder.Types.TagResourceResponse) => void): Request<Imagebuilder.Types.TagResourceResponse, AWSError>;
  /**
   *  Adds a tag to a resource.
   */
  tagResource(callback?: (err: AWSError, data: Imagebuilder.Types.TagResourceResponse) => void): Request<Imagebuilder.Types.TagResourceResponse, AWSError>;
  /**
   *  Removes a tag from a resource.
   */
  untagResource(params: Imagebuilder.Types.UntagResourceRequest, callback?: (err: AWSError, data: Imagebuilder.Types.UntagResourceResponse) => void): Request<Imagebuilder.Types.UntagResourceResponse, AWSError>;
  /**
   *  Removes a tag from a resource.
   */
  untagResource(callback?: (err: AWSError, data: Imagebuilder.Types.UntagResourceResponse) => void): Request<Imagebuilder.Types.UntagResourceResponse, AWSError>;
  /**
   *  Updates a new distribution configuration. Distribution configurations define and configure the outputs of your pipeline.
   */
  updateDistributionConfiguration(params: Imagebuilder.Types.UpdateDistributionConfigurationRequest, callback?: (err: AWSError, data: Imagebuilder.Types.UpdateDistributionConfigurationResponse) => void): Request<Imagebuilder.Types.UpdateDistributionConfigurationResponse, AWSError>;
  /**
   *  Updates a new distribution configuration. Distribution configurations define and configure the outputs of your pipeline.
   */
  updateDistributionConfiguration(callback?: (err: AWSError, data: Imagebuilder.Types.UpdateDistributionConfigurationResponse) => void): Request<Imagebuilder.Types.UpdateDistributionConfigurationResponse, AWSError>;
  /**
   *  Updates an image pipeline. Image pipelines enable you to automate the creation and distribution of images.  UpdateImagePipeline does not support selective updates for the pipeline. You must specify all of the required properties in the update request, not just the properties that have changed. 
   */
  updateImagePipeline(params: Imagebuilder.Types.UpdateImagePipelineRequest, callback?: (err: AWSError, data: Imagebuilder.Types.UpdateImagePipelineResponse) => void): Request<Imagebuilder.Types.UpdateImagePipelineResponse, AWSError>;
  /**
   *  Updates an image pipeline. Image pipelines enable you to automate the creation and distribution of images.  UpdateImagePipeline does not support selective updates for the pipeline. You must specify all of the required properties in the update request, not just the properties that have changed. 
   */
  updateImagePipeline(callback?: (err: AWSError, data: Imagebuilder.Types.UpdateImagePipelineResponse) => void): Request<Imagebuilder.Types.UpdateImagePipelineResponse, AWSError>;
  /**
   *  Updates a new infrastructure configuration. An infrastructure configuration defines the environment in which your image will be built and tested.
   */
  updateInfrastructureConfiguration(params: Imagebuilder.Types.UpdateInfrastructureConfigurationRequest, callback?: (err: AWSError, data: Imagebuilder.Types.UpdateInfrastructureConfigurationResponse) => void): Request<Imagebuilder.Types.UpdateInfrastructureConfigurationResponse, AWSError>;
  /**
   *  Updates a new infrastructure configuration. An infrastructure configuration defines the environment in which your image will be built and tested.
   */
  updateInfrastructureConfiguration(callback?: (err: AWSError, data: Imagebuilder.Types.UpdateInfrastructureConfigurationResponse) => void): Request<Imagebuilder.Types.UpdateInfrastructureConfigurationResponse, AWSError>;
}
declare namespace Imagebuilder {
  export type AccountId = string;
  export type AccountList = AccountId[];
  export interface AdditionalInstanceConfiguration {
    /**
     * Contains settings for the Systems Manager agent on your build instance.
     */
    systemsManagerAgent?: SystemsManagerAgent;
    /**
     * Use this property to provide commands or a command script to run when you launch your build instance.  The userDataOverride property replaces any commands that Image Builder might have added to ensure that Systems Manager is installed on your Linux build instance. If you override the user data, make sure that you add commands to install Systems Manager, if it is not pre-installed on your base image. 
     */
    userDataOverride?: UserDataOverride;
  }
  export interface Ami {
    /**
     * The Amazon Web Services Region of the Amazon EC2 AMI.
     */
    region?: NonEmptyString;
    /**
     * The AMI ID of the Amazon EC2 AMI.
     */
    image?: NonEmptyString;
    /**
     * The name of the Amazon EC2 AMI.
     */
    name?: NonEmptyString;
    /**
     * The description of the Amazon EC2 AMI. Minimum and maximum length are in characters.
     */
    description?: NonEmptyString;
    state?: ImageState;
    /**
     * The account ID of the owner of the AMI.
     */
    accountId?: NonEmptyString;
  }
  export interface AmiDistributionConfiguration {
    /**
     * The name of the output AMI.
     */
    name?: AmiNameString;
    /**
     * The description of the distribution configuration. Minimum and maximum length are in characters.
     */
    description?: NonEmptyString;
    /**
     * The ID of an account to which you want to distribute an image.
     */
    targetAccountIds?: AccountList;
    /**
     * The tags to apply to AMIs distributed to this Region.
     */
    amiTags?: TagMap;
    /**
     * The KMS key identifier used to encrypt the distributed image.
     */
    kmsKeyId?: NonEmptyString;
    /**
     *  Launch permissions can be used to configure which Amazon Web Services accounts can use the AMI to launch instances.
     */
    launchPermission?: LaunchPermissionConfiguration;
  }
  export type AmiList = Ami[];
  export type AmiNameString = string;
  export type Arn = string;
  export type Boolean = boolean;
  export interface CancelImageCreationRequest {
    /**
     * The Amazon Resource Name (ARN) of the image whose creation you want to cancel.
     */
    imageBuildVersionArn: ImageBuildVersionArn;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken: ClientToken;
  }
  export interface CancelImageCreationResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the image whose creation has been cancelled.
     */
    imageBuildVersionArn?: ImageBuildVersionArn;
  }
  export type ClientToken = string;
  export interface Component {
    /**
     * The Amazon Resource Name (ARN) of the component.
     */
    arn?: ImageBuilderArn;
    /**
     * The name of the component.
     */
    name?: ResourceName;
    /**
     * The version of the component.
     */
    version?: VersionNumber;
    /**
     * The description of the component.
     */
    description?: NonEmptyString;
    /**
     * The change description of the component.
     */
    changeDescription?: NonEmptyString;
    /**
     * The type of the component denotes whether the component is used to build the image or only to test it.
     */
    type?: ComponentType;
    /**
     * The platform of the component.
     */
    platform?: Platform;
    /**
     * The operating system (OS) version supported by the component. If the OS information is available, a prefix match is performed against the base image OS version during image recipe creation.
     */
    supportedOsVersions?: OsVersionList;
    /**
     * Describes the current status of the component. This is used for components that are no longer active.
     */
    state?: ComponentState;
    /**
     * Contains parameter details for each of the parameters that are defined for the component.
     */
    parameters?: ComponentParameterDetailList;
    /**
     * The owner of the component.
     */
    owner?: NonEmptyString;
    /**
     * The data of the component.
     */
    data?: ComponentData;
    /**
     * The KMS key identifier used to encrypt the component.
     */
    kmsKeyId?: NonEmptyString;
    /**
     * The encryption status of the component.
     */
    encrypted?: NullableBoolean;
    /**
     * The date that the component was created.
     */
    dateCreated?: DateTime;
    /**
     * The tags associated with the component.
     */
    tags?: TagMap;
  }
  export type ComponentBuildVersionArn = string;
  export interface ComponentConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the component.
     */
    componentArn: ComponentVersionArnOrBuildVersionArn;
    /**
     * A group of parameter settings that are used to configure the component for a specific recipe.
     */
    parameters?: ComponentParameterList;
  }
  export type ComponentConfigurationList = ComponentConfiguration[];
  export type ComponentData = string;
  export type ComponentFormat = "SHELL"|string;
  export interface ComponentParameter {
    /**
     * The name of the component parameter to set.
     */
    name: ComponentParameterName;
    /**
     * Sets the value for the named component parameter.
     */
    value: ComponentParameterValueList;
  }
  export type ComponentParameterDescription = string;
  export interface ComponentParameterDetail {
    /**
     * The name of this input parameter.
     */
    name: ComponentParameterName;
    /**
     * The type of input this parameter provides. The currently supported value is "string".
     */
    type: ComponentParameterType;
    /**
     * The default value of this parameter if no input is provided.
     */
    defaultValue?: ComponentParameterValueList;
    /**
     * Describes this parameter.
     */
    description?: ComponentParameterDescription;
  }
  export type ComponentParameterDetailList = ComponentParameterDetail[];
  export type ComponentParameterList = ComponentParameter[];
  export type ComponentParameterName = string;
  export type ComponentParameterType = string;
  export type ComponentParameterValue = string;
  export type ComponentParameterValueList = ComponentParameterValue[];
  export interface ComponentState {
    /**
     * The current state of the component.
     */
    status?: ComponentStatus;
    /**
     * Describes how or why the component changed state.
     */
    reason?: NonEmptyString;
  }
  export type ComponentStatus = "DEPRECATED"|string;
  export interface ComponentSummary {
    /**
     * The Amazon Resource Name (ARN) of the component.
     */
    arn?: ImageBuilderArn;
    /**
     * The name of the component.
     */
    name?: ResourceName;
    /**
     * The version of the component.
     */
    version?: VersionNumber;
    /**
     * The platform of the component.
     */
    platform?: Platform;
    /**
     * The operating system (OS) version supported by the component. If the OS information is available, a prefix match is performed against the base image OS version during image recipe creation.
     */
    supportedOsVersions?: OsVersionList;
    /**
     * Describes the current status of the component.
     */
    state?: ComponentState;
    /**
     * The type of the component denotes whether the component is used to build the image or only to test it.
     */
    type?: ComponentType;
    /**
     * The owner of the component.
     */
    owner?: NonEmptyString;
    /**
     * The description of the component.
     */
    description?: NonEmptyString;
    /**
     * The change description of the component.
     */
    changeDescription?: NonEmptyString;
    /**
     * The date that the component was created.
     */
    dateCreated?: DateTime;
    /**
     * The tags associated with the component.
     */
    tags?: TagMap;
  }
  export type ComponentSummaryList = ComponentSummary[];
  export type ComponentType = "BUILD"|"TEST"|string;
  export interface ComponentVersion {
    /**
     * The Amazon Resource Name (ARN) of the component.  Semantic versioning is included in each object's Amazon Resource Name (ARN), at the level that applies to that object as follows:   Versionless ARNs and Name ARNs do not include specific values in any of the nodes. The nodes are either left off entirely, or they are specified as wildcards, for example: x.x.x.   Version ARNs have only the first three nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;   Build version ARNs have all four nodes, and point to a specific build for a specific version of an object.   
     */
    arn?: ImageBuilderArn;
    /**
     * The name of the component.
     */
    name?: ResourceName;
    /**
     * The semantic version of the component.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Assignment: For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.  Patterns: You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01.  Filtering: With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards. 
     */
    version?: VersionNumber;
    /**
     * The description of the component.
     */
    description?: NonEmptyString;
    /**
     * The platform of the component.
     */
    platform?: Platform;
    /**
     * he operating system (OS) version supported by the component. If the OS information is available, a prefix match is performed against the base image OS version during image recipe creation.
     */
    supportedOsVersions?: OsVersionList;
    /**
     * The type of the component denotes whether the component is used to build the image or only to test it.
     */
    type?: ComponentType;
    /**
     * The owner of the component.
     */
    owner?: NonEmptyString;
    /**
     * The date that the component was created.
     */
    dateCreated?: DateTime;
  }
  export type ComponentVersionArn = string;
  export type ComponentVersionArnOrBuildVersionArn = string;
  export type ComponentVersionList = ComponentVersion[];
  export interface Container {
    /**
     * Containers and container images are Region-specific. This is the Region context for the container.
     */
    region?: NonEmptyString;
    /**
     * A list of URIs for containers created in the context Region.
     */
    imageUris?: StringList;
  }
  export interface ContainerDistributionConfiguration {
    /**
     * The description of the container distribution configuration.
     */
    description?: NonEmptyString;
    /**
     * Tags that are attached to the container distribution configuration.
     */
    containerTags?: StringList;
    /**
     * The destination repository for the container distribution configuration.
     */
    targetRepository: TargetContainerRepository;
  }
  export type ContainerList = Container[];
  export interface ContainerRecipe {
    /**
     * The Amazon Resource Name (ARN) of the container recipe.  Semantic versioning is included in each object's Amazon Resource Name (ARN), at the level that applies to that object as follows:   Versionless ARNs and Name ARNs do not include specific values in any of the nodes. The nodes are either left off entirely, or they are specified as wildcards, for example: x.x.x.   Version ARNs have only the first three nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;   Build version ARNs have all four nodes, and point to a specific build for a specific version of an object.   
     */
    arn?: ImageBuilderArn;
    /**
     * Specifies the type of container, such as Docker.
     */
    containerType?: ContainerType;
    /**
     * The name of the container recipe.
     */
    name?: ResourceName;
    /**
     * The description of the container recipe.
     */
    description?: NonEmptyString;
    /**
     * The system platform for the container, such as Windows or Linux.
     */
    platform?: Platform;
    /**
     * The owner of the container recipe.
     */
    owner?: NonEmptyString;
    /**
     * The semantic version of the container recipe.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Assignment: For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.  Patterns: You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01.  Filtering: With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards. 
     */
    version?: VersionNumber;
    /**
     * Components for build and test that are included in the container recipe.
     */
    components?: ComponentConfigurationList;
    /**
     * A group of options that can be used to configure an instance for building and testing container images.
     */
    instanceConfiguration?: InstanceConfiguration;
    /**
     * Dockerfiles are text documents that are used to build Docker containers, and ensure that they contain all of the elements required by the application running inside. The template data consists of contextual variables where Image Builder places build information or scripts, based on your container image recipe.
     */
    dockerfileTemplateData?: DockerFileTemplate;
    /**
     * Identifies which KMS key is used to encrypt the container image for distribution to the target Region.
     */
    kmsKeyId?: NonEmptyString;
    /**
     * A flag that indicates if the target container is encrypted.
     */
    encrypted?: NullableBoolean;
    /**
     * The base image for the container recipe.
     */
    parentImage?: NonEmptyString;
    /**
     * The date when this container recipe was created.
     */
    dateCreated?: DateTime;
    /**
     * Tags that are attached to the container recipe.
     */
    tags?: TagMap;
    /**
     * The working directory for use during build and test workflows.
     */
    workingDirectory?: NonEmptyString;
    /**
     * The destination repository for the container image.
     */
    targetRepository?: TargetContainerRepository;
  }
  export type ContainerRecipeArn = string;
  export interface ContainerRecipeSummary {
    /**
     * The Amazon Resource Name (ARN) of the container recipe.
     */
    arn?: ImageBuilderArn;
    /**
     * Specifies the type of container, such as "Docker".
     */
    containerType?: ContainerType;
    /**
     * The name of the container recipe.
     */
    name?: ResourceName;
    /**
     * The system platform for the container, such as Windows or Linux.
     */
    platform?: Platform;
    /**
     * The owner of the container recipe.
     */
    owner?: NonEmptyString;
    /**
     * The base image for the container recipe.
     */
    parentImage?: NonEmptyString;
    /**
     * The date when this container recipe was created.
     */
    dateCreated?: DateTime;
    /**
     * Tags that are attached to the container recipe.
     */
    tags?: TagMap;
  }
  export type ContainerRecipeSummaryList = ContainerRecipeSummary[];
  export type ContainerRepositoryService = "ECR"|string;
  export type ContainerType = "DOCKER"|string;
  export interface CreateComponentRequest {
    /**
     * The name of the component.
     */
    name: ResourceName;
    /**
     * The semantic version of the component. This version follows the semantic version syntax.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Assignment: For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.  Patterns: You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01. 
     */
    semanticVersion: VersionNumber;
    /**
     * The description of the component. Describes the contents of the component.
     */
    description?: NonEmptyString;
    /**
     * The change description of the component. Describes what change has been made in this version, or what makes this version different from other versions of this component.
     */
    changeDescription?: NonEmptyString;
    /**
     * The platform of the component.
     */
    platform: Platform;
    /**
     *  The operating system (OS) version supported by the component. If the OS information is available, a prefix match is performed against the base image OS version during image recipe creation.
     */
    supportedOsVersions?: OsVersionList;
    /**
     * The data of the component. Used to specify the data inline. Either data or uri can be used to specify the data within the component.
     */
    data?: InlineComponentData;
    /**
     * The uri of the component. Must be an Amazon S3 URL and the requester must have permission to access the Amazon S3 bucket. If you use Amazon S3, you can specify component content up to your service quota. Either data or uri can be used to specify the data within the component.
     */
    uri?: Uri;
    /**
     * The ID of the KMS key that should be used to encrypt this component.
     */
    kmsKeyId?: NonEmptyString;
    /**
     * The tags of the component.
     */
    tags?: TagMap;
    /**
     * The idempotency token of the component.
     */
    clientToken: ClientToken;
  }
  export interface CreateComponentResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the component that was created by this request.
     */
    componentBuildVersionArn?: ComponentBuildVersionArn;
  }
  export interface CreateContainerRecipeRequest {
    /**
     * The type of container to create.
     */
    containerType: ContainerType;
    /**
     * The name of the container recipe.
     */
    name: ResourceName;
    /**
     * The description of the container recipe.
     */
    description?: NonEmptyString;
    /**
     * The semantic version of the container recipe. This version follows the semantic version syntax.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Assignment: For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.  Patterns: You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01. 
     */
    semanticVersion: VersionNumber;
    /**
     * Components for build and test that are included in the container recipe.
     */
    components: ComponentConfigurationList;
    /**
     * A group of options that can be used to configure an instance for building and testing container images.
     */
    instanceConfiguration?: InstanceConfiguration;
    /**
     * The Dockerfile template used to build your image as an inline data blob.
     */
    dockerfileTemplateData?: InlineDockerFileTemplate;
    /**
     * The Amazon S3 URI for the Dockerfile that will be used to build your container image.
     */
    dockerfileTemplateUri?: Uri;
    /**
     * Specifies the operating system platform when you use a custom base image.
     */
    platformOverride?: Platform;
    /**
     * Specifies the operating system version for the base image.
     */
    imageOsVersionOverride?: NonEmptyString;
    /**
     * The base image for the container recipe.
     */
    parentImage: NonEmptyString;
    /**
     * Tags that are attached to the container recipe.
     */
    tags?: TagMap;
    /**
     * The working directory for use during build and test workflows.
     */
    workingDirectory?: NonEmptyString;
    /**
     * The destination repository for the container image.
     */
    targetRepository: TargetContainerRepository;
    /**
     * Identifies which KMS key is used to encrypt the container image.
     */
    kmsKeyId?: NonEmptyString;
    /**
     * The client token used to make this request idempotent.
     */
    clientToken: ClientToken;
  }
  export interface CreateContainerRecipeResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The client token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     * Returns the Amazon Resource Name (ARN) of the container recipe that the request created.
     */
    containerRecipeArn?: ContainerRecipeArn;
  }
  export interface CreateDistributionConfigurationRequest {
    /**
     *  The name of the distribution configuration.
     */
    name: ResourceName;
    /**
     *  The description of the distribution configuration.
     */
    description?: NonEmptyString;
    /**
     *  The distributions of the distribution configuration.
     */
    distributions: DistributionList;
    /**
     *  The tags of the distribution configuration.
     */
    tags?: TagMap;
    /**
     *  The idempotency token of the distribution configuration.
     */
    clientToken: ClientToken;
  }
  export interface CreateDistributionConfigurationResponse {
    /**
     *  The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     *  The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     *  The Amazon Resource Name (ARN) of the distribution configuration that was created by this request.
     */
    distributionConfigurationArn?: DistributionConfigurationArn;
  }
  export interface CreateImagePipelineRequest {
    /**
     *  The name of the image pipeline.
     */
    name: ResourceName;
    /**
     *  The description of the image pipeline.
     */
    description?: NonEmptyString;
    /**
     *  The Amazon Resource Name (ARN) of the image recipe that will be used to configure images created by this image pipeline.
     */
    imageRecipeArn?: ImageRecipeArn;
    /**
     * The Amazon Resource Name (ARN) of the container recipe that is used to configure images created by this container pipeline.
     */
    containerRecipeArn?: ContainerRecipeArn;
    /**
     *  The Amazon Resource Name (ARN) of the infrastructure configuration that will be used to build images created by this image pipeline.
     */
    infrastructureConfigurationArn: InfrastructureConfigurationArn;
    /**
     *  The Amazon Resource Name (ARN) of the distribution configuration that will be used to configure and distribute images created by this image pipeline.
     */
    distributionConfigurationArn?: DistributionConfigurationArn;
    /**
     *  The image test configuration of the image pipeline.
     */
    imageTestsConfiguration?: ImageTestsConfiguration;
    /**
     *  Collects additional information about the image being created, including the operating system (OS) version and package list. This information is used to enhance the overall experience of using EC2 Image Builder. Enabled by default.
     */
    enhancedImageMetadataEnabled?: NullableBoolean;
    /**
     *  The schedule of the image pipeline.
     */
    schedule?: Schedule;
    /**
     *  The status of the image pipeline.
     */
    status?: PipelineStatus;
    /**
     *  The tags of the image pipeline.
     */
    tags?: TagMap;
    /**
     *  The idempotency token used to make this request idempotent.
     */
    clientToken: ClientToken;
  }
  export interface CreateImagePipelineResponse {
    /**
     *  The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     *  The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     *  The Amazon Resource Name (ARN) of the image pipeline that was created by this request.
     */
    imagePipelineArn?: ImagePipelineArn;
  }
  export interface CreateImageRecipeRequest {
    /**
     *  The name of the image recipe.
     */
    name: ResourceName;
    /**
     *  The description of the image recipe.
     */
    description?: NonEmptyString;
    /**
     * The semantic version of the image recipe. This version follows the semantic version syntax.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Assignment: For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.  Patterns: You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01. 
     */
    semanticVersion: VersionNumber;
    /**
     * The components of the image recipe.
     */
    components: ComponentConfigurationList;
    /**
     * The base image of the image recipe. The value of the string can be the ARN of the base image or an AMI ID. The format for the ARN follows this example: arn:aws:imagebuilder:us-west-2:aws:image/windows-server-2016-english-full-base-x86/x.x.x. You can provide the specific version that you want to use, or you can use a wildcard in all of the fields. If you enter an AMI ID for the string value, you must have access to the AMI, and the AMI must be in the same Region in which you are using Image Builder.
     */
    parentImage: NonEmptyString;
    /**
     * The block device mappings of the image recipe.
     */
    blockDeviceMappings?: InstanceBlockDeviceMappings;
    /**
     *  The tags of the image recipe.
     */
    tags?: TagMap;
    /**
     * The working directory used during build and test workflows.
     */
    workingDirectory?: NonEmptyString;
    /**
     * Specify additional settings and launch scripts for your build instances.
     */
    additionalInstanceConfiguration?: AdditionalInstanceConfiguration;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken: ClientToken;
  }
  export interface CreateImageRecipeResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the image recipe that was created by this request.
     */
    imageRecipeArn?: ImageRecipeArn;
  }
  export interface CreateImageRequest {
    /**
     *  The Amazon Resource Name (ARN) of the image recipe that defines how images are configured, tested, and assessed.
     */
    imageRecipeArn?: ImageRecipeArn;
    /**
     * The Amazon Resource Name (ARN) of the container recipe that defines how images are configured and tested.
     */
    containerRecipeArn?: ContainerRecipeArn;
    /**
     *  The Amazon Resource Name (ARN) of the distribution configuration that defines and configures the outputs of your pipeline.
     */
    distributionConfigurationArn?: DistributionConfigurationArn;
    /**
     *  The Amazon Resource Name (ARN) of the infrastructure configuration that defines the environment in which your image will be built and tested.
     */
    infrastructureConfigurationArn: InfrastructureConfigurationArn;
    /**
     *  The image tests configuration of the image.
     */
    imageTestsConfiguration?: ImageTestsConfiguration;
    /**
     *  Collects additional information about the image being created, including the operating system (OS) version and package list. This information is used to enhance the overall experience of using EC2 Image Builder. Enabled by default.
     */
    enhancedImageMetadataEnabled?: NullableBoolean;
    /**
     *  The tags of the image.
     */
    tags?: TagMap;
    /**
     *  The idempotency token used to make this request idempotent.
     */
    clientToken: ClientToken;
  }
  export interface CreateImageResponse {
    /**
     *  The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     *  The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     *  The Amazon Resource Name (ARN) of the image that was created by this request.
     */
    imageBuildVersionArn?: ImageBuildVersionArn;
  }
  export interface CreateInfrastructureConfigurationRequest {
    /**
     * The name of the infrastructure configuration.
     */
    name: ResourceName;
    /**
     * The description of the infrastructure configuration.
     */
    description?: NonEmptyString;
    /**
     * The instance types of the infrastructure configuration. You can specify one or more instance types to use for this build. The service will pick one of these instance types based on availability.
     */
    instanceTypes?: InstanceTypeList;
    /**
     * The instance profile to associate with the instance used to customize your Amazon EC2 AMI.
     */
    instanceProfileName: InstanceProfileNameType;
    /**
     * The security group IDs to associate with the instance used to customize your Amazon EC2 AMI.
     */
    securityGroupIds?: SecurityGroupIds;
    /**
     * The subnet ID in which to place the instance used to customize your Amazon EC2 AMI.
     */
    subnetId?: NonEmptyString;
    /**
     * The logging configuration of the infrastructure configuration.
     */
    logging?: Logging;
    /**
     * The key pair of the infrastructure configuration. You can use this to log on to and debug the instance used to create your image.
     */
    keyPair?: NonEmptyString;
    /**
     * The terminate instance on failure setting of the infrastructure configuration. Set to false if you want Image Builder to retain the instance used to configure your AMI if the build or test phase of your workflow fails.
     */
    terminateInstanceOnFailure?: NullableBoolean;
    /**
     * The SNS topic on which to send image build events.
     */
    snsTopicArn?: SnsTopicArn;
    /**
     * The tags attached to the resource created by Image Builder.
     */
    resourceTags?: ResourceTagMap;
    /**
     * The instance metadata options that you can set for the HTTP requests that pipeline builds use to launch EC2 build and test instances.
     */
    instanceMetadataOptions?: InstanceMetadataOptions;
    /**
     * The tags of the infrastructure configuration.
     */
    tags?: TagMap;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken: ClientToken;
  }
  export interface CreateInfrastructureConfigurationResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration that was created by this request.
     */
    infrastructureConfigurationArn?: InfrastructureConfigurationArn;
  }
  export type DateTime = string;
  export interface DeleteComponentRequest {
    /**
     * The Amazon Resource Name (ARN) of the component build version to delete.
     */
    componentBuildVersionArn: ComponentBuildVersionArn;
  }
  export interface DeleteComponentResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the component build version that was deleted.
     */
    componentBuildVersionArn?: ComponentBuildVersionArn;
  }
  export interface DeleteContainerRecipeRequest {
    /**
     * The Amazon Resource Name (ARN) of the container recipe to delete.
     */
    containerRecipeArn: ContainerRecipeArn;
  }
  export interface DeleteContainerRecipeResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the container recipe that was deleted.
     */
    containerRecipeArn?: ContainerRecipeArn;
  }
  export interface DeleteDistributionConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration to delete.
     */
    distributionConfigurationArn: DistributionConfigurationArn;
  }
  export interface DeleteDistributionConfigurationResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration that was deleted.
     */
    distributionConfigurationArn?: DistributionConfigurationArn;
  }
  export interface DeleteImagePipelineRequest {
    /**
     * The Amazon Resource Name (ARN) of the image pipeline to delete.
     */
    imagePipelineArn: ImagePipelineArn;
  }
  export interface DeleteImagePipelineResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the image pipeline that was deleted.
     */
    imagePipelineArn?: ImagePipelineArn;
  }
  export interface DeleteImageRecipeRequest {
    /**
     * The Amazon Resource Name (ARN) of the image recipe to delete.
     */
    imageRecipeArn: ImageRecipeArn;
  }
  export interface DeleteImageRecipeResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the image recipe that was deleted.
     */
    imageRecipeArn?: ImageRecipeArn;
  }
  export interface DeleteImageRequest {
    /**
     * The Amazon Resource Name (ARN) of the Image Builder image resource to delete.
     */
    imageBuildVersionArn: ImageBuildVersionArn;
  }
  export interface DeleteImageResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the Image Builder image resource that was deleted.
     */
    imageBuildVersionArn?: ImageBuildVersionArn;
  }
  export interface DeleteInfrastructureConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration to delete.
     */
    infrastructureConfigurationArn: InfrastructureConfigurationArn;
  }
  export interface DeleteInfrastructureConfigurationResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration that was deleted.
     */
    infrastructureConfigurationArn?: InfrastructureConfigurationArn;
  }
  export interface Distribution {
    /**
     * The target Region.
     */
    region: NonEmptyString;
    /**
     * The specific AMI settings; for example, launch permissions or AMI tags.
     */
    amiDistributionConfiguration?: AmiDistributionConfiguration;
    /**
     * Container distribution settings for encryption, licensing, and sharing in a specific Region.
     */
    containerDistributionConfiguration?: ContainerDistributionConfiguration;
    /**
     * The License Manager Configuration to associate with the AMI in the specified Region.
     */
    licenseConfigurationArns?: LicenseConfigurationArnList;
    /**
     * A group of launchTemplateConfiguration settings that apply to image distribution for specified accounts.
     */
    launchTemplateConfigurations?: LaunchTemplateConfigurationList;
  }
  export interface DistributionConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration.
     */
    arn?: ImageBuilderArn;
    /**
     * The name of the distribution configuration.
     */
    name?: ResourceName;
    /**
     * The description of the distribution configuration.
     */
    description?: NonEmptyString;
    /**
     * The distribution objects that apply Region-specific settings for the deployment of the image to targeted Regions.
     */
    distributions?: DistributionList;
    /**
     * The maximum duration in minutes for this distribution configuration.
     */
    timeoutMinutes: DistributionTimeoutMinutes;
    /**
     * The date on which this distribution configuration was created.
     */
    dateCreated?: DateTime;
    /**
     * The date on which this distribution configuration was last updated.
     */
    dateUpdated?: DateTime;
    /**
     * The tags of the distribution configuration.
     */
    tags?: TagMap;
  }
  export type DistributionConfigurationArn = string;
  export interface DistributionConfigurationSummary {
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration.
     */
    arn?: ImageBuilderArn;
    /**
     * The name of the distribution configuration.
     */
    name?: ResourceName;
    /**
     * The description of the distribution configuration.
     */
    description?: NonEmptyString;
    /**
     * The date on which the distribution configuration was created.
     */
    dateCreated?: DateTime;
    /**
     * The date on which the distribution configuration was updated.
     */
    dateUpdated?: DateTime;
    /**
     * The tags associated with the distribution configuration.
     */
    tags?: TagMap;
    /**
     * A list of Regions where the container image is distributed to.
     */
    regions?: RegionList;
  }
  export type DistributionConfigurationSummaryList = DistributionConfigurationSummary[];
  export type DistributionList = Distribution[];
  export type DistributionTimeoutMinutes = number;
  export type DockerFileTemplate = string;
  export interface EbsInstanceBlockDeviceSpecification {
    /**
     * Use to configure device encryption.
     */
    encrypted?: NullableBoolean;
    /**
     * Use to configure delete on termination of the associated device.
     */
    deleteOnTermination?: NullableBoolean;
    /**
     * Use to configure device IOPS.
     */
    iops?: EbsIopsInteger;
    /**
     * Use to configure the KMS key to use when encrypting the device.
     */
    kmsKeyId?: NonEmptyString;
    /**
     * The snapshot that defines the device contents.
     */
    snapshotId?: NonEmptyString;
    /**
     * Use to override the device's volume size.
     */
    volumeSize?: EbsVolumeSizeInteger;
    /**
     * Use to override the device's volume type.
     */
    volumeType?: EbsVolumeType;
    /**
     *  For GP3 volumes only – The throughput in MiB/s that the volume supports. 
     */
    throughput?: EbsVolumeThroughput;
  }
  export type EbsIopsInteger = number;
  export type EbsVolumeSizeInteger = number;
  export type EbsVolumeThroughput = number;
  export type EbsVolumeType = "standard"|"io1"|"io2"|"gp2"|"gp3"|"sc1"|"st1"|string;
  export type EmptyString = string;
  export interface Filter {
    /**
     * The name of the filter. Filter names are case-sensitive.
     */
    name?: FilterName;
    /**
     * The filter values. Filter values are case-sensitive.
     */
    values?: FilterValues;
  }
  export type FilterList = Filter[];
  export type FilterName = string;
  export type FilterValue = string;
  export type FilterValues = FilterValue[];
  export interface GetComponentPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the component whose policy you want to retrieve.
     */
    componentArn: ComponentBuildVersionArn;
  }
  export interface GetComponentPolicyResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The component policy.
     */
    policy?: ResourcePolicyDocument;
  }
  export interface GetComponentRequest {
    /**
     * The Amazon Resource Name (ARN) of the component that you want to retrieve. Regex requires "/\d+$" suffix.
     */
    componentBuildVersionArn: ComponentVersionArnOrBuildVersionArn;
  }
  export interface GetComponentResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The component object associated with the specified ARN.
     */
    component?: Component;
  }
  export interface GetContainerRecipePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the container recipe for the policy being requested.
     */
    containerRecipeArn: ContainerRecipeArn;
  }
  export interface GetContainerRecipePolicyResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The container recipe policy object that is returned.
     */
    policy?: ResourcePolicyDocument;
  }
  export interface GetContainerRecipeRequest {
    /**
     * The Amazon Resource Name (ARN) of the container recipe to retrieve.
     */
    containerRecipeArn: ContainerRecipeArn;
  }
  export interface GetContainerRecipeResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The container recipe object that is returned.
     */
    containerRecipe?: ContainerRecipe;
  }
  export interface GetDistributionConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration that you want to retrieve.
     */
    distributionConfigurationArn: DistributionConfigurationArn;
  }
  export interface GetDistributionConfigurationResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The distribution configuration object.
     */
    distributionConfiguration?: DistributionConfiguration;
  }
  export interface GetImagePipelineRequest {
    /**
     * The Amazon Resource Name (ARN) of the image pipeline that you want to retrieve.
     */
    imagePipelineArn: ImagePipelineArn;
  }
  export interface GetImagePipelineResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The image pipeline object.
     */
    imagePipeline?: ImagePipeline;
  }
  export interface GetImagePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the image whose policy you want to retrieve.
     */
    imageArn: ImageBuildVersionArn;
  }
  export interface GetImagePolicyResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The image policy object.
     */
    policy?: ResourcePolicyDocument;
  }
  export interface GetImageRecipePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the image recipe whose policy you want to retrieve.
     */
    imageRecipeArn: ImageRecipeArn;
  }
  export interface GetImageRecipePolicyResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The image recipe policy object.
     */
    policy?: ResourcePolicyDocument;
  }
  export interface GetImageRecipeRequest {
    /**
     * The Amazon Resource Name (ARN) of the image recipe that you want to retrieve.
     */
    imageRecipeArn: ImageRecipeArn;
  }
  export interface GetImageRecipeResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The image recipe object.
     */
    imageRecipe?: ImageRecipe;
  }
  export interface GetImageRequest {
    /**
     * The Amazon Resource Name (ARN) of the image that you want to retrieve.
     */
    imageBuildVersionArn: ImageVersionArnOrBuildVersionArn;
  }
  export interface GetImageResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The image object.
     */
    image?: Image;
  }
  export interface GetInfrastructureConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration that you want to retrieve.
     */
    infrastructureConfigurationArn: InfrastructureConfigurationArn;
  }
  export interface GetInfrastructureConfigurationResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The infrastructure configuration object.
     */
    infrastructureConfiguration?: InfrastructureConfiguration;
  }
  export type HttpPutResponseHopLimit = number;
  export type HttpTokens = string;
  export interface Image {
    /**
     * The Amazon Resource Name (ARN) of the image.  Semantic versioning is included in each object's Amazon Resource Name (ARN), at the level that applies to that object as follows:   Versionless ARNs and Name ARNs do not include specific values in any of the nodes. The nodes are either left off entirely, or they are specified as wildcards, for example: x.x.x.   Version ARNs have only the first three nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;   Build version ARNs have all four nodes, and point to a specific build for a specific version of an object.   
     */
    arn?: ImageBuilderArn;
    /**
     * Specifies whether this is an AMI or container image.
     */
    type?: ImageType;
    /**
     * The name of the image.
     */
    name?: ResourceName;
    /**
     * The semantic version of the image.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Assignment: For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.  Patterns: You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01.  Filtering: With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards. 
     */
    version?: VersionNumber;
    /**
     * The platform of the image.
     */
    platform?: Platform;
    /**
     *  Collects additional information about the image being created, including the operating system (OS) version and package list. This information is used to enhance the overall experience of using EC2 Image Builder. Enabled by default.
     */
    enhancedImageMetadataEnabled?: NullableBoolean;
    /**
     * The operating system version of the instance. For example, Amazon Linux 2, Ubuntu 18, or Microsoft Windows Server 2019.
     */
    osVersion?: OsVersion;
    /**
     * The state of the image.
     */
    state?: ImageState;
    /**
     * The image recipe used when creating the image.
     */
    imageRecipe?: ImageRecipe;
    /**
     * The recipe that is used to create an Image Builder container image.
     */
    containerRecipe?: ContainerRecipe;
    /**
     * The name of the image pipeline that created this image.
     */
    sourcePipelineName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the image pipeline that created this image.
     */
    sourcePipelineArn?: Arn;
    /**
     * The infrastructure used when creating this image.
     */
    infrastructureConfiguration?: InfrastructureConfiguration;
    /**
     * The distribution configuration used when creating this image.
     */
    distributionConfiguration?: DistributionConfiguration;
    /**
     * The image tests configuration used when creating this image.
     */
    imageTestsConfiguration?: ImageTestsConfiguration;
    /**
     * The date on which this image was created.
     */
    dateCreated?: DateTime;
    /**
     * The output resources produced when creating this image.
     */
    outputResources?: OutputResources;
    /**
     * The tags of the image.
     */
    tags?: TagMap;
  }
  export type ImageBuildVersionArn = string;
  export type ImageBuilderArn = string;
  export interface ImagePackage {
    /**
     * The name of the package as reported to the operating system package manager.
     */
    packageName?: NonEmptyString;
    /**
     * The version of the package as reported to the operating system package manager.
     */
    packageVersion?: NonEmptyString;
  }
  export type ImagePackageList = ImagePackage[];
  export interface ImagePipeline {
    /**
     * The Amazon Resource Name (ARN) of the image pipeline.
     */
    arn?: ImageBuilderArn;
    /**
     * The name of the image pipeline.
     */
    name?: ResourceName;
    /**
     * The description of the image pipeline.
     */
    description?: NonEmptyString;
    /**
     * The platform of the image pipeline.
     */
    platform?: Platform;
    /**
     *  Collects additional information about the image being created, including the operating system (OS) version and package list. This information is used to enhance the overall experience of using EC2 Image Builder. Enabled by default.
     */
    enhancedImageMetadataEnabled?: NullableBoolean;
    /**
     * The Amazon Resource Name (ARN) of the image recipe associated with this image pipeline.
     */
    imageRecipeArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the container recipe that is used for this pipeline.
     */
    containerRecipeArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration associated with this image pipeline.
     */
    infrastructureConfigurationArn?: Arn;
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration associated with this image pipeline.
     */
    distributionConfigurationArn?: Arn;
    /**
     * The image tests configuration of the image pipeline.
     */
    imageTestsConfiguration?: ImageTestsConfiguration;
    /**
     * The schedule of the image pipeline.
     */
    schedule?: Schedule;
    /**
     * The status of the image pipeline.
     */
    status?: PipelineStatus;
    /**
     * The date on which this image pipeline was created.
     */
    dateCreated?: DateTime;
    /**
     * The date on which this image pipeline was last updated.
     */
    dateUpdated?: DateTime;
    /**
     * The date on which this image pipeline was last run.
     */
    dateLastRun?: DateTime;
    /**
     * The date on which this image pipeline will next be run.
     */
    dateNextRun?: DateTime;
    /**
     * The tags of this image pipeline.
     */
    tags?: TagMap;
  }
  export type ImagePipelineArn = string;
  export type ImagePipelineList = ImagePipeline[];
  export interface ImageRecipe {
    /**
     * The Amazon Resource Name (ARN) of the image recipe.
     */
    arn?: ImageBuilderArn;
    /**
     * Specifies which type of image is created by the recipe - an AMI or a container image.
     */
    type?: ImageType;
    /**
     * The name of the image recipe.
     */
    name?: ResourceName;
    /**
     * The description of the image recipe.
     */
    description?: NonEmptyString;
    /**
     * The platform of the image recipe.
     */
    platform?: Platform;
    /**
     * The owner of the image recipe.
     */
    owner?: NonEmptyString;
    /**
     * The version of the image recipe.
     */
    version?: VersionNumber;
    /**
     * The components of the image recipe.
     */
    components?: ComponentConfigurationList;
    /**
     * The base image of the image recipe.
     */
    parentImage?: NonEmptyString;
    /**
     * The block device mappings to apply when creating images from this recipe.
     */
    blockDeviceMappings?: InstanceBlockDeviceMappings;
    /**
     * The date on which this image recipe was created.
     */
    dateCreated?: DateTime;
    /**
     * The tags of the image recipe.
     */
    tags?: TagMap;
    /**
     * The working directory to be used during build and test workflows.
     */
    workingDirectory?: NonEmptyString;
    /**
     * Before you create a new AMI, Image Builder launches temporary Amazon EC2 instances to build and test your image configuration. Instance configuration adds a layer of control over those instances. You can define settings and add scripts to run when an instance is launched from your AMI.
     */
    additionalInstanceConfiguration?: AdditionalInstanceConfiguration;
  }
  export type ImageRecipeArn = string;
  export interface ImageRecipeSummary {
    /**
     * The Amazon Resource Name (ARN) of the image recipe.
     */
    arn?: ImageBuilderArn;
    /**
     * The name of the image recipe.
     */
    name?: ResourceName;
    /**
     * The platform of the image recipe.
     */
    platform?: Platform;
    /**
     * The owner of the image recipe.
     */
    owner?: NonEmptyString;
    /**
     * The base image of the image recipe.
     */
    parentImage?: NonEmptyString;
    /**
     * The date on which this image recipe was created.
     */
    dateCreated?: DateTime;
    /**
     * The tags of the image recipe.
     */
    tags?: TagMap;
  }
  export type ImageRecipeSummaryList = ImageRecipeSummary[];
  export interface ImageState {
    /**
     * The status of the image.
     */
    status?: ImageStatus;
    /**
     * The reason for the image's status.
     */
    reason?: NonEmptyString;
  }
  export type ImageStatus = "PENDING"|"CREATING"|"BUILDING"|"TESTING"|"DISTRIBUTING"|"INTEGRATING"|"AVAILABLE"|"CANCELLED"|"FAILED"|"DEPRECATED"|"DELETED"|string;
  export interface ImageSummary {
    /**
     * The Amazon Resource Name (ARN) of the image.
     */
    arn?: ImageBuilderArn;
    /**
     * The name of the image.
     */
    name?: ResourceName;
    /**
     * Specifies whether this is an AMI or container image.
     */
    type?: ImageType;
    /**
     * The version of the image.
     */
    version?: VersionNumber;
    /**
     * The platform of the image.
     */
    platform?: Platform;
    /**
     * The operating system version of the instance. For example, Amazon Linux 2, Ubuntu 18, or Microsoft Windows Server 2019.
     */
    osVersion?: OsVersion;
    /**
     * The state of the image.
     */
    state?: ImageState;
    /**
     * The owner of the image.
     */
    owner?: NonEmptyString;
    /**
     * The date on which this image was created.
     */
    dateCreated?: DateTime;
    /**
     * The output resources produced when creating this image.
     */
    outputResources?: OutputResources;
    /**
     * The tags of the image.
     */
    tags?: TagMap;
  }
  export type ImageSummaryList = ImageSummary[];
  export interface ImageTestsConfiguration {
    /**
     * Defines if tests should be executed when building this image.
     */
    imageTestsEnabled?: NullableBoolean;
    /**
     * The maximum time in minutes that tests are permitted to run.
     */
    timeoutMinutes?: ImageTestsTimeoutMinutes;
  }
  export type ImageTestsTimeoutMinutes = number;
  export type ImageType = "AMI"|"DOCKER"|string;
  export interface ImageVersion {
    /**
     * The Amazon Resource Name (ARN) of a specific version of an Image Builder image.  Semantic versioning is included in each object's Amazon Resource Name (ARN), at the level that applies to that object as follows:   Versionless ARNs and Name ARNs do not include specific values in any of the nodes. The nodes are either left off entirely, or they are specified as wildcards, for example: x.x.x.   Version ARNs have only the first three nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;   Build version ARNs have all four nodes, and point to a specific build for a specific version of an object.   
     */
    arn?: ImageBuilderArn;
    /**
     * The name of this specific version of an Image Builder image.
     */
    name?: ResourceName;
    /**
     * Specifies whether this image is an AMI or a container image.
     */
    type?: ImageType;
    /**
     * Details for a specific version of an Image Builder image. This version follows the semantic version syntax.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Assignment: For the first three nodes you can assign any positive integer value, including zero, with an upper limit of 2^30-1, or 1073741823 for each node. Image Builder automatically assigns the build number to the fourth node.  Patterns: You can use any numeric pattern that adheres to the assignment requirements for the nodes that you can assign. For example, you might choose a software version pattern, such as 1.0.0, or a date, such as 2021.01.01.  Filtering: With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards. 
     */
    version?: VersionNumber;
    /**
     * The platform of the image version, for example "Windows" or "Linux".
     */
    platform?: Platform;
    /**
     * The operating system version of the Amazon EC2 build instance. For example, Amazon Linux 2, Ubuntu 18, or Microsoft Windows Server 2019.
     */
    osVersion?: OsVersion;
    /**
     * The owner of the image version.
     */
    owner?: NonEmptyString;
    /**
     * The date on which this specific version of the Image Builder image was created.
     */
    dateCreated?: DateTime;
  }
  export type ImageVersionArn = string;
  export type ImageVersionArnOrBuildVersionArn = string;
  export type ImageVersionList = ImageVersion[];
  export interface ImportComponentRequest {
    /**
     *  The name of the component.
     */
    name: ResourceName;
    /**
     * The semantic version of the component. This version follows the semantic version syntax.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Filtering: With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards. 
     */
    semanticVersion: VersionNumber;
    /**
     * The description of the component. Describes the contents of the component.
     */
    description?: NonEmptyString;
    /**
     * The change description of the component. Describes what change has been made in this version, or what makes this version different from other versions of this component.
     */
    changeDescription?: NonEmptyString;
    /**
     * The type of the component denotes whether the component is used to build the image, or only to test it.
     */
    type: ComponentType;
    /**
     * The format of the resource that you want to import as a component.
     */
    format: ComponentFormat;
    /**
     * The platform of the component.
     */
    platform: Platform;
    /**
     * The data of the component. Used to specify the data inline. Either data or uri can be used to specify the data within the component.
     */
    data?: NonEmptyString;
    /**
     * The uri of the component. Must be an Amazon S3 URL and the requester must have permission to access the Amazon S3 bucket. If you use Amazon S3, you can specify component content up to your service quota. Either data or uri can be used to specify the data within the component.
     */
    uri?: Uri;
    /**
     * The ID of the KMS key that should be used to encrypt this component.
     */
    kmsKeyId?: NonEmptyString;
    /**
     * The tags of the component.
     */
    tags?: TagMap;
    /**
     * The idempotency token of the component.
     */
    clientToken: ClientToken;
  }
  export interface ImportComponentResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the imported component.
     */
    componentBuildVersionArn?: ComponentBuildVersionArn;
  }
  export interface InfrastructureConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration.
     */
    arn?: ImageBuilderArn;
    /**
     * The name of the infrastructure configuration.
     */
    name?: ResourceName;
    /**
     * The description of the infrastructure configuration.
     */
    description?: NonEmptyString;
    /**
     * The instance types of the infrastructure configuration.
     */
    instanceTypes?: InstanceTypeList;
    /**
     * The instance profile of the infrastructure configuration.
     */
    instanceProfileName?: InstanceProfileNameType;
    /**
     * The security group IDs of the infrastructure configuration.
     */
    securityGroupIds?: SecurityGroupIds;
    /**
     * The subnet ID of the infrastructure configuration.
     */
    subnetId?: NonEmptyString;
    /**
     * The logging configuration of the infrastructure configuration.
     */
    logging?: Logging;
    /**
     * The Amazon EC2 key pair of the infrastructure configuration.
     */
    keyPair?: NonEmptyString;
    /**
     * The terminate instance on failure configuration of the infrastructure configuration.
     */
    terminateInstanceOnFailure?: NullableBoolean;
    /**
     * The SNS topic Amazon Resource Name (ARN) of the infrastructure configuration.
     */
    snsTopicArn?: NonEmptyString;
    /**
     * The date on which the infrastructure configuration was created.
     */
    dateCreated?: DateTime;
    /**
     * The date on which the infrastructure configuration was last updated.
     */
    dateUpdated?: DateTime;
    /**
     * The tags attached to the resource created by Image Builder.
     */
    resourceTags?: ResourceTagMap;
    /**
     * The instance metadata option settings for the infrastructure configuration.
     */
    instanceMetadataOptions?: InstanceMetadataOptions;
    /**
     * The tags of the infrastructure configuration.
     */
    tags?: TagMap;
  }
  export type InfrastructureConfigurationArn = string;
  export interface InfrastructureConfigurationSummary {
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration.
     */
    arn?: ImageBuilderArn;
    /**
     * The name of the infrastructure configuration.
     */
    name?: ResourceName;
    /**
     * The description of the infrastructure configuration.
     */
    description?: NonEmptyString;
    /**
     * The date on which the infrastructure configuration was created.
     */
    dateCreated?: DateTime;
    /**
     * The date on which the infrastructure configuration was last updated.
     */
    dateUpdated?: DateTime;
    /**
     * The tags attached to the image created by Image Builder.
     */
    resourceTags?: ResourceTagMap;
    /**
     * The tags of the infrastructure configuration.
     */
    tags?: TagMap;
    /**
     * The instance types of the infrastructure configuration.
     */
    instanceTypes?: InstanceTypeList;
    /**
     * The instance profile of the infrastructure configuration.
     */
    instanceProfileName?: InstanceProfileNameType;
  }
  export type InfrastructureConfigurationSummaryList = InfrastructureConfigurationSummary[];
  export type InlineComponentData = string;
  export type InlineDockerFileTemplate = string;
  export interface InstanceBlockDeviceMapping {
    /**
     * The device to which these mappings apply.
     */
    deviceName?: NonEmptyString;
    /**
     * Use to manage Amazon EBS-specific configuration for this mapping.
     */
    ebs?: EbsInstanceBlockDeviceSpecification;
    /**
     * Use to manage instance ephemeral devices.
     */
    virtualName?: NonEmptyString;
    /**
     * Use to remove a mapping from the base image.
     */
    noDevice?: EmptyString;
  }
  export type InstanceBlockDeviceMappings = InstanceBlockDeviceMapping[];
  export interface InstanceConfiguration {
    /**
     * The AMI ID to use as the base image for a container build and test instance. If not specified, Image Builder will use the appropriate ECS-optimized AMI as a base image.
     */
    image?: NonEmptyString;
    /**
     * Defines the block devices to attach for building an instance from this Image Builder AMI.
     */
    blockDeviceMappings?: InstanceBlockDeviceMappings;
  }
  export interface InstanceMetadataOptions {
    /**
     * Indicates whether a signed token header is required for instance metadata retrieval requests. The values affect the response as follows:    required – When you retrieve the IAM role credentials, version 2.0 credentials are returned in all cases.    optional – You can include a signed token header in your request to retrieve instance metadata, or you can leave it out. If you include it, version 2.0 credentials are returned for the IAM role. Otherwise, version 1.0 credentials are returned.   The default setting is optional.
     */
    httpTokens?: HttpTokens;
    /**
     * Limit the number of hops that an instance metadata request can traverse to reach its destination.
     */
    httpPutResponseHopLimit?: HttpPutResponseHopLimit;
  }
  export type InstanceProfileNameType = string;
  export type InstanceType = string;
  export type InstanceTypeList = InstanceType[];
  export interface LaunchPermissionConfiguration {
    /**
     * The Amazon Web Services account ID.
     */
    userIds?: AccountList;
    /**
     * The name of the group.
     */
    userGroups?: StringList;
  }
  export interface LaunchTemplateConfiguration {
    /**
     * Identifies the Amazon EC2 launch template to use.
     */
    launchTemplateId: LaunchTemplateId;
    /**
     * The account ID that this configuration applies to.
     */
    accountId?: AccountId;
    /**
     * Set the specified Amazon EC2 launch template as the default launch template for the specified account.
     */
    setDefaultVersion?: Boolean;
  }
  export type LaunchTemplateConfigurationList = LaunchTemplateConfiguration[];
  export type LaunchTemplateId = string;
  export type LicenseConfigurationArn = string;
  export type LicenseConfigurationArnList = LicenseConfigurationArn[];
  export interface ListComponentBuildVersionsRequest {
    /**
     * The component version Amazon Resource Name (ARN) whose versions you want to list.
     */
    componentVersionArn: ComponentVersionArn;
    /**
     * The maximum items to return in a request.
     */
    maxResults?: RestrictedInteger;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
  }
  export interface ListComponentBuildVersionsResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of component summaries for the specified semantic version.
     */
    componentSummaryList?: ComponentSummaryList;
    /**
     * The next token used for paginated responses. When this is not empty, there are additional elements that the service has not included in this request. Use this token with the next request to retrieve additional objects.
     */
    nextToken?: PaginationToken;
  }
  export interface ListComponentsRequest {
    /**
     * The owner defines which components you want to list. By default, this request will only show components owned by your account. You can use this field to specify if you want to view components owned by yourself, by Amazon, or those components that have been shared with you by other customers.
     */
    owner?: Ownership;
    /**
     * Use the following filters to streamline results:    description     name     platform     supportedOsVersion     type     version   
     */
    filters?: FilterList;
    /**
     * Returns the list of component build versions for the specified name.
     */
    byName?: Boolean;
    /**
     * The maximum items to return in a request.
     */
    maxResults?: RestrictedInteger;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
  }
  export interface ListComponentsResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of component semantic versions.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them. 
     */
    componentVersionList?: ComponentVersionList;
    /**
     * The next token used for paginated responses. When this is not empty, there are additional elements that the service has not included in this request. Use this token with the next request to retrieve additional objects.
     */
    nextToken?: PaginationToken;
  }
  export interface ListContainerRecipesRequest {
    /**
     * Returns container recipes belonging to the specified owner, that have been shared with you. You can omit this field to return container recipes belonging to your account.
     */
    owner?: Ownership;
    /**
     * Use the following filters to streamline results:    containerType     name     parentImage     platform   
     */
    filters?: FilterList;
    /**
     * The maximum number of results to return in the list.
     */
    maxResults?: RestrictedInteger;
    /**
     * Provides a token for pagination, which determines where to begin the next set of results when the current set reaches the maximum for one request.
     */
    nextToken?: NonEmptyString;
  }
  export interface ListContainerRecipesResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of container recipes returned for the request.
     */
    containerRecipeSummaryList?: ContainerRecipeSummaryList;
    /**
     * The next token field is used for paginated responses. When this is not empty, there are additional container recipes that the service has not included in this response. Use this token with the next request to retrieve additional list items.
     */
    nextToken?: NonEmptyString;
  }
  export interface ListDistributionConfigurationsRequest {
    /**
     * You can filter on name to streamline results.
     */
    filters?: FilterList;
    /**
     * The maximum items to return in a request.
     */
    maxResults?: RestrictedInteger;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
  }
  export interface ListDistributionConfigurationsResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of distributions.
     */
    distributionConfigurationSummaryList?: DistributionConfigurationSummaryList;
    /**
     * The next token used for paginated responses. When this is not empty, there are additional elements that the service has not included in this request. Use this token with the next request to retrieve additional objects.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImageBuildVersionsRequest {
    /**
     * The Amazon Resource Name (ARN) of the image whose build versions you want to retrieve.
     */
    imageVersionArn: ImageVersionArn;
    /**
     * Use the following filters to streamline results:    name     osVersion     platform     type     version   
     */
    filters?: FilterList;
    /**
     * The maximum items to return in a request.
     */
    maxResults?: RestrictedInteger;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImageBuildVersionsResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of image build versions.
     */
    imageSummaryList?: ImageSummaryList;
    /**
     * The next token used for paginated responses. When this is not empty, there are additional elements that the service has not included in this request. Use this token with the next request to retrieve additional objects.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImagePackagesRequest {
    /**
     * Filter results for the ListImagePackages request by the Image Build Version ARN
     */
    imageBuildVersionArn: ImageBuildVersionArn;
    /**
     * The maxiumum number of results to return from the ListImagePackages request.
     */
    maxResults?: RestrictedInteger;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImagePackagesResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of Image Packages returned in the response.
     */
    imagePackageList?: ImagePackageList;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImagePipelineImagesRequest {
    /**
     * The Amazon Resource Name (ARN) of the image pipeline whose images you want to view.
     */
    imagePipelineArn: ImagePipelineArn;
    /**
     * Use the following filters to streamline results:    name     version   
     */
    filters?: FilterList;
    /**
     * The maximum items to return in a request.
     */
    maxResults?: RestrictedInteger;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImagePipelineImagesResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of images built by this pipeline.
     */
    imageSummaryList?: ImageSummaryList;
    /**
     * The next token used for paginated responses. When this is not empty, there are additional elements that the service has not included in this request. Use this token with the next request to retrieve additional objects.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImagePipelinesRequest {
    /**
     * Use the following filters to streamline results:    description     distributionConfigurationArn     imageRecipeArn     infrastructureConfigurationArn     name     status   
     */
    filters?: FilterList;
    /**
     * The maximum items to return in a request.
     */
    maxResults?: RestrictedInteger;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImagePipelinesResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of image pipelines.
     */
    imagePipelineList?: ImagePipelineList;
    /**
     * The next token used for paginated responses. When this is not empty, there are additional elements that the service has not included in this request. Use this token with the next request to retrieve additional objects.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImageRecipesRequest {
    /**
     * The owner defines which image recipes you want to list. By default, this request will only show image recipes owned by your account. You can use this field to specify if you want to view image recipes owned by yourself, by Amazon, or those image recipes that have been shared with you by other customers.
     */
    owner?: Ownership;
    /**
     * Use the following filters to streamline results:    name     parentImage     platform   
     */
    filters?: FilterList;
    /**
     * The maximum items to return in a request.
     */
    maxResults?: RestrictedInteger;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImageRecipesResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of image pipelines.
     */
    imageRecipeSummaryList?: ImageRecipeSummaryList;
    /**
     * The next token used for paginated responses. When this is not empty, there are additional elements that the service has not included in this request. Use this token with the next request to retrieve additional objects.
     */
    nextToken?: PaginationToken;
  }
  export interface ListImagesRequest {
    /**
     * The owner defines which images you want to list. By default, this request will only show images owned by your account. You can use this field to specify if you want to view images owned by yourself, by Amazon, or those images that have been shared with you by other customers.
     */
    owner?: Ownership;
    /**
     * Use the following filters to streamline results:    name     osVersion     platform     type     version   
     */
    filters?: FilterList;
    /**
     * Requests a list of images with a specific recipe name.
     */
    byName?: Boolean;
    /**
     * The maximum items to return in a request.
     */
    maxResults?: RestrictedInteger;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
    /**
     * Includes deprecated images in the response list.
     */
    includeDeprecated?: NullableBoolean;
  }
  export interface ListImagesResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of image semantic versions.  The semantic version has four nodes: &lt;major&gt;.&lt;minor&gt;.&lt;patch&gt;/&lt;build&gt;. You can assign values for the first three, and can filter on all of them.  Filtering: With semantic versioning, you have the flexibility to use wildcards (x) to specify the most recent versions or nodes when selecting the base image or components for your recipe. When you use a wildcard in any node, all nodes to the right of the first wildcard must also be wildcards. 
     */
    imageVersionList?: ImageVersionList;
    /**
     * The next token used for paginated responses. When this is not empty, there are additional elements that the service has not included in this request. Use this token with the next request to retrieve additional objects.
     */
    nextToken?: PaginationToken;
  }
  export interface ListInfrastructureConfigurationsRequest {
    /**
     * You can filter on name to streamline results.
     */
    filters?: FilterList;
    /**
     * The maximum items to return in a request.
     */
    maxResults?: RestrictedInteger;
    /**
     * A token to specify where to start paginating. This is the NextToken from a previously truncated response.
     */
    nextToken?: PaginationToken;
  }
  export interface ListInfrastructureConfigurationsResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The list of infrastructure configurations.
     */
    infrastructureConfigurationSummaryList?: InfrastructureConfigurationSummaryList;
    /**
     * The next token used for paginated responses. When this is not empty, there are additional elements that the service has not included in this request. Use this token with the next request to retrieve additional objects.
     */
    nextToken?: PaginationToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource whose tags you want to retrieve.
     */
    resourceArn: ImageBuilderArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags for the specified resource.
     */
    tags?: TagMap;
  }
  export interface Logging {
    /**
     * The Amazon S3 logging configuration.
     */
    s3Logs?: S3Logs;
  }
  export type NonEmptyString = string;
  export type NullableBoolean = boolean;
  export type OsVersion = string;
  export type OsVersionList = OsVersion[];
  export interface OutputResources {
    /**
     * The Amazon EC2 AMIs created by this image.
     */
    amis?: AmiList;
    /**
     * Container images that the pipeline has generated and stored in the output repository.
     */
    containers?: ContainerList;
  }
  export type Ownership = "Self"|"Shared"|"Amazon"|string;
  export type PaginationToken = string;
  export type PipelineExecutionStartCondition = "EXPRESSION_MATCH_ONLY"|"EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE"|string;
  export type PipelineStatus = "DISABLED"|"ENABLED"|string;
  export type Platform = "Windows"|"Linux"|string;
  export interface PutComponentPolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the component that this policy should be applied to.
     */
    componentArn: ComponentBuildVersionArn;
    /**
     * The policy to apply.
     */
    policy: ResourcePolicyDocument;
  }
  export interface PutComponentPolicyResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the component that this policy was applied to.
     */
    componentArn?: ComponentBuildVersionArn;
  }
  export interface PutContainerRecipePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the container recipe that this policy should be applied to.
     */
    containerRecipeArn: ContainerRecipeArn;
    /**
     * The policy to apply to the container recipe.
     */
    policy: ResourcePolicyDocument;
  }
  export interface PutContainerRecipePolicyResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the container recipe that this policy was applied to.
     */
    containerRecipeArn?: ContainerRecipeArn;
  }
  export interface PutImagePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the image that this policy should be applied to.
     */
    imageArn: ImageBuildVersionArn;
    /**
     * The policy to apply.
     */
    policy: ResourcePolicyDocument;
  }
  export interface PutImagePolicyResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the image that this policy was applied to.
     */
    imageArn?: ImageBuildVersionArn;
  }
  export interface PutImageRecipePolicyRequest {
    /**
     * The Amazon Resource Name (ARN) of the image recipe that this policy should be applied to.
     */
    imageRecipeArn: ImageRecipeArn;
    /**
     * The policy to apply.
     */
    policy: ResourcePolicyDocument;
  }
  export interface PutImageRecipePolicyResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the image recipe that this policy was applied to.
     */
    imageRecipeArn?: ImageRecipeArn;
  }
  export type RegionList = NonEmptyString[];
  export type ResourceName = string;
  export type ResourcePolicyDocument = string;
  export type ResourceTagMap = {[key: string]: TagValue};
  export type RestrictedInteger = number;
  export interface S3Logs {
    /**
     * The Amazon S3 bucket in which to store the logs.
     */
    s3BucketName?: NonEmptyString;
    /**
     * The Amazon S3 path in which to store the logs.
     */
    s3KeyPrefix?: NonEmptyString;
  }
  export interface Schedule {
    /**
     * The cron expression determines how often EC2 Image Builder evaluates your pipelineExecutionStartCondition. For information on how to format a cron expression in Image Builder, see Use cron expressions in EC2 Image Builder.
     */
    scheduleExpression?: NonEmptyString;
    /**
     * The timezone that applies to the scheduling expression. For example, "Etc/UTC", "America/Los_Angeles" in the IANA timezone format. If not specified this defaults to UTC.
     */
    timezone?: Timezone;
    /**
     * The condition configures when the pipeline should trigger a new image build. When the pipelineExecutionStartCondition is set to EXPRESSION_MATCH_AND_DEPENDENCY_UPDATES_AVAILABLE, and you use semantic version filters on the base image or components in your image recipe, EC2 Image Builder will build a new image only when there are new versions of the image or components in your recipe that match the semantic version filter. When it is set to EXPRESSION_MATCH_ONLY, it will build a new image every time the CRON expression matches the current time. For semantic version syntax, see CreateComponent in the  EC2 Image Builder API Reference.
     */
    pipelineExecutionStartCondition?: PipelineExecutionStartCondition;
  }
  export type SecurityGroupIds = NonEmptyString[];
  export type SnsTopicArn = string;
  export interface StartImagePipelineExecutionRequest {
    /**
     * The Amazon Resource Name (ARN) of the image pipeline that you want to manually invoke.
     */
    imagePipelineArn: ImagePipelineArn;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken: ClientToken;
  }
  export interface StartImagePipelineExecutionResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the image that was created by this request.
     */
    imageBuildVersionArn?: ImageBuildVersionArn;
  }
  export type StringList = NonEmptyString[];
  export interface SystemsManagerAgent {
    /**
     * Controls whether the Systems Manager agent is removed from your final build image, prior to creating the new AMI. If this is set to true, then the agent is removed from the final image. If it's set to false, then the agent is left in, so that it is included in the new AMI. The default value is false.
     */
    uninstallAfterBuild?: NullableBoolean;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagMap = {[key: string]: TagValue};
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to tag.
     */
    resourceArn: ImageBuilderArn;
    /**
     * The tags to apply to the resource.
     */
    tags: TagMap;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export interface TargetContainerRepository {
    /**
     * Specifies the service in which this image was registered.
     */
    service: ContainerRepositoryService;
    /**
     * The name of the container repository where the output container image is stored. This name is prefixed by the repository location.
     */
    repositoryName: NonEmptyString;
  }
  export type Timezone = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to untag.
     */
    resourceArn: ImageBuilderArn;
    /**
     * The tag keys to remove from the resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateDistributionConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration that you want to update.
     */
    distributionConfigurationArn: DistributionConfigurationArn;
    /**
     * The description of the distribution configuration.
     */
    description?: NonEmptyString;
    /**
     * The distributions of the distribution configuration.
     */
    distributions: DistributionList;
    /**
     * The idempotency token of the distribution configuration.
     */
    clientToken: ClientToken;
  }
  export interface UpdateDistributionConfigurationResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration that was updated by this request.
     */
    distributionConfigurationArn?: DistributionConfigurationArn;
  }
  export interface UpdateImagePipelineRequest {
    /**
     * The Amazon Resource Name (ARN) of the image pipeline that you want to update.
     */
    imagePipelineArn: ImagePipelineArn;
    /**
     * The description of the image pipeline.
     */
    description?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the image recipe that will be used to configure images updated by this image pipeline.
     */
    imageRecipeArn?: ImageRecipeArn;
    /**
     * The Amazon Resource Name (ARN) of the container pipeline to update.
     */
    containerRecipeArn?: ContainerRecipeArn;
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration that will be used to build images updated by this image pipeline.
     */
    infrastructureConfigurationArn: InfrastructureConfigurationArn;
    /**
     * The Amazon Resource Name (ARN) of the distribution configuration that will be used to configure and distribute images updated by this image pipeline.
     */
    distributionConfigurationArn?: DistributionConfigurationArn;
    /**
     * The image test configuration of the image pipeline.
     */
    imageTestsConfiguration?: ImageTestsConfiguration;
    /**
     *  Collects additional information about the image being created, including the operating system (OS) version and package list. This information is used to enhance the overall experience of using EC2 Image Builder. Enabled by default.
     */
    enhancedImageMetadataEnabled?: NullableBoolean;
    /**
     * The schedule of the image pipeline.
     */
    schedule?: Schedule;
    /**
     * The status of the image pipeline.
     */
    status?: PipelineStatus;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken: ClientToken;
  }
  export interface UpdateImagePipelineResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the image pipeline that was updated by this request.
     */
    imagePipelineArn?: ImagePipelineArn;
  }
  export interface UpdateInfrastructureConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration that you want to update.
     */
    infrastructureConfigurationArn: InfrastructureConfigurationArn;
    /**
     * The description of the infrastructure configuration.
     */
    description?: NonEmptyString;
    /**
     * The instance types of the infrastructure configuration. You can specify one or more instance types to use for this build. The service will pick one of these instance types based on availability.
     */
    instanceTypes?: InstanceTypeList;
    /**
     * The instance profile to associate with the instance used to customize your Amazon EC2 AMI.
     */
    instanceProfileName: InstanceProfileNameType;
    /**
     * The security group IDs to associate with the instance used to customize your Amazon EC2 AMI.
     */
    securityGroupIds?: SecurityGroupIds;
    /**
     * The subnet ID to place the instance used to customize your Amazon EC2 AMI in.
     */
    subnetId?: NonEmptyString;
    /**
     * The logging configuration of the infrastructure configuration.
     */
    logging?: Logging;
    /**
     * The key pair of the infrastructure configuration. You can use this to log on to and debug the instance used to create your image.
     */
    keyPair?: NonEmptyString;
    /**
     * The terminate instance on failure setting of the infrastructure configuration. Set to false if you want Image Builder to retain the instance used to configure your AMI if the build or test phase of your workflow fails.
     */
    terminateInstanceOnFailure?: NullableBoolean;
    /**
     * The SNS topic on which to send image build events.
     */
    snsTopicArn?: SnsTopicArn;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken: ClientToken;
    /**
     * The tags attached to the resource created by Image Builder.
     */
    resourceTags?: ResourceTagMap;
    /**
     * The instance metadata options that you can set for the HTTP requests that pipeline builds use to launch EC2 build and test instances. For more information about instance metadata options, see one of the following links:    Configure the instance metadata options in the  Amazon EC2 User Guide  for Linux instances.    Configure the instance metadata options in the  Amazon EC2 Windows Guide  for Windows instances.  
     */
    instanceMetadataOptions?: InstanceMetadataOptions;
  }
  export interface UpdateInfrastructureConfigurationResponse {
    /**
     * The request ID that uniquely identifies this request.
     */
    requestId?: NonEmptyString;
    /**
     * The idempotency token used to make this request idempotent.
     */
    clientToken?: ClientToken;
    /**
     * The Amazon Resource Name (ARN) of the infrastructure configuration that was updated by this request.
     */
    infrastructureConfigurationArn?: InfrastructureConfigurationArn;
  }
  export type Uri = string;
  export type UserDataOverride = string;
  export type VersionNumber = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-12-02"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Imagebuilder client.
   */
  export import Types = Imagebuilder;
}
export = Imagebuilder;
