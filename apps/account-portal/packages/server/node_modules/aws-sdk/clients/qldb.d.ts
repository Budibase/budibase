import {Request} from '../lib/request';
import {Response} from '../lib/response';
import {AWSError} from '../lib/error';
import {Service} from '../lib/service';
import {ServiceConfigurationOptions} from '../lib/service';
import {ConfigBase as Config} from '../lib/config-base';
interface Blob {}
declare class QLDB extends Service {
  /**
   * Constructs a service object. This object has one method for each API operation.
   */
  constructor(options?: QLDB.Types.ClientConfiguration)
  config: Config & QLDB.Types.ClientConfiguration;
  /**
   * Ends a given Amazon QLDB journal stream. Before a stream can be canceled, its current status must be ACTIVE. You can't restart a stream after you cancel it. Canceled QLDB stream resources are subject to a 7-day retention period, so they are automatically deleted after this limit expires.
   */
  cancelJournalKinesisStream(params: QLDB.Types.CancelJournalKinesisStreamRequest, callback?: (err: AWSError, data: QLDB.Types.CancelJournalKinesisStreamResponse) => void): Request<QLDB.Types.CancelJournalKinesisStreamResponse, AWSError>;
  /**
   * Ends a given Amazon QLDB journal stream. Before a stream can be canceled, its current status must be ACTIVE. You can't restart a stream after you cancel it. Canceled QLDB stream resources are subject to a 7-day retention period, so they are automatically deleted after this limit expires.
   */
  cancelJournalKinesisStream(callback?: (err: AWSError, data: QLDB.Types.CancelJournalKinesisStreamResponse) => void): Request<QLDB.Types.CancelJournalKinesisStreamResponse, AWSError>;
  /**
   * Creates a new ledger in your Amazon Web Services account in the current Region.
   */
  createLedger(params: QLDB.Types.CreateLedgerRequest, callback?: (err: AWSError, data: QLDB.Types.CreateLedgerResponse) => void): Request<QLDB.Types.CreateLedgerResponse, AWSError>;
  /**
   * Creates a new ledger in your Amazon Web Services account in the current Region.
   */
  createLedger(callback?: (err: AWSError, data: QLDB.Types.CreateLedgerResponse) => void): Request<QLDB.Types.CreateLedgerResponse, AWSError>;
  /**
   * Deletes a ledger and all of its contents. This action is irreversible. If deletion protection is enabled, you must first disable it before you can delete the ledger. You can disable it by calling the UpdateLedger operation to set this parameter to false.
   */
  deleteLedger(params: QLDB.Types.DeleteLedgerRequest, callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Deletes a ledger and all of its contents. This action is irreversible. If deletion protection is enabled, you must first disable it before you can delete the ledger. You can disable it by calling the UpdateLedger operation to set this parameter to false.
   */
  deleteLedger(callback?: (err: AWSError, data: {}) => void): Request<{}, AWSError>;
  /**
   * Returns detailed information about a given Amazon QLDB journal stream. The output includes the Amazon Resource Name (ARN), stream name, current status, creation time, and the parameters of the original stream creation request. This action does not return any expired journal streams. For more information, see Expiration for terminal streams in the Amazon QLDB Developer Guide.
   */
  describeJournalKinesisStream(params: QLDB.Types.DescribeJournalKinesisStreamRequest, callback?: (err: AWSError, data: QLDB.Types.DescribeJournalKinesisStreamResponse) => void): Request<QLDB.Types.DescribeJournalKinesisStreamResponse, AWSError>;
  /**
   * Returns detailed information about a given Amazon QLDB journal stream. The output includes the Amazon Resource Name (ARN), stream name, current status, creation time, and the parameters of the original stream creation request. This action does not return any expired journal streams. For more information, see Expiration for terminal streams in the Amazon QLDB Developer Guide.
   */
  describeJournalKinesisStream(callback?: (err: AWSError, data: QLDB.Types.DescribeJournalKinesisStreamResponse) => void): Request<QLDB.Types.DescribeJournalKinesisStreamResponse, AWSError>;
  /**
   * Returns information about a journal export job, including the ledger name, export ID, creation time, current status, and the parameters of the original export creation request. This action does not return any expired export jobs. For more information, see Export job expiration in the Amazon QLDB Developer Guide. If the export job with the given ExportId doesn't exist, then throws ResourceNotFoundException. If the ledger with the given Name doesn't exist, then throws ResourceNotFoundException.
   */
  describeJournalS3Export(params: QLDB.Types.DescribeJournalS3ExportRequest, callback?: (err: AWSError, data: QLDB.Types.DescribeJournalS3ExportResponse) => void): Request<QLDB.Types.DescribeJournalS3ExportResponse, AWSError>;
  /**
   * Returns information about a journal export job, including the ledger name, export ID, creation time, current status, and the parameters of the original export creation request. This action does not return any expired export jobs. For more information, see Export job expiration in the Amazon QLDB Developer Guide. If the export job with the given ExportId doesn't exist, then throws ResourceNotFoundException. If the ledger with the given Name doesn't exist, then throws ResourceNotFoundException.
   */
  describeJournalS3Export(callback?: (err: AWSError, data: QLDB.Types.DescribeJournalS3ExportResponse) => void): Request<QLDB.Types.DescribeJournalS3ExportResponse, AWSError>;
  /**
   * Returns information about a ledger, including its state, permissions mode, encryption at rest settings, and when it was created.
   */
  describeLedger(params: QLDB.Types.DescribeLedgerRequest, callback?: (err: AWSError, data: QLDB.Types.DescribeLedgerResponse) => void): Request<QLDB.Types.DescribeLedgerResponse, AWSError>;
  /**
   * Returns information about a ledger, including its state, permissions mode, encryption at rest settings, and when it was created.
   */
  describeLedger(callback?: (err: AWSError, data: QLDB.Types.DescribeLedgerResponse) => void): Request<QLDB.Types.DescribeLedgerResponse, AWSError>;
  /**
   * Exports journal contents within a date and time range from a ledger into a specified Amazon Simple Storage Service (Amazon S3) bucket. A journal export job can write the data objects in either the text or binary representation of Amazon Ion format, or in JSON Lines text format. If the ledger with the given Name doesn't exist, then throws ResourceNotFoundException. If the ledger with the given Name is in CREATING status, then throws ResourcePreconditionNotMetException. You can initiate up to two concurrent journal export requests for each ledger. Beyond this limit, journal export requests throw LimitExceededException.
   */
  exportJournalToS3(params: QLDB.Types.ExportJournalToS3Request, callback?: (err: AWSError, data: QLDB.Types.ExportJournalToS3Response) => void): Request<QLDB.Types.ExportJournalToS3Response, AWSError>;
  /**
   * Exports journal contents within a date and time range from a ledger into a specified Amazon Simple Storage Service (Amazon S3) bucket. A journal export job can write the data objects in either the text or binary representation of Amazon Ion format, or in JSON Lines text format. If the ledger with the given Name doesn't exist, then throws ResourceNotFoundException. If the ledger with the given Name is in CREATING status, then throws ResourcePreconditionNotMetException. You can initiate up to two concurrent journal export requests for each ledger. Beyond this limit, journal export requests throw LimitExceededException.
   */
  exportJournalToS3(callback?: (err: AWSError, data: QLDB.Types.ExportJournalToS3Response) => void): Request<QLDB.Types.ExportJournalToS3Response, AWSError>;
  /**
   * Returns a block object at a specified address in a journal. Also returns a proof of the specified block for verification if DigestTipAddress is provided. For information about the data contents in a block, see Journal contents in the Amazon QLDB Developer Guide. If the specified ledger doesn't exist or is in DELETING status, then throws ResourceNotFoundException. If the specified ledger is in CREATING status, then throws ResourcePreconditionNotMetException. If no block exists with the specified address, then throws InvalidParameterException.
   */
  getBlock(params: QLDB.Types.GetBlockRequest, callback?: (err: AWSError, data: QLDB.Types.GetBlockResponse) => void): Request<QLDB.Types.GetBlockResponse, AWSError>;
  /**
   * Returns a block object at a specified address in a journal. Also returns a proof of the specified block for verification if DigestTipAddress is provided. For information about the data contents in a block, see Journal contents in the Amazon QLDB Developer Guide. If the specified ledger doesn't exist or is in DELETING status, then throws ResourceNotFoundException. If the specified ledger is in CREATING status, then throws ResourcePreconditionNotMetException. If no block exists with the specified address, then throws InvalidParameterException.
   */
  getBlock(callback?: (err: AWSError, data: QLDB.Types.GetBlockResponse) => void): Request<QLDB.Types.GetBlockResponse, AWSError>;
  /**
   * Returns the digest of a ledger at the latest committed block in the journal. The response includes a 256-bit hash value and a block address.
   */
  getDigest(params: QLDB.Types.GetDigestRequest, callback?: (err: AWSError, data: QLDB.Types.GetDigestResponse) => void): Request<QLDB.Types.GetDigestResponse, AWSError>;
  /**
   * Returns the digest of a ledger at the latest committed block in the journal. The response includes a 256-bit hash value and a block address.
   */
  getDigest(callback?: (err: AWSError, data: QLDB.Types.GetDigestResponse) => void): Request<QLDB.Types.GetDigestResponse, AWSError>;
  /**
   * Returns a revision data object for a specified document ID and block address. Also returns a proof of the specified revision for verification if DigestTipAddress is provided.
   */
  getRevision(params: QLDB.Types.GetRevisionRequest, callback?: (err: AWSError, data: QLDB.Types.GetRevisionResponse) => void): Request<QLDB.Types.GetRevisionResponse, AWSError>;
  /**
   * Returns a revision data object for a specified document ID and block address. Also returns a proof of the specified revision for verification if DigestTipAddress is provided.
   */
  getRevision(callback?: (err: AWSError, data: QLDB.Types.GetRevisionResponse) => void): Request<QLDB.Types.GetRevisionResponse, AWSError>;
  /**
   * Returns all Amazon QLDB journal streams for a given ledger. This action does not return any expired journal streams. For more information, see Expiration for terminal streams in the Amazon QLDB Developer Guide. This action returns a maximum of MaxResults items. It is paginated so that you can retrieve all the items by calling ListJournalKinesisStreamsForLedger multiple times.
   */
  listJournalKinesisStreamsForLedger(params: QLDB.Types.ListJournalKinesisStreamsForLedgerRequest, callback?: (err: AWSError, data: QLDB.Types.ListJournalKinesisStreamsForLedgerResponse) => void): Request<QLDB.Types.ListJournalKinesisStreamsForLedgerResponse, AWSError>;
  /**
   * Returns all Amazon QLDB journal streams for a given ledger. This action does not return any expired journal streams. For more information, see Expiration for terminal streams in the Amazon QLDB Developer Guide. This action returns a maximum of MaxResults items. It is paginated so that you can retrieve all the items by calling ListJournalKinesisStreamsForLedger multiple times.
   */
  listJournalKinesisStreamsForLedger(callback?: (err: AWSError, data: QLDB.Types.ListJournalKinesisStreamsForLedgerResponse) => void): Request<QLDB.Types.ListJournalKinesisStreamsForLedgerResponse, AWSError>;
  /**
   * Returns all journal export jobs for all ledgers that are associated with the current Amazon Web Services account and Region. This action returns a maximum of MaxResults items, and is paginated so that you can retrieve all the items by calling ListJournalS3Exports multiple times. This action does not return any expired export jobs. For more information, see Export job expiration in the Amazon QLDB Developer Guide.
   */
  listJournalS3Exports(params: QLDB.Types.ListJournalS3ExportsRequest, callback?: (err: AWSError, data: QLDB.Types.ListJournalS3ExportsResponse) => void): Request<QLDB.Types.ListJournalS3ExportsResponse, AWSError>;
  /**
   * Returns all journal export jobs for all ledgers that are associated with the current Amazon Web Services account and Region. This action returns a maximum of MaxResults items, and is paginated so that you can retrieve all the items by calling ListJournalS3Exports multiple times. This action does not return any expired export jobs. For more information, see Export job expiration in the Amazon QLDB Developer Guide.
   */
  listJournalS3Exports(callback?: (err: AWSError, data: QLDB.Types.ListJournalS3ExportsResponse) => void): Request<QLDB.Types.ListJournalS3ExportsResponse, AWSError>;
  /**
   * Returns all journal export jobs for a specified ledger. This action returns a maximum of MaxResults items, and is paginated so that you can retrieve all the items by calling ListJournalS3ExportsForLedger multiple times. This action does not return any expired export jobs. For more information, see Export job expiration in the Amazon QLDB Developer Guide.
   */
  listJournalS3ExportsForLedger(params: QLDB.Types.ListJournalS3ExportsForLedgerRequest, callback?: (err: AWSError, data: QLDB.Types.ListJournalS3ExportsForLedgerResponse) => void): Request<QLDB.Types.ListJournalS3ExportsForLedgerResponse, AWSError>;
  /**
   * Returns all journal export jobs for a specified ledger. This action returns a maximum of MaxResults items, and is paginated so that you can retrieve all the items by calling ListJournalS3ExportsForLedger multiple times. This action does not return any expired export jobs. For more information, see Export job expiration in the Amazon QLDB Developer Guide.
   */
  listJournalS3ExportsForLedger(callback?: (err: AWSError, data: QLDB.Types.ListJournalS3ExportsForLedgerResponse) => void): Request<QLDB.Types.ListJournalS3ExportsForLedgerResponse, AWSError>;
  /**
   * Returns all ledgers that are associated with the current Amazon Web Services account and Region. This action returns a maximum of MaxResults items and is paginated so that you can retrieve all the items by calling ListLedgers multiple times.
   */
  listLedgers(params: QLDB.Types.ListLedgersRequest, callback?: (err: AWSError, data: QLDB.Types.ListLedgersResponse) => void): Request<QLDB.Types.ListLedgersResponse, AWSError>;
  /**
   * Returns all ledgers that are associated with the current Amazon Web Services account and Region. This action returns a maximum of MaxResults items and is paginated so that you can retrieve all the items by calling ListLedgers multiple times.
   */
  listLedgers(callback?: (err: AWSError, data: QLDB.Types.ListLedgersResponse) => void): Request<QLDB.Types.ListLedgersResponse, AWSError>;
  /**
   * Returns all tags for a specified Amazon QLDB resource.
   */
  listTagsForResource(params: QLDB.Types.ListTagsForResourceRequest, callback?: (err: AWSError, data: QLDB.Types.ListTagsForResourceResponse) => void): Request<QLDB.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Returns all tags for a specified Amazon QLDB resource.
   */
  listTagsForResource(callback?: (err: AWSError, data: QLDB.Types.ListTagsForResourceResponse) => void): Request<QLDB.Types.ListTagsForResourceResponse, AWSError>;
  /**
   * Creates a journal stream for a given Amazon QLDB ledger. The stream captures every document revision that is committed to the ledger's journal and delivers the data to a specified Amazon Kinesis Data Streams resource.
   */
  streamJournalToKinesis(params: QLDB.Types.StreamJournalToKinesisRequest, callback?: (err: AWSError, data: QLDB.Types.StreamJournalToKinesisResponse) => void): Request<QLDB.Types.StreamJournalToKinesisResponse, AWSError>;
  /**
   * Creates a journal stream for a given Amazon QLDB ledger. The stream captures every document revision that is committed to the ledger's journal and delivers the data to a specified Amazon Kinesis Data Streams resource.
   */
  streamJournalToKinesis(callback?: (err: AWSError, data: QLDB.Types.StreamJournalToKinesisResponse) => void): Request<QLDB.Types.StreamJournalToKinesisResponse, AWSError>;
  /**
   * Adds one or more tags to a specified Amazon QLDB resource. A resource can have up to 50 tags. If you try to create more than 50 tags for a resource, your request fails and returns an error.
   */
  tagResource(params: QLDB.Types.TagResourceRequest, callback?: (err: AWSError, data: QLDB.Types.TagResourceResponse) => void): Request<QLDB.Types.TagResourceResponse, AWSError>;
  /**
   * Adds one or more tags to a specified Amazon QLDB resource. A resource can have up to 50 tags. If you try to create more than 50 tags for a resource, your request fails and returns an error.
   */
  tagResource(callback?: (err: AWSError, data: QLDB.Types.TagResourceResponse) => void): Request<QLDB.Types.TagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a specified Amazon QLDB resource. You can specify up to 50 tag keys to remove.
   */
  untagResource(params: QLDB.Types.UntagResourceRequest, callback?: (err: AWSError, data: QLDB.Types.UntagResourceResponse) => void): Request<QLDB.Types.UntagResourceResponse, AWSError>;
  /**
   * Removes one or more tags from a specified Amazon QLDB resource. You can specify up to 50 tag keys to remove.
   */
  untagResource(callback?: (err: AWSError, data: QLDB.Types.UntagResourceResponse) => void): Request<QLDB.Types.UntagResourceResponse, AWSError>;
  /**
   * Updates properties on a ledger.
   */
  updateLedger(params: QLDB.Types.UpdateLedgerRequest, callback?: (err: AWSError, data: QLDB.Types.UpdateLedgerResponse) => void): Request<QLDB.Types.UpdateLedgerResponse, AWSError>;
  /**
   * Updates properties on a ledger.
   */
  updateLedger(callback?: (err: AWSError, data: QLDB.Types.UpdateLedgerResponse) => void): Request<QLDB.Types.UpdateLedgerResponse, AWSError>;
  /**
   * Updates the permissions mode of a ledger.  Before you switch to the STANDARD permissions mode, you must first create all required IAM policies and table tags to avoid disruption to your users. To learn more, see Migrating to the standard permissions mode in the Amazon QLDB Developer Guide. 
   */
  updateLedgerPermissionsMode(params: QLDB.Types.UpdateLedgerPermissionsModeRequest, callback?: (err: AWSError, data: QLDB.Types.UpdateLedgerPermissionsModeResponse) => void): Request<QLDB.Types.UpdateLedgerPermissionsModeResponse, AWSError>;
  /**
   * Updates the permissions mode of a ledger.  Before you switch to the STANDARD permissions mode, you must first create all required IAM policies and table tags to avoid disruption to your users. To learn more, see Migrating to the standard permissions mode in the Amazon QLDB Developer Guide. 
   */
  updateLedgerPermissionsMode(callback?: (err: AWSError, data: QLDB.Types.UpdateLedgerPermissionsModeResponse) => void): Request<QLDB.Types.UpdateLedgerPermissionsModeResponse, AWSError>;
}
declare namespace QLDB {
  export type Arn = string;
  export type Boolean = boolean;
  export interface CancelJournalKinesisStreamRequest {
    /**
     * The name of the ledger.
     */
    LedgerName: LedgerName;
    /**
     * The UUID (represented in Base62-encoded text) of the QLDB journal stream to be canceled.
     */
    StreamId: UniqueId;
  }
  export interface CancelJournalKinesisStreamResponse {
    /**
     * The UUID (Base62-encoded text) of the canceled QLDB journal stream.
     */
    StreamId?: UniqueId;
  }
  export interface CreateLedgerRequest {
    /**
     * The name of the ledger that you want to create. The name must be unique among all of the ledgers in your Amazon Web Services account in the current Region. Naming constraints for ledger names are defined in Quotas in Amazon QLDB in the Amazon QLDB Developer Guide.
     */
    Name: LedgerName;
    /**
     * The key-value pairs to add as tags to the ledger that you want to create. Tag keys are case sensitive. Tag values are case sensitive and can be null.
     */
    Tags?: Tags;
    /**
     * The permissions mode to assign to the ledger that you want to create. This parameter can have one of the following values:    ALLOW_ALL: A legacy permissions mode that enables access control with API-level granularity for ledgers. This mode allows users who have the SendCommand API permission for this ledger to run all PartiQL commands (hence, ALLOW_ALL) on any tables in the specified ledger. This mode disregards any table-level or command-level IAM permissions policies that you create for the ledger.    STANDARD: (Recommended) A permissions mode that enables access control with finer granularity for ledgers, tables, and PartiQL commands. By default, this mode denies all user requests to run any PartiQL commands on any tables in this ledger. To allow PartiQL commands to run, you must create IAM permissions policies for specific table resources and PartiQL actions, in addition to the SendCommand API permission for the ledger. For information, see Getting started with the standard permissions mode in the Amazon QLDB Developer Guide.    We strongly recommend using the STANDARD permissions mode to maximize the security of your ledger data. 
     */
    PermissionsMode: PermissionsMode;
    /**
     * Specifies whether the ledger is protected from being deleted by any user. If not defined during ledger creation, this feature is enabled (true) by default. If deletion protection is enabled, you must first disable it before you can delete the ledger. You can disable it by calling the UpdateLedger operation to set this parameter to false.
     */
    DeletionProtection?: DeletionProtection;
    /**
     * The key in Key Management Service (KMS) to use for encryption of data at rest in the ledger. For more information, see Encryption at rest in the Amazon QLDB Developer Guide. Use one of the following options to specify this parameter:    AWS_OWNED_KMS_KEY: Use an KMS key that is owned and managed by Amazon Web Services on your behalf.    Undefined: By default, use an Amazon Web Services owned KMS key.    A valid symmetric customer managed KMS key: Use the specified symmetric encryption KMS key in your account that you create, own, and manage. Amazon QLDB does not support asymmetric keys. For more information, see Using symmetric and asymmetric keys in the Key Management Service Developer Guide.   To specify a customer managed KMS key, you can use its key ID, Amazon Resource Name (ARN), alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    For more information, see Key identifiers (KeyId) in the Key Management Service Developer Guide.
     */
    KmsKey?: KmsKey;
  }
  export interface CreateLedgerResponse {
    /**
     * The name of the ledger.
     */
    Name?: LedgerName;
    /**
     * The Amazon Resource Name (ARN) for the ledger.
     */
    Arn?: Arn;
    /**
     * The current status of the ledger.
     */
    State?: LedgerState;
    /**
     * The date and time, in epoch time format, when the ledger was created. (Epoch time format is the number of seconds elapsed since 12:00:00 AM January 1, 1970 UTC.)
     */
    CreationDateTime?: Timestamp;
    /**
     * The permissions mode of the ledger that you created.
     */
    PermissionsMode?: PermissionsMode;
    /**
     * Specifies whether the ledger is protected from being deleted by any user. If not defined during ledger creation, this feature is enabled (true) by default. If deletion protection is enabled, you must first disable it before you can delete the ledger. You can disable it by calling the UpdateLedger operation to set this parameter to false.
     */
    DeletionProtection?: DeletionProtection;
    /**
     * The ARN of the customer managed KMS key that the ledger uses for encryption at rest. If this parameter is undefined, the ledger uses an Amazon Web Services owned KMS key for encryption.
     */
    KmsKeyArn?: Arn;
  }
  export interface DeleteLedgerRequest {
    /**
     * The name of the ledger that you want to delete.
     */
    Name: LedgerName;
  }
  export type DeletionProtection = boolean;
  export interface DescribeJournalKinesisStreamRequest {
    /**
     * The name of the ledger.
     */
    LedgerName: LedgerName;
    /**
     * The UUID (represented in Base62-encoded text) of the QLDB journal stream to describe.
     */
    StreamId: UniqueId;
  }
  export interface DescribeJournalKinesisStreamResponse {
    /**
     * Information about the QLDB journal stream returned by a DescribeJournalS3Export request.
     */
    Stream?: JournalKinesisStreamDescription;
  }
  export interface DescribeJournalS3ExportRequest {
    /**
     * The name of the ledger.
     */
    Name: LedgerName;
    /**
     * The UUID (represented in Base62-encoded text) of the journal export job to describe.
     */
    ExportId: UniqueId;
  }
  export interface DescribeJournalS3ExportResponse {
    /**
     * Information about the journal export job returned by a DescribeJournalS3Export request.
     */
    ExportDescription: JournalS3ExportDescription;
  }
  export interface DescribeLedgerRequest {
    /**
     * The name of the ledger that you want to describe.
     */
    Name: LedgerName;
  }
  export interface DescribeLedgerResponse {
    /**
     * The name of the ledger.
     */
    Name?: LedgerName;
    /**
     * The Amazon Resource Name (ARN) for the ledger.
     */
    Arn?: Arn;
    /**
     * The current status of the ledger.
     */
    State?: LedgerState;
    /**
     * The date and time, in epoch time format, when the ledger was created. (Epoch time format is the number of seconds elapsed since 12:00:00 AM January 1, 1970 UTC.)
     */
    CreationDateTime?: Timestamp;
    /**
     * The permissions mode of the ledger.
     */
    PermissionsMode?: PermissionsMode;
    /**
     * Specifies whether the ledger is protected from being deleted by any user. If not defined during ledger creation, this feature is enabled (true) by default. If deletion protection is enabled, you must first disable it before you can delete the ledger. You can disable it by calling the UpdateLedger operation to set this parameter to false.
     */
    DeletionProtection?: DeletionProtection;
    /**
     * Information about the encryption of data at rest in the ledger. This includes the current status, the KMS key, and when the key became inaccessible (in the case of an error).
     */
    EncryptionDescription?: LedgerEncryptionDescription;
  }
  export type Digest = Buffer|Uint8Array|Blob|string;
  export type EncryptionStatus = "ENABLED"|"UPDATING"|"KMS_KEY_INACCESSIBLE"|string;
  export type ErrorCause = "KINESIS_STREAM_NOT_FOUND"|"IAM_PERMISSION_REVOKED"|string;
  export interface ExportJournalToS3Request {
    /**
     * The name of the ledger.
     */
    Name: LedgerName;
    /**
     * The inclusive start date and time for the range of journal contents to export. The InclusiveStartTime must be in ISO 8601 date and time format and in Universal Coordinated Time (UTC). For example: 2019-06-13T21:36:34Z. The InclusiveStartTime must be before ExclusiveEndTime. If you provide an InclusiveStartTime that is before the ledger's CreationDateTime, Amazon QLDB defaults it to the ledger's CreationDateTime.
     */
    InclusiveStartTime: Timestamp;
    /**
     * The exclusive end date and time for the range of journal contents to export. The ExclusiveEndTime must be in ISO 8601 date and time format and in Universal Coordinated Time (UTC). For example: 2019-06-13T21:36:34Z. The ExclusiveEndTime must be less than or equal to the current UTC date and time.
     */
    ExclusiveEndTime: Timestamp;
    /**
     * The configuration settings of the Amazon S3 bucket destination for your export request.
     */
    S3ExportConfiguration: S3ExportConfiguration;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants QLDB permissions for a journal export job to do the following:   Write objects into your Amazon S3 bucket.   (Optional) Use your customer managed key in Key Management Service (KMS) for server-side encryption of your exported data.   To pass a role to QLDB when requesting a journal export, you must have permissions to perform the iam:PassRole action on the IAM role resource. This is required for all journal export requests.
     */
    RoleArn: Arn;
    /**
     * The output format of your exported journal data. A journal export job can write the data objects in either the text or binary representation of Amazon Ion format, or in JSON Lines text format. Default: ION_TEXT  In JSON Lines format, each journal block in an exported data object is a valid JSON object that is delimited by a newline. You can use this format to directly integrate JSON exports with analytics tools such as Amazon Athena and Glue because these services can parse newline-delimited JSON automatically.
     */
    OutputFormat?: OutputFormat;
  }
  export interface ExportJournalToS3Response {
    /**
     * The UUID (represented in Base62-encoded text) that QLDB assigns to each journal export job. To describe your export request and check the status of the job, you can use ExportId to call DescribeJournalS3Export.
     */
    ExportId: UniqueId;
  }
  export type ExportStatus = "IN_PROGRESS"|"COMPLETED"|"CANCELLED"|string;
  export interface GetBlockRequest {
    /**
     * The name of the ledger.
     */
    Name: LedgerName;
    /**
     * The location of the block that you want to request. An address is an Amazon Ion structure that has two fields: strandId and sequenceNo. For example: {strandId:"BlFTjlSXze9BIh1KOszcE3",sequenceNo:14}.
     */
    BlockAddress: ValueHolder;
    /**
     * The latest block location covered by the digest for which to request a proof. An address is an Amazon Ion structure that has two fields: strandId and sequenceNo. For example: {strandId:"BlFTjlSXze9BIh1KOszcE3",sequenceNo:49}.
     */
    DigestTipAddress?: ValueHolder;
  }
  export interface GetBlockResponse {
    /**
     * The block data object in Amazon Ion format.
     */
    Block: ValueHolder;
    /**
     * The proof object in Amazon Ion format returned by a GetBlock request. A proof contains the list of hash values required to recalculate the specified digest using a Merkle tree, starting with the specified block.
     */
    Proof?: ValueHolder;
  }
  export interface GetDigestRequest {
    /**
     * The name of the ledger.
     */
    Name: LedgerName;
  }
  export interface GetDigestResponse {
    /**
     * The 256-bit hash value representing the digest returned by a GetDigest request.
     */
    Digest: Digest;
    /**
     * The latest block location covered by the digest that you requested. An address is an Amazon Ion structure that has two fields: strandId and sequenceNo.
     */
    DigestTipAddress: ValueHolder;
  }
  export interface GetRevisionRequest {
    /**
     * The name of the ledger.
     */
    Name: LedgerName;
    /**
     * The block location of the document revision to be verified. An address is an Amazon Ion structure that has two fields: strandId and sequenceNo. For example: {strandId:"BlFTjlSXze9BIh1KOszcE3",sequenceNo:14}.
     */
    BlockAddress: ValueHolder;
    /**
     * The UUID (represented in Base62-encoded text) of the document to be verified.
     */
    DocumentId: UniqueId;
    /**
     * The latest block location covered by the digest for which to request a proof. An address is an Amazon Ion structure that has two fields: strandId and sequenceNo. For example: {strandId:"BlFTjlSXze9BIh1KOszcE3",sequenceNo:49}.
     */
    DigestTipAddress?: ValueHolder;
  }
  export interface GetRevisionResponse {
    /**
     * The proof object in Amazon Ion format returned by a GetRevision request. A proof contains the list of hash values that are required to recalculate the specified digest using a Merkle tree, starting with the specified document revision.
     */
    Proof?: ValueHolder;
    /**
     * The document revision data object in Amazon Ion format.
     */
    Revision: ValueHolder;
  }
  export type IonText = string;
  export interface JournalKinesisStreamDescription {
    /**
     * The name of the ledger.
     */
    LedgerName: LedgerName;
    /**
     * The date and time, in epoch time format, when the QLDB journal stream was created. (Epoch time format is the number of seconds elapsed since 12:00:00 AM January 1, 1970 UTC.)
     */
    CreationTime?: Timestamp;
    /**
     * The inclusive start date and time from which to start streaming journal data.
     */
    InclusiveStartTime?: Timestamp;
    /**
     * The exclusive date and time that specifies when the stream ends. If this parameter is undefined, the stream runs indefinitely until you cancel it.
     */
    ExclusiveEndTime?: Timestamp;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants QLDB permissions for a journal stream to write data records to a Kinesis Data Streams resource.
     */
    RoleArn: Arn;
    /**
     * The UUID (represented in Base62-encoded text) of the QLDB journal stream.
     */
    StreamId: UniqueId;
    /**
     * The Amazon Resource Name (ARN) of the QLDB journal stream.
     */
    Arn?: Arn;
    /**
     * The current state of the QLDB journal stream.
     */
    Status: StreamStatus;
    /**
     * The configuration settings of the Amazon Kinesis Data Streams destination for a QLDB journal stream.
     */
    KinesisConfiguration: KinesisConfiguration;
    /**
     * The error message that describes the reason that a stream has a status of IMPAIRED or FAILED. This is not applicable to streams that have other status values.
     */
    ErrorCause?: ErrorCause;
    /**
     * The user-defined name of the QLDB journal stream.
     */
    StreamName: StreamName;
  }
  export type JournalKinesisStreamDescriptionList = JournalKinesisStreamDescription[];
  export interface JournalS3ExportDescription {
    /**
     * The name of the ledger.
     */
    LedgerName: LedgerName;
    /**
     * The UUID (represented in Base62-encoded text) of the journal export job.
     */
    ExportId: UniqueId;
    /**
     * The date and time, in epoch time format, when the export job was created. (Epoch time format is the number of seconds elapsed since 12:00:00 AM January 1, 1970 UTC.)
     */
    ExportCreationTime: Timestamp;
    /**
     * The current state of the journal export job.
     */
    Status: ExportStatus;
    /**
     * The inclusive start date and time for the range of journal contents that was specified in the original export request.
     */
    InclusiveStartTime: Timestamp;
    /**
     * The exclusive end date and time for the range of journal contents that was specified in the original export request.
     */
    ExclusiveEndTime: Timestamp;
    S3ExportConfiguration: S3ExportConfiguration;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants QLDB permissions for a journal export job to do the following:   Write objects into your Amazon Simple Storage Service (Amazon S3) bucket.   (Optional) Use your customer managed key in Key Management Service (KMS) for server-side encryption of your exported data.  
     */
    RoleArn: Arn;
    /**
     * The output format of the exported journal data.
     */
    OutputFormat?: OutputFormat;
  }
  export type JournalS3ExportList = JournalS3ExportDescription[];
  export interface KinesisConfiguration {
    /**
     * The Amazon Resource Name (ARN) of the Kinesis Data Streams resource.
     */
    StreamArn: Arn;
    /**
     * Enables QLDB to publish multiple data records in a single Kinesis Data Streams record, increasing the number of records sent per API call. Default: True   Record aggregation has important implications for processing records and requires de-aggregation in your stream consumer. To learn more, see KPL Key Concepts and Consumer De-aggregation in the Amazon Kinesis Data Streams Developer Guide. 
     */
    AggregationEnabled?: Boolean;
  }
  export type KmsKey = string;
  export interface LedgerEncryptionDescription {
    /**
     * The Amazon Resource Name (ARN) of the customer managed KMS key that the ledger uses for encryption at rest. If this parameter is undefined, the ledger uses an Amazon Web Services owned KMS key for encryption.
     */
    KmsKeyArn: Arn;
    /**
     * The current state of encryption at rest for the ledger. This can be one of the following values:    ENABLED: Encryption is fully enabled using the specified key.    UPDATING: The ledger is actively processing the specified key change. Key changes in QLDB are asynchronous. The ledger is fully accessible without any performance impact while the key change is being processed. The amount of time it takes to update a key varies depending on the ledger size.    KMS_KEY_INACCESSIBLE: The specified customer managed KMS key is not accessible, and the ledger is impaired. Either the key was disabled or deleted, or the grants on the key were revoked. When a ledger is impaired, it is not accessible and does not accept any read or write requests. An impaired ledger automatically returns to an active state after you restore the grants on the key, or re-enable the key that was disabled. However, deleting a customer managed KMS key is irreversible. After a key is deleted, you can no longer access the ledgers that are protected with that key, and the data becomes unrecoverable permanently.  
     */
    EncryptionStatus: EncryptionStatus;
    /**
     * The date and time, in epoch time format, when the KMS key first became inaccessible, in the case of an error. (Epoch time format is the number of seconds that have elapsed since 12:00:00 AM January 1, 1970 UTC.) This parameter is undefined if the KMS key is accessible.
     */
    InaccessibleKmsKeyDateTime?: Timestamp;
  }
  export type LedgerList = LedgerSummary[];
  export type LedgerName = string;
  export type LedgerState = "CREATING"|"ACTIVE"|"DELETING"|"DELETED"|string;
  export interface LedgerSummary {
    /**
     * The name of the ledger.
     */
    Name?: LedgerName;
    /**
     * The current status of the ledger.
     */
    State?: LedgerState;
    /**
     * The date and time, in epoch time format, when the ledger was created. (Epoch time format is the number of seconds elapsed since 12:00:00 AM January 1, 1970 UTC.)
     */
    CreationDateTime?: Timestamp;
  }
  export interface ListJournalKinesisStreamsForLedgerRequest {
    /**
     * The name of the ledger.
     */
    LedgerName: LedgerName;
    /**
     * The maximum number of results to return in a single ListJournalKinesisStreamsForLedger request. (The actual number of results returned might be fewer.)
     */
    MaxResults?: MaxResults;
    /**
     * A pagination token, indicating that you want to retrieve the next page of results. If you received a value for NextToken in the response from a previous ListJournalKinesisStreamsForLedger call, you should use that value as input here.
     */
    NextToken?: NextToken;
  }
  export interface ListJournalKinesisStreamsForLedgerResponse {
    /**
     * The QLDB journal streams that are currently associated with the given ledger.
     */
    Streams?: JournalKinesisStreamDescriptionList;
    /**
     *   If NextToken is empty, the last page of results has been processed and there are no more results to be retrieved.   If NextToken is not empty, more results are available. To retrieve the next page of results, use the value of NextToken in a subsequent ListJournalKinesisStreamsForLedger call.  
     */
    NextToken?: NextToken;
  }
  export interface ListJournalS3ExportsForLedgerRequest {
    /**
     * The name of the ledger.
     */
    Name: LedgerName;
    /**
     * The maximum number of results to return in a single ListJournalS3ExportsForLedger request. (The actual number of results returned might be fewer.)
     */
    MaxResults?: MaxResults;
    /**
     * A pagination token, indicating that you want to retrieve the next page of results. If you received a value for NextToken in the response from a previous ListJournalS3ExportsForLedger call, then you should use that value as input here.
     */
    NextToken?: NextToken;
  }
  export interface ListJournalS3ExportsForLedgerResponse {
    /**
     * The journal export jobs that are currently associated with the specified ledger.
     */
    JournalS3Exports?: JournalS3ExportList;
    /**
     *   If NextToken is empty, then the last page of results has been processed and there are no more results to be retrieved.   If NextToken is not empty, then there are more results available. To retrieve the next page of results, use the value of NextToken in a subsequent ListJournalS3ExportsForLedger call.  
     */
    NextToken?: NextToken;
  }
  export interface ListJournalS3ExportsRequest {
    /**
     * The maximum number of results to return in a single ListJournalS3Exports request. (The actual number of results returned might be fewer.)
     */
    MaxResults?: MaxResults;
    /**
     * A pagination token, indicating that you want to retrieve the next page of results. If you received a value for NextToken in the response from a previous ListJournalS3Exports call, then you should use that value as input here.
     */
    NextToken?: NextToken;
  }
  export interface ListJournalS3ExportsResponse {
    /**
     * The journal export jobs for all ledgers that are associated with the current Amazon Web Services account and Region.
     */
    JournalS3Exports?: JournalS3ExportList;
    /**
     *   If NextToken is empty, then the last page of results has been processed and there are no more results to be retrieved.   If NextToken is not empty, then there are more results available. To retrieve the next page of results, use the value of NextToken in a subsequent ListJournalS3Exports call.  
     */
    NextToken?: NextToken;
  }
  export interface ListLedgersRequest {
    /**
     * The maximum number of results to return in a single ListLedgers request. (The actual number of results returned might be fewer.)
     */
    MaxResults?: MaxResults;
    /**
     * A pagination token, indicating that you want to retrieve the next page of results. If you received a value for NextToken in the response from a previous ListLedgers call, then you should use that value as input here.
     */
    NextToken?: NextToken;
  }
  export interface ListLedgersResponse {
    /**
     * The ledgers that are associated with the current Amazon Web Services account and Region.
     */
    Ledgers?: LedgerList;
    /**
     * A pagination token, indicating whether there are more results available:   If NextToken is empty, then the last page of results has been processed and there are no more results to be retrieved.   If NextToken is not empty, then there are more results available. To retrieve the next page of results, use the value of NextToken in a subsequent ListLedgers call.  
     */
    NextToken?: NextToken;
  }
  export interface ListTagsForResourceRequest {
    /**
     * The Amazon Resource Name (ARN) for which to list the tags. For example:  arn:aws:qldb:us-east-1:123456789012:ledger/exampleLedger 
     */
    ResourceArn: Arn;
  }
  export interface ListTagsForResourceResponse {
    /**
     * The tags that are currently associated with the specified Amazon QLDB resource.
     */
    Tags?: Tags;
  }
  export type MaxResults = number;
  export type NextToken = string;
  export type OutputFormat = "ION_BINARY"|"ION_TEXT"|"JSON"|string;
  export type PermissionsMode = "ALLOW_ALL"|"STANDARD"|string;
  export type S3Bucket = string;
  export interface S3EncryptionConfiguration {
    /**
     * The Amazon S3 object encryption type. To learn more about server-side encryption options in Amazon S3, see Protecting Data Using Server-Side Encryption in the Amazon S3 Developer Guide.
     */
    ObjectEncryptionType: S3ObjectEncryptionType;
    /**
     * The Amazon Resource Name (ARN) of a symmetric encryption key in Key Management Service (KMS). Amazon S3 does not support asymmetric KMS keys. You must provide a KmsKeyArn if you specify SSE_KMS as the ObjectEncryptionType.  KmsKeyArn is not required if you specify SSE_S3 as the ObjectEncryptionType.
     */
    KmsKeyArn?: Arn;
  }
  export interface S3ExportConfiguration {
    /**
     * The Amazon S3 bucket name in which a journal export job writes the journal contents. The bucket name must comply with the Amazon S3 bucket naming conventions. For more information, see Bucket Restrictions and Limitations in the Amazon S3 Developer Guide.
     */
    Bucket: S3Bucket;
    /**
     * The prefix for the Amazon S3 bucket in which a journal export job writes the journal contents. The prefix must comply with Amazon S3 key naming rules and restrictions. For more information, see Object Key and Metadata in the Amazon S3 Developer Guide. The following are examples of valid Prefix values:    JournalExports-ForMyLedger/Testing/     JournalExports     My:Tests/   
     */
    Prefix: S3Prefix;
    /**
     * The encryption settings that are used by a journal export job to write data in an Amazon S3 bucket.
     */
    EncryptionConfiguration: S3EncryptionConfiguration;
  }
  export type S3ObjectEncryptionType = "SSE_KMS"|"SSE_S3"|"NO_ENCRYPTION"|string;
  export type S3Prefix = string;
  export interface StreamJournalToKinesisRequest {
    /**
     * The name of the ledger.
     */
    LedgerName: LedgerName;
    /**
     * The Amazon Resource Name (ARN) of the IAM role that grants QLDB permissions for a journal stream to write data records to a Kinesis Data Streams resource. To pass a role to QLDB when requesting a journal stream, you must have permissions to perform the iam:PassRole action on the IAM role resource. This is required for all journal stream requests.
     */
    RoleArn: Arn;
    /**
     * The key-value pairs to add as tags to the stream that you want to create. Tag keys are case sensitive. Tag values are case sensitive and can be null.
     */
    Tags?: Tags;
    /**
     * The inclusive start date and time from which to start streaming journal data. This parameter must be in ISO 8601 date and time format and in Universal Coordinated Time (UTC). For example: 2019-06-13T21:36:34Z. The InclusiveStartTime cannot be in the future and must be before ExclusiveEndTime. If you provide an InclusiveStartTime that is before the ledger's CreationDateTime, QLDB effectively defaults it to the ledger's CreationDateTime.
     */
    InclusiveStartTime: Timestamp;
    /**
     * The exclusive date and time that specifies when the stream ends. If you don't define this parameter, the stream runs indefinitely until you cancel it. The ExclusiveEndTime must be in ISO 8601 date and time format and in Universal Coordinated Time (UTC). For example: 2019-06-13T21:36:34Z.
     */
    ExclusiveEndTime?: Timestamp;
    /**
     * The configuration settings of the Kinesis Data Streams destination for your stream request.
     */
    KinesisConfiguration: KinesisConfiguration;
    /**
     * The name that you want to assign to the QLDB journal stream. User-defined names can help identify and indicate the purpose of a stream. Your stream name must be unique among other active streams for a given ledger. Stream names have the same naming constraints as ledger names, as defined in Quotas in Amazon QLDB in the Amazon QLDB Developer Guide.
     */
    StreamName: StreamName;
  }
  export interface StreamJournalToKinesisResponse {
    /**
     * The UUID (represented in Base62-encoded text) that QLDB assigns to each QLDB journal stream.
     */
    StreamId?: UniqueId;
  }
  export type StreamName = string;
  export type StreamStatus = "ACTIVE"|"COMPLETED"|"CANCELED"|"FAILED"|"IMPAIRED"|string;
  export type TagKey = string;
  export type TagKeyList = TagKey[];
  export interface TagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) to which you want to add the tags. For example:  arn:aws:qldb:us-east-1:123456789012:ledger/exampleLedger 
     */
    ResourceArn: Arn;
    /**
     * The key-value pairs to add as tags to the specified QLDB resource. Tag keys are case sensitive. If you specify a key that already exists for the resource, your request fails and returns an error. Tag values are case sensitive and can be null.
     */
    Tags: Tags;
  }
  export interface TagResourceResponse {
  }
  export type TagValue = string;
  export type Tags = {[key: string]: TagValue};
  export type Timestamp = Date;
  export type UniqueId = string;
  export interface UntagResourceRequest {
    /**
     * The Amazon Resource Name (ARN) from which to remove the tags. For example:  arn:aws:qldb:us-east-1:123456789012:ledger/exampleLedger 
     */
    ResourceArn: Arn;
    /**
     * The list of tag keys to remove.
     */
    TagKeys: TagKeyList;
  }
  export interface UntagResourceResponse {
  }
  export interface UpdateLedgerPermissionsModeRequest {
    /**
     * The name of the ledger.
     */
    Name: LedgerName;
    /**
     * The permissions mode to assign to the ledger. This parameter can have one of the following values:    ALLOW_ALL: A legacy permissions mode that enables access control with API-level granularity for ledgers. This mode allows users who have the SendCommand API permission for this ledger to run all PartiQL commands (hence, ALLOW_ALL) on any tables in the specified ledger. This mode disregards any table-level or command-level IAM permissions policies that you create for the ledger.    STANDARD: (Recommended) A permissions mode that enables access control with finer granularity for ledgers, tables, and PartiQL commands. By default, this mode denies all user requests to run any PartiQL commands on any tables in this ledger. To allow PartiQL commands to run, you must create IAM permissions policies for specific table resources and PartiQL actions, in addition to the SendCommand API permission for the ledger. For information, see Getting started with the standard permissions mode in the Amazon QLDB Developer Guide.    We strongly recommend using the STANDARD permissions mode to maximize the security of your ledger data. 
     */
    PermissionsMode: PermissionsMode;
  }
  export interface UpdateLedgerPermissionsModeResponse {
    /**
     * The name of the ledger.
     */
    Name?: LedgerName;
    /**
     * The Amazon Resource Name (ARN) for the ledger.
     */
    Arn?: Arn;
    /**
     * The current permissions mode of the ledger.
     */
    PermissionsMode?: PermissionsMode;
  }
  export interface UpdateLedgerRequest {
    /**
     * The name of the ledger.
     */
    Name: LedgerName;
    /**
     * Specifies whether the ledger is protected from being deleted by any user. If not defined during ledger creation, this feature is enabled (true) by default. If deletion protection is enabled, you must first disable it before you can delete the ledger. You can disable it by calling the UpdateLedger operation to set this parameter to false.
     */
    DeletionProtection?: DeletionProtection;
    /**
     * The key in Key Management Service (KMS) to use for encryption of data at rest in the ledger. For more information, see Encryption at rest in the Amazon QLDB Developer Guide. Use one of the following options to specify this parameter:    AWS_OWNED_KMS_KEY: Use an KMS key that is owned and managed by Amazon Web Services on your behalf.    Undefined: Make no changes to the KMS key of the ledger.    A valid symmetric customer managed KMS key: Use the specified symmetric encryption KMS key in your account that you create, own, and manage. Amazon QLDB does not support asymmetric keys. For more information, see Using symmetric and asymmetric keys in the Key Management Service Developer Guide.   To specify a customer managed KMS key, you can use its key ID, Amazon Resource Name (ARN), alias name, or alias ARN. When using an alias name, prefix it with "alias/". To specify a key in a different Amazon Web Services account, you must use the key ARN or alias ARN. For example:   Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab    Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab    Alias name: alias/ExampleAlias    Alias ARN: arn:aws:kms:us-east-2:111122223333:alias/ExampleAlias    For more information, see Key identifiers (KeyId) in the Key Management Service Developer Guide.
     */
    KmsKey?: KmsKey;
  }
  export interface UpdateLedgerResponse {
    /**
     * The name of the ledger.
     */
    Name?: LedgerName;
    /**
     * The Amazon Resource Name (ARN) for the ledger.
     */
    Arn?: Arn;
    /**
     * The current status of the ledger.
     */
    State?: LedgerState;
    /**
     * The date and time, in epoch time format, when the ledger was created. (Epoch time format is the number of seconds elapsed since 12:00:00 AM January 1, 1970 UTC.)
     */
    CreationDateTime?: Timestamp;
    /**
     * Specifies whether the ledger is protected from being deleted by any user. If not defined during ledger creation, this feature is enabled (true) by default. If deletion protection is enabled, you must first disable it before you can delete the ledger. You can disable it by calling the UpdateLedger operation to set this parameter to false.
     */
    DeletionProtection?: DeletionProtection;
    /**
     * Information about the encryption of data at rest in the ledger. This includes the current status, the KMS key, and when the key became inaccessible (in the case of an error).
     */
    EncryptionDescription?: LedgerEncryptionDescription;
  }
  export interface ValueHolder {
    /**
     * An Amazon Ion plaintext value contained in a ValueHolder structure.
     */
    IonText?: IonText;
  }
  /**
   * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
   */
  export type apiVersion = "2019-01-02"|"latest"|string;
  export interface ClientApiVersions {
    /**
     * A string in YYYY-MM-DD format that represents the latest possible API version that can be used in this service. Specify 'latest' to use the latest possible version.
     */
    apiVersion?: apiVersion;
  }
  export type ClientConfiguration = ServiceConfigurationOptions & ClientApiVersions;
  /**
   * Contains interfaces for use with the QLDB client.
   */
  export import Types = QLDB;
}
export = QLDB;
