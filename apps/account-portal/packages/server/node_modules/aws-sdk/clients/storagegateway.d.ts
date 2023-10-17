import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class StorageGateway extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: StorageGateway.Types.ClientConfiguration)
  config: Config & StorageGateway.Types.ClientConfiguration;
  /**
   * Activates the gateway you previously deployed on your host. In the activation process, you specify information such as the Amazon Web Services Region that you want to use for storing snapshots or tapes, the time zone for scheduled snapshots the gateway snapshot schedule window, an activation key, and a name for your gateway. The activation process also associates your gateway with your account. For more information, see UpdateGatewayInformation.  You must turn on the gateway VM before you can activate your gateway. 
   */
  activateGateway(params: StorageGateway.Types.ActivateGatewayInput, callback?: (err: AWSError, data: StorageGateway.Types.ActivateGatewayOutput) => void): Request<StorageGateway.Types.ActivateGatewayOutput, AWSError>;
  /**
   * Activates the gateway you previously deployed on your host. In the activation process, you specify information such as the Amazon Web Services Region that you want to use for storing snapshots or tapes, the time zone for scheduled snapshots the gateway snapshot schedule window, an activation key, and a name for your gateway. The activation process also associates your gateway with your account. For more information, see UpdateGatewayInformation.  You must turn on the gateway VM before you can activate your gateway. 
   */
  activateGateway(callback?: (err: AWSError, data: StorageGateway.Types.ActivateGatewayOutput) => void): Request<StorageGateway.Types.ActivateGatewayOutput, AWSError>;
  /**
   * Configures one or more gateway local disks as cache for a gateway. This operation is only supported in the cached volume, tape, and file gateway type (see How Storage Gateway works (architecture). In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to add cache, and one or more disk IDs that you want to configure as cache.
   */
  addCache(params: StorageGateway.Types.AddCacheInput, callback?: (err: AWSError, data: StorageGateway.Types.AddCacheOutput) => void): Request<StorageGateway.Types.AddCacheOutput, AWSError>;
  /**
   * Configures one or more gateway local disks as cache for a gateway. This operation is only supported in the cached volume, tape, and file gateway type (see How Storage Gateway works (architecture). In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to add cache, and one or more disk IDs that you want to configure as cache.
   */
  addCache(callback?: (err: AWSError, data: StorageGateway.Types.AddCacheOutput) => void): Request<StorageGateway.Types.AddCacheOutput, AWSError>;
  /**
   * Adds one or more tags to the specified resource. You use tags to add metadata to resources, which you can use to categorize these resources. For example, you can categorize resources by purpose, owner, environment, or team. Each tag consists of a key and a value, which you define. You can add tags to the following Storage Gateway resources:   Storage gateways of all types   Storage volumes   Virtual tapes   NFS and SMB file shares   File System associations   You can create a maximum of 50 tags for each resource. Virtual tapes and storage volumes that are recovered to a new gateway maintain their tags.
   */
  addTagsToResource(params: StorageGateway.Types.AddTagsToResourceInput, callback?: (err: AWSError, data: StorageGateway.Types.AddTagsToResourceOutput) => void): Request<StorageGateway.Types.AddTagsToResourceOutput, AWSError>;
  /**
   * Adds one or more tags to the specified resource. You use tags to add metadata to resources, which you can use to categorize these resources. For example, you can categorize resources by purpose, owner, environment, or team. Each tag consists of a key and a value, which you define. You can add tags to the following Storage Gateway resources:   Storage gateways of all types   Storage volumes   Virtual tapes   NFS and SMB file shares   File System associations   You can create a maximum of 50 tags for each resource. Virtual tapes and storage volumes that are recovered to a new gateway maintain their tags.
   */
  addTagsToResource(callback?: (err: AWSError, data: StorageGateway.Types.AddTagsToResourceOutput) => void): Request<StorageGateway.Types.AddTagsToResourceOutput, AWSError>;
  /**
   * Configures one or more gateway local disks as upload buffer for a specified gateway. This operation is supported for the stored volume, cached volume, and tape gateway types. In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to add upload buffer, and one or more disk IDs that you want to configure as upload buffer.
   */
  addUploadBuffer(params: StorageGateway.Types.AddUploadBufferInput, callback?: (err: AWSError, data: StorageGateway.Types.AddUploadBufferOutput) => void): Request<StorageGateway.Types.AddUploadBufferOutput, AWSError>;
  /**
   * Configures one or more gateway local disks as upload buffer for a specified gateway. This operation is supported for the stored volume, cached volume, and tape gateway types. In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to add upload buffer, and one or more disk IDs that you want to configure as upload buffer.
   */
  addUploadBuffer(callback?: (err: AWSError, data: StorageGateway.Types.AddUploadBufferOutput) => void): Request<StorageGateway.Types.AddUploadBufferOutput, AWSError>;
  /**
   * Configures one or more gateway local disks as working storage for a gateway. This operation is only supported in the stored volume gateway type. This operation is deprecated in cached volume API version 20120630. Use AddUploadBuffer instead.  Working storage is also referred to as upload buffer. You can also use the AddUploadBuffer operation to add upload buffer to a stored volume gateway.  In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to add working storage, and one or more disk IDs that you want to configure as working storage.
   */
  addWorkingStorage(params: StorageGateway.Types.AddWorkingStorageInput, callback?: (err: AWSError, data: StorageGateway.Types.AddWorkingStorageOutput) => void): Request<StorageGateway.Types.AddWorkingStorageOutput, AWSError>;
  /**
   * Configures one or more gateway local disks as working storage for a gateway. This operation is only supported in the stored volume gateway type. This operation is deprecated in cached volume API version 20120630. Use AddUploadBuffer instead.  Working storage is also referred to as upload buffer. You can also use the AddUploadBuffer operation to add upload buffer to a stored volume gateway.  In the request, you specify the gateway Amazon Resource Name (ARN) to which you want to add working storage, and one or more disk IDs that you want to configure as working storage.
   */
  addWorkingStorage(callback?: (err: AWSError, data: StorageGateway.Types.AddWorkingStorageOutput) => void): Request<StorageGateway.Types.AddWorkingStorageOutput, AWSError>;
  /**
   * Assigns a tape to a tape pool for archiving. The tape assigned to a pool is archived in the S3 storage class that is associated with the pool. When you use your backup application to eject the tape, the tape is archived directly into the S3 storage class (S3 Glacier or S3 Glacier Deep Archive) that corresponds to the pool.
   */
  assignTapePool(params: StorageGateway.Types.AssignTapePoolInput, callback?: (err: AWSError, data: StorageGateway.Types.AssignTapePoolOutput) => void): Request<StorageGateway.Types.AssignTapePoolOutput, AWSError>;
  /**
   * Assigns a tape to a tape pool for archiving. The tape assigned to a pool is archived in the S3 storage class that is associated with the pool. When you use your backup application to eject the tape, the tape is archived directly into the S3 storage class (S3 Glacier or S3 Glacier Deep Archive) that corresponds to the pool.
   */
  assignTapePool(callback?: (err: AWSError, data: StorageGateway.Types.AssignTapePoolOutput) => void): Request<StorageGateway.Types.AssignTapePoolOutput, AWSError>;
  /**
   * Associate an Amazon FSx file system with the FSx File Gateway. After the association process is complete, the file shares on the Amazon FSx file system are available for access through the gateway. This operation only supports the FSx File Gateway type.
   */
  associateFileSystem(params: StorageGateway.Types.AssociateFileSystemInput, callback?: (err: AWSError, data: StorageGateway.Types.AssociateFileSystemOutput) => void): Request<StorageGateway.Types.AssociateFileSystemOutput, AWSError>;
  /**
   * Associate an Amazon FSx file system with the FSx File Gateway. After the association process is complete, the file shares on the Amazon FSx file system are available for access through the gateway. This operation only supports the FSx File Gateway type.
   */
  associateFileSystem(callback?: (err: AWSError, data: StorageGateway.Types.AssociateFileSystemOutput) => void): Request<StorageGateway.Types.AssociateFileSystemOutput, AWSError>;
  /**
   * Connects a volume to an iSCSI connection and then attaches the volume to the specified gateway. Detaching and attaching a volume enables you to recover your data from one gateway to a different gateway without creating a snapshot. It also makes it easier to move your volumes from an on-premises gateway to a gateway hosted on an Amazon EC2 instance.
   */
  attachVolume(params: StorageGateway.Types.AttachVolumeInput, callback?: (err: AWSError, data: StorageGateway.Types.AttachVolumeOutput) => void): Request<StorageGateway.Types.AttachVolumeOutput, AWSError>;
  /**
   * Connects a volume to an iSCSI connection and then attaches the volume to the specified gateway. Detaching and attaching a volume enables you to recover your data from one gateway to a different gateway without creating a snapshot. It also makes it easier to move your volumes from an on-premises gateway to a gateway hosted on an Amazon EC2 instance.
   */
  attachVolume(callback?: (err: AWSError, data: StorageGateway.Types.AttachVolumeOutput) => void): Request<StorageGateway.Types.AttachVolumeOutput, AWSError>;
  /**
   * Cancels archiving of a virtual tape to the virtual tape shelf (VTS) after the archiving process is initiated. This operation is only supported in the tape gateway type.
   */
  cancelArchival(params: StorageGateway.Types.CancelArchivalInput, callback?: (err: AWSError, data: StorageGateway.Types.CancelArchivalOutput) => void): Request<StorageGateway.Types.CancelArchivalOutput, AWSError>;
  /**
   * Cancels archiving of a virtual tape to the virtual tape shelf (VTS) after the archiving process is initiated. This operation is only supported in the tape gateway type.
   */
  cancelArchival(callback?: (err: AWSError, data: StorageGateway.Types.CancelArchivalOutput) => void): Request<StorageGateway.Types.CancelArchivalOutput, AWSError>;
  /**
   * Cancels retrieval of a virtual tape from the virtual tape shelf (VTS) to a gateway after the retrieval process is initiated. The virtual tape is returned to the VTS. This operation is only supported in the tape gateway type.
   */
  cancelRetrieval(params: StorageGateway.Types.CancelRetrievalInput, callback?: (err: AWSError, data: StorageGateway.Types.CancelRetrievalOutput) => void): Request<StorageGateway.Types.CancelRetrievalOutput, AWSError>;
  /**
   * Cancels retrieval of a virtual tape from the virtual tape shelf (VTS) to a gateway after the retrieval process is initiated. The virtual tape is returned to the VTS. This operation is only supported in the tape gateway type.
   */
  cancelRetrieval(callback?: (err: AWSError, data: StorageGateway.Types.CancelRetrievalOutput) => void): Request<StorageGateway.Types.CancelRetrievalOutput, AWSError>;
  /**
   * Creates a cached volume on a specified cached volume gateway. This operation is only supported in the cached volume gateway type.  Cache storage must be allocated to the gateway before you can create a cached volume. Use the AddCache operation to add cache storage to a gateway.  In the request, you must specify the gateway, size of the volume in bytes, the iSCSI target name, an IP address on which to expose the target, and a unique client token. In response, the gateway creates the volume and returns information about it. This information includes the volume Amazon Resource Name (ARN), its size, and the iSCSI target ARN that initiators can use to connect to the volume target. Optionally, you can provide the ARN for an existing volume as the SourceVolumeARN for this cached volume, which creates an exact copy of the existing volume’s latest recovery point. The VolumeSizeInBytes value must be equal to or larger than the size of the copied volume, in bytes.
   */
  createCachediSCSIVolume(params: StorageGateway.Types.CreateCachediSCSIVolumeInput, callback?: (err: AWSError, data: StorageGateway.Types.CreateCachediSCSIVolumeOutput) => void): Request<StorageGateway.Types.CreateCachediSCSIVolumeOutput, AWSError>;
  /**
   * Creates a cached volume on a specified cached volume gateway. This operation is only supported in the cached volume gateway type.  Cache storage must be allocated to the gateway before you can create a cached volume. Use the AddCache operation to add cache storage to a gateway.  In the request, you must specify the gateway, size of the volume in bytes, the iSCSI target name, an IP address on which to expose the target, and a unique client token. In response, the gateway creates the volume and returns information about it. This information includes the volume Amazon Resource Name (ARN), its size, and the iSCSI target ARN that initiators can use to connect to the volume target. Optionally, you can provide the ARN for an existing volume as the SourceVolumeARN for this cached volume, which creates an exact copy of the existing volume’s latest recovery point. The VolumeSizeInBytes value must be equal to or larger than the size of the copied volume, in bytes.
   */
  createCachediSCSIVolume(callback?: (err: AWSError, data: StorageGateway.Types.CreateCachediSCSIVolumeOutput) => void): Request<StorageGateway.Types.CreateCachediSCSIVolumeOutput, AWSError>;
  /**
   * Creates a Network File System (NFS) file share on an existing S3 File Gateway. In Storage Gateway, a file share is a file system mount point backed by Amazon S3 cloud storage. Storage Gateway exposes file shares using an NFS interface. This operation is only supported for S3 File Gateways.  S3 File gateway requires Security Token Service (Amazon Web Services STS) to be activated to enable you to create a file share. Make sure Amazon Web Services STS is activated in the Amazon Web Services Region you are creating your S3 File Gateway in. If Amazon Web Services STS is not activated in the Amazon Web Services Region, activate it. For information about how to activate Amazon Web Services STS, see Activating and deactivating Amazon Web Services STS in an Amazon Web Services Region in the Identity and Access Management User Guide. S3 File Gateways do not support creating hard or symbolic links on a file share. 
   */
  createNFSFileShare(params: StorageGateway.Types.CreateNFSFileShareInput, callback?: (err: AWSError, data: StorageGateway.Types.CreateNFSFileShareOutput) => void): Request<StorageGateway.Types.CreateNFSFileShareOutput, AWSError>;
  /**
   * Creates a Network File System (NFS) file share on an existing S3 File Gateway. In Storage Gateway, a file share is a file system mount point backed by Amazon S3 cloud storage. Storage Gateway exposes file shares using an NFS interface. This operation is only supported for S3 File Gateways.  S3 File gateway requires Security Token Service (Amazon Web Services STS) to be activated to enable you to create a file share. Make sure Amazon Web Services STS is activated in the Amazon Web Services Region you are creating your S3 File Gateway in. If Amazon Web Services STS is not activated in the Amazon Web Services Region, activate it. For information about how to activate Amazon Web Services STS, see Activating and deactivating Amazon Web Services STS in an Amazon Web Services Region in the Identity and Access Management User Guide. S3 File Gateways do not support creating hard or symbolic links on a file share. 
   */
  createNFSFileShare(callback?: (err: AWSError, data: StorageGateway.Types.CreateNFSFileShareOutput) => void): Request<StorageGateway.Types.CreateNFSFileShareOutput, AWSError>;
  /**
   * Creates a Server Message Block (SMB) file share on an existing S3 File Gateway. In Storage Gateway, a file share is a file system mount point backed by Amazon S3 cloud storage. Storage Gateway exposes file shares using an SMB interface. This operation is only supported for S3 File Gateways.  S3 File Gateways require Security Token Service (Amazon Web Services STS) to be activated to enable you to create a file share. Make sure that Amazon Web Services STS is activated in the Amazon Web Services Region you are creating your S3 File Gateway in. If Amazon Web Services STS is not activated in this Amazon Web Services Region, activate it. For information about how to activate Amazon Web Services STS, see Activating and deactivating Amazon Web Services STS in an Amazon Web Services Region in the Identity and Access Management User Guide. File gateways don't support creating hard or symbolic links on a file share. 
   */
  createSMBFileShare(params: StorageGateway.Types.CreateSMBFileShareInput, callback?: (err: AWSError, data: StorageGateway.Types.CreateSMBFileShareOutput) => void): Request<StorageGateway.Types.CreateSMBFileShareOutput, AWSError>;
  /**
   * Creates a Server Message Block (SMB) file share on an existing S3 File Gateway. In Storage Gateway, a file share is a file system mount point backed by Amazon S3 cloud storage. Storage Gateway exposes file shares using an SMB interface. This operation is only supported for S3 File Gateways.  S3 File Gateways require Security Token Service (Amazon Web Services STS) to be activated to enable you to create a file share. Make sure that Amazon Web Services STS is activated in the Amazon Web Services Region you are creating your S3 File Gateway in. If Amazon Web Services STS is not activated in this Amazon Web Services Region, activate it. For information about how to activate Amazon Web Services STS, see Activating and deactivating Amazon Web Services STS in an Amazon Web Services Region in the Identity and Access Management User Guide. File gateways don't support creating hard or symbolic links on a file share. 
   */
  createSMBFileShare(callback?: (err: AWSError, data: StorageGateway.Types.CreateSMBFileShareOutput) => void): Request<StorageGateway.Types.CreateSMBFileShareOutput, AWSError>;
  /**
   * Initiates a snapshot of a volume. Storage Gateway provides the ability to back up point-in-time snapshots of your data to Amazon Simple Storage (Amazon S3) for durable off-site recovery, and also import the data to an Amazon Elastic Block Store (EBS) volume in Amazon Elastic Compute Cloud (EC2). You can take snapshots of your gateway volume on a scheduled or ad hoc basis. This API enables you to take an ad hoc snapshot. For more information, see Editing a snapshot schedule. In the CreateSnapshot request, you identify the volume by providing its Amazon Resource Name (ARN). You must also provide description for the snapshot. When Storage Gateway takes the snapshot of specified volume, the snapshot and description appears in the Storage Gateway console. In response, Storage Gateway returns you a snapshot ID. You can use this snapshot ID to check the snapshot progress or later use it when you want to create a volume from a snapshot. This operation is only supported in stored and cached volume gateway type.  To list or delete a snapshot, you must use the Amazon EC2 API. For more information, see DescribeSnapshots or DeleteSnapshot in the Amazon Elastic Compute Cloud API Reference.   Volume and snapshot IDs are changing to a longer length ID format. For more information, see the important note on the Welcome page. 
   */
  createSnapshot(params: StorageGateway.Types.CreateSnapshotInput, callback?: (err: AWSError, data: StorageGateway.Types.CreateSnapshotOutput) => void): Request<StorageGateway.Types.CreateSnapshotOutput, AWSError>;
  /**
   * Initiates a snapshot of a volume. Storage Gateway provides the ability to back up point-in-time snapshots of your data to Amazon Simple Storage (Amazon S3) for durable off-site recovery, and also import the data to an Amazon Elastic Block Store (EBS) volume in Amazon Elastic Compute Cloud (EC2). You can take snapshots of your gateway volume on a scheduled or ad hoc basis. This API enables you to take an ad hoc snapshot. For more information, see Editing a snapshot schedule. In the CreateSnapshot request, you identify the volume by providing its Amazon Resource Name (ARN). You must also provide description for the snapshot. When Storage Gateway takes the snapshot of specified volume, the snapshot and description appears in the Storage Gateway console. In response, Storage Gateway returns you a snapshot ID. You can use this snapshot ID to check the snapshot progress or later use it when you want to create a volume from a snapshot. This operation is only supported in stored and cached volume gateway type.  To list or delete a snapshot, you must use the Amazon EC2 API. For more information, see DescribeSnapshots or DeleteSnapshot in the Amazon Elastic Compute Cloud API Reference.   Volume and snapshot IDs are changing to a longer length ID format. For more information, see the important note on the Welcome page. 
   */
  createSnapshot(callback?: (err: AWSError, data: StorageGateway.Types.CreateSnapshotOutput) => void): Request<StorageGateway.Types.CreateSnapshotOutput, AWSError>;
  /**
   * Initiates a snapshot of a gateway from a volume recovery point. This operation is only supported in the cached volume gateway type. A volume recovery point is a point in time at which all data of the volume is consistent and from which you can create a snapshot. To get a list of volume recovery point for cached volume gateway, use ListVolumeRecoveryPoints. In the CreateSnapshotFromVolumeRecoveryPoint request, you identify the volume by providing its Amazon Resource Name (ARN). You must also provide a description for the snapshot. When the gateway takes a snapshot of the specified volume, the snapshot and its description appear in the Storage Gateway console. In response, the gateway returns you a snapshot ID. You can use this snapshot ID to check the snapshot progress or later use it when you want to create a volume from a snapshot.  To list or delete a snapshot, you must use the Amazon EC2 API. For more information, see DescribeSnapshots or DeleteSnapshot in the Amazon Elastic Compute Cloud API Reference. 
   */
  createSnapshotFromVolumeRecoveryPoint(params: StorageGateway.Types.CreateSnapshotFromVolumeRecoveryPointInput, callback?: (err: AWSError, data: StorageGateway.Types.CreateSnapshotFromVolumeRecoveryPointOutput) => void): Request<StorageGateway.Types.CreateSnapshotFromVolumeRecoveryPointOutput, AWSError>;
  /**
   * Initiates a snapshot of a gateway from a volume recovery point. This operation is only supported in the cached volume gateway type. A volume recovery point is a point in time at which all data of the volume is consistent and from which you can create a snapshot. To get a list of volume recovery point for cached volume gateway, use ListVolumeRecoveryPoints. In the CreateSnapshotFromVolumeRecoveryPoint request, you identify the volume by providing its Amazon Resource Name (ARN). You must also provide a description for the snapshot. When the gateway takes a snapshot of the specified volume, the snapshot and its description appear in the Storage Gateway console. In response, the gateway returns you a snapshot ID. You can use this snapshot ID to check the snapshot progress or later use it when you want to create a volume from a snapshot.  To list or delete a snapshot, you must use the Amazon EC2 API. For more information, see DescribeSnapshots or DeleteSnapshot in the Amazon Elastic Compute Cloud API Reference. 
   */
  createSnapshotFromVolumeRecoveryPoint(callback?: (err: AWSError, data: StorageGateway.Types.CreateSnapshotFromVolumeRecoveryPointOutput) => void): Request<StorageGateway.Types.CreateSnapshotFromVolumeRecoveryPointOutput, AWSError>;
  /**
   * Creates a volume on a specified gateway. This operation is only supported in the stored volume gateway type. The size of the volume to create is inferred from the disk size. You can choose to preserve existing data on the disk, create volume from an existing snapshot, or create an empty volume. If you choose to create an empty gateway volume, then any existing data on the disk is erased. In the request, you must specify the gateway and the disk information on which you are creating the volume. In response, the gateway creates the volume and returns volume information such as the volume Amazon Resource Name (ARN), its size, and the iSCSI target ARN that initiators can use to connect to the volume target.
   */
  createStorediSCSIVolume(params: StorageGateway.Types.CreateStorediSCSIVolumeInput, callback?: (err: AWSError, data: StorageGateway.Types.CreateStorediSCSIVolumeOutput) => void): Request<StorageGateway.Types.CreateStorediSCSIVolumeOutput, AWSError>;
  /**
   * Creates a volume on a specified gateway. This operation is only supported in the stored volume gateway type. The size of the volume to create is inferred from the disk size. You can choose to preserve existing data on the disk, create volume from an existing snapshot, or create an empty volume. If you choose to create an empty gateway volume, then any existing data on the disk is erased. In the request, you must specify the gateway and the disk information on which you are creating the volume. In response, the gateway creates the volume and returns volume information such as the volume Amazon Resource Name (ARN), its size, and the iSCSI target ARN that initiators can use to connect to the volume target.
   */
  createStorediSCSIVolume(callback?: (err: AWSError, data: StorageGateway.Types.CreateStorediSCSIVolumeOutput) => void): Request<StorageGateway.Types.CreateStorediSCSIVolumeOutput, AWSError>;
  /**
   * Creates a new custom tape pool. You can use custom tape pool to enable tape retention lock on tapes that are archived in the custom pool.
   */
  createTapePool(params: StorageGateway.Types.CreateTapePoolInput, callback?: (err: AWSError, data: StorageGateway.Types.CreateTapePoolOutput) => void): Request<StorageGateway.Types.CreateTapePoolOutput, AWSError>;
  /**
   * Creates a new custom tape pool. You can use custom tape pool to enable tape retention lock on tapes that are archived in the custom pool.
   */
  createTapePool(callback?: (err: AWSError, data: StorageGateway.Types.CreateTapePoolOutput) => void): Request<StorageGateway.Types.CreateTapePoolOutput, AWSError>;
  /**
   * Creates a virtual tape by using your own barcode. You write data to the virtual tape and then archive the tape. A barcode is unique and cannot be reused if it has already been used on a tape. This applies to barcodes used on deleted tapes. This operation is only supported in the tape gateway type.  Cache storage must be allocated to the gateway before you can create a virtual tape. Use the AddCache operation to add cache storage to a gateway. 
   */
  createTapeWithBarcode(params: StorageGateway.Types.CreateTapeWithBarcodeInput, callback?: (err: AWSError, data: StorageGateway.Types.CreateTapeWithBarcodeOutput) => void): Request<StorageGateway.Types.CreateTapeWithBarcodeOutput, AWSError>;
  /**
   * Creates a virtual tape by using your own barcode. You write data to the virtual tape and then archive the tape. A barcode is unique and cannot be reused if it has already been used on a tape. This applies to barcodes used on deleted tapes. This operation is only supported in the tape gateway type.  Cache storage must be allocated to the gateway before you can create a virtual tape. Use the AddCache operation to add cache storage to a gateway. 
   */
  createTapeWithBarcode(callback?: (err: AWSError, data: StorageGateway.Types.CreateTapeWithBarcodeOutput) => void): Request<StorageGateway.Types.CreateTapeWithBarcodeOutput, AWSError>;
  /**
   * Creates one or more virtual tapes. You write data to the virtual tapes and then archive the tapes. This operation is only supported in the tape gateway type.  Cache storage must be allocated to the gateway before you can create virtual tapes. Use the AddCache operation to add cache storage to a gateway. 
   */
  createTapes(params: StorageGateway.Types.CreateTapesInput, callback?: (err: AWSError, data: StorageGateway.Types.CreateTapesOutput) => void): Request<StorageGateway.Types.CreateTapesOutput, AWSError>;
  /**
   * Creates one or more virtual tapes. You write data to the virtual tapes and then archive the tapes. This operation is only supported in the tape gateway type.  Cache storage must be allocated to the gateway before you can create virtual tapes. Use the AddCache operation to add cache storage to a gateway. 
   */
  createTapes(callback?: (err: AWSError, data: StorageGateway.Types.CreateTapesOutput) => void): Request<StorageGateway.Types.CreateTapesOutput, AWSError>;
  /**
   * Deletes the automatic tape creation policy of a gateway. If you delete this policy, new virtual tapes must be created manually. Use the Amazon Resource Name (ARN) of the gateway in your request to remove the policy.
   */
  deleteAutomaticTapeCreationPolicy(params: StorageGateway.Types.DeleteAutomaticTapeCreationPolicyInput, callback?: (err: AWSError, data: StorageGateway.Types.DeleteAutomaticTapeCreationPolicyOutput) => void): Request<StorageGateway.Types.DeleteAutomaticTapeCreationPolicyOutput, AWSError>;
  /**
   * Deletes the automatic tape creation policy of a gateway. If you delete this policy, new virtual tapes must be created manually. Use the Amazon Resource Name (ARN) of the gateway in your request to remove the policy.
   */
  deleteAutomaticTapeCreationPolicy(callback?: (err: AWSError, data: StorageGateway.Types.DeleteAutomaticTapeCreationPolicyOutput) => void): Request<StorageGateway.Types.DeleteAutomaticTapeCreationPolicyOutput, AWSError>;
  /**
   * Deletes the bandwidth rate limits of a gateway. You can delete either the upload and download bandwidth rate limit, or you can delete both. If you delete only one of the limits, the other limit remains unchanged. To specify which gateway to work with, use the Amazon Resource Name (ARN) of the gateway in your request. This operation is supported only for the stored volume, cached volume, and tape gateway types.
   */
  deleteBandwidthRateLimit(params: StorageGateway.Types.DeleteBandwidthRateLimitInput, callback?: (err: AWSError, data: StorageGateway.Types.DeleteBandwidthRateLimitOutput) => void): Request<StorageGateway.Types.DeleteBandwidthRateLimitOutput, AWSError>;
  /**
   * Deletes the bandwidth rate limits of a gateway. You can delete either the upload and download bandwidth rate limit, or you can delete both. If you delete only one of the limits, the other limit remains unchanged. To specify which gateway to work with, use the Amazon Resource Name (ARN) of the gateway in your request. This operation is supported only for the stored volume, cached volume, and tape gateway types.
   */
  deleteBandwidthRateLimit(callback?: (err: AWSError, data: StorageGateway.Types.DeleteBandwidthRateLimitOutput) => void): Request<StorageGateway.Types.DeleteBandwidthRateLimitOutput, AWSError>;
  /**
   * Deletes Challenge-Handshake Authentication Protocol (CHAP) credentials for a specified iSCSI target and initiator pair. This operation is supported in volume and tape gateway types.
   */
  deleteChapCredentials(params: StorageGateway.Types.DeleteChapCredentialsInput, callback?: (err: AWSError, data: StorageGateway.Types.DeleteChapCredentialsOutput) => void): Request<StorageGateway.Types.DeleteChapCredentialsOutput, AWSError>;
  /**
   * Deletes Challenge-Handshake Authentication Protocol (CHAP) credentials for a specified iSCSI target and initiator pair. This operation is supported in volume and tape gateway types.
   */
  deleteChapCredentials(callback?: (err: AWSError, data: StorageGateway.Types.DeleteChapCredentialsOutput) => void): Request<StorageGateway.Types.DeleteChapCredentialsOutput, AWSError>;
  /**
   * Deletes a file share from an S3 File Gateway. This operation is only supported for S3 File Gateways.
   */
  deleteFileShare(params: StorageGateway.Types.DeleteFileShareInput, callback?: (err: AWSError, data: StorageGateway.Types.DeleteFileShareOutput) => void): Request<StorageGateway.Types.DeleteFileShareOutput, AWSError>;
  /**
   * Deletes a file share from an S3 File Gateway. This operation is only supported for S3 File Gateways.
   */
  deleteFileShare(callback?: (err: AWSError, data: StorageGateway.Types.DeleteFileShareOutput) => void): Request<StorageGateway.Types.DeleteFileShareOutput, AWSError>;
  /**
   * Deletes a gateway. To specify which gateway to delete, use the Amazon Resource Name (ARN) of the gateway in your request. The operation deletes the gateway; however, it does not delete the gateway virtual machine (VM) from your host computer. After you delete a gateway, you cannot reactivate it. Completed snapshots of the gateway volumes are not deleted upon deleting the gateway, however, pending snapshots will not complete. After you delete a gateway, your next step is to remove it from your environment.  You no longer pay software charges after the gateway is deleted; however, your existing Amazon EBS snapshots persist and you will continue to be billed for these snapshots. You can choose to remove all remaining Amazon EBS snapshots by canceling your Amazon EC2 subscription.  If you prefer not to cancel your Amazon EC2 subscription, you can delete your snapshots using the Amazon EC2 console. For more information, see the Storage Gateway detail page. 
   */
  deleteGateway(params: StorageGateway.Types.DeleteGatewayInput, callback?: (err: AWSError, data: StorageGateway.Types.DeleteGatewayOutput) => void): Request<StorageGateway.Types.DeleteGatewayOutput, AWSError>;
  /**
   * Deletes a gateway. To specify which gateway to delete, use the Amazon Resource Name (ARN) of the gateway in your request. The operation deletes the gateway; however, it does not delete the gateway virtual machine (VM) from your host computer. After you delete a gateway, you cannot reactivate it. Completed snapshots of the gateway volumes are not deleted upon deleting the gateway, however, pending snapshots will not complete. After you delete a gateway, your next step is to remove it from your environment.  You no longer pay software charges after the gateway is deleted; however, your existing Amazon EBS snapshots persist and you will continue to be billed for these snapshots. You can choose to remove all remaining Amazon EBS snapshots by canceling your Amazon EC2 subscription.  If you prefer not to cancel your Amazon EC2 subscription, you can delete your snapshots using the Amazon EC2 console. For more information, see the Storage Gateway detail page. 
   */
  deleteGateway(callback?: (err: AWSError, data: StorageGateway.Types.DeleteGatewayOutput) => void): Request<StorageGateway.Types.DeleteGatewayOutput, AWSError>;
  /**
   * Deletes a snapshot of a volume. You can take snapshots of your gateway volumes on a scheduled or ad hoc basis. This API action enables you to delete a snapshot schedule for a volume. For more information, see Backing up your volumes. In the DeleteSnapshotSchedule request, you identify the volume by providing its Amazon Resource Name (ARN). This operation is only supported for cached volume gateway types.  To list or delete a snapshot, you must use the Amazon EC2 API. For more information, go to DescribeSnapshots in the Amazon Elastic Compute Cloud API Reference. 
   */
  deleteSnapshotSchedule(params: StorageGateway.Types.DeleteSnapshotScheduleInput, callback?: (err: AWSError, data: StorageGateway.Types.DeleteSnapshotScheduleOutput) => void): Request<StorageGateway.Types.DeleteSnapshotScheduleOutput, AWSError>;
  /**
   * Deletes a snapshot of a volume. You can take snapshots of your gateway volumes on a scheduled or ad hoc basis. This API action enables you to delete a snapshot schedule for a volume. For more information, see Backing up your volumes. In the DeleteSnapshotSchedule request, you identify the volume by providing its Amazon Resource Name (ARN). This operation is only supported for cached volume gateway types.  To list or delete a snapshot, you must use the Amazon EC2 API. For more information, go to DescribeSnapshots in the Amazon Elastic Compute Cloud API Reference. 
   */
  deleteSnapshotSchedule(callback?: (err: AWSError, data: StorageGateway.Types.DeleteSnapshotScheduleOutput) => void): Request<StorageGateway.Types.DeleteSnapshotScheduleOutput, AWSError>;
  /**
   * Deletes the specified virtual tape. This operation is only supported in the tape gateway type.
   */
  deleteTape(params: StorageGateway.Types.DeleteTapeInput, callback?: (err: AWSError, data: StorageGateway.Types.DeleteTapeOutput) => void): Request<StorageGateway.Types.DeleteTapeOutput, AWSError>;
  /**
   * Deletes the specified virtual tape. This operation is only supported in the tape gateway type.
   */
  deleteTape(callback?: (err: AWSError, data: StorageGateway.Types.DeleteTapeOutput) => void): Request<StorageGateway.Types.DeleteTapeOutput, AWSError>;
  /**
   * Deletes the specified virtual tape from the virtual tape shelf (VTS). This operation is only supported in the tape gateway type.
   */
  deleteTapeArchive(params: StorageGateway.Types.DeleteTapeArchiveInput, callback?: (err: AWSError, data: StorageGateway.Types.DeleteTapeArchiveOutput) => void): Request<StorageGateway.Types.DeleteTapeArchiveOutput, AWSError>;
  /**
   * Deletes the specified virtual tape from the virtual tape shelf (VTS). This operation is only supported in the tape gateway type.
   */
  deleteTapeArchive(callback?: (err: AWSError, data: StorageGateway.Types.DeleteTapeArchiveOutput) => void): Request<StorageGateway.Types.DeleteTapeArchiveOutput, AWSError>;
  /**
   * Delete a custom tape pool. A custom tape pool can only be deleted if there are no tapes in the pool and if there are no automatic tape creation policies that reference the custom tape pool.
   */
  deleteTapePool(params: StorageGateway.Types.DeleteTapePoolInput, callback?: (err: AWSError, data: StorageGateway.Types.DeleteTapePoolOutput) => void): Request<StorageGateway.Types.DeleteTapePoolOutput, AWSError>;
  /**
   * Delete a custom tape pool. A custom tape pool can only be deleted if there are no tapes in the pool and if there are no automatic tape creation policies that reference the custom tape pool.
   */
  deleteTapePool(callback?: (err: AWSError, data: StorageGateway.Types.DeleteTapePoolOutput) => void): Request<StorageGateway.Types.DeleteTapePoolOutput, AWSError>;
  /**
   * Deletes the specified storage volume that you previously created using the CreateCachediSCSIVolume or CreateStorediSCSIVolume API. This operation is only supported in the cached volume and stored volume types. For stored volume gateways, the local disk that was configured as the storage volume is not deleted. You can reuse the local disk to create another storage volume. Before you delete a volume, make sure there are no iSCSI connections to the volume you are deleting. You should also make sure there is no snapshot in progress. You can use the Amazon Elastic Compute Cloud (Amazon EC2) API to query snapshots on the volume you are deleting and check the snapshot status. For more information, go to DescribeSnapshots in the Amazon Elastic Compute Cloud API Reference. In the request, you must provide the Amazon Resource Name (ARN) of the storage volume you want to delete.
   */
  deleteVolume(params: StorageGateway.Types.DeleteVolumeInput, callback?: (err: AWSError, data: StorageGateway.Types.DeleteVolumeOutput) => void): Request<StorageGateway.Types.DeleteVolumeOutput, AWSError>;
  /**
   * Deletes the specified storage volume that you previously created using the CreateCachediSCSIVolume or CreateStorediSCSIVolume API. This operation is only supported in the cached volume and stored volume types. For stored volume gateways, the local disk that was configured as the storage volume is not deleted. You can reuse the local disk to create another storage volume. Before you delete a volume, make sure there are no iSCSI connections to the volume you are deleting. You should also make sure there is no snapshot in progress. You can use the Amazon Elastic Compute Cloud (Amazon EC2) API to query snapshots on the volume you are deleting and check the snapshot status. For more information, go to DescribeSnapshots in the Amazon Elastic Compute Cloud API Reference. In the request, you must provide the Amazon Resource Name (ARN) of the storage volume you want to delete.
   */
  deleteVolume(callback?: (err: AWSError, data: StorageGateway.Types.DeleteVolumeOutput) => void): Request<StorageGateway.Types.DeleteVolumeOutput, AWSError>;
  /**
   * Returns information about the most recent high availability monitoring test that was performed on the host in a cluster. If a test isn't performed, the status and start time in the response would be null.
   */
  describeAvailabilityMonitorTest(params: StorageGateway.Types.DescribeAvailabilityMonitorTestInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeAvailabilityMonitorTestOutput) => void): Request<StorageGateway.Types.DescribeAvailabilityMonitorTestOutput, AWSError>;
  /**
   * Returns information about the most recent high availability monitoring test that was performed on the host in a cluster. If a test isn't performed, the status and start time in the response would be null.
   */
  describeAvailabilityMonitorTest(callback?: (err: AWSError, data: StorageGateway.Types.DescribeAvailabilityMonitorTestOutput) => void): Request<StorageGateway.Types.DescribeAvailabilityMonitorTestOutput, AWSError>;
  /**
   * Returns the bandwidth rate limits of a gateway. By default, these limits are not set, which means no bandwidth rate limiting is in effect. This operation is supported only for the stored volume, cached volume, and tape gateway types. To describe bandwidth rate limits for S3 file gateways, use DescribeBandwidthRateLimitSchedule. This operation returns a value for a bandwidth rate limit only if the limit is set. If no limits are set for the gateway, then this operation returns only the gateway ARN in the response body. To specify which gateway to describe, use the Amazon Resource Name (ARN) of the gateway in your request.
   */
  describeBandwidthRateLimit(params: StorageGateway.Types.DescribeBandwidthRateLimitInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeBandwidthRateLimitOutput) => void): Request<StorageGateway.Types.DescribeBandwidthRateLimitOutput, AWSError>;
  /**
   * Returns the bandwidth rate limits of a gateway. By default, these limits are not set, which means no bandwidth rate limiting is in effect. This operation is supported only for the stored volume, cached volume, and tape gateway types. To describe bandwidth rate limits for S3 file gateways, use DescribeBandwidthRateLimitSchedule. This operation returns a value for a bandwidth rate limit only if the limit is set. If no limits are set for the gateway, then this operation returns only the gateway ARN in the response body. To specify which gateway to describe, use the Amazon Resource Name (ARN) of the gateway in your request.
   */
  describeBandwidthRateLimit(callback?: (err: AWSError, data: StorageGateway.Types.DescribeBandwidthRateLimitOutput) => void): Request<StorageGateway.Types.DescribeBandwidthRateLimitOutput, AWSError>;
  /**
   *  Returns information about the bandwidth rate limit schedule of a gateway. By default, gateways do not have bandwidth rate limit schedules, which means no bandwidth rate limiting is in effect. This operation is supported only for volume, tape and S3 file gateways. FSx file gateways do not support bandwidth rate limits. This operation returns information about a gateway's bandwidth rate limit schedule. A bandwidth rate limit schedule consists of one or more bandwidth rate limit intervals. A bandwidth rate limit interval defines a period of time on one or more days of the week, during which bandwidth rate limits are specified for uploading, downloading, or both.   A bandwidth rate limit interval consists of one or more days of the week, a start hour and minute, an ending hour and minute, and bandwidth rate limits for uploading and downloading   If no bandwidth rate limit schedule intervals are set for the gateway, this operation returns an empty response. To specify which gateway to describe, use the Amazon Resource Name (ARN) of the gateway in your request.
   */
  describeBandwidthRateLimitSchedule(params: StorageGateway.Types.DescribeBandwidthRateLimitScheduleInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeBandwidthRateLimitScheduleOutput) => void): Request<StorageGateway.Types.DescribeBandwidthRateLimitScheduleOutput, AWSError>;
  /**
   *  Returns information about the bandwidth rate limit schedule of a gateway. By default, gateways do not have bandwidth rate limit schedules, which means no bandwidth rate limiting is in effect. This operation is supported only for volume, tape and S3 file gateways. FSx file gateways do not support bandwidth rate limits. This operation returns information about a gateway's bandwidth rate limit schedule. A bandwidth rate limit schedule consists of one or more bandwidth rate limit intervals. A bandwidth rate limit interval defines a period of time on one or more days of the week, during which bandwidth rate limits are specified for uploading, downloading, or both.   A bandwidth rate limit interval consists of one or more days of the week, a start hour and minute, an ending hour and minute, and bandwidth rate limits for uploading and downloading   If no bandwidth rate limit schedule intervals are set for the gateway, this operation returns an empty response. To specify which gateway to describe, use the Amazon Resource Name (ARN) of the gateway in your request.
   */
  describeBandwidthRateLimitSchedule(callback?: (err: AWSError, data: StorageGateway.Types.DescribeBandwidthRateLimitScheduleOutput) => void): Request<StorageGateway.Types.DescribeBandwidthRateLimitScheduleOutput, AWSError>;
  /**
   * Returns information about the cache of a gateway. This operation is only supported in the cached volume, tape, and file gateway types. The response includes disk IDs that are configured as cache, and it includes the amount of cache allocated and used.
   */
  describeCache(params: StorageGateway.Types.DescribeCacheInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeCacheOutput) => void): Request<StorageGateway.Types.DescribeCacheOutput, AWSError>;
  /**
   * Returns information about the cache of a gateway. This operation is only supported in the cached volume, tape, and file gateway types. The response includes disk IDs that are configured as cache, and it includes the amount of cache allocated and used.
   */
  describeCache(callback?: (err: AWSError, data: StorageGateway.Types.DescribeCacheOutput) => void): Request<StorageGateway.Types.DescribeCacheOutput, AWSError>;
  /**
   * Returns a description of the gateway volumes specified in the request. This operation is only supported in the cached volume gateway types. The list of gateway volumes in the request must be from one gateway. In the response, Storage Gateway returns volume information sorted by volume Amazon Resource Name (ARN).
   */
  describeCachediSCSIVolumes(params: StorageGateway.Types.DescribeCachediSCSIVolumesInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeCachediSCSIVolumesOutput) => void): Request<StorageGateway.Types.DescribeCachediSCSIVolumesOutput, AWSError>;
  /**
   * Returns a description of the gateway volumes specified in the request. This operation is only supported in the cached volume gateway types. The list of gateway volumes in the request must be from one gateway. In the response, Storage Gateway returns volume information sorted by volume Amazon Resource Name (ARN).
   */
  describeCachediSCSIVolumes(callback?: (err: AWSError, data: StorageGateway.Types.DescribeCachediSCSIVolumesOutput) => void): Request<StorageGateway.Types.DescribeCachediSCSIVolumesOutput, AWSError>;
  /**
   * Returns an array of Challenge-Handshake Authentication Protocol (CHAP) credentials information for a specified iSCSI target, one for each target-initiator pair. This operation is supported in the volume and tape gateway types.
   */
  describeChapCredentials(params: StorageGateway.Types.DescribeChapCredentialsInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeChapCredentialsOutput) => void): Request<StorageGateway.Types.DescribeChapCredentialsOutput, AWSError>;
  /**
   * Returns an array of Challenge-Handshake Authentication Protocol (CHAP) credentials information for a specified iSCSI target, one for each target-initiator pair. This operation is supported in the volume and tape gateway types.
   */
  describeChapCredentials(callback?: (err: AWSError, data: StorageGateway.Types.DescribeChapCredentialsOutput) => void): Request<StorageGateway.Types.DescribeChapCredentialsOutput, AWSError>;
  /**
   * Gets the file system association information. This operation is only supported for FSx File Gateways.
   */
  describeFileSystemAssociations(params: StorageGateway.Types.DescribeFileSystemAssociationsInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeFileSystemAssociationsOutput) => void): Request<StorageGateway.Types.DescribeFileSystemAssociationsOutput, AWSError>;
  /**
   * Gets the file system association information. This operation is only supported for FSx File Gateways.
   */
  describeFileSystemAssociations(callback?: (err: AWSError, data: StorageGateway.Types.DescribeFileSystemAssociationsOutput) => void): Request<StorageGateway.Types.DescribeFileSystemAssociationsOutput, AWSError>;
  /**
   * Returns metadata about a gateway such as its name, network interfaces, time zone, status, and software version. To specify which gateway to describe, use the Amazon Resource Name (ARN) of the gateway in your request.
   */
  describeGatewayInformation(params: StorageGateway.Types.DescribeGatewayInformationInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeGatewayInformationOutput) => void): Request<StorageGateway.Types.DescribeGatewayInformationOutput, AWSError>;
  /**
   * Returns metadata about a gateway such as its name, network interfaces, time zone, status, and software version. To specify which gateway to describe, use the Amazon Resource Name (ARN) of the gateway in your request.
   */
  describeGatewayInformation(callback?: (err: AWSError, data: StorageGateway.Types.DescribeGatewayInformationOutput) => void): Request<StorageGateway.Types.DescribeGatewayInformationOutput, AWSError>;
  /**
   * Returns your gateway's weekly maintenance start time including the day and time of the week. Note that values are in terms of the gateway's time zone.
   */
  describeMaintenanceStartTime(params: StorageGateway.Types.DescribeMaintenanceStartTimeInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeMaintenanceStartTimeOutput) => void): Request<StorageGateway.Types.DescribeMaintenanceStartTimeOutput, AWSError>;
  /**
   * Returns your gateway's weekly maintenance start time including the day and time of the week. Note that values are in terms of the gateway's time zone.
   */
  describeMaintenanceStartTime(callback?: (err: AWSError, data: StorageGateway.Types.DescribeMaintenanceStartTimeOutput) => void): Request<StorageGateway.Types.DescribeMaintenanceStartTimeOutput, AWSError>;
  /**
   * Gets a description for one or more Network File System (NFS) file shares from an S3 File Gateway. This operation is only supported for S3 File Gateways.
   */
  describeNFSFileShares(params: StorageGateway.Types.DescribeNFSFileSharesInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeNFSFileSharesOutput) => void): Request<StorageGateway.Types.DescribeNFSFileSharesOutput, AWSError>;
  /**
   * Gets a description for one or more Network File System (NFS) file shares from an S3 File Gateway. This operation is only supported for S3 File Gateways.
   */
  describeNFSFileShares(callback?: (err: AWSError, data: StorageGateway.Types.DescribeNFSFileSharesOutput) => void): Request<StorageGateway.Types.DescribeNFSFileSharesOutput, AWSError>;
  /**
   * Gets a description for one or more Server Message Block (SMB) file shares from a S3 File Gateway. This operation is only supported for S3 File Gateways.
   */
  describeSMBFileShares(params: StorageGateway.Types.DescribeSMBFileSharesInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeSMBFileSharesOutput) => void): Request<StorageGateway.Types.DescribeSMBFileSharesOutput, AWSError>;
  /**
   * Gets a description for one or more Server Message Block (SMB) file shares from a S3 File Gateway. This operation is only supported for S3 File Gateways.
   */
  describeSMBFileShares(callback?: (err: AWSError, data: StorageGateway.Types.DescribeSMBFileSharesOutput) => void): Request<StorageGateway.Types.DescribeSMBFileSharesOutput, AWSError>;
  /**
   * Gets a description of a Server Message Block (SMB) file share settings from a file gateway. This operation is only supported for file gateways.
   */
  describeSMBSettings(params: StorageGateway.Types.DescribeSMBSettingsInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeSMBSettingsOutput) => void): Request<StorageGateway.Types.DescribeSMBSettingsOutput, AWSError>;
  /**
   * Gets a description of a Server Message Block (SMB) file share settings from a file gateway. This operation is only supported for file gateways.
   */
  describeSMBSettings(callback?: (err: AWSError, data: StorageGateway.Types.DescribeSMBSettingsOutput) => void): Request<StorageGateway.Types.DescribeSMBSettingsOutput, AWSError>;
  /**
   * Describes the snapshot schedule for the specified gateway volume. The snapshot schedule information includes intervals at which snapshots are automatically initiated on the volume. This operation is only supported in the cached volume and stored volume types.
   */
  describeSnapshotSchedule(params: StorageGateway.Types.DescribeSnapshotScheduleInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeSnapshotScheduleOutput) => void): Request<StorageGateway.Types.DescribeSnapshotScheduleOutput, AWSError>;
  /**
   * Describes the snapshot schedule for the specified gateway volume. The snapshot schedule information includes intervals at which snapshots are automatically initiated on the volume. This operation is only supported in the cached volume and stored volume types.
   */
  describeSnapshotSchedule(callback?: (err: AWSError, data: StorageGateway.Types.DescribeSnapshotScheduleOutput) => void): Request<StorageGateway.Types.DescribeSnapshotScheduleOutput, AWSError>;
  /**
   * Returns the description of the gateway volumes specified in the request. The list of gateway volumes in the request must be from one gateway. In the response, Storage Gateway returns volume information sorted by volume ARNs. This operation is only supported in stored volume gateway type.
   */
  describeStorediSCSIVolumes(params: StorageGateway.Types.DescribeStorediSCSIVolumesInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeStorediSCSIVolumesOutput) => void): Request<StorageGateway.Types.DescribeStorediSCSIVolumesOutput, AWSError>;
  /**
   * Returns the description of the gateway volumes specified in the request. The list of gateway volumes in the request must be from one gateway. In the response, Storage Gateway returns volume information sorted by volume ARNs. This operation is only supported in stored volume gateway type.
   */
  describeStorediSCSIVolumes(callback?: (err: AWSError, data: StorageGateway.Types.DescribeStorediSCSIVolumesOutput) => void): Request<StorageGateway.Types.DescribeStorediSCSIVolumesOutput, AWSError>;
  /**
   * Returns a description of specified virtual tapes in the virtual tape shelf (VTS). This operation is only supported in the tape gateway type. If a specific TapeARN is not specified, Storage Gateway returns a description of all virtual tapes found in the VTS associated with your account.
   */
  describeTapeArchives(params: StorageGateway.Types.DescribeTapeArchivesInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeTapeArchivesOutput) => void): Request<StorageGateway.Types.DescribeTapeArchivesOutput, AWSError>;
  /**
   * Returns a description of specified virtual tapes in the virtual tape shelf (VTS). This operation is only supported in the tape gateway type. If a specific TapeARN is not specified, Storage Gateway returns a description of all virtual tapes found in the VTS associated with your account.
   */
  describeTapeArchives(callback?: (err: AWSError, data: StorageGateway.Types.DescribeTapeArchivesOutput) => void): Request<StorageGateway.Types.DescribeTapeArchivesOutput, AWSError>;
  /**
   * Returns a list of virtual tape recovery points that are available for the specified tape gateway. A recovery point is a point-in-time view of a virtual tape at which all the data on the virtual tape is consistent. If your gateway crashes, virtual tapes that have recovery points can be recovered to a new gateway. This operation is only supported in the tape gateway type.
   */
  describeTapeRecoveryPoints(params: StorageGateway.Types.DescribeTapeRecoveryPointsInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeTapeRecoveryPointsOutput) => void): Request<StorageGateway.Types.DescribeTapeRecoveryPointsOutput, AWSError>;
  /**
   * Returns a list of virtual tape recovery points that are available for the specified tape gateway. A recovery point is a point-in-time view of a virtual tape at which all the data on the virtual tape is consistent. If your gateway crashes, virtual tapes that have recovery points can be recovered to a new gateway. This operation is only supported in the tape gateway type.
   */
  describeTapeRecoveryPoints(callback?: (err: AWSError, data: StorageGateway.Types.DescribeTapeRecoveryPointsOutput) => void): Request<StorageGateway.Types.DescribeTapeRecoveryPointsOutput, AWSError>;
  /**
   * Returns a description of the specified Amazon Resource Name (ARN) of virtual tapes. If a TapeARN is not specified, returns a description of all virtual tapes associated with the specified gateway. This operation is only supported in the tape gateway type.
   */
  describeTapes(params: StorageGateway.Types.DescribeTapesInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeTapesOutput) => void): Request<StorageGateway.Types.DescribeTapesOutput, AWSError>;
  /**
   * Returns a description of the specified Amazon Resource Name (ARN) of virtual tapes. If a TapeARN is not specified, returns a description of all virtual tapes associated with the specified gateway. This operation is only supported in the tape gateway type.
   */
  describeTapes(callback?: (err: AWSError, data: StorageGateway.Types.DescribeTapesOutput) => void): Request<StorageGateway.Types.DescribeTapesOutput, AWSError>;
  /**
   * Returns information about the upload buffer of a gateway. This operation is supported for the stored volume, cached volume, and tape gateway types. The response includes disk IDs that are configured as upload buffer space, and it includes the amount of upload buffer space allocated and used.
   */
  describeUploadBuffer(params: StorageGateway.Types.DescribeUploadBufferInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeUploadBufferOutput) => void): Request<StorageGateway.Types.DescribeUploadBufferOutput, AWSError>;
  /**
   * Returns information about the upload buffer of a gateway. This operation is supported for the stored volume, cached volume, and tape gateway types. The response includes disk IDs that are configured as upload buffer space, and it includes the amount of upload buffer space allocated and used.
   */
  describeUploadBuffer(callback?: (err: AWSError, data: StorageGateway.Types.DescribeUploadBufferOutput) => void): Request<StorageGateway.Types.DescribeUploadBufferOutput, AWSError>;
  /**
   * Returns a description of virtual tape library (VTL) devices for the specified tape gateway. In the response, Storage Gateway returns VTL device information. This operation is only supported in the tape gateway type.
   */
  describeVTLDevices(params: StorageGateway.Types.DescribeVTLDevicesInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeVTLDevicesOutput) => void): Request<StorageGateway.Types.DescribeVTLDevicesOutput, AWSError>;
  /**
   * Returns a description of virtual tape library (VTL) devices for the specified tape gateway. In the response, Storage Gateway returns VTL device information. This operation is only supported in the tape gateway type.
   */
  describeVTLDevices(callback?: (err: AWSError, data: StorageGateway.Types.DescribeVTLDevicesOutput) => void): Request<StorageGateway.Types.DescribeVTLDevicesOutput, AWSError>;
  /**
   * Returns information about the working storage of a gateway. This operation is only supported in the stored volumes gateway type. This operation is deprecated in cached volumes API version (20120630). Use DescribeUploadBuffer instead.  Working storage is also referred to as upload buffer. You can also use the DescribeUploadBuffer operation to add upload buffer to a stored volume gateway.  The response includes disk IDs that are configured as working storage, and it includes the amount of working storage allocated and used.
   */
  describeWorkingStorage(params: StorageGateway.Types.DescribeWorkingStorageInput, callback?: (err: AWSError, data: StorageGateway.Types.DescribeWorkingStorageOutput) => void): Request<StorageGateway.Types.DescribeWorkingStorageOutput, AWSError>;
  /**
   * Returns information about the working storage of a gateway. This operation is only supported in the stored volumes gateway type. This operation is deprecated in cached volumes API version (20120630). Use DescribeUploadBuffer instead.  Working storage is also referred to as upload buffer. You can also use the DescribeUploadBuffer operation to add upload buffer to a stored volume gateway.  The response includes disk IDs that are configured as working storage, and it includes the amount of working storage allocated and used.
   */
  describeWorkingStorage(callback?: (err: AWSError, data: StorageGateway.Types.DescribeWorkingStorageOutput) => void): Request<StorageGateway.Types.DescribeWorkingStorageOutput, AWSError>;
  /**
   * Disconnects a volume from an iSCSI connection and then detaches the volume from the specified gateway. Detaching and attaching a volume enables you to recover your data from one gateway to a different gateway without creating a snapshot. It also makes it easier to move your volumes from an on-premises gateway to a gateway hosted on an Amazon EC2 instance. This operation is only supported in the volume gateway type.
   */
  detachVolume(params: StorageGateway.Types.DetachVolumeInput, callback?: (err: AWSError, data: StorageGateway.Types.DetachVolumeOutput) => void): Request<StorageGateway.Types.DetachVolumeOutput, AWSError>;
  /**
   * Disconnects a volume from an iSCSI connection and then detaches the volume from the specified gateway. Detaching and attaching a volume enables you to recover your data from one gateway to a different gateway without creating a snapshot. It also makes it easier to move your volumes from an on-premises gateway to a gateway hosted on an Amazon EC2 instance. This operation is only supported in the volume gateway type.
   */
  detachVolume(callback?: (err: AWSError, data: StorageGateway.Types.DetachVolumeOutput) => void): Request<StorageGateway.Types.DetachVolumeOutput, AWSError>;
  /**
   * Disables a tape gateway when the gateway is no longer functioning. For example, if your gateway VM is damaged, you can disable the gateway so you can recover virtual tapes. Use this operation for a tape gateway that is not reachable or not functioning. This operation is only supported in the tape gateway type.  After a gateway is disabled, it cannot be enabled. 
   */
  disableGateway(params: StorageGateway.Types.DisableGatewayInput, callback?: (err: AWSError, data: StorageGateway.Types.DisableGatewayOutput) => void): Request<StorageGateway.Types.DisableGatewayOutput, AWSError>;
  /**
   * Disables a tape gateway when the gateway is no longer functioning. For example, if your gateway VM is damaged, you can disable the gateway so you can recover virtual tapes. Use this operation for a tape gateway that is not reachable or not functioning. This operation is only supported in the tape gateway type.  After a gateway is disabled, it cannot be enabled. 
   */
  disableGateway(callback?: (err: AWSError, data: StorageGateway.Types.DisableGatewayOutput) => void): Request<StorageGateway.Types.DisableGatewayOutput, AWSError>;
  /**
   * Disassociates an Amazon FSx file system from the specified gateway. After the disassociation process finishes, the gateway can no longer access the Amazon FSx file system. This operation is only supported in the FSx File Gateway type.
   */
  disassociateFileSystem(params: StorageGateway.Types.DisassociateFileSystemInput, callback?: (err: AWSError, data: StorageGateway.Types.DisassociateFileSystemOutput) => void): Request<StorageGateway.Types.DisassociateFileSystemOutput, AWSError>;
  /**
   * Disassociates an Amazon FSx file system from the specified gateway. After the disassociation process finishes, the gateway can no longer access the Amazon FSx file system. This operation is only supported in the FSx File Gateway type.
   */
  disassociateFileSystem(callback?: (err: AWSError, data: StorageGateway.Types.DisassociateFileSystemOutput) => void): Request<StorageGateway.Types.DisassociateFileSystemOutput, AWSError>;
  /**
   * Adds a file gateway to an Active Directory domain. This operation is only supported for file gateways that support the SMB file protocol.  Joining a domain creates an Active Directory computer account in the default organizational unit, using the gateway's Gateway ID as the account name (for example, SGW-1234ADE). If your Active Directory environment requires that you pre-stage accounts to facilitate the join domain process, you will need to create this account ahead of time. To create the gateway's computer account in an organizational unit other than the default, you must specify the organizational unit when joining the domain. 
   */
  joinDomain(params: StorageGateway.Types.JoinDomainInput, callback?: (err: AWSError, data: StorageGateway.Types.JoinDomainOutput) => void): Request<StorageGateway.Types.JoinDomainOutput, AWSError>;
  /**
   * Adds a file gateway to an Active Directory domain. This operation is only supported for file gateways that support the SMB file protocol.  Joining a domain creates an Active Directory computer account in the default organizational unit, using the gateway's Gateway ID as the account name (for example, SGW-1234ADE). If your Active Directory environment requires that you pre-stage accounts to facilitate the join domain process, you will need to create this account ahead of time. To create the gateway's computer account in an organizational unit other than the default, you must specify the organizational unit when joining the domain. 
   */
  joinDomain(callback?: (err: AWSError, data: StorageGateway.Types.JoinDomainOutput) => void): Request<StorageGateway.Types.JoinDomainOutput, AWSError>;
  /**
   * Lists the automatic tape creation policies for a gateway. If there are no automatic tape creation policies for the gateway, it returns an empty list. This operation is only supported for tape gateways.
   */
  listAutomaticTapeCreationPolicies(params: StorageGateway.Types.ListAutomaticTapeCreationPoliciesInput, callback?: (err: AWSError, data: StorageGateway.Types.ListAutomaticTapeCreationPoliciesOutput) => void): Request<StorageGateway.Types.ListAutomaticTapeCreationPoliciesOutput, AWSError>;
  /**
   * Lists the automatic tape creation policies for a gateway. If there are no automatic tape creation policies for the gateway, it returns an empty list. This operation is only supported for tape gateways.
   */
  listAutomaticTapeCreationPolicies(callback?: (err: AWSError, data: StorageGateway.Types.ListAutomaticTapeCreationPoliciesOutput) => void): Request<StorageGateway.Types.ListAutomaticTapeCreationPoliciesOutput, AWSError>;
  /**
   * Gets a list of the file shares for a specific S3 File Gateway, or the list of file shares that belong to the calling Amazon Web Services account. This operation is only supported for S3 File Gateways.
   */
  listFileShares(params: StorageGateway.Types.ListFileSharesInput, callback?: (err: AWSError, data: StorageGateway.Types.ListFileSharesOutput) => void): Request<StorageGateway.Types.ListFileSharesOutput, AWSError>;
  /**
   * Gets a list of the file shares for a specific S3 File Gateway, or the list of file shares that belong to the calling Amazon Web Services account. This operation is only supported for S3 File Gateways.
   */
  listFileShares(callback?: (err: AWSError, data: StorageGateway.Types.ListFileSharesOutput) => void): Request<StorageGateway.Types.ListFileSharesOutput, AWSError>;
  /**
   * Gets a list of FileSystemAssociationSummary objects. Each object contains a summary of a file system association. This operation is only supported for FSx File Gateways.
   */
  listFileSystemAssociations(params: StorageGateway.Types.ListFileSystemAssociationsInput, callback?: (err: AWSError, data: StorageGateway.Types.ListFileSystemAssociationsOutput) => void): Request<StorageGateway.Types.ListFileSystemAssociationsOutput, AWSError>;
  /**
   * Gets a list of FileSystemAssociationSummary objects. Each object contains a summary of a file system association. This operation is only supported for FSx File Gateways.
   */
  listFileSystemAssociations(callback?: (err: AWSError, data: StorageGateway.Types.ListFileSystemAssociationsOutput) => void): Request<StorageGateway.Types.ListFileSystemAssociationsOutput, AWSError>;
  /**
   * Lists gateways owned by an Amazon Web Services account in an Amazon Web Services Region specified in the request. The returned list is ordered by gateway Amazon Resource Name (ARN). By default, the operation returns a maximum of 100 gateways. This operation supports pagination that allows you to optionally reduce the number of gateways returned in a response. If you have more gateways than are returned in a response (that is, the response returns only a truncated list of your gateways), the response contains a marker that you can specify in your next request to fetch the next page of gateways.
   */
  listGateways(params: StorageGateway.Types.ListGatewaysInput, callback?: (err: AWSError, data: StorageGateway.Types.ListGatewaysOutput) => void): Request<StorageGateway.Types.ListGatewaysOutput, AWSError>;
  /**
   * Lists gateways owned by an Amazon Web Services account in an Amazon Web Services Region specified in the request. The returned list is ordered by gateway Amazon Resource Name (ARN). By default, the operation returns a maximum of 100 gateways. This operation supports pagination that allows you to optionally reduce the number of gateways returned in a response. If you have more gateways than are returned in a response (that is, the response returns only a truncated list of your gateways), the response contains a marker that you can specify in your next request to fetch the next page of gateways.
   */
  listGateways(callback?: (err: AWSError, data: StorageGateway.Types.ListGatewaysOutput) => void): Request<StorageGateway.Types.ListGatewaysOutput, AWSError>;
  /**
   * Returns a list of the gateway's local disks. To specify which gateway to describe, you use the Amazon Resource Name (ARN) of the gateway in the body of the request. The request returns a list of all disks, specifying which are configured as working storage, cache storage, or stored volume or not configured at all. The response includes a DiskStatus field. This field can have a value of present (the disk is available to use), missing (the disk is no longer connected to the gateway), or mismatch (the disk node is occupied by a disk that has incorrect metadata or the disk content is corrupted).
   */
  listLocalDisks(params: StorageGateway.Types.ListLocalDisksInput, callback?: (err: AWSError, data: StorageGateway.Types.ListLocalDisksOutput) => void): Request<StorageGateway.Types.ListLocalDisksOutput, AWSError>;
  /**
   * Returns a list of the gateway's local disks. To specify which gateway to describe, you use the Amazon Resource Name (ARN) of the gateway in the body of the request. The request returns a list of all disks, specifying which are configured as working storage, cache storage, or stored volume or not configured at all. The response includes a DiskStatus field. This field can have a value of present (the disk is available to use), missing (the disk is no longer connected to the gateway), or mismatch (the disk node is occupied by a disk that has incorrect metadata or the disk content is corrupted).
   */
  listLocalDisks(callback?: (err: AWSError, data: StorageGateway.Types.ListLocalDisksOutput) => void): Request<StorageGateway.Types.ListLocalDisksOutput, AWSError>;
  /**
   * Lists the tags that have been added to the specified resource. This operation is supported in storage gateways of all types.
   */
  listTagsForResource(params: StorageGateway.Types.ListTagsForResourceInput, callback?: (err: AWSError, data: StorageGateway.Types.ListTagsForResourceOutput) => void): Request<StorageGateway.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists the tags that have been added to the specified resource. This operation is supported in storage gateways of all types.
   */
  listTagsForResource(callback?: (err: AWSError, data: StorageGateway.Types.ListTagsForResourceOutput) => void): Request<StorageGateway.Types.ListTagsForResourceOutput, AWSError>;
  /**
   * Lists custom tape pools. You specify custom tape pools to list by specifying one or more custom tape pool Amazon Resource Names (ARNs). If you don't specify a custom tape pool ARN, the operation lists all custom tape pools. This operation supports pagination. You can optionally specify the Limit parameter in the body to limit the number of tape pools in the response. If the number of tape pools returned in the response is truncated, the response includes a Marker element that you can use in your subsequent request to retrieve the next set of tape pools.
   */
  listTapePools(params: StorageGateway.Types.ListTapePoolsInput, callback?: (err: AWSError, data: StorageGateway.Types.ListTapePoolsOutput) => void): Request<StorageGateway.Types.ListTapePoolsOutput, AWSError>;
  /**
   * Lists custom tape pools. You specify custom tape pools to list by specifying one or more custom tape pool Amazon Resource Names (ARNs). If you don't specify a custom tape pool ARN, the operation lists all custom tape pools. This operation supports pagination. You can optionally specify the Limit parameter in the body to limit the number of tape pools in the response. If the number of tape pools returned in the response is truncated, the response includes a Marker element that you can use in your subsequent request to retrieve the next set of tape pools.
   */
  listTapePools(callback?: (err: AWSError, data: StorageGateway.Types.ListTapePoolsOutput) => void): Request<StorageGateway.Types.ListTapePoolsOutput, AWSError>;
  /**
   * Lists virtual tapes in your virtual tape library (VTL) and your virtual tape shelf (VTS). You specify the tapes to list by specifying one or more tape Amazon Resource Names (ARNs). If you don't specify a tape ARN, the operation lists all virtual tapes in both your VTL and VTS. This operation supports pagination. By default, the operation returns a maximum of up to 100 tapes. You can optionally specify the Limit parameter in the body to limit the number of tapes in the response. If the number of tapes returned in the response is truncated, the response includes a Marker element that you can use in your subsequent request to retrieve the next set of tapes. This operation is only supported in the tape gateway type.
   */
  listTapes(params: StorageGateway.Types.ListTapesInput, callback?: (err: AWSError, data: StorageGateway.Types.ListTapesOutput) => void): Request<StorageGateway.Types.ListTapesOutput, AWSError>;
  /**
   * Lists virtual tapes in your virtual tape library (VTL) and your virtual tape shelf (VTS). You specify the tapes to list by specifying one or more tape Amazon Resource Names (ARNs). If you don't specify a tape ARN, the operation lists all virtual tapes in both your VTL and VTS. This operation supports pagination. By default, the operation returns a maximum of up to 100 tapes. You can optionally specify the Limit parameter in the body to limit the number of tapes in the response. If the number of tapes returned in the response is truncated, the response includes a Marker element that you can use in your subsequent request to retrieve the next set of tapes. This operation is only supported in the tape gateway type.
   */
  listTapes(callback?: (err: AWSError, data: StorageGateway.Types.ListTapesOutput) => void): Request<StorageGateway.Types.ListTapesOutput, AWSError>;
  /**
   * Lists iSCSI initiators that are connected to a volume. You can use this operation to determine whether a volume is being used or not. This operation is only supported in the cached volume and stored volume gateway types.
   */
  listVolumeInitiators(params: StorageGateway.Types.ListVolumeInitiatorsInput, callback?: (err: AWSError, data: StorageGateway.Types.ListVolumeInitiatorsOutput) => void): Request<StorageGateway.Types.ListVolumeInitiatorsOutput, AWSError>;
  /**
   * Lists iSCSI initiators that are connected to a volume. You can use this operation to determine whether a volume is being used or not. This operation is only supported in the cached volume and stored volume gateway types.
   */
  listVolumeInitiators(callback?: (err: AWSError, data: StorageGateway.Types.ListVolumeInitiatorsOutput) => void): Request<StorageGateway.Types.ListVolumeInitiatorsOutput, AWSError>;
  /**
   * Lists the recovery points for a specified gateway. This operation is only supported in the cached volume gateway type. Each cache volume has one recovery point. A volume recovery point is a point in time at which all data of the volume is consistent and from which you can create a snapshot or clone a new cached volume from a source volume. To create a snapshot from a volume recovery point use the CreateSnapshotFromVolumeRecoveryPoint operation.
   */
  listVolumeRecoveryPoints(params: StorageGateway.Types.ListVolumeRecoveryPointsInput, callback?: (err: AWSError, data: StorageGateway.Types.ListVolumeRecoveryPointsOutput) => void): Request<StorageGateway.Types.ListVolumeRecoveryPointsOutput, AWSError>;
  /**
   * Lists the recovery points for a specified gateway. This operation is only supported in the cached volume gateway type. Each cache volume has one recovery point. A volume recovery point is a point in time at which all data of the volume is consistent and from which you can create a snapshot or clone a new cached volume from a source volume. To create a snapshot from a volume recovery point use the CreateSnapshotFromVolumeRecoveryPoint operation.
   */
  listVolumeRecoveryPoints(callback?: (err: AWSError, data: StorageGateway.Types.ListVolumeRecoveryPointsOutput) => void): Request<StorageGateway.Types.ListVolumeRecoveryPointsOutput, AWSError>;
  /**
   * Lists the iSCSI stored volumes of a gateway. Results are sorted by volume ARN. The response includes only the volume ARNs. If you want additional volume information, use the DescribeStorediSCSIVolumes or the DescribeCachediSCSIVolumes API. The operation supports pagination. By default, the operation returns a maximum of up to 100 volumes. You can optionally specify the Limit field in the body to limit the number of volumes in the response. If the number of volumes returned in the response is truncated, the response includes a Marker field. You can use this Marker value in your subsequent request to retrieve the next set of volumes. This operation is only supported in the cached volume and stored volume gateway types.
   */
  listVolumes(params: StorageGateway.Types.ListVolumesInput, callback?: (err: AWSError, data: StorageGateway.Types.ListVolumesOutput) => void): Request<StorageGateway.Types.ListVolumesOutput, AWSError>;
  /**
   * Lists the iSCSI stored volumes of a gateway. Results are sorted by volume ARN. The response includes only the volume ARNs. If you want additional volume information, use the DescribeStorediSCSIVolumes or the DescribeCachediSCSIVolumes API. The operation supports pagination. By default, the operation returns a maximum of up to 100 volumes. You can optionally specify the Limit field in the body to limit the number of volumes in the response. If the number of volumes returned in the response is truncated, the response includes a Marker field. You can use this Marker value in your subsequent request to retrieve the next set of volumes. This operation is only supported in the cached volume and stored volume gateway types.
   */
  listVolumes(callback?: (err: AWSError, data: StorageGateway.Types.ListVolumesOutput) => void): Request<StorageGateway.Types.ListVolumesOutput, AWSError>;
  /**
   * Sends you notification through CloudWatch Events when all files written to your file share have been uploaded to S3. Amazon S3. Storage Gateway can send a notification through Amazon CloudWatch Events when all files written to your file share up to that point in time have been uploaded to Amazon S3. These files include files written to the file share up to the time that you make a request for notification. When the upload is done, Storage Gateway sends you notification through an Amazon CloudWatch Event. You can configure CloudWatch Events to send the notification through event targets such as Amazon SNS or Lambda function. This operation is only supported for S3 File Gateways. For more information, see Getting file upload notification in the Amazon S3 File Gateway User Guide.
   */
  notifyWhenUploaded(params: StorageGateway.Types.NotifyWhenUploadedInput, callback?: (err: AWSError, data: StorageGateway.Types.NotifyWhenUploadedOutput) => void): Request<StorageGateway.Types.NotifyWhenUploadedOutput, AWSError>;
  /**
   * Sends you notification through CloudWatch Events when all files written to your file share have been uploaded to S3. Amazon S3. Storage Gateway can send a notification through Amazon CloudWatch Events when all files written to your file share up to that point in time have been uploaded to Amazon S3. These files include files written to the file share up to the time that you make a request for notification. When the upload is done, Storage Gateway sends you notification through an Amazon CloudWatch Event. You can configure CloudWatch Events to send the notification through event targets such as Amazon SNS or Lambda function. This operation is only supported for S3 File Gateways. For more information, see Getting file upload notification in the Amazon S3 File Gateway User Guide.
   */
  notifyWhenUploaded(callback?: (err: AWSError, data: StorageGateway.Types.NotifyWhenUploadedOutput) => void): Request<StorageGateway.Types.NotifyWhenUploadedOutput, AWSError>;
  /**
   * Refreshes the cached inventory of objects for the specified file share. This operation finds objects in the Amazon S3 bucket that were added, removed, or replaced since the gateway last listed the bucket's contents and cached the results. This operation does not import files into the S3 File Gateway cache storage. It only updates the cached inventory to reflect changes in the inventory of the objects in the S3 bucket. This operation is only supported in the S3 File Gateway types. You can subscribe to be notified through an Amazon CloudWatch event when your RefreshCache operation completes. For more information, see Getting notified about file operations in the Storage Gateway User Guide. This operation is Only supported for S3 File Gateways. When this API is called, it only initiates the refresh operation. When the API call completes and returns a success code, it doesn't necessarily mean that the file refresh has completed. You should use the refresh-complete notification to determine that the operation has completed before you check for new files on the gateway file share. You can subscribe to be notified through a CloudWatch event when your RefreshCache operation completes. Throttle limit: This API is asynchronous, so the gateway will accept no more than two refreshes at any time. We recommend using the refresh-complete CloudWatch event notification before issuing additional requests. For more information, see Getting notified about file operations in the Storage Gateway User Guide.    Wait at least 60 seconds between consecutive RefreshCache API requests.   If you invoke the RefreshCache API when two requests are already being processed, any new request will cause an InvalidGatewayRequestException error because too many requests were sent to the server.     The S3 bucket name does not need to be included when entering the list of folders in the FolderList parameter.  For more information, see Getting notified about file operations in the Storage Gateway User Guide.
   */
  refreshCache(params: StorageGateway.Types.RefreshCacheInput, callback?: (err: AWSError, data: StorageGateway.Types.RefreshCacheOutput) => void): Request<StorageGateway.Types.RefreshCacheOutput, AWSError>;
  /**
   * Refreshes the cached inventory of objects for the specified file share. This operation finds objects in the Amazon S3 bucket that were added, removed, or replaced since the gateway last listed the bucket's contents and cached the results. This operation does not import files into the S3 File Gateway cache storage. It only updates the cached inventory to reflect changes in the inventory of the objects in the S3 bucket. This operation is only supported in the S3 File Gateway types. You can subscribe to be notified through an Amazon CloudWatch event when your RefreshCache operation completes. For more information, see Getting notified about file operations in the Storage Gateway User Guide. This operation is Only supported for S3 File Gateways. When this API is called, it only initiates the refresh operation. When the API call completes and returns a success code, it doesn't necessarily mean that the file refresh has completed. You should use the refresh-complete notification to determine that the operation has completed before you check for new files on the gateway file share. You can subscribe to be notified through a CloudWatch event when your RefreshCache operation completes. Throttle limit: This API is asynchronous, so the gateway will accept no more than two refreshes at any time. We recommend using the refresh-complete CloudWatch event notification before issuing additional requests. For more information, see Getting notified about file operations in the Storage Gateway User Guide.    Wait at least 60 seconds between consecutive RefreshCache API requests.   If you invoke the RefreshCache API when two requests are already being processed, any new request will cause an InvalidGatewayRequestException error because too many requests were sent to the server.     The S3 bucket name does not need to be included when entering the list of folders in the FolderList parameter.  For more information, see Getting notified about file operations in the Storage Gateway User Guide.
   */
  refreshCache(callback?: (err: AWSError, data: StorageGateway.Types.RefreshCacheOutput) => void): Request<StorageGateway.Types.RefreshCacheOutput, AWSError>;
  /**
   * Removes one or more tags from the specified resource. This operation is supported in storage gateways of all types.
   */
  removeTagsFromResource(params: StorageGateway.Types.RemoveTagsFromResourceInput, callback?: (err: AWSError, data: StorageGateway.Types.RemoveTagsFromResourceOutput) => void): Request<StorageGateway.Types.RemoveTagsFromResourceOutput, AWSError>;
  /**
   * Removes one or more tags from the specified resource. This operation is supported in storage gateways of all types.
   */
  removeTagsFromResource(callback?: (err: AWSError, data: StorageGateway.Types.RemoveTagsFromResourceOutput) => void): Request<StorageGateway.Types.RemoveTagsFromResourceOutput, AWSError>;
  /**
   * Resets all cache disks that have encountered an error and makes the disks available for reconfiguration as cache storage. If your cache disk encounters an error, the gateway prevents read and write operations on virtual tapes in the gateway. For example, an error can occur when a disk is corrupted or removed from the gateway. When a cache is reset, the gateway loses its cache storage. At this point, you can reconfigure the disks as cache disks. This operation is only supported in the cached volume and tape types.  If the cache disk you are resetting contains data that has not been uploaded to Amazon S3 yet, that data can be lost. After you reset cache disks, there will be no configured cache disks left in the gateway, so you must configure at least one new cache disk for your gateway to function properly. 
   */
  resetCache(params: StorageGateway.Types.ResetCacheInput, callback?: (err: AWSError, data: StorageGateway.Types.ResetCacheOutput) => void): Request<StorageGateway.Types.ResetCacheOutput, AWSError>;
  /**
   * Resets all cache disks that have encountered an error and makes the disks available for reconfiguration as cache storage. If your cache disk encounters an error, the gateway prevents read and write operations on virtual tapes in the gateway. For example, an error can occur when a disk is corrupted or removed from the gateway. When a cache is reset, the gateway loses its cache storage. At this point, you can reconfigure the disks as cache disks. This operation is only supported in the cached volume and tape types.  If the cache disk you are resetting contains data that has not been uploaded to Amazon S3 yet, that data can be lost. After you reset cache disks, there will be no configured cache disks left in the gateway, so you must configure at least one new cache disk for your gateway to function properly. 
   */
  resetCache(callback?: (err: AWSError, data: StorageGateway.Types.ResetCacheOutput) => void): Request<StorageGateway.Types.ResetCacheOutput, AWSError>;
  /**
   * Retrieves an archived virtual tape from the virtual tape shelf (VTS) to a tape gateway. Virtual tapes archived in the VTS are not associated with any gateway. However after a tape is retrieved, it is associated with a gateway, even though it is also listed in the VTS, that is, archive. This operation is only supported in the tape gateway type. Once a tape is successfully retrieved to a gateway, it cannot be retrieved again to another gateway. You must archive the tape again before you can retrieve it to another gateway. This operation is only supported in the tape gateway type.
   */
  retrieveTapeArchive(params: StorageGateway.Types.RetrieveTapeArchiveInput, callback?: (err: AWSError, data: StorageGateway.Types.RetrieveTapeArchiveOutput) => void): Request<StorageGateway.Types.RetrieveTapeArchiveOutput, AWSError>;
  /**
   * Retrieves an archived virtual tape from the virtual tape shelf (VTS) to a tape gateway. Virtual tapes archived in the VTS are not associated with any gateway. However after a tape is retrieved, it is associated with a gateway, even though it is also listed in the VTS, that is, archive. This operation is only supported in the tape gateway type. Once a tape is successfully retrieved to a gateway, it cannot be retrieved again to another gateway. You must archive the tape again before you can retrieve it to another gateway. This operation is only supported in the tape gateway type.
   */
  retrieveTapeArchive(callback?: (err: AWSError, data: StorageGateway.Types.RetrieveTapeArchiveOutput) => void): Request<StorageGateway.Types.RetrieveTapeArchiveOutput, AWSError>;
  /**
   * Retrieves the recovery point for the specified virtual tape. This operation is only supported in the tape gateway type. A recovery point is a point in time view of a virtual tape at which all the data on the tape is consistent. If your gateway crashes, virtual tapes that have recovery points can be recovered to a new gateway.  The virtual tape can be retrieved to only one gateway. The retrieved tape is read-only. The virtual tape can be retrieved to only a tape gateway. There is no charge for retrieving recovery points. 
   */
  retrieveTapeRecoveryPoint(params: StorageGateway.Types.RetrieveTapeRecoveryPointInput, callback?: (err: AWSError, data: StorageGateway.Types.RetrieveTapeRecoveryPointOutput) => void): Request<StorageGateway.Types.RetrieveTapeRecoveryPointOutput, AWSError>;
  /**
   * Retrieves the recovery point for the specified virtual tape. This operation is only supported in the tape gateway type. A recovery point is a point in time view of a virtual tape at which all the data on the tape is consistent. If your gateway crashes, virtual tapes that have recovery points can be recovered to a new gateway.  The virtual tape can be retrieved to only one gateway. The retrieved tape is read-only. The virtual tape can be retrieved to only a tape gateway. There is no charge for retrieving recovery points. 
   */
  retrieveTapeRecoveryPoint(callback?: (err: AWSError, data: StorageGateway.Types.RetrieveTapeRecoveryPointOutput) => void): Request<StorageGateway.Types.RetrieveTapeRecoveryPointOutput, AWSError>;
  /**
   * Sets the password for your VM local console. When you log in to the local console for the first time, you log in to the VM with the default credentials. We recommend that you set a new password. You don't need to know the default password to set a new password.
   */
  setLocalConsolePassword(params: StorageGateway.Types.SetLocalConsolePasswordInput, callback?: (err: AWSError, data: StorageGateway.Types.SetLocalConsolePasswordOutput) => void): Request<StorageGateway.Types.SetLocalConsolePasswordOutput, AWSError>;
  /**
   * Sets the password for your VM local console. When you log in to the local console for the first time, you log in to the VM with the default credentials. We recommend that you set a new password. You don't need to know the default password to set a new password.
   */
  setLocalConsolePassword(callback?: (err: AWSError, data: StorageGateway.Types.SetLocalConsolePasswordOutput) => void): Request<StorageGateway.Types.SetLocalConsolePasswordOutput, AWSError>;
  /**
   * Sets the password for the guest user smbguest. The smbguest user is the user when the authentication method for the file share is set to GuestAccess. This operation only supported for S3 File Gateways
   */
  setSMBGuestPassword(params: StorageGateway.Types.SetSMBGuestPasswordInput, callback?: (err: AWSError, data: StorageGateway.Types.SetSMBGuestPasswordOutput) => void): Request<StorageGateway.Types.SetSMBGuestPasswordOutput, AWSError>;
  /**
   * Sets the password for the guest user smbguest. The smbguest user is the user when the authentication method for the file share is set to GuestAccess. This operation only supported for S3 File Gateways
   */
  setSMBGuestPassword(callback?: (err: AWSError, data: StorageGateway.Types.SetSMBGuestPasswordOutput) => void): Request<StorageGateway.Types.SetSMBGuestPasswordOutput, AWSError>;
  /**
   * Shuts down a gateway. To specify which gateway to shut down, use the Amazon Resource Name (ARN) of the gateway in the body of your request. The operation shuts down the gateway service component running in the gateway's virtual machine (VM) and not the host VM.  If you want to shut down the VM, it is recommended that you first shut down the gateway component in the VM to avoid unpredictable conditions.  After the gateway is shutdown, you cannot call any other API except StartGateway, DescribeGatewayInformation, and ListGateways. For more information, see ActivateGateway. Your applications cannot read from or write to the gateway's storage volumes, and there are no snapshots taken.  When you make a shutdown request, you will get a 200 OK success response immediately. However, it might take some time for the gateway to shut down. You can call the DescribeGatewayInformation API to check the status. For more information, see ActivateGateway.  If do not intend to use the gateway again, you must delete the gateway (using DeleteGateway) to no longer pay software charges associated with the gateway.
   */
  shutdownGateway(params: StorageGateway.Types.ShutdownGatewayInput, callback?: (err: AWSError, data: StorageGateway.Types.ShutdownGatewayOutput) => void): Request<StorageGateway.Types.ShutdownGatewayOutput, AWSError>;
  /**
   * Shuts down a gateway. To specify which gateway to shut down, use the Amazon Resource Name (ARN) of the gateway in the body of your request. The operation shuts down the gateway service component running in the gateway's virtual machine (VM) and not the host VM.  If you want to shut down the VM, it is recommended that you first shut down the gateway component in the VM to avoid unpredictable conditions.  After the gateway is shutdown, you cannot call any other API except StartGateway, DescribeGatewayInformation, and ListGateways. For more information, see ActivateGateway. Your applications cannot read from or write to the gateway's storage volumes, and there are no snapshots taken.  When you make a shutdown request, you will get a 200 OK success response immediately. However, it might take some time for the gateway to shut down. You can call the DescribeGatewayInformation API to check the status. For more information, see ActivateGateway.  If do not intend to use the gateway again, you must delete the gateway (using DeleteGateway) to no longer pay software charges associated with the gateway.
   */
  shutdownGateway(callback?: (err: AWSError, data: StorageGateway.Types.ShutdownGatewayOutput) => void): Request<StorageGateway.Types.ShutdownGatewayOutput, AWSError>;
  /**
   * Start a test that verifies that the specified gateway is configured for High Availability monitoring in your host environment. This request only initiates the test and that a successful response only indicates that the test was started. It doesn't indicate that the test passed. For the status of the test, invoke the DescribeAvailabilityMonitorTest API.  Starting this test will cause your gateway to go offline for a brief period. 
   */
  startAvailabilityMonitorTest(params: StorageGateway.Types.StartAvailabilityMonitorTestInput, callback?: (err: AWSError, data: StorageGateway.Types.StartAvailabilityMonitorTestOutput) => void): Request<StorageGateway.Types.StartAvailabilityMonitorTestOutput, AWSError>;
  /**
   * Start a test that verifies that the specified gateway is configured for High Availability monitoring in your host environment. This request only initiates the test and that a successful response only indicates that the test was started. It doesn't indicate that the test passed. For the status of the test, invoke the DescribeAvailabilityMonitorTest API.  Starting this test will cause your gateway to go offline for a brief period. 
   */
  startAvailabilityMonitorTest(callback?: (err: AWSError, data: StorageGateway.Types.StartAvailabilityMonitorTestOutput) => void): Request<StorageGateway.Types.StartAvailabilityMonitorTestOutput, AWSError>;
  /**
   * Starts a gateway that you previously shut down (see ShutdownGateway). After the gateway starts, you can then make other API calls, your applications can read from or write to the gateway's storage volumes and you will be able to take snapshot backups.  When you make a request, you will get a 200 OK success response immediately. However, it might take some time for the gateway to be ready. You should call DescribeGatewayInformation and check the status before making any additional API calls. For more information, see ActivateGateway.  To specify which gateway to start, use the Amazon Resource Name (ARN) of the gateway in your request.
   */
  startGateway(params: StorageGateway.Types.StartGatewayInput, callback?: (err: AWSError, data: StorageGateway.Types.StartGatewayOutput) => void): Request<StorageGateway.Types.StartGatewayOutput, AWSError>;
  /**
   * Starts a gateway that you previously shut down (see ShutdownGateway). After the gateway starts, you can then make other API calls, your applications can read from or write to the gateway's storage volumes and you will be able to take snapshot backups.  When you make a request, you will get a 200 OK success response immediately. However, it might take some time for the gateway to be ready. You should call DescribeGatewayInformation and check the status before making any additional API calls. For more information, see ActivateGateway.  To specify which gateway to start, use the Amazon Resource Name (ARN) of the gateway in your request.
   */
  startGateway(callback?: (err: AWSError, data: StorageGateway.Types.StartGatewayOutput) => void): Request<StorageGateway.Types.StartGatewayOutput, AWSError>;
  /**
   * Updates the automatic tape creation policy of a gateway. Use this to update the policy with a new set of automatic tape creation rules. This is only supported for tape gateways. By default, there is no automatic tape creation policy.  A gateway can have only one automatic tape creation policy. 
   */
  updateAutomaticTapeCreationPolicy(params: StorageGateway.Types.UpdateAutomaticTapeCreationPolicyInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateAutomaticTapeCreationPolicyOutput) => void): Request<StorageGateway.Types.UpdateAutomaticTapeCreationPolicyOutput, AWSError>;
  /**
   * Updates the automatic tape creation policy of a gateway. Use this to update the policy with a new set of automatic tape creation rules. This is only supported for tape gateways. By default, there is no automatic tape creation policy.  A gateway can have only one automatic tape creation policy. 
   */
  updateAutomaticTapeCreationPolicy(callback?: (err: AWSError, data: StorageGateway.Types.UpdateAutomaticTapeCreationPolicyOutput) => void): Request<StorageGateway.Types.UpdateAutomaticTapeCreationPolicyOutput, AWSError>;
  /**
   * Updates the bandwidth rate limits of a gateway. You can update both the upload and download bandwidth rate limit or specify only one of the two. If you don't set a bandwidth rate limit, the existing rate limit remains. This operation is supported only for the stored volume, cached volume, and tape gateway types. To update bandwidth rate limits for S3 file gateways, use UpdateBandwidthRateLimitSchedule. By default, a gateway's bandwidth rate limits are not set. If you don't set any limit, the gateway does not have any limitations on its bandwidth usage and could potentially use the maximum available bandwidth. To specify which gateway to update, use the Amazon Resource Name (ARN) of the gateway in your request.
   */
  updateBandwidthRateLimit(params: StorageGateway.Types.UpdateBandwidthRateLimitInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateBandwidthRateLimitOutput) => void): Request<StorageGateway.Types.UpdateBandwidthRateLimitOutput, AWSError>;
  /**
   * Updates the bandwidth rate limits of a gateway. You can update both the upload and download bandwidth rate limit or specify only one of the two. If you don't set a bandwidth rate limit, the existing rate limit remains. This operation is supported only for the stored volume, cached volume, and tape gateway types. To update bandwidth rate limits for S3 file gateways, use UpdateBandwidthRateLimitSchedule. By default, a gateway's bandwidth rate limits are not set. If you don't set any limit, the gateway does not have any limitations on its bandwidth usage and could potentially use the maximum available bandwidth. To specify which gateway to update, use the Amazon Resource Name (ARN) of the gateway in your request.
   */
  updateBandwidthRateLimit(callback?: (err: AWSError, data: StorageGateway.Types.UpdateBandwidthRateLimitOutput) => void): Request<StorageGateway.Types.UpdateBandwidthRateLimitOutput, AWSError>;
  /**
   *  Updates the bandwidth rate limit schedule for a specified gateway. By default, gateways do not have bandwidth rate limit schedules, which means no bandwidth rate limiting is in effect. Use this to initiate or update a gateway's bandwidth rate limit schedule. This operation is supported for volume, tape, and S3 file gateways. S3 file gateways support bandwidth rate limits for upload only. FSx file gateways do not support bandwidth rate limits.
   */
  updateBandwidthRateLimitSchedule(params: StorageGateway.Types.UpdateBandwidthRateLimitScheduleInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateBandwidthRateLimitScheduleOutput) => void): Request<StorageGateway.Types.UpdateBandwidthRateLimitScheduleOutput, AWSError>;
  /**
   *  Updates the bandwidth rate limit schedule for a specified gateway. By default, gateways do not have bandwidth rate limit schedules, which means no bandwidth rate limiting is in effect. Use this to initiate or update a gateway's bandwidth rate limit schedule. This operation is supported for volume, tape, and S3 file gateways. S3 file gateways support bandwidth rate limits for upload only. FSx file gateways do not support bandwidth rate limits.
   */
  updateBandwidthRateLimitSchedule(callback?: (err: AWSError, data: StorageGateway.Types.UpdateBandwidthRateLimitScheduleOutput) => void): Request<StorageGateway.Types.UpdateBandwidthRateLimitScheduleOutput, AWSError>;
  /**
   * Updates the Challenge-Handshake Authentication Protocol (CHAP) credentials for a specified iSCSI target. By default, a gateway does not have CHAP enabled; however, for added security, you might use it. This operation is supported in the volume and tape gateway types.  When you update CHAP credentials, all existing connections on the target are closed and initiators must reconnect with the new credentials. 
   */
  updateChapCredentials(params: StorageGateway.Types.UpdateChapCredentialsInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateChapCredentialsOutput) => void): Request<StorageGateway.Types.UpdateChapCredentialsOutput, AWSError>;
  /**
   * Updates the Challenge-Handshake Authentication Protocol (CHAP) credentials for a specified iSCSI target. By default, a gateway does not have CHAP enabled; however, for added security, you might use it. This operation is supported in the volume and tape gateway types.  When you update CHAP credentials, all existing connections on the target are closed and initiators must reconnect with the new credentials. 
   */
  updateChapCredentials(callback?: (err: AWSError, data: StorageGateway.Types.UpdateChapCredentialsOutput) => void): Request<StorageGateway.Types.UpdateChapCredentialsOutput, AWSError>;
  /**
   * Updates a file system association. This operation is only supported in the FSx File Gateways.
   */
  updateFileSystemAssociation(params: StorageGateway.Types.UpdateFileSystemAssociationInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateFileSystemAssociationOutput) => void): Request<StorageGateway.Types.UpdateFileSystemAssociationOutput, AWSError>;
  /**
   * Updates a file system association. This operation is only supported in the FSx File Gateways.
   */
  updateFileSystemAssociation(callback?: (err: AWSError, data: StorageGateway.Types.UpdateFileSystemAssociationOutput) => void): Request<StorageGateway.Types.UpdateFileSystemAssociationOutput, AWSError>;
  /**
   * Updates a gateway's metadata, which includes the gateway's name and time zone. To specify which gateway to update, use the Amazon Resource Name (ARN) of the gateway in your request.  For gateways activated after September 2, 2015, the gateway's ARN contains the gateway ID rather than the gateway name. However, changing the name of the gateway has no effect on the gateway's ARN. 
   */
  updateGatewayInformation(params: StorageGateway.Types.UpdateGatewayInformationInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateGatewayInformationOutput) => void): Request<StorageGateway.Types.UpdateGatewayInformationOutput, AWSError>;
  /**
   * Updates a gateway's metadata, which includes the gateway's name and time zone. To specify which gateway to update, use the Amazon Resource Name (ARN) of the gateway in your request.  For gateways activated after September 2, 2015, the gateway's ARN contains the gateway ID rather than the gateway name. However, changing the name of the gateway has no effect on the gateway's ARN. 
   */
  updateGatewayInformation(callback?: (err: AWSError, data: StorageGateway.Types.UpdateGatewayInformationOutput) => void): Request<StorageGateway.Types.UpdateGatewayInformationOutput, AWSError>;
  /**
   * Updates the gateway virtual machine (VM) software. The request immediately triggers the software update.  When you make this request, you get a 200 OK success response immediately. However, it might take some time for the update to complete. You can call DescribeGatewayInformation to verify the gateway is in the STATE_RUNNING state.   A software update forces a system restart of your gateway. You can minimize the chance of any disruption to your applications by increasing your iSCSI Initiators' timeouts. For more information about increasing iSCSI Initiator timeouts for Windows and Linux, see Customizing your Windows iSCSI settings and Customizing your Linux iSCSI settings, respectively. 
   */
  updateGatewaySoftwareNow(params: StorageGateway.Types.UpdateGatewaySoftwareNowInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateGatewaySoftwareNowOutput) => void): Request<StorageGateway.Types.UpdateGatewaySoftwareNowOutput, AWSError>;
  /**
   * Updates the gateway virtual machine (VM) software. The request immediately triggers the software update.  When you make this request, you get a 200 OK success response immediately. However, it might take some time for the update to complete. You can call DescribeGatewayInformation to verify the gateway is in the STATE_RUNNING state.   A software update forces a system restart of your gateway. You can minimize the chance of any disruption to your applications by increasing your iSCSI Initiators' timeouts. For more information about increasing iSCSI Initiator timeouts for Windows and Linux, see Customizing your Windows iSCSI settings and Customizing your Linux iSCSI settings, respectively. 
   */
  updateGatewaySoftwareNow(callback?: (err: AWSError, data: StorageGateway.Types.UpdateGatewaySoftwareNowOutput) => void): Request<StorageGateway.Types.UpdateGatewaySoftwareNowOutput, AWSError>;
  /**
   * Updates a gateway's weekly maintenance start time information, including day and time of the week. The maintenance time is the time in your gateway's time zone.
   */
  updateMaintenanceStartTime(params: StorageGateway.Types.UpdateMaintenanceStartTimeInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateMaintenanceStartTimeOutput) => void): Request<StorageGateway.Types.UpdateMaintenanceStartTimeOutput, AWSError>;
  /**
   * Updates a gateway's weekly maintenance start time information, including day and time of the week. The maintenance time is the time in your gateway's time zone.
   */
  updateMaintenanceStartTime(callback?: (err: AWSError, data: StorageGateway.Types.UpdateMaintenanceStartTimeOutput) => void): Request<StorageGateway.Types.UpdateMaintenanceStartTimeOutput, AWSError>;
  /**
   * Updates a Network File System (NFS) file share. This operation is only supported in S3 File Gateways.  To leave a file share field unchanged, set the corresponding input field to null.  Updates the following file share settings:   Default storage class for your S3 bucket   Metadata defaults for your S3 bucket   Allowed NFS clients for your file share   Squash settings   Write status of your file share  
   */
  updateNFSFileShare(params: StorageGateway.Types.UpdateNFSFileShareInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateNFSFileShareOutput) => void): Request<StorageGateway.Types.UpdateNFSFileShareOutput, AWSError>;
  /**
   * Updates a Network File System (NFS) file share. This operation is only supported in S3 File Gateways.  To leave a file share field unchanged, set the corresponding input field to null.  Updates the following file share settings:   Default storage class for your S3 bucket   Metadata defaults for your S3 bucket   Allowed NFS clients for your file share   Squash settings   Write status of your file share  
   */
  updateNFSFileShare(callback?: (err: AWSError, data: StorageGateway.Types.UpdateNFSFileShareOutput) => void): Request<StorageGateway.Types.UpdateNFSFileShareOutput, AWSError>;
  /**
   * Updates a Server Message Block (SMB) file share. This operation is only supported for S3 File Gateways.  To leave a file share field unchanged, set the corresponding input field to null.   File gateways require Security Token Service (Amazon Web Services STS) to be activated to enable you to create a file share. Make sure that Amazon Web Services STS is activated in the Amazon Web Services Region you are creating your file gateway in. If Amazon Web Services STS is not activated in this Amazon Web Services Region, activate it. For information about how to activate Amazon Web Services STS, see Activating and deactivating Amazon Web Services STS in an Amazon Web Services Region in the Identity and Access Management User Guide. File gateways don't support creating hard or symbolic links on a file share. 
   */
  updateSMBFileShare(params: StorageGateway.Types.UpdateSMBFileShareInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateSMBFileShareOutput) => void): Request<StorageGateway.Types.UpdateSMBFileShareOutput, AWSError>;
  /**
   * Updates a Server Message Block (SMB) file share. This operation is only supported for S3 File Gateways.  To leave a file share field unchanged, set the corresponding input field to null.   File gateways require Security Token Service (Amazon Web Services STS) to be activated to enable you to create a file share. Make sure that Amazon Web Services STS is activated in the Amazon Web Services Region you are creating your file gateway in. If Amazon Web Services STS is not activated in this Amazon Web Services Region, activate it. For information about how to activate Amazon Web Services STS, see Activating and deactivating Amazon Web Services STS in an Amazon Web Services Region in the Identity and Access Management User Guide. File gateways don't support creating hard or symbolic links on a file share. 
   */
  updateSMBFileShare(callback?: (err: AWSError, data: StorageGateway.Types.UpdateSMBFileShareOutput) => void): Request<StorageGateway.Types.UpdateSMBFileShareOutput, AWSError>;
  /**
   * Controls whether the shares on an S3 File Gateway are visible in a net view or browse list. The operation is only supported for S3 File Gateways.
   */
  updateSMBFileShareVisibility(params: StorageGateway.Types.UpdateSMBFileShareVisibilityInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateSMBFileShareVisibilityOutput) => void): Request<StorageGateway.Types.UpdateSMBFileShareVisibilityOutput, AWSError>;
  /**
   * Controls whether the shares on an S3 File Gateway are visible in a net view or browse list. The operation is only supported for S3 File Gateways.
   */
  updateSMBFileShareVisibility(callback?: (err: AWSError, data: StorageGateway.Types.UpdateSMBFileShareVisibilityOutput) => void): Request<StorageGateway.Types.UpdateSMBFileShareVisibilityOutput, AWSError>;
  /**
   * Updates the list of Active Directory users and groups that have special permissions for SMB file shares on the gateway.
   */
  updateSMBLocalGroups(params: StorageGateway.Types.UpdateSMBLocalGroupsInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateSMBLocalGroupsOutput) => void): Request<StorageGateway.Types.UpdateSMBLocalGroupsOutput, AWSError>;
  /**
   * Updates the list of Active Directory users and groups that have special permissions for SMB file shares on the gateway.
   */
  updateSMBLocalGroups(callback?: (err: AWSError, data: StorageGateway.Types.UpdateSMBLocalGroupsOutput) => void): Request<StorageGateway.Types.UpdateSMBLocalGroupsOutput, AWSError>;
  /**
   * Updates the SMB security strategy on a file gateway. This action is only supported in file gateways.  This API is called Security level in the User Guide. A higher security level can affect performance of the gateway. 
   */
  updateSMBSecurityStrategy(params: StorageGateway.Types.UpdateSMBSecurityStrategyInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateSMBSecurityStrategyOutput) => void): Request<StorageGateway.Types.UpdateSMBSecurityStrategyOutput, AWSError>;
  /**
   * Updates the SMB security strategy on a file gateway. This action is only supported in file gateways.  This API is called Security level in the User Guide. A higher security level can affect performance of the gateway. 
   */
  updateSMBSecurityStrategy(callback?: (err: AWSError, data: StorageGateway.Types.UpdateSMBSecurityStrategyOutput) => void): Request<StorageGateway.Types.UpdateSMBSecurityStrategyOutput, AWSError>;
  /**
   * Updates a snapshot schedule configured for a gateway volume. This operation is only supported in the cached volume and stored volume gateway types. The default snapshot schedule for volume is once every 24 hours, starting at the creation time of the volume. You can use this API to change the snapshot schedule configured for the volume. In the request you must identify the gateway volume whose snapshot schedule you want to update, and the schedule information, including when you want the snapshot to begin on a day and the frequency (in hours) of snapshots.
   */
  updateSnapshotSchedule(params: StorageGateway.Types.UpdateSnapshotScheduleInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateSnapshotScheduleOutput) => void): Request<StorageGateway.Types.UpdateSnapshotScheduleOutput, AWSError>;
  /**
   * Updates a snapshot schedule configured for a gateway volume. This operation is only supported in the cached volume and stored volume gateway types. The default snapshot schedule for volume is once every 24 hours, starting at the creation time of the volume. You can use this API to change the snapshot schedule configured for the volume. In the request you must identify the gateway volume whose snapshot schedule you want to update, and the schedule information, including when you want the snapshot to begin on a day and the frequency (in hours) of snapshots.
   */
  updateSnapshotSchedule(callback?: (err: AWSError, data: StorageGateway.Types.UpdateSnapshotScheduleOutput) => void): Request<StorageGateway.Types.UpdateSnapshotScheduleOutput, AWSError>;
  /**
   * Updates the type of medium changer in a tape gateway. When you activate a tape gateway, you select a medium changer type for the tape gateway. This operation enables you to select a different type of medium changer after a tape gateway is activated. This operation is only supported in the tape gateway type.
   */
  updateVTLDeviceType(params: StorageGateway.Types.UpdateVTLDeviceTypeInput, callback?: (err: AWSError, data: StorageGateway.Types.UpdateVTLDeviceTypeOutput) => void): Request<StorageGateway.Types.UpdateVTLDeviceTypeOutput, AWSError>;
  /**
   * Updates the type of medium changer in a tape gateway. When you activate a tape gateway, you select a medium changer type for the tape gateway. This operation enables you to select a different type of medium changer after a tape gateway is activated. This operation is only supported in the tape gateway type.
   */
  updateVTLDeviceType(callback?: (err: AWSError, data: StorageGateway.Types.UpdateVTLDeviceTypeOutput) => void): Request<StorageGateway.Types.UpdateVTLDeviceTypeOutput, AWSError>;
}
declare namespace StorageGateway {
  export interface ActivateGatewayInput {
    /**
     * Your gateway activation key. You can obtain the activation key by sending an HTTP GET request with redirects enabled to the gateway IP address (port 80). The redirect URL returned in the response provides you the activation key for your gateway in the query string parameter activationKey. It may also include other activation-related parameters, however, these are merely defaults -- the arguments you pass to the ActivateGateway API call determine the actual configuration of your gateway. For more information, see Getting activation key in the Storage Gateway User Guide.
     */
    ActivationKey: ActivationKey;
    /**
     * The name you configured for your gateway.
     */
    GatewayName: GatewayName;
    /**
     * A value that indicates the time zone you want to set for the gateway. The time zone is of the format "GMT-hr:mm" or "GMT+hr:mm". For example, GMT-4:00 indicates the time is 4 hours behind GMT. GMT+2:00 indicates the time is 2 hours ahead of GMT. The time zone is used, for example, for scheduling snapshots and your gateway's maintenance schedule.
     */
    GatewayTimezone: GatewayTimezone;
    /**
     * A value that indicates the Amazon Web Services Region where you want to store your data. The gateway Amazon Web Services Region specified must be the same Amazon Web Services Region as the Amazon Web Services Region in your Host header in the request. For more information about available Amazon Web Services Regions and endpoints for Storage Gateway, see  Storage Gateway endpoints and quotas in the Amazon Web Services General Reference. Valid Values: See  Storage Gateway endpoints and quotas in the Amazon Web Services General Reference. 
     */
    GatewayRegion: RegionId;
    /**
     * A value that defines the type of gateway to activate. The type specified is critical to all later functions of the gateway and cannot be changed after activation. The default value is CACHED. Valid Values: STORED | CACHED | VTL | VTL_SNOW | FILE_S3 | FILE_FSX_SMB 
     */
    GatewayType?: GatewayType;
    /**
     * The value that indicates the type of tape drive to use for tape gateway. This field is optional. Valid Values: IBM-ULT3580-TD5 
     */
    TapeDriveType?: TapeDriveType;
    /**
     * The value that indicates the type of medium changer to use for tape gateway. This field is optional. Valid Values: STK-L700 | AWS-Gateway-VTL | IBM-03584L32-0402 
     */
    MediumChangerType?: MediumChangerType;
    /**
     * A list of up to 50 tags that you can assign to the gateway. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers that can be represented in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256 characters. 
     */
    Tags?: Tags;
  }
  export interface ActivateGatewayOutput {
    GatewayARN?: GatewayARN;
  }
  export type ActivationKey = string;
  export type ActiveDirectoryStatus = "ACCESS_DENIED"|"DETACHED"|"JOINED"|"JOINING"|"NETWORK_ERROR"|"TIMEOUT"|"UNKNOWN_ERROR"|string;
  export interface AddCacheInput {
    GatewayARN: GatewayARN;
    /**
     * An array of strings that identify disks that are to be configured as working storage. Each string has a minimum length of 1 and maximum length of 300. You can get the disk IDs from the ListLocalDisks API.
     */
    DiskIds: DiskIds;
  }
  export interface AddCacheOutput {
    GatewayARN?: GatewayARN;
  }
  export interface AddTagsToResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource you want to add tags to.
     */
    ResourceARN: ResourceARN;
    /**
     * The key-value pair that represents the tag you want to add to the resource. The value can be an empty string.  Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256. 
     */
    Tags: Tags;
  }
  export interface AddTagsToResourceOutput {
    /**
     * The Amazon Resource Name (ARN) of the resource you want to add tags to.
     */
    ResourceARN?: ResourceARN;
  }
  export interface AddUploadBufferInput {
    GatewayARN: GatewayARN;
    /**
     * An array of strings that identify disks that are to be configured as working storage. Each string has a minimum length of 1 and maximum length of 300. You can get the disk IDs from the ListLocalDisks API.
     */
    DiskIds: DiskIds;
  }
  export interface AddUploadBufferOutput {
    GatewayARN?: GatewayARN;
  }
  export interface AddWorkingStorageInput {
    GatewayARN: GatewayARN;
    /**
     * An array of strings that identify disks that are to be configured as working storage. Each string has a minimum length of 1 and maximum length of 300. You can get the disk IDs from the ListLocalDisks API.
     */
    DiskIds: DiskIds;
  }
  export interface AddWorkingStorageOutput {
    GatewayARN?: GatewayARN;
  }
  export interface AssignTapePoolInput {
    /**
     * The unique Amazon Resource Name (ARN) of the virtual tape that you want to add to the tape pool.
     */
    TapeARN: TapeARN;
    /**
     * The ID of the pool that you want to add your tape to for archiving. The tape in this pool is archived in the S3 storage class that is associated with the pool. When you use your backup application to eject the tape, the tape is archived directly into the storage class (S3 Glacier or S3 Glacier Deep Archive) that corresponds to the pool.
     */
    PoolId: PoolId;
    /**
     * Set permissions to bypass governance retention. If the lock type of the archived tape is Governance, the tape's archived age is not older than RetentionLockInDays, and the user does not already have BypassGovernanceRetention, setting this to TRUE enables the user to bypass the retention lock. This parameter is set to true by default for calls from the console. Valid values: TRUE | FALSE 
     */
    BypassGovernanceRetention?: boolean;
  }
  export interface AssignTapePoolOutput {
    /**
     * The unique Amazon Resource Names (ARN) of the virtual tape that was added to the tape pool.
     */
    TapeARN?: TapeARN;
  }
  export interface AssociateFileSystemInput {
    /**
     * The user name of the user credential that has permission to access the root share D$ of the Amazon FSx file system. The user account must belong to the Amazon FSx delegated admin user group.
     */
    UserName: DomainUserName;
    /**
     * The password of the user credential.
     */
    Password: DomainUserPassword;
    /**
     * A unique string value that you supply that is used by the FSx File Gateway to ensure idempotent file system association creation.
     */
    ClientToken: ClientToken;
    GatewayARN: GatewayARN;
    /**
     * The Amazon Resource Name (ARN) of the Amazon FSx file system to associate with the FSx File Gateway.
     */
    LocationARN: FileSystemLocationARN;
    /**
     * A list of up to 50 tags that can be assigned to the file system association. Each tag is a key-value pair.
     */
    Tags?: Tags;
    /**
     * The Amazon Resource Name (ARN) of the storage used for the audit logs.
     */
    AuditDestinationARN?: AuditDestinationARN;
    CacheAttributes?: CacheAttributes;
    /**
     * Specifies the network configuration information for the gateway associated with the Amazon FSx file system.  If multiple file systems are associated with this gateway, this parameter's IpAddresses field is required. 
     */
    EndpointNetworkConfiguration?: EndpointNetworkConfiguration;
  }
  export interface AssociateFileSystemOutput {
    /**
     * The ARN of the newly created file system association.
     */
    FileSystemAssociationARN?: FileSystemAssociationARN;
  }
  export interface AttachVolumeInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway that you want to attach the volume to.
     */
    GatewayARN: GatewayARN;
    /**
     * The name of the iSCSI target used by an initiator to connect to a volume and used as a suffix for the target ARN. For example, specifying TargetName as myvolume results in the target ARN of arn:aws:storagegateway:us-east-2:111122223333:gateway/sgw-12A3456B/target/iqn.1997-05.com.amazon:myvolume. The target name must be unique across all volumes on a gateway. If you don't specify a value, Storage Gateway uses the value that was previously used for this volume as the new target name.
     */
    TargetName?: TargetName;
    /**
     * The Amazon Resource Name (ARN) of the volume to attach to the specified gateway.
     */
    VolumeARN: VolumeARN;
    /**
     * The network interface of the gateway on which to expose the iSCSI target. Only IPv4 addresses are accepted. Use DescribeGatewayInformation to get a list of the network interfaces available on a gateway. Valid Values: A valid IP address.
     */
    NetworkInterfaceId: NetworkInterfaceId;
    /**
     * The unique device ID or other distinguishing data that identifies the local disk used to create the volume. This value is only required when you are attaching a stored volume.
     */
    DiskId?: DiskId;
  }
  export interface AttachVolumeOutput {
    /**
     * The Amazon Resource Name (ARN) of the volume that was attached to the gateway.
     */
    VolumeARN?: VolumeARN;
    /**
     * The Amazon Resource Name (ARN) of the volume target, which includes the iSCSI name for the initiator that was used to connect to the target.
     */
    TargetARN?: TargetARN;
  }
  export type AuditDestinationARN = string;
  export type Authentication = string;
  export interface AutomaticTapeCreationPolicyInfo {
    /**
     * An automatic tape creation policy consists of a list of automatic tape creation rules. This returns the rules that determine when and how to automatically create new tapes.
     */
    AutomaticTapeCreationRules?: AutomaticTapeCreationRules;
    GatewayARN?: GatewayARN;
  }
  export type AutomaticTapeCreationPolicyInfos = AutomaticTapeCreationPolicyInfo[];
  export interface AutomaticTapeCreationRule {
    /**
     * A prefix that you append to the barcode of the virtual tape that you are creating. This prefix makes the barcode unique.  The prefix must be 1-4 characters in length and must be one of the uppercase letters from A to Z. 
     */
    TapeBarcodePrefix: TapeBarcodePrefix;
    /**
     * The ID of the pool that you want to add your tape to for archiving. The tape in this pool is archived in the Amazon S3 storage class that is associated with the pool. When you use your backup application to eject the tape, the tape is archived directly into the storage class (S3 Glacier or S3 Glacier Deep Archive) that corresponds to the pool.
     */
    PoolId: PoolId;
    /**
     * The size, in bytes, of the virtual tape capacity.
     */
    TapeSizeInBytes: TapeSize;
    /**
     * The minimum number of available virtual tapes that the gateway maintains at all times. If the number of tapes on the gateway goes below this value, the gateway creates as many new tapes as are needed to have MinimumNumTapes on the gateway. For more information about automatic tape creation, see Creating Tapes Automatically.
     */
    MinimumNumTapes: MinimumNumTapes;
    /**
     * Set to true to indicate that tapes are to be archived as write-once-read-many (WORM). Set to false when WORM is not enabled for tapes.
     */
    Worm?: boolean;
  }
  export type AutomaticTapeCreationRules = AutomaticTapeCreationRule[];
  export type AvailabilityMonitorTestStatus = "COMPLETE"|"FAILED"|"PENDING"|string;
  export type BandwidthDownloadRateLimit = number;
  export interface BandwidthRateLimitInterval {
    /**
     *  The hour of the day to start the bandwidth rate limit interval. 
     */
    StartHourOfDay: HourOfDay;
    /**
     *  The minute of the hour to start the bandwidth rate limit interval. The interval begins at the start of that minute. To begin an interval exactly at the start of the hour, use the value 0. 
     */
    StartMinuteOfHour: MinuteOfHour;
    /**
     *  The hour of the day to end the bandwidth rate limit interval. 
     */
    EndHourOfDay: HourOfDay;
    /**
     *  The minute of the hour to end the bandwidth rate limit interval.    The bandwidth rate limit interval ends at the end of the minute. To end an interval at the end of an hour, use the value 59.  
     */
    EndMinuteOfHour: MinuteOfHour;
    /**
     *  The days of the week component of the bandwidth rate limit interval, represented as ordinal numbers from 0 to 6, where 0 represents Sunday and 6 represents Saturday. 
     */
    DaysOfWeek: DaysOfWeek;
    /**
     *  The average upload rate limit component of the bandwidth rate limit interval, in bits per second. This field does not appear in the response if the upload rate limit is not set.   For Tape Gateway and Volume Gateway, the minimum value is 51200. For S3 File Gateway and FSx File Gateway, the minimum value is 104857600. 
     */
    AverageUploadRateLimitInBitsPerSec?: BandwidthUploadRateLimit;
    /**
     *  The average download rate limit component of the bandwidth rate limit interval, in bits per second. This field does not appear in the response if the download rate limit is not set. 
     */
    AverageDownloadRateLimitInBitsPerSec?: BandwidthDownloadRateLimit;
  }
  export type BandwidthRateLimitIntervals = BandwidthRateLimitInterval[];
  export type BandwidthType = string;
  export type BandwidthUploadRateLimit = number;
  export type Boolean = boolean;
  export interface CacheAttributes {
    /**
     * Refreshes a file share's cache by using Time To Live (TTL). TTL is the length of time since the last refresh after which access to the directory would cause the file gateway to first refresh that directory's contents from the Amazon S3 bucket or Amazon FSx file system. The TTL duration is in seconds. Valid Values:0, 300 to 2,592,000 seconds (5 minutes to 30 days)
     */
    CacheStaleTimeoutInSeconds?: CacheStaleTimeoutInSeconds;
  }
  export type CacheStaleTimeoutInSeconds = number;
  export interface CachediSCSIVolume {
    /**
     * The Amazon Resource Name (ARN) of the storage volume.
     */
    VolumeARN?: VolumeARN;
    /**
     * The unique identifier of the volume, e.g., vol-AE4B946D.
     */
    VolumeId?: VolumeId;
    /**
     * One of the VolumeType enumeration values that describes the type of the volume.
     */
    VolumeType?: VolumeType;
    /**
     * One of the VolumeStatus values that indicates the state of the storage volume.
     */
    VolumeStatus?: VolumeStatus;
    /**
     * A value that indicates whether a storage volume is attached to or detached from a gateway. For more information, see Moving your volumes to a different gateway.
     */
    VolumeAttachmentStatus?: VolumeAttachmentStatus;
    /**
     * The size, in bytes, of the volume capacity.
     */
    VolumeSizeInBytes?: long;
    /**
     * Represents the percentage complete if the volume is restoring or bootstrapping that represents the percent of data transferred. This field does not appear in the response if the cached volume is not restoring or bootstrapping.
     */
    VolumeProgress?: DoubleObject;
    /**
     * If the cached volume was created from a snapshot, this field contains the snapshot ID used, e.g., snap-78e22663. Otherwise, this field is not included.
     */
    SourceSnapshotId?: SnapshotId;
    /**
     * An VolumeiSCSIAttributes object that represents a collection of iSCSI attributes for one stored volume.
     */
    VolumeiSCSIAttributes?: VolumeiSCSIAttributes;
    /**
     * The date the volume was created. Volumes created prior to March 28, 2017 don’t have this timestamp.
     */
    CreatedDate?: CreatedDate;
    /**
     * The size of the data stored on the volume in bytes. This value is calculated based on the number of blocks that are touched, instead of the actual amount of data written. This value can be useful for sequential write patterns but less accurate for random write patterns. VolumeUsedInBytes is different from the compressed size of the volume, which is the value that is used to calculate your bill.  This value is not available for volumes created prior to May 13, 2015, until you store data on the volume. If you use a delete tool that overwrites the data on your volume with random data, your usage will not be reduced. This is because the random data is not compressible. If you want to reduce the amount of billed storage on your volume, we recommend overwriting your files with zeros to compress the data to a negligible amount of actual storage. 
     */
    VolumeUsedInBytes?: VolumeUsedInBytes;
    KMSKey?: KMSKey;
    /**
     * The name of the iSCSI target used by an initiator to connect to a volume and used as a suffix for the target ARN. For example, specifying TargetName as myvolume results in the target ARN of arn:aws:storagegateway:us-east-2:111122223333:gateway/sgw-12A3456B/target/iqn.1997-05.com.amazon:myvolume. The target name must be unique across all volumes on a gateway. If you don't specify a value, Storage Gateway uses the value that was previously used for this volume as the new target name.
     */
    TargetName?: TargetName;
  }
  export type CachediSCSIVolumes = CachediSCSIVolume[];
  export interface CancelArchivalInput {
    GatewayARN: GatewayARN;
    /**
     * The Amazon Resource Name (ARN) of the virtual tape you want to cancel archiving for.
     */
    TapeARN: TapeARN;
  }
  export interface CancelArchivalOutput {
    /**
     * The Amazon Resource Name (ARN) of the virtual tape for which archiving was canceled.
     */
    TapeARN?: TapeARN;
  }
  export interface CancelRetrievalInput {
    GatewayARN: GatewayARN;
    /**
     * The Amazon Resource Name (ARN) of the virtual tape you want to cancel retrieval for.
     */
    TapeARN: TapeARN;
  }
  export interface CancelRetrievalOutput {
    /**
     * The Amazon Resource Name (ARN) of the virtual tape for which retrieval was canceled.
     */
    TapeARN?: TapeARN;
  }
  export type CaseSensitivity = "ClientSpecified"|"CaseSensitive"|string;
  export type ChapCredentials = ChapInfo[];
  export interface ChapInfo {
    /**
     * The Amazon Resource Name (ARN) of the volume. Valid Values: 50 to 500 lowercase letters, numbers, periods (.), and hyphens (-).
     */
    TargetARN?: TargetARN;
    /**
     * The secret key that the initiator (for example, the Windows client) must provide to participate in mutual CHAP with the target.
     */
    SecretToAuthenticateInitiator?: ChapSecret;
    /**
     * The iSCSI initiator that connects to the target.
     */
    InitiatorName?: IqnName;
    /**
     * The secret key that the target must provide to participate in mutual CHAP with the initiator (e.g., Windows client).
     */
    SecretToAuthenticateTarget?: ChapSecret;
  }
  export type ChapSecret = string;
  export type ClientToken = string;
  export type CloudWatchLogGroupARN = string;
  export interface CreateCachediSCSIVolumeInput {
    GatewayARN: GatewayARN;
    /**
     * The size of the volume in bytes.
     */
    VolumeSizeInBytes: long;
    /**
     * The snapshot ID (e.g. "snap-1122aabb") of the snapshot to restore as the new cached volume. Specify this field if you want to create the iSCSI storage volume from a snapshot; otherwise, do not include this field. To list snapshots for your account use DescribeSnapshots in the Amazon Elastic Compute Cloud API Reference.
     */
    SnapshotId?: SnapshotId;
    /**
     * The name of the iSCSI target used by an initiator to connect to a volume and used as a suffix for the target ARN. For example, specifying TargetName as myvolume results in the target ARN of arn:aws:storagegateway:us-east-2:111122223333:gateway/sgw-12A3456B/target/iqn.1997-05.com.amazon:myvolume. The target name must be unique across all volumes on a gateway. If you don't specify a value, Storage Gateway uses the value that was previously used for this volume as the new target name.
     */
    TargetName: TargetName;
    /**
     * The ARN for an existing volume. Specifying this ARN makes the new volume into an exact copy of the specified existing volume's latest recovery point. The VolumeSizeInBytes value for this new volume must be equal to or larger than the size of the existing volume, in bytes.
     */
    SourceVolumeARN?: VolumeARN;
    /**
     * The network interface of the gateway on which to expose the iSCSI target. Only IPv4 addresses are accepted. Use DescribeGatewayInformation to get a list of the network interfaces available on a gateway. Valid Values: A valid IP address.
     */
    NetworkInterfaceId: NetworkInterfaceId;
    /**
     * A unique identifier that you use to retry a request. If you retry a request, use the same ClientToken you specified in the initial request.
     */
    ClientToken: ClientToken;
    /**
     * Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional. Valid Values: true | false 
     */
    KMSEncrypted?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of a symmetric customer master key (CMK) used for Amazon S3 server-side encryption. Storage Gateway does not support asymmetric CMKs. This value can only be set when KMSEncrypted is true. Optional.
     */
    KMSKey?: KMSKey;
    /**
     * A list of up to 50 tags that you can assign to a cached volume. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers that you can represent in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256 characters. 
     */
    Tags?: Tags;
  }
  export interface CreateCachediSCSIVolumeOutput {
    /**
     * The Amazon Resource Name (ARN) of the configured volume.
     */
    VolumeARN?: VolumeARN;
    /**
     * The Amazon Resource Name (ARN) of the volume target, which includes the iSCSI name that initiators can use to connect to the target.
     */
    TargetARN?: TargetARN;
  }
  export interface CreateNFSFileShareInput {
    /**
     * A unique string value that you supply that is used by S3 File Gateway to ensure idempotent file share creation.
     */
    ClientToken: ClientToken;
    /**
     * File share default values. Optional.
     */
    NFSFileShareDefaults?: NFSFileShareDefaults;
    /**
     * The Amazon Resource Name (ARN) of the S3 File Gateway on which you want to create a file share.
     */
    GatewayARN: GatewayARN;
    /**
     * Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional. Valid Values: true | false 
     */
    KMSEncrypted?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of a symmetric customer master key (CMK) used for Amazon S3 server-side encryption. Storage Gateway does not support asymmetric CMKs. This value can only be set when KMSEncrypted is true. Optional.
     */
    KMSKey?: KMSKey;
    /**
     * The ARN of the Identity and Access Management (IAM) role that an S3 File Gateway assumes when it accesses the underlying storage.
     */
    Role: Role;
    /**
     * A custom ARN for the backend storage used for storing data for file shares. It includes a resource ARN with an optional prefix concatenation. The prefix must end with a forward slash (/).  You can specify LocationARN as a bucket ARN, access point ARN or access point alias, as shown in the following examples. Bucket ARN:  arn:aws:s3:::my-bucket/prefix/  Access point ARN:  arn:aws:s3:region:account-id:accesspoint/access-point-name/prefix/  If you specify an access point, the bucket policy must be configured to delegate access control to the access point. For information, see Delegating access control to access points in the Amazon S3 User Guide. Access point alias:  test-ap-ab123cdef4gehijklmn5opqrstuvuse1a-s3alias  
     */
    LocationARN: LocationARN;
    /**
     * The default storage class for objects put into an Amazon S3 bucket by the S3 File Gateway. The default value is S3_STANDARD. Optional. Valid Values: S3_STANDARD | S3_INTELLIGENT_TIERING | S3_STANDARD_IA | S3_ONEZONE_IA 
     */
    DefaultStorageClass?: StorageClass;
    /**
     * A value that sets the access control list (ACL) permission for objects in the S3 bucket that a S3 File Gateway puts objects into. The default value is private.
     */
    ObjectACL?: ObjectACL;
    /**
     * The list of clients that are allowed to access the S3 File Gateway. The list must contain either valid IP addresses or valid CIDR blocks.
     */
    ClientList?: FileShareClientList;
    /**
     * A value that maps a user to anonymous user. Valid values are the following:    RootSquash: Only root is mapped to anonymous user.    NoSquash: No one is mapped to anonymous user.    AllSquash: Everyone is mapped to anonymous user.  
     */
    Squash?: Squash;
    /**
     * A value that sets the write status of a file share. Set this value to true to set the write status to read-only, otherwise set to false. Valid Values: true | false 
     */
    ReadOnly?: Boolean;
    /**
     * A value that enables guessing of the MIME type for uploaded objects based on file extensions. Set this value to true to enable MIME type guessing, otherwise set to false. The default value is true. Valid Values: true | false 
     */
    GuessMIMETypeEnabled?: Boolean;
    /**
     * A value that sets who pays the cost of the request and the cost associated with data download from the S3 bucket. If this value is set to true, the requester pays the costs; otherwise, the S3 bucket owner pays. However, the S3 bucket owner always pays the cost of storing data.   RequesterPays is a configuration for the S3 bucket that backs the file share, so make sure that the configuration on the file share is the same as the S3 bucket configuration.  Valid Values: true | false 
     */
    RequesterPays?: Boolean;
    /**
     * A list of up to 50 tags that can be assigned to the NFS file share. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256. 
     */
    Tags?: Tags;
    /**
     * The name of the file share. Optional.   FileShareName must be set if an S3 prefix name is set in LocationARN, or if an access point or access point alias is used. 
     */
    FileShareName?: FileShareName;
    /**
     * Specifies refresh cache information for the file share.
     */
    CacheAttributes?: CacheAttributes;
    /**
     * The notification policy of the file share. SettlingTimeInSeconds controls the number of seconds to wait after the last point in time a client wrote to a file before generating an ObjectUploaded notification. Because clients can make many small writes to files, it's best to set this parameter for as long as possible to avoid generating multiple notifications for the same file in a small time period.   SettlingTimeInSeconds has no effect on the timing of the object uploading to Amazon S3, only the timing of the notification.  The following example sets NotificationPolicy on with SettlingTimeInSeconds set to 60.  {\"Upload\": {\"SettlingTimeInSeconds\": 60}}  The following example sets NotificationPolicy off.  {} 
     */
    NotificationPolicy?: NotificationPolicy;
    /**
     * Specifies the DNS name for the VPC endpoint that the NFS file share uses to connect to Amazon S3.  This parameter is required for NFS file shares that connect to Amazon S3 through a VPC endpoint, a VPC access point, or an access point alias that points to a VPC access point. 
     */
    VPCEndpointDNSName?: DNSHostName;
    /**
     * Specifies the Region of the S3 bucket where the NFS file share stores files.  This parameter is required for NFS file shares that connect to Amazon S3 through a VPC endpoint, a VPC access point, or an access point alias that points to a VPC access point. 
     */
    BucketRegion?: RegionId;
    /**
     * The Amazon Resource Name (ARN) of the storage used for audit logs.
     */
    AuditDestinationARN?: AuditDestinationARN;
  }
  export interface CreateNFSFileShareOutput {
    /**
     * The Amazon Resource Name (ARN) of the newly created file share.
     */
    FileShareARN?: FileShareARN;
  }
  export interface CreateSMBFileShareInput {
    /**
     * A unique string value that you supply that is used by S3 File Gateway to ensure idempotent file share creation.
     */
    ClientToken: ClientToken;
    /**
     * The ARN of the S3 File Gateway on which you want to create a file share.
     */
    GatewayARN: GatewayARN;
    /**
     * Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional. Valid Values: true | false 
     */
    KMSEncrypted?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of a symmetric customer master key (CMK) used for Amazon S3 server-side encryption. Storage Gateway does not support asymmetric CMKs. This value can only be set when KMSEncrypted is true. Optional.
     */
    KMSKey?: KMSKey;
    /**
     * The ARN of the Identity and Access Management (IAM) role that an S3 File Gateway assumes when it accesses the underlying storage.
     */
    Role: Role;
    /**
     * A custom ARN for the backend storage used for storing data for file shares. It includes a resource ARN with an optional prefix concatenation. The prefix must end with a forward slash (/).  You can specify LocationARN as a bucket ARN, access point ARN or access point alias, as shown in the following examples. Bucket ARN:  arn:aws:s3:::my-bucket/prefix/  Access point ARN:  arn:aws:s3:region:account-id:accesspoint/access-point-name/prefix/  If you specify an access point, the bucket policy must be configured to delegate access control to the access point. For information, see Delegating access control to access points in the Amazon S3 User Guide. Access point alias:  test-ap-ab123cdef4gehijklmn5opqrstuvuse1a-s3alias  
     */
    LocationARN: LocationARN;
    /**
     * The default storage class for objects put into an Amazon S3 bucket by the S3 File Gateway. The default value is S3_STANDARD. Optional. Valid Values: S3_STANDARD | S3_INTELLIGENT_TIERING | S3_STANDARD_IA | S3_ONEZONE_IA 
     */
    DefaultStorageClass?: StorageClass;
    /**
     * A value that sets the access control list (ACL) permission for objects in the S3 bucket that a S3 File Gateway puts objects into. The default value is private.
     */
    ObjectACL?: ObjectACL;
    /**
     * A value that sets the write status of a file share. Set this value to true to set the write status to read-only, otherwise set to false. Valid Values: true | false 
     */
    ReadOnly?: Boolean;
    /**
     * A value that enables guessing of the MIME type for uploaded objects based on file extensions. Set this value to true to enable MIME type guessing, otherwise set to false. The default value is true. Valid Values: true | false 
     */
    GuessMIMETypeEnabled?: Boolean;
    /**
     * A value that sets who pays the cost of the request and the cost associated with data download from the S3 bucket. If this value is set to true, the requester pays the costs; otherwise, the S3 bucket owner pays. However, the S3 bucket owner always pays the cost of storing data.   RequesterPays is a configuration for the S3 bucket that backs the file share, so make sure that the configuration on the file share is the same as the S3 bucket configuration.  Valid Values: true | false 
     */
    RequesterPays?: Boolean;
    /**
     * Set this value to true to enable access control list (ACL) on the SMB file share. Set it to false to map file and directory permissions to the POSIX permissions. For more information, see Using Microsoft Windows ACLs to control access to an SMB file share in the Storage Gateway User Guide. Valid Values: true | false 
     */
    SMBACLEnabled?: Boolean;
    /**
     * The files and folders on this share will only be visible to users with read access.
     */
    AccessBasedEnumeration?: Boolean;
    /**
     * A list of users or groups in the Active Directory that will be granted administrator privileges on the file share. These users can do all file operations as the super-user. Acceptable formats include: DOMAIN\User1, user1, @group1, and @DOMAIN\group1.  Use this option very carefully, because any user in this list can do anything they like on the file share, regardless of file permissions. 
     */
    AdminUserList?: UserList;
    /**
     * A list of users or groups in the Active Directory that are allowed to access the file  share. A group must be prefixed with the @ character. Acceptable formats include: DOMAIN\User1, user1, @group1, and @DOMAIN\group1. Can only be set if Authentication is set to ActiveDirectory.
     */
    ValidUserList?: UserList;
    /**
     * A list of users or groups in the Active Directory that are not allowed to access the file share. A group must be prefixed with the @ character. Acceptable formats include: DOMAIN\User1, user1, @group1, and @DOMAIN\group1. Can only be set if Authentication is set to ActiveDirectory.
     */
    InvalidUserList?: UserList;
    /**
     * The Amazon Resource Name (ARN) of the storage used for audit logs.
     */
    AuditDestinationARN?: AuditDestinationARN;
    /**
     * The authentication method that users use to access the file share. The default is ActiveDirectory. Valid Values: ActiveDirectory | GuestAccess 
     */
    Authentication?: Authentication;
    /**
     * The case of an object name in an Amazon S3 bucket. For ClientSpecified, the client determines the case sensitivity. For CaseSensitive, the gateway determines the case sensitivity. The default value is ClientSpecified.
     */
    CaseSensitivity?: CaseSensitivity;
    /**
     * A list of up to 50 tags that can be assigned to the NFS file share. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256. 
     */
    Tags?: Tags;
    /**
     * The name of the file share. Optional.   FileShareName must be set if an S3 prefix name is set in LocationARN, or if an access point or access point alias is used. 
     */
    FileShareName?: FileShareName;
    /**
     * Specifies refresh cache information for the file share.
     */
    CacheAttributes?: CacheAttributes;
    /**
     * The notification policy of the file share. SettlingTimeInSeconds controls the number of seconds to wait after the last point in time a client wrote to a file before generating an ObjectUploaded notification. Because clients can make many small writes to files, it's best to set this parameter for as long as possible to avoid generating multiple notifications for the same file in a small time period.   SettlingTimeInSeconds has no effect on the timing of the object uploading to Amazon S3, only the timing of the notification.  The following example sets NotificationPolicy on with SettlingTimeInSeconds set to 60.  {\"Upload\": {\"SettlingTimeInSeconds\": 60}}  The following example sets NotificationPolicy off.  {} 
     */
    NotificationPolicy?: NotificationPolicy;
    /**
     * Specifies the DNS name for the VPC endpoint that the SMB file share uses to connect to Amazon S3.  This parameter is required for SMB file shares that connect to Amazon S3 through a VPC endpoint, a VPC access point, or an access point alias that points to a VPC access point. 
     */
    VPCEndpointDNSName?: DNSHostName;
    /**
     * Specifies the Region of the S3 bucket where the SMB file share stores files.  This parameter is required for SMB file shares that connect to Amazon S3 through a VPC endpoint, a VPC access point, or an access point alias that points to a VPC access point. 
     */
    BucketRegion?: RegionId;
    /**
     * Specifies whether opportunistic locking is enabled for the SMB file share.  Enabling opportunistic locking on case-sensitive shares is not recommended for workloads that involve access to files with the same name in different case.  Valid Values: true | false 
     */
    OplocksEnabled?: Boolean;
  }
  export interface CreateSMBFileShareOutput {
    /**
     * The Amazon Resource Name (ARN) of the newly created file share.
     */
    FileShareARN?: FileShareARN;
  }
  export interface CreateSnapshotFromVolumeRecoveryPointInput {
    /**
     * The Amazon Resource Name (ARN) of the iSCSI volume target. Use the DescribeStorediSCSIVolumes operation to return to retrieve the TargetARN for specified VolumeARN.
     */
    VolumeARN: VolumeARN;
    /**
     * Textual description of the snapshot that appears in the Amazon EC2 console, Elastic Block Store snapshots panel in the Description field, and in the Storage Gateway snapshot Details pane, Description field.
     */
    SnapshotDescription: SnapshotDescription;
    /**
     * A list of up to 50 tags that can be assigned to a snapshot. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256. 
     */
    Tags?: Tags;
  }
  export interface CreateSnapshotFromVolumeRecoveryPointOutput {
    /**
     * The ID of the snapshot.
     */
    SnapshotId?: SnapshotId;
    /**
     * The Amazon Resource Name (ARN) of the iSCSI volume target. Use the DescribeStorediSCSIVolumes operation to return to retrieve the TargetARN for specified VolumeARN.
     */
    VolumeARN?: VolumeARN;
    /**
     * The time the volume was created from the recovery point.
     */
    VolumeRecoveryPointTime?: string;
  }
  export interface CreateSnapshotInput {
    /**
     * The Amazon Resource Name (ARN) of the volume. Use the ListVolumes operation to return a list of gateway volumes.
     */
    VolumeARN: VolumeARN;
    /**
     * Textual description of the snapshot that appears in the Amazon EC2 console, Elastic Block Store snapshots panel in the Description field, and in the Storage Gateway snapshot Details pane, Description field.
     */
    SnapshotDescription: SnapshotDescription;
    /**
     * A list of up to 50 tags that can be assigned to a snapshot. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256. 
     */
    Tags?: Tags;
  }
  export interface CreateSnapshotOutput {
    /**
     * The Amazon Resource Name (ARN) of the volume of which the snapshot was taken.
     */
    VolumeARN?: VolumeARN;
    /**
     * The snapshot ID that is used to refer to the snapshot in future operations such as describing snapshots (Amazon Elastic Compute Cloud API DescribeSnapshots) or creating a volume from a snapshot (CreateStorediSCSIVolume).
     */
    SnapshotId?: SnapshotId;
  }
  export interface CreateStorediSCSIVolumeInput {
    GatewayARN: GatewayARN;
    /**
     * The unique identifier for the gateway local disk that is configured as a stored volume. Use ListLocalDisks to list disk IDs for a gateway.
     */
    DiskId: DiskId;
    /**
     * The snapshot ID (e.g., "snap-1122aabb") of the snapshot to restore as the new stored volume. Specify this field if you want to create the iSCSI storage volume from a snapshot; otherwise, do not include this field. To list snapshots for your account use DescribeSnapshots in the Amazon Elastic Compute Cloud API Reference.
     */
    SnapshotId?: SnapshotId;
    /**
     * Set to true if you want to preserve the data on the local disk. Otherwise, set to false to create an empty volume. Valid Values: true | false 
     */
    PreserveExistingData: boolean;
    /**
     * The name of the iSCSI target used by an initiator to connect to a volume and used as a suffix for the target ARN. For example, specifying TargetName as myvolume results in the target ARN of arn:aws:storagegateway:us-east-2:111122223333:gateway/sgw-12A3456B/target/iqn.1997-05.com.amazon:myvolume. The target name must be unique across all volumes on a gateway. If you don't specify a value, Storage Gateway uses the value that was previously used for this volume as the new target name.
     */
    TargetName: TargetName;
    /**
     * The network interface of the gateway on which to expose the iSCSI target. Only IPv4 addresses are accepted. Use DescribeGatewayInformation to get a list of the network interfaces available on a gateway. Valid Values: A valid IP address.
     */
    NetworkInterfaceId: NetworkInterfaceId;
    /**
     * Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional. Valid Values: true | false 
     */
    KMSEncrypted?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of a symmetric customer master key (CMK) used for Amazon S3 server-side encryption. Storage Gateway does not support asymmetric CMKs. This value can only be set when KMSEncrypted is true. Optional.
     */
    KMSKey?: KMSKey;
    /**
     * A list of up to 50 tags that can be assigned to a stored volume. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256. 
     */
    Tags?: Tags;
  }
  export interface CreateStorediSCSIVolumeOutput {
    /**
     * The Amazon Resource Name (ARN) of the configured volume.
     */
    VolumeARN?: VolumeARN;
    /**
     * The size of the volume in bytes.
     */
    VolumeSizeInBytes?: long;
    /**
     * The Amazon Resource Name (ARN) of the volume target, which includes the iSCSI name that initiators can use to connect to the target.
     */
    TargetARN?: TargetARN;
  }
  export interface CreateTapePoolInput {
    /**
     * The name of the new custom tape pool.
     */
    PoolName: PoolName;
    /**
     * The storage class that is associated with the new custom pool. When you use your backup application to eject the tape, the tape is archived directly into the storage class (S3 Glacier or S3 Glacier Deep Archive) that corresponds to the pool.
     */
    StorageClass: TapeStorageClass;
    /**
     * Tape retention lock can be configured in two modes. When configured in governance mode, Amazon Web Services accounts with specific IAM permissions are authorized to remove the tape retention lock from archived virtual tapes. When configured in compliance mode, the tape retention lock cannot be removed by any user, including the root Amazon Web Services account.
     */
    RetentionLockType?: RetentionLockType;
    /**
     * Tape retention lock time is set in days. Tape retention lock can be enabled for up to 100 years (36,500 days).
     */
    RetentionLockTimeInDays?: RetentionLockTimeInDays;
    /**
     * A list of up to 50 tags that can be assigned to tape pool. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256. 
     */
    Tags?: Tags;
  }
  export interface CreateTapePoolOutput {
    /**
     * The unique Amazon Resource Name (ARN) that represents the custom tape pool. Use the ListTapePools operation to return a list of tape pools for your account and Amazon Web Services Region.
     */
    PoolARN?: PoolARN;
  }
  export interface CreateTapeWithBarcodeInput {
    /**
     * The unique Amazon Resource Name (ARN) that represents the gateway to associate the virtual tape with. Use the ListGateways operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayARN: GatewayARN;
    /**
     * The size, in bytes, of the virtual tape that you want to create.  The size must be aligned by gigabyte (1024*1024*1024 bytes). 
     */
    TapeSizeInBytes: TapeSize;
    /**
     * The barcode that you want to assign to the tape.  Barcodes cannot be reused. This includes barcodes used for tapes that have been deleted. 
     */
    TapeBarcode: TapeBarcode;
    /**
     * Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional. Valid Values: true | false 
     */
    KMSEncrypted?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of a symmetric customer master key (CMK) used for Amazon S3 server-side encryption. Storage Gateway does not support asymmetric CMKs. This value can only be set when KMSEncrypted is true. Optional.
     */
    KMSKey?: KMSKey;
    /**
     * The ID of the pool that you want to add your tape to for archiving. The tape in this pool is archived in the S3 storage class that is associated with the pool. When you use your backup application to eject the tape, the tape is archived directly into the storage class (S3 Glacier or S3 Deep Archive) that corresponds to the pool.
     */
    PoolId?: PoolId;
    /**
     * Set to TRUE if the tape you are creating is to be configured as a write-once-read-many (WORM) tape.
     */
    Worm?: boolean;
    /**
     * A list of up to 50 tags that can be assigned to a virtual tape that has a barcode. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256. 
     */
    Tags?: Tags;
  }
  export interface CreateTapeWithBarcodeOutput {
    /**
     * A unique Amazon Resource Name (ARN) that represents the virtual tape that was created.
     */
    TapeARN?: TapeARN;
  }
  export interface CreateTapesInput {
    /**
     * The unique Amazon Resource Name (ARN) that represents the gateway to associate the virtual tapes with. Use the ListGateways operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayARN: GatewayARN;
    /**
     * The size, in bytes, of the virtual tapes that you want to create.  The size must be aligned by gigabyte (1024*1024*1024 bytes). 
     */
    TapeSizeInBytes: TapeSize;
    /**
     * A unique identifier that you use to retry a request. If you retry a request, use the same ClientToken you specified in the initial request.  Using the same ClientToken prevents creating the tape multiple times. 
     */
    ClientToken: ClientToken;
    /**
     * The number of virtual tapes that you want to create.
     */
    NumTapesToCreate: NumTapesToCreate;
    /**
     * A prefix that you append to the barcode of the virtual tape you are creating. This prefix makes the barcode unique.  The prefix must be 1-4 characters in length and must be one of the uppercase letters from A to Z. 
     */
    TapeBarcodePrefix: TapeBarcodePrefix;
    /**
     * Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional. Valid Values: true | false 
     */
    KMSEncrypted?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of a symmetric customer master key (CMK) used for Amazon S3 server-side encryption. Storage Gateway does not support asymmetric CMKs. This value can only be set when KMSEncrypted is true. Optional.
     */
    KMSKey?: KMSKey;
    /**
     * The ID of the pool that you want to add your tape to for archiving. The tape in this pool is archived in the S3 storage class that is associated with the pool. When you use your backup application to eject the tape, the tape is archived directly into the storage class (S3 Glacier or S3 Glacier Deep Archive) that corresponds to the pool.
     */
    PoolId?: PoolId;
    /**
     * Set to TRUE if the tape you are creating is to be configured as a write-once-read-many (WORM) tape.
     */
    Worm?: boolean;
    /**
     * A list of up to 50 tags that can be assigned to a virtual tape. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256. 
     */
    Tags?: Tags;
  }
  export interface CreateTapesOutput {
    /**
     * A list of unique Amazon Resource Names (ARNs) that represents the virtual tapes that were created.
     */
    TapeARNs?: TapeARNs;
  }
  export type CreatedDate = Date;
  export type DNSHostName = string;
  export type DayOfMonth = number;
  export type DayOfWeek = number;
  export type DaysOfWeek = DayOfWeek[];
  export interface DeleteAutomaticTapeCreationPolicyInput {
    GatewayARN: GatewayARN;
  }
  export interface DeleteAutomaticTapeCreationPolicyOutput {
    GatewayARN?: GatewayARN;
  }
  export interface DeleteBandwidthRateLimitInput {
    GatewayARN: GatewayARN;
    /**
     * One of the BandwidthType values that indicates the gateway bandwidth rate limit to delete. Valid Values: UPLOAD | DOWNLOAD | ALL 
     */
    BandwidthType: BandwidthType;
  }
  export interface DeleteBandwidthRateLimitOutput {
    GatewayARN?: GatewayARN;
  }
  export interface DeleteChapCredentialsInput {
    /**
     * The Amazon Resource Name (ARN) of the iSCSI volume target. Use the DescribeStorediSCSIVolumes operation to return to retrieve the TargetARN for specified VolumeARN.
     */
    TargetARN: TargetARN;
    /**
     * The iSCSI initiator that connects to the target.
     */
    InitiatorName: IqnName;
  }
  export interface DeleteChapCredentialsOutput {
    /**
     * The Amazon Resource Name (ARN) of the target.
     */
    TargetARN?: TargetARN;
    /**
     * The iSCSI initiator that connects to the target.
     */
    InitiatorName?: IqnName;
  }
  export interface DeleteFileShareInput {
    /**
     * The Amazon Resource Name (ARN) of the file share to be deleted.
     */
    FileShareARN: FileShareARN;
    /**
     * If this value is set to true, the operation deletes a file share immediately and aborts all data uploads to Amazon Web Services. Otherwise, the file share is not deleted until all data is uploaded to Amazon Web Services. This process aborts the data upload process, and the file share enters the FORCE_DELETING status. Valid Values: true | false 
     */
    ForceDelete?: boolean;
  }
  export interface DeleteFileShareOutput {
    /**
     * The Amazon Resource Name (ARN) of the deleted file share.
     */
    FileShareARN?: FileShareARN;
  }
  export interface DeleteGatewayInput {
    GatewayARN: GatewayARN;
  }
  export interface DeleteGatewayOutput {
    GatewayARN?: GatewayARN;
  }
  export interface DeleteSnapshotScheduleInput {
    /**
     * The volume which snapshot schedule to delete.
     */
    VolumeARN: VolumeARN;
  }
  export interface DeleteSnapshotScheduleOutput {
    /**
     * The volume which snapshot schedule was deleted.
     */
    VolumeARN?: VolumeARN;
  }
  export interface DeleteTapeArchiveInput {
    /**
     * The Amazon Resource Name (ARN) of the virtual tape to delete from the virtual tape shelf (VTS).
     */
    TapeARN: TapeARN;
    /**
     * Set to TRUE to delete an archived tape that belongs to a custom pool with tape retention lock. Only archived tapes with tape retention lock set to governance can be deleted. Archived tapes with tape retention lock set to compliance can't be deleted.
     */
    BypassGovernanceRetention?: boolean;
  }
  export interface DeleteTapeArchiveOutput {
    /**
     * The Amazon Resource Name (ARN) of the virtual tape that was deleted from the virtual tape shelf (VTS).
     */
    TapeARN?: TapeARN;
  }
  export interface DeleteTapeInput {
    /**
     * The unique Amazon Resource Name (ARN) of the gateway that the virtual tape to delete is associated with. Use the ListGateways operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayARN: GatewayARN;
    /**
     * The Amazon Resource Name (ARN) of the virtual tape to delete.
     */
    TapeARN: TapeARN;
    /**
     * Set to TRUE to delete an archived tape that belongs to a custom pool with tape retention lock. Only archived tapes with tape retention lock set to governance can be deleted. Archived tapes with tape retention lock set to compliance can't be deleted.
     */
    BypassGovernanceRetention?: boolean;
  }
  export interface DeleteTapeOutput {
    /**
     * The Amazon Resource Name (ARN) of the deleted virtual tape.
     */
    TapeARN?: TapeARN;
  }
  export interface DeleteTapePoolInput {
    /**
     * The Amazon Resource Name (ARN) of the custom tape pool to delete.
     */
    PoolARN: PoolARN;
  }
  export interface DeleteTapePoolOutput {
    /**
     * The Amazon Resource Name (ARN) of the custom tape pool being deleted.
     */
    PoolARN?: PoolARN;
  }
  export interface DeleteVolumeInput {
    /**
     * The Amazon Resource Name (ARN) of the volume. Use the ListVolumes operation to return a list of gateway volumes.
     */
    VolumeARN: VolumeARN;
  }
  export interface DeleteVolumeOutput {
    /**
     * The Amazon Resource Name (ARN) of the storage volume that was deleted. It is the same ARN you provided in the request.
     */
    VolumeARN?: VolumeARN;
  }
  export type DeprecationDate = string;
  export interface DescribeAvailabilityMonitorTestInput {
    GatewayARN: GatewayARN;
  }
  export interface DescribeAvailabilityMonitorTestOutput {
    GatewayARN?: GatewayARN;
    /**
     * The status of the high availability monitoring test. If a test hasn't been performed, the value of this field is null.
     */
    Status?: AvailabilityMonitorTestStatus;
    /**
     * The time the high availability monitoring test was started. If a test hasn't been performed, the value of this field is null.
     */
    StartTime?: Time;
  }
  export interface DescribeBandwidthRateLimitInput {
    GatewayARN: GatewayARN;
  }
  export interface DescribeBandwidthRateLimitOutput {
    GatewayARN?: GatewayARN;
    /**
     * The average upload bandwidth rate limit in bits per second. This field does not appear in the response if the upload rate limit is not set.
     */
    AverageUploadRateLimitInBitsPerSec?: BandwidthUploadRateLimit;
    /**
     * The average download bandwidth rate limit in bits per second. This field does not appear in the response if the download rate limit is not set.
     */
    AverageDownloadRateLimitInBitsPerSec?: BandwidthDownloadRateLimit;
  }
  export interface DescribeBandwidthRateLimitScheduleInput {
    GatewayARN: GatewayARN;
  }
  export interface DescribeBandwidthRateLimitScheduleOutput {
    GatewayARN?: GatewayARN;
    /**
     *  An array that contains the bandwidth rate limit intervals for a tape or volume gateway. 
     */
    BandwidthRateLimitIntervals?: BandwidthRateLimitIntervals;
  }
  export interface DescribeCacheInput {
    GatewayARN: GatewayARN;
  }
  export interface DescribeCacheOutput {
    GatewayARN?: GatewayARN;
    /**
     * An array of strings that identify disks that are to be configured as working storage. Each string has a minimum length of 1 and maximum length of 300. You can get the disk IDs from the ListLocalDisks API.
     */
    DiskIds?: DiskIds;
    /**
     * The amount of cache in bytes allocated to a gateway.
     */
    CacheAllocatedInBytes?: long;
    /**
     * Percent use of the gateway's cache storage. This metric applies only to the gateway-cached volume setup. The sample is taken at the end of the reporting period.
     */
    CacheUsedPercentage?: double;
    /**
     * The file share's contribution to the overall percentage of the gateway's cache that has not been persisted to Amazon Web Services. The sample is taken at the end of the reporting period.
     */
    CacheDirtyPercentage?: double;
    /**
     * Percent of application read operations from the file shares that are served from cache. The sample is taken at the end of the reporting period.
     */
    CacheHitPercentage?: double;
    /**
     * Percent of application read operations from the file shares that are not served from cache. The sample is taken at the end of the reporting period.
     */
    CacheMissPercentage?: double;
  }
  export interface DescribeCachediSCSIVolumesInput {
    /**
     * An array of strings where each string represents the Amazon Resource Name (ARN) of a cached volume. All of the specified cached volumes must be from the same gateway. Use ListVolumes to get volume ARNs for a gateway.
     */
    VolumeARNs: VolumeARNs;
  }
  export interface DescribeCachediSCSIVolumesOutput {
    /**
     * An array of objects where each object contains metadata about one cached volume.
     */
    CachediSCSIVolumes?: CachediSCSIVolumes;
  }
  export interface DescribeChapCredentialsInput {
    /**
     * The Amazon Resource Name (ARN) of the iSCSI volume target. Use the DescribeStorediSCSIVolumes operation to return to retrieve the TargetARN for specified VolumeARN.
     */
    TargetARN: TargetARN;
  }
  export interface DescribeChapCredentialsOutput {
    /**
     * An array of ChapInfo objects that represent CHAP credentials. Each object in the array contains CHAP credential information for one target-initiator pair. If no CHAP credentials are set, an empty array is returned. CHAP credential information is provided in a JSON object with the following fields:    InitiatorName: The iSCSI initiator that connects to the target.    SecretToAuthenticateInitiator: The secret key that the initiator (for example, the Windows client) must provide to participate in mutual CHAP with the target.    SecretToAuthenticateTarget: The secret key that the target must provide to participate in mutual CHAP with the initiator (e.g. Windows client).    TargetARN: The Amazon Resource Name (ARN) of the storage volume.  
     */
    ChapCredentials?: ChapCredentials;
  }
  export interface DescribeFileSystemAssociationsInput {
    /**
     * An array containing the Amazon Resource Name (ARN) of each file system association to be described.
     */
    FileSystemAssociationARNList: FileSystemAssociationARNList;
  }
  export interface DescribeFileSystemAssociationsOutput {
    /**
     * An array containing the FileSystemAssociationInfo data type of each file system association to be described. 
     */
    FileSystemAssociationInfoList?: FileSystemAssociationInfoList;
  }
  export interface DescribeGatewayInformationInput {
    GatewayARN: GatewayARN;
  }
  export interface DescribeGatewayInformationOutput {
    GatewayARN?: GatewayARN;
    /**
     * The unique identifier assigned to your gateway during activation. This ID becomes part of the gateway Amazon Resource Name (ARN), which you use as input for other operations.
     */
    GatewayId?: GatewayId;
    /**
     * The name you configured for your gateway.
     */
    GatewayName?: string;
    /**
     * A value that indicates the time zone configured for the gateway.
     */
    GatewayTimezone?: GatewayTimezone;
    /**
     * A value that indicates the operating state of the gateway.
     */
    GatewayState?: GatewayState;
    /**
     * A NetworkInterface array that contains descriptions of the gateway network interfaces.
     */
    GatewayNetworkInterfaces?: GatewayNetworkInterfaces;
    /**
     * The type of the gateway.
     */
    GatewayType?: GatewayType;
    /**
     * The date on which an update to the gateway is available. This date is in the time zone of the gateway. If the gateway is not available for an update this field is not returned in the response.
     */
    NextUpdateAvailabilityDate?: NextUpdateAvailabilityDate;
    /**
     * The date on which the last software update was applied to the gateway. If the gateway has never been updated, this field does not return a value in the response. This only only exist and returns once it have been chosen and set by the SGW service, based on the OS version of the gateway VM
     */
    LastSoftwareUpdate?: LastSoftwareUpdate;
    /**
     * The ID of the Amazon EC2 instance that was used to launch the gateway.
     */
    Ec2InstanceId?: Ec2InstanceId;
    /**
     * The Amazon Web Services Region where the Amazon EC2 instance is located.
     */
    Ec2InstanceRegion?: Ec2InstanceRegion;
    /**
     * A list of up to 50 tags assigned to the gateway, sorted alphabetically by key name. Each tag is a key-value pair. For a gateway with more than 10 tags assigned, you can view all tags using the ListTagsForResource API operation.
     */
    Tags?: Tags;
    /**
     * The configuration settings for the virtual private cloud (VPC) endpoint for your gateway.
     */
    VPCEndpoint?: string;
    /**
     * The Amazon Resource Name (ARN) of the Amazon CloudWatch log group that is used to monitor events in the gateway. This field only only exist and returns once it have been chosen and set by the SGW service, based on the OS version of the gateway VM
     */
    CloudWatchLogGroupARN?: CloudWatchLogGroupARN;
    /**
     * The type of hardware or software platform on which the gateway is running.
     */
    HostEnvironment?: HostEnvironment;
    /**
     * The type of endpoint for your gateway. Valid Values: STANDARD | FIPS 
     */
    EndpointType?: EndpointType;
    /**
     * Date after which this gateway will not receive software updates for new features.
     */
    SoftwareUpdatesEndDate?: SoftwareUpdatesEndDate;
    /**
     * Date after which this gateway will not receive software updates for new features and bug fixes.
     */
    DeprecationDate?: DeprecationDate;
    /**
     * Specifies the size of the gateway's metadata cache.
     */
    GatewayCapacity?: GatewayCapacity;
    /**
     * A list of the metadata cache sizes that the gateway can support based on its current hardware specifications.
     */
    SupportedGatewayCapacities?: SupportedGatewayCapacities;
    /**
     * A unique identifier for the specific instance of the host platform running the gateway. This value is only available for certain host environments, and its format depends on the host environment type.
     */
    HostEnvironmentId?: HostEnvironmentId;
    /**
     * The version number of the software running on the gateway appliance.
     */
    SoftwareVersion?: SoftwareVersion;
  }
  export interface DescribeMaintenanceStartTimeInput {
    GatewayARN: GatewayARN;
  }
  export interface DescribeMaintenanceStartTimeOutput {
    GatewayARN?: GatewayARN;
    /**
     * The hour component of the maintenance start time represented as hh, where hh is the hour (0 to 23). The hour of the day is in the time zone of the gateway.
     */
    HourOfDay?: HourOfDay;
    /**
     * The minute component of the maintenance start time represented as mm, where mm is the minute (0 to 59). The minute of the hour is in the time zone of the gateway.
     */
    MinuteOfHour?: MinuteOfHour;
    /**
     * An ordinal number between 0 and 6 that represents the day of the week, where 0 represents Sunday and 6 represents Saturday. The day of week is in the time zone of the gateway.
     */
    DayOfWeek?: DayOfWeek;
    /**
     * The day of the month component of the maintenance start time represented as an ordinal number from 1 to 28, where 1 represents the first day of the month and 28 represents the last day of the month.
     */
    DayOfMonth?: DayOfMonth;
    /**
     * A value that indicates the time zone that is set for the gateway. The start time and day of week specified should be in the time zone of the gateway.
     */
    Timezone?: GatewayTimezone;
  }
  export interface DescribeNFSFileSharesInput {
    /**
     * An array containing the Amazon Resource Name (ARN) of each file share to be described.
     */
    FileShareARNList: FileShareARNList;
  }
  export interface DescribeNFSFileSharesOutput {
    /**
     * An array containing a description for each requested file share.
     */
    NFSFileShareInfoList?: NFSFileShareInfoList;
  }
  export interface DescribeSMBFileSharesInput {
    /**
     * An array containing the Amazon Resource Name (ARN) of each file share to be described.
     */
    FileShareARNList: FileShareARNList;
  }
  export interface DescribeSMBFileSharesOutput {
    /**
     * An array containing a description for each requested file share.
     */
    SMBFileShareInfoList?: SMBFileShareInfoList;
  }
  export interface DescribeSMBSettingsInput {
    GatewayARN: GatewayARN;
  }
  export interface DescribeSMBSettingsOutput {
    GatewayARN?: GatewayARN;
    /**
     * The name of the domain that the gateway is joined to.
     */
    DomainName?: DomainName;
    /**
     * Indicates the status of a gateway that is a member of the Active Directory domain.    ACCESS_DENIED: Indicates that the JoinDomain operation failed due to an authentication error.    DETACHED: Indicates that gateway is not joined to a domain.    JOINED: Indicates that the gateway has successfully joined a domain.    JOINING: Indicates that a JoinDomain operation is in progress.    NETWORK_ERROR: Indicates that JoinDomain operation failed due to a network or connectivity error.    TIMEOUT: Indicates that the JoinDomain operation failed because the operation didn't complete within the allotted time.    UNKNOWN_ERROR: Indicates that the JoinDomain operation failed due to another type of error.  
     */
    ActiveDirectoryStatus?: ActiveDirectoryStatus;
    /**
     * This value is true if a password for the guest user smbguest is set, otherwise false. Only supported for S3 File Gateways. Valid Values: true | false 
     */
    SMBGuestPasswordSet?: Boolean;
    /**
     * The type of security strategy that was specified for file gateway.    ClientSpecified: If you use this option, requests are established based on what is negotiated by the client. This option is recommended when you want to maximize compatibility across different clients in your environment. Only supported for S3 File Gateways.    MandatorySigning: If you use this option, file gateway only allows connections from SMBv2 or SMBv3 clients that have signing enabled. This option works with SMB clients on Microsoft Windows Vista, Windows Server 2008 or newer.    MandatoryEncryption: If you use this option, file gateway only allows connections from SMBv3 clients that have encryption enabled. This option is highly recommended for environments that handle sensitive data. This option works with SMB clients on Microsoft Windows 8, Windows Server 2012 or newer.  
     */
    SMBSecurityStrategy?: SMBSecurityStrategy;
    /**
     * The shares on this gateway appear when listing shares. Only supported for S3 File Gateways. 
     */
    FileSharesVisible?: Boolean;
    /**
     * A list of Active Directory users and groups that have special permissions for SMB file shares on the gateway.
     */
    SMBLocalGroups?: SMBLocalGroups;
  }
  export interface DescribeSnapshotScheduleInput {
    /**
     * The Amazon Resource Name (ARN) of the volume. Use the ListVolumes operation to return a list of gateway volumes.
     */
    VolumeARN: VolumeARN;
  }
  export interface DescribeSnapshotScheduleOutput {
    /**
     * The Amazon Resource Name (ARN) of the volume that was specified in the request.
     */
    VolumeARN?: VolumeARN;
    /**
     * The hour of the day at which the snapshot schedule begins represented as hh, where hh is the hour (0 to 23). The hour of the day is in the time zone of the gateway.
     */
    StartAt?: HourOfDay;
    /**
     * The number of hours between snapshots.
     */
    RecurrenceInHours?: RecurrenceInHours;
    /**
     * The snapshot description.
     */
    Description?: Description;
    /**
     * A value that indicates the time zone of the gateway.
     */
    Timezone?: GatewayTimezone;
    /**
     * A list of up to 50 tags assigned to the snapshot schedule, sorted alphabetically by key name. Each tag is a key-value pair. For a gateway with more than 10 tags assigned, you can view all tags using the ListTagsForResource API operation.
     */
    Tags?: Tags;
  }
  export interface DescribeStorediSCSIVolumesInput {
    /**
     * An array of strings where each string represents the Amazon Resource Name (ARN) of a stored volume. All of the specified stored volumes must be from the same gateway. Use ListVolumes to get volume ARNs for a gateway.
     */
    VolumeARNs: VolumeARNs;
  }
  export interface DescribeStorediSCSIVolumesOutput {
    /**
     * Describes a single unit of output from DescribeStorediSCSIVolumes. The following fields are returned:    ChapEnabled: Indicates whether mutual CHAP is enabled for the iSCSI target.    LunNumber: The logical disk number.    NetworkInterfaceId: The network interface ID of the stored volume that initiator use to map the stored volume as an iSCSI target.    NetworkInterfacePort: The port used to communicate with iSCSI targets.    PreservedExistingData: Indicates when the stored volume was created, existing data on the underlying local disk was preserved.    SourceSnapshotId: If the stored volume was created from a snapshot, this field contains the snapshot ID used, e.g. snap-1122aabb. Otherwise, this field is not included.    StorediSCSIVolumes: An array of StorediSCSIVolume objects where each object contains metadata about one stored volume.    TargetARN: The Amazon Resource Name (ARN) of the volume target.    VolumeARN: The Amazon Resource Name (ARN) of the stored volume.    VolumeDiskId: The disk ID of the local disk that was specified in the CreateStorediSCSIVolume operation.    VolumeId: The unique identifier of the storage volume, e.g. vol-1122AABB.    VolumeiSCSIAttributes: An VolumeiSCSIAttributes object that represents a collection of iSCSI attributes for one stored volume.    VolumeProgress: Represents the percentage complete if the volume is restoring or bootstrapping that represents the percent of data transferred. This field does not appear in the response if the stored volume is not restoring or bootstrapping.    VolumeSizeInBytes: The size of the volume in bytes.    VolumeStatus: One of the VolumeStatus values that indicates the state of the volume.    VolumeType: One of the enumeration values describing the type of the volume. Currently, only STORED volumes are supported.  
     */
    StorediSCSIVolumes?: StorediSCSIVolumes;
  }
  export interface DescribeTapeArchivesInput {
    /**
     * Specifies one or more unique Amazon Resource Names (ARNs) that represent the virtual tapes you want to describe.
     */
    TapeARNs?: TapeARNs;
    /**
     * An opaque string that indicates the position at which to begin describing virtual tapes.
     */
    Marker?: Marker;
    /**
     * Specifies that the number of virtual tapes described be limited to the specified number.
     */
    Limit?: PositiveIntObject;
  }
  export interface DescribeTapeArchivesOutput {
    /**
     * An array of virtual tape objects in the virtual tape shelf (VTS). The description includes of the Amazon Resource Name (ARN) of the virtual tapes. The information returned includes the Amazon Resource Names (ARNs) of the tapes, size of the tapes, status of the tapes, progress of the description, and tape barcode.
     */
    TapeArchives?: TapeArchives;
    /**
     * An opaque string that indicates the position at which the virtual tapes that were fetched for description ended. Use this marker in your next request to fetch the next set of virtual tapes in the virtual tape shelf (VTS). If there are no more virtual tapes to describe, this field does not appear in the response.
     */
    Marker?: Marker;
  }
  export interface DescribeTapeRecoveryPointsInput {
    GatewayARN: GatewayARN;
    /**
     * An opaque string that indicates the position at which to begin describing the virtual tape recovery points.
     */
    Marker?: Marker;
    /**
     * Specifies that the number of virtual tape recovery points that are described be limited to the specified number.
     */
    Limit?: PositiveIntObject;
  }
  export interface DescribeTapeRecoveryPointsOutput {
    GatewayARN?: GatewayARN;
    /**
     * An array of TapeRecoveryPointInfos that are available for the specified gateway.
     */
    TapeRecoveryPointInfos?: TapeRecoveryPointInfos;
    /**
     * An opaque string that indicates the position at which the virtual tape recovery points that were listed for description ended. Use this marker in your next request to list the next set of virtual tape recovery points in the list. If there are no more recovery points to describe, this field does not appear in the response.
     */
    Marker?: Marker;
  }
  export interface DescribeTapesInput {
    GatewayARN: GatewayARN;
    /**
     * Specifies one or more unique Amazon Resource Names (ARNs) that represent the virtual tapes you want to describe. If this parameter is not specified, Tape gateway returns a description of all virtual tapes associated with the specified gateway.
     */
    TapeARNs?: TapeARNs;
    /**
     * A marker value, obtained in a previous call to DescribeTapes. This marker indicates which page of results to retrieve. If not specified, the first page of results is retrieved.
     */
    Marker?: Marker;
    /**
     * Specifies that the number of virtual tapes described be limited to the specified number.  Amazon Web Services may impose its own limit, if this field is not set. 
     */
    Limit?: PositiveIntObject;
  }
  export interface DescribeTapesOutput {
    /**
     * An array of virtual tape descriptions.
     */
    Tapes?: Tapes;
    /**
     * An opaque string that can be used as part of a subsequent DescribeTapes call to retrieve the next page of results. If a response does not contain a marker, then there are no more results to be retrieved.
     */
    Marker?: Marker;
  }
  export interface DescribeUploadBufferInput {
    GatewayARN: GatewayARN;
  }
  export interface DescribeUploadBufferOutput {
    GatewayARN?: GatewayARN;
    /**
     * An array of the gateway's local disk IDs that are configured as working storage. Each local disk ID is specified as a string (minimum length of 1 and maximum length of 300). If no local disks are configured as working storage, then the DiskIds array is empty.
     */
    DiskIds?: DiskIds;
    /**
     * The total number of bytes being used in the gateway's upload buffer.
     */
    UploadBufferUsedInBytes?: long;
    /**
     * The total number of bytes allocated in the gateway's as upload buffer.
     */
    UploadBufferAllocatedInBytes?: long;
  }
  export interface DescribeVTLDevicesInput {
    GatewayARN: GatewayARN;
    /**
     * An array of strings, where each string represents the Amazon Resource Name (ARN) of a VTL device.  All of the specified VTL devices must be from the same gateway. If no VTL devices are specified, the result will contain all devices on the specified gateway. 
     */
    VTLDeviceARNs?: VTLDeviceARNs;
    /**
     * An opaque string that indicates the position at which to begin describing the VTL devices.
     */
    Marker?: Marker;
    /**
     * Specifies that the number of VTL devices described be limited to the specified number.
     */
    Limit?: PositiveIntObject;
  }
  export interface DescribeVTLDevicesOutput {
    GatewayARN?: GatewayARN;
    /**
     * An array of VTL device objects composed of the Amazon Resource Name (ARN) of the VTL devices.
     */
    VTLDevices?: VTLDevices;
    /**
     * An opaque string that indicates the position at which the VTL devices that were fetched for description ended. Use the marker in your next request to fetch the next set of VTL devices in the list. If there are no more VTL devices to describe, this field does not appear in the response.
     */
    Marker?: Marker;
  }
  export interface DescribeWorkingStorageInput {
    GatewayARN: GatewayARN;
  }
  export interface DescribeWorkingStorageOutput {
    GatewayARN?: GatewayARN;
    /**
     * An array of the gateway's local disk IDs that are configured as working storage. Each local disk ID is specified as a string (minimum length of 1 and maximum length of 300). If no local disks are configured as working storage, then the DiskIds array is empty.
     */
    DiskIds?: DiskIds;
    /**
     * The total working storage in bytes in use by the gateway. If no working storage is configured for the gateway, this field returns 0.
     */
    WorkingStorageUsedInBytes?: long;
    /**
     * The total working storage in bytes allocated for the gateway. If no working storage is configured for the gateway, this field returns 0.
     */
    WorkingStorageAllocatedInBytes?: long;
  }
  export type Description = string;
  export interface DetachVolumeInput {
    /**
     * The Amazon Resource Name (ARN) of the volume to detach from the gateway.
     */
    VolumeARN: VolumeARN;
    /**
     * Set to true to forcibly remove the iSCSI connection of the target volume and detach the volume. The default is false. If this value is set to false, you must manually disconnect the iSCSI connection from the target volume. Valid Values: true | false 
     */
    ForceDetach?: Boolean;
  }
  export interface DetachVolumeOutput {
    /**
     * The Amazon Resource Name (ARN) of the volume that was detached.
     */
    VolumeARN?: VolumeARN;
  }
  export type DeviceType = string;
  export interface DeviceiSCSIAttributes {
    /**
     * Specifies the unique Amazon Resource Name (ARN) that encodes the iSCSI qualified name(iqn) of a tape drive or media changer target.
     */
    TargetARN?: TargetARN;
    /**
     * The network interface identifier of the VTL device.
     */
    NetworkInterfaceId?: NetworkInterfaceId;
    /**
     * The port used to communicate with iSCSI VTL device targets.
     */
    NetworkInterfacePort?: integer;
    /**
     * Indicates whether mutual CHAP is enabled for the iSCSI target.
     */
    ChapEnabled?: boolean;
  }
  export interface DisableGatewayInput {
    GatewayARN: GatewayARN;
  }
  export interface DisableGatewayOutput {
    /**
     * The unique Amazon Resource Name (ARN) of the disabled gateway.
     */
    GatewayARN?: GatewayARN;
  }
  export interface DisassociateFileSystemInput {
    /**
     * The Amazon Resource Name (ARN) of the file system association to be deleted.
     */
    FileSystemAssociationARN: FileSystemAssociationARN;
    /**
     * If this value is set to true, the operation disassociates an Amazon FSx file system immediately. It ends all data uploads to the file system, and the file system association enters the FORCE_DELETING status. If this value is set to false, the Amazon FSx file system does not disassociate until all data is uploaded.
     */
    ForceDelete?: boolean;
  }
  export interface DisassociateFileSystemOutput {
    /**
     * The Amazon Resource Name (ARN) of the deleted file system association.
     */
    FileSystemAssociationARN?: FileSystemAssociationARN;
  }
  export interface Disk {
    /**
     * The unique device ID or other distinguishing data that identifies a local disk.
     */
    DiskId?: DiskId;
    /**
     * The path of a local disk in the gateway virtual machine (VM).
     */
    DiskPath?: string;
    /**
     * The device node of a local disk as assigned by the virtualization environment.
     */
    DiskNode?: string;
    /**
     * A value that represents the status of a local disk.
     */
    DiskStatus?: string;
    /**
     * The local disk size in bytes.
     */
    DiskSizeInBytes?: long;
    DiskAllocationType?: DiskAllocationType;
    /**
     * The iSCSI qualified name (IQN) that is defined for a disk. This field is not included in the response if the local disk is not defined as an iSCSI target. The format of this field is targetIqn::LUNNumber::region-volumeId.
     */
    DiskAllocationResource?: string;
    DiskAttributeList?: DiskAttributeList;
  }
  export type DiskAllocationType = string;
  export type DiskAttribute = string;
  export type DiskAttributeList = DiskAttribute[];
  export type DiskId = string;
  export type DiskIds = DiskId[];
  export type Disks = Disk[];
  export type DomainName = string;
  export type DomainUserName = string;
  export type DomainUserPassword = string;
  export type DoubleObject = number;
  export type Ec2InstanceId = string;
  export type Ec2InstanceRegion = string;
  export interface EndpointNetworkConfiguration {
    /**
     * A list of gateway IP addresses on which the associated Amazon FSx file system is available.  If multiple file systems are associated with this gateway, this field is required. 
     */
    IpAddresses?: IpAddressList;
  }
  export type EndpointType = string;
  export type FileShareARN = string;
  export type FileShareARNList = FileShareARN[];
  export type FileShareClientList = IPV4AddressCIDR[];
  export type FileShareId = string;
  export interface FileShareInfo {
    FileShareType?: FileShareType;
    FileShareARN?: FileShareARN;
    FileShareId?: FileShareId;
    FileShareStatus?: FileShareStatus;
    GatewayARN?: GatewayARN;
  }
  export type FileShareInfoList = FileShareInfo[];
  export type FileShareName = string;
  export type FileShareStatus = string;
  export type FileShareType = "NFS"|"SMB"|string;
  export type FileSystemAssociationARN = string;
  export type FileSystemAssociationARNList = FileSystemAssociationARN[];
  export type FileSystemAssociationId = string;
  export interface FileSystemAssociationInfo {
    /**
     * The Amazon Resource Name (ARN) of the file system association.
     */
    FileSystemAssociationARN?: FileSystemAssociationARN;
    /**
     * The ARN of the backend Amazon FSx file system used for storing file data. For information, see FileSystem in the Amazon FSx API Reference.
     */
    LocationARN?: FileSystemLocationARN;
    /**
     * The status of the file system association. Valid Values: AVAILABLE | CREATING | DELETING | FORCE_DELETING | UPDATING | ERROR 
     */
    FileSystemAssociationStatus?: FileSystemAssociationStatus;
    /**
     * The Amazon Resource Name (ARN) of the storage used for the audit logs.
     */
    AuditDestinationARN?: AuditDestinationARN;
    GatewayARN?: GatewayARN;
    /**
     * A list of up to 50 tags assigned to the SMB file share, sorted alphabetically by key name. Each tag is a key-value pair.
     */
    Tags?: Tags;
    CacheAttributes?: CacheAttributes;
    /**
     * Specifies network configuration information for the gateway associated with the Amazon FSx file system.  If multiple file systems are associated with this gateway, this parameter's IpAddresses field is required. 
     */
    EndpointNetworkConfiguration?: EndpointNetworkConfiguration;
    /**
     * An array containing the FileSystemAssociationStatusDetail data type, which provides detailed information on file system association status.
     */
    FileSystemAssociationStatusDetails?: FileSystemAssociationStatusDetails;
  }
  export type FileSystemAssociationInfoList = FileSystemAssociationInfo[];
  export type FileSystemAssociationStatus = string;
  export interface FileSystemAssociationStatusDetail {
    /**
     * The error code for a given file system association status.
     */
    ErrorCode?: FileSystemAssociationSyncErrorCode;
  }
  export type FileSystemAssociationStatusDetails = FileSystemAssociationStatusDetail[];
  export interface FileSystemAssociationSummary {
    /**
     * The ID of the file system association.
     */
    FileSystemAssociationId?: FileSystemAssociationId;
    /**
     * The Amazon Resource Name (ARN) of the file system association.
     */
    FileSystemAssociationARN?: FileSystemAssociationARN;
    /**
     * The status of the file share. Valid Values: AVAILABLE | CREATING | DELETING | FORCE_DELETING | UPDATING | ERROR 
     */
    FileSystemAssociationStatus?: FileSystemAssociationStatus;
    GatewayARN?: GatewayARN;
  }
  export type FileSystemAssociationSummaryList = FileSystemAssociationSummary[];
  export type FileSystemAssociationSyncErrorCode = string;
  export type FileSystemLocationARN = string;
  export type Folder = string;
  export type FolderList = Folder[];
  export type GatewayARN = string;
  export type GatewayCapacity = "Small"|"Medium"|"Large"|string;
  export type GatewayId = string;
  export interface GatewayInfo {
    /**
     * The unique identifier assigned to your gateway during activation. This ID becomes part of the gateway Amazon Resource Name (ARN), which you use as input for other operations.
     */
    GatewayId?: GatewayId;
    /**
     * The Amazon Resource Name (ARN) of the gateway. Use the ListGateways operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayARN?: GatewayARN;
    /**
     * The type of the gateway.
     */
    GatewayType?: GatewayType;
    /**
     * The state of the gateway. Valid Values: DISABLED | ACTIVE 
     */
    GatewayOperationalState?: GatewayOperationalState;
    /**
     * The name of the gateway.
     */
    GatewayName?: string;
    /**
     * The ID of the Amazon EC2 instance that was used to launch the gateway.
     */
    Ec2InstanceId?: Ec2InstanceId;
    /**
     * The Amazon Web Services Region where the Amazon EC2 instance is located.
     */
    Ec2InstanceRegion?: Ec2InstanceRegion;
    /**
     * The type of hardware or software platform on which the gateway is running.
     */
    HostEnvironment?: HostEnvironment;
    /**
     * A unique identifier for the specific instance of the host platform running the gateway. This value is only available for certain host environments, and its format depends on the host environment type.
     */
    HostEnvironmentId?: HostEnvironmentId;
  }
  export type GatewayName = string;
  export type GatewayNetworkInterfaces = NetworkInterface[];
  export type GatewayOperationalState = string;
  export type GatewayState = string;
  export type GatewayTimezone = string;
  export type GatewayType = string;
  export type Gateways = GatewayInfo[];
  export type Host = string;
  export type HostEnvironment = "VMWARE"|"HYPER-V"|"EC2"|"KVM"|"OTHER"|"SNOWBALL"|string;
  export type HostEnvironmentId = string;
  export type Hosts = Host[];
  export type HourOfDay = number;
  export type IPV4Address = string;
  export type IPV4AddressCIDR = string;
  export type Initiator = string;
  export type Initiators = Initiator[];
  export type IpAddressList = IPV4Address[];
  export type IqnName = string;
  export interface JoinDomainInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway. Use the ListGateways operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayARN: GatewayARN;
    /**
     * The name of the domain that you want the gateway to join.
     */
    DomainName: DomainName;
    /**
     * The organizational unit (OU) is a container in an Active Directory that can hold users, groups, computers, and other OUs and this parameter specifies the OU that the gateway will join within the AD domain.
     */
    OrganizationalUnit?: OrganizationalUnit;
    /**
     * List of IPv4 addresses, NetBIOS names, or host names of your domain server. If you need to specify the port number include it after the colon (“:”). For example, mydc.mydomain.com:389.
     */
    DomainControllers?: Hosts;
    /**
     * Specifies the time in seconds, in which the JoinDomain operation must complete. The default is 20 seconds.
     */
    TimeoutInSeconds?: TimeoutInSeconds;
    /**
     * Sets the user name of user who has permission to add the gateway to the Active Directory domain. The domain user account should be enabled to join computers to the domain. For example, you can use the domain administrator account or an account with delegated permissions to join computers to the domain.
     */
    UserName: DomainUserName;
    /**
     * Sets the password of the user who has permission to add the gateway to the Active Directory domain.
     */
    Password: DomainUserPassword;
  }
  export interface JoinDomainOutput {
    /**
     * The unique Amazon Resource Name (ARN) of the gateway that joined the domain.
     */
    GatewayARN?: GatewayARN;
    /**
     * Indicates the status of the gateway as a member of the Active Directory domain.    ACCESS_DENIED: Indicates that the JoinDomain operation failed due to an authentication error.    DETACHED: Indicates that gateway is not joined to a domain.    JOINED: Indicates that the gateway has successfully joined a domain.    JOINING: Indicates that a JoinDomain operation is in progress.    NETWORK_ERROR: Indicates that JoinDomain operation failed due to a network or connectivity error.    TIMEOUT: Indicates that the JoinDomain operation failed because the operation didn't complete within the allotted time.    UNKNOWN_ERROR: Indicates that the JoinDomain operation failed due to another type of error.  
     */
    ActiveDirectoryStatus?: ActiveDirectoryStatus;
  }
  export type KMSKey = string;
  export type LastSoftwareUpdate = string;
  export interface ListAutomaticTapeCreationPoliciesInput {
    GatewayARN?: GatewayARN;
  }
  export interface ListAutomaticTapeCreationPoliciesOutput {
    /**
     * Gets a listing of information about the gateway's automatic tape creation policies, including the automatic tape creation rules and the gateway that is using the policies.
     */
    AutomaticTapeCreationPolicyInfos?: AutomaticTapeCreationPolicyInfos;
  }
  export interface ListFileSharesInput {
    /**
     * The Amazon Resource Name (ARN) of the gateway whose file shares you want to list. If this field is not present, all file shares under your account are listed.
     */
    GatewayARN?: GatewayARN;
    /**
     * The maximum number of file shares to return in the response. The value must be an integer with a value greater than zero. Optional.
     */
    Limit?: PositiveIntObject;
    /**
     * Opaque pagination token returned from a previous ListFileShares operation. If present, Marker specifies where to continue the list from after a previous call to ListFileShares. Optional.
     */
    Marker?: Marker;
  }
  export interface ListFileSharesOutput {
    /**
     * If the request includes Marker, the response returns that value in this field.
     */
    Marker?: Marker;
    /**
     * If a value is present, there are more file shares to return. In a subsequent request, use NextMarker as the value for Marker to retrieve the next set of file shares.
     */
    NextMarker?: Marker;
    /**
     * An array of information about the S3 File Gateway's file shares.
     */
    FileShareInfoList?: FileShareInfoList;
  }
  export interface ListFileSystemAssociationsInput {
    GatewayARN?: GatewayARN;
    /**
     * The maximum number of file system associations to return in the response. If present, Limit must be an integer with a value greater than zero. Optional.
     */
    Limit?: PositiveIntObject;
    /**
     * Opaque pagination token returned from a previous ListFileSystemAssociations operation. If present, Marker specifies where to continue the list from after a previous call to ListFileSystemAssociations. Optional.
     */
    Marker?: Marker;
  }
  export interface ListFileSystemAssociationsOutput {
    /**
     * If the request includes Marker, the response returns that value in this field.
     */
    Marker?: Marker;
    /**
     * If a value is present, there are more file system associations to return. In a subsequent request, use NextMarker as the value for Marker to retrieve the next set of file system associations.
     */
    NextMarker?: Marker;
    /**
     * An array of information about the Amazon FSx gateway's file system associations.
     */
    FileSystemAssociationSummaryList?: FileSystemAssociationSummaryList;
  }
  export interface ListGatewaysInput {
    /**
     * An opaque string that indicates the position at which to begin the returned list of gateways.
     */
    Marker?: Marker;
    /**
     * Specifies that the list of gateways returned be limited to the specified number of items.
     */
    Limit?: PositiveIntObject;
  }
  export interface ListGatewaysOutput {
    /**
     * An array of GatewayInfo objects.
     */
    Gateways?: Gateways;
    /**
     * Use the marker in your next request to fetch the next set of gateways in the list. If there are no more gateways to list, this field does not appear in the response.
     */
    Marker?: Marker;
  }
  export interface ListLocalDisksInput {
    GatewayARN: GatewayARN;
  }
  export interface ListLocalDisksOutput {
    GatewayARN?: GatewayARN;
    /**
     * A JSON object containing the following fields:    ListLocalDisksOutput$Disks   
     */
    Disks?: Disks;
  }
  export interface ListTagsForResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource for which you want to list tags.
     */
    ResourceARN: ResourceARN;
    /**
     * An opaque string that indicates the position at which to begin returning the list of tags.
     */
    Marker?: Marker;
    /**
     * Specifies that the list of tags returned be limited to the specified number of items.
     */
    Limit?: PositiveIntObject;
  }
  export interface ListTagsForResourceOutput {
    /**
     * The Amazon Resource Name (ARN) of the resource for which you want to list tags.
     */
    ResourceARN?: ResourceARN;
    /**
     * An opaque string that indicates the position at which to stop returning the list of tags.
     */
    Marker?: Marker;
    /**
     * An array that contains the tags for the specified resource.
     */
    Tags?: Tags;
  }
  export interface ListTapePoolsInput {
    /**
     * The Amazon Resource Name (ARN) of each of the custom tape pools you want to list. If you don't specify a custom tape pool ARN, the response lists all custom tape pools. 
     */
    PoolARNs?: PoolARNs;
    /**
     * A string that indicates the position at which to begin the returned list of tape pools.
     */
    Marker?: Marker;
    /**
     * An optional number limit for the tape pools in the list returned by this call.
     */
    Limit?: PositiveIntObject;
  }
  export interface ListTapePoolsOutput {
    /**
     * An array of PoolInfo objects, where each object describes a single custom tape pool. If there are no custom tape pools, the PoolInfos is an empty array. 
     */
    PoolInfos?: PoolInfos;
    /**
     * A string that indicates the position at which to begin the returned list of tape pools. Use the marker in your next request to continue pagination of tape pools. If there are no more tape pools to list, this element does not appear in the response body. 
     */
    Marker?: Marker;
  }
  export interface ListTapesInput {
    TapeARNs?: TapeARNs;
    /**
     * A string that indicates the position at which to begin the returned list of tapes.
     */
    Marker?: Marker;
    /**
     * An optional number limit for the tapes in the list returned by this call.
     */
    Limit?: PositiveIntObject;
  }
  export interface ListTapesOutput {
    TapeInfos?: TapeInfos;
    /**
     * A string that indicates the position at which to begin returning the next list of tapes. Use the marker in your next request to continue pagination of tapes. If there are no more tapes to list, this element does not appear in the response body.
     */
    Marker?: Marker;
  }
  export interface ListVolumeInitiatorsInput {
    /**
     * The Amazon Resource Name (ARN) of the volume. Use the ListVolumes operation to return a list of gateway volumes for the gateway.
     */
    VolumeARN: VolumeARN;
  }
  export interface ListVolumeInitiatorsOutput {
    /**
     * The host names and port numbers of all iSCSI initiators that are connected to the gateway.
     */
    Initiators?: Initiators;
  }
  export interface ListVolumeRecoveryPointsInput {
    GatewayARN: GatewayARN;
  }
  export interface ListVolumeRecoveryPointsOutput {
    GatewayARN?: GatewayARN;
    /**
     * An array of VolumeRecoveryPointInfo objects.
     */
    VolumeRecoveryPointInfos?: VolumeRecoveryPointInfos;
  }
  export interface ListVolumesInput {
    GatewayARN?: GatewayARN;
    /**
     * A string that indicates the position at which to begin the returned list of volumes. Obtain the marker from the response of a previous List iSCSI Volumes request.
     */
    Marker?: Marker;
    /**
     * Specifies that the list of volumes returned be limited to the specified number of items.
     */
    Limit?: PositiveIntObject;
  }
  export interface ListVolumesOutput {
    GatewayARN?: GatewayARN;
    /**
     * Use the marker in your next request to continue pagination of iSCSI volumes. If there are no more volumes to list, this field does not appear in the response body.
     */
    Marker?: Marker;
    /**
     * An array of VolumeInfo objects, where each object describes an iSCSI volume. If no volumes are defined for the gateway, then VolumeInfos is an empty array "[]".
     */
    VolumeInfos?: VolumeInfos;
  }
  export type LocalConsolePassword = string;
  export type LocationARN = string;
  export type Marker = string;
  export type MediumChangerType = string;
  export type MinimumNumTapes = number;
  export type MinuteOfHour = number;
  export interface NFSFileShareDefaults {
    /**
     * The Unix file mode in the form "nnnn". For example, 0666 represents the default file mode inside the file share. The default value is 0666.
     */
    FileMode?: PermissionMode;
    /**
     * The Unix directory mode in the form "nnnn". For example, 0666 represents the default access mode for all directories inside the file share. The default value is 0777.
     */
    DirectoryMode?: PermissionMode;
    /**
     * The default group ID for the file share (unless the files have another group ID specified). The default value is nfsnobody.
     */
    GroupId?: PermissionId;
    /**
     * The default owner ID for files in the file share (unless the files have another owner ID specified). The default value is nfsnobody.
     */
    OwnerId?: PermissionId;
  }
  export interface NFSFileShareInfo {
    NFSFileShareDefaults?: NFSFileShareDefaults;
    FileShareARN?: FileShareARN;
    FileShareId?: FileShareId;
    FileShareStatus?: FileShareStatus;
    GatewayARN?: GatewayARN;
    /**
     * Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional. Valid Values: true | false 
     */
    KMSEncrypted?: boolean;
    KMSKey?: KMSKey;
    Path?: Path;
    Role?: Role;
    LocationARN?: LocationARN;
    /**
     * The default storage class for objects put into an Amazon S3 bucket by the S3 File Gateway. The default value is S3_STANDARD. Optional. Valid Values: S3_STANDARD | S3_INTELLIGENT_TIERING | S3_STANDARD_IA | S3_ONEZONE_IA 
     */
    DefaultStorageClass?: StorageClass;
    ObjectACL?: ObjectACL;
    ClientList?: FileShareClientList;
    Squash?: Squash;
    /**
     * A value that sets the write status of a file share. Set this value to true to set the write status to read-only, otherwise set to false. Valid Values: true | false 
     */
    ReadOnly?: Boolean;
    /**
     * A value that enables guessing of the MIME type for uploaded objects based on file extensions. Set this value to true to enable MIME type guessing, otherwise set to false. The default value is true. Valid Values: true | false 
     */
    GuessMIMETypeEnabled?: Boolean;
    /**
     * A value that sets who pays the cost of the request and the cost associated with data download from the S3 bucket. If this value is set to true, the requester pays the costs; otherwise, the S3 bucket owner pays. However, the S3 bucket owner always pays the cost of storing data.   RequesterPays is a configuration for the S3 bucket that backs the file share, so make sure that the configuration on the file share is the same as the S3 bucket configuration.  Valid Values: true | false 
     */
    RequesterPays?: Boolean;
    /**
     * A list of up to 50 tags assigned to the NFS file share, sorted alphabetically by key name. Each tag is a key-value pair. For a gateway with more than 10 tags assigned, you can view all tags using the ListTagsForResource API operation.
     */
    Tags?: Tags;
    /**
     * The name of the file share. Optional.   FileShareName must be set if an S3 prefix name is set in LocationARN, or if an access point or access point alias is used. 
     */
    FileShareName?: FileShareName;
    /**
     * Refresh cache information for the file share.
     */
    CacheAttributes?: CacheAttributes;
    /**
     * The notification policy of the file share. SettlingTimeInSeconds controls the number of seconds to wait after the last point in time a client wrote to a file before generating an ObjectUploaded notification. Because clients can make many small writes to files, it's best to set this parameter for as long as possible to avoid generating multiple notifications for the same file in a small time period.   SettlingTimeInSeconds has no effect on the timing of the object uploading to Amazon S3, only the timing of the notification.  The following example sets NotificationPolicy on with SettlingTimeInSeconds set to 60.  {\"Upload\": {\"SettlingTimeInSeconds\": 60}}  The following example sets NotificationPolicy off.  {} 
     */
    NotificationPolicy?: NotificationPolicy;
    /**
     * Specifies the DNS name for the VPC endpoint that the NFS file share uses to connect to Amazon S3.  This parameter is required for NFS file shares that connect to Amazon S3 through a VPC endpoint, a VPC access point, or an access point alias that points to a VPC access point. 
     */
    VPCEndpointDNSName?: DNSHostName;
    /**
     * Specifies the Region of the S3 bucket where the NFS file share stores files.  This parameter is required for NFS file shares that connect to Amazon S3 through a VPC endpoint, a VPC access point, or an access point alias that points to a VPC access point. 
     */
    BucketRegion?: RegionId;
    /**
     * The Amazon Resource Name (ARN) of the storage used for audit logs.
     */
    AuditDestinationARN?: AuditDestinationARN;
  }
  export type NFSFileShareInfoList = NFSFileShareInfo[];
  export interface NetworkInterface {
    /**
     * The Internet Protocol version 4 (IPv4) address of the interface.
     */
    Ipv4Address?: string;
    /**
     * The Media Access Control (MAC) address of the interface.  This is currently unsupported and will not be returned in output. 
     */
    MacAddress?: string;
    /**
     * The Internet Protocol version 6 (IPv6) address of the interface. Currently not supported.
     */
    Ipv6Address?: string;
  }
  export type NetworkInterfaceId = string;
  export type NextUpdateAvailabilityDate = string;
  export type NotificationId = string;
  export type NotificationPolicy = string;
  export interface NotifyWhenUploadedInput {
    FileShareARN: FileShareARN;
  }
  export interface NotifyWhenUploadedOutput {
    FileShareARN?: FileShareARN;
    NotificationId?: NotificationId;
  }
  export type NumTapesToCreate = number;
  export type ObjectACL = "private"|"public-read"|"public-read-write"|"authenticated-read"|"bucket-owner-read"|"bucket-owner-full-control"|"aws-exec-read"|string;
  export type OrganizationalUnit = string;
  export type Path = string;
  export type PermissionId = number;
  export type PermissionMode = string;
  export type PoolARN = string;
  export type PoolARNs = PoolARN[];
  export type PoolId = string;
  export interface PoolInfo {
    /**
     * The Amazon Resource Name (ARN) of the custom tape pool. Use the ListTapePools operation to return a list of custom tape pools for your account and Amazon Web Services Region.
     */
    PoolARN?: PoolARN;
    /**
     * The name of the custom tape pool. PoolName can use all ASCII characters, except '/' and '\'.
     */
    PoolName?: PoolName;
    /**
     * The storage class that is associated with the custom pool. When you use your backup application to eject the tape, the tape is archived directly into the storage class (S3 Glacier or S3 Glacier Deep Archive) that corresponds to the pool.
     */
    StorageClass?: TapeStorageClass;
    /**
     * Tape retention lock type, which can be configured in two modes. When configured in governance mode, Amazon Web Services accounts with specific IAM permissions are authorized to remove the tape retention lock from archived virtual tapes. When configured in compliance mode, the tape retention lock cannot be removed by any user, including the root Amazon Web Services account.
     */
    RetentionLockType?: RetentionLockType;
    /**
     * Tape retention lock time is set in days. Tape retention lock can be enabled for up to 100 years (36,500 days).
     */
    RetentionLockTimeInDays?: RetentionLockTimeInDays;
    /**
     * Status of the custom tape pool. Pool can be ACTIVE or DELETED.
     */
    PoolStatus?: PoolStatus;
  }
  export type PoolInfos = PoolInfo[];
  export type PoolName = string;
  export type PoolStatus = "ACTIVE"|"DELETED"|string;
  export type PositiveIntObject = number;
  export type RecurrenceInHours = number;
  export interface RefreshCacheInput {
    /**
     * The Amazon Resource Name (ARN) of the file share you want to refresh.
     */
    FileShareARN: FileShareARN;
    /**
     * A comma-separated list of the paths of folders to refresh in the cache. The default is ["/"]. The default refreshes objects and folders at the root of the Amazon S3 bucket. If Recursive is set to true, the entire S3 bucket that the file share has access to is refreshed.
     */
    FolderList?: FolderList;
    /**
     * A value that specifies whether to recursively refresh folders in the cache. The refresh includes folders that were in the cache the last time the gateway listed the folder's contents. If this value set to true, each folder that is listed in FolderList is recursively updated. Otherwise, subfolders listed in FolderList are not refreshed. Only objects that are in folders listed directly under FolderList are found and used for the update. The default is true. Valid Values: true | false 
     */
    Recursive?: Boolean;
  }
  export interface RefreshCacheOutput {
    FileShareARN?: FileShareARN;
    NotificationId?: NotificationId;
  }
  export type RegionId = string;
  export interface RemoveTagsFromResourceInput {
    /**
     * The Amazon Resource Name (ARN) of the resource you want to remove the tags from.
     */
    ResourceARN: ResourceARN;
    /**
     * The keys of the tags you want to remove from the specified resource. A tag is composed of a key-value pair.
     */
    TagKeys: TagKeys;
  }
  export interface RemoveTagsFromResourceOutput {
    /**
     * The Amazon Resource Name (ARN) of the resource that the tags were removed from.
     */
    ResourceARN?: ResourceARN;
  }
  export interface ResetCacheInput {
    GatewayARN: GatewayARN;
  }
  export interface ResetCacheOutput {
    GatewayARN?: GatewayARN;
  }
  export type ResourceARN = string;
  export type RetentionLockTimeInDays = number;
  export type RetentionLockType = "COMPLIANCE"|"GOVERNANCE"|"NONE"|string;
  export interface RetrieveTapeArchiveInput {
    /**
     * The Amazon Resource Name (ARN) of the virtual tape you want to retrieve from the virtual tape shelf (VTS).
     */
    TapeARN: TapeARN;
    /**
     * The Amazon Resource Name (ARN) of the gateway you want to retrieve the virtual tape to. Use the ListGateways operation to return a list of gateways for your account and Amazon Web Services Region. You retrieve archived virtual tapes to only one gateway and the gateway must be a tape gateway.
     */
    GatewayARN: GatewayARN;
  }
  export interface RetrieveTapeArchiveOutput {
    /**
     * The Amazon Resource Name (ARN) of the retrieved virtual tape.
     */
    TapeARN?: TapeARN;
  }
  export interface RetrieveTapeRecoveryPointInput {
    /**
     * The Amazon Resource Name (ARN) of the virtual tape for which you want to retrieve the recovery point.
     */
    TapeARN: TapeARN;
    GatewayARN: GatewayARN;
  }
  export interface RetrieveTapeRecoveryPointOutput {
    /**
     * The Amazon Resource Name (ARN) of the virtual tape for which the recovery point was retrieved.
     */
    TapeARN?: TapeARN;
  }
  export type Role = string;
  export interface SMBFileShareInfo {
    FileShareARN?: FileShareARN;
    FileShareId?: FileShareId;
    FileShareStatus?: FileShareStatus;
    GatewayARN?: GatewayARN;
    /**
     * Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional. Valid Values: true | false 
     */
    KMSEncrypted?: boolean;
    KMSKey?: KMSKey;
    /**
     * The file share path used by the SMB client to identify the mount point.
     */
    Path?: Path;
    Role?: Role;
    LocationARN?: LocationARN;
    /**
     * The default storage class for objects put into an Amazon S3 bucket by the S3 File Gateway. The default value is S3_STANDARD. Optional. Valid Values: S3_STANDARD | S3_INTELLIGENT_TIERING | S3_STANDARD_IA | S3_ONEZONE_IA 
     */
    DefaultStorageClass?: StorageClass;
    ObjectACL?: ObjectACL;
    /**
     * A value that sets the write status of a file share. Set this value to true to set the write status to read-only, otherwise set to false. Valid Values: true | false 
     */
    ReadOnly?: Boolean;
    /**
     * A value that enables guessing of the MIME type for uploaded objects based on file extensions. Set this value to true to enable MIME type guessing, otherwise set to false. The default value is true. Valid Values: true | false 
     */
    GuessMIMETypeEnabled?: Boolean;
    /**
     * A value that sets who pays the cost of the request and the cost associated with data download from the S3 bucket. If this value is set to true, the requester pays the costs; otherwise, the S3 bucket owner pays. However, the S3 bucket owner always pays the cost of storing data.   RequesterPays is a configuration for the S3 bucket that backs the file share, so make sure that the configuration on the file share is the same as the S3 bucket configuration.  Valid Values: true | false 
     */
    RequesterPays?: Boolean;
    /**
     * If this value is set to true, it indicates that access control list (ACL) is enabled on the SMB file share. If it is set to false, it indicates that file and directory permissions are mapped to the POSIX permission. For more information, see Using Microsoft Windows ACLs to control access to an SMB file share in the Storage Gateway User Guide.
     */
    SMBACLEnabled?: Boolean;
    /**
     * Indicates whether AccessBasedEnumeration is enabled.
     */
    AccessBasedEnumeration?: Boolean;
    /**
     * A list of users or groups in the Active Directory that have administrator rights to the file share. A group must be prefixed with the @ character. Acceptable formats include: DOMAIN\User1, user1, @group1, and @DOMAIN\group1. Can only be set if Authentication is set to ActiveDirectory.
     */
    AdminUserList?: UserList;
    /**
     * A list of users or groups in the Active Directory that are allowed to access the file share. A group must be prefixed with the @ character. Acceptable formats include: DOMAIN\User1, user1, @group1, and @DOMAIN\group1. Can only be set if Authentication is set to ActiveDirectory.
     */
    ValidUserList?: UserList;
    /**
     * A list of users or groups in the Active Directory that are not allowed to access the file share. A group must be prefixed with the @ character. Acceptable formats include: DOMAIN\User1, user1, @group1, and @DOMAIN\group1. Can only be set if Authentication is set to ActiveDirectory.
     */
    InvalidUserList?: UserList;
    /**
     * The Amazon Resource Name (ARN) of the storage used for audit logs.
     */
    AuditDestinationARN?: AuditDestinationARN;
    Authentication?: Authentication;
    /**
     * The case of an object name in an Amazon S3 bucket. For ClientSpecified, the client determines the case sensitivity. For CaseSensitive, the gateway determines the case sensitivity. The default value is ClientSpecified.
     */
    CaseSensitivity?: CaseSensitivity;
    /**
     * A list of up to 50 tags assigned to the SMB file share, sorted alphabetically by key name. Each tag is a key-value pair. For a gateway with more than 10 tags assigned, you can view all tags using the ListTagsForResource API operation.
     */
    Tags?: Tags;
    /**
     * The name of the file share. Optional.   FileShareName must be set if an S3 prefix name is set in LocationARN, or if an access point or access point alias is used. 
     */
    FileShareName?: FileShareName;
    /**
     * Refresh cache information for the file share.
     */
    CacheAttributes?: CacheAttributes;
    /**
     * The notification policy of the file share. SettlingTimeInSeconds controls the number of seconds to wait after the last point in time a client wrote to a file before generating an ObjectUploaded notification. Because clients can make many small writes to files, it's best to set this parameter for as long as possible to avoid generating multiple notifications for the same file in a small time period.   SettlingTimeInSeconds has no effect on the timing of the object uploading to Amazon S3, only the timing of the notification.  The following example sets NotificationPolicy on with SettlingTimeInSeconds set to 60.  {\"Upload\": {\"SettlingTimeInSeconds\": 60}}  The following example sets NotificationPolicy off.  {} 
     */
    NotificationPolicy?: NotificationPolicy;
    /**
     * Specifies the DNS name for the VPC endpoint that the SMB file share uses to connect to Amazon S3.  This parameter is required for SMB file shares that connect to Amazon S3 through a VPC endpoint, a VPC access point, or an access point alias that points to a VPC access point. 
     */
    VPCEndpointDNSName?: DNSHostName;
    /**
     * Specifies the Region of the S3 bucket where the SMB file share stores files.  This parameter is required for SMB file shares that connect to Amazon S3 through a VPC endpoint, a VPC access point, or an access point alias that points to a VPC access point. 
     */
    BucketRegion?: RegionId;
    /**
     * Specifies whether opportunistic locking is enabled for the SMB file share.  Enabling opportunistic locking on case-sensitive shares is not recommended for workloads that involve access to files with the same name in different case.  Valid Values: true | false 
     */
    OplocksEnabled?: Boolean;
  }
  export type SMBFileShareInfoList = SMBFileShareInfo[];
  export type SMBGuestPassword = string;
  export interface SMBLocalGroups {
    /**
     * A list of Active Directory users and groups that have local Gateway Admin permissions. Acceptable formats include: DOMAIN\User1, user1, DOMAIN\group1, and group1. Gateway Admins can use the Shared Folders Microsoft Management Console snap-in to force-close files that are open and locked.
     */
    GatewayAdmins?: UserList;
  }
  export type SMBSecurityStrategy = "ClientSpecified"|"MandatorySigning"|"MandatoryEncryption"|string;
  export interface SetLocalConsolePasswordInput {
    GatewayARN: GatewayARN;
    /**
     * The password you want to set for your VM local console.
     */
    LocalConsolePassword: LocalConsolePassword;
  }
  export interface SetLocalConsolePasswordOutput {
    GatewayARN?: GatewayARN;
  }
  export interface SetSMBGuestPasswordInput {
    /**
     * The Amazon Resource Name (ARN) of the S3 File Gateway the SMB file share is associated with.
     */
    GatewayARN: GatewayARN;
    /**
     * The password that you want to set for your SMB server.
     */
    Password: SMBGuestPassword;
  }
  export interface SetSMBGuestPasswordOutput {
    GatewayARN?: GatewayARN;
  }
  export interface ShutdownGatewayInput {
    GatewayARN: GatewayARN;
  }
  export interface ShutdownGatewayOutput {
    GatewayARN?: GatewayARN;
  }
  export type SnapshotDescription = string;
  export type SnapshotId = string;
  export type SoftwareUpdatesEndDate = string;
  export type SoftwareVersion = string;
  export type Squash = string;
  export interface StartAvailabilityMonitorTestInput {
    GatewayARN: GatewayARN;
  }
  export interface StartAvailabilityMonitorTestOutput {
    GatewayARN?: GatewayARN;
  }
  export interface StartGatewayInput {
    GatewayARN: GatewayARN;
  }
  export interface StartGatewayOutput {
    GatewayARN?: GatewayARN;
  }
  export type StorageClass = string;
  export interface StorediSCSIVolume {
    /**
     * The Amazon Resource Name (ARN) of the storage volume.
     */
    VolumeARN?: VolumeARN;
    /**
     * The unique identifier of the volume, e.g., vol-AE4B946D.
     */
    VolumeId?: VolumeId;
    /**
     * One of the VolumeType enumeration values describing the type of the volume.
     */
    VolumeType?: VolumeType;
    /**
     * One of the VolumeStatus values that indicates the state of the storage volume.
     */
    VolumeStatus?: VolumeStatus;
    /**
     * A value that indicates whether a storage volume is attached to, detached from, or is in the process of detaching from a gateway. For more information, see Moving your volumes to a different gateway.
     */
    VolumeAttachmentStatus?: VolumeAttachmentStatus;
    /**
     * The size of the volume in bytes.
     */
    VolumeSizeInBytes?: long;
    /**
     * Represents the percentage complete if the volume is restoring or bootstrapping that represents the percent of data transferred. This field does not appear in the response if the stored volume is not restoring or bootstrapping.
     */
    VolumeProgress?: DoubleObject;
    /**
     * The ID of the local disk that was specified in the CreateStorediSCSIVolume operation.
     */
    VolumeDiskId?: DiskId;
    /**
     * If the stored volume was created from a snapshot, this field contains the snapshot ID used, e.g. snap-78e22663. Otherwise, this field is not included.
     */
    SourceSnapshotId?: SnapshotId;
    /**
     * Indicates if when the stored volume was created, existing data on the underlying local disk was preserved. Valid Values: true | false 
     */
    PreservedExistingData?: boolean;
    /**
     * An VolumeiSCSIAttributes object that represents a collection of iSCSI attributes for one stored volume.
     */
    VolumeiSCSIAttributes?: VolumeiSCSIAttributes;
    /**
     * The date the volume was created. Volumes created prior to March 28, 2017 don’t have this timestamp.
     */
    CreatedDate?: CreatedDate;
    /**
     * The size of the data stored on the volume in bytes. This value is calculated based on the number of blocks that are touched, instead of the actual amount of data written. This value can be useful for sequential write patterns but less accurate for random write patterns. VolumeUsedInBytes is different from the compressed size of the volume, which is the value that is used to calculate your bill.  This value is not available for volumes created prior to May 13, 2015, until you store data on the volume. 
     */
    VolumeUsedInBytes?: VolumeUsedInBytes;
    KMSKey?: KMSKey;
    /**
     * The name of the iSCSI target used by an initiator to connect to a volume and used as a suffix for the target ARN. For example, specifying TargetName as myvolume results in the target ARN of arn:aws:storagegateway:us-east-2:111122223333:gateway/sgw-12A3456B/target/iqn.1997-05.com.amazon:myvolume. The target name must be unique across all volumes on a gateway. If you don't specify a value, Storage Gateway uses the value that was previously used for this volume as the new target name.
     */
    TargetName?: TargetName;
  }
  export type StorediSCSIVolumes = StorediSCSIVolume[];
  export type SupportedGatewayCapacities = GatewayCapacity[];
  export interface Tag {
    /**
     * Tag key. The key can't start with aws:.
     */
    Key: TagKey;
    /**
     * Value of the tag key.
     */
    Value: TagValue;
  }
  export type TagKey = string;
  export type TagKeys = TagKey[];
  export type TagValue = string;
  export type Tags = Tag[];
  export interface Tape {
    /**
     * The Amazon Resource Name (ARN) of the virtual tape.
     */
    TapeARN?: TapeARN;
    /**
     * The barcode that identifies a specific virtual tape.
     */
    TapeBarcode?: TapeBarcode;
    /**
     * The date the virtual tape was created.
     */
    TapeCreatedDate?: Time;
    /**
     * The size, in bytes, of the virtual tape capacity.
     */
    TapeSizeInBytes?: TapeSize;
    /**
     * The current state of the virtual tape.
     */
    TapeStatus?: TapeStatus;
    /**
     * The virtual tape library (VTL) device that the virtual tape is associated with.
     */
    VTLDevice?: VTLDeviceARN;
    /**
     * For archiving virtual tapes, indicates how much data remains to be uploaded before archiving is complete. Range: 0 (not started) to 100 (complete).
     */
    Progress?: DoubleObject;
    /**
     * The size, in bytes, of data stored on the virtual tape.  This value is not available for tapes created prior to May 13, 2015. 
     */
    TapeUsedInBytes?: TapeUsage;
    KMSKey?: KMSKey;
    /**
     * The ID of the pool that contains tapes that will be archived. The tapes in this pool are archived in the S3 storage class that is associated with the pool. When you use your backup application to eject the tape, the tape is archived directly into the storage class (S3 Glacier or S3 Glacier Deep Archive) that corresponds to the pool.
     */
    PoolId?: PoolId;
    /**
     * If the tape is archived as write-once-read-many (WORM), this value is true.
     */
    Worm?: boolean;
    /**
     * The date that the tape is first archived with tape retention lock enabled.
     */
    RetentionStartDate?: Time;
    /**
     * The date that the tape enters a custom tape pool.
     */
    PoolEntryDate?: Time;
  }
  export type TapeARN = string;
  export type TapeARNs = TapeARN[];
  export interface TapeArchive {
    /**
     * The Amazon Resource Name (ARN) of an archived virtual tape.
     */
    TapeARN?: TapeARN;
    /**
     * The barcode that identifies the archived virtual tape.
     */
    TapeBarcode?: TapeBarcode;
    /**
     * The date the virtual tape was created.
     */
    TapeCreatedDate?: Time;
    /**
     * The size, in bytes, of the archived virtual tape.
     */
    TapeSizeInBytes?: TapeSize;
    /**
     * The time that the archiving of the virtual tape was completed. The default timestamp format is in the ISO8601 extended YYYY-MM-DD'T'HH:MM:SS'Z' format.
     */
    CompletionTime?: Time;
    /**
     * The Amazon Resource Name (ARN) of the tape gateway that the virtual tape is being retrieved to. The virtual tape is retrieved from the virtual tape shelf (VTS).
     */
    RetrievedTo?: GatewayARN;
    /**
     * The current state of the archived virtual tape.
     */
    TapeStatus?: TapeArchiveStatus;
    /**
     * The size, in bytes, of data stored on the virtual tape.  This value is not available for tapes created prior to May 13, 2015. 
     */
    TapeUsedInBytes?: TapeUsage;
    KMSKey?: KMSKey;
    /**
     * The ID of the pool that was used to archive the tape. The tapes in this pool are archived in the S3 storage class that is associated with the pool.
     */
    PoolId?: PoolId;
    /**
     * Set to true if the archived tape is stored as write-once-read-many (WORM).
     */
    Worm?: boolean;
    /**
     * If the archived tape is subject to tape retention lock, the date that the archived tape started being retained.
     */
    RetentionStartDate?: Time;
    /**
     * The time that the tape entered the custom tape pool. The default timestamp format is in the ISO8601 extended YYYY-MM-DD'T'HH:MM:SS'Z' format.
     */
    PoolEntryDate?: Time;
  }
  export type TapeArchiveStatus = string;
  export type TapeArchives = TapeArchive[];
  export type TapeBarcode = string;
  export type TapeBarcodePrefix = string;
  export type TapeDriveType = string;
  export interface TapeInfo {
    /**
     * The Amazon Resource Name (ARN) of a virtual tape.
     */
    TapeARN?: TapeARN;
    /**
     * The barcode that identifies a specific virtual tape.
     */
    TapeBarcode?: TapeBarcode;
    /**
     * The size, in bytes, of a virtual tape.
     */
    TapeSizeInBytes?: TapeSize;
    /**
     * The status of the tape.
     */
    TapeStatus?: TapeStatus;
    /**
     * The Amazon Resource Name (ARN) of the gateway. Use the ListGateways operation to return a list of gateways for your account and Amazon Web Services Region.
     */
    GatewayARN?: GatewayARN;
    /**
     * The ID of the pool that you want to add your tape to for archiving. The tape in this pool is archived in the S3 storage class that is associated with the pool. When you use your backup application to eject the tape, the tape is archived directly into the storage class (S3 Glacier or S3 Glacier Deep Archive) that corresponds to the pool.
     */
    PoolId?: PoolId;
    /**
     * The date that the tape became subject to tape retention lock.
     */
    RetentionStartDate?: Time;
    /**
     * The date that the tape entered the custom tape pool with tape retention lock enabled.
     */
    PoolEntryDate?: Time;
  }
  export type TapeInfos = TapeInfo[];
  export interface TapeRecoveryPointInfo {
    /**
     * The Amazon Resource Name (ARN) of the virtual tape.
     */
    TapeARN?: TapeARN;
    /**
     * The time when the point-in-time view of the virtual tape was replicated for later recovery. The default timestamp format of the tape recovery point time is in the ISO8601 extended YYYY-MM-DD'T'HH:MM:SS'Z' format.
     */
    TapeRecoveryPointTime?: Time;
    /**
     * The size, in bytes, of the virtual tapes to recover.
     */
    TapeSizeInBytes?: TapeSize;
    /**
     * The status of the virtual tapes.
     */
    TapeStatus?: TapeRecoveryPointStatus;
  }
  export type TapeRecoveryPointInfos = TapeRecoveryPointInfo[];
  export type TapeRecoveryPointStatus = string;
  export type TapeSize = number;
  export type TapeStatus = string;
  export type TapeStorageClass = "DEEP_ARCHIVE"|"GLACIER"|string;
  export type TapeUsage = number;
  export type Tapes = Tape[];
  export type TargetARN = string;
  export type TargetName = string;
  export type Time = Date;
  export type TimeoutInSeconds = number;
  export interface UpdateAutomaticTapeCreationPolicyInput {
    /**
     * An automatic tape creation policy consists of a list of automatic tape creation rules. The rules determine when and how to automatically create new tapes.
     */
    AutomaticTapeCreationRules: AutomaticTapeCreationRules;
    GatewayARN: GatewayARN;
  }
  export interface UpdateAutomaticTapeCreationPolicyOutput {
    GatewayARN?: GatewayARN;
  }
  export interface UpdateBandwidthRateLimitInput {
    GatewayARN: GatewayARN;
    /**
     * The average upload bandwidth rate limit in bits per second.
     */
    AverageUploadRateLimitInBitsPerSec?: BandwidthUploadRateLimit;
    /**
     * The average download bandwidth rate limit in bits per second.
     */
    AverageDownloadRateLimitInBitsPerSec?: BandwidthDownloadRateLimit;
  }
  export interface UpdateBandwidthRateLimitOutput {
    GatewayARN?: GatewayARN;
  }
  export interface UpdateBandwidthRateLimitScheduleInput {
    GatewayARN: GatewayARN;
    /**
     *  An array containing bandwidth rate limit schedule intervals for a gateway. When no bandwidth rate limit intervals have been scheduled, the array is empty. 
     */
    BandwidthRateLimitIntervals: BandwidthRateLimitIntervals;
  }
  export interface UpdateBandwidthRateLimitScheduleOutput {
    GatewayARN?: GatewayARN;
  }
  export interface UpdateChapCredentialsInput {
    /**
     * The Amazon Resource Name (ARN) of the iSCSI volume target. Use the DescribeStorediSCSIVolumes operation to return the TargetARN for specified VolumeARN.
     */
    TargetARN: TargetARN;
    /**
     * The secret key that the initiator (for example, the Windows client) must provide to participate in mutual CHAP with the target.  The secret key must be between 12 and 16 bytes when encoded in UTF-8. 
     */
    SecretToAuthenticateInitiator: ChapSecret;
    /**
     * The iSCSI initiator that connects to the target.
     */
    InitiatorName: IqnName;
    /**
     * The secret key that the target must provide to participate in mutual CHAP with the initiator (e.g. Windows client). Byte constraints: Minimum bytes of 12. Maximum bytes of 16.  The secret key must be between 12 and 16 bytes when encoded in UTF-8. 
     */
    SecretToAuthenticateTarget?: ChapSecret;
  }
  export interface UpdateChapCredentialsOutput {
    /**
     * The Amazon Resource Name (ARN) of the target. This is the same target specified in the request.
     */
    TargetARN?: TargetARN;
    /**
     * The iSCSI initiator that connects to the target. This is the same initiator name specified in the request.
     */
    InitiatorName?: IqnName;
  }
  export interface UpdateFileSystemAssociationInput {
    /**
     * The Amazon Resource Name (ARN) of the file system association that you want to update.
     */
    FileSystemAssociationARN: FileSystemAssociationARN;
    /**
     * The user name of the user credential that has permission to access the root share D$ of the Amazon FSx file system. The user account must belong to the Amazon FSx delegated admin user group.
     */
    UserName?: DomainUserName;
    /**
     * The password of the user credential.
     */
    Password?: DomainUserPassword;
    /**
     * The Amazon Resource Name (ARN) of the storage used for the audit logs.
     */
    AuditDestinationARN?: AuditDestinationARN;
    CacheAttributes?: CacheAttributes;
  }
  export interface UpdateFileSystemAssociationOutput {
    /**
     * The ARN of the updated file system association.
     */
    FileSystemAssociationARN?: FileSystemAssociationARN;
  }
  export interface UpdateGatewayInformationInput {
    GatewayARN: GatewayARN;
    GatewayName?: GatewayName;
    /**
     * A value that indicates the time zone of the gateway.
     */
    GatewayTimezone?: GatewayTimezone;
    /**
     * The Amazon Resource Name (ARN) of the Amazon CloudWatch log group that you want to use to monitor and log events in the gateway. For more information, see What is Amazon CloudWatch Logs? 
     */
    CloudWatchLogGroupARN?: CloudWatchLogGroupARN;
    /**
     * Specifies the size of the gateway's metadata cache.
     */
    GatewayCapacity?: GatewayCapacity;
  }
  export interface UpdateGatewayInformationOutput {
    GatewayARN?: GatewayARN;
    /**
     * The name you configured for your gateway.
     */
    GatewayName?: string;
  }
  export interface UpdateGatewaySoftwareNowInput {
    GatewayARN: GatewayARN;
  }
  export interface UpdateGatewaySoftwareNowOutput {
    GatewayARN?: GatewayARN;
  }
  export interface UpdateMaintenanceStartTimeInput {
    GatewayARN: GatewayARN;
    /**
     * The hour component of the maintenance start time represented as hh, where hh is the hour (00 to 23). The hour of the day is in the time zone of the gateway.
     */
    HourOfDay: HourOfDay;
    /**
     * The minute component of the maintenance start time represented as mm, where mm is the minute (00 to 59). The minute of the hour is in the time zone of the gateway.
     */
    MinuteOfHour: MinuteOfHour;
    /**
     * The day of the week component of the maintenance start time week represented as an ordinal number from 0 to 6, where 0 represents Sunday and 6 Saturday.
     */
    DayOfWeek?: DayOfWeek;
    /**
     * The day of the month component of the maintenance start time represented as an ordinal number from 1 to 28, where 1 represents the first day of the month and 28 represents the last day of the month.
     */
    DayOfMonth?: DayOfMonth;
  }
  export interface UpdateMaintenanceStartTimeOutput {
    GatewayARN?: GatewayARN;
  }
  export interface UpdateNFSFileShareInput {
    /**
     * The Amazon Resource Name (ARN) of the file share to be updated.
     */
    FileShareARN: FileShareARN;
    /**
     * Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional. Valid Values: true | false 
     */
    KMSEncrypted?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of a symmetric customer master key (CMK) used for Amazon S3 server-side encryption. Storage Gateway does not support asymmetric CMKs. This value can only be set when KMSEncrypted is true. Optional.
     */
    KMSKey?: KMSKey;
    /**
     * The default values for the file share. Optional.
     */
    NFSFileShareDefaults?: NFSFileShareDefaults;
    /**
     * The default storage class for objects put into an Amazon S3 bucket by the S3 File Gateway. The default value is S3_STANDARD. Optional. Valid Values: S3_STANDARD | S3_INTELLIGENT_TIERING | S3_STANDARD_IA | S3_ONEZONE_IA 
     */
    DefaultStorageClass?: StorageClass;
    /**
     * A value that sets the access control list (ACL) permission for objects in the S3 bucket that a S3 File Gateway puts objects into. The default value is private.
     */
    ObjectACL?: ObjectACL;
    /**
     * The list of clients that are allowed to access the S3 File Gateway. The list must contain either valid IP addresses or valid CIDR blocks.
     */
    ClientList?: FileShareClientList;
    /**
     * The user mapped to anonymous user. Valid values are the following:    RootSquash: Only root is mapped to anonymous user.    NoSquash: No one is mapped to anonymous user.    AllSquash: Everyone is mapped to anonymous user.  
     */
    Squash?: Squash;
    /**
     * A value that sets the write status of a file share. Set this value to true to set the write status to read-only, otherwise set to false. Valid Values: true | false 
     */
    ReadOnly?: Boolean;
    /**
     * A value that enables guessing of the MIME type for uploaded objects based on file extensions. Set this value to true to enable MIME type guessing, otherwise set to false. The default value is true. Valid Values: true | false 
     */
    GuessMIMETypeEnabled?: Boolean;
    /**
     * A value that sets who pays the cost of the request and the cost associated with data download from the S3 bucket. If this value is set to true, the requester pays the costs; otherwise, the S3 bucket owner pays. However, the S3 bucket owner always pays the cost of storing data.   RequesterPays is a configuration for the S3 bucket that backs the file share, so make sure that the configuration on the file share is the same as the S3 bucket configuration.  Valid Values: true | false 
     */
    RequesterPays?: Boolean;
    /**
     * The name of the file share. Optional.   FileShareName must be set if an S3 prefix name is set in LocationARN, or if an access point or access point alias is used. 
     */
    FileShareName?: FileShareName;
    /**
     * Specifies refresh cache information for the file share.
     */
    CacheAttributes?: CacheAttributes;
    /**
     * The notification policy of the file share. SettlingTimeInSeconds controls the number of seconds to wait after the last point in time a client wrote to a file before generating an ObjectUploaded notification. Because clients can make many small writes to files, it's best to set this parameter for as long as possible to avoid generating multiple notifications for the same file in a small time period.   SettlingTimeInSeconds has no effect on the timing of the object uploading to Amazon S3, only the timing of the notification.  The following example sets NotificationPolicy on with SettlingTimeInSeconds set to 60.  {\"Upload\": {\"SettlingTimeInSeconds\": 60}}  The following example sets NotificationPolicy off.  {} 
     */
    NotificationPolicy?: NotificationPolicy;
    /**
     * The Amazon Resource Name (ARN) of the storage used for audit logs.
     */
    AuditDestinationARN?: AuditDestinationARN;
  }
  export interface UpdateNFSFileShareOutput {
    /**
     * The Amazon Resource Name (ARN) of the updated file share.
     */
    FileShareARN?: FileShareARN;
  }
  export interface UpdateSMBFileShareInput {
    /**
     * The Amazon Resource Name (ARN) of the SMB file share that you want to update.
     */
    FileShareARN: FileShareARN;
    /**
     * Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional. Valid Values: true | false 
     */
    KMSEncrypted?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of a symmetric customer master key (CMK) used for Amazon S3 server-side encryption. Storage Gateway does not support asymmetric CMKs. This value can only be set when KMSEncrypted is true. Optional.
     */
    KMSKey?: KMSKey;
    /**
     * The default storage class for objects put into an Amazon S3 bucket by the S3 File Gateway. The default value is S3_STANDARD. Optional. Valid Values: S3_STANDARD | S3_INTELLIGENT_TIERING | S3_STANDARD_IA | S3_ONEZONE_IA 
     */
    DefaultStorageClass?: StorageClass;
    /**
     * A value that sets the access control list (ACL) permission for objects in the S3 bucket that a S3 File Gateway puts objects into. The default value is private.
     */
    ObjectACL?: ObjectACL;
    /**
     * A value that sets the write status of a file share. Set this value to true to set write status to read-only, otherwise set to false. Valid Values: true | false 
     */
    ReadOnly?: Boolean;
    /**
     * A value that enables guessing of the MIME type for uploaded objects based on file extensions. Set this value to true to enable MIME type guessing, otherwise set to false. The default value is true. Valid Values: true | false 
     */
    GuessMIMETypeEnabled?: Boolean;
    /**
     * A value that sets who pays the cost of the request and the cost associated with data download from the S3 bucket. If this value is set to true, the requester pays the costs; otherwise, the S3 bucket owner pays. However, the S3 bucket owner always pays the cost of storing data.   RequesterPays is a configuration for the S3 bucket that backs the file share, so make sure that the configuration on the file share is the same as the S3 bucket configuration.  Valid Values: true | false 
     */
    RequesterPays?: Boolean;
    /**
     * Set this value to true to enable access control list (ACL) on the SMB file share. Set it to false to map file and directory permissions to the POSIX permissions. For more information, see Using Microsoft Windows ACLs to control access to an SMB file share in the Storage Gateway User Guide. Valid Values: true | false 
     */
    SMBACLEnabled?: Boolean;
    /**
     * The files and folders on this share will only be visible to users with read access.
     */
    AccessBasedEnumeration?: Boolean;
    /**
     * A list of users or groups in the Active Directory that have administrator rights to the file share. A group must be prefixed with the @ character. Acceptable formats include: DOMAIN\User1, user1, @group1, and @DOMAIN\group1. Can only be set if Authentication is set to ActiveDirectory.
     */
    AdminUserList?: UserList;
    /**
     * A list of users or groups in the Active Directory that are allowed to access the file share. A group must be prefixed with the @ character. Acceptable formats include: DOMAIN\User1, user1, @group1, and @DOMAIN\group1. Can only be set if Authentication is set to ActiveDirectory.
     */
    ValidUserList?: UserList;
    /**
     * A list of users or groups in the Active Directory that are not allowed to access the file share. A group must be prefixed with the @ character. Acceptable formats include: DOMAIN\User1, user1, @group1, and @DOMAIN\group1. Can only be set if Authentication is set to ActiveDirectory.
     */
    InvalidUserList?: UserList;
    /**
     * The Amazon Resource Name (ARN) of the storage used for audit logs.
     */
    AuditDestinationARN?: AuditDestinationARN;
    /**
     * The case of an object name in an Amazon S3 bucket. For ClientSpecified, the client determines the case sensitivity. For CaseSensitive, the gateway determines the case sensitivity. The default value is ClientSpecified.
     */
    CaseSensitivity?: CaseSensitivity;
    /**
     * The name of the file share. Optional.   FileShareName must be set if an S3 prefix name is set in LocationARN, or if an access point or access point alias is used. 
     */
    FileShareName?: FileShareName;
    /**
     * Specifies refresh cache information for the file share.
     */
    CacheAttributes?: CacheAttributes;
    /**
     * The notification policy of the file share. SettlingTimeInSeconds controls the number of seconds to wait after the last point in time a client wrote to a file before generating an ObjectUploaded notification. Because clients can make many small writes to files, it's best to set this parameter for as long as possible to avoid generating multiple notifications for the same file in a small time period.   SettlingTimeInSeconds has no effect on the timing of the object uploading to Amazon S3, only the timing of the notification.  The following example sets NotificationPolicy on with SettlingTimeInSeconds set to 60.  {\"Upload\": {\"SettlingTimeInSeconds\": 60}}  The following example sets NotificationPolicy off.  {} 
     */
    NotificationPolicy?: NotificationPolicy;
    /**
     * Specifies whether opportunistic locking is enabled for the SMB file share.  Enabling opportunistic locking on case-sensitive shares is not recommended for workloads that involve access to files with the same name in different case.  Valid Values: true | false 
     */
    OplocksEnabled?: Boolean;
  }
  export interface UpdateSMBFileShareOutput {
    /**
     * The Amazon Resource Name (ARN) of the updated SMB file share.
     */
    FileShareARN?: FileShareARN;
  }
  export interface UpdateSMBFileShareVisibilityInput {
    GatewayARN: GatewayARN;
    /**
     * The shares on this gateway appear when listing shares.
     */
    FileSharesVisible: Boolean;
  }
  export interface UpdateSMBFileShareVisibilityOutput {
    GatewayARN?: GatewayARN;
  }
  export interface UpdateSMBLocalGroupsInput {
    GatewayARN: GatewayARN;
    /**
     * A list of Active Directory users and groups that you want to grant special permissions for SMB file shares on the gateway.
     */
    SMBLocalGroups: SMBLocalGroups;
  }
  export interface UpdateSMBLocalGroupsOutput {
    GatewayARN?: GatewayARN;
  }
  export interface UpdateSMBSecurityStrategyInput {
    GatewayARN: GatewayARN;
    /**
     * Specifies the type of security strategy. ClientSpecified: if you use this option, requests are established based on what is negotiated by the client. This option is recommended when you want to maximize compatibility across different clients in your environment. Supported only in S3 File Gateway. MandatorySigning: if you use this option, file gateway only allows connections from SMBv2 or SMBv3 clients that have signing enabled. This option works with SMB clients on Microsoft Windows Vista, Windows Server 2008 or newer. MandatoryEncryption: if you use this option, file gateway only allows connections from SMBv3 clients that have encryption enabled. This option is highly recommended for environments that handle sensitive data. This option works with SMB clients on Microsoft Windows 8, Windows Server 2012 or newer.
     */
    SMBSecurityStrategy: SMBSecurityStrategy;
  }
  export interface UpdateSMBSecurityStrategyOutput {
    GatewayARN?: GatewayARN;
  }
  export interface UpdateSnapshotScheduleInput {
    /**
     * The Amazon Resource Name (ARN) of the volume. Use the ListVolumes operation to return a list of gateway volumes.
     */
    VolumeARN: VolumeARN;
    /**
     * The hour of the day at which the snapshot schedule begins represented as hh, where hh is the hour (0 to 23). The hour of the day is in the time zone of the gateway.
     */
    StartAt: HourOfDay;
    /**
     * Frequency of snapshots. Specify the number of hours between snapshots.
     */
    RecurrenceInHours: RecurrenceInHours;
    /**
     * Optional description of the snapshot that overwrites the existing description.
     */
    Description?: Description;
    /**
     * A list of up to 50 tags that can be assigned to a snapshot. Each tag is a key-value pair.  Valid characters for key and value are letters, spaces, and numbers representable in UTF-8 format, and the following special characters: + - = . _ : / @. The maximum length of a tag's key is 128 characters, and the maximum length for a tag's value is 256. 
     */
    Tags?: Tags;
  }
  export interface UpdateSnapshotScheduleOutput {
    /**
     * The Amazon Resource Name (ARN) of the volume. Use the ListVolumes operation to return a list of gateway volumes.
     */
    VolumeARN?: VolumeARN;
  }
  export interface UpdateVTLDeviceTypeInput {
    /**
     * The Amazon Resource Name (ARN) of the medium changer you want to select.
     */
    VTLDeviceARN: VTLDeviceARN;
    /**
     * The type of medium changer you want to select. Valid Values: STK-L700 | AWS-Gateway-VTL | IBM-03584L32-0402 
     */
    DeviceType: DeviceType;
  }
  export interface UpdateVTLDeviceTypeOutput {
    /**
     * The Amazon Resource Name (ARN) of the medium changer you have selected.
     */
    VTLDeviceARN?: VTLDeviceARN;
  }
  export type UserList = UserListUser[];
  export type UserListUser = string;
  export interface VTLDevice {
    /**
     * Specifies the unique Amazon Resource Name (ARN) of the device (tape drive or media changer).
     */
    VTLDeviceARN?: VTLDeviceARN;
    /**
     * Specifies the type of device that the VTL device emulates.
     */
    VTLDeviceType?: VTLDeviceType;
    /**
     * Specifies the vendor of the device that the VTL device object emulates.
     */
    VTLDeviceVendor?: VTLDeviceVendor;
    /**
     * Specifies the model number of device that the VTL device emulates.
     */
    VTLDeviceProductIdentifier?: VTLDeviceProductIdentifier;
    /**
     * A list of iSCSI information about a VTL device.
     */
    DeviceiSCSIAttributes?: DeviceiSCSIAttributes;
  }
  export type VTLDeviceARN = string;
  export type VTLDeviceARNs = VTLDeviceARN[];
  export type VTLDeviceProductIdentifier = string;
  export type VTLDeviceType = string;
  export type VTLDeviceVendor = string;
  export type VTLDevices = VTLDevice[];
  export type VolumeARN = string;
  export type VolumeARNs = VolumeARN[];
  export type VolumeAttachmentStatus = string;
  export type VolumeId = string;
  export interface VolumeInfo {
    /**
     * The Amazon Resource Name (ARN) for the storage volume. For example, the following is a valid ARN:  arn:aws:storagegateway:us-east-2:111122223333:gateway/sgw-12A3456B/volume/vol-1122AABB  Valid Values: 50 to 500 lowercase letters, numbers, periods (.), and hyphens (-).
     */
    VolumeARN?: VolumeARN;
    /**
     * The unique identifier assigned to the volume. This ID becomes part of the volume Amazon Resource Name (ARN), which you use as input for other operations. Valid Values: 50 to 500 lowercase letters, numbers, periods (.), and hyphens (-).
     */
    VolumeId?: VolumeId;
    GatewayARN?: GatewayARN;
    /**
     * The unique identifier assigned to your gateway during activation. This ID becomes part of the gateway Amazon Resource Name (ARN), which you use as input for other operations. Valid Values: 50 to 500 lowercase letters, numbers, periods (.), and hyphens (-).
     */
    GatewayId?: GatewayId;
    /**
     * One of the VolumeType enumeration values describing the type of the volume.
     */
    VolumeType?: VolumeType;
    /**
     * The size of the volume in bytes. Valid Values: 50 to 500 lowercase letters, numbers, periods (.), and hyphens (-).
     */
    VolumeSizeInBytes?: long;
    /**
     * One of the VolumeStatus values that indicates the state of the storage volume.
     */
    VolumeAttachmentStatus?: VolumeAttachmentStatus;
  }
  export type VolumeInfos = VolumeInfo[];
  export interface VolumeRecoveryPointInfo {
    /**
     * The Amazon Resource Name (ARN) of the volume target.
     */
    VolumeARN?: VolumeARN;
    /**
     * The size of the volume in bytes.
     */
    VolumeSizeInBytes?: long;
    /**
     * The size of the data stored on the volume in bytes.  This value is not available for volumes created prior to May 13, 2015, until you store data on the volume. 
     */
    VolumeUsageInBytes?: long;
    /**
     * The time the recovery point was taken.
     */
    VolumeRecoveryPointTime?: string;
  }
  export type VolumeRecoveryPointInfos = VolumeRecoveryPointInfo[];
  export type VolumeStatus = string;
  export type VolumeType = string;
  export type VolumeUsedInBytes = number;
  export interface VolumeiSCSIAttributes {
    /**
     * The Amazon Resource Name (ARN) of the volume target.
     */
    TargetARN?: TargetARN;
    /**
     * The network interface identifier.
     */
    NetworkInterfaceId?: NetworkInterfaceId;
    /**
     * The port used to communicate with iSCSI targets.
     */
    NetworkInterfacePort?: integer;
    /**
     * The logical disk number.
     */
    LunNumber?: PositiveIntObject;
    /**
     * Indicates whether mutual CHAP is enabled for the iSCSI target.
     */
    ChapEnabled?: boolean;
  }
  export type double = number;
  export type integer = number;
  export type long = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2013-06-30"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the StorageGateway client.
   */
  export import Types = StorageGateway;
}
export = StorageGateway;
