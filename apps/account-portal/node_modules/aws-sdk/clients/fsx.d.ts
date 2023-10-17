import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class FSx extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: FSx.Types.ClientConfiguration)
  config: Config & FSx.Types.ClientConfiguration;
  /**
   * Use this action to associate one or more Domain Name Server (DNS) aliases with an existing Amazon FSx for Windows File Server file system. A file system can have a maximum of 50 DNS aliases associated with it at any one time. If you try to associate a DNS alias that is already associated with the file system, FSx takes no action on that alias in the request. For more information, see Working with DNS Aliases and Walkthrough 5: Using DNS aliases to access your file system, including additional steps you must take to be able to access your file system using a DNS alias. The system response shows the DNS aliases that Amazon FSx is attempting to associate with the file system. Use the API operation to monitor the status of the aliases Amazon FSx is associating with the file system.
   */
  associateFileSystemAliases(params: FSx.Types.AssociateFileSystemAliasesRequest, callback?: (err: AWSError, data: FSx.Types.AssociateFileSystemAliasesResponse) => void): Request<FSx.Types.AssociateFileSystemAliasesResponse, AWSError>;
  /**
   * Use this action to associate one or more Domain Name Server (DNS) aliases with an existing Amazon FSx for Windows File Server file system. A file system can have a maximum of 50 DNS aliases associated with it at any one time. If you try to associate a DNS alias that is already associated with the file system, FSx takes no action on that alias in the request. For more information, see Working with DNS Aliases and Walkthrough 5: Using DNS aliases to access your file system, including additional steps you must take to be able to access your file system using a DNS alias. The system response shows the DNS aliases that Amazon FSx is attempting to associate with the file system. Use the API operation to monitor the status of the aliases Amazon FSx is associating with the file system.
   */
  associateFileSystemAliases(callback?: (err: AWSError, data: FSx.Types.AssociateFileSystemAliasesResponse) => void): Request<FSx.Types.AssociateFileSystemAliasesResponse, AWSError>;
  /**
   * Cancels an existing Amazon FSx for Lustre data repository task if that task is in either the PENDING or EXECUTING state. When you cancel a task, Amazon FSx does the following.   Any files that FSx has already exported are not reverted.   FSx continues to export any files that are "in-flight" when the cancel operation is received.   FSx does not export any files that have not yet been exported.  
   */
  cancelDataRepositoryTask(params: FSx.Types.CancelDataRepositoryTaskRequest, callback?: (err: AWSError, data: FSx.Types.CancelDataRepositoryTaskResponse) => void): Request<FSx.Types.CancelDataRepositoryTaskResponse, AWSError>;
  /**
   * Cancels an existing Amazon FSx for Lustre data repository task if that task is in either the PENDING or EXECUTING state. When you cancel a task, Amazon FSx does the following.   Any files that FSx has already exported are not reverted.   FSx continues to export any files that are "in-flight" when the cancel operation is received.   FSx does not export any files that have not yet been exported.  
   */
  cancelDataRepositoryTask(callback?: (err: AWSError, data: FSx.Types.CancelDataRepositoryTaskResponse) => void): Request<FSx.Types.CancelDataRepositoryTaskResponse, AWSError>;
  /**
   * Copies an existing backup within the same Amazon Web Services account to another Amazon Web Services Region (cross-Region copy) or within the same Amazon Web Services Region (in-Region copy). You can have up to five backup copy requests in progress to a single destination Region per account. You can use cross-Region backup copies for cross-region disaster recovery. You periodically take backups and copy them to another Region so that in the event of a disaster in the primary Region, you can restore from backup and recover availability quickly in the other Region. You can make cross-Region copies only within your Amazon Web Services partition.  You can also use backup copies to clone your file data set to another Region or within the same Region. You can use the SourceRegion parameter to specify the Amazon Web Services Region from which the backup will be copied. For example, if you make the call from the us-west-1 Region and want to copy a backup from the us-east-2 Region, you specify us-east-2 in the SourceRegion parameter to make a cross-Region copy. If you don't specify a Region, the backup copy is created in the same Region where the request is sent from (in-Region copy). For more information on creating backup copies, see  Copying backups in the Amazon FSx for Windows User Guide and Copying backups in the Amazon FSx for Lustre User Guide.
   */
  copyBackup(params: FSx.Types.CopyBackupRequest, callback?: (err: AWSError, data: FSx.Types.CopyBackupResponse) => void): Request<FSx.Types.CopyBackupResponse, AWSError>;
  /**
   * Copies an existing backup within the same Amazon Web Services account to another Amazon Web Services Region (cross-Region copy) or within the same Amazon Web Services Region (in-Region copy). You can have up to five backup copy requests in progress to a single destination Region per account. You can use cross-Region backup copies for cross-region disaster recovery. You periodically take backups and copy them to another Region so that in the event of a disaster in the primary Region, you can restore from backup and recover availability quickly in the other Region. You can make cross-Region copies only within your Amazon Web Services partition.  You can also use backup copies to clone your file data set to another Region or within the same Region. You can use the SourceRegion parameter to specify the Amazon Web Services Region from which the backup will be copied. For example, if you make the call from the us-west-1 Region and want to copy a backup from the us-east-2 Region, you specify us-east-2 in the SourceRegion parameter to make a cross-Region copy. If you don't specify a Region, the backup copy is created in the same Region where the request is sent from (in-Region copy). For more information on creating backup copies, see  Copying backups in the Amazon FSx for Windows User Guide and Copying backups in the Amazon FSx for Lustre User Guide.
   */
  copyBackup(callback?: (err: AWSError, data: FSx.Types.CopyBackupResponse) => void): Request<FSx.Types.CopyBackupResponse, AWSError>;
  /**
   * Creates a backup of an existing Amazon FSx for Windows File Server or Amazon FSx for Lustre file system, or of an Amazon FSx for NetApp ONTAP volume. Creating regular backups is a best practice, enabling you to restore a file system or volume from a backup if an issue arises with the original file system or volume. For Amazon FSx for Lustre file systems, you can create a backup only for file systems with the following configuration:   a Persistent deployment type   is not linked to a data repository.   For more information about backups, see the following:   For Amazon FSx for Lustre, see Working with FSx for Lustre backups.   For Amazon FSx for Windows, see Working with FSx for Windows backups.   For Amazon FSx for NetApp ONTAP, see Working with FSx for NetApp ONTAP backups.   If a backup with the specified client request token exists, and the parameters match, this operation returns the description of the existing backup. If a backup specified client request token exists, and the parameters don't match, this operation returns IncompatibleParameterError. If a backup with the specified client request token doesn't exist, CreateBackup does the following:    Creates a new Amazon FSx backup with an assigned ID, and an initial lifecycle state of CREATING.   Returns the description of the backup.   By using the idempotent operation, you can retry a CreateBackup operation without the risk of creating an extra backup. This approach can be useful when an initial call fails in a way that makes it unclear whether a backup was created. If you use the same client request token and the initial call created a backup, the operation returns a successful result because all the parameters are the same. The CreateBackup operation returns while the backup's lifecycle state is still CREATING. You can check the backup creation status by calling the DescribeBackups operation, which returns the backup state along with other information.
   */
  createBackup(params: FSx.Types.CreateBackupRequest, callback?: (err: AWSError, data: FSx.Types.CreateBackupResponse) => void): Request<FSx.Types.CreateBackupResponse, AWSError>;
  /**
   * Creates a backup of an existing Amazon FSx for Windows File Server or Amazon FSx for Lustre file system, or of an Amazon FSx for NetApp ONTAP volume. Creating regular backups is a best practice, enabling you to restore a file system or volume from a backup if an issue arises with the original file system or volume. For Amazon FSx for Lustre file systems, you can create a backup only for file systems with the following configuration:   a Persistent deployment type   is not linked to a data repository.   For more information about backups, see the following:   For Amazon FSx for Lustre, see Working with FSx for Lustre backups.   For Amazon FSx for Windows, see Working with FSx for Windows backups.   For Amazon FSx for NetApp ONTAP, see Working with FSx for NetApp ONTAP backups.   If a backup with the specified client request token exists, and the parameters match, this operation returns the description of the existing backup. If a backup specified client request token exists, and the parameters don't match, this operation returns IncompatibleParameterError. If a backup with the specified client request token doesn't exist, CreateBackup does the following:    Creates a new Amazon FSx backup with an assigned ID, and an initial lifecycle state of CREATING.   Returns the description of the backup.   By using the idempotent operation, you can retry a CreateBackup operation without the risk of creating an extra backup. This approach can be useful when an initial call fails in a way that makes it unclear whether a backup was created. If you use the same client request token and the initial call created a backup, the operation returns a successful result because all the parameters are the same. The CreateBackup operation returns while the backup's lifecycle state is still CREATING. You can check the backup creation status by calling the DescribeBackups operation, which returns the backup state along with other information.
   */
  createBackup(callback?: (err: AWSError, data: FSx.Types.CreateBackupResponse) => void): Request<FSx.Types.CreateBackupResponse, AWSError>;
  /**
   * Creates an Amazon FSx for Lustre data repository task. You use data repository tasks to perform bulk operations between your Amazon FSx file system and its linked data repository. An example of a data repository task is exporting any data and metadata changes, including POSIX metadata, to files, directories, and symbolic links (symlinks) from your FSx file system to its linked data repository. A CreateDataRepositoryTask operation will fail if a data repository is not linked to the FSx file system. To learn more about data repository tasks, see Data Repository Tasks. To learn more about linking a data repository to your file system, see Linking your file system to an S3 bucket.
   */
  createDataRepositoryTask(params: FSx.Types.CreateDataRepositoryTaskRequest, callback?: (err: AWSError, data: FSx.Types.CreateDataRepositoryTaskResponse) => void): Request<FSx.Types.CreateDataRepositoryTaskResponse, AWSError>;
  /**
   * Creates an Amazon FSx for Lustre data repository task. You use data repository tasks to perform bulk operations between your Amazon FSx file system and its linked data repository. An example of a data repository task is exporting any data and metadata changes, including POSIX metadata, to files, directories, and symbolic links (symlinks) from your FSx file system to its linked data repository. A CreateDataRepositoryTask operation will fail if a data repository is not linked to the FSx file system. To learn more about data repository tasks, see Data Repository Tasks. To learn more about linking a data repository to your file system, see Linking your file system to an S3 bucket.
   */
  createDataRepositoryTask(callback?: (err: AWSError, data: FSx.Types.CreateDataRepositoryTaskResponse) => void): Request<FSx.Types.CreateDataRepositoryTaskResponse, AWSError>;
  /**
   * Creates a new, empty Amazon FSx file system. If a file system with the specified client request token exists and the parameters match, CreateFileSystem returns the description of the existing file system. If a file system specified client request token exists and the parameters don't match, this call returns IncompatibleParameterError. If a file system with the specified client request token doesn't exist, CreateFileSystem does the following:    Creates a new, empty Amazon FSx file system with an assigned ID, and an initial lifecycle state of CREATING.   Returns the description of the file system.   This operation requires a client request token in the request that Amazon FSx uses to ensure idempotent creation. This means that calling the operation multiple times with the same client request token has no effect. By using the idempotent operation, you can retry a CreateFileSystem operation without the risk of creating an extra file system. This approach can be useful when an initial call fails in a way that makes it unclear whether a file system was created. Examples are if a transport level timeout occurred, or your connection was reset. If you use the same client request token and the initial call created a file system, the client receives success as long as the parameters are the same.  The CreateFileSystem call returns while the file system's lifecycle state is still CREATING. You can check the file-system creation status by calling the DescribeFileSystems operation, which returns the file system state along with other information. 
   */
  createFileSystem(params: FSx.Types.CreateFileSystemRequest, callback?: (err: AWSError, data: FSx.Types.CreateFileSystemResponse) => void): Request<FSx.Types.CreateFileSystemResponse, AWSError>;
  /**
   * Creates a new, empty Amazon FSx file system. If a file system with the specified client request token exists and the parameters match, CreateFileSystem returns the description of the existing file system. If a file system specified client request token exists and the parameters don't match, this call returns IncompatibleParameterError. If a file system with the specified client request token doesn't exist, CreateFileSystem does the following:    Creates a new, empty Amazon FSx file system with an assigned ID, and an initial lifecycle state of CREATING.   Returns the description of the file system.   This operation requires a client request token in the request that Amazon FSx uses to ensure idempotent creation. This means that calling the operation multiple times with the same client request token has no effect. By using the idempotent operation, you can retry a CreateFileSystem operation without the risk of creating an extra file system. This approach can be useful when an initial call fails in a way that makes it unclear whether a file system was created. Examples are if a transport level timeout occurred, or your connection was reset. If you use the same client request token and the initial call created a file system, the client receives success as long as the parameters are the same.  The CreateFileSystem call returns while the file system's lifecycle state is still CREATING. You can check the file-system creation status by calling the DescribeFileSystems operation, which returns the file system state along with other information. 
   */
  createFileSystem(callback?: (err: AWSError, data: FSx.Types.CreateFileSystemResponse) => void): Request<FSx.Types.CreateFileSystemResponse, AWSError>;
  /**
   * Creates a new Amazon FSx for Lustre or Amazon FSx for Windows File Server file system from an existing Amazon FSx backup. If a file system with the specified client request token exists and the parameters match, this operation returns the description of the file system. If a client request token specified by the file system exists and the parameters don't match, this call returns IncompatibleParameterError. If a file system with the specified client request token doesn't exist, this operation does the following:   Creates a new Amazon FSx file system from backup with an assigned ID, and an initial lifecycle state of CREATING.   Returns the description of the file system.   Parameters like Active Directory, default share name, automatic backup, and backup settings default to the parameters of the file system that was backed up, unless overridden. You can explicitly supply other settings. By using the idempotent operation, you can retry a CreateFileSystemFromBackup call without the risk of creating an extra file system. This approach can be useful when an initial call fails in a way that makes it unclear whether a file system was created. Examples are if a transport level timeout occurred, or your connection was reset. If you use the same client request token and the initial call created a file system, the client receives success as long as the parameters are the same.  The CreateFileSystemFromBackup call returns while the file system's lifecycle state is still CREATING. You can check the file-system creation status by calling the DescribeFileSystems operation, which returns the file system state along with other information. 
   */
  createFileSystemFromBackup(params: FSx.Types.CreateFileSystemFromBackupRequest, callback?: (err: AWSError, data: FSx.Types.CreateFileSystemFromBackupResponse) => void): Request<FSx.Types.CreateFileSystemFromBackupResponse, AWSError>;
  /**
   * Creates a new Amazon FSx for Lustre or Amazon FSx for Windows File Server file system from an existing Amazon FSx backup. If a file system with the specified client request token exists and the parameters match, this operation returns the description of the file system. If a client request token specified by the file system exists and the parameters don't match, this call returns IncompatibleParameterError. If a file system with the specified client request token doesn't exist, this operation does the following:   Creates a new Amazon FSx file system from backup with an assigned ID, and an initial lifecycle state of CREATING.   Returns the description of the file system.   Parameters like Active Directory, default share name, automatic backup, and backup settings default to the parameters of the file system that was backed up, unless overridden. You can explicitly supply other settings. By using the idempotent operation, you can retry a CreateFileSystemFromBackup call without the risk of creating an extra file system. This approach can be useful when an initial call fails in a way that makes it unclear whether a file system was created. Examples are if a transport level timeout occurred, or your connection was reset. If you use the same client request token and the initial call created a file system, the client receives success as long as the parameters are the same.  The CreateFileSystemFromBackup call returns while the file system's lifecycle state is still CREATING. You can check the file-system creation status by calling the DescribeFileSystems operation, which returns the file system state along with other information. 
   */
  createFileSystemFromBackup(callback?: (err: AWSError, data: FSx.Types.CreateFileSystemFromBackupResponse) => void): Request<FSx.Types.CreateFileSystemFromBackupResponse, AWSError>;
  /**
   * Creates a storage virtual machine (SVM) for an Amazon FSx for ONTAP file system.
   */
  createStorageVirtualMachine(params: FSx.Types.CreateStorageVirtualMachineRequest, callback?: (err: AWSError, data: FSx.Types.CreateStorageVirtualMachineResponse) => void): Request<FSx.Types.CreateStorageVirtualMachineResponse, AWSError>;
  /**
   * Creates a storage virtual machine (SVM) for an Amazon FSx for ONTAP file system.
   */
  createStorageVirtualMachine(callback?: (err: AWSError, data: FSx.Types.CreateStorageVirtualMachineResponse) => void): Request<FSx.Types.CreateStorageVirtualMachineResponse, AWSError>;
  /**
   * Creates an Amazon FSx for NetApp ONTAP storage volume.
   */
  createVolume(params: FSx.Types.CreateVolumeRequest, callback?: (err: AWSError, data: FSx.Types.CreateVolumeResponse) => void): Request<FSx.Types.CreateVolumeResponse, AWSError>;
  /**
   * Creates an Amazon FSx for NetApp ONTAP storage volume.
   */
  createVolume(callback?: (err: AWSError, data: FSx.Types.CreateVolumeResponse) => void): Request<FSx.Types.CreateVolumeResponse, AWSError>;
  /**
   * Creates a new Amazon FSx for NetApp ONTAP volume from an existing Amazon FSx volume backup.
   */
  createVolumeFromBackup(params: FSx.Types.CreateVolumeFromBackupRequest, callback?: (err: AWSError, data: FSx.Types.CreateVolumeFromBackupResponse) => void): Request<FSx.Types.CreateVolumeFromBackupResponse, AWSError>;
  /**
   * Creates a new Amazon FSx for NetApp ONTAP volume from an existing Amazon FSx volume backup.
   */
  createVolumeFromBackup(callback?: (err: AWSError, data: FSx.Types.CreateVolumeFromBackupResponse) => void): Request<FSx.Types.CreateVolumeFromBackupResponse, AWSError>;
  /**
   * Deletes an Amazon FSx backup, deleting its contents. After deletion, the backup no longer exists, and its data is gone. The DeleteBackup call returns instantly. The backup will not show up in later DescribeBackups calls.  The data in a deleted backup is also deleted and can't be recovered by any means. 
   */
  deleteBackup(params: FSx.Types.DeleteBackupRequest, callback?: (err: AWSError, data: FSx.Types.DeleteBackupResponse) => void): Request<FSx.Types.DeleteBackupResponse, AWSError>;
  /**
   * Deletes an Amazon FSx backup, deleting its contents. After deletion, the backup no longer exists, and its data is gone. The DeleteBackup call returns instantly. The backup will not show up in later DescribeBackups calls.  The data in a deleted backup is also deleted and can't be recovered by any means. 
   */
  deleteBackup(callback?: (err: AWSError, data: FSx.Types.DeleteBackupResponse) => void): Request<FSx.Types.DeleteBackupResponse, AWSError>;
  /**
   * Deletes a file system, deleting its contents. After deletion, the file system no longer exists, and its data is gone. Any existing automatic backups will also be deleted. To delete an Amazon FSx for NetApp ONTAP file system, first delete all the volumes and SVMs on the file system. Then provide a FileSystemId value to the DeleFileSystem operation. By default, when you delete an Amazon FSx for Windows File Server file system, a final backup is created upon deletion. This final backup is not subject to the file system's retention policy, and must be manually deleted. The DeleteFileSystem action returns while the file system has the DELETING status. You can check the file system deletion status by calling the DescribeFileSystems action, which returns a list of file systems in your account. If you pass the file system ID for a deleted file system, the DescribeFileSystems returns a FileSystemNotFound error.  Deleting an Amazon FSx for Lustre file system will fail with a 400 BadRequest if a data repository task is in a PENDING or EXECUTING state.   The data in a deleted file system is also deleted and can't be recovered by any means. 
   */
  deleteFileSystem(params: FSx.Types.DeleteFileSystemRequest, callback?: (err: AWSError, data: FSx.Types.DeleteFileSystemResponse) => void): Request<FSx.Types.DeleteFileSystemResponse, AWSError>;
  /**
   * Deletes a file system, deleting its contents. After deletion, the file system no longer exists, and its data is gone. Any existing automatic backups will also be deleted. To delete an Amazon FSx for NetApp ONTAP file system, first delete all the volumes and SVMs on the file system. Then provide a FileSystemId value to the DeleFileSystem operation. By default, when you delete an Amazon FSx for Windows File Server file system, a final backup is created upon deletion. This final backup is not subject to the file system's retention policy, and must be manually deleted. The DeleteFileSystem action returns while the file system has the DELETING status. You can check the file system deletion status by calling the DescribeFileSystems action, which returns a list of file systems in your account. If you pass the file system ID for a deleted file system, the DescribeFileSystems returns a FileSystemNotFound error.  Deleting an Amazon FSx for Lustre file system will fail with a 400 BadRequest if a data repository task is in a PENDING or EXECUTING state.   The data in a deleted file system is also deleted and can't be recovered by any means. 
   */
  deleteFileSystem(callback?: (err: AWSError, data: FSx.Types.DeleteFileSystemResponse) => void): Request<FSx.Types.DeleteFileSystemResponse, AWSError>;
  /**
   * Deletes an existing Amazon FSx for ONTAP storage virtual machine (SVM). Prior to deleting an SVM, you must delete all non-root volumes in the SVM, otherwise the operation will fail.
   */
  deleteStorageVirtualMachine(params: FSx.Types.DeleteStorageVirtualMachineRequest, callback?: (err: AWSError, data: FSx.Types.DeleteStorageVirtualMachineResponse) => void): Request<FSx.Types.DeleteStorageVirtualMachineResponse, AWSError>;
  /**
   * Deletes an existing Amazon FSx for ONTAP storage virtual machine (SVM). Prior to deleting an SVM, you must delete all non-root volumes in the SVM, otherwise the operation will fail.
   */
  deleteStorageVirtualMachine(callback?: (err: AWSError, data: FSx.Types.DeleteStorageVirtualMachineResponse) => void): Request<FSx.Types.DeleteStorageVirtualMachineResponse, AWSError>;
  /**
   * Deletes an Amazon FSx for NetApp ONTAP volume. When deleting a volume, you have the option of creating a final backup. If you create a final backup, you have the option to apply Tags to the backup. You need to have fsx:TagResource permission in order to apply tags to the backup.
   */
  deleteVolume(params: FSx.Types.DeleteVolumeRequest, callback?: (err: AWSError, data: FSx.Types.DeleteVolumeResponse) => void): Request<FSx.Types.DeleteVolumeResponse, AWSError>;
  /**
   * Deletes an Amazon FSx for NetApp ONTAP volume. When deleting a volume, you have the option of creating a final backup. If you create a final backup, you have the option to apply Tags to the backup. You need to have fsx:TagResource permission in order to apply tags to the backup.
   */
  deleteVolume(callback?: (err: AWSError, data: FSx.Types.DeleteVolumeResponse) => void): Request<FSx.Types.DeleteVolumeResponse, AWSError>;
  /**
   * Returns the description of specific Amazon FSx backups, if a BackupIds value is provided for that backup. Otherwise, it returns all backups owned by your Amazon Web Services account in the Amazon Web Services Region of the endpoint that you're calling. When retrieving all backups, you can optionally specify the MaxResults parameter to limit the number of backups in a response. If more backups remain, Amazon FSx returns a NextToken value in the response. In this case, send a later request with the NextToken request parameter set to the value of NextToken from the last response. This action is used in an iterative process to retrieve a list of your backups. DescribeBackups is called first without a NextTokenvalue. Then the action continues to be called with the NextToken parameter set to the value of the last NextToken value until a response has no NextToken. When using this action, keep the following in mind:   The implementation might return fewer than MaxResults backup descriptions while still including a NextToken value.   The order of backups returned in the response of one DescribeBackups call and the order of backups returned across the responses of a multi-call iteration is unspecified.  
   */
  describeBackups(params: FSx.Types.DescribeBackupsRequest, callback?: (err: AWSError, data: FSx.Types.DescribeBackupsResponse) => void): Request<FSx.Types.DescribeBackupsResponse, AWSError>;
  /**
   * Returns the description of specific Amazon FSx backups, if a BackupIds value is provided for that backup. Otherwise, it returns all backups owned by your Amazon Web Services account in the Amazon Web Services Region of the endpoint that you're calling. When retrieving all backups, you can optionally specify the MaxResults parameter to limit the number of backups in a response. If more backups remain, Amazon FSx returns a NextToken value in the response. In this case, send a later request with the NextToken request parameter set to the value of NextToken from the last response. This action is used in an iterative process to retrieve a list of your backups. DescribeBackups is called first without a NextTokenvalue. Then the action continues to be called with the NextToken parameter set to the value of the last NextToken value until a response has no NextToken. When using this action, keep the following in mind:   The implementation might return fewer than MaxResults backup descriptions while still including a NextToken value.   The order of backups returned in the response of one DescribeBackups call and the order of backups returned across the responses of a multi-call iteration is unspecified.  
   */
  describeBackups(callback?: (err: AWSError, data: FSx.Types.DescribeBackupsResponse) => void): Request<FSx.Types.DescribeBackupsResponse, AWSError>;
  /**
   * Returns the description of specific Amazon FSx for Lustre data repository tasks, if one or more TaskIds values are provided in the request, or if filters are used in the request. You can use filters to narrow the response to include just tasks for specific file systems, or tasks in a specific lifecycle state. Otherwise, it returns all data repository tasks owned by your Amazon Web Services account in the Amazon Web Services Region of the endpoint that you're calling. When retrieving all tasks, you can paginate the response by using the optional MaxResults parameter to limit the number of tasks returned in a response. If more tasks remain, Amazon FSx returns a NextToken value in the response. In this case, send a later request with the NextToken request parameter set to the value of NextToken from the last response.
   */
  describeDataRepositoryTasks(params: FSx.Types.DescribeDataRepositoryTasksRequest, callback?: (err: AWSError, data: FSx.Types.DescribeDataRepositoryTasksResponse) => void): Request<FSx.Types.DescribeDataRepositoryTasksResponse, AWSError>;
  /**
   * Returns the description of specific Amazon FSx for Lustre data repository tasks, if one or more TaskIds values are provided in the request, or if filters are used in the request. You can use filters to narrow the response to include just tasks for specific file systems, or tasks in a specific lifecycle state. Otherwise, it returns all data repository tasks owned by your Amazon Web Services account in the Amazon Web Services Region of the endpoint that you're calling. When retrieving all tasks, you can paginate the response by using the optional MaxResults parameter to limit the number of tasks returned in a response. If more tasks remain, Amazon FSx returns a NextToken value in the response. In this case, send a later request with the NextToken request parameter set to the value of NextToken from the last response.
   */
  describeDataRepositoryTasks(callback?: (err: AWSError, data: FSx.Types.DescribeDataRepositoryTasksResponse) => void): Request<FSx.Types.DescribeDataRepositoryTasksResponse, AWSError>;
  /**
   * Returns the DNS aliases that are associated with the specified Amazon FSx for Windows File Server file system. A history of all DNS aliases that have been associated with and disassociated from the file system is available in the list of AdministrativeAction provided in the DescribeFileSystems operation response.
   */
  describeFileSystemAliases(params: FSx.Types.DescribeFileSystemAliasesRequest, callback?: (err: AWSError, data: FSx.Types.DescribeFileSystemAliasesResponse) => void): Request<FSx.Types.DescribeFileSystemAliasesResponse, AWSError>;
  /**
   * Returns the DNS aliases that are associated with the specified Amazon FSx for Windows File Server file system. A history of all DNS aliases that have been associated with and disassociated from the file system is available in the list of AdministrativeAction provided in the DescribeFileSystems operation response.
   */
  describeFileSystemAliases(callback?: (err: AWSError, data: FSx.Types.DescribeFileSystemAliasesResponse) => void): Request<FSx.Types.DescribeFileSystemAliasesResponse, AWSError>;
  /**
   * Returns the description of specific Amazon FSx file systems, if a FileSystemIds value is provided for that file system. Otherwise, it returns descriptions of all file systems owned by your Amazon Web Services account in the Amazon Web Services Region of the endpoint that you're calling. When retrieving all file system descriptions, you can optionally specify the MaxResults parameter to limit the number of descriptions in a response. If more file system descriptions remain, Amazon FSx returns a NextToken value in the response. In this case, send a later request with the NextToken request parameter set to the value of NextToken from the last response. This action is used in an iterative process to retrieve a list of your file system descriptions. DescribeFileSystems is called first without a NextTokenvalue. Then the action continues to be called with the NextToken parameter set to the value of the last NextToken value until a response has no NextToken. When using this action, keep the following in mind:   The implementation might return fewer than MaxResults file system descriptions while still including a NextToken value.   The order of file systems returned in the response of one DescribeFileSystems call and the order of file systems returned across the responses of a multicall iteration is unspecified.  
   */
  describeFileSystems(params: FSx.Types.DescribeFileSystemsRequest, callback?: (err: AWSError, data: FSx.Types.DescribeFileSystemsResponse) => void): Request<FSx.Types.DescribeFileSystemsResponse, AWSError>;
  /**
   * Returns the description of specific Amazon FSx file systems, if a FileSystemIds value is provided for that file system. Otherwise, it returns descriptions of all file systems owned by your Amazon Web Services account in the Amazon Web Services Region of the endpoint that you're calling. When retrieving all file system descriptions, you can optionally specify the MaxResults parameter to limit the number of descriptions in a response. If more file system descriptions remain, Amazon FSx returns a NextToken value in the response. In this case, send a later request with the NextToken request parameter set to the value of NextToken from the last response. This action is used in an iterative process to retrieve a list of your file system descriptions. DescribeFileSystems is called first without a NextTokenvalue. Then the action continues to be called with the NextToken parameter set to the value of the last NextToken value until a response has no NextToken. When using this action, keep the following in mind:   The implementation might return fewer than MaxResults file system descriptions while still including a NextToken value.   The order of file systems returned in the response of one DescribeFileSystems call and the order of file systems returned across the responses of a multicall iteration is unspecified.  
   */
  describeFileSystems(callback?: (err: AWSError, data: FSx.Types.DescribeFileSystemsResponse) => void): Request<FSx.Types.DescribeFileSystemsResponse, AWSError>;
  /**
   * Describes one or more Amazon FSx for NetApp ONTAP storage virtual machines (SVMs).
   */
  describeStorageVirtualMachines(params: FSx.Types.DescribeStorageVirtualMachinesRequest, callback?: (err: AWSError, data: FSx.Types.DescribeStorageVirtualMachinesResponse) => void): Request<FSx.Types.DescribeStorageVirtualMachinesResponse, AWSError>;
  /**
   * Describes one or more Amazon FSx for NetApp ONTAP storage virtual machines (SVMs).
   */
  describeStorageVirtualMachines(callback?: (err: AWSError, data: FSx.Types.DescribeStorageVirtualMachinesResponse) => void): Request<FSx.Types.DescribeStorageVirtualMachinesResponse, AWSError>;
  /**
   * Describes one or more Amazon FSx for NetApp ONTAP volumes.
   */
  describeVolumes(params: FSx.Types.DescribeVolumesRequest, callback?: (err: AWSError, data: FSx.Types.DescribeVolumesResponse) => void): Request<FSx.Types.DescribeVolumesResponse, AWSError>;
  /**
   * Describes one or more Amazon FSx for NetApp ONTAP volumes.
   */
  describeVolumes(callback?: (err: AWSError, data: FSx.Types.DescribeVolumesResponse) => void): Request<FSx.Types.DescribeVolumesResponse, AWSError>;
  /**
   * Use this action to disassociate, or remove, one or more Domain Name Service (DNS) aliases from an Amazon FSx for Windows File Server file system. If you attempt to disassociate a DNS alias that is not associated with the file system, Amazon FSx responds with a 400 Bad Request. For more information, see Working with DNS Aliases. The system generated response showing the DNS aliases that Amazon FSx is attempting to disassociate from the file system. Use the API operation to monitor the status of the aliases Amazon FSx is disassociating with the file system.
   */
  disassociateFileSystemAliases(params: FSx.Types.DisassociateFileSystemAliasesRequest, callback?: (err: AWSError, data: FSx.Types.DisassociateFileSystemAliasesResponse) => void): Request<FSx.Types.DisassociateFileSystemAliasesResponse, AWSError>;
  /**
   * Use this action to disassociate, or remove, one or more Domain Name Service (DNS) aliases from an Amazon FSx for Windows File Server file system. If you attempt to disassociate a DNS alias that is not associated with the file system, Amazon FSx responds with a 400 Bad Request. For more information, see Working with DNS Aliases. The system generated response showing the DNS aliases that Amazon FSx is attempting to disassociate from the file system. Use the API operation to monitor the status of the aliases Amazon FSx is disassociating with the file system.
   */
  disassociateFileSystemAliases(callback?: (err: AWSError, data: FSx.Types.DisassociateFileSystemAliasesResponse) => void): Request<FSx.Types.DisassociateFileSystemAliasesResponse, AWSError>;
  /**
   * Lists tags for an Amazon FSx file systems and backups in the case of Amazon FSx for Windows File Server. When retrieving all tags, you can optionally specify the MaxResults parameter to limit the number of tags in a response. If more tags remain, Amazon FSx returns a NextToken value in the response. In this case, send a later request with the NextToken request parameter set to the value of NextToken from the last response. This action is used in an iterative process to retrieve a list of your tags. ListTagsForResource is called first without a NextTokenvalue. Then the action continues to be called with the NextToken parameter set to the value of the last NextToken value until a response has no NextToken. When using this action, keep the following in mind:   The implementation might return fewer than MaxResults file system descriptions while still including a NextToken value.   The order of tags returned in the response of one ListTagsForResource call and the order of tags returned across the responses of a multi-call iteration is unspecified.  
   */
  listTagsForResource(params: FSx.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: FSx.Types.ListTagsForResourceResponse) => void): Request<FSx.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Lists tags for an Amazon FSx file systems and backups in the case of Amazon FSx for Windows File Server. When retrieving all tags, you can optionally specify the MaxResults parameter to limit the number of tags in a response. If more tags remain, Amazon FSx returns a NextToken value in the response. In this case, send a later request with the NextToken request parameter set to the value of NextToken from the last response. This action is used in an iterative process to retrieve a list of your tags. ListTagsForResource is called first without a NextTokenvalue. Then the action continues to be called with the NextToken parameter set to the value of the last NextToken value until a response has no NextToken. When using this action, keep the following in mind:   The implementation might return fewer than MaxResults file system descriptions while still including a NextToken value.   The order of tags returned in the response of one ListTagsForResource call and the order of tags returned across the responses of a multi-call iteration is unspecified.  
   */
  listTagsForResource(callback?: (err: AWSError, data: FSx.Types.ListTagsForResourceResponse) => void): Request<FSx.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Tags an Amazon FSx resource.
   */
  tagResource(params: FSx.Types.TagResourceRequest, callback?: (err: AWSError, data: FSx.Types.TagResourceResponse) => void): Request<FSx.Types.TagResourceResponse, AWSError>;
  /**
   * Tags an Amazon FSx resource.
   */
  tagResource(callback?: (err: AWSError, data: FSx.Types.TagResourceResponse) => void): Request<FSx.Types.TagResourceResponse, AWSError>;
  /**
   * This action removes a tag from an Amazon FSx resource.
   */
  untagResource(params: FSx.Types.UntagResourceRequest, callback?: (err: AWSError, data: FSx.Types.UntagResourceResponse) => void): Request<FSx.Types.UntagResourceResponse, AWSError>;
  /**
   * This action removes a tag from an Amazon FSx resource.
   */
  untagResource(callback?: (err: AWSError, data: FSx.Types.UntagResourceResponse) => void): Request<FSx.Types.UntagResourceResponse, AWSError>;
  /**
   * Use this operation to update the configuration of an existing Amazon FSx file system. You can update multiple properties in a single request. For Amazon FSx for Windows File Server file systems, you can update the following properties:   AuditLogConfiguration   AutomaticBackupRetentionDays   DailyAutomaticBackupStartTime   SelfManagedActiveDirectoryConfiguration   StorageCapacity   ThroughputCapacity   WeeklyMaintenanceStartTime   For Amazon FSx for Lustre file systems, you can update the following properties:   AutoImportPolicy   AutomaticBackupRetentionDays   DailyAutomaticBackupStartTime   DataCompressionType   StorageCapacity   WeeklyMaintenanceStartTime   For Amazon FSx for NetApp ONTAP file systems, you can update the following properties:   AutomaticBackupRetentionDays   DailyAutomaticBackupStartTime   FsxAdminPassword   WeeklyMaintenanceStartTime  
   */
  updateFileSystem(params: FSx.Types.UpdateFileSystemRequest, callback?: (err: AWSError, data: FSx.Types.UpdateFileSystemResponse) => void): Request<FSx.Types.UpdateFileSystemResponse, AWSError>;
  /**
   * Use this operation to update the configuration of an existing Amazon FSx file system. You can update multiple properties in a single request. For Amazon FSx for Windows File Server file systems, you can update the following properties:   AuditLogConfiguration   AutomaticBackupRetentionDays   DailyAutomaticBackupStartTime   SelfManagedActiveDirectoryConfiguration   StorageCapacity   ThroughputCapacity   WeeklyMaintenanceStartTime   For Amazon FSx for Lustre file systems, you can update the following properties:   AutoImportPolicy   AutomaticBackupRetentionDays   DailyAutomaticBackupStartTime   DataCompressionType   StorageCapacity   WeeklyMaintenanceStartTime   For Amazon FSx for NetApp ONTAP file systems, you can update the following properties:   AutomaticBackupRetentionDays   DailyAutomaticBackupStartTime   FsxAdminPassword   WeeklyMaintenanceStartTime  
   */
  updateFileSystem(callback?: (err: AWSError, data: FSx.Types.UpdateFileSystemResponse) => void): Request<FSx.Types.UpdateFileSystemResponse, AWSError>;
  /**
   * Updates an Amazon FSx for ONTAP storage virtual machine (SVM).
   */
  updateStorageVirtualMachine(params: FSx.Types.UpdateStorageVirtualMachineRequest, callback?: (err: AWSError, data: FSx.Types.UpdateStorageVirtualMachineResponse) => void): Request<FSx.Types.UpdateStorageVirtualMachineResponse, AWSError>;
  /**
   * Updates an Amazon FSx for ONTAP storage virtual machine (SVM).
   */
  updateStorageVirtualMachine(callback?: (err: AWSError, data: FSx.Types.UpdateStorageVirtualMachineResponse) => void): Request<FSx.Types.UpdateStorageVirtualMachineResponse, AWSError>;
  /**
   * Updates an Amazon FSx for NetApp ONTAP volume's configuration.
   */
  updateVolume(params: FSx.Types.UpdateVolumeRequest, callback?: (err: AWSError, data: FSx.Types.UpdateVolumeResponse) => void): Request<FSx.Types.UpdateVolumeResponse, AWSError>;
  /**
   * Updates an Amazon FSx for NetApp ONTAP volume's configuration.
   */
  updateVolume(callback?: (err: AWSError, data: FSx.Types.UpdateVolumeResponse) => void): Request<FSx.Types.UpdateVolumeResponse, AWSError>;
}
declare namespace FSx {
  export type AWSAccountId = string;
  export interface ActiveDirectoryBackupAttributes {
    /**
     * The fully qualified domain name of the self-managed AD directory.
     */
    DomainName?: ActiveDirectoryFullyQualifiedName;
    /**
     * The ID of the Amazon Web Services Managed Microsoft Active Directory instance to which the file system is joined.
     */
    ActiveDirectoryId?: DirectoryId;
    ResourceARN?: ResourceARN;
  }
  export type ActiveDirectoryFullyQualifiedName = string;
  export type AdminPassword = string;
  export interface AdministrativeAction {
    AdministrativeActionType?: AdministrativeActionType;
    /**
     * Provides the percent complete of a STORAGE_OPTIMIZATION administrative action. Does not apply to any other administrative action type.
     */
    ProgressPercent?: ProgressPercent;
    /**
     * Time that the administrative action request was received.
     */
    RequestTime?: RequestTime;
    /**
     * Describes the status of the administrative action, as follows:    FAILED - Amazon FSx failed to process the administrative action successfully.    IN_PROGRESS - Amazon FSx is processing the administrative action.    PENDING - Amazon FSx is waiting to process the administrative action.    COMPLETED - Amazon FSx has finished processing the administrative task.    UPDATED_OPTIMIZING - For a storage capacity increase update, Amazon FSx has updated the file system with the new storage capacity, and is now performing the storage optimization process. For more information, see Managing storage capacity in the Amazon FSx for Windows File Server User Guide and Managing storage and throughput capacity in the Amazon FSx for Lustre User Guide.  
     */
    Status?: Status;
    /**
     * Describes the target value for the administration action, provided in the UpdateFileSystem operation. Returned for FILE_SYSTEM_UPDATE administrative actions. 
     */
    TargetFileSystemValues?: FileSystem;
    FailureDetails?: AdministrativeActionFailureDetails;
    TargetVolumeValues?: Volume;
  }
  export interface AdministrativeActionFailureDetails {
    /**
     * Error message providing details about the failed administrative action.
     */
    Message?: ErrorMessage;
  }
  export type AdministrativeActionType = "FILE_SYSTEM_UPDATE"|"STORAGE_OPTIMIZATION"|"FILE_SYSTEM_ALIAS_ASSOCIATION"|"FILE_SYSTEM_ALIAS_DISASSOCIATION"|string;
  export type AdministrativeActions = AdministrativeAction[];
  export interface Alias {
    /**
     * The name of the DNS alias. The alias name has to meet the following requirements:   Formatted as a fully-qualified domain name (FQDN), hostname.domain, for example, accounting.example.com.   Can contain alphanumeric characters, the underscore (_), and the hyphen (-).   Cannot start or end with a hyphen.   Can start with a numeric.   For DNS names, Amazon FSx stores alphabetic characters as lowercase letters (a-z), regardless of how you specify them: as uppercase letters, lowercase letters, or the corresponding letters in escape codes.
     */
    Name?: AlternateDNSName;
    /**
     * Describes the state of the DNS alias.   AVAILABLE - The DNS alias is associated with an Amazon FSx file system.   CREATING - Amazon FSx is creating the DNS alias and associating it with the file system.   CREATE_FAILED - Amazon FSx was unable to associate the DNS alias with the file system.   DELETING - Amazon FSx is disassociating the DNS alias from the file system and deleting it.   DELETE_FAILED - Amazon FSx was unable to disassociate the DNS alias from the file system.  
     */
    Lifecycle?: AliasLifecycle;
  }
  export type AliasLifecycle = "AVAILABLE"|"CREATING"|"DELETING"|"CREATE_FAILED"|"DELETE_FAILED"|string;
  export type Aliases = Alias[];
  export type AlternateDNSName = string;
  export type AlternateDNSNames = AlternateDNSName[];
  export type ArchivePath = string;
  export interface AssociateFileSystemAliasesRequest {
    ClientRequestToken?: ClientRequestToken;
    /**
     * Specifies the file system with which you want to associate one or more DNS aliases.
     */
    FileSystemId: FileSystemId;
    /**
     * An array of one or more DNS alias names to associate with the file system. The alias name has to comply with the following formatting requirements:   Formatted as a fully-qualified domain name (FQDN),  hostname.domain , for example, accounting.corp.example.com.   Can contain alphanumeric characters and the hyphen (-).   Cannot start or end with a hyphen.   Can start with a numeric.   For DNS alias names, Amazon FSx stores alphabetic characters as lowercase letters (a-z), regardless of how you specify them: as uppercase letters, lowercase letters, or the corresponding letters in escape codes.
     */
    Aliases: AlternateDNSNames;
  }
  export interface AssociateFileSystemAliasesResponse {
    /**
     * An array of the DNS aliases that Amazon FSx is associating with the file system.
     */
    Aliases?: Aliases;
  }
  export type AutoImportPolicyType = "NONE"|"NEW"|"NEW_CHANGED"|string;
  export type AutomaticBackupRetentionDays = number;
  export interface Backup {
    /**
     * The ID of the backup.
     */
    BackupId: BackupId;
    /**
     * The lifecycle status of the backup.    AVAILABLE - The backup is fully available.    PENDING - For user-initiated backups on Lustre file systems only; Amazon FSx has not started creating the backup.    CREATING - Amazon FSx is creating the backup.    TRANSFERRING - For user-initiated backups on Lustre file systems only; Amazon FSx is transferring the backup to S3.    COPYING - Amazon FSx is copying the backup.    DELETED - Amazon FSx deleted the backup and it is no longer available.    FAILED - Amazon FSx could not complete the backup.  
     */
    Lifecycle: BackupLifecycle;
    /**
     * Details explaining any failures that occur when creating a backup.
     */
    FailureDetails?: BackupFailureDetails;
    /**
     * The type of the file system backup.
     */
    Type: BackupType;
    ProgressPercent?: ProgressPercent;
    /**
     * The time when a particular backup was created.
     */
    CreationTime: CreationTime;
    /**
     * The ID of the Key Management Service (KMS) key used to encrypt the backup of the Amazon FSx file system's data at rest. 
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The Amazon Resource Name (ARN) for the backup resource.
     */
    ResourceARN?: ResourceARN;
    /**
     * Tags associated with a particular file system.
     */
    Tags?: Tags;
    /**
     * Metadata of the file system associated with the backup. This metadata is persisted even if the file system is deleted.
     */
    FileSystem: FileSystem;
    /**
     * The configuration of the self-managed Microsoft Active Directory (AD) to which the Windows File Server instance is joined.
     */
    DirectoryInformation?: ActiveDirectoryBackupAttributes;
    OwnerId?: AWSAccountId;
    SourceBackupId?: BackupId;
    /**
     * The source Region of the backup. Specifies the Region from where this backup is copied.
     */
    SourceBackupRegion?: Region;
    /**
     * Specifies the resource type that is backed up.
     */
    ResourceType?: ResourceType;
    Volume?: Volume;
  }
  export interface BackupFailureDetails {
    /**
     * A message describing the backup creation failure.
     */
    Message?: ErrorMessage;
  }
  export type BackupId = string;
  export type BackupIds = BackupId[];
  export type BackupLifecycle = "AVAILABLE"|"CREATING"|"TRANSFERRING"|"DELETED"|"FAILED"|"PENDING"|"COPYING"|string;
  export type BackupType = "AUTOMATIC"|"USER_INITIATED"|"AWS_BACKUP"|string;
  export type Backups = Backup[];
  export interface CancelDataRepositoryTaskRequest {
    /**
     * Specifies the data repository task to cancel.
     */
    TaskId: TaskId;
  }
  export interface CancelDataRepositoryTaskResponse {
    /**
     * The lifecycle status of the data repository task, as follows:    PENDING - Amazon FSx has not started the task.    EXECUTING - Amazon FSx is processing the task.    FAILED - Amazon FSx was not able to complete the task. For example, there may be files the task failed to process. The DataRepositoryTaskFailureDetails property provides more information about task failures.    SUCCEEDED - FSx completed the task successfully.    CANCELED - Amazon FSx canceled the task and it did not complete.    CANCELING - FSx is in process of canceling the task.  
     */
    Lifecycle?: DataRepositoryTaskLifecycle;
    /**
     * The ID of the task being canceled.
     */
    TaskId?: TaskId;
  }
  export type ClientRequestToken = string;
  export interface CompletionReport {
    /**
     * Set Enabled to True to generate a CompletionReport when the task completes. If set to true, then you need to provide a report Scope, Path, and Format. Set Enabled to False if you do not want a CompletionReport generated when the task completes.
     */
    Enabled: Flag;
    /**
     * Required if Enabled is set to true. Specifies the location of the report on the file system's linked S3 data repository. An absolute path that defines where the completion report will be stored in the destination location. The Path you provide must be located within the file system’s ExportPath. An example Path value is "s3://myBucket/myExportPath/optionalPrefix". The report provides the following information for each file in the report: FilePath, FileStatus, and ErrorCode. To learn more about a file system's ExportPath, see . 
     */
    Path?: ArchivePath;
    /**
     * Required if Enabled is set to true. Specifies the format of the CompletionReport. REPORT_CSV_20191124 is the only format currently supported. When Format is set to REPORT_CSV_20191124, the CompletionReport is provided in CSV format, and is delivered to {path}/task-{id}/failures.csv. 
     */
    Format?: ReportFormat;
    /**
     * Required if Enabled is set to true. Specifies the scope of the CompletionReport; FAILED_FILES_ONLY is the only scope currently supported. When Scope is set to FAILED_FILES_ONLY, the CompletionReport only contains information about files that the data repository task failed to process.
     */
    Scope?: ReportScope;
  }
  export type CoolingPeriod = number;
  export interface CopyBackupRequest {
    ClientRequestToken?: ClientRequestToken;
    /**
     * The ID of the source backup. Specifies the ID of the backup that is being copied.
     */
    SourceBackupId: SourceBackupId;
    /**
     * The source Amazon Web Services Region of the backup. Specifies the Amazon Web Services Region from which the backup is being copied. The source and destination Regions must be in the same Amazon Web Services partition. If you don't specify a Region, it defaults to the Region where the request is sent from (in-Region copy).
     */
    SourceRegion?: Region;
    KmsKeyId?: KmsKeyId;
    /**
     * A boolean flag indicating whether tags from the source backup should be copied to the backup copy. This value defaults to false. If you set CopyTags to true and the source backup has existing tags, you can use the Tags parameter to create new tags, provided that the sum of the source backup tags and the new tags doesn't exceed 50. Both sets of tags are merged. If there are tag conflicts (for example, two tags with the same key but different values), the tags created with the Tags parameter take precedence.
     */
    CopyTags?: Flag;
    Tags?: Tags;
  }
  export interface CopyBackupResponse {
    Backup?: Backup;
  }
  export interface CreateBackupRequest {
    /**
     * The ID of the file system to back up.
     */
    FileSystemId?: FileSystemId;
    /**
     * (Optional) A string of up to 64 ASCII characters that Amazon FSx uses to ensure idempotent creation. This string is automatically filled on your behalf when you use the Command Line Interface (CLI) or an Amazon Web Services SDK.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * (Optional) The tags to apply to the backup at backup creation. The key value of the Name tag appears in the console as the backup name. If you have set CopyTagsToBackups to true, and you specify one or more tags using the CreateBackup action, no existing file system tags are copied from the file system to the backup.
     */
    Tags?: Tags;
    /**
     * The ID of he FSx for NetApp ONTAP volume to back up.
     */
    VolumeId?: VolumeId;
  }
  export interface CreateBackupResponse {
    /**
     * A description of the backup.
     */
    Backup?: Backup;
  }
  export interface CreateDataRepositoryTaskRequest {
    /**
     * Specifies the type of data repository task to create.
     */
    Type: DataRepositoryTaskType;
    /**
     * (Optional) The path or paths on the Amazon FSx file system to use when the data repository task is processed. The default path is the file system root directory. The paths you provide need to be relative to the mount point of the file system. If the mount point is /mnt/fsx and /mnt/fsx/path1 is a directory or file on the file system you want to export, then the path to provide is path1. If a path that you provide isn't valid, the task fails.
     */
    Paths?: DataRepositoryTaskPaths;
    FileSystemId: FileSystemId;
    /**
     * Defines whether or not Amazon FSx provides a CompletionReport once the task has completed. A CompletionReport provides a detailed report on the files that Amazon FSx processed that meet the criteria specified by the Scope parameter. For more information, see Working with Task Completion Reports.
     */
    Report: CompletionReport;
    ClientRequestToken?: ClientRequestToken;
    Tags?: Tags;
  }
  export interface CreateDataRepositoryTaskResponse {
    /**
     * The description of the data repository task that you just created.
     */
    DataRepositoryTask?: DataRepositoryTask;
  }
  export interface CreateFileSystemFromBackupRequest {
    BackupId: BackupId;
    /**
     * A string of up to 64 ASCII characters that Amazon FSx uses to ensure idempotent creation. This string is automatically filled on your behalf when you use the Command Line Interface (CLI) or an Amazon Web Services SDK.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * Specifies the IDs of the subnets that the file system will be accessible from. For Windows MULTI_AZ_1 file system deployment types, provide exactly two subnet IDs, one for the preferred file server and one for the standby file server. You specify one of these subnets as the preferred subnet using the WindowsConfiguration &gt; PreferredSubnetID property. For Windows SINGLE_AZ_1 and SINGLE_AZ_2 deployment types and Lustre file systems, provide exactly one subnet ID. The file server is launched in that subnet's Availability Zone.
     */
    SubnetIds: SubnetIds;
    /**
     * A list of IDs for the security groups that apply to the specified network interfaces created for file system access. These security groups apply to all network interfaces. This value isn't returned in later DescribeFileSystem requests.
     */
    SecurityGroupIds?: SecurityGroupIds;
    /**
     * The tags to be applied to the file system at file system creation. The key value of the Name tag appears in the console as the file system name.
     */
    Tags?: Tags;
    /**
     * The configuration for this Microsoft Windows file system.
     */
    WindowsConfiguration?: CreateFileSystemWindowsConfiguration;
    LustreConfiguration?: CreateFileSystemLustreConfiguration;
    /**
     * Sets the storage type for the Windows file system you're creating from a backup. Valid values are SSD and HDD.   Set to SSD to use solid state drive storage. Supported on all Windows deployment types.   Set to HDD to use hard disk drive storage. Supported on SINGLE_AZ_2 and MULTI_AZ_1 Windows file system deployment types.     Default value is SSD.   HDD and SSD storage types have different minimum storage capacity requirements. A restored file system's storage capacity is tied to the file system that was backed up. You can create a file system that uses HDD storage from a backup of a file system that used SSD storage only if the original SSD file system had a storage capacity of at least 2000 GiB.  
     */
    StorageType?: StorageType;
    KmsKeyId?: KmsKeyId;
    /**
     * Sets the version for the Amazon FSx for Lustre file system you're creating from a backup. Valid values are 2.10 and 2.12. You don't need to specify FileSystemTypeVersion because it will be applied using the backup's FileSystemTypeVersion setting. If you choose to specify FileSystemTypeVersion when creating from backup, the value must match the backup's FileSystemTypeVersion setting.
     */
    FileSystemTypeVersion?: FileSystemTypeVersion;
  }
  export interface CreateFileSystemFromBackupResponse {
    /**
     * A description of the file system.
     */
    FileSystem?: FileSystem;
  }
  export interface CreateFileSystemLustreConfiguration {
    /**
     * (Optional) The preferred start time to perform weekly maintenance, formatted d:HH:MM in the UTC time zone, where d is the weekday number, from 1 through 7, beginning with Monday and ending with Sunday.
     */
    WeeklyMaintenanceStartTime?: WeeklyTime;
    /**
     * (Optional) The path to the Amazon S3 bucket (including the optional prefix) that you're using as the data repository for your Amazon FSx for Lustre file system. The root of your FSx for Lustre file system will be mapped to the root of the Amazon S3 bucket you select. An example is s3://import-bucket/optional-prefix. If you specify a prefix after the Amazon S3 bucket name, only object keys with that prefix are loaded into the file system.
     */
    ImportPath?: ArchivePath;
    /**
     * (Optional) The path in Amazon S3 where the root of your Amazon FSx file system is exported. The path must use the same Amazon S3 bucket as specified in ImportPath. You can provide an optional prefix to which new and changed data is to be exported from your Amazon FSx for Lustre file system. If an ExportPath value is not provided, Amazon FSx sets a default export path, s3://import-bucket/FSxLustre[creation-timestamp]. The timestamp is in UTC format, for example s3://import-bucket/FSxLustre20181105T222312Z. The Amazon S3 export bucket must be the same as the import bucket specified by ImportPath. If you only specify a bucket name, such as s3://import-bucket, you get a 1:1 mapping of file system objects to S3 bucket objects. This mapping means that the input data in S3 is overwritten on export. If you provide a custom prefix in the export path, such as s3://import-bucket/[custom-optional-prefix], Amazon FSx exports the contents of your file system to that export prefix in the Amazon S3 bucket.
     */
    ExportPath?: ArchivePath;
    /**
     * (Optional) For files imported from a data repository, this value determines the stripe count and maximum amount of data per file (in MiB) stored on a single physical disk. The maximum number of disks that a single file can be striped across is limited by the total number of disks that make up the file system. The default chunk size is 1,024 MiB (1 GiB) and can go as high as 512,000 MiB (500 GiB). Amazon S3 objects have a maximum size of 5 TB.
     */
    ImportedFileChunkSize?: Megabytes;
    /**
     *  Choose SCRATCH_1 and SCRATCH_2 deployment types when you need temporary storage and shorter-term processing of data. The SCRATCH_2 deployment type provides in-transit encryption of data and higher burst throughput capacity than SCRATCH_1. Choose PERSISTENT_1 deployment type for longer-term storage and workloads and encryption of data in transit. To learn more about deployment types, see  FSx for Lustre Deployment Options. Encryption of data in-transit is automatically enabled when you access a SCRATCH_2 or PERSISTENT_1 file system from Amazon EC2 instances that support this feature. (Default = SCRATCH_1)  Encryption of data in-transit for SCRATCH_2 and PERSISTENT_1 deployment types is supported when accessed from supported instance types in supported Amazon Web Services Regions. To learn more, Encrypting Data in Transit.
     */
    DeploymentType?: LustreDeploymentType;
    /**
     *  (Optional) When you create your file system, your existing S3 objects appear as file and directory listings. Use this property to choose how Amazon FSx keeps your file and directory listings up to date as you add or modify objects in your linked S3 bucket. AutoImportPolicy can have the following values:    NONE - (Default) AutoImport is off. Amazon FSx only updates file and directory listings from the linked S3 bucket when the file system is created. FSx does not update file and directory listings for any new or changed objects after choosing this option.    NEW - AutoImport is on. Amazon FSx automatically imports directory listings of any new objects added to the linked S3 bucket that do not currently exist in the FSx file system.     NEW_CHANGED - AutoImport is on. Amazon FSx automatically imports file and directory listings of any new objects added to the S3 bucket and any existing objects that are changed in the S3 bucket after you choose this option.    For more information, see Automatically import updates from your S3 bucket.
     */
    AutoImportPolicy?: AutoImportPolicyType;
    /**
     *  Required for the PERSISTENT_1 deployment type, describes the amount of read and write throughput for each 1 tebibyte of storage, in MB/s/TiB. File system throughput capacity is calculated by multiplying ﬁle system storage capacity (TiB) by the PerUnitStorageThroughput (MB/s/TiB). For a 2.4 TiB ﬁle system, provisioning 50 MB/s/TiB of PerUnitStorageThroughput yields 120 MB/s of ﬁle system throughput. You pay for the amount of throughput that you provision.  Valid values for SSD storage: 50, 100, 200. Valid values for HDD storage: 12, 40.
     */
    PerUnitStorageThroughput?: PerUnitStorageThroughput;
    DailyAutomaticBackupStartTime?: DailyTime;
    AutomaticBackupRetentionDays?: AutomaticBackupRetentionDays;
    /**
     * (Optional) Not available to use with file systems that are linked to a data repository. A boolean flag indicating whether tags for the file system should be copied to backups. The default value is false. If it's set to true, all file system tags are copied to all automatic and user-initiated backups when the user doesn't specify any backup-specific tags. If this value is true, and you specify one or more backup tags, only the specified tags are copied to backups. If you specify one or more tags when creating a user-initiated backup, no tags are copied from the file system, regardless of this value. For more information, see Working with backups.
     */
    CopyTagsToBackups?: Flag;
    /**
     * The type of drive cache used by PERSISTENT_1 file systems that are provisioned with HDD storage devices. This parameter is required when storage type is HDD. Set to READ, improve the performance for frequently accessed files and allows 20% of the total storage capacity of the file system to be cached.  This parameter is required when StorageType is set to HDD.
     */
    DriveCacheType?: DriveCacheType;
    /**
     * Sets the data compression configuration for the file system. DataCompressionType can have the following values:    NONE - (Default) Data compression is turned off when the file system is created.    LZ4 - Data compression is turned on with the LZ4 algorithm.   For more information, see Lustre data compression.
     */
    DataCompressionType?: DataCompressionType;
  }
  export interface CreateFileSystemOntapConfiguration {
    AutomaticBackupRetentionDays?: AutomaticBackupRetentionDays;
    DailyAutomaticBackupStartTime?: DailyTime;
    /**
     * Specifies the ONTAP file system deployment type to use in creating the file system.
     */
    DeploymentType: OntapDeploymentType;
    /**
     * Specifies the IP address range in which the endpoints to access your file system will be created. By default, Amazon FSx selects an unused IP address range for you from the 198.19.* range.
     */
    EndpointIpAddressRange?: IpAddressRange;
    /**
     * The ONTAP administrative password for the fsxadmin user that you can use to administer your file system using the ONTAP CLI and REST API.
     */
    FsxAdminPassword?: AdminPassword;
    /**
     * The SSD IOPS configuration for the Amazon FSx for NetApp ONTAP file system.
     */
    DiskIopsConfiguration?: DiskIopsConfiguration;
    PreferredSubnetId?: SubnetId;
    /**
     * Specifies the VPC route tables in which your file system's endpoints will be created. You should specify all VPC route tables associated with the subnets in which your clients are located. By default, Amazon FSx selects your VPC's default route table.
     */
    RouteTableIds?: RouteTableIds;
    ThroughputCapacity: MegabytesPerSecond;
    WeeklyMaintenanceStartTime?: WeeklyTime;
  }
  export interface CreateFileSystemRequest {
    /**
     * A string of up to 64 ASCII characters that Amazon FSx uses to ensure idempotent creation. This string is automatically filled on your behalf when you use the Command Line Interface (CLI) or an Amazon Web Services SDK.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * The type of Amazon FSx file system to create. Valid values are WINDOWS, LUSTRE, and ONTAP.
     */
    FileSystemType: FileSystemType;
    /**
     * Sets the storage capacity of the file system that you're creating. For Lustre file systems:   For SCRATCH_2 and PERSISTENT_1 SSD deployment types, valid values are 1200 GiB, 2400 GiB, and increments of 2400 GiB.   For PERSISTENT HDD file systems, valid values are increments of 6000 GiB for 12 MB/s/TiB file systems and increments of 1800 GiB for 40 MB/s/TiB file systems.   For SCRATCH_1 deployment type, valid values are 1200 GiB, 2400 GiB, and increments of 3600 GiB.   For Windows file systems:   If StorageType=SSD, valid values are 32 GiB - 65,536 GiB (64 TiB).   If StorageType=HDD, valid values are 2000 GiB - 65,536 GiB (64 TiB).   For ONTAP file systems:   Valid values are 1024 GiB - 196,608 GiB (192 TiB).  
     */
    StorageCapacity: StorageCapacity;
    /**
     * Sets the storage type for the file system you're creating. Valid values are SSD and HDD.   Set to SSD to use solid state drive storage. SSD is supported on all Windows, Lustre, and ONTAP deployment types.   Set to HDD to use hard disk drive storage. HDD is supported on SINGLE_AZ_2 and MULTI_AZ_1 Windows file system deployment types, and on PERSISTENT Lustre file system deployment types.     Default value is SSD. For more information, see  Storage Type Options in the Amazon FSx for Windows User Guide and Multiple Storage Options in the Amazon FSx for Lustre User Guide. 
     */
    StorageType?: StorageType;
    /**
     * Specifies the IDs of the subnets that the file system will be accessible from. For Windows and ONTAP MULTI_AZ_1 file system deployment types, provide exactly two subnet IDs, one for the preferred file server and one for the standby file server. You specify one of these subnets as the preferred subnet using the WindowsConfiguration &gt; PreferredSubnetID or OntapConfiguration &gt; PreferredSubnetID properties. For more information, see  Availability and durability: Single-AZ and Multi-AZ file systems in the Amazon FSx for Windows User Guide and  Availability and durability in the Amazon FSx for ONTAP User Guide. For Windows SINGLE_AZ_1 and SINGLE_AZ_2 file system deployment types and Lustre file systems, provide exactly one subnet ID. The file server is launched in that subnet's Availability Zone.
     */
    SubnetIds: SubnetIds;
    /**
     * A list of IDs specifying the security groups to apply to all network interfaces created for file system access. This list isn't returned in later requests to describe the file system.
     */
    SecurityGroupIds?: SecurityGroupIds;
    /**
     * The tags to apply to the file system being created. The key value of the Name tag appears in the console as the file system name.
     */
    Tags?: Tags;
    KmsKeyId?: KmsKeyId;
    /**
     * The Microsoft Windows configuration for the file system being created. 
     */
    WindowsConfiguration?: CreateFileSystemWindowsConfiguration;
    LustreConfiguration?: CreateFileSystemLustreConfiguration;
    OntapConfiguration?: CreateFileSystemOntapConfiguration;
    /**
     * Sets the version of the Amazon FSx for Lustre file system you're creating. Valid values are 2.10 and 2.12.   Set the value to 2.10 to create a Lustre 2.10 file system.   Set the value to 2.12 to create a Lustre 2.12 file system.   Default value is 2.10.
     */
    FileSystemTypeVersion?: FileSystemTypeVersion;
  }
  export interface CreateFileSystemResponse {
    /**
     * The configuration of the file system that was created.
     */
    FileSystem?: FileSystem;
  }
  export interface CreateFileSystemWindowsConfiguration {
    /**
     * The ID for an existing Amazon Web Services Managed Microsoft Active Directory (AD) instance that the file system should join when it's created.
     */
    ActiveDirectoryId?: DirectoryId;
    SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryConfiguration;
    /**
     * Specifies the file system deployment type, valid values are the following:    MULTI_AZ_1 - Deploys a high availability file system that is configured for Multi-AZ redundancy to tolerate temporary Availability Zone (AZ) unavailability. You can only deploy a Multi-AZ file system in Amazon Web Services Regions that have a minimum of three Availability Zones. Also supports HDD storage type    SINGLE_AZ_1 - (Default) Choose to deploy a file system that is configured for single AZ redundancy.    SINGLE_AZ_2 - The latest generation Single AZ file system. Specifies a file system that is configured for single AZ redundancy and supports HDD storage type.   For more information, see  Availability and Durability: Single-AZ and Multi-AZ File Systems.
     */
    DeploymentType?: WindowsDeploymentType;
    /**
     * Required when DeploymentType is set to MULTI_AZ_1. This specifies the subnet in which you want the preferred file server to be located. For in-Amazon Web Services applications, we recommend that you launch your clients in the same Availability Zone (AZ) as your preferred file server to reduce cross-AZ data transfer costs and minimize latency. 
     */
    PreferredSubnetId?: SubnetId;
    /**
     * The throughput of an Amazon FSx file system, measured in megabytes per second, in 2 to the nth increments, between 2^3 (8) and 2^11 (2048).
     */
    ThroughputCapacity: MegabytesPerSecond;
    /**
     * The preferred start time to perform weekly maintenance, formatted d:HH:MM in the UTC time zone, where d is the weekday number, from 1 through 7, beginning with Monday and ending with Sunday.
     */
    WeeklyMaintenanceStartTime?: WeeklyTime;
    /**
     * The preferred time to take daily automatic backups, formatted HH:MM in the UTC time zone.
     */
    DailyAutomaticBackupStartTime?: DailyTime;
    /**
     * The number of days to retain automatic backups. The default is to retain backups for 7 days. Setting this value to 0 disables the creation of automatic backups. The maximum retention period for backups is 90 days.
     */
    AutomaticBackupRetentionDays?: AutomaticBackupRetentionDays;
    /**
     * A boolean flag indicating whether tags for the file system should be copied to backups. This value defaults to false. If it's set to true, all tags for the file system are copied to all automatic and user-initiated backups where the user doesn't specify tags. If this value is true, and you specify one or more tags, only the specified tags are copied to backups. If you specify one or more tags when creating a user-initiated backup, no tags are copied from the file system, regardless of this value.
     */
    CopyTagsToBackups?: Flag;
    /**
     * An array of one or more DNS alias names that you want to associate with the Amazon FSx file system. Aliases allow you to use existing DNS names to access the data in your Amazon FSx file system. You can associate up to 50 aliases with a file system at any time. You can associate additional DNS aliases after you create the file system using the AssociateFileSystemAliases operation. You can remove DNS aliases from the file system after it is created using the DisassociateFileSystemAliases operation. You only need to specify the alias name in the request payload. For more information, see Working with DNS Aliases and Walkthrough 5: Using DNS aliases to access your file system, including additional steps you must take to be able to access your file system using a DNS alias. An alias name has to meet the following requirements:   Formatted as a fully-qualified domain name (FQDN), hostname.domain, for example, accounting.example.com.   Can contain alphanumeric characters, the underscore (_), and the hyphen (-).   Cannot start or end with a hyphen.   Can start with a numeric.   For DNS alias names, Amazon FSx stores alphabetic characters as lowercase letters (a-z), regardless of how you specify them: as uppercase letters, lowercase letters, or the corresponding letters in escape codes.
     */
    Aliases?: AlternateDNSNames;
    /**
     * The configuration that Amazon FSx for Windows File Server uses to audit and log user accesses of files, folders, and file shares on the Amazon FSx for Windows File Server file system.
     */
    AuditLogConfiguration?: WindowsAuditLogCreateConfiguration;
  }
  export interface CreateOntapVolumeConfiguration {
    /**
     * Specifies the location in the SVM's namespace where the volume is mounted. The JunctionPath must have a leading forward slash, such as /vol3.
     */
    JunctionPath: JunctionPath;
    /**
     * The security style for the volume. Specify one of the following values:    UNIX if the file system is managed by a UNIX administrator, the majority of users are NFS clients, and an application accessing the data uses a UNIX user as the service account. UNIX is the default.    NTFS if the file system is managed by a Windows administrator, the majority of users are SMB clients, and an application accessing the data uses a Windows user as the service account.    MIXED if the file system is managed by both UNIX and Windows administrators and users consist of both NFS and SMB clients.  
     */
    SecurityStyle?: SecurityStyle;
    /**
     * Specifies the size of the volume, in megabytes (MB), that you are creating.
     */
    SizeInMegabytes: VolumeCapacity;
    /**
     * Set to true to enable deduplication, compression, and compaction storage efficiency features on the volume.
     */
    StorageEfficiencyEnabled: Flag;
    /**
     * Specifies the ONTAP SVM in which to create the volume.
     */
    StorageVirtualMachineId: StorageVirtualMachineId;
    TieringPolicy?: TieringPolicy;
  }
  export interface CreateStorageVirtualMachineRequest {
    /**
     * Describes the self-managed Microsoft Active Directory to which you want to join the SVM. Joining an Active Directory provides user authentication and access control for SMB clients, including Microsoft Windows and macOS client accessing the file system.
     */
    ActiveDirectoryConfiguration?: CreateSvmActiveDirectoryConfiguration;
    ClientRequestToken?: ClientRequestToken;
    FileSystemId: FileSystemId;
    /**
     * The name of the SVM.
     */
    Name: StorageVirtualMachineName;
    /**
     * The password to use when managing the SVM using the NetApp ONTAP CLI or REST API. If you do not specify a password, you can still use the file system's fsxadmin user to manage the SVM.
     */
    SvmAdminPassword?: AdminPassword;
    Tags?: Tags;
    /**
     * The security style of the root volume of the SVM. Specify one of the following values:    UNIX if the file system is managed by a UNIX administrator, the majority of users are NFS clients, and an application accessing the data uses a UNIX user as the service account.    NTFS if the file system is managed by a Windows administrator, the majority of users are SMB clients, and an application accessing the data uses a Windows user as the service account.    MIXED if the file system is managed by both UNIX and Windows administrators and users consist of both NFS and SMB clients.  
     */
    RootVolumeSecurityStyle?: StorageVirtualMachineRootVolumeSecurityStyle;
  }
  export interface CreateStorageVirtualMachineResponse {
    /**
     * Returned after a successful CreateStorageVirtualMachine operation; describes the SVM just created.
     */
    StorageVirtualMachine?: StorageVirtualMachine;
  }
  export interface CreateSvmActiveDirectoryConfiguration {
    /**
     * The NetBIOS name of the Active Directory computer object that will be created for your SVM.
     */
    NetBiosName: NetBiosAlias;
    SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryConfiguration;
  }
  export interface CreateVolumeFromBackupRequest {
    BackupId: BackupId;
    ClientRequestToken?: ClientRequestToken;
    /**
     * The name of the new volume you're creating.
     */
    Name: VolumeName;
    /**
     * Specifies the configuration of the ONTAP volume that you are creating.
     */
    OntapConfiguration?: CreateOntapVolumeConfiguration;
    Tags?: Tags;
  }
  export interface CreateVolumeFromBackupResponse {
    /**
     * Returned after a successful CreateVolumeFromBackup API operation, describing the volume just created.
     */
    Volume?: Volume;
  }
  export interface CreateVolumeRequest {
    ClientRequestToken?: ClientRequestToken;
    /**
     * Specifies the type of volume to create; ONTAP is the only valid volume type.
     */
    VolumeType: VolumeType;
    /**
     * Specifies the name of the volume you're creating.
     */
    Name: VolumeName;
    /**
     * Specifies the ONTAP configuration to use in creating the volume.
     */
    OntapConfiguration?: CreateOntapVolumeConfiguration;
    Tags?: Tags;
  }
  export interface CreateVolumeResponse {
    /**
     * Returned after a successful CreateVolume API operation, describing the volume just created.
     */
    Volume?: Volume;
  }
  export type CreationTime = Date;
  export type DNSName = string;
  export type DailyTime = string;
  export type DataCompressionType = "NONE"|"LZ4"|string;
  export interface DataRepositoryConfiguration {
    /**
     * Describes the state of the file system's S3 durable data repository, if it is configured with an S3 repository. The lifecycle can have the following values:    CREATING - The data repository configuration between the FSx file system and the linked S3 data repository is being created. The data repository is unavailable.    AVAILABLE - The data repository is available for use.    MISCONFIGURED - Amazon FSx cannot automatically import updates from the S3 bucket until the data repository configuration is corrected. For more information, see Troubleshooting a Misconfigured linked S3 bucket.     UPDATING - The data repository is undergoing a customer initiated update and availability may be impacted.  
     */
    Lifecycle?: DataRepositoryLifecycle;
    /**
     * The import path to the Amazon S3 bucket (and optional prefix) that you're using as the data repository for your FSx for Lustre file system, for example s3://import-bucket/optional-prefix. If a prefix is specified after the Amazon S3 bucket name, only object keys with that prefix are loaded into the file system.
     */
    ImportPath?: ArchivePath;
    /**
     * The export path to the Amazon S3 bucket (and prefix) that you are using to store new and changed Lustre file system files in S3.
     */
    ExportPath?: ArchivePath;
    /**
     * For files imported from a data repository, this value determines the stripe count and maximum amount of data per file (in MiB) stored on a single physical disk. The maximum number of disks that a single file can be striped across is limited by the total number of disks that make up the file system. The default chunk size is 1,024 MiB (1 GiB) and can go as high as 512,000 MiB (500 GiB). Amazon S3 objects have a maximum size of 5 TB.
     */
    ImportedFileChunkSize?: Megabytes;
    /**
     * Describes the file system's linked S3 data repository's AutoImportPolicy. The AutoImportPolicy configures how Amazon FSx keeps your file and directory listings up to date as you add or modify objects in your linked S3 bucket. AutoImportPolicy can have the following values:    NONE - (Default) AutoImport is off. Amazon FSx only updates file and directory listings from the linked S3 bucket when the file system is created. FSx does not update file and directory listings for any new or changed objects after choosing this option.    NEW - AutoImport is on. Amazon FSx automatically imports directory listings of any new objects added to the linked S3 bucket that do not currently exist in the FSx file system.     NEW_CHANGED - AutoImport is on. Amazon FSx automatically imports file and directory listings of any new objects added to the S3 bucket and any existing objects that are changed in the S3 bucket after you choose this option.    For more information, see Automatically import updates from your S3 bucket.
     */
    AutoImportPolicy?: AutoImportPolicyType;
    FailureDetails?: DataRepositoryFailureDetails;
  }
  export interface DataRepositoryFailureDetails {
    Message?: ErrorMessage;
  }
  export type DataRepositoryLifecycle = "CREATING"|"AVAILABLE"|"MISCONFIGURED"|"UPDATING"|"DELETING"|string;
  export interface DataRepositoryTask {
    /**
     * The system-generated, unique 17-digit ID of the data repository task.
     */
    TaskId: TaskId;
    /**
     * The lifecycle status of the data repository task, as follows:    PENDING - Amazon FSx has not started the task.    EXECUTING - Amazon FSx is processing the task.    FAILED - Amazon FSx was not able to complete the task. For example, there may be files the task failed to process. The DataRepositoryTaskFailureDetails property provides more information about task failures.    SUCCEEDED - FSx completed the task successfully.    CANCELED - Amazon FSx canceled the task and it did not complete.    CANCELING - FSx is in process of canceling the task.    You cannot delete an FSx for Lustre file system if there are data repository tasks for the file system in the PENDING or EXECUTING states. Please retry when the data repository task is finished (with a status of CANCELED, SUCCEEDED, or FAILED). You can use the DescribeDataRepositoryTask action to monitor the task status. Contact the FSx team if you need to delete your file system immediately. 
     */
    Lifecycle: DataRepositoryTaskLifecycle;
    /**
     * The type of data repository task; EXPORT_TO_REPOSITORY is the only type currently supported.
     */
    Type: DataRepositoryTaskType;
    CreationTime: CreationTime;
    /**
     * The time that Amazon FSx began processing the task.
     */
    StartTime?: StartTime;
    /**
     * The time that Amazon FSx completed processing the task, populated after the task is complete.
     */
    EndTime?: EndTime;
    ResourceARN?: ResourceARN;
    Tags?: Tags;
    FileSystemId: FileSystemId;
    /**
     * An array of paths on the Amazon FSx for Lustre file system that specify the data for the data repository task to process. For example, in an EXPORT_TO_REPOSITORY task, the paths specify which data to export to the linked data repository. (Default) If Paths is not specified, Amazon FSx uses the file system root directory.
     */
    Paths?: DataRepositoryTaskPaths;
    /**
     * Failure message describing why the task failed, it is populated only when Lifecycle is set to FAILED.
     */
    FailureDetails?: DataRepositoryTaskFailureDetails;
    /**
     * Provides the status of the number of files that the task has processed successfully and failed to process.
     */
    Status?: DataRepositoryTaskStatus;
    Report?: CompletionReport;
  }
  export interface DataRepositoryTaskFailureDetails {
    Message?: ErrorMessage;
  }
  export interface DataRepositoryTaskFilter {
    /**
     * Name of the task property to use in filtering the tasks returned in the response.   Use file-system-id to retrieve data repository tasks for specific file systems.   Use task-lifecycle to retrieve data repository tasks with one or more specific lifecycle states, as follows: CANCELED, EXECUTING, FAILED, PENDING, and SUCCEEDED.  
     */
    Name?: DataRepositoryTaskFilterName;
    /**
     * Use Values to include the specific file system IDs and task lifecycle states for the filters you are using.
     */
    Values?: DataRepositoryTaskFilterValues;
  }
  export type DataRepositoryTaskFilterName = "file-system-id"|"task-lifecycle"|string;
  export type DataRepositoryTaskFilterValue = string;
  export type DataRepositoryTaskFilterValues = DataRepositoryTaskFilterValue[];
  export type DataRepositoryTaskFilters = DataRepositoryTaskFilter[];
  export type DataRepositoryTaskLifecycle = "PENDING"|"EXECUTING"|"FAILED"|"SUCCEEDED"|"CANCELED"|"CANCELING"|string;
  export type DataRepositoryTaskPath = string;
  export type DataRepositoryTaskPaths = DataRepositoryTaskPath[];
  export interface DataRepositoryTaskStatus {
    /**
     * The total number of files that the task will process. While a task is executing, the sum of SucceededCount plus FailedCount may not equal TotalCount. When the task is complete, TotalCount equals the sum of SucceededCount plus FailedCount.
     */
    TotalCount?: TotalCount;
    /**
     * A running total of the number of files that the task has successfully processed.
     */
    SucceededCount?: SucceededCount;
    /**
     * A running total of the number of files that the task failed to process.
     */
    FailedCount?: FailedCount;
    /**
     * The time at which the task status was last updated.
     */
    LastUpdatedTime?: LastUpdatedTime;
  }
  export type DataRepositoryTaskType = "EXPORT_TO_REPOSITORY"|string;
  export type DataRepositoryTasks = DataRepositoryTask[];
  export interface DeleteBackupRequest {
    /**
     * The ID of the backup you want to delete.
     */
    BackupId: BackupId;
    /**
     * A string of up to 64 ASCII characters that Amazon FSx uses to ensure idempotent deletion. This is automatically filled on your behalf when using the CLI or SDK.
     */
    ClientRequestToken?: ClientRequestToken;
  }
  export interface DeleteBackupResponse {
    /**
     * The ID of the backup deleted.
     */
    BackupId?: BackupId;
    /**
     * The lifecycle of the backup. Should be DELETED.
     */
    Lifecycle?: BackupLifecycle;
  }
  export interface DeleteFileSystemLustreConfiguration {
    /**
     * Set SkipFinalBackup to false if you want to take a final backup of the file system you are deleting. By default, Amazon FSx will not take a final backup on your behalf when the DeleteFileSystem operation is invoked. (Default = true)
     */
    SkipFinalBackup?: Flag;
    /**
     * Use if SkipFinalBackup is set to false, and you want to apply an array of tags to the final backup. If you have set the file system property CopyTagsToBackups to true, and you specify one or more FinalBackupTags when deleting a file system, Amazon FSx will not copy any existing file system tags to the backup.
     */
    FinalBackupTags?: Tags;
  }
  export interface DeleteFileSystemLustreResponse {
    /**
     * The ID of the final backup for this file system.
     */
    FinalBackupId?: BackupId;
    /**
     * The set of tags applied to the final backup.
     */
    FinalBackupTags?: Tags;
  }
  export interface DeleteFileSystemRequest {
    /**
     * The ID of the file system you want to delete.
     */
    FileSystemId: FileSystemId;
    /**
     * A string of up to 64 ASCII characters that Amazon FSx uses to ensure idempotent deletion. This is automatically filled on your behalf when using the Command Line Interface (CLI) or an Amazon Web Services SDK.
     */
    ClientRequestToken?: ClientRequestToken;
    WindowsConfiguration?: DeleteFileSystemWindowsConfiguration;
    LustreConfiguration?: DeleteFileSystemLustreConfiguration;
  }
  export interface DeleteFileSystemResponse {
    /**
     * The ID of the file system being deleted.
     */
    FileSystemId?: FileSystemId;
    /**
     * The file system lifecycle for the deletion request. Should be DELETING.
     */
    Lifecycle?: FileSystemLifecycle;
    WindowsResponse?: DeleteFileSystemWindowsResponse;
    LustreResponse?: DeleteFileSystemLustreResponse;
  }
  export interface DeleteFileSystemWindowsConfiguration {
    /**
     * By default, Amazon FSx for Windows takes a final backup on your behalf when the DeleteFileSystem operation is invoked. Doing this helps protect you from data loss, and we highly recommend taking the final backup. If you want to skip this backup, use this flag to do so.
     */
    SkipFinalBackup?: Flag;
    /**
     * A set of tags for your final backup.
     */
    FinalBackupTags?: Tags;
  }
  export interface DeleteFileSystemWindowsResponse {
    /**
     * The ID of the final backup for this file system.
     */
    FinalBackupId?: BackupId;
    /**
     * The set of tags applied to the final backup.
     */
    FinalBackupTags?: Tags;
  }
  export interface DeleteStorageVirtualMachineRequest {
    ClientRequestToken?: ClientRequestToken;
    /**
     * The ID of the SVM that you want to delete.
     */
    StorageVirtualMachineId: StorageVirtualMachineId;
  }
  export interface DeleteStorageVirtualMachineResponse {
    /**
     * The ID of the SVM Amazon FSx is deleting.
     */
    StorageVirtualMachineId?: StorageVirtualMachineId;
    /**
     * Describes the lifecycle state of the SVM being deleted.
     */
    Lifecycle?: StorageVirtualMachineLifecycle;
  }
  export interface DeleteVolumeOntapConfiguration {
    /**
     * Set to true if you want to skip taking a final backup of the volume you are deleting.
     */
    SkipFinalBackup?: Flag;
    FinalBackupTags?: Tags;
  }
  export interface DeleteVolumeOntapResponse {
    FinalBackupId?: BackupId;
    FinalBackupTags?: Tags;
  }
  export interface DeleteVolumeRequest {
    ClientRequestToken?: ClientRequestToken;
    /**
     * The ID of the volume you are deleting.
     */
    VolumeId: VolumeId;
    /**
     * For Amazon FSx for ONTAP volumes, specify whether to take a final backup of the volume, and apply tags to the backup.
     */
    OntapConfiguration?: DeleteVolumeOntapConfiguration;
  }
  export interface DeleteVolumeResponse {
    /**
     * The ID of the volume being deleted.
     */
    VolumeId?: VolumeId;
    /**
     * Describes the lifecycle state of the volume being deleted.
     */
    Lifecycle?: VolumeLifecycle;
    /**
     * Returned after a DeleteVolume request, showing the status of the delete request. 
     */
    OntapResponse?: DeleteVolumeOntapResponse;
  }
  export interface DescribeBackupsRequest {
    /**
     * IDs of the backups you want to retrieve (String). This overrides any filters. If any IDs are not found, BackupNotFound will be thrown.
     */
    BackupIds?: BackupIds;
    /**
     * Filters structure. Supported names are file-system-id, backup-type, file-system-type, and volume-id.
     */
    Filters?: Filters;
    /**
     * Maximum number of backups to return in the response (integer). This parameter value must be greater than 0. The number of items that Amazon FSx returns is the minimum of the MaxResults parameter specified in the request and the service's internal maximum number of items per page.
     */
    MaxResults?: MaxResults;
    /**
     * Opaque pagination token returned from a previous DescribeBackups operation (String). If a token present, the action continues the list from where the returning call left off.
     */
    NextToken?: NextToken;
  }
  export interface DescribeBackupsResponse {
    /**
     * An array of backups.
     */
    Backups?: Backups;
    /**
     * This is present if there are more backups than returned in the response (String). You can use the NextToken value in the later request to fetch the backups. 
     */
    NextToken?: NextToken;
  }
  export interface DescribeDataRepositoryTasksRequest {
    /**
     * (Optional) IDs of the tasks whose descriptions you want to retrieve (String).
     */
    TaskIds?: TaskIds;
    /**
     * (Optional) You can use filters to narrow the DescribeDataRepositoryTasks response to include just tasks for specific file systems, or tasks in a specific lifecycle state.
     */
    Filters?: DataRepositoryTaskFilters;
    MaxResults?: MaxResults;
    NextToken?: NextToken;
  }
  export interface DescribeDataRepositoryTasksResponse {
    /**
     * The collection of data repository task descriptions returned.
     */
    DataRepositoryTasks?: DataRepositoryTasks;
    NextToken?: NextToken;
  }
  export interface DescribeFileSystemAliasesRequest {
    ClientRequestToken?: ClientRequestToken;
    /**
     * The ID of the file system to return the associated DNS aliases for (String).
     */
    FileSystemId: FileSystemId;
    /**
     * Maximum number of DNS aliases to return in the response (integer). This parameter value must be greater than 0. The number of items that Amazon FSx returns is the minimum of the MaxResults parameter specified in the request and the service's internal maximum number of items per page.
     */
    MaxResults?: MaxResults;
    /**
     * Opaque pagination token returned from a previous DescribeFileSystemAliases operation (String). If a token is included in the request, the action continues the list from where the previous returning call left off.
     */
    NextToken?: NextToken;
  }
  export interface DescribeFileSystemAliasesResponse {
    /**
     * An array of one or more DNS aliases currently associated with the specified file system.
     */
    Aliases?: Aliases;
    /**
     * Present if there are more DNS aliases than returned in the response (String). You can use the NextToken value in a later request to fetch additional descriptions. 
     */
    NextToken?: NextToken;
  }
  export interface DescribeFileSystemsRequest {
    /**
     * IDs of the file systems whose descriptions you want to retrieve (String).
     */
    FileSystemIds?: FileSystemIds;
    /**
     * Maximum number of file systems to return in the response (integer). This parameter value must be greater than 0. The number of items that Amazon FSx returns is the minimum of the MaxResults parameter specified in the request and the service's internal maximum number of items per page.
     */
    MaxResults?: MaxResults;
    /**
     * Opaque pagination token returned from a previous DescribeFileSystems operation (String). If a token present, the action continues the list from where the returning call left off.
     */
    NextToken?: NextToken;
  }
  export interface DescribeFileSystemsResponse {
    /**
     * An array of file system descriptions.
     */
    FileSystems?: FileSystems;
    /**
     * Present if there are more file systems than returned in the response (String). You can use the NextToken value in the later request to fetch the descriptions. 
     */
    NextToken?: NextToken;
  }
  export interface DescribeStorageVirtualMachinesRequest {
    /**
     * Enter the ID of one or more SVMs that you want to view.
     */
    StorageVirtualMachineIds?: StorageVirtualMachineIds;
    /**
     * Enter a filter name:value pair to view a select set of SVMs.
     */
    Filters?: StorageVirtualMachineFilters;
    MaxResults?: MaxResults;
    NextToken?: NextToken;
  }
  export interface DescribeStorageVirtualMachinesResponse {
    /**
     * Returned after a successful DescribeStorageVirtualMachines operation, describing each SVM.
     */
    StorageVirtualMachines?: StorageVirtualMachines;
    NextToken?: NextToken;
  }
  export interface DescribeVolumesRequest {
    /**
     * IDs of the volumes whose descriptions you want to retrieve.
     */
    VolumeIds?: VolumeIds;
    /**
     * Enter a filter name:value pair to view a select set of volumes.
     */
    Filters?: VolumeFilters;
    MaxResults?: MaxResults;
    NextToken?: NextToken;
  }
  export interface DescribeVolumesResponse {
    /**
     * Returned after a successful DescribeVolumes operation, describing each volume.
     */
    Volumes?: Volumes;
    NextToken?: NextToken;
  }
  export type DirectoryId = string;
  export type DirectoryPassword = string;
  export type DirectoryUserName = string;
  export interface DisassociateFileSystemAliasesRequest {
    ClientRequestToken?: ClientRequestToken;
    /**
     * Specifies the file system from which to disassociate the DNS aliases.
     */
    FileSystemId: FileSystemId;
    /**
     * An array of one or more DNS alias names to disassociate, or remove, from the file system.
     */
    Aliases: AlternateDNSNames;
  }
  export interface DisassociateFileSystemAliasesResponse {
    /**
     * An array of one or more DNS aliases that Amazon FSx is attempting to disassociate from the file system.
     */
    Aliases?: Aliases;
  }
  export interface DiskIopsConfiguration {
    /**
     * Specifies whether the number of IOPS for the file system is using the system default (AUTOMATIC) or was provisioned by the customer (USER_PROVISIONED).
     */
    Mode?: DiskIopsConfigurationMode;
    /**
     * The total number of SSD IOPS provisioned for the file system.
     */
    Iops?: Iops;
  }
  export type DiskIopsConfigurationMode = "AUTOMATIC"|"USER_PROVISIONED"|string;
  export type DnsIps = IpAddress[];
  export type DriveCacheType = "NONE"|"READ"|string;
  export type EndTime = Date;
  export type ErrorMessage = string;
  export type FailedCount = number;
  export interface FileSystem {
    /**
     * The Amazon Web Services account that created the file system. If the file system was created by an Identity and Access Management (IAM) user, the Amazon Web Services account to which the IAM user belongs is the owner.
     */
    OwnerId?: AWSAccountId;
    /**
     * The time that the file system was created, in seconds (since 1970-01-01T00:00:00Z), also known as Unix time.
     */
    CreationTime?: CreationTime;
    /**
     * The system-generated, unique 17-digit ID of the file system.
     */
    FileSystemId?: FileSystemId;
    /**
     * The type of Amazon FSx file system, which can be LUSTRE, WINDOWS, or ONTAP.
     */
    FileSystemType?: FileSystemType;
    /**
     * The lifecycle status of the file system, following are the possible values and what they mean:    AVAILABLE - The file system is in a healthy state, and is reachable and available for use.    CREATING - Amazon FSx is creating the new file system.    DELETING - Amazon FSx is deleting an existing file system.    FAILED - An existing file system has experienced an unrecoverable failure. When creating a new file system, Amazon FSx was unable to create the file system.    MISCONFIGURED indicates that the file system is in a failed but recoverable state.    UPDATING indicates that the file system is undergoing a customer initiated update.  
     */
    Lifecycle?: FileSystemLifecycle;
    FailureDetails?: FileSystemFailureDetails;
    /**
     * The storage capacity of the file system in gibibytes (GiB).
     */
    StorageCapacity?: StorageCapacity;
    /**
     * The storage type of the file system. Valid values are SSD and HDD. If set to SSD, the file system uses solid state drive storage. If set to HDD, the file system uses hard disk drive storage. 
     */
    StorageType?: StorageType;
    /**
     * The ID of the primary VPC for the file system.
     */
    VpcId?: VpcId;
    /**
     * Specifies the IDs of the subnets that the file system is accessible from. For Windows and ONTAP MULTI_AZ_1 file system deployment type, there are two subnet IDs, one for the preferred file server and one for the standby file server. The preferred file server subnet identified in the PreferredSubnetID property. All other file systems have only one subnet ID. For Lustre file systems, and Single-AZ Windows file systems, this is the ID of the subnet that contains the endpoint for the file system. For MULTI_AZ_1 Windows and ONTAP file systems, the endpoint for the file system is available in the PreferredSubnetID.
     */
    SubnetIds?: SubnetIds;
    /**
     * The IDs of the elastic network interface from which a specific file system is accessible. The elastic network interface is automatically created in the same VPC that the Amazon FSx file system was created in. For more information, see Elastic Network Interfaces in the Amazon EC2 User Guide.  For an Amazon FSx for Windows File Server file system, you can have one network interface ID. For an Amazon FSx for Lustre file system, you can have more than one.
     */
    NetworkInterfaceIds?: NetworkInterfaceIds;
    /**
     * The DNS name for the file system.
     */
    DNSName?: DNSName;
    /**
     * The ID of the Key Management Service (KMS) key used to encrypt the file system's data for Amazon FSx for Windows File Server file systems, Amazon FSx for NetApp ONTAP file systems, and persistent Amazon FSx for Lustre file systems at rest. If not specified, the Amazon FSx managed key is used. The scratch Amazon FSx for Lustre file systems are always encrypted at rest using Amazon FSx managed keys. For more information, see Encrypt in the Key Management Service API Reference.
     */
    KmsKeyId?: KmsKeyId;
    /**
     * The Amazon Resource Name (ARN) for the file system resource.
     */
    ResourceARN?: ResourceARN;
    /**
     * The tags to associate with the file system. For more information, see Tagging Your Amazon EC2 Resources in the Amazon EC2 User Guide.
     */
    Tags?: Tags;
    /**
     * The configuration for this Microsoft Windows file system.
     */
    WindowsConfiguration?: WindowsFileSystemConfiguration;
    LustreConfiguration?: LustreFileSystemConfiguration;
    /**
     * A list of administrative actions for the file system that are in process or waiting to be processed. Administrative actions describe changes to the Amazon FSx file system that you have initiated using the UpdateFileSystem action.
     */
    AdministrativeActions?: AdministrativeActions;
    /**
     * The configuration for this FSx for NetApp ONTAP file system.
     */
    OntapConfiguration?: OntapFileSystemConfiguration;
    /**
     * The version of your Amazon FSx for Lustre file system, either 2.10 or 2.12.
     */
    FileSystemTypeVersion?: FileSystemTypeVersion;
  }
  export type FileSystemAdministratorsGroupName = string;
  export interface FileSystemEndpoint {
    DNSName?: DNSName;
    /**
     * IP addresses of the file system endpoint.
     */
    IpAddresses?: OntapEndpointIpAddresses;
  }
  export interface FileSystemEndpoints {
    /**
     * An endpoint for managing your file system by setting up NetApp SnapMirror with other ONTAP systems.
     */
    Intercluster?: FileSystemEndpoint;
    /**
     * An endpoint for managing your file system using the NetApp ONTAP CLI and NetApp ONTAP API.
     */
    Management?: FileSystemEndpoint;
  }
  export interface FileSystemFailureDetails {
    /**
     * A message describing any failures that occurred during file system creation.
     */
    Message?: ErrorMessage;
  }
  export type FileSystemId = string;
  export type FileSystemIds = FileSystemId[];
  export type FileSystemLifecycle = "AVAILABLE"|"CREATING"|"FAILED"|"DELETING"|"MISCONFIGURED"|"UPDATING"|string;
  export type FileSystemMaintenanceOperation = "PATCHING"|"BACKING_UP"|string;
  export type FileSystemMaintenanceOperations = FileSystemMaintenanceOperation[];
  export type FileSystemType = "WINDOWS"|"LUSTRE"|"ONTAP"|string;
  export type FileSystemTypeVersion = string;
  export type FileSystems = FileSystem[];
  export interface Filter {
    /**
     * The name for this filter.
     */
    Name?: FilterName;
    /**
     * The values of the filter. These are all the values for any of the applied filters.
     */
    Values?: FilterValues;
  }
  export type FilterName = "file-system-id"|"backup-type"|"file-system-type"|"volume-id"|string;
  export type FilterValue = string;
  export type FilterValues = FilterValue[];
  export type Filters = Filter[];
  export type Flag = boolean;
  export type FlexCacheEndpointType = "NONE"|"ORIGIN"|"CACHE"|string;
  export type GeneralARN = string;
  export type Iops = number;
  export type IpAddress = string;
  export type IpAddressRange = string;
  export type JunctionPath = string;
  export type KmsKeyId = string;
  export type LastUpdatedTime = Date;
  export interface LifecycleTransitionReason {
    Message?: ErrorMessage;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The ARN of the Amazon FSx resource that will have its tags listed.
     */
    ResourceARN: ResourceARN;
    /**
     * Maximum number of tags to return in the response (integer). This parameter value must be greater than 0. The number of items that Amazon FSx returns is the minimum of the MaxResults parameter specified in the request and the service's internal maximum number of items per page.
     */
    MaxResults?: MaxResults;
    /**
     * Opaque pagination token returned from a previous ListTagsForResource operation (String). If a token present, the action continues the list from where the returning call left off.
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceResponse {
    /**
     * A list of tags on the resource.
     */
    Tags?: Tags;
    /**
     * This is present if there are more tags than returned in the response (String). You can use the NextToken value in the later request to fetch the tags. 
     */
    NextToken?: NextToken;
  }
  export type LustreDeploymentType = "SCRATCH_1"|"SCRATCH_2"|"PERSISTENT_1"|string;
  export interface LustreFileSystemConfiguration {
    /**
     * The preferred start time to perform weekly maintenance, formatted d:HH:MM in the UTC time zone. d is the weekday number, from 1 through 7, beginning with Monday and ending with Sunday.
     */
    WeeklyMaintenanceStartTime?: WeeklyTime;
    DataRepositoryConfiguration?: DataRepositoryConfiguration;
    /**
     * The deployment type of the FSX for Lustre file system. Scratch deployment type is designed for temporary storage and shorter-term processing of data.  SCRATCH_1 and SCRATCH_2 deployment types are best suited for when you need temporary storage and shorter-term processing of data. The SCRATCH_2 deployment type provides in-transit encryption of data and higher burst throughput capacity than SCRATCH_1. The PERSISTENT_1 deployment type is used for longer-term storage and workloads and encryption of data in transit. To learn more about deployment types, see  FSx for Lustre Deployment Options. (Default = SCRATCH_1)
     */
    DeploymentType?: LustreDeploymentType;
    /**
     *  Per unit storage throughput represents the megabytes per second of read or write throughput per 1 tebibyte of storage provisioned. File system throughput capacity is equal to Storage capacity (TiB) * PerUnitStorageThroughput (MB/s/TiB). This option is only valid for PERSISTENT_1 deployment types.  Valid values for SSD storage: 50, 100, 200. Valid values for HDD storage: 12, 40. 
     */
    PerUnitStorageThroughput?: PerUnitStorageThroughput;
    /**
     * You use the MountName value when mounting the file system. For the SCRATCH_1 deployment type, this value is always "fsx". For SCRATCH_2 and PERSISTENT_1 deployment types, this value is a string that is unique within an Amazon Web Services Region. 
     */
    MountName?: LustreFileSystemMountName;
    DailyAutomaticBackupStartTime?: DailyTime;
    AutomaticBackupRetentionDays?: AutomaticBackupRetentionDays;
    /**
     * A boolean flag indicating whether tags on the file system should be copied to backups. If it's set to true, all tags on the file system are copied to all automatic backups and any user-initiated backups where the user doesn't specify any tags. If this value is true, and you specify one or more tags, only the specified tags are copied to backups. If you specify one or more tags when creating a user-initiated backup, no tags are copied from the file system, regardless of this value. (Default = false)
     */
    CopyTagsToBackups?: Flag;
    /**
     * The type of drive cache used by PERSISTENT_1 file systems that are provisioned with HDD storage devices. This parameter is required when storage type is HDD. Set to READ, improve the performance for frequently accessed files and allows 20% of the total storage capacity of the file system to be cached.  This parameter is required when StorageType is set to HDD.
     */
    DriveCacheType?: DriveCacheType;
    /**
     * The data compression configuration for the file system. DataCompressionType can have the following values:    NONE - Data compression is turned off for the file system.    LZ4 - Data compression is turned on with the LZ4 algorithm.   For more information, see Lustre data compression.
     */
    DataCompressionType?: DataCompressionType;
  }
  export type LustreFileSystemMountName = string;
  export type MaxResults = number;
  export type Megabytes = number;
  export type MegabytesPerSecond = number;
  export type NetBiosAlias = string;
  export type NetworkInterfaceId = string;
  export type NetworkInterfaceIds = NetworkInterfaceId[];
  export type NextToken = string;
  export type OntapDeploymentType = "MULTI_AZ_1"|string;
  export type OntapEndpointIpAddresses = IpAddress[];
  export interface OntapFileSystemConfiguration {
    AutomaticBackupRetentionDays?: AutomaticBackupRetentionDays;
    DailyAutomaticBackupStartTime?: DailyTime;
    /**
     * The ONTAP file system deployment type.
     */
    DeploymentType?: OntapDeploymentType;
    /**
     * The IP address range in which the endpoints to access your file system are created.
     */
    EndpointIpAddressRange?: IpAddressRange;
    /**
     * The Management and Intercluster endpoints that are used to access data or to manage the file system using the NetApp ONTAP CLI, REST API, or NetApp SnapMirror.
     */
    Endpoints?: FileSystemEndpoints;
    /**
     * The SSD IOPS configuration for the ONTAP file system, specifying the number of provisioned IOPS and the provision mode.
     */
    DiskIopsConfiguration?: DiskIopsConfiguration;
    PreferredSubnetId?: SubnetId;
    /**
     * The VPC route tables in which your file system's endpoints are created.
     */
    RouteTableIds?: RouteTableIds;
    ThroughputCapacity?: MegabytesPerSecond;
    WeeklyMaintenanceStartTime?: WeeklyTime;
  }
  export interface OntapVolumeConfiguration {
    /**
     * Specifies the FlexCache endpoint type of the volume. Valid values are the following:    NONE specifies that the volume doesn't have a FlexCache configuration. NONE is the default.    ORIGIN specifies that the volume is the origin volume for a FlexCache volume.    CACHE specifies that the volume is a FlexCache volume.  
     */
    FlexCacheEndpointType?: FlexCacheEndpointType;
    /**
     * Specifies the directory that NAS clients use to mount the volume, along with the SVM DNS name or IP address. You can create a JunctionPath directly below a parent volume junction or on a directory within a volume. A JunctionPath for a volume named vol3 might be /vol1/vol2/vol3, or /vol1/dir2/vol3, or even /dir1/dir2/vol3..
     */
    JunctionPath?: JunctionPath;
    /**
     * The security style for the volume, which can be UNIX, NTFS, or MIXED.
     */
    SecurityStyle?: SecurityStyle;
    /**
     * The configured size of the volume, in megabytes (MBs).
     */
    SizeInMegabytes?: VolumeCapacity;
    /**
     * The volume's storage efficiency setting.
     */
    StorageEfficiencyEnabled?: Flag;
    /**
     * The ID of the volume's storage virtual machine.
     */
    StorageVirtualMachineId?: StorageVirtualMachineId;
    /**
     * A boolean flag indicating whether this volume is the root volume for its storage virtual machine (SVM). Only one volume on an SVM can be the root volume. This value defaults to false. If this value is true, then this is the SVM root volume. This flag is useful when you're deleting an SVM, because you must first delete all non-root volumes. This flag, when set to false, helps you identify which volumes to delete before you can delete the SVM.
     */
    StorageVirtualMachineRoot?: Flag;
    /**
     * The volume's TieringPolicy setting.
     */
    TieringPolicy?: TieringPolicy;
    /**
     * The volume's UUID (universally unique identifier).
     */
    UUID?: UUID;
    /**
     * Specifies the type of volume. Valid values are the following:    RW specifies a read-write volume. RW is the default.    DP specifies a data protection volume. You can protect data by replicating it to data protection mirror copies and use data protection mirror copies to recover data when a disaster occurs.    LS specifies a load-sharing mirror volume. A load-sharing mirror reduces the network traffic to a FlexVol volume by providing additional read-only access to clients.  
     */
    OntapVolumeType?: OntapVolumeType;
  }
  export type OntapVolumeType = "RW"|"DP"|"LS"|string;
  export type OrganizationalUnitDistinguishedName = string;
  export type PerUnitStorageThroughput = number;
  export type ProgressPercent = number;
  export type Region = string;
  export type ReportFormat = "REPORT_CSV_20191124"|string;
  export type ReportScope = "FAILED_FILES_ONLY"|string;
  export type RequestTime = Date;
  export type ResourceARN = string;
  export type ResourceType = "FILE_SYSTEM"|"VOLUME"|string;
  export type RouteTableId = string;
  export type RouteTableIds = RouteTableId[];
  export type SecurityGroupId = string;
  export type SecurityGroupIds = SecurityGroupId[];
  export type SecurityStyle = "UNIX"|"NTFS"|"MIXED"|string;
  export interface SelfManagedActiveDirectoryAttributes {
    /**
     * The fully qualified domain name of the self-managed AD directory.
     */
    DomainName?: ActiveDirectoryFullyQualifiedName;
    /**
     * The fully qualified distinguished name of the organizational unit within the self-managed AD directory to which the Windows File Server or ONTAP storage virtual machine (SVM) instance is joined.
     */
    OrganizationalUnitDistinguishedName?: OrganizationalUnitDistinguishedName;
    /**
     * The name of the domain group whose members have administrative privileges for the FSx file system.
     */
    FileSystemAdministratorsGroup?: FileSystemAdministratorsGroupName;
    /**
     * The user name for the service account on your self-managed AD domain that FSx uses to join to your AD domain.
     */
    UserName?: DirectoryUserName;
    /**
     * A list of up to three IP addresses of DNS servers or domain controllers in the self-managed AD directory.
     */
    DnsIps?: DnsIps;
  }
  export interface SelfManagedActiveDirectoryConfiguration {
    /**
     * The fully qualified domain name of the self-managed AD directory, such as corp.example.com.
     */
    DomainName: ActiveDirectoryFullyQualifiedName;
    /**
     * (Optional) The fully qualified distinguished name of the organizational unit within your self-managed AD directory. Amazon FSx only accepts OU as the direct parent of the file system. An example is OU=FSx,DC=yourdomain,DC=corp,DC=com. To learn more, see RFC 2253. If none is provided, the FSx file system is created in the default location of your self-managed AD directory.   Only Organizational Unit (OU) objects can be the direct parent of the file system that you're creating. 
     */
    OrganizationalUnitDistinguishedName?: OrganizationalUnitDistinguishedName;
    /**
     * (Optional) The name of the domain group whose members are granted administrative privileges for the file system. Administrative privileges include taking ownership of files and folders, setting audit controls (audit ACLs) on files and folders, and administering the file system remotely by using the FSx Remote PowerShell. The group that you specify must already exist in your domain. If you don't provide one, your AD domain's Domain Admins group is used.
     */
    FileSystemAdministratorsGroup?: FileSystemAdministratorsGroupName;
    /**
     * The user name for the service account on your self-managed AD domain that Amazon FSx will use to join to your AD domain. This account must have the permission to join computers to the domain in the organizational unit provided in OrganizationalUnitDistinguishedName, or in the default location of your AD domain.
     */
    UserName: DirectoryUserName;
    /**
     * The password for the service account on your self-managed AD domain that Amazon FSx will use to join to your AD domain.
     */
    Password: DirectoryPassword;
    /**
     * A list of up to three IP addresses of DNS servers or domain controllers in the self-managed AD directory. 
     */
    DnsIps: DnsIps;
  }
  export interface SelfManagedActiveDirectoryConfigurationUpdates {
    /**
     * The user name for the service account on your self-managed AD domain that Amazon FSx will use to join to your AD domain. This account must have the permission to join computers to the domain in the organizational unit provided in OrganizationalUnitDistinguishedName.
     */
    UserName?: DirectoryUserName;
    /**
     * The password for the service account on your self-managed AD domain that Amazon FSx will use to join to your AD domain.
     */
    Password?: DirectoryPassword;
    /**
     * A list of up to three IP addresses of DNS servers or domain controllers in the self-managed AD directory.
     */
    DnsIps?: DnsIps;
  }
  export type SourceBackupId = string;
  export type StartTime = Date;
  export type Status = "FAILED"|"IN_PROGRESS"|"PENDING"|"COMPLETED"|"UPDATED_OPTIMIZING"|string;
  export type StorageCapacity = number;
  export type StorageType = "SSD"|"HDD"|string;
  export interface StorageVirtualMachine {
    /**
     * Describes the Microsoft Active Directory configuration to which the SVM is joined, if applicable.
     */
    ActiveDirectoryConfiguration?: SvmActiveDirectoryConfiguration;
    CreationTime?: CreationTime;
    /**
     * The endpoints that are used to access data or to manage the SVM using the NetApp ONTAP CLI, REST API, or NetApp CloudManager. They are the Iscsi, Management, Nfs, and Smb endpoints.
     */
    Endpoints?: SvmEndpoints;
    FileSystemId?: FileSystemId;
    /**
     * Describes the SVM's lifecycle status.    CREATED - The SVM is fully available for use.    CREATING - Amazon FSx is creating the new SVM.    DELETING - Amazon FSx is deleting an existing SVM.    FAILED - Amazon FSx was unable to create the SVM.    MISCONFIGURED - The SVM is in a failed but recoverable state.    PENDING - Amazon FSx has not started creating the SVM.  
     */
    Lifecycle?: StorageVirtualMachineLifecycle;
    /**
     * The name of the SVM, if provisioned.
     */
    Name?: StorageVirtualMachineName;
    ResourceARN?: ResourceARN;
    /**
     * The SVM's system generated unique ID.
     */
    StorageVirtualMachineId?: StorageVirtualMachineId;
    /**
     * Describes the SVM's subtype.
     */
    Subtype?: StorageVirtualMachineSubtype;
    /**
     * The SVM's UUID (universally unique identifier).
     */
    UUID?: UUID;
    Tags?: Tags;
    /**
     * Describes why the SVM lifecycle state changed.
     */
    LifecycleTransitionReason?: LifecycleTransitionReason;
    /**
     * The security style of the root volume of the SVM.
     */
    RootVolumeSecurityStyle?: StorageVirtualMachineRootVolumeSecurityStyle;
  }
  export interface StorageVirtualMachineFilter {
    /**
     * The name for this filter.
     */
    Name?: StorageVirtualMachineFilterName;
    /**
     * The values of the filter. These are all the values for any of the applied filters.
     */
    Values?: StorageVirtualMachineFilterValues;
  }
  export type StorageVirtualMachineFilterName = "file-system-id"|string;
  export type StorageVirtualMachineFilterValue = string;
  export type StorageVirtualMachineFilterValues = StorageVirtualMachineFilterValue[];
  export type StorageVirtualMachineFilters = StorageVirtualMachineFilter[];
  export type StorageVirtualMachineId = string;
  export type StorageVirtualMachineIds = StorageVirtualMachineId[];
  export type StorageVirtualMachineLifecycle = "CREATED"|"CREATING"|"DELETING"|"FAILED"|"MISCONFIGURED"|"PENDING"|string;
  export type StorageVirtualMachineName = string;
  export type StorageVirtualMachineRootVolumeSecurityStyle = "UNIX"|"NTFS"|"MIXED"|string;
  export type StorageVirtualMachineSubtype = "DEFAULT"|"DP_DESTINATION"|"SYNC_DESTINATION"|"SYNC_SOURCE"|string;
  export type StorageVirtualMachines = StorageVirtualMachine[];
  export type SubnetId = string;
  export type SubnetIds = SubnetId[];
  export type SucceededCount = number;
  export interface SvmActiveDirectoryConfiguration {
    /**
     * The NetBIOS name of the Active Directory computer object that is joined to your SVM.
     */
    NetBiosName?: NetBiosAlias;
    SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryAttributes;
  }
  export interface SvmEndpoint {
    DNSName?: DNSName;
    /**
     * The SVM endpoint's IP addresses.
     */
    IpAddresses?: OntapEndpointIpAddresses;
  }
  export interface SvmEndpoints {
    /**
     * An endpoint for connecting using the Internet Small Computer Systems Interface (iSCSI) protocol.
     */
    Iscsi?: SvmEndpoint;
    /**
     * An endpoint for managing SVMs using the NetApp ONTAP CLI, NetApp ONTAP API, or NetApp CloudManager.
     */
    Management?: SvmEndpoint;
    /**
     * An endpoint for connecting using the Network File System (NFS) protocol.
     */
    Nfs?: SvmEndpoint;
    /**
     * An endpoint for connecting using the Server Message Block (SMB) protocol.
     */
    Smb?: SvmEndpoint;
  }
  export interface Tag {
    /**
     * A value that specifies the TagKey, the name of the tag. Tag keys must be unique for the resource to which they are attached.
     */
    Key: TagKey;
    /**
     * A value that specifies the TagValue, the value assigned to the corresponding tag key. Tag values can be null and don't have to be unique in a tag set. For example, you can have a key-value pair in a tag set of finances : April and also of payroll : April.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) of the Amazon FSx resource that you want to tag.
     */
    ResourceARN: ResourceARN;
    /**
     * A list of tags for the resource. If a tag with a given key already exists, the value is replaced by the one specified in this parameter.
     */
    Tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = Tag[];
  export type TaskId = string;
  export type TaskIds = TaskId[];
  export interface TieringPolicy {
    /**
     * Specifies the number of days that user data in a volume must remain inactive before it is considered "cold" and moved to the capacity pool. Used with the AUTO and SNAPSHOT_ONLY tiering policies. Enter a whole number between 2 and 183. Default values are 31 days for AUTO and 2 days for SNAPSHOT_ONLY.
     */
    CoolingPeriod?: CoolingPeriod;
    /**
     * Specifies the tiering policy used to transition data. Default value is SNAPSHOT_ONLY.    SNAPSHOT_ONLY - moves cold snapshots to the capacity pool storage tier.    AUTO - moves cold user data and snapshots to the capacity pool storage tier based on your access patterns.    ALL - moves all user data blocks in both the active file system and Snapshot copies to the storage pool tier.    NONE - keeps a volume's data in the primary storage tier, preventing it from being moved to the capacity pool tier.  
     */
    Name?: TieringPolicyName;
  }
  export type TieringPolicyName = "SNAPSHOT_ONLY"|"AUTO"|"ALL"|"NONE"|string;
  export type TotalCount = number;
  export type UUID = string;
  export interface UntagResourceRequest {
    /**
     * The ARN of the Amazon FSx resource to untag.
     */
    ResourceARN: ResourceARN;
    /**
     * A list of keys of tags on the resource to untag. In case the tag key doesn't exist, the call will still succeed to be idempotent.
     */
    TagKeys: TagKeys;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateFileSystemLustreConfiguration {
    /**
     * (Optional) The preferred start time to perform weekly maintenance, formatted d:HH:MM in the UTC time zone. d is the weekday number, from 1 through 7, beginning with Monday and ending with Sunday.
     */
    WeeklyMaintenanceStartTime?: WeeklyTime;
    DailyAutomaticBackupStartTime?: DailyTime;
    AutomaticBackupRetentionDays?: AutomaticBackupRetentionDays;
    /**
     *  (Optional) When you create your file system, your existing S3 objects appear as file and directory listings. Use this property to choose how Amazon FSx keeps your file and directory listing up to date as you add or modify objects in your linked S3 bucket. AutoImportPolicy can have the following values:    NONE - (Default) AutoImport is off. Amazon FSx only updates file and directory listings from the linked S3 bucket when the file system is created. FSx does not update the file and directory listing for any new or changed objects after choosing this option.    NEW - AutoImport is on. Amazon FSx automatically imports directory listings of any new objects added to the linked S3 bucket that do not currently exist in the FSx file system.     NEW_CHANGED - AutoImport is on. Amazon FSx automatically imports file and directory listings of any new objects added to the S3 bucket and any existing objects that are changed in the S3 bucket after you choose this option.    For more information, see Automatically import updates from your S3 bucket.
     */
    AutoImportPolicy?: AutoImportPolicyType;
    /**
     * Sets the data compression configuration for the file system. DataCompressionType can have the following values:    NONE - Data compression is turned off for the file system.    LZ4 - Data compression is turned on with the LZ4 algorithm.   If you don't use DataCompressionType, the file system retains its current data compression configuration. For more information, see Lustre data compression.
     */
    DataCompressionType?: DataCompressionType;
  }
  export interface UpdateFileSystemOntapConfiguration {
    AutomaticBackupRetentionDays?: AutomaticBackupRetentionDays;
    DailyAutomaticBackupStartTime?: DailyTime;
    /**
     * The ONTAP administrative password for the fsxadmin user.
     */
    FsxAdminPassword?: AdminPassword;
    WeeklyMaintenanceStartTime?: WeeklyTime;
  }
  export interface UpdateFileSystemRequest {
    /**
     * Identifies the file system that you are updating.
     */
    FileSystemId: FileSystemId;
    /**
     * A string of up to 64 ASCII characters that Amazon FSx uses to ensure idempotent updates. This string is automatically filled on your behalf when you use the Command Line Interface (CLI) or an Amazon Web Services SDK.
     */
    ClientRequestToken?: ClientRequestToken;
    /**
     * Use this parameter to increase the storage capacity of an Amazon FSx for Windows File Server or Amazon FSx for Lustre file system. Specifies the storage capacity target value, GiB, to increase the storage capacity for the file system that you're updating. You cannot make a storage capacity increase request if there is an existing storage capacity increase request in progress. For Windows file systems, the storage capacity target value must be at least 10 percent (%) greater than the current storage capacity value. In order to increase storage capacity, the file system must have at least 16 MB/s of throughput capacity. For Lustre file systems, the storage capacity target value can be the following:   For SCRATCH_2 and PERSISTENT_1 SSD deployment types, valid values are in multiples of 2400 GiB. The value must be greater than the current storage capacity.   For PERSISTENT HDD file systems, valid values are multiples of 6000 GiB for 12 MB/s/TiB file systems and multiples of 1800 GiB for 40 MB/s/TiB file systems. The values must be greater than the current storage capacity.   For SCRATCH_1 file systems, you cannot increase the storage capacity.   For more information, see Managing storage capacity in the Amazon FSx for Windows File Server User Guide and Managing storage and throughput capacity in the Amazon FSx for Lustre User Guide.
     */
    StorageCapacity?: StorageCapacity;
    /**
     * The configuration updates for an Amazon FSx for Windows File Server file system.
     */
    WindowsConfiguration?: UpdateFileSystemWindowsConfiguration;
    LustreConfiguration?: UpdateFileSystemLustreConfiguration;
    OntapConfiguration?: UpdateFileSystemOntapConfiguration;
  }
  export interface UpdateFileSystemResponse {
    /**
     * A description of the file system that was updated.
     */
    FileSystem?: FileSystem;
  }
  export interface UpdateFileSystemWindowsConfiguration {
    /**
     * The preferred start time to perform weekly maintenance, formatted d:HH:MM in the UTC time zone. Where d is the weekday number, from 1 through 7, with 1 = Monday and 7 = Sunday.
     */
    WeeklyMaintenanceStartTime?: WeeklyTime;
    /**
     * The preferred time to start the daily automatic backup, in the UTC time zone, for example, 02:00 
     */
    DailyAutomaticBackupStartTime?: DailyTime;
    /**
     * The number of days to retain automatic daily backups. Setting this to zero (0) disables automatic daily backups. You can retain automatic daily backups for a maximum of 90 days. For more information, see Working with Automatic Daily Backups.
     */
    AutomaticBackupRetentionDays?: AutomaticBackupRetentionDays;
    /**
     * Sets the target value for a file system's throughput capacity, in MB/s, that you are updating the file system to. Valid values are 8, 16, 32, 64, 128, 256, 512, 1024, 2048. You cannot make a throughput capacity update request if there is an existing throughput capacity update request in progress. For more information, see Managing Throughput Capacity.
     */
    ThroughputCapacity?: MegabytesPerSecond;
    /**
     * The configuration Amazon FSx uses to join the Windows File Server instance to the self-managed Microsoft AD directory. You cannot make a self-managed Microsoft AD update request if there is an existing self-managed Microsoft AD update request in progress.
     */
    SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryConfigurationUpdates;
    /**
     * The configuration that Amazon FSx for Windows File Server uses to audit and log user accesses of files, folders, and file shares on the Amazon FSx for Windows File Server file system..
     */
    AuditLogConfiguration?: WindowsAuditLogCreateConfiguration;
  }
  export interface UpdateOntapVolumeConfiguration {
    /**
     * Specifies the location in the SVM's namespace where the volume is mounted. The JunctionPath must have a leading forward slash, such as /vol3.
     */
    JunctionPath?: JunctionPath;
    /**
     * The security style for the volume, which can be UNIX. NTFS, or MIXED.
     */
    SecurityStyle?: SecurityStyle;
    /**
     * Specifies the size of the volume in megabytes.
     */
    SizeInMegabytes?: VolumeCapacity;
    /**
     * Default is false. Set to true to enable the deduplication, compression, and compaction storage efficiency features on the volume.
     */
    StorageEfficiencyEnabled?: Flag;
    /**
     * Update the volume's data tiering policy.
     */
    TieringPolicy?: TieringPolicy;
  }
  export interface UpdateStorageVirtualMachineRequest {
    /**
     * Updates the Microsoft Active Directory (AD) configuration for an SVM that is joined to an AD.
     */
    ActiveDirectoryConfiguration?: UpdateSvmActiveDirectoryConfiguration;
    ClientRequestToken?: ClientRequestToken;
    /**
     * The ID of the SVM that you want to update, in the format svm-0123456789abcdef0.
     */
    StorageVirtualMachineId: StorageVirtualMachineId;
    /**
     * Enter a new SvmAdminPassword if you are updating it.
     */
    SvmAdminPassword?: AdminPassword;
  }
  export interface UpdateStorageVirtualMachineResponse {
    StorageVirtualMachine?: StorageVirtualMachine;
  }
  export interface UpdateSvmActiveDirectoryConfiguration {
    SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryConfigurationUpdates;
  }
  export interface UpdateVolumeRequest {
    ClientRequestToken?: ClientRequestToken;
    /**
     * Specifies the volume that you want to update, formatted fsvol-0123456789abcdef0.
     */
    VolumeId: VolumeId;
    /**
     * The ONTAP configuration of the volume you are updating.
     */
    OntapConfiguration?: UpdateOntapVolumeConfiguration;
  }
  export interface UpdateVolumeResponse {
    /**
     * Returned after a successful UpdateVolume API operation, describing the volume just updated.
     */
    Volume?: Volume;
  }
  export interface Volume {
    CreationTime?: CreationTime;
    FileSystemId?: FileSystemId;
    /**
     * The lifecycle status of the volume.    CREATED - The volume is fully available for use.    CREATING - Amazon FSx is creating the new volume.    DELETING - Amazon FSx is deleting an existing volume.    FAILED - Amazon FSx was unable to create the volume.    MISCONFIGURED - The volume is in a failed but recoverable state.    PENDING - Amazon FSx has not started creating the volume.  
     */
    Lifecycle?: VolumeLifecycle;
    /**
     * The name of the volume.
     */
    Name?: VolumeName;
    OntapConfiguration?: OntapVolumeConfiguration;
    ResourceARN?: ResourceARN;
    Tags?: Tags;
    /**
     * The system-generated, unique ID of the volume.
     */
    VolumeId?: VolumeId;
    /**
     * The type of volume; ONTAP is the only valid volume type.
     */
    VolumeType?: VolumeType;
    /**
     * Describes why the volume lifecycle state changed.
     */
    LifecycleTransitionReason?: LifecycleTransitionReason;
  }
  export type VolumeCapacity = number;
  export interface VolumeFilter {
    /**
     * The name for this filter.
     */
    Name?: VolumeFilterName;
    /**
     * The values of the filter. These are all the values for any of the applied filters.
     */
    Values?: VolumeFilterValues;
  }
  export type VolumeFilterName = "file-system-id"|"storage-virtual-machine-id"|string;
  export type VolumeFilterValue = string;
  export type VolumeFilterValues = VolumeFilterValue[];
  export type VolumeFilters = VolumeFilter[];
  export type VolumeId = string;
  export type VolumeIds = VolumeId[];
  export type VolumeLifecycle = "CREATING"|"CREATED"|"DELETING"|"FAILED"|"MISCONFIGURED"|"PENDING"|string;
  export type VolumeName = string;
  export type VolumeType = "ONTAP"|string;
  export type Volumes = Volume[];
  export type VpcId = string;
  export type WeeklyTime = string;
  export type WindowsAccessAuditLogLevel = "DISABLED"|"SUCCESS_ONLY"|"FAILURE_ONLY"|"SUCCESS_AND_FAILURE"|string;
  export interface WindowsAuditLogConfiguration {
    /**
     * Sets which attempt type is logged by Amazon FSx for file and folder accesses.    SUCCESS_ONLY - only successful attempts to access files or folders are logged.    FAILURE_ONLY - only failed attempts to access files or folders are logged.    SUCCESS_AND_FAILURE - both successful attempts and failed attempts to access files or folders are logged.    DISABLED - access auditing of files and folders is turned off.  
     */
    FileAccessAuditLogLevel: WindowsAccessAuditLogLevel;
    /**
     * Sets which attempt type is logged by Amazon FSx for file share accesses.    SUCCESS_ONLY - only successful attempts to access file shares are logged.    FAILURE_ONLY - only failed attempts to access file shares are logged.    SUCCESS_AND_FAILURE - both successful attempts and failed attempts to access file shares are logged.    DISABLED - access auditing of file shares is turned off.  
     */
    FileShareAccessAuditLogLevel: WindowsAccessAuditLogLevel;
    /**
     * The Amazon Resource Name (ARN) for the destination of the audit logs. The destination can be any Amazon CloudWatch Logs log group ARN or Amazon Kinesis Data Firehose delivery stream ARN. The name of the Amazon CloudWatch Logs log group must begin with the /aws/fsx prefix. The name of the Amazon Kinesis Data Firehouse delivery stream must begin with the aws-fsx prefix. The destination ARN (either CloudWatch Logs log group or Kinesis Data Firehose delivery stream) must be in the same Amazon Web Services partition, Amazon Web Services Region, and Amazon Web Services account as your Amazon FSx file system.
     */
    AuditLogDestination?: GeneralARN;
  }
  export interface WindowsAuditLogCreateConfiguration {
    /**
     * Sets which attempt type is logged by Amazon FSx for file and folder accesses.    SUCCESS_ONLY - only successful attempts to access files or folders are logged.    FAILURE_ONLY - only failed attempts to access files or folders are logged.    SUCCESS_AND_FAILURE - both successful attempts and failed attempts to access files or folders are logged.    DISABLED - access auditing of files and folders is turned off.  
     */
    FileAccessAuditLogLevel: WindowsAccessAuditLogLevel;
    /**
     * Sets which attempt type is logged by Amazon FSx for file share accesses.    SUCCESS_ONLY - only successful attempts to access file shares are logged.    FAILURE_ONLY - only failed attempts to access file shares are logged.    SUCCESS_AND_FAILURE - both successful attempts and failed attempts to access file shares are logged.    DISABLED - access auditing of file shares is turned off.  
     */
    FileShareAccessAuditLogLevel: WindowsAccessAuditLogLevel;
    /**
     * The Amazon Resource Name (ARN) that specifies the destination of the audit logs. The destination can be any Amazon CloudWatch Logs log group ARN or Amazon Kinesis Data Firehose delivery stream ARN, with the following requirements:   The destination ARN that you provide (either CloudWatch Logs log group or Kinesis Data Firehose delivery stream) must be in the same Amazon Web Services partition, Amazon Web Services Region, and Amazon Web Services account as your Amazon FSx file system.   The name of the Amazon CloudWatch Logs log group must begin with the /aws/fsx prefix. The name of the Amazon Kinesis Data Firehouse delivery stream must begin with the aws-fsx prefix.   If you do not provide a destination in AuditLogDestination, Amazon FSx will create and use a log stream in the CloudWatch Logs /aws/fsx/windows log group.   If AuditLogDestination is provided and the resource does not exist, the request will fail with a BadRequest error.   If FileAccessAuditLogLevel and FileShareAccessAuditLogLevel are both set to DISABLED, you cannot specify a destination in AuditLogDestination.  
     */
    AuditLogDestination?: GeneralARN;
  }
  export type WindowsDeploymentType = "MULTI_AZ_1"|"SINGLE_AZ_1"|"SINGLE_AZ_2"|string;
  export interface WindowsFileSystemConfiguration {
    /**
     * The ID for an existing Amazon Web Services Managed Microsoft Active Directory instance that the file system is joined to.
     */
    ActiveDirectoryId?: DirectoryId;
    SelfManagedActiveDirectoryConfiguration?: SelfManagedActiveDirectoryAttributes;
    /**
     * Specifies the file system deployment type, valid values are the following:    MULTI_AZ_1 - Specifies a high availability file system that is configured for Multi-AZ redundancy to tolerate temporary Availability Zone (AZ) unavailability, and supports SSD and HDD storage.    SINGLE_AZ_1 - (Default) Specifies a file system that is configured for single AZ redundancy, only supports SSD storage.    SINGLE_AZ_2 - Latest generation Single AZ file system. Specifies a file system that is configured for single AZ redundancy and supports SSD and HDD storage.   For more information, see Single-AZ and Multi-AZ File Systems.
     */
    DeploymentType?: WindowsDeploymentType;
    /**
     * For MULTI_AZ_1 deployment types, use this endpoint when performing administrative tasks on the file system using Amazon FSx Remote PowerShell. For SINGLE_AZ_1 and SINGLE_AZ_2 deployment types, this is the DNS name of the file system. This endpoint is temporarily unavailable when the file system is undergoing maintenance.
     */
    RemoteAdministrationEndpoint?: DNSName;
    /**
     * For MULTI_AZ_1 deployment types, it specifies the ID of the subnet where the preferred file server is located. Must be one of the two subnet IDs specified in SubnetIds property. Amazon FSx serves traffic from this subnet except in the event of a failover to the secondary file server. For SINGLE_AZ_1 and SINGLE_AZ_2 deployment types, this value is the same as that for SubnetIDs. For more information, see Availability and durability: Single-AZ and Multi-AZ file systems.
     */
    PreferredSubnetId?: SubnetId;
    /**
     * For MULTI_AZ_1 deployment types, the IP address of the primary, or preferred, file server. Use this IP address when mounting the file system on Linux SMB clients or Windows SMB clients that are not joined to a Microsoft Active Directory. Applicable for all Windows file system deployment types. This IP address is temporarily unavailable when the file system is undergoing maintenance. For Linux and Windows SMB clients that are joined to an Active Directory, use the file system's DNSName instead. For more information on mapping and mounting file shares, see Accessing File Shares.
     */
    PreferredFileServerIp?: IpAddress;
    /**
     * The throughput of the Amazon FSx file system, measured in megabytes per second.
     */
    ThroughputCapacity?: MegabytesPerSecond;
    /**
     * The list of maintenance operations in progress for this file system.
     */
    MaintenanceOperationsInProgress?: FileSystemMaintenanceOperations;
    /**
     * The preferred start time to perform weekly maintenance, formatted d:HH:MM in the UTC time zone. d is the weekday number, from 1 through 7, beginning with Monday and ending with Sunday.
     */
    WeeklyMaintenanceStartTime?: WeeklyTime;
    /**
     * The preferred time to take daily automatic backups, in the UTC time zone.
     */
    DailyAutomaticBackupStartTime?: DailyTime;
    /**
     * The number of days to retain automatic backups. Setting this to 0 disables automatic backups. You can retain automatic backups for a maximum of 90 days.
     */
    AutomaticBackupRetentionDays?: AutomaticBackupRetentionDays;
    /**
     * A boolean flag indicating whether tags on the file system should be copied to backups. This value defaults to false. If it's set to true, all tags on the file system are copied to all automatic backups and any user-initiated backups where the user doesn't specify any tags. If this value is true, and you specify one or more tags, only the specified tags are copied to backups. If you specify one or more tags when creating a user-initiated backup, no tags are copied from the file system, regardless of this value.
     */
    CopyTagsToBackups?: Flag;
    Aliases?: Aliases;
    /**
     * The configuration that Amazon FSx for Windows File Server uses to audit and log user accesses of files, folders, and file shares on the Amazon FSx for Windows File Server file system.
     */
    AuditLogConfiguration?: WindowsAuditLogConfiguration;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-03-01"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the FSx client.
   */
  export import Types = FSx;
}
export = FSx;
