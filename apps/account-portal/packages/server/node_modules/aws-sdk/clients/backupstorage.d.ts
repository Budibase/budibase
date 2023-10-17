import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
import {Readable} from 'stream';
interface Blob {}
declare class BackupStorage extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: BackupStorage.Types.ClientConfiguration)
  config: Config & BackupStorage.Types.ClientConfiguration;
  /**
   * Delete Object from the incremental base Backup.
   */
  deleteObject(params: BackupStorage.Types.DeleteObjectInput, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Delete Object from the incremental base Backup.
   */
  deleteObject(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Gets the specified object's chunk.
   */
  getChunk(params: BackupStorage.Types.GetChunkInput, callback?: (err: AWSError, data: BackupStorage.Types.GetChunkOutput) => void): Request<BackupStorage.Types.GetChunkOutput, AWSError>;
  /**
   * Gets the specified object's chunk.
   */
  getChunk(callback?: (err: AWSError, data: BackupStorage.Types.GetChunkOutput) => void): Request<BackupStorage.Types.GetChunkOutput, AWSError>;
  /**
   * Get metadata associated with an Object.
   */
  getObjectMetadata(params: BackupStorage.Types.GetObjectMetadataInput, callback?: (err: AWSError, data: BackupStorage.Types.GetObjectMetadataOutput) => void): Request<BackupStorage.Types.GetObjectMetadataOutput, AWSError>;
  /**
   * Get metadata associated with an Object.
   */
  getObjectMetadata(callback?: (err: AWSError, data: BackupStorage.Types.GetObjectMetadataOutput) => void): Request<BackupStorage.Types.GetObjectMetadataOutput, AWSError>;
  /**
   * List chunks in a given Object
   */
  listChunks(params: BackupStorage.Types.ListChunksInput, callback?: (err: AWSError, data: BackupStorage.Types.ListChunksOutput) => void): Request<BackupStorage.Types.ListChunksOutput, AWSError>;
  /**
   * List chunks in a given Object
   */
  listChunks(callback?: (err: AWSError, data: BackupStorage.Types.ListChunksOutput) => void): Request<BackupStorage.Types.ListChunksOutput, AWSError>;
  /**
   * List all Objects in a given Backup.
   */
  listObjects(params: BackupStorage.Types.ListObjectsInput, callback?: (err: AWSError, data: BackupStorage.Types.ListObjectsOutput) => void): Request<BackupStorage.Types.ListObjectsOutput, AWSError>;
  /**
   * List all Objects in a given Backup.
   */
  listObjects(callback?: (err: AWSError, data: BackupStorage.Types.ListObjectsOutput) => void): Request<BackupStorage.Types.ListObjectsOutput, AWSError>;
  /**
   * Complete upload
   */
  notifyObjectComplete(params: BackupStorage.Types.NotifyObjectCompleteInput, callback?: (err: AWSError, data: BackupStorage.Types.NotifyObjectCompleteOutput) => void): Request<BackupStorage.Types.NotifyObjectCompleteOutput, AWSError>;
  /**
   * Complete upload
   */
  notifyObjectComplete(callback?: (err: AWSError, data: BackupStorage.Types.NotifyObjectCompleteOutput) => void): Request<BackupStorage.Types.NotifyObjectCompleteOutput, AWSError>;
  /**
   * Upload chunk.
   */
  putChunk(params: BackupStorage.Types.PutChunkInput, callback?: (err: AWSError, data: BackupStorage.Types.PutChunkOutput) => void): Request<BackupStorage.Types.PutChunkOutput, AWSError>;
  /**
   * Upload chunk.
   */
  putChunk(callback?: (err: AWSError, data: BackupStorage.Types.PutChunkOutput) => void): Request<BackupStorage.Types.PutChunkOutput, AWSError>;
  /**
   * Upload object that can store object metadata String and data blob in single API call using inline chunk field.
   */
  putObject(params: BackupStorage.Types.PutObjectInput, callback?: (err: AWSError, data: BackupStorage.Types.PutObjectOutput) => void): Request<BackupStorage.Types.PutObjectOutput, AWSError>;
  /**
   * Upload object that can store object metadata String and data blob in single API call using inline chunk field.
   */
  putObject(callback?: (err: AWSError, data: BackupStorage.Types.PutObjectOutput) => void): Request<BackupStorage.Types.PutObjectOutput, AWSError>;
  /**
   * Start upload containing one or many chunks.
   */
  startObject(params: BackupStorage.Types.StartObjectInput, callback?: (err: AWSError, data: BackupStorage.Types.StartObjectOutput) => void): Request<BackupStorage.Types.StartObjectOutput, AWSError>;
  /**
   * Start upload containing one or many chunks.
   */
  startObject(callback?: (err: AWSError, data: BackupStorage.Types.StartObjectOutput) => void): Request<BackupStorage.Types.StartObjectOutput, AWSError>;
}
declare namespace BackupStorage {
  export interface BackupObject {
    /**
     * Object name
     */
    Name: string;
    /**
     * Number of chunks in object
     */
    ChunksCount?: OptionalLong;
    /**
     * Metadata string associated with the Object
     */
    MetadataString?: string;
    /**
     * Object checksum
     */
    ObjectChecksum: string;
    /**
     * Checksum algorithm
     */
    ObjectChecksumAlgorithm: SummaryChecksumAlgorithm;
    /**
     * Object token
     */
    ObjectToken: string;
  }
  export interface Chunk {
    /**
     * Chunk index
     */
    Index: long;
    /**
     * Chunk length
     */
    Length: long;
    /**
     * Chunk checksum
     */
    Checksum: string;
    /**
     * Checksum algorithm
     */
    ChecksumAlgorithm: DataChecksumAlgorithm;
    /**
     * Chunk token
     */
    ChunkToken: string;
  }
  export type ChunkList = Chunk[];
  export type DataChecksumAlgorithm = "SHA256"|string;
  export interface DeleteObjectInput {
    /**
     * Backup job Id for the in-progress backup.
     */
    BackupJobId: string;
    /**
     * The name of the Object.
     */
    ObjectName: string;
  }
  export interface GetChunkInput {
    /**
     * Storage job id
     */
    StorageJobId: string;
    /**
     * Chunk token
     */
    ChunkToken: string;
  }
  export interface GetChunkOutput {
    /**
     * Chunk data
     */
    Data: PayloadBlob;
    /**
     * Data length
     */
    Length: long;
    /**
     * Data checksum
     */
    Checksum: string;
    /**
     * Checksum algorithm
     */
    ChecksumAlgorithm: DataChecksumAlgorithm;
  }
  export interface GetObjectMetadataInput {
    /**
     * Backup job id for the in-progress backup.
     */
    StorageJobId: string;
    /**
     * Object token.
     */
    ObjectToken: string;
  }
  export interface GetObjectMetadataOutput {
    /**
     * Metadata string.
     */
    MetadataString?: string;
    /**
     * Metadata blob.
     */
    MetadataBlob?: PayloadBlob;
    /**
     * The size of MetadataBlob.
     */
    MetadataBlobLength?: long;
    /**
     * MetadataBlob checksum.
     */
    MetadataBlobChecksum?: string;
    /**
     * Checksum algorithm.
     */
    MetadataBlobChecksumAlgorithm?: DataChecksumAlgorithm;
  }
  export interface ListChunksInput {
    /**
     * Storage job id
     */
    StorageJobId: string;
    /**
     * Object token
     */
    ObjectToken: string;
    /**
     * Maximum number of chunks
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token
     */
    NextToken?: string;
  }
  export interface ListChunksOutput {
    /**
     * List of chunks
     */
    ChunkList: ChunkList;
    /**
     * Pagination token
     */
    NextToken?: string;
  }
  export interface ListObjectsInput {
    /**
     * Storage job id
     */
    StorageJobId: string;
    /**
     * Optional, specifies the starting Object name to list from. Ignored if NextToken is not NULL
     */
    StartingObjectName?: string;
    /**
     * Optional, specifies the starting Object prefix to list from. Ignored if NextToken is not NULL
     */
    StartingObjectPrefix?: string;
    /**
     * Maximum objects count
     */
    MaxResults?: MaxResults;
    /**
     * Pagination token
     */
    NextToken?: string;
    /**
     * (Optional) Created before filter
     */
    CreatedBefore?: timestamp;
    /**
     * (Optional) Created after filter
     */
    CreatedAfter?: timestamp;
  }
  export interface ListObjectsOutput {
    /**
     * Object list
     */
    ObjectList: ObjectList;
    /**
     * Pagination token
     */
    NextToken?: string;
  }
  export type MaxResults = number;
  export type MetadataString = string;
  export interface NotifyObjectCompleteInput {
    /**
     * Backup job Id for the in-progress backup
     */
    BackupJobId: string;
    /**
     * Upload Id for the in-progress upload
     */
    UploadId: string;
    /**
     * Object checksum
     */
    ObjectChecksum: string;
    /**
     * Checksum algorithm
     */
    ObjectChecksumAlgorithm: SummaryChecksumAlgorithm;
    /**
     * Optional metadata associated with an Object. Maximum string length is 256 bytes.
     */
    MetadataString?: MetadataString;
    /**
     * Optional metadata associated with an Object. Maximum length is 4MB.
     */
    MetadataBlob?: PayloadBlob;
    /**
     * The size of MetadataBlob.
     */
    MetadataBlobLength?: long;
    /**
     * Checksum of MetadataBlob.
     */
    MetadataBlobChecksum?: string;
    /**
     * Checksum algorithm.
     */
    MetadataBlobChecksumAlgorithm?: DataChecksumAlgorithm;
  }
  export interface NotifyObjectCompleteOutput {
    /**
     * Object checksum
     */
    ObjectChecksum: string;
    /**
     * Checksum algorithm
     */
    ObjectChecksumAlgorithm: SummaryChecksumAlgorithm;
  }
  export type ObjectList = BackupObject[];
  export type OptionalLong = number;
  export type PayloadBlob = Buffer|Uint8Array|Blob|string|Readable;
  export interface PutChunkInput {
    /**
     * Backup job Id for the in-progress backup.
     */
    BackupJobId: string;
    /**
     * Upload Id for the in-progress upload.
     */
    UploadId: string;
    /**
     * Describes this chunk's position relative to the other chunks
     */
    ChunkIndex: long;
    /**
     * Data to be uploaded
     */
    Data: PayloadBlob;
    /**
     * Data length
     */
    Length: long;
    /**
     * Data checksum
     */
    Checksum: string;
    /**
     * Checksum algorithm
     */
    ChecksumAlgorithm: DataChecksumAlgorithm;
  }
  export interface PutChunkOutput {
    /**
     * Chunk checksum
     */
    ChunkChecksum: string;
    /**
     * Checksum algorithm
     */
    ChunkChecksumAlgorithm: DataChecksumAlgorithm;
  }
  export interface PutObjectInput {
    /**
     * Backup job Id for the in-progress backup.
     */
    BackupJobId: string;
    /**
     * The name of the Object to be uploaded.
     */
    ObjectName: string;
    /**
     * Store user defined metadata like backup checksum, disk ids, restore metadata etc.
     */
    MetadataString?: string;
    /**
     * Inline chunk data to be uploaded.
     */
    InlineChunk?: PayloadBlob;
    /**
     * Length of the inline chunk data.
     */
    InlineChunkLength?: long;
    /**
     * Inline chunk checksum
     */
    InlineChunkChecksum?: string;
    /**
     * Inline chunk checksum algorithm
     */
    InlineChunkChecksumAlgorithm?: string;
    /**
     * object checksum
     */
    ObjectChecksum?: string;
    /**
     * object checksum algorithm
     */
    ObjectChecksumAlgorithm?: SummaryChecksumAlgorithm;
    /**
     * Throw an exception if Object name is already exist.
     */
    ThrowOnDuplicate?: boolean;
  }
  export interface PutObjectOutput {
    /**
     * Inline chunk checksum
     */
    InlineChunkChecksum: string;
    /**
     * Inline chunk checksum algorithm
     */
    InlineChunkChecksumAlgorithm: DataChecksumAlgorithm;
    /**
     * object checksum
     */
    ObjectChecksum: string;
    /**
     * object checksum algorithm
     */
    ObjectChecksumAlgorithm: SummaryChecksumAlgorithm;
  }
  export interface StartObjectInput {
    /**
     * Backup job Id for the in-progress backup
     */
    BackupJobId: string;
    /**
     * Name for the object.
     */
    ObjectName: string;
    /**
     * Throw an exception if Object name is already exist.
     */
    ThrowOnDuplicate?: boolean;
  }
  export interface StartObjectOutput {
    /**
     * Upload Id for a given upload.
     */
    UploadId: string;
  }
  export type SummaryChecksumAlgorithm = "SUMMARY"|string;
  export type long = number;
  export type timestamp = Date;
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2018-04-10"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the BackupStorage client.
   */
  export import Types = BackupStorage;
}
export = BackupStorage;
