import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class AppRunner extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: AppRunner.Types.ClientConfiguration)
  config: Config & AppRunner.Types.ClientConfiguration;
  /**
   * Associate your own domain name with the App Runner subdomain URL of your App Runner service. After you call AssociateCustomDomain and receive a successful response, use the information in the CustomDomain record that's returned to add CNAME records to your Domain Name System (DNS). For each mapped domain name, add a mapping to the target App Runner subdomain and one or more certificate validation records. App Runner then performs DNS validation to verify that you own or control the domain name that you associated. App Runner tracks domain validity in a certificate stored in AWS Certificate Manager (ACM).
   */
  associateCustomDomain(params: AppRunner.Types.AssociateCustomDomainRequest, callback?: (err: AWSError, data: AppRunner.Types.AssociateCustomDomainResponse) => void): Request<AppRunner.Types.AssociateCustomDomainResponse, AWSError>;
  /**
   * Associate your own domain name with the App Runner subdomain URL of your App Runner service. After you call AssociateCustomDomain and receive a successful response, use the information in the CustomDomain record that's returned to add CNAME records to your Domain Name System (DNS). For each mapped domain name, add a mapping to the target App Runner subdomain and one or more certificate validation records. App Runner then performs DNS validation to verify that you own or control the domain name that you associated. App Runner tracks domain validity in a certificate stored in AWS Certificate Manager (ACM).
   */
  associateCustomDomain(callback?: (err: AWSError, data: AppRunner.Types.AssociateCustomDomainResponse) => void): Request<AppRunner.Types.AssociateCustomDomainResponse, AWSError>;
  /**
   * Create an App Runner automatic scaling configuration resource. App Runner requires this resource when you create App Runner services that require non-default auto scaling settings. You can share an auto scaling configuration across multiple services. Create multiple revisions of a configuration by using the same AutoScalingConfigurationName and different AutoScalingConfigurationRevision values. When you create a service, you can set it to use the latest active revision of an auto scaling configuration or a specific revision. Configure a higher MinSize to increase the spread of your App Runner service over more Availability Zones in the Amazon Web Services Region. The tradeoff is a higher minimal cost. Configure a lower MaxSize to control your cost. The tradeoff is lower responsiveness during peak demand.
   */
  createAutoScalingConfiguration(params: AppRunner.Types.CreateAutoScalingConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.CreateAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.CreateAutoScalingConfigurationResponse, AWSError>;
  /**
   * Create an App Runner automatic scaling configuration resource. App Runner requires this resource when you create App Runner services that require non-default auto scaling settings. You can share an auto scaling configuration across multiple services. Create multiple revisions of a configuration by using the same AutoScalingConfigurationName and different AutoScalingConfigurationRevision values. When you create a service, you can set it to use the latest active revision of an auto scaling configuration or a specific revision. Configure a higher MinSize to increase the spread of your App Runner service over more Availability Zones in the Amazon Web Services Region. The tradeoff is a higher minimal cost. Configure a lower MaxSize to control your cost. The tradeoff is lower responsiveness during peak demand.
   */
  createAutoScalingConfiguration(callback?: (err: AWSError, data: AppRunner.Types.CreateAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.CreateAutoScalingConfigurationResponse, AWSError>;
  /**
   * Create an App Runner connection resource. App Runner requires a connection resource when you create App Runner services that access private repositories from certain third-party providers. You can share a connection across multiple services. A connection resource is needed to access GitHub repositories. GitHub requires a user interface approval process through the App Runner console before you can use the connection.
   */
  createConnection(params: AppRunner.Types.CreateConnectionRequest, callback?: (err: AWSError, data: AppRunner.Types.CreateConnectionResponse) => void): Request<AppRunner.Types.CreateConnectionResponse, AWSError>;
  /**
   * Create an App Runner connection resource. App Runner requires a connection resource when you create App Runner services that access private repositories from certain third-party providers. You can share a connection across multiple services. A connection resource is needed to access GitHub repositories. GitHub requires a user interface approval process through the App Runner console before you can use the connection.
   */
  createConnection(callback?: (err: AWSError, data: AppRunner.Types.CreateConnectionResponse) => void): Request<AppRunner.Types.CreateConnectionResponse, AWSError>;
  /**
   * Create an App Runner service. After the service is created, the action also automatically starts a deployment. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  createService(params: AppRunner.Types.CreateServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.CreateServiceResponse) => void): Request<AppRunner.Types.CreateServiceResponse, AWSError>;
  /**
   * Create an App Runner service. After the service is created, the action also automatically starts a deployment. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  createService(callback?: (err: AWSError, data: AppRunner.Types.CreateServiceResponse) => void): Request<AppRunner.Types.CreateServiceResponse, AWSError>;
  /**
   * Delete an App Runner automatic scaling configuration resource. You can delete a specific revision or the latest active revision. You can't delete a configuration that's used by one or more App Runner services.
   */
  deleteAutoScalingConfiguration(params: AppRunner.Types.DeleteAutoScalingConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.DeleteAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.DeleteAutoScalingConfigurationResponse, AWSError>;
  /**
   * Delete an App Runner automatic scaling configuration resource. You can delete a specific revision or the latest active revision. You can't delete a configuration that's used by one or more App Runner services.
   */
  deleteAutoScalingConfiguration(callback?: (err: AWSError, data: AppRunner.Types.DeleteAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.DeleteAutoScalingConfigurationResponse, AWSError>;
  /**
   * Delete an App Runner connection. You must first ensure that there are no running App Runner services that use this connection. If there are any, the DeleteConnection action fails.
   */
  deleteConnection(params: AppRunner.Types.DeleteConnectionRequest, callback?: (err: AWSError, data: AppRunner.Types.DeleteConnectionResponse) => void): Request<AppRunner.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Delete an App Runner connection. You must first ensure that there are no running App Runner services that use this connection. If there are any, the DeleteConnection action fails.
   */
  deleteConnection(callback?: (err: AWSError, data: AppRunner.Types.DeleteConnectionResponse) => void): Request<AppRunner.Types.DeleteConnectionResponse, AWSError>;
  /**
   * Delete an App Runner service. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  deleteService(params: AppRunner.Types.DeleteServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.DeleteServiceResponse) => void): Request<AppRunner.Types.DeleteServiceResponse, AWSError>;
  /**
   * Delete an App Runner service. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  deleteService(callback?: (err: AWSError, data: AppRunner.Types.DeleteServiceResponse) => void): Request<AppRunner.Types.DeleteServiceResponse, AWSError>;
  /**
   * Return a full description of an App Runner automatic scaling configuration resource.
   */
  describeAutoScalingConfiguration(params: AppRunner.Types.DescribeAutoScalingConfigurationRequest, callback?: (err: AWSError, data: AppRunner.Types.DescribeAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.DescribeAutoScalingConfigurationResponse, AWSError>;
  /**
   * Return a full description of an App Runner automatic scaling configuration resource.
   */
  describeAutoScalingConfiguration(callback?: (err: AWSError, data: AppRunner.Types.DescribeAutoScalingConfigurationResponse) => void): Request<AppRunner.Types.DescribeAutoScalingConfigurationResponse, AWSError>;
  /**
   * Return a description of custom domain names that are associated with an App Runner service.
   */
  describeCustomDomains(params: AppRunner.Types.DescribeCustomDomainsRequest, callback?: (err: AWSError, data: AppRunner.Types.DescribeCustomDomainsResponse) => void): Request<AppRunner.Types.DescribeCustomDomainsResponse, AWSError>;
  /**
   * Return a description of custom domain names that are associated with an App Runner service.
   */
  describeCustomDomains(callback?: (err: AWSError, data: AppRunner.Types.DescribeCustomDomainsResponse) => void): Request<AppRunner.Types.DescribeCustomDomainsResponse, AWSError>;
  /**
   * Return a full description of an App Runner service.
   */
  describeService(params: AppRunner.Types.DescribeServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.DescribeServiceResponse) => void): Request<AppRunner.Types.DescribeServiceResponse, AWSError>;
  /**
   * Return a full description of an App Runner service.
   */
  describeService(callback?: (err: AWSError, data: AppRunner.Types.DescribeServiceResponse) => void): Request<AppRunner.Types.DescribeServiceResponse, AWSError>;
  /**
   * Disassociate a custom domain name from an App Runner service. Certificates tracking domain validity are associated with a custom domain and are stored in AWS Certificate Manager (ACM). These certificates aren't deleted as part of this action. App Runner delays certificate deletion for 30 days after a domain is disassociated from your service.
   */
  disassociateCustomDomain(params: AppRunner.Types.DisassociateCustomDomainRequest, callback?: (err: AWSError, data: AppRunner.Types.DisassociateCustomDomainResponse) => void): Request<AppRunner.Types.DisassociateCustomDomainResponse, AWSError>;
  /**
   * Disassociate a custom domain name from an App Runner service. Certificates tracking domain validity are associated with a custom domain and are stored in AWS Certificate Manager (ACM). These certificates aren't deleted as part of this action. App Runner delays certificate deletion for 30 days after a domain is disassociated from your service.
   */
  disassociateCustomDomain(callback?: (err: AWSError, data: AppRunner.Types.DisassociateCustomDomainResponse) => void): Request<AppRunner.Types.DisassociateCustomDomainResponse, AWSError>;
  /**
   * Returns a list of App Runner automatic scaling configurations in your Amazon Web Services account. You can query the revisions for a specific configuration name or the revisions for all configurations in your account. You can optionally query only the latest revision of each requested name.
   */
  listAutoScalingConfigurations(params: AppRunner.Types.ListAutoScalingConfigurationsRequest, callback?: (err: AWSError, data: AppRunner.Types.ListAutoScalingConfigurationsResponse) => void): Request<AppRunner.Types.ListAutoScalingConfigurationsResponse, AWSError>;
  /**
   * Returns a list of App Runner automatic scaling configurations in your Amazon Web Services account. You can query the revisions for a specific configuration name or the revisions for all configurations in your account. You can optionally query only the latest revision of each requested name.
   */
  listAutoScalingConfigurations(callback?: (err: AWSError, data: AppRunner.Types.ListAutoScalingConfigurationsResponse) => void): Request<AppRunner.Types.ListAutoScalingConfigurationsResponse, AWSError>;
  /**
   * Returns a list of App Runner connections that are associated with your Amazon Web Services account.
   */
  listConnections(params: AppRunner.Types.ListConnectionsRequest, callback?: (err: AWSError, data: AppRunner.Types.ListConnectionsResponse) => void): Request<AppRunner.Types.ListConnectionsResponse, AWSError>;
  /**
   * Returns a list of App Runner connections that are associated with your Amazon Web Services account.
   */
  listConnections(callback?: (err: AWSError, data: AppRunner.Types.ListConnectionsResponse) => void): Request<AppRunner.Types.ListConnectionsResponse, AWSError>;
  /**
   * Return a list of operations that occurred on an App Runner service. The resulting list of OperationSummary objects is sorted in reverse chronological order. The first object on the list represents the last started operation.
   */
  listOperations(params: AppRunner.Types.ListOperationsRequest, callback?: (err: AWSError, data: AppRunner.Types.ListOperationsResponse) => void): Request<AppRunner.Types.ListOperationsResponse, AWSError>;
  /**
   * Return a list of operations that occurred on an App Runner service. The resulting list of OperationSummary objects is sorted in reverse chronological order. The first object on the list represents the last started operation.
   */
  listOperations(callback?: (err: AWSError, data: AppRunner.Types.ListOperationsResponse) => void): Request<AppRunner.Types.ListOperationsResponse, AWSError>;
  /**
   * Returns a list of running App Runner services in your Amazon Web Services account.
   */
  listServices(params: AppRunner.Types.ListServicesRequest, callback?: (err: AWSError, data: AppRunner.Types.ListServicesResponse) => void): Request<AppRunner.Types.ListServicesResponse, AWSError>;
  /**
   * Returns a list of running App Runner services in your Amazon Web Services account.
   */
  listServices(callback?: (err: AWSError, data: AppRunner.Types.ListServicesResponse) => void): Request<AppRunner.Types.ListServicesResponse, AWSError>;
  /**
   * List tags that are associated with for an App Runner resource. The response contains a list of tag key-value pairs.
   */
  listTagsForResource(params: AppRunner.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: AppRunner.Types.ListTagsForResourceResponse) => void): Request<AppRunner.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * List tags that are associated with for an App Runner resource. The response contains a list of tag key-value pairs.
   */
  listTagsForResource(callback?: (err: AWSError, data: AppRunner.Types.ListTagsForResourceResponse) => void): Request<AppRunner.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Pause an active App Runner service. App Runner reduces compute capacity for the service to zero and loses state (for example, ephemeral storage is removed). This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  pauseService(params: AppRunner.Types.PauseServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.PauseServiceResponse) => void): Request<AppRunner.Types.PauseServiceResponse, AWSError>;
  /**
   * Pause an active App Runner service. App Runner reduces compute capacity for the service to zero and loses state (for example, ephemeral storage is removed). This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  pauseService(callback?: (err: AWSError, data: AppRunner.Types.PauseServiceResponse) => void): Request<AppRunner.Types.PauseServiceResponse, AWSError>;
  /**
   * Resume an active App Runner service. App Runner provisions compute capacity for the service. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  resumeService(params: AppRunner.Types.ResumeServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.ResumeServiceResponse) => void): Request<AppRunner.Types.ResumeServiceResponse, AWSError>;
  /**
   * Resume an active App Runner service. App Runner provisions compute capacity for the service. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  resumeService(callback?: (err: AWSError, data: AppRunner.Types.ResumeServiceResponse) => void): Request<AppRunner.Types.ResumeServiceResponse, AWSError>;
  /**
   * Initiate a manual deployment of the latest commit in a source code repository or the latest image in a source image repository to an App Runner service. For a source code repository, App Runner retrieves the commit and builds a Docker image. For a source image repository, App Runner retrieves the latest Docker image. In both cases, App Runner then deploys the new image to your service and starts a new container instance. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  startDeployment(params: AppRunner.Types.StartDeploymentRequest, callback?: (err: AWSError, data: AppRunner.Types.StartDeploymentResponse) => void): Request<AppRunner.Types.StartDeploymentResponse, AWSError>;
  /**
   * Initiate a manual deployment of the latest commit in a source code repository or the latest image in a source image repository to an App Runner service. For a source code repository, App Runner retrieves the commit and builds a Docker image. For a source image repository, App Runner retrieves the latest Docker image. In both cases, App Runner then deploys the new image to your service and starts a new container instance. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  startDeployment(callback?: (err: AWSError, data: AppRunner.Types.StartDeploymentResponse) => void): Request<AppRunner.Types.StartDeploymentResponse, AWSError>;
  /**
   * Add tags to, or update the tag values of, an App Runner resource. A tag is a key-value pair.
   */
  tagResource(params: AppRunner.Types.TagResourceRequest, callback?: (err: AWSError, data: AppRunner.Types.TagResourceResponse) => void): Request<AppRunner.Types.TagResourceResponse, AWSError>;
  /**
   * Add tags to, or update the tag values of, an App Runner resource. A tag is a key-value pair.
   */
  tagResource(callback?: (err: AWSError, data: AppRunner.Types.TagResourceResponse) => void): Request<AppRunner.Types.TagResourceResponse, AWSError>;
  /**
   * Remove tags from an App Runner resource.
   */
  untagResource(params: AppRunner.Types.UntagResourceRequest, callback?: (err: AWSError, data: AppRunner.Types.UntagResourceResponse) => void): Request<AppRunner.Types.UntagResourceResponse, AWSError>;
  /**
   * Remove tags from an App Runner resource.
   */
  untagResource(callback?: (err: AWSError, data: AppRunner.Types.UntagResourceResponse) => void): Request<AppRunner.Types.UntagResourceResponse, AWSError>;
  /**
   * Update an App Runner service. You can update the source configuration and instance configuration of the service. You can also update the ARN of the auto scaling configuration resource that's associated with the service. However, you can't change the name or the encryption configuration of the service. These can be set only when you create the service. To update the tags applied to your service, use the separate actions TagResource and UntagResource. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  updateService(params: AppRunner.Types.UpdateServiceRequest, callback?: (err: AWSError, data: AppRunner.Types.UpdateServiceResponse) => void): Request<AppRunner.Types.UpdateServiceResponse, AWSError>;
  /**
   * Update an App Runner service. You can update the source configuration and instance configuration of the service. You can also update the ARN of the auto scaling configuration resource that's associated with the service. However, you can't change the name or the encryption configuration of the service. These can be set only when you create the service. To update the tags applied to your service, use the separate actions TagResource and UntagResource. This is an asynchronous operation. On a successful call, you can use the returned OperationId and the ListOperations call to track the operation's progress.
   */
  updateService(callback?: (err: AWSError, data: AppRunner.Types.UpdateServiceResponse) => void): Request<AppRunner.Types.UpdateServiceResponse, AWSError>;
}
declare namespace AppRunner {
  export type ASConfigMaxConcurrency = number;
  export type ASConfigMaxSize = number;
  export type ASConfigMinSize = number;
  export type AppRunnerResourceArn = string;
  export interface AssociateCustomDomainRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to associate a custom domain name with.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A custom domain endpoint to associate. Specify a root domain (for example, example.com), a subdomain (for example, login.example.com or admin.login.example.com), or a wildcard (for example, *.example.com).
     */
    DomainName: DomainName;
    /**
     * Set to true to associate the subdomain www.DomainName  with the App Runner service in addition to the base domain. Default: true 
     */
    EnableWWWSubdomain?: NullableBoolean;
  }
  export interface AssociateCustomDomainResponse {
    /**
     * The App Runner subdomain of the App Runner service. The custom domain name is mapped to this target name.
     */
    DNSTarget: String;
    /**
     * The Amazon Resource Name (ARN) of the App Runner service with which a custom domain name is associated.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A description of the domain name that's being associated.
     */
    CustomDomain: CustomDomain;
  }
  export interface AuthenticationConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the App Runner connection that enables the App Runner service to connect to a source repository. It's required for GitHub code repositories.
     */
    ConnectionArn?: AppRunnerResourceArn;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants the App Runner service access to a source repository. It's required for ECR image repositories (but not for ECR Public repositories).
     */
    AccessRoleArn?: RoleArn;
  }
  export interface AutoScalingConfiguration {
    /**
     * The Amazon Resource Name (ARN) of this auto scaling configuration.
     */
    AutoScalingConfigurationArn?: AppRunnerResourceArn;
    /**
     * The customer-provided auto scaling configuration name. It can be used in multiple revisions of a configuration.
     */
    AutoScalingConfigurationName?: AutoScalingConfigurationName;
    /**
     * The revision of this auto scaling configuration. It's unique among all the active configurations ("Status": "ACTIVE") that share the same AutoScalingConfigurationName.
     */
    AutoScalingConfigurationRevision?: Integer;
    /**
     * It's set to true for the configuration with the highest Revision among all configurations that share the same Name. It's set to false otherwise.
     */
    Latest?: Boolean;
    /**
     * The current state of the auto scaling configuration. If the status of a configuration revision is INACTIVE, it was deleted and can't be used. Inactive configuration revisions are permanently removed some time after they are deleted.
     */
    Status?: AutoScalingConfigurationStatus;
    /**
     * The maximum number of concurrent requests that an instance processes. If the number of concurrent requests exceeds this limit, App Runner scales the service up.
     */
    MaxConcurrency?: Integer;
    /**
     * The minimum number of instances that App Runner provisions for a service. The service always has at least MinSize provisioned instances. Some of them actively serve traffic. The rest of them (provisioned and inactive instances) are a cost-effective compute capacity reserve and are ready to be quickly activated. You pay for memory usage of all the provisioned instances. You pay for CPU usage of only the active subset. App Runner temporarily doubles the number of provisioned instances during deployments, to maintain the same capacity for both old and new code.
     */
    MinSize?: Integer;
    /**
     * The maximum number of instances that a service scales up to. At most MaxSize instances actively serve traffic for your service.
     */
    MaxSize?: Integer;
    /**
     * The time when the auto scaling configuration was created. It's in Unix time stamp format.
     */
    CreatedAt?: Timestamp;
    /**
     * The time when the auto scaling configuration was deleted. It's in Unix time stamp format.
     */
    DeletedAt?: Timestamp;
  }
  export type AutoScalingConfigurationName = string;
  export type AutoScalingConfigurationStatus = "ACTIVE"|"INACTIVE"|string;
  export interface AutoScalingConfigurationSummary {
    /**
     * The Amazon Resource Name (ARN) of this auto scaling configuration.
     */
    AutoScalingConfigurationArn?: AppRunnerResourceArn;
    /**
     * The customer-provided auto scaling configuration name. It can be used in multiple revisions of a configuration.
     */
    AutoScalingConfigurationName?: AutoScalingConfigurationName;
    /**
     * The revision of this auto scaling configuration. It's unique among all the active configurations ("Status": "ACTIVE") with the same AutoScalingConfigurationName.
     */
    AutoScalingConfigurationRevision?: Integer;
  }
  export type AutoScalingConfigurationSummaryList = AutoScalingConfigurationSummary[];
  export type Boolean = boolean;
  export type BuildCommand = string;
  export interface CertificateValidationRecord {
    /**
     * The certificate CNAME record name.
     */
    Name?: String;
    /**
     * The record type, always CNAME.
     */
    Type?: String;
    /**
     * The certificate CNAME record value.
     */
    Value?: String;
    /**
     * The current state of the certificate CNAME record validation. It should change to SUCCESS after App Runner completes validation with your DNS.
     */
    Status?: CertificateValidationRecordStatus;
  }
  export type CertificateValidationRecordList = CertificateValidationRecord[];
  export type CertificateValidationRecordStatus = "PENDING_VALIDATION"|"SUCCESS"|"FAILED"|string;
  export interface CodeConfiguration {
    /**
     * The source of the App Runner configuration. Values are interpreted as follows:    REPOSITORY – App Runner reads configuration values from the apprunner.yaml file in the source code repository and ignores CodeConfigurationValues.    API – App Runner uses configuration values provided in CodeConfigurationValues and ignores the apprunner.yaml file in the source code repository.  
     */
    ConfigurationSource: ConfigurationSource;
    /**
     * The basic configuration for building and running the App Runner service. Use it to quickly launch an App Runner service without providing a apprunner.yaml file in the source code repository (or ignoring the file if it exists).
     */
    CodeConfigurationValues?: CodeConfigurationValues;
  }
  export interface CodeConfigurationValues {
    /**
     * A runtime environment type for building and running an App Runner service. It represents a programming language runtime.
     */
    Runtime: Runtime;
    /**
     * The command App Runner runs to build your application.
     */
    BuildCommand?: BuildCommand;
    /**
     * The command App Runner runs to start your application.
     */
    StartCommand?: StartCommand;
    /**
     * The port that your application listens to in the container. Default: 8080 
     */
    Port?: String;
    /**
     * The environment variables that are available to your running App Runner service. An array of key-value pairs. Keys with a prefix of AWSAPPRUNNER are reserved for system use and aren't valid.
     */
    RuntimeEnvironmentVariables?: RuntimeEnvironmentVariables;
  }
  export interface CodeRepository {
    /**
     * The location of the repository that contains the source code.
     */
    RepositoryUrl: String;
    /**
     * The version that should be used within the source code repository.
     */
    SourceCodeVersion: SourceCodeVersion;
    /**
     * Configuration for building and running the service from a source code repository.
     */
    CodeConfiguration?: CodeConfiguration;
  }
  export type ConfigurationSource = "REPOSITORY"|"API"|string;
  export interface Connection {
    /**
     * The customer-provided connection name.
     */
    ConnectionName?: ConnectionName;
    /**
     * The Amazon Resource Name (ARN) of this connection.
     */
    ConnectionArn?: AppRunnerResourceArn;
    /**
     * The source repository provider.
     */
    ProviderType?: ProviderType;
    /**
     * The current state of the App Runner connection. When the state is AVAILABLE, you can use the connection to create an App Runner service.
     */
    Status?: ConnectionStatus;
    /**
     * The App Runner connection creation time, expressed as a Unix time stamp.
     */
    CreatedAt?: Timestamp;
  }
  export type ConnectionName = string;
  export type ConnectionStatus = "PENDING_HANDSHAKE"|"AVAILABLE"|"ERROR"|"DELETED"|string;
  export interface ConnectionSummary {
    /**
     * The customer-provided connection name.
     */
    ConnectionName?: ConnectionName;
    /**
     * The Amazon Resource Name (ARN) of this connection.
     */
    ConnectionArn?: AppRunnerResourceArn;
    /**
     * The source repository provider.
     */
    ProviderType?: ProviderType;
    /**
     * The current state of the App Runner connection. When the state is AVAILABLE, you can use the connection to create an App Runner service.
     */
    Status?: ConnectionStatus;
    /**
     * The App Runner connection creation time, expressed as a Unix time stamp.
     */
    CreatedAt?: Timestamp;
  }
  export type ConnectionSummaryList = ConnectionSummary[];
  export type Cpu = string;
  export interface CreateAutoScalingConfigurationRequest {
    /**
     * A name for the auto scaling configuration. When you use it for the first time in an Amazon Web Services Region, App Runner creates revision number 1 of this name. When you use the same name in subsequent calls, App Runner creates incremental revisions of the configuration.
     */
    AutoScalingConfigurationName: AutoScalingConfigurationName;
    /**
     * The maximum number of concurrent requests that you want an instance to process. If the number of concurrent requests exceeds this limit, App Runner scales up your service. Default: 100 
     */
    MaxConcurrency?: ASConfigMaxConcurrency;
    /**
     * The minimum number of instances that App Runner provisions for your service. The service always has at least MinSize provisioned instances. Some of them actively serve traffic. The rest of them (provisioned and inactive instances) are a cost-effective compute capacity reserve and are ready to be quickly activated. You pay for memory usage of all the provisioned instances. You pay for CPU usage of only the active subset. App Runner temporarily doubles the number of provisioned instances during deployments, to maintain the same capacity for both old and new code. Default: 1 
     */
    MinSize?: ASConfigMinSize;
    /**
     * The maximum number of instances that your service scales up to. At most MaxSize instances actively serve traffic for your service. Default: 25 
     */
    MaxSize?: ASConfigMaxSize;
    /**
     * A list of metadata items that you can associate with your auto scaling configuration resource. A tag is a key-value pair.
     */
    Tags?: TagList;
  }
  export interface CreateAutoScalingConfigurationResponse {
    /**
     * A description of the App Runner auto scaling configuration that's created by this request.
     */
    AutoScalingConfiguration: AutoScalingConfiguration;
  }
  export interface CreateConnectionRequest {
    /**
     * A name for the new connection. It must be unique across all App Runner connections for the Amazon Web Services account in the Amazon Web Services Region.
     */
    ConnectionName: ConnectionName;
    /**
     * The source repository provider.
     */
    ProviderType: ProviderType;
    /**
     * A list of metadata items that you can associate with your connection resource. A tag is a key-value pair.
     */
    Tags?: TagList;
  }
  export interface CreateConnectionResponse {
    /**
     * A description of the App Runner connection that's created by this request.
     */
    Connection: Connection;
  }
  export interface CreateServiceRequest {
    /**
     * A name for the new service. It must be unique across all the running App Runner services in your Amazon Web Services account in the Amazon Web Services Region.
     */
    ServiceName: ServiceName;
    /**
     * The source to deploy to the App Runner service. It can be a code or an image repository.
     */
    SourceConfiguration: SourceConfiguration;
    /**
     * The runtime configuration of instances (scaling units) of the App Runner service.
     */
    InstanceConfiguration?: InstanceConfiguration;
    /**
     * An optional list of metadata items that you can associate with your service resource. A tag is a key-value pair.
     */
    Tags?: TagList;
    /**
     * An optional custom encryption key that App Runner uses to encrypt the copy of your source repository that it maintains and your service logs. By default, App Runner uses an Amazon Web Services managed CMK.
     */
    EncryptionConfiguration?: EncryptionConfiguration;
    /**
     * The settings for the health check that App Runner performs to monitor the health of your service.
     */
    HealthCheckConfiguration?: HealthCheckConfiguration;
    /**
     * The Amazon Resource Name (ARN) of an App Runner automatic scaling configuration resource that you want to associate with your service. If not provided, App Runner associates the latest revision of a default auto scaling configuration.
     */
    AutoScalingConfigurationArn?: AppRunnerResourceArn;
  }
  export interface CreateServiceResponse {
    /**
     * A description of the App Runner service that's created by this request.
     */
    Service: Service;
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId: UUID;
  }
  export interface CustomDomain {
    /**
     * An associated custom domain endpoint. It can be a root domain (for example, example.com), a subdomain (for example, login.example.com or admin.login.example.com), or a wildcard (for example, *.example.com).
     */
    DomainName: DomainName;
    /**
     * When true, the subdomain www.DomainName  is associated with the App Runner service in addition to the base domain.
     */
    EnableWWWSubdomain: NullableBoolean;
    /**
     * A list of certificate CNAME records that's used for this domain name.
     */
    CertificateValidationRecords?: CertificateValidationRecordList;
    /**
     * The current state of the domain name association.
     */
    Status: CustomDomainAssociationStatus;
  }
  export type CustomDomainAssociationStatus = "CREATING"|"CREATE_FAILED"|"ACTIVE"|"DELETING"|"DELETE_FAILED"|"PENDING_CERTIFICATE_DNS_VALIDATION"|"BINDING_CERTIFICATE"|string;
  export type CustomDomainList = CustomDomain[];
  export interface DeleteAutoScalingConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner auto scaling configuration that you want to delete. The ARN can be a full auto scaling configuration ARN, or a partial ARN ending with either .../name  or .../name/revision . If a revision isn't specified, the latest active revision is deleted.
     */
    AutoScalingConfigurationArn: AppRunnerResourceArn;
  }
  export interface DeleteAutoScalingConfigurationResponse {
    /**
     * A description of the App Runner auto scaling configuration that this request just deleted.
     */
    AutoScalingConfiguration: AutoScalingConfiguration;
  }
  export interface DeleteConnectionRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner connection that you want to delete.
     */
    ConnectionArn: AppRunnerResourceArn;
  }
  export interface DeleteConnectionResponse {
    /**
     * A description of the App Runner connection that this request just deleted.
     */
    Connection?: Connection;
  }
  export interface DeleteServiceRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to delete.
     */
    ServiceArn: AppRunnerResourceArn;
  }
  export interface DeleteServiceResponse {
    /**
     * A description of the App Runner service that this request just deleted.
     */
    Service: Service;
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId: UUID;
  }
  export interface DescribeAutoScalingConfigurationRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner auto scaling configuration that you want a description for. The ARN can be a full auto scaling configuration ARN, or a partial ARN ending with either .../name  or .../name/revision . If a revision isn't specified, the latest active revision is described.
     */
    AutoScalingConfigurationArn: AppRunnerResourceArn;
  }
  export interface DescribeAutoScalingConfigurationResponse {
    /**
     * A full description of the App Runner auto scaling configuration that you specified in this request.
     */
    AutoScalingConfiguration: AutoScalingConfiguration;
  }
  export type DescribeCustomDomainsMaxResults = number;
  export interface DescribeCustomDomainsRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want associated custom domain names to be described for.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A token from a previous result page. It's used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones that are specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: String;
    /**
     * The maximum number of results that each response (result page) can include. It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: DescribeCustomDomainsMaxResults;
  }
  export interface DescribeCustomDomainsResponse {
    /**
     * The App Runner subdomain of the App Runner service. The associated custom domain names are mapped to this target name.
     */
    DNSTarget: String;
    /**
     * The Amazon Resource Name (ARN) of the App Runner service whose associated custom domain names you want to describe.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A list of descriptions of custom domain names that are associated with the service. In a paginated request, the request returns up to MaxResults records per call.
     */
    CustomDomains: CustomDomainList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: String;
  }
  export interface DescribeServiceRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want a description for.
     */
    ServiceArn: AppRunnerResourceArn;
  }
  export interface DescribeServiceResponse {
    /**
     * A full description of the App Runner service that you specified in this request.
     */
    Service: Service;
  }
  export interface DisassociateCustomDomainRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to disassociate a custom domain name from.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * The domain name that you want to disassociate from the App Runner service.
     */
    DomainName: DomainName;
  }
  export interface DisassociateCustomDomainResponse {
    /**
     * The App Runner subdomain of the App Runner service. The disassociated custom domain name was mapped to this target name.
     */
    DNSTarget: String;
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that a custom domain name is disassociated from.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A description of the domain name that's being disassociated.
     */
    CustomDomain: CustomDomain;
  }
  export type DomainName = string;
  export interface EncryptionConfiguration {
    /**
     * The ARN of the KMS key that's used for encryption.
     */
    KmsKey: KmsKeyArn;
  }
  export interface HealthCheckConfiguration {
    /**
     * The IP protocol that App Runner uses to perform health checks for your service. If you set Protocol to HTTP, App Runner sends health check requests to the HTTP path specified by Path. Default: TCP 
     */
    Protocol?: HealthCheckProtocol;
    /**
     * The URL that health check requests are sent to.  Path is only applicable when you set Protocol to HTTP. Default: "/" 
     */
    Path?: HealthCheckPath;
    /**
     * The time interval, in seconds, between health checks. Default: 5 
     */
    Interval?: HealthCheckInterval;
    /**
     * The time, in seconds, to wait for a health check response before deciding it failed. Default: 2 
     */
    Timeout?: HealthCheckTimeout;
    /**
     * The number of consecutive checks that must succeed before App Runner decides that the service is healthy. Default: 1 
     */
    HealthyThreshold?: HealthCheckHealthyThreshold;
    /**
     * The number of consecutive checks that must fail before App Runner decides that the service is unhealthy. Default: 5 
     */
    UnhealthyThreshold?: HealthCheckUnhealthyThreshold;
  }
  export type HealthCheckHealthyThreshold = number;
  export type HealthCheckInterval = number;
  export type HealthCheckPath = string;
  export type HealthCheckProtocol = "TCP"|"HTTP"|string;
  export type HealthCheckTimeout = number;
  export type HealthCheckUnhealthyThreshold = number;
  export interface ImageConfiguration {
    /**
     * Environment variables that are available to your running App Runner service. An array of key-value pairs. Keys with a prefix of AWSAPPRUNNER are reserved for system use and aren't valid.
     */
    RuntimeEnvironmentVariables?: RuntimeEnvironmentVariables;
    /**
     * An optional command that App Runner runs to start the application in the source image. If specified, this command overrides the Docker image’s default start command.
     */
    StartCommand?: String;
    /**
     * The port that your application listens to in the container. Default: 8080 
     */
    Port?: String;
  }
  export type ImageIdentifier = string;
  export interface ImageRepository {
    /**
     * The identifier of an image. For an image in Amazon Elastic Container Registry (Amazon ECR), this is an image name. For the image name format, see Pulling an image in the Amazon ECR User Guide.
     */
    ImageIdentifier: ImageIdentifier;
    /**
     * Configuration for running the identified image.
     */
    ImageConfiguration?: ImageConfiguration;
    /**
     * The type of the image repository. This reflects the repository provider and whether the repository is private or public.
     */
    ImageRepositoryType: ImageRepositoryType;
  }
  export type ImageRepositoryType = "ECR"|"ECR_PUBLIC"|string;
  export interface InstanceConfiguration {
    /**
     * The number of CPU units reserved for each instance of your App Runner service. Default: 1 vCPU 
     */
    Cpu?: Cpu;
    /**
     * The amount of memory, in MB or GB, reserved for each instance of your App Runner service. Default: 2 GB 
     */
    Memory?: Memory;
    /**
     * The Amazon Resource Name (ARN) of an IAM role that provides permissions to your App Runner service. These are permissions that your code needs when it calls any Amazon Web Services APIs.
     */
    InstanceRoleArn?: RoleArn;
  }
  export type Integer = number;
  export type KmsKeyArn = string;
  export interface ListAutoScalingConfigurationsRequest {
    /**
     * The name of the App Runner auto scaling configuration that you want to list. If specified, App Runner lists revisions that share this name. If not specified, App Runner returns revisions of all configurations.
     */
    AutoScalingConfigurationName?: AutoScalingConfigurationName;
    /**
     * Set to true to list only the latest revision for each requested configuration name. Keep as false to list all revisions for each requested configuration name. Default: false 
     */
    LatestOnly?: Boolean;
    /**
     * The maximum number of results to include in each response (result page). It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: MaxResults;
    /**
     * A token from a previous result page. It's used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones that are specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: NextToken;
  }
  export interface ListAutoScalingConfigurationsResponse {
    /**
     * A list of summary information records for auto scaling configurations. In a paginated request, the request returns up to MaxResults records for each call.
     */
    AutoScalingConfigurationSummaryList: AutoScalingConfigurationSummaryList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: NextToken;
  }
  export interface ListConnectionsRequest {
    /**
     * If specified, only this connection is returned. If not specified, the result isn't filtered by name.
     */
    ConnectionName?: ConnectionName;
    /**
     * The maximum number of results to include in each response (result page). Used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: MaxResults;
    /**
     * A token from a previous result page. Used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: NextToken;
  }
  export interface ListConnectionsResponse {
    /**
     * A list of summary information records for connections. In a paginated request, the request returns up to MaxResults records for each call.
     */
    ConnectionSummaryList: ConnectionSummaryList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. Returned in a paginated request.
     */
    NextToken?: NextToken;
  }
  export type ListOperationsMaxResults = number;
  export interface ListOperationsRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want a list of operations for.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A token from a previous result page. It's used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: String;
    /**
     * The maximum number of results to include in each response (result page). It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: ListOperationsMaxResults;
  }
  export interface ListOperationsResponse {
    /**
     * A list of operation summary information records. In a paginated request, the request returns up to MaxResults records for each call.
     */
    OperationSummaryList?: OperationSummaryList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: String;
  }
  export interface ListServicesRequest {
    /**
     * A token from a previous result page. Used for a paginated request. The request retrieves the next result page. All other parameter values must be identical to the ones specified in the initial request. If you don't specify NextToken, the request retrieves the first result page.
     */
    NextToken?: String;
    /**
     * The maximum number of results to include in each response (result page). It's used for a paginated request. If you don't specify MaxResults, the request retrieves all available results in a single response.
     */
    MaxResults?: ServiceMaxResults;
  }
  export interface ListServicesResponse {
    /**
     * A list of service summary information records. In a paginated request, the request returns up to MaxResults records for each call.
     */
    ServiceSummaryList: ServiceSummaryList;
    /**
     * The token that you can pass in a subsequent request to get the next result page. It's returned in a paginated request.
     */
    NextToken?: String;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that a tag list is requested for. It must be the ARN of an App Runner resource.
     */
    ResourceArn: AppRunnerResourceArn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of the tag key-value pairs that are associated with the resource.
     */
    Tags?: TagList;
  }
  export type MaxResults = number;
  export type Memory = string;
  export type NextToken = string;
  export type NullableBoolean = boolean;
  export type OperationStatus = "PENDING"|"IN_PROGRESS"|"FAILED"|"SUCCEEDED"|"ROLLBACK_IN_PROGRESS"|"ROLLBACK_FAILED"|"ROLLBACK_SUCCEEDED"|string;
  export interface OperationSummary {
    /**
     * A unique ID of this operation. It's unique in the scope of the App Runner service.
     */
    Id?: UUID;
    /**
     * The type of operation. It indicates a specific action that occured.
     */
    Type?: OperationType;
    /**
     * The current state of the operation.
     */
    Status?: OperationStatus;
    /**
     * The Amazon Resource Name (ARN) of the resource that the operation acted on (for example, an App Runner service).
     */
    TargetArn?: AppRunnerResourceArn;
    /**
     * The time when the operation started. It's in the Unix time stamp format.
     */
    StartedAt?: Timestamp;
    /**
     * The time when the operation ended. It's in the Unix time stamp format.
     */
    EndedAt?: Timestamp;
    /**
     * The time when the operation was last updated. It's in the Unix time stamp format.
     */
    UpdatedAt?: Timestamp;
  }
  export type OperationSummaryList = OperationSummary[];
  export type OperationType = "START_DEPLOYMENT"|"CREATE_SERVICE"|"PAUSE_SERVICE"|"RESUME_SERVICE"|"DELETE_SERVICE"|string;
  export interface PauseServiceRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to pause.
     */
    ServiceArn: AppRunnerResourceArn;
  }
  export interface PauseServiceResponse {
    /**
     * A description of the App Runner service that this request just paused.
     */
    Service: Service;
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId?: UUID;
  }
  export type ProviderType = "GITHUB"|string;
  export interface ResumeServiceRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to resume.
     */
    ServiceArn: AppRunnerResourceArn;
  }
  export interface ResumeServiceResponse {
    /**
     * A description of the App Runner service that this request just resumed.
     */
    Service: Service;
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId?: UUID;
  }
  export type RoleArn = string;
  export type Runtime = "PYTHON_3"|"NODEJS_12"|string;
  export type RuntimeEnvironmentVariables = {[key: string]: RuntimeEnvironmentVariablesValue};
  export type RuntimeEnvironmentVariablesKey = string;
  export type RuntimeEnvironmentVariablesValue = string;
  export interface Service {
    /**
     * The customer-provided service name.
     */
    ServiceName: ServiceName;
    /**
     * An ID that App Runner generated for this service. It's unique within the Amazon Web Services Region.
     */
    ServiceId: ServiceId;
    /**
     * The Amazon Resource Name (ARN) of this service.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * A subdomain URL that App Runner generated for this service. You can use this URL to access your service web application.
     */
    ServiceUrl: String;
    /**
     * The time when the App Runner service was created. It's in the Unix time stamp format.
     */
    CreatedAt: Timestamp;
    /**
     * The time when the App Runner service was last updated at. It's in the Unix time stamp format.
     */
    UpdatedAt: Timestamp;
    /**
     * The time when the App Runner service was deleted. It's in the Unix time stamp format.
     */
    DeletedAt?: Timestamp;
    /**
     * The current state of the App Runner service. These particular values mean the following.    CREATE_FAILED – The service failed to create. To troubleshoot this failure, read the failure events and logs, change any parameters that need to be fixed, and retry the call to create the service. The failed service isn't usable, and still counts towards your service quota. When you're done analyzing the failure, delete the service.    DELETE_FAILED – The service failed to delete and can't be successfully recovered. Retry the service deletion call to ensure that all related resources are removed.  
     */
    Status: ServiceStatus;
    /**
     * The source deployed to the App Runner service. It can be a code or an image repository.
     */
    SourceConfiguration: SourceConfiguration;
    /**
     * The runtime configuration of instances (scaling units) of this service.
     */
    InstanceConfiguration: InstanceConfiguration;
    /**
     * The encryption key that App Runner uses to encrypt the service logs and the copy of the source repository that App Runner maintains for the service. It can be either a customer-provided encryption key or an Amazon Web Services managed CMK.
     */
    EncryptionConfiguration?: EncryptionConfiguration;
    /**
     * The settings for the health check that App Runner performs to monitor the health of this service.
     */
    HealthCheckConfiguration?: HealthCheckConfiguration;
    /**
     * Summary information for the App Runner automatic scaling configuration resource that's associated with this service.
     */
    AutoScalingConfigurationSummary: AutoScalingConfigurationSummary;
  }
  export type ServiceId = string;
  export type ServiceMaxResults = number;
  export type ServiceName = string;
  export type ServiceStatus = "CREATE_FAILED"|"RUNNING"|"DELETED"|"DELETE_FAILED"|"PAUSED"|"OPERATION_IN_PROGRESS"|string;
  export interface ServiceSummary {
    /**
     * The customer-provided service name.
     */
    ServiceName?: ServiceName;
    /**
     * An ID that App Runner generated for this service. It's unique within the Amazon Web Services Region.
     */
    ServiceId?: ServiceId;
    /**
     * The Amazon Resource Name (ARN) of this service.
     */
    ServiceArn?: AppRunnerResourceArn;
    /**
     * A subdomain URL that App Runner generated for this service. You can use this URL to access your service web application.
     */
    ServiceUrl?: String;
    /**
     * The time when the App Runner service was created. It's in the Unix time stamp format.
     */
    CreatedAt?: Timestamp;
    /**
     * The time when the App Runner service was last updated. It's in theUnix time stamp format.
     */
    UpdatedAt?: Timestamp;
    /**
     * The current state of the App Runner service. These particular values mean the following.    CREATE_FAILED – The service failed to create. Read the failure events and logs, change any parameters that need to be fixed, and retry the call to create the service. The failed service isn't usable, and still counts towards your service quota. When you're done analyzing the failure, delete the service.    DELETE_FAILED – The service failed to delete and can't be successfully recovered. Retry the service deletion call to ensure that all related resources are removed.  
     */
    Status?: ServiceStatus;
  }
  export type ServiceSummaryList = ServiceSummary[];
  export interface SourceCodeVersion {
    /**
     * The type of version identifier. For a git-based repository, branches represent versions.
     */
    Type: SourceCodeVersionType;
    /**
     * A source code version. For a git-based repository, a branch name maps to a specific version. App Runner uses the most recent commit to the branch.
     */
    Value: String;
  }
  export type SourceCodeVersionType = "BRANCH"|string;
  export interface SourceConfiguration {
    /**
     * The description of a source code repository. You must provide either this member or ImageRepository (but not both).
     */
    CodeRepository?: CodeRepository;
    /**
     * The description of a source image repository. You must provide either this member or CodeRepository (but not both).
     */
    ImageRepository?: ImageRepository;
    /**
     * If true, continuous integration from the source repository is enabled for the App Runner service. Each repository change (including any source code commit or new image version) starts a deployment. Default: App Runner sets to false for a source image that uses an ECR Public repository or an ECR repository that's in an Amazon Web Services account other than the one that the service is in. App Runner sets to true in all other cases (which currently include a source code repository or a source image using a same-account ECR repository).
     */
    AutoDeploymentsEnabled?: NullableBoolean;
    /**
     * Describes the resources that are needed to authenticate access to some source repositories.
     */
    AuthenticationConfiguration?: AuthenticationConfiguration;
  }
  export type StartCommand = string;
  export interface StartDeploymentRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to manually deploy to.
     */
    ServiceArn: AppRunnerResourceArn;
  }
  export interface StartDeploymentResponse {
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId: UUID;
  }
  export type String = string;
  export interface Tag {
    /**
     * The key of the tag.
     */
    Key?: TagKey;
    /**
     * The value of the tag.
     */
    Value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to update tags for. It must be the ARN of an App Runner resource.
     */
    ResourceArn: AppRunnerResourceArn;
    /**
     * A list of tag key-value pairs to add or update. If a key is new to the resource, the tag is added with the provided value. If a key is already associated with the resource, the value of the tag is updated.
     */
    Tags: TagList;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Timestamp = Date;
  export type UUID = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the resource that you want to remove tags from. It must be the ARN of an App Runner resource.
     */
    ResourceArn: AppRunnerResourceArn;
    /**
     * A list of tag keys that you want to remove.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateServiceRequest {
    /**
     * The Amazon Resource Name (ARN) of the App Runner service that you want to update.
     */
    ServiceArn: AppRunnerResourceArn;
    /**
     * The source configuration to apply to the App Runner service. You can change the configuration of the code or image repository that the service uses. However, you can't switch from code to image or the other way around. This means that you must provide the same structure member of SourceConfiguration that you originally included when you created the service. Specifically, you can include either CodeRepository or ImageRepository. To update the source configuration, set the values to members of the structure that you include.
     */
    SourceConfiguration?: SourceConfiguration;
    /**
     * The runtime configuration to apply to instances (scaling units) of the App Runner service.
     */
    InstanceConfiguration?: InstanceConfiguration;
    /**
     * The Amazon Resource Name (ARN) of an App Runner automatic scaling configuration resource that you want to associate with your service.
     */
    AutoScalingConfigurationArn?: AppRunnerResourceArn;
    /**
     * The settings for the health check that App Runner performs to monitor the health of your service.
     */
    HealthCheckConfiguration?: HealthCheckConfiguration;
  }
  export interface UpdateServiceResponse {
    /**
     * A description of the App Runner service updated by this request. All configuration values in the returned Service structure reflect configuration changes that are being applied by this request.
     */
    Service: Service;
    /**
     * The unique ID of the asynchronous operation that this request started. You can use it combined with the ListOperations call to track the operation's progress.
     */
    OperationId: UUID;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2020-05-15"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the AppRunner client.
   */
  export import Types = AppRunner;
}
export = AppRunner;
