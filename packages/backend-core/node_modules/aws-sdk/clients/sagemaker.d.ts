import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {WaiterConfiguration} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class SageMaker extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: SageMaker.Types.ClientConfiguration)
  config: Config & SageMaker.Types.ClientConfiguration;
  /**
   * Creates an association between the source and the destination. A source can be associated with multiple destinations, and a destination can be associated with multiple sources. An association is a lineage tracking entity. For more information, see Amazon SageMaker ML Lineage Tracking.
   */
  addAssociation(params: SageMaker.Types.AddAssociationRequest, callback?: (err: AWSError, data: SageMaker.Types.AddAssociationResponse) => void): Request<SageMaker.Types.AddAssociationResponse, AWSError>;
  /**
   * Creates an association between the source and the destination. A source can be associated with multiple destinations, and a destination can be associated with multiple sources. An association is a lineage tracking entity. For more information, see Amazon SageMaker ML Lineage Tracking.
   */
  addAssociation(callback?: (err: AWSError, data: SageMaker.Types.AddAssociationResponse) => void): Request<SageMaker.Types.AddAssociationResponse, AWSError>;
  /**
   * Adds or overwrites one or more tags for the specified Amazon SageMaker resource. You can add tags to notebook instances, training jobs, hyperparameter tuning jobs, batch transform jobs, models, labeling jobs, work teams, endpoint configurations, and endpoints. Each tag consists of a key and an optional value. Tag keys must be unique per resource. For more information about tags, see For more information, see Amazon Web Services Tagging Strategies.  Tags that you add to a hyperparameter tuning job by calling this API are also added to any training jobs that the hyperparameter tuning job launches after you call this API, but not to training jobs that the hyperparameter tuning job launched before you called this API. To make sure that the tags associated with a hyperparameter tuning job are also added to all training jobs that the hyperparameter tuning job launches, add the tags when you first create the tuning job by specifying them in the Tags parameter of CreateHyperParameterTuningJob    Tags that you add to a SageMaker Studio Domain or User Profile by calling this API are also added to any Apps that the Domain or User Profile launches after you call this API, but not to Apps that the Domain or User Profile launched before you called this API. To make sure that the tags associated with a Domain or User Profile are also added to all Apps that the Domain or User Profile launches, add the tags when you first create the Domain or User Profile by specifying them in the Tags parameter of CreateDomain or CreateUserProfile. 
   */
  addTags(params: SageMaker.Types.AddTagsInput, callback?: (err: AWSError, data: SageMaker.Types.AddTagsOutput) => void): Request<SageMaker.Types.AddTagsOutput, AWSError>;
  /**
   * Adds or overwrites one or more tags for the specified Amazon SageMaker resource. You can add tags to notebook instances, training jobs, hyperparameter tuning jobs, batch transform jobs, models, labeling jobs, work teams, endpoint configurations, and endpoints. Each tag consists of a key and an optional value. Tag keys must be unique per resource. For more information about tags, see For more information, see Amazon Web Services Tagging Strategies.  Tags that you add to a hyperparameter tuning job by calling this API are also added to any training jobs that the hyperparameter tuning job launches after you call this API, but not to training jobs that the hyperparameter tuning job launched before you called this API. To make sure that the tags associated with a hyperparameter tuning job are also added to all training jobs that the hyperparameter tuning job launches, add the tags when you first create the tuning job by specifying them in the Tags parameter of CreateHyperParameterTuningJob    Tags that you add to a SageMaker Studio Domain or User Profile by calling this API are also added to any Apps that the Domain or User Profile launches after you call this API, but not to Apps that the Domain or User Profile launched before you called this API. To make sure that the tags associated with a Domain or User Profile are also added to all Apps that the Domain or User Profile launches, add the tags when you first create the Domain or User Profile by specifying them in the Tags parameter of CreateDomain or CreateUserProfile. 
   */
  addTags(callback?: (err: AWSError, data: SageMaker.Types.AddTagsOutput) => void): Request<SageMaker.Types.AddTagsOutput, AWSError>;
  /**
   * Associates a trial component with a trial. A trial component can be associated with multiple trials. To disassociate a trial component from a trial, call the DisassociateTrialComponent API.
   */
  associateTrialComponent(params: SageMaker.Types.AssociateTrialComponentRequest, callback?: (err: AWSError, data: SageMaker.Types.AssociateTrialComponentResponse) => void): Request<SageMaker.Types.AssociateTrialComponentResponse, AWSError>;
  /**
   * Associates a trial component with a trial. A trial component can be associated with multiple trials. To disassociate a trial component from a trial, call the DisassociateTrialComponent API.
   */
  associateTrialComponent(callback?: (err: AWSError, data: SageMaker.Types.AssociateTrialComponentResponse) => void): Request<SageMaker.Types.AssociateTrialComponentResponse, AWSError>;
  /**
   * This action batch describes a list of versioned model packages
   */
  batchDescribeModelPackage(params: SageMaker.Types.BatchDescribeModelPackageInput, callback?: (err: AWSError, data: SageMaker.Types.BatchDescribeModelPackageOutput) => void): Request<SageMaker.Types.BatchDescribeModelPackageOutput, AWSError>;
  /**
   * This action batch describes a list of versioned model packages
   */
  batchDescribeModelPackage(callback?: (err: AWSError, data: SageMaker.Types.BatchDescribeModelPackageOutput) => void): Request<SageMaker.Types.BatchDescribeModelPackageOutput, AWSError>;
  /**
   * Creates an action. An action is a lineage tracking entity that represents an action or activity. For example, a model deployment or an HPO job. Generally, an action involves at least one input or output artifact. For more information, see Amazon SageMaker ML Lineage Tracking.
   */
  createAction(params: SageMaker.Types.CreateActionRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateActionResponse) => void): Request<SageMaker.Types.CreateActionResponse, AWSError>;
  /**
   * Creates an action. An action is a lineage tracking entity that represents an action or activity. For example, a model deployment or an HPO job. Generally, an action involves at least one input or output artifact. For more information, see Amazon SageMaker ML Lineage Tracking.
   */
  createAction(callback?: (err: AWSError, data: SageMaker.Types.CreateActionResponse) => void): Request<SageMaker.Types.CreateActionResponse, AWSError>;
  /**
   * Create a machine learning algorithm that you can use in Amazon SageMaker and list in the Amazon Web Services Marketplace.
   */
  createAlgorithm(params: SageMaker.Types.CreateAlgorithmInput, callback?: (err: AWSError, data: SageMaker.Types.CreateAlgorithmOutput) => void): Request<SageMaker.Types.CreateAlgorithmOutput, AWSError>;
  /**
   * Create a machine learning algorithm that you can use in Amazon SageMaker and list in the Amazon Web Services Marketplace.
   */
  createAlgorithm(callback?: (err: AWSError, data: SageMaker.Types.CreateAlgorithmOutput) => void): Request<SageMaker.Types.CreateAlgorithmOutput, AWSError>;
  /**
   * Creates a running app for the specified UserProfile. Supported apps are JupyterServer and KernelGateway. This operation is automatically invoked by Amazon SageMaker Studio upon access to the associated Domain, and when new kernel configurations are selected by the user. A user may have multiple Apps active simultaneously.
   */
  createApp(params: SageMaker.Types.CreateAppRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateAppResponse) => void): Request<SageMaker.Types.CreateAppResponse, AWSError>;
  /**
   * Creates a running app for the specified UserProfile. Supported apps are JupyterServer and KernelGateway. This operation is automatically invoked by Amazon SageMaker Studio upon access to the associated Domain, and when new kernel configurations are selected by the user. A user may have multiple Apps active simultaneously.
   */
  createApp(callback?: (err: AWSError, data: SageMaker.Types.CreateAppResponse) => void): Request<SageMaker.Types.CreateAppResponse, AWSError>;
  /**
   * Creates a configuration for running a SageMaker image as a KernelGateway app. The configuration specifies the Amazon Elastic File System (EFS) storage volume on the image, and a list of the kernels in the image.
   */
  createAppImageConfig(params: SageMaker.Types.CreateAppImageConfigRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateAppImageConfigResponse) => void): Request<SageMaker.Types.CreateAppImageConfigResponse, AWSError>;
  /**
   * Creates a configuration for running a SageMaker image as a KernelGateway app. The configuration specifies the Amazon Elastic File System (EFS) storage volume on the image, and a list of the kernels in the image.
   */
  createAppImageConfig(callback?: (err: AWSError, data: SageMaker.Types.CreateAppImageConfigResponse) => void): Request<SageMaker.Types.CreateAppImageConfigResponse, AWSError>;
  /**
   * Creates an artifact. An artifact is a lineage tracking entity that represents a URI addressable object or data. Some examples are the S3 URI of a dataset and the ECR registry path of an image. For more information, see Amazon SageMaker ML Lineage Tracking.
   */
  createArtifact(params: SageMaker.Types.CreateArtifactRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateArtifactResponse) => void): Request<SageMaker.Types.CreateArtifactResponse, AWSError>;
  /**
   * Creates an artifact. An artifact is a lineage tracking entity that represents a URI addressable object or data. Some examples are the S3 URI of a dataset and the ECR registry path of an image. For more information, see Amazon SageMaker ML Lineage Tracking.
   */
  createArtifact(callback?: (err: AWSError, data: SageMaker.Types.CreateArtifactResponse) => void): Request<SageMaker.Types.CreateArtifactResponse, AWSError>;
  /**
   * Creates an Autopilot job. Find the best-performing model after you run an Autopilot job by calling . For information about how to use Autopilot, see Automate Model Development with Amazon SageMaker Autopilot.
   */
  createAutoMLJob(params: SageMaker.Types.CreateAutoMLJobRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateAutoMLJobResponse) => void): Request<SageMaker.Types.CreateAutoMLJobResponse, AWSError>;
  /**
   * Creates an Autopilot job. Find the best-performing model after you run an Autopilot job by calling . For information about how to use Autopilot, see Automate Model Development with Amazon SageMaker Autopilot.
   */
  createAutoMLJob(callback?: (err: AWSError, data: SageMaker.Types.CreateAutoMLJobResponse) => void): Request<SageMaker.Types.CreateAutoMLJobResponse, AWSError>;
  /**
   * Creates a Git repository as a resource in your Amazon SageMaker account. You can associate the repository with notebook instances so that you can use Git source control for the notebooks you create. The Git repository is a resource in your Amazon SageMaker account, so it can be associated with more than one notebook instance, and it persists independently from the lifecycle of any notebook instances it is associated with. The repository can be hosted either in Amazon Web Services CodeCommit or in any other Git repository.
   */
  createCodeRepository(params: SageMaker.Types.CreateCodeRepositoryInput, callback?: (err: AWSError, data: SageMaker.Types.CreateCodeRepositoryOutput) => void): Request<SageMaker.Types.CreateCodeRepositoryOutput, AWSError>;
  /**
   * Creates a Git repository as a resource in your Amazon SageMaker account. You can associate the repository with notebook instances so that you can use Git source control for the notebooks you create. The Git repository is a resource in your Amazon SageMaker account, so it can be associated with more than one notebook instance, and it persists independently from the lifecycle of any notebook instances it is associated with. The repository can be hosted either in Amazon Web Services CodeCommit or in any other Git repository.
   */
  createCodeRepository(callback?: (err: AWSError, data: SageMaker.Types.CreateCodeRepositoryOutput) => void): Request<SageMaker.Types.CreateCodeRepositoryOutput, AWSError>;
  /**
   * Starts a model compilation job. After the model has been compiled, Amazon SageMaker saves the resulting model artifacts to an Amazon Simple Storage Service (Amazon S3) bucket that you specify.  If you choose to host your model using Amazon SageMaker hosting services, you can use the resulting model artifacts as part of the model. You can also use the artifacts with Amazon Web Services IoT Greengrass. In that case, deploy them as an ML resource. In the request body, you provide the following:   A name for the compilation job    Information about the input model artifacts    The output location for the compiled model and the device (target) that the model runs on    The Amazon Resource Name (ARN) of the IAM role that Amazon SageMaker assumes to perform the model compilation job.    You can also provide a Tag to track the model compilation job's resource use and costs. The response body contains the CompilationJobArn for the compiled job. To stop a model compilation job, use StopCompilationJob. To get information about a particular model compilation job, use DescribeCompilationJob. To get information about multiple model compilation jobs, use ListCompilationJobs.
   */
  createCompilationJob(params: SageMaker.Types.CreateCompilationJobRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateCompilationJobResponse) => void): Request<SageMaker.Types.CreateCompilationJobResponse, AWSError>;
  /**
   * Starts a model compilation job. After the model has been compiled, Amazon SageMaker saves the resulting model artifacts to an Amazon Simple Storage Service (Amazon S3) bucket that you specify.  If you choose to host your model using Amazon SageMaker hosting services, you can use the resulting model artifacts as part of the model. You can also use the artifacts with Amazon Web Services IoT Greengrass. In that case, deploy them as an ML resource. In the request body, you provide the following:   A name for the compilation job    Information about the input model artifacts    The output location for the compiled model and the device (target) that the model runs on    The Amazon Resource Name (ARN) of the IAM role that Amazon SageMaker assumes to perform the model compilation job.    You can also provide a Tag to track the model compilation job's resource use and costs. The response body contains the CompilationJobArn for the compiled job. To stop a model compilation job, use StopCompilationJob. To get information about a particular model compilation job, use DescribeCompilationJob. To get information about multiple model compilation jobs, use ListCompilationJobs.
   */
  createCompilationJob(callback?: (err: AWSError, data: SageMaker.Types.CreateCompilationJobResponse) => void): Request<SageMaker.Types.CreateCompilationJobResponse, AWSError>;
  /**
   * Creates a context. A context is a lineage tracking entity that represents a logical grouping of other tracking or experiment entities. Some examples are an endpoint and a model package. For more information, see Amazon SageMaker ML Lineage Tracking.
   */
  createContext(params: SageMaker.Types.CreateContextRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateContextResponse) => void): Request<SageMaker.Types.CreateContextResponse, AWSError>;
  /**
   * Creates a context. A context is a lineage tracking entity that represents a logical grouping of other tracking or experiment entities. Some examples are an endpoint and a model package. For more information, see Amazon SageMaker ML Lineage Tracking.
   */
  createContext(callback?: (err: AWSError, data: SageMaker.Types.CreateContextResponse) => void): Request<SageMaker.Types.CreateContextResponse, AWSError>;
  /**
   * Creates a definition for a job that monitors data quality and drift. For information about model monitor, see Amazon SageMaker Model Monitor.
   */
  createDataQualityJobDefinition(params: SageMaker.Types.CreateDataQualityJobDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateDataQualityJobDefinitionResponse) => void): Request<SageMaker.Types.CreateDataQualityJobDefinitionResponse, AWSError>;
  /**
   * Creates a definition for a job that monitors data quality and drift. For information about model monitor, see Amazon SageMaker Model Monitor.
   */
  createDataQualityJobDefinition(callback?: (err: AWSError, data: SageMaker.Types.CreateDataQualityJobDefinitionResponse) => void): Request<SageMaker.Types.CreateDataQualityJobDefinitionResponse, AWSError>;
  /**
   * Creates a device fleet.
   */
  createDeviceFleet(params: SageMaker.Types.CreateDeviceFleetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a device fleet.
   */
  createDeviceFleet(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a Domain used by Amazon SageMaker Studio. A domain consists of an associated Amazon Elastic File System (EFS) volume, a list of authorized users, and a variety of security, application, policy, and Amazon Virtual Private Cloud (VPC) configurations. An Amazon Web Services account is limited to one domain per region. Users within a domain can share notebook files and other artifacts with each other.  EFS storage  When a domain is created, an EFS volume is created for use by all of the users within the domain. Each user receives a private home directory within the EFS volume for notebooks, Git repositories, and data files. SageMaker uses the Amazon Web Services Key Management Service (Amazon Web Services KMS) to encrypt the EFS volume attached to the domain with an Amazon Web Services managed key by default. For more control, you can specify a customer managed key. For more information, see Protect Data at Rest Using Encryption.  VPC configuration  All SageMaker Studio traffic between the domain and the EFS volume is through the specified VPC and subnets. For other Studio traffic, you can specify the AppNetworkAccessType parameter. AppNetworkAccessType corresponds to the network access type that you choose when you onboard to Studio. The following options are available:    PublicInternetOnly - Non-EFS traffic goes through a VPC managed by Amazon SageMaker, which allows internet access. This is the default value.    VpcOnly - All Studio traffic is through the specified VPC and subnets. Internet access is disabled by default. To allow internet access, you must specify a NAT gateway. When internet access is disabled, you won't be able to run a Studio notebook or to train or host models unless your VPC has an interface endpoint to the SageMaker API and runtime or a NAT gateway and your security groups allow outbound connections.    NFS traffic over TCP on port 2049 needs to be allowed in both inbound and outbound rules in order to launch a SageMaker Studio app successfully.  For more information, see Connect SageMaker Studio Notebooks to Resources in a VPC.
   */
  createDomain(params: SageMaker.Types.CreateDomainRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateDomainResponse) => void): Request<SageMaker.Types.CreateDomainResponse, AWSError>;
  /**
   * Creates a Domain used by Amazon SageMaker Studio. A domain consists of an associated Amazon Elastic File System (EFS) volume, a list of authorized users, and a variety of security, application, policy, and Amazon Virtual Private Cloud (VPC) configurations. An Amazon Web Services account is limited to one domain per region. Users within a domain can share notebook files and other artifacts with each other.  EFS storage  When a domain is created, an EFS volume is created for use by all of the users within the domain. Each user receives a private home directory within the EFS volume for notebooks, Git repositories, and data files. SageMaker uses the Amazon Web Services Key Management Service (Amazon Web Services KMS) to encrypt the EFS volume attached to the domain with an Amazon Web Services managed key by default. For more control, you can specify a customer managed key. For more information, see Protect Data at Rest Using Encryption.  VPC configuration  All SageMaker Studio traffic between the domain and the EFS volume is through the specified VPC and subnets. For other Studio traffic, you can specify the AppNetworkAccessType parameter. AppNetworkAccessType corresponds to the network access type that you choose when you onboard to Studio. The following options are available:    PublicInternetOnly - Non-EFS traffic goes through a VPC managed by Amazon SageMaker, which allows internet access. This is the default value.    VpcOnly - All Studio traffic is through the specified VPC and subnets. Internet access is disabled by default. To allow internet access, you must specify a NAT gateway. When internet access is disabled, you won't be able to run a Studio notebook or to train or host models unless your VPC has an interface endpoint to the SageMaker API and runtime or a NAT gateway and your security groups allow outbound connections.    NFS traffic over TCP on port 2049 needs to be allowed in both inbound and outbound rules in order to launch a SageMaker Studio app successfully.  For more information, see Connect SageMaker Studio Notebooks to Resources in a VPC.
   */
  createDomain(callback?: (err: AWSError, data: SageMaker.Types.CreateDomainResponse) => void): Request<SageMaker.Types.CreateDomainResponse, AWSError>;
  /**
   * Starts a SageMaker Edge Manager model packaging job. Edge Manager will use the model artifacts from the Amazon Simple Storage Service bucket that you specify. After the model has been packaged, Amazon SageMaker saves the resulting artifacts to an S3 bucket that you specify.
   */
  createEdgePackagingJob(params: SageMaker.Types.CreateEdgePackagingJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts a SageMaker Edge Manager model packaging job. Edge Manager will use the model artifacts from the Amazon Simple Storage Service bucket that you specify. After the model has been packaged, Amazon SageMaker saves the resulting artifacts to an S3 bucket that you specify.
   */
  createEdgePackagingJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates an endpoint using the endpoint configuration specified in the request. Amazon SageMaker uses the endpoint to provision resources and deploy models. You create the endpoint configuration with the CreateEndpointConfig API.   Use this API to deploy models using Amazon SageMaker hosting services.  For an example that calls this method when deploying a model to Amazon SageMaker hosting services, see the Create Endpoint example notebook.    You must not delete an EndpointConfig that is in use by an endpoint that is live or while the UpdateEndpoint or CreateEndpoint operations are being performed on the endpoint. To update an endpoint, you must create a new EndpointConfig.  The endpoint name must be unique within an Amazon Web Services Region in your Amazon Web Services account.  When it receives the request, Amazon SageMaker creates the endpoint, launches the resources (ML compute instances), and deploys the model(s) on them.   When you call CreateEndpoint, a load call is made to DynamoDB to verify that your endpoint configuration exists. When you read data from a DynamoDB table supporting  Eventually Consistent Reads , the response might not reflect the results of a recently completed write operation. The response might include some stale data. If the dependent entities are not yet in DynamoDB, this causes a validation error. If you repeat your read request after a short time, the response should return the latest data. So retry logic is recommended to handle these possible issues. We also recommend that customers call DescribeEndpointConfig before calling CreateEndpoint to minimize the potential impact of a DynamoDB eventually consistent read.  When Amazon SageMaker receives the request, it sets the endpoint status to Creating. After it creates the endpoint, it sets the status to InService. Amazon SageMaker can then process incoming requests for inferences. To check the status of an endpoint, use the DescribeEndpoint API. If any of the models hosted at this endpoint get model data from an Amazon S3 location, Amazon SageMaker uses Amazon Web Services Security Token Service to download model artifacts from the S3 path you provided. Amazon Web Services STS is activated in your IAM user account by default. If you previously deactivated Amazon Web Services STS for a region, you need to reactivate Amazon Web Services STS for that region. For more information, see Activating and Deactivating Amazon Web Services STS in an Amazon Web Services Region in the Amazon Web Services Identity and Access Management User Guide.   To add the IAM role policies for using this API operation, go to the IAM console, and choose Roles in the left navigation pane. Search the IAM role that you want to grant access to use the CreateEndpoint and CreateEndpointConfig API operations, add the following policies to the role.    Option 1: For a full SageMaker access, search and attach the AmazonSageMakerFullAccess policy.   Option 2: For granting a limited access to an IAM role, paste the following Action elements manually into the JSON file of the IAM role:   "Action": ["sagemaker:CreateEndpoint", "sagemaker:CreateEndpointConfig"]   "Resource": [   "arn:aws:sagemaker:region:account-id:endpoint/endpointName"   "arn:aws:sagemaker:region:account-id:endpoint-config/endpointConfigName"   ]  For more information, see SageMaker API Permissions: Actions, Permissions, and Resources Reference.   
   */
  createEndpoint(params: SageMaker.Types.CreateEndpointInput, callback?: (err: AWSError, data: SageMaker.Types.CreateEndpointOutput) => void): Request<SageMaker.Types.CreateEndpointOutput, AWSError>;
  /**
   * Creates an endpoint using the endpoint configuration specified in the request. Amazon SageMaker uses the endpoint to provision resources and deploy models. You create the endpoint configuration with the CreateEndpointConfig API.   Use this API to deploy models using Amazon SageMaker hosting services.  For an example that calls this method when deploying a model to Amazon SageMaker hosting services, see the Create Endpoint example notebook.    You must not delete an EndpointConfig that is in use by an endpoint that is live or while the UpdateEndpoint or CreateEndpoint operations are being performed on the endpoint. To update an endpoint, you must create a new EndpointConfig.  The endpoint name must be unique within an Amazon Web Services Region in your Amazon Web Services account.  When it receives the request, Amazon SageMaker creates the endpoint, launches the resources (ML compute instances), and deploys the model(s) on them.   When you call CreateEndpoint, a load call is made to DynamoDB to verify that your endpoint configuration exists. When you read data from a DynamoDB table supporting  Eventually Consistent Reads , the response might not reflect the results of a recently completed write operation. The response might include some stale data. If the dependent entities are not yet in DynamoDB, this causes a validation error. If you repeat your read request after a short time, the response should return the latest data. So retry logic is recommended to handle these possible issues. We also recommend that customers call DescribeEndpointConfig before calling CreateEndpoint to minimize the potential impact of a DynamoDB eventually consistent read.  When Amazon SageMaker receives the request, it sets the endpoint status to Creating. After it creates the endpoint, it sets the status to InService. Amazon SageMaker can then process incoming requests for inferences. To check the status of an endpoint, use the DescribeEndpoint API. If any of the models hosted at this endpoint get model data from an Amazon S3 location, Amazon SageMaker uses Amazon Web Services Security Token Service to download model artifacts from the S3 path you provided. Amazon Web Services STS is activated in your IAM user account by default. If you previously deactivated Amazon Web Services STS for a region, you need to reactivate Amazon Web Services STS for that region. For more information, see Activating and Deactivating Amazon Web Services STS in an Amazon Web Services Region in the Amazon Web Services Identity and Access Management User Guide.   To add the IAM role policies for using this API operation, go to the IAM console, and choose Roles in the left navigation pane. Search the IAM role that you want to grant access to use the CreateEndpoint and CreateEndpointConfig API operations, add the following policies to the role.    Option 1: For a full SageMaker access, search and attach the AmazonSageMakerFullAccess policy.   Option 2: For granting a limited access to an IAM role, paste the following Action elements manually into the JSON file of the IAM role:   "Action": ["sagemaker:CreateEndpoint", "sagemaker:CreateEndpointConfig"]   "Resource": [   "arn:aws:sagemaker:region:account-id:endpoint/endpointName"   "arn:aws:sagemaker:region:account-id:endpoint-config/endpointConfigName"   ]  For more information, see SageMaker API Permissions: Actions, Permissions, and Resources Reference.   
   */
  createEndpoint(callback?: (err: AWSError, data: SageMaker.Types.CreateEndpointOutput) => void): Request<SageMaker.Types.CreateEndpointOutput, AWSError>;
  /**
   * Creates an endpoint configuration that Amazon SageMaker hosting services uses to deploy models. In the configuration, you identify one or more models, created using the CreateModel API, to deploy and the resources that you want Amazon SageMaker to provision. Then you call the CreateEndpoint API.   Use this API if you want to use Amazon SageMaker hosting services to deploy models into production.   In the request, you define a ProductionVariant, for each model that you want to deploy. Each ProductionVariant parameter also describes the resources that you want Amazon SageMaker to provision. This includes the number and type of ML compute instances to deploy.  If you are hosting multiple models, you also assign a VariantWeight to specify how much traffic you want to allocate to each model. For example, suppose that you want to host two models, A and B, and you assign traffic weight 2 for model A and 1 for model B. Amazon SageMaker distributes two-thirds of the traffic to Model A, and one-third to model B.   When you call CreateEndpoint, a load call is made to DynamoDB to verify that your endpoint configuration exists. When you read data from a DynamoDB table supporting  Eventually Consistent Reads , the response might not reflect the results of a recently completed write operation. The response might include some stale data. If the dependent entities are not yet in DynamoDB, this causes a validation error. If you repeat your read request after a short time, the response should return the latest data. So retry logic is recommended to handle these possible issues. We also recommend that customers call DescribeEndpointConfig before calling CreateEndpoint to minimize the potential impact of a DynamoDB eventually consistent read. 
   */
  createEndpointConfig(params: SageMaker.Types.CreateEndpointConfigInput, callback?: (err: AWSError, data: SageMaker.Types.CreateEndpointConfigOutput) => void): Request<SageMaker.Types.CreateEndpointConfigOutput, AWSError>;
  /**
   * Creates an endpoint configuration that Amazon SageMaker hosting services uses to deploy models. In the configuration, you identify one or more models, created using the CreateModel API, to deploy and the resources that you want Amazon SageMaker to provision. Then you call the CreateEndpoint API.   Use this API if you want to use Amazon SageMaker hosting services to deploy models into production.   In the request, you define a ProductionVariant, for each model that you want to deploy. Each ProductionVariant parameter also describes the resources that you want Amazon SageMaker to provision. This includes the number and type of ML compute instances to deploy.  If you are hosting multiple models, you also assign a VariantWeight to specify how much traffic you want to allocate to each model. For example, suppose that you want to host two models, A and B, and you assign traffic weight 2 for model A and 1 for model B. Amazon SageMaker distributes two-thirds of the traffic to Model A, and one-third to model B.   When you call CreateEndpoint, a load call is made to DynamoDB to verify that your endpoint configuration exists. When you read data from a DynamoDB table supporting  Eventually Consistent Reads , the response might not reflect the results of a recently completed write operation. The response might include some stale data. If the dependent entities are not yet in DynamoDB, this causes a validation error. If you repeat your read request after a short time, the response should return the latest data. So retry logic is recommended to handle these possible issues. We also recommend that customers call DescribeEndpointConfig before calling CreateEndpoint to minimize the potential impact of a DynamoDB eventually consistent read. 
   */
  createEndpointConfig(callback?: (err: AWSError, data: SageMaker.Types.CreateEndpointConfigOutput) => void): Request<SageMaker.Types.CreateEndpointConfigOutput, AWSError>;
  /**
   * Creates an SageMaker experiment. An experiment is a collection of trials that are observed, compared and evaluated as a group. A trial is a set of steps, called trial components, that produce a machine learning model. The goal of an experiment is to determine the components that produce the best model. Multiple trials are performed, each one isolating and measuring the impact of a change to one or more inputs, while keeping the remaining inputs constant. When you use SageMaker Studio or the SageMaker Python SDK, all experiments, trials, and trial components are automatically tracked, logged, and indexed. When you use the Amazon Web Services SDK for Python (Boto), you must use the logging APIs provided by the SDK. You can add tags to experiments, trials, trial components and then use the Search API to search for the tags. To add a description to an experiment, specify the optional Description parameter. To add a description later, or to change the description, call the UpdateExperiment API. To get a list of all your experiments, call the ListExperiments API. To view an experiment's properties, call the DescribeExperiment API. To get a list of all the trials associated with an experiment, call the ListTrials API. To create a trial call the CreateTrial API.
   */
  createExperiment(params: SageMaker.Types.CreateExperimentRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateExperimentResponse) => void): Request<SageMaker.Types.CreateExperimentResponse, AWSError>;
  /**
   * Creates an SageMaker experiment. An experiment is a collection of trials that are observed, compared and evaluated as a group. A trial is a set of steps, called trial components, that produce a machine learning model. The goal of an experiment is to determine the components that produce the best model. Multiple trials are performed, each one isolating and measuring the impact of a change to one or more inputs, while keeping the remaining inputs constant. When you use SageMaker Studio or the SageMaker Python SDK, all experiments, trials, and trial components are automatically tracked, logged, and indexed. When you use the Amazon Web Services SDK for Python (Boto), you must use the logging APIs provided by the SDK. You can add tags to experiments, trials, trial components and then use the Search API to search for the tags. To add a description to an experiment, specify the optional Description parameter. To add a description later, or to change the description, call the UpdateExperiment API. To get a list of all your experiments, call the ListExperiments API. To view an experiment's properties, call the DescribeExperiment API. To get a list of all the trials associated with an experiment, call the ListTrials API. To create a trial call the CreateTrial API.
   */
  createExperiment(callback?: (err: AWSError, data: SageMaker.Types.CreateExperimentResponse) => void): Request<SageMaker.Types.CreateExperimentResponse, AWSError>;
  /**
   * Create a new FeatureGroup. A FeatureGroup is a group of Features defined in the FeatureStore to describe a Record.  The FeatureGroup defines the schema and features contained in the FeatureGroup. A FeatureGroup definition is composed of a list of Features, a RecordIdentifierFeatureName, an EventTimeFeatureName and configurations for its OnlineStore and OfflineStore. Check Amazon Web Services service quotas to see the FeatureGroups quota for your Amazon Web Services account.  You must include at least one of OnlineStoreConfig and OfflineStoreConfig to create a FeatureGroup. 
   */
  createFeatureGroup(params: SageMaker.Types.CreateFeatureGroupRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateFeatureGroupResponse) => void): Request<SageMaker.Types.CreateFeatureGroupResponse, AWSError>;
  /**
   * Create a new FeatureGroup. A FeatureGroup is a group of Features defined in the FeatureStore to describe a Record.  The FeatureGroup defines the schema and features contained in the FeatureGroup. A FeatureGroup definition is composed of a list of Features, a RecordIdentifierFeatureName, an EventTimeFeatureName and configurations for its OnlineStore and OfflineStore. Check Amazon Web Services service quotas to see the FeatureGroups quota for your Amazon Web Services account.  You must include at least one of OnlineStoreConfig and OfflineStoreConfig to create a FeatureGroup. 
   */
  createFeatureGroup(callback?: (err: AWSError, data: SageMaker.Types.CreateFeatureGroupResponse) => void): Request<SageMaker.Types.CreateFeatureGroupResponse, AWSError>;
  /**
   * Creates a flow definition.
   */
  createFlowDefinition(params: SageMaker.Types.CreateFlowDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateFlowDefinitionResponse) => void): Request<SageMaker.Types.CreateFlowDefinitionResponse, AWSError>;
  /**
   * Creates a flow definition.
   */
  createFlowDefinition(callback?: (err: AWSError, data: SageMaker.Types.CreateFlowDefinitionResponse) => void): Request<SageMaker.Types.CreateFlowDefinitionResponse, AWSError>;
  /**
   * Defines the settings you will use for the human review workflow user interface. Reviewers will see a three-panel interface with an instruction area, the item to review, and an input area.
   */
  createHumanTaskUi(params: SageMaker.Types.CreateHumanTaskUiRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateHumanTaskUiResponse) => void): Request<SageMaker.Types.CreateHumanTaskUiResponse, AWSError>;
  /**
   * Defines the settings you will use for the human review workflow user interface. Reviewers will see a three-panel interface with an instruction area, the item to review, and an input area.
   */
  createHumanTaskUi(callback?: (err: AWSError, data: SageMaker.Types.CreateHumanTaskUiResponse) => void): Request<SageMaker.Types.CreateHumanTaskUiResponse, AWSError>;
  /**
   * Starts a hyperparameter tuning job. A hyperparameter tuning job finds the best version of a model by running many training jobs on your dataset using the algorithm you choose and values for hyperparameters within ranges that you specify. It then chooses the hyperparameter values that result in a model that performs the best, as measured by an objective metric that you choose.
   */
  createHyperParameterTuningJob(params: SageMaker.Types.CreateHyperParameterTuningJobRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateHyperParameterTuningJobResponse) => void): Request<SageMaker.Types.CreateHyperParameterTuningJobResponse, AWSError>;
  /**
   * Starts a hyperparameter tuning job. A hyperparameter tuning job finds the best version of a model by running many training jobs on your dataset using the algorithm you choose and values for hyperparameters within ranges that you specify. It then chooses the hyperparameter values that result in a model that performs the best, as measured by an objective metric that you choose.
   */
  createHyperParameterTuningJob(callback?: (err: AWSError, data: SageMaker.Types.CreateHyperParameterTuningJobResponse) => void): Request<SageMaker.Types.CreateHyperParameterTuningJobResponse, AWSError>;
  /**
   * Creates a custom SageMaker image. A SageMaker image is a set of image versions. Each image version represents a container image stored in Amazon Container Registry (ECR). For more information, see Bring your own SageMaker image.
   */
  createImage(params: SageMaker.Types.CreateImageRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateImageResponse) => void): Request<SageMaker.Types.CreateImageResponse, AWSError>;
  /**
   * Creates a custom SageMaker image. A SageMaker image is a set of image versions. Each image version represents a container image stored in Amazon Container Registry (ECR). For more information, see Bring your own SageMaker image.
   */
  createImage(callback?: (err: AWSError, data: SageMaker.Types.CreateImageResponse) => void): Request<SageMaker.Types.CreateImageResponse, AWSError>;
  /**
   * Creates a version of the SageMaker image specified by ImageName. The version represents the Amazon Container Registry (ECR) container image specified by BaseImage.
   */
  createImageVersion(params: SageMaker.Types.CreateImageVersionRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateImageVersionResponse) => void): Request<SageMaker.Types.CreateImageVersionResponse, AWSError>;
  /**
   * Creates a version of the SageMaker image specified by ImageName. The version represents the Amazon Container Registry (ECR) container image specified by BaseImage.
   */
  createImageVersion(callback?: (err: AWSError, data: SageMaker.Types.CreateImageVersionResponse) => void): Request<SageMaker.Types.CreateImageVersionResponse, AWSError>;
  /**
   * Creates a job that uses workers to label the data objects in your input dataset. You can use the labeled data to train machine learning models.  You can select your workforce from one of three providers:   A private workforce that you create. It can include employees, contractors, and outside experts. Use a private workforce when want the data to stay within your organization or when a specific set of skills is required.   One or more vendors that you select from the Amazon Web Services Marketplace. Vendors provide expertise in specific areas.    The Amazon Mechanical Turk workforce. This is the largest workforce, but it should only be used for public data or data that has been stripped of any personally identifiable information.   You can also use automated data labeling to reduce the number of data objects that need to be labeled by a human. Automated data labeling uses active learning to determine if a data object can be labeled by machine or if it needs to be sent to a human worker. For more information, see Using Automated Data Labeling. The data objects to be labeled are contained in an Amazon S3 bucket. You create a manifest file that describes the location of each object. For more information, see Using Input and Output Data. The output can be used as the manifest file for another labeling job or as training data for your machine learning models. You can use this operation to create a static labeling job or a streaming labeling job. A static labeling job stops if all data objects in the input manifest file identified in ManifestS3Uri have been labeled. A streaming labeling job runs perpetually until it is manually stopped, or remains idle for 10 days. You can send new data objects to an active (InProgress) streaming labeling job in real time. To learn how to create a static labeling job, see Create a Labeling Job (API)  in the Amazon SageMaker Developer Guide. To learn how to create a streaming labeling job, see Create a Streaming Labeling Job.
   */
  createLabelingJob(params: SageMaker.Types.CreateLabelingJobRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateLabelingJobResponse) => void): Request<SageMaker.Types.CreateLabelingJobResponse, AWSError>;
  /**
   * Creates a job that uses workers to label the data objects in your input dataset. You can use the labeled data to train machine learning models.  You can select your workforce from one of three providers:   A private workforce that you create. It can include employees, contractors, and outside experts. Use a private workforce when want the data to stay within your organization or when a specific set of skills is required.   One or more vendors that you select from the Amazon Web Services Marketplace. Vendors provide expertise in specific areas.    The Amazon Mechanical Turk workforce. This is the largest workforce, but it should only be used for public data or data that has been stripped of any personally identifiable information.   You can also use automated data labeling to reduce the number of data objects that need to be labeled by a human. Automated data labeling uses active learning to determine if a data object can be labeled by machine or if it needs to be sent to a human worker. For more information, see Using Automated Data Labeling. The data objects to be labeled are contained in an Amazon S3 bucket. You create a manifest file that describes the location of each object. For more information, see Using Input and Output Data. The output can be used as the manifest file for another labeling job or as training data for your machine learning models. You can use this operation to create a static labeling job or a streaming labeling job. A static labeling job stops if all data objects in the input manifest file identified in ManifestS3Uri have been labeled. A streaming labeling job runs perpetually until it is manually stopped, or remains idle for 10 days. You can send new data objects to an active (InProgress) streaming labeling job in real time. To learn how to create a static labeling job, see Create a Labeling Job (API)  in the Amazon SageMaker Developer Guide. To learn how to create a streaming labeling job, see Create a Streaming Labeling Job.
   */
  createLabelingJob(callback?: (err: AWSError, data: SageMaker.Types.CreateLabelingJobResponse) => void): Request<SageMaker.Types.CreateLabelingJobResponse, AWSError>;
  /**
   * Creates a model in Amazon SageMaker. In the request, you name the model and describe a primary container. For the primary container, you specify the Docker image that contains inference code, artifacts (from prior training), and a custom environment map that the inference code uses when you deploy the model for predictions. Use this API to create a model if you want to use Amazon SageMaker hosting services or run a batch transform job. To host your model, you create an endpoint configuration with the CreateEndpointConfig API, and then create an endpoint with the CreateEndpoint API. Amazon SageMaker then deploys all of the containers that you defined for the model in the hosting environment.  For an example that calls this method when deploying a model to Amazon SageMaker hosting services, see Deploy the Model to Amazon SageMaker Hosting Services (Amazon Web Services SDK for Python (Boto 3)).  To run a batch transform using your model, you start a job with the CreateTransformJob API. Amazon SageMaker uses your model and your dataset to get inferences which are then saved to a specified S3 location. In the CreateModel request, you must define a container with the PrimaryContainer parameter. In the request, you also provide an IAM role that Amazon SageMaker can assume to access model artifacts and docker image for deployment on ML compute hosting instances or for batch transform jobs. In addition, you also use the IAM role to manage permissions the inference code needs. For example, if the inference code access any other Amazon Web Services resources, you grant necessary permissions via this role.
   */
  createModel(params: SageMaker.Types.CreateModelInput, callback?: (err: AWSError, data: SageMaker.Types.CreateModelOutput) => void): Request<SageMaker.Types.CreateModelOutput, AWSError>;
  /**
   * Creates a model in Amazon SageMaker. In the request, you name the model and describe a primary container. For the primary container, you specify the Docker image that contains inference code, artifacts (from prior training), and a custom environment map that the inference code uses when you deploy the model for predictions. Use this API to create a model if you want to use Amazon SageMaker hosting services or run a batch transform job. To host your model, you create an endpoint configuration with the CreateEndpointConfig API, and then create an endpoint with the CreateEndpoint API. Amazon SageMaker then deploys all of the containers that you defined for the model in the hosting environment.  For an example that calls this method when deploying a model to Amazon SageMaker hosting services, see Deploy the Model to Amazon SageMaker Hosting Services (Amazon Web Services SDK for Python (Boto 3)).  To run a batch transform using your model, you start a job with the CreateTransformJob API. Amazon SageMaker uses your model and your dataset to get inferences which are then saved to a specified S3 location. In the CreateModel request, you must define a container with the PrimaryContainer parameter. In the request, you also provide an IAM role that Amazon SageMaker can assume to access model artifacts and docker image for deployment on ML compute hosting instances or for batch transform jobs. In addition, you also use the IAM role to manage permissions the inference code needs. For example, if the inference code access any other Amazon Web Services resources, you grant necessary permissions via this role.
   */
  createModel(callback?: (err: AWSError, data: SageMaker.Types.CreateModelOutput) => void): Request<SageMaker.Types.CreateModelOutput, AWSError>;
  /**
   * Creates the definition for a model bias job.
   */
  createModelBiasJobDefinition(params: SageMaker.Types.CreateModelBiasJobDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateModelBiasJobDefinitionResponse) => void): Request<SageMaker.Types.CreateModelBiasJobDefinitionResponse, AWSError>;
  /**
   * Creates the definition for a model bias job.
   */
  createModelBiasJobDefinition(callback?: (err: AWSError, data: SageMaker.Types.CreateModelBiasJobDefinitionResponse) => void): Request<SageMaker.Types.CreateModelBiasJobDefinitionResponse, AWSError>;
  /**
   * Creates the definition for a model explainability job.
   */
  createModelExplainabilityJobDefinition(params: SageMaker.Types.CreateModelExplainabilityJobDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateModelExplainabilityJobDefinitionResponse) => void): Request<SageMaker.Types.CreateModelExplainabilityJobDefinitionResponse, AWSError>;
  /**
   * Creates the definition for a model explainability job.
   */
  createModelExplainabilityJobDefinition(callback?: (err: AWSError, data: SageMaker.Types.CreateModelExplainabilityJobDefinitionResponse) => void): Request<SageMaker.Types.CreateModelExplainabilityJobDefinitionResponse, AWSError>;
  /**
   * Creates a model package that you can use to create Amazon SageMaker models or list on Amazon Web Services Marketplace, or a versioned model that is part of a model group. Buyers can subscribe to model packages listed on Amazon Web Services Marketplace to create models in Amazon SageMaker. To create a model package by specifying a Docker container that contains your inference code and the Amazon S3 location of your model artifacts, provide values for InferenceSpecification. To create a model from an algorithm resource that you created or subscribed to in Amazon Web Services Marketplace, provide a value for SourceAlgorithmSpecification.  There are two types of model packages:   Versioned - a model that is part of a model group in the model registry.   Unversioned - a model package that is not part of a model group.   
   */
  createModelPackage(params: SageMaker.Types.CreateModelPackageInput, callback?: (err: AWSError, data: SageMaker.Types.CreateModelPackageOutput) => void): Request<SageMaker.Types.CreateModelPackageOutput, AWSError>;
  /**
   * Creates a model package that you can use to create Amazon SageMaker models or list on Amazon Web Services Marketplace, or a versioned model that is part of a model group. Buyers can subscribe to model packages listed on Amazon Web Services Marketplace to create models in Amazon SageMaker. To create a model package by specifying a Docker container that contains your inference code and the Amazon S3 location of your model artifacts, provide values for InferenceSpecification. To create a model from an algorithm resource that you created or subscribed to in Amazon Web Services Marketplace, provide a value for SourceAlgorithmSpecification.  There are two types of model packages:   Versioned - a model that is part of a model group in the model registry.   Unversioned - a model package that is not part of a model group.   
   */
  createModelPackage(callback?: (err: AWSError, data: SageMaker.Types.CreateModelPackageOutput) => void): Request<SageMaker.Types.CreateModelPackageOutput, AWSError>;
  /**
   * Creates a model group. A model group contains a group of model versions.
   */
  createModelPackageGroup(params: SageMaker.Types.CreateModelPackageGroupInput, callback?: (err: AWSError, data: SageMaker.Types.CreateModelPackageGroupOutput) => void): Request<SageMaker.Types.CreateModelPackageGroupOutput, AWSError>;
  /**
   * Creates a model group. A model group contains a group of model versions.
   */
  createModelPackageGroup(callback?: (err: AWSError, data: SageMaker.Types.CreateModelPackageGroupOutput) => void): Request<SageMaker.Types.CreateModelPackageGroupOutput, AWSError>;
  /**
   * Creates a definition for a job that monitors model quality and drift. For information about model monitor, see Amazon SageMaker Model Monitor.
   */
  createModelQualityJobDefinition(params: SageMaker.Types.CreateModelQualityJobDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateModelQualityJobDefinitionResponse) => void): Request<SageMaker.Types.CreateModelQualityJobDefinitionResponse, AWSError>;
  /**
   * Creates a definition for a job that monitors model quality and drift. For information about model monitor, see Amazon SageMaker Model Monitor.
   */
  createModelQualityJobDefinition(callback?: (err: AWSError, data: SageMaker.Types.CreateModelQualityJobDefinitionResponse) => void): Request<SageMaker.Types.CreateModelQualityJobDefinitionResponse, AWSError>;
  /**
   * Creates a schedule that regularly starts Amazon SageMaker Processing Jobs to monitor the data captured for an Amazon SageMaker Endoint.
   */
  createMonitoringSchedule(params: SageMaker.Types.CreateMonitoringScheduleRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateMonitoringScheduleResponse) => void): Request<SageMaker.Types.CreateMonitoringScheduleResponse, AWSError>;
  /**
   * Creates a schedule that regularly starts Amazon SageMaker Processing Jobs to monitor the data captured for an Amazon SageMaker Endoint.
   */
  createMonitoringSchedule(callback?: (err: AWSError, data: SageMaker.Types.CreateMonitoringScheduleResponse) => void): Request<SageMaker.Types.CreateMonitoringScheduleResponse, AWSError>;
  /**
   * Creates an Amazon SageMaker notebook instance. A notebook instance is a machine learning (ML) compute instance running on a Jupyter notebook.  In a CreateNotebookInstance request, specify the type of ML compute instance that you want to run. Amazon SageMaker launches the instance, installs common libraries that you can use to explore datasets for model training, and attaches an ML storage volume to the notebook instance.  Amazon SageMaker also provides a set of example notebooks. Each notebook demonstrates how to use Amazon SageMaker with a specific algorithm or with a machine learning framework.  After receiving the request, Amazon SageMaker does the following:   Creates a network interface in the Amazon SageMaker VPC.   (Option) If you specified SubnetId, Amazon SageMaker creates a network interface in your own VPC, which is inferred from the subnet ID that you provide in the input. When creating this network interface, Amazon SageMaker attaches the security group that you specified in the request to the network interface that it creates in your VPC.   Launches an EC2 instance of the type specified in the request in the Amazon SageMaker VPC. If you specified SubnetId of your VPC, Amazon SageMaker specifies both network interfaces when launching this instance. This enables inbound traffic from your own VPC to the notebook instance, assuming that the security groups allow it.   After creating the notebook instance, Amazon SageMaker returns its Amazon Resource Name (ARN). You can't change the name of a notebook instance after you create it. After Amazon SageMaker creates the notebook instance, you can connect to the Jupyter server and work in Jupyter notebooks. For example, you can write code to explore a dataset that you can use for model training, train a model, host models by creating Amazon SageMaker endpoints, and validate hosted models.  For more information, see How It Works. 
   */
  createNotebookInstance(params: SageMaker.Types.CreateNotebookInstanceInput, callback?: (err: AWSError, data: SageMaker.Types.CreateNotebookInstanceOutput) => void): Request<SageMaker.Types.CreateNotebookInstanceOutput, AWSError>;
  /**
   * Creates an Amazon SageMaker notebook instance. A notebook instance is a machine learning (ML) compute instance running on a Jupyter notebook.  In a CreateNotebookInstance request, specify the type of ML compute instance that you want to run. Amazon SageMaker launches the instance, installs common libraries that you can use to explore datasets for model training, and attaches an ML storage volume to the notebook instance.  Amazon SageMaker also provides a set of example notebooks. Each notebook demonstrates how to use Amazon SageMaker with a specific algorithm or with a machine learning framework.  After receiving the request, Amazon SageMaker does the following:   Creates a network interface in the Amazon SageMaker VPC.   (Option) If you specified SubnetId, Amazon SageMaker creates a network interface in your own VPC, which is inferred from the subnet ID that you provide in the input. When creating this network interface, Amazon SageMaker attaches the security group that you specified in the request to the network interface that it creates in your VPC.   Launches an EC2 instance of the type specified in the request in the Amazon SageMaker VPC. If you specified SubnetId of your VPC, Amazon SageMaker specifies both network interfaces when launching this instance. This enables inbound traffic from your own VPC to the notebook instance, assuming that the security groups allow it.   After creating the notebook instance, Amazon SageMaker returns its Amazon Resource Name (ARN). You can't change the name of a notebook instance after you create it. After Amazon SageMaker creates the notebook instance, you can connect to the Jupyter server and work in Jupyter notebooks. For example, you can write code to explore a dataset that you can use for model training, train a model, host models by creating Amazon SageMaker endpoints, and validate hosted models.  For more information, see How It Works. 
   */
  createNotebookInstance(callback?: (err: AWSError, data: SageMaker.Types.CreateNotebookInstanceOutput) => void): Request<SageMaker.Types.CreateNotebookInstanceOutput, AWSError>;
  /**
   * Creates a lifecycle configuration that you can associate with a notebook instance. A lifecycle configuration is a collection of shell scripts that run when you create or start a notebook instance. Each lifecycle configuration script has a limit of 16384 characters. The value of the $PATH environment variable that is available to both scripts is /sbin:bin:/usr/sbin:/usr/bin. View CloudWatch Logs for notebook instance lifecycle configurations in log group /aws/sagemaker/NotebookInstances in log stream [notebook-instance-name]/[LifecycleConfigHook]. Lifecycle configuration scripts cannot run for longer than 5 minutes. If a script runs for longer than 5 minutes, it fails and the notebook instance is not created or started. For information about notebook instance lifestyle configurations, see Step 2.1: (Optional) Customize a Notebook Instance.
   */
  createNotebookInstanceLifecycleConfig(params: SageMaker.Types.CreateNotebookInstanceLifecycleConfigInput, callback?: (err: AWSError, data: SageMaker.Types.CreateNotebookInstanceLifecycleConfigOutput) => void): Request<SageMaker.Types.CreateNotebookInstanceLifecycleConfigOutput, AWSError>;
  /**
   * Creates a lifecycle configuration that you can associate with a notebook instance. A lifecycle configuration is a collection of shell scripts that run when you create or start a notebook instance. Each lifecycle configuration script has a limit of 16384 characters. The value of the $PATH environment variable that is available to both scripts is /sbin:bin:/usr/sbin:/usr/bin. View CloudWatch Logs for notebook instance lifecycle configurations in log group /aws/sagemaker/NotebookInstances in log stream [notebook-instance-name]/[LifecycleConfigHook]. Lifecycle configuration scripts cannot run for longer than 5 minutes. If a script runs for longer than 5 minutes, it fails and the notebook instance is not created or started. For information about notebook instance lifestyle configurations, see Step 2.1: (Optional) Customize a Notebook Instance.
   */
  createNotebookInstanceLifecycleConfig(callback?: (err: AWSError, data: SageMaker.Types.CreateNotebookInstanceLifecycleConfigOutput) => void): Request<SageMaker.Types.CreateNotebookInstanceLifecycleConfigOutput, AWSError>;
  /**
   * Creates a pipeline using a JSON pipeline definition.
   */
  createPipeline(params: SageMaker.Types.CreatePipelineRequest, callback?: (err: AWSError, data: SageMaker.Types.CreatePipelineResponse) => void): Request<SageMaker.Types.CreatePipelineResponse, AWSError>;
  /**
   * Creates a pipeline using a JSON pipeline definition.
   */
  createPipeline(callback?: (err: AWSError, data: SageMaker.Types.CreatePipelineResponse) => void): Request<SageMaker.Types.CreatePipelineResponse, AWSError>;
  /**
   * Creates a URL for a specified UserProfile in a Domain. When accessed in a web browser, the user will be automatically signed in to Amazon SageMaker Studio, and granted access to all of the Apps and files associated with the Domain's Amazon Elastic File System (EFS) volume. This operation can only be called when the authentication mode equals IAM.  The IAM role or user used to call this API defines the permissions to access the app. Once the presigned URL is created, no additional permission is required to access this URL. IAM authorization policies for this API are also enforced for every HTTP request and WebSocket frame that attempts to connect to the app. You can restrict access to this API and to the URL that it returns to a list of IP addresses, Amazon VPCs or Amazon VPC Endpoints that you specify. For more information, see Connect to SageMaker Studio Through an Interface VPC Endpoint .  The URL that you get from a call to CreatePresignedDomainUrl has a default timeout of 5 minutes. You can configure this value using ExpiresInSeconds. If you try to use the URL after the timeout limit expires, you are directed to the Amazon Web Services console sign-in page. 
   */
  createPresignedDomainUrl(params: SageMaker.Types.CreatePresignedDomainUrlRequest, callback?: (err: AWSError, data: SageMaker.Types.CreatePresignedDomainUrlResponse) => void): Request<SageMaker.Types.CreatePresignedDomainUrlResponse, AWSError>;
  /**
   * Creates a URL for a specified UserProfile in a Domain. When accessed in a web browser, the user will be automatically signed in to Amazon SageMaker Studio, and granted access to all of the Apps and files associated with the Domain's Amazon Elastic File System (EFS) volume. This operation can only be called when the authentication mode equals IAM.  The IAM role or user used to call this API defines the permissions to access the app. Once the presigned URL is created, no additional permission is required to access this URL. IAM authorization policies for this API are also enforced for every HTTP request and WebSocket frame that attempts to connect to the app. You can restrict access to this API and to the URL that it returns to a list of IP addresses, Amazon VPCs or Amazon VPC Endpoints that you specify. For more information, see Connect to SageMaker Studio Through an Interface VPC Endpoint .  The URL that you get from a call to CreatePresignedDomainUrl has a default timeout of 5 minutes. You can configure this value using ExpiresInSeconds. If you try to use the URL after the timeout limit expires, you are directed to the Amazon Web Services console sign-in page. 
   */
  createPresignedDomainUrl(callback?: (err: AWSError, data: SageMaker.Types.CreatePresignedDomainUrlResponse) => void): Request<SageMaker.Types.CreatePresignedDomainUrlResponse, AWSError>;
  /**
   * Returns a URL that you can use to connect to the Jupyter server from a notebook instance. In the Amazon SageMaker console, when you choose Open next to a notebook instance, Amazon SageMaker opens a new tab showing the Jupyter server home page from the notebook instance. The console uses this API to get the URL and show the page.  The IAM role or user used to call this API defines the permissions to access the notebook instance. Once the presigned URL is created, no additional permission is required to access this URL. IAM authorization policies for this API are also enforced for every HTTP request and WebSocket frame that attempts to connect to the notebook instance. You can restrict access to this API and to the URL that it returns to a list of IP addresses that you specify. Use the NotIpAddress condition operator and the aws:SourceIP condition context key to specify the list of IP addresses that you want to have access to the notebook instance. For more information, see Limit Access to a Notebook Instance by IP Address.  The URL that you get from a call to CreatePresignedNotebookInstanceUrl is valid only for 5 minutes. If you try to use the URL after the 5-minute limit expires, you are directed to the Amazon Web Services console sign-in page. 
   */
  createPresignedNotebookInstanceUrl(params: SageMaker.Types.CreatePresignedNotebookInstanceUrlInput, callback?: (err: AWSError, data: SageMaker.Types.CreatePresignedNotebookInstanceUrlOutput) => void): Request<SageMaker.Types.CreatePresignedNotebookInstanceUrlOutput, AWSError>;
  /**
   * Returns a URL that you can use to connect to the Jupyter server from a notebook instance. In the Amazon SageMaker console, when you choose Open next to a notebook instance, Amazon SageMaker opens a new tab showing the Jupyter server home page from the notebook instance. The console uses this API to get the URL and show the page.  The IAM role or user used to call this API defines the permissions to access the notebook instance. Once the presigned URL is created, no additional permission is required to access this URL. IAM authorization policies for this API are also enforced for every HTTP request and WebSocket frame that attempts to connect to the notebook instance. You can restrict access to this API and to the URL that it returns to a list of IP addresses that you specify. Use the NotIpAddress condition operator and the aws:SourceIP condition context key to specify the list of IP addresses that you want to have access to the notebook instance. For more information, see Limit Access to a Notebook Instance by IP Address.  The URL that you get from a call to CreatePresignedNotebookInstanceUrl is valid only for 5 minutes. If you try to use the URL after the 5-minute limit expires, you are directed to the Amazon Web Services console sign-in page. 
   */
  createPresignedNotebookInstanceUrl(callback?: (err: AWSError, data: SageMaker.Types.CreatePresignedNotebookInstanceUrlOutput) => void): Request<SageMaker.Types.CreatePresignedNotebookInstanceUrlOutput, AWSError>;
  /**
   * Creates a processing job.
   */
  createProcessingJob(params: SageMaker.Types.CreateProcessingJobRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateProcessingJobResponse) => void): Request<SageMaker.Types.CreateProcessingJobResponse, AWSError>;
  /**
   * Creates a processing job.
   */
  createProcessingJob(callback?: (err: AWSError, data: SageMaker.Types.CreateProcessingJobResponse) => void): Request<SageMaker.Types.CreateProcessingJobResponse, AWSError>;
  /**
   * Creates a machine learning (ML) project that can contain one or more templates that set up an ML pipeline from training to deploying an approved model.
   */
  createProject(params: SageMaker.Types.CreateProjectInput, callback?: (err: AWSError, data: SageMaker.Types.CreateProjectOutput) => void): Request<SageMaker.Types.CreateProjectOutput, AWSError>;
  /**
   * Creates a machine learning (ML) project that can contain one or more templates that set up an ML pipeline from training to deploying an approved model.
   */
  createProject(callback?: (err: AWSError, data: SageMaker.Types.CreateProjectOutput) => void): Request<SageMaker.Types.CreateProjectOutput, AWSError>;
  /**
   * Creates a new Studio Lifecycle Configuration.
   */
  createStudioLifecycleConfig(params: SageMaker.Types.CreateStudioLifecycleConfigRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateStudioLifecycleConfigResponse) => void): Request<SageMaker.Types.CreateStudioLifecycleConfigResponse, AWSError>;
  /**
   * Creates a new Studio Lifecycle Configuration.
   */
  createStudioLifecycleConfig(callback?: (err: AWSError, data: SageMaker.Types.CreateStudioLifecycleConfigResponse) => void): Request<SageMaker.Types.CreateStudioLifecycleConfigResponse, AWSError>;
  /**
   * Starts a model training job. After training completes, Amazon SageMaker saves the resulting model artifacts to an Amazon S3 location that you specify.  If you choose to host your model using Amazon SageMaker hosting services, you can use the resulting model artifacts as part of the model. You can also use the artifacts in a machine learning service other than Amazon SageMaker, provided that you know how to use them for inference.  In the request body, you provide the following:     AlgorithmSpecification - Identifies the training algorithm to use.     HyperParameters - Specify these algorithm-specific parameters to enable the estimation of model parameters during training. Hyperparameters can be tuned to optimize this learning process. For a list of hyperparameters for each training algorithm provided by Amazon SageMaker, see Algorithms.     InputDataConfig - Describes the training dataset and the Amazon S3, EFS, or FSx location where it is stored.    OutputDataConfig - Identifies the Amazon S3 bucket where you want Amazon SageMaker to save the results of model training.     ResourceConfig - Identifies the resources, ML compute instances, and ML storage volumes to deploy for model training. In distributed training, you specify more than one instance.     EnableManagedSpotTraining - Optimize the cost of training machine learning models by up to 80% by using Amazon EC2 Spot instances. For more information, see Managed Spot Training.     RoleArn - The Amazon Resource Name (ARN) that Amazon SageMaker assumes to perform tasks on your behalf during model training. You must grant this role the necessary permissions so that Amazon SageMaker can successfully complete model training.     StoppingCondition - To help cap training costs, use MaxRuntimeInSeconds to set a time limit for training. Use MaxWaitTimeInSeconds to specify how long a managed spot training job has to complete.     Environment - The environment variables to set in the Docker container.    RetryStrategy - The number of times to retry the job when the job fails due to an InternalServerError.    For more information about Amazon SageMaker, see How It Works. 
   */
  createTrainingJob(params: SageMaker.Types.CreateTrainingJobRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateTrainingJobResponse) => void): Request<SageMaker.Types.CreateTrainingJobResponse, AWSError>;
  /**
   * Starts a model training job. After training completes, Amazon SageMaker saves the resulting model artifacts to an Amazon S3 location that you specify.  If you choose to host your model using Amazon SageMaker hosting services, you can use the resulting model artifacts as part of the model. You can also use the artifacts in a machine learning service other than Amazon SageMaker, provided that you know how to use them for inference.  In the request body, you provide the following:     AlgorithmSpecification - Identifies the training algorithm to use.     HyperParameters - Specify these algorithm-specific parameters to enable the estimation of model parameters during training. Hyperparameters can be tuned to optimize this learning process. For a list of hyperparameters for each training algorithm provided by Amazon SageMaker, see Algorithms.     InputDataConfig - Describes the training dataset and the Amazon S3, EFS, or FSx location where it is stored.    OutputDataConfig - Identifies the Amazon S3 bucket where you want Amazon SageMaker to save the results of model training.     ResourceConfig - Identifies the resources, ML compute instances, and ML storage volumes to deploy for model training. In distributed training, you specify more than one instance.     EnableManagedSpotTraining - Optimize the cost of training machine learning models by up to 80% by using Amazon EC2 Spot instances. For more information, see Managed Spot Training.     RoleArn - The Amazon Resource Name (ARN) that Amazon SageMaker assumes to perform tasks on your behalf during model training. You must grant this role the necessary permissions so that Amazon SageMaker can successfully complete model training.     StoppingCondition - To help cap training costs, use MaxRuntimeInSeconds to set a time limit for training. Use MaxWaitTimeInSeconds to specify how long a managed spot training job has to complete.     Environment - The environment variables to set in the Docker container.    RetryStrategy - The number of times to retry the job when the job fails due to an InternalServerError.    For more information about Amazon SageMaker, see How It Works. 
   */
  createTrainingJob(callback?: (err: AWSError, data: SageMaker.Types.CreateTrainingJobResponse) => void): Request<SageMaker.Types.CreateTrainingJobResponse, AWSError>;
  /**
   * Starts a transform job. A transform job uses a trained model to get inferences on a dataset and saves these results to an Amazon S3 location that you specify. To perform batch transformations, you create a transform job and use the data that you have readily available. In the request body, you provide the following:    TransformJobName - Identifies the transform job. The name must be unique within an Amazon Web Services Region in an Amazon Web Services account.    ModelName - Identifies the model to use. ModelName must be the name of an existing Amazon SageMaker model in the same Amazon Web Services Region and Amazon Web Services account. For information on creating a model, see CreateModel.    TransformInput - Describes the dataset to be transformed and the Amazon S3 location where it is stored.    TransformOutput - Identifies the Amazon S3 location where you want Amazon SageMaker to save the results from the transform job.    TransformResources - Identifies the ML compute instances for the transform job.   For more information about how batch transformation works, see Batch Transform.
   */
  createTransformJob(params: SageMaker.Types.CreateTransformJobRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateTransformJobResponse) => void): Request<SageMaker.Types.CreateTransformJobResponse, AWSError>;
  /**
   * Starts a transform job. A transform job uses a trained model to get inferences on a dataset and saves these results to an Amazon S3 location that you specify. To perform batch transformations, you create a transform job and use the data that you have readily available. In the request body, you provide the following:    TransformJobName - Identifies the transform job. The name must be unique within an Amazon Web Services Region in an Amazon Web Services account.    ModelName - Identifies the model to use. ModelName must be the name of an existing Amazon SageMaker model in the same Amazon Web Services Region and Amazon Web Services account. For information on creating a model, see CreateModel.    TransformInput - Describes the dataset to be transformed and the Amazon S3 location where it is stored.    TransformOutput - Identifies the Amazon S3 location where you want Amazon SageMaker to save the results from the transform job.    TransformResources - Identifies the ML compute instances for the transform job.   For more information about how batch transformation works, see Batch Transform.
   */
  createTransformJob(callback?: (err: AWSError, data: SageMaker.Types.CreateTransformJobResponse) => void): Request<SageMaker.Types.CreateTransformJobResponse, AWSError>;
  /**
   * Creates an SageMaker trial. A trial is a set of steps called trial components that produce a machine learning model. A trial is part of a single SageMaker experiment. When you use SageMaker Studio or the SageMaker Python SDK, all experiments, trials, and trial components are automatically tracked, logged, and indexed. When you use the Amazon Web Services SDK for Python (Boto), you must use the logging APIs provided by the SDK. You can add tags to a trial and then use the Search API to search for the tags. To get a list of all your trials, call the ListTrials API. To view a trial's properties, call the DescribeTrial API. To create a trial component, call the CreateTrialComponent API.
   */
  createTrial(params: SageMaker.Types.CreateTrialRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateTrialResponse) => void): Request<SageMaker.Types.CreateTrialResponse, AWSError>;
  /**
   * Creates an SageMaker trial. A trial is a set of steps called trial components that produce a machine learning model. A trial is part of a single SageMaker experiment. When you use SageMaker Studio or the SageMaker Python SDK, all experiments, trials, and trial components are automatically tracked, logged, and indexed. When you use the Amazon Web Services SDK for Python (Boto), you must use the logging APIs provided by the SDK. You can add tags to a trial and then use the Search API to search for the tags. To get a list of all your trials, call the ListTrials API. To view a trial's properties, call the DescribeTrial API. To create a trial component, call the CreateTrialComponent API.
   */
  createTrial(callback?: (err: AWSError, data: SageMaker.Types.CreateTrialResponse) => void): Request<SageMaker.Types.CreateTrialResponse, AWSError>;
  /**
   * Creates a trial component, which is a stage of a machine learning trial. A trial is composed of one or more trial components. A trial component can be used in multiple trials. Trial components include pre-processing jobs, training jobs, and batch transform jobs. When you use SageMaker Studio or the SageMaker Python SDK, all experiments, trials, and trial components are automatically tracked, logged, and indexed. When you use the Amazon Web Services SDK for Python (Boto), you must use the logging APIs provided by the SDK. You can add tags to a trial component and then use the Search API to search for the tags.
   */
  createTrialComponent(params: SageMaker.Types.CreateTrialComponentRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateTrialComponentResponse) => void): Request<SageMaker.Types.CreateTrialComponentResponse, AWSError>;
  /**
   * Creates a trial component, which is a stage of a machine learning trial. A trial is composed of one or more trial components. A trial component can be used in multiple trials. Trial components include pre-processing jobs, training jobs, and batch transform jobs. When you use SageMaker Studio or the SageMaker Python SDK, all experiments, trials, and trial components are automatically tracked, logged, and indexed. When you use the Amazon Web Services SDK for Python (Boto), you must use the logging APIs provided by the SDK. You can add tags to a trial component and then use the Search API to search for the tags.
   */
  createTrialComponent(callback?: (err: AWSError, data: SageMaker.Types.CreateTrialComponentResponse) => void): Request<SageMaker.Types.CreateTrialComponentResponse, AWSError>;
  /**
   * Creates a user profile. A user profile represents a single user within a domain, and is the main way to reference a "person" for the purposes of sharing, reporting, and other user-oriented features. This entity is created when a user onboards to Amazon SageMaker Studio. If an administrator invites a person by email or imports them from SSO, a user profile is automatically created. A user profile is the primary holder of settings for an individual user and has a reference to the user's private Amazon Elastic File System (EFS) home directory. 
   */
  createUserProfile(params: SageMaker.Types.CreateUserProfileRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateUserProfileResponse) => void): Request<SageMaker.Types.CreateUserProfileResponse, AWSError>;
  /**
   * Creates a user profile. A user profile represents a single user within a domain, and is the main way to reference a "person" for the purposes of sharing, reporting, and other user-oriented features. This entity is created when a user onboards to Amazon SageMaker Studio. If an administrator invites a person by email or imports them from SSO, a user profile is automatically created. A user profile is the primary holder of settings for an individual user and has a reference to the user's private Amazon Elastic File System (EFS) home directory. 
   */
  createUserProfile(callback?: (err: AWSError, data: SageMaker.Types.CreateUserProfileResponse) => void): Request<SageMaker.Types.CreateUserProfileResponse, AWSError>;
  /**
   * Use this operation to create a workforce. This operation will return an error if a workforce already exists in the Amazon Web Services Region that you specify. You can only create one workforce in each Amazon Web Services Region per Amazon Web Services account. If you want to create a new workforce in an Amazon Web Services Region where a workforce already exists, use the API operation to delete the existing workforce and then use CreateWorkforce to create a new workforce. To create a private workforce using Amazon Cognito, you must specify a Cognito user pool in CognitoConfig. You can also create an Amazon Cognito workforce using the Amazon SageMaker console. For more information, see  Create a Private Workforce (Amazon Cognito). To create a private workforce using your own OIDC Identity Provider (IdP), specify your IdP configuration in OidcConfig. Your OIDC IdP must support groups because groups are used by Ground Truth and Amazon A2I to create work teams. For more information, see  Create a Private Workforce (OIDC IdP).
   */
  createWorkforce(params: SageMaker.Types.CreateWorkforceRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateWorkforceResponse) => void): Request<SageMaker.Types.CreateWorkforceResponse, AWSError>;
  /**
   * Use this operation to create a workforce. This operation will return an error if a workforce already exists in the Amazon Web Services Region that you specify. You can only create one workforce in each Amazon Web Services Region per Amazon Web Services account. If you want to create a new workforce in an Amazon Web Services Region where a workforce already exists, use the API operation to delete the existing workforce and then use CreateWorkforce to create a new workforce. To create a private workforce using Amazon Cognito, you must specify a Cognito user pool in CognitoConfig. You can also create an Amazon Cognito workforce using the Amazon SageMaker console. For more information, see  Create a Private Workforce (Amazon Cognito). To create a private workforce using your own OIDC Identity Provider (IdP), specify your IdP configuration in OidcConfig. Your OIDC IdP must support groups because groups are used by Ground Truth and Amazon A2I to create work teams. For more information, see  Create a Private Workforce (OIDC IdP).
   */
  createWorkforce(callback?: (err: AWSError, data: SageMaker.Types.CreateWorkforceResponse) => void): Request<SageMaker.Types.CreateWorkforceResponse, AWSError>;
  /**
   * Creates a new work team for labeling your data. A work team is defined by one or more Amazon Cognito user pools. You must first create the user pools before you can create a work team. You cannot create more than 25 work teams in an account and region.
   */
  createWorkteam(params: SageMaker.Types.CreateWorkteamRequest, callback?: (err: AWSError, data: SageMaker.Types.CreateWorkteamResponse) => void): Request<SageMaker.Types.CreateWorkteamResponse, AWSError>;
  /**
   * Creates a new work team for labeling your data. A work team is defined by one or more Amazon Cognito user pools. You must first create the user pools before you can create a work team. You cannot create more than 25 work teams in an account and region.
   */
  createWorkteam(callback?: (err: AWSError, data: SageMaker.Types.CreateWorkteamResponse) => void): Request<SageMaker.Types.CreateWorkteamResponse, AWSError>;
  /**
   * Deletes an action.
   */
  deleteAction(params: SageMaker.Types.DeleteActionRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteActionResponse) => void): Request<SageMaker.Types.DeleteActionResponse, AWSError>;
  /**
   * Deletes an action.
   */
  deleteAction(callback?: (err: AWSError, data: SageMaker.Types.DeleteActionResponse) => void): Request<SageMaker.Types.DeleteActionResponse, AWSError>;
  /**
   * Removes the specified algorithm from your account.
   */
  deleteAlgorithm(params: SageMaker.Types.DeleteAlgorithmInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes the specified algorithm from your account.
   */
  deleteAlgorithm(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Used to stop and delete an app.
   */
  deleteApp(params: SageMaker.Types.DeleteAppRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Used to stop and delete an app.
   */
  deleteApp(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AppImageConfig.
   */
  deleteAppImageConfig(params: SageMaker.Types.DeleteAppImageConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an AppImageConfig.
   */
  deleteAppImageConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an artifact. Either ArtifactArn or Source must be specified.
   */
  deleteArtifact(params: SageMaker.Types.DeleteArtifactRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteArtifactResponse) => void): Request<SageMaker.Types.DeleteArtifactResponse, AWSError>;
  /**
   * Deletes an artifact. Either ArtifactArn or Source must be specified.
   */
  deleteArtifact(callback?: (err: AWSError, data: SageMaker.Types.DeleteArtifactResponse) => void): Request<SageMaker.Types.DeleteArtifactResponse, AWSError>;
  /**
   * Deletes an association.
   */
  deleteAssociation(params: SageMaker.Types.DeleteAssociationRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteAssociationResponse) => void): Request<SageMaker.Types.DeleteAssociationResponse, AWSError>;
  /**
   * Deletes an association.
   */
  deleteAssociation(callback?: (err: AWSError, data: SageMaker.Types.DeleteAssociationResponse) => void): Request<SageMaker.Types.DeleteAssociationResponse, AWSError>;
  /**
   * Deletes the specified Git repository from your account.
   */
  deleteCodeRepository(params: SageMaker.Types.DeleteCodeRepositoryInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified Git repository from your account.
   */
  deleteCodeRepository(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an context.
   */
  deleteContext(params: SageMaker.Types.DeleteContextRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteContextResponse) => void): Request<SageMaker.Types.DeleteContextResponse, AWSError>;
  /**
   * Deletes an context.
   */
  deleteContext(callback?: (err: AWSError, data: SageMaker.Types.DeleteContextResponse) => void): Request<SageMaker.Types.DeleteContextResponse, AWSError>;
  /**
   * Deletes a data quality monitoring job definition.
   */
  deleteDataQualityJobDefinition(params: SageMaker.Types.DeleteDataQualityJobDefinitionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a data quality monitoring job definition.
   */
  deleteDataQualityJobDefinition(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a fleet.
   */
  deleteDeviceFleet(params: SageMaker.Types.DeleteDeviceFleetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a fleet.
   */
  deleteDeviceFleet(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Used to delete a domain. If you onboarded with IAM mode, you will need to delete your domain to onboard again using SSO. Use with caution. All of the members of the domain will lose access to their EFS volume, including data, notebooks, and other artifacts. 
   */
  deleteDomain(params: SageMaker.Types.DeleteDomainRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Used to delete a domain. If you onboarded with IAM mode, you will need to delete your domain to onboard again using SSO. Use with caution. All of the members of the domain will lose access to their EFS volume, including data, notebooks, and other artifacts. 
   */
  deleteDomain(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an endpoint. Amazon SageMaker frees up all of the resources that were deployed when the endpoint was created.  Amazon SageMaker retires any custom KMS key grants associated with the endpoint, meaning you don't need to use the RevokeGrant API call.
   */
  deleteEndpoint(params: SageMaker.Types.DeleteEndpointInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an endpoint. Amazon SageMaker frees up all of the resources that were deployed when the endpoint was created.  Amazon SageMaker retires any custom KMS key grants associated with the endpoint, meaning you don't need to use the RevokeGrant API call.
   */
  deleteEndpoint(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an endpoint configuration. The DeleteEndpointConfig API deletes only the specified configuration. It does not delete endpoints created using the configuration.  You must not delete an EndpointConfig in use by an endpoint that is live or while the UpdateEndpoint or CreateEndpoint operations are being performed on the endpoint. If you delete the EndpointConfig of an endpoint that is active or being created or updated you may lose visibility into the instance type the endpoint is using. The endpoint must be deleted in order to stop incurring charges.
   */
  deleteEndpointConfig(params: SageMaker.Types.DeleteEndpointConfigInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an endpoint configuration. The DeleteEndpointConfig API deletes only the specified configuration. It does not delete endpoints created using the configuration.  You must not delete an EndpointConfig in use by an endpoint that is live or while the UpdateEndpoint or CreateEndpoint operations are being performed on the endpoint. If you delete the EndpointConfig of an endpoint that is active or being created or updated you may lose visibility into the instance type the endpoint is using. The endpoint must be deleted in order to stop incurring charges.
   */
  deleteEndpointConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an SageMaker experiment. All trials associated with the experiment must be deleted first. Use the ListTrials API to get a list of the trials associated with the experiment.
   */
  deleteExperiment(params: SageMaker.Types.DeleteExperimentRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteExperimentResponse) => void): Request<SageMaker.Types.DeleteExperimentResponse, AWSError>;
  /**
   * Deletes an SageMaker experiment. All trials associated with the experiment must be deleted first. Use the ListTrials API to get a list of the trials associated with the experiment.
   */
  deleteExperiment(callback?: (err: AWSError, data: SageMaker.Types.DeleteExperimentResponse) => void): Request<SageMaker.Types.DeleteExperimentResponse, AWSError>;
  /**
   * Delete the FeatureGroup and any data that was written to the OnlineStore of the FeatureGroup. Data cannot be accessed from the OnlineStore immediately after DeleteFeatureGroup is called.  Data written into the OfflineStore will not be deleted. The Amazon Web Services Glue database and tables that are automatically created for your OfflineStore are not deleted. 
   */
  deleteFeatureGroup(params: SageMaker.Types.DeleteFeatureGroupRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete the FeatureGroup and any data that was written to the OnlineStore of the FeatureGroup. Data cannot be accessed from the OnlineStore immediately after DeleteFeatureGroup is called.  Data written into the OfflineStore will not be deleted. The Amazon Web Services Glue database and tables that are automatically created for your OfflineStore are not deleted. 
   */
  deleteFeatureGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified flow definition.
   */
  deleteFlowDefinition(params: SageMaker.Types.DeleteFlowDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteFlowDefinitionResponse) => void): Request<SageMaker.Types.DeleteFlowDefinitionResponse, AWSError>;
  /**
   * Deletes the specified flow definition.
   */
  deleteFlowDefinition(callback?: (err: AWSError, data: SageMaker.Types.DeleteFlowDefinitionResponse) => void): Request<SageMaker.Types.DeleteFlowDefinitionResponse, AWSError>;
  /**
   * Use this operation to delete a human task user interface (worker task template).  To see a list of human task user interfaces (work task templates) in your account, use . When you delete a worker task template, it no longer appears when you call ListHumanTaskUis.
   */
  deleteHumanTaskUi(params: SageMaker.Types.DeleteHumanTaskUiRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteHumanTaskUiResponse) => void): Request<SageMaker.Types.DeleteHumanTaskUiResponse, AWSError>;
  /**
   * Use this operation to delete a human task user interface (worker task template).  To see a list of human task user interfaces (work task templates) in your account, use . When you delete a worker task template, it no longer appears when you call ListHumanTaskUis.
   */
  deleteHumanTaskUi(callback?: (err: AWSError, data: SageMaker.Types.DeleteHumanTaskUiResponse) => void): Request<SageMaker.Types.DeleteHumanTaskUiResponse, AWSError>;
  /**
   * Deletes a SageMaker image and all versions of the image. The container images aren't deleted.
   */
  deleteImage(params: SageMaker.Types.DeleteImageRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteImageResponse) => void): Request<SageMaker.Types.DeleteImageResponse, AWSError>;
  /**
   * Deletes a SageMaker image and all versions of the image. The container images aren't deleted.
   */
  deleteImage(callback?: (err: AWSError, data: SageMaker.Types.DeleteImageResponse) => void): Request<SageMaker.Types.DeleteImageResponse, AWSError>;
  /**
   * Deletes a version of a SageMaker image. The container image the version represents isn't deleted.
   */
  deleteImageVersion(params: SageMaker.Types.DeleteImageVersionRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteImageVersionResponse) => void): Request<SageMaker.Types.DeleteImageVersionResponse, AWSError>;
  /**
   * Deletes a version of a SageMaker image. The container image the version represents isn't deleted.
   */
  deleteImageVersion(callback?: (err: AWSError, data: SageMaker.Types.DeleteImageVersionResponse) => void): Request<SageMaker.Types.DeleteImageVersionResponse, AWSError>;
  /**
   * Deletes a model. The DeleteModel API deletes only the model entry that was created in Amazon SageMaker when you called the CreateModel API. It does not delete model artifacts, inference code, or the IAM role that you specified when creating the model. 
   */
  deleteModel(params: SageMaker.Types.DeleteModelInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a model. The DeleteModel API deletes only the model entry that was created in Amazon SageMaker when you called the CreateModel API. It does not delete model artifacts, inference code, or the IAM role that you specified when creating the model. 
   */
  deleteModel(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon SageMaker model bias job definition.
   */
  deleteModelBiasJobDefinition(params: SageMaker.Types.DeleteModelBiasJobDefinitionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon SageMaker model bias job definition.
   */
  deleteModelBiasJobDefinition(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon SageMaker model explainability job definition.
   */
  deleteModelExplainabilityJobDefinition(params: SageMaker.Types.DeleteModelExplainabilityJobDefinitionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an Amazon SageMaker model explainability job definition.
   */
  deleteModelExplainabilityJobDefinition(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a model package. A model package is used to create Amazon SageMaker models or list on Amazon Web Services Marketplace. Buyers can subscribe to model packages listed on Amazon Web Services Marketplace to create models in Amazon SageMaker.
   */
  deleteModelPackage(params: SageMaker.Types.DeleteModelPackageInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a model package. A model package is used to create Amazon SageMaker models or list on Amazon Web Services Marketplace. Buyers can subscribe to model packages listed on Amazon Web Services Marketplace to create models in Amazon SageMaker.
   */
  deleteModelPackage(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified model group.
   */
  deleteModelPackageGroup(params: SageMaker.Types.DeleteModelPackageGroupInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified model group.
   */
  deleteModelPackageGroup(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a model group resource policy.
   */
  deleteModelPackageGroupPolicy(params: SageMaker.Types.DeleteModelPackageGroupPolicyInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a model group resource policy.
   */
  deleteModelPackageGroupPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the secified model quality monitoring job definition.
   */
  deleteModelQualityJobDefinition(params: SageMaker.Types.DeleteModelQualityJobDefinitionRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the secified model quality monitoring job definition.
   */
  deleteModelQualityJobDefinition(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a monitoring schedule. Also stops the schedule had not already been stopped. This does not delete the job execution history of the monitoring schedule. 
   */
  deleteMonitoringSchedule(params: SageMaker.Types.DeleteMonitoringScheduleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a monitoring schedule. Also stops the schedule had not already been stopped. This does not delete the job execution history of the monitoring schedule. 
   */
  deleteMonitoringSchedule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Deletes an Amazon SageMaker notebook instance. Before you can delete a notebook instance, you must call the StopNotebookInstance API.   When you delete a notebook instance, you lose all of your data. Amazon SageMaker removes the ML compute instance, and deletes the ML storage volume and the network interface associated with the notebook instance.  
   */
  deleteNotebookInstance(params: SageMaker.Types.DeleteNotebookInstanceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  Deletes an Amazon SageMaker notebook instance. Before you can delete a notebook instance, you must call the StopNotebookInstance API.   When you delete a notebook instance, you lose all of your data. Amazon SageMaker removes the ML compute instance, and deletes the ML storage volume and the network interface associated with the notebook instance.  
   */
  deleteNotebookInstance(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a notebook instance lifecycle configuration.
   */
  deleteNotebookInstanceLifecycleConfig(params: SageMaker.Types.DeleteNotebookInstanceLifecycleConfigInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a notebook instance lifecycle configuration.
   */
  deleteNotebookInstanceLifecycleConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a pipeline if there are no running instances of the pipeline. To delete a pipeline, you must stop all running instances of the pipeline using the StopPipelineExecution API. When you delete a pipeline, all instances of the pipeline are deleted.
   */
  deletePipeline(params: SageMaker.Types.DeletePipelineRequest, callback?: (err: AWSError, data: SageMaker.Types.DeletePipelineResponse) => void): Request<SageMaker.Types.DeletePipelineResponse, AWSError>;
  /**
   * Deletes a pipeline if there are no running instances of the pipeline. To delete a pipeline, you must stop all running instances of the pipeline using the StopPipelineExecution API. When you delete a pipeline, all instances of the pipeline are deleted.
   */
  deletePipeline(callback?: (err: AWSError, data: SageMaker.Types.DeletePipelineResponse) => void): Request<SageMaker.Types.DeletePipelineResponse, AWSError>;
  /**
   * Delete the specified project.
   */
  deleteProject(params: SageMaker.Types.DeleteProjectInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete the specified project.
   */
  deleteProject(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the Studio Lifecycle Configuration. In order to delete the Lifecycle Configuration, there must be no running apps using the Lifecycle Configuration. You must also remove the Lifecycle Configuration from UserSettings in all Domains and UserProfiles.
   */
  deleteStudioLifecycleConfig(params: SageMaker.Types.DeleteStudioLifecycleConfigRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the Studio Lifecycle Configuration. In order to delete the Lifecycle Configuration, there must be no running apps using the Lifecycle Configuration. You must also remove the Lifecycle Configuration from UserSettings in all Domains and UserProfiles.
   */
  deleteStudioLifecycleConfig(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified tags from an Amazon SageMaker resource. To list a resource's tags, use the ListTags API.   When you call this API to delete tags from a hyperparameter tuning job, the deleted tags are not removed from training jobs that the hyperparameter tuning job launched before you called this API.   When you call this API to delete tags from a SageMaker Studio Domain or User Profile, the deleted tags are not removed from Apps that the SageMaker Studio Domain or User Profile launched before you called this API. 
   */
  deleteTags(params: SageMaker.Types.DeleteTagsInput, callback?: (err: AWSError, data: SageMaker.Types.DeleteTagsOutput) => void): Request<SageMaker.Types.DeleteTagsOutput, AWSError>;
  /**
   * Deletes the specified tags from an Amazon SageMaker resource. To list a resource's tags, use the ListTags API.   When you call this API to delete tags from a hyperparameter tuning job, the deleted tags are not removed from training jobs that the hyperparameter tuning job launched before you called this API.   When you call this API to delete tags from a SageMaker Studio Domain or User Profile, the deleted tags are not removed from Apps that the SageMaker Studio Domain or User Profile launched before you called this API. 
   */
  deleteTags(callback?: (err: AWSError, data: SageMaker.Types.DeleteTagsOutput) => void): Request<SageMaker.Types.DeleteTagsOutput, AWSError>;
  /**
   * Deletes the specified trial. All trial components that make up the trial must be deleted first. Use the DescribeTrialComponent API to get the list of trial components.
   */
  deleteTrial(params: SageMaker.Types.DeleteTrialRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteTrialResponse) => void): Request<SageMaker.Types.DeleteTrialResponse, AWSError>;
  /**
   * Deletes the specified trial. All trial components that make up the trial must be deleted first. Use the DescribeTrialComponent API to get the list of trial components.
   */
  deleteTrial(callback?: (err: AWSError, data: SageMaker.Types.DeleteTrialResponse) => void): Request<SageMaker.Types.DeleteTrialResponse, AWSError>;
  /**
   * Deletes the specified trial component. A trial component must be disassociated from all trials before the trial component can be deleted. To disassociate a trial component from a trial, call the DisassociateTrialComponent API.
   */
  deleteTrialComponent(params: SageMaker.Types.DeleteTrialComponentRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteTrialComponentResponse) => void): Request<SageMaker.Types.DeleteTrialComponentResponse, AWSError>;
  /**
   * Deletes the specified trial component. A trial component must be disassociated from all trials before the trial component can be deleted. To disassociate a trial component from a trial, call the DisassociateTrialComponent API.
   */
  deleteTrialComponent(callback?: (err: AWSError, data: SageMaker.Types.DeleteTrialComponentResponse) => void): Request<SageMaker.Types.DeleteTrialComponentResponse, AWSError>;
  /**
   * Deletes a user profile. When a user profile is deleted, the user loses access to their EFS volume, including data, notebooks, and other artifacts.
   */
  deleteUserProfile(params: SageMaker.Types.DeleteUserProfileRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a user profile. When a user profile is deleted, the user loses access to their EFS volume, including data, notebooks, and other artifacts.
   */
  deleteUserProfile(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Use this operation to delete a workforce. If you want to create a new workforce in an Amazon Web Services Region where a workforce already exists, use this operation to delete the existing workforce and then use to create a new workforce.  If a private workforce contains one or more work teams, you must use the operation to delete all work teams before you delete the workforce. If you try to delete a workforce that contains one or more work teams, you will recieve a ResourceInUse error. 
   */
  deleteWorkforce(params: SageMaker.Types.DeleteWorkforceRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteWorkforceResponse) => void): Request<SageMaker.Types.DeleteWorkforceResponse, AWSError>;
  /**
   * Use this operation to delete a workforce. If you want to create a new workforce in an Amazon Web Services Region where a workforce already exists, use this operation to delete the existing workforce and then use to create a new workforce.  If a private workforce contains one or more work teams, you must use the operation to delete all work teams before you delete the workforce. If you try to delete a workforce that contains one or more work teams, you will recieve a ResourceInUse error. 
   */
  deleteWorkforce(callback?: (err: AWSError, data: SageMaker.Types.DeleteWorkforceResponse) => void): Request<SageMaker.Types.DeleteWorkforceResponse, AWSError>;
  /**
   * Deletes an existing work team. This operation can't be undone.
   */
  deleteWorkteam(params: SageMaker.Types.DeleteWorkteamRequest, callback?: (err: AWSError, data: SageMaker.Types.DeleteWorkteamResponse) => void): Request<SageMaker.Types.DeleteWorkteamResponse, AWSError>;
  /**
   * Deletes an existing work team. This operation can't be undone.
   */
  deleteWorkteam(callback?: (err: AWSError, data: SageMaker.Types.DeleteWorkteamResponse) => void): Request<SageMaker.Types.DeleteWorkteamResponse, AWSError>;
  /**
   * Deregisters the specified devices. After you deregister a device, you will need to re-register the devices.
   */
  deregisterDevices(params: SageMaker.Types.DeregisterDevicesRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deregisters the specified devices. After you deregister a device, you will need to re-register the devices.
   */
  deregisterDevices(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Describes an action.
   */
  describeAction(params: SageMaker.Types.DescribeActionRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeActionResponse) => void): Request<SageMaker.Types.DescribeActionResponse, AWSError>;
  /**
   * Describes an action.
   */
  describeAction(callback?: (err: AWSError, data: SageMaker.Types.DescribeActionResponse) => void): Request<SageMaker.Types.DescribeActionResponse, AWSError>;
  /**
   * Returns a description of the specified algorithm that is in your account.
   */
  describeAlgorithm(params: SageMaker.Types.DescribeAlgorithmInput, callback?: (err: AWSError, data: SageMaker.Types.DescribeAlgorithmOutput) => void): Request<SageMaker.Types.DescribeAlgorithmOutput, AWSError>;
  /**
   * Returns a description of the specified algorithm that is in your account.
   */
  describeAlgorithm(callback?: (err: AWSError, data: SageMaker.Types.DescribeAlgorithmOutput) => void): Request<SageMaker.Types.DescribeAlgorithmOutput, AWSError>;
  /**
   * Describes the app.
   */
  describeApp(params: SageMaker.Types.DescribeAppRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeAppResponse) => void): Request<SageMaker.Types.DescribeAppResponse, AWSError>;
  /**
   * Describes the app.
   */
  describeApp(callback?: (err: AWSError, data: SageMaker.Types.DescribeAppResponse) => void): Request<SageMaker.Types.DescribeAppResponse, AWSError>;
  /**
   * Describes an AppImageConfig.
   */
  describeAppImageConfig(params: SageMaker.Types.DescribeAppImageConfigRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeAppImageConfigResponse) => void): Request<SageMaker.Types.DescribeAppImageConfigResponse, AWSError>;
  /**
   * Describes an AppImageConfig.
   */
  describeAppImageConfig(callback?: (err: AWSError, data: SageMaker.Types.DescribeAppImageConfigResponse) => void): Request<SageMaker.Types.DescribeAppImageConfigResponse, AWSError>;
  /**
   * Describes an artifact.
   */
  describeArtifact(params: SageMaker.Types.DescribeArtifactRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeArtifactResponse) => void): Request<SageMaker.Types.DescribeArtifactResponse, AWSError>;
  /**
   * Describes an artifact.
   */
  describeArtifact(callback?: (err: AWSError, data: SageMaker.Types.DescribeArtifactResponse) => void): Request<SageMaker.Types.DescribeArtifactResponse, AWSError>;
  /**
   * Returns information about an Amazon SageMaker AutoML job.
   */
  describeAutoMLJob(params: SageMaker.Types.DescribeAutoMLJobRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeAutoMLJobResponse) => void): Request<SageMaker.Types.DescribeAutoMLJobResponse, AWSError>;
  /**
   * Returns information about an Amazon SageMaker AutoML job.
   */
  describeAutoMLJob(callback?: (err: AWSError, data: SageMaker.Types.DescribeAutoMLJobResponse) => void): Request<SageMaker.Types.DescribeAutoMLJobResponse, AWSError>;
  /**
   * Gets details about the specified Git repository.
   */
  describeCodeRepository(params: SageMaker.Types.DescribeCodeRepositoryInput, callback?: (err: AWSError, data: SageMaker.Types.DescribeCodeRepositoryOutput) => void): Request<SageMaker.Types.DescribeCodeRepositoryOutput, AWSError>;
  /**
   * Gets details about the specified Git repository.
   */
  describeCodeRepository(callback?: (err: AWSError, data: SageMaker.Types.DescribeCodeRepositoryOutput) => void): Request<SageMaker.Types.DescribeCodeRepositoryOutput, AWSError>;
  /**
   * Returns information about a model compilation job. To create a model compilation job, use CreateCompilationJob. To get information about multiple model compilation jobs, use ListCompilationJobs.
   */
  describeCompilationJob(params: SageMaker.Types.DescribeCompilationJobRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeCompilationJobResponse) => void): Request<SageMaker.Types.DescribeCompilationJobResponse, AWSError>;
  /**
   * Returns information about a model compilation job. To create a model compilation job, use CreateCompilationJob. To get information about multiple model compilation jobs, use ListCompilationJobs.
   */
  describeCompilationJob(callback?: (err: AWSError, data: SageMaker.Types.DescribeCompilationJobResponse) => void): Request<SageMaker.Types.DescribeCompilationJobResponse, AWSError>;
  /**
   * Describes a context.
   */
  describeContext(params: SageMaker.Types.DescribeContextRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeContextResponse) => void): Request<SageMaker.Types.DescribeContextResponse, AWSError>;
  /**
   * Describes a context.
   */
  describeContext(callback?: (err: AWSError, data: SageMaker.Types.DescribeContextResponse) => void): Request<SageMaker.Types.DescribeContextResponse, AWSError>;
  /**
   * Gets the details of a data quality monitoring job definition.
   */
  describeDataQualityJobDefinition(params: SageMaker.Types.DescribeDataQualityJobDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeDataQualityJobDefinitionResponse) => void): Request<SageMaker.Types.DescribeDataQualityJobDefinitionResponse, AWSError>;
  /**
   * Gets the details of a data quality monitoring job definition.
   */
  describeDataQualityJobDefinition(callback?: (err: AWSError, data: SageMaker.Types.DescribeDataQualityJobDefinitionResponse) => void): Request<SageMaker.Types.DescribeDataQualityJobDefinitionResponse, AWSError>;
  /**
   * Describes the device.
   */
  describeDevice(params: SageMaker.Types.DescribeDeviceRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeDeviceResponse) => void): Request<SageMaker.Types.DescribeDeviceResponse, AWSError>;
  /**
   * Describes the device.
   */
  describeDevice(callback?: (err: AWSError, data: SageMaker.Types.DescribeDeviceResponse) => void): Request<SageMaker.Types.DescribeDeviceResponse, AWSError>;
  /**
   * A description of the fleet the device belongs to.
   */
  describeDeviceFleet(params: SageMaker.Types.DescribeDeviceFleetRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeDeviceFleetResponse) => void): Request<SageMaker.Types.DescribeDeviceFleetResponse, AWSError>;
  /**
   * A description of the fleet the device belongs to.
   */
  describeDeviceFleet(callback?: (err: AWSError, data: SageMaker.Types.DescribeDeviceFleetResponse) => void): Request<SageMaker.Types.DescribeDeviceFleetResponse, AWSError>;
  /**
   * The description of the domain.
   */
  describeDomain(params: SageMaker.Types.DescribeDomainRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeDomainResponse) => void): Request<SageMaker.Types.DescribeDomainResponse, AWSError>;
  /**
   * The description of the domain.
   */
  describeDomain(callback?: (err: AWSError, data: SageMaker.Types.DescribeDomainResponse) => void): Request<SageMaker.Types.DescribeDomainResponse, AWSError>;
  /**
   * A description of edge packaging jobs.
   */
  describeEdgePackagingJob(params: SageMaker.Types.DescribeEdgePackagingJobRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeEdgePackagingJobResponse) => void): Request<SageMaker.Types.DescribeEdgePackagingJobResponse, AWSError>;
  /**
   * A description of edge packaging jobs.
   */
  describeEdgePackagingJob(callback?: (err: AWSError, data: SageMaker.Types.DescribeEdgePackagingJobResponse) => void): Request<SageMaker.Types.DescribeEdgePackagingJobResponse, AWSError>;
  /**
   * Returns the description of an endpoint.
   */
  describeEndpoint(params: SageMaker.Types.DescribeEndpointInput, callback?: (err: AWSError, data: SageMaker.Types.DescribeEndpointOutput) => void): Request<SageMaker.Types.DescribeEndpointOutput, AWSError>;
  /**
   * Returns the description of an endpoint.
   */
  describeEndpoint(callback?: (err: AWSError, data: SageMaker.Types.DescribeEndpointOutput) => void): Request<SageMaker.Types.DescribeEndpointOutput, AWSError>;
  /**
   * Returns the description of an endpoint configuration created using the CreateEndpointConfig API.
   */
  describeEndpointConfig(params: SageMaker.Types.DescribeEndpointConfigInput, callback?: (err: AWSError, data: SageMaker.Types.DescribeEndpointConfigOutput) => void): Request<SageMaker.Types.DescribeEndpointConfigOutput, AWSError>;
  /**
   * Returns the description of an endpoint configuration created using the CreateEndpointConfig API.
   */
  describeEndpointConfig(callback?: (err: AWSError, data: SageMaker.Types.DescribeEndpointConfigOutput) => void): Request<SageMaker.Types.DescribeEndpointConfigOutput, AWSError>;
  /**
   * Provides a list of an experiment's properties.
   */
  describeExperiment(params: SageMaker.Types.DescribeExperimentRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeExperimentResponse) => void): Request<SageMaker.Types.DescribeExperimentResponse, AWSError>;
  /**
   * Provides a list of an experiment's properties.
   */
  describeExperiment(callback?: (err: AWSError, data: SageMaker.Types.DescribeExperimentResponse) => void): Request<SageMaker.Types.DescribeExperimentResponse, AWSError>;
  /**
   * Use this operation to describe a FeatureGroup. The response includes information on the creation time, FeatureGroup name, the unique identifier for each FeatureGroup, and more.
   */
  describeFeatureGroup(params: SageMaker.Types.DescribeFeatureGroupRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeFeatureGroupResponse) => void): Request<SageMaker.Types.DescribeFeatureGroupResponse, AWSError>;
  /**
   * Use this operation to describe a FeatureGroup. The response includes information on the creation time, FeatureGroup name, the unique identifier for each FeatureGroup, and more.
   */
  describeFeatureGroup(callback?: (err: AWSError, data: SageMaker.Types.DescribeFeatureGroupResponse) => void): Request<SageMaker.Types.DescribeFeatureGroupResponse, AWSError>;
  /**
   * Returns information about the specified flow definition.
   */
  describeFlowDefinition(params: SageMaker.Types.DescribeFlowDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeFlowDefinitionResponse) => void): Request<SageMaker.Types.DescribeFlowDefinitionResponse, AWSError>;
  /**
   * Returns information about the specified flow definition.
   */
  describeFlowDefinition(callback?: (err: AWSError, data: SageMaker.Types.DescribeFlowDefinitionResponse) => void): Request<SageMaker.Types.DescribeFlowDefinitionResponse, AWSError>;
  /**
   * Returns information about the requested human task user interface (worker task template).
   */
  describeHumanTaskUi(params: SageMaker.Types.DescribeHumanTaskUiRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeHumanTaskUiResponse) => void): Request<SageMaker.Types.DescribeHumanTaskUiResponse, AWSError>;
  /**
   * Returns information about the requested human task user interface (worker task template).
   */
  describeHumanTaskUi(callback?: (err: AWSError, data: SageMaker.Types.DescribeHumanTaskUiResponse) => void): Request<SageMaker.Types.DescribeHumanTaskUiResponse, AWSError>;
  /**
   * Gets a description of a hyperparameter tuning job.
   */
  describeHyperParameterTuningJob(params: SageMaker.Types.DescribeHyperParameterTuningJobRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeHyperParameterTuningJobResponse) => void): Request<SageMaker.Types.DescribeHyperParameterTuningJobResponse, AWSError>;
  /**
   * Gets a description of a hyperparameter tuning job.
   */
  describeHyperParameterTuningJob(callback?: (err: AWSError, data: SageMaker.Types.DescribeHyperParameterTuningJobResponse) => void): Request<SageMaker.Types.DescribeHyperParameterTuningJobResponse, AWSError>;
  /**
   * Describes a SageMaker image.
   */
  describeImage(params: SageMaker.Types.DescribeImageRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeImageResponse) => void): Request<SageMaker.Types.DescribeImageResponse, AWSError>;
  /**
   * Describes a SageMaker image.
   */
  describeImage(callback?: (err: AWSError, data: SageMaker.Types.DescribeImageResponse) => void): Request<SageMaker.Types.DescribeImageResponse, AWSError>;
  /**
   * Describes a version of a SageMaker image.
   */
  describeImageVersion(params: SageMaker.Types.DescribeImageVersionRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeImageVersionResponse) => void): Request<SageMaker.Types.DescribeImageVersionResponse, AWSError>;
  /**
   * Describes a version of a SageMaker image.
   */
  describeImageVersion(callback?: (err: AWSError, data: SageMaker.Types.DescribeImageVersionResponse) => void): Request<SageMaker.Types.DescribeImageVersionResponse, AWSError>;
  /**
   * Gets information about a labeling job.
   */
  describeLabelingJob(params: SageMaker.Types.DescribeLabelingJobRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeLabelingJobResponse) => void): Request<SageMaker.Types.DescribeLabelingJobResponse, AWSError>;
  /**
   * Gets information about a labeling job.
   */
  describeLabelingJob(callback?: (err: AWSError, data: SageMaker.Types.DescribeLabelingJobResponse) => void): Request<SageMaker.Types.DescribeLabelingJobResponse, AWSError>;
  /**
   * Describes a model that you created using the CreateModel API.
   */
  describeModel(params: SageMaker.Types.DescribeModelInput, callback?: (err: AWSError, data: SageMaker.Types.DescribeModelOutput) => void): Request<SageMaker.Types.DescribeModelOutput, AWSError>;
  /**
   * Describes a model that you created using the CreateModel API.
   */
  describeModel(callback?: (err: AWSError, data: SageMaker.Types.DescribeModelOutput) => void): Request<SageMaker.Types.DescribeModelOutput, AWSError>;
  /**
   * Returns a description of a model bias job definition.
   */
  describeModelBiasJobDefinition(params: SageMaker.Types.DescribeModelBiasJobDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeModelBiasJobDefinitionResponse) => void): Request<SageMaker.Types.DescribeModelBiasJobDefinitionResponse, AWSError>;
  /**
   * Returns a description of a model bias job definition.
   */
  describeModelBiasJobDefinition(callback?: (err: AWSError, data: SageMaker.Types.DescribeModelBiasJobDefinitionResponse) => void): Request<SageMaker.Types.DescribeModelBiasJobDefinitionResponse, AWSError>;
  /**
   * Returns a description of a model explainability job definition.
   */
  describeModelExplainabilityJobDefinition(params: SageMaker.Types.DescribeModelExplainabilityJobDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeModelExplainabilityJobDefinitionResponse) => void): Request<SageMaker.Types.DescribeModelExplainabilityJobDefinitionResponse, AWSError>;
  /**
   * Returns a description of a model explainability job definition.
   */
  describeModelExplainabilityJobDefinition(callback?: (err: AWSError, data: SageMaker.Types.DescribeModelExplainabilityJobDefinitionResponse) => void): Request<SageMaker.Types.DescribeModelExplainabilityJobDefinitionResponse, AWSError>;
  /**
   * Returns a description of the specified model package, which is used to create SageMaker models or list them on Amazon Web Services Marketplace. To create models in SageMaker, buyers can subscribe to model packages listed on Amazon Web Services Marketplace.
   */
  describeModelPackage(params: SageMaker.Types.DescribeModelPackageInput, callback?: (err: AWSError, data: SageMaker.Types.DescribeModelPackageOutput) => void): Request<SageMaker.Types.DescribeModelPackageOutput, AWSError>;
  /**
   * Returns a description of the specified model package, which is used to create SageMaker models or list them on Amazon Web Services Marketplace. To create models in SageMaker, buyers can subscribe to model packages listed on Amazon Web Services Marketplace.
   */
  describeModelPackage(callback?: (err: AWSError, data: SageMaker.Types.DescribeModelPackageOutput) => void): Request<SageMaker.Types.DescribeModelPackageOutput, AWSError>;
  /**
   * Gets a description for the specified model group.
   */
  describeModelPackageGroup(params: SageMaker.Types.DescribeModelPackageGroupInput, callback?: (err: AWSError, data: SageMaker.Types.DescribeModelPackageGroupOutput) => void): Request<SageMaker.Types.DescribeModelPackageGroupOutput, AWSError>;
  /**
   * Gets a description for the specified model group.
   */
  describeModelPackageGroup(callback?: (err: AWSError, data: SageMaker.Types.DescribeModelPackageGroupOutput) => void): Request<SageMaker.Types.DescribeModelPackageGroupOutput, AWSError>;
  /**
   * Returns a description of a model quality job definition.
   */
  describeModelQualityJobDefinition(params: SageMaker.Types.DescribeModelQualityJobDefinitionRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeModelQualityJobDefinitionResponse) => void): Request<SageMaker.Types.DescribeModelQualityJobDefinitionResponse, AWSError>;
  /**
   * Returns a description of a model quality job definition.
   */
  describeModelQualityJobDefinition(callback?: (err: AWSError, data: SageMaker.Types.DescribeModelQualityJobDefinitionResponse) => void): Request<SageMaker.Types.DescribeModelQualityJobDefinitionResponse, AWSError>;
  /**
   * Describes the schedule for a monitoring job.
   */
  describeMonitoringSchedule(params: SageMaker.Types.DescribeMonitoringScheduleRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeMonitoringScheduleResponse) => void): Request<SageMaker.Types.DescribeMonitoringScheduleResponse, AWSError>;
  /**
   * Describes the schedule for a monitoring job.
   */
  describeMonitoringSchedule(callback?: (err: AWSError, data: SageMaker.Types.DescribeMonitoringScheduleResponse) => void): Request<SageMaker.Types.DescribeMonitoringScheduleResponse, AWSError>;
  /**
   * Returns information about a notebook instance.
   */
  describeNotebookInstance(params: SageMaker.Types.DescribeNotebookInstanceInput, callback?: (err: AWSError, data: SageMaker.Types.DescribeNotebookInstanceOutput) => void): Request<SageMaker.Types.DescribeNotebookInstanceOutput, AWSError>;
  /**
   * Returns information about a notebook instance.
   */
  describeNotebookInstance(callback?: (err: AWSError, data: SageMaker.Types.DescribeNotebookInstanceOutput) => void): Request<SageMaker.Types.DescribeNotebookInstanceOutput, AWSError>;
  /**
   * Returns a description of a notebook instance lifecycle configuration. For information about notebook instance lifestyle configurations, see Step 2.1: (Optional) Customize a Notebook Instance.
   */
  describeNotebookInstanceLifecycleConfig(params: SageMaker.Types.DescribeNotebookInstanceLifecycleConfigInput, callback?: (err: AWSError, data: SageMaker.Types.DescribeNotebookInstanceLifecycleConfigOutput) => void): Request<SageMaker.Types.DescribeNotebookInstanceLifecycleConfigOutput, AWSError>;
  /**
   * Returns a description of a notebook instance lifecycle configuration. For information about notebook instance lifestyle configurations, see Step 2.1: (Optional) Customize a Notebook Instance.
   */
  describeNotebookInstanceLifecycleConfig(callback?: (err: AWSError, data: SageMaker.Types.DescribeNotebookInstanceLifecycleConfigOutput) => void): Request<SageMaker.Types.DescribeNotebookInstanceLifecycleConfigOutput, AWSError>;
  /**
   * Describes the details of a pipeline.
   */
  describePipeline(params: SageMaker.Types.DescribePipelineRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribePipelineResponse) => void): Request<SageMaker.Types.DescribePipelineResponse, AWSError>;
  /**
   * Describes the details of a pipeline.
   */
  describePipeline(callback?: (err: AWSError, data: SageMaker.Types.DescribePipelineResponse) => void): Request<SageMaker.Types.DescribePipelineResponse, AWSError>;
  /**
   * Describes the details of an execution's pipeline definition.
   */
  describePipelineDefinitionForExecution(params: SageMaker.Types.DescribePipelineDefinitionForExecutionRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribePipelineDefinitionForExecutionResponse) => void): Request<SageMaker.Types.DescribePipelineDefinitionForExecutionResponse, AWSError>;
  /**
   * Describes the details of an execution's pipeline definition.
   */
  describePipelineDefinitionForExecution(callback?: (err: AWSError, data: SageMaker.Types.DescribePipelineDefinitionForExecutionResponse) => void): Request<SageMaker.Types.DescribePipelineDefinitionForExecutionResponse, AWSError>;
  /**
   * Describes the details of a pipeline execution.
   */
  describePipelineExecution(params: SageMaker.Types.DescribePipelineExecutionRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribePipelineExecutionResponse) => void): Request<SageMaker.Types.DescribePipelineExecutionResponse, AWSError>;
  /**
   * Describes the details of a pipeline execution.
   */
  describePipelineExecution(callback?: (err: AWSError, data: SageMaker.Types.DescribePipelineExecutionResponse) => void): Request<SageMaker.Types.DescribePipelineExecutionResponse, AWSError>;
  /**
   * Returns a description of a processing job.
   */
  describeProcessingJob(params: SageMaker.Types.DescribeProcessingJobRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeProcessingJobResponse) => void): Request<SageMaker.Types.DescribeProcessingJobResponse, AWSError>;
  /**
   * Returns a description of a processing job.
   */
  describeProcessingJob(callback?: (err: AWSError, data: SageMaker.Types.DescribeProcessingJobResponse) => void): Request<SageMaker.Types.DescribeProcessingJobResponse, AWSError>;
  /**
   * Describes the details of a project.
   */
  describeProject(params: SageMaker.Types.DescribeProjectInput, callback?: (err: AWSError, data: SageMaker.Types.DescribeProjectOutput) => void): Request<SageMaker.Types.DescribeProjectOutput, AWSError>;
  /**
   * Describes the details of a project.
   */
  describeProject(callback?: (err: AWSError, data: SageMaker.Types.DescribeProjectOutput) => void): Request<SageMaker.Types.DescribeProjectOutput, AWSError>;
  /**
   * Describes the Studio Lifecycle Configuration.
   */
  describeStudioLifecycleConfig(params: SageMaker.Types.DescribeStudioLifecycleConfigRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeStudioLifecycleConfigResponse) => void): Request<SageMaker.Types.DescribeStudioLifecycleConfigResponse, AWSError>;
  /**
   * Describes the Studio Lifecycle Configuration.
   */
  describeStudioLifecycleConfig(callback?: (err: AWSError, data: SageMaker.Types.DescribeStudioLifecycleConfigResponse) => void): Request<SageMaker.Types.DescribeStudioLifecycleConfigResponse, AWSError>;
  /**
   * Gets information about a work team provided by a vendor. It returns details about the subscription with a vendor in the Amazon Web Services Marketplace.
   */
  describeSubscribedWorkteam(params: SageMaker.Types.DescribeSubscribedWorkteamRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeSubscribedWorkteamResponse) => void): Request<SageMaker.Types.DescribeSubscribedWorkteamResponse, AWSError>;
  /**
   * Gets information about a work team provided by a vendor. It returns details about the subscription with a vendor in the Amazon Web Services Marketplace.
   */
  describeSubscribedWorkteam(callback?: (err: AWSError, data: SageMaker.Types.DescribeSubscribedWorkteamResponse) => void): Request<SageMaker.Types.DescribeSubscribedWorkteamResponse, AWSError>;
  /**
   * Returns information about a training job.  Some of the attributes below only appear if the training job successfully starts. If the training job fails, TrainingJobStatus is Failed and, depending on the FailureReason, attributes like TrainingStartTime, TrainingTimeInSeconds, TrainingEndTime, and BillableTimeInSeconds may not be present in the response.
   */
  describeTrainingJob(params: SageMaker.Types.DescribeTrainingJobRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeTrainingJobResponse) => void): Request<SageMaker.Types.DescribeTrainingJobResponse, AWSError>;
  /**
   * Returns information about a training job.  Some of the attributes below only appear if the training job successfully starts. If the training job fails, TrainingJobStatus is Failed and, depending on the FailureReason, attributes like TrainingStartTime, TrainingTimeInSeconds, TrainingEndTime, and BillableTimeInSeconds may not be present in the response.
   */
  describeTrainingJob(callback?: (err: AWSError, data: SageMaker.Types.DescribeTrainingJobResponse) => void): Request<SageMaker.Types.DescribeTrainingJobResponse, AWSError>;
  /**
   * Returns information about a transform job.
   */
  describeTransformJob(params: SageMaker.Types.DescribeTransformJobRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeTransformJobResponse) => void): Request<SageMaker.Types.DescribeTransformJobResponse, AWSError>;
  /**
   * Returns information about a transform job.
   */
  describeTransformJob(callback?: (err: AWSError, data: SageMaker.Types.DescribeTransformJobResponse) => void): Request<SageMaker.Types.DescribeTransformJobResponse, AWSError>;
  /**
   * Provides a list of a trial's properties.
   */
  describeTrial(params: SageMaker.Types.DescribeTrialRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeTrialResponse) => void): Request<SageMaker.Types.DescribeTrialResponse, AWSError>;
  /**
   * Provides a list of a trial's properties.
   */
  describeTrial(callback?: (err: AWSError, data: SageMaker.Types.DescribeTrialResponse) => void): Request<SageMaker.Types.DescribeTrialResponse, AWSError>;
  /**
   * Provides a list of a trials component's properties.
   */
  describeTrialComponent(params: SageMaker.Types.DescribeTrialComponentRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeTrialComponentResponse) => void): Request<SageMaker.Types.DescribeTrialComponentResponse, AWSError>;
  /**
   * Provides a list of a trials component's properties.
   */
  describeTrialComponent(callback?: (err: AWSError, data: SageMaker.Types.DescribeTrialComponentResponse) => void): Request<SageMaker.Types.DescribeTrialComponentResponse, AWSError>;
  /**
   * Describes a user profile. For more information, see CreateUserProfile.
   */
  describeUserProfile(params: SageMaker.Types.DescribeUserProfileRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeUserProfileResponse) => void): Request<SageMaker.Types.DescribeUserProfileResponse, AWSError>;
  /**
   * Describes a user profile. For more information, see CreateUserProfile.
   */
  describeUserProfile(callback?: (err: AWSError, data: SageMaker.Types.DescribeUserProfileResponse) => void): Request<SageMaker.Types.DescribeUserProfileResponse, AWSError>;
  /**
   * Lists private workforce information, including workforce name, Amazon Resource Name (ARN), and, if applicable, allowed IP address ranges (CIDRs). Allowable IP address ranges are the IP addresses that workers can use to access tasks.   This operation applies only to private workforces. 
   */
  describeWorkforce(params: SageMaker.Types.DescribeWorkforceRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeWorkforceResponse) => void): Request<SageMaker.Types.DescribeWorkforceResponse, AWSError>;
  /**
   * Lists private workforce information, including workforce name, Amazon Resource Name (ARN), and, if applicable, allowed IP address ranges (CIDRs). Allowable IP address ranges are the IP addresses that workers can use to access tasks.   This operation applies only to private workforces. 
   */
  describeWorkforce(callback?: (err: AWSError, data: SageMaker.Types.DescribeWorkforceResponse) => void): Request<SageMaker.Types.DescribeWorkforceResponse, AWSError>;
  /**
   * Gets information about a specific work team. You can see information such as the create date, the last updated date, membership information, and the work team's Amazon Resource Name (ARN).
   */
  describeWorkteam(params: SageMaker.Types.DescribeWorkteamRequest, callback?: (err: AWSError, data: SageMaker.Types.DescribeWorkteamResponse) => void): Request<SageMaker.Types.DescribeWorkteamResponse, AWSError>;
  /**
   * Gets information about a specific work team. You can see information such as the create date, the last updated date, membership information, and the work team's Amazon Resource Name (ARN).
   */
  describeWorkteam(callback?: (err: AWSError, data: SageMaker.Types.DescribeWorkteamResponse) => void): Request<SageMaker.Types.DescribeWorkteamResponse, AWSError>;
  /**
   * Disables using Service Catalog in SageMaker. Service Catalog is used to create SageMaker projects.
   */
  disableSagemakerServicecatalogPortfolio(params: SageMaker.Types.DisableSagemakerServicecatalogPortfolioInput, callback?: (err: AWSError, data: SageMaker.Types.DisableSagemakerServicecatalogPortfolioOutput) => void): Request<SageMaker.Types.DisableSagemakerServicecatalogPortfolioOutput, AWSError>;
  /**
   * Disables using Service Catalog in SageMaker. Service Catalog is used to create SageMaker projects.
   */
  disableSagemakerServicecatalogPortfolio(callback?: (err: AWSError, data: SageMaker.Types.DisableSagemakerServicecatalogPortfolioOutput) => void): Request<SageMaker.Types.DisableSagemakerServicecatalogPortfolioOutput, AWSError>;
  /**
   * Disassociates a trial component from a trial. This doesn't effect other trials the component is associated with. Before you can delete a component, you must disassociate the component from all trials it is associated with. To associate a trial component with a trial, call the AssociateTrialComponent API. To get a list of the trials a component is associated with, use the Search API. Specify ExperimentTrialComponent for the Resource parameter. The list appears in the response under Results.TrialComponent.Parents.
   */
  disassociateTrialComponent(params: SageMaker.Types.DisassociateTrialComponentRequest, callback?: (err: AWSError, data: SageMaker.Types.DisassociateTrialComponentResponse) => void): Request<SageMaker.Types.DisassociateTrialComponentResponse, AWSError>;
  /**
   * Disassociates a trial component from a trial. This doesn't effect other trials the component is associated with. Before you can delete a component, you must disassociate the component from all trials it is associated with. To associate a trial component with a trial, call the AssociateTrialComponent API. To get a list of the trials a component is associated with, use the Search API. Specify ExperimentTrialComponent for the Resource parameter. The list appears in the response under Results.TrialComponent.Parents.
   */
  disassociateTrialComponent(callback?: (err: AWSError, data: SageMaker.Types.DisassociateTrialComponentResponse) => void): Request<SageMaker.Types.DisassociateTrialComponentResponse, AWSError>;
  /**
   * Enables using Service Catalog in SageMaker. Service Catalog is used to create SageMaker projects.
   */
  enableSagemakerServicecatalogPortfolio(params: SageMaker.Types.EnableSagemakerServicecatalogPortfolioInput, callback?: (err: AWSError, data: SageMaker.Types.EnableSagemakerServicecatalogPortfolioOutput) => void): Request<SageMaker.Types.EnableSagemakerServicecatalogPortfolioOutput, AWSError>;
  /**
   * Enables using Service Catalog in SageMaker. Service Catalog is used to create SageMaker projects.
   */
  enableSagemakerServicecatalogPortfolio(callback?: (err: AWSError, data: SageMaker.Types.EnableSagemakerServicecatalogPortfolioOutput) => void): Request<SageMaker.Types.EnableSagemakerServicecatalogPortfolioOutput, AWSError>;
  /**
   * Describes a fleet.
   */
  getDeviceFleetReport(params: SageMaker.Types.GetDeviceFleetReportRequest, callback?: (err: AWSError, data: SageMaker.Types.GetDeviceFleetReportResponse) => void): Request<SageMaker.Types.GetDeviceFleetReportResponse, AWSError>;
  /**
   * Describes a fleet.
   */
  getDeviceFleetReport(callback?: (err: AWSError, data: SageMaker.Types.GetDeviceFleetReportResponse) => void): Request<SageMaker.Types.GetDeviceFleetReportResponse, AWSError>;
  /**
   * Gets a resource policy that manages access for a model group. For information about resource policies, see Identity-based policies and resource-based policies in the Amazon Web Services Identity and Access Management User Guide..
   */
  getModelPackageGroupPolicy(params: SageMaker.Types.GetModelPackageGroupPolicyInput, callback?: (err: AWSError, data: SageMaker.Types.GetModelPackageGroupPolicyOutput) => void): Request<SageMaker.Types.GetModelPackageGroupPolicyOutput, AWSError>;
  /**
   * Gets a resource policy that manages access for a model group. For information about resource policies, see Identity-based policies and resource-based policies in the Amazon Web Services Identity and Access Management User Guide..
   */
  getModelPackageGroupPolicy(callback?: (err: AWSError, data: SageMaker.Types.GetModelPackageGroupPolicyOutput) => void): Request<SageMaker.Types.GetModelPackageGroupPolicyOutput, AWSError>;
  /**
   * Gets the status of Service Catalog in SageMaker. Service Catalog is used to create SageMaker projects.
   */
  getSagemakerServicecatalogPortfolioStatus(params: SageMaker.Types.GetSagemakerServicecatalogPortfolioStatusInput, callback?: (err: AWSError, data: SageMaker.Types.GetSagemakerServicecatalogPortfolioStatusOutput) => void): Request<SageMaker.Types.GetSagemakerServicecatalogPortfolioStatusOutput, AWSError>;
  /**
   * Gets the status of Service Catalog in SageMaker. Service Catalog is used to create SageMaker projects.
   */
  getSagemakerServicecatalogPortfolioStatus(callback?: (err: AWSError, data: SageMaker.Types.GetSagemakerServicecatalogPortfolioStatusOutput) => void): Request<SageMaker.Types.GetSagemakerServicecatalogPortfolioStatusOutput, AWSError>;
  /**
   * An auto-complete API for the search functionality in the Amazon SageMaker console. It returns suggestions of possible matches for the property name to use in Search queries. Provides suggestions for HyperParameters, Tags, and Metrics.
   */
  getSearchSuggestions(params: SageMaker.Types.GetSearchSuggestionsRequest, callback?: (err: AWSError, data: SageMaker.Types.GetSearchSuggestionsResponse) => void): Request<SageMaker.Types.GetSearchSuggestionsResponse, AWSError>;
  /**
   * An auto-complete API for the search functionality in the Amazon SageMaker console. It returns suggestions of possible matches for the property name to use in Search queries. Provides suggestions for HyperParameters, Tags, and Metrics.
   */
  getSearchSuggestions(callback?: (err: AWSError, data: SageMaker.Types.GetSearchSuggestionsResponse) => void): Request<SageMaker.Types.GetSearchSuggestionsResponse, AWSError>;
  /**
   * Lists the actions in your account and their properties.
   */
  listActions(params: SageMaker.Types.ListActionsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListActionsResponse) => void): Request<SageMaker.Types.ListActionsResponse, AWSError>;
  /**
   * Lists the actions in your account and their properties.
   */
  listActions(callback?: (err: AWSError, data: SageMaker.Types.ListActionsResponse) => void): Request<SageMaker.Types.ListActionsResponse, AWSError>;
  /**
   * Lists the machine learning algorithms that have been created.
   */
  listAlgorithms(params: SageMaker.Types.ListAlgorithmsInput, callback?: (err: AWSError, data: SageMaker.Types.ListAlgorithmsOutput) => void): Request<SageMaker.Types.ListAlgorithmsOutput, AWSError>;
  /**
   * Lists the machine learning algorithms that have been created.
   */
  listAlgorithms(callback?: (err: AWSError, data: SageMaker.Types.ListAlgorithmsOutput) => void): Request<SageMaker.Types.ListAlgorithmsOutput, AWSError>;
  /**
   * Lists the AppImageConfigs in your account and their properties. The list can be filtered by creation time or modified time, and whether the AppImageConfig name contains a specified string.
   */
  listAppImageConfigs(params: SageMaker.Types.ListAppImageConfigsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListAppImageConfigsResponse) => void): Request<SageMaker.Types.ListAppImageConfigsResponse, AWSError>;
  /**
   * Lists the AppImageConfigs in your account and their properties. The list can be filtered by creation time or modified time, and whether the AppImageConfig name contains a specified string.
   */
  listAppImageConfigs(callback?: (err: AWSError, data: SageMaker.Types.ListAppImageConfigsResponse) => void): Request<SageMaker.Types.ListAppImageConfigsResponse, AWSError>;
  /**
   * Lists apps.
   */
  listApps(params: SageMaker.Types.ListAppsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListAppsResponse) => void): Request<SageMaker.Types.ListAppsResponse, AWSError>;
  /**
   * Lists apps.
   */
  listApps(callback?: (err: AWSError, data: SageMaker.Types.ListAppsResponse) => void): Request<SageMaker.Types.ListAppsResponse, AWSError>;
  /**
   * Lists the artifacts in your account and their properties.
   */
  listArtifacts(params: SageMaker.Types.ListArtifactsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListArtifactsResponse) => void): Request<SageMaker.Types.ListArtifactsResponse, AWSError>;
  /**
   * Lists the artifacts in your account and their properties.
   */
  listArtifacts(callback?: (err: AWSError, data: SageMaker.Types.ListArtifactsResponse) => void): Request<SageMaker.Types.ListArtifactsResponse, AWSError>;
  /**
   * Lists the associations in your account and their properties.
   */
  listAssociations(params: SageMaker.Types.ListAssociationsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListAssociationsResponse) => void): Request<SageMaker.Types.ListAssociationsResponse, AWSError>;
  /**
   * Lists the associations in your account and their properties.
   */
  listAssociations(callback?: (err: AWSError, data: SageMaker.Types.ListAssociationsResponse) => void): Request<SageMaker.Types.ListAssociationsResponse, AWSError>;
  /**
   * Request a list of jobs.
   */
  listAutoMLJobs(params: SageMaker.Types.ListAutoMLJobsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListAutoMLJobsResponse) => void): Request<SageMaker.Types.ListAutoMLJobsResponse, AWSError>;
  /**
   * Request a list of jobs.
   */
  listAutoMLJobs(callback?: (err: AWSError, data: SageMaker.Types.ListAutoMLJobsResponse) => void): Request<SageMaker.Types.ListAutoMLJobsResponse, AWSError>;
  /**
   * List the candidates created for the job.
   */
  listCandidatesForAutoMLJob(params: SageMaker.Types.ListCandidatesForAutoMLJobRequest, callback?: (err: AWSError, data: SageMaker.Types.ListCandidatesForAutoMLJobResponse) => void): Request<SageMaker.Types.ListCandidatesForAutoMLJobResponse, AWSError>;
  /**
   * List the candidates created for the job.
   */
  listCandidatesForAutoMLJob(callback?: (err: AWSError, data: SageMaker.Types.ListCandidatesForAutoMLJobResponse) => void): Request<SageMaker.Types.ListCandidatesForAutoMLJobResponse, AWSError>;
  /**
   * Gets a list of the Git repositories in your account.
   */
  listCodeRepositories(params: SageMaker.Types.ListCodeRepositoriesInput, callback?: (err: AWSError, data: SageMaker.Types.ListCodeRepositoriesOutput) => void): Request<SageMaker.Types.ListCodeRepositoriesOutput, AWSError>;
  /**
   * Gets a list of the Git repositories in your account.
   */
  listCodeRepositories(callback?: (err: AWSError, data: SageMaker.Types.ListCodeRepositoriesOutput) => void): Request<SageMaker.Types.ListCodeRepositoriesOutput, AWSError>;
  /**
   * Lists model compilation jobs that satisfy various filters. To create a model compilation job, use CreateCompilationJob. To get information about a particular model compilation job you have created, use DescribeCompilationJob.
   */
  listCompilationJobs(params: SageMaker.Types.ListCompilationJobsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListCompilationJobsResponse) => void): Request<SageMaker.Types.ListCompilationJobsResponse, AWSError>;
  /**
   * Lists model compilation jobs that satisfy various filters. To create a model compilation job, use CreateCompilationJob. To get information about a particular model compilation job you have created, use DescribeCompilationJob.
   */
  listCompilationJobs(callback?: (err: AWSError, data: SageMaker.Types.ListCompilationJobsResponse) => void): Request<SageMaker.Types.ListCompilationJobsResponse, AWSError>;
  /**
   * Lists the contexts in your account and their properties.
   */
  listContexts(params: SageMaker.Types.ListContextsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListContextsResponse) => void): Request<SageMaker.Types.ListContextsResponse, AWSError>;
  /**
   * Lists the contexts in your account and their properties.
   */
  listContexts(callback?: (err: AWSError, data: SageMaker.Types.ListContextsResponse) => void): Request<SageMaker.Types.ListContextsResponse, AWSError>;
  /**
   * Lists the data quality job definitions in your account.
   */
  listDataQualityJobDefinitions(params: SageMaker.Types.ListDataQualityJobDefinitionsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListDataQualityJobDefinitionsResponse) => void): Request<SageMaker.Types.ListDataQualityJobDefinitionsResponse, AWSError>;
  /**
   * Lists the data quality job definitions in your account.
   */
  listDataQualityJobDefinitions(callback?: (err: AWSError, data: SageMaker.Types.ListDataQualityJobDefinitionsResponse) => void): Request<SageMaker.Types.ListDataQualityJobDefinitionsResponse, AWSError>;
  /**
   * Returns a list of devices in the fleet.
   */
  listDeviceFleets(params: SageMaker.Types.ListDeviceFleetsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListDeviceFleetsResponse) => void): Request<SageMaker.Types.ListDeviceFleetsResponse, AWSError>;
  /**
   * Returns a list of devices in the fleet.
   */
  listDeviceFleets(callback?: (err: AWSError, data: SageMaker.Types.ListDeviceFleetsResponse) => void): Request<SageMaker.Types.ListDeviceFleetsResponse, AWSError>;
  /**
   * A list of devices.
   */
  listDevices(params: SageMaker.Types.ListDevicesRequest, callback?: (err: AWSError, data: SageMaker.Types.ListDevicesResponse) => void): Request<SageMaker.Types.ListDevicesResponse, AWSError>;
  /**
   * A list of devices.
   */
  listDevices(callback?: (err: AWSError, data: SageMaker.Types.ListDevicesResponse) => void): Request<SageMaker.Types.ListDevicesResponse, AWSError>;
  /**
   * Lists the domains.
   */
  listDomains(params: SageMaker.Types.ListDomainsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListDomainsResponse) => void): Request<SageMaker.Types.ListDomainsResponse, AWSError>;
  /**
   * Lists the domains.
   */
  listDomains(callback?: (err: AWSError, data: SageMaker.Types.ListDomainsResponse) => void): Request<SageMaker.Types.ListDomainsResponse, AWSError>;
  /**
   * Returns a list of edge packaging jobs.
   */
  listEdgePackagingJobs(params: SageMaker.Types.ListEdgePackagingJobsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListEdgePackagingJobsResponse) => void): Request<SageMaker.Types.ListEdgePackagingJobsResponse, AWSError>;
  /**
   * Returns a list of edge packaging jobs.
   */
  listEdgePackagingJobs(callback?: (err: AWSError, data: SageMaker.Types.ListEdgePackagingJobsResponse) => void): Request<SageMaker.Types.ListEdgePackagingJobsResponse, AWSError>;
  /**
   * Lists endpoint configurations.
   */
  listEndpointConfigs(params: SageMaker.Types.ListEndpointConfigsInput, callback?: (err: AWSError, data: SageMaker.Types.ListEndpointConfigsOutput) => void): Request<SageMaker.Types.ListEndpointConfigsOutput, AWSError>;
  /**
   * Lists endpoint configurations.
   */
  listEndpointConfigs(callback?: (err: AWSError, data: SageMaker.Types.ListEndpointConfigsOutput) => void): Request<SageMaker.Types.ListEndpointConfigsOutput, AWSError>;
  /**
   * Lists endpoints.
   */
  listEndpoints(params: SageMaker.Types.ListEndpointsInput, callback?: (err: AWSError, data: SageMaker.Types.ListEndpointsOutput) => void): Request<SageMaker.Types.ListEndpointsOutput, AWSError>;
  /**
   * Lists endpoints.
   */
  listEndpoints(callback?: (err: AWSError, data: SageMaker.Types.ListEndpointsOutput) => void): Request<SageMaker.Types.ListEndpointsOutput, AWSError>;
  /**
   * Lists all the experiments in your account. The list can be filtered to show only experiments that were created in a specific time range. The list can be sorted by experiment name or creation time.
   */
  listExperiments(params: SageMaker.Types.ListExperimentsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListExperimentsResponse) => void): Request<SageMaker.Types.ListExperimentsResponse, AWSError>;
  /**
   * Lists all the experiments in your account. The list can be filtered to show only experiments that were created in a specific time range. The list can be sorted by experiment name or creation time.
   */
  listExperiments(callback?: (err: AWSError, data: SageMaker.Types.ListExperimentsResponse) => void): Request<SageMaker.Types.ListExperimentsResponse, AWSError>;
  /**
   * List FeatureGroups based on given filter and order.
   */
  listFeatureGroups(params: SageMaker.Types.ListFeatureGroupsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListFeatureGroupsResponse) => void): Request<SageMaker.Types.ListFeatureGroupsResponse, AWSError>;
  /**
   * List FeatureGroups based on given filter and order.
   */
  listFeatureGroups(callback?: (err: AWSError, data: SageMaker.Types.ListFeatureGroupsResponse) => void): Request<SageMaker.Types.ListFeatureGroupsResponse, AWSError>;
  /**
   * Returns information about the flow definitions in your account.
   */
  listFlowDefinitions(params: SageMaker.Types.ListFlowDefinitionsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListFlowDefinitionsResponse) => void): Request<SageMaker.Types.ListFlowDefinitionsResponse, AWSError>;
  /**
   * Returns information about the flow definitions in your account.
   */
  listFlowDefinitions(callback?: (err: AWSError, data: SageMaker.Types.ListFlowDefinitionsResponse) => void): Request<SageMaker.Types.ListFlowDefinitionsResponse, AWSError>;
  /**
   * Returns information about the human task user interfaces in your account.
   */
  listHumanTaskUis(params: SageMaker.Types.ListHumanTaskUisRequest, callback?: (err: AWSError, data: SageMaker.Types.ListHumanTaskUisResponse) => void): Request<SageMaker.Types.ListHumanTaskUisResponse, AWSError>;
  /**
   * Returns information about the human task user interfaces in your account.
   */
  listHumanTaskUis(callback?: (err: AWSError, data: SageMaker.Types.ListHumanTaskUisResponse) => void): Request<SageMaker.Types.ListHumanTaskUisResponse, AWSError>;
  /**
   * Gets a list of HyperParameterTuningJobSummary objects that describe the hyperparameter tuning jobs launched in your account.
   */
  listHyperParameterTuningJobs(params: SageMaker.Types.ListHyperParameterTuningJobsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListHyperParameterTuningJobsResponse) => void): Request<SageMaker.Types.ListHyperParameterTuningJobsResponse, AWSError>;
  /**
   * Gets a list of HyperParameterTuningJobSummary objects that describe the hyperparameter tuning jobs launched in your account.
   */
  listHyperParameterTuningJobs(callback?: (err: AWSError, data: SageMaker.Types.ListHyperParameterTuningJobsResponse) => void): Request<SageMaker.Types.ListHyperParameterTuningJobsResponse, AWSError>;
  /**
   * Lists the versions of a specified image and their properties. The list can be filtered by creation time or modified time.
   */
  listImageVersions(params: SageMaker.Types.ListImageVersionsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListImageVersionsResponse) => void): Request<SageMaker.Types.ListImageVersionsResponse, AWSError>;
  /**
   * Lists the versions of a specified image and their properties. The list can be filtered by creation time or modified time.
   */
  listImageVersions(callback?: (err: AWSError, data: SageMaker.Types.ListImageVersionsResponse) => void): Request<SageMaker.Types.ListImageVersionsResponse, AWSError>;
  /**
   * Lists the images in your account and their properties. The list can be filtered by creation time or modified time, and whether the image name contains a specified string.
   */
  listImages(params: SageMaker.Types.ListImagesRequest, callback?: (err: AWSError, data: SageMaker.Types.ListImagesResponse) => void): Request<SageMaker.Types.ListImagesResponse, AWSError>;
  /**
   * Lists the images in your account and their properties. The list can be filtered by creation time or modified time, and whether the image name contains a specified string.
   */
  listImages(callback?: (err: AWSError, data: SageMaker.Types.ListImagesResponse) => void): Request<SageMaker.Types.ListImagesResponse, AWSError>;
  /**
   * Gets a list of labeling jobs.
   */
  listLabelingJobs(params: SageMaker.Types.ListLabelingJobsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListLabelingJobsResponse) => void): Request<SageMaker.Types.ListLabelingJobsResponse, AWSError>;
  /**
   * Gets a list of labeling jobs.
   */
  listLabelingJobs(callback?: (err: AWSError, data: SageMaker.Types.ListLabelingJobsResponse) => void): Request<SageMaker.Types.ListLabelingJobsResponse, AWSError>;
  /**
   * Gets a list of labeling jobs assigned to a specified work team.
   */
  listLabelingJobsForWorkteam(params: SageMaker.Types.ListLabelingJobsForWorkteamRequest, callback?: (err: AWSError, data: SageMaker.Types.ListLabelingJobsForWorkteamResponse) => void): Request<SageMaker.Types.ListLabelingJobsForWorkteamResponse, AWSError>;
  /**
   * Gets a list of labeling jobs assigned to a specified work team.
   */
  listLabelingJobsForWorkteam(callback?: (err: AWSError, data: SageMaker.Types.ListLabelingJobsForWorkteamResponse) => void): Request<SageMaker.Types.ListLabelingJobsForWorkteamResponse, AWSError>;
  /**
   * Lists model bias jobs definitions that satisfy various filters.
   */
  listModelBiasJobDefinitions(params: SageMaker.Types.ListModelBiasJobDefinitionsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListModelBiasJobDefinitionsResponse) => void): Request<SageMaker.Types.ListModelBiasJobDefinitionsResponse, AWSError>;
  /**
   * Lists model bias jobs definitions that satisfy various filters.
   */
  listModelBiasJobDefinitions(callback?: (err: AWSError, data: SageMaker.Types.ListModelBiasJobDefinitionsResponse) => void): Request<SageMaker.Types.ListModelBiasJobDefinitionsResponse, AWSError>;
  /**
   * Lists model explainability job definitions that satisfy various filters.
   */
  listModelExplainabilityJobDefinitions(params: SageMaker.Types.ListModelExplainabilityJobDefinitionsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListModelExplainabilityJobDefinitionsResponse) => void): Request<SageMaker.Types.ListModelExplainabilityJobDefinitionsResponse, AWSError>;
  /**
   * Lists model explainability job definitions that satisfy various filters.
   */
  listModelExplainabilityJobDefinitions(callback?: (err: AWSError, data: SageMaker.Types.ListModelExplainabilityJobDefinitionsResponse) => void): Request<SageMaker.Types.ListModelExplainabilityJobDefinitionsResponse, AWSError>;
  /**
   * Gets a list of the model groups in your Amazon Web Services account.
   */
  listModelPackageGroups(params: SageMaker.Types.ListModelPackageGroupsInput, callback?: (err: AWSError, data: SageMaker.Types.ListModelPackageGroupsOutput) => void): Request<SageMaker.Types.ListModelPackageGroupsOutput, AWSError>;
  /**
   * Gets a list of the model groups in your Amazon Web Services account.
   */
  listModelPackageGroups(callback?: (err: AWSError, data: SageMaker.Types.ListModelPackageGroupsOutput) => void): Request<SageMaker.Types.ListModelPackageGroupsOutput, AWSError>;
  /**
   * Lists the model packages that have been created.
   */
  listModelPackages(params: SageMaker.Types.ListModelPackagesInput, callback?: (err: AWSError, data: SageMaker.Types.ListModelPackagesOutput) => void): Request<SageMaker.Types.ListModelPackagesOutput, AWSError>;
  /**
   * Lists the model packages that have been created.
   */
  listModelPackages(callback?: (err: AWSError, data: SageMaker.Types.ListModelPackagesOutput) => void): Request<SageMaker.Types.ListModelPackagesOutput, AWSError>;
  /**
   * Gets a list of model quality monitoring job definitions in your account.
   */
  listModelQualityJobDefinitions(params: SageMaker.Types.ListModelQualityJobDefinitionsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListModelQualityJobDefinitionsResponse) => void): Request<SageMaker.Types.ListModelQualityJobDefinitionsResponse, AWSError>;
  /**
   * Gets a list of model quality monitoring job definitions in your account.
   */
  listModelQualityJobDefinitions(callback?: (err: AWSError, data: SageMaker.Types.ListModelQualityJobDefinitionsResponse) => void): Request<SageMaker.Types.ListModelQualityJobDefinitionsResponse, AWSError>;
  /**
   * Lists models created with the CreateModel API.
   */
  listModels(params: SageMaker.Types.ListModelsInput, callback?: (err: AWSError, data: SageMaker.Types.ListModelsOutput) => void): Request<SageMaker.Types.ListModelsOutput, AWSError>;
  /**
   * Lists models created with the CreateModel API.
   */
  listModels(callback?: (err: AWSError, data: SageMaker.Types.ListModelsOutput) => void): Request<SageMaker.Types.ListModelsOutput, AWSError>;
  /**
   * Returns list of all monitoring job executions.
   */
  listMonitoringExecutions(params: SageMaker.Types.ListMonitoringExecutionsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListMonitoringExecutionsResponse) => void): Request<SageMaker.Types.ListMonitoringExecutionsResponse, AWSError>;
  /**
   * Returns list of all monitoring job executions.
   */
  listMonitoringExecutions(callback?: (err: AWSError, data: SageMaker.Types.ListMonitoringExecutionsResponse) => void): Request<SageMaker.Types.ListMonitoringExecutionsResponse, AWSError>;
  /**
   * Returns list of all monitoring schedules.
   */
  listMonitoringSchedules(params: SageMaker.Types.ListMonitoringSchedulesRequest, callback?: (err: AWSError, data: SageMaker.Types.ListMonitoringSchedulesResponse) => void): Request<SageMaker.Types.ListMonitoringSchedulesResponse, AWSError>;
  /**
   * Returns list of all monitoring schedules.
   */
  listMonitoringSchedules(callback?: (err: AWSError, data: SageMaker.Types.ListMonitoringSchedulesResponse) => void): Request<SageMaker.Types.ListMonitoringSchedulesResponse, AWSError>;
  /**
   * Lists notebook instance lifestyle configurations created with the CreateNotebookInstanceLifecycleConfig API.
   */
  listNotebookInstanceLifecycleConfigs(params: SageMaker.Types.ListNotebookInstanceLifecycleConfigsInput, callback?: (err: AWSError, data: SageMaker.Types.ListNotebookInstanceLifecycleConfigsOutput) => void): Request<SageMaker.Types.ListNotebookInstanceLifecycleConfigsOutput, AWSError>;
  /**
   * Lists notebook instance lifestyle configurations created with the CreateNotebookInstanceLifecycleConfig API.
   */
  listNotebookInstanceLifecycleConfigs(callback?: (err: AWSError, data: SageMaker.Types.ListNotebookInstanceLifecycleConfigsOutput) => void): Request<SageMaker.Types.ListNotebookInstanceLifecycleConfigsOutput, AWSError>;
  /**
   * Returns a list of the Amazon SageMaker notebook instances in the requester's account in an Amazon Web Services Region. 
   */
  listNotebookInstances(params: SageMaker.Types.ListNotebookInstancesInput, callback?: (err: AWSError, data: SageMaker.Types.ListNotebookInstancesOutput) => void): Request<SageMaker.Types.ListNotebookInstancesOutput, AWSError>;
  /**
   * Returns a list of the Amazon SageMaker notebook instances in the requester's account in an Amazon Web Services Region. 
   */
  listNotebookInstances(callback?: (err: AWSError, data: SageMaker.Types.ListNotebookInstancesOutput) => void): Request<SageMaker.Types.ListNotebookInstancesOutput, AWSError>;
  /**
   * Gets a list of PipeLineExecutionStep objects.
   */
  listPipelineExecutionSteps(params: SageMaker.Types.ListPipelineExecutionStepsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListPipelineExecutionStepsResponse) => void): Request<SageMaker.Types.ListPipelineExecutionStepsResponse, AWSError>;
  /**
   * Gets a list of PipeLineExecutionStep objects.
   */
  listPipelineExecutionSteps(callback?: (err: AWSError, data: SageMaker.Types.ListPipelineExecutionStepsResponse) => void): Request<SageMaker.Types.ListPipelineExecutionStepsResponse, AWSError>;
  /**
   * Gets a list of the pipeline executions.
   */
  listPipelineExecutions(params: SageMaker.Types.ListPipelineExecutionsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListPipelineExecutionsResponse) => void): Request<SageMaker.Types.ListPipelineExecutionsResponse, AWSError>;
  /**
   * Gets a list of the pipeline executions.
   */
  listPipelineExecutions(callback?: (err: AWSError, data: SageMaker.Types.ListPipelineExecutionsResponse) => void): Request<SageMaker.Types.ListPipelineExecutionsResponse, AWSError>;
  /**
   * Gets a list of parameters for a pipeline execution.
   */
  listPipelineParametersForExecution(params: SageMaker.Types.ListPipelineParametersForExecutionRequest, callback?: (err: AWSError, data: SageMaker.Types.ListPipelineParametersForExecutionResponse) => void): Request<SageMaker.Types.ListPipelineParametersForExecutionResponse, AWSError>;
  /**
   * Gets a list of parameters for a pipeline execution.
   */
  listPipelineParametersForExecution(callback?: (err: AWSError, data: SageMaker.Types.ListPipelineParametersForExecutionResponse) => void): Request<SageMaker.Types.ListPipelineParametersForExecutionResponse, AWSError>;
  /**
   * Gets a list of pipelines.
   */
  listPipelines(params: SageMaker.Types.ListPipelinesRequest, callback?: (err: AWSError, data: SageMaker.Types.ListPipelinesResponse) => void): Request<SageMaker.Types.ListPipelinesResponse, AWSError>;
  /**
   * Gets a list of pipelines.
   */
  listPipelines(callback?: (err: AWSError, data: SageMaker.Types.ListPipelinesResponse) => void): Request<SageMaker.Types.ListPipelinesResponse, AWSError>;
  /**
   * Lists processing jobs that satisfy various filters.
   */
  listProcessingJobs(params: SageMaker.Types.ListProcessingJobsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListProcessingJobsResponse) => void): Request<SageMaker.Types.ListProcessingJobsResponse, AWSError>;
  /**
   * Lists processing jobs that satisfy various filters.
   */
  listProcessingJobs(callback?: (err: AWSError, data: SageMaker.Types.ListProcessingJobsResponse) => void): Request<SageMaker.Types.ListProcessingJobsResponse, AWSError>;
  /**
   * Gets a list of the projects in an Amazon Web Services account.
   */
  listProjects(params: SageMaker.Types.ListProjectsInput, callback?: (err: AWSError, data: SageMaker.Types.ListProjectsOutput) => void): Request<SageMaker.Types.ListProjectsOutput, AWSError>;
  /**
   * Gets a list of the projects in an Amazon Web Services account.
   */
  listProjects(callback?: (err: AWSError, data: SageMaker.Types.ListProjectsOutput) => void): Request<SageMaker.Types.ListProjectsOutput, AWSError>;
  /**
   * Lists the Studio Lifecycle Configurations in your Amazon Web Services Account.
   */
  listStudioLifecycleConfigs(params: SageMaker.Types.ListStudioLifecycleConfigsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListStudioLifecycleConfigsResponse) => void): Request<SageMaker.Types.ListStudioLifecycleConfigsResponse, AWSError>;
  /**
   * Lists the Studio Lifecycle Configurations in your Amazon Web Services Account.
   */
  listStudioLifecycleConfigs(callback?: (err: AWSError, data: SageMaker.Types.ListStudioLifecycleConfigsResponse) => void): Request<SageMaker.Types.ListStudioLifecycleConfigsResponse, AWSError>;
  /**
   * Gets a list of the work teams that you are subscribed to in the Amazon Web Services Marketplace. The list may be empty if no work team satisfies the filter specified in the NameContains parameter.
   */
  listSubscribedWorkteams(params: SageMaker.Types.ListSubscribedWorkteamsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListSubscribedWorkteamsResponse) => void): Request<SageMaker.Types.ListSubscribedWorkteamsResponse, AWSError>;
  /**
   * Gets a list of the work teams that you are subscribed to in the Amazon Web Services Marketplace. The list may be empty if no work team satisfies the filter specified in the NameContains parameter.
   */
  listSubscribedWorkteams(callback?: (err: AWSError, data: SageMaker.Types.ListSubscribedWorkteamsResponse) => void): Request<SageMaker.Types.ListSubscribedWorkteamsResponse, AWSError>;
  /**
   * Returns the tags for the specified Amazon SageMaker resource.
   */
  listTags(params: SageMaker.Types.ListTagsInput, callback?: (err: AWSError, data: SageMaker.Types.ListTagsOutput) => void): Request<SageMaker.Types.ListTagsOutput, AWSError>;
  /**
   * Returns the tags for the specified Amazon SageMaker resource.
   */
  listTags(callback?: (err: AWSError, data: SageMaker.Types.ListTagsOutput) => void): Request<SageMaker.Types.ListTagsOutput, AWSError>;
  /**
   * Lists training jobs.  When StatusEquals and MaxResults are set at the same time, the MaxResults number of training jobs are first retrieved ignoring the StatusEquals parameter and then they are filtered by the StatusEquals parameter, which is returned as a response. For example, if ListTrainingJobs is invoked with the following parameters:  { ... MaxResults: 100, StatusEquals: InProgress ... }  First, 100 trainings jobs with any status, including those other than InProgress, are selected (sorted according to the creation time, from the most current to the oldest). Next, those with a status of InProgress are returned. You can quickly test the API using the following Amazon Web Services CLI code.  aws sagemaker list-training-jobs --max-results 100 --status-equals InProgress  
   */
  listTrainingJobs(params: SageMaker.Types.ListTrainingJobsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListTrainingJobsResponse) => void): Request<SageMaker.Types.ListTrainingJobsResponse, AWSError>;
  /**
   * Lists training jobs.  When StatusEquals and MaxResults are set at the same time, the MaxResults number of training jobs are first retrieved ignoring the StatusEquals parameter and then they are filtered by the StatusEquals parameter, which is returned as a response. For example, if ListTrainingJobs is invoked with the following parameters:  { ... MaxResults: 100, StatusEquals: InProgress ... }  First, 100 trainings jobs with any status, including those other than InProgress, are selected (sorted according to the creation time, from the most current to the oldest). Next, those with a status of InProgress are returned. You can quickly test the API using the following Amazon Web Services CLI code.  aws sagemaker list-training-jobs --max-results 100 --status-equals InProgress  
   */
  listTrainingJobs(callback?: (err: AWSError, data: SageMaker.Types.ListTrainingJobsResponse) => void): Request<SageMaker.Types.ListTrainingJobsResponse, AWSError>;
  /**
   * Gets a list of TrainingJobSummary objects that describe the training jobs that a hyperparameter tuning job launched.
   */
  listTrainingJobsForHyperParameterTuningJob(params: SageMaker.Types.ListTrainingJobsForHyperParameterTuningJobRequest, callback?: (err: AWSError, data: SageMaker.Types.ListTrainingJobsForHyperParameterTuningJobResponse) => void): Request<SageMaker.Types.ListTrainingJobsForHyperParameterTuningJobResponse, AWSError>;
  /**
   * Gets a list of TrainingJobSummary objects that describe the training jobs that a hyperparameter tuning job launched.
   */
  listTrainingJobsForHyperParameterTuningJob(callback?: (err: AWSError, data: SageMaker.Types.ListTrainingJobsForHyperParameterTuningJobResponse) => void): Request<SageMaker.Types.ListTrainingJobsForHyperParameterTuningJobResponse, AWSError>;
  /**
   * Lists transform jobs.
   */
  listTransformJobs(params: SageMaker.Types.ListTransformJobsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListTransformJobsResponse) => void): Request<SageMaker.Types.ListTransformJobsResponse, AWSError>;
  /**
   * Lists transform jobs.
   */
  listTransformJobs(callback?: (err: AWSError, data: SageMaker.Types.ListTransformJobsResponse) => void): Request<SageMaker.Types.ListTransformJobsResponse, AWSError>;
  /**
   * Lists the trial components in your account. You can sort the list by trial component name or creation time. You can filter the list to show only components that were created in a specific time range. You can also filter on one of the following:    ExperimentName     SourceArn     TrialName   
   */
  listTrialComponents(params: SageMaker.Types.ListTrialComponentsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListTrialComponentsResponse) => void): Request<SageMaker.Types.ListTrialComponentsResponse, AWSError>;
  /**
   * Lists the trial components in your account. You can sort the list by trial component name or creation time. You can filter the list to show only components that were created in a specific time range. You can also filter on one of the following:    ExperimentName     SourceArn     TrialName   
   */
  listTrialComponents(callback?: (err: AWSError, data: SageMaker.Types.ListTrialComponentsResponse) => void): Request<SageMaker.Types.ListTrialComponentsResponse, AWSError>;
  /**
   * Lists the trials in your account. Specify an experiment name to limit the list to the trials that are part of that experiment. Specify a trial component name to limit the list to the trials that associated with that trial component. The list can be filtered to show only trials that were created in a specific time range. The list can be sorted by trial name or creation time.
   */
  listTrials(params: SageMaker.Types.ListTrialsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListTrialsResponse) => void): Request<SageMaker.Types.ListTrialsResponse, AWSError>;
  /**
   * Lists the trials in your account. Specify an experiment name to limit the list to the trials that are part of that experiment. Specify a trial component name to limit the list to the trials that associated with that trial component. The list can be filtered to show only trials that were created in a specific time range. The list can be sorted by trial name or creation time.
   */
  listTrials(callback?: (err: AWSError, data: SageMaker.Types.ListTrialsResponse) => void): Request<SageMaker.Types.ListTrialsResponse, AWSError>;
  /**
   * Lists user profiles.
   */
  listUserProfiles(params: SageMaker.Types.ListUserProfilesRequest, callback?: (err: AWSError, data: SageMaker.Types.ListUserProfilesResponse) => void): Request<SageMaker.Types.ListUserProfilesResponse, AWSError>;
  /**
   * Lists user profiles.
   */
  listUserProfiles(callback?: (err: AWSError, data: SageMaker.Types.ListUserProfilesResponse) => void): Request<SageMaker.Types.ListUserProfilesResponse, AWSError>;
  /**
   * Use this operation to list all private and vendor workforces in an Amazon Web Services Region. Note that you can only have one private workforce per Amazon Web Services Region.
   */
  listWorkforces(params: SageMaker.Types.ListWorkforcesRequest, callback?: (err: AWSError, data: SageMaker.Types.ListWorkforcesResponse) => void): Request<SageMaker.Types.ListWorkforcesResponse, AWSError>;
  /**
   * Use this operation to list all private and vendor workforces in an Amazon Web Services Region. Note that you can only have one private workforce per Amazon Web Services Region.
   */
  listWorkforces(callback?: (err: AWSError, data: SageMaker.Types.ListWorkforcesResponse) => void): Request<SageMaker.Types.ListWorkforcesResponse, AWSError>;
  /**
   * Gets a list of private work teams that you have defined in a region. The list may be empty if no work team satisfies the filter specified in the NameContains parameter.
   */
  listWorkteams(params: SageMaker.Types.ListWorkteamsRequest, callback?: (err: AWSError, data: SageMaker.Types.ListWorkteamsResponse) => void): Request<SageMaker.Types.ListWorkteamsResponse, AWSError>;
  /**
   * Gets a list of private work teams that you have defined in a region. The list may be empty if no work team satisfies the filter specified in the NameContains parameter.
   */
  listWorkteams(callback?: (err: AWSError, data: SageMaker.Types.ListWorkteamsResponse) => void): Request<SageMaker.Types.ListWorkteamsResponse, AWSError>;
  /**
   * Adds a resouce policy to control access to a model group. For information about resoure policies, see Identity-based policies and resource-based policies in the Amazon Web Services Identity and Access Management User Guide..
   */
  putModelPackageGroupPolicy(params: SageMaker.Types.PutModelPackageGroupPolicyInput, callback?: (err: AWSError, data: SageMaker.Types.PutModelPackageGroupPolicyOutput) => void): Request<SageMaker.Types.PutModelPackageGroupPolicyOutput, AWSError>;
  /**
   * Adds a resouce policy to control access to a model group. For information about resoure policies, see Identity-based policies and resource-based policies in the Amazon Web Services Identity and Access Management User Guide..
   */
  putModelPackageGroupPolicy(callback?: (err: AWSError, data: SageMaker.Types.PutModelPackageGroupPolicyOutput) => void): Request<SageMaker.Types.PutModelPackageGroupPolicyOutput, AWSError>;
  /**
   * Register devices.
   */
  registerDevices(params: SageMaker.Types.RegisterDevicesRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Register devices.
   */
  registerDevices(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Renders the UI template so that you can preview the worker's experience. 
   */
  renderUiTemplate(params: SageMaker.Types.RenderUiTemplateRequest, callback?: (err: AWSError, data: SageMaker.Types.RenderUiTemplateResponse) => void): Request<SageMaker.Types.RenderUiTemplateResponse, AWSError>;
  /**
   * Renders the UI template so that you can preview the worker's experience. 
   */
  renderUiTemplate(callback?: (err: AWSError, data: SageMaker.Types.RenderUiTemplateResponse) => void): Request<SageMaker.Types.RenderUiTemplateResponse, AWSError>;
  /**
   * Retry the execution of the pipeline.
   */
  retryPipelineExecution(params: SageMaker.Types.RetryPipelineExecutionRequest, callback?: (err: AWSError, data: SageMaker.Types.RetryPipelineExecutionResponse) => void): Request<SageMaker.Types.RetryPipelineExecutionResponse, AWSError>;
  /**
   * Retry the execution of the pipeline.
   */
  retryPipelineExecution(callback?: (err: AWSError, data: SageMaker.Types.RetryPipelineExecutionResponse) => void): Request<SageMaker.Types.RetryPipelineExecutionResponse, AWSError>;
  /**
   * Finds Amazon SageMaker resources that match a search query. Matching resources are returned as a list of SearchRecord objects in the response. You can sort the search results by any resource property in a ascending or descending order. You can query against the following value types: numeric, text, Boolean, and timestamp.
   */
  search(params: SageMaker.Types.SearchRequest, callback?: (err: AWSError, data: SageMaker.Types.SearchResponse) => void): Request<SageMaker.Types.SearchResponse, AWSError>;
  /**
   * Finds Amazon SageMaker resources that match a search query. Matching resources are returned as a list of SearchRecord objects in the response. You can sort the search results by any resource property in a ascending or descending order. You can query against the following value types: numeric, text, Boolean, and timestamp.
   */
  search(callback?: (err: AWSError, data: SageMaker.Types.SearchResponse) => void): Request<SageMaker.Types.SearchResponse, AWSError>;
  /**
   * Notifies the pipeline that the execution of a callback step failed, along with a message describing why. When a callback step is run, the pipeline generates a callback token and includes the token in a message sent to Amazon Simple Queue Service (Amazon SQS).
   */
  sendPipelineExecutionStepFailure(params: SageMaker.Types.SendPipelineExecutionStepFailureRequest, callback?: (err: AWSError, data: SageMaker.Types.SendPipelineExecutionStepFailureResponse) => void): Request<SageMaker.Types.SendPipelineExecutionStepFailureResponse, AWSError>;
  /**
   * Notifies the pipeline that the execution of a callback step failed, along with a message describing why. When a callback step is run, the pipeline generates a callback token and includes the token in a message sent to Amazon Simple Queue Service (Amazon SQS).
   */
  sendPipelineExecutionStepFailure(callback?: (err: AWSError, data: SageMaker.Types.SendPipelineExecutionStepFailureResponse) => void): Request<SageMaker.Types.SendPipelineExecutionStepFailureResponse, AWSError>;
  /**
   * Notifies the pipeline that the execution of a callback step succeeded and provides a list of the step's output parameters. When a callback step is run, the pipeline generates a callback token and includes the token in a message sent to Amazon Simple Queue Service (Amazon SQS).
   */
  sendPipelineExecutionStepSuccess(params: SageMaker.Types.SendPipelineExecutionStepSuccessRequest, callback?: (err: AWSError, data: SageMaker.Types.SendPipelineExecutionStepSuccessResponse) => void): Request<SageMaker.Types.SendPipelineExecutionStepSuccessResponse, AWSError>;
  /**
   * Notifies the pipeline that the execution of a callback step succeeded and provides a list of the step's output parameters. When a callback step is run, the pipeline generates a callback token and includes the token in a message sent to Amazon Simple Queue Service (Amazon SQS).
   */
  sendPipelineExecutionStepSuccess(callback?: (err: AWSError, data: SageMaker.Types.SendPipelineExecutionStepSuccessResponse) => void): Request<SageMaker.Types.SendPipelineExecutionStepSuccessResponse, AWSError>;
  /**
   * Starts a previously stopped monitoring schedule.  By default, when you successfully create a new schedule, the status of a monitoring schedule is scheduled. 
   */
  startMonitoringSchedule(params: SageMaker.Types.StartMonitoringScheduleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts a previously stopped monitoring schedule.  By default, when you successfully create a new schedule, the status of a monitoring schedule is scheduled. 
   */
  startMonitoringSchedule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Launches an ML compute instance with the latest version of the libraries and attaches your ML storage volume. After configuring the notebook instance, Amazon SageMaker sets the notebook instance status to InService. A notebook instance's status must be InService before you can connect to your Jupyter notebook. 
   */
  startNotebookInstance(params: SageMaker.Types.StartNotebookInstanceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Launches an ML compute instance with the latest version of the libraries and attaches your ML storage volume. After configuring the notebook instance, Amazon SageMaker sets the notebook instance status to InService. A notebook instance's status must be InService before you can connect to your Jupyter notebook. 
   */
  startNotebookInstance(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Starts a pipeline execution.
   */
  startPipelineExecution(params: SageMaker.Types.StartPipelineExecutionRequest, callback?: (err: AWSError, data: SageMaker.Types.StartPipelineExecutionResponse) => void): Request<SageMaker.Types.StartPipelineExecutionResponse, AWSError>;
  /**
   * Starts a pipeline execution.
   */
  startPipelineExecution(callback?: (err: AWSError, data: SageMaker.Types.StartPipelineExecutionResponse) => void): Request<SageMaker.Types.StartPipelineExecutionResponse, AWSError>;
  /**
   * A method for forcing the termination of a running job.
   */
  stopAutoMLJob(params: SageMaker.Types.StopAutoMLJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * A method for forcing the termination of a running job.
   */
  stopAutoMLJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a model compilation job.  To stop a job, Amazon SageMaker sends the algorithm the SIGTERM signal. This gracefully shuts the job down. If the job hasn't stopped, it sends the SIGKILL signal. When it receives a StopCompilationJob request, Amazon SageMaker changes the CompilationJobSummary$CompilationJobStatus of the job to Stopping. After Amazon SageMaker stops the job, it sets the CompilationJobSummary$CompilationJobStatus to Stopped. 
   */
  stopCompilationJob(params: SageMaker.Types.StopCompilationJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a model compilation job.  To stop a job, Amazon SageMaker sends the algorithm the SIGTERM signal. This gracefully shuts the job down. If the job hasn't stopped, it sends the SIGKILL signal. When it receives a StopCompilationJob request, Amazon SageMaker changes the CompilationJobSummary$CompilationJobStatus of the job to Stopping. After Amazon SageMaker stops the job, it sets the CompilationJobSummary$CompilationJobStatus to Stopped. 
   */
  stopCompilationJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Request to stop an edge packaging job.
   */
  stopEdgePackagingJob(params: SageMaker.Types.StopEdgePackagingJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Request to stop an edge packaging job.
   */
  stopEdgePackagingJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a running hyperparameter tuning job and all running training jobs that the tuning job launched. All model artifacts output from the training jobs are stored in Amazon Simple Storage Service (Amazon S3). All data that the training jobs write to Amazon CloudWatch Logs are still available in CloudWatch. After the tuning job moves to the Stopped state, it releases all reserved resources for the tuning job.
   */
  stopHyperParameterTuningJob(params: SageMaker.Types.StopHyperParameterTuningJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a running hyperparameter tuning job and all running training jobs that the tuning job launched. All model artifacts output from the training jobs are stored in Amazon Simple Storage Service (Amazon S3). All data that the training jobs write to Amazon CloudWatch Logs are still available in CloudWatch. After the tuning job moves to the Stopped state, it releases all reserved resources for the tuning job.
   */
  stopHyperParameterTuningJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a running labeling job. A job that is stopped cannot be restarted. Any results obtained before the job is stopped are placed in the Amazon S3 output bucket.
   */
  stopLabelingJob(params: SageMaker.Types.StopLabelingJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a running labeling job. A job that is stopped cannot be restarted. Any results obtained before the job is stopped are placed in the Amazon S3 output bucket.
   */
  stopLabelingJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a previously started monitoring schedule.
   */
  stopMonitoringSchedule(params: SageMaker.Types.StopMonitoringScheduleRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a previously started monitoring schedule.
   */
  stopMonitoringSchedule(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Terminates the ML compute instance. Before terminating the instance, Amazon SageMaker disconnects the ML storage volume from it. Amazon SageMaker preserves the ML storage volume. Amazon SageMaker stops charging you for the ML compute instance when you call StopNotebookInstance. To access data on the ML storage volume for a notebook instance that has been terminated, call the StartNotebookInstance API. StartNotebookInstance launches another ML compute instance, configures it, and attaches the preserved ML storage volume so you can continue your work. 
   */
  stopNotebookInstance(params: SageMaker.Types.StopNotebookInstanceInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Terminates the ML compute instance. Before terminating the instance, Amazon SageMaker disconnects the ML storage volume from it. Amazon SageMaker preserves the ML storage volume. Amazon SageMaker stops charging you for the ML compute instance when you call StopNotebookInstance. To access data on the ML storage volume for a notebook instance that has been terminated, call the StartNotebookInstance API. StartNotebookInstance launches another ML compute instance, configures it, and attaches the preserved ML storage volume so you can continue your work. 
   */
  stopNotebookInstance(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a pipeline execution.  Callback Step  A pipeline execution won't stop while a callback step is running. When you call StopPipelineExecution on a pipeline execution with a running callback step, SageMaker Pipelines sends an additional Amazon SQS message to the specified SQS queue. The body of the SQS message contains a "Status" field which is set to "Stopping". You should add logic to your Amazon SQS message consumer to take any needed action (for example, resource cleanup) upon receipt of the message followed by a call to SendPipelineExecutionStepSuccess or SendPipelineExecutionStepFailure. Only when SageMaker Pipelines receives one of these calls will it stop the pipeline execution.  Lambda Step  A pipeline execution can't be stopped while a lambda step is running because the Lambda function invoked by the lambda step can't be stopped. If you attempt to stop the execution while the Lambda function is running, the pipeline waits for the Lambda function to finish or until the timeout is hit, whichever occurs first, and then stops. If the Lambda function finishes, the pipeline execution status is Stopped. If the timeout is hit the pipeline execution status is Failed.
   */
  stopPipelineExecution(params: SageMaker.Types.StopPipelineExecutionRequest, callback?: (err: AWSError, data: SageMaker.Types.StopPipelineExecutionResponse) => void): Request<SageMaker.Types.StopPipelineExecutionResponse, AWSError>;
  /**
   * Stops a pipeline execution.  Callback Step  A pipeline execution won't stop while a callback step is running. When you call StopPipelineExecution on a pipeline execution with a running callback step, SageMaker Pipelines sends an additional Amazon SQS message to the specified SQS queue. The body of the SQS message contains a "Status" field which is set to "Stopping". You should add logic to your Amazon SQS message consumer to take any needed action (for example, resource cleanup) upon receipt of the message followed by a call to SendPipelineExecutionStepSuccess or SendPipelineExecutionStepFailure. Only when SageMaker Pipelines receives one of these calls will it stop the pipeline execution.  Lambda Step  A pipeline execution can't be stopped while a lambda step is running because the Lambda function invoked by the lambda step can't be stopped. If you attempt to stop the execution while the Lambda function is running, the pipeline waits for the Lambda function to finish or until the timeout is hit, whichever occurs first, and then stops. If the Lambda function finishes, the pipeline execution status is Stopped. If the timeout is hit the pipeline execution status is Failed.
   */
  stopPipelineExecution(callback?: (err: AWSError, data: SageMaker.Types.StopPipelineExecutionResponse) => void): Request<SageMaker.Types.StopPipelineExecutionResponse, AWSError>;
  /**
   * Stops a processing job.
   */
  stopProcessingJob(params: SageMaker.Types.StopProcessingJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a processing job.
   */
  stopProcessingJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a training job. To stop a job, Amazon SageMaker sends the algorithm the SIGTERM signal, which delays job termination for 120 seconds. Algorithms might use this 120-second window to save the model artifacts, so the results of the training is not lost.  When it receives a StopTrainingJob request, Amazon SageMaker changes the status of the job to Stopping. After Amazon SageMaker stops the job, it sets the status to Stopped.
   */
  stopTrainingJob(params: SageMaker.Types.StopTrainingJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a training job. To stop a job, Amazon SageMaker sends the algorithm the SIGTERM signal, which delays job termination for 120 seconds. Algorithms might use this 120-second window to save the model artifacts, so the results of the training is not lost.  When it receives a StopTrainingJob request, Amazon SageMaker changes the status of the job to Stopping. After Amazon SageMaker stops the job, it sets the status to Stopped.
   */
  stopTrainingJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a transform job. When Amazon SageMaker receives a StopTransformJob request, the status of the job changes to Stopping. After Amazon SageMaker stops the job, the status is set to Stopped. When you stop a transform job before it is completed, Amazon SageMaker doesn't store the job's output in Amazon S3.
   */
  stopTransformJob(params: SageMaker.Types.StopTransformJobRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Stops a transform job. When Amazon SageMaker receives a StopTransformJob request, the status of the job changes to Stopping. After Amazon SageMaker stops the job, the status is set to Stopped. When you stop a transform job before it is completed, Amazon SageMaker doesn't store the job's output in Amazon S3.
   */
  stopTransformJob(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates an action.
   */
  updateAction(params: SageMaker.Types.UpdateActionRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateActionResponse) => void): Request<SageMaker.Types.UpdateActionResponse, AWSError>;
  /**
   * Updates an action.
   */
  updateAction(callback?: (err: AWSError, data: SageMaker.Types.UpdateActionResponse) => void): Request<SageMaker.Types.UpdateActionResponse, AWSError>;
  /**
   * Updates the properties of an AppImageConfig.
   */
  updateAppImageConfig(params: SageMaker.Types.UpdateAppImageConfigRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateAppImageConfigResponse) => void): Request<SageMaker.Types.UpdateAppImageConfigResponse, AWSError>;
  /**
   * Updates the properties of an AppImageConfig.
   */
  updateAppImageConfig(callback?: (err: AWSError, data: SageMaker.Types.UpdateAppImageConfigResponse) => void): Request<SageMaker.Types.UpdateAppImageConfigResponse, AWSError>;
  /**
   * Updates an artifact.
   */
  updateArtifact(params: SageMaker.Types.UpdateArtifactRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateArtifactResponse) => void): Request<SageMaker.Types.UpdateArtifactResponse, AWSError>;
  /**
   * Updates an artifact.
   */
  updateArtifact(callback?: (err: AWSError, data: SageMaker.Types.UpdateArtifactResponse) => void): Request<SageMaker.Types.UpdateArtifactResponse, AWSError>;
  /**
   * Updates the specified Git repository with the specified values.
   */
  updateCodeRepository(params: SageMaker.Types.UpdateCodeRepositoryInput, callback?: (err: AWSError, data: SageMaker.Types.UpdateCodeRepositoryOutput) => void): Request<SageMaker.Types.UpdateCodeRepositoryOutput, AWSError>;
  /**
   * Updates the specified Git repository with the specified values.
   */
  updateCodeRepository(callback?: (err: AWSError, data: SageMaker.Types.UpdateCodeRepositoryOutput) => void): Request<SageMaker.Types.UpdateCodeRepositoryOutput, AWSError>;
  /**
   * Updates a context.
   */
  updateContext(params: SageMaker.Types.UpdateContextRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateContextResponse) => void): Request<SageMaker.Types.UpdateContextResponse, AWSError>;
  /**
   * Updates a context.
   */
  updateContext(callback?: (err: AWSError, data: SageMaker.Types.UpdateContextResponse) => void): Request<SageMaker.Types.UpdateContextResponse, AWSError>;
  /**
   * Updates a fleet of devices.
   */
  updateDeviceFleet(params: SageMaker.Types.UpdateDeviceFleetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates a fleet of devices.
   */
  updateDeviceFleet(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates one or more devices in a fleet.
   */
  updateDevices(params: SageMaker.Types.UpdateDevicesRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates one or more devices in a fleet.
   */
  updateDevices(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the default settings for new user profiles in the domain.
   */
  updateDomain(params: SageMaker.Types.UpdateDomainRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateDomainResponse) => void): Request<SageMaker.Types.UpdateDomainResponse, AWSError>;
  /**
   * Updates the default settings for new user profiles in the domain.
   */
  updateDomain(callback?: (err: AWSError, data: SageMaker.Types.UpdateDomainResponse) => void): Request<SageMaker.Types.UpdateDomainResponse, AWSError>;
  /**
   * Deploys the new EndpointConfig specified in the request, switches to using newly created endpoint, and then deletes resources provisioned for the endpoint using the previous EndpointConfig (there is no availability loss).  When Amazon SageMaker receives the request, it sets the endpoint status to Updating. After updating the endpoint, it sets the status to InService. To check the status of an endpoint, use the DescribeEndpoint API.   You must not delete an EndpointConfig in use by an endpoint that is live or while the UpdateEndpoint or CreateEndpoint operations are being performed on the endpoint. To update an endpoint, you must create a new EndpointConfig. If you delete the EndpointConfig of an endpoint that is active or being created or updated you may lose visibility into the instance type the endpoint is using. The endpoint must be deleted in order to stop incurring charges. 
   */
  updateEndpoint(params: SageMaker.Types.UpdateEndpointInput, callback?: (err: AWSError, data: SageMaker.Types.UpdateEndpointOutput) => void): Request<SageMaker.Types.UpdateEndpointOutput, AWSError>;
  /**
   * Deploys the new EndpointConfig specified in the request, switches to using newly created endpoint, and then deletes resources provisioned for the endpoint using the previous EndpointConfig (there is no availability loss).  When Amazon SageMaker receives the request, it sets the endpoint status to Updating. After updating the endpoint, it sets the status to InService. To check the status of an endpoint, use the DescribeEndpoint API.   You must not delete an EndpointConfig in use by an endpoint that is live or while the UpdateEndpoint or CreateEndpoint operations are being performed on the endpoint. To update an endpoint, you must create a new EndpointConfig. If you delete the EndpointConfig of an endpoint that is active or being created or updated you may lose visibility into the instance type the endpoint is using. The endpoint must be deleted in order to stop incurring charges. 
   */
  updateEndpoint(callback?: (err: AWSError, data: SageMaker.Types.UpdateEndpointOutput) => void): Request<SageMaker.Types.UpdateEndpointOutput, AWSError>;
  /**
   * Updates variant weight of one or more variants associated with an existing endpoint, or capacity of one variant associated with an existing endpoint. When it receives the request, Amazon SageMaker sets the endpoint status to Updating. After updating the endpoint, it sets the status to InService. To check the status of an endpoint, use the DescribeEndpoint API. 
   */
  updateEndpointWeightsAndCapacities(params: SageMaker.Types.UpdateEndpointWeightsAndCapacitiesInput, callback?: (err: AWSError, data: SageMaker.Types.UpdateEndpointWeightsAndCapacitiesOutput) => void): Request<SageMaker.Types.UpdateEndpointWeightsAndCapacitiesOutput, AWSError>;
  /**
   * Updates variant weight of one or more variants associated with an existing endpoint, or capacity of one variant associated with an existing endpoint. When it receives the request, Amazon SageMaker sets the endpoint status to Updating. After updating the endpoint, it sets the status to InService. To check the status of an endpoint, use the DescribeEndpoint API. 
   */
  updateEndpointWeightsAndCapacities(callback?: (err: AWSError, data: SageMaker.Types.UpdateEndpointWeightsAndCapacitiesOutput) => void): Request<SageMaker.Types.UpdateEndpointWeightsAndCapacitiesOutput, AWSError>;
  /**
   * Adds, updates, or removes the description of an experiment. Updates the display name of an experiment.
   */
  updateExperiment(params: SageMaker.Types.UpdateExperimentRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateExperimentResponse) => void): Request<SageMaker.Types.UpdateExperimentResponse, AWSError>;
  /**
   * Adds, updates, or removes the description of an experiment. Updates the display name of an experiment.
   */
  updateExperiment(callback?: (err: AWSError, data: SageMaker.Types.UpdateExperimentResponse) => void): Request<SageMaker.Types.UpdateExperimentResponse, AWSError>;
  /**
   * Updates the properties of a SageMaker image. To change the image's tags, use the AddTags and DeleteTags APIs.
   */
  updateImage(params: SageMaker.Types.UpdateImageRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateImageResponse) => void): Request<SageMaker.Types.UpdateImageResponse, AWSError>;
  /**
   * Updates the properties of a SageMaker image. To change the image's tags, use the AddTags and DeleteTags APIs.
   */
  updateImage(callback?: (err: AWSError, data: SageMaker.Types.UpdateImageResponse) => void): Request<SageMaker.Types.UpdateImageResponse, AWSError>;
  /**
   * Updates a versioned model.
   */
  updateModelPackage(params: SageMaker.Types.UpdateModelPackageInput, callback?: (err: AWSError, data: SageMaker.Types.UpdateModelPackageOutput) => void): Request<SageMaker.Types.UpdateModelPackageOutput, AWSError>;
  /**
   * Updates a versioned model.
   */
  updateModelPackage(callback?: (err: AWSError, data: SageMaker.Types.UpdateModelPackageOutput) => void): Request<SageMaker.Types.UpdateModelPackageOutput, AWSError>;
  /**
   * Updates a previously created schedule.
   */
  updateMonitoringSchedule(params: SageMaker.Types.UpdateMonitoringScheduleRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateMonitoringScheduleResponse) => void): Request<SageMaker.Types.UpdateMonitoringScheduleResponse, AWSError>;
  /**
   * Updates a previously created schedule.
   */
  updateMonitoringSchedule(callback?: (err: AWSError, data: SageMaker.Types.UpdateMonitoringScheduleResponse) => void): Request<SageMaker.Types.UpdateMonitoringScheduleResponse, AWSError>;
  /**
   * Updates a notebook instance. NotebookInstance updates include upgrading or downgrading the ML compute instance used for your notebook instance to accommodate changes in your workload requirements.
   */
  updateNotebookInstance(params: SageMaker.Types.UpdateNotebookInstanceInput, callback?: (err: AWSError, data: SageMaker.Types.UpdateNotebookInstanceOutput) => void): Request<SageMaker.Types.UpdateNotebookInstanceOutput, AWSError>;
  /**
   * Updates a notebook instance. NotebookInstance updates include upgrading or downgrading the ML compute instance used for your notebook instance to accommodate changes in your workload requirements.
   */
  updateNotebookInstance(callback?: (err: AWSError, data: SageMaker.Types.UpdateNotebookInstanceOutput) => void): Request<SageMaker.Types.UpdateNotebookInstanceOutput, AWSError>;
  /**
   * Updates a notebook instance lifecycle configuration created with the CreateNotebookInstanceLifecycleConfig API.
   */
  updateNotebookInstanceLifecycleConfig(params: SageMaker.Types.UpdateNotebookInstanceLifecycleConfigInput, callback?: (err: AWSError, data: SageMaker.Types.UpdateNotebookInstanceLifecycleConfigOutput) => void): Request<SageMaker.Types.UpdateNotebookInstanceLifecycleConfigOutput, AWSError>;
  /**
   * Updates a notebook instance lifecycle configuration created with the CreateNotebookInstanceLifecycleConfig API.
   */
  updateNotebookInstanceLifecycleConfig(callback?: (err: AWSError, data: SageMaker.Types.UpdateNotebookInstanceLifecycleConfigOutput) => void): Request<SageMaker.Types.UpdateNotebookInstanceLifecycleConfigOutput, AWSError>;
  /**
   * Updates a pipeline.
   */
  updatePipeline(params: SageMaker.Types.UpdatePipelineRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdatePipelineResponse) => void): Request<SageMaker.Types.UpdatePipelineResponse, AWSError>;
  /**
   * Updates a pipeline.
   */
  updatePipeline(callback?: (err: AWSError, data: SageMaker.Types.UpdatePipelineResponse) => void): Request<SageMaker.Types.UpdatePipelineResponse, AWSError>;
  /**
   * Updates a pipeline execution.
   */
  updatePipelineExecution(params: SageMaker.Types.UpdatePipelineExecutionRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdatePipelineExecutionResponse) => void): Request<SageMaker.Types.UpdatePipelineExecutionResponse, AWSError>;
  /**
   * Updates a pipeline execution.
   */
  updatePipelineExecution(callback?: (err: AWSError, data: SageMaker.Types.UpdatePipelineExecutionResponse) => void): Request<SageMaker.Types.UpdatePipelineExecutionResponse, AWSError>;
  /**
   * Updates a machine learning (ML) project that is created from a template that sets up an ML pipeline from training to deploying an approved model.  You must not update a project that is in use. If you update the ServiceCatalogProvisioningUpdateDetails of a project that is active or being created, or updated, you may lose resources already created by the project. 
   */
  updateProject(params: SageMaker.Types.UpdateProjectInput, callback?: (err: AWSError, data: SageMaker.Types.UpdateProjectOutput) => void): Request<SageMaker.Types.UpdateProjectOutput, AWSError>;
  /**
   * Updates a machine learning (ML) project that is created from a template that sets up an ML pipeline from training to deploying an approved model.  You must not update a project that is in use. If you update the ServiceCatalogProvisioningUpdateDetails of a project that is active or being created, or updated, you may lose resources already created by the project. 
   */
  updateProject(callback?: (err: AWSError, data: SageMaker.Types.UpdateProjectOutput) => void): Request<SageMaker.Types.UpdateProjectOutput, AWSError>;
  /**
   * Update a model training job to request a new Debugger profiling configuration.
   */
  updateTrainingJob(params: SageMaker.Types.UpdateTrainingJobRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateTrainingJobResponse) => void): Request<SageMaker.Types.UpdateTrainingJobResponse, AWSError>;
  /**
   * Update a model training job to request a new Debugger profiling configuration.
   */
  updateTrainingJob(callback?: (err: AWSError, data: SageMaker.Types.UpdateTrainingJobResponse) => void): Request<SageMaker.Types.UpdateTrainingJobResponse, AWSError>;
  /**
   * Updates the display name of a trial.
   */
  updateTrial(params: SageMaker.Types.UpdateTrialRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateTrialResponse) => void): Request<SageMaker.Types.UpdateTrialResponse, AWSError>;
  /**
   * Updates the display name of a trial.
   */
  updateTrial(callback?: (err: AWSError, data: SageMaker.Types.UpdateTrialResponse) => void): Request<SageMaker.Types.UpdateTrialResponse, AWSError>;
  /**
   * Updates one or more properties of a trial component.
   */
  updateTrialComponent(params: SageMaker.Types.UpdateTrialComponentRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateTrialComponentResponse) => void): Request<SageMaker.Types.UpdateTrialComponentResponse, AWSError>;
  /**
   * Updates one or more properties of a trial component.
   */
  updateTrialComponent(callback?: (err: AWSError, data: SageMaker.Types.UpdateTrialComponentResponse) => void): Request<SageMaker.Types.UpdateTrialComponentResponse, AWSError>;
  /**
   * Updates a user profile.
   */
  updateUserProfile(params: SageMaker.Types.UpdateUserProfileRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateUserProfileResponse) => void): Request<SageMaker.Types.UpdateUserProfileResponse, AWSError>;
  /**
   * Updates a user profile.
   */
  updateUserProfile(callback?: (err: AWSError, data: SageMaker.Types.UpdateUserProfileResponse) => void): Request<SageMaker.Types.UpdateUserProfileResponse, AWSError>;
  /**
   * Use this operation to update your workforce. You can use this operation to require that workers use specific IP addresses to work on tasks and to update your OpenID Connect (OIDC) Identity Provider (IdP) workforce configuration.  Use SourceIpConfig to restrict worker access to tasks to a specific range of IP addresses. You specify allowed IP addresses by creating a list of up to ten CIDRs. By default, a workforce isn't restricted to specific IP addresses. If you specify a range of IP addresses, workers who attempt to access tasks using any IP address outside the specified range are denied and get a Not Found error message on the worker portal. Use OidcConfig to update the configuration of a workforce created using your own OIDC IdP.   You can only update your OIDC IdP configuration when there are no work teams associated with your workforce. You can delete work teams using the operation.  After restricting access to a range of IP addresses or updating your OIDC IdP configuration with this operation, you can view details about your update workforce using the operation.  This operation only applies to private workforces. 
   */
  updateWorkforce(params: SageMaker.Types.UpdateWorkforceRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateWorkforceResponse) => void): Request<SageMaker.Types.UpdateWorkforceResponse, AWSError>;
  /**
   * Use this operation to update your workforce. You can use this operation to require that workers use specific IP addresses to work on tasks and to update your OpenID Connect (OIDC) Identity Provider (IdP) workforce configuration.  Use SourceIpConfig to restrict worker access to tasks to a specific range of IP addresses. You specify allowed IP addresses by creating a list of up to ten CIDRs. By default, a workforce isn't restricted to specific IP addresses. If you specify a range of IP addresses, workers who attempt to access tasks using any IP address outside the specified range are denied and get a Not Found error message on the worker portal. Use OidcConfig to update the configuration of a workforce created using your own OIDC IdP.   You can only update your OIDC IdP configuration when there are no work teams associated with your workforce. You can delete work teams using the operation.  After restricting access to a range of IP addresses or updating your OIDC IdP configuration with this operation, you can view details about your update workforce using the operation.  This operation only applies to private workforces. 
   */
  updateWorkforce(callback?: (err: AWSError, data: SageMaker.Types.UpdateWorkforceResponse) => void): Request<SageMaker.Types.UpdateWorkforceResponse, AWSError>;
  /**
   * Updates an existing work team with new member definitions or description.
   */
  updateWorkteam(params: SageMaker.Types.UpdateWorkteamRequest, callback?: (err: AWSError, data: SageMaker.Types.UpdateWorkteamResponse) => void): Request<SageMaker.Types.UpdateWorkteamResponse, AWSError>;
  /**
   * Updates an existing work team with new member definitions or description.
   */
  updateWorkteam(callback?: (err: AWSError, data: SageMaker.Types.UpdateWorkteamResponse) => void): Request<SageMaker.Types.UpdateWorkteamResponse, AWSError>;
  /**
   * Waits for the notebookInstanceInService state by periodically calling the underlying SageMaker.describeNotebookInstanceoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "notebookInstanceInService", params: SageMaker.Types.DescribeNotebookInstanceInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeNotebookInstanceOutput) => void): Request<SageMaker.Types.DescribeNotebookInstanceOutput, AWSError>;
  /**
   * Waits for the notebookInstanceInService state by periodically calling the underlying SageMaker.describeNotebookInstanceoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "notebookInstanceInService", callback?: (err: AWSError, data: SageMaker.Types.DescribeNotebookInstanceOutput) => void): Request<SageMaker.Types.DescribeNotebookInstanceOutput, AWSError>;
  /**
   * Waits for the notebookInstanceStopped state by periodically calling the underlying SageMaker.describeNotebookInstanceoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "notebookInstanceStopped", params: SageMaker.Types.DescribeNotebookInstanceInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeNotebookInstanceOutput) => void): Request<SageMaker.Types.DescribeNotebookInstanceOutput, AWSError>;
  /**
   * Waits for the notebookInstanceStopped state by periodically calling the underlying SageMaker.describeNotebookInstanceoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "notebookInstanceStopped", callback?: (err: AWSError, data: SageMaker.Types.DescribeNotebookInstanceOutput) => void): Request<SageMaker.Types.DescribeNotebookInstanceOutput, AWSError>;
  /**
   * Waits for the notebookInstanceDeleted state by periodically calling the underlying SageMaker.describeNotebookInstanceoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "notebookInstanceDeleted", params: SageMaker.Types.DescribeNotebookInstanceInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeNotebookInstanceOutput) => void): Request<SageMaker.Types.DescribeNotebookInstanceOutput, AWSError>;
  /**
   * Waits for the notebookInstanceDeleted state by periodically calling the underlying SageMaker.describeNotebookInstanceoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "notebookInstanceDeleted", callback?: (err: AWSError, data: SageMaker.Types.DescribeNotebookInstanceOutput) => void): Request<SageMaker.Types.DescribeNotebookInstanceOutput, AWSError>;
  /**
   * Waits for the trainingJobCompletedOrStopped state by periodically calling the underlying SageMaker.describeTrainingJoboperation every 120 seconds (at most 180 times).
   */
  waitFor(state: "trainingJobCompletedOrStopped", params: SageMaker.Types.DescribeTrainingJobRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeTrainingJobResponse) => void): Request<SageMaker.Types.DescribeTrainingJobResponse, AWSError>;
  /**
   * Waits for the trainingJobCompletedOrStopped state by periodically calling the underlying SageMaker.describeTrainingJoboperation every 120 seconds (at most 180 times).
   */
  waitFor(state: "trainingJobCompletedOrStopped", callback?: (err: AWSError, data: SageMaker.Types.DescribeTrainingJobResponse) => void): Request<SageMaker.Types.DescribeTrainingJobResponse, AWSError>;
  /**
   * Waits for the endpointInService state by periodically calling the underlying SageMaker.describeEndpointoperation every 30 seconds (at most 120 times).
   */
  waitFor(state: "endpointInService", params: SageMaker.Types.DescribeEndpointInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeEndpointOutput) => void): Request<SageMaker.Types.DescribeEndpointOutput, AWSError>;
  /**
   * Waits for the endpointInService state by periodically calling the underlying SageMaker.describeEndpointoperation every 30 seconds (at most 120 times).
   */
  waitFor(state: "endpointInService", callback?: (err: AWSError, data: SageMaker.Types.DescribeEndpointOutput) => void): Request<SageMaker.Types.DescribeEndpointOutput, AWSError>;
  /**
   * Waits for the endpointDeleted state by periodically calling the underlying SageMaker.describeEndpointoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "endpointDeleted", params: SageMaker.Types.DescribeEndpointInput & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeEndpointOutput) => void): Request<SageMaker.Types.DescribeEndpointOutput, AWSError>;
  /**
   * Waits for the endpointDeleted state by periodically calling the underlying SageMaker.describeEndpointoperation every 30 seconds (at most 60 times).
   */
  waitFor(state: "endpointDeleted", callback?: (err: AWSError, data: SageMaker.Types.DescribeEndpointOutput) => void): Request<SageMaker.Types.DescribeEndpointOutput, AWSError>;
  /**
   * Waits for the transformJobCompletedOrStopped state by periodically calling the underlying SageMaker.describeTransformJoboperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "transformJobCompletedOrStopped", params: SageMaker.Types.DescribeTransformJobRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeTransformJobResponse) => void): Request<SageMaker.Types.DescribeTransformJobResponse, AWSError>;
  /**
   * Waits for the transformJobCompletedOrStopped state by periodically calling the underlying SageMaker.describeTransformJoboperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "transformJobCompletedOrStopped", callback?: (err: AWSError, data: SageMaker.Types.DescribeTransformJobResponse) => void): Request<SageMaker.Types.DescribeTransformJobResponse, AWSError>;
  /**
   * Waits for the processingJobCompletedOrStopped state by periodically calling the underlying SageMaker.describeProcessingJoboperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "processingJobCompletedOrStopped", params: SageMaker.Types.DescribeProcessingJobRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeProcessingJobResponse) => void): Request<SageMaker.Types.DescribeProcessingJobResponse, AWSError>;
  /**
   * Waits for the processingJobCompletedOrStopped state by periodically calling the underlying SageMaker.describeProcessingJoboperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "processingJobCompletedOrStopped", callback?: (err: AWSError, data: SageMaker.Types.DescribeProcessingJobResponse) => void): Request<SageMaker.Types.DescribeProcessingJobResponse, AWSError>;
  /**
   * Waits for the imageCreated state by periodically calling the underlying SageMaker.describeImageoperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "imageCreated", params: SageMaker.Types.DescribeImageRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeImageResponse) => void): Request<SageMaker.Types.DescribeImageResponse, AWSError>;
  /**
   * Waits for the imageCreated state by periodically calling the underlying SageMaker.describeImageoperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "imageCreated", callback?: (err: AWSError, data: SageMaker.Types.DescribeImageResponse) => void): Request<SageMaker.Types.DescribeImageResponse, AWSError>;
  /**
   * Waits for the imageUpdated state by periodically calling the underlying SageMaker.describeImageoperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "imageUpdated", params: SageMaker.Types.DescribeImageRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeImageResponse) => void): Request<SageMaker.Types.DescribeImageResponse, AWSError>;
  /**
   * Waits for the imageUpdated state by periodically calling the underlying SageMaker.describeImageoperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "imageUpdated", callback?: (err: AWSError, data: SageMaker.Types.DescribeImageResponse) => void): Request<SageMaker.Types.DescribeImageResponse, AWSError>;
  /**
   * Waits for the imageDeleted state by periodically calling the underlying SageMaker.describeImageoperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "imageDeleted", params: SageMaker.Types.DescribeImageRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeImageResponse) => void): Request<SageMaker.Types.DescribeImageResponse, AWSError>;
  /**
   * Waits for the imageDeleted state by periodically calling the underlying SageMaker.describeImageoperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "imageDeleted", callback?: (err: AWSError, data: SageMaker.Types.DescribeImageResponse) => void): Request<SageMaker.Types.DescribeImageResponse, AWSError>;
  /**
   * Waits for the imageVersionCreated state by periodically calling the underlying SageMaker.describeImageVersionoperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "imageVersionCreated", params: SageMaker.Types.DescribeImageVersionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeImageVersionResponse) => void): Request<SageMaker.Types.DescribeImageVersionResponse, AWSError>;
  /**
   * Waits for the imageVersionCreated state by periodically calling the underlying SageMaker.describeImageVersionoperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "imageVersionCreated", callback?: (err: AWSError, data: SageMaker.Types.DescribeImageVersionResponse) => void): Request<SageMaker.Types.DescribeImageVersionResponse, AWSError>;
  /**
   * Waits for the imageVersionDeleted state by periodically calling the underlying SageMaker.describeImageVersionoperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "imageVersionDeleted", params: SageMaker.Types.DescribeImageVersionRequest & {$waiter?: WaiterConfiguration}, callback?: (err: AWSError, data: SageMaker.Types.DescribeImageVersionResponse) => void): Request<SageMaker.Types.DescribeImageVersionResponse, AWSError>;
  /**
   * Waits for the imageVersionDeleted state by periodically calling the underlying SageMaker.describeImageVersionoperation every 60 seconds (at most 60 times).
   */
  waitFor(state: "imageVersionDeleted", callback?: (err: AWSError, data: SageMaker.Types.DescribeImageVersionResponse) => void): Request<SageMaker.Types.DescribeImageVersionResponse, AWSError>;
}
declare namespace SageMaker {
  export type Accept = string;
  export type AccountId = string;
  export type ActionArn = string;
  export interface ActionSource {
    /**
     * The URI of the source.
     */
    SourceUri: String2048;
    /**
     * The type of the source.
     */
    SourceType?: String256;
    /**
     * The ID of the source.
     */
    SourceId?: String256;
  }
  export type ActionStatus = "Unknown"|"InProgress"|"Completed"|"Failed"|"Stopping"|"Stopped"|string;
  export type ActionSummaries = ActionSummary[];
  export interface ActionSummary {
    /**
     * The Amazon Resource Name (ARN) of the action.
     */
    ActionArn?: ActionArn;
    /**
     * The name of the action.
     */
    ActionName?: ExperimentEntityName;
    /**
     * The source of the action.
     */
    Source?: ActionSource;
    /**
     * The type of the action.
     */
    ActionType?: String64;
    /**
     * The status of the action.
     */
    Status?: ActionStatus;
    /**
     * When the action was created.
     */
    CreationTime?: Timestamp;
    /**
     * When the action was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export interface AddAssociationRequest {
    /**
     * The ARN of the source.
     */
    SourceArn: AssociationEntityArn;
    /**
     * The Amazon Resource Name (ARN) of the destination.
     */
    DestinationArn: AssociationEntityArn;
    /**
     * The type of association. The following are suggested uses for each type. Amazon SageMaker places no restrictions on their use.   ContributedTo - The source contributed to the destination or had a part in enabling the destination. For example, the training data contributed to the training job.   AssociatedWith - The source is connected to the destination. For example, an approval workflow is associated with a model deployment.   DerivedFrom - The destination is a modification of the source. For example, a digest output of a channel input for a processing job is derived from the original inputs.   Produced - The source generated the destination. For example, a training job produced a model artifact.  
     */
    AssociationType?: AssociationEdgeType;
  }
  export interface AddAssociationResponse {
    /**
     * The ARN of the source.
     */
    SourceArn?: AssociationEntityArn;
    /**
     * The Amazon Resource Name (ARN) of the destination.
     */
    DestinationArn?: AssociationEntityArn;
  }
  export interface AddTagsInput {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to tag.
     */
    ResourceArn: ResourceArn;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags: TagList;
  }
  export interface AddTagsOutput {
    /**
     * A list of tags associated with the Amazon SageMaker resource.
     */
    Tags?: TagList;
  }
  export type AdditionalCodeRepositoryNamesOrUrls = CodeRepositoryNameOrUrl[];
  export interface AgentVersion {
    /**
     * Version of the agent.
     */
    Version: EdgeVersion;
    /**
     * The number of Edge Manager agents.
     */
    AgentCount: Long;
  }
  export type AgentVersions = AgentVersion[];
  export interface Alarm {
    /**
     * The name of a CloudWatch alarm in your account.
     */
    AlarmName?: AlarmName;
  }
  export type AlarmList = Alarm[];
  export type AlarmName = string;
  export type AlgorithmArn = string;
  export type AlgorithmImage = string;
  export type AlgorithmSortBy = "Name"|"CreationTime"|string;
  export interface AlgorithmSpecification {
    /**
     * The registry path of the Docker image that contains the training algorithm. For information about docker registry paths for built-in algorithms, see Algorithms Provided by Amazon SageMaker: Common Parameters. Amazon SageMaker supports both registry/repository[:tag] and registry/repository[@digest] image path formats. For more information, see Using Your Own Algorithms with Amazon SageMaker.
     */
    TrainingImage?: AlgorithmImage;
    /**
     * The name of the algorithm resource to use for the training job. This must be an algorithm resource that you created or subscribe to on Amazon Web Services Marketplace. If you specify a value for this parameter, you can't specify a value for TrainingImage.
     */
    AlgorithmName?: ArnOrName;
    TrainingInputMode: TrainingInputMode;
    /**
     * A list of metric definition objects. Each object specifies the metric name and regular expressions used to parse algorithm logs. Amazon SageMaker publishes each metric to Amazon CloudWatch.
     */
    MetricDefinitions?: MetricDefinitionList;
    /**
     * To generate and save time-series metrics during training, set to true. The default is false and time-series metrics aren't generated except in the following cases:   You use one of the Amazon SageMaker built-in algorithms   You use one of the following Prebuilt Amazon SageMaker Docker Images:   Tensorflow (version &gt;= 1.15)   MXNet (version &gt;= 1.6)   PyTorch (version &gt;= 1.3)     You specify at least one MetricDefinition   
     */
    EnableSageMakerMetricsTimeSeries?: Boolean;
  }
  export type AlgorithmStatus = "Pending"|"InProgress"|"Completed"|"Failed"|"Deleting"|string;
  export interface AlgorithmStatusDetails {
    /**
     * The status of algorithm validation.
     */
    ValidationStatuses?: AlgorithmStatusItemList;
    /**
     * The status of the scan of the algorithm's Docker image container.
     */
    ImageScanStatuses?: AlgorithmStatusItemList;
  }
  export interface AlgorithmStatusItem {
    /**
     * The name of the algorithm for which the overall status is being reported.
     */
    Name: EntityName;
    /**
     * The current status.
     */
    Status: DetailedAlgorithmStatus;
    /**
     * if the overall status is Failed, the reason for the failure.
     */
    FailureReason?: String;
  }
  export type AlgorithmStatusItemList = AlgorithmStatusItem[];
  export interface AlgorithmSummary {
    /**
     * The name of the algorithm that is described by the summary.
     */
    AlgorithmName: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the algorithm.
     */
    AlgorithmArn: AlgorithmArn;
    /**
     * A brief description of the algorithm.
     */
    AlgorithmDescription?: EntityDescription;
    /**
     * A timestamp that shows when the algorithm was created.
     */
    CreationTime: CreationTime;
    /**
     * The overall status of the algorithm.
     */
    AlgorithmStatus: AlgorithmStatus;
  }
  export type AlgorithmSummaryList = AlgorithmSummary[];
  export interface AlgorithmValidationProfile {
    /**
     * The name of the profile for the algorithm. The name must have 1 to 63 characters. Valid characters are a-z, A-Z, 0-9, and - (hyphen).
     */
    ProfileName: EntityName;
    /**
     * The TrainingJobDefinition object that describes the training job that Amazon SageMaker runs to validate your algorithm.
     */
    TrainingJobDefinition: TrainingJobDefinition;
    /**
     * The TransformJobDefinition object that describes the transform job that Amazon SageMaker runs to validate your algorithm.
     */
    TransformJobDefinition?: TransformJobDefinition;
  }
  export type AlgorithmValidationProfiles = AlgorithmValidationProfile[];
  export interface AlgorithmValidationSpecification {
    /**
     * The IAM roles that Amazon SageMaker uses to run the training jobs.
     */
    ValidationRole: RoleArn;
    /**
     * An array of AlgorithmValidationProfile objects, each of which specifies a training job and batch transform job that Amazon SageMaker runs to validate your algorithm.
     */
    ValidationProfiles: AlgorithmValidationProfiles;
  }
  export interface AnnotationConsolidationConfig {
    /**
     * The Amazon Resource Name (ARN) of a Lambda function implements the logic for annotation consolidation and to process output data. This parameter is required for all labeling jobs. For built-in task types, use one of the following Amazon SageMaker Ground Truth Lambda function ARNs for AnnotationConsolidationLambdaArn. For custom labeling workflows, see Post-annotation Lambda.   Bounding box - Finds the most similar boxes from different workers based on the Jaccard index of the boxes.    arn:aws:lambda:us-east-1:432418664414:function:ACS-BoundingBox     arn:aws:lambda:us-east-2:266458841044:function:ACS-BoundingBox     arn:aws:lambda:us-west-2:081040173940:function:ACS-BoundingBox     arn:aws:lambda:eu-west-1:568282634449:function:ACS-BoundingBox     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-BoundingBox     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-BoundingBox     arn:aws:lambda:ap-south-1:565803892007:function:ACS-BoundingBox     arn:aws:lambda:eu-central-1:203001061592:function:ACS-BoundingBox     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-BoundingBox     arn:aws:lambda:eu-west-2:487402164563:function:ACS-BoundingBox     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-BoundingBox     arn:aws:lambda:ca-central-1:918755190332:function:ACS-BoundingBox     Image classification - Uses a variant of the Expectation Maximization approach to estimate the true class of an image based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:ACS-ImageMultiClass     arn:aws:lambda:us-east-2:266458841044:function:ACS-ImageMultiClass     arn:aws:lambda:us-west-2:081040173940:function:ACS-ImageMultiClass     arn:aws:lambda:eu-west-1:568282634449:function:ACS-ImageMultiClass     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-ImageMultiClass     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-ImageMultiClass     arn:aws:lambda:ap-south-1:565803892007:function:ACS-ImageMultiClass     arn:aws:lambda:eu-central-1:203001061592:function:ACS-ImageMultiClass     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-ImageMultiClass     arn:aws:lambda:eu-west-2:487402164563:function:ACS-ImageMultiClass     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-ImageMultiClass     arn:aws:lambda:ca-central-1:918755190332:function:ACS-ImageMultiClass     Multi-label image classification - Uses a variant of the Expectation Maximization approach to estimate the true classes of an image based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:us-east-2:266458841044:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:us-west-2:081040173940:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:eu-west-1:568282634449:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:ap-south-1:565803892007:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:eu-central-1:203001061592:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:eu-west-2:487402164563:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-ImageMultiClassMultiLabel     arn:aws:lambda:ca-central-1:918755190332:function:ACS-ImageMultiClassMultiLabel     Semantic segmentation - Treats each pixel in an image as a multi-class classification and treats pixel annotations from workers as "votes" for the correct label.    arn:aws:lambda:us-east-1:432418664414:function:ACS-SemanticSegmentation     arn:aws:lambda:us-east-2:266458841044:function:ACS-SemanticSegmentation     arn:aws:lambda:us-west-2:081040173940:function:ACS-SemanticSegmentation     arn:aws:lambda:eu-west-1:568282634449:function:ACS-SemanticSegmentation     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-SemanticSegmentation     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-SemanticSegmentation     arn:aws:lambda:ap-south-1:565803892007:function:ACS-SemanticSegmentation     arn:aws:lambda:eu-central-1:203001061592:function:ACS-SemanticSegmentation     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-SemanticSegmentation     arn:aws:lambda:eu-west-2:487402164563:function:ACS-SemanticSegmentation     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-SemanticSegmentation     arn:aws:lambda:ca-central-1:918755190332:function:ACS-SemanticSegmentation     Text classification - Uses a variant of the Expectation Maximization approach to estimate the true class of text based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:ACS-TextMultiClass     arn:aws:lambda:us-east-2:266458841044:function:ACS-TextMultiClass     arn:aws:lambda:us-west-2:081040173940:function:ACS-TextMultiClass     arn:aws:lambda:eu-west-1:568282634449:function:ACS-TextMultiClass     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-TextMultiClass     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-TextMultiClass     arn:aws:lambda:ap-south-1:565803892007:function:ACS-TextMultiClass     arn:aws:lambda:eu-central-1:203001061592:function:ACS-TextMultiClass     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-TextMultiClass     arn:aws:lambda:eu-west-2:487402164563:function:ACS-TextMultiClass     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-TextMultiClass     arn:aws:lambda:ca-central-1:918755190332:function:ACS-TextMultiClass     Multi-label text classification - Uses a variant of the Expectation Maximization approach to estimate the true classes of text based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:us-east-2:266458841044:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:us-west-2:081040173940:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:eu-west-1:568282634449:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:ap-south-1:565803892007:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:eu-central-1:203001061592:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:eu-west-2:487402164563:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-TextMultiClassMultiLabel     arn:aws:lambda:ca-central-1:918755190332:function:ACS-TextMultiClassMultiLabel     Named entity recognition - Groups similar selections and calculates aggregate boundaries, resolving to most-assigned label.    arn:aws:lambda:us-east-1:432418664414:function:ACS-NamedEntityRecognition     arn:aws:lambda:us-east-2:266458841044:function:ACS-NamedEntityRecognition     arn:aws:lambda:us-west-2:081040173940:function:ACS-NamedEntityRecognition     arn:aws:lambda:eu-west-1:568282634449:function:ACS-NamedEntityRecognition     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-NamedEntityRecognition     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-NamedEntityRecognition     arn:aws:lambda:ap-south-1:565803892007:function:ACS-NamedEntityRecognition     arn:aws:lambda:eu-central-1:203001061592:function:ACS-NamedEntityRecognition     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-NamedEntityRecognition     arn:aws:lambda:eu-west-2:487402164563:function:ACS-NamedEntityRecognition     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-NamedEntityRecognition     arn:aws:lambda:ca-central-1:918755190332:function:ACS-NamedEntityRecognition     Video Classification - Use this task type when you need workers to classify videos using predefined labels that you specify. Workers are shown videos and are asked to choose one label for each video.    arn:aws:lambda:us-east-1:432418664414:function:ACS-VideoMultiClass     arn:aws:lambda:us-east-2:266458841044:function:ACS-VideoMultiClass     arn:aws:lambda:us-west-2:081040173940:function:ACS-VideoMultiClass     arn:aws:lambda:eu-west-1:568282634449:function:ACS-VideoMultiClass     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-VideoMultiClass     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-VideoMultiClass     arn:aws:lambda:ap-south-1:565803892007:function:ACS-VideoMultiClass     arn:aws:lambda:eu-central-1:203001061592:function:ACS-VideoMultiClass     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-VideoMultiClass     arn:aws:lambda:eu-west-2:487402164563:function:ACS-VideoMultiClass     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-VideoMultiClass     arn:aws:lambda:ca-central-1:918755190332:function:ACS-VideoMultiClass     Video Frame Object Detection - Use this task type to have workers identify and locate objects in a sequence of video frames (images extracted from a video) using bounding boxes. For example, you can use this task to ask workers to identify and localize various objects in a series of video frames, such as cars, bikes, and pedestrians.    arn:aws:lambda:us-east-1:432418664414:function:ACS-VideoObjectDetection     arn:aws:lambda:us-east-2:266458841044:function:ACS-VideoObjectDetection     arn:aws:lambda:us-west-2:081040173940:function:ACS-VideoObjectDetection     arn:aws:lambda:eu-west-1:568282634449:function:ACS-VideoObjectDetection     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-VideoObjectDetection     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-VideoObjectDetection     arn:aws:lambda:ap-south-1:565803892007:function:ACS-VideoObjectDetection     arn:aws:lambda:eu-central-1:203001061592:function:ACS-VideoObjectDetection     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-VideoObjectDetection     arn:aws:lambda:eu-west-2:487402164563:function:ACS-VideoObjectDetection     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-VideoObjectDetection     arn:aws:lambda:ca-central-1:918755190332:function:ACS-VideoObjectDetection     Video Frame Object Tracking - Use this task type to have workers track the movement of objects in a sequence of video frames (images extracted from a video) using bounding boxes. For example, you can use this task to ask workers to track the movement of objects, such as cars, bikes, and pedestrians.     arn:aws:lambda:us-east-1:432418664414:function:ACS-VideoObjectTracking     arn:aws:lambda:us-east-2:266458841044:function:ACS-VideoObjectTracking     arn:aws:lambda:us-west-2:081040173940:function:ACS-VideoObjectTracking     arn:aws:lambda:eu-west-1:568282634449:function:ACS-VideoObjectTracking     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-VideoObjectTracking     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-VideoObjectTracking     arn:aws:lambda:ap-south-1:565803892007:function:ACS-VideoObjectTracking     arn:aws:lambda:eu-central-1:203001061592:function:ACS-VideoObjectTracking     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-VideoObjectTracking     arn:aws:lambda:eu-west-2:487402164563:function:ACS-VideoObjectTracking     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-VideoObjectTracking     arn:aws:lambda:ca-central-1:918755190332:function:ACS-VideoObjectTracking     3D Point Cloud Object Detection - Use this task type when you want workers to classify objects in a 3D point cloud by drawing 3D cuboids around objects. For example, you can use this task type to ask workers to identify different types of objects in a point cloud, such as cars, bikes, and pedestrians.    arn:aws:lambda:us-east-1:432418664414:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:us-east-2:266458841044:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:us-west-2:081040173940:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:eu-west-1:568282634449:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:ap-south-1:565803892007:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:eu-central-1:203001061592:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:eu-west-2:487402164563:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-3DPointCloudObjectDetection     arn:aws:lambda:ca-central-1:918755190332:function:ACS-3DPointCloudObjectDetection     3D Point Cloud Object Tracking - Use this task type when you want workers to draw 3D cuboids around objects that appear in a sequence of 3D point cloud frames. For example, you can use this task type to ask workers to track the movement of vehicles across multiple point cloud frames.     arn:aws:lambda:us-east-1:432418664414:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:us-east-2:266458841044:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:us-west-2:081040173940:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:eu-west-1:568282634449:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:ap-south-1:565803892007:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:eu-central-1:203001061592:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:eu-west-2:487402164563:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-3DPointCloudObjectTracking     arn:aws:lambda:ca-central-1:918755190332:function:ACS-3DPointCloudObjectTracking     3D Point Cloud Semantic Segmentation - Use this task type when you want workers to create a point-level semantic segmentation masks by painting objects in a 3D point cloud using different colors where each color is assigned to one of the classes you specify.    arn:aws:lambda:us-east-1:432418664414:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:us-east-2:266458841044:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:us-west-2:081040173940:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-west-1:568282634449:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-south-1:565803892007:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-central-1:203001061592:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-west-2:487402164563:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:ca-central-1:918755190332:function:ACS-3DPointCloudSemanticSegmentation     Use the following ARNs for Label Verification and Adjustment Jobs  Use label verification and adjustment jobs to review and adjust labels. To learn more, see Verify and Adjust Labels .  Semantic Segmentation Adjustment - Treats each pixel in an image as a multi-class classification and treats pixel adjusted annotations from workers as "votes" for the correct label.    arn:aws:lambda:us-east-1:432418664414:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:us-east-2:266458841044:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:us-west-2:081040173940:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:eu-west-1:568282634449:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:ap-south-1:565803892007:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:eu-central-1:203001061592:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:eu-west-2:487402164563:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-AdjustmentSemanticSegmentation     arn:aws:lambda:ca-central-1:918755190332:function:ACS-AdjustmentSemanticSegmentation     Semantic Segmentation Verification - Uses a variant of the Expectation Maximization approach to estimate the true class of verification judgment for semantic segmentation labels based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:us-east-2:266458841044:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:us-west-2:081040173940:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:eu-west-1:568282634449:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:ap-south-1:565803892007:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:eu-central-1:203001061592:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:eu-west-2:487402164563:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-VerificationSemanticSegmentation     arn:aws:lambda:ca-central-1:918755190332:function:ACS-VerificationSemanticSegmentation     Bounding Box Adjustment - Finds the most similar boxes from different workers based on the Jaccard index of the adjusted annotations.    arn:aws:lambda:us-east-1:432418664414:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:us-east-2:266458841044:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:us-west-2:081040173940:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:eu-west-1:568282634449:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:ap-south-1:565803892007:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:eu-central-1:203001061592:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:eu-west-2:487402164563:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-AdjustmentBoundingBox     arn:aws:lambda:ca-central-1:918755190332:function:ACS-AdjustmentBoundingBox     Bounding Box Verification - Uses a variant of the Expectation Maximization approach to estimate the true class of verification judgement for bounding box labels based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:ACS-VerificationBoundingBox     arn:aws:lambda:us-east-2:266458841044:function:ACS-VerificationBoundingBox     arn:aws:lambda:us-west-2:081040173940:function:ACS-VerificationBoundingBox     arn:aws:lambda:eu-west-1:568282634449:function:ACS-VerificationBoundingBox     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-VerificationBoundingBox     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-VerificationBoundingBox     arn:aws:lambda:ap-south-1:565803892007:function:ACS-VerificationBoundingBox     arn:aws:lambda:eu-central-1:203001061592:function:ACS-VerificationBoundingBox     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-VerificationBoundingBox     arn:aws:lambda:eu-west-2:487402164563:function:ACS-VerificationBoundingBox     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-VerificationBoundingBox     arn:aws:lambda:ca-central-1:918755190332:function:ACS-VerificationBoundingBox     Video Frame Object Detection Adjustment - Use this task type when you want workers to adjust bounding boxes that workers have added to video frames to classify and localize objects in a sequence of video frames.    arn:aws:lambda:us-east-1:432418664414:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:us-east-2:266458841044:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:us-west-2:081040173940:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:eu-west-1:568282634449:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:ap-south-1:565803892007:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:eu-central-1:203001061592:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:eu-west-2:487402164563:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-AdjustmentVideoObjectDetection     arn:aws:lambda:ca-central-1:918755190332:function:ACS-AdjustmentVideoObjectDetection     Video Frame Object Tracking Adjustment - Use this task type when you want workers to adjust bounding boxes that workers have added to video frames to track object movement across a sequence of video frames.    arn:aws:lambda:us-east-1:432418664414:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:us-east-2:266458841044:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:us-west-2:081040173940:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:eu-west-1:568282634449:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:ap-south-1:565803892007:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:eu-central-1:203001061592:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:eu-west-2:487402164563:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-AdjustmentVideoObjectTracking     arn:aws:lambda:ca-central-1:918755190332:function:ACS-AdjustmentVideoObjectTracking     3D Point Cloud Object Detection Adjustment - Use this task type when you want workers to adjust 3D cuboids around objects in a 3D point cloud.     arn:aws:lambda:us-east-1:432418664414:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:us-east-2:266458841044:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:us-west-2:081040173940:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:eu-west-1:568282634449:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ap-south-1:565803892007:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:eu-central-1:203001061592:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:eu-west-2:487402164563:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ca-central-1:918755190332:function:ACS-Adjustment3DPointCloudObjectDetection     3D Point Cloud Object Tracking Adjustment - Use this task type when you want workers to adjust 3D cuboids around objects that appear in a sequence of 3D point cloud frames.    arn:aws:lambda:us-east-1:432418664414:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:us-east-2:266458841044:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:us-west-2:081040173940:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:eu-west-1:568282634449:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ap-south-1:565803892007:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:eu-central-1:203001061592:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:eu-west-2:487402164563:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ca-central-1:918755190332:function:ACS-Adjustment3DPointCloudObjectTracking     3D Point Cloud Semantic Segmentation Adjustment - Use this task type when you want workers to adjust a point-level semantic segmentation masks using a paint tool.    arn:aws:lambda:us-east-1:432418664414:function:ACS-3DPointCloudSemanticSegmentation     arn:aws:lambda:us-east-1:432418664414:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:us-east-2:266458841044:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:us-west-2:081040173940:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-west-1:568282634449:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-northeast-1:477331159723:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-southeast-2:454466003867:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-south-1:565803892007:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-central-1:203001061592:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-northeast-2:845288260483:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-west-2:487402164563:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-southeast-1:377565633583:function:ACS-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ca-central-1:918755190332:function:ACS-Adjustment3DPointCloudSemanticSegmentation   
     */
    AnnotationConsolidationLambdaArn: LambdaFunctionArn;
  }
  export type AppArn = string;
  export interface AppDetails {
    /**
     * The domain ID.
     */
    DomainId?: DomainId;
    /**
     * The user profile name.
     */
    UserProfileName?: UserProfileName;
    /**
     * The type of app.
     */
    AppType?: AppType;
    /**
     * The name of the app.
     */
    AppName?: AppName;
    /**
     * The status.
     */
    Status?: AppStatus;
    /**
     * The creation time.
     */
    CreationTime?: CreationTime;
  }
  export type AppImageConfigArn = string;
  export interface AppImageConfigDetails {
    /**
     * The Amazon Resource Name (ARN) of the AppImageConfig.
     */
    AppImageConfigArn?: AppImageConfigArn;
    /**
     * The name of the AppImageConfig. Must be unique to your account.
     */
    AppImageConfigName?: AppImageConfigName;
    /**
     * When the AppImageConfig was created.
     */
    CreationTime?: Timestamp;
    /**
     * When the AppImageConfig was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The configuration for the file system and kernels in the SageMaker image.
     */
    KernelGatewayImageConfig?: KernelGatewayImageConfig;
  }
  export type AppImageConfigList = AppImageConfigDetails[];
  export type AppImageConfigName = string;
  export type AppImageConfigSortKey = "CreationTime"|"LastModifiedTime"|"Name"|string;
  export type AppInstanceType = "system"|"ml.t3.micro"|"ml.t3.small"|"ml.t3.medium"|"ml.t3.large"|"ml.t3.xlarge"|"ml.t3.2xlarge"|"ml.m5.large"|"ml.m5.xlarge"|"ml.m5.2xlarge"|"ml.m5.4xlarge"|"ml.m5.8xlarge"|"ml.m5.12xlarge"|"ml.m5.16xlarge"|"ml.m5.24xlarge"|"ml.m5d.large"|"ml.m5d.xlarge"|"ml.m5d.2xlarge"|"ml.m5d.4xlarge"|"ml.m5d.8xlarge"|"ml.m5d.12xlarge"|"ml.m5d.16xlarge"|"ml.m5d.24xlarge"|"ml.c5.large"|"ml.c5.xlarge"|"ml.c5.2xlarge"|"ml.c5.4xlarge"|"ml.c5.9xlarge"|"ml.c5.12xlarge"|"ml.c5.18xlarge"|"ml.c5.24xlarge"|"ml.p3.2xlarge"|"ml.p3.8xlarge"|"ml.p3.16xlarge"|"ml.p3dn.24xlarge"|"ml.g4dn.xlarge"|"ml.g4dn.2xlarge"|"ml.g4dn.4xlarge"|"ml.g4dn.8xlarge"|"ml.g4dn.12xlarge"|"ml.g4dn.16xlarge"|"ml.r5.large"|"ml.r5.xlarge"|"ml.r5.2xlarge"|"ml.r5.4xlarge"|"ml.r5.8xlarge"|"ml.r5.12xlarge"|"ml.r5.16xlarge"|"ml.r5.24xlarge"|string;
  export type AppList = AppDetails[];
  export type AppManaged = boolean;
  export type AppName = string;
  export type AppNetworkAccessType = "PublicInternetOnly"|"VpcOnly"|string;
  export type AppSecurityGroupManagement = "Service"|"Customer"|string;
  export type AppSortKey = "CreationTime"|string;
  export interface AppSpecification {
    /**
     * The container image to be run by the processing job.
     */
    ImageUri: ImageUri;
    /**
     * The entrypoint for a container used to run a processing job.
     */
    ContainerEntrypoint?: ContainerEntrypoint;
    /**
     * The arguments for a container used to run a processing job.
     */
    ContainerArguments?: ContainerArguments;
  }
  export type AppStatus = "Deleted"|"Deleting"|"Failed"|"InService"|"Pending"|string;
  export type AppType = "JupyterServer"|"KernelGateway"|"TensorBoard"|"RStudioServerPro"|"RSessionGateway"|string;
  export type ApprovalDescription = string;
  export type ArnOrName = string;
  export type ArtifactArn = string;
  export type ArtifactDigest = string;
  export interface ArtifactSource {
    /**
     * The URI of the source.
     */
    SourceUri: String2048;
    /**
     * A list of source types.
     */
    SourceTypes?: ArtifactSourceTypes;
  }
  export type ArtifactSourceIdType = "MD5Hash"|"S3ETag"|"S3Version"|"Custom"|string;
  export interface ArtifactSourceType {
    /**
     * The type of ID.
     */
    SourceIdType: ArtifactSourceIdType;
    /**
     * The ID.
     */
    Value: String256;
  }
  export type ArtifactSourceTypes = ArtifactSourceType[];
  export type ArtifactSummaries = ArtifactSummary[];
  export interface ArtifactSummary {
    /**
     * The Amazon Resource Name (ARN) of the artifact.
     */
    ArtifactArn?: ArtifactArn;
    /**
     * The name of the artifact.
     */
    ArtifactName?: ExperimentEntityName;
    /**
     * The source of the artifact.
     */
    Source?: ArtifactSource;
    /**
     * The type of the artifact.
     */
    ArtifactType?: String256;
    /**
     * When the artifact was created.
     */
    CreationTime?: Timestamp;
    /**
     * When the artifact was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export type AssemblyType = "None"|"Line"|string;
  export interface AssociateTrialComponentRequest {
    /**
     * The name of the component to associated with the trial.
     */
    TrialComponentName: ExperimentEntityName;
    /**
     * The name of the trial to associate with.
     */
    TrialName: ExperimentEntityName;
  }
  export interface AssociateTrialComponentResponse {
    /**
     * The ARN of the trial component.
     */
    TrialComponentArn?: TrialComponentArn;
    /**
     * The Amazon Resource Name (ARN) of the trial.
     */
    TrialArn?: TrialArn;
  }
  export type AssociationEdgeType = "ContributedTo"|"AssociatedWith"|"DerivedFrom"|"Produced"|string;
  export type AssociationEntityArn = string;
  export type AssociationSummaries = AssociationSummary[];
  export interface AssociationSummary {
    /**
     * The ARN of the source.
     */
    SourceArn?: AssociationEntityArn;
    /**
     * The Amazon Resource Name (ARN) of the destination.
     */
    DestinationArn?: AssociationEntityArn;
    /**
     * The source type.
     */
    SourceType?: String256;
    /**
     * The destination type.
     */
    DestinationType?: String256;
    /**
     * The type of the association.
     */
    AssociationType?: AssociationEdgeType;
    /**
     * The name of the source.
     */
    SourceName?: ExperimentEntityName;
    /**
     * The name of the destination.
     */
    DestinationName?: ExperimentEntityName;
    /**
     * When the association was created.
     */
    CreationTime?: Timestamp;
    CreatedBy?: UserContext;
  }
  export interface AsyncInferenceClientConfig {
    /**
     * The maximum number of concurrent requests sent by the SageMaker client to the model container. If no value is provided, Amazon SageMaker will choose an optimal value for you.
     */
    MaxConcurrentInvocationsPerInstance?: MaxConcurrentInvocationsPerInstance;
  }
  export interface AsyncInferenceConfig {
    /**
     * Configures the behavior of the client used by Amazon SageMaker to interact with the model container during asynchronous inference.
     */
    ClientConfig?: AsyncInferenceClientConfig;
    /**
     * Specifies the configuration for asynchronous inference invocation outputs.
     */
    OutputConfig: AsyncInferenceOutputConfig;
  }
  export interface AsyncInferenceNotificationConfig {
    /**
     * Amazon SNS topic to post a notification to when inference completes successfully. If no topic is provided, no notification is sent on success.
     */
    SuccessTopic?: SnsTopicArn;
    /**
     * Amazon SNS topic to post a notification to when inference fails. If no topic is provided, no notification is sent on failure.
     */
    ErrorTopic?: SnsTopicArn;
  }
  export interface AsyncInferenceOutputConfig {
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt the asynchronous inference output in Amazon S3. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The Amazon S3 location to upload inference responses to.
     */
    S3OutputPath: DestinationS3Uri;
    /**
     * Specifies the configuration for notifications of inference results for asynchronous inference.
     */
    NotificationConfig?: AsyncInferenceNotificationConfig;
  }
  export type AthenaCatalog = string;
  export type AthenaDatabase = string;
  export interface AthenaDatasetDefinition {
    Catalog: AthenaCatalog;
    Database: AthenaDatabase;
    QueryString: AthenaQueryString;
    WorkGroup?: AthenaWorkGroup;
    /**
     * The location in Amazon S3 where Athena query results are stored.
     */
    OutputS3Uri: S3Uri;
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt data generated from an Athena query execution.
     */
    KmsKeyId?: KmsKeyId;
    OutputFormat: AthenaResultFormat;
    OutputCompression?: AthenaResultCompressionType;
  }
  export type AthenaQueryString = string;
  export type AthenaResultCompressionType = "GZIP"|"SNAPPY"|"ZLIB"|string;
  export type AthenaResultFormat = "PARQUET"|"ORC"|"AVRO"|"JSON"|"TEXTFILE"|string;
  export type AthenaWorkGroup = string;
  export type AttributeName = string;
  export type AttributeNames = AttributeName[];
  export type AuthMode = "SSO"|"IAM"|string;
  export type AutoGenerateEndpointName = boolean;
  export interface AutoMLCandidate {
    /**
     * The name of the candidate.
     */
    CandidateName: CandidateName;
    FinalAutoMLJobObjectiveMetric?: FinalAutoMLJobObjectiveMetric;
    /**
     * The objective's status.
     */
    ObjectiveStatus: ObjectiveStatus;
    /**
     * Information about the candidate's steps.
     */
    CandidateSteps: CandidateSteps;
    /**
     * The candidate's status.
     */
    CandidateStatus: CandidateStatus;
    /**
     * Information about the inference container definitions.
     */
    InferenceContainers?: AutoMLContainerDefinitions;
    /**
     * The creation time.
     */
    CreationTime: Timestamp;
    /**
     * The end time.
     */
    EndTime?: Timestamp;
    /**
     * The last modified time.
     */
    LastModifiedTime: Timestamp;
    /**
     * The failure reason.
     */
    FailureReason?: AutoMLFailureReason;
    /**
     * The properties of an AutoML candidate job.
     */
    CandidateProperties?: CandidateProperties;
  }
  export interface AutoMLCandidateStep {
    /**
     * Whether the candidate is at the transform, training, or processing step.
     */
    CandidateStepType: CandidateStepType;
    /**
     * The ARN for the candidate's step.
     */
    CandidateStepArn: CandidateStepArn;
    /**
     * The name for the candidate's step.
     */
    CandidateStepName: CandidateStepName;
  }
  export type AutoMLCandidates = AutoMLCandidate[];
  export interface AutoMLChannel {
    /**
     * The data source for an AutoML channel.
     */
    DataSource: AutoMLDataSource;
    /**
     * You can use Gzip or None. The default value is None.
     */
    CompressionType?: CompressionType;
    /**
     * The name of the target variable in supervised learning, usually represented by 'y'.
     */
    TargetAttributeName: TargetAttributeName;
  }
  export interface AutoMLContainerDefinition {
    /**
     * The Amazon Elastic Container Registry (Amazon ECR) path of the container. For more information, see .
     */
    Image: ContainerImage;
    /**
     * The location of the model artifacts. For more information, see .
     */
    ModelDataUrl: Url;
    /**
     * The environment variables to set in the container. For more information, see .
     */
    Environment?: EnvironmentMap;
  }
  export type AutoMLContainerDefinitions = AutoMLContainerDefinition[];
  export interface AutoMLDataSource {
    /**
     * The Amazon S3 location of the input data.  The input data must be in CSV format and contain at least 500 rows. 
     */
    S3DataSource: AutoMLS3DataSource;
  }
  export type AutoMLFailureReason = string;
  export type AutoMLInputDataConfig = AutoMLChannel[];
  export type AutoMLJobArn = string;
  export interface AutoMLJobArtifacts {
    /**
     * The URL of the notebook location.
     */
    CandidateDefinitionNotebookLocation?: CandidateDefinitionNotebookLocation;
    /**
     * The URL of the notebook location.
     */
    DataExplorationNotebookLocation?: DataExplorationNotebookLocation;
  }
  export interface AutoMLJobCompletionCriteria {
    /**
     * The maximum number of times a training job is allowed to run.
     */
    MaxCandidates?: MaxCandidates;
    /**
     * The maximum time, in seconds, that each training job is allowed to run as part of a hyperparameter tuning job. For more information, see the used by the action.
     */
    MaxRuntimePerTrainingJobInSeconds?: MaxRuntimePerTrainingJobInSeconds;
    /**
     * The maximum runtime, in seconds, an AutoML job has to complete. If an AutoML job exceeds the maximum runtime, the job is stopped automatically and its processing is ended gracefully. The AutoML job identifies the best model whose training was completed and marks it as the best-performing model. Any unfinished steps of the job, such as automatic one-click Autopilot model deployment, will not be completed. 
     */
    MaxAutoMLJobRuntimeInSeconds?: MaxAutoMLJobRuntimeInSeconds;
  }
  export interface AutoMLJobConfig {
    /**
     * How long an AutoML job is allowed to run, or how many candidates a job is allowed to generate.
     */
    CompletionCriteria?: AutoMLJobCompletionCriteria;
    /**
     * The security configuration for traffic encryption or Amazon VPC settings.
     */
    SecurityConfig?: AutoMLSecurityConfig;
  }
  export type AutoMLJobName = string;
  export interface AutoMLJobObjective {
    /**
     * The name of the objective metric used to measure the predictive quality of a machine learning system. This metric is optimized during training to provide the best estimate for model parameter values from data. Here are the options:    MSE: The mean squared error (MSE) is the average of the squared differences between the predicted and actual values. It is used for regression. MSE values are always positive: the better a model is at predicting the actual values, the smaller the MSE value is. When the data contains outliers, they tend to dominate the MSE, which might cause subpar prediction performance.    Accuracy: The ratio of the number of correctly classified items to the total number of (correctly and incorrectly) classified items. It is used for binary and multiclass classification. It measures how close the predicted class values are to the actual values. Accuracy values vary between zero and one: one indicates perfect accuracy and zero indicates perfect inaccuracy.    F1: The F1 score is the harmonic mean of the precision and recall. It is used for binary classification into classes traditionally referred to as positive and negative. Predictions are said to be true when they match their actual (correct) class and false when they do not. Precision is the ratio of the true positive predictions to all positive predictions (including the false positives) in a data set and measures the quality of the prediction when it predicts the positive class. Recall (or sensitivity) is the ratio of the true positive predictions to all actual positive instances and measures how completely a model predicts the actual class members in a data set. The standard F1 score weighs precision and recall equally. But which metric is paramount typically depends on specific aspects of a problem. F1 scores vary between zero and one: one indicates the best possible performance and zero the worst.    AUC: The area under the curve (AUC) metric is used to compare and evaluate binary classification by algorithms such as logistic regression that return probabilities. A threshold is needed to map the probabilities into classifications. The relevant curve is the receiver operating characteristic curve that plots the true positive rate (TPR) of predictions (or recall) against the false positive rate (FPR) as a function of the threshold value, above which a prediction is considered positive. Increasing the threshold results in fewer false positives but more false negatives. AUC is the area under this receiver operating characteristic curve and so provides an aggregated measure of the model performance across all possible classification thresholds. The AUC score can also be interpreted as the probability that a randomly selected positive data point is more likely to be predicted positive than a randomly selected negative example. AUC scores vary between zero and one: a score of one indicates perfect accuracy and a score of one half indicates that the prediction is not better than a random classifier. Values under one half predict less accurately than a random predictor. But such consistently bad predictors can simply be inverted to obtain better than random predictors.    F1macro: The F1macro score applies F1 scoring to multiclass classification. In this context, you have multiple classes to predict. You just calculate the precision and recall for each class as you did for the positive class in binary classification. Then, use these values to calculate the F1 score for each class and average them to obtain the F1macro score. F1macro scores vary between zero and one: one indicates the best possible performance and zero the worst.   If you do not specify a metric explicitly, the default behavior is to automatically use:    MSE: for regression.    F1: for binary classification    Accuracy: for multiclass classification.  
     */
    MetricName: AutoMLMetricEnum;
  }
  export type AutoMLJobObjectiveType = "Maximize"|"Minimize"|string;
  export type AutoMLJobSecondaryStatus = "Starting"|"AnalyzingData"|"FeatureEngineering"|"ModelTuning"|"MaxCandidatesReached"|"Failed"|"Stopped"|"MaxAutoMLJobRuntimeReached"|"Stopping"|"CandidateDefinitionsGenerated"|"GeneratingExplainabilityReport"|"Completed"|"ExplainabilityError"|"DeployingModel"|"ModelDeploymentError"|string;
  export type AutoMLJobStatus = "Completed"|"InProgress"|"Failed"|"Stopped"|"Stopping"|string;
  export type AutoMLJobSummaries = AutoMLJobSummary[];
  export interface AutoMLJobSummary {
    /**
     * The name of the AutoML job you are requesting.
     */
    AutoMLJobName: AutoMLJobName;
    /**
     * The ARN of the AutoML job.
     */
    AutoMLJobArn: AutoMLJobArn;
    /**
     * The status of the AutoML job.
     */
    AutoMLJobStatus: AutoMLJobStatus;
    /**
     * The secondary status of the AutoML job.
     */
    AutoMLJobSecondaryStatus: AutoMLJobSecondaryStatus;
    /**
     * When the AutoML job was created.
     */
    CreationTime: Timestamp;
    /**
     * The end time of an AutoML job.
     */
    EndTime?: Timestamp;
    /**
     * When the AutoML job was last modified.
     */
    LastModifiedTime: Timestamp;
    /**
     * The failure reason of an AutoML job.
     */
    FailureReason?: AutoMLFailureReason;
    /**
     * The list of reasons for partial failures within an AutoML job.
     */
    PartialFailureReasons?: AutoMLPartialFailureReasons;
  }
  export type AutoMLMaxResults = number;
  export type AutoMLMetricEnum = "Accuracy"|"MSE"|"F1"|"F1macro"|"AUC"|string;
  export type AutoMLNameContains = string;
  export interface AutoMLOutputDataConfig {
    /**
     * The Amazon Web Services KMS encryption key ID.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The Amazon S3 output path. Must be 128 characters or less.
     */
    S3OutputPath: S3Uri;
  }
  export interface AutoMLPartialFailureReason {
    /**
     * The message containing the reason for a partial failure of an AutoML job.
     */
    PartialFailureMessage?: AutoMLFailureReason;
  }
  export type AutoMLPartialFailureReasons = AutoMLPartialFailureReason[];
  export interface AutoMLS3DataSource {
    /**
     * The data type.
     */
    S3DataType: AutoMLS3DataType;
    /**
     * The URL to the Amazon S3 data source.
     */
    S3Uri: S3Uri;
  }
  export type AutoMLS3DataType = "ManifestFile"|"S3Prefix"|string;
  export interface AutoMLSecurityConfig {
    /**
     * The key used to encrypt stored data.
     */
    VolumeKmsKeyId?: KmsKeyId;
    /**
     * Whether to use traffic encryption between the container layers.
     */
    EnableInterContainerTrafficEncryption?: Boolean;
    /**
     * The VPC configuration.
     */
    VpcConfig?: VpcConfig;
  }
  export type AutoMLSortBy = "Name"|"CreationTime"|"Status"|string;
  export type AutoMLSortOrder = "Ascending"|"Descending"|string;
  export interface AutoRollbackConfig {
    /**
     * List of CloudWatch alarms in your account that are configured to monitor metrics on an endpoint. If any alarms are tripped during a deployment, SageMaker rolls back the deployment.
     */
    Alarms?: AlarmList;
  }
  export type AwsManagedHumanLoopRequestSource = "AWS/Rekognition/DetectModerationLabels/Image/V3"|"AWS/Textract/AnalyzeDocument/Forms/V1"|string;
  export interface BatchDescribeModelPackageError {
    /**
     * 
     */
    ErrorCode: String;
    /**
     * 
     */
    ErrorResponse: String;
  }
  export type BatchDescribeModelPackageErrorMap = {[key: string]: BatchDescribeModelPackageError};
  export interface BatchDescribeModelPackageInput {
    /**
     * The list of Amazon Resource Name (ARN) of the model package groups.
     */
    ModelPackageArnList: ModelPackageArnList;
  }
  export interface BatchDescribeModelPackageOutput {
    /**
     * The summaries for the model package versions
     */
    ModelPackageSummaries?: ModelPackageSummaries;
    /**
     * A map of the resource and BatchDescribeModelPackageError objects reporting the error associated with describing the model package.
     */
    BatchDescribeModelPackageErrorMap?: BatchDescribeModelPackageErrorMap;
  }
  export interface BatchDescribeModelPackageSummary {
    /**
     * The group name for the model package
     */
    ModelPackageGroupName: EntityName;
    /**
     * The version number of a versioned model.
     */
    ModelPackageVersion?: ModelPackageVersion;
    /**
     * The Amazon Resource Name (ARN) of the model package.
     */
    ModelPackageArn: ModelPackageArn;
    /**
     * The description of the model package.
     */
    ModelPackageDescription?: EntityDescription;
    /**
     * The creation time of the mortgage package summary.
     */
    CreationTime: CreationTime;
    InferenceSpecification: InferenceSpecification;
    /**
     * The status of the mortgage package.
     */
    ModelPackageStatus: ModelPackageStatus;
    /**
     * The approval status of the model.
     */
    ModelApprovalStatus?: ModelApprovalStatus;
  }
  export type BatchStrategy = "MultiRecord"|"SingleRecord"|string;
  export interface Bias {
    /**
     * The bias report for a model
     */
    Report?: MetricsSource;
  }
  export type BillableTimeInSeconds = number;
  export type BlockedReason = string;
  export interface BlueGreenUpdatePolicy {
    /**
     * Defines the traffic routing strategy to shift traffic from the old fleet to the new fleet during an endpoint deployment.
     */
    TrafficRoutingConfiguration: TrafficRoutingConfig;
    /**
     * Additional waiting time in seconds after the completion of an endpoint deployment before terminating the old endpoint fleet. Default is 0.
     */
    TerminationWaitInSeconds?: TerminationWaitInSeconds;
    /**
     * Maximum execution timeout for the deployment. Note that the timeout value should be larger than the total waiting time specified in TerminationWaitInSeconds and WaitIntervalInSeconds.
     */
    MaximumExecutionTimeoutInSeconds?: MaximumExecutionTimeoutInSeconds;
  }
  export type Boolean = boolean;
  export type BooleanOperator = "And"|"Or"|string;
  export type Branch = string;
  export interface CacheHitResult {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    SourcePipelineExecutionArn?: PipelineExecutionArn;
  }
  export interface CallbackStepMetadata {
    /**
     * The pipeline generated token from the Amazon SQS queue.
     */
    CallbackToken?: CallbackToken;
    /**
     * The URL of the Amazon Simple Queue Service (Amazon SQS) queue used by the callback step.
     */
    SqsQueueUrl?: String256;
    /**
     * A list of the output parameters of the callback step.
     */
    OutputParameters?: OutputParameterList;
  }
  export type CallbackToken = string;
  export interface CandidateArtifactLocations {
    /**
     * The Amazon S3 prefix to the explainability artifacts generated for the AutoML candidate.
     */
    Explainability: ExplainabilityLocation;
  }
  export type CandidateDefinitionNotebookLocation = string;
  export type CandidateName = string;
  export interface CandidateProperties {
    /**
     * The Amazon S3 prefix to the artifacts generated for an AutoML candidate.
     */
    CandidateArtifactLocations?: CandidateArtifactLocations;
    /**
     * Information about the candidate metrics for an AutoML job.
     */
    CandidateMetrics?: MetricDataList;
  }
  export type CandidateSortBy = "CreationTime"|"Status"|"FinalObjectiveMetricValue"|string;
  export type CandidateStatus = "Completed"|"InProgress"|"Failed"|"Stopped"|"Stopping"|string;
  export type CandidateStepArn = string;
  export type CandidateStepName = string;
  export type CandidateStepType = "AWS::SageMaker::TrainingJob"|"AWS::SageMaker::TransformJob"|"AWS::SageMaker::ProcessingJob"|string;
  export type CandidateSteps = AutoMLCandidateStep[];
  export interface CapacitySize {
    /**
     * Specifies the endpoint capacity type.    INSTANCE_COUNT: The endpoint activates based on the number of instances.    CAPACITY_PERCENT: The endpoint activates based on the specified percentage of capacity.  
     */
    Type: CapacitySizeType;
    /**
     * Defines the capacity size, either as a number of instances or a capacity percentage.
     */
    Value: CapacitySizeValue;
  }
  export type CapacitySizeType = "INSTANCE_COUNT"|"CAPACITY_PERCENT"|string;
  export type CapacitySizeValue = number;
  export interface CaptureContentTypeHeader {
    /**
     * 
     */
    CsvContentTypes?: CsvContentTypes;
    /**
     * 
     */
    JsonContentTypes?: JsonContentTypes;
  }
  export type CaptureMode = "Input"|"Output"|string;
  export interface CaptureOption {
    /**
     * 
     */
    CaptureMode: CaptureMode;
  }
  export type CaptureOptionList = CaptureOption[];
  export type CaptureStatus = "Started"|"Stopped"|string;
  export type Catalog = string;
  export interface CategoricalParameterRange {
    /**
     * The name of the categorical hyperparameter to tune.
     */
    Name: ParameterKey;
    /**
     * A list of the categories for the hyperparameter.
     */
    Values: ParameterValues;
  }
  export interface CategoricalParameterRangeSpecification {
    /**
     * The allowed categories for the hyperparameter.
     */
    Values: ParameterValues;
  }
  export type CategoricalParameterRanges = CategoricalParameterRange[];
  export type Cents = number;
  export type CertifyForMarketplace = boolean;
  export interface Channel {
    /**
     * The name of the channel. 
     */
    ChannelName: ChannelName;
    /**
     * The location of the channel data.
     */
    DataSource: DataSource;
    /**
     * The MIME type of the data.
     */
    ContentType?: ContentType;
    /**
     * If training data is compressed, the compression type. The default value is None. CompressionType is used only in Pipe input mode. In File mode, leave this field unset or set it to None.
     */
    CompressionType?: CompressionType;
    /**
     *  Specify RecordIO as the value when input data is in raw format but the training algorithm requires the RecordIO format. In this case, Amazon SageMaker wraps each individual S3 object in a RecordIO record. If the input data is already in RecordIO format, you don't need to set this attribute. For more information, see Create a Dataset Using RecordIO.  In File mode, leave this field unset or set it to None.
     */
    RecordWrapperType?: RecordWrapper;
    /**
     * (Optional) The input mode to use for the data channel in a training job. If you don't set a value for InputMode, Amazon SageMaker uses the value set for TrainingInputMode. Use this parameter to override the TrainingInputMode setting in a AlgorithmSpecification request when you have a channel that needs a different input mode from the training job's general setting. To download the data from Amazon Simple Storage Service (Amazon S3) to the provisioned ML storage volume, and mount the directory to a Docker volume, use File input mode. To stream data directly from Amazon S3 to the container, choose Pipe input mode. To use a model for incremental training, choose File input model.
     */
    InputMode?: TrainingInputMode;
    /**
     * A configuration for a shuffle option for input data in a channel. If you use S3Prefix for S3DataType, this shuffles the results of the S3 key prefix matches. If you use ManifestFile, the order of the S3 object references in the ManifestFile is shuffled. If you use AugmentedManifestFile, the order of the JSON lines in the AugmentedManifestFile is shuffled. The shuffling order is determined using the Seed value. For Pipe input mode, shuffling is done at the start of every epoch. With large datasets this ensures that the order of the training data is different for each epoch, it helps reduce bias and possible overfitting. In a multi-node training job when ShuffleConfig is combined with S3DataDistributionType of ShardedByS3Key, the data is shuffled across nodes so that the content sent to a particular node on the first epoch might be sent to a different node on the second epoch.
     */
    ShuffleConfig?: ShuffleConfig;
  }
  export type ChannelName = string;
  export interface ChannelSpecification {
    /**
     * The name of the channel.
     */
    Name: ChannelName;
    /**
     * A brief description of the channel.
     */
    Description?: EntityDescription;
    /**
     * Indicates whether the channel is required by the algorithm.
     */
    IsRequired?: Boolean;
    /**
     * The supported MIME types for the data.
     */
    SupportedContentTypes: ContentTypes;
    /**
     * The allowed compression types, if data compression is used.
     */
    SupportedCompressionTypes?: CompressionTypes;
    /**
     * The allowed input mode, either FILE or PIPE. In FILE mode, Amazon SageMaker copies the data from the input source onto the local Amazon Elastic Block Store (Amazon EBS) volumes before starting your training algorithm. This is the most commonly used input mode. In PIPE mode, Amazon SageMaker streams input data from the source directly to your algorithm without using the EBS volume.
     */
    SupportedInputModes: InputModes;
  }
  export type ChannelSpecifications = ChannelSpecification[];
  export interface CheckpointConfig {
    /**
     * Identifies the S3 path where you want Amazon SageMaker to store checkpoints. For example, s3://bucket-name/key-name-prefix.
     */
    S3Uri: S3Uri;
    /**
     * (Optional) The local directory where checkpoints are written. The default directory is /opt/ml/checkpoints/. 
     */
    LocalPath?: DirectoryPath;
  }
  export type Cidr = string;
  export type Cidrs = Cidr[];
  export type ClientId = string;
  export type ClientSecret = string;
  export type ClientToken = string;
  export type CodeRepositoryArn = string;
  export type CodeRepositoryContains = string;
  export type CodeRepositoryNameContains = string;
  export type CodeRepositoryNameOrUrl = string;
  export type CodeRepositorySortBy = "Name"|"CreationTime"|"LastModifiedTime"|string;
  export type CodeRepositorySortOrder = "Ascending"|"Descending"|string;
  export interface CodeRepositorySummary {
    /**
     * The name of the Git repository.
     */
    CodeRepositoryName: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the Git repository.
     */
    CodeRepositoryArn: CodeRepositoryArn;
    /**
     * The date and time that the Git repository was created.
     */
    CreationTime: CreationTime;
    /**
     * The date and time that the Git repository was last modified.
     */
    LastModifiedTime: LastModifiedTime;
    /**
     * Configuration details for the Git repository, including the URL where it is located and the ARN of the Amazon Web Services Secrets Manager secret that contains the credentials used to access the repository.
     */
    GitConfig?: GitConfig;
  }
  export type CodeRepositorySummaryList = CodeRepositorySummary[];
  export interface CognitoConfig {
    /**
     * A  user pool is a user directory in Amazon Cognito. With a user pool, your users can sign in to your web or mobile app through Amazon Cognito. Your users can also sign in through social identity providers like Google, Facebook, Amazon, or Apple, and through SAML identity providers.
     */
    UserPool: CognitoUserPool;
    /**
     * The client ID for your Amazon Cognito user pool.
     */
    ClientId: ClientId;
  }
  export interface CognitoMemberDefinition {
    /**
     * An identifier for a user pool. The user pool must be in the same region as the service that you are calling.
     */
    UserPool: CognitoUserPool;
    /**
     * An identifier for a user group.
     */
    UserGroup: CognitoUserGroup;
    /**
     * An identifier for an application client. You must create the app client ID using Amazon Cognito.
     */
    ClientId: ClientId;
  }
  export type CognitoUserGroup = string;
  export type CognitoUserPool = string;
  export interface CollectionConfiguration {
    /**
     * The name of the tensor collection. The name must be unique relative to other rule configuration names.
     */
    CollectionName?: CollectionName;
    /**
     * Parameter values for the tensor collection. The allowed parameters are "name", "include_regex", "reduction_config", "save_config", "tensor_names", and "save_histogram".
     */
    CollectionParameters?: CollectionParameters;
  }
  export type CollectionConfigurations = CollectionConfiguration[];
  export type CollectionName = string;
  export type CollectionParameters = {[key: string]: ConfigValue};
  export type CompilationJobArn = string;
  export type CompilationJobStatus = "INPROGRESS"|"COMPLETED"|"FAILED"|"STARTING"|"STOPPING"|"STOPPED"|string;
  export type CompilationJobSummaries = CompilationJobSummary[];
  export interface CompilationJobSummary {
    /**
     * The name of the model compilation job that you want a summary for.
     */
    CompilationJobName: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the model compilation job.
     */
    CompilationJobArn: CompilationJobArn;
    /**
     * The time when the model compilation job was created.
     */
    CreationTime: CreationTime;
    /**
     * The time when the model compilation job started.
     */
    CompilationStartTime?: Timestamp;
    /**
     * The time when the model compilation job completed.
     */
    CompilationEndTime?: Timestamp;
    /**
     * The type of device that the model will run on after the compilation job has completed.
     */
    CompilationTargetDevice?: TargetDevice;
    /**
     * The type of OS that the model will run on after the compilation job has completed.
     */
    CompilationTargetPlatformOs?: TargetPlatformOs;
    /**
     * The type of architecture that the model will run on after the compilation job has completed.
     */
    CompilationTargetPlatformArch?: TargetPlatformArch;
    /**
     * The type of accelerator that the model will run on after the compilation job has completed.
     */
    CompilationTargetPlatformAccelerator?: TargetPlatformAccelerator;
    /**
     * The time when the model compilation job was last modified.
     */
    LastModifiedTime?: LastModifiedTime;
    /**
     * The status of the model compilation job.
     */
    CompilationJobStatus: CompilationJobStatus;
  }
  export type CompilerOptions = string;
  export type CompressionType = "None"|"Gzip"|string;
  export type CompressionTypes = CompressionType[];
  export type ConditionOutcome = "True"|"False"|string;
  export interface ConditionStepMetadata {
    /**
     * The outcome of the Condition step evaluation.
     */
    Outcome?: ConditionOutcome;
  }
  export type ConfigKey = string;
  export type ConfigValue = string;
  export type ContainerArgument = string;
  export type ContainerArguments = ContainerArgument[];
  export interface ContainerDefinition {
    /**
     * This parameter is ignored for models that contain only a PrimaryContainer. When a ContainerDefinition is part of an inference pipeline, the value of the parameter uniquely identifies the container for the purposes of logging and metrics. For information, see Use Logs and Metrics to Monitor an Inference Pipeline. If you don't specify a value for this parameter for a ContainerDefinition that is part of an inference pipeline, a unique name is automatically assigned based on the position of the ContainerDefinition in the pipeline. If you specify a value for the ContainerHostName for any ContainerDefinition that is part of an inference pipeline, you must specify a value for the ContainerHostName parameter of every ContainerDefinition in that pipeline.
     */
    ContainerHostname?: ContainerHostname;
    /**
     * The path where inference code is stored. This can be either in Amazon EC2 Container Registry or in a Docker registry that is accessible from the same VPC that you configure for your endpoint. If you are using your own custom algorithm instead of an algorithm provided by Amazon SageMaker, the inference code must meet Amazon SageMaker requirements. Amazon SageMaker supports both registry/repository[:tag] and registry/repository[@digest] image path formats. For more information, see Using Your Own Algorithms with Amazon SageMaker 
     */
    Image?: ContainerImage;
    /**
     * Specifies whether the model container is in Amazon ECR or a private Docker registry accessible from your Amazon Virtual Private Cloud (VPC). For information about storing containers in a private Docker registry, see Use a Private Docker Registry for Real-Time Inference Containers 
     */
    ImageConfig?: ImageConfig;
    /**
     * Whether the container hosts a single model or multiple models.
     */
    Mode?: ContainerMode;
    /**
     * The S3 path where the model artifacts, which result from model training, are stored. This path must point to a single gzip compressed tar archive (.tar.gz suffix). The S3 path is required for Amazon SageMaker built-in algorithms, but not if you use your own algorithms. For more information on built-in algorithms, see Common Parameters.   The model artifacts must be in an S3 bucket that is in the same region as the model or endpoint you are creating.  If you provide a value for this parameter, Amazon SageMaker uses Amazon Web Services Security Token Service to download model artifacts from the S3 path you provide. Amazon Web Services STS is activated in your IAM user account by default. If you previously deactivated Amazon Web Services STS for a region, you need to reactivate Amazon Web Services STS for that region. For more information, see Activating and Deactivating Amazon Web Services STS in an Amazon Web Services Region in the Amazon Web Services Identity and Access Management User Guide.  If you use a built-in algorithm to create a model, Amazon SageMaker requires that you provide a S3 path to the model artifacts in ModelDataUrl. 
     */
    ModelDataUrl?: Url;
    /**
     * The environment variables to set in the Docker container. Each key and value in the Environment string to string map can have length of up to 1024. We support up to 16 entries in the map. 
     */
    Environment?: EnvironmentMap;
    /**
     * The name or Amazon Resource Name (ARN) of the model package to use to create the model.
     */
    ModelPackageName?: VersionedArnOrName;
    /**
     * Specifies additional configuration for multi-model endpoints.
     */
    MultiModelConfig?: MultiModelConfig;
  }
  export type ContainerDefinitionList = ContainerDefinition[];
  export type ContainerEntrypoint = ContainerEntrypointString[];
  export type ContainerEntrypointString = string;
  export type ContainerHostname = string;
  export type ContainerImage = string;
  export type ContainerMode = "SingleModel"|"MultiModel"|string;
  export type ContentClassifier = "FreeOfPersonallyIdentifiableInformation"|"FreeOfAdultContent"|string;
  export type ContentClassifiers = ContentClassifier[];
  export type ContentDigest = string;
  export type ContentType = string;
  export type ContentTypes = ContentType[];
  export type ContextArn = string;
  export interface ContextSource {
    /**
     * The URI of the source.
     */
    SourceUri: String2048;
    /**
     * The type of the source.
     */
    SourceType?: String256;
    /**
     * The ID of the source.
     */
    SourceId?: String256;
  }
  export type ContextSummaries = ContextSummary[];
  export interface ContextSummary {
    /**
     * The Amazon Resource Name (ARN) of the context.
     */
    ContextArn?: ContextArn;
    /**
     * The name of the context.
     */
    ContextName?: ExperimentEntityName;
    /**
     * The source of the context.
     */
    Source?: ContextSource;
    /**
     * The type of the context.
     */
    ContextType?: String256;
    /**
     * When the context was created.
     */
    CreationTime?: Timestamp;
    /**
     * When the context was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export interface ContinuousParameterRange {
    /**
     * The name of the continuous hyperparameter to tune.
     */
    Name: ParameterKey;
    /**
     * The minimum value for the hyperparameter. The tuning job uses floating-point values between this value and MaxValuefor tuning.
     */
    MinValue: ParameterValue;
    /**
     * The maximum value for the hyperparameter. The tuning job uses floating-point values between MinValue value and this value for tuning.
     */
    MaxValue: ParameterValue;
    /**
     * The scale that hyperparameter tuning uses to search the hyperparameter range. For information about choosing a hyperparameter scale, see Hyperparameter Scaling. One of the following values:  Auto  Amazon SageMaker hyperparameter tuning chooses the best scale for the hyperparameter.  Linear  Hyperparameter tuning searches the values in the hyperparameter range by using a linear scale.  Logarithmic  Hyperparameter tuning searches the values in the hyperparameter range by using a logarithmic scale. Logarithmic scaling works only for ranges that have only values greater than 0.  ReverseLogarithmic  Hyperparameter tuning searches the values in the hyperparameter range by using a reverse logarithmic scale. Reverse logarithmic scaling works only for ranges that are entirely within the range 0&lt;=x&lt;1.0.  
     */
    ScalingType?: HyperParameterScalingType;
  }
  export interface ContinuousParameterRangeSpecification {
    /**
     * The minimum floating-point value allowed.
     */
    MinValue: ParameterValue;
    /**
     * The maximum floating-point value allowed.
     */
    MaxValue: ParameterValue;
  }
  export type ContinuousParameterRanges = ContinuousParameterRange[];
  export interface CreateActionRequest {
    /**
     * The name of the action. Must be unique to your account in an Amazon Web Services Region.
     */
    ActionName: ExperimentEntityName;
    /**
     * The source type, ID, and URI.
     */
    Source: ActionSource;
    /**
     * The action type.
     */
    ActionType: String256;
    /**
     * The description of the action.
     */
    Description?: ExperimentDescription;
    /**
     * The status of the action.
     */
    Status?: ActionStatus;
    /**
     * A list of properties to add to the action.
     */
    Properties?: LineageEntityParameters;
    MetadataProperties?: MetadataProperties;
    /**
     * A list of tags to apply to the action.
     */
    Tags?: TagList;
  }
  export interface CreateActionResponse {
    /**
     * The Amazon Resource Name (ARN) of the action.
     */
    ActionArn?: ActionArn;
  }
  export interface CreateAlgorithmInput {
    /**
     * The name of the algorithm.
     */
    AlgorithmName: EntityName;
    /**
     * A description of the algorithm.
     */
    AlgorithmDescription?: EntityDescription;
    /**
     * Specifies details about training jobs run by this algorithm, including the following:   The Amazon ECR path of the container and the version digest of the algorithm.   The hyperparameters that the algorithm supports.   The instance types that the algorithm supports for training.   Whether the algorithm supports distributed training.   The metrics that the algorithm emits to Amazon CloudWatch.   Which metrics that the algorithm emits can be used as the objective metric for hyperparameter tuning jobs.   The input channels that the algorithm supports for training data. For example, an algorithm might support train, validation, and test channels.  
     */
    TrainingSpecification: TrainingSpecification;
    /**
     * Specifies details about inference jobs that the algorithm runs, including the following:   The Amazon ECR paths of containers that contain the inference code and model artifacts.   The instance types that the algorithm supports for transform jobs and real-time endpoints used for inference.   The input and output content formats that the algorithm supports for inference.  
     */
    InferenceSpecification?: InferenceSpecification;
    /**
     * Specifies configurations for one or more training jobs and that Amazon SageMaker runs to test the algorithm's training code and, optionally, one or more batch transform jobs that Amazon SageMaker runs to test the algorithm's inference code.
     */
    ValidationSpecification?: AlgorithmValidationSpecification;
    /**
     * Whether to certify the algorithm so that it can be listed in Amazon Web Services Marketplace.
     */
    CertifyForMarketplace?: CertifyForMarketplace;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
  }
  export interface CreateAlgorithmOutput {
    /**
     * The Amazon Resource Name (ARN) of the new algorithm.
     */
    AlgorithmArn: AlgorithmArn;
  }
  export interface CreateAppImageConfigRequest {
    /**
     * The name of the AppImageConfig. Must be unique to your account.
     */
    AppImageConfigName: AppImageConfigName;
    /**
     * A list of tags to apply to the AppImageConfig.
     */
    Tags?: TagList;
    /**
     * The KernelGatewayImageConfig.
     */
    KernelGatewayImageConfig?: KernelGatewayImageConfig;
  }
  export interface CreateAppImageConfigResponse {
    /**
     * The Amazon Resource Name (ARN) of the AppImageConfig.
     */
    AppImageConfigArn?: AppImageConfigArn;
  }
  export interface CreateAppRequest {
    /**
     * The domain ID.
     */
    DomainId: DomainId;
    /**
     * The user profile name.
     */
    UserProfileName: UserProfileName;
    /**
     * The type of app. Supported apps are JupyterServer and KernelGateway. TensorBoard is not supported.
     */
    AppType: AppType;
    /**
     * The name of the app.
     */
    AppName: AppName;
    /**
     * Each tag consists of a key and an optional value. Tag keys must be unique per resource.
     */
    Tags?: TagList;
    /**
     * The instance type and the Amazon Resource Name (ARN) of the SageMaker image created on the instance.
     */
    ResourceSpec?: ResourceSpec;
  }
  export interface CreateAppResponse {
    /**
     * The Amazon Resource Name (ARN) of the app.
     */
    AppArn?: AppArn;
  }
  export interface CreateArtifactRequest {
    /**
     * The name of the artifact. Must be unique to your account in an Amazon Web Services Region.
     */
    ArtifactName?: ExperimentEntityName;
    /**
     * The ID, ID type, and URI of the source.
     */
    Source: ArtifactSource;
    /**
     * The artifact type.
     */
    ArtifactType: String256;
    /**
     * A list of properties to add to the artifact.
     */
    Properties?: LineageEntityParameters;
    MetadataProperties?: MetadataProperties;
    /**
     * A list of tags to apply to the artifact.
     */
    Tags?: TagList;
  }
  export interface CreateArtifactResponse {
    /**
     * The Amazon Resource Name (ARN) of the artifact.
     */
    ArtifactArn?: ArtifactArn;
  }
  export interface CreateAutoMLJobRequest {
    /**
     * Identifies an Autopilot job. The name must be unique to your account and is case-insensitive.
     */
    AutoMLJobName: AutoMLJobName;
    /**
     * An array of channel objects that describes the input data and its location. Each channel is a named input source. Similar to InputDataConfig supported by . Format(s) supported: CSV. Minimum of 500 rows.
     */
    InputDataConfig: AutoMLInputDataConfig;
    /**
     * Provides information about encryption and the Amazon S3 output path needed to store artifacts from an AutoML job. Format(s) supported: CSV.
     */
    OutputDataConfig: AutoMLOutputDataConfig;
    /**
     * Defines the type of supervised learning available for the candidates. Options include: BinaryClassification, MulticlassClassification, and Regression. For more information, see  Amazon SageMaker Autopilot problem types and algorithm support.
     */
    ProblemType?: ProblemType;
    /**
     * Defines the objective metric used to measure the predictive quality of an AutoML job. You provide an AutoMLJobObjective$MetricName and Autopilot infers whether to minimize or maximize it.
     */
    AutoMLJobObjective?: AutoMLJobObjective;
    /**
     * Contains CompletionCriteria and SecurityConfig settings for the AutoML job.
     */
    AutoMLJobConfig?: AutoMLJobConfig;
    /**
     * The ARN of the role that is used to access the data.
     */
    RoleArn: RoleArn;
    /**
     * Generates possible candidates without training the models. A candidate is a combination of data preprocessors, algorithms, and algorithm parameter settings.
     */
    GenerateCandidateDefinitionsOnly?: GenerateCandidateDefinitionsOnly;
    /**
     * Each tag consists of a key and an optional value. Tag keys must be unique per resource.
     */
    Tags?: TagList;
    /**
     * Specifies how to generate the endpoint name for an automatic one-click Autopilot model deployment.
     */
    ModelDeployConfig?: ModelDeployConfig;
  }
  export interface CreateAutoMLJobResponse {
    /**
     * The unique ARN assigned to the AutoML job when it is created.
     */
    AutoMLJobArn: AutoMLJobArn;
  }
  export interface CreateCodeRepositoryInput {
    /**
     * The name of the Git repository. The name must have 1 to 63 characters. Valid characters are a-z, A-Z, 0-9, and - (hyphen).
     */
    CodeRepositoryName: EntityName;
    /**
     * Specifies details about the repository, including the URL where the repository is located, the default branch, and credentials to use to access the repository.
     */
    GitConfig: GitConfig;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
  }
  export interface CreateCodeRepositoryOutput {
    /**
     * The Amazon Resource Name (ARN) of the new repository.
     */
    CodeRepositoryArn: CodeRepositoryArn;
  }
  export interface CreateCompilationJobRequest {
    /**
     * A name for the model compilation job. The name must be unique within the Amazon Web Services Region and within your Amazon Web Services account. 
     */
    CompilationJobName: EntityName;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that enables Amazon SageMaker to perform tasks on your behalf.  During model compilation, Amazon SageMaker needs your permission to:   Read input data from an S3 bucket   Write model artifacts to an S3 bucket   Write logs to Amazon CloudWatch Logs   Publish metrics to Amazon CloudWatch   You grant permissions for all of these tasks to an IAM role. To pass this role to Amazon SageMaker, the caller of this API must have the iam:PassRole permission. For more information, see Amazon SageMaker Roles. 
     */
    RoleArn: RoleArn;
    /**
     * Provides information about the location of input model artifacts, the name and shape of the expected data inputs, and the framework in which the model was trained.
     */
    InputConfig: InputConfig;
    /**
     * Provides information about the output location for the compiled model and the target device the model runs on.
     */
    OutputConfig: OutputConfig;
    /**
     * A VpcConfig object that specifies the VPC that you want your compilation job to connect to. Control access to your models by configuring the VPC. For more information, see Protect Compilation Jobs by Using an Amazon Virtual Private Cloud.
     */
    VpcConfig?: NeoVpcConfig;
    /**
     * Specifies a limit to how long a model compilation job can run. When the job reaches the time limit, Amazon SageMaker ends the compilation job. Use this API to cap model training costs.
     */
    StoppingCondition: StoppingCondition;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
  }
  export interface CreateCompilationJobResponse {
    /**
     * If the action is successful, the service sends back an HTTP 200 response. Amazon SageMaker returns the following data in JSON format:    CompilationJobArn: The Amazon Resource Name (ARN) of the compiled job.  
     */
    CompilationJobArn: CompilationJobArn;
  }
  export interface CreateContextRequest {
    /**
     * The name of the context. Must be unique to your account in an Amazon Web Services Region.
     */
    ContextName: ExperimentEntityName;
    /**
     * The source type, ID, and URI.
     */
    Source: ContextSource;
    /**
     * The context type.
     */
    ContextType: String256;
    /**
     * The description of the context.
     */
    Description?: ExperimentDescription;
    /**
     * A list of properties to add to the context.
     */
    Properties?: LineageEntityParameters;
    /**
     * A list of tags to apply to the context.
     */
    Tags?: TagList;
  }
  export interface CreateContextResponse {
    /**
     * The Amazon Resource Name (ARN) of the context.
     */
    ContextArn?: ContextArn;
  }
  export interface CreateDataQualityJobDefinitionRequest {
    /**
     * The name for the monitoring job definition.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
    /**
     * Configures the constraints and baselines for the monitoring job.
     */
    DataQualityBaselineConfig?: DataQualityBaselineConfig;
    /**
     * Specifies the container that runs the monitoring job.
     */
    DataQualityAppSpecification: DataQualityAppSpecification;
    /**
     * A list of inputs for the monitoring job. Currently endpoints are supported as monitoring inputs.
     */
    DataQualityJobInput: DataQualityJobInput;
    DataQualityJobOutputConfig: MonitoringOutputConfig;
    JobResources: MonitoringResources;
    /**
     * Specifies networking configuration for the monitoring job.
     */
    NetworkConfig?: MonitoringNetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker can assume to perform tasks on your behalf.
     */
    RoleArn: RoleArn;
    StoppingCondition?: MonitoringStoppingCondition;
    /**
     * (Optional) An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide.
     */
    Tags?: TagList;
  }
  export interface CreateDataQualityJobDefinitionResponse {
    /**
     * The Amazon Resource Name (ARN) of the job definition.
     */
    JobDefinitionArn: MonitoringJobDefinitionArn;
  }
  export interface CreateDeviceFleetRequest {
    /**
     * The name of the fleet that the device belongs to.
     */
    DeviceFleetName: EntityName;
    /**
     * The Amazon Resource Name (ARN) that has access to Amazon Web Services Internet of Things (IoT).
     */
    RoleArn?: RoleArn;
    /**
     * A description of the fleet.
     */
    Description?: DeviceFleetDescription;
    /**
     * The output configuration for storing sample data collected by the fleet.
     */
    OutputConfig: EdgeOutputConfig;
    /**
     * Creates tags for the specified fleet.
     */
    Tags?: TagList;
    /**
     * Whether to create an Amazon Web Services IoT Role Alias during device fleet creation. The name of the role alias generated will match this pattern: "SageMakerEdge-{DeviceFleetName}". For example, if your device fleet is called "demo-fleet", the name of the role alias will be "SageMakerEdge-demo-fleet".
     */
    EnableIotRoleAlias?: EnableIotRoleAlias;
  }
  export interface CreateDomainRequest {
    /**
     * A name for the domain.
     */
    DomainName: DomainName;
    /**
     * The mode of authentication that members use to access the domain.
     */
    AuthMode: AuthMode;
    /**
     * The default settings to use to create a user profile when UserSettings isn't specified in the call to the CreateUserProfile API.  SecurityGroups is aggregated when specified in both calls. For all other settings in UserSettings, the values specified in CreateUserProfile take precedence over those specified in CreateDomain.
     */
    DefaultUserSettings: UserSettings;
    /**
     * The VPC subnets that Studio uses for communication.
     */
    SubnetIds: Subnets;
    /**
     * The ID of the Amazon Virtual Private Cloud (VPC) that Studio uses for communication.
     */
    VpcId: VpcId;
    /**
     * Tags to associated with the Domain. Each tag consists of a key and an optional value. Tag keys must be unique per resource. Tags are searchable using the Search API. Tags that you specify for the Domain are also added to all Apps that the Domain launches.
     */
    Tags?: TagList;
    /**
     * Specifies the VPC used for non-EFS traffic. The default value is PublicInternetOnly.    PublicInternetOnly - Non-EFS traffic is through a VPC managed by Amazon SageMaker, which allows direct internet access    VpcOnly - All Studio traffic is through the specified VPC and subnets  
     */
    AppNetworkAccessType?: AppNetworkAccessType;
    /**
     * This member is deprecated and replaced with KmsKeyId.
     */
    HomeEfsFileSystemKmsKeyId?: KmsKeyId;
    /**
     * SageMaker uses Amazon Web Services KMS to encrypt the EFS volume attached to the domain with an Amazon Web Services managed key by default. For more control, specify a customer managed key.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The entity that creates and manages the required security groups for inter-app communication in VPCOnly mode. Required when CreateDomain.AppNetworkAccessType is VPCOnly and DomainSettings.RStudioServerProDomainSettings.DomainExecutionRoleArn is provided.
     */
    AppSecurityGroupManagement?: AppSecurityGroupManagement;
    /**
     * A collection of Domain settings.
     */
    DomainSettings?: DomainSettings;
  }
  export interface CreateDomainResponse {
    /**
     * The Amazon Resource Name (ARN) of the created domain.
     */
    DomainArn?: DomainArn;
    /**
     * The URL to the created domain.
     */
    Url?: String1024;
  }
  export interface CreateEdgePackagingJobRequest {
    /**
     * The name of the edge packaging job.
     */
    EdgePackagingJobName: EntityName;
    /**
     * The name of the SageMaker Neo compilation job that will be used to locate model artifacts for packaging.
     */
    CompilationJobName: EntityName;
    /**
     * The name of the model.
     */
    ModelName: EntityName;
    /**
     * The version of the model.
     */
    ModelVersion: EdgeVersion;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that enables Amazon SageMaker to download and upload the model, and to contact SageMaker Neo.
     */
    RoleArn: RoleArn;
    /**
     * Provides information about the output location for the packaged model.
     */
    OutputConfig: EdgeOutputConfig;
    /**
     * The Amazon Web Services KMS key to use when encrypting the EBS volume the edge packaging job runs on.
     */
    ResourceKey?: KmsKeyId;
    /**
     * Creates tags for the packaging job.
     */
    Tags?: TagList;
  }
  export interface CreateEndpointConfigInput {
    /**
     * The name of the endpoint configuration. You specify this name in a CreateEndpoint request. 
     */
    EndpointConfigName: EndpointConfigName;
    /**
     * An list of ProductionVariant objects, one for each model that you want to host at this endpoint.
     */
    ProductionVariants: ProductionVariantList;
    DataCaptureConfig?: DataCaptureConfig;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
    /**
     * The Amazon Resource Name (ARN) of a Amazon Web Services Key Management Service key that Amazon SageMaker uses to encrypt data on the storage volume attached to the ML compute instance that hosts the endpoint. The KmsKeyId can be any of the following formats:    Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias name ARN: arn:aws:kms:us-west-2:111122223333:alias/ExampleAlias    The KMS key policy must grant permission to the IAM role that you specify in your CreateEndpoint, UpdateEndpoint requests. For more information, refer to the Amazon Web Services Key Management Service section Using Key Policies in Amazon Web Services KMS    Certain Nitro-based instances include local storage, dependent on the instance type. Local storage volumes are encrypted using a hardware module on the instance. You can't request a KmsKeyId when using an instance type with local storage. If any of the models that you specify in the ProductionVariants parameter use nitro-based instances with local storage, do not specify a value for the KmsKeyId parameter. If you specify a value for KmsKeyId when using any nitro-based instances with local storage, the call to CreateEndpointConfig fails. For a list of instance types that support local instance storage, see Instance Store Volumes. For more information about local instance storage encryption, see SSD Instance Store Volumes. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * Specifies configuration for how an endpoint performs asynchronous inference. This is a required field in order for your Endpoint to be invoked using  InvokeEndpointAsync .
     */
    AsyncInferenceConfig?: AsyncInferenceConfig;
  }
  export interface CreateEndpointConfigOutput {
    /**
     * The Amazon Resource Name (ARN) of the endpoint configuration. 
     */
    EndpointConfigArn: EndpointConfigArn;
  }
  export interface CreateEndpointInput {
    /**
     * The name of the endpoint.The name must be unique within an Amazon Web Services Region in your Amazon Web Services account. The name is case-insensitive in CreateEndpoint, but the case is preserved and must be matched in .
     */
    EndpointName: EndpointName;
    /**
     * The name of an endpoint configuration. For more information, see CreateEndpointConfig. 
     */
    EndpointConfigName: EndpointConfigName;
    DeploymentConfig?: DeploymentConfig;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
  }
  export interface CreateEndpointOutput {
    /**
     * The Amazon Resource Name (ARN) of the endpoint.
     */
    EndpointArn: EndpointArn;
  }
  export interface CreateExperimentRequest {
    /**
     * The name of the experiment. The name must be unique in your Amazon Web Services account and is not case-sensitive.
     */
    ExperimentName: ExperimentEntityName;
    /**
     * The name of the experiment as displayed. The name doesn't need to be unique. If you don't specify DisplayName, the value in ExperimentName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    /**
     * The description of the experiment.
     */
    Description?: ExperimentDescription;
    /**
     * A list of tags to associate with the experiment. You can use Search API to search on the tags.
     */
    Tags?: TagList;
  }
  export interface CreateExperimentResponse {
    /**
     * The Amazon Resource Name (ARN) of the experiment.
     */
    ExperimentArn?: ExperimentArn;
  }
  export interface CreateFeatureGroupRequest {
    /**
     * The name of the FeatureGroup. The name must be unique within an Amazon Web Services Region in an Amazon Web Services account. The name:   Must start and end with an alphanumeric character.   Can only contain alphanumeric character and hyphens. Spaces are not allowed.   
     */
    FeatureGroupName: FeatureGroupName;
    /**
     * The name of the Feature whose value uniquely identifies a Record defined in the FeatureStore. Only the latest record per identifier value will be stored in the OnlineStore. RecordIdentifierFeatureName must be one of feature definitions' names. You use the RecordIdentifierFeatureName to access data in a FeatureStore. This name:   Must start and end with an alphanumeric character.   Can only contains alphanumeric characters, hyphens, underscores. Spaces are not allowed.   
     */
    RecordIdentifierFeatureName: FeatureName;
    /**
     * The name of the feature that stores the EventTime of a Record in a FeatureGroup. An EventTime is a point in time when a new event occurs that corresponds to the creation or update of a Record in a FeatureGroup. All Records in the FeatureGroup must have a corresponding EventTime. An EventTime can be a String or Fractional.     Fractional: EventTime feature values must be a Unix timestamp in seconds.    String: EventTime feature values must be an ISO-8601 string in the format. The following formats are supported yyyy-MM-dd'T'HH:mm:ssZ and yyyy-MM-dd'T'HH:mm:ss.SSSZ where yyyy, MM, and dd represent the year, month, and day respectively and HH, mm, ss, and if applicable, SSS represent the hour, month, second and milliseconds respsectively. 'T' and Z are constants.  
     */
    EventTimeFeatureName: FeatureName;
    /**
     * A list of Feature names and types. Name and Type is compulsory per Feature.  Valid feature FeatureTypes are Integral, Fractional and String.  FeatureNames cannot be any of the following: is_deleted, write_time, api_invocation_time  You can create up to 2,500 FeatureDefinitions per FeatureGroup.
     */
    FeatureDefinitions: FeatureDefinitions;
    /**
     * You can turn the OnlineStore on or off by specifying True for the EnableOnlineStore flag in OnlineStoreConfig; the default value is False. You can also include an Amazon Web Services KMS key ID (KMSKeyId) for at-rest encryption of the OnlineStore.
     */
    OnlineStoreConfig?: OnlineStoreConfig;
    /**
     * Use this to configure an OfflineFeatureStore. This parameter allows you to specify:   The Amazon Simple Storage Service (Amazon S3) location of an OfflineStore.   A configuration for an Amazon Web Services Glue or Amazon Web Services Hive data catalog.    An KMS encryption key to encrypt the Amazon S3 location used for OfflineStore. If KMS encryption key is not specified, by default we encrypt all data at rest using Amazon Web Services KMS key. By defining your bucket-level key for SSE, you can reduce Amazon Web Services KMS requests costs by up to 99 percent.   To learn more about this parameter, see OfflineStoreConfig.
     */
    OfflineStoreConfig?: OfflineStoreConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM execution role used to persist data into the OfflineStore if an OfflineStoreConfig is provided.
     */
    RoleArn?: RoleArn;
    /**
     * A free-form description of a FeatureGroup.
     */
    Description?: Description;
    /**
     * Tags used to identify Features in each FeatureGroup.
     */
    Tags?: TagList;
  }
  export interface CreateFeatureGroupResponse {
    /**
     * The Amazon Resource Name (ARN) of the FeatureGroup. This is a unique identifier for the feature group. 
     */
    FeatureGroupArn: FeatureGroupArn;
  }
  export interface CreateFlowDefinitionRequest {
    /**
     * The name of your flow definition.
     */
    FlowDefinitionName: FlowDefinitionName;
    /**
     * Container for configuring the source of human task requests. Use to specify if Amazon Rekognition or Amazon Textract is used as an integration source.
     */
    HumanLoopRequestSource?: HumanLoopRequestSource;
    /**
     * An object containing information about the events that trigger a human workflow.
     */
    HumanLoopActivationConfig?: HumanLoopActivationConfig;
    /**
     * An object containing information about the tasks the human reviewers will perform.
     */
    HumanLoopConfig: HumanLoopConfig;
    /**
     * An object containing information about where the human review results will be uploaded.
     */
    OutputConfig: FlowDefinitionOutputConfig;
    /**
     * The Amazon Resource Name (ARN) of the role needed to call other services on your behalf. For example, arn:aws:iam::1234567890:role/service-role/AmazonSageMaker-ExecutionRole-20180111T151298.
     */
    RoleArn: RoleArn;
    /**
     * An array of key-value pairs that contain metadata to help you categorize and organize a flow definition. Each tag consists of a key and a value, both of which you define.
     */
    Tags?: TagList;
  }
  export interface CreateFlowDefinitionResponse {
    /**
     * The Amazon Resource Name (ARN) of the flow definition you create.
     */
    FlowDefinitionArn: FlowDefinitionArn;
  }
  export interface CreateHumanTaskUiRequest {
    /**
     * The name of the user interface you are creating.
     */
    HumanTaskUiName: HumanTaskUiName;
    UiTemplate: UiTemplate;
    /**
     * An array of key-value pairs that contain metadata to help you categorize and organize a human review workflow user interface. Each tag consists of a key and a value, both of which you define.
     */
    Tags?: TagList;
  }
  export interface CreateHumanTaskUiResponse {
    /**
     * The Amazon Resource Name (ARN) of the human review workflow user interface you create.
     */
    HumanTaskUiArn: HumanTaskUiArn;
  }
  export interface CreateHyperParameterTuningJobRequest {
    /**
     * The name of the tuning job. This name is the prefix for the names of all training jobs that this tuning job launches. The name must be unique within the same Amazon Web Services account and Amazon Web Services Region. The name must have 1 to 32 characters. Valid characters are a-z, A-Z, 0-9, and : + = @ _ % - (hyphen). The name is not case sensitive.
     */
    HyperParameterTuningJobName: HyperParameterTuningJobName;
    /**
     * The HyperParameterTuningJobConfig object that describes the tuning job, including the search strategy, the objective metric used to evaluate training jobs, ranges of parameters to search, and resource limits for the tuning job. For more information, see How Hyperparameter Tuning Works.
     */
    HyperParameterTuningJobConfig: HyperParameterTuningJobConfig;
    /**
     * The HyperParameterTrainingJobDefinition object that describes the training jobs that this tuning job launches, including static hyperparameters, input data configuration, output data configuration, resource configuration, and stopping condition.
     */
    TrainingJobDefinition?: HyperParameterTrainingJobDefinition;
    /**
     * A list of the HyperParameterTrainingJobDefinition objects launched for this tuning job.
     */
    TrainingJobDefinitions?: HyperParameterTrainingJobDefinitions;
    /**
     * Specifies the configuration for starting the hyperparameter tuning job using one or more previous tuning jobs as a starting point. The results of previous tuning jobs are used to inform which combinations of hyperparameters to search over in the new tuning job. All training jobs launched by the new hyperparameter tuning job are evaluated by using the objective metric. If you specify IDENTICAL_DATA_AND_ALGORITHM as the WarmStartType value for the warm start configuration, the training job that performs the best in the new tuning job is compared to the best training jobs from the parent tuning jobs. From these, the training job that performs the best as measured by the objective metric is returned as the overall best training job.  All training jobs launched by parent hyperparameter tuning jobs and the new hyperparameter tuning jobs count against the limit of training jobs for the tuning job. 
     */
    WarmStartConfig?: HyperParameterTuningJobWarmStartConfig;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources. Tags that you specify for the tuning job are also added to all training jobs that the tuning job launches.
     */
    Tags?: TagList;
  }
  export interface CreateHyperParameterTuningJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the tuning job. Amazon SageMaker assigns an ARN to a hyperparameter tuning job when you create it.
     */
    HyperParameterTuningJobArn: HyperParameterTuningJobArn;
  }
  export interface CreateImageRequest {
    /**
     * The description of the image.
     */
    Description?: ImageDescription;
    /**
     * The display name of the image. If not provided, ImageName is displayed.
     */
    DisplayName?: ImageDisplayName;
    /**
     * The name of the image. Must be unique to your account.
     */
    ImageName: ImageName;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that enables Amazon SageMaker to perform tasks on your behalf.
     */
    RoleArn: RoleArn;
    /**
     * A list of tags to apply to the image.
     */
    Tags?: TagList;
  }
  export interface CreateImageResponse {
    /**
     * The Amazon Resource Name (ARN) of the image.
     */
    ImageArn?: ImageArn;
  }
  export interface CreateImageVersionRequest {
    /**
     * The registry path of the container image to use as the starting point for this version. The path is an Amazon Container Registry (ECR) URI in the following format:  &lt;acct-id&gt;.dkr.ecr.&lt;region&gt;.amazonaws.com/&lt;repo-name[:tag] or [@digest]&gt; 
     */
    BaseImage: ImageBaseImage;
    /**
     * A unique ID. If not specified, the Amazon Web Services CLI and Amazon Web Services SDKs, such as the SDK for Python (Boto3), add a unique value to the call.
     */
    ClientToken: ClientToken;
    /**
     * The ImageName of the Image to create a version of.
     */
    ImageName: ImageName;
  }
  export interface CreateImageVersionResponse {
    /**
     * The Amazon Resource Name (ARN) of the image version.
     */
    ImageVersionArn?: ImageVersionArn;
  }
  export interface CreateLabelingJobRequest {
    /**
     * The name of the labeling job. This name is used to identify the job in a list of labeling jobs. Labeling job names must be unique within an Amazon Web Services account and region. LabelingJobName is not case sensitive. For example, Example-job and example-job are considered the same labeling job name by Ground Truth.
     */
    LabelingJobName: LabelingJobName;
    /**
     * The attribute name to use for the label in the output manifest file. This is the key for the key/value pair formed with the label that a worker assigns to the object. The LabelAttributeName must meet the following requirements.   The name can't end with "-metadata".    If you are using one of the following built-in task types, the attribute name must end with "-ref". If the task type you are using is not listed below, the attribute name must not end with "-ref".   Image semantic segmentation (SemanticSegmentation), and adjustment (AdjustmentSemanticSegmentation) and verification (VerificationSemanticSegmentation) labeling jobs for this task type.   Video frame object detection (VideoObjectDetection), and adjustment and verification (AdjustmentVideoObjectDetection) labeling jobs for this task type.   Video frame object tracking (VideoObjectTracking), and adjustment and verification (AdjustmentVideoObjectTracking) labeling jobs for this task type.   3D point cloud semantic segmentation (3DPointCloudSemanticSegmentation), and adjustment and verification (Adjustment3DPointCloudSemanticSegmentation) labeling jobs for this task type.    3D point cloud object tracking (3DPointCloudObjectTracking), and adjustment and verification (Adjustment3DPointCloudObjectTracking) labeling jobs for this task type.        If you are creating an adjustment or verification labeling job, you must use a different LabelAttributeName than the one used in the original labeling job. The original labeling job is the Ground Truth labeling job that produced the labels that you want verified or adjusted. To learn more about adjustment and verification labeling jobs, see Verify and Adjust Labels. 
     */
    LabelAttributeName: LabelAttributeName;
    /**
     * Input data for the labeling job, such as the Amazon S3 location of the data objects and the location of the manifest file that describes the data objects. You must specify at least one of the following: S3DataSource or SnsDataSource.    Use SnsDataSource to specify an SNS input topic for a streaming labeling job. If you do not specify and SNS input topic ARN, Ground Truth will create a one-time labeling job that stops after all data objects in the input manifest file have been labeled.   Use S3DataSource to specify an input manifest file for both streaming and one-time labeling jobs. Adding an S3DataSource is optional if you use SnsDataSource to create a streaming labeling job.   If you use the Amazon Mechanical Turk workforce, your input data should not include confidential information, personal information or protected health information. Use ContentClassifiers to specify that your data is free of personally identifiable information and adult content.
     */
    InputConfig: LabelingJobInputConfig;
    /**
     * The location of the output data and the Amazon Web Services Key Management Service key ID for the key used to encrypt the output data, if any.
     */
    OutputConfig: LabelingJobOutputConfig;
    /**
     * The Amazon Resource Number (ARN) that Amazon SageMaker assumes to perform tasks on your behalf during data labeling. You must grant this role the necessary permissions so that Amazon SageMaker can successfully complete data labeling.
     */
    RoleArn: RoleArn;
    /**
     * The S3 URI of the file, referred to as a label category configuration file, that defines the categories used to label the data objects. For 3D point cloud and video frame task types, you can add label category attributes and frame attributes to your label category configuration file. To learn how, see Create a Labeling Category Configuration File for 3D Point Cloud Labeling Jobs.  For named entity recognition jobs, in addition to "labels", you must provide worker instructions in the label category configuration file using the "instructions" parameter: "instructions": {"shortInstruction":"&lt;h1&gt;Add header&lt;/h1&gt;&lt;p&gt;Add Instructions&lt;/p&gt;", "fullInstruction":"&lt;p&gt;Add additional instructions.&lt;/p&gt;"}. For details and an example, see Create a Named Entity Recognition Labeling Job (API) . For all other built-in task types and custom tasks, your label category configuration file must be a JSON file in the following format. Identify the labels you want to use by replacing label_1, label_2,...,label_n with your label categories.  {    "document-version": "2018-11-28",   "labels": [{"label": "label_1"},{"label": "label_2"},...{"label": "label_n"}]   }  Note the following about the label category configuration file:   For image classification and text classification (single and multi-label) you must specify at least two label categories. For all other task types, the minimum number of label categories required is one.    Each label category must be unique, you cannot specify duplicate label categories.   If you create a 3D point cloud or video frame adjustment or verification labeling job, you must include auditLabelAttributeName in the label category configuration. Use this parameter to enter the  LabelAttributeName  of the labeling job you want to adjust or verify annotations of.  
     */
    LabelCategoryConfigS3Uri?: S3Uri;
    /**
     * A set of conditions for stopping the labeling job. If any of the conditions are met, the job is automatically stopped. You can use these conditions to control the cost of data labeling.
     */
    StoppingConditions?: LabelingJobStoppingConditions;
    /**
     * Configures the information required to perform automated data labeling.
     */
    LabelingJobAlgorithmsConfig?: LabelingJobAlgorithmsConfig;
    /**
     * Configures the labeling task and how it is presented to workers; including, but not limited to price, keywords, and batch size (task count).
     */
    HumanTaskConfig: HumanTaskConfig;
    /**
     * An array of key/value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide.
     */
    Tags?: TagList;
  }
  export interface CreateLabelingJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the labeling job. You use this ARN to identify the labeling job.
     */
    LabelingJobArn: LabelingJobArn;
  }
  export interface CreateModelBiasJobDefinitionRequest {
    /**
     * The name of the bias job definition. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
    /**
     * The baseline configuration for a model bias job.
     */
    ModelBiasBaselineConfig?: ModelBiasBaselineConfig;
    /**
     * Configures the model bias job to run a specified Docker container image.
     */
    ModelBiasAppSpecification: ModelBiasAppSpecification;
    /**
     * Inputs for the model bias job.
     */
    ModelBiasJobInput: ModelBiasJobInput;
    ModelBiasJobOutputConfig: MonitoringOutputConfig;
    JobResources: MonitoringResources;
    /**
     * Networking options for a model bias job.
     */
    NetworkConfig?: MonitoringNetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker can assume to perform tasks on your behalf.
     */
    RoleArn: RoleArn;
    StoppingCondition?: MonitoringStoppingCondition;
    /**
     * (Optional) An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide.
     */
    Tags?: TagList;
  }
  export interface CreateModelBiasJobDefinitionResponse {
    /**
     * The Amazon Resource Name (ARN) of the model bias job.
     */
    JobDefinitionArn: MonitoringJobDefinitionArn;
  }
  export interface CreateModelExplainabilityJobDefinitionRequest {
    /**
     *  The name of the model explainability job definition. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
    /**
     * The baseline configuration for a model explainability job.
     */
    ModelExplainabilityBaselineConfig?: ModelExplainabilityBaselineConfig;
    /**
     * Configures the model explainability job to run a specified Docker container image.
     */
    ModelExplainabilityAppSpecification: ModelExplainabilityAppSpecification;
    /**
     * Inputs for the model explainability job.
     */
    ModelExplainabilityJobInput: ModelExplainabilityJobInput;
    ModelExplainabilityJobOutputConfig: MonitoringOutputConfig;
    JobResources: MonitoringResources;
    /**
     * Networking options for a model explainability job.
     */
    NetworkConfig?: MonitoringNetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker can assume to perform tasks on your behalf.
     */
    RoleArn: RoleArn;
    StoppingCondition?: MonitoringStoppingCondition;
    /**
     * (Optional) An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide.
     */
    Tags?: TagList;
  }
  export interface CreateModelExplainabilityJobDefinitionResponse {
    /**
     * The Amazon Resource Name (ARN) of the model explainability job.
     */
    JobDefinitionArn: MonitoringJobDefinitionArn;
  }
  export interface CreateModelInput {
    /**
     * The name of the new model.
     */
    ModelName: ModelName;
    /**
     * The location of the primary docker image containing inference code, associated artifacts, and custom environment map that the inference code uses when the model is deployed for predictions. 
     */
    PrimaryContainer?: ContainerDefinition;
    /**
     * Specifies the containers in the inference pipeline.
     */
    Containers?: ContainerDefinitionList;
    /**
     * Specifies details of how containers in a multi-container endpoint are called.
     */
    InferenceExecutionConfig?: InferenceExecutionConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that Amazon SageMaker can assume to access model artifacts and docker image for deployment on ML compute instances or for batch transform jobs. Deploying on ML compute instances is part of model hosting. For more information, see Amazon SageMaker Roles.   To be able to pass this role to Amazon SageMaker, the caller of this API must have the iam:PassRole permission. 
     */
    ExecutionRoleArn: RoleArn;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
    /**
     * A VpcConfig object that specifies the VPC that you want your model to connect to. Control access to and from your model container by configuring the VPC. VpcConfig is used in hosting services and in batch transform. For more information, see Protect Endpoints by Using an Amazon Virtual Private Cloud and Protect Data in Batch Transform Jobs by Using an Amazon Virtual Private Cloud.
     */
    VpcConfig?: VpcConfig;
    /**
     * Isolates the model container. No inbound or outbound network calls can be made to or from the model container.
     */
    EnableNetworkIsolation?: Boolean;
  }
  export interface CreateModelOutput {
    /**
     * The ARN of the model created in Amazon SageMaker.
     */
    ModelArn: ModelArn;
  }
  export interface CreateModelPackageGroupInput {
    /**
     * The name of the model group.
     */
    ModelPackageGroupName: EntityName;
    /**
     * A description for the model group.
     */
    ModelPackageGroupDescription?: EntityDescription;
    /**
     * A list of key value pairs associated with the model group. For more information, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference Guide.
     */
    Tags?: TagList;
  }
  export interface CreateModelPackageGroupOutput {
    /**
     * The Amazon Resource Name (ARN) of the model group.
     */
    ModelPackageGroupArn: ModelPackageGroupArn;
  }
  export interface CreateModelPackageInput {
    /**
     * The name of the model package. The name must have 1 to 63 characters. Valid characters are a-z, A-Z, 0-9, and - (hyphen). This parameter is required for unversioned models. It is not applicable to versioned models.
     */
    ModelPackageName?: EntityName;
    /**
     * The name or Amazon Resource Name (ARN) of the model package group that this model version belongs to. This parameter is required for versioned models, and does not apply to unversioned models.
     */
    ModelPackageGroupName?: ArnOrName;
    /**
     * A description of the model package.
     */
    ModelPackageDescription?: EntityDescription;
    /**
     * Specifies details about inference jobs that can be run with models based on this model package, including the following:   The Amazon ECR paths of containers that contain the inference code and model artifacts.   The instance types that the model package supports for transform jobs and real-time endpoints used for inference.   The input and output content formats that the model package supports for inference.  
     */
    InferenceSpecification?: InferenceSpecification;
    /**
     * Specifies configurations for one or more transform jobs that Amazon SageMaker runs to test the model package.
     */
    ValidationSpecification?: ModelPackageValidationSpecification;
    /**
     * Details about the algorithm that was used to create the model package.
     */
    SourceAlgorithmSpecification?: SourceAlgorithmSpecification;
    /**
     * Whether to certify the model package for listing on Amazon Web Services Marketplace. This parameter is optional for unversioned models, and does not apply to versioned models.
     */
    CertifyForMarketplace?: CertifyForMarketplace;
    /**
     * A list of key value pairs associated with the model. For more information, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference Guide.
     */
    Tags?: TagList;
    /**
     * Whether the model is approved for deployment. This parameter is optional for versioned models, and does not apply to unversioned models. For versioned models, the value of this parameter must be set to Approved to deploy the model.
     */
    ModelApprovalStatus?: ModelApprovalStatus;
    MetadataProperties?: MetadataProperties;
    /**
     * A structure that contains model metrics reports.
     */
    ModelMetrics?: ModelMetrics;
    /**
     * A unique token that guarantees that the call to this API is idempotent.
     */
    ClientToken?: ClientToken;
    /**
     * The metadata properties associated with the model package versions.
     */
    CustomerMetadataProperties?: CustomerMetadataMap;
  }
  export interface CreateModelPackageOutput {
    /**
     * The Amazon Resource Name (ARN) of the new model package.
     */
    ModelPackageArn: ModelPackageArn;
  }
  export interface CreateModelQualityJobDefinitionRequest {
    /**
     * The name of the monitoring job definition.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
    /**
     * Specifies the constraints and baselines for the monitoring job.
     */
    ModelQualityBaselineConfig?: ModelQualityBaselineConfig;
    /**
     * The container that runs the monitoring job.
     */
    ModelQualityAppSpecification: ModelQualityAppSpecification;
    /**
     * A list of the inputs that are monitored. Currently endpoints are supported.
     */
    ModelQualityJobInput: ModelQualityJobInput;
    ModelQualityJobOutputConfig: MonitoringOutputConfig;
    JobResources: MonitoringResources;
    /**
     * Specifies the network configuration for the monitoring job.
     */
    NetworkConfig?: MonitoringNetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker can assume to perform tasks on your behalf.
     */
    RoleArn: RoleArn;
    StoppingCondition?: MonitoringStoppingCondition;
    /**
     * (Optional) An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide.
     */
    Tags?: TagList;
  }
  export interface CreateModelQualityJobDefinitionResponse {
    /**
     * The Amazon Resource Name (ARN) of the model quality monitoring job.
     */
    JobDefinitionArn: MonitoringJobDefinitionArn;
  }
  export interface CreateMonitoringScheduleRequest {
    /**
     * The name of the monitoring schedule. The name must be unique within an Amazon Web Services Region within an Amazon Web Services account.
     */
    MonitoringScheduleName: MonitoringScheduleName;
    /**
     * The configuration object that specifies the monitoring schedule and defines the monitoring job.
     */
    MonitoringScheduleConfig: MonitoringScheduleConfig;
    /**
     * (Optional) An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide.
     */
    Tags?: TagList;
  }
  export interface CreateMonitoringScheduleResponse {
    /**
     * The Amazon Resource Name (ARN) of the monitoring schedule.
     */
    MonitoringScheduleArn: MonitoringScheduleArn;
  }
  export interface CreateNotebookInstanceInput {
    /**
     * The name of the new notebook instance.
     */
    NotebookInstanceName: NotebookInstanceName;
    /**
     * The type of ML compute instance to launch for the notebook instance.
     */
    InstanceType: InstanceType;
    /**
     * The ID of the subnet in a VPC to which you would like to have a connectivity from your ML compute instance. 
     */
    SubnetId?: SubnetId;
    /**
     * The VPC security group IDs, in the form sg-xxxxxxxx. The security groups must be for the same VPC as specified in the subnet. 
     */
    SecurityGroupIds?: SecurityGroupIds;
    /**
     *  When you send any requests to Amazon Web Services resources from the notebook instance, Amazon SageMaker assumes this role to perform tasks on your behalf. You must grant this role necessary permissions so Amazon SageMaker can perform these tasks. The policy must allow the Amazon SageMaker service principal (sagemaker.amazonaws.com) permissions to assume this role. For more information, see Amazon SageMaker Roles.   To be able to pass this role to Amazon SageMaker, the caller of this API must have the iam:PassRole permission. 
     */
    RoleArn: RoleArn;
    /**
     * The Amazon Resource Name (ARN) of a Amazon Web Services Key Management Service key that Amazon SageMaker uses to encrypt data on the storage volume attached to your notebook instance. The KMS key you provide must be enabled. For information, see Enabling and Disabling Keys in the Amazon Web Services Key Management Service Developer Guide.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
    /**
     * The name of a lifecycle configuration to associate with the notebook instance. For information about lifestyle configurations, see Step 2.1: (Optional) Customize a Notebook Instance.
     */
    LifecycleConfigName?: NotebookInstanceLifecycleConfigName;
    /**
     * Sets whether Amazon SageMaker provides internet access to the notebook instance. If you set this to Disabled this notebook instance is able to access resources only in your VPC, and is not be able to connect to Amazon SageMaker training and endpoint services unless you configure a NAT Gateway in your VPC. For more information, see Notebook Instances Are Internet-Enabled by Default. You can set the value of this parameter to Disabled only if you set a value for the SubnetId parameter.
     */
    DirectInternetAccess?: DirectInternetAccess;
    /**
     * The size, in GB, of the ML storage volume to attach to the notebook instance. The default value is 5 GB.
     */
    VolumeSizeInGB?: NotebookInstanceVolumeSizeInGB;
    /**
     * A list of Elastic Inference (EI) instance types to associate with this notebook instance. Currently, only one instance type can be associated with a notebook instance. For more information, see Using Elastic Inference in Amazon SageMaker.
     */
    AcceleratorTypes?: NotebookInstanceAcceleratorTypes;
    /**
     * A Git repository to associate with the notebook instance as its default code repository. This can be either the name of a Git repository stored as a resource in your account, or the URL of a Git repository in Amazon Web Services CodeCommit or in any other Git repository. When you open a notebook instance, it opens in the directory that contains this repository. For more information, see Associating Git Repositories with Amazon SageMaker Notebook Instances.
     */
    DefaultCodeRepository?: CodeRepositoryNameOrUrl;
    /**
     * An array of up to three Git repositories to associate with the notebook instance. These can be either the names of Git repositories stored as resources in your account, or the URL of Git repositories in Amazon Web Services CodeCommit or in any other Git repository. These repositories are cloned at the same level as the default repository of your notebook instance. For more information, see Associating Git Repositories with Amazon SageMaker Notebook Instances.
     */
    AdditionalCodeRepositories?: AdditionalCodeRepositoryNamesOrUrls;
    /**
     * Whether root access is enabled or disabled for users of the notebook instance. The default value is Enabled.  Lifecycle configurations need root access to be able to set up a notebook instance. Because of this, lifecycle configurations associated with a notebook instance always run with root access even if you disable root access for users. 
     */
    RootAccess?: RootAccess;
    /**
     * The platform identifier of the notebook instance runtime environment.
     */
    PlatformIdentifier?: PlatformIdentifier;
  }
  export interface CreateNotebookInstanceLifecycleConfigInput {
    /**
     * The name of the lifecycle configuration.
     */
    NotebookInstanceLifecycleConfigName: NotebookInstanceLifecycleConfigName;
    /**
     * A shell script that runs only once, when you create a notebook instance. The shell script must be a base64-encoded string.
     */
    OnCreate?: NotebookInstanceLifecycleConfigList;
    /**
     * A shell script that runs every time you start a notebook instance, including when you create the notebook instance. The shell script must be a base64-encoded string.
     */
    OnStart?: NotebookInstanceLifecycleConfigList;
  }
  export interface CreateNotebookInstanceLifecycleConfigOutput {
    /**
     * The Amazon Resource Name (ARN) of the lifecycle configuration.
     */
    NotebookInstanceLifecycleConfigArn?: NotebookInstanceLifecycleConfigArn;
  }
  export interface CreateNotebookInstanceOutput {
    /**
     * The Amazon Resource Name (ARN) of the notebook instance. 
     */
    NotebookInstanceArn?: NotebookInstanceArn;
  }
  export interface CreatePipelineRequest {
    /**
     * The name of the pipeline.
     */
    PipelineName: PipelineName;
    /**
     * The display name of the pipeline.
     */
    PipelineDisplayName?: PipelineName;
    /**
     * The JSON pipeline definition of the pipeline.
     */
    PipelineDefinition: PipelineDefinition;
    /**
     * A description of the pipeline.
     */
    PipelineDescription?: PipelineDescription;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than one time.
     */
    ClientRequestToken: IdempotencyToken;
    /**
     * The Amazon Resource Name (ARN) of the role used by the pipeline to access and create resources.
     */
    RoleArn: RoleArn;
    /**
     * A list of tags to apply to the created pipeline.
     */
    Tags?: TagList;
  }
  export interface CreatePipelineResponse {
    /**
     * The Amazon Resource Name (ARN) of the created pipeline.
     */
    PipelineArn?: PipelineArn;
  }
  export interface CreatePresignedDomainUrlRequest {
    /**
     * The domain ID.
     */
    DomainId: DomainId;
    /**
     * The name of the UserProfile to sign-in as.
     */
    UserProfileName: UserProfileName;
    /**
     * The session expiration duration in seconds. This value defaults to 43200.
     */
    SessionExpirationDurationInSeconds?: SessionExpirationDurationInSeconds;
    /**
     * The number of seconds until the pre-signed URL expires. This value defaults to 300.
     */
    ExpiresInSeconds?: ExpiresInSeconds;
  }
  export interface CreatePresignedDomainUrlResponse {
    /**
     * The presigned URL.
     */
    AuthorizedUrl?: PresignedDomainUrl;
  }
  export interface CreatePresignedNotebookInstanceUrlInput {
    /**
     * The name of the notebook instance.
     */
    NotebookInstanceName: NotebookInstanceName;
    /**
     * The duration of the session, in seconds. The default is 12 hours.
     */
    SessionExpirationDurationInSeconds?: SessionExpirationDurationInSeconds;
  }
  export interface CreatePresignedNotebookInstanceUrlOutput {
    /**
     * A JSON object that contains the URL string. 
     */
    AuthorizedUrl?: NotebookInstanceUrl;
  }
  export interface CreateProcessingJobRequest {
    /**
     * An array of inputs configuring the data to download into the processing container.
     */
    ProcessingInputs?: ProcessingInputs;
    /**
     * Output configuration for the processing job.
     */
    ProcessingOutputConfig?: ProcessingOutputConfig;
    /**
     *  The name of the processing job. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    ProcessingJobName: ProcessingJobName;
    /**
     * Identifies the resources, ML compute instances, and ML storage volumes to deploy for a processing job. In distributed training, you specify more than one instance.
     */
    ProcessingResources: ProcessingResources;
    /**
     * The time limit for how long the processing job is allowed to run.
     */
    StoppingCondition?: ProcessingStoppingCondition;
    /**
     * Configures the processing job to run a specified Docker container image.
     */
    AppSpecification: AppSpecification;
    /**
     * The environment variables to set in the Docker container. Up to 100 key and values entries in the map are supported.
     */
    Environment?: ProcessingEnvironmentMap;
    /**
     * Networking options for a processing job, such as whether to allow inbound and outbound network calls to and from processing containers, and the VPC subnets and security groups to use for VPC-enabled processing jobs.
     */
    NetworkConfig?: NetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker can assume to perform tasks on your behalf.
     */
    RoleArn: RoleArn;
    /**
     * (Optional) An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide.
     */
    Tags?: TagList;
    ExperimentConfig?: ExperimentConfig;
  }
  export interface CreateProcessingJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the processing job.
     */
    ProcessingJobArn: ProcessingJobArn;
  }
  export interface CreateProjectInput {
    /**
     * The name of the project.
     */
    ProjectName: ProjectEntityName;
    /**
     * A description for the project.
     */
    ProjectDescription?: EntityDescription;
    /**
     * The product ID and provisioning artifact ID to provision a service catalog. The provisioning artifact ID will default to the latest provisioning artifact ID of the product, if you don't provide the provisioning artifact ID. For more information, see What is Amazon Web Services Service Catalog.
     */
    ServiceCatalogProvisioningDetails: ServiceCatalogProvisioningDetails;
    /**
     * An array of key-value pairs that you want to use to organize and track your Amazon Web Services resource costs. For more information, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference Guide.
     */
    Tags?: TagList;
  }
  export interface CreateProjectOutput {
    /**
     * The Amazon Resource Name (ARN) of the project.
     */
    ProjectArn: ProjectArn;
    /**
     * The ID of the new project.
     */
    ProjectId: ProjectId;
  }
  export interface CreateStudioLifecycleConfigRequest {
    /**
     * The name of the Studio Lifecycle Configuration to create.
     */
    StudioLifecycleConfigName: StudioLifecycleConfigName;
    /**
     * The content of your Studio Lifecycle Configuration script. This content must be base64 encoded.
     */
    StudioLifecycleConfigContent: StudioLifecycleConfigContent;
    /**
     * The App type that the Lifecycle Configuration is attached to.
     */
    StudioLifecycleConfigAppType: StudioLifecycleConfigAppType;
    /**
     * Tags to be associated with the Lifecycle Configuration. Each tag consists of a key and an optional value. Tag keys must be unique per resource. Tags are searchable using the Search API. 
     */
    Tags?: TagList;
  }
  export interface CreateStudioLifecycleConfigResponse {
    /**
     * The ARN of your created Lifecycle Configuration.
     */
    StudioLifecycleConfigArn?: StudioLifecycleConfigArn;
  }
  export interface CreateTrainingJobRequest {
    /**
     * The name of the training job. The name must be unique within an Amazon Web Services Region in an Amazon Web Services account. 
     */
    TrainingJobName: TrainingJobName;
    /**
     * Algorithm-specific parameters that influence the quality of the model. You set hyperparameters before you start the learning process. For a list of hyperparameters for each training algorithm provided by Amazon SageMaker, see Algorithms.  You can specify a maximum of 100 hyperparameters. Each hyperparameter is a key-value pair. Each key and value is limited to 256 characters, as specified by the Length Constraint. 
     */
    HyperParameters?: HyperParameters;
    /**
     * The registry path of the Docker image that contains the training algorithm and algorithm-specific metadata, including the input mode. For more information about algorithms provided by Amazon SageMaker, see Algorithms. For information about providing your own algorithms, see Using Your Own Algorithms with Amazon SageMaker. 
     */
    AlgorithmSpecification: AlgorithmSpecification;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker can assume to perform tasks on your behalf.  During model training, Amazon SageMaker needs your permission to read input data from an S3 bucket, download a Docker image that contains training code, write model artifacts to an S3 bucket, write logs to Amazon CloudWatch Logs, and publish metrics to Amazon CloudWatch. You grant permissions for all of these tasks to an IAM role. For more information, see Amazon SageMaker Roles.   To be able to pass this role to Amazon SageMaker, the caller of this API must have the iam:PassRole permission. 
     */
    RoleArn: RoleArn;
    /**
     * An array of Channel objects. Each channel is a named input source. InputDataConfig describes the input data and its location.  Algorithms can accept input data from one or more channels. For example, an algorithm might have two channels of input data, training_data and validation_data. The configuration for each channel provides the S3, EFS, or FSx location where the input data is stored. It also provides information about the stored data: the MIME type, compression method, and whether the data is wrapped in RecordIO format.  Depending on the input mode that the algorithm supports, Amazon SageMaker either copies input data files from an S3 bucket to a local directory in the Docker container, or makes it available as input streams. For example, if you specify an EFS location, input data files will be made available as input streams. They do not need to be downloaded.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * Specifies the path to the S3 location where you want to store model artifacts. Amazon SageMaker creates subfolders for the artifacts. 
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The resources, including the ML compute instances and ML storage volumes, to use for model training.  ML storage volumes store model artifacts and incremental states. Training algorithms might also use ML storage volumes for scratch space. If you want Amazon SageMaker to use the ML storage volume to store the training data, choose File as the TrainingInputMode in the algorithm specification. For distributed training algorithms, specify an instance count greater than 1.
     */
    ResourceConfig: ResourceConfig;
    /**
     * A VpcConfig object that specifies the VPC that you want your training job to connect to. Control access to and from your training container by configuring the VPC. For more information, see Protect Training Jobs by Using an Amazon Virtual Private Cloud.
     */
    VpcConfig?: VpcConfig;
    /**
     * Specifies a limit to how long a model training job can run. It also specifies how long a managed Spot training job has to complete. When the job reaches the time limit, Amazon SageMaker ends the training job. Use this API to cap model training costs. To stop a job, Amazon SageMaker sends the algorithm the SIGTERM signal, which delays job termination for 120 seconds. Algorithms can use this 120-second window to save the model artifacts, so the results of training are not lost. 
     */
    StoppingCondition: StoppingCondition;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
    /**
     * Isolates the training container. No inbound or outbound network calls can be made, except for calls between peers within a training cluster for distributed training. If you enable network isolation for training jobs that are configured to use a VPC, Amazon SageMaker downloads and uploads customer data and model artifacts through the specified VPC, but the training container does not have network access.
     */
    EnableNetworkIsolation?: Boolean;
    /**
     * To encrypt all communications between ML compute instances in distributed training, choose True. Encryption provides greater security for distributed training, but training might take longer. How long it takes depends on the amount of communication between compute instances, especially if you use a deep learning algorithm in distributed training. For more information, see Protect Communications Between ML Compute Instances in a Distributed Training Job.
     */
    EnableInterContainerTrafficEncryption?: Boolean;
    /**
     * To train models using managed spot training, choose True. Managed spot training provides a fully managed and scalable infrastructure for training machine learning models. this option is useful when training jobs can be interrupted and when there is flexibility when the training job is run.  The complete and intermediate results of jobs are stored in an Amazon S3 bucket, and can be used as a starting point to train models incrementally. Amazon SageMaker provides metrics and logs in CloudWatch. They can be used to see when managed spot training jobs are running, interrupted, resumed, or completed. 
     */
    EnableManagedSpotTraining?: Boolean;
    /**
     * Contains information about the output location for managed spot training checkpoint data.
     */
    CheckpointConfig?: CheckpointConfig;
    DebugHookConfig?: DebugHookConfig;
    /**
     * Configuration information for Debugger rules for debugging output tensors.
     */
    DebugRuleConfigurations?: DebugRuleConfigurations;
    TensorBoardOutputConfig?: TensorBoardOutputConfig;
    ExperimentConfig?: ExperimentConfig;
    ProfilerConfig?: ProfilerConfig;
    /**
     * Configuration information for Debugger rules for profiling system and framework metrics.
     */
    ProfilerRuleConfigurations?: ProfilerRuleConfigurations;
    /**
     * The environment variables to set in the Docker container.
     */
    Environment?: TrainingEnvironmentMap;
    /**
     * The number of times to retry the job when the job fails due to an InternalServerError.
     */
    RetryStrategy?: RetryStrategy;
  }
  export interface CreateTrainingJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the training job.
     */
    TrainingJobArn: TrainingJobArn;
  }
  export interface CreateTransformJobRequest {
    /**
     * The name of the transform job. The name must be unique within an Amazon Web Services Region in an Amazon Web Services account. 
     */
    TransformJobName: TransformJobName;
    /**
     * The name of the model that you want to use for the transform job. ModelName must be the name of an existing Amazon SageMaker model within an Amazon Web Services Region in an Amazon Web Services account.
     */
    ModelName: ModelName;
    /**
     * The maximum number of parallel requests that can be sent to each instance in a transform job. If MaxConcurrentTransforms is set to 0 or left unset, Amazon SageMaker checks the optional execution-parameters to determine the settings for your chosen algorithm. If the execution-parameters endpoint is not enabled, the default value is 1. For more information on execution-parameters, see How Containers Serve Requests. For built-in algorithms, you don't need to set a value for MaxConcurrentTransforms.
     */
    MaxConcurrentTransforms?: MaxConcurrentTransforms;
    /**
     * Configures the timeout and maximum number of retries for processing a transform job invocation.
     */
    ModelClientConfig?: ModelClientConfig;
    /**
     * The maximum allowed size of the payload, in MB. A payload is the data portion of a record (without metadata). The value in MaxPayloadInMB must be greater than, or equal to, the size of a single record. To estimate the size of a record in MB, divide the size of your dataset by the number of records. To ensure that the records fit within the maximum payload size, we recommend using a slightly larger value. The default value is 6 MB.  For cases where the payload might be arbitrarily large and is transmitted using HTTP chunked encoding, set the value to 0. This feature works only in supported algorithms. Currently, Amazon SageMaker built-in algorithms do not support HTTP chunked encoding.
     */
    MaxPayloadInMB?: MaxPayloadInMB;
    /**
     * Specifies the number of records to include in a mini-batch for an HTTP inference request. A record  is a single unit of input data that inference can be made on. For example, a single line in a CSV file is a record.  To enable the batch strategy, you must set the SplitType property to Line, RecordIO, or TFRecord. To use only one record when making an HTTP invocation request to a container, set BatchStrategy to SingleRecord and SplitType to Line. To fit as many records in a mini-batch as can fit within the MaxPayloadInMB limit, set BatchStrategy to MultiRecord and SplitType to Line.
     */
    BatchStrategy?: BatchStrategy;
    /**
     * The environment variables to set in the Docker container. We support up to 16 key and values entries in the map.
     */
    Environment?: TransformEnvironmentMap;
    /**
     * Describes the input source and the way the transform job consumes it.
     */
    TransformInput: TransformInput;
    /**
     * Describes the results of the transform job.
     */
    TransformOutput: TransformOutput;
    /**
     * Describes the resources, including ML instance types and ML instance count, to use for the transform job.
     */
    TransformResources: TransformResources;
    /**
     * The data structure used to specify the data to be used for inference in a batch transform job and to associate the data that is relevant to the prediction results in the output. The input filter provided allows you to exclude input data that is not needed for inference in a batch transform job. The output filter provided allows you to include input data relevant to interpreting the predictions in the output from the job. For more information, see Associate Prediction Results with their Corresponding Input Records.
     */
    DataProcessing?: DataProcessing;
    /**
     * (Optional) An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide.
     */
    Tags?: TagList;
    ExperimentConfig?: ExperimentConfig;
  }
  export interface CreateTransformJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the transform job.
     */
    TransformJobArn: TransformJobArn;
  }
  export interface CreateTrialComponentRequest {
    /**
     * The name of the component. The name must be unique in your Amazon Web Services account and is not case-sensitive.
     */
    TrialComponentName: ExperimentEntityName;
    /**
     * The name of the component as displayed. The name doesn't need to be unique. If DisplayName isn't specified, TrialComponentName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    /**
     * The status of the component. States include:   InProgress   Completed   Failed  
     */
    Status?: TrialComponentStatus;
    /**
     * When the component started.
     */
    StartTime?: Timestamp;
    /**
     * When the component ended.
     */
    EndTime?: Timestamp;
    /**
     * The hyperparameters for the component.
     */
    Parameters?: TrialComponentParameters;
    /**
     * The input artifacts for the component. Examples of input artifacts are datasets, algorithms, hyperparameters, source code, and instance types.
     */
    InputArtifacts?: TrialComponentArtifacts;
    /**
     * The output artifacts for the component. Examples of output artifacts are metrics, snapshots, logs, and images.
     */
    OutputArtifacts?: TrialComponentArtifacts;
    MetadataProperties?: MetadataProperties;
    /**
     * A list of tags to associate with the component. You can use Search API to search on the tags.
     */
    Tags?: TagList;
  }
  export interface CreateTrialComponentResponse {
    /**
     * The Amazon Resource Name (ARN) of the trial component.
     */
    TrialComponentArn?: TrialComponentArn;
  }
  export interface CreateTrialRequest {
    /**
     * The name of the trial. The name must be unique in your Amazon Web Services account and is not case-sensitive.
     */
    TrialName: ExperimentEntityName;
    /**
     * The name of the trial as displayed. The name doesn't need to be unique. If DisplayName isn't specified, TrialName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    /**
     * The name of the experiment to associate the trial with.
     */
    ExperimentName: ExperimentEntityName;
    MetadataProperties?: MetadataProperties;
    /**
     * A list of tags to associate with the trial. You can use Search API to search on the tags.
     */
    Tags?: TagList;
  }
  export interface CreateTrialResponse {
    /**
     * The Amazon Resource Name (ARN) of the trial.
     */
    TrialArn?: TrialArn;
  }
  export interface CreateUserProfileRequest {
    /**
     * The ID of the associated Domain.
     */
    DomainId: DomainId;
    /**
     * A name for the UserProfile. This value is not case sensitive.
     */
    UserProfileName: UserProfileName;
    /**
     * A specifier for the type of value specified in SingleSignOnUserValue. Currently, the only supported value is "UserName". If the Domain's AuthMode is SSO, this field is required. If the Domain's AuthMode is not SSO, this field cannot be specified. 
     */
    SingleSignOnUserIdentifier?: SingleSignOnUserIdentifier;
    /**
     * The username of the associated Amazon Web Services Single Sign-On User for this UserProfile. If the Domain's AuthMode is SSO, this field is required, and must match a valid username of a user in your directory. If the Domain's AuthMode is not SSO, this field cannot be specified. 
     */
    SingleSignOnUserValue?: String256;
    /**
     * Each tag consists of a key and an optional value. Tag keys must be unique per resource. Tags that you specify for the User Profile are also added to all Apps that the User Profile launches.
     */
    Tags?: TagList;
    /**
     * A collection of settings.
     */
    UserSettings?: UserSettings;
  }
  export interface CreateUserProfileResponse {
    /**
     * The user profile Amazon Resource Name (ARN).
     */
    UserProfileArn?: UserProfileArn;
  }
  export interface CreateWorkforceRequest {
    /**
     * Use this parameter to configure an Amazon Cognito private workforce. A single Cognito workforce is created using and corresponds to a single  Amazon Cognito user pool. Do not use OidcConfig if you specify values for CognitoConfig.
     */
    CognitoConfig?: CognitoConfig;
    /**
     * Use this parameter to configure a private workforce using your own OIDC Identity Provider. Do not use CognitoConfig if you specify values for OidcConfig.
     */
    OidcConfig?: OidcConfig;
    SourceIpConfig?: SourceIpConfig;
    /**
     * The name of the private workforce.
     */
    WorkforceName: WorkforceName;
    /**
     * An array of key-value pairs that contain metadata to help you categorize and organize our workforce. Each tag consists of a key and a value, both of which you define.
     */
    Tags?: TagList;
  }
  export interface CreateWorkforceResponse {
    /**
     * The Amazon Resource Name (ARN) of the workforce.
     */
    WorkforceArn: WorkforceArn;
  }
  export interface CreateWorkteamRequest {
    /**
     * The name of the work team. Use this name to identify the work team.
     */
    WorkteamName: WorkteamName;
    /**
     * The name of the workforce.
     */
    WorkforceName?: WorkforceName;
    /**
     * A list of MemberDefinition objects that contains objects that identify the workers that make up the work team.  Workforces can be created using Amazon Cognito or your own OIDC Identity Provider (IdP). For private workforces created using Amazon Cognito use CognitoMemberDefinition. For workforces created using your own OIDC identity provider (IdP) use OidcMemberDefinition. Do not provide input for both of these parameters in a single request. For workforces created using Amazon Cognito, private work teams correspond to Amazon Cognito user groups within the user pool used to create a workforce. All of the CognitoMemberDefinition objects that make up the member definition must have the same ClientId and UserPool values. To add a Amazon Cognito user group to an existing worker pool, see Adding groups to a User Pool. For more information about user pools, see Amazon Cognito User Pools. For workforces created using your own OIDC IdP, specify the user groups that you want to include in your private work team in OidcMemberDefinition by listing those groups in Groups.
     */
    MemberDefinitions: MemberDefinitions;
    /**
     * A description of the work team.
     */
    Description: String200;
    /**
     * Configures notification of workers regarding available or expiring work items.
     */
    NotificationConfiguration?: NotificationConfiguration;
    /**
     * An array of key-value pairs. For more information, see Resource Tag and Using Cost Allocation Tags in the  Amazon Web Services Billing and Cost Management User Guide.
     */
    Tags?: TagList;
  }
  export interface CreateWorkteamResponse {
    /**
     * The Amazon Resource Name (ARN) of the work team. You can use this ARN to identify the work team.
     */
    WorkteamArn?: WorkteamArn;
  }
  export type CreationTime = Date;
  export type CsvContentType = string;
  export type CsvContentTypes = CsvContentType[];
  export interface CustomImage {
    /**
     * The name of the CustomImage. Must be unique to your account.
     */
    ImageName: ImageName;
    /**
     * The version number of the CustomImage.
     */
    ImageVersionNumber?: ImageVersionNumber;
    /**
     * The name of the AppImageConfig.
     */
    AppImageConfigName: AppImageConfigName;
  }
  export type CustomImages = CustomImage[];
  export type CustomerMetadataKey = string;
  export type CustomerMetadataKeyList = CustomerMetadataKey[];
  export type CustomerMetadataMap = {[key: string]: CustomerMetadataValue};
  export type CustomerMetadataValue = string;
  export interface DataCaptureConfig {
    /**
     * 
     */
    EnableCapture?: EnableCapture;
    /**
     * 
     */
    InitialSamplingPercentage: SamplingPercentage;
    /**
     * 
     */
    DestinationS3Uri: DestinationS3Uri;
    /**
     * 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * 
     */
    CaptureOptions: CaptureOptionList;
    /**
     * 
     */
    CaptureContentTypeHeader?: CaptureContentTypeHeader;
  }
  export interface DataCaptureConfigSummary {
    /**
     * 
     */
    EnableCapture: EnableCapture;
    /**
     * 
     */
    CaptureStatus: CaptureStatus;
    /**
     * 
     */
    CurrentSamplingPercentage: SamplingPercentage;
    /**
     * 
     */
    DestinationS3Uri: DestinationS3Uri;
    /**
     * 
     */
    KmsKeyId: KmsKeyId;
  }
  export interface DataCatalogConfig {
    /**
     * The name of the Glue table.
     */
    TableName: TableName;
    /**
     * The name of the Glue table catalog.
     */
    Catalog: Catalog;
    /**
     * The name of the Glue table database.
     */
    Database: Database;
  }
  export type DataDistributionType = "FullyReplicated"|"ShardedByS3Key"|string;
  export type DataExplorationNotebookLocation = string;
  export type DataInputConfig = string;
  export interface DataProcessing {
    /**
     * A JSONPath expression used to select a portion of the input data to pass to the algorithm. Use the InputFilter parameter to exclude fields, such as an ID column, from the input. If you want Amazon SageMaker to pass the entire input dataset to the algorithm, accept the default value $. Examples: "$", "$[1:]", "$.features" 
     */
    InputFilter?: JsonPath;
    /**
     * A JSONPath expression used to select a portion of the joined dataset to save in the output file for a batch transform job. If you want Amazon SageMaker to store the entire input dataset in the output file, leave the default value, $. If you specify indexes that aren't within the dimension size of the joined dataset, you get an error. Examples: "$", "$[0,5:]", "$['id','SageMakerOutput']" 
     */
    OutputFilter?: JsonPath;
    /**
     * Specifies the source of the data to join with the transformed data. The valid values are None and Input. The default value is None, which specifies not to join the input with the transformed data. If you want the batch transform job to join the original input data with the transformed data, set JoinSource to Input. You can specify OutputFilter as an additional filter to select a portion of the joined dataset and store it in the output file. For JSON or JSONLines objects, such as a JSON array, SageMaker adds the transformed data to the input JSON object in an attribute called SageMakerOutput. The joined result for JSON must be a key-value pair object. If the input is not a key-value pair object, SageMaker creates a new JSON file. In the new JSON file, and the input data is stored under the SageMakerInput key and the results are stored in SageMakerOutput. For CSV data, SageMaker takes each row as a JSON array and joins the transformed data with the input by appending each transformed row to the end of the input. The joined data has the original input data followed by the transformed data and the output is a CSV file. For information on how joining in applied, see Workflow for Associating Inferences with Input Records.
     */
    JoinSource?: JoinSource;
  }
  export interface DataQualityAppSpecification {
    /**
     * The container image that the data quality monitoring job runs.
     */
    ImageUri: ImageUri;
    /**
     * The entrypoint for a container used to run a monitoring job.
     */
    ContainerEntrypoint?: ContainerEntrypoint;
    /**
     * The arguments to send to the container that the monitoring job runs.
     */
    ContainerArguments?: MonitoringContainerArguments;
    /**
     * An Amazon S3 URI to a script that is called per row prior to running analysis. It can base64 decode the payload and convert it into a flatted json so that the built-in container can use the converted data. Applicable only for the built-in (first party) containers.
     */
    RecordPreprocessorSourceUri?: S3Uri;
    /**
     * An Amazon S3 URI to a script that is called after analysis has been performed. Applicable only for the built-in (first party) containers.
     */
    PostAnalyticsProcessorSourceUri?: S3Uri;
    /**
     * Sets the environment variables in the container that the monitoring job runs.
     */
    Environment?: MonitoringEnvironmentMap;
  }
  export interface DataQualityBaselineConfig {
    /**
     * The name of the job that performs baselining for the data quality monitoring job.
     */
    BaseliningJobName?: ProcessingJobName;
    ConstraintsResource?: MonitoringConstraintsResource;
    StatisticsResource?: MonitoringStatisticsResource;
  }
  export interface DataQualityJobInput {
    EndpointInput: EndpointInput;
  }
  export interface DataSource {
    /**
     * The S3 location of the data source that is associated with a channel.
     */
    S3DataSource?: S3DataSource;
    /**
     * The file system that is associated with a channel.
     */
    FileSystemDataSource?: FileSystemDataSource;
  }
  export type Database = string;
  export interface DatasetDefinition {
    AthenaDatasetDefinition?: AthenaDatasetDefinition;
    RedshiftDatasetDefinition?: RedshiftDatasetDefinition;
    /**
     * The local path where you want Amazon SageMaker to download the Dataset Definition inputs to run a processing job. LocalPath is an absolute path to the input data. This is a required parameter when AppManaged is False (default).
     */
    LocalPath?: ProcessingLocalPath;
    /**
     * Whether the generated dataset is FullyReplicated or ShardedByS3Key (default).
     */
    DataDistributionType?: DataDistributionType;
    /**
     * Whether to use File or Pipe input mode. In File (default) mode, Amazon SageMaker copies the data from the input source onto the local Amazon Elastic Block Store (Amazon EBS) volumes before starting your training algorithm. This is the most commonly used input mode. In Pipe mode, Amazon SageMaker streams input data from the source directly to your algorithm without using the EBS volume.
     */
    InputMode?: InputMode;
  }
  export interface DebugHookConfig {
    /**
     * Path to local storage location for metrics and tensors. Defaults to /opt/ml/output/tensors/.
     */
    LocalPath?: DirectoryPath;
    /**
     * Path to Amazon S3 storage location for metrics and tensors.
     */
    S3OutputPath: S3Uri;
    /**
     * Configuration information for the Debugger hook parameters.
     */
    HookParameters?: HookParameters;
    /**
     * Configuration information for Debugger tensor collections. To learn more about how to configure the CollectionConfiguration parameter, see Use the SageMaker and Debugger Configuration API Operations to Create, Update, and Debug Your Training Job. 
     */
    CollectionConfigurations?: CollectionConfigurations;
  }
  export interface DebugRuleConfiguration {
    /**
     * The name of the rule configuration. It must be unique relative to other rule configuration names.
     */
    RuleConfigurationName: RuleConfigurationName;
    /**
     * Path to local storage location for output of rules. Defaults to /opt/ml/processing/output/rule/.
     */
    LocalPath?: DirectoryPath;
    /**
     * Path to Amazon S3 storage location for rules.
     */
    S3OutputPath?: S3Uri;
    /**
     * The Amazon Elastic Container (ECR) Image for the managed rule evaluation.
     */
    RuleEvaluatorImage: AlgorithmImage;
    /**
     * The instance type to deploy a Debugger custom rule for debugging a training job.
     */
    InstanceType?: ProcessingInstanceType;
    /**
     * The size, in GB, of the ML storage volume attached to the processing instance.
     */
    VolumeSizeInGB?: OptionalVolumeSizeInGB;
    /**
     * Runtime configuration for rule container.
     */
    RuleParameters?: RuleParameters;
  }
  export type DebugRuleConfigurations = DebugRuleConfiguration[];
  export interface DebugRuleEvaluationStatus {
    /**
     * The name of the rule configuration.
     */
    RuleConfigurationName?: RuleConfigurationName;
    /**
     * The Amazon Resource Name (ARN) of the rule evaluation job.
     */
    RuleEvaluationJobArn?: ProcessingJobArn;
    /**
     * Status of the rule evaluation.
     */
    RuleEvaluationStatus?: RuleEvaluationStatus;
    /**
     * Details from the rule evaluation.
     */
    StatusDetails?: StatusDetails;
    /**
     * Timestamp when the rule evaluation status was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export type DebugRuleEvaluationStatuses = DebugRuleEvaluationStatus[];
  export type DefaultGid = number;
  export type DefaultUid = number;
  export interface DeleteActionRequest {
    /**
     * The name of the action to delete.
     */
    ActionName: ExperimentEntityName;
  }
  export interface DeleteActionResponse {
    /**
     * The Amazon Resource Name (ARN) of the action.
     */
    ActionArn?: ActionArn;
  }
  export interface DeleteAlgorithmInput {
    /**
     * The name of the algorithm to delete.
     */
    AlgorithmName: EntityName;
  }
  export interface DeleteAppImageConfigRequest {
    /**
     * The name of the AppImageConfig to delete.
     */
    AppImageConfigName: AppImageConfigName;
  }
  export interface DeleteAppRequest {
    /**
     * The domain ID.
     */
    DomainId: DomainId;
    /**
     * The user profile name.
     */
    UserProfileName: UserProfileName;
    /**
     * The type of app.
     */
    AppType: AppType;
    /**
     * The name of the app.
     */
    AppName: AppName;
  }
  export interface DeleteArtifactRequest {
    /**
     * The Amazon Resource Name (ARN) of the artifact to delete.
     */
    ArtifactArn?: ArtifactArn;
    /**
     * The URI of the source.
     */
    Source?: ArtifactSource;
  }
  export interface DeleteArtifactResponse {
    /**
     * The Amazon Resource Name (ARN) of the artifact.
     */
    ArtifactArn?: ArtifactArn;
  }
  export interface DeleteAssociationRequest {
    /**
     * The ARN of the source.
     */
    SourceArn: AssociationEntityArn;
    /**
     * The Amazon Resource Name (ARN) of the destination.
     */
    DestinationArn: AssociationEntityArn;
  }
  export interface DeleteAssociationResponse {
    /**
     * The ARN of the source.
     */
    SourceArn?: AssociationEntityArn;
    /**
     * The Amazon Resource Name (ARN) of the destination.
     */
    DestinationArn?: AssociationEntityArn;
  }
  export interface DeleteCodeRepositoryInput {
    /**
     * The name of the Git repository to delete.
     */
    CodeRepositoryName: EntityName;
  }
  export interface DeleteContextRequest {
    /**
     * The name of the context to delete.
     */
    ContextName: ExperimentEntityName;
  }
  export interface DeleteContextResponse {
    /**
     * The Amazon Resource Name (ARN) of the context.
     */
    ContextArn?: ContextArn;
  }
  export interface DeleteDataQualityJobDefinitionRequest {
    /**
     * The name of the data quality monitoring job definition to delete.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
  }
  export interface DeleteDeviceFleetRequest {
    /**
     * The name of the fleet to delete.
     */
    DeviceFleetName: EntityName;
  }
  export interface DeleteDomainRequest {
    /**
     * The domain ID.
     */
    DomainId: DomainId;
    /**
     * The retention policy for this domain, which specifies whether resources will be retained after the Domain is deleted. By default, all resources are retained (not automatically deleted). 
     */
    RetentionPolicy?: RetentionPolicy;
  }
  export interface DeleteEndpointConfigInput {
    /**
     * The name of the endpoint configuration that you want to delete.
     */
    EndpointConfigName: EndpointConfigName;
  }
  export interface DeleteEndpointInput {
    /**
     * The name of the endpoint that you want to delete.
     */
    EndpointName: EndpointName;
  }
  export interface DeleteExperimentRequest {
    /**
     * The name of the experiment to delete.
     */
    ExperimentName: ExperimentEntityName;
  }
  export interface DeleteExperimentResponse {
    /**
     * The Amazon Resource Name (ARN) of the experiment that is being deleted.
     */
    ExperimentArn?: ExperimentArn;
  }
  export interface DeleteFeatureGroupRequest {
    /**
     * The name of the FeatureGroup you want to delete. The name must be unique within an Amazon Web Services Region in an Amazon Web Services account. 
     */
    FeatureGroupName: FeatureGroupName;
  }
  export interface DeleteFlowDefinitionRequest {
    /**
     * The name of the flow definition you are deleting.
     */
    FlowDefinitionName: FlowDefinitionName;
  }
  export interface DeleteFlowDefinitionResponse {
  }
  export interface DeleteHumanTaskUiRequest {
    /**
     * The name of the human task user interface (work task template) you want to delete.
     */
    HumanTaskUiName: HumanTaskUiName;
  }
  export interface DeleteHumanTaskUiResponse {
  }
  export interface DeleteImageRequest {
    /**
     * The name of the image to delete.
     */
    ImageName: ImageName;
  }
  export interface DeleteImageResponse {
  }
  export interface DeleteImageVersionRequest {
    /**
     * The name of the image.
     */
    ImageName: ImageName;
    /**
     * The version to delete.
     */
    Version: ImageVersionNumber;
  }
  export interface DeleteImageVersionResponse {
  }
  export interface DeleteModelBiasJobDefinitionRequest {
    /**
     * The name of the model bias job definition to delete.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
  }
  export interface DeleteModelExplainabilityJobDefinitionRequest {
    /**
     * The name of the model explainability job definition to delete.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
  }
  export interface DeleteModelInput {
    /**
     * The name of the model to delete.
     */
    ModelName: ModelName;
  }
  export interface DeleteModelPackageGroupInput {
    /**
     * The name of the model group to delete.
     */
    ModelPackageGroupName: ArnOrName;
  }
  export interface DeleteModelPackageGroupPolicyInput {
    /**
     * The name of the model group for which to delete the policy.
     */
    ModelPackageGroupName: EntityName;
  }
  export interface DeleteModelPackageInput {
    /**
     * The name or Amazon Resource Name (ARN) of the model package to delete. When you specify a name, the name must have 1 to 63 characters. Valid characters are a-z, A-Z, 0-9, and - (hyphen).
     */
    ModelPackageName: VersionedArnOrName;
  }
  export interface DeleteModelQualityJobDefinitionRequest {
    /**
     * The name of the model quality monitoring job definition to delete.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
  }
  export interface DeleteMonitoringScheduleRequest {
    /**
     * The name of the monitoring schedule to delete.
     */
    MonitoringScheduleName: MonitoringScheduleName;
  }
  export interface DeleteNotebookInstanceInput {
    /**
     * The name of the Amazon SageMaker notebook instance to delete.
     */
    NotebookInstanceName: NotebookInstanceName;
  }
  export interface DeleteNotebookInstanceLifecycleConfigInput {
    /**
     * The name of the lifecycle configuration to delete.
     */
    NotebookInstanceLifecycleConfigName: NotebookInstanceLifecycleConfigName;
  }
  export interface DeletePipelineRequest {
    /**
     * The name of the pipeline to delete.
     */
    PipelineName: PipelineName;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than one time.
     */
    ClientRequestToken: IdempotencyToken;
  }
  export interface DeletePipelineResponse {
    /**
     * The Amazon Resource Name (ARN) of the pipeline to delete.
     */
    PipelineArn?: PipelineArn;
  }
  export interface DeleteProjectInput {
    /**
     * The name of the project to delete.
     */
    ProjectName: ProjectEntityName;
  }
  export interface DeleteStudioLifecycleConfigRequest {
    /**
     * The name of the Studio Lifecycle Configuration to delete.
     */
    StudioLifecycleConfigName: StudioLifecycleConfigName;
  }
  export interface DeleteTagsInput {
    /**
     * The Amazon Resource Name (ARN) of the resource whose tags you want to delete.
     */
    ResourceArn: ResourceArn;
    /**
     * An array or one or more tag keys to delete.
     */
    TagKeys: TagKeyList;
  }
  export interface DeleteTagsOutput {
  }
  export interface DeleteTrialComponentRequest {
    /**
     * The name of the component to delete.
     */
    TrialComponentName: ExperimentEntityName;
  }
  export interface DeleteTrialComponentResponse {
    /**
     * The Amazon Resource Name (ARN) of the component is being deleted.
     */
    TrialComponentArn?: TrialComponentArn;
  }
  export interface DeleteTrialRequest {
    /**
     * The name of the trial to delete.
     */
    TrialName: ExperimentEntityName;
  }
  export interface DeleteTrialResponse {
    /**
     * The Amazon Resource Name (ARN) of the trial that is being deleted.
     */
    TrialArn?: TrialArn;
  }
  export interface DeleteUserProfileRequest {
    /**
     * The domain ID.
     */
    DomainId: DomainId;
    /**
     * The user profile name.
     */
    UserProfileName: UserProfileName;
  }
  export interface DeleteWorkforceRequest {
    /**
     * The name of the workforce.
     */
    WorkforceName: WorkforceName;
  }
  export interface DeleteWorkforceResponse {
  }
  export interface DeleteWorkteamRequest {
    /**
     * The name of the work team to delete.
     */
    WorkteamName: WorkteamName;
  }
  export interface DeleteWorkteamResponse {
    /**
     * Returns true if the work team was successfully deleted; otherwise, returns false.
     */
    Success: Success;
  }
  export interface DeployedImage {
    /**
     * The image path you specified when you created the model.
     */
    SpecifiedImage?: ContainerImage;
    /**
     * The specific digest path of the image hosted in this ProductionVariant.
     */
    ResolvedImage?: ContainerImage;
    /**
     * The date and time when the image path for the model resolved to the ResolvedImage 
     */
    ResolutionTime?: Timestamp;
  }
  export type DeployedImages = DeployedImage[];
  export interface DeploymentConfig {
    /**
     * Update policy for a blue/green deployment. If this update policy is specified, SageMaker creates a new fleet during the deployment while maintaining the old fleet. SageMaker flips traffic to the new fleet according to the specified traffic routing configuration. Only one update policy should be used in the deployment configuration. If no update policy is specified, SageMaker uses a blue/green deployment strategy with all at once traffic shifting by default.
     */
    BlueGreenUpdatePolicy: BlueGreenUpdatePolicy;
    /**
     * Automatic rollback configuration for handling endpoint deployment failures and recovery.
     */
    AutoRollbackConfiguration?: AutoRollbackConfig;
  }
  export interface DeregisterDevicesRequest {
    /**
     * The name of the fleet the devices belong to.
     */
    DeviceFleetName: EntityName;
    /**
     * The unique IDs of the devices.
     */
    DeviceNames: DeviceNames;
  }
  export interface DescribeActionRequest {
    /**
     * The name of the action to describe.
     */
    ActionName: ExperimentEntityName;
  }
  export interface DescribeActionResponse {
    /**
     * The name of the action.
     */
    ActionName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the action.
     */
    ActionArn?: ActionArn;
    /**
     * The source of the action.
     */
    Source?: ActionSource;
    /**
     * The type of the action.
     */
    ActionType?: String256;
    /**
     * The description of the action.
     */
    Description?: ExperimentDescription;
    /**
     * The status of the action.
     */
    Status?: ActionStatus;
    /**
     * A list of the action's properties.
     */
    Properties?: LineageEntityParameters;
    /**
     * When the action was created.
     */
    CreationTime?: Timestamp;
    CreatedBy?: UserContext;
    /**
     * When the action was last modified.
     */
    LastModifiedTime?: Timestamp;
    LastModifiedBy?: UserContext;
    MetadataProperties?: MetadataProperties;
  }
  export interface DescribeAlgorithmInput {
    /**
     * The name of the algorithm to describe.
     */
    AlgorithmName: ArnOrName;
  }
  export interface DescribeAlgorithmOutput {
    /**
     * The name of the algorithm being described.
     */
    AlgorithmName: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the algorithm.
     */
    AlgorithmArn: AlgorithmArn;
    /**
     * A brief summary about the algorithm.
     */
    AlgorithmDescription?: EntityDescription;
    /**
     * A timestamp specifying when the algorithm was created.
     */
    CreationTime: CreationTime;
    /**
     * Details about training jobs run by this algorithm.
     */
    TrainingSpecification: TrainingSpecification;
    /**
     * Details about inference jobs that the algorithm runs.
     */
    InferenceSpecification?: InferenceSpecification;
    /**
     * Details about configurations for one or more training jobs that Amazon SageMaker runs to test the algorithm.
     */
    ValidationSpecification?: AlgorithmValidationSpecification;
    /**
     * The current status of the algorithm.
     */
    AlgorithmStatus: AlgorithmStatus;
    /**
     * Details about the current status of the algorithm.
     */
    AlgorithmStatusDetails: AlgorithmStatusDetails;
    /**
     * The product identifier of the algorithm.
     */
    ProductId?: ProductId;
    /**
     * Whether the algorithm is certified to be listed in Amazon Web Services Marketplace.
     */
    CertifyForMarketplace?: CertifyForMarketplace;
  }
  export interface DescribeAppImageConfigRequest {
    /**
     * The name of the AppImageConfig to describe.
     */
    AppImageConfigName: AppImageConfigName;
  }
  export interface DescribeAppImageConfigResponse {
    /**
     * The Amazon Resource Name (ARN) of the AppImageConfig.
     */
    AppImageConfigArn?: AppImageConfigArn;
    /**
     * The name of the AppImageConfig.
     */
    AppImageConfigName?: AppImageConfigName;
    /**
     * When the AppImageConfig was created.
     */
    CreationTime?: Timestamp;
    /**
     * When the AppImageConfig was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The configuration of a KernelGateway app.
     */
    KernelGatewayImageConfig?: KernelGatewayImageConfig;
  }
  export interface DescribeAppRequest {
    /**
     * The domain ID.
     */
    DomainId: DomainId;
    /**
     * The user profile name.
     */
    UserProfileName: UserProfileName;
    /**
     * The type of app.
     */
    AppType: AppType;
    /**
     * The name of the app.
     */
    AppName: AppName;
  }
  export interface DescribeAppResponse {
    /**
     * The Amazon Resource Name (ARN) of the app.
     */
    AppArn?: AppArn;
    /**
     * The type of app.
     */
    AppType?: AppType;
    /**
     * The name of the app.
     */
    AppName?: AppName;
    /**
     * The domain ID.
     */
    DomainId?: DomainId;
    /**
     * The user profile name.
     */
    UserProfileName?: UserProfileName;
    /**
     * The status.
     */
    Status?: AppStatus;
    /**
     * The timestamp of the last health check.
     */
    LastHealthCheckTimestamp?: Timestamp;
    /**
     * The timestamp of the last user's activity. LastUserActivityTimestamp is also updated when SageMaker performs health checks without user activity. As a result, this value is set to the same value as LastHealthCheckTimestamp.
     */
    LastUserActivityTimestamp?: Timestamp;
    /**
     * The creation time.
     */
    CreationTime?: CreationTime;
    /**
     * The failure reason.
     */
    FailureReason?: FailureReason;
    /**
     * The instance type and the Amazon Resource Name (ARN) of the SageMaker image created on the instance.
     */
    ResourceSpec?: ResourceSpec;
  }
  export interface DescribeArtifactRequest {
    /**
     * The Amazon Resource Name (ARN) of the artifact to describe.
     */
    ArtifactArn: ArtifactArn;
  }
  export interface DescribeArtifactResponse {
    /**
     * The name of the artifact.
     */
    ArtifactName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the artifact.
     */
    ArtifactArn?: ArtifactArn;
    /**
     * The source of the artifact.
     */
    Source?: ArtifactSource;
    /**
     * The type of the artifact.
     */
    ArtifactType?: String256;
    /**
     * A list of the artifact's properties.
     */
    Properties?: LineageEntityParameters;
    /**
     * When the artifact was created.
     */
    CreationTime?: Timestamp;
    CreatedBy?: UserContext;
    /**
     * When the artifact was last modified.
     */
    LastModifiedTime?: Timestamp;
    LastModifiedBy?: UserContext;
    MetadataProperties?: MetadataProperties;
  }
  export interface DescribeAutoMLJobRequest {
    /**
     * Requests information about an AutoML job using its unique name.
     */
    AutoMLJobName: AutoMLJobName;
  }
  export interface DescribeAutoMLJobResponse {
    /**
     * Returns the name of the AutoML job.
     */
    AutoMLJobName: AutoMLJobName;
    /**
     * Returns the ARN of the AutoML job.
     */
    AutoMLJobArn: AutoMLJobArn;
    /**
     * Returns the input data configuration for the AutoML job..
     */
    InputDataConfig: AutoMLInputDataConfig;
    /**
     * Returns the job's output data config.
     */
    OutputDataConfig: AutoMLOutputDataConfig;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Identity and Access Management (IAM) role that has read permission to the input data location and write permission to the output data location in Amazon S3.
     */
    RoleArn: RoleArn;
    /**
     * Returns the job's objective.
     */
    AutoMLJobObjective?: AutoMLJobObjective;
    /**
     * Returns the job's problem type.
     */
    ProblemType?: ProblemType;
    /**
     * Returns the configuration for the AutoML job.
     */
    AutoMLJobConfig?: AutoMLJobConfig;
    /**
     * Returns the creation time of the AutoML job.
     */
    CreationTime: Timestamp;
    /**
     * Returns the end time of the AutoML job.
     */
    EndTime?: Timestamp;
    /**
     * Returns the job's last modified time.
     */
    LastModifiedTime: Timestamp;
    /**
     * Returns the failure reason for an AutoML job, when applicable.
     */
    FailureReason?: AutoMLFailureReason;
    /**
     * Returns a list of reasons for partial failures within an AutoML job.
     */
    PartialFailureReasons?: AutoMLPartialFailureReasons;
    /**
     * Returns the job's best AutoMLCandidate.
     */
    BestCandidate?: AutoMLCandidate;
    /**
     * Returns the status of the AutoML job.
     */
    AutoMLJobStatus: AutoMLJobStatus;
    /**
     * Returns the secondary status of the AutoML job.
     */
    AutoMLJobSecondaryStatus: AutoMLJobSecondaryStatus;
    /**
     * Indicates whether the output for an AutoML job generates candidate definitions only.
     */
    GenerateCandidateDefinitionsOnly?: GenerateCandidateDefinitionsOnly;
    /**
     * Returns information on the job's artifacts found in AutoMLJobArtifacts.
     */
    AutoMLJobArtifacts?: AutoMLJobArtifacts;
    /**
     * This contains ProblemType, AutoMLJobObjective, and CompletionCriteria. If you do not provide these values, they are auto-inferred. If you do provide them, the values used are the ones you provide.
     */
    ResolvedAttributes?: ResolvedAttributes;
    /**
     * Indicates whether the model was deployed automatically to an endpoint and the name of that endpoint if deployed automatically.
     */
    ModelDeployConfig?: ModelDeployConfig;
    /**
     * Provides information about endpoint for the model deployment.
     */
    ModelDeployResult?: ModelDeployResult;
  }
  export interface DescribeCodeRepositoryInput {
    /**
     * The name of the Git repository to describe.
     */
    CodeRepositoryName: EntityName;
  }
  export interface DescribeCodeRepositoryOutput {
    /**
     * The name of the Git repository.
     */
    CodeRepositoryName: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the Git repository.
     */
    CodeRepositoryArn: CodeRepositoryArn;
    /**
     * The date and time that the repository was created.
     */
    CreationTime: CreationTime;
    /**
     * The date and time that the repository was last changed.
     */
    LastModifiedTime: LastModifiedTime;
    /**
     * Configuration details about the repository, including the URL where the repository is located, the default branch, and the Amazon Resource Name (ARN) of the Amazon Web Services Secrets Manager secret that contains the credentials used to access the repository.
     */
    GitConfig?: GitConfig;
  }
  export interface DescribeCompilationJobRequest {
    /**
     * The name of the model compilation job that you want information about.
     */
    CompilationJobName: EntityName;
  }
  export interface DescribeCompilationJobResponse {
    /**
     * The name of the model compilation job.
     */
    CompilationJobName: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the model compilation job.
     */
    CompilationJobArn: CompilationJobArn;
    /**
     * The status of the model compilation job.
     */
    CompilationJobStatus: CompilationJobStatus;
    /**
     * The time when the model compilation job started the CompilationJob instances.  You are billed for the time between this timestamp and the timestamp in the DescribeCompilationJobResponse$CompilationEndTime field. In Amazon CloudWatch Logs, the start time might be later than this time. That's because it takes time to download the compilation job, which depends on the size of the compilation job container. 
     */
    CompilationStartTime?: Timestamp;
    /**
     * The time when the model compilation job on a compilation job instance ended. For a successful or stopped job, this is when the job's model artifacts have finished uploading. For a failed job, this is when Amazon SageMaker detected that the job failed. 
     */
    CompilationEndTime?: Timestamp;
    /**
     * Specifies a limit to how long a model compilation job can run. When the job reaches the time limit, Amazon SageMaker ends the compilation job. Use this API to cap model training costs.
     */
    StoppingCondition: StoppingCondition;
    /**
     * The inference image to use when compiling a model. Specify an image only if the target device is a cloud instance.
     */
    InferenceImage?: InferenceImage;
    /**
     * The time that the model compilation job was created.
     */
    CreationTime: CreationTime;
    /**
     * The time that the status of the model compilation job was last modified.
     */
    LastModifiedTime: LastModifiedTime;
    /**
     * If a model compilation job failed, the reason it failed. 
     */
    FailureReason: FailureReason;
    /**
     * Information about the location in Amazon S3 that has been configured for storing the model artifacts used in the compilation job.
     */
    ModelArtifacts: ModelArtifacts;
    /**
     * Provides a BLAKE2 hash value that identifies the compiled model artifacts in Amazon S3.
     */
    ModelDigests?: ModelDigests;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker assumes to perform the model compilation job.
     */
    RoleArn: RoleArn;
    /**
     * Information about the location in Amazon S3 of the input model artifacts, the name and shape of the expected data inputs, and the framework in which the model was trained.
     */
    InputConfig: InputConfig;
    /**
     * Information about the output location for the compiled model and the target device that the model runs on.
     */
    OutputConfig: OutputConfig;
    /**
     * A VpcConfig object that specifies the VPC that you want your compilation job to connect to. Control access to your models by configuring the VPC. For more information, see Protect Compilation Jobs by Using an Amazon Virtual Private Cloud.
     */
    VpcConfig?: NeoVpcConfig;
  }
  export interface DescribeContextRequest {
    /**
     * The name of the context to describe.
     */
    ContextName: ExperimentEntityName;
  }
  export interface DescribeContextResponse {
    /**
     * The name of the context.
     */
    ContextName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the context.
     */
    ContextArn?: ContextArn;
    /**
     * The source of the context.
     */
    Source?: ContextSource;
    /**
     * The type of the context.
     */
    ContextType?: String256;
    /**
     * The description of the context.
     */
    Description?: ExperimentDescription;
    /**
     * A list of the context's properties.
     */
    Properties?: LineageEntityParameters;
    /**
     * When the context was created.
     */
    CreationTime?: Timestamp;
    CreatedBy?: UserContext;
    /**
     * When the context was last modified.
     */
    LastModifiedTime?: Timestamp;
    LastModifiedBy?: UserContext;
  }
  export interface DescribeDataQualityJobDefinitionRequest {
    /**
     * The name of the data quality monitoring job definition to describe.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
  }
  export interface DescribeDataQualityJobDefinitionResponse {
    /**
     * The Amazon Resource Name (ARN) of the data quality monitoring job definition.
     */
    JobDefinitionArn: MonitoringJobDefinitionArn;
    /**
     * The name of the data quality monitoring job definition.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
    /**
     * The time that the data quality monitoring job definition was created.
     */
    CreationTime: Timestamp;
    /**
     * The constraints and baselines for the data quality monitoring job definition.
     */
    DataQualityBaselineConfig?: DataQualityBaselineConfig;
    /**
     * Information about the container that runs the data quality monitoring job.
     */
    DataQualityAppSpecification: DataQualityAppSpecification;
    /**
     * The list of inputs for the data quality monitoring job. Currently endpoints are supported.
     */
    DataQualityJobInput: DataQualityJobInput;
    DataQualityJobOutputConfig: MonitoringOutputConfig;
    JobResources: MonitoringResources;
    /**
     * The networking configuration for the data quality monitoring job.
     */
    NetworkConfig?: MonitoringNetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker can assume to perform tasks on your behalf.
     */
    RoleArn: RoleArn;
    StoppingCondition?: MonitoringStoppingCondition;
  }
  export interface DescribeDeviceFleetRequest {
    /**
     * The name of the fleet.
     */
    DeviceFleetName: EntityName;
  }
  export interface DescribeDeviceFleetResponse {
    /**
     * The name of the fleet.
     */
    DeviceFleetName: EntityName;
    /**
     * The The Amazon Resource Name (ARN) of the fleet.
     */
    DeviceFleetArn: DeviceFleetArn;
    /**
     * The output configuration for storing sampled data.
     */
    OutputConfig: EdgeOutputConfig;
    /**
     * A description of the fleet.
     */
    Description?: DeviceFleetDescription;
    /**
     * Timestamp of when the device fleet was created.
     */
    CreationTime: Timestamp;
    /**
     * Timestamp of when the device fleet was last updated.
     */
    LastModifiedTime: Timestamp;
    /**
     * The Amazon Resource Name (ARN) that has access to Amazon Web Services Internet of Things (IoT).
     */
    RoleArn?: RoleArn;
    /**
     * The Amazon Resource Name (ARN) alias created in Amazon Web Services Internet of Things (IoT).
     */
    IotRoleAlias?: IotRoleAlias;
  }
  export interface DescribeDeviceRequest {
    /**
     * Next token of device description.
     */
    NextToken?: NextToken;
    /**
     * The unique ID of the device.
     */
    DeviceName: EntityName;
    /**
     * The name of the fleet the devices belong to.
     */
    DeviceFleetName: EntityName;
  }
  export interface DescribeDeviceResponse {
    /**
     * The Amazon Resource Name (ARN) of the device.
     */
    DeviceArn?: DeviceArn;
    /**
     * The unique identifier of the device.
     */
    DeviceName: EntityName;
    /**
     * A description of the device.
     */
    Description?: DeviceDescription;
    /**
     * The name of the fleet the device belongs to.
     */
    DeviceFleetName: EntityName;
    /**
     * The Amazon Web Services Internet of Things (IoT) object thing name associated with the device.
     */
    IotThingName?: ThingName;
    /**
     * The timestamp of the last registration or de-reregistration.
     */
    RegistrationTime: Timestamp;
    /**
     * The last heartbeat received from the device.
     */
    LatestHeartbeat?: Timestamp;
    /**
     * Models on the device.
     */
    Models?: EdgeModels;
    /**
     * The maximum number of models.
     */
    MaxModels?: Integer;
    /**
     * The response from the last list when returning a list large enough to need tokening.
     */
    NextToken?: NextToken;
    /**
     * Edge Manager agent version.
     */
    AgentVersion?: EdgeVersion;
  }
  export interface DescribeDomainRequest {
    /**
     * The domain ID.
     */
    DomainId: DomainId;
  }
  export interface DescribeDomainResponse {
    /**
     * The domain's Amazon Resource Name (ARN).
     */
    DomainArn?: DomainArn;
    /**
     * The domain ID.
     */
    DomainId?: DomainId;
    /**
     * The domain name.
     */
    DomainName?: DomainName;
    /**
     * The ID of the Amazon Elastic File System (EFS) managed by this Domain.
     */
    HomeEfsFileSystemId?: ResourceId;
    /**
     * The SSO managed application instance ID.
     */
    SingleSignOnManagedApplicationInstanceId?: String256;
    /**
     * The status.
     */
    Status?: DomainStatus;
    /**
     * The creation time.
     */
    CreationTime?: CreationTime;
    /**
     * The last modified time.
     */
    LastModifiedTime?: LastModifiedTime;
    /**
     * The failure reason.
     */
    FailureReason?: FailureReason;
    /**
     * The domain's authentication mode.
     */
    AuthMode?: AuthMode;
    /**
     * Settings which are applied to UserProfiles in this domain if settings are not explicitly specified in a given UserProfile. 
     */
    DefaultUserSettings?: UserSettings;
    /**
     * Specifies the VPC used for non-EFS traffic. The default value is PublicInternetOnly.    PublicInternetOnly - Non-EFS traffic is through a VPC managed by Amazon SageMaker, which allows direct internet access    VpcOnly - All Studio traffic is through the specified VPC and subnets  
     */
    AppNetworkAccessType?: AppNetworkAccessType;
    /**
     * This member is deprecated and replaced with KmsKeyId.
     */
    HomeEfsFileSystemKmsKeyId?: KmsKeyId;
    /**
     * The VPC subnets that Studio uses for communication.
     */
    SubnetIds?: Subnets;
    /**
     * The domain's URL.
     */
    Url?: String1024;
    /**
     * The ID of the Amazon Virtual Private Cloud (VPC) that Studio uses for communication.
     */
    VpcId?: VpcId;
    /**
     * The Amazon Web Services KMS customer managed key used to encrypt the EFS volume attached to the domain.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * A collection of Domain settings.
     */
    DomainSettings?: DomainSettings;
    /**
     * The entity that creates and manages the required security groups for inter-app communication in VPCOnly mode. Required when CreateDomain.AppNetworkAccessType is VPCOnly and DomainSettings.RStudioServerProDomainSettings.DomainExecutionRoleArn is provided.
     */
    AppSecurityGroupManagement?: AppSecurityGroupManagement;
    /**
     * The ID of the security group that authorizes traffic between the RSessionGateway apps and the RStudioServerPro app.
     */
    SecurityGroupIdForDomainBoundary?: SecurityGroupId;
  }
  export interface DescribeEdgePackagingJobRequest {
    /**
     * The name of the edge packaging job.
     */
    EdgePackagingJobName: EntityName;
  }
  export interface DescribeEdgePackagingJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the edge packaging job.
     */
    EdgePackagingJobArn: EdgePackagingJobArn;
    /**
     * The name of the edge packaging job.
     */
    EdgePackagingJobName: EntityName;
    /**
     * The name of the SageMaker Neo compilation job that is used to locate model artifacts that are being packaged.
     */
    CompilationJobName?: EntityName;
    /**
     * The name of the model.
     */
    ModelName?: EntityName;
    /**
     * The version of the model.
     */
    ModelVersion?: EdgeVersion;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that enables Amazon SageMaker to download and upload the model, and to contact Neo.
     */
    RoleArn?: RoleArn;
    /**
     * The output configuration for the edge packaging job.
     */
    OutputConfig?: EdgeOutputConfig;
    /**
     * The Amazon Web Services KMS key to use when encrypting the EBS volume the job run on.
     */
    ResourceKey?: KmsKeyId;
    /**
     * The current status of the packaging job.
     */
    EdgePackagingJobStatus: EdgePackagingJobStatus;
    /**
     * Returns a message describing the job status and error messages.
     */
    EdgePackagingJobStatusMessage?: String;
    /**
     * The timestamp of when the packaging job was created.
     */
    CreationTime?: Timestamp;
    /**
     * The timestamp of when the job was last updated.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The Amazon Simple Storage (S3) URI where model artifacts ares stored.
     */
    ModelArtifact?: S3Uri;
    /**
     * The signature document of files in the model artifact.
     */
    ModelSignature?: String;
    /**
     * The output of a SageMaker Edge Manager deployable resource.
     */
    PresetDeploymentOutput?: EdgePresetDeploymentOutput;
  }
  export interface DescribeEndpointConfigInput {
    /**
     * The name of the endpoint configuration.
     */
    EndpointConfigName: EndpointConfigName;
  }
  export interface DescribeEndpointConfigOutput {
    /**
     * Name of the Amazon SageMaker endpoint configuration.
     */
    EndpointConfigName: EndpointConfigName;
    /**
     * The Amazon Resource Name (ARN) of the endpoint configuration.
     */
    EndpointConfigArn: EndpointConfigArn;
    /**
     * An array of ProductionVariant objects, one for each model that you want to host at this endpoint.
     */
    ProductionVariants: ProductionVariantList;
    DataCaptureConfig?: DataCaptureConfig;
    /**
     * Amazon Web Services KMS key ID Amazon SageMaker uses to encrypt data when storing it on the ML storage volume attached to the instance.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * A timestamp that shows when the endpoint configuration was created.
     */
    CreationTime: Timestamp;
    /**
     * Returns the description of an endpoint configuration created using the  CreateEndpointConfig  API.
     */
    AsyncInferenceConfig?: AsyncInferenceConfig;
  }
  export interface DescribeEndpointInput {
    /**
     * The name of the endpoint.
     */
    EndpointName: EndpointName;
  }
  export interface DescribeEndpointOutput {
    /**
     * Name of the endpoint.
     */
    EndpointName: EndpointName;
    /**
     * The Amazon Resource Name (ARN) of the endpoint.
     */
    EndpointArn: EndpointArn;
    /**
     * The name of the endpoint configuration associated with this endpoint.
     */
    EndpointConfigName: EndpointConfigName;
    /**
     *  An array of ProductionVariantSummary objects, one for each model hosted behind this endpoint. 
     */
    ProductionVariants?: ProductionVariantSummaryList;
    DataCaptureConfig?: DataCaptureConfigSummary;
    /**
     * The status of the endpoint.    OutOfService: Endpoint is not available to take incoming requests.    Creating: CreateEndpoint is executing.    Updating: UpdateEndpoint or UpdateEndpointWeightsAndCapacities is executing.    SystemUpdating: Endpoint is undergoing maintenance and cannot be updated or deleted or re-scaled until it has completed. This maintenance operation does not change any customer-specified values such as VPC config, KMS encryption, model, instance type, or instance count.    RollingBack: Endpoint fails to scale up or down or change its variant weight and is in the process of rolling back to its previous configuration. Once the rollback completes, endpoint returns to an InService status. This transitional status only applies to an endpoint that has autoscaling enabled and is undergoing variant weight or capacity changes as part of an UpdateEndpointWeightsAndCapacities call or when the UpdateEndpointWeightsAndCapacities operation is called explicitly.    InService: Endpoint is available to process incoming requests.    Deleting: DeleteEndpoint is executing.    Failed: Endpoint could not be created, updated, or re-scaled. Use DescribeEndpointOutput$FailureReason for information about the failure. DeleteEndpoint is the only operation that can be performed on a failed endpoint.  
     */
    EndpointStatus: EndpointStatus;
    /**
     * If the status of the endpoint is Failed, the reason why it failed. 
     */
    FailureReason?: FailureReason;
    /**
     * A timestamp that shows when the endpoint was created.
     */
    CreationTime: Timestamp;
    /**
     * A timestamp that shows when the endpoint was last modified.
     */
    LastModifiedTime: Timestamp;
    /**
     * The most recent deployment configuration for the endpoint.
     */
    LastDeploymentConfig?: DeploymentConfig;
    /**
     * Returns the description of an endpoint configuration created using the  CreateEndpointConfig  API.
     */
    AsyncInferenceConfig?: AsyncInferenceConfig;
    /**
     * Returns the summary of an in-progress deployment. This field is only returned when the endpoint is creating or updating with a new endpoint configuration.
     */
    PendingDeploymentSummary?: PendingDeploymentSummary;
  }
  export interface DescribeExperimentRequest {
    /**
     * The name of the experiment to describe.
     */
    ExperimentName: ExperimentEntityName;
  }
  export interface DescribeExperimentResponse {
    /**
     * The name of the experiment.
     */
    ExperimentName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the experiment.
     */
    ExperimentArn?: ExperimentArn;
    /**
     * The name of the experiment as displayed. If DisplayName isn't specified, ExperimentName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    /**
     * The ARN of the source and, optionally, the type.
     */
    Source?: ExperimentSource;
    /**
     * The description of the experiment.
     */
    Description?: ExperimentDescription;
    /**
     * When the experiment was created.
     */
    CreationTime?: Timestamp;
    /**
     * Who created the experiment.
     */
    CreatedBy?: UserContext;
    /**
     * When the experiment was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * Who last modified the experiment.
     */
    LastModifiedBy?: UserContext;
  }
  export interface DescribeFeatureGroupRequest {
    /**
     * The name of the FeatureGroup you want described. 
     */
    FeatureGroupName: FeatureGroupName;
    /**
     * A token to resume pagination of the list of Features (FeatureDefinitions). 2,500 Features are returned by default.
     */
    NextToken?: NextToken;
  }
  export interface DescribeFeatureGroupResponse {
    /**
     * The Amazon Resource Name (ARN) of the FeatureGroup. 
     */
    FeatureGroupArn: FeatureGroupArn;
    /**
     * he name of the FeatureGroup.
     */
    FeatureGroupName: FeatureGroupName;
    /**
     * The name of the Feature used for RecordIdentifier, whose value uniquely identifies a record stored in the feature store.
     */
    RecordIdentifierFeatureName: FeatureName;
    /**
     * The name of the feature that stores the EventTime of a Record in a FeatureGroup.  An EventTime is a point in time when a new event occurs that corresponds to the creation or update of a Record in a FeatureGroup. All Records in the FeatureGroup have a corresponding EventTime.
     */
    EventTimeFeatureName: FeatureName;
    /**
     * A list of the Features in the FeatureGroup. Each feature is defined by a FeatureName and FeatureType.
     */
    FeatureDefinitions: FeatureDefinitions;
    /**
     * A timestamp indicating when SageMaker created the FeatureGroup.
     */
    CreationTime: CreationTime;
    /**
     * The configuration for the OnlineStore.
     */
    OnlineStoreConfig?: OnlineStoreConfig;
    /**
     * The configuration of the OfflineStore, inducing the S3 location of the OfflineStore, Amazon Web Services Glue or Amazon Web Services Hive data catalogue configurations, and the security configuration.
     */
    OfflineStoreConfig?: OfflineStoreConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM execution role used to persist data into the OfflineStore if an OfflineStoreConfig is provided.
     */
    RoleArn?: RoleArn;
    /**
     * The status of the feature group.
     */
    FeatureGroupStatus?: FeatureGroupStatus;
    /**
     * The status of the OfflineStore. Notifies you if replicating data into the OfflineStore has failed. Returns either: Active or Blocked 
     */
    OfflineStoreStatus?: OfflineStoreStatus;
    /**
     * The reason that the FeatureGroup failed to be replicated in the OfflineStore. This is failure can occur because:   The FeatureGroup could not be created in the OfflineStore.   The FeatureGroup could not be deleted from the OfflineStore.  
     */
    FailureReason?: FailureReason;
    /**
     * A free form description of the feature group.
     */
    Description?: Description;
    /**
     * A token to resume pagination of the list of Features (FeatureDefinitions).
     */
    NextToken: NextToken;
  }
  export interface DescribeFlowDefinitionRequest {
    /**
     * The name of the flow definition.
     */
    FlowDefinitionName: FlowDefinitionName;
  }
  export interface DescribeFlowDefinitionResponse {
    /**
     * The Amazon Resource Name (ARN) of the flow defintion.
     */
    FlowDefinitionArn: FlowDefinitionArn;
    /**
     * The Amazon Resource Name (ARN) of the flow definition.
     */
    FlowDefinitionName: FlowDefinitionName;
    /**
     * The status of the flow definition. Valid values are listed below.
     */
    FlowDefinitionStatus: FlowDefinitionStatus;
    /**
     * The timestamp when the flow definition was created.
     */
    CreationTime: Timestamp;
    /**
     * Container for configuring the source of human task requests. Used to specify if Amazon Rekognition or Amazon Textract is used as an integration source.
     */
    HumanLoopRequestSource?: HumanLoopRequestSource;
    /**
     * An object containing information about what triggers a human review workflow.
     */
    HumanLoopActivationConfig?: HumanLoopActivationConfig;
    /**
     * An object containing information about who works on the task, the workforce task price, and other task details.
     */
    HumanLoopConfig: HumanLoopConfig;
    /**
     * An object containing information about the output file.
     */
    OutputConfig: FlowDefinitionOutputConfig;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Identity and Access Management (IAM) execution role for the flow definition.
     */
    RoleArn: RoleArn;
    /**
     * The reason your flow definition failed.
     */
    FailureReason?: FailureReason;
  }
  export interface DescribeHumanTaskUiRequest {
    /**
     * The name of the human task user interface (worker task template) you want information about.
     */
    HumanTaskUiName: HumanTaskUiName;
  }
  export interface DescribeHumanTaskUiResponse {
    /**
     * The Amazon Resource Name (ARN) of the human task user interface (worker task template).
     */
    HumanTaskUiArn: HumanTaskUiArn;
    /**
     * The name of the human task user interface (worker task template).
     */
    HumanTaskUiName: HumanTaskUiName;
    /**
     * The status of the human task user interface (worker task template). Valid values are listed below.
     */
    HumanTaskUiStatus?: HumanTaskUiStatus;
    /**
     * The timestamp when the human task user interface was created.
     */
    CreationTime: Timestamp;
    UiTemplate: UiTemplateInfo;
  }
  export interface DescribeHyperParameterTuningJobRequest {
    /**
     * The name of the tuning job.
     */
    HyperParameterTuningJobName: HyperParameterTuningJobName;
  }
  export interface DescribeHyperParameterTuningJobResponse {
    /**
     * The name of the tuning job.
     */
    HyperParameterTuningJobName: HyperParameterTuningJobName;
    /**
     * The Amazon Resource Name (ARN) of the tuning job.
     */
    HyperParameterTuningJobArn: HyperParameterTuningJobArn;
    /**
     * The HyperParameterTuningJobConfig object that specifies the configuration of the tuning job.
     */
    HyperParameterTuningJobConfig: HyperParameterTuningJobConfig;
    /**
     * The HyperParameterTrainingJobDefinition object that specifies the definition of the training jobs that this tuning job launches.
     */
    TrainingJobDefinition?: HyperParameterTrainingJobDefinition;
    /**
     * A list of the HyperParameterTrainingJobDefinition objects launched for this tuning job.
     */
    TrainingJobDefinitions?: HyperParameterTrainingJobDefinitions;
    /**
     * The status of the tuning job: InProgress, Completed, Failed, Stopping, or Stopped.
     */
    HyperParameterTuningJobStatus: HyperParameterTuningJobStatus;
    /**
     * The date and time that the tuning job started.
     */
    CreationTime: Timestamp;
    /**
     * The date and time that the tuning job ended.
     */
    HyperParameterTuningEndTime?: Timestamp;
    /**
     * The date and time that the status of the tuning job was modified. 
     */
    LastModifiedTime?: Timestamp;
    /**
     * The TrainingJobStatusCounters object that specifies the number of training jobs, categorized by status, that this tuning job launched.
     */
    TrainingJobStatusCounters: TrainingJobStatusCounters;
    /**
     * The ObjectiveStatusCounters object that specifies the number of training jobs, categorized by the status of their final objective metric, that this tuning job launched.
     */
    ObjectiveStatusCounters: ObjectiveStatusCounters;
    /**
     * A TrainingJobSummary object that describes the training job that completed with the best current HyperParameterTuningJobObjective.
     */
    BestTrainingJob?: HyperParameterTrainingJobSummary;
    /**
     * If the hyperparameter tuning job is an warm start tuning job with a WarmStartType of IDENTICAL_DATA_AND_ALGORITHM, this is the TrainingJobSummary for the training job with the best objective metric value of all training jobs launched by this tuning job and all parent jobs specified for the warm start tuning job.
     */
    OverallBestTrainingJob?: HyperParameterTrainingJobSummary;
    /**
     * The configuration for starting the hyperparameter parameter tuning job using one or more previous tuning jobs as a starting point. The results of previous tuning jobs are used to inform which combinations of hyperparameters to search over in the new tuning job.
     */
    WarmStartConfig?: HyperParameterTuningJobWarmStartConfig;
    /**
     * If the tuning job failed, the reason it failed.
     */
    FailureReason?: FailureReason;
  }
  export interface DescribeImageRequest {
    /**
     * The name of the image to describe.
     */
    ImageName: ImageName;
  }
  export interface DescribeImageResponse {
    /**
     * When the image was created.
     */
    CreationTime?: Timestamp;
    /**
     * The description of the image.
     */
    Description?: ImageDescription;
    /**
     * The name of the image as displayed.
     */
    DisplayName?: ImageDisplayName;
    /**
     * When a create, update, or delete operation fails, the reason for the failure.
     */
    FailureReason?: FailureReason;
    /**
     * The Amazon Resource Name (ARN) of the image.
     */
    ImageArn?: ImageArn;
    /**
     * The name of the image.
     */
    ImageName?: ImageName;
    /**
     * The status of the image.
     */
    ImageStatus?: ImageStatus;
    /**
     * When the image was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that enables Amazon SageMaker to perform tasks on your behalf.
     */
    RoleArn?: RoleArn;
  }
  export interface DescribeImageVersionRequest {
    /**
     * The name of the image.
     */
    ImageName: ImageName;
    /**
     * The version of the image. If not specified, the latest version is described.
     */
    Version?: ImageVersionNumber;
  }
  export interface DescribeImageVersionResponse {
    /**
     * The registry path of the container image on which this image version is based.
     */
    BaseImage?: ImageBaseImage;
    /**
     * The registry path of the container image that contains this image version.
     */
    ContainerImage?: ImageContainerImage;
    /**
     * When the version was created.
     */
    CreationTime?: Timestamp;
    /**
     * When a create or delete operation fails, the reason for the failure.
     */
    FailureReason?: FailureReason;
    /**
     * The Amazon Resource Name (ARN) of the image the version is based on.
     */
    ImageArn?: ImageArn;
    /**
     * The ARN of the version.
     */
    ImageVersionArn?: ImageVersionArn;
    /**
     * The status of the version.
     */
    ImageVersionStatus?: ImageVersionStatus;
    /**
     * When the version was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The version number.
     */
    Version?: ImageVersionNumber;
  }
  export interface DescribeLabelingJobRequest {
    /**
     * The name of the labeling job to return information for.
     */
    LabelingJobName: LabelingJobName;
  }
  export interface DescribeLabelingJobResponse {
    /**
     * The processing status of the labeling job. 
     */
    LabelingJobStatus: LabelingJobStatus;
    /**
     * Provides a breakdown of the number of data objects labeled by humans, the number of objects labeled by machine, the number of objects than couldn't be labeled, and the total number of objects labeled. 
     */
    LabelCounters: LabelCounters;
    /**
     * If the job failed, the reason that it failed. 
     */
    FailureReason?: FailureReason;
    /**
     * The date and time that the labeling job was created.
     */
    CreationTime: Timestamp;
    /**
     * The date and time that the labeling job was last updated.
     */
    LastModifiedTime: Timestamp;
    /**
     * A unique identifier for work done as part of a labeling job.
     */
    JobReferenceCode: JobReferenceCode;
    /**
     * The name assigned to the labeling job when it was created.
     */
    LabelingJobName: LabelingJobName;
    /**
     * The Amazon Resource Name (ARN) of the labeling job.
     */
    LabelingJobArn: LabelingJobArn;
    /**
     * The attribute used as the label in the output manifest file.
     */
    LabelAttributeName?: LabelAttributeName;
    /**
     * Input configuration information for the labeling job, such as the Amazon S3 location of the data objects and the location of the manifest file that describes the data objects.
     */
    InputConfig: LabelingJobInputConfig;
    /**
     * The location of the job's output data and the Amazon Web Services Key Management Service key ID for the key used to encrypt the output data, if any.
     */
    OutputConfig: LabelingJobOutputConfig;
    /**
     * The Amazon Resource Name (ARN) that Amazon SageMaker assumes to perform tasks on your behalf during data labeling.
     */
    RoleArn: RoleArn;
    /**
     * The S3 location of the JSON file that defines the categories used to label data objects. Please note the following label-category limits:   Semantic segmentation labeling jobs using automated labeling: 20 labels   Box bounding labeling jobs (all): 10 labels   The file is a JSON structure in the following format:  {    "document-version": "2018-11-28"    "labels": [    {    "label": "label 1"    },    {    "label": "label 2"    },    ...    {    "label": "label n"    }    ]   } 
     */
    LabelCategoryConfigS3Uri?: S3Uri;
    /**
     * A set of conditions for stopping a labeling job. If any of the conditions are met, the job is automatically stopped.
     */
    StoppingConditions?: LabelingJobStoppingConditions;
    /**
     * Configuration information for automated data labeling.
     */
    LabelingJobAlgorithmsConfig?: LabelingJobAlgorithmsConfig;
    /**
     * Configuration information required for human workers to complete a labeling task.
     */
    HumanTaskConfig: HumanTaskConfig;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
    /**
     * The location of the output produced by the labeling job.
     */
    LabelingJobOutput?: LabelingJobOutput;
  }
  export interface DescribeModelBiasJobDefinitionRequest {
    /**
     * The name of the model bias job definition. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
  }
  export interface DescribeModelBiasJobDefinitionResponse {
    /**
     * The Amazon Resource Name (ARN) of the model bias job.
     */
    JobDefinitionArn: MonitoringJobDefinitionArn;
    /**
     * The name of the bias job definition. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
    /**
     * The time at which the model bias job was created.
     */
    CreationTime: Timestamp;
    /**
     * The baseline configuration for a model bias job.
     */
    ModelBiasBaselineConfig?: ModelBiasBaselineConfig;
    /**
     * Configures the model bias job to run a specified Docker container image.
     */
    ModelBiasAppSpecification: ModelBiasAppSpecification;
    /**
     * Inputs for the model bias job.
     */
    ModelBiasJobInput: ModelBiasJobInput;
    ModelBiasJobOutputConfig: MonitoringOutputConfig;
    JobResources: MonitoringResources;
    /**
     * Networking options for a model bias job.
     */
    NetworkConfig?: MonitoringNetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Identity and Access Management (IAM) role that has read permission to the input data location and write permission to the output data location in Amazon S3.
     */
    RoleArn: RoleArn;
    StoppingCondition?: MonitoringStoppingCondition;
  }
  export interface DescribeModelExplainabilityJobDefinitionRequest {
    /**
     * The name of the model explainability job definition. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
  }
  export interface DescribeModelExplainabilityJobDefinitionResponse {
    /**
     * The Amazon Resource Name (ARN) of the model explainability job.
     */
    JobDefinitionArn: MonitoringJobDefinitionArn;
    /**
     * The name of the explainability job definition. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
    /**
     * The time at which the model explainability job was created.
     */
    CreationTime: Timestamp;
    /**
     * The baseline configuration for a model explainability job.
     */
    ModelExplainabilityBaselineConfig?: ModelExplainabilityBaselineConfig;
    /**
     * Configures the model explainability job to run a specified Docker container image.
     */
    ModelExplainabilityAppSpecification: ModelExplainabilityAppSpecification;
    /**
     * Inputs for the model explainability job.
     */
    ModelExplainabilityJobInput: ModelExplainabilityJobInput;
    ModelExplainabilityJobOutputConfig: MonitoringOutputConfig;
    JobResources: MonitoringResources;
    /**
     * Networking options for a model explainability job.
     */
    NetworkConfig?: MonitoringNetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Identity and Access Management (IAM) role that has read permission to the input data location and write permission to the output data location in Amazon S3.
     */
    RoleArn: RoleArn;
    StoppingCondition?: MonitoringStoppingCondition;
  }
  export interface DescribeModelInput {
    /**
     * The name of the model.
     */
    ModelName: ModelName;
  }
  export interface DescribeModelOutput {
    /**
     * Name of the Amazon SageMaker model.
     */
    ModelName: ModelName;
    /**
     * The location of the primary inference code, associated artifacts, and custom environment map that the inference code uses when it is deployed in production. 
     */
    PrimaryContainer?: ContainerDefinition;
    /**
     * The containers in the inference pipeline.
     */
    Containers?: ContainerDefinitionList;
    /**
     * Specifies details of how containers in a multi-container endpoint are called.
     */
    InferenceExecutionConfig?: InferenceExecutionConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that you specified for the model.
     */
    ExecutionRoleArn: RoleArn;
    /**
     * A VpcConfig object that specifies the VPC that this model has access to. For more information, see Protect Endpoints by Using an Amazon Virtual Private Cloud 
     */
    VpcConfig?: VpcConfig;
    /**
     * A timestamp that shows when the model was created.
     */
    CreationTime: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the model.
     */
    ModelArn: ModelArn;
    /**
     * If True, no inbound or outbound network calls can be made to or from the model container.
     */
    EnableNetworkIsolation?: Boolean;
  }
  export interface DescribeModelPackageGroupInput {
    /**
     * The name of the model group to describe.
     */
    ModelPackageGroupName: ArnOrName;
  }
  export interface DescribeModelPackageGroupOutput {
    /**
     * The name of the model group.
     */
    ModelPackageGroupName: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the model group.
     */
    ModelPackageGroupArn: ModelPackageGroupArn;
    /**
     * A description of the model group.
     */
    ModelPackageGroupDescription?: EntityDescription;
    /**
     * The time that the model group was created.
     */
    CreationTime: CreationTime;
    CreatedBy: UserContext;
    /**
     * The status of the model group.
     */
    ModelPackageGroupStatus: ModelPackageGroupStatus;
  }
  export interface DescribeModelPackageInput {
    /**
     * The name or Amazon Resource Name (ARN) of the model package to describe. When you specify a name, the name must have 1 to 63 characters. Valid characters are a-z, A-Z, 0-9, and - (hyphen).
     */
    ModelPackageName: VersionedArnOrName;
  }
  export interface DescribeModelPackageOutput {
    /**
     * The name of the model package being described.
     */
    ModelPackageName: EntityName;
    /**
     * If the model is a versioned model, the name of the model group that the versioned model belongs to.
     */
    ModelPackageGroupName?: EntityName;
    /**
     * The version of the model package.
     */
    ModelPackageVersion?: ModelPackageVersion;
    /**
     * The Amazon Resource Name (ARN) of the model package.
     */
    ModelPackageArn: ModelPackageArn;
    /**
     * A brief summary of the model package.
     */
    ModelPackageDescription?: EntityDescription;
    /**
     * A timestamp specifying when the model package was created.
     */
    CreationTime: CreationTime;
    /**
     * Details about inference jobs that can be run with models based on this model package.
     */
    InferenceSpecification?: InferenceSpecification;
    /**
     * Details about the algorithm that was used to create the model package.
     */
    SourceAlgorithmSpecification?: SourceAlgorithmSpecification;
    /**
     * Configurations for one or more transform jobs that SageMaker runs to test the model package.
     */
    ValidationSpecification?: ModelPackageValidationSpecification;
    /**
     * The current status of the model package.
     */
    ModelPackageStatus: ModelPackageStatus;
    /**
     * Details about the current status of the model package.
     */
    ModelPackageStatusDetails: ModelPackageStatusDetails;
    /**
     * Whether the model package is certified for listing on Amazon Web Services Marketplace.
     */
    CertifyForMarketplace?: CertifyForMarketplace;
    /**
     * The approval status of the model package.
     */
    ModelApprovalStatus?: ModelApprovalStatus;
    CreatedBy?: UserContext;
    MetadataProperties?: MetadataProperties;
    /**
     * Metrics for the model.
     */
    ModelMetrics?: ModelMetrics;
    /**
     * The last time the model package was modified.
     */
    LastModifiedTime?: Timestamp;
    LastModifiedBy?: UserContext;
    /**
     * A description provided for the model approval.
     */
    ApprovalDescription?: ApprovalDescription;
    /**
     * The metadata properties associated with the model package versions.
     */
    CustomerMetadataProperties?: CustomerMetadataMap;
  }
  export interface DescribeModelQualityJobDefinitionRequest {
    /**
     * The name of the model quality job. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
  }
  export interface DescribeModelQualityJobDefinitionResponse {
    /**
     * The Amazon Resource Name (ARN) of the model quality job.
     */
    JobDefinitionArn: MonitoringJobDefinitionArn;
    /**
     * The name of the quality job definition. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    JobDefinitionName: MonitoringJobDefinitionName;
    /**
     * The time at which the model quality job was created.
     */
    CreationTime: Timestamp;
    /**
     * The baseline configuration for a model quality job.
     */
    ModelQualityBaselineConfig?: ModelQualityBaselineConfig;
    /**
     * Configures the model quality job to run a specified Docker container image.
     */
    ModelQualityAppSpecification: ModelQualityAppSpecification;
    /**
     * Inputs for the model quality job.
     */
    ModelQualityJobInput: ModelQualityJobInput;
    ModelQualityJobOutputConfig: MonitoringOutputConfig;
    JobResources: MonitoringResources;
    /**
     * Networking options for a model quality job.
     */
    NetworkConfig?: MonitoringNetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker can assume to perform tasks on your behalf.
     */
    RoleArn: RoleArn;
    StoppingCondition?: MonitoringStoppingCondition;
  }
  export interface DescribeMonitoringScheduleRequest {
    /**
     * Name of a previously created monitoring schedule.
     */
    MonitoringScheduleName: MonitoringScheduleName;
  }
  export interface DescribeMonitoringScheduleResponse {
    /**
     * The Amazon Resource Name (ARN) of the monitoring schedule.
     */
    MonitoringScheduleArn: MonitoringScheduleArn;
    /**
     * Name of the monitoring schedule.
     */
    MonitoringScheduleName: MonitoringScheduleName;
    /**
     * The status of an monitoring job.
     */
    MonitoringScheduleStatus: ScheduleStatus;
    /**
     * The type of the monitoring job that this schedule runs. This is one of the following values.    DATA_QUALITY - The schedule is for a data quality monitoring job.    MODEL_QUALITY - The schedule is for a model quality monitoring job.    MODEL_BIAS - The schedule is for a bias monitoring job.    MODEL_EXPLAINABILITY - The schedule is for an explainability monitoring job.  
     */
    MonitoringType?: MonitoringType;
    /**
     * A string, up to one KB in size, that contains the reason a monitoring job failed, if it failed.
     */
    FailureReason?: FailureReason;
    /**
     * The time at which the monitoring job was created.
     */
    CreationTime: Timestamp;
    /**
     * The time at which the monitoring job was last modified.
     */
    LastModifiedTime: Timestamp;
    /**
     * The configuration object that specifies the monitoring schedule and defines the monitoring job.
     */
    MonitoringScheduleConfig: MonitoringScheduleConfig;
    /**
     *  The name of the endpoint for the monitoring job.
     */
    EndpointName?: EndpointName;
    /**
     * Describes metadata on the last execution to run, if there was one.
     */
    LastMonitoringExecutionSummary?: MonitoringExecutionSummary;
  }
  export interface DescribeNotebookInstanceInput {
    /**
     * The name of the notebook instance that you want information about.
     */
    NotebookInstanceName: NotebookInstanceName;
  }
  export interface DescribeNotebookInstanceLifecycleConfigInput {
    /**
     * The name of the lifecycle configuration to describe.
     */
    NotebookInstanceLifecycleConfigName: NotebookInstanceLifecycleConfigName;
  }
  export interface DescribeNotebookInstanceLifecycleConfigOutput {
    /**
     * The Amazon Resource Name (ARN) of the lifecycle configuration.
     */
    NotebookInstanceLifecycleConfigArn?: NotebookInstanceLifecycleConfigArn;
    /**
     * The name of the lifecycle configuration.
     */
    NotebookInstanceLifecycleConfigName?: NotebookInstanceLifecycleConfigName;
    /**
     * The shell script that runs only once, when you create a notebook instance.
     */
    OnCreate?: NotebookInstanceLifecycleConfigList;
    /**
     * The shell script that runs every time you start a notebook instance, including when you create the notebook instance.
     */
    OnStart?: NotebookInstanceLifecycleConfigList;
    /**
     * A timestamp that tells when the lifecycle configuration was last modified.
     */
    LastModifiedTime?: LastModifiedTime;
    /**
     * A timestamp that tells when the lifecycle configuration was created.
     */
    CreationTime?: CreationTime;
  }
  export interface DescribeNotebookInstanceOutput {
    /**
     * The Amazon Resource Name (ARN) of the notebook instance.
     */
    NotebookInstanceArn?: NotebookInstanceArn;
    /**
     * The name of the Amazon SageMaker notebook instance. 
     */
    NotebookInstanceName?: NotebookInstanceName;
    /**
     * The status of the notebook instance.
     */
    NotebookInstanceStatus?: NotebookInstanceStatus;
    /**
     * If status is Failed, the reason it failed.
     */
    FailureReason?: FailureReason;
    /**
     * The URL that you use to connect to the Jupyter notebook that is running in your notebook instance. 
     */
    Url?: NotebookInstanceUrl;
    /**
     * The type of ML compute instance running on the notebook instance.
     */
    InstanceType?: InstanceType;
    /**
     * The ID of the VPC subnet.
     */
    SubnetId?: SubnetId;
    /**
     * The IDs of the VPC security groups.
     */
    SecurityGroups?: SecurityGroupIds;
    /**
     * The Amazon Resource Name (ARN) of the IAM role associated with the instance. 
     */
    RoleArn?: RoleArn;
    /**
     * The Amazon Web Services KMS key ID Amazon SageMaker uses to encrypt data when storing it on the ML storage volume attached to the instance. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The network interface IDs that Amazon SageMaker created at the time of creating the instance. 
     */
    NetworkInterfaceId?: NetworkInterfaceId;
    /**
     * A timestamp. Use this parameter to retrieve the time when the notebook instance was last modified. 
     */
    LastModifiedTime?: LastModifiedTime;
    /**
     * A timestamp. Use this parameter to return the time when the notebook instance was created
     */
    CreationTime?: CreationTime;
    /**
     * Returns the name of a notebook instance lifecycle configuration. For information about notebook instance lifestyle configurations, see Step 2.1: (Optional) Customize a Notebook Instance 
     */
    NotebookInstanceLifecycleConfigName?: NotebookInstanceLifecycleConfigName;
    /**
     * Describes whether Amazon SageMaker provides internet access to the notebook instance. If this value is set to Disabled, the notebook instance does not have internet access, and cannot connect to Amazon SageMaker training and endpoint services. For more information, see Notebook Instances Are Internet-Enabled by Default.
     */
    DirectInternetAccess?: DirectInternetAccess;
    /**
     * The size, in GB, of the ML storage volume attached to the notebook instance.
     */
    VolumeSizeInGB?: NotebookInstanceVolumeSizeInGB;
    /**
     * A list of the Elastic Inference (EI) instance types associated with this notebook instance. Currently only one EI instance type can be associated with a notebook instance. For more information, see Using Elastic Inference in Amazon SageMaker.
     */
    AcceleratorTypes?: NotebookInstanceAcceleratorTypes;
    /**
     * The Git repository associated with the notebook instance as its default code repository. This can be either the name of a Git repository stored as a resource in your account, or the URL of a Git repository in Amazon Web Services CodeCommit or in any other Git repository. When you open a notebook instance, it opens in the directory that contains this repository. For more information, see Associating Git Repositories with Amazon SageMaker Notebook Instances.
     */
    DefaultCodeRepository?: CodeRepositoryNameOrUrl;
    /**
     * An array of up to three Git repositories associated with the notebook instance. These can be either the names of Git repositories stored as resources in your account, or the URL of Git repositories in Amazon Web Services CodeCommit or in any other Git repository. These repositories are cloned at the same level as the default repository of your notebook instance. For more information, see Associating Git Repositories with Amazon SageMaker Notebook Instances.
     */
    AdditionalCodeRepositories?: AdditionalCodeRepositoryNamesOrUrls;
    /**
     * Whether root access is enabled or disabled for users of the notebook instance.  Lifecycle configurations need root access to be able to set up a notebook instance. Because of this, lifecycle configurations associated with a notebook instance always run with root access even if you disable root access for users. 
     */
    RootAccess?: RootAccess;
    /**
     * The platform identifier of the notebook instance runtime environment.
     */
    PlatformIdentifier?: PlatformIdentifier;
  }
  export interface DescribePipelineDefinitionForExecutionRequest {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn: PipelineExecutionArn;
  }
  export interface DescribePipelineDefinitionForExecutionResponse {
    /**
     * The JSON pipeline definition.
     */
    PipelineDefinition?: PipelineDefinition;
    /**
     * The time when the pipeline was created.
     */
    CreationTime?: Timestamp;
  }
  export interface DescribePipelineExecutionRequest {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn: PipelineExecutionArn;
  }
  export interface DescribePipelineExecutionResponse {
    /**
     * The Amazon Resource Name (ARN) of the pipeline.
     */
    PipelineArn?: PipelineArn;
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn?: PipelineExecutionArn;
    /**
     * The display name of the pipeline execution.
     */
    PipelineExecutionDisplayName?: PipelineExecutionName;
    /**
     * The status of the pipeline execution.
     */
    PipelineExecutionStatus?: PipelineExecutionStatus;
    /**
     * The description of the pipeline execution.
     */
    PipelineExecutionDescription?: PipelineExecutionDescription;
    PipelineExperimentConfig?: PipelineExperimentConfig;
    /**
     * If the execution failed, a message describing why.
     */
    FailureReason?: PipelineExecutionFailureReason;
    /**
     * The time when the pipeline execution was created.
     */
    CreationTime?: Timestamp;
    /**
     * The time when the pipeline execution was modified last.
     */
    LastModifiedTime?: Timestamp;
    CreatedBy?: UserContext;
    LastModifiedBy?: UserContext;
  }
  export interface DescribePipelineRequest {
    /**
     * The name of the pipeline to describe.
     */
    PipelineName: PipelineName;
  }
  export interface DescribePipelineResponse {
    /**
     * The Amazon Resource Name (ARN) of the pipeline.
     */
    PipelineArn?: PipelineArn;
    /**
     * The name of the pipeline.
     */
    PipelineName?: PipelineName;
    /**
     * The display name of the pipeline.
     */
    PipelineDisplayName?: PipelineName;
    /**
     * The JSON pipeline definition.
     */
    PipelineDefinition?: PipelineDefinition;
    /**
     * The description of the pipeline.
     */
    PipelineDescription?: PipelineDescription;
    /**
     * The Amazon Resource Name (ARN) that the pipeline uses to execute.
     */
    RoleArn?: RoleArn;
    /**
     * The status of the pipeline execution.
     */
    PipelineStatus?: PipelineStatus;
    /**
     * The time when the pipeline was created.
     */
    CreationTime?: Timestamp;
    /**
     * The time when the pipeline was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The time when the pipeline was last run.
     */
    LastRunTime?: Timestamp;
    CreatedBy?: UserContext;
    LastModifiedBy?: UserContext;
  }
  export interface DescribeProcessingJobRequest {
    /**
     * The name of the processing job. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    ProcessingJobName: ProcessingJobName;
  }
  export interface DescribeProcessingJobResponse {
    /**
     * The inputs for a processing job.
     */
    ProcessingInputs?: ProcessingInputs;
    /**
     * Output configuration for the processing job.
     */
    ProcessingOutputConfig?: ProcessingOutputConfig;
    /**
     * The name of the processing job. The name must be unique within an Amazon Web Services Region in the Amazon Web Services account.
     */
    ProcessingJobName: ProcessingJobName;
    /**
     * Identifies the resources, ML compute instances, and ML storage volumes to deploy for a processing job. In distributed training, you specify more than one instance.
     */
    ProcessingResources: ProcessingResources;
    /**
     * The time limit for how long the processing job is allowed to run.
     */
    StoppingCondition?: ProcessingStoppingCondition;
    /**
     * Configures the processing job to run a specified container image.
     */
    AppSpecification: AppSpecification;
    /**
     * The environment variables set in the Docker container.
     */
    Environment?: ProcessingEnvironmentMap;
    /**
     * Networking options for a processing job.
     */
    NetworkConfig?: NetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker can assume to perform tasks on your behalf.
     */
    RoleArn?: RoleArn;
    /**
     * The configuration information used to create an experiment.
     */
    ExperimentConfig?: ExperimentConfig;
    /**
     * The Amazon Resource Name (ARN) of the processing job.
     */
    ProcessingJobArn: ProcessingJobArn;
    /**
     * Provides the status of a processing job.
     */
    ProcessingJobStatus: ProcessingJobStatus;
    /**
     * An optional string, up to one KB in size, that contains metadata from the processing container when the processing job exits.
     */
    ExitMessage?: ExitMessage;
    /**
     * A string, up to one KB in size, that contains the reason a processing job failed, if it failed.
     */
    FailureReason?: FailureReason;
    /**
     * The time at which the processing job completed.
     */
    ProcessingEndTime?: Timestamp;
    /**
     * The time at which the processing job started.
     */
    ProcessingStartTime?: Timestamp;
    /**
     * The time at which the processing job was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The time at which the processing job was created.
     */
    CreationTime: Timestamp;
    /**
     * The ARN of a monitoring schedule for an endpoint associated with this processing job.
     */
    MonitoringScheduleArn?: MonitoringScheduleArn;
    /**
     * The ARN of an AutoML job associated with this processing job.
     */
    AutoMLJobArn?: AutoMLJobArn;
    /**
     * The ARN of a training job associated with this processing job.
     */
    TrainingJobArn?: TrainingJobArn;
  }
  export interface DescribeProjectInput {
    /**
     * The name of the project to describe.
     */
    ProjectName: ProjectEntityName;
  }
  export interface DescribeProjectOutput {
    /**
     * The Amazon Resource Name (ARN) of the project.
     */
    ProjectArn: ProjectArn;
    /**
     * The name of the project.
     */
    ProjectName: ProjectEntityName;
    /**
     * The ID of the project.
     */
    ProjectId: ProjectId;
    /**
     * The description of the project.
     */
    ProjectDescription?: EntityDescription;
    /**
     * Information used to provision a service catalog product. For information, see What is Amazon Web Services Service Catalog.
     */
    ServiceCatalogProvisioningDetails: ServiceCatalogProvisioningDetails;
    /**
     * Information about a provisioned service catalog product.
     */
    ServiceCatalogProvisionedProductDetails?: ServiceCatalogProvisionedProductDetails;
    /**
     * The status of the project.
     */
    ProjectStatus: ProjectStatus;
    CreatedBy?: UserContext;
    /**
     * The time when the project was created.
     */
    CreationTime: Timestamp;
    /**
     * The timestamp when project was last modified.
     */
    LastModifiedTime?: Timestamp;
    LastModifiedBy?: UserContext;
  }
  export interface DescribeStudioLifecycleConfigRequest {
    /**
     * The name of the Studio Lifecycle Configuration to describe.
     */
    StudioLifecycleConfigName: StudioLifecycleConfigName;
  }
  export interface DescribeStudioLifecycleConfigResponse {
    /**
     * The ARN of the Lifecycle Configuration to describe.
     */
    StudioLifecycleConfigArn?: StudioLifecycleConfigArn;
    /**
     * The name of the Studio Lifecycle Configuration that is described.
     */
    StudioLifecycleConfigName?: StudioLifecycleConfigName;
    /**
     * The creation time of the Studio Lifecycle Configuration.
     */
    CreationTime?: Timestamp;
    /**
     * This value is equivalent to CreationTime because Studio Lifecycle Configurations are immutable.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The content of your Studio Lifecycle Configuration script.
     */
    StudioLifecycleConfigContent?: StudioLifecycleConfigContent;
    /**
     * The App type that the Lifecycle Configuration is attached to.
     */
    StudioLifecycleConfigAppType?: StudioLifecycleConfigAppType;
  }
  export interface DescribeSubscribedWorkteamRequest {
    /**
     * The Amazon Resource Name (ARN) of the subscribed work team to describe.
     */
    WorkteamArn: WorkteamArn;
  }
  export interface DescribeSubscribedWorkteamResponse {
    /**
     * A Workteam instance that contains information about the work team.
     */
    SubscribedWorkteam: SubscribedWorkteam;
  }
  export interface DescribeTrainingJobRequest {
    /**
     * The name of the training job.
     */
    TrainingJobName: TrainingJobName;
  }
  export interface DescribeTrainingJobResponse {
    /**
     *  Name of the model training job. 
     */
    TrainingJobName: TrainingJobName;
    /**
     * The Amazon Resource Name (ARN) of the training job.
     */
    TrainingJobArn: TrainingJobArn;
    /**
     * The Amazon Resource Name (ARN) of the associated hyperparameter tuning job if the training job was launched by a hyperparameter tuning job.
     */
    TuningJobArn?: HyperParameterTuningJobArn;
    /**
     * The Amazon Resource Name (ARN) of the Amazon SageMaker Ground Truth labeling job that created the transform or training job.
     */
    LabelingJobArn?: LabelingJobArn;
    /**
     * The Amazon Resource Name (ARN) of an AutoML job.
     */
    AutoMLJobArn?: AutoMLJobArn;
    /**
     * Information about the Amazon S3 location that is configured for storing model artifacts. 
     */
    ModelArtifacts: ModelArtifacts;
    /**
     * The status of the training job. Amazon SageMaker provides the following training job statuses:    InProgress - The training is in progress.    Completed - The training job has completed.    Failed - The training job has failed. To see the reason for the failure, see the FailureReason field in the response to a DescribeTrainingJobResponse call.    Stopping - The training job is stopping.    Stopped - The training job has stopped.   For more detailed information, see SecondaryStatus. 
     */
    TrainingJobStatus: TrainingJobStatus;
    /**
     *  Provides detailed information about the state of the training job. For detailed information on the secondary status of the training job, see StatusMessage under SecondaryStatusTransition. Amazon SageMaker provides primary statuses and secondary statuses that apply to each of them:  InProgress     Starting - Starting the training job.    Downloading - An optional stage for algorithms that support File training input mode. It indicates that data is being downloaded to the ML storage volumes.    Training - Training is in progress.    Interrupted - The job stopped because the managed spot training instances were interrupted.     Uploading - Training is complete and the model artifacts are being uploaded to the S3 location.    Completed     Completed - The training job has completed.    Failed     Failed - The training job has failed. The reason for the failure is returned in the FailureReason field of DescribeTrainingJobResponse.    Stopped     MaxRuntimeExceeded - The job stopped because it exceeded the maximum allowed runtime.    MaxWaitTimeExceeded - The job stopped because it exceeded the maximum allowed wait time.    Stopped - The training job has stopped.    Stopping     Stopping - Stopping the training job.      Valid values for SecondaryStatus are subject to change.   We no longer support the following secondary statuses:    LaunchingMLInstances     PreparingTraining     DownloadingTrainingImage   
     */
    SecondaryStatus: SecondaryStatus;
    /**
     * If the training job failed, the reason it failed. 
     */
    FailureReason?: FailureReason;
    /**
     * Algorithm-specific parameters. 
     */
    HyperParameters?: HyperParameters;
    /**
     * Information about the algorithm used for training, and algorithm metadata. 
     */
    AlgorithmSpecification: AlgorithmSpecification;
    /**
     * The Amazon Web Services Identity and Access Management (IAM) role configured for the training job. 
     */
    RoleArn?: RoleArn;
    /**
     * An array of Channel objects that describes each data input channel. 
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The S3 path where model artifacts that you configured when creating the job are stored. Amazon SageMaker creates subfolders for model artifacts. 
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * Resources, including ML compute instances and ML storage volumes, that are configured for model training. 
     */
    ResourceConfig: ResourceConfig;
    /**
     * A VpcConfig object that specifies the VPC that this training job has access to. For more information, see Protect Training Jobs by Using an Amazon Virtual Private Cloud.
     */
    VpcConfig?: VpcConfig;
    /**
     * Specifies a limit to how long a model training job can run. It also specifies how long a managed Spot training job has to complete. When the job reaches the time limit, Amazon SageMaker ends the training job. Use this API to cap model training costs. To stop a job, Amazon SageMaker sends the algorithm the SIGTERM signal, which delays job termination for 120 seconds. Algorithms can use this 120-second window to save the model artifacts, so the results of training are not lost. 
     */
    StoppingCondition: StoppingCondition;
    /**
     * A timestamp that indicates when the training job was created.
     */
    CreationTime: Timestamp;
    /**
     * Indicates the time when the training job starts on training instances. You are billed for the time interval between this time and the value of TrainingEndTime. The start time in CloudWatch Logs might be later than this time. The difference is due to the time it takes to download the training data and to the size of the training container.
     */
    TrainingStartTime?: Timestamp;
    /**
     * Indicates the time when the training job ends on training instances. You are billed for the time interval between the value of TrainingStartTime and this time. For successful jobs and stopped jobs, this is the time after model artifacts are uploaded. For failed jobs, this is the time when Amazon SageMaker detects a job failure.
     */
    TrainingEndTime?: Timestamp;
    /**
     * A timestamp that indicates when the status of the training job was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * A history of all of the secondary statuses that the training job has transitioned through.
     */
    SecondaryStatusTransitions?: SecondaryStatusTransitions;
    /**
     * A collection of MetricData objects that specify the names, values, and dates and times that the training algorithm emitted to Amazon CloudWatch.
     */
    FinalMetricDataList?: FinalMetricDataList;
    /**
     * If you want to allow inbound or outbound network calls, except for calls between peers within a training cluster for distributed training, choose True. If you enable network isolation for training jobs that are configured to use a VPC, Amazon SageMaker downloads and uploads customer data and model artifacts through the specified VPC, but the training container does not have network access.
     */
    EnableNetworkIsolation?: Boolean;
    /**
     * To encrypt all communications between ML compute instances in distributed training, choose True. Encryption provides greater security for distributed training, but training might take longer. How long it takes depends on the amount of communication between compute instances, especially if you use a deep learning algorithms in distributed training.
     */
    EnableInterContainerTrafficEncryption?: Boolean;
    /**
     * A Boolean indicating whether managed spot training is enabled (True) or not (False).
     */
    EnableManagedSpotTraining?: Boolean;
    CheckpointConfig?: CheckpointConfig;
    /**
     * The training time in seconds.
     */
    TrainingTimeInSeconds?: TrainingTimeInSeconds;
    /**
     * The billable time in seconds. Billable time refers to the absolute wall-clock time. Multiply BillableTimeInSeconds by the number of instances (InstanceCount) in your training cluster to get the total compute time SageMaker will bill you if you run distributed training. The formula is as follows: BillableTimeInSeconds * InstanceCount . You can calculate the savings from using managed spot training using the formula (1 - BillableTimeInSeconds / TrainingTimeInSeconds) * 100. For example, if BillableTimeInSeconds is 100 and TrainingTimeInSeconds is 500, the savings is 80%.
     */
    BillableTimeInSeconds?: BillableTimeInSeconds;
    DebugHookConfig?: DebugHookConfig;
    ExperimentConfig?: ExperimentConfig;
    /**
     * Configuration information for Debugger rules for debugging output tensors.
     */
    DebugRuleConfigurations?: DebugRuleConfigurations;
    TensorBoardOutputConfig?: TensorBoardOutputConfig;
    /**
     * Evaluation status of Debugger rules for debugging on a training job.
     */
    DebugRuleEvaluationStatuses?: DebugRuleEvaluationStatuses;
    ProfilerConfig?: ProfilerConfig;
    /**
     * Configuration information for Debugger rules for profiling system and framework metrics.
     */
    ProfilerRuleConfigurations?: ProfilerRuleConfigurations;
    /**
     * Evaluation status of Debugger rules for profiling on a training job.
     */
    ProfilerRuleEvaluationStatuses?: ProfilerRuleEvaluationStatuses;
    /**
     * Profiling status of a training job.
     */
    ProfilingStatus?: ProfilingStatus;
    /**
     * The number of times to retry the job when the job fails due to an InternalServerError.
     */
    RetryStrategy?: RetryStrategy;
    /**
     * The environment variables to set in the Docker container.
     */
    Environment?: TrainingEnvironmentMap;
  }
  export interface DescribeTransformJobRequest {
    /**
     * The name of the transform job that you want to view details of.
     */
    TransformJobName: TransformJobName;
  }
  export interface DescribeTransformJobResponse {
    /**
     * The name of the transform job.
     */
    TransformJobName: TransformJobName;
    /**
     * The Amazon Resource Name (ARN) of the transform job.
     */
    TransformJobArn: TransformJobArn;
    /**
     * The status of the transform job. If the transform job failed, the reason is returned in the FailureReason field.
     */
    TransformJobStatus: TransformJobStatus;
    /**
     * If the transform job failed, FailureReason describes why it failed. A transform job creates a log file, which includes error messages, and stores it as an Amazon S3 object. For more information, see Log Amazon SageMaker Events with Amazon CloudWatch.
     */
    FailureReason?: FailureReason;
    /**
     * The name of the model used in the transform job.
     */
    ModelName: ModelName;
    /**
     * The maximum number of parallel requests on each instance node that can be launched in a transform job. The default value is 1.
     */
    MaxConcurrentTransforms?: MaxConcurrentTransforms;
    /**
     * The timeout and maximum number of retries for processing a transform job invocation.
     */
    ModelClientConfig?: ModelClientConfig;
    /**
     * The maximum payload size, in MB, used in the transform job.
     */
    MaxPayloadInMB?: MaxPayloadInMB;
    /**
     * Specifies the number of records to include in a mini-batch for an HTTP inference request. A record  is a single unit of input data that inference can be made on. For example, a single line in a CSV file is a record.  To enable the batch strategy, you must set SplitType to Line, RecordIO, or TFRecord.
     */
    BatchStrategy?: BatchStrategy;
    /**
     * The environment variables to set in the Docker container. We support up to 16 key and values entries in the map.
     */
    Environment?: TransformEnvironmentMap;
    /**
     * Describes the dataset to be transformed and the Amazon S3 location where it is stored.
     */
    TransformInput: TransformInput;
    /**
     * Identifies the Amazon S3 location where you want Amazon SageMaker to save the results from the transform job.
     */
    TransformOutput?: TransformOutput;
    /**
     * Describes the resources, including ML instance types and ML instance count, to use for the transform job.
     */
    TransformResources: TransformResources;
    /**
     * A timestamp that shows when the transform Job was created.
     */
    CreationTime: Timestamp;
    /**
     * Indicates when the transform job starts on ML instances. You are billed for the time interval between this time and the value of TransformEndTime.
     */
    TransformStartTime?: Timestamp;
    /**
     * Indicates when the transform job has been completed, or has stopped or failed. You are billed for the time interval between this time and the value of TransformStartTime.
     */
    TransformEndTime?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the Amazon SageMaker Ground Truth labeling job that created the transform or training job.
     */
    LabelingJobArn?: LabelingJobArn;
    /**
     * The Amazon Resource Name (ARN) of the AutoML transform job.
     */
    AutoMLJobArn?: AutoMLJobArn;
    DataProcessing?: DataProcessing;
    ExperimentConfig?: ExperimentConfig;
  }
  export interface DescribeTrialComponentRequest {
    /**
     * The name of the trial component to describe.
     */
    TrialComponentName: ExperimentEntityName;
  }
  export interface DescribeTrialComponentResponse {
    /**
     * The name of the trial component.
     */
    TrialComponentName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the trial component.
     */
    TrialComponentArn?: TrialComponentArn;
    /**
     * The name of the component as displayed. If DisplayName isn't specified, TrialComponentName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the source and, optionally, the job type.
     */
    Source?: TrialComponentSource;
    /**
     * The status of the component. States include:   InProgress   Completed   Failed  
     */
    Status?: TrialComponentStatus;
    /**
     * When the component started.
     */
    StartTime?: Timestamp;
    /**
     * When the component ended.
     */
    EndTime?: Timestamp;
    /**
     * When the component was created.
     */
    CreationTime?: Timestamp;
    /**
     * Who created the trial component.
     */
    CreatedBy?: UserContext;
    /**
     * When the component was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * Who last modified the component.
     */
    LastModifiedBy?: UserContext;
    /**
     * The hyperparameters of the component.
     */
    Parameters?: TrialComponentParameters;
    /**
     * The input artifacts of the component.
     */
    InputArtifacts?: TrialComponentArtifacts;
    /**
     * The output artifacts of the component.
     */
    OutputArtifacts?: TrialComponentArtifacts;
    MetadataProperties?: MetadataProperties;
    /**
     * The metrics for the component.
     */
    Metrics?: TrialComponentMetricSummaries;
  }
  export interface DescribeTrialRequest {
    /**
     * The name of the trial to describe.
     */
    TrialName: ExperimentEntityName;
  }
  export interface DescribeTrialResponse {
    /**
     * The name of the trial.
     */
    TrialName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the trial.
     */
    TrialArn?: TrialArn;
    /**
     * The name of the trial as displayed. If DisplayName isn't specified, TrialName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    /**
     * The name of the experiment the trial is part of.
     */
    ExperimentName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the source and, optionally, the job type.
     */
    Source?: TrialSource;
    /**
     * When the trial was created.
     */
    CreationTime?: Timestamp;
    /**
     * Who created the trial.
     */
    CreatedBy?: UserContext;
    /**
     * When the trial was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * Who last modified the trial.
     */
    LastModifiedBy?: UserContext;
    MetadataProperties?: MetadataProperties;
  }
  export interface DescribeUserProfileRequest {
    /**
     * The domain ID.
     */
    DomainId: DomainId;
    /**
     * The user profile name. This value is not case sensitive.
     */
    UserProfileName: UserProfileName;
  }
  export interface DescribeUserProfileResponse {
    /**
     * The ID of the domain that contains the profile.
     */
    DomainId?: DomainId;
    /**
     * The user profile Amazon Resource Name (ARN).
     */
    UserProfileArn?: UserProfileArn;
    /**
     * The user profile name.
     */
    UserProfileName?: UserProfileName;
    /**
     * The ID of the user's profile in the Amazon Elastic File System (EFS) volume.
     */
    HomeEfsFileSystemUid?: EfsUid;
    /**
     * The status.
     */
    Status?: UserProfileStatus;
    /**
     * The last modified time.
     */
    LastModifiedTime?: LastModifiedTime;
    /**
     * The creation time.
     */
    CreationTime?: CreationTime;
    /**
     * The failure reason.
     */
    FailureReason?: FailureReason;
    /**
     * The SSO user identifier.
     */
    SingleSignOnUserIdentifier?: SingleSignOnUserIdentifier;
    /**
     * The SSO user value.
     */
    SingleSignOnUserValue?: String256;
    /**
     * A collection of settings.
     */
    UserSettings?: UserSettings;
  }
  export interface DescribeWorkforceRequest {
    /**
     * The name of the private workforce whose access you want to restrict. WorkforceName is automatically set to default when a workforce is created and cannot be modified. 
     */
    WorkforceName: WorkforceName;
  }
  export interface DescribeWorkforceResponse {
    /**
     * A single private workforce, which is automatically created when you create your first private work team. You can create one private work force in each Amazon Web Services Region. By default, any workforce-related API operation used in a specific region will apply to the workforce created in that region. To learn how to create a private workforce, see Create a Private Workforce.
     */
    Workforce: Workforce;
  }
  export interface DescribeWorkteamRequest {
    /**
     * The name of the work team to return a description of.
     */
    WorkteamName: WorkteamName;
  }
  export interface DescribeWorkteamResponse {
    /**
     * A Workteam instance that contains information about the work team. 
     */
    Workteam: Workteam;
  }
  export type Description = string;
  export interface DesiredWeightAndCapacity {
    /**
     * The name of the variant to update.
     */
    VariantName: VariantName;
    /**
     * The variant's weight.
     */
    DesiredWeight?: VariantWeight;
    /**
     * The variant's capacity.
     */
    DesiredInstanceCount?: TaskCount;
  }
  export type DesiredWeightAndCapacityList = DesiredWeightAndCapacity[];
  export type DestinationS3Uri = string;
  export type DetailedAlgorithmStatus = "NotStarted"|"InProgress"|"Completed"|"Failed"|string;
  export type DetailedModelPackageStatus = "NotStarted"|"InProgress"|"Completed"|"Failed"|string;
  export interface Device {
    /**
     * The name of the device.
     */
    DeviceName: DeviceName;
    /**
     * Description of the device.
     */
    Description?: DeviceDescription;
    /**
     * Amazon Web Services Internet of Things (IoT) object name.
     */
    IotThingName?: ThingName;
  }
  export type DeviceArn = string;
  export type DeviceDescription = string;
  export type DeviceFleetArn = string;
  export type DeviceFleetDescription = string;
  export type DeviceFleetSummaries = DeviceFleetSummary[];
  export interface DeviceFleetSummary {
    /**
     * Amazon Resource Name (ARN) of the device fleet.
     */
    DeviceFleetArn: DeviceFleetArn;
    /**
     * Name of the device fleet.
     */
    DeviceFleetName: EntityName;
    /**
     * Timestamp of when the device fleet was created.
     */
    CreationTime?: Timestamp;
    /**
     * Timestamp of when the device fleet was last updated.
     */
    LastModifiedTime?: Timestamp;
  }
  export type DeviceName = string;
  export type DeviceNames = DeviceName[];
  export interface DeviceStats {
    /**
     * The number of devices connected with a heartbeat.
     */
    ConnectedDeviceCount: Long;
    /**
     * The number of registered devices.
     */
    RegisteredDeviceCount: Long;
  }
  export type DeviceSummaries = DeviceSummary[];
  export interface DeviceSummary {
    /**
     * The unique identifier of the device.
     */
    DeviceName: EntityName;
    /**
     * Amazon Resource Name (ARN) of the device.
     */
    DeviceArn: DeviceArn;
    /**
     * A description of the device.
     */
    Description?: DeviceDescription;
    /**
     * The name of the fleet the device belongs to.
     */
    DeviceFleetName?: EntityName;
    /**
     * The Amazon Web Services Internet of Things (IoT) object thing name associated with the device..
     */
    IotThingName?: ThingName;
    /**
     * The timestamp of the last registration or de-reregistration.
     */
    RegistrationTime?: Timestamp;
    /**
     * The last heartbeat received from the device.
     */
    LatestHeartbeat?: Timestamp;
    /**
     * Models on the device.
     */
    Models?: EdgeModelSummaries;
    /**
     * Edge Manager agent version.
     */
    AgentVersion?: EdgeVersion;
  }
  export type Devices = Device[];
  export type DirectInternetAccess = "Enabled"|"Disabled"|string;
  export type DirectoryPath = string;
  export type DisableProfiler = boolean;
  export interface DisableSagemakerServicecatalogPortfolioInput {
  }
  export interface DisableSagemakerServicecatalogPortfolioOutput {
  }
  export type DisassociateAdditionalCodeRepositories = boolean;
  export type DisassociateDefaultCodeRepository = boolean;
  export type DisassociateNotebookInstanceAcceleratorTypes = boolean;
  export type DisassociateNotebookInstanceLifecycleConfig = boolean;
  export interface DisassociateTrialComponentRequest {
    /**
     * The name of the component to disassociate from the trial.
     */
    TrialComponentName: ExperimentEntityName;
    /**
     * The name of the trial to disassociate from.
     */
    TrialName: ExperimentEntityName;
  }
  export interface DisassociateTrialComponentResponse {
    /**
     * The ARN of the trial component.
     */
    TrialComponentArn?: TrialComponentArn;
    /**
     * The Amazon Resource Name (ARN) of the trial.
     */
    TrialArn?: TrialArn;
  }
  export type Dollars = number;
  export type DomainArn = string;
  export interface DomainDetails {
    /**
     * The domain's Amazon Resource Name (ARN).
     */
    DomainArn?: DomainArn;
    /**
     * The domain ID.
     */
    DomainId?: DomainId;
    /**
     * The domain name.
     */
    DomainName?: DomainName;
    /**
     * The status.
     */
    Status?: DomainStatus;
    /**
     * The creation time.
     */
    CreationTime?: CreationTime;
    /**
     * The last modified time.
     */
    LastModifiedTime?: LastModifiedTime;
    /**
     * The domain's URL.
     */
    Url?: String1024;
  }
  export type DomainId = string;
  export type DomainList = DomainDetails[];
  export type DomainName = string;
  export type DomainSecurityGroupIds = SecurityGroupId[];
  export interface DomainSettings {
    /**
     * The security groups for the Amazon Virtual Private Cloud that the Domain uses for communication between Domain-level apps and user apps.
     */
    SecurityGroupIds?: DomainSecurityGroupIds;
    /**
     * A collection of settings that configure the RStudioServerPro Domain-level app.
     */
    RStudioServerProDomainSettings?: RStudioServerProDomainSettings;
  }
  export interface DomainSettingsForUpdate {
    /**
     * A collection of RStudioServerPro Domain-level app settings to update.
     */
    RStudioServerProDomainSettingsForUpdate?: RStudioServerProDomainSettingsForUpdate;
  }
  export type DomainStatus = "Deleting"|"Failed"|"InService"|"Pending"|"Updating"|"Update_Failed"|"Delete_Failed"|string;
  export type DoubleParameterValue = number;
  export interface EdgeModel {
    /**
     * The name of the model.
     */
    ModelName: EntityName;
    /**
     * The model version.
     */
    ModelVersion: EdgeVersion;
    /**
     * The timestamp of the last data sample taken.
     */
    LatestSampleTime?: Timestamp;
    /**
     * The timestamp of the last inference that was made.
     */
    LatestInference?: Timestamp;
  }
  export interface EdgeModelStat {
    /**
     * The name of the model.
     */
    ModelName: EntityName;
    /**
     * The model version.
     */
    ModelVersion: EdgeVersion;
    /**
     * The number of devices that have this model version and do not have a heart beat.
     */
    OfflineDeviceCount: Long;
    /**
     * The number of devices that have this model version and have a heart beat. 
     */
    ConnectedDeviceCount: Long;
    /**
     * The number of devices that have this model version, a heart beat, and are currently running.
     */
    ActiveDeviceCount: Long;
    /**
     * The number of devices with this model version and are producing sample data.
     */
    SamplingDeviceCount: Long;
  }
  export type EdgeModelStats = EdgeModelStat[];
  export type EdgeModelSummaries = EdgeModelSummary[];
  export interface EdgeModelSummary {
    /**
     * The name of the model.
     */
    ModelName: EntityName;
    /**
     * The version model.
     */
    ModelVersion: EdgeVersion;
  }
  export type EdgeModels = EdgeModel[];
  export interface EdgeOutputConfig {
    /**
     * The Amazon Simple Storage (S3) bucker URI.
     */
    S3OutputLocation: S3Uri;
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt data on the storage volume after compilation job. If you don't provide a KMS key ID, Amazon SageMaker uses the default KMS key for Amazon S3 for your role's account.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The deployment type SageMaker Edge Manager will create. Currently only supports Amazon Web Services IoT Greengrass Version 2 components.
     */
    PresetDeploymentType?: EdgePresetDeploymentType;
    /**
     * The configuration used to create deployment artifacts. Specify configuration options with a JSON string. The available configuration options for each type are:    ComponentName (optional) - Name of the GreenGrass V2 component. If not specified, the default name generated consists of "SagemakerEdgeManager" and the name of your SageMaker Edge Manager packaging job.    ComponentDescription (optional) - Description of the component.    ComponentVersion (optional) - The version of the component.  Amazon Web Services IoT Greengrass uses semantic versions for components. Semantic versions follow a major.minor.patch number system. For example, version 1.0.0 represents the first major release for a component. For more information, see the semantic version specification.     PlatformOS (optional) - The name of the operating system for the platform. Supported platforms include Windows and Linux.    PlatformArchitecture (optional) - The processor architecture for the platform.  Supported architectures Windows include: Windows32_x86, Windows64_x64. Supported architectures for Linux include: Linux x86_64, Linux ARMV8.  
     */
    PresetDeploymentConfig?: String;
  }
  export type EdgePackagingJobArn = string;
  export type EdgePackagingJobStatus = "STARTING"|"INPROGRESS"|"COMPLETED"|"FAILED"|"STOPPING"|"STOPPED"|string;
  export type EdgePackagingJobSummaries = EdgePackagingJobSummary[];
  export interface EdgePackagingJobSummary {
    /**
     * The Amazon Resource Name (ARN) of the edge packaging job.
     */
    EdgePackagingJobArn: EdgePackagingJobArn;
    /**
     * The name of the edge packaging job.
     */
    EdgePackagingJobName: EntityName;
    /**
     * The status of the edge packaging job.
     */
    EdgePackagingJobStatus: EdgePackagingJobStatus;
    /**
     * The name of the SageMaker Neo compilation job.
     */
    CompilationJobName?: EntityName;
    /**
     * The name of the model.
     */
    ModelName?: EntityName;
    /**
     * The version of the model.
     */
    ModelVersion?: EdgeVersion;
    /**
     * The timestamp of when the job was created.
     */
    CreationTime?: Timestamp;
    /**
     * The timestamp of when the edge packaging job was last updated.
     */
    LastModifiedTime?: Timestamp;
  }
  export type EdgePresetDeploymentArtifact = string;
  export interface EdgePresetDeploymentOutput {
    /**
     * The deployment type created by SageMaker Edge Manager. Currently only supports Amazon Web Services IoT Greengrass Version 2 components.
     */
    Type: EdgePresetDeploymentType;
    /**
     * The Amazon Resource Name (ARN) of the generated deployable resource.
     */
    Artifact?: EdgePresetDeploymentArtifact;
    /**
     * The status of the deployable resource.
     */
    Status?: EdgePresetDeploymentStatus;
    /**
     * Returns a message describing the status of the deployed resource.
     */
    StatusMessage?: String;
  }
  export type EdgePresetDeploymentStatus = "COMPLETED"|"FAILED"|string;
  export type EdgePresetDeploymentType = "GreengrassV2Component"|string;
  export type EdgeVersion = string;
  export type EfsUid = string;
  export type EnableCapture = boolean;
  export type EnableIotRoleAlias = boolean;
  export interface EnableSagemakerServicecatalogPortfolioInput {
  }
  export interface EnableSagemakerServicecatalogPortfolioOutput {
  }
  export interface Endpoint {
    /**
     * The name of the endpoint.
     */
    EndpointName: EndpointName;
    /**
     * The Amazon Resource Name (ARN) of the endpoint.
     */
    EndpointArn: EndpointArn;
    /**
     * The endpoint configuration associated with the endpoint.
     */
    EndpointConfigName: EndpointConfigName;
    /**
     * A list of the production variants hosted on the endpoint. Each production variant is a model.
     */
    ProductionVariants?: ProductionVariantSummaryList;
    DataCaptureConfig?: DataCaptureConfigSummary;
    /**
     * The status of the endpoint.
     */
    EndpointStatus: EndpointStatus;
    /**
     * If the endpoint failed, the reason it failed.
     */
    FailureReason?: FailureReason;
    /**
     * The time that the endpoint was created.
     */
    CreationTime: Timestamp;
    /**
     * The last time the endpoint was modified.
     */
    LastModifiedTime: Timestamp;
    /**
     * A list of monitoring schedules for the endpoint. For information about model monitoring, see Amazon SageMaker Model Monitor.
     */
    MonitoringSchedules?: MonitoringScheduleList;
    /**
     * A list of the tags associated with the endpoint. For more information, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference Guide.
     */
    Tags?: TagList;
  }
  export type EndpointArn = string;
  export type EndpointConfigArn = string;
  export type EndpointConfigName = string;
  export type EndpointConfigNameContains = string;
  export type EndpointConfigSortKey = "Name"|"CreationTime"|string;
  export interface EndpointConfigSummary {
    /**
     * The name of the endpoint configuration.
     */
    EndpointConfigName: EndpointConfigName;
    /**
     * The Amazon Resource Name (ARN) of the endpoint configuration.
     */
    EndpointConfigArn: EndpointConfigArn;
    /**
     * A timestamp that shows when the endpoint configuration was created.
     */
    CreationTime: Timestamp;
  }
  export type EndpointConfigSummaryList = EndpointConfigSummary[];
  export interface EndpointInput {
    /**
     * An endpoint in customer's account which has enabled DataCaptureConfig enabled.
     */
    EndpointName: EndpointName;
    /**
     * Path to the filesystem where the endpoint data is available to the container.
     */
    LocalPath: ProcessingLocalPath;
    /**
     * Whether the Pipe or File is used as the input mode for transferring data for the monitoring job. Pipe mode is recommended for large datasets. File mode is useful for small files that fit in memory. Defaults to File.
     */
    S3InputMode?: ProcessingS3InputMode;
    /**
     * Whether input data distributed in Amazon S3 is fully replicated or sharded by an S3 key. Defaults to FullyReplicated 
     */
    S3DataDistributionType?: ProcessingS3DataDistributionType;
    /**
     * The attributes of the input data that are the input features.
     */
    FeaturesAttribute?: String;
    /**
     * The attribute of the input data that represents the ground truth label.
     */
    InferenceAttribute?: String;
    /**
     * In a classification problem, the attribute that represents the class probability.
     */
    ProbabilityAttribute?: String;
    /**
     * The threshold for the class probability to be evaluated as a positive result.
     */
    ProbabilityThresholdAttribute?: ProbabilityThresholdAttribute;
    /**
     * If specified, monitoring jobs substract this time from the start time. For information about using offsets for scheduling monitoring jobs, see Schedule Model Quality Monitoring Jobs.
     */
    StartTimeOffset?: MonitoringTimeOffsetString;
    /**
     * If specified, monitoring jobs substract this time from the end time. For information about using offsets for scheduling monitoring jobs, see Schedule Model Quality Monitoring Jobs.
     */
    EndTimeOffset?: MonitoringTimeOffsetString;
  }
  export type EndpointName = string;
  export type EndpointNameContains = string;
  export type EndpointSortKey = "Name"|"CreationTime"|"Status"|string;
  export type EndpointStatus = "OutOfService"|"Creating"|"Updating"|"SystemUpdating"|"RollingBack"|"InService"|"Deleting"|"Failed"|string;
  export interface EndpointSummary {
    /**
     * The name of the endpoint.
     */
    EndpointName: EndpointName;
    /**
     * The Amazon Resource Name (ARN) of the endpoint.
     */
    EndpointArn: EndpointArn;
    /**
     * A timestamp that shows when the endpoint was created.
     */
    CreationTime: Timestamp;
    /**
     * A timestamp that shows when the endpoint was last modified.
     */
    LastModifiedTime: Timestamp;
    /**
     * The status of the endpoint.    OutOfService: Endpoint is not available to take incoming requests.    Creating: CreateEndpoint is executing.    Updating: UpdateEndpoint or UpdateEndpointWeightsAndCapacities is executing.    SystemUpdating: Endpoint is undergoing maintenance and cannot be updated or deleted or re-scaled until it has completed. This maintenance operation does not change any customer-specified values such as VPC config, KMS encryption, model, instance type, or instance count.    RollingBack: Endpoint fails to scale up or down or change its variant weight and is in the process of rolling back to its previous configuration. Once the rollback completes, endpoint returns to an InService status. This transitional status only applies to an endpoint that has autoscaling enabled and is undergoing variant weight or capacity changes as part of an UpdateEndpointWeightsAndCapacities call or when the UpdateEndpointWeightsAndCapacities operation is called explicitly.    InService: Endpoint is available to process incoming requests.    Deleting: DeleteEndpoint is executing.    Failed: Endpoint could not be created, updated, or re-scaled. Use DescribeEndpointOutput$FailureReason for information about the failure. DeleteEndpoint is the only operation that can be performed on a failed endpoint.   To get a list of endpoints with a specified status, use the ListEndpointsInput$StatusEquals filter.
     */
    EndpointStatus: EndpointStatus;
  }
  export type EndpointSummaryList = EndpointSummary[];
  export type EntityDescription = string;
  export type EntityName = string;
  export type EnvironmentKey = string;
  export type EnvironmentMap = {[key: string]: EnvironmentValue};
  export type EnvironmentValue = string;
  export type ExecutionStatus = "Pending"|"Completed"|"CompletedWithViolations"|"InProgress"|"Failed"|"Stopping"|"Stopped"|string;
  export type ExitMessage = string;
  export interface Experiment {
    /**
     * The name of the experiment.
     */
    ExperimentName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the experiment.
     */
    ExperimentArn?: ExperimentArn;
    /**
     * The name of the experiment as displayed. If DisplayName isn't specified, ExperimentName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    Source?: ExperimentSource;
    /**
     * The description of the experiment.
     */
    Description?: ExperimentDescription;
    /**
     * When the experiment was created.
     */
    CreationTime?: Timestamp;
    /**
     * Who created the experiment.
     */
    CreatedBy?: UserContext;
    /**
     * When the experiment was last modified.
     */
    LastModifiedTime?: Timestamp;
    LastModifiedBy?: UserContext;
    /**
     * The list of tags that are associated with the experiment. You can use Search API to search on the tags.
     */
    Tags?: TagList;
  }
  export type ExperimentArn = string;
  export interface ExperimentConfig {
    /**
     * The name of an existing experiment to associate the trial component with.
     */
    ExperimentName?: ExperimentEntityName;
    /**
     * The name of an existing trial to associate the trial component with. If not specified, a new trial is created.
     */
    TrialName?: ExperimentEntityName;
    /**
     * The display name for the trial component. If this key isn't specified, the display name is the trial component name.
     */
    TrialComponentDisplayName?: ExperimentEntityName;
  }
  export type ExperimentDescription = string;
  export type ExperimentEntityName = string;
  export interface ExperimentSource {
    /**
     * The Amazon Resource Name (ARN) of the source.
     */
    SourceArn: ExperimentSourceArn;
    /**
     * The source type.
     */
    SourceType?: SourceType;
  }
  export type ExperimentSourceArn = string;
  export type ExperimentSummaries = ExperimentSummary[];
  export interface ExperimentSummary {
    /**
     * The Amazon Resource Name (ARN) of the experiment.
     */
    ExperimentArn?: ExperimentArn;
    /**
     * The name of the experiment.
     */
    ExperimentName?: ExperimentEntityName;
    /**
     * The name of the experiment as displayed. If DisplayName isn't specified, ExperimentName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    ExperimentSource?: ExperimentSource;
    /**
     * When the experiment was created.
     */
    CreationTime?: Timestamp;
    /**
     * When the experiment was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export type ExpiresInSeconds = number;
  export interface Explainability {
    /**
     * The explainability report for a model.
     */
    Report?: MetricsSource;
  }
  export type ExplainabilityLocation = string;
  export type FailureReason = string;
  export interface FeatureDefinition {
    /**
     * The name of a feature. The type must be a string. FeatureName cannot be any of the following: is_deleted, write_time, api_invocation_time.
     */
    FeatureName?: FeatureName;
    /**
     * The value type of a feature. Valid values are Integral, Fractional, or String.
     */
    FeatureType?: FeatureType;
  }
  export type FeatureDefinitions = FeatureDefinition[];
  export interface FeatureGroup {
    /**
     * The Amazon Resource Name (ARN) of a FeatureGroup.
     */
    FeatureGroupArn?: FeatureGroupArn;
    /**
     * The name of the FeatureGroup.
     */
    FeatureGroupName?: FeatureGroupName;
    /**
     * The name of the Feature whose value uniquely identifies a Record defined in the FeatureGroup FeatureDefinitions.
     */
    RecordIdentifierFeatureName?: FeatureName;
    /**
     * The name of the feature that stores the EventTime of a Record in a FeatureGroup. A EventTime is point in time when a new event occurs that corresponds to the creation or update of a Record in FeatureGroup. All Records in the FeatureGroup must have a corresponding EventTime.
     */
    EventTimeFeatureName?: FeatureName;
    /**
     * A list of Features. Each Feature must include a FeatureName and a FeatureType.  Valid FeatureTypes are Integral, Fractional and String.   FeatureNames cannot be any of the following: is_deleted, write_time, api_invocation_time. You can create up to 2,500 FeatureDefinitions per FeatureGroup.
     */
    FeatureDefinitions?: FeatureDefinitions;
    /**
     * The time a FeatureGroup was created.
     */
    CreationTime?: CreationTime;
    OnlineStoreConfig?: OnlineStoreConfig;
    OfflineStoreConfig?: OfflineStoreConfig;
    /**
     * The Amazon Resource Name (ARN) of the IAM execution role used to create the feature group.
     */
    RoleArn?: RoleArn;
    /**
     * A FeatureGroup status.
     */
    FeatureGroupStatus?: FeatureGroupStatus;
    OfflineStoreStatus?: OfflineStoreStatus;
    /**
     * The reason that the FeatureGroup failed to be replicated in the OfflineStore. This is failure may be due to a failure to create a FeatureGroup in or delete a FeatureGroup from the OfflineStore.
     */
    FailureReason?: FailureReason;
    /**
     * A free form description of a FeatureGroup.
     */
    Description?: Description;
    /**
     * Tags used to define a FeatureGroup.
     */
    Tags?: TagList;
  }
  export type FeatureGroupArn = string;
  export type FeatureGroupMaxResults = number;
  export type FeatureGroupName = string;
  export type FeatureGroupNameContains = string;
  export type FeatureGroupSortBy = "Name"|"FeatureGroupStatus"|"OfflineStoreStatus"|"CreationTime"|string;
  export type FeatureGroupSortOrder = "Ascending"|"Descending"|string;
  export type FeatureGroupStatus = "Creating"|"Created"|"CreateFailed"|"Deleting"|"DeleteFailed"|string;
  export type FeatureGroupSummaries = FeatureGroupSummary[];
  export interface FeatureGroupSummary {
    /**
     * The name of FeatureGroup.
     */
    FeatureGroupName: FeatureGroupName;
    /**
     * Unique identifier for the FeatureGroup.
     */
    FeatureGroupArn: FeatureGroupArn;
    /**
     * A timestamp indicating the time of creation time of the FeatureGroup.
     */
    CreationTime: Timestamp;
    /**
     * The status of a FeatureGroup. The status can be any of the following: Creating, Created, CreateFail, Deleting or DetailFail. 
     */
    FeatureGroupStatus?: FeatureGroupStatus;
    /**
     * Notifies you if replicating data into the OfflineStore has failed. Returns either: Active or Blocked.
     */
    OfflineStoreStatus?: OfflineStoreStatus;
  }
  export type FeatureName = string;
  export type FeatureType = "Integral"|"Fractional"|"String"|string;
  export type FileSystemAccessMode = "rw"|"ro"|string;
  export interface FileSystemConfig {
    /**
     * The path within the image to mount the user's EFS home directory. The directory should be empty. If not specified, defaults to /home/sagemaker-user.
     */
    MountPath?: MountPath;
    /**
     * The default POSIX user ID (UID). If not specified, defaults to 1000.
     */
    DefaultUid?: DefaultUid;
    /**
     * The default POSIX group ID (GID). If not specified, defaults to 100.
     */
    DefaultGid?: DefaultGid;
  }
  export interface FileSystemDataSource {
    /**
     * The file system id.
     */
    FileSystemId: FileSystemId;
    /**
     * The access mode of the mount of the directory associated with the channel. A directory can be mounted either in ro (read-only) or rw (read-write) mode.
     */
    FileSystemAccessMode: FileSystemAccessMode;
    /**
     * The file system type. 
     */
    FileSystemType: FileSystemType;
    /**
     * The full path to the directory to associate with the channel.
     */
    DirectoryPath: DirectoryPath;
  }
  export type FileSystemId = string;
  export type FileSystemType = "EFS"|"FSxLustre"|string;
  export interface Filter {
    /**
     * A resource property name. For example, TrainingJobName. For valid property names, see SearchRecord. You must specify a valid property for the resource.
     */
    Name: ResourcePropertyName;
    /**
     * A Boolean binary operator that is used to evaluate the filter. The operator field contains one of the following values:  Equals  The value of Name equals Value.  NotEquals  The value of Name doesn't equal Value.  Exists  The Name property exists.  NotExists  The Name property does not exist.  GreaterThan  The value of Name is greater than Value. Not supported for text properties.  GreaterThanOrEqualTo  The value of Name is greater than or equal to Value. Not supported for text properties.  LessThan  The value of Name is less than Value. Not supported for text properties.  LessThanOrEqualTo  The value of Name is less than or equal to Value. Not supported for text properties.  In  The value of Name is one of the comma delimited strings in Value. Only supported for text properties.  Contains  The value of Name contains the string Value. Only supported for text properties. A SearchExpression can include the Contains operator multiple times when the value of Name is one of the following:    Experiment.DisplayName     Experiment.ExperimentName     Experiment.Tags     Trial.DisplayName     Trial.TrialName     Trial.Tags     TrialComponent.DisplayName     TrialComponent.TrialComponentName     TrialComponent.Tags     TrialComponent.InputArtifacts     TrialComponent.OutputArtifacts    A SearchExpression can include only one Contains operator for all other values of Name. In these cases, if you include multiple Contains operators in the SearchExpression, the result is the following error message: "'CONTAINS' operator usage limit of 1 exceeded."  
     */
    Operator?: Operator;
    /**
     * A value used with Name and Operator to determine which resources satisfy the filter's condition. For numerical properties, Value must be an integer or floating-point decimal. For timestamp properties, Value must be an ISO 8601 date-time string of the following format: YYYY-mm-dd'T'HH:MM:SS.
     */
    Value?: FilterValue;
  }
  export type FilterList = Filter[];
  export type FilterValue = string;
  export interface FinalAutoMLJobObjectiveMetric {
    /**
     * The type of metric with the best result.
     */
    Type?: AutoMLJobObjectiveType;
    /**
     * The name of the metric with the best result. For a description of the possible objective metrics, see AutoMLJobObjective$MetricName.
     */
    MetricName: AutoMLMetricEnum;
    /**
     * The value of the metric with the best result.
     */
    Value: MetricValue;
  }
  export interface FinalHyperParameterTuningJobObjectiveMetric {
    /**
     * Whether to minimize or maximize the objective metric. Valid values are Minimize and Maximize.
     */
    Type?: HyperParameterTuningJobObjectiveType;
    /**
     * The name of the objective metric.
     */
    MetricName: MetricName;
    /**
     * The value of the objective metric.
     */
    Value: MetricValue;
  }
  export type FinalMetricDataList = MetricData[];
  export type Float = number;
  export type FlowDefinitionArn = string;
  export type FlowDefinitionName = string;
  export interface FlowDefinitionOutputConfig {
    /**
     * The Amazon S3 path where the object containing human output will be made available. To learn more about the format of Amazon A2I output data, see Amazon A2I Output Data.
     */
    S3OutputPath: S3Uri;
    /**
     * The Amazon Key Management Service (KMS) key ID for server-side encryption.
     */
    KmsKeyId?: KmsKeyId;
  }
  export type FlowDefinitionStatus = "Initializing"|"Active"|"Failed"|"Deleting"|string;
  export type FlowDefinitionSummaries = FlowDefinitionSummary[];
  export interface FlowDefinitionSummary {
    /**
     * The name of the flow definition.
     */
    FlowDefinitionName: FlowDefinitionName;
    /**
     * The Amazon Resource Name (ARN) of the flow definition.
     */
    FlowDefinitionArn: FlowDefinitionArn;
    /**
     * The status of the flow definition. Valid values:
     */
    FlowDefinitionStatus: FlowDefinitionStatus;
    /**
     * The timestamp when SageMaker created the flow definition.
     */
    CreationTime: Timestamp;
    /**
     * The reason why the flow definition creation failed. A failure reason is returned only when the flow definition status is Failed.
     */
    FailureReason?: FailureReason;
  }
  export type FlowDefinitionTaskAvailabilityLifetimeInSeconds = number;
  export type FlowDefinitionTaskCount = number;
  export type FlowDefinitionTaskDescription = string;
  export type FlowDefinitionTaskKeyword = string;
  export type FlowDefinitionTaskKeywords = FlowDefinitionTaskKeyword[];
  export type FlowDefinitionTaskTimeLimitInSeconds = number;
  export type FlowDefinitionTaskTitle = string;
  export type Framework = "TENSORFLOW"|"KERAS"|"MXNET"|"ONNX"|"PYTORCH"|"XGBOOST"|"TFLITE"|"DARKNET"|"SKLEARN"|string;
  export type FrameworkVersion = string;
  export type GenerateCandidateDefinitionsOnly = boolean;
  export interface GetDeviceFleetReportRequest {
    /**
     * The name of the fleet.
     */
    DeviceFleetName: EntityName;
  }
  export interface GetDeviceFleetReportResponse {
    /**
     * The Amazon Resource Name (ARN) of the device.
     */
    DeviceFleetArn: DeviceFleetArn;
    /**
     * The name of the fleet.
     */
    DeviceFleetName: EntityName;
    /**
     * The output configuration for storing sample data collected by the fleet.
     */
    OutputConfig?: EdgeOutputConfig;
    /**
     * Description of the fleet.
     */
    Description?: DeviceFleetDescription;
    /**
     * Timestamp of when the report was generated.
     */
    ReportGenerated?: Timestamp;
    /**
     * Status of devices.
     */
    DeviceStats?: DeviceStats;
    /**
     * The versions of Edge Manager agent deployed on the fleet.
     */
    AgentVersions?: AgentVersions;
    /**
     * Status of model on device.
     */
    ModelStats?: EdgeModelStats;
  }
  export interface GetModelPackageGroupPolicyInput {
    /**
     * The name of the model group for which to get the resource policy.
     */
    ModelPackageGroupName: EntityName;
  }
  export interface GetModelPackageGroupPolicyOutput {
    /**
     * The resource policy for the model group.
     */
    ResourcePolicy: PolicyString;
  }
  export interface GetSagemakerServicecatalogPortfolioStatusInput {
  }
  export interface GetSagemakerServicecatalogPortfolioStatusOutput {
    /**
     * Whether Service Catalog is enabled or disabled in SageMaker.
     */
    Status?: SagemakerServicecatalogStatus;
  }
  export interface GetSearchSuggestionsRequest {
    /**
     * The name of the Amazon SageMaker resource to search for.
     */
    Resource: ResourceType;
    /**
     * Limits the property names that are included in the response.
     */
    SuggestionQuery?: SuggestionQuery;
  }
  export interface GetSearchSuggestionsResponse {
    /**
     * A list of property names for a Resource that match a SuggestionQuery.
     */
    PropertyNameSuggestions?: PropertyNameSuggestionList;
  }
  export interface GitConfig {
    /**
     * The URL where the Git repository is located.
     */
    RepositoryUrl: GitConfigUrl;
    /**
     * The default branch for the Git repository.
     */
    Branch?: Branch;
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Secrets Manager secret that contains the credentials used to access the git repository. The secret must have a staging label of AWSCURRENT and must be in the following format:  {"username": UserName, "password": Password} 
     */
    SecretArn?: SecretArn;
  }
  export interface GitConfigForUpdate {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Web Services Secrets Manager secret that contains the credentials used to access the git repository. The secret must have a staging label of AWSCURRENT and must be in the following format:  {"username": UserName, "password": Password} 
     */
    SecretArn?: SecretArn;
  }
  export type GitConfigUrl = string;
  export type Group = string;
  export type Groups = Group[];
  export type HookParameters = {[key: string]: ConfigValue};
  export type HumanLoopActivationConditions = string;
  export interface HumanLoopActivationConditionsConfig {
    /**
     * JSON expressing use-case specific conditions declaratively. If any condition is matched, atomic tasks are created against the configured work team. The set of conditions is different for Rekognition and Textract. For more information about how to structure the JSON, see JSON Schema for Human Loop Activation Conditions in Amazon Augmented AI in the Amazon SageMaker Developer Guide.
     */
    HumanLoopActivationConditions: HumanLoopActivationConditions;
  }
  export interface HumanLoopActivationConfig {
    /**
     * Container structure for defining under what conditions SageMaker creates a human loop.
     */
    HumanLoopActivationConditionsConfig: HumanLoopActivationConditionsConfig;
  }
  export interface HumanLoopConfig {
    /**
     * Amazon Resource Name (ARN) of a team of workers. To learn more about the types of workforces and work teams you can create and use with Amazon A2I, see Create and Manage Workforces.
     */
    WorkteamArn: WorkteamArn;
    /**
     * The Amazon Resource Name (ARN) of the human task user interface. You can use standard HTML and Crowd HTML Elements to create a custom worker task template. You use this template to create a human task UI. To learn how to create a custom HTML template, see Create Custom Worker Task Template. To learn how to create a human task UI, which is a worker task template that can be used in a flow definition, see Create and Delete a Worker Task Templates.
     */
    HumanTaskUiArn: HumanTaskUiArn;
    /**
     * A title for the human worker task.
     */
    TaskTitle: FlowDefinitionTaskTitle;
    /**
     * A description for the human worker task.
     */
    TaskDescription: FlowDefinitionTaskDescription;
    /**
     * The number of distinct workers who will perform the same task on each object. For example, if TaskCount is set to 3 for an image classification labeling job, three workers will classify each input image. Increasing TaskCount can improve label accuracy.
     */
    TaskCount: FlowDefinitionTaskCount;
    /**
     * The length of time that a task remains available for review by human workers.
     */
    TaskAvailabilityLifetimeInSeconds?: FlowDefinitionTaskAvailabilityLifetimeInSeconds;
    /**
     * The amount of time that a worker has to complete a task. The default value is 3,600 seconds (1 hour).
     */
    TaskTimeLimitInSeconds?: FlowDefinitionTaskTimeLimitInSeconds;
    /**
     * Keywords used to describe the task so that workers can discover the task.
     */
    TaskKeywords?: FlowDefinitionTaskKeywords;
    PublicWorkforceTaskPrice?: PublicWorkforceTaskPrice;
  }
  export interface HumanLoopRequestSource {
    /**
     * Specifies whether Amazon Rekognition or Amazon Textract are used as the integration source. The default field settings and JSON parsing rules are different based on the integration source. Valid values:
     */
    AwsManagedHumanLoopRequestSource: AwsManagedHumanLoopRequestSource;
  }
  export interface HumanTaskConfig {
    /**
     * The Amazon Resource Name (ARN) of the work team assigned to complete the tasks.
     */
    WorkteamArn: WorkteamArn;
    /**
     * Information about the user interface that workers use to complete the labeling task.
     */
    UiConfig: UiConfig;
    /**
     * The Amazon Resource Name (ARN) of a Lambda function that is run before a data object is sent to a human worker. Use this function to provide input to a custom labeling job. For built-in task types, use one of the following Amazon SageMaker Ground Truth Lambda function ARNs for PreHumanTaskLambdaArn. For custom labeling workflows, see Pre-annotation Lambda.   Bounding box - Finds the most similar boxes from different workers based on the Jaccard index of the boxes.    arn:aws:lambda:us-east-1:432418664414:function:PRE-BoundingBox     arn:aws:lambda:us-east-2:266458841044:function:PRE-BoundingBox     arn:aws:lambda:us-west-2:081040173940:function:PRE-BoundingBox     arn:aws:lambda:ca-central-1:918755190332:function:PRE-BoundingBox     arn:aws:lambda:eu-west-1:568282634449:function:PRE-BoundingBox     arn:aws:lambda:eu-west-2:487402164563:function:PRE-BoundingBox     arn:aws:lambda:eu-central-1:203001061592:function:PRE-BoundingBox     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-BoundingBox     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-BoundingBox     arn:aws:lambda:ap-south-1:565803892007:function:PRE-BoundingBox     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-BoundingBox     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-BoundingBox     Image classification - Uses a variant of the Expectation Maximization approach to estimate the true class of an image based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:PRE-ImageMultiClass     arn:aws:lambda:us-east-2:266458841044:function:PRE-ImageMultiClass     arn:aws:lambda:us-west-2:081040173940:function:PRE-ImageMultiClass     arn:aws:lambda:ca-central-1:918755190332:function:PRE-ImageMultiClass     arn:aws:lambda:eu-west-1:568282634449:function:PRE-ImageMultiClass     arn:aws:lambda:eu-west-2:487402164563:function:PRE-ImageMultiClass     arn:aws:lambda:eu-central-1:203001061592:function:PRE-ImageMultiClass     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-ImageMultiClass     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-ImageMultiClass     arn:aws:lambda:ap-south-1:565803892007:function:PRE-ImageMultiClass     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-ImageMultiClass     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-ImageMultiClass     Multi-label image classification - Uses a variant of the Expectation Maximization approach to estimate the true classes of an image based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:us-east-2:266458841044:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:us-west-2:081040173940:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:ca-central-1:918755190332:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:eu-west-1:568282634449:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:eu-west-2:487402164563:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:eu-central-1:203001061592:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:ap-south-1:565803892007:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-ImageMultiClassMultiLabel     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-ImageMultiClassMultiLabel     Semantic segmentation - Treats each pixel in an image as a multi-class classification and treats pixel annotations from workers as "votes" for the correct label.    arn:aws:lambda:us-east-1:432418664414:function:PRE-SemanticSegmentation     arn:aws:lambda:us-east-2:266458841044:function:PRE-SemanticSegmentation     arn:aws:lambda:us-west-2:081040173940:function:PRE-SemanticSegmentation     arn:aws:lambda:ca-central-1:918755190332:function:PRE-SemanticSegmentation     arn:aws:lambda:eu-west-1:568282634449:function:PRE-SemanticSegmentation     arn:aws:lambda:eu-west-2:487402164563:function:PRE-SemanticSegmentation     arn:aws:lambda:eu-central-1:203001061592:function:PRE-SemanticSegmentation     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-SemanticSegmentation     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-SemanticSegmentation     arn:aws:lambda:ap-south-1:565803892007:function:PRE-SemanticSegmentation     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-SemanticSegmentation     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-SemanticSegmentation     Text classification - Uses a variant of the Expectation Maximization approach to estimate the true class of text based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:PRE-TextMultiClass     arn:aws:lambda:us-east-2:266458841044:function:PRE-TextMultiClass     arn:aws:lambda:us-west-2:081040173940:function:PRE-TextMultiClass     arn:aws:lambda:ca-central-1:918755190332:function:PRE-TextMultiClass     arn:aws:lambda:eu-west-1:568282634449:function:PRE-TextMultiClass     arn:aws:lambda:eu-west-2:487402164563:function:PRE-TextMultiClass     arn:aws:lambda:eu-central-1:203001061592:function:PRE-TextMultiClass     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-TextMultiClass     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-TextMultiClass     arn:aws:lambda:ap-south-1:565803892007:function:PRE-TextMultiClass     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-TextMultiClass     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-TextMultiClass     Multi-label text classification - Uses a variant of the Expectation Maximization approach to estimate the true classes of text based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:us-east-2:266458841044:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:us-west-2:081040173940:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:ca-central-1:918755190332:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:eu-west-1:568282634449:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:eu-west-2:487402164563:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:eu-central-1:203001061592:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:ap-south-1:565803892007:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-TextMultiClassMultiLabel     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-TextMultiClassMultiLabel     Named entity recognition - Groups similar selections and calculates aggregate boundaries, resolving to most-assigned label.    arn:aws:lambda:us-east-1:432418664414:function:PRE-NamedEntityRecognition     arn:aws:lambda:us-east-2:266458841044:function:PRE-NamedEntityRecognition     arn:aws:lambda:us-west-2:081040173940:function:PRE-NamedEntityRecognition     arn:aws:lambda:ca-central-1:918755190332:function:PRE-NamedEntityRecognition     arn:aws:lambda:eu-west-1:568282634449:function:PRE-NamedEntityRecognition     arn:aws:lambda:eu-west-2:487402164563:function:PRE-NamedEntityRecognition     arn:aws:lambda:eu-central-1:203001061592:function:PRE-NamedEntityRecognition     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-NamedEntityRecognition     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-NamedEntityRecognition     arn:aws:lambda:ap-south-1:565803892007:function:PRE-NamedEntityRecognition     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-NamedEntityRecognition     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-NamedEntityRecognition     Video Classification - Use this task type when you need workers to classify videos using predefined labels that you specify. Workers are shown videos and are asked to choose one label for each video.    arn:aws:lambda:us-east-1:432418664414:function:PRE-VideoMultiClass     arn:aws:lambda:us-east-2:266458841044:function:PRE-VideoMultiClass     arn:aws:lambda:us-west-2:081040173940:function:PRE-VideoMultiClass     arn:aws:lambda:eu-west-1:568282634449:function:PRE-VideoMultiClass     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-VideoMultiClass     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-VideoMultiClass     arn:aws:lambda:ap-south-1:565803892007:function:PRE-VideoMultiClass     arn:aws:lambda:eu-central-1:203001061592:function:PRE-VideoMultiClass     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-VideoMultiClass     arn:aws:lambda:eu-west-2:487402164563:function:PRE-VideoMultiClass     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-VideoMultiClass     arn:aws:lambda:ca-central-1:918755190332:function:PRE-VideoMultiClass     Video Frame Object Detection - Use this task type to have workers identify and locate objects in a sequence of video frames (images extracted from a video) using bounding boxes. For example, you can use this task to ask workers to identify and localize various objects in a series of video frames, such as cars, bikes, and pedestrians.    arn:aws:lambda:us-east-1:432418664414:function:PRE-VideoObjectDetection     arn:aws:lambda:us-east-2:266458841044:function:PRE-VideoObjectDetection     arn:aws:lambda:us-west-2:081040173940:function:PRE-VideoObjectDetection     arn:aws:lambda:eu-west-1:568282634449:function:PRE-VideoObjectDetection     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-VideoObjectDetection     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-VideoObjectDetection     arn:aws:lambda:ap-south-1:565803892007:function:PRE-VideoObjectDetection     arn:aws:lambda:eu-central-1:203001061592:function:PRE-VideoObjectDetection     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-VideoObjectDetection     arn:aws:lambda:eu-west-2:487402164563:function:PRE-VideoObjectDetection     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-VideoObjectDetection     arn:aws:lambda:ca-central-1:918755190332:function:PRE-VideoObjectDetection     Video Frame Object Tracking - Use this task type to have workers track the movement of objects in a sequence of video frames (images extracted from a video) using bounding boxes. For example, you can use this task to ask workers to track the movement of objects, such as cars, bikes, and pedestrians.     arn:aws:lambda:us-east-1:432418664414:function:PRE-VideoObjectTracking     arn:aws:lambda:us-east-2:266458841044:function:PRE-VideoObjectTracking     arn:aws:lambda:us-west-2:081040173940:function:PRE-VideoObjectTracking     arn:aws:lambda:eu-west-1:568282634449:function:PRE-VideoObjectTracking     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-VideoObjectTracking     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-VideoObjectTracking     arn:aws:lambda:ap-south-1:565803892007:function:PRE-VideoObjectTracking     arn:aws:lambda:eu-central-1:203001061592:function:PRE-VideoObjectTracking     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-VideoObjectTracking     arn:aws:lambda:eu-west-2:487402164563:function:PRE-VideoObjectTracking     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-VideoObjectTracking     arn:aws:lambda:ca-central-1:918755190332:function:PRE-VideoObjectTracking     3D Point Cloud Modalities  Use the following pre-annotation lambdas for 3D point cloud labeling modality tasks. See 3D Point Cloud Task types  to learn more.   3D Point Cloud Object Detection - Use this task type when you want workers to classify objects in a 3D point cloud by drawing 3D cuboids around objects. For example, you can use this task type to ask workers to identify different types of objects in a point cloud, such as cars, bikes, and pedestrians.    arn:aws:lambda:us-east-1:432418664414:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:us-east-2:266458841044:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:us-west-2:081040173940:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:eu-west-1:568282634449:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:ap-south-1:565803892007:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:eu-central-1:203001061592:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:eu-west-2:487402164563:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-3DPointCloudObjectDetection     arn:aws:lambda:ca-central-1:918755190332:function:PRE-3DPointCloudObjectDetection     3D Point Cloud Object Tracking - Use this task type when you want workers to draw 3D cuboids around objects that appear in a sequence of 3D point cloud frames. For example, you can use this task type to ask workers to track the movement of vehicles across multiple point cloud frames.     arn:aws:lambda:us-east-1:432418664414:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:us-east-2:266458841044:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:us-west-2:081040173940:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:eu-west-1:568282634449:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:ap-south-1:565803892007:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:eu-central-1:203001061592:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:eu-west-2:487402164563:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-3DPointCloudObjectTracking     arn:aws:lambda:ca-central-1:918755190332:function:PRE-3DPointCloudObjectTracking     3D Point Cloud Semantic Segmentation - Use this task type when you want workers to create a point-level semantic segmentation masks by painting objects in a 3D point cloud using different colors where each color is assigned to one of the classes you specify.    arn:aws:lambda:us-east-1:432418664414:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:us-east-2:266458841044:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:us-west-2:081040173940:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-west-1:568282634449:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-south-1:565803892007:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-central-1:203001061592:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-west-2:487402164563:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-3DPointCloudSemanticSegmentation     arn:aws:lambda:ca-central-1:918755190332:function:PRE-3DPointCloudSemanticSegmentation     Use the following ARNs for Label Verification and Adjustment Jobs  Use label verification and adjustment jobs to review and adjust labels. To learn more, see Verify and Adjust Labels .  Bounding box verification - Uses a variant of the Expectation Maximization approach to estimate the true class of verification judgement for bounding box labels based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:PRE-VerificationBoundingBox     arn:aws:lambda:us-east-2:266458841044:function:PRE-VerificationBoundingBox     arn:aws:lambda:us-west-2:081040173940:function:PRE-VerificationBoundingBox     arn:aws:lambda:eu-west-1:568282634449:function:PRE-VerificationBoundingBox     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-VerificationBoundingBox     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-VerificationBoundingBox     arn:aws:lambda:ap-south-1:565803892007:function:PRE-VerificationBoundingBox     arn:aws:lambda:eu-central-1:203001061592:function:PRE-VerificationBoundingBox     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-VerificationBoundingBox     arn:aws:lambda:eu-west-2:487402164563:function:PRE-VerificationBoundingBox     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-VerificationBoundingBox     arn:aws:lambda:ca-central-1:918755190332:function:PRE-VerificationBoundingBox     Bounding box adjustment - Finds the most similar boxes from different workers based on the Jaccard index of the adjusted annotations.    arn:aws:lambda:us-east-1:432418664414:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:us-east-2:266458841044:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:us-west-2:081040173940:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:ca-central-1:918755190332:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:eu-west-1:568282634449:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:eu-west-2:487402164563:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:eu-central-1:203001061592:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:ap-south-1:565803892007:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-AdjustmentBoundingBox     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-AdjustmentBoundingBox     Semantic segmentation verification - Uses a variant of the Expectation Maximization approach to estimate the true class of verification judgment for semantic segmentation labels based on annotations from individual workers.    arn:aws:lambda:us-east-1:432418664414:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:us-east-2:266458841044:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:us-west-2:081040173940:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:ca-central-1:918755190332:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:eu-west-1:568282634449:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:eu-west-2:487402164563:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:eu-central-1:203001061592:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:ap-south-1:565803892007:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-VerificationSemanticSegmentation     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-VerificationSemanticSegmentation     Semantic segmentation adjustment - Treats each pixel in an image as a multi-class classification and treats pixel adjusted annotations from workers as "votes" for the correct label.    arn:aws:lambda:us-east-1:432418664414:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:us-east-2:266458841044:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:us-west-2:081040173940:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:ca-central-1:918755190332:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:eu-west-1:568282634449:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:eu-west-2:487402164563:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:eu-central-1:203001061592:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:ap-south-1:565803892007:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-AdjustmentSemanticSegmentation     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-AdjustmentSemanticSegmentation     Video Frame Object Detection Adjustment - Use this task type when you want workers to adjust bounding boxes that workers have added to video frames to classify and localize objects in a sequence of video frames.    arn:aws:lambda:us-east-1:432418664414:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:us-east-2:266458841044:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:us-west-2:081040173940:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:eu-west-1:568282634449:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:ap-south-1:565803892007:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:eu-central-1:203001061592:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:eu-west-2:487402164563:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-AdjustmentVideoObjectDetection     arn:aws:lambda:ca-central-1:918755190332:function:PRE-AdjustmentVideoObjectDetection     Video Frame Object Tracking Adjustment - Use this task type when you want workers to adjust bounding boxes that workers have added to video frames to track object movement across a sequence of video frames.    arn:aws:lambda:us-east-1:432418664414:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:us-east-2:266458841044:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:us-west-2:081040173940:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:eu-west-1:568282634449:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:ap-south-1:565803892007:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:eu-central-1:203001061592:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:eu-west-2:487402164563:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-AdjustmentVideoObjectTracking     arn:aws:lambda:ca-central-1:918755190332:function:PRE-AdjustmentVideoObjectTracking     3D point cloud object detection adjustment - Adjust 3D cuboids in a point cloud frame.     arn:aws:lambda:us-east-1:432418664414:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:us-east-2:266458841044:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:us-west-2:081040173940:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:eu-west-1:568282634449:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ap-south-1:565803892007:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:eu-central-1:203001061592:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:eu-west-2:487402164563:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-Adjustment3DPointCloudObjectDetection     arn:aws:lambda:ca-central-1:918755190332:function:PRE-Adjustment3DPointCloudObjectDetection     3D point cloud object tracking adjustment - Adjust 3D cuboids across a sequence of point cloud frames.     arn:aws:lambda:us-east-1:432418664414:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:us-east-2:266458841044:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:us-west-2:081040173940:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:eu-west-1:568282634449:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ap-south-1:565803892007:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:eu-central-1:203001061592:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:eu-west-2:487402164563:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-Adjustment3DPointCloudObjectTracking     arn:aws:lambda:ca-central-1:918755190332:function:PRE-Adjustment3DPointCloudObjectTracking     3D point cloud semantic segmentation adjustment - Adjust semantic segmentation masks in a 3D point cloud.     arn:aws:lambda:us-east-1:432418664414:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:us-east-2:266458841044:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:us-west-2:081040173940:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-west-1:568282634449:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-northeast-1:477331159723:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-southeast-2:454466003867:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-south-1:565803892007:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-central-1:203001061592:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-northeast-2:845288260483:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:eu-west-2:487402164563:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ap-southeast-1:377565633583:function:PRE-Adjustment3DPointCloudSemanticSegmentation     arn:aws:lambda:ca-central-1:918755190332:function:PRE-Adjustment3DPointCloudSemanticSegmentation   
     */
    PreHumanTaskLambdaArn: LambdaFunctionArn;
    /**
     * Keywords used to describe the task so that workers on Amazon Mechanical Turk can discover the task.
     */
    TaskKeywords?: TaskKeywords;
    /**
     * A title for the task for your human workers.
     */
    TaskTitle: TaskTitle;
    /**
     * A description of the task for your human workers.
     */
    TaskDescription: TaskDescription;
    /**
     * The number of human workers that will label an object. 
     */
    NumberOfHumanWorkersPerDataObject: NumberOfHumanWorkersPerDataObject;
    /**
     * The amount of time that a worker has to complete a task.  If you create a custom labeling job, the maximum value for this parameter is 8 hours (28,800 seconds). If you create a labeling job using a built-in task type the maximum for this parameter depends on the task type you use:   For image and text labeling jobs, the maximum is 8 hours (28,800 seconds).   For 3D point cloud and video frame labeling jobs, the maximum is 30 days (2952,000 seconds) for non-AL mode. For most users, the maximum is also 30 days. If you want to change these limits, contact Amazon Web Services Support.  
     */
    TaskTimeLimitInSeconds: TaskTimeLimitInSeconds;
    /**
     * The length of time that a task remains available for labeling by human workers. The default and maximum values for this parameter depend on the type of workforce you use.   If you choose the Amazon Mechanical Turk workforce, the maximum is 12 hours (43,200 seconds). The default is 6 hours (21,600 seconds).   If you choose a private or vendor workforce, the default value is 30 days (2592,000 seconds) for non-AL mode. For most users, the maximum is also 30 days. If you want to change this limit, contact Amazon Web Services Support.  
     */
    TaskAvailabilityLifetimeInSeconds?: TaskAvailabilityLifetimeInSeconds;
    /**
     * Defines the maximum number of data objects that can be labeled by human workers at the same time. Also referred to as batch size. Each object may have more than one worker at one time. The default value is 1000 objects.
     */
    MaxConcurrentTaskCount?: MaxConcurrentTaskCount;
    /**
     * Configures how labels are consolidated across human workers.
     */
    AnnotationConsolidationConfig: AnnotationConsolidationConfig;
    /**
     * The price that you pay for each task performed by an Amazon Mechanical Turk worker.
     */
    PublicWorkforceTaskPrice?: PublicWorkforceTaskPrice;
  }
  export type HumanTaskUiArn = string;
  export type HumanTaskUiName = string;
  export type HumanTaskUiStatus = "Active"|"Deleting"|string;
  export type HumanTaskUiSummaries = HumanTaskUiSummary[];
  export interface HumanTaskUiSummary {
    /**
     * The name of the human task user interface.
     */
    HumanTaskUiName: HumanTaskUiName;
    /**
     * The Amazon Resource Name (ARN) of the human task user interface.
     */
    HumanTaskUiArn: HumanTaskUiArn;
    /**
     * A timestamp when SageMaker created the human task user interface.
     */
    CreationTime: Timestamp;
  }
  export interface HyperParameterAlgorithmSpecification {
    /**
     *  The registry path of the Docker image that contains the training algorithm. For information about Docker registry paths for built-in algorithms, see Algorithms Provided by Amazon SageMaker: Common Parameters. Amazon SageMaker supports both registry/repository[:tag] and registry/repository[@digest] image path formats. For more information, see Using Your Own Algorithms with Amazon SageMaker.
     */
    TrainingImage?: AlgorithmImage;
    TrainingInputMode: TrainingInputMode;
    /**
     * The name of the resource algorithm to use for the hyperparameter tuning job. If you specify a value for this parameter, do not specify a value for TrainingImage.
     */
    AlgorithmName?: ArnOrName;
    /**
     * An array of MetricDefinition objects that specify the metrics that the algorithm emits.
     */
    MetricDefinitions?: MetricDefinitionList;
  }
  export type HyperParameterKey = string;
  export type HyperParameterScalingType = "Auto"|"Linear"|"Logarithmic"|"ReverseLogarithmic"|string;
  export interface HyperParameterSpecification {
    /**
     * The name of this hyperparameter. The name must be unique.
     */
    Name: ParameterName;
    /**
     * A brief description of the hyperparameter.
     */
    Description?: EntityDescription;
    /**
     * The type of this hyperparameter. The valid types are Integer, Continuous, Categorical, and FreeText.
     */
    Type: ParameterType;
    /**
     * The allowed range for this hyperparameter.
     */
    Range?: ParameterRange;
    /**
     * Indicates whether this hyperparameter is tunable in a hyperparameter tuning job.
     */
    IsTunable?: Boolean;
    /**
     * Indicates whether this hyperparameter is required.
     */
    IsRequired?: Boolean;
    /**
     * The default value for this hyperparameter. If a default value is specified, a hyperparameter cannot be required.
     */
    DefaultValue?: HyperParameterValue;
  }
  export type HyperParameterSpecifications = HyperParameterSpecification[];
  export interface HyperParameterTrainingJobDefinition {
    /**
     * The job definition name.
     */
    DefinitionName?: HyperParameterTrainingJobDefinitionName;
    TuningObjective?: HyperParameterTuningJobObjective;
    HyperParameterRanges?: ParameterRanges;
    /**
     * Specifies the values of hyperparameters that do not change for the tuning job.
     */
    StaticHyperParameters?: HyperParameters;
    /**
     * The HyperParameterAlgorithmSpecification object that specifies the resource algorithm to use for the training jobs that the tuning job launches.
     */
    AlgorithmSpecification: HyperParameterAlgorithmSpecification;
    /**
     * The Amazon Resource Name (ARN) of the IAM role associated with the training jobs that the tuning job launches.
     */
    RoleArn: RoleArn;
    /**
     * An array of Channel objects that specify the input for the training jobs that the tuning job launches.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The VpcConfig object that specifies the VPC that you want the training jobs that this hyperparameter tuning job launches to connect to. Control access to and from your training container by configuring the VPC. For more information, see Protect Training Jobs by Using an Amazon Virtual Private Cloud.
     */
    VpcConfig?: VpcConfig;
    /**
     * Specifies the path to the Amazon S3 bucket where you store model artifacts from the training jobs that the tuning job launches.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The resources, including the compute instances and storage volumes, to use for the training jobs that the tuning job launches. Storage volumes store model artifacts and incremental states. Training algorithms might also use storage volumes for scratch space. If you want Amazon SageMaker to use the storage volume to store the training data, choose File as the TrainingInputMode in the algorithm specification. For distributed training algorithms, specify an instance count greater than 1.
     */
    ResourceConfig: ResourceConfig;
    /**
     * Specifies a limit to how long a model hyperparameter training job can run. It also specifies how long a managed spot training job has to complete. When the job reaches the time limit, Amazon SageMaker ends the training job. Use this API to cap model training costs.
     */
    StoppingCondition: StoppingCondition;
    /**
     * Isolates the training container. No inbound or outbound network calls can be made, except for calls between peers within a training cluster for distributed training. If network isolation is used for training jobs that are configured to use a VPC, Amazon SageMaker downloads and uploads customer data and model artifacts through the specified VPC, but the training container does not have network access.
     */
    EnableNetworkIsolation?: Boolean;
    /**
     * To encrypt all communications between ML compute instances in distributed training, choose True. Encryption provides greater security for distributed training, but training might take longer. How long it takes depends on the amount of communication between compute instances, especially if you use a deep learning algorithm in distributed training.
     */
    EnableInterContainerTrafficEncryption?: Boolean;
    /**
     * A Boolean indicating whether managed spot training is enabled (True) or not (False).
     */
    EnableManagedSpotTraining?: Boolean;
    CheckpointConfig?: CheckpointConfig;
    /**
     * The number of times to retry the job when the job fails due to an InternalServerError.
     */
    RetryStrategy?: RetryStrategy;
  }
  export type HyperParameterTrainingJobDefinitionName = string;
  export type HyperParameterTrainingJobDefinitions = HyperParameterTrainingJobDefinition[];
  export type HyperParameterTrainingJobSummaries = HyperParameterTrainingJobSummary[];
  export interface HyperParameterTrainingJobSummary {
    /**
     * The training job definition name.
     */
    TrainingJobDefinitionName?: HyperParameterTrainingJobDefinitionName;
    /**
     * The name of the training job.
     */
    TrainingJobName: TrainingJobName;
    /**
     * The Amazon Resource Name (ARN) of the training job.
     */
    TrainingJobArn: TrainingJobArn;
    /**
     * The HyperParameter tuning job that launched the training job.
     */
    TuningJobName?: HyperParameterTuningJobName;
    /**
     * The date and time that the training job was created.
     */
    CreationTime: Timestamp;
    /**
     * The date and time that the training job started.
     */
    TrainingStartTime?: Timestamp;
    /**
     * Specifies the time when the training job ends on training instances. You are billed for the time interval between the value of TrainingStartTime and this time. For successful jobs and stopped jobs, this is the time after model artifacts are uploaded. For failed jobs, this is the time when Amazon SageMaker detects a job failure.
     */
    TrainingEndTime?: Timestamp;
    /**
     * The status of the training job.
     */
    TrainingJobStatus: TrainingJobStatus;
    /**
     * A list of the hyperparameters for which you specified ranges to search.
     */
    TunedHyperParameters: HyperParameters;
    /**
     * The reason that the training job failed. 
     */
    FailureReason?: FailureReason;
    /**
     * The FinalHyperParameterTuningJobObjectiveMetric object that specifies the value of the objective metric of the tuning job that launched this training job.
     */
    FinalHyperParameterTuningJobObjectiveMetric?: FinalHyperParameterTuningJobObjectiveMetric;
    /**
     * The status of the objective metric for the training job:   Succeeded: The final objective metric for the training job was evaluated by the hyperparameter tuning job and used in the hyperparameter tuning process.     Pending: The training job is in progress and evaluation of its final objective metric is pending.     Failed: The final objective metric for the training job was not evaluated, and was not used in the hyperparameter tuning process. This typically occurs when the training job failed or did not emit an objective metric.  
     */
    ObjectiveStatus?: ObjectiveStatus;
  }
  export type HyperParameterTuningJobArn = string;
  export interface HyperParameterTuningJobConfig {
    /**
     * Specifies how hyperparameter tuning chooses the combinations of hyperparameter values to use for the training job it launches. To use the Bayesian search strategy, set this to Bayesian. To randomly search, set it to Random. For information about search strategies, see How Hyperparameter Tuning Works.
     */
    Strategy: HyperParameterTuningJobStrategyType;
    /**
     * The HyperParameterTuningJobObjective object that specifies the objective metric for this tuning job.
     */
    HyperParameterTuningJobObjective?: HyperParameterTuningJobObjective;
    /**
     * The ResourceLimits object that specifies the maximum number of training jobs and parallel training jobs for this tuning job.
     */
    ResourceLimits: ResourceLimits;
    /**
     * The ParameterRanges object that specifies the ranges of hyperparameters that this tuning job searches.
     */
    ParameterRanges?: ParameterRanges;
    /**
     * Specifies whether to use early stopping for training jobs launched by the hyperparameter tuning job. This can be one of the following values (the default value is OFF):  OFF  Training jobs launched by the hyperparameter tuning job do not use early stopping.  AUTO  Amazon SageMaker stops training jobs launched by the hyperparameter tuning job when they are unlikely to perform better than previously completed training jobs. For more information, see Stop Training Jobs Early.  
     */
    TrainingJobEarlyStoppingType?: TrainingJobEarlyStoppingType;
    /**
     * The tuning job's completion criteria.
     */
    TuningJobCompletionCriteria?: TuningJobCompletionCriteria;
  }
  export type HyperParameterTuningJobName = string;
  export interface HyperParameterTuningJobObjective {
    /**
     * Whether to minimize or maximize the objective metric.
     */
    Type: HyperParameterTuningJobObjectiveType;
    /**
     * The name of the metric to use for the objective metric.
     */
    MetricName: MetricName;
  }
  export type HyperParameterTuningJobObjectiveType = "Maximize"|"Minimize"|string;
  export type HyperParameterTuningJobObjectives = HyperParameterTuningJobObjective[];
  export type HyperParameterTuningJobSortByOptions = "Name"|"Status"|"CreationTime"|string;
  export type HyperParameterTuningJobStatus = "Completed"|"InProgress"|"Failed"|"Stopped"|"Stopping"|string;
  export type HyperParameterTuningJobStrategyType = "Bayesian"|"Random"|string;
  export type HyperParameterTuningJobSummaries = HyperParameterTuningJobSummary[];
  export interface HyperParameterTuningJobSummary {
    /**
     * The name of the tuning job.
     */
    HyperParameterTuningJobName: HyperParameterTuningJobName;
    /**
     * The Amazon Resource Name (ARN) of the tuning job.
     */
    HyperParameterTuningJobArn: HyperParameterTuningJobArn;
    /**
     * The status of the tuning job.
     */
    HyperParameterTuningJobStatus: HyperParameterTuningJobStatus;
    /**
     * Specifies the search strategy hyperparameter tuning uses to choose which hyperparameters to use for each iteration. Currently, the only valid value is Bayesian.
     */
    Strategy: HyperParameterTuningJobStrategyType;
    /**
     * The date and time that the tuning job was created.
     */
    CreationTime: Timestamp;
    /**
     * The date and time that the tuning job ended.
     */
    HyperParameterTuningEndTime?: Timestamp;
    /**
     * The date and time that the tuning job was modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The TrainingJobStatusCounters object that specifies the numbers of training jobs, categorized by status, that this tuning job launched.
     */
    TrainingJobStatusCounters: TrainingJobStatusCounters;
    /**
     * The ObjectiveStatusCounters object that specifies the numbers of training jobs, categorized by objective metric status, that this tuning job launched.
     */
    ObjectiveStatusCounters: ObjectiveStatusCounters;
    /**
     * The ResourceLimits object that specifies the maximum number of training jobs and parallel training jobs allowed for this tuning job.
     */
    ResourceLimits?: ResourceLimits;
  }
  export interface HyperParameterTuningJobWarmStartConfig {
    /**
     * An array of hyperparameter tuning jobs that are used as the starting point for the new hyperparameter tuning job. For more information about warm starting a hyperparameter tuning job, see Using a Previous Hyperparameter Tuning Job as a Starting Point. Hyperparameter tuning jobs created before October 1, 2018 cannot be used as parent jobs for warm start tuning jobs.
     */
    ParentHyperParameterTuningJobs: ParentHyperParameterTuningJobs;
    /**
     * Specifies one of the following:  IDENTICAL_DATA_AND_ALGORITHM  The new hyperparameter tuning job uses the same input data and training image as the parent tuning jobs. You can change the hyperparameter ranges to search and the maximum number of training jobs that the hyperparameter tuning job launches. You cannot use a new version of the training algorithm, unless the changes in the new version do not affect the algorithm itself. For example, changes that improve logging or adding support for a different data format are allowed. You can also change hyperparameters from tunable to static, and from static to tunable, but the total number of static plus tunable hyperparameters must remain the same as it is in all parent jobs. The objective metric for the new tuning job must be the same as for all parent jobs.  TRANSFER_LEARNING  The new hyperparameter tuning job can include input data, hyperparameter ranges, maximum number of concurrent training jobs, and maximum number of training jobs that are different than those of its parent hyperparameter tuning jobs. The training image can also be a different version from the version used in the parent hyperparameter tuning job. You can also change hyperparameters from tunable to static, and from static to tunable, but the total number of static plus tunable hyperparameters must remain the same as it is in all parent jobs. The objective metric for the new tuning job must be the same as for all parent jobs.  
     */
    WarmStartType: HyperParameterTuningJobWarmStartType;
  }
  export type HyperParameterTuningJobWarmStartType = "IdenticalDataAndAlgorithm"|"TransferLearning"|string;
  export type HyperParameterValue = string;
  export type HyperParameters = {[key: string]: HyperParameterValue};
  export type IdempotencyToken = string;
  export interface Image {
    /**
     * When the image was created.
     */
    CreationTime: Timestamp;
    /**
     * The description of the image.
     */
    Description?: ImageDescription;
    /**
     * The name of the image as displayed.
     */
    DisplayName?: ImageDisplayName;
    /**
     * When a create, update, or delete operation fails, the reason for the failure.
     */
    FailureReason?: FailureReason;
    /**
     * The Amazon Resource Name (ARN) of the image.
     */
    ImageArn: ImageArn;
    /**
     * The name of the image.
     */
    ImageName: ImageName;
    /**
     * The status of the image.
     */
    ImageStatus: ImageStatus;
    /**
     * When the image was last modified.
     */
    LastModifiedTime: Timestamp;
  }
  export type ImageArn = string;
  export type ImageBaseImage = string;
  export interface ImageConfig {
    /**
     * Set this to one of the following values:    Platform - The model image is hosted in Amazon ECR.    Vpc - The model image is hosted in a private Docker registry in your VPC.  
     */
    RepositoryAccessMode: RepositoryAccessMode;
    /**
     * (Optional) Specifies an authentication configuration for the private docker registry where your model image is hosted. Specify a value for this property only if you specified Vpc as the value for the RepositoryAccessMode field, and the private Docker registry where the model image is hosted requires authentication.
     */
    RepositoryAuthConfig?: RepositoryAuthConfig;
  }
  export type ImageContainerImage = string;
  export type ImageDeleteProperty = string;
  export type ImageDeletePropertyList = ImageDeleteProperty[];
  export type ImageDescription = string;
  export type ImageDigest = string;
  export type ImageDisplayName = string;
  export type ImageName = string;
  export type ImageNameContains = string;
  export type ImageSortBy = "CREATION_TIME"|"LAST_MODIFIED_TIME"|"IMAGE_NAME"|string;
  export type ImageSortOrder = "ASCENDING"|"DESCENDING"|string;
  export type ImageStatus = "CREATING"|"CREATED"|"CREATE_FAILED"|"UPDATING"|"UPDATE_FAILED"|"DELETING"|"DELETE_FAILED"|string;
  export type ImageUri = string;
  export interface ImageVersion {
    /**
     * When the version was created.
     */
    CreationTime: Timestamp;
    /**
     * When a create or delete operation fails, the reason for the failure.
     */
    FailureReason?: FailureReason;
    /**
     * The Amazon Resource Name (ARN) of the image the version is based on.
     */
    ImageArn: ImageArn;
    /**
     * The ARN of the version.
     */
    ImageVersionArn: ImageVersionArn;
    /**
     * The status of the version.
     */
    ImageVersionStatus: ImageVersionStatus;
    /**
     * When the version was last modified.
     */
    LastModifiedTime: Timestamp;
    /**
     * The version number.
     */
    Version: ImageVersionNumber;
  }
  export type ImageVersionArn = string;
  export type ImageVersionNumber = number;
  export type ImageVersionSortBy = "CREATION_TIME"|"LAST_MODIFIED_TIME"|"VERSION"|string;
  export type ImageVersionSortOrder = "ASCENDING"|"DESCENDING"|string;
  export type ImageVersionStatus = "CREATING"|"CREATED"|"CREATE_FAILED"|"DELETING"|"DELETE_FAILED"|string;
  export type ImageVersions = ImageVersion[];
  export type Images = Image[];
  export interface InferenceExecutionConfig {
    /**
     * How containers in a multi-container are run. The following values are valid.    SERIAL - Containers run as a serial pipeline.    DIRECT - Only the individual container that you specify is run.  
     */
    Mode: InferenceExecutionMode;
  }
  export type InferenceExecutionMode = "Serial"|"Direct"|string;
  export type InferenceImage = string;
  export interface InferenceSpecification {
    /**
     * The Amazon ECR registry path of the Docker image that contains the inference code.
     */
    Containers: ModelPackageContainerDefinitionList;
    /**
     * A list of the instance types on which a transformation job can be run or on which an endpoint can be deployed. This parameter is required for unversioned models, and optional for versioned models.
     */
    SupportedTransformInstanceTypes?: TransformInstanceTypes;
    /**
     * A list of the instance types that are used to generate inferences in real-time. This parameter is required for unversioned models, and optional for versioned models.
     */
    SupportedRealtimeInferenceInstanceTypes?: RealtimeInferenceInstanceTypes;
    /**
     * The supported MIME types for the input data.
     */
    SupportedContentTypes: ContentTypes;
    /**
     * The supported MIME types for the output data.
     */
    SupportedResponseMIMETypes: ResponseMIMETypes;
  }
  export type InitialTaskCount = number;
  export interface InputConfig {
    /**
     * The S3 path where the model artifacts, which result from model training, are stored. This path must point to a single gzip compressed tar archive (.tar.gz suffix).
     */
    S3Uri: S3Uri;
    /**
     * Specifies the name and shape of the expected data inputs for your trained model with a JSON dictionary form. The data inputs are InputConfig$Framework specific.     TensorFlow: You must specify the name and shape (NHWC format) of the expected data inputs using a dictionary format for your trained model. The dictionary formats required for the console and CLI are different.   Examples for one input:   If using the console, {"input":[1,1024,1024,3]}    If using the CLI, {\"input\":[1,1024,1024,3]}      Examples for two inputs:   If using the console, {"data1": [1,28,28,1], "data2":[1,28,28,1]}    If using the CLI, {\"data1\": [1,28,28,1], \"data2\":[1,28,28,1]}         KERAS: You must specify the name and shape (NCHW format) of expected data inputs using a dictionary format for your trained model. Note that while Keras model artifacts should be uploaded in NHWC (channel-last) format, DataInputConfig should be specified in NCHW (channel-first) format. The dictionary formats required for the console and CLI are different.   Examples for one input:   If using the console, {"input_1":[1,3,224,224]}    If using the CLI, {\"input_1\":[1,3,224,224]}      Examples for two inputs:   If using the console, {"input_1": [1,3,224,224], "input_2":[1,3,224,224]}     If using the CLI, {\"input_1\": [1,3,224,224], \"input_2\":[1,3,224,224]}         MXNET/ONNX/DARKNET: You must specify the name and shape (NCHW format) of the expected data inputs in order using a dictionary format for your trained model. The dictionary formats required for the console and CLI are different.   Examples for one input:   If using the console, {"data":[1,3,1024,1024]}    If using the CLI, {\"data\":[1,3,1024,1024]}      Examples for two inputs:   If using the console, {"var1": [1,1,28,28], "var2":[1,1,28,28]}     If using the CLI, {\"var1\": [1,1,28,28], \"var2\":[1,1,28,28]}         PyTorch: You can either specify the name and shape (NCHW format) of expected data inputs in order using a dictionary format for your trained model or you can specify the shape only using a list format. The dictionary formats required for the console and CLI are different. The list formats for the console and CLI are the same.   Examples for one input in dictionary format:   If using the console, {"input0":[1,3,224,224]}    If using the CLI, {\"input0\":[1,3,224,224]}      Example for one input in list format: [[1,3,224,224]]    Examples for two inputs in dictionary format:   If using the console, {"input0":[1,3,224,224], "input1":[1,3,224,224]}    If using the CLI, {\"input0\":[1,3,224,224], \"input1\":[1,3,224,224]}       Example for two inputs in list format: [[1,3,224,224], [1,3,224,224]]       XGBOOST: input data name and shape are not needed.    DataInputConfig supports the following parameters for CoreML OutputConfig$TargetDevice (ML Model format):    shape: Input shape, for example {"input_1": {"shape": [1,224,224,3]}}. In addition to static input shapes, CoreML converter supports Flexible input shapes:   Range Dimension. You can use the Range Dimension feature if you know the input shape will be within some specific interval in that dimension, for example: {"input_1": {"shape": ["1..10", 224, 224, 3]}}    Enumerated shapes. Sometimes, the models are trained to work only on a select set of inputs. You can enumerate all supported input shapes, for example: {"input_1": {"shape": [[1, 224, 224, 3], [1, 160, 160, 3]]}}       default_shape: Default input shape. You can set a default shape during conversion for both Range Dimension and Enumerated Shapes. For example {"input_1": {"shape": ["1..10", 224, 224, 3], "default_shape": [1, 224, 224, 3]}}     type: Input type. Allowed values: Image and Tensor. By default, the converter generates an ML Model with inputs of type Tensor (MultiArray). User can set input type to be Image. Image input type requires additional input parameters such as bias and scale.    bias: If the input type is an Image, you need to provide the bias vector.    scale: If the input type is an Image, you need to provide a scale factor.   CoreML ClassifierConfig parameters can be specified using OutputConfig$CompilerOptions. CoreML converter supports Tensorflow and PyTorch models. CoreML conversion examples:   Tensor type input:    "DataInputConfig": {"input_1": {"shape": [[1,224,224,3], [1,160,160,3]], "default_shape": [1,224,224,3]}}      Tensor type input without input name (PyTorch):    "DataInputConfig": [{"shape": [[1,3,224,224], [1,3,160,160]], "default_shape": [1,3,224,224]}]      Image type input:    "DataInputConfig": {"input_1": {"shape": [[1,224,224,3], [1,160,160,3]], "default_shape": [1,224,224,3], "type": "Image", "bias": [-1,-1,-1], "scale": 0.007843137255}}     "CompilerOptions": {"class_labels": "imagenet_labels_1000.txt"}      Image type input without input name (PyTorch):    "DataInputConfig": [{"shape": [[1,3,224,224], [1,3,160,160]], "default_shape": [1,3,224,224], "type": "Image", "bias": [-1,-1,-1], "scale": 0.007843137255}]     "CompilerOptions": {"class_labels": "imagenet_labels_1000.txt"}      Depending on the model format, DataInputConfig requires the following parameters for ml_eia2 OutputConfig:TargetDevice.   For TensorFlow models saved in the SavedModel format, specify the input names from signature_def_key and the input model shapes for DataInputConfig. Specify the signature_def_key in  OutputConfig:CompilerOptions  if the model does not use TensorFlow's default signature def key. For example:    "DataInputConfig": {"inputs": [1, 224, 224, 3]}     "CompilerOptions": {"signature_def_key": "serving_custom"}      For TensorFlow models saved as a frozen graph, specify the input tensor names and shapes in DataInputConfig and the output tensor names for output_names in  OutputConfig:CompilerOptions . For example:    "DataInputConfig": {"input_tensor:0": [1, 224, 224, 3]}     "CompilerOptions": {"output_names": ["output_tensor:0"]}     
     */
    DataInputConfig: DataInputConfig;
    /**
     * Identifies the framework in which the model was trained. For example: TENSORFLOW.
     */
    Framework: Framework;
    /**
     * Specifies the framework version to use. This API field is only supported for PyTorch framework versions 1.4, 1.5, and 1.6 for cloud instance target devices: ml_c4, ml_c5, ml_m4, ml_m5, ml_p2, ml_p3, and ml_g4dn.
     */
    FrameworkVersion?: FrameworkVersion;
  }
  export type InputDataConfig = Channel[];
  export type InputMode = "Pipe"|"File"|string;
  export type InputModes = TrainingInputMode[];
  export type InstanceType = "ml.t2.medium"|"ml.t2.large"|"ml.t2.xlarge"|"ml.t2.2xlarge"|"ml.t3.medium"|"ml.t3.large"|"ml.t3.xlarge"|"ml.t3.2xlarge"|"ml.m4.xlarge"|"ml.m4.2xlarge"|"ml.m4.4xlarge"|"ml.m4.10xlarge"|"ml.m4.16xlarge"|"ml.m5.xlarge"|"ml.m5.2xlarge"|"ml.m5.4xlarge"|"ml.m5.12xlarge"|"ml.m5.24xlarge"|"ml.m5d.large"|"ml.m5d.xlarge"|"ml.m5d.2xlarge"|"ml.m5d.4xlarge"|"ml.m5d.8xlarge"|"ml.m5d.12xlarge"|"ml.m5d.16xlarge"|"ml.m5d.24xlarge"|"ml.c4.xlarge"|"ml.c4.2xlarge"|"ml.c4.4xlarge"|"ml.c4.8xlarge"|"ml.c5.xlarge"|"ml.c5.2xlarge"|"ml.c5.4xlarge"|"ml.c5.9xlarge"|"ml.c5.18xlarge"|"ml.c5d.xlarge"|"ml.c5d.2xlarge"|"ml.c5d.4xlarge"|"ml.c5d.9xlarge"|"ml.c5d.18xlarge"|"ml.p2.xlarge"|"ml.p2.8xlarge"|"ml.p2.16xlarge"|"ml.p3.2xlarge"|"ml.p3.8xlarge"|"ml.p3.16xlarge"|"ml.p3dn.24xlarge"|"ml.g4dn.xlarge"|"ml.g4dn.2xlarge"|"ml.g4dn.4xlarge"|"ml.g4dn.8xlarge"|"ml.g4dn.12xlarge"|"ml.g4dn.16xlarge"|"ml.r5.large"|"ml.r5.xlarge"|"ml.r5.2xlarge"|"ml.r5.4xlarge"|"ml.r5.8xlarge"|"ml.r5.12xlarge"|"ml.r5.16xlarge"|"ml.r5.24xlarge"|string;
  export type Integer = number;
  export interface IntegerParameterRange {
    /**
     * The name of the hyperparameter to search.
     */
    Name: ParameterKey;
    /**
     * The minimum value of the hyperparameter to search.
     */
    MinValue: ParameterValue;
    /**
     * The maximum value of the hyperparameter to search.
     */
    MaxValue: ParameterValue;
    /**
     * The scale that hyperparameter tuning uses to search the hyperparameter range. For information about choosing a hyperparameter scale, see Hyperparameter Scaling. One of the following values:  Auto  Amazon SageMaker hyperparameter tuning chooses the best scale for the hyperparameter.  Linear  Hyperparameter tuning searches the values in the hyperparameter range by using a linear scale.  Logarithmic  Hyperparameter tuning searches the values in the hyperparameter range by using a logarithmic scale. Logarithmic scaling works only for ranges that have only values greater than 0.  
     */
    ScalingType?: HyperParameterScalingType;
  }
  export interface IntegerParameterRangeSpecification {
    /**
     * The minimum integer value allowed.
     */
    MinValue: ParameterValue;
    /**
     * The maximum integer value allowed.
     */
    MaxValue: ParameterValue;
  }
  export type IntegerParameterRanges = IntegerParameterRange[];
  export type InvocationsMaxRetries = number;
  export type InvocationsTimeoutInSeconds = number;
  export type IotRoleAlias = string;
  export type JobReferenceCode = string;
  export type JobReferenceCodeContains = string;
  export type JoinSource = "Input"|"None"|string;
  export type JsonContentType = string;
  export type JsonContentTypes = JsonContentType[];
  export type JsonPath = string;
  export interface JupyterServerAppSettings {
    /**
     * The default instance type and the Amazon Resource Name (ARN) of the default SageMaker image used by the JupyterServer app.
     */
    DefaultResourceSpec?: ResourceSpec;
    /**
     *  The Amazon Resource Name (ARN) of the Lifecycle Configurations attached to the JupyterServerApp.
     */
    LifecycleConfigArns?: LifecycleConfigArns;
  }
  export type KernelDisplayName = string;
  export interface KernelGatewayAppSettings {
    /**
     * The default instance type and the Amazon Resource Name (ARN) of the default SageMaker image used by the KernelGateway app.
     */
    DefaultResourceSpec?: ResourceSpec;
    /**
     * A list of custom SageMaker images that are configured to run as a KernelGateway app.
     */
    CustomImages?: CustomImages;
    /**
     *  The Amazon Resource Name (ARN) of the Lifecycle Configurations attached to the the user profile or domain.
     */
    LifecycleConfigArns?: LifecycleConfigArns;
  }
  export interface KernelGatewayImageConfig {
    /**
     * The specification of the Jupyter kernels in the image.
     */
    KernelSpecs: KernelSpecs;
    /**
     * The Amazon Elastic File System (EFS) storage configuration for a SageMaker image.
     */
    FileSystemConfig?: FileSystemConfig;
  }
  export type KernelName = string;
  export interface KernelSpec {
    /**
     * The name of the Jupyter kernel in the image. This value is case sensitive.
     */
    Name: KernelName;
    /**
     * The display name of the kernel.
     */
    DisplayName?: KernelDisplayName;
  }
  export type KernelSpecs = KernelSpec[];
  export type KmsKeyId = string;
  export type LabelAttributeName = string;
  export type LabelCounter = number;
  export interface LabelCounters {
    /**
     * The total number of objects labeled.
     */
    TotalLabeled?: LabelCounter;
    /**
     * The total number of objects labeled by a human worker.
     */
    HumanLabeled?: LabelCounter;
    /**
     * The total number of objects labeled by automated data labeling.
     */
    MachineLabeled?: LabelCounter;
    /**
     * The total number of objects that could not be labeled due to an error.
     */
    FailedNonRetryableError?: LabelCounter;
    /**
     * The total number of objects not yet labeled.
     */
    Unlabeled?: LabelCounter;
  }
  export interface LabelCountersForWorkteam {
    /**
     * The total number of data objects labeled by a human worker.
     */
    HumanLabeled?: LabelCounter;
    /**
     * The total number of data objects that need to be labeled by a human worker.
     */
    PendingHuman?: LabelCounter;
    /**
     * The total number of tasks in the labeling job.
     */
    Total?: LabelCounter;
  }
  export type LabelingJobAlgorithmSpecificationArn = string;
  export interface LabelingJobAlgorithmsConfig {
    /**
     * Specifies the Amazon Resource Name (ARN) of the algorithm used for auto-labeling. You must select one of the following ARNs:    Image classification   arn:aws:sagemaker:region:027400017018:labeling-job-algorithm-specification/image-classification     Text classification   arn:aws:sagemaker:region:027400017018:labeling-job-algorithm-specification/text-classification     Object detection   arn:aws:sagemaker:region:027400017018:labeling-job-algorithm-specification/object-detection     Semantic Segmentation   arn:aws:sagemaker:region:027400017018:labeling-job-algorithm-specification/semantic-segmentation   
     */
    LabelingJobAlgorithmSpecificationArn: LabelingJobAlgorithmSpecificationArn;
    /**
     * At the end of an auto-label job Ground Truth sends the Amazon Resource Name (ARN) of the final model used for auto-labeling. You can use this model as the starting point for subsequent similar jobs by providing the ARN of the model here. 
     */
    InitialActiveLearningModelArn?: ModelArn;
    /**
     * Provides configuration information for a labeling job.
     */
    LabelingJobResourceConfig?: LabelingJobResourceConfig;
  }
  export type LabelingJobArn = string;
  export interface LabelingJobDataAttributes {
    /**
     * Declares that your content is free of personally identifiable information or adult content. Amazon SageMaker may restrict the Amazon Mechanical Turk workers that can view your task based on this information.
     */
    ContentClassifiers?: ContentClassifiers;
  }
  export interface LabelingJobDataSource {
    /**
     * The Amazon S3 location of the input data objects.
     */
    S3DataSource?: LabelingJobS3DataSource;
    /**
     * An Amazon SNS data source used for streaming labeling jobs. To learn more, see Send Data to a Streaming Labeling Job. 
     */
    SnsDataSource?: LabelingJobSnsDataSource;
  }
  export interface LabelingJobForWorkteamSummary {
    /**
     * The name of the labeling job that the work team is assigned to.
     */
    LabelingJobName?: LabelingJobName;
    /**
     * A unique identifier for a labeling job. You can use this to refer to a specific labeling job.
     */
    JobReferenceCode: JobReferenceCode;
    /**
     * The Amazon Web Services account ID of the account used to start the labeling job.
     */
    WorkRequesterAccountId: AccountId;
    /**
     * The date and time that the labeling job was created.
     */
    CreationTime: Timestamp;
    /**
     * Provides information about the progress of a labeling job.
     */
    LabelCounters?: LabelCountersForWorkteam;
    /**
     * The configured number of workers per data object.
     */
    NumberOfHumanWorkersPerDataObject?: NumberOfHumanWorkersPerDataObject;
  }
  export type LabelingJobForWorkteamSummaryList = LabelingJobForWorkteamSummary[];
  export interface LabelingJobInputConfig {
    /**
     * The location of the input data.
     */
    DataSource: LabelingJobDataSource;
    /**
     * Attributes of the data specified by the customer.
     */
    DataAttributes?: LabelingJobDataAttributes;
  }
  export type LabelingJobName = string;
  export interface LabelingJobOutput {
    /**
     * The Amazon S3 bucket location of the manifest file for labeled data. 
     */
    OutputDatasetS3Uri: S3Uri;
    /**
     * The Amazon Resource Name (ARN) for the most recent Amazon SageMaker model trained as part of automated data labeling. 
     */
    FinalActiveLearningModelArn?: ModelArn;
  }
  export interface LabelingJobOutputConfig {
    /**
     * The Amazon S3 location to write output data.
     */
    S3OutputPath: S3Uri;
    /**
     * The Amazon Web Services Key Management Service ID of the key used to encrypt the output data, if any. If you provide your own KMS key ID, you must add the required permissions to your KMS key described in Encrypt Output Data and Storage Volume with Amazon Web Services KMS. If you don't provide a KMS key ID, Amazon SageMaker uses the default Amazon Web Services KMS key for Amazon S3 for your role's account to encrypt your output data. If you use a bucket policy with an s3:PutObject permission that only allows objects with server-side encryption, set the condition key of s3:x-amz-server-side-encryption to "aws:kms". For more information, see KMS-Managed Encryption Keys in the Amazon Simple Storage Service Developer Guide. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * An Amazon Simple Notification Service (Amazon SNS) output topic ARN. Provide a SnsTopicArn if you want to do real time chaining to another streaming job and receive an Amazon SNS notifications each time a data object is submitted by a worker. If you provide an SnsTopicArn in OutputConfig, when workers complete labeling tasks, Ground Truth will send labeling task output data to the SNS output topic you specify here.  To learn more, see Receive Output Data from a Streaming Labeling Job. 
     */
    SnsTopicArn?: SnsTopicArn;
  }
  export interface LabelingJobResourceConfig {
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt data on the storage volume attached to the ML compute instance(s) that run the training and inference jobs used for automated data labeling.  You can only specify a VolumeKmsKeyId when you create a labeling job with automated data labeling enabled using the API operation CreateLabelingJob. You cannot specify an Amazon Web Services KMS key to encrypt the storage volume used for automated data labeling model training and inference when you create a labeling job using the console. To learn more, see Output Data and Storage Volume Encryption. The VolumeKmsKeyId can be any of the following formats:   KMS Key ID  "1234abcd-12ab-34cd-56ef-1234567890ab"    Amazon Resource Name (ARN) of a KMS Key  "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
  }
  export interface LabelingJobS3DataSource {
    /**
     * The Amazon S3 location of the manifest file that describes the input data objects.  The input manifest file referenced in ManifestS3Uri must contain one of the following keys: source-ref or source. The value of the keys are interpreted as follows:    source-ref: The source of the object is the Amazon S3 object specified in the value. Use this value when the object is a binary object, such as an image.    source: The source of the object is the value. Use this value when the object is a text value.   If you are a new user of Ground Truth, it is recommended you review Use an Input Manifest File  in the Amazon SageMaker Developer Guide to learn how to create an input manifest file.
     */
    ManifestS3Uri: S3Uri;
  }
  export interface LabelingJobSnsDataSource {
    /**
     * The Amazon SNS input topic Amazon Resource Name (ARN). Specify the ARN of the input topic you will use to send new data objects to a streaming labeling job.
     */
    SnsTopicArn: SnsTopicArn;
  }
  export type LabelingJobStatus = "Initializing"|"InProgress"|"Completed"|"Failed"|"Stopping"|"Stopped"|string;
  export interface LabelingJobStoppingConditions {
    /**
     * The maximum number of objects that can be labeled by human workers.
     */
    MaxHumanLabeledObjectCount?: MaxHumanLabeledObjectCount;
    /**
     * The maximum number of input data objects that should be labeled.
     */
    MaxPercentageOfInputDatasetLabeled?: MaxPercentageOfInputDatasetLabeled;
  }
  export interface LabelingJobSummary {
    /**
     * The name of the labeling job.
     */
    LabelingJobName: LabelingJobName;
    /**
     * The Amazon Resource Name (ARN) assigned to the labeling job when it was created.
     */
    LabelingJobArn: LabelingJobArn;
    /**
     * The date and time that the job was created (timestamp).
     */
    CreationTime: Timestamp;
    /**
     * The date and time that the job was last modified (timestamp).
     */
    LastModifiedTime: Timestamp;
    /**
     * The current status of the labeling job. 
     */
    LabelingJobStatus: LabelingJobStatus;
    /**
     * Counts showing the progress of the labeling job.
     */
    LabelCounters: LabelCounters;
    /**
     * The Amazon Resource Name (ARN) of the work team assigned to the job.
     */
    WorkteamArn: WorkteamArn;
    /**
     * The Amazon Resource Name (ARN) of a Lambda function. The function is run before each data object is sent to a worker.
     */
    PreHumanTaskLambdaArn: LambdaFunctionArn;
    /**
     * The Amazon Resource Name (ARN) of the Lambda function used to consolidate the annotations from individual workers into a label for a data object. For more information, see Annotation Consolidation.
     */
    AnnotationConsolidationLambdaArn?: LambdaFunctionArn;
    /**
     * If the LabelingJobStatus field is Failed, this field contains a description of the error.
     */
    FailureReason?: FailureReason;
    /**
     * The location of the output produced by the labeling job.
     */
    LabelingJobOutput?: LabelingJobOutput;
    /**
     * Input configuration for the labeling job.
     */
    InputConfig?: LabelingJobInputConfig;
  }
  export type LabelingJobSummaryList = LabelingJobSummary[];
  export type LambdaFunctionArn = string;
  export interface LambdaStepMetadata {
    /**
     * The Amazon Resource Name (ARN) of the Lambda function that was run by this step execution.
     */
    Arn?: String256;
    /**
     * A list of the output parameters of the Lambda step.
     */
    OutputParameters?: OutputParameterList;
  }
  export type LastModifiedTime = Date;
  export type LifecycleConfigArns = StudioLifecycleConfigArn[];
  export type LineageEntityParameters = {[key: string]: StringParameterValue};
  export interface ListActionsRequest {
    /**
     * A filter that returns only actions with the specified source URI.
     */
    SourceUri?: SourceUri;
    /**
     * A filter that returns only actions of the specified type.
     */
    ActionType?: String256;
    /**
     * A filter that returns only actions created on or after the specified time.
     */
    CreatedAfter?: Timestamp;
    /**
     * A filter that returns only actions created on or before the specified time.
     */
    CreatedBefore?: Timestamp;
    /**
     * The property used to sort results. The default value is CreationTime.
     */
    SortBy?: SortActionsBy;
    /**
     * The sort order. The default value is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * If the previous call to ListActions didn't return the full set of actions, the call returns a token for getting the next set of actions.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of actions to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
  }
  export interface ListActionsResponse {
    /**
     * A list of actions and their properties.
     */
    ActionSummaries?: ActionSummaries;
    /**
     * A token for getting the next set of actions, if there are any.
     */
    NextToken?: NextToken;
  }
  export interface ListAlgorithmsInput {
    /**
     * A filter that returns only algorithms created after the specified time (timestamp).
     */
    CreationTimeAfter?: CreationTime;
    /**
     * A filter that returns only algorithms created before the specified time (timestamp).
     */
    CreationTimeBefore?: CreationTime;
    /**
     * The maximum number of algorithms to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A string in the algorithm name. This filter returns only algorithms whose name contains the specified string.
     */
    NameContains?: NameContains;
    /**
     * If the response to a previous ListAlgorithms request was truncated, the response includes a NextToken. To retrieve the next set of algorithms, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The parameter by which to sort the results. The default is CreationTime.
     */
    SortBy?: AlgorithmSortBy;
    /**
     * The sort order for the results. The default is Ascending.
     */
    SortOrder?: SortOrder;
  }
  export interface ListAlgorithmsOutput {
    /**
     * &gt;An array of AlgorithmSummary objects, each of which lists an algorithm.
     */
    AlgorithmSummaryList: AlgorithmSummaryList;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of algorithms, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export interface ListAppImageConfigsRequest {
    /**
     * The maximum number of AppImageConfigs to return in the response. The default value is 10. 
     */
    MaxResults?: MaxResults;
    /**
     * If the previous call to ListImages didn't return the full set of AppImageConfigs, the call returns a token for getting the next set of AppImageConfigs.
     */
    NextToken?: NextToken;
    /**
     * A filter that returns only AppImageConfigs whose name contains the specified string.
     */
    NameContains?: AppImageConfigName;
    /**
     * A filter that returns only AppImageConfigs created on or before the specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only AppImageConfigs created on or after the specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only AppImageConfigs modified on or before the specified time.
     */
    ModifiedTimeBefore?: Timestamp;
    /**
     * A filter that returns only AppImageConfigs modified on or after the specified time.
     */
    ModifiedTimeAfter?: Timestamp;
    /**
     * The property used to sort results. The default value is CreationTime.
     */
    SortBy?: AppImageConfigSortKey;
    /**
     * The sort order. The default value is Descending.
     */
    SortOrder?: SortOrder;
  }
  export interface ListAppImageConfigsResponse {
    /**
     * A token for getting the next set of AppImageConfigs, if there are any.
     */
    NextToken?: NextToken;
    /**
     * A list of AppImageConfigs and their properties.
     */
    AppImageConfigs?: AppImageConfigList;
  }
  export interface ListAppsRequest {
    /**
     * If the previous response was truncated, you will receive this token. Use it in your next request to receive the next set of results.
     */
    NextToken?: NextToken;
    /**
     * Returns a list up to a specified limit.
     */
    MaxResults?: MaxResults;
    /**
     * The sort order for the results. The default is Ascending.
     */
    SortOrder?: SortOrder;
    /**
     * The parameter by which to sort the results. The default is CreationTime.
     */
    SortBy?: AppSortKey;
    /**
     * A parameter to search for the domain ID.
     */
    DomainIdEquals?: DomainId;
    /**
     * A parameter to search by user profile name.
     */
    UserProfileNameEquals?: UserProfileName;
  }
  export interface ListAppsResponse {
    /**
     * The list of apps.
     */
    Apps?: AppList;
    /**
     * If the previous response was truncated, you will receive this token. Use it in your next request to receive the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListArtifactsRequest {
    /**
     * A filter that returns only artifacts with the specified source URI.
     */
    SourceUri?: SourceUri;
    /**
     * A filter that returns only artifacts of the specified type.
     */
    ArtifactType?: String256;
    /**
     * A filter that returns only artifacts created on or after the specified time.
     */
    CreatedAfter?: Timestamp;
    /**
     * A filter that returns only artifacts created on or before the specified time.
     */
    CreatedBefore?: Timestamp;
    /**
     * The property used to sort results. The default value is CreationTime.
     */
    SortBy?: SortArtifactsBy;
    /**
     * The sort order. The default value is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * If the previous call to ListArtifacts didn't return the full set of artifacts, the call returns a token for getting the next set of artifacts.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of artifacts to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
  }
  export interface ListArtifactsResponse {
    /**
     * A list of artifacts and their properties.
     */
    ArtifactSummaries?: ArtifactSummaries;
    /**
     * A token for getting the next set of artifacts, if there are any.
     */
    NextToken?: NextToken;
  }
  export interface ListAssociationsRequest {
    /**
     * A filter that returns only associations with the specified source ARN.
     */
    SourceArn?: AssociationEntityArn;
    /**
     * A filter that returns only associations with the specified destination Amazon Resource Name (ARN).
     */
    DestinationArn?: AssociationEntityArn;
    /**
     * A filter that returns only associations with the specified source type.
     */
    SourceType?: String256;
    /**
     * A filter that returns only associations with the specified destination type.
     */
    DestinationType?: String256;
    /**
     * A filter that returns only associations of the specified type.
     */
    AssociationType?: AssociationEdgeType;
    /**
     * A filter that returns only associations created on or after the specified time.
     */
    CreatedAfter?: Timestamp;
    /**
     * A filter that returns only associations created on or before the specified time.
     */
    CreatedBefore?: Timestamp;
    /**
     * The property used to sort results. The default value is CreationTime.
     */
    SortBy?: SortAssociationsBy;
    /**
     * The sort order. The default value is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * If the previous call to ListAssociations didn't return the full set of associations, the call returns a token for getting the next set of associations.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of associations to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
  }
  export interface ListAssociationsResponse {
    /**
     * A list of associations and their properties.
     */
    AssociationSummaries?: AssociationSummaries;
    /**
     * A token for getting the next set of associations, if there are any.
     */
    NextToken?: NextToken;
  }
  export interface ListAutoMLJobsRequest {
    /**
     * Request a list of jobs, using a filter for time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * Request a list of jobs, using a filter for time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * Request a list of jobs, using a filter for time.
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * Request a list of jobs, using a filter for time.
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * Request a list of jobs, using a search filter for name.
     */
    NameContains?: AutoMLNameContains;
    /**
     * Request a list of jobs, using a filter for status.
     */
    StatusEquals?: AutoMLJobStatus;
    /**
     * The sort order for the results. The default is Descending.
     */
    SortOrder?: AutoMLSortOrder;
    /**
     * The parameter by which to sort the results. The default is Name.
     */
    SortBy?: AutoMLSortBy;
    /**
     * Request a list of jobs up to a specified limit.
     */
    MaxResults?: AutoMLMaxResults;
    /**
     * If the previous response was truncated, you receive this token. Use it in your next request to receive the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListAutoMLJobsResponse {
    /**
     * Returns a summary list of jobs.
     */
    AutoMLJobSummaries: AutoMLJobSummaries;
    /**
     * If the previous response was truncated, you receive this token. Use it in your next request to receive the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListCandidatesForAutoMLJobRequest {
    /**
     * List the candidates created for the job by providing the job's name.
     */
    AutoMLJobName: AutoMLJobName;
    /**
     * List the candidates for the job and filter by status.
     */
    StatusEquals?: CandidateStatus;
    /**
     * List the candidates for the job and filter by candidate name.
     */
    CandidateNameEquals?: CandidateName;
    /**
     * The sort order for the results. The default is Ascending.
     */
    SortOrder?: AutoMLSortOrder;
    /**
     * The parameter by which to sort the results. The default is Descending.
     */
    SortBy?: CandidateSortBy;
    /**
     * List the job's candidates up to a specified limit.
     */
    MaxResults?: AutoMLMaxResults;
    /**
     * If the previous response was truncated, you receive this token. Use it in your next request to receive the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListCandidatesForAutoMLJobResponse {
    /**
     * Summaries about the AutoMLCandidates.
     */
    Candidates: AutoMLCandidates;
    /**
     * If the previous response was truncated, you receive this token. Use it in your next request to receive the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListCodeRepositoriesInput {
    /**
     * A filter that returns only Git repositories that were created after the specified time.
     */
    CreationTimeAfter?: CreationTime;
    /**
     * A filter that returns only Git repositories that were created before the specified time.
     */
    CreationTimeBefore?: CreationTime;
    /**
     * A filter that returns only Git repositories that were last modified after the specified time.
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * A filter that returns only Git repositories that were last modified before the specified time.
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * The maximum number of Git repositories to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A string in the Git repositories name. This filter returns only repositories whose name contains the specified string.
     */
    NameContains?: CodeRepositoryNameContains;
    /**
     * If the result of a ListCodeRepositoriesOutput request was truncated, the response includes a NextToken. To get the next set of Git repositories, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The field to sort results by. The default is Name.
     */
    SortBy?: CodeRepositorySortBy;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: CodeRepositorySortOrder;
  }
  export interface ListCodeRepositoriesOutput {
    /**
     * Gets a list of summaries of the Git repositories. Each summary specifies the following values for the repository:    Name   Amazon Resource Name (ARN)   Creation time   Last modified time   Configuration information, including the URL location of the repository and the ARN of the Amazon Web Services Secrets Manager secret that contains the credentials used to access the repository.  
     */
    CodeRepositorySummaryList: CodeRepositorySummaryList;
    /**
     * If the result of a ListCodeRepositoriesOutput request was truncated, the response includes a NextToken. To get the next set of Git repositories, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListCompilationJobsRequest {
    /**
     * If the result of the previous ListCompilationJobs request was truncated, the response includes a NextToken. To retrieve the next set of model compilation jobs, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of model compilation jobs to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A filter that returns the model compilation jobs that were created after a specified time. 
     */
    CreationTimeAfter?: CreationTime;
    /**
     * A filter that returns the model compilation jobs that were created before a specified time.
     */
    CreationTimeBefore?: CreationTime;
    /**
     * A filter that returns the model compilation jobs that were modified after a specified time.
     */
    LastModifiedTimeAfter?: LastModifiedTime;
    /**
     * A filter that returns the model compilation jobs that were modified before a specified time.
     */
    LastModifiedTimeBefore?: LastModifiedTime;
    /**
     * A filter that returns the model compilation jobs whose name contains a specified string.
     */
    NameContains?: NameContains;
    /**
     * A filter that retrieves model compilation jobs with a specific DescribeCompilationJobResponse$CompilationJobStatus status.
     */
    StatusEquals?: CompilationJobStatus;
    /**
     * The field by which to sort results. The default is CreationTime.
     */
    SortBy?: ListCompilationJobsSortBy;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: SortOrder;
  }
  export interface ListCompilationJobsResponse {
    /**
     * An array of CompilationJobSummary objects, each describing a model compilation job. 
     */
    CompilationJobSummaries: CompilationJobSummaries;
    /**
     * If the response is truncated, Amazon SageMaker returns this NextToken. To retrieve the next set of model compilation jobs, use this token in the next request.
     */
    NextToken?: NextToken;
  }
  export type ListCompilationJobsSortBy = "Name"|"CreationTime"|"Status"|string;
  export interface ListContextsRequest {
    /**
     * A filter that returns only contexts with the specified source URI.
     */
    SourceUri?: SourceUri;
    /**
     * A filter that returns only contexts of the specified type.
     */
    ContextType?: String256;
    /**
     * A filter that returns only contexts created on or after the specified time.
     */
    CreatedAfter?: Timestamp;
    /**
     * A filter that returns only contexts created on or before the specified time.
     */
    CreatedBefore?: Timestamp;
    /**
     * The property used to sort results. The default value is CreationTime.
     */
    SortBy?: SortContextsBy;
    /**
     * The sort order. The default value is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * If the previous call to ListContexts didn't return the full set of contexts, the call returns a token for getting the next set of contexts.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of contexts to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
  }
  export interface ListContextsResponse {
    /**
     * A list of contexts and their properties.
     */
    ContextSummaries?: ContextSummaries;
    /**
     * A token for getting the next set of contexts, if there are any.
     */
    NextToken?: NextToken;
  }
  export interface ListDataQualityJobDefinitionsRequest {
    /**
     * A filter that lists the data quality job definitions associated with the specified endpoint.
     */
    EndpointName?: EndpointName;
    /**
     * The field to sort results by. The default is CreationTime.
     */
    SortBy?: MonitoringJobDefinitionSortKey;
    /**
     * The sort order for results. The default is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * If the result of the previous ListDataQualityJobDefinitions request was truncated, the response includes a NextToken. To retrieve the next set of transform jobs, use the token in the next request.&gt;
     */
    NextToken?: NextToken;
    /**
     * The maximum number of data quality monitoring job definitions to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A string in the data quality monitoring job definition name. This filter returns only data quality monitoring job definitions whose name contains the specified string.
     */
    NameContains?: NameContains;
    /**
     * A filter that returns only data quality monitoring job definitions created before the specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only data quality monitoring job definitions created after the specified time.
     */
    CreationTimeAfter?: Timestamp;
  }
  export interface ListDataQualityJobDefinitionsResponse {
    /**
     * A list of data quality monitoring job definitions.
     */
    JobDefinitionSummaries: MonitoringJobDefinitionSummaryList;
    /**
     * If the result of the previous ListDataQualityJobDefinitions request was truncated, the response includes a NextToken. To retrieve the next set of data quality monitoring job definitions, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListDeviceFleetsRequest {
    /**
     * The response from the last list when returning a list large enough to need tokening.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to select.
     */
    MaxResults?: ListMaxResults;
    /**
     * Filter fleets where packaging job was created after specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * Filter fleets where the edge packaging job was created before specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * Select fleets where the job was updated after X
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * Select fleets where the job was updated before X
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * Filter for fleets containing this name in their fleet device name.
     */
    NameContains?: NameContains;
    /**
     * The column to sort by.
     */
    SortBy?: ListDeviceFleetsSortBy;
    /**
     * What direction to sort in.
     */
    SortOrder?: SortOrder;
  }
  export interface ListDeviceFleetsResponse {
    /**
     * Summary of the device fleet.
     */
    DeviceFleetSummaries: DeviceFleetSummaries;
    /**
     * The response from the last list when returning a list large enough to need tokening.
     */
    NextToken?: NextToken;
  }
  export type ListDeviceFleetsSortBy = "NAME"|"CREATION_TIME"|"LAST_MODIFIED_TIME"|string;
  export interface ListDevicesRequest {
    /**
     * The response from the last list when returning a list large enough to need tokening.
     */
    NextToken?: NextToken;
    /**
     * Maximum number of results to select.
     */
    MaxResults?: ListMaxResults;
    /**
     * Select fleets where the job was updated after X
     */
    LatestHeartbeatAfter?: Timestamp;
    /**
     * A filter that searches devices that contains this name in any of their models.
     */
    ModelName?: EntityName;
    /**
     * Filter for fleets containing this name in their device fleet name.
     */
    DeviceFleetName?: EntityName;
  }
  export interface ListDevicesResponse {
    /**
     * Summary of devices.
     */
    DeviceSummaries: DeviceSummaries;
    /**
     * The response from the last list when returning a list large enough to need tokening.
     */
    NextToken?: NextToken;
  }
  export interface ListDomainsRequest {
    /**
     * If the previous response was truncated, you will receive this token. Use it in your next request to receive the next set of results.
     */
    NextToken?: NextToken;
    /**
     * Returns a list up to a specified limit.
     */
    MaxResults?: MaxResults;
  }
  export interface ListDomainsResponse {
    /**
     * The list of domains.
     */
    Domains?: DomainList;
    /**
     * If the previous response was truncated, you will receive this token. Use it in your next request to receive the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListEdgePackagingJobsRequest {
    /**
     * The response from the last list when returning a list large enough to need tokening.
     */
    NextToken?: NextToken;
    /**
     * Maximum number of results to select.
     */
    MaxResults?: ListMaxResults;
    /**
     * Select jobs where the job was created after specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * Select jobs where the job was created before specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * Select jobs where the job was updated after specified time.
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * Select jobs where the job was updated before specified time.
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * Filter for jobs containing this name in their packaging job name.
     */
    NameContains?: NameContains;
    /**
     * Filter for jobs where the model name contains this string.
     */
    ModelNameContains?: NameContains;
    /**
     * The job status to filter for.
     */
    StatusEquals?: EdgePackagingJobStatus;
    /**
     * Use to specify what column to sort by.
     */
    SortBy?: ListEdgePackagingJobsSortBy;
    /**
     * What direction to sort by.
     */
    SortOrder?: SortOrder;
  }
  export interface ListEdgePackagingJobsResponse {
    /**
     * Summaries of edge packaging jobs.
     */
    EdgePackagingJobSummaries: EdgePackagingJobSummaries;
    /**
     * Token to use when calling the next page of results.
     */
    NextToken?: NextToken;
  }
  export type ListEdgePackagingJobsSortBy = "NAME"|"MODEL_NAME"|"CREATION_TIME"|"LAST_MODIFIED_TIME"|"STATUS"|string;
  export interface ListEndpointConfigsInput {
    /**
     * The field to sort results by. The default is CreationTime.
     */
    SortBy?: EndpointConfigSortKey;
    /**
     * The sort order for results. The default is Descending.
     */
    SortOrder?: OrderKey;
    /**
     * If the result of the previous ListEndpointConfig request was truncated, the response includes a NextToken. To retrieve the next set of endpoint configurations, use the token in the next request. 
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of training jobs to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A string in the endpoint configuration name. This filter returns only endpoint configurations whose name contains the specified string. 
     */
    NameContains?: EndpointConfigNameContains;
    /**
     * A filter that returns only endpoint configurations created before the specified time (timestamp).
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only endpoint configurations with a creation time greater than or equal to the specified time (timestamp).
     */
    CreationTimeAfter?: Timestamp;
  }
  export interface ListEndpointConfigsOutput {
    /**
     * An array of endpoint configurations.
     */
    EndpointConfigs: EndpointConfigSummaryList;
    /**
     *  If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of endpoint configurations, use it in the subsequent request 
     */
    NextToken?: PaginationToken;
  }
  export interface ListEndpointsInput {
    /**
     * Sorts the list of results. The default is CreationTime.
     */
    SortBy?: EndpointSortKey;
    /**
     * The sort order for results. The default is Descending.
     */
    SortOrder?: OrderKey;
    /**
     * If the result of a ListEndpoints request was truncated, the response includes a NextToken. To retrieve the next set of endpoints, use the token in the next request.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of endpoints to return in the response. This value defaults to 10.
     */
    MaxResults?: MaxResults;
    /**
     * A string in endpoint names. This filter returns only endpoints whose name contains the specified string.
     */
    NameContains?: EndpointNameContains;
    /**
     * A filter that returns only endpoints that were created before the specified time (timestamp).
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only endpoints with a creation time greater than or equal to the specified time (timestamp).
     */
    CreationTimeAfter?: Timestamp;
    /**
     *  A filter that returns only endpoints that were modified before the specified timestamp. 
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     *  A filter that returns only endpoints that were modified after the specified timestamp. 
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     *  A filter that returns only endpoints with the specified status.
     */
    StatusEquals?: EndpointStatus;
  }
  export interface ListEndpointsOutput {
    /**
     *  An array or endpoint objects. 
     */
    Endpoints: EndpointSummaryList;
    /**
     *  If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of training jobs, use it in the subsequent request. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListExperimentsRequest {
    /**
     * A filter that returns only experiments created after the specified time.
     */
    CreatedAfter?: Timestamp;
    /**
     * A filter that returns only experiments created before the specified time.
     */
    CreatedBefore?: Timestamp;
    /**
     * The property used to sort results. The default value is CreationTime.
     */
    SortBy?: SortExperimentsBy;
    /**
     * The sort order. The default value is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * If the previous call to ListExperiments didn't return the full set of experiments, the call returns a token for getting the next set of experiments.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of experiments to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
  }
  export interface ListExperimentsResponse {
    /**
     * A list of the summaries of your experiments.
     */
    ExperimentSummaries?: ExperimentSummaries;
    /**
     * A token for getting the next set of experiments, if there are any.
     */
    NextToken?: NextToken;
  }
  export interface ListFeatureGroupsRequest {
    /**
     * A string that partially matches one or more FeatureGroups names. Filters FeatureGroups by name. 
     */
    NameContains?: FeatureGroupNameContains;
    /**
     * A FeatureGroup status. Filters by FeatureGroup status. 
     */
    FeatureGroupStatusEquals?: FeatureGroupStatus;
    /**
     * An OfflineStore status. Filters by OfflineStore status. 
     */
    OfflineStoreStatusEquals?: OfflineStoreStatusValue;
    /**
     * Use this parameter to search for FeatureGroupss created after a specific date and time.
     */
    CreationTimeAfter?: CreationTime;
    /**
     * Use this parameter to search for FeatureGroupss created before a specific date and time.
     */
    CreationTimeBefore?: CreationTime;
    /**
     * The order in which feature groups are listed.
     */
    SortOrder?: FeatureGroupSortOrder;
    /**
     * The value on which the feature group list is sorted.
     */
    SortBy?: FeatureGroupSortBy;
    /**
     * The maximum number of results returned by ListFeatureGroups.
     */
    MaxResults?: FeatureGroupMaxResults;
    /**
     * A token to resume pagination of ListFeatureGroups results.
     */
    NextToken?: NextToken;
  }
  export interface ListFeatureGroupsResponse {
    /**
     * A summary of feature groups.
     */
    FeatureGroupSummaries: FeatureGroupSummaries;
    /**
     * A token to resume pagination of ListFeatureGroups results.
     */
    NextToken: NextToken;
  }
  export interface ListFlowDefinitionsRequest {
    /**
     * A filter that returns only flow definitions with a creation time greater than or equal to the specified timestamp.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only flow definitions that were created before the specified timestamp.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * An optional value that specifies whether you want the results sorted in Ascending or Descending order.
     */
    SortOrder?: SortOrder;
    /**
     * A token to resume pagination.
     */
    NextToken?: NextToken;
    /**
     * The total number of items to return. If the total number of available items is more than the value specified in MaxResults, then a NextToken will be provided in the output that you can use to resume pagination.
     */
    MaxResults?: MaxResults;
  }
  export interface ListFlowDefinitionsResponse {
    /**
     * An array of objects describing the flow definitions.
     */
    FlowDefinitionSummaries: FlowDefinitionSummaries;
    /**
     * A token to resume pagination.
     */
    NextToken?: NextToken;
  }
  export interface ListHumanTaskUisRequest {
    /**
     * A filter that returns only human task user interfaces with a creation time greater than or equal to the specified timestamp.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only human task user interfaces that were created before the specified timestamp.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * An optional value that specifies whether you want the results sorted in Ascending or Descending order.
     */
    SortOrder?: SortOrder;
    /**
     * A token to resume pagination.
     */
    NextToken?: NextToken;
    /**
     * The total number of items to return. If the total number of available items is more than the value specified in MaxResults, then a NextToken will be provided in the output that you can use to resume pagination.
     */
    MaxResults?: MaxResults;
  }
  export interface ListHumanTaskUisResponse {
    /**
     * An array of objects describing the human task user interfaces.
     */
    HumanTaskUiSummaries: HumanTaskUiSummaries;
    /**
     * A token to resume pagination.
     */
    NextToken?: NextToken;
  }
  export interface ListHyperParameterTuningJobsRequest {
    /**
     * If the result of the previous ListHyperParameterTuningJobs request was truncated, the response includes a NextToken. To retrieve the next set of tuning jobs, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of tuning jobs to return. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * The field to sort results by. The default is Name.
     */
    SortBy?: HyperParameterTuningJobSortByOptions;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: SortOrder;
    /**
     * A string in the tuning job name. This filter returns only tuning jobs whose name contains the specified string.
     */
    NameContains?: NameContains;
    /**
     * A filter that returns only tuning jobs that were created after the specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only tuning jobs that were created before the specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only tuning jobs that were modified after the specified time.
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * A filter that returns only tuning jobs that were modified before the specified time.
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * A filter that returns only tuning jobs with the specified status.
     */
    StatusEquals?: HyperParameterTuningJobStatus;
  }
  export interface ListHyperParameterTuningJobsResponse {
    /**
     * A list of HyperParameterTuningJobSummary objects that describe the tuning jobs that the ListHyperParameterTuningJobs request returned.
     */
    HyperParameterTuningJobSummaries: HyperParameterTuningJobSummaries;
    /**
     * If the result of this ListHyperParameterTuningJobs request was truncated, the response includes a NextToken. To retrieve the next set of tuning jobs, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListImageVersionsRequest {
    /**
     * A filter that returns only versions created on or after the specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only versions created on or before the specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * The name of the image to list the versions of.
     */
    ImageName: ImageName;
    /**
     * A filter that returns only versions modified on or after the specified time.
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * A filter that returns only versions modified on or before the specified time.
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * The maximum number of versions to return in the response. The default value is 10. 
     */
    MaxResults?: MaxResults;
    /**
     * If the previous call to ListImageVersions didn't return the full set of versions, the call returns a token for getting the next set of versions.
     */
    NextToken?: NextToken;
    /**
     * The property used to sort results. The default value is CREATION_TIME.
     */
    SortBy?: ImageVersionSortBy;
    /**
     * The sort order. The default value is DESCENDING.
     */
    SortOrder?: ImageVersionSortOrder;
  }
  export interface ListImageVersionsResponse {
    /**
     * A list of versions and their properties.
     */
    ImageVersions?: ImageVersions;
    /**
     * A token for getting the next set of versions, if there are any.
     */
    NextToken?: NextToken;
  }
  export interface ListImagesRequest {
    /**
     * A filter that returns only images created on or after the specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only images created on or before the specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only images modified on or after the specified time.
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * A filter that returns only images modified on or before the specified time.
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * The maximum number of images to return in the response. The default value is 10. 
     */
    MaxResults?: MaxResults;
    /**
     * A filter that returns only images whose name contains the specified string.
     */
    NameContains?: ImageNameContains;
    /**
     * If the previous call to ListImages didn't return the full set of images, the call returns a token for getting the next set of images.
     */
    NextToken?: NextToken;
    /**
     * The property used to sort results. The default value is CREATION_TIME.
     */
    SortBy?: ImageSortBy;
    /**
     * The sort order. The default value is DESCENDING.
     */
    SortOrder?: ImageSortOrder;
  }
  export interface ListImagesResponse {
    /**
     * A list of images and their properties.
     */
    Images?: Images;
    /**
     * A token for getting the next set of images, if there are any.
     */
    NextToken?: NextToken;
  }
  export interface ListLabelingJobsForWorkteamRequest {
    /**
     * The Amazon Resource Name (ARN) of the work team for which you want to see labeling jobs for.
     */
    WorkteamArn: WorkteamArn;
    /**
     * The maximum number of labeling jobs to return in each page of the response.
     */
    MaxResults?: MaxResults;
    /**
     * If the result of the previous ListLabelingJobsForWorkteam request was truncated, the response includes a NextToken. To retrieve the next set of labeling jobs, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * A filter that returns only labeling jobs created after the specified time (timestamp).
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only labeling jobs created before the specified time (timestamp).
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter the limits jobs to only the ones whose job reference code contains the specified string.
     */
    JobReferenceCodeContains?: JobReferenceCodeContains;
    /**
     * The field to sort results by. The default is CreationTime.
     */
    SortBy?: ListLabelingJobsForWorkteamSortByOptions;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: SortOrder;
  }
  export interface ListLabelingJobsForWorkteamResponse {
    /**
     * An array of LabelingJobSummary objects, each describing a labeling job.
     */
    LabelingJobSummaryList: LabelingJobForWorkteamSummaryList;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of labeling jobs, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export type ListLabelingJobsForWorkteamSortByOptions = "CreationTime"|string;
  export interface ListLabelingJobsRequest {
    /**
     * A filter that returns only labeling jobs created after the specified time (timestamp).
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only labeling jobs created before the specified time (timestamp).
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only labeling jobs modified after the specified time (timestamp).
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * A filter that returns only labeling jobs modified before the specified time (timestamp).
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * The maximum number of labeling jobs to return in each page of the response.
     */
    MaxResults?: MaxResults;
    /**
     * If the result of the previous ListLabelingJobs request was truncated, the response includes a NextToken. To retrieve the next set of labeling jobs, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * A string in the labeling job name. This filter returns only labeling jobs whose name contains the specified string.
     */
    NameContains?: NameContains;
    /**
     * The field to sort results by. The default is CreationTime.
     */
    SortBy?: SortBy;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: SortOrder;
    /**
     * A filter that retrieves only labeling jobs with a specific status.
     */
    StatusEquals?: LabelingJobStatus;
  }
  export interface ListLabelingJobsResponse {
    /**
     * An array of LabelingJobSummary objects, each describing a labeling job.
     */
    LabelingJobSummaryList?: LabelingJobSummaryList;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of labeling jobs, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export type ListLineageEntityParameterKey = StringParameterValue[];
  export type ListMaxResults = number;
  export interface ListModelBiasJobDefinitionsRequest {
    /**
     * Name of the endpoint to monitor for model bias.
     */
    EndpointName?: EndpointName;
    /**
     * Whether to sort results by the Name or CreationTime field. The default is CreationTime.
     */
    SortBy?: MonitoringJobDefinitionSortKey;
    /**
     * Whether to sort the results in Ascending or Descending order. The default is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * The token returned if the response is truncated. To retrieve the next set of job executions, use it in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of model bias jobs to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * Filter for model bias jobs whose name contains a specified string.
     */
    NameContains?: NameContains;
    /**
     * A filter that returns only model bias jobs created before a specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only model bias jobs created after a specified time.
     */
    CreationTimeAfter?: Timestamp;
  }
  export interface ListModelBiasJobDefinitionsResponse {
    /**
     * A JSON array in which each element is a summary for a model bias jobs.
     */
    JobDefinitionSummaries: MonitoringJobDefinitionSummaryList;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of jobs, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export interface ListModelExplainabilityJobDefinitionsRequest {
    /**
     * Name of the endpoint to monitor for model explainability.
     */
    EndpointName?: EndpointName;
    /**
     * Whether to sort results by the Name or CreationTime field. The default is CreationTime.
     */
    SortBy?: MonitoringJobDefinitionSortKey;
    /**
     * Whether to sort the results in Ascending or Descending order. The default is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * The token returned if the response is truncated. To retrieve the next set of job executions, use it in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of jobs to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * Filter for model explainability jobs whose name contains a specified string.
     */
    NameContains?: NameContains;
    /**
     * A filter that returns only model explainability jobs created before a specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only model explainability jobs created after a specified time.
     */
    CreationTimeAfter?: Timestamp;
  }
  export interface ListModelExplainabilityJobDefinitionsResponse {
    /**
     * A JSON array in which each element is a summary for a explainability bias jobs.
     */
    JobDefinitionSummaries: MonitoringJobDefinitionSummaryList;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of jobs, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export interface ListModelPackageGroupsInput {
    /**
     * A filter that returns only model groups created after the specified time.
     */
    CreationTimeAfter?: CreationTime;
    /**
     * A filter that returns only model groups created before the specified time.
     */
    CreationTimeBefore?: CreationTime;
    /**
     * The maximum number of results to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A string in the model group name. This filter returns only model groups whose name contains the specified string.
     */
    NameContains?: NameContains;
    /**
     * If the result of the previous ListModelPackageGroups request was truncated, the response includes a NextToken. To retrieve the next set of model groups, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The field to sort results by. The default is CreationTime.
     */
    SortBy?: ModelPackageGroupSortBy;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: SortOrder;
  }
  export interface ListModelPackageGroupsOutput {
    /**
     * A list of summaries of the model groups in your Amazon Web Services account.
     */
    ModelPackageGroupSummaryList: ModelPackageGroupSummaryList;
    /**
     * If the response is truncated, SageMaker returns this token. To retrieve the next set of model groups, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export interface ListModelPackagesInput {
    /**
     * A filter that returns only model packages created after the specified time (timestamp).
     */
    CreationTimeAfter?: CreationTime;
    /**
     * A filter that returns only model packages created before the specified time (timestamp).
     */
    CreationTimeBefore?: CreationTime;
    /**
     * The maximum number of model packages to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A string in the model package name. This filter returns only model packages whose name contains the specified string.
     */
    NameContains?: NameContains;
    /**
     * A filter that returns only the model packages with the specified approval status.
     */
    ModelApprovalStatus?: ModelApprovalStatus;
    /**
     * A filter that returns only model versions that belong to the specified model group.
     */
    ModelPackageGroupName?: ArnOrName;
    /**
     * A filter that returns onlyl the model packages of the specified type. This can be one of the following values.    VERSIONED - List only versioned models.    UNVERSIONED - List only unversioined models.    BOTH - List both versioned and unversioned models.  
     */
    ModelPackageType?: ModelPackageType;
    /**
     * If the response to a previous ListModelPackages request was truncated, the response includes a NextToken. To retrieve the next set of model packages, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The parameter by which to sort the results. The default is CreationTime.
     */
    SortBy?: ModelPackageSortBy;
    /**
     * The sort order for the results. The default is Ascending.
     */
    SortOrder?: SortOrder;
  }
  export interface ListModelPackagesOutput {
    /**
     * An array of ModelPackageSummary objects, each of which lists a model package.
     */
    ModelPackageSummaryList: ModelPackageSummaryList;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of model packages, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export interface ListModelQualityJobDefinitionsRequest {
    /**
     * A filter that returns only model quality monitoring job definitions that are associated with the specified endpoint.
     */
    EndpointName?: EndpointName;
    /**
     * The field to sort results by. The default is CreationTime.
     */
    SortBy?: MonitoringJobDefinitionSortKey;
    /**
     * The sort order for results. The default is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * If the result of the previous ListModelQualityJobDefinitions request was truncated, the response includes a NextToken. To retrieve the next set of model quality monitoring job definitions, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return in a call to ListModelQualityJobDefinitions.
     */
    MaxResults?: MaxResults;
    /**
     * A string in the transform job name. This filter returns only model quality monitoring job definitions whose name contains the specified string.
     */
    NameContains?: NameContains;
    /**
     * A filter that returns only model quality monitoring job definitions created before the specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only model quality monitoring job definitions created after the specified time.
     */
    CreationTimeAfter?: Timestamp;
  }
  export interface ListModelQualityJobDefinitionsResponse {
    /**
     * A list of summaries of model quality monitoring job definitions.
     */
    JobDefinitionSummaries: MonitoringJobDefinitionSummaryList;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of model quality monitoring job definitions, use it in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListModelsInput {
    /**
     * Sorts the list of results. The default is CreationTime.
     */
    SortBy?: ModelSortKey;
    /**
     * The sort order for results. The default is Descending.
     */
    SortOrder?: OrderKey;
    /**
     * If the response to a previous ListModels request was truncated, the response includes a NextToken. To retrieve the next set of models, use the token in the next request.
     */
    NextToken?: PaginationToken;
    /**
     * The maximum number of models to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A string in the model name. This filter returns only models whose name contains the specified string.
     */
    NameContains?: ModelNameContains;
    /**
     * A filter that returns only models created before the specified time (timestamp).
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only models with a creation time greater than or equal to the specified time (timestamp).
     */
    CreationTimeAfter?: Timestamp;
  }
  export interface ListModelsOutput {
    /**
     * An array of ModelSummary objects, each of which lists a model.
     */
    Models: ModelSummaryList;
    /**
     *  If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of models, use it in the subsequent request. 
     */
    NextToken?: PaginationToken;
  }
  export interface ListMonitoringExecutionsRequest {
    /**
     * Name of a specific schedule to fetch jobs for.
     */
    MonitoringScheduleName?: MonitoringScheduleName;
    /**
     * Name of a specific endpoint to fetch jobs for.
     */
    EndpointName?: EndpointName;
    /**
     * Whether to sort results by Status, CreationTime, ScheduledTime field. The default is CreationTime.
     */
    SortBy?: MonitoringExecutionSortKey;
    /**
     * Whether to sort the results in Ascending or Descending order. The default is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * The token returned if the response is truncated. To retrieve the next set of job executions, use it in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of jobs to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * Filter for jobs scheduled before a specified time.
     */
    ScheduledTimeBefore?: Timestamp;
    /**
     * Filter for jobs scheduled after a specified time.
     */
    ScheduledTimeAfter?: Timestamp;
    /**
     * A filter that returns only jobs created before a specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only jobs created after a specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only jobs modified after a specified time.
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * A filter that returns only jobs modified before a specified time.
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * A filter that retrieves only jobs with a specific status.
     */
    StatusEquals?: ExecutionStatus;
    /**
     * Gets a list of the monitoring job runs of the specified monitoring job definitions.
     */
    MonitoringJobDefinitionName?: MonitoringJobDefinitionName;
    /**
     * A filter that returns only the monitoring job runs of the specified monitoring type.
     */
    MonitoringTypeEquals?: MonitoringType;
  }
  export interface ListMonitoringExecutionsResponse {
    /**
     * A JSON array in which each element is a summary for a monitoring execution.
     */
    MonitoringExecutionSummaries: MonitoringExecutionSummaryList;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of jobs, use it in the subsequent reques
     */
    NextToken?: NextToken;
  }
  export interface ListMonitoringSchedulesRequest {
    /**
     * Name of a specific endpoint to fetch schedules for.
     */
    EndpointName?: EndpointName;
    /**
     * Whether to sort results by Status, CreationTime, ScheduledTime field. The default is CreationTime.
     */
    SortBy?: MonitoringScheduleSortKey;
    /**
     * Whether to sort the results in Ascending or Descending order. The default is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * The token returned if the response is truncated. To retrieve the next set of job executions, use it in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of jobs to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * Filter for monitoring schedules whose name contains a specified string.
     */
    NameContains?: NameContains;
    /**
     * A filter that returns only monitoring schedules created before a specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only monitoring schedules created after a specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only monitoring schedules modified before a specified time.
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * A filter that returns only monitoring schedules modified after a specified time.
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * A filter that returns only monitoring schedules modified before a specified time.
     */
    StatusEquals?: ScheduleStatus;
    /**
     * Gets a list of the monitoring schedules for the specified monitoring job definition.
     */
    MonitoringJobDefinitionName?: MonitoringJobDefinitionName;
    /**
     * A filter that returns only the monitoring schedules for the specified monitoring type.
     */
    MonitoringTypeEquals?: MonitoringType;
  }
  export interface ListMonitoringSchedulesResponse {
    /**
     * A JSON array in which each element is a summary for a monitoring schedule.
     */
    MonitoringScheduleSummaries: MonitoringScheduleSummaryList;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of jobs, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export interface ListNotebookInstanceLifecycleConfigsInput {
    /**
     * If the result of a ListNotebookInstanceLifecycleConfigs request was truncated, the response includes a NextToken. To get the next set of lifecycle configurations, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of lifecycle configurations to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * Sorts the list of results. The default is CreationTime.
     */
    SortBy?: NotebookInstanceLifecycleConfigSortKey;
    /**
     * The sort order for results.
     */
    SortOrder?: NotebookInstanceLifecycleConfigSortOrder;
    /**
     * A string in the lifecycle configuration name. This filter returns only lifecycle configurations whose name contains the specified string.
     */
    NameContains?: NotebookInstanceLifecycleConfigNameContains;
    /**
     * A filter that returns only lifecycle configurations that were created before the specified time (timestamp).
     */
    CreationTimeBefore?: CreationTime;
    /**
     * A filter that returns only lifecycle configurations that were created after the specified time (timestamp).
     */
    CreationTimeAfter?: CreationTime;
    /**
     * A filter that returns only lifecycle configurations that were modified before the specified time (timestamp).
     */
    LastModifiedTimeBefore?: LastModifiedTime;
    /**
     * A filter that returns only lifecycle configurations that were modified after the specified time (timestamp).
     */
    LastModifiedTimeAfter?: LastModifiedTime;
  }
  export interface ListNotebookInstanceLifecycleConfigsOutput {
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To get the next set of lifecycle configurations, use it in the next request. 
     */
    NextToken?: NextToken;
    /**
     * An array of NotebookInstanceLifecycleConfiguration objects, each listing a lifecycle configuration.
     */
    NotebookInstanceLifecycleConfigs?: NotebookInstanceLifecycleConfigSummaryList;
  }
  export interface ListNotebookInstancesInput {
    /**
     *  If the previous call to the ListNotebookInstances is truncated, the response includes a NextToken. You can use this token in your subsequent ListNotebookInstances request to fetch the next set of notebook instances.   You might specify a filter or a sort order in your request. When response is truncated, you must use the same values for the filer and sort order in the next request.  
     */
    NextToken?: NextToken;
    /**
     * The maximum number of notebook instances to return.
     */
    MaxResults?: MaxResults;
    /**
     * The field to sort results by. The default is Name.
     */
    SortBy?: NotebookInstanceSortKey;
    /**
     * The sort order for results. 
     */
    SortOrder?: NotebookInstanceSortOrder;
    /**
     * A string in the notebook instances' name. This filter returns only notebook instances whose name contains the specified string.
     */
    NameContains?: NotebookInstanceNameContains;
    /**
     * A filter that returns only notebook instances that were created before the specified time (timestamp). 
     */
    CreationTimeBefore?: CreationTime;
    /**
     * A filter that returns only notebook instances that were created after the specified time (timestamp).
     */
    CreationTimeAfter?: CreationTime;
    /**
     * A filter that returns only notebook instances that were modified before the specified time (timestamp).
     */
    LastModifiedTimeBefore?: LastModifiedTime;
    /**
     * A filter that returns only notebook instances that were modified after the specified time (timestamp).
     */
    LastModifiedTimeAfter?: LastModifiedTime;
    /**
     * A filter that returns only notebook instances with the specified status.
     */
    StatusEquals?: NotebookInstanceStatus;
    /**
     * A string in the name of a notebook instances lifecycle configuration associated with this notebook instance. This filter returns only notebook instances associated with a lifecycle configuration with a name that contains the specified string.
     */
    NotebookInstanceLifecycleConfigNameContains?: NotebookInstanceLifecycleConfigName;
    /**
     * A string in the name or URL of a Git repository associated with this notebook instance. This filter returns only notebook instances associated with a git repository with a name that contains the specified string.
     */
    DefaultCodeRepositoryContains?: CodeRepositoryContains;
    /**
     * A filter that returns only notebook instances with associated with the specified git repository.
     */
    AdditionalCodeRepositoryEquals?: CodeRepositoryNameOrUrl;
  }
  export interface ListNotebookInstancesOutput {
    /**
     * If the response to the previous ListNotebookInstances request was truncated, Amazon SageMaker returns this token. To retrieve the next set of notebook instances, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * An array of NotebookInstanceSummary objects, one for each notebook instance.
     */
    NotebookInstances?: NotebookInstanceSummaryList;
  }
  export interface ListPipelineExecutionStepsRequest {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn?: PipelineExecutionArn;
    /**
     * If the result of the previous ListPipelineExecutionSteps request was truncated, the response includes a NextToken. To retrieve the next set of pipeline execution steps, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of pipeline execution steps to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * The field by which to sort results. The default is CreatedTime.
     */
    SortOrder?: SortOrder;
  }
  export interface ListPipelineExecutionStepsResponse {
    /**
     * A list of PipeLineExecutionStep objects. Each PipeLineExecutionStep consists of StepName, StartTime, EndTime, StepStatus, and Metadata. Metadata is an object with properties for each job that contains relevant information about the job created by the step.
     */
    PipelineExecutionSteps?: PipelineExecutionStepList;
    /**
     * If the result of the previous ListPipelineExecutionSteps request was truncated, the response includes a NextToken. To retrieve the next set of pipeline execution steps, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListPipelineExecutionsRequest {
    /**
     * The name of the pipeline.
     */
    PipelineName: PipelineName;
    /**
     * A filter that returns the pipeline executions that were created after a specified time.
     */
    CreatedAfter?: Timestamp;
    /**
     * A filter that returns the pipeline executions that were created before a specified time.
     */
    CreatedBefore?: Timestamp;
    /**
     * The field by which to sort results. The default is CreatedTime.
     */
    SortBy?: SortPipelineExecutionsBy;
    /**
     * The sort order for results.
     */
    SortOrder?: SortOrder;
    /**
     * If the result of the previous ListPipelineExecutions request was truncated, the response includes a NextToken. To retrieve the next set of pipeline executions, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of pipeline executions to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPipelineExecutionsResponse {
    /**
     * Contains a sorted list of pipeline execution summary objects matching the specified filters. Each run summary includes the Amazon Resource Name (ARN) of the pipeline execution, the run date, and the status. This list can be empty. 
     */
    PipelineExecutionSummaries?: PipelineExecutionSummaryList;
    /**
     * If the result of the previous ListPipelineExecutions request was truncated, the response includes a NextToken. To retrieve the next set of pipeline executions, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListPipelineParametersForExecutionRequest {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn: PipelineExecutionArn;
    /**
     * If the result of the previous ListPipelineParametersForExecution request was truncated, the response includes a NextToken. To retrieve the next set of parameters, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of parameters to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPipelineParametersForExecutionResponse {
    /**
     * Contains a list of pipeline parameters. This list can be empty. 
     */
    PipelineParameters?: ParameterList;
    /**
     * If the result of the previous ListPipelineParametersForExecution request was truncated, the response includes a NextToken. To retrieve the next set of parameters, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListPipelinesRequest {
    /**
     * The prefix of the pipeline name.
     */
    PipelineNamePrefix?: PipelineName;
    /**
     * A filter that returns the pipelines that were created after a specified time.
     */
    CreatedAfter?: Timestamp;
    /**
     * A filter that returns the pipelines that were created before a specified time.
     */
    CreatedBefore?: Timestamp;
    /**
     * The field by which to sort results. The default is CreatedTime.
     */
    SortBy?: SortPipelinesBy;
    /**
     * The sort order for results.
     */
    SortOrder?: SortOrder;
    /**
     * If the result of the previous ListPipelines request was truncated, the response includes a NextToken. To retrieve the next set of pipelines, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of pipelines to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListPipelinesResponse {
    /**
     * Contains a sorted list of PipelineSummary objects matching the specified filters. Each PipelineSummary consists of PipelineArn, PipelineName, ExperimentName, PipelineDescription, CreationTime, LastModifiedTime, LastRunTime, and RoleArn. This list can be empty. 
     */
    PipelineSummaries?: PipelineSummaryList;
    /**
     * If the result of the previous ListPipelines request was truncated, the response includes a NextToken. To retrieve the next set of pipelines, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListProcessingJobsRequest {
    /**
     * A filter that returns only processing jobs created after the specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only processing jobs created after the specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only processing jobs modified after the specified time.
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * A filter that returns only processing jobs modified before the specified time.
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * A string in the processing job name. This filter returns only processing jobs whose name contains the specified string.
     */
    NameContains?: String;
    /**
     * A filter that retrieves only processing jobs with a specific status.
     */
    StatusEquals?: ProcessingJobStatus;
    /**
     * The field to sort results by. The default is CreationTime.
     */
    SortBy?: SortBy;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: SortOrder;
    /**
     * If the result of the previous ListProcessingJobs request was truncated, the response includes a NextToken. To retrieve the next set of processing jobs, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of processing jobs to return in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListProcessingJobsResponse {
    /**
     * An array of ProcessingJobSummary objects, each listing a processing job.
     */
    ProcessingJobSummaries: ProcessingJobSummaries;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of processing jobs, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export interface ListProjectsInput {
    /**
     * A filter that returns the projects that were created after a specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns the projects that were created before a specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * The maximum number of projects to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A filter that returns the projects whose name contains a specified string.
     */
    NameContains?: ProjectEntityName;
    /**
     * If the result of the previous ListProjects request was truncated, the response includes a NextToken. To retrieve the next set of projects, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The field by which to sort results. The default is CreationTime.
     */
    SortBy?: ProjectSortBy;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: ProjectSortOrder;
  }
  export interface ListProjectsOutput {
    /**
     * A list of summaries of projects.
     */
    ProjectSummaryList: ProjectSummaryList;
    /**
     * If the result of the previous ListCompilationJobs request was truncated, the response includes a NextToken. To retrieve the next set of model compilation jobs, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListStudioLifecycleConfigsRequest {
    /**
     * The maximum number of Studio Lifecycle Configurations to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous call to ListStudioLifecycleConfigs didn't return the full set of Lifecycle Configurations, the call returns a token for getting the next set of Lifecycle Configurations.
     */
    NextToken?: NextToken;
    /**
     * A string in the Lifecycle Configuration name. This filter returns only Lifecycle Configurations whose name contains the specified string.
     */
    NameContains?: StudioLifecycleConfigName;
    /**
     * A parameter to search for the App Type to which the Lifecycle Configuration is attached.
     */
    AppTypeEquals?: StudioLifecycleConfigAppType;
    /**
     * A filter that returns only Lifecycle Configurations created on or before the specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only Lifecycle Configurations created on or after the specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only Lifecycle Configurations modified before the specified time.
     */
    ModifiedTimeBefore?: Timestamp;
    /**
     * A filter that returns only Lifecycle Configurations modified after the specified time.
     */
    ModifiedTimeAfter?: Timestamp;
    /**
     * The property used to sort results. The default value is CreationTime.
     */
    SortBy?: StudioLifecycleConfigSortKey;
    /**
     * The sort order. The default value is Descending.
     */
    SortOrder?: SortOrder;
  }
  export interface ListStudioLifecycleConfigsResponse {
    /**
     * A token for getting the next set of actions, if there are any.
     */
    NextToken?: NextToken;
    /**
     * A list of Lifecycle Configurations and their properties.
     */
    StudioLifecycleConfigs?: StudioLifecycleConfigsList;
  }
  export interface ListSubscribedWorkteamsRequest {
    /**
     * A string in the work team name. This filter returns only work teams whose name contains the specified string.
     */
    NameContains?: WorkteamName;
    /**
     * If the result of the previous ListSubscribedWorkteams request was truncated, the response includes a NextToken. To retrieve the next set of labeling jobs, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of work teams to return in each page of the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListSubscribedWorkteamsResponse {
    /**
     * An array of Workteam objects, each describing a work team.
     */
    SubscribedWorkteams: SubscribedWorkteams;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of work teams, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsInput {
    /**
     * The Amazon Resource Name (ARN) of the resource whose tags you want to retrieve.
     */
    ResourceArn: ResourceArn;
    /**
     *  If the response to the previous ListTags request is truncated, Amazon SageMaker returns this token. To retrieve the next set of tags, use it in the subsequent request. 
     */
    NextToken?: NextToken;
    /**
     * Maximum number of tags to return.
     */
    MaxResults?: ListTagsMaxResults;
  }
  export type ListTagsMaxResults = number;
  export interface ListTagsOutput {
    /**
     * An array of Tag objects, each with a tag key and a value.
     */
    Tags?: TagList;
    /**
     *  If response is truncated, Amazon SageMaker includes a token in the response. You can use this token in your subsequent request to fetch next set of tokens. 
     */
    NextToken?: NextToken;
  }
  export interface ListTrainingJobsForHyperParameterTuningJobRequest {
    /**
     * The name of the tuning job whose training jobs you want to list.
     */
    HyperParameterTuningJobName: HyperParameterTuningJobName;
    /**
     * If the result of the previous ListTrainingJobsForHyperParameterTuningJob request was truncated, the response includes a NextToken. To retrieve the next set of training jobs, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of training jobs to return. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * A filter that returns only training jobs with the specified status.
     */
    StatusEquals?: TrainingJobStatus;
    /**
     * The field to sort results by. The default is Name. If the value of this field is FinalObjectiveMetricValue, any training jobs that did not return an objective metric are not listed.
     */
    SortBy?: TrainingJobSortByOptions;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: SortOrder;
  }
  export interface ListTrainingJobsForHyperParameterTuningJobResponse {
    /**
     * A list of TrainingJobSummary objects that describe the training jobs that the ListTrainingJobsForHyperParameterTuningJob request returned.
     */
    TrainingJobSummaries: HyperParameterTrainingJobSummaries;
    /**
     * If the result of this ListTrainingJobsForHyperParameterTuningJob request was truncated, the response includes a NextToken. To retrieve the next set of training jobs, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export interface ListTrainingJobsRequest {
    /**
     * If the result of the previous ListTrainingJobs request was truncated, the response includes a NextToken. To retrieve the next set of training jobs, use the token in the next request. 
     */
    NextToken?: NextToken;
    /**
     * The maximum number of training jobs to return in the response.
     */
    MaxResults?: MaxResults;
    /**
     * A filter that returns only training jobs created after the specified time (timestamp).
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only training jobs created before the specified time (timestamp).
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only training jobs modified after the specified time (timestamp).
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * A filter that returns only training jobs modified before the specified time (timestamp).
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * A string in the training job name. This filter returns only training jobs whose name contains the specified string.
     */
    NameContains?: NameContains;
    /**
     * A filter that retrieves only training jobs with a specific status.
     */
    StatusEquals?: TrainingJobStatus;
    /**
     * The field to sort results by. The default is CreationTime.
     */
    SortBy?: SortBy;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: SortOrder;
  }
  export interface ListTrainingJobsResponse {
    /**
     * An array of TrainingJobSummary objects, each listing a training job.
     */
    TrainingJobSummaries: TrainingJobSummaries;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of training jobs, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export interface ListTransformJobsRequest {
    /**
     * A filter that returns only transform jobs created after the specified time.
     */
    CreationTimeAfter?: Timestamp;
    /**
     * A filter that returns only transform jobs created before the specified time.
     */
    CreationTimeBefore?: Timestamp;
    /**
     * A filter that returns only transform jobs modified after the specified time.
     */
    LastModifiedTimeAfter?: Timestamp;
    /**
     * A filter that returns only transform jobs modified before the specified time.
     */
    LastModifiedTimeBefore?: Timestamp;
    /**
     * A string in the transform job name. This filter returns only transform jobs whose name contains the specified string.
     */
    NameContains?: NameContains;
    /**
     * A filter that retrieves only transform jobs with a specific status.
     */
    StatusEquals?: TransformJobStatus;
    /**
     * The field to sort results by. The default is CreationTime.
     */
    SortBy?: SortBy;
    /**
     * The sort order for results. The default is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * If the result of the previous ListTransformJobs request was truncated, the response includes a NextToken. To retrieve the next set of transform jobs, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of transform jobs to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
  }
  export interface ListTransformJobsResponse {
    /**
     * An array of TransformJobSummary objects.
     */
    TransformJobSummaries: TransformJobSummaries;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of transform jobs, use it in the next request.
     */
    NextToken?: NextToken;
  }
  export type ListTrialComponentKey256 = TrialComponentKey256[];
  export interface ListTrialComponentsRequest {
    /**
     * A filter that returns only components that are part of the specified experiment. If you specify ExperimentName, you can't filter by SourceArn or TrialName.
     */
    ExperimentName?: ExperimentEntityName;
    /**
     * A filter that returns only components that are part of the specified trial. If you specify TrialName, you can't filter by ExperimentName or SourceArn.
     */
    TrialName?: ExperimentEntityName;
    /**
     * A filter that returns only components that have the specified source Amazon Resource Name (ARN). If you specify SourceArn, you can't filter by ExperimentName or TrialName.
     */
    SourceArn?: String256;
    /**
     * A filter that returns only components created after the specified time.
     */
    CreatedAfter?: Timestamp;
    /**
     * A filter that returns only components created before the specified time.
     */
    CreatedBefore?: Timestamp;
    /**
     * The property used to sort results. The default value is CreationTime.
     */
    SortBy?: SortTrialComponentsBy;
    /**
     * The sort order. The default value is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * The maximum number of components to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous call to ListTrialComponents didn't return the full set of components, the call returns a token for getting the next set of components.
     */
    NextToken?: NextToken;
  }
  export interface ListTrialComponentsResponse {
    /**
     * A list of the summaries of your trial components.
     */
    TrialComponentSummaries?: TrialComponentSummaries;
    /**
     * A token for getting the next set of components, if there are any.
     */
    NextToken?: NextToken;
  }
  export interface ListTrialsRequest {
    /**
     * A filter that returns only trials that are part of the specified experiment.
     */
    ExperimentName?: ExperimentEntityName;
    /**
     * A filter that returns only trials that are associated with the specified trial component.
     */
    TrialComponentName?: ExperimentEntityName;
    /**
     * A filter that returns only trials created after the specified time.
     */
    CreatedAfter?: Timestamp;
    /**
     * A filter that returns only trials created before the specified time.
     */
    CreatedBefore?: Timestamp;
    /**
     * The property used to sort results. The default value is CreationTime.
     */
    SortBy?: SortTrialsBy;
    /**
     * The sort order. The default value is Descending.
     */
    SortOrder?: SortOrder;
    /**
     * The maximum number of trials to return in the response. The default value is 10.
     */
    MaxResults?: MaxResults;
    /**
     * If the previous call to ListTrials didn't return the full set of trials, the call returns a token for getting the next set of trials.
     */
    NextToken?: NextToken;
  }
  export interface ListTrialsResponse {
    /**
     * A list of the summaries of your trials.
     */
    TrialSummaries?: TrialSummaries;
    /**
     * A token for getting the next set of trials, if there are any.
     */
    NextToken?: NextToken;
  }
  export interface ListUserProfilesRequest {
    /**
     * If the previous response was truncated, you will receive this token. Use it in your next request to receive the next set of results.
     */
    NextToken?: NextToken;
    /**
     * Returns a list up to a specified limit.
     */
    MaxResults?: MaxResults;
    /**
     * The sort order for the results. The default is Ascending.
     */
    SortOrder?: SortOrder;
    /**
     * The parameter by which to sort the results. The default is CreationTime.
     */
    SortBy?: UserProfileSortKey;
    /**
     * A parameter by which to filter the results.
     */
    DomainIdEquals?: DomainId;
    /**
     * A parameter by which to filter the results.
     */
    UserProfileNameContains?: UserProfileName;
  }
  export interface ListUserProfilesResponse {
    /**
     * The list of user profiles.
     */
    UserProfiles?: UserProfileList;
    /**
     * If the previous response was truncated, you will receive this token. Use it in your next request to receive the next set of results.
     */
    NextToken?: NextToken;
  }
  export interface ListWorkforcesRequest {
    /**
     * Sort workforces using the workforce name or creation date.
     */
    SortBy?: ListWorkforcesSortByOptions;
    /**
     * Sort workforces in ascending or descending order.
     */
    SortOrder?: SortOrder;
    /**
     * A filter you can use to search for workforces using part of the workforce name.
     */
    NameContains?: WorkforceName;
    /**
     * A token to resume pagination.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of workforces returned in the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListWorkforcesResponse {
    /**
     * A list containing information about your workforce.
     */
    Workforces: Workforces;
    /**
     * A token to resume pagination.
     */
    NextToken?: NextToken;
  }
  export type ListWorkforcesSortByOptions = "Name"|"CreateDate"|string;
  export interface ListWorkteamsRequest {
    /**
     * The field to sort results by. The default is CreationTime.
     */
    SortBy?: ListWorkteamsSortByOptions;
    /**
     * The sort order for results. The default is Ascending.
     */
    SortOrder?: SortOrder;
    /**
     * A string in the work team's name. This filter returns only work teams whose name contains the specified string.
     */
    NameContains?: WorkteamName;
    /**
     * If the result of the previous ListWorkteams request was truncated, the response includes a NextToken. To retrieve the next set of labeling jobs, use the token in the next request.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of work teams to return in each page of the response.
     */
    MaxResults?: MaxResults;
  }
  export interface ListWorkteamsResponse {
    /**
     * An array of Workteam objects, each describing a work team.
     */
    Workteams: Workteams;
    /**
     * If the response is truncated, Amazon SageMaker returns this token. To retrieve the next set of work teams, use it in the subsequent request.
     */
    NextToken?: NextToken;
  }
  export type ListWorkteamsSortByOptions = "Name"|"CreateDate"|string;
  export type Long = number;
  export type MaxAutoMLJobRuntimeInSeconds = number;
  export type MaxCandidates = number;
  export type MaxConcurrentInvocationsPerInstance = number;
  export type MaxConcurrentTaskCount = number;
  export type MaxConcurrentTransforms = number;
  export type MaxHumanLabeledObjectCount = number;
  export type MaxNumberOfTrainingJobs = number;
  export type MaxParallelTrainingJobs = number;
  export type MaxPayloadInMB = number;
  export type MaxPercentageOfInputDatasetLabeled = number;
  export type MaxResults = number;
  export type MaxRuntimeInSeconds = number;
  export type MaxRuntimePerTrainingJobInSeconds = number;
  export type MaxWaitTimeInSeconds = number;
  export type MaximumExecutionTimeoutInSeconds = number;
  export type MaximumRetryAttempts = number;
  export type MediaType = string;
  export interface MemberDefinition {
    /**
     * The Amazon Cognito user group that is part of the work team.
     */
    CognitoMemberDefinition?: CognitoMemberDefinition;
    /**
     * A list user groups that exist in your OIDC Identity Provider (IdP). One to ten groups can be used to create a single private work team. When you add a user group to the list of Groups, you can add that user group to one or more private work teams. If you add a user group to a private work team, all workers in that user group are added to the work team.
     */
    OidcMemberDefinition?: OidcMemberDefinition;
  }
  export type MemberDefinitions = MemberDefinition[];
  export interface MetadataProperties {
    /**
     * The commit ID.
     */
    CommitId?: MetadataPropertyValue;
    /**
     * The repository.
     */
    Repository?: MetadataPropertyValue;
    /**
     * The entity this entity was generated by.
     */
    GeneratedBy?: MetadataPropertyValue;
    /**
     * The project ID.
     */
    ProjectId?: MetadataPropertyValue;
  }
  export type MetadataPropertyValue = string;
  export interface MetricData {
    /**
     * The name of the metric.
     */
    MetricName?: MetricName;
    /**
     * The value of the metric.
     */
    Value?: Float;
    /**
     * The date and time that the algorithm emitted the metric.
     */
    Timestamp?: Timestamp;
  }
  export type MetricDataList = MetricDatum[];
  export interface MetricDatum {
    /**
     * The name of the metric.
     */
    MetricName?: AutoMLMetricEnum;
    /**
     * The value of the metric.
     */
    Value?: Float;
    /**
     * The dataset split from which the AutoML job produced the metric.
     */
    Set?: MetricSetSource;
  }
  export interface MetricDefinition {
    /**
     * The name of the metric.
     */
    Name: MetricName;
    /**
     * A regular expression that searches the output of a training job and gets the value of the metric. For more information about using regular expressions to define metrics, see Defining Objective Metrics.
     */
    Regex: MetricRegex;
  }
  export type MetricDefinitionList = MetricDefinition[];
  export type MetricName = string;
  export type MetricRegex = string;
  export type MetricSetSource = "Train"|"Validation"|"Test"|string;
  export type MetricValue = number;
  export interface MetricsSource {
    /**
     * 
     */
    ContentType: ContentType;
    /**
     * 
     */
    ContentDigest?: ContentDigest;
    /**
     * 
     */
    S3Uri: S3Uri;
  }
  export type ModelApprovalStatus = "Approved"|"Rejected"|"PendingManualApproval"|string;
  export type ModelArn = string;
  export interface ModelArtifacts {
    /**
     * The path of the S3 object that contains the model artifacts. For example, s3://bucket-name/keynameprefix/model.tar.gz.
     */
    S3ModelArtifacts: S3Uri;
  }
  export interface ModelBiasAppSpecification {
    /**
     * The container image to be run by the model bias job.
     */
    ImageUri: ImageUri;
    /**
     * JSON formatted S3 file that defines bias parameters. For more information on this JSON configuration file, see Configure bias parameters.
     */
    ConfigUri: S3Uri;
    /**
     * Sets the environment variables in the Docker container.
     */
    Environment?: MonitoringEnvironmentMap;
  }
  export interface ModelBiasBaselineConfig {
    /**
     * The name of the baseline model bias job.
     */
    BaseliningJobName?: ProcessingJobName;
    ConstraintsResource?: MonitoringConstraintsResource;
  }
  export interface ModelBiasJobInput {
    EndpointInput: EndpointInput;
    /**
     * Location of ground truth labels to use in model bias job.
     */
    GroundTruthS3Input: MonitoringGroundTruthS3Input;
  }
  export type ModelCacheSetting = "Enabled"|"Disabled"|string;
  export interface ModelClientConfig {
    /**
     * The timeout value in seconds for an invocation request.
     */
    InvocationsTimeoutInSeconds?: InvocationsTimeoutInSeconds;
    /**
     * The maximum number of retries when invocation requests are failing.
     */
    InvocationsMaxRetries?: InvocationsMaxRetries;
  }
  export interface ModelDataQuality {
    /**
     * Data quality statistics for a model.
     */
    Statistics?: MetricsSource;
    /**
     * Data quality constraints for a model.
     */
    Constraints?: MetricsSource;
  }
  export interface ModelDeployConfig {
    /**
     * Set to True to automatically generate an endpoint name for a one-click Autopilot model deployment; set to False otherwise. The default value is False.  If you set AutoGenerateEndpointName to True, do not specify the EndpointName; otherwise a 400 error is thrown. 
     */
    AutoGenerateEndpointName?: AutoGenerateEndpointName;
    /**
     * Specifies the endpoint name to use for a one-click Autopilot model deployment if the endpoint name is not generated automatically.  Specify the EndpointName if and only if you set AutoGenerateEndpointName to False; otherwise a 400 error is thrown. 
     */
    EndpointName?: EndpointName;
  }
  export interface ModelDeployResult {
    /**
     * The name of the endpoint to which the model has been deployed.  If model deployment fails, this field is omitted from the response. 
     */
    EndpointName?: EndpointName;
  }
  export interface ModelDigests {
    /**
     * Provides a hash value that uniquely identifies the stored model artifacts.
     */
    ArtifactDigest?: ArtifactDigest;
  }
  export interface ModelExplainabilityAppSpecification {
    /**
     * The container image to be run by the model explainability job.
     */
    ImageUri: ImageUri;
    /**
     * JSON formatted S3 file that defines explainability parameters. For more information on this JSON configuration file, see Configure model explainability parameters.
     */
    ConfigUri: S3Uri;
    /**
     * Sets the environment variables in the Docker container.
     */
    Environment?: MonitoringEnvironmentMap;
  }
  export interface ModelExplainabilityBaselineConfig {
    /**
     * The name of the baseline model explainability job.
     */
    BaseliningJobName?: ProcessingJobName;
    ConstraintsResource?: MonitoringConstraintsResource;
  }
  export interface ModelExplainabilityJobInput {
    EndpointInput: EndpointInput;
  }
  export interface ModelMetrics {
    /**
     * Metrics that measure the quality of a model.
     */
    ModelQuality?: ModelQuality;
    /**
     * Metrics that measure the quality of the input data for a model.
     */
    ModelDataQuality?: ModelDataQuality;
    /**
     * Metrics that measure bais in a model.
     */
    Bias?: Bias;
    /**
     * Metrics that help explain a model.
     */
    Explainability?: Explainability;
  }
  export type ModelName = string;
  export type ModelNameContains = string;
  export interface ModelPackage {
    /**
     * The name of the model.
     */
    ModelPackageName?: EntityName;
    /**
     * The model group to which the model belongs.
     */
    ModelPackageGroupName?: EntityName;
    /**
     * The version number of a versioned model.
     */
    ModelPackageVersion?: ModelPackageVersion;
    /**
     * The Amazon Resource Name (ARN) of the model package.
     */
    ModelPackageArn?: ModelPackageArn;
    /**
     * The description of the model package.
     */
    ModelPackageDescription?: EntityDescription;
    /**
     * The time that the model package was created.
     */
    CreationTime?: CreationTime;
    InferenceSpecification?: InferenceSpecification;
    SourceAlgorithmSpecification?: SourceAlgorithmSpecification;
    ValidationSpecification?: ModelPackageValidationSpecification;
    /**
     * The status of the model package. This can be one of the following values.    PENDING - The model package is pending being created.    IN_PROGRESS - The model package is in the process of being created.    COMPLETED - The model package was successfully created.    FAILED - The model package failed.    DELETING - The model package is in the process of being deleted.  
     */
    ModelPackageStatus?: ModelPackageStatus;
    ModelPackageStatusDetails?: ModelPackageStatusDetails;
    /**
     * Whether the model package is to be certified to be listed on Amazon Web Services Marketplace. For information about listing model packages on Amazon Web Services Marketplace, see List Your Algorithm or Model Package on Amazon Web Services Marketplace.
     */
    CertifyForMarketplace?: CertifyForMarketplace;
    /**
     * The approval status of the model. This can be one of the following values.    APPROVED - The model is approved    REJECTED - The model is rejected.    PENDING_MANUAL_APPROVAL - The model is waiting for manual approval.  
     */
    ModelApprovalStatus?: ModelApprovalStatus;
    CreatedBy?: UserContext;
    MetadataProperties?: MetadataProperties;
    /**
     * Metrics for the model.
     */
    ModelMetrics?: ModelMetrics;
    /**
     * The last time the model package was modified.
     */
    LastModifiedTime?: Timestamp;
    LastModifiedBy?: UserContext;
    /**
     * A description provided when the model approval is set.
     */
    ApprovalDescription?: ApprovalDescription;
    /**
     * A list of the tags associated with the model package. For more information, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference Guide.
     */
    Tags?: TagList;
    /**
     * The metadata properties for the model package. 
     */
    CustomerMetadataProperties?: CustomerMetadataMap;
  }
  export type ModelPackageArn = string;
  export type ModelPackageArnList = ModelPackageArn[];
  export interface ModelPackageContainerDefinition {
    /**
     * The DNS host name for the Docker container.
     */
    ContainerHostname?: ContainerHostname;
    /**
     * The Amazon EC2 Container Registry (Amazon ECR) path where inference code is stored. If you are using your own custom algorithm instead of an algorithm provided by Amazon SageMaker, the inference code must meet Amazon SageMaker requirements. Amazon SageMaker supports both registry/repository[:tag] and registry/repository[@digest] image path formats. For more information, see Using Your Own Algorithms with Amazon SageMaker.
     */
    Image: ContainerImage;
    /**
     * An MD5 hash of the training algorithm that identifies the Docker image used for training.
     */
    ImageDigest?: ImageDigest;
    /**
     * The Amazon S3 path where the model artifacts, which result from model training, are stored. This path must point to a single gzip compressed tar archive (.tar.gz suffix).  The model artifacts must be in an S3 bucket that is in the same region as the model package. 
     */
    ModelDataUrl?: Url;
    /**
     * The Amazon Web Services Marketplace product ID of the model package.
     */
    ProductId?: ProductId;
    /**
     * The environment variables to set in the Docker container. Each key and value in the Environment string to string map can have length of up to 1024. We support up to 16 entries in the map.
     */
    Environment?: EnvironmentMap;
  }
  export type ModelPackageContainerDefinitionList = ModelPackageContainerDefinition[];
  export interface ModelPackageGroup {
    /**
     * The name of the model group.
     */
    ModelPackageGroupName?: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the model group.
     */
    ModelPackageGroupArn?: ModelPackageGroupArn;
    /**
     * The description for the model group.
     */
    ModelPackageGroupDescription?: EntityDescription;
    /**
     * The time that the model group was created.
     */
    CreationTime?: CreationTime;
    CreatedBy?: UserContext;
    /**
     * The status of the model group. This can be one of the following values.    PENDING - The model group is pending being created.    IN_PROGRESS - The model group is in the process of being created.    COMPLETED - The model group was successfully created.    FAILED - The model group failed.    DELETING - The model group is in the process of being deleted.    DELETE_FAILED - SageMaker failed to delete the model group.  
     */
    ModelPackageGroupStatus?: ModelPackageGroupStatus;
    /**
     * A list of the tags associated with the model group. For more information, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference Guide.
     */
    Tags?: TagList;
  }
  export type ModelPackageGroupArn = string;
  export type ModelPackageGroupSortBy = "Name"|"CreationTime"|string;
  export type ModelPackageGroupStatus = "Pending"|"InProgress"|"Completed"|"Failed"|"Deleting"|"DeleteFailed"|string;
  export interface ModelPackageGroupSummary {
    /**
     * The name of the model group.
     */
    ModelPackageGroupName: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the model group.
     */
    ModelPackageGroupArn: ModelPackageGroupArn;
    /**
     * A description of the model group.
     */
    ModelPackageGroupDescription?: EntityDescription;
    /**
     * The time that the model group was created.
     */
    CreationTime: CreationTime;
    /**
     * The status of the model group.
     */
    ModelPackageGroupStatus: ModelPackageGroupStatus;
  }
  export type ModelPackageGroupSummaryList = ModelPackageGroupSummary[];
  export type ModelPackageSortBy = "Name"|"CreationTime"|string;
  export type ModelPackageStatus = "Pending"|"InProgress"|"Completed"|"Failed"|"Deleting"|string;
  export interface ModelPackageStatusDetails {
    /**
     * The validation status of the model package.
     */
    ValidationStatuses: ModelPackageStatusItemList;
    /**
     * The status of the scan of the Docker image container for the model package.
     */
    ImageScanStatuses?: ModelPackageStatusItemList;
  }
  export interface ModelPackageStatusItem {
    /**
     * The name of the model package for which the overall status is being reported.
     */
    Name: EntityName;
    /**
     * The current status.
     */
    Status: DetailedModelPackageStatus;
    /**
     * if the overall status is Failed, the reason for the failure.
     */
    FailureReason?: String;
  }
  export type ModelPackageStatusItemList = ModelPackageStatusItem[];
  export type ModelPackageSummaries = {[key: string]: BatchDescribeModelPackageSummary};
  export interface ModelPackageSummary {
    /**
     * The name of the model package.
     */
    ModelPackageName: EntityName;
    /**
     * If the model package is a versioned model, the model group that the versioned model belongs to.
     */
    ModelPackageGroupName?: EntityName;
    /**
     * If the model package is a versioned model, the version of the model.
     */
    ModelPackageVersion?: ModelPackageVersion;
    /**
     * The Amazon Resource Name (ARN) of the model package.
     */
    ModelPackageArn: ModelPackageArn;
    /**
     * A brief description of the model package.
     */
    ModelPackageDescription?: EntityDescription;
    /**
     * A timestamp that shows when the model package was created.
     */
    CreationTime: CreationTime;
    /**
     * The overall status of the model package.
     */
    ModelPackageStatus: ModelPackageStatus;
    /**
     * The approval status of the model. This can be one of the following values.    APPROVED - The model is approved    REJECTED - The model is rejected.    PENDING_MANUAL_APPROVAL - The model is waiting for manual approval.  
     */
    ModelApprovalStatus?: ModelApprovalStatus;
  }
  export type ModelPackageSummaryList = ModelPackageSummary[];
  export type ModelPackageType = "Versioned"|"Unversioned"|"Both"|string;
  export interface ModelPackageValidationProfile {
    /**
     * The name of the profile for the model package.
     */
    ProfileName: EntityName;
    /**
     * The TransformJobDefinition object that describes the transform job used for the validation of the model package.
     */
    TransformJobDefinition: TransformJobDefinition;
  }
  export type ModelPackageValidationProfiles = ModelPackageValidationProfile[];
  export interface ModelPackageValidationSpecification {
    /**
     * The IAM roles to be used for the validation of the model package.
     */
    ValidationRole: RoleArn;
    /**
     * An array of ModelPackageValidationProfile objects, each of which specifies a batch transform job that Amazon SageMaker runs to validate your model package.
     */
    ValidationProfiles: ModelPackageValidationProfiles;
  }
  export type ModelPackageVersion = number;
  export interface ModelQuality {
    /**
     * Model quality statistics.
     */
    Statistics?: MetricsSource;
    /**
     * Model quality constraints.
     */
    Constraints?: MetricsSource;
  }
  export interface ModelQualityAppSpecification {
    /**
     * The address of the container image that the monitoring job runs.
     */
    ImageUri: ImageUri;
    /**
     * Specifies the entrypoint for a container that the monitoring job runs.
     */
    ContainerEntrypoint?: ContainerEntrypoint;
    /**
     * An array of arguments for the container used to run the monitoring job.
     */
    ContainerArguments?: MonitoringContainerArguments;
    /**
     * An Amazon S3 URI to a script that is called per row prior to running analysis. It can base64 decode the payload and convert it into a flatted json so that the built-in container can use the converted data. Applicable only for the built-in (first party) containers.
     */
    RecordPreprocessorSourceUri?: S3Uri;
    /**
     * An Amazon S3 URI to a script that is called after analysis has been performed. Applicable only for the built-in (first party) containers.
     */
    PostAnalyticsProcessorSourceUri?: S3Uri;
    /**
     * The machine learning problem type of the model that the monitoring job monitors.
     */
    ProblemType?: MonitoringProblemType;
    /**
     * Sets the environment variables in the container that the monitoring job runs.
     */
    Environment?: MonitoringEnvironmentMap;
  }
  export interface ModelQualityBaselineConfig {
    /**
     * The name of the job that performs baselining for the monitoring job.
     */
    BaseliningJobName?: ProcessingJobName;
    ConstraintsResource?: MonitoringConstraintsResource;
  }
  export interface ModelQualityJobInput {
    EndpointInput: EndpointInput;
    /**
     * The ground truth label provided for the model.
     */
    GroundTruthS3Input: MonitoringGroundTruthS3Input;
  }
  export type ModelSortKey = "Name"|"CreationTime"|string;
  export interface ModelStepMetadata {
    /**
     * The Amazon Resource Name (ARN) of the created model.
     */
    Arn?: String256;
  }
  export interface ModelSummary {
    /**
     * The name of the model that you want a summary for.
     */
    ModelName: ModelName;
    /**
     * The Amazon Resource Name (ARN) of the model.
     */
    ModelArn: ModelArn;
    /**
     * A timestamp that indicates when the model was created.
     */
    CreationTime: Timestamp;
  }
  export type ModelSummaryList = ModelSummary[];
  export interface MonitoringAppSpecification {
    /**
     * The container image to be run by the monitoring job.
     */
    ImageUri: ImageUri;
    /**
     * Specifies the entrypoint for a container used to run the monitoring job.
     */
    ContainerEntrypoint?: ContainerEntrypoint;
    /**
     * An array of arguments for the container used to run the monitoring job.
     */
    ContainerArguments?: MonitoringContainerArguments;
    /**
     * An Amazon S3 URI to a script that is called per row prior to running analysis. It can base64 decode the payload and convert it into a flatted json so that the built-in container can use the converted data. Applicable only for the built-in (first party) containers.
     */
    RecordPreprocessorSourceUri?: S3Uri;
    /**
     * An Amazon S3 URI to a script that is called after analysis has been performed. Applicable only for the built-in (first party) containers.
     */
    PostAnalyticsProcessorSourceUri?: S3Uri;
  }
  export interface MonitoringBaselineConfig {
    /**
     * The name of the job that performs baselining for the monitoring job.
     */
    BaseliningJobName?: ProcessingJobName;
    /**
     * The baseline constraint file in Amazon S3 that the current monitoring job should validated against.
     */
    ConstraintsResource?: MonitoringConstraintsResource;
    /**
     * The baseline statistics file in Amazon S3 that the current monitoring job should be validated against.
     */
    StatisticsResource?: MonitoringStatisticsResource;
  }
  export interface MonitoringClusterConfig {
    /**
     * The number of ML compute instances to use in the model monitoring job. For distributed processing jobs, specify a value greater than 1. The default value is 1.
     */
    InstanceCount: ProcessingInstanceCount;
    /**
     * The ML compute instance type for the processing job.
     */
    InstanceType: ProcessingInstanceType;
    /**
     * The size of the ML storage volume, in gigabytes, that you want to provision. You must specify sufficient ML storage for your scenario.
     */
    VolumeSizeInGB: ProcessingVolumeSizeInGB;
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt data on the storage volume attached to the ML compute instance(s) that run the model monitoring job.
     */
    VolumeKmsKeyId?: KmsKeyId;
  }
  export interface MonitoringConstraintsResource {
    /**
     * The Amazon S3 URI for the constraints resource.
     */
    S3Uri?: S3Uri;
  }
  export type MonitoringContainerArguments = ContainerArgument[];
  export type MonitoringEnvironmentMap = {[key: string]: ProcessingEnvironmentValue};
  export type MonitoringExecutionSortKey = "CreationTime"|"ScheduledTime"|"Status"|string;
  export interface MonitoringExecutionSummary {
    /**
     * The name of the monitoring schedule.
     */
    MonitoringScheduleName: MonitoringScheduleName;
    /**
     * The time the monitoring job was scheduled.
     */
    ScheduledTime: Timestamp;
    /**
     * The time at which the monitoring job was created.
     */
    CreationTime: Timestamp;
    /**
     * A timestamp that indicates the last time the monitoring job was modified.
     */
    LastModifiedTime: Timestamp;
    /**
     * The status of the monitoring job.
     */
    MonitoringExecutionStatus: ExecutionStatus;
    /**
     * The Amazon Resource Name (ARN) of the monitoring job.
     */
    ProcessingJobArn?: ProcessingJobArn;
    /**
     * The name of the endpoint used to run the monitoring job.
     */
    EndpointName?: EndpointName;
    /**
     * Contains the reason a monitoring job failed, if it failed.
     */
    FailureReason?: FailureReason;
    /**
     * The name of the monitoring job.
     */
    MonitoringJobDefinitionName?: MonitoringJobDefinitionName;
    /**
     * The type of the monitoring job.
     */
    MonitoringType?: MonitoringType;
  }
  export type MonitoringExecutionSummaryList = MonitoringExecutionSummary[];
  export interface MonitoringGroundTruthS3Input {
    /**
     * The address of the Amazon S3 location of the ground truth labels.
     */
    S3Uri?: MonitoringS3Uri;
  }
  export interface MonitoringInput {
    /**
     * The endpoint for a monitoring job.
     */
    EndpointInput: EndpointInput;
  }
  export type MonitoringInputs = MonitoringInput[];
  export interface MonitoringJobDefinition {
    /**
     * Baseline configuration used to validate that the data conforms to the specified constraints and statistics
     */
    BaselineConfig?: MonitoringBaselineConfig;
    /**
     * The array of inputs for the monitoring job. Currently we support monitoring an Amazon SageMaker Endpoint.
     */
    MonitoringInputs: MonitoringInputs;
    /**
     * The array of outputs from the monitoring job to be uploaded to Amazon Simple Storage Service (Amazon S3).
     */
    MonitoringOutputConfig: MonitoringOutputConfig;
    /**
     * Identifies the resources, ML compute instances, and ML storage volumes to deploy for a monitoring job. In distributed processing, you specify more than one instance.
     */
    MonitoringResources: MonitoringResources;
    /**
     * Configures the monitoring job to run a specified Docker container image.
     */
    MonitoringAppSpecification: MonitoringAppSpecification;
    /**
     * Specifies a time limit for how long the monitoring job is allowed to run.
     */
    StoppingCondition?: MonitoringStoppingCondition;
    /**
     * Sets the environment variables in the Docker container.
     */
    Environment?: MonitoringEnvironmentMap;
    /**
     * Specifies networking options for an monitoring job.
     */
    NetworkConfig?: NetworkConfig;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that Amazon SageMaker can assume to perform tasks on your behalf.
     */
    RoleArn: RoleArn;
  }
  export type MonitoringJobDefinitionArn = string;
  export type MonitoringJobDefinitionName = string;
  export type MonitoringJobDefinitionSortKey = "Name"|"CreationTime"|string;
  export interface MonitoringJobDefinitionSummary {
    /**
     * The name of the monitoring job.
     */
    MonitoringJobDefinitionName: MonitoringJobDefinitionName;
    /**
     * The Amazon Resource Name (ARN) of the monitoring job.
     */
    MonitoringJobDefinitionArn: MonitoringJobDefinitionArn;
    /**
     * The time that the monitoring job was created.
     */
    CreationTime: Timestamp;
    /**
     * The name of the endpoint that the job monitors.
     */
    EndpointName: EndpointName;
  }
  export type MonitoringJobDefinitionSummaryList = MonitoringJobDefinitionSummary[];
  export type MonitoringMaxRuntimeInSeconds = number;
  export interface MonitoringNetworkConfig {
    /**
     * Whether to encrypt all communications between the instances used for the monitoring jobs. Choose True to encrypt communications. Encryption provides greater security for distributed jobs, but the processing might take longer.
     */
    EnableInterContainerTrafficEncryption?: Boolean;
    /**
     * Whether to allow inbound and outbound network calls to and from the containers used for the monitoring job.
     */
    EnableNetworkIsolation?: Boolean;
    VpcConfig?: VpcConfig;
  }
  export interface MonitoringOutput {
    /**
     * The Amazon S3 storage location where the results of a monitoring job are saved.
     */
    S3Output: MonitoringS3Output;
  }
  export interface MonitoringOutputConfig {
    /**
     * Monitoring outputs for monitoring jobs. This is where the output of the periodic monitoring jobs is uploaded.
     */
    MonitoringOutputs: MonitoringOutputs;
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt the model artifacts at rest using Amazon S3 server-side encryption.
     */
    KmsKeyId?: KmsKeyId;
  }
  export type MonitoringOutputs = MonitoringOutput[];
  export type MonitoringProblemType = "BinaryClassification"|"MulticlassClassification"|"Regression"|string;
  export interface MonitoringResources {
    /**
     * The configuration for the cluster resources used to run the processing job.
     */
    ClusterConfig: MonitoringClusterConfig;
  }
  export interface MonitoringS3Output {
    /**
     * A URI that identifies the Amazon S3 storage location where Amazon SageMaker saves the results of a monitoring job.
     */
    S3Uri: MonitoringS3Uri;
    /**
     * The local path to the Amazon S3 storage location where Amazon SageMaker saves the results of a monitoring job. LocalPath is an absolute path for the output data.
     */
    LocalPath: ProcessingLocalPath;
    /**
     * Whether to upload the results of the monitoring job continuously or after the job completes.
     */
    S3UploadMode?: ProcessingS3UploadMode;
  }
  export type MonitoringS3Uri = string;
  export interface MonitoringSchedule {
    /**
     * The Amazon Resource Name (ARN) of the monitoring schedule.
     */
    MonitoringScheduleArn?: MonitoringScheduleArn;
    /**
     * The name of the monitoring schedule.
     */
    MonitoringScheduleName?: MonitoringScheduleName;
    /**
     * The status of the monitoring schedule. This can be one of the following values.    PENDING - The schedule is pending being created.    FAILED - The schedule failed.    SCHEDULED - The schedule was successfully created.    STOPPED - The schedule was stopped.  
     */
    MonitoringScheduleStatus?: ScheduleStatus;
    /**
     * The type of the monitoring job definition to schedule.
     */
    MonitoringType?: MonitoringType;
    /**
     * If the monitoring schedule failed, the reason it failed.
     */
    FailureReason?: FailureReason;
    /**
     * The time that the monitoring schedule was created.
     */
    CreationTime?: Timestamp;
    /**
     * The last time the monitoring schedule was changed.
     */
    LastModifiedTime?: Timestamp;
    MonitoringScheduleConfig?: MonitoringScheduleConfig;
    /**
     * The endpoint that hosts the model being monitored.
     */
    EndpointName?: EndpointName;
    LastMonitoringExecutionSummary?: MonitoringExecutionSummary;
    /**
     * A list of the tags associated with the monitoring schedlue. For more information, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference Guide.
     */
    Tags?: TagList;
  }
  export type MonitoringScheduleArn = string;
  export interface MonitoringScheduleConfig {
    /**
     * Configures the monitoring schedule.
     */
    ScheduleConfig?: ScheduleConfig;
    /**
     * Defines the monitoring job.
     */
    MonitoringJobDefinition?: MonitoringJobDefinition;
    /**
     * The name of the monitoring job definition to schedule.
     */
    MonitoringJobDefinitionName?: MonitoringJobDefinitionName;
    /**
     * The type of the monitoring job definition to schedule.
     */
    MonitoringType?: MonitoringType;
  }
  export type MonitoringScheduleList = MonitoringSchedule[];
  export type MonitoringScheduleName = string;
  export type MonitoringScheduleSortKey = "Name"|"CreationTime"|"Status"|string;
  export interface MonitoringScheduleSummary {
    /**
     * The name of the monitoring schedule.
     */
    MonitoringScheduleName: MonitoringScheduleName;
    /**
     * The Amazon Resource Name (ARN) of the monitoring schedule.
     */
    MonitoringScheduleArn: MonitoringScheduleArn;
    /**
     * The creation time of the monitoring schedule.
     */
    CreationTime: Timestamp;
    /**
     * The last time the monitoring schedule was modified.
     */
    LastModifiedTime: Timestamp;
    /**
     * The status of the monitoring schedule.
     */
    MonitoringScheduleStatus: ScheduleStatus;
    /**
     * The name of the endpoint using the monitoring schedule.
     */
    EndpointName?: EndpointName;
    /**
     * The name of the monitoring job definition that the schedule is for.
     */
    MonitoringJobDefinitionName?: MonitoringJobDefinitionName;
    /**
     * The type of the monitoring job definition that the schedule is for.
     */
    MonitoringType?: MonitoringType;
  }
  export type MonitoringScheduleSummaryList = MonitoringScheduleSummary[];
  export interface MonitoringStatisticsResource {
    /**
     * The Amazon S3 URI for the statistics resource.
     */
    S3Uri?: S3Uri;
  }
  export interface MonitoringStoppingCondition {
    /**
     * The maximum runtime allowed in seconds.  The MaxRuntimeInSeconds cannot exceed the frequency of the job. For data quality and model explainability, this can be up to 3600 seconds for an hourly schedule. For model bias and model quality hourly schedules, this can be up to 1800 seconds. 
     */
    MaxRuntimeInSeconds: MonitoringMaxRuntimeInSeconds;
  }
  export type MonitoringTimeOffsetString = string;
  export type MonitoringType = "DataQuality"|"ModelQuality"|"ModelBias"|"ModelExplainability"|string;
  export type MountPath = string;
  export interface MultiModelConfig {
    /**
     * Whether to cache models for a multi-model endpoint. By default, multi-model endpoints cache models so that a model does not have to be loaded into memory each time it is invoked. Some use cases do not benefit from model caching. For example, if an endpoint hosts a large number of models that are each invoked infrequently, the endpoint might perform better if you disable model caching. To disable model caching, set the value of this parameter to Disabled.
     */
    ModelCacheSetting?: ModelCacheSetting;
  }
  export type NameContains = string;
  export interface NeoVpcConfig {
    /**
     * The VPC security group IDs. IDs have the form of sg-xxxxxxxx. Specify the security groups for the VPC that is specified in the Subnets field.
     */
    SecurityGroupIds: NeoVpcSecurityGroupIds;
    /**
     * The ID of the subnets in the VPC that you want to connect the compilation job to for accessing the model in Amazon S3.
     */
    Subnets: NeoVpcSubnets;
  }
  export type NeoVpcSecurityGroupId = string;
  export type NeoVpcSecurityGroupIds = NeoVpcSecurityGroupId[];
  export type NeoVpcSubnetId = string;
  export type NeoVpcSubnets = NeoVpcSubnetId[];
  export interface NestedFilters {
    /**
     * The name of the property to use in the nested filters. The value must match a listed property name, such as InputDataConfig.
     */
    NestedPropertyName: ResourcePropertyName;
    /**
     * A list of filters. Each filter acts on a property. Filters must contain at least one Filters value. For example, a NestedFilters call might include a filter on the PropertyName parameter of the InputDataConfig property: InputDataConfig.DataSource.S3DataSource.S3Uri.
     */
    Filters: FilterList;
  }
  export type NestedFiltersList = NestedFilters[];
  export interface NetworkConfig {
    /**
     * Whether to encrypt all communications between distributed processing jobs. Choose True to encrypt communications. Encryption provides greater security for distributed processing jobs, but the processing might take longer.
     */
    EnableInterContainerTrafficEncryption?: Boolean;
    /**
     * Whether to allow inbound and outbound network calls to and from the containers used for the processing job.
     */
    EnableNetworkIsolation?: Boolean;
    VpcConfig?: VpcConfig;
  }
  export type NetworkInterfaceId = string;
  export type NextToken = string;
  export type NotebookInstanceAcceleratorType = "ml.eia1.medium"|"ml.eia1.large"|"ml.eia1.xlarge"|"ml.eia2.medium"|"ml.eia2.large"|"ml.eia2.xlarge"|string;
  export type NotebookInstanceAcceleratorTypes = NotebookInstanceAcceleratorType[];
  export type NotebookInstanceArn = string;
  export type NotebookInstanceLifecycleConfigArn = string;
  export type NotebookInstanceLifecycleConfigContent = string;
  export type NotebookInstanceLifecycleConfigList = NotebookInstanceLifecycleHook[];
  export type NotebookInstanceLifecycleConfigName = string;
  export type NotebookInstanceLifecycleConfigNameContains = string;
  export type NotebookInstanceLifecycleConfigSortKey = "Name"|"CreationTime"|"LastModifiedTime"|string;
  export type NotebookInstanceLifecycleConfigSortOrder = "Ascending"|"Descending"|string;
  export interface NotebookInstanceLifecycleConfigSummary {
    /**
     * The name of the lifecycle configuration.
     */
    NotebookInstanceLifecycleConfigName: NotebookInstanceLifecycleConfigName;
    /**
     * The Amazon Resource Name (ARN) of the lifecycle configuration.
     */
    NotebookInstanceLifecycleConfigArn: NotebookInstanceLifecycleConfigArn;
    /**
     * A timestamp that tells when the lifecycle configuration was created.
     */
    CreationTime?: CreationTime;
    /**
     * A timestamp that tells when the lifecycle configuration was last modified.
     */
    LastModifiedTime?: LastModifiedTime;
  }
  export type NotebookInstanceLifecycleConfigSummaryList = NotebookInstanceLifecycleConfigSummary[];
  export interface NotebookInstanceLifecycleHook {
    /**
     * A base64-encoded string that contains a shell script for a notebook instance lifecycle configuration.
     */
    Content?: NotebookInstanceLifecycleConfigContent;
  }
  export type NotebookInstanceName = string;
  export type NotebookInstanceNameContains = string;
  export type NotebookInstanceSortKey = "Name"|"CreationTime"|"Status"|string;
  export type NotebookInstanceSortOrder = "Ascending"|"Descending"|string;
  export type NotebookInstanceStatus = "Pending"|"InService"|"Stopping"|"Stopped"|"Failed"|"Deleting"|"Updating"|string;
  export interface NotebookInstanceSummary {
    /**
     * The name of the notebook instance that you want a summary for.
     */
    NotebookInstanceName: NotebookInstanceName;
    /**
     * The Amazon Resource Name (ARN) of the notebook instance.
     */
    NotebookInstanceArn: NotebookInstanceArn;
    /**
     * The status of the notebook instance.
     */
    NotebookInstanceStatus?: NotebookInstanceStatus;
    /**
     * The URL that you use to connect to the Jupyter instance running in your notebook instance. 
     */
    Url?: NotebookInstanceUrl;
    /**
     * The type of ML compute instance that the notebook instance is running on.
     */
    InstanceType?: InstanceType;
    /**
     * A timestamp that shows when the notebook instance was created.
     */
    CreationTime?: CreationTime;
    /**
     * A timestamp that shows when the notebook instance was last modified.
     */
    LastModifiedTime?: LastModifiedTime;
    /**
     * The name of a notebook instance lifecycle configuration associated with this notebook instance. For information about notebook instance lifestyle configurations, see Step 2.1: (Optional) Customize a Notebook Instance.
     */
    NotebookInstanceLifecycleConfigName?: NotebookInstanceLifecycleConfigName;
    /**
     * The Git repository associated with the notebook instance as its default code repository. This can be either the name of a Git repository stored as a resource in your account, or the URL of a Git repository in Amazon Web Services CodeCommit or in any other Git repository. When you open a notebook instance, it opens in the directory that contains this repository. For more information, see Associating Git Repositories with Amazon SageMaker Notebook Instances.
     */
    DefaultCodeRepository?: CodeRepositoryNameOrUrl;
    /**
     * An array of up to three Git repositories associated with the notebook instance. These can be either the names of Git repositories stored as resources in your account, or the URL of Git repositories in Amazon Web Services CodeCommit or in any other Git repository. These repositories are cloned at the same level as the default repository of your notebook instance. For more information, see Associating Git Repositories with Amazon SageMaker Notebook Instances.
     */
    AdditionalCodeRepositories?: AdditionalCodeRepositoryNamesOrUrls;
  }
  export type NotebookInstanceSummaryList = NotebookInstanceSummary[];
  export type NotebookInstanceUrl = string;
  export type NotebookInstanceVolumeSizeInGB = number;
  export type NotebookOutputOption = "Allowed"|"Disabled"|string;
  export interface NotificationConfiguration {
    /**
     * The ARN for the Amazon SNS topic to which notifications should be published.
     */
    NotificationTopicArn?: NotificationTopicArn;
  }
  export type NotificationTopicArn = string;
  export type NumberOfHumanWorkersPerDataObject = number;
  export type ObjectiveStatus = "Succeeded"|"Pending"|"Failed"|string;
  export type ObjectiveStatusCounter = number;
  export interface ObjectiveStatusCounters {
    /**
     * The number of training jobs whose final objective metric was evaluated by the hyperparameter tuning job and used in the hyperparameter tuning process.
     */
    Succeeded?: ObjectiveStatusCounter;
    /**
     * The number of training jobs that are in progress and pending evaluation of their final objective metric.
     */
    Pending?: ObjectiveStatusCounter;
    /**
     * The number of training jobs whose final objective metric was not evaluated and used in the hyperparameter tuning process. This typically occurs when the training job failed or did not emit an objective metric.
     */
    Failed?: ObjectiveStatusCounter;
  }
  export interface OfflineStoreConfig {
    /**
     * The Amazon Simple Storage (Amazon S3) location of OfflineStore.
     */
    S3StorageConfig: S3StorageConfig;
    /**
     * Set to True to disable the automatic creation of an Amazon Web Services Glue table when configuring an OfflineStore.
     */
    DisableGlueTableCreation?: Boolean;
    /**
     * The meta data of the Glue table that is autogenerated when an OfflineStore is created. 
     */
    DataCatalogConfig?: DataCatalogConfig;
  }
  export interface OfflineStoreStatus {
    /**
     * An OfflineStore status.
     */
    Status: OfflineStoreStatusValue;
    /**
     * The justification for why the OfflineStoreStatus is Blocked (if applicable).
     */
    BlockedReason?: BlockedReason;
  }
  export type OfflineStoreStatusValue = "Active"|"Blocked"|"Disabled"|string;
  export interface OidcConfig {
    /**
     * The OIDC IdP client ID used to configure your private workforce.
     */
    ClientId: ClientId;
    /**
     * The OIDC IdP client secret used to configure your private workforce.
     */
    ClientSecret: ClientSecret;
    /**
     * The OIDC IdP issuer used to configure your private workforce.
     */
    Issuer: OidcEndpoint;
    /**
     * The OIDC IdP authorization endpoint used to configure your private workforce.
     */
    AuthorizationEndpoint: OidcEndpoint;
    /**
     * The OIDC IdP token endpoint used to configure your private workforce.
     */
    TokenEndpoint: OidcEndpoint;
    /**
     * The OIDC IdP user information endpoint used to configure your private workforce.
     */
    UserInfoEndpoint: OidcEndpoint;
    /**
     * The OIDC IdP logout endpoint used to configure your private workforce.
     */
    LogoutEndpoint: OidcEndpoint;
    /**
     * The OIDC IdP JSON Web Key Set (Jwks) URI used to configure your private workforce.
     */
    JwksUri: OidcEndpoint;
  }
  export interface OidcConfigForResponse {
    /**
     * The OIDC IdP client ID used to configure your private workforce.
     */
    ClientId?: ClientId;
    /**
     * The OIDC IdP issuer used to configure your private workforce.
     */
    Issuer?: OidcEndpoint;
    /**
     * The OIDC IdP authorization endpoint used to configure your private workforce.
     */
    AuthorizationEndpoint?: OidcEndpoint;
    /**
     * The OIDC IdP token endpoint used to configure your private workforce.
     */
    TokenEndpoint?: OidcEndpoint;
    /**
     * The OIDC IdP user information endpoint used to configure your private workforce.
     */
    UserInfoEndpoint?: OidcEndpoint;
    /**
     * The OIDC IdP logout endpoint used to configure your private workforce.
     */
    LogoutEndpoint?: OidcEndpoint;
    /**
     * The OIDC IdP JSON Web Key Set (Jwks) URI used to configure your private workforce.
     */
    JwksUri?: OidcEndpoint;
  }
  export type OidcEndpoint = string;
  export interface OidcMemberDefinition {
    /**
     * A list of comma seperated strings that identifies user groups in your OIDC IdP. Each user group is made up of a group of private workers.
     */
    Groups: Groups;
  }
  export interface OnlineStoreConfig {
    /**
     * Use to specify KMS Key ID (KMSKeyId) for at-rest encryption of your OnlineStore.
     */
    SecurityConfig?: OnlineStoreSecurityConfig;
    /**
     * Turn OnlineStore off by specifying False for the EnableOnlineStore flag. Turn OnlineStore on by specifying True for the EnableOnlineStore flag.  The default value is False.
     */
    EnableOnlineStore?: Boolean;
  }
  export interface OnlineStoreSecurityConfig {
    /**
     * The ID of the Amazon Web Services Key Management Service (Amazon Web Services KMS) key that SageMaker Feature Store uses to encrypt the Amazon S3 objects at rest using Amazon S3 server-side encryption. The caller (either IAM user or IAM role) of CreateFeatureGroup must have below permissions to the OnlineStore KmsKeyId:    "kms:Encrypt"     "kms:Decrypt"     "kms:DescribeKey"     "kms:CreateGrant"     "kms:RetireGrant"     "kms:ReEncryptFrom"     "kms:ReEncryptTo"     "kms:GenerateDataKey"     "kms:ListAliases"     "kms:ListGrants"     "kms:RevokeGrant"    The caller (either IAM user or IAM role) to all DataPlane operations (PutRecord, GetRecord, DeleteRecord) must have the following permissions to the KmsKeyId:    "kms:Decrypt"   
     */
    KmsKeyId?: KmsKeyId;
  }
  export type Operator = "Equals"|"NotEquals"|"GreaterThan"|"GreaterThanOrEqualTo"|"LessThan"|"LessThanOrEqualTo"|"Contains"|"Exists"|"NotExists"|"In"|string;
  export type OptionalDouble = number;
  export type OptionalInteger = number;
  export type OptionalVolumeSizeInGB = number;
  export type OrderKey = "Ascending"|"Descending"|string;
  export interface OutputConfig {
    /**
     * Identifies the S3 bucket where you want Amazon SageMaker to store the model artifacts. For example, s3://bucket-name/key-name-prefix.
     */
    S3OutputLocation: S3Uri;
    /**
     * Identifies the target device or the machine learning instance that you want to run your model on after the compilation has completed. Alternatively, you can specify OS, architecture, and accelerator using TargetPlatform fields. It can be used instead of TargetPlatform.
     */
    TargetDevice?: TargetDevice;
    /**
     * Contains information about a target platform that you want your model to run on, such as OS, architecture, and accelerators. It is an alternative of TargetDevice. The following examples show how to configure the TargetPlatform and CompilerOptions JSON strings for popular target platforms:    Raspberry Pi 3 Model B+  "TargetPlatform": {"Os": "LINUX", "Arch": "ARM_EABIHF"},    "CompilerOptions": {'mattr': ['+neon']}    Jetson TX2  "TargetPlatform": {"Os": "LINUX", "Arch": "ARM64", "Accelerator": "NVIDIA"},    "CompilerOptions": {'gpu-code': 'sm_62', 'trt-ver': '6.0.1', 'cuda-ver': '10.0'}    EC2 m5.2xlarge instance OS  "TargetPlatform": {"Os": "LINUX", "Arch": "X86_64", "Accelerator": "NVIDIA"},    "CompilerOptions": {'mcpu': 'skylake-avx512'}    RK3399  "TargetPlatform": {"Os": "LINUX", "Arch": "ARM64", "Accelerator": "MALI"}    ARMv7 phone (CPU)  "TargetPlatform": {"Os": "ANDROID", "Arch": "ARM_EABI"},    "CompilerOptions": {'ANDROID_PLATFORM': 25, 'mattr': ['+neon']}    ARMv8 phone (CPU)  "TargetPlatform": {"Os": "ANDROID", "Arch": "ARM64"},    "CompilerOptions": {'ANDROID_PLATFORM': 29}   
     */
    TargetPlatform?: TargetPlatform;
    /**
     * Specifies additional parameters for compiler options in JSON format. The compiler options are TargetPlatform specific. It is required for NVIDIA accelerators and highly recommended for CPU compilations. For any other cases, it is optional to specify CompilerOptions.     DTYPE: Specifies the data type for the input. When compiling for ml_* (except for ml_inf) instances using PyTorch framework, provide the data type (dtype) of the model's input. "float32" is used if "DTYPE" is not specified. Options for data type are:   float32: Use either "float" or "float32".   int64: Use either "int64" or "long".    For example, {"dtype" : "float32"}.    CPU: Compilation for CPU supports the following compiler options.    mcpu: CPU micro-architecture. For example, {'mcpu': 'skylake-avx512'}     mattr: CPU flags. For example, {'mattr': ['+neon', '+vfpv4']}       ARM: Details of ARM CPU compilations.    NEON: NEON is an implementation of the Advanced SIMD extension used in ARMv7 processors. For example, add {'mattr': ['+neon']} to the compiler options if compiling for ARM 32-bit platform with the NEON support.      NVIDIA: Compilation for NVIDIA GPU supports the following compiler options.    gpu_code: Specifies the targeted architecture.    trt-ver: Specifies the TensorRT versions in x.y.z. format.    cuda-ver: Specifies the CUDA version in x.y format.   For example, {'gpu-code': 'sm_72', 'trt-ver': '6.0.1', 'cuda-ver': '10.1'}     ANDROID: Compilation for the Android OS supports the following compiler options:    ANDROID_PLATFORM: Specifies the Android API levels. Available levels range from 21 to 29. For example, {'ANDROID_PLATFORM': 28}.    mattr: Add {'mattr': ['+neon']} to compiler options if compiling for ARM 32-bit platform with NEON support.      INFERENTIA: Compilation for target ml_inf1 uses compiler options passed in as a JSON string. For example, "CompilerOptions": "\"--verbose 1 --num-neuroncores 2 -O2\"".  For information about supported compiler options, see  Neuron Compiler CLI.     CoreML: Compilation for the CoreML OutputConfig$TargetDevice supports the following compiler options:    class_labels: Specifies the classification labels file name inside input tar.gz file. For example, {"class_labels": "imagenet_labels_1000.txt"}. Labels inside the txt file should be separated by newlines.      EIA: Compilation for the Elastic Inference Accelerator supports the following compiler options:    precision_mode: Specifies the precision of compiled artifacts. Supported values are "FP16" and "FP32". Default is "FP32".    signature_def_key: Specifies the signature to use for models in SavedModel format. Defaults is TensorFlow's default signature def key.    output_names: Specifies a list of output tensor names for models in FrozenGraph format. Set at most one API field, either: signature_def_key or output_names.   For example: {"precision_mode": "FP32", "output_names": ["output:0"]}   
     */
    CompilerOptions?: CompilerOptions;
    /**
     * The Amazon Web Services Key Management Service key (Amazon Web Services KMS) that Amazon SageMaker uses to encrypt your output models with Amazon S3 server-side encryption after compilation job. If you don't provide a KMS key ID, Amazon SageMaker uses the default KMS key for Amazon S3 for your role's account. For more information, see KMS-Managed Encryption Keys in the Amazon Simple Storage Service Developer Guide.  The KmsKeyId can be any of the following formats:    Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias name ARN: arn:aws:kms:us-west-2:111122223333:alias/ExampleAlias   
     */
    KmsKeyId?: KmsKeyId;
  }
  export interface OutputDataConfig {
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt the model artifacts at rest using Amazon S3 server-side encryption. The KmsKeyId can be any of the following formats:    // KMS Key ID  "1234abcd-12ab-34cd-56ef-1234567890ab"    // Amazon Resource Name (ARN) of a KMS Key  "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"    // KMS Key Alias  "alias/ExampleAlias"    // Amazon Resource Name (ARN) of a KMS Key Alias  "arn:aws:kms:us-west-2:111122223333:alias/ExampleAlias"    If you use a KMS key ID or an alias of your KMS key, the Amazon SageMaker execution role must include permissions to call kms:Encrypt. If you don't provide a KMS key ID, Amazon SageMaker uses the default KMS key for Amazon S3 for your role's account. Amazon SageMaker uses server-side encryption with KMS-managed keys for OutputDataConfig. If you use a bucket policy with an s3:PutObject permission that only allows objects with server-side encryption, set the condition key of s3:x-amz-server-side-encryption to "aws:kms". For more information, see KMS-Managed Encryption Keys in the Amazon Simple Storage Service Developer Guide.  The KMS key policy must grant permission to the IAM role that you specify in your CreateTrainingJob, CreateTransformJob, or CreateHyperParameterTuningJob requests. For more information, see Using Key Policies in Amazon Web Services KMS in the Amazon Web Services Key Management Service Developer Guide.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * Identifies the S3 path where you want Amazon SageMaker to store the model artifacts. For example, s3://bucket-name/key-name-prefix. 
     */
    S3OutputPath: S3Uri;
  }
  export interface OutputParameter {
    /**
     * The name of the output parameter.
     */
    Name: String256;
    /**
     * The value of the output parameter.
     */
    Value: String1024;
  }
  export type OutputParameterList = OutputParameter[];
  export type PaginationToken = string;
  export interface Parameter {
    /**
     * The name of the parameter to assign a value to. This parameter name must match a named parameter in the pipeline definition.
     */
    Name: PipelineParameterName;
    /**
     * The literal value for the parameter.
     */
    Value: String1024;
  }
  export type ParameterKey = string;
  export type ParameterList = Parameter[];
  export type ParameterName = string;
  export interface ParameterRange {
    /**
     * A IntegerParameterRangeSpecification object that defines the possible values for an integer hyperparameter.
     */
    IntegerParameterRangeSpecification?: IntegerParameterRangeSpecification;
    /**
     * A ContinuousParameterRangeSpecification object that defines the possible values for a continuous hyperparameter.
     */
    ContinuousParameterRangeSpecification?: ContinuousParameterRangeSpecification;
    /**
     * A CategoricalParameterRangeSpecification object that defines the possible values for a categorical hyperparameter.
     */
    CategoricalParameterRangeSpecification?: CategoricalParameterRangeSpecification;
  }
  export interface ParameterRanges {
    /**
     * The array of IntegerParameterRange objects that specify ranges of integer hyperparameters that a hyperparameter tuning job searches.
     */
    IntegerParameterRanges?: IntegerParameterRanges;
    /**
     * The array of ContinuousParameterRange objects that specify ranges of continuous hyperparameters that a hyperparameter tuning job searches.
     */
    ContinuousParameterRanges?: ContinuousParameterRanges;
    /**
     * The array of CategoricalParameterRange objects that specify ranges of categorical hyperparameters that a hyperparameter tuning job searches.
     */
    CategoricalParameterRanges?: CategoricalParameterRanges;
  }
  export type ParameterType = "Integer"|"Continuous"|"Categorical"|"FreeText"|string;
  export type ParameterValue = string;
  export type ParameterValues = ParameterValue[];
  export interface Parent {
    /**
     * The name of the trial.
     */
    TrialName?: ExperimentEntityName;
    /**
     * The name of the experiment.
     */
    ExperimentName?: ExperimentEntityName;
  }
  export interface ParentHyperParameterTuningJob {
    /**
     * The name of the hyperparameter tuning job to be used as a starting point for a new hyperparameter tuning job.
     */
    HyperParameterTuningJobName?: HyperParameterTuningJobName;
  }
  export type ParentHyperParameterTuningJobs = ParentHyperParameterTuningJob[];
  export type Parents = Parent[];
  export interface PendingDeploymentSummary {
    /**
     * The name of the endpoint configuration used in the deployment. 
     */
    EndpointConfigName: EndpointConfigName;
    /**
     * List of PendingProductionVariantSummary objects.
     */
    ProductionVariants?: PendingProductionVariantSummaryList;
    /**
     * The start time of the deployment.
     */
    StartTime?: Timestamp;
  }
  export interface PendingProductionVariantSummary {
    /**
     * The name of the variant.
     */
    VariantName: VariantName;
    /**
     * An array of DeployedImage objects that specify the Amazon EC2 Container Registry paths of the inference images deployed on instances of this ProductionVariant.
     */
    DeployedImages?: DeployedImages;
    /**
     * The weight associated with the variant.
     */
    CurrentWeight?: VariantWeight;
    /**
     * The requested weight for the variant in this deployment, as specified in the endpoint configuration for the endpoint. The value is taken from the request to the  CreateEndpointConfig  operation.
     */
    DesiredWeight?: VariantWeight;
    /**
     * The number of instances associated with the variant.
     */
    CurrentInstanceCount?: TaskCount;
    /**
     * The number of instances requested in this deployment, as specified in the endpoint configuration for the endpoint. The value is taken from the request to the  CreateEndpointConfig  operation.
     */
    DesiredInstanceCount?: TaskCount;
    /**
     * The type of instances associated with the variant.
     */
    InstanceType?: ProductionVariantInstanceType;
    /**
     * The size of the Elastic Inference (EI) instance to use for the production variant. EI instances provide on-demand GPU computing for inference. For more information, see Using Elastic Inference in Amazon SageMaker.
     */
    AcceleratorType?: ProductionVariantAcceleratorType;
    /**
     * The endpoint variant status which describes the current deployment stage status or operational status.
     */
    VariantStatus?: ProductionVariantStatusList;
  }
  export type PendingProductionVariantSummaryList = PendingProductionVariantSummary[];
  export interface Pipeline {
    /**
     * The Amazon Resource Name (ARN) of the pipeline.
     */
    PipelineArn?: PipelineArn;
    /**
     * The name of the pipeline.
     */
    PipelineName?: PipelineName;
    /**
     * The display name of the pipeline.
     */
    PipelineDisplayName?: PipelineName;
    /**
     * The description of the pipeline.
     */
    PipelineDescription?: PipelineDescription;
    /**
     * The Amazon Resource Name (ARN) of the role that created the pipeline.
     */
    RoleArn?: RoleArn;
    /**
     * The status of the pipeline.
     */
    PipelineStatus?: PipelineStatus;
    /**
     * The creation time of the pipeline.
     */
    CreationTime?: Timestamp;
    /**
     * The time that the pipeline was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The time when the pipeline was last run.
     */
    LastRunTime?: Timestamp;
    CreatedBy?: UserContext;
    LastModifiedBy?: UserContext;
    /**
     * A list of tags that apply to the pipeline.
     */
    Tags?: TagList;
  }
  export type PipelineArn = string;
  export type PipelineDefinition = string;
  export type PipelineDescription = string;
  export interface PipelineExecution {
    /**
     * The Amazon Resource Name (ARN) of the pipeline that was executed.
     */
    PipelineArn?: PipelineArn;
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn?: PipelineExecutionArn;
    /**
     * The display name of the pipeline execution.
     */
    PipelineExecutionDisplayName?: PipelineExecutionName;
    /**
     * The status of the pipeline status.
     */
    PipelineExecutionStatus?: PipelineExecutionStatus;
    /**
     * The description of the pipeline execution.
     */
    PipelineExecutionDescription?: PipelineExecutionDescription;
    PipelineExperimentConfig?: PipelineExperimentConfig;
    /**
     * If the execution failed, a message describing why.
     */
    FailureReason?: PipelineExecutionFailureReason;
    /**
     * The creation time of the pipeline execution.
     */
    CreationTime?: Timestamp;
    /**
     * The time that the pipeline execution was last modified.
     */
    LastModifiedTime?: Timestamp;
    CreatedBy?: UserContext;
    LastModifiedBy?: UserContext;
    /**
     * Contains a list of pipeline parameters. This list can be empty. 
     */
    PipelineParameters?: ParameterList;
  }
  export type PipelineExecutionArn = string;
  export type PipelineExecutionDescription = string;
  export type PipelineExecutionFailureReason = string;
  export type PipelineExecutionName = string;
  export type PipelineExecutionStatus = "Executing"|"Stopping"|"Stopped"|"Failed"|"Succeeded"|string;
  export interface PipelineExecutionStep {
    /**
     * The name of the step that is executed.
     */
    StepName?: StepName;
    /**
     * The time that the step started executing.
     */
    StartTime?: Timestamp;
    /**
     * The time that the step stopped executing.
     */
    EndTime?: Timestamp;
    /**
     * The status of the step execution.
     */
    StepStatus?: StepStatus;
    /**
     * If this pipeline execution step was cached, details on the cache hit.
     */
    CacheHitResult?: CacheHitResult;
    /**
     * The reason why the step failed execution. This is only returned if the step failed its execution.
     */
    FailureReason?: FailureReason;
    /**
     * Metadata for the step execution.
     */
    Metadata?: PipelineExecutionStepMetadata;
  }
  export type PipelineExecutionStepList = PipelineExecutionStep[];
  export interface PipelineExecutionStepMetadata {
    /**
     * The Amazon Resource Name (ARN) of the training job that was run by this step execution.
     */
    TrainingJob?: TrainingJobStepMetadata;
    /**
     * The Amazon Resource Name (ARN) of the processing job that was run by this step execution.
     */
    ProcessingJob?: ProcessingJobStepMetadata;
    /**
     * The Amazon Resource Name (ARN) of the transform job that was run by this step execution.
     */
    TransformJob?: TransformJobStepMetadata;
    /**
     * The Amazon Resource Name (ARN) of the tuning job that was run by this step execution.
     */
    TuningJob?: TuningJobStepMetaData;
    /**
     * The Amazon Resource Name (ARN) of the model that was created by this step execution.
     */
    Model?: ModelStepMetadata;
    /**
     * The Amazon Resource Name (ARN) of the model package the model was registered to by this step execution.
     */
    RegisterModel?: RegisterModelStepMetadata;
    /**
     * The outcome of the condition evaluation that was run by this step execution.
     */
    Condition?: ConditionStepMetadata;
    /**
     * The URL of the Amazon SQS queue used by this step execution, the pipeline generated token, and a list of output parameters.
     */
    Callback?: CallbackStepMetadata;
    /**
     * The Amazon Resource Name (ARN) of the Lambda function that was run by this step execution and a list of output parameters.
     */
    Lambda?: LambdaStepMetadata;
  }
  export interface PipelineExecutionSummary {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn?: PipelineExecutionArn;
    /**
     * The start time of the pipeline execution.
     */
    StartTime?: Timestamp;
    /**
     * The status of the pipeline execution.
     */
    PipelineExecutionStatus?: PipelineExecutionStatus;
    /**
     * The description of the pipeline execution.
     */
    PipelineExecutionDescription?: PipelineExecutionDescription;
    /**
     * The display name of the pipeline execution.
     */
    PipelineExecutionDisplayName?: PipelineExecutionName;
  }
  export type PipelineExecutionSummaryList = PipelineExecutionSummary[];
  export interface PipelineExperimentConfig {
    /**
     * The name of the experiment.
     */
    ExperimentName?: ExperimentEntityName;
    /**
     * The name of the trial.
     */
    TrialName?: ExperimentEntityName;
  }
  export type PipelineName = string;
  export type PipelineParameterName = string;
  export type PipelineStatus = "Active"|string;
  export interface PipelineSummary {
    /**
     *  The Amazon Resource Name (ARN) of the pipeline.
     */
    PipelineArn?: PipelineArn;
    /**
     * The name of the pipeline.
     */
    PipelineName?: PipelineName;
    /**
     * The display name of the pipeline.
     */
    PipelineDisplayName?: PipelineName;
    /**
     * The description of the pipeline.
     */
    PipelineDescription?: PipelineDescription;
    /**
     * The Amazon Resource Name (ARN) that the pipeline used to execute.
     */
    RoleArn?: RoleArn;
    /**
     * The creation time of the pipeline.
     */
    CreationTime?: Timestamp;
    /**
     * The time that the pipeline was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The last time that a pipeline execution began.
     */
    LastExecutionTime?: Timestamp;
  }
  export type PipelineSummaryList = PipelineSummary[];
  export type PlatformIdentifier = string;
  export type PolicyString = string;
  export type PresignedDomainUrl = string;
  export type ProbabilityThresholdAttribute = number;
  export type ProblemType = "BinaryClassification"|"MulticlassClassification"|"Regression"|string;
  export interface ProcessingClusterConfig {
    /**
     * The number of ML compute instances to use in the processing job. For distributed processing jobs, specify a value greater than 1. The default value is 1.
     */
    InstanceCount: ProcessingInstanceCount;
    /**
     * The ML compute instance type for the processing job.
     */
    InstanceType: ProcessingInstanceType;
    /**
     * The size of the ML storage volume in gigabytes that you want to provision. You must specify sufficient ML storage for your scenario.  Certain Nitro-based instances include local storage with a fixed total size, dependent on the instance type. When using these instances for processing, Amazon SageMaker mounts the local instance storage instead of Amazon EBS gp2 storage. You can't request a VolumeSizeInGB greater than the total size of the local instance storage. For a list of instance types that support local instance storage, including the total size per instance type, see Instance Store Volumes. 
     */
    VolumeSizeInGB: ProcessingVolumeSizeInGB;
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt data on the storage volume attached to the ML compute instance(s) that run the processing job.   Certain Nitro-based instances include local storage, dependent on the instance type. Local storage volumes are encrypted using a hardware module on the instance. You can't request a VolumeKmsKeyId when using an instance type with local storage. For a list of instance types that support local instance storage, see Instance Store Volumes. For more information about local instance storage encryption, see SSD Instance Store Volumes. 
     */
    VolumeKmsKeyId?: KmsKeyId;
  }
  export type ProcessingEnvironmentKey = string;
  export type ProcessingEnvironmentMap = {[key: string]: ProcessingEnvironmentValue};
  export type ProcessingEnvironmentValue = string;
  export interface ProcessingFeatureStoreOutput {
    /**
     * The name of the Amazon SageMaker FeatureGroup to use as the destination for processing job output. Note that your processing script is responsible for putting records into your Feature Store.
     */
    FeatureGroupName: FeatureGroupName;
  }
  export interface ProcessingInput {
    /**
     * The name for the processing job input.
     */
    InputName: String;
    /**
     * When True, input operations such as data download are managed natively by the processing job application. When False (default), input operations are managed by Amazon SageMaker.
     */
    AppManaged?: AppManaged;
    /**
     * Configuration for downloading input data from Amazon S3 into the processing container.
     */
    S3Input?: ProcessingS3Input;
    /**
     * Configuration for a Dataset Definition input. 
     */
    DatasetDefinition?: DatasetDefinition;
  }
  export type ProcessingInputs = ProcessingInput[];
  export type ProcessingInstanceCount = number;
  export type ProcessingInstanceType = "ml.t3.medium"|"ml.t3.large"|"ml.t3.xlarge"|"ml.t3.2xlarge"|"ml.m4.xlarge"|"ml.m4.2xlarge"|"ml.m4.4xlarge"|"ml.m4.10xlarge"|"ml.m4.16xlarge"|"ml.c4.xlarge"|"ml.c4.2xlarge"|"ml.c4.4xlarge"|"ml.c4.8xlarge"|"ml.p2.xlarge"|"ml.p2.8xlarge"|"ml.p2.16xlarge"|"ml.p3.2xlarge"|"ml.p3.8xlarge"|"ml.p3.16xlarge"|"ml.c5.xlarge"|"ml.c5.2xlarge"|"ml.c5.4xlarge"|"ml.c5.9xlarge"|"ml.c5.18xlarge"|"ml.m5.large"|"ml.m5.xlarge"|"ml.m5.2xlarge"|"ml.m5.4xlarge"|"ml.m5.12xlarge"|"ml.m5.24xlarge"|"ml.r5.large"|"ml.r5.xlarge"|"ml.r5.2xlarge"|"ml.r5.4xlarge"|"ml.r5.8xlarge"|"ml.r5.12xlarge"|"ml.r5.16xlarge"|"ml.r5.24xlarge"|"ml.g4dn.xlarge"|"ml.g4dn.2xlarge"|"ml.g4dn.4xlarge"|"ml.g4dn.8xlarge"|"ml.g4dn.12xlarge"|"ml.g4dn.16xlarge"|string;
  export interface ProcessingJob {
    /**
     * List of input configurations for the processing job.
     */
    ProcessingInputs?: ProcessingInputs;
    ProcessingOutputConfig?: ProcessingOutputConfig;
    /**
     * The name of the processing job.
     */
    ProcessingJobName?: ProcessingJobName;
    ProcessingResources?: ProcessingResources;
    StoppingCondition?: ProcessingStoppingCondition;
    AppSpecification?: AppSpecification;
    /**
     * Sets the environment variables in the Docker container.
     */
    Environment?: ProcessingEnvironmentMap;
    NetworkConfig?: NetworkConfig;
    /**
     * The ARN of the role used to create the processing job.
     */
    RoleArn?: RoleArn;
    ExperimentConfig?: ExperimentConfig;
    /**
     * The ARN of the processing job.
     */
    ProcessingJobArn?: ProcessingJobArn;
    /**
     * The status of the processing job.
     */
    ProcessingJobStatus?: ProcessingJobStatus;
    /**
     * A string, up to one KB in size, that contains metadata from the processing container when the processing job exits.
     */
    ExitMessage?: ExitMessage;
    /**
     * A string, up to one KB in size, that contains the reason a processing job failed, if it failed.
     */
    FailureReason?: FailureReason;
    /**
     * The time that the processing job ended.
     */
    ProcessingEndTime?: Timestamp;
    /**
     * The time that the processing job started.
     */
    ProcessingStartTime?: Timestamp;
    /**
     * The time the processing job was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The time the processing job was created.
     */
    CreationTime?: Timestamp;
    /**
     * The ARN of a monitoring schedule for an endpoint associated with this processing job.
     */
    MonitoringScheduleArn?: MonitoringScheduleArn;
    /**
     * The Amazon Resource Name (ARN) of the AutoML job associated with this processing job.
     */
    AutoMLJobArn?: AutoMLJobArn;
    /**
     * The ARN of the training job associated with this processing job.
     */
    TrainingJobArn?: TrainingJobArn;
    /**
     * An array of key-value pairs. For more information, see Using Cost Allocation Tags in the Amazon Web Services Billing and Cost Management User Guide.
     */
    Tags?: TagList;
  }
  export type ProcessingJobArn = string;
  export type ProcessingJobName = string;
  export type ProcessingJobStatus = "InProgress"|"Completed"|"Failed"|"Stopping"|"Stopped"|string;
  export interface ProcessingJobStepMetadata {
    /**
     * The Amazon Resource Name (ARN) of the processing job.
     */
    Arn?: ProcessingJobArn;
  }
  export type ProcessingJobSummaries = ProcessingJobSummary[];
  export interface ProcessingJobSummary {
    /**
     * The name of the processing job.
     */
    ProcessingJobName: ProcessingJobName;
    /**
     * The Amazon Resource Name (ARN) of the processing job..
     */
    ProcessingJobArn: ProcessingJobArn;
    /**
     * The time at which the processing job was created.
     */
    CreationTime: Timestamp;
    /**
     * The time at which the processing job completed.
     */
    ProcessingEndTime?: Timestamp;
    /**
     * A timestamp that indicates the last time the processing job was modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The status of the processing job.
     */
    ProcessingJobStatus: ProcessingJobStatus;
    /**
     * A string, up to one KB in size, that contains the reason a processing job failed, if it failed.
     */
    FailureReason?: FailureReason;
    /**
     * An optional string, up to one KB in size, that contains metadata from the processing container when the processing job exits.
     */
    ExitMessage?: ExitMessage;
  }
  export type ProcessingLocalPath = string;
  export type ProcessingMaxRuntimeInSeconds = number;
  export interface ProcessingOutput {
    /**
     * The name for the processing job output.
     */
    OutputName: String;
    /**
     * Configuration for processing job outputs in Amazon S3.
     */
    S3Output?: ProcessingS3Output;
    /**
     * Configuration for processing job outputs in Amazon SageMaker Feature Store. This processing output type is only supported when AppManaged is specified. 
     */
    FeatureStoreOutput?: ProcessingFeatureStoreOutput;
    /**
     * When True, output operations such as data upload are managed natively by the processing job application. When False (default), output operations are managed by Amazon SageMaker.
     */
    AppManaged?: AppManaged;
  }
  export interface ProcessingOutputConfig {
    /**
     * An array of outputs configuring the data to upload from the processing container.
     */
    Outputs: ProcessingOutputs;
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt the processing job output. KmsKeyId can be an ID of a KMS key, ARN of a KMS key, alias of a KMS key, or alias of a KMS key. The KmsKeyId is applied to all outputs.
     */
    KmsKeyId?: KmsKeyId;
  }
  export type ProcessingOutputs = ProcessingOutput[];
  export interface ProcessingResources {
    /**
     * The configuration for the resources in a cluster used to run the processing job.
     */
    ClusterConfig: ProcessingClusterConfig;
  }
  export type ProcessingS3CompressionType = "None"|"Gzip"|string;
  export type ProcessingS3DataDistributionType = "FullyReplicated"|"ShardedByS3Key"|string;
  export type ProcessingS3DataType = "ManifestFile"|"S3Prefix"|string;
  export interface ProcessingS3Input {
    /**
     * The URI of the Amazon S3 prefix Amazon SageMaker downloads data required to run a processing job.
     */
    S3Uri: S3Uri;
    /**
     * The local path in your container where you want Amazon SageMaker to write input data to. LocalPath is an absolute path to the input data and must begin with /opt/ml/processing/. LocalPath is a required parameter when AppManaged is False (default).
     */
    LocalPath?: ProcessingLocalPath;
    /**
     * Whether you use an S3Prefix or a ManifestFile for the data type. If you choose S3Prefix, S3Uri identifies a key name prefix. Amazon SageMaker uses all objects with the specified key name prefix for the processing job. If you choose ManifestFile, S3Uri identifies an object that is a manifest file containing a list of object keys that you want Amazon SageMaker to use for the processing job.
     */
    S3DataType: ProcessingS3DataType;
    /**
     * Whether to use File or Pipe input mode. In File mode, Amazon SageMaker copies the data from the input source onto the local ML storage volume before starting your processing container. This is the most commonly used input mode. In Pipe mode, Amazon SageMaker streams input data from the source directly to your processing container into named pipes without using the ML storage volume.
     */
    S3InputMode?: ProcessingS3InputMode;
    /**
     * Whether to distribute the data from Amazon S3 to all processing instances with FullyReplicated, or whether the data from Amazon S3 is shared by Amazon S3 key, downloading one shard of data to each processing instance.
     */
    S3DataDistributionType?: ProcessingS3DataDistributionType;
    /**
     * Whether to GZIP-decompress the data in Amazon S3 as it is streamed into the processing container. Gzip can only be used when Pipe mode is specified as the S3InputMode. In Pipe mode, Amazon SageMaker streams input data from the source directly to your container without using the EBS volume.
     */
    S3CompressionType?: ProcessingS3CompressionType;
  }
  export type ProcessingS3InputMode = "Pipe"|"File"|string;
  export interface ProcessingS3Output {
    /**
     * A URI that identifies the Amazon S3 bucket where you want Amazon SageMaker to save the results of a processing job.
     */
    S3Uri: S3Uri;
    /**
     * The local path of a directory where you want Amazon SageMaker to upload its contents to Amazon S3. LocalPath is an absolute path to a directory containing output files. This directory will be created by the platform and exist when your container's entrypoint is invoked.
     */
    LocalPath: ProcessingLocalPath;
    /**
     * Whether to upload the results of the processing job continuously or after the job completes.
     */
    S3UploadMode: ProcessingS3UploadMode;
  }
  export type ProcessingS3UploadMode = "Continuous"|"EndOfJob"|string;
  export interface ProcessingStoppingCondition {
    /**
     * Specifies the maximum runtime in seconds.
     */
    MaxRuntimeInSeconds: ProcessingMaxRuntimeInSeconds;
  }
  export type ProcessingVolumeSizeInGB = number;
  export type ProductId = string;
  export type ProductListings = String[];
  export interface ProductionVariant {
    /**
     * The name of the production variant.
     */
    VariantName: VariantName;
    /**
     * The name of the model that you want to host. This is the name that you specified when creating the model.
     */
    ModelName: ModelName;
    /**
     * Number of instances to launch initially.
     */
    InitialInstanceCount: InitialTaskCount;
    /**
     * The ML compute instance type.
     */
    InstanceType: ProductionVariantInstanceType;
    /**
     * Determines initial traffic distribution among all of the models that you specify in the endpoint configuration. The traffic to a production variant is determined by the ratio of the VariantWeight to the sum of all VariantWeight values across all ProductionVariants. If unspecified, it defaults to 1.0. 
     */
    InitialVariantWeight?: VariantWeight;
    /**
     * The size of the Elastic Inference (EI) instance to use for the production variant. EI instances provide on-demand GPU computing for inference. For more information, see Using Elastic Inference in Amazon SageMaker.
     */
    AcceleratorType?: ProductionVariantAcceleratorType;
    /**
     * Specifies configuration for a core dump from the model container when the process crashes.
     */
    CoreDumpConfig?: ProductionVariantCoreDumpConfig;
  }
  export type ProductionVariantAcceleratorType = "ml.eia1.medium"|"ml.eia1.large"|"ml.eia1.xlarge"|"ml.eia2.medium"|"ml.eia2.large"|"ml.eia2.xlarge"|string;
  export interface ProductionVariantCoreDumpConfig {
    /**
     * The Amazon S3 bucket to send the core dump to.
     */
    DestinationS3Uri: DestinationS3Uri;
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt the core dump data at rest using Amazon S3 server-side encryption. The KmsKeyId can be any of the following formats:    // KMS Key ID  "1234abcd-12ab-34cd-56ef-1234567890ab"    // Amazon Resource Name (ARN) of a KMS Key  "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"    // KMS Key Alias  "alias/ExampleAlias"    // Amazon Resource Name (ARN) of a KMS Key Alias  "arn:aws:kms:us-west-2:111122223333:alias/ExampleAlias"    If you use a KMS key ID or an alias of your KMS key, the Amazon SageMaker execution role must include permissions to call kms:Encrypt. If you don't provide a KMS key ID, Amazon SageMaker uses the default KMS key for Amazon S3 for your role's account. Amazon SageMaker uses server-side encryption with KMS-managed keys for OutputDataConfig. If you use a bucket policy with an s3:PutObject permission that only allows objects with server-side encryption, set the condition key of s3:x-amz-server-side-encryption to "aws:kms". For more information, see KMS-Managed Encryption Keys in the Amazon Simple Storage Service Developer Guide.  The KMS key policy must grant permission to the IAM role that you specify in your CreateEndpoint and UpdateEndpoint requests. For more information, see Using Key Policies in Amazon Web Services KMS in the Amazon Web Services Key Management Service Developer Guide.
     */
    KmsKeyId?: KmsKeyId;
  }
  export type ProductionVariantInstanceType = "ml.t2.medium"|"ml.t2.large"|"ml.t2.xlarge"|"ml.t2.2xlarge"|"ml.m4.xlarge"|"ml.m4.2xlarge"|"ml.m4.4xlarge"|"ml.m4.10xlarge"|"ml.m4.16xlarge"|"ml.m5.large"|"ml.m5.xlarge"|"ml.m5.2xlarge"|"ml.m5.4xlarge"|"ml.m5.12xlarge"|"ml.m5.24xlarge"|"ml.m5d.large"|"ml.m5d.xlarge"|"ml.m5d.2xlarge"|"ml.m5d.4xlarge"|"ml.m5d.12xlarge"|"ml.m5d.24xlarge"|"ml.c4.large"|"ml.c4.xlarge"|"ml.c4.2xlarge"|"ml.c4.4xlarge"|"ml.c4.8xlarge"|"ml.p2.xlarge"|"ml.p2.8xlarge"|"ml.p2.16xlarge"|"ml.p3.2xlarge"|"ml.p3.8xlarge"|"ml.p3.16xlarge"|"ml.c5.large"|"ml.c5.xlarge"|"ml.c5.2xlarge"|"ml.c5.4xlarge"|"ml.c5.9xlarge"|"ml.c5.18xlarge"|"ml.c5d.large"|"ml.c5d.xlarge"|"ml.c5d.2xlarge"|"ml.c5d.4xlarge"|"ml.c5d.9xlarge"|"ml.c5d.18xlarge"|"ml.g4dn.xlarge"|"ml.g4dn.2xlarge"|"ml.g4dn.4xlarge"|"ml.g4dn.8xlarge"|"ml.g4dn.12xlarge"|"ml.g4dn.16xlarge"|"ml.r5.large"|"ml.r5.xlarge"|"ml.r5.2xlarge"|"ml.r5.4xlarge"|"ml.r5.12xlarge"|"ml.r5.24xlarge"|"ml.r5d.large"|"ml.r5d.xlarge"|"ml.r5d.2xlarge"|"ml.r5d.4xlarge"|"ml.r5d.12xlarge"|"ml.r5d.24xlarge"|"ml.inf1.xlarge"|"ml.inf1.2xlarge"|"ml.inf1.6xlarge"|"ml.inf1.24xlarge"|string;
  export type ProductionVariantList = ProductionVariant[];
  export interface ProductionVariantStatus {
    /**
     * The endpoint variant status which describes the current deployment stage status or operational status.    Creating: Creating inference resources for the production variant.    Deleting: Terminating inference resources for the production variant.    Updating: Updating capacity for the production variant.    ActivatingTraffic: Turning on traffic for the production variant.    Baking: Waiting period to monitor the CloudWatch alarms in the automatic rollback configuration.  
     */
    Status: VariantStatus;
    /**
     * A message that describes the status of the production variant.
     */
    StatusMessage?: VariantStatusMessage;
    /**
     * The start time of the current status change.
     */
    StartTime?: Timestamp;
  }
  export type ProductionVariantStatusList = ProductionVariantStatus[];
  export interface ProductionVariantSummary {
    /**
     * The name of the variant.
     */
    VariantName: VariantName;
    /**
     * An array of DeployedImage objects that specify the Amazon EC2 Container Registry paths of the inference images deployed on instances of this ProductionVariant.
     */
    DeployedImages?: DeployedImages;
    /**
     * The weight associated with the variant.
     */
    CurrentWeight?: VariantWeight;
    /**
     * The requested weight, as specified in the UpdateEndpointWeightsAndCapacities request. 
     */
    DesiredWeight?: VariantWeight;
    /**
     * The number of instances associated with the variant.
     */
    CurrentInstanceCount?: TaskCount;
    /**
     * The number of instances requested in the UpdateEndpointWeightsAndCapacities request. 
     */
    DesiredInstanceCount?: TaskCount;
    /**
     * The endpoint variant status which describes the current deployment stage status or operational status.
     */
    VariantStatus?: ProductionVariantStatusList;
  }
  export type ProductionVariantSummaryList = ProductionVariantSummary[];
  export interface ProfilerConfig {
    /**
     * Path to Amazon S3 storage location for system and framework metrics.
     */
    S3OutputPath: S3Uri;
    /**
     * A time interval for capturing system metrics in milliseconds. Available values are 100, 200, 500, 1000 (1 second), 5000 (5 seconds), and 60000 (1 minute) milliseconds. The default value is 500 milliseconds.
     */
    ProfilingIntervalInMilliseconds?: ProfilingIntervalInMilliseconds;
    /**
     * Configuration information for capturing framework metrics. Available key strings for different profiling options are DetailedProfilingConfig, PythonProfilingConfig, and DataLoaderProfilingConfig. The following codes are configuration structures for the ProfilingParameters parameter. To learn more about how to configure the ProfilingParameters parameter, see Use the SageMaker and Debugger Configuration API Operations to Create, Update, and Debug Your Training Job. 
     */
    ProfilingParameters?: ProfilingParameters;
  }
  export interface ProfilerConfigForUpdate {
    /**
     * Path to Amazon S3 storage location for system and framework metrics.
     */
    S3OutputPath?: S3Uri;
    /**
     * A time interval for capturing system metrics in milliseconds. Available values are 100, 200, 500, 1000 (1 second), 5000 (5 seconds), and 60000 (1 minute) milliseconds. The default value is 500 milliseconds.
     */
    ProfilingIntervalInMilliseconds?: ProfilingIntervalInMilliseconds;
    /**
     * Configuration information for capturing framework metrics. Available key strings for different profiling options are DetailedProfilingConfig, PythonProfilingConfig, and DataLoaderProfilingConfig. The following codes are configuration structures for the ProfilingParameters parameter. To learn more about how to configure the ProfilingParameters parameter, see Use the SageMaker and Debugger Configuration API Operations to Create, Update, and Debug Your Training Job. 
     */
    ProfilingParameters?: ProfilingParameters;
    /**
     * To disable Debugger monitoring and profiling, set to True.
     */
    DisableProfiler?: DisableProfiler;
  }
  export interface ProfilerRuleConfiguration {
    /**
     * The name of the rule configuration. It must be unique relative to other rule configuration names.
     */
    RuleConfigurationName: RuleConfigurationName;
    /**
     * Path to local storage location for output of rules. Defaults to /opt/ml/processing/output/rule/. 
     */
    LocalPath?: DirectoryPath;
    /**
     * Path to Amazon S3 storage location for rules.
     */
    S3OutputPath?: S3Uri;
    /**
     * The Amazon Elastic Container (ECR) Image for the managed rule evaluation.
     */
    RuleEvaluatorImage: AlgorithmImage;
    /**
     * The instance type to deploy a Debugger custom rule for profiling a training job.
     */
    InstanceType?: ProcessingInstanceType;
    /**
     * The size, in GB, of the ML storage volume attached to the processing instance.
     */
    VolumeSizeInGB?: OptionalVolumeSizeInGB;
    /**
     * Runtime configuration for rule container.
     */
    RuleParameters?: RuleParameters;
  }
  export type ProfilerRuleConfigurations = ProfilerRuleConfiguration[];
  export interface ProfilerRuleEvaluationStatus {
    /**
     * The name of the rule configuration.
     */
    RuleConfigurationName?: RuleConfigurationName;
    /**
     * The Amazon Resource Name (ARN) of the rule evaluation job.
     */
    RuleEvaluationJobArn?: ProcessingJobArn;
    /**
     * Status of the rule evaluation.
     */
    RuleEvaluationStatus?: RuleEvaluationStatus;
    /**
     * Details from the rule evaluation.
     */
    StatusDetails?: StatusDetails;
    /**
     * Timestamp when the rule evaluation status was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export type ProfilerRuleEvaluationStatuses = ProfilerRuleEvaluationStatus[];
  export type ProfilingIntervalInMilliseconds = number;
  export type ProfilingParameters = {[key: string]: ConfigValue};
  export type ProfilingStatus = "Enabled"|"Disabled"|string;
  export interface Project {
    /**
     * The Amazon Resource Name (ARN) of the project.
     */
    ProjectArn?: ProjectArn;
    /**
     * The name of the project.
     */
    ProjectName?: ProjectEntityName;
    /**
     * The ID of the project.
     */
    ProjectId?: ProjectId;
    /**
     * The description of the project.
     */
    ProjectDescription?: EntityDescription;
    ServiceCatalogProvisioningDetails?: ServiceCatalogProvisioningDetails;
    ServiceCatalogProvisionedProductDetails?: ServiceCatalogProvisionedProductDetails;
    /**
     * The status of the project.
     */
    ProjectStatus?: ProjectStatus;
    /**
     * Who created the project.
     */
    CreatedBy?: UserContext;
    /**
     * A timestamp specifying when the project was created.
     */
    CreationTime?: Timestamp;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
    /**
     * A timestamp container for when the project was last modified.
     */
    LastModifiedTime?: Timestamp;
    LastModifiedBy?: UserContext;
  }
  export type ProjectArn = string;
  export type ProjectEntityName = string;
  export type ProjectId = string;
  export type ProjectSortBy = "Name"|"CreationTime"|string;
  export type ProjectSortOrder = "Ascending"|"Descending"|string;
  export type ProjectStatus = "Pending"|"CreateInProgress"|"CreateCompleted"|"CreateFailed"|"DeleteInProgress"|"DeleteFailed"|"DeleteCompleted"|"UpdateInProgress"|"UpdateCompleted"|"UpdateFailed"|string;
  export interface ProjectSummary {
    /**
     * The name of the project.
     */
    ProjectName: ProjectEntityName;
    /**
     * The description of the project.
     */
    ProjectDescription?: EntityDescription;
    /**
     * The Amazon Resource Name (ARN) of the project.
     */
    ProjectArn: ProjectArn;
    /**
     * The ID of the project.
     */
    ProjectId: ProjectId;
    /**
     * The time that the project was created.
     */
    CreationTime: Timestamp;
    /**
     * The status of the project.
     */
    ProjectStatus: ProjectStatus;
  }
  export type ProjectSummaryList = ProjectSummary[];
  export type PropertyNameHint = string;
  export interface PropertyNameQuery {
    /**
     * Text that begins a property's name.
     */
    PropertyNameHint: PropertyNameHint;
  }
  export interface PropertyNameSuggestion {
    /**
     * A suggested property name based on what you entered in the search textbox in the Amazon SageMaker console.
     */
    PropertyName?: ResourcePropertyName;
  }
  export type PropertyNameSuggestionList = PropertyNameSuggestion[];
  export type ProvisionedProductStatusMessage = string;
  export interface ProvisioningParameter {
    /**
     * The key that identifies a provisioning parameter.
     */
    Key?: ProvisioningParameterKey;
    /**
     * The value of the provisioning parameter.
     */
    Value?: ProvisioningParameterValue;
  }
  export type ProvisioningParameterKey = string;
  export type ProvisioningParameterValue = string;
  export type ProvisioningParameters = ProvisioningParameter[];
  export interface PublicWorkforceTaskPrice {
    /**
     * Defines the amount of money paid to an Amazon Mechanical Turk worker in United States dollars.
     */
    AmountInUsd?: USD;
  }
  export interface PutModelPackageGroupPolicyInput {
    /**
     * The name of the model group to add a resource policy to.
     */
    ModelPackageGroupName: EntityName;
    /**
     * The resource policy for the model group.
     */
    ResourcePolicy: PolicyString;
  }
  export interface PutModelPackageGroupPolicyOutput {
    /**
     * The Amazon Resource Name (ARN) of the model package group.
     */
    ModelPackageGroupArn: ModelPackageGroupArn;
  }
  export interface RSessionAppSettings {
  }
  export type RStudioServerProAccessStatus = "ENABLED"|"DISABLED"|string;
  export interface RStudioServerProAppSettings {
    /**
     * Indicates whether the current user has access to the RStudioServerPro app.
     */
    AccessStatus?: RStudioServerProAccessStatus;
    /**
     * The level of permissions that the user has within the RStudioServerPro app. This value defaults to `User`. The `Admin` value allows the user access to the RStudio Administrative Dashboard.
     */
    UserGroup?: RStudioServerProUserGroup;
  }
  export interface RStudioServerProDomainSettings {
    /**
     * The ARN of the execution role for the RStudioServerPro Domain-level app.
     */
    DomainExecutionRoleArn: RoleArn;
    /**
     * A URL pointing to an RStudio Connect server.
     */
    RStudioConnectUrl?: String;
    /**
     * A URL pointing to an RStudio Package Manager server.
     */
    RStudioPackageManagerUrl?: String;
    DefaultResourceSpec?: ResourceSpec;
  }
  export interface RStudioServerProDomainSettingsForUpdate {
    /**
     * The execution role for the RStudioServerPro Domain-level app.
     */
    DomainExecutionRoleArn: RoleArn;
    DefaultResourceSpec?: ResourceSpec;
  }
  export type RStudioServerProUserGroup = "R_STUDIO_ADMIN"|"R_STUDIO_USER"|string;
  export type RealtimeInferenceInstanceTypes = ProductionVariantInstanceType[];
  export type RecordWrapper = "None"|"RecordIO"|string;
  export type RedshiftClusterId = string;
  export type RedshiftDatabase = string;
  export interface RedshiftDatasetDefinition {
    ClusterId: RedshiftClusterId;
    Database: RedshiftDatabase;
    DbUser: RedshiftUserName;
    QueryString: RedshiftQueryString;
    /**
     * The IAM role attached to your Redshift cluster that Amazon SageMaker uses to generate datasets.
     */
    ClusterRoleArn: RoleArn;
    /**
     * The location in Amazon S3 where the Redshift query results are stored.
     */
    OutputS3Uri: S3Uri;
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt data from a Redshift execution.
     */
    KmsKeyId?: KmsKeyId;
    OutputFormat: RedshiftResultFormat;
    OutputCompression?: RedshiftResultCompressionType;
  }
  export type RedshiftQueryString = string;
  export type RedshiftResultCompressionType = "None"|"GZIP"|"BZIP2"|"ZSTD"|"SNAPPY"|string;
  export type RedshiftResultFormat = "PARQUET"|"CSV"|string;
  export type RedshiftUserName = string;
  export interface RegisterDevicesRequest {
    /**
     * The name of the fleet.
     */
    DeviceFleetName: EntityName;
    /**
     * A list of devices to register with SageMaker Edge Manager.
     */
    Devices: Devices;
    /**
     * The tags associated with devices.
     */
    Tags?: TagList;
  }
  export interface RegisterModelStepMetadata {
    /**
     * The Amazon Resource Name (ARN) of the model package.
     */
    Arn?: String256;
  }
  export interface RenderUiTemplateRequest {
    /**
     * A Template object containing the worker UI template to render.
     */
    UiTemplate?: UiTemplate;
    /**
     * A RenderableTask object containing a representative task to render.
     */
    Task: RenderableTask;
    /**
     * The Amazon Resource Name (ARN) that has access to the S3 objects that are used by the template.
     */
    RoleArn: RoleArn;
    /**
     * The HumanTaskUiArn of the worker UI that you want to render. Do not provide a HumanTaskUiArn if you use the UiTemplate parameter. See a list of available Human Ui Amazon Resource Names (ARNs) in UiConfig.
     */
    HumanTaskUiArn?: HumanTaskUiArn;
  }
  export interface RenderUiTemplateResponse {
    /**
     * A Liquid template that renders the HTML for the worker UI.
     */
    RenderedContent: String;
    /**
     * A list of one or more RenderingError objects if any were encountered while rendering the template. If there were no errors, the list is empty.
     */
    Errors: RenderingErrorList;
  }
  export interface RenderableTask {
    /**
     * A JSON object that contains values for the variables defined in the template. It is made available to the template under the substitution variable task.input. For example, if you define a variable task.input.text in your template, you can supply the variable in the JSON object as "text": "sample text".
     */
    Input: TaskInput;
  }
  export interface RenderingError {
    /**
     * A unique identifier for a specific class of errors.
     */
    Code: String;
    /**
     * A human-readable message describing the error.
     */
    Message: String;
  }
  export type RenderingErrorList = RenderingError[];
  export type RepositoryAccessMode = "Platform"|"Vpc"|string;
  export interface RepositoryAuthConfig {
    /**
     * The Amazon Resource Name (ARN) of an Amazon Web Services Lambda function that provides credentials to authenticate to the private Docker registry where your model image is hosted. For information about how to create an Amazon Web Services Lambda function, see Create a Lambda function with the console in the Amazon Web Services Lambda Developer Guide.
     */
    RepositoryCredentialsProviderArn: RepositoryCredentialsProviderArn;
  }
  export type RepositoryCredentialsProviderArn = string;
  export interface ResolvedAttributes {
    AutoMLJobObjective?: AutoMLJobObjective;
    /**
     * The problem type.
     */
    ProblemType?: ProblemType;
    CompletionCriteria?: AutoMLJobCompletionCriteria;
  }
  export type ResourceArn = string;
  export interface ResourceConfig {
    /**
     * The ML compute instance type. 
     */
    InstanceType: TrainingInstanceType;
    /**
     * The number of ML compute instances to use. For distributed training, provide a value greater than 1. 
     */
    InstanceCount: TrainingInstanceCount;
    /**
     * The size of the ML storage volume that you want to provision.  ML storage volumes store model artifacts and incremental states. Training algorithms might also use the ML storage volume for scratch space. If you want to store the training data in the ML storage volume, choose File as the TrainingInputMode in the algorithm specification.  You must specify sufficient ML storage for your scenario.    Amazon SageMaker supports only the General Purpose SSD (gp2) ML storage volume type.    Certain Nitro-based instances include local storage with a fixed total size, dependent on the instance type. When using these instances for training, Amazon SageMaker mounts the local instance storage instead of Amazon EBS gp2 storage. You can't request a VolumeSizeInGB greater than the total size of the local instance storage. For a list of instance types that support local instance storage, including the total size per instance type, see Instance Store Volumes. 
     */
    VolumeSizeInGB: VolumeSizeInGB;
    /**
     * The Amazon Web Services KMS key that Amazon SageMaker uses to encrypt data on the storage volume attached to the ML compute instance(s) that run the training job.  Certain Nitro-based instances include local storage, dependent on the instance type. Local storage volumes are encrypted using a hardware module on the instance. You can't request a VolumeKmsKeyId when using an instance type with local storage. For a list of instance types that support local instance storage, see Instance Store Volumes. For more information about local instance storage encryption, see SSD Instance Store Volumes.  The VolumeKmsKeyId can be in any of the following formats:   // KMS Key ID  "1234abcd-12ab-34cd-56ef-1234567890ab"    // Amazon Resource Name (ARN) of a KMS Key  "arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"   
     */
    VolumeKmsKeyId?: KmsKeyId;
  }
  export type ResourceId = string;
  export interface ResourceLimits {
    /**
     * The maximum number of training jobs that a hyperparameter tuning job can launch.
     */
    MaxNumberOfTrainingJobs: MaxNumberOfTrainingJobs;
    /**
     * The maximum number of concurrent training jobs that a hyperparameter tuning job can launch.
     */
    MaxParallelTrainingJobs: MaxParallelTrainingJobs;
  }
  export type ResourcePropertyName = string;
  export interface ResourceSpec {
    /**
     * The ARN of the SageMaker image that the image version belongs to.
     */
    SageMakerImageArn?: ImageArn;
    /**
     * The ARN of the image version created on the instance.
     */
    SageMakerImageVersionArn?: ImageVersionArn;
    /**
     * The instance type that the image version runs on.
     */
    InstanceType?: AppInstanceType;
    /**
     *  The Amazon Resource Name (ARN) of the Lifecycle Configuration attached to the Resource.
     */
    LifecycleConfigArn?: StudioLifecycleConfigArn;
  }
  export type ResourceType = "TrainingJob"|"Experiment"|"ExperimentTrial"|"ExperimentTrialComponent"|"Endpoint"|"ModelPackage"|"ModelPackageGroup"|"Pipeline"|"PipelineExecution"|"FeatureGroup"|"Project"|string;
  export type ResponseMIMEType = string;
  export type ResponseMIMETypes = ResponseMIMEType[];
  export interface RetentionPolicy {
    /**
     * The default is Retain, which specifies to keep the data stored on the EFS volume. Specify Delete to delete the data stored on the EFS volume.
     */
    HomeEfsFileSystem?: RetentionType;
  }
  export type RetentionType = "Retain"|"Delete"|string;
  export interface RetryPipelineExecutionRequest {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn: PipelineExecutionArn;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than once.
     */
    ClientRequestToken: IdempotencyToken;
  }
  export interface RetryPipelineExecutionResponse {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn?: PipelineExecutionArn;
  }
  export interface RetryStrategy {
    /**
     * The number of times to retry the job. When the job is retried, it's SecondaryStatus is changed to STARTING.
     */
    MaximumRetryAttempts: MaximumRetryAttempts;
  }
  export type RoleArn = string;
  export type RootAccess = "Enabled"|"Disabled"|string;
  export type RuleConfigurationName = string;
  export type RuleEvaluationStatus = "InProgress"|"NoIssuesFound"|"IssuesFound"|"Error"|"Stopping"|"Stopped"|string;
  export type RuleParameters = {[key: string]: ConfigValue};
  export type S3DataDistribution = "FullyReplicated"|"ShardedByS3Key"|string;
  export interface S3DataSource {
    /**
     * If you choose S3Prefix, S3Uri identifies a key name prefix. Amazon SageMaker uses all objects that match the specified key name prefix for model training.  If you choose ManifestFile, S3Uri identifies an object that is a manifest file containing a list of object keys that you want Amazon SageMaker to use for model training.  If you choose AugmentedManifestFile, S3Uri identifies an object that is an augmented manifest file in JSON lines format. This file contains the data you want to use for model training. AugmentedManifestFile can only be used if the Channel's input mode is Pipe.
     */
    S3DataType: S3DataType;
    /**
     * Depending on the value specified for the S3DataType, identifies either a key name prefix or a manifest. For example:     A key name prefix might look like this: s3://bucketname/exampleprefix     A manifest might look like this: s3://bucketname/example.manifest   A manifest is an S3 object which is a JSON file consisting of an array of elements. The first element is a prefix which is followed by one or more suffixes. SageMaker appends the suffix elements to the prefix to get a full set of S3Uri. Note that the prefix must be a valid non-empty S3Uri that precludes users from specifying a manifest whose individual S3Uri is sourced from different S3 buckets.  The following code example shows a valid manifest format:   [ {"prefix": "s3://customer_bucket/some/prefix/"},    "relative/path/to/custdata-1",    "relative/path/custdata-2",    ...    "relative/path/custdata-N"   ]   This JSON is equivalent to the following S3Uri list:  s3://customer_bucket/some/prefix/relative/path/to/custdata-1   s3://customer_bucket/some/prefix/relative/path/custdata-2   ...   s3://customer_bucket/some/prefix/relative/path/custdata-N  The complete set of S3Uri in this manifest is the input data for the channel for this data source. The object that each S3Uri points to must be readable by the IAM role that Amazon SageMaker uses to perform tasks on your behalf.   
     */
    S3Uri: S3Uri;
    /**
     * If you want Amazon SageMaker to replicate the entire dataset on each ML compute instance that is launched for model training, specify FullyReplicated.  If you want Amazon SageMaker to replicate a subset of data on each ML compute instance that is launched for model training, specify ShardedByS3Key. If there are n ML compute instances launched for a training job, each instance gets approximately 1/n of the number of S3 objects. In this case, model training on each machine uses only the subset of training data.  Don't choose more ML compute instances for training than available S3 objects. If you do, some nodes won't get any data and you will pay for nodes that aren't getting any training data. This applies in both File and Pipe modes. Keep this in mind when developing algorithms.  In distributed training, where you use multiple ML compute EC2 instances, you might choose ShardedByS3Key. If the algorithm requires copying training data to the ML storage volume (when TrainingInputMode is set to File), this copies 1/n of the number of objects. 
     */
    S3DataDistributionType?: S3DataDistribution;
    /**
     * A list of one or more attribute names to use that are found in a specified augmented manifest file.
     */
    AttributeNames?: AttributeNames;
  }
  export type S3DataType = "ManifestFile"|"S3Prefix"|"AugmentedManifestFile"|string;
  export interface S3StorageConfig {
    /**
     * The S3 URI, or location in Amazon S3, of OfflineStore. S3 URIs have a format similar to the following: s3://example-bucket/prefix/.
     */
    S3Uri: S3Uri;
    /**
     * The Amazon Web Services Key Management Service (KMS) key ID of the key used to encrypt any objects written into the OfflineStore S3 location. The IAM roleARN that is passed as a parameter to CreateFeatureGroup must have below permissions to the KmsKeyId:    "kms:GenerateDataKey"   
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The S3 path where offline records are written.
     */
    ResolvedOutputS3Uri?: S3Uri;
  }
  export type S3Uri = string;
  export type SagemakerServicecatalogStatus = "Enabled"|"Disabled"|string;
  export type SamplingPercentage = number;
  export interface ScheduleConfig {
    /**
     * A cron expression that describes details about the monitoring schedule. Currently the only supported cron expressions are:   If you want to set the job to start every hour, please use the following:  Hourly: cron(0 * ? * * *)    If you want to start the job daily:  cron(0 [00-23] ? * * *)    For example, the following are valid cron expressions:   Daily at noon UTC: cron(0 12 ? * * *)    Daily at midnight UTC: cron(0 0 ? * * *)    To support running every 6, 12 hours, the following are also supported:  cron(0 [00-23]/[01-24] ? * * *)  For example, the following are valid cron expressions:   Every 12 hours, starting at 5pm UTC: cron(0 17/12 ? * * *)    Every two hours starting at midnight: cron(0 0/2 ? * * *)       Even though the cron expression is set to start at 5PM UTC, note that there could be a delay of 0-20 minutes from the actual requested time to run the execution.    We recommend that if you would like a daily schedule, you do not provide this parameter. Amazon SageMaker will pick a time for running every day.   
     */
    ScheduleExpression: ScheduleExpression;
  }
  export type ScheduleExpression = string;
  export type ScheduleStatus = "Pending"|"Failed"|"Scheduled"|"Stopped"|string;
  export interface SearchExpression {
    /**
     * A list of filter objects.
     */
    Filters?: FilterList;
    /**
     * A list of nested filter objects.
     */
    NestedFilters?: NestedFiltersList;
    /**
     * A list of search expression objects.
     */
    SubExpressions?: SearchExpressionList;
    /**
     * A Boolean operator used to evaluate the search expression. If you want every conditional statement in all lists to be satisfied for the entire search expression to be true, specify And. If only a single conditional statement needs to be true for the entire search expression to be true, specify Or. The default value is And.
     */
    Operator?: BooleanOperator;
  }
  export type SearchExpressionList = SearchExpression[];
  export interface SearchRecord {
    /**
     * The properties of a training job.
     */
    TrainingJob?: TrainingJob;
    /**
     * The properties of an experiment.
     */
    Experiment?: Experiment;
    /**
     * The properties of a trial.
     */
    Trial?: Trial;
    /**
     * The properties of a trial component.
     */
    TrialComponent?: TrialComponent;
    Endpoint?: Endpoint;
    ModelPackage?: ModelPackage;
    ModelPackageGroup?: ModelPackageGroup;
    Pipeline?: Pipeline;
    PipelineExecution?: PipelineExecution;
    FeatureGroup?: FeatureGroup;
    /**
     * The properties of a project.
     */
    Project?: Project;
  }
  export interface SearchRequest {
    /**
     * The name of the Amazon SageMaker resource to search for.
     */
    Resource: ResourceType;
    /**
     * A Boolean conditional statement. Resources must satisfy this condition to be included in search results. You must provide at least one subexpression, filter, or nested filter. The maximum number of recursive SubExpressions, NestedFilters, and Filters that can be included in a SearchExpression object is 50.
     */
    SearchExpression?: SearchExpression;
    /**
     * The name of the resource property used to sort the SearchResults. The default is LastModifiedTime.
     */
    SortBy?: ResourcePropertyName;
    /**
     * How SearchResults are ordered. Valid values are Ascending or Descending. The default is Descending.
     */
    SortOrder?: SearchSortOrder;
    /**
     * If more than MaxResults resources match the specified SearchExpression, the response includes a NextToken. The NextToken can be passed to the next SearchRequest to continue retrieving results.
     */
    NextToken?: NextToken;
    /**
     * The maximum number of results to return.
     */
    MaxResults?: MaxResults;
  }
  export interface SearchResponse {
    /**
     * A list of SearchRecord objects.
     */
    Results?: SearchResultsList;
    /**
     * If the result of the previous Search request was truncated, the response includes a NextToken. To retrieve the next set of results, use the token in the next request.
     */
    NextToken?: NextToken;
  }
  export type SearchResultsList = SearchRecord[];
  export type SearchSortOrder = "Ascending"|"Descending"|string;
  export type SecondaryStatus = "Starting"|"LaunchingMLInstances"|"PreparingTrainingStack"|"Downloading"|"DownloadingTrainingImage"|"Training"|"Uploading"|"Stopping"|"Stopped"|"MaxRuntimeExceeded"|"Completed"|"Failed"|"Interrupted"|"MaxWaitTimeExceeded"|"Updating"|"Restarting"|string;
  export interface SecondaryStatusTransition {
    /**
     * Contains a secondary status information from a training job. Status might be one of the following secondary statuses:  InProgress     Starting - Starting the training job.    Downloading - An optional stage for algorithms that support File training input mode. It indicates that data is being downloaded to the ML storage volumes.    Training - Training is in progress.    Uploading - Training is complete and the model artifacts are being uploaded to the S3 location.    Completed     Completed - The training job has completed.    Failed     Failed - The training job has failed. The reason for the failure is returned in the FailureReason field of DescribeTrainingJobResponse.    Stopped     MaxRuntimeExceeded - The job stopped because it exceeded the maximum allowed runtime.    Stopped - The training job has stopped.    Stopping     Stopping - Stopping the training job.     We no longer support the following secondary statuses:    LaunchingMLInstances     PreparingTrainingStack     DownloadingTrainingImage   
     */
    Status: SecondaryStatus;
    /**
     * A timestamp that shows when the training job transitioned to the current secondary status state.
     */
    StartTime: Timestamp;
    /**
     * A timestamp that shows when the training job transitioned out of this secondary status state into another secondary status state or when the training job has ended.
     */
    EndTime?: Timestamp;
    /**
     * A detailed description of the progress within a secondary status.  Amazon SageMaker provides secondary statuses and status messages that apply to each of them:  Starting    Starting the training job.   Launching requested ML instances.   Insufficient capacity error from EC2 while launching instances, retrying!   Launched instance was unhealthy, replacing it!   Preparing the instances for training.    Training    Downloading the training image.   Training image download completed. Training in progress.      Status messages are subject to change. Therefore, we recommend not including them in code that programmatically initiates actions. For examples, don't use status messages in if statements.  To have an overview of your training job's progress, view TrainingJobStatus and SecondaryStatus in DescribeTrainingJob, and StatusMessage together. For example, at the start of a training job, you might see the following:    TrainingJobStatus - InProgress    SecondaryStatus - Training    StatusMessage - Downloading the training image  
     */
    StatusMessage?: StatusMessage;
  }
  export type SecondaryStatusTransitions = SecondaryStatusTransition[];
  export type SecretArn = string;
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export type Seed = number;
  export interface SendPipelineExecutionStepFailureRequest {
    /**
     * The pipeline generated token from the Amazon SQS queue.
     */
    CallbackToken: CallbackToken;
    /**
     * A message describing why the step failed.
     */
    FailureReason?: String256;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than one time.
     */
    ClientRequestToken?: IdempotencyToken;
  }
  export interface SendPipelineExecutionStepFailureResponse {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn?: PipelineExecutionArn;
  }
  export interface SendPipelineExecutionStepSuccessRequest {
    /**
     * The pipeline generated token from the Amazon SQS queue.
     */
    CallbackToken: CallbackToken;
    /**
     * A list of the output parameters of the callback step.
     */
    OutputParameters?: OutputParameterList;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than one time.
     */
    ClientRequestToken?: IdempotencyToken;
  }
  export interface SendPipelineExecutionStepSuccessResponse {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn?: PipelineExecutionArn;
  }
  export type ServiceCatalogEntityId = string;
  export interface ServiceCatalogProvisionedProductDetails {
    /**
     * The ID of the provisioned product.
     */
    ProvisionedProductId?: ServiceCatalogEntityId;
    /**
     * The current status of the product.    AVAILABLE - Stable state, ready to perform any operation. The most recent operation succeeded and completed.    UNDER_CHANGE - Transitive state. Operations performed might not have valid results. Wait for an AVAILABLE status before performing operations.    TAINTED - Stable state, ready to perform any operation. The stack has completed the requested operation but is not exactly what was requested. For example, a request to update to a new version failed and the stack rolled back to the current version.    ERROR - An unexpected error occurred. The provisioned product exists but the stack is not running. For example, CloudFormation received a parameter value that was not valid and could not launch the stack.    PLAN_IN_PROGRESS - Transitive state. The plan operations were performed to provision a new product, but resources have not yet been created. After reviewing the list of resources to be created, execute the plan. Wait for an AVAILABLE status before performing operations.  
     */
    ProvisionedProductStatusMessage?: ProvisionedProductStatusMessage;
  }
  export interface ServiceCatalogProvisioningDetails {
    /**
     * The ID of the product to provision.
     */
    ProductId: ServiceCatalogEntityId;
    /**
     * The ID of the provisioning artifact.
     */
    ProvisioningArtifactId?: ServiceCatalogEntityId;
    /**
     * The path identifier of the product. This value is optional if the product has a default path, and required if the product has more than one path. 
     */
    PathId?: ServiceCatalogEntityId;
    /**
     * A list of key value pairs that you specify when you provision a product.
     */
    ProvisioningParameters?: ProvisioningParameters;
  }
  export interface ServiceCatalogProvisioningUpdateDetails {
    /**
     * The ID of the provisioning artifact.
     */
    ProvisioningArtifactId?: ServiceCatalogEntityId;
    /**
     * A list of key value pairs that you specify when you provision a product.
     */
    ProvisioningParameters?: ProvisioningParameters;
  }
  export type SessionExpirationDurationInSeconds = number;
  export interface SharingSettings {
    /**
     * Whether to include the notebook cell output when sharing the notebook. The default is Disabled.
     */
    NotebookOutputOption?: NotebookOutputOption;
    /**
     * When NotebookOutputOption is Allowed, the Amazon S3 bucket used to store the shared notebook snapshots.
     */
    S3OutputPath?: S3Uri;
    /**
     * When NotebookOutputOption is Allowed, the Amazon Web Services Key Management Service (KMS) encryption key ID used to encrypt the notebook cell output in the Amazon S3 bucket.
     */
    S3KmsKeyId?: KmsKeyId;
  }
  export interface ShuffleConfig {
    /**
     * Determines the shuffling order in ShuffleConfig value.
     */
    Seed: Seed;
  }
  export type SingleSignOnUserIdentifier = string;
  export type SnsTopicArn = string;
  export type SortActionsBy = "Name"|"CreationTime"|string;
  export type SortArtifactsBy = "CreationTime"|string;
  export type SortAssociationsBy = "SourceArn"|"DestinationArn"|"SourceType"|"DestinationType"|"CreationTime"|string;
  export type SortBy = "Name"|"CreationTime"|"Status"|string;
  export type SortContextsBy = "Name"|"CreationTime"|string;
  export type SortExperimentsBy = "Name"|"CreationTime"|string;
  export type SortOrder = "Ascending"|"Descending"|string;
  export type SortPipelineExecutionsBy = "CreationTime"|"PipelineExecutionArn"|string;
  export type SortPipelinesBy = "Name"|"CreationTime"|string;
  export type SortTrialComponentsBy = "Name"|"CreationTime"|string;
  export type SortTrialsBy = "Name"|"CreationTime"|string;
  export interface SourceAlgorithm {
    /**
     * The Amazon S3 path where the model artifacts, which result from model training, are stored. This path must point to a single gzip compressed tar archive (.tar.gz suffix).  The model artifacts must be in an S3 bucket that is in the same region as the algorithm. 
     */
    ModelDataUrl?: Url;
    /**
     * The name of an algorithm that was used to create the model package. The algorithm must be either an algorithm resource in your Amazon SageMaker account or an algorithm in Amazon Web Services Marketplace that you are subscribed to.
     */
    AlgorithmName: ArnOrName;
  }
  export type SourceAlgorithmList = SourceAlgorithm[];
  export interface SourceAlgorithmSpecification {
    /**
     * A list of the algorithms that were used to create a model package.
     */
    SourceAlgorithms: SourceAlgorithmList;
  }
  export interface SourceIpConfig {
    /**
     * A list of one to ten Classless Inter-Domain Routing (CIDR) values. Maximum: Ten CIDR values  The following Length Constraints apply to individual CIDR values in the CIDR value list. 
     */
    Cidrs: Cidrs;
  }
  export type SourceType = string;
  export type SourceUri = string;
  export type SplitType = "None"|"Line"|"RecordIO"|"TFRecord"|string;
  export interface StartMonitoringScheduleRequest {
    /**
     * The name of the schedule to start.
     */
    MonitoringScheduleName: MonitoringScheduleName;
  }
  export interface StartNotebookInstanceInput {
    /**
     * The name of the notebook instance to start.
     */
    NotebookInstanceName: NotebookInstanceName;
  }
  export interface StartPipelineExecutionRequest {
    /**
     * The name of the pipeline.
     */
    PipelineName: PipelineName;
    /**
     * The display name of the pipeline execution.
     */
    PipelineExecutionDisplayName?: PipelineExecutionName;
    /**
     * Contains a list of pipeline parameters. This list can be empty. 
     */
    PipelineParameters?: ParameterList;
    /**
     * The description of the pipeline execution.
     */
    PipelineExecutionDescription?: PipelineExecutionDescription;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than once.
     */
    ClientRequestToken: IdempotencyToken;
  }
  export interface StartPipelineExecutionResponse {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn?: PipelineExecutionArn;
  }
  export type StatusDetails = string;
  export type StatusMessage = string;
  export type StepName = string;
  export type StepStatus = "Starting"|"Executing"|"Stopping"|"Stopped"|"Failed"|"Succeeded"|string;
  export interface StopAutoMLJobRequest {
    /**
     * The name of the object you are requesting.
     */
    AutoMLJobName: AutoMLJobName;
  }
  export interface StopCompilationJobRequest {
    /**
     * The name of the model compilation job to stop.
     */
    CompilationJobName: EntityName;
  }
  export interface StopEdgePackagingJobRequest {
    /**
     * The name of the edge packaging job.
     */
    EdgePackagingJobName: EntityName;
  }
  export interface StopHyperParameterTuningJobRequest {
    /**
     * The name of the tuning job to stop.
     */
    HyperParameterTuningJobName: HyperParameterTuningJobName;
  }
  export interface StopLabelingJobRequest {
    /**
     * The name of the labeling job to stop.
     */
    LabelingJobName: LabelingJobName;
  }
  export interface StopMonitoringScheduleRequest {
    /**
     * The name of the schedule to stop.
     */
    MonitoringScheduleName: MonitoringScheduleName;
  }
  export interface StopNotebookInstanceInput {
    /**
     * The name of the notebook instance to terminate.
     */
    NotebookInstanceName: NotebookInstanceName;
  }
  export interface StopPipelineExecutionRequest {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn: PipelineExecutionArn;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the operation. An idempotent operation completes no more than once.
     */
    ClientRequestToken: IdempotencyToken;
  }
  export interface StopPipelineExecutionResponse {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn?: PipelineExecutionArn;
  }
  export interface StopProcessingJobRequest {
    /**
     * The name of the processing job to stop.
     */
    ProcessingJobName: ProcessingJobName;
  }
  export interface StopTrainingJobRequest {
    /**
     * The name of the training job to stop.
     */
    TrainingJobName: TrainingJobName;
  }
  export interface StopTransformJobRequest {
    /**
     * The name of the transform job to stop.
     */
    TransformJobName: TransformJobName;
  }
  export interface StoppingCondition {
    /**
     * The maximum length of time, in seconds, that a training or compilation job can run. For compilation jobs, if the job does not complete during this time, you will receive a TimeOut error. We recommend starting with 900 seconds and increase as necessary based on your model. For all other jobs, if the job does not complete during this time, Amazon SageMaker ends the job. When RetryStrategy is specified in the job request, MaxRuntimeInSeconds specifies the maximum time for all of the attempts in total, not each individual attempt. The default value is 1 day. The maximum value is 28 days.
     */
    MaxRuntimeInSeconds?: MaxRuntimeInSeconds;
    /**
     * The maximum length of time, in seconds, that a managed Spot training job has to complete. It is the amount of time spent waiting for Spot capacity plus the amount of time the job can run. It must be equal to or greater than MaxRuntimeInSeconds. If the job does not complete during this time, Amazon SageMaker ends the job. When RetryStrategy is specified in the job request, MaxWaitTimeInSeconds specifies the maximum time for all of the attempts in total, not each individual attempt.
     */
    MaxWaitTimeInSeconds?: MaxWaitTimeInSeconds;
  }
  export type String = string;
  export type String1024 = string;
  export type String200 = string;
  export type String2048 = string;
  export type String256 = string;
  export type String64 = string;
  export type StringParameterValue = string;
  export type StudioLifecycleConfigAppType = "JupyterServer"|"KernelGateway"|string;
  export type StudioLifecycleConfigArn = string;
  export type StudioLifecycleConfigContent = string;
  export interface StudioLifecycleConfigDetails {
    /**
     *  The Amazon Resource Name (ARN) of the Lifecycle Configuration.
     */
    StudioLifecycleConfigArn?: StudioLifecycleConfigArn;
    /**
     * The name of the Studio Lifecycle Configuration.
     */
    StudioLifecycleConfigName?: StudioLifecycleConfigName;
    /**
     * The creation time of the Studio Lifecycle Configuration.
     */
    CreationTime?: Timestamp;
    /**
     * This value is equivalent to CreationTime because Studio Lifecycle Configurations are immutable.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The App type to which the Lifecycle Configuration is attached.
     */
    StudioLifecycleConfigAppType?: StudioLifecycleConfigAppType;
  }
  export type StudioLifecycleConfigName = string;
  export type StudioLifecycleConfigSortKey = "CreationTime"|"LastModifiedTime"|"Name"|string;
  export type StudioLifecycleConfigsList = StudioLifecycleConfigDetails[];
  export type SubnetId = string;
  export type Subnets = SubnetId[];
  export interface SubscribedWorkteam {
    /**
     * The Amazon Resource Name (ARN) of the vendor that you have subscribed.
     */
    WorkteamArn: WorkteamArn;
    /**
     * The title of the service provided by the vendor in the Amazon Marketplace.
     */
    MarketplaceTitle?: String200;
    /**
     * The name of the vendor in the Amazon Marketplace.
     */
    SellerName?: String;
    /**
     * The description of the vendor from the Amazon Marketplace.
     */
    MarketplaceDescription?: String200;
    /**
     * Marketplace product listing ID.
     */
    ListingId?: String;
  }
  export type SubscribedWorkteams = SubscribedWorkteam[];
  export type Success = boolean;
  export interface SuggestionQuery {
    /**
     * Defines a property name hint. Only property names that begin with the specified hint are included in the response.
     */
    PropertyNameQuery?: PropertyNameQuery;
  }
  export type TableName = string;
  export interface Tag {
    /**
     * The tag key. Tag keys must be unique per resource.
     */
    Key: TagKey;
    /**
     * The tag value.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export type TagValue = string;
  export type TargetAttributeName = string;
  export type TargetDevice = "lambda"|"ml_m4"|"ml_m5"|"ml_c4"|"ml_c5"|"ml_p2"|"ml_p3"|"ml_g4dn"|"ml_inf1"|"ml_eia2"|"jetson_tx1"|"jetson_tx2"|"jetson_nano"|"jetson_xavier"|"rasp3b"|"imx8qm"|"deeplens"|"rk3399"|"rk3288"|"aisage"|"sbe_c"|"qcs605"|"qcs603"|"sitara_am57x"|"amba_cv22"|"amba_cv25"|"x86_win32"|"x86_win64"|"coreml"|"jacinto_tda4vm"|"imx8mplus"|string;
  export type TargetObjectiveMetricValue = number;
  export interface TargetPlatform {
    /**
     * Specifies a target platform OS.    LINUX: Linux-based operating systems.    ANDROID: Android operating systems. Android API level can be specified using the ANDROID_PLATFORM compiler option. For example, "CompilerOptions": {'ANDROID_PLATFORM': 28}   
     */
    Os: TargetPlatformOs;
    /**
     * Specifies a target platform architecture.    X86_64: 64-bit version of the x86 instruction set.    X86: 32-bit version of the x86 instruction set.    ARM64: ARMv8 64-bit CPU.    ARM_EABIHF: ARMv7 32-bit, Hard Float.    ARM_EABI: ARMv7 32-bit, Soft Float. Used by Android 32-bit ARM platform.  
     */
    Arch: TargetPlatformArch;
    /**
     * Specifies a target platform accelerator (optional).    NVIDIA: Nvidia graphics processing unit. It also requires gpu-code, trt-ver, cuda-ver compiler options    MALI: ARM Mali graphics processor    INTEL_GRAPHICS: Integrated Intel graphics  
     */
    Accelerator?: TargetPlatformAccelerator;
  }
  export type TargetPlatformAccelerator = "INTEL_GRAPHICS"|"MALI"|"NVIDIA"|string;
  export type TargetPlatformArch = "X86_64"|"X86"|"ARM64"|"ARM_EABI"|"ARM_EABIHF"|string;
  export type TargetPlatformOs = "ANDROID"|"LINUX"|string;
  export type TaskAvailabilityLifetimeInSeconds = number;
  export type TaskCount = number;
  export type TaskDescription = string;
  export type TaskInput = string;
  export type TaskKeyword = string;
  export type TaskKeywords = TaskKeyword[];
  export type TaskTimeLimitInSeconds = number;
  export type TaskTitle = string;
  export type TemplateContent = string;
  export type TemplateContentSha256 = string;
  export type TemplateUrl = string;
  export interface TensorBoardAppSettings {
    /**
     * The default instance type and the Amazon Resource Name (ARN) of the SageMaker image created on the instance.
     */
    DefaultResourceSpec?: ResourceSpec;
  }
  export interface TensorBoardOutputConfig {
    /**
     * Path to local storage location for tensorBoard output. Defaults to /opt/ml/output/tensorboard.
     */
    LocalPath?: DirectoryPath;
    /**
     * Path to Amazon S3 storage location for TensorBoard output.
     */
    S3OutputPath: S3Uri;
  }
  export type TenthFractionsOfACent = number;
  export type TerminationWaitInSeconds = number;
  export type ThingName = string;
  export type Timestamp = Date;
  export interface TrafficRoutingConfig {
    /**
     * Traffic routing strategy type.    ALL_AT_ONCE: Endpoint traffic shifts to the new fleet in a single step.     CANARY: Endpoint traffic shifts to the new fleet in two steps. The first step is the canary, which is a small portion of the traffic. The second step is the remainder of the traffic.     LINEAR: Endpoint traffic shifts to the new fleet in n steps of a configurable size.   
     */
    Type: TrafficRoutingConfigType;
    /**
     * The waiting time (in seconds) between incremental steps to turn on traffic on the new endpoint fleet.
     */
    WaitIntervalInSeconds: WaitIntervalInSeconds;
    /**
     * Batch size for the first step to turn on traffic on the new endpoint fleet. Value must be less than or equal to 50% of the variant's total instance count.
     */
    CanarySize?: CapacitySize;
    /**
     * Batch size for each step to turn on traffic on the new endpoint fleet. Value must be 10-50% of the variant's total instance count.
     */
    LinearStepSize?: CapacitySize;
  }
  export type TrafficRoutingConfigType = "ALL_AT_ONCE"|"CANARY"|"LINEAR"|string;
  export type TrainingEnvironmentKey = string;
  export type TrainingEnvironmentMap = {[key: string]: TrainingEnvironmentValue};
  export type TrainingEnvironmentValue = string;
  export type TrainingInputMode = "Pipe"|"File"|"FastFile"|string;
  export type TrainingInstanceCount = number;
  export type TrainingInstanceType = "ml.m4.xlarge"|"ml.m4.2xlarge"|"ml.m4.4xlarge"|"ml.m4.10xlarge"|"ml.m4.16xlarge"|"ml.g4dn.xlarge"|"ml.g4dn.2xlarge"|"ml.g4dn.4xlarge"|"ml.g4dn.8xlarge"|"ml.g4dn.12xlarge"|"ml.g4dn.16xlarge"|"ml.m5.large"|"ml.m5.xlarge"|"ml.m5.2xlarge"|"ml.m5.4xlarge"|"ml.m5.12xlarge"|"ml.m5.24xlarge"|"ml.c4.xlarge"|"ml.c4.2xlarge"|"ml.c4.4xlarge"|"ml.c4.8xlarge"|"ml.p2.xlarge"|"ml.p2.8xlarge"|"ml.p2.16xlarge"|"ml.p3.2xlarge"|"ml.p3.8xlarge"|"ml.p3.16xlarge"|"ml.p3dn.24xlarge"|"ml.p4d.24xlarge"|"ml.c5.xlarge"|"ml.c5.2xlarge"|"ml.c5.4xlarge"|"ml.c5.9xlarge"|"ml.c5.18xlarge"|"ml.c5n.xlarge"|"ml.c5n.2xlarge"|"ml.c5n.4xlarge"|"ml.c5n.9xlarge"|"ml.c5n.18xlarge"|string;
  export type TrainingInstanceTypes = TrainingInstanceType[];
  export interface TrainingJob {
    /**
     * The name of the training job.
     */
    TrainingJobName?: TrainingJobName;
    /**
     * The Amazon Resource Name (ARN) of the training job.
     */
    TrainingJobArn?: TrainingJobArn;
    /**
     * The Amazon Resource Name (ARN) of the associated hyperparameter tuning job if the training job was launched by a hyperparameter tuning job.
     */
    TuningJobArn?: HyperParameterTuningJobArn;
    /**
     * The Amazon Resource Name (ARN) of the labeling job.
     */
    LabelingJobArn?: LabelingJobArn;
    /**
     * The Amazon Resource Name (ARN) of the job.
     */
    AutoMLJobArn?: AutoMLJobArn;
    /**
     * Information about the Amazon S3 location that is configured for storing model artifacts.
     */
    ModelArtifacts?: ModelArtifacts;
    /**
     * The status of the training job. Training job statuses are:    InProgress - The training is in progress.    Completed - The training job has completed.    Failed - The training job has failed. To see the reason for the failure, see the FailureReason field in the response to a DescribeTrainingJobResponse call.    Stopping - The training job is stopping.    Stopped - The training job has stopped.   For more detailed information, see SecondaryStatus. 
     */
    TrainingJobStatus?: TrainingJobStatus;
    /**
     *  Provides detailed information about the state of the training job. For detailed information about the secondary status of the training job, see StatusMessage under SecondaryStatusTransition. Amazon SageMaker provides primary statuses and secondary statuses that apply to each of them:  InProgress     Starting - Starting the training job.    Downloading - An optional stage for algorithms that support File training input mode. It indicates that data is being downloaded to the ML storage volumes.    Training - Training is in progress.    Uploading - Training is complete and the model artifacts are being uploaded to the S3 location.    Completed     Completed - The training job has completed.    Failed     Failed - The training job has failed. The reason for the failure is returned in the FailureReason field of DescribeTrainingJobResponse.    Stopped     MaxRuntimeExceeded - The job stopped because it exceeded the maximum allowed runtime.    Stopped - The training job has stopped.    Stopping     Stopping - Stopping the training job.      Valid values for SecondaryStatus are subject to change.   We no longer support the following secondary statuses:    LaunchingMLInstances     PreparingTrainingStack     DownloadingTrainingImage   
     */
    SecondaryStatus?: SecondaryStatus;
    /**
     * If the training job failed, the reason it failed.
     */
    FailureReason?: FailureReason;
    /**
     * Algorithm-specific parameters.
     */
    HyperParameters?: HyperParameters;
    /**
     * Information about the algorithm used for training, and algorithm metadata.
     */
    AlgorithmSpecification?: AlgorithmSpecification;
    /**
     * The Amazon Web Services Identity and Access Management (IAM) role configured for the training job.
     */
    RoleArn?: RoleArn;
    /**
     * An array of Channel objects that describes each data input channel.
     */
    InputDataConfig?: InputDataConfig;
    /**
     * The S3 path where model artifacts that you configured when creating the job are stored. Amazon SageMaker creates subfolders for model artifacts.
     */
    OutputDataConfig?: OutputDataConfig;
    /**
     * Resources, including ML compute instances and ML storage volumes, that are configured for model training.
     */
    ResourceConfig?: ResourceConfig;
    /**
     * A VpcConfig object that specifies the VPC that this training job has access to. For more information, see Protect Training Jobs by Using an Amazon Virtual Private Cloud.
     */
    VpcConfig?: VpcConfig;
    /**
     * Specifies a limit to how long a model training job can run. It also specifies how long a managed Spot training job has to complete. When the job reaches the time limit, Amazon SageMaker ends the training job. Use this API to cap model training costs. To stop a job, Amazon SageMaker sends the algorithm the SIGTERM signal, which delays job termination for 120 seconds. Algorithms can use this 120-second window to save the model artifacts, so the results of training are not lost. 
     */
    StoppingCondition?: StoppingCondition;
    /**
     * A timestamp that indicates when the training job was created.
     */
    CreationTime?: Timestamp;
    /**
     * Indicates the time when the training job starts on training instances. You are billed for the time interval between this time and the value of TrainingEndTime. The start time in CloudWatch Logs might be later than this time. The difference is due to the time it takes to download the training data and to the size of the training container.
     */
    TrainingStartTime?: Timestamp;
    /**
     * Indicates the time when the training job ends on training instances. You are billed for the time interval between the value of TrainingStartTime and this time. For successful jobs and stopped jobs, this is the time after model artifacts are uploaded. For failed jobs, this is the time when Amazon SageMaker detects a job failure.
     */
    TrainingEndTime?: Timestamp;
    /**
     * A timestamp that indicates when the status of the training job was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * A history of all of the secondary statuses that the training job has transitioned through.
     */
    SecondaryStatusTransitions?: SecondaryStatusTransitions;
    /**
     * A list of final metric values that are set when the training job completes. Used only if the training job was configured to use metrics.
     */
    FinalMetricDataList?: FinalMetricDataList;
    /**
     * If the TrainingJob was created with network isolation, the value is set to true. If network isolation is enabled, nodes can't communicate beyond the VPC they run in.
     */
    EnableNetworkIsolation?: Boolean;
    /**
     * To encrypt all communications between ML compute instances in distributed training, choose True. Encryption provides greater security for distributed training, but training might take longer. How long it takes depends on the amount of communication between compute instances, especially if you use a deep learning algorithm in distributed training.
     */
    EnableInterContainerTrafficEncryption?: Boolean;
    /**
     * When true, enables managed spot training using Amazon EC2 Spot instances to run training jobs instead of on-demand instances. For more information, see Managed Spot Training.
     */
    EnableManagedSpotTraining?: Boolean;
    CheckpointConfig?: CheckpointConfig;
    /**
     * The training time in seconds.
     */
    TrainingTimeInSeconds?: TrainingTimeInSeconds;
    /**
     * The billable time in seconds.
     */
    BillableTimeInSeconds?: BillableTimeInSeconds;
    DebugHookConfig?: DebugHookConfig;
    ExperimentConfig?: ExperimentConfig;
    /**
     * Information about the debug rule configuration.
     */
    DebugRuleConfigurations?: DebugRuleConfigurations;
    TensorBoardOutputConfig?: TensorBoardOutputConfig;
    /**
     * Information about the evaluation status of the rules for the training job.
     */
    DebugRuleEvaluationStatuses?: DebugRuleEvaluationStatuses;
    /**
     * The environment variables to set in the Docker container.
     */
    Environment?: TrainingEnvironmentMap;
    /**
     * The number of times to retry the job when the job fails due to an InternalServerError.
     */
    RetryStrategy?: RetryStrategy;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
  }
  export type TrainingJobArn = string;
  export interface TrainingJobDefinition {
    TrainingInputMode: TrainingInputMode;
    /**
     * The hyperparameters used for the training job.
     */
    HyperParameters?: HyperParameters;
    /**
     * An array of Channel objects, each of which specifies an input source.
     */
    InputDataConfig: InputDataConfig;
    /**
     * the path to the S3 bucket where you want to store model artifacts. Amazon SageMaker creates subfolders for the artifacts.
     */
    OutputDataConfig: OutputDataConfig;
    /**
     * The resources, including the ML compute instances and ML storage volumes, to use for model training.
     */
    ResourceConfig: ResourceConfig;
    /**
     * Specifies a limit to how long a model training job can run. It also specifies how long a managed Spot training job has to complete. When the job reaches the time limit, Amazon SageMaker ends the training job. Use this API to cap model training costs. To stop a job, Amazon SageMaker sends the algorithm the SIGTERM signal, which delays job termination for 120 seconds. Algorithms can use this 120-second window to save the model artifacts.
     */
    StoppingCondition: StoppingCondition;
  }
  export type TrainingJobEarlyStoppingType = "Off"|"Auto"|string;
  export type TrainingJobName = string;
  export type TrainingJobSortByOptions = "Name"|"CreationTime"|"Status"|"FinalObjectiveMetricValue"|string;
  export type TrainingJobStatus = "InProgress"|"Completed"|"Failed"|"Stopping"|"Stopped"|string;
  export type TrainingJobStatusCounter = number;
  export interface TrainingJobStatusCounters {
    /**
     * The number of completed training jobs launched by the hyperparameter tuning job.
     */
    Completed?: TrainingJobStatusCounter;
    /**
     * The number of in-progress training jobs launched by a hyperparameter tuning job.
     */
    InProgress?: TrainingJobStatusCounter;
    /**
     * The number of training jobs that failed, but can be retried. A failed training job can be retried only if it failed because an internal service error occurred.
     */
    RetryableError?: TrainingJobStatusCounter;
    /**
     * The number of training jobs that failed and can't be retried. A failed training job can't be retried if it failed because a client error occurred.
     */
    NonRetryableError?: TrainingJobStatusCounter;
    /**
     * The number of training jobs launched by a hyperparameter tuning job that were manually stopped.
     */
    Stopped?: TrainingJobStatusCounter;
  }
  export interface TrainingJobStepMetadata {
    /**
     * The Amazon Resource Name (ARN) of the training job that was run by this step execution.
     */
    Arn?: TrainingJobArn;
  }
  export type TrainingJobSummaries = TrainingJobSummary[];
  export interface TrainingJobSummary {
    /**
     * The name of the training job that you want a summary for.
     */
    TrainingJobName: TrainingJobName;
    /**
     * The Amazon Resource Name (ARN) of the training job.
     */
    TrainingJobArn: TrainingJobArn;
    /**
     * A timestamp that shows when the training job was created.
     */
    CreationTime: Timestamp;
    /**
     * A timestamp that shows when the training job ended. This field is set only if the training job has one of the terminal statuses (Completed, Failed, or Stopped). 
     */
    TrainingEndTime?: Timestamp;
    /**
     *  Timestamp when the training job was last modified. 
     */
    LastModifiedTime?: Timestamp;
    /**
     * The status of the training job.
     */
    TrainingJobStatus: TrainingJobStatus;
  }
  export interface TrainingSpecification {
    /**
     * The Amazon ECR registry path of the Docker image that contains the training algorithm.
     */
    TrainingImage: ContainerImage;
    /**
     * An MD5 hash of the training algorithm that identifies the Docker image used for training.
     */
    TrainingImageDigest?: ImageDigest;
    /**
     * A list of the HyperParameterSpecification objects, that define the supported hyperparameters. This is required if the algorithm supports automatic model tuning.&gt;
     */
    SupportedHyperParameters?: HyperParameterSpecifications;
    /**
     * A list of the instance types that this algorithm can use for training.
     */
    SupportedTrainingInstanceTypes: TrainingInstanceTypes;
    /**
     * Indicates whether the algorithm supports distributed training. If set to false, buyers can't request more than one instance during training.
     */
    SupportsDistributedTraining?: Boolean;
    /**
     * A list of MetricDefinition objects, which are used for parsing metrics generated by the algorithm.
     */
    MetricDefinitions?: MetricDefinitionList;
    /**
     * A list of ChannelSpecification objects, which specify the input sources to be used by the algorithm.
     */
    TrainingChannels: ChannelSpecifications;
    /**
     * A list of the metrics that the algorithm emits that can be used as the objective metric in a hyperparameter tuning job.
     */
    SupportedTuningJobObjectiveMetrics?: HyperParameterTuningJobObjectives;
  }
  export type TrainingTimeInSeconds = number;
  export interface TransformDataSource {
    /**
     * The S3 location of the data source that is associated with a channel.
     */
    S3DataSource: TransformS3DataSource;
  }
  export type TransformEnvironmentKey = string;
  export type TransformEnvironmentMap = {[key: string]: TransformEnvironmentValue};
  export type TransformEnvironmentValue = string;
  export interface TransformInput {
    /**
     * Describes the location of the channel data, which is, the S3 location of the input data that the model can consume.
     */
    DataSource: TransformDataSource;
    /**
     * The multipurpose internet mail extension (MIME) type of the data. Amazon SageMaker uses the MIME type with each http call to transfer data to the transform job.
     */
    ContentType?: ContentType;
    /**
     * If your transform data is compressed, specify the compression type. Amazon SageMaker automatically decompresses the data for the transform job accordingly. The default value is None.
     */
    CompressionType?: CompressionType;
    /**
     * The method to use to split the transform job's data files into smaller batches. Splitting is necessary when the total size of each object is too large to fit in a single request. You can also use data splitting to improve performance by processing multiple concurrent mini-batches. The default value for SplitType is None, which indicates that input data files are not split, and request payloads contain the entire contents of an input object. Set the value of this parameter to Line to split records on a newline character boundary. SplitType also supports a number of record-oriented binary data formats. Currently, the supported record formats are:   RecordIO   TFRecord   When splitting is enabled, the size of a mini-batch depends on the values of the BatchStrategy and MaxPayloadInMB parameters. When the value of BatchStrategy is MultiRecord, Amazon SageMaker sends the maximum number of records in each request, up to the MaxPayloadInMB limit. If the value of BatchStrategy is SingleRecord, Amazon SageMaker sends individual records in each request.  Some data formats represent a record as a binary payload wrapped with extra padding bytes. When splitting is applied to a binary data format, padding is removed if the value of BatchStrategy is set to SingleRecord. Padding is not removed if the value of BatchStrategy is set to MultiRecord. For more information about RecordIO, see Create a Dataset Using RecordIO in the MXNet documentation. For more information about TFRecord, see Consuming TFRecord data in the TensorFlow documentation. 
     */
    SplitType?: SplitType;
  }
  export type TransformInstanceCount = number;
  export type TransformInstanceType = "ml.m4.xlarge"|"ml.m4.2xlarge"|"ml.m4.4xlarge"|"ml.m4.10xlarge"|"ml.m4.16xlarge"|"ml.c4.xlarge"|"ml.c4.2xlarge"|"ml.c4.4xlarge"|"ml.c4.8xlarge"|"ml.p2.xlarge"|"ml.p2.8xlarge"|"ml.p2.16xlarge"|"ml.p3.2xlarge"|"ml.p3.8xlarge"|"ml.p3.16xlarge"|"ml.c5.xlarge"|"ml.c5.2xlarge"|"ml.c5.4xlarge"|"ml.c5.9xlarge"|"ml.c5.18xlarge"|"ml.m5.large"|"ml.m5.xlarge"|"ml.m5.2xlarge"|"ml.m5.4xlarge"|"ml.m5.12xlarge"|"ml.m5.24xlarge"|"ml.g4dn.xlarge"|"ml.g4dn.2xlarge"|"ml.g4dn.4xlarge"|"ml.g4dn.8xlarge"|"ml.g4dn.12xlarge"|"ml.g4dn.16xlarge"|string;
  export type TransformInstanceTypes = TransformInstanceType[];
  export interface TransformJob {
    /**
     * The name of the transform job.
     */
    TransformJobName?: TransformJobName;
    /**
     * The Amazon Resource Name (ARN) of the transform job.
     */
    TransformJobArn?: TransformJobArn;
    /**
     * The status of the transform job. Transform job statuses are:    InProgress - The job is in progress.    Completed - The job has completed.    Failed - The transform job has failed. To see the reason for the failure, see the FailureReason field in the response to a DescribeTransformJob call.    Stopping - The transform job is stopping.    Stopped - The transform job has stopped.  
     */
    TransformJobStatus?: TransformJobStatus;
    /**
     * If the transform job failed, the reason it failed.
     */
    FailureReason?: FailureReason;
    /**
     * The name of the model associated with the transform job.
     */
    ModelName?: ModelName;
    /**
     * The maximum number of parallel requests that can be sent to each instance in a transform job. If MaxConcurrentTransforms is set to 0 or left unset, SageMaker checks the optional execution-parameters to determine the settings for your chosen algorithm. If the execution-parameters endpoint is not enabled, the default value is 1. For built-in algorithms, you don't need to set a value for MaxConcurrentTransforms.
     */
    MaxConcurrentTransforms?: MaxConcurrentTransforms;
    ModelClientConfig?: ModelClientConfig;
    /**
     * The maximum allowed size of the payload, in MB. A payload is the data portion of a record (without metadata). The value in MaxPayloadInMB must be greater than, or equal to, the size of a single record. To estimate the size of a record in MB, divide the size of your dataset by the number of records. To ensure that the records fit within the maximum payload size, we recommend using a slightly larger value. The default value is 6 MB. For cases where the payload might be arbitrarily large and is transmitted using HTTP chunked encoding, set the value to 0. This feature works only in supported algorithms. Currently, SageMaker built-in algorithms do not support HTTP chunked encoding.
     */
    MaxPayloadInMB?: MaxPayloadInMB;
    /**
     * Specifies the number of records to include in a mini-batch for an HTTP inference request. A record is a single unit of input data that inference can be made on. For example, a single line in a CSV file is a record.
     */
    BatchStrategy?: BatchStrategy;
    /**
     * The environment variables to set in the Docker container. We support up to 16 key and values entries in the map.
     */
    Environment?: TransformEnvironmentMap;
    TransformInput?: TransformInput;
    TransformOutput?: TransformOutput;
    TransformResources?: TransformResources;
    /**
     * A timestamp that shows when the transform Job was created.
     */
    CreationTime?: Timestamp;
    /**
     * Indicates when the transform job starts on ML instances. You are billed for the time interval between this time and the value of TransformEndTime.
     */
    TransformStartTime?: Timestamp;
    /**
     * Indicates when the transform job has been completed, or has stopped or failed. You are billed for the time interval between this time and the value of TransformStartTime.
     */
    TransformEndTime?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the labeling job that created the transform job.
     */
    LabelingJobArn?: LabelingJobArn;
    /**
     * The Amazon Resource Name (ARN) of the AutoML job that created the transform job.
     */
    AutoMLJobArn?: AutoMLJobArn;
    DataProcessing?: DataProcessing;
    ExperimentConfig?: ExperimentConfig;
    /**
     * A list of tags associated with the transform job.
     */
    Tags?: TagList;
  }
  export type TransformJobArn = string;
  export interface TransformJobDefinition {
    /**
     * The maximum number of parallel requests that can be sent to each instance in a transform job. The default value is 1.
     */
    MaxConcurrentTransforms?: MaxConcurrentTransforms;
    /**
     * The maximum payload size allowed, in MB. A payload is the data portion of a record (without metadata).
     */
    MaxPayloadInMB?: MaxPayloadInMB;
    /**
     * A string that determines the number of records included in a single mini-batch.  SingleRecord means only one record is used per mini-batch. MultiRecord means a mini-batch is set to contain as many records that can fit within the MaxPayloadInMB limit.
     */
    BatchStrategy?: BatchStrategy;
    /**
     * The environment variables to set in the Docker container. We support up to 16 key and values entries in the map.
     */
    Environment?: TransformEnvironmentMap;
    /**
     * A description of the input source and the way the transform job consumes it.
     */
    TransformInput: TransformInput;
    /**
     * Identifies the Amazon S3 location where you want Amazon SageMaker to save the results from the transform job.
     */
    TransformOutput: TransformOutput;
    /**
     * Identifies the ML compute instances for the transform job.
     */
    TransformResources: TransformResources;
  }
  export type TransformJobName = string;
  export type TransformJobStatus = "InProgress"|"Completed"|"Failed"|"Stopping"|"Stopped"|string;
  export interface TransformJobStepMetadata {
    /**
     * The Amazon Resource Name (ARN) of the transform job that was run by this step execution.
     */
    Arn?: TransformJobArn;
  }
  export type TransformJobSummaries = TransformJobSummary[];
  export interface TransformJobSummary {
    /**
     * The name of the transform job.
     */
    TransformJobName: TransformJobName;
    /**
     * The Amazon Resource Name (ARN) of the transform job.
     */
    TransformJobArn: TransformJobArn;
    /**
     * A timestamp that shows when the transform Job was created.
     */
    CreationTime: Timestamp;
    /**
     * Indicates when the transform job ends on compute instances. For successful jobs and stopped jobs, this is the exact time recorded after the results are uploaded. For failed jobs, this is when Amazon SageMaker detected that the job failed.
     */
    TransformEndTime?: Timestamp;
    /**
     * Indicates when the transform job was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * The status of the transform job.
     */
    TransformJobStatus: TransformJobStatus;
    /**
     * If the transform job failed, the reason it failed.
     */
    FailureReason?: FailureReason;
  }
  export interface TransformOutput {
    /**
     * The Amazon S3 path where you want Amazon SageMaker to store the results of the transform job. For example, s3://bucket-name/key-name-prefix. For every S3 object used as input for the transform job, batch transform stores the transformed data with an .out suffix in a corresponding subfolder in the location in the output prefix. For example, for the input data stored at s3://bucket-name/input-name-prefix/dataset01/data.csv, batch transform stores the transformed data at s3://bucket-name/output-name-prefix/input-name-prefix/data.csv.out. Batch transform doesn't upload partially processed objects. For an input S3 object that contains multiple records, it creates an .out file only if the transform job succeeds on the entire file. When the input contains multiple S3 objects, the batch transform job processes the listed S3 objects and uploads only the output for successfully processed objects. If any object fails in the transform job batch transform marks the job as failed to prompt investigation.
     */
    S3OutputPath: S3Uri;
    /**
     * The MIME type used to specify the output data. Amazon SageMaker uses the MIME type with each http call to transfer data from the transform job.
     */
    Accept?: Accept;
    /**
     * Defines how to assemble the results of the transform job as a single S3 object. Choose a format that is most convenient to you. To concatenate the results in binary format, specify None. To add a newline character at the end of every transformed record, specify Line.
     */
    AssembleWith?: AssemblyType;
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt the model artifacts at rest using Amazon S3 server-side encryption. The KmsKeyId can be any of the following formats:    Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias name ARN: arn:aws:kms:us-west-2:111122223333:alias/ExampleAlias    If you don't provide a KMS key ID, Amazon SageMaker uses the default KMS key for Amazon S3 for your role's account. For more information, see KMS-Managed Encryption Keys in the Amazon Simple Storage Service Developer Guide.  The KMS key policy must grant permission to the IAM role that you specify in your CreateModel request. For more information, see Using Key Policies in Amazon Web Services KMS in the Amazon Web Services Key Management Service Developer Guide.
     */
    KmsKeyId?: KmsKeyId;
  }
  export interface TransformResources {
    /**
     * The ML compute instance type for the transform job. If you are using built-in algorithms to transform moderately sized datasets, we recommend using ml.m4.xlarge or ml.m5.largeinstance types.
     */
    InstanceType: TransformInstanceType;
    /**
     * The number of ML compute instances to use in the transform job. For distributed transform jobs, specify a value greater than 1. The default value is 1.
     */
    InstanceCount: TransformInstanceCount;
    /**
     * The Amazon Web Services Key Management Service (Amazon Web Services KMS) key that Amazon SageMaker uses to encrypt model data on the storage volume attached to the ML compute instance(s) that run the batch transform job.  Certain Nitro-based instances include local storage, dependent on the instance type. Local storage volumes are encrypted using a hardware module on the instance. You can't request a VolumeKmsKeyId when using an instance type with local storage. For a list of instance types that support local instance storage, see Instance Store Volumes. For more information about local instance storage encryption, see SSD Instance Store Volumes.   The VolumeKmsKeyId can be any of the following formats:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias name ARN: arn:aws:kms:us-west-2:111122223333:alias/ExampleAlias   
     */
    VolumeKmsKeyId?: KmsKeyId;
  }
  export interface TransformS3DataSource {
    /**
     * If you choose S3Prefix, S3Uri identifies a key name prefix. Amazon SageMaker uses all objects with the specified key name prefix for batch transform.  If you choose ManifestFile, S3Uri identifies an object that is a manifest file containing a list of object keys that you want Amazon SageMaker to use for batch transform.  The following values are compatible: ManifestFile, S3Prefix  The following value is not compatible: AugmentedManifestFile 
     */
    S3DataType: S3DataType;
    /**
     * Depending on the value specified for the S3DataType, identifies either a key name prefix or a manifest. For example:    A key name prefix might look like this: s3://bucketname/exampleprefix.     A manifest might look like this: s3://bucketname/example.manifest   The manifest is an S3 object which is a JSON file with the following format:   [ {"prefix": "s3://customer_bucket/some/prefix/"},   "relative/path/to/custdata-1",   "relative/path/custdata-2",   ...   "relative/path/custdata-N"   ]   The preceding JSON matches the following S3Uris:   s3://customer_bucket/some/prefix/relative/path/to/custdata-1   s3://customer_bucket/some/prefix/relative/path/custdata-2   ...   s3://customer_bucket/some/prefix/relative/path/custdata-N   The complete set of S3Uris in this manifest constitutes the input data for the channel for this datasource. The object that each S3Uris points to must be readable by the IAM role that Amazon SageMaker uses to perform tasks on your behalf.  
     */
    S3Uri: S3Uri;
  }
  export interface Trial {
    /**
     * The name of the trial.
     */
    TrialName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the trial.
     */
    TrialArn?: TrialArn;
    /**
     * The name of the trial as displayed. If DisplayName isn't specified, TrialName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    /**
     * The name of the experiment the trial is part of.
     */
    ExperimentName?: ExperimentEntityName;
    Source?: TrialSource;
    /**
     * When the trial was created.
     */
    CreationTime?: Timestamp;
    /**
     * Who created the trial.
     */
    CreatedBy?: UserContext;
    /**
     * Who last modified the trial.
     */
    LastModifiedTime?: Timestamp;
    LastModifiedBy?: UserContext;
    MetadataProperties?: MetadataProperties;
    /**
     * The list of tags that are associated with the trial. You can use Search API to search on the tags.
     */
    Tags?: TagList;
    /**
     * A list of the components associated with the trial. For each component, a summary of the component's properties is included.
     */
    TrialComponentSummaries?: TrialComponentSimpleSummaries;
  }
  export type TrialArn = string;
  export interface TrialComponent {
    /**
     * The name of the trial component.
     */
    TrialComponentName?: ExperimentEntityName;
    /**
     * The name of the component as displayed. If DisplayName isn't specified, TrialComponentName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the trial component.
     */
    TrialComponentArn?: TrialComponentArn;
    /**
     * The Amazon Resource Name (ARN) and job type of the source of the component.
     */
    Source?: TrialComponentSource;
    Status?: TrialComponentStatus;
    /**
     * When the component started.
     */
    StartTime?: Timestamp;
    /**
     * When the component ended.
     */
    EndTime?: Timestamp;
    /**
     * When the component was created.
     */
    CreationTime?: Timestamp;
    /**
     * Who created the trial component.
     */
    CreatedBy?: UserContext;
    /**
     * When the component was last modified.
     */
    LastModifiedTime?: Timestamp;
    LastModifiedBy?: UserContext;
    /**
     * The hyperparameters of the component.
     */
    Parameters?: TrialComponentParameters;
    /**
     * The input artifacts of the component.
     */
    InputArtifacts?: TrialComponentArtifacts;
    /**
     * The output artifacts of the component.
     */
    OutputArtifacts?: TrialComponentArtifacts;
    /**
     * The metrics for the component.
     */
    Metrics?: TrialComponentMetricSummaries;
    MetadataProperties?: MetadataProperties;
    /**
     * Details of the source of the component.
     */
    SourceDetail?: TrialComponentSourceDetail;
    /**
     * The list of tags that are associated with the component. You can use Search API to search on the tags.
     */
    Tags?: TagList;
    /**
     * An array of the parents of the component. A parent is a trial the component is associated with and the experiment the trial is part of. A component might not have any parents.
     */
    Parents?: Parents;
  }
  export type TrialComponentArn = string;
  export interface TrialComponentArtifact {
    /**
     * The media type of the artifact, which indicates the type of data in the artifact file. The media type consists of a type and a subtype concatenated with a slash (/) character, for example, text/csv, image/jpeg, and s3/uri. The type specifies the category of the media. The subtype specifies the kind of data.
     */
    MediaType?: MediaType;
    /**
     * The location of the artifact.
     */
    Value: TrialComponentArtifactValue;
  }
  export type TrialComponentArtifactValue = string;
  export type TrialComponentArtifacts = {[key: string]: TrialComponentArtifact};
  export type TrialComponentKey256 = string;
  export type TrialComponentKey64 = string;
  export type TrialComponentMetricSummaries = TrialComponentMetricSummary[];
  export interface TrialComponentMetricSummary {
    /**
     * The name of the metric.
     */
    MetricName?: MetricName;
    /**
     * The Amazon Resource Name (ARN) of the source.
     */
    SourceArn?: TrialComponentSourceArn;
    /**
     * When the metric was last updated.
     */
    TimeStamp?: Timestamp;
    /**
     * The maximum value of the metric.
     */
    Max?: OptionalDouble;
    /**
     * The minimum value of the metric.
     */
    Min?: OptionalDouble;
    /**
     * The most recent value of the metric.
     */
    Last?: OptionalDouble;
    /**
     * The number of samples used to generate the metric.
     */
    Count?: OptionalInteger;
    /**
     * The average value of the metric.
     */
    Avg?: OptionalDouble;
    /**
     * The standard deviation of the metric.
     */
    StdDev?: OptionalDouble;
  }
  export interface TrialComponentParameterValue {
    /**
     * The string value of a categorical hyperparameter. If you specify a value for this parameter, you can't specify the NumberValue parameter.
     */
    StringValue?: StringParameterValue;
    /**
     * The numeric value of a numeric hyperparameter. If you specify a value for this parameter, you can't specify the StringValue parameter.
     */
    NumberValue?: DoubleParameterValue;
  }
  export type TrialComponentParameters = {[key: string]: TrialComponentParameterValue};
  export type TrialComponentPrimaryStatus = "InProgress"|"Completed"|"Failed"|"Stopping"|"Stopped"|string;
  export type TrialComponentSimpleSummaries = TrialComponentSimpleSummary[];
  export interface TrialComponentSimpleSummary {
    /**
     * The name of the trial component.
     */
    TrialComponentName?: ExperimentEntityName;
    /**
     * The Amazon Resource Name (ARN) of the trial component.
     */
    TrialComponentArn?: TrialComponentArn;
    TrialComponentSource?: TrialComponentSource;
    /**
     * When the component was created.
     */
    CreationTime?: Timestamp;
    CreatedBy?: UserContext;
  }
  export interface TrialComponentSource {
    /**
     * The source ARN.
     */
    SourceArn: TrialComponentSourceArn;
    /**
     * The source job type.
     */
    SourceType?: SourceType;
  }
  export type TrialComponentSourceArn = string;
  export interface TrialComponentSourceDetail {
    /**
     * The Amazon Resource Name (ARN) of the source.
     */
    SourceArn?: TrialComponentSourceArn;
    /**
     * Information about a training job that's the source of a trial component.
     */
    TrainingJob?: TrainingJob;
    /**
     * Information about a processing job that's the source of a trial component.
     */
    ProcessingJob?: ProcessingJob;
    /**
     * Information about a transform job that's the source of a trial component.
     */
    TransformJob?: TransformJob;
  }
  export interface TrialComponentStatus {
    /**
     * The status of the trial component.
     */
    PrimaryStatus?: TrialComponentPrimaryStatus;
    /**
     * If the component failed, a message describing why.
     */
    Message?: TrialComponentStatusMessage;
  }
  export type TrialComponentStatusMessage = string;
  export type TrialComponentSummaries = TrialComponentSummary[];
  export interface TrialComponentSummary {
    /**
     * The name of the trial component.
     */
    TrialComponentName?: ExperimentEntityName;
    /**
     * The ARN of the trial component.
     */
    TrialComponentArn?: TrialComponentArn;
    /**
     * The name of the component as displayed. If DisplayName isn't specified, TrialComponentName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    TrialComponentSource?: TrialComponentSource;
    /**
     * The status of the component. States include:   InProgress   Completed   Failed  
     */
    Status?: TrialComponentStatus;
    /**
     * When the component started.
     */
    StartTime?: Timestamp;
    /**
     * When the component ended.
     */
    EndTime?: Timestamp;
    /**
     * When the component was created.
     */
    CreationTime?: Timestamp;
    /**
     * Who created the trial component.
     */
    CreatedBy?: UserContext;
    /**
     * When the component was last modified.
     */
    LastModifiedTime?: Timestamp;
    /**
     * Who last modified the component.
     */
    LastModifiedBy?: UserContext;
  }
  export interface TrialSource {
    /**
     * The Amazon Resource Name (ARN) of the source.
     */
    SourceArn: TrialSourceArn;
    /**
     * The source job type.
     */
    SourceType?: SourceType;
  }
  export type TrialSourceArn = string;
  export type TrialSummaries = TrialSummary[];
  export interface TrialSummary {
    /**
     * The Amazon Resource Name (ARN) of the trial.
     */
    TrialArn?: TrialArn;
    /**
     * The name of the trial.
     */
    TrialName?: ExperimentEntityName;
    /**
     * The name of the trial as displayed. If DisplayName isn't specified, TrialName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    TrialSource?: TrialSource;
    /**
     * When the trial was created.
     */
    CreationTime?: Timestamp;
    /**
     * When the trial was last modified.
     */
    LastModifiedTime?: Timestamp;
  }
  export interface TuningJobCompletionCriteria {
    /**
     * The value of the objective metric.
     */
    TargetObjectiveMetricValue: TargetObjectiveMetricValue;
  }
  export interface TuningJobStepMetaData {
    /**
     * The Amazon Resource Name (ARN) of the tuning job that was run by this step execution.
     */
    Arn?: HyperParameterTuningJobArn;
  }
  export interface USD {
    /**
     * The whole number of dollars in the amount.
     */
    Dollars?: Dollars;
    /**
     * The fractional portion, in cents, of the amount. 
     */
    Cents?: Cents;
    /**
     * Fractions of a cent, in tenths.
     */
    TenthFractionsOfACent?: TenthFractionsOfACent;
  }
  export interface UiConfig {
    /**
     * The Amazon S3 bucket location of the UI template, or worker task template. This is the template used to render the worker UI and tools for labeling job tasks. For more information about the contents of a UI template, see  Creating Your Custom Labeling Task Template.
     */
    UiTemplateS3Uri?: S3Uri;
    /**
     * The ARN of the worker task template used to render the worker UI and tools for labeling job tasks. Use this parameter when you are creating a labeling job for named entity recognition, 3D point cloud and video frame labeling jobs. Use your labeling job task type to select one of the following ARNs and use it with this parameter when you create a labeling job. Replace aws-region with the Amazon Web Services Region you are creating your labeling job in. For example, replace aws-region with us-west-1 if you create a labeling job in US West (N. California).  Named Entity Recognition  Use the following HumanTaskUiArn for named entity recognition labeling jobs:  arn:aws:sagemaker:aws-region:394669845002:human-task-ui/NamedEntityRecognition   3D Point Cloud HumanTaskUiArns  Use this HumanTaskUiArn for 3D point cloud object detection and 3D point cloud object detection adjustment labeling jobs.     arn:aws:sagemaker:aws-region:394669845002:human-task-ui/PointCloudObjectDetection     Use this HumanTaskUiArn for 3D point cloud object tracking and 3D point cloud object tracking adjustment labeling jobs.     arn:aws:sagemaker:aws-region:394669845002:human-task-ui/PointCloudObjectTracking     Use this HumanTaskUiArn for 3D point cloud semantic segmentation and 3D point cloud semantic segmentation adjustment labeling jobs.    arn:aws:sagemaker:aws-region:394669845002:human-task-ui/PointCloudSemanticSegmentation     Video Frame HumanTaskUiArns  Use this HumanTaskUiArn for video frame object detection and video frame object detection adjustment labeling jobs.     arn:aws:sagemaker:region:394669845002:human-task-ui/VideoObjectDetection     Use this HumanTaskUiArn for video frame object tracking and video frame object tracking adjustment labeling jobs.     arn:aws:sagemaker:aws-region:394669845002:human-task-ui/VideoObjectTracking   
     */
    HumanTaskUiArn?: HumanTaskUiArn;
  }
  export interface UiTemplate {
    /**
     * The content of the Liquid template for the worker user interface.
     */
    Content: TemplateContent;
  }
  export interface UiTemplateInfo {
    /**
     * The URL for the user interface template.
     */
    Url?: TemplateUrl;
    /**
     * The SHA-256 digest of the contents of the template.
     */
    ContentSha256?: TemplateContentSha256;
  }
  export interface UpdateActionRequest {
    /**
     * The name of the action to update.
     */
    ActionName: ExperimentEntityName;
    /**
     * The new description for the action.
     */
    Description?: ExperimentDescription;
    /**
     * The new status for the action.
     */
    Status?: ActionStatus;
    /**
     * The new list of properties. Overwrites the current property list.
     */
    Properties?: LineageEntityParameters;
    /**
     * A list of properties to remove.
     */
    PropertiesToRemove?: ListLineageEntityParameterKey;
  }
  export interface UpdateActionResponse {
    /**
     * The Amazon Resource Name (ARN) of the action.
     */
    ActionArn?: ActionArn;
  }
  export interface UpdateAppImageConfigRequest {
    /**
     * The name of the AppImageConfig to update.
     */
    AppImageConfigName: AppImageConfigName;
    /**
     * The new KernelGateway app to run on the image.
     */
    KernelGatewayImageConfig?: KernelGatewayImageConfig;
  }
  export interface UpdateAppImageConfigResponse {
    /**
     * The Amazon Resource Name (ARN) for the AppImageConfig.
     */
    AppImageConfigArn?: AppImageConfigArn;
  }
  export interface UpdateArtifactRequest {
    /**
     * The Amazon Resource Name (ARN) of the artifact to update.
     */
    ArtifactArn: ArtifactArn;
    /**
     * The new name for the artifact.
     */
    ArtifactName?: ExperimentEntityName;
    /**
     * The new list of properties. Overwrites the current property list.
     */
    Properties?: LineageEntityParameters;
    /**
     * A list of properties to remove.
     */
    PropertiesToRemove?: ListLineageEntityParameterKey;
  }
  export interface UpdateArtifactResponse {
    /**
     * The Amazon Resource Name (ARN) of the artifact.
     */
    ArtifactArn?: ArtifactArn;
  }
  export interface UpdateCodeRepositoryInput {
    /**
     * The name of the Git repository to update.
     */
    CodeRepositoryName: EntityName;
    /**
     * The configuration of the git repository, including the URL and the Amazon Resource Name (ARN) of the Amazon Web Services Secrets Manager secret that contains the credentials used to access the repository. The secret must have a staging label of AWSCURRENT and must be in the following format:  {"username": UserName, "password": Password} 
     */
    GitConfig?: GitConfigForUpdate;
  }
  export interface UpdateCodeRepositoryOutput {
    /**
     * The ARN of the Git repository.
     */
    CodeRepositoryArn: CodeRepositoryArn;
  }
  export interface UpdateContextRequest {
    /**
     * The name of the context to update.
     */
    ContextName: ExperimentEntityName;
    /**
     * The new description for the context.
     */
    Description?: ExperimentDescription;
    /**
     * The new list of properties. Overwrites the current property list.
     */
    Properties?: LineageEntityParameters;
    /**
     * A list of properties to remove.
     */
    PropertiesToRemove?: ListLineageEntityParameterKey;
  }
  export interface UpdateContextResponse {
    /**
     * The Amazon Resource Name (ARN) of the context.
     */
    ContextArn?: ContextArn;
  }
  export interface UpdateDeviceFleetRequest {
    /**
     * The name of the fleet.
     */
    DeviceFleetName: EntityName;
    /**
     * The Amazon Resource Name (ARN) of the device.
     */
    RoleArn?: RoleArn;
    /**
     * Description of the fleet.
     */
    Description?: DeviceFleetDescription;
    /**
     * Output configuration for storing sample data collected by the fleet.
     */
    OutputConfig: EdgeOutputConfig;
    /**
     * Whether to create an Amazon Web Services IoT Role Alias during device fleet creation. The name of the role alias generated will match this pattern: "SageMakerEdge-{DeviceFleetName}". For example, if your device fleet is called "demo-fleet", the name of the role alias will be "SageMakerEdge-demo-fleet".
     */
    EnableIotRoleAlias?: EnableIotRoleAlias;
  }
  export interface UpdateDevicesRequest {
    /**
     * The name of the fleet the devices belong to.
     */
    DeviceFleetName: EntityName;
    /**
     * List of devices to register with Edge Manager agent.
     */
    Devices: Devices;
  }
  export interface UpdateDomainRequest {
    /**
     * The ID of the domain to be updated.
     */
    DomainId: DomainId;
    /**
     * A collection of settings.
     */
    DefaultUserSettings?: UserSettings;
    /**
     * A collection of DomainSettings configuration values to update.
     */
    DomainSettingsForUpdate?: DomainSettingsForUpdate;
  }
  export interface UpdateDomainResponse {
    /**
     * The Amazon Resource Name (ARN) of the domain.
     */
    DomainArn?: DomainArn;
  }
  export interface UpdateEndpointInput {
    /**
     * The name of the endpoint whose configuration you want to update.
     */
    EndpointName: EndpointName;
    /**
     * The name of the new endpoint configuration.
     */
    EndpointConfigName: EndpointConfigName;
    /**
     * When updating endpoint resources, enables or disables the retention of variant properties, such as the instance count or the variant weight. To retain the variant properties of an endpoint when updating it, set RetainAllVariantProperties to true. To use the variant properties specified in a new EndpointConfig call when updating an endpoint, set RetainAllVariantProperties to false. The default is false.
     */
    RetainAllVariantProperties?: Boolean;
    /**
     * When you are updating endpoint resources with UpdateEndpointInput$RetainAllVariantProperties, whose value is set to true, ExcludeRetainedVariantProperties specifies the list of type VariantProperty to override with the values provided by EndpointConfig. If you don't specify a value for ExcludeAllVariantProperties, no variant properties are overridden. 
     */
    ExcludeRetainedVariantProperties?: VariantPropertyList;
    /**
     * The deployment configuration for an endpoint, which contains the desired deployment strategy and rollback configurations.
     */
    DeploymentConfig?: DeploymentConfig;
    /**
     * Specifies whether to reuse the last deployment configuration. The default value is false (the configuration is not reused).
     */
    RetainDeploymentConfig?: Boolean;
  }
  export interface UpdateEndpointOutput {
    /**
     * The Amazon Resource Name (ARN) of the endpoint.
     */
    EndpointArn: EndpointArn;
  }
  export interface UpdateEndpointWeightsAndCapacitiesInput {
    /**
     * The name of an existing Amazon SageMaker endpoint.
     */
    EndpointName: EndpointName;
    /**
     * An object that provides new capacity and weight values for a variant.
     */
    DesiredWeightsAndCapacities: DesiredWeightAndCapacityList;
  }
  export interface UpdateEndpointWeightsAndCapacitiesOutput {
    /**
     * The Amazon Resource Name (ARN) of the updated endpoint.
     */
    EndpointArn: EndpointArn;
  }
  export interface UpdateExperimentRequest {
    /**
     * The name of the experiment to update.
     */
    ExperimentName: ExperimentEntityName;
    /**
     * The name of the experiment as displayed. The name doesn't need to be unique. If DisplayName isn't specified, ExperimentName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    /**
     * The description of the experiment.
     */
    Description?: ExperimentDescription;
  }
  export interface UpdateExperimentResponse {
    /**
     * The Amazon Resource Name (ARN) of the experiment.
     */
    ExperimentArn?: ExperimentArn;
  }
  export interface UpdateImageRequest {
    /**
     * A list of properties to delete. Only the Description and DisplayName properties can be deleted.
     */
    DeleteProperties?: ImageDeletePropertyList;
    /**
     * The new description for the image.
     */
    Description?: ImageDescription;
    /**
     * The new display name for the image.
     */
    DisplayName?: ImageDisplayName;
    /**
     * The name of the image to update.
     */
    ImageName: ImageName;
    /**
     * The new Amazon Resource Name (ARN) for the IAM role that enables Amazon SageMaker to perform tasks on your behalf.
     */
    RoleArn?: RoleArn;
  }
  export interface UpdateImageResponse {
    /**
     * The Amazon Resource Name (ARN) of the image.
     */
    ImageArn?: ImageArn;
  }
  export interface UpdateModelPackageInput {
    /**
     * The Amazon Resource Name (ARN) of the model package.
     */
    ModelPackageArn: ModelPackageArn;
    /**
     * The approval status of the model.
     */
    ModelApprovalStatus?: ModelApprovalStatus;
    /**
     * A description for the approval status of the model.
     */
    ApprovalDescription?: ApprovalDescription;
    /**
     * The metadata properties associated with the model package versions.
     */
    CustomerMetadataProperties?: CustomerMetadataMap;
    /**
     * The metadata properties associated with the model package versions to remove.
     */
    CustomerMetadataPropertiesToRemove?: CustomerMetadataKeyList;
  }
  export interface UpdateModelPackageOutput {
    /**
     * The Amazon Resource Name (ARN) of the model.
     */
    ModelPackageArn: ModelPackageArn;
  }
  export interface UpdateMonitoringScheduleRequest {
    /**
     * The name of the monitoring schedule. The name must be unique within an Amazon Web Services Region within an Amazon Web Services account.
     */
    MonitoringScheduleName: MonitoringScheduleName;
    /**
     * The configuration object that specifies the monitoring schedule and defines the monitoring job.
     */
    MonitoringScheduleConfig: MonitoringScheduleConfig;
  }
  export interface UpdateMonitoringScheduleResponse {
    /**
     * The Amazon Resource Name (ARN) of the monitoring schedule.
     */
    MonitoringScheduleArn: MonitoringScheduleArn;
  }
  export interface UpdateNotebookInstanceInput {
    /**
     * The name of the notebook instance to update.
     */
    NotebookInstanceName: NotebookInstanceName;
    /**
     * The Amazon ML compute instance type.
     */
    InstanceType?: InstanceType;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that Amazon SageMaker can assume to access the notebook instance. For more information, see Amazon SageMaker Roles.   To be able to pass this role to Amazon SageMaker, the caller of this API must have the iam:PassRole permission. 
     */
    RoleArn?: RoleArn;
    /**
     * The name of a lifecycle configuration to associate with the notebook instance. For information about lifestyle configurations, see Step 2.1: (Optional) Customize a Notebook Instance.
     */
    LifecycleConfigName?: NotebookInstanceLifecycleConfigName;
    /**
     * Set to true to remove the notebook instance lifecycle configuration currently associated with the notebook instance. This operation is idempotent. If you specify a lifecycle configuration that is not associated with the notebook instance when you call this method, it does not throw an error.
     */
    DisassociateLifecycleConfig?: DisassociateNotebookInstanceLifecycleConfig;
    /**
     * The size, in GB, of the ML storage volume to attach to the notebook instance. The default value is 5 GB. ML storage volumes are encrypted, so Amazon SageMaker can't determine the amount of available free space on the volume. Because of this, you can increase the volume size when you update a notebook instance, but you can't decrease the volume size. If you want to decrease the size of the ML storage volume in use, create a new notebook instance with the desired size.
     */
    VolumeSizeInGB?: NotebookInstanceVolumeSizeInGB;
    /**
     * The Git repository to associate with the notebook instance as its default code repository. This can be either the name of a Git repository stored as a resource in your account, or the URL of a Git repository in Amazon Web Services CodeCommit or in any other Git repository. When you open a notebook instance, it opens in the directory that contains this repository. For more information, see Associating Git Repositories with Amazon SageMaker Notebook Instances.
     */
    DefaultCodeRepository?: CodeRepositoryNameOrUrl;
    /**
     * An array of up to three Git repositories to associate with the notebook instance. These can be either the names of Git repositories stored as resources in your account, or the URL of Git repositories in Amazon Web Services CodeCommit or in any other Git repository. These repositories are cloned at the same level as the default repository of your notebook instance. For more information, see Associating Git Repositories with Amazon SageMaker Notebook Instances.
     */
    AdditionalCodeRepositories?: AdditionalCodeRepositoryNamesOrUrls;
    /**
     * A list of the Elastic Inference (EI) instance types to associate with this notebook instance. Currently only one EI instance type can be associated with a notebook instance. For more information, see Using Elastic Inference in Amazon SageMaker.
     */
    AcceleratorTypes?: NotebookInstanceAcceleratorTypes;
    /**
     * A list of the Elastic Inference (EI) instance types to remove from this notebook instance. This operation is idempotent. If you specify an accelerator type that is not associated with the notebook instance when you call this method, it does not throw an error.
     */
    DisassociateAcceleratorTypes?: DisassociateNotebookInstanceAcceleratorTypes;
    /**
     * The name or URL of the default Git repository to remove from this notebook instance. This operation is idempotent. If you specify a Git repository that is not associated with the notebook instance when you call this method, it does not throw an error.
     */
    DisassociateDefaultCodeRepository?: DisassociateDefaultCodeRepository;
    /**
     * A list of names or URLs of the default Git repositories to remove from this notebook instance. This operation is idempotent. If you specify a Git repository that is not associated with the notebook instance when you call this method, it does not throw an error.
     */
    DisassociateAdditionalCodeRepositories?: DisassociateAdditionalCodeRepositories;
    /**
     * Whether root access is enabled or disabled for users of the notebook instance. The default value is Enabled.  If you set this to Disabled, users don't have root access on the notebook instance, but lifecycle configuration scripts still run with root permissions. 
     */
    RootAccess?: RootAccess;
  }
  export interface UpdateNotebookInstanceLifecycleConfigInput {
    /**
     * The name of the lifecycle configuration.
     */
    NotebookInstanceLifecycleConfigName: NotebookInstanceLifecycleConfigName;
    /**
     * The shell script that runs only once, when you create a notebook instance. The shell script must be a base64-encoded string.
     */
    OnCreate?: NotebookInstanceLifecycleConfigList;
    /**
     * The shell script that runs every time you start a notebook instance, including when you create the notebook instance. The shell script must be a base64-encoded string.
     */
    OnStart?: NotebookInstanceLifecycleConfigList;
  }
  export interface UpdateNotebookInstanceLifecycleConfigOutput {
  }
  export interface UpdateNotebookInstanceOutput {
  }
  export interface UpdatePipelineExecutionRequest {
    /**
     * The Amazon Resource Name (ARN) of the pipeline execution.
     */
    PipelineExecutionArn: PipelineExecutionArn;
    /**
     * The description of the pipeline execution.
     */
    PipelineExecutionDescription?: PipelineExecutionDescription;
    /**
     * The display name of the pipeline execution.
     */
    PipelineExecutionDisplayName?: PipelineExecutionName;
  }
  export interface UpdatePipelineExecutionResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated pipeline execution.
     */
    PipelineExecutionArn?: PipelineExecutionArn;
  }
  export interface UpdatePipelineRequest {
    /**
     * The name of the pipeline to update.
     */
    PipelineName: PipelineName;
    /**
     * The display name of the pipeline.
     */
    PipelineDisplayName?: PipelineName;
    /**
     * The JSON pipeline definition.
     */
    PipelineDefinition?: PipelineDefinition;
    /**
     * The description of the pipeline.
     */
    PipelineDescription?: PipelineDescription;
    /**
     * The Amazon Resource Name (ARN) that the pipeline uses to execute.
     */
    RoleArn?: RoleArn;
  }
  export interface UpdatePipelineResponse {
    /**
     * The Amazon Resource Name (ARN) of the updated pipeline.
     */
    PipelineArn?: PipelineArn;
  }
  export interface UpdateProjectInput {
    /**
     * The name of the project.
     */
    ProjectName: ProjectEntityName;
    /**
     * The description for the project.
     */
    ProjectDescription?: EntityDescription;
    /**
     * The product ID and provisioning artifact ID to provision a service catalog. The provisioning artifact ID will default to the latest provisioning artifact ID of the product, if you don't provide the provisioning artifact ID. For more information, see What is Amazon Web Services Service Catalog. 
     */
    ServiceCatalogProvisioningUpdateDetails?: ServiceCatalogProvisioningUpdateDetails;
    /**
     * An array of key-value pairs. You can use tags to categorize your Amazon Web Services resources in different ways, for example, by purpose, owner, or environment. For more information, see Tagging Amazon Web Services Resources.
     */
    Tags?: TagList;
  }
  export interface UpdateProjectOutput {
    /**
     * The Amazon Resource Name (ARN) of the project.
     */
    ProjectArn: ProjectArn;
  }
  export interface UpdateTrainingJobRequest {
    /**
     * The name of a training job to update the Debugger profiling configuration.
     */
    TrainingJobName: TrainingJobName;
    /**
     * Configuration information for Debugger system monitoring, framework profiling, and storage paths.
     */
    ProfilerConfig?: ProfilerConfigForUpdate;
    /**
     * Configuration information for Debugger rules for profiling system and framework metrics.
     */
    ProfilerRuleConfigurations?: ProfilerRuleConfigurations;
  }
  export interface UpdateTrainingJobResponse {
    /**
     * The Amazon Resource Name (ARN) of the training job.
     */
    TrainingJobArn: TrainingJobArn;
  }
  export interface UpdateTrialComponentRequest {
    /**
     * The name of the component to update.
     */
    TrialComponentName: ExperimentEntityName;
    /**
     * The name of the component as displayed. The name doesn't need to be unique. If DisplayName isn't specified, TrialComponentName is displayed.
     */
    DisplayName?: ExperimentEntityName;
    /**
     * The new status of the component.
     */
    Status?: TrialComponentStatus;
    /**
     * When the component started.
     */
    StartTime?: Timestamp;
    /**
     * When the component ended.
     */
    EndTime?: Timestamp;
    /**
     * Replaces all of the component's hyperparameters with the specified hyperparameters.
     */
    Parameters?: TrialComponentParameters;
    /**
     * The hyperparameters to remove from the component.
     */
    ParametersToRemove?: ListTrialComponentKey256;
    /**
     * Replaces all of the component's input artifacts with the specified artifacts.
     */
    InputArtifacts?: TrialComponentArtifacts;
    /**
     * The input artifacts to remove from the component.
     */
    InputArtifactsToRemove?: ListTrialComponentKey256;
    /**
     * Replaces all of the component's output artifacts with the specified artifacts.
     */
    OutputArtifacts?: TrialComponentArtifacts;
    /**
     * The output artifacts to remove from the component.
     */
    OutputArtifactsToRemove?: ListTrialComponentKey256;
  }
  export interface UpdateTrialComponentResponse {
    /**
     * The Amazon Resource Name (ARN) of the trial component.
     */
    TrialComponentArn?: TrialComponentArn;
  }
  export interface UpdateTrialRequest {
    /**
     * The name of the trial to update.
     */
    TrialName: ExperimentEntityName;
    /**
     * The name of the trial as displayed. The name doesn't need to be unique. If DisplayName isn't specified, TrialName is displayed.
     */
    DisplayName?: ExperimentEntityName;
  }
  export interface UpdateTrialResponse {
    /**
     * The Amazon Resource Name (ARN) of the trial.
     */
    TrialArn?: TrialArn;
  }
  export interface UpdateUserProfileRequest {
    /**
     * The domain ID.
     */
    DomainId: DomainId;
    /**
     * The user profile name.
     */
    UserProfileName: UserProfileName;
    /**
     * A collection of settings.
     */
    UserSettings?: UserSettings;
  }
  export interface UpdateUserProfileResponse {
    /**
     * The user profile Amazon Resource Name (ARN).
     */
    UserProfileArn?: UserProfileArn;
  }
  export interface UpdateWorkforceRequest {
    /**
     * The name of the private workforce that you want to update. You can find your workforce name by using the operation.
     */
    WorkforceName: WorkforceName;
    /**
     * A list of one to ten worker IP address ranges (CIDRs) that can be used to access tasks assigned to this workforce. Maximum: Ten CIDR values
     */
    SourceIpConfig?: SourceIpConfig;
    /**
     * Use this parameter to update your OIDC Identity Provider (IdP) configuration for a workforce made using your own IdP.
     */
    OidcConfig?: OidcConfig;
  }
  export interface UpdateWorkforceResponse {
    /**
     * A single private workforce. You can create one private work force in each Amazon Web Services Region. By default, any workforce-related API operation used in a specific region will apply to the workforce created in that region. To learn how to create a private workforce, see Create a Private Workforce.
     */
    Workforce: Workforce;
  }
  export interface UpdateWorkteamRequest {
    /**
     * The name of the work team to update.
     */
    WorkteamName: WorkteamName;
    /**
     * A list of MemberDefinition objects that contains objects that identify the workers that make up the work team.  Workforces can be created using Amazon Cognito or your own OIDC Identity Provider (IdP). For private workforces created using Amazon Cognito use CognitoMemberDefinition. For workforces created using your own OIDC identity provider (IdP) use OidcMemberDefinition. You should not provide input for both of these parameters in a single request. For workforces created using Amazon Cognito, private work teams correspond to Amazon Cognito user groups within the user pool used to create a workforce. All of the CognitoMemberDefinition objects that make up the member definition must have the same ClientId and UserPool values. To add a Amazon Cognito user group to an existing worker pool, see Adding groups to a User Pool. For more information about user pools, see Amazon Cognito User Pools. For workforces created using your own OIDC IdP, specify the user groups that you want to include in your private work team in OidcMemberDefinition by listing those groups in Groups. Be aware that user groups that are already in the work team must also be listed in Groups when you make this request to remain on the work team. If you do not include these user groups, they will no longer be associated with the work team you update. 
     */
    MemberDefinitions?: MemberDefinitions;
    /**
     * An updated description for the work team.
     */
    Description?: String200;
    /**
     * Configures SNS topic notifications for available or expiring work items
     */
    NotificationConfiguration?: NotificationConfiguration;
  }
  export interface UpdateWorkteamResponse {
    /**
     * A Workteam object that describes the updated work team.
     */
    Workteam: Workteam;
  }
  export type Url = string;
  export interface UserContext {
    /**
     * The Amazon Resource Name (ARN) of the user's profile.
     */
    UserProfileArn?: String;
    /**
     * The name of the user's profile.
     */
    UserProfileName?: String;
    /**
     * The domain associated with the user.
     */
    DomainId?: String;
  }
  export type UserProfileArn = string;
  export interface UserProfileDetails {
    /**
     * The domain ID.
     */
    DomainId?: DomainId;
    /**
     * The user profile name.
     */
    UserProfileName?: UserProfileName;
    /**
     * The status.
     */
    Status?: UserProfileStatus;
    /**
     * The creation time.
     */
    CreationTime?: CreationTime;
    /**
     * The last modified time.
     */
    LastModifiedTime?: LastModifiedTime;
  }
  export type UserProfileList = UserProfileDetails[];
  export type UserProfileName = string;
  export type UserProfileSortKey = "CreationTime"|"LastModifiedTime"|string;
  export type UserProfileStatus = "Deleting"|"Failed"|"InService"|"Pending"|"Updating"|"Update_Failed"|"Delete_Failed"|string;
  export interface UserSettings {
    /**
     * The execution role for the user.
     */
    ExecutionRole?: RoleArn;
    /**
     * The security groups for the Amazon Virtual Private Cloud (VPC) that Studio uses for communication. Optional when the CreateDomain.AppNetworkAccessType parameter is set to PublicInternetOnly. Required when the CreateDomain.AppNetworkAccessType parameter is set to VpcOnly. Amazon SageMaker adds a security group to allow NFS traffic from SageMaker Studio. Therefore, the number of security groups that you can specify is one less than the maximum number shown.
     */
    SecurityGroups?: SecurityGroupIds;
    /**
     * Specifies options for sharing SageMaker Studio notebooks.
     */
    SharingSettings?: SharingSettings;
    /**
     * The Jupyter server's app settings.
     */
    JupyterServerAppSettings?: JupyterServerAppSettings;
    /**
     * The kernel gateway app settings.
     */
    KernelGatewayAppSettings?: KernelGatewayAppSettings;
    /**
     * The TensorBoard app settings.
     */
    TensorBoardAppSettings?: TensorBoardAppSettings;
    /**
     * A collection of settings that configure user interaction with the RStudioServerPro app.
     */
    RStudioServerProAppSettings?: RStudioServerProAppSettings;
    /**
     * A collection of settings that configure the RSessionGateway app.
     */
    RSessionAppSettings?: RSessionAppSettings;
  }
  export type VariantName = string;
  export interface VariantProperty {
    /**
     * The type of variant property. The supported values are:    DesiredInstanceCount: Overrides the existing variant instance counts using the ProductionVariant$InitialInstanceCount values in the CreateEndpointConfigInput$ProductionVariants.    DesiredWeight: Overrides the existing variant weights using the ProductionVariant$InitialVariantWeight values in the CreateEndpointConfigInput$ProductionVariants.    DataCaptureConfig: (Not currently supported.)  
     */
    VariantPropertyType: VariantPropertyType;
  }
  export type VariantPropertyList = VariantProperty[];
  export type VariantPropertyType = "DesiredInstanceCount"|"DesiredWeight"|"DataCaptureConfig"|string;
  export type VariantStatus = "Creating"|"Updating"|"Deleting"|"ActivatingTraffic"|"Baking"|string;
  export type VariantStatusMessage = string;
  export type VariantWeight = number;
  export type VersionedArnOrName = string;
  export type VolumeSizeInGB = number;
  export interface VpcConfig {
    /**
     * The VPC security group IDs, in the form sg-xxxxxxxx. Specify the security groups for the VPC that is specified in the Subnets field.
     */
    SecurityGroupIds: VpcSecurityGroupIds;
    /**
     * The ID of the subnets in the VPC to which you want to connect your training job or model. For information about the availability of specific instance types, see Supported Instance Types and Availability Zones.
     */
    Subnets: Subnets;
  }
  export type VpcId = string;
  export type VpcSecurityGroupIds = SecurityGroupId[];
  export type WaitIntervalInSeconds = number;
  export interface Workforce {
    /**
     * The name of the private workforce.
     */
    WorkforceName: WorkforceName;
    /**
     * The Amazon Resource Name (ARN) of the private workforce.
     */
    WorkforceArn: WorkforceArn;
    /**
     * The most recent date that was used to successfully add one or more IP address ranges (CIDRs) to a private workforce's allow list.
     */
    LastUpdatedDate?: Timestamp;
    /**
     * A list of one to ten IP address ranges (CIDRs) to be added to the workforce allow list. By default, a workforce isn't restricted to specific IP addresses.
     */
    SourceIpConfig?: SourceIpConfig;
    /**
     * The subdomain for your OIDC Identity Provider.
     */
    SubDomain?: String;
    /**
     * The configuration of an Amazon Cognito workforce. A single Cognito workforce is created using and corresponds to a single  Amazon Cognito user pool.
     */
    CognitoConfig?: CognitoConfig;
    /**
     * The configuration of an OIDC Identity Provider (IdP) private workforce.
     */
    OidcConfig?: OidcConfigForResponse;
    /**
     * The date that the workforce is created.
     */
    CreateDate?: Timestamp;
  }
  export type WorkforceArn = string;
  export type WorkforceName = string;
  export type Workforces = Workforce[];
  export interface Workteam {
    /**
     * The name of the work team.
     */
    WorkteamName: WorkteamName;
    /**
     * A list of MemberDefinition objects that contains objects that identify the workers that make up the work team.  Workforces can be created using Amazon Cognito or your own OIDC Identity Provider (IdP). For private workforces created using Amazon Cognito use CognitoMemberDefinition. For workforces created using your own OIDC identity provider (IdP) use OidcMemberDefinition.
     */
    MemberDefinitions: MemberDefinitions;
    /**
     * The Amazon Resource Name (ARN) that identifies the work team.
     */
    WorkteamArn: WorkteamArn;
    /**
     * The Amazon Resource Name (ARN) of the workforce.
     */
    WorkforceArn?: WorkforceArn;
    /**
     * The Amazon Marketplace identifier for a vendor's work team.
     */
    ProductListingIds?: ProductListings;
    /**
     * A description of the work team.
     */
    Description: String200;
    /**
     * The URI of the labeling job's user interface. Workers open this URI to start labeling your data objects.
     */
    SubDomain?: String;
    /**
     * The date and time that the work team was created (timestamp).
     */
    CreateDate?: Timestamp;
    /**
     * The date and time that the work team was last updated (timestamp).
     */
    LastUpdatedDate?: Timestamp;
    /**
     * Configures SNS notifications of available or expiring work items for work teams.
     */
    NotificationConfiguration?: NotificationConfiguration;
  }
  export type WorkteamArn = string;
  export type WorkteamName = string;
  export type Workteams = Workteam[];
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2017-07-24"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the SageMaker client.
   */
  export import Types = SageMaker;
}
export = SageMaker;
