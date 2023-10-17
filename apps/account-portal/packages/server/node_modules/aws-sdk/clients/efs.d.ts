import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class EFS extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: EFS.Types.ClientConfiguration)
  config: Config & EFS.Types.ClientConfiguration;
  /**
   * Creates an EFS access point. An access point is an application-specific view into an EFS file system that applies an operating system user and group, and a file system path, to any file system request made through the access point. The operating system user and group override any identity information provided by the NFS client. The file system path is exposed as the access point's root directory. Applications using the access point can only access data in the application's own directory and any subdirectories. To learn more, see Mounting a file system using EFS access points.  If multiple requests to create access points on the same file system are sent in quick succession, and the file system is near the limit of 1,000 access points, you may experience a throttling response for these requests. This is to ensure that the file system does not exceed the stated access point limit.  This operation requires permissions for the elasticfilesystem:CreateAccessPoint action. Access points can be tagged on creation. If tags are specified in the creation action, IAM performs additional authorization on the elasticfilesystem:TagResource action to verify if users have permissions to create tags. Therefore, you must grant explicit permissions to use the elasticfilesystem:TagResource action. For more information, see Granting permissions to tag resources during creation.
   */
  createAccessPoint(params: EFS.Types.CreateAccessPointRequest, callback?: (err: AWSError, data: EFS.Types.AccessPointDescription) => void): Request<EFS.Types.AccessPointDescription, AWSError>;
  /**
   * Creates an EFS access point. An access point is an application-specific view into an EFS file system that applies an operating system user and group, and a file system path, to any file system request made through the access point. The operating system user and group override any identity information provided by the NFS client. The file system path is exposed as the access point's root directory. Applications using the access point can only access data in the application's own directory and any subdirectories. To learn more, see Mounting a file system using EFS access points.  If multiple requests to create access points on the same file system are sent in quick succession, and the file system is near the limit of 1,000 access points, you may experience a throttling response for these requests. This is to ensure that the file system does not exceed the stated access point limit.  This operation requires permissions for the elasticfilesystem:CreateAccessPoint action. Access points can be tagged on creation. If tags are specified in the creation action, IAM performs additional authorization on the elasticfilesystem:TagResource action to verify if users have permissions to create tags. Therefore, you must grant explicit permissions to use the elasticfilesystem:TagResource action. For more information, see Granting permissions to tag resources during creation.
   */
  createAccessPoint(callback?: (err: AWSError, data: EFS.Types.AccessPointDescription) => void): Request<EFS.Types.AccessPointDescription, AWSError>;
  /**
   * Creates a new, empty file system. The operation requires a creation token in the request that Amazon EFS uses to ensure idempotent creation (calling the operation with same creation token has no effect). If a file system does not currently exist that is owned by the caller's Amazon Web Services account with the specified creation token, this operation does the following:   Creates a new, empty file system. The file system will have an Amazon EFS assigned ID, and an initial lifecycle state creating.   Returns with the description of the created file system.   Otherwise, this operation returns a FileSystemAlreadyExists error with the ID of the existing file system.  For basic use cases, you can use a randomly generated UUID for the creation token.   The idempotent operation allows you to retry a CreateFileSystem call without risk of creating an extra file system. This can happen when an initial call fails in a way that leaves it uncertain whether or not a file system was actually created. An example might be that a transport level timeout occurred or your connection was reset. As long as you use the same creation token, if the initial call had succeeded in creating a file system, the client can learn of its existence from the FileSystemAlreadyExists error. For more information, see Creating a file system in the Amazon EFS User Guide.  The CreateFileSystem call returns while the file system's lifecycle state is still creating. You can check the file system creation status by calling the DescribeFileSystems operation, which among other things returns the file system state.  This operation accepts an optional PerformanceMode parameter that you choose for your file system. We recommend generalPurpose performance mode for most file systems. File systems using the maxIO performance mode can scale to higher levels of aggregate throughput and operations per second with a tradeoff of slightly higher latencies for most file operations. The performance mode can't be changed after the file system has been created. For more information, see Amazon EFS performance modes. You can set the throughput mode for the file system using the ThroughputMode parameter. After the file system is fully created, Amazon EFS sets its lifecycle state to available, at which point you can create one or more mount targets for the file system in your VPC. For more information, see CreateMountTarget. You mount your Amazon EFS file system on an EC2 instances in your VPC by using the mount target. For more information, see Amazon EFS: How it Works.  This operation requires permissions for the elasticfilesystem:CreateFileSystem action.  File systems can be tagged on creation. If tags are specified in the creation action, IAM performs additional authorization on the elasticfilesystem:TagResource action to verify if users have permissions to create tags. Therefore, you must grant explicit permissions to use the elasticfilesystem:TagResource action. For more information, see Granting permissions to tag resources during creation.
   */
  createFileSystem(params: EFS.Types.CreateFileSystemRequest, callback?: (err: AWSError, data: EFS.Types.FileSystemDescription) => void): Request<EFS.Types.FileSystemDescription, AWSError>;
  /**
   * Creates a new, empty file system. The operation requires a creation token in the request that Amazon EFS uses to ensure idempotent creation (calling the operation with same creation token has no effect). If a file system does not currently exist that is owned by the caller's Amazon Web Services account with the specified creation token, this operation does the following:   Creates a new, empty file system. The file system will have an Amazon EFS assigned ID, and an initial lifecycle state creating.   Returns with the description of the created file system.   Otherwise, this operation returns a FileSystemAlreadyExists error with the ID of the existing file system.  For basic use cases, you can use a randomly generated UUID for the creation token.   The idempotent operation allows you to retry a CreateFileSystem call without risk of creating an extra file system. This can happen when an initial call fails in a way that leaves it uncertain whether or not a file system was actually created. An example might be that a transport level timeout occurred or your connection was reset. As long as you use the same creation token, if the initial call had succeeded in creating a file system, the client can learn of its existence from the FileSystemAlreadyExists error. For more information, see Creating a file system in the Amazon EFS User Guide.  The CreateFileSystem call returns while the file system's lifecycle state is still creating. You can check the file system creation status by calling the DescribeFileSystems operation, which among other things returns the file system state.  This operation accepts an optional PerformanceMode parameter that you choose for your file system. We recommend generalPurpose performance mode for most file systems. File systems using the maxIO performance mode can scale to higher levels of aggregate throughput and operations per second with a tradeoff of slightly higher latencies for most file operations. The performance mode can't be changed after the file system has been created. For more information, see Amazon EFS performance modes. You can set the throughput mode for the file system using the ThroughputMode parameter. After the file system is fully created, Amazon EFS sets its lifecycle state to available, at which point you can create one or more mount targets for the file system in your VPC. For more information, see CreateMountTarget. You mount your Amazon EFS file system on an EC2 instances in your VPC by using the mount target. For more information, see Amazon EFS: How it Works.  This operation requires permissions for the elasticfilesystem:CreateFileSystem action.  File systems can be tagged on creation. If tags are specified in the creation action, IAM performs additional authorization on the elasticfilesystem:TagResource action to verify if users have permissions to create tags. Therefore, you must grant explicit permissions to use the elasticfilesystem:TagResource action. For more information, see Granting permissions to tag resources during creation.
   */
  createFileSystem(callback?: (err: AWSError, data: EFS.Types.FileSystemDescription) => void): Request<EFS.Types.FileSystemDescription, AWSError>;
  /**
   * Creates a mount target for a file system. You can then mount the file system on EC2 instances by using the mount target. You can create one mount target in each Availability Zone in your VPC. All EC2 instances in a VPC within a given Availability Zone share a single mount target for a given file system. If you have multiple subnets in an Availability Zone, you create a mount target in one of the subnets. EC2 instances do not need to be in the same subnet as the mount target in order to access their file system. You can create only one mount target for an EFS file system using One Zone storage classes. You must create that mount target in the same Availability Zone in which the file system is located. Use the AvailabilityZoneName and AvailabiltyZoneId properties in the DescribeFileSystems response object to get this information. Use the subnetId associated with the file system's Availability Zone when creating the mount target. For more information, see Amazon EFS: How it Works.  To create a mount target for a file system, the file system's lifecycle state must be available. For more information, see DescribeFileSystems. In the request, provide the following:   The file system ID for which you are creating the mount target.   A subnet ID, which determines the following:   The VPC in which Amazon EFS creates the mount target   The Availability Zone in which Amazon EFS creates the mount target   The IP address range from which Amazon EFS selects the IP address of the mount target (if you don't specify an IP address in the request)     After creating the mount target, Amazon EFS returns a response that includes, a MountTargetId and an IpAddress. You use this IP address when mounting the file system in an EC2 instance. You can also use the mount target's DNS name when mounting the file system. The EC2 instance on which you mount the file system by using the mount target can resolve the mount target's DNS name to its IP address. For more information, see How it Works: Implementation Overview.  Note that you can create mount targets for a file system in only one VPC, and there can be only one mount target per Availability Zone. That is, if the file system already has one or more mount targets created for it, the subnet specified in the request to add another mount target must meet the following requirements:   Must belong to the same VPC as the subnets of the existing mount targets   Must not be in the same Availability Zone as any of the subnets of the existing mount targets   If the request satisfies the requirements, Amazon EFS does the following:   Creates a new mount target in the specified subnet.   Also creates a new network interface in the subnet as follows:   If the request provides an IpAddress, Amazon EFS assigns that IP address to the network interface. Otherwise, Amazon EFS assigns a free address in the subnet (in the same way that the Amazon EC2 CreateNetworkInterface call does when a request does not specify a primary private IP address).   If the request provides SecurityGroups, this network interface is associated with those security groups. Otherwise, it belongs to the default security group for the subnet's VPC.   Assigns the description Mount target fsmt-id for file system fs-id  where  fsmt-id  is the mount target ID, and  fs-id  is the FileSystemId.   Sets the requesterManaged property of the network interface to true, and the requesterId value to EFS.   Each Amazon EFS mount target has one corresponding requester-managed EC2 network interface. After the network interface is created, Amazon EFS sets the NetworkInterfaceId field in the mount target's description to the network interface ID, and the IpAddress field to its address. If network interface creation fails, the entire CreateMountTarget operation fails.    The CreateMountTarget call returns only after creating the network interface, but while the mount target state is still creating, you can check the mount target creation status by calling the DescribeMountTargets operation, which among other things returns the mount target state.  We recommend that you create a mount target in each of the Availability Zones. There are cost considerations for using a file system in an Availability Zone through a mount target created in another Availability Zone. For more information, see Amazon EFS. In addition, by always using a mount target local to the instance's Availability Zone, you eliminate a partial failure scenario. If the Availability Zone in which your mount target is created goes down, then you can't access your file system through that mount target.  This operation requires permissions for the following action on the file system:    elasticfilesystem:CreateMountTarget    This operation also requires permissions for the following Amazon EC2 actions:    ec2:DescribeSubnets     ec2:DescribeNetworkInterfaces     ec2:CreateNetworkInterface   
   */
  createMountTarget(params: EFS.Types.CreateMountTargetRequest, callback?: (err: AWSError, data: EFS.Types.MountTargetDescription) => void): Request<EFS.Types.MountTargetDescription, AWSError>;
  /**
   * Creates a mount target for a file system. You can then mount the file system on EC2 instances by using the mount target. You can create one mount target in each Availability Zone in your VPC. All EC2 instances in a VPC within a given Availability Zone share a single mount target for a given file system. If you have multiple subnets in an Availability Zone, you create a mount target in one of the subnets. EC2 instances do not need to be in the same subnet as the mount target in order to access their file system. You can create only one mount target for an EFS file system using One Zone storage classes. You must create that mount target in the same Availability Zone in which the file system is located. Use the AvailabilityZoneName and AvailabiltyZoneId properties in the DescribeFileSystems response object to get this information. Use the subnetId associated with the file system's Availability Zone when creating the mount target. For more information, see Amazon EFS: How it Works.  To create a mount target for a file system, the file system's lifecycle state must be available. For more information, see DescribeFileSystems. In the request, provide the following:   The file system ID for which you are creating the mount target.   A subnet ID, which determines the following:   The VPC in which Amazon EFS creates the mount target   The Availability Zone in which Amazon EFS creates the mount target   The IP address range from which Amazon EFS selects the IP address of the mount target (if you don't specify an IP address in the request)     After creating the mount target, Amazon EFS returns a response that includes, a MountTargetId and an IpAddress. You use this IP address when mounting the file system in an EC2 instance. You can also use the mount target's DNS name when mounting the file system. The EC2 instance on which you mount the file system by using the mount target can resolve the mount target's DNS name to its IP address. For more information, see How it Works: Implementation Overview.  Note that you can create mount targets for a file system in only one VPC, and there can be only one mount target per Availability Zone. That is, if the file system already has one or more mount targets created for it, the subnet specified in the request to add another mount target must meet the following requirements:   Must belong to the same VPC as the subnets of the existing mount targets   Must not be in the same Availability Zone as any of the subnets of the existing mount targets   If the request satisfies the requirements, Amazon EFS does the following:   Creates a new mount target in the specified subnet.   Also creates a new network interface in the subnet as follows:   If the request provides an IpAddress, Amazon EFS assigns that IP address to the network interface. Otherwise, Amazon EFS assigns a free address in the subnet (in the same way that the Amazon EC2 CreateNetworkInterface call does when a request does not specify a primary private IP address).   If the request provides SecurityGroups, this network interface is associated with those security groups. Otherwise, it belongs to the default security group for the subnet's VPC.   Assigns the description Mount target fsmt-id for file system fs-id  where  fsmt-id  is the mount target ID, and  fs-id  is the FileSystemId.   Sets the requesterManaged property of the network interface to true, and the requesterId value to EFS.   Each Amazon EFS mount target has one corresponding requester-managed EC2 network interface. After the network interface is created, Amazon EFS sets the NetworkInterfaceId field in the mount target's description to the network interface ID, and the IpAddress field to its address. If network interface creation fails, the entire CreateMountTarget operation fails.    The CreateMountTarget call returns only after creating the network interface, but while the mount target state is still creating, you can check the mount target creation status by calling the DescribeMountTargets operation, which among other things returns the mount target state.  We recommend that you create a mount target in each of the Availability Zones. There are cost considerations for using a file system in an Availability Zone through a mount target created in another Availability Zone. For more information, see Amazon EFS. In addition, by always using a mount target local to the instance's Availability Zone, you eliminate a partial failure scenario. If the Availability Zone in which your mount target is created goes down, then you can't access your file system through that mount target.  This operation requires permissions for the following action on the file system:    elasticfilesystem:CreateMountTarget    This operation also requires permissions for the following Amazon EC2 actions:    ec2:DescribeSubnets     ec2:DescribeNetworkInterfaces     ec2:CreateNetworkInterface   
   */
  createMountTarget(callback?: (err: AWSError, data: EFS.Types.MountTargetDescription) => void): Request<EFS.Types.MountTargetDescription, AWSError>;
  /**
   * Creates a replication configuration that replicates an existing EFS file system to a new, read-only file system. For more information, see Amazon EFS replication in the Amazon EFS User Guide. The replication configuration specifies the following:    Source file system - An existing EFS file system that you want replicated. The source file system cannot be a destination file system in an existing replication configuration.    Destination file system configuration - The configuration of the destination file system to which the source file system will be replicated. There can only be one destination file system in a replication configuration. The destination file system configuration consists of the following properties:    Amazon Web Services Region - The Amazon Web Services Region in which the destination file system is created. Amazon EFS replication is available in all Amazon Web Services Regions in which EFS is available. To use EFS replication in a Region that is disabled by default, you must first opt in to the Region. For more information, see Managing Amazon Web Services Regions in the Amazon Web Services General Reference Reference Guide     Availability Zone - If you want the destination file system to use EFS One Zone availability and durability, you must specify the Availability Zone to create the file system in. For more information about EFS storage classes, see  Amazon EFS storage classes in the Amazon EFS User Guide.    Encryption - All destination file systems are created with encryption at rest enabled. You can specify the Key Management Service (KMS) key that is used to encrypt the destination file system. If you don't specify a KMS key, your service-managed KMS key for Amazon EFS is used.   After the file system is created, you cannot change the KMS key.      The following properties are set by default:    Performance mode - The destination file system's performance mode matches that of the source file system, unless the destination file system uses EFS One Zone storage. In that case, the General Purpose performance mode is used. The performance mode cannot be changed.    Throughput mode - The destination file system's throughput mode matches that of the source file system. After the file system is created, you can modify the throughput mode.   The following properties are turned off by default:    Lifecycle management - EFS lifecycle management and EFS Intelligent-Tiering are not enabled on the destination file system. After the destination file system is created, you can enable EFS lifecycle management and EFS Intelligent-Tiering.    Automatic backups - Automatic daily backups are enabled on the destination file system. After the file system is created, you can change this setting.   For more information, see Amazon EFS replication in the Amazon EFS User Guide.
   */
  createReplicationConfiguration(params: EFS.Types.CreateReplicationConfigurationRequest, callback?: (err: AWSError, data: EFS.Types.ReplicationConfigurationDescription) => void): Request<EFS.Types.ReplicationConfigurationDescription, AWSError>;
  /**
   * Creates a replication configuration that replicates an existing EFS file system to a new, read-only file system. For more information, see Amazon EFS replication in the Amazon EFS User Guide. The replication configuration specifies the following:    Source file system - An existing EFS file system that you want replicated. The source file system cannot be a destination file system in an existing replication configuration.    Destination file system configuration - The configuration of the destination file system to which the source file system will be replicated. There can only be one destination file system in a replication configuration. The destination file system configuration consists of the following properties:    Amazon Web Services Region - The Amazon Web Services Region in which the destination file system is created. Amazon EFS replication is available in all Amazon Web Services Regions in which EFS is available. To use EFS replication in a Region that is disabled by default, you must first opt in to the Region. For more information, see Managing Amazon Web Services Regions in the Amazon Web Services General Reference Reference Guide     Availability Zone - If you want the destination file system to use EFS One Zone availability and durability, you must specify the Availability Zone to create the file system in. For more information about EFS storage classes, see  Amazon EFS storage classes in the Amazon EFS User Guide.    Encryption - All destination file systems are created with encryption at rest enabled. You can specify the Key Management Service (KMS) key that is used to encrypt the destination file system. If you don't specify a KMS key, your service-managed KMS key for Amazon EFS is used.   After the file system is created, you cannot change the KMS key.      The following properties are set by default:    Performance mode - The destination file system's performance mode matches that of the source file system, unless the destination file system uses EFS One Zone storage. In that case, the General Purpose performance mode is used. The performance mode cannot be changed.    Throughput mode - The destination file system's throughput mode matches that of the source file system. After the file system is created, you can modify the throughput mode.   The following properties are turned off by default:    Lifecycle management - EFS lifecycle management and EFS Intelligent-Tiering are not enabled on the destination file system. After the destination file system is created, you can enable EFS lifecycle management and EFS Intelligent-Tiering.    Automatic backups - Automatic daily backups are enabled on the destination file system. After the file system is created, you can change this setting.   For more information, see Amazon EFS replication in the Amazon EFS User Guide.
   */
  createReplicationConfiguration(callback?: (err: AWSError, data: EFS.Types.ReplicationConfigurationDescription) => void): Request<EFS.Types.ReplicationConfigurationDescription, AWSError>;
  /**
   *  DEPRECATED - CreateTags is deprecated and not maintained. To create tags for EFS resources, use the API action.  Creates or overwrites tags associated with a file system. Each tag is a key-value pair. If a tag key specified in the request already exists on the file system, this operation overwrites its value with the value provided in the request. If you add the Name tag to your file system, Amazon EFS returns it in the response to the DescribeFileSystems operation.  This operation requires permission for the elasticfilesystem:CreateTags action.
   */
  createTags(params: EFS.Types.CreateTagsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  DEPRECATED - CreateTags is deprecated and not maintained. To create tags for EFS resources, use the API action.  Creates or overwrites tags associated with a file system. Each tag is a key-value pair. If a tag key specified in the request already exists on the file system, this operation overwrites its value with the value provided in the request. If you add the Name tag to your file system, Amazon EFS returns it in the response to the DescribeFileSystems operation.  This operation requires permission for the elasticfilesystem:CreateTags action.
   */
  createTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified access point. After deletion is complete, new clients can no longer connect to the access points. Clients connected to the access point at the time of deletion will continue to function until they terminate their connection. This operation requires permissions for the elasticfilesystem:DeleteAccessPoint action.
   */
  deleteAccessPoint(params: EFS.Types.DeleteAccessPointRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified access point. After deletion is complete, new clients can no longer connect to the access points. Clients connected to the access point at the time of deletion will continue to function until they terminate their connection. This operation requires permissions for the elasticfilesystem:DeleteAccessPoint action.
   */
  deleteAccessPoint(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a file system, permanently severing access to its contents. Upon return, the file system no longer exists and you can't access any contents of the deleted file system. You need to manually delete mount targets attached to a file system before you can delete an EFS file system. This step is performed for you when you use the Amazon Web Services console to delete a file system.  You cannot delete a file system that is part of an EFS Replication configuration. You need to delete the replication configuration first.   You can't delete a file system that is in use. That is, if the file system has any mount targets, you must first delete them. For more information, see DescribeMountTargets and DeleteMountTarget.   The DeleteFileSystem call returns while the file system state is still deleting. You can check the file system deletion status by calling the DescribeFileSystems operation, which returns a list of file systems in your account. If you pass file system ID or creation token for the deleted file system, the DescribeFileSystems returns a 404 FileSystemNotFound error.  This operation requires permissions for the elasticfilesystem:DeleteFileSystem action.
   */
  deleteFileSystem(params: EFS.Types.DeleteFileSystemRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a file system, permanently severing access to its contents. Upon return, the file system no longer exists and you can't access any contents of the deleted file system. You need to manually delete mount targets attached to a file system before you can delete an EFS file system. This step is performed for you when you use the Amazon Web Services console to delete a file system.  You cannot delete a file system that is part of an EFS Replication configuration. You need to delete the replication configuration first.   You can't delete a file system that is in use. That is, if the file system has any mount targets, you must first delete them. For more information, see DescribeMountTargets and DeleteMountTarget.   The DeleteFileSystem call returns while the file system state is still deleting. You can check the file system deletion status by calling the DescribeFileSystems operation, which returns a list of file systems in your account. If you pass file system ID or creation token for the deleted file system, the DescribeFileSystems returns a 404 FileSystemNotFound error.  This operation requires permissions for the elasticfilesystem:DeleteFileSystem action.
   */
  deleteFileSystem(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the FileSystemPolicy for the specified file system. The default FileSystemPolicy goes into effect once the existing policy is deleted. For more information about the default file system policy, see Using Resource-based Policies with EFS. This operation requires permissions for the elasticfilesystem:DeleteFileSystemPolicy action.
   */
  deleteFileSystemPolicy(params: EFS.Types.DeleteFileSystemPolicyRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the FileSystemPolicy for the specified file system. The default FileSystemPolicy goes into effect once the existing policy is deleted. For more information about the default file system policy, see Using Resource-based Policies with EFS. This operation requires permissions for the elasticfilesystem:DeleteFileSystemPolicy action.
   */
  deleteFileSystemPolicy(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified mount target. This operation forcibly breaks any mounts of the file system by using the mount target that is being deleted, which might disrupt instances or applications using those mounts. To avoid applications getting cut off abruptly, you might consider unmounting any mounts of the mount target, if feasible. The operation also deletes the associated network interface. Uncommitted writes might be lost, but breaking a mount target using this operation does not corrupt the file system itself. The file system you created remains. You can mount an EC2 instance in your VPC by using another mount target. This operation requires permissions for the following action on the file system:    elasticfilesystem:DeleteMountTarget     The DeleteMountTarget call returns while the mount target state is still deleting. You can check the mount target deletion by calling the DescribeMountTargets operation, which returns a list of mount target descriptions for the given file system.   The operation also requires permissions for the following Amazon EC2 action on the mount target's network interface:    ec2:DeleteNetworkInterface   
   */
  deleteMountTarget(params: EFS.Types.DeleteMountTargetRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes the specified mount target. This operation forcibly breaks any mounts of the file system by using the mount target that is being deleted, which might disrupt instances or applications using those mounts. To avoid applications getting cut off abruptly, you might consider unmounting any mounts of the mount target, if feasible. The operation also deletes the associated network interface. Uncommitted writes might be lost, but breaking a mount target using this operation does not corrupt the file system itself. The file system you created remains. You can mount an EC2 instance in your VPC by using another mount target. This operation requires permissions for the following action on the file system:    elasticfilesystem:DeleteMountTarget     The DeleteMountTarget call returns while the mount target state is still deleting. You can check the mount target deletion by calling the DescribeMountTargets operation, which returns a list of mount target descriptions for the given file system.   The operation also requires permissions for the following Amazon EC2 action on the mount target's network interface:    ec2:DeleteNetworkInterface   
   */
  deleteMountTarget(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing replication configuration. Deleting a replication configuration ends the replication process. After a replication configuration is deleted, the destination file system is no longer read-only. You can write to the destination file system after its status becomes Writeable.
   */
  deleteReplicationConfiguration(params: EFS.Types.DeleteReplicationConfigurationRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes an existing replication configuration. Deleting a replication configuration ends the replication process. After a replication configuration is deleted, the destination file system is no longer read-only. You can write to the destination file system after its status becomes Writeable.
   */
  deleteReplicationConfiguration(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  DEPRECATED - DeleteTags is deprecated and not maintained. To remove tags from EFS resources, use the API action.  Deletes the specified tags from a file system. If the DeleteTags request includes a tag key that doesn't exist, Amazon EFS ignores it and doesn't cause an error. For more information about tags and related restrictions, see Tag restrictions in the Billing and Cost Management User Guide. This operation requires permissions for the elasticfilesystem:DeleteTags action.
   */
  deleteTags(params: EFS.Types.DeleteTagsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   *  DEPRECATED - DeleteTags is deprecated and not maintained. To remove tags from EFS resources, use the API action.  Deletes the specified tags from a file system. If the DeleteTags request includes a tag key that doesn't exist, Amazon EFS ignores it and doesn't cause an error. For more information about tags and related restrictions, see Tag restrictions in the Billing and Cost Management User Guide. This operation requires permissions for the elasticfilesystem:DeleteTags action.
   */
  deleteTags(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns the description of a specific Amazon EFS access point if the AccessPointId is provided. If you provide an EFS FileSystemId, it returns descriptions of all access points for that file system. You can provide either an AccessPointId or a FileSystemId in the request, but not both.  This operation requires permissions for the elasticfilesystem:DescribeAccessPoints action.
   */
  describeAccessPoints(params: EFS.Types.DescribeAccessPointsRequest, callback?: (err: AWSError, data: EFS.Types.DescribeAccessPointsResponse) => void): Request<EFS.Types.DescribeAccessPointsResponse, AWSError>;
  /**
   * Returns the description of a specific Amazon EFS access point if the AccessPointId is provided. If you provide an EFS FileSystemId, it returns descriptions of all access points for that file system. You can provide either an AccessPointId or a FileSystemId in the request, but not both.  This operation requires permissions for the elasticfilesystem:DescribeAccessPoints action.
   */
  describeAccessPoints(callback?: (err: AWSError, data: EFS.Types.DescribeAccessPointsResponse) => void): Request<EFS.Types.DescribeAccessPointsResponse, AWSError>;
  /**
   * Returns the account preferences settings for the Amazon Web Services account associated with the user making the request, in the current Amazon Web Services Region.
   */
  describeAccountPreferences(params: EFS.Types.DescribeAccountPreferencesRequest, callback?: (err: AWSError, data: EFS.Types.DescribeAccountPreferencesResponse) => void): Request<EFS.Types.DescribeAccountPreferencesResponse, AWSError>;
  /**
   * Returns the account preferences settings for the Amazon Web Services account associated with the user making the request, in the current Amazon Web Services Region.
   */
  describeAccountPreferences(callback?: (err: AWSError, data: EFS.Types.DescribeAccountPreferencesResponse) => void): Request<EFS.Types.DescribeAccountPreferencesResponse, AWSError>;
  /**
   * Returns the backup policy for the specified EFS file system.
   */
  describeBackupPolicy(params: EFS.Types.DescribeBackupPolicyRequest, callback?: (err: AWSError, data: EFS.Types.BackupPolicyDescription) => void): Request<EFS.Types.BackupPolicyDescription, AWSError>;
  /**
   * Returns the backup policy for the specified EFS file system.
   */
  describeBackupPolicy(callback?: (err: AWSError, data: EFS.Types.BackupPolicyDescription) => void): Request<EFS.Types.BackupPolicyDescription, AWSError>;
  /**
   * Returns the FileSystemPolicy for the specified EFS file system. This operation requires permissions for the elasticfilesystem:DescribeFileSystemPolicy action.
   */
  describeFileSystemPolicy(params: EFS.Types.DescribeFileSystemPolicyRequest, callback?: (err: AWSError, data: EFS.Types.FileSystemPolicyDescription) => void): Request<EFS.Types.FileSystemPolicyDescription, AWSError>;
  /**
   * Returns the FileSystemPolicy for the specified EFS file system. This operation requires permissions for the elasticfilesystem:DescribeFileSystemPolicy action.
   */
  describeFileSystemPolicy(callback?: (err: AWSError, data: EFS.Types.FileSystemPolicyDescription) => void): Request<EFS.Types.FileSystemPolicyDescription, AWSError>;
  /**
   * Returns the description of a specific Amazon EFS file system if either the file system CreationToken or the FileSystemId is provided. Otherwise, it returns descriptions of all file systems owned by the caller's Amazon Web Services account in the Amazon Web Services Region of the endpoint that you're calling. When retrieving all file system descriptions, you can optionally specify the MaxItems parameter to limit the number of descriptions in a response. This number is automatically set to 100. If more file system descriptions remain, Amazon EFS returns a NextMarker, an opaque token, in the response. In this case, you should send a subsequent request with the Marker request parameter set to the value of NextMarker.  To retrieve a list of your file system descriptions, this operation is used in an iterative process, where DescribeFileSystems is called first without the Marker and then the operation continues to call it with the Marker parameter set to the value of the NextMarker from the previous response until the response has no NextMarker.   The order of file systems returned in the response of one DescribeFileSystems call and the order of file systems returned across the responses of a multi-call iteration is unspecified.   This operation requires permissions for the elasticfilesystem:DescribeFileSystems action. 
   */
  describeFileSystems(params: EFS.Types.DescribeFileSystemsRequest, callback?: (err: AWSError, data: EFS.Types.DescribeFileSystemsResponse) => void): Request<EFS.Types.DescribeFileSystemsResponse, AWSError>;
  /**
   * Returns the description of a specific Amazon EFS file system if either the file system CreationToken or the FileSystemId is provided. Otherwise, it returns descriptions of all file systems owned by the caller's Amazon Web Services account in the Amazon Web Services Region of the endpoint that you're calling. When retrieving all file system descriptions, you can optionally specify the MaxItems parameter to limit the number of descriptions in a response. This number is automatically set to 100. If more file system descriptions remain, Amazon EFS returns a NextMarker, an opaque token, in the response. In this case, you should send a subsequent request with the Marker request parameter set to the value of NextMarker.  To retrieve a list of your file system descriptions, this operation is used in an iterative process, where DescribeFileSystems is called first without the Marker and then the operation continues to call it with the Marker parameter set to the value of the NextMarker from the previous response until the response has no NextMarker.   The order of file systems returned in the response of one DescribeFileSystems call and the order of file systems returned across the responses of a multi-call iteration is unspecified.   This operation requires permissions for the elasticfilesystem:DescribeFileSystems action. 
   */
  describeFileSystems(callback?: (err: AWSError, data: EFS.Types.DescribeFileSystemsResponse) => void): Request<EFS.Types.DescribeFileSystemsResponse, AWSError>;
  /**
   * Returns the current LifecycleConfiguration object for the specified Amazon EFS file system. EFS lifecycle management uses the LifecycleConfiguration object to identify which files to move to the EFS Infrequent Access (IA) storage class. For a file system without a LifecycleConfiguration object, the call returns an empty array in the response. When EFS Intelligent-Tiering is enabled, TransitionToPrimaryStorageClass has a value of AFTER_1_ACCESS. This operation requires permissions for the elasticfilesystem:DescribeLifecycleConfiguration operation.
   */
  describeLifecycleConfiguration(params: EFS.Types.DescribeLifecycleConfigurationRequest, callback?: (err: AWSError, data: EFS.Types.LifecycleConfigurationDescription) => void): Request<EFS.Types.LifecycleConfigurationDescription, AWSError>;
  /**
   * Returns the current LifecycleConfiguration object for the specified Amazon EFS file system. EFS lifecycle management uses the LifecycleConfiguration object to identify which files to move to the EFS Infrequent Access (IA) storage class. For a file system without a LifecycleConfiguration object, the call returns an empty array in the response. When EFS Intelligent-Tiering is enabled, TransitionToPrimaryStorageClass has a value of AFTER_1_ACCESS. This operation requires permissions for the elasticfilesystem:DescribeLifecycleConfiguration operation.
   */
  describeLifecycleConfiguration(callback?: (err: AWSError, data: EFS.Types.LifecycleConfigurationDescription) => void): Request<EFS.Types.LifecycleConfigurationDescription, AWSError>;
  /**
   * Returns the security groups currently in effect for a mount target. This operation requires that the network interface of the mount target has been created and the lifecycle state of the mount target is not deleted. This operation requires permissions for the following actions:    elasticfilesystem:DescribeMountTargetSecurityGroups action on the mount target's file system.     ec2:DescribeNetworkInterfaceAttribute action on the mount target's network interface.   
   */
  describeMountTargetSecurityGroups(params: EFS.Types.DescribeMountTargetSecurityGroupsRequest, callback?: (err: AWSError, data: EFS.Types.DescribeMountTargetSecurityGroupsResponse) => void): Request<EFS.Types.DescribeMountTargetSecurityGroupsResponse, AWSError>;
  /**
   * Returns the security groups currently in effect for a mount target. This operation requires that the network interface of the mount target has been created and the lifecycle state of the mount target is not deleted. This operation requires permissions for the following actions:    elasticfilesystem:DescribeMountTargetSecurityGroups action on the mount target's file system.     ec2:DescribeNetworkInterfaceAttribute action on the mount target's network interface.   
   */
  describeMountTargetSecurityGroups(callback?: (err: AWSError, data: EFS.Types.DescribeMountTargetSecurityGroupsResponse) => void): Request<EFS.Types.DescribeMountTargetSecurityGroupsResponse, AWSError>;
  /**
   * Returns the descriptions of all the current mount targets, or a specific mount target, for a file system. When requesting all of the current mount targets, the order of mount targets returned in the response is unspecified. This operation requires permissions for the elasticfilesystem:DescribeMountTargets action, on either the file system ID that you specify in FileSystemId, or on the file system of the mount target that you specify in MountTargetId.
   */
  describeMountTargets(params: EFS.Types.DescribeMountTargetsRequest, callback?: (err: AWSError, data: EFS.Types.DescribeMountTargetsResponse) => void): Request<EFS.Types.DescribeMountTargetsResponse, AWSError>;
  /**
   * Returns the descriptions of all the current mount targets, or a specific mount target, for a file system. When requesting all of the current mount targets, the order of mount targets returned in the response is unspecified. This operation requires permissions for the elasticfilesystem:DescribeMountTargets action, on either the file system ID that you specify in FileSystemId, or on the file system of the mount target that you specify in MountTargetId.
   */
  describeMountTargets(callback?: (err: AWSError, data: EFS.Types.DescribeMountTargetsResponse) => void): Request<EFS.Types.DescribeMountTargetsResponse, AWSError>;
  /**
   * Retrieves the replication configuration for a specific file system. If a file system is not specified, all of the replication configurations for the Amazon Web Services account in an Amazon Web Services Region are retrieved.
   */
  describeReplicationConfigurations(params: EFS.Types.DescribeReplicationConfigurationsRequest, callback?: (err: AWSError, data: EFS.Types.DescribeReplicationConfigurationsResponse) => void): Request<EFS.Types.DescribeReplicationConfigurationsResponse, AWSError>;
  /**
   * Retrieves the replication configuration for a specific file system. If a file system is not specified, all of the replication configurations for the Amazon Web Services account in an Amazon Web Services Region are retrieved.
   */
  describeReplicationConfigurations(callback?: (err: AWSError, data: EFS.Types.DescribeReplicationConfigurationsResponse) => void): Request<EFS.Types.DescribeReplicationConfigurationsResponse, AWSError>;
  /**
   *  DEPRECATED - The DescribeTags action is deprecated and not maintained. To view tags associated with EFS resources, use the ListTagsForResource API action.  Returns the tags associated with a file system. The order of tags returned in the response of one DescribeTags call and the order of tags returned across the responses of a multiple-call iteration (when using pagination) is unspecified.   This operation requires permissions for the elasticfilesystem:DescribeTags action. 
   */
  describeTags(params: EFS.Types.DescribeTagsRequest, callback?: (err: AWSError, data: EFS.Types.DescribeTagsResponse) => void): Request<EFS.Types.DescribeTagsResponse, AWSError>;
  /**
   *  DEPRECATED - The DescribeTags action is deprecated and not maintained. To view tags associated with EFS resources, use the ListTagsForResource API action.  Returns the tags associated with a file system. The order of tags returned in the response of one DescribeTags call and the order of tags returned across the responses of a multiple-call iteration (when using pagination) is unspecified.   This operation requires permissions for the elasticfilesystem:DescribeTags action. 
   */
  describeTags(callback?: (err: AWSError, data: EFS.Types.DescribeTagsResponse) => void): Request<EFS.Types.DescribeTagsResponse, AWSError>;
  /**
   * Lists all tags for a top-level EFS resource. You must provide the ID of the resource that you want to retrieve the tags for. This operation requires permissions for the elasticfilesystem:DescribeAccessPoints action.
   */
  listTagsForResource(params: EFS.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: EFS.Types.ListTagsForResourceResponse) => void): Request<EFS.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists all tags for a top-level EFS resource. You must provide the ID of the resource that you want to retrieve the tags for. This operation requires permissions for the elasticfilesystem:DescribeAccessPoints action.
   */
  listTagsForResource(callback?: (err: AWSError, data: EFS.Types.ListTagsForResourceResponse) => void): Request<EFS.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Modifies the set of security groups in effect for a mount target. When you create a mount target, Amazon EFS also creates a new network interface. For more information, see CreateMountTarget. This operation replaces the security groups in effect for the network interface associated with a mount target, with the SecurityGroups provided in the request. This operation requires that the network interface of the mount target has been created and the lifecycle state of the mount target is not deleted.  The operation requires permissions for the following actions:    elasticfilesystem:ModifyMountTargetSecurityGroups action on the mount target's file system.     ec2:ModifyNetworkInterfaceAttribute action on the mount target's network interface.   
   */
  modifyMountTargetSecurityGroups(params: EFS.Types.ModifyMountTargetSecurityGroupsRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Modifies the set of security groups in effect for a mount target. When you create a mount target, Amazon EFS also creates a new network interface. For more information, see CreateMountTarget. This operation replaces the security groups in effect for the network interface associated with a mount target, with the SecurityGroups provided in the request. This operation requires that the network interface of the mount target has been created and the lifecycle state of the mount target is not deleted.  The operation requires permissions for the following actions:    elasticfilesystem:ModifyMountTargetSecurityGroups action on the mount target's file system.     ec2:ModifyNetworkInterfaceAttribute action on the mount target's network interface.   
   */
  modifyMountTargetSecurityGroups(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Use this operation to set the account preference in the current Amazon Web Services Region to use long 17 character (63 bit) or short 8 character (32 bit) resource IDs for new EFS file system and mount target resources. All existing resource IDs are not affected by any changes you make. You can set the ID preference during the opt-in period as EFS transitions to long resource IDs. For more information, see Managing Amazon EFS resource IDs.  Starting in October, 2021, you will receive an error if you try to set the account preference to use the short 8 character format resource ID. Contact Amazon Web Services support if you receive an error and must use short IDs for file system and mount target resources. 
   */
  putAccountPreferences(params: EFS.Types.PutAccountPreferencesRequest, callback?: (err: AWSError, data: EFS.Types.PutAccountPreferencesResponse) => void): Request<EFS.Types.PutAccountPreferencesResponse, AWSError>;
  /**
   * Use this operation to set the account preference in the current Amazon Web Services Region to use long 17 character (63 bit) or short 8 character (32 bit) resource IDs for new EFS file system and mount target resources. All existing resource IDs are not affected by any changes you make. You can set the ID preference during the opt-in period as EFS transitions to long resource IDs. For more information, see Managing Amazon EFS resource IDs.  Starting in October, 2021, you will receive an error if you try to set the account preference to use the short 8 character format resource ID. Contact Amazon Web Services support if you receive an error and must use short IDs for file system and mount target resources. 
   */
  putAccountPreferences(callback?: (err: AWSError, data: EFS.Types.PutAccountPreferencesResponse) => void): Request<EFS.Types.PutAccountPreferencesResponse, AWSError>;
  /**
   * Updates the file system's backup policy. Use this action to start or stop automatic backups of the file system. 
   */
  putBackupPolicy(params: EFS.Types.PutBackupPolicyRequest, callback?: (err: AWSError, data: EFS.Types.BackupPolicyDescription) => void): Request<EFS.Types.BackupPolicyDescription, AWSError>;
  /**
   * Updates the file system's backup policy. Use this action to start or stop automatic backups of the file system. 
   */
  putBackupPolicy(callback?: (err: AWSError, data: EFS.Types.BackupPolicyDescription) => void): Request<EFS.Types.BackupPolicyDescription, AWSError>;
  /**
   * Applies an Amazon EFS FileSystemPolicy to an Amazon EFS file system. A file system policy is an IAM resource-based policy and can contain multiple policy statements. A file system always has exactly one file system policy, which can be the default policy or an explicit policy set or updated using this API operation. EFS file system policies have a 20,000 character limit. When an explicit policy is set, it overrides the default policy. For more information about the default file system policy, see Default EFS File System Policy.   EFS file system policies have a 20,000 character limit.  This operation requires permissions for the elasticfilesystem:PutFileSystemPolicy action.
   */
  putFileSystemPolicy(params: EFS.Types.PutFileSystemPolicyRequest, callback?: (err: AWSError, data: EFS.Types.FileSystemPolicyDescription) => void): Request<EFS.Types.FileSystemPolicyDescription, AWSError>;
  /**
   * Applies an Amazon EFS FileSystemPolicy to an Amazon EFS file system. A file system policy is an IAM resource-based policy and can contain multiple policy statements. A file system always has exactly one file system policy, which can be the default policy or an explicit policy set or updated using this API operation. EFS file system policies have a 20,000 character limit. When an explicit policy is set, it overrides the default policy. For more information about the default file system policy, see Default EFS File System Policy.   EFS file system policies have a 20,000 character limit.  This operation requires permissions for the elasticfilesystem:PutFileSystemPolicy action.
   */
  putFileSystemPolicy(callback?: (err: AWSError, data: EFS.Types.FileSystemPolicyDescription) => void): Request<EFS.Types.FileSystemPolicyDescription, AWSError>;
  /**
   * Use this action to manage EFS lifecycle management and EFS Intelligent-Tiering. A LifecycleConfiguration consists of one or more LifecyclePolicy objects that define the following:    EFS Lifecycle management - When Amazon EFS automatically transitions files in a file system into the lower-cost EFS Infrequent Access (IA) storage class. To enable EFS Lifecycle management, set the value of TransitionToIA to one of the available options.    EFS Intelligent-Tiering - When Amazon EFS automatically transitions files from IA back into the file system's primary storage class (EFS Standard or EFS One Zone Standard). To enable EFS Intelligent-Tiering, set the value of TransitionToPrimaryStorageClass to AFTER_1_ACCESS.   For more information, see EFS Lifecycle Management. Each Amazon EFS file system supports one lifecycle configuration, which applies to all files in the file system. If a LifecycleConfiguration object already exists for the specified file system, a PutLifecycleConfiguration call modifies the existing configuration. A PutLifecycleConfiguration call with an empty LifecyclePolicies array in the request body deletes any existing LifecycleConfiguration and turns off lifecycle management and EFS Intelligent-Tiering for the file system. In the request, specify the following:    The ID for the file system for which you are enabling, disabling, or modifying lifecycle management and EFS Intelligent-Tiering.   A LifecyclePolicies array of LifecyclePolicy objects that define when files are moved into IA storage, and when they are moved back to Standard storage.  Amazon EFS requires that each LifecyclePolicy object have only have a single transition, so the LifecyclePolicies array needs to be structured with separate LifecyclePolicy objects. See the example requests in the following section for more information.    This operation requires permissions for the elasticfilesystem:PutLifecycleConfiguration operation. To apply a LifecycleConfiguration object to an encrypted file system, you need the same Key Management Service permissions as when you created the encrypted file system.
   */
  putLifecycleConfiguration(params: EFS.Types.PutLifecycleConfigurationRequest, callback?: (err: AWSError, data: EFS.Types.LifecycleConfigurationDescription) => void): Request<EFS.Types.LifecycleConfigurationDescription, AWSError>;
  /**
   * Use this action to manage EFS lifecycle management and EFS Intelligent-Tiering. A LifecycleConfiguration consists of one or more LifecyclePolicy objects that define the following:    EFS Lifecycle management - When Amazon EFS automatically transitions files in a file system into the lower-cost EFS Infrequent Access (IA) storage class. To enable EFS Lifecycle management, set the value of TransitionToIA to one of the available options.    EFS Intelligent-Tiering - When Amazon EFS automatically transitions files from IA back into the file system's primary storage class (EFS Standard or EFS One Zone Standard). To enable EFS Intelligent-Tiering, set the value of TransitionToPrimaryStorageClass to AFTER_1_ACCESS.   For more information, see EFS Lifecycle Management. Each Amazon EFS file system supports one lifecycle configuration, which applies to all files in the file system. If a LifecycleConfiguration object already exists for the specified file system, a PutLifecycleConfiguration call modifies the existing configuration. A PutLifecycleConfiguration call with an empty LifecyclePolicies array in the request body deletes any existing LifecycleConfiguration and turns off lifecycle management and EFS Intelligent-Tiering for the file system. In the request, specify the following:    The ID for the file system for which you are enabling, disabling, or modifying lifecycle management and EFS Intelligent-Tiering.   A LifecyclePolicies array of LifecyclePolicy objects that define when files are moved into IA storage, and when they are moved back to Standard storage.  Amazon EFS requires that each LifecyclePolicy object have only have a single transition, so the LifecyclePolicies array needs to be structured with separate LifecyclePolicy objects. See the example requests in the following section for more information.    This operation requires permissions for the elasticfilesystem:PutLifecycleConfiguration operation. To apply a LifecycleConfiguration object to an encrypted file system, you need the same Key Management Service permissions as when you created the encrypted file system.
   */
  putLifecycleConfiguration(callback?: (err: AWSError, data: EFS.Types.LifecycleConfigurationDescription) => void): Request<EFS.Types.LifecycleConfigurationDescription, AWSError>;
  /**
   * Creates a tag for an EFS resource. You can create tags for EFS file systems and access points using this API operation. This operation requires permissions for the elasticfilesystem:TagResource action.
   */
  tagResource(params: EFS.Types.TagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Creates a tag for an EFS resource. You can create tags for EFS file systems and access points using this API operation. This operation requires permissions for the elasticfilesystem:TagResource action.
   */
  tagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags from an EFS resource. You can remove tags from EFS file systems and access points using this API operation. This operation requires permissions for the elasticfilesystem:UntagResource action.
   */
  untagResource(params: EFS.Types.UntagResourceRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Removes tags from an EFS resource. You can remove tags from EFS file systems and access points using this API operation. This operation requires permissions for the elasticfilesystem:UntagResource action.
   */
  untagResource(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Updates the throughput mode or the amount of provisioned throughput of an existing file system.
   */
  updateFileSystem(params: EFS.Types.UpdateFileSystemRequest, callback?: (err: AWSError, data: EFS.Types.FileSystemDescription) => void): Request<EFS.Types.FileSystemDescription, AWSError>;
  /**
   * Updates the throughput mode or the amount of provisioned throughput of an existing file system.
   */
  updateFileSystem(callback?: (err: AWSError, data: EFS.Types.FileSystemDescription) => void): Request<EFS.Types.FileSystemDescription, AWSError>;
}
declare namespace EFS {
  export type AccessPointArn = string;
  export interface AccessPointDescription {
    /**
     * The opaque string specified in the request to ensure idempotent creation.
     */
    ClientToken?: ClientToken;
    /**
     * The name of the access point. This is the value of the Name tag.
     */
    Name?: Name;
    /**
     * The tags associated with the access point, presented as an array of Tag objects.
     */
    Tags?: Tags;
    /**
     * The ID of the access point, assigned by Amazon EFS.
     */
    AccessPointId?: AccessPointId;
    /**
     * The unique Amazon Resource Name (ARN) associated with the access point.
     */
    AccessPointArn?: AccessPointArn;
    /**
     * The ID of the EFS file system that the access point applies to.
     */
    FileSystemId?: FileSystemId;
    /**
     * The full POSIX identity, including the user ID, group ID, and secondary group IDs on the access point that is used for all file operations by NFS clients using the access point.
     */
    PosixUser?: PosixUser;
    /**
     * The directory on the Amazon EFS file system that the access point exposes as the root directory to NFS clients using the access point.
     */
    RootDirectory?: RootDirectory;
    /**
     * Identifies the Amazon Web Services account that owns the access point resource.
     */
    OwnerId?: AwsAccountId;
    /**
     * Identifies the lifecycle phase of the access point.
     */
    LifeCycleState?: LifeCycleState;
  }
  export type AccessPointDescriptions = AccessPointDescription[];
  export type AccessPointId = string;
  export type AvailabilityZoneId = string;
  export type AvailabilityZoneName = string;
  export type AwsAccountId = string;
  export type Backup = boolean;
  export interface BackupPolicy {
    /**
     * Describes the status of the file system's backup policy.     ENABLED  - EFS is automatically backing up the file system.     ENABLING  - EFS is turning on automatic backups for the file system.     DISABLED  - Automatic back ups are turned off for the file system.     DISABLING  - EFS is turning off automatic backups for the file system.  
     */
    Status: Status;
  }
  export interface BackupPolicyDescription {
    /**
     * Describes the file system's backup policy, indicating whether automatic backups are turned on or off.
     */
    BackupPolicy?: BackupPolicy;
  }
  export type BypassPolicyLockoutSafetyCheck = boolean;
  export type ClientToken = string;
  export interface CreateAccessPointRequest {
    /**
     * A string of up to 64 ASCII characters that Amazon EFS uses to ensure idempotent creation.
     */
    ClientToken: ClientToken;
    /**
     * Creates tags associated with the access point. Each tag is a key-value pair, each key must be unique. For more information, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference Guide.
     */
    Tags?: Tags;
    /**
     * The ID of the EFS file system that the access point provides access to.
     */
    FileSystemId: FileSystemId;
    /**
     * The operating system user and group applied to all file system requests made using the access point.
     */
    PosixUser?: PosixUser;
    /**
     * Specifies the directory on the Amazon EFS file system that the access point exposes as the root directory of your file system to NFS clients using the access point. The clients using the access point can only access the root directory and below. If the RootDirectory &gt; Path specified does not exist, EFS creates it and applies the CreationInfo settings when a client connects to an access point. When specifying a RootDirectory, you must provide the Path, and the CreationInfo. Amazon EFS creates a root directory only if you have provided the CreationInfo: OwnUid, OwnGID, and permissions for the directory. If you do not provide this information, Amazon EFS does not create the root directory. If the root directory does not exist, attempts to mount using the access point will fail.
     */
    RootDirectory?: RootDirectory;
  }
  export interface CreateFileSystemRequest {
    /**
     * A string of up to 64 ASCII characters. Amazon EFS uses this to ensure idempotent creation.
     */
    CreationToken: CreationToken;
    /**
     * The performance mode of the file system. We recommend generalPurpose performance mode for most file systems. File systems using the maxIO performance mode can scale to higher levels of aggregate throughput and operations per second with a tradeoff of slightly higher latencies for most file operations. The performance mode can't be changed after the file system has been created.  The maxIO mode is not supported on file systems using One Zone storage classes.  Default is generalPurpose.
     */
    PerformanceMode?: PerformanceMode;
    /**
     * A Boolean value that, if true, creates an encrypted file system. When creating an encrypted file system, you have the option of specifying an existing Key Management Service key (KMS key). If you don't specify a KMS key, then the default KMS key for Amazon EFS, /aws/elasticfilesystem, is used to protect the encrypted file system. 
     */
    Encrypted?: Encrypted;
    /**
     * The ID of the KMS key that you want to use to protect the encrypted file system. This parameter is required only if you want to use a non-default KMS key. If this parameter is not specified, the default KMS key for Amazon EFS is used. You can specify a KMS key ID using the following formats:   Key ID - A unique identifier of the key, for example 1234abcd-12ab-34cd-56ef-1234567890ab.   ARN - An Amazon Resource Name (ARN) for the key, for example arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab.   Key alias - A previously created display name for a key, for example alias/projectKey1.   Key alias ARN - An ARN for a key alias, for example arn:aws:kms:us-west-2:444455556666:alias/projectKey1.   If you use KmsKeyId, you must set the CreateFileSystemRequest$Encrypted parameter to true.  EFS accepts only symmetric KMS keys. You cannot use asymmetric KMS keys with Amazon EFS file systems. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * Specifies the throughput mode for the file system. The mode can be bursting, provisioned, or elastic. If you set ThroughputMode to provisioned, you must also set a value for ProvisionedThroughputInMibps. After you create the file system, you can decrease your file system's throughput in Provisioned Throughput mode or change between the throughput modes, with certain time restrictions. For more information, see Specifying throughput with provisioned mode in the Amazon EFS User Guide.  Default is bursting.
     */
    ThroughputMode?: ThroughputMode;
    /**
     * The throughput, measured in mebibytes per second (MiBps), that you want to provision for a file system that you're creating. Required if ThroughputMode is set to provisioned. Valid values are 1-3414 MiBps, with the upper limit depending on Region. To increase this limit, contact Amazon Web Services Support. For more information, see Amazon EFS quotas that you can increase in the Amazon EFS User Guide.
     */
    ProvisionedThroughputInMibps?: ProvisionedThroughputInMibps;
    /**
     * Used to create a file system that uses One Zone storage classes. It specifies the Amazon Web Services Availability Zone in which to create the file system. Use the format us-east-1a to specify the Availability Zone. For more information about One Zone storage classes, see Using EFS storage classes in the Amazon EFS User Guide.  One Zone storage classes are not available in all Availability Zones in Amazon Web Services Regions where Amazon EFS is available. 
     */
    AvailabilityZoneName?: AvailabilityZoneName;
    /**
     * Specifies whether automatic backups are enabled on the file system that you are creating. Set the value to true to enable automatic backups. If you are creating a file system that uses One Zone storage classes, automatic backups are enabled by default. For more information, see Automatic backups in the Amazon EFS User Guide. Default is false. However, if you specify an AvailabilityZoneName, the default is true.  Backup is not available in all Amazon Web Services Regions where Amazon EFS is available. 
     */
    Backup?: Backup;
    /**
     * Use to create one or more tags associated with the file system. Each tag is a user-defined key-value pair. Name your file system on creation by including a "Key":"Name","Value":"{value}" key-value pair. Each key must be unique. For more information, see Tagging Amazon Web Services resources in the Amazon Web Services General Reference Guide.
     */
    Tags?: Tags;
  }
  export interface CreateMountTargetRequest {
    /**
     * The ID of the file system for which to create the mount target.
     */
    FileSystemId: FileSystemId;
    /**
     * The ID of the subnet to add the mount target in. For file systems that use One Zone storage classes, use the subnet that is associated with the file system's Availability Zone.
     */
    SubnetId: SubnetId;
    /**
     * Valid IPv4 address within the address range of the specified subnet.
     */
    IpAddress?: IpAddress;
    /**
     * Up to five VPC security group IDs, of the form sg-xxxxxxxx. These must be for the same VPC as subnet specified.
     */
    SecurityGroups?: SecurityGroups;
  }
  export interface CreateReplicationConfigurationRequest {
    /**
     * Specifies the Amazon EFS file system that you want to replicate. This file system cannot already be a source or destination file system in another replication configuration.
     */
    SourceFileSystemId: FileSystemId;
    /**
     * An array of destination configuration objects. Only one destination configuration object is supported.
     */
    Destinations: DestinationsToCreate;
  }
  export interface CreateTagsRequest {
    /**
     * The ID of the file system whose tags you want to modify (String). This operation modifies the tags only, not the file system.
     */
    FileSystemId: FileSystemId;
    /**
     * An array of Tag objects to add. Each Tag object is a key-value pair. 
     */
    Tags: Tags;
  }
  export interface CreationInfo {
    /**
     * Specifies the POSIX user ID to apply to the RootDirectory. Accepts values from 0 to 2^32 (4294967295).
     */
    OwnerUid: OwnerUid;
    /**
     * Specifies the POSIX group ID to apply to the RootDirectory. Accepts values from 0 to 2^32 (4294967295).
     */
    OwnerGid: OwnerGid;
    /**
     * Specifies the POSIX permissions to apply to the RootDirectory, in the format of an octal number representing the file's mode bits.
     */
    Permissions: Permissions;
  }
  export type CreationToken = string;
  export interface DeleteAccessPointRequest {
    /**
     * The ID of the access point that you want to delete.
     */
    AccessPointId: AccessPointId;
  }
  export interface DeleteFileSystemPolicyRequest {
    /**
     * Specifies the EFS file system for which to delete the FileSystemPolicy.
     */
    FileSystemId: FileSystemId;
  }
  export interface DeleteFileSystemRequest {
    /**
     * The ID of the file system you want to delete.
     */
    FileSystemId: FileSystemId;
  }
  export interface DeleteMountTargetRequest {
    /**
     * The ID of the mount target to delete (String).
     */
    MountTargetId: MountTargetId;
  }
  export interface DeleteReplicationConfigurationRequest {
    /**
     * The ID of the source file system in the replication configuration.
     */
    SourceFileSystemId: FileSystemId;
  }
  export interface DeleteTagsRequest {
    /**
     * The ID of the file system whose tags you want to delete (String).
     */
    FileSystemId: FileSystemId;
    /**
     * A list of tag keys to delete.
     */
    TagKeys: TagKeys;
  }
  export interface DescribeAccessPointsRequest {
    /**
     * (Optional) When retrieving all access points for a file system, you can optionally specify the MaxItems parameter to limit the number of objects returned in a response. The default value is 100. 
     */
    MaxResults?: MaxResults;
    /**
     *  NextToken is present if the response is paginated. You can use NextMarker in the subsequent request to fetch the next page of access point descriptions.
     */
    NextToken?: Token;
    /**
     * (Optional) Specifies an EFS access point to describe in the response; mutually exclusive with FileSystemId.
     */
    AccessPointId?: AccessPointId;
    /**
     * (Optional) If you provide a FileSystemId, EFS returns all access points for that file system; mutually exclusive with AccessPointId.
     */
    FileSystemId?: FileSystemId;
  }
  export interface DescribeAccessPointsResponse {
    /**
     * An array of access point descriptions.
     */
    AccessPoints?: AccessPointDescriptions;
    /**
     * Present if there are more access points than returned in the response. You can use the NextMarker in the subsequent request to fetch the additional descriptions.
     */
    NextToken?: Token;
  }
  export interface DescribeAccountPreferencesRequest {
    /**
     * (Optional) You can use NextToken in a subsequent request to fetch the next page of Amazon Web Services account preferences if the response payload was paginated.
     */
    NextToken?: Token;
    /**
     * (Optional) When retrieving account preferences, you can optionally specify the MaxItems parameter to limit the number of objects returned in a response. The default value is 100. 
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeAccountPreferencesResponse {
    /**
     * Describes the resource ID preference setting for the Amazon Web Services account associated with the user making the request, in the current Amazon Web Services Region.
     */
    ResourceIdPreference?: ResourceIdPreference;
    /**
     * Present if there are more records than returned in the response. You can use the NextToken in the subsequent request to fetch the additional descriptions.
     */
    NextToken?: Token;
  }
  export interface DescribeBackupPolicyRequest {
    /**
     * Specifies which EFS file system to retrieve the BackupPolicy for.
     */
    FileSystemId: FileSystemId;
  }
  export interface DescribeFileSystemPolicyRequest {
    /**
     * Specifies which EFS file system to retrieve the FileSystemPolicy for.
     */
    FileSystemId: FileSystemId;
  }
  export interface DescribeFileSystemsRequest {
    /**
     * (Optional) Specifies the maximum number of file systems to return in the response (integer). This number is automatically set to 100. The response is paginated at 100 per page if you have more than 100 file systems. 
     */
    MaxItems?: MaxItems;
    /**
     * (Optional) Opaque pagination token returned from a previous DescribeFileSystems operation (String). If present, specifies to continue the list from where the returning call had left off. 
     */
    Marker?: Marker;
    /**
     * (Optional) Restricts the list to the file system with this creation token (String). You specify a creation token when you create an Amazon EFS file system.
     */
    CreationToken?: CreationToken;
    /**
     * (Optional) ID of the file system whose description you want to retrieve (String).
     */
    FileSystemId?: FileSystemId;
  }
  export interface DescribeFileSystemsResponse {
    /**
     * Present if provided by caller in the request (String).
     */
    Marker?: Marker;
    /**
     * An array of file system descriptions.
     */
    FileSystems?: FileSystemDescriptions;
    /**
     * Present if there are more file systems than returned in the response (String). You can use the NextMarker in the subsequent request to fetch the descriptions.
     */
    NextMarker?: Marker;
  }
  export interface DescribeLifecycleConfigurationRequest {
    /**
     * The ID of the file system whose LifecycleConfiguration object you want to retrieve (String).
     */
    FileSystemId: FileSystemId;
  }
  export interface DescribeMountTargetSecurityGroupsRequest {
    /**
     * The ID of the mount target whose security groups you want to retrieve.
     */
    MountTargetId: MountTargetId;
  }
  export interface DescribeMountTargetSecurityGroupsResponse {
    /**
     * An array of security groups.
     */
    SecurityGroups: SecurityGroups;
  }
  export interface DescribeMountTargetsRequest {
    /**
     * (Optional) Maximum number of mount targets to return in the response. Currently, this number is automatically set to 10, and other values are ignored. The response is paginated at 100 per page if you have more than 100 mount targets.
     */
    MaxItems?: MaxItems;
    /**
     * (Optional) Opaque pagination token returned from a previous DescribeMountTargets operation (String). If present, it specifies to continue the list from where the previous returning call left off.
     */
    Marker?: Marker;
    /**
     * (Optional) ID of the file system whose mount targets you want to list (String). It must be included in your request if an AccessPointId or MountTargetId is not included. Accepts either a file system ID or ARN as input.
     */
    FileSystemId?: FileSystemId;
    /**
     * (Optional) ID of the mount target that you want to have described (String). It must be included in your request if FileSystemId is not included. Accepts either a mount target ID or ARN as input.
     */
    MountTargetId?: MountTargetId;
    /**
     * (Optional) The ID of the access point whose mount targets that you want to list. It must be included in your request if a FileSystemId or MountTargetId is not included in your request. Accepts either an access point ID or ARN as input.
     */
    AccessPointId?: AccessPointId;
  }
  export interface DescribeMountTargetsResponse {
    /**
     * If the request included the Marker, the response returns that value in this field.
     */
    Marker?: Marker;
    /**
     * Returns the file system's mount targets as an array of MountTargetDescription objects.
     */
    MountTargets?: MountTargetDescriptions;
    /**
     * If a value is present, there are more mount targets to return. In a subsequent request, you can provide Marker in your request with this value to retrieve the next set of mount targets.
     */
    NextMarker?: Marker;
  }
  export interface DescribeReplicationConfigurationsRequest {
    /**
     * You can retrieve the replication configuration for a specific file system by providing its file system ID.
     */
    FileSystemId?: FileSystemId;
    /**
     *  NextToken is present if the response is paginated. You can use NextToken in a subsequent request to fetch the next page of output.
     */
    NextToken?: Token;
    /**
     * (Optional) To limit the number of objects returned in a response, you can specify the MaxItems parameter. The default value is 100. 
     */
    MaxResults?: MaxResults;
  }
  export interface DescribeReplicationConfigurationsResponse {
    /**
     * The collection of replication configurations that is returned.
     */
    Replications?: ReplicationConfigurationDescriptions;
    /**
     * You can use the NextToken from the previous response in a subsequent request to fetch the additional descriptions.
     */
    NextToken?: Token;
  }
  export interface DescribeTagsRequest {
    /**
     * (Optional) The maximum number of file system tags to return in the response. Currently, this number is automatically set to 100, and other values are ignored. The response is paginated at 100 per page if you have more than 100 tags.
     */
    MaxItems?: MaxItems;
    /**
     * (Optional) An opaque pagination token returned from a previous DescribeTags operation (String). If present, it specifies to continue the list from where the previous call left off.
     */
    Marker?: Marker;
    /**
     * The ID of the file system whose tag set you want to retrieve.
     */
    FileSystemId: FileSystemId;
  }
  export interface DescribeTagsResponse {
    /**
     * If the request included a Marker, the response returns that value in this field.
     */
    Marker?: Marker;
    /**
     * Returns tags associated with the file system as an array of Tag objects. 
     */
    Tags: Tags;
    /**
     * If a value is present, there are more tags to return. In a subsequent request, you can provide the value of NextMarker as the value of the Marker parameter in your next request to retrieve the next set of tags.
     */
    NextMarker?: Marker;
  }
  export interface Destination {
    /**
     * Describes the status of the destination Amazon EFS file system.   The Paused state occurs as a result of opting out of the source or destination Region after the replication configuration was created. To resume replication for the file system, you need to again opt in to the Amazon Web Services Region. For more information, see Managing Amazon Web Services Regions in the Amazon Web Services General Reference Guide.   The Error state occurs when either the source or the destination file system (or both) is in a failed state and is unrecoverable. For more information, see Monitoring replication status in the Amazon EFS User Guide. You must delete the replication configuration, and then restore the most recent backup of the failed file system (either the source or the destination) to a new file system.  
     */
    Status: ReplicationStatus;
    /**
     * The ID of the destination Amazon EFS file system.
     */
    FileSystemId: FileSystemId;
    /**
     * The Amazon Web Services Region in which the destination file system is located.
     */
    Region: RegionName;
    /**
     * The time when the most recent sync was successfully completed on the destination file system. Any changes to data on the source file system that occurred before this time have been successfully replicated to the destination file system. Any changes that occurred after this time might not be fully replicated.
     */
    LastReplicatedTimestamp?: Timestamp;
  }
  export interface DestinationToCreate {
    /**
     * To create a file system that uses Regional storage, specify the Amazon Web Services Region in which to create the destination file system.
     */
    Region?: RegionName;
    /**
     * To create a file system that uses EFS One Zone storage, specify the name of the Availability Zone in which to create the destination file system.
     */
    AvailabilityZoneName?: AvailabilityZoneName;
    /**
     * Specifies the Key Management Service (KMS) key that you want to use to encrypt the destination file system. If you do not specify a KMS key, Amazon EFS uses your default KMS key for Amazon EFS, /aws/elasticfilesystem. This ID can be in one of the following formats:   Key ID - The unique identifier of the key, for example 1234abcd-12ab-34cd-56ef-1234567890ab.   ARN - The Amazon Resource Name (ARN) for the key, for example arn:aws:kms:us-west-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab.   Key alias - A previously created display name for a key, for example alias/projectKey1.   Key alias ARN - The ARN for a key alias, for example arn:aws:kms:us-west-2:444455556666:alias/projectKey1.  
     */
    KmsKeyId?: KmsKeyId;
  }
  export type Destinations = Destination[];
  export type DestinationsToCreate = DestinationToCreate[];
  export type Encrypted = boolean;
  export type FileSystemArn = string;
  export interface FileSystemDescription {
    /**
     * The Amazon Web Services account that created the file system.
     */
    OwnerId: AwsAccountId;
    /**
     * The opaque string specified in the request.
     */
    CreationToken: CreationToken;
    /**
     * The ID of the file system, assigned by Amazon EFS.
     */
    FileSystemId: FileSystemId;
    /**
     * The Amazon Resource Name (ARN) for the EFS file system, in the format arn:aws:elasticfilesystem:region:account-id:file-system/file-system-id . Example with sample data: arn:aws:elasticfilesystem:us-west-2:1111333322228888:file-system/fs-01234567 
     */
    FileSystemArn?: FileSystemArn;
    /**
     * The time that the file system was created, in seconds (since 1970-01-01T00:00:00Z).
     */
    CreationTime: Timestamp;
    /**
     * The lifecycle phase of the file system.
     */
    LifeCycleState: LifeCycleState;
    /**
     * You can add tags to a file system, including a Name tag. For more information, see CreateFileSystem. If the file system has a Name tag, Amazon EFS returns the value in this field. 
     */
    Name?: TagValue;
    /**
     * The current number of mount targets that the file system has. For more information, see CreateMountTarget.
     */
    NumberOfMountTargets: MountTargetCount;
    /**
     * The latest known metered size (in bytes) of data stored in the file system, in its Value field, and the time at which that size was determined in its Timestamp field. The Timestamp value is the integer number of seconds since 1970-01-01T00:00:00Z. The SizeInBytes value doesn't represent the size of a consistent snapshot of the file system, but it is eventually consistent when there are no writes to the file system. That is, SizeInBytes represents actual size only if the file system is not modified for a period longer than a couple of hours. Otherwise, the value is not the exact size that the file system was at any point in time. 
     */
    SizeInBytes: FileSystemSize;
    /**
     * The performance mode of the file system.
     */
    PerformanceMode: PerformanceMode;
    /**
     * A Boolean value that, if true, indicates that the file system is encrypted.
     */
    Encrypted?: Encrypted;
    /**
     * The ID of an KMS key used to protect the encrypted file system.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * Displays the file system's throughput mode. For more information, see Throughput modes in the Amazon EFS User Guide. 
     */
    ThroughputMode?: ThroughputMode;
    /**
     * The amount of provisioned throughput, measured in MiBps, for the file system. Valid for file systems using ThroughputMode set to provisioned.
     */
    ProvisionedThroughputInMibps?: ProvisionedThroughputInMibps;
    /**
     * Describes the Amazon Web Services Availability Zone in which the file system is located, and is valid only for file systems using One Zone storage classes. For more information, see Using EFS storage classes in the Amazon EFS User Guide.
     */
    AvailabilityZoneName?: AvailabilityZoneName;
    /**
     * The unique and consistent identifier of the Availability Zone in which the file system's One Zone storage classes exist. For example, use1-az1 is an Availability Zone ID for the us-east-1 Amazon Web Services Region, and it has the same location in every Amazon Web Services account.
     */
    AvailabilityZoneId?: AvailabilityZoneId;
    /**
     * The tags associated with the file system, presented as an array of Tag objects.
     */
    Tags: Tags;
  }
  export type FileSystemDescriptions = FileSystemDescription[];
  export type FileSystemId = string;
  export type FileSystemNullableSizeValue = number;
  export interface FileSystemPolicyDescription {
    /**
     * Specifies the EFS file system to which the FileSystemPolicy applies.
     */
    FileSystemId?: FileSystemId;
    /**
     * The JSON formatted FileSystemPolicy for the EFS file system.
     */
    Policy?: Policy;
  }
  export interface FileSystemSize {
    /**
     * The latest known metered size (in bytes) of data stored in the file system.
     */
    Value: FileSystemSizeValue;
    /**
     * The time at which the size of data, returned in the Value field, was determined. The value is the integer number of seconds since 1970-01-01T00:00:00Z.
     */
    Timestamp?: Timestamp;
    /**
     * The latest known metered size (in bytes) of data stored in the Infrequent Access storage class.
     */
    ValueInIA?: FileSystemNullableSizeValue;
    /**
     * The latest known metered size (in bytes) of data stored in the Standard storage class.
     */
    ValueInStandard?: FileSystemNullableSizeValue;
  }
  export type FileSystemSizeValue = number;
  export type Gid = number;
  export type IpAddress = string;
  export type KmsKeyId = string;
  export type LifeCycleState = "creating"|"available"|"updating"|"deleting"|"deleted"|"error"|string;
  export interface LifecycleConfigurationDescription {
    /**
     * An array of lifecycle management policies. EFS supports a maximum of one policy per file system.
     */
    LifecyclePolicies?: LifecyclePolicies;
  }
  export type LifecyclePolicies = LifecyclePolicy[];
  export interface LifecyclePolicy {
    /**
     *  Describes the period of time that a file is not accessed, after which it transitions to IA storage. Metadata operations such as listing the contents of a directory don't count as file access events.
     */
    TransitionToIA?: TransitionToIARules;
    /**
     * Describes when to transition a file from IA storage to primary storage. Metadata operations such as listing the contents of a directory don't count as file access events.
     */
    TransitionToPrimaryStorageClass?: TransitionToPrimaryStorageClassRules;
  }
  export interface ListTagsForResourceRequest {
    /**
     * Specifies the EFS resource you want to retrieve tags for. You can retrieve tags for EFS file systems and access points using this API endpoint.
     */
    ResourceId: ResourceId;
    /**
     * (Optional) Specifies the maximum number of tag objects to return in the response. The default value is 100.
     */
    MaxResults?: MaxResults;
    /**
     * (Optional) You can use NextToken in a subsequent request to fetch the next page of access point descriptions if the response payload was paginated.
     */
    NextToken?: Token;
  }
  export interface ListTagsForResourceResponse {
    /**
     * An array of the tags for the specified EFS resource.
     */
    Tags?: Tags;
    /**
     *  NextToken is present if the response payload is paginated. You can use NextToken in a subsequent request to fetch the next page of access point descriptions.
     */
    NextToken?: Token;
  }
  export type Marker = string;
  export type MaxItems = number;
  export type MaxResults = number;
  export interface ModifyMountTargetSecurityGroupsRequest {
    /**
     * The ID of the mount target whose security groups you want to modify.
     */
    MountTargetId: MountTargetId;
    /**
     * An array of up to five VPC security group IDs.
     */
    SecurityGroups?: SecurityGroups;
  }
  export type MountTargetCount = number;
  export interface MountTargetDescription {
    /**
     * Amazon Web Services account ID that owns the resource.
     */
    OwnerId?: AwsAccountId;
    /**
     * System-assigned mount target ID.
     */
    MountTargetId: MountTargetId;
    /**
     * The ID of the file system for which the mount target is intended.
     */
    FileSystemId: FileSystemId;
    /**
     * The ID of the mount target's subnet.
     */
    SubnetId: SubnetId;
    /**
     * Lifecycle state of the mount target.
     */
    LifeCycleState: LifeCycleState;
    /**
     * Address at which the file system can be mounted by using the mount target.
     */
    IpAddress?: IpAddress;
    /**
     * The ID of the network interface that Amazon EFS created when it created the mount target.
     */
    NetworkInterfaceId?: NetworkInterfaceId;
    /**
     * The unique and consistent identifier of the Availability Zone that the mount target resides in. For example, use1-az1 is an AZ ID for the us-east-1 Region and it has the same location in every Amazon Web Services account.
     */
    AvailabilityZoneId?: AvailabilityZoneId;
    /**
     * The name of the Availability Zone in which the mount target is located. Availability Zones are independently mapped to names for each Amazon Web Services account. For example, the Availability Zone us-east-1a for your Amazon Web Services account might not be the same location as us-east-1a for another Amazon Web Services account.
     */
    AvailabilityZoneName?: AvailabilityZoneName;
    /**
     * The virtual private cloud (VPC) ID that the mount target is configured in.
     */
    VpcId?: VpcId;
  }
  export type MountTargetDescriptions = MountTargetDescription[];
  export type MountTargetId = string;
  export type Name = string;
  export type NetworkInterfaceId = string;
  export type OwnerGid = number;
  export type OwnerUid = number;
  export type Path = string;
  export type PerformanceMode = "generalPurpose"|"maxIO"|string;
  export type Permissions = string;
  export type Policy = string;
  export interface PosixUser {
    /**
     * The POSIX user ID used for all file system operations using this access point.
     */
    Uid: Uid;
    /**
     * The POSIX group ID used for all file system operations using this access point.
     */
    Gid: Gid;
    /**
     * Secondary POSIX group IDs used for all file system operations using this access point.
     */
    SecondaryGids?: SecondaryGids;
  }
  export type ProvisionedThroughputInMibps = number;
  export interface PutAccountPreferencesRequest {
    /**
     * Specifies the EFS resource ID preference to set for the user's Amazon Web Services account, in the current Amazon Web Services Region, either LONG_ID (17 characters), or SHORT_ID (8 characters).  Starting in October, 2021, you will receive an error when setting the account preference to SHORT_ID. Contact Amazon Web Services support if you receive an error and must use short IDs for file system and mount target resources. 
     */
    ResourceIdType: ResourceIdType;
  }
  export interface PutAccountPreferencesResponse {
    ResourceIdPreference?: ResourceIdPreference;
  }
  export interface PutBackupPolicyRequest {
    /**
     * Specifies which EFS file system to update the backup policy for.
     */
    FileSystemId: FileSystemId;
    /**
     * The backup policy included in the PutBackupPolicy request.
     */
    BackupPolicy: BackupPolicy;
  }
  export interface PutFileSystemPolicyRequest {
    /**
     * The ID of the EFS file system that you want to create or update the FileSystemPolicy for.
     */
    FileSystemId: FileSystemId;
    /**
     * The FileSystemPolicy that you're creating. Accepts a JSON formatted policy definition. EFS file system policies have a 20,000 character limit. To find out more about the elements that make up a file system policy, see EFS Resource-based Policies. 
     */
    Policy: Policy;
    /**
     * (Optional) A boolean that specifies whether or not to bypass the FileSystemPolicy lockout safety check. The lockout safety check determines whether the policy in the request will lock out, or prevent, the IAM principal that is making the request from making future PutFileSystemPolicy requests on this file system. Set BypassPolicyLockoutSafetyCheck to True only when you intend to prevent the IAM principal that is making the request from making subsequent PutFileSystemPolicy requests on this file system. The default value is False. 
     */
    BypassPolicyLockoutSafetyCheck?: BypassPolicyLockoutSafetyCheck;
  }
  export interface PutLifecycleConfigurationRequest {
    /**
     * The ID of the file system for which you are creating the LifecycleConfiguration object (String).
     */
    FileSystemId: FileSystemId;
    /**
     * An array of LifecyclePolicy objects that define the file system's LifecycleConfiguration object. A LifecycleConfiguration object informs EFS lifecycle management and EFS Intelligent-Tiering of the following:   When to move files in the file system from primary storage to the IA storage class.   When to move files that are in IA storage to primary storage.    When using the put-lifecycle-configuration CLI command or the PutLifecycleConfiguration API action, Amazon EFS requires that each LifecyclePolicy object have only a single transition. This means that in a request body, LifecyclePolicies must be structured as an array of LifecyclePolicy objects, one object for each transition, TransitionToIA, TransitionToPrimaryStorageClass. See the example requests in the following section for more information. 
     */
    LifecyclePolicies: LifecyclePolicies;
  }
  export type RegionName = string;
  export interface ReplicationConfigurationDescription {
    /**
     * The ID of the source Amazon EFS file system that is being replicated.
     */
    SourceFileSystemId: FileSystemId;
    /**
     * The Amazon Web Services Region in which the source Amazon EFS file system is located.
     */
    SourceFileSystemRegion: RegionName;
    /**
     * The Amazon Resource Name (ARN) of the current source file system in the replication configuration.
     */
    SourceFileSystemArn: FileSystemArn;
    /**
     * The Amazon Resource Name (ARN) of the original source Amazon EFS file system in the replication configuration.
     */
    OriginalSourceFileSystemArn: FileSystemArn;
    /**
     * Describes when the replication configuration was created.
     */
    CreationTime: Timestamp;
    /**
     * An array of destination objects. Only one destination object is supported.
     */
    Destinations: Destinations;
  }
  export type ReplicationConfigurationDescriptions = ReplicationConfigurationDescription[];
  export type ReplicationStatus = "ENABLED"|"ENABLING"|"DELETING"|"ERROR"|"PAUSED"|"PAUSING"|string;
  export type Resource = "FILE_SYSTEM"|"MOUNT_TARGET"|string;
  export type ResourceId = string;
  export interface ResourceIdPreference {
    /**
     * Identifies the EFS resource ID preference, either LONG_ID (17 characters) or SHORT_ID (8 characters).
     */
    ResourceIdType?: ResourceIdType;
    /**
     * Identifies the Amazon EFS resources to which the ID preference setting applies, FILE_SYSTEM and MOUNT_TARGET.
     */
    Resources?: Resources;
  }
  export type ResourceIdType = "LONG_ID"|"SHORT_ID"|string;
  export type Resources = Resource[];
  export interface RootDirectory {
    /**
     * Specifies the path on the EFS file system to expose as the root directory to NFS clients using the access point to access the EFS file system. A path can have up to four subdirectories. If the specified path does not exist, you are required to provide the CreationInfo.
     */
    Path?: Path;
    /**
     * (Optional) Specifies the POSIX IDs and permissions to apply to the access point's RootDirectory. If the RootDirectory &gt; Path specified does not exist, EFS creates the root directory using the CreationInfo settings when a client connects to an access point. When specifying the CreationInfo, you must provide values for all properties.   If you do not provide CreationInfo and the specified RootDirectory &gt; Path does not exist, attempts to mount the file system using the access point will fail. 
     */
    CreationInfo?: CreationInfo;
  }
  export type SecondaryGids = Gid[];
  export type SecurityGroup = string;
  export type SecurityGroups = SecurityGroup[];
  export type Status = "ENABLED"|"ENABLING"|"DISABLED"|"DISABLING"|string;
  export type SubnetId = string;
  export interface Tag {
    /**
     * The tag key (String). The key can't start with aws:.
     */
    Key: TagKey;
    /**
     * The value of the tag key.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * The ID specifying the EFS resource that you want to create a tag for.
     */
    ResourceId: ResourceId;
    /**
     * An array of Tag objects to add. Each Tag object is a key-value pair.
     */
    Tags: Tags;
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export type ThroughputMode = "bursting"|"provisioned"|"elastic"|string;
  export type Timestamp = Date;
  export type Token = string;
  export type TransitionToIARules = "AFTER_7_DAYS"|"AFTER_14_DAYS"|"AFTER_30_DAYS"|"AFTER_60_DAYS"|"AFTER_90_DAYS"|"AFTER_1_DAY"|string;
  export type TransitionToPrimaryStorageClassRules = "AFTER_1_ACCESS"|string;
  export type Uid = number;
  export interface UntagResourceRequest {
    /**
     * Specifies the EFS resource that you want to remove tags from.
     */
    ResourceId: ResourceId;
    /**
     * The keys of the key-value tag pairs that you want to remove from the specified EFS resource.
     */
    TagKeys: TagKeys;
  }
  export interface UpdateFileSystemRequest {
    /**
     * The ID of the file system that you want to update.
     */
    FileSystemId: FileSystemId;
    /**
     * (Optional) Updates the file system's throughput mode. If you're not updating your throughput mode, you don't need to provide this value in your request. If you are changing the ThroughputMode to provisioned, you must also set a value for ProvisionedThroughputInMibps.
     */
    ThroughputMode?: ThroughputMode;
    /**
     * (Optional) The throughput, measured in mebibytes per second (MiBps), that you want to provision for a file system that you're creating. Required if ThroughputMode is set to provisioned. Valid values are 1-3414 MiBps, with the upper limit depending on Region. To increase this limit, contact Amazon Web Services Support. For more information, see Amazon EFS quotas that you can increase in the Amazon EFS User Guide.
     */
    ProvisionedThroughputInMibps?: ProvisionedThroughputInMibps;
  }
  export type VpcId = string;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2015-02-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the EFS client.
   */
  export import Types = EFS;
}
export = EFS;
