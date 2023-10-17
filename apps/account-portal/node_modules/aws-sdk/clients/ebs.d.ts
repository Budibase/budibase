import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class EBS extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: EBS.Types.ClientConfiguration)
  config: Config & EBS.Types.ClientConfiguration;
  /**
   * Seals and completes the snapshot after all of the required blocks of data have been written to it. Completing the snapshot changes the status to completed. You cannot write new blocks to a snapshot after it has been completed.
   */
  completeSnapshot(params: EBS.Types.CompleteSnapshotRequest, callback?: (err: AWSError, data: EBS.Types.CompleteSnapshotResponse) => void): Request<EBS.Types.CompleteSnapshotResponse, AWSError>;
  /**
   * Seals and completes the snapshot after all of the required blocks of data have been written to it. Completing the snapshot changes the status to completed. You cannot write new blocks to a snapshot after it has been completed.
   */
  completeSnapshot(callback?: (err: AWSError, data: EBS.Types.CompleteSnapshotResponse) => void): Request<EBS.Types.CompleteSnapshotResponse, AWSError>;
  /**
   * Returns the data in a block in an Amazon Elastic Block Store snapshot.
   */
  getSnapshotBlock(params: EBS.Types.GetSnapshotBlockRequest, callback?: (err: AWSError, data: EBS.Types.GetSnapshotBlockResponse) => void): Request<EBS.Types.GetSnapshotBlockResponse, AWSError>;
  /**
   * Returns the data in a block in an Amazon Elastic Block Store snapshot.
   */
  getSnapshotBlock(callback?: (err: AWSError, data: EBS.Types.GetSnapshotBlockResponse) => void): Request<EBS.Types.GetSnapshotBlockResponse, AWSError>;
  /**
   * Returns information about the blocks that are different between two Amazon Elastic Block Store snapshots of the same volume/snapshot lineage.
   */
  listChangedBlocks(params: EBS.Types.ListChangedBlocksRequest, callback?: (err: AWSError, data: EBS.Types.ListChangedBlocksResponse) => void): Request<EBS.Types.ListChangedBlocksResponse, AWSError>;
  /**
   * Returns information about the blocks that are different between two Amazon Elastic Block Store snapshots of the same volume/snapshot lineage.
   */
  listChangedBlocks(callback?: (err: AWSError, data: EBS.Types.ListChangedBlocksResponse) => void): Request<EBS.Types.ListChangedBlocksResponse, AWSError>;
  /**
   * Returns information about the blocks in an Amazon Elastic Block Store snapshot.
   */
  listSnapshotBlocks(params: EBS.Types.ListSnapshotBlocksRequest, callback?: (err: AWSError, data: EBS.Types.ListSnapshotBlocksResponse) => void): Request<EBS.Types.ListSnapshotBlocksResponse, AWSError>;
  /**
   * Returns information about the blocks in an Amazon Elastic Block Store snapshot.
   */
  listSnapshotBlocks(callback?: (err: AWSError, data: EBS.Types.ListSnapshotBlocksResponse) => void): Request<EBS.Types.ListSnapshotBlocksResponse, AWSError>;
  /**
   * Writes a block of data to a snapshot. If the specified block contains data, the existing data is overwritten. The target snapshot must be in the pending state. Data written to a snapshot must be aligned with 512-KiB sectors.
   */
  putSnapshotBlock(params: EBS.Types.PutSnapshotBlockRequest, callback?: (err: AWSError, data: EBS.Types.PutSnapshotBlockResponse) => void): Request<EBS.Types.PutSnapshotBlockResponse, AWSError>;
  /**
   * Writes a block of data to a snapshot. If the specified block contains data, the existing data is overwritten. The target snapshot must be in the pending state. Data written to a snapshot must be aligned with 512-KiB sectors.
   */
  putSnapshotBlock(callback?: (err: AWSError, data: EBS.Types.PutSnapshotBlockResponse) => void): Request<EBS.Types.PutSnapshotBlockResponse, AWSError>;
  /**
   * Creates a new Amazon EBS snapshot. The new snapshot enters the pending state after the request completes.  After creating the snapshot, use  PutSnapshotBlock to write blocks of data to the snapshot.
   */
  startSnapshot(params: EBS.Types.StartSnapshotRequest, callback?: (err: AWSError, data: EBS.Types.StartSnapshotResponse) => void): Request<EBS.Types.StartSnapshotResponse, AWSError>;
  /**
   * Creates a new Amazon EBS snapshot. The new snapshot enters the pending state after the request completes.  After creating the snapshot, use  PutSnapshotBlock to write blocks of data to the snapshot.
   */
  startSnapshot(callback?: (err: AWSError, data: EBS.Types.StartSnapshotResponse) => void): Request<EBS.Types.StartSnapshotResponse, AWSError>;
}
declare namespace EBS {
  export interface Block {
    /**
     * The block index.
     */
    BlockIndex?: BlockIndex;
    /**
     * The block token for the block index.
     */
    BlockToken?: BlockToken;
  }
  export type BlockData = Buffer|Uint8Array|Blob|string|Readable;
  export type BlockIndex = number;
  export type BlockSize = number;
  export type BlockToken = string;
  export type Blocks = Block[];
  export type Boolean = boolean;
  export interface ChangedBlock {
    /**
     * The block index.
     */
    BlockIndex?: BlockIndex;
    /**
     * The block token for the block index of the FirstSnapshotId specified in the ListChangedBlocks operation. This value is absent if the first snapshot does not have the changed block that is on the second snapshot.
     */
    FirstBlockToken?: BlockToken;
    /**
     * The block token for the block index of the SecondSnapshotId specified in the ListChangedBlocks operation.
     */
    SecondBlockToken?: BlockToken;
  }
  export type ChangedBlocks = ChangedBlock[];
  export type ChangedBlocksCount = number;
  export type Checksum = string;
  export type ChecksumAggregationMethod = "LINEAR"|string;
  export type ChecksumAlgorithm = "SHA256"|string;
  export interface CompleteSnapshotRequest {
    /**
     * The ID of the snapshot.
     */
    SnapshotId: SnapshotId;
    /**
     * The number of blocks that were written to the snapshot.
     */
    ChangedBlocksCount: ChangedBlocksCount;
    /**
     * An aggregated Base-64 SHA256 checksum based on the checksums of each written block. To generate the aggregated checksum using the linear aggregation method, arrange the checksums for each written block in ascending order of their block index, concatenate them to form a single string, and then generate the checksum on the entire string using the SHA256 algorithm.
     */
    Checksum?: Checksum;
    /**
     * The algorithm used to generate the checksum. Currently, the only supported algorithm is SHA256.
     */
    ChecksumAlgorithm?: ChecksumAlgorithm;
    /**
     * The aggregation method used to generate the checksum. Currently, the only supported aggregation method is LINEAR.
     */
    ChecksumAggregationMethod?: ChecksumAggregationMethod;
  }
  export interface CompleteSnapshotResponse {
    /**
     * The status of the snapshot.
     */
    Status?: Status;
  }
  export type DataLength = number;
  export type Description = string;
  export interface GetSnapshotBlockRequest {
    /**
     * The ID of the snapshot containing the block from which to get data.
     */
    SnapshotId: SnapshotId;
    /**
     * The block index of the block from which to get data. Obtain the BlockIndex by running the ListChangedBlocks or ListSnapshotBlocks operations.
     */
    BlockIndex: BlockIndex;
    /**
     * The block token of the block from which to get data. Obtain the BlockToken by running the ListChangedBlocks or ListSnapshotBlocks operations.
     */
    BlockToken: BlockToken;
  }
  export interface GetSnapshotBlockResponse {
    /**
     * The size of the data in the block.
     */
    DataLength?: DataLength;
    /**
     * The data content of the block.
     */
    BlockData?: BlockData;
    /**
     * The checksum generated for the block, which is Base64 encoded.
     */
    Checksum?: Checksum;
    /**
     * The algorithm used to generate the checksum for the block, such as SHA256.
     */
    ChecksumAlgorithm?: ChecksumAlgorithm;
  }
  export type IdempotencyToken = string;
  export type KmsKeyArn = string;
  export interface ListChangedBlocksRequest {
    /**
     * The ID of the first snapshot to use for the comparison.  The FirstSnapshotID parameter must be specified with a SecondSnapshotId parameter; otherwise, an error occurs. 
     */
    FirstSnapshotId?: SnapshotId;
    /**
     * The ID of the second snapshot to use for the comparison.  The SecondSnapshotId parameter must be specified with a FirstSnapshotID parameter; otherwise, an error occurs. 
     */
    SecondSnapshotId: SnapshotId;
    /**
     * The token to request the next page of results.
     */
    NextToken?: PageToken;
    /**
     * The number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The block index from which the comparison should start. The list in the response will start from this block index or the next valid block index in the snapshots.
     */
    StartingBlockIndex?: BlockIndex;
  }
  export interface ListChangedBlocksResponse {
    /**
     * An array of objects containing information about the changed blocks.
     */
    ChangedBlocks?: ChangedBlocks;
    /**
     * The time when the BlockToken expires.
     */
    ExpiryTime?: TimeStamp;
    /**
     * The size of the volume in GB.
     */
    VolumeSize?: VolumeSize;
    /**
     * The size of the blocks in the snapshot, in bytes.
     */
    BlockSize?: BlockSize;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    NextToken?: PageToken;
  }
  export interface ListSnapshotBlocksRequest {
    /**
     * The ID of the snapshot from which to get block indexes and block tokens.
     */
    SnapshotId: SnapshotId;
    /**
     * The token to request the next page of results.
     */
    NextToken?: PageToken;
    /**
     * The number of results to return.
     */
    MaxResults?: MaxResults;
    /**
     * The block index from which the list should start. The list in the response will start from this block index or the next valid block index in the snapshot.
     */
    StartingBlockIndex?: BlockIndex;
  }
  export interface ListSnapshotBlocksResponse {
    /**
     * An array of objects containing information about the blocks.
     */
    Blocks?: Blocks;
    /**
     * The time when the BlockToken expires.
     */
    ExpiryTime?: TimeStamp;
    /**
     * The size of the volume in GB.
     */
    VolumeSize?: VolumeSize;
    /**
     * The size of the blocks in the snapshot, in bytes.
     */
    BlockSize?: BlockSize;
    /**
     * The token to use to retrieve the next page of results. This value is null when there are no more results to return.
     */
    NextToken?: PageToken;
  }
  export type MaxResults = number;
  export type OwnerId = string;
  export type PageToken = string;
  export type Progress = number;
  export interface PutSnapshotBlockRequest {
    /**
     * The ID of the snapshot.
     */
    SnapshotId: SnapshotId;
    /**
     * The block index of the block in which to write the data. A block index is a logical index in units of 512 KiB blocks. To identify the block index, divide the logical offset of the data in the logical volume by the block size (logical offset of data/524288). The logical offset of the data must be 512 KiB aligned.
     */
    BlockIndex: BlockIndex;
    /**
     * The data to write to the block. The block data is not signed as part of the Signature Version 4 signing process. As a result, you must generate and provide a Base64-encoded SHA256 checksum for the block data using the x-amz-Checksum header. Also, you must specify the checksum algorithm using the x-amz-Checksum-Algorithm header. The checksum that you provide is part of the Signature Version 4 signing process. It is validated against a checksum generated by Amazon EBS to ensure the validity and authenticity of the data. If the checksums do not correspond, the request fails. For more information, see  Using checksums with the EBS direct APIs in the Amazon Elastic Compute Cloud User Guide.
     */
    BlockData: BlockData;
    /**
     * The size of the data to write to the block, in bytes. Currently, the only supported size is 524288 bytes. Valid values: 524288 
     */
    DataLength: DataLength;
    /**
     * The progress of the write process, as a percentage.
     */
    Progress?: Progress;
    /**
     * A Base64-encoded SHA256 checksum of the data. Only SHA256 checksums are supported.
     */
    Checksum: Checksum;
    /**
     * The algorithm used to generate the checksum. Currently, the only supported algorithm is SHA256.
     */
    ChecksumAlgorithm: ChecksumAlgorithm;
  }
  export interface PutSnapshotBlockResponse {
    /**
     * The SHA256 checksum generated for the block data by Amazon EBS.
     */
    Checksum?: Checksum;
    /**
     * The algorithm used by Amazon EBS to generate the checksum.
     */
    ChecksumAlgorithm?: ChecksumAlgorithm;
  }
  export type SnapshotId = string;
  export interface StartSnapshotRequest {
    /**
     * The size of the volume, in GiB. The maximum size is 65536 GiB (64 TiB).
     */
    VolumeSize: VolumeSize;
    /**
     * The ID of the parent snapshot. If there is no parent snapshot, or if you are creating the first snapshot for an on-premises volume, omit this parameter. If your account is enabled for encryption by default, you cannot use an unencrypted snapshot as a parent snapshot. You must first create an encrypted copy of the parent snapshot using CopySnapshot.
     */
    ParentSnapshotId?: SnapshotId;
    /**
     * The tags to apply to the snapshot.
     */
    Tags?: Tags;
    /**
     * A description for the snapshot.
     */
    Description?: Description;
    /**
     * A unique, case-sensitive identifier that you provide to ensure the idempotency of the request. Idempotency ensures that an API request completes only once. With an idempotent request, if the original request completes successfully. The subsequent retries with the same client token return the result from the original successful request and they have no additional effect. If you do not specify a client token, one is automatically generated by the Amazon Web Services SDK. For more information, see  Idempotency for StartSnapshot API in the Amazon Elastic Compute Cloud User Guide.
     */
    ClientToken?: IdempotencyToken;
    /**
     * Indicates whether to encrypt the snapshot. To create an encrypted snapshot, specify true. To create an unencrypted snapshot, omit this parameter. If you specify a value for ParentSnapshotId, omit this parameter. If you specify true, the snapshot is encrypted using the KMS key specified using the KmsKeyArn parameter. If no value is specified for KmsKeyArn, the default KMS key for your account is used. If no default KMS key has been specified for your account, the Amazon Web Services managed KMS key is used. To set a default KMS key for your account, use  ModifyEbsDefaultKmsKeyId. If your account is enabled for encryption by default, you cannot set this parameter to false. In this case, you can omit this parameter. For more information, see  Using encryption in the Amazon Elastic Compute Cloud User Guide.
     */
    Encrypted?: Boolean;
    /**
     * The Amazon Resource Name (ARN) of the Key Management Service (KMS) key to be used to encrypt the snapshot. If you do not specify a KMS key, the default Amazon Web Services managed KMS key is used. If you specify a ParentSnapshotId, omit this parameter; the snapshot will be encrypted using the same KMS key that was used to encrypt the parent snapshot. If Encrypted is set to true, you must specify a KMS key ARN. 
     */
    KmsKeyArn?: KmsKeyArn;
    /**
     * The amount of time (in minutes) after which the snapshot is automatically cancelled if:   No blocks are written to the snapshot.   The snapshot is not completed after writing the last block of data.   If no value is specified, the timeout defaults to 60 minutes.
     */
    Timeout?: Timeout;
  }
  export interface StartSnapshotResponse {
    /**
     * The description of the snapshot.
     */
    Description?: Description;
    /**
     * The ID of the snapshot.
     */
    SnapshotId?: SnapshotId;
    /**
     * The Amazon Web Services account ID of the snapshot owner.
     */
    OwnerId?: OwnerId;
    /**
     * The status of the snapshot.
     */
    Status?: Status;
    /**
     * The timestamp when the snapshot was created.
     */
    StartTime?: TimeStamp;
    /**
     * The size of the volume, in GiB.
     */
    VolumeSize?: VolumeSize;
    /**
     * The size of the blocks in the snapshot, in bytes.
     */
    BlockSize?: BlockSize;
    /**
     * The tags applied to the snapshot. You can specify up to 50 tags per snapshot. For more information, see  Tagging your Amazon EC2 resources in the Amazon Elastic Compute Cloud User Guide.
     */
    Tags?: Tags;
    /**
     * The ID of the parent snapshot.
     */
    ParentSnapshotId?: SnapshotId;
    /**
     * The Amazon Resource Name (ARN) of the Key Management Service (KMS) key used to encrypt the snapshot.
     */
    KmsKeyArn?: KmsKeyArn;
  }
  export type Status = "completed"|"pending"|"error"|string;
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
  export type TagValue = string;
  export type Tags = Tag[];
  export type TimeStamp = Date;
  export type Timeout = number;
  export type VolumeSize = number;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-11-02"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the EBS client.
   */
  export import Types = EBS;
}
export = EBS;
