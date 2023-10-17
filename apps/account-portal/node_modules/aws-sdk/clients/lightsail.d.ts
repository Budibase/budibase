import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class Lightsail extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: Lightsail.Types.ClientConfiguration)
  config: Config & Lightsail.Types.ClientConfiguration;
  /**
   * Allocates a static IP address.
   */
  allocateStaticIp(params: Lightsail.Types.AllocateStaticIpRequest, callback?: (err: AWSError, data: Lightsail.Types.AllocateStaticIpResult) => void): Request<Lightsail.Types.AllocateStaticIpResult, AWSError>;
  /**
   * Allocates a static IP address.
   */
  allocateStaticIp(callback?: (err: AWSError, data: Lightsail.Types.AllocateStaticIpResult) => void): Request<Lightsail.Types.AllocateStaticIpResult, AWSError>;
  /**
   * Attaches an SSL/TLS certificate to your Amazon Lightsail content delivery network (CDN) distribution. After the certificate is attached, your distribution accepts HTTPS traffic for all of the domains that are associated with the certificate. Use the CreateCertificate action to create a certificate that you can attach to your distribution.  Only certificates created in the us-east-1 AWS Region can be attached to Lightsail distributions. Lightsail distributions are global resources that can reference an origin in any AWS Region, and distribute its content globally. However, all distributions are located in the us-east-1 Region. 
   */
  attachCertificateToDistribution(params: Lightsail.Types.AttachCertificateToDistributionRequest, callback?: (err: AWSError, data: Lightsail.Types.AttachCertificateToDistributionResult) => void): Request<Lightsail.Types.AttachCertificateToDistributionResult, AWSError>;
  /**
   * Attaches an SSL/TLS certificate to your Amazon Lightsail content delivery network (CDN) distribution. After the certificate is attached, your distribution accepts HTTPS traffic for all of the domains that are associated with the certificate. Use the CreateCertificate action to create a certificate that you can attach to your distribution.  Only certificates created in the us-east-1 AWS Region can be attached to Lightsail distributions. Lightsail distributions are global resources that can reference an origin in any AWS Region, and distribute its content globally. However, all distributions are located in the us-east-1 Region. 
   */
  attachCertificateToDistribution(callback?: (err: AWSError, data: Lightsail.Types.AttachCertificateToDistributionResult) => void): Request<Lightsail.Types.AttachCertificateToDistributionResult, AWSError>;
  /**
   * Attaches a block storage disk to a running or stopped Lightsail instance and exposes it to the instance with the specified disk name. The attach disk operation supports tag-based access control via resource tags applied to the resource identified by disk name. For more information, see the Amazon Lightsail Developer Guide.
   */
  attachDisk(params: Lightsail.Types.AttachDiskRequest, callback?: (err: AWSError, data: Lightsail.Types.AttachDiskResult) => void): Request<Lightsail.Types.AttachDiskResult, AWSError>;
  /**
   * Attaches a block storage disk to a running or stopped Lightsail instance and exposes it to the instance with the specified disk name. The attach disk operation supports tag-based access control via resource tags applied to the resource identified by disk name. For more information, see the Amazon Lightsail Developer Guide.
   */
  attachDisk(callback?: (err: AWSError, data: Lightsail.Types.AttachDiskResult) => void): Request<Lightsail.Types.AttachDiskResult, AWSError>;
  /**
   * Attaches one or more Lightsail instances to a load balancer. After some time, the instances are attached to the load balancer and the health check status is available. The attach instances to load balancer operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Lightsail Developer Guide.
   */
  attachInstancesToLoadBalancer(params: Lightsail.Types.AttachInstancesToLoadBalancerRequest, callback?: (err: AWSError, data: Lightsail.Types.AttachInstancesToLoadBalancerResult) => void): Request<Lightsail.Types.AttachInstancesToLoadBalancerResult, AWSError>;
  /**
   * Attaches one or more Lightsail instances to a load balancer. After some time, the instances are attached to the load balancer and the health check status is available. The attach instances to load balancer operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Lightsail Developer Guide.
   */
  attachInstancesToLoadBalancer(callback?: (err: AWSError, data: Lightsail.Types.AttachInstancesToLoadBalancerResult) => void): Request<Lightsail.Types.AttachInstancesToLoadBalancerResult, AWSError>;
  /**
   * Attaches a Transport Layer Security (TLS) certificate to your load balancer. TLS is just an updated, more secure version of Secure Socket Layer (SSL). Once you create and validate your certificate, you can attach it to your load balancer. You can also use this API to rotate the certificates on your account. Use the AttachLoadBalancerTlsCertificate action with the non-attached certificate, and it will replace the existing one and become the attached certificate. The AttachLoadBalancerTlsCertificate operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  attachLoadBalancerTlsCertificate(params: Lightsail.Types.AttachLoadBalancerTlsCertificateRequest, callback?: (err: AWSError, data: Lightsail.Types.AttachLoadBalancerTlsCertificateResult) => void): Request<Lightsail.Types.AttachLoadBalancerTlsCertificateResult, AWSError>;
  /**
   * Attaches a Transport Layer Security (TLS) certificate to your load balancer. TLS is just an updated, more secure version of Secure Socket Layer (SSL). Once you create and validate your certificate, you can attach it to your load balancer. You can also use this API to rotate the certificates on your account. Use the AttachLoadBalancerTlsCertificate action with the non-attached certificate, and it will replace the existing one and become the attached certificate. The AttachLoadBalancerTlsCertificate operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  attachLoadBalancerTlsCertificate(callback?: (err: AWSError, data: Lightsail.Types.AttachLoadBalancerTlsCertificateResult) => void): Request<Lightsail.Types.AttachLoadBalancerTlsCertificateResult, AWSError>;
  /**
   * Attaches a static IP address to a specific Amazon Lightsail instance.
   */
  attachStaticIp(params: Lightsail.Types.AttachStaticIpRequest, callback?: (err: AWSError, data: Lightsail.Types.AttachStaticIpResult) => void): Request<Lightsail.Types.AttachStaticIpResult, AWSError>;
  /**
   * Attaches a static IP address to a specific Amazon Lightsail instance.
   */
  attachStaticIp(callback?: (err: AWSError, data: Lightsail.Types.AttachStaticIpResult) => void): Request<Lightsail.Types.AttachStaticIpResult, AWSError>;
  /**
   * Closes ports for a specific Amazon Lightsail instance. The CloseInstancePublicPorts action supports tag-based access control via resource tags applied to the resource identified by instanceName. For more information, see the Amazon Lightsail Developer Guide.
   */
  closeInstancePublicPorts(params: Lightsail.Types.CloseInstancePublicPortsRequest, callback?: (err: AWSError, data: Lightsail.Types.CloseInstancePublicPortsResult) => void): Request<Lightsail.Types.CloseInstancePublicPortsResult, AWSError>;
  /**
   * Closes ports for a specific Amazon Lightsail instance. The CloseInstancePublicPorts action supports tag-based access control via resource tags applied to the resource identified by instanceName. For more information, see the Amazon Lightsail Developer Guide.
   */
  closeInstancePublicPorts(callback?: (err: AWSError, data: Lightsail.Types.CloseInstancePublicPortsResult) => void): Request<Lightsail.Types.CloseInstancePublicPortsResult, AWSError>;
  /**
   * Copies a manual snapshot of an instance or disk as another manual snapshot, or copies an automatic snapshot of an instance or disk as a manual snapshot. This operation can also be used to copy a manual or automatic snapshot of an instance or a disk from one AWS Region to another in Amazon Lightsail. When copying a manual snapshot, be sure to define the source region, source snapshot name, and target snapshot name parameters. When copying an automatic snapshot, be sure to define the source region, source resource name, target snapshot name, and either the restore date or the use latest restorable auto snapshot parameters.
   */
  copySnapshot(params: Lightsail.Types.CopySnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.CopySnapshotResult) => void): Request<Lightsail.Types.CopySnapshotResult, AWSError>;
  /**
   * Copies a manual snapshot of an instance or disk as another manual snapshot, or copies an automatic snapshot of an instance or disk as a manual snapshot. This operation can also be used to copy a manual or automatic snapshot of an instance or a disk from one AWS Region to another in Amazon Lightsail. When copying a manual snapshot, be sure to define the source region, source snapshot name, and target snapshot name parameters. When copying an automatic snapshot, be sure to define the source region, source resource name, target snapshot name, and either the restore date or the use latest restorable auto snapshot parameters.
   */
  copySnapshot(callback?: (err: AWSError, data: Lightsail.Types.CopySnapshotResult) => void): Request<Lightsail.Types.CopySnapshotResult, AWSError>;
  /**
   * Creates an Amazon Lightsail bucket. A bucket is a cloud storage resource available in the Lightsail object storage service. Use buckets to store objects such as data and its descriptive metadata. For more information about buckets, see Buckets in Amazon Lightsail in the Amazon Lightsail Developer Guide.
   */
  createBucket(params: Lightsail.Types.CreateBucketRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateBucketResult) => void): Request<Lightsail.Types.CreateBucketResult, AWSError>;
  /**
   * Creates an Amazon Lightsail bucket. A bucket is a cloud storage resource available in the Lightsail object storage service. Use buckets to store objects such as data and its descriptive metadata. For more information about buckets, see Buckets in Amazon Lightsail in the Amazon Lightsail Developer Guide.
   */
  createBucket(callback?: (err: AWSError, data: Lightsail.Types.CreateBucketResult) => void): Request<Lightsail.Types.CreateBucketResult, AWSError>;
  /**
   * Creates a new access key for the specified Amazon Lightsail bucket. Access keys consist of an access key ID and corresponding secret access key. Access keys grant full programmatic access to the specified bucket and its objects. You can have a maximum of two access keys per bucket. Use the GetBucketAccessKeys action to get a list of current access keys for a specific bucket. For more information about access keys, see Creating access keys for a bucket in Amazon Lightsail in the Amazon Lightsail Developer Guide.  The secretAccessKey value is returned only in response to the CreateBucketAccessKey action. You can get a secret access key only when you first create an access key; you cannot get the secret access key later. If you lose the secret access key, you must create a new access key. 
   */
  createBucketAccessKey(params: Lightsail.Types.CreateBucketAccessKeyRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateBucketAccessKeyResult) => void): Request<Lightsail.Types.CreateBucketAccessKeyResult, AWSError>;
  /**
   * Creates a new access key for the specified Amazon Lightsail bucket. Access keys consist of an access key ID and corresponding secret access key. Access keys grant full programmatic access to the specified bucket and its objects. You can have a maximum of two access keys per bucket. Use the GetBucketAccessKeys action to get a list of current access keys for a specific bucket. For more information about access keys, see Creating access keys for a bucket in Amazon Lightsail in the Amazon Lightsail Developer Guide.  The secretAccessKey value is returned only in response to the CreateBucketAccessKey action. You can get a secret access key only when you first create an access key; you cannot get the secret access key later. If you lose the secret access key, you must create a new access key. 
   */
  createBucketAccessKey(callback?: (err: AWSError, data: Lightsail.Types.CreateBucketAccessKeyResult) => void): Request<Lightsail.Types.CreateBucketAccessKeyResult, AWSError>;
  /**
   * Creates an SSL/TLS certificate for an Amazon Lightsail content delivery network (CDN) distribution and a container service. After the certificate is valid, use the AttachCertificateToDistribution action to use the certificate and its domains with your distribution. Or use the UpdateContainerService action to use the certificate and its domains with your container service.  Only certificates created in the us-east-1 AWS Region can be attached to Lightsail distributions. Lightsail distributions are global resources that can reference an origin in any AWS Region, and distribute its content globally. However, all distributions are located in the us-east-1 Region. 
   */
  createCertificate(params: Lightsail.Types.CreateCertificateRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateCertificateResult) => void): Request<Lightsail.Types.CreateCertificateResult, AWSError>;
  /**
   * Creates an SSL/TLS certificate for an Amazon Lightsail content delivery network (CDN) distribution and a container service. After the certificate is valid, use the AttachCertificateToDistribution action to use the certificate and its domains with your distribution. Or use the UpdateContainerService action to use the certificate and its domains with your container service.  Only certificates created in the us-east-1 AWS Region can be attached to Lightsail distributions. Lightsail distributions are global resources that can reference an origin in any AWS Region, and distribute its content globally. However, all distributions are located in the us-east-1 Region. 
   */
  createCertificate(callback?: (err: AWSError, data: Lightsail.Types.CreateCertificateResult) => void): Request<Lightsail.Types.CreateCertificateResult, AWSError>;
  /**
   * Creates an AWS CloudFormation stack, which creates a new Amazon EC2 instance from an exported Amazon Lightsail snapshot. This operation results in a CloudFormation stack record that can be used to track the AWS CloudFormation stack created. Use the get cloud formation stack records operation to get a list of the CloudFormation stacks created.  Wait until after your new Amazon EC2 instance is created before running the create cloud formation stack operation again with the same export snapshot record. 
   */
  createCloudFormationStack(params: Lightsail.Types.CreateCloudFormationStackRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateCloudFormationStackResult) => void): Request<Lightsail.Types.CreateCloudFormationStackResult, AWSError>;
  /**
   * Creates an AWS CloudFormation stack, which creates a new Amazon EC2 instance from an exported Amazon Lightsail snapshot. This operation results in a CloudFormation stack record that can be used to track the AWS CloudFormation stack created. Use the get cloud formation stack records operation to get a list of the CloudFormation stacks created.  Wait until after your new Amazon EC2 instance is created before running the create cloud formation stack operation again with the same export snapshot record. 
   */
  createCloudFormationStack(callback?: (err: AWSError, data: Lightsail.Types.CreateCloudFormationStackResult) => void): Request<Lightsail.Types.CreateCloudFormationStackResult, AWSError>;
  /**
   * Creates an email or SMS text message contact method. A contact method is used to send you notifications about your Amazon Lightsail resources. You can add one email address and one mobile phone number contact method in each AWS Region. However, SMS text messaging is not supported in some AWS Regions, and SMS text messages cannot be sent to some countries/regions. For more information, see Notifications in Amazon Lightsail.
   */
  createContactMethod(params: Lightsail.Types.CreateContactMethodRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateContactMethodResult) => void): Request<Lightsail.Types.CreateContactMethodResult, AWSError>;
  /**
   * Creates an email or SMS text message contact method. A contact method is used to send you notifications about your Amazon Lightsail resources. You can add one email address and one mobile phone number contact method in each AWS Region. However, SMS text messaging is not supported in some AWS Regions, and SMS text messages cannot be sent to some countries/regions. For more information, see Notifications in Amazon Lightsail.
   */
  createContactMethod(callback?: (err: AWSError, data: Lightsail.Types.CreateContactMethodResult) => void): Request<Lightsail.Types.CreateContactMethodResult, AWSError>;
  /**
   * Creates an Amazon Lightsail container service. A Lightsail container service is a compute resource to which you can deploy containers. For more information, see Container services in Amazon Lightsail in the Lightsail Dev Guide.
   */
  createContainerService(params: Lightsail.Types.CreateContainerServiceRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateContainerServiceResult) => void): Request<Lightsail.Types.CreateContainerServiceResult, AWSError>;
  /**
   * Creates an Amazon Lightsail container service. A Lightsail container service is a compute resource to which you can deploy containers. For more information, see Container services in Amazon Lightsail in the Lightsail Dev Guide.
   */
  createContainerService(callback?: (err: AWSError, data: Lightsail.Types.CreateContainerServiceResult) => void): Request<Lightsail.Types.CreateContainerServiceResult, AWSError>;
  /**
   * Creates a deployment for your Amazon Lightsail container service. A deployment specifies the containers that will be launched on the container service and their settings, such as the ports to open, the environment variables to apply, and the launch command to run. It also specifies the container that will serve as the public endpoint of the deployment and its settings, such as the HTTP or HTTPS port to use, and the health check configuration. You can deploy containers to your container service using container images from a public registry like Docker Hub, or from your local machine. For more information, see Creating container images for your Amazon Lightsail container services in the Amazon Lightsail Developer Guide.
   */
  createContainerServiceDeployment(params: Lightsail.Types.CreateContainerServiceDeploymentRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateContainerServiceDeploymentResult) => void): Request<Lightsail.Types.CreateContainerServiceDeploymentResult, AWSError>;
  /**
   * Creates a deployment for your Amazon Lightsail container service. A deployment specifies the containers that will be launched on the container service and their settings, such as the ports to open, the environment variables to apply, and the launch command to run. It also specifies the container that will serve as the public endpoint of the deployment and its settings, such as the HTTP or HTTPS port to use, and the health check configuration. You can deploy containers to your container service using container images from a public registry like Docker Hub, or from your local machine. For more information, see Creating container images for your Amazon Lightsail container services in the Amazon Lightsail Developer Guide.
   */
  createContainerServiceDeployment(callback?: (err: AWSError, data: Lightsail.Types.CreateContainerServiceDeploymentResult) => void): Request<Lightsail.Types.CreateContainerServiceDeploymentResult, AWSError>;
  /**
   * Creates a temporary set of log in credentials that you can use to log in to the Docker process on your local machine. After you're logged in, you can use the native Docker commands to push your local container images to the container image registry of your Amazon Lightsail account so that you can use them with your Lightsail container service. The log in credentials expire 12 hours after they are created, at which point you will need to create a new set of log in credentials.  You can only push container images to the container service registry of your Lightsail account. You cannot pull container images or perform any other container image management actions on the container service registry.  After you push your container images to the container image registry of your Lightsail account, use the RegisterContainerImage action to register the pushed images to a specific Lightsail container service.  This action is not required if you install and use the Lightsail Control (lightsailctl) plugin to push container images to your Lightsail container service. For more information, see Pushing and managing container images on your Amazon Lightsail container services in the Amazon Lightsail Developer Guide. 
   */
  createContainerServiceRegistryLogin(params: Lightsail.Types.CreateContainerServiceRegistryLoginRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateContainerServiceRegistryLoginResult) => void): Request<Lightsail.Types.CreateContainerServiceRegistryLoginResult, AWSError>;
  /**
   * Creates a temporary set of log in credentials that you can use to log in to the Docker process on your local machine. After you're logged in, you can use the native Docker commands to push your local container images to the container image registry of your Amazon Lightsail account so that you can use them with your Lightsail container service. The log in credentials expire 12 hours after they are created, at which point you will need to create a new set of log in credentials.  You can only push container images to the container service registry of your Lightsail account. You cannot pull container images or perform any other container image management actions on the container service registry.  After you push your container images to the container image registry of your Lightsail account, use the RegisterContainerImage action to register the pushed images to a specific Lightsail container service.  This action is not required if you install and use the Lightsail Control (lightsailctl) plugin to push container images to your Lightsail container service. For more information, see Pushing and managing container images on your Amazon Lightsail container services in the Amazon Lightsail Developer Guide. 
   */
  createContainerServiceRegistryLogin(callback?: (err: AWSError, data: Lightsail.Types.CreateContainerServiceRegistryLoginResult) => void): Request<Lightsail.Types.CreateContainerServiceRegistryLoginResult, AWSError>;
  /**
   * Creates a block storage disk that can be attached to an Amazon Lightsail instance in the same Availability Zone (e.g., us-east-2a). The create disk operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createDisk(params: Lightsail.Types.CreateDiskRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateDiskResult) => void): Request<Lightsail.Types.CreateDiskResult, AWSError>;
  /**
   * Creates a block storage disk that can be attached to an Amazon Lightsail instance in the same Availability Zone (e.g., us-east-2a). The create disk operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createDisk(callback?: (err: AWSError, data: Lightsail.Types.CreateDiskResult) => void): Request<Lightsail.Types.CreateDiskResult, AWSError>;
  /**
   * Creates a block storage disk from a manual or automatic snapshot of a disk. The resulting disk can be attached to an Amazon Lightsail instance in the same Availability Zone (e.g., us-east-2a). The create disk from snapshot operation supports tag-based access control via request tags and resource tags applied to the resource identified by disk snapshot name. For more information, see the Amazon Lightsail Developer Guide.
   */
  createDiskFromSnapshot(params: Lightsail.Types.CreateDiskFromSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateDiskFromSnapshotResult) => void): Request<Lightsail.Types.CreateDiskFromSnapshotResult, AWSError>;
  /**
   * Creates a block storage disk from a manual or automatic snapshot of a disk. The resulting disk can be attached to an Amazon Lightsail instance in the same Availability Zone (e.g., us-east-2a). The create disk from snapshot operation supports tag-based access control via request tags and resource tags applied to the resource identified by disk snapshot name. For more information, see the Amazon Lightsail Developer Guide.
   */
  createDiskFromSnapshot(callback?: (err: AWSError, data: Lightsail.Types.CreateDiskFromSnapshotResult) => void): Request<Lightsail.Types.CreateDiskFromSnapshotResult, AWSError>;
  /**
   * Creates a snapshot of a block storage disk. You can use snapshots for backups, to make copies of disks, and to save data before shutting down a Lightsail instance. You can take a snapshot of an attached disk that is in use; however, snapshots only capture data that has been written to your disk at the time the snapshot command is issued. This may exclude any data that has been cached by any applications or the operating system. If you can pause any file systems on the disk long enough to take a snapshot, your snapshot should be complete. Nevertheless, if you cannot pause all file writes to the disk, you should unmount the disk from within the Lightsail instance, issue the create disk snapshot command, and then remount the disk to ensure a consistent and complete snapshot. You may remount and use your disk while the snapshot status is pending. You can also use this operation to create a snapshot of an instance's system volume. You might want to do this, for example, to recover data from the system volume of a botched instance or to create a backup of the system volume like you would for a block storage disk. To create a snapshot of a system volume, just define the instance name parameter when issuing the snapshot command, and a snapshot of the defined instance's system volume will be created. After the snapshot is available, you can create a block storage disk from the snapshot and attach it to a running instance to access the data on the disk. The create disk snapshot operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createDiskSnapshot(params: Lightsail.Types.CreateDiskSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateDiskSnapshotResult) => void): Request<Lightsail.Types.CreateDiskSnapshotResult, AWSError>;
  /**
   * Creates a snapshot of a block storage disk. You can use snapshots for backups, to make copies of disks, and to save data before shutting down a Lightsail instance. You can take a snapshot of an attached disk that is in use; however, snapshots only capture data that has been written to your disk at the time the snapshot command is issued. This may exclude any data that has been cached by any applications or the operating system. If you can pause any file systems on the disk long enough to take a snapshot, your snapshot should be complete. Nevertheless, if you cannot pause all file writes to the disk, you should unmount the disk from within the Lightsail instance, issue the create disk snapshot command, and then remount the disk to ensure a consistent and complete snapshot. You may remount and use your disk while the snapshot status is pending. You can also use this operation to create a snapshot of an instance's system volume. You might want to do this, for example, to recover data from the system volume of a botched instance or to create a backup of the system volume like you would for a block storage disk. To create a snapshot of a system volume, just define the instance name parameter when issuing the snapshot command, and a snapshot of the defined instance's system volume will be created. After the snapshot is available, you can create a block storage disk from the snapshot and attach it to a running instance to access the data on the disk. The create disk snapshot operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createDiskSnapshot(callback?: (err: AWSError, data: Lightsail.Types.CreateDiskSnapshotResult) => void): Request<Lightsail.Types.CreateDiskSnapshotResult, AWSError>;
  /**
   * Creates an Amazon Lightsail content delivery network (CDN) distribution. A distribution is a globally distributed network of caching servers that improve the performance of your website or web application hosted on a Lightsail instance. For more information, see Content delivery networks in Amazon Lightsail.
   */
  createDistribution(params: Lightsail.Types.CreateDistributionRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateDistributionResult) => void): Request<Lightsail.Types.CreateDistributionResult, AWSError>;
  /**
   * Creates an Amazon Lightsail content delivery network (CDN) distribution. A distribution is a globally distributed network of caching servers that improve the performance of your website or web application hosted on a Lightsail instance. For more information, see Content delivery networks in Amazon Lightsail.
   */
  createDistribution(callback?: (err: AWSError, data: Lightsail.Types.CreateDistributionResult) => void): Request<Lightsail.Types.CreateDistributionResult, AWSError>;
  /**
   * Creates a domain resource for the specified domain (e.g., example.com). The create domain operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createDomain(params: Lightsail.Types.CreateDomainRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateDomainResult) => void): Request<Lightsail.Types.CreateDomainResult, AWSError>;
  /**
   * Creates a domain resource for the specified domain (e.g., example.com). The create domain operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createDomain(callback?: (err: AWSError, data: Lightsail.Types.CreateDomainResult) => void): Request<Lightsail.Types.CreateDomainResult, AWSError>;
  /**
   * Creates one of the following domain name system (DNS) records in a domain DNS zone: Address (A), canonical name (CNAME), mail exchanger (MX), name server (NS), start of authority (SOA), service locator (SRV), or text (TXT). The create domain entry operation supports tag-based access control via resource tags applied to the resource identified by domain name. For more information, see the Amazon Lightsail Developer Guide.
   */
  createDomainEntry(params: Lightsail.Types.CreateDomainEntryRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateDomainEntryResult) => void): Request<Lightsail.Types.CreateDomainEntryResult, AWSError>;
  /**
   * Creates one of the following domain name system (DNS) records in a domain DNS zone: Address (A), canonical name (CNAME), mail exchanger (MX), name server (NS), start of authority (SOA), service locator (SRV), or text (TXT). The create domain entry operation supports tag-based access control via resource tags applied to the resource identified by domain name. For more information, see the Amazon Lightsail Developer Guide.
   */
  createDomainEntry(callback?: (err: AWSError, data: Lightsail.Types.CreateDomainEntryResult) => void): Request<Lightsail.Types.CreateDomainEntryResult, AWSError>;
  /**
   * Creates a snapshot of a specific virtual private server, or instance. You can use a snapshot to create a new instance that is based on that snapshot. The create instance snapshot operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createInstanceSnapshot(params: Lightsail.Types.CreateInstanceSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateInstanceSnapshotResult) => void): Request<Lightsail.Types.CreateInstanceSnapshotResult, AWSError>;
  /**
   * Creates a snapshot of a specific virtual private server, or instance. You can use a snapshot to create a new instance that is based on that snapshot. The create instance snapshot operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createInstanceSnapshot(callback?: (err: AWSError, data: Lightsail.Types.CreateInstanceSnapshotResult) => void): Request<Lightsail.Types.CreateInstanceSnapshotResult, AWSError>;
  /**
   * Creates one or more Amazon Lightsail instances. The create instances operation supports tag-based access control via request tags. For more information, see the Lightsail Developer Guide.
   */
  createInstances(params: Lightsail.Types.CreateInstancesRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateInstancesResult) => void): Request<Lightsail.Types.CreateInstancesResult, AWSError>;
  /**
   * Creates one or more Amazon Lightsail instances. The create instances operation supports tag-based access control via request tags. For more information, see the Lightsail Developer Guide.
   */
  createInstances(callback?: (err: AWSError, data: Lightsail.Types.CreateInstancesResult) => void): Request<Lightsail.Types.CreateInstancesResult, AWSError>;
  /**
   * Creates one or more new instances from a manual or automatic snapshot of an instance. The create instances from snapshot operation supports tag-based access control via request tags and resource tags applied to the resource identified by instance snapshot name. For more information, see the Amazon Lightsail Developer Guide.
   */
  createInstancesFromSnapshot(params: Lightsail.Types.CreateInstancesFromSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateInstancesFromSnapshotResult) => void): Request<Lightsail.Types.CreateInstancesFromSnapshotResult, AWSError>;
  /**
   * Creates one or more new instances from a manual or automatic snapshot of an instance. The create instances from snapshot operation supports tag-based access control via request tags and resource tags applied to the resource identified by instance snapshot name. For more information, see the Amazon Lightsail Developer Guide.
   */
  createInstancesFromSnapshot(callback?: (err: AWSError, data: Lightsail.Types.CreateInstancesFromSnapshotResult) => void): Request<Lightsail.Types.CreateInstancesFromSnapshotResult, AWSError>;
  /**
   * Creates an SSH key pair. The create key pair operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createKeyPair(params: Lightsail.Types.CreateKeyPairRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateKeyPairResult) => void): Request<Lightsail.Types.CreateKeyPairResult, AWSError>;
  /**
   * Creates an SSH key pair. The create key pair operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createKeyPair(callback?: (err: AWSError, data: Lightsail.Types.CreateKeyPairResult) => void): Request<Lightsail.Types.CreateKeyPairResult, AWSError>;
  /**
   * Creates a Lightsail load balancer. To learn more about deciding whether to load balance your application, see Configure your Lightsail instances for load balancing. You can create up to 5 load balancers per AWS Region in your account. When you create a load balancer, you can specify a unique name and port settings. To change additional load balancer settings, use the UpdateLoadBalancerAttribute operation. The create load balancer operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createLoadBalancer(params: Lightsail.Types.CreateLoadBalancerRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateLoadBalancerResult) => void): Request<Lightsail.Types.CreateLoadBalancerResult, AWSError>;
  /**
   * Creates a Lightsail load balancer. To learn more about deciding whether to load balance your application, see Configure your Lightsail instances for load balancing. You can create up to 5 load balancers per AWS Region in your account. When you create a load balancer, you can specify a unique name and port settings. To change additional load balancer settings, use the UpdateLoadBalancerAttribute operation. The create load balancer operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createLoadBalancer(callback?: (err: AWSError, data: Lightsail.Types.CreateLoadBalancerResult) => void): Request<Lightsail.Types.CreateLoadBalancerResult, AWSError>;
  /**
   * Creates an SSL/TLS certificate for an Amazon Lightsail load balancer. TLS is just an updated, more secure version of Secure Socket Layer (SSL). The CreateLoadBalancerTlsCertificate operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  createLoadBalancerTlsCertificate(params: Lightsail.Types.CreateLoadBalancerTlsCertificateRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateLoadBalancerTlsCertificateResult) => void): Request<Lightsail.Types.CreateLoadBalancerTlsCertificateResult, AWSError>;
  /**
   * Creates an SSL/TLS certificate for an Amazon Lightsail load balancer. TLS is just an updated, more secure version of Secure Socket Layer (SSL). The CreateLoadBalancerTlsCertificate operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  createLoadBalancerTlsCertificate(callback?: (err: AWSError, data: Lightsail.Types.CreateLoadBalancerTlsCertificateResult) => void): Request<Lightsail.Types.CreateLoadBalancerTlsCertificateResult, AWSError>;
  /**
   * Creates a new database in Amazon Lightsail. The create relational database operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createRelationalDatabase(params: Lightsail.Types.CreateRelationalDatabaseRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateRelationalDatabaseResult) => void): Request<Lightsail.Types.CreateRelationalDatabaseResult, AWSError>;
  /**
   * Creates a new database in Amazon Lightsail. The create relational database operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createRelationalDatabase(callback?: (err: AWSError, data: Lightsail.Types.CreateRelationalDatabaseResult) => void): Request<Lightsail.Types.CreateRelationalDatabaseResult, AWSError>;
  /**
   * Creates a new database from an existing database snapshot in Amazon Lightsail. You can create a new database from a snapshot in if something goes wrong with your original database, or to change it to a different plan, such as a high availability or standard plan. The create relational database from snapshot operation supports tag-based access control via request tags and resource tags applied to the resource identified by relationalDatabaseSnapshotName. For more information, see the Amazon Lightsail Developer Guide.
   */
  createRelationalDatabaseFromSnapshot(params: Lightsail.Types.CreateRelationalDatabaseFromSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateRelationalDatabaseFromSnapshotResult) => void): Request<Lightsail.Types.CreateRelationalDatabaseFromSnapshotResult, AWSError>;
  /**
   * Creates a new database from an existing database snapshot in Amazon Lightsail. You can create a new database from a snapshot in if something goes wrong with your original database, or to change it to a different plan, such as a high availability or standard plan. The create relational database from snapshot operation supports tag-based access control via request tags and resource tags applied to the resource identified by relationalDatabaseSnapshotName. For more information, see the Amazon Lightsail Developer Guide.
   */
  createRelationalDatabaseFromSnapshot(callback?: (err: AWSError, data: Lightsail.Types.CreateRelationalDatabaseFromSnapshotResult) => void): Request<Lightsail.Types.CreateRelationalDatabaseFromSnapshotResult, AWSError>;
  /**
   * Creates a snapshot of your database in Amazon Lightsail. You can use snapshots for backups, to make copies of a database, and to save data before deleting a database. The create relational database snapshot operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createRelationalDatabaseSnapshot(params: Lightsail.Types.CreateRelationalDatabaseSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.CreateRelationalDatabaseSnapshotResult) => void): Request<Lightsail.Types.CreateRelationalDatabaseSnapshotResult, AWSError>;
  /**
   * Creates a snapshot of your database in Amazon Lightsail. You can use snapshots for backups, to make copies of a database, and to save data before deleting a database. The create relational database snapshot operation supports tag-based access control via request tags. For more information, see the Amazon Lightsail Developer Guide.
   */
  createRelationalDatabaseSnapshot(callback?: (err: AWSError, data: Lightsail.Types.CreateRelationalDatabaseSnapshotResult) => void): Request<Lightsail.Types.CreateRelationalDatabaseSnapshotResult, AWSError>;
  /**
   * Deletes an alarm. An alarm is used to monitor a single metric for one of your resources. When a metric condition is met, the alarm can notify you by email, SMS text message, and a banner displayed on the Amazon Lightsail console. For more information, see Alarms in Amazon Lightsail.
   */
  deleteAlarm(params: Lightsail.Types.DeleteAlarmRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteAlarmResult) => void): Request<Lightsail.Types.DeleteAlarmResult, AWSError>;
  /**
   * Deletes an alarm. An alarm is used to monitor a single metric for one of your resources. When a metric condition is met, the alarm can notify you by email, SMS text message, and a banner displayed on the Amazon Lightsail console. For more information, see Alarms in Amazon Lightsail.
   */
  deleteAlarm(callback?: (err: AWSError, data: Lightsail.Types.DeleteAlarmResult) => void): Request<Lightsail.Types.DeleteAlarmResult, AWSError>;
  /**
   * Deletes an automatic snapshot of an instance or disk. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteAutoSnapshot(params: Lightsail.Types.DeleteAutoSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteAutoSnapshotResult) => void): Request<Lightsail.Types.DeleteAutoSnapshotResult, AWSError>;
  /**
   * Deletes an automatic snapshot of an instance or disk. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteAutoSnapshot(callback?: (err: AWSError, data: Lightsail.Types.DeleteAutoSnapshotResult) => void): Request<Lightsail.Types.DeleteAutoSnapshotResult, AWSError>;
  /**
   * Deletes a Amazon Lightsail bucket.  When you delete your bucket, the bucket name is released and can be reused for a new bucket in your account or another AWS account. 
   */
  deleteBucket(params: Lightsail.Types.DeleteBucketRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteBucketResult) => void): Request<Lightsail.Types.DeleteBucketResult, AWSError>;
  /**
   * Deletes a Amazon Lightsail bucket.  When you delete your bucket, the bucket name is released and can be reused for a new bucket in your account or another AWS account. 
   */
  deleteBucket(callback?: (err: AWSError, data: Lightsail.Types.DeleteBucketResult) => void): Request<Lightsail.Types.DeleteBucketResult, AWSError>;
  /**
   * Deletes an access key for the specified Amazon Lightsail bucket. We recommend that you delete an access key if the secret access key is compromised. For more information about access keys, see Creating access keys for a bucket in Amazon Lightsail in the Amazon Lightsail Developer Guide.
   */
  deleteBucketAccessKey(params: Lightsail.Types.DeleteBucketAccessKeyRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteBucketAccessKeyResult) => void): Request<Lightsail.Types.DeleteBucketAccessKeyResult, AWSError>;
  /**
   * Deletes an access key for the specified Amazon Lightsail bucket. We recommend that you delete an access key if the secret access key is compromised. For more information about access keys, see Creating access keys for a bucket in Amazon Lightsail in the Amazon Lightsail Developer Guide.
   */
  deleteBucketAccessKey(callback?: (err: AWSError, data: Lightsail.Types.DeleteBucketAccessKeyResult) => void): Request<Lightsail.Types.DeleteBucketAccessKeyResult, AWSError>;
  /**
   * Deletes an SSL/TLS certificate for your Amazon Lightsail content delivery network (CDN) distribution. Certificates that are currently attached to a distribution cannot be deleted. Use the DetachCertificateFromDistribution action to detach a certificate from a distribution.
   */
  deleteCertificate(params: Lightsail.Types.DeleteCertificateRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteCertificateResult) => void): Request<Lightsail.Types.DeleteCertificateResult, AWSError>;
  /**
   * Deletes an SSL/TLS certificate for your Amazon Lightsail content delivery network (CDN) distribution. Certificates that are currently attached to a distribution cannot be deleted. Use the DetachCertificateFromDistribution action to detach a certificate from a distribution.
   */
  deleteCertificate(callback?: (err: AWSError, data: Lightsail.Types.DeleteCertificateResult) => void): Request<Lightsail.Types.DeleteCertificateResult, AWSError>;
  /**
   * Deletes a contact method. A contact method is used to send you notifications about your Amazon Lightsail resources. You can add one email address and one mobile phone number contact method in each AWS Region. However, SMS text messaging is not supported in some AWS Regions, and SMS text messages cannot be sent to some countries/regions. For more information, see Notifications in Amazon Lightsail.
   */
  deleteContactMethod(params: Lightsail.Types.DeleteContactMethodRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteContactMethodResult) => void): Request<Lightsail.Types.DeleteContactMethodResult, AWSError>;
  /**
   * Deletes a contact method. A contact method is used to send you notifications about your Amazon Lightsail resources. You can add one email address and one mobile phone number contact method in each AWS Region. However, SMS text messaging is not supported in some AWS Regions, and SMS text messages cannot be sent to some countries/regions. For more information, see Notifications in Amazon Lightsail.
   */
  deleteContactMethod(callback?: (err: AWSError, data: Lightsail.Types.DeleteContactMethodResult) => void): Request<Lightsail.Types.DeleteContactMethodResult, AWSError>;
  /**
   * Deletes a container image that is registered to your Amazon Lightsail container service.
   */
  deleteContainerImage(params: Lightsail.Types.DeleteContainerImageRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteContainerImageResult) => void): Request<Lightsail.Types.DeleteContainerImageResult, AWSError>;
  /**
   * Deletes a container image that is registered to your Amazon Lightsail container service.
   */
  deleteContainerImage(callback?: (err: AWSError, data: Lightsail.Types.DeleteContainerImageResult) => void): Request<Lightsail.Types.DeleteContainerImageResult, AWSError>;
  /**
   * Deletes your Amazon Lightsail container service.
   */
  deleteContainerService(params: Lightsail.Types.DeleteContainerServiceRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteContainerServiceResult) => void): Request<Lightsail.Types.DeleteContainerServiceResult, AWSError>;
  /**
   * Deletes your Amazon Lightsail container service.
   */
  deleteContainerService(callback?: (err: AWSError, data: Lightsail.Types.DeleteContainerServiceResult) => void): Request<Lightsail.Types.DeleteContainerServiceResult, AWSError>;
  /**
   * Deletes the specified block storage disk. The disk must be in the available state (not attached to a Lightsail instance).  The disk may remain in the deleting state for several minutes.  The delete disk operation supports tag-based access control via resource tags applied to the resource identified by disk name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteDisk(params: Lightsail.Types.DeleteDiskRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteDiskResult) => void): Request<Lightsail.Types.DeleteDiskResult, AWSError>;
  /**
   * Deletes the specified block storage disk. The disk must be in the available state (not attached to a Lightsail instance).  The disk may remain in the deleting state for several minutes.  The delete disk operation supports tag-based access control via resource tags applied to the resource identified by disk name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteDisk(callback?: (err: AWSError, data: Lightsail.Types.DeleteDiskResult) => void): Request<Lightsail.Types.DeleteDiskResult, AWSError>;
  /**
   * Deletes the specified disk snapshot. When you make periodic snapshots of a disk, the snapshots are incremental, and only the blocks on the device that have changed since your last snapshot are saved in the new snapshot. When you delete a snapshot, only the data not needed for any other snapshot is removed. So regardless of which prior snapshots have been deleted, all active snapshots will have access to all the information needed to restore the disk. The delete disk snapshot operation supports tag-based access control via resource tags applied to the resource identified by disk snapshot name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteDiskSnapshot(params: Lightsail.Types.DeleteDiskSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteDiskSnapshotResult) => void): Request<Lightsail.Types.DeleteDiskSnapshotResult, AWSError>;
  /**
   * Deletes the specified disk snapshot. When you make periodic snapshots of a disk, the snapshots are incremental, and only the blocks on the device that have changed since your last snapshot are saved in the new snapshot. When you delete a snapshot, only the data not needed for any other snapshot is removed. So regardless of which prior snapshots have been deleted, all active snapshots will have access to all the information needed to restore the disk. The delete disk snapshot operation supports tag-based access control via resource tags applied to the resource identified by disk snapshot name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteDiskSnapshot(callback?: (err: AWSError, data: Lightsail.Types.DeleteDiskSnapshotResult) => void): Request<Lightsail.Types.DeleteDiskSnapshotResult, AWSError>;
  /**
   * Deletes your Amazon Lightsail content delivery network (CDN) distribution.
   */
  deleteDistribution(params: Lightsail.Types.DeleteDistributionRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteDistributionResult) => void): Request<Lightsail.Types.DeleteDistributionResult, AWSError>;
  /**
   * Deletes your Amazon Lightsail content delivery network (CDN) distribution.
   */
  deleteDistribution(callback?: (err: AWSError, data: Lightsail.Types.DeleteDistributionResult) => void): Request<Lightsail.Types.DeleteDistributionResult, AWSError>;
  /**
   * Deletes the specified domain recordset and all of its domain records. The delete domain operation supports tag-based access control via resource tags applied to the resource identified by domain name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteDomain(params: Lightsail.Types.DeleteDomainRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteDomainResult) => void): Request<Lightsail.Types.DeleteDomainResult, AWSError>;
  /**
   * Deletes the specified domain recordset and all of its domain records. The delete domain operation supports tag-based access control via resource tags applied to the resource identified by domain name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteDomain(callback?: (err: AWSError, data: Lightsail.Types.DeleteDomainResult) => void): Request<Lightsail.Types.DeleteDomainResult, AWSError>;
  /**
   * Deletes a specific domain entry. The delete domain entry operation supports tag-based access control via resource tags applied to the resource identified by domain name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteDomainEntry(params: Lightsail.Types.DeleteDomainEntryRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteDomainEntryResult) => void): Request<Lightsail.Types.DeleteDomainEntryResult, AWSError>;
  /**
   * Deletes a specific domain entry. The delete domain entry operation supports tag-based access control via resource tags applied to the resource identified by domain name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteDomainEntry(callback?: (err: AWSError, data: Lightsail.Types.DeleteDomainEntryResult) => void): Request<Lightsail.Types.DeleteDomainEntryResult, AWSError>;
  /**
   * Deletes an Amazon Lightsail instance. The delete instance operation supports tag-based access control via resource tags applied to the resource identified by instance name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteInstance(params: Lightsail.Types.DeleteInstanceRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteInstanceResult) => void): Request<Lightsail.Types.DeleteInstanceResult, AWSError>;
  /**
   * Deletes an Amazon Lightsail instance. The delete instance operation supports tag-based access control via resource tags applied to the resource identified by instance name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteInstance(callback?: (err: AWSError, data: Lightsail.Types.DeleteInstanceResult) => void): Request<Lightsail.Types.DeleteInstanceResult, AWSError>;
  /**
   * Deletes a specific snapshot of a virtual private server (or instance). The delete instance snapshot operation supports tag-based access control via resource tags applied to the resource identified by instance snapshot name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteInstanceSnapshot(params: Lightsail.Types.DeleteInstanceSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteInstanceSnapshotResult) => void): Request<Lightsail.Types.DeleteInstanceSnapshotResult, AWSError>;
  /**
   * Deletes a specific snapshot of a virtual private server (or instance). The delete instance snapshot operation supports tag-based access control via resource tags applied to the resource identified by instance snapshot name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteInstanceSnapshot(callback?: (err: AWSError, data: Lightsail.Types.DeleteInstanceSnapshotResult) => void): Request<Lightsail.Types.DeleteInstanceSnapshotResult, AWSError>;
  /**
   * Deletes a specific SSH key pair. The delete key pair operation supports tag-based access control via resource tags applied to the resource identified by key pair name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteKeyPair(params: Lightsail.Types.DeleteKeyPairRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteKeyPairResult) => void): Request<Lightsail.Types.DeleteKeyPairResult, AWSError>;
  /**
   * Deletes a specific SSH key pair. The delete key pair operation supports tag-based access control via resource tags applied to the resource identified by key pair name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteKeyPair(callback?: (err: AWSError, data: Lightsail.Types.DeleteKeyPairResult) => void): Request<Lightsail.Types.DeleteKeyPairResult, AWSError>;
  /**
   * Deletes the known host key or certificate used by the Amazon Lightsail browser-based SSH or RDP clients to authenticate an instance. This operation enables the Lightsail browser-based SSH or RDP clients to connect to the instance after a host key mismatch.  Perform this operation only if you were expecting the host key or certificate mismatch or if you are familiar with the new host key or certificate on the instance. For more information, see Troubleshooting connection issues when using the Amazon Lightsail browser-based SSH or RDP client. 
   */
  deleteKnownHostKeys(params: Lightsail.Types.DeleteKnownHostKeysRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteKnownHostKeysResult) => void): Request<Lightsail.Types.DeleteKnownHostKeysResult, AWSError>;
  /**
   * Deletes the known host key or certificate used by the Amazon Lightsail browser-based SSH or RDP clients to authenticate an instance. This operation enables the Lightsail browser-based SSH or RDP clients to connect to the instance after a host key mismatch.  Perform this operation only if you were expecting the host key or certificate mismatch or if you are familiar with the new host key or certificate on the instance. For more information, see Troubleshooting connection issues when using the Amazon Lightsail browser-based SSH or RDP client. 
   */
  deleteKnownHostKeys(callback?: (err: AWSError, data: Lightsail.Types.DeleteKnownHostKeysResult) => void): Request<Lightsail.Types.DeleteKnownHostKeysResult, AWSError>;
  /**
   * Deletes a Lightsail load balancer and all its associated SSL/TLS certificates. Once the load balancer is deleted, you will need to create a new load balancer, create a new certificate, and verify domain ownership again. The delete load balancer operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteLoadBalancer(params: Lightsail.Types.DeleteLoadBalancerRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteLoadBalancerResult) => void): Request<Lightsail.Types.DeleteLoadBalancerResult, AWSError>;
  /**
   * Deletes a Lightsail load balancer and all its associated SSL/TLS certificates. Once the load balancer is deleted, you will need to create a new load balancer, create a new certificate, and verify domain ownership again. The delete load balancer operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteLoadBalancer(callback?: (err: AWSError, data: Lightsail.Types.DeleteLoadBalancerResult) => void): Request<Lightsail.Types.DeleteLoadBalancerResult, AWSError>;
  /**
   * Deletes an SSL/TLS certificate associated with a Lightsail load balancer. The DeleteLoadBalancerTlsCertificate operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteLoadBalancerTlsCertificate(params: Lightsail.Types.DeleteLoadBalancerTlsCertificateRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteLoadBalancerTlsCertificateResult) => void): Request<Lightsail.Types.DeleteLoadBalancerTlsCertificateResult, AWSError>;
  /**
   * Deletes an SSL/TLS certificate associated with a Lightsail load balancer. The DeleteLoadBalancerTlsCertificate operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteLoadBalancerTlsCertificate(callback?: (err: AWSError, data: Lightsail.Types.DeleteLoadBalancerTlsCertificateResult) => void): Request<Lightsail.Types.DeleteLoadBalancerTlsCertificateResult, AWSError>;
  /**
   * Deletes a database in Amazon Lightsail. The delete relational database operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteRelationalDatabase(params: Lightsail.Types.DeleteRelationalDatabaseRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteRelationalDatabaseResult) => void): Request<Lightsail.Types.DeleteRelationalDatabaseResult, AWSError>;
  /**
   * Deletes a database in Amazon Lightsail. The delete relational database operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteRelationalDatabase(callback?: (err: AWSError, data: Lightsail.Types.DeleteRelationalDatabaseResult) => void): Request<Lightsail.Types.DeleteRelationalDatabaseResult, AWSError>;
  /**
   * Deletes a database snapshot in Amazon Lightsail. The delete relational database snapshot operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteRelationalDatabaseSnapshot(params: Lightsail.Types.DeleteRelationalDatabaseSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.DeleteRelationalDatabaseSnapshotResult) => void): Request<Lightsail.Types.DeleteRelationalDatabaseSnapshotResult, AWSError>;
  /**
   * Deletes a database snapshot in Amazon Lightsail. The delete relational database snapshot operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  deleteRelationalDatabaseSnapshot(callback?: (err: AWSError, data: Lightsail.Types.DeleteRelationalDatabaseSnapshotResult) => void): Request<Lightsail.Types.DeleteRelationalDatabaseSnapshotResult, AWSError>;
  /**
   * Detaches an SSL/TLS certificate from your Amazon Lightsail content delivery network (CDN) distribution. After the certificate is detached, your distribution stops accepting traffic for all of the domains that are associated with the certificate.
   */
  detachCertificateFromDistribution(params: Lightsail.Types.DetachCertificateFromDistributionRequest, callback?: (err: AWSError, data: Lightsail.Types.DetachCertificateFromDistributionResult) => void): Request<Lightsail.Types.DetachCertificateFromDistributionResult, AWSError>;
  /**
   * Detaches an SSL/TLS certificate from your Amazon Lightsail content delivery network (CDN) distribution. After the certificate is detached, your distribution stops accepting traffic for all of the domains that are associated with the certificate.
   */
  detachCertificateFromDistribution(callback?: (err: AWSError, data: Lightsail.Types.DetachCertificateFromDistributionResult) => void): Request<Lightsail.Types.DetachCertificateFromDistributionResult, AWSError>;
  /**
   * Detaches a stopped block storage disk from a Lightsail instance. Make sure to unmount any file systems on the device within your operating system before stopping the instance and detaching the disk. The detach disk operation supports tag-based access control via resource tags applied to the resource identified by disk name. For more information, see the Amazon Lightsail Developer Guide.
   */
  detachDisk(params: Lightsail.Types.DetachDiskRequest, callback?: (err: AWSError, data: Lightsail.Types.DetachDiskResult) => void): Request<Lightsail.Types.DetachDiskResult, AWSError>;
  /**
   * Detaches a stopped block storage disk from a Lightsail instance. Make sure to unmount any file systems on the device within your operating system before stopping the instance and detaching the disk. The detach disk operation supports tag-based access control via resource tags applied to the resource identified by disk name. For more information, see the Amazon Lightsail Developer Guide.
   */
  detachDisk(callback?: (err: AWSError, data: Lightsail.Types.DetachDiskResult) => void): Request<Lightsail.Types.DetachDiskResult, AWSError>;
  /**
   * Detaches the specified instances from a Lightsail load balancer. This operation waits until the instances are no longer needed before they are detached from the load balancer. The detach instances from load balancer operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  detachInstancesFromLoadBalancer(params: Lightsail.Types.DetachInstancesFromLoadBalancerRequest, callback?: (err: AWSError, data: Lightsail.Types.DetachInstancesFromLoadBalancerResult) => void): Request<Lightsail.Types.DetachInstancesFromLoadBalancerResult, AWSError>;
  /**
   * Detaches the specified instances from a Lightsail load balancer. This operation waits until the instances are no longer needed before they are detached from the load balancer. The detach instances from load balancer operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  detachInstancesFromLoadBalancer(callback?: (err: AWSError, data: Lightsail.Types.DetachInstancesFromLoadBalancerResult) => void): Request<Lightsail.Types.DetachInstancesFromLoadBalancerResult, AWSError>;
  /**
   * Detaches a static IP from the Amazon Lightsail instance to which it is attached.
   */
  detachStaticIp(params: Lightsail.Types.DetachStaticIpRequest, callback?: (err: AWSError, data: Lightsail.Types.DetachStaticIpResult) => void): Request<Lightsail.Types.DetachStaticIpResult, AWSError>;
  /**
   * Detaches a static IP from the Amazon Lightsail instance to which it is attached.
   */
  detachStaticIp(callback?: (err: AWSError, data: Lightsail.Types.DetachStaticIpResult) => void): Request<Lightsail.Types.DetachStaticIpResult, AWSError>;
  /**
   * Disables an add-on for an Amazon Lightsail resource. For more information, see the Amazon Lightsail Developer Guide.
   */
  disableAddOn(params: Lightsail.Types.DisableAddOnRequest, callback?: (err: AWSError, data: Lightsail.Types.DisableAddOnResult) => void): Request<Lightsail.Types.DisableAddOnResult, AWSError>;
  /**
   * Disables an add-on for an Amazon Lightsail resource. For more information, see the Amazon Lightsail Developer Guide.
   */
  disableAddOn(callback?: (err: AWSError, data: Lightsail.Types.DisableAddOnResult) => void): Request<Lightsail.Types.DisableAddOnResult, AWSError>;
  /**
   * Downloads the default SSH key pair from the user's account.
   */
  downloadDefaultKeyPair(params: Lightsail.Types.DownloadDefaultKeyPairRequest, callback?: (err: AWSError, data: Lightsail.Types.DownloadDefaultKeyPairResult) => void): Request<Lightsail.Types.DownloadDefaultKeyPairResult, AWSError>;
  /**
   * Downloads the default SSH key pair from the user's account.
   */
  downloadDefaultKeyPair(callback?: (err: AWSError, data: Lightsail.Types.DownloadDefaultKeyPairResult) => void): Request<Lightsail.Types.DownloadDefaultKeyPairResult, AWSError>;
  /**
   * Enables or modifies an add-on for an Amazon Lightsail resource. For more information, see the Amazon Lightsail Developer Guide.
   */
  enableAddOn(params: Lightsail.Types.EnableAddOnRequest, callback?: (err: AWSError, data: Lightsail.Types.EnableAddOnResult) => void): Request<Lightsail.Types.EnableAddOnResult, AWSError>;
  /**
   * Enables or modifies an add-on for an Amazon Lightsail resource. For more information, see the Amazon Lightsail Developer Guide.
   */
  enableAddOn(callback?: (err: AWSError, data: Lightsail.Types.EnableAddOnResult) => void): Request<Lightsail.Types.EnableAddOnResult, AWSError>;
  /**
   * Exports an Amazon Lightsail instance or block storage disk snapshot to Amazon Elastic Compute Cloud (Amazon EC2). This operation results in an export snapshot record that can be used with the create cloud formation stack operation to create new Amazon EC2 instances. Exported instance snapshots appear in Amazon EC2 as Amazon Machine Images (AMIs), and the instance system disk appears as an Amazon Elastic Block Store (Amazon EBS) volume. Exported disk snapshots appear in Amazon EC2 as Amazon EBS volumes. Snapshots are exported to the same Amazon Web Services Region in Amazon EC2 as the source Lightsail snapshot.  The export snapshot operation supports tag-based access control via resource tags applied to the resource identified by source snapshot name. For more information, see the Amazon Lightsail Developer Guide.  Use the get instance snapshots or get disk snapshots operations to get a list of snapshots that you can export to Amazon EC2. 
   */
  exportSnapshot(params: Lightsail.Types.ExportSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.ExportSnapshotResult) => void): Request<Lightsail.Types.ExportSnapshotResult, AWSError>;
  /**
   * Exports an Amazon Lightsail instance or block storage disk snapshot to Amazon Elastic Compute Cloud (Amazon EC2). This operation results in an export snapshot record that can be used with the create cloud formation stack operation to create new Amazon EC2 instances. Exported instance snapshots appear in Amazon EC2 as Amazon Machine Images (AMIs), and the instance system disk appears as an Amazon Elastic Block Store (Amazon EBS) volume. Exported disk snapshots appear in Amazon EC2 as Amazon EBS volumes. Snapshots are exported to the same Amazon Web Services Region in Amazon EC2 as the source Lightsail snapshot.  The export snapshot operation supports tag-based access control via resource tags applied to the resource identified by source snapshot name. For more information, see the Amazon Lightsail Developer Guide.  Use the get instance snapshots or get disk snapshots operations to get a list of snapshots that you can export to Amazon EC2. 
   */
  exportSnapshot(callback?: (err: AWSError, data: Lightsail.Types.ExportSnapshotResult) => void): Request<Lightsail.Types.ExportSnapshotResult, AWSError>;
  /**
   * Returns the names of all active (not deleted) resources.
   */
  getActiveNames(params: Lightsail.Types.GetActiveNamesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetActiveNamesResult) => void): Request<Lightsail.Types.GetActiveNamesResult, AWSError>;
  /**
   * Returns the names of all active (not deleted) resources.
   */
  getActiveNames(callback?: (err: AWSError, data: Lightsail.Types.GetActiveNamesResult) => void): Request<Lightsail.Types.GetActiveNamesResult, AWSError>;
  /**
   * Returns information about the configured alarms. Specify an alarm name in your request to return information about a specific alarm, or specify a monitored resource name to return information about all alarms for a specific resource. An alarm is used to monitor a single metric for one of your resources. When a metric condition is met, the alarm can notify you by email, SMS text message, and a banner displayed on the Amazon Lightsail console. For more information, see Alarms in Amazon Lightsail.
   */
  getAlarms(params: Lightsail.Types.GetAlarmsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetAlarmsResult) => void): Request<Lightsail.Types.GetAlarmsResult, AWSError>;
  /**
   * Returns information about the configured alarms. Specify an alarm name in your request to return information about a specific alarm, or specify a monitored resource name to return information about all alarms for a specific resource. An alarm is used to monitor a single metric for one of your resources. When a metric condition is met, the alarm can notify you by email, SMS text message, and a banner displayed on the Amazon Lightsail console. For more information, see Alarms in Amazon Lightsail.
   */
  getAlarms(callback?: (err: AWSError, data: Lightsail.Types.GetAlarmsResult) => void): Request<Lightsail.Types.GetAlarmsResult, AWSError>;
  /**
   * Returns the available automatic snapshots for an instance or disk. For more information, see the Amazon Lightsail Developer Guide.
   */
  getAutoSnapshots(params: Lightsail.Types.GetAutoSnapshotsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetAutoSnapshotsResult) => void): Request<Lightsail.Types.GetAutoSnapshotsResult, AWSError>;
  /**
   * Returns the available automatic snapshots for an instance or disk. For more information, see the Amazon Lightsail Developer Guide.
   */
  getAutoSnapshots(callback?: (err: AWSError, data: Lightsail.Types.GetAutoSnapshotsResult) => void): Request<Lightsail.Types.GetAutoSnapshotsResult, AWSError>;
  /**
   * Returns the list of available instance images, or blueprints. You can use a blueprint to create a new instance already running a specific operating system, as well as a preinstalled app or development stack. The software each instance is running depends on the blueprint image you choose.  Use active blueprints when creating new instances. Inactive blueprints are listed to support customers with existing instances and are not necessarily available to create new instances. Blueprints are marked inactive when they become outdated due to operating system updates or new application releases. 
   */
  getBlueprints(params: Lightsail.Types.GetBlueprintsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetBlueprintsResult) => void): Request<Lightsail.Types.GetBlueprintsResult, AWSError>;
  /**
   * Returns the list of available instance images, or blueprints. You can use a blueprint to create a new instance already running a specific operating system, as well as a preinstalled app or development stack. The software each instance is running depends on the blueprint image you choose.  Use active blueprints when creating new instances. Inactive blueprints are listed to support customers with existing instances and are not necessarily available to create new instances. Blueprints are marked inactive when they become outdated due to operating system updates or new application releases. 
   */
  getBlueprints(callback?: (err: AWSError, data: Lightsail.Types.GetBlueprintsResult) => void): Request<Lightsail.Types.GetBlueprintsResult, AWSError>;
  /**
   * Returns the existing access key IDs for the specified Amazon Lightsail bucket.  This action does not return the secret access key value of an access key. You can get a secret access key only when you create it from the response of the CreateBucketAccessKey action. If you lose the secret access key, you must create a new access key. 
   */
  getBucketAccessKeys(params: Lightsail.Types.GetBucketAccessKeysRequest, callback?: (err: AWSError, data: Lightsail.Types.GetBucketAccessKeysResult) => void): Request<Lightsail.Types.GetBucketAccessKeysResult, AWSError>;
  /**
   * Returns the existing access key IDs for the specified Amazon Lightsail bucket.  This action does not return the secret access key value of an access key. You can get a secret access key only when you create it from the response of the CreateBucketAccessKey action. If you lose the secret access key, you must create a new access key. 
   */
  getBucketAccessKeys(callback?: (err: AWSError, data: Lightsail.Types.GetBucketAccessKeysResult) => void): Request<Lightsail.Types.GetBucketAccessKeysResult, AWSError>;
  /**
   * Returns the bundles that you can apply to a Amazon Lightsail bucket. The bucket bundle specifies the monthly cost, storage quota, and data transfer quota for a bucket. Use the UpdateBucketBundle action to update the bundle for a bucket.
   */
  getBucketBundles(params: Lightsail.Types.GetBucketBundlesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetBucketBundlesResult) => void): Request<Lightsail.Types.GetBucketBundlesResult, AWSError>;
  /**
   * Returns the bundles that you can apply to a Amazon Lightsail bucket. The bucket bundle specifies the monthly cost, storage quota, and data transfer quota for a bucket. Use the UpdateBucketBundle action to update the bundle for a bucket.
   */
  getBucketBundles(callback?: (err: AWSError, data: Lightsail.Types.GetBucketBundlesResult) => void): Request<Lightsail.Types.GetBucketBundlesResult, AWSError>;
  /**
   * Returns the data points of a specific metric for an Amazon Lightsail bucket. Metrics report the utilization of a bucket. View and collect metric data regularly to monitor the number of objects stored in a bucket (including object versions) and the storage space used by those objects.
   */
  getBucketMetricData(params: Lightsail.Types.GetBucketMetricDataRequest, callback?: (err: AWSError, data: Lightsail.Types.GetBucketMetricDataResult) => void): Request<Lightsail.Types.GetBucketMetricDataResult, AWSError>;
  /**
   * Returns the data points of a specific metric for an Amazon Lightsail bucket. Metrics report the utilization of a bucket. View and collect metric data regularly to monitor the number of objects stored in a bucket (including object versions) and the storage space used by those objects.
   */
  getBucketMetricData(callback?: (err: AWSError, data: Lightsail.Types.GetBucketMetricDataResult) => void): Request<Lightsail.Types.GetBucketMetricDataResult, AWSError>;
  /**
   * Returns information about one or more Amazon Lightsail buckets. For more information about buckets, see Buckets in Amazon Lightsail in the Amazon Lightsail Developer Guide..
   */
  getBuckets(params: Lightsail.Types.GetBucketsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetBucketsResult) => void): Request<Lightsail.Types.GetBucketsResult, AWSError>;
  /**
   * Returns information about one or more Amazon Lightsail buckets. For more information about buckets, see Buckets in Amazon Lightsail in the Amazon Lightsail Developer Guide..
   */
  getBuckets(callback?: (err: AWSError, data: Lightsail.Types.GetBucketsResult) => void): Request<Lightsail.Types.GetBucketsResult, AWSError>;
  /**
   * Returns the list of bundles that are available for purchase. A bundle describes the specs for your virtual private server (or instance).
   */
  getBundles(params: Lightsail.Types.GetBundlesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetBundlesResult) => void): Request<Lightsail.Types.GetBundlesResult, AWSError>;
  /**
   * Returns the list of bundles that are available for purchase. A bundle describes the specs for your virtual private server (or instance).
   */
  getBundles(callback?: (err: AWSError, data: Lightsail.Types.GetBundlesResult) => void): Request<Lightsail.Types.GetBundlesResult, AWSError>;
  /**
   * Returns information about one or more Amazon Lightsail SSL/TLS certificates.  To get a summary of a certificate, ommit includeCertificateDetails from your request. The response will include only the certificate Amazon Resource Name (ARN), certificate name, domain name, and tags. 
   */
  getCertificates(params: Lightsail.Types.GetCertificatesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetCertificatesResult) => void): Request<Lightsail.Types.GetCertificatesResult, AWSError>;
  /**
   * Returns information about one or more Amazon Lightsail SSL/TLS certificates.  To get a summary of a certificate, ommit includeCertificateDetails from your request. The response will include only the certificate Amazon Resource Name (ARN), certificate name, domain name, and tags. 
   */
  getCertificates(callback?: (err: AWSError, data: Lightsail.Types.GetCertificatesResult) => void): Request<Lightsail.Types.GetCertificatesResult, AWSError>;
  /**
   * Returns the CloudFormation stack record created as a result of the create cloud formation stack operation. An AWS CloudFormation stack is used to create a new Amazon EC2 instance from an exported Lightsail snapshot.
   */
  getCloudFormationStackRecords(params: Lightsail.Types.GetCloudFormationStackRecordsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetCloudFormationStackRecordsResult) => void): Request<Lightsail.Types.GetCloudFormationStackRecordsResult, AWSError>;
  /**
   * Returns the CloudFormation stack record created as a result of the create cloud formation stack operation. An AWS CloudFormation stack is used to create a new Amazon EC2 instance from an exported Lightsail snapshot.
   */
  getCloudFormationStackRecords(callback?: (err: AWSError, data: Lightsail.Types.GetCloudFormationStackRecordsResult) => void): Request<Lightsail.Types.GetCloudFormationStackRecordsResult, AWSError>;
  /**
   * Returns information about the configured contact methods. Specify a protocol in your request to return information about a specific contact method. A contact method is used to send you notifications about your Amazon Lightsail resources. You can add one email address and one mobile phone number contact method in each AWS Region. However, SMS text messaging is not supported in some AWS Regions, and SMS text messages cannot be sent to some countries/regions. For more information, see Notifications in Amazon Lightsail.
   */
  getContactMethods(params: Lightsail.Types.GetContactMethodsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetContactMethodsResult) => void): Request<Lightsail.Types.GetContactMethodsResult, AWSError>;
  /**
   * Returns information about the configured contact methods. Specify a protocol in your request to return information about a specific contact method. A contact method is used to send you notifications about your Amazon Lightsail resources. You can add one email address and one mobile phone number contact method in each AWS Region. However, SMS text messaging is not supported in some AWS Regions, and SMS text messages cannot be sent to some countries/regions. For more information, see Notifications in Amazon Lightsail.
   */
  getContactMethods(callback?: (err: AWSError, data: Lightsail.Types.GetContactMethodsResult) => void): Request<Lightsail.Types.GetContactMethodsResult, AWSError>;
  /**
   * Returns information about Amazon Lightsail containers, such as the current version of the Lightsail Control (lightsailctl) plugin.
   */
  getContainerAPIMetadata(params: Lightsail.Types.GetContainerAPIMetadataRequest, callback?: (err: AWSError, data: Lightsail.Types.GetContainerAPIMetadataResult) => void): Request<Lightsail.Types.GetContainerAPIMetadataResult, AWSError>;
  /**
   * Returns information about Amazon Lightsail containers, such as the current version of the Lightsail Control (lightsailctl) plugin.
   */
  getContainerAPIMetadata(callback?: (err: AWSError, data: Lightsail.Types.GetContainerAPIMetadataResult) => void): Request<Lightsail.Types.GetContainerAPIMetadataResult, AWSError>;
  /**
   * Returns the container images that are registered to your Amazon Lightsail container service.  If you created a deployment on your Lightsail container service that uses container images from a public registry like Docker Hub, those images are not returned as part of this action. Those images are not registered to your Lightsail container service. 
   */
  getContainerImages(params: Lightsail.Types.GetContainerImagesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetContainerImagesResult) => void): Request<Lightsail.Types.GetContainerImagesResult, AWSError>;
  /**
   * Returns the container images that are registered to your Amazon Lightsail container service.  If you created a deployment on your Lightsail container service that uses container images from a public registry like Docker Hub, those images are not returned as part of this action. Those images are not registered to your Lightsail container service. 
   */
  getContainerImages(callback?: (err: AWSError, data: Lightsail.Types.GetContainerImagesResult) => void): Request<Lightsail.Types.GetContainerImagesResult, AWSError>;
  /**
   * Returns the log events of a container of your Amazon Lightsail container service. If your container service has more than one node (i.e., a scale greater than 1), then the log events that are returned for the specified container are merged from all nodes on your container service.  Container logs are retained for a certain amount of time. For more information, see Amazon Lightsail endpoints and quotas in the AWS General Reference. 
   */
  getContainerLog(params: Lightsail.Types.GetContainerLogRequest, callback?: (err: AWSError, data: Lightsail.Types.GetContainerLogResult) => void): Request<Lightsail.Types.GetContainerLogResult, AWSError>;
  /**
   * Returns the log events of a container of your Amazon Lightsail container service. If your container service has more than one node (i.e., a scale greater than 1), then the log events that are returned for the specified container are merged from all nodes on your container service.  Container logs are retained for a certain amount of time. For more information, see Amazon Lightsail endpoints and quotas in the AWS General Reference. 
   */
  getContainerLog(callback?: (err: AWSError, data: Lightsail.Types.GetContainerLogResult) => void): Request<Lightsail.Types.GetContainerLogResult, AWSError>;
  /**
   * Returns the deployments for your Amazon Lightsail container service A deployment specifies the settings, such as the ports and launch command, of containers that are deployed to your container service. The deployments are ordered by version in ascending order. The newest version is listed at the top of the response.  A set number of deployments are kept before the oldest one is replaced with the newest one. For more information, see Amazon Lightsail endpoints and quotas in the AWS General Reference. 
   */
  getContainerServiceDeployments(params: Lightsail.Types.GetContainerServiceDeploymentsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetContainerServiceDeploymentsResult) => void): Request<Lightsail.Types.GetContainerServiceDeploymentsResult, AWSError>;
  /**
   * Returns the deployments for your Amazon Lightsail container service A deployment specifies the settings, such as the ports and launch command, of containers that are deployed to your container service. The deployments are ordered by version in ascending order. The newest version is listed at the top of the response.  A set number of deployments are kept before the oldest one is replaced with the newest one. For more information, see Amazon Lightsail endpoints and quotas in the AWS General Reference. 
   */
  getContainerServiceDeployments(callback?: (err: AWSError, data: Lightsail.Types.GetContainerServiceDeploymentsResult) => void): Request<Lightsail.Types.GetContainerServiceDeploymentsResult, AWSError>;
  /**
   * Returns the data points of a specific metric of your Amazon Lightsail container service. Metrics report the utilization of your resources. Monitor and collect metric data regularly to maintain the reliability, availability, and performance of your resources.
   */
  getContainerServiceMetricData(params: Lightsail.Types.GetContainerServiceMetricDataRequest, callback?: (err: AWSError, data: Lightsail.Types.GetContainerServiceMetricDataResult) => void): Request<Lightsail.Types.GetContainerServiceMetricDataResult, AWSError>;
  /**
   * Returns the data points of a specific metric of your Amazon Lightsail container service. Metrics report the utilization of your resources. Monitor and collect metric data regularly to maintain the reliability, availability, and performance of your resources.
   */
  getContainerServiceMetricData(callback?: (err: AWSError, data: Lightsail.Types.GetContainerServiceMetricDataResult) => void): Request<Lightsail.Types.GetContainerServiceMetricDataResult, AWSError>;
  /**
   * Returns the list of powers that can be specified for your Amazon Lightsail container services. The power specifies the amount of memory, the number of vCPUs, and the base price of the container service.
   */
  getContainerServicePowers(params: Lightsail.Types.GetContainerServicePowersRequest, callback?: (err: AWSError, data: Lightsail.Types.GetContainerServicePowersResult) => void): Request<Lightsail.Types.GetContainerServicePowersResult, AWSError>;
  /**
   * Returns the list of powers that can be specified for your Amazon Lightsail container services. The power specifies the amount of memory, the number of vCPUs, and the base price of the container service.
   */
  getContainerServicePowers(callback?: (err: AWSError, data: Lightsail.Types.GetContainerServicePowersResult) => void): Request<Lightsail.Types.GetContainerServicePowersResult, AWSError>;
  /**
   * Returns information about one or more of your Amazon Lightsail container services.
   */
  getContainerServices(params: Lightsail.Types.GetContainerServicesRequest, callback?: (err: AWSError, data: Lightsail.Types.ContainerServicesListResult) => void): Request<Lightsail.Types.ContainerServicesListResult, AWSError>;
  /**
   * Returns information about one or more of your Amazon Lightsail container services.
   */
  getContainerServices(callback?: (err: AWSError, data: Lightsail.Types.ContainerServicesListResult) => void): Request<Lightsail.Types.ContainerServicesListResult, AWSError>;
  /**
   * Returns information about a specific block storage disk.
   */
  getDisk(params: Lightsail.Types.GetDiskRequest, callback?: (err: AWSError, data: Lightsail.Types.GetDiskResult) => void): Request<Lightsail.Types.GetDiskResult, AWSError>;
  /**
   * Returns information about a specific block storage disk.
   */
  getDisk(callback?: (err: AWSError, data: Lightsail.Types.GetDiskResult) => void): Request<Lightsail.Types.GetDiskResult, AWSError>;
  /**
   * Returns information about a specific block storage disk snapshot.
   */
  getDiskSnapshot(params: Lightsail.Types.GetDiskSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.GetDiskSnapshotResult) => void): Request<Lightsail.Types.GetDiskSnapshotResult, AWSError>;
  /**
   * Returns information about a specific block storage disk snapshot.
   */
  getDiskSnapshot(callback?: (err: AWSError, data: Lightsail.Types.GetDiskSnapshotResult) => void): Request<Lightsail.Types.GetDiskSnapshotResult, AWSError>;
  /**
   * Returns information about all block storage disk snapshots in your AWS account and region.
   */
  getDiskSnapshots(params: Lightsail.Types.GetDiskSnapshotsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetDiskSnapshotsResult) => void): Request<Lightsail.Types.GetDiskSnapshotsResult, AWSError>;
  /**
   * Returns information about all block storage disk snapshots in your AWS account and region.
   */
  getDiskSnapshots(callback?: (err: AWSError, data: Lightsail.Types.GetDiskSnapshotsResult) => void): Request<Lightsail.Types.GetDiskSnapshotsResult, AWSError>;
  /**
   * Returns information about all block storage disks in your AWS account and region.
   */
  getDisks(params: Lightsail.Types.GetDisksRequest, callback?: (err: AWSError, data: Lightsail.Types.GetDisksResult) => void): Request<Lightsail.Types.GetDisksResult, AWSError>;
  /**
   * Returns information about all block storage disks in your AWS account and region.
   */
  getDisks(callback?: (err: AWSError, data: Lightsail.Types.GetDisksResult) => void): Request<Lightsail.Types.GetDisksResult, AWSError>;
  /**
   * Returns the bundles that can be applied to your Amazon Lightsail content delivery network (CDN) distributions. A distribution bundle specifies the monthly network transfer quota and monthly cost of your dsitribution.
   */
  getDistributionBundles(params: Lightsail.Types.GetDistributionBundlesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetDistributionBundlesResult) => void): Request<Lightsail.Types.GetDistributionBundlesResult, AWSError>;
  /**
   * Returns the bundles that can be applied to your Amazon Lightsail content delivery network (CDN) distributions. A distribution bundle specifies the monthly network transfer quota and monthly cost of your dsitribution.
   */
  getDistributionBundles(callback?: (err: AWSError, data: Lightsail.Types.GetDistributionBundlesResult) => void): Request<Lightsail.Types.GetDistributionBundlesResult, AWSError>;
  /**
   * Returns the timestamp and status of the last cache reset of a specific Amazon Lightsail content delivery network (CDN) distribution.
   */
  getDistributionLatestCacheReset(params: Lightsail.Types.GetDistributionLatestCacheResetRequest, callback?: (err: AWSError, data: Lightsail.Types.GetDistributionLatestCacheResetResult) => void): Request<Lightsail.Types.GetDistributionLatestCacheResetResult, AWSError>;
  /**
   * Returns the timestamp and status of the last cache reset of a specific Amazon Lightsail content delivery network (CDN) distribution.
   */
  getDistributionLatestCacheReset(callback?: (err: AWSError, data: Lightsail.Types.GetDistributionLatestCacheResetResult) => void): Request<Lightsail.Types.GetDistributionLatestCacheResetResult, AWSError>;
  /**
   * Returns the data points of a specific metric for an Amazon Lightsail content delivery network (CDN) distribution. Metrics report the utilization of your resources, and the error counts generated by them. Monitor and collect metric data regularly to maintain the reliability, availability, and performance of your resources.
   */
  getDistributionMetricData(params: Lightsail.Types.GetDistributionMetricDataRequest, callback?: (err: AWSError, data: Lightsail.Types.GetDistributionMetricDataResult) => void): Request<Lightsail.Types.GetDistributionMetricDataResult, AWSError>;
  /**
   * Returns the data points of a specific metric for an Amazon Lightsail content delivery network (CDN) distribution. Metrics report the utilization of your resources, and the error counts generated by them. Monitor and collect metric data regularly to maintain the reliability, availability, and performance of your resources.
   */
  getDistributionMetricData(callback?: (err: AWSError, data: Lightsail.Types.GetDistributionMetricDataResult) => void): Request<Lightsail.Types.GetDistributionMetricDataResult, AWSError>;
  /**
   * Returns information about one or more of your Amazon Lightsail content delivery network (CDN) distributions.
   */
  getDistributions(params: Lightsail.Types.GetDistributionsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetDistributionsResult) => void): Request<Lightsail.Types.GetDistributionsResult, AWSError>;
  /**
   * Returns information about one or more of your Amazon Lightsail content delivery network (CDN) distributions.
   */
  getDistributions(callback?: (err: AWSError, data: Lightsail.Types.GetDistributionsResult) => void): Request<Lightsail.Types.GetDistributionsResult, AWSError>;
  /**
   * Returns information about a specific domain recordset.
   */
  getDomain(params: Lightsail.Types.GetDomainRequest, callback?: (err: AWSError, data: Lightsail.Types.GetDomainResult) => void): Request<Lightsail.Types.GetDomainResult, AWSError>;
  /**
   * Returns information about a specific domain recordset.
   */
  getDomain(callback?: (err: AWSError, data: Lightsail.Types.GetDomainResult) => void): Request<Lightsail.Types.GetDomainResult, AWSError>;
  /**
   * Returns a list of all domains in the user's account.
   */
  getDomains(params: Lightsail.Types.GetDomainsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetDomainsResult) => void): Request<Lightsail.Types.GetDomainsResult, AWSError>;
  /**
   * Returns a list of all domains in the user's account.
   */
  getDomains(callback?: (err: AWSError, data: Lightsail.Types.GetDomainsResult) => void): Request<Lightsail.Types.GetDomainsResult, AWSError>;
  /**
   * Returns all export snapshot records created as a result of the export snapshot operation. An export snapshot record can be used to create a new Amazon EC2 instance and its related resources with the CreateCloudFormationStack action.
   */
  getExportSnapshotRecords(params: Lightsail.Types.GetExportSnapshotRecordsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetExportSnapshotRecordsResult) => void): Request<Lightsail.Types.GetExportSnapshotRecordsResult, AWSError>;
  /**
   * Returns all export snapshot records created as a result of the export snapshot operation. An export snapshot record can be used to create a new Amazon EC2 instance and its related resources with the CreateCloudFormationStack action.
   */
  getExportSnapshotRecords(callback?: (err: AWSError, data: Lightsail.Types.GetExportSnapshotRecordsResult) => void): Request<Lightsail.Types.GetExportSnapshotRecordsResult, AWSError>;
  /**
   * Returns information about a specific Amazon Lightsail instance, which is a virtual private server.
   */
  getInstance(params: Lightsail.Types.GetInstanceRequest, callback?: (err: AWSError, data: Lightsail.Types.GetInstanceResult) => void): Request<Lightsail.Types.GetInstanceResult, AWSError>;
  /**
   * Returns information about a specific Amazon Lightsail instance, which is a virtual private server.
   */
  getInstance(callback?: (err: AWSError, data: Lightsail.Types.GetInstanceResult) => void): Request<Lightsail.Types.GetInstanceResult, AWSError>;
  /**
   * Returns temporary SSH keys you can use to connect to a specific virtual private server, or instance. The get instance access details operation supports tag-based access control via resource tags applied to the resource identified by instance name. For more information, see the Amazon Lightsail Developer Guide.
   */
  getInstanceAccessDetails(params: Lightsail.Types.GetInstanceAccessDetailsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetInstanceAccessDetailsResult) => void): Request<Lightsail.Types.GetInstanceAccessDetailsResult, AWSError>;
  /**
   * Returns temporary SSH keys you can use to connect to a specific virtual private server, or instance. The get instance access details operation supports tag-based access control via resource tags applied to the resource identified by instance name. For more information, see the Amazon Lightsail Developer Guide.
   */
  getInstanceAccessDetails(callback?: (err: AWSError, data: Lightsail.Types.GetInstanceAccessDetailsResult) => void): Request<Lightsail.Types.GetInstanceAccessDetailsResult, AWSError>;
  /**
   * Returns the data points for the specified Amazon Lightsail instance metric, given an instance name. Metrics report the utilization of your resources, and the error counts generated by them. Monitor and collect metric data regularly to maintain the reliability, availability, and performance of your resources.
   */
  getInstanceMetricData(params: Lightsail.Types.GetInstanceMetricDataRequest, callback?: (err: AWSError, data: Lightsail.Types.GetInstanceMetricDataResult) => void): Request<Lightsail.Types.GetInstanceMetricDataResult, AWSError>;
  /**
   * Returns the data points for the specified Amazon Lightsail instance metric, given an instance name. Metrics report the utilization of your resources, and the error counts generated by them. Monitor and collect metric data regularly to maintain the reliability, availability, and performance of your resources.
   */
  getInstanceMetricData(callback?: (err: AWSError, data: Lightsail.Types.GetInstanceMetricDataResult) => void): Request<Lightsail.Types.GetInstanceMetricDataResult, AWSError>;
  /**
   * Returns the firewall port states for a specific Amazon Lightsail instance, the IP addresses allowed to connect to the instance through the ports, and the protocol.
   */
  getInstancePortStates(params: Lightsail.Types.GetInstancePortStatesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetInstancePortStatesResult) => void): Request<Lightsail.Types.GetInstancePortStatesResult, AWSError>;
  /**
   * Returns the firewall port states for a specific Amazon Lightsail instance, the IP addresses allowed to connect to the instance through the ports, and the protocol.
   */
  getInstancePortStates(callback?: (err: AWSError, data: Lightsail.Types.GetInstancePortStatesResult) => void): Request<Lightsail.Types.GetInstancePortStatesResult, AWSError>;
  /**
   * Returns information about a specific instance snapshot.
   */
  getInstanceSnapshot(params: Lightsail.Types.GetInstanceSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.GetInstanceSnapshotResult) => void): Request<Lightsail.Types.GetInstanceSnapshotResult, AWSError>;
  /**
   * Returns information about a specific instance snapshot.
   */
  getInstanceSnapshot(callback?: (err: AWSError, data: Lightsail.Types.GetInstanceSnapshotResult) => void): Request<Lightsail.Types.GetInstanceSnapshotResult, AWSError>;
  /**
   * Returns all instance snapshots for the user's account.
   */
  getInstanceSnapshots(params: Lightsail.Types.GetInstanceSnapshotsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetInstanceSnapshotsResult) => void): Request<Lightsail.Types.GetInstanceSnapshotsResult, AWSError>;
  /**
   * Returns all instance snapshots for the user's account.
   */
  getInstanceSnapshots(callback?: (err: AWSError, data: Lightsail.Types.GetInstanceSnapshotsResult) => void): Request<Lightsail.Types.GetInstanceSnapshotsResult, AWSError>;
  /**
   * Returns the state of a specific instance. Works on one instance at a time.
   */
  getInstanceState(params: Lightsail.Types.GetInstanceStateRequest, callback?: (err: AWSError, data: Lightsail.Types.GetInstanceStateResult) => void): Request<Lightsail.Types.GetInstanceStateResult, AWSError>;
  /**
   * Returns the state of a specific instance. Works on one instance at a time.
   */
  getInstanceState(callback?: (err: AWSError, data: Lightsail.Types.GetInstanceStateResult) => void): Request<Lightsail.Types.GetInstanceStateResult, AWSError>;
  /**
   * Returns information about all Amazon Lightsail virtual private servers, or instances.
   */
  getInstances(params: Lightsail.Types.GetInstancesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetInstancesResult) => void): Request<Lightsail.Types.GetInstancesResult, AWSError>;
  /**
   * Returns information about all Amazon Lightsail virtual private servers, or instances.
   */
  getInstances(callback?: (err: AWSError, data: Lightsail.Types.GetInstancesResult) => void): Request<Lightsail.Types.GetInstancesResult, AWSError>;
  /**
   * Returns information about a specific key pair.
   */
  getKeyPair(params: Lightsail.Types.GetKeyPairRequest, callback?: (err: AWSError, data: Lightsail.Types.GetKeyPairResult) => void): Request<Lightsail.Types.GetKeyPairResult, AWSError>;
  /**
   * Returns information about a specific key pair.
   */
  getKeyPair(callback?: (err: AWSError, data: Lightsail.Types.GetKeyPairResult) => void): Request<Lightsail.Types.GetKeyPairResult, AWSError>;
  /**
   * Returns information about all key pairs in the user's account.
   */
  getKeyPairs(params: Lightsail.Types.GetKeyPairsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetKeyPairsResult) => void): Request<Lightsail.Types.GetKeyPairsResult, AWSError>;
  /**
   * Returns information about all key pairs in the user's account.
   */
  getKeyPairs(callback?: (err: AWSError, data: Lightsail.Types.GetKeyPairsResult) => void): Request<Lightsail.Types.GetKeyPairsResult, AWSError>;
  /**
   * Returns information about the specified Lightsail load balancer.
   */
  getLoadBalancer(params: Lightsail.Types.GetLoadBalancerRequest, callback?: (err: AWSError, data: Lightsail.Types.GetLoadBalancerResult) => void): Request<Lightsail.Types.GetLoadBalancerResult, AWSError>;
  /**
   * Returns information about the specified Lightsail load balancer.
   */
  getLoadBalancer(callback?: (err: AWSError, data: Lightsail.Types.GetLoadBalancerResult) => void): Request<Lightsail.Types.GetLoadBalancerResult, AWSError>;
  /**
   * Returns information about health metrics for your Lightsail load balancer. Metrics report the utilization of your resources, and the error counts generated by them. Monitor and collect metric data regularly to maintain the reliability, availability, and performance of your resources.
   */
  getLoadBalancerMetricData(params: Lightsail.Types.GetLoadBalancerMetricDataRequest, callback?: (err: AWSError, data: Lightsail.Types.GetLoadBalancerMetricDataResult) => void): Request<Lightsail.Types.GetLoadBalancerMetricDataResult, AWSError>;
  /**
   * Returns information about health metrics for your Lightsail load balancer. Metrics report the utilization of your resources, and the error counts generated by them. Monitor and collect metric data regularly to maintain the reliability, availability, and performance of your resources.
   */
  getLoadBalancerMetricData(callback?: (err: AWSError, data: Lightsail.Types.GetLoadBalancerMetricDataResult) => void): Request<Lightsail.Types.GetLoadBalancerMetricDataResult, AWSError>;
  /**
   * Returns information about the TLS certificates that are associated with the specified Lightsail load balancer. TLS is just an updated, more secure version of Secure Socket Layer (SSL). You can have a maximum of 2 certificates associated with a Lightsail load balancer. One is active and the other is inactive.
   */
  getLoadBalancerTlsCertificates(params: Lightsail.Types.GetLoadBalancerTlsCertificatesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetLoadBalancerTlsCertificatesResult) => void): Request<Lightsail.Types.GetLoadBalancerTlsCertificatesResult, AWSError>;
  /**
   * Returns information about the TLS certificates that are associated with the specified Lightsail load balancer. TLS is just an updated, more secure version of Secure Socket Layer (SSL). You can have a maximum of 2 certificates associated with a Lightsail load balancer. One is active and the other is inactive.
   */
  getLoadBalancerTlsCertificates(callback?: (err: AWSError, data: Lightsail.Types.GetLoadBalancerTlsCertificatesResult) => void): Request<Lightsail.Types.GetLoadBalancerTlsCertificatesResult, AWSError>;
  /**
   * Returns information about all load balancers in an account.
   */
  getLoadBalancers(params: Lightsail.Types.GetLoadBalancersRequest, callback?: (err: AWSError, data: Lightsail.Types.GetLoadBalancersResult) => void): Request<Lightsail.Types.GetLoadBalancersResult, AWSError>;
  /**
   * Returns information about all load balancers in an account.
   */
  getLoadBalancers(callback?: (err: AWSError, data: Lightsail.Types.GetLoadBalancersResult) => void): Request<Lightsail.Types.GetLoadBalancersResult, AWSError>;
  /**
   * Returns information about a specific operation. Operations include events such as when you create an instance, allocate a static IP, attach a static IP, and so on.
   */
  getOperation(params: Lightsail.Types.GetOperationRequest, callback?: (err: AWSError, data: Lightsail.Types.GetOperationResult) => void): Request<Lightsail.Types.GetOperationResult, AWSError>;
  /**
   * Returns information about a specific operation. Operations include events such as when you create an instance, allocate a static IP, attach a static IP, and so on.
   */
  getOperation(callback?: (err: AWSError, data: Lightsail.Types.GetOperationResult) => void): Request<Lightsail.Types.GetOperationResult, AWSError>;
  /**
   * Returns information about all operations. Results are returned from oldest to newest, up to a maximum of 200. Results can be paged by making each subsequent call to GetOperations use the maximum (last) statusChangedAt value from the previous request.
   */
  getOperations(params: Lightsail.Types.GetOperationsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetOperationsResult) => void): Request<Lightsail.Types.GetOperationsResult, AWSError>;
  /**
   * Returns information about all operations. Results are returned from oldest to newest, up to a maximum of 200. Results can be paged by making each subsequent call to GetOperations use the maximum (last) statusChangedAt value from the previous request.
   */
  getOperations(callback?: (err: AWSError, data: Lightsail.Types.GetOperationsResult) => void): Request<Lightsail.Types.GetOperationsResult, AWSError>;
  /**
   * Gets operations for a specific resource (e.g., an instance or a static IP).
   */
  getOperationsForResource(params: Lightsail.Types.GetOperationsForResourceRequest, callback?: (err: AWSError, data: Lightsail.Types.GetOperationsForResourceResult) => void): Request<Lightsail.Types.GetOperationsForResourceResult, AWSError>;
  /**
   * Gets operations for a specific resource (e.g., an instance or a static IP).
   */
  getOperationsForResource(callback?: (err: AWSError, data: Lightsail.Types.GetOperationsForResourceResult) => void): Request<Lightsail.Types.GetOperationsForResourceResult, AWSError>;
  /**
   * Returns a list of all valid regions for Amazon Lightsail. Use the include availability zones parameter to also return the Availability Zones in a region.
   */
  getRegions(params: Lightsail.Types.GetRegionsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRegionsResult) => void): Request<Lightsail.Types.GetRegionsResult, AWSError>;
  /**
   * Returns a list of all valid regions for Amazon Lightsail. Use the include availability zones parameter to also return the Availability Zones in a region.
   */
  getRegions(callback?: (err: AWSError, data: Lightsail.Types.GetRegionsResult) => void): Request<Lightsail.Types.GetRegionsResult, AWSError>;
  /**
   * Returns information about a specific database in Amazon Lightsail.
   */
  getRelationalDatabase(params: Lightsail.Types.GetRelationalDatabaseRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseResult) => void): Request<Lightsail.Types.GetRelationalDatabaseResult, AWSError>;
  /**
   * Returns information about a specific database in Amazon Lightsail.
   */
  getRelationalDatabase(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseResult) => void): Request<Lightsail.Types.GetRelationalDatabaseResult, AWSError>;
  /**
   * Returns a list of available database blueprints in Amazon Lightsail. A blueprint describes the major engine version of a database. You can use a blueprint ID to create a new database that runs a specific database engine.
   */
  getRelationalDatabaseBlueprints(params: Lightsail.Types.GetRelationalDatabaseBlueprintsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseBlueprintsResult) => void): Request<Lightsail.Types.GetRelationalDatabaseBlueprintsResult, AWSError>;
  /**
   * Returns a list of available database blueprints in Amazon Lightsail. A blueprint describes the major engine version of a database. You can use a blueprint ID to create a new database that runs a specific database engine.
   */
  getRelationalDatabaseBlueprints(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseBlueprintsResult) => void): Request<Lightsail.Types.GetRelationalDatabaseBlueprintsResult, AWSError>;
  /**
   * Returns the list of bundles that are available in Amazon Lightsail. A bundle describes the performance specifications for a database. You can use a bundle ID to create a new database with explicit performance specifications.
   */
  getRelationalDatabaseBundles(params: Lightsail.Types.GetRelationalDatabaseBundlesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseBundlesResult) => void): Request<Lightsail.Types.GetRelationalDatabaseBundlesResult, AWSError>;
  /**
   * Returns the list of bundles that are available in Amazon Lightsail. A bundle describes the performance specifications for a database. You can use a bundle ID to create a new database with explicit performance specifications.
   */
  getRelationalDatabaseBundles(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseBundlesResult) => void): Request<Lightsail.Types.GetRelationalDatabaseBundlesResult, AWSError>;
  /**
   * Returns a list of events for a specific database in Amazon Lightsail.
   */
  getRelationalDatabaseEvents(params: Lightsail.Types.GetRelationalDatabaseEventsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseEventsResult) => void): Request<Lightsail.Types.GetRelationalDatabaseEventsResult, AWSError>;
  /**
   * Returns a list of events for a specific database in Amazon Lightsail.
   */
  getRelationalDatabaseEvents(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseEventsResult) => void): Request<Lightsail.Types.GetRelationalDatabaseEventsResult, AWSError>;
  /**
   * Returns a list of log events for a database in Amazon Lightsail.
   */
  getRelationalDatabaseLogEvents(params: Lightsail.Types.GetRelationalDatabaseLogEventsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseLogEventsResult) => void): Request<Lightsail.Types.GetRelationalDatabaseLogEventsResult, AWSError>;
  /**
   * Returns a list of log events for a database in Amazon Lightsail.
   */
  getRelationalDatabaseLogEvents(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseLogEventsResult) => void): Request<Lightsail.Types.GetRelationalDatabaseLogEventsResult, AWSError>;
  /**
   * Returns a list of available log streams for a specific database in Amazon Lightsail.
   */
  getRelationalDatabaseLogStreams(params: Lightsail.Types.GetRelationalDatabaseLogStreamsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseLogStreamsResult) => void): Request<Lightsail.Types.GetRelationalDatabaseLogStreamsResult, AWSError>;
  /**
   * Returns a list of available log streams for a specific database in Amazon Lightsail.
   */
  getRelationalDatabaseLogStreams(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseLogStreamsResult) => void): Request<Lightsail.Types.GetRelationalDatabaseLogStreamsResult, AWSError>;
  /**
   * Returns the current, previous, or pending versions of the master user password for a Lightsail database. The GetRelationalDatabaseMasterUserPassword operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName.
   */
  getRelationalDatabaseMasterUserPassword(params: Lightsail.Types.GetRelationalDatabaseMasterUserPasswordRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseMasterUserPasswordResult) => void): Request<Lightsail.Types.GetRelationalDatabaseMasterUserPasswordResult, AWSError>;
  /**
   * Returns the current, previous, or pending versions of the master user password for a Lightsail database. The GetRelationalDatabaseMasterUserPassword operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName.
   */
  getRelationalDatabaseMasterUserPassword(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseMasterUserPasswordResult) => void): Request<Lightsail.Types.GetRelationalDatabaseMasterUserPasswordResult, AWSError>;
  /**
   * Returns the data points of the specified metric for a database in Amazon Lightsail. Metrics report the utilization of your resources, and the error counts generated by them. Monitor and collect metric data regularly to maintain the reliability, availability, and performance of your resources.
   */
  getRelationalDatabaseMetricData(params: Lightsail.Types.GetRelationalDatabaseMetricDataRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseMetricDataResult) => void): Request<Lightsail.Types.GetRelationalDatabaseMetricDataResult, AWSError>;
  /**
   * Returns the data points of the specified metric for a database in Amazon Lightsail. Metrics report the utilization of your resources, and the error counts generated by them. Monitor and collect metric data regularly to maintain the reliability, availability, and performance of your resources.
   */
  getRelationalDatabaseMetricData(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseMetricDataResult) => void): Request<Lightsail.Types.GetRelationalDatabaseMetricDataResult, AWSError>;
  /**
   * Returns all of the runtime parameters offered by the underlying database software, or engine, for a specific database in Amazon Lightsail. In addition to the parameter names and values, this operation returns other information about each parameter. This information includes whether changes require a reboot, whether the parameter is modifiable, the allowed values, and the data types.
   */
  getRelationalDatabaseParameters(params: Lightsail.Types.GetRelationalDatabaseParametersRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseParametersResult) => void): Request<Lightsail.Types.GetRelationalDatabaseParametersResult, AWSError>;
  /**
   * Returns all of the runtime parameters offered by the underlying database software, or engine, for a specific database in Amazon Lightsail. In addition to the parameter names and values, this operation returns other information about each parameter. This information includes whether changes require a reboot, whether the parameter is modifiable, the allowed values, and the data types.
   */
  getRelationalDatabaseParameters(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseParametersResult) => void): Request<Lightsail.Types.GetRelationalDatabaseParametersResult, AWSError>;
  /**
   * Returns information about a specific database snapshot in Amazon Lightsail.
   */
  getRelationalDatabaseSnapshot(params: Lightsail.Types.GetRelationalDatabaseSnapshotRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseSnapshotResult) => void): Request<Lightsail.Types.GetRelationalDatabaseSnapshotResult, AWSError>;
  /**
   * Returns information about a specific database snapshot in Amazon Lightsail.
   */
  getRelationalDatabaseSnapshot(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseSnapshotResult) => void): Request<Lightsail.Types.GetRelationalDatabaseSnapshotResult, AWSError>;
  /**
   * Returns information about all of your database snapshots in Amazon Lightsail.
   */
  getRelationalDatabaseSnapshots(params: Lightsail.Types.GetRelationalDatabaseSnapshotsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseSnapshotsResult) => void): Request<Lightsail.Types.GetRelationalDatabaseSnapshotsResult, AWSError>;
  /**
   * Returns information about all of your database snapshots in Amazon Lightsail.
   */
  getRelationalDatabaseSnapshots(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabaseSnapshotsResult) => void): Request<Lightsail.Types.GetRelationalDatabaseSnapshotsResult, AWSError>;
  /**
   * Returns information about all of your databases in Amazon Lightsail.
   */
  getRelationalDatabases(params: Lightsail.Types.GetRelationalDatabasesRequest, callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabasesResult) => void): Request<Lightsail.Types.GetRelationalDatabasesResult, AWSError>;
  /**
   * Returns information about all of your databases in Amazon Lightsail.
   */
  getRelationalDatabases(callback?: (err: AWSError, data: Lightsail.Types.GetRelationalDatabasesResult) => void): Request<Lightsail.Types.GetRelationalDatabasesResult, AWSError>;
  /**
   * Returns information about an Amazon Lightsail static IP.
   */
  getStaticIp(params: Lightsail.Types.GetStaticIpRequest, callback?: (err: AWSError, data: Lightsail.Types.GetStaticIpResult) => void): Request<Lightsail.Types.GetStaticIpResult, AWSError>;
  /**
   * Returns information about an Amazon Lightsail static IP.
   */
  getStaticIp(callback?: (err: AWSError, data: Lightsail.Types.GetStaticIpResult) => void): Request<Lightsail.Types.GetStaticIpResult, AWSError>;
  /**
   * Returns information about all static IPs in the user's account.
   */
  getStaticIps(params: Lightsail.Types.GetStaticIpsRequest, callback?: (err: AWSError, data: Lightsail.Types.GetStaticIpsResult) => void): Request<Lightsail.Types.GetStaticIpsResult, AWSError>;
  /**
   * Returns information about all static IPs in the user's account.
   */
  getStaticIps(callback?: (err: AWSError, data: Lightsail.Types.GetStaticIpsResult) => void): Request<Lightsail.Types.GetStaticIpsResult, AWSError>;
  /**
   * Imports a public SSH key from a specific key pair.
   */
  importKeyPair(params: Lightsail.Types.ImportKeyPairRequest, callback?: (err: AWSError, data: Lightsail.Types.ImportKeyPairResult) => void): Request<Lightsail.Types.ImportKeyPairResult, AWSError>;
  /**
   * Imports a public SSH key from a specific key pair.
   */
  importKeyPair(callback?: (err: AWSError, data: Lightsail.Types.ImportKeyPairResult) => void): Request<Lightsail.Types.ImportKeyPairResult, AWSError>;
  /**
   * Returns a Boolean value indicating whether your Lightsail VPC is peered.
   */
  isVpcPeered(params: Lightsail.Types.IsVpcPeeredRequest, callback?: (err: AWSError, data: Lightsail.Types.IsVpcPeeredResult) => void): Request<Lightsail.Types.IsVpcPeeredResult, AWSError>;
  /**
   * Returns a Boolean value indicating whether your Lightsail VPC is peered.
   */
  isVpcPeered(callback?: (err: AWSError, data: Lightsail.Types.IsVpcPeeredResult) => void): Request<Lightsail.Types.IsVpcPeeredResult, AWSError>;
  /**
   * Opens ports for a specific Amazon Lightsail instance, and specifies the IP addresses allowed to connect to the instance through the ports, and the protocol. The OpenInstancePublicPorts action supports tag-based access control via resource tags applied to the resource identified by instanceName. For more information, see the Amazon Lightsail Developer Guide.
   */
  openInstancePublicPorts(params: Lightsail.Types.OpenInstancePublicPortsRequest, callback?: (err: AWSError, data: Lightsail.Types.OpenInstancePublicPortsResult) => void): Request<Lightsail.Types.OpenInstancePublicPortsResult, AWSError>;
  /**
   * Opens ports for a specific Amazon Lightsail instance, and specifies the IP addresses allowed to connect to the instance through the ports, and the protocol. The OpenInstancePublicPorts action supports tag-based access control via resource tags applied to the resource identified by instanceName. For more information, see the Amazon Lightsail Developer Guide.
   */
  openInstancePublicPorts(callback?: (err: AWSError, data: Lightsail.Types.OpenInstancePublicPortsResult) => void): Request<Lightsail.Types.OpenInstancePublicPortsResult, AWSError>;
  /**
   * Peers the Lightsail VPC with the user's default VPC.
   */
  peerVpc(params: Lightsail.Types.PeerVpcRequest, callback?: (err: AWSError, data: Lightsail.Types.PeerVpcResult) => void): Request<Lightsail.Types.PeerVpcResult, AWSError>;
  /**
   * Peers the Lightsail VPC with the user's default VPC.
   */
  peerVpc(callback?: (err: AWSError, data: Lightsail.Types.PeerVpcResult) => void): Request<Lightsail.Types.PeerVpcResult, AWSError>;
  /**
   * Creates or updates an alarm, and associates it with the specified metric. An alarm is used to monitor a single metric for one of your resources. When a metric condition is met, the alarm can notify you by email, SMS text message, and a banner displayed on the Amazon Lightsail console. For more information, see Alarms in Amazon Lightsail. When this action creates an alarm, the alarm state is immediately set to INSUFFICIENT_DATA. The alarm is then evaluated and its state is set appropriately. Any actions associated with the new state are then executed. When you update an existing alarm, its state is left unchanged, but the update completely overwrites the previous configuration of the alarm. The alarm is then evaluated with the updated configuration.
   */
  putAlarm(params: Lightsail.Types.PutAlarmRequest, callback?: (err: AWSError, data: Lightsail.Types.PutAlarmResult) => void): Request<Lightsail.Types.PutAlarmResult, AWSError>;
  /**
   * Creates or updates an alarm, and associates it with the specified metric. An alarm is used to monitor a single metric for one of your resources. When a metric condition is met, the alarm can notify you by email, SMS text message, and a banner displayed on the Amazon Lightsail console. For more information, see Alarms in Amazon Lightsail. When this action creates an alarm, the alarm state is immediately set to INSUFFICIENT_DATA. The alarm is then evaluated and its state is set appropriately. Any actions associated with the new state are then executed. When you update an existing alarm, its state is left unchanged, but the update completely overwrites the previous configuration of the alarm. The alarm is then evaluated with the updated configuration.
   */
  putAlarm(callback?: (err: AWSError, data: Lightsail.Types.PutAlarmResult) => void): Request<Lightsail.Types.PutAlarmResult, AWSError>;
  /**
   * Opens ports for a specific Amazon Lightsail instance, and specifies the IP addresses allowed to connect to the instance through the ports, and the protocol. This action also closes all currently open ports that are not included in the request. Include all of the ports and the protocols you want to open in your PutInstancePublicPortsrequest. Or use the OpenInstancePublicPorts action to open ports without closing currently open ports. The PutInstancePublicPorts action supports tag-based access control via resource tags applied to the resource identified by instanceName. For more information, see the Amazon Lightsail Developer Guide.
   */
  putInstancePublicPorts(params: Lightsail.Types.PutInstancePublicPortsRequest, callback?: (err: AWSError, data: Lightsail.Types.PutInstancePublicPortsResult) => void): Request<Lightsail.Types.PutInstancePublicPortsResult, AWSError>;
  /**
   * Opens ports for a specific Amazon Lightsail instance, and specifies the IP addresses allowed to connect to the instance through the ports, and the protocol. This action also closes all currently open ports that are not included in the request. Include all of the ports and the protocols you want to open in your PutInstancePublicPortsrequest. Or use the OpenInstancePublicPorts action to open ports without closing currently open ports. The PutInstancePublicPorts action supports tag-based access control via resource tags applied to the resource identified by instanceName. For more information, see the Amazon Lightsail Developer Guide.
   */
  putInstancePublicPorts(callback?: (err: AWSError, data: Lightsail.Types.PutInstancePublicPortsResult) => void): Request<Lightsail.Types.PutInstancePublicPortsResult, AWSError>;
  /**
   * Restarts a specific instance. The reboot instance operation supports tag-based access control via resource tags applied to the resource identified by instance name. For more information, see the Amazon Lightsail Developer Guide.
   */
  rebootInstance(params: Lightsail.Types.RebootInstanceRequest, callback?: (err: AWSError, data: Lightsail.Types.RebootInstanceResult) => void): Request<Lightsail.Types.RebootInstanceResult, AWSError>;
  /**
   * Restarts a specific instance. The reboot instance operation supports tag-based access control via resource tags applied to the resource identified by instance name. For more information, see the Amazon Lightsail Developer Guide.
   */
  rebootInstance(callback?: (err: AWSError, data: Lightsail.Types.RebootInstanceResult) => void): Request<Lightsail.Types.RebootInstanceResult, AWSError>;
  /**
   * Restarts a specific database in Amazon Lightsail. The reboot relational database operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  rebootRelationalDatabase(params: Lightsail.Types.RebootRelationalDatabaseRequest, callback?: (err: AWSError, data: Lightsail.Types.RebootRelationalDatabaseResult) => void): Request<Lightsail.Types.RebootRelationalDatabaseResult, AWSError>;
  /**
   * Restarts a specific database in Amazon Lightsail. The reboot relational database operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  rebootRelationalDatabase(callback?: (err: AWSError, data: Lightsail.Types.RebootRelationalDatabaseResult) => void): Request<Lightsail.Types.RebootRelationalDatabaseResult, AWSError>;
  /**
   * Registers a container image to your Amazon Lightsail container service.  This action is not required if you install and use the Lightsail Control (lightsailctl) plugin to push container images to your Lightsail container service. For more information, see Pushing and managing container images on your Amazon Lightsail container services in the Amazon Lightsail Developer Guide. 
   */
  registerContainerImage(params: Lightsail.Types.RegisterContainerImageRequest, callback?: (err: AWSError, data: Lightsail.Types.RegisterContainerImageResult) => void): Request<Lightsail.Types.RegisterContainerImageResult, AWSError>;
  /**
   * Registers a container image to your Amazon Lightsail container service.  This action is not required if you install and use the Lightsail Control (lightsailctl) plugin to push container images to your Lightsail container service. For more information, see Pushing and managing container images on your Amazon Lightsail container services in the Amazon Lightsail Developer Guide. 
   */
  registerContainerImage(callback?: (err: AWSError, data: Lightsail.Types.RegisterContainerImageResult) => void): Request<Lightsail.Types.RegisterContainerImageResult, AWSError>;
  /**
   * Deletes a specific static IP from your account.
   */
  releaseStaticIp(params: Lightsail.Types.ReleaseStaticIpRequest, callback?: (err: AWSError, data: Lightsail.Types.ReleaseStaticIpResult) => void): Request<Lightsail.Types.ReleaseStaticIpResult, AWSError>;
  /**
   * Deletes a specific static IP from your account.
   */
  releaseStaticIp(callback?: (err: AWSError, data: Lightsail.Types.ReleaseStaticIpResult) => void): Request<Lightsail.Types.ReleaseStaticIpResult, AWSError>;
  /**
   * Deletes currently cached content from your Amazon Lightsail content delivery network (CDN) distribution. After resetting the cache, the next time a content request is made, your distribution pulls, serves, and caches it from the origin.
   */
  resetDistributionCache(params: Lightsail.Types.ResetDistributionCacheRequest, callback?: (err: AWSError, data: Lightsail.Types.ResetDistributionCacheResult) => void): Request<Lightsail.Types.ResetDistributionCacheResult, AWSError>;
  /**
   * Deletes currently cached content from your Amazon Lightsail content delivery network (CDN) distribution. After resetting the cache, the next time a content request is made, your distribution pulls, serves, and caches it from the origin.
   */
  resetDistributionCache(callback?: (err: AWSError, data: Lightsail.Types.ResetDistributionCacheResult) => void): Request<Lightsail.Types.ResetDistributionCacheResult, AWSError>;
  /**
   * Sends a verification request to an email contact method to ensure it's owned by the requester. SMS contact methods don't need to be verified. A contact method is used to send you notifications about your Amazon Lightsail resources. You can add one email address and one mobile phone number contact method in each AWS Region. However, SMS text messaging is not supported in some AWS Regions, and SMS text messages cannot be sent to some countries/regions. For more information, see Notifications in Amazon Lightsail. A verification request is sent to the contact method when you initially create it. Use this action to send another verification request if a previous verification request was deleted, or has expired.  Notifications are not sent to an email contact method until after it is verified, and confirmed as valid. 
   */
  sendContactMethodVerification(params: Lightsail.Types.SendContactMethodVerificationRequest, callback?: (err: AWSError, data: Lightsail.Types.SendContactMethodVerificationResult) => void): Request<Lightsail.Types.SendContactMethodVerificationResult, AWSError>;
  /**
   * Sends a verification request to an email contact method to ensure it's owned by the requester. SMS contact methods don't need to be verified. A contact method is used to send you notifications about your Amazon Lightsail resources. You can add one email address and one mobile phone number contact method in each AWS Region. However, SMS text messaging is not supported in some AWS Regions, and SMS text messages cannot be sent to some countries/regions. For more information, see Notifications in Amazon Lightsail. A verification request is sent to the contact method when you initially create it. Use this action to send another verification request if a previous verification request was deleted, or has expired.  Notifications are not sent to an email contact method until after it is verified, and confirmed as valid. 
   */
  sendContactMethodVerification(callback?: (err: AWSError, data: Lightsail.Types.SendContactMethodVerificationResult) => void): Request<Lightsail.Types.SendContactMethodVerificationResult, AWSError>;
  /**
   * Sets the IP address type for an Amazon Lightsail resource. Use this action to enable dual-stack for a resource, which enables IPv4 and IPv6 for the specified resource. Alternately, you can use this action to disable dual-stack, and enable IPv4 only.
   */
  setIpAddressType(params: Lightsail.Types.SetIpAddressTypeRequest, callback?: (err: AWSError, data: Lightsail.Types.SetIpAddressTypeResult) => void): Request<Lightsail.Types.SetIpAddressTypeResult, AWSError>;
  /**
   * Sets the IP address type for an Amazon Lightsail resource. Use this action to enable dual-stack for a resource, which enables IPv4 and IPv6 for the specified resource. Alternately, you can use this action to disable dual-stack, and enable IPv4 only.
   */
  setIpAddressType(callback?: (err: AWSError, data: Lightsail.Types.SetIpAddressTypeResult) => void): Request<Lightsail.Types.SetIpAddressTypeResult, AWSError>;
  /**
   * Sets the Amazon Lightsail resources that can access the specified Lightsail bucket. Lightsail buckets currently support setting access for Lightsail instances in the same AWS Region.
   */
  setResourceAccessForBucket(params: Lightsail.Types.SetResourceAccessForBucketRequest, callback?: (err: AWSError, data: Lightsail.Types.SetResourceAccessForBucketResult) => void): Request<Lightsail.Types.SetResourceAccessForBucketResult, AWSError>;
  /**
   * Sets the Amazon Lightsail resources that can access the specified Lightsail bucket. Lightsail buckets currently support setting access for Lightsail instances in the same AWS Region.
   */
  setResourceAccessForBucket(callback?: (err: AWSError, data: Lightsail.Types.SetResourceAccessForBucketResult) => void): Request<Lightsail.Types.SetResourceAccessForBucketResult, AWSError>;
  /**
   * Starts a specific Amazon Lightsail instance from a stopped state. To restart an instance, use the reboot instance operation.  When you start a stopped instance, Lightsail assigns a new public IP address to the instance. To use the same IP address after stopping and starting an instance, create a static IP address and attach it to the instance. For more information, see the Amazon Lightsail Developer Guide.  The start instance operation supports tag-based access control via resource tags applied to the resource identified by instance name. For more information, see the Amazon Lightsail Developer Guide.
   */
  startInstance(params: Lightsail.Types.StartInstanceRequest, callback?: (err: AWSError, data: Lightsail.Types.StartInstanceResult) => void): Request<Lightsail.Types.StartInstanceResult, AWSError>;
  /**
   * Starts a specific Amazon Lightsail instance from a stopped state. To restart an instance, use the reboot instance operation.  When you start a stopped instance, Lightsail assigns a new public IP address to the instance. To use the same IP address after stopping and starting an instance, create a static IP address and attach it to the instance. For more information, see the Amazon Lightsail Developer Guide.  The start instance operation supports tag-based access control via resource tags applied to the resource identified by instance name. For more information, see the Amazon Lightsail Developer Guide.
   */
  startInstance(callback?: (err: AWSError, data: Lightsail.Types.StartInstanceResult) => void): Request<Lightsail.Types.StartInstanceResult, AWSError>;
  /**
   * Starts a specific database from a stopped state in Amazon Lightsail. To restart a database, use the reboot relational database operation. The start relational database operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  startRelationalDatabase(params: Lightsail.Types.StartRelationalDatabaseRequest, callback?: (err: AWSError, data: Lightsail.Types.StartRelationalDatabaseResult) => void): Request<Lightsail.Types.StartRelationalDatabaseResult, AWSError>;
  /**
   * Starts a specific database from a stopped state in Amazon Lightsail. To restart a database, use the reboot relational database operation. The start relational database operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  startRelationalDatabase(callback?: (err: AWSError, data: Lightsail.Types.StartRelationalDatabaseResult) => void): Request<Lightsail.Types.StartRelationalDatabaseResult, AWSError>;
  /**
   * Stops a specific Amazon Lightsail instance that is currently running.  When you start a stopped instance, Lightsail assigns a new public IP address to the instance. To use the same IP address after stopping and starting an instance, create a static IP address and attach it to the instance. For more information, see the Amazon Lightsail Developer Guide.  The stop instance operation supports tag-based access control via resource tags applied to the resource identified by instance name. For more information, see the Amazon Lightsail Developer Guide.
   */
  stopInstance(params: Lightsail.Types.StopInstanceRequest, callback?: (err: AWSError, data: Lightsail.Types.StopInstanceResult) => void): Request<Lightsail.Types.StopInstanceResult, AWSError>;
  /**
   * Stops a specific Amazon Lightsail instance that is currently running.  When you start a stopped instance, Lightsail assigns a new public IP address to the instance. To use the same IP address after stopping and starting an instance, create a static IP address and attach it to the instance. For more information, see the Amazon Lightsail Developer Guide.  The stop instance operation supports tag-based access control via resource tags applied to the resource identified by instance name. For more information, see the Amazon Lightsail Developer Guide.
   */
  stopInstance(callback?: (err: AWSError, data: Lightsail.Types.StopInstanceResult) => void): Request<Lightsail.Types.StopInstanceResult, AWSError>;
  /**
   * Stops a specific database that is currently running in Amazon Lightsail. The stop relational database operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  stopRelationalDatabase(params: Lightsail.Types.StopRelationalDatabaseRequest, callback?: (err: AWSError, data: Lightsail.Types.StopRelationalDatabaseResult) => void): Request<Lightsail.Types.StopRelationalDatabaseResult, AWSError>;
  /**
   * Stops a specific database that is currently running in Amazon Lightsail. The stop relational database operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  stopRelationalDatabase(callback?: (err: AWSError, data: Lightsail.Types.StopRelationalDatabaseResult) => void): Request<Lightsail.Types.StopRelationalDatabaseResult, AWSError>;
  /**
   * Adds one or more tags to the specified Amazon Lightsail resource. Each resource can have a maximum of 50 tags. Each tag consists of a key and an optional value. Tag keys must be unique per resource. For more information about tags, see the Amazon Lightsail Developer Guide. The tag resource operation supports tag-based access control via request tags and resource tags applied to the resource identified by resource name. For more information, see the Amazon Lightsail Developer Guide.
   */
  tagResource(params: Lightsail.Types.TagResourceRequest, callback?: (err: AWSError, data: Lightsail.Types.TagResourceResult) => void): Request<Lightsail.Types.TagResourceResult, AWSError>;
  /**
   * Adds one or more tags to the specified Amazon Lightsail resource. Each resource can have a maximum of 50 tags. Each tag consists of a key and an optional value. Tag keys must be unique per resource. For more information about tags, see the Amazon Lightsail Developer Guide. The tag resource operation supports tag-based access control via request tags and resource tags applied to the resource identified by resource name. For more information, see the Amazon Lightsail Developer Guide.
   */
  tagResource(callback?: (err: AWSError, data: Lightsail.Types.TagResourceResult) => void): Request<Lightsail.Types.TagResourceResult, AWSError>;
  /**
   * Tests an alarm by displaying a banner on the Amazon Lightsail console. If a notification trigger is configured for the specified alarm, the test also sends a notification to the notification protocol (Email and/or SMS) configured for the alarm. An alarm is used to monitor a single metric for one of your resources. When a metric condition is met, the alarm can notify you by email, SMS text message, and a banner displayed on the Amazon Lightsail console. For more information, see Alarms in Amazon Lightsail.
   */
  testAlarm(params: Lightsail.Types.TestAlarmRequest, callback?: (err: AWSError, data: Lightsail.Types.TestAlarmResult) => void): Request<Lightsail.Types.TestAlarmResult, AWSError>;
  /**
   * Tests an alarm by displaying a banner on the Amazon Lightsail console. If a notification trigger is configured for the specified alarm, the test also sends a notification to the notification protocol (Email and/or SMS) configured for the alarm. An alarm is used to monitor a single metric for one of your resources. When a metric condition is met, the alarm can notify you by email, SMS text message, and a banner displayed on the Amazon Lightsail console. For more information, see Alarms in Amazon Lightsail.
   */
  testAlarm(callback?: (err: AWSError, data: Lightsail.Types.TestAlarmResult) => void): Request<Lightsail.Types.TestAlarmResult, AWSError>;
  /**
   * Unpeers the Lightsail VPC from the user's default VPC.
   */
  unpeerVpc(params: Lightsail.Types.UnpeerVpcRequest, callback?: (err: AWSError, data: Lightsail.Types.UnpeerVpcResult) => void): Request<Lightsail.Types.UnpeerVpcResult, AWSError>;
  /**
   * Unpeers the Lightsail VPC from the user's default VPC.
   */
  unpeerVpc(callback?: (err: AWSError, data: Lightsail.Types.UnpeerVpcResult) => void): Request<Lightsail.Types.UnpeerVpcResult, AWSError>;
  /**
   * Deletes the specified set of tag keys and their values from the specified Amazon Lightsail resource. The untag resource operation supports tag-based access control via request tags and resource tags applied to the resource identified by resource name. For more information, see the Amazon Lightsail Developer Guide.
   */
  untagResource(params: Lightsail.Types.UntagResourceRequest, callback?: (err: AWSError, data: Lightsail.Types.UntagResourceResult) => void): Request<Lightsail.Types.UntagResourceResult, AWSError>;
  /**
   * Deletes the specified set of tag keys and their values from the specified Amazon Lightsail resource. The untag resource operation supports tag-based access control via request tags and resource tags applied to the resource identified by resource name. For more information, see the Amazon Lightsail Developer Guide.
   */
  untagResource(callback?: (err: AWSError, data: Lightsail.Types.UntagResourceResult) => void): Request<Lightsail.Types.UntagResourceResult, AWSError>;
  /**
   * Updates an existing Amazon Lightsail bucket. Use this action to update the configuration of an existing bucket, such as versioning, public accessibility, and the AWS accounts that can access the bucket.
   */
  updateBucket(params: Lightsail.Types.UpdateBucketRequest, callback?: (err: AWSError, data: Lightsail.Types.UpdateBucketResult) => void): Request<Lightsail.Types.UpdateBucketResult, AWSError>;
  /**
   * Updates an existing Amazon Lightsail bucket. Use this action to update the configuration of an existing bucket, such as versioning, public accessibility, and the AWS accounts that can access the bucket.
   */
  updateBucket(callback?: (err: AWSError, data: Lightsail.Types.UpdateBucketResult) => void): Request<Lightsail.Types.UpdateBucketResult, AWSError>;
  /**
   * Updates the bundle, or storage plan, of an existing Amazon Lightsail bucket. A bucket bundle specifies the monthly cost, storage space, and data transfer quota for a bucket. You can update a bucket's bundle only one time within a monthly AWS billing cycle. To determine if you can update a bucket's bundle, use the GetBuckets action. The ableToUpdateBundle parameter in the response will indicate whether you can currently update a bucket's bundle. Update a bucket's bundle if it's consistently going over its storage space or data transfer quota, or if a bucket's usage is consistently in the lower range of its storage space or data transfer quota. Due to the unpredictable usage fluctuations that a bucket might experience, we strongly recommend that you update a bucket's bundle only as a long-term strategy, instead of as a short-term, monthly cost-cutting measure. Choose a bucket bundle that will provide the bucket with ample storage space and data transfer for a long time to come.
   */
  updateBucketBundle(params: Lightsail.Types.UpdateBucketBundleRequest, callback?: (err: AWSError, data: Lightsail.Types.UpdateBucketBundleResult) => void): Request<Lightsail.Types.UpdateBucketBundleResult, AWSError>;
  /**
   * Updates the bundle, or storage plan, of an existing Amazon Lightsail bucket. A bucket bundle specifies the monthly cost, storage space, and data transfer quota for a bucket. You can update a bucket's bundle only one time within a monthly AWS billing cycle. To determine if you can update a bucket's bundle, use the GetBuckets action. The ableToUpdateBundle parameter in the response will indicate whether you can currently update a bucket's bundle. Update a bucket's bundle if it's consistently going over its storage space or data transfer quota, or if a bucket's usage is consistently in the lower range of its storage space or data transfer quota. Due to the unpredictable usage fluctuations that a bucket might experience, we strongly recommend that you update a bucket's bundle only as a long-term strategy, instead of as a short-term, monthly cost-cutting measure. Choose a bucket bundle that will provide the bucket with ample storage space and data transfer for a long time to come.
   */
  updateBucketBundle(callback?: (err: AWSError, data: Lightsail.Types.UpdateBucketBundleResult) => void): Request<Lightsail.Types.UpdateBucketBundleResult, AWSError>;
  /**
   * Updates the configuration of your Amazon Lightsail container service, such as its power, scale, and public domain names.
   */
  updateContainerService(params: Lightsail.Types.UpdateContainerServiceRequest, callback?: (err: AWSError, data: Lightsail.Types.UpdateContainerServiceResult) => void): Request<Lightsail.Types.UpdateContainerServiceResult, AWSError>;
  /**
   * Updates the configuration of your Amazon Lightsail container service, such as its power, scale, and public domain names.
   */
  updateContainerService(callback?: (err: AWSError, data: Lightsail.Types.UpdateContainerServiceResult) => void): Request<Lightsail.Types.UpdateContainerServiceResult, AWSError>;
  /**
   * Updates an existing Amazon Lightsail content delivery network (CDN) distribution. Use this action to update the configuration of your existing distribution.
   */
  updateDistribution(params: Lightsail.Types.UpdateDistributionRequest, callback?: (err: AWSError, data: Lightsail.Types.UpdateDistributionResult) => void): Request<Lightsail.Types.UpdateDistributionResult, AWSError>;
  /**
   * Updates an existing Amazon Lightsail content delivery network (CDN) distribution. Use this action to update the configuration of your existing distribution.
   */
  updateDistribution(callback?: (err: AWSError, data: Lightsail.Types.UpdateDistributionResult) => void): Request<Lightsail.Types.UpdateDistributionResult, AWSError>;
  /**
   * Updates the bundle of your Amazon Lightsail content delivery network (CDN) distribution. A distribution bundle specifies the monthly network transfer quota and monthly cost of your dsitribution. Update your distribution's bundle if your distribution is going over its monthly network transfer quota and is incurring an overage fee. You can update your distribution's bundle only one time within your monthly AWS billing cycle. To determine if you can update your distribution's bundle, use the GetDistributions action. The ableToUpdateBundle parameter in the result will indicate whether you can currently update your distribution's bundle.
   */
  updateDistributionBundle(params: Lightsail.Types.UpdateDistributionBundleRequest, callback?: (err: AWSError, data: Lightsail.Types.UpdateDistributionBundleResult) => void): Request<Lightsail.Types.UpdateDistributionBundleResult, AWSError>;
  /**
   * Updates the bundle of your Amazon Lightsail content delivery network (CDN) distribution. A distribution bundle specifies the monthly network transfer quota and monthly cost of your dsitribution. Update your distribution's bundle if your distribution is going over its monthly network transfer quota and is incurring an overage fee. You can update your distribution's bundle only one time within your monthly AWS billing cycle. To determine if you can update your distribution's bundle, use the GetDistributions action. The ableToUpdateBundle parameter in the result will indicate whether you can currently update your distribution's bundle.
   */
  updateDistributionBundle(callback?: (err: AWSError, data: Lightsail.Types.UpdateDistributionBundleResult) => void): Request<Lightsail.Types.UpdateDistributionBundleResult, AWSError>;
  /**
   * Updates a domain recordset after it is created. The update domain entry operation supports tag-based access control via resource tags applied to the resource identified by domain name. For more information, see the Amazon Lightsail Developer Guide.
   */
  updateDomainEntry(params: Lightsail.Types.UpdateDomainEntryRequest, callback?: (err: AWSError, data: Lightsail.Types.UpdateDomainEntryResult) => void): Request<Lightsail.Types.UpdateDomainEntryResult, AWSError>;
  /**
   * Updates a domain recordset after it is created. The update domain entry operation supports tag-based access control via resource tags applied to the resource identified by domain name. For more information, see the Amazon Lightsail Developer Guide.
   */
  updateDomainEntry(callback?: (err: AWSError, data: Lightsail.Types.UpdateDomainEntryResult) => void): Request<Lightsail.Types.UpdateDomainEntryResult, AWSError>;
  /**
   * Updates the specified attribute for a load balancer. You can only update one attribute at a time. The update load balancer attribute operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  updateLoadBalancerAttribute(params: Lightsail.Types.UpdateLoadBalancerAttributeRequest, callback?: (err: AWSError, data: Lightsail.Types.UpdateLoadBalancerAttributeResult) => void): Request<Lightsail.Types.UpdateLoadBalancerAttributeResult, AWSError>;
  /**
   * Updates the specified attribute for a load balancer. You can only update one attribute at a time. The update load balancer attribute operation supports tag-based access control via resource tags applied to the resource identified by load balancer name. For more information, see the Amazon Lightsail Developer Guide.
   */
  updateLoadBalancerAttribute(callback?: (err: AWSError, data: Lightsail.Types.UpdateLoadBalancerAttributeResult) => void): Request<Lightsail.Types.UpdateLoadBalancerAttributeResult, AWSError>;
  /**
   * Allows the update of one or more attributes of a database in Amazon Lightsail. Updates are applied immediately, or in cases where the updates could result in an outage, are applied during the database's predefined maintenance window. The update relational database operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  updateRelationalDatabase(params: Lightsail.Types.UpdateRelationalDatabaseRequest, callback?: (err: AWSError, data: Lightsail.Types.UpdateRelationalDatabaseResult) => void): Request<Lightsail.Types.UpdateRelationalDatabaseResult, AWSError>;
  /**
   * Allows the update of one or more attributes of a database in Amazon Lightsail. Updates are applied immediately, or in cases where the updates could result in an outage, are applied during the database's predefined maintenance window. The update relational database operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  updateRelationalDatabase(callback?: (err: AWSError, data: Lightsail.Types.UpdateRelationalDatabaseResult) => void): Request<Lightsail.Types.UpdateRelationalDatabaseResult, AWSError>;
  /**
   * Allows the update of one or more parameters of a database in Amazon Lightsail. Parameter updates don't cause outages; therefore, their application is not subject to the preferred maintenance window. However, there are two ways in which parameter updates are applied: dynamic or pending-reboot. Parameters marked with a dynamic apply type are applied immediately. Parameters marked with a pending-reboot apply type are applied only after the database is rebooted using the reboot relational database operation. The update relational database parameters operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  updateRelationalDatabaseParameters(params: Lightsail.Types.UpdateRelationalDatabaseParametersRequest, callback?: (err: AWSError, data: Lightsail.Types.UpdateRelationalDatabaseParametersResult) => void): Request<Lightsail.Types.UpdateRelationalDatabaseParametersResult, AWSError>;
  /**
   * Allows the update of one or more parameters of a database in Amazon Lightsail. Parameter updates don't cause outages; therefore, their application is not subject to the preferred maintenance window. However, there are two ways in which parameter updates are applied: dynamic or pending-reboot. Parameters marked with a dynamic apply type are applied immediately. Parameters marked with a pending-reboot apply type are applied only after the database is rebooted using the reboot relational database operation. The update relational database parameters operation supports tag-based access control via resource tags applied to the resource identified by relationalDatabaseName. For more information, see the Amazon Lightsail Developer Guide.
   */
  updateRelationalDatabaseParameters(callback?: (err: AWSError, data: Lightsail.Types.UpdateRelationalDatabaseParametersResult) => void): Request<Lightsail.Types.UpdateRelationalDatabaseParametersResult, AWSError>;
}
declare namespace Lightsail {
  export type AccessDirection = "inbound"|"outbound"|string;
  export interface AccessKey {
    /**
     * The ID of the access key.
     */
    accessKeyId?: IAMAccessKeyId;
    /**
     * The secret access key used to sign requests. You should store the secret access key in a safe location. We recommend that you delete the access key if the secret access key is compromised.
     */
    secretAccessKey?: NonEmptyString;
    /**
     * The status of the access key. A status of Active means that the key is valid, while Inactive means it is not.
     */
    status?: StatusType;
    /**
     * The timestamp when the access key was created.
     */
    createdAt?: IsoDate;
    /**
     * An object that describes the last time the access key was used.  This object does not include data in the response of a CreateBucketAccessKey action. If the access key has not been used, the region and serviceName values are N/A, and the lastUsedDate value is null. 
     */
    lastUsed?: AccessKeyLastUsed;
  }
  export interface AccessKeyLastUsed {
    /**
     * The date and time when the access key was most recently used. This value is null if the access key has not been used.
     */
    lastUsedDate?: IsoDate;
    /**
     * The AWS Region where this access key was most recently used. This value is N/A if the access key has not been used.
     */
    region?: string;
    /**
     * The name of the AWS service with which this access key was most recently used. This value is N/A if the access key has not been used.
     */
    serviceName?: string;
  }
  export type AccessKeyList = AccessKey[];
  export type AccessReceiverList = ResourceReceivingAccess[];
  export interface AccessRules {
    /**
     * Specifies the anonymous access to all objects in a bucket. The following options can be specified:    public - Sets all objects in the bucket to public (read-only), making them readable by anyone in the world. If the getObject value is set to public, then all objects in the bucket default to public regardless of the allowPublicOverrides value.    private - Sets all objects in the bucket to private, making them readable only by you or anyone you give access to. If the getObject value is set to private, and the allowPublicOverrides value is set to true, then all objects in the bucket default to private unless they are configured with a public-read ACL. Individual objects with a public-read ACL are readable by anyone in the world.  
     */
    getObject?: AccessType;
    /**
     * A Boolean value that indicates whether the access control list (ACL) permissions that are applied to individual objects override the getObject option that is currently specified. When this is true, you can use the PutObjectAcl Amazon S3 API action to set individual objects to public (read-only) using the public-read ACL, or to private using the private ACL.
     */
    allowPublicOverrides?: boolean;
  }
  export type AccessType = "public"|"private"|string;
  export interface AddOn {
    /**
     * The name of the add-on.
     */
    name?: string;
    /**
     * The status of the add-on.
     */
    status?: string;
    /**
     * The daily time when an automatic snapshot is created. The time shown is in HH:00 format, and in Coordinated Universal Time (UTC). The snapshot is automatically created between the time shown and up to 45 minutes after.
     */
    snapshotTimeOfDay?: TimeOfDay;
    /**
     * The next daily time an automatic snapshot will be created. The time shown is in HH:00 format, and in Coordinated Universal Time (UTC). The snapshot is automatically created between the time shown and up to 45 minutes after.
     */
    nextSnapshotTimeOfDay?: TimeOfDay;
  }
  export type AddOnList = AddOn[];
  export interface AddOnRequest {
    /**
     * The add-on type.
     */
    addOnType: AddOnType;
    /**
     * An object that represents additional parameters when enabling or modifying the automatic snapshot add-on.
     */
    autoSnapshotAddOnRequest?: AutoSnapshotAddOnRequest;
  }
  export type AddOnRequestList = AddOnRequest[];
  export type AddOnType = "AutoSnapshot"|string;
  export interface Alarm {
    /**
     * The name of the alarm.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the alarm.
     */
    arn?: NonEmptyString;
    /**
     * The timestamp when the alarm was created.
     */
    createdAt?: IsoDate;
    /**
     * An object that lists information about the location of the alarm.
     */
    location?: ResourceLocation;
    /**
     * The Lightsail resource type (e.g., Alarm).
     */
    resourceType?: ResourceType;
    /**
     * The support code. Include this code in your email to support when you have questions about your Lightsail alarm. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * An object that lists information about the resource monitored by the alarm.
     */
    monitoredResourceInfo?: MonitoredResourceInfo;
    /**
     * The arithmetic operation used when comparing the specified statistic and threshold.
     */
    comparisonOperator?: ComparisonOperator;
    /**
     * The number of periods over which data is compared to the specified threshold.
     */
    evaluationPeriods?: integer;
    /**
     * The period, in seconds, over which the statistic is applied.
     */
    period?: MetricPeriod;
    /**
     * The value against which the specified statistic is compared.
     */
    threshold?: double;
    /**
     * The number of data points that must not within the specified threshold to trigger the alarm.
     */
    datapointsToAlarm?: integer;
    /**
     * Specifies how the alarm handles missing data points. An alarm can treat missing data in the following ways:    breaching - Assume the missing data is not within the threshold. Missing data counts towards the number of times the metric is not within the threshold.    notBreaching - Assume the missing data is within the threshold. Missing data does not count towards the number of times the metric is not within the threshold.    ignore - Ignore the missing data. Maintains the current alarm state.    missing - Missing data is treated as missing.  
     */
    treatMissingData?: TreatMissingData;
    /**
     * The statistic for the metric associated with the alarm. The following statistics are available:    Minimum - The lowest value observed during the specified period. Use this value to determine low volumes of activity for your application.    Maximum - The highest value observed during the specified period. Use this value to determine high volumes of activity for your application.    Sum - All values submitted for the matching metric added together. You can use this statistic to determine the total volume of a metric.    Average - The value of Sum / SampleCount during the specified period. By comparing this statistic with the Minimum and Maximum values, you can determine the full scope of a metric and how close the average use is to the Minimum and Maximum values. This comparison helps you to know when to increase or decrease your resources.    SampleCount - The count, or number, of data points used for the statistical calculation.  
     */
    statistic?: MetricStatistic;
    /**
     * The name of the metric associated with the alarm.
     */
    metricName?: MetricName;
    /**
     * The current state of the alarm. An alarm has the following possible states:    ALARM - The metric is outside of the defined threshold.    INSUFFICIENT_DATA - The alarm has just started, the metric is not available, or not enough data is available for the metric to determine the alarm state.    OK - The metric is within the defined threshold.  
     */
    state?: AlarmState;
    /**
     * The unit of the metric associated with the alarm.
     */
    unit?: MetricUnit;
    /**
     * The contact protocols for the alarm, such as Email, SMS (text messaging), or both.
     */
    contactProtocols?: ContactProtocolsList;
    /**
     * The alarm states that trigger a notification.
     */
    notificationTriggers?: NotificationTriggerList;
    /**
     * Indicates whether the alarm is enabled.
     */
    notificationEnabled?: boolean;
  }
  export type AlarmState = "OK"|"ALARM"|"INSUFFICIENT_DATA"|string;
  export type AlarmsList = Alarm[];
  export interface AllocateStaticIpRequest {
    /**
     * The name of the static IP address.
     */
    staticIpName: ResourceName;
  }
  export interface AllocateStaticIpResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface AttachCertificateToDistributionRequest {
    /**
     * The name of the distribution that the certificate will be attached to. Use the GetDistributions action to get a list of distribution names that you can specify.
     */
    distributionName: ResourceName;
    /**
     * The name of the certificate to attach to a distribution. Only certificates with a status of ISSUED can be attached to a distribution. Use the GetCertificates action to get a list of certificate names that you can specify.  This is the name of the certificate resource type and is used only to reference the certificate in other API actions. It can be different than the domain name of the certificate. For example, your certificate name might be WordPress-Blog-Certificate and the domain name of the certificate might be example.com. 
     */
    certificateName: ResourceName;
  }
  export interface AttachCertificateToDistributionResult {
    /**
     * An object that describes the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface AttachDiskRequest {
    /**
     * The unique Lightsail disk name (e.g., my-disk).
     */
    diskName: ResourceName;
    /**
     * The name of the Lightsail instance where you want to utilize the storage disk.
     */
    instanceName: ResourceName;
    /**
     * The disk path to expose to the instance (e.g., /dev/xvdf).
     */
    diskPath: NonEmptyString;
  }
  export interface AttachDiskResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface AttachInstancesToLoadBalancerRequest {
    /**
     * The name of the load balancer.
     */
    loadBalancerName: ResourceName;
    /**
     * An array of strings representing the instance name(s) you want to attach to your load balancer. An instance must be running before you can attach it to your load balancer. There are no additional limits on the number of instances you can attach to your load balancer, aside from the limit of Lightsail instances you can create in your account (20).
     */
    instanceNames: ResourceNameList;
  }
  export interface AttachInstancesToLoadBalancerResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface AttachLoadBalancerTlsCertificateRequest {
    /**
     * The name of the load balancer to which you want to associate the SSL/TLS certificate.
     */
    loadBalancerName: ResourceName;
    /**
     * The name of your SSL/TLS certificate.
     */
    certificateName: ResourceName;
  }
  export interface AttachLoadBalancerTlsCertificateResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request. These SSL/TLS certificates are only usable by Lightsail load balancers. You can't get the certificate and use it for another purpose.
     */
    operations?: OperationList;
  }
  export interface AttachStaticIpRequest {
    /**
     * The name of the static IP.
     */
    staticIpName: ResourceName;
    /**
     * The instance name to which you want to attach the static IP address.
     */
    instanceName: ResourceName;
  }
  export interface AttachStaticIpResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface AttachedDisk {
    /**
     * The path of the disk (e.g., /dev/xvdf).
     */
    path?: string;
    /**
     * The size of the disk in GB.
     */
    sizeInGb?: integer;
  }
  export type AttachedDiskList = AttachedDisk[];
  export type AttachedDiskMap = {[key: string]: DiskMapList};
  export interface AutoSnapshotAddOnRequest {
    /**
     * The daily time when an automatic snapshot will be created. Constraints:   Must be in HH:00 format, and in an hourly increment.   Specified in Coordinated Universal Time (UTC).   The snapshot will be automatically created between the time specified and up to 45 minutes after.  
     */
    snapshotTimeOfDay?: TimeOfDay;
  }
  export type AutoSnapshotDate = string;
  export interface AutoSnapshotDetails {
    /**
     * The date of the automatic snapshot in YYYY-MM-DD format.
     */
    date?: string;
    /**
     * The timestamp when the automatic snapshot was created.
     */
    createdAt?: IsoDate;
    /**
     * The status of the automatic snapshot.
     */
    status?: AutoSnapshotStatus;
    /**
     * An array of objects that describe the block storage disks attached to the instance when the automatic snapshot was created.
     */
    fromAttachedDisks?: AttachedDiskList;
  }
  export type AutoSnapshotDetailsList = AutoSnapshotDetails[];
  export type AutoSnapshotStatus = "Success"|"Failed"|"InProgress"|"NotFound"|string;
  export interface AvailabilityZone {
    /**
     * The name of the Availability Zone. The format is us-east-2a (case-sensitive).
     */
    zoneName?: NonEmptyString;
    /**
     * The state of the Availability Zone.
     */
    state?: NonEmptyString;
  }
  export type AvailabilityZoneList = AvailabilityZone[];
  export type Base64 = string;
  export type BehaviorEnum = "dont-cache"|"cache"|string;
  export interface Blueprint {
    /**
     * The ID for the virtual private server image (e.g., app_wordpress_4_4 or app_lamp_7_0).
     */
    blueprintId?: NonEmptyString;
    /**
     * The friendly name of the blueprint (e.g., Amazon Linux).
     */
    name?: ResourceName;
    /**
     * The group name of the blueprint (e.g., amazon-linux).
     */
    group?: NonEmptyString;
    /**
     * The type of the blueprint (e.g., os or app).
     */
    type?: BlueprintType;
    /**
     * The description of the blueprint.
     */
    description?: string;
    /**
     * A Boolean value indicating whether the blueprint is active. Inactive blueprints are listed to support customers with existing instances but are not necessarily available for launch of new instances. Blueprints are marked inactive when they become outdated due to operating system updates or new application releases.
     */
    isActive?: boolean;
    /**
     * The minimum bundle power required to run this blueprint. For example, you need a bundle with a power value of 500 or more to create an instance that uses a blueprint with a minimum power value of 500. 0 indicates that the blueprint runs on all instance sizes. 
     */
    minPower?: integer;
    /**
     * The version number of the operating system, application, or stack (e.g., 2016.03.0).
     */
    version?: string;
    /**
     * The version code.
     */
    versionCode?: string;
    /**
     * The product URL to learn more about the image or blueprint.
     */
    productUrl?: string;
    /**
     * The end-user license agreement URL for the image or blueprint.
     */
    licenseUrl?: string;
    /**
     * The operating system platform (either Linux/Unix-based or Windows Server-based) of the blueprint.
     */
    platform?: InstancePlatform;
  }
  export type BlueprintList = Blueprint[];
  export type BlueprintType = "os"|"app"|string;
  export interface Bucket {
    /**
     * The Lightsail resource type of the bucket (for example, Bucket).
     */
    resourceType?: NonEmptyString;
    /**
     * An object that describes the access rules of the bucket.
     */
    accessRules?: AccessRules;
    /**
     * The Amazon Resource Name (ARN) of the bucket.
     */
    arn?: NonEmptyString;
    /**
     * The ID of the bundle currently applied to the bucket. A bucket bundle specifies the monthly cost, storage space, and data transfer quota for a bucket. Use the UpdateBucketBundle action to change the bundle of a bucket.
     */
    bundleId?: NonEmptyString;
    /**
     * The timestamp when the distribution was created.
     */
    createdAt?: IsoDate;
    /**
     * The URL of the bucket.
     */
    url?: NonEmptyString;
    location?: ResourceLocation;
    /**
     * The name of the bucket.
     */
    name?: BucketName;
    /**
     * The support code for a bucket. Include this code in your email to support when you have questions about a Lightsail bucket. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: NonEmptyString;
    /**
     * The tag keys and optional values for the bucket. For more information, see Tags in Amazon Lightsail in the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * Indicates whether object versioning is enabled for the bucket. The following options can be configured:    Enabled - Object versioning is enabled.    Suspended - Object versioning was previously enabled but is currently suspended. Existing object versions are retained.    NeverEnabled - Object versioning has never been enabled.  
     */
    objectVersioning?: NonEmptyString;
    /**
     * Indicates whether the bundle that is currently applied to a bucket can be changed to another bundle. You can update a bucket's bundle only one time within a monthly AWS billing cycle. Use the UpdateBucketBundle action to change a bucket's bundle.
     */
    ableToUpdateBundle?: boolean;
    /**
     * An array of strings that specify the AWS account IDs that have read-only access to the bucket.
     */
    readonlyAccessAccounts?: PartnerIdList;
    /**
     * An array of objects that describe Lightsail instances that have access to the bucket. Use the SetResourceAccessForBucket action to update the instances that have access to a bucket.
     */
    resourcesReceivingAccess?: AccessReceiverList;
    /**
     * An object that describes the state of the bucket.
     */
    state?: BucketState;
  }
  export interface BucketBundle {
    /**
     * The ID of the bundle.
     */
    bundleId?: NonEmptyString;
    /**
     * The name of the bundle.
     */
    name?: NonEmptyString;
    /**
     * The monthly price of the bundle, in US dollars.
     */
    price?: float;
    /**
     * The storage size of the bundle, in GB.
     */
    storagePerMonthInGb?: integer;
    /**
     * The monthly network transfer quota of the bundle.
     */
    transferPerMonthInGb?: integer;
    /**
     * Indicates whether the bundle is active. Use for a new or existing bucket.
     */
    isActive?: boolean;
  }
  export type BucketBundleList = BucketBundle[];
  export type BucketList = Bucket[];
  export type BucketMetricName = "BucketSizeBytes"|"NumberOfObjects"|string;
  export type BucketName = string;
  export interface BucketState {
    /**
     * The state code of the bucket. The following codes are possible:    OK - The bucket is in a running state.    Unknown - Creation of the bucket might have timed-out. You might want to delete the bucket and create a new one.  
     */
    code?: NonEmptyString;
    /**
     * A message that describes the state of the bucket.
     */
    message?: string;
  }
  export interface Bundle {
    /**
     * The price in US dollars (e.g., 5.0) of the bundle.
     */
    price?: float;
    /**
     * The number of vCPUs included in the bundle (e.g., 2).
     */
    cpuCount?: integer;
    /**
     * The size of the SSD (e.g., 30).
     */
    diskSizeInGb?: integer;
    /**
     * The bundle ID (e.g., micro_1_0).
     */
    bundleId?: NonEmptyString;
    /**
     * The Amazon EC2 instance type (e.g., t2.micro).
     */
    instanceType?: string;
    /**
     * A Boolean value indicating whether the bundle is active.
     */
    isActive?: boolean;
    /**
     * A friendly name for the bundle (e.g., Micro).
     */
    name?: string;
    /**
     * A numeric value that represents the power of the bundle (e.g., 500). You can use the bundle's power value in conjunction with a blueprint's minimum power value to determine whether the blueprint will run on the bundle. For example, you need a bundle with a power value of 500 or more to create an instance that uses a blueprint with a minimum power value of 500.
     */
    power?: integer;
    /**
     * The amount of RAM in GB (e.g., 2.0).
     */
    ramSizeInGb?: float;
    /**
     * The data transfer rate per month in GB (e.g., 2000).
     */
    transferPerMonthInGb?: integer;
    /**
     * The operating system platform (Linux/Unix-based or Windows Server-based) that the bundle supports. You can only launch a WINDOWS bundle on a blueprint that supports the WINDOWS platform. LINUX_UNIX blueprints require a LINUX_UNIX bundle.
     */
    supportedPlatforms?: InstancePlatformList;
  }
  export type BundleList = Bundle[];
  export interface CacheBehavior {
    /**
     * The cache behavior of the distribution. The following cache behaviors can be specified:     cache  - This option is best for static sites. When specified, your distribution caches and serves your entire website as static content. This behavior is ideal for websites with static content that doesn't change depending on who views it, or for websites that don't use cookies, headers, or query strings to personalize content.     dont-cache  - This option is best for sites that serve a mix of static and dynamic content. When specified, your distribution caches and serve only the content that is specified in the distribution's CacheBehaviorPerPath parameter. This behavior is ideal for websites or web applications that use cookies, headers, and query strings to personalize content for individual users.  
     */
    behavior?: BehaviorEnum;
  }
  export type CacheBehaviorList = CacheBehaviorPerPath[];
  export interface CacheBehaviorPerPath {
    /**
     * The path to a directory or file to cached, or not cache. Use an asterisk symbol to specify wildcard directories (path/to/assets/*), and file types (*.html, *jpg, *js). Directories and file paths are case-sensitive. Examples:   Specify the following to cache all files in the document root of an Apache web server running on a Lightsail instance.  var/www/html/    Specify the following file to cache only the index page in the document root of an Apache web server.  var/www/html/index.html    Specify the following to cache only the .html files in the document root of an Apache web server.  var/www/html/*.html    Specify the following to cache only the .jpg, .png, and .gif files in the images sub-directory of the document root of an Apache web server.  var/www/html/images/*.jpg   var/www/html/images/*.png   var/www/html/images/*.gif  Specify the following to cache all files in the images sub-directory of the document root of an Apache web server.  var/www/html/images/   
     */
    path?: string;
    /**
     * The cache behavior for the specified path. You can specify one of the following per-path cache behaviors:     cache  - This behavior caches the specified path.      dont-cache  - This behavior doesn't cache the specified path.   
     */
    behavior?: BehaviorEnum;
  }
  export interface CacheSettings {
    /**
     * The default amount of time that objects stay in the distribution's cache before the distribution forwards another request to the origin to determine whether the content has been updated.  The value specified applies only when the origin does not add HTTP headers such as Cache-Control max-age, Cache-Control s-maxage, and Expires to objects. 
     */
    defaultTTL?: long;
    /**
     * The minimum amount of time that objects stay in the distribution's cache before the distribution forwards another request to the origin to determine whether the object has been updated. A value of 0 must be specified for minimumTTL if the distribution is configured to forward all headers to the origin.
     */
    minimumTTL?: long;
    /**
     * The maximum amount of time that objects stay in the distribution's cache before the distribution forwards another request to the origin to determine whether the object has been updated. The value specified applies only when the origin adds HTTP headers such as Cache-Control max-age, Cache-Control s-maxage, and Expires to objects.
     */
    maximumTTL?: long;
    /**
     * The HTTP methods that are processed and forwarded to the distribution's origin. You can specify the following options:    GET,HEAD - The distribution forwards the GET and HEAD methods.    GET,HEAD,OPTIONS - The distribution forwards the GET, HEAD, and OPTIONS methods.    GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE - The distribution forwards the GET, HEAD, OPTIONS, PUT, PATCH, POST, and DELETE methods.   If you specify the third option, you might need to restrict access to your distribution's origin so users can't perform operations that you don't want them to. For example, you might not want users to have permission to delete objects from your origin.
     */
    allowedHTTPMethods?: NonEmptyString;
    /**
     * The HTTP method responses that are cached by your distribution. You can specify the following options:    GET,HEAD - The distribution caches responses to the GET and HEAD methods.    GET,HEAD,OPTIONS - The distribution caches responses to the GET, HEAD, and OPTIONS methods.  
     */
    cachedHTTPMethods?: NonEmptyString;
    /**
     * An object that describes the cookies that are forwarded to the origin. Your content is cached based on the cookies that are forwarded.
     */
    forwardedCookies?: CookieObject;
    /**
     * An object that describes the headers that are forwarded to the origin. Your content is cached based on the headers that are forwarded.
     */
    forwardedHeaders?: HeaderObject;
    /**
     * An object that describes the query strings that are forwarded to the origin. Your content is cached based on the query strings that are forwarded.
     */
    forwardedQueryStrings?: QueryStringObject;
  }
  export interface Certificate {
    /**
     * The Amazon Resource Name (ARN) of the certificate.
     */
    arn?: NonEmptyString;
    /**
     * The name of the certificate (e.g., my-certificate).
     */
    name?: CertificateName;
    /**
     * The domain name of the certificate.
     */
    domainName?: DomainName;
    /**
     * The validation status of the certificate.
     */
    status?: CertificateStatus;
    /**
     * The serial number of the certificate.
     */
    serialNumber?: SerialNumber;
    /**
     * An array of strings that specify the alternate domains (e.g., example2.com) and subdomains (e.g., blog.example.com) of the certificate.
     */
    subjectAlternativeNames?: SubjectAlternativeNameList;
    /**
     * An array of objects that describe the domain validation records of the certificate.
     */
    domainValidationRecords?: DomainValidationRecordList;
    /**
     * The validation failure reason, if any, of the certificate. The following failure reasons are possible:     NO_AVAILABLE_CONTACTS  - This failure applies to email validation, which is not available for Lightsail certificates.     ADDITIONAL_VERIFICATION_REQUIRED  - Lightsail requires additional information to process this certificate request. This can happen as a fraud-protection measure, such as when the domain ranks within the Alexa top 1000 websites. To provide the required information, use the AWS Support Center to contact AWS Support.  You cannot request a certificate for Amazon-owned domain names such as those ending in amazonaws.com, cloudfront.net, or elasticbeanstalk.com.      DOMAIN_NOT_ALLOWED  - One or more of the domain names in the certificate request was reported as an unsafe domain by VirusTotal. To correct the problem, search for your domain name on the VirusTotal website. If your domain is reported as suspicious, see Google Help for Hacked Websites to learn what you can do. If you believe that the result is a false positive, notify the organization that is reporting the domain. VirusTotal is an aggregate of several antivirus and URL scanners and cannot remove your domain from a block list itself. After you correct the problem and the VirusTotal registry has been updated, request a new certificate. If you see this error and your domain is not included in the VirusTotal list, visit the AWS Support Center and create a case.     INVALID_PUBLIC_DOMAIN  - One or more of the domain names in the certificate request is not valid. Typically, this is because a domain name in the request is not a valid top-level domain. Try to request a certificate again, correcting any spelling errors or typos that were in the failed request, and ensure that all domain names in the request are for valid top-level domains. For example, you cannot request a certificate for example.invalidpublicdomain because invalidpublicdomain is not a valid top-level domain.     OTHER  - Typically, this failure occurs when there is a typographical error in one or more of the domain names in the certificate request. Try to request a certificate again, correcting any spelling errors or typos that were in the failed request.   
     */
    requestFailureReason?: RequestFailureReason;
    /**
     * The number of Lightsail resources that the certificate is attached to.
     */
    inUseResourceCount?: InUseResourceCount;
    /**
     * The algorithm used to generate the key pair (the public and private key) of the certificate.
     */
    keyAlgorithm?: KeyAlgorithm;
    /**
     * The timestamp when the certificate was created.
     */
    createdAt?: IsoDate;
    /**
     * The timestamp when the certificate was issued.
     */
    issuedAt?: IsoDate;
    /**
     * The certificate authority that issued the certificate.
     */
    issuerCA?: IssuerCA;
    /**
     * The timestamp when the certificate is first valid.
     */
    notBefore?: IsoDate;
    /**
     * The timestamp when the certificate expires.
     */
    notAfter?: IsoDate;
    /**
     * The renewal eligibility of the certificate.
     */
    eligibleToRenew?: EligibleToRenew;
    /**
     * An object that describes the status of the certificate renewal managed by Lightsail.
     */
    renewalSummary?: RenewalSummary;
    /**
     * The timestamp when the certificate was revoked. This value is present only when the certificate status is REVOKED.
     */
    revokedAt?: IsoDate;
    /**
     * The reason the certificate was revoked. This value is present only when the certificate status is REVOKED.
     */
    revocationReason?: RevocationReason;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The support code. Include this code in your email to support when you have questions about your Lightsail certificate. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
  }
  export type CertificateName = string;
  export type CertificateStatus = "PENDING_VALIDATION"|"ISSUED"|"INACTIVE"|"EXPIRED"|"VALIDATION_TIMED_OUT"|"REVOKED"|"FAILED"|string;
  export type CertificateStatusList = CertificateStatus[];
  export interface CertificateSummary {
    /**
     * The Amazon Resource Name (ARN) of the certificate.
     */
    certificateArn?: NonEmptyString;
    /**
     * The name of the certificate.
     */
    certificateName?: CertificateName;
    /**
     * The domain name of the certificate.
     */
    domainName?: DomainName;
    /**
     * An object that describes a certificate in detail.
     */
    certificateDetail?: Certificate;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
  }
  export type CertificateSummaryList = CertificateSummary[];
  export interface CloseInstancePublicPortsRequest {
    /**
     * An object to describe the ports to close for the specified instance.
     */
    portInfo: PortInfo;
    /**
     * The name of the instance for which to close ports.
     */
    instanceName: ResourceName;
  }
  export interface CloseInstancePublicPortsResult {
    /**
     * An object that describes the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface CloudFormationStackRecord {
    /**
     * The name of the CloudFormation stack record. It starts with CloudFormationStackRecord followed by a GUID.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the CloudFormation stack record.
     */
    arn?: NonEmptyString;
    /**
     * The date when the CloudFormation stack record was created.
     */
    createdAt?: IsoDate;
    /**
     * A list of objects describing the Availability Zone and AWS Region of the CloudFormation stack record.
     */
    location?: ResourceLocation;
    /**
     * The Lightsail resource type (e.g., CloudFormationStackRecord).
     */
    resourceType?: ResourceType;
    /**
     * The current state of the CloudFormation stack record.
     */
    state?: RecordState;
    /**
     * A list of objects describing the source of the CloudFormation stack record.
     */
    sourceInfo?: CloudFormationStackRecordSourceInfoList;
    /**
     * A list of objects describing the destination service, which is AWS CloudFormation, and the Amazon Resource Name (ARN) of the AWS CloudFormation stack.
     */
    destinationInfo?: DestinationInfo;
  }
  export type CloudFormationStackRecordList = CloudFormationStackRecord[];
  export interface CloudFormationStackRecordSourceInfo {
    /**
     * The Lightsail resource type (e.g., ExportSnapshotRecord).
     */
    resourceType?: CloudFormationStackRecordSourceType;
    /**
     * The name of the record.
     */
    name?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the export snapshot record.
     */
    arn?: NonEmptyString;
  }
  export type CloudFormationStackRecordSourceInfoList = CloudFormationStackRecordSourceInfo[];
  export type CloudFormationStackRecordSourceType = "ExportSnapshotRecord"|string;
  export type ComparisonOperator = "GreaterThanOrEqualToThreshold"|"GreaterThanThreshold"|"LessThanThreshold"|"LessThanOrEqualToThreshold"|string;
  export interface ContactMethod {
    /**
     * The destination of the contact method, such as an email address or a mobile phone number.
     */
    contactEndpoint?: NonEmptyString;
    /**
     * The current status of the contact method. A contact method has the following possible status:    PendingVerification - The contact method has not yet been verified, and the verification has not yet expired.    Valid - The contact method has been verified.    InValid - An attempt was made to verify the contact method, but the verification has expired.  
     */
    status?: ContactMethodStatus;
    /**
     * The protocol of the contact method, such as email or SMS (text messaging).
     */
    protocol?: ContactProtocol;
    /**
     * The name of the contact method.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the contact method.
     */
    arn?: NonEmptyString;
    /**
     * The timestamp when the contact method was created.
     */
    createdAt?: IsoDate;
    location?: ResourceLocation;
    /**
     * The Lightsail resource type (e.g., ContactMethod).
     */
    resourceType?: ResourceType;
    /**
     * The support code. Include this code in your email to support when you have questions about your Lightsail contact method. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
  }
  export type ContactMethodStatus = "PendingVerification"|"Valid"|"Invalid"|string;
  export type ContactMethodVerificationProtocol = "Email"|string;
  export type ContactMethodsList = ContactMethod[];
  export type ContactProtocol = "Email"|"SMS"|string;
  export type ContactProtocolsList = ContactProtocol[];
  export interface Container {
    /**
     * The name of the image used for the container. Container images sourced from your Lightsail container service, that are registered and stored on your service, start with a colon (:). For example, :container-service-1.mystaticwebsite.1. Container images sourced from a public registry like Docker Hub don't start with a colon. For example, nginx:latest or nginx.
     */
    image?: string;
    /**
     * The launch command for the container.
     */
    command?: StringList;
    /**
     * The environment variables of the container.
     */
    environment?: Environment;
    /**
     * The open firewall ports of the container.
     */
    ports?: PortMap;
  }
  export interface ContainerImage {
    /**
     * The name of the container image.
     */
    image?: string;
    /**
     * The digest of the container image.
     */
    digest?: string;
    /**
     * The timestamp when the container image was created.
     */
    createdAt?: IsoDate;
  }
  export type ContainerImageList = ContainerImage[];
  export type ContainerLabel = string;
  export type ContainerMap = {[key: string]: Container};
  export type ContainerName = string;
  export interface ContainerService {
    /**
     * The name of the container service.
     */
    containerServiceName?: ContainerServiceName;
    /**
     * The Amazon Resource Name (ARN) of the container service.
     */
    arn?: NonEmptyString;
    /**
     * The timestamp when the container service was created.
     */
    createdAt?: IsoDate;
    /**
     * An object that describes the location of the container service, such as the AWS Region and Availability Zone.
     */
    location?: ResourceLocation;
    /**
     * The Lightsail resource type of the container service (i.e., ContainerService).
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The power specification of the container service. The power specifies the amount of RAM, the number of vCPUs, and the base price of the container service.
     */
    power?: ContainerServicePowerName;
    /**
     * The ID of the power of the container service.
     */
    powerId?: string;
    /**
     * The current state of the container service. The following container service states are possible:    PENDING - The container service is being created.    READY - The container service is running but it does not have an active container deployment.    DEPLOYING - The container service is launching a container deployment.    RUNNING - The container service is running and it has an active container deployment.    UPDATING - The container service capacity or its custom domains are being updated.    DELETING - The container service is being deleted.    DISABLED - The container service is disabled, and its active deployment and containers, if any, are shut down.  
     */
    state?: ContainerServiceState;
    /**
     * An object that describes the current state of the container service.  The state detail is populated only when a container service is in a PENDING, DEPLOYING, or UPDATING state. 
     */
    stateDetail?: ContainerServiceStateDetail;
    /**
     * The scale specification of the container service. The scale specifies the allocated compute nodes of the container service.
     */
    scale?: ContainerServiceScale;
    /**
     * An object that describes the current container deployment of the container service.
     */
    currentDeployment?: ContainerServiceDeployment;
    /**
     * An object that describes the next deployment of the container service. This value is null when there is no deployment in a pending state.
     */
    nextDeployment?: ContainerServiceDeployment;
    /**
     * A Boolean value indicating whether the container service is disabled.
     */
    isDisabled?: boolean;
    /**
     * The principal ARN of the container service. The principal ARN can be used to create a trust relationship between your standard AWS account and your Lightsail container service. This allows you to give your service permission to access resources in your standard AWS account.
     */
    principalArn?: string;
    /**
     * The private domain name of the container service. The private domain name is accessible only by other resources within the default virtual private cloud (VPC) of your Lightsail account.
     */
    privateDomainName?: string;
    /**
     * The public domain name of the container service, such as example.com and www.example.com. You can specify up to four public domain names for a container service. The domain names that you specify are used when you create a deployment with a container configured as the public endpoint of your container service. If you don't specify public domain names, then you can use the default domain of the container service.  You must create and validate an SSL/TLS certificate before you can use public domain names with your container service. Use the CreateCertificate action to create a certificate for the public domain names you want to use with your container service.  See CreateContainerService or UpdateContainerService for information about how to specify public domain names for your Lightsail container service.
     */
    publicDomainNames?: ContainerServicePublicDomains;
    /**
     * The publicly accessible URL of the container service. If no public endpoint is specified in the currentDeployment, this URL returns a 404 response.
     */
    url?: string;
  }
  export interface ContainerServiceDeployment {
    /**
     * The version number of the deployment.
     */
    version?: integer;
    /**
     * The state of the deployment. A deployment can be in one of the following states:    Activating - The deployment is being created.    Active - The deployment was successfully created, and it's currently running on the container service. The container service can have only one deployment in an active state at a time.    Inactive - The deployment was previously successfully created, but it is not currently running on the container service.    Failed - The deployment failed. Use the GetContainerLog action to view the log events for the containers in the deployment to try to determine the reason for the failure.  
     */
    state?: ContainerServiceDeploymentState;
    /**
     * An object that describes the configuration for the containers of the deployment.
     */
    containers?: ContainerMap;
    /**
     * An object that describes the endpoint of the deployment.
     */
    publicEndpoint?: ContainerServiceEndpoint;
    /**
     * The timestamp when the deployment was created.
     */
    createdAt?: IsoDate;
  }
  export type ContainerServiceDeploymentList = ContainerServiceDeployment[];
  export interface ContainerServiceDeploymentRequest {
    /**
     * An object that describes the configuration for the containers of the deployment.
     */
    containers?: ContainerMap;
    /**
     * An object that describes the endpoint of the deployment.
     */
    publicEndpoint?: EndpointRequest;
  }
  export type ContainerServiceDeploymentState = "ACTIVATING"|"ACTIVE"|"INACTIVE"|"FAILED"|string;
  export interface ContainerServiceEndpoint {
    /**
     * The name of the container entry of the deployment that the endpoint configuration applies to.
     */
    containerName?: string;
    /**
     * The port of the specified container to which traffic is forwarded to.
     */
    containerPort?: integer;
    /**
     * An object that describes the health check configuration of the container.
     */
    healthCheck?: ContainerServiceHealthCheckConfig;
  }
  export interface ContainerServiceHealthCheckConfig {
    /**
     * The number of consecutive health checks successes required before moving the container to the Healthy state. The default value is 2.
     */
    healthyThreshold?: integer;
    /**
     * The number of consecutive health check failures required before moving the container to the Unhealthy state. The default value is 2.
     */
    unhealthyThreshold?: integer;
    /**
     * The amount of time, in seconds, during which no response means a failed health check. You can specify between 2 and 60 seconds. The default value is 2.
     */
    timeoutSeconds?: integer;
    /**
     * The approximate interval, in seconds, between health checks of an individual container. You can specify between 5 and 300 seconds. The default value is 5.
     */
    intervalSeconds?: integer;
    /**
     * The path on the container on which to perform the health check. The default value is /.
     */
    path?: string;
    /**
     * The HTTP codes to use when checking for a successful response from a container. You can specify values between 200 and 499. You can specify multiple values (for example, 200,202) or a range of values (for example, 200-299).
     */
    successCodes?: string;
  }
  export type ContainerServiceList = ContainerService[];
  export interface ContainerServiceLogEvent {
    /**
     * The timestamp when the container service log event was created.
     */
    createdAt?: IsoDate;
    /**
     * The message of the container service log event.
     */
    message?: string;
  }
  export type ContainerServiceLogEventList = ContainerServiceLogEvent[];
  export type ContainerServiceMetadataEntry = {[key: string]: string};
  export type ContainerServiceMetadataEntryList = ContainerServiceMetadataEntry[];
  export type ContainerServiceMetricName = "CPUUtilization"|"MemoryUtilization"|string;
  export type ContainerServiceName = string;
  export interface ContainerServicePower {
    /**
     * The ID of the power (e.g., nano-1).
     */
    powerId?: string;
    /**
     * The monthly price of the power in USD.
     */
    price?: float;
    /**
     * The number of vCPUs included in the power.
     */
    cpuCount?: float;
    /**
     * The amount of RAM (in GB) of the power.
     */
    ramSizeInGb?: float;
    /**
     * The friendly name of the power (e.g., nano).
     */
    name?: string;
    /**
     * A Boolean value indicating whether the power is active and can be specified for container services.
     */
    isActive?: boolean;
  }
  export type ContainerServicePowerList = ContainerServicePower[];
  export type ContainerServicePowerName = "nano"|"micro"|"small"|"medium"|"large"|"xlarge"|string;
  export type ContainerServiceProtocol = "HTTP"|"HTTPS"|"TCP"|"UDP"|string;
  export type ContainerServicePublicDomains = {[key: string]: ContainerServicePublicDomainsList};
  export type ContainerServicePublicDomainsList = string[];
  export interface ContainerServiceRegistryLogin {
    /**
     * The container service registry username to use to push container images to the container image registry of a Lightsail account.
     */
    username?: string;
    /**
     * The container service registry password to use to push container images to the container image registry of a Lightsail account
     */
    password?: string;
    /**
     * The timestamp of when the container image registry username and password expire. The log in credentials expire 12 hours after they are created, at which point you will need to create a new set of log in credentials using the CreateContainerServiceRegistryLogin action.
     */
    expiresAt?: IsoDate;
    /**
     * The address to use to push container images to the container image registry of a Lightsail account.
     */
    registry?: string;
  }
  export type ContainerServiceScale = number;
  export type ContainerServiceState = "PENDING"|"READY"|"RUNNING"|"UPDATING"|"DELETING"|"DISABLED"|"DEPLOYING"|string;
  export interface ContainerServiceStateDetail {
    /**
     * The state code of the container service. The following state codes are possible:   The following state codes are possible if your container service is in a DEPLOYING or UPDATING state:    CREATING_SYSTEM_RESOURCES - The system resources for your container service are being created.    CREATING_NETWORK_INFRASTRUCTURE - The network infrastructure for your container service are being created.    PROVISIONING_CERTIFICATE - The SSL/TLS certificate for your container service is being created.    PROVISIONING_SERVICE - Your container service is being provisioned.    CREATING_DEPLOYMENT - Your deployment is being created on your container service.    EVALUATING_HEALTH_CHECK - The health of your deployment is being evaluated.    ACTIVATING_DEPLOYMENT - Your deployment is being activated.     The following state codes are possible if your container service is in a PENDING state:    CERTIFICATE_LIMIT_EXCEEDED - The SSL/TLS certificate required for your container service exceeds the maximum number of certificates allowed for your account.    UNKNOWN_ERROR - An error was experienced when your container service was being created.    
     */
    code?: ContainerServiceStateDetailCode;
    /**
     * A message that provides more information for the state code.  The state detail is populated only when a container service is in a PENDING, DEPLOYING, or UPDATING state. 
     */
    message?: string;
  }
  export type ContainerServiceStateDetailCode = "CREATING_SYSTEM_RESOURCES"|"CREATING_NETWORK_INFRASTRUCTURE"|"PROVISIONING_CERTIFICATE"|"PROVISIONING_SERVICE"|"CREATING_DEPLOYMENT"|"EVALUATING_HEALTH_CHECK"|"ACTIVATING_DEPLOYMENT"|"CERTIFICATE_LIMIT_EXCEEDED"|"UNKNOWN_ERROR"|string;
  export interface ContainerServicesListResult {
    /**
     * An array of objects that describe one or more container services.
     */
    containerServices?: ContainerServiceList;
  }
  export interface CookieObject {
    /**
     * Specifies which cookies to forward to the distribution's origin for a cache behavior: all, none, or allow-list to forward only the cookies specified in the cookiesAllowList parameter.
     */
    option?: ForwardValues;
    /**
     * The specific cookies to forward to your distribution's origin.
     */
    cookiesAllowList?: StringList;
  }
  export interface CopySnapshotRequest {
    /**
     * The name of the source manual snapshot to copy. Constraint:   Define this parameter only when copying a manual snapshot as another manual snapshot.  
     */
    sourceSnapshotName?: ResourceName;
    /**
     * The name of the source instance or disk from which the source automatic snapshot was created. Constraint:   Define this parameter only when copying an automatic snapshot as a manual snapshot. For more information, see the Amazon Lightsail Developer Guide.  
     */
    sourceResourceName?: string;
    /**
     * The date of the source automatic snapshot to copy. Use the get auto snapshots operation to identify the dates of the available automatic snapshots. Constraints:   Must be specified in YYYY-MM-DD format.   This parameter cannot be defined together with the use latest restorable auto snapshot parameter. The restore date and use latest restorable auto snapshot parameters are mutually exclusive.   Define this parameter only when copying an automatic snapshot as a manual snapshot. For more information, see the Amazon Lightsail Developer Guide.  
     */
    restoreDate?: string;
    /**
     * A Boolean value to indicate whether to use the latest available automatic snapshot of the specified source instance or disk. Constraints:   This parameter cannot be defined together with the restore date parameter. The use latest restorable auto snapshot and restore date parameters are mutually exclusive.   Define this parameter only when copying an automatic snapshot as a manual snapshot. For more information, see the Amazon Lightsail Developer Guide.  
     */
    useLatestRestorableAutoSnapshot?: boolean;
    /**
     * The name of the new manual snapshot to be created as a copy.
     */
    targetSnapshotName: ResourceName;
    /**
     * The AWS Region where the source manual or automatic snapshot is located.
     */
    sourceRegion: RegionName;
  }
  export interface CopySnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateBucketAccessKeyRequest {
    /**
     * The name of the bucket that the new access key will belong to, and grant access to.
     */
    bucketName: BucketName;
  }
  export interface CreateBucketAccessKeyResult {
    /**
     * An object that describes the access key that is created.
     */
    accessKey?: AccessKey;
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateBucketRequest {
    /**
     * The name for the bucket. For more information about bucket names, see Bucket naming rules in Amazon Lightsail in the Amazon Lightsail Developer Guide.
     */
    bucketName: BucketName;
    /**
     * The ID of the bundle to use for the bucket. A bucket bundle specifies the monthly cost, storage space, and data transfer quota for a bucket. Use the GetBucketBundles action to get a list of bundle IDs that you can specify. Use the UpdateBucketBundle action to change the bundle after the bucket is created.
     */
    bundleId: NonEmptyString;
    /**
     * The tag keys and optional values to add to the bucket during creation. Use the TagResource action to tag the bucket after it's created.
     */
    tags?: TagList;
    /**
     * A Boolean value that indicates whether to enable versioning of objects in the bucket. For more information about versioning, see Enabling and suspending object versioning in a bucket in Amazon Lightsail in the Amazon Lightsail Developer Guide.
     */
    enableObjectVersioning?: boolean;
  }
  export interface CreateBucketResult {
    /**
     * An object that describes the bucket that is created.
     */
    bucket?: Bucket;
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateCertificateRequest {
    /**
     * The name for the certificate.
     */
    certificateName: CertificateName;
    /**
     * The domain name (e.g., example.com) for the certificate.
     */
    domainName: DomainName;
    /**
     * An array of strings that specify the alternate domains (e.g., example2.com) and subdomains (e.g., blog.example.com) for the certificate. You can specify a maximum of nine alternate domains (in addition to the primary domain name). Wildcard domain entries (e.g., *.example.com) are not supported.
     */
    subjectAlternativeNames?: SubjectAlternativeNameList;
    /**
     * The tag keys and optional values to add to the certificate during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
  }
  export interface CreateCertificateResult {
    /**
     * An object that describes the certificate created.
     */
    certificate?: CertificateSummary;
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateCloudFormationStackRequest {
    /**
     * An array of parameters that will be used to create the new Amazon EC2 instance. You can only pass one instance entry at a time in this array. You will get an invalid parameter error if you pass more than one instance entry in this array.
     */
    instances: InstanceEntryList;
  }
  export interface CreateCloudFormationStackResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateContactMethodRequest {
    /**
     * The protocol of the contact method, such as Email or SMS (text messaging). The SMS protocol is supported only in the following AWS Regions.   US East (N. Virginia) (us-east-1)   US West (Oregon) (us-west-2)   Europe (Ireland) (eu-west-1)   Asia Pacific (Tokyo) (ap-northeast-1)   Asia Pacific (Singapore) (ap-southeast-1)   Asia Pacific (Sydney) (ap-southeast-2)   For a list of countries/regions where SMS text messages can be sent, and the latest AWS Regions where SMS text messaging is supported, see Supported Regions and Countries in the Amazon SNS Developer Guide. For more information about notifications in Amazon Lightsail, see Notifications in Amazon Lightsail.
     */
    protocol: ContactProtocol;
    /**
     * The destination of the contact method, such as an email address or a mobile phone number. Use the E.164 format when specifying a mobile phone number. E.164 is a standard for the phone number structure used for international telecommunication. Phone numbers that follow this format can have a maximum of 15 digits, and they are prefixed with the plus character (+) and the country code. For example, a U.S. phone number in E.164 format would be specified as +1XXX5550100. For more information, see E.164 on Wikipedia.
     */
    contactEndpoint: StringMax256;
  }
  export interface CreateContactMethodResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateContainerServiceDeploymentRequest {
    /**
     * The name of the container service for which to create the deployment.
     */
    serviceName: ContainerServiceName;
    /**
     * An object that describes the settings of the containers that will be launched on the container service.
     */
    containers?: ContainerMap;
    /**
     * An object that describes the settings of the public endpoint for the container service.
     */
    publicEndpoint?: EndpointRequest;
  }
  export interface CreateContainerServiceDeploymentResult {
    /**
     * An object that describes a container service.
     */
    containerService?: ContainerService;
  }
  export interface CreateContainerServiceRegistryLoginRequest {
  }
  export interface CreateContainerServiceRegistryLoginResult {
    /**
     * An object that describes the log in information for the container service registry of your Lightsail account.
     */
    registryLogin?: ContainerServiceRegistryLogin;
  }
  export interface CreateContainerServiceRequest {
    /**
     * The name for the container service. The name that you specify for your container service will make up part of its default domain. The default domain of a container service is typically https://&lt;ServiceName&gt;.&lt;RandomGUID&gt;.&lt;AWSRegion&gt;.cs.amazonlightsail.com. If the name of your container service is container-service-1, and it's located in the US East (Ohio) AWS region (us-east-2), then the domain for your container service will be like the following example: https://container-service-1.ur4EXAMPLE2uq.us-east-2.cs.amazonlightsail.com  The following are the requirements for container service names:   Must be unique within each AWS Region in your Lightsail account.   Must contain 1 to 63 characters.   Must contain only alphanumeric characters and hyphens.   A hyphen (-) can separate words but cannot be at the start or end of the name.  
     */
    serviceName: ContainerServiceName;
    /**
     * The power specification for the container service. The power specifies the amount of memory, vCPUs, and base monthly cost of each node of the container service. The power and scale of a container service makes up its configured capacity. To determine the monthly price of your container service, multiply the base price of the power with the scale (the number of nodes) of the service. Use the GetContainerServicePowers action to get a list of power options that you can specify using this parameter, and their base monthly cost.
     */
    power: ContainerServicePowerName;
    /**
     * The scale specification for the container service. The scale specifies the allocated compute nodes of the container service. The power and scale of a container service makes up its configured capacity. To determine the monthly price of your container service, multiply the base price of the power with the scale (the number of nodes) of the service.
     */
    scale: ContainerServiceScale;
    /**
     * The tag keys and optional values to add to the certificate during create. Use the TagResource action to tag a resource after it's created. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The public domain names to use with the container service, such as example.com and www.example.com. You can specify up to four public domain names for a container service. The domain names that you specify are used when you create a deployment with a container configured as the public endpoint of your container service. If you don't specify public domain names, then you can use the default domain of the container service.  You must create and validate an SSL/TLS certificate before you can use public domain names with your container service. Use the CreateCertificate action to create a certificate for the public domain names you want to use with your container service.  You can specify public domain names using a string to array map as shown in the example later on this page.
     */
    publicDomainNames?: ContainerServicePublicDomains;
    /**
     * An object that describes a deployment for the container service. A deployment specifies the containers that will be launched on the container service and their settings, such as the ports to open, the environment variables to apply, and the launch command to run. It also specifies the container that will serve as the public endpoint of the deployment and its settings, such as the HTTP or HTTPS port to use, and the health check configuration.
     */
    deployment?: ContainerServiceDeploymentRequest;
  }
  export interface CreateContainerServiceResult {
    /**
     * An object that describes a container service.
     */
    containerService?: ContainerService;
  }
  export interface CreateDiskFromSnapshotRequest {
    /**
     * The unique Lightsail disk name (e.g., my-disk).
     */
    diskName: ResourceName;
    /**
     * The name of the disk snapshot (e.g., my-snapshot) from which to create the new storage disk. Constraint:   This parameter cannot be defined together with the source disk name parameter. The disk snapshot name and source disk name parameters are mutually exclusive.  
     */
    diskSnapshotName?: ResourceName;
    /**
     * The Availability Zone where you want to create the disk (e.g., us-east-2a). Choose the same Availability Zone as the Lightsail instance where you want to create the disk. Use the GetRegions operation to list the Availability Zones where Lightsail is currently available.
     */
    availabilityZone: NonEmptyString;
    /**
     * The size of the disk in GB (e.g., 32).
     */
    sizeInGb: integer;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
    /**
     * An array of objects that represent the add-ons to enable for the new disk.
     */
    addOns?: AddOnRequestList;
    /**
     * The name of the source disk from which the source automatic snapshot was created. Constraints:   This parameter cannot be defined together with the disk snapshot name parameter. The source disk name and disk snapshot name parameters are mutually exclusive.   Define this parameter only when creating a new disk from an automatic snapshot. For more information, see the Amazon Lightsail Developer Guide.  
     */
    sourceDiskName?: string;
    /**
     * The date of the automatic snapshot to use for the new disk. Use the get auto snapshots operation to identify the dates of the available automatic snapshots. Constraints:   Must be specified in YYYY-MM-DD format.   This parameter cannot be defined together with the use latest restorable auto snapshot parameter. The restore date and use latest restorable auto snapshot parameters are mutually exclusive.   Define this parameter only when creating a new disk from an automatic snapshot. For more information, see the Amazon Lightsail Developer Guide.  
     */
    restoreDate?: string;
    /**
     * A Boolean value to indicate whether to use the latest available automatic snapshot. Constraints:   This parameter cannot be defined together with the restore date parameter. The use latest restorable auto snapshot and restore date parameters are mutually exclusive.   Define this parameter only when creating a new disk from an automatic snapshot. For more information, see the Amazon Lightsail Developer Guide.  
     */
    useLatestRestorableAutoSnapshot?: boolean;
  }
  export interface CreateDiskFromSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateDiskRequest {
    /**
     * The unique Lightsail disk name (e.g., my-disk).
     */
    diskName: ResourceName;
    /**
     * The Availability Zone where you want to create the disk (e.g., us-east-2a). Use the same Availability Zone as the Lightsail instance to which you want to attach the disk. Use the get regions operation to list the Availability Zones where Lightsail is currently available.
     */
    availabilityZone: NonEmptyString;
    /**
     * The size of the disk in GB (e.g., 32).
     */
    sizeInGb: integer;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
    /**
     * An array of objects that represent the add-ons to enable for the new disk.
     */
    addOns?: AddOnRequestList;
  }
  export interface CreateDiskResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateDiskSnapshotRequest {
    /**
     * The unique name of the source disk (e.g., Disk-Virginia-1).  This parameter cannot be defined together with the instance name parameter. The disk name and instance name parameters are mutually exclusive. 
     */
    diskName?: ResourceName;
    /**
     * The name of the destination disk snapshot (e.g., my-disk-snapshot) based on the source disk.
     */
    diskSnapshotName: ResourceName;
    /**
     * The unique name of the source instance (e.g., Amazon_Linux-512MB-Virginia-1). When this is defined, a snapshot of the instance's system volume is created.  This parameter cannot be defined together with the disk name parameter. The instance name and disk name parameters are mutually exclusive. 
     */
    instanceName?: ResourceName;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
  }
  export interface CreateDiskSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateDistributionRequest {
    /**
     * The name for the distribution.
     */
    distributionName: ResourceName;
    /**
     * An object that describes the origin resource for the distribution, such as a Lightsail instance or load balancer. The distribution pulls, caches, and serves content from the origin.
     */
    origin: InputOrigin;
    /**
     * An object that describes the default cache behavior for the distribution.
     */
    defaultCacheBehavior: CacheBehavior;
    /**
     * An object that describes the cache behavior settings for the distribution.
     */
    cacheBehaviorSettings?: CacheSettings;
    /**
     * An array of objects that describe the per-path cache behavior for the distribution.
     */
    cacheBehaviors?: CacheBehaviorList;
    /**
     * The bundle ID to use for the distribution. A distribution bundle describes the specifications of your distribution, such as the monthly cost and monthly network transfer quota. Use the GetDistributionBundles action to get a list of distribution bundle IDs that you can specify.
     */
    bundleId: string;
    /**
     * The IP address type for the distribution. The possible values are ipv4 for IPv4 only, and dualstack for IPv4 and IPv6. The default value is dualstack.
     */
    ipAddressType?: IpAddressType;
    /**
     * The tag keys and optional values to add to the distribution during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
  }
  export interface CreateDistributionResult {
    /**
     * An object that describes the distribution created.
     */
    distribution?: LightsailDistribution;
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface CreateDomainEntryRequest {
    /**
     * The domain name (e.g., example.com) for which you want to create the domain entry.
     */
    domainName: DomainName;
    /**
     * An array of key-value pairs containing information about the domain entry request.
     */
    domainEntry: DomainEntry;
  }
  export interface CreateDomainEntryResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface CreateDomainRequest {
    /**
     * The domain name to manage (e.g., example.com).  You cannot register a new domain name using Lightsail. You must register a domain name using Amazon Route 53 or another domain name registrar. If you have already registered your domain, you can enter its name in this parameter to manage the DNS records for that domain using Lightsail. 
     */
    domainName: DomainName;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
  }
  export interface CreateDomainResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface CreateInstanceSnapshotRequest {
    /**
     * The name for your new snapshot.
     */
    instanceSnapshotName: ResourceName;
    /**
     * The Lightsail instance on which to base your snapshot.
     */
    instanceName: ResourceName;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
  }
  export interface CreateInstanceSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateInstancesFromSnapshotRequest {
    /**
     * The names for your new instances.
     */
    instanceNames: StringList;
    /**
     * An object containing information about one or more disk mappings.
     */
    attachedDiskMapping?: AttachedDiskMap;
    /**
     * The Availability Zone where you want to create your instances. Use the following formatting: us-east-2a (case sensitive). You can get a list of Availability Zones by using the get regions operation. Be sure to add the include Availability Zones parameter to your request.
     */
    availabilityZone: string;
    /**
     * The name of the instance snapshot on which you are basing your new instances. Use the get instance snapshots operation to return information about your existing snapshots. Constraint:   This parameter cannot be defined together with the source instance name parameter. The instance snapshot name and source instance name parameters are mutually exclusive.  
     */
    instanceSnapshotName?: ResourceName;
    /**
     * The bundle of specification information for your virtual private server (or instance), including the pricing plan (e.g., micro_1_0).
     */
    bundleId: NonEmptyString;
    /**
     * You can create a launch script that configures a server with additional user data. For example, apt-get -y update.  Depending on the machine image you choose, the command to get software on your instance varies. Amazon Linux and CentOS use yum, Debian and Ubuntu use apt-get, and FreeBSD uses pkg. For a complete list, see the Amazon Lightsail Developer Guide. 
     */
    userData?: string;
    /**
     * The name for your key pair.
     */
    keyPairName?: ResourceName;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
    /**
     * An array of objects representing the add-ons to enable for the new instance.
     */
    addOns?: AddOnRequestList;
    /**
     * The IP address type for the instance. The possible values are ipv4 for IPv4 only, and dualstack for IPv4 and IPv6. The default value is dualstack.
     */
    ipAddressType?: IpAddressType;
    /**
     * The name of the source instance from which the source automatic snapshot was created. Constraints:   This parameter cannot be defined together with the instance snapshot name parameter. The source instance name and instance snapshot name parameters are mutually exclusive.   Define this parameter only when creating a new instance from an automatic snapshot. For more information, see the Amazon Lightsail Developer Guide.  
     */
    sourceInstanceName?: string;
    /**
     * The date of the automatic snapshot to use for the new instance. Use the get auto snapshots operation to identify the dates of the available automatic snapshots. Constraints:   Must be specified in YYYY-MM-DD format.   This parameter cannot be defined together with the use latest restorable auto snapshot parameter. The restore date and use latest restorable auto snapshot parameters are mutually exclusive.   Define this parameter only when creating a new instance from an automatic snapshot. For more information, see the Amazon Lightsail Developer Guide.  
     */
    restoreDate?: string;
    /**
     * A Boolean value to indicate whether to use the latest available automatic snapshot. Constraints:   This parameter cannot be defined together with the restore date parameter. The use latest restorable auto snapshot and restore date parameters are mutually exclusive.   Define this parameter only when creating a new instance from an automatic snapshot. For more information, see the Amazon Lightsail Developer Guide.  
     */
    useLatestRestorableAutoSnapshot?: boolean;
  }
  export interface CreateInstancesFromSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateInstancesRequest {
    /**
     * The names to use for your new Lightsail instances. Separate multiple values using quotation marks and commas, for example: ["MyFirstInstance","MySecondInstance"] 
     */
    instanceNames: StringList;
    /**
     * The Availability Zone in which to create your instance. Use the following format: us-east-2a (case sensitive). You can get a list of Availability Zones by using the get regions operation. Be sure to add the include Availability Zones parameter to your request.
     */
    availabilityZone: string;
    /**
     * (Deprecated) The name for your custom image.  In releases prior to June 12, 2017, this parameter was ignored by the API. It is now deprecated. 
     */
    customImageName?: ResourceName;
    /**
     * The ID for a virtual private server image (e.g., app_wordpress_4_4 or app_lamp_7_0). Use the get blueprints operation to return a list of available images (or blueprints).  Use active blueprints when creating new instances. Inactive blueprints are listed to support customers with existing instances and are not necessarily available to create new instances. Blueprints are marked inactive when they become outdated due to operating system updates or new application releases. 
     */
    blueprintId: NonEmptyString;
    /**
     * The bundle of specification information for your virtual private server (or instance), including the pricing plan (e.g., micro_1_0).
     */
    bundleId: NonEmptyString;
    /**
     * A launch script you can create that configures a server with additional user data. For example, you might want to run apt-get -y update.  Depending on the machine image you choose, the command to get software on your instance varies. Amazon Linux and CentOS use yum, Debian and Ubuntu use apt-get, and FreeBSD uses pkg. For a complete list, see the Amazon Lightsail Developer Guide. 
     */
    userData?: string;
    /**
     * The name of your key pair.
     */
    keyPairName?: ResourceName;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
    /**
     * An array of objects representing the add-ons to enable for the new instance.
     */
    addOns?: AddOnRequestList;
    /**
     * The IP address type for the instance. The possible values are ipv4 for IPv4 only, and dualstack for IPv4 and IPv6. The default value is dualstack.
     */
    ipAddressType?: IpAddressType;
  }
  export interface CreateInstancesResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateKeyPairRequest {
    /**
     * The name for your new key pair.
     */
    keyPairName: ResourceName;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
  }
  export interface CreateKeyPairResult {
    /**
     * An array of key-value pairs containing information about the new key pair you just created.
     */
    keyPair?: KeyPair;
    /**
     * A base64-encoded public key of the ssh-rsa type.
     */
    publicKeyBase64?: Base64;
    /**
     * A base64-encoded RSA private key.
     */
    privateKeyBase64?: Base64;
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface CreateLoadBalancerRequest {
    /**
     * The name of your load balancer.
     */
    loadBalancerName: ResourceName;
    /**
     * The instance port where you're creating your load balancer.
     */
    instancePort: Port;
    /**
     * The path you provided to perform the load balancer health check. If you didn't specify a health check path, Lightsail uses the root path of your website (e.g., "/"). You may want to specify a custom health check path other than the root of your application if your home page loads slowly or has a lot of media or scripting on it.
     */
    healthCheckPath?: string;
    /**
     * The name of the SSL/TLS certificate. If you specify certificateName, then certificateDomainName is required (and vice-versa).
     */
    certificateName?: ResourceName;
    /**
     * The domain name with which your certificate is associated (e.g., example.com). If you specify certificateDomainName, then certificateName is required (and vice-versa).
     */
    certificateDomainName?: DomainName;
    /**
     * The optional alternative domains and subdomains to use with your SSL/TLS certificate (e.g., www.example.com, example.com, m.example.com, blog.example.com).
     */
    certificateAlternativeNames?: DomainNameList;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
    /**
     * The IP address type for the load balancer. The possible values are ipv4 for IPv4 only, and dualstack for IPv4 and IPv6. The default value is dualstack.
     */
    ipAddressType?: IpAddressType;
  }
  export interface CreateLoadBalancerResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateLoadBalancerTlsCertificateRequest {
    /**
     * The load balancer name where you want to create the SSL/TLS certificate.
     */
    loadBalancerName: ResourceName;
    /**
     * The SSL/TLS certificate name. You can have up to 10 certificates in your account at one time. Each Lightsail load balancer can have up to 2 certificates associated with it at one time. There is also an overall limit to the number of certificates that can be issue in a 365-day period. For more information, see Limits.
     */
    certificateName: ResourceName;
    /**
     * The domain name (e.g., example.com) for your SSL/TLS certificate.
     */
    certificateDomainName: DomainName;
    /**
     * An array of strings listing alternative domains and subdomains for your SSL/TLS certificate. Lightsail will de-dupe the names for you. You can have a maximum of 9 alternative names (in addition to the 1 primary domain). We do not support wildcards (e.g., *.example.com).
     */
    certificateAlternativeNames?: DomainNameList;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
  }
  export interface CreateLoadBalancerTlsCertificateResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateRelationalDatabaseFromSnapshotRequest {
    /**
     * The name to use for your new Lightsail database resource. Constraints:   Must contain from 2 to 255 alphanumeric characters, or hyphens.   The first and last character must be a letter or number.  
     */
    relationalDatabaseName: ResourceName;
    /**
     * The Availability Zone in which to create your new database. Use the us-east-2a case-sensitive format. You can get a list of Availability Zones by using the get regions operation. Be sure to add the include relational database Availability Zones parameter to your request.
     */
    availabilityZone?: string;
    /**
     * Specifies the accessibility options for your new database. A value of true specifies a database that is available to resources outside of your Lightsail account. A value of false specifies a database that is available only to your Lightsail resources in the same region as your database.
     */
    publiclyAccessible?: boolean;
    /**
     * The name of the database snapshot from which to create your new database.
     */
    relationalDatabaseSnapshotName?: ResourceName;
    /**
     * The bundle ID for your new database. A bundle describes the performance specifications for your database. You can get a list of database bundle IDs by using the get relational database bundles operation. When creating a new database from a snapshot, you cannot choose a bundle that is smaller than the bundle of the source database.
     */
    relationalDatabaseBundleId?: string;
    /**
     * The name of the source database.
     */
    sourceRelationalDatabaseName?: ResourceName;
    /**
     * The date and time to restore your database from. Constraints:   Must be before the latest restorable time for the database.   Cannot be specified if the use latest restorable time parameter is true.   Specified in Coordinated Universal Time (UTC).   Specified in the Unix time format. For example, if you wish to use a restore time of October 1, 2018, at 8 PM UTC, then you input 1538424000 as the restore time.  
     */
    restoreTime?: IsoDate;
    /**
     * Specifies whether your database is restored from the latest backup time. A value of true restores from the latest backup time.  Default: false  Constraints: Cannot be specified if the restore time parameter is provided.
     */
    useLatestRestorableTime?: boolean;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
  }
  export interface CreateRelationalDatabaseFromSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateRelationalDatabaseRequest {
    /**
     * The name to use for your new Lightsail database resource. Constraints:   Must contain from 2 to 255 alphanumeric characters, or hyphens.   The first and last character must be a letter or number.  
     */
    relationalDatabaseName: ResourceName;
    /**
     * The Availability Zone in which to create your new database. Use the us-east-2a case-sensitive format. You can get a list of Availability Zones by using the get regions operation. Be sure to add the include relational database Availability Zones parameter to your request.
     */
    availabilityZone?: string;
    /**
     * The blueprint ID for your new database. A blueprint describes the major engine version of a database. You can get a list of database blueprints IDs by using the get relational database blueprints operation.
     */
    relationalDatabaseBlueprintId: string;
    /**
     * The bundle ID for your new database. A bundle describes the performance specifications for your database. You can get a list of database bundle IDs by using the get relational database bundles operation.
     */
    relationalDatabaseBundleId: string;
    /**
     * The meaning of this parameter differs according to the database engine you use.  MySQL  The name of the database to create when the Lightsail database resource is created. If this parameter isn't specified, no database is created in the database resource. Constraints:   Must contain 1 to 64 letters or numbers.   Must begin with a letter. Subsequent characters can be letters, underscores, or digits (0- 9).   Can't be a word reserved by the specified database engine. For more information about reserved words in MySQL, see the Keywords and Reserved Words articles for MySQL 5.6, MySQL 5.7, and MySQL 8.0.    PostgreSQL  The name of the database to create when the Lightsail database resource is created. If this parameter isn't specified, a database named postgres is created in the database resource. Constraints:   Must contain 1 to 63 letters or numbers.   Must begin with a letter. Subsequent characters can be letters, underscores, or digits (0- 9).   Can't be a word reserved by the specified database engine. For more information about reserved words in PostgreSQL, see the SQL Key Words articles for PostgreSQL 9.6, PostgreSQL 10, PostgreSQL 11, and PostgreSQL 12.  
     */
    masterDatabaseName: string;
    /**
     * The name for the master user.  MySQL  Constraints:   Required for MySQL.   Must be 1 to 16 letters or numbers. Can contain underscores.   First character must be a letter.   Can't be a reserved word for the chosen database engine. For more information about reserved words in MySQL 5.6 or 5.7, see the Keywords and Reserved Words articles for MySQL 5.6, MySQL 5.7, or MySQL 8.0.    PostgreSQL  Constraints:   Required for PostgreSQL.   Must be 1 to 63 letters or numbers. Can contain underscores.   First character must be a letter.   Can't be a reserved word for the chosen database engine. For more information about reserved words in MySQL 5.6 or 5.7, see the Keywords and Reserved Words articles for PostgreSQL 9.6, PostgreSQL 10, PostgreSQL 11, and PostgreSQL 12.  
     */
    masterUsername: string;
    /**
     * The password for the master user. The password can include any printable ASCII character except "/", """, or "@". It cannot contain spaces.  MySQL  Constraints: Must contain from 8 to 41 characters.  PostgreSQL  Constraints: Must contain from 8 to 128 characters.
     */
    masterUserPassword?: SensitiveString;
    /**
     * The daily time range during which automated backups are created for your new database if automated backups are enabled. The default is a 30-minute window selected at random from an 8-hour block of time for each AWS Region. For more information about the preferred backup window time blocks for each region, see the Working With Backups guide in the Amazon Relational Database Service (Amazon RDS) documentation. Constraints:   Must be in the hh24:mi-hh24:mi format. Example: 16:00-16:30    Specified in Coordinated Universal Time (UTC).   Must not conflict with the preferred maintenance window.   Must be at least 30 minutes.  
     */
    preferredBackupWindow?: string;
    /**
     * The weekly time range during which system maintenance can occur on your new database. The default is a 30-minute window selected at random from an 8-hour block of time for each AWS Region, occurring on a random day of the week. Constraints:   Must be in the ddd:hh24:mi-ddd:hh24:mi format.   Valid days: Mon, Tue, Wed, Thu, Fri, Sat, Sun.   Must be at least 30 minutes.   Specified in Coordinated Universal Time (UTC).   Example: Tue:17:00-Tue:17:30   
     */
    preferredMaintenanceWindow?: string;
    /**
     * Specifies the accessibility options for your new database. A value of true specifies a database that is available to resources outside of your Lightsail account. A value of false specifies a database that is available only to your Lightsail resources in the same region as your database.
     */
    publiclyAccessible?: boolean;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
  }
  export interface CreateRelationalDatabaseResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface CreateRelationalDatabaseSnapshotRequest {
    /**
     * The name of the database on which to base your new snapshot.
     */
    relationalDatabaseName: ResourceName;
    /**
     * The name for your new database snapshot. Constraints:   Must contain from 2 to 255 alphanumeric characters, or hyphens.   The first and last character must be a letter or number.  
     */
    relationalDatabaseSnapshotName: ResourceName;
    /**
     * The tag keys and optional values to add to the resource during create. Use the TagResource action to tag a resource after it's created.
     */
    tags?: TagList;
  }
  export interface CreateRelationalDatabaseSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteAlarmRequest {
    /**
     * The name of the alarm to delete.
     */
    alarmName: ResourceName;
  }
  export interface DeleteAlarmResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteAutoSnapshotRequest {
    /**
     * The name of the source instance or disk from which to delete the automatic snapshot.
     */
    resourceName: ResourceName;
    /**
     * The date of the automatic snapshot to delete in YYYY-MM-DD format. Use the get auto snapshots operation to get the available automatic snapshots for a resource.
     */
    date: AutoSnapshotDate;
  }
  export interface DeleteAutoSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteBucketAccessKeyRequest {
    /**
     * The name of the bucket that the access key belongs to.
     */
    bucketName: BucketName;
    /**
     * The ID of the access key to delete. Use the GetBucketAccessKeys action to get a list of access key IDs that you can specify.
     */
    accessKeyId: NonEmptyString;
  }
  export interface DeleteBucketAccessKeyResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteBucketRequest {
    /**
     * The name of the bucket to delete. Use the GetBuckets action to get a list of bucket names that you can specify.
     */
    bucketName: BucketName;
    /**
     * A Boolean value that indicates whether to force delete the bucket. You must force delete the bucket if it has one of the following conditions:   The bucket is the origin of a distribution.   The bucket has instances that were granted access to it using the SetResourceAccessForBucket action.   The bucket has objects.   The bucket has access keys.    Force deleting a bucket might impact other resources that rely on the bucket, such as instances, distributions, or software that use the issued access keys. 
     */
    forceDelete?: boolean;
  }
  export interface DeleteBucketResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteCertificateRequest {
    /**
     * The name of the certificate to delete. Use the GetCertificates action to get a list of certificate names that you can specify.
     */
    certificateName: CertificateName;
  }
  export interface DeleteCertificateResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteContactMethodRequest {
    /**
     * The protocol that will be deleted, such as Email or SMS (text messaging).  To delete an Email and an SMS contact method if you added both, you must run separate DeleteContactMethod actions to delete each protocol. 
     */
    protocol: ContactProtocol;
  }
  export interface DeleteContactMethodResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteContainerImageRequest {
    /**
     * The name of the container service for which to delete a registered container image.
     */
    serviceName: ContainerServiceName;
    /**
     * The name of the container image to delete from the container service. Use the GetContainerImages action to get the name of the container images that are registered to a container service.  Container images sourced from your Lightsail container service, that are registered and stored on your service, start with a colon (:). For example, :container-service-1.mystaticwebsite.1. Container images sourced from a public registry like Docker Hub don't start with a colon. For example, nginx:latest or nginx. 
     */
    image: string;
  }
  export interface DeleteContainerImageResult {
  }
  export interface DeleteContainerServiceRequest {
    /**
     * The name of the container service to delete.
     */
    serviceName: ContainerServiceName;
  }
  export interface DeleteContainerServiceResult {
  }
  export interface DeleteDiskRequest {
    /**
     * The unique name of the disk you want to delete (e.g., my-disk).
     */
    diskName: ResourceName;
    /**
     * A Boolean value to indicate whether to delete the enabled add-ons for the disk.
     */
    forceDeleteAddOns?: boolean;
  }
  export interface DeleteDiskResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteDiskSnapshotRequest {
    /**
     * The name of the disk snapshot you want to delete (e.g., my-disk-snapshot).
     */
    diskSnapshotName: ResourceName;
  }
  export interface DeleteDiskSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteDistributionRequest {
    /**
     * The name of the distribution to delete. Use the GetDistributions action to get a list of distribution names that you can specify.
     */
    distributionName?: ResourceName;
  }
  export interface DeleteDistributionResult {
    /**
     * An object that describes the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface DeleteDomainEntryRequest {
    /**
     * The name of the domain entry to delete.
     */
    domainName: DomainName;
    /**
     * An array of key-value pairs containing information about your domain entries.
     */
    domainEntry: DomainEntry;
  }
  export interface DeleteDomainEntryResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface DeleteDomainRequest {
    /**
     * The specific domain name to delete.
     */
    domainName: DomainName;
  }
  export interface DeleteDomainResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface DeleteInstanceRequest {
    /**
     * The name of the instance to delete.
     */
    instanceName: ResourceName;
    /**
     * A Boolean value to indicate whether to delete the enabled add-ons for the disk.
     */
    forceDeleteAddOns?: boolean;
  }
  export interface DeleteInstanceResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteInstanceSnapshotRequest {
    /**
     * The name of the snapshot to delete.
     */
    instanceSnapshotName: ResourceName;
  }
  export interface DeleteInstanceSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteKeyPairRequest {
    /**
     * The name of the key pair to delete.
     */
    keyPairName: ResourceName;
  }
  export interface DeleteKeyPairResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface DeleteKnownHostKeysRequest {
    /**
     * The name of the instance for which you want to reset the host key or certificate.
     */
    instanceName: ResourceName;
  }
  export interface DeleteKnownHostKeysResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteLoadBalancerRequest {
    /**
     * The name of the load balancer you want to delete.
     */
    loadBalancerName: ResourceName;
  }
  export interface DeleteLoadBalancerResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteLoadBalancerTlsCertificateRequest {
    /**
     * The load balancer name.
     */
    loadBalancerName: ResourceName;
    /**
     * The SSL/TLS certificate name.
     */
    certificateName: ResourceName;
    /**
     * When true, forces the deletion of an SSL/TLS certificate. There can be two certificates associated with a Lightsail load balancer: the primary and the backup. The force parameter is required when the primary SSL/TLS certificate is in use by an instance attached to the load balancer.
     */
    force?: boolean;
  }
  export interface DeleteLoadBalancerTlsCertificateResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteRelationalDatabaseRequest {
    /**
     * The name of the database that you are deleting.
     */
    relationalDatabaseName: ResourceName;
    /**
     * Determines whether a final database snapshot is created before your database is deleted. If true is specified, no database snapshot is created. If false is specified, a database snapshot is created before your database is deleted. You must specify the final relational database snapshot name parameter if the skip final snapshot parameter is false. Default: false 
     */
    skipFinalSnapshot?: boolean;
    /**
     * The name of the database snapshot created if skip final snapshot is false, which is the default value for that parameter.  Specifying this parameter and also specifying the skip final snapshot parameter to true results in an error.  Constraints:   Must contain from 2 to 255 alphanumeric characters, or hyphens.   The first and last character must be a letter or number.  
     */
    finalRelationalDatabaseSnapshotName?: ResourceName;
  }
  export interface DeleteRelationalDatabaseResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DeleteRelationalDatabaseSnapshotRequest {
    /**
     * The name of the database snapshot that you are deleting.
     */
    relationalDatabaseSnapshotName: ResourceName;
  }
  export interface DeleteRelationalDatabaseSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DestinationInfo {
    /**
     * The ID of the resource created at the destination.
     */
    id?: NonEmptyString;
    /**
     * The destination service of the record.
     */
    service?: NonEmptyString;
  }
  export interface DetachCertificateFromDistributionRequest {
    /**
     * The name of the distribution from which to detach the certificate. Use the GetDistributions action to get a list of distribution names that you can specify.
     */
    distributionName: ResourceName;
  }
  export interface DetachCertificateFromDistributionResult {
    /**
     * An object that describes the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface DetachDiskRequest {
    /**
     * The unique name of the disk you want to detach from your instance (e.g., my-disk).
     */
    diskName: ResourceName;
  }
  export interface DetachDiskResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DetachInstancesFromLoadBalancerRequest {
    /**
     * The name of the Lightsail load balancer.
     */
    loadBalancerName: ResourceName;
    /**
     * An array of strings containing the names of the instances you want to detach from the load balancer.
     */
    instanceNames: ResourceNameList;
  }
  export interface DetachInstancesFromLoadBalancerResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DetachStaticIpRequest {
    /**
     * The name of the static IP to detach from the instance.
     */
    staticIpName: ResourceName;
  }
  export interface DetachStaticIpResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface DisableAddOnRequest {
    /**
     * The add-on type to disable.
     */
    addOnType: AddOnType;
    /**
     * The name of the source resource for which to disable the add-on.
     */
    resourceName: ResourceName;
  }
  export interface DisableAddOnResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface Disk {
    /**
     * The unique name of the disk.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the disk.
     */
    arn?: NonEmptyString;
    /**
     * The support code. Include this code in your email to support when you have questions about an instance or another resource in Lightsail. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The date when the disk was created.
     */
    createdAt?: IsoDate;
    /**
     * The AWS Region and Availability Zone where the disk is located.
     */
    location?: ResourceLocation;
    /**
     * The Lightsail resource type (e.g., Disk).
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * An array of objects representing the add-ons enabled on the disk.
     */
    addOns?: AddOnList;
    /**
     * The size of the disk in GB.
     */
    sizeInGb?: integer;
    /**
     * A Boolean value indicating whether this disk is a system disk (has an operating system loaded on it).
     */
    isSystemDisk?: boolean;
    /**
     * The input/output operations per second (IOPS) of the disk.
     */
    iops?: integer;
    /**
     * The disk path.
     */
    path?: string;
    /**
     * Describes the status of the disk.
     */
    state?: DiskState;
    /**
     * The resources to which the disk is attached.
     */
    attachedTo?: ResourceName;
    /**
     * A Boolean value indicating whether the disk is attached.
     */
    isAttached?: boolean;
    /**
     * (Deprecated) The attachment state of the disk.  In releases prior to November 14, 2017, this parameter returned attached for system disks in the API response. It is now deprecated, but still included in the response. Use isAttached instead. 
     */
    attachmentState?: string;
    /**
     * (Deprecated) The number of GB in use by the disk.  In releases prior to November 14, 2017, this parameter was not included in the API response. It is now deprecated. 
     */
    gbInUse?: integer;
  }
  export interface DiskInfo {
    /**
     * The disk name.
     */
    name?: string;
    /**
     * The disk path.
     */
    path?: NonEmptyString;
    /**
     * The size of the disk in GB (e.g., 32).
     */
    sizeInGb?: integer;
    /**
     * A Boolean value indicating whether this disk is a system disk (has an operating system loaded on it).
     */
    isSystemDisk?: boolean;
  }
  export type DiskInfoList = DiskInfo[];
  export type DiskList = Disk[];
  export interface DiskMap {
    /**
     * The original disk path exposed to the instance (for example, /dev/sdh).
     */
    originalDiskPath?: NonEmptyString;
    /**
     * The new disk name (e.g., my-new-disk).
     */
    newDiskName?: ResourceName;
  }
  export type DiskMapList = DiskMap[];
  export interface DiskSnapshot {
    /**
     * The name of the disk snapshot (e.g., my-disk-snapshot).
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the disk snapshot.
     */
    arn?: NonEmptyString;
    /**
     * The support code. Include this code in your email to support when you have questions about an instance or another resource in Lightsail. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The date when the disk snapshot was created.
     */
    createdAt?: IsoDate;
    /**
     * The AWS Region and Availability Zone where the disk snapshot was created.
     */
    location?: ResourceLocation;
    /**
     * The Lightsail resource type (e.g., DiskSnapshot).
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The size of the disk in GB.
     */
    sizeInGb?: integer;
    /**
     * The status of the disk snapshot operation.
     */
    state?: DiskSnapshotState;
    /**
     * The progress of the snapshot.
     */
    progress?: string;
    /**
     * The unique name of the source disk from which the disk snapshot was created.
     */
    fromDiskName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the source disk from which the disk snapshot was created.
     */
    fromDiskArn?: NonEmptyString;
    /**
     * The unique name of the source instance from which the disk (system volume) snapshot was created.
     */
    fromInstanceName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the source instance from which the disk (system volume) snapshot was created.
     */
    fromInstanceArn?: NonEmptyString;
    /**
     * A Boolean value indicating whether the snapshot was created from an automatic snapshot.
     */
    isFromAutoSnapshot?: boolean;
  }
  export interface DiskSnapshotInfo {
    /**
     * The size of the disk in GB (e.g., 32).
     */
    sizeInGb?: integer;
  }
  export type DiskSnapshotList = DiskSnapshot[];
  export type DiskSnapshotState = "pending"|"completed"|"error"|"unknown"|string;
  export type DiskState = "pending"|"error"|"available"|"in-use"|"unknown"|string;
  export interface DistributionBundle {
    /**
     * The ID of the bundle.
     */
    bundleId?: string;
    /**
     * The name of the distribution bundle.
     */
    name?: string;
    /**
     * The monthly price, in US dollars, of the bundle.
     */
    price?: float;
    /**
     * The monthly network transfer quota of the bundle.
     */
    transferPerMonthInGb?: integer;
    /**
     * Indicates whether the bundle is active, and can be specified for a new or existing distribution.
     */
    isActive?: boolean;
  }
  export type DistributionBundleList = DistributionBundle[];
  export type DistributionList = LightsailDistribution[];
  export type DistributionMetricName = "Requests"|"BytesDownloaded"|"BytesUploaded"|"TotalErrorRate"|"Http4xxErrorRate"|"Http5xxErrorRate"|string;
  export interface Domain {
    /**
     * The name of the domain.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the domain recordset (e.g., arn:aws:lightsail:global:123456789101:Domain/824cede0-abc7-4f84-8dbc-12345EXAMPLE).
     */
    arn?: NonEmptyString;
    /**
     * The support code. Include this code in your email to support when you have questions about an instance or another resource in Lightsail. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The date when the domain recordset was created.
     */
    createdAt?: IsoDate;
    /**
     * The AWS Region and Availability Zones where the domain recordset was created.
     */
    location?: ResourceLocation;
    /**
     * The resource type. 
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * An array of key-value pairs containing information about the domain entries.
     */
    domainEntries?: DomainEntryList;
  }
  export interface DomainEntry {
    /**
     * The ID of the domain recordset entry.
     */
    id?: NonEmptyString;
    /**
     * The name of the domain.
     */
    name?: DomainName;
    /**
     * The target IP address (e.g., 192.0.2.0), or AWS name server (e.g., ns-111.awsdns-22.com.). For Lightsail load balancers, the value looks like ab1234c56789c6b86aba6fb203d443bc-123456789.us-east-2.elb.amazonaws.com. For Lightsail distributions, the value looks like exampled1182ne.cloudfront.net. For Lightsail container services, the value looks like container-service-1.example23scljs.us-west-2.cs.amazonlightsail.com. Be sure to also set isAlias to true when setting up an A record for a Lightsail load balancer, distribution, or container service.
     */
    target?: string;
    /**
     * When true, specifies whether the domain entry is an alias used by the Lightsail load balancer. You can include an alias (A type) record in your request, which points to a load balancer DNS name and routes traffic to your load balancer.
     */
    isAlias?: boolean;
    /**
     * The type of domain entry, such as address for IPv4 (A), address for IPv6 (AAAA), canonical name (CNAME), mail exchanger (MX), name server (NS), start of authority (SOA), service locator (SRV), or text (TXT). The following domain entry types can be used:    A     AAAA     CNAME     MX     NS     SOA     SRV     TXT   
     */
    type?: DomainEntryType;
    /**
     * (Deprecated) The options for the domain entry.  In releases prior to November 29, 2017, this parameter was not included in the API response. It is now deprecated. 
     */
    options?: DomainEntryOptions;
  }
  export type DomainEntryList = DomainEntry[];
  export type DomainEntryOptions = {[key: string]: string};
  export type DomainEntryOptionsKeys = string;
  export type DomainEntryType = string;
  export type DomainList = Domain[];
  export type DomainName = string;
  export type DomainNameList = DomainName[];
  export interface DomainValidationRecord {
    /**
     * The domain name of the certificate validation record. For example, example.com or www.example.com.
     */
    domainName?: DomainName;
    /**
     * An object that describes the DNS records to add to your domain's DNS to validate it for the certificate.
     */
    resourceRecord?: ResourceRecord;
  }
  export type DomainValidationRecordList = DomainValidationRecord[];
  export interface DownloadDefaultKeyPairRequest {
  }
  export interface DownloadDefaultKeyPairResult {
    /**
     * A base64-encoded public key of the ssh-rsa type.
     */
    publicKeyBase64?: Base64;
    /**
     * A base64-encoded RSA private key.
     */
    privateKeyBase64?: Base64;
  }
  export type EligibleToRenew = string;
  export interface EnableAddOnRequest {
    /**
     * The name of the source resource for which to enable or modify the add-on.
     */
    resourceName: ResourceName;
    /**
     * An array of strings representing the add-on to enable or modify.
     */
    addOnRequest: AddOnRequest;
  }
  export interface EnableAddOnResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface EndpointRequest {
    /**
     * The name of the container for the endpoint.
     */
    containerName: string;
    /**
     * The port of the container to which traffic is forwarded to.
     */
    containerPort: integer;
    /**
     * An object that describes the health check configuration of the container.
     */
    healthCheck?: ContainerServiceHealthCheckConfig;
  }
  export type Environment = {[key: string]: string};
  export interface ExportSnapshotRecord {
    /**
     * The export snapshot record name.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the export snapshot record.
     */
    arn?: NonEmptyString;
    /**
     * The date when the export snapshot record was created.
     */
    createdAt?: IsoDate;
    /**
     * The AWS Region and Availability Zone where the export snapshot record is located.
     */
    location?: ResourceLocation;
    /**
     * The Lightsail resource type (e.g., ExportSnapshotRecord).
     */
    resourceType?: ResourceType;
    /**
     * The state of the export snapshot record.
     */
    state?: RecordState;
    /**
     * A list of objects describing the source of the export snapshot record.
     */
    sourceInfo?: ExportSnapshotRecordSourceInfo;
    /**
     * A list of objects describing the destination of the export snapshot record.
     */
    destinationInfo?: DestinationInfo;
  }
  export type ExportSnapshotRecordList = ExportSnapshotRecord[];
  export interface ExportSnapshotRecordSourceInfo {
    /**
     * The Lightsail resource type (e.g., InstanceSnapshot or DiskSnapshot).
     */
    resourceType?: ExportSnapshotRecordSourceType;
    /**
     * The date when the source instance or disk snapshot was created.
     */
    createdAt?: IsoDate;
    /**
     * The name of the source instance or disk snapshot.
     */
    name?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the source instance or disk snapshot.
     */
    arn?: NonEmptyString;
    /**
     * The name of the snapshot's source instance or disk.
     */
    fromResourceName?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the snapshot's source instance or disk.
     */
    fromResourceArn?: NonEmptyString;
    /**
     * A list of objects describing an instance snapshot.
     */
    instanceSnapshotInfo?: InstanceSnapshotInfo;
    /**
     * A list of objects describing a disk snapshot.
     */
    diskSnapshotInfo?: DiskSnapshotInfo;
  }
  export type ExportSnapshotRecordSourceType = "InstanceSnapshot"|"DiskSnapshot"|string;
  export interface ExportSnapshotRequest {
    /**
     * The name of the instance or disk snapshot to be exported to Amazon EC2.
     */
    sourceSnapshotName: ResourceName;
  }
  export interface ExportSnapshotResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export type ForwardValues = "none"|"allow-list"|"all"|string;
  export interface GetActiveNamesRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetActiveNames request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetActiveNamesResult {
    /**
     * The list of active names returned by the get active names request.
     */
    activeNames?: StringList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetActiveNames request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetAlarmsRequest {
    /**
     * The name of the alarm. Specify an alarm name to return information about a specific alarm.
     */
    alarmName?: ResourceName;
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetAlarms request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
    /**
     * The name of the Lightsail resource being monitored by the alarm. Specify a monitored resource name to return information about all alarms for a specific resource.
     */
    monitoredResourceName?: ResourceName;
  }
  export interface GetAlarmsResult {
    /**
     * An array of objects that describe the alarms.
     */
    alarms?: AlarmsList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetAlarms request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetAutoSnapshotsRequest {
    /**
     * The name of the source instance or disk from which to get automatic snapshot information.
     */
    resourceName: ResourceName;
  }
  export interface GetAutoSnapshotsResult {
    /**
     * The name of the source instance or disk for the automatic snapshots.
     */
    resourceName?: ResourceName;
    /**
     * The resource type (e.g., Instance or Disk).
     */
    resourceType?: ResourceType;
    /**
     * An array of objects that describe the automatic snapshots that are available for the specified source instance or disk.
     */
    autoSnapshots?: AutoSnapshotDetailsList;
  }
  export interface GetBlueprintsRequest {
    /**
     * A Boolean value indicating whether to include inactive results in your request.
     */
    includeInactive?: boolean;
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetBlueprints request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetBlueprintsResult {
    /**
     * An array of key-value pairs that contains information about the available blueprints.
     */
    blueprints?: BlueprintList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetBlueprints request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetBucketAccessKeysRequest {
    /**
     * The name of the bucket for which to return access keys.
     */
    bucketName: BucketName;
  }
  export interface GetBucketAccessKeysResult {
    /**
     * An object that describes the access keys for the specified bucket.
     */
    accessKeys?: AccessKeyList;
  }
  export interface GetBucketBundlesRequest {
    /**
     * A Boolean value that indicates whether to include inactive (unavailable) bundles in the response.
     */
    includeInactive?: boolean;
  }
  export interface GetBucketBundlesResult {
    /**
     * An object that describes bucket bundles.
     */
    bundles?: BucketBundleList;
  }
  export interface GetBucketMetricDataRequest {
    /**
     * The name of the bucket for which to get metric data.
     */
    bucketName: BucketName;
    /**
     * The metric for which you want to return information. Valid bucket metric names are listed below, along with the most useful statistics to include in your request, and the published unit value.  These bucket metrics are reported once per day.      BucketSizeBytes  - The amount of data in bytes stored in a bucket. This value is calculated by summing the size of all objects in the bucket (including object versions), including the size of all parts for all incomplete multipart uploads to the bucket. Statistics: The most useful statistic is Maximum. Unit: The published unit is Bytes.     NumberOfObjects  - The total number of objects stored in a bucket. This value is calculated by counting all objects in the bucket (including object versions) and the total number of parts for all incomplete multipart uploads to the bucket. Statistics: The most useful statistic is Average. Unit: The published unit is Count.  
     */
    metricName: BucketMetricName;
    /**
     * The timestamp indicating the earliest data to be returned.
     */
    startTime: IsoDate;
    /**
     * The timestamp indicating the latest data to be returned.
     */
    endTime: IsoDate;
    /**
     * The granularity, in seconds, of the returned data points.  Bucket storage metrics are reported once per day. Therefore, you should specify a period of 86400 seconds, which is the number of seconds in a day. 
     */
    period: MetricPeriod;
    /**
     * The statistic for the metric. The following statistics are available:    Minimum - The lowest value observed during the specified period. Use this value to determine low volumes of activity for your application.    Maximum - The highest value observed during the specified period. Use this value to determine high volumes of activity for your application.    Sum - The sum of all values submitted for the matching metric. You can use this statistic to determine the total volume of a metric.    Average - The value of Sum / SampleCount during the specified period. By comparing this statistic with the Minimum and Maximum values, you can determine the full scope of a metric and how close the average use is to the Minimum and Maximum values. This comparison helps you to know when to increase or decrease your resources.    SampleCount - The count, or number, of data points used for the statistical calculation.  
     */
    statistics: MetricStatisticList;
    /**
     * The unit for the metric data request. Valid units depend on the metric data being requested. For the valid units with each available metric, see the metricName parameter.
     */
    unit: MetricUnit;
  }
  export interface GetBucketMetricDataResult {
    /**
     * The name of the metric returned.
     */
    metricName?: BucketMetricName;
    /**
     * An array of objects that describe the metric data returned.
     */
    metricData?: MetricDatapointList;
  }
  export interface GetBucketsRequest {
    /**
     * The name of the bucket for which to return information. When omitted, the response includes all of your buckets in the AWS Region where the request is made.
     */
    bucketName?: BucketName;
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetBuckets request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
    /**
     * A Boolean value that indicates whether to include Lightsail instances that were given access to the bucket using the SetResourceAccessForBucket action.
     */
    includeConnectedResources?: boolean;
  }
  export interface GetBucketsResult {
    /**
     * An array of objects that describe buckets.
     */
    buckets?: BucketList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetBuckets request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetBundlesRequest {
    /**
     * A Boolean value that indicates whether to include inactive bundle results in your request.
     */
    includeInactive?: boolean;
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetBundles request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetBundlesResult {
    /**
     * An array of key-value pairs that contains information about the available bundles.
     */
    bundles?: BundleList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetBundles request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetCertificatesRequest {
    /**
     * The status of the certificates for which to return information. For example, specify ISSUED to return only certificates with an ISSUED status. When omitted, the response includes all of your certificates in the AWS Region where the request is made, regardless of their current status.
     */
    certificateStatuses?: CertificateStatusList;
    /**
     * Indicates whether to include detailed information about the certificates in the response. When omitted, the response includes only the certificate names, Amazon Resource Names (ARNs), domain names, and tags.
     */
    includeCertificateDetails?: IncludeCertificateDetails;
    /**
     * The name for the certificate for which to return information. When omitted, the response includes all of your certificates in the AWS Region where the request is made.
     */
    certificateName?: CertificateName;
  }
  export interface GetCertificatesResult {
    /**
     * An object that describes certificates.
     */
    certificates?: CertificateSummaryList;
  }
  export interface GetCloudFormationStackRecordsRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetClouFormationStackRecords request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetCloudFormationStackRecordsResult {
    /**
     * A list of objects describing the CloudFormation stack records.
     */
    cloudFormationStackRecords?: CloudFormationStackRecordList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetCloudFormationStackRecords request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetContactMethodsRequest {
    /**
     * The protocols used to send notifications, such as Email, or SMS (text messaging). Specify a protocol in your request to return information about a specific contact method protocol.
     */
    protocols?: ContactProtocolsList;
  }
  export interface GetContactMethodsResult {
    /**
     * An array of objects that describe the contact methods.
     */
    contactMethods?: ContactMethodsList;
  }
  export interface GetContainerAPIMetadataRequest {
  }
  export interface GetContainerAPIMetadataResult {
    /**
     * Metadata about Lightsail containers, such as the current version of the Lightsail Control (lightsailctl) plugin.
     */
    metadata?: ContainerServiceMetadataEntryList;
  }
  export interface GetContainerImagesRequest {
    /**
     * The name of the container service for which to return registered container images.
     */
    serviceName: ContainerServiceName;
  }
  export interface GetContainerImagesResult {
    /**
     * An array of objects that describe container images that are registered to the container service.
     */
    containerImages?: ContainerImageList;
  }
  export interface GetContainerLogRequest {
    /**
     * The name of the container service for which to get a container log.
     */
    serviceName: ContainerServiceName;
    /**
     * The name of the container that is either running or previously ran on the container service for which to return a log.
     */
    containerName: string;
    /**
     * The start of the time interval for which to get log data. Constraints:   Specified in Coordinated Universal Time (UTC).   Specified in the Unix time format. For example, if you wish to use a start time of October 1, 2018, at 8 PM UTC, specify 1538424000 as the start time.   You can convert a human-friendly time to Unix time format using a converter like Epoch converter.
     */
    startTime?: IsoDate;
    /**
     * The end of the time interval for which to get log data. Constraints:   Specified in Coordinated Universal Time (UTC).   Specified in the Unix time format. For example, if you wish to use an end time of October 1, 2018, at 9 PM UTC, specify 1538427600 as the end time.   You can convert a human-friendly time to Unix time format using a converter like Epoch converter.
     */
    endTime?: IsoDate;
    /**
     * The pattern to use to filter the returned log events to a specific term. The following are a few examples of filter patterns that you can specify:   To return all log events, specify a filter pattern of "".   To exclude log events that contain the ERROR term, and return all other log events, specify a filter pattern of "-ERROR".   To return log events that contain the ERROR term, specify a filter pattern of "ERROR".   To return log events that contain both the ERROR and Exception terms, specify a filter pattern of "ERROR Exception".   To return log events that contain the ERROR or the Exception term, specify a filter pattern of "?ERROR ?Exception".  
     */
    filterPattern?: string;
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetContainerLog request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetContainerLogResult {
    /**
     * An array of objects that describe the log events of a container.
     */
    logEvents?: ContainerServiceLogEventList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetContainerLog request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetContainerServiceDeploymentsRequest {
    /**
     * The name of the container service for which to return deployments.
     */
    serviceName: ContainerServiceName;
  }
  export interface GetContainerServiceDeploymentsResult {
    /**
     * An array of objects that describe deployments for a container service.
     */
    deployments?: ContainerServiceDeploymentList;
  }
  export interface GetContainerServiceMetricDataRequest {
    /**
     * The name of the container service for which to get metric data.
     */
    serviceName: ContainerServiceName;
    /**
     * The metric for which you want to return information. Valid container service metric names are listed below, along with the most useful statistics to include in your request, and the published unit value.    CPUUtilization - The average percentage of compute units that are currently in use across all nodes of the container service. This metric identifies the processing power required to run containers on each node of the container service. Statistics: The most useful statistics are Maximum and Average. Unit: The published unit is Percent.    MemoryUtilization - The average percentage of available memory that is currently in use across all nodes of the container service. This metric identifies the memory required to run containers on each node of the container service. Statistics: The most useful statistics are Maximum and Average. Unit: The published unit is Percent.  
     */
    metricName: ContainerServiceMetricName;
    /**
     * The start time of the time period.
     */
    startTime: IsoDate;
    /**
     * The end time of the time period.
     */
    endTime: IsoDate;
    /**
     * The granularity, in seconds, of the returned data points. All container service metric data is available in 5-minute (300 seconds) granularity.
     */
    period: MetricPeriod;
    /**
     * The statistic for the metric. The following statistics are available:    Minimum - The lowest value observed during the specified period. Use this value to determine low volumes of activity for your application.    Maximum - The highest value observed during the specified period. Use this value to determine high volumes of activity for your application.    Sum - All values submitted for the matching metric added together. You can use this statistic to determine the total volume of a metric.    Average - The value of Sum / SampleCount during the specified period. By comparing this statistic with the Minimum and Maximum values, you can determine the full scope of a metric and how close the average use is to the Minimum and Maximum values. This comparison helps you to know when to increase or decrease your resources.    SampleCount - The count, or number, of data points used for the statistical calculation.  
     */
    statistics: MetricStatisticList;
  }
  export interface GetContainerServiceMetricDataResult {
    /**
     * The name of the metric returned. 
     */
    metricName?: ContainerServiceMetricName;
    /**
     * An array of objects that describe the metric data returned.
     */
    metricData?: MetricDatapointList;
  }
  export interface GetContainerServicePowersRequest {
  }
  export interface GetContainerServicePowersResult {
    /**
     * An array of objects that describe the powers that can be specified for a container service.
     */
    powers?: ContainerServicePowerList;
  }
  export interface GetContainerServicesRequest {
    /**
     * The name of the container service for which to return information. When omitted, the response includes all of your container services in the AWS Region where the request is made.
     */
    serviceName?: ContainerServiceName;
  }
  export interface GetDiskRequest {
    /**
     * The name of the disk (e.g., my-disk).
     */
    diskName: ResourceName;
  }
  export interface GetDiskResult {
    /**
     * An object containing information about the disk.
     */
    disk?: Disk;
  }
  export interface GetDiskSnapshotRequest {
    /**
     * The name of the disk snapshot (e.g., my-disk-snapshot).
     */
    diskSnapshotName: ResourceName;
  }
  export interface GetDiskSnapshotResult {
    /**
     * An object containing information about the disk snapshot.
     */
    diskSnapshot?: DiskSnapshot;
  }
  export interface GetDiskSnapshotsRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetDiskSnapshots request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetDiskSnapshotsResult {
    /**
     * An array of objects containing information about all block storage disk snapshots.
     */
    diskSnapshots?: DiskSnapshotList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetDiskSnapshots request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetDisksRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetDisks request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetDisksResult {
    /**
     * An array of objects containing information about all block storage disks.
     */
    disks?: DiskList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetDisks request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetDistributionBundlesRequest {
  }
  export interface GetDistributionBundlesResult {
    /**
     * An object that describes a distribution bundle.
     */
    bundles?: DistributionBundleList;
  }
  export interface GetDistributionLatestCacheResetRequest {
    /**
     * The name of the distribution for which to return the timestamp of the last cache reset. Use the GetDistributions action to get a list of distribution names that you can specify. When omitted, the response includes the latest cache reset timestamp of all your distributions.
     */
    distributionName?: ResourceName;
  }
  export interface GetDistributionLatestCacheResetResult {
    /**
     * The status of the last cache reset.
     */
    status?: string;
    /**
     * The timestamp of the last cache reset (e.g., 1479734909.17) in Unix time format.
     */
    createTime?: IsoDate;
  }
  export interface GetDistributionMetricDataRequest {
    /**
     * The name of the distribution for which to get metric data. Use the GetDistributions action to get a list of distribution names that you can specify.
     */
    distributionName: ResourceName;
    /**
     * The metric for which you want to return information. Valid distribution metric names are listed below, along with the most useful statistics to include in your request, and the published unit value.     Requests  - The total number of viewer requests received by your Lightsail distribution, for all HTTP methods, and for both HTTP and HTTPS requests.  Statistics: The most useful statistic is Sum.  Unit: The published unit is None.     BytesDownloaded  - The number of bytes downloaded by viewers for GET, HEAD, and OPTIONS requests.  Statistics: The most useful statistic is Sum.  Unit: The published unit is None.     BytesUploaded   - The number of bytes uploaded to your origin by your Lightsail distribution, using POST and PUT requests.  Statistics: The most useful statistic is Sum.  Unit: The published unit is None.     TotalErrorRate  - The percentage of all viewer requests for which the response's HTTP status code was 4xx or 5xx.  Statistics: The most useful statistic is Average.  Unit: The published unit is Percent.     4xxErrorRate  - The percentage of all viewer requests for which the response's HTTP status cod was 4xx. In these cases, the client or client viewer may have made an error. For example, a status code of 404 (Not Found) means that the client requested an object that could not be found.  Statistics: The most useful statistic is Average.  Unit: The published unit is Percent.     5xxErrorRate  - The percentage of all viewer requests for which the response's HTTP status code was 5xx. In these cases, the origin server did not satisfy the requests. For example, a status code of 503 (Service Unavailable) means that the origin server is currently unavailable.  Statistics: The most useful statistic is Average.  Unit: The published unit is Percent.  
     */
    metricName: DistributionMetricName;
    /**
     * The start of the time interval for which to get metric data. Constraints:   Specified in Coordinated Universal Time (UTC).   Specified in the Unix time format. For example, if you wish to use a start time of October 1, 2018, at 8 PM UTC, specify 1538424000 as the start time.   You can convert a human-friendly time to Unix time format using a converter like Epoch converter.
     */
    startTime: timestamp;
    /**
     * The end of the time interval for which to get metric data. Constraints:   Specified in Coordinated Universal Time (UTC).   Specified in the Unix time format. For example, if you wish to use an end time of October 1, 2018, at 9 PM UTC, specify 1538427600 as the end time.   You can convert a human-friendly time to Unix time format using a converter like Epoch converter.
     */
    endTime: timestamp;
    /**
     * The granularity, in seconds, for the metric data points that will be returned.
     */
    period: MetricPeriod;
    /**
     * The unit for the metric data request. Valid units depend on the metric data being requested. For the valid units with each available metric, see the metricName parameter.
     */
    unit: MetricUnit;
    /**
     * The statistic for the metric. The following statistics are available:    Minimum - The lowest value observed during the specified period. Use this value to determine low volumes of activity for your application.    Maximum - The highest value observed during the specified period. Use this value to determine high volumes of activity for your application.    Sum - All values submitted for the matching metric added together. You can use this statistic to determine the total volume of a metric.    Average - The value of Sum / SampleCount during the specified period. By comparing this statistic with the Minimum and Maximum values, you can determine the full scope of a metric and how close the average use is to the Minimum and Maximum values. This comparison helps you to know when to increase or decrease your resources.    SampleCount - The count, or number, of data points used for the statistical calculation.  
     */
    statistics: MetricStatisticList;
  }
  export interface GetDistributionMetricDataResult {
    /**
     * The name of the metric returned.
     */
    metricName?: DistributionMetricName;
    /**
     * An array of objects that describe the metric data returned.
     */
    metricData?: MetricDatapointList;
  }
  export interface GetDistributionsRequest {
    /**
     * The name of the distribution for which to return information. When omitted, the response includes all of your distributions in the AWS Region where the request is made.
     */
    distributionName?: ResourceName;
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetDistributions request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetDistributionsResult {
    /**
     * An array of objects that describe your distributions.
     */
    distributions?: DistributionList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetDistributions request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetDomainRequest {
    /**
     * The domain name for which your want to return information about.
     */
    domainName: DomainName;
  }
  export interface GetDomainResult {
    /**
     * An array of key-value pairs containing information about your get domain request.
     */
    domain?: Domain;
  }
  export interface GetDomainsRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetDomains request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetDomainsResult {
    /**
     * An array of key-value pairs containing information about each of the domain entries in the user's account.
     */
    domains?: DomainList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetDomains request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetExportSnapshotRecordsRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetExportSnapshotRecords request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetExportSnapshotRecordsResult {
    /**
     * A list of objects describing the export snapshot records.
     */
    exportSnapshotRecords?: ExportSnapshotRecordList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetExportSnapshotRecords request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetInstanceAccessDetailsRequest {
    /**
     * The name of the instance to access.
     */
    instanceName: ResourceName;
    /**
     * The protocol to use to connect to your instance. Defaults to ssh.
     */
    protocol?: InstanceAccessProtocol;
  }
  export interface GetInstanceAccessDetailsResult {
    /**
     * An array of key-value pairs containing information about a get instance access request.
     */
    accessDetails?: InstanceAccessDetails;
  }
  export interface GetInstanceMetricDataRequest {
    /**
     * The name of the instance for which you want to get metrics data.
     */
    instanceName: ResourceName;
    /**
     * The metric for which you want to return information. Valid instance metric names are listed below, along with the most useful statistics to include in your request, and the published unit value.     BurstCapacityPercentage  - The percentage of CPU performance available for your instance to burst above its baseline. Your instance continuously accrues and consumes burst capacity. Burst capacity stops accruing when your instance's BurstCapacityPercentage reaches 100%. For more information, see Viewing instance burst capacity in Amazon Lightsail.  Statistics: The most useful statistics are Maximum and Average.  Unit: The published unit is Percent.     BurstCapacityTime  - The available amount of time for your instance to burst at 100% CPU utilization. Your instance continuously accrues and consumes burst capacity. Burst capacity time stops accruing when your instance's BurstCapacityPercentage metric reaches 100%. Burst capacity time is consumed at the full rate only when your instance operates at 100% CPU utilization. For example, if your instance operates at 50% CPU utilization in the burstable zone for a 5-minute period, then it consumes CPU burst capacity minutes at a 50% rate in that period. Your instance consumed 2 minutes and 30 seconds of CPU burst capacity minutes in the 5-minute period. For more information, see Viewing instance burst capacity in Amazon Lightsail.  Statistics: The most useful statistics are Maximum and Average.  Unit: The published unit is Seconds.     CPUUtilization  - The percentage of allocated compute units that are currently in use on the instance. This metric identifies the processing power to run the applications on the instance. Tools in your operating system can show a lower percentage than Lightsail when the instance is not allocated a full processor core.  Statistics: The most useful statistics are Maximum and Average.  Unit: The published unit is Percent.     NetworkIn  - The number of bytes received on all network interfaces by the instance. This metric identifies the volume of incoming network traffic to the instance. The number reported is the number of bytes received during the period. Because this metric is reported in 5-minute intervals, divide the reported number by 300 to find Bytes/second.  Statistics: The most useful statistic is Sum.  Unit: The published unit is Bytes.     NetworkOut  - The number of bytes sent out on all network interfaces by the instance. This metric identifies the volume of outgoing network traffic from the instance. The number reported is the number of bytes sent during the period. Because this metric is reported in 5-minute intervals, divide the reported number by 300 to find Bytes/second.  Statistics: The most useful statistic is Sum.  Unit: The published unit is Bytes.     StatusCheckFailed  - Reports whether the instance passed or failed both the instance status check and the system status check. This metric can be either 0 (passed) or 1 (failed). This metric data is available in 1-minute (60 seconds) granularity.  Statistics: The most useful statistic is Sum.  Unit: The published unit is Count.     StatusCheckFailed_Instance  - Reports whether the instance passed or failed the instance status check. This metric can be either 0 (passed) or 1 (failed). This metric data is available in 1-minute (60 seconds) granularity.  Statistics: The most useful statistic is Sum.  Unit: The published unit is Count.     StatusCheckFailed_System  - Reports whether the instance passed or failed the system status check. This metric can be either 0 (passed) or 1 (failed). This metric data is available in 1-minute (60 seconds) granularity.  Statistics: The most useful statistic is Sum.  Unit: The published unit is Count.  
     */
    metricName: InstanceMetricName;
    /**
     * The granularity, in seconds, of the returned data points. The StatusCheckFailed, StatusCheckFailed_Instance, and StatusCheckFailed_System instance metric data is available in 1-minute (60 seconds) granularity. All other instance metric data is available in 5-minute (300 seconds) granularity.
     */
    period: MetricPeriod;
    /**
     * The start time of the time period.
     */
    startTime: timestamp;
    /**
     * The end time of the time period.
     */
    endTime: timestamp;
    /**
     * The unit for the metric data request. Valid units depend on the metric data being requested. For the valid units to specify with each available metric, see the metricName parameter.
     */
    unit: MetricUnit;
    /**
     * The statistic for the metric. The following statistics are available:    Minimum - The lowest value observed during the specified period. Use this value to determine low volumes of activity for your application.    Maximum - The highest value observed during the specified period. Use this value to determine high volumes of activity for your application.    Sum - All values submitted for the matching metric added together. You can use this statistic to determine the total volume of a metric.    Average - The value of Sum / SampleCount during the specified period. By comparing this statistic with the Minimum and Maximum values, you can determine the full scope of a metric and how close the average use is to the Minimum and Maximum values. This comparison helps you to know when to increase or decrease your resources.    SampleCount - The count, or number, of data points used for the statistical calculation.  
     */
    statistics: MetricStatisticList;
  }
  export interface GetInstanceMetricDataResult {
    /**
     * The name of the metric returned.
     */
    metricName?: InstanceMetricName;
    /**
     * An array of objects that describe the metric data returned.
     */
    metricData?: MetricDatapointList;
  }
  export interface GetInstancePortStatesRequest {
    /**
     * The name of the instance for which to return firewall port states.
     */
    instanceName: ResourceName;
  }
  export interface GetInstancePortStatesResult {
    /**
     * An array of objects that describe the firewall port states for the specified instance.
     */
    portStates?: InstancePortStateList;
  }
  export interface GetInstanceRequest {
    /**
     * The name of the instance.
     */
    instanceName: ResourceName;
  }
  export interface GetInstanceResult {
    /**
     * An array of key-value pairs containing information about the specified instance.
     */
    instance?: Instance;
  }
  export interface GetInstanceSnapshotRequest {
    /**
     * The name of the snapshot for which you are requesting information.
     */
    instanceSnapshotName: ResourceName;
  }
  export interface GetInstanceSnapshotResult {
    /**
     * An array of key-value pairs containing information about the results of your get instance snapshot request.
     */
    instanceSnapshot?: InstanceSnapshot;
  }
  export interface GetInstanceSnapshotsRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetInstanceSnapshots request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetInstanceSnapshotsResult {
    /**
     * An array of key-value pairs containing information about the results of your get instance snapshots request.
     */
    instanceSnapshots?: InstanceSnapshotList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetInstanceSnapshots request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetInstanceStateRequest {
    /**
     * The name of the instance to get state information about.
     */
    instanceName: ResourceName;
  }
  export interface GetInstanceStateResult {
    /**
     * The state of the instance.
     */
    state?: InstanceState;
  }
  export interface GetInstancesRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetInstances request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetInstancesResult {
    /**
     * An array of key-value pairs containing information about your instances.
     */
    instances?: InstanceList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetInstances request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetKeyPairRequest {
    /**
     * The name of the key pair for which you are requesting information.
     */
    keyPairName: ResourceName;
  }
  export interface GetKeyPairResult {
    /**
     * An array of key-value pairs containing information about the key pair.
     */
    keyPair?: KeyPair;
  }
  export interface GetKeyPairsRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetKeyPairs request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetKeyPairsResult {
    /**
     * An array of key-value pairs containing information about the key pairs.
     */
    keyPairs?: KeyPairList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetKeyPairs request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetLoadBalancerMetricDataRequest {
    /**
     * The name of the load balancer.
     */
    loadBalancerName: ResourceName;
    /**
     * The metric for which you want to return information. Valid load balancer metric names are listed below, along with the most useful statistics to include in your request, and the published unit value.     ClientTLSNegotiationErrorCount  - The number of TLS connections initiated by the client that did not establish a session with the load balancer due to a TLS error generated by the load balancer. Possible causes include a mismatch of ciphers or protocols.  Statistics: The most useful statistic is Sum.  Unit: The published unit is Count.     HealthyHostCount  - The number of target instances that are considered healthy.  Statistics: The most useful statistic are Average, Minimum, and Maximum.  Unit: The published unit is Count.     HTTPCode_Instance_2XX_Count  - The number of HTTP 2XX response codes generated by the target instances. This does not include any response codes generated by the load balancer.  Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all return 1.  Unit: The published unit is Count.     HTTPCode_Instance_3XX_Count  - The number of HTTP 3XX response codes generated by the target instances. This does not include any response codes generated by the load balancer.  Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all return 1.  Unit: The published unit is Count.     HTTPCode_Instance_4XX_Count  - The number of HTTP 4XX response codes generated by the target instances. This does not include any response codes generated by the load balancer.  Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all return 1.  Unit: The published unit is Count.     HTTPCode_Instance_5XX_Count  - The number of HTTP 5XX response codes generated by the target instances. This does not include any response codes generated by the load balancer.  Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all return 1.  Unit: The published unit is Count.     HTTPCode_LB_4XX_Count  - The number of HTTP 4XX client error codes that originated from the load balancer. Client errors are generated when requests are malformed or incomplete. These requests were not received by the target instance. This count does not include response codes generated by the target instances.  Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all return 1.  Unit: The published unit is Count.     HTTPCode_LB_5XX_Count  - The number of HTTP 5XX server error codes that originated from the load balancer. This does not include any response codes generated by the target instance. This metric is reported if there are no healthy instances attached to the load balancer, or if the request rate exceeds the capacity of the instances (spillover) or the load balancer.  Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all return 1.  Unit: The published unit is Count.     InstanceResponseTime  - The time elapsed, in seconds, after the request leaves the load balancer until a response from the target instance is received.  Statistics: The most useful statistic is Average.  Unit: The published unit is Seconds.     RejectedConnectionCount  - The number of connections that were rejected because the load balancer had reached its maximum number of connections.  Statistics: The most useful statistic is Sum.  Unit: The published unit is Count.     RequestCount  - The number of requests processed over IPv4. This count includes only the requests with a response generated by a target instance of the load balancer.  Statistics: The most useful statistic is Sum. Note that Minimum, Maximum, and Average all return 1.  Unit: The published unit is Count.     UnhealthyHostCount  - The number of target instances that are considered unhealthy.  Statistics: The most useful statistic are Average, Minimum, and Maximum.  Unit: The published unit is Count.  
     */
    metricName: LoadBalancerMetricName;
    /**
     * The granularity, in seconds, of the returned data points.
     */
    period: MetricPeriod;
    /**
     * The start time of the period.
     */
    startTime: timestamp;
    /**
     * The end time of the period.
     */
    endTime: timestamp;
    /**
     * The unit for the metric data request. Valid units depend on the metric data being requested. For the valid units with each available metric, see the metricName parameter.
     */
    unit: MetricUnit;
    /**
     * The statistic for the metric. The following statistics are available:    Minimum - The lowest value observed during the specified period. Use this value to determine low volumes of activity for your application.    Maximum - The highest value observed during the specified period. Use this value to determine high volumes of activity for your application.    Sum - All values submitted for the matching metric added together. You can use this statistic to determine the total volume of a metric.    Average - The value of Sum / SampleCount during the specified period. By comparing this statistic with the Minimum and Maximum values, you can determine the full scope of a metric and how close the average use is to the Minimum and Maximum values. This comparison helps you to know when to increase or decrease your resources.    SampleCount - The count, or number, of data points used for the statistical calculation.  
     */
    statistics: MetricStatisticList;
  }
  export interface GetLoadBalancerMetricDataResult {
    /**
     * The name of the metric returned.
     */
    metricName?: LoadBalancerMetricName;
    /**
     * An array of objects that describe the metric data returned.
     */
    metricData?: MetricDatapointList;
  }
  export interface GetLoadBalancerRequest {
    /**
     * The name of the load balancer.
     */
    loadBalancerName: ResourceName;
  }
  export interface GetLoadBalancerResult {
    /**
     * An object containing information about your load balancer.
     */
    loadBalancer?: LoadBalancer;
  }
  export interface GetLoadBalancerTlsCertificatesRequest {
    /**
     * The name of the load balancer you associated with your SSL/TLS certificate.
     */
    loadBalancerName: ResourceName;
  }
  export interface GetLoadBalancerTlsCertificatesResult {
    /**
     * An array of LoadBalancerTlsCertificate objects describing your SSL/TLS certificates.
     */
    tlsCertificates?: LoadBalancerTlsCertificateList;
  }
  export interface GetLoadBalancersRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetLoadBalancers request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetLoadBalancersResult {
    /**
     * An array of LoadBalancer objects describing your load balancers.
     */
    loadBalancers?: LoadBalancerList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetLoadBalancers request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetOperationRequest {
    /**
     * A GUID used to identify the operation.
     */
    operationId: NonEmptyString;
  }
  export interface GetOperationResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface GetOperationsForResourceRequest {
    /**
     * The name of the resource for which you are requesting information.
     */
    resourceName: ResourceName;
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetOperationsForResource request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetOperationsForResourceResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
    /**
     * (Deprecated) Returns the number of pages of results that remain.  In releases prior to June 12, 2017, this parameter returned null by the API. It is now deprecated, and the API returns the next page token parameter instead. 
     */
    nextPageCount?: string;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetOperationsForResource request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetOperationsRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetOperations request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetOperationsResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetOperations request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetRegionsRequest {
    /**
     * A Boolean value indicating whether to also include Availability Zones in your get regions request. Availability Zones are indicated with a letter: e.g., us-east-2a.
     */
    includeAvailabilityZones?: boolean;
    /**
     * A Boolean value indicating whether to also include Availability Zones for databases in your get regions request. Availability Zones are indicated with a letter (e.g., us-east-2a).
     */
    includeRelationalDatabaseAvailabilityZones?: boolean;
  }
  export interface GetRegionsResult {
    /**
     * An array of key-value pairs containing information about your get regions request.
     */
    regions?: RegionList;
  }
  export interface GetRelationalDatabaseBlueprintsRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetRelationalDatabaseBlueprints request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetRelationalDatabaseBlueprintsResult {
    /**
     * An object describing the result of your get relational database blueprints request.
     */
    blueprints?: RelationalDatabaseBlueprintList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetRelationalDatabaseBlueprints request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetRelationalDatabaseBundlesRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetRelationalDatabaseBundles request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetRelationalDatabaseBundlesResult {
    /**
     * An object describing the result of your get relational database bundles request.
     */
    bundles?: RelationalDatabaseBundleList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetRelationalDatabaseBundles request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetRelationalDatabaseEventsRequest {
    /**
     * The name of the database from which to get events.
     */
    relationalDatabaseName: ResourceName;
    /**
     * The number of minutes in the past from which to retrieve events. For example, to get all events from the past 2 hours, enter 120. Default: 60  The minimum is 1 and the maximum is 14 days (20160 minutes).
     */
    durationInMinutes?: integer;
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetRelationalDatabaseEvents request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetRelationalDatabaseEventsResult {
    /**
     * An object describing the result of your get relational database events request.
     */
    relationalDatabaseEvents?: RelationalDatabaseEventList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetRelationalDatabaseEvents request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetRelationalDatabaseLogEventsRequest {
    /**
     * The name of your database for which to get log events.
     */
    relationalDatabaseName: ResourceName;
    /**
     * The name of the log stream. Use the get relational database log streams operation to get a list of available log streams.
     */
    logStreamName: string;
    /**
     * The start of the time interval from which to get log events. Constraints:   Specified in Coordinated Universal Time (UTC).   Specified in the Unix time format. For example, if you wish to use a start time of October 1, 2018, at 8 PM UTC, then you input 1538424000 as the start time.  
     */
    startTime?: IsoDate;
    /**
     * The end of the time interval from which to get log events. Constraints:   Specified in Coordinated Universal Time (UTC).   Specified in the Unix time format. For example, if you wish to use an end time of October 1, 2018, at 8 PM UTC, then you input 1538424000 as the end time.  
     */
    endTime?: IsoDate;
    /**
     * Parameter to specify if the log should start from head or tail. If true is specified, the log event starts from the head of the log. If false is specified, the log event starts from the tail of the log.  For PostgreSQL, the default value of false is the only option available. 
     */
    startFromHead?: boolean;
    /**
     * The token to advance to the next or previous page of results from your request. To get a page token, perform an initial GetRelationalDatabaseLogEvents request. If your results are paginated, the response will return a next forward token and/or next backward token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetRelationalDatabaseLogEventsResult {
    /**
     * An object describing the result of your get relational database log events request.
     */
    resourceLogEvents?: LogEventList;
    /**
     * A token used for advancing to the previous page of results from your get relational database log events request.
     */
    nextBackwardToken?: string;
    /**
     * A token used for advancing to the next page of results from your get relational database log events request.
     */
    nextForwardToken?: string;
  }
  export interface GetRelationalDatabaseLogStreamsRequest {
    /**
     * The name of your database for which to get log streams.
     */
    relationalDatabaseName: ResourceName;
  }
  export interface GetRelationalDatabaseLogStreamsResult {
    /**
     * An object describing the result of your get relational database log streams request.
     */
    logStreams?: StringList;
  }
  export interface GetRelationalDatabaseMasterUserPasswordRequest {
    /**
     * The name of your database for which to get the master user password.
     */
    relationalDatabaseName: ResourceName;
    /**
     * The password version to return. Specifying CURRENT or PREVIOUS returns the current or previous passwords respectively. Specifying PENDING returns the newest version of the password that will rotate to CURRENT. After the PENDING password rotates to CURRENT, the PENDING password is no longer available. Default: CURRENT 
     */
    passwordVersion?: RelationalDatabasePasswordVersion;
  }
  export interface GetRelationalDatabaseMasterUserPasswordResult {
    /**
     * The master user password for the password version specified.
     */
    masterUserPassword?: SensitiveString;
    /**
     * The timestamp when the specified version of the master user password was created.
     */
    createdAt?: IsoDate;
  }
  export interface GetRelationalDatabaseMetricDataRequest {
    /**
     * The name of your database from which to get metric data.
     */
    relationalDatabaseName: ResourceName;
    /**
     * The metric for which you want to return information. Valid relational database metric names are listed below, along with the most useful statistics to include in your request, and the published unit value. All relational database metric data is available in 1-minute (60 seconds) granularity.     CPUUtilization  - The percentage of CPU utilization currently in use on the database.  Statistics: The most useful statistics are Maximum and Average.  Unit: The published unit is Percent.     DatabaseConnections  - The number of database connections in use.  Statistics: The most useful statistics are Maximum and Sum.  Unit: The published unit is Count.     DiskQueueDepth  - The number of outstanding IOs (read/write requests) that are waiting to access the disk.  Statistics: The most useful statistic is Sum.  Unit: The published unit is Count.     FreeStorageSpace  - The amount of available storage space.  Statistics: The most useful statistic is Sum.  Unit: The published unit is Bytes.     NetworkReceiveThroughput  - The incoming (Receive) network traffic on the database, including both customer database traffic and AWS traffic used for monitoring and replication.  Statistics: The most useful statistic is Average.  Unit: The published unit is Bytes/Second.     NetworkTransmitThroughput  - The outgoing (Transmit) network traffic on the database, including both customer database traffic and AWS traffic used for monitoring and replication.  Statistics: The most useful statistic is Average.  Unit: The published unit is Bytes/Second.  
     */
    metricName: RelationalDatabaseMetricName;
    /**
     * The granularity, in seconds, of the returned data points. All relational database metric data is available in 1-minute (60 seconds) granularity.
     */
    period: MetricPeriod;
    /**
     * The start of the time interval from which to get metric data. Constraints:   Specified in Coordinated Universal Time (UTC).   Specified in the Unix time format. For example, if you wish to use a start time of October 1, 2018, at 8 PM UTC, then you input 1538424000 as the start time.  
     */
    startTime: IsoDate;
    /**
     * The end of the time interval from which to get metric data. Constraints:   Specified in Coordinated Universal Time (UTC).   Specified in the Unix time format. For example, if you wish to use an end time of October 1, 2018, at 8 PM UTC, then you input 1538424000 as the end time.  
     */
    endTime: IsoDate;
    /**
     * The unit for the metric data request. Valid units depend on the metric data being requested. For the valid units with each available metric, see the metricName parameter.
     */
    unit: MetricUnit;
    /**
     * The statistic for the metric. The following statistics are available:    Minimum - The lowest value observed during the specified period. Use this value to determine low volumes of activity for your application.    Maximum - The highest value observed during the specified period. Use this value to determine high volumes of activity for your application.    Sum - All values submitted for the matching metric added together. You can use this statistic to determine the total volume of a metric.    Average - The value of Sum / SampleCount during the specified period. By comparing this statistic with the Minimum and Maximum values, you can determine the full scope of a metric and how close the average use is to the Minimum and Maximum values. This comparison helps you to know when to increase or decrease your resources.    SampleCount - The count, or number, of data points used for the statistical calculation.  
     */
    statistics: MetricStatisticList;
  }
  export interface GetRelationalDatabaseMetricDataResult {
    /**
     * The name of the metric returned.
     */
    metricName?: RelationalDatabaseMetricName;
    /**
     * An array of objects that describe the metric data returned.
     */
    metricData?: MetricDatapointList;
  }
  export interface GetRelationalDatabaseParametersRequest {
    /**
     * The name of your database for which to get parameters.
     */
    relationalDatabaseName: ResourceName;
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetRelationalDatabaseParameters request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetRelationalDatabaseParametersResult {
    /**
     * An object describing the result of your get relational database parameters request.
     */
    parameters?: RelationalDatabaseParameterList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetRelationalDatabaseParameters request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetRelationalDatabaseRequest {
    /**
     * The name of the database that you are looking up.
     */
    relationalDatabaseName: ResourceName;
  }
  export interface GetRelationalDatabaseResult {
    /**
     * An object describing the specified database.
     */
    relationalDatabase?: RelationalDatabase;
  }
  export interface GetRelationalDatabaseSnapshotRequest {
    /**
     * The name of the database snapshot for which to get information.
     */
    relationalDatabaseSnapshotName: ResourceName;
  }
  export interface GetRelationalDatabaseSnapshotResult {
    /**
     * An object describing the specified database snapshot.
     */
    relationalDatabaseSnapshot?: RelationalDatabaseSnapshot;
  }
  export interface GetRelationalDatabaseSnapshotsRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetRelationalDatabaseSnapshots request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetRelationalDatabaseSnapshotsResult {
    /**
     * An object describing the result of your get relational database snapshots request.
     */
    relationalDatabaseSnapshots?: RelationalDatabaseSnapshotList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetRelationalDatabaseSnapshots request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetRelationalDatabasesRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetRelationalDatabases request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetRelationalDatabasesResult {
    /**
     * An object describing the result of your get relational databases request.
     */
    relationalDatabases?: RelationalDatabaseList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetRelationalDatabases request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export interface GetStaticIpRequest {
    /**
     * The name of the static IP in Lightsail.
     */
    staticIpName: ResourceName;
  }
  export interface GetStaticIpResult {
    /**
     * An array of key-value pairs containing information about the requested static IP.
     */
    staticIp?: StaticIp;
  }
  export interface GetStaticIpsRequest {
    /**
     * The token to advance to the next page of results from your request. To get a page token, perform an initial GetStaticIps request. If your results are paginated, the response will return a next page token that you can specify as the page token in a subsequent request.
     */
    pageToken?: string;
  }
  export interface GetStaticIpsResult {
    /**
     * An array of key-value pairs containing information about your get static IPs request.
     */
    staticIps?: StaticIpList;
    /**
     * The token to advance to the next page of results from your request. A next page token is not returned if there are no more results to display. To get the next page of results, perform another GetStaticIps request and specify the next page token using the pageToken parameter.
     */
    nextPageToken?: string;
  }
  export type HeaderEnum = "Accept"|"Accept-Charset"|"Accept-Datetime"|"Accept-Encoding"|"Accept-Language"|"Authorization"|"CloudFront-Forwarded-Proto"|"CloudFront-Is-Desktop-Viewer"|"CloudFront-Is-Mobile-Viewer"|"CloudFront-Is-SmartTV-Viewer"|"CloudFront-Is-Tablet-Viewer"|"CloudFront-Viewer-Country"|"Host"|"Origin"|"Referer"|string;
  export type HeaderForwardList = HeaderEnum[];
  export interface HeaderObject {
    /**
     * The headers that you want your distribution to forward to your origin and base caching on. You can configure your distribution to do one of the following:     all  - Forward all headers to your origin.     none  - Forward only the default headers.     allow-list  - Forward only the headers you specify using the headersAllowList parameter.  
     */
    option?: ForwardValues;
    /**
     * The specific headers to forward to your distribution's origin.
     */
    headersAllowList?: HeaderForwardList;
  }
  export interface HostKeyAttributes {
    /**
     * The SSH host key algorithm or the RDP certificate format. For SSH host keys, the algorithm may be ssh-rsa, ecdsa-sha2-nistp256, ssh-ed25519, etc. For RDP certificates, the algorithm is always x509-cert.
     */
    algorithm?: string;
    /**
     * The public SSH host key or the RDP certificate.
     */
    publicKey?: string;
    /**
     * The time that the SSH host key or RDP certificate was recorded by Lightsail.
     */
    witnessedAt?: IsoDate;
    /**
     * The SHA-1 fingerprint of the returned SSH host key or RDP certificate.   Example of an SHA-1 SSH fingerprint:  SHA1:1CHH6FaAaXjtFOsR/t83vf91SR0    Example of an SHA-1 RDP fingerprint:  af:34:51:fe:09:f0:e0:da:b8:4e:56:ca:60:c2:10:ff:38:06:db:45   
     */
    fingerprintSHA1?: string;
    /**
     * The SHA-256 fingerprint of the returned SSH host key or RDP certificate.   Example of an SHA-256 SSH fingerprint:  SHA256:KTsMnRBh1IhD17HpdfsbzeGA4jOijm5tyXsMjKVbB8o    Example of an SHA-256 RDP fingerprint:  03:9b:36:9f:4b:de:4e:61:70:fc:7c:c9:78:e7:d2:1a:1c:25:a8:0c:91:f6:7c:e4:d6:a0:85:c8:b4:53:99:68   
     */
    fingerprintSHA256?: string;
    /**
     * The returned RDP certificate is valid after this point in time. This value is listed only for RDP certificates.
     */
    notValidBefore?: IsoDate;
    /**
     * The returned RDP certificate is not valid after this point in time. This value is listed only for RDP certificates.
     */
    notValidAfter?: IsoDate;
  }
  export type HostKeysList = HostKeyAttributes[];
  export type IAMAccessKeyId = string;
  export interface ImportKeyPairRequest {
    /**
     * The name of the key pair for which you want to import the public key.
     */
    keyPairName: ResourceName;
    /**
     * A base64-encoded public key of the ssh-rsa type.
     */
    publicKeyBase64: Base64;
  }
  export interface ImportKeyPairResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export type InUseResourceCount = number;
  export type IncludeCertificateDetails = boolean;
  export interface InputOrigin {
    /**
     * The name of the origin resource.
     */
    name?: ResourceName;
    /**
     * The AWS Region name of the origin resource.
     */
    regionName?: RegionName;
    /**
     * The protocol that your Amazon Lightsail distribution uses when establishing a connection with your origin to pull content.
     */
    protocolPolicy?: OriginProtocolPolicyEnum;
  }
  export interface Instance {
    /**
     * The name the user gave the instance (e.g., Amazon_Linux-1GB-Ohio-1).
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the instance (e.g., arn:aws:lightsail:us-east-2:123456789101:Instance/244ad76f-8aad-4741-809f-12345EXAMPLE).
     */
    arn?: NonEmptyString;
    /**
     * The support code. Include this code in your email to support when you have questions about an instance or another resource in Lightsail. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The timestamp when the instance was created (e.g., 1479734909.17) in Unix time format.
     */
    createdAt?: IsoDate;
    /**
     * The region name and Availability Zone where the instance is located.
     */
    location?: ResourceLocation;
    /**
     * The type of resource (usually Instance).
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The blueprint ID (e.g., os_amlinux_2016_03).
     */
    blueprintId?: NonEmptyString;
    /**
     * The friendly name of the blueprint (e.g., Amazon Linux).
     */
    blueprintName?: NonEmptyString;
    /**
     * The bundle for the instance (e.g., micro_1_0).
     */
    bundleId?: NonEmptyString;
    /**
     * An array of objects representing the add-ons enabled on the instance.
     */
    addOns?: AddOnList;
    /**
     * A Boolean value indicating whether this instance has a static IP assigned to it.
     */
    isStaticIp?: boolean;
    /**
     * The private IP address of the instance.
     */
    privateIpAddress?: IpAddress;
    /**
     * The public IP address of the instance.
     */
    publicIpAddress?: IpAddress;
    /**
     * The IPv6 addresses of the instance.
     */
    ipv6Addresses?: Ipv6AddressList;
    /**
     * The IP address type of the instance. The possible values are ipv4 for IPv4 only, and dualstack for IPv4 and IPv6.
     */
    ipAddressType?: IpAddressType;
    /**
     * The size of the vCPU and the amount of RAM for the instance.
     */
    hardware?: InstanceHardware;
    /**
     * Information about the public ports and monthly data transfer rates for the instance.
     */
    networking?: InstanceNetworking;
    /**
     * The status code and the state (e.g., running) for the instance.
     */
    state?: InstanceState;
    /**
     * The user name for connecting to the instance (e.g., ec2-user).
     */
    username?: NonEmptyString;
    /**
     * The name of the SSH key being used to connect to the instance (e.g., LightsailDefaultKeyPair).
     */
    sshKeyName?: ResourceName;
  }
  export interface InstanceAccessDetails {
    /**
     * For SSH access, the public key to use when accessing your instance For OpenSSH clients (e.g., command line SSH), you should save this value to tempkey-cert.pub.
     */
    certKey?: string;
    /**
     * For SSH access, the date on which the temporary keys expire.
     */
    expiresAt?: IsoDate;
    /**
     * The public IP address of the Amazon Lightsail instance.
     */
    ipAddress?: IpAddress;
    /**
     * For RDP access, the password for your Amazon Lightsail instance. Password will be an empty string if the password for your new instance is not ready yet. When you create an instance, it can take up to 15 minutes for the instance to be ready.  If you create an instance using any key pair other than the default (LightsailDefaultKeyPair), password will always be an empty string. If you change the Administrator password on the instance, Lightsail will continue to return the original password value. When accessing the instance using RDP, you need to manually enter the Administrator password after changing it from the default. 
     */
    password?: string;
    /**
     * For a Windows Server-based instance, an object with the data you can use to retrieve your password. This is only needed if password is empty and the instance is not new (and therefore the password is not ready yet). When you create an instance, it can take up to 15 minutes for the instance to be ready.
     */
    passwordData?: PasswordData;
    /**
     * For SSH access, the temporary private key. For OpenSSH clients (e.g., command line SSH), you should save this value to tempkey).
     */
    privateKey?: string;
    /**
     * The protocol for these Amazon Lightsail instance access details.
     */
    protocol?: InstanceAccessProtocol;
    /**
     * The name of this Amazon Lightsail instance.
     */
    instanceName?: ResourceName;
    /**
     * The user name to use when logging in to the Amazon Lightsail instance.
     */
    username?: string;
    /**
     * Describes the public SSH host keys or the RDP certificate.
     */
    hostKeys?: HostKeysList;
  }
  export type InstanceAccessProtocol = "ssh"|"rdp"|string;
  export interface InstanceEntry {
    /**
     * The name of the export snapshot record, which contains the exported Lightsail instance snapshot that will be used as the source of the new Amazon EC2 instance. Use the get export snapshot records operation to get a list of export snapshot records that you can use to create a CloudFormation stack.
     */
    sourceName: ResourceName;
    /**
     * The instance type (e.g., t2.micro) to use for the new Amazon EC2 instance.
     */
    instanceType: NonEmptyString;
    /**
     * The port configuration to use for the new Amazon EC2 instance. The following configuration options are available:    DEFAULT - Use the default firewall settings from the Lightsail instance blueprint. If this is specified, then IPv4 and IPv6 will be configured for the new instance that is created in Amazon EC2.    INSTANCE - Use the configured firewall settings from the source Lightsail instance. If this is specified, the new instance that is created in Amazon EC2 will be configured to match the configuration of the source Lightsail instance. For example, if the source instance is configured for dual-stack (IPv4 and IPv6), then IPv4 and IPv6 will be configured for the new instance that is created in Amazon EC2. If the source instance is configured for IPv4 only, then only IPv4 will be configured for the new instance that is created in Amazon EC2.    NONE - Use the default Amazon EC2 security group. If this is specified, then only IPv4 will be configured for the new instance that is created in Amazon EC2.    CLOSED - All ports closed. If this is specified, then only IPv4 will be configured for the new instance that is created in Amazon EC2.    If you configured lightsail-connect as a cidrListAliases on your instance, or if you chose to allow the Lightsail browser-based SSH or RDP clients to connect to your instance, that configuration is not carried over to your new Amazon EC2 instance. 
     */
    portInfoSource: PortInfoSourceType;
    /**
     * A launch script you can create that configures a server with additional user data. For example, you might want to run apt-get -y update.  Depending on the machine image you choose, the command to get software on your instance varies. Amazon Linux and CentOS use yum, Debian and Ubuntu use apt-get, and FreeBSD uses pkg. 
     */
    userData?: string;
    /**
     * The Availability Zone for the new Amazon EC2 instance.
     */
    availabilityZone: string;
  }
  export type InstanceEntryList = InstanceEntry[];
  export interface InstanceHardware {
    /**
     * The number of vCPUs the instance has.
     */
    cpuCount?: integer;
    /**
     * The disks attached to the instance.
     */
    disks?: DiskList;
    /**
     * The amount of RAM in GB on the instance (e.g., 1.0).
     */
    ramSizeInGb?: float;
  }
  export type InstanceHealthReason = "Lb.RegistrationInProgress"|"Lb.InitialHealthChecking"|"Lb.InternalError"|"Instance.ResponseCodeMismatch"|"Instance.Timeout"|"Instance.FailedHealthChecks"|"Instance.NotRegistered"|"Instance.NotInUse"|"Instance.DeregistrationInProgress"|"Instance.InvalidState"|"Instance.IpUnusable"|string;
  export type InstanceHealthState = "initial"|"healthy"|"unhealthy"|"unused"|"draining"|"unavailable"|string;
  export interface InstanceHealthSummary {
    /**
     * The name of the Lightsail instance for which you are requesting health check data.
     */
    instanceName?: ResourceName;
    /**
     * Describes the overall instance health. Valid values are below.
     */
    instanceHealth?: InstanceHealthState;
    /**
     * More information about the instance health. If the instanceHealth is healthy, then an instanceHealthReason value is not provided. If  instanceHealth  is initial, the  instanceHealthReason  value can be one of the following:     Lb.RegistrationInProgress  - The target instance is in the process of being registered with the load balancer.     Lb.InitialHealthChecking  - The Lightsail load balancer is still sending the target instance the minimum number of health checks required to determine its health status.   If  instanceHealth  is unhealthy, the  instanceHealthReason  value can be one of the following:     Instance.ResponseCodeMismatch  - The health checks did not return an expected HTTP code.     Instance.Timeout  - The health check requests timed out.     Instance.FailedHealthChecks  - The health checks failed because the connection to the target instance timed out, the target instance response was malformed, or the target instance failed the health check for an unknown reason.     Lb.InternalError  - The health checks failed due to an internal error.   If  instanceHealth  is unused, the  instanceHealthReason  value can be one of the following:     Instance.NotRegistered  - The target instance is not registered with the target group.     Instance.NotInUse  - The target group is not used by any load balancer, or the target instance is in an Availability Zone that is not enabled for its load balancer.     Instance.IpUnusable  - The target IP address is reserved for use by a Lightsail load balancer.     Instance.InvalidState  - The target is in the stopped or terminated state.   If  instanceHealth  is draining, the  instanceHealthReason  value can be one of the following:     Instance.DeregistrationInProgress  - The target instance is in the process of being deregistered and the deregistration delay period has not expired.  
     */
    instanceHealthReason?: InstanceHealthReason;
  }
  export type InstanceHealthSummaryList = InstanceHealthSummary[];
  export type InstanceList = Instance[];
  export type InstanceMetricName = "CPUUtilization"|"NetworkIn"|"NetworkOut"|"StatusCheckFailed"|"StatusCheckFailed_Instance"|"StatusCheckFailed_System"|"BurstCapacityTime"|"BurstCapacityPercentage"|string;
  export interface InstanceNetworking {
    /**
     * The amount of data in GB allocated for monthly data transfers.
     */
    monthlyTransfer?: MonthlyTransfer;
    /**
     * An array of key-value pairs containing information about the ports on the instance.
     */
    ports?: InstancePortInfoList;
  }
  export type InstancePlatform = "LINUX_UNIX"|"WINDOWS"|string;
  export type InstancePlatformList = InstancePlatform[];
  export interface InstancePortInfo {
    /**
     * The first port in a range of open ports on an instance. Allowed ports:   TCP and UDP - 0 to 65535    ICMP - The ICMP type for IPv4 addresses. For example, specify 8 as the fromPort (ICMP type), and -1 as the toPort (ICMP code), to enable ICMP Ping. For more information, see Control Messages on Wikipedia.   ICMPv6 - The ICMP type for IPv6 addresses. For example, specify 128 as the fromPort (ICMPv6 type), and 0 as toPort (ICMPv6 code). For more information, see Internet Control Message Protocol for IPv6.  
     */
    fromPort?: Port;
    /**
     * The last port in a range of open ports on an instance. Allowed ports:   TCP and UDP - 0 to 65535    ICMP - The ICMP code for IPv4 addresses. For example, specify 8 as the fromPort (ICMP type), and -1 as the toPort (ICMP code), to enable ICMP Ping. For more information, see Control Messages on Wikipedia.   ICMPv6 - The ICMP code for IPv6 addresses. For example, specify 128 as the fromPort (ICMPv6 type), and 0 as toPort (ICMPv6 code). For more information, see Internet Control Message Protocol for IPv6.  
     */
    toPort?: Port;
    /**
     * The IP protocol name. The name can be one of the following:    tcp - Transmission Control Protocol (TCP) provides reliable, ordered, and error-checked delivery of streamed data between applications running on hosts communicating by an IP network. If you have an application that doesn't require reliable data stream service, use UDP instead.    all - All transport layer protocol types. For more general information, see Transport layer on Wikipedia.    udp - With User Datagram Protocol (UDP), computer applications can send messages (or datagrams) to other hosts on an Internet Protocol (IP) network. Prior communications are not required to set up transmission channels or data paths. Applications that don't require reliable data stream service can use UDP, which provides a connectionless datagram service that emphasizes reduced latency over reliability. If you do require reliable data stream service, use TCP instead.    icmp - Internet Control Message Protocol (ICMP) is used to send error messages and operational information indicating success or failure when communicating with an instance. For example, an error is indicated when an instance could not be reached. When you specify icmp as the protocol, you must specify the ICMP type using the fromPort parameter, and ICMP code using the toPort parameter.  
     */
    protocol?: NetworkProtocol;
    /**
     * The location from which access is allowed. For example, Anywhere (0.0.0.0/0), or Custom if a specific IP address or range of IP addresses is allowed.
     */
    accessFrom?: string;
    /**
     * The type of access (Public or Private).
     */
    accessType?: PortAccessType;
    /**
     * The common name of the port information.
     */
    commonName?: string;
    /**
     * The access direction (inbound or outbound).  Lightsail currently supports only inbound access direction. 
     */
    accessDirection?: AccessDirection;
    /**
     * The IPv4 address, or range of IPv4 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol.  The ipv6Cidrs parameter lists the IPv6 addresses that are allowed to connect to an instance.  For more information about CIDR block notation, see Classless Inter-Domain Routing on Wikipedia.
     */
    cidrs?: StringList;
    /**
     * The IPv6 address, or range of IPv6 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol. Only devices with an IPv6 address can connect to an instance through IPv6; otherwise, IPv4 should be used.  The cidrs parameter lists the IPv4 addresses that are allowed to connect to an instance.  For more information about CIDR block notation, see Classless Inter-Domain Routing on Wikipedia.
     */
    ipv6Cidrs?: StringList;
    /**
     * An alias that defines access for a preconfigured range of IP addresses. The only alias currently supported is lightsail-connect, which allows IP addresses of the browser-based RDP/SSH client in the Lightsail console to connect to your instance.
     */
    cidrListAliases?: StringList;
  }
  export type InstancePortInfoList = InstancePortInfo[];
  export interface InstancePortState {
    /**
     * The first port in a range of open ports on an instance. Allowed ports:   TCP and UDP - 0 to 65535    ICMP - The ICMP type for IPv4 addresses. For example, specify 8 as the fromPort (ICMP type), and -1 as the toPort (ICMP code), to enable ICMP Ping. For more information, see Control Messages on Wikipedia.   ICMPv6 - The ICMP type for IPv6 addresses. For example, specify 128 as the fromPort (ICMPv6 type), and 0 as toPort (ICMPv6 code). For more information, see Internet Control Message Protocol for IPv6.  
     */
    fromPort?: Port;
    /**
     * The last port in a range of open ports on an instance. Allowed ports:   TCP and UDP - 0 to 65535    ICMP - The ICMP code for IPv4 addresses. For example, specify 8 as the fromPort (ICMP type), and -1 as the toPort (ICMP code), to enable ICMP Ping. For more information, see Control Messages on Wikipedia.   ICMPv6 - The ICMP code for IPv6 addresses. For example, specify 128 as the fromPort (ICMPv6 type), and 0 as toPort (ICMPv6 code). For more information, see Internet Control Message Protocol for IPv6.  
     */
    toPort?: Port;
    /**
     * The IP protocol name. The name can be one of the following:    tcp - Transmission Control Protocol (TCP) provides reliable, ordered, and error-checked delivery of streamed data between applications running on hosts communicating by an IP network. If you have an application that doesn't require reliable data stream service, use UDP instead.    all - All transport layer protocol types. For more general information, see Transport layer on Wikipedia.    udp - With User Datagram Protocol (UDP), computer applications can send messages (or datagrams) to other hosts on an Internet Protocol (IP) network. Prior communications are not required to set up transmission channels or data paths. Applications that don't require reliable data stream service can use UDP, which provides a connectionless datagram service that emphasizes reduced latency over reliability. If you do require reliable data stream service, use TCP instead.    icmp - Internet Control Message Protocol (ICMP) is used to send error messages and operational information indicating success or failure when communicating with an instance. For example, an error is indicated when an instance could not be reached. When you specify icmp as the protocol, you must specify the ICMP type using the fromPort parameter, and ICMP code using the toPort parameter.  
     */
    protocol?: NetworkProtocol;
    /**
     * Specifies whether the instance port is open or closed.  The port state for Lightsail instances is always open. 
     */
    state?: PortState;
    /**
     * The IPv4 address, or range of IPv4 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol.  The ipv6Cidrs parameter lists the IPv6 addresses that are allowed to connect to an instance.  For more information about CIDR block notation, see Classless Inter-Domain Routing on Wikipedia.
     */
    cidrs?: StringList;
    /**
     * The IPv6 address, or range of IPv6 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol. Only devices with an IPv6 address can connect to an instance through IPv6; otherwise, IPv4 should be used.  The cidrs parameter lists the IPv4 addresses that are allowed to connect to an instance.  For more information about CIDR block notation, see Classless Inter-Domain Routing on Wikipedia.
     */
    ipv6Cidrs?: StringList;
    /**
     * An alias that defines access for a preconfigured range of IP addresses. The only alias currently supported is lightsail-connect, which allows IP addresses of the browser-based RDP/SSH client in the Lightsail console to connect to your instance.
     */
    cidrListAliases?: StringList;
  }
  export type InstancePortStateList = InstancePortState[];
  export interface InstanceSnapshot {
    /**
     * The name of the snapshot.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the snapshot (e.g., arn:aws:lightsail:us-east-2:123456789101:InstanceSnapshot/d23b5706-3322-4d83-81e5-12345EXAMPLE).
     */
    arn?: NonEmptyString;
    /**
     * The support code. Include this code in your email to support when you have questions about an instance or another resource in Lightsail. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The timestamp when the snapshot was created (e.g., 1479907467.024).
     */
    createdAt?: IsoDate;
    /**
     * The region name and Availability Zone where you created the snapshot.
     */
    location?: ResourceLocation;
    /**
     * The type of resource (usually InstanceSnapshot).
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The state the snapshot is in.
     */
    state?: InstanceSnapshotState;
    /**
     * The progress of the snapshot.  This is populated only for disk snapshots, and is null for instance snapshots. 
     */
    progress?: string;
    /**
     * An array of disk objects containing information about all block storage disks.
     */
    fromAttachedDisks?: DiskList;
    /**
     * The instance from which the snapshot was created.
     */
    fromInstanceName?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the instance from which the snapshot was created (e.g., arn:aws:lightsail:us-east-2:123456789101:Instance/64b8404c-ccb1-430b-8daf-12345EXAMPLE).
     */
    fromInstanceArn?: NonEmptyString;
    /**
     * The blueprint ID from which you created the snapshot (e.g., os_debian_8_3). A blueprint is a virtual private server (or instance) image used to create instances quickly.
     */
    fromBlueprintId?: string;
    /**
     * The bundle ID from which you created the snapshot (e.g., micro_1_0).
     */
    fromBundleId?: string;
    /**
     * A Boolean value indicating whether the snapshot was created from an automatic snapshot.
     */
    isFromAutoSnapshot?: boolean;
    /**
     * The size in GB of the SSD.
     */
    sizeInGb?: integer;
  }
  export interface InstanceSnapshotInfo {
    /**
     * The bundle ID from which the source instance was created (e.g., micro_1_0).
     */
    fromBundleId?: NonEmptyString;
    /**
     * The blueprint ID from which the source instance (e.g., os_debian_8_3).
     */
    fromBlueprintId?: NonEmptyString;
    /**
     * A list of objects describing the disks that were attached to the source instance.
     */
    fromDiskInfo?: DiskInfoList;
  }
  export type InstanceSnapshotList = InstanceSnapshot[];
  export type InstanceSnapshotState = "pending"|"error"|"available"|string;
  export interface InstanceState {
    /**
     * The status code for the instance.
     */
    code?: integer;
    /**
     * The state of the instance (e.g., running or pending).
     */
    name?: string;
  }
  export type IpAddress = string;
  export type IpAddressType = "dualstack"|"ipv4"|string;
  export type Ipv6Address = string;
  export type Ipv6AddressList = Ipv6Address[];
  export interface IsVpcPeeredRequest {
  }
  export interface IsVpcPeeredResult {
    /**
     * Returns true if the Lightsail VPC is peered; otherwise, false.
     */
    isPeered?: boolean;
  }
  export type IsoDate = Date;
  export type IssuerCA = string;
  export type KeyAlgorithm = string;
  export interface KeyPair {
    /**
     * The friendly name of the SSH key pair.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the key pair (e.g., arn:aws:lightsail:us-east-2:123456789101:KeyPair/05859e3d-331d-48ba-9034-12345EXAMPLE).
     */
    arn?: NonEmptyString;
    /**
     * The support code. Include this code in your email to support when you have questions about an instance or another resource in Lightsail. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The timestamp when the key pair was created (e.g., 1479816991.349).
     */
    createdAt?: IsoDate;
    /**
     * The region name and Availability Zone where the key pair was created.
     */
    location?: ResourceLocation;
    /**
     * The resource type (usually KeyPair).
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The RSA fingerprint of the key pair.
     */
    fingerprint?: Base64;
  }
  export type KeyPairList = KeyPair[];
  export interface LightsailDistribution {
    /**
     * The name of the distribution.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the distribution.
     */
    arn?: NonEmptyString;
    /**
     * The support code. Include this code in your email to support when you have questions about your Lightsail distribution. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The timestamp when the distribution was created.
     */
    createdAt?: IsoDate;
    /**
     * An object that describes the location of the distribution, such as the AWS Region and Availability Zone.  Lightsail distributions are global resources that can reference an origin in any AWS Region, and distribute its content globally. However, all distributions are located in the us-east-1 Region. 
     */
    location?: ResourceLocation;
    /**
     * The Lightsail resource type (e.g., Distribution).
     */
    resourceType?: ResourceType;
    /**
     * The alternate domain names of the distribution.
     */
    alternativeDomainNames?: StringList;
    /**
     * The status of the distribution.
     */
    status?: string;
    /**
     * Indicates whether the distribution is enabled.
     */
    isEnabled?: boolean;
    /**
     * The domain name of the distribution.
     */
    domainName?: string;
    /**
     * The ID of the bundle currently applied to the distribution.
     */
    bundleId?: string;
    /**
     * The name of the SSL/TLS certificate attached to the distribution, if any.
     */
    certificateName?: ResourceName;
    /**
     * An object that describes the origin resource of the distribution, such as a Lightsail instance or load balancer. The distribution pulls, caches, and serves content from the origin.
     */
    origin?: Origin;
    /**
     * The public DNS of the origin.
     */
    originPublicDNS?: string;
    /**
     * An object that describes the default cache behavior of the distribution.
     */
    defaultCacheBehavior?: CacheBehavior;
    /**
     * An object that describes the cache behavior settings of the distribution.
     */
    cacheBehaviorSettings?: CacheSettings;
    /**
     * An array of objects that describe the per-path cache behavior of the distribution.
     */
    cacheBehaviors?: CacheBehaviorList;
    /**
     * Indicates whether the bundle that is currently applied to your distribution, specified using the distributionName parameter, can be changed to another bundle. Use the UpdateDistributionBundle action to change your distribution's bundle.
     */
    ableToUpdateBundle?: boolean;
    /**
     * The IP address type of the distribution. The possible values are ipv4 for IPv4 only, and dualstack for IPv4 and IPv6.
     */
    ipAddressType?: IpAddressType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
  }
  export interface LoadBalancer {
    /**
     * The name of the load balancer (e.g., my-load-balancer).
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the load balancer.
     */
    arn?: NonEmptyString;
    /**
     * The support code. Include this code in your email to support when you have questions about your Lightsail load balancer. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The date when your load balancer was created.
     */
    createdAt?: IsoDate;
    /**
     * The AWS Region where your load balancer was created (e.g., us-east-2a). Lightsail automatically creates your load balancer across Availability Zones.
     */
    location?: ResourceLocation;
    /**
     * The resource type (e.g., LoadBalancer.
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The DNS name of your Lightsail load balancer.
     */
    dnsName?: NonEmptyString;
    /**
     * The status of your load balancer. Valid values are below.
     */
    state?: LoadBalancerState;
    /**
     * The protocol you have enabled for your load balancer. Valid values are below. You can't just have HTTP_HTTPS, but you can have just HTTP.
     */
    protocol?: LoadBalancerProtocol;
    /**
     * An array of public port settings for your load balancer. For HTTP, use port 80. For HTTPS, use port 443.
     */
    publicPorts?: PortList;
    /**
     * The path you specified to perform your health checks. If no path is specified, the load balancer tries to make a request to the default (root) page.
     */
    healthCheckPath?: NonEmptyString;
    /**
     * The port where the load balancer will direct traffic to your Lightsail instances. For HTTP traffic, it's port 80. For HTTPS traffic, it's port 443.
     */
    instancePort?: integer;
    /**
     * An array of InstanceHealthSummary objects describing the health of the load balancer.
     */
    instanceHealthSummary?: InstanceHealthSummaryList;
    /**
     * An array of LoadBalancerTlsCertificateSummary objects that provide additional information about the SSL/TLS certificates. For example, if true, the certificate is attached to the load balancer.
     */
    tlsCertificateSummaries?: LoadBalancerTlsCertificateSummaryList;
    /**
     * A string to string map of the configuration options for your load balancer. Valid values are listed below.
     */
    configurationOptions?: LoadBalancerConfigurationOptions;
    /**
     * The IP address type of the load balancer. The possible values are ipv4 for IPv4 only, and dualstack for IPv4 and IPv6.
     */
    ipAddressType?: IpAddressType;
  }
  export type LoadBalancerAttributeName = "HealthCheckPath"|"SessionStickinessEnabled"|"SessionStickiness_LB_CookieDurationSeconds"|string;
  export type LoadBalancerConfigurationOptions = {[key: string]: string};
  export type LoadBalancerList = LoadBalancer[];
  export type LoadBalancerMetricName = "ClientTLSNegotiationErrorCount"|"HealthyHostCount"|"UnhealthyHostCount"|"HTTPCode_LB_4XX_Count"|"HTTPCode_LB_5XX_Count"|"HTTPCode_Instance_2XX_Count"|"HTTPCode_Instance_3XX_Count"|"HTTPCode_Instance_4XX_Count"|"HTTPCode_Instance_5XX_Count"|"InstanceResponseTime"|"RejectedConnectionCount"|"RequestCount"|string;
  export type LoadBalancerProtocol = "HTTP_HTTPS"|"HTTP"|string;
  export type LoadBalancerState = "active"|"provisioning"|"active_impaired"|"failed"|"unknown"|string;
  export interface LoadBalancerTlsCertificate {
    /**
     * The name of the SSL/TLS certificate (e.g., my-certificate).
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the SSL/TLS certificate.
     */
    arn?: NonEmptyString;
    /**
     * The support code. Include this code in your email to support when you have questions about your Lightsail load balancer or SSL/TLS certificate. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The time when you created your SSL/TLS certificate.
     */
    createdAt?: IsoDate;
    /**
     * The AWS Region and Availability Zone where you created your certificate.
     */
    location?: ResourceLocation;
    /**
     * The resource type (e.g., LoadBalancerTlsCertificate).     Instance  - A Lightsail instance (a virtual private server)     StaticIp  - A static IP address     KeyPair  - The key pair used to connect to a Lightsail instance     InstanceSnapshot  - A Lightsail instance snapshot     Domain  - A DNS zone     PeeredVpc  - A peered VPC     LoadBalancer  - A Lightsail load balancer     LoadBalancerTlsCertificate  - An SSL/TLS certificate associated with a Lightsail load balancer     Disk  - A Lightsail block storage disk     DiskSnapshot  - A block storage disk snapshot  
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The load balancer name where your SSL/TLS certificate is attached.
     */
    loadBalancerName?: ResourceName;
    /**
     * When true, the SSL/TLS certificate is attached to the Lightsail load balancer.
     */
    isAttached?: boolean;
    /**
     * The validation status of the SSL/TLS certificate. Valid values are below.
     */
    status?: LoadBalancerTlsCertificateStatus;
    /**
     * The domain name for your SSL/TLS certificate.
     */
    domainName?: DomainName;
    /**
     * An array of LoadBalancerTlsCertificateDomainValidationRecord objects describing the records.
     */
    domainValidationRecords?: LoadBalancerTlsCertificateDomainValidationRecordList;
    /**
     * The validation failure reason, if any, of the certificate. The following failure reasons are possible:     NO_AVAILABLE_CONTACTS  - This failure applies to email validation, which is not available for Lightsail certificates.     ADDITIONAL_VERIFICATION_REQUIRED  - Lightsail requires additional information to process this certificate request. This can happen as a fraud-protection measure, such as when the domain ranks within the Alexa top 1000 websites. To provide the required information, use the AWS Support Center to contact AWS Support.  You cannot request a certificate for Amazon-owned domain names such as those ending in amazonaws.com, cloudfront.net, or elasticbeanstalk.com.      DOMAIN_NOT_ALLOWED  - One or more of the domain names in the certificate request was reported as an unsafe domain by VirusTotal. To correct the problem, search for your domain name on the VirusTotal website. If your domain is reported as suspicious, see Google Help for Hacked Websites to learn what you can do. If you believe that the result is a false positive, notify the organization that is reporting the domain. VirusTotal is an aggregate of several antivirus and URL scanners and cannot remove your domain from a block list itself. After you correct the problem and the VirusTotal registry has been updated, request a new certificate. If you see this error and your domain is not included in the VirusTotal list, visit the AWS Support Center and create a case.     INVALID_PUBLIC_DOMAIN  - One or more of the domain names in the certificate request is not valid. Typically, this is because a domain name in the request is not a valid top-level domain. Try to request a certificate again, correcting any spelling errors or typos that were in the failed request, and ensure that all domain names in the request are for valid top-level domains. For example, you cannot request a certificate for example.invalidpublicdomain because invalidpublicdomain is not a valid top-level domain.     OTHER  - Typically, this failure occurs when there is a typographical error in one or more of the domain names in the certificate request. Try to request a certificate again, correcting any spelling errors or typos that were in the failed request.   
     */
    failureReason?: LoadBalancerTlsCertificateFailureReason;
    /**
     * The time when the SSL/TLS certificate was issued.
     */
    issuedAt?: IsoDate;
    /**
     * The issuer of the certificate.
     */
    issuer?: NonEmptyString;
    /**
     * The algorithm used to generate the key pair (the public and private key).
     */
    keyAlgorithm?: NonEmptyString;
    /**
     * The timestamp when the SSL/TLS certificate expires.
     */
    notAfter?: IsoDate;
    /**
     * The timestamp when the SSL/TLS certificate is first valid.
     */
    notBefore?: IsoDate;
    /**
     * An object that describes the status of the certificate renewal managed by Lightsail.
     */
    renewalSummary?: LoadBalancerTlsCertificateRenewalSummary;
    /**
     * The reason the certificate was revoked. This value is present only when the certificate status is REVOKED.
     */
    revocationReason?: LoadBalancerTlsCertificateRevocationReason;
    /**
     * The timestamp when the certificate was revoked. This value is present only when the certificate status is REVOKED.
     */
    revokedAt?: IsoDate;
    /**
     * The serial number of the certificate.
     */
    serial?: NonEmptyString;
    /**
     * The algorithm that was used to sign the certificate.
     */
    signatureAlgorithm?: NonEmptyString;
    /**
     * The name of the entity that is associated with the public key contained in the certificate.
     */
    subject?: NonEmptyString;
    /**
     * An array of strings that specify the alternate domains (e.g., example2.com) and subdomains (e.g., blog.example.com) for the certificate.
     */
    subjectAlternativeNames?: StringList;
  }
  export type LoadBalancerTlsCertificateDomainStatus = "PENDING_VALIDATION"|"FAILED"|"SUCCESS"|string;
  export interface LoadBalancerTlsCertificateDomainValidationOption {
    /**
     * The fully qualified domain name in the certificate request.
     */
    domainName?: DomainName;
    /**
     * The status of the domain validation. Valid values are listed below.
     */
    validationStatus?: LoadBalancerTlsCertificateDomainStatus;
  }
  export type LoadBalancerTlsCertificateDomainValidationOptionList = LoadBalancerTlsCertificateDomainValidationOption[];
  export interface LoadBalancerTlsCertificateDomainValidationRecord {
    /**
     * A fully qualified domain name in the certificate. For example, example.com.
     */
    name?: NonEmptyString;
    /**
     * The type of validation record. For example, CNAME for domain validation.
     */
    type?: NonEmptyString;
    /**
     * The value for that type.
     */
    value?: NonEmptyString;
    /**
     * The validation status. Valid values are listed below.
     */
    validationStatus?: LoadBalancerTlsCertificateDomainStatus;
    /**
     * The domain name against which your SSL/TLS certificate was validated.
     */
    domainName?: DomainName;
  }
  export type LoadBalancerTlsCertificateDomainValidationRecordList = LoadBalancerTlsCertificateDomainValidationRecord[];
  export type LoadBalancerTlsCertificateFailureReason = "NO_AVAILABLE_CONTACTS"|"ADDITIONAL_VERIFICATION_REQUIRED"|"DOMAIN_NOT_ALLOWED"|"INVALID_PUBLIC_DOMAIN"|"OTHER"|string;
  export type LoadBalancerTlsCertificateList = LoadBalancerTlsCertificate[];
  export type LoadBalancerTlsCertificateRenewalStatus = "PENDING_AUTO_RENEWAL"|"PENDING_VALIDATION"|"SUCCESS"|"FAILED"|string;
  export interface LoadBalancerTlsCertificateRenewalSummary {
    /**
     * The renewal status of the certificate. The following renewal status are possible:     PendingAutoRenewal  - Lightsail is attempting to automatically validate the domain names of the certificate. No further action is required.      PendingValidation  - Lightsail couldn't automatically validate one or more domain names of the certificate. You must take action to validate these domain names or the certificate won't be renewed. Check to make sure your certificate's domain validation records exist in your domain's DNS, and that your certificate remains in use.     Success  - All domain names in the certificate are validated, and Lightsail renewed the certificate. No further action is required.      Failed  - One or more domain names were not validated before the certificate expired, and Lightsail did not renew the certificate. You can request a new certificate using the CreateCertificate action.  
     */
    renewalStatus?: LoadBalancerTlsCertificateRenewalStatus;
    /**
     * Contains information about the validation of each domain name in the certificate, as it pertains to Lightsail's managed renewal. This is different from the initial validation that occurs as a result of the RequestCertificate request.
     */
    domainValidationOptions?: LoadBalancerTlsCertificateDomainValidationOptionList;
  }
  export type LoadBalancerTlsCertificateRevocationReason = "UNSPECIFIED"|"KEY_COMPROMISE"|"CA_COMPROMISE"|"AFFILIATION_CHANGED"|"SUPERCEDED"|"CESSATION_OF_OPERATION"|"CERTIFICATE_HOLD"|"REMOVE_FROM_CRL"|"PRIVILEGE_WITHDRAWN"|"A_A_COMPROMISE"|string;
  export type LoadBalancerTlsCertificateStatus = "PENDING_VALIDATION"|"ISSUED"|"INACTIVE"|"EXPIRED"|"VALIDATION_TIMED_OUT"|"REVOKED"|"FAILED"|"UNKNOWN"|string;
  export interface LoadBalancerTlsCertificateSummary {
    /**
     * The name of the SSL/TLS certificate.
     */
    name?: ResourceName;
    /**
     * When true, the SSL/TLS certificate is attached to the Lightsail load balancer.
     */
    isAttached?: boolean;
  }
  export type LoadBalancerTlsCertificateSummaryList = LoadBalancerTlsCertificateSummary[];
  export interface LogEvent {
    /**
     * The timestamp when the database log event was created.
     */
    createdAt?: IsoDate;
    /**
     * The message of the database log event.
     */
    message?: string;
  }
  export type LogEventList = LogEvent[];
  export interface MetricDatapoint {
    /**
     * The average.
     */
    average?: double;
    /**
     * The maximum.
     */
    maximum?: double;
    /**
     * The minimum.
     */
    minimum?: double;
    /**
     * The sample count.
     */
    sampleCount?: double;
    /**
     * The sum.
     */
    sum?: double;
    /**
     * The timestamp (e.g., 1479816991.349).
     */
    timestamp?: timestamp;
    /**
     * The unit. 
     */
    unit?: MetricUnit;
  }
  export type MetricDatapointList = MetricDatapoint[];
  export type MetricName = "CPUUtilization"|"NetworkIn"|"NetworkOut"|"StatusCheckFailed"|"StatusCheckFailed_Instance"|"StatusCheckFailed_System"|"ClientTLSNegotiationErrorCount"|"HealthyHostCount"|"UnhealthyHostCount"|"HTTPCode_LB_4XX_Count"|"HTTPCode_LB_5XX_Count"|"HTTPCode_Instance_2XX_Count"|"HTTPCode_Instance_3XX_Count"|"HTTPCode_Instance_4XX_Count"|"HTTPCode_Instance_5XX_Count"|"InstanceResponseTime"|"RejectedConnectionCount"|"RequestCount"|"DatabaseConnections"|"DiskQueueDepth"|"FreeStorageSpace"|"NetworkReceiveThroughput"|"NetworkTransmitThroughput"|"BurstCapacityTime"|"BurstCapacityPercentage"|string;
  export type MetricPeriod = number;
  export type MetricStatistic = "Minimum"|"Maximum"|"Sum"|"Average"|"SampleCount"|string;
  export type MetricStatisticList = MetricStatistic[];
  export type MetricUnit = "Seconds"|"Microseconds"|"Milliseconds"|"Bytes"|"Kilobytes"|"Megabytes"|"Gigabytes"|"Terabytes"|"Bits"|"Kilobits"|"Megabits"|"Gigabits"|"Terabits"|"Percent"|"Count"|"Bytes/Second"|"Kilobytes/Second"|"Megabytes/Second"|"Gigabytes/Second"|"Terabytes/Second"|"Bits/Second"|"Kilobits/Second"|"Megabits/Second"|"Gigabits/Second"|"Terabits/Second"|"Count/Second"|"None"|string;
  export interface MonitoredResourceInfo {
    /**
     * The Amazon Resource Name (ARN) of the resource being monitored.
     */
    arn?: ResourceArn;
    /**
     * The name of the Lightsail resource being monitored.
     */
    name?: ResourceName;
    /**
     * The Lightsail resource type of the resource being monitored. Instances, load balancers, and relational databases are the only Lightsail resources that can currently be monitored by alarms.
     */
    resourceType?: ResourceType;
  }
  export interface MonthlyTransfer {
    /**
     * The amount allocated per month (in GB).
     */
    gbPerMonthAllocated?: integer;
  }
  export type NetworkProtocol = "tcp"|"all"|"udp"|"icmp"|string;
  export type NonEmptyString = string;
  export type NotificationTriggerList = AlarmState[];
  export interface OpenInstancePublicPortsRequest {
    /**
     * An object to describe the ports to open for the specified instance.
     */
    portInfo: PortInfo;
    /**
     * The name of the instance for which to open ports.
     */
    instanceName: ResourceName;
  }
  export interface OpenInstancePublicPortsResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface Operation {
    /**
     * The ID of the operation.
     */
    id?: NonEmptyString;
    /**
     * The resource name.
     */
    resourceName?: ResourceName;
    /**
     * The resource type. 
     */
    resourceType?: ResourceType;
    /**
     * The timestamp when the operation was initialized (e.g., 1479816991.349).
     */
    createdAt?: IsoDate;
    /**
     * The AWS Region and Availability Zone.
     */
    location?: ResourceLocation;
    /**
     * A Boolean value indicating whether the operation is terminal.
     */
    isTerminal?: boolean;
    /**
     * Details about the operation (e.g., Debian-1GB-Ohio-1).
     */
    operationDetails?: string;
    /**
     * The type of operation. 
     */
    operationType?: OperationType;
    /**
     * The status of the operation. 
     */
    status?: OperationStatus;
    /**
     * The timestamp when the status was changed (e.g., 1479816991.349).
     */
    statusChangedAt?: IsoDate;
    /**
     * The error code.
     */
    errorCode?: string;
    /**
     * The error details.
     */
    errorDetails?: string;
  }
  export type OperationList = Operation[];
  export type OperationStatus = "NotStarted"|"Started"|"Failed"|"Completed"|"Succeeded"|string;
  export type OperationType = "DeleteKnownHostKeys"|"DeleteInstance"|"CreateInstance"|"StopInstance"|"StartInstance"|"RebootInstance"|"OpenInstancePublicPorts"|"PutInstancePublicPorts"|"CloseInstancePublicPorts"|"AllocateStaticIp"|"ReleaseStaticIp"|"AttachStaticIp"|"DetachStaticIp"|"UpdateDomainEntry"|"DeleteDomainEntry"|"CreateDomain"|"DeleteDomain"|"CreateInstanceSnapshot"|"DeleteInstanceSnapshot"|"CreateInstancesFromSnapshot"|"CreateLoadBalancer"|"DeleteLoadBalancer"|"AttachInstancesToLoadBalancer"|"DetachInstancesFromLoadBalancer"|"UpdateLoadBalancerAttribute"|"CreateLoadBalancerTlsCertificate"|"DeleteLoadBalancerTlsCertificate"|"AttachLoadBalancerTlsCertificate"|"CreateDisk"|"DeleteDisk"|"AttachDisk"|"DetachDisk"|"CreateDiskSnapshot"|"DeleteDiskSnapshot"|"CreateDiskFromSnapshot"|"CreateRelationalDatabase"|"UpdateRelationalDatabase"|"DeleteRelationalDatabase"|"CreateRelationalDatabaseFromSnapshot"|"CreateRelationalDatabaseSnapshot"|"DeleteRelationalDatabaseSnapshot"|"UpdateRelationalDatabaseParameters"|"StartRelationalDatabase"|"RebootRelationalDatabase"|"StopRelationalDatabase"|"EnableAddOn"|"DisableAddOn"|"PutAlarm"|"GetAlarms"|"DeleteAlarm"|"TestAlarm"|"CreateContactMethod"|"GetContactMethods"|"SendContactMethodVerification"|"DeleteContactMethod"|"CreateDistribution"|"UpdateDistribution"|"DeleteDistribution"|"ResetDistributionCache"|"AttachCertificateToDistribution"|"DetachCertificateFromDistribution"|"UpdateDistributionBundle"|"SetIpAddressType"|"CreateCertificate"|"DeleteCertificate"|"CreateContainerService"|"UpdateContainerService"|"DeleteContainerService"|"CreateContainerServiceDeployment"|"CreateContainerServiceRegistryLogin"|"RegisterContainerImage"|"DeleteContainerImage"|"CreateBucket"|"DeleteBucket"|"CreateBucketAccessKey"|"DeleteBucketAccessKey"|"UpdateBucketBundle"|"UpdateBucket"|"SetResourceAccessForBucket"|string;
  export interface Origin {
    /**
     * The name of the origin resource.
     */
    name?: ResourceName;
    /**
     * The resource type of the origin resource (e.g., Instance).
     */
    resourceType?: ResourceType;
    /**
     * The AWS Region name of the origin resource.
     */
    regionName?: RegionName;
    /**
     * The protocol that your Amazon Lightsail distribution uses when establishing a connection with your origin to pull content.
     */
    protocolPolicy?: OriginProtocolPolicyEnum;
  }
  export type OriginProtocolPolicyEnum = "http-only"|"https-only"|string;
  export type PartnerIdList = NonEmptyString[];
  export interface PasswordData {
    /**
     * The encrypted password. Ciphertext will be an empty string if access to your new instance is not ready yet. When you create an instance, it can take up to 15 minutes for the instance to be ready.  If you use the default key pair (LightsailDefaultKeyPair), the decrypted password will be available in the password field. If you are using a custom key pair, you need to use your own means of decryption. If you change the Administrator password on the instance, Lightsail will continue to return the original ciphertext value. When accessing the instance using RDP, you need to manually enter the Administrator password after changing it from the default. 
     */
    ciphertext?: string;
    /**
     * The name of the key pair that you used when creating your instance. If no key pair name was specified when creating the instance, Lightsail uses the default key pair (LightsailDefaultKeyPair). If you are using a custom key pair, you need to use your own means of decrypting your password using the ciphertext. Lightsail creates the ciphertext by encrypting your password with the public key part of this key pair.
     */
    keyPairName?: ResourceName;
  }
  export interface PeerVpcRequest {
  }
  export interface PeerVpcResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface PendingMaintenanceAction {
    /**
     * The type of pending database maintenance action.
     */
    action?: NonEmptyString;
    /**
     * Additional detail about the pending database maintenance action.
     */
    description?: NonEmptyString;
    /**
     * The effective date of the pending database maintenance action.
     */
    currentApplyDate?: IsoDate;
  }
  export type PendingMaintenanceActionList = PendingMaintenanceAction[];
  export interface PendingModifiedRelationalDatabaseValues {
    /**
     * The password for the master user of the database.
     */
    masterUserPassword?: string;
    /**
     * The database engine version.
     */
    engineVersion?: string;
    /**
     * A Boolean value indicating whether automated backup retention is enabled.
     */
    backupRetentionEnabled?: boolean;
  }
  export type Port = number;
  export type PortAccessType = "Public"|"Private"|string;
  export interface PortInfo {
    /**
     * The first port in a range of open ports on an instance. Allowed ports:   TCP and UDP - 0 to 65535    ICMP - The ICMP type for IPv4 addresses. For example, specify 8 as the fromPort (ICMP type), and -1 as the toPort (ICMP code), to enable ICMP Ping. For more information, see Control Messages on Wikipedia.   ICMPv6 - The ICMP type for IPv6 addresses. For example, specify 128 as the fromPort (ICMPv6 type), and 0 as toPort (ICMPv6 code). For more information, see Internet Control Message Protocol for IPv6.  
     */
    fromPort?: Port;
    /**
     * The last port in a range of open ports on an instance. Allowed ports:   TCP and UDP - 0 to 65535    ICMP - The ICMP code for IPv4 addresses. For example, specify 8 as the fromPort (ICMP type), and -1 as the toPort (ICMP code), to enable ICMP Ping. For more information, see Control Messages on Wikipedia.   ICMPv6 - The ICMP code for IPv6 addresses. For example, specify 128 as the fromPort (ICMPv6 type), and 0 as toPort (ICMPv6 code). For more information, see Internet Control Message Protocol for IPv6.  
     */
    toPort?: Port;
    /**
     * The IP protocol name. The name can be one of the following:    tcp - Transmission Control Protocol (TCP) provides reliable, ordered, and error-checked delivery of streamed data between applications running on hosts communicating by an IP network. If you have an application that doesn't require reliable data stream service, use UDP instead.    all - All transport layer protocol types. For more general information, see Transport layer on Wikipedia.    udp - With User Datagram Protocol (UDP), computer applications can send messages (or datagrams) to other hosts on an Internet Protocol (IP) network. Prior communications are not required to set up transmission channels or data paths. Applications that don't require reliable data stream service can use UDP, which provides a connectionless datagram service that emphasizes reduced latency over reliability. If you do require reliable data stream service, use TCP instead.    icmp - Internet Control Message Protocol (ICMP) is used to send error messages and operational information indicating success or failure when communicating with an instance. For example, an error is indicated when an instance could not be reached. When you specify icmp as the protocol, you must specify the ICMP type using the fromPort parameter, and ICMP code using the toPort parameter.  
     */
    protocol?: NetworkProtocol;
    /**
     * The IPv4 address, or range of IPv4 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol.  The ipv6Cidrs parameter lists the IPv6 addresses that are allowed to connect to an instance.  Examples:   To allow the IP address 192.0.2.44, specify 192.0.2.44 or 192.0.2.44/32.    To allow the IP addresses 192.0.2.0 to 192.0.2.255, specify 192.0.2.0/24.   For more information about CIDR block notation, see Classless Inter-Domain Routing on Wikipedia.
     */
    cidrs?: StringList;
    /**
     * The IPv6 address, or range of IPv6 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol. Only devices with an IPv6 address can connect to an instance through IPv6; otherwise, IPv4 should be used.  The cidrs parameter lists the IPv4 addresses that are allowed to connect to an instance.  For more information about CIDR block notation, see Classless Inter-Domain Routing on Wikipedia.
     */
    ipv6Cidrs?: StringList;
    /**
     * An alias that defines access for a preconfigured range of IP addresses. The only alias currently supported is lightsail-connect, which allows IP addresses of the browser-based RDP/SSH client in the Lightsail console to connect to your instance.
     */
    cidrListAliases?: StringList;
  }
  export type PortInfoList = PortInfo[];
  export type PortInfoSourceType = "DEFAULT"|"INSTANCE"|"NONE"|"CLOSED"|string;
  export type PortList = Port[];
  export type PortMap = {[key: string]: ContainerServiceProtocol};
  export type PortState = "open"|"closed"|string;
  export interface PutAlarmRequest {
    /**
     * The name for the alarm. Specify the name of an existing alarm to update, and overwrite the previous configuration of the alarm.
     */
    alarmName: ResourceName;
    /**
     * The name of the metric to associate with the alarm. You can configure up to two alarms per metric. The following metrics are available for each resource type:    Instances: BurstCapacityPercentage, BurstCapacityTime, CPUUtilization, NetworkIn, NetworkOut, StatusCheckFailed, StatusCheckFailed_Instance, and StatusCheckFailed_System.    Load balancers: ClientTLSNegotiationErrorCount, HealthyHostCount, UnhealthyHostCount, HTTPCode_LB_4XX_Count, HTTPCode_LB_5XX_Count, HTTPCode_Instance_2XX_Count, HTTPCode_Instance_3XX_Count, HTTPCode_Instance_4XX_Count, HTTPCode_Instance_5XX_Count, InstanceResponseTime, RejectedConnectionCount, and RequestCount.    Relational databases: CPUUtilization, DatabaseConnections, DiskQueueDepth, FreeStorageSpace, NetworkReceiveThroughput, and NetworkTransmitThroughput.   For more information about these metrics, see Metrics available in Lightsail.
     */
    metricName: MetricName;
    /**
     * The name of the Lightsail resource that will be monitored. Instances, load balancers, and relational databases are the only Lightsail resources that can currently be monitored by alarms.
     */
    monitoredResourceName: ResourceName;
    /**
     * The arithmetic operation to use when comparing the specified statistic to the threshold. The specified statistic value is used as the first operand.
     */
    comparisonOperator: ComparisonOperator;
    /**
     * The value against which the specified statistic is compared.
     */
    threshold: double;
    /**
     * The number of most recent periods over which data is compared to the specified threshold. If you are setting an "M out of N" alarm, this value (evaluationPeriods) is the N. If you are setting an alarm that requires that a number of consecutive data points be breaching to trigger the alarm, this value specifies the rolling period of time in which data points are evaluated. Each evaluation period is five minutes long. For example, specify an evaluation period of 24 to evaluate a metric over a rolling period of two hours. You can specify a minimum valuation period of 1 (5 minutes), and a maximum evaluation period of 288 (24 hours).
     */
    evaluationPeriods: integer;
    /**
     * The number of data points that must be not within the specified threshold to trigger the alarm. If you are setting an "M out of N" alarm, this value (datapointsToAlarm) is the M.
     */
    datapointsToAlarm?: integer;
    /**
     * Sets how this alarm will handle missing data points. An alarm can treat missing data in the following ways:    breaching - Assume the missing data is not within the threshold. Missing data counts towards the number of times the metric is not within the threshold.    notBreaching - Assume the missing data is within the threshold. Missing data does not count towards the number of times the metric is not within the threshold.    ignore - Ignore the missing data. Maintains the current alarm state.    missing - Missing data is treated as missing.   If treatMissingData is not specified, the default behavior of missing is used.
     */
    treatMissingData?: TreatMissingData;
    /**
     * The contact protocols to use for the alarm, such as Email, SMS (text messaging), or both. A notification is sent via the specified contact protocol if notifications are enabled for the alarm, and when the alarm is triggered. A notification is not sent if a contact protocol is not specified, if the specified contact protocol is not configured in the AWS Region, or if notifications are not enabled for the alarm using the notificationEnabled paramater. Use the CreateContactMethod action to configure a contact protocol in an AWS Region.
     */
    contactProtocols?: ContactProtocolsList;
    /**
     * The alarm states that trigger a notification. An alarm has the following possible states:    ALARM - The metric is outside of the defined threshold.    INSUFFICIENT_DATA - The alarm has just started, the metric is not available, or not enough data is available for the metric to determine the alarm state.    OK - The metric is within the defined threshold.   When you specify a notification trigger, the ALARM state must be specified. The INSUFFICIENT_DATA and OK states can be specified in addition to the ALARM state.   If you specify OK as an alarm trigger, a notification is sent when the alarm switches from an ALARM or INSUFFICIENT_DATA alarm state to an OK state. This can be thought of as an all clear alarm notification.   If you specify INSUFFICIENT_DATA as the alarm trigger, a notification is sent when the alarm switches from an OK or ALARM alarm state to an INSUFFICIENT_DATA state.   The notification trigger defaults to ALARM if you don't specify this parameter.
     */
    notificationTriggers?: NotificationTriggerList;
    /**
     * Indicates whether the alarm is enabled. Notifications are enabled by default if you don't specify this parameter.
     */
    notificationEnabled?: boolean;
  }
  export interface PutAlarmResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface PutInstancePublicPortsRequest {
    /**
     * An array of objects to describe the ports to open for the specified instance.
     */
    portInfos: PortInfoList;
    /**
     * The name of the instance for which to open ports.
     */
    instanceName: ResourceName;
  }
  export interface PutInstancePublicPortsResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface QueryStringObject {
    /**
     * Indicates whether the distribution forwards and caches based on query strings.
     */
    option?: boolean;
    /**
     * The specific query strings that the distribution forwards to the origin. Your distribution will cache content based on the specified query strings. If the option parameter is true, then your distribution forwards all query strings, regardless of what you specify using the queryStringsAllowList parameter.
     */
    queryStringsAllowList?: StringList;
  }
  export interface RebootInstanceRequest {
    /**
     * The name of the instance to reboot.
     */
    instanceName: ResourceName;
  }
  export interface RebootInstanceResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface RebootRelationalDatabaseRequest {
    /**
     * The name of your database to reboot.
     */
    relationalDatabaseName: ResourceName;
  }
  export interface RebootRelationalDatabaseResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export type RecordState = "Started"|"Succeeded"|"Failed"|string;
  export interface Region {
    /**
     * The continent code (e.g., NA, meaning North America).
     */
    continentCode?: string;
    /**
     * The description of the AWS Region (e.g., This region is recommended to serve users in the eastern United States and eastern Canada).
     */
    description?: string;
    /**
     * The display name (e.g., Ohio).
     */
    displayName?: string;
    /**
     * The region name (e.g., us-east-2).
     */
    name?: RegionName;
    /**
     * The Availability Zones. Follows the format us-east-2a (case-sensitive).
     */
    availabilityZones?: AvailabilityZoneList;
    /**
     * The Availability Zones for databases. Follows the format us-east-2a (case-sensitive).
     */
    relationalDatabaseAvailabilityZones?: AvailabilityZoneList;
  }
  export type RegionList = Region[];
  export type RegionName = "us-east-1"|"us-east-2"|"us-west-1"|"us-west-2"|"eu-west-1"|"eu-west-2"|"eu-west-3"|"eu-central-1"|"ca-central-1"|"ap-south-1"|"ap-southeast-1"|"ap-southeast-2"|"ap-northeast-1"|"ap-northeast-2"|"eu-north-1"|string;
  export interface RegisterContainerImageRequest {
    /**
     * The name of the container service for which to register a container image.
     */
    serviceName: ContainerServiceName;
    /**
     * The label for the container image when it's registered to the container service. Use a descriptive label that you can use to track the different versions of your registered container images. Use the GetContainerImages action to return the container images registered to a Lightsail container service. The label is the &lt;imagelabel&gt; portion of the following image name example:    :container-service-1.&lt;imagelabel&gt;.1    If the name of your container service is mycontainerservice, and the label that you specify is mystaticwebsite, then the name of the registered container image will be :mycontainerservice.mystaticwebsite.1. The number at the end of these image name examples represents the version of the registered container image. If you push and register another container image to the same Lightsail container service, with the same label, then the version number for the new registered container image will be 2. If you push and register another container image, the version number will be 3, and so on.
     */
    label: ContainerLabel;
    /**
     * The digest of the container image to be registered.
     */
    digest: string;
  }
  export interface RegisterContainerImageResult {
    containerImage?: ContainerImage;
  }
  export interface RelationalDatabase {
    /**
     * The unique name of the database resource in Lightsail.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the database.
     */
    arn?: NonEmptyString;
    /**
     * The support code for the database. Include this code in your email to support when you have questions about a database in Lightsail. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The timestamp when the database was created. Formatted in Unix time.
     */
    createdAt?: IsoDate;
    /**
     * The Region name and Availability Zone where the database is located.
     */
    location?: ResourceLocation;
    /**
     * The Lightsail resource type for the database (for example, RelationalDatabase).
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The blueprint ID for the database. A blueprint describes the major engine version of a database.
     */
    relationalDatabaseBlueprintId?: NonEmptyString;
    /**
     * The bundle ID for the database. A bundle describes the performance specifications for your database.
     */
    relationalDatabaseBundleId?: NonEmptyString;
    /**
     * The name of the master database created when the Lightsail database resource is created.
     */
    masterDatabaseName?: string;
    /**
     * Describes the hardware of the database.
     */
    hardware?: RelationalDatabaseHardware;
    /**
     * Describes the current state of the database.
     */
    state?: NonEmptyString;
    /**
     * Describes the secondary Availability Zone of a high availability database. The secondary database is used for failover support of a high availability database.
     */
    secondaryAvailabilityZone?: string;
    /**
     * A Boolean value indicating whether automated backup retention is enabled for the database.
     */
    backupRetentionEnabled?: boolean;
    /**
     * Describes pending database value modifications.
     */
    pendingModifiedValues?: PendingModifiedRelationalDatabaseValues;
    /**
     * The database software (for example, MySQL).
     */
    engine?: NonEmptyString;
    /**
     * The database engine version (for example, 5.7.23).
     */
    engineVersion?: NonEmptyString;
    /**
     * The latest point in time to which the database can be restored. Formatted in Unix time.
     */
    latestRestorableTime?: IsoDate;
    /**
     * The master user name of the database.
     */
    masterUsername?: NonEmptyString;
    /**
     * The status of parameter updates for the database.
     */
    parameterApplyStatus?: NonEmptyString;
    /**
     * The daily time range during which automated backups are created for the database (for example, 16:00-16:30).
     */
    preferredBackupWindow?: NonEmptyString;
    /**
     * The weekly time range during which system maintenance can occur on the database. In the format ddd:hh24:mi-ddd:hh24:mi. For example, Tue:17:00-Tue:17:30.
     */
    preferredMaintenanceWindow?: NonEmptyString;
    /**
     * A Boolean value indicating whether the database is publicly accessible.
     */
    publiclyAccessible?: boolean;
    /**
     * The master endpoint for the database.
     */
    masterEndpoint?: RelationalDatabaseEndpoint;
    /**
     * Describes the pending maintenance actions for the database.
     */
    pendingMaintenanceActions?: PendingMaintenanceActionList;
    /**
     * The certificate associated with the database.
     */
    caCertificateIdentifier?: string;
  }
  export interface RelationalDatabaseBlueprint {
    /**
     * The ID for the database blueprint.
     */
    blueprintId?: string;
    /**
     * The database software of the database blueprint (for example, MySQL).
     */
    engine?: RelationalDatabaseEngine;
    /**
     * The database engine version for the database blueprint (for example, 5.7.23).
     */
    engineVersion?: string;
    /**
     * The description of the database engine for the database blueprint.
     */
    engineDescription?: string;
    /**
     * The description of the database engine version for the database blueprint.
     */
    engineVersionDescription?: string;
    /**
     * A Boolean value indicating whether the engine version is the default for the database blueprint.
     */
    isEngineDefault?: boolean;
  }
  export type RelationalDatabaseBlueprintList = RelationalDatabaseBlueprint[];
  export interface RelationalDatabaseBundle {
    /**
     * The ID for the database bundle.
     */
    bundleId?: string;
    /**
     * The name for the database bundle.
     */
    name?: string;
    /**
     * The cost of the database bundle in US currency.
     */
    price?: float;
    /**
     * The amount of RAM in GB (for example, 2.0) for the database bundle.
     */
    ramSizeInGb?: float;
    /**
     * The size of the disk for the database bundle.
     */
    diskSizeInGb?: integer;
    /**
     * The data transfer rate per month in GB for the database bundle.
     */
    transferPerMonthInGb?: integer;
    /**
     * The number of virtual CPUs (vCPUs) for the database bundle.
     */
    cpuCount?: integer;
    /**
     * A Boolean value indicating whether the database bundle is encrypted.
     */
    isEncrypted?: boolean;
    /**
     * A Boolean value indicating whether the database bundle is active.
     */
    isActive?: boolean;
  }
  export type RelationalDatabaseBundleList = RelationalDatabaseBundle[];
  export interface RelationalDatabaseEndpoint {
    /**
     * Specifies the port that the database is listening on.
     */
    port?: integer;
    /**
     * Specifies the DNS address of the database.
     */
    address?: NonEmptyString;
  }
  export type RelationalDatabaseEngine = "mysql"|string;
  export interface RelationalDatabaseEvent {
    /**
     * The database that the database event relates to.
     */
    resource?: ResourceName;
    /**
     * The timestamp when the database event was created.
     */
    createdAt?: IsoDate;
    /**
     * The message of the database event.
     */
    message?: string;
    /**
     * The category that the database event belongs to.
     */
    eventCategories?: StringList;
  }
  export type RelationalDatabaseEventList = RelationalDatabaseEvent[];
  export interface RelationalDatabaseHardware {
    /**
     * The number of vCPUs for the database.
     */
    cpuCount?: integer;
    /**
     * The size of the disk for the database.
     */
    diskSizeInGb?: integer;
    /**
     * The amount of RAM in GB for the database.
     */
    ramSizeInGb?: float;
  }
  export type RelationalDatabaseList = RelationalDatabase[];
  export type RelationalDatabaseMetricName = "CPUUtilization"|"DatabaseConnections"|"DiskQueueDepth"|"FreeStorageSpace"|"NetworkReceiveThroughput"|"NetworkTransmitThroughput"|string;
  export interface RelationalDatabaseParameter {
    /**
     * Specifies the valid range of values for the parameter.
     */
    allowedValues?: string;
    /**
     * Indicates when parameter updates are applied. Can be immediate or pending-reboot.
     */
    applyMethod?: string;
    /**
     * Specifies the engine-specific parameter type.
     */
    applyType?: string;
    /**
     * Specifies the valid data type for the parameter.
     */
    dataType?: string;
    /**
     * Provides a description of the parameter.
     */
    description?: string;
    /**
     * A Boolean value indicating whether the parameter can be modified.
     */
    isModifiable?: boolean;
    /**
     * Specifies the name of the parameter.
     */
    parameterName?: string;
    /**
     * Specifies the value of the parameter.
     */
    parameterValue?: string;
  }
  export type RelationalDatabaseParameterList = RelationalDatabaseParameter[];
  export type RelationalDatabasePasswordVersion = "CURRENT"|"PREVIOUS"|"PENDING"|string;
  export interface RelationalDatabaseSnapshot {
    /**
     * The name of the database snapshot.
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the database snapshot.
     */
    arn?: NonEmptyString;
    /**
     * The support code for the database snapshot. Include this code in your email to support when you have questions about a database snapshot in Lightsail. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The timestamp when the database snapshot was created.
     */
    createdAt?: IsoDate;
    /**
     * The Region name and Availability Zone where the database snapshot is located.
     */
    location?: ResourceLocation;
    /**
     * The Lightsail resource type.
     */
    resourceType?: ResourceType;
    /**
     * The tag keys and optional values for the resource. For more information about tags in Lightsail, see the Amazon Lightsail Developer Guide.
     */
    tags?: TagList;
    /**
     * The software of the database snapshot (for example, MySQL)
     */
    engine?: NonEmptyString;
    /**
     * The database engine version for the database snapshot (for example, 5.7.23).
     */
    engineVersion?: NonEmptyString;
    /**
     * The size of the disk in GB (for example, 32) for the database snapshot.
     */
    sizeInGb?: integer;
    /**
     * The state of the database snapshot.
     */
    state?: NonEmptyString;
    /**
     * The name of the source database from which the database snapshot was created.
     */
    fromRelationalDatabaseName?: NonEmptyString;
    /**
     * The Amazon Resource Name (ARN) of the database from which the database snapshot was created.
     */
    fromRelationalDatabaseArn?: NonEmptyString;
    /**
     * The bundle ID of the database from which the database snapshot was created.
     */
    fromRelationalDatabaseBundleId?: string;
    /**
     * The blueprint ID of the database from which the database snapshot was created. A blueprint describes the major engine version of a database.
     */
    fromRelationalDatabaseBlueprintId?: string;
  }
  export type RelationalDatabaseSnapshotList = RelationalDatabaseSnapshot[];
  export interface ReleaseStaticIpRequest {
    /**
     * The name of the static IP to delete.
     */
    staticIpName: ResourceName;
  }
  export interface ReleaseStaticIpResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export type RenewalStatus = "PendingAutoRenewal"|"PendingValidation"|"Success"|"Failed"|string;
  export type RenewalStatusReason = string;
  export interface RenewalSummary {
    /**
     * An array of objects that describe the domain validation records of the certificate.
     */
    domainValidationRecords?: DomainValidationRecordList;
    /**
     * The renewal status of the certificate. The following renewal status are possible:     PendingAutoRenewal  - Lightsail is attempting to automatically validate the domain names of the certificate. No further action is required.      PendingValidation  - Lightsail couldn't automatically validate one or more domain names of the certificate. You must take action to validate these domain names or the certificate won't be renewed. Check to make sure your certificate's domain validation records exist in your domain's DNS, and that your certificate remains in use.     Success  - All domain names in the certificate are validated, and Lightsail renewed the certificate. No further action is required.      Failed  - One or more domain names were not validated before the certificate expired, and Lightsail did not renew the certificate. You can request a new certificate using the CreateCertificate action.  
     */
    renewalStatus?: RenewalStatus;
    /**
     * The reason for the renewal status of the certificate.
     */
    renewalStatusReason?: RenewalStatusReason;
    /**
     * The timestamp when the certificate was last updated.
     */
    updatedAt?: IsoDate;
  }
  export type RequestFailureReason = string;
  export interface ResetDistributionCacheRequest {
    /**
     * The name of the distribution for which to reset cache. Use the GetDistributions action to get a list of distribution names that you can specify.
     */
    distributionName?: ResourceName;
  }
  export interface ResetDistributionCacheResult {
    /**
     * The status of the reset cache request.
     */
    status?: string;
    /**
     * The timestamp of the reset cache request (e.g., 1479734909.17) in Unix time format.
     */
    createTime?: IsoDate;
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export type ResourceArn = string;
  export type ResourceBucketAccess = "allow"|"deny"|string;
  export interface ResourceLocation {
    /**
     * The Availability Zone. Follows the format us-east-2a (case-sensitive).
     */
    availabilityZone?: string;
    /**
     * The AWS Region name.
     */
    regionName?: RegionName;
  }
  export type ResourceName = string;
  export type ResourceNameList = ResourceName[];
  export interface ResourceReceivingAccess {
    /**
     * The name of the Lightsail instance.
     */
    name?: NonEmptyString;
    /**
     * The Lightsail resource type (for example, Instance).
     */
    resourceType?: NonEmptyString;
  }
  export interface ResourceRecord {
    /**
     * The name of the record.
     */
    name?: string;
    /**
     * The DNS record type.
     */
    type?: string;
    /**
     * The value for the DNS record.
     */
    value?: string;
  }
  export type ResourceType = "ContainerService"|"Instance"|"StaticIp"|"KeyPair"|"InstanceSnapshot"|"Domain"|"PeeredVpc"|"LoadBalancer"|"LoadBalancerTlsCertificate"|"Disk"|"DiskSnapshot"|"RelationalDatabase"|"RelationalDatabaseSnapshot"|"ExportSnapshotRecord"|"CloudFormationStackRecord"|"Alarm"|"ContactMethod"|"Distribution"|"Certificate"|"Bucket"|string;
  export type RevocationReason = string;
  export interface SendContactMethodVerificationRequest {
    /**
     * The protocol to verify, such as Email or SMS (text messaging).
     */
    protocol: ContactMethodVerificationProtocol;
  }
  export interface SendContactMethodVerificationResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export type SensitiveString = string;
  export type SerialNumber = string;
  export interface SetIpAddressTypeRequest {
    /**
     * The resource type. The possible values are Distribution, Instance, and LoadBalancer.  Distribution-related APIs are available only in the N. Virginia (us-east-1) AWS Region. Set your AWS Region configuration to us-east-1 to create, view, or edit distributions. 
     */
    resourceType: ResourceType;
    /**
     * The name of the resource for which to set the IP address type.
     */
    resourceName: ResourceName;
    /**
     * The IP address type to set for the specified resource. The possible values are ipv4 for IPv4 only, and dualstack for IPv4 and IPv6.
     */
    ipAddressType: IpAddressType;
  }
  export interface SetIpAddressTypeResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface SetResourceAccessForBucketRequest {
    /**
     * The name of the Lightsail instance for which to set bucket access. The instance must be in a running or stopped state.
     */
    resourceName: ResourceName;
    /**
     * The name of the bucket for which to set access to another Lightsail resource.
     */
    bucketName: BucketName;
    /**
     * The access setting. The following access settings are available:    allow - Allows access to the bucket and its objects.    deny - Denies access to the bucket and its objects. Use this setting to remove access for a resource previously set to allow.  
     */
    access: ResourceBucketAccess;
  }
  export interface SetResourceAccessForBucketResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface StartInstanceRequest {
    /**
     * The name of the instance (a virtual private server) to start.
     */
    instanceName: ResourceName;
  }
  export interface StartInstanceResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface StartRelationalDatabaseRequest {
    /**
     * The name of your database to start.
     */
    relationalDatabaseName: ResourceName;
  }
  export interface StartRelationalDatabaseResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface StaticIp {
    /**
     * The name of the static IP (e.g., StaticIP-Ohio-EXAMPLE).
     */
    name?: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the static IP (e.g., arn:aws:lightsail:us-east-2:123456789101:StaticIp/9cbb4a9e-f8e3-4dfe-b57e-12345EXAMPLE).
     */
    arn?: NonEmptyString;
    /**
     * The support code. Include this code in your email to support when you have questions about an instance or another resource in Lightsail. This code enables our support team to look up your Lightsail information more easily.
     */
    supportCode?: string;
    /**
     * The timestamp when the static IP was created (e.g., 1479735304.222).
     */
    createdAt?: IsoDate;
    /**
     * The region and Availability Zone where the static IP was created.
     */
    location?: ResourceLocation;
    /**
     * The resource type (usually StaticIp).
     */
    resourceType?: ResourceType;
    /**
     * The static IP address.
     */
    ipAddress?: IpAddress;
    /**
     * The instance where the static IP is attached (e.g., Amazon_Linux-1GB-Ohio-1).
     */
    attachedTo?: ResourceName;
    /**
     * A Boolean value indicating whether the static IP is attached.
     */
    isAttached?: boolean;
  }
  export type StaticIpList = StaticIp[];
  export type StatusType = "Active"|"Inactive"|string;
  export interface StopInstanceRequest {
    /**
     * The name of the instance (a virtual private server) to stop.
     */
    instanceName: ResourceName;
    /**
     * When set to True, forces a Lightsail instance that is stuck in a stopping state to stop.  Only use the force parameter if your instance is stuck in the stopping state. In any other state, your instance should stop normally without adding this parameter to your API request. 
     */
    force?: boolean;
  }
  export interface StopInstanceResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface StopRelationalDatabaseRequest {
    /**
     * The name of your database to stop.
     */
    relationalDatabaseName: ResourceName;
    /**
     * The name of your new database snapshot to be created before stopping your database.
     */
    relationalDatabaseSnapshotName?: ResourceName;
  }
  export interface StopRelationalDatabaseResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export type StringList = string[];
  export type StringMax256 = string;
  export type SubjectAlternativeNameList = DomainName[];
  export interface Tag {
    /**
     * The key of the tag. Constraints: Tag keys accept a maximum of 128 letters, numbers, spaces in UTF-8, or the following characters: + - = . _ : / @
     */
    key?: TagKey;
    /**
     * The value of the tag. Constraints: Tag values accept a maximum of 256 letters, numbers, spaces in UTF-8, or the following characters: + - = . _ : / @
     */
    value?: TagValue;
  }
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export type TagList = Tag[];
  export interface TagResourceRequest {
    /**
     * The name of the resource to which you are adding tags.
     */
    resourceName: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the resource to which you want to add a tag.
     */
    resourceArn?: ResourceArn;
    /**
     * The tag key and optional value.
     */
    tags: TagList;
  }
  export interface TagResourceResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export type TagValue = string;
  export interface TestAlarmRequest {
    /**
     * The name of the alarm to test.
     */
    alarmName: ResourceName;
    /**
     * The alarm state to test. An alarm has the following possible states that can be tested:    ALARM - The metric is outside of the defined threshold.    INSUFFICIENT_DATA - The alarm has just started, the metric is not available, or not enough data is available for the metric to determine the alarm state.    OK - The metric is within the defined threshold.  
     */
    state: AlarmState;
  }
  export interface TestAlarmResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export type TimeOfDay = string;
  export type TreatMissingData = "breaching"|"notBreaching"|"ignore"|"missing"|string;
  export interface UnpeerVpcRequest {
  }
  export interface UnpeerVpcResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface UntagResourceRequest {
    /**
     * The name of the resource from which you are removing a tag.
     */
    resourceName: ResourceName;
    /**
     * The Amazon Resource Name (ARN) of the resource from which you want to remove a tag.
     */
    resourceArn?: ResourceArn;
    /**
     * The tag keys to delete from the specified resource.
     */
    tagKeys: TagKeyList;
  }
  export interface UntagResourceResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface UpdateBucketBundleRequest {
    /**
     * The name of the bucket for which to update the bundle.
     */
    bucketName: BucketName;
    /**
     * The ID of the new bundle to apply to the bucket. Use the GetBucketBundles action to get a list of bundle IDs that you can specify.
     */
    bundleId: NonEmptyString;
  }
  export interface UpdateBucketBundleResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface UpdateBucketRequest {
    /**
     * The name of the bucket to update.
     */
    bucketName: BucketName;
    /**
     * An object that sets the public accessibility of objects in the specified bucket.
     */
    accessRules?: AccessRules;
    /**
     * Specifies whether to enable or suspend versioning of objects in the bucket. The following options can be specified:    Enabled - Enables versioning of objects in the specified bucket.    Suspended - Suspends versioning of objects in the specified bucket. Existing object versions are retained.  
     */
    versioning?: NonEmptyString;
    /**
     * An array of strings to specify the AWS account IDs that can access the bucket. You can give a maximum of 10 AWS accounts access to a bucket.
     */
    readonlyAccessAccounts?: PartnerIdList;
  }
  export interface UpdateBucketResult {
    /**
     * An object that describes the bucket that is updated.
     */
    bucket?: Bucket;
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface UpdateContainerServiceRequest {
    /**
     * The name of the container service to update.
     */
    serviceName: ContainerServiceName;
    /**
     * The power for the container service. The power specifies the amount of memory, vCPUs, and base monthly cost of each node of the container service. The power and scale of a container service makes up its configured capacity. To determine the monthly price of your container service, multiply the base price of the power with the scale (the number of nodes) of the service. Use the GetContainerServicePowers action to view the specifications of each power option.
     */
    power?: ContainerServicePowerName;
    /**
     * The scale for the container service. The scale specifies the allocated compute nodes of the container service. The power and scale of a container service makes up its configured capacity. To determine the monthly price of your container service, multiply the base price of the power with the scale (the number of nodes) of the service.
     */
    scale?: ContainerServiceScale;
    /**
     * A Boolean value to indicate whether the container service is disabled.
     */
    isDisabled?: boolean;
    /**
     * The public domain names to use with the container service, such as example.com and www.example.com. You can specify up to four public domain names for a container service. The domain names that you specify are used when you create a deployment with a container configured as the public endpoint of your container service. If you don't specify public domain names, then you can use the default domain of the container service.  You must create and validate an SSL/TLS certificate before you can use public domain names with your container service. Use the CreateCertificate action to create a certificate for the public domain names you want to use with your container service.  You can specify public domain names using a string to array map as shown in the example later on this page.
     */
    publicDomainNames?: ContainerServicePublicDomains;
  }
  export interface UpdateContainerServiceResult {
    /**
     * An object that describes a container service.
     */
    containerService?: ContainerService;
  }
  export interface UpdateDistributionBundleRequest {
    /**
     * The name of the distribution for which to update the bundle. Use the GetDistributions action to get a list of distribution names that you can specify.
     */
    distributionName?: ResourceName;
    /**
     * The bundle ID of the new bundle to apply to your distribution. Use the GetDistributionBundles action to get a list of distribution bundle IDs that you can specify.
     */
    bundleId?: string;
  }
  export interface UpdateDistributionBundleResult {
    operation?: Operation;
  }
  export interface UpdateDistributionRequest {
    /**
     * The name of the distribution to update. Use the GetDistributions action to get a list of distribution names that you can specify.
     */
    distributionName: ResourceName;
    /**
     * An object that describes the origin resource for the distribution, such as a Lightsail instance or load balancer. The distribution pulls, caches, and serves content from the origin.
     */
    origin?: InputOrigin;
    /**
     * An object that describes the default cache behavior for the distribution.
     */
    defaultCacheBehavior?: CacheBehavior;
    /**
     * An object that describes the cache behavior settings for the distribution.  The cacheBehaviorSettings specified in your UpdateDistributionRequest will replace your distribution's existing settings. 
     */
    cacheBehaviorSettings?: CacheSettings;
    /**
     * An array of objects that describe the per-path cache behavior for the distribution.
     */
    cacheBehaviors?: CacheBehaviorList;
    /**
     * Indicates whether to enable the distribution.
     */
    isEnabled?: boolean;
  }
  export interface UpdateDistributionResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operation?: Operation;
  }
  export interface UpdateDomainEntryRequest {
    /**
     * The name of the domain recordset to update.
     */
    domainName: DomainName;
    /**
     * An array of key-value pairs containing information about the domain entry.
     */
    domainEntry: DomainEntry;
  }
  export interface UpdateDomainEntryResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface UpdateLoadBalancerAttributeRequest {
    /**
     * The name of the load balancer that you want to modify (e.g., my-load-balancer.
     */
    loadBalancerName: ResourceName;
    /**
     * The name of the attribute you want to update. Valid values are below.
     */
    attributeName: LoadBalancerAttributeName;
    /**
     * The value that you want to specify for the attribute name.
     */
    attributeValue: StringMax256;
  }
  export interface UpdateLoadBalancerAttributeResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface UpdateRelationalDatabaseParametersRequest {
    /**
     * The name of your database for which to update parameters.
     */
    relationalDatabaseName: ResourceName;
    /**
     * The database parameters to update.
     */
    parameters: RelationalDatabaseParameterList;
  }
  export interface UpdateRelationalDatabaseParametersResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export interface UpdateRelationalDatabaseRequest {
    /**
     * The name of your Lightsail database resource to update.
     */
    relationalDatabaseName: ResourceName;
    /**
     * The password for the master user. The password can include any printable ASCII character except "/", """, or "@". MySQL  Constraints: Must contain from 8 to 41 characters.  PostgreSQL  Constraints: Must contain from 8 to 128 characters.
     */
    masterUserPassword?: SensitiveString;
    /**
     * When true, the master user password is changed to a new strong password generated by Lightsail. Use the get relational database master user password operation to get the new password.
     */
    rotateMasterUserPassword?: boolean;
    /**
     * The daily time range during which automated backups are created for your database if automated backups are enabled. Constraints:   Must be in the hh24:mi-hh24:mi format. Example: 16:00-16:30    Specified in Coordinated Universal Time (UTC).   Must not conflict with the preferred maintenance window.   Must be at least 30 minutes.  
     */
    preferredBackupWindow?: string;
    /**
     * The weekly time range during which system maintenance can occur on your database. The default is a 30-minute window selected at random from an 8-hour block of time for each AWS Region, occurring on a random day of the week. Constraints:   Must be in the ddd:hh24:mi-ddd:hh24:mi format.   Valid days: Mon, Tue, Wed, Thu, Fri, Sat, Sun.   Must be at least 30 minutes.   Specified in Coordinated Universal Time (UTC).   Example: Tue:17:00-Tue:17:30   
     */
    preferredMaintenanceWindow?: string;
    /**
     * When true, enables automated backup retention for your database. Updates are applied during the next maintenance window because this can result in an outage.
     */
    enableBackupRetention?: boolean;
    /**
     * When true, disables automated backup retention for your database. Disabling backup retention deletes all automated database backups. Before disabling this, you may want to create a snapshot of your database using the create relational database snapshot operation. Updates are applied during the next maintenance window because this can result in an outage.
     */
    disableBackupRetention?: boolean;
    /**
     * Specifies the accessibility options for your database. A value of true specifies a database that is available to resources outside of your Lightsail account. A value of false specifies a database that is available only to your Lightsail resources in the same region as your database.
     */
    publiclyAccessible?: boolean;
    /**
     * When true, applies changes immediately. When false, applies changes during the preferred maintenance window. Some changes may cause an outage. Default: false 
     */
    applyImmediately?: boolean;
    /**
     * Indicates the certificate that needs to be associated with the database.
     */
    caCertificateIdentifier?: string;
  }
  export interface UpdateRelationalDatabaseResult {
    /**
     * An array of objects that describe the result of the action, such as the status of the request, the timestamp of the request, and the resources affected by the request.
     */
    operations?: OperationList;
  }
  export type double = number;
  export type float = number;
  export type integer = number;
  export type long = number;
  export type timestamp = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2016-11-28"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the Lightsail client.
   */
  export import Types = Lightsail;
}
export = Lightsail;
